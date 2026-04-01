---
title: "2026 年 10 大 Agent 框架：選錯框架比選錯模型更痛"
date: 2026-04-01
category: ai
tags: [agent, framework, langgraph, crewai, openai, anthropic, google-adk, mastra, pydantic-ai, agno, smolagents, microsoft-agent-framework]
lang: zh-TW
tldr: "2026 年 Agent 框架百花齊放，三大雲廠各推官方 SDK，開源社群也有強力選手。這篇整理 10 個主流框架的設計哲學、適用場景與取捨，幫你少走彎路。"
description: "2026 年 10 大 AI Agent 框架深度比較：LangGraph、CrewAI、OpenAI Agents SDK、Claude Agent SDK、Google ADK、Microsoft Agent Framework、Mastra、Pydantic AI、Agno、SmolAgents 的設計哲學、優缺點與選型指南。"
draft: false
---

2025 下半年到 2026 Q1，Agent 框架經歷了一輪大洗牌：OpenAI、Anthropic、Google 各自推出官方 SDK，Microsoft 把 Semantic Kernel 和 AutoGen 合併成全新的 Agent Framework，開源社群也冒出 Mastra、Agno 等新面孔。

框架選錯，後面要遷移的成本極高——你的工具定義、記憶架構、部署模式全都耦合在框架的抽象上。這篇把 10 個主流框架攤開來比，幫你在動手寫第一行 code 之前做好決定。

## 1. LangGraph — 圖結構編排，複雜工作流首選

**團隊：** LangChain, Inc.
**語言：** Python、TypeScript
**GitHub Stars：** ~12k+
**授權：** MIT

LangGraph 把 Agent 工作流建模成有向圖——節點是動作，邊是轉移條件。2025 年底推出 v1.0，已成為所有 LangChain Agent 的預設 runtime。

**核心能力：**
- 支援循環（cycles）、條件分支、平行執行
- 持久化執行——Agent 可以從失敗點自動恢復
- Human-in-the-loop：任意節點插入人工審核
- 搭配 LangSmith 做 tracing 和 observability

**適合場景：** 需要精細控制流程、多步推理、狀態持久化的生產級 Agent。

**取捨：** 學習曲線中等偏高。如果你的 Agent 就是「一個 LLM 呼叫工具直到完成」，用 LangGraph 會有 overkill 的感覺。LangSmith 免費方案限 5k traces/月，Plus 要 $39/seat/月。

## 2. CrewAI — 多角色協作，上手最快

**團隊：** João Moura / CrewAI, Inc.
**語言：** Python
**GitHub Stars：** ~44k+（所有框架中最高）
**授權：** MIT

CrewAI 的抽象層很直覺：定義 Agent（角色）、Task（任務）、Crew（團隊），然後讓它們協作。支援順序執行、層級管理、非同步協作。

**核心能力：**
- 角色扮演（Role-Playing）驅動，每個 Agent 有自己的 backstory 和 goal
- 內建記憶系統（短期 / 長期 / 實體記憶）
- CrewAI Flows 提供更靈活的編排
- 模型無關——不綁定特定 LLM 廠商

**適合場景：** 多角色業務自動化、內容生成流水線、研究分析。

**取捨：** 大多數 Agent 場景 CrewAI 比 LangGraph 更快交付。但如果你需要循環圖或複雜狀態機，CrewAI 的彈性不夠。多角色設計在簡單場景反而增加不必要的複雜度。

## 3. OpenAI Agents SDK — OpenAI 生態最短路徑

**團隊：** OpenAI
**語言：** Python、Node.js
**GitHub Stars：** ~19k+
**授權：** MIT

2025 年 3 月發布，取代實驗性的 Swarm SDK。設計極度精簡：Agent、Tool、Handoff、Guardrail 四個核心原語就能搞定大部分場景。

**核心能力：**
- Agent 間 Handoff（移交）機制，適合客服轉接場景
- 內建 Tracing，不用另外付費
- Guardrails 做輸入/輸出護欄
- Web Search ($25-30/1k queries)、File Search ($2.50/1k queries) 等內建工具

**適合場景：** 已經用 OpenAI 模型、需要最快從 prototype 到 production。

**取捨：** 鎖定 OpenAI 模型（技術上可接 Chat Completions 相容端點，但非官方支援）。如果未來想換模型，遷移成本高。編排能力比 LangGraph 弱。

## 4. Claude Agent SDK — 安全優先，MCP 原生支援

**團隊：** Anthropic
**語言：** Python、TypeScript
**GitHub Stars：** 快速成長中
**授權：** MIT

原名 Claude Code SDK，2026 年 1 月更名為 Claude Agent SDK，反映其從 code agent 擴展到通用 agent 的定位。這是驅動 Claude Code 的同一個引擎。

**核心能力：**
- MCP（Model Context Protocol）原生支援——透過標準協議連接任意工具
- Extended Thinking 讓推理過程可追蹤
- Python SDK 支援自定義工具和 hooks，工具以 in-process MCP server 形式運行
- Computer Use 支援 GUI 自動化

**適合場景：** 安全關鍵型應用、需要 MCP 工具整合、程式碼自動化。

**取捨：** 鎖定 Claude 模型。編排功能比 LangGraph 輕量——它更像是一個強大的 Agent loop，而不是完整的 workflow engine。

## 5. Google ADK — 多語言、多模態、跨框架互通

**團隊：** Google
**語言：** Python、TypeScript、Java、Go
**授權：** Apache-2.0

2025 年 Cloud Next 發布，是這份清單中語言支援最廣的框架。2026 年 3 月 Java 1.0.0 GA，TypeScript 版也已上線。

**核心能力：**
- A2A（Agent-to-Agent）協議——你的 Agent 可以跟其他框架建的 Agent 通訊
- 多模態支援（Gemini 的影像、音訊能力）
- Workflow Agents：Sequential、Parallel、Loop 三種內建編排模式
- Event Compaction 管理 context window
- Plugin 架構做全域 guardrails 和 logging

**適合場景：** Google Cloud 生態、多模態 Agent、需要跨框架互通的場景。

**取捨：** 雖然宣稱 model-agnostic，但對 Gemini 最佳化。部署推薦 Vertex AI Agent Engine，綁定 GCP。

## 6. Microsoft Agent Framework — Semantic Kernel + AutoGen 的合體

**團隊：** Microsoft
**語言：** .NET（C#）、Python
**GitHub Stars：** Semantic Kernel ~27.5k
**授權：** MIT

2026 年 2 月達到 Release Candidate，目標 Q1 GA。這是 Semantic Kernel v2.0——同一個團隊打造，把 AutoGen 的 Agent 抽象和 Semantic Kernel 的企業級功能合併。

**核心能力：**
- 圖式工作流引擎：Sequential、Concurrent、Handoff、Group Chat
- Session-based 狀態管理、Middleware、Telemetry
- `ChatClientAgent` 統一介面支援所有實作 `IChatClient` 的服務
- 完整的 Azure AI / Copilot Studio 整合

**適合場景：** .NET 企業團隊、Microsoft/Azure 生態、需要正式 SLA 的生產環境。

**取捨：** Semantic Kernel 和 AutoGen 進入維護模式（只修 bug），新功能只在 Agent Framework。遷移有成本，但早換早安心。Python 支援相對 .NET 薄弱。

## 7. Mastra — TypeScript 開發者的第一選擇

**團隊：** Mastra（Gatsby 原班人馬），YC W25
**語言：** TypeScript
**GitHub Stars：** ~22.3k+
**授權：** Apache-2.0

2026 年 1 月 YC 畢業，拿到 $13M 融資。每週 npm 下載 30 萬次以上。這是第一個從 ground up 為 TypeScript 設計的 Agent 框架，不是 Python 的移植版。

**核心能力：**
- 40+ 模型供應商統一介面
- 內建 Workflow、RAG pipeline、Memory（短期 + 長期）
- Evals 和 Tracing 內建
- 部署到 Vercel、Cloudflare、Netlify 或任何 Node.js 環境

**適合場景：** TypeScript/Node.js 技術棧、Web 全端專案、Serverless 部署。

**取捨：** 生態還在早期，社群資源和第三方教學不如 LangGraph/CrewAI 豐富。只支援 TypeScript，Python 團隊無法使用。

## 8. Pydantic AI — 型別安全，FastAPI 風格的 DX

**團隊：** Pydantic 團隊（Samuel Colvin）
**語言：** Python
**GitHub Stars：** ~16k
**授權：** MIT

Pydantic 是 OpenAI SDK、Google ADK、Anthropic SDK、LangChain 底下都在用的驗證層。Pydantic AI 把同樣的型別安全哲學帶到 Agent 開發。

**核心能力：**
- 模型無關——支援 OpenAI、Anthropic、Gemini、DeepSeek、Groq 等幾乎所有主流供應商
- 結構化輸出驗證，錯誤從 runtime 移到 write-time
- Capabilities 系統——可組合、可復用的 agent 行為單元
- Logfire 整合做 OpenTelemetry 級的 observability
- AgentSpec 支援從 YAML/JSON 載入 Agent 定義

**適合場景：** 已用 Pydantic/FastAPI 的團隊、需要嚴格型別安全、重視 structured output 的場景。

**取捨：** 不走多 Agent 編排路線，定位是「做好一個 Agent」而非「管理一群 Agent」。如果你需要複雜的多 Agent 協作，還是得搭配 LangGraph 或 CrewAI。

## 9. Agno — 極致效能，純 Python 零抽象

**團隊：** Agno（原 Phidata）
**語言：** Python
**GitHub Stars：** ~18.5k+
**授權：** Apache-2.0

2025 年初從 Phidata 更名為 Agno（希臘語「純粹」）。設計哲學是：不要圖、不要鏈、不要複雜的 pattern——就是純 Python。

**核心能力：**
- Agent 實例化 <5 微秒，記憶體用量比 LangGraph 低 50 倍
- 原生多模態支援（文字、圖片、音訊、影片）
- 100+ 內建工具整合
- 支援 Team 模式做多 Agent 協作
- Guardrails、Knowledge base 內建
- Stateless 設計，可水平擴展

**適合場景：** 效能敏感場景、快速原型、需要多模態的應用。

**取捨：** 社群和生態規模不如 LangGraph/CrewAI。框架的「零抽象」哲學在複雜場景可能反而讓你自己重新發明輪子。

## 10. SmolAgents — 極簡主義，Code Agent 先驅

**團隊：** Hugging Face
**語言：** Python
**GitHub Stars：** ~26k+
**授權：** Apache-2.0

核心程式碼只有約 1,000 行。SmolAgents 的殺手特色是 Code Agent——Agent 直接寫 Python code 來執行動作，而不是產生 JSON tool call。這讓步驟數和 LLM 呼叫次數減少約 30%。

**核心能力：**
- CodeAgent（寫 code 執行）和 ToolCallingAgent（傳統 JSON 呼叫）雙模式
- 沙箱執行：支援 E2B、Docker、Pyodide+Deno WebAssembly
- MCP server 整合、LangChain tools 互通
- Hugging Face Hub 共享 Agent 和 Tools
- 模型無關——本地 transformers、Ollama 或雲端 API 都行

**適合場景：** 研究實驗、需要 Code Agent 模式、Hugging Face 生態整合。

**取捨：** 「極簡」意味著很多生產級功能（持久化、進階記憶、企業級 observability）需要自己補。適合懂得取捨的進階開發者，不適合需要一站式解決方案的團隊。

---

## 選型速查表

| 你的情境 | 推薦框架 |
|---|---|
| 複雜有狀態工作流、需要循環和分支 | **LangGraph** |
| 多角色團隊協作、快速上手 | **CrewAI** |
| 已用 OpenAI、要最快出 MVP | **OpenAI Agents SDK** |
| 安全優先、MCP 整合 | **Claude Agent SDK** |
| Google Cloud 生態、多模態 | **Google ADK** |
| .NET 企業團隊、Azure 生態 | **Microsoft Agent Framework** |
| TypeScript 全端 | **Mastra** |
| Python 型別安全、structured output | **Pydantic AI** |
| 效能敏感、快速原型 | **Agno** |
| 研究實驗、Code Agent | **SmolAgents** |

## MCP 支援現況

MCP（Model Context Protocol）在 2026 年已成為 Agent 連接工具的事實標準。目前主要框架的支援程度：

- **原生支援：** Claude Agent SDK、Google ADK、Mastra、SmolAgents、Pydantic AI
- **透過 Adapter 支援：** LangGraph、CrewAI、AutoGen/AG2
- **部分支援或整合中：** OpenAI Agents SDK、Microsoft Agent Framework

## 最後的建議

1. **先選語言再選框架。** TypeScript 選 Mastra，.NET 選 Microsoft Agent Framework，Python 的選擇最多。
2. **模型鎖定是真實成本。** OpenAI Agents SDK 和 Claude Agent SDK 都鎖定各自的模型。如果你不確定要用哪家的模型，選 LangGraph、CrewAI、Pydantic AI 這些 model-agnostic 的框架。
3. **框架免費，模型不免費。** 真正的帳單來自 LLM API call，不是框架本身。
4. **能不用框架就不用。** 如果你的 Agent 就是一個 while loop 加 tool call，直接用模型供應商的 SDK 就好。框架的價值在於你真的需要狀態管理、多 Agent 協作、持久化這些功能的時候。

Sources:
- [Lindy - Top 11 AI Agent Frameworks](https://www.lindy.ai/blog/best-ai-agent-frameworks)
- [Turing - Detailed Comparison of Top 6 AI Agent Frameworks](https://www.turing.com/resources/ai-agent-frameworks)
- [Softmax Data - Definitive Guide to Agentic Frameworks 2026](https://softmaxdata.com/blog/definitive-guide-to-agentic-frameworks-in-2026-langgraph-crewai-ag2-openai-and-more/)
- [Anthropic - Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
- [Google ADK Docs](https://google.github.io/adk-docs/)
- [Microsoft Agent Framework Blog](https://devblogs.microsoft.com/semantic-kernel/migrate-your-semantic-kernel-and-autogen-projects-to-microsoft-agent-framework-release-candidate/)
- [Mastra](https://mastra.ai/)
- [Pydantic AI](https://ai.pydantic.dev/)
- [Agno](https://www.agno.com/)
- [SmolAgents - Hugging Face](https://huggingface.co/docs/smolagents/en/index)
