---
title: "RAG 評估框架：RAGAS、DeepEval、TruLens 怎麼用"
date: 2026-03-12
type: guide
category: ai
tags: [rag, evaluation, ragas, deepeval, trulens, metrics, quality]
lang: zh-TW
tldr: "RAG 系統的品質很難用直覺評估。RAGAS、DeepEval、TruLens 提供了系統化的指標框架，讓你知道是哪個環節出問題。"
description: "RAG 評估框架的比較：RAGAS 的核心指標、DeepEval 的測試框架、TruLens 的 triad 評估，以及如何設計 RAG 的評估管線。"
draft: false
series:
  name: "RAG 技法大全"
  order: 37
---

RAG 系統的品質評估是個難題：你能感覺到回答不好，但說不清楚是哪個環節的問題——是搜尋找錯了文件，還是 LLM 從正確的文件中提取出了錯誤的資訊？

系統化的評估框架把「感覺不好」量化成具體的指標，讓優化有方向。

## RAGAS（RAG Assessment）

**定位**：最被廣泛引用的 RAG 評估框架，定義了 RAG 的核心指標體系。

> **API 已經改過名**：本文原稿寫於 RAGAS 早期版本，那時指標是小寫的模組層級實例（`faithfulness`、`answer_relevancy`、`context_precision`），資料欄位叫 `question` / `answer` / `contexts` / `ground_truth`。現在的 RAGAS 用的是**類別式指標**，而且欄位名全部換過。以下程式碼已依現行 API 更新，但版本仍在動，實作前請對照[官方指標清單](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/)。另外 repo 已從 `explodinggradients/ragas` 搬到 [`vibrantlabsai/ragas`](https://github.com/vibrantlabsai/ragas)（舊網址會轉址）。

### 四個核心指標

以下先講概念，名稱對照放在後面。

**Faithfulness（忠實度）**：
回答裡的每個陳述，有多少比例可以從 context 中推導出來？

```
回答：「龍洞 5.11a 的關鍵動作是側拉，需要良好的腳法。」
Context 裡有：「此路線關鍵在側拉動作。」

Faithfulness = 「側拉」可從 context 推導 + 「腳法」無法從 context 推導
             = 1/2 = 0.5
```

低 Faithfulness = LLM 在幻覺，添加了 context 沒有的資訊。

**Answer Relevance（答案相關性，現名 Response Relevancy）**：
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

### 名稱對照與現行寫法

| 本文講的概念 | 現行 RAGAS 類別 |
|---|---|
| Faithfulness | `Faithfulness` |
| Answer Relevance | `ResponseRelevancy` |
| Context Precision | `LLMContextPrecisionWithReference`（有 reference 時）/ `LLMContextPrecisionWithoutReference` |
| Context Recall | `LLMContextRecall`（另有不用 LLM 的 `NonLLMContextRecall`） |

樣本欄位也換了名：`question` → `user_input`、`answer` → `response`、`contexts` → `retrieved_contexts`、`ground_truth` → `reference`。

```python
from ragas import EvaluationDataset, SingleTurnSample, evaluate
from ragas.llms import LangchainLLMWrapper
from ragas.metrics import Faithfulness, LLMContextRecall, ResponseRelevancy

evaluator_llm = LangchainLLMWrapper(your_langchain_chat_model)

dataset = EvaluationDataset(samples=[
    SingleTurnSample(
        user_input="龍洞適合初學者的路線有哪些",
        retrieved_contexts=["龍洞南壁有多條入門路線，難度範圍 5.7-5.9…"],
        response="龍洞有多條適合初學者的路線…",
        reference="龍洞南壁的入門路線難度約 5.7-5.9。",
    ),
    # …
])

result = evaluate(
    dataset=dataset,
    metrics=[Faithfulness(), ResponseRelevancy(), LLMContextRecall()],
    llm=evaluator_llm,
)
print(result)
```

注意 `evaluate()` 現在要明確給一個 evaluator LLM——不再有「預設就用某個雲端模型」這種隱含行為。

### RAGAS 的限制

- 指標本身是 LLM-as-Judge，分數品質綁在你選的 judge 模型上；換 judge 分數就會漂移，所以 judge 必須跟其他變因一起被固定住
- 內建 prompt 是英文寫的，非英語（含繁中）語料要先跑一次 prompt 的語言適配，官方有[語言適配的做法](https://docs.ragas.io/en/stable/howtos/customizations/testgenerator/_language_adaptation/)
- 需要 reference（ground truth）才能算 Context Recall
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
    ContextualPrecisionMetric,
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
        expected_output="龍洞南壁的入門路線難度約 5.7-5.9。",  # ContextualPrecision 需要
    )

    assert_test(test_case=test_case, metrics=[
        FaithfulnessMetric(threshold=0.7),
        AnswerRelevancyMetric(threshold=0.8),
        ContextualPrecisionMetric(threshold=0.7),
    ])
```

用 `deepeval test run <檔案>` 跑，不是直接 `pytest`。

> **不要在 RAG 上用 `HallucinationMetric`**：本文原稿把 `HallucinationMetric` 跟 `retrieval_context` 湊在一起，那樣會直接報缺參數——`HallucinationMetric` 讀的是 `context`（你認定為事實的參考資料），不是 `retrieval_context`（搜尋實際撈回來的東西）。[官方文件](https://deepeval.com/docs/metrics-hallucination)明說 RAG 情境要改用 `FaithfulnessMetric`。這兩個欄位長得像但語意完全不同，是 DeepEval 最常見的踩雷點。

**特點**：
- pytest 整合，可以跑進 CI/CD
- 指標數量多且還在長，涵蓋 RAG、多輪對話、agent 軌跡、安全性，用之前直接查[指標清單](https://deepeval.com/docs/metrics-introduction)比較準
- 本地模型支援（不強制用某家雲端 API）
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

> **`Feedback` 已經換成 `Metric`**：TruLens 把回饋函數的介面統一了——舊的 `Feedback(...)` 加上鏈式的 `.on_input().on_output()` 改成 `Metric(implementation=..., selectors={...})`，`Feedback` 還在但只是會噴 deprecation warning 的別名，官方說下一個大版本會拿掉。細節看[官方的遷移指南](https://www.trulens.org/component_guides/evaluation/metric_migration/)。另外**不能**像本文原稿那樣把 `provider.xxx_with_cot_reasons` 這種 bound method 直接丟進 `feedbacks=`，一定要包成 `Metric` 並指定 selector，否則 TruLens 不知道要把哪個欄位餵給評分函數。

```python
import numpy as np
from trulens.apps.langchain import TruChain
from trulens.core import Metric, Selector, TruSession
from trulens.providers.openai import OpenAI

session = TruSession()
provider = OpenAI()

f_context_relevance = Metric(
    implementation=provider.context_relevance_with_cot_reasons,
    name="Context Relevance",
    selectors={
        "question": Selector.select_record_input(),
        "context": Selector.select_context(collect_list=False),
    },
    agg=np.mean,
)

f_groundedness = Metric(
    implementation=provider.groundedness_measure_with_cot_reasons,
    name="Groundedness",
    selectors={
        "source": Selector.select_context(collect_list=True),
        "statement": Selector.select_record_output(),
    },
)

f_answer_relevance = Metric(
    implementation=provider.relevance_with_cot_reasons,
    name="Answer Relevance",
    selectors={
        "prompt": Selector.select_record_input(),
        "response": Selector.select_record_output(),
    },
)

# 包裝你的 RAG chain
tru_recorder = TruChain(
    rag_chain,
    app_name="climbing-rag",
    feedbacks=[f_context_relevance, f_groundedness, f_answer_relevance],
)

# 每次 RAG 呼叫都自動記錄評估
with tru_recorder as recording:
    response = rag_chain.invoke({"query": "龍洞適合初學者的路線"})
```

selector 的 key 名（`question` / `context` / `source` / `statement` / `prompt` / `response`）就是各評分函數的參數名，換一個 provider method 就要跟著換，這部分請直接查該方法的 API 文件。

**Dashboard**：
```python
from trulens.dashboard import run_dashboard

session.get_leaderboard()   # 顯示不同配置的 RAG 的各指標對比
run_dashboard(session)      # 開起本機 UI
```

如果只是要對一份已經跑完的資料集（DataFrame）算分、不想掛在活的 app 上，現在有 `BatchEvaluator` 可以用，比手工造 virtual record 乾淨。

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

# 舊的 TestsetGenerator.with_openai() 已經沒有了，
# 現在要自己給 generator LLM 和 embedding model
generator = TestsetGenerator(
    llm=generator_llm,
    embedding_model=generator_embeddings,
)
testset = generator.generate_with_langchain_docs(
    climbing_documents,
    testset_size=100,
)
```

生成流程本身還在改（transforms、query distribution、knowledge graph 都可調），詳細參數請看[官方的 testset generation 文件](https://docs.ragas.io/en/stable/getstarted/rag_testset_generation/)。

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
| 回答跑題 | Answer Relevance / Response Relevancy |
| 整體品質 | 沒有官方的單一綜合分數，要自己定加權 |

最後一列值得展開：不要指望框架給你一個「總分」。各指標的量綱和敏感度不同，把它們平均起來只會讓退化互相抵消。實務上比較有用的是「每個指標各自的閾值 + 各自的趨勢線」，而不是一個會上下抖動但說不出所以然的綜合分數。

## 整體來說

RAG 評估框架幫你把「感覺不好」轉化為「是哪個指標在哪個查詢類型上低於閾值」。這個量化才能讓優化工作有針對性，而不是盲目試各種技術。

先選一個框架（RAGAS 入門最快），建立一個 50-100 個測試案例的小資料集，建立基準分數，然後每次優化後對比分數變化。這個習慣建立起來，RAG 系統的迭代會有效率很多。

---

## 參考資料

- [Ragas: Automated Evaluation of Retrieval Augmented Generation (2023)](https://arxiv.org/abs/2309.15217)
- [RAGAS 現行指標清單（官方文件）](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/)
- [RAGAS RAG 評估上手範例](https://docs.ragas.io/en/stable/getstarted/rag_eval/)
- [DeepEval 指標總覽](https://deepeval.com/docs/metrics-introduction)
- [DeepEval：在 CI/CD 裡跑單元測試](https://deepeval.com/docs/evaluation-unit-testing-in-ci-cd)
- [ARES: An Automated Evaluation Framework for Retrieval-Augmented Generation Systems (2023)](https://arxiv.org/abs/2311.09476)
- [TruLens RAG Triad — Context Relevance, Groundedness, Answer Relevance](https://www.trulens.org/getting_started/core_concepts/rag_triad/)
- [TruLens：從 Feedback 遷移到 Metric](https://www.trulens.org/component_guides/evaluation/metric_migration/)
- [Retrieval-Augmented Generation for Large Language Models: A Survey (2023)](https://arxiv.org/abs/2312.10997)
- [NobodyClimb 系統架構：Cloudflare 全端攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI 架構：20 節點 RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
