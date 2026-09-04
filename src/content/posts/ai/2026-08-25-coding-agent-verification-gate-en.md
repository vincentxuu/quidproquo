---
title: "Learning Agent Design from Mature Coding Agents (5): The Verification Gate — Changed Files Isn't Success, Verified Is"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 5
tags: [coding-agent, harness-engineering, verification, testing, evaluation, llm-agents]
lang: en
description: "An LLM claiming it's done is not the same as being done. How pi, OMP, OpenCode, Codex, and Claude Code decide task completion — from prompt-level appeals to Claude Code's adversarial verifier subagent — contrasted with looplane's hard verification gate."
tldr: "None of the five reference projects enforces 'all declared verification commands pass' at the harness level: pi leaves verification to the model, OpenCode and Codex put it in the system prompt, Claude Code uses a separate adversarial verifier subagent but as a soft contract, and only OMP's cleanse actually runs checks from harness code. looplane takes the hardest path: if files changed, every declared verification command must pass before terminal_reason=verified; with no changes, checks don't rerun (no_changes). Whether to verify is decided by code, not by the model."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-verification-gate)

## The design problem

The agent finishes its loop and the model emits a final answer: "Fixed. All tests pass." Is the task done at this moment?

The honest answer is: you know nothing yet. An LLM's completion claim is generated text, not an execution result. It may have actually run the tests — or it may have written "tests pass" as part of the narrative. This hallucinated-completion pattern is one of the most common agent failure modes: wrong file edited, half-fixed, or nothing changed at all, delivered with total confidence. So every agent harness has to answer three questions:

1. Who decides what "success" means — the model, the harness, or the user?
2. Where are verification commands declared? Who runs them?
3. After a verification failure — terminate, or feed it back for another round?

## How the five do it

### pi: deliberately minimal, verification left to the user

pi's system prompt is assembled by `pi-mono/packages/coding-agent/src/core/system-prompt.ts#buildSystemPrompt`, whose guidelines amount to "be concise" and "show file paths clearly." There is no verification gate anywhere in `packages/coding-agent/src/` — when the model stops calling tools, the turn simply ends. That's not laziness; it's positioning. pi treats itself as an embeddable core and hands verification strategy to the application layer above it.

### OpenCode: obligations written into prompts, not gates in code

OpenCode's default prompt (`opencode/packages/opencode/src/session/prompt/default.txt`) explicitly demands: after completing a task you MUST run lint and typecheck commands via Bash, and NEVER assume the test framework. Its beast-mode prompt (`opencode/packages/opencode/src/session/prompt/beast.txt`) goes harder: "NEVER end your turn without having truly and completely solved the problem," and "failing to test rigorously is the NUMBER ONE failure mode." Strong words — but the executing subject is still the model. It can choose not to run anything; the harness won't intercept.

### Codex: a context-sensitive validation philosophy

Codex devotes a system-prompt section to this (`codex/codex-rs/core/gpt_5_1_prompt.md`, "Validating your work"): use tests if they exist, start with tests closest to your change, don't fix unrelated broken tests — and whether to proactively run them depends on approval mode. In non-interactive mode, run everything you need; in interactive modes, suggest first and let the user confirm. That makes even "when to verify" a policy question — more nuanced than OpenCode, but still prompt-level.

### OMP: cleanse lets the harness run the checks itself

The first of the five to move verification into code is OMP. Its cleanse subsystem (`oh-my-pi/packages/coding-agent/src/cleanse/loop.ts#CleanseLoopDependencies`) has the harness collect diagnostics, dispatch repair subagents, then run a post-repair `verify()` pass. Diagnostics come from real external checker binaries (`oh-my-pi/packages/coding-agent/src/cleanse/checkers.ts#CheckerPlan`), not model self-assessment. The scope is narrower though — lint/type/diagnostic cleanup, not a general completion criterion. And OMP's goals mode (`oh-my-pi/packages/coding-agent/src/goals/runtime.ts#completeGoalFromTool`) still lets the model declare a goal complete, with only token/time budgets as brakes.

### Claude Code: an independent adversarial verifier

Claude Code (decompiled v2.1.88) goes furthest. It ships a built-in verification subagent (`claude-code-source/src/tools/AgentTool/built-in/verificationAgent.ts#VERIFICATION_SYSTEM_PROMPT`) that opens with: "Your job is not to confirm the implementation works — it's to try to break it." It names the two failure patterns it fights: verification avoidance (finding reasons not to run checks, narrating code, writing "PASS") and being seduced by the first 80%. Every check must include the actual command executed and pasted output — "reading code is not verification" — ending in exactly `VERDICT: PASS / FAIL / PARTIAL`. Crucially, there's a contract layer (`claude-code-source/src/constants/prompts.ts`, behind the tengu_hive_evidence feature gate): non-trivial implementation (3+ file edits, backend/API, infrastructure) must pass independent adversarial verification before reporting completion, and "you cannot self-assign PARTIAL — only the verifier issues a verdict." `claude-code-source/src/tools/TodoWriteTool/TodoWriteTool.ts` even injects a nudge when the model closes three-plus tasks without any verification step. To be fair, though: all of this lives at the prompt-and-reminder layer. The model can ignore it; the harness doesn't hard-block.

## looplane's choice, and how it differs

looplane takes the road none of the five took: **make the completion criterion a hard gate inside the harness**.

Every task contract must declare at least one verification command (`looplane/src/looplane/contracts.py#VerificationCommand` — an exact argv allowlist, never interpreted by a shell). Inside the loop, `_made_changes` is set only when a modify-effect tool succeeds (`looplane/src/looplane/loop.py#_run`). When the model emits its final answer:

- No files changed → finish immediately with `terminal_reason="no_changes"` without rerunning checks — saving time, and avoiding false-red noise on no-op runs;
- Files changed → `_verify_all` (`looplane/src/looplane/loop.py#_verify_all`) reruns every declared command; all green → `terminal_reason="verified"`;
- Anything fails → the failing output is fed back as untrusted test output, looping until budget exhaustion. The final answer never influences the verdict.

That is the literal implementation of the Security invariants line in `docs/progress.md`: "A model final answer that changed files is not success until all declared verification commands pass."

The commands themselves also go through approval (`_verify_all` submits each with `ApprovalReason.FINAL_VERIFICATION`); a denial is recorded as a failed outcome — the gate never quietly turns green because a user said "skip it." The design was validated against a real provider: M3's live eval (manifest at `evals/live/tiny-python-bug.json`, runner `scripts/eval_live_provider.py`) ran five times against Ollama qwen3:4b, all five finishing `terminal_reason="verified"` with only the target file changed. The point isn't the 5/5 — it's that "completed" was decided by pytest's exit code every time, with the model's closing statement merely informational.

The difference from the five is where the defense line sits: pi/OpenCode/Codex put verification in the model's conscience, Claude Code puts it in another model's adversarial attention, looplane puts it in code. The costs are equally clear — looplane only fits closed tasks where verification can be declared upfront (bug fixes, evals), unlike interactive agents that explore conversationally; local verification executes trusted repository code without an OS sandbox, a known limitation; and resumed runs keep the gate conservatively armed, preferring one extra check run.

## Academic grounding

This maps directly onto [SWE-bench](https://arxiv.org/abs/2310.06770)'s core methodology: each task ships fail-to-pass tests, and patch correctness is judged by execution results, entirely independent of the model's self-report. SWE-bench became the standard precisely because it moved the definition of "done" from language to execution. [SWE-agent](https://arxiv.org/abs/2405.15793) showed further that agent interface design — including feedback loops — substantially moves pass rates: how and what you feed back after a failed verification is itself a design variable. [Reflexion](https://arxiv.org/abs/2303.11366) supplies the theory for the post-failure round: converting environmental feedback into verbal self-reflection improves the next attempt. looplane feeding verification stderr back into the conversation is the minimal version of that loop — reflection delegated to the model, the criterion kept in code.

## Improvement roadmap

An honest inventory, three things looplane lacks:

1. **Tiered verification.** Today it's all-or-nothing: any failed check feeds the whole batch back. Borrowing Codex's "start closest to the change" philosophy — fast, near checks (unit tests) before slow, broad ones — would shorten failure-feedback latency.
2. **An independent verification perspective.** The most valuable part of Claude Code's adversarial verifier isn't running tests — it's treating the test suite itself as suspect ("the implementer is an LLM too"). looplane fully trusts declared checks today; a read-only review pass probing boundaries beyond the declared set would close that gap.
3. **Sandboxed verification.** Running checks locally means executing trusted-repo code on the host. Once Cloudflare Sandbox lands (series order 10), the gate can be both hard and safe — the same reason Codex backs its checks with an OS sandbox.

The essence of a verification gate is one sentence: **make "success" a machine-evaluable predicate, not a confident-sounding paragraph.**

## References

- [SWE-bench: Can Language Models Resolve Real-World GitHub Issues?](https://arxiv.org/abs/2310.06770)
- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://arxiv.org/abs/2405.15793)
- [Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono) (`packages/coding-agent/src/core/system-prompt.ts`)
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) (`packages/coding-agent/src/cleanse/`, `src/goals/`)
- [sst/opencode](https://github.com/sst/opencode) (`packages/opencode/src/session/prompt/`)
- [openai/codex](https://github.com/openai/codex) (`codex-rs/core/gpt_5_1_prompt.md`)
- [anthropics/claude-code](https://github.com/anthropics/claude-code)
