# 研究筆記：知識庫怎麼建（building-knowledge-bases）

流程：research-selection（母群→覆蓋矩陣→偏誤）→ deep-research。抓取工具：Groundlane web_search／web_fetch／document_parse。
狀態標記：✅ 讀過正文　🟡 只讀到摘要或部分內容（只能引用摘要層級的結論）　🔎 只看過搜尋片段（線索，引用前必須讀原頁）　❌ 讀不到

> **怎麼讀這份筆記**：研究做了三輪（第一輪：官方與方法原文；第二輪：讀不到的換管道、補論文與非廠商來源；第三輪：補 2024–2026 年研究）。各段的「完整清單」表格已改成**最終狀態**，以表格為準；後面的「第二輪」「第三輪」段落保留各來源的讀後重點與數字。「對規劃的影響」以規劃表 `.work/series-plans/building-knowledge-bases.md` 為準。
>
> 2026-10-16 更正：研究初期（Forte PARA、zettelkasten.de 入門、Matuschak、Johnny.Decimal、Obsidian 三頁）曾直接用工具查，沒有先跑 skill，也用了 Exa 與 Firecrawl。這些頁面的內容已讀過正文，結論沿用；後續一律照 skill 走 Groundlane。

---

## A 段：個人知識管理

### 母群定義

個人知識管理方法＝個人用來收集、組織、找回、再利用自己的筆記與檔案的**公開成文方法**（有作者原始說明可讀），加上學術界個人資訊管理（PIM）研究對這些做法的實證結果。
不算：單純的工具功能介紹；任務管理方法本身（GTD 只取「收件匣＋每週回顧」這兩個與知識庫有關的部分）；團隊共用的系統（屬於 B 段）。

### 掃描方法

1. 分類目錄：英文維基「Personal knowledge management」「Personal information management」條目；GitHub awesome-knowledge-management（brettkromkamp）；awesome-pkm（knowfox，內容幾乎是空的）。
2. 搜尋聚合：「PKM methods compared」類比較文（atlasworkspace、saner.ai、whennotesfly 等，只當線索）。
3. 推薦鏈：dsebastien 的 PKM 文列出 Zettelkasten／PARA／Johnny.Decimal／Progressive Summarization／MOC／LIFT／Inbox Zero／Collector's Fallacy；Matuschak 引 Ahrens 與 Luhmann；zettelkasten.de 引 Luhmann 與 Eco。
4. 學術：PIM 文獻（Whittaker、Bergman、Jones、Malone）。

### 掃到的完整清單（方法與證據，19 項）

| 類型 | 項目 | 來源狀態 |
|---|---|---|
| 依「放哪裡」組織 | PARA（Forte） | ✅ fortelabs.com/blog/para/（2023-02-24，更新 2026-04-15） |
| 依「放哪裡」組織 | Johnny.Decimal | ✅ johnnydecimal.com/documentation/introduction |
| 依「放哪裡」組織 | 依學科主題分資料夾（學校式） | ✅ Forte PARA 文中作為反例 |
| 依「放哪裡」組織 | PPV（August Bradley，Notion 系統） | 🔎 Reddit 片段，未讀 |
| 依「連結」組織 | Zettelkasten（Luhmann） | ✅ Luhmann〈Communicating with Slip Boxes〉英譯全文；✅ zettelkasten.de/introduction |
| 依「連結」組織 | 文獻筆記／永久筆記／閃念筆記（Ahrens《How to Take Smart Notes》） | 🟡 書無公開全文；改用 zettelkasten.de 2022 逐頁引用書中內容的整理（附頁碼） |
| 依「連結」組織 | Evergreen notes（Matuschak） | ✅ notes.andymatuschak.org/Evergreen_notes |
| 依「連結」組織 | Maps of Content（Nick Milo / LYT） | ✅ blog.linkingyourthinking.com/notes/mocs-(defn)、/maps/ |
| 依「連結」組織 | 數位花園（Caulfield／Appleton） | ✅ maggieappleton.com/garden-history |
| 處理筆記 | Progressive Summarization（Forte） | ✅ fortelabs.com（2017-12-27） |
| 處理筆記 | CODE（Forte BASB） | 🔎 未讀 |
| 收集 | Collector's Fallacy（zettelkasten.de） | ✅ 2014-01-20 |
| 收集／回顧 | GTD Weekly Review checklist | ✅ gettingthingsdone.com PDF（document_parse） |
| 歷史 | Commonplace book | 🔎 只在維基「See also」看到 |
| LLM 輔助 | Karpathy llm-wiki | 站內已有兩篇（llm-knowledge-vault、llm-knowledge-management-landscape） |
| 證據 | PIM 活動模型：keeping／finding／meta-level（Jones） | ✅ 英文維基 PIM 條目 |
| 證據 | Whittaker et al. CHI 2011：345 位使用者、85,000 次以上找回動作，建資料夾的人找回不更成功，搜尋與討論串更有效 | ✅ 全文（第二輪，第三方鏡像 PDF） |
| 證據 | Bergman et al. 2008（TOIS）：桌面搜尋改善後，找個人檔案仍偏好用資料夾導覽 | 🟡 原文仍讀不到；改引 Bergman 2010 全文與 Bergman & Dvir 2026 摘要（第二、三輪） |
| 證據 | Bergman et al. 2010（JASIST）：資料夾深度與大小對找回時間的模型 | ✅ 全文（第二輪，特拉維夫大學 PDF） |
| 證據 | Bergman & Dvir 2026：導覽偏好至今仍成立，超級搜尋者例外 | ✅ 摘要（第三輪，Springer） |
| 證據 | 生成效應統合分析（Bertsch 2007）；Urry 2021 推翻手寫優勢 | ✅ 摘要（第二輪） |
| 證據 | Chen et al. 2025 AI 筆記輔助實驗；Microsoft 2025 CHI 批判思考調查 | ✅ 全文／官方摘要（第三輪） |
| 證據 | Whittaker & Hirschberg 2001：歸檔者累積更多資料、使用頻率反而低於堆放者 | 🔎 ACM 搜尋片段，未讀原頁；不引用 |

### 讀過正文的重點（只記會用到的）

- **PARA**：四類 Projects（有目標、會結束）／Areas（持續要照顧的責任）／Resources（感興趣的主題）／Archives（以上三類不再活躍的）。核心原則是「依可行動性分類」，不依學科。Forte 的反例：客戶把「招募」「策略規劃」列成專案，其實都是 Areas。
- **Progressive Summarization**：Layer 0 原文 → 1 摘入筆記 → 2 粗體 → 3 螢光 → 4 用自己的話寫摘要 → 5 改寫成作品。只在「本來就要看這則筆記」時才往下加一層（opportunistic compression）。主張 note-first，反對以標籤為主的組織方式。在 PARA 裡，放進 Project 等於排程短期回顧，Archive 是冷儲存。
- **Luhmann 原文**：固定編號、不依主題分類；任意內部分支（57/12 → 57/12a）；連結與反向連結；關鍵字索引（register）只記少數入口；筆記庫要好幾年才達到臨界量，之前只是「放進什麼拿出什麼」的容器；沒有連進網絡的筆記會被遺忘。
- **zettelkasten.de**：三個特質（超文本、原子性、個人化）；一張卡片三要素（ID、本文用自己的話、參考來源）；「connection, not collection」；Luhmann 的索引不是標籤系統，「system」一詞只有一個入口。
- **Collector's Fallacy**：「知道有這個東西」≠「知道這個東西」；Eco 說影印是不讀的藉口；對策是縮短「研究→閱讀→吸收」的循環，先設一小時上限、處理到收件匣清空。
- **Evergreen notes**：原子化、以概念為單位、密集連結、偏好聯想式而非階層分類、預設寫給自己看；明說受 Zettelkasten 影響。
- **Johnny.Decimal**：區域（10-19）→ 類別（15）→ ID（15.22）；每層不超過 10 個；數字讓位置不隨字母排序變動，可以口頭說。
- **MOC**：「把事物放在彼此脈絡中的地圖」；收集、碰撞、導覽三階段；不只是索引。
- **數位花園**：依主題連結而非時間排序；持續生長、公開未完成的想法；源自 Bernstein 1998〈Hypertext Gardens〉、Caulfield 2015〈The Garden and the Stream〉。
- **GTD Weekly Review**：Get Clear（收集散件、收件匣歸零、清空腦袋）→ Get Current（看行動清單、行事曆、等待清單、專案清單）→ Get Creative（看 Someday/Maybe，刪掉不再感興趣的）。
- **Obsidian**：vault 就是本機資料夾，筆記是 Markdown 純文字檔，可用其他編輯器或 Git；內部連結支援 Wikilink 與 Markdown 兩種格式，改檔名會自動更新連結；block reference 是 Obsidian 專屬語法，在外部不能用；反向連結分 linked／unlinked mentions；properties 以 YAML 存在檔案開頭。
- **PIM 研究（維基 PIM 條目）**：keeping 是訊號偵測問題（漏收 vs 收了不用）；檔案找回多數人偏好導覽而非搜尋，email 則逐漸轉向搜尋；收了之後忘記去找，努力就白費。

### 覆蓋矩陣

| 維度 | 值 | 選入 | 缺口 |
|---|---|---|---|
| 組織原理 | 放哪裡（容器） | PARA、Johnny.Decimal | |
| 組織原理 | 連結 | Zettelkasten、Evergreen、MOC | |
| 組織原理 | 不組織、靠搜尋 | Whittaker 2011（證據） | 沒有一個「純搜尋派」方法的作者原文 |
| 處理深度 | 輕（收了再說） | Progressive Summarization | |
| 處理深度 | 重（重寫成自己的話） | Zettelkasten、Evergreen | |
| 證據類型 | 方法作者自述 | 以上全部 | |
| 證據類型 | 實證研究 | Whittaker 2011、Bergman 2008（只有摘要） | 全文讀不到，只能引摘要層級的結論 |
| 時間 | 早期 | Luhmann（1981 年德文原作；英譯本列 1992 年版） | |
| 時間 | 近期 | PARA（2017／2023）、MOC（2020）、llm-wiki（2026） | |
| 失敗案例 | 方法沒用好會怎樣 | Collector's Fallacy；Luhmann「沒連進網絡的筆記會被遺忘」 | 沒有「試了 PARA／Zettelkasten 後放棄」的系統性資料 |
| 語言 | 非英語圈 | Luhmann（德）、Johnny.Decimal（澳） | 沒有中文圈方法；要補搜 |

### 偏誤

- 方法來源幾乎都是方法作者自述，作者多半在賣課或賣書（Forte 有 BASB 課程與書，dsebastien 賣 starter kit，Milo 有 LYT 課程）。寫作時要把「作者主張」與「研究證據」分開寫。
- 實證研究集中在 email 與檔案系統，不是筆記軟體；推論到筆記要說明限制。
- 語言偏誤：補搜中文圈（2026-10-16），結果是 Ahrens 書的繁中譯本《卡片盒筆記》與其讀後實踐（閱讀前哨站、朱騏《知識複利筆記術》、陳文學醫師），沒有本地原生方法。中文圈是「接受與實踐西方方法」，不是另一套方法；寫作時可引一則中文實踐回報當讀者熟悉的入口（要先讀正文）。

---

## B 段：團隊知識庫

### 母群定義

團隊知識庫＝給組織內成員閱讀的共用文件系統，涵蓋「要寫哪些類型」「怎麼組織」「怎麼寫」「誰維護」「怎麼找到」五類做法；母群包括公開的方法框架、大型組織公開的實務規範、相關研究與調查。
不算：對外行銷內容；單一工具的功能比較（工具只在說明某個做法時當例子）；給 AI 讀的準備流程（C 段）。

### 掃描方法

1. 搜尋聚合：「internal documentation best practices」「wiki governance」（結果多為 Slite、Tettra、Docsie、XWiki 等廠商文，只當線索）。
2. 推薦鏈：廠商文共同引用 Diátaxis；Write the Docs 指南引 docs-as-code 書目與講者；Google docguide；GitLab handbook。
3. 分類目錄：Write the Docs Guide；NN/g 文章庫（IA、卡片分類、搜尋紀錄分析）。
4. 研究與調查：ICSE 2019 Aghajani；Stack Overflow Developer Survey 2024 專業開發者章節。
5. 客服知識庫（同屬「團隊知識」）：KCS v6（Consortium for Service Innovation）。

### 掃到的完整清單（16 項）

| 類型 | 項目 | 來源狀態 |
|---|---|---|
| 文件類型 | Diátaxis（tutorial／how-to／reference／explanation） | ✅ diataxis.fr 首頁、start-here |
| 文件類型 | 決策紀錄 ADR（Nygard 2011） | ✅ cognitect.com 原文 |
| 文件類型 | runbook／SOP | 🔎 只在廠商文出現，未讀一手來源 |
| 組織 | 卡片分類法（NN/g） | ✅ 2024-02-02 |
| 組織 | 樹狀測試（tree testing） | 🔎 NN/g 卡片分類文中連結，未讀 |
| 組織 | GitLab handbook 建議的頂層結構（公司／部門／日常） | ✅ handbook-first.md 原始檔 |
| 寫作 | Google docguide：Minimum Viable Documentation、Update Docs with Code、Delete Dead Documentation、Duplication is Evil | ✅ google.github.io/styleguide/docguide/best_practices.html |
| 寫作 | Google Technical Writing 課程 | 🔎 未讀 |
| 維護 | docs-as-code（Write the Docs） | ✅ writethedocs.org/guide/docs-as-code |
| 維護 | Notion 驗證頁面（owner＋到期，到期通知 owner） | ✅ notion.com/help/wikis-and-verified-pages |
| 維護 | Guru／Slab／Confluence 的驗證或封存功能 | 🔎 只在 GitHub issue 片段提到 |
| 維護 | GitLab handbook-first：先寫再宣布、Slack 只留 90 天、MR 分開提案者與核准者、wiki 不 scale 的理由 | ✅ |
| 治理 | KCS v6：Solve Loop（Capture／Structure／Reuse／Improve）＋Evolve Loop（Content Health 等）；「just-in-time review over just-in-case creation」；不要對活動量設目標 | ✅ 041 Summary、030/040 Evolve Loop |
| 搜尋 | NN/g 搜尋紀錄分析（top 1000 查詢、零結果、同一人連續查詢、最長查詢、詞彙落差、best bets、同義詞） | ✅ 2017-07-30 |
| 證據 | Aghajani et al. ICSE 2019：從郵件列表、Stack Overflow、issue、PR 挖 878 筆文件相關資料，建出文件問題分類 | ✅ 全文（第二輪，作者個人網站） |
| 證據 | Grudin & Poole 2010 企業 wiki 長期研究 | ✅ 全文（第二輪，Microsoft Research PDF） |
| 證據 | Stack Overflow 2025；Agent READMEs 2025；ETH Zurich 2026 AGENTS.md 評估；llms.txt v2；AGENTS.md | ✅（第三輪） |
| 證據 | Stack Overflow Developer Survey 2024（約 29K 專業開發者）：61% 每天花 30 分鐘以上找答案；30% 說知識孤島每週影響生產力 10 次以上；70% 知道去哪找、56% 能很快找到；53% 說等答案會打斷工作 | ✅ survey.stackoverflow.co/2024/professional-developers |

排除：Slite、Tettra、Docsie、ScopeDocs、Starmind、fullscale 等廠商文裡的統計（例如「Stack Overflow 調查 500 位工程師、78% 不信任內部文件」查不到原始調查），一律不引。

### 讀過正文的重點

- **Diátaxis**：四種需求對四種文件；羅盤＝內容「指導行動還是提供認知」×「服務學習還是工作」。混淆邊界是大量文件問題的根源。工作流程只有一步：看現在的文件、找一件能改善的小事、做掉、重複。採用者自述：Vonage 內部文件、Gatsby、Cloudflare developer docs。
- **ADR**：短文字檔，放在 repo 的 doc/arch/adr-NNN.md；編號不重用；被推翻時保留舊的並標 superseded；欄位 Title／Context／Decision／Status／Consequences（列出所有後果，不只正面的）；一到兩頁。動機：新人只能「盲目接受」或「盲目推翻」過去的決定。
- **Google docguide**：少量新鮮正確的文件勝過大量年久失修的；文件跟程式碼同一個 CL 改；死文件要刪，清理時「先刪確定錯的、不明的先不動、預設刪除」；不要重寫別處已有的指南，連過去。設計文件實作完成後應當成決策封存，不要當半對的說明文件。
- **docs-as-code**：issue tracker、Git、純文字標記、code review、自動測試；可以擋下沒附文件的功能合併。
- **GitLab handbook-first**：先寫進 handbook 再在 Slack 公告；Slack 只保留 90 天，迫使討論回到單一事實來源；wiki 只讓少數人改，內容過時後大家不信任，需要再找人確認；MR 讓任何人都能提案、由 DRI 核准；建議設 handbook 編輯團隊，頁面太久沒更新時通知 code owner；公開 handbook 比內部 wiki 更不容易爛。
- **KCS**：知識在「產生的當下、需求的脈絡裡」管理；寫好就用，被重用時才改進（just-in-time review）；個人負責行動、團隊共同擁有知識庫；導入時常見錯誤是把流程和內容標準設計得太複雜、花太多時間轉舊資料；不要對活動量設目標。
- **卡片分類法**：開放式用來發現使用者心智模型，驗證既有架構改用樹狀測試；30–50 張卡；質化至少 15 人、量化 30–50 人；限制是缺少脈絡、只能分一層。
- **搜尋紀錄分析**：找出「想要但找不到」「想要但不存在」「使用者詞彙 vs 網站詞彙」；對策有同義詞、best bets、改標題、補內容；處理 log 要注意個資。
- **Notion 驗證頁面**：wiki 頁面預設建立者為 owner；驗證可設到期日或永久；到期時通知 owner；已驗證頁面在搜尋結果有藍勾。

### 覆蓋矩陣

| 維度 | 值 | 選入 | 缺口 |
|---|---|---|---|
| 組織規模 | 小團隊 | Google docguide（以 repo 為單位） | |
| 組織規模 | 大組織 | GitLab handbook、KCS | |
| 載體 | wiki／筆記工具 | Notion 驗證頁面 | Confluence 官方文件未讀 |
| 載體 | repo（docs-as-code） | Write the Docs、Google、ADR | |
| 知識類型 | 工程文件 | Diátaxis、ADR、Google | |
| 知識類型 | 營運／客服知識 | KCS | |
| 知識類型 | 公司政策與流程 | GitLab handbook 頂層結構 | |
| 證據類型 | 實務者規範 | 以上 | |
| 證據類型 | 研究／調查 | Aghajani 2019（摘要）、SO Survey 2024 | 缺「wiki 推行失敗」的學術研究 |
| 失敗案例 | wiki 爛掉 | GitLab 對 wiki 的批評、Google「死文件」 | 沒有具名組織的失敗案例 |

### 偏誤

- 實務來源偏軟體公司與工程文件；非技術部門（人資、業務）的知識庫做法只有 GitLab handbook 有涉及。
- GitLab 自己賣版本控制產品，handbook-first 文章同時是產品推廣；KCS 由推廣它的聯盟撰寫；Notion 文件是功能說明。寫作時這些是「做法的描述」，不是「做法有效的證據」。
- 調查數字只有 Stack Overflow 2024，且受訪者是自願填答的開發者。

---

## C 段：AI 知識庫

### 母群定義

AI 知識庫建置流程＝把組織文件變成可供 RAG／AI 助理檢索的語料時，**從來源到上線維護**要做的步驟與決定；母群是主要雲端與模型廠商的官方 ingestion／RAG 設計文件、安全標準，以及常用的開源處理工具文件。
不算：檢索演算法本身（chunking 演算法細節、reranking、embedding 原理）——站內「RAG 技法大全」已寫，只連結；agent 記憶系統（站內「AI Agent 記憶工程」）。

### 掃描方法

1. 平台官方文件：AWS Bedrock Knowledge Bases、Google Vertex AI RAG Engine（文件網址已改為 Gemini Enterprise Agent Platform）、OpenAI Retrieval／vector stores、Azure AI Search＋Azure Architecture Center RAG 設計系列、Microsoft 365 Copilot 治理藍圖。
2. 安全標準：OWASP Top 10 for LLM Applications 2025 LLM08。
3. 搜尋聚合：「RAG data ingestion pipeline best practices」（Unstructured、Airbyte、LlamaIndex、Informatica、truto 等廠商文，只當線索）。
4. 工具：Docling（IBM Research 發起，LF AI & Data 託管）、Presidio（PII）。
5. 站內既有：Ask AI 實戰（索引管線、retrieval eval）、私有語料管線、RAG 技法大全。

### 掃到的完整清單（步驟母群，以官方文件為準）

| 步驟 | 出現於 | 來源狀態 |
|---|---|---|
| 定義領域與要回答的問題 | Azure preparation phase | ✅ |
| 先收集題庫（查詢＋出處段落＋答案），含「文件答不了」的題 | Azure preparation phase | ✅ |
| 內容分析：類別、格式、安全限制、結構 | Azure preparation phase | ✅ |
| 代表性測試內容：每種變體與格式至少兩份 | Azure preparation phase | ✅ |
| 連接來源（S3、Drive、SharePoint、Slack、Jira…） | AWS、Google | ✅ |
| 解析：版面、閱讀順序、表格、OCR、公式、圖片 | Docling、Azure chunking phase（document layout analysis） | ✅ |
| 決定要忽略的內容（目錄、頁首頁尾、浮水印、免責聲明） | Azure preparation phase | ✅ |
| 個資偵測與去識別 | Presidio、Azure（真實內容要先清個資） | ✅ |
| 防提示注入：內容不可當指令、標記或排除含嵌入指令的文件 | Azure enrichment phase、OWASP LLM08 情境 1（履歷白字） | ✅ |
| 切塊（固定長度、語意、自訂、版面分析、LLM 擴充）；切塊是「半永久」選擇 | Azure chunking phase；OpenAI 預設 800 token、重疊 400 | ✅ |
| 清理（小寫、拼字、正規化）與擴充 metadata（ID、標題、摘要、關鍵字、標籤、實體、可回答的問題、來源、語言） | Azure enrichment phase | ✅ |
| metadata 檔與屬性過濾 | AWS `.metadata.json`；OpenAI attributes 與 filters | ✅ |
| 權限：文件帶群組 ID 欄位、查詢時過濾（security trimming） | Azure security filter pattern；OWASP「permission-aware vector store」 | ✅ |
| 既有權限過寬（oversharing）先整理 | Microsoft Copilot 治理藍圖：remediate oversharing → guardrails → regulations | ✅（藍圖頁，PDF 未讀） |
| 增量同步：新增、修改、刪除只處理差異；刪除會從向量庫移除 | AWS sync 文件 | ✅ |
| 去重：同路徑同內容且切塊設定沒變就跳過；用內容 hash 判斷 | Google RAG Engine | ✅ |
| 刪除最終一致：移除後短時間內搜尋仍可能出現 | OpenAI vector store 文件 | ✅ |
| 匯入失敗紀錄（result sink） | Google RAG Engine | ✅ |
| 評估：檢索評估、端到端（groundedness、completeness…） | Azure 設計系列總覽 | ✅（總覽層級；評估篇本身未讀） |
| 知識衝突、資料下毒、embedding 反推 | OWASP LLM08 | ✅ |
| 成本：每份文件處理成本、圖片描述成本、快取 | Azure chunking phase | ✅ |
| 失敗點與上線驗證 | Barnett 2024 Seven Failure Points | ✅ 全文（第二輪） |
| 企業實作經驗（新鮮度、ACL、prompt 守規不可靠、機密分級） | NVIDIA FACTS 2024 | ✅ 全文（第二輪） |
| 具名事件 | Slack AI 2024（PromptArmor）、EchoLeak 2025 | ✅ 全文（第二輪） |
| 權限同步的官方說明 | Microsoft Graph connectors、Amazon Q Business | ✅（第二輪） |
| 資料準備對準確率的影響 | Santos 2026 From PDF to RAG-Ready；OmniDocBench CVPR 2025 | ✅ 摘要（第三輪） |
| 多人互動的權限 | Microsoft 2025 participant-aware access control | ✅ 摘要與引言（第三輪） |
| RAG 安全綜述 | Mu 2026 | ✅ 摘要（第三輪） |

### 讀過正文的重點

- **Azure preparation phase**：領域、內容分析、代表性內容、題庫要平行做；題庫輸出＝Query／Context（含頁碼與原文）／Answer；可用 LLM 從 chunk 生成合成題但要 SME 驗證；要收集文件答不了的題，決定系統怎麼回「不知道」；可從客服系統、FAQ 找真實問題；題庫要定期回頭對照來源文件。
- **Azure chunking phase**：切塊方法依文件結構選；「Your chunking approach is a semipermanent choice」，改了會影響下游；先合併 loading 與 chunking，需要時再分；分開時避免轉成中介格式造成資料遺失；成本要算實作種類數、每份文件成本、初始量與增量。
- **Azure enrichment phase**：清理後的 chunk 另存一欄，回傳原文；不可把內容當指令；metadata 依查詢類型決定，例如「2009 年產品 X 的評價」在語意上接近 2010 年或產品 Y，要靠關鍵字欄位精確比對。
- **Azure security filter pattern**：principal ID 字串欄位、filterable、retrievable=false；用 `search.in` 而不是一長串 `eq or`；retrievable=false 不是欄位層級的保護；這是「沒用內建 ACL 時」的做法（Azure 另有內建 document-level access）。
- **AWS Bedrock KB sync**：每次新增、修改、刪除都要 sync；增量；只改 metadata 時可不重算 embedding（CSV 例外）；向量庫若不是 Aurora，sync 完成後幾分鐘才查得到。
- **Google RAG Engine**：`version_id` 是內容 hash；同檔名路徑內容更新會重建索引；Drive 匯入時服務帳號沒權限，「不會匯入也不會報錯」——靜默失敗的實例。
- **OpenAI Retrieval**：上傳即自動切塊、embedding、索引；attributes 過濾（eq/ne/gt/gte/lt/lte/in/nin＋and/or）；hybrid search 的 RRF 權重可調；刪除最終一致；儲存超過 1 GB 每 GB 每天 $0.10（寫入文章前要再核對）。
- **OWASP LLM08:2025**：存取控制不當、多租戶情境洩漏、跨來源知識衝突、embedding 反推、資料下毒；緩解＝permission-aware 向量庫、資料驗證管線、標記與分類、不可竄改的檢索紀錄。
- **Microsoft Copilot 治理藍圖**：Copilot 依使用者「已有權限」的資料作答；三支柱：處理過度分享、設防護、符合法規。重點：AI 不新增權限，但會讓原本就過寬的權限變得「找得到」。
- **Docling**：多格式解析、版面與閱讀順序、表格結構、OCR、可本機執行（敏感資料、斷網環境）。
- **Presidio**：辨識＋匿名化；官方警告自動偵測無法保證找到所有敏感資料。

### 覆蓋矩陣

| 維度 | 值 | 選入 | 缺口 |
|---|---|---|---|
| 部署 | 全託管 | OpenAI vector stores、AWS Bedrock KB、Google RAG Engine | |
| 部署 | 自建元件 | Azure AI Search、Docling、Presidio | 開源一站式平台（RAGFlow 等）站內已有文章，連結即可 |
| 雲 | AWS／Google／Microsoft／OpenAI | 各一 | Cloudflare 站內已有系列 |
| 階段 | 準備（題庫、內容分析） | Azure preparation | 只有 Azure 寫得完整 |
| 階段 | 處理（解析、清理、切塊、metadata） | Azure、Docling、AWS、OpenAI | |
| 階段 | 權限 | Azure、OWASP、Microsoft Copilot | 缺「權限變更延遲」的官方說明（只有廠商文 truto 提到） |
| 階段 | 維護（同步、刪除） | AWS、Google、OpenAI | |
| 階段 | 評估 | Azure 總覽 | 細節連回站內既有文章 |
| 失敗案例 | 靜默失敗、刪除延遲、資料下毒 | Google Drive 權限、OpenAI 最終一致、OWASP 情境 | 缺具名組織的 RAG 事故公開報告 |
| 語言 | 繁中語料 | 站內 zh-tw-embedding-rag-failures、private-corpus 系列 | 官方文件都以英文語料為例 |

### 偏誤

- 步驟母群主要來自雲端廠商文件，Azure Architecture Center 寫得最完整，規劃容易被它的分段牽著走；其他廠商把多數步驟包成「自動處理」，文件裡看不到。
- 廠商文件會順帶推自家服務（Content Understanding、Bedrock Managed KB），寫作時只取做法，不取產品推薦。
- 沒有讀到繁中語料的官方指引，繁中的特殊問題靠站內既有實測文章補。

---

## 對規劃的影響（第一輪後；第二、三輪的影響已直接寫進規劃表的總表與範圍卡）

1. **C 段加「安全：個資與提示注入」**：Azure 與 OWASP 都把「內容不可當指令」列為處理階段要做的事，原規劃沒有。
2. **權限篇加「先整理既有權限過寬」**：Microsoft 藍圖顯示 AI 會讓過寬權限變得找得到。
3. **B 段維護篇加 KCS「用了才改、在需求當下寫」、GitLab「先寫再宣布、誰都能提案、owner 核准」與驗證到期機制**。
4. **A 段方法篇要把「作者主張」和「研究證據」分開**：Whittaker 2011 與 Bergman 2008 顯示歸檔不一定比搜尋好，但人找檔案仍偏好導覽。Johnny.Decimal、Evergreen notes、MOC、Progressive Summarization 也要在對應篇出現。
5. **原規劃「對應來源」欄的錯誤或未讀項**：Ahrens 書未讀（只能引轉述，或另找 Ahrens 本人原文）；「Google docs-as-code」實際來源是 Write the Docs 與 Google docguide；「各 wiki 搜尋分析功能文件」改為 NN/g 搜尋紀錄分析。

---

## 第二輪補搜（2026-10-16）：讀不到的換管道、偏誤換來源補

使用者指出「讀不到、只有作者自述」不能停在那裡，要找論文與技術文章補。以下逐項處理。

### 原本讀不到的，換管道讀到全文

| 來源 | 第一輪 | 第二輪 | 用了哪個管道 |
|---|---|---|---|
| Whittaker et al. CHI 2011 | 🟡 摘要 | ✅ 全文 | 第三方鏡像 PDF（mytimemanagement.com），document_parse |
| Bergman et al. 2008 TOIS | 🟡 摘要 | 🟡 仍讀不到 2008 原文；改讀同作者 2010 全文＋2016 專書出版社說明 | 特拉維夫大學研究室 PDF（tau.ac.il/education/muse/publications/101.pdf） |
| Aghajani et al. ICSE 2019 | 🟡 摘要 | ✅ 全文 | 作者個人網站 emadpres.github.io/pdfs/icse2019.pdf |
| Ahrens《How to Take Smart Notes》 | 🟡 只有轉述 | 🟡 書無公開全文；改用逐頁引用書中內容的整理（zettelkasten.de, 2022，附頁碼） | — |

### 新增來源（讀過正文）

**A 段：實證研究**

- **Whittaker et al. 2011 全文重點**：345 位使用者、平均使用 64 天；建很多資料夾的人（中位數分組）找回成功率與少建者相同（都是 0.88），且整體花的時間略長（72.87 vs 66.07 秒），因為打開資料夾比搜尋慢；依賴搜尋與預設是討論串的人找回成功率較高。訪談：建資料夾主要是為了**整理收件匣、管理待辦**，不是為了找回（「My inbox is a todo list」「I'm trying not to drown」）。作者自己指出：桌面檔案與網頁的研究仍顯示人偏好導覽，email 可能因為結構化、量大而例外。
- **Bergman et al. 2010（JASIST）全文**：296 人找回 1,131 個自己的檔案、5,035 個導覽步驟；平均深度 2.86 層、每個資料夾約 11.82 個檔案、約 10.64 個子資料夾；94% 找得到、平均 14.76 秒；找回時間 ≈ 4.956 + 2.236×深度 + 0.106×資料夾大小（秒）；結論：使用者避開深層與大資料夾是合理的。文中引 2008 研究：導覽一直是找個人檔案的主要方式。
- **Bergman & Whittaker《The Science of Managing Our Digital Stuff》（MIT Press 2016）**：出版社說明——階層資料夾是個人資料「偏好且最有效」的方式；搜尋、標籤在公共資訊有效，用在個人資訊效果不如預期；提出 user-subjective approach。（🟡 只讀到出版社與牛津學術平台的說明，書本內文未讀）
- **生成效應統合分析（Bertsch et al. 2007, Memory & Cognition）**：86 篇研究、445 個效果量，自己產生資訊比單純閱讀記得更好，效果量 0.40（約半個標準差），調節變項影響大。（✅ 摘要；Springer 頁面）——這是「用自己的話寫」最穩的實證基礎。
- **Mueller & Oppenheimer 2014 被重複驗證推翻**：Urry et al. 2021（Psychological Science）預先登錄的直接重複驗證（142 人）＋8 篇相關研究的小型統合分析：筆電組仍記下較多逐字內容，但測驗成績與手寫組沒有差別。（✅ 原始摘要經 CRAN afex 文件；APS 與 everydayresearchmethods 報導）→ 文章不能引「手寫比打字好」。
- **Zettelkasten 的直接實驗證據很弱**：唯一找到的期刊研究（Malashenko et al. 2023, Emerging Science Journal）把 Zettelkasten 和間隔重複綁在一起測，無法分辨效果來源。（✅ 全文）→ 文章應寫成「Zettelkasten 本身缺乏嚴謹實驗；它的部分做法（用自己的話寫）有記憶研究支持」。
- **Luhmann 檔案館（Bielefeld）**：Zettelkasten I 有 108 個主題分部、書目與關鍵字索引；Zettelkasten II 有 11 個主題分部；檔案館說明：Luhmann 本人沒有建立內容總覽，現有的層級是編輯決定，收藏本身不遵循嚴格階層。（✅ 德文頁面）

**B 段：團隊 wiki 研究**

- **Grudin & Poole 2010（WikiSym，Microsoft Research PDF）全文**：訪談多家公司＋MegaSoft 平台 4,000 多位使用者調查（433 份回覆）＋FlexWiki 調查（300 份回覆）。重點：成功的 wiki 是少數，66% 回覆者的 wiki 過去六個月沒人用；最大的團隊 wiki 在負責整理的人離開後「長滿雜草」，主管看到品質變差就撤掉維護人力；主管想要專案儀表板，寫的人要的是分享 FAQ；「把退休員工的隱性知識記下來」的期待，研究者沒看到任何實例；早期的組織方式隨規模長大變成負擔，合併 wiki 時頁名衝突。
- **Aghajani et al. 2019 全文**：878 筆資料、162 種問題；485 筆談內容「寫了什麼」，其中**不完整 268、過時 190、不正確 72**；另有 81 筆流程問題、134 筆工具問題。→ 團隊文件主要壞在缺漏與過時，不是寫錯。
- **Aghajani et al. 2020（ICSE）**：146 位從業人員兩份問卷，問他們認為哪些文件問題最重要、各種工作需要哪類文件。（🟡 只讀到會議頁正式摘要；PDF 兩個網址都超過 Groundlane 檔案大小上限）

**C 段：非廠商來源**

- **Barnett et al. 2024「Seven Failure Points」（CAIN 2024，Deakin University）全文**：三個實際系統（研究文獻助理、AI 助教、BioASQ 生醫問答：15,000 份文件、1,000 題）；7 個失敗點：內容缺失、沒排進前幾名、沒進入 context、沒抽取出來、格式錯、具體程度不對、不完整；兩個結論：RAG 只能在運作中驗證；穩健性是演化出來的。
- **Akkiraju et al. 2024「FACTS」（NVIDIA，CIKM 預印本）全文**：三個內部機器人（企業知識約 5 億份文件／7 TB 以上、IT/HR 約 2,000 份、財報約 4,000 份）；metadata 擴充、切塊、查詢改寫、重排對品質影響最大；向量搜尋不擅長人名地名等實體，要混合詞彙搜尋；**守規則寫在 prompt 裡不可靠，改在前後處理把關**；**上線前先做資料治理與文件機密分級**；要遵守文件 ACL；LLM 當評審要小心偏誤。
- **Slack AI 事件（PromptArmor, 2024-08-20）原文**：攻擊者在只有自己的公開頻道放指令，受害者問 Slack AI 時把私人頻道的 API key 夾進「重新登入」連結；引用來源沒有列出攻擊者訊息；Slack 回應這是公開頻道的預期行為。8 月 14 日起 Slack AI 也讀上傳檔案，攻擊面擴大。
- **EchoLeak（CVE-2025-32711，Reddy & Gujral 2025 arXiv 案例研究）全文**：一封外部郵件、零點擊，串接繞過注入分類器、連結過濾（reference-style Markdown）、圖片自動載入、Teams 代理網域；2025 年 5 月伺服器端修補、6 月 11 日公開，官方稱無實際被利用證據。建議：外部內容與內部內容分區、輸入輸出過濾、依來源控管權限。
- **ConfusedPilot（UT Austin, arXiv 2408.04870）**：RAG 的 confused deputy 風險——惡意文字汙染回答、快取導致機密外洩、錯誤資訊在企業內擴散。（✅ 摘要）

**權限變更延遲（原本只有廠商文）→ 已有官方說明**

- **Microsoft Graph／Copilot connectors 官方文件**：增量爬取只偵測新增；完整爬取才捕捉新增與刪除；敏感或動態資料建議事件觸發同步，wiki 這類內容可排程同步。
- **Amazon Q Business 官方文件**：連接器在每次爬取時更新 ACL 變更，要定期重新同步；User Store 的修改是特權操作，應有核准流程。

### 偏誤更新

- **A 段**：原本「只有作者自述」→ 現在有 PIM 實證（Whittaker 2011、Bergman 2010）與記憶研究（生成效應統合分析、筆記媒介重複驗證）。仍然缺：直接比較 PARA、Zettelkasten 等方法成效的嚴謹研究——找過，不存在可用的；文章要明說這點。
- **B 段**：原本「只有實務者規範」→ 現在有 Grudin & Poole 的企業 wiki 長期研究與 Aghajani 的文件問題分類。研究多來自軟體公司，非技術部門仍是缺口。
- **C 段**：原本「主要是廠商文件」→ 現在有學術經驗報告（Deakin）、企業實作報告（NVIDIA）、獨立安全研究與具名事件。NVIDIA 本身賣 GPU 與 NeMo，文中偏好自家工具，只取經驗不取產品推薦。
- **中文圈**：仍無原生方法，維持原說明。

### 新增資料位置

全文抽取的文字暫存在 scratchpad（whittaker2011.txt、bergman2010.txt、grudin2010.txt、aghajani2019.txt），不進 repo；需要引用時回原始網址。

---

## 第三輪補搜（2026-10-16）：補 2024–2026 年的研究

使用者問「為什麼資料都很舊」。原因：前兩輪用經典論文標題與作者名搜尋，沒限定近期；2010 年前後的結論在 AI 搜尋普及後可能已改變，必須確認近年研究有沒有更新或推翻。以下全部是 2024–2026 年發表的來源。

### A 段

- **Bergman & Dvir（iCETiC 2025 論文集，2026 出版）〈Hyper-searchers Search Much More for their Files Because Navigation is More Difficult for Them〉**（✅ 摘要，Springer）：檔案找回研究「一致發現偏好導覽勝過搜尋」；少數「超級搜尋者」（50 人對照 50 人，雙重確認分組）搜尋多得多，原因是導覽對他們特別吃力；對多數人導覽比搜尋省力。→ 2008、2010 的結論到 2026 年仍成立。參考文獻另有 Bergman, Israeli & Whittaker 2019〈Search is the future? The young search less for files〉（🔎 只見標題）。
- **Bergman & Dvir 2024（Human–Computer Interaction 期刊）〈File hyper-searching explained〉**：🔎 只看到搜尋片段（超級搜尋者導覽較差、資料夾較亂）；tandfonline 頁面被 challenge 擋、PDF 被判含主動內容。
- **Najork 2024〈Searching Personal Collections〉**（ACM《Information Retrieval: Advanced Topics and Techniques》第 14 章，2025）：🟡 只讀到 arXiv 摘要（個人收藏檢索史）。
- **Chen et al. 2025（PACM HCI／CSCW）〈More AI Assistance Reduces Cognitive Engagement〉**（✅ 全文 HTML）：30 人受試者內實驗，三種 AI 筆記輔助——全自動結構化筆記、即時摘要片段、只有逐字稿；**全自動組測驗成績最低、摘要片段組最高**，差異顯著；受試者卻最喜歡全自動組。結論：方便與學到東西有落差；讓使用者自己組合 AI 提供的積木，保留認知投入。
- **Microsoft Research 2025（CHI）〈The Impact of Generative AI on Critical Thinking〉**（✅ 官方部落格摘要；319 位知識工作者、936 個使用案例）：對 AI 信心越高，批判思考越少；對自己能力信心越高，批判思考越多；批判思考的重心轉向「驗證資訊、整合回應、管理任務」。

→ 對 order 5：「LLM 能接手什麼」有了 2025 年的直接證據——整理、建議可以交給它，但「用自己的話寫、判斷什麼重要」交出去會降低理解；設計上給積木、不給成品。

### B 段

- **Stack Overflow Developer Survey 2025**（✅ AI 章節；49,000 份以上回覆）：84% 使用或打算使用 AI 工具；51% 專業開發者每天用；對 AI 正確性不信任（46%）多於信任（33%）；最大挫折是「幾乎對但不完全對」（66%）；未來仍會找人的首要原因是「不信任 AI 的答案」（75%）；agent 使用者認為提升了個人效率（約 70%），但只有 17% 認為改善了團隊協作。
- **llms.txt v2（llmstxt.org，Jeremy Howard）**（✅）：網站用一份 Markdown 給 agent 看的精簡總覽；兩年內數千個網站採用，文件平台自動產生，Chrome Lighthouse 會檢查；OpenAI、Anthropic、Gemini 的開發者文件都有。
- **AGENTS.md（agents.md）**（✅）：給 coding agent 的 README；6 萬個以上開源專案使用；巢狀檔案就近優先；現由 Linux Foundation 下的 Agentic AI Foundation 管理。
- **Chatlatanagulchai et al. 2025（arXiv 2511.12884）〈Agent READMEs〉**（✅ 摘要）：分析 1,925 個 repo 的 2,303 份 context 檔；這些檔案像設定檔一樣頻繁小幅追加、難讀；內容以測試流程（75.9%）、實作細節（70.8%）、架構（68.1%）為主，安全（14.8%）、效能（14.5%）很少寫。
- **Gloaguen et al. 2026（ETH Zurich，arXiv 2602.11988 v3，2026-09-29）〈Evaluating AGENTS.md〉**（✅ 摘要）：context 檔**整體不提高任務成功率**，推理成本平均增加 20% 以上；LLM 產生與開發者寫的都一樣；檔案裡的指令會被遵守，但廠商推薦的「repo 總覽」沒有幫助；建議只用來寫非標準做法，任何改善都要先評估。（注意：網路上有轉述說「降低成功率 3%」，與 v3 摘要不同，以 v3 為準）

→ 對 B 段：團隊文件現在有第二種讀者（AI agent）；給 AI 的文件同樣會爛、同樣要評估。對 order 10→11：最自然的橋——同事開始改用 AI 問，團隊也開始寫給 AI 看的文件。

### C 段

- **Santos et al. 2026（Applied Sciences 16:5069；arXiv 2604.04948 v2）〈From PDF to RAG-Ready〉**（✅ 摘要）：Docling、MinerU、Marker、DeepSeek OCR 四種轉換工具 × 21 種管線設定；36 份葡萄牙文行政文件（1,706 頁）、50 題、每設定跑 50 次；基準：直接讀 PDF 86.2%、人工整理 Markdown 91.3%；最佳（Docling＋階層切塊＋圖片描述）94.1%；**表格題在基本與階層切塊之間差 33 個百分點**；**metadata 擴充與依階層切塊的貢獻大於轉換工具本身**；GraphRAG 試做 82%，低於基本 RAG。結論：資料準備品質是決定性因素。
- **OmniDocBench（CVPR 2025）**（✅ CVPR 海報頁與 arXiv 摘要）：9 種文件類型、19 種版面標籤、14 種屬性標籤的解析基準；表格辨識上 OCR 型模型整體優於 VLM。
- **Bhatt et al. 2025（Microsoft，arXiv 2509.14608）〈Enterprise AI Must Enforce Participant-Aware Access Control〉**（✅ 摘要與引言）：示範透過微調與 RAG 外洩資料的攻擊；提示清洗、輸出過濾、系統隔離、訓練層隱私都是機率性的；主張**用於檢索與生成的內容，必須對互動中的所有參與者都有授權**（例：Alice 用 AI 回覆 Bob 的信，檢索內容要兩人都能看，否則 Bob 可在信中藏指令把資料帶走）；已部署於 Microsoft Copilot Tuning。
- **Mu et al. 2026（arXiv 2603.21654）〈Towards Secure RAG〉**（✅ 摘要）：第一篇端到端 RAG 安全綜述；威脅（資料下毒、對抗攻擊、成員推論）與防禦（動態存取控制、對抗預過濾、差分隱私等）分類，彙整評測資料集與標準。

### 時間分布更新後的偏誤

- A 段：核心 PIM 結論有 2026 年研究背書；PKM 方法本身仍缺嚴謹研究（找過 2024–2026，依舊沒有）。
- B 段：補上 2025 調查與 2025–2026 的 AI 文件研究；團隊 wiki 本身的近年學術研究仍少，Grudin 2010 仍是最完整的企業 wiki 長期研究，文章會註明年份與脈絡。
- C 段：已有 2025–2026 的資料準備實證與安全研究，不再只靠 2024 年以前的經驗報告。
- 規則：每篇文章的關鍵主張，至少要有一個 2024 年以後的來源，或明寫「近年研究仍支持」並附來源。
