---
title: "Prompt Version Control: Changing One Word Can Drop an Eval from 5/5 to 0/5"
date: 2026-08-25
category: ai
type: deep-dive
tags: [coding-agent, prompt-engineering, versioning, eval, ab-testing]
lang: en
series:
  name: "跟成熟 coding agent 學設計"
  order: 25
tldr: "All five mature coding agents treat the system prompt as a versioned asset: codex ships one prompt file per model generation via its model catalog, claude-code switches prompt sections behind feature flags for internal A/B tests, opencode selects a file per model. rivumi takes the heaviest route — the prompt string carries a semantic version, is persisted into run artifacts, and every change must pass a real-provider eval."
description: "Evidence from the source of five mature coding agents on four approaches to prompt version control — per-model prompt files, feature-flag A/B testing, template rendering, and version constants bound to evals — plus rivumi's choice."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-prompt-versioning)

## The design problem: how do you review a prompt change?

A prompt is the strangest kind of code in a coding agent: it has no types and no unit test catches it directly, yet changing one word can wreck task success rates. There is hard academic evidence for this — [FormatSpread](https://arxiv.org/abs/2310.11324) measured performance of semantically identical content across different prompt formats and found spreads of up to 76 accuracy points. A "just rewording" prompt diff therefore carries risk comparable to changing a core algorithm.

Standard code review is helpless here: a reviewer cannot tell whether changing "prefer X" to "always use X" will make the model refuse tool Y on certain tasks. The real question is: **how do prompt changes get tracked, reviewed, and verified?** Five mature projects give four different answers.

## What the five do

**codex** treats prompts as assets shipped alongside models. The `openai/codex` repo keeps a row of prompt files named by model generation at `codex/codex-rs/core/gpt_5_1_prompt.md` (331 lines), `gpt_5_codex_prompt.md`, `gpt_5_2_prompt.md`, and so on — each model family gets its own complete system prompt rather than conditional branches inside one shared text. The runtime selection chain lives in `codex/codex-rs/models-manager/src/model_info.rs#with_config_overrides`: user config overrides > file loading > built-in fallback (the fallback constant `BASE_INSTRUCTIONS` is compiled in via `include_str!("../prompt.md")`); the official per-model prompt text ships with the model catalog (`codex-rs/models-manager/models.json`), where each model's `instructions_template` runs about 17K characters. Secondary prompts (compaction summaries, review, permission explanations) are centralized in template modules like `codex/codex-rs/prompts/src/compact.rs#SUMMARIZATION_PROMPT`.

**opencode** is the minimal file-as-version variant: `sst/opencode` keeps roughly a dozen per-model prompts in `opencode/packages/opencode/src/session/prompt/` (`anthropic.txt`, `gpt.txt`, `gemini.txt`, `kimi.txt`, `codex.txt`, …), selected by string matching on the model id in `opencode/packages/opencode/src/session/system.ts#provider`. No fancy machinery, but "which model runs which prompt version" is legible from the filesystem alone.

**claude-code** is the most elaborate. In the decompiled source at `anthropics/claude-code`, `claude-code-source/src/constants/prompts.ts#getSystemPrompt` assembles the system prompt as an array of sections with two key designs. First, feature flags directly determine prompt content: gates like `feature('KAIROS')` and `feature('EXPERIMENTAL_SKILL_SEARCH')` decide whether an instruction block appears; internal employees (`USER_TYPE === 'ant'`) additionally see sections annotated with their experimental purpose — comments literally read "un-gate once validated on external via A/B" alongside effectiveness numbers. That is live A/B testing on prompts. Second, a marker constant `SYSTEM_PROMPT_DYNAMIC_BOUNDARY` separates static sections (cacheable across users) from dynamic ones (session-specific, not cacheable), directly serving the prompt-cache hit rate.

**omp** (can1357/oh-my-pi) makes assembly a template render: `oh-my-pi/packages/coding-agent/src/system-prompt.ts#buildSystemPrompt` imports a dozen `.md` templates (main template, three personality presets, safety sections), gathers environment info, tool lists, and skills into template data, and even deduplicates rules at paragraph level so a user's AGENTS.md doesn't repeat built-in guidance.

**pi** (badlogic/pi-mono) is the minimal control group: `pi-mono/packages/coding-agent/src/core/system-prompt.ts#buildSystemPrompt` is plain string concatenation — customPrompt replaces the default wholesale, plus tool lists and context files. No version number, because upstream relies on git itself.

They share exactly one conviction: **the prompt is not a string literal scattered through code but a first-class asset** — standalone files, centralized management, explicit selection logic.

## rivumi's choice and how it differs

rivumi takes the road none of the five go quite as far on: **a semantic version constant in the prompt string, with every evolution bound to eval evidence**.

`rivumi/src/rivumi/prompts.py#CODING_AGENT_PROMPT_VERSION` currently reads `"m3-exact-edit-v3"`, and the whole system prompt is a single versioned constant. That version number is not decoration — `rivumi/src/rivumi/session.py:133` persists it whenever a new session is created, while pre-M3 manifests get an `"m2-unversioned-patch"` compatibility default so resume can validate schema compatibility; `rivumi/src/rivumi/loop.py:880` writes it into the `run.created` event, so every run artifact can answer "which prompt version actually ran here."

The v1→v3 evolution is textbook observation-driven iteration:

- **v1** (M3): only the replace_text vs apply_patch division of labor and read-before-edit, added to rescue qwen3:4b after it found the correct fix twice but emitted malformed unified diffs. Running the real Ollama eval with v1 passed 5/5.
- **v2**: interactive use showed the agent exploring the repo and running checks even for greetings. The diagnosis doc `docs/diagnoses/conversational-turn-redesign.md` explicitly records that the fix borrowed kimi.txt's conditional rule style and codex's chit-chat wording — not vague advice but a trigger→action branch: when no change was made, skip straight to the answer and don't touch the repository.
- **v3**: tightened further — capability questions ("can you help me write a program?") also deserve a direct reply, without exploring the repo or enumerating interpretations to disambiguate. `rivumi/tests/test_prompts.py` pins these clauses as tests; the prompt became a test-guarded contract.

The contrast with the five is clear: codex and claude-code have eval infrastructure but don't publish per-change eval evidence alongside individual prompt edits; opencode and pi lean on git history. rivumi binds "version number → observed failure → eval result" into one commit chain. The cost is equally honest: the eval covers one small Python task on one local 4B model — 5/5 does not mean broadly reliable, as the stage doc itself states upfront.

## Engineering evidence

[OpenAI's GPT-4.1 prompting guide](https://cookbook.openai.com/examples/gpt4-1_prompting_guide) explicitly recommends iterating, evaluating, and iterating again for agentic prompts — treating them as tested programs, not one-off copy. [Anthropic's prompt engineering docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) likewise list "build an eval first" as a prerequisite for touching prompts. [SWE-agent](https://arxiv.org/abs/2405.15793) makes the deeper point: agent performance is extremely sensitive to interface design, including tool guidance in prompts — the interface is the engineering. And claude-code's cache boundary design maps onto [Anthropic's prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) practice — static prefixes are cacheable, dynamic tails must not leak into them.

## Improvement roadmap

1. **Diversify the eval manifest**: `evals/live/tiny-python-bug.json` currently has a single fixture; v3's conversational-routing clauses deserve at least one "pure Q&A should not trigger tools" eval case — otherwise v3 has never been verified.
2. **Prompt diffs in CI**: pinning clauses in `tests/test_prompts.py` is a good first step; next, require every prompt version bump to reference an eval summary path, following the M3 stage doc's evidence format.
3. **Consider sectioning**: like omp/claude-code, split the single string into a section array to enable future per-section caching or A/B; at personal-project scale, keeping one readable string is also an honest trade-off.
4. **No catalog needed yet**: codex's per-model prompt catalog serves dozens of models; rivumi only needs its provider adapter layer to record "which prompt version was evaluated against which models."

## References

- [openai/codex](https://github.com/openai/codex)
- [sst/opencode](https://github.com/sst/opencode)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)
- [anthropics/claude-code](https://github.com/anthropics/claude-code)
- [FormatSpread: Quantifying Language Models' Sensitivity to Spurious Features in Prompt Design (arXiv:2310.11324)](https://arxiv.org/abs/2310.11324)
- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering (arXiv:2405.15793)](https://arxiv.org/abs/2405.15793)
- [OpenAI GPT-4.1 Prompting Guide](https://cookbook.openai.com/examples/gpt4-1_prompting_guide)
- [Anthropic Prompt Engineering Overview](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Anthropic Prompt Caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
