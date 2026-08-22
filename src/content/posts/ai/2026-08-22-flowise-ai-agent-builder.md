---
title: "Flowise 深入介紹：從 Assistant、Chatflow、Agentflow 到 EOL 遷移判斷"
date: 2026-08-22
category: ai
type: deep-dive
tags: [flowise, low-code, ai-agent, workflow, mcp]
lang: zh-TW
tldr: "Flowise 用 Assistant、Chatflow 與 Agentflow 三個入口涵蓋簡易助理、單一 Agent 和多 Agent 編排；但官方已在 2026 年 8 月封存 repository，並排定 8 月 31 日 EOL，新案不應在沒有維護 fork 與遷移方案時採用。"
description: "沿產品生命週期介紹 Flowise 的三種視覺化 builder、nodes、tools、memory、Prediction API、embedding、部署與 Custom MCP 安全邊界，並說明 EOL 後的選型判斷。"
draft: true
---

> 🌏 [English version](/posts/ai/2026-08-22-flowise-ai-agent-builder-en)

[Flowise](https://docs.flowiseai.com/) 是用視覺化畫布建立 LLM workflow 與 AI Agent 的開放原始碼平台。它的核心不是通用 SaaS 自動化，也不是包辦知識庫、營運後台與應用發布的完整產品平台。它把模型、retriever、memory、tool、條件、迴圈與人工確認組成可執行的 AI 流程。

但這篇不能只介紹功能。Flowise 團隊已在[官方公告](https://github.com/FlowiseAI/Flowise/discussions/6727)列出終止時程：

- 2026 年 7 月 29 日停止開發。
- 2026 年 8 月 13 日封存 repository。
- 2026 年 8 月 31 日 EOL；以本文日期來說，這仍是尚未生效的排定時程。

Apache 2.0 程式碼仍可 fork，不等於原專案會繼續收到功能與安全更新。以下因此同時回答兩個問題：Flowise 原本怎麼用，以及現在還應不應該用。

## 第一步：從 Assistant、Chatflow、Agentflow 選入口

Flowise 提供三種 builder，差異不是畫布長得不同，而是你願意管理多少流程細節。

| 入口 | 核心能力 | 適合先做什麼 |
| --- | --- | --- |
| Assistant | 指令、工具與上傳文件 RAG | 先驗證一個問答助理是否有價值 |
| Chatflow | 單一 Agent、chatbot、retriever 與 reranker 等元件 | 明確控制一條對話或 RAG pipeline |
| Agentflow | 條件、迴圈、人工確認、共享 state 與多 Agent | 建立需要編排與恢復的複雜流程 |

[官方介紹](https://docs.flowiseai.com/)把 Agentflow 定義為 Assistant 與 Chatflow 的超集合。但不要因此一律從 Agentflow 開始。今晚先把需求寫成一句話：「輸入是什麼、允許哪些動作、輸出要長什麼樣子？」只有問答與少量工具就從 Assistant 開始。需要自己安排 retrieval 與模型節點才進 Chatflow；有分支、迴圈、人工核准或多 Agent 才用 Agentflow。

這也是 Flowise 與兩個常見替代方案的分界。[n8n](/posts/ai/2026-08-22-n8n-agent-automation) 是 automation-first：排程、webhook 和大量商務系統整合是主場，AI 是流程裡的一部分。[Dify](/posts/ai/2026-08-22-dify-ai-app-platform) 是 application-platform：Knowledge、workflow、plugin 與應用發布共用一個 workspace。Flowise 則是 visual LLM/agent builder，優先處理模型、檢索、工具與 Agent 編排。

## 第二步：把 nodes、tools 與 memory 接成可控流程

[Agentflow V2](https://docs.flowiseai.com/using-flowise/agentflowv2)把節點拆成明確的執行單位。LLM Node 負責一次模型呼叫；Agent Node 讓模型依目標選擇 tool 或 Document Store；Tool Node 則在固定位置執行指定工具，不讓模型臨場決定。能確定要呼叫哪個 API 時，優先用 Tool 或 HTTP Node；只有工具選擇本身需要推理時才交給 Agent Node。

Memory 也不是單一開關。LLM 與 Agent 可以讀取對話歷史，並以完整、視窗或摘要方式控制上下文；`$flow.state` 則是一次執行內共享的暫存 key-value state。所有 state key 要先在 Start Node 宣告，流程結束後就消失。要跨 session 保留對話或業務資料，仍需另外選擇持久化 memory、資料庫或外部服務。

一條較安全的客服流程可以長這樣：

```text
Start
  -> Retriever（只讀知識庫）
  -> LLM（產生有來源的草稿）
  -> Condition（是否涉及退款）
       -> 否：Direct Reply
       -> 是：Human Input
                -> 核准：Tool（呼叫退款 API）
                -> 拒絕：Direct Reply
```

這裡最重要的不是多一個 Agent，而是把有副作用的動作放在固定 Tool Node 後面，並在前面加人工確認。Flowise 的 Agent Node 也能替個別 tool 設定 Require Human Input；真正上線前，還要測 tool 逾時、參數缺漏、retrieval 回空與使用者拒絕四條路徑。

## 第三步：接 knowledge、embedding 與應用 API

Agent Node 可以連 Flowise 的 Document Store，也可以直接選外部 vector store 與相容的 embedding model。兩者的 embedding 維度與索引設定必須一致；換 embedding model 不是改下拉選單而已，通常還要重建索引。把來源文件、切分設定、embedding model、vector store namespace 與同步時間一起記錄，才能重現一次 retrieval 結果。

完成流程後，產品通常透過 Prediction API 呼叫，而不是讓使用者直接進 Flowise 畫布。官方 API 的主要入口是 `POST /api/v1/prediction/{id}`：

```bash
curl -X POST "https://flowise.example.com/api/v1/prediction/FLOW_ID" \
  -H "Authorization: Bearer $FLOWISE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"question":"退款政策有哪些限制？","streaming":false}'
```

Flow 預設可能可由知道 ID 的人呼叫；[官方 flow authorization 文件](https://docs.flowiseai.com/configuration/authorization/chatflow-level)建議替 flow 指派 API key。正式產品仍應在自己的 gateway 做使用者驗證、tenant mapping、配額與稽核，不要把平台 API key 放進瀏覽器程式碼。`overrideConfig` 能在 runtime 改設定，也應只開放明確白名單欄位，不能把整個 node configuration 交給外部輸入。

## 第四步：把部署當成一個服務營運

單機預設使用 SQLite 與本機檔案，適合試作，不是可直接複製到 production 的拓樸。[官方 production 文件](https://docs.flowiseai.com/configuration/running-in-production)建議高流量環境採 Queue mode，讓 main server 接請求、Redis 傳遞 job、worker 執行流程，並改用 PostgreSQL。資料庫、上傳檔案、vector store、Redis 與 credential encryption key 都要納入備份與還原演練。

[環境變數文件](https://docs.flowiseai.com/configuration/environment-variables)也揭露幾個常被忽略的邊界：Flowise 會用 encryption key 加密第三方 credential；若 key 遺失，即使資料庫還在也可能無法解密。公開 flow 要加 rate limit，反向代理後必須校正 `NUMBER_OF_PROXIES`。Community node、custom JavaScript dependency、HTTP 可達範圍與允許的 model 清單，也都應由平台管理者限制。

最低限度要演練三件事：從備份還原資料庫與加密金鑰、worker 中斷後重送或終止 job、升級後重跑固定的 regression cases。畫布能開啟，只代表 UI 還活著，不代表 credential、retrieval 和副作用工具仍然正確。

## Custom MCP 與任意程式執行是權限邊界

Flowise 的 Custom Tool 與 Custom Function 會在 server-side 執行 JavaScript；Custom MCP 的 stdio transport 更會啟動本機行程。[官方 Tools & MCP 教學](https://docs.flowiseai.com/tutorials/tools-and-mcp)已把 Streamable HTTP 列為建議方式，而非雲端部署的 stdio。這些不是一般「拖拉元件」，而是接近程式碼部署與行程啟動的管理權限。

這個風險不是理論問題。[官方安全公告](https://github.com/FlowiseAI/Flowise/security/advisories/GHSA-g98q-rm45-q9h8)記錄 Custom MCP stdio 設定可被已驗證使用者利用而取得 RCE，影響至 3.1.2。

3.1.3 修補了這項漏洞。

最新的[官方 3.1.4 release](https://github.com/FlowiseAI/Flowise/releases/tag/flowise%403.1.4)又包含 Custom MCP 指令 allowlist 與多項 authorization 修正。更完整的事件拆解可看站內[Flowise Custom MCP 資安警報](/posts/daily/2026-08-18-security-flowise-custom-mcp-command-injection)。

既有部署至少要固定在 3.1.4、停用不需要的 node，並保持 `CUSTOM_MCP_SECURITY_CHECK=true`。Production 優先使用遠端 HTTP MCP，也要把 Flowise worker 放進限制檔案系統與對外連線的隔離環境。更關鍵的是：只讓少數管理者建立 Custom Tool、Custom Function 與 Custom MCP。安全檢查是最後一道防線，不能代替最小權限。

## EOL 之後怎麼判斷

對新案，結論很直接：不要把已封存、即將 EOL 的 Flowise 當成預設 production 平台。除非團隊已選定可信任且持續維護的 fork，願意自行接安全補丁、相依套件更新與模型 API 變更，並且先寫好遷移出口。

對既有部署，先匯出 flow 定義，再盤點 credential、variables、Document Store、vector index、上傳檔案與外部 API 依賴。接著按流程的真正重心分類。純 webhook／SaaS 串接優先移往 n8n；Knowledge 與應用發布高度整合者評估 Dify。需要工程團隊精細控制 Agent state 與 recovery 的流程，則評估程式碼優先的 Agent framework。不要只找「畫布看起來最像」的替代品，真正的遷移單位是 state、tool contract 與資料所有權。

Flowise 仍是理解視覺化 Agent 編排的好教材，也能在隔離環境中維持既有流程。它現在最大的限制不再只是技術取捨，而是官方維護已進入終點。新導入的停損條件應寫在第一天：若沒有活躍 maintainer、可追蹤的安全修補與可重建的部署，就不進 production。

## 參考資料

- [Flowise 官方介紹](https://docs.flowiseai.com/)
- [Flowise Agentflow V2](https://docs.flowiseai.com/using-flowise/agentflowv2)
- [Flowise Tools & MCP](https://docs.flowiseai.com/tutorials/tools-and-mcp)
- [Flowise Prediction API](https://docs.flowiseai.com/api-reference/prediction)
- [Flowise flow-level authorization](https://docs.flowiseai.com/configuration/authorization/chatflow-level)
- [Flowise production deployment](https://docs.flowiseai.com/configuration/running-in-production)
- [Flowise environment variables and security configuration](https://docs.flowiseai.com/configuration/environment-variables)
- [Flowise 官方 EOL 公告](https://github.com/FlowiseAI/Flowise/discussions/6727)
- [Flowise 3.1.4 release](https://github.com/FlowiseAI/Flowise/releases/tag/flowise%403.1.4)
- [GHSA-g98q-rm45-q9h8：Custom MCP RCE](https://github.com/FlowiseAI/Flowise/security/advisories/GHSA-g98q-rm45-q9h8)
