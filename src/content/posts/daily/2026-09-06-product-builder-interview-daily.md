---
title: "Product Builder 面試日練 — 2026-09-06：Behavioral & Weekly Review"
date: 2026-09-06
category: daily
type: digest
tags: [product-builder-interview, daily, behavioral]
lang: zh-TW
description: "今日練 Behavioral 面試：用 SBI 框架（Situation-Behavior-Impact）拆解一道跨部門衝突題，避免把對方行為講成人身攻擊或情緒發洩，並用 Netflix Qwikster 事件練『公開認錯、快速逆轉』的當責案例。附本週六天回顧。"
tldr: "衝突類 behavioral 題最容易垮的地方，不是你有沒有處理過衝突，是你講對方的時候聽起來像在告狀還是在講事實。今天用 SBI 框架（Situation-Behavior-Impact）練怎麼客觀描述另一個人的行為與影響，搭配 mockround.ai 整理的 PM 專屬衝突題「跟跨部門關係人有衝突，你怎麼處理」，案例是 Reed Hastings 在 Qwikster 事件裡怎麼公開認錯、又在三週內全盤逆轉決策，把一場公關災難收斂成一次可信的當責示範。文末附本週六天回顧與下週預習方向。"
series:
  name: "Product Builder 面試日練"
  order: 18
---

> 🌏 [English version](/en/posts/daily/2026-09-06-product-builder-interview-daily-en)

## 今日主題

Behavioral 面試裡最容易踩雷的一類題目是衝突題——不是因為候選人沒有衝突可講，是講的方式很容易滑向兩種極端：把對方講成反派（聽起來在告狀、政治化），或把整個衝突模糊成「後來我們就溝通清楚了」（聽起來像在迴避細節）。面試官真正想聽的，是你能不能在講「對方做了什麼」的時候保持客觀事實，同時講出你怎麼判斷、怎麼取捨。

今天要練的是 SBI 框架——一個原本用在給回饋的工具，拿來描述衝突裡「對方的行為」特別好用，因為它逼你先講事實，再講影響，不直接跳到評價或猜測動機。案例則看 Reed Hastings 在 Netflix Qwikster 事件裡怎麼公開認錯，又在三週內整個逆轉決策——這是「當責與快速修正」這類問題的經典素材。

## 核心框架速記

### SBI：把「對方做了什麼」講成事實，而不是指控

SBI（Situation-Behavior-Impact）原本是管理學裡用來給回饋的工具，用在衝突類 behavioral 題裡特別有效，因為它強迫你把「對方的行為」跟「你對這件事的評價」分開講：

| 步驟 | 內容 | 常見失誤 |
|------|------|---------|
| **Situation** | 具體的時間與場景，不要用「常常」「每次」這種概括詞 | 講成一個持續已久的抽象印象，聽不出是不是真的發生過 |
| **Behavior** | 客觀描述你看到、聽到的具體行為——只講事實，不講你猜測的動機 | 直接講「他不尊重我的專業」，這是評價不是行為 |
| **Impact** | 這個行為造成的具體影響：對專案時程、對團隊士氣、對你自己的決策 | 只講「我覺得很挫折」，沒有講出對產品或團隊的具體後果 |

SBI 通常不是拿來取代 STAR，是嵌在 STAR 的 Situation 或 Action 段落裡，專門處理「怎麼講另一個人做了什麼」這一小段——這正是衝突題裡最容易講壞的地方。

### 衝突題的五個檢查點

PM 專屬的衝突處理，跟工程或業務角色不同，考的是你能不能在多方利益衝突（工程要穩定、設計要體驗、業務要速度、主管要成果）中找到一個不靠拗贏對方的解法：

1. 用資料和使用者情境代替情緒與立場對抗
2. 對其他職能的顧慮表現出真正的理解，而不是表面附和
3. 需要升級（escalate）時清楚知道找誰、什麼時候找
4. 做出決定的同時保住關係，不是贏了辯論、輸了合作
5. 事後能講出這次決定的判斷邏輯，而不是「後來就順利解決了」

## 今日練習題

### 題目

「說一次你跟一位跨部門關係人（工程、設計、業務或高層）發生衝突的經驗。你當時怎麼處理？事後回頭看，你會怎麼做不一樣的選擇？」

（來源：mockround.ai《How to Answer "Describe a Conflict at Work" for a Product Manager Interview》整理的 PM 專屬衝突題）

### 拆解思路

1. **選對故事**：挑一個跟真實產品決策綁在一起的跨部門衝突，不要選單純的人際摩擦——面試官要看的是你怎麼在職能立場衝突（不是個性不合）裡做判斷。
2. **用 SBI 交代對方的行為**：先講具體場景，再客觀描述對方做了什麼（不猜動機），最後講這個行為造成什麼影響，避免整段故事聽起來像在告狀。
3. **講清楚你怎麼回應,而不是你怎麼贏**：重點放在你用了什麼資料或使用者情境去拆解對方顧慮的根源，而不是你的論點多有說服力。
4. **交代取捨與升級路徑**：如果雙方立場真的無法收斂，你什麼時候選擇升級、找誰仲裁——面試官想確認你不是靠一路硬拗。
5. **收在 Reflection**：講出這次衝突後你怎麼調整自己處理類似情境的方式，證明這是內化的習慣，不是一次性的運氣。

### 範例回答（面試時可以這樣講）

> **用 SBI 交代衝突，不指控對方**：「大概八個月前，我負責的一個結帳流程優化，在跨部門會議上被工程主管公開反對。具體發生的事情是：我提案要在結帳頁加一個即時庫存提示，他當場說『這個做不到，會拖慢頁面』，會議剩下的時間他沒有再提出替代方案，只是重申立場。這件事直接的影響是,那次會議沒有做出任何決定,而業務團隊已經跟一個大客戶承諾了上線時間。」
>
> **講怎麼拆解顧慮，而不是硬拗**：「我沒有在會議上繼續辯論，會後約他一對一，才發現他真正的顧慮不是『做不到』，是上一季有個類似功能上線後拖垮了頁面載入速度，被主管點名檢討過。我提出先做一個只讀快取版本，庫存數字每五分鐘更新一次而不是即時查詢，這樣完全不會碰他擔心的那條查詢路徑，也還是能滿足業務要的『看得到庫存』體驗。」
>
> **交代結果與 Reflection**：「這個折衷方案讓功能準時上線，轉換率提升了 4%，而且他後來主動在下一次規劃會議上先問我『這次的資料查詢方式會不會有問題』——代表信任有建立回來。回頭看，我學到的是：對方在會議上把立場講得很硬,通常不是不講理，是踩過一次痛點沒有被聽見。現在遇到類似的公開反對，我會先假設對方有一個沒講出口的具體理由，而不是急著在會議上說服他。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 用 SBI 客觀描述對方的行為與影響，沒有變成指控或猜測動機 | |
| 講清楚你怎麼拆解對方顧慮的根源，不是只講你多有說服力 | |
| 有量化或具體的 Result | |
| 交代了升級路徑或折衷方案，而不是單方面說服到底 | |
| Reflection 落在具體的行為改變，而非「後來就溝通清楚了」 | |
| 加分項：能講出這次衝突讓你之後怎麼調整處理類似情境的方式 | |

## 今日案例

**Netflix Qwikster：公開認錯，三週內整個逆轉決策**

2011 年 7 月，Netflix 把訂閱方案的 DVD 郵寄與線上串流分開計費，等於讓同時使用兩種服務的使用者漲價約 60%，引發第一波反彈。9 月 18 日，CEO Reed Hastings 在官方部落格發表道歉文，坦承自己「傲慢」，卻同時宣布把 DVD 郵寄業務改名為獨立品牌「Qwikster」、另立網站——這個決定讓反彈更嚴重，使用者抱怨要維護兩個帳號、兩張帳單。10 月 10 日，也就是道歉文發出後不到一個月，Hastings 直接宣布取消 Qwikster 計畫，使用者只需要用一個網站、一組帳號，同時坦言「這是移動太快，而不是移動快本身的問題」。NPR 報導引述 Netflix 當時估計流失了約 100 萬名訂閱會員，股價自 7 月以來已腰斬。

**面試連結**：這個案例是「怎麼公開處理自己或團隊的失誤」這類問題的絕佳素材——重點不是 Hastings 有沒有道歉，是他在道歉之後仍然堅持了一個讓情況惡化的決定，直到使用者用實際流失數字證明這個決定錯了，才快速全盤收回。回答類似問題時可以強調：認錯的價值在於「之後的行為有沒有真的改變」，而不是道歉文寫得多誠懇；能不能在證據出現時迅速放棄一個自己剛公開宣布的決定，反而比一開始就不犯錯更能證明判斷力。

## 延伸閱讀

- [mockround.ai：How to Answer "Describe a Conflict at Work" for a Product Manager Interview](https://mockround.ai/resources/how-to-answer-describe-a-conflict-at-work-for-a-product-manager-interview) — 今日練習題的框架與題目出處，附 PM 專屬的五個檢查點。
- [mockround.ai：The Right Way to Discuss Projects That Ultimately Failed](https://mockround.ai/resources/the-right-way-to-discuss-projects-that-ultimately-failed) — 補充失敗故事的修正版 STAR 框架（Situation-Task-Action-Result-Reflection），跟今天的 SBI 框架互補。
- [The Official Netflix Blog（Wayback Machine 存檔）：An Explanation and Some Reflections](https://web.archive.org/web/20120614132217/http:/blog.netflix.com/2011/09/explanation-and-some-reflections.html) — 今日案例的第一手來源，Reed Hastings 原始道歉全文。

## 本週回顧

| 日 | 主題 | 練習題 | 自評 |
|----|------|--------|------|
| 一 (08-31) | Product Sense | 幫 LinkedIn 設計一個新功能（Adobe PM 面試真題） | ☐ 完成 ☐ 需複習 |
| 二 (09-01) | Metrics & Analytics | YouTube 留言數上升、觀看時長卻下降的矛盾分析 | ☐ 完成 ☐ 需複習 |
| 三 (09-02) | Strategy & Execution | Google 該不該跨足線上家具零售市場 | ☐ 完成 ☐ 需複習 |
| 四 (09-03) | AI Product Design | Slack 摘要助理誤判 owner，怎麼重新設計才值得信任 | ☐ 完成 ☐ 需複習 |
| 五 (09-04) | Growth & Experimentation | How would you 3x Airbnb's growth?（Exponent 真題） | ☐ 完成 ☐ 需複習 |
| 六 (09-05) | Technical PM | 設計一個 Ledger Service（Stripe 技術輪真題） | ☐ 完成 ☐ 需複習 |
| 日 (09-06) | Behavioral | 跟跨部門關係人的衝突，你怎麼處理 | ☐ 完成 ☐ 需複習 |

### 下週預告

下週從 09-07（一）開始，輪替重新回到 Product Sense：

- **一 Product Sense**：複習 CIRCLES 框架，練習把模糊的功能設計題收斂到具體使用者分群，而不是一次列十個構想。
- **二 Metrics & Analytics**：準備指標樹的畫法，練習在多個訊號互相矛盾時，先判斷哪個指標可能在「說謊」。
- **三 Strategy & Execution**：複習五力分析與 TAM-SAM-SOM，練習講清楚「進入這個市場要放棄什麼」而不是只講市場多大。
- 本週回顧裡如果有題目自評是「需複習」，優先在下週對應的固定日之前重練一次，尤其是這週的 Metrics 跟 Technical PM——這兩題的取捨邏輯最容易在臨場被追問卡住。

## 參考資料

- [mockround.ai：How to Answer "Describe a Conflict at Work" for a Product Manager Interview](https://mockround.ai/resources/how-to-answer-describe-a-conflict-at-work-for-a-product-manager-interview) — 對應「核心框架速記」的衝突五檢查點與「今日練習題」的題目出處。
- [mockround.ai：The Right Way to Discuss Projects That Ultimately Failed](https://mockround.ai/resources/the-right-way-to-discuss-projects-that-ultimately-failed) — 對應「核心框架速記」中修正版 STAR 框架的補充來源。
- [The Official Netflix Blog（Wayback Machine 存檔）：An Explanation and Some Reflections](https://web.archive.org/web/20120614132217/http:/blog.netflix.com/2011/09/explanation-and-some-reflections.html) — 對應「今日案例」Reed Hastings 道歉全文。
- [NPR：Netflix Scuttles Its 'Qwikster' DVD Rental Plan](https://www.npr.org/sections/thetwo-way/2011/10/10/141209082/netflix-kills-qwikster-price-hike-lives-on) — 對應「今日案例」中逆轉決策的時間點與訂閱流失數字。
