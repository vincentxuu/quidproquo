---
title: "2026 Agent 框架怎麼選：LangGraph、CrewAI、MAF、AG2、Mastra、Pydantic AI、DSPy"
date: 2026-08-22
category: ai
type: deep-dive
tags: [ai-agent, framework, orchestration, multi-agent, langgraph, pydantic-ai, dspy]
lang: zh-TW
tldr: "七套工具不是同一類產品：LangGraph、MAF 與 Mastra偏耐久工作流，CrewAI 與 AG2 偏多 agent 協作，Pydantic AI 偏型別化 Python agent，DSPy 則用資料與 metric 最佳化整個 AI 程式。先選控制模型，再選框架。"
description: "用編排原語、狀態耐久性、多 agent 模型、型別、語言、可觀測性與遷移成本，比較七套 2026 Agent 框架。"
draft: true
---

> 🌏 [English version](/posts/ai/2026-08-22-agent-framework-selection-guide-en)

七套名字常出現在同一張「Agent 框架」清單，實際上解的是不同問題。[LangGraph](https://docs.langchain.com/oss/python/langgraph/overview) 是低階編排 runtime。[CrewAI](https://docs.crewai.com/) 與 [AG2](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/pattern-cookbook/overview/) 先處理多 agent 怎麼合作。[Microsoft Agent Framework](https://learn.microsoft.com/en-us/agent-framework/overview/)（下稱 MAF）與 [Mastra](https://mastra.ai/ai-workflows) 同時提供 agent 與明確工作流。[Pydantic AI](https://ai.pydantic.dev/agents/) 從型別化 Python agent 出發；[DSPy](https://dspy.ai/) 則把提示、工具使用與推理策略當成可以用資料最佳化的程式。

所以這篇不再做一次框架人氣地圖。站上原本的[「2026 年 15 個值得關注的 Agent 框架」](/posts/ai/2026-04-01-agent-frameworks-2026)回答「市場上有哪些選項」；這篇只回答「同一個專案該用哪一套」，也不按 stars 排名。LangGraph、CrewAI 與 MAF 的 API 細節，分別交給既有的[LangGraph 專文](/posts/ai/2026-03-27-langgraph-agent-orchestration)、[CrewAI 專文](/posts/ai/2026-08-21-crewai-multi-agent-framework)與[MAF 專文](/posts/ai/2026-08-21-microsoft-agent-framework)。

## 先判斷你需不需要框架

MAF 官方文件有一句很好的底線：「If you can write a function … do that instead」。一次模型呼叫加兩三個工具、沒有中斷恢復、沒有跨步驟狀態的功能，先寫普通函式。框架的價值不是少寫十行程式，而是替長時間執行、狀態保存、人工核准、多角色協作與可觀測性建立共同邊界。

今晚可以先做一件事：把流程畫成方塊與箭頭，並標出每個可能失敗、暫停或需要人工決定的位置。如果圖只有一個 agent loop，就從模型 SDK 或 Pydantic AI 這種薄層開始。重啟程序後必須接續原步驟，耐久執行才是第一級需求。真正的不確定性是「下一個該由誰接手」，再看 CrewAI 或 AG2。

## 七套工具放到同一組決策軸

| 選項 | 主要編排原語 | 狀態與耐久性 | 多 agent 模型 | 型別與 schema | 語言 / runtime | tracing 與 eval 邊界 |
|---|---|---|---|---|---|---|
| [LangGraph](https://docs.langchain.com/oss/python/langgraph/overview) | state、node、edge 組成的 graph | checkpointer 保存 thread；store 保存跨 thread 資料 | subgraph、handoff、router 或自訂 graph | state schema；節點仍由程式碼控制 | Python、JavaScript | framework 管執行；LangSmith 是相鄰平台 |
| [CrewAI](https://docs.crewai.com/) | Agent、Task、Crew；Flow 管明確路徑 | Flow 可保存狀態、暫停與恢復 | sequential、hierarchical 與角色委派 | agent 可用 Pydantic structured output；角色仍主要由文字描述 | Python | 開源框架有 tracing hooks；託管、營運介面另看平台 |
| [MAF](https://learn.microsoft.com/en-us/agent-framework/overview/) | agent、executor、edge 與 graph workflow | session state、checkpoint、人工介入 | sequential、concurrent、handoff、group chat 等 workflow | 路由與 workflow 強調 type safety | Python、.NET；Go 功能面需逐項核對 | middleware 與 telemetry 在框架邊界內 |
| [AG2](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/pattern-cookbook/overview/) | agent conversation、GroupChat、handoff | 對話歷史與共享 context；耐久工作流要自行設計儲存邊界 | group chat、nested chat、routing、feedback loop | 工具參數與 structured output 可接 Pydantic | Python | 以 logging 與第三方整合為主，沒有把 eval 當核心編排原語 |
| [Mastra](https://mastra.ai/ai-workflows) | typed step 加 `.then()`、`.branch()`、`.parallel()` 與 loop | shared state；workflow 可 suspend / resume | agent network 或把 agent 放進 workflow step | step input / output schema 是一等公民 | TypeScript / Node.js | tracing、scorer、dataset 與 Studio 同一生態系 |
| [Pydantic AI](https://ai.pydantic.dev/agents/) | `Agent`、tool、dependency、typed output；底層可走 graph | agent history；耐久執行透過 Temporal、DBOS、Prefect、Restate 等整合 | delegation、handoff 或程式碼驅動的多 agent pattern | `deps_type`、`output_type` 與 Pydantic validation 是核心 | Python | Logfire 做 instrumentation；`pydantic-evals` 是獨立套件 |
| [DSPy](https://dspy.ai/) | Signature、Module、Optimizer；控制流程就是 Python | 可儲存編譯結果，但它不是耐久工作流 runtime | 可用 ReAct 與模組組合 agent，並非團隊編排優先 | Signature 宣告 typed input / output | Python | metric 與 optimizer 是核心；執行耐久性要交給別層 |

表格裡最容易誤讀的是 DSPy。它可以做 agent，也有 ReAct 模組，但真正的差異不是另一套 handoff API，而是先定義 metric 與資料集，再讓 optimizer 調整提示或示例。若你的痛點是「流程很穩，但輸出品質靠人工改 prompt」，DSPy 可能比換 orchestrator 更對症。它也可以放在 LangGraph、MAF 或其他 runtime 的某個節點裡，不必二選一。

## 依控制模型選，不要依功能勾選表選

### 要明確掌控每條路徑：LangGraph

LangGraph 把 shared state、node 與 edge 當成主要語言，適合「模型做判斷，但系統決定可走哪些路」的流程。官方的 [persistence 文件](https://docs.langchain.com/oss/python/langgraph/persistence)把 thread checkpoint 與跨 thread store 分開，這讓人工核准、故障恢復與長期記憶不必塞在同一個 message list 裡。

代價是你要自己設計 state schema、節點粒度與 checkpoint 保留政策。單純 chatbot 或固定三步驟 pipeline 用它，常會先得到一張漂亮的圖，再多背一套執行語意。已經把大量業務規則寫進 node、edge 與 checkpoint namespace 後，遷移成本也高，因為搬的不只是模型呼叫，而是整套狀態機。

### 先描述團隊怎麼分工：CrewAI 或 AG2

CrewAI 的中心是角色、任務與 crew。研究員、作者、編輯的責任如果用自然語言比用狀態圖更容易說清楚，它能很快做出多 agent 原型。需要可預測路徑時，再用 Flow 補上 start、listener、router 與持久狀態。詳細抽象與限制可直接看站內的[CrewAI 專文](/posts/ai/2026-08-21-crewai-multi-agent-framework)。

AG2 的中心則是 conversation。它的官方 pattern cookbook 把 routing、feedback loop、hierarchy、pipeline 與 redundant pattern 都建立在 GroupChat 協作上。既有系統若以 AutoGen 式 `ConversableAgent`、訊息歷史與 speaker selection 組織，AG2 是自然延續。若你要的是可重播、可版本化的資料工作流，對話紀錄不能自動等同業務 checkpoint，儲存與冪等性仍要另外設計。

兩者都不適合用來證明「多 agent 一定比單 agent 好」。先拿同一組任務比較單 agent 與多 agent 的成功率、token 成本和延遲；角色拆開後沒有可測量改善，就把它合回去。

### 要企業工作流與多語言 SDK：MAF

MAF 把單一 agent、middleware、session state、telemetry 與 graph workflow 放在同一個產品面。官方文件明確區分 open-ended task 用 agent、步驟固定且需要執行順序時用 workflow。對已經在 .NET、Azure、Semantic Kernel 或微軟 AutoGen 路線上的團隊，這個整合面比單項 API 漂亮更重要。

它同時也是遷移決策，不只是新框架決策。AG2 與微軟目前的 Agent Framework 是不同專案，`autogen` 套件名稱也容易誤導；實際套件與支援路線見[MAF 專文](/posts/ai/2026-08-21-microsoft-agent-framework)。非微軟環境並不代表不能用 MAF，但採用前要用目標模型、hosting 與 telemetry backend 跑一次小型垂直切片，別只驗證 Azure happy path。

### TypeScript 團隊要一套完整產品面：Mastra

Mastra 的優勢不是把 Python 框架翻成 TypeScript，而是把 typed workflow、agent、memory、MCP、tracing 與 scorer 放在同一個 TypeScript 開發迴圈。工作流 step 可串接、平行、分支、迴圈，也能保存 shared state 後暫停與恢復。對 Next.js、Node.js 或 Cloudflare 團隊，少一個跨語言服務本身就是很大的架構收益。

代價是 framework surface 很寬。若你只需要一個 tool-calling agent，先用既有 AI SDK 加 schema validation，會比把 storage、Studio 與 deployment 一起納入更容易。評估 lock-in 時，不只看模型能否更換，也要實際匯出 trace、把 workflow 跑在自有 storage，並確認 suspend 後的 state 能否由你控制。

### Python 型別邊界優先：Pydantic AI

Pydantic AI 把 dependency 與 output type 直接放進 agent 定義，模型輸出會經 Pydantic 驗證。它適合 API 後端、資料服務或既有 Pydantic codebase：你要的是一個有工具、依賴注入與可靠 schema 的 agent，而不是先建立多角色組織圖。

需要長時間執行時，官方的 [durable execution](https://ai.pydantic.dev/durable_execution/)不是再造一套 scheduler，而是整合 Temporal、DBOS、Prefect、Restate 等系統。這降低了把 agent 接進既有平台的阻力，也表示部署複雜度由兩層共同決定。若團隊沒有任何 durable runtime，不能只看到 integration 名稱就當成開箱即用。

### 先有 metric，再讓系統最佳化：DSPy

DSPy 用 Signature 宣告任務輸入輸出，用 Module 決定 Predict、ChainOfThought 或 ReAct，再由 Optimizer 依 metric 與 trainset 編譯程式。它最適合已有可重複案例、知道怎樣算好答案，但不想手工維護一長串 prompt 版本的團隊。

沒有資料集與 metric 時，DSPy 的主要價值就無法發揮。它也不替代 checkpoint、人工核准、排程或跨服務重試。實務上可先把最不穩的一個分類、抽取或 RAG 節點寫成 DSPy module，通過離線評估後，再嵌回原本的 orchestrator。

## 可直接採用的決策順序

先從不可妥協的限制往下走：

1. **主要 runtime 是 TypeScript，而且希望 agent、workflow、trace、eval 同一套**：先試 Mastra。
2. **主要 runtime 是 .NET，或正從 Semantic Kernel / 微軟 AutoGen 遷移**：先試 MAF。
3. **需要可恢復的明確 graph，且願意自己設計 state machine**：先試 LangGraph。
4. **多 agent 的核心是角色分工**：先用 CrewAI 做垂直切片。
5. **既有心智模型是對話、speaker selection 與 GroupChat**：先看 AG2。
6. **Python API 最在意 dependency、輸出 schema 與驗證**：先試 Pydantic AI。
7. **流程已經存在，真正問題是 prompt 與策略品質不穩**：在該節點試 DSPy。

「先試」不是看完 quickstart。用同一組至少包含成功、工具失敗、人工核准與程序重啟的案例，保存每次輸入、輸出、token、延遲與 state。兩套候選都跑完後，再比較哪一套讓失敗原因最容易定位、重跑與遷移。

## 遷移成本藏在三個地方

第一是**狀態格式**。模型供應商通常能換，但 checkpoint、message history、shared context 與 memory namespace 一旦進 production，就會變成資料契約。採用前先把一筆完整執行匯出成你看得懂的 JSON，確認不靠原平台 UI 也能重建狀態。

第二是**控制流程**。LangGraph 的 edge、CrewAI 的 delegation、AG2 的 speaker selection、Mastra 的 step chain 與 DSPy 的 compiled module，不是同一種抽象。把核心業務規則保留在普通函式，框架層只做路由、狀態與重試，日後才有移動空間。

第三是**可觀測性與評估**。框架有 trace 不代表已有品質 eval；能評分最終答案，也不代表能重播中途失敗。選型 proof of concept 至少要回答：哪個 tool call 出錯、當時 state 是什麼、能否從中斷點接續，以及版本更新後同一批案例有沒有退步。

## 整體來說

沒有一套框架在所有軸上勝出，因為它們連優化目標都不同。LangGraph 優化明確、耐久的 graph；CrewAI 優化角色式分工；AG2 優化對話式協作。MAF 優化企業 agent 與 workflow 的共同邊界；Mastra 優化 TypeScript 的整合開發體驗。Pydantic AI 優化 Python 型別與驗證；DSPy 優化有 metric 的 AI 程式品質。

真正穩的選法是先寫下失敗後必須保住什麼、誰決定下一步、資料契約在哪裡，再挑最貼近那個控制模型的框架。如果答不出來，先用普通函式做出 baseline；這通常比先選一個框架，再把問題改寫成它的形狀便宜。

## 參考資料

- [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview)
- [LangGraph persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
- [CrewAI Documentation](https://docs.crewai.com/)
- [Microsoft Agent Framework overview](https://learn.microsoft.com/en-us/agent-framework/overview/)
- [AG2 Pattern Cookbook](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/pattern-cookbook/overview/)
- [AG2 tools and structured outputs](https://docs.ag2.ai/latest/docs/user-guide/basic-concepts/introducing-tools/)
- [Mastra workflows](https://mastra.ai/ai-workflows)
- [Pydantic AI agents](https://ai.pydantic.dev/agents/)
- [Pydantic AI durable execution](https://ai.pydantic.dev/durable_execution/)
- [Pydantic Evals](https://ai.pydantic.dev/evals/)
- [DSPy documentation](https://dspy.ai/)
- [2026 年 15 個值得關注的 Agent 框架](/posts/ai/2026-04-01-agent-frameworks-2026)
- [LangGraph：用圖結構管理 Agent 工作流程](/posts/ai/2026-03-27-langgraph-agent-orchestration)
- [CrewAI：用角色扮演組織多 Agent 協作的框架](/posts/ai/2026-08-21-crewai-multi-agent-framework)
- [Microsoft Agent Framework：兩個框架合併之後，AutoGen 這個名字現在指誰](/posts/ai/2026-08-21-microsoft-agent-framework)
