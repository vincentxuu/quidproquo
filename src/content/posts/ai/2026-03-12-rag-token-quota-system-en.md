---
title: "RAG Quota System: Controlling LLM Costs with Dual Limits"
date: 2026-03-12
updated: 2026-08-19
type: guide
category: ai
tags: [rag, quota, rate-limiting, token-budget, cost-control, cloudflare-workers]
lang: en
tldr: "Limiting request count alone is not enough — a single long query can consume ten times the tokens of a normal one. Dual quotas (request count + token count) are what truly control costs."
description: "Quota design for RAG systems: dual limits (request + token), atomic SQL UPDATE, disconnection refunds, quota reset strategies, and tiered quotas integrated with a rank system."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 43
---

> 🌏 [中文版](/posts/ai/2026-03-12-rag-token-quota-system)

LLM APIs are billed per token — without usage controls, costs grow unchecked. Quota design for RAG systems looks simple on the surface, but the details are plentiful.

The most common approach is a "daily request count limit," but that's insufficient: one question might include extensive context (50 route descriptions) and generate 2,000 tokens, while another has minimal context and generates 200 tokens. Same request count, 10x difference in token consumption.

**Dual quotas**: limiting both request count and token count simultaneously is what truly controls costs.

## Quota Structure

```typescript
interface UserQuota {
  daily_ai_used: number;      // Requests used today
  daily_ai_limit: number;     // Daily request limit
  daily_token_used: number;   // Tokens used today
  daily_token_limit: number;  // Daily token limit
  quota_reset_at: number;     // Next reset time (UTC midnight)
}
```

Two dimensions are enforced simultaneously:

- Request count: prevents high-frequency abuse (unlimited questions per minute)
- Token count: prevents low-frequency but high-consumption usage (every query is extremely long)

Once either quota is exhausted, new requests are rejected.

## Atomic Deduction

Quota deduction must be atomic to prevent concurrent requests from both passing the check simultaneously:

```sql
UPDATE user_quotas
SET
  daily_ai_used = daily_ai_used + 1,
  daily_token_used = daily_token_used + :estimated_tokens
WHERE
  user_id = :user_id
  AND daily_ai_used < daily_ai_limit           -- Request count not exceeded
  AND daily_token_used + :estimated_tokens <= daily_token_limit  -- Token count not exceeded
RETURNING *;
```

This UPDATE only executes when both conditions are met, and because it's a single SQL statement, it's an atomic operation at the database level.

Note one condition it is missing: `quota_reset_at`. In a real deployment it has to be read together with the lazy reset in the "Quota Reset" section below -- run the reset first, then the deduction, or a user whose quota is exhausted but whose reset time has already passed gets rejected outright by this statement.

**Why not use two steps (SELECT first, then UPDATE)?**

If a user fires two concurrent requests, both SELECTs might see sufficient quota, and both proceed to UPDATE, causing an overrun. The single UPDATE + WHERE condition approach lets the database guarantee that only one request can pass through.

```typescript
const result = await db
  .update(userQuotas)
  .set({
    dailyAiUsed: sql`daily_ai_used + 1`,
    dailyTokenUsed: sql`daily_token_used + ${estimatedTokens}`,
  })
  .where(
    and(
      eq(userQuotas.userId, userId),
      lt(userQuotas.dailyAiUsed, userQuotas.dailyAiLimit),
      lte(
        sql`daily_token_used + ${estimatedTokens}`,
        userQuotas.dailyTokenLimit
      )
    )
  )
  .returning();

if (result.length === 0) {
  throw new QuotaExceededException();
}
```

`returning()` returns the updated row; if no rows were updated (conditions not met), `result` is an empty array, and an exception is thrown directly.

## Token Estimation and Correction

**Pre-estimation**: Before the request, we don't know how many tokens the LLM will generate, so we pre-deduct using an estimate:

```typescript
function estimateTokens(query: string, contextDocs: number): number {
  const queryTokens = countTokens(query);   // use a real tokenizer, not chars / constant
  const contextTokens = contextDocs * AVG_TOKENS_PER_DOC;  // averaged from your own logs
  const generationEstimate = MAX_OUTPUT_TOKENS_CAP;        // use the max-output cap you set
  return queryTokens + contextTokens + generationEstimate;
}
```

There is an easy trap here: the familiar "characters ÷ 4" heuristic is an **English** rule of thumb. CJK text packs far fewer characters into a token, so the same formula systematically underestimates -- quota barely moves while the bill does not match. On a Chinese-language site, run a real tokenizer ([tiktoken](https://github.com/openai/tiktoken) for OpenAI-family models, the model's own [tokenizers](https://github.com/huggingface/tokenizers) config otherwise), or at minimum regress your own coefficient from your own query corpus instead of copying the English 4.

For the generation side, pre-deduct at the `max_tokens` cap. Over-deducting and refunding beats under-deducting and discovering the overrun after the text is already generated.

**Post-correction**: After generation completes, update with the actual token count:

```typescript
const actualTokens = usage.total_tokens;      // see below: streaming needs extra work
const diff = actualTokens - estimatedTokens;

if (diff !== 0) {
  await db.update(userQuotas).set({
    dailyTokenUsed: sql`daily_token_used + ${diff}`,
  }).where(eq(userQuotas.userId, userId));
}
```

The difference (positive or negative) is corrected, ensuring accurate token accounting.

**Not getting `usage` while streaming is the normal case.** On an OpenAI-compatible Chat Completions stream, `usage` is `null` on every chunk by default; to receive it you must pass `stream_options: { include_usage: true }`, after which the provider emits one extra chunk before `[DONE]` carrying `choices: []` and only `usage` ([OpenAI cookbook](https://developers.openai.com/cookbook/examples/how_to_stream_completions)). OpenAI's own docs also state plainly that **if the stream is interrupted, you may never receive that final usage chunk**. So post-correction must be written as "correct only if usage arrived," falling back to the estimate when it doesn't -- never assume it will show up.

## Disconnection Refunds

When a client disconnects during an SSE stream, refund the entire request's quota:

```typescript
if (isClientDisconnected(error) && quotaDeducted) {
  await db.update(userQuotas).set({
    dailyAiUsed: sql`daily_ai_used - 1`,
    // refund what was actually deducted, not the estimate
    dailyTokenUsed: sql`daily_token_used - ${deductedTokens}`,
  }).where(eq(userQuotas.userId, userId));
}
```

What gets refunded must be the total actually deducted for this request (`deductedTokens`), not `estimatedTokens`. The two usually match, but once post-correction has already run -- the stream finished, usage came back, and only then did the client drop -- the amount on the books is the estimate plus the correction delta, and refunding `estimatedTokens` skews the ledger. The safest shape is to track "how much this request deducted" on the request context, refund against that, and guard deduction/refund with a flag so each happens at most once per request lifetime.

If the user didn't receive the response, don't charge their quota. This is a user-friendly design that also prevents network issues from consuming a user's quota. Be aware that the rule itself is abusable: deliberately disconnecting just before generation completes gets the generation for free. Fine at low traffic; at scale, switch to "charge for what was already produced, refund only the unproduced estimate."

## Quota Reset

Daily reset at UTC midnight:

```typescript
function getResetTime(): number {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return Math.floor(tomorrow.getTime() / 1000);
}
```

The reset is lazy: instead of running a scheduled task, it checks whether a reset is needed during each quota check:

```sql
-- If quota_reset_at has passed, reset first then deduct
UPDATE user_quotas
SET
  daily_ai_used = 1,
  daily_token_used = :estimated_tokens,
  quota_reset_at = :next_reset
WHERE
  user_id = :user_id
  AND quota_reset_at <= unixepoch()   -- Past reset time
  AND 1 <= daily_ai_limit             -- Still has quota after reset
  AND :estimated_tokens <= daily_token_limit;
```

This eliminates the need for scheduled tasks — each request automatically handles the reset, which also avoids race conditions between scheduled tasks and incoming requests.

Order matters: **try this reset UPDATE first, and only run the deduction UPDATE above if it updated no rows** (meaning the reset time hasn't arrived). Written the other way round, a user past their reset time but out of quota gets blocked by the deduction statement first. Both run within the same request, and each is a single atomic statement.

## Tiered Quotas (Climber Rank)

Quotas are tied to user rank — higher rank means more quota:

| Rank | Points Threshold | Daily Requests | Daily Tokens |
|------|-----------------|----------------|-------------|
| Foothill | 0 | 2 | 5,000 |
| Wall | 20 | 6 | 15,000 |
| Ridge | 70 | 12 | 30,000 |
| Summit | 100 | 24 | 60,000 |

Points come from completing your profile, sharing climbing stories, and logging ascents. The more active a user is, the higher their rank and the more quota they receive. This design turns the quota system into a community engagement incentive as well.

Admins can set a `rank_override_id` to directly assign a user's rank (bypassing automatic calculation), suitable for test accounts or special collaborators who need higher quotas.

## Summary

The hard part of a quota system isn't the limits themselves — it's handling the edge cases: race conditions on concurrent requests (atomic UPDATE), refunds on stream disconnections (don't shortchange users), correction of estimation vs. actual differences (avoid accounting drift), and reset timing (lazy reset vs. scheduled tasks).

Get all these details right, and the quota system can control costs without making users feel like they're being nickel-and-dimed.

---

## Changelog

- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "RAG Techniques Compendium" series.

## References

- [OpenAI Tokenizer (tiktoken) GitHub Repository](https://github.com/openai/tiktoken)
- [Hugging Face tokenizers](https://github.com/huggingface/tokenizers) -- tokenizers for non-OpenAI models
- [OpenAI Cookbook: How to stream completions](https://developers.openai.com/cookbook/examples/how_to_stream_completions) -- behavior and limits of `stream_options.include_usage`
- [OpenAI Rate Limits Documentation](https://platform.openai.com/docs/guides/rate-limits)
- [Anthropic API Rate Limits](https://docs.anthropic.com/en/api/rate-limits)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [SQLite Atomic Commit (SQLite Documentation)](https://www.sqlite.org/atomiccommit.html)
