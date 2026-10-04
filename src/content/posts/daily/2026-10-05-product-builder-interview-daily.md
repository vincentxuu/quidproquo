---
title: "Product Builder 面試日練 — 2026-10-05：Product Sense"
date: 2026-10-05
category: daily
type: digest
tags: [product-builder-interview, daily, product-sense]
lang: zh-TW
description: "用 CIRCLES 搭配 RICE 評分法，練一道「工程資源有限，社群 App 要怎麼排序 stories／訊息／分析五個功能」的優先序題，案例是 Intercom 在 2018 年發明 RICE 的真實原因。"
tldr: "Product Sense 題目裡最容易翻車的不是想不出功能，而是在資源有限時說不出『為什麼先做這個、不做那個』的具體理由。今天練一道真實面試題：『一個社群 App 在青少年族群中成長中，但工程資源有限，身為 PM 你要怎麼排序 stories、活動、個人檔案、訊息、分析這五個功能？』答案骨架延用 CIRCLES——先問清楚情境與限制，鎖定要服務的使用者，找出真正需求，再用清單列方案——但這次把『Cut 列方案』到『Ladder 排優先序』這兩步換成 RICE 評分法：Reach（觸及多少使用者）、Impact（對每位使用者的影響程度）、Confidence（這個估計有多少把握）、Effort（要花多少工程成本），四項算出一個分數，讓排序從『感覺哪個重要』變成可以被挑戰、可以重現的數字。案例是 Intercom 自己——RICE 正是 2018 年 Intercom 產品經理 Sean McBride 在公司內部部落格發表的框架，起因是團隊排 roadmap 時長期被『聲音最大的人』主導，缺乏一致的比較基準，於是他們把四個因素做成一套可重複使用的計分法，後來變成全產業最常用的優先序框架之一。"
series:
  name: "Product Builder 面試日練"
  order: 47
---

> 🌏 [English version](/en/posts/daily/2026-10-05-product-builder-interview-daily-en)

## 今日主題

Product Sense 面試考的不只是「你有沒有好點子」，更常考「工程資源有限時，你怎麼決定先做哪個」。這類題目故意給出一串看起來都合理的功能清單，就是要看候選人會不會一股腦全部都想做，還是能先定義清楚「誰最需要什麼」，再用一致的標準把方案排出先後順序。

這個主題在面試中重要，是因為真實的產品工作裡，資源永遠不夠用，排序能力直接決定團隊的產出有沒有對準使用者真正的需求。面試官要看的不是你選了哪個功能，而是你能不能把「這個先做、那個後做」的理由講得讓所有利害關係人都能理解、也能被挑戰。

## 核心框架速記

### CIRCLES 方法

拿到「幫我排序／規劃 XX」這類開放題時，先用六步把思考過程撐起來，避免一聽到功能清單就直接憑直覺排序：

| 步驟 | 全名 | 面試時要做的事 |
|------|------|----------------|
| **C**omprehend | 理解情境 | 先問清楚產品現況、團隊資源限制、題目本身的邊界條件 |
| **I**dentify | 鎖定使用者 | 這些功能分別服務哪些使用者群？誰是現階段最該優先滿足的對象？ |
| **R**eport | 找出需求 | 這群使用者現在卡在哪一步？哪個需求不滿足，流失風險最高？ |
| **C**ut | 列出方案 | 把題目給的功能清單對應到剛才找出的需求 |
| **L**adder | 排優先序 | 用一致的評分標準（見下方 RICE）排出先後順序 |
| **E**valuate | 收斂總結 | 說明第一個該做的是什麼，以及怎麼衡量它有沒有成功 |

**面試時的用法**：CIRCLES 的「L（Ladder）」步驟最容易被候選人跳過，直接憑印象排序。這正是候選人與候選人之間最容易拉開差距的地方——有沒有一套可以攤開來講、能被面試官追問的排序邏輯。

### RICE 評分法

當題目明確要求「排序」而不是「設計」時，用 RICE 把 CIRCLES 的「Ladder」步驟具體化成四個可以逐一回答的問題：

| 因素 | 問的問題 | 給分方式 |
|------|----------|----------|
| **R**each | 這個功能在固定期間內會被多少使用者碰到？ | 用具體人數或比例估算，而非「很多人」 |
| **I**mpact | 對每個碰到的使用者，體驗改變有多大？ | 常見刻度：3＝巨大、2＝高、1＝中、0.5＝低、0.25＝極小 |
| **C**onfidence | 前兩項估計有多少把握？ | 100%＝有數據支撐、80%＝中高把握、50%＝合理推測 |
| **E**ffort | 要花多少工程／設計成本？ | 以人月或 sprint 數估算 |

**RICE 分數 ＝（Reach × Impact × Confidence）÷ Effort**。分數高的排前面，但面試時務必補一句：RICE 分數是幫助討論收斂的工具，不是不能被推翻的硬規則——如果某個低分項目有策略性理由（例如合規要求、競品差異化），要講得出來為什麼你仍然會調整順序。

## 今日練習題

### 題目

「一個社群 App 在青少年族群中正在成長，但工程資源有限。身為 PM，請排序以下潛在功能：stories、活動（events）、個人檔案、訊息、分析。」

（來源：product management 案例集，[theproductfolks.com](https://www.theproductfolks.com/product-management-blog/product-manager-case-study-questions-explained)）

### 拆解思路

1. **釐清問題**：先問面試官——這是一個全新產品還是既有產品的下一階段？「工程資源有限」具體是多緊（例如一個 sprint 只能上一個功能，還是一季只能上兩個）？現在青少年使用者主要透過什麼管道在用這個 App（學校社群、朋友邀請、還是從其他平台轉移過來）？
2. **定義使用者**：把青少年使用者拆成至少兩種情境——「已經有一群朋友在用、天天開 App 找朋友動態」的核心使用者，跟「剛被朋友邀請進來、還在觀望要不要留下」的新使用者。這兩種人對這五個功能的迫切程度完全不同。
3. **結構化分析**：對每個功能問「它服務的是核心使用者還是新使用者」「它解決的是發現內容的需求、還是建立關係的需求、還是個人表達的需求」。例如個人檔案偏向新使用者建立初步身份認同，訊息跟 stories 偏向核心使用者維持每天回訪的理由，分析偏向營運團隊而非終端使用者，活動則要看目前使用者結構是不是已經有「群組」這個概念存在。
4. **提出方案**：用 RICE 幫每個功能打分——訊息跟 stories 通常 Reach 高（幾乎所有使用者都會用到）、Impact 高（直接影響每天回不回來），但 Effort 也不低；個人檔案 Effort 低、Impact 中等，適合作為低成本先上線的項目；分析對終端使用者 Reach 趨近於零，應該排在最後或乾脆不在這次排序範圍內。
5. **定義成功**：排序結果不是「先做訊息」就結束，而是要講出「做完這個功能，我預期哪個指標在幾週內會動」——例如訊息上線後看的是「有傳送至少一則訊息的使用者占比」與「次週回訪率」，而不是籠統的使用者總數。同時講清楚什麼情況下你會打斷目前的順序去插隊做分析（例如營運團隊完全看不到流失訊號，導致後面的排序決策本身失去依據）。

### 範例回答（面試時可以這樣講）

> **問題釐清與定位**：「我會先確認『工程資源有限』的具體程度——是這一季只能上兩個功能，還是每個 sprint 只能上一個。接著我會把使用者拆成兩種：已經有朋友在用、天天回來看動態的核心使用者，跟剛被邀請進來、還在觀望的新使用者，因為這五個功能對這兩群人的急迫程度完全不一樣，不能用同一套標準排序。」
>
> **結構化分析與排序**：「確認情境後，我會對每個功能問它主要服務誰、解決什麼需求，再用 RICE 打分數。訊息跟 stories 的 Reach 跟 Impact 都高，因為它們直接決定使用者明天會不會再打開 App，我會優先排這兩個；個人檔案的 Effort 低、能快速提升新使用者的留下來的意願，適合當成低成本先上的項目；分析對終端的青少年使用者幾乎沒有直接價值，Reach 趨近於零，我會排在這次資源分配的最後，除非營運團隊已經因為缺乏數據而做不出下一步決策。」
>
> **成功定義**：「我不會只說『先做訊息』就結束，而是講清楚做完之後我預期看到什麼變化——訊息上線後,我看的是『有傳送至少一則訊息的使用者占比』跟『次週回訪率』有沒有明顯提升。如果兩週後這兩個數字都沒有動,那代表我對 Impact 的估計錯了,RICE 分數需要重新打,而不是堅持原本的排序。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 先問清楚資源限制的具體程度，而非假設一個數字 | |
| 把使用者拆成至少兩種情境，需求分開討論 | |
| 用一致的評分標準（如 RICE）排序，而非憑印象 | |
| 排序結果對應到每個功能服務的具體需求 | |
| 定義每個功能上線後要看哪個指標變化，而非只看「做完了」 | |
| 加分項：講出什麼情況下你會打斷既定順序插隊處理 | |

## 今日案例

**Intercom：因為「聲音最大的人贏」而發明了 RICE**

2018 年 1 月，Intercom 產品經理 Sean McBride 在公司官方部落格發表〈RICE: Simple prioritization for product managers〉。起因是 Intercom 的產品團隊長期面對同一個問題：排 roadmap 時，不同構想彼此差異很大（有的觸及全部使用者但影響很小、有的只影響一小群人但影響深遠），團隊缺乏一致的比較基準，討論最後往往變成「誰的立場講得比較大聲、比較堅持，誰的構想就排前面」。McBride 跟同事從第一性原理出發，測試了多種評分方式後，收斂成 Reach、Impact、Confidence、Effort 四個因素相乘相除的單一分數，讓原本無法直接比較的構想可以攤在同一張表上討論。

**面試連結**：這個案例是「用一致標準取代印象排序」最直接的示範——Intercom 面對的正是今天練習題裡「工程資源有限、功能彼此很難比較」的處境。回答任何涉及功能排序的題目時，可以直接引用這段起源說明「為什麼需要一套可重複使用的評分法，而不是每次排序都重新吵一次」。

## 延伸閱讀

- [Product Manager Case Study Questions Explained](https://www.theproductfolks.com/product-management-blog/product-manager-case-study-questions-explained) — 今日練習題的原始出處，同時列出 Opportunity Assessment、MECE、RICE、AARRR 四種常見案例框架
- [Product Sense Interview Prep (2026 Guide)](https://www.tryexponent.com/blog/product-sense-interview) — Aced（原 Exponent）整理的 Product Sense 面試完整流程與追問模式
- [RICE: Simple prioritization for product managers](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers) — RICE 框架原始出處，今日案例的第一手來源

## 參考資料

- [Product Manager Case Study Questions Explained](https://www.theproductfolks.com/product-management-blog/product-manager-case-study-questions-explained) — 對應「今日練習題」社群 App 功能排序題的原始出處
- [RICE: Simple prioritization for product managers](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers) — 對應「今日案例」Intercom 2018 年發明 RICE 的完整脈絡與原始定義
- [RICE Prioritization: Framework, Formula & Template (2026)](https://kayako.com/blog/rice-prioritization) — 對應「核心框架速記」RICE 評分法四項因素的計分方式說明
