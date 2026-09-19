---
title: "Making the Invisible Visible: Component Design Philosophy for Agent Chat UI"
date: 2026-09-19
category: ai
type: deep-dive
tags: [agent-ux, chat-ui, vue, streaming, component-design, frontend]
lang: en
tldr: "Traditional chat only needs text bubbles, but AI Agent conversations must surface thinking, tool calls, citations, and progress — we solved this with 12 Vue components, three DisplayModes, and a unified chatBlocks rendering pipeline."
description: "A practical breakdown of AI Agent chat UI component design: streaming-first architecture, DisplayMode tri-state switching, tool grouping, citation marks, and the chatBlocks rendering pipeline."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-19-agent-chat-ui-component-design)

## Why Agent Chat UI Is Fundamentally Different

Traditional chat interfaces rest on a simple assumption: one party sends text, the other replies with text, maybe with an image or file attachment. When the other party is an AI Agent, everything changes — the Agent reasons, calls tools, searches the web, queries a knowledge base, and cites sources, all within the span of generating a single reply.

If you render all of this with a plain text bubble, users see a spinner for 30 seconds, then a wall of text appears. They have no idea what the Agent did, why it took so long, or what the answer is based on.

As Anthropic noted in their [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) guide: agent observability is the foundation of trust. Users need to see the Agent's decision-making process to judge whether the result is reliable. Nielsen Norman Group's [AI Agent UX](https://www.nngroup.com/articles/ai-agent-ux/) research similarly found that making the agent's "working" state visible is a key design pattern for reducing anxiety and building trust.

We spent three months building an Agent chat UI from scratch for our AI assistant platform. Before diving into our approach, let's survey the current landscape.

## How Others Do It: The Agent UI Landscape in 2026

2026 is the year Agent products moved from research demos to mainstream shipping. According to [AYDesign's Agent UI survey](https://www.aydesign.ai/blog/best-ai-agent-ui-examples-2026), leading products have developed a recognizable visual language: a planning surface at the top, a tool call stream in the middle, a memory panel on the side, and trust signals threaded throughout every output.

### Thinking / Reasoning Display

| Product | Approach | Distinguishing Feature |
|---|---|---|
| **ChatGPT** | o-series models have a separate reasoning phase; the composer area shimmers during streaming, then shows a truncated thinking snippet above the reply | Users can choose between Auto / Fast / Thinking modes |
| **Claude.ai** | Adaptive Reasoning (from the 4.6 generation) lets the model decide whether and how much to reason, supporting interleaved thinking — think, call a tool, read the result, think again | Developers set an effort level (standard / high / xhigh / max) instead of a token budget |
| **Gemini** | The web UI added a [thinking level slider](https://nokiapoweruser.com/gemini-web-ui-update-finally-solves-one-of-the-biggest-user-complaints-with-new-thinking-level-controls/) that lets users control reasoning depth | Removed the "standard" option, keeping only Extended Thinking |
| **Cursor** | Agent Mode is the headline feature — reads the codebase, edits files, runs terminal commands, watches output, iterates until done | Version 3.5 added Cloud Agents running in isolated VMs |

**Our take**: Products split into two camps for thinking display. ChatGPT and Gemini use a "post-hoc summary" approach, showing thinking only after it's complete. Claude.ai uses "real-time streaming," letting users watch the reasoning unfold. We chose real-time streaming — in enterprise scenarios, watching the Agent think for 30 seconds builds far more trust than staring at a spinner for 30 seconds.

### Tool Use Display

| Product | Approach | Distinguishing Feature |
|---|---|---|
| **ChatGPT** | Plugin/tool calls use a [Display Mode system](https://developers.openai.com/plugins/concepts/ui-guidelines): composer view, fullscreen surface, chat sheet | Developers can customize the visual presentation of tools |
| **Claude.ai** | Tool use results appear inline in the conversation; Artifacts render in a side panel with live HTML/React/SVG preview | Artifacts are persistent — accessible across sessions, publishable as links |
| **Cursor** | Inline Edit (Cmd+K) highlights code, you describe the change in English, and Cursor returns a [color-coded diff](https://dev.to/sahilkhurana/cursor-ai-2026-the-complete-guide-to-the-ai-native-ide-3n4h) you can accept, reject, or partially apply | Composer diff view and Agent panel are first-class features |
| **Coze Studio** | ByteDance's open-source visual agent platform; tool calls are visualized as nodes on a canvas | Input/output visible for each tool on the workflow canvas |
| **Dify** | Open-source LLM app platform; according to [Jimmy Song's comparison](https://jimmysong.io/blog/open-source-ai-agent-workflow-comparison/), tool calls are displayed as workflow nodes + log panels | RAG pipeline and plugin marketplace integrated in the same interface |

**Our take**: Tool display falls into three paradigms — inline (ChatGPT, Claude.ai), panel (Cursor), and timeline (Coze, Dify). Inline works best for conversational contexts, panels for scenarios needing large display area (like code diffs), and timelines for viewing complete workflows. We chose a hybrid of inline + tool grouping.

### Citation Marking

| Product | Approach | Distinguishing Feature |
|---|---|---|
| **Perplexity** | According to [AI UX Playground's analysis](https://www.aiuxplayground.com/gallery/perplexity-citations/), a horizontal source strip sits above the answer (favicon + title + number), with inline `[1]` number markers | Averages 5-10 inline citations per response, with hover preview |
| **ChatGPT** | Search results shown as card lists, inline citations as superscript number links | Clicking a citation opens the source webpage |
| **Claude.ai** | No native citation UI; references appear as Markdown links in text | Artifacts serve as another form of "verifiable source" |
| **Gemini** | Search results integrated into replies; per the [Google Blog](https://blog.google/products/search/gemini-3-search-ai-mode/), 2026 brought Generative UI with interactive tables, charts, and simulations | Antigravity engine assembles custom layouts in real time |

**Our take**: Perplexity dominates citation UX. According to [AYDesign's citation UI patterns research](https://www.aydesign.ai/blog/ai-citation-source-ui-patterns-2026), 2026 best practice is a multi-layered citation system — inline number superscripts + hover preview popovers + sidebar source lists + original text highlighting. We implemented the first three layers (inline marks + popovers + source lists); the fourth (original text highlighting) is pending completion of our knowledge base reader.

### Streaming Experience

| Product | Approach |
|---|---|
| **ChatGPT** | Token-by-token text streaming, shimmer animation during thinking phase, status text during tool execution ("Searching...", "Running code...") |
| **Claude.ai** | Token-by-token streaming, thinking visible in real time, tool results displayed in one shot after completion |
| **Perplexity** | Source strip and search progress displayed before the answer, then sentence-by-sentence streaming |
| **Cursor** | Code diffs stream line-by-line; [version 3.3](https://www.deployhq.com/guides/cursor) added Build in Parallel subagents; Mission Control provides a grid view for monitoring multiple agents |

**Our take**: Every leading product streams — none waits for a complete response before displaying. The difference lies in the "minimum display unit" — token-level (ChatGPT, Claude.ai), sentence-level (Perplexity), or line-level (Cursor's diffs). We use token-level for text replies and event-level for tool calls (rendered as soon as the tool_use event arrives).

### Summary: Each Product's Strength

As [DEV Community's Agent UX analysis](https://dev.to/victor_desg/agent-ux-is-not-chatbot-ux-and-most-teams-in-2026-ship-them-as-if-they-were-23bi) puts it:

> Claude Code sets the bar for transparent planning, Cursor wins on tool call legibility, ChatGPT leads on memory, Perplexity owns confidence and citation UX, Devin is the cleanest reference for autonomous long-running agents.

With the landscape in view, here are the design choices we made for our AI assistant platform.

## Three Design Principles

Before writing a single component, we established three principles:

### Principle 1: Streaming-first

Agent replies aren't one-shot — they're continuous streams lasting seconds or tens of seconds. Every component must handle the "data is still arriving" state from day one — Markdown rendering token by token, thinking blocks displaying while the Agent is still reasoning, tool call inputs visible before execution begins.

This means no component can assume complete data. Every prop must accept partial state, and the UI must never crash on missing data.

### Principle 2: One Component Per Behavior

Agents exhibit many behaviors: thinking, tool calls, web search, knowledge base retrieval, skill activation, citations, task planning, progress reporting... Cramming everything into a single `MessageBubble` with cascading `v-if` statements quickly becomes spaghetti code.

Our approach: **one behavior maps to one component**, each responsible only for its own rendering logic:

```
ThinkingBlock      — Agent's reasoning process
ToolCall           — Tool invocation (input / output)
CitationMark       — Inline citation marker
CitationPopover    — Citation source popover
WebSearchResults   — Search result cards
RagNodeList        — Knowledge base retrieval results
SkillUsageChip     — Skill activation indicator
TodoList           — Agent's task plan
InlineProgressCard — Real-time progress indicator
StreamingMarkdown  — Streaming Markdown renderer
```

### Principle 3: Unified DisplayMode Tri-state

The same component needs different visual density in different contexts. We defined three `DisplayMode` values:

| Mode | Purpose | Behavior |
|---|---|---|
| `expanded` | Default expanded, full content | Thinking block fully expanded, tool calls show input and output |
| `compact` | Space-saving, summary only | Thinking block collapsed to one line, tool calls show only the name |
| `collapsed` | Minimized, click to expand | Fully collapsed, only the title bar remains |

Every behavior component accepts a `displayMode` prop. The parent `MessageItem` determines the mode based on the message's position in the conversation: the latest message gets `expanded`, history messages get `compact`, and manually collapsed ones get `collapsed`.

## Core Component Breakdown

### ThinkingBlock — Making Thinking Visible

```
┌─ 💭 Agent is thinking... ─────────────┐
│ The user is asking about pest          │
│ identification, let me check the       │
│ knowledge base for related images...   │
│ Found three possible species, let me   │
│ compare the morphological features...  │
└────────────────────────────────────────┘
```

`ThinkingBlock` renders content in real time as the Agent streams thinking tokens. After streaming ends, it automatically collapses to a one-line summary; users can click to expand the full reasoning.

Key design: text during streaming uses an `opacity` fade-in animation, making users feel "the Agent is thinking" rather than "the system is loading." The collapsed summary takes the first 50 characters — no LLM call needed to generate it.

### ToolCall — Tool Invocation Input and Output

```
┌─ 🔧 retrieve_text_nodes ──────────────┐
│ Input: query="pest control methods"    │
│        top_k=15                        │
├────────────────────────────────────────┤
│ Output: 12 results found               │
│ ├─ [Pesticide Manual] similarity 0.92  │
│ ├─ [Pest Control Guide] sim. 0.87     │
│ └─ ...                                │
└────────────────────────────────────────┘
```

`ToolCall` is one of the most complex components. A single Agent reply may contain multiple tool calls, and calls may have causal relationships (search first, then read, then generate).

We introduced **tool grouping**: related tool calls are grouped together, visually represented with indentation and connecting lines to show hierarchy. The grouping logic judges relationships based on temporal ordering and input/output references between tool calls.

We also defined a `ChatToolKind` enum to distinguish tool types, each with its own icon and color:

- `retrieve` → knowledge base icon
- `web_search` → search icon
- `code_interpreter` → code icon
- `skill` → skill icon
- `file_operation` → file icon

### CitationMark + CitationPopover — Inline Citations

```
According to the Pesticide Manual[1],
the recommended treatment uses 95%
mineral oil emulsion[2]...

[1] ──hover──> ┌─────────────────────┐
               │ 📄 Pesticide Manual  │
               │ p.42                │
               │ "95% mineral oil    │
               │  emulsion at 1000x  │
               │  dilution..."       │
               └─────────────────────┘
```

Citations are critical for RAG systems to build trust. `CitationMark` is an inline number marker that, on hover, triggers `CitationPopover` to display the source document name, page number, and original text excerpt.

We deliberately chose popovers over tooltips — citation source text can be lengthy and tooltips can't accommodate it. Users can click the document name within the popover to navigate to the knowledge base file page.

### RagNodeList — Retrieval Results Display

```
┌─ 📚 5 related documents found ────────┐
│ ■■■■■■■■■■ 0.92  Pesticide Manual     │
│ ■■■■■■■■░░ 0.87  Pest Control Guide   │
│ ■■■■■■░░░░ 0.65  Pest Image Atlas     │
│ ■■■■░░░░░░ 0.43  Cultivation Manual   │
│ ■■■░░░░░░░ 0.31  Agriculture Intro    │
└────────────────────────────────────────┘
```

`RagNodeList` visualizes chunks retrieved from the knowledge base, including similarity scores and source documents. Scores use a color gradient, letting users instantly see which sources are most relevant.

In `compact` mode, this component shows only "N results found" in one line; `expanded` mode reveals the full list.

### InlineProgressCard — Real-time Progress

```
┌─ ⏳ Processing... ────────────────────┐
│ ✅ Reading user question               │
│ ✅ Searching knowledge base            │
│ 🔄 Analyzing retrieval results         │
│ ○  Generating reply                    │
└────────────────────────────────────────┘
```

When the Agent executes multi-step tasks, `InlineProgressCard` updates each step's status in real time. This is the most effective component for reducing user anxiety — transforming "no idea what's happening" into "I can see every step."

Progress events come from the backend via SSE (Server-Sent Events); the frontend listens and updates each step's status icon (not started → in progress → complete → failed).

## The chatBlocks Rendering Pipeline

With a dozen components in place, the question becomes: who decides which component to use?

The answer is the **chatBlocks rendering pipeline** — a unified parsing layer that converts the Agent's streaming response into an ordered set of "blocks," each mapping to a component:

```
Agent streaming response
    │
    ▼
┌─ chatBlocks parser ──────────────────┐
│ Parses SSE event stream, identifies  │
│ block types:                          │
│ - text_delta → StreamingMarkdown     │
│ - thinking → ThinkingBlock           │
│ - tool_use → ToolCall                │
│ - tool_result → ToolCall (update)    │
│ - citation → CitationMark            │
│ - skill_use → SkillUsageChip         │
│ - progress → InlineProgressCard      │
│ - todo → TodoList                    │
└──────────────────────────────────────┘
    │
    ▼
MessageItem renders blocks[] in order
```

`MessageItem` no longer receives a monolithic HTML or Markdown blob — it gets a `Block[]` array. Each Block has a `type` and `payload`, and `MessageItem` uses `v-for` with `component :is` for dynamic rendering.

This design delivers three benefits:

1. **Adding a new behavior type requires only a new component + a new parser case** — no changes to `MessageItem`
2. **Display order is controlled by the parser**, independent of DOM render order
3. **Each block updates independently**, preventing full-message re-renders

## i18n: From Day One

Every component label ("Thinking...", "Search results", "N results found", "Tool call") was internationalized from day one. Not because we foresaw multi-language requirements, but because —

> The tech debt of "hardcode Chinese first, add i18n later" never gets repaid once you have more than 10 components.

We used Vue I18n's `useI18n` composable, splitting translation files by feature module (`chat.thinking.title`, `chat.tool.searching`, etc.) to avoid one monolithic translation file.

## Lessons Learned

### What We Got Right

1. **One behavior, one component** keeps each component under 200 lines — easy to read, modify, and test. New team members only need to read one file to understand one behavior's rendering logic.

2. **Unified DisplayMode interface** avoided writing separate expand/collapse logic for every component. Three prop values replaced dozens of `v-if` statements.

3. **The chatBlocks pipeline** separates "parsing" from "rendering." When the backend adds a new event type, the frontend only needs a new component and a new parser case — existing components remain untouched.

### The Price We Paid

1. **TypeScript type explosion**: Each Block has its own payload type, and the discriminated union definition file grows longer with each new type. But it's worth it — types catch "forgot to handle the new block type" at compile time.

2. **Streaming state management complexity**: Every component must handle both "currently streaming" and "streaming ended" states, combined with the DisplayMode tri-state. That's 2 × 3 = 6 scenarios per component. Small components, non-trivial test matrix.

3. **Tool grouping logic is imperfect**: Causal relationships between tool calls can't always be inferred from timing alone. Sometimes two parallel tool calls get incorrectly grouped together. The current approach is "good enough but imperfect."

### If We Did It Again

We'd set up a **Storybook** from day one, visualizing all 6 state combinations with mock data. During actual development, we relied on manually triggering different scenarios in the dev environment — inefficient and prone to missing edge cases.

## Overall

The core challenge of Agent chat UI isn't "how to display text" — it's "how to make the Agent's mental activity visible." Thinking, searching, retrieving, citing, planning — at the API level, these are just JSON event streams. In the user's eyes, they're evidence of whether the Agent can be trusted.

One behavior per component, DisplayMode tri-state switching, the chatBlocks rendering pipeline — these three design decisions let us deliver 12 components from scratch in three months, and we're still confidently adding new features today.

Following Jakob Nielsen's [10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/), the first heuristic — "Visibility of system status" — states that users should always know what the system is doing. Agent chat UI elevates this heuristic from "show a loading indicator" to "show what the Agent is currently thinking, which tools it's using, and what data it found."

This isn't just UI engineering. It's trust engineering.

## References

- [Building effective agents — Anthropic](https://www.anthropic.com/engineering/building-effective-agents)
- [AI Agent UX — Nielsen Norman Group](https://www.nngroup.com/articles/ai-agent-ux/)
- [10 Usability Heuristics for User Interface Design — Nielsen Norman Group](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [Agent UX is not chatbot UX — DEV Community](https://dev.to/victor_desg/agent-ux-is-not-chatbot-ux-and-most-teams-in-2026-ship-them-as-if-they-were-23bi)
- [Best AI agent UI examples in 2026 — AYDesign](https://www.aydesign.ai/blog/best-ai-agent-ui-examples-2026)
- [AI citation and source UI design patterns for 2026 — AYDesign](https://www.aydesign.ai/blog/ai-citation-source-ui-patterns-2026)
- [Citations · Perplexity AI UX Case Study — AI UX Playground](https://www.aiuxplayground.com/gallery/perplexity-citations/)
- [Cursor AI 2026: The Complete Guide — DEV Community](https://dev.to/sahilkhurana/cursor-ai-2026-the-complete-guide-to-the-ai-native-ide-3n4h)
- [Cursor 2026: Composer, Agent Mode, MCP & Background Agent — DeployHQ](https://www.deployhq.com/guides/cursor)
- [Open Source AI Agent Platform Comparison 2026 — Jimmy Song](https://jimmysong.io/blog/open-source-ai-agent-workflow-comparison/)
- [OpenAI Plugin UI Guidelines](https://developers.openai.com/plugins/concepts/ui-guidelines)
- [Google Gemini Web UI Thinking Level Controls — NPowerUser](https://nokiapoweruser.com/gemini-web-ui-update-finally-solves-one-of-the-biggest-user-complaints-with-new-thinking-level-controls/)
- [Gemini 3 AI model in Search — Google Blog](https://blog.google/products/search/gemini-3-search-ai-mode/)
- [Vue.js Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue I18n](https://vue-i18n.intlify.dev/)
- [Server-Sent Events (SSE) — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
