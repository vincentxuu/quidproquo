---
title: "RAG 個性化：從對話中學習用戶偏好"
date: 2026-03-12
category: ai
tags: [rag, personalization, memory, user-profile, async]
lang: zh-TW
tldr: "每次對話後，異步提取用戶可能的偏好和程度，下次查詢時自動個性化搜尋條件，不需要使用者手動設定。"
description: "RAG 記憶與個性化的設計：從查詢推斷用戶資訊、異步寫入用戶記憶、下次查詢時注入個人化 context，以及 privacy 的考量。"
draft: false
---

大多數 RAG 系統對每個使用者都一視同仁：同樣的問題，不管是初學者還是高手，得到同樣的回答。但攀岩這個場景，使用者的程度和偏好差異很大——5.10 對新手是挑戰，對高手是暖身。

個性化 RAG 的目標：**讓系統記住使用者的程度和偏好，自動調整搜尋條件和回答風格**，不需要使用者每次都說「我是初學者」。

## 記憶提取：從查詢推斷

個性化不需要使用者主動填寫問卷，可以從他的查詢中推斷：

- 問「5.11 的路線推薦」→ 程度大約中高級
- 問「怎麼學抱石」→ 攀岩類型偏好，且可能是初學者
- 問「龍洞的路線」→ 對龍洞有興趣或在附近
- 問「傳攀裝備怎麼選」→ 對傳攀有興趣

每次查詢完成後，系統異步提取這些可推斷的資訊：

```typescript
// 在 ctx.waitUntil() 中執行，不阻塞回應
async function extractMemory(query: string, userId: string): Promise<void> {
  const extracted = await lightLlm.extract({
    prompt: MEMORY_EXTRACTION_PROMPT,
    query,
    // 從查詢推斷，不從回答推斷（回答可能有幻覺）
  });

  if (extracted.inferred_grade) {
    await upsertUserMemory(userId, {
      key: 'inferred_grade',
      value: extracted.inferred_grade,
      confidence: extracted.confidence,
    });
  }

  if (extracted.location_preference) {
    await upsertUserMemory(userId, {
      key: 'location_interest',
      value: extracted.location_preference,
      confidence: 0.7,
    });
  }
}
```

**關鍵設計**：從查詢本身推斷，不從系統回答推斷。回答可能有幻覺，但使用者的查詢是真實意圖的直接表達。

## Memory Extraction Prompt

```
分析以下攀岩查詢，推斷使用者可能的資訊。
只推斷有足夠信號支撐的資訊，不確定的不要猜。

查詢：{query}

請輸出 JSON：
{
  "inferred_grade": "5.11a" | null,    // 推斷的程度
  "climbing_type": "sport" | null,     // 偏好的攀岩類型
  "location_interest": "longtung" | null,  // 感興趣的岩場
  "experience_level": "beginner" | null,   // 經驗程度
  "confidence": 0.0-1.0               // 整體信心水準
}
```

使用輕量模型（Llama-8b），提取不需要複雜推理，速度快、成本低。

## 記憶存儲

```sql
CREATE TABLE user_ai_memory (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  key         TEXT NOT NULL,   -- 記憶類型 (inferred_grade, location_interest...)
  value       TEXT NOT NULL,   -- 記憶內容
  confidence  REAL NOT NULL,   -- 信心水準 (0.0-1.0)
  source      TEXT,            -- 來源查詢
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL,
  UNIQUE(user_id, key)         -- 同一類型的記憶只存最新的
);
```

`confidence` 欄位很重要：信心低的推斷不應該強烈影響搜尋條件，只作為弱信號。

## 個性化注入

下次查詢時，把記憶注入到兩個地方：

**1. 搜尋過濾條件**

```typescript
const memory = await getUserMemory(userId);

if (memory.inferred_grade && context.queryType === 'complex') {
  // 軟性過濾：擴大難度範圍，中心在推斷程度
  ctx.vectorFilter.grade_numeric = {
    gte: parseGrade(memory.inferred_grade) - 10,
    lte: parseGrade(memory.inferred_grade) + 15,
  };
}
```

**2. System Prompt 注入**

```
你是一個攀岩知識助理。

[用戶個人資訊]
推斷程度：5.11a（信心 0.8）
偏好攀岩類型：運動攀登
常去岩場：龍洞

回答時請根據用戶程度調整說明的深度，不需要解釋基礎概念，
但在涉及安全的部分仍要詳細說明。
```

LLM 收到這個 system prompt，會自然調整回答風格和深度，不需要硬編碼任何邏輯。

## 異步執行的重要性

記憶提取完全在 `ctx.waitUntil()` 中執行：

```typescript
// 回應已回傳，背景繼續執行
ctx.waitUntil(
  extractAndSaveMemory(query, userId, env)
);
```

這確保記憶提取不影響主查詢的延遲。使用者收到回答的速度不會因為記憶處理而變慢。

## Privacy 設計

幾個重要的 privacy 考量：

1. **只推斷，不儲存原始查詢**：Memory 儲存的是推斷結果（程度、偏好），不是完整的查詢歷史
2. **信心門檻**：`confidence < 0.5` 的推斷不寫入記憶，避免儲存不可靠的推斷
3. **用戶控制**：使用者可以在設定頁面查看和清除所有記憶
4. **覆蓋規則**：使用者在 biography 明確填寫的資訊優先於推斷的記憶

## 整體來說

個性化 RAG 的設計哲學是**觀察而不打擾**。不需要使用者填問卷，不需要明確設定偏好，系統從自然的使用行為中悄悄學習，逐漸提供更貼近個人需求的結果。

在攀岩這個有明確程度分級的領域，個性化的效益特別顯著——一個讓高手和初學者都滿意的推薦，比一個平均值的回答更有價值。
