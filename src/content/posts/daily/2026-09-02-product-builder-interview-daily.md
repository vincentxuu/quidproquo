---
title: "Product Builder 面試日練 — 2026-09-02：Strategy & Execution"
date: 2026-09-02
category: daily
tags: [product-builder-interview, daily, strategy]
lang: zh-TW
description: "今日練 Strategy & Execution 面試：用五力分析加 TAM-SAM-SOM 拆解 Google 該不該跨足線上家具零售市場，並用 Zoom 在飽和的視訊會議市場硬是打出一條血路的案例，練「後進者怎麼找到護城河」。"
tldr: "策略題最容易垮的地方不是分析不出市場多大，是分不清「這個市場值得進」跟「我們有能力打贏」是兩件事。Exponent 最新版 Google Product Strategy 面試指南收錄了一道經典市場進入題：Google 該不該做線上家具零售。今天用五力分析加 TAM-SAM-SOM 拆這題，案例是 Zoom 在 Cisco WebEx、Skype 都已經卡位的飽和市場裡，靠「摩擦力最低」而不是「功能最多」硬生生打出一條路——策略題最後拚的往往不是市場大小，是你有沒有一個對手複製不了的優勢。"
series:
  name: "Product Builder 面試日練"
  order: 14
---

> 🌏 [English version](/en/posts/daily/2026-09-02-product-builder-interview-daily-en)

## 今日主題

Strategy 題型測的不是「你會不會算市場規模」，是「你能不能在市場很大、但競爭也很激烈的情況下，講出一個具體、對手抄不走的切入點」。Exponent 最新版《Google Product Strategy Interview Guide》把「市場進入與擴張」列為五大題型之一，而且明講這類題目在最終面的比重最高，因為它同時考「有沒有結構化思考」跟「有沒有真正的產業洞察」。

這類題目最常見的失分點不是算錯 TAM，是算完市場規模就直接跳到「所以我們應該進場」，完全沒有回答「憑什麼是我們贏，不是現有玩家繼續贏」。今天要練的就是這個收斂：從「市場夠大」走到「我們有一個具體、可持續的競爭優勢」。

## 核心框架速記

### Porter's Five Forces：判斷這個市場好不好打

| 五力 | 問的問題 | 面試現場怎麼用 |
|------|---------|---------------|
| 現有競爭者強度 | 市場裡已經有誰、打得多兇 | 先列出前三大玩家，不要跳過這步直接談自己的優勢 |
| 新進入者威脅 | 進入門檻高不高 | 決定你的策略是「正面硬打」還是「找側翼切入」 |
| 替代品威脅 | 有沒有非同類但能解決同樣問題的方案 | 常被忽略，但面試官很愛追問 |
| 供應商議價力 | 上游成本結構是否可控 | 電商、硬體類題目常靠這裡拉出取捨 |
| 買方議價力 | 使用者/客戶轉換成本高不高 | 決定你的獲客策略要不要靠價格戰 |

五力分析的價值不在把五格填滿，是逼你在回答「要不要進場」之前，先誠實回答「這個市場本來就好打嗎」。

### TAM-SAM-SOM：市場大不代表拿得到

| 層次 | 定義 | 面試現場怎麼用 |
|------|------|---------------|
| TAM（總潛在市場） | 假設拿下 100% 市占的營收上限 | 用來說服面試官「這值得做」 |
| SAM（可服務市場） | 扣掉你的商業模式、地理、法規限制後能碰到的市場 | 常是候選人漏算的一層，容易把 TAM 當 SOM 講 |
| SOM（可實際拿下市場） | 考慮競爭現況與自身資源，未來 2-3 年真的拿得到的份額 | 面試官最想聽這個數字怎麼推導出來，而不是隨口報一個百分比 |

TAM 說明「這個機會值不值得討論」，SOM 才是說明「我們真的打得贏」——兩者混著講是策略題最常見的扣分點。

## 今日練習題

### 題目

「Google 應不應該跨足線上家具零售市場？」

（來源：Exponent《Google Product Strategy Interview Guide (2026)》，歸類在「市場進入與擴張」題型，是該輪面試的高頻真題之一）

### 拆解思路

1. **釐清問題**：先問「跨足」具體指什麼——自建電商囤貨銷售、併購既有玩家（如 Wayfair）、還是把現有的 Shopping 廣告與 AR 試擺功能做深？時間範圍是 3 年還是 5 年？這三種答案會導向完全不同的分析路徑。
2. **定義市場與使用者**：家具消費者大致分三群——首購小資族（重視價格與到貨速度）、換屋／裝潢族（重視風格搭配與退換貨體驗）、商用採購（重視批量議價與交期穩定），三群人對「線上買家具」的痛點完全不同。
3. **結構化分析**：用五力分析看這個市場——IKEA、Wayfair、Amazon 已經卡位很深，現有競爭強度高；家具體積大、退換貨成本高是天然進入門檻，新進入者威脅其實不算高，這代表硬打價格戰不划算。接著用 TAM-SAM-SOM：全球線上家具零售 TAM 很大，但扣掉 Google 沒有物流與倉儲能力後，SAM 會大幅縮小到「搜尋與廣告能觸及的交易環節」，SOM 更要誠實反映 Google 缺乏電商履約經驗這個事實。
4. **提出方案**：與其自建電商跟 Wayfair 正面對決，更合理的切入點是強化 Google 本來就有優勢的環節——用 AR 試擺功能降低家具「看不到實體不敢買」的痛點，搭配 Shopping 廣告把流量導給既有零售商抽成，而不是自己囤貨承擔庫存與退換貨風險。要講清楚取捨：這條路線的營收成長比自建電商慢，但避開了 Google 完全沒有經驗的物流與庫存管理。
5. **定義成功**：不用 GMV 當主指標（那是電商玩家的戰場），改用「透過 AR／Shopping 廣告產生的家具類別廣告營收成長」與「合作零售商的轉換率提升」，這樣才是真正對齊 Google 自身優勢的成功指標。

### 範例回答（面試時可以這樣講）

> **問題釐清**：「我想先確認『跨足』指的是哪一種——自己囤貨做電商、併購現有玩家，還是把現有的 Shopping 廣告和 AR 試擺功能做深？這三個答案會讓我後面的分析完全不一樣，我先假設我們討論的是第三種，強化現有廣告與購物體驗，而不是自建物流。」
>
> **結構化分析**：「用五力分析看，IKEA、Wayfair、Amazon 已經在這個市場卡位很深，而且家具體積大、退換貨成本高，這其實是一道天然的進入門檻——這代表就算 Google 想硬打價格戰也打不贏,更別說我們完全沒有倉儲物流的經驗。用 TAM-SAM-SOM 拆的話，全球線上家具零售的 TAM 很大，但把 Google 沒有履約能力這個事實算進去，SAM 會縮小到『搜尋與廣告能觸及的交易環節』，而不是整個電商交易額。」
>
> **方案與取捨**：「所以我不會建議自建電商正面對決 Wayfair，而是把 Google 本來就強的兩個能力做深——用 AR 試擺功能解決『看不到實體不敢買』這個家具類目特有的轉換痛點，再搭配 Shopping 廣告把流量導給既有零售商、從交易抽成或廣告費獲利。這條路線成長比自建電商慢，但避開了我們完全沒經驗的庫存與退換貨風險，成功指標我會定在家具類別的廣告營收成長和合作零售商轉換率提升，而不是 GMV。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 先釐清「進入」的具體形式與時間範圍 | |
| 用五力分析誠實評估這個市場好不好打 | |
| 區分 TAM／SAM／SOM，沒有把總市場當成能拿到的份額 | |
| 方案有對齊自身既有優勢，不是憑空喊要做電商 | |
| 成功指標對齊選定的切入策略，不是套用電商標準指標 | |
| 加分項：明確指出「憑什麼是我們贏」而不只是「市場夠大」 | |

## 今日案例

**Zoom：在飽和的視訊會議市場，靠「摩擦力最低」打贏功能最多的對手**

Eric Yuan 在 2011 年離開 Cisco WebEx 創辦 Zoom 時，視訊會議市場被普遍認為已經飽和——Cisco WebEx、Microsoft Skype、LogMeIn 都是財力雄厚的既有玩家。Zoom 沒有選擇在功能列表上硬碰硬，而是把賭注押在「一鍵加入、不用下載笨重帳號系統、免費版就能開多人會議」這個當時所有對手都懶得解決的摩擦點上。Forbes 在 2019 年的報導指出，Zoom 當年營收成長超過 100%，而 Cisco 的視訊會議營收只成長 18%；到了同一年，Cisco 自己承認光一季就從 Zoom 手上搶回五萬個席位才勉強止血，側面說明 Zoom 已經打進了原本被視為對手鐵板一塊的企業客戶。

**面試連結**：這個案例是「後進者在飽和市場找護城河」的最佳教材，可以直接用在「舉一個成功切入紅海市場的產品例子」或「你會怎麼判斷一個市場還有沒有進入空間」這類題目，重點是強調「五力分析顯示市場飽和，不代表沒有機會——真正的機會常常藏在既有玩家共同忽略的那個摩擦點裡」。

## 延伸閱讀

- [Google Product Strategy Interview Guide (2026)](https://www.tryexponent.com/guides/google-product-strategy-interview) — 本篇練習題出處，含市場進入、M&A、產品變現等五大題型分類
- [Can Cisco Respond To Zoom's Challenge In $20B Videoconferencing Market?](https://www.forbes.com/sites/petercohan/2019/03/08/can-cisco-respond-to-zooms-challenge-in-20b-videoconferencing-market) — Zoom 與 Cisco WebEx 的成長速度與席位爭奪數據
- [Cross-Functional Collaboration Interview Questions](https://www.finalroundai.com/blog/cross-functional-collaboration-interview-questions) — Strategy & Execution 題型裡「執行」那一半常考的跨部門協作題庫，適合搭配今天的策略題一起準備

## 參考資料

- [Google Product Strategy Interview Guide (2026)](https://www.tryexponent.com/guides/google-product-strategy-interview) — 對應「今日主題」與「今日練習題」的題目出處
- [Can Cisco Respond To Zoom's Challenge In $20B Videoconferencing Market?](https://www.forbes.com/sites/petercohan/2019/03/08/can-cisco-respond-to-zooms-challenge-in-20b-videoconferencing-market) — 對應「今日案例」中 Zoom 與 Cisco 的營收成長與席位數據
- [Zoom's Viral Adoption Through Freemium Access](https://www.markhub24.com/post/zoom-s-viral-adoption-through-freemium-access) — 對應「今日案例」中 Zoom 靠免費版與低摩擦體驗切入飽和市場的背景
