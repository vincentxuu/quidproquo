---
title: "OMP streaming internals: the event stream is an agent control plane, not a token stream"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, agent-loop, coding-agent, architecture, typescript, streaming]
lang: en
series:
  name: "OMP Internals Deep Dive"
  order: 16
tldr: "OMP's Agent stream does more than print tokens: it separates agent, turn, message, and tool-execution events. Understand the contract to render text deltas, tool progress, and errors without mistaking a partial message for committed conversation state."
description: "A deep dive into the public @oh-my-pi/pi-agent streaming contract: AgentMessage-to-LLM conversion, prompt and tool-call event order, partial state, tool progress, and why UIs should subscribe to typed events instead of guessing conversation state."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-31-omp-streaming-internals)

Post 16 in the [OMP Internals Deep Dive](/en/posts/tech/2026-08-31-omp-agent-loop-double-while) series. Earlier posts covered the loop, context, TUI, and tool boundaries; this one looks at an interface often reduced to “the model prints text”: the stream.

---

## TL;DR

- `agent_start` / `agent_end` describe a complete agent run; `turn_start` / `turn_end` describe one model call plus its tool executions.
- `message_update` represents incremental assistant-message updates; tool progress uses a separate `tool_execution_update` event.
- `AgentMessage` can contain UI or application-specific messages. Only before a model call does `convertToLlm` filter and convert them into LLM messages.
- `streamMessage` is partial state during streaming, not the same thing as a completed message committed to `messages`.
- A UI can support text replies, tool calls, progress, errors, and retries by dispatching explicitly on event types.

## Separate the four levels first

In [@oh-my-pi/pi-agent](https://github.com/can1357/oh-my-pi/tree/main/packages/agent), a stream is not one data type but a hierarchy of events. The outer level is the agent run: it starts with `agent_start` and ends with `agent_end` after replies and tool loops finish.

A run contains one or more turns. A turn consists of one model call and the tool executions requested by that response. The model may return plain text and finish in one turn. If it returns a tool call, the agent injects the tool result into context and starts another turn so the model can read it and continue.

A turn contains messages. User, assistant, and tool-result messages go through `message_start` and `message_end`. An assistant message also receives `message_update` events in between; this is where a UI renders incremental text and tool-call deltas.

Tool execution is the final distinct level. It has its own start, update, and end events, and should not be treated as assistant text.

```text
agent run
├─ turn 1
│  ├─ user message
│  ├─ assistant message_update...
│  └─ tool execution
│     ├─ start
│     ├─ update...
│     └─ end → tool result message
└─ turn 2
   ├─ assistant message_update...
   └─ assistant message_end
```

## The event order for `prompt`

A minimal `agent.prompt("Hello")` roughly produces:

```text
agent_start
turn_start
message_start      user
message_end        user
message_start      assistant
message_update     assistant partial
message_update     assistant partial
message_end        assistant complete
turn_end
agent_end
```

With tools, an assistant message ending is not the end of the run:

```text
message_end             assistant with toolCall
tool_execution_start
tool_execution_update   optional progress
tool_execution_end
message_start/end        toolResult
turn_end
turn_start               next model call
message_update...
```

This distinction matters. If the UI marks the whole run complete as soon as it receives an assistant `message_end`, it will render a tool call as “the model is done” and have nowhere to put the next response. Message completion and agent-run completion are different states.

## `AgentMessage` is not the model wire format

OMP allows `AgentMessage` to contain application-specific message types, such as UI notifications or session events. An LLM understands only standard user, assistant, and tool-result messages. The package makes the boundary explicit:

```text
AgentMessage[]
    → transformContext()   // optional: prune or add external context
    → convertToLlm()
    → LLM Message[]
    → model stream
```

`transformContext` answers “which messages should this call expose to the model?” `convertToLlm` answers “how should custom messages be filtered or transformed?” Mixing those concerns into a stream handler lets display state leak into model context. A UI may display a notification without putting that notification in the prompt.

## Partial state versus committed messages

`AgentState` contains `messages`, `isStreaming`, and `streamMessage`. During streaming, `streamMessage` holds the current partial assistant message; after completion, the application can persist or render the complete message from the event and state updates.

A UI therefore benefits from two paths:

1. On `message_update`, update the active assistant bubble from the delta or partial state.
2. On `message_end`, treat the message as complete and persistable; do not append every delta as a separate message.

This is why the [Agent subscribe API](https://github.com/can1357/oh-my-pi/tree/main/packages/agent#events) is more useful than polling state. Events tell you what happened; state tells you what the current snapshot looks like. The former is good for incremental rendering, the latter for redraw and recovery.

## Tool progress is a separate output

A tool can report progress through `onUpdate` inside `execute`; the README example sends “Reading...” and tool-specific details. This data belongs in a collapsible execution card, not concatenated into the assistant's natural-language reply.

```ts
const readFileTool = {
  name: "read_file",
  label: "Read File",
  parameters: type({ path: type("string") }),
  execute: async (toolCallId, params, signal, onUpdate) => {
    onUpdate?.({
      content: [{ type: "text", text: "Reading..." }],
      details: { path: params.path },
    });
    return { content: [{ type: "text", text: "..." }] };
  },
};
```

A practical UI reducer can focus on three things: append assistant text deltas to the active bubble, update the tool card from tool events, and lock the card on its end event. Other lifecycle events handle spinners, turn separators, and retry controls. That is more reliable than guessing that the model is calling a tool from the text it emits.

## The low-level async iterator

The high-level `Agent` is suitable for ordinary applications: configure initial state, subscribe to events, and call `prompt()`. When you need to drive context yourself or test the event sequence, use the [low-level `agentLoop`](https://github.com/can1357/oh-my-pi/tree/main/packages/agent#low-level-api) async iterator:

```ts
for await (const event of agentLoop([userMessage], context, config)) {
  render(event);
}
```

The tradeoff is direct. The high-level API hides queue, state, and lifecycle management. The low-level API gives the caller every event, which is useful for recorders, snapshot tests, and custom transports. If you only need to show text, do not rewrite the agent loop; if you need to verify that a timeout still produces the right next turn, the low-level iterator provides the necessary observability.

## The takeaway

OMP's stream contract puts incremental model output back inside the larger agent lifecycle. It is not just a token pipe; it is the control plane shared by the UI, tool execution, context conversion, and error handling.

When implementing against it, draw the four levels—agent, turn, message, and tool—before assigning events to state. Then steering, follow-up messages, streaming tools, and retries can be added without making the UI infer internal state from strings.

## References

- [OMP `@oh-my-pi/pi-agent` package README](https://github.com/can1357/oh-my-pi/tree/main/packages/agent)
- [OMP Agent low-level API](https://github.com/can1357/oh-my-pi/tree/main/packages/agent#low-level-api)
- [OMP Agent event subscription](https://github.com/can1357/oh-my-pi/tree/main/packages/agent#events)
