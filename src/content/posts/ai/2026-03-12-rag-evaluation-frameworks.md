---
title: "RAG 評估框架與工具選型：Promptfoo、RAGAS、DeepEval、TruLens"
date: 2026-03-12
updated: 2026-08-30
type: guide
category: ai
tags: [rag, evaluation, promptfoo, ragas, deepeval, trulens, metrics, quality]
lang: zh-TW
tldr: "RAG 評估沒有指定工具的業界標準；先把 retrieval、generation、operation 分開量，再依技術棧選 Promptfoo、RAGAS、DeepEval 或 TruLens。"
description: "RAG 評估框架與工具選型：正式標準管什麼、Promptfoo 如何接 TypeScript CI、RAGAS／DeepEval／TruLens 的定位，以及 Ask AI retrieval 事故如何寫成回歸測試。"
draft: false
series:
  name: "RAG 技法大全"
  order: 37
---

> 🌏 [English version](/posts/ai/2026-03-12-rag-evaluation-frameworks-en)

RAG 系統的品質評估是個難題：你能感覺到回答不好，但說不清楚是哪個環節的問題——是搜尋找錯了文件，還是 LLM 從正確的文件中提取出了錯誤的資訊？

系統化的評估框架把「感覺不好」量化成具體的指標，讓優化有方向。

## 先講結論：業界沒有指定工具的標準

NIST AI RMF 把 **Measure** 列為核心職能；ISO/IEC 42001 則要求 performance evaluation、monitoring 與 continual improvement。兩者都要求組織評估系統是否有效、可靠，卻沒有指定要安裝 Promptfoo、RAGAS、DeepEval 或 TruLens。

OpenTelemetry 的 GenAI attributes 已經定義 evaluation name、score、label 與 explanation 等欄位。這些欄位解決「評估結果怎麼記錄與交換」，不替你決定評分方法。

因此，工具選型不能從「誰是業界標準」開始，而要先問這次要擋哪一種退化：

| 評估層 | 要回答的問題 | 適合的檢查 |
|---|---|---|
| Retrieval | 該找的文章有沒有找到？前幾名是不是相關？ | Recall@k、Precision@k、MRR／nDCG、必要來源斷言 |
| Generation | 回答有沒有依據 context？有沒有真的回答問題？ | Faithfulness、Answer Relevance、Correctness |
| Operation | 改完是否更慢、更貴、更不穩？ | latency、token／API 成本、錯誤率、重試率 |

這三層要分開看。把它們平均成一個總分，retrieval 漏資料可能會被流暢的文筆掩蓋，延遲退化也可能完全消失在品質分數裡。

## Promptfoo：TypeScript 專案先從 CI 回歸測試開始

Promptfoo 是 MIT 授權的 TypeScript CLI／函式庫。它可以呼叫一般 HTTP endpoint、載入自訂 provider，並在同一份測試裡混用固定斷言與 model-graded metrics。內建的 RAG 評分包含 context recall、context relevance 與 context faithfulness。

對 Astro＋Cloudflare Workers 專案，這條路比先建立 Python 評估環境短。不過本站的 `/api/chat` 回傳 SSE，不能只把 URL 填進設定檔就算完成。自訂 provider 要負責收完串流，分別交出 final answer、retrieved sources 與 context；評分器才知道 retrieval 和 generation 各自拿到什麼。

這類 CI 先分兩級：

1. PR 必跑 deterministic checks：必要 slug、禁止來源、unique source count、格式與延遲上限。這層不呼叫 judge LLM，結果穩定。
2. 每日或手動跑 model-graded checks：context relevance、faithfulness、answer relevance。先保留報表，等 judge model、prompt 與波動範圍固定後，再考慮阻擋部署。

Promptfoo 是這個專案的工程選擇，不是通用標準。Python 團隊或已經全面使用 LangSmith／Phoenix 的團隊，答案很可能不同。

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

Context Precision（RAGAS 官方公式，排序敏感）= Σ(Precision@k × v_k) / 相關項總數
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

## 開源、stars 與維護狀態怎麼看

下面是 2026-08-30 的 GitHub repository 快照。stars 是社群關注度，不是品質分數；最近 push 也只能證明有人改程式，不能證明 API 穩定。把授權、語言、活動與專案整合成本放在一起看才有意義。

| 專案 | 授權／主要語言 | Stars | 維護快照 |
|---|---|---:|---|
| Promptfoo | MIT／TypeScript | 24,667 | 2026-08-30 有 push |
| DeepEval | Apache-2.0／Python | 17,957 | 2026-08-29 有 push；Python 4.2.0 於 8/24 發布 |
| Ragas | Apache-2.0／Python | 15,544 | 最後 push 為 2026-02-24；最新 release 為 1/13 的 0.4.3 |
| Phoenix | Elastic License 2.0／Python | 11,245 | 2026-08-29 有 push；可讀原始碼，但 ELv2 不應直接寫成 OSI 開源 |
| TruLens | MIT／Python | 3,529 | 2026-08-28 有 push；2.13.1 於 8/20 發布 |

如果條件是「OSI 常見開源授權、Node／TypeScript、CI、社群規模、近期仍活躍」，Promptfoo 是這個專案最合適的第一步。

團隊若本來就維護 Python 評估環境，DeepEval 的測試框架更完整。Ragas 適合研究指標與資料集實驗；TruLens、Phoenix 的價值則更靠近 tracing、實驗管理與 dashboard。

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

### 一次真的 retrieval 事故要怎麼變成測試

本站 Ask AI 收到「有哪些課程文章」時，介面顯示找到 15 個結果。回答卻漏掉大量 Stanford、MIT、CMU、Berkeley 等大學課程導讀，反而混進 Cloudflare Cache Rules、AI Gateway。

查 production D1 後，課程文章與 chunks 都在。問題發生在 retrieval：查詢把「哪些」「文章」等泛詞展開成 OR 條件，近期但無關的內容佔滿 top-k；同一篇文章的不同 chunk 又重複消耗 Writer context。

這個案例不能只寫成「answer relevance 應該高於 0.75」。有效的 regression contract 至少要有：

- 查詢被路由為 article catalog／recommendation intent，retrieval keyword 保留「課程」，移除「哪些」「文章」等 wrapper。
- retrieved sources 至少命中預先標注的大學課程地圖；Cloudflare Cache Rules、AI Gateway 等已知無關來源不得出現。
- 同一 slug 只算一篇，UI 顯示 unique articles，不顯示 raw chunk count。
- model judge 另外評 context relevance 與 faithfulness，避免固定 slug 全中但回答仍跑題。

本站原本已有 `docs/rag-golden-dataset.json` 與 `pnpm eval:rag`，但截至 2026-08-30，GitHub Actions 沒有執行這組 live eval；既有報表來自四題 offline fixture。腳本裡的 faithfulness、answer relevance、context recall 也是字詞、來源 URL 與禁止敘述的 deterministic scoring，不是 RAGAS、DeepEval 或 Promptfoo 的 judge。檔名與指標名稱存在，不等於評估已經接上 production。

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

先建立 20 個能重現真實失敗的案例，把必要來源、禁止來源與 latency 寫成 deterministic checks。接著才加 context relevance、faithfulness 等 model-graded metrics。

對 TypeScript／HTTP／CI 專案，Promptfoo 是合理起點。Python 研究管線可能更適合 Ragas 或 DeepEval；已經需要全套 tracing 與實驗平台時，再評估 TruLens 或 Phoenix。

工具可以換，評估契約不能跟著消失。資料集版本、judge model、judge prompt、threshold 與原始結果都要留下來，否則這次的 0.82 和下次的 0.76 根本不一定是同一把尺。

---

## 更新紀錄

- 2026-08-30：補上正式標準與工具的分界、Promptfoo 選型、開源維護快照，以及 Ask AI 課程文章 retrieval 事故的 regression contract
- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [Ragas: Automated Evaluation of Retrieval Augmented Generation (2023)](https://arxiv.org/abs/2309.15217)
- [RAGAS 現行指標清單（官方文件）](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/)
- [RAGAS RAG 評估上手範例](https://docs.ragas.io/en/stable/getstarted/rag_eval/)
- [DeepEval 指標總覽](https://deepeval.com/docs/metrics-introduction)
- [DeepEval：在 CI/CD 裡跑單元測試](https://deepeval.com/docs/evaluation-unit-testing-in-ci-cd)
- [Promptfoo：Evaluating RAG pipelines](https://www.promptfoo.dev/docs/guides/evaluate-rag/)
- [Promptfoo HTTP／HTTPS provider](https://www.promptfoo.dev/docs/providers/http/)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [ISO/IEC 42001:2023 — AI management systems](https://www.iso.org/standard/42001)
- [OpenTelemetry GenAI semantic convention attributes](https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/)
- [Promptfoo GitHub repository](https://github.com/promptfoo/promptfoo)
- [DeepEval GitHub repository](https://github.com/confident-ai/deepeval)
- [Ragas GitHub repository](https://github.com/vibrantlabsai/ragas)
- [TruLens GitHub repository](https://github.com/truera/trulens)
- [Phoenix GitHub repository與 ELv2 LICENSE](https://github.com/Arize-ai/phoenix/blob/main/LICENSE)
- [ARES: An Automated Evaluation Framework for Retrieval-Augmented Generation Systems (2023)](https://arxiv.org/abs/2311.09476)
- [TruLens RAG Triad — Context Relevance, Groundedness, Answer Relevance](https://www.trulens.org/getting_started/core_concepts/rag_triad/)
- [TruLens：從 Feedback 遷移到 Metric](https://www.trulens.org/component_guides/evaluation/metric_migration/)
- [Retrieval-Augmented Generation for Large Language Models: A Survey (2023)](https://arxiv.org/abs/2312.10997)
- [NobodyClimb 系統架構：Cloudflare 全端攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI 架構：20 節點 RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
