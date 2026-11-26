# Review — 2026-10-22-ai-kb-chunking-indexing（order 16）

- 檔案：`src/content/posts/learning/2026-10-22-ai-kb-chunking-indexing.md`（中）、`-en.md`（英），各 113 行，中英行號一一對應，下文「L37」指中英兩檔的第 37 行。
- 審稿日期 2026-10-22。審稿者：獨立審稿員（沒參與寫作與精讀）。只寫報告，沒有改文章。
- 證據：`.work/research/building-knowledge-bases/extractions/_spotcheck-batch11.md` 第 1–7 節，以及本次回 `scratchpad/fulltext/o16-*` 的追加核對；Kucia 用 `extractions/kucia-2026-synthetic-vs-authentic.md` 第 31–33、54 行。規劃表範圍卡：`.work/series-plans/building-knowledge-bases.md` 的 Order 16。
- 機械檢查：`check-tw-terms` 0 blocking；`check-process-leak` 通過；`scan-ledger` 0 命中；`register-scan` 長句 10 句（約 79 句中 13%）、但書段落 4/37（10%）、引述區塊 0、模板轉折 0。
- 統計：🔴 0、🟡 7、🟢 24。

## post-verify

- 🟢 **MongoDB：換模型要全部重算（L29）**：`o16-mongodb-migrate-embedding.txt` 第 4–5 行 "Embeddings that different models generate aren't comparable" 與 "Regenerate your corpus even when the successor model produces embeddings with the same number of dimensions"。相符。
- 🟢 **Qu：長文件固定切較好、拼接資料語意切勝出（L33）**：Fixed-size Chunker 的定義是「固定句數」（`o16-qu2025-naacl.txt` 第 72–74 行），正文「按固定句數切」正確；拼接資料 breakpoint 勝出、原生長文件 fixed-size 較好，對到 E.5.1 第 660–673 行與正文表格。
- 🟡 **Qu：「換 embedding 的差距比換切法大」原文沒有比較（L33）**
  - 原句：中「他們也發現，換 embedding 模型造成的差距，比換切法還大。」；英 "They also found that switching embedding models made a bigger difference than switching chunking methods."
  - 依據：E.2（第 538–550 行）只說 "The choice of embedding model significantly affected retrieval performance"，stella 比 bge-large 平均高 7.44%；全文沒有拿這個差距和切法之間的差距比大小。
  - 改法：中「他們也發現，換 embedding 模型對檢索的影響很明顯：同樣的切法，最好的模型比次好的平均高 7%。」；英 "They also found that the embedding model mattered a lot: with the same chunking, the best model beat the next one by about 7% on average."
- 🟢 **Bennani：句子≈語意＞固定 token（L35）**：F2 第 115–121 行 "sentence ≈ semantic > token ≫ code"，圖 2 右（C = 5k）sentence 0.606、semantic 0.609、token 0.599。「略好」用詞恰當。
- 🟢 **Bennani overlap 數字（L37）**：F1 第 109–115 行原文是「adding 10–20% overlap」，|ΔBERTScore| ≤ 0.004；「多四分之一」是 r = 0.2 時的公式 1/(1 − r) = 1.25×。正文寫「加了 20%」、「段落數多了四分之一」可接受。可選精確化：中「加了 10% 到 20% 的 overlap，分數幾乎沒變；以 20% 算，段落數會多四分之一」；英 "adding 10–20% overlap barely changed scores, and at 20% the number of chunks grows by a quarter"。
- 🟡 **Chroma 不是「相反的結果」，主設定下跟 Bennani 同方向（L37）**
  - 原句：中「但 Chroma 2024 年的技術報告看到相反的結果：用小的 embedding 模型、按固定 token 數切時，有 overlap 的召回率比沒有的高」；英 "But Chroma's 2024 technical report saw the opposite: with a small embedding model and fixed-token chunking, recall was higher with overlap than without"。
  - 依據：`o16-chroma2024.txt` 主表（text-embedding-3-large，第 318–331 行），同大小時不重疊的召回略高（Recursive 400：89.5 對 88.1；TokenText 400：89.2 對 88.6）；overlap 明顯提高召回只在 MiniLM＋TokenText（250/125 為 82.4、250/0 為 77.1，第 345–356 行），同模型的 Recursive 幾乎沒差（78.7 對 78.5）。寫成「相反」，讀者會以為 Chroma 整體推翻 Bennani。
  - 改法：中「Chroma 2024 年的技術報告大致也是這樣：用 OpenAI 的大模型時，不重疊的召回反而略高；只有換成小的 embedding 模型、又按固定 token 數切時，有 overlap 的召回才明顯較高（82.4% 對 77.1%）」；英 "Chroma's 2024 technical report mostly agrees: with OpenAI's large model, no overlap had slightly higher recall; only with a small embedding model and fixed-token chunking did overlap clearly raise recall (82.4% vs 77.1%)"。
- 🟢 **OpenAI 預設 800/400（L37）**：第 335 行 "slightly below-average recall and the lowest scores across all other metrics"，作者假設用的是 TokenTextSplitter。正文正確。可選：補「其他指標都是最低」更有說服力，中「召回略低於平均，其他指標都是最低」；英 "slightly below-average recall and the lowest scores on every other metric"。
- 🟢 **Qu「先按章節切」（L39）**：第 619–621 行 "simply splitting the document into structured sections before applying fixed-size chunking will solve this issue"，指的是固定切法把不同文件混在同一塊這一個問題。「常常」略寬，可選改：中「Qu 等人在分析錯誤時也提到，固定切法把不同文件切進同一段的問題，先按章節切就能解決」；英 "Qu and colleagues also noted, while analyzing errors, that fixed splitting's habit of mixing different documents into one chunk is solved by splitting by section first"。
- 🟡 **DAT 的 57／76／81 是「正確段落排第一」，不是「答對」（L8、L45）**
  - 原句：tldr 中「只用向量搜尋第一名答對 57%，關鍵字搜尋 76%，兩者混合 81%」；L45 中「第一名就答對的比例」；英 tldr "vector search alone got the top result right 57% of the time"。
  - 依據：表 3（`o16-dat2025.txt` 第 414–422 行）的指標是檢索 Precision@1：DRCD 上 Dense（text-embedding-3-large，第 356 行）0.5743、BM25 0.7630、Fixed Hybrid（α = 0.6）0.8113。數字正確；「答對」會被讀成回答正確率，tldr 又是讀者先看到的地方。
  - 改法：tldr 中「只用向量搜尋時，正確段落排第一的比例是 57%，關鍵字搜尋 76%，兩者混合 81%」；L45 中「正確段落排在第一名的比例」；英 tldr "vector search alone ranked the right passage first 57% of the time, keyword search 76%, and the two combined 81%"；L45 英文 "the share of questions whose top result was right" 可留，或改 "whose correct passage ranked first"。
- 🟢 **DAT 作者、資料與模型（L45）**：政治大學（第 10 行）、DRCD 是繁中閱讀理解資料集（第 307 行）、向量模型是 OpenAI text-embedding-3-large。相符。可選：混合的 α 是作者在這份資料上挑出的最佳固定值，中「兩者以固定比例混合 81%」；英 "a fixed-weight combination 81%"。
- 🟢 **KAP：OCR 髒時 BM25 勝混合（L47）**：表 3–5 基線 P@1 BM25 41.51、Hybrid 38.98、Dense 32.10；KAP 後 Hybrid 59.73 最高。資料是玉山銀行競賽的財報（第 160–170 行），"scanned financial documents"（第 85 行）。「同一團隊」：兩篇都是政大 Hsu 與 Tzeng。正確。
- 🟢 **Kucia 的方向與條件（L49）**：紀錄第 33 行，同一個 Qdrant 裡 hybrid 0.527、dense 0.545，延遲 1.7 倍。「沒有比純向量準，卻比較慢」正確，也沒有誤用 8 倍。
- 🟡 **C-Pack 少了時間條件，讀者會以為 OpenAI 的模型現在中文也差（L55）**
  - 原句：中「OpenAI 的 text-embedding-ada-002 得分 52，他們自己的 BGE-large 得分 71.5……要注意兩件事：評測基準和 BGE 模型出自同一個團隊；資料是簡體中文，沒有繁體中文。」；英 "OpenAI's text-embedding-ada-002 scored 52 and the team's own BGE-large scored 71.5 … Two caveats: …"
  - 依據：52.00／71.53 對到表 3 第 417、422 行（與紀錄的表 2 相同）。但這是 2023–2024 的比較，ada-002 是舊一代模型；作者在腳註 1（第 126 行）自己寫 "This situation has been substantially improved since our work."。要讓讀者拿走的是「模型之間差距可以很大」，不是「OpenAI 中文差」。
  - 改法：把兩件事改成三件，中「要注意三件事：這是 2024 年的比較，ada-002 已是舊一代模型，作者也註明之後中文 embedding 進步很多；評測基準和 BGE 出自同一個團隊；資料是簡體中文，沒有繁體中文。」；英 "Three caveats: this is a 2024 comparison, ada-002 is an older-generation model, and the authors note Chinese embeddings have improved a lot since; the benchmark and BGE come from the same team; and the data is Simplified Chinese, with no Traditional Chinese."
- 🟡 **自我檢查替 DAT 加了「專有名詞多」（L98）**
  - 原句：中「繁中的研究也看到，關鍵字搜尋在專有名詞多的資料上勝過純向量」；英 "Traditional Chinese research also found keyword search beating pure vector search on data full of names"。
  - 依據：DAT 只說 "BM25 shows stronger performance on the DRCD dataset, suggesting different retrieval dynamics across datasets"（第 398–400 行），沒有把原因歸到專有名詞；DRCD 是維基百科閱讀理解，也沒有被描述成專有名詞多。
  - 改法：中「繁中的研究也看到，在繁中閱讀理解資料上，只用關鍵字搜尋就勝過只用向量搜尋」；英 "Traditional Chinese research also found keyword search alone beating vector search alone on a Traditional Chinese reading-comprehension dataset"。
- 🟢 **研究的限制（L85）**：Bennani 用 SPLADE（圖 1）、NQ 的英文維基百科（第 58–59 行）；Qu 是英文資料集；C-Pack 全是簡體來源（紀錄第 16 行）。相符。

## post-review

- 🟡 **Kucia 那段沒有連結，參考資料也沒列（L49）**
  - 原句：中「order 11 提過 Kucia 和 Gawlik 的研究：在真實使用者的問題上，混合檢索沒有比純向量檢索準，卻比較慢。」；英 "Order 11 mentioned Kucia and Gawlik's study: …"
  - 依據：寫作指南「Inline 連結規則」與「參考資料規則」：引用的研究第一次出現要連結、文末要列。order 11 已有這篇的連結（`2026-10-22-ai-knowledge-base-test-questions-first.md` 第 142、207 行）。
  - 改法：中「[order 11](/posts/learning/2026-10-22-ai-knowledge-base-test-questions-first) 提過 Kucia 和 Gawlik 的研究（[Kucia & Gawlik 2026](https://arxiv.org/abs/2609.14579)）：在真實使用者的問題上，混合檢索沒有比同一個資料庫的純向量檢索準，卻慢了 1.7 倍。」；英 "[Order 11](/posts/learning/2026-10-22-ai-knowledge-base-test-questions-first-en) mentioned Kucia and Gawlik's study ([Kucia & Gawlik 2026](https://arxiv.org/abs/2609.14579)): on real users' questions, hybrid search was no more accurate than pure vector search in the same database, yet 1.7 times slower."；參考資料加一條 `- [Kucia & Gawlik 2026, Beyond Benchmark Scores: How Synthetic and Authentic Query Distributions Diverge in RAG Evaluation (CIKM 2026, arXiv)](https://arxiv.org/abs/2609.14579)`（中英同）。
- 🟡 **「我沒有找到……公開基準」是查證過程，而且是未查盡的否定句（L57）**
  - 原句：中「我沒有找到專門評測繁體中文 embedding 模型的公開基準。所以選模型的方式，還是用你自己的測試題」；英 "I didn't find a public benchmark dedicated to Traditional Chinese embedding models. So choose a model …"
  - 依據：寫作指南「查證過程不寫進正文」：不寫「查不到」，改成讀者的處境。這句也是全稱否定，有人做了繁中基準就變錯。
  - 改法：中「常見的中文 embedding 評測是簡體中文，排行榜只能幫你縮小候選。最後還是用你自己的測試題選」；英 "Common Chinese embedding benchmarks are Simplified Chinese, so leaderboards only narrow your candidates. Make the final choice with your own test questions"。
- 🟢 **order 11 第一次出現沒連結（L8 以外的第一次是 L49；L61、L91 也提到）**：範圍卡前置是 order 11、15，order 15 有連、order 11 沒有。上一條修 L49 時一併連上即可。
- 🟢 **Bennani 的條件放在限制節，用到它的段落沒說（L37）**：寫作指南「會改變讀者做法的限制」要放在用到它的那一段。可選：中「Bennani 和 Moslonka 用稀疏檢索（SPLADE）測，加了……」；英 "Bennani and Moslonka, testing with sparse retrieval (SPLADE), added …"。
- 🟢 **與 order 13 的銜接可以用它最強的數字（L39）**：order 13 第 52 行，依標題階層切並附標題路徑，表格題 66.6% → 99.8%，是這篇「先依文件結構切」最直接的證據，正文只連了 order 13。可選：中「先依文件結構切，也就是 order 13 提到的依標題階層切、每段附上標題路徑（那項研究裡，表格題從 66.6% 升到 99.8%）」；英 "chunk by document structure first, as order 13 described: by heading hierarchy with a heading path on each chunk (in that study, table questions went from 66.6% to 99.8%)"。
- 🟢 **與 order 15 的銜接（L19）**：開頭接 order 15 的欄位，例子的設定 B 用標題路徑，與 order 15 的 metadata 一致。
- 🟢 **例子與開頭一致（L17、L71–81）**：開頭的兩個原因（切點在型號和保固之間、只用向量）正好是設定 A 的兩個條件，設定 B 一次改兩件事；L64 自己說「一次只改一件事」。這是示意，可接受；若要一致，可在 L81 補一句，中「實際比較時，先只改切法，再加混合檢索，才知道各自的效果」；英 "In a real comparison, change the chunking first and add hybrid search second, so you can see each effect"。
- 🟢 **範圍卡對照**：三個決定、半永久、簡單切法、用 order 11 題庫比、embedding 只講直覺，全部有；不講的演算法與 reranking 連回技法文；五個站內連結全在，檔案都存在（中英各五篇已確認）。範圍卡寫「overlap 沒好處」，正文改成「效果很小、依設定而定」並加 Chroma 對照，比範圍卡準確。
- 🟢 **自我檢查（L94–98）**：對到範圍卡的問題與判準（專有名詞、編號、代碼）。除上面 L98 的 🟡 外沒有問題。
- 🟢 **參考資料都讀過全文**：MongoDB、Qu（正式版＋arXiv）、Bennani（arXiv 全文；ECIR 正式版只核書目）、Chroma、DAT、KAP、C-Pack 的紀錄都是 read_status=full，抽查全數通過。Bennani 標「ECIR 2026」可留，連結是 arXiv。
- 🟢 **tldr 長度（L8）**：六句，寫作指南建議 1–2 句；同系列 order 12–15 的 tldr 也是三到五句，屬系列慣例，不單獨要求改。
- 🟢 **標題（L2）**：與系列格式一致（「解析與清洗：……」「結構與 metadata：……」）。

## post-polish

- 🟢 **長句密度在綠與該處理之間（約 13%）**：最長的是 L29（88 字）。可選斷句：中「說它們半永久，是因為改了就要重建。換切法，所有文件要重新切。換 embedding 模型更麻煩：MongoDB 的文件說得很清楚，不同模型產生的向量不能互相比較，即使維度相同，也要把所有文件重新算一次向量」；英文同處已是三句，不必改。
- 🟢 **數字密度**：單段 4 個以上的段落多半是型號（A-3021）或同一組比較（57／76／81），屬於讀者要用的數字，不需下放。
- 🟢 **用語**：`check-tw-terms` 0 命中；人工掃過，沒有中國用語與翻譯腔四型。「召回率」「命中率」各段一致。
- 🟢 **英文版**：與中文逐行對齊，術語一致；L45 "National Chengchi University"、L47 "the same team" 與中文相同。上面各條的英文改法已附。

## 修正紀錄（2026-10-22）

- 🔴 與 🟡 都已採用（中英同步）；長句潤稿與 🟢 視為可選，未全改。
