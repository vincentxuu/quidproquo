---
title: "BytePlus ModelArk Coding Plan：字節跳動的 AI 編碼訂閱方案"
date: 2026-08-25
category: ai
type: deep-dive
tags: [llm-api, agentic-coding, deepseek, claude-code, cursor, llm-pricing, coding]
lang: zh-TW
tldr: "BytePlus ModelArk Coding Plan 提供 Lite（$10/月）和 Pro（$50/月）兩種訂閱，整合 DeepSeek-V4、GLM-5.2、Seed-2.0 等多模型，支援 Claude Code、Cursor 等主流工具，Lite 月配額約 24,000 次請求，Pro 為其 5 倍。"
description: "BytePlus ModelArk Coding Plan 介紹：定價、配額、支援模型與工具、使用限制，以及與 Anthropic Max、OpenRouter 等方案的定位差異。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-byteplus-modelark-coding-plan-en)

BytePlus 是字節跳動的海外雲服務品牌，ModelArk 是其 AI 模型推論平台。Coding Plan 是 ModelArk 針對開發者 AI 編碼場景推出的訂閱方案——一個月費涵蓋多家模型，直接在 Claude Code、Cursor 這類工具裡使用，不需要自己管 API key 或設定推論端點。

## 定位：開發者的多模型月票

依 [BytePlus 官方文件](https://docs.byteplus.com/en/docs/ModelArk/1925114)，Coding Plan 的核心賣點是「一份訂閱、多家模型」。不像直接向 Anthropic 或 OpenAI 訂閱只能用自家模型，Coding Plan 把字節自研的 Seed 系列、DeepSeek、智譜 GLM、Moonshot Kimi、GPT-OSS 打包在同一個配額池裡，開發者可以根據任務複雜度即時切換。

這個設計適合的場景是：你需要 AI 輔助編碼但不想綁定單一模型供應商，或者你想在不同任務間切換模型（例如日常補全用輕量模型、複雜重構切推理模型）卻不想管理多組 API 金鑰。

## 方案與定價

Coding Plan 分為 Lite 和 Pro 兩檔，依 [官方新使用者頁面](https://docs.byteplus.com/en/docs/ModelArk/1928265) 的標準定價：

| 方案 | 月費 | 3 個月 | 定位 |
|------|------|--------|------|
| Lite | $10 USD | $30 USD | 中等強度開發，適合多數開發者 |
| Pro | $50 USD | $150 USD | 高強度複雜專案開發 |

限制：單一帳號最多連續訂閱 6 個月，且同帳號只能選一種方案。團隊方案（Team Plan）另計，Lite $20/月、Pro $100/月。

早期新使用者首購價（Lite $5/月、Pro $25/月）已於 2026 年 3 月 17 日停止。目前仍有推薦計畫：推薦朋友訂閱可獲對方訂單 10% 金額的代金券（無上限），被推薦者首單享 9 折。

## 配額機制

配額是 Coding Plan 最需要理解的部分。依官方文件，Lite 方案的配額分三層限制：

| 時間窗口 | Lite | Pro（5 倍 Lite） |
|----------|------|-------------------|
| 每 5 小時 | ≈ 1,900 次請求 | ≈ 9,500 次請求 |
| 每週 | ≈ 12,000 次請求 | ≈ 60,000 次請求 |
| 每月 | ≈ 24,000 次請求 | ≈ 120,000 次請求 |

官方表示 Lite 的總月配額約為 Claude Pro 方案的 3 倍。但這裡的「請求」指的是模型呼叫次數，不是使用者的 prompt 次數——一個使用者 prompt 在 Claude Code 或 Cursor 裡通常觸發 5–15 次模型呼叫（簡單 Q&A），複雜重構任務可達 30 次以上。換算下來，Lite 每月大約對應 1,600–4,800 個使用者 prompt。

配額用完後等待下個週期自動恢復：5 小時限制從首次請求起算，週限制每週一 00:00 重置，月限制在訂閱月首日 00:00 重置。超額不會扣其他帳戶餘額或套餐。

## 支援的模型

截至 2026 年 8 月，Coding Plan 提供以下模型，可在工具設定中即時切換：

| 模型 | 上下文窗口 | 特色 |
|------|-----------|------|
| Auto | — | 系統自動選最佳模型，優先提供最新版本 |
| Dola-Seed-2.0-Pro | — | 長鏈推理，適合複雜商業場景 |
| Dola-Seed-2.0-Lite | — | 均衡品質與速度的通用模型 |
| Dola-Seed-2.0-Code | — | 強化前端開發，支援多模態視覺理解 |
| Kimi-K2.5 | 256k | 強化前端能力，支援多模態 |
| GLM-5.1 | 200k | 程式碼生成、長程自主執行 |
| GLM-5.2 | 1M | 智譜旗艦，支援長時任務 |
| DeepSeek-V4-Flash | 1M | 快速低成本，預設開啟深度推理 |
| DeepSeek-V4-Pro | 1M | 強化 Agent 能力，配額消耗較高 |
| GPT-OSS-120b | — | 適合推理和 function calling |

GLM-5.2、DeepSeek-V4-Flash 和 DeepSeek-V4-Pro 支援 1M 上下文窗口，在處理大型 codebase 的長對話時有優勢。注意 DeepSeek-V4-Pro 的配額扣除係數較高，官方建議只在困難問題時使用。

## 支援的編碼工具

Coding Plan 的配額在所有支援工具間共享：

- **終端 / CLI**：Claude Code、OpenCode、Codex
- **IDE**：Cursor、TraeCode、Cline（VS Code）、Kilo Code、Roo Code
- **自託管 Agent**：Hermes Agent、OpenClaw

設定方式統一：填入 API Key 和 Base URL 即可。提供兩種相容端點：

- OpenAI 相容：`ark.ap-southeast.bytepluses.com/api/coding/v3`
- Anthropic 相容：`ark.ap-southeast.bytepluses.com/api/coding`

也可以將模型設為 `ark-code-latest`，在 ModelArk 控制台切換底層模型而不需改動工具設定。

## 使用限制

Coding Plan 有幾個重要限制需要事先了解：

1. **僅限 AI 編碼工具**：配額只能在上述支援的工具中使用，不能直接以 API 呼叫方式消耗。在非 AI 編碼工具中使用 Base URL 和 API Key 可能被判定為違規，導致訂閱停用或帳號凍結。
2. **單帳號單方案**：同一帳號只能選 Lite 或 Pro，不能混用。
3. **最長 6 個月**：單次最多連續訂閱 6 個月。
4. **區域可用性**：模型的可用性依地區而異，以控制台實際顯示為準。

## Pro 方案附加：ArkClaw

Pro 使用者在訂閱期間免費解鎖 ArkClaw——Lark（飛書國際版）上的 AI 助手。ArkClaw 支援 GPT、DeepSeek、GLM、Kimi 等多家模型，提供 AI 會議記錄、任務追蹤、多維表格管理、文件生成等功能，並有安全私有化部署、大容量雲端硬碟和技能安全掃描。

## 請求次數怎麼算

Coding Plan 的「請求」指的是模型呼叫次數，不是你打的 prompt 次數。在 Claude Code 或 Cursor 這類工具裡，一個使用者 prompt 會在背後對模型發出多次呼叫——讀檔、推理、生成、驗證各算一次。依[官方文件](https://docs.byteplus.com/en/docs/ModelArk/1925114)：

| 任務類型 | 每個 prompt 觸發的模型呼叫 |
|---------|--------------------------|
| 簡單 Q&A / 程式碼生成 | 5–15 次 |
| 重構 / 複雜任務 | 15–30+ 次 |

以中位數 15 次呼叫估算，實際能用的 prompt 次數：

| 方案 | 月請求配額 | ≈ 實際 prompt 次數 | 每 prompt 成本 |
|------|-----------|-------------------|---------------|
| Lite | 24,000 | ~1,600 | ~$0.006 |
| Pro | 120,000 | ~8,000 | ~$0.006 |

另外要注意：Embedding 模型（Skylark-Embedding-Vision）的呼叫同樣扣配額；DeepSeek-V4-Pro 的配額扣除係數較高，官方建議只在困難問題時使用，日常切其他模型。

## 划不划算：與主流方案的成本比較

Coding Plan 最直接的比較對象不是 OpenRouter 或 LiteLLM 這類按用量計費的 API 路由，而是 Anthropic Claude Pro / Max、Cursor Pro 這類固定月費方案。依 [codepick.dev 的 2026 年 AI 編碼工具成本比較](https://codepick.dev/en/compare/ai-coding-cost-comparison-2026)，各方案的計費模式分為三類：固定訂閱含隱性上限（Claude、Cursor、Copilot）、固定訂閱加滾動配額窗口（BytePlus Ark、MiniMax、百煉）、按用量 API。

| 方案 | 月費 | 模型 | 大約能用多少 | 使用限制 |
|------|------|------|-------------|---------|
| **BytePlus Lite** | $10 | 10+ 家 | ~1,600 prompts | 僅 AI 編碼工具 |
| **BytePlus Pro** | $50 | 10+ 家 | ~8,000 prompts | 僅 AI 編碼工具 |
| **Copilot** | $10 | GPT-4o 等 | 補全無限、chat 有限 | GitHub 生態 |
| **Claude Pro** | $20 | 僅 Claude | Lite 的 ~1/3（官方說法） | 無場景限制 |
| **Cursor Pro** | $20 | 多家 | 500 次快速請求 | 僅 Cursor |
| **Cursor Pro+** | $60 | 多家 | 更多配額 | 僅 Cursor |
| **Claude Max 5×** | $100 | 僅 Claude | Claude Pro 的 5 倍 | 無場景限制 |
| **Claude Max 20×** | $200 | 僅 Claude | Claude Pro 的 20 倍 | 無場景限制 |

### 核心取捨：量 vs 質

$10 Lite 方案在純配額數字上確實划算——官方說月配額約為 Claude Pro 的 3 倍，價格卻只要一半。但這裡有兩個根本取捨：

1. **模型能力差異**：Coding Plan 裡沒有 Claude Sonnet / Opus。Claude 和 GPT-4.1 在複雜 agentic coding（多步驟推理、大型 codebase 重構）的成功率仍高於 DeepSeek-V4 和 GLM-5.2。你拿到的是「量大但模型不是最頂尖」。
2. **場景限制**：配額只能在 AI 編碼工具裡消耗，不能拿來跑 batch 分析、做一般 API 呼叫、或寫自己的應用。Claude Pro / Max 的額度沒有這個限制。

### 依使用強度的建議組合

- **輕度**（每天幾個 prompt）：BytePlus Lite $10 就夠用，是最省錢的入門方案
- **中度**（每天 50+ prompts）：BytePlus Lite $10（日常任務）+ Claude Pro $20（複雜任務用 Claude）= $30/月，比 Cursor Pro+ $60 便宜且模型選擇更多
- **重度**（整天 agentic coding）：Claude Max $100–200 沒有替代品，因為你需要的是 Claude 模型本身的推理能力，不只是配額數量

## 適合誰

- **預算敏感的個人開發者**：$10/月的 Lite 方案提供比 Claude Pro 更多的配額和更多模型選擇
- **想試用中國模型的開發者**：DeepSeek-V4、GLM-5.2 等模型在某些任務上表現出色，Coding Plan 降低了試用門檻
- **不想管理多組 API 金鑰的人**：一個訂閱切換多家模型
- **搭配 Claude 使用**：日常用 Lite 省額度，複雜任務切回 Claude，整體月費可控

不適合的場景：需要在非編碼工具中使用 LLM API 的人、需要穩定長期訂閱（超過 6 個月）的團隊、對模型來源有合規要求的企業、重度依賴 Claude 推理能力的 agentic coding 使用者。

## 參考資料

- [BytePlus ModelArk Coding Plan 活動頁](https://www.byteplus.com/en/activity/codingplan)
- [ModelArk Coding Plan 訂閱概覽](https://docs.byteplus.com/en/docs/ModelArk/1925114)
- [新使用者限時優惠與定價](https://docs.byteplus.com/en/docs/ModelArk/1928265)
- [Coding Plan Team 方案概覽](https://docs.byteplus.com/en/docs/ModelArk/2276791)
- [ModelArk 定價頁](https://docs.byteplus.com/docs/ModelArk/1099320)
- [AI Coding Tool Monthly Cost Comparison 2026 — codepick.dev](https://codepick.dev/en/compare/ai-coding-cost-comparison-2026)
