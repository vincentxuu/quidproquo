---
title: "DeerFlow：字節跳動開源的超級代理框架，把 Agent 做成可長跑的研究系統"
date: 2026-04-21
type: project
category: tech
tags: [deer-flow, bytedance, agent, langgraph, langchain, ai-agent, open-source, harness]
lang: zh-TW
tldr: "DeerFlow 是字節跳動開源的 Super Agent Harness，基於 Python 3.12 + LangGraph，透過沙箱、長期記憶、子代理、技能與訊息閘道協調長時任務。2026 年 2 月登上 GitHub 趨勢榜第一，目前超過 63,000 星，支援 Telegram/Slack/飛書等 IM、Claude Code 整合與多種搜尋後端。"
description: "DeerFlow 是字節跳動開源的超級代理框架，主打深度研究、子代理、長期記憶與沙箱執行。本文介紹它的架構、核心特性、與 LangGraph 原生方案的差異，以及適合哪些團隊採用。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-04-21-bytedance-deer-flow-super-agent-harness-en)

過去一年 Agent 框架遍地開花，但「能跑 10 分鐘的 demo」和「能跑 10 小時的研究任務」是兩件完全不同的事。DeerFlow 就是字節跳動針對後者給出的答案——一個結合沙箱、長期記憶、子代理、技能與 IM 閘道的完整 Harness。這篇介紹它的定位、架構選擇，以及和直接用 LangGraph 比起來多做了什麼。

## DeerFlow 是什麼

DeerFlow 是字節跳動 2026 年初開源的 **Super Agent Harness**（超級代理框架），定位是「深度探索與高效研究流程框架」，專門為執行長期、複雜的任務而設計。2026 年 2 月登上 GitHub 趨勢榜第一名，目前累積超過 63,000 星。

和一般 Agent 框架不同，DeerFlow 不只是「讓 LLM 呼叫工具」，而是把執行 Agent 需要的整套基礎設施都打包進來：沙箱、記憶、工具調度、子代理、訊息閘道、可觀測性。官方定位是「透過沙箱、記憶體、工具、技能、子代理與訊息閘道來協調執行各種複雜任務」。

主要能力分三塊：

- **研究與分析**：深度資訊蒐集與彙整
- **程式碼生成**：自動化編程任務
- **內容創作**：報告、簡報、網頁、影像與影片生成

## 技術架構

後端用 Python 3.12+，基於 **LangChain 與 LangGraph**；前端用 Node.js 22+ 搭配 TypeScript。整個 repo 的語言比例大約是 Python 69%、TypeScript 19%。

運行模式分兩種：

- **標準模式**：獨立 LangGraph 伺服器 + Gateway API，適合生產環境，代理運算和閘道分離
- **閘道模式**：把代理直接嵌入閘道服務，部署簡單但擴展性較差

部署方式推薦 Docker，也支援本地開發與 Kubernetes Pod。資源需求上，開發環境最低 4vCPU / 8GB RAM / 20GB SSD，生產環境建議 8–16vCPU / 16–32GB RAM。

## 核心特性

### 技能與工具系統

DeerFlow 提供「可漸進載入的結構化能力模組」，內建研究、報告生成、簡報製作、網頁與影像生成等技能。每個技能是一組工具、提示詞與流程的封裝，需要時才載入，避免一次把所有能力塞進 context。

你也可以寫自訂技能，或是透過 **MCP（Model Context Protocol）伺服器**擴展能力——這點和 Claude Code、Cursor 等工具共用同一套生態。

### 子代理架構

主代理可以動態生成多個子代理，每個子代理擁有獨立的上下文與工具集，支援平行執行與結果彙整。這是做深度研究的關鍵：與其讓主代理把 10 個搜尋結果全部塞進 context，不如派 5 個子代理各自研究一個子題，最後只把摘要回傳。

### 三種沙箱執行模式

1. **本地執行**：直接在主機跑，速度快但隔離性差
2. **Docker 隔離**：每個任務一個 container，平衡速度與安全
3. **Kubernetes Pod**：透過 provisioner 服務動態配置，適合大規模部署

沙箱機制讓 Agent 可以安全地執行 shell 指令、寫檔、跑程式碼，而不用擔心污染主機環境。

### 長期記憶

系統會建構跨會話的持久化記憶，學習用戶偏好與工作流程，資料存在本地。這解決了一般 Agent「每次對話都從零開始」的問題——你第二次問它「幫我整理競品研究」時，它會記得你上次在意的是哪幾個維度。

### 上下文工程

DeerFlow 在 context 管理上做了幾件事：隔離的子代理上下文、智能摘要、中間結果卸載（把不常用的結果寫到檔案系統而不是留在 context）、嚴格的工具呼叫恢復機制。對長跑任務來說，這些細節決定了跑到第 50 輪還能不能維持連貫性。

## 整合生態

DeerFlow 不是孤立的系統，它特別重視和既有 IM 與觀測工具的整合：

| 類別 | 支援項目 |
|------|---------|
| IM 通道 | Telegram、Slack、飛書/Lark、WeChat、WeCom |
| 可觀測性 | LangSmith、Langfuse |
| 搜尋 | Tavily、字節自研 InfoQuest |
| 模型 | OpenAI、OpenRouter、本地 vLLM 等 |
| Coding Agent | 提供 `claude-to-deerflow` 技能，從 Claude Code 直接與 DeerFlow 實例互動 |

Claude Code 整合這點蠻有意思——你可以在 Claude Code 裡呼叫 DeerFlow 跑長時任務，拿回結果繼續用。等於把 Claude Code 的互動式工作流和 DeerFlow 的長跑能力串起來。

## 快速啟動

官方最推薦的是 Docker 部署：

```bash
git clone https://github.com/bytedance/deer-flow.git
cd deer-flow

make setup          # 互動式配置精靈，設定 API key、模型等
make docker-init    # 初始化 Docker 環境
make docker-start   # 啟動所有服務
```

本地開發的話：

```bash
make check      # 驗證環境（Python、Node 版本等）
make install    # 安裝依賴
make dev        # 啟動開發服務
```

## 和直接用 LangGraph 比起來差在哪

如果你已經在用 LangGraph，為什麼還要用 DeerFlow？幾個差異：

- **沙箱是內建的**：LangGraph 只管圖執行，Docker/K8s 隔離要自己做
- **IM 閘道現成**：Telegram/Slack/飛書整合不用自己寫
- **長期記憶與偏好學習**：LangGraph 的 checkpointer 是為 state 續跑設計的，不是為跨會話偏好設計
- **技能系統**：把工具、提示詞、流程打包成一個單位，而不是散落的 tool functions
- **可觀測性預接**：LangSmith/Langfuse 開箱即用

反過來說，如果你只是要做一個輕量的工作流（比如「查資料→寫報告」這種三步驟的），直接用 LangGraph 可能更單純。DeerFlow 的設計目標是**長跑、多子代理、需要 IM 介面**的任務。

## 安全考量

官方特別強調，DeerFlow **應該部署在本地可信環境中**。跨網路部署需要配置 IP 白名單、身份驗證閘道與網路隔離。系統雖然有 XSS 防護，生成的 artifacts 會強制作為下載處理，但因為它能執行任意程式碼，暴露在公網上風險很高。

## 適合哪些團隊

DeerFlow 比較適合：

1. **需要做深度研究自動化的團隊**：競品分析、市場掃描、技術調研
2. **要把 Agent 接進 IM 的組織**：把研究結果直接丟進飛書群
3. **自建 LLM 基礎設施的公司**：完整掌控資料與執行環境
4. **想在本地跑長時任務**：雲端 API agent 跑幾小時的 token 費用會很可觀

不太適合：

- 只是要做一個 chatbot 或輕量 RAG
- 團隊沒有維運 Docker/K8s 的能力
- 想要「一個 API 就搞定」的託管服務

## 整體來說

DeerFlow 的價值在於它把 **長時任務 Agent 需要的基礎設施都打包**了——沙箱、記憶、子代理、IM 閘道、觀測。你不用再自己拼一遍，但代價是要接受它的技術選擇（LangGraph、Python、Docker/K8s）和一定的部署複雜度。

在 2026 年這個「Agent 框架還在爆炸」的階段，DeerFlow 選擇了一條比較重但比較完整的路線——不追求極簡，也不只做一個抽象層，而是把 Harness 本身當成產品。對於要認真部署 Agent 系統的團隊，這種取向值得一試。

## 參考資料

- [bytedance/deer-flow — GitHub Repository](https://github.com/bytedance/deer-flow)
- [LangChain 官方文件](https://python.langchain.com/)
- [LangGraph 官方文件](https://langchain-ai.github.io/langgraph/)
- [Model Context Protocol 規範](https://modelcontextprotocol.io/)
- [Tavily Search API](https://tavily.com/)
- [LangSmith 可觀測性平台](https://smith.langchain.com/)
- [Langfuse 開源觀測工具](https://langfuse.com/)
