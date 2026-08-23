---
title: "Stanford CS224V 第 8 講：SLIDERS 如何用自動 schema 分析一整組長文件"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, long-context, information-extraction, sliders]
lang: zh-TW
type: deep-dive
series:
  name: "Stanford CS224V 導讀"
  order: 9
tldr: "SLIDERS 不讓模型直接吞完所有長文件，而是從問題誘導 schema、做語意切塊與情境化擷取、協調重複列，再用 SUQL 查詢產生答案。"
description: "CS224V Long-Document QA：訓練與切塊路線、SLIDERS schematization、semantic chunking、contextualized extraction、reconciliation 與初步評估。"
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224v-long-document-qa-en)

本文依據[官方 Fall 2025 講義](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf)重建本講；下文的系統設計與講義所報結果，除非在主張處另連原論文，均歸屬這份歷史課程材料。

第八講把問題規模拉到「一組長文件」：比較公司年報、病歷、新聞事件或發票時，答案可能散在不同段落與文件。單純增加 context window 沒有解決跨文件整合，也沒有提供可查詢的中間狀態。SLIDERS 把文字轉成為問題量身打造的表格。

## Agenda：從兩條路線到 SLIDERS

講義先比較 training-based 與 chunking-based 方法，再列出切塊的三個難題：每塊如何表示、邊界切斷語意怎麼辦、大量局部輸出如何整合。接著逐層建立 SLIDERS：schematization、semantics-driven chunking、contextualized extraction、reconciliation、SUQL querying，最後展示 preliminary evaluation。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

## 自動 schema 先決定要抽什麼

傳統 map-reduce 常讓每塊產生摘要，最後再把摘要交給模型。文件一多，摘要本身又變成超長輸入，而且早期遺漏無法追回。SLIDERS 先從使用者問題誘導欄位 schema，再讓每個相關 chunk 輸出一列結構化資料。問題若要比較公司的股份數與日期，欄位就圍繞公司、數值、日期與來源位置，而不是做泛用摘要。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

## Training-based 與 chunking-based 是兩種成本分配

Training-based 方法嘗試讓模型學會長 context 或特定文件任務，推論時可以直接處理更大輸入。它把成本放在資料、訓練與模型能力，適合任務重複且有標註；新問題、新 domain 或超出 context 的文件仍可能需要重新訓練或改 architecture。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

Chunking-based 方法不改 base model，把文件切開逐塊處理，再合併局部結果。它能平行、能使用現成模型，也容易保存每塊 provenance；代價是 chunk boundaries 與 reduction。Lecture 沒宣稱其中一條普遍勝出，而是把 SLIDERS 放在「有限 context、問題導向分析」的 chunking 路線。

常見 running summary 讓每塊讀前一輪摘要，再更新摘要。它的 context 小，卻有順序依賴；早期資訊被壓掉後不會回來，後面錯誤也會累積。另一種每塊輸出 structured record，再用 database 聚合，較容易查核，但要求先有 schema。SLIDERS 的創新重點就在自動誘導 schema 與後續 reconciliation。

## Schematization 把問題改寫成資料模型

使用者問「比較每家公司在不同報告中的 shares outstanding 與變動原因」，schematizer 要產生公司、報告日期、數值、單位、原因、來源等欄。每個欄位需要型別與描述，讓 extraction 在所有 chunks 使用同一契約。Schema 太泛會得到長段摘要，太窄則漏掉答案必要資訊。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

一題一 schema 能對準問題，但大量問題會重複抽取。講義討論 multi-question schematization：把相近問題合成較穩定的 domain schema，一次 extraction 支援多個 queries。Domain expert 也可修改自動 schema，補上模型不知道的欄位依賴與單位規則。

Schema evolution 要保留版本。新增欄位時可對既有 chunks 補抽；修改欄義時舊 rows 可能不再相容。若 final answer 沒記 schema version，就無法知道不同批次資料是否真的可比較。

## Fixed-size chunking 的具體破壞

固定 token window 可能把表格 header 留在上一塊、數值放在下一塊；也可能把段落中的主詞與後續代名詞拆開。Overlap 能減少邊界遺漏，卻會製造重複 extraction，增加 reconciliation 負擔。文件越多，這些小錯會累積成大量 rows。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

Semantics-driven chunking 先辨識 paragraph、table、section 等 logical units，再組成長度相近且 self-contained 的 chunks。Lecture 的示意加入 line number 與 table outline，讓抽取器知道片段在文件的位置與結構。這不是單靠 embedding similarity 可以取代的資訊。

評估 chunker 不能只算平均長度。應建立 boundary cases：跨頁表格、標題加清單、註腳、延續段落與多欄版面，檢查一個 answer-bearing unit 是否被完整保留。Chunk quality 最終也要連到 extraction recall。

## Contextualized extraction 如何補局部視野

每個 chunk 獨立處理時，模型不知道公司、報告期間或欄位定義。SLIDERS 為 chunk 加入 schema、document context 與相關 chunks，讓同一句數值能被正確歸屬。先用 lightweight model 判斷 relevance，無關 chunk 就不呼叫昂貴 extraction。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

Extraction 輸出 JSON row，並保留 row_id、chunk number 與 source span。當資料不存在時應輸出 missing，而不是從其他 context 猜值。欄位型別與 allowed format 能減少後續 reconciliation 的表面差異，例如日期格式與數字單位。

相關 context 也有風險：加入太多鄰近 chunks 會讓模型把別段數值填進當前 row。Trace 應區分 primary evidence 與 supporting context，最終 provenance 不能只指向整份文件。

## Reconciliation 是 map-reduce 裡真正的 reduce

Overlap、重複提及與跨文件引用會產生多列同一事實。簡單 `SELECT DISTINCT` 只能去掉完全相同字串，無法合併單位不同、名稱別名或一列缺欄的 records。Reconciliation 要判斷 entity/event identity，再依來源與完整度合併。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

衝突不能一律覆蓋。不同報告日期的 shares 本來就不同；同日不同數值才可能是 extraction 或來源衝突。Schema 必須包含 temporal/provenance keys，reconciler 才知道差異是合法 dimension 還是 disagreement。

可逆性很重要。Merged row 要保留 parent rows 與 merge decision，讓 reviewer 能拆回原始 extraction。若用 LLM 直接生成一列「綜合答案」而丟掉 parents，SLIDERS 的可查核優勢就消失。

## SUQL 在最後一段扮演什麼角色

完成 reconciled table 後，原始自然語言問題由 semantic parser 轉成 SUQL。結構化欄位負責 filter、group、sort 與 comparison；仍保留自由文字的欄位可用 `answer` 或 `summary`。Final generation 不需重新讀全部文件，只讀 query results 與必要 source spans。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

這也支援追問。使用者把「所有公司」改成「只看 2024 年」時，可以重跑 query，不必重做 extraction；問到 schema 沒有的新概念時，系統才需要 schema update 與 targeted re-extraction。將昂貴處理與互動 query 分開，是文件集分析可用的關鍵。

## Preliminary evaluation 應該怎麼讀

Lecture 明寫 preliminary，意味著 pipeline 與 benchmark 都仍在研究。結果可支持「這些部件值得繼續測」，不能支持 production readiness。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

> **本文延伸：** Production readiness 應另驗 schematization／reconciliation 人工品質、跨文件泛化、成本與 latency；這是本文的驗收建議。

評估應逐層建立 gold：問題需要的 schema fields、answer-bearing chunks、expected rows、duplicate groups、gold query 與 final answer。只看最終 QA 會讓多個元件互相補償，也無法知道改善 chunking 是否真的提升 extraction。

文件集大小也要分層。十份短報告成功，不代表一萬份長文件；局部 extraction 可平行，但 rows、reconciliation 與 query table 仍會成長。報告應包含 documents、chunks、relevant rate、rows、calls、tokens 與 wall time。

## 實作一個可驗證的 miniature

準備五份同型文件與三個比較問題，人工定義 gold fields 與 answer spans。先用 logical-unit chunker，不做 embedding retrieval；再產生 question-specific schema，逐塊 relevance/extraction，所有 row 保存 source。人工 review 後才寫 reconciliation rules。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

接著把三題轉成 SQL/SUQL，確認答案只使用 reconciled rows。建立 ablation：fixed-size vs semantic chunks、無 context vs contextual extraction、distinct vs reconciliation。每個變體不只比答案，也比漏 row、錯 merge 與 calls。

最後測新問題。如果 schema 足夠就只重跑 query；不足時記錄新增 field 與需重抽的 chunks。這個實驗能直接量到 automatic schematization 的 amortization，而不是只展示一次漂亮回答。

## Provenance 必須一路穿過 table

每個 extracted cell 不只需要 row-level source。若一列的公司名來自頁首、數值來自表格、原因來自後段文字，三個 fields 應各有 source span。只把整列連到一個 chunk，reviewer 仍要重新找證據，也無法知道 reconciliation 是否把不同事件拼在一起。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

Final query 做 aggregation 時，provenance 也要聚合。例如回答「哪些公司連續兩年增加」來自多列比較，citation 應能展開到各年份 rows，而不是只連一份報告。Database representation 讓計算清楚，但 renderer 還要把 relational derivation 轉成讀者可查的 evidence chain。

## 文件權限與增量更新

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

企業文件集常有不同 ACL。Extraction table 若把所有 rows 放同一索引，query 可能透過 aggregate 或 summary 洩漏使用者無權看的文件。每列要帶 document ACL，query executor 在 aggregation 前過濾；只在最後隱藏 citation 不足以防洩漏。

新文件加入時可以只做 chunk、extract、reconcile 的增量流程，不必重跑全 corpus；但 reconciliation rule 或 schema 變更可能要求 backfill。保存 pipeline/version 與 lineage，才能判斷哪些 rows 需要重算。這些 operational state 是把 preliminary research system帶到可維護服務時不可缺的部分。

## 切塊不是固定 token 數

固定大小可能把表格、段落或定義拆開。Semantics-driven chunking 盡量保留邏輯單位，並附上文件結構。Contextualized extraction 先判斷 chunk 是否相關，再把鄰近資訊或文件背景提供給抽取器，避免每塊孤立解讀。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

獨立處理仍會產生重複或互相矛盾的 rows，因此 reconciliation 必須合併同一事件、保留來源位置並處理欄位差異。完成後，問題由 semantic parser 轉成 SUQL，在表格上做篩選、比較，必要時再讀文字欄位。

## 這套設計解決的是可整合性

SLIDERS 的優勢不只是能放更多 token，而是把每份文件的局部證據變成一致 rows。中間表能人工抽查、重新查詢，也能讓新問題重用已抽資料。不過 schema 太貼單一問題會增加每題重抽成本；講義也提出跨問題共用 schema 或由領域專家改善的方向。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

## 可以怎麼試

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

拿三份同類報告與一個比較問題，先手寫五欄 schema。逐段抽取時保留 `document_id`、`chunk_id` 與原文；完成後找出重複 row、缺欄位與跨 chunk 才能理解的案例。先把 reconciliation 規則寫清楚，再生成答案。

## 材料缺口

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

講義明稱 preliminary evaluation，沒有足夠資訊把結果視為成熟 production benchmark；公開資料也沒有完整 pipeline code、成本分析或課堂錄影。本文保留這個研究階段的限制。

## 參考資料

- [Lecture 8: Question Answering on Sets of Long Documents](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf)
- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [Lecture 7: SUQL](https://web.stanford.edu/class/cs224v/lectures/l-suql.pdf)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
