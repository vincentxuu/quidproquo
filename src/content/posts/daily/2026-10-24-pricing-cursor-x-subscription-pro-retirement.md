---
title: "定價追蹤｜Cursor 併入 The X Subscription，$20 Pro 方案正式退場"
date: 2026-10-24
category: daily
type: digest
tags: [ai-agent, pricing, daily, cursor]
lang: zh-TW
description: "Cursor 自 2026/10/12 起把定價換成跟 xAI Grok 共用的 The X Subscription，新戶的 $20 Pro 方案消失，想在 Cursor 裡用 Claude/GPT/Gemini 門檻拉到 Premium 的 $30，$8 的 Plus 方案完全不給用第三方模型。"
tldr: "Cursor 10/12 把新戶定價換成 The X Subscription：Free、Plus $8（僅 Grok）、Premium $30、Super $100、Ultra $200。舊的 $20 Pro 方案只保留給既有訂閱者，新戶想碰 Claude/GPT/Gemini 起跳價從 $20 漲到 $30（↑50%），第三方模型 token 費率不變，仍是 API 原價另計。"
series:
  name: "AI Pricing Watch"
  order: 28
---

> 🌏 [English version](/posts/daily/2026-10-24-pricing-cursor-x-subscription-pro-retirement-en)


## 變更摘要

Cursor 在 2026 年 10 月 12 日把新戶的價目表整個換掉：原本 $20/月的 Pro 方案從選單上消失，取而代之是跟 xAI 的 Grok 共用的「The X Subscription」五個級別（Free、Plus $8、Premium $30、Super $100、Ultra $200）。這不是單純漲價——是把一個開發工具的訂閱,折進一個消費級社群平台的訂閱體系裡。SpaceX 完成收購 Cursor 兩個月後,新使用者想在 Cursor 裡碰 Claude、GPT、Gemini,起跳價從 $20 直接拉到 $30,而最便宜的 $8 方案乾脆把所有第三方模型都排除在外,只准用 Grok。既有訂閱者的 Hobby/Pro/Pro+/Teams 方案照舊保留,代價是:除非主動切換,否則你看到的「Cursor 定價」跟新戶看到的是兩套完全不同的系統。

## 前後對照

| 項目 | 舊（10/12 前的 Pro，僅既有訂閱者保留） | 新（Premium，The X Subscription） | 變化 | 生效日 |
|---|---|---|---|---|
| 月費 | $20/月 | $30/月 | ↑50% | 2026-10-12 |
| 碰到 Claude/GPT/Gemini 的最低門檻 | $20/月（Pro 即含） | $30/月（Premium；$8 的 Plus 完全不給用） | 門檻拉高一級 | 2026-10-12 |
| 第三方模型用量池 | 計入「Other Models pool」 | 不進任何用量池，官方註明需另外購買 | 用量池不再覆蓋第三方模型 | 2026-10-12 |
| Cloud agents／Bugbot／Origin code hosting | Pro 即含 | 要 Premium 才開放 | 條件不變，但入門價漲 | 2026-10-12 |
| Teams 座位費 | Standard $40／Premium $120（每人/月） | Premium/Super/Ultra 座位，跟個人價一致，從 $30 起 | 多數情境↓ | 2026-10-12 |

## 成本試算

**場景**：一個每天用 Cursor 搭配 Claude Sonnet 5.5 寫 code 的工程師，每月經 Cursor 呼叫 Claude 處理約 20M input + 8M output tokens（中度每日使用量，Claude Sonnet 5.5 在 Cursor 的官方費率為 $2.00/1M input、$10.00/1M output，與訂閱方案無關）。

| | 舊制（Pro $20 + Claude 用量） | 新制（Premium $30 + Claude 用量） | 月增 |
|---|---|---|---|
| 訂閱費 | $20 | $30 | $10 |
| Claude Sonnet 5.5 用量費 | $120 | $120 | $0 |
| **合計** | **$140/月** | **$150/月** | **$10（↑7.1%）** |

對已經在重度使用 Claude 的工程師來說，漲幅只有 7%——第三方模型本來就按 API 原價另計，這部分費率沒變。真正被重新定價的是「資格門檻」：以前 $20 的 Pro 就能把 Claude 用起來，現在想碰任何一個非 Grok 模型，起跳價是 $30，而最低的 $8 方案直接把 Claude/GPT/Gemini 全部排除，只剩 Grok 可用。對原本只是偶爾用 Claude、預算卡在 $20 上下的輕量使用者，實際感受到的漲幅會比這張表更明顯。

## 對開發者/企業的影響

### 誰最受益

已經在用 Grok 寫 code、同時也想要 X Premium+ 社群功能的使用者是最大贏家——xAI 官方說法是 Premium 的 $30 打包了「原本要 $90」的 SuperGrok、Cursor Pro、X Premium+ 三個訂閱。但這群人跟「只想要一個好用的 AI coding agent」的典型 Cursor 使用者，其實是兩種不同的人設，前者才是這次改版真正受益的對象。

### 競爭格局影響

主要 AI coding agent 訂閱的入門門檻對照（USD/月）：

| 工具 | 入門付費方案 | 包含內容 |
|---|---|---|
| Cursor Plus | $8 | 僅 Grok 模型，無第三方模型 |
| Cursor Premium | $30 | Grok + 第三方模型（API 原價另計）+ cloud agents + Bugbot |
| Claude Code（Max 5x） | $100 | Claude 模型用量，含 Claude Code |
| Claude Code（Max 20x） | $200 | Claude 模型用量，含 Claude Code |

Cursor 的 Super（$100）和 Ultra（$200）剛好卡進 Claude Max 的兩個價位，但給的是 Grok 用量放大倍數，不是 Claude 用量——想拿到「全包式」的重度模型用量，兩邊都繞不開大額訂閱費，只是繞的路徑不一樣。

### 行動建議

- 如果你是新使用者，想在 Cursor 裡用 Claude/GPT：直接編列 Premium 起跳的 $30，不要被 $8 的 Plus 吸引，那個方案完全碰不到第三方模型。
- 如果你是既有訂閱者在用 Pro（$20）：不用主動做任何事，舊方案目前照舊保留，但留意 Cursor 說明中心和官網定價頁已經是兩套不同資訊，新功能可能優先上新制。
- 如果你的團隊在用 Teams：重新核算座位數，新制座位價跟個人方案一致（$30 起），官方說比舊制（$40/$120）划算，但要連同 Cursor Token Rate（第三方模型每百萬 token 加收 $0.25）一起算進帳單。
- 如果你主要靠 Claude/GPT 寫 code、幾乎不碰 Grok：這次改版對你的意義只是訂閱費漲了 $10，實際 token 費率沒變，不用急著換工具，但值得重新比價直接訂閱 Claude Code 是否更單純。

## 時效提醒

⚠️ **方案異動**：新使用者自 2026-10-12 起只能選「The X Subscription」五個級別，舊的 Hobby/Pro/Pro+/Teams 方案僅對既有訂閱者保留，Cursor 官方沒有公告保留期限，建議假設隨時可能被收回。

## 今日收穫

這次改版最容易被看漏的細節，不是價格漲了多少，是「資格」本身被重新定義：以前用 Cursor 碰 Claude/GPT 只是「多付一點 API 費用」的問題，現在變成「先付 $30 買資格，才有資格談 API 費用」的問題——$8 的 Plus 方案不是漲價，是把一整層需求從選單上直接刪除。追蹤 AI 工具定價時容易只盯著數字變化，但「誰被允許用」這件事本身，有時候比價格數字更值得記一筆。

## 參考資料

- [Cursor Pricing（官方定價頁）](https://cursor.com/pricing)
- [Cursor Pricing 2026: X Subscription Tiers and Usage Limits | Fello AI](https://felloai.com/cursor-pricing/)
- [Cursor Pricing 2026: The $20 Pro Plan Is Gone | DevTools Review](https://devtoolsreview.com/pricing/cursor-pricing/)
