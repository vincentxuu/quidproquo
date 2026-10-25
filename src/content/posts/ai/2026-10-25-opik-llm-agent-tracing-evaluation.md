---
title: "Opik 怎麼追蹤與評估 LLM Agent：Trace、Test Suite、線上評分與自架取捨"
date: 2026-10-25
category: ai
type: deep-dive
tags: [opik, ai-agent, observability, evaluation, open-source, self-hosting]
lang: zh-TW
tldr: "Opik 是 Comet 以 Apache-2.0 釋出的平台，把 agent 追蹤、離線評估、prompt 版本管理與線上評分放在同一處。自架免費，但沒有使用者管理，正式環境要用 Helm 在 Kubernetes 上維運 ClickHouse；雲端付費方案以 span 數計費。"
description: "介紹 Opik 的 trace 資料結構、Test Suite 與 Dataset 兩種評估方式、線上評估規則、Prompt Library，以及 LangGraph 接法、自架與雲端的差異和導入前要知道的限制。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-25-opik-llm-agent-tracing-evaluation-en)

Agent 上線之後，出問題的往往是中間某一步：工具呼叫回了空值、檢索拿到錯的段落、prompt 改一個字就退步。要不要為 agent 加上追蹤與評估，取決於你能不能接受「只看最後的回答」。這篇用 [Opik](https://github.com/comet-ml/opik) 說明一套完整的做法長什麼樣子：它記錄什麼、怎麼評分、怎麼接到 LangGraph，以及選它的理由與代價（授權、自架成本、雲端額度）。

## 是什麼

Opik 是 Comet 開發的開源平台，[README 的定位](https://github.com/comet-ml/opik)是「LLM 可觀測性與評估平台」，涵蓋 agent 追蹤、LLM 評估、prompt 管理與正式環境監控。授權是 [Apache-2.0](https://github.com/comet-ml/opik/blob/main/LICENSE)，README 並說明伺服器、網頁應用、追蹤、資料集、實驗、評估、prompt 管理與線上評估都在同一個程式庫裡。Comet 的[定價頁](https://www.comet.com/site/pricing/)也寫著開源版與雲端版是同一份程式碼。

資料模型是 [trace、span、thread 三層](https://www.comet.com/docs/opik/tracing/concepts)：trace 是一次完整的互動，span 是其中的一個步驟（LLM 呼叫、函式、外部 API），span 之間可以巢狀；thread 把同一場對話的多個 trace 串起來。

## 給誰、先備知識

適合已經有 agent 或 RAG 應用、想知道每一步發生什麼事的團隊。需要會用 Python 或 TypeScript（官方 SDK 只有這兩種），或能設定 [OpenTelemetry](https://www.comet.com/docs/opik/integrations/opentelemetry) 匯出器；要自架的話，還需要會用 Docker Compose，正式環境則要有 Kubernetes 與 Helm 的經驗。

還在做單次 prompt 實驗、沒有多步驟流程的人，用不到太多功能。站內[Agent 可觀測性那一篇](/posts/ai/2026-06-04-agent-observability-failure-detection)講的是該觀察哪些失敗型態，可以先讀。

## 內容地圖

| 能力 | 做什麼 | 重點 |
|---|---|---|
| 追蹤 | 記錄 trace、span、thread | 用 [`@track` 裝飾器或框架整合](https://github.com/comet-ml/opik)；也能走 [OTel 的 HTTP 端點](https://www.comet.com/docs/opik/integrations/opentelemetry) |
| 離線評估 | [Test Suite 與 Dataset + Metrics 兩種](https://www.comet.com/docs/opik/evaluation/concepts) | Test Suite 用自然語言斷言，由 LLM 判定通過與否；Dataset 用數值指標，每次執行成為一個 Experiment |
| 線上評估 | [對新進的 trace、thread 或 span 自動評分](https://www.comet.com/docs/opik/production/online-evaluation/rules) | 可設篩選與取樣率；評分者可以是 LLM judge、決策模型或 Python 程式 |
| Prompt Library | [版本化 prompt，並把版本連到 trace](https://www.comet.com/docs/opik/development/prompt-library/getting-started) | 用 `environment="production"` 取得正式環境指定的版本 |
| 接 coding agent | [`uvx opik mcp configure`](https://www.comet.com/docs/opik/mcp-server) | 偵測 Claude Code、Cursor 等客戶端，安裝 MCP server 與 Opik 的 skill |

幾個細節值得先知道：

- Test Suite 的通過規則是[分層的](https://www.comet.com/docs/opik/evaluation/concepts)：一次 run 的所有斷言都過才算通過，一個 item 要有足夠多次 run 通過（`pass_threshold`）才算通過，pass rate 是通過的 item 占全部的比例。
- 線上評估的 LLM judge 預設[以 agent-as-a-judge 的方式運作](https://www.comet.com/docs/opik/production/online-evaluation/rules)，會拿到整條 trace，在模型支援工具呼叫時可以用 `read`、`jq`、`search` 等工具檢視；因此能檢查工具呼叫的順序與回傳值，不只看最終答案。
- Thread 層級的評分會等[一段冷卻時間](https://www.comet.com/docs/opik/production/online-evaluation/rules)（預設 15 分鐘）才執行，確保看到完整對話。
- 站上的[MCP 介紹](/posts/ai/2026-03-22-mcp-model-context-protocol)講了協定本身；Opik 的 MCP server 則讓 coding agent 能[讀 trace、查失敗案例、跑評估](https://www.comet.com/docs/opik/mcp-server)。

## 一個具體範例：LangGraph 追蹤加離線評估

以下兩段程式改寫自官方文件的 [LangGraph 整合](https://www.comet.com/docs/opik/integrations/langgraph)與 [Evaluate your agent](https://www.comet.com/docs/opik/evaluation/advanced/evaluate_your_llm)，我沒有實際執行，細節以官方文件為準。

第一段是追蹤。圖照平常方式編譯，之後用 `track_langgraph` 包一次，後續每次呼叫都會自動記錄：

```python
from opik.integrations.langchain import OpikTracer, track_langgraph

# app 是已編譯好的 LangGraph 圖（官方範例是 classification workflow）
opik_tracer = OpikTracer(project_name="classification-workflow")
app = track_langgraph(app, opik_tracer)

result = app.invoke({"question": "Hello, how are you?"})
```

官方文件說明，這樣在 UI 裡會看到[整張圖的執行路徑，包含分類決策與選到的分支](https://www.comet.com/docs/opik/integrations/langgraph)。如果節點內另外用 `@track` 包了函式，它會掛在該節點的 span 底下；LangGraph 的 `thread_id` 也會直接[當作 Opik 的 thread_id](https://www.comet.com/docs/opik/integrations/langgraph)。

第二段是離線評估。資料集放測試案例，task 回傳 agent 的輸出，指標打分數，結果成為一個 Experiment 可以和其他版本並排比較：

```python
from opik import Opik
from opik.evaluation import evaluate
from opik.evaluation.metrics import Hallucination

client = Opik()
dataset = client.get_or_create_dataset(name="Example dataset", project_name="my-project")
dataset.insert([
    {"input": "What is the capital of France?"},
    {"input": "What is machine learning?"},
])

def evaluation_task(x):
    # 改寫：把官方範例裡的 LLM 函式換成上面包過的圖
    return {"output": app.invoke({"question": x["input"]})["response"]}

evaluate(
    dataset=dataset,
    task=evaluation_task,
    scoring_metrics=[Hallucination()],
    experiment_config={"model": "your-model-name"},
)
```

`experiment_config` 用來記錄這次實驗用了哪個 prompt 模板、模型與參數，官方建議[存下這些資訊](https://www.comet.com/docs/opik/evaluation/advanced/evaluate_your_llm)，之後比較實驗才知道差在哪。

## 自架與雲端

本機試用用 [Docker Compose](https://www.comet.com/docs/opik/self-host/local_deployment)：clone 專案後執行 `./opik.sh`，在 `localhost:5173` 開啟，SDK 用 `opik configure --use_local` 指向它。資料存在 `~/opik`，停止再啟動不會遺失。這個方式依官方說法不適合正式環境，正式環境請走 [Helm chart 的 Kubernetes 部署](https://www.comet.com/docs/opik/self-host/kubernetes)。

後端依賴包括 [MySQL、Redis、ClickHouse、ZooKeeper 與 MinIO](https://www.comet.com/docs/opik/self-host/local_deployment)；Helm chart 預設會部署 MinIO，要改用 S3 或外部 ClickHouse 都有[對應的設定](https://www.comet.com/docs/opik/self-host/kubernetes)。

雲端版的方案列在[定價頁](https://www.comet.com/site/pricing/)（2026-10-25 讀取）：

| 方案 | 費用 | 含 span 數（每月） | 超出與保留 |
|---|---|---|---|
| 免費 | 0 | 25k | 資料保留 60 天 |
| Pro | 19 美元 / 月 | 100k | 超出每 100k spans 另付 5 美元；保留延長到 400 天，每 100k spans 另付 29 美元 |

Span 的定義是[一個被追蹤的操作](https://www.comet.com/site/pricing/)，例如一次 LLM 呼叫、一次工具呼叫或一個被追蹤的函式。

## 和同類工具的取捨

Opik 的賣點是授權與自架：完整平台是 Apache-2.0，自架不需要商業授權。README 裡有一張[自己和 LangSmith、Phoenix、Langfuse、Braintrust 等的比較表](https://github.com/comet-ml/opik)，把 Phoenix 標為 Elastic License 2.0 的原始碼可取得授權，Langfuse 標為 MIT 核心加商業企業模組。這是 Opik 方自己的整理，選型前請對照各家最新的授權頁。

站內有幾篇同類工具的介紹可以並排看：[Langfuse](/posts/ai/2026-03-26-langfuse-llm-observability-guide)、[Arize Phoenix](/posts/ai/2026-08-22-arize-phoenix-observability-evaluation)、[LangSmith](/posts/ai/2026-08-22-langsmith-observability-evaluation)、[Braintrust](/posts/ai/2026-08-22-braintrust-llm-evaluation)。如果你的重點在把評估寫進本機測試迴圈而不是維運一個平台，[Promptfoo](/posts/ai/2026-08-22-promptfoo-llm-evaluation) 是另一條路。

## 限制

**自架版沒有使用者管理。** [官方自架文件](https://www.comet.com/docs/opik/self-host/overview)寫明，自架能用到所有追蹤與評估功能，但沒有使用者管理功能；[定價頁](https://www.comet.com/site/pricing/)的 Enterprise 方案才列出 SSO、服務帳號與唯讀使用者。多人共用、需要權限分層的團隊，要把這一點算進成本。

**正式環境的維運在你身上。** Kubernetes 文件有幾個要注意的地方：ClickHouse [要先讓 Opik 跑起來再啟用複寫](https://www.comet.com/docs/opik/self-host/kubernetes)，否則可能出錯。[SDK 版本要和伺服器版本一致](https://www.comet.com/docs/opik/self-host/kubernetes)，升級時兩邊要一起動。已刪除的 trace 與 span 先被遮蔽，等 ClickHouse 合併資料片段才會實際移除，chart 預設[不啟用 force-merge](https://www.comet.com/docs/opik/self-host/kubernetes)，大量刪除資料的環境要自己評估。

**部分功能只在雲端。** 定價頁的功能對照表中，Ollie 助理與 Opik Connect 在開源欄是空的，雲端的免費與 Pro 方案是[試用後購買 token](https://www.comet.com/site/pricing/)。想靠它們輔助除錯的團隊，自架版的功能表沒有列入這兩項。

**span 計價會被 agent 迴圈放大。** 雲端額度以 span 計，而 agent 每一次工具呼叫與 LLM 呼叫都是一個 span，一次互動會產生多個 span。上線前先用一週的真實流量算出每月用量，再選方案。

**OTel 只收 HTTP。** [官方文件](https://www.comet.com/docs/opik/integrations/opentelemetry)說明匯出器必須用 HTTP，用 gRPC 會出錯；每條 trace 必須有一個沒有 parent 的 root span，否則 span 會存下來，但 Traces 分頁是空的。如果 agent 跑在會帶入外部 trace context 的執行環境（例如 API 閘道），要自己在每次呼叫開頭建立新的 root span。

**評分者本身要驗證。** 內建的 Hallucination、Answer relevance 這類指標是 LLM 在判斷，線上評估還會產生額外的模型費用，所以有[成本上限與取樣率](https://www.comet.com/docs/opik/production/online-evaluation/rules)可設。判斷標準是否貼近你的需求，要靠[人工標註佇列](https://www.comet.com/docs/opik/evaluation/overview)抽樣對照，不能直接當真值。另外，Code evaluator 只在[部署啟用 Python evaluator 時才出現](https://www.comet.com/docs/opik/production/online-evaluation/rules)，自架時要確認設定。

**文件和 API 變動快。** 評估文件提到 [Opik 2.0 起 Experiments 與 Evaluation Suites 以專案為範圍](https://www.comet.com/docs/opik/evaluation/advanced/evaluate_your_llm)，建立資料集要指定 `project_name`。照舊教學寫的程式，換版本後可能要調整。

## 怎麼用

1. **先在本機跑起來。** 用 `./opik.sh` 啟動，`opik configure --use_local` 連線，不必先決定雲端或自架。
2. **接一個真實的 agent，只看 trace。** 用框架整合或 `@track`，跑幾十次真實任務，先確認 span 的粒度對你有用。
3. **把一個失敗案例變成 Test Suite 項目。** 照[官方的評估迴圈](https://www.comet.com/docs/opik/evaluation/overview)：在 trace 裡找到失敗，加進 Test Suite 並寫一句斷言，修好之後重跑，確認新案例通過、其他沒退步。
4. **再決定要不要線上評分。** 先用低取樣率與成本上限，抽查分數和人工判斷是否一致。
5. **最後才決定自架或雲端。** 預估每月 span 量、是否需要 SSO 與權限分層、有沒有人能維運 ClickHouse。需求簡單可以先用雲端免費方案，等資料量或合規要求出現再評估自架。

## 參考資料

- [comet-ml/opik（README）](https://github.com/comet-ml/opik)
- [Opik LICENSE（Apache-2.0）](https://github.com/comet-ml/opik/blob/main/LICENSE)
- [Comet 定價頁](https://www.comet.com/site/pricing/)
- [Tracing Core Concepts](https://www.comet.com/docs/opik/tracing/concepts)
- [Evaluation Overview](https://www.comet.com/docs/opik/evaluation/overview)
- [Evaluation Concepts](https://www.comet.com/docs/opik/evaluation/concepts)
- [Evaluate your agent](https://www.comet.com/docs/opik/evaluation/advanced/evaluate_your_llm)
- [Online Evaluation rules](https://www.comet.com/docs/opik/production/online-evaluation/rules)
- [Prompt Library：Getting started](https://www.comet.com/docs/opik/development/prompt-library/getting-started)
- [Observability for LangGraph with Opik](https://www.comet.com/docs/opik/integrations/langgraph)
- [OpenTelemetry 整合](https://www.comet.com/docs/opik/integrations/opentelemetry)
- [Opik's MCP server](https://www.comet.com/docs/opik/mcp-server)
- [Self-host：Overview](https://www.comet.com/docs/opik/self-host/overview)
- [Self-host：Local deployment](https://www.comet.com/docs/opik/self-host/local_deployment)
- [Self-host：Kubernetes deployment](https://www.comet.com/docs/opik/self-host/kubernetes)
- [Agent 可觀測性：從 OTel Trace 到抓出幻覺、工具誤用與無限迴圈](/posts/ai/2026-06-04-agent-observability-failure-detection)
- [Langfuse 完整指南](/posts/ai/2026-03-26-langfuse-llm-observability-guide)
- [Arize Phoenix](/posts/ai/2026-08-22-arize-phoenix-observability-evaluation)
- [LangSmith 深入介紹](/posts/ai/2026-08-22-langsmith-observability-evaluation)
- [Braintrust](/posts/ai/2026-08-22-braintrust-llm-evaluation)
- [Promptfoo 深入介紹](/posts/ai/2026-08-22-promptfoo-llm-evaluation)
- [MCP 介紹](/posts/ai/2026-03-22-mcp-model-context-protocol)
