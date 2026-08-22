---
title: "Galileo 深入介紹：Experiments、Evaluators 與 Agent Observability 的完整評估迴圈"
date: 2026-08-22
category: ai
type: deep-dive
tags: [galileo-ai, llm-evaluation, ai-observability, llm-as-a-judge, experiments, guardrails]
lang: zh-TW
tldr: "Galileo 把 dataset experiment、LLM/code/Luna evaluator、production traces 與 runtime guardrail 接成一個迴圈；適合需要企業級可觀測性與線上介入的團隊，但舊 Protect 名稱已 deprecated，評分模型也不能取代人工校準與應用安全。"
description: "拆解 Galileo 的 experiments、metrics、observability 與 runtime protection，釐清 Evaluate、Observe、Protect 的現行界線，並和 Patronus、Braintrust、Promptfoo、Phoenix、Langfuse 比較。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-galileo-llm-evaluation-en)

[Galileo](https://docs.galileo.ai/what-is-galileo) 是 Galileo Technologies, Inc. 的 AI evaluation、observability 與 production guardrail 平台。它把一條實用工作流接在一起：用 dataset 做 experiment、用 metrics 評分、從 production traces 找失敗，再把成熟的評分規則變成線上 guardrail。

截至 2026 年 8 月，官網主要稱它為 AI observability and eval engineering platform 或 Agent Reliability platform。2024 年的 Evaluate、Observe、Protect 模組仍常出現在文章與案例，但現行文件已把舊 [Protect 頁標為 deprecated](https://docs.galileo.ai/concepts/protect/overview)，功能則以 runtime protection／guardrails 延續。選型時應看 experiments、metrics、log streams 與 runtime rules，不要把舊產品名稱當成三套獨立新服務。

公司在 2024 年完成 [4,500 萬美元 Series B](https://galileo.ai/blog/announcing-our-series-b)，累計募資 6,800 萬美元。Galileo 同篇自報當年營收成長 834%、企業客戶成長四倍並新增六家 Fortune 50 客戶；這些是 vendor 公布、未經本文獨立稽核的成長指標。

## Experiment：先固定比較的輸入與條件

官方[實驗文件](https://docs.galileo.ai/sdk-api/experiments/experiments)把 experiment 拆成 dataset、執行方式與 metrics。Dataset 可含 input、ground truth 與既有 generated output；執行方式可以是 prompt template、一般 LLM call，或完整 RAG／agent function；每一列會成為一條 trace，結果進 experiment log stream。

最小 Python 用法如下：

```python
from galileo import GalileoMetrics
from galileo.experiments import run_experiment

def answer(row):
    return my_rag_app(row["input"])

results = run_experiment(
    "support-rag-v3",
    dataset=[
        {"input": "退貨期限？", "ground_truth": "到貨後 30 天"},
        {"input": "可以退客製品嗎？", "ground_truth": "不可"},
    ],
    function=answer,
    metrics=[GalileoMetrics.correctness],
    project="support-agent",
)
```

這個 API 的價值不是「跑一批 prompt」，而是留住版本間可比較的 trace、metric 與系統數據。正式 release gate 應固定 dataset version、application commit、model 與 evaluator 設定，逐筆比較 regression，而不是只看平均 correctness。

## Evaluator：內建 metric、LLM judge、Luna 與 code 各有位置

Galileo 在文件裡主要使用 **metric**，概念上就是 evaluator。依[Metrics Overview](https://docs.galileo.ai/concepts/metrics/overview)，來源包含 out-of-the-box metrics、Luna-2、小組自訂 LLM-as-a-judge，以及 custom code metric；可以套在 session、trace 或 span。

Code metric 適合 JSON schema、必要欄位、tool name allowlist 等確定性規則。LLM judge 適合 correctness、tone、context adherence 等語意判斷。Luna-2 是 Galileo 供企業方案使用的小型評估模型，目標是支撐較低延遲的線上評分。不要因為三者最後都變成 score，就把它們當成同一種訊號。

LLM judge 的限制也沒有因平台化而消失：rubric 模糊會產生不穩定判斷；judge 可能偏好特定寫法、語言或長度；retrieved context 錯了，回答仍可能拿到很高的 groundedness。上線前要用 domain expert 標註集量 false positive／false negative，保存 judge model 與 prompt 版本，並把人工 disagreement 當成 metric 改版資料。

## Observability：評分必須能落回 trace

Experiment 的每列本來就是 trace，production 也以 project、log stream、session、trace、span 組織。這讓團隊能從「correctness 下降」下鑽到 retrieval、model call 或 tool action，並依版本、租戶、語言與 agent step 切片。

```text
production traces ──→ metrics / evaluators ──→ failure slices
       ↑                                          │
       │                                          ▼
    deploy ←── experiment comparison ←── reviewed dataset
```

Observe 的核心因此不是儲存 prompt，而是把 evaluation result 對回執行路徑。只收 final answer 會看不到錯誤來自 retrieval、reasoning 還是 tool execution；但把全部敏感 context 原樣送出，又會增加資料風險。導入前要先定義哪些 span 必須記錄、哪些欄位遮罩、保存多久，以及誰能看 production payload。

## Runtime protection：能介入，不等於證明安全

舊 Protect 的現行能力可在 runtime protection 文件看到：metric 檢查 input 或 output，rule 組成 ruleset，ruleset 再組成 stage；觸發後可以 block、替換輸出或轉交真人。官方文件指出，除 custom code metric 外，這條低延遲路徑需要企業方案的 Luna-2。

這比離線 dashboard 多了同步介入能力，也多了 blast radius。Threshold 太鬆會漏掉攻擊，太嚴會擋掉正常請求；評估服務逾時時要 fail-open 還是 fail-closed，也必須依風險分級。Prompt injection metric 不是 authentication，hallucination score 不是資料庫 constraint。權限控管、輸出 schema、最小權限工具、PII redaction 與人工事件處理仍要留在應用架構內。

## 資料安全：先看合約，再決定送哪些 trace

Galileo 的[信任與安全頁](https://galileo.ai/trust-security)列出 SOC 2 Type II，並表示可為醫療客戶提供 HIPAA-compliant infrastructure 與 BAA。這些合規聲明不能自動回答資料落點、subprocessor、retention、模型供應商或訓練使用等問題。

更需要注意的是公開[服務條款](https://galileo.ai/terms-of-service)：它限制上傳 personally identifiable information，並包含以 customer data 改善與訓練內部演算法的授權文字。實際企業 order form、DPA 或自架部署可能另有約定；採購時應由法務與資安確認適用版本，不能只看首頁徽章。最小做法是送出前先 redact，將敏感原文留在自己的 evidence store，以 ID 連回 Galileo trace。

## 跟其他工具怎麼選

| 工具 | 公開重心 | 優先考慮的情境 |
|---|---|---|
| [Galileo](https://docs.galileo.ai/what-is-galileo) | experiment、metrics、trace、runtime guardrail | 想把離線評估推進到 production interception 的企業團隊 |
| [Patronus AI](https://docs.patronus.ai/docs/evaluators/patronus) | 代管幻覺、安全與多模態 evaluator | evaluator 模型本身是主要採購理由 |
| [Braintrust](https://www.braintrust.dev/docs/evaluate) | playground、不可變 experiment、CI、online scoring | prompt／agent release workflow 是核心 |
| [Promptfoo](https://www.promptfoo.dev/docs/red-team/) | 開放原始碼 CLI eval 與 red team | 本機與 CI 優先，想大量產生對抗測試 |
| [Arize Phoenix](https://arize.com/docs/phoenix/) | OpenTelemetry/OpenInference tracing 與開放原始碼 eval | 自架、開放標準與可替換 judge provider 優先 |
| [Langfuse](https://langfuse.com/docs/evaluation/core-concepts) | 開放原始碼 traces、scores、datasets、experiments | 已採 Langfuse，想建立 production-to-dataset 迴圈 |

這些產品的功能正在重疊。Galileo 的選型理由應是「想把同一套 metric 從 experiment 帶到 observability 和 runtime policy」，不是比較表多幾個勾。若團隊只需要自架 tracing、幾條 deterministic test 或 CLI red team，完整企業平台可能太重；若同步 guardrail 與集中治理是必要條件，它的整合才真正有價值。

## 整體來說

Galileo 最完整的使用方式是一個閉環：人工與 production failure 建 dataset，experiment 比較候選版本，metrics 對 trace 定位錯誤，再把經過校準、延遲可接受的規則升成 runtime guardrail。今晚能做的第一步，是挑一小批真實案例與一個可人工判定的 rubric，跑 baseline，逐筆核對 metric，而不是一次開啟所有內建分數。

不適合的團隊也很明確：無法把 traces 送到代管系統、沒有 domain expert 校準 judge，或只想要簡單單元測試。Galileo 可以縮短從觀測到介入的距離，不能替你定義正確答案，也不能替應用承擔安全邊界。

## 參考資料

- [Galileo：What Is Galileo?](https://docs.galileo.ai/what-is-galileo)
- [Galileo：Experiments Basics](https://docs.galileo.ai/sdk-api/experiments/experiments)
- [Galileo：Run Experiments in Code](https://docs.galileo.ai/sdk-api/experiments/running-experiments)
- [Galileo：Metrics Overview](https://docs.galileo.ai/concepts/metrics/overview)
- [Galileo：Protect（deprecated）](https://docs.galileo.ai/concepts/protect/overview)
- [Galileo：Trust and Security](https://galileo.ai/trust-security)
- [Galileo Technologies, Inc.：Terms of Service](https://galileo.ai/terms-of-service)
- [Galileo：Series B announcement](https://galileo.ai/blog/announcing-our-series-b)
- [Patronus AI Evaluators](https://docs.patronus.ai/docs/evaluators/patronus)
- [Braintrust：Evaluate systematically](https://www.braintrust.dev/docs/evaluate)
- [Promptfoo：LLM red teaming](https://www.promptfoo.dev/docs/red-team/)
- [Arize Phoenix documentation](https://arize.com/docs/phoenix/)
- [Langfuse：Evaluation core concepts](https://langfuse.com/docs/evaluation/core-concepts)
