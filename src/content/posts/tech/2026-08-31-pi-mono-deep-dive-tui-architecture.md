---
title: "pi-mono 深度導讀 8：TUI 架構——Differential Rendering、Component Tree、Layout Engine、CSI 2026 同步輸出"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, tui, differential-rendering, virtual-dom, layout-engine, csi-2026]
lang: zh-TW
series:
  name: "pi-mono 深度導讀"
  order: 8
tldr: "pi-tui 核心完整解析：Virtual DOM Diff 算法實現無閃爍渲染、Component 生命週期、Layout Engine（Flex-like VStack/HStack/Box）、CSI 2026 同步輸出避免 partial frame tearing、Keybindings Manager、Alt Screen 管理、括號貼上模式、Kitty/iTerm2 圖片協定、Markdown/Editor/Selector/Diff 等內建元件。"
description: "深入 pi-tui 終端機 UI 函式庫：從底層渲染管線到高階元件系統。涵蓋 Differential Rendering 核心算法、Component Tree 構建與 Diff、Layout Engine 佈局計算、Terminal 抽象層、CSI 2026 同步輸出標準、Keybindings 系統、Alt Screen 切換、Bracketed Paste、圖片協定支援、內建元件庫（Markdown、Editor、Selector、Diff、Border、Loader 等）。適合研究 Terminal UI 架構、Differential Rendering 實作的工程師。"
draft: false
---

> 🌏 [English version](/en/posts/tech/2026-08-31-pi-mono-deep-dive-tui-architecture-en)

## TL;DR

- **Differential Rendering**：Virtual DOM Diff → 最小 ANSI 序列 → 無閃爍
- **Component Tree**：Component 基類、render()、diff()、mount/unmount、Context 傳遞
- **Layout Engine**：Flex-like（VStack/HStack/Box/Flex）、動態尺寸、約束求解
- **CSI 2026**：同步輸出、批次 ANSI、避免 partial frame tearing
- **Terminal 抽象**：Raw Mode、Alt Screen、Mouse、Bracketed Paste、Kitty/iTerm2 圖片
- **Keybindings**：Chord 支援、Platform Normalize、Editor/App 兩套預設
- **內建元件**：Markdown、Editor、Selector、Diff、Border、Loader、ScrollView 等

---

## 為什麼要自建 TUI Library？

| 需求 | 現有方案 | pi-tui 解法 |
|---|---|---|
| 無閃爍 | blessed、ink 有閃爍 | Differential Rendering + CSI 2026 |
| 圖片支援 | 少見 | Kitty/iTerm2 協定原生 |
| 響應式佈局 | 手動計算 | Flex-like Layout Engine |
| 複雜鍵綁 | 簡單 mapping | Chord、Modifier、Platform Normalize |
| 元件組合 | 各自為政 | Unified Component Tree + Context |

---

## 核心架構：渲染管線

```
┌─────────────────────────────────────────────────────────────────┐
│                        TUI Rendering Pipeline                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. State Change                                                │
│     │                                                           │
│     ▼                                                           │
│  2. Component Tree Re-render                                    │
│     │  Root.render(context) → 新 Virtual Tree                  │
│     │                                                           │
│     ▼                                                           │
│  3. Virtual DOM Diff                                            │
│     │  diff(oldTree, newTree) → Patch List                     │
│     │  (Type/Props/Children 比較)                               │
│     │                                                           │
│     ▼                                                           │
│  4. Patch → ANSI Sequences                                      │
│     │  每個 Patch 轉為最小 ANSI Escape Codes                    │
│     │                                                           │
│     ▼                                                           │
│  5. CSI 2026 Synchronized Output                                │
│     │  DCS 1 s / DCS 2 s 批次輸出                               │
│     │  終端機原子性渲染整個 frame                               │
│     │                                                           │
│     ▼                                                           │
│  6. Terminal Write                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component 系統

### Component 基類

```typescript
// packages/tui/src/index.ts
export abstract class Component {
  // 唯一識別（用於 Diff）
  abstract readonly type: string;
  // Props（不可變）
  props: Readonly<Record<string, unknown>>;
  // Children（其他 Component）
  children: Component[];
  // 內部狀態（可選）
  state: Record<string, unknown>;

  constructor(props: Record<string, unknown> = {}, children: Component[] = []) {
    this.props = props;
    this.children = children;
    this.state = {};
  }

  // 核心：渲染為 Virtual Node
  abstract render(context: RenderContext): VirtualNode;

  // 生命週期
  mount?(context: RenderContext): void | Promise<void>;
  unmount?(context: RenderContext): void | Promise<void>;
  update?(prevProps: Record<string, unknown>, context: RenderContext): void | Promise<void>;
}
```

### VirtualNode：Diff 的基本單位

```typescript
export interface VirtualNode {
  type: string;                    // Component type
  props: Record<string, unknown>;  // Props
  children: VirtualNode[];         // Children
  key?: string;                    // 可選 Key（用於列表 Diff）
  ref?: Component;                 // 對應實體 Component
}
```

### RenderContext：渲染上下文

```typescript
export interface RenderContext {
  terminal: Terminal;              // Terminal 抽象
  layout: LayoutContext;           // 佈局約束
  theme: Theme;                    // 主題色彩
  focus: FocusManager;             // 焦點管理
  // 事件處理
  onKey: (key: KeyEvent) => void;
  onMouse: (mouse: MouseEvent) => void;
  onPaste: (text: string) => void;
}
```

---

## Differential Rendering：Diff 算法

### 核心 Diff 函數

```typescript
// packages/tui/src/tui.ts
export function diff(oldNode: VirtualNode | null, newNode: VirtualNode | null): Patch[] {
  const patches: Patch[] = [];
  diffNode(oldNode, newNode, [], patches);
  return patches;
}

function diffNode(
  oldNode: VirtualNode | null,
  newNode: VirtualNode | null,
  path: number[],
  patches: Patch[]
): void {
  // 1. 節點類型不同 → 全部替換
  if (!oldNode || !newNode || oldNode.type !== newNode.type) {
    patches.push({ type: "replace", path, newNode });
    return;
  }

  // 2. Props Diff
  const propPatches = diffProps(oldNode.props, newNode.props);
  if (propPatches.length > 0) {
    patches.push({ type: "props", path, patches: propPatches });
  }

  // 3. Children Diff（Keyed Diff）
  const childPatches = diffChildren(oldNode.children, newNode.children, path);
  patches.push(...childPatches);
}
```

### Props Diff

```typescript
function diffProps(oldProps: Record<string, unknown>, newProps: Record<string, unknown>): PropPatch[] {
  const patches: PropPatch[] = [];
  const allKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);

  for (const key of allKeys) {
    const oldVal = oldProps[key];
    const newVal = newProps[key];
    if (oldVal === newVal) continue;
    if (newVal === undefined) {
      patches.push({ type: "remove", key });
    } else if (oldVal === undefined) {
      patches.push({ type: "add", key, value: newVal });
    } else {
      patches.push({ type: "update", key, value: newVal });
    }
  }
  return patches;
}
```

### Children Diff（Keyed Algorithm）

```typescript
function diffChildren(
  oldChildren: VirtualNode[],
  newChildren: VirtualNode[],
  basePath: number[]
): Patch[] {
  const patches: Patch[] = [];
  
  // 建立舊節點 Key Map
  const oldKeyed = new Map<string, { node: VirtualNode; index: number }>();
  oldChildren.forEach((node, i) => {
    if (node.key) oldKeyed.set(node.key, { node, index: i });
  });

  let oldIndex = 0;
  for (let newIndex = 0; newIndex < newChildren.length; newIndex++) {
    const newChild = newChildren[newIndex];
    const path = [...basePath, newIndex];

    if (newChild.key) {
      // 有 Key：嘗試匹配
      const match = oldKeyed.get(newChild.key);
      if (match) {
        // 找到匹配：遞歸 Diff、標記已用
        diffNode(match.node, newChild, path, patches);
        oldKeyed.delete(newChild.key);
      } else {
        // 新增
        patches.push({ type: "insert", path, node: newChild });
      }
    } else {
      // 無 Key：按索引匹配
      if (oldIndex < oldChildren.length) {
        diffNode(oldChildren[oldIndex], newChild, path, patches);
        oldIndex++;
      } else {
        patches.push({ type: "insert", path, node: newChild });
      }
    }
  }

  // 剩餘舊節點：刪除
  for (const { index } of oldKeyed.values()) {
    patches.push({ type: "remove", path: [...basePath, index] });
  }
  for (; oldIndex < oldChildren.length; oldIndex++) {
    patches.push({ type: "remove", path: [...basePath, oldIndex] });
  }

  return patches;
}
```

### Patch 應用：轉為 ANSI

```typescript
export function applyPatches(
  terminal: Terminal,
  patches: Patch[],
  oldTree: VirtualNode
): void {
  for (const patch of patches) {
    const target = getNodeAtPath(oldTree, patch.path);
    switch (patch.type) {
      case "replace":
        // 移除舊、渲染新
        terminal.erase(target.bounds);
        renderNode(terminal, patch.newNode, target.bounds);
        break;
      case "props":
        // 更新屬性（顏色、樣式等）
        applyPropPatches(terminal, target, patch.patches);
        break;
      case "insert":
        // 位移後續內容、渲染新
        terminal.insertLines(patch.path[patch.path.length - 1], 1);
        renderNode(terminal, patch.node, calculateBounds(...));
        break;
      case "remove":
        // 刪除、位移後續內容
        terminal.deleteLines(patch.path[patch.path.length - 1], 1);
        break;
    }
  }
}
```

---

## Layout Engine：Flex-like 佈局

### 佈局原語

```typescript
// packages/tui/src/layout.ts
export interface LayoutNode {
  // 尺寸約束
  width?: number | "auto" | "fill";
  height?: number | "auto" | "fill";
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  // Flexbox 風格
  flexDirection?: "row" | "column";
  flexWrap?: "nowrap" | "wrap";
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  alignSelf?: "auto" | "flex-start" | "center" | "flex-end" | "stretch";
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: number | "auto";
  // 間距
  gap?: number;
  padding?: number | { top: number; right: number; bottom: number; left: number };
  margin?: number | { top: number; right: number; bottom: number; left: number };
  // 定位
  position?: "relative" | "absolute";
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}
```

### 內建佈局元件

```typescript
// VStack: 垂直堆疊
export class VStack extends Component {
  render(context: RenderContext): VirtualNode {
    return {
      type: "VStack",
      props: { children: this.children, gap: this.props.gap },
      children: this.children.map(c => c.render(context)),
    };
  }
}

// HStack: 水平堆疊
export class HStack extends Component { ... }

// Box: 盒模型（padding/margin/border）
export class Box extends Component { ... }

// Flex: 完整 Flex 容器
export class Flex extends Component { ... }

// Spacer: 彈性空白
export class Spacer extends Component {
  render() { return { type: "Spacer", props: { flexGrow: 1 } }; }
}
```

### 佈局計算流程

```typescript
// 1. 計算固定尺寸節點
// 2. 分配 fill/auto 空間
// 3. 處理 flexGrow/flexShrink
// 4. 應用 justifyContent/alignItems
// 5. 計算絕對座標、回傳 Bounds

export function calculateLayout(
  root: VirtualNode,
  constraints: { width: number; height: number }
): LayoutResult {
  // 兩遍算法：第一遍計算尺寸、第二遍計算位置
  const sized = calculateSizes(root, constraints);
  const positioned = calculatePositions(sized, { x: 0, y: 0 });
  return positioned;
}
```

---

## CSI 2026 Synchronized Output

### 問題：Partial Frame Tearing

傳統寫法：
```typescript
// 逐個寫入 → 終端機可能在中間渲染 → 閃爍
terminal.write("\x1b[31m");  // 紅色
terminal.write("Hello");      // 文字
terminal.write("\x1b[0m");    // 重置
// 使用者可能看到：紅色 "Hello" 閃一下再正常
```

### CSI 2026 解法

```typescript
// packages/tui/src/terminal.ts
export class Terminal {
  private syncBuffer: string[] = [];
  private inSync = false;

  // 開始同步區塊
  beginSynchronizedUpdate(): void {
    this.inSync = true;
    this.syncBuffer = [];
    // DCS 1 s = 開始同步更新
    this.rawWrite("\x1bP1$s");
  }

  // 結束同步區塊 → 原子性輸出
  endSynchronizedUpdate(): void {
    // DCS 2 s = 結束同步更新
    this.rawWrite("\x1bP2$s");
    this.inSync = false;
    
    // 批次寫入緩衝區
    const output = this.syncBuffer.join("");
    this.syncBuffer = [];
    this.rawWrite(output);
  }

  // 寫入（同步模式下進緩衝區）
  write(data: string): void {
    if (this.inSync) {
      this.syncBuffer.push(data);
    } else {
      this.rawWrite(data);
    }
  }

  // 原始寫入
  private rawWrite(data: string): void {
    process.stdout.write(data);
  }
}
```

### 在渲染管線中使用

```typescript
// packages/tui/src/tui.ts
export class TUI {
  render(root: Component): void {
    const newTree = root.render(this.context);
    const patches = diff(this.currentTree, newTree);
    
    this.terminal.beginSynchronizedUpdate();
    try {
      applyPatches(this.terminal, patches, this.currentTree);
    } finally {
      this.terminal.endSynchronizedUpdate();
    }
    this.currentTree = newTree;
  }
}
```

---

## Terminal 抽象層

### Raw Mode & Alt Screen

```typescript
export class Terminal {
  private rawMode = false;
  private altScreen = false;

  enterRawMode(): void {
    if (this.rawMode) return;
    process.stdin.setRawMode(true);
    process.stdin.resume();
    this.rawMode = true;
  }

  exitRawMode(): void {
    if (!this.rawMode) return;
    process.stdin.setRawMode(false);
    process.stdin.pause();
    this.rawMode = false;
  }

  enterAltScreen(): void {
    if (this.altScreen) return;
    this.write("\x1b[?1049h");  // 進入 Alt Screen
    this.altScreen = true;
  }

  exitAltScreen(): void {
    if (!this.altScreen) return;
    this.write("\x1b[?1049l");  // 離開 Alt Screen
    this.altScreen = false;
  }
}
```

### Key Event 正規化

```typescript
// packages/tui/src/keys.ts
export interface KeyEvent {
  key: string;           // 正規化後："a", "Enter", "ctrl+c", "shift+tab"
  code: string;          // 原始碼
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
  sequence: string;      // 原始輸入序列
}

export function normalizeKeyEvent(raw: Buffer): KeyEvent {
  const seq = raw.toString();
  // 處理 CSI、SS3、修飾鍵組合
  // 統一輸出：ctrl+c、alt+enter、shift+tab、cmd+k 等
  return parseSequence(seq);
}
```

### Bracketed Paste Mode

```typescript
// 自動偵測並處理大量貼上
enableBracketedPaste(): void {
  this.write("\x1b[?2004h");  // 啟用
  process.stdin.on("data", (data) => {
    const str = data.toString();
    if (str.startsWith("\x1b[200~") && str.endsWith("\x1b[201~")) {
      const pasted = str.slice(6, -6);
      this.emit("paste", pasted);
    }
  });
}

disableBracketedPaste(): void {
  this.write("\x1b[?2004l");
}
```

### Kitty / iTerm2 圖片協定

```typescript
// 支援行內圖片渲染
export function renderImage(
  terminal: Terminal,
  image: { data: Buffer; width: number; height: number; format: "png" | "jpg" },
  options: { placement?: "inline" | "background"; id?: string } = {}
): void {
  const base64 = image.data.toString("base64");
  const id = options.id || `img_${Date.now()}`;
  
  // Kitty 圖片協定
  terminal.write(
    `\x1b_Gq=2,f=100,i=${id},w=${image.width},h=${image.height};${base64}\x1b\\`
  );
  
  // iTerm2 專有
  if (isITerm2()) {
    terminal.write(`\x1b]1337;File=inline=1;width=${image.width}px;height=${image.height}px:${base64}\x07`);
  }
}
```

---

## Keybindings Manager

### 系統架構

```typescript
// packages/tui/src/keybindings.ts
export class KeybindingsManager {
  private bindings: Map<string, Keybinding[]> = new Map();  // context → bindings
  private globalBindings: Keybinding[] = [];

  // 註冊
  register(context: string, binding: Keybinding): void {
    const arr = this.bindings.get(context) ?? [];
    arr.push(binding);
    this.bindings.set(context, arr);
  }

  // 處理按鍵
  handle(key: KeyEvent, context: string): boolean {
    // 1. 檢查 Context 綁定
    for (const binding of this.bindings.get(context) ?? []) {
      if (matchesKey(key, binding.key)) {
        binding.action();
        return true;
      }
    }
    // 2. 檢查 Global 綁定
    for (const binding of this.globalBindings) {
      if (matchesKey(key, binding.key)) {
        binding.action();
        return true;
      }
    }
    return false;
  }
}

export interface Keybinding {
  key: string;           // "ctrl+c", "alt+enter", "shift+tab"
  action: () => void;
  description?: string;
  // 可選：條件
  when?: (context: RenderContext) => boolean;
}
```

### 預設綁定

```typescript
// Editor Keybindings (編輯器模式)
export const DEFAULT_EDITOR_KEYBINDINGS: Keybinding[] = [
  { key: "ctrl+a", action: () => moveToLineStart(), description: "Move to line start" },
  { key: "ctrl+e", action: () => moveToLineEnd(), description: "Move to line end" },
  { key: "ctrl+k", action: () => killLine(), description: "Kill line" },
  { key: "ctrl+y", action: () => yank(), description: "Yank" },
  { key: "ctrl+left", action: () => moveWordLeft(), description: "Word left" },
  { key: "ctrl+right", action: () => moveWordRight(), description: "Word right" },
  { key: "alt+backspace", action: () => killWordLeft(), description: "Kill word left" },
];

// App Keybindings (應用模式)
export const DEFAULT_APP_KEYBINDINGS: Keybinding[] = [
  { key: "ctrl+c", action: () => abort(), description: "Abort" },
  { key: "ctrl+l", action: () => showModelMenu(), description: "Model menu" },
  { key: "ctrl+p", action: () => cycleModels(), description: "Cycle models" },
  { key: "ctrl+o", action: () => openFile(), description: "Open file" },
  { key: "ctrl+r", action: () => searchHistory(), description: "History search" },
  { key: "tab", action: () => autocomplete(), description: "Autocomplete" },
  { key: "escape", action: () => cancel(), description: "Cancel" },
];
```

---

## 內建元件庫

### MarkdownComponent：Markdown 渲染

```typescript
export class MarkdownComponent extends Component {
  render(context): VirtualNode {
    const { content, theme } = this.props;
    const tokens = parseMarkdown(content);
    return {
      type: "Markdown",
      props: { tokens, theme },
      children: tokens.map(t => renderToken(t, theme)),
    };
  }
}

// 支援：標題、粗體/斜體、代碼塊、列表、連結、表格、引用、任務列表
// 代碼塊：語法高亮（內建主題）、複製按鈕
```

### EditorComponent：代碼編輯器

```typescript
export class EditorComponent extends Component {
  // 功能：語法高亮、行號、游標、選區、撤銷/重做
  // 鍵盤：Emacs/Vim 模式、Tab/Shift+Tab 縮進
  // 整合：Language Server（hover、completion、diagnostics）
  render(context): VirtualNode {
    return {
      type: "Editor",
      props: {
        value: this.props.value,
        language: this.props.language,
        theme: this.props.theme,
        readOnly: this.props.readOnly,
        onChange: this.props.onChange,
      },
    };
  }
}
```

### SelectorComponent：模糊選擇器

```typescript
export class SelectorComponent extends Component {
  // 模糊搜尋、鍵盤導航、預覽面板、多選
  render(context): VirtualNode {
    return {
      type: "Selector",
      props: {
        items: this.props.items,
        query: this.props.query,
        selectedIndex: this.props.selectedIndex,
        preview: this.props.preview,
        onSelect: this.props.onSelect,
        onCancel: this.props.onCancel,
      },
    };
  }
}
```

### DiffComponent：代碼差異顯示

```typescript
export class DiffComponent extends Component {
  // Unified Diff、Side-by-side、行內高亮
  // 操作：展開/摺疊、跳轉下一處變更、接受/拒絕
  render(context): VirtualNode {
    return {
      type: "Diff",
      props: {
        oldText: this.props.oldText,
        newText: this.props.newText,
        viewMode: this.props.viewMode,  // "unified" | "split"
        contextLines: this.props.contextLines,
      },
    };
  }
}
```

### 其他元件

| 元件 | 功能 |
|---|---|
| `Border` | 邊框（單線、雙線、圓角、標題） |
| `Loader` / `CancellableLoader` | 載入動畫、可取消 |
| `ScrollView` | 可捲動區域、虛擬化 |
| `Text` / `TruncatedText` | 文字、自動截斷 |
| `Input` | 文字輸入、密碼、驗證 |
| `Button` | 按鈕、變體、載入狀態 |
| `Checkbox` / `Radio` / `Switch` | 表單控制 |
| `Dialog` / `ConfirmationDialog` | 模態對話框 |
| `Tooltip` / `Popover` | 懸浮提示 |

---

## 主題系統

```typescript
// packages/tui/src/theme.ts
export interface Theme {
  // 基礎色
  background: string;
  foreground: string;
  border: string;
  // 語意色
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  // 元件特定
  editor: { background: string; lineNumber: string; cursor: string; selection: string };
  selector: { selected: string; matched: string; preview: string };
  diff: { added: string; removed: string; context: string };
  // 代碼高亮
  syntax: {
    keyword: string;
    string: string;
    number: string;
    comment: string;
    function: string;
    type: string;
    // ...
  };
}

export const defaultTheme: Theme = { ... };
export const darkTheme: Theme = { ... };
export const lightTheme: Theme = { ... };
```

---

## 參考資料

- [GitHub - earendil-works/pi — packages/tui/](https://github.com/earendil-works/pi/tree/main/packages/tui)
- [Pi 官方文件：TUI 架構](https://pi.dev/docs/latest/tui)
- [CSI 2026 Synchronized Output](https://github.com/microsoft/terminal/blob/main/doc/synchronized-output.md)
- [Kitty Graphics Protocol](https://sw.kovidgoyal.net/kitty/graphics-protocol/)
- [iTerm2 Proprietary Escape Codes](https://iterm2.com/documentation-escape-codes.html)
- [Virtual DOM Diff Algorithm](https://github.com/snabbdom/snabbdom)

---

## 下一篇預告

> **第 9 篇：Model Catalog、Provider Factory、OAuth 與 Credential Sync**
>
> Model Catalog 自動生成細節、Provider Factory 註冊機制、Lazy Loading 實現、OAuth 流程（PKCE、Token Refresh）、Credential Store（Keychain/Libsecret/Credential Manager）、Credential Sync 跨裝置同步、Model Scope Diagnostics、Credential Synchronization Operation。