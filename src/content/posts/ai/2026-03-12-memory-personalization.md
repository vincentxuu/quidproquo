---
title: "RAG 個性化：從對話中學習使用者偏好"
date: 2026-03-12
updated: 2026-08-19
type: guide
category: ai
tags: [rag, personalization, memory, user-profile, async]
lang: zh-TW
tldr: "每次對話後，異步提取使用者可能的偏好和程度，下次查詢時自動個性化搜尋條件，不需要使用者手動設定。"
description: "RAG 記憶與個性化的設計：從查詢推斷使用者資訊、異步寫入使用者記憶、下次查詢時注入個人化 context，以及 privacy 的考量。"
draft: false
series:
  name: "RAG 技法大全"
  order: 32
---

> 🌏 [English version](/posts/ai/2026-03-12-memory-personalization-en)

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
只推斷有足夠訊號支撐的資訊，不確定的不要猜。

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

用小型的 instruct 模型跑就好，提取不需要複雜推理，速度快、成本低。具體挑哪一顆會隨供應商的模型列表變動，這裡不寫死型號——挑選原則是「能穩定吐出合法 JSON 的最小模型」，並且務必驗證輸出，因為小模型偶爾會回傳格式不合的 JSON，解析失敗要當成「這次沒抽到記憶」而不是讓整條 pipeline 掛掉。

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

`confidence` 欄位很重要：信心低的推斷不應該強烈影響搜尋條件，只作為弱訊號。

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

[使用者個人資訊]
推斷程度：5.11a（信心 0.8）
偏好攀岩類型：運動攀登
常去岩場：龍洞

回答時請根據使用者程度調整說明的深度，不需要解釋基礎概念，
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

## 自己做，還是接現成的 memory 層

上面這套 `user_ai_memory` 表大概一百行就寫完了，對「一個 key 存一個推斷值」的需求是夠的。但如果需求長大——要記住跨多輪的對話狀態、要處理互相矛盾的事實、要知道某個偏好是什麼時候變的——就值得先看看現成的方案，再決定要不要自己扛。

三種取捨：

- **自己一張表**（本文的做法）：schema 完全可控、沒有額外依賴、查詢就是一次 SQL。代價是所有的衝突解決、過期、稽核都得自己寫。適合記憶種類少而且固定的場景。
- **框架內建的持久化**：如果 pipeline 已經跑在 LangGraph 上，它的持久層把兩件事分開了——checkpointer 存單一對話串（thread）的短期狀態，store 存跨對話的長期記憶。值得注意的是，LangChain 早期那批 `ConversationBufferMemory` 之類的 memory class 已經不是推薦路徑了，新專案應該直接看 LangGraph 的 persistence 文件，網路上大量舊教學仍在教已經被取代的寫法。
- **專門的 memory 服務**：mem0、Zep（以及它底下開源的 Graphiti 時序知識圖）這類產品幫你做掉抽取、去重、衝突消解和時間軸。省下的是最麻煩的那部分邏輯，付出的是一個外部依賴、一份額外的資料處理者，以及使用者資料要不要離開自家系統的決定。

選哪個要看記憶的形狀：如果記憶只是「一個使用者對應幾個標量偏好」，自己做；如果記憶是「一堆會隨時間改變、彼此可能矛盾的事實」，那是知識圖的問題，不要用一張 key-value 表硬撐。

## Privacy 設計

幾個重要的 privacy 考量：

1. **只推斷，不儲存原始查詢**：Memory 儲存的是推斷結果（程度、偏好），不是完整的查詢歷史
2. **信心門檻**：`confidence < 0.5` 的推斷不寫入記憶，避免儲存不可靠的推斷
3. **使用者控制**：使用者可以在設定頁面查看和清除所有記憶
4. **覆蓋規則**：使用者在 biography 明確填寫的資訊優先於推斷的記憶
5. **推斷結果本身就是個資**：只存推斷不存原始查詢降低了風險，但「這個人是 5.11 的運動攀登者、常去龍洞」仍然是一份使用者畫像。刪除、匯出、保留期限這些義務不會因為它是推斷出來的就消失

## 整體來說

個性化 RAG 的設計哲學是**觀察而不打擾**。不需要使用者填問卷，不需要明確設定偏好，系統從自然的使用行為中悄悄學習，逐漸提供更貼近個人需求的結果。

在攀岩這個有明確程度分級的領域，個性化的效益特別顯著——一個讓高手和初學者都滿意的推薦，比一個平均值的回答更有價值。

---

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560)
- [Augmenting Language Models with Long-Term Memory](https://arxiv.org/abs/2306.07174)
- [A-Mem: Agentic Memory for LLM Agents](https://arxiv.org/abs/2502.12110)
- [Zep: A Temporal Knowledge Graph Architecture for Agent Memory](https://arxiv.org/abs/2501.13956)
- [LangGraph Persistence（checkpointer 與 store 的分工）](https://docs.langchain.com/oss/python/langgraph/persistence)
- [mem0 官方文件](https://docs.mem0.ai/introduction)
- [Graphiti（Zep 的開源時序知識圖）](https://github.com/getzep/graphiti)
- [NobodyClimb 系統架構：Cloudflare 全端攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI 架構：20 節點 RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
