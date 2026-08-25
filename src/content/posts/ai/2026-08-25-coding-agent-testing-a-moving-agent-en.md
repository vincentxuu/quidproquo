---
title: "Learning Agent Design from Mature Coding Agents (24): Testing a Moving Agent — fake-CLI Contracts, Recorded Streams, TUI Pilot"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 24
tags: [coding-agent, testing, rivumi, codex, textual]
lang: en
tldr: "An agent's two dependencies — the LLM and external CLIs — are both non-deterministic, but mature projects separate 'the moving parts' from 'the shape of the boundary': codex fakes the Responses API with wiremock plus a scripted SSE server and pins its TUI with insta snapshots; opencode built a VCR-style http-recorder package; pi splits model-backed evals from unit tests into two vitest configs; omp wraps its edit benchmark itself in unit tests. rivumi stacks four layers against external CLIs: unit tests, fake-CLI contract tests, recorded-stream integration proofs, and Textual pilot TUI tests. The methodology in one line: record real non-deterministic output, then make deterministic assertions about it."
description: "Comparing testing strategies across codex, opencode, pi, omp, and claude-code to unpack how to test a non-deterministic system that depends on an LLM and external CLIs — plus rivumi's four-layer M13 test design: unit, fake-CLI contracts, recorded-stream integration, Textual pilot."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-testing-a-moving-agent)

The [series overview](/posts/ai/2026-08-25-coding-agent-design-series-overview-en) promised five sections per post with evidence at `repo/path/file.ext#symbolName`. This post covers the hardest kind of tests: tests for a system under test that misbehaves on purpose.

Scope first: all five projects were grepped locally — **codex** (openai/codex Rust workspace), **opencode** (sst/opencode), **pi** (badlogic/pi-mono), **omp** (can1357/oh-my-pi), and **claude-code** (community-decompiled v2.1.88). On the rivumi side I cite the M13 stage doc and commits `573c752`/`a1bfaca`/`b84fe3a`.

## The design problem: both dependencies misbehave — so what do you test?

A coding agent stands on two non-deterministic components:

1. **The LLM** — same prompt, different tokens every run;
2. **External CLIs** — Claude Code, Codex, OpenCode, Pi, and OMP each ship breaking changes to their JSONL event schemas whenever they feel like it, and you don't control their versioning.

The classic unit-test premise of "same input, same output" fails outright. But notice what actually fails: only the *content*, not the *shape*. The model says something different each time, yet the event stream's structure (where a tool call appears, where the turn ends) is stable. CLI versions drift, but argv shapes and JSON schemas are frozen within any given version range. So the real question is: **carve the deterministic parts out of a non-deterministic system, and test each layer with the right tool.**

## How the five do it

### codex: fake API servers + snapshot tests

codex-rs has the most complete test infrastructure. Core tests share a helper module: `codex-rs/core/tests/common/responses.rs#ResponseMock` spins up a wiremock-based fake Responses API server whose received requests can be inspected afterwards (`requests()`, `saw_function_call()`); for streaming scenarios, `codex-rs/core/tests/common/streaming_sse.rs#StreamingSseServer` lets you script a sequence of SSE chunks the server plays back. In effect, the model is replaced by an HTTP server you can write scripts for, while the real agent loop runs on top.

One more discipline worth stealing: `codex-rs/core/src/test_support.rs` opens with "Production code should not depend on this module" — test helpers get their own exit door instead of living inside product code.

The TUI side is a snapshot kingdom: `codex-rs/tui/src/chatwidget/tests/` holds two dozen files split by topic (approval_requests, slash_commands, status_and_layout...), with rendered output pinned via `insta::assert_snapshot!` (`tests/status_and_layout.rs`) against `.snap` files. The screen may be alive, but every cell is nailed down.

### opencode: a VCR-style recorder package

opencode turned "record and replay" into a standalone package: `opencode/packages/http-recorder`, self-described in its package.json as "Record and replay Effect HTTP client traffic with deterministic cassettes" — the VCR metaphor is right there in the name. `packages/http-recorder/src/cassette.ts#CassetteNotFoundError` defines an explicit error when a cassette is missing; `cassette.ts#fileSystem` provides a filesystem-backed layer alongside an in-memory one. The core test tree has a matching `recordings/` directory. Recording also goes through redaction (`redaction.ts`) so credentials never leak into fixtures — a step the recording approach commonly forgets.

### pi: evals and unit tests as separate citizens

`pi-mono/packages/evals` carries two vitest configs: `vitest.config.ts` includes only `src/**/*.eval.ts` (model-backed; costs money and time, 120s timeout), while `vitest.test.config.ts` includes only `test/**/*.test.ts` (deterministic). Evals are wrapped in [vitest-evals](https://github.com/getsentry/vitest-evals)'s `describeEval`, with harnesses provided by `packages/evals/src/pi-harness.ts#createPiCodingAgentHarness` — wiring a real AgentSession into the eval framework and leaving session JSONL artifacts behind after each run. `packages/evals/src/smoke.eval.ts` is the minimal case: ask for the capital of France, assert the answer is Paris and token count is positive.

The division of labor is crisp: unit tests answer "is the program correct," evals answer "is the model behaving," and each runs on its own command and cadence.

### omp: even the benchmark must be tested

omp's `packages/typescript-edit-benchmark` shows a third role: benchmark-as-test. `packages/typescript-edit-benchmark/src/generate.ts` generates editing tasks from real TypeScript sources, with difficulty tiers from easy to nightmare (repeated lines, 300+ line files, similar blocks); `packages/typescript-edit-benchmark/src/verify.ts#verifyExpectedFiles` grades answers (compared after Prettier formatting, tolerating harmless blank-line differences). The key point: the benchmark machinery itself — hunk parsing, round-trips, the verifier — is fully fenced by deterministic tests (`packages/typescript-edit-benchmark/test/hunks.test.ts`). A measuring instrument has to be trustworthy before its readings mean anything.

### claude-code: only remnants survive decompilation

You won't find a formal test suite in the decompiled claude-code-source (fair enough — shipped bundles don't carry tests). But there's an interesting leftover: `claude-code-source/src/tools/testing/TestingPermissionTool.tsx` — a test tool that always pops a permission dialog, enabled only when `isEnabled()` returns `"production" === 'test'`. Even a closed-source commercial agent plants test hooks in product code so end-to-end flows can trigger specific interaction paths. Test requirements shape product code; this is indirect proof.

## rivumi's four layers

rivumi drives five external CLIs (M13) and faces exactly the same problem. Its current answer is four layers, cheapest first:

**Layer 1: plain unit tests.** Deterministic modules like policy, tools, and normalizers get conventional coverage (`tests/test_policy.py`, `tests/test_tools.py`). All green is table stakes.

**Layer 2: fake-CLI contract tests.** Test a CLI's interface contract without the CLI present. `tests/test_external_cli_backends.py#_fake_executable` is refreshingly naive: write a fake executable that reads a payload from an env var and prints it to stdout, then let the *real* backend run it — argv shape (`test_pi_argv_shape` asserts `pi --mode json prompt`), normalizer mappings (which field carries the tool name), and error schemas are all pinned with no network and no vendor binary. This layer catches "the schema I believed in vs. the implementation."

**Layer 3: recorded-stream integration proofs.** Hand-written fake streams are too clean. So M13 first ran a real task once each against the installed Pi/OMP/OpenCode via `scripts/m13_capture_runtimes.py`, recorded raw stdout as JSONL into `tests/fixtures/m13/` (commits `573c752`, `b84fe3a`), then replayed it through `tests/test_external_runner_integration.py#RecordedStreamBackend`: the real normalizer eats the real stream, feeds the real `ExternalCodingRunner`, and a synthetic workspace patch gives the diff/verify pipeline something to reconcile. Each runtime gets four assertions: normalization yields the correct tool name and assistant text, the runner reaches `verified`, an error stream maps to an actionable `external_agent_error`, and cancellation maps to `user_cancelled`. OpenCode's success schema was only discovered through live capture — assistant text lives in `part.text` and tool names in `part.tool`; no hand-written fixture would have produced that mistake (commit `b84fe3a`).

**Layer 4: Textual pilot TUI tests.** No screenshot comparison: the TUI runs the real app headlessly via Textual's built-in pilot. `tests/test_tui.py` is full of `app.run_test(size=(100, 30)) as pilot` followed by `pilot.click("#task")`, `pilot.press("enter")` — operating it like a human and asserting on state and on-screen text. Onboarding flows, runtime switching, and shortcuts are all tested this way. Live smokes remain opt-in: real CLIs run only when installed (the stage doc's live captures are exactly that), and CI doesn't depend on them.

## Engineering grounding

Layer 4 has official backing: [Textual's testing guide](https://textual.textualize.io/guide/testing/) documents how `run_test()` yields a `Pilot` object whose `click()`, `press()`, and `pause()` simulate user input, with the whole app running in one event loop so internal state can be awaited directly — turning "TUIs are hard to automate" into "a TUI is just another async function." The theory of the snapshot route is documented in [insta](https://insta.rs/)'s snapshot review workflow; the reference implementation for splitting out evals is [vitest-evals](https://github.com/getsentry/vitest-evals). As for record-replay, it was popularized by VCR-style HTTP testing tools, and opencode's http-recorder ports the same idea to Effect HTTP clients.

## Improvement roadmap

The four layers work, but measured against the five projects three gaps remain:

1. **Recorded coverage is narrow.** Current fixtures hold single-turn read-only tasks plus one error stream; real streams for multi-turn resume, approval round-trips, and diff reconciliation aren't recorded yet (the stage doc lists this as a limitation). opencode's http-recorder even handles redaction; rivumi's capture harness has no automated sensitive-content masking step.
2. **No model-backed eval layer.** pi makes "is the model behaving" a repeatable, artifact-producing routine via `describeEval`; rivumi has one-off live smokes but no repeatable eval suite. Once the native harness's prompts start iterating (prompt versioning comes later in this series), lacking evals means relying on vibes.
3. **TUI tests cover interactions, not visuals.** Pilot tests behavior, not pixels. codex pins every rendered state with insta snapshots; if rivumi wants layout changes without fear, a rendering-snapshot layer is inevitable (the SVG screenshot export path already validated in smoke runs puts it half a step away).

One-line takeaway: a non-deterministic system isn't untestable — you just can't test it one way. Pin schemas with fake CLIs, record real behavior as streams, pin screens as snapshots, hand model behavior to evals. Four layers, each covering a segment, turn a "moving agent" into a system you can refactor without fear.

## References

- [Textual Testing Guide (Pilot, run_test)](https://textual.textualize.io/guide/testing/)
- [insta — Rust snapshot testing](https://insta.rs/)
- [vitest-evals (Sentry)](https://github.com/getsentry/vitest-evals)
- [openai/codex — codex-rs core tests](https://github.com/openai/codex/tree/main/codex-rs/core/tests)
- [sst/opencode — packages/http-recorder](https://github.com/sst/opencode/tree/dev/packages/http-recorder)
- [badlogic/pi-mono — packages/evals](https://github.com/badlogic/pi-mono/tree/main/packages/evals)
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)
- [anthropics/claude-code](https://github.com/anthropics/claude-code)
