---
title: "RAG 常見失敗模式：10 種問題和對應的解法"
date: 2026-03-12
category: ai
tags: [rag, debugging, failure-modes, quality, troubleshooting]
lang: zh-TW
tldr: "RAG 系統出問題，90% 的情況是這 10 種之一。先識別是哪種失敗模式，再找對應的解法，比盲目優化有效很多。"
description: "RAG 系統最常見的 10 種失敗模式：搜尋失敗類、生成失敗類、系統設計類，以及每種失敗模式的診斷方法和解法。"
draft: false
---

RAG 系統的問題通常不是隨機的，而是集中在幾種可識別的失敗模式。診斷清楚是哪種模式，解法也就清楚了。

## 搜尋失敗類

### 1. Recall 不足：找不到相關文件

**症狀**：系統說「沒有相關資料」，但資料庫裡其實有。

**常見原因**：
- 查詢措辭和文件措辭差距太大（問句 vs 陳述）
- 過濾條件太嚴（grade_numeric 太精確）
- 切塊太小，關鍵資訊被分散

**診斷**：看 trace 裡 `retrieval.vectorCandidates` 和 `retrieval.bm25Candidates`，如果都是 0，是搜尋層面的問題。

**解法**：
- 加 HyDE（橋接問句和陳述的語言差距）
- 加 Multi-Query（多角度覆蓋）
- 加 CRAG（觸發 0 結果時放寬 filter）
- 放寬 metadata filter 條件

---

### 2. Precision 差：找到了不相關的文件

**症狀**：搜尋有結果，但 context 裡充斥不相關的文件，LLM 被噪音干擾。

**常見原因**：
- 向量 embedding 品質不足（模型對領域術語理解差）
- Metadata filter 沒有生效
- Chunk 太大，包含多個不同主題

**診斷**：看 `generation.injectedDocuments`，手動檢查這些文件是否都和查詢相關。

**解法**：
- 加 Cross-Encoder Reranking（過濾低相關候選）
- 調高 `reranker_relevance_threshold`
- 改善 Metadata filter 的提取邏輯
- 切塊更細（每個 chunk 主題更集中）

---

### 3. Chunk 孤島：片段文字失去上下文

**症狀**：搜尋命中的 chunk 有關鍵詞，但缺乏上下文，LLM 無法完整回答。

**常見原因**：
- 切塊太小，chunk 無法獨立表達完整意思
- 沒有做 Contextual Retrieval（缺乏文件級別的上下文注入）

**診斷**：看命中的 chunk 內容，判斷是否能獨立理解。

**解法**：
- 導入 Contextual Retrieval（索引時注入文件摘要）
- 用 Parent Document Retriever（搜尋小 chunk，取大 chunk 作為 context）
- 增大 chunk size + overlap

---

### 4. 多義詞混淆

**症狀**：查詢含有在攀岩和一般語境都有意義的詞，搜尋結果混入不相關內容。

**例子**：「如何控制」在攀岩裡是技術動作，但 embedding 可能匹配到「控制情緒」、「控制預算」等文件。

**解法**：
- 強化 Metadata filtering（確保搜尋限制在 type = 'route' 或 type = 'technique'）
- 在 System prompt 強調「只使用攀岩相關的知識回答」
- Fine-tune embedding 模型（讓模型的攀岩術語理解更好）

---

## 生成失敗類

### 5. 幻覺：LLM 添加了 context 沒有的資訊

**症狀**：回答聽起來很完整，但包含了 context 裡沒有提到的數字、名稱、事實。

**常見原因**：
- Context 不足，LLM 用自己的知識「補充」
- 模型傾向生成聽起來完整的回答
- System prompt 沒有明確禁止添加 context 外的資訊

**診斷**：看 `judge.groundedness`，低於 0.6 幾乎肯定有幻覺。

**解法**：
- System prompt 明確：「嚴禁添加知識庫以外的資訊，不確定時說不確定」
- 加 LLM-as-Judge，自動檢測低 groundedness
- Self-Reflection：品質低時重生成
- 改善搜尋讓 context 更完整，LLM 就不需要「猜」

---

### 6. 回答跑題：沒有回答使用者的問題

**症狀**：搜尋和 context 都沒問題，但 LLM 的回答和問題不對口（比如問路線推薦，回答了攀岩歷史）。

**常見原因**：
- Context 裡有很多非必要的相關文件，分散了 LLM 的注意力
- Query type 分類錯誤
- System prompt 的指令不夠清晰

**診斷**：看 `judge.quality`（低）和 `judge.reasoning`（說明了跑題的原因）。

**解法**：
- 精簡 context，只傳入最相關的文件（MMR 後的 Top-5 而不是 Top-20）
- 在 system prompt 用 few-shot 範例說明期望的回答格式
- 調整 Query Classification，確保路由正確

---

### 7. 格式不一致

**症狀**：同樣類型的查詢，有時候用條列式，有時候用段落；難度有時候說「5.11a」，有時候說「中等難度」。

**解法**：
- System prompt 明確指定輸出格式
- 提供 few-shot 範例（最有效）
- 考慮 Fine-tuning 讓模型學習固定格式

---

## 系統設計類

### 8. 配額用盡的體驗問題

**症狀**：使用者超過配額時看到錯誤，不知道原因和何時重置。

**解法**：
```
「你今日的對話次數已用完（3/3）。
你目前是壁級（Wall），次數於明天 00:00 重置。
完善個人資料可以升級到稜級，獲得更多次數。」
```

清楚說明：用了多少、上限多少、何時重置、如何提升配額。

---

### 9. 慢速回應的體驗問題

**症狀**：使用者看到空白等 5-8 秒才看到回答，以為系統掛了。

**解法**：
- 實作 SSE Streaming，讓第一個 token 在 1 秒內出現
- 加「正在思考中...」的狀態指示
- Semantic Cache 讓重複查詢秒回

---

### 10. 靜默失敗

**症狀**：系統回傳了答案，但答案是基於空 context 的通用知識，使用者不知道資料不足。

**常見原因**：
- CRAG 放寬後仍然沒有結果，但 pipeline 繼續執行
- Judge groundedness 很低但沒有加免責聲明

**解法**：
- 確保所有 groundedness < 0.6 的回答都加免責聲明
- Context 為空時，回答「目前沒有相關資料」而不是用通用知識回答
- 在 trace 裡記錄「context 為空」狀態，定期審查這類查詢，找出資料缺口

---

## 失敗模式的診斷流程

```
使用者回報「回答不好」
    ↓
查看 trace 的 judge.groundedness
    ↓
< 0.6 → 幻覺問題（#5）
    ↓
查看 retrieval.vectorCandidates + bm25Candidates
    ↓
= 0 → Recall 問題（#1）
> 0 但 groundedness 仍低 → 查看 generation.injectedDocuments
    ↓
文件不相關 → Precision 問題（#2）
文件相關但片段 → Chunk 孤島問題（#3）
文件正確但 LLM 跑題 → 生成問題（#6）
```

## 整體來說

大多數 RAG 問題不需要換技術架構，只需要識別失敗模式，做針對性的修補。先建立可觀測性（trace + judge 分數），才能快速定位是哪種失敗。

沒有可觀測性就診斷 RAG 問題，等於蒙著眼睛調試——可能碰巧修好，更可能越改越糟。
