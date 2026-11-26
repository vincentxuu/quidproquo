# Review — 2026-10-22-ai-kb-source-inventory（order 12）

- 檔案：`src/content/posts/learning/2026-10-22-ai-kb-source-inventory.md`（中，115 行）、`-en.md`（英，115 行）。中英行號一一對應，下文「L23」指中英兩檔的第 23 行。
- 審稿日期 2026-10-22。審稿者：獨立審稿員（沒參與寫作與精讀）。只寫報告，沒有改文章。
- 證據：`.work/research/building-knowledge-bases/extractions/_spotcheck-batch9.md` 第 1–9 節，以及本次回 `scratchpad/fulltext/o12-*` 的追加核對。規劃表範圍卡：`.work/series-plans/building-knowledge-bases.md` 的 Order 12。
- 統計：🔴 1、🟡 10、🟢 17。

## post-verify

- 🟢 **HoH「兩成多」／"more than 24%"（L8 tldr、L23）**
  - 原句：中「上下文裡只要多一段過時的資料，Llama 70B 的總分就降了兩成多」；英 "cut Llama 70B's overall score by more than 24%"。
  - 依據：`o12-hoh.txt` 第 459–464 行 "overall scores decrease by more than 24%"。同 n 配對 Table 4 → Table 5：n=1 89.12 → 67.00（相對降 24.8%）、n=2 25.4%、n=3 26.2%，對得上。抽取紀錄的「89.12 → 72.95」換算是錯的（只有 18%），但正文沒用那組數字，不受影響。
  - 改法：不必改。想讓中英同精度，中文可寫「降了兩成五左右」；英文維持。
- 🟢 **「多放六段干擾，分數幾乎沒變」（L23）**：Table 4 n=1 89.12 → n=6 87.98，原文 "decreasing by under 2%"。相符。
- 🟢 **「只撈到舊資料比沒撈到更危險」「主動誤導，不只是雜訊」（L23）**：第 401–411 行 "outdated information (O) poses a greater risk than having no relevant information at all" 與 "actively misleads models rather than merely adding noise"。相符。
- 🟢 **時間衰減「將近一半」、新資料命中率下降（L25）**：Table 2 Gauss top-5 O 0.4950、R 0.8707 → 0.7023；第 466–471 行 "nearly 50% probability" "dropping by approximately 17%"。相符。
- 🟡 **Deasy 的說法沒有在用到的那段標成廠商資料（L25）**
  - 原句：中「Deasy Labs 的報告講得更直白：內容幾乎一樣的兩份文件，在向量空間裡也幾乎在同一個位置，檢索模型沒有理由偏好其中一份，所以兩份都會被撈到」；英 "A Deasy Labs report puts it more bluntly: …"。
  - 依據：`o12-deasy.txt` 第 33–35 行原句相符，但這是廠商（"By the Deasy Labs team at Collibra"，第 12 行）的論述段，不是量測；同一份報告賣的是 latest-version detection。正文只在 L89 限制段才說它是廠商評估。寫作指南長文第 7 條要求用可驗證的軸區分，讀者在 L25 做判斷時看不到。
  - 改法：中「資料治理廠商 Deasy Labs（Collibra 旗下）的白皮書這樣解釋：……」；英 "A white paper from Deasy Labs, a data-governance vendor owned by Collibra, explains it this way: …"。L25 這句同時是「靠檢索分不出新舊」的第二根支柱，HoH 已有量測，Deasy 只當補充說明即可。
- 🟢 **VersionRAG 55%／35%（L27）**
  - 依據：`o12-versionrag.txt` Table 7（第 843–853 行）DeepSeek-R1 70B 的 Naive RAG；正文第 377、395 行也寫 55%、35%。錯誤裡最大的一類是版本混雜（附錄 D.3，42 個錯誤百分點中占 25 點）。範圍卡寫的「58%」已正確改掉。
  - 改法（可選）：中「一般 RAG（用三個模型中最強的 DeepSeek-R1 70B）」；英 "standard RAG (with the strongest of the three models, DeepSeek-R1 70B)"。換成較小的模型只會更低，不改結論。
- 🟡 **Ross：中文沒說副本是直接放進上下文（L29）**
  - 原句：中「Ross 等人 2026 年測試把同一份文件重複放好幾份，答案的正確率沒有顯著變化」；英 "putting several identical copies of a document in the context and found no significant change"。
  - 依據：`o12-ross2026.txt` 實驗直接控制上下文、不經檢索（紀錄研究設計、第 86–87 行 "not necessarily mimicking what real retrievers produce"）；Finding 1 第 397–403 行另有兩個例外（1B 在 k=2–3 小幅上升、3B 在 k=5 降 0.033）。中文「重複放好幾份」容易被讀成「索引裡放好幾份」，和下一句「副本會佔掉檢索的名額」接在一起時會誤導。
  - 改法：中「Ross 等人 2026 年把同一份文件的完全相同副本直接放進模型的上下文，放一到五份，答案的正確率大致不變（[Ross et al. 2026](…)）」；英 "put one to five identical copies of a document directly into the model's context and found answer correctness essentially unchanged"。
- 🟢 **「擠掉其他段落，這篇沒有測」（L29）**：Ross 第 44 行引言自己列出 "may also crowd out complementary evidence"，實驗沒測。正文的限定正確。
- 🟢 **OWASP 知識衝突（L31）**：`o12-owasp-llm08.md` 第 73、79 行 "Data federation knowledge conflict errors can occur when data from multiple sources contradict each other"；防範第 147 行 "thoroughly review the combined dataset. Tag and classify data"。相符，連結用 canonical 網址也對。
- 🟡 **Soni 盤點建議與範例：無法回查（L35、L49、L53）**
  - 原句：L35「每個來源記下負責人、多久變一次、有沒有敏感欄位、存取規則，以及一個處理方式；而處理方式是最重要的一欄」；L49 四種處理方式；L53「沒有明確負責人的全公司搜尋，你連結果對不對都判斷不了」。
  - 依據：dzone 紀錄沒有存全文檔，抽查依任務書不上網，三項都無法回查（`_spotcheck-batch9.md` 第 9 節）。和紀錄內容一致，但不算核對過。
  - 改法：發布前補抓 DZone 全文存成 `fulltext/o12-dzone.md`，對過這三處再發。文章本身不用改。
- 🟡 **「訂單狀態即時查」掛在 Soni 名下（L49）**
  - 原句：中「Soni 的經驗法則是：……例如客服文章收進索引，訂單狀態即時查，帳務資料不收」；英 "For example, index help-center articles, fetch order status live, and leave billing records out"。
  - 依據：dzone 紀錄的範例表是 Help-center articles → Index、**Ticket history** → Live fetch、Billing records → "Exclude from index; live lookup only"。「訂單查詢走 API」是 Microsoft CAF 的例子（`o12-ms-caf-data.md` 第 182 行 "Order tracking: API call"）。另外帳務資料在 Soni 表裡是「不收進索引、需要時即時查」，不是「不收」。
  - 改法：中「例如客服文章收進索引，歷史工單即時查，帳務資料不進索引、需要時才即時查」；英 "For example, index help-center articles, fetch ticket history live, and keep billing records out of the index, looking them up live only when needed"。
- 🟢 **Microsoft ESS 的欄位、試行、只留一份權威版本（L35、L53、L61）**：`o12-ms-ess.md` 第 179、183 行（owner、effective date、review date）、第 157、159 行（pilot、site owner）、第 198 行（Archive or delete … "current," "archived," or "superseded"）。相符。L35 的「要求」原文是 best practice，語氣可改成「建議」，不影響事實。
- 🟢 **Google 靜默失敗原句（L68）**：`o12-vertex-ingestion.md` 第 51 行 "Otherwise, no files are imported and no error message displays." 逐字相符；位置在 Google Drive 項下，正文也寫明是 Google Drive。
- 🟢 **去重推論有標明（L70）**：中「（這是我依它的規則推論的）」、英 "(that's my inference from its rules)"。第 65–73、103–105 行只寫了「同路徑、同檔名、內容 hash」三條件，推論方向正確，標示也在。全篇歸因標籤只有這一處，未超過寫作指南的 3 處上限。
- 🟡 **限制段：Ross 也是預印本、Deasy 舊版不是人手做的（L89）**
  - 原句：中「Huwiler 是作者自建的 100 題技術文件測驗、還是預印本，Ross 用的是虛構資料的短答題……那是廠商用自家工具做的評估，舊版也是人工造的」；英 "… and its old versions were constructed by hand"。
  - 依據：Ross 是 arXiv:2608.13956 預印本（紀錄「限制」節）。Deasy 第 47–48、172 行 "deliberately backdated"、"synthetically backdated near-duplicates"：是程式化造的回溯副本。中文「人工造的」可解為「人為造出」，英文 "by hand" 是錯的。
  - 改法：中「Huwiler 和 Ross 都還是預印本；Huwiler 是作者自建的 100 題技術文件測驗，Ross 用的是虛構資料的短答題……舊版也是刻意造出來的近似副本」；英 "Huwiler and Ross are both still preprints … and its old versions were synthetic near-duplicates with a few facts deliberately backdated"。

## post-review

- 🔴 **例子表的「產品規格」列違反正文自己的版本規則（L81）**
  - 原句：中「收現行版與上一版，標版本號」；英 "Current and previous version, labeled with version numbers"。
  - 依據：正文 L61–62 的規則是「只收現行版；舊版要收，就標版本和失效日期……而且預設不出現在一般查詢裡」，自我檢查 L102 也這樣寫。這一列沒有收舊版的理由、沒有失效日期、也沒有「不進一般查詢」，正好是 L27 VersionRAG 說的「不同版本的段落同時被撈出來」情境。讀者照抄這張表就會做出文章說會出錯的設定。同一張表的人資列（L78）是照規則寫的，兩列互相矛盾。
  - 改法：中「只收現行版；上一版若客服要查舊客戶，標版本號與停用日期、不進一般查詢」；英 "Current version only; if support needs the previous version for older customers, label it with its version and end date and keep it out of ordinary queries"。或乾脆改成「只收現行版，標版本號」。
- 🟡 **範圍卡的「內容分類與代表性抽樣」沒有寫到**
  - 位置：全篇；最接近的是 L55（由測試題出處決定第一批）。
  - 依據：範圍卡 Order 12「講」第一項含「內容分類與代表性抽樣」。正文有盤點欄位與第一批範圍，但沒有「每個來源抽幾份看內容長什麼樣、分成哪幾類」的步驟。order 13 L68 的「每種文件類型挑幾份」其實是同一個動作。
  - 改法：在「第一批收什麼」末尾加一句，中「填『格式與量』那欄時，每個來源隨手打開五到十份，看看內容分成哪幾類（規章、表單、會議紀錄、過期公告），order 13 抽檢解析時就從這幾類各挑兩份」；英 "When filling in 'Format and volume', open five to ten files from each source and note what kinds of content it holds (policies, forms, meeting notes, expired notices); order 13's parsing spot-check picks two from each kind"。或在範圍卡註明這項移到 order 13。
- 🟡 **處理方式「只當篩選條件」沒有例子（L47、L49、例子表 L76–83）**
  - 依據：L49 說四種，例子表六列只用到「收進索引」「即時查」「排除」三種。讀者不知道「只當篩選」長什麼樣。
  - 改法：例子表加一列，中「| 組織架構表 | 試算表，1 份 | 人資 | 每月 | 全員 | 單一版本 | 不收內文；部門、職稱只當篩選條件 |」；英 "| Org chart | Spreadsheet, 1 file | HR | Monthly | Everyone | Single version | Don't index the content; use department and title only as filters |"。
- 🟢 **判定現行版的順序可以掛來源（L64）**
  - 原句：中「判斷哪一份是現行版，要看文件自己寫的生效日期，其次才是系統的修改時間」。
  - 依據：Deasy 第 129–131 行 "starting with the effective date the document states about itself, then source-system timestamps, then extracted version identifiers"，順序完全一樣。
  - 改法（可選）：中句尾加「（Deasy Labs 的版本判斷也是這個順序）」；英 "(Deasy Labs' version detection uses the same order)"。
- 🟢 **自我檢查與正文一致（L100–102）**：問句與判準和 L61–62 一致，也照範圍卡寫。
- 🟢 **銜接**：L19 連回 order 11（`/posts/learning/2026-10-22-ai-knowledge-base-test-questions-first`，中英檔都存在），並預告 order 13、17；L55、L93 用 order 11 的測試題反推來源，和 order 11 L111、L189「交給 order 12」接得上；order 13 L19、L104 回連本篇的盤點表。站內連結 `/posts/ai/2026-08-22-private-corpus-sync`（中英都存在，屬「私有語料管線」系列 order 2）。
- 🟡 **L72 說「私有語料管線系列」，連結只指向其中一篇**
  - 原句：中「站內的[私有語料管線系列](/posts/ai/2026-08-22-private-corpus-sync)有更多同步與增量更新的細節」；英 "The [Private Corpus Pipeline series](…)"。
  - 依據：連結目標是該系列 order 2〈從來源到索引：私有語料的同步與增量更新管線〉，不是系列首頁；參考資料 L115 寫的是篇名。
  - 改法：中「站內〈[從來源到索引：私有語料的同步與增量更新管線](…)〉有更多同步與增量更新的細節」；英 "The site's post [From Source to Index: Sync and Incremental Updates for Private Corpora](…) covers syncing and incremental updates in more detail"。
- 🟢 **參考資料都有讀過全文的紀錄**：L106–114 九條，各有抽取紀錄且 read_status=full（Microsoft 兩頁合在 microsoft-copilot-content-lifecycle）。DZone 讀過但沒存全文檔，見 post-verify。

## post-polish

- 🟡 **長句：L29 一句 102 字**
  - 原句：中「所以清理副本的理由不是「重複會讓模型答錯」，而是兩件事：副本會佔掉檢索的名額，擠掉其他需要的段落（這篇沒有測這點）；以及很多「副本」其實不是真的一樣，就像開頭那份只差一個數字的「定稿(1)」，那才是答錯的主因。」
  - 依據：`register-scan.sh` 長句第一名（102 字），同時被 `scan-ledger.sh` 標成模板化轉折「不是 X，而是 Y」。
  - 改法：中「所以要清副本，理由有兩個。第一，副本會佔掉檢索的名額，擠掉其他需要的段落（這篇沒有測這點）。第二，很多「副本」其實不一樣，像開頭只差一個數字的「定稿(1)」，那才會讓模型答錯。」；英 "So there are two reasons to clean up copies. First, copies take up retrieval slots and push out other passages you need (this study didn't test that). Second, many 'copies' aren't identical, like the 'final(1)' in the opening that differs by one number, and those are what make the model answer wrong."
- 🟢 **其他長句（L17、L23、L25、L27、L31、L35）**：60–79 字，共 13 句超過 60 字。多數是「研究者＋年份＋發現」的引用句，拆開會讓出處離數字太遠，可保留；L25 若照 post-verify 改寫 Deasy 那句，順手拆成兩句即可。
- 🟢 **掃描結果**：但書段落 1/28（3%）、引述區塊 0、`check:tw` 0 blocking 0 review、`scan-ledger` 台灣用語高風險 0。英文版 register-scan 的「英文術語密度」對英文稿不適用。
- 🟡 **標題冒號後是問句，不是實體（L2）**
  - 原句：中「盤點來源：哪些文件該進 AI 知識庫，信哪個版本」；英 "Inventorying Sources: Which Documents Belong in an AI Knowledge Base, and Which Version to Trust"。
  - 依據：寫作指南 Title 原則「主題怎麼做：具體名詞列舉」——冒號後放實體。同系列 order 13 是「解析與清洗：PDF、表格、掃描檔……」，order 11 是「給 AI 讀的知識庫差在哪：動手前先寫測試題」。
  - 改法：中「AI 知識庫該收哪些文件：來源盤點表、第一批範圍、多版本與連接器」；英 "Which Documents Go Into an AI Knowledge Base: Source Inventory, First Batch, Versions and Connectors"。若想保留範圍卡標題，至少把「信哪個版本」換成名詞「版本規則」。
- 🟢 **圖解**：全篇沒有圖。「第一批收什麼」到「同一份文件有好幾版時」是一個決策流程（來源 → 處理方式 → 是否多版本 → 現行版／舊版標註），可以考慮依 `diagram` skill 畫一張分支圖；不是必要。

## 修正紀錄（2026-10-22）

- 🔴 與所有 🟡 都已採用（中英同步）；🟢 視為可選，未改。
- DZone 全文已用 Exa 重抓並核對 Step 1、2、6 原句，記在 dzone-2026-source-inventory 紀錄末段。
