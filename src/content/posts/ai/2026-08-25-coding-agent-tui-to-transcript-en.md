---
title: "Learning Design from Mature Coding Agents (15): From Full-Screen TUI to Semantic Transcript"
date: 2026-08-25
category: ai
tags: [coding-agent, tui, textual, claude-code, codex, opencode, rivumi]
lang: en
type: deep-dive
description: "Comparing how Claude Code, Codex, Pi, and OpenCode turn event streams into readable terminal UIs, dissecting the semantic transcript design, and tracing rivumi's three-stage evolution from full-screen composition through runtime-first dual modes to one unified conversation."
tldr: "Mature coding agent TUIs never print the event stream directly — they build a typed projection layer first and update it in place. rivumi took three steps (full-screen composition, runtime-first dual modes, removing the Ask/Agent split) before two old constraints — non-streaming output and resume-without-replay — were truly lifted."
draft: false
series:
  name: "跟成熟 coding agent 學設計"
  order: 15
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-tui-to-transcript)

## The Design Problem: What Should an Agent Conversation Look Like in a Terminal?

While a coding agent runs, the underlying reality is a single event stream: model tokens, tool starts, tool completions, permission requests, errors. The core question for any terminal UI is — **how does this stream become a screen a human can actually read?**

The naive answer is to print one line per event. Ten minutes in, you have hundreds of "Reading file... / Done / Reading file..." lines and the important diff is buried. The opposite extreme is chat bubbles: one for You, one for Assistant. But agent conversations aren't chats — a single response can interleave five tool calls and a pending file edit. A binary role model simply doesn't fit.

So there are really two layers to the problem: which *things* should exist on screen (the semantic model), and how the event stream updates those things live (the projection mechanism). I read the source of five mature agents to compare their answers.

## How the Five Projects Do It

### Claude Code: the transcript is a reducer's output, not an event dump

Claude Code's main surface is neither a role-labelled chat nor an activity log. It's a **semantic transcript**. The key is `claude-code-source/src/components/Messages.tsx#Messages`: before anything renders, a full pipeline runs — `normalizeMessages` drops empty messages, `applyGrouping` groups compatible tool calls, `collapseReadSearchGroups` collapses repeated reads and searches, and `buildMessageLookups` (`src/utils/messages.ts#buildMessageLookups`) builds indexes so every tool use correlates with its result. The nesting order is visible on a single line: `collapseReadSearchGroups(groupedMessages)` inside `collapseBackgroundBashNotifications(...)` (`Messages.tsx:520`).

The projected hierarchy is asymmetric. A user prompt is a full-width contrasting row with no "You" heading; prompts over 10,000 characters are capped with head-and-tail retention (`src/components/messages/UserPromptMessage.tsx#UserPromptMessage`) — keeping the tail matters because piped input usually puts the actual question last. Assistant prose is unboxed Markdown with a dot gutter. Each tool is one stable row whose state updates **in place** from queued to done, with its result attached beneath via the `⎿` gutter (`src/components/messages/AssistantToolUseMessage.tsx#AssistantToolUseMessage`). Diffs belong to the edit itself, and permission requests sit at the tail of the scroll flow rather than in a modal that covers everything (`toolPermissionOverlay` in `src/screens/REPL.tsx`).

### Codex: committed cells plus a mutable active cell

Codex's Rust TUI splits the screen into finalized `HistoryCell`s and an in-flight `ChatWidget.active_cell` that mutates in place while streaming — the module header says so explicitly (`codex/codex-rs/tui/src/chatwidget.rs#ChatWidget`). Cells are trait objects: `codex/codex-rs/tui/src/history_cell/mod.rs#HistoryCell`, each semantic type implementing its own rendering. Approvals queue through the bottom pane (`codex/codex-rs/tui/src/bottom_pane/approval_overlay.rs#ApprovalOverlay.enqueue_request`), input is `chat_composer.rs#ChatComposer`, diffs get dedicated rendering in `diff_render.rs#DiffSummary`. Same philosophy — typed cells updated in place — just in Rust.

### Pi: TUI as a library, the agent does its own layout

Pi factors generic rendering into `pi-mono/packages/tui`: components implement `render(width): string[]`, and the core `tui.ts#TUI` differentially renders only changed lines. The interactive mode above it handles session replay and wiring in `pi-mono/packages/coding-agent/src/modes/interactive/interactive-mode.ts`: each `toolCall` in an assistant message creates a `tool-execution.ts#ToolExecutionComponent`, and later `toolResult` messages are matched back via `renderedPendingTools.get(message.toolCallId)` — the correlation key runs unbroken from protocol to UI. The OMP fork keeps the same skeleton (`oh-my-pi/packages/coding-agent/src/modes/components/assistant-message.ts#AssistantMessageComponent`) and layers its own compaction and extensions on top.

### OpenCode: declarative component tree plus sticky scroll

OpenCode writes its TUI in SolidJS. The session route is a `<For each={messages()}>` where user/assistant match to separate components (`opencode/packages/tui/src/routes/session/index.tsx#UserMessage`; left-border contrasting row, no role label), and the scrollbox sets `stickyScroll` + `stickyStart="bottom"` so the view hugs the bottom. Permission requests render as `routes/session/permission.tsx#PermissionPrompt` directly below the transcript. Data comes from the server-synced message/part store; the UI only projects it.

Different mechanisms, same convergence: **none of them print events directly — they build semantic items with stable IDs first, then let events update those items in place.**

## rivumi's Choice and Its Three-Stage Evolution

The heart of this story isn't "who rivumi copied" — it's **how each generation's constraint was lifted by the next**.

**Stage one (M9): full-screen composition.** The first version used Textual to assemble onboarding, task input, activity, approval, and results into one screen (`rivumi/src/rivumi/tui.py#RivumiApp`). Textual's [Screen](https://textual.textualize.io/guide/screens/) and worker machinery handled alternate-screen details and async; a [RichLog](https://textual.textualize.io/widgets/rich_log/) took raw events. But the model contract had no streaming back then, so activity could only tick per step/tool; resume still went through the old line-oriented path because historical event streams couldn't replay inside the TUI. The limits were clear — but "one coherent screen" was proven.

**Stage two (M10): runtime-first dual modes.** After wiring up Claude Code / Codex CLI logins, the composer split into Ask and Agent: Ask read-only with a process-local bounded transcript; Agent behind the full safety gates. This fixed "usable without a raw model ID," but created new awkwardness — every prompt launched a fresh child process and the previous answer got re-fed as hidden prompt text; casual questions and coding requests were forced into two worlds, even though Claude Code and Codex treat them as turns in one session.

**Stage three (M11): removing the split.** This stage did three things. First, one long-lived external session: `rivumi/src/rivumi/conversation_controller.py#ConversationController` holds a single child against the Codex app-server or Claude Agent SDK sidecar, shared across turns. Second, the semantic transcript became first-class: `rivumi/src/rivumi/tui.py#conversation_runtime_event_received` is the sole reducer — `TextDeltaEvent` accumulates streaming text, and `RuntimeToolStartedEvent` finds the existing tool row via `_ensure_tool_action` and flips its state in place. No more one-Activity-line-per-event flood. Third, approvals docked into the transcript flow: `rivumi/src/rivumi/tui.py#request_approval` mounts an `InlineApprovalBlock` right under the tool row that triggered it — diff preview and choices sit in context while the transcript stays visible and scrollable.

And M9's leftover resume problem? Lifted by `rivumi/src/rivumi/conversation.py#ConversationStore`: a strict user/assistant turn schema, 0600 files under a 0700 directory, no vendor session IDs persisted. After restart, rivumi opens a fresh native session and supplies bounded completed-turn replay once — replay went from "impossible" to a first-class operation.

## Engineering Grounding

Three Textual design decisions underpin this evolution. [Screens](https://textual.textualize.io/guide/screens/) separate modal approval from the main surface; M11's docked approval moves back into the same screen's DOM flow, and both modes have official support. [Reactive attributes](https://textual.textualize.io/guide/reactivity/) let in-place updates like `ToolActionBlock.set_state` work without manually repainting lists, and [OptionList](https://textual.textualize.io/widgets/option_list/) guarantees approval choices stack vertically at any terminal width and stay keyboard-selectable. Textual also explicitly recommends RichLog for high-volume log-style output rather than the main DOM — which maps exactly onto M11's decision: diagnostics stay behind Details, and the primary transcript carries only semantic rows.

## What Can Still Improve

Measured against the five references, rivumi is missing three things. First, **grouping and collapsing**: Claude Code collapses consecutive reads (`claude-code-source/src/utils/collapseReadSearch.ts#collapseReadSearchGroups`) and Codex coalesces exec groups; rivumi's `ToolGroupBlock` has the skeleton but a crude grouping policy. Second, **rendering scale on long conversations**: Claude Code switches to a virtualized list past 200 messages and only renders rows near the viewport (`MAX_MESSAGES_WITHOUT_VIRTUALIZATION` in `claude-code-source/src/components/Messages.tsx`); rivumi currently mounts every semantic row in the DOM, which gets heavy on long sessions. Third, **rewind/fork**: OpenCode reverts to any message, and `ConversationStore.fork_before_turn` already exists but isn't wired to the UI yet. The semantic transcript isn't the destination — it's the foundation that gives these features somewhere to grow.

## References

- [Textual documentation](https://textual.textualize.io/) — the design basis for screens, reactivity, and widgets
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono) — packages/tui differential rendering and packages/coding-agent interactive mode
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) — message component evolution in the Pi fork
- [sst/opencode](https://github.com/sst/opencode) — SolidJS session route in packages/tui
- [openai/codex](https://github.com/openai/codex) — HistoryCell architecture in codex-rs/tui
