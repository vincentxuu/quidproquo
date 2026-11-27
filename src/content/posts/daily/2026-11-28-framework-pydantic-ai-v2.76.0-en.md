---
title: "Framework Update: Pydantic AI v2.76.0"
date: 2026-11-28
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI v2.76.0 lets a realtime session swap its tool list without dropping the connection, and adds cost rollup across nested sub-agents plus a direct-output path for CodeMode"
tldr: "Pydantic AI v2.76.0's main thread is mid-session tool updates: a new UpdateTools message lets a realtime (voice/streaming) connection change its available tools without reconnecting. It also adds root_conversation_id so nested sub-agent spend rolls up to the outer conversation, and CodeMode can now submit a run's final output directly from sandboxed code. The easiest change to miss: FileSystem.read_file's offset is now 1-indexed instead of 0-indexed."
series:
  name: "AI Framework Changelog"
  order: 75
---

> :globe: [中文版](/posts/daily/2026-11-28-framework-pydantic-ai-v2.76.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.76.0 |
| Previous version | [v2.75.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.75.0) |
| Released | 2026-11-26 |
| Release Notes | [v2.76.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.76.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21.4k |

## Why This Version Matters

Once a realtime (voice/streaming) session starts, its tool list used to be fixed for the life of the connection. Want to add a tool mid-conversation — say, unlock a "transfer money" tool only after the caller passes identity verification — or pull one away? The only option was to drop the connection and reconnect, and in voice interactions that reconnect latency and state loss are hard to hide. This release adds `UpdateTools` to the set of inputs `RealtimeConnection.send` accepts, so an application can push a new tool list straight into a live connection instead of tearing it down. For now this only takes effect for models whose profile declares `supports_tool_updates: True` (the default is `False`), so it reads more like the interface being laid down ahead of provider support. But for voice agents that need to unlock tools in stages — support, identity verification, permission-gated actions — this is the first officially supported way to do it without faking a reconnect.

The same release also fixes a pain point common to multi-agent setups: when a nested sub-agent runs, its cost now rolls up through `root_conversation_id` to the outermost conversation's span. Previously you had to stitch the trace together yourself to see what a whole multi-agent task actually cost. `CodeMode(allow_final_output=True)` is worth flagging too — code running inside the sandbox can now submit the run's entire final output directly, skipping the extra model call that used to be needed just to turn a code result into a structured response.

```diagram
title: Pydantic AI v2.76.0: swapping tools mid-session
desc: Changing the tool list used to mean dropping and reconnecting; UpdateTools pushes a new tool list into a live connection instead.
caption: Simplified — only the tool-update path is shown. Connections to models without supports_tool_updates behave as before.
---
<svg viewBox="0 0 680 320">
  <path class="dg-line" d="M160 94V120" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 176V224" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M520 94V120" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M520 176V224" marker-end="url(#arrow)"/>

  <text class="dg-sub" x="160" y="24" text-anchor="middle" dominant-baseline="central">Before</text>
  <rect class="dg-box dg-box--ghost" x="20" y="38" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="58" text-anchor="middle" dominant-baseline="central">Need to change tools</text>
  <text class="dg-sub" x="160" y="78" text-anchor="middle" dominant-baseline="central">e.g. unlock a tool after verification</text>

  <rect class="dg-box dg-box--ghost" x="20" y="120" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="140" text-anchor="middle" dominant-baseline="central">Drop RealtimeConnection</text>

  <rect class="dg-box dg-box--ghost" x="20" y="224" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="238" text-anchor="middle" dominant-baseline="central">Reconnect</text>
  <text class="dg-sub" x="160" y="258" text-anchor="middle" dominant-baseline="central">audio/state interrupted</text>

  <text class="dg-sub" x="520" y="24" text-anchor="middle" dominant-baseline="central">After 2.76.0</text>
  <rect class="dg-box" x="380" y="38" width="280" height="56" rx="6"/>
  <text class="dg-label" x="520" y="58" text-anchor="middle" dominant-baseline="central">Need to change tools</text>
  <text class="dg-sub" x="520" y="78" text-anchor="middle" dominant-baseline="central">model profile needs supports_tool_updates</text>

  <rect class="dg-box" x="380" y="120" width="280" height="56" rx="6"/>
  <text class="dg-label" x="520" y="140" text-anchor="middle" dominant-baseline="central">send(UpdateTools(...))</text>
  <text class="dg-sub" x="520" y="160" text-anchor="middle" dominant-baseline="central">connection stays up</text>

  <rect class="dg-box" x="380" y="224" width="280" height="56" rx="6"/>
  <text class="dg-label" x="520" y="238" text-anchor="middle" dominant-baseline="central">Conversation continues</text>
  <text class="dg-sub" x="520" y="258" text-anchor="middle" dominant-baseline="central">on the same connection</text>
</svg>
```

## Key Changes

- **Mid-session tool updates (`UpdateTools`)**: `RealtimeInput` gains an `UpdateTools` member, and `RealtimeModelProfile.supports_tool_updates` declares whether a model accepts it → voice/realtime agents can unlock or revoke tools while a connection is live, without reconnecting; defaults to `supports_tool_updates: False` until a given model's profile turns it on
- **Cost rollup across nested sub-agents (`root_conversation_id`)**: nested agent-run spans now record `pydantic_ai.root_conversation_id`, so spend automatically rolls up to the outermost conversation → no more stitching traces together by hand to see what a multi-agent task cost in total
- **`CodeMode(allow_final_output=True)`**: code running in the sandbox can submit the run's entire final output directly → skips the extra round trip of "code finishes → model reads the result → model then emits the structured output"
- **`GoogleInteractionsModel`**: adds stateless support for Google's Interactions API → another way to use Google models that doesn't depend on server-side conversation state
- **Per-tool `ui_visibility`**: tools can individually control whether their results are forwarded to the frontend UI → some tool output (internal debugging info, say) can stay on the model's side instead of passing through the UI adapter to the user
- **Deprecation warning for `gemini-2.5-pro`/`gemini-2.5-flash`**: calling either model through `GoogleModel`/`GoogleInteractionsModel` now raises `DeprecatedModelWarning` → an early signal to move models before the official sunset actually lands

## Breaking Changes

There's no standalone "Breaking Changes" section this time, but a few items under the official ":warning: Compatibility Notes" change existing code's behavior directly:

- `RealtimeInput` gains a new `UpdateTools` member:
  - Impact: code that does an exhaustive match (`assert_never`) over `RealtimeInput` will start failing type-checking, and needs a branch to handle `UpdateTools` (or to raise explicitly)
- `FileSystem.read_file`'s `offset` is now 1-indexed instead of 0-indexed:
  - Impact: calling `read_file(..., offset=N)` from Python, or constructing a `ReadFileArgs`/`ReadFileCallPart` with an explicit `offset`, now starts one line earlier, and `offset=0` raises outright; find call sites that need `+1` with `grep -rn "read_file(.*offset" .`
- With a history-trimming capability like `SummarizingCompaction`/`RelevanceCompaction`, `result.conversation` no longer just carries forward "the last summary" into the next run:
  - Impact: apps that store `result.conversation` in memory and feed it into the next run now get the full history re-summarized on every run; to keep the old behavior (carry forward only the compacted history), switch to passing `result.all_messages()` as `message_history=`, and save a copy of `result.conversation` beforehand if you want to keep the pre-summary messages
- Requests to `gemini-2.5-pro`/`gemini-2.5-flash` now raise `DeprecatedModelWarning` (a `UserWarning`):
  - Impact: any setup that turns warnings into errors (e.g. `filterwarnings = error`) will start failing on requests to these two models; to keep working for now, filter the warning or set `profile={'deprecation': None}`

## Migration Guide

### Upgrading from 2.75.x to 2.76.0

```bash
pip install --upgrade pydantic-ai==2.76.0
```

```python
# Before: an exhaustive match over RealtimeInput with no UpdateTools branch
match realtime_input:
    case TextInput():
        ...
    case AudioInput():
        ...
    case _:
        assert_never(realtime_input)  # fails type-checking from 2.76.0 on

# After: add an UpdateTools branch (or raise explicitly, as needed)
match realtime_input:
    case TextInput():
        ...
    case AudioInput():
        ...
    case UpdateTools():
        ...  # handle the tool-list update, or ignore it deliberately
    case _:
        assert_never(realtime_input)
```

```python
# Before: read_file's offset started at 0
await toolset.read_file(path, offset=0)  # start from the first line

# After: offset starts at 1; offset=0 raises
await toolset.read_file(path, offset=1)  # same as old offset=0
```

```python
# Before: result.conversation stored in memory and passed straight back in
# (with a history-trimming capability, this used to carry forward only "the last summary")
agent_result = await agent.run(prompt, message_history=result.conversation)

# After: to keep "carry forward only the compacted history", use result.all_messages()
# To keep the full messages too, save a copy of result.conversation before the summary runs
agent_result = await agent.run(prompt, message_history=result.all_messages())
```

Everything else — `root_conversation_id`, `CodeMode(allow_final_output=True)`, `GoogleInteractionsModel`, per-tool `ui_visibility` — is additive and doesn't affect existing code unless you opt in.

## Comparison With Other Frameworks

Right now, Pydantic AI is the only one of the frameworks tracked here doing "swap capabilities mid-connection" at the realtime-session layer — LangGraph and CrewAI's recent updates have stayed focused on checkpointing and tool-level feature stacking, not on dynamically changing a model's available tools while a connection is live. That tracks with where Pydantic AI has been placing its bets: the repo description already lists realtime voice as a first-class scenario, and voice interactions are unusually sensitive to reconnect latency — which is likely why this path got built out first, ahead of more broadly useful but lower-impact work.

## Today's Takeaway

I used to assume a realtime session's tool list was part of the connection's setup — fixed alongside the model name and system prompt the moment the connection opens, and only changeable by reconnecting. Seeing `UpdateTools` land made it clear the tool list is closer to "runtime state" than "connection configuration" — there just wasn't a message channel to change it while the connection was alive. Separating tool visibility from connection lifecycle is what finally gives staged tool unlocking — a routine need for voice agents — an officially supported path, instead of making the application layer fake a reconnect to get there.

## References

- [Pydantic AI v2.76.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.76.0)
- [Full Changelog: v2.75.0...v2.76.0](https://github.com/pydantic/pydantic-ai/compare/v2.75.0...v2.76.0)
- [pydantic/pydantic-ai GitHub](https://github.com/pydantic/pydantic-ai)
- [PR #12440: mid-session tool updates (UpdateTools)](https://github.com/pydantic/pydantic-ai/pull/12440)
- [PR #14664: root_conversation_id cost rollup across sub-agents](https://github.com/pydantic/pydantic-ai/pull/14664)
- [PR #11349: CodeMode(allow_final_output=True)](https://github.com/pydantic/pydantic-ai/pull/11349)
- [PR #12636: GoogleInteractionsModel](https://github.com/pydantic/pydantic-ai/pull/12636)
- [PR #14645: per-tool ui_visibility](https://github.com/pydantic/pydantic-ai/pull/14645)
- [PR #13250: FileSystem.read_file offset becomes 1-indexed](https://github.com/pydantic/pydantic-ai/pull/13250)
- [PR #13211: result.conversation behavior change with history-trimming capabilities](https://github.com/pydantic/pydantic-ai/pull/13211)
- [PR #14679: gemini-2.5-pro/gemini-2.5-flash deprecation warning](https://github.com/pydantic/pydantic-ai/pull/14679)
- [Pydantic AI v2.75.0 update (previous release: tightening instruction-authority boundaries)](/posts/daily/2026-11-26-framework-pydantic-ai-v2.75.0-en)
