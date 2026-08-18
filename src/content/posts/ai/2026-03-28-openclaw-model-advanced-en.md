---
title: "OpenClaw Models, Advanced: Two-Stage Failover, the Real Cooldown Numbers, and Prompt Caching"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, llm, model-failover, prompt-caching, token-usage, cooldown]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 8
tldr: "OpenClaw's failover runs in two stages: rotate auth profiles within the provider, then fall back to another model. But what really governs behavior is who chose the model — a model you picked yourself with /model is strict, and its failure is reported rather than answered by some other model."
description: "OpenClaw's model failover: the two stages, how selection source determines strictness, the real cooldown and billing-disable rules, which errors advance fallback, and prompt caching settings across providers."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-model-advanced)

The previous article covered choosing models and providers. This one covers **what happens when they break**, and how to make them cheaper.

## Two stages

Failure handling has two layers, in a fixed order:

1. **Auth profile rotation** — try another credential within the current provider
2. **Model fallback** — move to the next model in `agents.defaults.model.fallbacks`

The second layer has a property many people miss: **fallback is turn-local**. If this turn answers on a fallback, the next turn starts again from your selected primary; the fallback is never stored as the new selection. Only the notice state is persisted, so `/status` and transition notices can distinguish "the model you selected" from "the model that answered."

## Who chose the model decides how strict it is

This is the section worth remembering. The same `provider/model` behaves differently depending on where it came from:

| Source | Behavior |
|---|---|
| Configured default primary | Normal starting point; walks the `fallbacks` chain |
| Agent primary (`agents.entries.*.model`) | **Strict**, unless that agent's model object has its own `fallbacks` |
| Auto fallback | A temporary recovery state; OpenClaw reprobes the original primary every 5 minutes and clears it on recovery |
| **User session selection** | **Exact and strict.** `/model`, the model picker, and `sessions.patch` all count. If the selected model fails before producing a reply, OpenClaw **reports the failure rather than answering from another model** |
| Cron `--model` | A job primary; still uses configured fallbacks unless the job supplies its own (`fallbacks: []` forces strict) |

The design is right: when you name a model by hand, you usually want that model's behavior, and silently substituting another makes the result untrustworthy. Older session entries without `modelOverrideSource` are treated as user overrides for the same reason — so an explicit old choice is not quietly converted into fallback behavior.

## The real cooldown numbers

Regular failures (not billing, not permanent auth) escalate with the profile's recent error count:

| Failure | Cooldown |
|---|---|
| 1st | 30 seconds |
| 2nd | 1 minute |
| 3rd and beyond | 5 minutes (cap) |

Counters reset once the profile's failure window has passed. State lives in the per-agent SQLite `usageStats` (`lastUsed`, `cooldownUntil`, `errorCount`).

**Billing failures take a different path.** "Insufficient credits" and "credit balance too low" are usually not transient, so instead of a short cooldown OpenClaw marks the profile **disabled** with a longer backoff and rotates to the next profile or provider.

One classification detail is worth knowing: **not every billing-shaped response is a 402, and not every 402 lands in the billing lane.** Explicit billing text stays in the billing lane even when the provider returns 401 or 403. Conversely, temporary usage-window and organization spend-limit errors ("weekly usage limit exhausted", "daily limit reached, resets tomorrow") are classified as `rate_limit` and take the short-cooldown path instead of the long disable.

Rate-limit cooldowns can also be **model-scoped**: when the failing model id is known, OpenClaw records `cooldownModel` and a sibling model on the same provider can still be tried. Billing and disable windows still block the whole profile across every model.

## Which errors advance fallback

Advancing: auth failures, rate limits and cooldown exhaustion, overloaded/provider-busy errors, timeout-shaped failures, billing disables, and other unrecognized errors while candidates remain.

The ones that **do not** advance are the interesting part:

- **Format and invalid-request errors** are usually terminal — resending the same payload would fail identically, so OpenClaw surfaces them instead of rotating auth profiles
- **Context overflow errors** (`request_too_large`, input exceeding the maximum token count) stay inside compaction/retry logic rather than being treated as provider faults
- Explicit aborts that are not timeout- or failover-shaped

The rate-limit bucket is much broader than a plain `429` — it also covers `Too many concurrent requests`, `ThrottlingException`, `concurrency limit reached`, `resource exhausted`, and periodic usage-window messages like "weekly limit reached."

## Overload gets special treatment

Overload and rate limits are handled more aggressively than billing cooldowns: by default OpenClaw allows **one** same-provider auth-profile retry, then switches to the next configured model fallback without waiting.

If the entire candidate chain is exhausted **only by overload**, the reply runner retries the whole chain within the same turn, up to 10 times. Backoff starts at 2.5 seconds and doubles to a 30-second cap. There is an important guard: **the full-turn retry is allowed only before tool execution or assistant output has started**, so an overload arriving after observable work cannot produce duplicate mutations or duplicate messages.

Once the turn has waited 30 seconds, OpenClaw sends one transient status notice so you are not staring at nothing:

```text
The AI service is temporarily overloaded. I'm still retrying; this may take a few minutes.
```

There is one more trap here: some provider SDKs will sleep through a long `Retry-After` before returning control. For Stainless-based SDKs (Anthropic, OpenAI), OpenClaw caps the SDK-internal wait at **60 seconds** by default and surfaces longer retryable responses immediately so this failover path can actually run. Tune it with `OPENCLAW_SDK_RETRY_MAX_WAIT_SECONDS`.

## Where credentials live

This changed after March, and it matters:

- Secrets and runtime auth-routing state live in **`~/.openclaw/agents/<agentId>/agent/openclaw-agent.sqlite`**
- Config `auth.profiles` / `auth.order` are **metadata and routing only — no secrets**
- Legacy `credentials/oauth.json`, `auth-profiles.json`, `auth-state.json`, and per-agent `auth.json` files are **imported only by `openclaw doctor --fix`**

That last point has teeth: **the runtime fails closed for the affected agent** until credential-bearing legacy files are migrated. It never silently imports them or falls back to them. So if an agent stops working after an upgrade, run `doctor --fix` first.

There are three credential types: `api_key`, `oauth` (access/refresh/expires, plus projectId or enterpriseUrl for some providers), and `token` — a static bearer-style token that **OpenClaw does not refresh**, used for `aws-sdk` and other credential-chain auth modes.

## Rotation order and session stickiness

With multiple profiles on one provider and no `auth.order` set, the round-robin order is:

1. **Profile type**: OAuth → static token → API key
2. **Within OAuth**: profiles with a currently usable access token before expired ones (expired profiles stay eligible so the runtime can refresh them when no usable peer exists)
3. **`usageStats.lastUsed`**: oldest first within each tier
4. Cooldown/disabled profiles move to the end, ordered by soonest expiry

**Session stickiness** exists for cache efficiency: the automatically chosen auth profile is pinned per session rather than rotated per request. It only changes on session reset (`/new`, `/reset`), on compaction completion, or when the profile enters cooldown/disabled.

Selecting manually with `/model …@<profile> -s` sets a **user pin**, which survives `/new`, `/reset`, session rollover, compaction, and cooldown windows. While that exact profile is in cooldown, OpenClaw tries the next eligible same-provider profile **without replacing your pin**, and returns to it once the cooldown expires.

Note the boundary: auth rotation does not loosen model selection. An explicit user provider/model selection still reports failure once its same-provider auth profiles are exhausted.

### Codex subscription plus API-key backup

Because OpenAI auth and runtime are separate, this works: `openai/gpt-*` stays on the Codex harness while auth rotates between a subscription profile and an API-key backup.

```json5
{
  auth: {
    order: {
      openai: ["openai:user@example.com", "openai:api-key-backup"],
    },
  },
}
```

When the subscription hits a Codex usage limit, OpenClaw records the exact reset time Codex provides, tries the next ordered profile, and **keeps the run inside the Codex harness**. Once the reset time passes, the subscription profile is eligible again.

## Prompt caching

The setting is `cacheRetention`, with values `none` / `short` / `long`, configurable as a global default, per model, and per agent. The older `cacheControlTtl` still maps (`5m` → `short`, `1h` → `long`) but new config should use `cacheRetention`. Note that `"standard"` is not an alias — use `"short"`; invalid values are ignored with a warning.

What each provider actually does:

| Provider | Behavior |
|---|---|
| Anthropic (direct API / Vertex) | `short` is the default 5-minute ephemeral cache, `long` requests the 1-hour TTL. When unset, **direct Anthropic routes are seeded with `short`**; other Anthropic-family routes need an explicit value |
| Amazon Bedrock, custom anthropic-messages endpoints | Supported for Claude models, but `cacheRetention` must be set explicitly |
| Google | Setting it auto-creates, reuses, and refreshes a `cachedContents` resource for the system prompt — no manual handle. TTL is 300s for `short`, 3600s for `long` |
| OpenAI-compatible endpoints | `prompt_cache_retention: "24h"` is added only when `long` is selected and the endpoint supports both the cache key and long retention. Together AI and Cloudflare compat profiles disable it |

One easy misunderstanding: enabling long retention implicitly via the environment (`OPENCLAW_CACHE_RETENTION=long` with no explicit `cacheRetention`) **only upgrades to the 1-hour TTL on `api.anthropic.com` or Vertex AI hosts**; other hosts stay on the 5-minute cache.

Two settings pair with it: `contextPruning.mode: "cache-ttl"` prunes old tool-result context after the TTL window so a post-idle request does not re-cache oversized history, and `heartbeat` can keep caches warm for long-lived agents (with a one-hour TTL, `every: "55m"`) — but only enable it for agents that genuinely benefit.

## The big picture

These three topics answer one question: **how far should the system decide on your behalf when things go wrong?**

OpenClaw's answer is measured. Configured defaults may fall back to another model, but **your manual selection may not**. Transient problems get a short cooldown and an automatic detour, while billing problems disable that credential instead of retrying it every minute. Overload will wait for you — but only before any observable work has happened.

The seconds will rot. That dividing line will not.

## Changelog

- 2026-08-18: Substantially revised against the current official docs. **Two wrong numbers corrected**: regular cooldowns are 30 seconds → 1 minute → 5 minutes (cap), not the "1 min → 5 min → 25 min → 1 hr" the original claimed; billing failures are not a "5 hr → 24 hr" escalating cooldown but a profile marked disabled with a longer backoff. **One wrong path corrected**: auth profiles now live in the per-agent `openclaw-agent.sqlite`, and the `auth-profiles.json` the original cited is legacy, with the runtime failing closed for unmigrated agents. Added: fallback is turn-local, selection source determines strictness (a manually selected model reports failure instead of substituting another), which errors do not advance fallback (format errors, context overflow), the full-turn overload retry and its 30-second notice, the 60-second cap on SDK `Retry-After` waits, the static-token tier in rotation order, and the `auth.order` pattern for a Codex subscription with an API-key backup. Prompt caching updated to `cacheRetention` (with `cacheControlTtl` as legacy), plus the actual behavior for Google `cachedContents` and OpenAI-compatible endpoints.

## References

This article draws on the following official OpenClaw documentation:

- [Model failover](https://docs.openclaw.ai/concepts/model-failover) — the two stages, selection-source policy, cooldowns and billing disables, error classification
- [Prompt caching](https://docs.openclaw.ai/reference/prompt-caching) — `cacheRetention` and per-provider behavior
- [Model providers](https://docs.openclaw.ai/concepts/model-providers) — API key rotation env vars and provider behavior
- [Models CLI](https://docs.openclaw.ai/concepts/models) — selection order and session pinning
- [Agent runtimes](https://docs.openclaw.ai/concepts/agent-runtimes) — the auth/runtime split behind the Codex case
