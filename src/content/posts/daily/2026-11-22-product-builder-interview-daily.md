---
title: "Product Builder 面試日練 — 2026-11-22：Behavioral & Weekly Review"
date: 2026-11-22
category: daily
type: digest
tags: [product-builder-interview, daily, behavioral]
lang: zh-TW
description: "Behavioral 面試日練：用 20/80 配重拆解「說一次你失敗的經驗」這道經典題，並用 Amazon Fire Phone 虧損後團隊轉戰 Echo／Alexa 的真實決策，看失敗故事該怎麼收尾。附本週練習回顧。"
tldr: "失敗故事要把篇幅配重放對：承認失敗只佔兩成，剩下八成要花在你錯過了什麼訊號、以及這次之後你怎麼把補救變成常態流程；練習題是經典的「說一次你失敗的經驗」，案例是 Amazon Fire Phone 虧損後把團隊和技術帶進 Echo／Alexa 的真實轉向。"
series:
  name: "Product Builder 面試日練"
  order: 95
---

> :globe: [English version](/posts/daily/2026-11-22-product-builder-interview-daily-en)

## 今日主題

「說一次你失敗的經驗」聽起來像在考驗誠實，但這類行為面試題（behavioral interview）的設計邏輯其實更結構化——它源自顧問公司 Development Dimensions International（DDI）在 1970 年代發展的 Targeted Selection 方法論，核心假設是「過去的行為比口頭承諾更能預測未來的行為」。Google 自己的 re:Work 內部研究後來也驗證了這個假設：結構化的行為面試題，比單靠面試官「憑直覺聊」準確得多。換句話說，面試官問失敗經驗，不是想聽你多慚愧，而是想看你有沒有能力把一次失誤拆成「我錯過了什麼訊號」跟「我後來怎麼把補救變成習慣」——這正是今天要練的地方。

## 核心框架速記

### 失敗故事的 20/80 配重

有十年 PM 經驗、待過 Google 的作者 Ajitesh 在整理超過 500 小時面試準備心得時提到一個很具體的配重建議：失敗本身只該佔故事篇幅的兩成，剩下八成要留給診斷跟學習。套進敘事結構，大致會長這樣：

| 段落 | 篇幅佔比 | 要講的內容 | 常見失分點 |
|------|---------|-----------|-----------|
| 承認失敗 | 約 20% | 一句話講清楚哪裡沒做到，不加「但是」鋪陳情有可原 | 急著解釋背景，等於還沒真正承認 |
| 診斷根因 | 約 30% | 你錯過了什麼可觀察的訊號、為什麼會錯過 | 停在「我當時沒注意到」，沒有進一步的自我覺察 |
| 流程改變 | 約 30% | 這次之後你把什麼變成了「以後都這樣做」的習慣，不是單次補救 | 只講這次怎麼善後，沒有變成常態動作 |
| 用數字收尾 | 約 20% | 前後對照的具體結果，讓面試官能追問 | 結果講得模糊，無法被驗證 |

這個配重跟面試官實際在打分的東西對得上：Terrakotta 的面試整理也提到,被問到失敗類問題時,面試官要看的是「有沒有真的擁有這個決定、有沒有講清楚錯過的訊號、以及之後有沒有改變做事方式」，不是要一份完美無瑕的履歷。

## 今日練習題

### 題目

「請分享一次你失敗的經驗。」（Tell me about a time you failed. 來源：Ajitesh「I Spent 500 Hours Researching PM Interviews」整理的 100 道 PM 面試題庫第 94 題，2026 年 11 月更新）

### 拆解思路

1. **選一個「有恢復空間」的失誤**：不要選會讓面試官懷疑你基本功或判斷力核心的失敗（例如明顯的誠信問題），要選一個策略性誤判、但後果可被挽回的案例。
2. **用一句話承認失敗（20%）**：直接說「這件事我沒做到」，不要先鋪陳一堆「當時資源很緊、時程很趕」的背景來稀釋承認的力道。
3. **診斷根因（30%）**：講清楚你當時錯過的具體訊號是什麼、為什麼會錯過——是沒收集某類回饋、還是對某個假設太有信心沒去驗證。
4. **講流程怎麼變成常態（30%）**：重點不是這次怎麼補救，而是這次之後，你在所有專案裡都多做了哪一步，讓同一類失誤不會重演。
5. **用前後數字收尾（20%）**：附上具體的量化結果跟時間點，讓這個故事經得起追問。

### 範例回答（面試時可以這樣講）

> **承認失敗**：「我曾經負責一個新功能的上線，低估了使用者需要多久才能上手——我把資源都放在開發跟測試上，完全沒替使用者的學習曲線排進時程，這件事我當時沒做到。」
>
> **診斷根因（錯過的訊號）**：「回頭看，上線前兩週內測階段，客服團隊已經回報過『使用者第一次操作常常卡在某一步』，但我把這當成個案雜訊處理掉了，沒有去算這個訊號在全量使用者裡的比例。上線後第一週，支援請求量比平常多了將近四成，才發現這不是個案，是整批新使用者都卡在同一個地方。」
>
> **流程改變**：「我跟支援團隊一起收集了使用者實際卡住的三個步驟，重寫了上手流程跟引導文案，取代原本偏技術語言的說明，並開了三場額外的使用教學。但真正改變的，是我後來在每個功能上線的時程表裡，固定排進『使用者上手驗證』這一步，當成跟功能開發、QA 同等重要的項目，不是上線後才補。」
>
> **結果**：「那次支援請求量在接下來一個月內降了四成左右，回到上線前的基準。後來的幾次上線，因為上手驗證提前排進時程，同類型的支援高峰就沒再出現過。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 一句話直接承認失敗，沒有先鋪陳情有可原 | |
| 診斷根因講到具體錯過的訊號，不是「沒注意到」 | |
| 流程改變是常態動作，不是單次補救 | |
| 有前後對照的具體數字與時間點 | |
| 選的失誤「可恢復」，不會讓人質疑核心能力 | |
| 加分項：收尾有講出一個之後一直沿用的原則或習慣 | |

## 今日案例

**Amazon Fire Phone：虧損 1.7 億美元後，把團隊和技術帶進 Echo 與 Alexa**

Amazon 在 2014 年推出的 Fire Phone 市場反應慘烈，當年第三季就認列約 1.7 億美元的庫存減損，是 Amazon 硬體史上最知名的失敗之一。但 Jeff Bezos 在 2020 年的股東信裡提到關鍵的後續動作：「Fire Phone 雖然失敗了，但我們把學到的東西、連同開發團隊本身，一起用來加速 Echo 跟 Alexa 的開發。」參與 Fire Phone 的工程師被轉調去打造一款原本不被看好的智慧喇叭專案，到 2019 年 Alexa 裝置累積銷量已經超過一億台。

**面試連結**：這個案例可以直接用來回答「說一次你失敗的經驗」或「你怎麼從一次重大失誤中恢復」這類題型——Bezos 真正展現的不是「這次損失不重要」，而是把診斷出來的能力（團隊累積的技術跟使用者洞察）當成資產，有組織地轉移到下一個賭注，而不是連人帶教訓一起解散掉。如果你今天的練習題故事裡，「流程改變」那一段也是把學到的東西變成之後持續沿用的動作，那就是同一種失敗後處理邏輯的個人版本。

## 延伸閱讀

- [I Spent 500 Hours Researching PM Interviews. These Are the 100 Questions You Actually Need. - Ajitesh](https://ajitesh.medium.com/i-spent-500-hours-researching-pm-interviews-these-are-the-100-questions-you-actually-need-0ff1d19b8fb9) — 今日練習題出處，第 94 題「說一次你失敗的經驗」的配重建議
- [How to Tell a Failure Story in PM Interviews - PMSynapse](https://pmsynapse.in/blog/failure-conflict-interview-stories) — DDI Targeted Selection 方法論與 Google re:Work 行為面試研究的脈絡
- [Jeff Bezos to exec after product totally flopped: 'You can't, for one minute, feel bad' - CNBC](https://www.cnbc.com/make-it/2020/05/22/jeff-bezos-why-you-cant-feel-bad-about-failure.html) — Fire Phone 轉向 Echo／Alexa 的股東信引述來源

## 參考資料

- [I Spent 500 Hours Researching PM Interviews. These Are the 100 Questions You Actually Need. - Ajitesh](https://ajitesh.medium.com/i-spent-500-hours-researching-pm-interviews-these-are-the-100-questions-you-actually-need-0ff1d19b8fb9) — 對應「今日練習題」題目與 20/80 配重建議來源
- [How to Tell a Failure Story in PM Interviews - PMSynapse](https://pmsynapse.in/blog/failure-conflict-interview-stories) — 對應「今日主題」DDI Targeted Selection 與 Google re:Work 的脈絡說明
- [Jeff Bezos to exec after product totally flopped: 'You can't, for one minute, feel bad' - CNBC](https://www.cnbc.com/make-it/2020/05/22/jeff-bezos-why-you-cant-feel-bad-about-failure.html) — 對應「今日案例」Fire Phone 虧損金額與轉向 Echo／Alexa 的引述
- [Terrakotta Product Manager Interview: Questions, Experience & Prep (2026)](https://knok.work/blog/terrakotta-product-manager-interview.html) — 對應「核心框架速記」面試官評分邏輯的補充說明

## 本週回顧

| 日 | 主題 | 練習題 | 自評 |
|----|------|--------|------|
| 一 11/16 | Product Sense | 幫自由工作者設計財務規劃產品，用 CIRCLES 框架拆 Series B 金融科技公司真題 | ☐ 完成 ☐ 需複習 |
| 二 11/17 | Metrics & Analytics | B2B SaaS 試用啟用率 A/B 測試：合併數字顯著、拆開只有第一週有效 | ☐ 完成 ☐ 需複習 |
| 三 11/18 | Strategy & Execution | 用一道門／兩道門框架，選一個具體的 Google Cloud 產品退場 | ☐ 完成 ☐ 需複習 |
| 四 11/19 | AI Product Design | 替 AI coding agent 設計高風險動作前的確認機制 | ☐ 完成 ☐ 需複習 |
| 五 11/20 | Growth & Experimentation | Slack PM 真題：設計更多產品導向成長（PLG）的擴張管道 | ☐ 完成 ☐ 需複習 |
| 六 11/21 | Technical PM | 替遛狗媒合平台設計架構，在媒合速度與媒合品質間取捨 | ☐ 完成 ☐ 需複習 |
| 日 11/22 | Behavioral | 說一次你失敗的經驗：用 20/80 配重把診斷跟流程改變講具體 | ☐ 完成 ☐ 需複習 |

### 下週預告

下週（11/23–11/29）維持標準輪替，沒有加練主題：一 Product Sense、二 Metrics & Analytics、三 Strategy & Execution、四 AI Product Design、五 Growth & Experimentation、六 Technical PM、日再回到 Behavioral & Weekly Review。目前 `src/data/interview-focus.json` 裡 `product-builder.weights` 七個主題權重都還是預設的 1，如果本週練下來某個主題特別卡，可以把對應權重調到 2–3，讓 routine 在非固定日也抽到該主題補練。
