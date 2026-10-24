# 抽取紀錄抽查：第十二批（14 份）

- 抽查日期：2026-10-22
- 抽查者：獨立抽查員（沒參與寫作與精讀）
- 範圍：order 18 的 7 份（bedrock-kb-sync-ingest、ahmed-2026-stale-document-poisoning、langchain-indexing-api-record-manager、pinecone-update-delete-data、azure-search-blob-change-delete-detection、xiao-2024-hnsw-unreachable-points、site-ask-ai-indexing-pipeline），以及 order 19 的 7 份（es-2024-ragas、azure-rag-eval-and-ir-phase-o19、joren-2025-sufficient-context、roychowdhury-2024-ragas-telecom、doordash-2024-2025-support-kb-loop、salemi-zamani-2024-erag、site-o19-eval-posts）。
- 沒有改動任何抽取紀錄或文章。

## 抽樣方法

- 沿用第八到十一批的方法。腳本：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/spot12/sample.py`（由 spot11/sample.py 複製，只把 `SECS` 換成這 14 份）。
- 外部來源的 12 份用預設的「可引用」「主張」「原句」節。兩份站內摘要（site-ask-ai-indexing-pipeline、site-o19-eval-posts）沒有這三種節名，預設節抽到 0 個候選，改用 `WHOLE`（全檔條列行）模式；其餘候選條件、排除條件、每份檔案前 `random.seed(17)` 後 `random.sample(候選, 3)` 都和前幾批相同。
- 各份候選數：bedrock 6、ahmed 13、langchain 7、pinecone 8、azure-blob 7、xiao 4、site-ask-ai 15（WHOLE）、ragas 5、azure-eval 9、joren 9、roychowdhury 6、doordash 9、salemi 8、site-o19 35（WHOLE）。
- 核對方式：`sed -n`／`grep -n` 回 `scratchpad/fulltext/o18-*`、`o19-*` 找原處，數字逐個對到原句或原表。eRAG Table 1 以 `pdftotext -layout -f 3 -l 3 o19dl/2404.13781.pdf` 重抽版面核對欄位。站內摘要回 `src/content/posts/ai/` 原文與 `scripts/sync-to-d1.ts`、`src/lib/indexing/post-sync.ts`、`src/lib/indexing/pipeline.ts` 核對。
- 全部 14 份都有存全文檔，不需要補抓，這次沒有上網。
- 下列差異只是文字層的不同，不算不一致：彎直引號、Markdown 強調、PDF 斷行與斷字、雙欄混排、引文前後截短但不改意思、行號差一兩行。

## 讀取紀錄總核對（`wc -l` / `wc -c`）

| 全文檔 | 紀錄行數 | 實際 `wc -l` | 紀錄 bytes | 實際 `wc -c` | 紀錄寫的已讀區段 |
|---|---|---|---|---|---|
| o18-bedrock-sync.html | — | — | 27,334 | 27,334 | （原始檔） |
| o18-bedrock-sync.txt | 130 | 130 | 8,844 | 8,844 | 1–130 |
| o18-bedrock-ingestion-stats.txt | 107 | 107 | 2,172 | 2,172 | 1–107 |
| o18-stale.txt | 1,008 | 1,008 | 109,438 | 109,438 | 1–1008 |
| o18-stale.pdf | — | — | 789,252 | 789,252 | （原始檔） |
| o18-lc-indexing.txt | 301 | 301 | 13,918 | 13,918 | 1–301 |
| o18-lc-indexing-v0.3.ipynb | — | — | 27,005 | 27,005 | （原始檔） |
| o18-lc-api.py | 954 | 954 | 39,246 | 39,246 | 1–230、295–420 |
| o18-pinecone-update.md | 693 | 693 | 25,785 | 25,785 | 1–693（非 Python／curl 範例掃過） |
| o18-pinecone-delete.md | 489 | 489 | 15,637 | 15,637 | 1–489（同上） |
| o18-azure-blob-delete.html | — | — | 62,045 | 62,045 | （原始檔） |
| o18-azure-blob-delete.txt | 213 | 213 | 11,103 | 11,103 | 1–213 |
| o18-xiao2024.txt | 751 | 751 | 99,388 | 99,388 | 1–751 |
| o18-xiao2024.pdf | — | — | 1,041,283 | 1,041,283 | （原始檔） |
| src/…/2026-08-30-ask-ai-indexing-pipeline.md | 170 | 170 | 13,644 | 13,644 | 1–170 |
| o19-es2024-ragas.txt | 685 | 685 | 31,838 | 31,838 | 1–685 |
| o19-azure-rag-eval-phase.md | 640 | 640 | 26,281 | 26,281 | 1–640 |
| o19-azure-rag-eval-phase.github.md | 293 | 293 | 26,621 | 26,621 | 表格行 82–85、檔頭 |
| o19-azure-rag-ir-phase.github.md | 639 | 639 | 46,046 | 46,046 | 1–56、396–420、518–639 |
| o19-joren2025-sufficient-context.txt | 1,910 | 1,910 | 78,340 | 78,340 | 1–1910 |
| o19-roychowdhury2024-ragas-telecom.txt | 663 | 663 | 59,501 | 59,501 | 1–663 |
| o19-doordash2024-dasher-support.md | 217 | 217 | 17,070 | 17,070 | 全部 |
| o19-doordash2025-ugc-kb.md | 163 | 163 | 12,204 | 12,204 | 全部 |
| o19-salemi2024-erag.txt | 850 | 850 | 37,995 | 37,995 | 1–850 |
| src/…/2026-03-12-rag-evaluation-frameworks.md | 452 | 452 | （未記） | 24,069 | 相關段落 |
| src/…/2026-08-22-private-corpus-retrieval-eval.md | 131 | 131 | （未記） | — | 相關段落 |
| src/…/2026-08-30-ask-ai-retrieval-evaluation.md | 181 | 181 | （未記） | — | 相關段落 |

- 紀錄寫的行數與 bytes 全部和 `wc` 一致。原始 PDF：o19dl/2309.15217.pdf 231,984、2404.13781.pdf 750,644、2411.06037.pdf 1,067,523 bytes 也和紀錄相符。
- 讀取缺口（紀錄自己寫明）：LangChain api.py 只讀 1–230、295–420；Azure IR 頁只讀 1–56、396–420、518–639（中段搜尋技術只看標題）；Pinecone 非 Python／curl 範例掃過；site-o19 三篇站內文只讀相關段落、英文版未讀。**Azure IR 頁是部分讀取，但 order 19 正文用到了只在 IR 頁的內容**（見審稿報告 L23、L52），這點交給審稿處理。

---

## 1. bedrock-kb-sync-ingest.md

全文檔：`fulltext/o18-bedrock-sync.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L28 | 只改 metadata 不重算：原句 "retrieves existing vector embeddings … avoids calls to the embedding model"；三條件：只改 `.metadata.json`、內容不是 CSV、沒用自訂轉換 Lambda | 第 54、56–62 行 | 逐字相符。原句前面還有 "In certain cases"；CSV 一律重新匯入的理由在第 64–66 行。 |
| 2 | L30 | 同步完成後，Aurora（RDS）以外的向量庫還要「could take a few minutes」才查得到 | 第 82、96 行 | 相符（API 分頁原文是 "could take few minutes"）。 |
| 3 | L32 | StopIngestionJob 可停，再 StartIngestionJob "to ingest the rest of your data" | 第 76、90 行 | 逐字相符。 |

判定：**通過**。審稿用補充：同步表格（第 38–46 行）寫「Content or metadata changed → re-ingested」，metadata-only 優化是同頁另一節的例外，三個條件都要成立。

## 2. ahmed-2026-stale-document-poisoning.md

全文檔：`fulltext/o18-stale.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L28 | 醫學 87 題換成匹配新文件，沒有原本答對變錯；四模型 87/87、Qwen-7B 與 Llama-8B 86/87；原本答錯救回 97–100% | 第 634–642 行 | 逐字相符。原文動詞是 "replace the outdated document with its matched up-to-date counterpart"：新文件是**取代**舊文件，不是和舊文件一起給。 |
| 2 | L30 | GPT-5.5 不給文件答對 0.92–1.00；推翻 74/83（0.89）；code 2/18、policy 2/15、law 12/46；壓力測試不是盛行率 | 第 180–186、888–896 行 | 相符。 |
| 3 | L32 | Qwen-7B 76/87 過時文件標 uncertain；Llama-8B 87/87 標 superseded、另把 39 份新文件誤標；failure 36/49、35/53 | Table 13 第 912–921 行；第 317–320 行 | 相符（C/S/U 欄：Qwen Outdated 10/1/76；Llama Up-to-date 48/39/0、Outdated 0/87/0）。 |

判定：**通過**。審稿用補充：摘要第 30–31 行 "flips 30% of Llama and 37% of Qwen … raise these rates to 66% and 75%"；Table 12（第 876–884 行）Llama 指示後是 .660，**低於三分之二（.667）**。

## 3. langchain-indexing-api-record-manager.md

全文檔：`fulltext/o18-lc-indexing.txt`（N）、`o18-lc-api.py`（C）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L28 | 刪除只有 full 處理；incremental、scoped_full 不會；full 要傳 "full universe of content" | N 第 43–44 行；第 182–186 行 | 逐字相符。 |
| 2 | L29 | 新舊並存時間窗原句；incremental 縮短，full／scoped_full 寫完才清 | N 第 46–49 行 | 逐字相符。 |
| 3 | L30 | 重複 5 次只加 1；第二次全 skipped；改 doggy.txt → added 1、deleted 1；full 刪一份來源 → skipped 1、deleted 1 | N 第 119–126、135–136、170–178、196–205 行 | 數字全部相符。 |

判定：**通過**。補充：「hash 當向量 ID」出自 C（第 181、227 行 `id=hash_`），notebook 本身沒寫；文章只列 notebook 為參考資料，屬小差。

## 4. pinecone-update-delete-data.md

全文檔：`fulltext/o18-pinecone-update.md`（U）、`o18-pinecone-delete.md`（D）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L19 | ID 不存在時 "no records are affected and a `200 OK` status is returned" | U 第 117–119 行 | 逐字相符。 |
| 2 | L26 | 三種刪法；by ID 每次最多 1,000、每秒 5,000 筆；by metadata 每 namespace 每秒 5 次 | D 第 11–12、108–114、228–230、361–363、470–485 行 | 相符。原表另有「每索引每秒 500 次」，紀錄沒寫，不影響。 |
| 3 | L28 | "Pinecone is eventually consistent, so there can be a slight delay …" | D 第 487–489 行 | 逐字相符。U 第 687–689 行也有同義句（updates）。 |

判定：**通過**。

## 5. azure-search-blob-change-delete-detection.md

全文檔：`fulltext/o18-azure-blob-delete.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L20 | 刪除偵測要在第一次執行前設好；之前刪的 "remain in your index, even if you add the policy … and reset it"；建議新索引＋新 indexer | 第 64 行 | 逐字相符。 |
| 2 | L22 | soft delete 保留期 "much higher than your indexer interval schedule"；只在 blob 仍處於 soft deleted 時處理才刪 | 第 94 行 | 逐字相符。 |
| 3 | L23 | ADLS Gen2 改目錄名不更新時間戳；還原 soft delete 時間戳不變，要重存 metadata | 第 74、134–136、171 行 | 相符。 |

判定：**通過**。補充：「預設偵測變更、不偵測刪除」在第 58 行 "Although change detection is a given, deletion detection isn't. An indexer doesn't track object deletion"；切塊（one-to-many）不適用在第 177 行。

## 6. xiao-2024-hnsw-unreachable-points.md

全文檔：`fulltext/o18-xiao2024.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L24 | HNSW-RU 200 輪後 GIST 約 3%–4%、ImageNet 約 2%–3% | 第 558–560 行（右欄） | 逐字相符。 |
| 2 | L25 | 約 90% recall 時 replaced update 比查詢慢；GIST、ImageNet 插入慢 5–10 倍；MN-RU 快 2–4 倍 | 第 556–561 行右欄；第 570–574 行 | 相符。 |
| 3 | L26 | 重建可恢復連通但有運算、時間、服務中斷、複雜度代價；backup index，τ=40,000 | 第 272–282、341–350、636–639 行 | 相符。 |

判定：**通過**。審稿用補充：文章用的「3% 到 4%」是 Sift 資料集約 3,000 輪後的數字（第 199–205 行右欄），「調 ef 也補不回來」在第 217–221 行。兩處都和文章一致。

## 7. site-ask-ai-indexing-pipeline.md（WHOLE 模式）

對照：`src/content/posts/ai/2026-08-30-ask-ai-indexing-pipeline.md`、`src/lib/indexing/post-sync.ts`、`scripts/sync-to-d1.ts`、`src/lib/indexing/pipeline.ts`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L19 | chunk ID 是 `sha256(slug + "::" + chunk_index).slice(0, 16)`，位置不是內容 | 文章第 36–44 行 | 逐字相符。 |
| 2 | L22 | 刪除清 `chunks_fts`、`posts_fts`、`post_chunks`、`posts`＋經 `vector_delete_queue` 清 Vectorize | post-sync.ts 第 91–101 行 | 相符。 |
| 3 | L30 | 只改 tags／description 也重算整篇 embedding：upsert 時新 chunk 的 `embedded_hash` 設 NULL | post-sync.ts 第 154–160 行；pipeline.ts 第 49、102 行 | 相符。embed sync 挑 `embedded_hash IS NULL OR != desired_embedding_hash`，所以 desired hash 沒變也會重算。 |

判定：**通過**。補充：空清單拒絕同步在 sync-to-d1.ts 第 126 行（紀錄寫 125–127）；第 89 行另有 prune 的同類防呆。`source_hash` 實際含 slug、title、category、language、description、tldr、tags、正文與 schema version（第 180–182 行）。

## 8. es-2024-ragas.md

全文檔：`fulltext/o19-es2024-ragas.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L25 | context relevance 最難："ChatGPT often struggles with … especially for longer contexts." | 第 447–451 行 | 逐字相符。 |
| 2 | L30 | 三個面向原句（retrieval／faithful／generation） | 第 23–27 行 | 逐字相符。 |
| 3 | L31 | Faithfulness 定義原句 | 第 179–182 行 | 逐字相符。 |

判定：**通過**。

## 9. azure-rag-eval-and-ir-phase-o19.md

全文檔：`fulltext/o19-azure-rag-eval-phase.md`（E）、`o19-azure-rag-ir-phase.github.md`（IR）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L27 | "Your collection of documents changes over time … Maintaining documentation of past evaluations is critical." | E 第 415–421 行 | 逐字相符。 |
| 2 | L28 | "hundreds of evaluation runs and thousands of results. You should automate the persistence …" | E 第 402–408 行 | 逐字相符。 |
| 3 | L29 | 安全評估四類；"Continuous monitoring is required: Regular audits of document repositories and retrieval patterns." | E 第 423–533 行（小節 433、458、473、488）；第 531–533 行 | 相符，原句尾 "are essential to maintain safety and trust" 被截短，不改意思。 |

判定：**通過**。審稿用補充：precision@K、recall@K、MRR 與 negative examples「接近 0」那句只在 IR 第 619–627 行，E 頁沒有（E 頁 `grep -i negative` 0 筆）；「評審最好用不同模型」在 E 第 248–251 行。

## 10. joren-2025-sufficient-context.md

全文檔：`fulltext/o19-joren2025-sufficient-context.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L26 | 選擇性回答提升答題中正確比例 2–10% | 第 46–48、921 行 | 相符。 |
| 2 | L30 | "open-book QA cannot be solved by improving retrieval alone." | 第 94–95 行 | 逐字相符。 |
| 3 | L31 | "models generate correct answers in many cases, even when the provided context is insufficient." | 第 98–99 行 | 逐字相符。 |

判定：**通過**。審稿用補充：35–62% 在第 117 行，是**沒有排除閉卷題**的原始比例；作者在第 632–633 行說閉卷知識 "mostly explains the 35–62%"。「排除閉卷答對的題後仍然成立」（第 99–100 行）只是定性說法，沒有給排除後的比例。

## 11. roychowdhury-2024-ragas-telecom.md

全文檔：`fulltext/o19-roychowdhury2024-ragas-telecom.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L20 | 兩者 > 0.7 答對機率 0.87–0.97；兩者 < 0.3 答錯 0.84–0.89 | Table 4 第 272–281 行 | 相符（Joint 欄）。只含三個 Mistral-7B 變體。 |
| 2 | L21 | "scores for AnsSim, AnsRel and ConRel are subject to inherent variations …"；ConRel 受長度影響；AnsRel 靠 cosine 與 LLM | 第 307–312 行；第 262–276 行 | 逐字相符。 |
| 3 | L22 | 檢索器 top-1 64.6–72.7% | Table 1 第 159–170 行 | 相符（64.60–72.66）。 |

判定：**通過**。補充：「檢索錯時答對、faithfulness 低」在第 317–322 行 "the generator LLM is answering questions from it's enriched domain adapted knowledge, leading to a lower FaiFul and higher FacCor"，講的是領域調適後的模型。

## 12. doordash-2024-2025-support-kb-loop.md

全文檔：`fulltext/o19-doordash2024-dasher-support.md`（A）、`o19-doordash2025-ugc-kb.md`（B）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L23 | 只挑轉人工的對話；依頻率與嚴重度排序；cosine 0.70–0.90；人工看前 K 群 | B 第 38、44 行 | 逐字相符。 |
| 2 | L24 | 內容專員與營運夥伴審稿；"every correction is logged and fed back …" | B 第 68–73 行 | 逐字相符。 |
| 3 | L25 | A/B：轉人工率對照組 78% → 實驗組 43%；實驗組約 75% 檢索只用 UGC | B 第 90 行 | 相符。是對照組與實驗組的比較，不是前後比較。 |

判定：**通過**。審稿用補充：A 第 94–104 行是「five areas」品質面向（Retrieval correctness、Response accuracy、Grammar and language accuracy、Coherence to context、Relevance to the Dasher's request），監控是 "prompting a more sophisticated LLM or creating rules-based regular expression metrics"，人工團隊抽樣並 "continuous calibration"。A 的 URL Source 是 `…/large-language-modules-based-dasher-support-automation/`。

## 13. salemi-zamani-2024-erag.md

全文檔：`fulltext/o19-salemi2024-erag.txt`；Table 1 以 `o19dl/2404.13781.pdf` 第 3 頁 `-layout` 重抽

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L21 | 「文件含答案字串」Hit Ratio τ 0.232–0.375，比人工標籤好 | Table 1（BM25 欄：NQ 0.325、TriviaQA 0.232、HotpotQA 0.375） | 相符。KILT provenance 同欄 0.216／0.187／0.113。 |
| 2 | L29 | "a document deemed relevant based on human preferences may not be useful for an LLM …" | 第 126–127 行 | 逐字相符。 |
| 3 | L30 | "one document can be useful for an LLM … without containing the ground truth labels." | 第 133–134 行 | 逐字相符。 |

判定：**通過**。

## 14. site-o19-eval-posts.md（WHOLE 模式）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L32 | 知識庫外題不能用 Recall@k 硬算，要分開報 | private-corpus-retrieval-eval.md 第 113 行 | 相符。 |
| 2 | L43 | q21 contract：四篇必要、兩篇禁止、≥4 個來源、≤30 秒、不走快取 | ask-ai-retrieval-evaluation.md 第 98–110 行 | 相符。 |
| 3 | L53 | 「事故變題目」→ 文章 1 行 361–374、文章 3 行 112–121 | rag-evaluation-frameworks.md 第 361–374 行；ask-ai-retrieval-evaluation.md 第 112–121 行 | 相符。 |

判定：**通過**。

---

## 摘要

| # | 紀錄 | 3 項抽樣 | wc 行數／bytes | 區段涵蓋 | 判定 |
|---|---|---|---|---|---|
| 1 | bedrock-kb-sync-ingest | 3/3 | 一致（兩檔＋HTML） | 完整 | 通過 |
| 2 | ahmed-2026-stale-document-poisoning | 3/3 | 一致 | 完整 | 通過 |
| 3 | langchain-indexing-api-record-manager | 3/3 | 一致（三檔） | api.py 部分讀 | 通過 |
| 4 | pinecone-update-delete-data | 3/3 | 一致（兩檔） | 範例掃過 | 通過 |
| 5 | azure-search-blob-change-delete-detection | 3/3 | 一致 | 完整 | 通過 |
| 6 | xiao-2024-hnsw-unreachable-points | 3/3 | 一致 | 完整 | 通過 |
| 7 | site-ask-ai-indexing-pipeline | 3/3（WHOLE） | 一致 | 完整＋程式碼 | 通過 |
| 8 | es-2024-ragas | 3/3 | 一致 | 完整 | 通過 |
| 9 | azure-rag-eval-and-ir-phase-o19 | 3/3 | 一致（三檔） | IR 頁部分讀 | 通過 |
| 10 | joren-2025-sufficient-context | 3/3 | 一致 | 完整 | 通過 |
| 11 | roychowdhury-2024-ragas-telecom | 3/3 | 一致 | 完整 | 通過 |
| 12 | doordash-2024-2025-support-kb-loop | 3/3 | 一致（兩檔） | 完整 | 通過 |
| 13 | salemi-zamani-2024-erag | 3/3 | 一致 | 完整 | 通過 |
| 14 | site-o19-eval-posts | 3/3（WHOLE） | 行數一致 | 相關段落 | 通過 |

- 42 項抽樣：數字與原句全部和原文相符，沒有不通過的紀錄，也沒有要更正的數字。
- 全文檔的行數與 bytes 全部和 `wc` 一致。
- 方法上的偏離：兩份站內摘要沒有預設節名，改用 WHOLE 模式抽樣。
- 紀錄沒錯、但文章寫法要留意的地方（審稿報告會用到）：
  - Ahmed：Llama 加「照文件」指示後是 66.0%，不到三分之二；Table 6 是「用新文件取代舊文件」，不是兩份同時給。
  - Bedrock：metadata-only 不重算有三個條件（只改 metadata 檔、非 CSV、無自訂 Lambda），原文還加 "In certain cases"。
  - Joren：35–62% 是沒排除閉卷題的原始比例，作者說大部分可用閉卷知識解釋；排除閉卷題後「仍然成立」只是定性說法。
  - Azure：precision@K／recall@K 與 negative examples「接近 0」只在 IR 頁（部分讀取），LLM evaluation 頁沒有。
  - DoorDash 2024：「five areas」是品質面向，不是錯誤類別；監控一部分是 LLM、一部分是正規表示式規則。78%→43% 是 A/B 對照組對實驗組。
  - LangChain：「hash 當 ID」出自原始碼，不在 notebook。
