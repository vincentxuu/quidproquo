---
title: "Product Builder 面試日練 — 2026-10-12：Product Sense"
date: 2026-10-12
category: daily
type: digest
tags: [product-builder-interview, daily, product-sense]
lang: zh-TW
description: "用使用者問題框架搭配 Reach × Underserved Degree 矩陣，練一道『高頻高單的 segment 其實不一定是 underserved』的 Instacart 情境題，案例是 Airbnb Categories 從 2022 年主打 56 種小眾住宿主題到 2025 年被收掉的完整過程。"
tldr: "Product Sense 面試裡最容易踩的陷阱，是看到一組『數字很漂亮』的使用者 segment，就直接跳去想『要幫他們做什麼新功能』，卻沒有先問『這群人現在到底是被滿足了，還是只是沒有更好選擇』。今天練一道情境題：Instacart 資料顯示 35–44 歲、家有小孩的訂閱家庭訂單頻率與客單價都明顯高於其他族群，但 App 裡完全沒有為這群人設計的介面。答案骨架用使用者問題框架（現況→痛點→根因→機會）先把『高頻高單』跟『需求被滿足』拆開討論，再用 Reach × Underserved Degree 矩陣判斷這個 segment 現階段真正的優先順位，避免把『已經做得不錯的地方』誤判成『還有大機會的地方』。案例是 Airbnb 的 Categories——2022 年把首頁搜尋改成瀏覽 56 種小眾住宿主題（樹屋、城堡、小島），用 ML 加人工把六百萬筆房源裡的四百萬筆分類進去，成功讓原本『沒人知道自己想要』的小眾住宿需求被看見；但 2023 年 Airbnb 擴張成 Homes、Experiences、Services 三大產品線後，Category search 的效用跟著下降，2025 年 9 月被正式收掉，換成傳統搜尋框加三個分類頁。"
series:
  name: "Product Builder 面試日練"
  order: 54
---

> 🌏 [English version](/posts/daily/2026-10-12-product-builder-interview-daily-en)

## 今日主題

Product Sense 面試官最喜歡丟的陷阱題之一，是先給一組「看起來很漂亮」的使用者數據——某個 segment 的使用頻率、客單價或留存都明顯高於平均——然後問「身為 PM，你會怎麼做？」。大部分候選人會立刻開始腦力激盪新功能，卻沒有先停下來問一個更根本的問題：這群人數字好看，是因為他們的需求已經被滿足了，還是因為他們只是「沒有更好的選擇」？

這個主題在面試中重要，是因為真實的產品工作裡，資源永遠該花在「真正還有缺口」的地方，而不是「已經表現不錯、看起來很安全」的地方。面試官要看的不是你能不能找到一個數字漂亮的 segment，而是你能不能分辨「這個 segment 現在過得好不好」跟「這個 segment 還有多少沒被滿足的機會」，這是兩件完全不同的事。

## 核心框架速記

### 使用者問題框架（現況 → 痛點 → 根因 →機會）

拿到一組「某個 segment 數據特別突出」的題目時，先用四步把討論從「數字好看」拉回到「使用者到底缺什麼」：

| 步驟 | 要回答的問題 | 面試時容易犯的錯 |
|------|------|----------------|
| **現況** | 這群人實際的行為模式是什麼？這個數據是怎麼定義、怎麼量出來的？ | 直接接受題目給的數字，不追問定義範圍 |
| **痛點** | 這群人在使用產品時，哪個環節還在手動、還要花心力、還會猶豫？ | 把「數字好」直接當成「沒有痛點」 |
| **根因** | 為什麼他們會呈現這個行為模式？是需求被滿足了，還是因為缺乏替代方案才留下來？ | 跳過根因分析，直接假設「數字好＝可以複製給別人」 |
| **機會** | 根因如果成立，哪個具體產品方向能讓這群人更好，或讓這個模式複製到其他 segment？ | 提出的方案跟前三步找到的根因對不上 |

**面試時的用法**：「根因」這一步最容易被候選人跳過，直接從「現況」跳到「機會」。這正是候選人之間最容易拉開差距的地方——有沒有先問「這個數字好看的背後，是滿足還是鎖定」。

### Segment 選擇矩陣：Reach × Underserved Degree

找到候選 segment 之後，不要只看「這群人多不多」，而是放進一個簡單的 2×2 矩陣裡判斷優先順位：

| | Underserved Degree 低（需求已被滿足） | Underserved Degree 高（還有明顯缺口） |
|---|---|---|
| **Reach 高**（人數多） | 維持現狀、避免過度投入；小心不要為了「看起來有機會」而重複造輪子 | 最值得優先投入的象限——人多、缺口也明顯 |
| **Reach 低**（人數少） | 通常不值得單獨立項 | 可能是未來的新客來源，但要先驗證規模能不能長大 |

**面試時的用法**：今天練習題裡「高頻高單」的 segment，數字會讓人直覺把它放進「值得優先投入」的象限，但這張矩陣逼你先回答「他們的 Underserved Degree 到底高還是低」，而不是只看 Reach 一個維度就下結論。

## 今日練習題

### 題目

「你是 Instacart 的產品經理。內部資料顯示：35–44 歲、家有小孩的訂閱家庭，在『週末幫全家備餐』與『跳過逛超市』這兩個使用情境上的品牌聯想最強，訂單頻率與客單價也明顯高於其他族群——但目前 App 裡沒有任何介面或流程是特別為這群人設計的。身為 PM，你會怎麼做？」

（來源：自擬，根據 Instacart 真實使用者 segment 數據改編，原始數據見 Morning Consult 品牌策略報告《Why Instacart Wins Grocery Delivery — but Struggles in Meal Moments》）

### 拆解思路

1. **釐清問題**：先問面試官——這批「35–44 歲、家有小孩」的標籤怎麼定義出來的（問卷自報、訂單內容推斷，還是第三方資料）？這題的業務目標是想讓這群人訂單頻率再往上推，還是想用他們的行為模式去吸引更多同類型新客？
2. **描述現況**：這群人現在的行為已經是「高頻、高客單、品牌聯想強」——用使用者問題框架的第一步，先承認這是一個已經表現很好的 segment，而不是急著找問題。
3. **檢查根因、避免誤判**：追問「他們高頻高單，是因為 Instacart 真的解決了他們的核心痛點，還是因為補貨本來就是重複性需求，沒有更好的替代方案才留下來」。如果是後者，代表這群人的 Underserved Degree 其實偏低——他們不是「還有很大機會」的 segment，而是「現在做得還不錯、要小心別搞砸」的 segment。
4. **用矩陣判斷優先順位**：把這個 segment 放進 Reach × Underserved Degree 矩陣——Reach 高（家庭訂閱戶是 Instacart 的核心人群）、但 Underserved Degree 偏低（核心需求已被滿足）。這代表正確的策略方向不是「大改介面搶新機會」，而是「鞏固與降低摩擦」，同時把資源留一部分去找真正 Underserved Degree 高的象限。
5. **提出方案並定義成功**：方案聚焦在「降低每週重複決策的心力」——例如依家庭人數自動建議份量的補貨清單、把歷史訂單轉成一鍵重複購買的模組，而不是發明一個全新的「家庭專屬功能」。成功指標看「重複購買清單的使用率」與「下單到結帳的平均操作步驟數」是否下降，同時監控客訴與退貨率，避免自動化建議反而造成浪費。

### 範例回答（面試時可以這樣講）

> **問題釐清與定位**：「我會先確認這個『35–44 歲、家有小孩』的標籤是怎麼定義出來的，還有這題背後的業務目標——是想把這群人的訂單頻率再推高，還是想用他們的行為模式去吸引更多類似的新客，因為這兩個目標會導向完全不同的方案。」
>
> **根因分析與優先順位判斷**：「接下來我不會急著想新功能，而是先問：這群人訂單頻率高，是因為 Instacart 真的解決了他們的核心痛點，還是因為補貨本來就是重複性需求，沒有更好的替代方案才留下來？如果是後者，代表他們的 Underserved Degree 其實偏低——放進 Reach × Underserved 矩陣，這是『人多，但缺口不明顯』的象限，正確做法是鞏固現有體驗、降低摩擦，而不是大動作重新設計。」
>
> **提出方案與成功定義**：「所以我會把方向收斂在『降低每週重複決策的心力』，例如依家庭人數自動建議補貨份量、把過去訂單轉成一鍵重複購買。成功與否我會看『重複購買清單的使用率』跟『下單到結帳的平均操作步驟數』有沒有下降，同時盯緊客訴跟退貨率——如果自動建議的份量常常錯，這群人反而會覺得被打擾，而不是被服務。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 先追問 segment 標籤的資料定義與業務目標，不照單全收 | |
| 區分「現況數字好看」跟「需求已被滿足」是兩件不同的事 | |
| 用 Reach × Underserved Degree 矩陣判斷這個 segment 的真實優先順位 | |
| 方案對應到根因分析的結論，不是憑直覺發明新功能 | |
| 定義上線後要看的具體指標與可能的失敗訊號 | |
| 加分項：提到這類「鞏固型」方案跟「開拓型」方案該怎麼分開看待資源分配 | |

## 今日案例

**Airbnb Categories：把小眾住宿需求「看見」，再因為產品擴張而收掉**

2022 年 5 月，Airbnb 把首頁搜尋改成以 Categories 為中心——新增 56 種住宿主題，從 A-frame 木屋、城堡、小島到樹屋、Bowling alley 應有盡有，讓使用者可以先瀏覽「想住什麼樣的地方」而不是先輸入目的地。Airbnb 當時用機器學習加人工審核，把平台上六百萬筆房源裡的四百萬筆分類進這些主題。這個決定背後的邏輯，正是 Reach × Underserved Degree 矩陣裡「Reach 看似分散、但 Underserved Degree 很高」的象限——想住樹屋或城堡的人單獨看人數不多，但這類「不知道自己想要、直到被展示出來才知道」的需求，傳統以目的地為主的搜尋框完全沒有被滿足。2023 年之後 Airbnb 陸續擴張成 Homes、Experiences、Services 三條產品線，Category search 作為「單一產品、單一入口」的設計假設不再成立，2025 年 9 月 Airbnb 正式收掉 Category 首頁，改回傳統搜尋框加三個分類頁籤。

**面試連結**：這個案例可以同時支撐「如何挑選值得投入的 segment」跟「segment 策略不是一次性決定」兩個論點。回答任何涉及「這個 segment 值不值得做」的題目時，可以引用 Airbnb 的判斷邏輯——先看這群人的需求有沒有真的被現有方式滿足；回答「怎麼知道方案成功了」時，也可以補一句：segment 導向的設計要跟著公司階段重新檢視，不是做了就能一直用到底。

## 延伸閱讀

- [The Definitive Guide to Mastering Product Sense Interviews](https://www.lennysnewsletter.com/p/the-definitive-guide-to-mastering) — Lenny's Newsletter 整理的 Product Sense 面試完整方法，今天「Segment 選擇矩陣」概念的原始出處
- [Airbnb is rolling out a new design to encourage travel discovery](https://thenextweb.com/news/airbnb-redesign-travel-discovery-brian-chesky-interview) — Airbnb Categories 2022 年上線時的訪談報導，含分類房源數字
- [Airbnb's Categories Were Meant to Reinvent the Search Box — Now They're Gone](https://skift.com/2025/09/25/airbnbs-categories-were-meant-to-reinvent-the-search-box-now-theyre-gone/) — Categories 在 2025 年被收掉的完整脈絡

## 參考資料

- [Why Instacart Wins Grocery Delivery — but Struggles in Meal Moments](https://morningconsult.com/articles/instacart-grocery-essentials-strategy) — 對應「今日練習題」裡家庭 segment 訂單頻率與品牌聯想數據的原始出處
- [The Definitive Guide to Mastering Product Sense Interviews](https://www.lennysnewsletter.com/p/the-definitive-guide-to-mastering) — 對應「核心框架速記」Reach × Underserved Degree 矩陣的方法論出處
- [Airbnb is rolling out a new design to encourage travel discovery](https://thenextweb.com/news/airbnb-redesign-travel-discovery-brian-chesky-interview) — 對應「今日案例」Categories 2022 年上線時的分類房源數字
- [Airbnb's Categories Were Meant to Reinvent the Search Box — Now They're Gone](https://skift.com/2025/09/25/airbnbs-categories-were-meant-to-reinvent-the-search-box-now-theyre-gone/) — 對應「今日案例」Categories 2025 年被收掉的完整脈絡
