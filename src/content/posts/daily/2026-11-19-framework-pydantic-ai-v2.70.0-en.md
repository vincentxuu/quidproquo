---
title: "Framework Update: Pydantic AI v2.70.0"
date: 2026-11-19
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI v2.70.0 fixes two high-severity ReDoS vulnerabilities in pydantic-ai-harness, and adds harness primitives like ToolSearch, PruneToolResults and StreamGuardrail"
tldr: "The headline in Pydantic AI v2.70.0 is two high-severity security advisories: both the ANSI-stripping logic in ToolOutputLimits and the jwt pattern in secret redaction have ReDoS bugs that let an attacker stall the event loop for tens of seconds to minutes through tool output content. Upgrade pydantic-ai-harness to 0.70.0 right away."
series:
  name: "AI Framework Changelog"
  order: 70
---

> :globe: [中文版](/posts/daily/2026-11-19-framework-pydantic-ai-v2.70.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.70.0 |
| Previous version | [v2.69.0](/posts/daily/2026-11-18-framework-pydantic-ai-v2.69.0-en) |
| Release date | 2026-11-17 |
| Release Notes | [v2.70.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.70.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21.3k |

## Why this release matters

The headline here isn't a feature — it's two advisories the project itself labeled high severity. Both the "strip ANSI escape sequences" and the "find JWTs to redact" logic in `pydantic-ai-harness` use patterns whose runtime is quadratic in the length of the input. Whenever an attacker can influence what a tool returns — a shell command, a file read, a fetched page, an MCP server — a few hundred kilobytes of crafted text is enough to stall the event loop for tens of seconds to minutes, and every other request and agent run sharing that process stalls with it. For any team that wires an agent up to a tool whose output an attacker can influence, this isn't an optional upgrade — it's an incident waiting to happen. On the feature side, the release continues last version's direction: giving agents inside the harness more ways to manage each other's output and failures.

## Key changes

- **ReDoS in ToolOutputLimits' ANSI stripping (GHSA-m4cr-m4qc-9hh3, high)**: when `strip_ansi=True`, the pattern used to strip ANSI escape sequences runs in quadratic time → a few hundred kilobytes of tool output packed with unterminated escape sequences can stall the event loop for tens of seconds to minutes, affecting any app that sets `strip_ansi` to `True` (formerly named `OverflowingToolOutput`) on tool output an attacker can influence
- **ReDoS in secret redaction's jwt pattern (GHSA-5m5q-5qj4-gx9h, high)**: the `jwt` pattern enabled by default in `redact_secrets` / `secret_data()` backtracks in quadratic time → because this guard runs synchronously on the event loop, a few hundred kilobytes of crafted text (a user prompt or tool-returned content) is enough to stall the whole process
- **ToolSearch**: a new tool selector that defers loading tool definitions until they're actually needed (pre-search deferral) → you don't have to stuff every tool's schema into context up front when there are many tools
- **PruneToolResults**: lets the model replace a tool result it just received with its own summary → old tool output in a long conversation doesn't have to keep occupying context
- **StreamGuardrail**: screens streamed text, thinking, and tool-call parts before the caller sees them → a guardrail doesn't have to wait for the whole response to finish before it can step in
- **SubAgent(on_model_error=)**: lets a sub-agent choose to retry or return separately when it hits a model error, independent of `on_failure` → a sub-agent's error handling no longer has to be tied to the overall failure logic

The diagram below shows the attack chain: a string hidden in tool output triggers the quadratic-time scan, and other agent runs' requests get stalled along with it.

```diagram
title: The ReDoS attack chain in pydantic-ai-harness
desc: An attacker plants a crafted string in tool output; the harness scans it with a quadratic-time regex and stalls the event loop, dragging down other agent runs' requests along with it.
caption: Simplified illustration; the actual stall duration depends on input size and server load
step: The attacker sends input with an unterminated escape sequence or a JWT-like string to a tool
step: The tool passes this content straight back to the harness
step: The harness scans it with a quadratic-time regex; the event loop stalls
step: Another agent run sends a new request at the same time
step: That request times out without a response
step: The original tool caller finally gets a response, tens of seconds later
---
<svg viewBox="0 0 640 416">
  <line class="dg-rule" x1="88" y1="72" x2="88" y2="392"/>
  <line class="dg-rule" x1="248" y1="72" x2="248" y2="392"/>
  <line class="dg-rule" x1="408" y1="72" x2="408" y2="392"/>
  <line class="dg-rule" x1="568" y1="72" x2="568" y2="392"/>

  <g data-step="1">
    <path class="dg-line" d="M88 120H244" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="166" y="108" text-anchor="middle" dominant-baseline="central">crafted input</text>
  </g>
  <g data-step="2">
    <path class="dg-line" d="M248 164H400" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="324" y="152" text-anchor="middle" dominant-baseline="central">tool output</text>
  </g>
  <g data-step="3">
    <path class="dg-line dg-line--accent" d="M412 208H440Q448 208 448 216V224Q448 232 440 232H416" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-text--accent" x="460" y="220" text-anchor="start" dominant-baseline="central">quadratic scan</text>
  </g>
  <g data-step="4">
    <path class="dg-line" d="M568 264H416" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="492" y="252" text-anchor="middle" dominant-baseline="central">new request</text>
  </g>
  <g data-step="5">
    <path class="dg-line dg-line--warn dg-line--dashed" d="M412 308H564" marker-end="url(#arrow-warn)"/>
    <text class="dg-edge dg-text--warn" x="488" y="296" text-anchor="middle" dominant-baseline="central">times out</text>
  </g>
  <g data-step="6">
    <path class="dg-line dg-line--dashed" d="M404 352H252" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="328" y="340" text-anchor="middle" dominant-baseline="central">delayed response</text>
  </g>

  <rect class="dg-box dg-box--warn" x="404" y="152" width="8" height="212" rx="2" data-step="2 3 4 5 6"/>

  <rect class="dg-box" x="24" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="88" y="48" text-anchor="middle" dominant-baseline="central">Attacker</text>
  <rect class="dg-box" x="184" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="248" y="48" text-anchor="middle" dominant-baseline="central">Tool</text>
  <rect class="dg-box dg-box--accent" x="344" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="408" y="48" text-anchor="middle" dominant-baseline="central">Harness</text>
  <rect class="dg-box" x="504" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="568" y="48" text-anchor="middle" dominant-baseline="central">Other agent</text>
</svg>
```

## Breaking Changes

There are no renames or signature changes this release, but a few compatibility notes make existing behavior stricter:

- `OpenAIChatModel` now raises `ModelRequestRejectedError` outright if tool definitions are still sent while reasoning is on for GPT-6 models, instead of silently sending them and letting the model decide
  - Affected: code that still passes tools when calling GPT-6 reasoning models
- `GroqModel` now raises `UserError` when `NativeOutput` is used together with function tools
  - Affected: code that mixes `NativeOutput` and function tools on Groq
- OpenRouter's `qwen/qwen3.8-flash` now falls back to `'auto'` or raises `ModelRequestRejectedError` when `tool_choice` is forced while reasoning is on (the model itself rejects forced tool choice while reasoning)
  - Affected: code that forces `tool_choice` for that model

## Migration Guide

### Upgrading from 2.69.x to 2.70.0

```bash
pip install --upgrade pydantic-ai==2.70.0 pydantic-ai-harness==0.70.0
```

Both advisories keep default behavior unchanged, but upgrading right away is strongly recommended:

```python
# 1. If you set strip_ansi=True (formerly OverflowingToolOutput)
# Temporary mitigation before upgrading: leave it at the default, False
ToolOutputLimits(strip_ansi=False)

# 2. If you use redact_secrets() or secret_data() and rely on the default jwt pattern
# Temporary mitigation before upgrading: name the patterns you need explicitly, excluding jwt
secret_data(only=["aws_key", "api_key"])  # jwt not included
```

Both mitigations are only for before you upgrade. The real fix is upgrading `pydantic-ai-harness` to 0.70.0 or later. One more thing to note: the harness on Pydantic AI v1 is stuck at 0.4.0 and can't be upgraded further — you need to move to Pydantic AI v2 first to get this fix.

## Compared to other frameworks

The same week, [CrewAI 1.15.42](https://github.com/crewAIInc/crewAI/releases/tag/1.15.42) bumped its soupsieve dependency to fix CVE-2026-126190, while Pydantic AI's bug this release is in its own harness code. Put together, these point to a trend: agent framework security advisories are no longer just "a dependency has a hole" pass-through problems — more and more are bugs in the framework's own code for handling inherently untrusted input, like LLM and tool output. That echoes the observation in [Agno v3.2.1](/posts/daily/2026-11-18-framework-agno-v3.2.1-en) and last release's Pydantic AI v2.69.0 article: competition between frameworks has extended into the execution environment layer, and how secure that layer is has started to become one of the things worth watching.

## Today's takeaway

I used to think of ReDoS as just a performance bug from a poorly written regex, one that at worst slows down a single request. Seeing the project issue two separate high-severity GHSA advisories for two string-processing functions — stripping ANSI, finding JWTs — made it clear: the content an agent harness processes is content an attacker can influence, and string-cleanup logic that looks harmless is itself part of the attack surface. And because it runs on the event loop, one trigger doesn't stall one request — it stalls every agent run sharing that process.

## References

- [Pydantic AI v2.70.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.70.0)
- [GHSA-m4cr-m4qc-9hh3: Harness ToolOutputLimits ANSI stripping ReDoS](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-m4cr-m4qc-9hh3)
- [GHSA-5m5q-5qj4-gx9h: Harness JWT redaction ReDoS](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-5m5q-5qj4-gx9h)
- [pydantic/pydantic-ai on GitHub](https://github.com/pydantic/pydantic-ai)
- [Full Changelog: v2.69.0...v2.70.0](https://github.com/pydantic/pydantic-ai/compare/v2.69.0...v2.70.0)
- [PR #13139: ToolSearch tools selector](https://github.com/pydantic/pydantic-ai/pull/13139)
- [PR #13634: PruneToolResults](https://github.com/pydantic/pydantic-ai/pull/13634)
- [PR #13667: StreamGuardrail](https://github.com/pydantic/pydantic-ai/pull/13667)
- [PR #13738: SubAgent(on_model_error=)](https://github.com/pydantic/pydantic-ai/pull/13738)
- [CrewAI 1.15.42 Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.42)
- [Framework Update: Pydantic AI v2.69.0 (previous version: sandbox backends and Peers)](/posts/daily/2026-11-18-framework-pydantic-ai-v2.69.0-en)
