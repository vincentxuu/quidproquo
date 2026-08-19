---
title: "RAG 配額系統：用雙重限制控制 LLM 成本"
date: 2026-03-12
updated: 2026-08-19
type: guide
category: ai
tags: [rag, quota, rate-limiting, token-budget, cost-control, cloudflare-workers]
lang: zh-TW
tldr: "只限制請求次數不夠，一個超長的查詢可能消耗掉十個普通查詢的 token。雙重配額（請求數 + token 數）才能真正控制成本。"
description: "RAG 系統的配額設計：雙重限制（request + token）、原子 SQL UPDATE、斷線退還、配額重置策略，以及與等級系統結合的分層配額。"
draft: false
series:
  name: "RAG 技法大全"
  order: 43
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

注意這條 SQL 少了一個條件：`quota_reset_at`。實際部署時它必須和下面「配額重置」那段的 lazy reset 合起來看——先跑重置、再跑扣除，否則一個「額度已用完但重置時間已過」的使用者會被這條 UPDATE 直接擋掉。

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
  const queryTokens = countTokens(query);   // 用真正的 tokenizer，別用字元數除以常數
  const contextTokens = contextDocs * AVG_TOKENS_PER_DOC;  // 從自己的 log 統計出來的平均值
  const generationEstimate = MAX_OUTPUT_TOKENS_CAP;        // 用你設的 max output 當上限
  return queryTokens + contextTokens + generationEstimate;
}
```

這裡有個很容易踩的坑：常見的「字元數 ÷ 4」估法是針對**英文**的經驗值。中文、日文這類 CJK 內容每個 token 對應的字元數少得多，同一條公式會系統性低估，配額看起來扣得很少、帳單卻對不上。中文站台請直接跑真正的 tokenizer（[tiktoken](https://github.com/openai/tiktoken) 對應 OpenAI 系模型，其他模型用它自己的 [tokenizers](https://github.com/huggingface/tokenizers) 設定檔），或者至少拿自己的查詢語料回歸出一個屬於中文的係數，而不是抄英文的 4。

生成量的估算則建議直接用 `max_tokens` 的上限值預扣，寧可預扣多、事後退，也不要預扣少、事後發現超額卻已經生成完了。

**事後校正**：生成完成後，用實際 token 數更新：

```typescript
const actualTokens = usage.total_tokens;      // 見下方：串流時要特別拿
const diff = actualTokens - estimatedTokens;

if (diff !== 0) {
  await db.update(userQuotas).set({
    dailyTokenUsed: sql`daily_token_used + ${diff}`,
  }).where(eq(userQuotas.userId, userId));
}
```

差額（正負）都校正回去，確保 token 記帳準確。

**串流時 `usage` 拿不到是常態**。走 OpenAI 相容的 Chat Completions 串流介面時，預設每個 chunk 的 `usage` 都是 `null`；要拿到用量必須在請求裡加上 `stream_options: { include_usage: true }`，供應商才會在 `[DONE]` 之前多送一個 `choices: []`、只帶 `usage` 的 chunk（[OpenAI cookbook](https://developers.openai.com/cookbook/examples/how_to_stream_completions)）。而且 [Chat Completions API reference](https://developers.openai.com/api/docs/api-reference/chat/create) 也講明：**串流被中斷或取消時，你可能收不到那個最後的 usage chunk**（原文 *If the stream is interrupted or cancelled, you may not receive the final usage chunk*）。所以事後校正必須寫成「有拿到才校正」，收不到就退回估算值記帳，不能假設它一定會來。

## 斷線退還

SSE 串流中客戶端斷線，退還整次請求的配額：

```typescript
if (isClientDisconnected(error) && quotaDeducted) {
  await db.update(userQuotas).set({
    dailyAiUsed: sql`daily_ai_used - 1`,
    // 退還「實際扣掉的量」，不是估算值
    dailyTokenUsed: sql`daily_token_used - ${deductedTokens}`,
  }).where(eq(userQuotas.userId, userId));
}
```

這裡要退的是「這次請求實際扣掉的總量」（`deductedTokens`），不是 `estimatedTokens`。兩者在多數情況相同，但只要事後校正已經跑過一次（例如串流跑完、usage 也回來了，客戶端才斷線），扣掉的就是估算值加上校正差額；這時候還照 `estimatedTokens` 退，帳就會歪掉。最穩的做法是把「本次請求扣了多少」記在請求 context 裡，退還時以它為準，並且讓扣除／退還在同一個 request 生命週期內只發生一次（用一個 flag 擋住重入）。

使用者沒收到回答，不扣配額。這是對使用者友善的設計，也避免因為網路問題消耗使用者的配額。不過注意這條規則本身可以被濫用：刻意在生成完成前斷線，就能白嫖生成成本。流量不大時可以接受，量大之後應該改成「已經產出的部分照扣、只退未產出的估算差額」。

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

順序很重要：**先試這條重置 UPDATE，沒有更新到任何行（表示還沒到重置時間）才跑前面那條扣除 UPDATE**。反過來寫的話，重置時間已過但額度用完的使用者會先被扣除那條擋下來。兩條都要在同一次請求裡跑完，且都是單條 SQL，各自原子。

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

---

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [OpenAI Tokenizer (tiktoken) GitHub Repository](https://github.com/openai/tiktoken)——RAG 請求的 token 估算
- [Hugging Face tokenizers](https://github.com/huggingface/tokenizers)——非 OpenAI 系模型的 tokenizer
- [OpenAI Cookbook：How to stream completions](https://developers.openai.com/cookbook/examples/how_to_stream_completions)——`stream_options.include_usage` 的行為與限制
- [OpenAI Rate Limits Documentation](https://platform.openai.com/docs/guides/rate-limits)
- [Anthropic API Rate Limits](https://docs.anthropic.com/en/api/rate-limits)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [SQLite Atomic Commit (SQLite Documentation)](https://www.sqlite.org/atomiccommit.html)
