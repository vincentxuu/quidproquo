---
title: "Learning from Mature Coding Agents (12): Can Small Models Code? — Capability Boundaries and Eval Discipline"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 12
tags: [coding-agent, small-models, evaluation, harness-engineering, ollama, llm-agents]
lang: en
description: "qwen3:4b read the right file but emitted a broken diff — does that count as coding ability? How pi, OMP, and Codex design model-backed evals and edit formats, contrasted with rivumi's five-run live Ollama evaluation and its evidence discipline."
tldr: "Small models don't fail at reasoning first — they fail at format stability: tool-call JSON, diff hunk arithmetic, and context budgets all break. The mature harnesses build evals on real model behavior (pi's model-backed evals, OMP calibrating benchmarks from real session logs, Codex even relaxing its parser for weaker models). rivumi picks the narrowest but hardest path: one fixture, five real Ollama runs, a manifest declaring exactly which files and patch fragments count as success — and M2's failure kept verbatim as evidence. Never pass mock off as E2E; never spin partial success into full passes."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-small-model-coding)

## The Design Problem

A true story first. In milestone M2, rivumi hooked up a local Ollama instance running Qwen3's `qwen3:4b` with a task that could not have been smaller: calculator implemented subtraction with a minus sign where addition was needed — fix that one line so pytest passes. The result: the model twice correctly read the target file and correctly identified the broken line, then emitted a unified diff with wrong hunk line counts. `git apply --check` rejected it outright, the response budget burned out, and the task failed. That record is preserved in `docs/stages/m2-interactive-cli-provider-gateway.md` — deliberately not deleted.

This is the classic failure profile of a 4B-class small model, and it has three parts:

1. **Tool call format**. Small models are unstable at conforming to JSON schemas — occasionally interleaving natural language or truncating arguments.
2. **Diff format**. Unified diffs demand precise hunk-count arithmetic, exactly the "can count in principle, miscounts in practice" task class where small models are weakest.
3. **Context limits**. Qwen3's hidden reasoning consumes the token budget before any tool call; M3 hit a case where a 1024-token turn bound was exhausted by thinking alone.

But the deeper problem is second-order: **how do you design an eval that doesn't fool itself?** Testing your harness against a mocked LLM only tests the harness. A single success might be luck. "Read the right file" is partial success — calling it "the agent can fix bugs" is fabrication. The most common sin in small-model research isn't a weak model; it's soft measurement. [SWE-bench](https://arxiv.org/abs/2310.06770) became the standard precisely because it uses real GitHub issues plus fail-to-pass tests as the criterion, refusing to let models grade themselves.

## What the Five Reference Projects Do

### pi: evals as behavioral tests against real sessions

pi makes evals a first-class vitest citizen: `pi-mono/packages/evals/src/pi-harness.ts#createPiCodingAgentHarness` wraps a real `AgentSession` into [vitest-evals](https://github.com/getsentry/vitest-evals), running inside isolated temporary projects, with `runs.jsonl` indexing every run's native session JSONL. The key stance is the README's first phrase: "model-backed checks." No mocks — every eval spends real tokens for real behavior, and artifacts remain for later audit.

### OMP: calibrate benchmarks from real usage, record everything under one model

OMP's `oh-my-pi/packages/typescript-edit-benchmark/src/tasks.ts#EditTask` defines paired input/expected directory edit tasks, and `src/verify.ts#VerificationResult` scores pragmatically: outputs are compared after Prettier formatting, with code comparisons tolerating stray blank lines — because it measures whether the *edit* is right, not formatting pedantry. More interesting is `src/edit-shape-stats.ts`: it scans successful edit calls in real session logs, measures a median five changed lines per call with nearly half being single hunks, and calibrates fixture difficulty accordingly. **Benchmark tasks aren't invented — they're measured from real workloads.**

One level up, `oh-my-pi/packages/metaharness/src/store.ts#RunRow` and `#TraceRow` unify Harbor, the edit benchmark, and SnapCompact into one experiment → run → trace model: SQLite storage, a single dashboard for score/tokens/cost across benchmark types. The companion `packages/stats` turns everyday real usage — cache rate, error rate, tokens/s — into an observability dashboard, giving eval numbers a baseline to compare against.

### Codex: admit weak models exist, let the parser yield

`codex/codex-rs/apply-patch/src/parser.rs#PARSE_IN_STRICT_MODE` may be the most honest line of code in this whole study: the constant is `false`, with a comment stating plainly that the only OpenAI model known to require lenient parsing is gpt-4.1, so lenient mode applies to all models. Codex uses a custom `*** Begin Patch` format instead of strict unified diffs, and the parser deliberately tolerates format quirks for specific models — **the harness is designed around model weaknesses rather than pretending they don't exist**. Meanwhile Claude Code relies on `claude-code-source/src/services/compact/autoCompact.ts` to compact automatically near the context ceiling — an admission that assuming sufficient context is itself a design error. (OpenCode, for completeness, ships no standalone benchmark package in-repo; its eval strategy leans on external CI workflows — which is itself a position on the spectrum.)

## rivumi's Choice and How It Differs

M2's failure became M3's spec directly. rivumi's answer has three parts:

**The task is declared in a manifest, not in code.** `evals/live/tiny-python-bug.json` pins down: only `src/tiny_python_bug/calculator.py` may change; the patch must contain both fragments `-    return left - right` and `+    return left + right`; `replace_text` must complete successfully; bounds of 8 steps and 300 seconds; at least 4 of 5 attempts must pass.

**Every attempt gets a brand-new world.** `scripts/eval_live_provider.py#prepare_source` copies the fixture, re-runs `git init`, commits, and records HEAD plus a tree digest per attempt; `tree_digest` later verifies the source bytes were untouched. Each of the five real Ollama runs leaves SHA-256 hashes of its events and result files, and every successful tool sequence was `list_files, read_file, replace_text, run_check`.

**Per-dimension records — failures are evidence too.** Transport, tool-use, edit, verification, and task-completion are tracked separately: M2's 4B reading the correct file was a tool-use-layer success and an edit-layer failure, and the two are never conflated. M3 ultimately passed 5/5 (threshold was 4/5), yet the stage doc explicitly states "M3 does not interpret the 5/5 result as broad 4B-model reliability" — the conclusion is locked to the single fixture in the manifest.

The difference from the five references is clear: rivumi has none of OMP's large-scale benchmark infrastructure. It chose **narrow but hard** — one task, five repeats, reproducible artifacts and hashes. The cost is near-zero coverage; the payoff is that every claim points to a file.

## Academic Grounding

[SWE-bench](https://arxiv.org/abs/2310.06770) established two things: eval tasks should come from real software (GitHub issues), and the criterion should be executable tests rather than model self-report. rivumi's fail-to-pass pytest plus patch assertions is essentially a miniature of it. On the model side, the [Qwen3 Technical Report](https://arxiv.org/abs/2505.09388) shows 4B-class models pairing real reasoning capability with real limitations — they can reason toward a fix, but output format stability remains the weak spot, consistent with what M2/M3 observed.

## Improvement Roadmap

In priority order:

1. **Diversify fixtures.** Reproducibility for a one-line fix is proven; the next step is multi-file tasks requiring several edits — otherwise the eval only covers replace_text's sweet spot.
2. **Borrow metaharness's unified recording.** The experiment → run → trace SQLite model suits future cross-model comparisons in rivumi (qwen3 versus other small models) without hand-assembling summary.json each time.
3. **Measure yourself like edit-shape-stats does.** Once rivumi has real usage volume, feed it back into fixture calibration so the benchmark doesn't stay a toy.
4. **Consider Codex-style format concessions.** replace_text already routes around diff arithmetic; if stronger local models gain support later, re-evaluate whether unified diffs come back — otherwise keep the status quo.

Can small models code? The current answer: yes, they find the correct semantic change — but the harness must absorb every bit of format risk for them, and you need an eval that doesn't fool yourself before you're entitled to answer the question at all.

## References

- [SWE-bench: Can Language Models Resolve Real-World GitHub Issues?](https://arxiv.org/abs/2310.06770)
- [Qwen3 Technical Report](https://arxiv.org/abs/2505.09388)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono) (`packages/evals`)
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) (`packages/typescript-edit-benchmark`, `packages/metaharness`, `packages/stats`)
- [openai/codex](https://github.com/openai/codex) (`codex-rs/apply-patch`)
- [anthropics/claude-code](https://github.com/anthropics/claude-code)
