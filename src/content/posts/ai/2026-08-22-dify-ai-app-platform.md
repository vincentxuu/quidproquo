---
title: "Dify 低程式碼 Agent 平台：從 Workflow 實作到 AI 應用發布"
date: 2026-08-22
category: ai
type: deep-dive
tags: [dify, rag, low-code, workflow, ai-agent]
lang: zh-TW
tldr: "Dify 把模型、Knowledge、視覺化 Workflow、Agent、Plugin 與應用 API 放在共同 workspace；本文會實作一條可測試、發布並由 API 呼叫的最小 Workflow，再說明何時才該換成 Agent。"
description: "沿 AI 應用生命週期介紹並實作 Dify：模型設定、Knowledge Pipeline、Chatflow/Workflow、Agent、發布 API、DSL 與自架邊界。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-dify-ai-app-platform-en)

[Dify](https://github.com/langgenius/dify) 是開放原始碼的 AI 應用平台。它把模型供應商、知識庫、視覺化 workflow、Agent、工具、執行紀錄與應用發布放進同一個 workspace。RAG 是其中一項能力，不是整套產品的唯一中心。

這篇沿一個應用從建立到發布的生命週期介紹 Dify，並完成一條可由 API 呼叫的最小 Workflow。若需求只是比較 RAG 產品層級，可先看 [RAG 框架選型指南](/posts/ai/2026-08-22-rag-framework-selection-guide)。若在低程式碼平台之間選擇，先記住分界：[n8n](/posts/ai/2026-08-22-n8n-agent-automation) 從通用商業流程自動化出發，[Flowise](/posts/ai/2026-08-22-flowise-ai-agent-builder) 則更貼近 LLM 與 Agent flow builder。

## 模型層：先把供應商變成平台資源

Dify 透過 model plugin 管理 LLM、embedding、rerank、語音與 moderation 等模型類型。[官方 model plugin 介面](https://docs.dify.ai/en/develop-plugin/features-and-specs/plugin-types/model-schema)要求 provider 實作 credential validation 與各模型呼叫方法，讓 workflow node 不必直接依賴某家 SDK。

這方便平台管理，也代表模型設定是 workspace 狀態。開發、測試與 production 應分開憑證，限制誰能新增 provider，並記錄 workflow 實際使用的模型。即使 DSL 能搬應用定義，provider credential 與模型在目標 workspace 是否可用仍要另外驗證；匯出邊界會在後面說明。

## Knowledge Pipeline：把資料來源接到知識庫

Knowledge 不只是上傳檔案。Dify 的 datasource plugin 可把網頁爬蟲、線上文件或雲端硬碟接進 Knowledge Pipeline。[官方 datasource 文件](https://docs.dify.ai/en/develop-plugin/dev-guides-and-walkthroughs/datasource-plugin)列出 web crawler、online document 與 online drive 三類入口。依 pipeline 與索引設定，後續處理可以切分內容、建立 embedding 或其他索引，再交給應用檢索。

平台 UI 降低內容人員維護來源的門檻，但資料治理沒有消失。每個來源仍要有 owner、同步頻率、刪除規則與存取範圍。建立知識庫前，先用一小組文件定義「更新後多久可查到」和「來源刪除後多久消失」，再測實際同步。

## Chatflow 與 Workflow：畫布是可執行程式

Dify 的視覺化流程可把輸入、知識檢索、條件分支、模型、工具、程式碼與輸出接成應用。依[官方分界](https://docs.dify.ai/en/cloud/use-dify/build/workflow-chatflow)，Chatflow 適合多輪對話；Workflow 則跑一次就結束，可由 User Input 接 UI／API，或改用 Trigger 接排程、webhook 與整合事件。兩種 start node 互斥。畫布讓 PM、內容與工程共同討論，但每條線仍是 production 邏輯。

建立流程時要替每個外部呼叫定義 timeout、錯誤分支與輸出 schema。不要只測 happy path：讓模型逾時、retrieval 回空、tool 回傳錯誤型別，再看使用者得到什麼。執行紀錄能協助查單次問題，但它不取代一組可重跑的 regression cases。

## 最小實作：從 Studio 到可呼叫的 Workflow API

先做一條確定性的 `User Input → LLM → Output`，比一開始就把所有決定交給 Agent 容易除錯。以下步驟依 Dify 的[模型供應商設定](https://docs.dify.ai/en/cloud/use-dify/workspace/model-providers)、[Workflow 與 Chatflow 說明](https://docs.dify.ai/en/cloud/use-dify/build/workflow-chatflow)及[發布文件](https://docs.dify.ai/en/cloud/use-dify/publish/)整理：

1. 到 **Integrations → Model Provider** 安裝一個 provider，按 **Setup** 填入 API key。Dify Cloud 也可使用支援 AI credits 的模型。只有 workspace owner 與 admin 能管理 provider。
2. 到 **Studio → Create from blank → Workflow** 建立應用。這個案例一次輸入、一次輸出，所以選 Workflow；需要多輪對話時才改選 Chatflow。
3. 在 **User Input** 新增必填的 Paragraph 欄位，variable name 設為 `question`。
4. 接一個 **LLM** node，選剛設定的模型。System prompt 填入「你是技術編輯，請用三點回答，不確定時明說」，User prompt 引用 `{{question}}`。
5. 接一個 **Output** node，新增名為 `answer` 的輸出，來源選 LLM node 的 `text`。Output 欄位名稱會直接成為 API response 的 key；沒有 Output 的 branch 即使成功也不會回傳資料。
6. 按 **Test Run**，輸入「低程式碼 Agent 平台的主要風險是什麼？」。預期看到三點回答，run 狀態為 succeeded，而且 Output 中有 `answer`。
7. 按 **Publish** 啟用最新版本，再從應用內建立 API key。Dify 的 API 只執行已發布 Workflow；改完畫布但沒重新發布，API 仍跑舊版本。

用 app API key 呼叫已發布的 Workflow：

```bash
export DIFY_API_KEY="your-app-api-key"

curl --request POST 'https://api.dify.ai/v1/workflows/run' \
  --header "Authorization: Bearer ${DIFY_API_KEY}" \
  --header 'Content-Type: application/json' \
  --data '{
    "inputs": {
      "question": "低程式碼 Agent 平台的主要風險是什麼？"
    },
    "response_mode": "blocking",
    "user": "demo-reader-001"
  }'
```

[Run Workflow API](https://docs.dify.ai/en/api-reference/workflow-runs/run-workflow) 成功時會回傳 `data.status: "succeeded"`，答案位於 `data.outputs.answer`。正式產品應依官方 [API 入門](https://docs.dify.ai/en/api-reference/guides/get-started)把 key 留在後端，不能放進瀏覽器或行動 App。

常見錯誤可以先從四個地方查：

- `provider_not_initialize`：provider 未完成設定，或沒有有效 credential。
- `invalid_param`：`question`、`user` 等欄位名稱或型別不符，或 Workflow 尚未發布。
- 執行成功卻沒有答案：Output node 沒有把 LLM 的 `text` 映射成 `answer`。
- Studio 測試是新版、API 卻是舊版：修改後沒有再次 Publish。

## 何時把 LLM node 換成 Agent

上面的流程不需要 Agent：每一步都已知，只要生成答案。當模型必須根據中間結果自行選工具、決定下一步或反覆嘗試時，再依[官方 Agent node 文件](https://docs.dify.ai/en/cloud/use-dify/nodes/agent)把 LLM node 換成 Agent。選擇與模型相容的 strategy、加入已授權的工具，把 `question` 接到 Query，設定 Max Iterations，最後將 Agent 的 Final Answer 接到 Output。

先限制工具數與 iteration，再測「工具回空值」「credential 過期」「模型一直選錯工具」。低程式碼只省下畫流程的程式碼，不會自動替 Agent 定義停止條件。

## Plugin：擴充點比直接改核心更重要

[Dify Plugin](https://docs.dify.ai/en/develop-plugin/getting-started/getting-started-dify-plugin) 可擴充 model、tool、agent strategy、Extension (Endpoint)、datasource 與 trigger。官方的[類型選擇指南](https://docs.dify.ai/en/develop-plugin/getting-started/choose-plugin-type)給出清楚邊界。Workflow/Agent 呼叫外部動作用 Tool；外部服務以 HTTP 呼叫 Dify 用 Extension (Endpoint)；上游事件啟動 Workflow 用 Trigger；文件進知識庫用 Datasource。

```bash
dify plugin init
```

優先寫 plugin，而不是 fork 核心程式碼。升級時，穩定的 plugin contract 比私人 patch 容易驗證。不過 plugin 會接觸 secret 與資料，安裝前仍要檢查來源、權限、網路存取與 privacy 說明。

## 發布：同一流程可以有多個入口

依[官方發布總覽](https://docs.dify.ai/en/cloud/use-dify/publish/)，完成的應用可透過 Web UI、API、網站 embed 或 MCP Server 對外使用。這讓 prototype 不必重寫後端才能接產品，但正式環境仍應由自己的 gateway 處理 authentication、tenant mapping、rate limit 與 audit log。不要把平台 API key 直接交給瀏覽器。

應用版本、workflow、knowledge、provider、plugin 與環境變數共同決定行為。發布前應固定一組驗收問題與預期引用，更新其中任一層後重跑；「畫布看起來沒變」不代表模型或知識輸出沒變。

## 自架：Compose 是起點，不是營運方案

官方 [Docker 部署說明](https://github.com/langgenius/dify/blob/main/docker/README.md)以 `docker compose up -d` 啟動，並透過 `.env` 設定資料庫、向量庫與其他服務。完整部署包含多個 stateful component。團隊要處理 volume、備份、升級、worker 容量、plugin 執行、HTTPS 與 observability。

```bash
git clone https://github.com/langgenius/dify.git
cd dify/docker
cp .env.example .env
docker compose up -d
```

實際上線前請依當下官方文件檢查相依版本與安全設定。不要把預設 Compose 直接暴露到公網，也不要在未演練資料庫、物件儲存與向量庫還原前宣稱平台可復原。

## DSL 能搬應用定義，不等於完整平台備份

Dify 的 [CLI app 文件](https://docs.dify.ai/en/cli/reference/apps)可用 `difyctl export studio-app` 將應用定義匯出為 DSL YAML。Workflow 與 Chatflow 預設匯出目前 draft；若要指定已發布版本，需帶 `--workflow-id`。匯入後同樣先寫入 draft，必須再次 Publish 才會影響 API。

```bash
difyctl export studio-app <app-id> --output ./app.yaml
difyctl import studio-app --from-file ./app.yaml --name "App staging"
```

官方 CLI 另提供 `--include-secret` 匯出加密的 secret，匯入時也會列出尚未安裝的 plugin dependency。營運上我會把 DSL 視為「應用定義的版本與搬移格式」，不把它當成整個 workspace 已備份的證明。Provider 是否可用、Knowledge 資料、plugin、資料庫、物件儲存與向量庫仍要分別盤點並演練還原。這是根據官方 DSL 邊界採取的營運判斷，不是 Dify 對完整備份的承諾。

| 選項 | 產品重心 | 優先選它的情境 |
| --- | --- | --- |
| Dify | 模型、Knowledge、Agent、Workflow 與應用發布在共同 workspace | PM、內容與工程要共同維護 AI 應用 |
| [n8n](/posts/ai/2026-08-22-n8n-agent-automation) | [通用 workflow automation](https://docs.n8n.io/)，AI 是其中一組 node 與能力 | Agent 要接 CRM、Email、ERP 等既有商業流程 |
| [Flowise](/posts/ai/2026-08-22-flowise-ai-agent-builder) | [Assistant、Chatflow、Agentflow](https://docs.flowiseai.com/) 等 LLM/Agent visual builder | 要快速組 RAG、單 Agent 或多 Agent flow，並保留較直接的 LLM 元件感 |

## 整體來說

Dify 的價值是把「做一個 RAG demo」擴成「營運多個 AI 應用」：模型、知識、流程、工具與發布都在同一平面。這對需要 PM、內容與工程協作的團隊很實用。代價是平台本身成為產品的一部分，升級、權限、備份與 plugin 供應鏈都要治理。

先完成上面的最小 Workflow，再加入 knowledge retrieval、錯誤分支或 Agent；接著分別演練 DSL 匯入、平台資料還原與模型切換。若非工程角色真的能安全地完成日常變更，而工程團隊仍能測試及追蹤，Dify 才發揮它的優勢。

## 更新紀錄

- 2026-08-22：補上最小 Studio／API 實作、Dify／n8n／Flowise 定位邊界，並釐清 DSL 與平台備份的差別。

## 參考資料

- [Dify 官方 repository](https://github.com/langgenius/dify)
- [Dify Docker 部署說明](https://github.com/langgenius/dify/blob/main/docker/README.md)
- [Dify Plugin](https://docs.dify.ai/en/develop-plugin/getting-started/getting-started-dify-plugin)
- [Dify Plugin 類型選擇指南](https://docs.dify.ai/en/develop-plugin/getting-started/choose-plugin-type)
- [Dify Datasource Plugin](https://docs.dify.ai/en/develop-plugin/dev-guides-and-walkthroughs/datasource-plugin)
- [Dify Model API Interface](https://docs.dify.ai/en/develop-plugin/features-and-specs/plugin-types/model-schema)
- [Dify Model Providers](https://docs.dify.ai/en/cloud/use-dify/workspace/model-providers)
- [Dify Workflow 與 Chatflow](https://docs.dify.ai/en/cloud/use-dify/build/workflow-chatflow)
- [Dify LLM node](https://docs.dify.ai/en/cloud/use-dify/nodes/llm)
- [Dify Output node](https://docs.dify.ai/en/cloud/use-dify/nodes/output)
- [Dify Agent node](https://docs.dify.ai/en/cloud/use-dify/nodes/agent)
- [Dify 發布總覽](https://docs.dify.ai/en/cloud/use-dify/publish/)
- [Dify API 入門](https://docs.dify.ai/en/api-reference/guides/get-started)
- [Dify Run Workflow API](https://docs.dify.ai/en/api-reference/workflow-runs/run-workflow)
- [Dify CLI Apps：執行、匯出與匯入](https://docs.dify.ai/en/cli/reference/apps)
- [n8n 官方文件](https://docs.n8n.io/)
- [Flowise 官方文件](https://docs.flowiseai.com/)
