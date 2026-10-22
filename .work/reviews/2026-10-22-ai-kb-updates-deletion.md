# Review — 2026-10-22-ai-kb-updates-deletion（order 18）

- 檔案：`src/content/posts/learning/2026-10-22-ai-kb-updates-deletion.md`（中）、`-en.md`（英），各 96 行，中英行號一一對應，下文「L23」指中英兩檔的第 23 行。
- 審稿日期 2026-10-22。審稿者：獨立審稿員（沒參與寫作與精讀）。只寫報告，沒有改文章。
- 證據：`.work/research/building-knowledge-bases/extractions/_spotcheck-batch12.md` 第 1–7 節，以及本次回 `scratchpad/fulltext/o18-*`、`o14-confusedpilot.txt` 的追加核對；ConfusedPilot 用 `roychowdhury-2024-confusedpilot.md` 與全文 Table IV（第 1090–1110 行）；Google RAG Engine 用 `google-vertex-rag-engine-ingestion.md`。本站例子對照 `src/content/posts/ai/2026-08-30-ask-ai-indexing-pipeline.md`、`scripts/sync-to-d1.ts`、`src/lib/indexing/post-sync.ts`、`src/lib/indexing/pipeline.ts`。規劃表範圍卡：`.work/series-plans/building-knowledge-bases.md` 的 Order 18。
- 機械檢查：`check-tw-terms` 0 blocking；`check-process-leak` 通過；`scan-ledger` 模板轉折 1（L25）、高風險用詞 2（L62、L63 的「本地」）；`register-scan` 長句 5 句（約 74 句中 7%）、但書段落 7/31（22%）、引述區塊 0、單段 4 個以上數字 2（L23 的數字多半是網址與年份，屬誤報；L37 是 2024、3%、4%，可接受）、模板轉折 1。
- 統計：🔴 2、🟡 4、🟢 19。

## post-verify

- 🔴 **Llama 加指示後是 66%，不到「三分之二以上」（L8 tldr、L23）**
  - 原句：L23 中「各有約三成被翻錯；如果再加上「請照文件回答」的指示，比例升到三分之二以上」；英 "each flipped about three in ten … with an added instruction to answer from the documents, the share rose above two in three"。tldr 中「比例升到三分之二以上」；英 "that rose above two in three"。
  - 依據：`o18-stale.txt` 摘要第 30–31 行 "outdated retrieval flips 30% of Llama and 37% of Qwen answers … explicit follow instructions raise these rates to 66% and 75%"；Table 12（第 876–884 行）Llama .660、Qwen .745。.660 低於 2/3（.667）。另外 Qwen 無指示是 37%，「約三成」偏低。
  - 改法：中 L23「各有三到四成被翻錯（30%、37%）；如果再加上「請照文件回答」的指示，升到 66% 和 75%」；英 "flipped 30% and 37% of the medical questions they had answered correctly … with an added instruction to answer from the documents, that rose to 66% and 75%"。tldr 中「兩個小模型原本答對的醫學題有三到四成被翻錯；要求模型「照文件回答」時，升到三分之二到四分之三」；英 "two small models flipped 30–37% of medical questions they had answered correctly; when told to answer from the documents, that rose to 66–75%"。
- 🔴 **「同時給新文件」與原實驗不符，也和限制段自相矛盾（L25）**
  - 原句：中「另一個發現更值得注意：同時給新文件時，模型幾乎都照新的答」；英 "when the new document was also provided, the models almost always answered from it"。
  - 依據：`o18-stale.txt` 第 634–642 行 "we replace the outdated document with its matched up-to-date counterpart on all 87 medical items"：新文件是**取代**舊文件單獨放進去，不是兩份一起給。正文 L71 也寫「過時文件是直接放進上下文，不是跟新文件一起競爭檢索」，和 L25 互相矛盾。真的「新舊一起檢索」的實驗只有附錄 N 的排序防禦（每題一新兩舊），結論是依日期重排只降 4.6–10.0 個百分點、日期錯時更糟，不是「幾乎都照新的答」。
  - 改法：中「另一個發現更值得注意：把那份過時文件換成新版文件時，模型幾乎都照新的答（87 題裡四個模型全對，兩個小模型各錯一題）。所以問題不是模型不用檢索，而是舊文件還留在那裡、被撈到了」；英 "Another finding is more telling: when the outdated document was swapped for the current one, the models almost always answered from it. So the problem isn't that models ignore retrieval; it's that the old document is still there and gets retrieved."
- 🟡 **Bedrock 只改 metadata 不重算漏了兩個條件（L35）**
  - 原句：中「Bedrock 在只改了 metadata 檔、內容沒變的情況下，也不會呼叫 embedding 模型」；英 "Bedrock doesn't call the embedding model when only a metadata file changed and the content didn't"。
  - 依據：`o18-bedrock-sync.txt` 第 54 行 "In certain cases … avoids calls to the embedding model"；第 56–62 行三個條件要同時成立：只改 metadata 檔、內容檔不是 CSV、沒用自訂轉換 Lambda；第 64–66 行 CSV 改 metadata 一律重新匯入。照現在的寫法，用 CSV 或 Lambda 的讀者會以為不用付重算的錢。
  - 改法：中「Bedrock 在只改了 metadata 檔、內容檔不是 CSV、也沒用自訂轉換函式時，不會呼叫 embedding 模型」；英 "Bedrock skips the embedding model when only a metadata file changed, the content file isn't a CSV, and no custom transformation Lambda is used"。
- 🟡 **Google RAG Engine 沒有連結也沒列參考資料（L53）**
  - 原句：中「Google 的 RAG Engine 可以把每個檔案的結果寫到指定的地方」；英 "Google's RAG Engine can write each file's result to a location you choose"。
  - 依據：內容正確（`google-vertex-rag-engine-ingestion.md` 第 23 行，`import_result_sink` 設成 Cloud Storage 或 BigQuery，"the successful and failed file results are written to the sink"），但本篇沒有 inline 連結，也不在 `## 參考資料`。參考資料規則要求引用的外部說法都列出。
  - 改法：句尾加連結並在參考資料補一條（紀錄裡的 Vertex AI RAG Engine 匯入頁網址）；或改成「order 12 提過，Google 的 RAG Engine 可以……」並連到 order 12。
- 🟢 **LangChain（L33、L44）**：`o18-lc-indexing.txt` 第 19–25 行 hash 含內容與 metadata；第 43–44 行只有 full 會刪已不存在的來源。「雜湊值同時當作向量的 ID」出自原始碼（`o18-lc-api.py` 第 181、227 行），notebook 沒寫；說法正確，連結只指 notebook，可接受。
- 🟢 **Azure（L33、L43）**：`o18-azure-blob-delete.txt` 第 56–58 行靠內建時間戳偵測變更、"deletion detection isn't [a given]"；第 64 行要在第一次執行前設好；第 177 行 one-to-many 不適用、要用 REST 刪除。相符。可選把「刪除不行」改得更準：中「刪除不會自動偵測，要另外設軟刪除政策」；英 "deletions aren't detected unless you set up a soft-delete policy"。
- 🟢 **Bedrock 增量、延遲與統計（L33、L49、L53）**：`o18-bedrock-sync.txt` 第 34–46 行只處理新增、修改、刪除，沒寫怎麼判斷；第 82、96 行「could take a few minutes」，條件是 Aurora（RDS）以外的向量庫；`o18-bedrock-ingestion-stats.txt` 有 `numberOfDocumentsFailed`。相符。可選在 L49 補條件：中「用 Aurora 以外的向量庫時」；英 "with vector stores other than Aurora"。
- 🟢 **Pinecone 最終一致（L35、L49）**：Update 頁第 115 行 `setMetadata` 不送向量；第 687–689 行、Delete 頁第 487–489 行 "eventually consistent"。相符。
- 🟢 **Xiao 3–4%（L37）**：`o18-xiao2024.txt` 第 199–205 行右欄，Sift 每輪刪除再插入 5%、約 3,000 輪後不可達點 3%–4%；第 217–221 行 "cannot be mitigated by … increasing the ef parameter"。GIST、ImageNet、Sift 都是影像特徵資料集。相符。
- 🟢 **ConfusedPilot 時間窗（L49）**：`o14-confusedpilot.txt` Table IV，刪除後仍被引用 38.8–183.4 秒，「幾十秒到幾分鐘」相符；order 14（`2026-10-22-ai-kb-security-pii-injection.md` 第 37 行）確實提過 ConfusedPilot。
- 🟢 **系列交叉引用（L23、L45、L53）**：order 12 第 8、23 行（Ouyang 過時資料降兩成多；權限不足一個檔案都不匯也不報錯）；order 17 第 50 行（Copilot 連接器增量不處理刪除）。都對得上。
- 🟢 **本站例子（L59–L67）**：四張表＋Vectorize 對到 `post-sync.ts` 第 91–101 行；空清單拒絕同步對到 `sync-to-d1.ts` 第 126 行；只改 tags 或描述會全篇重算，對到 `post-sync.ts` 第 154–160 行（新 chunk 的 `embedded_hash` 設 NULL）與 `pipeline.ts` 第 49、102 行（挑 NULL 或不等於 desired 的 chunk）；先清刪除佇列再寫新向量、成功才寫回，對到原文第 67–78 行。全部一致。小差：L61 的 `source_hash` 實際還含 slug、語言、tldr 與 schema 版本（`sync-to-d1.ts` 第 180–182 行），「簡化後」已交代，可不改。
- 🟢 **L67 的「新舊版本並存」**：同 ID 的舊向量不進刪除佇列（`post-sync.ts` 第 164 行），D1 與全文索引已是新內容、Vectorize 還是舊向量。現在的寫法讀起來像兩筆並存，可選改準：中「在向量重算完成之前，全文索引已經是新內容，向量庫裡同一個段落 ID 卻還是舊內容算出的向量」；英 "until re-embedding finishes, the full-text index already has the new text while the vector store still holds the old vector under the same chunk ID"。
- 🟢 **參考資料都讀過全文**：8 條外部來源都有全文檔與抽取紀錄（ConfusedPilot 參考文獻掃過，其餘全讀）；站內連結 order 12、order 15、ask-ai-indexing-pipeline 的中英版都存在。

## post-review

- 🟢 **範圍卡「30–37%」的三個限定都有跟著數字走（L8、L23、L71）**：抽取紀錄要求的醫學題、兩個 7B／8B 小模型、直接放進上下文，L23 都寫了，tldr 也有「一篇預印本」「兩個小模型」「醫學題」「放進上下文」，L71 再集中交代一次。可選在 tldr 補「直接」兩字：中「把一份過時文件直接放進上下文」；英已有 "put a single outdated document into the context"，不用改。
- 🟡 **L62、L63 的「本地」**
  - 原句：中「資料庫有但本地沒有的刪掉」「本地的文章清單如果是空的」。
  - 依據：`scan-ledger` 高風險用詞命中；這裡指的是執行同步的那台機器或 repo 裡的文章，台灣寫程式的語境多說「本機」，或直接說「repo 裡」。
  - 改法：中「資料庫有、repo 裡已經沒有的刪掉」「repo 裡符合條件的文章如果一篇都沒有，就拒絕同步」；英不用改。
- 🟢 **範圍卡覆蓋**：全量 vs 增量（L27–31）、hash（L33）、只改 metadata（L35）、刪除傳播與最終一致（L39–49）、匯入失敗紀錄（L51–53）、同步延遲監控（L55）、為什麼要刪（L21–25）、不講雲服務設定（L19）、例子、自我檢查都在。
- 🟢 **自我檢查（L82–84）**：判準與範圍卡一致，還補了「新舊並存」和「只有舊版」兩種情況，清楚。
- 🟢 **「今晚可以做的事」（L75–78）**：四項都有做得出來的動作，第 3 項的刪除測試特別具體。

## post-polish

- 🟡 **L23 長句 106 字**
  - 原句：中「Ahmed 等人 2026 年的預印本把這件事量得更細（…）：他們把一份過時文件直接放進上下文，兩個 7B 和 8B 的開源模型，原本不給文件也答對的醫學題，各有約三成被翻錯；……」
  - 依據：register-scan 最長一句；冒號後塞了實驗設計、模型、題目、比例四件事。
  - 改法（併上面 🔴 一起改）：中「Ahmed 等人 2026 年的預印本把這件事量得更細（[Ahmed et al. 2026](…)）。他們把一份過時文件直接放進上下文，看兩個 7B、8B 開源模型原本答對的醫學題會不會被翻錯。結果各有 30% 和 37% 被翻錯；再加上「請照文件回答」的指示，升到 66% 和 75%。軟體類的題目被翻錯的比例低一些。」英同結構斷成四句。
- 🟢 **L33 長句 96 字**：「不過不是每家都用雜湊：Azure……；Amazon Bedrock……」可在分號處斷成兩句：中「不過不是每家都用雜湊。Azure AI Search 讀 Blob 儲存時，靠的是檔案的修改時間（…）。Amazon Bedrock 的知識庫只說同步會處理新增、修改、刪除的文件，沒說怎麼判斷（…）。」
- 🟢 **L25 模板轉折「另一個發現更值得注意」**：全篇只 1 次，可留；若想去掉，中「新文件的結果正好相反：……」；英 "With the new document instead, the result flipped: …"。
- 🟢 **L67 長句 75 字**：在分號處斷開即可。
- 🟢 **但書密度 22%**：略高於綠線 20%，主要在 L33、L35、L37、L84 的「不過／但」，各自有用，不必刪。
- 🟢 **英文版**：語氣自然，無中式英文；"Deletion is the easiest thing to miss" 等標題與中文對齊。

## 修正紀錄（2026-10-22）

- 🔴 與 🟡 主要項目已採用（中英同步）：Ahmed 數字與「換成新文件」、Bedrock 條件、Google 出處、repo 用語；Joren 說明、Azure IR 頁句子刪除、DoorDash 網址與五個品質面向、A/B 描述、Thakur 56%、例子數字與追問題說明。長句潤稿與 🟢 視為可選。
