---
title: "Google ADK 怎麼建多 agent 系統：圖工作流、內建評估與 Google Cloud 綁定程度"
date: 2026-10-25
category: ai
type: deep-dive
tags: [google-adk, ai-agent, multi-agent, agent-framework, evaluation, open-source]
lang: zh-TW
tldr: "ADK 2.0 把多 agent 編排從固定的 Sequential、Parallel、Loop 改成節點加邊的圖工作流；內建的 adk eval 在評估頁目前只列 Python，模型可以換，但託管的 memory 與部署選項集中在 Google Cloud。Apache-2.0 授權，Python 版約兩週一版，升版要鎖版本。"
description: "介紹 Google ADK 的 agent 類型、工具與 MCP、session 與 memory、callbacks、評估與部署選項，並說明 2.0 的升級成本與對 Google Cloud 的依賴範圍。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-25-google-adk-multi-agent-framework-en)

如果你在評估用 [Google ADK](https://github.com/google/adk-python)（Agent Development Kit）建多 agent 系統，要決定的大概是三件事：多 agent 的流程要交給模型判斷，還是寫成確定的圖；評估能不能直接用內建的；以及整套東西離不離得開 Google Cloud。這篇以 2026-10-25 為準，描述 Python 版[最新的 2.13.0](https://github.com/google/adk-python/releases/tag/v2.13.0)（10 月 22 日發布），其他語言版本的差異在對應段落標出。

## 是什麼

ADK 是 Google 開源的 agent 開發框架，[授權為 Apache-2.0](https://github.com/google/adk-python/blob/main/LICENSE)，有 [Python、TypeScript、Go、Java、Kotlin 五個語言版本](https://adk.dev/)。[README](https://github.com/google/adk-python) 的定位是針對 Gemini 最佳化，但與模型和部署環境無關。Python 版的 README 要求 Python 3.11 以上（[quickstart](https://adk.dev/get-started/python/) 寫 3.10 以上），[約兩週發一版](https://github.com/google/adk-python)。

2.0 是這篇最需要先知道的背景。[Python 版 2.0 在 2026 年 5 月正式發布](https://adk.dev/2.0/)，執行引擎從階層式的 agent 執行器改成圖狀的 Workflow Runtime，agent、工具和一般函式都變成圖上的節點。

工具呼叫、子 agent 委派、MCP client 和 session 這些，多數 agent 框架都有，不需要 ADK 才做得到；站內的[框架選型文](/posts/ai/2026-08-22-agent-framework-selection-guide)比較過另外七套。ADK 把這幾件事放在同一個框架裡：五個語言版本、[跟框架一起發佈的評估指令與開發用 Web UI](https://github.com/google/adk-python)，以及[部署選項](https://adk.dev/deploy/)：Agent Runtime、Cloud Run、GKE，或任何跑得了容器的環境。

## 給誰、先備知識

適合想把「確定的流程」和「模型的判斷」混在同一個系統裡的團隊，例如分類交給模型、後續處理與副作用寫成函式。需要熟悉非同步程式，因為 Runner 會把每一步包成 [Event 串流回來](https://adk.dev/sessions/session/)，也會用 Pydantic 定義輸入輸出 schema。

起步只需要一組 Gemini API key，[官方 quickstart](https://adk.dev/get-started/python/) 就是把 `GOOGLE_API_KEY` 寫進 `.env`。已經在 Google Cloud 上的團隊可以把託管服務串起來；沒有的話，後面〈部署、可觀測性與雲端綁定〉那張表列出哪些部分要自己補。

## 內容地圖

### Agent 與編排

最小單位是 [`Agent`](https://adk.dev/agents/llm-agents/)（別名 `LlmAgent`）：一個模型、一段 instruction、一組工具，由模型決定怎麼走。要把流程寫死，2.0 提供 [`Workflow`](https://adk.dev/graphs/)：節點可以是 agent、工具或一般函式，邊決定順序，分類節點回傳 `Event(route=...)` 就能分流。靜態圖畫不出來的控制流，同一頁的[動態工作流](https://adk.dev/graphs/)讓你用程式碼寫迴圈與條件。

另一條路是[協作模式](https://adk.dev/workflows/collaboration/)：協調者 agent 掛上 `sub_agents`，每個子 agent 設定 `chat`、`task` 或 `single_turn`。`single_turn` 不跟使用者互動，可以平行執行；`task` 可以向使用者補問，完成後自動回到協調者；`task` 在圖工作流中的支援見限制一節。

2.0 之前常見的 `SequentialAgent`、`ParallelAgent`、`LoopAgent`，[文件說已被圖工作流取代](https://adk.dev/agents/workflow-agents/)（Python 與 Go），[TypeScript 版建構時會印出棄用警告](https://adk.dev/2.0/)，[2.13.0 的 release notes](https://github.com/google/adk-python/releases/tag/v2.13.0) 也列了把它們標為棄用的文件修正。站內[框架總覽](/posts/ai/2026-04-01-agent-frameworks-2026)寫於 2026 年 4 月，當時的 ADK 段列的是這三種。

### 工具與 MCP

Python 函式放進 `tools` 會[自動包成 FunctionTool](https://adk.dev/agents/llm-agents/)，另一個 agent 包成 `AgentTool` 也能當工具。MCP 走 [`McpToolset`](https://adk.dev/tools-custom/mcp-tools/)，支援 stdio、SSE 與 Streamable HTTP，文件建議用 `tool_filter` 只暴露需要的工具；反向可以用 [`to_mcp_server`](https://adk.dev/tools-custom/mcp-tools/agent-as-server/) 把整個 agent 包成 MCP server。MCP 的概念可參考站內的 [MCP 介紹](/posts/ai/2026-03-22-mcp-model-context-protocol)。

[同一頁](https://adk.dev/tools-custom/mcp-tools/)有一張取捨表：`McpToolset` 的工具定義與輸出都進主 agent 的 context，成本較低、延遲可預期；`AgentTool` 讓子 agent 的中間推理與大量輸出留在子 agent 裡，代價是成本較高、延遲不固定。需要人工核准的工具可以[設定 `require_confirmation`](https://adk.dev/tools-custom/confirmation/)，這項功能目前標示為實驗性，且不支援持久化 session（見限制一節）。

### Callbacks 與 Session

[Callbacks](https://adk.dev/callbacks/) 在 agent、model、tool 三層各有 before 與 after 掛點：回傳 `None` 就放行，回傳物件則取代預設行為，例如 `before_model_callback` 回傳 `LlmResponse` 會跳過模型呼叫。官方把[實作安全防護與驗證輸入輸出](https://adk.dev/callbacks/)列為 callbacks 的用途之一。

一段對話是一個 Session，裡面有 Events 歷史與 state 暫存區；跨對話的長期資料交給 [MemoryService](https://adk.dev/sessions/)。[SessionService 有三種實作](https://adk.dev/sessions/session/)：記憶體內（重啟就消失）、`DatabaseSessionService`（SQLAlchemy 相容資料庫，要用非同步 driver）、`VertexAiSessionService`（Google Cloud 託管）。[Memory 內建三種](https://adk.dev/sessions/memory/)：記憶體內（關鍵字比對）、Vertex AI Memory Bank（由 LLM 萃取並整併記憶）、Vertex AI RAG；2.13.0 另外加了[實驗性的 MongoDB session 與 memory service](https://github.com/google/adk-python/releases/tag/v2.13.0)。託管記憶服務的設計，站內[雲端平台記憶 API 那篇](/posts/ai/2026-09-19-cloud-platform-memory-apis)有橫向比較。

### 評估

評估指令與開發用 Web UI 的 Eval 分頁跟框架一起發佈。[資料格式](https://adk.dev/evaluate/)有 `*.test.json` 測試檔（單一 session，當單元測試）和 evalset（多段長對話，當整合測試），都由 Pydantic 模型定義；每個 turn 記錄使用者輸入、預期的工具呼叫軌跡、預期的中間 agent 回應與最終回應。跑法有四種：`adk web` 的 Eval 分頁（把當下對話存成 eval case）、`pytest`、`adk eval`，以及用錄下的基準回放比對的 `adk conformance`。

[判分標準](https://adk.dev/evaluate/criteria/)涵蓋工具軌跡比對（`EXACT`、`IN_ORDER`、`ANY_ORDER`）、ROUGE-1、LLM 判官的語意比對、自訂 rubric、幻覺與安全，以及多輪對話的任務成功率。另有四項永遠開啟、只回報不判定通過的成本指標：工具呼叫數、模型呼叫數、token 與耗時。沒有設定時，[預設](https://adk.dev/evaluate/)是 `tool_trajectory_avg_score` 1.0 加 `response_match_score` 0.8。

### 部署、可觀測性與雲端綁定

`adk web` 與 `adk run` 是本機開發用，[quickstart 明說 Web UI 不適合上線](https://adk.dev/get-started/python/)。[部署目標](https://adk.dev/deploy/)有 Agent Runtime（Agent Platform 上的託管服務）、Cloud Run、GKE，或任何跑得了容器的環境。可觀測性採 [OpenTelemetry GenAI 語意規範，用 OTLP 匯出](https://adk.dev/observability/traces/)，後端可接 Cloud Trace、Jaeger、Grafana Tempo 或 Datadog。跨服務的 agent 可以走 [A2A](https://adk.dev/a2a/intro/)，用 `RemoteA2aAgent` 把遠端 agent 當成應用程式內的 sub-agent 呼叫；同一個應用程式內的拆分，文件建議直接用 sub-agent 就好。兩個協議的分工見站內[協定層那篇](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer)。

離開 Google Cloud 還能用多少，可以逐項看：

| 項目 | 不用 Google Cloud 可以嗎 | 依據 |
|---|---|---|
| 模型 | 可以。Gemini 直連，Claude、OpenAI、Ollama、vLLM 等走連接器或 LiteLLM；非 Gemini 模型搭配 `output_schema` 與 `tools` 可能不穩，見限制 | [模型頁](https://adk.dev/agents/models/) |
| Session | 可以。記憶體內、`DatabaseSessionService` 或 2.13.0 新增的實驗性 MongoDB 版；`VertexAiSessionService` 才要 GCP | [Session 頁](https://adk.dev/sessions/session/) |
| Memory | 內建的免 GCP 選項是記憶體內版，以及 2.13.0 新增的[實驗性 MongoDB 版](https://github.com/google/adk-python/releases/tag/v2.13.0)；Memory Bank 與 RAG 版需要 GCP | [Memory 頁](https://adk.dev/sessions/memory/) |
| 評估 | 部分判分不行：`safety_v1`、多輪任務成功率等委派給 Google 的評估服務，需要 Google Cloud 專案 | [判分標準頁](https://adk.dev/evaluate/criteria/) |
| 部署 | 可以，打包成容器自己跑；託管選項集中在 Google Cloud | [部署頁](https://adk.dev/deploy/) |
| 追蹤 | 可以，OTLP 通用 | [Traces 頁](https://adk.dev/observability/traces/) |

## 一個具體範例：圖工作流的分流

下面這段取自官方 [Graph-based agent workflows](https://adk.dev/graphs/) 頁面的 routing 範例，只調整排版並補上 import：

```python
from google.adk import Agent, Event, Workflow

process_message = Agent(
    name="process_message",
    model="gemini-flash-latest",
    instruction="""Classify user message into either "BUG", "CUSTOMER_SUPPORT",
      or "LOGISTICS". If you think a message applies to more than one category,
      reply with a comma separated list of categories.
   """,
)

def router(node_input: str):
    routes = node_input.split(",")
    routes = [route.strip() for route in routes]
    return Event(route=routes)

def response_1_bug():
    return Event(message="Handling bug...")

def response_2_support():
    return Event(message="Handling customer support...")

def response_3_logistics():
    return Event(message="Handling logistics...")

root_agent = Workflow(
    name="routing_workflow",
    edges=[
        ("START", process_message, router),
        (
            router,
            {
                "BUG": response_1_bug,
                "CUSTOMER_SUPPORT": response_2_support,
                "LOGISTICS": response_3_logistics,
            },
        ),
    ],
)
```

模型只負責分類這一步，之後走哪個分支由 `router` 這個普通函式決定；每個分支可以換成工具、函式或另一個 agent。[官方文件](https://adk.dev/graphs/)拿它對照「把同樣的流程全寫進一長串 instruction」，後者隨著步驟變多，agent 越難每一步都照做。要注意這個範例的 `router` 直接切割模型輸出的字串，輸出格式要靠 instruction 約束；正式使用可以改用結構化輸出。

協作模式與評估各有官方的完整範例：協作模式見 [Build collaborative agent teams](https://adk.dev/workflows/collaboration/)，評估見 [Why evaluate agents](https://adk.dev/evaluate/) 與[判分標準](https://adk.dev/evaluate/criteria/)。`adk eval` 沒有設定時的預設判分，是 `tool_trajectory_avg_score` 1.0 加 `response_match_score` 0.8。

## 限制

**2.0 是會動到既有程式的升版。** [官方列出的不相容](https://adk.dev/2.0/)包括：Event 新增 `node_info` 與 `output` 欄位，用固定欄位存事件的自訂 SessionService 要改 schema；覆寫 `_run_async_impl` 的自訂 agent，覆寫內容會被圖引擎略過；工具裡寬鬆的 `except Exception` 會讓新的自動重試失效。2.13.0 又把[預設的 telemetry schema 換成 OpenTelemetry GenAI v2](https://github.com/google/adk-python/releases/tag/v2.13.0)，要沿用舊格式得設環境變數。暫時不升級，可以用 [`pip install "google-adk~=1.0"`](https://adk.dev/2.0/) 留在 1.x。

**功能在各語言與各模式之間不齊。** [協作模式只標 Python 與 Go 的 2.0](https://adk.dev/workflows/collaboration/)，`task` 模式的 agent 必須是葉節點，文件寫 Python v2.0.0 在圖工作流中停用 `task` 模式，較新版本是否已開放，要在你的版本上試。[文件說圖工作流與部分第三方整合不相容](https://adk.dev/graphs/)，但沒有列出整合名稱，用到第三方整合前先確認。實驗性的 tool confirmation 在文件的[已知限制](https://adk.dev/tools-custom/confirmation/)裡，不支援 `DatabaseSessionService` 與 `VertexAiSessionService`這兩種持久化 session 服務。另外 `output_schema` 搭配 `tools` 同時使用，只有特定模型（如 Gemini 3.0）原生支援，[其他模型會退回 `set_model_response` 工具，文件自己說可能不可靠](https://adk.dev/agents/llm-agents/)。

**評估頁只列 Python，部分判分要 Google 的服務。** [評估頁標示支援 Python](https://adk.dev/evaluate/)；`safety_v1` 和多輪任務成功率這類判分[委派給 Agent Platform Eval SDK，需要 Google Cloud 專案](https://adk.dev/evaluate/criteria/)。[預設的 `tool_trajectory_avg_score` 用 `EXACT` 比對](https://adk.dev/evaluate/criteria/)，工具呼叫不能多也不能少，模型換條路徑就算不符，可以改成 `IN_ORDER` 或 `ANY_ORDER`。[搭配使用者模擬時](https://adk.dev/evaluate/criteria/)，`tool_trajectory_avg_score`、`response_match_score`、`response_evaluation_score` 與 `final_response_match_v2` 這四項需要參照答案的判分不能用。拿內建評估做單元測試式的回歸檢查可以直接用；要評安全性或多輪任務成功率，就需要 Google Cloud 專案。

**雲端綁定集中在託管層。** 模型可以換。Agent Runtime 是[付費服務，有免費額度](https://adk.dev/deploy/agent-runtime/)。Cloud Run 部署若沒設 `--session_service_uri` 與 `--artifact_service_uri`，[容器會退回記憶體內服務，instance 重啟資料就沒了](https://adk.dev/deploy/cloud-run/)。不在 Google Cloud 的團隊，容器、資料庫與記憶層都要自己接。

## 怎麼用

1. **先決定哪些步驟要寫死。** 順序固定、出錯代價高的流程（核准、扣款、寫資料庫）用 `Workflow`，讓模型只做分類或生成；開放式、子任務需要判斷的才用協調者加 `sub_agents`。
2. **本機起步。** 依[官方 quickstart](https://adk.dev/get-started/python/)，`pip install google-adk`，用 `adk create my_agent` 建專案，把 `GOOGLE_API_KEY` 寫進 `.env`，在上層目錄執行 `adk web`，在 Web UI 裡跑幾輪對話。
3. **把滿意的對話存成 eval case。** 在 Eval 分頁加入目前 session，再用 `adk eval` 與設定檔重跑；軌跡判分先用 `IN_ORDER`。
4. **部署前先選 session 與 memory 的後端。** 自己管就用 `DatabaseSessionService`；Cloud Run 要記得設 `--session_service_uri`。需要人工核准的工具，先確認它與你選的 session 服務相容。
5. **鎖版本，每次升版重跑 eval。** 版本約兩週一次，把 release notes 與 eval 結果一起看，再決定要不要跟。

跨框架的取捨，看站內[框架選型文](/posts/ai/2026-08-22-agent-framework-selection-guide)；ADK 在 Google Cloud 上的位置，見 [Vertex AI 到 Agent Platform 那篇](/posts/ai/2026-08-22-vertex-ai-model-platform)。

## 參考資料

- [google/adk-python（README）](https://github.com/google/adk-python)
- [LICENSE（Apache-2.0）](https://github.com/google/adk-python/blob/main/LICENSE)
- [adk-python v2.13.0 release notes](https://github.com/google/adk-python/releases/tag/v2.13.0)
- [ADK 文件首頁](https://adk.dev/)
- [Welcome to ADK 2.0（升級與不相容項目）](https://adk.dev/2.0/)
- [Graph-based agent workflows](https://adk.dev/graphs/)
- [Build collaborative agent teams](https://adk.dev/workflows/collaboration/)
- [Template agent workflows](https://adk.dev/agents/workflow-agents/)
- [Simple agents with LlmAgent](https://adk.dev/agents/llm-agents/)
- [AI Models for ADK agents](https://adk.dev/agents/models/)
- [Model Context Protocol tools](https://adk.dev/tools-custom/mcp-tools/)
- [Expose an agent as an MCP server](https://adk.dev/tools-custom/mcp-tools/agent-as-server/)
- [Get action confirmation for ADK Tools](https://adk.dev/tools-custom/confirmation/)
- [Callbacks](https://adk.dev/callbacks/)
- [Conversational Context: Session, State, and Memory](https://adk.dev/sessions/)
- [Session](https://adk.dev/sessions/session/)
- [Memory](https://adk.dev/sessions/memory/)
- [Why evaluate agents](https://adk.dev/evaluate/)
- [Evaluation Criteria](https://adk.dev/evaluate/criteria/)
- [Deploying Your Agent](https://adk.dev/deploy/)
- [Deploy to Agent Runtime](https://adk.dev/deploy/agent-runtime/)
- [Deploy to Cloud Run](https://adk.dev/deploy/cloud-run/)
- [Agent activity traces](https://adk.dev/observability/traces/)
- [Introduction to A2A](https://adk.dev/a2a/intro/)
- [Python Quickstart for ADK](https://adk.dev/get-started/python/)
- [框架選型文：LangGraph、CrewAI、MAF、AG2、Mastra、Pydantic AI、DSPy](/posts/ai/2026-08-22-agent-framework-selection-guide)
- [2026 AI Agent 框架總覽](/posts/ai/2026-04-01-agent-frameworks-2026)
- [MCP 介紹](/posts/ai/2026-03-22-mcp-model-context-protocol)
- [協定層：MCP、A2A、ACP、Skills](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer)
- [五朵雲的記憶 API](/posts/ai/2026-09-19-cloud-platform-memory-apis)
- [Vertex AI：從模型 API 到 Gemini Enterprise Agent Platform](/posts/ai/2026-08-22-vertex-ai-model-platform)
