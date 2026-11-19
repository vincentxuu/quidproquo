---
title: "Framework Update: Pydantic AI v2.71.0"
date: 2026-11-20
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI v2.71.0 adds over a dozen harness primitives centered on letting unattended long-running tasks know how much budget they have left, when to wrap up, and whether to hand tool errors back to the model"
tldr: "Pydantic AI v2.71.0's biggest change is a batch of more than ten new harness primitives: Goal keeps a run going until it actually meets a defined completion check, WrapUpAtLimits and ReportRemainingBudget handle wrapping up before usage limits hit, and PermissionRule and RequireVerification turn permissions and verification into rules. The one breaking change is PeerNetwork being renamed to PeerConnection."
series:
  name: "AI Framework Changelog"
  order: 71
---

> 🌏 [中文版](/posts/daily/2026-11-20-framework-pydantic-ai-v2.71.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.71.0 |
| Previous version | [v2.70.0](/posts/daily/2026-11-19-framework-pydantic-ai-v2.70.0-en) |
| Release date | 2026-11-18 |
| Release Notes | [v2.71.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.71.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21.3k |

## Why this release matters

Last release (v2.70.0) was about fixing two security vulnerabilities; this one shifts the focus back to features, and it adds more primitives in one go than any recent release. Nearly all of them sit under the harness, and they share one theme: letting a long-running task that nobody is watching know how much budget it has left, when it should wrap up, and whether it should handle an error itself instead of letting the whole run silently fail or get cut off mid-task. Set alongside the sandboxing and security work covered in the v2.69.0 and v2.70.0 articles, this release fills in a different gap — an agent managing its own execution state — and across all three releases a single thread shows through: the harness is turning from "the shell that runs the agent" into "an execution environment the agent can query and depend on." The one breaking change is a class rename with a small blast radius.

## Key changes

- **Goal**: keeps an unattended run going until a caller-defined completion check passes, instead of stopping after a fixed number of turns → a long-running task can be set to stop only once it actually meets the goal, not once it hits a turn or token limit
- **WrapUpAtLimits**: lets an agent produce a final answer when it's about to hit a usage limit, instead of raising `UsageLimitExceeded` outright → a long task no longer comes away with nothing usable just because it hit the limit
- **ReportRemainingBudget**: reports the remaining usage limit and spend budget to the model before every call → the model itself can decide to wrap up early or compress its answer, rather than waiting for an external hard cutoff
- **PermissionRule**: decides whether to allow, ask about, or deny a tool call or shell command by rule → permission logic no longer needs a pile of conditionals; a declarative rule set does the job
- **RequireVerification**: sends a coding agent back to run its checks (tests, lint) when it tries to finish before verifying its own edits → stops output that looks done but was never actually verified from being treated as finished
- **ToolBridge**: keeps the tool list fixed behind `tool_search`, `tool_describe` and `tool_call`, so it doesn't shift as the actual number of tools changes → when there are many tools, or they're added routinely, the prompt cache doesn't get invalidated just because the tool list changed
- **ReportToolErrors**: sends an unhandled tool exception back to the model as a failed tool result instead of ending the run outright → a single tool error no longer wastes an entire long-running task
- **ReportStaleFiles**: proactively tells the model when a workspace file it read has changed or been deleted, instead of letting it keep reasoning over stale content
- **LabelCrossModelHistory**: flags which turns in a conversation's history came from a different model → when a new model picks up a long conversation, it knows which context wasn't its own
- **ModelRouter**: routes requests within the same agent run to different models by rule → simple steps can go to a cheap model, reserving the expensive one for steps that actually need it

The diagram below groups this batch of new primitives into three categories, each with one representative example:

```diagram
title: Pydantic AI v2.71.0's new harness primitives, by category
desc: This release's harness additions fall into three categories — budget and wrap-up, permission and verification, and tools and context — each shown with one representative primitive; the full list is in the text above.
caption: Simplified; each category shows only one representative primitive. See "Key changes" above for the complete list.
---
<svg viewBox="0 0 720 296">
  <path class="dg-line" d="M360 84V106"/>
  <path class="dg-line" d="M120 106H600"/>
  <path class="dg-line" d="M120 106V128"/>
  <path class="dg-line" d="M360 106V128"/>
  <path class="dg-line" d="M600 106V128"/>
  <path class="dg-line" d="M120 184V232"/>
  <path class="dg-line" d="M360 184V232"/>
  <path class="dg-line" d="M600 184V232"/>

  <rect class="dg-box dg-box--accent" x="220" y="20" width="280" height="64" rx="6"/>
  <text class="dg-label" x="360" y="43" text-anchor="middle" dominant-baseline="central">Harness primitives</text>
  <text class="dg-sub" x="360" y="64" text-anchor="middle" dominant-baseline="central">3 categories added in v2.71.0</text>

  <rect class="dg-box" x="8" y="128" width="224" height="56" rx="6"/>
  <text class="dg-label" x="120" y="147" text-anchor="middle" dominant-baseline="central">Budget &amp; wrap-up</text>
  <text class="dg-sub" x="120" y="168" text-anchor="middle" dominant-baseline="central">how much is left, when to stop</text>

  <rect class="dg-box" x="248" y="128" width="224" height="56" rx="6"/>
  <text class="dg-label" x="360" y="147" text-anchor="middle" dominant-baseline="central">Permission &amp; verification</text>
  <text class="dg-sub" x="360" y="168" text-anchor="middle" dominant-baseline="central">allow, ask, or deny by rule</text>

  <rect class="dg-box" x="488" y="128" width="224" height="56" rx="6"/>
  <text class="dg-label" x="600" y="147" text-anchor="middle" dominant-baseline="central">Tools &amp; context</text>
  <text class="dg-sub" x="600" y="168" text-anchor="middle" dominant-baseline="central">errors and staleness reported back</text>

  <rect class="dg-box" x="32" y="232" width="176" height="48" rx="6"/>
  <text class="dg-label" x="120" y="247" text-anchor="middle" dominant-baseline="central">Goal</text>
  <text class="dg-sub" x="120" y="268" text-anchor="middle" dominant-baseline="central">runs until it meets the goal</text>

  <rect class="dg-box" x="272" y="232" width="176" height="48" rx="6"/>
  <text class="dg-label" x="360" y="247" text-anchor="middle" dominant-baseline="central">PermissionRule</text>
  <text class="dg-sub" x="360" y="268" text-anchor="middle" dominant-baseline="central">allow / ask / deny</text>

  <rect class="dg-box" x="512" y="232" width="176" height="48" rx="6"/>
  <text class="dg-label" x="600" y="247" text-anchor="middle" dominant-baseline="central">ToolBridge</text>
  <text class="dg-sub" x="600" y="268" text-anchor="middle" dominant-baseline="central">fixed tool list</text>
</svg>
```

## Breaking Changes

- `PeerNetwork` is renamed to `PeerConnection`, and `Peers(network)` now joins an `InMemoryPeerNetwork` under the agent's `name`
  - Affected: multi-agent code that imports `PeerNetwork` directly or depends on that class name

There are no other breaking changes to existing call patterns this release; everything else is a new capability or an internal performance fix.

## Migration Guide

### Upgrading from 2.70.x to 2.71.0

```bash
pip install --upgrade pydantic-ai==2.71.0
```

```python
# Old (<=2.70.x)
from pydantic_ai.multi_agent import PeerNetwork
network = PeerNetwork(agents=[agent_a, agent_b])

# New (2.71.0+)
from pydantic_ai.multi_agent import PeerConnection
network = PeerConnection(agents=[agent_a, agent_b])
```

The rest of this release's new harness primitives (`Goal`, `PermissionRule`, `ReportRemainingBudget`, and so on) are purely additive: they don't affect existing code unless you opt in, so a plain upgrade is all it takes.

## Compared to other frameworks

The same week, [CrewAI 1.15.44](https://github.com/crewAIInc/crewAI/releases/tag/1.15.44) shipped one single feature — saving files as versioned, shareable artifacts — and [LangGraph 1.2.23](https://github.com/langchain-ai/langgraph/releases/tag/1.2.23) shipped bug fixes only, with no new features. Pydantic AI, by contrast, added over a dozen primitives in one release, all focused on an agent managing its own execution state. That's a different bet than CrewAI's role-based high-level API or LangGraph's fine-grained graph-level control: Pydantic AI is betting on whether an agent can run unattended for a long time, and actually reach its goal without going off the rails — and right now, no other framework has filled in that gap in this much detail.

## Today's takeaway

I used to think the differences between frameworks were mostly about the development interface — declarative, graph-based, or role-based. Seeing Pydantic AI pack in over a dozen primitives that sound almost trivial on their own — `Goal`, `ReportRemainingBudget`, `RequireVerification` — made something click: once an agent genuinely has to run unattended for a long time, the real difference shifts from "how do you define the agent" to "can the agent itself tell how much longer it can run, and whether it's actually done." These primitives fill exactly that gap, and this is the clearest commitment to it I've seen from any framework so far.

## References

- [Pydantic AI v2.71.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.71.0)
- [Full Changelog: v2.70.0...v2.71.0](https://github.com/pydantic/pydantic-ai/compare/v2.70.0...v2.71.0)
- [pydantic/pydantic-ai on GitHub](https://github.com/pydantic/pydantic-ai)
- [PR #13733: Goal](https://github.com/pydantic/pydantic-ai/pull/13733)
- [PR #13670: WrapUpAtLimits](https://github.com/pydantic/pydantic-ai/pull/13670)
- [PR #13747: ReportRemainingBudget](https://github.com/pydantic/pydantic-ai/pull/13747)
- [PR #13751: PermissionRule](https://github.com/pydantic/pydantic-ai/pull/13751)
- [PR #13753: RequireVerification](https://github.com/pydantic/pydantic-ai/pull/13753)
- [PR #13744: ToolBridge](https://github.com/pydantic/pydantic-ai/pull/13744)
- [PR #13745: ReportToolErrors](https://github.com/pydantic/pydantic-ai/pull/13745)
- [PR #13777: PeerNetwork renamed to PeerConnection](https://github.com/pydantic/pydantic-ai/pull/13777)
- [CrewAI 1.15.44 Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.44)
- [LangGraph 1.2.23 Release Notes](https://github.com/langchain-ai/langgraph/releases/tag/1.2.23)
- [Framework Update: Pydantic AI v2.70.0 (previous version: two ReDoS security advisories)](/posts/daily/2026-11-19-framework-pydantic-ai-v2.70.0-en)
