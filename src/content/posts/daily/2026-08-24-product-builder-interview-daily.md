---
title: "Product Builder 面試日練 — 2026-08-24：Product Sense"
date: 2026-08-24
category: daily
tags: [product-builder-interview, daily, product-sense]
lang: zh-TW
description: "今日練 Product Sense 面試：CIRCLES 框架、MECE 使用者分群技巧，以及一道改編自 Google PM 真實面試 debrief 的「幫銀髮族改善 YouTube 搜尋體驗」題目拆解。"
tldr: "Product Sense 面試考的不是你能想出幾個功能，是你能不能把模糊的題目收斂成「行為驅動」的診斷——Google 一場真實 HC debrief 裡，候選人提了 12 個 YouTube 功能被刷掉，理由是「他們描述了 what，沒有描述 why」。今天用 CIRCLES 框架拆解一道銀髮族搜尋體驗題，案例是 Superhuman 怎麼用一份四題問卷把 product/market fit 分數從 22% 拉到 58%。"
series:
  name: "Product Builder 面試日練"
  order: 5
---

## 今日主題

Product Sense（又稱 product design）題型出現在超過 40% 的 PM 面試裡，是拉開「還不錯」和「很強」候選人差距的關鍵環節。它跟行為題不一樣：沒有公式能救你，考的是你能不能把「改善 XX 產品」這種開放式提示，收斂成有根據的診斷,再走到可驗證的方案。

Google 一場真實的 hiring committee debrief 給了一個很好的反面教材：一位候選人針對「幫銀髮族改善 YouTube」丟出了 12 個功能構想，最後被刷掉——committee 的紀錄寫的是「他們描述了 what，沒有描述 why」。也就是說，候選人講的是功能清單，不是「使用者現在卡在哪裡、為什麼會卡住」。今天要練的就是這個轉換：從 demographic（「25-40 歲通勤族」）跳到 behavior（「連續三次搜尋失敗就放棄」），才是面試官真正在找的訊號。

## 核心框架速記

### CIRCLES：Product Sense 的標準骨架

30 分鐘以上、題目夠開放時最適用，Google 這類重視結構化思考的公司特別吃這套：

| 步驟 | 內容 | 常見失誤 |
|------|------|---------|
| **C**omprehend | 釐清題目範圍（平台、使用者、成功定義） | 跳過澄清，直接開始腦力激盪 |
| **I**dentify customers | 用 MECE 方式切出使用者分群 | 分群互相重疊，或用 demographic 取代 behavior |
| **R**eport needs | 針對每個分群，描述他們真正的痛點 | 痛點寫得太抽象，沒有具體情境 |
| **C**ut through prioritization | 選出最值得解的一個分群 + 痛點 | 想面面俱到，捨不得收斂 |
| **L**ist solutions | 針對選定的痛點，列出多個方案 | 只想到一個方案就開始展開 |
| **E**valuate trade-offs | 比較方案的效益、成本、風險 | 只講優點，不講取捨 |
| **S**ummarize | 用一句話收斂成最終建議 | 結尾模糊，沒有明確立場 |

### 使用者分群速記：MECE 檢查表

分群做得好不好，決定了後面所有分析的品質。快速自我檢查：

| 檢查項 | 說明 |
|-------|------|
| Mutually Exclusive | 每個使用者只屬於一個分群，沒有重疊 |
| Collectively Exhaustive | 分群加總起來要覆蓋題目提到的整體使用者 |
| 用「行為」不用「人口統計」 | 「連續搜尋失敗會放棄」比「65 歲以上」更有診斷力 |
| 差異要導向不同方案 | 如果兩個分群的解法一樣，代表分群分得不夠細 |

## 今日練習題

### 題目

「YouTube 想要提升銀髮族（65 歲以上）使用者透過電視遙控器搜尋內容時的成功率，你會怎麼做？」

（來源：改編自 Google PM Product Sense 真實面試案例，原始 debrief 記錄一位候選人聚焦「用電視遙控器搜尋的銀髮族在連續三次搜尋失敗後放棄」這個具體摩擦點而過關；來源 sirjohnnymai.com 整理的 2026 Google PM 面試分析　類型：Product Design　環節：product sense round，45 分鐘）

### 拆解思路

1. **釐清問題**：先問清楚範圍——是所有平台還是特指電視（遙控器輸入是這題的關鍵限制）？現在的 baseline 是什麼（搜尋成功率、放棄率）？「提升成功率」是指第一次就找到，還是最終有找到？
2. **定義使用者**：不要用「65 歲以上」當分群，要往下切成行為：用遙控器打字慢、常打錯字的族群 vs. 已經習慣用語音搜尋的族群 vs. 完全不搜尋、只靠首頁推薦的族群——這三群的解法完全不同。
3. **結構化分析**：畫出搜尋的 user journey，找出具體的 drop-off 點。比方說：「輸入第一個字要 8 秒 → 打錯字要重打 → 連續 3 次搜不到結果就直接關掉 App」，摩擦點在「打字」這個步驟，不在結果排序。
4. **提出方案**：針對「打字慢、常打錯」這個具體摩擦點設計方案——例如語音輔助的查詢修正（說出關鍵字後，系統主動猜測並修正常見的口誤或簡稱），而不是重新設計整個搜尋 UI。方案要能講出「為什麼是這個摩擦點，不是別的」。
5. **定義成功**：主要指標是搜尋成功率（幾次輸入內找到想看的內容）；guardrail 指標是平均搜尋耗時（避免為了成功率犧牲太多操作步驟）；也要想清楚這個改動會不會讓其他分群（例如打字熟練的使用者）體驗變差。

### 範例回答（面試時可以這樣講）

> **問題釐清與分群**：「我想先確認範圍——這題是指電視上用遙控器搜尋，對嗎？如果是這樣，輸入方式本身就是最大的限制條件。我會把銀髮族使用者依搜尋行為切成三群：打字慢又常打錯字的、已經在用語音搜尋的、還有完全不搜尋只靠首頁推薦的。我想先聚焦第一群，因為他們是『有意圖找內容，卻被輸入方式卡住』，這是最有機會用產品解決的落差。」
>
> **問題定位**：「假設我拿到的數據顯示，這群使用者平均要 8 秒才能打出第一個字，而且連續三次搜尋沒結果，超過六成的人會直接關掉搜尋、回到首頁被動瀏覽。這代表摩擦點不在『搜尋結果排序不準』，而在『輸入這個動作本身太痛苦』——如果我直接去優化搜尋演算法，根本沒解決真正的問題。」
>
> **方案與取捨**：「我會提語音輔助的查詢修正——使用者說出想看的內容，系統除了辨識語音，還針對常見的口誤、簡稱、模糊描述做主動修正，而不是要求使用者打出精確關鍵字。這個方案犧牲了一點『精準搜尋』的控制感，但換來輸入摩擦大幅下降。主要指標我會看搜尋成功率，guardrail 是平均搜尋耗時，同時追蹤原本就習慣打字的使用者有沒有因為介面改動而體驗變差。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 用澄清問題把題目範圍收斂（平台、輸入方式、成功定義） | |
| 使用者分群是「行為驅動」，不是人口統計 | |
| 有明確指出具體的摩擦點/drop-off 點，不是籠統的「體驗不好」 | |
| 方案有講出「為什麼是這個摩擦點」，不是功能清單 | |
| 成功指標有主要指標 + guardrail，不只講一個數字 | |
| 加分項：提到方案可能對其他分群造成的負面影響 | |

## 今日案例

**Superhuman：用一份四題問卷,把 product/market fit 分數從 22% 拉到 58%**

Superhuman 創辦人 Rahul Vohra 在 2017 年面對一個典型的 product sense 難題：產品有使用者，但成長停滯,不確定該往哪個方向投資。他用 Sean Ellis 的「如果不能再用這個產品，你會有什麼感覺？」當核心問題，先把「非常失望」的使用者（22%）獨立出來當作 high-expectation customers，再針對這群人問「這個產品對你最大的幫助是什麼」跟「我們該怎麼改善」。分析結果發現,擋住更多使用者進入「非常失望」這個死忠分群的關鍵瓶頸,是「沒有手機版」——這個發現直接寫成了接下來一年的產品路線圖。三季之後,分數從 22% 衝到 58%。

**面試連結**：這個案例是「使用者分群 → 收斂到具體痛點 → 資源分配」全流程的絕佳示範,可以直接拿來回答「你會怎麼決定產品優先順序」或「怎麼找到產品的下一步方向」這類題目。重點不是複述 Sean Ellis 問卷本身，是講清楚 Vohra 怎麼故意「忽略」不失望使用者的意見、只聚焦在死忠使用者身上——這個反直覺的取捨判斷,正是 product sense 面試在考的東西。

## 延伸閱讀

- [Product Sense Interview: Frameworks & Questions (2026)](https://buildzeroist.com/blog/product-sense-interview-questions) — CIRCLES、BUS、GAME 三套框架的完整比較與使用時機
- [How to Segment in PM Product Sense Interviews](https://stellarpeers.com/product-sense-interview-segmentation-framework/) — MECE 使用者分群的 5 分鐘實戰技巧
- [Product Sense Interviews: Structured Frameworks for Improving Products with Data](https://www.calibreos.com/learn/analytics-product-sense) — 8 步驟框架，附「9 分 vs 6 分回答」的具體差異分析

## 參考資料

- [Google PM Product Sense Interview](https://sirjohnnymai.com/blog/14-google-pm-product-sense-interview/) — 對應「今日主題」與「今日練習題」的 YouTube 銀髮族案例來源
- [Product Sense Interview: Frameworks & Questions (2026)](https://buildzeroist.com/blog/product-sense-interview-questions) — 對應「核心框架速記」CIRCLES 部分
- [How to Segment in PM Product Sense Interviews](https://stellarpeers.com/product-sense-interview-segmentation-framework/) — 對應「使用者分群速記」MECE 表格
- [How Superhuman Built an Engine to Find Product Market Fit](https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/) — 對應「今日案例」
