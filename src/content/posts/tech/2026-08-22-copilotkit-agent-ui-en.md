---
title: "CopilotKit Explained: Bring Agent State, Tools, and Human Approval into React"
date: 2026-08-22
category: tech
type: deep-dive
tags: [copilotkit, agent-ui, react, generative-ui, ai-agent]
lang: en
tldr: "CopilotKit is more than a chat box. Its React components, AG-UI events, shared state, and interrupt flows connect an agent's execution to an existing product interface."
description: "A practical guide to CopilotKit's React frontend, Runtime, AG-UI event stream, shared state, generative UI, and human-in-the-loop trade-offs."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-copilotkit-agent-ui)

[CopilotKit](https://docs.copilotkit.ai/) is a frontend stack for bringing AI agents into React applications. It includes ready-made interfaces such as `CopilotChat` and `CopilotSidebar`, but its defining job is deeper: expose agent state to the UI, offer callable application tools, render tool results, and ask a person to decide before a risky action continues.

If all you need is streaming text chat, CopilotKit may be more machinery than necessary. It fits applications where an agent works with product state. A travel planner can update itinerary cards and ask before booking; an analysis agent can build charts and resume from user-edited filters.

This article follows one interaction path: React UI → CopilotKit Runtime → AG-UI agent → state, tool, and interrupt events → React UI. Product and API boundaries were checked against official documentation on **2026-08-22**. CopilotKit v1 and v2 documentation coexist, so pin the API generation before implementation.

## The core is a bidirectional event loop

```text
React components
      │ message / tool / state input
      ▼
CopilotKit provider + runtime
      │ AG-UI event stream
      ▼
Agent backend
      │ text / state snapshot / tool call / interrupt
      └──────────────────────────────► UI
```

The [AG-UI architecture](https://docs.copilotkit.ai/ag-ui/concepts/architecture) represents frontend-agent interaction as an event stream. Text tokens are only one event type. Tool calls, state snapshots, run lifecycle, errors, and custom activities travel through the same connection, so the UI does not have to infer progress from prose.

CopilotKit Runtime sits between frontend and agent, handling connectivity, threads, and event translation. The quickstart includes a built-in agent, but adopting CopilotKit does not require moving every agent into its service. LangGraph, CrewAI, Mastra, Pydantic AI, and custom backends can connect through integrations or AG-UI.

## Start with components, but do not stop there

The official [CopilotChat](https://docs.copilotkit.ai/prebuilt-components/chat) is an inline chat surface; [CopilotSidebar](https://docs.copilotkit.ai/prebuilt-components/sidebar) wraps the main application in a collapsible assistant panel. They are good for proving connectivity, streaming, and thread behavior before replacing styling and message renderers.

```tsx
import { CopilotKit, CopilotSidebar } from "@copilotkit/react-core/v2";

export function App({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CopilotSidebar>{children}</CopilotSidebar>
    </CopilotKit>
  );
}
```

The important design question is which product capabilities the agent may touch. Actions that update data, send messages, or place orders must be re-authorized on the server. Registering a frontend tool means the interface is willing to present a capability; it is not a security boundary.

## Shared state connects agent work to product state

[Shared State](https://docs.copilotkit.ai/coagents/shared-state) maps agent execution state into React. The UI can show progress and intermediate output, while user edits can flow back into the agent. Unlike appending an entire JSON object to the next prompt, shared state has explicit fields and an update lifecycle.

Good candidates include task drafts, step status, selected items, and structured intermediate results. Do not synchronize every frontend detail. Cursor positions, animation state, and purely visual flags add traffic and races without helping the agent. Define the smallest schema the agent must read or write, then assign an owner to each field.

Bidirectional updates can conflict. A user may change a destination while an agent writes an itinerary based on the old value. Production systems need revisions, optimistic rollback, or field-level ownership rather than assuming last-write-wins is always correct.

## Tools, generative UI, and human approval

When an agent calls a known tool, the frontend can render arguments and results as a React component instead of printing JSON. This is controlled generative UI: the model chooses a registered tool, while developers decide what it can do and how it renders.

```tsx
import { useFrontendTool } from "@copilotkit/react-core/v2";
import { z } from "zod";

useFrontendTool({
  name: "showWeather",
  description: "Display weather for a city",
  parameters: z.object({ city: z.string() }),
  handler: async ({ city }) => getWeather(city),
  render: WeatherCard,
});
```

Risky work should not execute merely because a tool call appeared. [Human-in-the-Loop](https://docs.copilotkit.ai/human-in-the-loop) can pause a run, hand the proposal to a custom component, and resume after the user confirms, edits, or rejects it. Approval UI should show the real effect—recipient, amount, or record being changed—not a vague Allow button.

Tool UI and open-ended generative UI are different. Tool UI maps a known call to a reviewed component and fits transactional workflows. Open composition lets the model assemble a UI from a component vocabulary, which requires stricter allowlists, validation, and interaction limits.

## Where it sits among adjacent choices

| Option | Primary boundary | Consider it first when |
|---|---|---|
| CopilotKit | Complete interaction layer across agent, product state, tools, and interrupts | The agent operates the application, not only a chat |
| [assistant-ui](/posts/tech/2026-08-22-assistant-ui-runtime-en) | Chat primitives, runtime adapters, and thread UX | You need fine-grained chat composition across backend adapters |
| [AI Elements](/posts/tech/2026-08-19-vercel-ai-elements-en) | Copy-in AI chat components | You use AI SDK and want component source in the repository |
| [A2UI](/posts/ai/2026-05-23-a2ui-agent-to-ui-protocol-en) | Protocol for declarative UI sent by agents | Multiple clients must render the same UI description |

CopilotKit and assistant-ui overlap in tools and agent-event rendering. The useful distinction is not a feature checklist. CopilotKit starts from bringing an agent into an application; assistant-ui starts from adapting backend state into a complete thread interface. Draw state ownership and approval flow first, and the choice becomes clearer.

## The trade-off

CopilotKit fits React products where agents read and write screen state, invoke application tools, and wait for human decisions. It saves integration work around event protocols, chat, state bridges, and approval UI. In exchange, the team owns another Runtime, protocol, and version boundary.

Start with one narrow workflow: one agent, a small shared-state schema, one read-only tool, and one approved write tool. Prove authorization, retries, cancellation, persistence, and conflict handling before expanding across the product. If the first requirement is only question-and-answer chat, a smaller component layer is usually the better start.

## References

- [CopilotKit Documentation](https://docs.copilotkit.ai/)
- [CopilotKit Quickstart](https://docs.copilotkit.ai/quickstart)
- [AG-UI Core Architecture](https://docs.copilotkit.ai/ag-ui/concepts/architecture)
- [AG-UI State Management](https://docs.copilotkit.ai/ag-ui/concepts/state)
- [CopilotKit Shared State](https://docs.copilotkit.ai/coagents/shared-state)
- [CopilotKit Human-in-the-Loop](https://docs.copilotkit.ai/human-in-the-loop)
- [useFrontendTool v2](https://docs.copilotkit.ai/reference/v2/hooks/useFrontendTool)
- [CopilotChat](https://docs.copilotkit.ai/prebuilt-components/chat)
- [CopilotSidebar](https://docs.copilotkit.ai/prebuilt-components/sidebar)
- [CopilotKit GitHub](https://github.com/CopilotKit/CopilotKit)
