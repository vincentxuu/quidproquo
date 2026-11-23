---
title: "Perplexity teammates 接手跨週的知識工作：什麼時候交給 teammate，什麼時候開一次 Computer 就好"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, perplexity]
lang: zh-TW
tldr: "Perplexity teammates 是給知識工作用的常駐型 agent：它記得專案目標、做過的工作和共用檔案，自己盯著進度、有變化就跟進，再把成果交回給你審，屬於常駐型的 L3。它建在 Perplexity Computer 上，負責協調多個 Computer session 和其他 teammate；每個 teammate 有獨立的環境和瀏覽器。目前只開放 Max 訂閱者的網頁版。跨週知識工作的回饋訊號是你的審閱，所以適不適合交給 teammate，要看你有沒有時間審它交回來的東西。"
description: "Perplexity 的常駐型 agent teammates：從 Comet、Computer、Personal Computer 到 teammates 的演變，teammate 怎麼記住跨週的工作、怎麼跟其他 teammate 交接，額度怎麼算，以及一件工作該交給 teammate、一次性 Computer 任務，還是放在自己 Mac 上的 Personal Computer。"
series:
  name: "常駐型 AI agent"
  order: 10
draft: false
---

> :globe: [English version](/posts/ai/2026-11-20-perplexity-teammates-en)

| 四個條件 | Perplexity teammates |
|---|---|
| 你不在時繼續跑 | ✓ 在 Perplexity 的環境裡持續跑，跨好幾次執行推進同一個專案 |
| 醒來後自己決定做什麼 | ✓ L3：盯著進行中的工作，有變化就調查、跟進，不用等你下新的查詢 |
| 跨對話記得你的目標 | ✓ 記得專案目標、做過的工作和共用檔案，也會把你的回饋用在之後的工作 |
| 能代你對外做事 | ✓ 準備外聯信、報價、廣告，在 Slack 接工作；用你給的工具與權限，交回給你審 |

Perplexity 在 [teammates 的發表文](https://www.perplexity.ai/hub/blog/teammates-are-agents-for-complex-ongoing-work)裡舉了一個業務的例子：一位常客突然不再下單了。

業務 teammate 注意到這件事，去翻這位客戶的訂單紀錄和客服紀錄，查出是什麼變了。接著它準備一份針對這位客戶的優惠，或是先標出要在聯絡前處理掉的問題。之後它一路回報進度、送出核准請求，直到這件事做完。

另一個例子更小：你告訴營運 teammate「某家代理商需要兩週前通知」，之後它排專案時程，都會自動把這兩週算進去。

這篇講 Perplexity teammates：給知識工作用的長期 agent，怎麼接手跨好幾週的專案，以及一件工作什麼時候值得交給它。

## 從 Comet 到 teammates

teammates 是 Perplexity 一年多來一層層疊上去的：

- **2025 年 7 月，Comet**：Perplexity 的 AI 瀏覽器，[官方說](https://www.perplexity.ai/hub/blog/teammates-are-agents-for-complex-ongoing-work)是第一個能操作網頁的 AI 助理，用來訂餐廳、購物。
- **2026 年 2 月，Perplexity Computer**：一個「digital worker」，[協調 20 個前沿模型](https://www.perplexity.ai/hub/blog/everything-is-computer)，能理解目標、跨工具工作，你離開後繼續做。
- **2026 年 3 月 11 日宣布、4 月 16 日推出，Personal Computer**：把 Computer 帶到你自己的 Mac 上，能用本機檔案和原生 app。[官方建議](https://www.perplexity.ai/hub/blog/personal-computer-is-here)放在一台 Mac mini 上 24 小時開著；5 月 7 日起，[TechCrunch 報導](https://techcrunch.com/2026/05/07/perplexitys-personal-computer-is-now-available-everyone-on-mac/) Pro 和 Max 訂閱者都能在新的 Mac app 裡用。
- **2026 年 11 月 4 日，teammates**：建在 Computer 上，負責接手長期、持續的工作。

Perplexity 對 teammates 的說法是：Computer 能處理複雜的專案，但要讓 agent 接手一份持續的工作，原本得自己先規劃好。teammates 就是為這件事做的。

## teammate 怎麼接手跨週的工作

### 它協調 Computer，而不是取代 Computer

一個 teammate 負責協調多個 Computer session，也可以跟其他 teammate 協作，讓專案持續推進。它會規劃工作、在過程中檢查結果，把完成的東西交回來給你審。你可以隨時檢查、調整方向。

它用的是 Computer 原本就有的三樣東西：

| 東西 | 在 teammate 裡的用途 |
|---|---|
| Projects | 專案裡的資料和目標，例如既有的客戶研究和業績目標 |
| Skills | 寫好的做事方法，例如怎麼寫外聯信 |
| Automations | 定期跑的工作，例如每週檢查一次銷售漏斗 |

官方的業務例子是把這三樣串起來：找出停滯的對話、準備跟進信給你審，再把結果用在下一週的工作上。

### 它記得什麼

- 專案目標、做過的任務紀錄、共用檔案，跨好幾次執行都記得。每接一件新任務，都建立在之前做過的工作上。
- 你給的回饋，會用在之後的任務。上面「代理商要兩週前通知」就是這種情況。

### 它跟誰交接

- **跟同事**：把 teammate 加進 Slack 頻道，同事就能把工作丟給它，或問它進度。
- **跟其他 teammate**：一個 teammate 在網站上找到 bug，把結果交給另一個去準備修正。

### 它在哪裡跑

每個 teammate 跑在獨立的環境裡，瀏覽器 session 跟其他 teammate 分開。存好的帳密加密、安全地填入。權限沿用 Computer 原本的工具和 Project 權限。你可以檢查完成的工作、接手它的桌面，或在它做事時改變方向。

這點跟[第 8 篇的 Grok Bot](/posts/ai/2026-11-20-grok-bot) 不同：Grok Bot 同一個帳號的 bot 共用一台電腦和瀏覽器；Perplexity 說每個 teammate 的瀏覽器是分開的。

## 回饋訊號從測試變成你的審閱

上一篇的 [Devin Bots](/posts/ai/2026-11-20-devin-bots) 負責的是程式碼，回饋訊號很清楚：測試有沒有過、CI 綠不綠、效能有沒有退步。bot 可以自己跑這些檢查，判斷自己做對了沒有。

teammates 做的是知識工作：市場研究、行銷活動、客戶外聯、營運排程。這些工作大多沒有自動測試。一份競品分析寫得好不好、一封外聯信的語氣對不對，最後要靠人看。官方的描述也是這樣：teammate 把成果「present for review」，一路送出核准請求。

這帶來一個實際的限制：**teammate 能接多少工作，取決於你能審多少**。它每週交回三份報告、十封信草稿、一份廣告提案，如果你沒時間看，這些就只是堆在那裡。

官方列的四個用途，每一個都有一個要你審的點：

| 用途 | teammate 做什麼 | 你要審什麼 |
|---|---|---|
| 行銷 | 管社群貼文、電子報、廣告、SEO；盯成效和競爭對手的促銷，成效下滑時草擬修正 | 新廣告和對競爭對手降價的回應 |
| 業務 | 從詢問、過去訂單、沒講完的對話找機會；準備外聯信和報價，跟進回覆 | 外聯信和報價送出前 |
| 客服 | 整理前一天的客訴趨勢，標出需要執行長親自回應的案件並草擬回覆 | 執行長要親自回的那幾封 |
| 營運 | 盯專案截止日、清單、廠商和文件；截止前 72 小時跟進缺漏 | 跟廠商和內部的跟進內容 |

## 額度

teammates 用的是 Computer 的額度。[官方說明](https://www.perplexity.ai/help-center/en/articles/13838041-how-credits-work-on-perplexity)寫目前 100 點等於 1 美元，一般的搜尋不扣點，只有 Computer 的工作會。

| 工作類型 | 大約花費（點） |
|---|---|
| 查一個事實或定義 | 15–70 |
| 多步驟的研究報告 | 350–950 |
| 資料儀表板 | 2,400–9,800 |
| 整個 app 或好幾天的建置 | 15,000 以上 |

Max 方案每月 10,000 點，沒用完不會累積。換算一下：一份資料儀表板最多可能用掉將近一整個月的額度。teammate 是長期工作，每週的例行檢查、每次跟進都在扣點，所以要先算清楚它一個月大概會做多少事。

幾個控制點：

- **自動加購預設關閉**：沒開的話，點數用完時進行中的任務會暫停（不會取消），等你買點數或下個月重置後自動接著做。
- **花費上限**：Max 帳號每月加購點數有上限，預設 200 美元，最高可設到 5,000 美元。到了上限，進行中的任務會暫停。
- **看每個任務花多少**：在任務的 Usage 下拉選單可以看這次用了幾點；Usage 頁面可以看每個 session 的用量。

## 目前的證據

teammates 推出才兩週多，還沒有獨立的上手評測；PCMag 等媒體的報導，內容主要是轉述官方公告。官方提到的數字是 Computer 的：Perplexity 說內部用 Computer 處理超過 16,000 個查詢，對照顧問公司和大學的基準，省下 160 萬美元的人力成本。這是廠商自報，而且是 Computer，不是 teammates。

## 交給 teammate、開一次 Computer，還是用 Personal Computer

Perplexity 現在有三種用法，差別在工作的長度和它需要碰到什麼：

| | 一次性 Computer 任務 | teammate | Personal Computer |
|---|---|---|---|
| 適合的工作長度 | 一次做完 | 跨好幾週、持續進行 | 需要一直開著的工作 |
| 記不記得之前的工作 | 只在這個任務裡 | 記得專案目標、任務紀錄、檔案和你的回饋 | 跑在你的 Mac 上，有你的本機脈絡 |
| 誰觸發 | 你 | 你、同事、其他 teammate，或它自己發現變化 | 你，或你設的排程 |
| 碰得到什麼 | 連接器、網路 | 連接器、網路、Slack、Projects | 本機檔案、原生 Mac app、連接器、網路 |
| 在哪裡跑 | Perplexity 的雲端沙盒 | Perplexity 的獨立環境 | 你自己的電腦 |

判斷一件工作該交給 teammate，問四個問題：

1. **它會不會持續兩週以上？** 一份競品報告做完就結束，用一次性 Computer 就好。「每週更新競品動態並在對方降價時提醒我」才需要 teammate。
2. **它需要記得之前的事嗎？** 如果每次都要重新交代背景，就值得交給一個會記得的 teammate。
3. **觸發點是不是外面的變化？** 客戶不再下單、廣告成效下滑、截止日剩 72 小時，這些要有人一直盯著，正是 teammate 的用途。
4. **你有時間審它交回來的東西嗎？** 沒有的話，先不要開。

如果工作需要碰你電腦上的檔案或原生 app，例如整理下載資料夾、比對本機檔案和網路資料，那是 Personal Computer 的範圍，不是 teammate。

## 適合誰、不適合誰

**適合：**
- 已經在付 Perplexity Max、常用 Computer 做研究的人。
- 有跨週的知識工作需要一直盯著：行銷成效、客戶外聯、專案截止日。
- 團隊用 Slack，想讓同事直接把工作丟給同一個 agent。

**不適合：**
- 沒時間審成果的人：回饋訊號是你，你不審它就不知道自己做對沒有。
- 工作需要大量資料儀表板或建置的人：額度很快就用完。
- 想要獨立評測再決定的人：目前還沒有。

官方公告寫 teammates 先開放 Max 訂閱者的網頁版，iOS 版即將推出，沒有提到地區限制。

Devin Bots 和 teammates 都是由團隊自己決定 agent 能碰什麼。下一篇的 Microsoft Autopilot 換一個做法：agent 有自己在公司目錄裡的身分，由 IT 管，也有一位具名的人類負責。

## 參考資料

- [Teammates are agents for complex, ongoing work](https://www.perplexity.ai/hub/blog/teammates-are-agents-for-complex-ongoing-work)（Perplexity，2026-11-04）
- [Everything is Computer](https://www.perplexity.ai/hub/blog/everything-is-computer)（Perplexity，2026-03-11）
- [Personal Computer is here](https://www.perplexity.ai/hub/blog/personal-computer-is-here)（Perplexity，2026-04-16）
- [How credits work on Perplexity](https://www.perplexity.ai/help-center/en/articles/13838041-how-credits-work-on-perplexity)（Perplexity Help Center）
- [Perplexity's Personal Computer is now available to everyone on Mac](https://techcrunch.com/2026/05/07/perplexitys-personal-computer-is-now-available-everyone-on-mac/)（TechCrunch，2026-05-07）
