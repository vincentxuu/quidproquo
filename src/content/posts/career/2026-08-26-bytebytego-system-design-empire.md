---
title: "ByteByteGo：從自費出書到百萬訂閱的系統設計帝國"
date: 2026-08-26
category: career
type: deep-dive
tags: [newsletter, creator-economy, system-design, software-engineering, interview-prep, substack, content-creation]
lang: zh-TW
series:
  name: "一個人的媒體公司"
  order: 2
tldr: "前 Twitter / Apple / Zynga 工程師 Alex Xu 2020 年自費出版《System Design Interview》，一本書打進 Amazon 暢銷榜；2022 年與前 Discord 工程師 Sahn Lam 聯手推出 Substack 電子報，首月即破 2.6 萬訂閱，兩年半達百萬。從書到電子報、YouTube、付費平台，ByteByteGo 2024 年營收 $3.5M，團隊從兩人擴張到 26 人——全程零外部融資。"
description: "ByteByteGo 創辦人 Alex Xu 的完整成長歷程：從自費出版系統設計面試書、Substack 電子報首月 2.6 萬訂閱到百萬讀者的時間線，多平台內容策略、七本書的商業飛輪，以及 bootstrapped 做到 $3.5M ARR 的方法論。"
draft: false
---


Alex Xu 用一本自費出版的面試書，撬動了一個年營收 $3.5M 的技術教育帝國。他沒有創投、沒有媒體背景、沒有團隊——起點就是一個矽谷工程師覺得「市面上的系統設計資源不夠好」。

## 背景：矽谷工程師的出書實驗

Alex Xu 畢業於卡內基美隆大學（Carnegie Mellon University），先後在 Zynga、Apple 和 Twitter 擔任軟體工程師。在大廠面試的兩端都待過——面試者和面試官——讓他對系統設計面試的準備痛點有第一手體會。

2020 年，他自費出版了《System Design Interview — An Insider's Guide》。這不是傳統出版社的路線，而是 Amazon 上的獨立出版。他後來回憶，當初沒預期這本書能有什麼商業成績。

結果它打進了 Amazon Computers & Technology 類暢銷榜，被翻譯成六種語言。這本書的成功不只帶來版稅——它證明了「系統設計面試準備」這個利基市場有大量未被滿足的需求。

他的共同創辦人 Sahn Lam 同樣出身矽谷：在 Discord、Zynga 和 NetApp 有數十年建構大規模分散式系統的經驗。兩人在 Zynga 時期就認識，後來一起寫了《System Design Interview》第二卷，也共同創辦了 ByteByteGo。

## 成長時間線

| 時間 | 里程碑 |
|---|---|
| 2020-06 | 自費出版《System Design Interview》Vol. 1，打進 Amazon 暢銷榜 |
| 2021-11 | 開始在 LinkedIn 和 X（Twitter）分享系統設計圖解 |
| 2022-04 | Substack 電子報創刊，首月突破 26,300 訂閱 |
| 2022-06 | YouTube 頻道開張 |
| 2023-02 | 推出付費訂閱（$15/月或 $150/年），同時電子報突破 33.4 萬訂閱 |
| 2023（年底） | 團隊 11 人，年營收約 $2.5M |
| 2024-07 | 電子報突破 100 萬訂閱 |
| 2024-10 | 年營收 $3.5M，團隊擴張到 26 人 |
| 2024-11 | YouTube 突破 100 萬訂閱（128 支影片） |
| 2026（現況） | 出版 7 本書、LinkedIn 追蹤數十萬、X 28.7 萬追蹤、付費平台持續擴張 |

首月 2.6 萬訂閱不是從零開始——Alex 在 LinkedIn 已經累積了約 10 萬追蹤者。但即便考慮這個基底，電子報的爆發速度仍然驚人：不到兩年就超過 33 萬，兩年半破百萬。

## 內容策略：圖解優先的多平台矩陣

ByteByteGo 的核心識別是**一張圖講清楚一個系統設計概念**。不是文字牆配示意圖，而是圖解本身就是內容——load balancer 怎麼分流、OAuth 2.0 的握手流程、一個 URL shortener 的完整架構，全部壓縮成一張乾淨的資訊圖表。

這個格式有幾個關鍵優勢：

**社群平台天然適合圖片傳播。** 一張系統架構圖在 LinkedIn 的觸及率遠高於純文字貼文。Alex 的做法是同一張圖同時發 LinkedIn 和 X，只做格式微調——不是為每個平台寫不同內容，而是一份素材跨平台複用。

**圖解降低了讀者的認知門檻。** 系統設計本質上是視覺化的——元件之間的關係、資料流向、請求路徑，用圖比用文字直覺得多。這讓完全沒有系統設計經驗的工程師也能在兩分鐘內抓到重點。

**搜尋結果的全方位佔領。** Growth In Reverse 的分析指出，ByteByteGo 在 Google 搜尋「system design interview」時，從書籍、影片、文章到圖片結果，幾乎每個區塊都有他們的內容。不是靠 SEO 技巧，而是靠多格式內容的自然覆蓋。

多平台策略的時間序也值得注意：先用 LinkedIn 和 X 建立個人品牌（2021）→ 有了 10 萬追蹤者後才推電子報（2022）→ 有了 5 萬電子報訂閱和 20 萬 LinkedIn 追蹤後才推 YouTube（2022 中）→ 有了 33 萬訂閱者後才推付費訂閱（2023）。每一步都是在前一步的流量基礎上疊加，不是同時從零開始。

## 商業模式：書是飛輪的起點，不是終點

ByteByteGo 的變現結構是圍繞「書」建立的同心圓：

1. **書籍（2020 起）**：7 本 Amazon 暢銷書——System Design Interview Vol. 1 & 2、Machine Learning System Design Interview、Coding Interview Patterns、Object-Oriented Design Interview、Generative AI System Design Interview、Mobile System Design Interview。月銷售額約 $25,000。書不是主要營收來源，但它是品牌信任的基石——「Amazon 暢銷書作者」這個標籤讓所有後續產品都更好賣。

2. **免費電子報（2022 起）**：每週六一篇，系統設計主題。100 萬+訂閱者。本身不產生直接營收，但是所有付費產品的漏斗頂端。

3. **付費電子報訂閱（2023 起）**：$15/月或 $150/年。付費訂閱者每週三額外收到一篇深度拆解。以 4% 的免費轉付費比例估算，年營收約 $200 萬。

4. **電子報贊助**：每期 1–2 個廣告版位，單價 $6,200–$8,200。這是被動收入——廣告主主動來找。

5. **付費平台 bytebytego.com**：年訂閱約 $59.99–$189（定價隨促銷浮動），涵蓋所有書籍的數位版加上獨家互動內容。

6. **Cohort 課程（2025 起）**：AI Engineer 等主題的直播班課程，是最新的營收線。

7. **YouTube（2022 起）**：100 萬+訂閱、128+ 支影片。AdSense 是補充收入，但主要價值是品牌曝光和導流到付費產品。

Growth In Reverse 估算 2023 年年營收約 $2.5M（不含付費平台），Latka 數據顯示 2024 年達 $3.5M。全程零外部融資——這是一個完全 bootstrapped 的公司。

## 成長引擎：Lead Magnet 和贈書的飛輪

ByteByteGo 有兩個特別有效的成長引擎：

**158 頁免費 PDF。** Alex 把過去在社群平台發過的系統設計圖解集結成一本 158 頁的免費下載 PDF，到處放——Substack 首頁釘選、YouTube 每支影片都附連結、社群平台 bio。這不是新內容，是舊內容的重新包裝。但「免費下載 158 頁系統設計指南」這個鉤子，比「訂閱我的電子報」有效得多。

**簽名書贈送活動。** 定期在 LinkedIn 舉辦贈書活動——留言加訂閱就有機會拿到簽名書。一次活動曾產出近 13,000 個讚和超過 5,500 則留言。這些互動直接推高 LinkedIn 演算法的觸及率，形成免費曝光的正循環。

## 團隊擴張：從兩人到 26 人

這個系列的其他案例大多是「一個人」或「兩三個人」的故事。ByteByteGo 是少數真正從個人創作者轉型成公司的案例。

2023 年底團隊 11 人，2024 年底 26 人——一年翻倍。這個擴張速度暗示了幾件事：付費平台的開發和維護需要工程團隊、7 本書的持續更新需要編輯和設計人力、多平台內容的產出已經超過兩個創辦人能處理的量。

Alex 在公開場合沒有太多談論管理團隊的經驗。但從結果來看，他做了一個很多獨立創作者不願意做的決定：**放棄「一個人」的純粹性，換取規模化的可能性。**

## 三個值得注意的決定

**自費出版，不找出版社。** 傳統出版社的優勢是發行通路和品牌背書，但代價是版稅比例低、出書週期長、內容控制權受限。自費出版讓他保留了 100% 的智財權——這在後來建立付費平台時變得極為關鍵。如果書的版權在出版社手上，bytebytego.com 的數位內容授權會複雜得多。

**電子報先免費養到 33 萬，才開付費。** 很多創作者一開始就想收費，結果既沒有規模也沒有營收。Alex 等了將近一年，讓免費電子報先建立信任和習慣，再推付費層。這個時機點不是隨意的——33 萬訂閱意味著即使只有 4% 轉換，也有超過一萬個付費使用者。

**從系統設計延伸到面試全類別。** 7 本書涵蓋了系統設計、ML 系統設計、程式面試、物件導向設計、GenAI 系統設計、行動裝置系統設計——幾乎覆蓋了軟體工程師面試的所有環節。這不是分散注意力，而是在同一個目標受眾（準備面試的工程師）身上做交叉銷售。一個準備系統設計面試的人，很可能也需要刷題和 ML 系統設計。

## 整體來說

ByteByteGo 的成功建立在一個不常見的組合上：Alex Xu 既是能寫的工程師（內容端），又是願意把個人品牌公司化的創業者（商業端）。大多數技術創作者只做前者——寫得好但不願意或不知道怎麼商業化；少數做了後者但內容品質下滑。他兩邊都做到了。

但這個案例最值得注意的不是營收數字，而是**飛輪的起點選擇**。他沒有從電子報開始，而是從一本書開始。書有幾個電子報沒有的特性：它是一次性購買（降低決策門檻）、它在 Amazon 有自然流量（不需要自己導流）、它是可信的訊號（「Amazon 暢銷書作者」比「Substack 寫手」有分量）。書建立了信任，信任驅動了電子報成長，電子報規模支撐了付費產品——每一步都在前一步的基礎上疊加。

對想做技術內容的人來說，ByteByteGo 的啟示不是「你也要寫七本書」，而是：**找到一個信任錨點（書、開源專案、大廠背景），用它啟動飛輪，然後每一步都等前一步有了足夠動能才踏出下一步。**

## 參考資料

- [ByteByteGo 官網](https://bytebytego.com/)
- [ByteByteGo Newsletter — Substack](https://blog.bytebytego.com/)
- [How ByteByteGo Grew to Over 334k Subscribers in Under 2 Years（Growth In Reverse）](https://growthinreverse.com/bytebytego/)
- [ByteByteGo Revenue $3.5M Est. ARR（Latka）](https://getlatka.com/companies/bytebytego)
- [Next Steps for ByteByteGo Newsletter — Alex Xu 宣布付費訂閱](https://blog.bytebytego.com/p/next-steps-for-bytebytego-newsletter)
- [1,000,000 Special: 30% Off Annual Premium Subscription（百萬訂閱里程碑）](https://blog.bytebytego.com/p/1000000-special-30-off-annual-premium)
- [Alex Xu — 百萬訂閱里程碑 X 貼文](https://x.com/alexxubyte/status/1818676015646097858)
- [ByteByteGo YouTube 頻道](https://www.youtube.com/@ByteByteGo)
- [ByteByteGo 團隊頁面](https://bytebytego.com/our-team)
- [System Design Interview Book Review（The Pragmatic Engineer）](https://blog.pragmaticengineer.com/system-design-interview-an-insiders-guide-review/)
- [Alex Xu LinkedIn](https://www.linkedin.com/in/alexxubyte/)
- [Alex Xu — Crunchbase](https://www.crunchbase.com/person/alex-xu-fb0e)
