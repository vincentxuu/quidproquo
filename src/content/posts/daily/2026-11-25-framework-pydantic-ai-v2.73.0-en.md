---
title: "Framework Update | Pydantic AI v2.73.0"
date: 2026-11-25
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI v2.73.0 warns when a request targets a model Anthropic or OpenAI has deprecated, lets SubAgents hand a delegate's deferred tool calls back to the caller, and adds capabilities to Agent.override, along with a few compatibility changes that alter behavior."
tldr: "Pydantic AI v2.73.0 emits DeprecatedModelWarning for models Anthropic or OpenAI has deprecated; SubAgents can pass a delegate's deferred tool calls to the caller and resume once they are answered; Agent.override gains capabilities. Compatibility changes to check: the openai floor moves to 3.50.0, and unified settings that Claude, Gemini and Grok reject are now dropped, so FallbackModel no longer reaches the next model via a 400 error."
series:
  name: "AI Framework Changelog"
  order: 72
---

> :globe: [中文版](/posts/daily/2026-11-25-framework-pydantic-ai-v2.73.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.73.0 |
| Previous version | [v2.71.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.71.0) (the release's full changelog is v2.71.0...v2.73.0; there is no v2.72.0 release) |
| Release date | 2026-11-23 |
| Release Notes | [v2.73.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.73.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21.3k |

## Why this release matters

There is no single headline feature here; the release deals with a few places that stay quiet until something goes wrong. The one most likely to touch you is `DeprecatedModelWarning`: when a request targets a model that Anthropic or OpenAI has deprecated, the framework now warns, so you find out before the provider actually retires it and the API starts failing. The second is multi-agent work: `SubAgents` can now pass a delegate's deferred tool calls (calls waiting on outside confirmation or execution) to the caller and resume the delegate once they are answered, so tools that need human approval or an external system's result can sit inside a sub-agent with the caller replying. The third is a behavior change: when unified settings include fields that Claude, Gemini or Grok reject, they are now dropped instead of sent, so the API no longer returns a 400. That also changes how `FallbackModel` switches models, so check it before upgrading.

## Key Changes

- **`DeprecatedModelWarning`**: a warning when a request targets a model Anthropic or OpenAI has deprecated → the deprecation signal shows up during development instead of as an online failure; if your CI treats warnings as errors, expect it to go red first after the upgrade
- **`SubAgents` forwarding deferred tool calls**: a delegate's deferred tool calls go to the caller, and the delegate resumes once they are answered → the caller can answer a sub-agent's deferred tool calls, so such tools need not live at the outermost level
- **`capabilities` on `Agent.override`, plus exported `AgentInstructions` and `SourcedInstruction`**: tests and temporary overrides can swap a capability directly → no need to rebuild the whole agent to override one ability
- **OpenAI Responses `input_transformations`**: now surfaced in `provider_details` and on the model request span → one more observable field when tracing caching behavior
- **Realtime voice**: `RealtimeSession.append_voice_instructions` for GPT-Live's voice model, a custom voice object accepted for `openai_voice`, and a Twilio Media Streams bridge example
- **Thinking profiles**: added for the Nemotron, Inkling, MiMo, Step, Hy and Ling families on OpenAI-compatible gateways
- **`E2BSandbox(idle_timeout=...)`**: keeps a busy run from being paused by `sandbox_timeout`
- **Image downscaling in `Coder`**: images it reads are scaled to at most 1024 pixels on the longest side, adjustable with `FileSystem(max_image_side=...)` → smaller images reach the model, which should reduce token use
- **Security and robustness fixes**: `safe_download`'s blocked-range table now covers IANA special-purpose ranges (`192.88.99.2/32` and `2001::/23`); `PlaywrightBrowser` redacts CDP endpoint credentials wherever an attach error repeats them; the `gh-aw` engine logs only the origin of its base URL so credentials in `PAI_BASE_URL` stay out of run logs; `web_fetch` no longer ends a run with `ValueError` on unusual HTML numeric values; `clai` now defaults to `openai:gpt-6.1-sol` instead of `openai:gpt-5`

## Breaking Changes

- The `openai` floor rises from 3.31.0 to 3.50.0 on every extra that installs `openai`:
  - Impact: projects that pin `openai` below 3.50.0 will fail to resolve on upgrade
- Unified settings that Claude, Gemini and Grok models reject are dropped instead of sent:
  - Impact: a `FallbackModel` that relied on the 400 to reach a later model now stays on the first model, just without the setting; to keep the setting, list a model that supports it first
- The private `Agent._override_root_capability` context variable now holds a `(capability, injected)` tuple:
  - Impact: code that reads it directly needs updating
- The `coder` extra now installs `pillow>=12.3.0`, and `pydantic-ai-harness[boxd]` now requires `boxd>=0.3.3,<0.4`:
  - Impact: environments that pin older pillow or boxd versions, and code that calls 0.2-only boxd APIs directly
- `Dataset` files and schemas leave out `init=False` evaluator fields, and `ClassVar` annotations no longer break `to_file()`:
  - Impact: workflows that hand-edit or diff existing Dataset files

## Migration Guide

### Upgrading from 2.71.x to 2.73.0

```bash
pip install --upgrade pydantic-ai==2.73.0
# If your environment pins openai to an older version, relax it too:
pip install --upgrade "openai>=3.50.0"
```

After upgrading, run your tests once and watch for three things:

1. Any new `DeprecatedModelWarning` in the output. It means you are using a deprecated model, so replace it now.
2. If you use `FallbackModel` with Claude, Gemini or Grok first, and you set unified settings those models do not support, confirm that staying on the first model without that setting is what you want. If not, put a model that supports the setting first.
3. Any test utilities that depend on `Agent._override_root_capability` should read the new tuple format.

The rest, such as `SubAgents` forwarding deferred calls, `Agent.override(capabilities=...)` and `E2BSandbox(idle_timeout=...)`, is additive and does not affect existing code unless you opt in.

## How It Compares

[v2.71.0](/posts/daily/2026-11-20-framework-pydantic-ai-v2.71.0) added more than a dozen harness primitives at once; this release turns to problems that only show up in deployment: deprecated models, sub-agents that hit tools needing human approval, and how unified settings behave across providers. In the framework race, that suggests Pydantic AI's focus has moved from adding one more primitive to making the existing ones behave in real deployments. We did not find comparable same-day data for the other tracked frameworks, so no side-by-side comparison is made here.

## Today's Takeaway

I assumed the point of "unified settings" was that one configuration works across providers, so a failure should be reported loudly. This release makes the opposite trade-off: it drops unsupported fields so the request still goes through, and the cost is that any `FallbackModel` setup that relied on a 400 to switch models quietly changes behavior. One decision about a cross-provider abstraction affects both error handling and failover strategy, so an upgrade review has to ask not only whether the API changed but whether the failure signals you depend on still exist.

## References

- [Pydantic AI v2.73.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.73.0)
- [Full Changelog: v2.71.0...v2.73.0](https://github.com/pydantic/pydantic-ai/compare/v2.71.0...v2.73.0)
- [pydantic/pydantic-ai GitHub](https://github.com/pydantic/pydantic-ai)
- [PR #14038: DeprecatedModelWarning](https://github.com/pydantic/pydantic-ai/pull/14038)
- [PR #14115: SubAgents forward deferred tool calls](https://github.com/pydantic/pydantic-ai/pull/14115)
- [PR #12551: capabilities on Agent.override](https://github.com/pydantic/pydantic-ai/pull/12551)
- [PR #12426: drop unified settings Claude, Gemini and Grok reject](https://github.com/pydantic/pydantic-ai/pull/12426)
- [PR #14056: OpenAI Responses input_transformations and the openai floor](https://github.com/pydantic/pydantic-ai/pull/14056)
- [PR #14196: Coder image downscaling and FileSystem(max_image_side)](https://github.com/pydantic/pydantic-ai/pull/14196)
- [PR #14212: safe_download IANA special-purpose ranges](https://github.com/pydantic/pydantic-ai/pull/14212)
- [Pydantic AI v2.71.0 update (the previous larger primitives release)](/posts/daily/2026-11-20-framework-pydantic-ai-v2.71.0)
