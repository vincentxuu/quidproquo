---
title: "Product Builder 面試日練 — 2026-10-24：Technical PM"
date: 2026-10-24
category: daily
type: digest
tags: [product-builder-interview, daily, technical-pm]
lang: zh-TW
description: "星期六輪到 Technical PM，用 Aced／Exponent 的系統設計五步框架練一道 2026 年真實收錄的面試題：設計 Gemini 回答一個使用者查詢的系統；案例是 Discord 把訊息資料庫從 Cassandra 搬到 ScyllaDB，177 個節點砍到 72 個、p99 延遲從 40 毫秒壓到 15 毫秒的真實遷移故事。"
tldr: "Technical PM 面試裡的系統設計題，考的不是畫得出框和箭頭，而是會不會先把範圍問清楚、再把使用者旅程拆成需求、點名『準確、速度、隱私』這類系統屬性，最後自己主動講出取捨——這是 Aced 2026 年技術 PM 指南整理的五步順序，跟上禮拜練過的 RFC／決策矩陣是同一種紀律的兩種用法。今天的練習題是『設計一個系統，讓 Gemini 回答使用者的一個查詢』，拆解重點在於要不要先做 RAG 檢索、檢索加的延遲值不值得換來的事實正確性。案例是 Discord 把訊息資料庫從 Cassandra 遷到 ScyllaDB 的真實故事：177 個節點砍到 72 個，p99 延遲從 40 毫秒級壓到 15 毫秒，而驅動這個決定的不是『新技術比較潮』，是維運痛苦累積到門檻之後，工程主管怎麼量化痛苦、估算遷移成本、最後拍板換掉撐了五年的系統。"
series:
  name: "Product Builder 面試日練"
  order: 66
---

> 🌏 [English version](/posts/daily/2026-10-24-product-builder-interview-daily-en)

## 今日主題

星期六輪到 Technical PM。這類題最容易讓人緊張的地方，是面試官丟出一句「設計一個系統」，聽起來像在考工程師的系統設計，但面試官真正要看的，是候選人會不會先把一個模糊的需求收斂成可以動手的範圍，再用系統屬性（速度、準確度、隱私）把取捨講清楚，而不是急著畫出一張看起來很厲害的架構圖。2026 年的額外變數是：AI 相關題目已經不是獨立的一類，而是混進一般的系統設計題裡——問「設計一個系統讓 Gemini 回答查詢」時，候選人要同時懂傳統的系統設計語言（快取、延遲、擴展），也要懂 RAG、上下文窗口、幻覺這些 AI 特有的取捨。

## 核心框架速記

**系統設計五步順序**（整理自 Aced／Exponent 2026 年技術 PM 面試指南）：大多數候選人輸在順序，不是輸在知識量——從一句話的需求直接跳到畫架構圖，設計出來的往往是「看起來合理但答錯題」的系統。

| 步驟 | 要做的事 | 容易漏掉的點 |
|------|---------|-------------|
| 1. 釐清與定範圍 | 問使用者是誰、他們在做什麼、規模／延遲／資料敏感度這類限制，問完要自己總結一次再動手 | 跳過這步，直接假設題目的隱含條件 |
| 2. 從使用者旅程推需求 | 把使用者會經過的每一步寫下來，每一步對應一個系統需求；一個元件如果對不到任何需求，大概就不該出現 | 為了顯得完整，放進用不到的元件 |
| 3. 點名系統屬性 | 明確說出這個系統要優化的是速度、準確度、可靠度還是隱私——同樣的需求，屬性不同，設計長得完全不一樣 | 只在腦子裡想，沒有講出口，面試官聽不到就當沒想過 |
| 4. 畫架構 | 畫出元件、每個元件做什麼、資料怎麼流，停在「方框加箭頭」的高度，不要掉進寫程式細節 | 畫太細，時間耗在不重要的角落 |
| 5. 主動講取捨 | 不等面試官問，自己說「如果規模再放大一倍，我會擔心什麼、會換什麼」 | 等著被問，顯得是被動補充而不是主動判斷 |

這套順序跟上禮拜 Technical PM 練的「RFC → 決策矩陣 → ADR」是同一種紀律的兩種用法：RFC 那套用在工程團隊內部有分歧、要收斂決策的場景；這套五步順序用在面試現場從零設計一個系統的場景——核心都是「先把判斷標準講清楚，再讓結論站得住腳」。

## 今日練習題

### 題目

「設計一個高階系統，讓 Gemini 回答使用者的一個查詢。」

（來源：Aced／Exponent 技術 PM 面試題庫，收錄為 Google 面試中出現過的系統設計題）

```diagram
title: Gemini 回答使用者查詢的推論流程
desc: 查詢先過安全政策把關，視資料是否即時或機密決定要不要做 RAG 檢索，再進模型推論與輸出防護，最後逐 token 串流回使用者。
caption: 簡化示意，整理自 Aced／Exponent 技術 PM 題庫「設計 Gemini 回應使用者查詢系統」的建議答法；省略 logging／evals 與重試路徑。
---
<svg viewBox="0 0 780 240">
  <path class="dg-line" d="M120 68H150" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M280 68H310" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M440 68H470" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M600 68H630" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M695 100V144Q695 152 687 152H78Q70 152 70 144V100" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="20" y="40" width="100" height="56" rx="6"/>
  <text class="dg-label" x="70" y="68" text-anchor="middle" dominant-baseline="central">使用者</text>

  <rect class="dg-box" x="150" y="40" width="130" height="56" rx="6"/>
  <text class="dg-label" x="215" y="58" text-anchor="middle" dominant-baseline="central">Gateway</text>
  <text class="dg-sub" x="215" y="78" text-anchor="middle" dominant-baseline="central">安全政策檢查</text>

  <rect class="dg-box dg-box--store" x="310" y="40" width="130" height="56" rx="6"/>
  <text class="dg-label" x="375" y="58" text-anchor="middle" dominant-baseline="central">Retrieval</text>
  <text class="dg-sub" x="375" y="78" text-anchor="middle" dominant-baseline="central">RAG 視需要</text>

  <rect class="dg-box dg-box--accent" x="470" y="40" width="130" height="56" rx="6"/>
  <text class="dg-label" x="535" y="58" text-anchor="middle" dominant-baseline="central">Inference</text>
  <text class="dg-sub" x="535" y="78" text-anchor="middle" dominant-baseline="central">模型推論</text>

  <rect class="dg-box" x="630" y="40" width="130" height="56" rx="6"/>
  <text class="dg-label" x="695" y="58" text-anchor="middle" dominant-baseline="central">Guardrails</text>
  <text class="dg-sub" x="695" y="78" text-anchor="middle" dominant-baseline="central">輸出防護</text>

  <text class="dg-edge" x="383" y="142" text-anchor="middle" dominant-baseline="central">逐token串流</text>

  <line class="dg-rule" x1="20" y1="190" x2="760" y2="190"/>
  <text class="dg-tag" x="20" y="212" dominant-baseline="central">圖例</text>
  <rect class="dg-box dg-box--store" x="90" y="204" width="16" height="16" rx="3"/>
  <text class="dg-small" x="114" y="212" dominant-baseline="central">外部資料檢索</text>
  <rect class="dg-box dg-box--accent" x="280" y="204" width="16" height="16" rx="3"/>
  <text class="dg-small" x="304" y="212" dominant-baseline="central">核心推論節點</text>
  <path class="dg-line dg-line--dashed" d="M470 212H500"/>
  <text class="dg-small" x="508" y="212" dominant-baseline="central">虛線＝選配或串流回應</text>
</svg>
```

### 拆解思路

1. **釐清問題**：先問面試官「使用者的查詢大概是什麼類型——需要即時或私有資料，還是模型本身知識就夠回答？」「對延遲的容忍度多高？」這題最容易一開口就講錯的地方，是沒先確認這次查詢要不要走檢索，就直接畫出一套固定的管線。
2. **定義使用者旅程**：使用者打字送出查詢 → 等待回應 → 讀到答案 → （可能）追問或回報答案有問題。每一步都要能對到後面架構裡的一個元件，對不到的元件就該拿掉。
3. **點名系統屬性**：這題的屬性排序通常是「事實正確性優先、其次是延遲、再其次是成本」——因為錯誤的自信回答比慢一點的回答傷害更大，這個排序會決定要不要加檢索、要不要加引用來源。
4. **畫架構**：查詢先過一道安全與政策檢查的 gateway；如果答案依賴即時或私有資訊，就先做一次 RAG 檢索把相關內容抓進來；檢索結果（或原始查詢）連同 prompt 送進模型推論；輸出再經過防護與後處理（例如附上引用來源、擋掉違規內容）；最後逐 token 串流回使用者，讓使用者感覺到反應快。外圍再接 logging 和離線評測，用來追蹤品質、抓回歸。
5. **主動講取捨**：自己先點出——檢索會拉長延遲、增加成本，但能大幅降低幻覺；串流能改善「感覺上的速度」，但不會改變總耗時；如果規模再放大，會優先擔心檢索這一步的吞吐量，而不是模型推論本身。

### 範例回答（面試時可以這樣講）

> **先把範圍收斂**：「在設計之前，我想先確認幾件事——這個查詢預設是一般性的問題，還是常常需要查到使用者自己的資料或今天剛發生的事？如果後者比較多，我會把『檢索要不要做、什麼時候做』當成整個設計的第一個分岔點，而不是事後補的功能。」
>
> **點名屬性再畫架構**：「假設確認下來，大部分查詢都可能牽涉到需要即時或私有的資訊，我會把『正確，勝過快』當成第一優先。架構上，查詢先過一個做安全與政策檢查的 gateway，擋掉明顯違規或高風險的輸入；再視內容決定要不要跑一次檢索，把相關文件或資料抓進上下文；檢索結果和原始查詢一起送進模型做推論；輸出再過一層後處理，包含附上來源引用、擋掉違規內容，最後用串流逐字送回使用者，讓使用者馬上看到反應在跑，而不是空等幾秒。」
>
> **主動收斂取捨**：「我會提醒自己三個取捨：檢索這一步會加延遲、加成本，但換來的是回答能被追溯來源、幻覺率下降，這筆帳在正確性優先的設定下是划算的；串流只改善使用者『感覺』的速度，不改變系統實際耗掉的總時間，所以不能拿它取代真正的效能優化；如果流量再放大十倍，我第一個擔心的會是檢索步驟的吞吐量，因為它牽涉外部資料來源，比模型推論本身更容易卡住。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有先問清楚查詢類型與延遲容忍度，再動手設計 | |
| 有明確點名這題優先的系統屬性（正確性／延遲／成本） | |
| 架構圖裡每個元件都對得到使用者旅程的一步 | |
| 有講清楚「要不要檢索」這個分岔點怎麼判斷 | |
| 有自己主動丟出取捨，不是等面試官問才補 | |
| 加分項：提到規模放大十倍時第一個會擔心的環節 | |

## 今日案例

**Discord：把訊息資料庫從 Cassandra 搬到 ScyllaDB**

Discord 工程師 Bo Ingram 在 2023 年的工程部落格裡，詳細記錄了這個遷移決定。2017 年 Discord 用 12 個 Cassandra 節點存了數十億則訊息；到 2022 年初，同一套資料庫長成 177 個節點、存著數兆則訊息，但變成一個「高維運痛苦」的系統——on-call 被頻繁叫起來處理延遲飆高，壓縮（compaction）積壓導致連鎖延遲，團隊甚至有個戲稱「gossip dance」的固定動作：把節點拉出叢集讓它慢慢壓縮，再放回去接流量，重複到壓縮積壓清空。真正讓團隊下決定遷移的，不是「新技術比較潮」，是維運成本量化到一個門檻之後，才值得承擔一次牽涉數兆則訊息的遷移風險。

遷移本身也是一次「先講取捨再動手」的示範：團隊原本打算用舊的 Spark migrator 搬資料，估出來要三個月；團隊認為太慢，改用 Rust 重寫一套遷移工具，新估計只要九天，最後實際只花了九天多就把所有資料搬完，過程中沒有停機。遷移完成後，叢集從 177 個 Cassandra 節點縮到 72 個 ScyllaDB 節點，抓取歷史訊息的 p99 延遲從 Cassandra 的 40–125 毫秒壓到 ScyllaDB 穩定的 15 毫秒，寫入的 p99 延遲也從 5–70 毫秒降到穩定 5 毫秒。

**面試連結**：這個案例最適合用在「什麼時候該砍掉重練一個撐了五年的系統」這類技術 PM 題——重點不是搬去哪個資料庫，而是示範怎麼把「維運痛苦」轉成可以量化、可以拿去向工程團隊和主管證明遷移划算的數字，以及遷移計畫本身也要像產品一樣先估時間、發現不夠快就換做法，而不是硬著頭皮照原計畫跑三個月。

## 延伸閱讀

- [30+ Technical Product Manager Interview Questions (2026 Guide)](https://www.aced.io/blog/technical-product-manager-interview-questions) — 今天的題目與系統設計五步框架出處，收錄了 AI／ML、系統設計、技術基礎、技術產品直覺四大類的真實面試題
- [How Discord Stores Trillions of Messages with High Performance](https://blog.bytebytego.com/p/how-discord-stores-trillions-of-messages) — ByteByteGo 用系統設計面試的角度重新拆解這次遷移，適合搭配今天的練習題一起看
- [How Discord Moved Trillions of Messages to ScyllaDB](https://www.hellointerview.com/learn/system-design/in-the-wild/discord-messages-scylladb) — Hello Interview 把這個案例整理成系統設計面試常考的「真實世界案例」教材

## 參考資料

- [30+ Technical Product Manager Interview Questions (2026 Guide)](https://www.aced.io/blog/technical-product-manager-interview-questions) — 練習題題目、系統設計五步框架、Gemini 查詢系統的建議答法
- [How Discord Stores Trillions of Messages](https://discord.com/blog/how-discord-stores-trillions-of-messages) — Discord 官方工程部落格，今日案例的節點數、延遲數字與遷移時程一手來源
