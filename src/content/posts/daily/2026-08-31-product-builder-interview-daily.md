---
title: "Product Builder 面試日練 — 2026-08-31：Product Sense"
date: 2026-08-31
category: daily
tags: [product-builder-interview, daily, product-sense]
lang: zh-TW
description: "今日練 Product Sense 面試：用「症狀 → 假設 → 驗證」的根因拆解法補強 CIRCLES 框架，練一道最近 Adobe PM 面試真實出現的『幫 LinkedIn 設計新功能』題目。"
tldr: "Product Sense 題最容易垮的地方不是想不出功能，是想到功能後說不出「為什麼是這個」。Exponent 最新彙整的 2026 真實面試題庫裡，一位 Adobe 候選人被問到『幫 LinkedIn 設計一個功能』，強答案的共同點是先鎖定一個使用者分群、再往下拆到具體痛點，而不是一次列十個構想。今天用 CIRCLES 框架加一層根因拆解，練這道題，案例是 Airbnb 早期用「幫房東拍專業照片」這個不規模化的動作解決轉換率問題。"
series:
  name: "Product Builder 面試日練"
  order: 12
---

> 🌏 [English version](/en/posts/daily/2026-08-31-product-builder-interview-daily-en)

## 今日主題

Product Sense（也叫 product design）題型測的不是創意，是「收斂能力」——面試官丟一個開放式提示，看你能不能在 30-40 分鐘內從模糊走到有根據的方案。IGotAnOffer 統計 Meta、Lyft、Stripe 都把這輪列為必考，Google 甚至把它獨立命名為「product insight」round，可見這個環節的權重有多重。

真正拉開差距的不是「你想到幾個功能」，是「你有沒有先講清楚為什麼要解決這個問題，再談怎麼解決」。Exponent 最新收錄的 2026 真實面試題庫裡提到，一位候選人被 Adobe 問到「幫 LinkedIn 設計一個功能」，強答案的共同點是及早鎖定一個使用者分群，而不是把每個選項都攤開來講一遍。今天要練的就是這個收斂動作：從一個開放題目，走到一個能站得住腳的具體方案。

## 核心框架速記

### CIRCLES：先用骨架撐住整個回答

| 步驟 | 內容 | 常見失誤 |
|------|------|---------|
| **C**omprehend | 釐清題目範圍（產品、平台、成功定義） | 沒問清楚就開始發散 |
| **I**dentify customers | 切出 2-3 個使用者分群 | 分群太籠統，彼此重疊 |
| **R**eport needs | 針對每個分群，講出具體痛點 | 痛點寫成抽象形容詞，沒有情境 |
| **C**ut through prioritization | 選一個分群 + 痛點，其他先放下 | 捨不得收斂，想面面俱到 |
| **L**ist solutions | 針對選定痛點列出多個方案 | 只想到一個方案就往下講 |
| **E**valuate trade-offs | 比較方案的效益、成本、風險 | 只講優點不講代價 |
| **S**ummarize | 一句話收斂成最終建議 | 結尾模糊，沒有明確立場 |

### 問題拆解：症狀 → 假設 → 驗證

CIRCLES 的「R」步驟最容易寫得太表面，補一層根因拆解可以讓痛點更具體：

| 層次 | 問法 | 範例 |
|------|------|------|
| 症狀 | 使用者實際卡在哪個動作？ | 「求職者發了訊息給招募方，卻很少收到回覆」 |
| 假設 | 為什麼會發生這個症狀？列 2-3 個可能原因 | 招募方訊息量太大 / 求職者的訊息缺乏可信度訊號 / 時機不對 |
| 驗證 | 哪個假設最可能是主因？用什麼資料或觀察佐證 | 若招募方回覆率跟訊息內容是否附上具體技能佐證高度相關，代表問題出在「可信度訊號」而非訊息量 |

這一層的價值在於：面試官問「為什麼是這個方案」時，你能直接指回驗證過的假設，而不是憑直覺往下講。

## 今日練習題

### 題目

「幫 LinkedIn 設計一個新功能。」

（來源：Exponent《52 Real Product Manager Interview Questions (2026 Guide)》整理的近期 Adobe PM 面試真實案例；題型：Product Design／product sense round）

### 拆解思路

1. **釐清問題**：先問清楚範圍——是求職者側、招募方側，還是內容創作者側？是要提升哪個指標（活躍度、求職成功率、招募轉換率）？有沒有特定裝置或情境限制？
2. **定義使用者**：不要停在「LinkedIn 使用者」，往下切成行為分群，例如：正在積極求職但職涯經歷不完整的轉職者、被動瀏覽但不主動應徵的潛在候選人、發布職缺後收不到合適應徵者的中小企業招募方。
3. **結構化分析**：針對選定的分群畫出關鍵行為路徑，找出具體卡點。例如轉職者常見的卡點是「履歷上的正式工作經歷少，導致訊息容易被招募方忽略」，而不是籠統的「找工作很難」。
4. **提出方案**：針對這個具體卡點設計方案——例如讓使用者附上具體專案或技能佐證的「技能驗證卡」，取代單純的職稱與年資欄位；同時列出至少一個替代方案（例如同儕背書機制），並講出取捨。
5. **定義成功**：主要指標可以是「求職者訊息的回覆率」；guardrail 指標是招募方標記垃圾訊息的比例，避免功能被濫用；也要想清楚這個改動是否會讓資深、經歷完整的求職者體驗變差。

### 範例回答（面試時可以這樣講）

> **問題釐清與分群**：「我想先確認範圍——這題我會聚焦在求職者主動聯繫招募方、卻收不到回覆的情境。我會把求職者切成三群：職涯經歷完整、正在被動觀望的資深人才；經歷不多、正在轉職的求職者；還有單純想擴大人脈但沒有明確求職意圖的使用者。我想先聚焦第二群，因為他們最有動機使用產品，卻也最容易被現有的『職稱＋年資』欄位卡住。」
>
> **問題定位**：「假設我拿到的資料顯示，經歷不足五年或正在轉職的使用者，訊息回覆率明顯低於平均，而招募方的訪談回饋也提到『看不出這個人是不是真的會做』。這代表卡點不是訊息量太大，是『可信度訊號不足』——如果我只是做一個『一鍵打招呼』功能加快發訊息速度，反而會讓招募方收到更多缺乏佐證的訊息，回覆率只會更差。」
>
> **方案與取捨**：「我會提『技能驗證卡』——讓求職者附上一至兩個具體專案連結或作品佐證，取代單純填寫職稱。這個方案的代價是增加了求職者填寫的門檻，可能降低整體使用率，但換來的是訊息可信度提升。主要指標我看訊息回覆率，guardrail 是招募方標記垃圾訊息的比例，同時我會追蹤這個改動有沒有讓經歷完整的資深使用者，因為多一道填寫步驟而放棄使用。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 用澄清問題把題目範圍收斂（側別、指標、限制） | |
| 使用者分群是行為驅動，不是籠統的「所有使用者」 | |
| 有把痛點拆到「症狀 → 假設 → 驗證」，不是停在表面描述 | |
| 方案有講出「為什麼是這個卡點」，不是功能清單 | |
| 成功指標有主要指標 + guardrail，不只講一個數字 | |
| 加分項：提到方案可能對其他分群造成的負面影響 | |

## 今日案例

**Airbnb：用「幫房東拍專業照片」解決轉換率問題**

2009 年 Airbnb 早期成長停滯，數據顯示紐約地區的訂單特別差，創辦人實地去看房源列表才發現真正的問題：房東自己拍的照片畫質差、光線不好，根本無法讓潛在房客判斷房源品質。他們沒有先做「上傳照片指南」這種規模化方案，而是直接租相機、逐一登門幫紐約房東免費拍攝專業照片。結果那些換上專業照片的房源，訂單量明顯提升，這個做法後來擴大成 Airbnb 正式的攝影師計畫，成為公司早期成長的關鍵動作之一。

**面試連結**：這個案例是「症狀 → 假設 → 驗證」拆解的絕佳示範——症狀是訂單差，一般假設會先跳到「行銷不夠」或「定價問題」，但創辦人實際去看了才發現根因是「照片品質」這個具體卡點。可以用來回答「你會怎麼找出產品成長停滯的根因」或「舉一個你用不規模化手段驗證假設的例子」這類題目，重點是強調「先去看真實情境，而不是憑資料表格猜測」這個動作本身。

## 延伸閱讀

- [52 Real Product Manager Interview Questions (2026 Guide)](https://www.tryexponent.com/blog/top-product-manager-interview-questions) — 六大 PM 面試題型總覽，附各公司真實近期題目
- [10 product design questions for PMs (with sample answers)](https://igotanoffer.com/blogs/product-manager/product-design-questions) — product design/product sense 輪的完整框架與範例回答
- [The Ultimate Guide to Product Management Prioritization Frameworks](https://www.productplan.com/learn/product-management-frameworks) — Impact/Effort、Value vs. Complexity 等優先序框架整理

## 參考資料

- [52 Real Product Manager Interview Questions (2026 Guide)](https://www.tryexponent.com/blog/top-product-manager-interview-questions) — 對應「今日主題」與「今日練習題」的 Adobe／LinkedIn 案例來源
- [10 product design questions for PMs (with sample answers)](https://igotanoffer.com/blogs/product-manager/product-design-questions) — 對應「今日主題」product sense round 於 Meta、Lyft、Stripe、Google 的說法
- [4x Winning Product Management Case Study Examples](https://www.hustlebadger.com/what-do-product-teams-do/product-management-case-studies/) — 對應「核心框架速記」中結構化拆解的寫作參考
