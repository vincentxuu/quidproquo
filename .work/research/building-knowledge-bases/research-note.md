# 研究筆記：知識庫怎麼建（building-knowledge-bases）

流程：research-selection（母群→覆蓋矩陣→偏誤）→ deep-research。抓取工具：Groundlane web_search／web_fetch／document_parse（少數失敗時改用 Firecrawl、Semantic Scholar API）。
來源登錄：同目錄 `sources.jsonl`（108 筆，一行一個來源；讀取程度以它為準，本筆記與它一致）。

## 讀取程度（2026-10-20 依抓取紀錄重新核對）

| 標記 | 意思 | 能怎麼用 |
|---|---|---|
| ✅ 讀過 | 整份頁面在輸出內、沒有截斷 | 官方文件與方法原文可直接引用；論文仍要有抽取紀錄才能引數字 |
| 🟡 部分 | 取得全文，但只讀了前 N 字元（截斷），或只用關鍵字抽段讀 | 只能引已讀段落；動筆前要從頭精讀 |
| 🟡 摘要 | 只讀到摘要（arXiv abs 頁、出版社頁、Semantic Scholar API） | 只能寫「這篇研究存在、摘要說…」，數字是線索，不能直接引 |
| 🔎 片段 | 只看過搜尋結果片段 | 不引 |
| 🔴 讀不到 | 試過的管道都失敗 | 不引；`tried` 欄記錄管道 |

**目前狀態**：108 個來源裡，論文 48 篇，**整份讀過的只有 2 篇**（Barnett 2024、NVIDIA FACTS 2024 的 HTML 全文）；部分 9 篇、摘要 32 篇、片段 4 篇、讀不到 1 篇。**沒有任何一篇有 deep-research 第 2.5 節要求的精讀抽取紀錄**，所以下文所有研究數字都是線索層級，要在該篇動筆前精讀確認。非論文來源（官方文件、方法原文、調查、事件報告）60 筆中，44 筆完整讀過、15 筆讀了部分、1 筆只有出版社說明（Bergman & Whittaker 2016 專書）。

> 2026-10-20 更正：前四輪筆記把「只讀到摘要」標成「✅ 摘要」，把截斷或抽段讀的論文標成「✅ 全文」，OmniDocBench 與 Ink & Switch 只看過搜尋片段卻標 ✅。本版依抓取紀錄（每次呼叫的狀態碼、位元組數、是否截斷、讀取字元上限）逐筆改正。
>
> 2026-10-16 更正：研究初期（Forte PARA、zettelkasten.de 入門、Matuschak、Johnny.Decimal、Obsidian 三頁）曾直接用工具查，沒有先跑 skill，也用了 Exa 與 Firecrawl；這些頁面已讀過，結論沿用。

### 研究分兩層

- **系列層（已完成）**：母群、掃描、覆蓋矩陣、偏誤，以及每篇的候選來源。產物用來決定「每篇讀哪些」，不能下結論。
- **篇章層（每篇動筆前）**：從候選來源挑 8–12 篇（含至少一篇結果相反或無效的），清單給使用者看；一個 agent 精讀 3–5 篇並交抽取紀錄（設計、數字與所在表節、限制、與摘要不一致處、讀取起訖位置）；沒參與精讀的人抽查三個數字。過五關才動筆。

---

## A 段：個人知識管理（order 0–5）

### 母群定義

個人知識管理方法＝個人用來收集、組織、找回、再利用自己的筆記與檔案的**公開成文方法**（有作者原始說明可讀），加上學術界個人資訊管理（PIM）研究對這些做法的實證結果。
不算：單純的工具功能介紹；任務管理方法本身（GTD 只取「收件匣＋每週回顧」）；團隊共用的系統（B 段）。

### 掃描方法

1. 分類目錄：英文維基「Personal knowledge management」「Personal information management」；GitHub awesome-knowledge-management（brettkromkamp）；awesome-pkm（knowfox，幾乎空白）。
2. 搜尋聚合：「PKM methods compared」類比較文（只當線索）。
3. 推薦鏈：dsebastien 的 PKM 文列出 Zettelkasten／PARA／Johnny.Decimal／Progressive Summarization／MOC／LIFT／Inbox Zero／Collector's Fallacy；Matuschak 引 Ahrens 與 Luhmann；zettelkasten.de 引 Luhmann 與 Eco。
4. 學術：PIM 文獻（Whittaker、Bergman、Jones、Najork）；記憶研究（生成效應、筆記媒介）；2024–2026 的 AI 筆記輔助研究。
5. 近年與反證：限定 2024 年後重搜；加 replication、criticism、does not 重搜；中文「卡片盒筆記 研究」。

### 來源清單（最終狀態）

| 類型 | 項目 | 讀取 | 用於 |
|---|---|---|---|
| 方法：放哪裡 | PARA（Forte，2023，更新 2026-04） | ✅ | 2 |
| 方法：放哪裡 | Johnny.Decimal 官方說明 | ✅ | 2 |
| 方法：放哪裡 | PPV（August Bradley） | 🔎 Reddit 片段 | 不引 |
| 方法：連結 | Luhmann〈Communicating with Slip Boxes〉英譯 | ✅ | 3 |
| 方法：連結 | Luhmann 檔案館內容總覽（德文） | ✅ | 3 |
| 方法：連結 | zettelkasten.de 入門 | 🟡 部分（前 3 萬字元） | 3 |
| 方法：連結 | Ahrens 概念逐頁整理（zettelkasten.de 2022，附頁碼；原書無公開全文） | ✅（二手） | 3 |
| 方法：連結 | Evergreen notes（Matuschak） | ✅ | 3 |
| 方法：連結 | MOC 定義與 Maps（LYT） | ✅ | 3 |
| 方法：連結 | 數位花園歷史（Appleton） | 🟡 部分 | 3 |
| 方法：處理 | Progressive Summarization（Forte 2017） | 🟡 部分（前 2 萬字元，layer 段已讀） | 5 |
| 方法：處理 | CODE（Forte BASB） | 🔎 | 不引 |
| 方法：收集 | Collector's Fallacy（2014） | ✅ | 1 |
| 方法：回顧 | GTD Weekly Review checklist | ✅ | 1、5 |
| 工具 | Obsidian：資料存放、內部連結（反向連結、properties 同系列頁） | ✅ | 4 |
| 工具 | Notion：匯出內容 | 🟡 部分（前 8 千字元，含匯出格式與私人頁限制） | 4 |
| 工具 | Ink & Switch〈Local-first software〉2019 | 🔎 只看過搜尋結果 | 4，要讀原文 |
| 研究 | Whittaker et al. CHI 2011 email 找回 | 🟡 部分（鏡像 PDF 全文取得，關鍵字抽段讀） | 2 |
| 研究 | Bergman et al. 2010 JASIST 資料夾深度與大小 | 🟡 部分（研究室 PDF，抽段讀） | 2 |
| 研究 | Bergman et al. 2008 TOIS 導覽偏好 | 🟡 摘要（ACM 擋、ResearchGate 403，S2 API） | 2 |
| 研究 | Bergman & Whittaker 2016 專書 | 🟡 摘要（出版社說明；MIT Press 403） | 2 |
| 研究 | Bergman & Dvir 2026 Hyper-searchers | 🟡 摘要 | 2 |
| 研究 | Bergman & Dvir 2024 File hyper-searching explained | 🔎（tandfonline 擋、PDF 被判含主動內容） | 不引 |
| 研究 | Whittaker & Hirschberg 2001 歸檔者與堆放者 | 🟡 摘要（S2 API） | 未用 |
| 研究 | Najork et al. 2024 Searching Personal Collections | 🟡 部分（HTML 只讀前 1.2 萬字元／21 萬位元組） | 0、1、2 |
| 研究 | 數位囤積 scoping review（HSSC 2026） | 🟡 摘要 | 1 |
| 研究 | Bertsch et al. 2007 生成效應統合分析 | 🟡 摘要 | 3 |
| 研究 | Urry et al. 2021 筆記媒介重複驗證 | 🟡 摘要（CRAN afex 文件附原摘要；APS、everydayresearchmethods 報導 ✅） | 3 |
| 研究 | Malashenko et al. 2023 Zettelkasten＋間隔重複 | 🟡 部分（全文取得、抽段讀） | 3 |
| 研究 | Schmidt 2016 Luhmann 卡片盒 | 🔴（docslib 只回推薦列表；substack 是影片說明） | 不引 |
| 研究 | Chen et al. 2025 More AI Assistance Reduces Cognitive Engagement | 🟡 部分（HTML 前 3.5 萬字元／35 萬位元組） | 5 |
| 研究 | Microsoft Research 2025 CHI 批判思考 | 🟡 部分（官方部落格前 1.5 萬字元；論文本身未讀） | 5 |
| 研究 | Etkin et al. 2025 Frontiers in Education | 🟡 摘要（全文頁只讀前 6 千字元） | 5 |
| 研究 | Melumad & Yun 2025 PNAS Nexus | 🟡 摘要（OUP 頁與 PDF 失敗、techxplore 403；S2 API） | 5 |
| 入口 | 維基 PIM 條目（keeping／finding／meta-level 活動模型） | 🟡 部分（前 4 萬字元） | 0、1 |
| 掃描 | 維基 PKM 條目、dsebastien、awesome 清單、Reddit 清單 | ✅／🟡 | 只當線索 |
| 站內 | llm-knowledge-vault、llm-knowledge-management-landscape | 站內 | 5 |

### 重點（標明讀取層級）

**方法原文（✅，屬作者主張）**

- **PARA**：Projects（有目標、會結束）／Areas（持續要照顧的責任）／Resources（感興趣的主題）／Archives（以上三類不再活躍的）；依可行動性分類，不依學科。反例：客戶把「招募」「策略規劃」列成專案，其實是 Areas。
- **Progressive Summarization**（🟡 部分，layer 段已讀）：Layer 0 原文 → 1 摘入 → 2 粗體 → 3 螢光 → 4 用自己的話摘要 → 5 改寫成作品；只在「本來就要看」時往下加一層；note-first，反對以標籤為主。
- **Luhmann 原文**：固定編號、不依主題分類；任意內部分支（57/12 → 57/12a）；連結與反向連結；關鍵字索引只記少數入口；要好幾年才達臨界量；沒連進網絡的筆記會被遺忘。
- **Luhmann 檔案館**：Zettelkasten I 有 108 個主題分部、書目與關鍵字索引；II 有 11 個；Luhmann 本人沒建內容總覽，現有層級是編輯決定。
- **zettelkasten.de**（🟡 部分）：超文本、原子性、個人化；一張卡片＝ID、用自己的話的本文、參考來源；「connection, not collection」。
- **Collector's Fallacy**：「知道有這個東西」≠「知道這個東西」；Eco 說影印是不讀的藉口；縮短「研究→閱讀→吸收」循環，設一小時上限、處理到收件匣清空。
- **Evergreen notes**：原子化、以概念為單位、密集連結、偏好聯想而非階層、預設寫給自己；受 Zettelkasten 影響。
- **Johnny.Decimal**：區域（10-19）→ 類別（15）→ ID（15.22）；每層不超過 10 個；數字讓位置固定、可口頭說。
- **MOC**：「把事物放在彼此脈絡中的地圖」；收集、碰撞、導覽三階段。
- **數位花園**（🟡 部分）：依主題連結而非時間；持續生長；源自 Bernstein 1998、Caulfield 2015。
- **GTD Weekly Review**：Get Clear（收集散件、收件匣歸零）→ Get Current（行動、行事曆、等待、專案清單）→ Get Creative（Someday/Maybe，刪掉不再感興趣的）。
- **Obsidian**：vault 是本機資料夾、筆記是 Markdown；Wikilink 與 Markdown 兩種連結，改檔名自動更新；block reference 是專屬語法、外部失效；反向連結分 linked／unlinked；properties 以 YAML 存在檔頭。
- **Notion 匯出**（🟡 部分）：Markdown & CSV；callout 等區塊轉成 HTML；匯出者沒權限的私人頁不會被匯出；整個 workspace 匯成 PDF 需 Business／Enterprise。

**研究（線索層級，動筆前要精讀）**

- **Whittaker et al. 2011**（🟡 部分，抽讀段落）：345 位使用者、平均 64 天、85,000 次以上找回；建很多資料夾的人找回成功率與少建者相同（都是 0.88），花的時間略長（72.87 vs 66.07 秒）；依賴搜尋與討論串者成功率較高；訪談：建資料夾主要為了整理收件匣、管理待辦（「My inbox is a todo list」）；作者指出檔案與網頁研究仍顯示偏好導覽，email 可能是例外。
- **Bergman et al. 2010**（🟡 部分，抽讀段落）：296 人找回 1,131 個檔案、5,035 個導覽步驟；平均深度 2.86 層、每資料夾約 11.82 個檔案；94% 找得到、平均 14.76 秒；找回時間 ≈ 4.956 + 2.236×深度 + 0.106×資料夾大小（秒）。
- **Bergman 2008／2016／Dvir 2026**（🟡 摘要）：導覽一直是找個人檔案的主要方式；2026 年研究仍「一致發現偏好導覽」，少數超級搜尋者（50 對 50）是因為導覽對他們特別吃力；專書說明稱階層資料夾對個人資料「偏好且最有效」。
- **Najork et al. 2024**（🟡 部分，前 1.2 萬字元）：個人收藏以找回自己見過的東西為主；轉述 Lansdale 1988（階層類別本身模糊）、Whittaker & Sidner 1996（春季大掃除者過半資料夾沒用）、Elsweiler 2008／2011（不歸檔者對內容記得更多）——這些轉述要回讀全文所在段落確認。
- **數位囤積 scoping review 2026**（🟡 摘要）：實證稀少、多集中在照片。
- **生成效應**（🟡 摘要）：Bertsch 2007，86 篇研究、445 個效果量，效果量 0.40，調節變項影響大——「用自己的話寫」的間接證據。
- **手寫 vs 打字**（🟡 摘要）：Urry 2021 預先登錄的直接重複驗證（142 人）＋小型統合分析：筆電組記下較多逐字內容，但測驗成績無差別 → 不引「手寫比打字好」。
- **Zettelkasten 直接證據**（🟡 部分）：Malashenko 2023 把 Zettelkasten 與間隔重複綁在一起測，無法分辨效果來源；2024–2026 再搜（"Zettelkasten empirical study"、"slip box evaluation"、「卡片盒筆記 研究」）仍沒有嚴謹實驗。
- **Chen et al. 2025**（🟡 部分）：30 人受試者內實驗，三種 AI 筆記輔助；全自動結構化筆記組測驗成績最低、摘要片段組最高，受試者卻最喜歡全自動——結果表要精讀確認。
- **Microsoft 2025 CHI**（🟡 部分，部落格）：319 位知識工作者、936 個案例；對 AI 信心越高批判思考越少，對自己信心越高越多。
- **Etkin et al. 2025**（🟡 摘要）：n=195、隨機交叉、預先登錄；AI 工具幫低能力者、傷高能力者，摘要工具對高能力者傷害最大——反證平衡。
- **Melumad & Yun 2025**（🟡 摘要）：7 個實驗、n=10,462；用 LLM 摘要學到的比自己搜網頁淺，附連結也一樣。

### 覆蓋矩陣

| 維度 | 值 | 選入 | 缺口 |
|---|---|---|---|
| 組織原理 | 容器 | PARA、Johnny.Decimal | |
| 組織原理 | 連結 | Zettelkasten、Evergreen、MOC | |
| 組織原理 | 不組織、靠搜尋 | Whittaker 2011、Najork 轉述的 Elsweiler | 沒有「純搜尋派」方法的作者原文 |
| 處理深度 | 輕 | Progressive Summarization | |
| 處理深度 | 重 | Zettelkasten、Evergreen | |
| 證據類型 | 作者自述 | 方法原文全部 | |
| 證據類型 | 實證 | PIM 研究、記憶研究、AI 筆記研究 | 都還沒精讀；方法本身（PARA、Zettelkasten）沒有嚴謹比較研究 |
| 時間 | 早期／近期 | Luhmann 1981 → PARA 2017/2023 → 2024–2026 研究 | |
| 失敗案例 | 方法沒用好 | Collector's Fallacy、Luhmann「沒連進網絡會被遺忘」、數位囤積回顧 | 沒有「試了 PARA 後放棄」的系統性資料 |
| 語言 | 非英語圈 | Luhmann（德）、Johnny.Decimal（澳） | 中文圈只有 Ahrens 譯本與實踐分享，無原生方法 |

### 偏誤

- 方法來源幾乎都是方法作者自述，作者多在賣課賣書（Forte、dsebastien、Milo）。作者主張與研究證據分開寫。
- 實證集中在 email 與檔案系統，不是筆記軟體；推論到筆記要說明限制。
- 中文圈是「接受與實踐西方方法」（《卡片盒筆記》譯本、閱讀前哨站、朱騏、陳文學醫師），可引一則中文實踐當入口（要先讀正文）。
- AI 筆記研究多是小樣本實驗（Chen 30 人）或大樣本線上實驗（Melumad），方向一致但機制不同，寫作時不混為一談。

---

## B 段：團隊知識庫（order 6–10）

### 母群定義

團隊知識庫＝給組織內成員閱讀的共用文件系統，涵蓋「要寫哪些類型」「怎麼組織」「怎麼寫」「誰維護」「怎麼找到」五類做法；母群包括公開的方法框架、大型組織公開的實務規範、研究與調查，以及 2025 年後出現的「給 AI 讀的團隊文件」（llms.txt、AGENTS.md）。
不算：對外行銷內容；單一工具的功能比較；給 RAG 讀的準備流程（C 段）。

### 掃描方法

1. 搜尋聚合：「internal documentation best practices」「wiki governance」（多為 Slite、Tettra、Docsie、XWiki 等廠商文，只當線索）。
2. 推薦鏈：廠商文共同引用 Diátaxis；Write the Docs 指南；Google docguide；GitLab handbook。
3. 分類目錄：Write the Docs Guide；NN/g 文章庫（IA、卡片分類、樹狀測試、搜尋紀錄分析）。
4. 研究與調查：ICSE 2019／2020 Aghajani；WikiSym 2010 Grudin；企業 wiki 多案例；離職知識流失回顧；ADR 研究；文件過時研究；Stack Overflow 2024、2025。
5. 客服知識：KCS v6。
6. 近年、反證與飽和：限定 2024 年後；「wiki success factors」「enterprise wiki adoption failure」「site search log analysis study」「enterprise search zero result queries」「站內搜尋 零結果 分析」「企業知識管理 實證」。

### 來源清單（最終狀態）

| 類型 | 項目 | 讀取 | 用於 |
|---|---|---|---|
| 文件類型 | Diátaxis 首頁、start-here | ✅ | 6、8 |
| 文件類型 | ADR（Nygard 2011） | ✅ | 8 |
| 文件類型 | runbook／SOP | 🔎 只在廠商文 | 不引 |
| 組織 | NN/g 卡片分類（2024） | 🟡 部分（前 2 萬字元） | 7 |
| 組織 | NN/g 樹狀測試（2023） | 🟡 部分（前 1 萬字元） | 7 |
| 組織 | GitLab handbook 頂層結構（handbook-first 原始檔） | ✅ | 7、9 |
| 組織 | Knowledge Architecture × NN/g intranet webinar | 🟡 部分；實為 2020 | 不當近年來源 |
| 寫作 | Google docguide best practices | ✅ | 8、9 |
| 寫作 | Google Technical Writing 課程 | 🔎 | 不引 |
| 維護 | Write the Docs docs-as-code | ✅ | 9 |
| 維護 | Notion 驗證頁面 | ✅ | 9 |
| 維護 | Guru／Slab／Confluence 驗證或封存 | 🔎 | 不引 |
| 維護 | KCS v6 041 Summary、Evolve Loop | ✅ | 9 |
| 搜尋 | NN/g 搜尋紀錄分析（2017） | ✅ | 10 |
| 第二種讀者 | llms.txt | 🟡 部分 | 10 |
| 第二種讀者 | AGENTS.md | ✅ | 10 |
| 調查 | Stack Overflow 2024 專業開發者 | ✅ | 6 |
| 調查 | Stack Overflow 2025 AI 章節 | ✅ | 6、10 |
| 研究 | Aghajani et al. ICSE 2019 文件問題分類 | 🟡 部分（作者網站 PDF，抽 Results 段） | 6 |
| 研究 | Aghajani 2019 replication package | ✅ | 6 |
| 研究 | Aghajani et al. ICSE 2020 從業者觀點 | 🟡 摘要（PDF 超過檔案大小上限） | 6 |
| 研究 | Grudin & Poole 2010 企業 wiki | 🟡 部分（MSR PDF，抽段讀） | 6、9 |
| 研究 | Stocker & Tochtermann 2011 企業 wiki 多案例 | 🟡 摘要 | 6 |
| 研究 | Galan 2023 離職知識流失回顧（91 篇） | 🟡 摘要（ERIC） | 6、9 |
| 研究 | ECSA 2024 ADR 行動研究 | 🟡 摘要 | 8 |
| 研究 | ICSA 2026 ADR 大規模研究 | 🔎（computer.org 無內文、S2 429） | 不引數字 |
| 研究 | Tan, Wagner & Treude 2024 EMSE 過時程式元素引用 | 🟡 摘要 | 9 |
| 研究 | Chatlatanagulchai et al. 2025 Agent READMEs | 🟡 摘要 | 10 |
| 研究 | Gloaguen et al. 2026 Evaluating AGENTS.md（v3） | 🟡 摘要 | 10 |

排除：廠商文裡查不到原始調查的統計（例如「Stack Overflow 調查 500 位工程師、78% 不信任內部文件」）；「工作時間花多少在找資訊」的廠商與舊 IDC 數字。

### 重點（標明讀取層級）

**實務規範（✅，屬做法描述，不是有效證據）**

- **Diátaxis**：四種需求對四種文件；羅盤＝「指導行動還是提供認知」×「服務學習還是工作」；工作流程：看現在的文件、找一件能改善的小事、做掉、重複。
- **ADR**：短文字檔放 repo（doc/arch/adr-NNN.md）；編號不重用；被推翻時保留並標 superseded；Title／Context／Decision／Status／Consequences（列出所有後果）；一到兩頁；動機：新人只能盲目接受或盲目推翻過去的決定。
- **Google docguide**：少量新鮮正確勝過大量失修；文件跟程式碼同一個 CL 改；死文件要刪，「先刪確定錯的、不明的先不動、預設刪除」；不重寫別處已有的指南；設計文件實作後當決策封存。
- **docs-as-code**：issue tracker、Git、純文字標記、code review、自動測試；可擋下沒附文件的合併。
- **GitLab handbook-first**：先寫進 handbook 再公告；Slack 只留 90 天；wiki 只讓少數人改，過時後沒人信；MR 任何人可提、DRI 核准；頁面太久沒更新通知 code owner。
- **KCS**：知識在需求當下、脈絡裡管理；被重用時才改進（just-in-time review）；個人負責行動、團隊共同擁有；常見錯誤是流程設計太複雜、花太多時間轉舊資料；不對活動量設目標。
- **Notion 驗證頁面**：預設建立者為 owner；驗證可設到期日或永久；到期通知 owner；搜尋結果有藍勾。
- **AGENTS.md**：給 coding agent 的 README；6 萬個以上開源專案；巢狀檔案就近優先；由 Linux Foundation 下的 Agentic AI Foundation 管理。
- **llms.txt**（🟡 部分）：網站用一份 Markdown 給 agent 看的精簡總覽；文件平台自動產生。

**方法說明（NN/g，屬實務做法）**

- **卡片分類**（🟡 部分）：開放式用來發現心智模型，驗證既有架構改用樹狀測試；30–50 張卡；質化至少 15 人、量化 30–50 人；限制是缺脈絡、只能分一層。
- **樹狀測試**（🟡 部分）：用純文字樹驗證使用者找不找得到。
- **搜尋紀錄分析**（✅）：「想要但找不到」「想要但不存在」「使用者詞彙 vs 網站詞彙」；對策有同義詞、best bets、改標題、補內容；log 含個資要處理。

**調查（✅，自願填答）**

- **Stack Overflow 2024**（約 29K 專業開發者）：61% 每天花 30 分鐘以上找答案；30% 說知識孤島每週影響 10 次以上；70% 知道去哪找、56% 能很快找到；53% 說等答案會打斷工作。
- **Stack Overflow 2025**（49,000 份以上）：84% 使用或打算使用 AI；51% 專業開發者每天用；不信任 AI 正確性（46%）多於信任（33%）；最大挫折是「幾乎對但不完全對」（66%）；仍會找人的首要原因是不信任 AI 答案（75%）；agent 使用者約 70% 認為提升個人效率，17% 認為改善團隊協作。

**研究（線索層級，動筆前要精讀）**

- **Grudin & Poole 2010**（🟡 部分，抽讀段落）：多家公司訪談＋MegaSoft 平台調查 433 份＋FlexWiki 調查 300 份；66% 回覆者的 wiki 六個月沒人用；最大的團隊 wiki 在整理者離開後長雜草、主管撤掉維護人力；主管要儀表板、寫的人要 FAQ；「記下退休員工隱性知識」沒看到實例；早期組織方式隨規模變成負擔。
- **Aghajani 2019**（🟡 部分，抽 Results 段）：878 筆資料、162 種問題；內容問題 485 筆中不完整 268、過時 190、不正確 72；流程 81、工具 134。
- **Aghajani 2020**（🟡 摘要）：146 位從業者兩份問卷，問哪些文件問題最重要。
- **Stocker & Tochtermann 2011**（🟡 摘要）：3 家奧地利企業、7 位專家與約 150 位員工；wiki 有個人與集體效益，列出成功因素——反證：wiki 不是注定爛。
- **Galan 2023**（🟡 摘要）：91 篇實證研究的系統性回顧，整理離職知識流失的前因與組織、單位層級影響。
- **ECSA 2024**（🟡 摘要）：ADR 處理了文件文化、知識傳承、優先順序；分散式系統的問題沒解；放在哪裡影響有沒有用。
- **Tan 2024**（🟡 摘要）：3,000 個以上 GitHub 專案，多數在某時點有文件引用已不存在的程式元素。
- **Agent READMEs 2025**（🟡 摘要）：1,925 個 repo、2,303 份 context 檔；頻繁小幅追加、難讀；測試流程 75.9%、實作細節 70.8%、架構 68.1%，安全 14.8%、效能 14.5%。
- **Evaluating AGENTS.md 2026 v3**（🟡 摘要）：context 檔整體不提高任務成功率，推理成本平均增 20% 以上；LLM 產生與人寫的一樣；指令會被遵守但 repo 總覽沒幫助；網路轉述「降低 3%」與 v3 摘要不同。

### 覆蓋矩陣

| 維度 | 值 | 選入 | 缺口 |
|---|---|---|---|
| 組織規模 | 小團隊 | Google docguide | |
| 組織規模 | 大組織 | GitLab、KCS、Grudin 的 MegaSoft | |
| 載體 | wiki／筆記工具 | Notion、Grudin | Confluence 官方文件未讀 |
| 載體 | repo | Write the Docs、Google、ADR、AGENTS.md | |
| 知識類型 | 工程文件 | Diátaxis、ADR、Google、Aghajani | |
| 知識類型 | 營運／客服 | KCS | |
| 知識類型 | 公司政策 | GitLab 頂層結構 | 非技術部門研究 |
| 證據類型 | 研究／調查 | 上表研究與 SO 調查 | 全部未精讀；IA 與搜尋紀錄分析只有方法說明 |
| 失敗與成功 | 爛掉／有效 | Grudin、Aghajani、GitLab 批評 vs Stocker 成功案例 | 沒有具名組織的失敗報告 |
| 時間 | 近年 | SO 2025、Tan 2024、ECSA 2024、AGENTS.md 2025–2026 | 團隊 wiki 本身的近年學術研究少 |

### 偏誤

- 實務來源偏軟體公司與工程文件；非技術部門只有 GitLab handbook 涉及。
- GitLab 賣版本控制、KCS 由推廣聯盟撰寫、Notion 是功能說明：寫成「做法的描述」，不是「有效的證據」。
- 調查只有 Stack Overflow，受訪者是自願填答的開發者。
- Grudin 2010 仍是最完整的企業 wiki 長期研究，寫作時註明年份與脈絡。

---

## C 段：AI 知識庫（order 11–19）

### 母群定義

AI 知識庫建置流程＝把組織文件變成可供 RAG／AI 助理檢索的語料時，**從來源到上線維護**要做的步驟與決定；母群是主要雲端與模型廠商的官方 ingestion／RAG 設計文件、安全標準、常用開源處理工具文件，加上經驗報告、基準研究與具名事件。
不算：檢索演算法本身（站內「RAG 技法大全」已寫，只連結）；agent 記憶系統（站內「AI Agent 記憶工程」）。

### 掃描方法

1. 平台官方文件：AWS Bedrock Knowledge Bases、Google Vertex AI RAG Engine、OpenAI Retrieval、Azure AI Search＋Azure Architecture Center RAG 設計系列、Microsoft 365 Copilot 治理藍圖、Microsoft Graph connectors、Amazon Q Business。
2. 安全：OWASP LLM08:2025；具名事件（Slack AI、EchoLeak）；防禦研究。
3. 學術與企業經驗：Barnett 2024、NVIDIA FACTS 2024、企業 RAG 系統性回顧。
4. 基準與實驗：文件解析（OmniDocBench、OHRBench、InduOCRBench、Santos）、切塊、過濾 ANN、知識衝突與過時文件、評估。
5. 工具：Docling、Presidio。
6. 站內既有：Ask AI 實戰、私有語料管線、RAG 技法大全。

### 來源清單（最終狀態）

| 步驟 | 項目 | 讀取 | 用於 |
|---|---|---|---|
| 準備、題庫 | Azure RAG preparation phase | ✅ | 11、12 |
| 總覽、評估 | Azure RAG 設計系列總覽 | ✅（評估篇本身未讀） | 11、19 |
| 解析、切塊 | Azure RAG chunking phase | 🟡 部分（前 2.5 萬字元） | 13、16 |
| 清理、metadata、注入 | Azure RAG enrichment phase | ✅ | 14、15 |
| 權限 | Azure security filter pattern | ✅ | 17 |
| 權限 | Microsoft 365 Copilot 治理藍圖（藍圖頁；PDF 未讀） | ✅ | 17 |
| 權限、同步 | Microsoft Graph connectors 爬取說明 | ✅ | 17、18 |
| 權限 | Amazon Q Business principal store | ✅ | 17 |
| 同步 | AWS Bedrock KB sync | ✅ | 18 |
| 連接、去重 | Google RAG Engine data ingestion | ✅ | 12、18 |
| metadata、刪除 | OpenAI Retrieval guide | 🟡 部分（前 2.5 萬字元；定價寫入前再核） | 15、16、18 |
| 解析工具 | Docling | ✅ | 13 |
| 個資 | Presidio | ✅ | 14 |
| 安全標準 | OWASP LLM08:2025 | ✅ | 12、14、17 |
| 事件 | PromptArmor 2024 Slack AI | ✅ | 14 |
| 事件 | Reddy & Gujral 2025 EchoLeak 案例研究 | 🟡 部分（HTML 前 2.5 萬字元） | 14 |
| 經驗報告 | Barnett et al. 2024 Seven Failure Points | ✅（HTML 全文未截斷；尚無抽取紀錄） | 11、19 |
| 經驗報告 | Akkiraju et al. 2024 FACTS（NVIDIA） | ✅（HTML 全文未截斷；尚無抽取紀錄） | 11、14、17、19 |
| 回顧 | Karakurt & Akbulut 2026 企業 RAG 系統性回顧 | 🟡 摘要（Groundlane 403，Firecrawl） | 11、19 |
| 題庫 | Kucia et al. CIKM 2026 合成題 vs 真實題 | 🟡 摘要 | 11、19 |
| 是否要 RAG、切塊 | Anthropic 2024 Contextual Retrieval | 🟡 部分（前 1.2 萬字元） | 11、15、16 |
| 版本、衝突 | Xie et al. ICLR 2024 知識衝突 | 🟡 摘要 | 12、18 |
| 版本 | VersionRAG 2025 | 🟡 摘要 | 12、18 |
| 解析 | Santos et al. 2026 From PDF to RAG-Ready | 🟡 摘要 | 13 |
| 解析 | OHRBench（ICCV 2025） | 🟡 摘要 | 13 |
| 解析 | InduOCRBench 2026 | 🟡 摘要 | 13 |
| 解析 | OmniDocBench（CVPR 2025） | 🔎 只看過搜尋結果 | 13，要讀原文 |
| 安全 | ConfusedPilot（UT Austin） | 🟡 摘要 | 14 |
| 安全 | CaMeL（Google）v2 | 🟡 摘要 | 14 |
| 安全 | Pai 2026 檢索內容防禦比較 | 🟡 摘要 | 14 |
| 安全 | Mu et al. 2026 Secure RAG 綜述 | 🟡 摘要 | 14、17 |
| 權限 | Bhatt et al. 2025 participant-aware access control | 🟡 部分（摘要與引言） | 17 |
| 結構 | Xu et al. SIGIR 2024 LinkedIn KG-RAG | 🟡 摘要 | 15 |
| 切塊 | Qu et al. NAACL Findings 2025 | 🟡 摘要 | 16 |
| 切塊 | Bennani & Moslonka ECIR 2026 | 🟡 摘要 | 16 |
| 權限過濾 | Filtered ANN 2026 | 🟡 摘要 | 17 |
| 更新 | Stale-document poisoning 2026 | 🟡 摘要 | 18 |
| 評估 | TREC 2024 RAG support 評估（SIGIR 2025） | 🟡 摘要 | 19 |

### 重點（標明讀取層級）

**官方文件（✅ 或 🟡 部分，屬做法描述）**

- **Azure preparation phase**：領域、內容分析、代表性內容（每種變體與格式至少兩份）、題庫平行做；題庫＝Query／Context（含頁碼與原文）／Answer；可用 LLM 從 chunk 生成合成題但要 SME 驗證；收集文件答不了的題；可從客服、FAQ 找真實問題；題庫要定期對照來源；決定要忽略的內容（目錄、頁首頁尾、浮水印、免責聲明）。
- **Azure chunking phase**（🟡 部分）：切塊方法依文件結構選；「semipermanent choice」；先合併 loading 與 chunking；避免中介格式造成資料遺失；成本要算實作種類、每份文件成本、初始量與增量。
- **Azure enrichment phase**：清理後另存一欄、回傳原文；內容不可當指令；metadata 依查詢類型決定（「2009 年產品 X」要靠關鍵字欄位精確比對）。
- **Azure security filter**：principal ID 字串欄位、filterable、retrievable=false；用 `search.in`；這是沒用內建 ACL 時的做法。
- **Microsoft Copilot 治理藍圖**：Copilot 依使用者已有權限作答；處理過度分享 → 設防護 → 符合法規。AI 不新增權限，但讓過寬權限變得找得到。
- **Microsoft Graph connectors**：增量爬取只偵測新增，完整爬取才捕捉新增與刪除；敏感或動態資料建議事件觸發同步。
- **Amazon Q Business**：每次爬取更新 ACL，要定期重新同步；User Store 修改是特權操作，應有核准流程。
- **AWS Bedrock KB sync**：新增、修改、刪除都要 sync；增量；只改 metadata 可不重算 embedding（CSV 例外）；非 Aurora 向量庫 sync 後幾分鐘才查得到。
- **Google RAG Engine**：`version_id` 是內容 hash；同路徑內容更新會重建；Drive 匯入時服務帳號沒權限「不會匯入也不會報錯」；匯入失敗紀錄（result sink）。
- **OpenAI Retrieval**（🟡 部分）：上傳自動切塊（預設 800 token、重疊 400）；attributes 過濾；hybrid 的 RRF 權重可調；刪除最終一致；儲存定價寫入前再核。
- **OWASP LLM08:2025**：存取控制不當、多租戶洩漏、跨來源知識衝突、embedding 反推、資料下毒；緩解＝permission-aware 向量庫、資料驗證、分類標記、不可竄改的檢索紀錄；情境 1 是履歷白字注入。
- **Docling**：多格式解析、版面與閱讀順序、表格、OCR、可本機執行。**Presidio**：辨識＋匿名化，官方警告自動偵測無法保證找全。
- **Anthropic Contextual Retrieval**（🟡 部分，已讀段落）：知識庫小於約 20 萬 token 可整份放進 prompt；contextual embeddings 失敗率 5.7%→3.7%，加 contextual BM25 到 2.9%，再加 rerank 降 67%；前處理約每百萬文件 token 1.02 美元。

**事件（✅／🟡 部分）**

- **Slack AI（PromptArmor 2024-08-20）**：攻擊者在只有自己的公開頻道放指令，受害者問 Slack AI 時私人頻道的 API key 被夾進「重新登入」連結；引用沒列出攻擊者訊息；Slack 回應這是預期行為；8 月 14 日起也讀上傳檔案。
- **EchoLeak（CVE-2025-32711）**（🟡 部分）：一封外部郵件、零點擊，串接繞過注入分類器、reference-style Markdown 連結、圖片自動載入、Teams 代理網域；2025 年 5 月修補、6 月 11 日公開；建議外部與內部內容分區、依來源控管權限。

**經驗報告（✅ 全文在輸出內，但尚無抽取紀錄）**

- **Barnett 2024**：三個系統（研究文獻助理、AI 助教、BioASQ 15,000 份文件、1,000 題）；7 個失敗點（內容缺失、沒排進前幾名、沒進 context、沒抽出、格式錯、具體程度不對、不完整）；RAG 只能在運作中驗證；穩健性是演化出來的。
- **NVIDIA FACTS 2024**：三個內部機器人（企業知識約 5 億份文件／7 TB 以上、IT/HR 約 2,000 份、財報約 4,000 份）；metadata 擴充、切塊、查詢改寫、重排影響最大；向量搜尋不擅長實體，要混合詞彙搜尋；守規則寫在 prompt 裡不可靠，改在前後處理把關；上線前先做資料治理與機密分級；遵守 ACL；LLM 評審有偏誤。

**研究（🟡 摘要／部分，數字是線索）**

- **企業 RAG 回顧 2026**：63 篇；多在實驗階段；63.6% 用 GPT 系列、80.5% 用 FAISS／Elasticsearch；不到 15% 處理即時整合；生成評估多用固定測試集。
- **Kucia 2026**：合成題 1,851 vs 真實 322；平均 15.7 vs 6.8 字；涵蓋來源 165 vs 53；合成題選出延遲最高的混合檢索（最多 8 倍）。
- **Xie 2024**：外部證據連貫時模型會採用，即使與自身知識衝突，但有確認偏誤。**VersionRAG 2025**：版本題 naive RAG 58%、GraphRAG 64%、VersionRAG 90%。
- **Santos 2026**：4 種轉換工具 × 21 種設定；36 份葡萄牙文行政文件（1,706 頁）、50 題、每設定 50 次；直接讀 PDF 86.2%、人工 Markdown 91.3%、最佳 94.1%；表格題在基本與階層切塊之間差 33 個百分點；metadata 與階層切塊貢獻大於轉換工具；GraphRAG 82%。
- **OHRBench 2025**：8,561 頁、8,498 組 QA；沒有任何 OCR 方案足以建高品質知識庫；語意與格式雜訊都與 RAG 表現呈趨勢關係。**InduOCRBench 2026**：OCR 字元準確率高不代表 RAG 好。**OmniDocBench**（🔎）：只看過搜尋結果，先前寫的「表格辨識 OCR 型優於 VLM」不引，要讀原文。
- **ConfusedPilot**：confused deputy 風險——惡意文字汙染回答、快取導致外洩、錯誤資訊擴散。**CaMeL v2**：AgentDojo 上可證安全完成 77% 任務，未防禦 84%。**Pai 2026**：3,510 次試驗；改寫檢索內容降攻擊成功率 55–84%；spotlighting 對 Claude Haiku 減半、對 Llama 3.1 8B 無效；金融領域殘留 26–33%；合成文件。**Mu 2026**：RAG 安全綜述（威脅與防禦分類）。
- **Bhatt 2025**（🟡 部分）：提示清洗、輸出過濾、系統隔離都是機率性的；用於檢索與生成的內容必須對互動中所有參與者都有授權（Alice 用 AI 回 Bob 的信，例）；已部署於 Copilot Tuning。
- **LinkedIn KG-RAG 2024**：歷史工單建成知識圖譜；MRR 高 77.6%；部署約六個月，解決時間中位數降 28.6%；單一公司自評。
- **Qu 2025**：語意切塊的計算成本不值得，真實文件上固定長度常更好。**Bennani 2026**（3 頁短文）：overlap 無可量測好處；句子切塊最划算，到約 5k token 與語意切塊持平；context 超過約 2.5k token 品質下降。
- **Filtered ANN 2026**：FAISS、Milvus、pgvector；過濾策略影響召回；pgvector 規劃器常選次佳計畫；低選擇性過濾下 IVFFlat 優於 HNSW。
- **Stale-document poisoning 2026**：317 個知識反轉；過時檢索翻轉 Llama 30%、Qwen 37% 答案；加「照文件回答」升到 66%／75%；新證據 97–100% 被採用；告知失效時點時大模型可正確切換；依時間重排降 4.6–10 點，需可靠日期 metadata。
- **TREC 2024 RAG 評估**：GPT-4o 與人工完全一致 56%；人修 LLM 標籤後 72%；獨立人審與 GPT-4o 更一致。

### 覆蓋矩陣

| 維度 | 值 | 選入 | 缺口 |
|---|---|---|---|
| 部署 | 全託管 | OpenAI、AWS、Google | |
| 部署 | 自建元件 | Azure AI Search、Docling、Presidio | 開源一站式平台站內已有，連結即可 |
| 階段 | 準備 | Azure、Kucia、Anthropic（不一定要 RAG） | 只有 Azure 寫得完整 |
| 階段 | 處理 | Azure、Docling、Santos、OHRBench、切塊研究 | 研究都未精讀 |
| 階段 | 安全 | OWASP、事件、CaMeL、Pai、Mu | |
| 階段 | 權限 | Azure、Microsoft、Amazon、Bhatt、Filtered ANN | |
| 階段 | 維護 | AWS、Google、OpenAI、Microsoft Graph、Stale-document | |
| 階段 | 評估 | Azure 總覽、Barnett、FACTS、TREC、Kucia、企業回顧 | Azure 評估篇本身未讀 |
| 證據類型 | 經驗報告 | Barnett、FACTS、LinkedIn | 都是作者自評 |
| 失敗案例 | 具名事件 | Slack AI、EchoLeak；Google Drive 靜默失敗 | 缺具名組織的 RAG 品質事故報告 |
| 語言 | 繁中語料 | 站內 zh-tw-embedding-rag-failures、private-corpus 系列 | 官方文件與研究都以英文為主（Santos 是葡萄牙文） |

### 偏誤

- 步驟母群主要來自雲端廠商文件，Azure 寫得最完整，規劃容易被它的分段牽著走。
- 廠商文件會推自家服務；NVIDIA 偏好自家工具；只取做法，不取產品推薦。
- 基準研究多用合成或英文資料（Pai 合成文件、Natural Questions）；推論到繁中企業文件要說明限制。

---

## 補搜紀錄與飽和

| 輪次 | 起因（使用者追問） | 做了什麼 | 主要改變 |
|---|---|---|---|
| 1 | 規劃前研究 | 方法原文與官方文件；三段母群與覆蓋矩陣 | 加「安全」篇；權限篇加先整理過寬權限；B 段維護篇加 KCS、GitLab、驗證到期；A 段作者主張與研究分開寫 |
| 2 | 「不能找別的資料嗎？」 | 讀不到的換管道（鏡像 PDF、作者網站、研究室頁）；補學術經驗報告與具名事件 | 取得 Whittaker、Bergman 2010、Aghajani 2019、Grudin 全文（但只抽段讀）；發現手寫優勢已被推翻 |
| 3 | 「為什麼資料都很舊？」 | 限定 2024–2026 重搜 | 補 AI 筆記研究、SO 2025、AGENTS.md 研究、資料準備與安全研究 |
| 4 | 「那不是應該補足嗎」 | 逐篇補反證與一手來源 | 補 Notion 匯出、樹狀測試、反證研究（Etkin、Stocker、Qu、InduOCR）與更新／評估研究 |
| 更正 | 「這樣合理嗎？」 | 依抓取紀錄重核讀取程度；建 `sources.jsonl` | 論文只有 2 篇整份讀過；其餘降為部分或摘要；OmniDocBench、Ink & Switch 降為片段 |

**飽和（系列層）**：換關鍵字再搜——中文（「知識庫 建置 研究」「企業知識管理 實證」「筆記軟體 使用者研究」「卡片盒筆記 研究」「站內搜尋 零結果 分析」）、近義詞（organizational memory、enterprise QA、note-taking app user study、PKM empirical）、其他學科（information science PIM、CSCW wiki、software engineering documentation）。回來的多是已讀來源或廠商、部落格。這只是系列層的一輪；**每篇的飽和要在篇章層對該篇關鍵主張再做**。

**試過但失敗的管道**（細節在 `sources.jsonl` 的 `tried`）：ACM、ResearchGate、MIT Press、tandfonline、MDPI（Groundlane 403，Firecrawl 可讀摘要）、OUP、techxplore、computer.org、Semantic Scholar 搜尋（429）、Aghajani 2020 PDF（超過檔案大小上限）、docslib。

**全文暫存**：whittaker2011.txt、bergman2010.txt、grudin2010.txt、aghajani2019.txt 在 session scratchpad，不進 repo；精讀時回原始網址或重抓。
