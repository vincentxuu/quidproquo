---
title: "Product Builder 面試日練 — 2026-08-25：Metrics & Analytics"
date: 2026-08-25
category: daily
tags: [product-builder-interview, daily, metrics]
lang: zh-TW
description: "今日練 Metrics & Analytics 面試：指標樹與 AARRR 框架，以及一道改編自 Google PM analytics round 真實案例的「DAU 上升但廣告主流失」拆解題。"
tldr: "分析型面試考的不是你會不會寫 SQL，是你能不能在『DAU 漲、廣告主卻在跑』這種矛盾訊號裡，分清楚哪個指標在說謊。Google 一場真實 debrief 裡，候選人因為把『DAU』當成 News 的北極星指標而被刷掉——committee 要的是能連到商業風險的指標，不是儀表板上最好看的那個數字。今天用指標樹拆一道這樣的題目，案例是 Google Search 那則『改個字體顏色多賺十億美金』的傳說。"
series:
  name: "Product Builder 面試日練"
  order: 6
---

## 今日主題

Metrics & Analytics 是分析型 PM 面試的核心考點，尤其在 Google、Meta、Amazon 這類數據驅動的公司，會有一整輪 30-45 分鐘專門考「指標設計＋SQL＋case」。面試官真正要看的不是你背不背得出 AARRR 或知不知道 `COUNT(DISTINCT session_id)` 跟 `COUNT()` 差在哪，而是你能不能在一堆看起來互相矛盾的數字裡，找出哪個指標其實在講一個錯誤的故事。

這個主題重要的原因，是因為多數候選人卡在同一個地方：他們會選一個「看起來很專業」的單一指標（DAU、CTR、留存率），卻沒辦法回答「這個指標會不會被打遊戲」「它跟公司真正在意的商業結果對不對得起來」。今天要練的就是這個轉換——從「選一個指標」到「建一棵指標樹，並且知道哪一層在說謊」。

## 核心框架速記

### 指標樹（Metric Tree / North Star Hierarchy）

分析型面試最常見的失敗模式，是提出一個指標就停了。強答案要有三層：

| 層級 | 作用 | 範例（以 News app 為例） |
|------|------|--------------------------|
| **北極星指標（North Star）** | 代表公司長期價值主張 | 「經過事實查核的內容回訪率」而非單純 DAU |
| **護欄指標（Guardrail）** | 防止北極星指標被短期手段作弊 | 廣告主續約率、內容多樣性分數 |
| **診斷指標（Diagnostic）** | 拆解北極星指標變動的成因 | 依平台、地區、使用者世代切分的留存曲線 |

**用法**：拿到任何「這個指標動了，怎麼辦」的題目，先問「是不是真訊號」（資料管線有沒有壞、有沒有 bot），再往下切成 2-4 個可以互相排除的假設，最後才回到指標樹上定位是哪一層出問題。

### AARRR（海盜指標）

用來快速掃描一個產品在哪個環節漏最多水：

1. **Acquisition** 使用者怎麼找到你
2. **Activation** 第一次體驗有沒有「aha moment」
3. **Retention** 會不會回來
4. **Referral** 會不會帶人來
5. **Revenue** 會不會付錢

面試中常見用法：面試官丟出「這個產品成長停滯了」，你先用 AARRR 定位漏水的環節，再用指標樹深挖那個環節底下的診斷指標。兩個框架是接力棒關係，不是二選一。

## 今日練習題

### 題目

> 「我們的 Google News 日活躍使用者（DAU）連續三週上升了 8%，但上一季廣告主的預算卻縮減了 15%。你會怎麼分析這個矛盾，並且提出下一步行動？」

（改編自 Google PM analytics round 真實 hiring committee debrief：委員會刷掉了一位把「DAU」當作 News 產品北極星指標的候選人，理由是廣告主當時因為內容信任疑慮正在抽廣告預算，DAU 上升掩蓋了真正的商業風險。來源：sirjohnnymai.com Google PM Analytical Interview 案例整理）

### 拆解思路

1. **釐清問題**：先問面試官幾個縮小範圍的問題——DAU 的計算口徑是不是包含機器人流量？廣告主流失是集中在特定產業（例如新聞可信度敏感的金融、政府客戶）還是全面性的？這 8% 成長是不是跟某次演算法改版或熱點新聞事件重疊？
2. **定義使用者**：把使用者分成「一般瀏覽者」（滑久一點但不深讀）和「高信任度讀者」（會回訪同一批已查核來源），廣告主真正在意的其實是後者的比例，不是前者的絕對量。
3. **結構化分析**：套用指標樹——DAU 是北極星指標的代理指標，但如果 DAU 成長來自聳動、未查核內容的短暫瀏覽，那護欄指標（廣告主續約率、內容多樣性分數）就會先出問題，之後 DAU 本身也會反轉下滑。用診斷指標拆解 DAU 成長是「新使用者湧入」還是「舊使用者瀏覽頻率提高」，再交叉比對這批成長使用者的內容來源分布。
4. **提出方案**：如果診斷結果顯示成長來自低信任內容的短期流量，取捨點在於——是要保留看起來好看的 DAU 數字，還是把北極星指標換成「經事實查核內容的回訪率」。建議做法是先建立信任分數作為護欄指標並開始追蹤，同時不動北極星指標的定義，避免短期內大幅改變團隊 KPI 造成組織震盪。
5. **定義成功**：兩個月內，「事實查核內容回訪率」與廣告主續約率不再出現反向背離；DAU 允許短期波動，只要護欄指標同步回升即視為健康。

### 範例回答（面試時可以這樣講）

> **先定位訊號，不急著解讀。**「聽到 DAU 漲但廣告主在跑，我的第一反應不是『這兩個指標矛盾』，而是『DAU 可能在說謊』。我會先確認這 8% 成長的使用者輪廓——是不是集中在某幾篇爭議性強、還沒經過查核的新聞，因為這類內容通常會製造短期流量高峰，但正好也是廣告主抽預算的理由。」
>
> **用指標樹把北極星指標和護欄指標分開看。**「如果我把 DAU 當成北極星指標，我會忽略掉廣告主續約率這個護欄指標已經在惡化的事實——這正是 committee 刷掉那位候選人的原因。我會提議把北極星指標從『日活躍』換成『經查核內容的回訪率』，因為這才是廣告主真正付錢在買的東西：一個他們的品牌可以安心出現的環境。」
>
> **取捨要講清楚代價。**「這個切換的代價是，短期內團隊看到的『成長』數字會變難看，因為聳動內容帶來的 DAU 會被排除在北極星指標之外。但我會保留 DAU 作為次要監控指標，並且用廣告主續約率當驗收標準——兩個月內如果查核內容回訪率和續約率同步回升，就證明這個切換是對的；如果沒有，代表問題不在內容信任，我們需要回頭看是不是廣告產品本身出了問題。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有先驗證訊號是否為真（資料品質、口徑定義）再解讀 | |
| 有區分北極星指標／護欄指標／診斷指標三層 | |
| 有提出至少 2-3 個可互相排除的假設，而非單一結論 | |
| 有具體的方案與明確取捨（換指標的代價是什麼） | |
| 有定義驗收成功的時間窗與衡量方式 | |
| 加分項：意識到單一指標可能被短期手段「作弊」 | |

## 今日案例

**Google Search：那則「改字體顏色多賺十億美金」的傳說**

流傳在矽谷的一則故事（真實性有爭議，但拿來說明指標敏感度很有效）：一位 Google PM 把搜尋結果頁的連結字體顏色做了微調，A/B 測試顯示營收上升了十億美金規模，這位 PM 因此升職；一年後另一位 PM 把顏色改回去，同樣因為營收上升而升職。這聽起來矛盾，但重點不在顏色本身，而在於：在 Google 搜尋這種等級的流量下，連一個像素級的視覺變化都會被 A/B 測試放大成統計上顯著的營收訊號——而這訊號可能是新奇效應（novelty effect）、使用者行為的暫時擾動，而不是真正的長期價值提升。

**面試連結**：這個案例是回答「你怎麼看待一個 A/B 測試結果」這類問題的好素材——強答案不會只說「數字漲了就上線」，而會追問：這個效果會不會隨時間衰減（新奇效應）？樣本是不是不小心偏向了某個使用者區段（Sample Ratio Mismatch）？在超大流量產品上，統計顯著不等於值得長期投入資源維護。這也呼應今天的核心框架——任何單一指標的變動，都要先問「這訊號可信嗎」，再問「這訊號重要嗎」。

## 延伸閱讀

- [Product Analytics for Interviews: Metric Design, Root Cause Analysis, and Scenario Frameworks](https://www.calibreos.com/learn/product-analytics-frameworks) — 完整的指標階層與根因分析五步驟框架，練習題多來自真實面試場景。
- [Experiment Design End-to-End: MDE, Randomization, CUPED, SRM, Switchback, Ramps](https://www.calibreos.com/learn/analytics-experiment-design) — 進階實驗設計，講清楚為什麼「跑個 A/B test」是初階答案，資深 PM 要能講樣本量、隨機化單位、新奇效應偵測。
- [A/B Testing PM Interview Questions - Facebook Ads Revenue Case Study](https://www.toughtongueai.com/blog/ab-testing-pm-interview-facebook-ads-revenue/) — 用 Facebook 廣告營收優化題，示範怎麼在三方市場（使用者／廣告主／平台）之間拆解 A/B 測試的取捨。

## 參考資料

- [Google PM Analytics Round: SQL + Metrics Questions Decoded (2026)](https://sirjohnnymai.com/blog/loop-google-analytical/) — 今日練習題的原型案例（Google News DAU 與廣告主信任衝突的真實 debrief）。
- [Product Analytics for Interviews: Metric Design, Root Cause Analysis, and Scenario Frameworks](https://www.calibreos.com/learn/product-analytics-frameworks) — 指標樹（北極星／護欄／診斷）框架的完整說明。
- [A/B Testing PM Interview Questions - Facebook Ads Revenue Case Study](https://www.toughtongueai.com/blog/ab-testing-pm-interview-facebook-ads-revenue/) — 今日案例中「Google Search 字體顏色」傳說的出處，以及新奇效應的討論。
