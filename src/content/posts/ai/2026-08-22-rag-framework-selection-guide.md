---
title: "RAG 框架怎麼選：LlamaIndex、Haystack、RAGFlow、Dify、R2R 不是同一層產品"
date: 2026-08-22
category: ai
type: deep-dive
tags: [rag, framework, llamaindex, haystack, ragflow, dify, r2r]
lang: zh-TW
tldr: "LlamaIndex、Haystack 是以程式碼為主的框架；RAGFlow、Dify 是帶管理介面的平台；R2R 則把檢索系統包成 API 服務。先決定團隊要保留多少 ingestion、retrieval 與營運控制權，再選工具。"
description: "用共同決策主脊比較 LlamaIndex、Haystack、RAGFlow、Dify、R2R：產品層級、資料匯入、檢索客製、工作流程、管理介面、部署邊界、評估與退出成本。"
draft: true
---

> 🌏 [English version](/posts/ai/2026-08-22-rag-framework-selection-guide-en)

把 [LlamaIndex](https://developers.llamaindex.ai/python/framework/)、[Haystack](https://docs.haystack.deepset.ai/)、[RAGFlow](https://github.com/infiniflow/ragflow)、[Dify](https://github.com/langgenius/dify) 與 [R2R](https://github.com/SciPhi-AI/R2R) 放進同一張「RAG 框架排行榜」，第一步就比錯了。它們處理的問題有交集，交付的產品層卻不同：前兩套主要交付 Python 抽象，RAGFlow 與 Dify 交付可操作的平台，R2R 交付一套可自行架設的檢索 API。

差別不只是「低程式碼還是寫程式」。真正的選型問題是：**誰負責把原始文件變成可查詢資料，誰能改檢索邏輯，誰維護管理介面與執行紀錄，以及離開工具時要搬走什麼。**

這篇只比較產品邊界與工程責任，不重講 RAG 技法。Chunking、混合檢索、reranking、評估等做法可直接看站上的 [RAG 技法大全](/series/rag-techniques)；LlamaIndex 的抽象、Workflows 與繁中預設值，則已在 [LlamaIndex 專文](/posts/ai/2026-08-21-llamaindex-rag-framework)展開。

## 先分層：你買到的不是同一種東西

| 工具 | 主要交付物 | 團隊主要工作位置 | 比較接近 |
|---|---|---|---|
| [LlamaIndex](https://developers.llamaindex.ai/python/framework/) | Python framework 與 integrations | 應用程式碼、資料處理與 workflow | 文件導向的開發套件 |
| [Haystack](https://docs.haystack.deepset.ai/) | Components、Pipelines、Document Store 介面 | Python pipeline 與部署服務 | 模組化 AI orchestration framework |
| [RAGFlow](https://github.com/infiniflow/ragflow) | 文件解析、資料集、檢索、聊天與 Agent 的全端系統 | 管理介面、API 與平台設定 | RAG 平台 |
| [Dify](https://github.com/langgenius/dify) | 視覺化 workflow、知識庫、Agent、模型與應用管理 | Studio、Plugins、API 與平台營運 | AI 應用平台 |
| [R2R](https://github.com/SciPhi-AI/R2R) | Ingestion、search、RAG、Agent 與文件管理 API | REST API、SDK 與後端設定 | Retrieval backend |

這張表不是分高下。Library 讓你保留程式碼控制權，也把管理介面、權限與部署責任留給你；平台替你交付更多現成功能，也會把更多狀態收進自己的資料模型。

## 共同決策主脊

| 判準 | LlamaIndex | Haystack | RAGFlow | Dify | R2R |
|---|---|---|---|---|---|
| Library / platform | Library 為主，另有託管產品 | Library / framework | 全端平台 | AI 應用平台 | API-first 服務 |
| Ingestion ownership | 用程式碼組 reader、node 與 transformation | 用 component 組 indexing pipeline | 平台管理解析、chunk 與 dataset | Knowledge Pipeline 與 datasource 管理匯入 | API 建立並管理 document |
| Retrieval customization | retriever、postprocessor 與 storage 可替換 | component、branch、loop 與自訂 Document Store | 以平台設定與 API 為主 | 視覺節點、plugins 與 API | Search / RAG API 與後端設定 |
| Workflow / Agent | 事件驅動 Workflows 與 agents | Pipeline 的 branch、loop、tools 與 agents | 內建 Agent workflow | 視覺化 Workflow、Agent Strategy 與 tools | 內建 agent / deep research API |
| UI / operations | 核心 framework 不交付營運 UI | 核心 framework 不交付完整產品 UI | 內建資料集、聊天與 Agent UI | 內建 Studio、workspace 與應用管理 | 主要邊界是 API 與 SDK |
| Deployment / data boundary | 由應用架構決定 | 由應用架構決定 | Cloud 或 Docker 自架 | Cloud、VPC 或 Docker 自架 | Python light mode 或 Docker full mode |
| Evaluation / observability | evaluator、instrumentation 與 integrations | 元件級、端到端 evaluator | 文件預覽、檢索與引用檢查偏操作面 | 執行紀錄與 observability integrations | 公開 README 未把 evaluation harness 列為核心 |
| Exit cost locus | Python 抽象與 integrations | Pipeline/component 介面 | dataset、解析設定與平台服務 | workflow DSL、plugins、knowledge assets | API contract、server config 與已匯入資料 |

最後兩欄不是官方給的遷移評分，而是依公開介面做的工程判讀。尤其「文件沒列為核心」不等於功能不存在；它只代表選型時不能把它當成已查證能力。

## 誰擁有 ingestion，決定日後誰負責重建索引

LlamaIndex 與 Haystack 都把 ingestion 當成可組合的程式流程。LlamaIndex 的文件模型是 `Document`、`Node`、transformations 與 storage；Haystack 則把 fetcher、converter、embedder、writer 接進 Pipeline，Document Store 是 pipeline 元件使用的資料介面。你可以把原始檔、chunk ID、metadata 與向量庫放在自己的系統裡，但增量更新、失敗重試、刪除傳播也要自己做。

RAGFlow 把這段收進 dataset 與文件解析流程，並讓使用者在介面查看、調整 chunk。它特別適合版面複雜、需要人工檢查解析結果的文件。代價也很具體：[官方 quickstart](https://github.com/infiniflow/ragflow/blob/main/docs/quickstart.mdx)提醒，dataset 一旦用某個 embedding 模型解析文件，就不能直接更換，因為資料必須留在同一個向量空間；換模型等於規劃重建。

Dify 的 Knowledge Pipeline 把 datasource、處理與知識庫串成平台資產。官方 plugin 文件把 datasource 分成網頁爬蟲、線上文件與雲端硬碟三類，適合由非後端工程師管理資料來源。R2R 則從另一側切入：呼叫 documents API 匯入內容，再以 search、RAG 或 agent API 使用。

**怎麼做**：拿一份會被更新與刪除的真實文件，不要只測一次性 PDF。記下五件事：來源 ID 放哪裡、重跑會不會重複、刪除如何傳播、embedding 換版怎麼重建、失敗工作在哪裡重試。回答不出來的那一格，就是未來的維運工作。

## 檢索控制權：元件可換，不代表改起來同樣容易

如果主要不確定性是「要不要換向量庫、reranker 或 query transformation」，LlamaIndex 與 Haystack 的抽象就是為這種替換設計。LlamaIndex 提供 retriever、query engine、node postprocessor 與多種 storage integration；Haystack 的 Pipeline 是 directed multigraph，可做 branch、loop，也能實作自訂 component 與 Document Store protocol。

兩者的差異比較像語彙中心不同。LlamaIndex 從文件、索引與 context augmentation 長出來；Haystack 從 component 與 pipeline 長出來。前者適合「文件怎麼進、怎麼查」是產品核心的團隊，後者適合想把 retrieval、routing、generation 與 evaluation 都放在同一張程式化流程圖裡的團隊。

RAGFlow、Dify 與 R2R 不是不能客製，而是客製入口不同。RAGFlow 優先提供平台支援的解析與檢索設定；Dify 把 extension point 做成 model、tool、agent strategy、datasource、trigger 等 plugin 類型；R2R 鼓勵應用程式依賴穩定的 REST 邊界。若需求能落在這些入口，開發速度通常比自己組服務快；若核心演算法必須頻繁改到入口之外，就要讀平台原始碼或把該段拆成外部服務。

## Workflow 與 Agent：先問它是不是 RAG 系統的主角

LlamaIndex 已把 RAG 定位成 agent 可使用的工具之一，Workflows 是事件驅動的多步驟流程。Haystack 也能用 Pipeline 的 loop、branch 與 tools 組 agentic flow。兩者都適合把流程版本跟應用程式碼放在一起 review、測試與部署。

RAGFlow 的重心仍是「文件進來之後，如何產生可追溯答案」，Agent workflow 是往外延伸的一層。Dify 的範圍更廣：RAG 只是 AI 應用 workflow 的一種能力，外部事件、工具呼叫、模型管理與發布應用同樣是主角。R2R 則把 agentic retrieval 收在既有 API 後面，包含同時查知識庫與網路的 deep research 入口。

因此，單純的內部文件問答不必因為「未來也許會有 Agent」就先選最大的平台；反過來，如果產品本來就需要讓營運同事調整 workflow、發布多個 AI 應用，拿 library 自己補後台也未必節省。

## UI 與營運：誰會在上線後每天碰它

LlamaIndex 與 Haystack 的核心使用者是工程師。框架能輸出 trace、串 evaluation，也能被包成服務，但帳號、工作區、資料集管理、應用發布與客服可讀的執行紀錄，不是核心 library 自動交付的產品。

RAGFlow 與 Dify 的價值有一大段就在這裡。前者讓團隊操作資料集、解析結果、聊天與 Agent；後者把 workflow canvas、knowledge、model provider、plugins 與應用發布放進共同 workspace。這不是「UI 比 code 簡單」而已，而是把一部分變更權從工程部署流程移到平台權限裡。

R2R 比較適合已經有產品前台與管理後台，只缺一套檢索服務的團隊。API-first 邊界可以避免再引入一套面向終端使用者的應用平台；相對地，營運工具仍要由既有系統或團隊補上。

**怎麼做**：列出上線後會改 prompt、調 retrieval、重跑文件與查錯的人。如果名單不只有工程師，就把「他們能否在不部署程式碼的情況下完成工作」列成驗收項目。

## 部署與資料邊界：自架不等於維運成本相同

LlamaIndex 與 Haystack 是應用相依套件；資料是否離開環境，取決於你接的模型、parser、embedding、向量庫與 observability provider。它們給最大的架構自由，也不會替你做完整平台升級。

RAGFlow、Dify、R2R 都能自行架設，但不是同重量。RAGFlow 的官方部署包含後端、前端、MySQL、Redis、物件儲存與 document engine，預設以 Elasticsearch 存全文與向量；官方映像檔以 x86 為主要支援環境。Dify 的 Docker Compose 也包含應用與多個中介服務，並可設定不同 vector store。R2R 提供輕量 Python 啟動與完整 Docker 模式，適合把它視為獨立 retrieval service。

所以「可以 self-host」只回答資料能不能留在自己的網路，沒有回答誰負責備份、schema migration、服務升級、queue 堵塞與 parser 重跑。

**怎麼做**：在 PoC 前先畫 data-flow diagram，把原始文件、解析內容、embedding 請求、LLM prompt、trace 與備份各自畫到實際服務。只寫「全部 self-host」不能通過這一關。

## 評估與可觀測性：不要把操作紀錄當品質評估

Haystack 的官方 evaluation 模組明確區分 component evaluation 與 end-to-end evaluation，也區分需要 ground truth 的統計 evaluator 與模型評分。LlamaIndex 同樣提供 retrieval、response evaluator 與 instrumentation。這兩套比較容易把測試資料與 pipeline 版本一起放進工程流程。

Dify 提供 workflow 執行紀錄，也在官方 README 列出 Opik、Langfuse、Arize Phoenix 等 observability integration；這有助於查某次執行發生什麼事。RAGFlow 的 chunk 預覽、檢索內容與引用則讓資料品質更容易被人工檢查。這些都重要，卻不自動回答「新版 retrieval 是否比舊版好」。R2R 的公開 README 說明檢索與文件管理能力，沒有把 evaluation harness 列為核心交付；選用時應另做驗證。

平台不論選哪套，都應保留一份框架外的固定測試集，至少包含 query、預期來源、禁止引用的文件與可接受答案。站上的 [RAG 評估框架指南](/posts/ai/2026-03-12-rag-evaluation-frameworks)已整理 RAGAS、DeepEval 與 TruLens，這裡不再重複指標。

## 退出成本：先保留可重建資產

退出成本不只看授權，也看系統狀態藏在哪裡。

- 用 LlamaIndex 或 Haystack，主要耦合通常在 Python 類別、pipeline 接線與 integration 資料結構。向量庫與原始資料若由團隊持有，遷移常是改應用程式與重新驗證。
- 用 RAGFlow，dataset、解析模板、chunk 調整與 document engine 形成一組平台狀態；更換 embedding 或搬平台時要把重建列入計畫。
- 用 Dify，workflow、plugins、knowledge assets、workspace 權限與發布設定共同構成應用。即使流程可匯出，也不能假設執行紀錄與所有資料狀態會一起變成可攜格式。
- 用 R2R，REST API 是清楚的替換縫，但已匯入文件、collection、graph 與 server config 仍要有自己的備份與重建路徑。

最安全的做法不是猜哪套永遠不會換，而是把以下資產放在平台外：原始文件、穩定 source ID、chunking 規格、metadata schema、評估資料集、prompt 與 deployment config。換工具時可以重建，不必逆向還原平台資料庫。

## 五條選型路徑

**選 LlamaIndex**：文件處理與多種資料來源是核心，工程團隊想用 Python 深改 ingestion、retrieval 與 agent workflow，而且願意自己做產品 UI。先讀本站的 [LlamaIndex 完整專文](/posts/ai/2026-08-21-llamaindex-rag-framework)，特別注意目前語言與套件邊界。

**選 Haystack**：你想用明確 component 介面組 indexing、retrieval、routing、generation 與 evaluation，並把 pipeline 當可測試、可序列化的工程資產。

**選 RAGFlow**：複雜文件解析、chunk 可視化、引用追溯與知識庫操作介面比自由改演算法更重要，而且團隊能承擔一套完整平台。

**選 Dify**：RAG 只是多個 AI 應用能力之一，非工程角色要共同操作 workflow、knowledge、plugins、模型與發布流程。

**選 R2R**：已有自己的前端與應用後端，希望用 REST API 補上一套 ingestion、hybrid search、knowledge graph、RAG 與 agentic retrieval 服務。

如果仍無法決定，不要做五套完整 PoC。先選兩個不同層級的候選，用同一份會更新、會刪除、含權限 metadata 的小型語料跑完整生命週期。最後比較的不是 demo 答案，而是誰能修改流程、錯誤在哪裡查、資料怎麼刪，以及離開時怎麼重建。

## 參考資料

- [LlamaIndex Python Framework 官方文件](https://developers.llamaindex.ai/python/framework/)
- [LlamaIndex Ingestion Pipeline 官方文件](https://developers.llamaindex.ai/python/framework/module_guides/loading/ingestion_pipeline/)
- [Haystack Pipelines 官方文件](https://docs.haystack.deepset.ai/docs/pipelines)
- [Haystack Evaluation 官方文件](https://docs.haystack.deepset.ai/docs/evaluation)
- [RAGFlow 官方 README 與自架說明](https://github.com/infiniflow/ragflow/blob/main/README.md)
- [RAGFlow 官方 Quickstart](https://github.com/infiniflow/ragflow/blob/main/docs/quickstart.mdx)
- [Dify 官方 README](https://github.com/langgenius/dify/blob/main/README.md)
- [Dify 官方 Plugin 類型選擇指南](https://docs.dify.ai/en/develop-plugin/getting-started/choose-plugin-type)
- [R2R 官方 README](https://github.com/SciPhi-AI/R2R)
- [LlamaIndex：它已經不是 RAG 框架了，而你可能還在照舊教學選它](/posts/ai/2026-08-21-llamaindex-rag-framework)
- [RAG 技法大全](/series/rag-techniques)

