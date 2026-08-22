---
title: "Product Builder 面試日練 — 2026-08-21：Growth & Experimentation"
date: 2026-08-21
category: daily
tags: [product-builder-interview, daily, growth]
lang: zh-TW
description: "今日練成長與實驗設計面試：growth loop 與漏斗的差別、實驗診斷六步法、以及怎麼把實驗結果講成商業故事。"
tldr: "Growth 面試的分水嶺在於你講的是「線性改善」還是「複利迴圈」——加一個獲客管道是行銷，讓一個用戶帶來兩個用戶才是 growth。今天練 Goal → Metric → Bottleneck → Hypothesis → Experiment → Measurement 六步診斷法，題目取自 OpenAI Growth PM 的 take-home 真題。"
series:
  name: "Product Builder 面試日練"
  order: 2
---

## 今日主題

Growth & Experimentation 是最容易「講得很忙但沒說到重點」的面試環節。候選人常花十分鐘描述 A/B test 怎麼跑——隨機分流、跑兩週、看 p-value——但這些是入場券，不是加分項。

面試官真正在聽的是兩件事。第一，你談的是線性改善還是複利迴圈：多開一個獲客管道是行銷的事，設計出「一個使用者帶進兩個使用者」的機制才是 Growth PM。第二，你的故事有沒有終點：如果你的實驗成果沒有收在一個百分比或一個金額上，在 growth 面試官眼裡那個故事還沒講完。

## 核心框架速記

### 實驗診斷六步法（適用「這個指標掉了怎麼辦」「怎麼提升 X」類題目）

跳過任何一步，面試官都會判定你在猜。特別是第三步——多數人從目標直接跳到「我會做一個 onboarding 改版」，這正是被刷掉的地方。

1. **定目標**：「六個月內 activated user 成長 15%」——要有數字和時限。
2. **選指標**：明確定義。不是「留存」，而是「七天內完成兩次核心動作」，並說明為什麼這個定義比別的更能預測付費。
3. **找瓶頸**：「72% 的使用者沒完成初始設定，其中 89% 再也沒回來」——用漏斗數據指出洩漏點在哪一段。
4. **量化代價**：把瓶頸換算成損失，「以現有流量算，每月流失約 2.2 萬次啟用」。
5. **提假設並實驗**：假設要寫成經濟語言，「降低這段摩擦可提升完成率，年化價值約 X」。同時說出你打算怎麼隔離變因。
6. **收在成果與下一步**：「進度條單獨帶來 +27% 完成率，整組方案 +58%」，然後接下一個實驗是什麼。

### Growth Loop 檢查表（適用「怎麼做病毒成長」「設計一個推薦機制」類題目）

| 問題 | 檢查什麼 | 反例 |
|------|---------|------|
| 使用者已經重複在做什麼？ | 迴圈要長在既有行為上，不是新增行為 | 為了推薦而硬加一個分享按鈕 |
| 這個動作有沒有外部接觸點？ | 寄信、排會議、送確認——誰會看到？ | 純單人使用的功能沒有天然接觸點 |
| 接觸點對收件方是加分還是負擔？ | 這是最常被忽略的一格 | 為了曝光多寄一封信，違背產品承諾 |
| 迴圈的產出能不能回頭當輸入？ | K-factor > 1 才叫迴圈，否則只是管道 | 一次性的邀請獎勵 |

補一個面試常見的追問陷阱：K-factor 是平均值，會掩蓋分群差異。有候選人在 Slack 面試時開場就講「我們 K-factor 是 1.03，但 cohort 拆開看，企業客戶帶進來的人轉換率 11%，中型客戶是 38%——漏斗沒壞，是結構歪了」，這句話直接通過了「so what」測試。

## 今日練習題

### 題目

「為 ChatGPT Business 的使用者設計一套免費試用（free trial）體驗。說明你會怎麼設計、用什麼指標判斷成功，以及你會先跑哪一個實驗。」

**來源**：Exponent 整理的 OpenAI Growth PM take-home 真題（候選人回報）　**難度**：中高　**環節**：take-home / data and experimentation round

### 拆解思路

1. **釐清問題**：問面試官——目標是提升自助註冊的付費轉換，還是製造 PQL 給 sales 跟進？Business 版的購買決策是個人刷卡還是團隊採購？現在有沒有試用機制、轉換率基準是多少？
2. **定義 activation，不要用登入次數**：對 ChatGPT Business 來說，真正的價值時刻不是「開通帳號」，而是「團隊裡有第二個人開始用」或「連上了公司自己的資料」。先把這個事件定義清楚，後面所有指標才有意義。
3. **選試用模式並說出取捨**：純 freemium（無限期但功能受限）、限時 trial（14 天全功能）、還是 reverse trial（先給全功能，到期降級為免費版）。Reverse trial 的好處是讓使用者先體驗到價值再失去，但代價是可能養出一批永不付費的使用者。要能講出你選哪個、為什麼。
4. **設計第一個實驗**：不要一次改整套流程。挑一個假設、一個變因。例如：「假設 trial 期間先讓使用者邀請一位同事，會顯著提高到期轉換率」——因為 B2B 的購買決策本來就不是一個人做的。
5. **定義成功與護欄指標**：主指標是 trial → paid 轉換率；護欄指標要包含 30 天留存和平均席次數，避免用折扣或催促把短期轉換衝上去卻犧牲 LTV。

### 範例回答（面試時可以這樣講）

> **先把 activation 定義對，其他才有意義。** ChatGPT Business 賣的是 seat-based 訂閱，所以決策單位不是個人而是團隊。我會把 activation 定義成「試用期內至少兩位同一網域的成員，各自完成三次以上對話，且其中一次用到共享的 workspace 資源」。理由是：單人重度使用預測不了團隊採購，但第二個人開始用，代表產品已經跨過了組織內的第一道推廣門檻。用這個定義去拉 cohort，我預期會看到一個很陡的斷崖——多數試用帳號停在「只有申請人在用」。
>
> **模式我會選 reverse trial，第一個實驗測邀請時機。** 開通後 14 天全功能，到期自動降為受限版，而不是硬性斷開。這樣用戶是「失去已經擁有的東西」，而不是「錯過沒體驗過的東西」，後者的說服力弱得多。第一個實驗只動一個變因：把「邀請同事」的提示從第 7 天挪到用戶完成第一次成功對話的當下。假設是——在價值剛被感知到的那一刻邀請，接受率會顯著高於冷啟動時的空白邀請頁。我會跑 50/50，主指標是 14 天內達到雙人 activation 的比例，樣本量按 20% 以上的效應量估，因為這是流程層級的改動，不是文案微調。
>
> **成功標準和我會盯的風險。** 主指標是 trial → paid 轉換率，但我不會只看它。我要同時盯 30 天留存和平均席次數兩個護欄——如果轉換率上升但席次數沒動、30 天留存下滑，那代表我只是把猶豫的人推去刷卡，換來的是三個月後的退訂。這個取捨我在 Stripe 的一個案例上看過教訓：某個定價實驗帶來 +18% 轉換，但沒人量長期留存，結果可能是拿 LTV 換了短期數字。所以實驗結束我會回答兩件事：這個改動值多少年化金額，以及下一個該測什麼。

### 自我核對清單

| 核對項目 | 有提到？ |
|---------|---------|
| 先釐清目標是自助轉換還是 PQL → sales | |
| activation 有明確、可測量的定義（不是登入次數） | |
| 說明為什麼這個定義能預測付費 | |
| 試用模式的選擇有講出取捨（freemium / trial / reverse trial） | |
| 第一個實驗只動一個變因，且假設寫得可證偽 | |
| 有提到樣本量或可偵測效應量的判斷 | |
| 護欄指標（長期留存、席次數）而不只有主指標 | |
| 加分：把成果換算成商業金額，並說出下一個實驗 | |

## 今日案例

**Fyxer：四個人、一年 541 次實驗、ARR 從 100 萬做到 3500 萬美元**

AI 郵件助理 Fyxer 在 2026 年 4 月被 GrowthBook 寫成案例。過去十二個月他們跑了 541 次實驗，平均每個工作日超過兩次，其中 360 次來自一個四人的 growth engineering 團隊。ARR 從 100 萬美元成長到 3500 萬美元。

有意思的是勝率：25%。四次實驗有三次是失敗的。負責人 Kameron Tanseli 的說法是，A/B test 對他而言不是最佳化工具而是學習工具——他每換一個產業，前幾個月的直覺都是錯的，實驗是唯一能快速校正的方式。他也直接反駁「我們還太小不適合做 A/B test」：小公司偵測不到 5% 的提升，但偵測得到 20-30% 的效應，而定價模式、用量上限、核心流程這些正是應該測的東西。

更值得講的是那個失敗的迴圈。Fyxer 有類似 Calendly 的排程功能，Kameron 假設「寄出訂位確認信」能把收件人帶回來註冊——白板上看起來是乾淨的成長迴圈。實際上線後使用者立刻反彈：Fyxer 的價值主張是減少信箱噪音，而這個迴圈是在 Google Calendar 和 Outlook 已經寄出的邀請之上再多寄一封。他們砍掉了實驗。

**面試連結**：這是回答「講一個失敗的成長實驗」的極佳素材結構——不是「數據沒起來」，而是「迴圈的設計本身違背了產品承諾」。當面試官問你 growth loop 的時候，用這個案例反向論證你會檢查「接觸點對收件方是加分還是負擔」，比背 K-factor 公式有說服力得多。另外 25% 勝率這個數字也很好用：當面試官追問「你的實驗多常失敗」，你可以用產業基準來框自己的答案，而不是尷尬地美化。

## 延伸閱讀

- [Exponent — OpenAI Growth Product Manager Interview Guide](https://www.tryexponent.com/guides/openai-growth-product-manager-interview) — OpenAI Growth PM 四階段流程拆解，含 take-home 真題與 data/experimentation round 的追問模式
- [Johnny Mai — Growth PM Interview Guide: Experimentation, Funnels, and KPI Stories](https://sirjohnnymai.com/blog/growth-pm/) — 六步診斷法的原始出處，附 Slack、Dropbox、Stripe 的真實面試片段
- [GrowthBook — How an AI startup ran 541 A/B tests in 1 year](https://www.growthbook.io/blog/how-a-team-of-4-used-a-b-testing-to-help-fyxer-grow-from-1m-to-35m-arr-in-1-year) — Fyxer 案例全文，含他們怎麼用 AI 工具把實驗週期從週壓縮到小時

## 參考資料

- [Exponent — OpenAI Growth Product Manager Interview Guide (2026)](https://www.tryexponent.com/guides/openai-growth-product-manager-interview) — 今日練習題來源（ChatGPT Business free trial take-home 真題），以及「面試官對含糊答案容忍度極低」的觀察
- [Johnny Mai — Growth Product Manager Interview Guide](https://sirjohnnymai.com/blog/growth-pm/) — 「實驗診斷六步法」與「線性改善 vs. 複利迴圈」的框架來源；Slack K-factor cohort 案例與 Stripe 定價實驗的 LTV 教訓
- [GrowthBook — How Fyxer used AI coding and GrowthBook to run 541 experiments in 1 year](https://www.growthbook.io/blog/how-a-team-of-4-used-a-b-testing-to-help-fyxer-grow-from-1m-to-35m-arr-in-1-year) — 今日案例來源：541 次實驗、25% 勝率、被砍掉的排程確認信迴圈
