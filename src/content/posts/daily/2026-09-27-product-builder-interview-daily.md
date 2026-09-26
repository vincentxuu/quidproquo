---
title: "Product Builder 面試日練 — 2026-09-27：Behavioral & Weekly Review"
date: 2026-09-27
category: daily
type: digest
tags: [product-builder-interview, daily, behavioral]
lang: zh-TW
description: "用 STAR 與 Situation-Behavior-Impact 框架練一道「專案失敗後你怎麼做」的行為面試題，附本週七個維度的回顧表。"
tldr: "行為面試最容易翻車的地方，不是想不出故事，而是把「失敗」講成一句委屈的辯解，卻答不出自己後來具體改了什麼決策流程。今天練一道情境題：monday.com 近期候選人回報的真實提問——『說一個你負責的專案最後失敗了，後來你怎麼做』。答案框架是 STAR 定骨架、SBI 補血肉：先用 Situation-Behavior-Impact 把「當時發生了什麼、我做了什麼、造成了什麼影響」講清楚，再用 STAR 的 Result 段落補上一句「後來我把這件事變成了什麼機制」，讓面試官聽到的不是一次性反省，而是可複製的改進。案例是 Instagram 的前身 Burbn——一個塞滿打卡、遊戲化、訊息功能卻沒人用的失敗產品，團隊沒有辯解「使用者還沒理解我們的願景」，而是直接砍掉所有功能只留下照片分享，兩週內衝上 2.5 萬使用者。"
series:
  name: "Product Builder 面試日練"
  order: 39
---

> 🌏 [English version](/en/posts/daily/2026-09-27-product-builder-interview-daily-en)

## 今日主題

星期日是本輪的 Behavioral 練習，也是一週回顧。行為面試看起來最好準備——反正都是「說一個你...的經驗」——但也最容易準備成陳腔濫調：一個「我很努力所以成功了」的故事,聽起來像沒有反省過。真正拉開差距的,是能不能誠實講一次失敗,並且講出後來具體改了什麼。

## 核心框架速記

**STAR**（Situation-Task-Action-Result）負責把故事講完整；**Situation-Behavior-Impact（SBI）**負責把「行為」和「後果」的因果講清楚，避免故事停在「發生了一件壞事」就結束。

| 框架 | 用途 | 關鍵提醒 |
|---|---|---|
| STAR | story 的骨架，確保有頭有尾 | Action 段落要最長，Result 要有具體數字或機制 |
| SBI | 講清楚「我的行為」和「造成的衝擊」的因果鏈 | Behavior 段落只講自己做的事，不夾帶別人的責任 |

兩者合用的順序：用 STAR 定義 Situation／Task，用 SBI 把 Action 拆成「具體行為」與「這個行為造成的影響」，最後用 STAR 的 Result 收尾成一句可驗證的變化。

## 今日練習題

### 題目

「說一個你負責的專案最後失敗了的經驗，後來你怎麼做？」

（來源：monday.com 近期候選人回報的真實面試提問，另有變體「描述一次你收到一開始不認同的回饋，後來你怎麼處理」）

### 拆解思路

1. **釐清問題**：面試官想聽的不是「發生了什麼壞事」，而是「你怎麼定義失敗、怎麼歸因」。開口前先確認：是要講一個你主導的專案，還是你參與但沒有決策權的專案？兩種故事的 Action 段落重點完全不同。
2. **選對故事**：挑一個「失敗原因跟自己的判斷有關」的故事，而不是「被別人搞砸」的故事。後者聽起來像推卸責任，前者才展現得出反省。
3. **結構化陳述（SBI）**：Situation 只用一到兩句帶過背景；Behavior 段落誠實講出「我當時做了什麼決定」，包含錯誤的判斷；Impact 段落講清楚這個決定造成的具體後果（時程延誤多久、使用者流失多少、團隊士氣受到什麼影響）。
4. **收斂成機制**：Result 段落不要停在「我學到了」，要講出「後來我把這件事變成了什麼可重複的流程」——例如加了一道審核關卡、改了排期方式、換了一種跟工程對齊的節奏。
5. **定義成功**：用一句話說明「這個機制後來被驗證有效」的證據，讓面試官相信這不是空話。

### 範例回答（面試時可以這樣講）

> **Situation & Behavior**：「我在前一份工作主導一個內部工具的重寫專案，目標是把舊系統的技術債清乾淨。我當時的判斷是先花六週做完整的架構重構，再一次性切換，理由是覺得分階段上線會製造更多維護成本。這個判斷後來證明是錯的——我低估了六週裡業務需求還在持續變動，等重構做完，有三個關鍵功能的需求已經跟原本的規格不一樣了。」
>
> **Impact**：「結果是專案延遲了將近四週才真正上線，而且上線後兩週內團隊又緊急補了兩次修正，工程團隊對『重寫』這個詞明顯產生了不信任感,後續有半年時間,只要我提議大範圍重構,大家的第一反應都是先問『這次會不會又拖四週』。」
>
> **Result（收斂成機制）**：「後來我把這件事變成了一條團隊規則：任何預估超過兩週的重構,一律拆成可以獨立上線的階段,每個階段結束後重新跟業務對一次需求,而不是先鎖定完整範圍再開工。這條規則在後續一個更大的資料遷移專案上驗證過——我們把原本估計十週的專案拆成五個兩週的階段,每階段結束後都有機會根據最新資訊調整下一階段的範圍,最後總工期反而比原本一次性做完的估計還短了一週,而且工程團隊主動說『這次拆分讓大家比較安心』。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 失敗的成因跟自己的判斷有關（不是推卸給別人） | |
| Behavior 段落講出具體決定，不是模糊帶過 | |
| Impact 段落有具體數字或可觀察的後果 | |
| Result 收斂成一個可重複的機制，不只是「我學到了」 | |
| 有一個後續案例證明這個機制真的有效 | |
| 加分項：說出這次反省如何改變了自己跟團隊互動的方式 | |

## 今日案例

**Instagram：從失敗的 Burbn 到活下來的照片分享 App**

Instagram 的前身 Burbn 是一個塞滿打卡、遊戲化積分、訊息、行程規劃功能的社交 App，兩位創辦人花了大半年做出一個功能齊全但沒什麼人真的黏著使用的產品。他們沒有選擇「使用者還沒理解我們的願景」這種辯解，而是回頭看使用行為數據，發現使用者真正頻繁使用的只有一個功能：上傳並分享照片。團隊做出的決定是把其他所有功能砍光，只留下拍照、濾鏡、分享，兩週內重新推出後衝上 2.5 萬名使用者，第一天下載量就超過每天一萬次。

**面試連結**：這個案例可以用在「說一個你砍掉自己投入很多心力的東西」或是「說一個你根據數據推翻自己原本判斷」的行為題。關鍵是強調「承認失敗」跟「行動」之間的落差要短——Burbn 團隊沒有花時間辯解,而是直接用使用行為數據定位問題,然後在兩週內做出決定性的砍功能行動。

## 延伸閱讀

- [40 Behavioral Interview Questions + STAR Answers (2026)](https://owlapply.com/en/blog/behavioral-interview-questions-star-method) — 收錄多個真實 STAR 範例回答，可以對照今天的 SBI 補充練習。
- [Monday.com Interview Process: What to Expect](https://www.finalroundai.com/blog/monday-com-interview-process) — 今天練習題的原始來源，附完整的候選人回報問題清單。
- [Google Product Manager (PM) Interview Guide](https://www.tryexponent.com/guides/google-product-manager-interview) — 說明如何建立橫跨衝突、失敗、影響力、領導力的故事庫。

## 本週回顧

| 日 | 主題 | 練習題 | 自評 |
|----|------|--------|------|
| 一 09-21 | Product Sense | 生鮮外送 App 新使用者持續成長但週活躍停滯，如何定位問題環節 | ☐ 完成 ☐ 需複習 |
| 二 09-22 | Metrics & Analytics | 結帳流程 A/B 測試營收上升但滿意度下降，該不該上線 | ☐ 完成 ☐ 需複習 |
| 三 09-23 | Strategy & Execution | （本輪未產出，補練請見下週三主題） | ☐ 需補練 |
| 四 09-24 | AI Product Design | （本輪未產出，補練請見下週四主題） | ☐ 需補練 |
| 五 09-25 | Growth & Experimentation | B2B SaaS 成長趨緩，如何設計並驗證病毒成長迴圈 | ☐ 完成 ☐ 需複習 |
| 六 09-26 | Technical PM | API 核心欄位要做 breaking change，如何決定推出方式 | ☐ 完成 ☐ 需複習 |
| 日 09-27 | Behavioral & Weekly Review | 專案失敗後你怎麼做（SBI + STAR） | ☐ 完成 ☐ 需複習 |

### 下週預告

下週一從 Product Sense 重新輪替。本週三（Strategy & Execution）與週四（AI Product Design）的兩篇因故未產出，若下週三、四的加練名額有餘裕，可以優先補回這兩個維度，避免七個維度的練習出現長期空缺。

## 參考資料

- [Monday.com Interview Process: What to Expect](https://www.finalroundai.com/blog/monday-com-interview-process) — 今日練習題與範例回答的原始素材。
- [Google Product Manager (PM) Interview Guide | tryexponent](https://www.tryexponent.com/guides/google-product-manager-interview) — 故事庫建立方法與行為信號分類。
- [40 Behavioral Interview Questions + STAR Answers (2026) | owlapply](https://owlapply.com/en/blog/behavioral-interview-questions-star-method) — STAR 範例回答對照。
- [11 Reasons Products Fail and How to Avoid Them | UserVoice](https://uservoice.com/blog/why-products-fail) — Instagram/Burbn 案例背景來源。
