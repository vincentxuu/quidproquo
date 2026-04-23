---
title: "2026 年 15 個值得關注的 Agent 框架"
date: 2026-04-01
type: guide
category: ai
tags: [agent, framework, langgraph, crewai, openai, anthropic, google-adk, mastra, openclaw, dify, n8n, llamaindex, metagpt, smolagents, agno, pydantic-ai]
lang: zh-TW
tldr: "按 GitHub Stars 排序，盤點 2026 年 15 個主流 AI Agent 框架的定位、特色與適用場景。不是排名，是地圖。"
description: "2026 年 AI Agent 框架百花齊放，從 343k stars 的 OpenClaw 到各大廠官方 SDK。這篇按 GitHub Stars 排序，整理 15 個活躍框架的核心差異與選擇建議。"
draft: false
---

2026 年，每家大廠都有自己的 Agent 框架，開源社群也不斷冒出新選手。這篇不是「最佳排名」——GitHub Stars 不等於品質，下載量不等於適合你。但 stars 至少反映了社群關注度，是個合理的起點。

以下 15 個框架都在活躍開發中，按 GitHub Stars 排序。每個附上定位、核心特色、適用場景。

---

## 1. OpenClaw — ~343k ⭐

**Repo:** [openclaw/openclaw](https://github.com/openclaw/openclaw)｜**語言:** TypeScript｜**授權:** MIT

2026 年最大的現象級專案。由 PSPDFKit 創辦人 Peter Steinberger 開發，2025 年 11 月上線，四個月內從 9k 衝到 343k stars，超越 React 成為 GitHub 上星數最高的非聚合型軟體專案。Nvidia CEO 黃仁勳稱之為「可能是有史以來最重要的軟體發布」。

**核心特色：**
- 以訊息 app 為介面（WhatsApp、Telegram、Discord、Slack）
- 本地優先，記憶以 Markdown 檔案存在你的機器上
- Heartbeat daemon 可自主排程執行任務
- ClawHub 技能市集，13,000+ 社群技能
- 支援所有主流模型（Claude、GPT、Gemini、Ollama）

**適用場景：** 個人 AI 助理、透過聊天介面操作本機任務、快速自動化。

**要注意的：** 安全性是大問題——2 個月內 9+ CVE，42,665 個暴露實例。企業環境需要額外的安全層（如 Nvidia 的 NemoClaw）。

---

## 2. n8n — ~182k ⭐

**Repo:** [n8n-io/n8n](https://github.com/n8n-io/n8n)｜**語言:** TypeScript｜**授權:** Fair-code (Sustainable Use License)

視覺化工作流自動化平台，400+ 整合，2026 年全面加入 AI agent 能力。不是傳統意義的 agent framework，但它讓不寫程式的人也能建 agent pipeline，而且自架方案完全控制資料。

**核心特色：**
- 拖拉式 agent 工作流設計
- 400+ 內建整合（Gmail、Slack、資料庫、API）
- 可自架（self-host），資料不離開你的環境
- 支援自訂 code node 混合視覺化流程
- 200k+ 社群成員

**適用場景：** 非工程師的 AI 自動化、企業內部流程自動化、快速串接多個服務的 agent。

**跟 Dify 的差別：** n8n 偏通用工作流自動化（不只 AI），Dify 專注 LLM 應用。

---

## 3. Dify — ~134k ⭐

**Repo:** [langgenius/dify](https://github.com/langgenius/dify)｜**語言:** Python / TypeScript｜**授權:** Apache 2.0

低代碼 LLM 應用開發平台。2026 年 3 月拿到 $30M Pre-A 輪，280 家企業、1.4M 部署。內建 RAG pipeline 管理、工作流編排、多模型支援，原生整合 MCP。

**核心特色：**
- 視覺化工作流 builder
- 內建 RAG pipeline 管理
- 支援 OpenAI、Anthropic 等多個模型供應商
- 原生 MCP 整合（可把 Dify agent 暴露為 MCP server）
- 可自架或用 Dify Cloud

**適用場景：** 團隊快速建立 LLM 應用 MVP、domain expert 自己做 agent、不想從零搭建 RAG。

---

## 4. LangChain — ~126k ⭐

**Repo:** [langchain-ai/langchain](https://github.com/langchain-ai/langchain)｜**語言:** Python / JavaScript｜**授權:** MIT

LLM 應用開發的瑞士刀。最老牌、生態最完整的框架，支援 chains、agents、memory、retrieval、tool use。2026 年的定位偏向「基礎設施層」——很多其他框架（包括 CrewAI、LlamaIndex）底層都用了 LangChain 的元件。

**核心特色：**
- 模組化元件：chains、agents、memory、retrievers
- 龐大的整合生態（LLM、向量資料庫、工具）
- LangSmith 提供 tracing 和 evaluation
- 文件和社群資源最豐富
- Python + JS 雙語言支援

**適用場景：** 需要最大彈性的 LLM 應用、RAG 系統、作為其他框架的底層。

**跟 LangGraph 的關係：** LangChain 是元件庫，LangGraph 是編排引擎。需要複雜工作流用 LangGraph，簡單 agent 用 LangChain 就夠。

---

## 5. LlamaIndex — ~48k ⭐

**Repo:** [run-llama/llama_index](https://github.com/run-llama/llama_index)｜**語言:** Python / TypeScript｜**授權:** MIT

原本是 RAG 框架，2026 年轉型為完整的 agent 平台。官方說法：「2026 是 agent 從 workflow 變成 employee 的一年。」核心抽象是 AgentWorkflow，支援單 agent 到多 agent 團隊。

**核心特色：**
- 300+ 整合套件（LLM、embedding、向量資料庫）
- AgentWorkflow 多 agent 編排
- 內建 Agent Client Protocol (ACP) 整合
- LlamaAgents 一鍵部署文件處理 agent
- AgentFS 安全檔案系統存取

**適用場景：** 需要跟大量文件、知識庫互動的 agent、文件處理自動化（發票、合約、法規）。

---

## 6. CrewAI — ~44.6k ⭐

**Repo:** [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI)｜**語言:** Python｜**授權:** MIT｜**PyPI 月下載:** 12M+

多角色協作框架。核心概念是 Agent（角色）、Task（任務）、Crew（團隊），2-4 小時就能從概念到 prototype。60% 的 Fortune 500 公司試用過。原生支援 MCP 和 A2A 協議。

**核心特色：**
- 角色扮演式多 agent 協作
- 直覺化 API：Agent → Task → Crew
- 內建記憶系統（短期、長期、實體記憶）
- CrewAI Flows 彈性編排
- 100,000+ 開發者通過社群課程認證

**適用場景：** 多角色協作的業務自動化、內容生成 pipeline、研究分析。

**跟 LangGraph 的差別：** CrewAI 上手快、適合角色分工明確的場景；LangGraph 更適合需要精細狀態控制的複雜工作流。

---

## 7. MetaGPT — ~44k ⭐

**Repo:** [FoundationAgents/MetaGPT](https://github.com/FoundationAgents/MetaGPT)｜**語言:** Python｜**授權:** MIT

用「軟體公司」的隱喻來組織 multi-agent 系統。每個 agent 扮演產品經理、架構師、工程師等角色，模擬真實軟體開發流程。偏研究和 demo 性質，但概念有啟發性。

**核心特色：**
- 軟體公司模擬：PM → Architect → Engineer 流程
- 自動生成 PRD、設計文件、程式碼
- SOP（標準作業流程）驅動的 agent 協作
- 支援人機協作審查

**適用場景：** 自動化軟體開發流程實驗、研究用途、概念驗證。

**現實是：** 生產環境不太有人直接用 MetaGPT 開發產品，但它的多角色協作模式影響了很多後來的框架（包括 CrewAI）。

---

## 8. SmolAgents — ~26k ⭐

**Repo:** [huggingface/smolagents](https://github.com/huggingface/smolagents)｜**語言:** Python｜**授權:** Apache 2.0

Hugging Face 出品的極簡 agent 框架。核心程式碼只有約 1,000 行，但能力不弱。最大特色是 Code Agent——agent 直接寫 Python 程式碼來執行任務，比 JSON tool calling 少 30% 的步驟和 LLM 呼叫。

**核心特色：**
- 極簡：~1,000 行核心程式碼
- Code Agent 模式（agent 寫 Python 執行）
- 模型無關（支援 OpenAI、Anthropic、Ollama、HF Hub）
- 沙箱執行（E2B、Docker、Pyodide）
- 整合 MCP servers、LangChain tools、HF Hub Spaces

**適用場景：** 輕量 agent prototype、研究實驗、想要最小依賴的場景。

**207 位貢獻者，從 2025 初的 3k stars 成長到 26k，社群相當活躍。**

---

## 9. LangGraph — ~24.6k ⭐

**Repo:** [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph)｜**語言:** Python / JavaScript｜**授權:** MIT｜**PyPI 月下載:** 38M+

LangChain 團隊的 agent 編排引擎。2025 年底達到 v1.0，成為 LangChain 所有 agent 的預設 runtime。核心概念是把 agent 工作流建模成有向圖——節點是動作，邊是轉移，支援條件分支和循環。

**核心特色：**
- 狀態圖（state graph）工作流建模
- Durable execution——失敗可恢復、自動重試
- 人機協作（human-in-the-loop）
- 檢查點（checkpointing）和 time-travel debugging
- LangSmith 整合（tracing、monitoring）

**適用場景：** 複雜多步驟 agent 工作流、需要精細流程控制、生產級部署。

**Stars 只有 24k 但月下載 38M，是下載量最高的 agent 框架。Stars 低是因為很多人透過 LangChain 間接使用它。**

---

## 10. Mastra — ~22.3k ⭐

**Repo:** [mastra-ai/mastra](https://github.com/mastra-ai/mastra)｜**語言:** TypeScript｜**授權:** MIT｜**npm 週下載:** 300k+

TypeScript 原生的 agent 框架，由 Gatsby 團隊打造。2026 年 1 月從 Y Combinator W25 畢業，拿了 $13M。如果你的技術棧是 TypeScript，這是目前最成熟的選擇。

**核心特色：**
- TypeScript 從頭設計（不是 Python port）
- 連接 40+ 模型供應商
- 內建 workflows、memory、RAG、evals、tracing
- 互動式 playground 測試 agent
- 可部署到 Vercel、Cloudflare、Netlify

**適用場景：** TypeScript/Node.js 技術棧的 agent 開發、Next.js 應用整合 AI、全端 JS 專案。

---

## 11. OpenAI Agents SDK — ~20.5k ⭐

**Repo:** [openai/openai-agents-python](https://github.com/openai/openai-agents-python)｜**語言:** Python / JavaScript｜**授權:** MIT｜**PyPI 月下載:** 14.7M+

OpenAI 官方 agent 框架，2025 年 3 月發布，Swarm SDK 的正式繼承者。設計極度精簡：Agent、Tool、Handoff、Guardrail 四個核心原語。如果你已經在用 OpenAI，這是阻力最小的選擇。

**核心特色：**
- 極簡 API 設計
- Agent 間 Handoff（任務移交）機制
- 內建 Guardrails 安全護欄
- 內建 Tracing（免費）
- 支援 100+ LLM（透過 Chat Completions 相容端點）

**適用場景：** OpenAI 生態快速開發、客服 agent、多 agent 任務委派。

**雖然技術上支援其他模型，但最佳體驗還是綁 OpenAI。**

---

## 12. Google ADK — ~18.6k ⭐

**Repo:** [google/adk-python](https://github.com/google/adk-python)｜**語言:** Python / TypeScript / Go / Java｜**授權:** Apache 2.0

Google 官方 agent 開發工具包，2025 年 Cloud Next 大會發布。最大亮點是 A2A（Agent-to-Agent）協議——讓你的 agent 能跟其他框架建的 agent 對話，50+ 合作夥伴（Salesforce、ServiceNow 等）。

**核心特色：**
- 四種語言支援（Python、TypeScript、Go、Java）
- A2A 協議跨框架 agent 通訊
- 原生 Gemini 多模態支援（文字、圖片、音訊、影片）
- Workflow agents（Sequential、Parallel、Loop）
- 可部署到 Vertex AI Agent Engine

**適用場景：** Google Cloud 生態、多模態 agent、需要跨框架 agent 互操作。

---

## 13. Agno — ~18.5k ⭐

**Repo:** [agno-agi/agno](https://github.com/agno-agi/agno)｜**語言:** Python｜**授權:** Apache 2.0

原名 Phidata，2025 年 1 月更名為 Agno（希臘文「純粹」）。設計哲學是「no graphs, chains, or convoluted patterns——just pure Python」。Agent 實例化 <5μs，記憶體用量比 LangGraph 低 50 倍。

**核心特色：**
- 極速：agent 實例化 <5μs
- 極低記憶體用量
- 多模態支援（文字、圖片、音訊、影片）
- 100+ 整合、內建 Agent UI
- Team 模式多 agent 協作

**適用場景：** 需要極致效能的 agent、快速原型開發、多模態應用。

---

## 14. Pydantic AI — ~16k ⭐

**Repo:** [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai)｜**語言:** Python｜**授權:** MIT

Pydantic 團隊打造，目標是把 FastAPI 的開發體驗帶到 agent 開發。最大賣點是型別安全——把整類錯誤從 runtime 拉到 write-time。模型無關，支援幾乎所有主流 LLM。

**核心特色：**
- 型別安全的 agent 開發（IDE 自動補全、type checking）
- 模型無關（OpenAI、Anthropic、Gemini、DeepSeek、Ollama 等）
- Capabilities 模組：可組合、可複用的 agent 行為單元
- Pydantic Logfire 整合（OpenTelemetry 可觀測性）
- AgentSpec 支援從 YAML/JSON 載入 agent

**適用場景：** 重視型別安全的生產應用、已用 Pydantic/FastAPI 的專案、需要結構化輸出。

---

## 15. Claude Agent SDK — 快速成長中 ⭐

**Repo:** [anthropics/claude-agent-sdk-python](https://github.com/anthropics/claude-agent-sdk-python)（Python）/ [anthropics/claude-agent-sdk](https://github.com/anthropics/claude-agent-sdk)（TypeScript）｜**授權:** MIT

Anthropic 官方 SDK，驅動 Claude Code 的同一個 agent harness。2026 年 1 月從 Claude Code SDK 更名為 Claude Agent SDK，反映更廣泛的願景。星數雖然不是最高，但它驅動了 2026 年最被廣泛使用的 AI 編碼工具之一。

**核心特色：**
- Claude Code 同款 agent 引擎
- 原生 MCP（Model Context Protocol）支援
- 自訂工具和 hooks（Python in-process MCP servers）
- Extended thinking 整合
- V2 Session API 支援多輪對話和 session 持久化

**適用場景：** 基於 Claude 的 agent 應用、安全關鍵場景、程式碼自動化。

**綁定 Claude 模型，但如果你本來就用 Claude，這是最原生的選擇。**

---

## 怎麼選

不存在「最好的框架」，只有最適合你場景的：

| 你的情況 | 建議 |
|---|---|
| TypeScript 技術棧 | Mastra |
| 已經用 OpenAI | OpenAI Agents SDK |
| 已經用 Claude | Claude Agent SDK |
| Google Cloud 生態 | Google ADK |
| 需要複雜狀態工作流 | LangGraph |
| 多角色團隊協作 | CrewAI |
| 不想寫程式 | Dify 或 n8n |
| 要最小依賴 | SmolAgents |
| 重視型別安全 | Pydantic AI |
| 要極致效能 | Agno |
| 跟大量文件互動 | LlamaIndex |
| 想要最大彈性 | LangChain |

### 關於 model lock-in

OpenAI Agents SDK 綁 OpenAI，Claude Agent SDK 綁 Claude，Google ADK 對 Gemini 最佳化。LangGraph、CrewAI、Pydantic AI、Mastra 是模型無關的。如果你預期會換模型，選後者。

### 關於 MCP

2026 年幾乎所有主流框架都支援 MCP（Model Context Protocol），這是一個讓 agent 連接任何工具的通用協議。選框架時，MCP 支援已經不是差異化因素了。

### 一個務實建議

框架的選擇成本不在學習曲線——所有框架都能在一天內跑起第一個 demo。真正的成本是遷移成本：你的 agent 邏輯、工具定義、記憶架構、部署模式都會跟框架耦合。先想清楚你的場景，再選框架。

## 參考資料

- [LangGraph GitHub Repository](https://github.com/langchain-ai/langgraph) — 月下載量 38M+ 的 agent 編排框架，stateful workflow 與 durable execution 的代表
- [CrewAI GitHub Repository](https://github.com/crewAIInc/crewAI) — 多角色協作框架，47k stars，Fortune 500 廣泛試用
- [Hugging Face smolagents GitHub Repository](https://github.com/huggingface/smolagents) — Hugging Face 出品的極簡 agent 框架，Code Agent 模式
- [Model Context Protocol Introduction](https://modelcontextprotocol.io/introduction) — MCP 官方文件，2026 年幾乎所有框架的通用工具協議
- [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic agent 設計哲學，「從最簡單方案開始」的框架選擇原則
- [Claude Code Overview](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview) — Claude Agent SDK 官方文件，驅動 Claude Code 的 harness 引擎
- [A Survey on Large Language Model based Autonomous Agents](https://arxiv.org/abs/2308.11432) — arXiv 論文，LLM agent 系統的全面學術綜述，框架選擇的理論背景
