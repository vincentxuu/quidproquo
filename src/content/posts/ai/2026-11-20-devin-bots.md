---
title: "Devin Bots 把一份責任交給 agent：它做了什麼，人還要做什麼"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, devin, cognition, coding-agent]
lang: zh-TW
tldr: "Devin Bots 是 Cognition 給工程團隊的常駐型 agent：你交給它一份要持續負責的結果，例如「讓 Android 跟 iOS 功能一致」，而不只是一張工單。它自己拆工作、開多個 Devin 平行做、看結果決定下一步，只把需要人判斷的事丟進 Needs You 清單，屬於常駐型的 L3。人的工作變成三件：定義成功、建回饋訊號、設權限與預算。官方的三個案例全是 Cognition 自報，目前沒有獨立驗證。"
description: "Cognition 的 Devin Bots：任務和責任的差別、官方三個內部案例與它們的限制、bot 用誰的權限做事、預算怎麼設，以及把一件沒人負責的長期工作改寫成可以交給責任型 agent 的描述。"
series:
  name: "常駐型 AI agent"
  order: 9
draft: false
---

> :globe: [English version](/posts/ai/2026-11-20-devin-bots-en)

| 四個條件 | Devin Bots |
|---|---|
| 你不在時繼續跑 | ✓ 每件子工作在自己的雲端機器上跑，bot 持續追蹤 |
| 醒來後自己決定做什麼 | ✓ L3：照它負責的結果自己找下一件事，也能定時或由事件觸發 |
| 跨對話記得你的目標 | ✓ 有自己的記憶，跨 session 保留脈絡 |
| 能代你對外做事 | ✓ 開 PR、合併、在 Slack 回報；能做到哪裡由權限和審查規則決定 |

Cognition 的網頁 app 有個老問題：內容晚到時，畫面上的元素會跳動。這種跳動在 code review 裡很難發現，它取決於請求時間、網速和你是不是第一次進這個頁面；修好一個，下一個新元件又可能帶來另一個。

[Cognition 開了一個「Layout Bot」](https://devin.ai/blog/introducing-devin-bots)，交給它的是這段話：

> your job is to keep the webapp's UI from shifting or lagging. Watch #alerts-bots, where a layout check posts every 3 hours. Take over that check and keep it working as the UI changes. When something regresses, find the cause and open a fix with a before and after video.

某天晚上，它把一個新的版面跳動追到兩小時前合併的 PR。有人來問的時候，它已經在修了。工程師問是誰要它修另一個問題，它回：

> Nobody asked. My scheduled layout check flagged main's tall grey block on first visit because it doesn't match what replaces it.

這篇講 Devin Bots：把一份長期責任交給 agent 時，它做了什麼，人還要做什麼。

## Devin Bots 是什麼

Cognition 在 [2026 年 11 月 17 日推出 Devin Bots](https://devin.ai/blog/introducing-devin-bots)。Devin 是它 2024 年推出的寫程式 agent；Devin Bot 是更上一層：一個有自己記憶和工具的常駐 agent，可以同時帶好幾個 Devin 工作。

[官方文件](https://docs.devin.ai/work-with-devin/bots)列出它由六個部分組成：

| 部分 | 做什麼 |
|---|---|
| Chat | 一個 bot 一個對話，你在這裡交代它負責什麼，它的回報也回到這裡 |
| Sessions | 每件子工作在自己的 child session 跑，各有一台機器；bot 負責開和追蹤 |
| Automations | 定時或在你的工具裡發生某件事時觸發，不用你傳訊息 |
| Needs you | 待核准、待決定、待審的 PR 集中在一個清單 |
| Memory | 它學到的偏好、修正、專案細節存起來，之後的 session 會用 |
| Access | 它有自己的連線和密鑰，跟傳訊息給它的人分開 |

- **在哪裡用**：Devin 網頁 app、Slack（bot 有自己的 Slack app，以團隊成員的身分加入）、iMessage（企業方案不能用）。
- **模型**：不綁單一廠商。[據 Fortune](https://fortune.com/2026/11/17/exclusive-cognition-bets-on-devin-bots-coding-agents-in-challenge-to-anthropics-duet-and-openais-dots/)，bot 會依規劃、設計、操作電腦等不同工作挑模型，例行程式碼用較快較便宜的，也會用 Cognition 自己訓練的模型。
- **技術來源**：用到 Cognition 7 月收購的 Interaction Company（個人助理 Poke 的開發商）的技術。
- **價格**：[The Inference 整理](https://theinference.org/article/cognition-launches-devin-bots-ai-managers-that-built-an-android-app-in-44-days)為每席每月 80 到 200 美元，超出的用量照 API 價格計。

上一篇的 [Grok Bot](/posts/ai/2026-11-20-grok-bot) 是一個人開好幾個 bot 替自己做事。這篇開始是路線二：bot 交給團隊，負責一整塊工作。

## 任務和責任的差別

Cognition 的核心主張是：寫程式的 agent 可以把每張工單都做完，你仍然要負責推動專案。發現下一個問題、研究解法、確認改動有沒有用，這些還是人在做。Devin Bot 要接手的是這一層。

官方用一張表說明兩種交代方式：

| 一個要完成的任務 | 一份要負責的責任 |
|---|---|
| 把這個功能移植到 Android | 讓 Android 跟 iOS 保持功能一致 |
| 修這個版面跳動 | 讓網頁 app 在改版時保持順暢 |
| 修這個新手引導的錯誤 | 讓新使用者順利完成設定 |

任務描述你要的改動；責任描述結果，怎麼達成交給 bot。官方說的另一個好處是，負責結果的 agent 會注意所有影響結果的事，包括沒有人在看的部分，所以它會找到你根本不會派的工作。Layout Bot 的「Nobody asked」就是這種情況。

## 官方的三個案例

**Android Bot**：Cognition 有 iOS app 和 iOS 工程師，沒有 Android 工程師，也沒有 Android 計畫。9 月 28 日，工程師 Samyok 開了一個 Android Bot，告訴它：「your job is to product manage the android app」。它先列出阻礙：程式碼放哪、Android 怎麼測、改動怎麼合併。Samyok 定方向和限制之後，它開始開工單，每張工單開一個 Devin session，CI 和 Devin Review 都過的 PR 就合併，每天在 Slack 貼報告和螢幕錄影。

| 44 天的數字 | |
|---|---|
| 合併的 PR | 1,134 |
| Kotlin 程式碼 | 344,651 行 |
| 截圖測試 | 2,841 |
| 關閉的工單 | 1,217 |
| Samyok 傳的訊息 | 183 則，約每 6 個 PR 一則 |
| Samyok 一則都沒傳的天數 | 22 天 |

他的訊息大多是處理 bot 需要人決定的事，例如某個 PR 需要資安審查；其他是鼓勵或定方向，像「be more ambitious」。app 現在在 Google Play 公開測試，每次 iOS 加了新功能，Android Bot 就跟著更新。

**Layout Bot**：每三小時把 main 最新的程式碼建成正式版，在自己的機器上跑完整的服務。它會模擬首次造訪、再次造訪和故意延遲個別請求的情況。原本通過的檢查失敗時，它會重跑排除時間誤差，再追到造成退步的那個 PR，開一個 Devin session 去修，附上修前修後的錄影給工程師審。上線三週，合併了它 159 個 PR，延遲減少 70%。

**遊戲工作室**：Cognition 的同事 Jenny Xu 經營一家手機遊戲工作室，現在她是唯一的人類員工。底下約 20 個 bot，各自負責開發、Unity、發版、UI、iOS、Android、實機測試等工作。最上面是「Super Jenny Bot」，她只跟這一個說話：它每天四次把其他 bot 需要她決定的事整理到一串 Slack 討論，她用表情符號回覆。每週 PR 從約 50 個變成 1,900 個。

### 這些數字要怎麼看

[The Inference 的報導](https://theinference.org/article/cognition-launches-devin-bots-ai-managers-that-built-an-android-app-in-44-days)把話說得很直接：「Every number in the launch post is Cognition reporting on itself.」

- 三個案例都在 Cognition 內部，或由後來加入 Cognition 的人經營。
- 外部證據比較薄：早期客戶 Decagon、Fireworks AI、Reducto 的使用量兩週成長十倍；花旗銀行說有 14,000 名工程師在用 Devin。這些是使用量，不是經過稽核的成果。
- PR 數量不等於價值。The Inference 指出，真正能說服人的數字，是公開客戶在把審查時間算進去之後，每個被接受的改動比人做便宜。目前沒有這個數字。
- 舊版 Devin 有過獨立測試：Answer.AI 在 2025 年 1 月測了 20 個任務，失敗 14 個，而且「找不出任何模式」預測哪些會失敗。這是一年多前的產品，不能直接套到 Bots 上，但說明這類工具的可靠度需要獨立驗證。

Devin Bots 推出才三天，還找不到 Cognition 以外的公開使用經驗。

## 人還要做什麼

官方說，跟 Devin Bots 一起工作，工程師的時間會從「規定要做什麼」轉到「決定什麼值得負責、設定標準、建追蹤指標的系統」。具體是三件事：

**1. 定義成功**：負責讓 CI 變快的 bot，要知道哪些檢查不能拿掉、多花運算資源可不可以。這些決定了哪些改進值得做。

**2. 建回饋訊號**：bot 需要方法評估自己的工作，而這是工程師的責任。開發階段是測試、效能基準、跑過使用流程；上線後是正式環境的行為、使用量和客戶回饋。官方的說法是：選擇量什麼、在什麼條件下量、結果到底證明了什麼，仍然是重要的工程工作。

**3. 設權限與預算**：它能碰哪些系統、能改什麼、花錢或發版什麼時候要核准。Fortune 引述執行長 Scott Wu 的說法，團隊可以讓低風險的改動自動核准合併，例如改按鈕顏色。安全靠的是公司設定並監控的規則，「rather than relying on models themselves being smart enough to recognize a risky or malicious prompt」。

他也說：「it's always up to the human where we're driving to.」

## bot 用誰的權限做事

這是交給團隊之前最要弄懂的一點。[文件寫](https://docs.devin.ai/work-with-devin/bots/access-and-security)：「A Devin Bot works with its own access, not the access of whoever messages it.」

- **權限跟著 bot，不跟著問的人**：bot 持有的登入、密鑰、session，會套用到它開的每個 session，不管是誰傳訊息叫它做的。所以你分享一個 bot，被加進來的人就能透過它使用它手上的所有東西。
- **權限不會超過給的人**：你給 bot 的 session 最多到你自己的層級；你離職或失去某個連線，bot 也跟著失去。
- **私人 bot 和共用 bot 不同**：只有建立者能用的 bot，會直接拿建立者的資源，不用每次問（每一項仍記為授權）。一旦分享給別人，它要用某個人的資源，就要那個人按卡片核准。
- **bot 之間會傳遞**：如果 A 能讀 B，能用 A 的人就能透過 A 看到 B 的工作。所以把兩個 bot 接起來，可能讓 B 的工作被它從沒分享給的人看到。
- **分享前先看清楚**：加進來的人可以讀 bot 到目前說過、記得的一切。對話裡有私人內容的話，官方建議從同一個範本開一個新 bot，而不是分享舊的。

權限分三級：Can use（能傳訊息、指揮它的 session、讀它的對話和記憶）、Can configure（改指示、連線、密鑰）、Can share（決定誰能用）。三級互不包含，所以管權限的人不一定讀得到對話。

Fortune 也提到，bot 在獨立的雲端電腦上跑，碰不到工程師筆電上的密碼和金鑰。網路管制則是為了防止模型讀到藏在內容裡的惡意指令後，把資料傳出去。

## 預算

[用量](https://docs.devin.ai/work-with-devin/bots/usage-limits)由 bot 的建立者付，算法是它的對話加上它開的每個 session：

| 方案 | 怎麼計 | 上限 |
|---|---|---|
| Max | 跟你自己開的 session 一樣，先用方案額度，再用隨用隨付額度 | 沒有 bot 專屬的上限 |
| Teams | 先用建立者的額度，再用團隊的隨用隨付額度 | 建立者或管理員可設美元上限；管理員可另給 bot 獨立額度 |
| Enterprise | 計入建立者自己的用量上限 | 可設 ACU 或美元上限；要企業先開啟預算功能才會真的擋 |

Fortune 引述的說法是，每個 bot 可以有自己的預算，跟它交出的成果對照來看。Max 方案沒有 bot 專屬上限，背景跑得多就花得多。

## 把一件沒人負責的工作改寫成可以交出去的描述

每個工程團隊都有一些有價值、但總在急事之間失去動力的工作。官方的說法是，有些專案從沒開始，是因為接下來就要長期維護、出事要處理、需求變了要調整。

要把這種工作交給責任型 agent，照這個格式寫：

| 欄位 | 要寫什麼 | 例子：相依套件更新 |
|---|---|---|
| 負責的結果 | 一句話，用「保持」「讓」開頭，不寫具體改動 | 讓所有服務的相依套件保持在支援中的版本，沒有已知高風險漏洞 |
| 怎麼算成功 | 可以量的標準，加上不能犧牲的東西 | 高風險漏洞 7 天內修掉；既有測試全過；不改公開 API |
| 回饋訊號 | 它用什麼判斷自己做對了 | CI 結果、漏洞掃描報告、部署後 24 小時的錯誤率 |
| 可以自己做 | 低風險、可撤回的事 | 開 PR、更新修補版本、跑測試 |
| 要先問 | 會影響別人或難以撤回的事 | 升級大版本、改設定檔、動到正式環境 |
| 預算 | 每月上限，到了怎麼辦 | 每月 200 美元；到了停下來，在 Needs You 裡報告 |
| 回報 | 多久、在哪裡、報什麼 | 每週一在 #eng-deps 貼一次摘要；有高風險漏洞時立刻通知 |

寫完檢查兩件事：

- **回饋訊號是不是已經存在**：如果還沒有漏洞掃描或錯誤率監控，先把這些建起來。沒有回饋訊號的責任，bot 只能自己說自己做對了。
- **人要決定的事有沒有寫進「要先問」**：Android Bot 的 183 則訊息，大多是在處理需要人決定的事，例如資安審查。這些事不會消失，只是集中到 Needs You。

## 適合誰、不適合誰

**適合：**
- 已經有完善測試和 CI 的工程團隊：回饋訊號現成，bot 才判斷得了自己做對沒有。
- 手上有「一直想做、但沒人能長期負責」的工作：跨平台同步、效能回歸、相依套件、新手引導品質。
- 願意花時間寫成功標準和權限規則的團隊。

**不適合：**
- 沒有自動化測試的專案：bot 沒辦法驗證自己的工作。
- 需要獨立證據才會採用的團隊：目前的數字都是 Cognition 自報。
- 不想讓一個 agent 用共用身分在多人之間傳遞權限的組織。

Devin Bots 在 devin.ai/bots 申請，費用以美元計；台灣團隊能不能用，申請時直接確認。

下一篇的 [Perplexity teammates](/posts/ai/2026-11-20-perplexity-teammates) 同樣是接手跨週的工作，但對象從工程團隊換成知識工作者：回饋訊號不再是測試，而是人的審閱。

## 參考資料

- [Introducing Devin Bots: from tasks to outcomes](https://devin.ai/blog/introducing-devin-bots)（Cognition，2026-11-17）
- [Devin Bots](https://docs.devin.ai/work-with-devin/bots)（Devin Docs）
- [Devin Bot access and security](https://docs.devin.ai/work-with-devin/bots/access-and-security)（Devin Docs）
- [Devin Bot usage limits](https://docs.devin.ai/work-with-devin/bots/usage-limits)（Devin Docs）
- [Exclusive: Cognition bets on 'Devin Bots' coding agents in challenge to Anthropic's Duet and OpenAI's Dots](https://fortune.com/2026/11/17/exclusive-cognition-bets-on-devin-bots-coding-agents-in-challenge-to-anthropics-duet-and-openais-dots/)（Fortune，2026-11-17）
- [Cognition launches Devin Bots, AI managers that built an Android app in 44 days](https://theinference.org/article/cognition-launches-devin-bots-ai-managers-that-built-an-android-app-in-44-days)（The Inference，2026-11-18）
