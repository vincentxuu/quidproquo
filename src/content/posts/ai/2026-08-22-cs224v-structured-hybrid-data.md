---
title: "Stanford CS224V 第 6 講：資料庫 Agent 為什麼要先做語意剖析"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, semantic-parsing, database, hybrid-retrieval]
lang: zh-TW
type: deep-dive
series:
  name: "Stanford CS224V 導讀"
  order: 7
tldr: "結構化資料 agent 的可靠路線是把自然語言轉成可執行查詢、處理 schema 與列舉值，再把 query execution 和回答生成分開評估；混合資料則要先判斷該走資料庫還是文字檢索。"
description: "拆解 CS224V Structured and Hybrid Data：NL-to-SQL、schema、列舉值、執行式評估，以及文字、表格與知識圖譜的混合檢索。"
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224v-structured-hybrid-data-en)

本文依據[官方 Fall 2025 講義](https://web.stanford.edu/class/cs224v/lectures/l-db-hybrid-intro.pdf)重建本講；下文的系統設計與講義所報結果，除非在主張處另連原論文，均歸屬這份歷史課程材料。

第六講把資料來源從自由文字換成資料庫。這時「把相關內容塞進 context」不是主要問題；真正的門檻是把使用者條件翻成精確查詢，並確定查詢真的符合 schema。這堂仍屬 Fall 2025 的 Conversational Virtual Assistants，不是 2026 改名後的新課綱。

## Agenda：結構化查詢與混合檢索

講義先定義關聯式資料庫、schema 與 NL-to-SQL semantic parsing，接著處理少量與大量 enumerated values、空結果和評估陷阱。後半把問題擴到文字、表格與 Wikidata，討論 query classification、retrieve-and-read，以及多來源組合。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-db-hybrid-intro.pdf))

## Semantic parser 把語言變成可執行假說

使用者說「Palo Alto 的日本餐廳」，parser 要知道地點是哪一欄、`japanese` 是否應與 cuisines 陣列比對，以及大小寫與型別。SQL 不只是答案的中間格式，也是可檢查的假說：執行失敗、回傳空集合或篩錯資料，各自有不同修法。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-db-hybrid-intro.pdf))

小型列舉值可以放進 schema description；選項多到無法全塞時，講義改用 enum classifier／retriever，先把語言映射到合法值，再交給 parser。這避免模型生成資料庫根本不存在的字串。

## 評估不能只比 SQL 字面

不同 SQL 可能回傳相同結果，字串 exact match 會把正確查詢判錯；反過來，碰巧得到相同結果也可能掩蓋條件錯誤。講義因此強調 execution result、query precision 與人工 spot check。尤其「沒有結果」必須檢查：是資料真的沒有，還是 parser 用錯欄位或列舉值。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-db-hybrid-intro.pdf))

## 先理解資料庫 agent 的完整 dataflow

講義把一個看似簡單的餐廳問題拆成自然語言、schema-aware semantic parser、SQL compiler、DB/API execution、results 與 response。每個介面都保留可檢查物：parser 產生的 formal query、資料庫實際回傳 rows，以及最後回答使用了哪些欄位。這跟直接把 schema 與問題交給 LLM、叫它「回答」有本質差異。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-db-hybrid-intro.pdf))

Schema description 是 parser 的世界模型。它要包含 table/column 名稱、型別、關係、必要註解與少量合法值；卻不能把整個資料庫內容塞進 prompt。描述太少，模型會猜欄位含義；描述太多，重要約束被長 context 淹沒。實作時應版本化 schema prompt，讓 query failure 能對回當時看到的定義。

Formal query 也形成權限邊界。Read-only assistant 可以只允許 `SELECT` 與固定 views；compiler 在送進資料庫前驗 AST、限制 tables、timeout 與 result size。Lecture 著重 QA，但同一原則能避免語意剖析器意外生成 mutation。自然語言彈性不等於資料庫權限也要彈性。

## Few-shot parsing 在 small schema 為何有效

當 schema 小、domain 固定，prompt 可以放數個 NL-to-SQL examples，讓 LLM 學會本地慣例：陣列欄位用 `ANY`、地理距離用哪個 function、價格區間如何表示。Examples 的價值不是教 SQL 語法，而是示範 schema-specific mapping。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-db-hybrid-intro.pdf))

Example selection 必須覆蓋 operators，而不是只挑語句相似。餐廳題庫至少要有 equality、array membership、range、ordering、aggregation 與 conjunction。若所有 example 都是「找某地某菜系」，模型遇到「評分最高且仍營業」時會把 superlative 或 business status 漏掉。

Few-shot parser 也會把 example 中的 entity value 當模板照抄。測試要特別放 unseen locations、cuisines 與拼字變體，確認系統查合法值而不是憑記憶生成。這直接引到講義對 enumerated types 的長篇處理。

## Enumerated values 是 schema 與資料內容的交界

欄位型別只告訴你 `cuisine` 是文字或陣列，沒有告訴你資料庫使用 `Japanese`、`japanese_food` 還是某個 internal ID。值域只有十個時，可以全部放進 schema description，讓 parser 直接選合法值；值域到幾千個品牌、地點或 product categories 時，這做法不再可行。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-db-hybrid-intro.pdf))

講義提出獨立的 enum classification/retrieval。系統先用使用者詞語搜尋或分類到候選 canonical values，再把候選提供給 semantic parser。若查不到，應回到 clarification 或 no-result diagnosis，不能默默保留原始文字。這個小元件攔下大量「SQL 語法正確、值卻不存在」的錯。

大型 enum 還有一對多與歧義。「台大」可能對應組織 entity 與地點；「中式」可能映射多個 cuisine tags。Classifier 應回候選與 confidence，dialogue agent 必要時詢問。把 ambiguity 壓成唯一值會提高表面完成率，卻讓 query condition 偏離使用者意圖。

## 空結果不是一句抱歉，而是一個診斷分支

SQL 回零列至少有四種原因：資料真的沒有、條件太嚴、enum mapping 錯、semantic parse 錯。若 response 一律說「找不到」，使用者無法修正，開發者也不知道系統問題。Runtime 應保存 query，逐步檢查放寬條件後是否有結果，並在不洩漏敏感資料的前提下提供針對性 clarification。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-db-hybrid-intro.pdf))

講義的 pipeline 在空結果後加入 classify-enum/repair，表示 execution feedback 可以回到 parser。這不是讓 agent 無限改 query；每次 repair 要說明改了哪個條件、候選值從哪裡來，並限制 attempts。否則系統可能為了找到任何 row 而逐步刪光使用者限制。

對 evaluation 而言，empty-result questions 必須刻意收進 dataset。只用保證有答案的題目，會讓 hallucinated fallback 永遠不被測到。Gold 不只是空集合，也包括系統應保留哪些 constraints 與允許提出哪些澄清。

## Execution accuracy、precision 與人工 spot check

Exact SQL match 太嚴，因為 join order、alias 與等價 predicates 可以不同；execution accuracy 較接近使用者結果，卻可能因測試 DB 的偶然內容讓錯 query 過關。例如漏掉城市條件，在目前資料恰好所有日本餐廳都位於同一城市時，result set 仍相同。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-db-hybrid-intro.pdf))

因此講義要求人工 spot check，特別看複雜條件與意外正確案例。更完整的 harness 可對 query 做 mutation：加入會區分正確與錯誤 SQL 的 counterexample rows，再執行一次。這能減少 database state 對 metric 的偶然性。

Query precision 對推薦場景也重要。回傳十家裡只有兩家符合評論條件，即使答案包含一個正確店家，使用者仍要自己過濾。Recall 與 precision 應分開，並檢查 ranking；final answer accuracy 不能取代 result-set quality。

## 從 structured routing 到 hybrid QA

後半講義把來源分成 text、tables 與 Wikidata。Binary classifier 可以先判斷問題主要需要 IR 還是 semantic parsing：查固定欄位走 DB，問評論內容走 textual QA。這種 routing 便宜清楚，但遇到「價格低於某值而且評論說安靜」就需要組合。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-db-hybrid-intro.pdf))

另一條路是從多來源各自 retrieve/read，再讓模型整合。講義展示 text、tables、Wikidata 單獨與組合的 benchmark 結果，目的不是宣稱固定組合永遠最好，而是證明資料互補。實務上要保存 source-specific subqueries 與 answers，避免 final generator 把不同來源混成無法追蹤的句子。

HybridQA 的典型 hop 是先從 table cell 找 entity，再讀 entity 對應 passage；或先從文字抽出值，再回表格比較。若 router 只在開頭選一條路，無法表達這些 sequence。下一講 SUQL 正是把文字函式嵌進 query language，讓跨來源操作保留可執行結構。

## 一套可維護的 database-agent 測試集

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

先從 schema 覆蓋建立題型矩陣：每個欄位、operator、join 與 enum 至少一題，再加入 paraphrase、錯字與未見 entity。每題保存 gold intent、result set、必要 constraints 與允許的等價 query，而不只一條 SQL string。

第二層是 failure cases：合法空結果、無效 enum、ambiguous entity、schema drift、database timeout、超大 result 與 injection-like request。測試應驗證 safe response 和 log artifacts。第三層才是 hybrid questions，明確標每一步需哪種 source、前一步輸出如何成為下一步輸入。

**本文建議：** Production trace 至少包含 schema version、rewritten question、enum candidates、generated query、execution status、row count 與 cited fields。這些資料讓團隊按 root cause 聚合，而不是只看使用者對最後一句按讚或倒讚。

## Schema drift 與資料更新要獨立監控

**本文延伸：** Production database 會新增欄位、改 enum、調整 view 或停用 records。Parser prompt 若仍引用舊 schema，模型可能持續生成語法合法但已無意義的 query。部署時應在 schema hash 變化後先跑 regression corpus，再更新 examples；不要等使用者回報空結果才發現。

資料內容更新也會讓固定 gold answer 過時。測試可分兩層：synthetic fixture DB 用來驗 query semantics，snapshot/live DB 用來驗實際資料與 latency。前者可重現，後者抓 operational drift。兩者混成一套會讓每次 row 更新都看似 parser regression。

Hybrid source 還有不同更新頻率。Table 每小時刷新、文字介紹每月更新、Wikidata 隨時變動時，final answer 必須保留各來源時間。整合器不能把舊 passage 與新 row 寫成同一時點的事實；freshness metadata 應跟 evidence 一起傳到 response。

## 何時不要使用 LLM semantic parser

若 UI 已經有固定 filters，直接送 typed parameters 比把它們轉成自然語言再 parse 更可靠；若 query 只有少量 intents，傳統 parser 或 form 也更便宜。LLM 的價值在使用者表達開放、schema mapping 複雜，而不是所有資料庫入口。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-db-hybrid-intro.pdf))

高風險分析還可採「LLM 提 query、人確認、再執行」。顯示 normalized constraints 通常比顯示完整 SQL 更易懂。Course 的 computational thinking 不要求全自動，而是要求 parse 與 execution 之間有一個可檢查、可阻擋的邊界。

## 混合資料先路由，再組合

有些問題由 SQL 的篩選、排序與聚合解決；有些需要讀評論或段落；另一些必須同時使用表格、文字與知識圖譜。講義比較 binary routing 與多來源 retrieve-and-read，也呈現混合來源可能超過任何單一來源的案例。這不是「全部一起塞」：系統仍要記錄每個子答案來自哪種資料。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-db-hybrid-intro.pdf))

## 可以怎麼實作

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

替一張餐廳表寫十個問題，保存 gold result set，而不是只保存 gold SQL。至少加入同義列舉值、無結果、排序、聚合與需要讀評論的題目。每次失敗先標成 schema、enum、routing、execution 或 generation，再改對應元件。

## 材料缺口

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

投影片是架構與文獻導覽，沒有一份完整參考實作；後半引用的 benchmark 表格也不足以支持跨資料集泛化。公開資料沒有課堂錄影與講者補充。

## 參考資料

- [Lecture 6: Introduction to Agents for Structured and Hybrid Data](https://web.stanford.edu/class/cs224v/lectures/l-db-hybrid-intro.pdf)
- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [Lecture 7: SUQL](https://web.stanford.edu/class/cs224v/lectures/l-suql.pdf)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
- [Lecture 1: course architecture](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf)
