---
title: "Product Builder 面試日練 — 2026-11-15：Behavioral & Weekly Review"
date: 2026-11-15
category: daily
type: digest
tags: [product-builder-interview, daily, behavioral]
lang: zh-TW
description: "Behavioral 面試日練：用 STAR 加 SBI 框架拆解『影響不向你報告的人』這道真實面試題，並用 Slack 從失敗遊戲 Glitch 轉型的真實決策，看判斷力故事該怎麼講。附本週練習回顧。"
tldr: "今天疊兩個框架：STAR 把故事講完整，SBI（Situation-Behavior-Impact）把『你想改變誰的什麼行為、造成了什麼影響』講得具體，不要停在『溝通不良』這種空話；練習題是『怎麼影響不向你報告的人』，案例是 Stewart Butterfield 把失敗的遊戲 Glitch 砍掉、押注內部工具 Slack 的那個判斷。"
series:
  name: "Product Builder 面試日練"
  order: 88
---

> 🌏 [English version](/posts/daily/2026-11-15-product-builder-interview-daily-en)

## 今日主題

Behavioral 面試最容易被低估的地方，是候選人以為只要「有故事」就過關，但面試官真正在抓的是故事裡有沒有具體的行為，不是形容詞。Pin 在 2026 年整理超過四萬八千份職缺描述後發現一個值得留意的落差：溝通（53.5%）、團隊合作（50.5%）、領導力（39.8%）這三項能力在 JD 裡出現頻率很高，但衝突處理只佔 10.9%——這代表面試官問到衝突或影響力相關的問題時，候選人往往沒有準備過,答案比其他題型更容易露出真實水準。今天用 STAR 加上一個比較少被拿來準備面試、但其實很實用的框架 SBI，練一道 PM 常被問到的真題：怎麼影響不向你報告的人。

## 核心框架速記

### STAR：先把故事的骨架搭起來

| 步驟 | 內容 | 常見失分點 |
|------|------|-----------|
| Situation | 情境與背景，具體到能被追問細節 | 講得太籠統，聽不出這是真實事件 |
| Task | 你的角色與責任邊界 | 用「我們」把自己的部分藏起來 |
| Action | 佔比最大，你做了什麼、為什麼這樣選 | 只列動作，沒講決策當下在權衡什麼 |
| Result | 可被驗證的結果，最好附數字 | 結果講得模糊，無法被追問 |

### SBI：把「他做了什麼讓你需要介入」講具體

SBI（Situation-Behavior-Impact）由 Center for Creative Leadership 開發，原本是用來給回饋的工具，但拿來拆「影響力」或「衝突」類的行為面試題一樣好用，因為它逼你把「溝通不良」「對方不配合」這種空話，換成三件具體的事：當時的情境是什麼、對方做了什麼可觀察的行為（不是你對他的評價）、那個行為造成了什麼實際影響。

STAR 跟 SBI 不是互斥的兩套——用 STAR 搭整個故事的骨架，在講到 Action 那一步、需要說明「我為什麼要去影響這個人」時，用 SBI 的 Behavior 跟 Impact 把對方當時的具體行為跟後果講清楚，故事就不會停在「我後來說服了他」這種結論句，而是讓面試官看到你怎麼觀察、怎麼判斷該出手的時間點。

## 今日練習題

### 題目

「請分享一次你需要影響一群不向你報告的人、讓他們改變原本的方向的經驗。你是怎麼做到的？」（Tell me about a time you influenced stakeholders without authority. 來源：gururo.com 整理的 PM／專案管理行為面試題庫，依 PMI 現行 CCR 規範校對，2026 年 10 月更新）

### 拆解思路

1. **說清楚對方為什麼會抗拒**：先講那群人原本的立場、他們手上的 KPI 或壓力是什麼——不講清楚動機，後面「你怎麼影響他們」就只是你一個人的獨白，面試官聽不出你有沒有真的理解對方。
2. **用 SBI 的 Behavior 定義你觀察到的具體行為**：不要說「團隊不太配合」，要說「工程團隊連續三週把這個需求排到 backlog 最底層，理由是沒看到跟他們 OKR 的關聯」。具體到這個程度，才算真的做過診斷。
3. **講出你找到的共同利益或指標**：你怎麼把自己要的方向，包裝成對方也在乎的東西——找到一個雙方都認的數字或目標，是「影響力」跟「硬推」的分界線。
4. **列出你實際做的動作，不是你的職位**：你沒有正式權力，所以能用的只有證據、同盟、或一個小規模的賭注（例如先用一個小範圍的實驗讓對方看到結果）。講清楚你具體做了哪一步，而不是「我去跟他們溝通」。
5. **用 Impact 收尾，量化對方行為改變後的結果**：對方的行為實際上怎麼變了、帶來什麼可驗證的結果，最好附上時間點,讓這個故事可以被追問。

### 範例回答（面試時可以這樣講）

> **情境與對方的行為（SBI 的 Situation + Behavior）**：「我們當時想推一個跨團隊的資料標準化專案，但負責三個下游系統的工程團隊,連續三個 sprint 都沒把這個需求排進去——他們的理由很一致：這件事不在他們的 OKR 裡，而且每次改動都要額外測試，對他們來說只有成本、沒有好處。」
>
> **我做的事（Action，用找共同利益代替硬推）**：「我沒有直接去找他們主管施壓，而是先去訪談了三個下游團隊各自最頭痛的 bug，發現有兩個團隊排查時間最長的問題，根源都是同一批欄位格式不一致。我把這個發現做成一頁紙,標出『如果資料標準化完成,你們這兩類 bug 的排查時間預估會從平均 4 小時降到 1 小時以內』,直接拿去跟最抗拒的那個團隊主管一對一談,而不是在跨團隊會議上提。」
>
> **結果（Impact）**：「那個團隊主管看完之後主動把這個需求排進了下一個 sprint，另外兩個團隊看到他們先動了，也跟著排進去，三週內三個團隊都完成了標準化改動。兩個月後追蹤，那兩類 bug 的平均排查時間確實降到了 50 分鐘左右。這次之後我養成一個習慣：要影響沒有義務聽我的人,先去找他們本來就在意、但還沒被量化過的痛點,而不是直接拿我要的結果去說服他們。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 講清楚對方抗拒的動機或壓力來源 | |
| 用 SBI 講出具體可觀察的行為，不是形容詞 | |
| 找到雙方都在乎的共同利益或指標 | |
| 具體行動是證據／同盟／小規模賭注,不是單純「溝通」 | |
| 有可驗證的 Impact，附時間點 | |
| 加分項：故事結尾有講出一個你後來帶走的習慣或原則 | |

## 今日案例

**Slack：把失敗的遊戲砍掉，押注團隊內部用的訊息工具**

Stewart Butterfield 的團隊 Tiny Speck 花好幾年開發線上遊戲 Glitch，到 2012 年始終沒能找到足夠大的玩家群,最後決定關掉。但這支分散各地的團隊在開發 Glitch 的過程中，自己打造了一個內部用的訊息、檔案分享與可搜尋歷史紀錄工具（最早叫 Linefeed）。Butterfield 做的判斷,不是在遊戲上繼續加碼或小修小補,而是整個放棄遊戲業務,把這個內部工具重做成一個獨立產品。2013 年 8 月公開上線當天就有約八千家公司註冊，團隊選擇靠產品本身在團隊內部好用、自然擴散，而不是靠企業銷售去推。Slack 後來在 2021 年被 Salesforce 以 277 億美元收購。

**面試連結**：這個案例可以直接用來回答「你曾經做過一個跟多數人預期相反的判斷」或「你怎麼決定該放棄還是該堅持」這類題型——Butterfield 真正展現的判斷力,不是「堅持到底」,是看見團隊自己真正在用的東西,跟原本寫在計畫書上的東西不一樣,然後有勇氣把官方計畫砍掉。如果你今天的練習題故事裡,也有一段「我原本的計畫不是這樣,但我看到了別的訊號」,那就是同一種判斷力在不同情境下的版本。

## 延伸閱讀

- [40 Behavioral Interview Questions With Sample Answers (2026) - Pin](https://www.pin.com/blog/behavioral-interview-questions/) — 四萬八千份職缺描述統計，衝突處理只佔 10.9% 的數據來源
- [The SBI Feedback Model: A Quick Win to Improve Talent Conversations - CCL](https://www.ccl.org/articles/leading-effectively-articles/sbi-feedback-model-a-quick-win-to-improve-talent-conversations-development/) — SBI 框架原始出處，Center for Creative Leadership 的完整說明
- [Behavioral Interview Questions Reddit: PM & Fit Guide - Soreno](https://soreno.ai/articles/behavioural-interview-questions-reddit) — McKinsey PEI 準備邏輯：把衝突、影響力、死線、團隊合作各準備兩個故事的方法

## 本週回顧

| 日 | 主題 | 練習題 | 自評 |
|----|------|--------|------|
| 一 11/09 | Product Sense | Zoom AI 逐字稿寄出後出席率下降，用 Human Delta 框架拆 Meta 面試真題 | ☐ 完成 ☐ 需複習 |
| 二 11/10 | Metrics & Analytics | （本次 routine 未產出，無練習紀錄） | — |
| 三 11/11 | Strategy & Execution | （本次 routine 未產出，無練習紀錄） | — |
| 四 11/12 | AI Product Design | （本次 routine 未產出，無練習紀錄） | — |
| 五 11/13 | Growth & Experimentation | Slack PM 真題：在邀請、跨公司頻道之外找新的 product-led growth 迴圈 | ☐ 完成 ☐ 需複習 |
| 六 11/14 | Technical PM | Stripe 真實案例：把 `verified` boolean 換成 `status` enum,不打斷兩百家客戶的整合 | ☐ 完成 ☐ 需複習 |
| 日 11/15 | Behavioral | 影響不向你報告的人：用 SBI 把「對方做了什麼」講具體 | ☐ 完成 ☐ 需複習 |

### 下週預告

下週（11/16–11/22）維持標準輪替，沒有加練主題：一 Product Sense、二 Metrics & Analytics、三 Strategy & Execution、四 AI Product Design、五 Growth & Experimentation、六 Technical PM、日再回到 Behavioral & Weekly Review。本週 Metrics、Strategy、AI Product 三天都沒有產出紀錄，如果這三個主題本來就是你的弱項，可以考慮把 `src/data/interview-focus.json` 裡對應的權重調高，讓 routine 在非固定日也抽到這些主題補練。

## 參考資料

- [Behavioral Interview Questions For Project Managers (+ STAR) - gururo.com](https://gururo.com/behavioral-interview-questions-for-project-managers/) — 對應「今日練習題」題目來源，依 PMI CCR 規範校對
- [The SBI Feedback Model: A Quick Win to Improve Talent Conversations - CCL](https://www.ccl.org/articles/leading-effectively-articles/sbi-feedback-model-a-quick-win-to-improve-talent-conversations-development/) — 對應「核心框架速記」SBI 部分
- [40 Behavioral Interview Questions With Sample Answers (2026) - Pin](https://www.pin.com/blog/behavioral-interview-questions/) — 對應「核心框架速記」STAR 部分與今日主題的統計數據
- [Top 10 Product Management Case Studies Every Product Manager Should Know - PolarisCampus](https://polariscampus.com/blogs/product-management-case-studies/) — 對應「今日案例」Slack 從 Glitch 轉型的真實決策
