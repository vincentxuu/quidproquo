---
title: "pi-mono 深度導讀 7：Extension System——Hooks、Custom Tools、UI Components、Lifecycle 完整機制"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, extension-system, hooks, ui-components, lifecycle]
lang: zh-TW
series:
  name: "pi-mono 深度導讀"
  order: 7
tldr: "Extension 系統完整解析：Extension 介面定義、onLoad/onUnload 生命週期、四大 Hook（onAgentStart/onBeforeToolCall/onAfterToolCall/onTurnEnd）、五大擴充點（tools/commands/keybindings/ui/settings）、ExtensionRunner 載入順序與依賴解析、ExtensionAPI 提供的能力、Dynamic Border、Widget、Dialog、Selector 等 UI 元件、Extension 間通訊、熱重載機制、官方範例 Extensions。"
description: "深入 pi-coding-agent Extension 系統：從定義到執行的完整鏈路。涵蓋 Extension 介面、生命週期、Hook 機制、擴充點類型、ExtensionRunner 載入邏輯、ExtensionAPI 能力邊界、TUI 元件擴充、Widget 系統、Dialog 系統、Selector 系統、Keybindings 管理、Settings Schema、Extension 間事件總線、熱重載實作、官方內建 Extensions（llama、gondolin、sandbox 等）。適合想開發 pi Extension、研究 Agent 插件架構的工程師。"
draft: false
---

> 🌏 [English version](/en/posts/tech/2026-08-31-pi-mono-deep-dive-extension-system-en)

## TL;DR

- **Extension 介面**：name、version、onLoad/onUnload、四大 Hook、五大擴充點
- **Hook**：onAgentStart、onBeforeToolCall、onAfterToolCall、onTurnEnd
- **擴充點**：tools、commands、keybindings、ui（components/widgets/dialogs/selectors）、settings
- **ExtensionRunner**：發現→排序→載入→初始化→掛載 Hook、註冊擴充點
- **ExtensionAPI**：存取 Session、Model、Tools、Settings、UI、Event Bus、Clipboard、Shell
- **UI 元件**：EntryRenderer、Widget、Dialog、Selector、DynamicBorder
- **熱重載**：檔案監控 → 卸載舊 → 載入新 → 保留狀態

---

## 為什麼需要 Extension System？

pi 核心只有 4 個工具、極短 system prompt。所有「進階功能」都靠 Extension：

| 功能 | Extension 實作方式 |
|---|---|
| Sub-agents | 自訂 Tool + Command + UI |
| Plan Mode | Tool + UI（ todo list、plan view） |
| MCP 整合 | Tool（呼叫 MCP server）+ OAuth |
| 權限控管 | beforeToolCall Hook + Trust UI |
| 沙盒/容器 | gondolin Extension（微 VM） |
| 自訂模型 | Model Registry + Provider Factory |
| 長期記憶 | Custom Entry + RAG Tool |

---

## Extension 介面定義

```typescript
// packages/coding-agent/src/core/extensions/types.ts
export interface Extension {
  name: string;
  version: string;
  description?: string;
  // 依賴其他 Extension（載入順序）
  dependencies?: string[];
  // 生命週期
  onLoad?(api: ExtensionAPI): Promise<void> | void;
  onUnload?(api: ExtensionAPI): Promise<void> | void;
  // Hooks
  onAgentStart?(event: BeforeAgentStartEvent): Promise<BeforeAgentStartEventResult | void>;
  onBeforeToolCall?(ctx: BeforeToolCallContext, signal: AbortSignal): Promise<BeforeToolCallResult | void>;
  onAfterToolCall?(ctx: AfterToolCallContext, signal: AbortSignal): Promise<AfterToolCallResult | void>;
  onTurnEnd?(event: TurnEndEvent, signal: AbortSignal): Promise<void>;
  // 擴充點
  tools?: RegisteredTool[];
  commands?: RegisteredCommand[];
  keybindings?: AppKeybinding[];
  ui?: {
    components?: EntryRenderer[];      // 訊息渲染器
    widgets?: WidgetDefinition[];      // 狀態列 Widget
    dialogs?: DialogDefinition[];      // 對話框
    selectors?: SelectorDefinition[];  // 選擇器
  };
  settings?: SettingsConfig;           // 設定 Schema
}
```

### RegisteredTool：自訂工具

```typescript
export interface RegisteredTool {
  definition: ToolDefinition;  // 給 LLM
  tool: AgentTool;             // 執行邏輯
  // 可選：工具特定選項
  options?: ToolOptions;
}
```

### RegisteredCommand：自訂指令

```typescript
export interface RegisteredCommand {
  name: string;                    // 不含 / 前綴
  description: string;
  usage?: string;
  // 執行函數
  execute: (context: ExtensionCommandContext, args: string[]) => Promise<CommandResult>;
  // 自動完成
  autocomplete?: (context: ExtensionCommandContext, partial: string) => Promise<string[]>;
}
```

### UI 擴充點類型

```typescript
// 訊息渲染器（自訂如何渲染特定 entry type）
export interface EntryRenderer {
  entryType: string;           // 對應 SessionEntry.type
  render: (entry: SessionEntry, options: EntryRenderOptions) => Component;
  // 可選：優先級（數字越大越優先）
  priority?: number;
}

// Widget（Footer、Sidebar 等固定區域）
export interface WidgetDefinition {
  id: string;
  name: string;
  placement: WidgetPlacement;  // "footer" | "sidebar" | "floating"
  render: (api: ExtensionAPI) => Component;
  // 可選：點擊行為
  onClick?: (api: ExtensionAPI) => Promise<void>;
}

// Dialog（Modal 對話框）
export interface DialogDefinition {
  id: string;
  title: string;
  render: (api: ExtensionAPI, options: ExtensionUIDialogOptions) => Component;
  // 可選：預設尺寸
  defaultSize?: { width: number; height: number };
}

// Selector（下拉選單、模糊搜尋）
export interface SelectorDefinition {
  id: string;
  name: string;
  render: (api: ExtensionAPI, options: { query: string }) => SelectorResult[];
  onSelect: (api: ExtensionAPI, item: SelectorResult) => Promise<void>;
}
```

---

## 生命週期：發現 → 載入 → 初始化 → 運行 → 卸載

### 1. 發現與載入（`ExtensionRunner`）

```typescript
// packages/coding-agent/src/core/extensions/index.ts
export class ExtensionRunner {
  private extensions: Map<string, LoadedExtension> = new Map();
  private loadOrder: string[] = [];

  async discoverAndLoadExtensions(
    api: ExtensionAPI,
    extensionDirs: string[]
  ): Promise<LoadExtensionsResult> {
    // 1. 掃描目錄找 *.ts/*.js 檔案
    const extensionFiles = await this.scanExtensionFiles(extensionDirs);
    
    // 2. 動態 import 每個 extension
    const loaded: LoadedExtension[] = [];
    for (const file of extensionFiles) {
      try {
        const mod = await import(file);
        const extension = mod.default || mod;
        if (this.validateExtension(extension)) {
          loaded.push({ file, extension, config: this.extractConfig(extension) });
        }
      } catch (e) {
        // 記錄錯誤但繼續
      }
    }

    // 3. 拓撲排序（依賴優先）
    this.loadOrder = this.topologicalSort(loaded);

    // 4. 依序 onLoad
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

  // 拓撲排序：dependencies 先載入
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

### 2. 卸載（熱重載時）

```typescript
async unloadExtension(name: string, api: ExtensionAPI): Promise<void> {
  const ext = this.extensions.get(name);
  if (!ext?.loaded) return;
  
  // 1. 移除 Hook 註冊
  this.hooks.onAgentStart.delete(name);
  this.hooks.onBeforeToolCall.delete(name);
  this.hooks.onAfterToolCall.delete(name);
  this.hooks.onTurnEnd.delete(name);
  
  // 2. 移除擴充點
  this.removeTools(name);
  this.removeCommands(name);
  this.removeKeybindings(name);
  this.removeUIComponents(name);
  this.removeSettings(name);
  
  // 3. 呼叫 onUnload
  try {
    await ext.extension.onUnload?.(api);
  } catch (e) { /* log */ }
  
  ext.loaded = false;
}
```

---

## 四大 Hook 詳細機制

### onAgentStart：Agent 啟動前

```typescript
interface BeforeAgentStartEvent {
  sessionId: string;
  cwd: string;
  model: ModelConfig;
  tools: AgentTool[];
  systemPrompt: string;
}

interface BeforeAgentStartEventResult {
  // 可修改系統提示詞
  systemPrompt?: string;
  // 可增減工具
  tools?: AgentTool[];
  // 可變更模型
  model?: ModelConfig;
  // 阻擋啟動
  block?: boolean;
  reason?: string;
}

// 使用範例：動態注入專案上下文
onAgentStart: async (event) => {
  const projectContext = await readProjectContext(event.cwd);
  return {
    systemPrompt: event.systemPrompt + "\n\n" + projectContext,
    tools: [...event.tools, createProjectTool(event.cwd)],
  };
}
```

### onBeforeToolCall：工具執行前攔截

```typescript
interface BeforeToolCallContext {
  assistantMessage: AssistantMessage;
  toolCall: AgentToolCall;
  args: unknown;           // 已驗證參數
  context: AgentContext;
}

interface BeforeToolCallResult {
  block?: boolean;         // 阻擋
  reason?: string;
  terminate?: boolean;     // 強制結束 agent
  // 可修改參數
  args?: unknown;
}

// 使用範例：權限檢查、參數修正
onBeforeToolCall: async (ctx, signal) => {
  if (["write", "edit", "bash"].includes(ctx.toolCall.name)) {
    const allowed = await checkPermission(ctx.toolCall.name, ctx.args);
    if (!allowed) return { block: true, reason: "Permission denied", terminate: false };
  }
  // 自動補全 description
  if (ctx.toolCall.name === "bash" && !ctx.args.description) {
    return { args: { ...ctx.args, description: `Running: ${ctx.args.command}` } };
  }
}
```

### onAfterToolCall：工具執行後處理

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
  content?: ToolResult["content"];    // 替換內容
  details?: ToolResult["details"];    // 替換細節
  usage?: ToolResult["usage"];        // 附加 usage
  terminate?: boolean;                // 強制結束
  isError?: boolean;                  // 改變錯誤狀態
}

// 使用範例：錯誤美化、遙測
onAfterToolCall: async (ctx, signal) => {
  if (ctx.isError && ctx.toolCall.name === "bash") {
    return {
      content: [{ type: "text", text: `${ctx.result.content[0].text}\n\n💡 Try: check syntax, permissions, or run with --verbose` }],
    };
  }
  telemetry.record("tool_call", { tool: ctx.toolCall.name, error: ctx.isError });
}
```

### onTurnEnd：每輪結束

```typescript
interface TurnEndEvent {
  assistantMessage: AssistantMessage;
  toolResults: ToolResultMessage[];
  context: AgentContext;
  newMessages: AgentMessage[];
}

// 使用範例：自動儲存、觸發背景任務
onTurnEnd: async (event, signal) => {
  // 每輪自動存檔
  await sessionManager.autoSave();
  // 檢查是否需要 compaction
  if (shouldCompact(event.context)) {
    event.context.scheduleCompaction();
  }
}
```

---

## ExtensionAPI：Extension 能力邊界

```typescript
// packages/coding-agent/src/core/extensions/index.ts
export interface ExtensionAPI {
  // Session 存取
  session: {
    getContext: () => SessionContext;
    getEntries: () => SessionEntry[];
    getTree: () => SessionTreeNode[];
    appendMessage: (message: AgentMessage) => string;
    appendCustomEntry: (customType: string, data: unknown) => string;
  };
  // Model 存取
  model: {
    getCurrent: () => ModelConfig | null;
    listModels: () => ModelCatalogEntry[];
    switchModel: (modelString: string) => Promise<void>;
  };
  // Tools 存取
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
  // UI 操作
  ui: {
    showDialog: (dialogId: string, options?: ExtensionUIDialogOptions) => Promise<void>;
    hideDialog: (dialogId: string) => void;
    showSelector: (selectorId: string, options: { query: string }) => Promise<void>;
    notify: (message: string, type: "info" | "warning" | "error") => void;
    // 註冊自訂元件
    registerComponent: (renderer: EntryRenderer) => void;
    registerWidget: (widget: WidgetDefinition) => void;
    registerDialog: (dialog: DialogDefinition) => void;
    registerSelector: (selector: SelectorDefinition) => void;
  };
  // Event Bus（Extension 間通訊）
  events: {
    on: (event: string, listener: (...args: unknown[]) => void) => () => void;
    emit: (event: string, ...args: unknown[]) => void;
  };
  // Clipboard
  clipboard: {
    read: () => Promise<string>;
    write: (text: string) => Promise<void>;
  };
  // Shell 操作
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

## UI 元件擴充系統

### EntryRenderer：自訂訊息渲染

```typescript
// 範例：渲染自訂 custom_message
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

### Widget：狀態列元件

```typescript
// 範例：Git 狀態 Widget
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

### Dialog：模態對話框

```typescript
// 範例：確認對話框
const confirmDialog: DialogDefinition = {
  id: "confirm-dangerous",
  title: "⚠️ 危險操作確認",
  render: (api, options) => (
    <VStack gap={1} padding={2}>
      <Text>{options.message || "確定要執行此操作嗎？"}</Text>
      <HStack gap={2} justify="flex-end">
        <Button onClick={() => api.ui.hideDialog("confirm-dangerous")}>取消</Button>
        <Button variant="destructive" onClick={() => {
          api.events.emit("confirm-result", true);
          api.ui.hideDialog("confirm-dangerous");
        }}>確定</Button>
      </HStack>
    </VStack>
  ),
  defaultSize: { width: 60, height: 15 },
};
```

### Selector：模糊搜尋選擇器

```typescript
// 範例：檔案選擇器
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

## 官方內建 Extensions 範例

### 1. llama Extension（`packages/coding-agent/src/extensions/llama/`）

```typescript
// 本地 LLM 整合（Ollama、llama.cpp）
export const llamaExtension: Extension = {
  name: "llama",
  version: "1.0.0",
  onLoad: async (api) => {
    // 註冊本地模型 provider
    api.model.registerProvider("ollama", createOllamaProvider());
    api.model.registerProvider("llamacpp", createLlamaCppProvider());
  },
  tools: [
    createModelManagementTool(),  // pull、list、remove 模型
  ],
  commands: [
    { name: "llama-pull", description: "Pull Ollama model", execute: pullModel },
    { name: "llama-list", description: "List local models", execute: listModels },
  ],
};
```

### 2. gondolin Extension（微 VM 沙盒）

```typescript
// packages/coding-agent/src/extensions/gondolin/
// 將工具執行路由到微 VM
export const gondolinExtension: Extension = {
  name: "gondolin",
  version: "1.0.0",
  onLoad: async (api) => {
    // 替換 bash tool 為 VM 版本
    api.tools.replace("bash", createVMBashTool());
    api.tools.replace("write", createVMWriteTool());
  },
  onBeforeToolCall: async (ctx) => {
    // 所有工具在 VM 內執行
    if (ctx.toolCall.name === "bash") {
      return { args: { ...ctx.args, vm: true } };
    }
  },
};
```

### 3. sandbox Extension

```typescript
// 瀏覽器沙盒、WebContainer 整合
export const sandboxExtension: Extension = {
  name: "sandbox",
  version: "1.0.0",
  ui: {
    widgets: [createPreviewWidget()],  // 即時預覽 Web App
    dialogs: [createSandboxConfigDialog()],
  },
  commands: [
    { name: "sandbox-start", execute: startSandbox },
    { name: "sandbox-preview", execute: openPreview },
  ],
};
```

---

## Extension 間通訊：Event Bus

```typescript
// Extension A 發送事件
api.events.emit("my-extension:data-ready", { payload: "data" });

// Extension B 監聽
const unsubscribe = api.events.on("my-extension:data-ready", (data) => {
  console.log("Received:", data);
});

// 系統內建事件
api.events.on("session:message-added", (message) => { /* ... */ });
api.events.on("model:changed", (model) => { /* ... */ });
api.events.on("tool:executed", (toolCall, result) => { /* ... */ });
api.events.on("compaction:triggered", (summary) => { /* ... */ });
```

---

## 熱重載機制

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
      
      // 1. 卸載舊版本
      await runner.unloadExtension(extName, api);
      
      // 2. 清除 require cache（確保重新 import）
      delete require.cache[require.resolve(path.join(dir, filename))];
      
      // 3. 重新載入
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

  // 返回清理函數
  return () => watchers.forEach(w => w.close());
}
```

---

## Settings Schema：類型安全設定

```typescript
// packages/coding-agent/src/core/settings-manager.ts
export interface SettingsConfig {
  // 設定結構定義
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
  // 設定分頁
  tabs?: {
    id: string;
    name: string;
    keys: string[];
  }[];
}

// 範例：my-extension settings
export const myExtensionSettings: SettingsConfig = {
  schema: {
    "myExtension.apiEndpoint": {
      type: "string",
      description: "API 端點 URL",
      default: "https://api.example.com",
    },
    "myExtension.timeout": {
      type: "number",
      description: "請求超時 (ms)",
      default: 30000,
      minimum: 1000,
      maximum: 300000,
    },
    "myExtension.enabledFeatures": {
      type: "array",
      description: "啟用的功能",
      default: ["feature1", "feature2"],
    },
  },
  tabs: [
    { id: "general", name: "一般", keys: ["myExtension.apiEndpoint", "myExtension.timeout"] },
    { id: "features", name: "功能", keys: ["myExtension.enabledFeatures"] },
  ],
};
```

---

## 開發 Extension 實戰步驟

```bash
# 1. 建立 Extension 目錄
mkdir -p ~/.pi/agent/extensions/my-extension
cd ~/.pi/agent/extensions/my-extension

# 2. 建立 package.json
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

# 3. 撰寫 index.ts
cat > index.ts << 'EOF'
import { Extension } from "@earendil-works/pi-coding-agent";

export const myExtension: Extension = {
  name: "my-extension",
  version: "1.0.0",
  onLoad: async (api) => {
    api.logger.info("My Extension loaded!");
    // 註冊工具、指令、UI...
  },
  onUnload: async (api) => {
    api.logger.info("My Extension unloaded!");
  },
  // ...
};
EOF

# 4. 重啟 pi 或觸發熱重載
pi
# 在 TUI 中 /extensions 可看到載入狀態
```

---

## 參考資料

- [GitHub - earendil-works/pi — packages/coding-agent/src/core/extensions/](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/src/core/extensions)
- [Pi 官方文件：Extension 開發指南](https://pi.dev/docs/latest/extensions)
- [Extension 範例：llama](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/src/extensions/llama)
- [Extension 範例：gondolin](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/src/extensions/gondolin)
- [Extension 範例：sandbox](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/src/extensions/sandbox)

---

## 下一篇預告

> **第 8 篇：TUI 架構——Differential Rendering、Component Tree、Layout Engine、CSI 2026**
>
> pi-tui 核心：Virtual DOM Diff 算法、Component 生命週期、Layout Engine（Flex-like）、CSI 2026 同步輸出、Keybindings Manager、Alt Screen、括號貼上、Kitty/iTerm2 圖片協定、Markdown/Editor/Selector 等內建元件。