---
title: "Stanford CS224V 第 1 講：用計算思維把會幻覺的 LLM 變成可靠助理"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, conversational-ai, llm, computational-thinking]
lang: zh-TW
type: deep-dive
series:
  name: "Stanford CS224V 導讀"
  order: 2
tldr: "Fall 2025 第一講把 CS224V 的主線定成計算思維：不要期待一次提示解決可靠性，而要把檢索、形式表示、查核與生成拆成可測試的演算法。"
description: "逐段拆解 Stanford CS224V Fall 2025 Introduction：幻覺問題、計算思維、兩階段研究路線、語意剖析與課程地圖。"
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224v-introduction-en)

本文依據[官方 Fall 2025 講義](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf)重建本講；下文的系統設計與講義所報結果，除非在主張處另連原論文，均歸屬這份歷史課程材料。

這是 Stanford CS224V Fall 2025 的第一堂，不是 2026 年改名後尚未公開的 Agentic AI 新課綱。這堂課先給一個很硬的判斷：LLM 即使接上 RAG，仍可能忽略檢索內容、混入參數記憶，或把沒有根據的句子寫得很順。課程的答案不是「換更大的模型」，而是把助理做成一串可以個別檢查的步驟。

## Agenda：這堂課實際走了什麼

講義依序處理四件事：可靠助理的問題定義、計算思維、2022–2025 的通用研究助理成果，以及 2025 年起轉向科學研究助理的路線。最後才把後續課程排成一張地圖：自由文字、資料庫、長文件、知識圖譜、SMT、對話策略、多模態介面與模型訓練。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf))

這個順序很重要。CS224V 不是先列工具，再教你怎麼串；它先問「哪個中間狀態能被檢查」。自然語言問題先由 semantic parser 轉成形式表示，檢索器執行可追蹤的查詢，生成結果再拆成 claims 逐條查核。每一層都能留下失敗案例。

## 計算思維不是叫 LLM 寫程式

投影片拿 [WikiChat 論文](https://aclanthology.org/2023.findings-emnlp.157/)說明方法：產生前先形成查詢、檢索並過濾資料；產生後把回答拆成原子主張，再為每一條找證據並移除不受支持的內容。重點不是七個步驟這個數字，而是把「回答正確」改寫成多個可測試的子問題。

另一條軸是形式語意。資料在關聯式資料庫時，用自然語言直接要求模型回答，會把查詢與生成混在一起；課程主張先轉成 SQL、SUQL、SPARQL 或 SMT 之類的可執行表示。這讓系統能區分「沒有查到」與「模型自己補了一句」。

## Stage 1 到 Stage 2

Stage 1 把這套做法用在通用研究：WikiChat 控制自由文字回答的幻覺，STORM 做多視角的前期研究，SUQL 混合結構化與非結構化查詢，Genie Worksheets 用形式對話狀態建立任務型助理。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf))

Stage 2 的目標更窄也更難：科學研究不只要找資料，還要理解圖表、比較長文件、抽出變數與約束，甚至檢查一份臨床試驗條件是否適用某個病人。第一講只畫出方向，沒有提供一份獨立的新 syllabus；不能把後續研究願景寫成已教完的內容。

## 課程先從產品可靠性問題出發

第一講用 conversational assistant 的產品情境把可靠性問題說得很具體：一個看似大多數時候答對的系統，若在訂位、醫療資訊或資料分析時仍會亂答，就不能只用平均正確率包裝成「可用」。使用者也無法事先知道哪一題落在錯誤的那一側。這使得 reliability 不只是把 benchmark 再推高幾點，而是要能知道某次回答用了什麼資料、哪一步可能出錯，以及失敗時能不能安全停止。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf))

投影片把 LLM 的能力與缺口並列。模型很會讀寫自然語言，也能靠 few-shot prompting 快速適應格式；可是它不保證遵守資料庫 schema、不保證每個生成主張都由 evidence 支持，也不天然擅長多步 composition。CS224V 因此把「讓模型更會聊」和「讓系統更可靠」分成兩件事。後者需要演算法、表示與 evaluation，而不是只需要比較模型版本。

這個產品問題也解釋課名裡的 *Conversational Virtual Assistants*。課程不是只做閒聊 chatbot；助理必須能讀、寫、查資料、維護對話狀態並完成任務。只要其中一項有外部效果，流暢度就不再是最高優先級。第一講後面所有系統都可以看成在回答同一題：如何保留 LLM 的語言彈性，又把不可接受的自由度移出生成器。

## RAG 仍會幻覺，因為檢索與生成是兩個問題

講義刻意先拆掉一個常見捷徑：接上 retrieval 不等於回答有根據。Retriever 可能找錯文件、只找到部分需要的資料，或因 query 寫得不好而完全漏掉；generator 也可能看見正確 passage 後仍加入 passage 沒說的內容。若只保存最後回答，就無法知道錯在 retrieval recall、document filtering，還是 generation fidelity。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf))

第一講用 WikiChat 的流程說明可測試的切割。輸入對話先轉成獨立 query；檢索結果要過 relevance filtering；候選回答生成後再拆 claims；每一條 claim 重新搜尋並驗證。這不是說固定七步對所有應用最好，而是示範如何把一個模糊的「RAG 應該少幻覺」改成多個能建立測試集的介面。

同一原則也適用於資料庫。若語言直接進 LLM、答案直接出 LLM，schema error 與語言生成混在一起；若先產生 SQL 或 SUQL，就能執行、檢查空結果、比較 result set，再決定怎麼表達。形式表示在課程中不是為了追求漂亮理論，而是為了讓系統能留下 evidence trail。

## 課程地圖其實是四種資料與兩種控制

第一講後半列出的系統很多，但可以用資料形態重新整理。自由文字線包含 WikiChat、STORM 與長文件分析；結構化線包含 SQL、資料庫與 enumerated values；混合資料線由 SUQL 處理表格欄位與文字欄位；知識與約束線則是 SPARQL、knowledge graph、propositional logic 與 SMT。每種資料都需要不同的 intermediate representation，不能把所有問題都縮成 vector search。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf))

另一個維度是控制。Task-oriented dialogue 需要 formal dialogue state 與 rule-based policy，確保系統只執行允許動作；multimodal app 需要把 voice command、GUI context 與 native output 放在同一個 runtime。前者控制「對話現在走到哪」，後者控制「語言命令在畫面與 API 上實際做了什麼」。兩者都不是靠聊天 transcript 自動維持狀態。

最後一堂 training LLMs 看似偏離系統主線，其實補上底層限制：演算法能約束模型，卻不能讓模型憑空學會沒在資料中出現的表示。課程因此同時保留 model、data 與 system 三層，但主要篇幅放在可檢查的 system design。

## Universal semantic parser 是整門課的長期企圖

投影片把多個任務畫到同一個 semantic-parser 概念下：自然語言可以轉成資料庫 query、自由文字檢索計畫、對話狀態更新、knowledge-graph query 或 logical constraints。共通點不是輸出語言相同，而是 parser 產生一個下游 executor 能理解、能驗證的中間物。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf))

這個企圖也暴露困難。不同 domain 的 schema、ontology 與 actions 不同；同一句「附近」在餐廳查詢是地理條件，在文件檢索可能只是語意相似，在 UI 裡又可能指畫面上的鄰近物件。Universal 不等於一個 prompt 無視 domain，而是希望用共通架構承接 domain-specific representations、retrieval optimizations 與 executors。

投影片還把 semantic parsing 與 LLM 缺乏 composition 並列。模型一次猜完整複雜 query 容易出錯；系統可把 query 拆成較小 fragments、執行並觀察，再逐步組合。後面的 SPINACH 就把這件事做成 agent actions，SMT lecture 則把 reasoning 交給 solver。第一講在這裡埋下的不是某個框架，而是「語言理解與可執行推理分工」的設計原則。

## 評估要對準每一層的失敗

若只看 final answer accuracy，兩個完全不同的錯誤可能拿到同樣分數：retriever 找錯、generator 猜對；或 retriever 找對、generator 加料後答錯。第一講一路提醒 evaluation 也要 computationally decomposed。檢索看 recall/precision 與證據涵蓋；parser 看 formal output 或 execution；對話 agent 看 state update、task completion 與 action validity；生成看 claim support 與 attribution。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf))

Human evaluation 仍然需要，但題目必須明確。「哪個回答比較好」容易只測文筆與自信；「這條 claim 是否由指定 passage 支持」「這次 action 是否符合 worksheet」「這個 UI command 是否在目前 context 正確執行」才對準課程的可靠性目標。自動指標與真人測試不是二選一，而是各自覆蓋不同失敗。

課程也把 deployment 視為研究方法的一部分。真實使用者會問 benchmark 沒想到的問題、改口、提供不完整條件，也會遇到資料更新。把失敗回收到測試集，才能讓 pipeline 的每個元件跟著真實 distribution 修正。這比只在固定 dataset 上換模型更接近 dependable assistant。

## 從第一講推導出的實作檢查表

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

開始做任何助理前，可以先回答六題。第一，外部真相在哪裡：文件、資料庫、knowledge graph，還是使用者目前 UI？第二，自然語言要轉成什麼 intermediate representation？第三，哪個 executor 對它負責？第四，哪些 intermediate artifacts 要留下來供 debug？第五，每層的安全失敗是空結果、要求澄清，還是禁止 action？第六，final response 中哪個主張能連回 evidence？

若這六題只能回答「LLM 會處理」，系統還停在 demo。最小可行版本也不必一次完成整門課：可以先保存 query、retrieved passages 與 claim list；或先把 task actions 限制成三個 typed functions。重點是讓下一次錯誤能增加一條精準測試，而不是只增加一段更長的 system prompt。

反過來，形式化也不是越多越好。閒聊或創意寫作不一定需要 solver；低風險問題可能只需 citation 與拒答。課程提供的是一組可靠性工具，選擇依任務風險、資料形態與可接受失敗而定。這正是第一講所說 computational thinking 的實務版本：先拆問題，再選足以驗證的表示和演算法。

## 第一講留下的三個張力

第一個張力是 generality 與 domain control。課程想做 general conversational assistant，卻反覆依靠 schema、ontology、Worksheet 與 solver。這不是矛盾，而是把 generality 放在共通 architecture，把 correctness 放在 domain representation；真正通用的是「語言轉形式狀態再執行」的模式，不是一份適用所有領域的 prompt。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf))

第二個張力是 automation 與 human-in-the-loop。STORM、WikiChat 與 semantic parser 都試圖自動化大量步驟，但課程仍保留編輯者評估、使用者確認與領域專家。可觀察的中間物讓人類介入變得精準：不用重讀整段 agent reasoning，只需檢查來源、state diff 或 constraint parse。

第三個張力是 accuracy 與 coverage。嚴格刪除所有無法驗證的 claim 會提高 factual precision，卻可能讓答案遺漏；擴大 retrieval 與探索會增加 coverage，也帶來雜訊。後續每個系統都在不同位置做取捨。讀系列時，除了問「準不準」，也要問它犧牲了哪些問題、資訊或互動彈性。

這三個張力比單一 benchmark 更能串起整門課。它們也提醒自學者：不要把每講的系統名稱背成工具清單，而要追蹤哪個自由度被保留、哪個自由度被形式表示收回，以及 evaluation 是否真的量到那個選擇。

## 讀完第一講應該能畫出的架構

最簡版本從左到右是：使用者語言、semantic parser、formal state/query、executor、evidence/result、response generator；旁邊另有 verifier 讀 evidence 與 claims。不是每堂都有全部方塊，但只要少一塊，就要能說明責任移到哪裡。例如純資料庫 agent 可能不需要 claim verifier，因為回答可直接由 result template 產生；研究長文則需要 outline 與 citation store。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf))

再把 evaluation 接到每條箭頭，而不是只接到最後。Parser 有自己的 gold formal representation，executor 有 result tests，verifier 有 entailment examples，response 有 grounding audit。這張圖就是後續十四講的索引。每讀一講，把新系統放回圖上，標出它新增哪個 state、哪個 algorithm，以及它沒有解決什麼，會比背論文名稱更接近課程原本的設計。

## 可以怎麼讀這套課

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

每遇到一個系統，拿紙寫下三欄：輸入、中間的形式狀態、可觀察的失敗。若只能寫「輸入 prompt、輸出 answer」，表示還沒抓到這堂課要的計算思維。後面每講都可以用同一張表追：STORM 的中間物是觀點與大綱，Worksheet 是對話狀態，WikiChat 是檢索文件與原子主張。

## 材料缺口

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

公開資料只有投影片，沒有錄影與完整講者註記；投影片也明示部分內容刻意留給課堂。因此本文只重建可見的論證骨架，不補猜課堂答案。Fall 2025 官網與 2026–27 新課名必須分開看。

## 參考資料

- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [Lecture 1: Introduction](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [Homework 1: DRLite](https://web.stanford.edu/class/cs224v/assignments/CS_224V_HW1.pdf)
- [Homework 2: Genie Worksheets](https://web.stanford.edu/class/cs224v/assignments/CS_224V_HW2.pdf)
