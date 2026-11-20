---
title: "Tasks in Gemini 適合誰：三種排程、代打電話與 AP2 付款，以及它為什麼不會自己發現衝突"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, gemini, google]
lang: zh-TW
tldr: "Tasks in Gemini（原名 Gemini Spark）在 Google 的隔離雲端 VM 上背景執行，能讀你的 Gmail 與行事曆、操作網頁、用 AP2 付款，但醒來做什麼要你先講好：時間、Gmail 監控、主題監控三種排程，屬於常駐型的 L2。台灣要訂 Google AI Pro 才能用；代打電話等進階功能先在美國。適合需求能寫成「什麼時候、做什麼」的人，不適合期待它自己發現事情的人。"
description: "Google 的常駐型 agent Tasks in Gemini：從 Spark 到 Tasks 的演變、三種排程怎麼用、Google 生態帶來的便利與代價、它在哪些動作前停下來、WIRED 實測結果，以及台灣讀者怎麼開始。"
series:
  name: "常駐型 AI agent"
  order: 2
draft: false
---

> 🌏 [English version](/posts/ai/2026-11-20-gemini-tasks-en)

| 四個條件 | Tasks in Gemini |
|---|---|
| 你不在時繼續跑 | ✅ 在 Google 雲端的隔離 VM 上跑，關掉裝置也繼續 |
| 醒來後自己決定做什麼 | 🟡 L2：時間或條件觸發，做什麼由你寫 |
| 跨對話記得你的目標 | ✅ 用 Personal Intelligence、技能與連接的 app |
| 能代你對外做事 | ✅ 寄信、付款、打電話、填表單，前面會停下來確認 |

Google 負責 Gemini app 的副總裁 Josh Woodward，在 [2026 年 11 月 17 日的文章](https://blog.google/innovation-and-ai/products/gemini-app/tasks-in-gemini-free-new-features/)裡舉了一個例子。家裡的休旅車引擎燈亮了，他跟 Gemini 說「打給最近的兩家車廠，約下個月某個週五一早保養」。Gemini 已經知道他開哪台車、住在哪裡，在 Google 地圖上找到兩家車廠，同時撥了兩通電話。它聽完等候音樂，挑了一家接受預約的，再對著行事曆找空檔排進去，前後不到五分鐘。

這就是 Tasks in Gemini：Google 的常駐型 agent。它能做的事很多，但在[系列的三級階梯](/posts/ai/2026-11-20-always-on-agent-anatomy)上，它停在 L2：什麼時候醒、醒來做什麼，要你先講好。這篇講它為什麼停在那裡，以及那對你來說是缺點還是剛好。

## 從 Spark 到 Tasks

- **2026 年 5 月 19 日**：Google I/O [發表 Gemini Spark](https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/)，用 Gemini 3.5 和 Antigravity 的 agent 執行框架，強調「關上筆電、鎖上手機也在背景工作」，先給美國的 Google AI Ultra 訂閱者測試。
- **2026 年 7 月 29 日**：[Google 台灣宣布](https://blog.google/intl/zh-tw/products/devices-services/gemini-spark-ai/)在接下來幾週陸續開放給台灣的 Google AI Pro 訂閱者，支援繁體中文，當時由 Gemini 3.6 Flash 驅動。
- **2026 年 11 月 17 日**：改名 Tasks in Gemini，首頁的「Chat」旁多了「Task」切換鈕；在美、日、韓、加、澳、印六國免費開放，改用 Gemini 4 Hydrogen。公告同時推出一批進階功能，例如代打電話、用 Google Pay 付款、用 Password Manager 登入網站，寫明「先從美國開始」。

名字改了，產品本質沒變：一個你交辦工作、它在背景做完的 agent。

## 核心取捨：你說何時做什麼

[排程說明頁](https://support.google.com/gemini/answer/17094710?hl=en)列出三種排程：

| 排程 | 什麼時候跑 | 例子 |
|---|---|---|
| 時間 | 一次、每小時、每天、每週、每月、每年 | 每天早上 7 點看信箱、行事曆和雲端硬碟，告訴我今天先做什麼 |
| Gmail 監控 | 收到符合 Gmail 篩選條件的信 | 主管寄來有待辦的信時，幫我處理並草擬回覆 |
| 主題監控 | 新聞、財經、體育、在地活動出現特定事件 | 我住的城市有新的快閃美食活動時，寄詳情給我並建議行事曆空檔 |

同一頁的說法很直接：「You tell Gemini what to do and when to do it.」這是 Google 的設計選擇：可預期、你知道它會在什麼條件下動手，代價是你沒寫進條件的事，它不會去看。

[WIRED 記者 2026 年 10 月的一天實測](https://www.wired.com/story/i-tested-every-major-ai-agent-for-a-day-heres-the-best-one/)剛好測到這個差別。測試前他在行事曆排了一個下午 2 點、不能移動的會議，又寄一封信給自己，說 2 點要打給剛出院的媽媽。六個 agent 裡，只有 Dots 和 Claude Duet 在衝突發生前提醒他；當時還叫 Spark 的 Gemini 什麼都沒說，事後的解釋是：

> Because the reminder arrived as an email message rather than a calendar entry or scheduled task, the cross-app overlap wasn't surfaced before 2:00 pm.

也就是提醒是一封信，不是行事曆項目，也沒有排程去比對這兩者。如果他事先設一個「每天早上比對信箱和行事曆，有衝突就告訴我」的排程，結果可能不同；但這就是 L2 的意思：要你先想到。

Google 自己最接近 L3 的功能是另一個 agent [Daily Brief](https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/)：開啟後在背景看你的 Gmail 和行事曆，依你的目標排序，建議下一步。但它只產出早上的摘要，不動手做事，而且發表時先在美國推出。

### 排程的限制

說明頁寫的上限與限制，交辦前要知道：

- 同時最多 15 個任務在跑，啟用中的排程最多 50 個；已經有 15 個任務在跑時，排程不會執行。
- 排程的執行時間是「大約」，條件成立後不一定立刻跑；流量高時會延遲。
- 監控不適合追蹤快速變化的資料，也不適合「門票一開賣就通知我」這種分秒必爭的事。
- 用量照 Gemini app 的運算額度計；額度用完時，排程不會跑。

## Google 生態的便利與代價

Woodward 在文章裡把賣點講得很白：如果你的信件、行事曆、密碼、照片、檔案和付款卡本來就在 Google，Gemini 是最好的選擇。理由是這些敏感資料「已經在 Google 了，不必送到別的地方」。他用 Password Manager 讓 Gemini 登入電力公司的網站，再分析信箱裡的帳單，找出一筆 389 美元的電費是熱泵在尖峰時段啟動造成的。

便利是真的：不用另外接連接器，Gmail、行事曆、雲端硬碟、Keep、Google Pay、地圖、YouTube 都直接能用，[任務說明頁](https://support.google.com/gemini/answer/17094507?hl=en)也列出可以接一些第三方 app 和你自訂的 app。

代價有三個，都寫在 Google 自己的說明頁上：

- **要開著活動紀錄。** 用任務的條件之一是開啟 Gemini 的活動紀錄，也就是讓 Google 保留你和 Gemini 的互動。
- **本機瀏覽器等於你的身分。** 任務可以用你電腦上的 Chrome，這時「Gemini 能進你能進的所有網站，包括已登入的」。
- **它會把你的資料給網站。** 為了完成任務，Gemini 可能把你的姓名、聯絡方式、檔案、偏好分享給它造訪的網站，而且由它選擇要去哪些網站。

## 它在哪裡停下來問你

- **每次都問**：寄出訊息、刪除資料、分享敏感資訊、購買、完成金融交易、填寫並送出網頁表單、用 Google 帳號或 Password Manager 登入網站。這些就算你改過權限設定，也每次都要你確認。
- **可以設成 Always allow**：例行的小事，例如把一盒麥片加進 Instacart 購物車。但就算設了，要把健康、財務或身分證號碼這類資訊交給網站或 app 時，它仍會停下來問。
- **交給你接手**：輸入密碼、付款資料時，它會請你接管瀏覽器自己填。
- **付款**：用 AP2（Agent Payments Protocol）和發卡組織的數位代碼，可以事先設一個花費上限；收據和物流資訊進 Google Wallet。
- **代打電話**：一接通就表明自己是 AI，商家可以選擇退出；沒有你的同意不會說出付款或帳號資訊。

## 隔離，與 Google 自己的警告

Gemini 跑任務時用的是 Google Cloud 的 Agent Compute Engine，[每個帳號一台硬體隔離的 VM](https://blog.google/innovation-and-ai/products/gemini-app/tasks-in-gemini-free-new-features/)，不和其他使用者共用；搜尋結果和網頁另外經過提示注入過濾與 Safe Browsing。

遠端瀏覽器會保存 cookie 等登入資訊供下次使用，閒置一段時間後自動刪除，也可以在設定裡手動清掉。

說明頁有兩段警告值得照做：

> If a schedule runs when you are offline, you may not be able to stop Gemini from completing an unintended action.

也就是排程在你離線時跑，出錯了你可能來不及攔。Google 的建議是：不要把你覺得敏感的資訊或動作排成排程，這類任務要你在旁邊看著。另一段提醒不要把登入資訊、付款資料直接打進任務對話裡，需要時接管瀏覽器，在網頁上填。

## WIRED 實測：一天五個測試

WIRED 那次實測（一位記者、24 小時、五個測試，各 1–5 分）中，Gemini 的表現兩極：

| 測試 | Gemini 分數 | 說明 |
|---|---|---|
| 晨間新聞提案 | 5 | 六家裡最好的切角 |
| 訂午餐 | 1 | 替素食的上司只放了一捲 5 美元的春捲 |
| 發現行程衝突 | 1 | 沒發現，也沒建議怎麼避免 |
| 旅遊行程 | 3 | 可用，但不如前幾名好讀 |
| 失眠時的開放問題 | 2 | 建議合理，但提到「你早上行事曆是空的」讓人煩 |

這是單一記者、單次測試，樣本太小，不能當排名。但前兩項的對比很有代表性：給它一個明確的研究題目，它做得很好；要它在沒人提醒時自己把兩個 app 的資訊連起來，它沒做到。這和 L2 的設計一致。

## 適合誰、不適合誰

**適合：**
- 你的生活本來就在 Google：Gmail、行事曆、雲端硬碟、Password Manager。
- 你的需求能寫成「什麼時候、做什麼」：每週一整理上週的信、收到某類信就處理、某個主題有新消息就通知。
- 你想要可預期：寧可自己多設幾個排程，也不要 agent 自己決定要不要打擾你。

**不適合：**
- 你期待它自己發現事情，例如行程衝突、忘了回的信。那是 L3 產品的工作，可以看系列後面的 Claude Duet 和 OpenAI Dots。
- 你不想讓 Google 保留 Gemini 的活動紀錄。
- 你要用公司或學校的 Google 帳號：任務目前只支援個人帳號。

## 在台灣怎麼開始

- **方案**：台灣不在免費的六國裡，要訂 Google AI Pro 或 Ultra。介面支援繁體中文。
- **功能差異**：11 月 17 日的公告寫進階功能「先從美國開始」；寄信給 gemini@google.com 和傳簡訊交辦也明寫從美國開始，簡訊還要美國電話號碼。任務、排程、Workspace 整合和網頁操作是台灣 7 月開放時就有的；其他功能以你帳號的介面為準。
- **第一週**：在 gemini.google.com 首頁切到 Task，先設一個只讀不寫的時間排程，例如「每天早上 8 點看信箱，列出需要我回的信，不要回」；打開 Scheduled 頁面確認它出現在「進行中」。
- **先確認三個設定**：Settings 裡的 Task settings（任務模式開關）、Browser（清除遠端瀏覽器資料）、Chrome 的 Gemini in Chrome（關閉本機自動瀏覽）。

下一篇是路線一的 [Meta Muse](/posts/ai/2026-11-20-meta-muse)：它是 L3，也是目前最多人用的常駐型 agent，但台灣還用不到。

## 參考資料

- [Put Gemini to work for you](https://blog.google/innovation-and-ai/products/gemini-app/tasks-in-gemini-free-new-features/)（Google，2026-11-17）
- [The Gemini app becomes more agentic, delivering proactive, 24/7 help](https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/)（Google，2026-05-19）
- [隆重介紹 Gemini Spark：你全天候的個人 AI 代理](https://blog.google/intl/zh-tw/products/devices-services/gemini-spark-ai/)（Google 台灣，2026-07-29）
- [Create & manage schedules for tasks in Gemini](https://support.google.com/gemini/answer/17094710?hl=en)（Gemini Apps Help）
- [Manage your tasks & workflows in Gemini Apps](https://support.google.com/gemini/answer/17094507?hl=en)（Gemini Apps Help）
- [I Tested Every Major AI Agent for a Day. Here's the Best One](https://www.wired.com/story/i-tested-every-major-ai-agent-for-a-day-heres-the-best-one/)（WIRED，2026-10-27）
