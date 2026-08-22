---
title: "Growth & Experimentation 面試攻略：從 Growth Loop 到實驗設計"
date: 2026-08-20
category: product
tags: [interview, product-builder, growth, experimentation, retention]
lang: zh-TW
type: deep-dive
description: "拆解 Product Builder 面試中 Growth 環節——growth loop 設計、A/B testing 實驗設計、retention 策略、viral coefficient，以及數據驅動成長的思維。"
tldr: "Growth 面試考的不是你會不會做 growth hack，而是你有沒有系統性的成長思維。核心能力：growth loop 設計（acquisition → activation → retention → referral 的飛輪）、實驗設計（假設 → 指標 → 實驗 → 分析的完整流程）、retention 策略（找到 aha moment、設計 habit loop）、以及用數據判斷什麼值得繼續投資。"
series:
  name: "Product Builder 面試準備"
  order: 8
---

## Growth 面試怎麼考

Growth 面試在不同公司差異很大。大廠（Meta、Uber、Airbnb）通常有專門的 Growth PM 職缺，面試會出「某個指標下降了 10%，你怎麼診斷？」或「設計一個實驗來提升新使用者的 7 日留存」。新創則更常把 growth 能力包在一般 PM 面試裡——你不會聽到「這是 growth round」，但面試官會在 product design 的追問中考你怎麼衡量成功、怎麼迭代。

不管哪種形式，Growth 面試考的核心是三件事：你有沒有系統性的成長模型（不是一堆散彈槍的 tactics）、你能不能設計嚴謹的實驗來驗證假設、你會不會用數據做決策而不是憑感覺。

## Growth Loop：比 AARRR 更實用的成長模型

AARRR（Acquisition → Activation → Retention → Referral → Revenue）是經典框架，面試時提到不會扣分，但它有一個根本問題：它是漏斗，不是飛輪。漏斗暗示使用者從上往下掉，每一層都在流失。現實中，好的成長模型是自我強化的迴圈。

Growth Loop 的核心思維是：使用者的某個行為會產生一個副產品，這個副產品能吸引新使用者或強化既有使用者的行為，形成正向迴圈。

三種常見的 loop：

**Content Loop**：使用者創造內容 → 內容被搜尋引擎索引 → 新使用者透過搜尋進入 → 新使用者也開始創造內容。Pinterest、Quora、Stack Overflow 都是這個模式。面試時關鍵是說清楚：迴圈的驅動力是什麼？瓶頸在哪一段？你會怎麼加速瓶頸段？

**Viral Loop**：使用者使用產品 → 使用過程自然產生分享行為 → 被分享的人成為新使用者。Dropbox 的「邀請朋友得空間」、Slack 的「你需要加入這個 workspace」都是。viral coefficient（每個使用者帶來幾個新使用者）大於 1 才算真正的 viral growth，但面試時不要執著於數字——大部分產品的 K 值都小於 1，重點是這個 loop 能不能和其他 acquisition channel 互相放大。

**Paid Loop**：使用者付費 → 收入投入廣告 → 廣告帶來新使用者 → 新使用者付費。這個 loop 的健康度取決於 LTV/CAC 比值。面試時要能解釋：LTV/CAC > 3 是常見的健康標準，但回收期（payback period）也很重要——LTV/CAC 很高但要 18 個月才回本，現金流可能撐不住。

面試技巧：先辨識產品目前最強的 loop 是哪一個，然後分析瓶頸在哪，再提出加速方案。不要一上來就列十個 growth tactic——面試官想看系統思維。

## 實驗設計：假設到分析的完整流程

Growth 面試最常考的技能就是實驗設計。一個完整的實驗有四個階段：

**第一步：建立假設。** 好的假設是具體且可否證的。「改善 onboarding 可以提升留存」不是好假設。「在 onboarding 第三步加入個人化推薦，可以讓 7 日留存從 35% 提升到 40%」才是。面試時先花 30 秒把假設寫清楚，面試官會因此對你刮目相看。

**第二步：定義指標。** 每個實驗需要一個主要指標（primary metric）和幾個護欄指標（guardrail metrics）。主要指標是你想改善的東西（7 日留存率）；護欄指標是你不想惡化的東西（頁面載入時間、customer support ticket 量）。面試時提到護欄指標是加分項——它說明你考慮到了副作用。

**第三步：設計實驗。** 需要回答的問題包括：隨機分組的單位是什麼（使用者？session？裝置？）、實驗組和對照組的比例（通常 50/50，但高風險的實驗可以先 5/95）、需要跑多久（取決於 sample size 計算和業務週期）、有沒有 network effect 會污染結果（社交產品的實驗特別容易遇到這個問題）。

**第四步：分析結果。** 統計顯著不等於有業務意義。p < 0.05 但效果量只有 0.1% 的改善，值不值得為此增加產品複雜度？面試時要能區分 statistical significance 和 practical significance。另外要注意 novelty effect——新功能剛上線時數據通常偏好，跑兩週後回歸正常。

## Retention：找到 Aha Moment

Retention 是 growth 的根基。acquisition 再強，留不住使用者就是漏水的桶。面試中 retention 相關的問題通常有兩類：「怎麼找到影響留存的關鍵因素」和「怎麼設計提升留存的方案」。

**Aha Moment** 是使用者第一次體驗到產品核心價值的時刻。Facebook 早期發現「7 天內加 10 個好友」的使用者留存率顯著高於沒達標的使用者。找 aha moment 的方法：把使用者按留存率分成高留存和低留存兩群，比較他們在前 N 天的行為差異，找出相關性最強的行為。面試時要強調：相關不等於因果——加好友可能是高留存的原因，也可能只是活躍使用者的自然行為。需要用實驗驗證。

**Habit Loop** 是讓使用者持續回來的機制。Nir Eyal 的 Hook Model（Trigger → Action → Variable Reward → Investment）是面試常用框架。面試時不要背模型，而是用具體產品說明：Duolingo 的 streak 機制是怎麼把 trigger（推播通知）、action（做一課）、variable reward（經驗值和排名變化）、investment（streak 天數越長越捨不得斷）串起來的。

**Churn 分析** 是 retention 的另一面。面試常見問題是「某個 cohort 的留存率突然下降，你怎麼診斷？」。結構化的拆解方式：先看是所有使用者都下降還是特定使用者群（新使用者？某個平台？某個地區？）；再看是漸進式下降還是斷崖式下降（前者通常是產品老化，後者通常是技術問題或市場變化）；最後對照時間線上的事件（新版本發布？競品上線？季節因素？）。

## Viral & Referral

Viral growth 和 referral program 是兩件不同的事。Viral 是產品使用過程中自然產生的傳播（Slack 的「你需要加入這個 workspace」）；referral 是刻意設計的推薦獎勵機制（Uber 的「推薦朋友各得 $10」）。

面試時需要掌握的概念：

**Viral Coefficient（K）**= 每個使用者發出的邀請數 × 邀請轉化率。K > 1 表示指數級成長，但大部分產品的 K 在 0.1-0.5 之間——不夠獨立驅動成長，但能放大其他 channel 的效果。

**Referral 機制設計**的核心問題是雙邊激勵（推薦人和被推薦人各得到什麼）和時機（什麼時候 prompt 使用者推薦——太早使用者還沒體驗到價值，太晚使用者已經過了最興奮的階段）。面試時不要只說「給折扣」，要說清楚：為什麼是這個時機、為什麼是這個獎勵形式、怎麼防止 abuse。

## 數據驅動決策：繼續還是止損

Growth 面試最高階的考點是：你怎麼判斷一個成長方案值不值得繼續投資？

結構化的判斷框架：

1. **看趨勢，不看快照。** 一個實驗第一週效果很好但第二週衰退，可能是 novelty effect。看至少兩個完整週期的數據再做決策。
2. **看邊際效益。** 第一版改善帶來 20% 提升，第二版帶來 5%，第三版帶來 1%——邊際效益遞減時就該換一個方向，把資源投到 ROI 更高的地方。
3. **看機會成本。** 繼續優化 onboarding 可以帶來 3% 留存提升，但把同樣的工程資源拿去做 referral 機制可能帶來 15% 的新使用者成長。面試時能提到機會成本的概念會加分。

## 面試技巧

- 面試官問「怎麼提升某個指標」時，不要直接跳到方案。先問清楚：目前的數字是多少？benchmark 是什麼？之前試過什麼？
- 用 growth loop 思維回答，不要列散彈槍式的 tactic list。面試官想看的是你有一個成長模型，不是你讀了很多 growth hacking 文章。
- 實驗設計要提到 sample size 和跑多久的問題——這是區分「讀過 A/B testing 入門文章」和「實際跑過實驗」的分水嶺。
- Retention 問題永遠先問「是所有使用者都掉還是特定 segment」——這一句話就能展現你的分析直覺。

## 面試模擬題

### 題目

「你負責一個線上學習平台，DAU 50 萬，但 30 日留存率只有 12%。你會怎麼診斷問題並設計改善方案？」

**來源**：自擬（based on Coursera/Duolingo PM 面試）　**難度**：進階　**環節**：growth / execution round

### 拆解思路

1. **先釐清問題**：12% 的 30 日留存是所有使用者的平均？還是區分了付費 vs 免費？目前的 aha moment 是什麼？有沒有做過 retention cohort 分析？使用者來源管道的分佈？
2. **建立框架**：用留存曲線拆解——第 1 天掉多少（activation 問題）、第 7 天掉多少（habit 問題）、第 30 天掉多少（value 問題）。找最大的 drop-off 點。
3. **深入核心**：核心判斷是「12% 到底低不低」——線上學習的 benchmark 大約 15-20%，所以確實偏低但不是離譜。問題更可能是 activation 到 habit 的轉換，而不是產品本身沒價值。
4. **收尾**：提出假設 → 實驗 → 指標的完整流程，不是直接給方案。

### 範例回答（面試時可以這樣講）

> **先做診斷，不急著開藥方。** 我會先拉三個數據：按來源管道分的留存率（paid vs organic 差多少）、按用戶行為分的留存率（完成第一堂課 vs 沒完成）、以及留存曲線的形狀（是第 1 天就大幅掉還是緩慢流失）。我的假設是：如果 paid 用戶的留存明顯低於 organic，問題在 acquisition 端吸引了錯誤的人；如果完成第一堂課的用戶留存顯著高於沒完成的，問題在 activation。
>
> **假設 activation 是主要問題。** 如果數據支持，我會聚焦在「讓更多用戶完成第一堂課」。具體方案：縮短第一堂課的長度（從 30 分鐘改成 10 分鐘）、在註冊後 24 小時內發推播提醒、在 onboarding 加入興趣選擇讓推薦更精準。我不會三個都做——先跑最小的實驗（推播提醒），因為開發成本最低，2 週就能看到結果。
>
> **實驗設計。** A/B test 分 50/50，primary metric 是 7 日留存率，guardrail metric 是推播 opt-out 率（確保不會因為太煩而掉用戶）。sample size 按 7 日留存率目前 20% 基線、想偵測 2 個百分點的提升，需要每組約 1 萬人，以 DAU 50 萬來說 2-3 天就能收滿。跑 2 週看結果穩定，如果 7 日留存率提升 > 1.5 個百分點就全量上線。

### 自我核對清單

| 核對項目 | 有提到？ |
|---------|---------|
| 先診斷再開方（拉了哪些數據、為什麼） | |
| 用留存曲線找到最大 drop-off 點 | |
| 提出的假設可被數據驗證或推翻 | |
| 實驗設計有 primary metric 和 guardrail metric | |
| 提到 sample size 和實驗時長 | |
| 加分：用 benchmark 校準 12% 到底低不低 | |

## 參考資料

- [Reforge — Growth Loops](https://www.reforge.com/blog/growth-loops) — Growth loop 概念的原始出處，解釋為什麼飛輪比漏斗更適合描述成長
- [Lenny's Newsletter — What is good retention?](https://www.lennysnewsletter.com/p/what-is-good-retention-issue-29) — 不同產類別型的 retention benchmark，面試時可以用來校準你的數字感
- [Nir Eyal — Hooked](https://www.nirandfar.com/hooked/) — Hook Model 的原始框架，面試中 retention 和 habit 設計的經典參考
- [Andrew Chen — The Cold Start Problem](https://andrewchen.com/the-cold-start-problem/) — 網路效應驅動的 Growth & Experimentation 策略，涵蓋 viral coefficient 與 referral 機制在面試中的應用
- [Exponent — Growth PM Interview Guide](https://www.tryexponent.com/blog/growth-pm-interview) — Growth 面試的結構化準備指南，涵蓋 A/B testing 實驗設計與 retention 分析的常見題型
