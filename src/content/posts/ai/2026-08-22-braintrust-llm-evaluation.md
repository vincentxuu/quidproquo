---
title: "Braintrust：把 LLM 評估做成從 Dataset 回到 Production 的迴圈"
date: 2026-08-22
category: ai
type: deep-dive
tags: [braintrust, llm-evaluation, observability, tracing, llm-as-judge, ai-agent]
lang: zh-TW
tldr: "Braintrust 把 versioned datasets、immutable experiments、scorers 與 production traces 接成同一個評估迴圈；它的價值不是多一個分數，而是把線上失敗送回離線測試。公司在 2026-02 宣布 8,000 萬美元 B 輪，客戶名單為公司自報。"
description: "從 datasets、experiments、scorers、traces 與 production feedback loop 拆解 Braintrust，說清楚開源 SDK 和託管平台的界線、LLM-as-a-judge 與資料隱私限制，以及相對 Patronus、Promptfoo、Phoenix、Galileo、Langfuse 的選型位置。"
draft: false
---

🌏 [English version](/posts/ai/2026-08-22-braintrust-llm-evaluation-en)

[Braintrust](https://www.braintrust.dev/docs/evaluate) 是 LLM evaluation 與 observability 平台。它不只回答「這版 prompt 平均幾分」，而是把一個較難維持的流程做成產品。從 production trace 找到失敗案例，放進有版本的 dataset，跑成不可變的 experiment，再用 scorer 比較新舊版本。最後把新版本送回 production 繼續觀察。

截至 2026-08，Braintrust 在[官方 B 輪公告](https://www.braintrust.dev/blog/announcing-series-b)自報 Notion、Replit、Cloudflare、Ramp 與 Dropbox 使用其產品，並宣布由 ICONIQ 領投的 8,000 萬美元 B 輪。客戶名單與融資是公司公告，沒有公開用量可證明每一家的使用深度。選型時更有用的問題是：你的團隊有沒有真的把下面四個環節接成迴圈。

## 一、Datasets：先決定哪些失敗值得永遠重跑

Braintrust 的 dataset 是有版本的 test case 集合。每一列至少有 `input`，可以另帶 `expected` 與 `metadata`；來源可以是人工整理、使用者回饋、檔案匯入，也可以直接從 production trace 建立。[官方 dataset 文件](https://www.braintrust.dev/docs/annotate/datasets)讓每次修改留下版本，experiment 因此能固定在特定資料版本，而不是今天與昨天拿不同題目比較。

真正困難的不是上傳 CSV，而是決定資料分布。只放「黃金答案」會得到很漂亮、卻抓不到真實問題的分數；只把線上客訴全部倒進去，又會讓常見流量淹沒高風險案例。實務上可分三桶：核心正常路徑、已知回歸、低頻高損失案例。每個 production incident 修完，至少新增一列能重現它的案例，並記下來源與加入原因。

Expected output 也不一定是一段標準文字。客服回覆可以是必要事實清單，agent 可以是允許的 tool sequence，RAG 可以把檢索到的證據另放 metadata。資料的形狀應配合判斷標準，而不是為了塞進 exact match 把任務硬縮成單一答案。

## 二、Experiments：一次變更要留下一份不可變的證據

Experiment 是 task 在某版 dataset 上跑過的不可變快照。[官方文件](https://www.braintrust.dev/docs/evaluate/run-evaluations)刻意把它和 playground 分開。Playground 重跑會覆蓋結果，適合快速試；experiment 保留每列輸出、score、trace 與執行參數，才能做基準比較或放進 CI。

最小 Python 範例不需要先建 dashboard：

```bash
pip install braintrust autoevals
```

```python
from autoevals import LevenshteinScorer
from braintrust import Eval

Eval(
    "greeting-bot",
    data=lambda: [
        {"input": "Ada", "expected": "Hello Ada"},
        {"input": "Lin", "expected": "Hello Lin"},
    ],
    task=lambda name: f"Hello {name}",
    scores=[LevenshteinScorer],
)
```

```bash
BRAINTRUST_API_KEY=... braintrust eval greeting_eval.py
```

`data` 決定測什麼，`task` 是待測系統，`scores` 決定怎麼判。CLI 遇到 eval exception 會回傳非零 exit code，但「平均分下降多少就擋 PR」仍要由團隊定義。對非決定性的任務，[Braintrust 支援 `trial_count`](https://www.braintrust.dev/docs/evaluate/run-evaluations)對同一列重跑多次；否則一次抽樣的差異很容易被誤當成版本效果。

## 三、Scorers：先用程式判斷，語意問題才找模型

[Braintrust scorer](https://www.braintrust.dev/docs/evaluate/write-scorers)回傳 0 到 1 的分數，可分成 AutoEvals、LLM-as-a-judge 與 custom code。JSON 能否解析、tool 名稱是否合法、金額是否吻合，都應先用 deterministic code；語氣、完整性與有沒有真正回答問題，才適合交給 judge model。對 multi-step agent，trace scorer 可以看完整路徑，不必只評最後一句。

LLM-as-a-judge 最大的風險不是費用，是把量尺本身當成真理。Judge 會受 rubric、順序、回覆長度、模型版本與提示注入影響；線上流量又通常沒有 ground truth。[Braintrust 的 agent 評估指南](https://www.braintrust.dev/docs/best-practices/agents)建議離線測試先 stub 外部依賴、隔離關鍵 action，線上則結合使用者回饋並調整 sampling。

具體做法是先抽一批人類已標註的案例，量 judge 和人類的一致性；對高風險類別保留人工複核。更換 judge model 或 rubric 時，把 scorer 當作產品版本重新校正。不要因為 dashboard 顯示 0.91，就把小數點後兩位當成客觀品質。

## 四、Traces 與 Production：評估迴圈要從線上回來

離線 experiment 只能測已知案例。Braintrust 的 production observability 把一次 request 記成 trace，再往下拆成 `task`、`llm`、`function`、`tool` 與 `score` spans。[trace 文件](https://www.braintrust.dev/docs/observe/examine-traces)會在 LLM span 顯示 messages、參數、token、成本與 latency。線上 scoring 非同步執行，不擋使用者請求，適合找 drift 與未知 failure cluster，不適合當同步 guardrail。

迴圈的最後一步是把值得追的 production trace 轉回 dataset。不要把所有 logs 全收：先用 user feedback、低分、exception、成本異常或特定 tool path 篩選，再由人確認 input、expected 與必要 metadata。下一次 experiment 才會知道新版本是否修掉真實失敗，而不是只改善一組靜態 benchmark。

```text
production traces ──篩選／人工標註──> versioned dataset
       ▲                                  │
       │                                  ▼
   deploy candidate <──比較／門檻── immutable experiment
                                            │
                                            ▼
                               code / judge / human scorers
```

## 五、開源 Evals 和託管平台的界線

Braintrust 的 [Python SDK](https://github.com/braintrustdata/braintrust-sdk-python) 以 Apache-2.0 開源，AutoEvals 也能獨立呼叫，不要求把結果存進 Braintrust。`Eval(..., no_send_logs=True)` 或 CLI 的 `--no-send-logs` 可以只在本機跑；因此「寫 scorer、跑 test case」不是平台鎖定。

平台價值在另一邊：dataset 版本、不可變 experiment、多人比較 UI、production trace、線上 scoring 與從 log 回填 dataset。若只需要 CI 裡的一張 pass/fail 表，使用 Braintrust 平台可能太重。PM、domain expert 與工程師要一起標註、比較與追查 production failure 時，集中式 lineage 才開始有價值。

Braintrust 也不是一般認知下「整套產品可下載自架」。[自架架構文件](https://www.braintrust.dev/docs/admin/self-hosting/architecture)描述的是 hybrid deployment。敏感的 experiment logs、traces、datasets 與 prompt completions 留在客戶自己的 data plane；UI、認證與平台 metadata 仍在 Braintrust control plane。這比全託管更能控制資料位置，但不是 air-gapped OSS 替代品。

## 六、資料隱私與執行程式碼的安全界線

Trace 很容易收進 prompt、回覆、檢索片段、tool argument 與使用者識別資訊。先列出哪些欄位可以離開服務，再決定 sampling、遮罩與 retention；不要等資料進平台才補政策。[Braintrust 安全文件](https://www.braintrust.dev/docs/security)說自架 data plane 可把敏感資料留在指定 cloud account 與 region，並設定 retention policy。

Scorer 本身也可能是程式碼。Braintrust-hosted 與 AWS self-hosted 的 inline/bundled functions 會在隔離 VPC 的 ephemeral Lambda 執行。它能連外，但不能存取內部基礎設施。同一份文件明列 GCP 與 Azure self-hosted 的 custom code 會和 data plane 跑在同一 process，沒有同等隔離。允許誰上傳 scorer、它能讀哪些 secrets，必須納入 threat model。

## 七、同層工具怎麼選

**Patronus AI** 偏向 evaluator 能力與安全檢查。[官方 evaluator 文件](https://docs.patronus.ai/docs/evaluators/reference_guide)提供 hallucination、GLIDER 等專有 evaluator family；若重點是採購現成 judge model、RAG hallucination 或安全評分，應先試 Patronus。Braintrust 的強項是把 dataset、experiment、trace 與協作工作流連起來。

**Promptfoo** 是 CLI-first 的開源 eval 與 red-team 工具。[官方 quickstart](https://www.promptfoo.dev/docs/red-team/quickstart/)能在本機產生並執行 adversarial tests。要把測試設定留在 Git、在 CI 跑 prompt matrix 或安全掃描，Promptfoo 比導入一個觀測平台直接。它不是以 production trace 回流與跨角色標註為主體。

**Arize Phoenix** 是可在本機、Docker、Kubernetes 或 cloud 部署的開源 observability 與 evaluation 平台，採 OpenTelemetry 與 OpenInference。[官方文件](https://arize.com/docs/phoenix/)同樣已有 datasets、experiments 與 playground。需要完整 OSS、自架與 OTel-first 時，Phoenix 是 Braintrust 最直接的替代方案。

**Galileo** 把 eval 往同步 guardrail 延伸。[官方產品頁](https://galileo.ai/)主張把 offline eval 蒸餾成低延遲 Luna evaluator，控制 production action、tool access 與 escalation。需要在回覆送出前 block/redact，而不是事後非同步打分，應把 Galileo 放進測試；效能與正確率數字屬廠商自報，要用自己的資料驗證。

**Langfuse** 的核心是 MIT 開源，另有 enterprise 目錄；[官方文件](https://langfuse.com/docs/evaluation/experiments/data-model)也涵蓋 datasets、experiments、traces 與 scores。若開源自架、龐大社群與通用 LLM observability 優先，Langfuse 更自然；若要以 immutable experiment comparison 與 production-to-dataset 工作流為中心，再比較 Braintrust 的 UI 與團隊流程是否更順。

站上已有 [Langfuse 專文](/posts/ai/2026-03-26-langfuse-llm-observability-guide)，可以先用那篇建立 observability 基準，再判斷是否真的需要換平台。

## 整體來說

Braintrust 最值得買的不是 AutoEvals，也不是一張分數 dashboard；那些都能自己做。它賣的是一條不容易斷掉的 lineage：哪個 production failure 進了哪版 dataset、哪次 experiment 用什麼 scorer 修掉、哪個 candidate 因此可以部署。

適合它的團隊已經有正式 AI 功能、每週改 prompt、model 或 agent logic，而且需要工程、產品與 domain expert 共用證據。不適合的團隊只有幾十筆固定 test case、沒有 production tracing，或要求整套 UI 與 data plane 完全 air-gapped 開源自架。先用開源 SDK 跑出第一個可重現 experiment；當「誰改了資料、這版和哪版比、線上失敗有沒有回來」開始失控，再為平台付費。

## 參考資料

- [Braintrust：Evaluate systematically](https://www.braintrust.dev/docs/evaluate)（完整 eval loop 與 offline/online 分工）
- [Braintrust：Build datasets](https://www.braintrust.dev/docs/annotate/datasets)（dataset 欄位、版本與 production trace 回填）
- [Braintrust：Create experiments](https://www.braintrust.dev/docs/evaluate/run-evaluations)（immutable experiments、CI、trials 與 no-send-logs）
- [Braintrust：Measure output quality with scorers](https://www.braintrust.dev/docs/evaluate/write-scorers)（scorer 類型與作用範圍）
- [Braintrust：Examine traces](https://www.braintrust.dev/docs/observe/examine-traces)（trace/span 資料模型）
- [Braintrust：Evaluating agents](https://www.braintrust.dev/docs/best-practices/agents)（離線隔離、線上回饋與 sampling）
- [Braintrust Security](https://www.braintrust.dev/docs/security)（資料位置、retention 與 custom code 隔離差異）
- [Braintrust self-hosting architecture](https://www.braintrust.dev/docs/admin/self-hosting/architecture)（control plane / data plane 邊界）
- [braintrustdata/braintrust-sdk-python](https://github.com/braintrustdata/braintrust-sdk-python)（開源 SDK、最小 Eval 範例與授權）
- [Braintrust's Series B](https://www.braintrust.dev/blog/announcing-series-b)（官方融資與客戶公告）
- [Patronus Evaluator Reference Guide](https://docs.patronus.ai/docs/evaluators/reference_guide)（專有 evaluator families）
- [Promptfoo Red Team Quickstart](https://www.promptfoo.dev/docs/red-team/quickstart/)（本機 red-team 流程）
- [Arize Phoenix 文件](https://arize.com/docs/phoenix/)（開源 tracing、evaluation、datasets 與 experiments）
- [Galileo AI 產品頁](https://galileo.ai/)（eval-to-guardrail 定位，數字為廠商自報）
- [Langfuse Experiments Data Model](https://langfuse.com/docs/evaluation/experiments/data-model)（datasets、experiment runs、traces 與 scores）
- 站內相關：[Langfuse：LLM 應用的開源可觀測性平台](/posts/ai/2026-03-26-langfuse-llm-observability-guide)
