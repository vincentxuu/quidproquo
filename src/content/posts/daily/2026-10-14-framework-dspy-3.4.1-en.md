---
title: "Framework Update: DSPy 3.4.1"
date: 2026-10-14
category: daily
type: digest
tags: [ai-agent, framework, daily, dspy]
lang: en
description: "DSPy 3.4.1 lets dspy.RLM spawn full DSPy sub-agents inside its sandbox, but ships that feature alongside several compatibility breaks across GEPA, Flex, and ReActV2"
tldr: "Two things matter in DSPy 3.4.1: (1) dspy.RLM's sandboxed code can now import dspy and build Predict / ChainOfThought / ReActV2 / nested RLM sub-agents, all sharing one max_llm_calls budget; (2) GEPA now defaults to a structured InstructionProposer. Breaking changes: GEPA can produce different results than 3.4.0 with the same seed, reflection_lm must be a dspy.LM, ReActV2 signatures can no longer declare history/tools input fields, the dspy.predict.flex.bridge import path is gone, and programs saved on 3.4.0 with a null Score criterion fail to load."
series:
  name: "AI Framework Changelog"
  order: 39
---

> 🌏 [中文版](/posts/daily/2026-10-14-framework-dspy-3.4.1)

## Release Info

| Item | Value |
|---|---|
| Framework | DSPy |
| Version | 3.4.1 |
| Previous version | 3.4.0 |
| Release date | 2026-10-12 |
| Release Notes | [GitHub Release](https://github.com/stanfordnlp/dspy/releases/tag/3.4.1) |
| GitHub | [stanfordnlp/dspy](https://github.com/stanfordnlp/dspy) |
| Stars | 34,500 |

## Why this release matters

DSPy's whole bet has always been treating prompts as code you compile and optimize, instead of flows you hand-draw. 3.4.1 extends that bet to the agent itself: `dspy.RLM`, the module that lets a model write code to solve a task, can now `import dspy` from inside its own sandbox and spin up DSPy sub-agents with structured inputs and outputs, tools, or even recursion — not just call fixed Python functions. For teams already using GEPA to optimize prompts, or RLM for open-ended tasks, "should this subtask go to another agent" is for the first time a runtime decision instead of something you have to lock in at design time. The catch: this ships as a patch release (3.4.0 → 3.4.1), yet comes with a full page of upgrade notices — GEPA's optimization results, RLM's prompt caches, and ReActV2's field-naming rules all changed. New capability and compatibility risk arrived on the same patch number.

## What changed

- **RLM can build DSPy sub-agents**: `dspy.RLM`'s sandboxed code can call `dspy.Predict`, `dspy.ChainOfThought`, `dspy.ReActV2` (reusing RLM's own tools), or a nested `dspy.RLM` → only JSON crosses the sandbox boundary, and sub-agents share the same `max_llm_calls` budget as `llm_query`, so passing `n` can't silently multiply the call count
- **InstructionProposer is now GEPA's default proposer**: `dspy.GEPA` no longer hand-assembles one raw prompt and pulls the new instruction out of backticks — it now calls the reflection LM through `dspy.Predict` with a `JSONAdapter`. You can configure `skills` (point it at SKILL.md files as reference material), `additional_instructions`, `max_chars`, and more; `dspy.History`, tool trajectories, and `dspy.Image` values now reach the reflection LM as structured content instead of being flattened into text
- **Fixes the 3.4.0 import crash**: paths that lazily import LiteLLM, such as `dspy.LM(...).supports_function_calling`, used to raise `ImportError: cannot import name 'BaseModel'`. That's fixed — likely the first thing many people hit after upgrading to 3.4.0
- **Python 3.15 support**: `requires-python` now allows `<3.16`; but on 3.15, `litellm` and `gepa` can't be installed yet (both declare `<3.15` upstream), so LM calls fall back to the bundled native engine and `dspy.GEPA` raises `ImportError` there

## Breaking Changes

- GEPA's reflection request is now a structured JSON system message: **the same seed can produce different optimization results than on 3.4.0**
- `reflection_lm` must be a `dspy.LM` (or `dspy.BaseLM`): 3.4.0 let you pass a plain function that GEPA called directly as `reflection_lm(prompt)`. On 3.4.1 that fails every proposal — GEPA just logs the failure and the run finishes with the seed program unchanged
  - Affects: anyone using a lambda or plain function as `reflection_lm` with GEPA
- `dspy.teleprompt.gepa.gepa_utils` no longer re-exports `InstructionProposalSignature` → import it from `gepa.strategies.instruction_proposal` instead
- Every RLM prompt now carries a sub-agent section, and **there's no flag to turn it off**: LM caches and recorded responses from 3.4.0 won't match anymore. Sub-agent calls also count toward `max_llm_calls`, so an RLM already close to its limit can hit the ceiling sooner
- The Flex bridge shim constants (`SHIM_SETUP`, `CONSTRUCT_TOOL`, `CALL_TOOL`, `BRIDGEABLE_KINDS`, etc.) moved from `dspy.predict.flex.bridge` to `dspy.primitives.facade` — importing from the old path raises `ImportError`
  - Affects: developers who wrote custom sandbox backends; code that only builds and runs `dspy.Flex` programs is unaffected
- `Score` level descriptions can no longer be `null`: a program saved on 3.4.0 with a `null` criterion raises `ValueError` on `program.load(path)`, and the error message doesn't even mention `null`
- `dspy.ReActV2` signatures can no longer declare input fields named `history` or `tools` — the constructor raises `ValueError`, since ReActV2 now supplies both itself
  - Affects: existing code that put `history: dspy.History` in a ReActV2 signature
- Bundled model metadata now follows LiteLLM 1.105.0: offline (or with `LITELLM_LOCAL_MODEL_COST_MAP=true`), models dropped upstream — such as `anthropic/claude-3-7-sonnet-20250219` or `gemini/gemini-2.0-flash` — silently lose their tool-calling, structured-output, and reasoning flags, and adapters like `JSONAdapter` quietly fall back to plain-text JSON with no warning
- On Python 3.10–3.13, `X | Y` annotations like `int | None` now render the same way `typing.Union` does: prompt content changed, so cached responses and prompts recorded on 3.4.0 won't match

## Migration Guide

### Upgrading from 3.4.0 to 3.4.1

```bash
pip install --upgrade "dspy==3.4.1"
```

```python
# ReActV2 with a history input field — before (3.4.0)
agent = dspy.ReActV2("history: dspy.History, question -> answer", tools=[lookup_order])

# after (3.4.1): drop the field declaration, keep passing history= at call time
agent = dspy.ReActV2("question -> answer", tools=[lookup_order])
result = agent(question=question, history=history)  # the call itself is unchanged
```

```python
# Custom Flex/RLM sandbox backend import — before (3.4.0)
from dspy.predict.flex.bridge import BRIDGEABLE_KINDS, CALL_TOOL, CONSTRUCT_TOOL, SHIM_SETUP

# after (3.4.1)
from dspy.primitives.facade import BRIDGEABLE_KINDS, CALL_TOOL, CONSTRUCT_TOOL, SHIM_SETUP
```

```diff
# Fixing a 3.4.0-saved JSON program that has a null criterion
 "fields": {
   "severity": {
-    "criteria": [null, "Disruptive", {"what": "Blocking"}]
+    "criteria": ["Minor", "Disruptive", {"what": "Blocking"}]
   }
 }
```

If your GEPA pipeline passes `reflection_lm` as a plain function, wrap it in `dspy.LM` (with a custom `engine=` if needed). If you run older models offline, point `LITELLM_MODEL_COST_MAP_URL` at a metadata file that still carries that entry and unset `LITELLM_LOCAL_MODEL_COST_MAP`.

## Compared to other frameworks

LangGraph and CrewAI treat "should this subtask go to another agent" as a design-time decision baked into the graph or crew. DSPy runs the opposite direction — RLM already let the model write code to solve a task, and 3.4.1 just hands the decision of "does this subtask need structured I/O or its own tools" to the generated code itself, at runtime. That keeps DSPy's "optimize the whole pipeline from data and a metric" bet distinct from the graph-first orchestration frameworks — but this release is also proof that once the agent's own structure becomes generated code, the compatibility surface gets a lot harder to draw ahead of time.

## Today's takeaway

I assumed `dspy.RLM`'s sandboxed code could only call fixed Python tool functions. Seeing 3.4.1 let it `import dspy` and generate sub-agents with their own tools and their own recursion depth made it clear: RLM isn't just "let the model write a script and return the result" anymore — it's letting the model decide, at runtime, whether to hand the current task off to a full agent of its own, with only a shared `max_llm_calls` budget holding the cost line.

## References

- [DSPy 3.4.1 Release Notes](https://github.com/stanfordnlp/dspy/releases/tag/3.4.1)
- [DSPy GitHub Repository](https://github.com/stanfordnlp/dspy)
- [3.5 LM-interface cutoff announcement](https://dspy.ai/community/normalized-lm-api-migration/#the-35-cutoff)
- [Full Changelog 3.4.0...3.4.1](https://github.com/stanfordnlp/dspy/compare/3.4.0...3.4.1)
