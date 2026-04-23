---
title: "Hermes Agent：Nous Research 的自我改進 AI 代理"
date: 2026-04-05
type: guide
category: ai
tags: [hermes-agent, nous-research, ai-agent, self-improving, gateway, multi-platform, openclaw]
lang: zh-TW
tldr: "Hermes Agent 是 Nous Research 開源的自我改進 AI 代理，具備持久記憶、技能學習、40+ 工具、多平台閘道，支援 200+ 模型供應商，是 OpenClaw 的正式繼承者。"
description: "深入介紹 Hermes Agent 的架構設計、記憶與技能系統、多平台閘道、終端後端、模型整合，以及它與 OpenClaw 的關係。"
draft: false
---

Hermes Agent 是 Nous Research 開源的 AI 代理框架，核心定位是「會自己學的 agent」——完成任務後自動建立技能、使用中持續改進、主動提醒自己整理記憶。它不只是一個聊天介面，而是一套完整的 AI agent 營運系統，從本地 CLI 到 Telegram、Discord、WhatsApp 都能接，模型供應商隨時切換，執行環境從本機到 serverless 都有。

如果你之前關注過 OpenClaw，Hermes Agent 就是它的正式繼承者，提供完整的遷移路徑。

## 核心架構

```
使用者
  ↓
CLI / Telegram / Discord / Slack / WhatsApp / Signal
  ↓
Gateway（統一閘道）
  ↓
Agent Core（推理 + 決策）
  ├── Tools（40+ 工具）
  ├── Skills（程序性記憶）
  ├── Memory（持久記憶 + FTS5 搜尋）
  └── Cron（排程任務）
  ↓
LLM Provider（Nous Portal / OpenRouter / OpenAI / Anthropic / 自訂）
```

整個系統用 Python 寫（93%），套件管理用 `uv`，部署靠一行 `curl` 搞定。目錄結構乾淨地分成 `agent/`、`gateway/`、`skills/`、`tools/`、`hermes_cli/`、`cron/` 六個主要模組。

## 自我改進迴路

這是 Hermes Agent 跟一般 agent 框架最大的差異。它有一個內建的學習循環：

1. **完成複雜任務**後，自動把過程抽象成可重用的 Skill
2. **使用 Skill 的過程中**，持續微調改進
3. **定期提醒自己**整理、鞏固累積的知識

記憶系統用 FTS5 全文搜尋 + LLM 摘要，可以跨 session 回溯歷史對話。它還實作了受 Honcho 啟發的「使用者輪廓辯證法」——隨著互動次數增加，agent 對你的理解會越來越深。

技能格式相容 [agentskills.io](https://agentskills.io) 開放標準，意味著技能可以跨框架共享。

## 多平台閘道

Gateway 是 Hermes 的控制平面，一個程序管所有平台連線：

| 平台 | 支援 |
|------|------|
| Telegram | Bot API |
| Discord | Bot |
| Slack | App |
| WhatsApp | 配對連線 |
| Signal | 橋接 |
| Email | 收發 |
| Home Assistant | 整合 |

設定流程：

```bash
hermes gateway setup    # 互動式設定各平台憑證
hermes gateway start    # 啟動閘道，開始監聽
```

所有平台共用同一個 agent 核心，對話連續性跨平台維持。Gateway 還支援語音備忘錄轉文字。

## 終端後端

Agent 的指令執行環境可以切換，不一定要在本機跑：

| 後端 | 特點 |
|------|------|
| **Local** | 直接在本機執行，最簡單 |
| **Docker** | 容器隔離，安全性較高 |
| **SSH** | 連到遠端伺服器執行 |
| **Daytona** | Serverless 開發環境，閒置自動休眠 |
| **Modal** | Serverless 計算，session 之間幾乎零成本 |
| **Singularity** | 容器替代方案 |

Modal 和 Daytona 特別適合間歇性使用——只在收到訊息時啟動，其餘時間不花錢。

## 模型整合

不綁定任何供應商，透過 `hermes model` 一行指令切換：

```bash
hermes model                     # 互動式選擇
hermes model openrouter:mixtral  # 直接指定
```

支援的供應商：

- **Nous Portal** — Nous Research 自家平台
- **OpenRouter** — 200+ 模型，一把鑰匙搞定
- **OpenAI** / **Anthropic** — 直連
- **z.ai / GLM** / **Kimi / Moonshot** / **MiniMax** — 中國模型供應商
- **自訂端點** — 任何 OpenAI 相容 API

切換不需要改程式碼，不需要重啟，不需要重新設定。

## 工具生態

內建 40+ 工具，涵蓋：

- 檔案操作與終端執行
- 網頁瀏覽與搜尋
- API 呼叫
- Sub-Agent 生成（可以 spawn 隔離的子代理平行處理）
- MCP 支援（透過 `mcp_serve.py` 連接任意 MCP server）

工具的啟用/停用透過 `hermes tools` 管理。

## 排程任務

內建 cron 排程器，用自然語言定義任務，不需要手寫 cron 語法：

- 每日報告
- 每晚備份
- 每週審計

結果會透過你設定的平台（Telegram、Discord 等）推送。

## CLI 操作

```bash
# 系統管理
hermes setup     # 完整設定精靈
hermes update    # 更新到最新版
hermes doctor    # 診斷問題

# 對話中
/new             # 新對話
/retry           # 重試上一個回應
/undo            # 撤銷
/compress        # 壓縮 context
/usage           # Token 用量
/insights        # 使用統計
/skills          # 瀏覽技能
/personality     # 切換人格
/model           # 切換模型
```

## 從 OpenClaw 遷移

如果你原本用 OpenClaw，Hermes 提供完整遷移：

```bash
hermes claw migrate              # 互動式完整遷移
hermes claw migrate --dry-run    # 預覽不執行
hermes claw migrate --preset user-data  # 只遷資料不遷密鑰
```

會遷移的東西：Persona 檔案（SOUL.md）、記憶（MEMORY.md、USER.md）、自建技能、指令白名單、平台設定、API keys、TTS 音檔、AGENTS.md。

## 研究用途

除了日常使用，Hermes Agent 也支援 AI 研究場景：

- **Trajectory 批次生成**：用 `batch_runner.py` 大量生成 tool-calling 訓練資料
- **Atropos RL 整合**：透過 `tinker-atropos` submodule 連接強化學習環境
- **Trajectory 壓縮**：為訓練下一代 tool-calling 模型準備資料

這讓它不只是一個使用者工具，也是一個研究平台。

## 跟其他框架的比較

| 面向 | Hermes Agent | LangGraph | Claude Code |
|------|-------------|-----------|-------------|
| 自我改進 | 內建學習迴路 | 需自建 | 無 |
| 多平台 | 7+ 平台閘道 | 需自建 | CLI / IDE |
| 模型供應商 | 200+ | 自行整合 | 僅 Anthropic |
| 執行環境 | 6 種後端 | 自行部署 | 本地 |
| 技能系統 | 自動建立 + 共享 | 無 | 有（手動） |
| 開源 | MIT | MIT | 部分開源 |

Hermes 的定位更偏向「個人 AI 營運系統」而非單純的 agent 框架。它把通訊、執行、學習、排程全包進一個統一介面。

## 整體來說

Hermes Agent 的核心取捨是**功能完整性換取複雜度**。它不是一個輕量的 library，而是一個完整的系統。適合：

- 想要一個跨平台 AI 助手，不只在終端用
- 需要 agent 記住上下文、累積經驗
- 想在多個模型供應商之間靈活切換
- 有興趣用 agent 生成訓練資料做研究

不適合的場景：只是想在程式裡呼叫一個 LLM API、需要嵌入現有應用的輕量 SDK、或是團隊協作的企業級部署（目前偏向個人使用）。

## 參考資料

- [Hermes Agent GitHub](https://github.com/NousResearch/hermes-agent)
- [Nous Research 官網](https://nousresearch.com/)
- [agentskills.io — 技能開放標準](https://agentskills.io)
- [OpenRouter — 多模型供應商平台](https://openrouter.ai/)
- [Honcho — 使用者輪廓系統](https://github.com/plastic-labs/honcho)
- [Atropos RL 環境](https://github.com/NousResearch/Atropos)
- [Modal — Serverless 計算平台](https://modal.com/)
- [Daytona — Serverless 開發環境](https://www.daytona.io/)
