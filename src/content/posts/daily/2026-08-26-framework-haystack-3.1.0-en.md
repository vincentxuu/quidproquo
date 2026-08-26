---
title: "Framework Update | Haystack 3.1.0"
date: 2026-08-26
category: daily
tags: [ai-agent, framework, daily, haystack]
lang: en
description: "Haystack 3.1 fills two production gaps: context compaction via Hook + Compactor combos, and AgentTool for wrapping an entire Agent as a callable Tool — plus several deserialization RCE fixes"
tldr: "Haystack 3.1.0 highlights: (1) Experimental `CompactionHook` with `SlidingWindowCompactor` (drop old turns) and `ToolResultPruningCompactor` (replace old tool results with placeholders) for managing context blowup in long conversations; (2) `AgentTool` lets you wrap a full Agent as another Agent's tool — the caller sees only the final reply, not intermediate steps; (3) Multiple pipeline deserialization and Jinja sandbox RCE vulnerabilities patched, plus several behavioral changes requiring migration (e.g. `Agent.state_schema` semantics changed, `custom_filters` now requires `unsafe=True`)."
series:
  name: "AI Framework Changelog"
  order: 6
---

<!-- [skip-harness] -->

> 🌏 [中文版](/posts/daily/2026-08-26-framework-haystack-3.1.0)

## Version Info

| Item | Value |
|---|---|
| Framework | Haystack |
| Version | v3.1.0 |
| Previous | v3.0.0 |
| Release Date | 2026-08-24 |
| Release Notes | [GitHub Release](https://github.com/deepset-ai/haystack/releases/tag/v3.1.0) |
| GitHub | [deepset-ai/haystack](https://github.com/deepset-ai/haystack) |
| Stars | 26.3k |

## Why This Release Matters

Haystack 3.1 patches two holes you'll inevitably hit when running Agents in production. The first is context blowup: in long conversations or multi-turn tool calls, message history keeps growing until it either exceeds the context window or inflates costs. 3.1 extracts trimming logic into a pluggable `CompactionHook` backed by two `Compactor` strategies — `SlidingWindowCompactor` drops old turns outright, while `ToolResultPruningCompactor` replaces old tool call results with compact placeholders and keeps only the most recent steps intact. The second is multi-Agent coordination: the new `AgentTool` wraps an entire Haystack Agent as a Tool callable by another Agent. The caller sees only the wrapped Agent's final reply — intermediate steps never pollute the parent Agent's context. This is the now-common "delegate but hide the details" pattern across multi-Agent frameworks. Beyond new features, this release also closes several pipeline deserialization and Jinja sandbox RCE vulnerabilities. If your service loads pipeline YAML from external sources, these security patches are more urgent than the new features.

## Key Changes

- **Context Compaction (`CompactionHook`)**: Experimental Hook mechanism for managing conversation length → no more hand-rolling "trim history after N messages" logic; the framework natively supports pluggable trimming strategies
- **`SlidingWindowCompactor`**: Sliding-window trimming that removes older history turns → suited for long conversations where older information genuinely loses relevance
- **`ToolResultPruningCompactor`**: Replaces older tool call results with placeholders while keeping recent steps intact → suited for Agents where tool results are bulky (e.g. full search results, entire file contents)
- **Token counting utilities (`haystack.token_counters`)**: Three new counters — `ApproximateTokenCounter` (no external deps), `TiktokenCounter` (local, OpenAI-oriented), `OpenAITokenCounter` (calls OpenAI API for precise counts) → trimming strategies finally have proper quantitative backing instead of character-count estimates
- **`AgentTool`**: Wraps an entire Agent as a Tool callable by another Agent → the caller sees only the wrapped Agent's final reply; intermediate steps stay out of the parent Agent's context — a native Agent delegation mechanism
- **`Agent.clone()`**: Creates a copy of an Agent with variant settings → convenient for A/B configuration experiments without reassembling all components
- **`exit_reason` output field**: Agent execution results now include a field indicating the termination reason → directly distinguishable whether the Agent finished normally, hit the step limit, or was interrupted
- **`close`/`close_async` on document stores**: Document store components now have explicit resource cleanup methods → long-running services can properly close connections and avoid resource leaks
- **Deserialization security patches**: Multiple pipeline deserialization and Jinja sandbox execution RCE vulnerabilities closed → if your service loads pipeline YAML from external sources, this is the highest-priority part of the release

## Breaking Changes

- `exit_reason` is now a reserved field in the Agent `state_schema`:
  - If your custom state schema already used an `exit_reason` key, it will conflict after upgrading
  - Scope: projects with a custom `exit_reason` field in `state_schema`
- `Agent.state_schema` semantics changed — it now returns only user-defined schema, no longer the fully merged schema:
  - Use `Agent.resolved_state_schema` to get the complete schema (user-defined + framework built-in)
  - Scope: code that reads `Agent.state_schema` to inspect the full field list
- `OutputAdapter` / `ConditionalRouter` with Jinja `custom_filters` now requires explicitly passing `unsafe=True`:
  - Scope: pipelines using custom Jinja filters — they will error on upgrade without this parameter
- `DocumentMAPEvaluator` scoring algorithm adjusted; values may differ from previous versions
- `PipelineSnapshot.pipeline_state.inputs` structure changed; code that reads this field for serialization/snapshot comparison needs updating
- `SentenceWindowRetriever` now raises a validation error for `window_size=0` instead of silently applying a default

## Migration Guide

### Upgrading from 3.0.x to 3.1.0

```bash
# Step 1: Update dependency
pip install --upgrade haystack-ai==3.1.0
```

```python
# Step 2a: state_schema semantics changed — use resolved_state_schema for the full schema
# Old (3.0.x)
full_schema = agent.state_schema  # included user-defined + framework built-in fields

# New (3.1.0)
user_schema = agent.state_schema           # now only user-defined fields
full_schema = agent.resolved_state_schema  # fully merged schema
```

```python
# Step 2b: OutputAdapter / ConditionalRouter with custom_filters needs unsafe=True
# Old (3.0.x)
adapter = OutputAdapter(
    template="{{ value | my_custom_filter }}",
    output_type=str,
    custom_filters={"my_custom_filter": my_custom_filter},
)

# New (3.1.0)
adapter = OutputAdapter(
    template="{{ value | my_custom_filter }}",
    output_type=str,
    custom_filters={"my_custom_filter": my_custom_filter},
    unsafe=True,
)
```

If your `state_schema` has a custom `exit_reason` field, rename it before upgrading to avoid conflicts with the framework's reserved field. The remaining changes (`DocumentMAPEvaluator` scoring, `PipelineSnapshot` structure, `SentenceWindowRetriever` validation) only require attention if you directly depend on those behaviors — most pipeline users can upgrade without further adjustment.

## Cross-Framework Observations

The `AgentTool` design — "wrap an Agent as a Tool, expose only the final reply" — aligns with CrewAI's hierarchical delegation and LangGraph's approach of wrapping sub-graphs as nodes. All aim to solve the same problem: intermediate steps from collaborating Agents polluting the parent context. The interface choices differ: Haystack has the Agent implement the Tool interface directly, which minimizes wiring cost for teams already thinking in Haystack pipeline terms. The fact that this release simultaneously patches RCE vulnerabilities and adds context compaction also reflects a broader trend: for frameworks that can load external pipeline definitions (YAML/JSON), security and memory management are becoming as critical as feature quality in evaluation criteria.

## Takeaway

I used to think context compaction was as simple as "too many messages, drop the old ones." Seeing Haystack decompose it into a Hook plus two Compactor types made me realize that trimming strategies map to different failure modes: dropping entire old turns (`SlidingWindowCompactor`) works when old information truly doesn't matter, but if old tool call results contain key data that later steps still need to reference, dropping them wholesale causes the Agent to lose critical context. That's where `ToolResultPruningCompactor` comes in — it keeps summaries while clearing the bulky content. Choosing the wrong trimming strategy isn't a performance problem; it's a correctness problem.

## References

- [Haystack v3.1.0 — GitHub Release](https://github.com/deepset-ai/haystack/releases/tag/v3.1.0)
- [deepset-ai/haystack — GitHub](https://github.com/deepset-ai/haystack)
- [Haystack v3.0.0 — GitHub Release (previous stable version)](https://github.com/deepset-ai/haystack/releases/tag/v3.0.0)
