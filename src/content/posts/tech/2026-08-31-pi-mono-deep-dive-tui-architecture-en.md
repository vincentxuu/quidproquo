---
title: "pi-mono Deep Dive 8: TUI Architecture — Differential Rendering, Component Tree, Layout Engine, CSI 2026 Synchronized Output"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, tui, differential-rendering, virtual-dom, layout-engine, csi-2026]
lang: en
series:
  name: "pi-mono Deep Dive"
  order: 8
tldr: "Complete pi-tui core analysis: Virtual DOM Diff for flicker-free rendering, Component lifecycle, Layout Engine (Flex-like), CSI 2026 Synchronized Output avoiding partial frame tearing, Keybindings Manager, Alt Screen, Bracketed Paste, Kitty/iTerm2 Image Protocol, built-in components (Markdown, Editor, Selector, Diff, Border, Loader, etc.)."
description: "Deep dive into pi-tui terminal UI library: from low-level rendering pipeline to high-level component system. Covers Differential Rendering core algorithm, Component Tree construction and Diff, Layout Engine layout calculation, Terminal abstraction layer, CSI 2026 Synchronized Output standard, Keybindings system, Alt Screen switching, Bracketed Paste, Image protocol support, built-in component library (Markdown, Editor, Selector, Diff, Border, Loader, ScrollView, etc.). For engineers researching Terminal UI architecture and Differential Rendering implementation."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-31-pi-mono-deep-dive-tui-architecture)

## TL;DR

- **Differential Rendering**: Virtual DOM Diff → Minimal ANSI Sequences → Flicker-free
- **Component Tree**: Component base class, render(), diff(), mount/unmount, Context passing
- **Layout Engine**: Flex-like (VStack/HStack/Box/Flex), Dynamic sizing, Constraint solving
- **CSI 2026**: Synchronized Output, Batched ANSI, Avoids partial frame tearing
- **Terminal Abstraction**: Raw Mode, Alt Screen, Mouse, Bracketed Paste, Kitty/iTerm2 Images
- **Keybindings**: Chord Support, Platform Normalize, Editor/App Two Default Sets
- **Built-in Components**: Markdown, Editor, Selector, Diff, Border, Loader, ScrollView, etc.

---

## Why Build Own TUI Library?

| Need | Existing Solutions | pi-tui Solution |
|---|---|---|
| Flicker-free | blessed, ink have flicker | Differential Rendering + CSI 2026 |
| Image Support | Rare | Native Kitty/iTerm2 Protocol |
| Responsive Layout | Manual Calculation | Flex-like Layout Engine |
| Complex Keybindings | Simple Mapping | Chord, Modifier, Platform Normalize |
| Component Composition | Fragmented | Unified Component Tree + Context |

---

## Core Architecture: Rendering Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                        TUI Rendering Pipeline                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. State Change                                                │
│     │                                                           │
│     ▼                                                           │
│  2. Component Tree Re-render                                    │
│     │  Root.render(context) → New Virtual Tree                 │
│     │                                                           │
│     ▼                                                           │
│  3. Virtual DOM Diff                                            │
│     │  diff(oldTree, newTree) → Patch List                     │
│     │  (Type/Props/Children Comparison)                         │
│     │                                                           │
│     ▼                                                           │
│  4. Patch → ANSI Sequences                                      │
│     │  Each Patch → Minimal ANSI Escape Codes                   │
│     │                                                           │
│     ▼                                                           │
│  5. CSI 2026 Synchronized Output                                │
│     │  DCS 1 s / DCS 2 s Batched Output                         │
│     │  Terminal Atomically Renders Entire Frame                │
│     │                                                           │
│     ▼                                                           │
│  6. Terminal Write                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component System

### Component Base Class

```typescript
// packages/tui/src/index.ts
export abstract class Component {
  // Unique Identifier (for Diff)
  abstract readonly type: string;
  // Props (Immutable)
  props: Readonly<Record<string, unknown>>;
  // Children (Other Components)
  children: Component[];
  // Internal State (Optional)
  state: Record<string, unknown>;

  constructor(props: Record<string, unknown> = {}, children: Component[] = []) {
    this.props = props;
    this.children = children;
    this.state = {};
  }

  // Core: Render to Virtual Node
  abstract render(context: RenderContext): VirtualNode;

  // Lifecycle
  mount?(context: RenderContext): void | Promise<void>;
  unmount?(context: RenderContext): void | Promise<void>;
  update?(prevProps: Record<string, unknown>, context: RenderContext): void | Promise<void>;
}
```

### VirtualNode: Diff Basic Unit

```typescript
export interface VirtualNode {
  type: string;                    // Component type
  props: Record<string, unknown>;  // Props
  children: VirtualNode[];         // Children
  key?: string;                    // Optional Key (for List Diff)
  ref?: Component;                 // Corresponding Real Component
}
```

### RenderContext: Rendering Context

```typescript
export interface RenderContext {
  terminal: Terminal;              // Terminal Abstraction
  layout: LayoutContext;           // Layout Constraints
  theme: Theme;                    // Theme Colors
  focus: FocusManager;             // Focus Management
  // Event Handlers
  onKey: (key: KeyEvent) => void;
  onMouse: (mouse: MouseEvent) => void;
  onPaste: (text: string) => void;
}
```

---

## Differential Rendering: Diff Algorithm

### Core Diff Function

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
  // 1. Node Type Different → Full Replace
  if (!oldNode || !newNode || oldNode.type !== newNode.type) {
    patches.push({ type: "replace", path, newNode });
    return;
  }

  // 2. Props Diff
  const propPatches = diffProps(oldNode.props, newNode.props);
  if (propPatches.length > 0) {
    patches.push({ type: "props", path, patches: propPatches });
  }

  // 3. Children Diff (Keyed Diff)
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

### Children Diff (Keyed Algorithm)

```typescript
function diffChildren(
  oldChildren: VirtualNode[],
  newChildren: VirtualNode[],
  basePath: number[]
): Patch[] {
  const patches: Patch[] = [];
  
  // Build Old Node Key Map
  const oldKeyed = new Map<string, { node: VirtualNode; index: number }>();
  oldChildren.forEach((node, i) => {
    if (node.key) oldKeyed.set(node.key, { node, index: i });
  });

  let oldIndex = 0;
  for (let newIndex = 0; newIndex < newChildren.length; newIndex++) {
    const newChild = newChildren[newIndex];
    const path = [...basePath, newIndex];

    if (newChild.key) {
      // Has Key: Try Match
      const match = oldKeyed.get(newChild.key);
      if (match) {
        // Found Match: Recursive Diff, Mark Used
        diffNode(match.node, newChild, path, patches);
        oldKeyed.delete(newChild.key);
      } else {
        // Insert New
        patches.push({ type: "insert", path, node: newChild });
      }
    } else {
      // No Key: Match by Index
      if (oldIndex < oldChildren.length) {
        diffNode(oldChildren[oldIndex], newChild, path, patches);
        oldIndex++;
      } else {
        patches.push({ type: "insert", path, node: newChild });
      }
    }
  }

  // Remaining Old Nodes: Remove
  for (const { index } of oldKeyed.values()) {
    patches.push({ type: "remove", path: [...basePath, index] });
  }
  for (; oldIndex < oldChildren.length; oldIndex++) {
    patches.push({ type: "remove", path: [...basePath, oldIndex] });
  }

  return patches;
}
```

### Patch Application: Convert to ANSI

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
        // Remove Old, Render New
        terminal.erase(target.bounds);
        renderNode(terminal, patch.newNode, target.bounds);
        break;
      case "props":
        // Update Props (Color, Style)
        applyPropPatches(terminal, target, patch.patches);
        break;
      case "insert":
        // Shift Subsequent, Render New
        terminal.insertLines(patch.path[patch.path.length - 1], 1);
        renderNode(terminal, patch.node, calculateBounds(...));
        break;
      case "remove":
        // Remove, Shift Subsequent
        terminal.deleteLines(patch.path[patch.path.length - 1], 1);
        break;
    }
  }
}
```

---

## Layout Engine: Flex-like Layout

### Layout Primitives

```typescript
// packages/tui/src/layout.ts
export interface LayoutNode {
  // Size Constraints
  width?: number | "auto" | "fill";
  height?: number | "auto" | "fill";
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  // Flexbox Style
  flexDirection?: "row" | "column";
  flexWrap?: "nowrap" | "wrap";
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  alignSelf?: "auto" | "flex-start" | "center" | "flex-end" | "stretch";
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: number | "auto";
  // Spacing
  gap?: number;
  padding?: number | { top: number; right: number; bottom: number; left: number };
  margin?: number | { top: number; right: number; bottom: number; left: number };
  // Positioning
  position?: "relative" | "absolute";
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}
```

### Built-in Layout Components

```typescript
// VStack: Vertical Stack
export class VStack extends Component {
  render(context: RenderContext): VirtualNode {
    return {
      type: "VStack",
      props: { children: this.children, gap: this.props.gap },
      children: this.children.map(c => c.render(context)),
    };
  }
}

// HStack: Horizontal Stack
export class HStack extends Component { ... }

// Box: Box Model (padding/margin/border)
export class Box extends Component { ... }

// Flex: Full Flex Container
export class Flex extends Component { ... }

// Spacer: Flexible Space
export class Spacer extends Component {
  render() { return { type: "Spacer", props: { flexGrow: 1 } }; }
}
```

### Layout Calculation Flow

```typescript
// 1. Calculate Fixed Size Nodes
// 2. Allocate Fill/Auto Space
// 3. Handle flexGrow/flexShrink
// 4. Apply justifyContent/alignItems
// 5. Calculate Absolute Coordinates, Return Bounds

export function calculateLayout(
  root: VirtualNode,
  constraints: { width: number; height: number }
): LayoutResult {
  // Two-Pass Algorithm: First Pass Sizes, Second Pass Positions
  const sized = calculateSizes(root, constraints);
  const positioned = calculatePositions(sized, { x: 0, y: 0 });
  return positioned;
}
```

---

## CSI 2026 Synchronized Output

### Problem: Partial Frame Tearing

Traditional:
```typescript
// Sequential Write → Terminal May Render Mid-way → Flicker
terminal.write("\x1b[31m");  // Red
terminal.write("Hello");      // Text
terminal.write("\x1b[0m");    // Reset
// User Might See: Red "Hello" Flash Then Normal
```

### CSI 2026 Solution

```typescript
// packages/tui/src/terminal.ts
export class Terminal {
  private syncBuffer: string[] = [];
  private inSync = false;

  // Begin Sync Block
  beginSynchronizedUpdate(): void {
    this.inSync = true;
    this.syncBuffer = [];
    // DCS 1 s = Begin Synchronized Update
    this.rawWrite("\x1bP1$s");
  }

  // End Sync Block → Atomic Output
  endSynchronizedUpdate(): void {
    // DCS 2 s = End Synchronized Update
    this.rawWrite("\x1bP2$s");
    this.inSync = false;
    
    // Batch Write Buffer
    const output = this.syncBuffer.join("");
    this.syncBuffer = [];
    this.rawWrite(output);
  }

  // Write (Buffered in Sync Mode)
  write(data: string): void {
    if (this.inSync) {
      this.syncBuffer.push(data);
    } else {
      this.rawWrite(data);
    }
  }

  // Raw Write
  private rawWrite(data: string): void {
    process.stdout.write(data);
  }
}
```

### In Rendering Pipeline

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

## Terminal Abstraction Layer

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
    this.write("\x1b[?1049h");  // Enter Alt Screen
    this.altScreen = true;
  }

  exitAltScreen(): void {
    if (!this.altScreen) return;
    this.write("\x1b[?1049l");  // Exit Alt Screen
    this.altScreen = false;
  }
}
```

### Key Event Normalization

```typescript
// packages/tui/src/keys.ts
export interface KeyEvent {
  key: string;           // Normalized: "a", "Enter", "ctrl+c", "shift+tab"
  code: string;          // Raw Code
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
  sequence: string;      // Raw Input Sequence
}

export function normalizeKeyEvent(raw: Buffer): KeyEvent {
  const seq = raw.toString();
  // Handle CSI, SS3, Modifier Combinations
  // Unified Output: ctrl+c, alt+enter, shift+tab, cmd+k, etc.
  return parseSequence(seq);
}
```

### Bracketed Paste Mode

```typescript
// Auto-detect and Handle Large Paste
enableBracketedPaste(): void {
  this.write("\x1b[?2004h");  // Enable
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

### Kitty / iTerm2 Image Protocol

```typescript
// Support Inline Image Rendering
export function renderImage(
  terminal: Terminal,
  image: { data: Buffer; width: number; height: number; format: "png" | "jpg" },
  options: { placement?: "inline" | "background"; id?: string } = {}
): void {
  const base64 = image.data.toString("base64");
  const id = options.id || `img_${Date.now()}`;
  
  // Kitty Image Protocol
  terminal.write(
    `\x1b_Gq=2,f=100,i=${id},w=${image.width},h=${image.height};${base64}\x1b\\`
  );
  
  // iTerm2 Proprietary
  if (isITerm2()) {
    terminal.write(`\x1b]1337;File=inline=1;width=${image.width}px;height=${image.height}px:${base64}\x07`);
  }
}
```

---

## Keybindings Manager

### System Architecture

```typescript
// packages/tui/src/keybindings.ts
export class KeybindingsManager {
  private bindings: Map<string, Keybinding[]> = new Map();  // context → bindings
  private globalBindings: Keybinding[] = [];

  // Register
  register(context: string, binding: Keybinding): void {
    const arr = this.bindings.get(context) ?? [];
    arr.push(binding);
    this.bindings.set(context, arr);
  }

  // Handle Key
  handle(key: KeyEvent, context: string): boolean {
    // 1. Check Context Bindings
    for (const binding of this.bindings.get(context) ?? []) {
      if (matchesKey(key, binding.key)) {
        binding.action();
        return true;
      }
    }
    // 2. Check Global Bindings
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
  // Optional: Condition
  when?: (context: RenderContext) => boolean;
}
```

### Default Bindings

```typescript
// Editor Keybindings (Editor Mode)
export const DEFAULT_EDITOR_KEYBINDINGS: Keybinding[] = [
  { key: "ctrl+a", action: () => moveToLineStart(), description: "Move to line start" },
  { key: "ctrl+e", action: () => moveToLineEnd(), description: "Move to line end" },
  { key: "ctrl+k", action: () => killLine(), description: "Kill line" },
  { key: "ctrl+y", action: () => yank(), description: "Yank" },
  { key: "ctrl+left", action: () => moveWordLeft(), description: "Word left" },
  { key: "ctrl+right", action: () => moveWordRight(), description: "Word right" },
  { key: "alt+backspace", action: () => killWordLeft(), description: "Kill word left" },
];

// App Keybindings (Application Mode)
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

## Built-in Component Library

### MarkdownComponent: Markdown Rendering

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

// Supports: Headings, Bold/Italic, Code Blocks, Lists, Links, Tables, Blockquotes, Task Lists
// Code Blocks: Syntax Highlighting (Built-in Themes), Copy Button
```

### EditorComponent: Code Editor

```typescript
export class EditorComponent extends Component {
  // Features: Syntax Highlighting, Line Numbers, Cursor, Selection, Undo/Redo
  // Keyboard: Emacs/Vim Modes, Tab/Shift+Tab Indent
  // Integration: Language Server (Hover, Completion, Diagnostics)
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

### SelectorComponent: Fuzzy Selector

```typescript
export class SelectorComponent extends Component {
  // Fuzzy Search, Keyboard Navigation, Preview Panel, Multi-select
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

### DiffComponent: Code Diff Display

```typescript
export class DiffComponent extends Component {
  // Unified Diff, Side-by-side, Inline Highlighting
  // Operations: Expand/Collapse, Jump to Next Change, Accept/Reject
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

### Other Components

| Component | Function |
|---|---|
| `Border` | Borders (Single, Double, Rounded, Title) |
| `Loader` / `CancellableLoader` | Loading Animation, Cancellable |
| `ScrollView` | Scrollable Area, Virtualized |
| `Text` / `TruncatedText` | Text, Auto-truncate |
| `Input` | Text Input, Password, Validation |
| `Button` | Button, Variants, Loading State |
| `Checkbox` / `Radio` / `Switch` | Form Controls |
| `Dialog` / `ConfirmationDialog` | Modal Dialogs |
| `Tooltip` / `Popover` | Hover Tooltips |

---

## Theme System

```typescript
// packages/tui/src/theme.ts
export interface Theme {
  // Base Colors
  background: string;
  foreground: string;
  border: string;
  // Semantic Colors
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  // Component Specific
  editor: { background: string; lineNumber: string; cursor: string; selection: string };
  selector: { selected: string; matched: string; preview: string };
  diff: { added: string; removed: string; context: string };
  // Syntax Highlighting
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

## References

- [GitHub - earendil-works/pi — packages/tui/](https://github.com/earendil-works/pi/tree/main/packages/tui)
- [Pi Official Docs: TUI Architecture](https://pi.dev/docs/latest/tui)
- [CSI 2026 Synchronized Output](https://github.com/microsoft/terminal/blob/main/doc/synchronized-output.md)
- [Kitty Graphics Protocol](https://sw.kovidgoyal.net/kitty/graphics-protocol/)
- [iTerm2 Proprietary Escape Codes](https://iterm2.com/documentation-escape-codes.html)
- [Virtual DOM Diff Algorithm](https://github.com/snabbdom/snabbdom)

---

## Next Up

> **Part 9: Model Catalog, Provider Factory, OAuth & Credential Sync**
>
> Model Catalog Auto-generation Details, Provider Factory Registration, Lazy Loading Implementation, OAuth Flow (PKCE, Token Refresh), Credential Store (Keychain/Libsecret/Credential Manager), Credential Sync Cross-device Sync, Model Scope Diagnostics, Credential Synchronization Operation.