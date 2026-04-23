---
title: "RAG 多實體查詢：當使用者一次丟五條路線，系統只看到第一條"
date: 2026-03-28
type: guide
category: tech
tags: [rag, ner, query-decomposition, recommendation-system, multi-hop-qa]
lang: zh-TW
tldr: "RAG 系統的 extractRouteReference() 用 for...return 只抓第一個匹配，使用者給了五條完攀紀錄卻只用到一條。解法從 rule-based 多實體擷取、user profile aggregation 到 embedding centroid，分三層遞進實作。"
description: "當 RAG 推薦系統遇到多實體查詢，單一錨點擷取造成難度範圍、風格偏好、排除清單三重資訊損失。本文整理 Multi-Entity NER、Query Decomposition、User Profile Aggregation、Plan-and-Execute RAG 等解法，附 20 篇論文參考。"
draft: false
---

使用者說：「我最近完攀了白虎 5.11d、閃電 5.12a、看起來我可以 5.11c、泡泡龍 5.11b、新竹客家人 5.10d，推薦 3 條我沒爬過的路線。」系統看到白虎，就 return 了。後面四條？不存在。

這是在 NobodyClimb 攀岩推薦系統上遇到的真實 bug。這篇記錄問題的根因、學術界和業界怎麼處理類似問題、以及最終選擇的分層解法。

## 問題：for...return 的代價

`extractRouteReference()` 的邏輯很簡單：遍歷已知路線名稱，比對查詢字串，命中第一條就 return。這在「推薦跟白虎類似的路線」這種單實體查詢完全沒問題。但使用者一次給了五條路線時，三種資訊直接蒸發：

**難度範圍損失** -- 五條路線橫跨 5.10d 到 5.12a，代表使用者能力涵蓋三個大等級。只取白虎 5.11d，推薦範圍被壓在 5.11a-5.12b（正負三步），完全忽略使用者已經能完攀 5.12a。

**風格偏好損失** -- 多條路線可能分佈在不同岩場、不同類型（sport / trad / boulder），這些分佈反映攀登偏好。單一路線代表不了。

**排除清單不完整** -- 使用者說「沒爬過的」，但 `excludeRouteId` 只排除白虎，其餘四條照樣出現在推薦結果裡。

在 IR 領域，這叫 complex information need。Metzler & Croft (2005) 早就指出多數檢索系統假設查詢是 atomic query，但現實中使用者的查詢經常包含多個實體和隱含偏好。在推薦系統的語境裡，這是 cold-start 問題的變體：使用者主動給了豐富的偏好信號，系統卻只消費了一小部分。

## 解法一覽

研究了一輪之後，解法大致分五條路線（雙關）。

### Multi-Entity Extraction

最直覺的修法：把 `extractRouteReference()` 改成 `extractRouteReferences()`，回傳陣列而非單一結果。

**Rule-based 做法**：把 `for...return` 改成 `for...push`，加上 consumed-range 機制避免重疊匹配（「看起來我可以」匹配後，「我可以」不能再匹配）。多條路線的難度取 union range：

```
gradeFilter = {
  $gte: min(allGrades) - margin,
  $lte: max(allGrades) + margin
}
```

**LLM-based 做法**：讓 LLM 用 structured output 一次擷取所有路線：

```json
{
  "routes": [
    {"name": "白虎", "grade": "5.11d"},
    {"name": "閃電", "grade": "5.12a"},
    {"name": "看起來我可以", "grade": "5.11c"},
    {"name": "泡泡龍", "grade": "5.11b"},
    {"name": "新竹客家人", "grade": "5.10d"}
  ],
  "intent": "recommend_next_challenge",
  "exclude_mentioned": true
}
```

學術上，Li et al. (2020) 的 FLAT（Flat-Lattice Transformer）在中文 NER 拿了 SOTA，能處理同一句子中多個重疊實體。Yan et al. (2021) 把 NER 轉成閱讀理解任務，天然支援多實體擷取。業界的話，Amazon Alexa 的 Multi-slot NER、Rasa NLU 的 CRF + Transformer pipeline 都在做一樣的事。

### Query Decomposition

把一個複雜查詢拆成多個子查詢，分別檢索再合併。以這個案例來說：

1. **Profile Sub-query**：擷取五條路線 → 建立使用者能力 profile
2. **Exclusion Sub-query**：排除上述五條 → 建立排除清單
3. **Recommendation Sub-query**：以 profile 為基礎 → 執行推薦檢索

相關框架不少。Self-Ask (Press et al., 2023) 讓 LLM 自問自答，把複雜問題拆成可獨立回答的子問題。IRCoT (Trivedi et al., 2023) 更進一步，交錯執行 Chain-of-Thought 推理和資訊檢索，每步推理產生新的檢索需求。業界常見的 LangChain Multi-Query Retriever 和 LlamaIndex Sub-Question Query Engine 也是同一個思路。

### User Profile Aggregation

不把每條路線當獨立的檢索錨點，而是聚合成使用者偏好 profile：

| 維度 | 聚合方式 | 本案例結果 |
|------|---------|-----------|
| 能力上界 | max grade | 5.12a → 推薦 5.12a-5.12c |
| 舒適區 | median grade | 5.11c |
| 路線類型 | sport/trad/boulder 比例 | 偏好 sport → 加權 |
| 岩場 | crag 分佈 | 多岩場 → 不限定 |
| 排除 | 收集所有 route_id | 5 條全排除 |

Embedding 層面可以算 centroid：

```
query_vector = mean([embed(白虎), embed(閃電), embed(看起來我可以), embed(泡泡龍), embed(新竹客家人)])
```

這就是推薦系統經典的 average pooling of item embeddings。YouTube 推薦系統論文 (Covington et al., 2016) 用 watch history 的 embedding 平均當 user representation，同一個概念。

### Plan-and-Execute RAG

引入 planning 階段，先分析完整意圖再逐步執行：

```
Query → Planner → [Step 1: Extract all routes]
                   [Step 2: Build user profile]
                   [Step 3: Determine search criteria]
                   [Step 4: Vector search with aggregated filter]
                   [Step 5: Re-rank and exclude]
               → Executor → Response
```

跟現有 LangGraph 架構的 `multi_tool` 路徑有關聯，但差異在於 Plan-and-Execute 的 plan 階段更結構化（不只決定用哪些 tool，還決定如何聚合中間結果），execute 階段有 feedback loop。Wang et al. (2023) 的 Plan-and-Solve Prompting、Yao et al. (2023) 的 ReAct 都是這個方向。

### Collaborative Filtering

看「爬過相同路線的其他使用者還爬了什麼」：

```sql
-- 找品味相似的使用者
SELECT user_id, COUNT(*) as overlap
FROM ascents
WHERE route_id IN ('白虎_id', '閃電_id', '看起來我可以_id', '泡泡龍_id', '新竹客家人_id')
  AND user_id != current_user_id
GROUP BY user_id
ORDER BY overlap DESC
LIMIT 10;

-- 從相似使用者找推薦
SELECT route_id, COUNT(*) as popularity
FROM ascents
WHERE user_id IN (top_10_similar_users)
  AND route_id NOT IN (excluded_routes)
GROUP BY route_id
ORDER BY popularity DESC
LIMIT 3;
```

概念漂亮，但限制很實際：需要足夠多的使用者紀錄、計算量在 Cloudflare Workers 的 CPU 時間限制內吃不消、更適合離線預計算而非即時查詢。

## Multi-Hop QA：相關的學術脈絡

多實體查詢其實跟 Multi-Hop QA 是近親。幾篇關鍵論文：

- **HotpotQA** (Yang et al., 2018) -- 多跳問答 benchmark，要求跨多個文件推理
- **MDR** (Xiong et al., 2021) -- 迭代式檢索，每一跳根據前一跳結果調整查詢
- **Baleen** (Khattab et al., 2021) -- condensed retrieval，在多跳檢索中壓縮中間結果提升效率
- **DSP** (Khattab et al., 2023) -- DSPy 前身，demonstrate-search-predict pipeline

Query Decomposition 方面，Ma et al. (2023) 的 Query Rewriting 和 Shao et al. (2023) 的 ITER-RETGEN（迭代式檢索-生成）也值得一看。推薦系統的多信號融合，SASRec (Kang & McAuley, 2018) 用 self-attention 處理互動序列，Li et al. (2023) 的 GPT4Rec 直接把推薦轉成語言任務。

## 選擇的方案：分層遞進

在 Cloudflare Workers runtime、D1 SQLite、現有 LangGraph 架構的限制下，不可能一步到位。分三層：

**P0（立即做）：Multi-Entity Extraction**

改動最小、效益最大。`extractRouteReference()` → `extractRouteReferences()`，回傳陣列。呼叫端聚合多條路線的 filter，`excludeRouteId` 改成 `excludeRouteIds`。不增加 LLM 呼叫次數，延遲不變，預估解決 80% 的多實體查詢問題。

**P1（短期）：User Profile Aggregation**

新增 `buildUserProfile()`，從多條路線計算能力上界、舒適區、偏好類型、岩場分佈。Profile 注入 LLM prompt 的 system context，讓模型在生成回答時有完整的使用者背景。

**P2（中期）：Embedding Centroid**

如果多條路線都有 embedding，計算 centroid vector 作為查詢向量。搜尋結果再經過 re-ranking：排除已提及路線、難度適當性加權、多樣性加權。前提是 Cloudflare Vectorize API 支援自訂查詢向量。

與現有架構的整合點：

```
nlp.ts          → extractRouteReferences() 回傳陣列
tool-selection.ts → routeRefs: RouteReference[]，聚合 filter
GraphState      → excludeRouteIds: string[]
filter-build.ts → 處理多 crag（$in 而非 $eq）
vector search   → post-filter 排除多條路線（$nin 而非 $ne）
```

## 整體來說

核心取捨是「在 edge runtime 的限制下，用最少的額外計算換最大的推薦品質提升」。P0 的 rule-based 多實體擷取幾乎零成本就能解決大部分問題，這是最划算的。P1 加入 profile aggregation 讓 LLM 有更完整的 context，代價是多一些字串處理。P2 的 embedding centroid 才真正碰到計算和 API 限制，需要驗證可行性。

Query Decomposition 和 Collaborative Filtering 先放著。前者在已有 LangGraph multi-tool 路徑的前提下有重疊，後者需要更多使用者資料。等 P0-P2 上線，再看推薦品質的瓶頸在哪裡決定下一步。

---

## 參考資料

- [FLAT: Chinese NER Using Flat-Lattice Transformer (Li et al., 2020)](https://aclanthology.org/2020.acl-main.611/)
- [A Unified Generative Framework for Various NER Subtasks (Yan et al., 2021)](https://aclanthology.org/2021.acl-long.451/)
- [Measuring and Narrowing the Compositionality Gap in Language Models (Press et al., 2023)](https://arxiv.org/abs/2210.03350)
- [Decomposed Prompting: A Modular Approach for Solving Complex Tasks (Khot et al., 2023)](https://arxiv.org/abs/2210.02406)
- [Interleaving Retrieval with Chain-of-Thought Reasoning (Trivedi et al., 2023)](https://aclanthology.org/2023.acl-long.557/)
- [Deep Neural Networks for YouTube Recommendations (Covington et al., 2016)](https://dl.acm.org/doi/10.1145/2959100.2959190)
- [Matrix Factorization Techniques for Recommender Systems (Koren et al., 2009)](https://ieeexplore.ieee.org/document/5197422)
- [Plan-and-Solve Prompting (Wang et al., 2023)](https://aclanthology.org/2023.acl-long.147/)
- [ReAct: Synergizing Reasoning and Acting in Language Models (Yao et al., 2023)](https://arxiv.org/abs/2210.03629)
- [Reflexion: Language Agents with Verbal Reinforcement Learning (Shinn et al., 2023)](https://arxiv.org/abs/2303.11366)
- [BPR: Bayesian Personalized Ranking from Implicit Feedback (Rendle et al., 2009)](https://arxiv.org/abs/1205.2618)
- [Neural Collaborative Filtering (He et al., 2017)](https://arxiv.org/abs/1708.05031)
- [HotpotQA: A Dataset for Diverse, Explainable Multi-hop QA (Yang et al., 2018)](https://arxiv.org/abs/1809.09600)
- [Answering Complex Open-Domain Questions with Multi-Hop Dense Retrieval (Xiong et al., 2021)](https://arxiv.org/abs/2009.12756)
- [Baleen: Robust Multi-Hop Reasoning at Scale via Condensed Retrieval (Khattab et al., 2021)](https://arxiv.org/abs/2101.00436)
- [Demonstrate-Search-Predict: Composing Retrieval and Language Models (Khattab et al., 2023)](https://arxiv.org/abs/2212.14024)
- [Query Rewriting for Retrieval-Augmented Large Language Models (Ma et al., 2023)](https://arxiv.org/abs/2305.14283)
- [ITER-RETGEN: Enhancing Retrieval-Augmented LLMs with Iterative Retrieval-Generation Synergy (Shao et al., 2023)](https://arxiv.org/abs/2305.15294)
- [Self-Attentive Sequential Recommendation (Kang & McAuley, 2018)](https://arxiv.org/abs/1808.09781)
- [GPT4Rec: A Generative Framework for Personalized Recommendation (Li et al., 2023)](https://arxiv.org/abs/2304.03879)
