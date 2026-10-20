---
title: "Framework Update: Pydantic AI v2.58.0"
date: 2026-10-21
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI v2.58.0 adds DelegationTasks.steer for mid-run steering of delegated tasks, a run-level timeout/deadline, and patches two MCP/UI-adapter security advisories"
tldr: "Three things in Pydantic AI v2.58.0: (1) `DelegationTasks.steer` lets a running delegated task be redirected mid-flight instead of being cancelled and restarted; (2) a run-level `timeout=` and `RunContext.deadline`, plus per-request `request_timeout`/`max_retries` on `ModelSettings`; (3) two medium-severity security fixes — provider-native MCP configuration could leak server URLs/tokens into OpenTelemetry traces, and a frontend-adapter misconfiguration could let a tool execute with client-chosen arguments without a model request. Also new: an `openai-chatgpt` provider and `ElevenLabsAgentsRealtimeModel`."
series:
  name: "AI Framework Changelog"
  order: 47
---

> 🌏 [中文版](/posts/daily/2026-10-21-framework-pydantic-ai-v2.58.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.58.0 |
| Previous | v2.57.0 |
| Released | 2026-10-19 |
| Release Notes | [v2.58.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.58.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 20.8k |

## Why this version matters

The last release added an approval layer for deciding whether a tool call should reach a human. This one tackles two lower-level problems: can a delegated task change direction mid-run, and how do you set a timeout for a whole agent run instead of per request. `DelegationTasks.steer` lets a running sub-task be redirected without cancelling and restarting it; `timeout=` and `RunContext.deadline` move timeout control from "per model request" to "the whole run." This release also patches two medium-severity security advisories tied to MCP configuration and a frontend adapter — teams using either should upgrade promptly.

## Key Changes

- **Mid-run steering for delegated tasks (`DelegationTasks.steer`)**: a running delegated task can be redirected on the fly → no need to wait for the whole sub-run to finish or force-cancel and restart it, cutting the cost of correcting course mid-flight in long-running agents
- **Run-level timeout and deadline (`timeout=` / `RunContext.deadline`)**: `agent.run()` can now take a timeout that wraps the entire run — every model request and tool call inside it — and tools can read `RunContext.deadline` to know how much time is left → previously timeouts only applied per model request, so a long-running agent could still hang; now the outermost call can cut it off
- **Per-request timeout and retries (new `ModelSettings` fields)**: new `request_timeout` (covers the full stream consumption) and `max_retries` (how many times the provider SDK retries a request) → lets you tune per-provider behavior so one slow provider doesn't drag down the whole run
- **Sign in with your own ChatGPT plan (`openai-chatgpt` provider)**: app users can sign in with their own ChatGPT account and use their own plan's quota instead of needing a separate API key → lowers the adoption bar for end users and shifts billing onto their own subscription
- **ElevenLabsAgentsRealtimeModel**: a new model backend for running realtime voice sessions on the ElevenLabs Agents platform → one more ready-made option for realtime voice agents without wiring up a WebSocket yourself
- **Deduplicated step stores (Sqlite/Postgres/Mongo)**: each snapshot used to re-store the full history; now each message is stored once → noticeably less storage and write volume for long conversations
- **Proactive warning for unsupported settings (`UnsupportedSettingWarning`)**: if a model doesn't support a setting like `timeout`, `max_retries`, or `stop_sequences`, you now get a warning instead of it being silently ignored → easier to catch a setting that "looks set" but isn't actually doing anything

## Breaking Changes

Two items are listed under "⚠️ Compatibility Notes," and the two security fixes effectively force a behavior change too:

- DBOS workflows using `Planning` with an `event_stream_handler`: existing in-flight workflows may fail to recover correctly after upgrading
  - Affects: projects running long agent flows on DBOS with an `event_stream_handler`. Let in-flight workflows finish first, or deploy a new DBOS application version before cutting over.
- `RealtimeTurnCompleteEvent` semantics are now aligned with the exchange boundary that `wait_for_reply()` waits for
  - Affects: projects that rely on realtime-turn completion timing for UI logic — behavior may change. Use each part's `PartEndEvent` instead to decide when a caption should end.
- Security fix GHSA-xv4x-g8mx-ch56 (Medium): provider-native MCP configuration could leak server URLs, authorization tokens, and custom header values into OpenTelemetry request traces even with `include_content=False`; URL-based MCP capabilities could also leak a credential embedded in the URL-derived identifier
  - Affects: projects using provider-native MCP or URL-based MCP capabilities. Upgrade, restrict access to historical traces, and rotate any exposed credentials. Projects pairing Temporal tracing with MCP should note: URL-based MCP activity names stay unchanged to preserve in-flight workflows — only switch to an explicit `id=` once those finish.
- Security fix GHSA-5pfm-2g3g-gh85 (Medium): with a non-empty `message_history` and `manage_system_prompt='server'` (the default), the Vercel AI and AG-UI adapters could execute a tool with client-chosen arguments without a model request (tools requiring approval are unaffected)
  - Affects: projects using the Vercel AI or AG-UI adapter with the default `manage_system_prompt` setting; v1 is unaffected.

## Migration Guide

### Upgrading from v2.57.0 to v2.58.0

```bash
pip install --upgrade "pydantic-ai==2.58.0"
```

After upgrading: if you run long flows on DBOS with an `event_stream_handler`, let existing workflows finish before switching versions. If you use provider-native MCP, audit past traces for stored URLs/tokens and rotate credentials if needed. If you use the Vercel AI or AG-UI adapter with the default `manage_system_prompt`, upgrading alone closes that vulnerability — no code change required.

```python
# Run-level timeout
result = await agent.run(user_prompt, timeout=30)

# Steer a delegated task mid-run
task = agent.delegate(...)
task.steer("switch to answering in Traditional Chinese")
```

## Comparing with other frameworks

This week Mastra shipped agent scopes for permissions, Agno shipped sandboxing for isolation, and Pydantic AI's last release added `ApprovalReviewer` for approval. This release fills in "can you still intervene mid-execution" — `DelegationTasks.steer` lets a delegated task change direction without a full restart, something most graph-based frameworks (LangGraph among them) still have to simulate by re-entering a node. Pydantic AI turns it into an explicit API instead.

## Today's takeaway

I used to think an agent's timeout problem was solved by just setting a timeout on each model request. Seeing this release add both `timeout=` and `RunContext.deadline` made it clear that what actually kills a long run usually isn't one slow request — it's the tool calls, retries, and nested delegations adding up. The timeout needs to wrap the whole flow, not just one step in it.

## References

- [Pydantic AI v2.58.0 release notes — GitHub](https://github.com/pydantic/pydantic-ai/releases/tag/v2.58.0)
- [pydantic/pydantic-ai — GitHub](https://github.com/pydantic/pydantic-ai)
- [GHSA-xv4x-g8mx-ch56 — MCP request telemetry advisory](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-xv4x-g8mx-ch56)
- [GHSA-5pfm-2g3g-gh85 — UI adapter history advisory](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-5pfm-2g3g-gh85)
- [Framework Update: Pydantic AI v2.57.0](/posts/daily/2026-10-17-framework-pydantic-ai-v2.57.0-en)
