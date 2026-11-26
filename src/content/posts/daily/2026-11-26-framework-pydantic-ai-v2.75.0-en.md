---
title: "Framework Update: Pydantic AI v2.75.0"
date: 2026-11-26
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI v2.75.0 tightens the boundary on whose words count as instructions: low-authority workspace files and MCP server instructions now have to stay data, not slip into the system prompt"
tldr: "Pydantic AI v2.75.0 is mainly about instruction authority: low-authority workspace files read by RepoContext, Skills and Memory no longer get mixed into the system prompt — they're handed to the model as data instead. with_authority on capabilities now also covers instructions an MCP server sends itself. It also adds ModelEmptyResponseError and ModelInvalidResponseError so FallbackModel can switch models on an empty or malformed response instead of crashing outright."
series:
  name: "AI Framework Changelog"
  order: 72
---

> :globe: [中文版](/posts/daily/2026-11-26-framework-pydantic-ai-v2.75.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.75.0 |
| Previous version | [v2.74.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.74.0) |
| Release date | 2026-11-25 |
| Release Notes | [v2.75.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.75.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21.3k |

## Why this release matters

There are no new harness primitives this time; the whole release is about which text gets to become the model's instructions. `RepoContext`, `Skills` and `Memory` all read files from the workspace — a repo's docs, a skill's scripts, a memory snapshot — and until now, as long as a file's authority was below `'operator'`, its content still got mixed into the system prompt. That effectively let anyone who could write to those files (collaborators, documents synced in from external sources) indirectly give the model instructions. This release closes that path: content below `'operator'` no longer reaches the system prompt. Instead, the model reads it itself through file tools or gets it as ordinary data, and `Skills` now exposes capabilities through `list_skills`/`load_skill` tools rather than inlining them into capability instructions. A separate PR extends the same boundary to MCP: a capability's `with_authority` now covers `get_instructions()` and the instructions an MCP server sends itself, so a lowered capability's instructions — including one from a connected MCP server — get wrapped as data on the user channel instead of being written straight into the system prompt. The two PRs shipped separately, but they fix the same problem: the line between "instruction" and "data" had worn thin on both the workspace-file path and the MCP-integration path, and this release tightens it on both. On the reliability side, there's also a fix worth noting: `ModelEmptyResponseError` and `ModelInvalidResponseError` turn an empty or malformed response into an error type `FallbackModel` can actually catch, instead of raising a bare `AssertionError` or `IndexError` that kills the whole run.

```diagram
title: Pydantic AI v2.75.0: tighter instruction-authority boundary
desc: Content below operator authority — workspace files and MCP server instructions — is now kept out of the system prompt, handed to the model as data for it to judge on its own.
caption: Simplified; shows only the two affected paths. Content at operator authority is unaffected.
---
<svg viewBox="0 0 680 320">
  <path class="dg-line" d="M160 94V120" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 176V224" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M520 94V120" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M520 176V224" marker-end="url(#arrow)"/>

  <text class="dg-sub" x="160" y="24" text-anchor="middle" dominant-baseline="central">Before</text>
  <rect class="dg-box dg-box--ghost" x="20" y="38" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="58" text-anchor="middle" dominant-baseline="central">Low-authority workspace file</text>
  <text class="dg-sub" x="160" y="78" text-anchor="middle" dominant-baseline="central">read by RepoContext / Skills / Memory</text>

  <rect class="dg-box dg-box--ghost" x="20" y="120" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="140" text-anchor="middle" dominant-baseline="central">Mixed straight into system prompt</text>
  <text class="dg-sub" x="160" y="160" text-anchor="middle" dominant-baseline="central">same tier as operator instructions</text>

  <rect class="dg-box dg-box--ghost" x="20" y="224" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="244" text-anchor="middle" dominant-baseline="central">Model treats it as an instruction</text>

  <text class="dg-sub" x="520" y="24" text-anchor="middle" dominant-baseline="central">After v2.75.0</text>
  <rect class="dg-box" x="380" y="38" width="280" height="56" rx="6"/>
  <text class="dg-label" x="520" y="58" text-anchor="middle" dominant-baseline="central">Content below operator</text>
  <text class="dg-sub" x="520" y="78" text-anchor="middle" dominant-baseline="central">workspace files + MCP server instructions</text>

  <rect class="dg-box" x="380" y="120" width="280" height="56" rx="6"/>
  <text class="dg-label" x="520" y="140" text-anchor="middle" dominant-baseline="central">Delivered as data</text>
  <text class="dg-sub" x="520" y="160" text-anchor="middle" dominant-baseline="central">file-tool read / framed data on user channel</text>

  <rect class="dg-box" x="380" y="224" width="280" height="56" rx="6"/>
  <text class="dg-label" x="520" y="244" text-anchor="middle" dominant-baseline="central">Model decides whether to trust it</text>
</svg>
```

## Key changes

- **Workspace-file authority boundary (`RepoContext`/`Skills`/`Memory`)**: content from files below `'operator'` authority no longer gets mixed into the system prompt — `RepoContext` now has the model read it itself through file tools, `Skills` exposes capabilities via `list_skills`/`load_skill` tools, and `Memory` attributes a snapshot to its `MEMORY.md` → files a collaborator or external source can write to don't automatically become valid instructions for the model
- **Capability instruction authority extended to MCP (`with_authority`)**: `get_instructions()` and instructions an MCP server sends itself are now both governed by `with_authority`; a lowered capability's instructions — including a connected MCP server's — become framed data on the user channel instead of going straight into the system prompt → a connected external MCP server's instructions no longer automatically get the same trust level as operator instructions
- **`ModelEmptyResponseError`/`ModelInvalidResponseError`**: an empty or malformed response (e.g. Mistral/OpenAI returning empty `choices`) is now a recognizable error type, and `FallbackModel`/`ModelFallback`'s default `fallback_on` catches it and switches models → previously this raised a bare `AssertionError`/`IndexError` and killed the whole run; now there's at least a chance to keep going on another model
- **`RunContext.submit_output()`**: lets a tool call submit the run's final output directly → no need for an extra model turn just to get a structured result
- **`AnnounceWorkingDirectory`**: `Shell`/`FileSystem` state the current working directory once up front → saves repeating it in every turn's prompt
- **Pax `/trust` and token-based `/permissions`**: Pax (the coding-agent TUI) adds a folder-trust prompt, and the `approval_ask` handler now takes a resume token → custom approval handlers on durable engines other than Lambda (Temporal, DBOS) need to match the new signature

## Breaking Changes

- Content from files below `'operator'` authority, read by `RepoContext`/`Skills`/`Memory`, no longer appears in the system prompt:
  - Affected: projects that relied on these capabilities to automatically fold workspace document content into the prompt; projects using `RepoContext(autoload_instructions=False)` with nested instruction files will miss a prompt cache hit once on the first request after upgrading
- A lowered capability's instructions — including from an MCP server — now become framed data on the user channel instead of entering the system prompt:
  - Affected: projects that use `with_authority` to lower a capability, especially a connected MCP server; in-flight runs crossing the upgrade on Temporal/DBOS may hit a nondeterminism error if another MCP server follows the lowered one
- `ModelEmptyResponseError`/`ModelInvalidResponseError` are both subclasses of `ModelAPIError` and also of `UnexpectedModelBehavior`:
  - Affected: code that already does `except UnexpectedModelBehavior` needs no change, but if it has an `except ModelAPIError` placed before that, the new errors get caught there first
- Pax's `/permissions` `approval_handler` now takes a resume token:
  - Affected: projects with a custom approval handler on a durable engine other than AWS Lambda; without matching the new signature it raises `UserError` at runtime

## Migration Guide

### Upgrading from 2.74.x to 2.75.0

```bash
pip install --upgrade pydantic-ai==2.75.0
```

```python
# Old: FallbackModel's default fallback_on didn't catch empty/malformed responses
# (these raised AssertionError or IndexError directly, killing the whole run)

# New: the default fallback_on already catches ModelEmptyResponseError / ModelInvalidResponseError.
# To keep the old "fail outright, don't fall back" behavior, narrow fallback_on yourself:
from pydantic_ai.models import ModelAPIError, UnexpectedModelBehavior

model = FallbackModel(
    primary_model,
    backup_model,
    fallback_on=lambda e: isinstance(e, ModelAPIError) and not isinstance(e, UnexpectedModelBehavior),
)
```

```python
# To keep the old "instruction-level" behavior for a low-authority capability
# (e.g. a connected MCP server), leave it at the default 'operator' rather than lowering it:
from pydantic_ai.mcp import MCP

# To tighten the trust boundary instead:
mcp_server = MCP(..., authority="lower-than-operator-value")
```

Everything else — `RunContext.submit_output()`, `AnnounceWorkingDirectory` — is purely additive and doesn't affect existing code unless you opt in.

## Compared to other frameworks

Coincidentally, [Mastra @mastra/core@1.86.0](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.86.0) shipped the same day (11/25) tightening a similar kind of boundary: Mastra now requires that when a host calls Knowledge tools outside an agent run, the identity (`principals`) must come from the host's own code — never from the request — specifically for MCP and external-agent scenarios. The two frameworks are working at different layers — Pydantic AI governs "does this text count as an instruction," Mastra governs "whose identity does this call run as" — but they share the same underlying concern: an externally triggered action shouldn't get to claim elevated trust just by asserting it. Compared to CrewAI and LangGraph, which this week are still mostly stacking features, these two frameworks both reinforced "authority boundaries" on the same day, which suggests that as MCP and external integrations grow, "whose word counts" has become something frameworks have to handle directly, not something users can be left to watch for on their own.

## Today's takeaway

I used to think workspace-file authority below `'operator'` was mainly about controlling whether the model could write to a file. Seeing this release extend it to whether a file's content can become an instruction made something click: read permission and instruction permission are actually two different things. Even a file the model can only read, never modify, still effectively lets that file's author issue instructions to the model the moment its text lands in the system prompt. This release is the first time Pydantic AI has treated "readable" and "able to instruct" as two separate layers — and that's exactly the gap it fills.

## References

- [Pydantic AI v2.75.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.75.0)
- [Full Changelog: v2.74.0...v2.75.0](https://github.com/pydantic/pydantic-ai/compare/v2.74.0...v2.75.0)
- [pydantic/pydantic-ai on GitHub](https://github.com/pydantic/pydantic-ai)
- [PR #11837: workspace-file authority boundary (RepoContext/Skills/Memory)](https://github.com/pydantic/pydantic-ai/pull/11837)
- [PR #14457: capability instruction authority extended to MCP (with_authority)](https://github.com/pydantic/pydantic-ai/pull/14457)
- [PR #12108: ModelEmptyResponseError/ModelInvalidResponseError](https://github.com/pydantic/pydantic-ai/pull/12108)
- [PR #11348: RunContext.submit_output()](https://github.com/pydantic/pydantic-ai/pull/11348)
- [PR #14427: AnnounceWorkingDirectory](https://github.com/pydantic/pydantic-ai/pull/14427)
- [PR #13195: token-based approval handler for Pax /permissions](https://github.com/pydantic/pydantic-ai/pull/13195)
- [Mastra @mastra/core@1.86.0 Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.86.0)
- [Framework Update: Pydantic AI v2.71.0 (last major primitive batch)](/posts/daily/2026-11-20-framework-pydantic-ai-v2.71.0-en)
