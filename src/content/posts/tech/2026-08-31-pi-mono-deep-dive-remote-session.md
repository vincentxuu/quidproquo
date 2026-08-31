---
title: "pi-mono 深度導讀 10：Remote Session——Client/Server、JSON-RPC 2.0、WebSocket、斷線重連"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, remote-session, json-rpc, websocket, reconnection, rpc-mode]
lang: zh-TW
series:
  name: "pi-mono 深度導讀"
  order: 10
tldr: "pi-protocol JSON-RPC 2.0 定義、pi-client 連線管理與重連指數退避、pi-server Session Registry、WebSocket Transport、心跳機制、Session Snapshot、Remote Session Handle、RPC 模式架構、流式事件傳輸、Steering/Follow-up 遠端插隊。"
description: "深入 pi-mono 遠端會話系統：pi-protocol 定義 JSON-RPC 2.0 訊息結構、pi-client 管理 WebSocket 連線與自動重連、pi-server 維護 Session Registry 與認證中介軟體、心跳檢測存活、斷線重連指數退避策略、Session Snapshot 支援斷點續傳、RemoteSessionHandle 代理本地 SessionManager、RPC 模式將 Agent Loop 事件流透過 JSON-RPC 傳輸、遠端 Steering/Follow-up 訊息插隊機制。適合研究分散式 Agent 架構、WebSocket 即時通訊的工程師。"
draft: false
---

> 🌏 [English version](/en/posts/tech/2026-08-31-pi-mono-deep-dive-remote-session-en)

## TL;DR

- **pi-protocol**：JSON-RPC 2.0 訊息結構、Client/Server 訊息類型、WebSocket Frame
- **pi-client**：Connection 管理、重連指數退避、EventStream 代理、RemoteSessionHandle
- **pi-server**：Server 類別、Session Registry、Auth Middleware、Protocol Handler
- **心跳**：Ping/Pong 間隔、超時判定、自動重連
- **Session Snapshot**：檢查點存儲、斷點續傳
- **RPC 模式**：`pi --rpc`、JSON-RPC over stdin/stdout、IDE 整合

---

## 架構概覽

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

## pi-protocol：JSON-RPC 2.0 定義

### 訊息結構

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

// 標準錯誤碼
export const JSONRPC_ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  // 自定義錯誤碼
  SESSION_NOT_FOUND: -32000,
  AUTH_FAILED: -32001,
  MODEL_NOT_AVAILABLE: -32002,
};
```

### Client → Server 方法

```typescript
export type ClientMethod =
  | "session.create"      // 建立新 Session
  | "session.resume"      // 恢復現有 Session
  | "session.close"       // 關閉 Session
  | "prompt"              // 送提示詞
  | "steering"            // Steering 訊息
  | "followup"            // Follow-up 訊息
  | "interrupt"           // 中斷
  | "model.switch"        // 切換模型
  | "tool.approve"        // 核准工具
  | "tool.reject"         // 拒絕工具
  | "settings.get"        // 取得設定
  | "settings.set"        // 設定值
  | "ping";               // 心跳
```

### Server → Client 通知

```typescript
export type ServerNotification =
  | "session.created"       // Session 建立完成
  | "session.closed"        // Session 關閉
  | "event"                 // AgentEvent 轉發
  | "model.changed"         // 模型切換
  | "settings.changed"      // 設定變更
  | "error"                 // 錯誤通知
  | "pong";                 // 心跳回應
```

### 完整訊息類型

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

## pi-client：連線管理與重連

### Client 類別

```typescript
// packages/client/src/client.ts
export class Client {
  private connection: Connection;
  private sessions: Map<string, RemoteSession> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000;  // 初始 1s

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

  // 建立遠端 Session
  async createSession(config: CreateSessionConfig): Promise<RemoteSession> {
    const response = await this.sendRequest("session.create", config);
    const session = new RemoteSession(response.sessionId, this);
    this.sessions.set(response.sessionId, session);
    return session;
  }

  // 恢復 Session
  async resumeSession(sessionId: string): Promise<RemoteSession> {
    const response = await this.sendRequest("session.resume", { sessionId });
    const session = new RemoteSession(sessionId, this);
    this.sessions.set(sessionId, session);
    return session;
  }

  // 發送請求（帶重試）
  private async sendRequest(method: string, params: unknown): Promise<unknown> {
    const requestId = uuidv7();
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Request timeout")), 30000);
      
      this.pendingRequests.set(requestId, { resolve, reject, timeout });
      this.connection.send({ jsonrpc: "2.0", id: requestId, method, params });
    });
  }

  // 處理回應
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

### Connection：WebSocket 封裝

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
      
      // 等待 pong 超時
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

## pi-server：Session Registry 與認證

### Server 類別

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
    // 1. 認證（可選：API Key、Token、Cookie）
    const auth = await this.authenticate(req);
    if (!auth) {
      ws.close(4001, "Unauthorized");
      return;
    }

    const connection = new ServerConnection(ws, auth.userId);
    
    // 2. 處理訊息
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
      // Notification (Client 不應發送)
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
    
    // 啟動 Agent Loop
    serverSession.startAgentLoop();
    
    return { jsonrpc: "2.0", id: request.id, result: { sessionId } };
  }
}
```

### ServerSession：代理本地 SessionManager

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
    // 建立 LoopConfig，注入遠端回調
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
      // ... 其他 config
    };

    this.agentLoopStream = agentLoop([], this.sessionManager.buildSessionContext(), config, undefined, this.streamFunction);
    
    // 轉發事件到 Client
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

  // 接收遠端 Steering
  receiveSteering(message: AgentMessage): void {
    this.pendingSteering.push(message);
  }

  // 接收遠端 Follow-up
  receiveFollowup(message: AgentMessage): void {
    this.pendingFollowup.push(message);
  }

  // 接收中斷
  receiveInterrupt(): void {
    this.agentLoopStream?.abort?.();
  }
}
```

---

## 遠端 Steering / Follow-up 機制

### Client 端發送

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

  // 中斷
  async interrupt(): Promise<void> {
    await this.client.sendRequest("interrupt", { sessionId: this.sessionId });
  }
}
```

### Server 端處理

```typescript
// 在 ServerSession 中
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

## Session Snapshot：斷點續傳

### Snapshot 結構

```typescript
// packages/server/src/snapshots.ts
export interface SessionSnapshot {
  sessionId: string;
  timestamp: string;
  // SessionManager 狀態
  sessionManagerState: {
    fileEntries: FileEntry[];
    leafId: string | null;
    labelsById: Record<string, string>;
    labelTimestampsById: Record<string, string>;
  };
  // Agent Loop 狀態
  agentLoopState?: {
    currentContext: AgentContext;
    config: AgentLoopConfig;
    lastCompletedTurn: PrepareNextTurnContext | null;
  };
  // 版本
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
    
    // 重建 SessionManager
    const sessionManager = SessionManager.fromSnapshot(snapshot.sessionManagerState);
    
    // 重建 ServerSession
    const session = new ServerSession(sessionId, sessionManager, ...);
    session.restoreAgentLoopState(snapshot.agentLoopState);
    
    return session;
  }
}
```

### 定期 Snapshot

```typescript
// ServerSession 中
private startSnapshotTimer(): void {
  setInterval(async () => {
    try {
      await this.snapshotManager.createSnapshot(this);
    } catch (e) {
      console.warn("Snapshot failed:", e);
    }
  }, 60000);  // 每分鐘
}
```

---

## RPC 模式：JSON-RPC over stdin/stdout

### 架構

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

  // 事件流
  async *events(): AsyncIterable<AgentEvent> {
    // 內部處理 notification
  }
}
```

### RpcMode 入口

```typescript
// packages/coding-agent/src/modes/rpc/rpc-mode.ts
export async function runRpcMode(options: RpcModeOptions): Promise<void> {
  const client = new RpcClient(process.stdin, process.stdout);
  
  // 發送 Ready 通知
  client.stdout.write(JSON.stringify({ jsonrpc: "2.0", method: "ready", params: {} }) + "\n");

  // 處理請求
  for await (const line of readLines(process.stdin)) {
    const request = JSON.parse(line);
    const response = await handleRpcRequest(request);
    client.stdout.write(JSON.stringify(response) + "\n");
  }
}

async function handleRpcRequest(request: JSONRPCRequest): Promise<JSONRPCResponse> {
  switch (request.method) {
    case "prompt":
      // 執行 Agent Loop、回傳結果
      const stream = agentLoop(/* ... */);
      const messages = [];
      for await (const event of stream) {
        // 發送事件通知
        client.notify("event", event);
        if (event.type === "agent_end") messages = event.messages;
      }
      return { jsonrpc: "2.0", id: request.id, result: { messages } };
    case "interrupt":
      // 中斷當前 Loop
      return { jsonrpc: "2.0", id: request.id, result: { ok: true } };
    // ...
  }
}
```

---

## 參考資料

- [GitHub - earendil-works/pi — packages/protocol/](https://github.com/earendil-works/pi/tree/main/packages/protocol)
- [GitHub - earendil-works/pi — packages/client/](https://github.com/earendil-works/pi/tree/main/packages/client)
- [GitHub - earendil-works/pi — packages/server/](https://github.com/earendil-works/pi/tree/main/packages/server)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Pi 官方文件：Remote Session](https://pi.dev/docs/latest/remote)

---

## 下一篇預告

> **第 11 篇：Telemetry——Vendor-neutral Contracts、Schema、Conformance Tests**
>
> pi-telemetry 核心：TelemetrySchema 定義、defineTelemetrySchema、TypedSpanStarter、InMemoryTelemetryContext/NOOP_TELEMETRY_CONTEXT、Conformance Tests 驗證 Adapter、AI/Harness Telemetry Schema、屬性定義、Span/Event 命名規範、為什麼不直接用 OpenTelemetry。