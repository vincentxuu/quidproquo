---
title: "pi-mono Deep Dive 7: Extension System — Hooks, Custom Tools, UI Components, Lifecycle Complete Mechanism"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, extension-system, hooks, ui-components, lifecycle]
lang: en
series:
  name: "pi-mono Deep Dive"
  order: 7
tldr: "Complete Extension system analysis: Extension interface definition, onLoad/onUnload lifecycle, four major Hooks (onAgentStart/onBeforeToolCall/onAfterToolCall/onTurnEnd), five extension points (tools/commands/keybindings/ui/settings), ExtensionRunner load order and dependency resolution, ExtensionAPI capabilities, Dynamic Border, Widget, Dialog, Selector UI components, Extension inter-communication, hot reload mechanism, official example Extensions."
description: "Deep dive into pi-coding-agent Extension system: complete chain from definition to execution. Covers Extension interface, lifecycle, Hook mechanisms, extension point types, ExtensionRunner loading logic, ExtensionAPI capability boundaries, TUI component extensions, Widget system, Dialog system, Selector system, Keybindings management, Settings Schema, Extension event bus, hot reload implementation, official built-in Extensions (llama, gondolin, sandbox, etc.). For engineers wanting to develop pi Extensions or research Agent plugin architecture."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-31-pi-mono-deep-dive-extension-system)

## TL;DR

- **Extension Interface**: name, version, onLoad/onUnload, four Hooks, five extension points
- **Hooks**: onAgentStart, onBeforeToolCall, onAfterToolCall, onTurnEnd
- **Extension Points**: tools, commands, keybindings, ui (components/widgets/dialogs/selectors), settings
- **ExtensionRunner**: Discover → Sort → Load → Init → Mount Hooks, Register Extension Points
- **ExtensionAPI**: Access Session, Model, Tools, Settings, UI, Event Bus, Clipboard, Shell
- **UI Components**: EntryRenderer, Widget, Dialog, Selector, DynamicBorder
- **Hot Reload**: File watch → Unload old → Load new → Preserve state

---

## Why Extension System?

pi core has only 4 tools, minimal system prompt. All "advanced features" via Extension:

| Feature | Extension Implementation |
|---|---|
| Sub-agents | Custom Tool + Command + UI |
| Plan Mode | Tool + UI (todo list, plan view) |
| MCP Integration | Tool (call MCP server) + OAuth |
| Permission Control | beforeToolCall Hook + Trust UI |
| Sandbox/Container | gondolin Extension (micro VM) |
| Custom Models | Model Registry + Provider Factory |
| Long-term Memory | Custom Entry + RAG Tool |

---

## Extension Interface Definition

```typescript
// packages/coding-agent/src/core/extensions/types.ts
export interface Extension {
  name: string;
  version: string;
  description?: string;
  // Dependencies for load order
  dependencies?: string[];
  // Lifecycle
  onLoad?(api: ExtensionAPI): Promise<void> | void;
  onUnload?(api: ExtensionAPI): Promise<void> | void;
  // Hooks
  onAgentStart?(event: BeforeAgentStartEvent): Promise<BeforeAgentStartEventResult | void>;
  onBeforeToolCall?(ctx: BeforeToolCallContext, signal: AbortSignal): Promise<BeforeToolCallResult | void>;
  onAfterToolCall?(ctx: AfterToolCallContext, signal: AbortSignal): Promise<AfterToolCallResult | void>;
  onTurnEnd?(event: TurnEndEvent, signal: AbortSignal): Promise<void>;
  // Extension Points
  tools?: RegisteredTool[];
  commands?: RegisteredCommand[];
  keybindings?: AppKeybinding[];
  ui?: {
    components?: EntryRenderer[];      // Message renderers
    widgets?: WidgetDefinition[];      // Status bar Widgets
    dialogs?: DialogDefinition[];      // Dialogs
    selectors?: SelectorDefinition[];  // Selectors
  };
  settings?: SettingsConfig;           // Settings Schema
}
```

### RegisteredTool: Custom Tool

```typescript
export interface RegisteredTool {
  definition: ToolDefinition;  // For LLM
  tool: AgentTool;             // Execution logic
  // Optional: tool-specific options
  options?: ToolOptions;
}
```

### RegisteredCommand: Custom Command

```typescript
export interface RegisteredCommand {
  name: string;                    // Without / prefix
  description: string;
  usage?: string;
  // Execution function
  execute: (context: ExtensionCommandContext, args: string[]) => Promise<CommandResult>;
  // Autocomplete
  autocomplete?: (context: ExtensionCommandContext, partial: string) => Promise<string[]>;
}
```

### UI Extension Point Types

```typescript
// Entry Renderer (custom render for specific entry type)
export interface EntryRenderer {
  entryType: string;           // Matches SessionEntry.type
  render: (entry: SessionEntry, options: EntryRenderOptions) => Component;
  // Optional: priority (higher = more priority)
  priority?: number;
}

// Widget (Footer, Sidebar fixed areas)
export interface WidgetDefinition {
  id: string;
  name: string;
  placement: WidgetPlacement;  // "footer" | "sidebar" | "floating"
  render: (api: ExtensionAPI) => Component;
  // Optional: click behavior
  onClick?: (api: ExtensionAPI) => Promise<void>;
}

// Dialog (Modal)
export interface DialogDefinition {
  id: string;
  title: string;
  render: (api: ExtensionAPI, options: ExtensionUIDialogOptions) => Component;
  // Optional: default size
  defaultSize?: { width: number; height: number };
}

// Selector (Dropdown, Fuzzy Search)
export interface SelectorDefinition {
  id: string;
  name: string;
  render: (api: ExtensionAPI, options: { query: string }) => SelectorResult[];
  onSelect: (api: ExtensionAPI, item: SelectorResult) => Promise<void>;
}
```

---

## Lifecycle: Discover → Load → Init → Run → Unload

### 1. Discovery & Loading (`ExtensionRunner`)

```typescript
// packages/coding-agent/src/core/extensions/index.ts
export class ExtensionRunner {
  private extensions: Map<string, LoadedExtension> = new Map();
  private loadOrder: string[] = [];

  async discoverAndLoadExtensions(
    api: ExtensionAPI,
    extensionDirs: string[]
  ): Promise<LoadExtensionsResult> {
    // 1. Scan directories for *.ts/*.js files
    const extensionFiles = await this.scanExtensionFiles(extensionDirs);
    
    // 2. Dynamic import each extension
    const loaded: LoadedExtension[] = [];
    for (const file of extensionFiles) {
      try {
        const mod = await import(file);
        const extension = mod.default || mod;
        if (this.validateExtension(extension)) {
          loaded.push({ file, extension, config: this.extractConfig(extension) });
        }
      } catch (e) {
        // Log error but continue
      }
    }

    // 3. Topological sort (dependencies first)
    this.loadOrder = this.topologicalSort(loaded);

    // 4. Sequential onLoad
    for (const name of this.loadOrder) {
      const ext = this.extensions.get(name)!;
      try {
        await ext.extension.onLoad?.(api);
        ext.loaded = true;
      } catch (e) {
        ext.error = e;
      }
    }

    return { loaded: this.loadOrder, errors: ... };
  }

  // Topological sort: dependencies load first
  private topologicalSort(loaded: LoadedExtension[]): string[] {
    const graph = new Map<string, Set<string>>();
    const inDegree = new Map<string, number>();
    
    for (const { extension } of loaded) {
      graph.set(extension.name, new Set(extension.dependencies ?? []));
      inDegree.set(extension.name, 0);
    }
    for (const { extension } of loaded) {
      for (const dep of extension.dependencies ?? []) {
        inDegree.set(dep, (inDegree.get(dep) ?? 0) + 1);
      }
    }
    
    const queue = [...inDegree.entries()].filter(([, d]) => d === 0).map(([n]) => n);
    const result: string[] = [];
    while (queue.length) {
      const n = queue.shift()!;
      result.push(n);
      for (const [, deps] of graph) {
        if (deps.has(n)) {
          const d = inDegree.get(n)! - 1;
          inDegree.set(n, d);
          if (d === 0) queue.push(n);
        }
      }
    }
    return result;
  }
}
```

### 2. Unload (Hot Reload)

```typescript
async unloadExtension(name: string, api: ExtensionAPI): Promise<void> {
  const ext = this.extensions.get(name);
  if (!ext?.loaded) return;
  
  // 1. Remove Hook registrations
  this.hooks.onAgentStart.delete(name);
  this.hooks.onBeforeToolCall.delete(name);
  this.hooks.onAfterToolCall.delete(name);
  this.hooks.onTurnEnd.delete(name);
  
  // 2. Remove Extension Points
  this.removeTools(name);
  this.removeCommands(name);
  this.removeKeybindings(name);
  this.removeUIComponents(name);
  this.removeSettings(name);
  
  // 3. Call onUnload
  try {
    await ext.extension.onUnload?.(api);
  } catch (e) { /* log */ }
  
  ext.loaded = false;
}
```

---

## Four Major Hooks Deep Dive

### onAgentStart: Before Agent Starts

```typescript
interface BeforeAgentStartEvent {
  sessionId: string;
  cwd: string;
  model: ModelConfig;
  tools: AgentTool[];
  systemPrompt: string;
}

interface BeforeAgentStartEventResult {
  // Can modify system prompt
  systemPrompt?: string;
  // Can add/remove tools
  tools?: AgentTool[];
  // Can change model
  model?: ModelConfig;
  // Block startup
  block?: boolean;
  reason?: string;
}

// Usage Example: Dynamic Project Context Injection
onAgentStart: async (event) => {
  const projectContext = await readProjectContext(event.cwd);
  return {
    systemPrompt: event.systemPrompt + "\n\n" + projectContext,
    tools: [...event.tools, createProjectTool(event.cwd)],
  };
}
```

### onBeforeToolCall: Intercept Before Tool Execution

```typescript
interface BeforeToolCallContext {
  assistantMessage: AssistantMessage;
  toolCall: AgentToolCall;
  args: unknown;           // Validated args
  context: AgentContext;
}

interface BeforeToolCallResult {
  block?: boolean;         // Block execution
  reason?: string;
  terminate?: boolean;     // Force agent end
  // Can modify args
  args?: unknown;
}

// Usage Example: Permission Check, Arg Correction
onBeforeToolCall: async (ctx, signal) => {
  if (["write", "edit", "bash"].includes(ctx.toolCall.name)) {
    const allowed = await checkPermission(ctx.toolCall.name, ctx.args);
    if (!allowed) return { block: true, reason: "Permission denied", terminate: false };
  }
  // Auto-complete description
  if (ctx.toolCall.name === "bash" && !ctx.args.description) {
    return { args: { ...ctx.args, description: `Running: ${ctx.args.command}` } };
  }
}
```

### onAfterToolCall: Post-Execution Processing

```typescript
interface AfterToolCallContext {
  assistantMessage: AssistantMessage;
  toolCall: AgentToolCall;
  args: unknown;
  result: ToolResult;
  isError: boolean;
  context: AgentContext;
}

interface AfterToolCallResult {
  content?: ToolResult["content"];    // Replace content
  details?: ToolResult["details"];    // Replace details
  usage?: ToolResult["usage"];        // Add usage
  terminate?: boolean;                // Force terminate
  isError?: boolean;                  // Change error state
}

// Usage Example: Error Beautification, Telemetry
onAfterToolCall: async (ctx, signal) => {
  if (ctx.isError && ctx.toolCall.name === "bash") {
    return {
      content: [{ type: "text", text: `${ctx.result.content[0].text}\n\n💡 Try: check syntax, permissions, or run with --verbose` }],
    };
  }
  telemetry.record("tool_call", { tool: ctx.toolCall.name, error: ctx.isError });
}
```

### onTurnEnd: End of Each Turn

```typescript
interface TurnEndEvent {
  assistantMessage: AssistantMessage;
  toolResults: ToolResultMessage[];
  context: AgentContext;
  newMessages: AgentMessage[];
}

// Usage Example: Auto-save, Trigger Background Tasks
onTurnEnd: async (event, signal) => {
  // Auto-save every turn
  await sessionManager.autoSave();
  // Check if compaction needed
  if (shouldCompact(event.context)) {
    event.context.scheduleCompaction();
  }
}
```

---

## ExtensionAPI: Extension Capability Boundaries

```typescript
// packages/coding-agent/src/core/extensions/index.ts
export interface ExtensionAPI {
  // Session Access
  session: {
    getContext: () => SessionContext;
    getEntries: () => SessionEntry[];
    getTree: () => SessionTreeNode[];
    appendMessage: (message: AgentMessage) => string;
    appendCustomEntry: (customType: string, data: unknown) => string;
  };
  // Model Access
  model: {
    getCurrent: () => ModelConfig | null;
    listModels: () => ModelCatalogEntry[];
    switchModel: (modelString: string) => Promise<void>;
  };
  // Tools Access
  tools: {
    getAll: () => AgentTool[];
    getDefinition: (name: string) => ToolDefinition | undefined;
    execute: (name: string, args: unknown) => Promise<ToolResult>;
  };
  // Settings
  settings: {
    get: <T>(key: string) => T | undefined;
    set: (key: string, value: unknown) => Promise<void>;
    onChange: (key: string, listener: (value: unknown) => void) => () => void;
  };
  // UI Operations
  ui: {
    showDialog: (dialogId: string, options?: ExtensionUIDialogOptions) => Promise<void>;
    hideDialog: (dialogId: string) => void;
    showSelector: (selectorId: string, options: { query: string }) => Promise<void>;
    notify: (message: string, type: "info" | "warning" | "error") => void;
    // Register Custom Components
    registerComponent: (renderer: EntryRenderer) => void;
    registerWidget: (widget: WidgetDefinition) => void;
    registerDialog: (dialog: DialogDefinition) => void;
    registerSelector: (selector: SelectorDefinition) => void;
  };
  // Event Bus (Extension Inter-communication)
  events: {
    on: (event: string, listener: (...args: unknown[]) => void) => () => void;
    emit: (event: string, ...args: unknown[]) => void;
  };
  // Clipboard
  clipboard: {
    read: () => Promise<string>;
    write: (text: string) => Promise<void>;
  };
  // Shell Operations
  shell: {
    exec: (command: string, options?: ShellExecOptions) => Promise<ExecResult>;
    spawn: (command: string, args: string[], options?: ShellExecOptions) => ChildProcess;
  };
  // Logger
  logger: {
    debug: (msg: string, meta?: Record<string, unknown>) => void;
    info: (msg: string, meta?: Record<string, unknown>) => void;
    warn: (msg: string, meta?: Record<string, unknown>) => void;
    error: (msg: string, meta?: Record<string, unknown>) => void;
  };
}
```

---

## UI Component Extension System

### EntryRenderer: Custom Message Rendering

```typescript
// Example: Render Custom custom_message
const myRenderer: EntryRenderer = {
  entryType: "custom_message",
  priority: 100,
  render: (entry, options) => {
    const customMsg = entry as CustomMessageEntry;
    return (
      <Box borderStyle="dashed" borderColor="yellow">
        <Text>🔧 {customMsg.customType}</Text>
        <Text>{typeof customMsg.content === "string" ? customMsg.content : JSON.stringify(customMsg.content)}</Text>
      </Box>
    );
  },
};
```

### Widget: Status Bar Component

```typescript
// Example: Git Status Widget
const gitWidget: WidgetDefinition = {
  id: "git-status",
  name: "Git Status",
  placement: "footer",
  render: (api) => {
    const gitInfo = useGitInfo(api.session.getContext().cwd);
    return (
      <HStack gap={1}>
        <Text color={gitInfo.clean ? "green" : "yellow"}>
          {gitInfo.branch} {gitInfo.clean ? "✓" : `±${gitInfo.changes}`}
        </Text>
      </HStack>
    );
  },
  onClick: async (api) => {
    await api.ui.showDialog("git-dialog");
  },
};
```

### Dialog: Modal Dialog

```typescript
// Example: Confirmation Dialog
const confirmDialog: DialogDefinition = {
  id: "confirm-dangerous",
  title: "⚠️ Dangerous Operation Confirm",
  render: (api, options) => (
    <VStack gap={1} padding={2}>
      <Text>{options.message || "Are you sure you want to execute this operation?"}</Text>
      <HStack gap={2} justify="flex-end">
        <Button onClick={() => api.ui.hideDialog("confirm-dangerous")}>Cancel</Button>
        <Button variant="destructive" onClick={() => {
          api.events.emit("confirm-result", true);
          api.ui.hideDialog("confirm-dangerous");
        }}>Confirm</Button>
      </HStack>
    </VStack>
  ),
  defaultSize: { width: 60, height: 15 },
};
```

### Selector: Fuzzy Search Selector

```typescript
// Example: File Selector
const fileSelector: SelectorDefinition = {
  id: "file-picker",
  name: "Pick File",
  render: async (api, { query }) => {
    const files = await glob("**/*", { cwd: api.session.getContext().cwd, ignore: ["node_modules/**", ".git/**"] });
    return files
      .filter(f => f.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 50)
      .map(f => ({ id: f, label: f, description: "File" }));
  },
  onSelect: async (api, item) => {
    await api.session.appendMessage({ role: "user", content: `Read file: ${item.id}` });
  },
};
```

---

## Official Built-in Extensions Examples

### 1. llama Extension (`packages/coding-agent/src/extensions/llama/`)

```typescript
// Local LLM Integration (Ollama, llama.cpp)
export const llamaExtension: Extension = {
  name: "llama",
  version: "1.0.0",
  onLoad: async (api) => {
    // Register Local Model Providers
    api.model.registerProvider("ollama", createOllamaProvider());
    api.model.registerProvider("llamacpp", createLlamaCppProvider());
  },
  tools: [
    createModelManagementTool(),  // pull, list, remove models
  ],
  commands: [
    { name: "llama-pull", description: "Pull Ollama model", execute: pullModel },
    { name: "llama-list", description: "List local models", execute: listModels },
  ],
};
```

### 2. gondolin Extension (Micro VM Sandbox)

```typescript
// packages/coding-agent/src/extensions/gondolin/
// Route Tool Execution to Micro VM
export const gondolinExtension: Extension = {
  name: "gondolin",
  version: "1.0.0",
  onLoad: async (api) => {
    // Replace bash tool with VM version
    api.tools.replace("bash", createVMBashTool());
    api.tools.replace("write", createVMWriteTool());
  },
  onBeforeToolCall: async (ctx) => {
    // All Tools Execute in VM
    if (ctx.toolCall.name === "bash") {
      return { args: { ...ctx.args, vm: true } };
    }
  },
};
```

### 3. sandbox Extension

```typescript
// Browser Sandbox, WebContainer Integration
export const sandboxExtension: Extension = {
  name: "sandbox",
  version: "1.0.0",
  ui: {
    widgets: [createPreviewWidget()],  // Live Preview Web App
    dialogs: [createSandboxConfigDialog()],
  },
  commands: [
    { name: "sandbox-start", execute: startSandbox },
    { name: "sandbox-preview", execute: openPreview },
  ],
};
```

---

## Extension Inter-communication: Event Bus

```typescript
// Extension A Emits Event
api.events.emit("my-extension:data-ready", { payload: "data" });

// Extension B Listens
const unsubscribe = api.events.on("my-extension:data-ready", (data) => {
  console.log("Received:", data);
});

// System Built-in Events
api.events.on("session:message-added", (message) => { /* ... */ });
api.events.on("model:changed", (model) => { /* ... */ });
api.events.on("tool:executed", (toolCall, result) => { /* ... */ });
api.events.on("compaction:triggered", (summary) => { /* ... */ });
```

---

## Hot Reload Mechanism

```typescript
// packages/coding-agent/src/core/extensions/hot-reload.ts
export function setupHotReload(
  runner: ExtensionRunner,
  extensionDirs: string[],
  api: ExtensionAPI
): () => void {
  const watchers = extensionDirs.map(dir => 
    watch(dir, { recursive: true }, async (event, filename) => {
      if (!filename?.endsWith(".ts") && !filename?.endsWith(".js")) return;
      
      const extName = path.basename(filename, path.extname(filename));
      
      // 1. Unload Old Version
      await runner.unloadExtension(extName, api);
      
      // 2. Clear Require Cache (Ensure Re-import)
      delete require.cache[require.resolve(path.join(dir, filename))];
      
      // 3. Reload
      try {
        const mod = await import(path.join(dir, filename));
        const extension = mod.default || mod;
        await runner.loadExtension(extension, api);
        api.logger.info(`Hot reloaded extension: ${extName}`);
      } catch (e) {
        api.logger.error(`Hot reload failed for ${extName}`, e);
      }
    })
  );

  // Return Cleanup Function
  return () => watchers.forEach(w => w.close());
}
```

---

## Settings Schema: Type-Safe Configuration

```typescript
// packages/coding-agent/src/core/settings-manager.ts
export interface SettingsConfig {
  // Settings Structure Definition
  schema: {
    [key: string]: {
      type: "string" | "number" | "boolean" | "array" | "object";
      description: string;
      default?: unknown;
      enum?: unknown[];
      minimum?: number;
      maximum?: number;
    };
  };
  // Settings Tabs
  tabs?: {
    id: string;
    name: string;
    keys: string[];
  }[];
}

// Example: my-extension Settings
export const myExtensionSettings: SettingsConfig = {
  schema: {
    "myExtension.apiEndpoint": {
      type: "string",
      description: "API Endpoint URL",
      default: "https://api.example.com",
    },
    "myExtension.timeout": {
      type: "number",
      description: "Request Timeout (ms)",
      default: 30000,
      minimum: 1000,
      maximum: 300000,
    },
    "myExtension.enabledFeatures": {
      type: "array",
      description: "Enabled Features",
      default: ["feature1", "feature2"],
    },
  },
  tabs: [
    { id: "general", name: "General", keys: ["myExtension.apiEndpoint", "myExtension.timeout"] },
    { id: "features", name: "Features", keys: ["myExtension.enabledFeatures"] },
  ],
};
```

---

## Developing Extension Practical Steps

```bash
# 1. Create Extension Directory
mkdir -p ~/.pi/agent/extensions/my-extension
cd ~/.pi/agent/extensions/my-extension

# 2. Create package.json
cat > package.json << 'EOF'
{
  "name": "my-extension",
  "version": "1.0.0",
  "type": "module",
  "main": "index.ts",
  "dependencies": {
    "@earendil-works/pi-coding-agent": "^0.12.0"
  }
}
EOF

# 3. Write index.ts
cat > index.ts << 'EOF'
import { Extension } from "@earendil-works/pi-coding-agent";

export const myExtension: Extension = {
  name: "my-extension",
  version: "1.0.0",
  onLoad: async (api) => {
    api.logger.info("My Extension loaded!");
    // Register Tools, Commands, UI...
  },
  onUnload: async (api) => {
    api.logger.info("My Extension unloaded!");
  },
  // ...
};
EOF

# 4. Restart pi or Trigger Hot Reload
pi
# In TUI /extensions Shows Load Status
```

---

## References

- [GitHub - earendil-works/pi — packages/coding-agent/src/core/extensions/](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/src/core/extensions)
- [Pi Official Docs: Extension Development Guide](https://pi.dev/docs/latest/extensions)
- [Extension Example: llama](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/src/extensions/llama)
- [Extension Example: gondolin](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/src/extensions/gondolin)
- [Extension Example: sandbox](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/src/extensions/sandbox)

---

## Next Up

> **Part 8: TUI Architecture — Differential Rendering, Component Tree, Layout Engine, CSI 2026**
>
> pi-tui Core: Virtual DOM Diff Algorithm, Component Lifecycle, Layout Engine (Flex-like), CSI 2026 Synchronized Output, Keybindings Manager, Alt Screen, Bracketed Paste, Kitty/iTerm2 Image Protocol, Markdown/Editor/Selector Built-in Components.