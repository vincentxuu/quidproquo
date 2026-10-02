---
title: "Product Builder 面試日練 — 2026-10-02：Growth & Experimentation"
date: 2026-10-02
category: daily
type: digest
tags: [product-builder-interview, daily, growth]
lang: zh-TW
description: "用 Duolingo 的使用者狀態轉移模型練一道 OpenAI Growth PM 真題「如何設計實驗幫新使用者完成 ChatGPT onboarding」，案例是 Duolingo 把連勝規則從「達標才延續」改成「完成一堂課即延續」後，retention 與 DAU 同時上升的真實 A/B test。"
tldr: "Growth & Experimentation 面試考的不是你會不會跑 A/B test，而是你會不會先找出對北極星指標影響最大的槓桿，再把資源集中在那裡做實驗，而不是同時改十個地方碰運氣。今天練一道 OpenAI Growth PM 面試真題：『如果要設計一個實驗或功能來幫助新使用者完成 ChatGPT 的 onboarding，你會怎麼做？』答案框架是把使用者拆成 new／current／reactivated／resurrected／inactive 五種狀態，估算每條轉移路徑對日活躍使用者數（DAU）的影響，再把實驗火力集中在影響最大的那條路徑上。案例是 Duolingo 2018 年用同一個模型找出 Current User Retention Rate 是次佳槓桿的五倍大之後，把連勝規則從「達到每日目標才能延續」改成「完成一堂課即可延續」，A/B test 結果是 Day 14 retention 相對提升 3.3%，整體 DAU 提升 1%，20 天後仍有連勝的使用者比例提升 10.5%——四年內把這個指標拉高 21%，DAU 成長了 4.5 倍。"
series:
  name: "Product Builder 面試日練"
  order: 44
---

> 🌏 [English version](/en/posts/daily/2026-10-02-product-builder-interview-daily-en)

## 今日主題

Growth & Experimentation 面試最容易讓候選人掉分的地方，不是說不出「我會跑 A/B test」，而是被追問「你怎麼知道該測哪個地方」的時候，答案變成「我們列了一堆假設，然後都測了一輪」。面試官真正想看的是：在資源有限、流量有限的情況下，你有沒有一套邏輯先把槓桿排序，再把實驗集中在影響最大的轉移路徑上——這正是 OpenAI、Meta 等公司 Growth PM 面試裡「數據與實驗」這一輪的核心考點。

## 核心框架速記

**Hook Model（習慣養成迴圈）**把一個會讓使用者回訪的產品拆成四個環節：

| 環節 | 問題 | 設計重點 |
|------|------|---------|
| Trigger（觸發） | 什麼把使用者帶回產品？ | 外部觸發（通知）要能逐漸轉為內部觸發（習慣、情緒） |
| Action（行動） | 使用者要做的最小動作是什麼？ | 動作要比觸發前的期待更簡單 |
| Variable Reward（變動獎勵） | 使用者做完動作後得到什麼？ | 獎勵要有不確定性，才能持續吸引注意力 |
| Investment（投入） | 使用者在這個迴圈裡留下了什麼？ | 投入（資料、連勝、人脈）讓下一次觸發更有效 |

**Growth Lever Model（成長槓桿模型）**則是從另一個角度回答「該把實驗資源放在哪裡」：把使用者分成 new（新使用者）、current（活躍使用者）、reactivated（近期流失後回歸）、resurrected（長期流失後回歸）、inactive（流失）五種狀態，對每一條狀態間的轉移路徑估算「如果這條路徑提升 1%，DAU 會變動多少」。Duolingo 的成長團隊用這個模型發現，提升「current 使用者繼續留在 current」這條轉移路徑（他們稱為 Current User Retention Rate，CURR）對 DAU 的影響，是排名第二槓桿的五倍大——這個排序結果決定了接下來四年的實驗資源幾乎都往這一條路徑集中（來源：Jorge Mazal《How Duolingo reignited user growth》，Lenny's Newsletter）。

## 今日練習題

### 題目

「如果要設計一個實驗或功能來幫助新使用者完成 ChatGPT 的 onboarding，你會怎麼做？」

（來源：OpenAI Growth Product Manager 面試 Hiring Manager Screen 真題，候選人回報，收錄於 Aced／tryexponent.com《OpenAI Growth Product Manager Interview Guide》）

### 拆解思路

1. **釐清問題**：先問面試官「完成 onboarding」怎麼定義——是完成第一次有意義的對話、設定好個人化偏好，還是達到某個使用頻率？目標是消費者自助註冊，還是企業導入後的員工上手？這兩種情境的流失點完全不同。
2. **定義使用者**：拆成兩種角色——第一次接觸 LLM 產品的新手（不知道該問什麼），和從其他工具轉換過來的老手（帶著既有期待，容易因為介面不同而卡住）。兩種人需要的 onboarding 引導完全不一樣。
3. **結構化分析**：用 Growth Lever Model 把 onboarding 拆成幾段轉移：安裝／註冊 → 完成第一次對話 → 第二次回訪 → 形成固定使用習慣。對每一段估算「如果提升這一段 1%，整體啟用率會變動多少」，找出流失最大、槓桿也最大的那一段，而不是每段都同時改。
4. **提出方案**：針對流失最大的那一段設計一個具體、可逆的小實驗——例如在新使用者第一次打開對話框時主動建議三個情境化的 prompt 範例，而不是重寫整個 onboarding 流程。改動要小到能快速看出因果，不要一次改十個變數。
5. **定義成功**：用北極星指標（例如 Day 1／Day 7 回訪率）加上先決條件（樣本量是否夠、要測多久才能偵測到你預期的效果量），避免拿一個流量不夠、根本測不出顯著差異的功能去做結論。

### 範例回答（面試時可以這樣講）

> **先框定範圍**：我會先確認「完成 onboarding」對這個團隊來說指的是什麼——如果是消費者自助註冊的 ChatGPT，我會假設目標是「新使用者在第一次 session 裡完成一次讓他們覺得有用的對話」，因為這通常是後續回訪率最強的預測指標。我也會先區分第一次用 LLM 的新手和從其他工具轉過來的老手，這兩群人卡住的地方不一樣，合在一起測容易把訊號稀釋掉。
>
> **接著談怎麼找槓桿**：我會把 onboarding 拆成「註冊 → 第一次對話 → 第二次回訪 → 固定使用」幾段轉移，看現有數據裡哪一段流失最大。如果多數使用者第一次對話後就沒再回來，代表問題不在「怎麼吸引使用者進來」，而在「使用者不知道產品能幫他做什麼」。我會把實驗資源集中在這一段，而不是同時改註冊流程、介面設計、通知文案——資源有限的時候，分散測試只會讓每一個實驗都測不出顯著結果。
>
> **最後談實驗設計**：針對第一次對話這一段，我會設計一個小而具體的實驗，例如在空白輸入框上方放三個依使用者來源（搜尋、朋友推薦、企業導入）客製化的情境 prompt 建議，對照組維持空白輸入框。成功指標是 Day 7 回訪率與「第一次對話後是否有追問」這兩個，並在實驗前用現有流量與預期效果量先算出需要的樣本大小，確保測完後結果站得住，而不是看一兩天的早期訊號就下結論。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有先釐清「完成 onboarding」的具體定義與受眾（消費者／企業） | |
| 有區分新手與老手兩種使用者的不同卡點 | |
| 有用轉移路徑／漏斗找出流失最大也槓桿最大的那一段 | |
| 有提出小而可逆、可以快速看出因果的具體實驗，而非一次改全流程 | |
| 有定義成功指標並考慮樣本量／統計顯著性 | |
| 加分項：有提到「資源有限時集中火力勝過同時測十個假設」的取捨邏輯 | |

## 今日案例

**Duolingo：把連勝規則從「達標才延續」改成「完成一堂課即延續」**

2018 年中，Duolingo 的 DAU 年成長率跌到個位數，團隊先用 Growth Lever Model 把使用者分成五種狀態，發現提升 Current User Retention Rate（CURR，使用者維持活躍的機率）對 DAU 的影響是次佳槓桿的五倍大，於是成立專責團隊圍繞這個指標做實驗。其中一個實驗來自一個反直覺的發現：達到每日目標才能延續連勝的規則下，設定「高強度」每日目標的使用者反而最不容易維持連勝——目標本身變成了形成習慣的阻礙。團隊把連勝和每日目標拆開，改成「完成一堂課即可延續連勝」，A/B test 結果是 Day 14 retention 相對提升 3.3%，整體 DAU 提升 1%，20 天後仍有連勝的使用者比例提升 10.5%，新使用者的連勝比例更提升 19%（來源：Duolingo 官方部落格《Improving the streak: Forming habits one lesson at a time》）。四年下來，CURR 相對提升 21%，DAU 成長 4.5 倍（來源：Jorge Mazal，Lenny's Newsletter）。

**面試連結**：這個案例可以直接拿來回答「你怎麼決定該測哪裡」類型的問題——用它證明「先用模型找出影響最大的槓桿，再把實驗集中在那裡」比「把能想到的改動都測一輪」更有效率；也可以用在「一個讓你意外的實驗結果」類問題，因為反直覺的發現（目標越高反而越難維持連勝）正是促成這個實驗的起點。

## 延伸閱讀

- [How Duolingo reignited user growth](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth) — 前 Duolingo CPO Jorge Mazal 完整拆解 Growth Lever Model 如何找出 CURR 這個槓桿，以及四年內 DAU 成長 4.5 倍的完整脈絡。
- [Improving the streak: Forming habits one lesson at a time](https://blog.duolingo.com/improving-the-streak/) — Duolingo 官方部落格對連勝實驗的第一手數據與設計過程說明。
- [OpenAI Growth Product Manager (PM) Interview Guide](https://www.aced.io/guides/openai-growth-product-manager-interview) — 今日練習題出處，完整收錄 OpenAI Growth PM 面試流程與各輪真題。

## 參考資料

- [How Duolingo reignited user growth — Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth) — 核心框架速記「Growth Lever Model」與今日案例「CURR 槓桿排序」出處。
- [Improving the streak: Forming habits one lesson at a time — Duolingo Blog](https://blog.duolingo.com/improving-the-streak/) — 今日案例連勝實驗的 Day 14 retention（3.3%）、DAU（1%）、連勝比例（10.5%）等數據出處。
- [OpenAI Growth Product Manager (PM) Interview Guide — Aced](https://www.aced.io/guides/openai-growth-product-manager-interview) — 今日練習題「如何設計實驗幫新使用者完成 ChatGPT onboarding」出處，收錄於 Hiring Manager Screen 章節。
- [Duolingo Users (2026): How It Grew to 58.7M Daily Learners — okara.ai](https://okara.ai/blog/how-duolingo-grew) — 核對連勝實驗數據與 Growth Lever Model 時序脈絡的交叉來源。
