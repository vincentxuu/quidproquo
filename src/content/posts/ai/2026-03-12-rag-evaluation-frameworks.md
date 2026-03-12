---
title: "RAG 評估框架：RAGAS、DeepEval、TruLens 怎麼用"
date: 2026-03-12
category: ai
tags: [rag, evaluation, ragas, deepeval, trulens, metrics, quality]
lang: zh-TW
tldr: "RAG 系統的品質很難用直覺評估。RAGAS、DeepEval、TruLens 提供了系統化的指標框架，讓你知道是哪個環節出問題。"
description: "RAG 評估框架的比較：RAGAS 的核心指標、DeepEval 的測試框架、TruLens 的 triad 評估，以及如何設計 RAG 的評估管線。"
draft: false
---

RAG 系統的品質評估是個難題：你能感覺到回答不好，但說不清楚是哪個環節的問題——是搜尋找錯了文件，還是 LLM 從正確的文件中提取出了錯誤的資訊？

系統化的評估框架把「感覺不好」量化成具體的指標，讓優化有方向。

## RAGAS（RAG Assessment）

**定位**：最被廣泛引用的 RAG 評估框架，定義了 RAG 的核心指標體系。

### 四個核心指標

**Faithfulness（忠實度）**：
回答裡的每個陳述，有多少比例可以從 context 中推導出來？

```
回答：「龍洞 5.11a 的關鍵動作是側拉，需要良好的腳法。」
Context 裡有：「此路線關鍵在側拉動作。」

Faithfulness = 「側拉」可從 context 推導 + 「腳法」無法從 context 推導
             = 1/2 = 0.5
```

低 Faithfulness = LLM 在幻覺，添加了 context 沒有的資訊。

**Answer Relevance（答案相關性）**：
回答對原始問題的相關程度。用 LLM 從回答逆向生成問題，計算這些問題和原始問題的語義相似度。

低 Answer Relevance = 回答跑題，沒有回應原始問題。

**Context Precision（context 精確度）**：
搜尋到的 context 裡，有多少是真正相關的？

```
搜尋結果：[路線A（相關）, 路線B（不相關）, 路線C（相關）, 路線D（不相關）]

Context Precision = 2 相關 / 4 總數 = 0.5
```

低 Context Precision = 搜尋引入了太多噪音。

**Context Recall（context 召回率）**：
Ground truth 需要的資訊，有多少被搜尋到了？（需要 ground truth 標注）

低 Context Recall = 搜尋遺漏了關鍵資訊。

```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision

results = evaluate(
    dataset=test_dataset,  # 包含 question, answer, contexts, ground_truth
    metrics=[faithfulness, answer_relevancy, context_precision],
)

print(results)
# {'faithfulness': 0.82, 'answer_relevancy': 0.79, 'context_precision': 0.71}
```

### RAGAS 的限制

- 主要用 GPT-4 做 judge，中文支援有限（繁中效果更差）
- 需要 ground truth 才能算 Context Recall
- 計算成本高（每個樣本都要多次 LLM 呼叫）

---

## DeepEval

**定位**：面向開發者的 RAG 測試框架，整合進 CI/CD。

**核心設計**：用單元測試的思維寫 RAG 測試。

```python
import pytest
from deepeval import assert_test
from deepeval.metrics import (
    FaithfulnessMetric,
    AnswerRelevancyMetric,
    HallucinationMetric,
)
from deepeval.test_case import LLMTestCase

def test_rag_quality():
    test_case = LLMTestCase(
        input="龍洞適合初學者的路線有哪些",
        actual_output="龍洞有多條適合初學者的路線，難度在 5.8-5.9 之間...",
        retrieval_context=[
            "龍洞南壁有多條入門路線，難度範圍 5.7-5.9...",
            "攀岩新手建議從保護點密集的路線開始...",
        ],
    )

    assert_test(test_case, metrics=[
        FaithfulnessMetric(threshold=0.7),
        AnswerRelevancyMetric(threshold=0.8),
        HallucinationMetric(threshold=0.3),
    ])
```

**特點**：
- pytest 整合，可以跑進 CI/CD
- 40+ 指標，涵蓋 RAG、對話、安全性
- 本地模型支援（不強制用 OpenAI）
- Confident AI 平台整合（可視化測試結果）

**適合場景**：
- 有 CI/CD pipeline，想在每次部署前跑 RAG 評估
- 需要大量不同指標的覆蓋

---

## TruLens

**定位**：強調「RAG Triad」的評估框架，對 RAG 的三個關鍵問題有清晰的定義。

### RAG Triad

TruLens 把 RAG 品質分解成三個問題：

```
               [Query]
                  ↓
            [Context 搜尋]
                  ↓
             [LLM 生成]

問題 1：Context Relevance
  搜尋到的 context 跟查詢有多相關？
  （防止搜尋帶回不相關文件）

問題 2：Groundedness
  回答有多少比例基於 context？
  （防止 LLM 幻覺）

問題 3：Answer Relevance
  回答跟原始問題有多相關？
  （防止 LLM 跑題）
```

三個問題都高分，才算是高品質的 RAG 輸出。

```python
from trulens.apps.langchain import TruChain
from trulens.core import TruSession
from trulens.providers.openai import OpenAI

session = TruSession()
provider = OpenAI()

# 包裝你的 RAG chain
tru_recorder = TruChain(
    rag_chain,
    app_name="climbing-rag",
    feedbacks=[
        provider.context_relevance_with_cot_reasons,
        provider.groundedness_measure_with_cot_reasons,
        provider.relevance_with_cot_reasons,
    ],
)

# 每次 RAG 呼叫都自動記錄評估
with tru_recorder as recording:
    response = rag_chain.invoke({"query": "龍洞適合初學者的路線"})
```

**Dashboard**：
```
tru_session.get_leaderboard()
# 顯示不同配置的 RAG 的各指標對比
```

---

## 設計 RAG 評估管線

### 測試資料集的建立

評估的品質取決於測試資料集。建立方式：

**方式 1：手動標注**
- 收集真實使用者查詢
- 人工標注正確答案和相關 context
- 成本高但品質最好

**方式 2：LLM 生成**
- 從資料庫文件生成問答對
- 快速、可規模化
- 品質不如人工，需要抽樣審查

```python
# 從文件自動生成測試資料
from ragas.testset import TestsetGenerator

generator = TestsetGenerator.with_openai()
testset = generator.generate_with_langchain_docs(
    documents=climbing_documents,
    testset_size=100,
)
```

### 持續評估

不只在發布前評估，而是持續監控：

```
每週從生產環境抽樣 100 個查詢
    ↓
自動跑 RAGAS 評估
    ↓
監控指標變化趨勢（是否在退化？）
    ↓
指標下降超過閾值 → 觸發告警
```

### 指標選擇建議

| 問題 | 優先指標 |
|------|---------|
| 搜尋品質差 | Context Precision, Context Recall |
| 回答幻覺 | Faithfulness, Groundedness |
| 回答跑題 | Answer Relevance |
| 整體品質 | RAGAS Score（加權平均）|

## 整體來說

RAG 評估框架幫你把「感覺不好」轉化為「是哪個指標在哪個查詢類型上低於閾值」。這個量化才能讓優化工作有針對性，而不是盲目試各種技術。

先選一個框架（RAGAS 入門最快），建立一個 50-100 個測試案例的小資料集，建立基準分數，然後每次優化後對比分數變化。這個習慣建立起來，RAG 系統的迭代會有效率很多。
