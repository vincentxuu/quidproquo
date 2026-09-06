---
title: "Product Builder 面試日練 — 2026-09-07：Product Sense"
date: 2026-09-07
category: daily
type: digest
tags: [product-builder-interview, daily, product-sense]
lang: zh-TW
description: "今日練 Product Sense 面試：用 CIRCLES 框架搭配 JTBD（使用者任務）拆解一道 Google 產品經理面試真實出現的『幫機場旅客設計一個產品』題目，案例是 Superhuman 用四步驟問卷把產品市場契合度從 22% 拉到 58% 的做法。"
tldr: "Product Sense 題最常見的失手不是想不出方案，是分群分得太籠統、卡在『所有旅客都想要更順暢的體驗』這種空話。今天用 CIRCLES 框架收斂範圍，再疊一層 JTBD（Jobs-to-be-Done）把痛點寫成『情境 + 動機 + 現有替代方案的不足』，練 Google product sense screen 常出現的『幫機場旅客設計一個產品』題目。案例是 Rahul Vohra 怎麼用『如果不能再用這個產品你會有多失望』的四問卷調查，把 Superhuman 的產品市場契合度從 22% 拉到 58%，示範怎麼用具體分群取代直覺猜測。"
series:
  name: "Product Builder 面試日練"
  order: 19
---

> 🌏 [English version](/en/posts/daily/2026-09-07-product-builder-interview-daily-en)

## 今日主題

Google 把 product sense 輪獨立稱為「product insight」round，用意很明確：不是看你能不能想出功能，是看你能不能在 45 分鐘內把一個開放題目收斂成一個站得住腳的方向。Aced（原 Exponent）整理的 Google PM 面試指南提到，這輪走的是「結構化、偏顧問風格」的路線——清楚的框架跟邏輯順序，比天馬行空的腦力激盪更值錢。

多數人卡關的地方不是缺乏框架，是分群分得太籠統，講到「使用者想要更順暢的體驗」就停住了，聽起來像是套模板而不是真的理解使用者。今天在 CIRCLES 之外疊一層 JTBD（Jobs-to-be-Done），逼自己把痛點寫成具體情境，而不是形容詞。

## 核心框架速記

### CIRCLES：撐住整個回答的骨架

| 步驟 | 內容 | 常見失誤 |
|------|------|---------|
| **C**omprehend | 釐清題目範圍（產品、平台、成功定義） | 沒問清楚就開始發散 |
| **I**dentify customers | 切出 2-3 個使用者分群 | 分群太籠統，彼此重疊 |
| **R**eport needs | 針對每個分群，講出具體痛點 | 痛點寫成抽象形容詞，沒有情境 |
| **C**ut through prioritization | 選一個分群 + 痛點，其他先放下 | 捨不得收斂，想面面俱到 |
| **L**ist solutions | 針對選定痛點列出多個方案 | 只想到一個方案就往下講 |
| **E**valuate trade-offs | 比較方案的效益、成本、風險 | 只講優點不講代價 |
| **S**ummarize | 一句話收斂成最終建議 | 結尾模糊，沒有明確立場 |

### JTBD：把「R（Report needs）」寫成具體任務

CIRCLES 的「R」最容易寫成一句空話。JTBD 的 Job Story 格式逼你把痛點填進固定結構：

| 元素 | 問法 | 範例（機場旅客） |
|------|------|------|
| 情境 | 使用者在什麼具體時刻遇到這個問題？ | 轉機時間只剩 40 分鐘，還要通過安檢 |
| 動機 | 他想完成的任務是什麼？ | 確認自己能不能趕上下一班登機門 |
| 現有替代方案的不足 | 他現在怎麼解決？為什麼不夠好？ | 看機場螢幕的登機時間，但螢幕不會顯示「從這裡走到登機門要幾分鐘」 |

寫出這三格，面試官問「為什麼是這個痛點」時，你能直接指回具體情境，而不是憑感覺往下講。

## 今日練習題

### 題目

「幫機場旅客設計一個產品。」

（來源：Aced（原 Exponent）《Google Product Manager (PM) Interview Guide》整理的 Google product sense screen 真實提示；題型：Product sense round）

### 拆解思路

1. **釐清問題**：先問清楚範圍——是設計一個全新產品，還是一個功能？聚焦哪個機場情境（國內線轉機、跨國線通關、還是候機）？成功怎麼定義（滿意度、還是某個具體行為指標）？
2. **定義使用者**：不要停在「機場旅客」，往下切成行為分群，例如：轉機時間緊迫、擔心趕不上下一班的旅客；帶小孩或長輩、行動較慢需要更多緩衝時間的旅客；商務常客、熟悉流程但在意等待時間被浪費的旅客。
3. **用 JTBD 寫出具體任務**：針對選定分群，把痛點寫成情境 + 動機 + 現有替代方案不足。例如轉機旅客的任務是「在剩餘時間內判斷自己能不能安全趕上登機門」，現有的機場螢幕只顯示登機時間，不顯示「從目前位置走過去要幾分鐘」，這個資訊落差才是真正的卡點。
4. **提出方案**：針對這個任務設計方案——例如結合機場地圖與即時安檢排隊長度，即時算出「還剩多少緩衝時間」的倒數提示；同時列出至少一個替代方案（例如讓地勤主動廣播高風險旅客），並講出取捨。
5. **定義成功**：主要指標可以是「趕上原定班機的轉機旅客比例」；guardrail 指標是誤導旅客導致漏接廣播或誤判時間的申訴數，避免演算法過度樂觀估算步行時間。

### 範例回答（面試時可以這樣講）

> **問題釐清與分群**：「我想先確認範圍——這題我會聚焦在轉機情境，而不是從家裡出發到機場那段。轉機旅客裡我會切出三群：轉機時間緊迫、擔心趕不上下一班的旅客；帶小孩或長輩、需要更多緩衝時間的旅客；還有熟悉流程的商務常客。我想先聚焦第一群，因為他們的痛點最急迫，也最容易在現有產品裡被忽略。」
>
> **任務定位**：「用 Jobs-to-be-Done 來看，這群旅客的任務不是『想知道登機時間』，是『在剩餘時間內判斷自己能不能安全趕上登機門』。現在的機場螢幕只顯示登機時間跟登機門號碼，不會告訴你『從目前位置走過去、加上安檢排隊，實際要花幾分鐘』。這個資訊落差，才是他們真正卡住的地方，不是資訊不夠多，是資訊沒有轉成他們能馬上判斷的行動建議。」
>
> **方案與取捨**：「我會提一個結合機場地圖定位、即時安檢排隊長度、跟登機門距離的『剩餘緩衝時間』倒數提示，比純粹顯示登機時間更直接可行動。代價是需要機場即時排隊資料，準確度會受資料來源品質影響，如果高估緩衝時間反而更危險。主要指標我看『趕上原定班機的轉機旅客比例』，guardrail 是因為系統誤判導致漏接的申訴數，我會先在一到兩個大型轉機機場做試點，驗證資料準確度後再擴大。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 用澄清問題把題目範圍收斂（情境、指標、限制） | |
| 使用者分群是行為驅動，不是籠統的「所有旅客」 | |
| 痛點寫成「情境 + 動機 + 現有替代方案不足」，不是形容詞 | |
| 方案有講出「為什麼是這個任務」，不是功能清單 | |
| 成功指標有主要指標 + guardrail，不只講一個數字 | |
| 加分項：提到資料來源限制或需要試點驗證 | |

## 今日案例

**Superhuman：用四道問卷把產品市場契合度從 22% 拉到 58%**

2017 年，Superhuman 創辦人 Rahul Vohra 面對一個典型的 product sense 難題——團隊覺得產品已經做得不錯，但沒有數字能佐證「使用者真的離不開它」。他設計了一份只問四題的問卷，核心問題是「如果你不能再使用這個產品，你會有多失望？」，先算出「非常失望」的使用者比例當作產品市場契合度的基準分數。第一次調查結果是 22%，遠低於他設定的 40% 門檻。接下來他沒有急著加功能，而是把回答依角色與使用情境分群，找出「非常失望」那群人共同在意的具體功能，把資源優先投入那裡，同時刻意放慢對其他分群的迎合。這個「調查、分群、分析、優化」的循環跑了四季，分數從 22% 一路推到 58%。

**面試連結**：這個案例是 JTBD 分群思路的絕佳示範——與其問「使用者滿不滿意」這種籠統問題，Superhuman 先切出「非常失望」跟「不在乎」兩群人，只深挖前者的具體任務與情境。可以用來回答「你會怎麼驗證你做的東西是使用者真正想要的」或「舉一個你用資料佐證產品方向的例子」這類題目，重點是強調「先分群、再深挖單一分群」這個順序，而不是想同時滿足所有人。

## 延伸閱讀

- [Google Product Manager (PM) Interview Guide](https://www.tryexponent.com/guides/google-product-manager-interview) — Google product sense screen 的完整結構與評分重點
- [Pinterest Product Manager (PM) Interview Guide](https://www.tryexponent.com/guides/pinterest-product-manager-interview) — 另一種 product sense 出題邏輯：從「公司現有資產」出發設計新功能
- [Feature Prioritization Matrix for Product Teams - still valid in 2026?](https://userpilot.com/blog/feature-prioritization-matrix) — CIRCLES 的「Cut through prioritization」步驟延伸讀物，討論優先序矩陣容易失準的原因

## 參考資料

- [Google Product Manager (PM) Interview Guide](https://www.tryexponent.com/guides/google-product-manager-interview) — 對應「今日主題」與「今日練習題」的題目來源
- [Pinterest Product Manager (PM) Interview Guide](https://www.tryexponent.com/guides/pinterest-product-manager-interview) — 對應「延伸閱讀」的另一種 product sense 出題邏輯
- [The Ultimate Guide to Product Management Prioritization Frameworks](https://www.productplan.com/learn/product-management-frameworks) — 對應「核心框架速記」CIRCLES 表格
- [Superhuman Product Market Fit Case Study](https://www.hustlebadger.com/what-do-product-teams-do/superhuman-product-market-fit-case-study) — 對應「今日案例」四步驟問卷與分數演進
