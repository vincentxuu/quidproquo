---
title: "RAG 配額系統：用雙重限制控制 LLM 成本"
date: 2026-03-12
category: ai
tags: [rag, quota, rate-limiting, token-budget, cost-control, cloudflare-workers]
lang: zh-TW
tldr: "只限制請求次數不夠，一個超長的查詢可能消耗掉十個普通查詢的 token。雙重配額（請求數 + token 數）才能真正控制成本。"
description: "RAG 系統的配額設計：雙重限制（request + token）、原子 SQL UPDATE、斷線退還、配額重置策略，以及與等級系統結合的分層配額。"
draft: false
---

LLM API 是按 token 計費的，不控制用量就是讓成本自由生長。RAG 系統的配額設計看起來簡單，但細節很多。

最常見的做法是「每日請求次數限制」，但這不夠：一個問題帶了很長的 context（50 條路線描述），生成 2000 tokens；另一個問題 context 很短，生成 200 tokens。請求次數一樣，token 消耗差了 10 倍。

**雙重配額**：同時限制請求次數和 token 數，才能真正控制成本。

## 配額結構

```typescript
interface UserQuota {
  daily_ai_used: number;      // 今日已用請求次數
  daily_ai_limit: number;     // 今日請求次數上限
  daily_token_used: number;   // 今日已用 token 數
  daily_token_limit: number;  // 今日 token 數上限
  quota_reset_at: number;     // 下次重置時間（UTC 午夜）
}
```

兩個維度同時限制：

- 請求次數：防止高頻濫用（每分鐘無限發問）
- Token 數：防止低頻但高消耗的使用（每次都問超長問題）

只要任一個額度用完，新請求就被拒絕。

## 原子扣除

配額扣除必須是原子操作，防止並發請求同時通過檢查：

```sql
UPDATE user_quotas
SET
  daily_ai_used = daily_ai_used + 1,
  daily_token_used = daily_token_used + :estimated_tokens
WHERE
  user_id = :user_id
  AND daily_ai_used < daily_ai_limit           -- 請求次數未超限
  AND daily_token_used + :estimated_tokens <= daily_token_limit  -- token 未超限
RETURNING *;
```

這個 UPDATE 只在兩個條件都滿足時才執行，並且因為是單條 SQL，是資料庫層面的原子操作。

**為什麼不用兩步（先 SELECT 再 UPDATE）？**

如果使用者同時發兩個請求，兩個請求的 SELECT 可能都看到配額充足，然後都執行 UPDATE，導致超限。單條 UPDATE + WHERE 條件的做法讓資料庫保證只有一個請求能通過。

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

`returning()` 回傳更新後的行；如果沒有行被更新（條件不滿足），`result` 是空陣列，直接拋出例外。

## Token 的估算與校正

**事前估算**：請求前不知道 LLM 會生成多少 tokens，用估算值預扣：

```typescript
function estimateTokens(query: string, contextDocs: number): number {
  const queryTokens = Math.ceil(query.length / 4);      // 粗估
  const contextTokens = contextDocs * 150;               // 每份文件約 150 tokens
  const generationEstimate = 400;                        // 生成估算
  return queryTokens + contextTokens + generationEstimate;
}
```

**事後校正**：生成完成後，用實際 token 數更新：

```typescript
const actualTokens = response.usage.total_tokens;
const diff = actualTokens - estimatedTokens;

if (diff !== 0) {
  await db.update(userQuotas).set({
    dailyTokenUsed: sql`daily_token_used + ${diff}`,
  }).where(eq(userQuotas.userId, userId));
}
```

差額（正負）都校正回去，確保 token 記帳準確。

## 斷線退還

SSE 串流中客戶端斷線，退還整次請求的配額：

```typescript
if (isClientDisconnected(error) && quotaDeducted) {
  await db.update(userQuotas).set({
    dailyAiUsed: sql`daily_ai_used - 1`,
    dailyTokenUsed: sql`daily_token_used - ${estimatedTokens}`,
  }).where(eq(userQuotas.userId, userId));
}
```

使用者沒收到回答，不扣配額。這是對使用者友善的設計，也避免因為網路問題消耗使用者的配額。

## 配額重置

每日 UTC 午夜重置：

```typescript
function getResetTime(): number {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return Math.floor(tomorrow.getTime() / 1000);
}
```

重置是 lazy 的：不跑定時任務，而是在每次配額檢查時判斷是否需要重置：

```sql
-- 如果 quota_reset_at 已過，先重置再扣除
UPDATE user_quotas
SET
  daily_ai_used = 1,
  daily_token_used = :estimated_tokens,
  quota_reset_at = :next_reset
WHERE
  user_id = :user_id
  AND quota_reset_at <= unixepoch()   -- 已過重置時間
  AND 1 <= daily_ai_limit             -- 重置後仍有配額
  AND :estimated_tokens <= daily_token_limit;
```

這樣不需要定時任務，每次請求時自動處理重置，也避免了定時任務和請求競爭的問題。

## 分層配額（Climber Rank）

配額和使用者等級掛鉤，等級越高配額越多：

| 等級 | 積分門檻 | 每日請求 | 每日 Token |
|------|---------|---------|-----------|
| 麓（foothill） | 0 | 2 | 5,000 |
| 壁（wall） | 20 | 6 | 15,000 |
| 稜（ridge） | 70 | 12 | 30,000 |
| 巔（summit） | 100 | 24 | 60,000 |

積分來源：完善個人資料、分享攀登故事、記錄完攀。越活躍的使用者等級越高，配額越多。這個設計讓配額系統同時作為社群互動的激勵機制。

管理員可以設定 `rank_override_id`，直接指定某個使用者的等級（不走自動計算），適合給測試帳號或特殊合作者更高配額。

## 整體來說

配額系統的難點不在限制本身，在邊緣情況的處理：並發請求的競爭條件（原子 UPDATE）、串流斷線的退還（避免虧待使用者）、估算與實際的差額校正（避免記帳偏差）、重置的時機（lazy reset vs 定時任務）。

這些細節都做對，配額系統才能既控制成本，又不讓使用者有被剋扣的感覺。
