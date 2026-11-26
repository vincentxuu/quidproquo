---
title: "從唯讀開始：台灣讀者現在能用哪個常駐 agent，權限怎麼一週一週打開"
date: 2026-11-20
category: ai
type: guide
tags: [ai-agent, always-on-agent, gemini, openai, openclaw]
lang: zh-TW
tldr: "台灣現在能用的常駐 agent 有：Tasks in Gemini（要 Google AI Pro 或 Ultra）、OpenAI Dots（Pro，或逐步開放的部分 Plus）、Grok Bot（X Subscription 的 Premium 以上）、Hark Pro，以及自架的 OpenClaw、Hermes。先挑你已經在付訂閱的那家，只開一個。第一週只讓它讀、只回報；第二週讓它擬草稿，但寄出、付款都由你按；第三週起一次只開一類寫入動作，碰錢一律逐筆核准、用額度低的卡。各家都有一個要先關的設定：Grok Bot 的 Vault 存卡與「一律允許」、Gemini 的 Always allow、Dots 的本機電腦存取、OpenClaw 的工具全開。"
description: "常駐型 AI agent 系列最後一篇：依台灣可用性和你既有的訂閱挑一個產品，第一週唯讀、第二週草稿、第三週起逐類開寫入的步驟，Tasks in Gemini、Dots、Grok Bot、Hark Pro、OpenClaw、Hermes 各自先關和先開的設定，以及什麼情況先別用。"
series:
  name: "常駐型 AI agent"
  order: 24
draft: false
---

> :globe: [English version](/posts/ai/2026-11-20-start-read-only-en)

| 你的情況 | 先試 | 條件（11 月 24 日查） |
|---|---|---|
| 已經付 Google AI Pro 或 Ultra | Tasks in Gemini | 台灣要付費方案；免費開放的六國不含台灣 |
| 已經付 ChatGPT Pro | OpenAI Dots | Plus 逐步開放中，不一定輪得到 |
| 已經付 X Premium 以上 | Grok Bot | 官方文件沒列地區限制 |
| 想在 iPhone 上試、不想先付費 | Hark Pro | 台灣 App Store 有上架；示範多是美國網站 |
| 會架伺服器、想自己選模型 | OpenClaw 或 Hermes | 機器、修補、模型費用自己扛 |
| 以上都不是 | 先不用 | Muse、Claude Duet 台灣還不能用 |

[TechCrunch 報導](https://techcrunch.com/2026/11/18/more-banks-says-customers-using-ai-agents-are-on-their-own-even-if-they-get-hacked/)美國銀行改條款的同一篇文章裡，提到 Anthropic 這個月推出的個人理財工具。它的設計刻意寫在介紹上：唯讀，「can't move, manage, or invest your money」。

一家能做出會寄信、會付款的 agent 的公司，在碰到錢的時候選擇只讓它看。這篇照同樣的思路，給一個從唯讀開始、權限一週一週打開的做法。

這是系列的最後一篇：台灣讀者現在用哪個，權限怎麼一步步開。

## 第零步：只挑一個

台灣可用性的細節在[總覽](/posts/ai/2026-11-20-always-on-agents-overview)，這裡用上面那張表挑。兩個原則：

- **挑你已經在付訂閱的那家**：[order 21](/posts/ai/2026-11-20-who-pays-for-always-on) 講過，多數產品把背景工作塞進你既有的用量池，不用另外付費，也比較容易看出它吃掉多少。
- **一次只開一個**：同時開兩個，你會分不清哪個做了什麼，也會讓兩個 agent 讀同一個信箱、互相觸發。

這週我再查了兩家的說明頁。[Tasks in Gemini](https://support.google.com/gemini/answer/17094710?hl=en)免費開放的是澳洲、加拿大、印度、日本、韓國、美國。其他支援 Gemini 的地區要 Google AI Pro 或 Ultra，排除歐洲經濟區、奈及利亞、瑞士、英國。[Dots](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot) 開放給 Pro 和逐步開放中的部分 Plus 使用者，排除歐洲經濟區、英國、瑞士。官方寫明客服沒辦法幫你提前開通，從 Pro 降回 Plus 會失去你的 dot。

## 第一週：只讓它讀

目標是看它會注意到什麼，不讓它做任何事。

**要做的：**

1. **只接一到兩個資料來源**：例如工作信箱和行事曆。不要第一天就把雲端硬碟、Slack、銀行全部接上。
2. **不設付款方式**：不存卡、不接錢包。
3. **給它一個只回報的工作**：例如「每天早上 8 點，告訴我今天有哪些信需要回、行程有沒有衝突。只回報，不要回信、不要改行事曆。」
4. **每天花五分鐘對照**：它說的對不對、漏了什麼、多報了什麼。這就是 [order 20](/posts/ai/2026-11-20-evaluating-always-on-agents) 講的一週評測，先做自己的標準答案。

**第一週結束時問自己：**

- 它注意到的事，有幾成是你本來就會注意到的？有沒有你漏掉、它抓到的？
- 它多報的東西多不多？
- 用量條走了多少？

如果它連該注意的事都常漏，就不用進第二週，這個產品對你這件工作沒用。

## 第二週：讓它擬草稿

目標是看它做得對不對，但每一個對外動作都由你按。

**要做的：**

1. **讓它擬回信、擬行程調整，但不寄出、不修改**：草稿交給你看，你自己寄。
2. **把規則寫進設定，不只寫在對話裡**：[order 17](/posts/ai/2026-11-20-overreaching-agents) 講過，寫在對話裡的「先問我」會在長任務裡被遺忘。能用設定擋的，用設定擋。
3. **記下它的草稿你改了多少**：幾乎不用改的類型，是第三週可以考慮放手的候選。

**第二週結束時問自己：**

- 它擬的東西，哪一類你幾乎不用改？
- 哪一類每次都要大改？那一類就留給自己。

## 第三週起：一次只開一類寫入

目標是逐類放手，每次只多開一種動作，觀察一週再開下一種。

**順序建議**，從錯了最容易收拾的開始：

1. 只影響你自己、可以復原的：例如在自己的行事曆加事件、整理標籤。
2. 對外但可以補救的：例如回覆例行的信。設成「先問」，你按了才寄。
3. 碰錢的：最後才開，而且一律逐筆核准、用單次卡或額度低的卡。[order 23](/posts/ai/2026-11-20-who-is-liable) 講過，條款和銀行都把損失放在你身上。

**永遠不要開的：**

- 把網銀帳密交給 agent。
- 碰錢的動作選「一律允許」。
- 刪除共用檔案、改帳號密碼這類撤不回的動作，自動執行。

## 各家要先關、先開的設定

| 產品 | 第一天先關 | 第一天先開 |
|---|---|---|
| Tasks in Gemini | 不要對任何類型選 Always allow | 保留預設：寄信、購買、送出表單、登入網站每次都問 |
| OpenAI Dots | 本機電腦存取（預設是關的，保持關閉） | 自訂規則：寄訊息給外部設「Ask before taking action」，刪除共用檔案設「Hand off to you」 |
| Grok Bot | 不要把卡存進 Vault；Auto Top-up 關掉 | Auto Review 保持開啟；加一條 Ask first：寄外部信件前先問 |
| Hark Pro | 不要選「這類任務不用確認」 | 連 Gmail 前看清楚權限畫面 |
| OpenClaw | 工具全開（排程工作的 `toolsAllow` 改成允許清單） | 沙盒（預設關閉，要自己開）；Proactive check 想用再自己打開 |
| Hermes Agent | 不要開 YOLO 模式或 `approvals.mode: off` | 保留預設的 `smart` 審批；排程碰到危險指令預設拒絕 |

這些設定的細節，在各產品的那一篇：[Gemini](/posts/ai/2026-11-20-gemini-tasks)、[Dots](/posts/ai/2026-11-20-openai-dots)、[Grok Bot](/posts/ai/2026-11-20-grok-bot)、[Hark Pro](/posts/ai/2026-11-20-hark-pro)、[自架的 OpenClaw 與 Hermes](/posts/ai/2026-11-20-self-hosted-always-on-agents)。

Grok Bot 有一個要特別注意的地方：[order 8](/posts/ai/2026-11-20-grok-bot) 講過，同一個帳號的所有 bot 共用一台電腦和所有登入。你替一個 bot 登入了某個網站，其他 bot 也拿得到。第一週只開一個 bot。

## 每兩到四週回頭檢查

[order 19](/posts/ai/2026-11-20-human-side-of-agents) 講過信任要跟它的表現對得上。開了權限之後，定期問：

1. 最近一次發現它出錯是什麼時候？想不起來，可能是你沒在看。
2. 你按「同意」之前還有在讀嗎？沒在讀，就減少要你確認的項目。
3. 用量和花費有沒有超出預期？
4. 它的活動紀錄跟你的信用卡帳單、寄件備份對得上嗎？
5. 有沒有哪個權限開了卻幾乎沒用到？沒用到就關掉。

## 什麼情況先別用

- **你沒有時間每天花五分鐘看它**：第一週的對照是整個做法的基礎，跳過它，後面的放手都沒有根據。
- **你想讓它處理的事，錯了承受不起，又檢查不出來**：例如你不熟的投資、法律文件。
- **你的工作資料受公司規定限制**：先問公司的資訊單位，金管會的諮詢文件也提醒，能對外傳送、寫入系統的 agent 要另外評估。
- **你想要一個裝了就不用管的工具**：常駐 agent 現在還做不到。

## 系列回顧

這個系列從[總覽](/posts/ai/2026-11-20-always-on-agents-overview)和[三級醒來的階梯](/posts/ai/2026-11-20-always-on-agent-anatomy)開始，走過四條路線：

- **路線一，廠商的雲端電腦**：Gemini、Muse、Hark、Instinct、Duet、Dots、Grok Bot。
- **路線二，團隊與企業**：Devin Bots、Perplexity teammates、Microsoft Autopilot、Salesforce、OpenClaw Enterprise。
- **路線三，自己的機器**：自架的 OpenClaw 與 Hermes，以及中國的 Claw 家族。
- **路線四，住進超級 app**：LINE、Kakao、Naver。

之後六篇是橫跨所有產品的問題：主動過頭、安全五層、人的那一面、怎麼評估、錢誰出、另一端、出事誰負責。

這些產品都在快速變動：額度會改、地區會開放、預設會調整。這篇的設定表和可用性，以 11 月 24 日查到的為準；開始用之前，回到各家的說明頁再確認一次。

## 參考資料

- [More banks say customers using AI agents are on their own — even if they get hacked](https://techcrunch.com/2026/11/18/more-banks-says-customers-using-ai-agents-are-on-their-own-even-if-they-get-hacked/)（TechCrunch，2026-11-18）
- [Create & manage schedules for tasks in Gemini](https://support.google.com/gemini/answer/17094710?hl=en)（Gemini Apps Help，2026-11-24 查）
- [Getting started with your dot](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot)（OpenAI Help Center，2026-11-24 查）
- [Approvals, security, and privacy](https://docs.x.ai/grok-bot/approvals-security-and-privacy)（xAI Grok Bot 文件）
- [Hark Terms of Service](https://hark.com/terms)（Hark）
- [Sandboxing](https://docs.openclaw.ai/gateway/sandboxing)（OpenClaw 文件）
- [Heartbeat migration](https://docs.openclaw.ai/gateway/heartbeat)（OpenClaw 文件）
- [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)（Hermes Agent 文件）
