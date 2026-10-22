# Review — 2026-10-22-ai-kb-metadata-schema（order 15）

- 檔案：`src/content/posts/learning/2026-10-22-ai-kb-metadata-schema.md`（中）、`-en.md`（英），各 136 行，中英行號一一對應，下文「L39」指中英兩檔的第 39 行。
- 審稿日期 2026-10-22。審稿者：獨立審稿員（沒參與寫作與精讀）。只寫報告，沒有改文章。
- 證據：`.work/research/building-knowledge-bases/extractions/_spotcheck-batch10.md` 第 12–21 節，以及本次回 `scratchpad/fulltext/o15-*`、`o12-ms-ess.md` 的追加核對。規劃表範圍卡：`.work/series-plans/building-knowledge-bases.md` 的 Order 15。
- 統計：🔴 0、🟡 9、🟢 24。

## post-verify

- 🟢 **三種用途照 Azure（L23–27、L8）**：`o15-azure-rag-enrichment.md` 第 193 行圖說，每個欄位的 usage 是 Return、Search、Search/Return、Search/Filter 這幾種值；Source "allows the querier to cite the original source"、Language "useful as a filter in queries"（第 221–223 行）。「回傳、參與搜尋、過濾」照 Azure，沒有沿用範圍卡的「過濾、排序、引用」，正確。可選精確化：原文沒有寫「分成三種」，是圖上每個欄位標的用途。中「Azure 的 RAG 指南替每個欄位標了用途，歸起來是三種」；英 "Azure's RAG guide labels each field with a purpose, and they come down to three"。
- 🟢 **Bedrock includeForEmbedding（L29）**：`o15-bedrock-s3-metadata.md` 第 94–98 行，false "does not influence semantic search results"；true "concatenated to the chunk text before embedding … not included in the chunk text returned in results"。正文三點（只過濾、接到前面再建向量、回傳不出現）都相符。可選：把開關名稱寫出來方便讀者查，中「（`includeForEmbedding`）」，英 "(`includeForEmbedding`)"。
- 🟢 **OpenAI 過濾在搜尋前（L31）**：`o15-openai-retrieval.md` 第 335 行 "target files based on their attributes before performing semantic search"。相符。
- 🟢 **Azure 產品＋年份例子（L35）**：第 211 行逐字對到，且原文的建議是「match on keywords for the product and year」，正文寫「比對產品和年份的關鍵字」，沒有說成 Azure 建議用過濾欄位。正確。
- 🟢 **Yousuf 33→55（L37、L8）**：Table 2 第 444、448 行，OpenAI text-embedding-3-small、一般題、Context@5 33.33 → 前綴 55.00；Context@K 定義「top K 裡至少一個 chunk 支持答案」（第 389 行）。「公司和年份影響最大、章節標題小幅」對到第 550–554 行。正確。
- 🟡 **「附上標題路徑讓表格題大幅提升」把兩個改動算成一個（L39）**
  - 原句：中「order 13 提過，在每一段附上標題路徑（例如……），在一項研究裡讓表格題的答對率大幅提升」；英 "Order 13 mentioned that attaching a heading path to each chunk (…) greatly improved accuracy on table questions in one study"。
  - 依據：order 13 第 52、57 行寫的是「依標題階層切塊、並在每段附上標題路徑」，而且明寫「階層切塊和標題路徑同時打開，沒有拆開量各自的貢獻」（Santos Table 4 的 Splitting 與 Hier. Meta 同時切換）。這裡只寫標題路徑，等於把功勞全給 metadata。
  - 改法：中「order 13 提過，在一項研究裡，改成依標題階層切塊、並在每段附上標題路徑（例如……），表格題的答對率大幅提升；兩件事是一起改的」；英 "Order 13 mentioned that in one study, switching to heading-based chunking and attaching a heading path to each chunk (…) greatly improved accuracy on table questions; the two changes were made together"。
- 🟡 **LinkedIn 的欄位寫錯，「相關工單」是圖的連線不是欄位（L39）**
  - 原句：中「LinkedIn 2024 年把客服工單依原本的欄位（問題描述、解法、相關工單）拆開建成知識圖譜」；英 "split along their original fields (issue description, solution, related tickets)"。
  - 依據：`o15-xu2024-linkedin-kgrag.txt` 第 84、120、140 行，工單區段是 Summary、Description、Priority、Root Cause、Steps to Reproduce；工單之間的 clone／related 與標題相似度是圖的邊（第 79–86 行）。原文沒有「解法」這個欄位（"fix solution" 是查詢意圖，第 210、217 行）。「整套系統的結果，沒有拆開量欄位結構本身的貢獻」寫得正確，協調者要求的「不要說成整套系統的功勞歸給欄位」已做到。
  - 改法：中「LinkedIn 2024 年把客服工單依原本的欄位（摘要、問題描述、優先級、重現步驟）拆成圖上的節點，工單之間再依相關連結連起來，而不是切成固定長度的段落」；英 "In 2024 LinkedIn split customer-service tickets along their original fields (summary, description, priority, steps to reproduce) into graph nodes and linked related tickets to each other, instead of cutting them into fixed-length chunks"。
- 🟢 **Microsoft Learn 的欄位（L43）**：`o12-ms-ess.md` 第 179 行 "standardize fields like owner, effective date, and region"、第 187 行 document type、第 198 行 "current," "archived," or "superseded"、第 199 行 review dates。相符。
- 🟡 **OpenAI 頁面沒說大於小於只接受數字（L64）**
  - 原句：中「OpenAI、Bedrock、Pinecone 的「大於、小於」比較都只接受數字；OpenAI 的範例用的是 Unix 時間戳」；英 "The greater-than and less-than comparisons in OpenAI, Bedrock and Pinecone accept only numbers"。
  - 依據：Bedrock kb-test-config（A 第 117–128 行）與 Pinecone（第 350–363 行）明寫只支援 number；OpenAI 第 341–352 行只列運算子名稱，全頁沒有型別限制（grep "number"、"numeric" 無結果）。「OpenAI 範例用 Unix 時間戳」正確（第 382–396、1507 行）。另外這句只連了 Pinecone，Bedrock 的出處 kb-test-config 有列在參考資料、正文沒連。
  - 改法：中「Bedrock 和 Pinecone 的「大於、小於」比較都只接受數字（[Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/kb-test-config.html)、[Pinecone](…)），OpenAI 的日期範例也用 Unix 時間戳」；英 "Bedrock's and Pinecone's greater-than and less-than comparisons accept only numbers ([Bedrock](…), [Pinecone](…)), and OpenAI's date examples also use Unix timestamps"。
- 🟢 **多值與掛在哪一層（L66–67）**：Pinecone 第 369–389 行清單型欄位；OpenAI 第 476、1496 行 "at most 16 keys"、掛在 vector_store.file；Pinecone 第 17 行掛在每筆紀錄。相符。
- 🟢 **清理後另存一欄（L69）**：Azure 第 161 行 Note "To return the original, uncleaned chunk as the query result, add an extra field to store the cleaned and vectorized data"；清理步驟有 lowercasing、移除 Unicode（第 167–177 行），正文「去掉符號、統一大小寫」對得上。Bedrock 那句是類比（它講的是 metadata，不是清理），用「做法也一樣」可以接受。
- 🟡 **Poliakov 2026：值不在清單不等於「什麼都找不到」（L75）**
  - 原句：中「過濾條件寫了一個不存在的值，就什麼都找不到」；英 "A filter with a value that doesn't exist finds nothing"。
  - 依據：49／128／79 正確（摘要第 10–11 行、引言第 38–39 行）。原文的說法是 "Many of its filters therefore refer to sources that the vector store does not contain"（第 39–40 行）；過濾條件是 `$in` 清單，一題可能同時有存在和不存在的值，論文也沒有量端到端檢索（poliakov-2026 紀錄第 16、35 行）。
  - 改法：中「過濾條件指向知識庫裡沒有的來源，那個來源的文件就一份也撈不到」；英 "A filter that names a source the store doesn't contain retrieves nothing from that source"。
- 🟡 **英文「one in seven」和 15.57% 對不上（L76，英）**
  - 原句：英 "a date condition was extracted for only about one in seven"；中「只有一成多的題目抽出了日期條件」。
  - 依據：第 204–206 行 15.57%，約六分之一（16.7%）；七分之一是 14.3%。中文「一成多」正確。
  - 改法：英 "for only about one in six"。
- 🟡 **Dadopoulos 只寫了壞的一半（L77）**
  - 原句：中「讓 LLM 先挑檔案、再改寫查詢，找回正確內容的比例反而下降；用 metadata 擴充段落，答案裡沒有根據的內容還變多了」；英同。
  - 依據：兩個數字方向都對（Claim Recall 50.7 → 47.7；chunk expansion 幻覺 14.7 → 22.2）。但同一張 Table 1 也顯示，把 LLM 產生的 metadata 接到段落前面再建向量（Ctx），五組比較的最終答案 F1 全部提高（第 733–734 行 "In every single head-to-head comparison"），作者總結第 3 點把它列為 "a consistent and significant performance boost"。L29 剛介紹過 Bedrock 的同類開關，只引失敗會讓讀者以為 metadata 併入向量也有害。樣本 150 題也沒寫。
  - 改法：句尾補中「；不過同一研究裡，把 metadata 接到段落前面再建向量，最終答案的品質在每一組比較都比較好。這份測試只有 150 題」；英 "; in the same study, though, prepending metadata to chunks before embedding improved final answers in every comparison. The test had only 150 questions"。
- 🟢 **Terrenzi 約一半（L78）**：Table 2 supported 0.5283；Table 1 metadata rewrite 在 BM25（0.4782）與 dense（0.5766）nDCG@10 都最高。「檢索分數最好，只有約一半的主張有原始資料支持」正確。
- 🟢 **Content Understanding 信心分數（L80）**：Azure 第 275 行 "Each extracted field value includes a confidence score (ranging from 0 to 1) and source grounding"。相符。
- 🟢 **例子的特休天數（L86、L94）**：「滿一年 7 日、滿兩年 10 日」與台灣勞動基準法第 38 條（一年以上二年未滿 7 日、二年以上三年未滿 10 日）一致；英文版沿用同一組數字，作為例子可以。

## post-review

- 🟡 **例子突然冒出「2023 版」，而且混了兩種 metadata 用法（L88–99）**
  - 原句：L99 中「用「狀態＝現行」過濾，2023 版也不會」；英 "filtering on "status = current" keeps out the 2023 version"。L90–92 把 metadata 寫成段落前面的文字。
  - 依據：開頭 L17 與例子前文只講台北／新加坡兩份，沒有舊版；讀者不知道 2023 版從哪來。另外 L90–92 的寫法是「接到段落前面」（Bedrock 開關打開、Yousuf 的前綴法），L99 用的卻是過濾欄位；L29 剛講過這是同一欄位的兩種用法，例子沒點出來，讀者會以為寫在段落前面就能過濾。
  - 改法：L96 前加一句中「假設台北這份去年也改過版，2023 版還留在知識庫裡。下面的「適用」「生效」三行同時存成過濾欄位，也接在段落前面參與比對。」；英 "Suppose the Taipei policy was also revised last year and the 2023 version is still in the knowledge base. The "applies to" and "effective" lines are stored as filter fields and also prepended to the chunk for matching."
- 🟢 **範圍卡覆蓋（Order 15）**：常用欄位八項（ID、來源、標題路徑、日期、版本、語言、適用範圍、權限標籤）都在 L45–56 表內，另加文件類型與負責人；三種用途改照 Azure，「排序」保留在生效日期一列；精確比對（L35–37）、日期與版本是 order 18 前提（L58）、LinkedIn（L39）、清理後另存一欄（L69）都寫到；不講的權限強制指路 order 17（L19、L56）。
- 🟢 **例子照範圍卡**：「同一段文字有無標題路徑與日期時，檢索與回答的差別」，L84–99 有前後對照與回答引用路徑。
- 🟢 **自我檢查（L114–118）**：照範圍卡「才能在檢索時過濾」，另補固定選項與檔案層拆檔兩個前提，都是正文講過的。
- 🟢 **與 order 12、13 的銜接**：L19 接 order 13；order 13 L60 預告「order 15 會談標題路徑這類 metadata」；order 12 L64 預告「order 15 會談 metadata 怎麼設計」。L58「order 12 盤點表裡的負責人、版本狀態，到這裡就變成欄位」對到 order 12 盤點表的「負責人」「版本狀態」兩欄（第 43、46 行）。L55 的 order 9、L56 的 order 17、L58 的 order 18 都是範圍卡裡對應的篇。
- 🟢 **站內連結都存在**：`/posts/learning/2026-10-22-ai-kb-parsing-cleaning`、`/posts/ai/2026-03-12-contextual-retrieval`、`/posts/ai/2026-09-03-hierarchical-chunking-auto-merge`，中英版都在，後兩篇是範圍卡的連結欄。
- 🟢 **參考資料每條都讀過全文**：Azure、Bedrock 兩頁、OpenAI（補成全文 2,036 行）、Pinecone、Microsoft Learn（order 12 已全讀 `o12-ms-ess.md`）、Yousuf、Xu、Poliakov 兩篇、Dadopoulos（正文全讀，參考文獻讀到第 1,019 行）、Terrenzi 的紀錄都是 read_status=full。
- 🟢 **固定選項可以多一個官方依據（L65，可選）**：Microsoft Learn 第 187 行建議用 managed metadata 建 term sets（國家／地區、文件類型等）。可補中「SharePoint 的做法是先建好詞彙集，讓欄位只能從裡面選」；英 "SharePoint's approach is to define term sets up front so a field can only take values from them"。
- 🟢 **限制段（L105）**：Yousuf 120 題、LinkedIn 題數未公開、各研究的語料都寫了；「過濾欄位從來源系統取值」標成作者推出的原則，只說一次，不堆疊。

## post-polish

- 🟡 **兩句 108 字（L29、L39）**
  - L29 原句：中「Amazon Bedrock 的知識庫有一個開關把這件事講得很清楚：關掉時，……；打開時，……，但回傳的原文裡不會出現這些 metadata」。改法：中「Amazon Bedrock 的知識庫有一個開關，把這件事講得很清楚。關掉時，metadata 只用來過濾，不影響語意搜尋。打開時，metadata 會在建向量之前接到每一段的前面，問題裡提到這些值就會加分；但回傳的原文裡不會出現這些 metadata（[…](…)）。」英 "Amazon Bedrock knowledge bases have a switch that makes this clear. When it's off, metadata is used only for filtering and doesn't affect semantic search. When it's on, metadata is prepended to each chunk before embedding, so questions mentioning those values score higher, but the metadata doesn't appear in the returned original text (…)."
  - L39 LinkedIn 句：照 post-verify 的改法改完後，在「而不是切成固定長度的段落」後斷句，「整套系統的檢索表現和上線後的解決時間都有改善」另起一句。
  - 依據：register-scan 長句 10 句／約 80 句（約 12%），在閾值邊緣；這兩句最長，各塞三件事。
- 🟡 **tldr 五句、約 190 字（L8）**
  - 依據：寫作指南「tldr：1–2 句」。
  - 改法：中「metadata 有三種用途：回傳給人引用、參與搜尋、檢索前過濾；型號、年份、地區這種精確條件要放在欄位裡，一項研究把公司和年份寫在每段前面，前五名找到正確段落的比例從 33% 升到 55%。過濾用的欄位從來源系統取值、用固定選項、日期存成數字，不要讓 LLM 自由產生。」；英 "Metadata serves three purposes: returned for citation, used in search, and used to filter before retrieval; exact conditions like model, year or region belong in fields, and one study that wrote the company and year in front of every chunk raised top-five hits from 33% to 55%. Take filter values from source systems as fixed options, store dates as numbers, and don't let an LLM generate them freely."
- 🟢 **數字密度**：L37、L39、L64 各 4–5 個；L75 的 Poliakov 一條 6 個（2026、GPT-3.5、49、128、79），三個數字正是這條的重點，保留。
- 🟢 **引述區塊 5（L86、L90–94）**：都是例子的段落文字，不是引用來源，保留；也可改成程式碼區塊，讓讀者看出這是「存進去的樣子」。
- 🟢 **其他指標**：但書段落 6/38（15%）、姓名當主詞 1、模板化轉折 0、一般英文術語 0；`check:tw` 0 blocking 0 review；`scan-ledger` 無命中；`check-process-leak.mjs` 通過。
- 🟢 **標題（L2）**：「結構與 metadata：除了內文，每份文件還要記哪些欄位」和同系列 order 12、14、17 一樣是「主題：問題」；英文 "Structure and Metadata: Which Fields to Record Besides the Text" 意思一致。
- 🟢 **圖解**：常用欄位已是表格，例子是前後對照；可選加一張 `diagram` 畫「問題 → 過濾（地區＝台北、狀態＝現行）→ 語意搜尋 → 回傳附來源」，對應 L31 的「過濾在搜尋之前」。

## 修正紀錄（2026-10-22）

- 🔴 與 🟡 主要項目已採用（中英同步）；部分長句潤稿與 🟢 視為可選，未全改。
