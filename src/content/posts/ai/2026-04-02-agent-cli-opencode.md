---
title: "OpenCode 完整方案分析：75+ 模型供應商的開源終端 Agent"
date: 2026-04-02
type: project
category: ai
tags: [agent-cli, opencode, open-source, terminal-agent, multi-provider, ollama]
lang: zh-TW
tldr: "OpenCode 是免費開源的 Go 語言 CLI agent，95K+ GitHub stars，支援 75+ 模型供應商含本地 Ollama，可用 Copilot/ChatGPT 帳號認證，session 中途切換模型不丟上下文。"
description: "深入分析 OpenCode 的開源架構、多供應商支援、認證方式、核心功能、與 Claude Code 的比較及適用場景。"
draft: false
---

在 Agent CLI 百花齊放的 2025-2026 年，多數工具綁定單一模型供應商——Claude Code 鎖 Anthropic、Codex CLI 鎖 OpenAI、Gemini CLI 鎖 Google。OpenCode 走了一條不同的路：**完全開源、零供應商鎖定、支援 75+ 模型供應商**。

這篇深入分析 OpenCode 的架構、定價、核心功能，以及它在 Agent CLI 生態系中的獨特定位。

## 產品定位

[OpenCode](https://github.com/opencode-ai/opencode) 是用 Go 語言打造的開源 CLI coding agent，Apache-2.0 授權。上線第一年就累積 **95K+ GitHub stars**，超過了 Claude Code，成為 Agent CLI 領域星數最高的專案之一。每月活躍開發者超過 **250 萬**。

終端介面不是簡陋的純文字——OpenCode 基於 [Bubble Tea](https://github.com/charmbracelet/bubbletea) 打造了完整的 TUI（Terminal User Interface），具備面板切換、語法高亮、互動式操作等功能。跑在終端機裡，但體驗接近 GUI。

Go 語言的選擇也有策略意義：單一二進位檔部署、交叉編譯容易、啟動速度快。不需要 Node.js 或 Python 環境，下載就能跑。

## 定價模式

OpenCode 本身完全免費，付費的是底層 LLM 的使用。提供三種取得模型的方式：

| 方案 | 費用 | 說明 |
|------|------|------|
| **OpenCode 本體** | 免費（開源） | Apache-2.0 授權，無使用限制 |
| **OpenCode Zen** | Pay-as-you-go，$20 預付餘額 | 官方託管的模型路由，零加價（zero markup）直接轉發至供應商 |
| **BYOM（Bring Your Own Model）** | 免費，按供應商費率計費 | 自備 API key，直連任何支援的供應商 |
| **Copilot / ChatGPT 認證** | 免費（使用既有訂閱） | 用 GitHub Copilot 或 ChatGPT Plus 帳號登入即可使用 |

最後一項值得注意：如果你已經訂閱了 GitHub Copilot 或 ChatGPT Plus，可以直接用那個帳號認證 OpenCode，不需要額外付費。這讓切換成本幾乎為零。

## 支援的供應商

OpenCode 支援 **75+ LLM 供應商**，涵蓋主流雲端和本地方案：

- **OpenAI**（GPT-4o、o3 等）
- **Anthropic Claude**（Sonnet、Opus）
- **Google Gemini**（Gemini 3 系列）
- **AWS Bedrock**（透過 AWS 帳號存取多家模型）
- **Azure OpenAI**（企業級部署）
- **Groq**（超低延遲推論）
- **OpenRouter**（聚合路由）
- **Ollama**（本地模型，完全離線）

關鍵能力：**session 中途切換模型不丟失上下文**。你可以用 Claude Sonnet 開始一個複雜的重構任務，發現需要更強的推理能力時切換到 o3，再切回 Gemini 做文件生成——整個對話歷史和工作狀態完整保留。

這在其他 Agent CLI 上很難做到。Claude Code 鎖定 Anthropic 模型，Codex CLI 鎖定 OpenAI，你想換模型就得開新 session。

## 核心功能

### 互動式 TUI

基於 Bubble Tea 框架的全功能終端介面，支援面板分割、即時預覽、語法高亮。內建 **Vim-like 編輯器**，熟悉 Vim 鍵位的開發者可以直接上手。

### 多 Session 支援

可以在同一個專案上平行跑多個 agent session。例如一個 session 處理前端重構，另一個同時跑後端 API 修改。Session 之間互不干擾，各自維護上下文。

### Session 分享

透過連結分享 session，團隊成員可以看到完整的對話歷史和操作記錄。適合 code review 或知識傳承。

### 持久化儲存

所有 session 資料存在本地 **SQLite** 資料庫，不依賴雲端。關掉終端機再打開，之前的 session 還在。

### LSP 整合

OpenCode 會**自動偵測並設定語言伺服器**（Language Server Protocol），讓 LLM 在修改程式碼時能取得型別資訊、定義跳轉、錯誤診斷等結構化資料。這比單純餵原始碼給模型更精確。

### 工具整合

和其他 Agent CLI 一樣，OpenCode 能執行 shell 指令、讀寫檔案、修改程式碼。但它的工具系統設計上更偏向可擴展——支援自訂工具定義。

### 隱私優先

**不儲存任何程式碼或上下文資料到雲端**。所有資料留在本地 SQLite。即使使用 OpenCode Zen 路由，也只轉發 API 請求，不留存內容。

## 與 Claude Code 比較

OpenCode 和 Claude Code 是定位最接近的兩個 Agent CLI，但設計哲學截然不同：

| 面向 | OpenCode | Claude Code |
|------|----------|-------------|
| **費用** | 免費（開源） | $20+/月（API 費用） |
| **支援模型** | 75+ 供應商 | 僅 Anthropic 模型 |
| **Agentic 能力** | 良好（SWE-bench ~71%） | 更強（SWE-bench ~80%） |
| **上下文管理** | 良好，支援 mid-session 切換 | 更成熟，sub-agent 架構 |
| **供應商鎖定** | 零鎖定 | 鎖定 Anthropic |
| **授權** | Apache-2.0 開源 | 專有軟體 |
| **TUI** | Bubble Tea 全功能 TUI | 較簡潔的終端介面 |
| **本地模型** | 支援（Ollama） | 不支援 |

結論很清楚：**如果你追求最強的 agentic 能力，Claude Code 仍然領先**。它的 sub-agent 架構、CLAUDE.md 系統、Skills 和 Hooks 生態系都更成熟。但如果你重視**供應商彈性、成本控制、或本地模型支援**，OpenCode 是目前最好的選擇。

## 模型路由的最佳搭檔

OpenCode 的 75+ 供應商支援，搭配第三方模型路由器（如 [freerouter](https://github.com/freerouter-ai/freerouter) 或 ruflo）可以實現最大彈性：

- **成本最佳化**：簡單任務路由到便宜模型，複雜任務路由到強模型
- **延遲最佳化**：根據回應速度動態選擇供應商
- **備援切換**：主要供應商掛了自動切到備援
- **mid-session 切換**：OpenCode 原生支援 session 中途換模型，是路由策略的關鍵啟動器

這個組合——OpenCode 作為前端 agent + 模型路由器作為後端調度——提供了目前 Agent CLI 生態系中最靈活的架構。

更多關於多模型路由策略的討論，請參考 **[訂閱制 Agent CLI 的多模型路由策略](/posts/ai/2026-04-02-agent-cli-subscription-multi-model-routing)**。

## 適用場景

OpenCode 最適合以下類型的開發者和團隊：

- **追求供應商獨立性**：不想被任何一家 LLM 供應商綁定，希望隨時切換
- **隱私敏感團隊**：所有資料留在本地，不上傳雲端
- **本地模型使用者**：透過 Ollama 跑本地模型，完全離線運作
- **已有 Copilot / ChatGPT 訂閱的開發者**：零額外成本，直接用既有帳號
- **需要最大模型彈性的團隊**：不同任務用不同模型，session 中途切換不丟上下文
- **預算有限的個人開發者**：工具本身免費，只付模型使用費

如果你的需求是「用最強的模型做最複雜的任務」，Claude Code 可能更適合。但如果你的需求是「用最適合的模型做每一個任務」，OpenCode 的多供應商架構提供了其他工具無法比擬的彈性。

## 系列文章

**→ [Agent CLI 訂閱方案與多模型路由策略](/posts/ai/2026-04-02-agent-cli-subscription-multi-model-routing)**

## 參考資料

- [OpenCode | GitHub](https://github.com/opencode-ai/opencode)
- [OpenCode Docs | AI coding agent built for the terminal](https://opencode.ai/docs/)
- [OpenCode Review: Go CLI Terminal Coding Agent | OpenAIToolsHub](https://www.openaitoolshub.org/en/blog/opencode-review-terminal-ai-coding)
- [OpenCode vs Claude Code | OpenAIToolsHub](https://www.openaitoolshub.org/en/blog/opencode-vs-claude-code)
- [Aider vs OpenCode: Best Open-Source AI Coding CLI in 2026 | NxCode](https://www.nxcode.io/resources/news/aider-vs-opencode-ai-coding-cli-2026)
