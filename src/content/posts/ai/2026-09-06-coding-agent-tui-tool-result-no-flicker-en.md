---
title: "Learning from Mature Coding Agents (39): Two Rules for Flicker-Free Tool Result Display in TUIs"
date: 2026-09-06
category: ai
type: deep-dive
tags: [coding-agent, tui, claude-code, codex, opencode, looplane, pi]
lang: en
tldr: "Four coding agent TUIs all follow the same two rules: tools maintain constant height (one-line summary, never jumping from 0 to N lines) and never auto-collapse (only user-initiated expand/collapse). looplane violates both."
description: "Frame-by-frame reproduction of a TUI flicker bug in looplane, followed by source code analysis of Claude Code, Codex CLI, OpenCode, and Pi/OMP to extract two universal rules for flicker-free tool result rendering."
draft: false
series:
  name: "跟成熟 coding agent 學設計"
  order: 39
glossary:
  - term: "ToolGroupBlock"
    definition: "A widget in looplane's TUI that groups consecutive read/search tools into a collapsible block."
  - term: "detail_kind"
    definition: "A tag in looplane (read, search, command, diff, plain) that determines whether a tool is grouped or rendered standalone."
---

> 🌏 [中文版](/posts/ai/2026-09-06-coding-agent-tui-tool-result-no-flicker)

Tool result rendering is where coding agent TUIs break most often. A user reported that looplane's screen would "flash once then disappear," but only provided a static screenshot taken after the flash settled. This post starts by reproducing the issue frame by frame, confirms two independent flicker mechanisms, then compares the approaches of [Claude Code](https://github.com/anthropics/claude-code), [Codex CLI](https://github.com/openai/codex), [OpenCode](https://github.com/sst/opencode), [Pi](https://github.com/badlogic/pi-mono) / [OMP](https://github.com/can1357/oh-my-pi), and extracts two shared rules for flicker-free rendering.

## Reproducing the Problem: Two Flicker Mechanisms

Using Textual's `run_test()` with synthetic event injection, I captured SVG screenshots frame by frame. The reproduction script requires no real provider or workspace — it only injects `ToolStartedEvent` / `ToolCompletedEvent` sequences.

### Mechanism A — Standalone Tool Detail Jumps from Hidden to Large Block

`tool_program` in looplane has `detail_kind` of `"plain"` (not `"read"` or `"search"`), so it mounts as a standalone `ToolActionBlock`, not grouped.

Frame-by-frame observation:

```
Frame 1 (started):  ● tool_program          ← 1 line, detail hidden (display=False)
Frame 2 (completed): ✓ tool_program          ← Instantly jumps to 14+ lines of output
                     [tool-program-v1]
                     ## step 1: list_files
                     src/main.py
                     src/utils.py
                     ...(14 lines)
```

`.tool-detail`'s `display` goes from `False` → `True` with large content injection + `scroll_end(animate=False)` = the viewport shifts dramatically in a single frame. After three consecutive completions, the user's original message is pushed entirely off-screen.

The root cause is in `ToolActionBlock.set_state()`:

```python
# tool_widgets.py
detail_widget.update(self._render_detail(visible_detail))
detail_widget.display = bool(visible_detail)  # False → True in one step
```

### Mechanism B — Grouped Tool Expand/Collapse Cycling

`read_file` / `search_text` have `detail_kind` of `"read"` / `"search"`, causing them to be grouped into a `ToolGroupBlock`.

Frame-by-frame observation:

```
Frame 1: ▼ Exploring 1 item     ← Group expanded, showing ● read_file
Frame 2: ▶ Explored 1 item      ← Auto-collapsed on completion (content disappears)
Frame 3: ▼ Exploring 2 items    ← New tool added, expands again (all completed detail reappears)
Frame 4: ▶ Explored 2 items     ← Collapses again
```

Two pieces of code fight each other:

```python
# tool_widgets.py — ToolGroupBlock
def action_updated(self):               # When all actions reach terminal state
    if not self._user_toggled and not self._is_verbose():
        self.collapsed = True            # → Auto-collapse

def add_action(self, action):           # When a new action joins
    if not self._user_toggled:
        self.collapsed = False           # → Expand again
```

The rapid expand→collapse→expand→collapse cycle is exactly the "flash then disappear" the user reported.

## How Claude Code Does It

Claude Code's tool group component (`CollapsedReadSearchContent`) has three key design choices:

**Always collapsed.** Groups default to collapsed state, showing a one-line summary like `Read 3 files, searched for 2 patterns… Ctrl+O to expand`. Only Ctrl+O expands them. No auto-collapse/expand cycling.

**700ms debounce.** `MIN_HINT_DISPLAY_MS = 700` ensures each tool's hint text displays for at least 700ms, preventing fast-completing tools from flickering past in a single frame.

**Counts only increase.** A `useRef` tracks the maximum seen count, preventing count jitter during re-renders (e.g., "Reading 3 files" regressing to "Reading 2 files").

Individual tool rendering is also fixed-height: `renderToolUseMessage` renders only a one-line description (command text or file path), not raw output. `ToolUseLoader` uses a blinking dot as a spinner. From start to completion, a tool always occupies one line.

## How Codex CLI Does It

[Codex CLI](https://github.com/openai/codex)'s core strategy is **output always visible but line-capped**.

`TOOL_CALL_MAX_LINES = 5` — any tool's output shows at most 5 lines, truncated to `… +N lines (Ctrl+T)`. Full output is accessed through the transcript overlay (Ctrl+T), not inline expansion.

The running state uses `activity_marker()` animation + `"Running"` text — never hidden. Grouped exploring tools show a compact tree:

```
• Explored
  └ Read file1, file2
    Search "query" in path
```

No expand/collapse cycling — always the same compact view.

## How OpenCode Does It

[OpenCode](https://github.com/sst/opencode) splits tools into two categories:

**InlineTool** (most tools): Always one line. Running shows `~ Reading file...`, completed shows `→ Read ~/path/to/file.py`. Height stays at 1 line throughout, with only the text switching from pending → summary.

**BlockTool** (Shell, GenericTool): A bordered panel with output collapsed to `maxLines` (3 for generic, 10 for shell) with `…` truncation. Click to toggle expand/collapse.

No `ToolGroupBlock` concept — each tool renders independently. `showGenericToolOutput` defaults to `false` — generic tool output is hidden unless the user opts in.

## How Pi / OMP Does It

[Pi](https://github.com/badlogic/pi-mono) and [OMP](https://github.com/can1357/oh-my-pi) share the same `renderCall` + `renderResult` architecture.

Tools are mounted and visible from the moment the call arrives — `renderCall` immediately shows the tool name and arguments (e.g., `read ~/path/to/file.py:1-50`), with `toolPendingBg` background color marking the running state. On completion, the background switches to `toolSuccessBg` without changing height.

Result content is collapsed by default: Pi's `FALLBACK_PREVIEW_LINES = 10`, OMP's default renderer uses 4 lines (12 when expanded). The Read tool in collapsed state shows no result at all (`if (!options.expanded && !isError) { return ""; }`), keeping only the status line.

No grouping, no auto-collapse cycling. A global toggle (`app.tools.expand`) expands/collapses all tools at once.

## Two Shared Rules

The four projects use different TUI frameworks (React/Ink, bubbletea, custom Node.js TUI), but all follow the same two rules:

### Rule 1: Constant Tool Height

From appearance to completion, a tool occupies a constant or gradually increasing number of lines — **never jumping from 0 to N**.

| Project | Running Height | Completed Height |
|---|---|---|
| Claude Code | 1 line (summary + spinner) | 1 line (summary) |
| Codex CLI | 1 line (Running + spinner) | 1-5 lines (truncated) |
| OpenCode InlineTool | 1 line (~ pending text) | 1 line (→ summary) |
| Pi / OMP | 1 line (call info + pending bg) | 1 line status + 0-10 line preview |
| **looplane (current)** | **1 line (detail hidden)** | **1 + 14 lines (detail appears instantly)** |

### Rule 2: No Auto-Collapse

None of the projects auto-collapse content when a tool completes. Expand/collapse is always user-controlled.

| Project | Auto-collapse? | Expand Method |
|---|---|---|
| Claude Code | No | Ctrl+O |
| Codex CLI | No | Ctrl+T overlay |
| OpenCode | No | Click toggle |
| Pi / OMP | No | Global toggle |
| **looplane (current)** | **Yes** (`action_updated`) | Ctrl+O |

## Fix Direction

looplane needs two changes:

**1. Default to summary line only** (fixing Rule 1 violation)

On `tool.completed`, show a one-line `collapsed_detail` summary instead of expanding the full detail. The existing `collapsed_detail` mechanism is only used for `run_check` — extending it to all tools is the fix.

```
✓ Tool program (4 steps: list_files · search_text × 2 · read_file)
✓ Read src/main.py:1-50
✓ Search "pattern" → 3 matches
```

**2. Remove auto-collapse** (fixing Rule 2 violation)

Change `ToolGroupBlock.action_updated()`'s `self.collapsed = True` to a no-op, or only collapse at the end of the entire turn. The group title still updates in real-time (`Exploring 3 items` → `Explored 3 items`), but the collapse state stays unchanged.

## References

- [Claude Code](https://github.com/anthropics/claude-code) — Anthropic's official CLI agent, React/Ink TUI
- [Codex CLI](https://github.com/openai/codex) — OpenAI's terminal agent, React/Ink TUI
- [OpenCode](https://github.com/sst/opencode) — Open-source coding agent in Go + bubbletea
- [Pi](https://github.com/badlogic/pi-mono) — Coding agent with custom Node.js TUI framework
- [OMP (Oh-My-Pi)](https://github.com/can1357/oh-my-pi) — Pi fork, same renderCall/renderResult architecture
- [Textual](https://textual.textualize.io/) — Python TUI framework used by looplane
- [Learning from Mature Coding Agents (15): From Full-Screen TUI to Semantic Transcript](/en/posts/ai/2026-08-25-coding-agent-tui-to-transcript-en) — Previous TUI post in this series
