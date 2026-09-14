# OMP streaming internals research note

## Scope

Order 16 of the OMP Internals Deep Dive: explain the public `@oh-my-pi/pi-agent` stream contract, the event sequence around model turns and tool execution, and the boundary between `AgentMessage`, LLM messages, and UI state.

## Sources read

| Source | Level | Evidence used |
|---|---|---|
| [packages/agent README](https://github.com/can1357/oh-my-pi/tree/main/packages/agent) | ✅ primary | event sequence, options, state, low-level async iterator, tool updates |
| [repository](https://github.com/can1357/oh-my-pi) | ✅ primary | project identity and package context |

## Cross-check

The package README describes `message_update` as assistant streaming updates carrying `assistantMessageEvent`, while tool progress uses `tool_execution_update`. A tool call creates a new turn after its result is injected. The article treats this as the public package contract and avoids claiming undocumented implementation details about buffering or transport internals.

## Editorial boundary

Do not call the event stream a token stream: it also carries lifecycle, tool, and final-message events. Do not infer that `streamMessage` is persisted context; the README describes it as the current partial message during streaming.
