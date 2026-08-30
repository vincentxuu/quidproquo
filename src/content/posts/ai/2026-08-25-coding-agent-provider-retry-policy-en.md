---
title: "Learning Design from Mature Coding Agents (7): Provider Retry Policy — From One 5xx to Bounded Retry and Fallback"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 7
tags: [coding-agent, harness-engineering, llm-api, retry, error-handling, llm-agents]
lang: en
description: "How pi, OMP, OpenCode, Codex, and Claude Code classify provider errors and structure retries — the division of labor between SDK built-in retries and harness-level retries, respecting Retry-After, jitter, and fallback — compared with rivumi's fix for 'one 5xx fails the whole run'."
tldr: "Intermittent NVIDIA NIM 500s exposed Rivumi's early gap: classified errors with no retry consumer. SDK retries are now disabled; the harness gives each candidate up to five attempts with jittered exponential backoff and capped Retry-After handling, then can move to an explicitly configured fallback model. Both model.retry and model.fallback enter the event log."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-provider-retry-policy)

## The design problem

This post starts from a real bug: NVIDIA NIM intermittently returned 500s and 503 "overloaded" for `nvidia/nemotron-3-ultra-550b-a55b`. The model ID was valid and the payload compatible (verified by replaying through the real code path), yet rivumi's runs kept getting marked FAILED one after another, leaving nothing on screen but a meaningless "Error: provider retryable".

The diagnosis report (`rivumi/docs/diagnoses/nim-500-diagnosis.md`) uncovered embarrassing facts. Error classification already existed — `rivumi/src/rivumi/models.py#_error_kind` maps status codes >= 500 to `RETRYABLE`, and the `ProviderError.retryable` property was defined correctly — but that field **was only written into the event log, with no consumer**. A repo-wide search found no loop or backoff conditioned on `exc.retryable`. The only retry actually running was the OpenAI SDK's built-in `DEFAULT_MAX_RETRIES = 2`, hidden where users can't see it: the SDK silently retried twice, exhausted its budget, raised, and the harness immediately gave up on the entire run.

So "why does one 5xx kill the whole run" has a three-part answer: classification had no consumer; real retries were being done secretly by the SDK (unobservable, untunable); and failure presentation offered a category name instead of a human-readable message. These map exactly onto the three cores of retry policy design: **who owns retries, retries must be observable, and giving up must speak plainly**.

## What the five do

### pi: two-layer division of labor, spelled out in doc comments

pi is the most explicit among the five about "SDK retry vs harness retry". The comment on `pi-mono/packages/ai/src/utils/provider-retry.ts#retryProviderRequest` says it directly: the OpenAI and Anthropic SDKs' built-in retry timers ignore the request AbortSignal, so callers must invoke the SDK with `maxRetries: 0` and wrap it in this **abortable** helper. It mirrors the SDKs' own decision logic (`x-should-retry` header, 408/409/429/5xx), prefers `retry-after-ms` / `retry-after` headers for delay (failing fast if the server-requested delay exceeds a 60-second cap), and otherwise falls back to exponential backoff with negative jitter. The wiring is visible: `pi-mono/packages/ai/src/api/openai-responses.ts#retryProviderRequest` and `anthropic-messages.ts#retryProviderRequest` both set `maxRetries: 0` first.

The second layer lives in the harness: `pi-mono/packages/ai/src/utils/retry.ts#isRetryableAssistantError` classifies normalized error messages by string patterns — 5xx, overloaded, dropped connections, prematurely ended streams are all retryable, while account-level limits like `insufficient_quota` and billing errors are explicitly **non**-retryable. `pi-mono/packages/ai/src/utils/retry.ts#retryAssistantCall` then runs exponential backoff per its `RetryPolicy` (3 attempts, 2000ms base by default), emits callbacks around every scheduled retry, and converges aborts during backoff into a normal aborted result.

### omp: the finest classification, with retries separated from credential rotation

OMP pushes classification furthest. `oh-my-pi/packages/ai/src/error/retryable.ts#isTransientStatus` is a pure status-code predicate (408/429/>=500), and `oh-my-pi/packages/ai/src/error/retryable.ts#isProviderRetryableError` layers transport patterns, stream parse errors, and provider-specific hooks on top. The key decision is in the comments: account-level usage limits are **deliberately** excluded from seconds-scale backoff — that belongs to the credential-rotation layer. Backoff also varies by reason: `oh-my-pi/packages/ai/src/error/rate-limit.ts#calculateRateLimitBackoffMs` assigns 30 minutes to quota exhaustion, 30 seconds to rate limits, and just 5 seconds to concurrency caps. On the harness side, `oh-my-pi/packages/coding-agent/src/session/retry-fallback-chains.ts#calculateRetryBackoffDelayMs` applies exponential backoff capped at 8 seconds with 25% jitter, provider retry-after values are authoritative inside `turn-recovery.ts`, and when the retry budget runs out there's still a fallback chain of models to walk.

### opencode: "the SDK said not to retry" isn't necessarily true

`opencode/packages/opencode/src/session/retry.ts#retryable` makes a pragmatic call: 5xx should always be retried, "even when the provider SDK doesn't explicitly mark them as retryable". Even more aggressive is `opencode/packages/opencode/src/provider/error.ts#isOpenAiErrorRetryable` — OpenAI sometimes returns 404 for models that actually exist, so OpenCode treats 404 as retryable too. The policy itself, `opencode/packages/opencode/src/session/retry.ts#policy`, is built on Effect Schedules: at most 5 attempts, 2-second initial delay, factor 2, 25% jitter. With response headers present, `retry-after-ms` and `retry-after` (including HTTP-date form) are authoritative; without them, backoff is capped at 30 seconds. Context overflow is never retried, and free-tier exhaustion turns into a UI action with an upgrade link rather than blind retries.

### codex: stream retries, transport fallback, keeping users informed

Codex builds retries in Rust as a three-piece set. Base backoff lives in `codex/codex-rs/core/src/util.rs#backoff` (200ms initial, ×2, ±10% jitter), and HTTP-level classification switches live in `codex/codex-rs/codex-client/src/retry.rs#RetryOn` (three flags: retry_429 / retry_5xx / retry_transport). The stream layer, `codex/codex-rs/core/src/responses_retry.rs#handle_retryable_response_stream_error`, is the most interesting: a server-provided `err.retry_delay()` takes precedence over local backoff; when retries run out, it first tries falling back from WebSocket to HTTPS transport before continuing; and a feature flag enables unbounded retries for pure connection failures (starting at 5 seconds, capping at 60). Every retry surfaces a "Reconnecting... n/max" event — the comment says explicitly this exists so users know the screen isn't frozen.

### claude-code: header authority, source awareness, amplification defense

Claude Code's `claude-code-source/src/services/api/withRetry.ts#withRetry` is an 800-line retry compendium: up to 10 attempts by default (`claude-code-source/src/services/api/withRetry.ts#getDefaultMaxRetries`, overridable via env var), 500ms base, capped at 32 seconds plus up to 25% positive jitter (`claude-code-source/src/services/api/withRetry.ts#getRetryDelay`). `claude-code-source/src/services/api/withRetry.ts#shouldRetry` first honors the non-standard `x-should-retry` header, then classifies 408/409/429/5xx/connection errors, clearing key caches and refreshing OAuth tokens mid-loop on 401. Two designs stand out. First, **source awareness**: background tasks (summaries, titles, classifiers) bail immediately on 529, because during capacity cascades each retry is a 3-10× gateway amplification. Second, three consecutive 529s trigger model fallback via `FallbackTriggeredError`. An unattended mode stretches backoff to five minutes, chunked into 30-second heartbeats so hosts don't mark the session idle.

## rivumi's choice and how it differs

The fix follows pi's route but leaner: **all retries unified at the harness layer**. Every `AsyncOpenAI` client sets `max_retries=0` (at the client construction in `rivumi/src/rivumi/models.py`; `provider_verification.py:144` likewise), with a comment explaining why: SDK-internal retries would multiply upstream requests 3×3 and bypass the audit trail.

The harness core is `rivumi/src/rivumi/loop.py#_complete_model_with_retry`: each candidate model gets at most 5 attempts per step, only `exc.retryable` (RETRYABLE or RATE_LIMIT) triggers retries, and AUTH and INVALID_REQUEST re-raise immediately. `#retry_delay_seconds` applies exponential backoff capped at 30 seconds with ±15% jitter. A server `Retry-After` value wins directly, subject to a 300-second safety cap. Backoff remains cancel-aware, and every retry emits `model.retry`, preserving replayable history in events.jsonl.

Exhaustion no longer means immediate failure. Repeated CLI `--fallback-model provider/model` values, or static role aliases such as `--fallback-model @cheap`, build an ordered candidate list. After five transient failures on the primary, the loop emits `model.fallback` with source/target models and failure codes, then gives the next candidate a fresh retry budget. Only exhausting every candidate produces the terminal `ProviderError`. This is an explicitly configured baseline, not an automatic best-model selector, and it does not fall back on non-transient auth or invalid-request failures.

The give-up presentation got fixed too: the `except ProviderError` path in `loop.py` now composes a human-readable message like "nvidia-nim failed 3 consecutive model requests (500, 503, 500); the service is temporarily unavailable..." into `RunResult.error`, which the TUI renders instead of "provider retryable"; `terminal_reason="provider_retryable"` stays untouched as the machine-readable field.

Compared with the five, Rivumi remains deliberately simple: jitter and model fallback exist, but credential rotation, same-model transport fallback, and source-aware or cross-step retry budgets do not. The shipped baseline makes classification, retries, fallback, and final failure observable; it does not prove production resilience during a provider outage.

## Prior art

Exponential backoff with jitter isn't a matter of taste. The [AWS Architecture Blog post "Exponential Backoff And Jitter"](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/) shows with measured data that when all clients use identical fixed backoff during recovery, synchronized spikes keep overwhelming the server — and that "full jitter" cuts completion times by an order of magnitude. That's exactly why Claude Code, OpenCode, and codex all add jitter while rivumi hasn't yet. [Chapter 22 of the Google SRE Book, "Addressing Cascading Failures"](https://sre.google/sre-book/addressing-cascading-failures/), treats retries as potential amplifiers and argues for retry budgets (e.g., "retries may not exceed 10% of total requests") to limit self-harm under overload — Claude Code banning background 529 retries outright is the same idea made concrete. As for `Retry-After` itself, [MDN's HTTP documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) defines it as a server directive, not a suggestion — all five treat it as authoritative delay, and pi even fails fast on server-requested delays over 60 seconds rather than waiting them out.

## Improvement roadmap

1. **Evaluate the jitter distribution.** The current ±15% band breaks perfect synchronization, but it is not AWS full jitter. Concurrent outage tests should decide whether `random(0, backoff)` is better.
2. **Cross-step retry budget.** Each candidate now gets 5 attempts per model step; long runs with multiple candidates can still amplify an upstream outage. An SRE-style global budget better matches overload semantics.
3. **Validate fallback policy.** Chains have landed, but role aliases come from a static table. Quality, latency, and data-governance evidence must precede sending a sensitive repository to another provider merely because the primary failed.
4. **Per-provider policy tables.** NIM's free tier is inherently flaky. OMP's reason-specific backoff lanes and pi's configurable settings (maxRetries/baseDelayMs) point the same way: retry parameters should follow the provider, not be global constants.

One-sentence summary: **a retry policy isn't "try more times" — it's turning "which errors deserve another bet" into explicit classification, server-directed delays, and fully observable attempts — and when you do give up, telling humans clearly what happened.**

## References

- [badlogic/pi-mono](https://github.com/badlogic/pi-mono) (`packages/ai/src/utils/provider-retry.ts`, `packages/ai/src/utils/retry.ts`)
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) (`packages/ai/src/error/retryable.ts`, `packages/ai/src/error/rate-limit.ts`)
- [sst/opencode](https://github.com/sst/opencode) (`packages/opencode/src/session/retry.ts`)
- [openai/codex](https://github.com/openai/codex) (`codex-rs/core/src/responses_retry.rs`, `codex-client/src/retry.rs`)
- [anthropics/claude-code](https://github.com/anthropics/claude-code) (decompiled v2.1.88, `src/services/api/withRetry.ts`)
- [AWS Architecture Blog: Exponential Backoff and Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
- [Google SRE Book: Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/)
- [MDN: Retry-After header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After)
- [OpenAI API docs: Rate limits and error handling](https://platform.openai.com/docs/guides/rate-limits)
- [Rivumi retry/fallback loop at fixed commit `2ed5efb`](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/loop.py)
