---
title: "pi-mono Deep Dive 10: Remote Session — Client/Server, JSON-RPC 2.0, WebSocket, Reconnection"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, remote-session, json-rpc, websocket, reconnection, rpc-mode]
lang: en
series:
  name: "pi-mono Deep Dive"
  order: 10
tldr: "pi-protocol JSON-RPC 2.0 Definition, pi-client Connection Management & Exponential Backoff Reconnection, pi-server Session Registry, WebSocket Transport, Heartbeat Mechanism, Session Snapshot, Remote Session Handle, RPC Mode Architecture, Streaming Event Transport, Remote Steering/Follow-up Message Interjection."
description: "Deep dive into pi-mono Remote Session System: pi-protocol Defines JSON-RPC 2.0 Message Structure, pi-client Manages WebSocket Connection with Auto-Reconnect, pi-server Maintains Session Registry with Auth Middleware, Heartbeat Liveness Detection, Exponential Backoff Reconnection Strategy, Session Snapshot for Checkpoint/Resume, RemoteSessionHandle Proxies Local SessionManager, RPC Mode Transports Agent Loop Event Stream via JSON-RPC, Remote Steering/Follow-up Message Interjection Mechanism. For Engineers Researching Distributed Agent Architecture and WebSocket Real-time Communication."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-31-pi-mono-deep-dive-remote-session)

## TL;DR

- **pi-protocol**: JSON-RPC 2.0 Message Structure, Client/Server Message Types, WebSocket Frame
- **pi-client**: Connection Management, Exponential Backoff Reconnection, EventStream Proxy, RemoteSessionHandle
- **pi-server**: Server Class, Session Registry, Auth Middleware, Protocol Handler
- **Heartbeat**: Ping/Pong Interval, Timeout Detection, Auto-Reconnect
- **Session Snapshot**: Checkpoint Storage, Resume Capability
- **RPC Mode**: `pi --rpc`, JSON-RPC over stdin/stdout, IDE Integration

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Remote Session Architecture               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐         WebSocket          ┌──────────────┐   │
│  │   Client     │ ◄────────────────────────► │   Server     │   │
│  │  (pi --rpc)  │         JSON-RPC 2.0       │  (pi server) │   │
│  └──────────────┘                            └──────────────┘   │
│        │                                           │            │
│        ▼                                           ▼            │
│  ┌──────────────┐                            ┌──────────────┐   │
│  │ RemoteSession│                            │ SessionManager│  │
│  │   Handle     │                            │  (Local)      │   │
│  └──────────────┘                            └──────────────┘   │
│        │                                           │            │
│        ▼                                           ▼            │
│  EventStream<AgentEvent>                    AgentLoop()        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## pi-protocol: JSON-RPC 2.0 Definition

### Message Structure

```typescript
// packages/protocol/src/protocol.ts
export interface JSONRPCRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: unknown;
}

export interface JSONRPCResponse {
  jsonrpc: "2.0";
  id: string | number;
  result?: unknown;
  error?: JSONRPCError;
}

export interface JSONRPCNotification {
  jsonrpc: "2.0";
  method: string;
  params?: unknown;
}

export interface JSONRPCError {
  code: number;
  message: string;
  data?: unknown;
}

// Standard Error Codes
export const JSONRPC_ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  // Custom Error Codes
  SESSION_NOT_FOUND: -32000,
  AUTH_FAILED: -32001,
  MODEL_NOT_AVAILABLE: -32002,
};
```

### Client → Server Methods

```typescript
export type ClientMethod =
  | "session.create"      // Create New Session
  | "session.resume"      // Resume Existing Session
  | "session.close"       // Close Session
  | "prompt"              // Send Prompt
  | "steering"            // Steering Message
  | "followup"            // Follow-up Message
  | "interrupt"           // Interrupt
  | "model.switch"        // Switch Model
  | "tool.approve"        // Approve Tool
  | "tool.reject"         // Reject Tool
  | "settings.get"        // Get Settings
  | "settings.set"        // Set Setting
  | "ping";               // Heartbeat
```

### Server → Client Notifications

```typescript
export type ServerNotification =
  | "session.created"       // Session Created
  | "session.closed"        // Session Closed
  | "event"                 // AgentEvent Forward
  | "model.changed"         // Model Switched
  | "settings.changed"      // Settings Changed
  | "error"                 // Error Notification
  | "pong";                 // Heartbeat Response
```

### Complete Message Types

```typescript
export type ProtocolMessage =
  | JSONRPCRequest
  | JSONRPCResponse
  | JSONRPCNotification
  | { type: "client"; message: ClientMessage }
  | { type: "server"; message: ServerMessage };

export interface ClientMessage {
  type: ClientMethod;
  payload: unknown;
  requestId: string;
}

export interface ServerMessage {
  type: ServerNotification;
  payload: unknown;
}
```

---

## pi-client: Connection Management & Reconnection

### Client Class

```typescript
// packages/client/src/client.ts
export class Client {
  private connection: Connection;
  private sessions: Map<string, RemoteSession> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000;  // Initial 1s

  constructor(private url: string, private options: ClientOptions = {}) {}

  async connect(): Promise<void> {
    this.connection = new Connection(this.url, {
      onOpen: () => this.onOpen(),
      onMessage: (msg) => this.onMessage(msg),
      onClose: (code, reason) => this.onClose(code, reason),
      onError: (err) => this.onError(err),
    });
    await this.connection.open();
  }

  // Create Remote Session
  async createSession(config: CreateSessionConfig): Promise<RemoteSession> {
    const response = await this.sendRequest("session.create", config);
    const session = new RemoteSession(response.sessionId, this);
    this.sessions.set(response.sessionId, session);
    return session;
  }

  // Resume Session
  async resumeSession(sessionId: string): Promise<RemoteSession> {
    const response = await this.sendRequest("session.resume", { sessionId });
    const session = new RemoteSession(sessionId, this);
    this.sessions.set(sessionId, session);
    return session;
  }

  // Send Request (with Retry)
  private async sendRequest(method: string, params: unknown): Promise<unknown> {
    const requestId = uuidv7();
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Request timeout")), 30000);
      
      this.pendingRequests.set(requestId, { resolve, reject, timeout });
      this.connection.send({ jsonrpc: "2.0", id: requestId, method, params });
    });
  }

  // Handle Response
  private onMessage(message: ProtocolMessage): void {
    if ("id" in message && message.id !== undefined) {
      // Request Response
      const pending = this.pendingRequests.get(message.id);
      if (pending) {
        clearTimeout(pending.timeout);
        this.pendingRequests.delete(message.id);
        if ("error" in message) {
          pending.reject(new Error(message.error.message));
        } else {
          pending.resolve(message.result);
        }
      }
    } else if ("method" in message) {
      // Notification
      this.handleNotification(message);
    }
  }
}
```

### Connection: WebSocket Wrapper

```typescript
// packages/client/src/connection.ts
export class Connection {
  private ws: WebSocket | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private readonly HEARTBEAT_INTERVAL = 30000;  // 30s
  private readonly HEARTBEAT_TIMEOUT = 10000;   // 10s

  constructor(
    private url: string,
    private handlers: {
      onOpen: () => void;
      onMessage: (msg: ProtocolMessage) => void;
      onClose: (code: number, reason: string) => void;
      onError: (err: Error) => void;
    }
  ) {}

  async open(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);
      this.ws.binaryType = "arraybuffer";

      this.ws.onopen = () => {
        this.startHeartbeat();
        this.handlers.onOpen();
        resolve();
      };

      this.ws.onmessage = (event) => {
        const message = this.parseMessage(event.data);
        this.handlers.onMessage(message);
      };

      this.ws.onclose = (event) => {
        this.stopHeartbeat();
        this.handlers.onClose(event.code, event.reason);
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        this.handlers.onError(err);
      };
    });
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.send({ jsonrpc: "2.0", method: "ping", params: {}, id: uuidv7() });
      
      // Wait for Pong Timeout
      setTimeout(() => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.close(4000, "Heartbeat timeout");
        }
      }, this.HEARTBEAT_TIMEOUT);
    }, this.HEARTBEAT_INTERVAL);
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.handlers.onError(new Error("Max reconnect attempts reached"));
      return;
    }

    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts),
      30000  // Max 30s
    ) + Math.random() * 1000;  // Jitter

    this.reconnectAttempts++;
    setTimeout(() => this.open(), delay);
  }

  send(message: ProtocolMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private parseMessage(data: ArrayBuffer | string): ProtocolMessage {
    const text = typeof data === "string" ? data : new TextDecoder().decode(data);
    return JSON.parse(text);
  }
}
```

---

## pi-server: Session Registry & Auth

### Server Class

```typescript
// packages/server/src/server.ts
export class Server {
  private sessions: Map<string, ServerSession> = new Map();
  private wss: WebSocketServer;

  constructor(private options: ServerOptions) {
    this.wss = new WebSocketServer({ port: options.port });
    this.wss.on("connection", (ws, req) => this.handleConnection(ws, req));
  }

  private async handleConnection(ws: WebSocket, req: IncomingMessage): Promise<void> {
    // 1. Authenticate (Optional: API Key, Token, Cookie)
    const auth = await this.authenticate(req);
    if (!auth) {
      ws.close(4001, "Unauthorized");
      return;
    }

    const connection = new ServerConnection(ws, auth.userId);
    
    // 2. Handle Messages
    ws.on("message", (data) => this.handleMessage(connection, data));
    ws.on("close", () => this.handleClose(connection));
  }

  private async handleMessage(connection: ServerConnection, data: Buffer): Promise<void> {
    const message = JSON.parse(data.toString());
    
    if ("method" in message) {
      // Request
      const response = await this.dispatchRequest(connection, message);
      connection.send(response);
    } else {
      // Notification (Client Shouldn't Send)
    }
  }

  private async dispatchRequest(
    connection: ServerConnection,
    request: JSONRPCRequest
  ): Promise<JSONRPCResponse> {
    try {
      switch (request.method) {
        case "session.create":
          return await this.createSession(connection, request.params);
        case "session.resume":
          return await this.resumeSession(connection, request.params);
        case "session.close":
          return await this.closeSession(connection, request.params);
        case "prompt":
          return await this.handlePrompt(connection, request.params);
        case "steering":
          return await this.handleSteering(connection, request.params);
        case "followup":
          return await this.handleFollowup(connection, request.params);
        case "interrupt":
          return await this.handleInterrupt(connection, request.params);
        case "model.switch":
          return await this.handleModelSwitch(connection, request.params);
        case "settings.get":
          return await this.handleSettingsGet(connection, request.params);
        case "settings.set":
          return await this.handleSettingsSet(connection, request.params);
        case "ping":
          return { jsonrpc: "2.0", id: request.id, result: { pong: true } };
        default:
          return { jsonrpc: "2.0", id: request.id, error: { code: -32601, message: "Method not found" } };
      }
    } catch (error) {
      return { jsonrpc: "2.0", id: request.id, error: { code: -32603, message: error.message } };
    }
  }

  private async createSession(connection: ServerConnection, params: any): Promise<JSONRPCResponse> {
    const sessionManager = SessionManager.create(params.cwd, params.sessionDir);
    const sessionId = sessionManager.getSessionId();
    
    const serverSession = new ServerSession(sessionId, sessionManager, connection);
    this.sessions.set(sessionId, serverSession);
    
    // Start Agent Loop
    serverSession.startAgentLoop();
    
    return { jsonrpc: "2.0", id: request.id, result: { sessionId } };
  }
}
```

### ServerSession: Proxying Local SessionManager

```typescript
// packages/server/src/sessions.ts
export class ServerSession {
  private agentLoopStream: EventStream<AgentEvent, AgentMessage[]> | null = null;
  private pendingSteering: AgentMessage[] = [];
  private pendingFollowup: AgentMessage[] = [];

  constructor(
    public readonly sessionId: string,
    private sessionManager: SessionManager,
    private connection: ServerConnection
  ) {}

  startAgentLoop(): void {
    // Build LoopConfig with Remote Callbacks
    const config: AgentLoopConfig = {
      model: this.modelConfig,
      tools: this.getTools(),
      systemPrompt: this.buildSystemPrompt(),
      convertToLlm: this.convertToLlm.bind(this),
      getSteeringMessages: () => {
        const msgs = this.pendingSteering;
        this.pendingSteering = [];
        return msgs;
      },
      getFollowUpMessages: () => {
        const msgs = this.pendingFollowup;
        this.pendingFollowup = [];
        return msgs;
      },
      // ... Other Config
    };

    this.agentLoopStream = agentLoop([], this.sessionManager.buildSessionContext(), config, undefined, this.streamFunction);
    
    // Forward Events to Client
    this.forwardEvents();
  }

  private async forwardEvents(): Promise<void> {
    for await (const event of this.agentLoopStream!) {
      this.connection.send({
        jsonrpc: "2.0",
        method: "event",
        params: event,
      });
    }
  }

  // Receive Remote Steering
  receiveSteering(message: AgentMessage): void {
    this.pendingSteering.push(message);
  }

  // Receive Remote Follow-up
  receiveFollowup(message: AgentMessage): void {
    this.pendingFollowup.push(message);
  }

  // Receive Interrupt
  receiveInterrupt(): void {
    this.agentLoopStream?.abort?.();
  }
}
```

---

## Remote Steering / Follow-up Mechanism

### Client Side Sending

```typescript
// packages/client/src/remote-session.ts
export class RemoteSession {
  // Steering (Enter)
  async sendSteering(message: AgentMessage): Promise<void> {
    await this.client.sendRequest("steering", { sessionId: this.sessionId, message });
  }

  // Follow-up (Alt+Enter)
  async sendFollowup(message: AgentMessage): Promise<void> {
    await this.client.sendRequest("followup", { sessionId: this.sessionId, message });
  }

  // Interrupt
  async interrupt(): Promise<void> {
    await this.client.sendRequest("interrupt", { sessionId: this.sessionId });
  }
}
```

### Server Side Handling

```typescript
// In ServerSession
private async handleSteering(connection: ServerConnection, params: any): Promise<JSONRPCResponse> {
  const session = this.sessions.get(params.sessionId);
  if (!session) return error(SESSION_NOT_FOUND);
  
  session.receiveSteering(params.message);
  return { jsonrpc: "2.0", id: request.id, result: { ok: true } };
}

private async handleFollowup(connection: ServerConnection, params: any): Promise<JSONRPCResponse> {
  const session = this.sessions.get(params.sessionId);
  if (!session) return error(SESSION_NOT_FOUND);
  
  session.receiveFollowup(params.message);
  return { jsonrpc: "2.0", id: request.id, result: { ok: true } };
}

private async handleInterrupt(connection: ServerConnection, params: any): Promise<JSONRPCResponse> {
  const session = this.sessions.get(params.sessionId);
  if (!session) return error(SESSION_NOT_FOUND);
  
  session.receiveInterrupt();
  return { jsonrpc: "2.0", id: request.id, result: { ok: true } };
}
```

---

## Session Snapshot: Checkpoint/Resume

### Snapshot Structure

```typescript
// packages/server/src/snapshots.ts
export interface SessionSnapshot {
  sessionId: string;
  timestamp: string;
  // SessionManager State
  sessionManagerState: {
    fileEntries: FileEntry[];
    leafId: string | null;
    labelsById: Record<string, string>;
    labelTimestampsById: Record<string, string>;
  };
  // Agent Loop State
  agentLoopState?: {
    currentContext: AgentContext;
    config: AgentLoopConfig;
    lastCompletedTurn: PrepareNextTurnContext | null;
  };
  // Version
  version: number;
}

export class SnapshotManager {
  private snapshotsDir: string;

  constructor(sessionDir: string) {
    this.snapshotsDir = join(sessionDir, "snapshots");
    mkdirSync(this.snapshotsDir, { recursive: true });
  }

  async createSnapshot(session: ServerSession): Promise<string> {
    const snapshot: SessionSnapshot = {
      sessionId: session.sessionId,
      timestamp: new Date().toISOString(),
      sessionManagerState: session.sessionManager.getStateForSnapshot(),
      agentLoopState: session.getAgentLoopState(),
      version: 1,
    };

    const filename = `${snapshot.timestamp}_${session.sessionId}.snapshot.json`;
    const filepath = join(this.snapshotsDir, filename);
    await writeFile(filepath, JSON.stringify(snapshot), "utf8");
    return filepath;
  }

  async restoreSnapshot(sessionId: string, snapshotPath: string): Promise<ServerSession> {
    const snapshot = JSON.parse(await readFile(snapshotPath, "utf8")) as SessionSnapshot;
    
    // Rebuild SessionManager
    const sessionManager = SessionManager.fromSnapshot(snapshot.sessionManagerState);
    
    // Rebuild ServerSession
    const session = new ServerSession(sessionId, sessionManager, ...);
    session.restoreAgentLoopState(snapshot.agentLoopState);
    
    return session;
  }
}
```

### Periodic Snapshot

```typescript
// In ServerSession
private startSnapshotTimer(): void {
  setInterval(async () => {
    try {
      await this.snapshotManager.createSnapshot(this);
    } catch (e) {
      console.warn("Snapshot failed:", e);
    }
  }, 60000);  // Every Minute
}
```

---

## RPC Mode: JSON-RPC over stdin/stdout

### Architecture

```
┌─────────────────┐     stdin/stdout      ┌─────────────────┐
│   IDE / Client  │ ◄───────────────────► │   pi --rpc      │
│                 │    JSON-RPC 2.0       │                 │
└─────────────────┘                       └─────────────────┘
                                               │
                                               ▼
                                        ┌─────────────────┐
                                        │  Agent Loop     │
                                        │  (Local)        │
                                        └─────────────────┘
```

### RpcClient

```typescript
// packages/coding-agent/src/modes/rpc/rpc-client.ts
export class RpcClient {
  private requestId = 0;
  private pending = new Map<number, { resolve: Function; reject: Function }>();

  constructor(
    private stdin: NodeJS.ReadableStream,
    private stdout: NodeJS.WritableStream
  ) {
    this.stdin.on("data", (data) => this.handleData(data));
  }

  private handleData(data: Buffer): void {
    const lines = data.toString().split("\n").filter(Boolean);
    for (const line of lines) {
      const message = JSON.parse(line);
      if ("id" in message && message.id !== undefined) {
        const pending = this.pending.get(message.id);
        if (pending) {
          this.pending.delete(message.id);
          if ("error" in message) {
            pending.reject(new Error(message.error.message));
          } else {
            pending.resolve(message.result);
          }
        }
      } else if ("method" in message) {
        this.handleNotification(message);
      }
    }
  }

  async request(method: string, params: unknown): Promise<unknown> {
    const id = ++this.requestId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
    });
  }

  // Event Stream
  async *events(): AsyncIterable<AgentEvent> {
    // Internal Notification Handling
  }
}
```

### RpcMode Entry

```typescript
// packages/coding-agent/src/modes/rpc/rpc-mode.ts
export async function runRpcMode(options: RpcModeOptions): Promise<void> {
  const client = new RpcClient(process.stdin, process.stdout);
  
  // Send Ready Notification
  client.stdout.write(JSON.stringify({ jsonrpc: "2.0", method: "ready", params: {} }) + "\n");

  // Handle Requests
  for await (const line of readLines(process.stdin)) {
    const request = JSON.parse(line);
    const response = await handleRpcRequest(request);
    client.stdout.write(JSON.stringify(response) + "\n");
  }
}

async function handleRpcRequest(request: JSONRPCRequest): Promise<JSONRPCResponse> {
  switch (request.method) {
    case "prompt":
      // Execute Agent Loop, Return Result
      const stream = agentLoop(/* ... */);
      const messages = [];
      for await (const event of stream) {
        // Send Event Notification
        client.notify("event", event);
        if (event.type === "agent_end") messages = event.messages;
      }
      return { jsonrpc: "2.0", id: request.id, result: { messages } };
    case "interrupt":
      // Interrupt Current Loop
      return { jsonrpc: "2.0", id: request.id, result: { ok: true } };
    // ...
  }
}
```

---

## References

- [GitHub - earendil-works/pi — packages/protocol/](https://github.com/earendil-works/pi/tree/main/packages/protocol)
- [GitHub - earendil-works/pi — packages/client/](https://github.com/earendil-works/pi/tree/main/packages/client)
- [GitHub - earendil-works/pi — packages/server/](https://github.com/earendil-works/pi/tree/main/packages/server)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Pi Official Docs: Remote Session](https://pi.dev/docs/latest/remote)

---

## Next Up

> **Part 11: Telemetry — Vendor-neutral Contracts, Schema, Conformance Tests**
>
> pi-telemetry Core: TelemetrySchema Definition, defineTelemetrySchema, TypedSpanStarter, InMemoryTelemetryContext/NOOP_TELEMETRY_CONTEXT, Conformance Tests Verify Adapter, AI/Harness Telemetry Schema, Attribute Definitions, Span/Event Naming Conventions, Why Not OpenTelemetry Directly.