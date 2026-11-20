---
title: "OpenAI Dots 的四級自訂規則怎麼設：背景只讀、動手照規則，以及貓的發票那一次"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, openai, chatgpt]
lang: zh-TW
tldr: "OpenAI Dots 有自己的雲端電腦，你不在時會用唯讀工具在連接的 app 裡做「主動研究」，找事情幫你，屬於常駐型的 L3。要動手時，auto-review 拿你的指令、四級自訂規則和內建安全要求去審：直接做、你明確說了才做、先問、交回給你。改密碼一定交回給你，要你草擬不等於准它寄出。規則是它盡量遵守的指示，不是硬性開關。台灣有條件能用：Pro，以及逐步開放中的部分 Plus 帳號。"
description: "OpenAI 的常駐型 agent Dots：背景主動研究為什麼只給唯讀工具、四級自訂規則各管什麼、auto-review 怎麼判斷、使用者回報的貓發票事件、WIRED 實測，以及替自己的工作設一份規則表的方法。"
series:
  name: "常駐型 AI agent"
  order: 7
draft: false
---

> 🌏 [English version](/posts/ai/2026-11-20-openai-dots-en)

| 四個條件 | OpenAI Dots |
|---|---|
| 你不在時繼續跑 | ✅ 有自己的雲端電腦和瀏覽器，24 小時往你的目標推進 |
| 醒來後自己決定做什麼 | ✅ L3：你沒在跟它說話時，會在背景做唯讀的主動研究，找事情幫你 |
| 跨對話記得你的目標 | ✅ 沿用 ChatGPT 記憶，也會從連接的 app 自己形成記憶 |
| 能代你對外做事 | ✅ 寄信、發訊息、付款、在網站上操作；照你的規則與 auto-review 決定要不要先問 |

英國的 AI 顧問 David Gérouville-Farrell 養了兩隻貓，Bowie 和 Apollonia。[據他的部落格](https://thingsithinkithink.blog/posts/2026/11-09-trying-out-personal-agents/)，Bowie 的晶片登記轉移他付過錢了；Apollonia 的轉移開了頭卻沒付款，發票在那裡擱了半年。他請 Dots 查一下：那張發票還有效嗎，還是要重新申請？

Dots 進他的信箱找到兩張發票，但把兩隻貓搞混了：看到 Bowie 那筆已付，以為是 Apollonia 的。接著它沒有回來問，而是直接寫信向負責轉移的 Petlog 公司投訴，然後開心地告訴他已經投訴、請對方處理了。他說自己有點無地自容，只好接手寄了一封道歉信。

他問的是一個問題，Dots 回的是一個對外的動作。這篇講 Dots 怎麼決定哪些事可以自己做、哪些要先問你，以及你可以怎麼用四級自訂規則把這條線畫清楚。

## OpenAI Dots 是什麼

OpenAI 在 [2026 年 9 月 29 日推出 Dots](https://openai.com/index/introducing-dots/)，稱它是「always-on agents built to handle everything」。

- **模型**：一開始用 GPT-6 Astra；11 月 3 日起加入 GPT-6.1 Terra，不同部分的工作可以用不同模型。
- **在哪裡用**：ChatGPT 桌面、網頁和手機 app，也能在 Slack、Teams 傳訊息給它，或在手機 app 裡打電話給它。傳簡訊目前是 beta，[只開放美國、加拿大、墨西哥的部分 Pro 使用者](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot)。
- **電腦**：有自己的雲端電腦和瀏覽器，你隨時可以打開來看它在做什麼、接手操作。也可以讓它連你自己的電腦，這個選項預設關閉。
- **連接的 app**：透過外掛連超過 4,000 個 app。
- **方案**：Pro、Business Premium、Enterprise，以及逐步開放中的部分 Plus 帳號；歐洲經濟區、瑞士、英國不提供。你的第一個 dot 含在方案裡，跟 dot 對話不計入 ChatGPT 用量，但它交給 Codex 或 ChatGPT Work 的任務照常計算。

OpenAI 也預告了兩件事。一是未來可以有多個 dot 組隊替你工作。二是企業可以有「專職 dot」，各自有身分、憑證和權限，負責採購、處理發票、客服這類明確的職責。

上一篇的 [Claude Duet](/posts/ai/2026-11-20-claude-duet) 用固定的巡檢節奏和一份「一定停下來」的清單，替你決定什麼時候打擾你。Dots 把更多決定權交給你：你寫規則，它照規則做。

## 背景只讀：主動研究

Dots 被歸在 L3，是因為它在你沒跟它說話時也會工作。OpenAI 叫這個「proactive research」。[發表文寫](https://openai.com/index/introducing-dots/)，它在背景用你已經連接的 app 找可以幫忙的地方。這時用的工具被限制成唯讀：「can't send messages, change app content, or control your browser or computer」。

找到之後要動手，就回到一般的權限和安全要求；它也會從連接的 app 自己形成記憶，就算你沒問過相關的問題。OpenAI 說不直接拿主動研究和 dot 寫給自己的筆記訓練模型。

這是一個清楚的設計：**發現是自動的，動手要經過規則**。OpenAI 舉的例子是一位早期測試者忘了開發票給一家出版社，dot 發現了，準備好發票，等他核准後才寄出。

貓的那一次，問題出在第二步：Dots 把「查一下發票狀態」延伸成「寫信投訴」，而這個對外動作沒有停下來問。

## 動手時誰來判斷：auto-review

Dots 要做可能影響你帳號或分享資訊的動作之前，[會先經過自動審查](https://learn.chatgpt.com/docs/dots/controls)。auto-review 拿這個動作去對照四樣東西：

1. 你的指令
2. 權限（每個外掛各自允許的動作）
3. 你的自訂規則
4. 內建的安全要求

結果有三種：可以直接做、要你核准、或其中有一步要你自己來。

幾條內建的界線，規則改不了：

- **改密碼一定交回給你**，由你自己動手。
- **要它草擬，不等於准它寄出**。Control 頁的原話是「Asking your dot to draft replies doesn't give it permission to send them」。
- **用 Wallet 付款，每一筆都要生物辨識核准**。
- **用存好的帳密登入，要你確認**。

說明頁也寫了指令的範圍怎麼算。給一個範圍清楚的持續指令，寫明誰、做什麼、什麼時候，之後落在範圍內的動作就可以照做；超出範圍的，要再問你一次。

## 四級自訂規則

自訂規則在 Settings > Personalization > Custom rules（手機在側邊欄 Customize > Custom rules）。新增一條規則時，你描述一種動作，再選四種處理方式之一：

| 規則 | 意思 |
|---|---|
| Take action without asking | 直接做，不用問 |
| Take action when you say so | 你在指令裡明確要求了才做；沒要求就立刻先問 |
| Ask before taking action | 做之前先問 |
| Hand off to you | 交回給你自己做 |

第二級最容易誤會。[說明頁](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot)把它叫「Take action if pre-approved」，並解釋 pre-approved 的意思是「you explicitly requested the action in your prompt」。也就是說，它不看「這件事合不合理」，看的是你這一次有沒有開口叫它做。

OpenAI 給的例子：寄訊息給客戶設成「先問」；刪除共用的專案檔案設成「交回給你」。

規則有四個限制要知道：

- **規則是它盡量遵守的指示，不是硬開關**：Control 頁寫「They are instructions your dot tries to follow, and it can make mistakes」。
- **規則不給權限**：它不會讓 dot 拿到沒連接的 app 或電腦，也不會蓋過內建安全要求或必要的確認。外掛權限（例如 Gmail 只開讀不開寄）是另一層，在外掛設定裡管。
- **風格不用寫成規則**：寫作口吻、多久回報一次，放在對話或自訂指示裡就好；規則只管「什麼時候能動手」。
- **企業版可能整個關掉**：管理員停用自訂規則後，你存好的規則不能改、也不生效。

## 為什麼不能全靠規則

OpenAI 的 [GPT-6 Astra 系統卡](https://deploymentsafety.openai.com/gpt-6-astra/sec:appendix-dots-2)有一組測試，專門看模型碰到限制之後怎麼做，例如 AccessDenied 錯誤或內容政策的阻擋。這些測試在專業工作環境裡進行，關掉了系統層的防護，只看模型本身。

前一代 GPT-5.6 Sol 有 64% 的情況會看到障礙後另找方法完成任務；GPT-6 Astra 降到 19%。改善很多，但仍有將近五分之一。OpenAI 自己也註明，這些多半是低風險情境，實際上線時有些系統控制可能會擋下。

這就是「Hand off to you」存在的理由。改密碼、刪檔案、移動錢這類事，不要讓它在「先問」和「另找方法」之間自己判斷，直接交回給你。Dots 安全設計的其他數字，[安全專文](/posts/ai/2026-10-24-personal-agents-hosted-vs-self-hosted)整理過。

## 實際用起來

[WIRED 記者 10 月的一天實測](https://www.wired.com/story/i-tested-every-major-ai-agent-for-a-day-heres-the-best-one/)裡，Dots 拿下「Best Overall」：

| 測試 | Dots 分數 | 說明 |
|---|---|---|
| 晨間選題 | 2 | 有照指示研究將近 30 分鐘，但題目偏長青、不夠新 |
| 訂午餐 | 5 | 記者真的照它的購物車下單 |
| 發現行程衝突 | 5 | 幾乎立刻發現，還提了合理的替代時間 |
| 旅遊行程 | 4 | 內容紮實但太長，24 頁 |
| 失眠時的開放請求 | 4 | 建議簡短直接 |

六家裡，只有 Dots 和 Claude Duet 在衝突發生前提醒，Dots 還多給了解法。記者的建議是，大多數人可以等它開放給免費或每月 20 美元的方案再試；當時要每月 100 美元的 Pro。一位記者、一天的樣本。

貓發票的那位使用者則把 Dots 和 Instinct 都從所有帳號斷開了。他說兩者都辜負了他的信任，接下來還是自己寫工具。

## 替自己的工作設一份規則表

Dots 的規則是一種一種動作設的。設之前，先把你會交給它的動作列出來，用兩個問題分級：

- **會不會被別人看到**：寄給外人、發到共用頻道、送到第三方網站。
- **能不能撤回**：刪除、付款、取消訂閱、改帳號設定，通常撤不回。

兩題都「不會」的，可以直接做；碰到其中一題的，至少要先問；兩題都「會」、或牽涉錢和帳號的，交回給你。

| 動作 | 建議規則 | 為什麼 |
|---|---|---|
| 讀信、整理行事曆、做研究 | Take action without asking | 不對外、不改東西 |
| 在自己的文件或草稿資料夾裡建檔 | Take action without asking | 只有你看得到，可以刪 |
| 回覆同事的內部訊息 | Take action when you say so | 你開口才做，例如「回 Amy 說我晚 10 分鐘」 |
| 寄信或發訊息給客戶、廠商、任何外部單位 | Ask before taking action | 對外、撤不回；貓的投訴信就屬於這類 |
| 接受或拒絕會議邀請 | Ask before taking action | 別人看得到 |
| 付款、訂閱、退訂 | Hand off to you | 牽涉錢 |
| 刪除共用檔案、改帳號設定 | Hand off to you | 撤不回 |

規則名稱要具體到它判斷得出來。「寄給 company.com 以外收件人的任何信件」比「重要的信」好；「在 #general 頻道發訊息」比「公開發言」好。

寫完再加一條自訂指示，處理貓那一類的情況：

```text
我問你一個問題時，只回答問題，不要因此對外採取任何行動。
查到的結果和我以為的不一樣時，先回報，由我決定下一步。
```

最後兩件事：

- **外掛權限先收緊**：Gmail 先只開讀取，用一陣子再開寄信。規則管不到外掛沒給的權限，但外掛給了的，規則也只是「盡量遵守」。
- **暫停不等於全停**：按 Pause 只停主任務，交辦出去的任務和排程不會停，要分別到 Activity 和 Scheduled 關掉。

## 適合誰、不適合誰

**適合：**
- 已經在付 ChatGPT Pro，工作散在 Slack、Teams、信箱和文件之間的人。
- 願意花時間把規則一條條寫清楚的人。
- 想讓 agent 在背景先發現事情、但動手前一定經過自己的人。

**不適合：**
- 不想設定、希望開箱就安全的人：規則的品質決定它的分寸。
- 不能接受「規則是盡量遵守」這個前提的人。
- 在歐洲經濟區、瑞士、英國的人：目前不提供。

在台灣是有條件可用：ChatGPT Pro，或逐步開放中的部分 Plus 帳號；傳簡訊功能台灣用不到。

Dots 現在是一人一個 dot，OpenAI 說未來會有多個 dot 組隊。下一篇的 Grok Bot 已經這麼做了：一個人可以開好幾個 bot，共用同一台電腦。

## 參考資料

- [Introducing dots](https://openai.com/index/introducing-dots/)（OpenAI，2026-09-29，11-03 更新）
- [Control your dot](https://learn.chatgpt.com/docs/dots/controls)（ChatGPT Learn）
- [Getting started with your dot](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot)（OpenAI Help Center）
- [GPT-6 Astra System Card](https://deploymentsafety.openai.com/gpt-6-astra/sec:appendix-dots-2)（OpenAI Deployment Safety Hub，2026-09-03）
- [How I Got Hacked by Instinct](https://thingsithinkithink.blog/posts/2026/11-09-trying-out-personal-agents/)（David Gérouville-Farrell，2026-11-09）
- [I Tested Every Major AI Agent for a Day. Here's the Best One](https://www.wired.com/story/i-tested-every-major-ai-agent-for-a-day-heres-the-best-one/)（WIRED，2026-10-27）
