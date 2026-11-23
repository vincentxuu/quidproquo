---
title: "常駐的錢誰出：一台 24 小時開著的電腦，各家怎麼收費、為什麼一直改額度"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, pricing, openclaw, grok]
lang: zh-TW
tldr: "常駐 agent 的收費有三種：塞進訂閱的共用用量池（Duet、Grok Bot、Gemini、Muse、Hark、Dots）、按任務扣點或設預算（Perplexity、Devin Bots、Kimi Claw）、自架自己付伺服器和模型（OpenClaw、Hermes）。共通點是背景工作一直在吃同一個池子：Grok Bot 在 11 月縮了額度，Musk 說服務成本相對營收高到撐不住；Claude Duet 的巡檢頻率直接寫明受額度限制。最影響花費的是醒來的頻率和每次帶多少脈絡：同樣每 30 分鐘檢查一次，帶著整段主對話跑，一天可能是 480 萬個 token；改成乾淨的獨立工作或沒變化就不叫模型，可以少一兩個數量級。"
description: "常駐 agent 的三種收費方式與各家的用量池、扣點和預算設計，Grok Bot 縮額度的經過，Claude Duet 巡檢頻率與額度的取捨，OpenClaw 與 Hermes 自架的成本結構和省錢設定，QClaw 停運時訂閱怎麼處理，以及估算一件例行工作在三種收費方式下大概吃掉多少的方法。"
series:
  name: "常駐型 AI agent"
  order: 21
draft: false
---

> :globe: [English version](/posts/ai/2026-11-20-who-pays-for-always-on-en)

| 收費方式 | 產品 | 背景工作怎麼算 | 怎麼控制 |
|---|---|---|---|
| 訂閱的共用用量池 | Claude Duet、Grok Bot、Tasks in Gemini、Muse、Hark Pro、Dots | 跟你平常用的對話共用同一個池 | 換方案、關掉額外加購 |
| 按任務扣點或設預算 | Perplexity teammates、Devin Bots、Kimi Claw | 每次工作扣點；雲端主機每天扣 | 每月上限、每個 bot 的預算 |
| 自架 | OpenClaw、Hermes Agent | 伺服器月租＋每次叫模型的 token | 頻率、脈絡大小、便宜的模型 |

[TechCrunch 報導](https://techcrunch.com/2026/11/02/elon-musk-throttles-grok-bot-limits-due-to-unsustainably-high-costs/)，萬聖節週末，有 Grok Bot 的使用者醒來發現每週用量從 50% 跳到 100%，即使他們整個週末都沒在用。

他們以為是故障。Musk 在 X 上回覆說不是：

> The cost of serving Grok Bot was unsustainably high relative to revenue

報導刊出時，Musk 還沒說之後的上限會怎麼調整。

這篇講常駐的錢：一台 24 小時開著的電腦，各家怎麼收費，為什麼一直改額度。

## 為什麼常駐特別貴

聊天機器人只有在你傳訊息時花錢。常駐 agent 不一樣，[第 1 篇](/posts/ai/2026-11-20-always-on-agent-anatomy)講過它有三種醒來方式；不管哪一種，每醒來一次就是一次以上的模型呼叫，而且你不在場。

[order 17](/posts/ai/2026-11-20-overreaching-agents) 講過一個極端的例子。AI 治理公司 Geordie 測的一個 Dots 只有唯讀權限，一天內自己產生 155 段活動、用掉約 30.7 萬個 token，使用者一句話都沒說。這是產品照設計運作，不是故障。

所以廠商面對的問題是：一個月收固定的訂閱費，但每個使用者背景跑多少，差異很大。各家的答案不同，但方向一致：把背景工作算進某種用量限制裡。

## 方式一：塞進訂閱的共用用量池

多數個人產品的做法是不另外收費，讓背景工作跟你平常的對話共用同一個額度。

- **Claude Duet**：[說明頁寫明](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet)，晨報和巡檢都計入你的五小時與每週額度，跟一般對話一樣算。巡檢為什麼是「每幾小時」而不是一直看？官方的理由很直接：一直檢查會太快用完額度。代價也寫在同一頁：「something urgent can arrive between checks」。
- **Grok Bot**：跟 Cursor、Grok app 共用每週用量池，[算法](https://docs.x.ai/grok-bot/faq)是看 agent 走了幾步、用了多少 token，不是看你傳幾則訊息。[AIMultiple 引用 Cursor 的警告](https://aimultiple.com/always-on-agents)：一個每小時跑一次的例行工作，或掛在很忙的 Slack 頻道上的觸發，可能一天就用掉一週的額度。
- **Tasks in Gemini**：照 Gemini app 的運算額度計，額度用完排程就不會跑。
- **Muse**：免費版有每週上限；[TechCrunch 寫的付費方案](https://techcrunch.com/2026/11/12/muse-can-now-place-calls-to-u-s-businesses-if-you-pay/)是每月 20 美元、每週 5 億個 Muse token，或 100 美元、每週 30 億個。Meta 沒有說一個「Muse token」等於什麼。
- **Hark Pro**：所有功能免費，[付費只是放寬用量](https://hark.com/articles/introducing-hark-pro)，免費版的具體額度沒公布。
- **Dots**：第一個 dot 含在 Pro 等方案裡，跟它對話不計入 ChatGPT 用量，但它交給 Codex 或 ChatGPT Work 的任務照常計算。

這種方式對使用者最簡單，但有兩個風險：

- **背景工作會擠掉你自己的用量**：Duet 的說明頁直接提醒，你可能比只聊天時更早撞到上限。
- **廠商隨時可以改池子的大小**：Grok Bot 就是例子。你設好的例行工作，可能某天突然跑不動。

## 方式二：按任務扣點，或每個 agent 設預算

另一種做法是把工作量直接換算成點數，讓你看得到每件事花多少。

- **Perplexity teammates**：[官方說明](https://www.perplexity.ai/help-center/en/articles/13838041-how-credits-work-on-perplexity)寫 100 點等於 1 美元，一般搜尋不扣點，只有 Computer 的工作扣。查一個事實 15 到 70 點、多步驟研究報告 350 到 950 點、資料儀表板 2,400 到 9,800 點。Max 方案每月 10,000 點；加購有每月上限，預設 200 美元，到了上限進行中的任務會暫停。
- **Devin Bots**：[用量由 bot 的建立者付](https://docs.devin.ai/work-with-devin/bots/usage-limits)，Teams 和 Enterprise 方案可以替每個 bot 設美元或 ACU 上限。Enterprise 要先開啟預算功能，上限才會真的擋。
- **Kimi Claw**：部署好的雲端主機，[每天扣約 0.6% 的會員額度](https://www.kimi.com/en/help/membership/membership-pricing)，就算沒在跑任務也一樣，因為主機和資料一直保留著。不用時官方建議把記憶和工作區檔案存下來，再刪掉主機。

這種方式的好處是透明，壞處是你得自己算。Perplexity 的數字換算一下就知道：一件每天跑一次的多步驟研究，一個月是 10,500 到 28,500 點，超過 Max 方案的月額度。

## 方式三：自架，伺服器和模型自己付

開源的 OpenClaw 和 Hermes 本身免費，錢花在兩個地方。

**伺服器**：要一台一直開著的機器。[AIMultiple 整理](https://aimultiple.com/always-on-agents)，OpenClaw 自己的安裝教學用的是一台 1 GB、每月約 6 美元的雲端主機。這筆錢固定、可預期。

**模型**：每次醒來叫模型都要付 token 費，這筆才是大頭。AIMultiple 的估算是：OpenClaw 的定期檢查如果用主對話跑，每次都會把整段對話歷史重送一次。歷史有 10 萬個 token 的話，每 30 分鐘一次，一天就是 480 萬個輸入 token；用 Claude Opus 5.5 的定價、不算快取，大約 19 美元。

實測的數字也接近：AIMultiple 九天的測試裡，OpenClaw 的模型費用一天大約 11 美元，不管那天有沒有出報告。Hermes 如果照 API 計價，他們估一天約 20 美元，所以改走 ChatGPT 方案。

自架的好處是每一個省錢的旋鈕都在你手上：

- **用乾淨的獨立工作，不要帶主對話**：[OpenClaw 的文件](https://docs.openclaw.ai/automation/cron-jobs/payloads/)寫，獨立工作每次從新的脈絡開始，不讀舊對話。上面那 480 萬個 token，大部分就是重送的歷史。
- **例行工作換便宜的模型**：同一份文件建議，摘要、分類、狀態檢查這類例行工作用輕量模型就跑得好。每次便宜又快，整個排程累積下來差很多。
- **沒變化就不叫模型**：OpenClaw 可以用條件觸發或腳本先判斷有沒有事，沒事就跳過模型。Hermes 的 [monitor mode](https://pinggy.io/blog/proactive_ai_agents_compared/) 也是同樣的想法：先跑一個便宜的檢查，輸出沒變就完全不叫模型。
- **限制時段**：OpenClaw 的 [`activeHours`](https://docs.openclaw.ai/gateway/heartbeat) 讓檢查只在你醒著的時段跑。

## 產品收掉時，訂閱怎麼辦

收費還有一個常被忽略的面向：產品不在了怎麼辦。[order 15](/posts/ai/2026-11-20-china-claw-family) 講過騰訊的 QClaw，2026 年 12 月 24 日停止營運。[公告的處理方式](https://news.qq.com/rain/a/20260924A0DF5T00)是：

- 公告當天起停止新註冊、停止訂閱購買與續費，自動續費的人會自動停扣。
- 已買但沒用完的訂閱或點數包可以申請退款。
- 資料可以遷到 WorkBuddy，完成遷移的人拿到 1,000 點補貼。

這算是處理得比較周到的例子。訂閱常駐 agent 之前，可以先看條款裡停止服務時怎麼退費、資料能不能匯出。

## 估算一件例行工作會花多少

用一件你真的想交出去的工作來算，例如「每 30 分鐘看一次信箱，有需要回覆的才通知我」。

**1. 先算一天醒來幾次**

| 頻率 | 一天幾次 |
|---|---|
| 每 30 分鐘 | 48 |
| 每 30 分鐘，只在早上 8 點到晚上 10 點 | 28 |
| 每 2 小時 | 12 |
| 每天一次 | 1 |

**2. 再估每次大概多少**

- 訂閱用量池：沒有公開的換算，只能先跑幾天，看用量條走多快。
- 扣點制：看官方的對照表。一次簡單檢查接近「查一個事實」，一次要整理的檢查接近「多步驟研究」。
- 自架：每次的 token 數 ≈ 帶進去的脈絡 + 這次讀到的內容 + 回答。帶整段主對話，脈絡可能是幾萬到十幾萬；用獨立工作只帶工作說明，通常是幾千。

**3. 乘起來，放進三種收費方式比較**

以自架為例，用上面 AIMultiple 的定價（每百萬輸入 token 4 美元、不算快取）粗估，下面是我自己算的：

| 做法 | 一天的輸入 token | 一天大約 |
|---|---|---|
| 每 30 分鐘，帶 10 萬 token 的主對話 | 480 萬 | 19 美元 |
| 每 30 分鐘，獨立工作，每次約 5,000 | 24 萬 | 1 美元 |
| 只在 8 點到 22 點，獨立工作 | 14 萬 | 0.6 美元 |
| 沒變化就不叫模型，一天真正叫 5 次 | 2.5 萬 | 0.1 美元 |

同一件工作，做法不同，花費可以差兩個數量級。訂閱和扣點制看不到 token，但道理一樣：醒得越頻繁、每次帶得越多，池子就消耗得越快。

**4. 找最省的那個設定**

照效果排，通常是：

1. 沒變化就不叫模型（monitor mode、條件觸發）。
2. 不帶整段主對話，改成獨立工作。
3. 限制時段，晚上不跑。
4. 例行檢查換便宜的模型。
5. 最後才是降低頻率，因為頻率直接影響你會不會漏掉急事，Duet 的說明頁講的就是這個取捨。

訂閱制的產品多半不讓你調這些，你能做的是：告訴它想聽什麼、不想聽什麼，讓它少做沒用的事；關掉額外加購，或設每月上限。

## 適合誰、不適合誰

**訂閱用量池適合：**
- 已經在付 Claude、ChatGPT、X 訂閱，能接受背景工作吃掉一部分額度的人。
- 不想算 token、只想要一個固定月費的人。

**扣點或預算制適合：**
- 想清楚看到每件工作花多少的人和團隊。
- 要替多個 agent 分別控制花費的團隊，例如 Devin Bots 每個 bot 各設預算。

**自架適合：**
- 願意調設定、想用最低成本跑大量例行工作的人。
- 需要自己選模型，包括本機模型的人。

**要小心：**
- 用量池跟你主要的工作共用時，背景任務可能讓你在關鍵時刻撞到上限。
- 自架時沒調設定，照預設帶著主對話高頻檢查，帳單可能比訂閱還貴。

在台灣，Grok Bot、Tasks in Gemini、Hark 能直接訂閱，價格以美元計；自架的 OpenClaw、Hermes 接哪家模型 API，就照那家的計價。

錢由使用者出，但常駐 agent 卡關的地方，常常不在你這一端。下一篇看另一端：網站和商家怎麼接 agent，為什麼它常常做到最後一步就卡住。

## 參考資料

- [Elon Musk throttles Grok Bot limits due to 'unsustainably high' costs](https://techcrunch.com/2026/11/02/elon-musk-throttles-grok-bot-limits-due-to-unsustainably-high-costs/)（TechCrunch，2026-11-02）
- [Get started with Claude Duet](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet)（Claude Help Center）
- [Grok Bot FAQ](https://docs.x.ai/grok-bot/faq)（xAI）
- [Always-On Agents: Claude Duet vs Dots vs Grok Bot](https://aimultiple.com/always-on-agents)（AIMultiple，2026-11-16）
- [Muse can now place calls to US businesses, if you pay](https://techcrunch.com/2026/11/12/muse-can-now-place-calls-to-u-s-businesses-if-you-pay/)（TechCrunch，2026-11-12）
- [Introducing Hark Pro](https://hark.com/articles/introducing-hark-pro)（Hark）
- [How credits work on Perplexity](https://www.perplexity.ai/help-center/en/articles/13838041-how-credits-work-on-perplexity)（Perplexity Help Center）
- [Bot usage limits](https://docs.devin.ai/work-with-devin/bots/usage-limits)（Devin Docs）
- [Membership Pricing and Plan Overview](https://www.kimi.com/en/help/membership/membership-pricing)（Kimi Help Center）
- [Automation payloads](https://docs.openclaw.ai/automation/cron-jobs/payloads/)（OpenClaw 文件）
- [Proactive AI Agents Compared](https://pinggy.io/blog/proactive_ai_agents_compared/)（Pinggy，2026-10-31）
- [腾讯QClaw宣布将关停](https://news.qq.com/rain/a/20260924A0DF5T00)（i黑馬，騰訊網，2026-09-24，簡體中文）
