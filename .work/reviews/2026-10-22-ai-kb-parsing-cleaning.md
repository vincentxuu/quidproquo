# Review — 2026-10-22-ai-kb-parsing-cleaning（order 13）

- 檔案：`src/content/posts/learning/2026-10-22-ai-kb-parsing-cleaning.md`（中，128 行）、`-en.md`（英，128 行）。中英行號一一對應，下文「L29」指中英兩檔的第 29 行。
- 審稿日期 2026-10-22。審稿者：獨立審稿員（沒參與寫作與精讀）。只寫報告，沒有改文章。
- 證據：`.work/research/building-knowledge-bases/extractions/_spotcheck-batch9.md` 第 10–17 節，以及本次回 `scratchpad/fulltext/o13-*` 的追加核對；ColPali 附錄已在任務 C 補讀完（紀錄「附錄補讀」節）。規劃表範圍卡：`.work/series-plans/building-knowledge-bases.md` 的 Order 13。
- 統計：🔴 1、🟡 8、🟢 21。

## post-verify

- 🟢 **OmniDocBench 多欄與旋轉表格（L23、L25）**：`o13-omnidocbench.txt` 第 486–488 行 "Across all models, we observe a clear drop in accuracy on multi-column and complex layouts"；MinerU "incorrectly merges multiple columns"（全文檔 830–838，補充行 117–125）；Table 7 Rotate 欄 TEDS 8.5–30.5（無旋轉 72.1–83.9），補充第 728–729 行 "table rotation significantly …"。相符。
- 🟢 **Docling Markdown 攤平合併儲存格（L25）**：`o13-docling-docs.md` 第 320–334 行 "Markdown tables have no span syntax … rendered as empty cells"、"prefer export_to_html() or export_to_dict() over export_to_markdown()"。相符。正文寫「HTML 或 JSON」，`export_to_dict` 就是 JSON 結構，可以。
- 🟢 **Azure 要決定是否忽略的項目（L27）**：`o13-azure-rag-preparation.md` 第 181–197 行六問（目錄、頁首頁尾、版權免責、註腳尾註、浮水印、註解），並寫 "these elements can add valuable context … but not all"。正文「逐一判斷，不是一律刪掉」符合原意。
- 🟡 **Santos 的 caça → caca 寫成了實測結果（L29）**
  - 原句：中「Santos 等人 2026 年用葡萄牙陸軍的人事行政文件測試，「caça」（獵物）常被認成「caca」（糞便）；這類錯字會直接讓檢索找不到那一段」；英 "… where "caça" … was often misread as "caca" (excrement); typos like these directly stop retrieval from finding the passage"。
  - 依據：`o13-santos2026.txt` 第 140–145 行在引言："the letter in Portuguese "ç" is often misrecognized across multiple conversion tools, an error that directly corrupts retrieval results … The word "caça" … **may be** recoded to "caca""。「常被認錯」的主詞是「ç」這個字母，caça → caca 是舉例；第 1184–1186 行的 promoçao 也是假設句（"might not match"）。另外這是各種轉換工具的問題，不限掃描檔 OCR。
  - 改法：中「Santos 等人 2026 年處理葡萄牙陸軍的人事行政文件時發現，葡文的「ç」常被各種轉換工具認錯；作者舉的例子是「caça」（獵物）一旦被讀成「caca」，意思就變成糞便，這類錯字也會讓檢索對不上那一段」；英 "Working with Portuguese Army personnel documents, Santos and colleagues found in 2026 that the Portuguese letter "ç" is often misread by conversion tools; their example is "caça" (game) turning into "caca" (excrement), and errors like this also stop retrieval from matching the passage"。
- 🟢 **OHRBench 約 14%（L29）**：`o13-ohrbench.txt` 第 399–401 行 "Even the best solutions experience a 14% (5 F1-score) drop in the overall stage evaluation"；Table 2 GT 36.1、最好的 Qwen2.5-VL-72B 31.1，5.0/36.1 = 13.9%，是相對降幅。正文「低了約 14%」正確。
- 🟢 **ColPali：Unstructured 純文字設定濾掉圖表（L31）**：`o13-colpali.txt` 第 258–260 行逐字相符；附錄 Table 6 純文字版圖表類任務無分數，支持這句。
- 🟢 **Docling WMF（L31）**：docs 第 909 行 "able to handle embedded WMF images only on Windows platform … these images will be ignored"。相符。
- 🟢 **InduOCRBench 合約例（L33）**：`o13-induocrbench.txt` 第 210–224 行（"ninety (90)" "$5,000" 劃掉、OCR 後變成 "ninety (90) sixty (60) days" "$5,000 $2,000"、"drafting errors"）。相符。
- 🟢 **Docling「silently … no error, just fewer levels」（L35）**：docs 第 1151 行 "style inference is skipped silently — no error, just fewer levels"。條件是沒開 `generate_parsed_pages=True`、解析過的 PDF cell 被丟掉，正文概括成「缺少需要的字型資訊」可以接受。
- 🟢 **OHRBench MinerU vs Marker（L41）**：Table 2 第 372–373 行，編輯距離 MinerU 0.24 < Marker 0.28，檢索 ALL 50.1 < 56.6；英文引號內的 "do not always align" 是第 407 行原文。正文只說檢索比較低，沒有說 MinerU 整體較差（端到端其實 30.0 > 29.5），寫法正確。
- 🟡 **InduOCR「因為文字都對了」說過頭（L41）**
  - 原句：中「OCR 分數 82.9%，問答只答對 52.8%，因為文字都對了，帶意思的格式卻丟了」；英 "because the text was right but the meaningful formatting was lost"。
  - 依據：第 272–276 行 "82.9% OCR accuracy yet only 52.8% RAG accuracy (30.1% discrepancy). OCR systems discard visual formatting cues"。82.9% 不是「都對」。數字 82.9／52.8 正確（同篇 Figure 3 圖說寫 53.0、另一處寫 30.2 點，論文自己前後不一，正文用 52.8 是對的）。
  - 改法：中「因為字大多認對了，帶意思的格式卻丟了」；英 "because most of the characters were right but the meaningful formatting was lost"。
- 🟡 **「跨頁表格斷開，靠上下文救不回來」和原文相反（L43）**
  - 原句：中「作者的整理是，模型補得回字錯，補不回結構錯：欄位錯位、閱讀順序錯亂、跨頁表格斷開，這些靠上下文救不回來」；英 "… and tables split across pages can't be rescued from context"。
  - 依據：第 283–296 行 "CrosspageTbl at 40.7% OCR and 63.8% RAG shows **partial LLM compensation** with RAG exceeding OCR by 23.1 points yet remains below layout intact categories"；第 292–298 行 "semantic loss is less recoverable than structural fragmentation"；第 274–276 行（右欄）"OCR errors affecting structural coherence are often harder to compensate for than errors affecting character fidelity alone"。作者的排序是：字錯最好補、結構錯較難、格式語意最難。跨頁表格是「補回一部分、仍明顯偏低」。浮水印、複雜背景那句（80.5→90.2、77.4→88.7）相符。
  - 改法：中「作者的整理是，模型補得回零星的字錯，結構錯就難得多：欄位錯位、閱讀順序錯亂時幾乎補不回來，跨頁表格斷開只補回一部分；而上面那種格式丟失最難補」；英 "The authors' summary is that models can repair scattered character errors, but structural errors are much harder: misaligned columns and scrambled reading order barely recover, tables split across pages recover only partly, and lost formatting like the strikethroughs above is hardest of all"。
- 🟡 **Santos「四種工具都用同樣的遞迴切塊」：實際是三種（L49）**
  - 原句：中「四種工具都用同樣的遞迴切塊時，最簡單的 PDFLoader 答對率最高，Docling 次之」；英 "With all four tools using the same recursive chunking …"。
  - 依據：Table 4（第 668–693 行）只有 PDFLoader（config 1）、MinerU Pipeline（config 2）、Docling（config 16）三種跑了遞迴切、K=200、無轉換；第 764–766 行原文 "Comparing the **three** automated frameworks using recursive splitting at K = 200, with no additional transformations or metadata, PDFLoader (86.2%) … followed by Docling (84.7%) and MinerU Pipeline (82.8%)"。MinerU VLM 與 DeepSeek OCR 用的是 Markdown 遞迴切。L47「比較了四種轉換工具」本身沒錯（第 34、442 行 "four"）。
  - 改法：中「其中三種自動工具都用同樣的遞迴切塊、不做其他轉換時，最簡單的 PDFLoader 答對率最高（86.2%），Docling 次之（84.7%）」；英 "When three of the automated tools used the same recursive chunking with no other transformations, the simplest, PDFLoader, scored highest (86.2%), followed by Docling (84.7%)"。
- 🟢 **Santos 84.7→91.2、66.6→99.8、50 題／9 題（L8 tldr、L50、L52）**：config 16 → 19 第 690、693 行，第 809–813 行 "a 6.5-percentage-point improvement … the largest single-factor gain observed in the benchmark"；Table 6 第 880 行 66.6 → 99.8、第 894–896 行 "33-percentage-point gain"；第 507 行 50 題、Table 6 Table-dependent N=9。「階層切塊與標題路徑同時打開」符合 Table 4 的 Splitting＝Hierarchical Recurs. 與 Hier. Meta＝Yes 同時切換。「比較只在 Docling 內部做」在自動工具中成立（手做 Markdown 基準 config 12–15 也是階層切）。
  - 補充（可選）：同一張 Table 6 裡，階層相關題 Docling 從 90.3 掉到 88.8，「其他類別都進步 0.8–1.3 點」的原文說法不含這一類。正文沒寫其他類別，不必改。
- 🟢 **Azure 中介格式原句與存檔建議（L54、L64、L68）**：`o13-azure-rag-chunking.md` 第 240 行 "Avoid converting documents to an intermediate format if you choose to separate the processes. This type of operation can result in data loss."；第 220–222 行 persist 後在切塊前檢查；`o13-azure-rag-preparation.md` 第 297 行 "Have at least two pieces of content for each content variant and format"。相符。Docling 原生 chunker 附 headers 與 captions 對到 docling 紀錄第 7 點。
- 🟢 **ColPali「高了十幾分」與 Most 方向（L58）**：ColPali Table 2 平均 81.3 vs Unstructured＋OCR 66.1、＋圖說 67.0（差 14–15 分）；附錄 C.1 Recall@1 72.7 vs 55.9–57.5 方向相同。Most Table 1 劣化資料集 MRR Llama OCR 0.4852 > ColQwen2 0.2471，結論第 532–535 行 "OCR-based approaches offer improved retrieval and generation performance in all evaluated settings"（不微調時）；唯一反向是 ColQwen2 微調過的 ViDoRe。「好的 OCR 管線勝出」用詞正確（Nougat 在未劣化的 Level 0 輸給 ColQwen2，所以不能寫成任何 OCR 都贏，正文沒這樣寫）。InduOCR 的 GPT-5 看影像 73.54% → 52.92%、標準答案下 89.76% vs 53.97%，「也沒有比較好」是保守寫法。
- 🟢 **Docling 信心分數、表格項未實作（L64）**：docs 第 345–388 行，`table_score` "(not yet implemented)"。相符。
- 🟡 **限制段：InduOCR 的格式題不是 LLM 生成（L100）**
  - 原句：中「OHRBench 和 InduOCRBench 的題目由 LLM 依標準答案生成，標準答案本身有優勢」；英 "OHRBench's and InduOCRBench's questions were generated by an LLM from the ground-truth text …"。
  - 依據：OHRBench 第 293–298 行由 GPT-4o 依標準結構化資料生成，正確。InduOCRBench 附錄 D.1（第 594–613 行）多數類別由模型生成，但 VisualStyle 不用模型題、改用人工設計的題目（sun 紀錄第 40 行）。正文最重要的 82.9／52.8 正是 VisualStyle，這個例外反而讓那組數字更可信，不該被一句「LLM 生成」一起打折。
  - 改法：中「OHRBench 和 InduOCRBench 多數題目由 LLM 依標準答案生成，標準答案本身有優勢；不過 InduOCRBench 的刪除線、顏色標記那一類是人工出題」；英 "Most of OHRBench's and InduOCRBench's questions were generated by an LLM from the ground-truth text, which favors the ground truth; InduOCRBench's strikethrough and color-mark category, however, used hand-written questions"。

## post-review

- 🔴 **例子的 Markdown 輸出自己把答案寫出來了，和開頭與結論矛盾（L81、L90、L96，以及 L17）**
  - 原句：原表「| 進階（含團隊版） | 1 TB（兩種方案共用） | 900 元 |」；匯出後「| 進階（含團隊版） | 1 TB（兩種方案共用） | 900 元 |」「| 團隊 |  | 1,500 元 |」；結論「「團隊」那一列的儲存空間變成空白，模型只能猜」。英文同（"Pro (includes Team)" "1 TB (shared by both plans)"）。
  - 依據：Docling 攤平時只把合併儲存格的原文字寫在起始格（docs 第 322–334 行），不會替你加「兩種方案共用」或在方案名後加「含團隊版」。這兩段括號是作者在原表上給讀者看的說明，卻原封不動出現在「解析後」的輸出裡。照這份輸出，模型讀到「進階（含團隊版）…1 TB（兩種方案共用）」就答得出團隊方案是 1 TB，「只能猜」與 L17「AI 答『文件沒有寫』」都不成立。例子是全篇唯一的前後對照，讀者會照它理解「表格攤平」為什麼危險。
  - 改法：原表改成「| 進階 | 1 TB | 900 元 |」「| 團隊 | （與上一格合併） | 1,500 元 |」，並在表下用一句說明「進階與團隊共用一格 1 TB」；匯出後改成「| 進階 | 1 TB | 900 元 |」「| 團隊 |  | 1,500 元 |」。英文：原表 "| Pro | 1 TB | $30 |" "| Team | (merged with the cell above) | $50 |"，表下 "Pro and Team share one 1 TB cell"；匯出後 "| Pro | 1 TB | $30 |" "| Team |  | $50 |"。
- 🟡 **範圍卡的「版面分析工具的類型（以 Docling 為例）」沒有寫到**
  - 位置：全篇；Docling 只以「它的文件怎麼說」出現（L25、L31、L35、L54、L64）。
  - 依據：範圍卡 Order 13「講」含「版面分析工具的類型（以 Docling 為例）」。Azure chunking 紀錄有現成材料：第 379–391 行 "Document layout analysis libraries and services combine OCR capabilities with deep learning models to extract both the structure and the text"，舉 Document Intelligence、Donut、Layout Parser，並說 "You still have to write code that interacts with the model"；OmniDocBench 也把工具分成 pipeline、專用 VLM、通用 VLM。讀者看完知道「會壞什麼」，但不知道手上有哪幾類工具可選。
  - 改法：在「六種常見的壞法」前或「比起換工具」節開頭加一段，中「解析工具大致分三類：只抽文字層的（例如 PDFLoader）、先做版面分析再抽文字的（Docling、雲端的 Document Intelligence），以及直接讓視覺語言模型讀頁面的。版面分析類會額外辨識標題、表格、頁首頁尾、圖片，這篇的六種壞法多半就是在這一步發生或被避免」；英 "Parsers fall roughly into three kinds: ones that only extract the text layer (e.g. PDFLoader), ones that run layout analysis first (Docling, or cloud services like Document Intelligence), and vision-language models that read the page directly. Layout analysis also identifies headings, tables, headers and footers and images, and most of the six failures here either happen or are avoided at that step"。或在範圍卡註明這項刻意不寫（「不做工具排名」）。
- 🟢 **六種壞法與抽檢清單一致（L21–35、L70、L113）**：L70 的六個問句、L105 的打勾、L113 自我檢查的列舉，順序與內容都對到六節。範圍卡的五種壞法加了「格式消失」一種，有 InduOCR 證據支撐，合理。
- 🟢 **自我檢查與範圍卡一致（L111–113）**：「解析沒報錯 ≠ 內容正確，要抽檢對照原檔」，照範圍卡。
- 🟢 **銜接**：L19 連回 order 12（中英檔都存在）並預告 order 14、16；L52 預告 order 15、16；L71 用 order 11 的測試題反查；L104 從 order 12 盤點表挑文件。order 12 L19 預告「檔案怎麼轉成文字留給 order 13」，接得上。站內連結 `/posts/ai/2026-09-03-colpali-visual-document-retrieval`、`/posts/ai/2026-09-03-table-serialization-rag`（中英都存在）都對到範圍卡的連結欄。範圍卡另列 `vision-pdf-parse-too-fast-for-aws`、`ragflow-document-rag-platform` 兩篇沒有連，可選。
- 🟢 **參考資料都讀過全文**：L117–126 十條外部來源都有抽取紀錄，read_status=full（ColPali 在任務 C 補讀附錄後改為 full；Most 1–230 以 Exa 段落讀、與本機檔同文）。Docling 首頁那條對到 docs 檔的首頁段。

## post-polish

- 🟡 **長句：L33 一句 89 字**
  - 原句：中「Sun 等人 2026 年舉了一個合約的例子：原文把「90 天」和「5,000 美元」劃掉，改成「60 天」和「2,000 美元」；OCR 丟掉刪除線之後，兩個數字並排出現，模型還把這個矛盾解釋成「起草錯誤」」。
  - 依據：`register-scan.sh` 長句第一名（89 字）、該段 7 個數字（數字密度最高）。
  - 改法：中「Sun 等人 2026 年舉了一個合約的例子。原文把「90 天」和「5,000 美元」劃掉，改成「60 天」和「2,000 美元」。OCR 丟掉刪除線之後，新舊數字並排出現，模型還把這個矛盾解釋成「起草錯誤」。」；英文已分號斷開，改成兩句即可："… replaced them with "60 days" and "$2,000". Once OCR dropped the strikethroughs, old and new numbers appeared side by side, and the model explained the contradiction as a "drafting error"."
- 🟡 **L52 限定段 79 字一句，三個限定擠在分號裡**
  - 原句：中「這裡有幾個限定要知道：整份測驗只有 50 題，表格題只有 9 題；階層切塊和標題路徑是同時打開的，研究沒有拆開量各自的貢獻；比較只在 Docling 內部做，其他工具沒有跑階層切塊。」
  - 依據：寫作指南長文第 6 條「但書換位置，不要堆疊」；這段本身放在節末是對的，只是一句塞三件事。
  - 改法：中改成三點條列「- 整份測驗只有 50 題，表格題只有 9 題。- 階層切塊和標題路徑同時打開，沒有拆開量。- 自動工具裡只有 Docling 跑了階層切塊。」；英同樣拆成三點。
- 🟢 **其他長句（L23、L25、L50、L54）**：64–76 字，共 13 句超過 60 字；多數是引用句，可保留。
- 🟢 **掃描結果**：但書段落 3/36（8%）、引述區塊 0、`check:tw` 0 blocking 0 review、`scan-ledger` 台灣用語高風險 0。模板化轉折只有 L27「不是一律刪掉」一處，語意需要，保留。
- 🟢 **標題（L2）**：「解析與清洗：PDF、表格、掃描檔轉成文字時，哪些東西會悄悄壞掉」冒號後有實體（PDF、表格、掃描檔），符合站上格式；後半是問句，字數偏長，可選擇縮成「解析與清洗：PDF、表格、掃描檔轉文字時會壞的六個地方」。英文同。
- 🟢 **圖解**：沒有圖。「怎麼抽檢」五步是線性流程，可以考慮畫一張 `diagram`；例子表本身已是前後對照，修好 🔴 之後就夠用。

## 修正紀錄（2026-10-22）

- 🔴 與所有 🟡 都已採用（中英同步）；🟢 視為可選，未改。

