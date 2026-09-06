---
title: "跟成熟 coding agent 學設計（39）：TUI 工具結果不閃爍的兩條共同規則"
date: 2026-09-06
category: ai
type: deep-dive
tags: [coding-agent, tui, claude-code, codex, opencode, looplane, pi]
lang: zh-TW
tldr: "四個 coding agent 的 TUI 都遵守同樣兩條規則：工具高度恆定（1 行摘要，不從 0 跳到 N 行）、不自動收合（只有使用者手動展開才會展開）。looplane 兩條都違反了。"
description: "逐幀重現 looplane TUI 的工具閃爍 bug，再拆解 Claude Code、Codex CLI、OpenCode、Pi/OMP 四個專案的原始碼，歸納出工具結果不閃爍的兩條共同設計規則。"
draft: false
series:
  name: "跟成熟 coding agent 學設計"
  order: 39
glossary:
  - term: "ToolGroupBlock"
    definition: "looplane TUI 裡把連續的 read/search 工具合併成一個可收合群組的 widget。"
  - term: "detail_kind"
    definition: "looplane 用來分類工具的標籤（read、search、command、diff、plain），決定要不要把工具歸進群組。"
---

> 🌏 [English version](/en/posts/ai/2026-09-06-coding-agent-tui-tool-result-no-flicker-en)

Coding agent 的 TUI 裡，工具執行結果的渲染是最容易出 bug 的地方。使用者回報 looplane 的畫面會「閃一下然後消失」，但只有事後靜態截圖，沒有閃爍當下的影像。這篇記錄從逐幀重現開始，確認了兩個獨立的閃爍機制，再比對 [Claude Code](https://github.com/anthropics/claude-code)、[Codex CLI](https://github.com/openai/codex)、[OpenCode](https://github.com/sst/opencode)、[Pi](https://github.com/badlogic/pi-mono) / [OMP](https://github.com/can1357/oh-my-pi) 四個專案的做法，歸納出「不閃爍」的兩條共同規則。

## 問題重現：兩個閃爍機制

用 Textual 的 `run_test()` 搭配合成事件注入，逐幀擷取 SVG 截圖。重現腳本不需要真實 provider 或 workspace，只注入 `ToolStartedEvent` / `ToolCompletedEvent` 序列。

### 機制 A — standalone 工具的 detail 從隱藏跳到大區塊

`tool_program` 在 looplane 裡的 `detail_kind` 是 `"plain"`（不屬於 `"read"` 或 `"search"`），所以它直接掛成獨立的 `ToolActionBlock`，不進群組。

逐幀觀察：

```
Frame 1 (started):  ● tool_program          ← 1 行，detail 隱藏（display=False）
Frame 2 (completed): ✓ tool_program          ← 瞬間跳到 14+ 行完整輸出
                     [tool-program-v1]
                     ## step 1: list_files
                     src/main.py
                     src/utils.py
                     ...（14 行）
```

`.tool-detail` 的 `display` 從 `False` → `True` + 大量內容注入 + `scroll_end(animate=False)` = 畫面在一個 frame 內大幅跳動。連續三次後，使用者的原始訊息被完全推出 viewport。

根本原因在 `ToolActionBlock.set_state()`：

```python
# tool_widgets.py
detail_widget.update(self._render_detail(visible_detail))
detail_widget.display = bool(visible_detail)  # False → True，一步完成
```

### 機制 B — grouped 工具的「展開→收合」循環

`read_file` / `search_text` 的 `detail_kind` 是 `"read"` / `"search"`，會被收進 `ToolGroupBlock`。

逐幀觀察：

```
Frame 1: ▼ Exploring 1 item     ← 群組展開，顯示 ● read_file
Frame 2: ▶ Explored 1 item      ← 完成後自動收合（內容消失）
Frame 3: ▼ Exploring 2 items    ← 新工具加入，又展開（完成工具的 detail 全部再現）
Frame 4: ▶ Explored 2 items     ← 又收合
```

兩段程式碼互相打架：

```python
# tool_widgets.py — ToolGroupBlock
def action_updated(self):               # 所有 action 都 terminal 時
    if not self._user_toggled and not self._is_verbose():
        self.collapsed = True            # → 自動收合

def add_action(self, action):           # 新 action 加入時
    if not self._user_toggled:
        self.collapsed = False           # → 又展開
```

快速「展開→收合→展開→收合」就是使用者看到的「閃一下然後消失」。

## Claude Code 怎麼做

Claude Code 的工具群組（`CollapsedReadSearchContent`）有三個關鍵設計：

**永遠收合**：群組預設就是收合狀態，顯示一行摘要如 `Read 3 files, searched for 2 patterns… Ctrl+O to expand`。只有使用者按 Ctrl+O 才會展開。沒有自動收合/展開循環。

**700ms debounce**：`MIN_HINT_DISPLAY_MS = 700` 確保每個工具的提示文字至少顯示 700ms，避免快速完成的工具在一個 frame 內閃過。

**計數只增不減**：用 `useRef` 追蹤最大計數值，防止 re-render 時計數跳動（例如從「Reading 3 files」回退到「Reading 2 files」）。

單一工具的渲染也是固定高度：`renderToolUseMessage` 只渲染一行描述（指令文字或檔案路徑），不是 raw output。`ToolUseLoader` 用閃爍圓點作為 spinner，工具從開始到完成，高度始終是一行。

## Codex CLI 怎麼做

[Codex CLI](https://github.com/openai/codex) 的核心策略是**輸出永遠可見但限制行數**。

`TOOL_CALL_MAX_LINES = 5`——任何工具的輸出最多顯示 5 行，超過就截斷成 `… +N lines (Ctrl+T)`。完整輸出要透過 transcript overlay（Ctrl+T）查看，不是 inline 展開。

running 狀態用 `activity_marker()` 動畫標記 + `"Running"` 文字，從不隱藏。grouped exploring 工具顯示 compact tree：

```
• Explored
  └ Read file1, file2
    Search "query" in path
```

沒有展開/收合循環——永遠是同一個 compact 視圖。

## OpenCode 怎麼做

[OpenCode](https://github.com/sst/opencode) 把工具分成兩類：

**InlineTool**（大多數工具）：永遠一行。running 時顯示 `~ Reading file...`，完成時顯示 `→ Read ~/path/to/file.py`。高度從頭到尾都是 1 行，只有文字從 pending → summary 切換。

**BlockTool**（Shell、GenericTool）：有邊框面板，輸出預設收合到 `maxLines`（generic 3 行、shell 10 行），帶 `…` 截斷。點擊切換展開/收合。

沒有 `ToolGroupBlock` 概念，每個工具獨立渲染。`showGenericToolOutput` 預設是 `false`——generic 工具的輸出隱藏，除非使用者主動開啟。

## Pi / OMP 怎麼做

[Pi](https://github.com/badlogic/pi-mono) 和 [OMP](https://github.com/can1357/oh-my-pi) 共用同一套 `renderCall` + `renderResult` 架構。

工具從 call 開始就掛載並且可見——`renderCall` 立刻顯示工具名稱和參數（如 `read ~/path/to/file.py:1-50`），背景色用 `toolPendingBg` 標記 running。完成時背景切換到 `toolSuccessBg`，不改變高度。

結果內容預設收合：Pi 的 `FALLBACK_PREVIEW_LINES = 10`，OMP 的 default renderer 用 4 行（expanded 時 12 行）。Read 工具在收合狀態下完全不顯示結果（`if (!options.expanded && !isError) { return ""; }`），只保留 status 行。

沒有群組、沒有自動收合循環。全域 toggle（`app.tools.expand`）一次展開/收合所有工具。

## 兩條共同規則

四個專案的實作各有不同（React/Ink、bubbletea、自訂 TUI framework），但都遵守同樣兩條規則：

### 規則 1：工具高度恆定

工具從出現到完成，佔的行數是恆定或漸增，**從不 0→N 跳動**。

| 專案 | running 高度 | completed 高度 |
|---|---|---|
| Claude Code | 1 行（摘要 + spinner） | 1 行（摘要） |
| Codex CLI | 1 行（Running + spinner） | 1-5 行（截斷） |
| OpenCode InlineTool | 1 行（~ pending text） | 1 行（→ summary） |
| Pi / OMP | 1 行（call info + pending bg） | 1 行 status + 0-10 行 preview |
| **looplane（現行）** | **1 行（detail 隱藏）** | **1 + 14 行（detail 瞬間出現）** |

### 規則 2：不自動收合

沒有任何一個專案會在工具完成後自動把內容收合起來。展開/收合只由使用者手動控制。

| 專案 | 自動收合？ | 展開方式 |
|---|---|---|
| Claude Code | 否 | Ctrl+O |
| Codex CLI | 否 | Ctrl+T overlay |
| OpenCode | 否 | 點擊 toggle |
| Pi / OMP | 否 | 全域 toggle |
| **looplane（現行）** | **是**（`action_updated`） | Ctrl+O |

## 修法方向

looplane 需要修兩處：

**1. 預設只顯示摘要行**（修規則 1 違反）

`tool.completed` 時不直接展開完整 detail，而是顯示一行 `collapsed_detail` 摘要。現有的 `collapsed_detail` 機制只用在 `run_check`，擴展到所有工具即可。

```
✓ Tool program (4 steps: list_files · search_text × 2 · read_file)
✓ Read src/main.py:1-50
✓ Search "pattern" → 3 matches
```

**2. 拿掉自動收合**（修規則 2 違反）

`ToolGroupBlock.action_updated()` 裡的 `self.collapsed = True` 改成 noop，或只在整個 turn 結束時才收合。群組標題仍然即時更新（`Exploring 3 items` → `Explored 3 items`），但不改變收合狀態。

## 參考資料

- [Claude Code](https://github.com/anthropics/claude-code) — Anthropic 的官方 CLI agent，React/Ink TUI
- [Codex CLI](https://github.com/openai/codex) — OpenAI 的終端 agent，React/Ink TUI
- [OpenCode](https://github.com/sst/opencode) — Go + bubbletea 的開源 coding agent
- [Pi](https://github.com/badlogic/pi-mono) — 自訂 Node.js TUI framework 的 coding agent
- [OMP (Oh-My-Pi)](https://github.com/can1357/oh-my-pi) — Pi 的 fork，相同 renderCall/renderResult 架構
- [Textual](https://textual.textualize.io/) — looplane 使用的 Python TUI framework
- [跟成熟 coding agent 學設計（15）：從全螢幕 TUI 到 semantic transcript](/posts/ai/2026-08-25-coding-agent-tui-to-transcript) — 本系列上一篇 TUI 相關文章
