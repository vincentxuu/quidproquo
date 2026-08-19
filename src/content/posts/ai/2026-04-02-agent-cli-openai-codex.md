---
title: "OpenAI Codex 完整方案分析：ChatGPT 生態系的 Agent 整合"
date: 2026-04-02
type: guide
category: ai
tags: [agent-cli, openai-codex, pricing, gpt-5, chatgpt, credits]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 5
tldr: "Codex 綁定 ChatGPT 訂閱（Free / Go $8 / Plus $20 / Pro 5x $100 / Pro 20x $200），2026/4/2 起計費改為按 token 計 credit。模型主線是 GPT-5.6 Sol / Terra / Luna；GPT-5.4 與 5.4 mini 將於 2026/8/31 在 ChatGPT 登入模式下退場。"
description: "深入分析 OpenAI Codex 的 ChatGPT 訂閱層級、token-based credit 計費、GPT-5.6 三檔模型選擇、GPT-5.4 退場時程與適用場景。"
draft: false
---

OpenAI Codex 不是一個獨立產品，而是 ChatGPT 生態系的延伸。理解這一點，才能正確評估它的定價與適用場景。這篇從產品定位、訂閱方案、credit 計費到模型選擇，完整拆解 Codex 的方案設計。

## 產品定位

Codex 的核心策略是**綁定 ChatGPT 訂閱**。它不像 Claude Code 或 Gemini CLI 那樣作為獨立的開發者工具存在，而是 ChatGPT 生態系中專注於程式碼任務的 agent 功能。

使用者可以透過三種介面存取 Codex：

| 介面 | 說明 |
|------|------|
| **Web App** | ChatGPT 網頁版內建的 Codex 功能，直接在對話中使用 |
| **CLI** | 終端機 agent，支援本地 codebase 操作 |
| **IDE Extension** | VS Code 等編輯器擴充，整合開發環境 |

三種介面共用同一套訂閱額度，不需要分別付費。這意味著你的 ChatGPT Plus 訂閱同時涵蓋了 Codex 的使用權。

## 訂閱方案

Codex 的計費完全依附於 ChatGPT 訂閱層級，**沒有單獨賣 Codex 的方案**。

| 方案 | 月費 | Codex 額度 | 適用對象 |
|------|------|-----------|---------|
| **Free** | $0 | 有限，夠試不夠做事 | 評估 |
| **Go** | $8/mo | 最便宜的實用存取 | 輕度使用者 |
| **Plus** | $20/mo | 1x 基準線 | 個人開發者 |
| **Pro 5x** | $100/mo | 5x Plus | 以寫程式為主的重度使用者 |
| **Pro 20x** | $200/mo | 20x Plus，另含完整 Pro 套組 | 最重度、需要 Pro 其他功能 |
| **Business** | $25/user/mo（年繳 $20，最少 2 人） | 團隊共用額度與管理功能 | 小型團隊 |
| **Enterprise / Edu** | 客製報價 | 可用 flexible pricing 買 workspace credit | 企業、教育機構 |

幾個重點：

- **$100 的 Pro 5x 是 2026 年 4 月才出現的層級**，也是目前最常見的過期資訊來源：任何只寫「Pro 是 $200」的文章都比這個改動早。兩個 Pro 層給的模型完全一樣，差別只在倍率（5x vs 20x）與 $200 那層額外綁的 Pro 套組。如果你付錢的唯一理由是 Codex，$100 那層就是為你設計的。
- **額度以 5 小時滾動視窗計算**，本地訊息與雲端對話共用同一個視窗，另有週上限。
- **Enterprise / Edu 走 flexible pricing 時沒有固定 rate limit**，用量隨 credit 伸縮。

## 計費已改成按 token 計 credit

2026 年 4 月 2 日起，Codex 的計費從「每則訊息」改為**對齊 API 的 token 用量**，以 credit 計價（4 月 23 日擴及所有既有 Enterprise 方案）。這是理解 Codex 成本的關鍵改動——舊的「一則訊息多少額度」的算法已經不適用。

目前的 rate card（credit / 每 M tokens）：

| 模型 | Input | Cached input | Output |
|------|-------|--------------|--------|
| GPT-5.6 Sol | 125 | 12.50 | 750 |
| GPT-5.6 Terra | 50 | 5 | 300 |
| GPT-5.6 Luna | 5 | 0.5 | 30 |
| GPT-5.5 | 125 | 12.50 | 750 |
| GPT-5.5 Cyber | 312.5 | 31.25 | 1,875 |

Cached input 一律是 input 的十分之一，所以**能不能吃到 cache 直接決定成本量級**。官方給的實務數字是平均每位開發者每月約 $100-200，變異很大，取決於模型、平行跑幾個 instance、自動化用量與是否開 fast mode。

## CLI 計費雙軌

Codex CLI 提供兩種計費模式，開發者可以根據使用場景切換：

### Plan 模式（預設）

使用 ChatGPT 訂閱額度，**不產生額外費用**。CLI 操作直接扣訂閱方案的 credit，和在 ChatGPT 網頁版使用 Codex 完全等價。

適合日常開發任務——修 bug、寫功能、跑 code review，額度通常夠用。

### API Key 模式

自備 OpenAI API key，整套額度系統換成按 token 計費。適合需要大量自動化、CI/CD 整合、或超出訂閱額度的場景。

這條路的模型可用性**跟著你的 key 走**，不受 ChatGPT 端的模型下架影響——這點在 GPT-5.4 退場一事上特別重要（見下節）。相對地，雲端功能（GitHub code review、Slack 整合等）在 API key 模式下不可用。

兩種模式的切換是即時的，不需要重新安裝或設定。開發者可以在日常工作用 Plan 模式，遇到大量自動化需求時切換到 API Key 模式。

## 模型選擇：GPT-5.6 三檔

Codex 現在的主線是 **GPT-5.6 家族的三個模型**，靠 Power 設定（Smarter ↔ Faster）挑，不再是「大模型指揮、小模型執行」那套固定分工：

| 模型 | 定位 | 用在哪 |
|------|------|--------|
| **Sol** | 品質與推理深度優先 | 複雜分析、寫程式、研究、進階工作流 |
| **Terra** | 日常預設 | 能力強，但性價比平衡得更好 |
| **Luna** | 速度與成本優先 | 輕量、高頻的工作 |

預設是 Power 設定下的 `gpt-5.6-sol` 搭 medium reasoning；往 Smarter 調得到更深的推理，往 Faster 調換速度與成本。要指定 `gpt-5.6-luna` 或特定 reasoning effort、speed，走 Advanced。ChatGPT 桌面版、Codex CLI 與 IDE 擴充**共用同一份 `config.toml`**，設一次三邊生效。

### 重要：GPT-5.4 與 5.4 mini 即將退場

**2026 年 8 月 31 日起，GPT-5.4 與 GPT-5.4 mini 在「以 ChatGPT 帳號登入」的 Codex 中下架。** 官方指定的替代是：GPT-5.4 → GPT-5.6 Terra，GPT-5.4 mini → GPT-5.6 Luna。

如果你的腳本、`config.toml` 或 `codex exec --model` 還寫死 `gpt-5.4`，8/31 之前要改掉，workspace 預設值、儲存的模型設定與自動化也一併檢查。**走自備 API key 的路徑不受影響**，OpenAI API 端的模型可用性也不變。

`gpt-5.2` 與 `gpt-5.3-codex` 在 ChatGPT 登入模式下則早已標為 deprecated。

## 其他能力

| 項目 | 內容 |
|------|------|
| **Codex Security** | 掃描程式碼安全漏洞 |
| **Parallel Agents** | 多個 agent 同時處理不同任務 |
| **Worktrees** | Git worktree 隔離，每個 agent 在獨立分支工作 |
| **Skills** | 可重用的工作流程範本 |
| **Automations** | 自動化觸發器（如 PR 建立時自動 review） |
| **GPT-5.3-Codex-Spark** | 研究預覽，跑在低延遲硬體上，僅開放 ChatGPT Pro，額度另計 |

Parallel agents + worktrees 的組合特別實用：多個 agent 可以同時在不同 git worktree 中工作，互不干擾。例如一個 agent 修 bug、另一個寫測試、第三個更新文件，全部平行進行。

## Credit 機制

Credit 消耗量取決於使用的模型、input/cached/output 各自的 token 量，以及是否開 fast mode（fast mode 的 credit 消耗率更高）。圖片生成平均也比文字快 3-5 倍燒額度。

幾個關鍵規則：

1. **訂閱方案不會超額計費**——額度用完就等下個週期，不會自動扣款
2. 部分 Plus / Pro 使用者**可以加購 credit** 繼續用；Business / Enterprise / Edu 走 flexible pricing 者可買 workspace credit
3. **改用更便宜的模型**（Terra → Luna）可以延長剩餘額度的使用壽命
4. Credit 消耗在設定頁可查，Codex 也會在 thread 層級顯示用量；workspace 開啟成本可見度後會附上估算金額——那是規劃用的估計，不是帳單

這個設計避免了「用到一半突然收到高額帳單」的風險，對於預算敏感的個人開發者或小型團隊來說是重要的保障。

## 適用場景

Codex 最適合以下情境：

- **已經在 ChatGPT 生態系的使用者**：如果你已經訂閱 ChatGPT，Codex 幾乎是零邊際成本的額外能力
- **只為寫程式付費的人**：$100 的 Pro 5x 就是為這個情境設的層級，模型與 $200 那層一樣
- **需要 Enterprise 整合的組織**：Slack bot、GitHub Actions、SSO 等企業功能在其他 Agent CLI 工具中較少見
- **需要跨介面一致設定的人**：桌面版、CLI、IDE 擴充共用一份 `config.toml`

不太適合的場景：需要完全本地模型、需要自訂 routing 策略、或不在 OpenAI 生態系的團隊。

## 參考資料

- [Pricing – Codex | OpenAI Developers](https://developers.openai.com/codex/pricing)
- [Models – Codex | OpenAI Developers](https://developers.openai.com/codex/models)
- [Codex rate card | OpenAI Help Center](https://help.openai.com/en/articles/20001106-codex-rate-card)
- [Using Codex with your ChatGPT plan | OpenAI Help Center](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan)
- [Introducing Codex | OpenAI](https://openai.com/index/introducing-codex/)
- [Codex | AI Coding Partner from OpenAI](https://openai.com/codex/)
- [Pricing | OpenAI API](https://developers.openai.com/api/docs/pricing)

## 更新紀錄

- 2026-08-18：對照官方 pricing / models / rate card 頁全面翻新。①訂閱方案表補上 Go（$8）與 2026/4 才出現的 Pro 5x（$100），原文只寫 Pro $200；②計費已於 2026/4/2 從「每則訊息」改為按 token 計 credit，補上 rate card；③模型主線換成 GPT-5.6 Sol / Terra / Luna，**移除整段「GPT-5.4 指揮 + mini 執行、mini 只吃 30% 額度」的路由描述**——該機制已非現況，且 GPT-5.4 與 5.4 mini 將於 2026/8/31 在 ChatGPT 登入模式下退場；④移除 404 的參考連結，改引官方 rate card 與 models 頁
