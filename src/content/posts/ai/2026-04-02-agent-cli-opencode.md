---
title: "OpenCode 完整方案分析：75+ 模型供應商的開源終端 Agent"
date: 2026-04-02
type: project
category: ai
tags: [agent-cli, opencode, open-source, terminal-agent, multi-provider, ollama]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 10
tldr: "OpenCode 是免費開源的 TypeScript CLI agent（MIT），支援 75+ 模型供應商含本地 Ollama，可連接外部供應商與支援的訂閱方案，session 中途切換模型。另有桌面版、內建免費模型與選用的 Console 服務。"
description: "OpenCode 的開源架構、多供應商支援、Console 模型服務、認證方式、核心功能、與 Claude Code 的比較及適用場景。"
draft: false
---

在 Agent CLI 百花齊放的 2025-2026 年，多數工具綁定單一模型供應商——Claude Code 鎖 Anthropic、Codex CLI 鎖 OpenAI、Gemini CLI 鎖 Google。OpenCode 走了一條不同的路：**完全開源、零供應商鎖定、支援 75+ 模型供應商**。

這篇深入分析 OpenCode 的架構、定價、核心功能，以及它在 Agent CLI 生態系中的獨特定位。

## 產品定位

[OpenCode](https://github.com/anomalyco/opencode) 是用 **TypeScript** 打造的開源 coding agent，**MIT** 授權，目前在 [anomalyco](https://github.com/anomalyco) 這個 org 下維護。

> **⚠️ 這裡有個常見的張冠李戴**：早期有一個叫 `opencode-ai/opencode` 的專案是用 Go + [Bubble Tea](https://github.com/charmbracelet/bubbletea) 寫的，跟現在這個 OpenCode 不是同一份程式碼。網路上（包括本文舊版）不少「OpenCode 是 Go 寫的、Apache-2.0 授權」的說法都源自這個混淆。以現在的 repo 為準：TypeScript、MIT。

終端介面不是簡陋的純文字——OpenCode 有完整的 TUI，具備面板切換、語法高亮、互動式操作等功能。跑在終端機裡，但體驗接近 GUI。除了 TUI 之外，現在還有**桌面應用程式**（依平台提供安裝版本）與 IDE 擴充。

新安裝 V2 使用 `npm install --global @opencode/cli`，再跑 `opencode --version` 確認版本；啟動指令仍是 `opencode`。V1 的 `opencode-ai` 套件與安裝方式要分開看，Windows V2 請使用[官方獨立 CLI 下載](https://opencode.ai/v2/docs)。

## 定價模式

OpenCode 本體免費開源，模型也不一定要付費。選擇時分清楚這幾件事：

| 方式 | 費用 | 說明 |
|---|---|---|
| OpenCode 工具 | 開源 | 免費的是 client，不代表所有模型無限使用 |
| 內建免費模型 | 服務額度內免費 | 在 `/models` 選當下可用項目，並核對官方 Input／Output 價格 |
| Console 付費模型 | 按量計費 | 儲值後使用官方模型服務 |
| OpenCode Go | 選用的付費訂閱 | 依方案提供用量，仍有額度限制 |
| 外部供應商／本地模型 | 依服務或硬體而定 | 可以是免費 API 額度、付費 API 或本地推論 |
| 支援的訂閱登入 | 使用既有付費方案 | 仍受帳號資格與方案額度限制 |

例如[官方 Console 模型表](https://opencode.ai/v2/docs/console/models)列有 Big Pickle（`opencode/big-pickle`），輸入與輸出都是免費。可以先用內建免費模型開始，不需要先連接 OpenRouter；免費名單與額度仍可能改變。既有付費訂閱即使不另收 API 費，也不等於模型免費。

## 支援的供應商

OpenCode 支援 **75+ LLM 供應商**，涵蓋主流雲端和本地方案：

- **OpenAI**（GPT-5.x 系列）
- **Anthropic Claude**（Opus / Sonnet / Haiku 各級）
- **Google Gemini**
- **AWS Bedrock**（透過 AWS 帳號存取多家模型）
- **Azure OpenAI**（企業級部署）
- **Groq**（超低延遲推論）
- **OpenRouter**（聚合路由）
- **Ollama**（本地模型，完全離線）

供應商清單走 [Models.dev](https://models.dev)，所以新模型上架的速度不取決於 OpenCode 自己發版。

### OpenCode Console

V2 文件將官方模型服務放在 Console 下，舊文常見的 Zen 名稱需要與目前入口分開看。Console 提供經團隊測試的模型清單，包含免費項目與付費使用方式；Go 是選用訂閱。不用 Console，也可以連接其他供應商。後端與 API 的改動可延伸看 [OpenCode 2 介紹](/posts/tech/2026-08-22-opencode-2-electron-rewrite-coding-agent)。

關鍵能力：**session 中途切換模型不丟失上下文**。你可以用 Claude Sonnet 開始一個複雜的重構任務，發現需要更強的推理能力時切換到 o3，再切回 Gemini 做文件生成——整個對話歷史和工作狀態完整保留。

這在其他 Agent CLI 上很難做到。Claude Code 鎖定 Anthropic 模型，Codex CLI 鎖定 OpenAI，你想換模型就得開新 session。

## 核心功能

### 互動式 TUI

全功能終端介面，支援面板分割、即時預覽、語法高亮。內建 **Vim-like 編輯器**，熟悉 Vim 鍵位的開發者可以直接上手。

### 內建雙 agent + subagent

`Tab` 鍵可以在兩個內建 agent 之間切換：**build**（預設，開發用的完整權限）與 **plan**（唯讀，預設拒絕檔案編輯、跑 bash 前先問，適合探索不熟的 codebase）。另外還有一個 **general** subagent 處理複雜搜尋與多步驟任務，訊息裡打 `@general` 叫得動。

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

本地 SQLite 的對話儲存，和模型服務收到的資料，是兩個不同的邊界。使用雲端模型時，prompt、工具結果與選取的程式內容仍會送到供應商；開啟分享也會改變資料的可見範圍。Console 的資料政策依模型而異，例如 Big Pickle 免費期間收集的資料可能用來改善模型。不能把本地儲存寫成「所有內容都不會上雲」。

## 與 Claude Code 比較

OpenCode 和 Claude Code 是定位最接近的兩個 Agent CLI，但設計哲學截然不同：

| 面向 | OpenCode | Claude Code |
|------|----------|-------------|
| **費用** | 工具開源；內建免費模型或另選付費服務 | 付費訂閱或 API 計費 |
| **支援模型** | 75+ 供應商 | 僅 Anthropic 模型 |
| **上下文管理** | 良好，支援 mid-session 切換 | 更成熟，sub-agent 架構 |
| **供應商鎖定** | 零鎖定 | 鎖定 Anthropic |
| **授權** | MIT 開源 | 專有軟體 |
| **介面** | TUI + 桌面版 + IDE 擴充 | 終端機 + IDE + 網頁 |
| **本地模型** | 支援（Ollama） | 不支援 |

結論很清楚：**如果你追求最成熟的擴充生態，Claude Code 仍然領先**——sub-agent 架構、CLAUDE.md 系統、Skills 和 Hooks 都更完整。但如果你重視**供應商彈性、成本控制、或本地模型支援**，OpenCode 是目前最好的選擇。

## 模型路由的最佳搭檔

OpenCode 的 75+ 供應商支援，搭配第三方模型路由器（如 [freerouter](https://github.com/openfreerouter/freerouter) 或 [ruflo](https://github.com/ruvnet/ruflo)）可以實現最大彈性：

- **成本最佳化**：簡單任務路由到便宜模型，複雜任務路由到強模型
- **延遲最佳化**：根據回應速度動態選擇供應商
- **備援切換**：主要供應商掛了自動切到備援
- **mid-session 切換**：OpenCode 原生支援 session 中途換模型，是路由策略的關鍵啟動器

這個組合——OpenCode 作為前端 agent + 模型路由器作為後端調度——提供了目前 Agent CLI 生態系中最靈活的架構。

更多關於多模型路由策略的討論，請參考 **[訂閱制 Agent CLI 的多模型路由策略](/posts/ai/2026-04-02-agent-cli-subscription-multi-model-routing)**。

## 適用場景

OpenCode 最適合以下類型的開發者和團隊：

- **追求供應商獨立性**：不想被任何一家 LLM 供應商綁定，希望隨時切換
- **隱私敏感團隊**：可選本地模型；雲端使用仍需審查供應商資料條款
- **本地模型使用者**：透過 Ollama 跑本地模型，完全離線運作
- **已有支援訂閱的開發者**：可評估帳號登入，仍遵守原方案資格與額度
- **需要最大模型彈性的團隊**：不同任務用不同模型，session 中途切換不丟上下文
- **預算有限的個人開發者**：先試內建免費模型，需要時再評估付費

如果你的需求是「用最強的模型做最複雜的任務」，Claude Code 可能更適合。但如果你的需求是「用最適合的模型做每一個任務」，OpenCode 的多供應商架構提供了其他工具無法比擬的彈性。

從安裝、找免費模型到第一次生活提問，可以接著看[免費 LLM 入門教學：OpenCode 2 與 OpenRouter](/posts/ai/2026-11-01-free-llm-opencode2-openrouter)。

## 更新紀錄

- 2026-11-01：更新 V2 安裝、內建免費模型與 Console／Go 費用，釐清既有訂閱仍屬付費，並補上 Big Pickle 等雲端資料政策差異。
- 2026-08-18：對照官方 repo 與文件翻新，修掉三個實質錯誤：①**語言不是 Go，是 TypeScript**；②**授權不是 Apache-2.0，是 MIT**；③repo 早已不在 `opencode-ai/opencode`，現由 `anomalyco` 維護（前身為 `sst/opencode`）——這三點源自與一個同名的早期 Go 專案混淆，文中已加註說明。另外：stars 95K → 約 198K，補上桌面版、內建 build／plan 雙 agent 與 general subagent、Models.dev 作為供應商清單來源、Zen 的策展定位；移除失效的 freerouter 連結與已過期的 SWE-bench 對比

## 參考資料

- [OpenCode GitHub](https://github.com/anomalyco/opencode)
- [OpenCode V2 installation](https://opencode.ai/v2/docs)
- [OpenCode V2 CLI commands](https://opencode.ai/v2/docs/cli/commands)
- [OpenCode Console models and privacy](https://opencode.ai/v2/docs/console/models)
- [OpenCode V2 models](https://opencode.ai/v2/docs/models/)
- [Models.dev](https://models.dev)
