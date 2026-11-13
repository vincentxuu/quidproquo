# Research: 學習者帶著什麼來，內容怎麼接？（learning-content 系列・子問題一，代號 q1-learner）

日期：2026-10-13
狀態：步驟 0–6 完成；第二輪補讀完成（見下方〈第二輪補讀後的變動〉）。未寫文章、未改 repo 內任何文章／skill／程式。
原文存放：`.research/raw/learning-content/q1-learner/`（127 個檔，含 PDF、XML、HTML 與轉出的 txt）

toolDegradation：Groundlane MCP 不在本 session 工具清單（ToolSearch 查 `groundlane web_fetch` 只回 Exa）→ 降到 Keenable keyless API 做搜尋（要帶 `X-Keenable-Title` header，否則 400）→ 抓取用 curl 直連（PMC、ERIC、作者網頁、gwern 鏡像、NSF PAR）、Europe PMC REST、PMC OAI（作者稿）、Unpaywall／Semantic Scholar／Crossref API、keyless `r.jina.ai`（Springer 頁面）、Wayback。Exa `web_fetch_exa` 對 tandfonline 兩篇都回 `CRAWL_LIVECRAWL_TIMEOUT`。Springer、T&F、ACM DL、dblp、MIT DSpace 對 curl 回 challenge／403／429。PMC 網頁版抓到第五篇後開始回 reCAPTCHA，改走 Europe PMC 與 OAI。

讀取程度的標法（本 note 通用）：
- ✅ 全文已存到 raw，而且我讀了列出的段落（不等於逐頁讀完；讀了哪些段落寫在盤點表）
- 🟡 只讀到摘要，或只讀到別人的轉述
- 🔴 沒讀到內容

## 第二輪補讀後的變動（同日，依 team-lead 要求）

**寫作規則**：只讀到摘要的來源不列進參考資料，也不拿它的數字當依據。下面每一項都依這條重標。盤點表的 🟡 與 🔴 就是「不能引用」的清單。

**新拿到全文的**
- Simonsmeier 等 2022：Trier 大學作者頁的接受稿（`simonsmeier2021_am.pdf`，133,329 字元）。讀了摘要、方法（效果量準備）、結果的資料概況與主要結果、絕對增益與標準化增益的比較、調節變項段首。
- Wesenberg 等 2026（seductive details 的份量、先備知識、工作記憶；Springer OA）：讀了先備知識一節、樣本、討論。
- Walton 2023 的更正公告：Exa 取得全文。內容是補充資料 Table S6 有兩個數值在編輯時對調，作者聲明不影響其他表圖與結論。

**仍然拿不到的（試過的管道）**
- Sundararajan & Adesope 2020：Springer 付費；jina 只回參考文獻；Exa 只回摘要；WSU 典藏頁（期刊版與博士論文版）兩種工具都只回空殼；Unpaywall 無 OA。整體效果量 g = −0.33 只能從三篇引用它的論文看到，而且三篇對研究數的說法不一致。
- Reich & Ruipérez-Valiente 2019：MIT DSpace 對 curl、jina、Exa 都失敗（429／422／CRAWL_UNKNOWN_ERROR），隔 30 秒重試仍 429；Science 頁只給摘要；Ovid 頁只有摘要；搜到的另一個副本在匿名貼圖板上，來源不正當，不採用。
- Zengilowski 等 2021：Exa 對 doi 只回書目與 figshare 的編碼筆記開頭。
- Good 等 2010：Earlham 學院的舊 PDF 連結 404，Wayback 無快照；T&F 頁 Exa timeout。
- Durik & Harackiewicz 2007：Ovid 頁只有摘要。Durik 等 2015：Springer 付費，jina 只回參考文獻。
- Lazowski & Hulleman 2016：Sage 回 challenge。Hulleman & Harackiewicz 2009：Ovid 只有摘要。Prinz 等 2020 基準 meta：ScienceDirect 回 robot 頁。Qian & Lehman 2017：Exa 只回摘要。
- 另外兩篇新掃到、與本站讀者最相關的 seductive details 研究也只到摘要：Learning and Instruction 2024（自願 vs 強制情境）ScienceDirect 回 robot 頁、蘇黎世大學典藏頁沒有檔案連結；Brock 等 2025（物理影片）倫敦國王學院典藏 403。

**因此改變的結論**

| 結論 | 第一輪 | 第二輪 | 為什麼 |
|---|---|---|---|
| 先備知識預測後測、不預測增益 | 中（只到摘要） | **強**（就描述性結果而言），但多了三個但書 | 讀到全文：493 個研究、126,050 人。增益那一半只有 69 個研究、沒有一個是隨機實驗；受試者平均 11.3 歲；用絕對增益算是 r = −.263（先備少的人進步分數較多，作者歸因於天花板效應） |
| 直接告訴讀者「這很有用」會傷害沒信心的人 | 中 | **弱，且同一實驗室後來沒有複製出來** | Asher & Harackiewicz 2025 的七個實驗（N = 2,019）裡，直接告知用途 × 信心的交互作用在知覺用途、興趣、成績上都不顯著。原始的兩篇 Durik 研究我只拿得到 2007 那篇的摘要，而且摘要說的調節變項是興趣不是信心 |
| 直接告知用途有沒有用 | 沒單獨列 | **中**：提高知覺用途（d = 0.41）與事後索取資料的比例（39.2% 對 33.2%），對當場成績沒有效果（d = 0.03） | Asher & Harackiewicz 2025 全文 |
| 有趣但無關的細節妨礙學習 | 摘要層級 | **仍不能引用該統合分析**；可引用的是 Wesenberg 2026 兩個實驗：無關內容越多，回憶越差；先備知識與工作記憶都沒有調節 | 統合分析全文拿不到 |
| 動機介入平均 d = 0.49 | 列為衝突的一方 | **撤下**，不進結論 | Lazowski & Hulleman 2016 只有摘要 |
| 教材圖片影響女生理解（Good 2010） | 弱 | **不能引用**；第 5 篇若要談，只能寫「有一篇常被引用的研究，本輪沒讀到全文，也沒找到複製」 | 只有摘要 |
| Stereotype threat 效果小且有出版偏誤 | 強（靠兩篇摘要） | **強（已讀正文）** | Flore 2015：補進 11 個缺失效果量後 g = −0.07，不顯著；只有 7 個研究樣本超過 100。Shewach 2019：全部資料 d = −.22，校正後大幅下降，作者說舉證責任回到主張效果很大的一方 |
| MOOC 完成率沒有改善、多數人隔年不回來 | 新聞轉述 | **不能引用具體數字**；摘要只有三個定性結論 | 原文拿不到。第 4 篇的數字改由 Jordan 2015、Reich 2014、Kizilcec 2020 支撐，這三篇都讀過正文 |
| Walton 2023 有更正 | 內容不明 | 更正只涉及補充表格的兩格對調 | 讀到公告全文 |
| Growth mindset 兩派衝突 | 靠三篇摘要 | 維持衝突；補一個脈絡 | Tipton 2023 的作者群包含 mindset 介入的主要研究者（致謝列出對 Yeager 的資助）；Macnamara & Burgoyne 2023 指出有財務誘因的作者報告的效果較大 |
| 讀者判斷自己懂不懂的準確度低 | 強 | 強；補一個限制 | Yang 2023 自述：多數研究在實驗室、材料不是學生自己的課業 |

沒有改變的：反駁式寫法的平均效果與預測區間（Danielson 2024）、MOOC 介入放大後縮小（Kizilcec 2020）、前測題只幫到被問到的內容（St. Hilaire 2024）、線上課程入口線索的實地實驗（Kizilcec 2019、2020）。


## 第三輪：用公開資源再找一輪全文（2026-10-14）

規則：只用作者或出版者合法公開的版本。每篇試過的管道：Unpaywall API、OpenAlex（`open_access` 與 `locations`）、Semantic Scholar `openAccessPdf`、CORE 搜尋、Internet Archive Scholar、OSF 預印本搜尋、作者個人或實驗室網頁、機構典藏、博士論文、ResearchGate 作者上傳版（經 Keenable 抓取）、Exa 不帶 query 抓 DOI。這一輪只取檔、沒有讀，新取得的來源在盤點表仍標 🟡，等精讀。

檔案都在 `.research/raw/learning-content/q1-learner/`（任務訊息寫 `q1/`，我沿用既有目錄，沒有另開）。

| 來源 | 結果 | 取得的版本與檔案 | 沒成功的管道 |
|---|---|---|---|
| Sundararajan & Adesope 2020 | **取得論文版** | 第一作者 2018 年 WSU 博士論文（研究一是這份統合分析），WSU 典藏開放下載。`sundararajan2018_dissertation.pdf`，176,796 | 期刊版：Unpaywall、OpenAlex、S2 都標 closed；Internet Archive Scholar、OSF 無；CORE 回 500。Keenable 對 Springer 付費頁抓回的前 50,000 字元依 team-lead 裁決不用，已刪除、沒讀過；改用博士論文版，引用時寫明版本 |
| Wesenberg 等，seductive details 與外在動機（*Learning and Instruction*） | **取得** | ZORA 典藏的 PDF（Unpaywall 標為 submittedVersion；期刊版本身是 CC BY）。`wesenberg2024_li_zora.pdf`，98,972 | ScienceDirect 回 robot 頁 |
| Hulleman & Harackiewicz 2009 | **取得** | ResearchGate 作者上傳版（正文加補充資料），`hulleman2009_kf_rg.md`，24,048；官方補充資料 `hulleman2009_supplement.pdf`，25,319 | Unpaywall、OpenAlex、S2 標 closed；motivatelab 的作者稿連結 404；Internet Archive Scholar、OSF、CORE 無 |
| Lazowski & Hulleman 2016 | **取得論文版** | Lazowski 2015 年 JMU 博士論文，Wayback 存的 JMU 開放典藏 PDF。`lazowski2015_dissertation.pdf`，297,817 | 期刊版：Sage 回 challenge、Keenable 403；Unpaywall、OpenAlex、S2 標 closed；JMU 典藏對 curl 與 jina 回 403，改走 Wayback |
| Reich & Ruipérez-Valiente 2019 | **q4 已取得** | 作者上傳的 post-print，`q4-time/reich2019-mooc-pivot.md`，13,833 | （我這邊三輪都失敗，見第二輪紀錄） |
| Zengilowski 等 2021 | **沒有合法公開版本** | 無。搜尋服務對付費頁的抓取檔依裁決已刪除 | Unpaywall 與 OpenAlex 指到的 figshare 是補充資料；CORE 只有書目；Internet Archive Scholar、OSF 無；作者頁只有履歷 |
| Good 等 2010 | **拿不到** | — | 見盤點表 |
| Durik & Harackiewicz 2007 | **拿不到** | — | 見盤點表 |
| Durik 等 2015 | **拿不到** | — | 見盤點表 |

順帶取得、原本不在九篇裡的：Hulleman 等 2010（作者上傳版，截斷在 50,000 字元，`hulleman2010_kf_rg.md`）。另外搜到一份新統合分析〈Seductive Details, Cognitive Load, and Learning Outcomes: A Multi-level Meta-analysis and MASEM〉（Cheng 等，*Educational Psychology Review*，doi 10.1007/s10648-025-10099-z）。依同樣的管道找過：Unpaywall、OpenAlex、Semantic Scholar 都標 closed，OSF、Internet Archive Scholar、CORE 沒有，Springer 頁只回參考文獻，沒有作者上傳版。**拿不到全文**，只存了研討會摘要頁與新聞稿。

對各篇的影響：order 14（用途、興趣與有趣的細節）原本標「關鍵來源缺全文」，現在兩條主線的主要來源都有檔案了（統合分析的論文版、自願對強制情境的實驗、Hulleman 2009），可以進選讀。order 19 裡「誰覺得這不是寫給我的」那一節仍然沒有 Good 2010。order 13 的 Zengilowski 2021 仍缺。

---

## 步驟 0　選案

### 0-1 母群定義

**算**：以「讀者之間的差異」為自變項或調節變項的實證研究與回顧——先備知識的多寡與正確性、迷思概念、興趣、對自己能力的信心、學習意圖、社會身分——而且依變項是讀教材（文字、影片、線上課程）之後的理解、學習、興趣或持續行為；加上做內容的人處理這些差異的實務做法（先備清單、分級入口、前測、常見誤解段落、歡迎頁的線索）。

**不算**：教師在課堂上當面診斷與分組的做法；智力、工作記憶、閱讀障礙等內容作者無法從內容面處理的特質；學習者自己的讀書方法（站上 Learning How to Learn 系列已寫）；expertise reversal 與 refutation text 的「教材怎麼寫」那一側（`.work/teaching-text-research/notes.md` 已涵蓋，這裡只引用它核對過的數字）。

### 0-2 掃描方法與掃到的清單

掃描方法：(a) Keenable 以「主題 + meta-analysis／systematic review／registered report／replication」各查一輪，共 49 個查詢；(b) 從 scope 檔掃過的三本手冊目錄對應章節（HLW 1–4、LS 6 與 30、MM 13）反查近五年的統合分析；(c) 研討會：Learning@Scale 與 CHI 用作者網頁（Kizilcec）找到三篇實地實驗，L@S 2023／2024 的 dblp 目錄被 Anubis 擋住沒掃到；ICER 透過 progmiscon.org 與 Kim & Ko 2017 進入；(d) 推薦鏈：2026 年個人化反駁文那篇的引用帶出 Danielson 2024 與 Zengilowski 2021；Hecht 2022 的文獻回顧帶出 Durik 2007／2015 與 Canning 2015；(e) 非英語：用中文（簡、繁）與日文關鍵字各查兩到三輪；(f) 實務端：Google Technical Writing、MDN 寫作指南、Diátaxis、fast.ai 課程頁、Kim & Ko 對 30 個線上程式教學的內容分析。

掃到的候選（58 個，依主題；粗體是選入深讀的）：

- **先備知識**：**Simonsmeier 等 2022**、**Brod 2021**、**Tetzlaff 等 2025**（引用另一份研究）、**McNamara 等 1996**（同上）、**McNamara, Ozuru, Floyd 2011**、O'Reilly & McNamara 2007、Witherby & Carpenter 2022（rich-get-richer）、**Rethinking pre-training 2025**、Kalyuga 2007、Edelsbrunner 等 2024（知識測驗 alpha 的 meta）、Kennedy 等 2015（先備知識預測 MOOC 表現）
- **迷思概念與概念改變**：**Danielson 等 2024**、**Schroeder & Kucera 2022**（引用另一份研究）、Zengilowski 等 2021、**Dersch 等 2026（個人化反駁文）**、**Prinz, Golke, Wittwer 2021**、Prinz 等 2018／2019（double curse）、**Smith, diSessa, Roschelle 1993**、Hammer 1996、Qian & Lehman 2017、Chiodini 等 2021（progmiscon）、Tippett 2010、Ecker 等 2023（familiarity backfire 複製失敗）、湯澤・稲垣 2011（日本概念変化研究特集）、邱美虹 2000／2016
- **動機與興趣**：**Hulleman & Harackiewicz 2009**、Hulleman 等 2010、**Canning & Harackiewicz 2015**、**Harackiewicz 等 2016**、**Canning, Priniski, Harackiewicz 2019（兩年制學院）**、**Hecht 等 2022**、**Asher & Harackiewicz 2025**、Priniski 等 2019、**線上高年級課 UV 介入 2025**、Durik & Harackiewicz 2007、Durik 等 2015、**Lazowski & Hulleman 2016**、**Wang 等 2024（SDT 介入 meta）**、**Howard 等 2024**、Hidi & Renninger 2006、**Sundararajan & Adesope 2020**、**Clinton & van den Broek 2012**、Harackiewicz 等 2016（Interest Matters）
- **MOOC 與線上自學的持續**：**Kizilcec 等 2020（PNAS）**、**Kizilcec 等 2017（Science）**、**Reich 2014**、**Jordan 2015**、**Reich & Ruipérez-Valiente 2019**、**Huang 等 2023（Heliyon 系統性回顧）**、**Kizilcec & Schneider 2015**、**錢靜（清華・學堂在線）**、**李麗等 2016（深圳大學）**、喬寧等 2022、**石井等 2017（早稻田 edX）**、Rosé 等 2014、Alosi 等 2018（MOOC 適性化）
- **身分與歸屬**：**Good, Woodzicka, Wingfield 2010**、**Flore & Wicherts 2015**、**Flore, Mulder, Wicherts 2018**、**Shewach, Sackett, Quint 2019**、**Kizilcec & Saltarelli 2019（CHI）**、**Kizilcec & Saltarelli 2019（L@S）**、**Kizilcec 等 2020（CHI）**、**Walton 等 2023**、**Macnamara & Burgoyne 2023**、**Tipton 等 2023**、**Yeager 等 2019**、Zigerell 2017、Cheryan 等 2009
- **自我診斷與前測**：**Pan & Carpenter 2023**、**St. Hilaire, Chan, Ahn 2024**、**Yang 等 2023**、**Prinz, Golke, Wittwer 2020（介入 meta）**、Prinz 等 2020（基準 meta）
- **實務端**：**Kim & Ko 2017**、**Google Technical Writing〈Audience〉**、**MDN Writing style guide**、**MDN Learn web development 首頁**、**Diátaxis〈Tutorials〉**、**fast.ai 課程首頁**、progmiscon.org、Khan Academy Get ready 課程說明

### 0-3 覆蓋矩陣

維度取捨標準：沿這個維度走，做內容的人會不會做出不同的決定。

| 維度 | 值 | 選入的來源 | 缺口 |
|---|---|---|---|
| 讀者帶來的東西 | 先備知識的量 | Simonsmeier 2022、Tetzlaff 2025、McNamara 1996／2011、pre-training 2025 | 第二輪已補到 Simonsmeier 接受稿 |
| | 先備知識的正確性（迷思） | Danielson 2024、Schroeder 2022、Dersch 2026、Prinz 2021、Smith 1993 | Zengilowski 2021 的批判沒讀到 |
| | 興趣與信心 | Canning 2015、Hecht 2022、Asher & Harackiewicz 2025、Clinton 2012 | Durik 2007 只有摘要、2015 沒讀到 |
| | 學習意圖 | Reich 2014、Kizilcec & Schneider 2015 | |
| | 社會身分 | Kizilcec 2017／2019×2／2020、Walton 2023、Good 2010 | 教材層次只找到 Good 2010 一篇，只有摘要，不能引用 |
| 證據型態 | 統合分析 | Simonsmeier、Tetzlaff、Danielson、Schroeder、Lazowski、Wang、Sundararajan、Flore 2015、Shewach、Macnamara、St. Hilaire、Yang、Prinz 2020 | |
| | 大型實地實驗 | Kizilcec 2020（25 萬人）、Walton 2023（26,911 人）、Yeager 2019、Kizilcec 2019×2、2020 CHI | |
| | 實驗室小實驗 | Canning 2015、Prinz 2021、Hecht 2022 | |
| | 內容分析／實務文件 | Kim & Ko 2017、Google、MDN、Diátaxis、fast.ai | 實務端沒有成效數據 |
| 結果方向 | 支持 | 多數 | |
| | 沒效果或複製失敗 | Kizilcec 2020、Flore 2018、Macnamara 2023、UV 線上課 2025、L@S 多元聲明 | |
| | 反向 | Canning 2015、Canning 2019、Dersch 2026、Kizilcec 2020 CHI、Kizilcec 2020 PNAS（無落差課程） | |
| 情境 | 實驗室短教材 | 多數統合分析 | |
| | 學期課程 | Hulleman 2009、Harackiewicz 2016、Canning 2019 | |
| | 開放線上課 | Kizilcec 系列、Jordan、Reich | 都是 MOOC；部落格、YouTube、互動教學頁的讀者研究沒找到 |
| 語言／地區 | 美國 | 多數 | |
| | 歐洲 | 德國（Prinz、Dersch、Tetzlaff、Simonsmeier）、荷蘭（Flore） | |
| | 東亞 | 清華學堂在線、深圳大學、早稻田 edX、日本概念変化特集引言 | 都很薄，見偏誤 |
| 年代 | 2015 前 | Smith 1993、Hulleman 2009、Good 2010、Clinton 2012、Reich 2014 | |
| | 2015–2020 | 多數 | |
| | 2021 後 | Simonsmeier、Danielson、Tetzlaff、Dersch 2026、Asher & Harackiewicz 2025、St. Hilaire、Yang、Walton、Macnamara | |

缺口補搜一輪的結果：補到 Danielson 2024（NSF PAR 全文）、Dersch 2026、UV 線上課 2025、pre-training 2025、Kizilcec & Schneider 2015。仍然空著的：部落格／影片／互動頁讀者的持續研究；教材圖片或例子裡的身分線索的複製研究；讀者自選難度入口的準確度。

### 0-4 偏誤

- **語言與地區**：盤點表的 55 列裡只有 4 列是中文或日文，其餘都是英文；受試者以美國與德國大學生為主。中文只找到三份：清華的是學校新聞網上的研究摘要（有效樣本 167 人，問卷回收率約 1.5%，不是期刊論文）；深圳大學那篇是單一課程的行為分群；漢斯出版社那篇是問卷結構方程，期刊品質不明，沒進結論。日文只讀到早稻田的四頁研究報告與《心理學評論》概念変化特集的引言。臺灣只找到邱美虹的科教發展回顧，內容不是迷思概念的實證。找過的地方：Keenable 以「MOOC 辍学 影响因素 元分析」「MOOC 完課率 自我調整學習 台灣」「JMOOC 修了率 要因」「概念改變 迷思概念 邱美虹」「素朴概念 概念変化 反駁テキスト」「反驳文本 概念转变」查詢。**沒去找的**：CNKI、華藝、CiNii、J-STAGE 站內搜尋——這是我沒去拿，不是找不到。
- **平台**：線上自學的證據幾乎全來自 Harvard、MIT、Stanford 的 MOOC，而且同一位作者（Kizilcec）佔六篇。MOOC 有期限、有證書、有影片；本站是沒有期限的文章，推過去的落差寫在推論表。
- **受試者**：反駁文、utility value、前測題、後設理解的實驗多數用大學生與 1,500 字以內的短文。
- **倖存者**：出版偏誤在 stereotype threat 與 growth mindset 兩個主題已有統合分析明確點名；utility value 的研究多數出自同一個實驗室（Harackiewicz）。
- **為什麼還是選這些**：能取得全文、有對照條件、而且刻意納入了沒效果與反向的結果。

---

## 子問題（步驟 1）

1. **先備知識的量**：同一份教材對先備多與先備少的讀者，效果差多少、方向會不會相反？
2. **先備知識是錯的時候**：指出並反駁迷思概念對誰有用、對誰沒用或有害？「迷思」該被當成要拔掉的東西，還是可以接上去的材料？
3. **動機、興趣與信心**：內容能做的事（講用途、給選擇、放有趣的細節）對不同信心與興趣的讀者，效果一致嗎？
4. **持續與輟學**：線上自學的人什麼時候走、為什麼走；已知的介入放大到幾十萬人後還剩多少？
5. **身分與歸屬**：教材與課程頁面上的線索（圖片、講者、聲明）對「這是不是寫給我的」有多少實證，複製情形如何？
6. **自我診斷與前測**：讀者能不能判斷自己懂了沒、適不適合讀這篇；前測題有什麼用；做內容的人實際怎麼處理？

---

## 來源清單

訪問日皆為 2026-10-13。角色：一手＝原始研究或統合分析；二手＝評論、報導；實務＝業界指引或產品頁。

### 子問題 1　先備知識的量
- [Simonsmeier, Flaig, Deiglmayr, Schalk, Schneider (2022). Domain-specific prior knowledge and learning: A meta-analysis. *Educational Psychologist*](https://doi.org/10.1080/00461520.2021.1939700) — 一手；全文（[作者接受稿，Trier 大學](https://www.uni-trier.de/fileadmin/fb1/prof/PSY/PAE/Team/Schneider/SimonsmeierEtAl_2021.pdf)）
- [Brod (2021). Toward an understanding of when prior knowledge helps or hinders learning. *npj Science of Learning*](https://pmc.ncbi.nlm.nih.gov/articles/PMC8377096/) — 二手（對上一篇的評論）；全文
- Tetzlaff, Simonsmeier, Peters, Brod (2025). A cornerstone of adaptivity. *Learning and Instruction* 98:102142 — 一手；**轉引自 `.work/teaching-text-research/notes.md`**，本輪沒重讀
- [McNamara, Ozuru, Floyd (2011). Comprehension challenges in the fourth grade. *IEJEE*](https://files.eric.ed.gov/fulltext/EJ1070456.pdf) — 一手；全文
- [Rethinking pre-training: cognitive load implications for learners with varying prior knowledge (2025). *Frontiers in Psychology*](https://pmc.ncbi.nlm.nih.gov/articles/PMC12367772/) — 一手；全文

### 子問題 2　迷思概念
- [Danielson 等 (2024). The effectiveness of refutation text in confronting scientific misconceptions: A meta-analysis. *Educational Psychologist*](https://par.nsf.gov/servlets/purl/10629626) — 一手；全文（NSF PAR 作者稿）
- Schroeder & Kucera (2022). *Educational Psychology Review* 34:957–987 — 一手；**轉引自 teaching-text notes**
- [Dersch, Thacker, Eitel (2026). Should we tell teachers that they are (in)correct? How personalized refutation text promotes or hampers conceptual change. *Educational Psychology Review*](https://link.springer.com/article/10.1007/s10648-026-10116-9) — 一手；全文（作者以 Crossref 書目核對）
- [Prinz, Golke, Wittwer (2021). Counteracting detrimental effects of misconceptions on learning and metacomprehension accuracy. *Instructional Science*](https://link.springer.com/article/10.1007/s11251-021-09535-8) — 一手；全文
- [Smith, diSessa, Roschelle (1993). Misconceptions reconceived. *Journal of the Learning Sciences* 3(2)](https://doi.org/10.1207/s15327809jls0302_1) — 一手（理論）；全文
- [Zengilowski, Schuetze, Nash, Schallert (2021). A critical review of the refutation text literature. *Educational Psychologist*](https://doi.org/10.1080/00461520.2020.1861948) — 一手；**未讀到**，只有別人的轉述；**不能引用**
- [湯澤・稲垣 (2011). 日本における概念変化研究. *心理学評論* 54(3)](https://www.jstage.jst.go.jp/article/sjpr/54/3/54_201/_pdf/-char/en) — 二手（特集引言）；全文（五頁，只讀前兩頁）

### 子問題 3　動機、興趣、信心
- [Hulleman & Harackiewicz (2009). *Science* 326:1410–1412](https://doi.org/10.1126/science.1177067) — 一手；摘要（PubMed）；**不能引用**
- [Canning & Harackiewicz (2015). Teach it, don't preach it. *Motivation Science*](https://pmc.ncbi.nlm.nih.gov/articles/PMC4610746/) — 一手；全文（PMC 作者稿）
- [Harackiewicz 等 (2016). Closing achievement gaps with a utility-value intervention. *JPSP*](https://pmc.ncbi.nlm.nih.gov/articles/PMC4853302/) — 一手；全文
- [Canning, Priniski, Harackiewicz (2019). Unintended consequences of framing a utility-value intervention in two-year colleges. *Learning and Instruction* 62](https://files.eric.ed.gov/fulltext/ED622933.pdf) — 一手；全文
- [Hecht 等 (2022). The role of utility value in promoting interest development](https://pmc.ncbi.nlm.nih.gov/articles/PMC9090178/) — 一手；全文
- [Asher & Harackiewicz (2025). Using choice and utility value to promote interest. *Journal of Educational Psychology*](https://pmc.ncbi.nlm.nih.gov/articles/PMC12490784/) — 一手；全文（作者與期刊以 Europe PMC 書目核對；raw 檔名 `patall2025_*` 是下載時取錯的代稱）
- [A utility value intervention to support student engagement in online upper-level undergraduate courses (2025). *Frontiers in Education*](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2025.1636446/full) — 一手；全文
- [Lazowski & Hulleman (2016). Motivation interventions in education. *RER*](https://doi.org/10.3102/0034654315617832) — 一手；摘要（ERIC）；**不能引用**
- [Wang 等 (2024). A systematic review and meta-analysis of SDT-based interventions in the education context. *Learning and Motivation*](https://selfdeterminationtheory.org/wp-content/uploads/2024/06/2024_WangWangEtAl_MetaEdu.pdf) — 一手；全文
- [Howard, Slemp, Wang (2024). Need support and need thwarting. *PSPB*](https://pmc.ncbi.nlm.nih.gov/articles/PMC12276404/) — 一手；全文
- [Sundararajan & Adesope (2020). Keep it coherent: A meta-analysis of the seductive details effect. *EPR*](https://doi.org/10.1007/s10648-020-09522-4) — 一手；摘要（ERIC）；**不能引用**
- [Wesenberg, Jansen, Krieglstein, Meusel, Schneider (2026). The more, the worse? The influence of the seductive detail amount on learning. *Instructional Science*](https://link.springer.com/article/10.1007/s11251-026-09781-8) — 一手；全文（第二輪新增）
- [The influence of seductive details in learning environments with low and high extrinsic motivation (2024). *Learning and Instruction*](https://doi.org/10.1016/j.learninstruc.2024.102054) — 一手；摘要；**不能引用**（第二輪新增）
- [Durik & Harackiewicz (2007). Different strokes for different folks. *J Educ Psychol* 99(3)](https://doi.org/10.1037/0022-0663.99.3.597) — 一手；摘要；**不能引用**
- [Clinton & van den Broek (2012). Interest, inferences, and learning from texts. *Learning and Individual Differences*](https://files.eric.ed.gov/fulltext/ED534936.pdf) — 一手；全文
- [Hidi & Renninger (2006). The four-phase model of interest development. *Educational Psychologist*](https://doi.org/10.1207/s15326985ep4102_4) — 一手（理論）；全文

### 子問題 4　持續與輟學
- [Kizilcec 等 (2020). Scaling up behavioral science interventions in online education. *PNAS* 117(26)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7334459/) — 一手；全文
- [Kizilcec, Saltarelli, Reich, Cohen (2017). Closing global achievement gaps in MOOCs. *Science*](https://doi.org/10.1126/science.aag2063) — 一手；全文（兩頁 Policy Forum）
- [Reich (2014). MOOC completion and retention in the context of student intent. *EDUCAUSE Review*](https://er.educause.edu/articles/2014/12/mooc-completion-and-retention-in-the-context-of-student-intent) — 一手；全文（Wayback）
- [Jordan (2015). MOOC completion rates revisited. *IRRODL* 16(3)](https://doi.org/10.19173/irrodl.v16i3.2112) — 一手；全文
- [Reich & Ruipérez-Valiente (2019). The MOOC pivot. *Science*](https://doi.org/10.1126/science.aav7958) — 一手；**未讀原文**（只有 Science 頁的摘要），**不能引用**；另讀到 [Inside Higher Ed 報導](https://www.insidehighered.com/digital-learning/article/2019/01/16/study-offers-data-show-moocs-didnt-achieve-their-goals)
- [Huang, Jew, Qi (2023). Take a MOOC and then drop. *Heliyon*](https://pmc.ncbi.nlm.nih.gov/articles/PMC10133660/) — 一手（系統性回顧）；全文
- [Kizilcec & Schneider (2015). Motivation as a lens to understand online learners. *TOCHI*](https://rene.kizilcec.com/wp-content/uploads/2013/02/kizilcec2015motivation.pdf) — 一手；全文
- [錢靜. 提高中國學習者慕課完成率的心理學研究（清華大學新聞網）](https://www.tsinghua.edu.cn/info/1666/70228.htm) — 一手作者的非正式發佈；全文
- [李麗等 (2016). 影響 MOOC 學習品質的關鍵因素探討](https://fangfang-zhang.github.io/files/%5B2016%5D%20%E5%BD%B1%E5%93%8DMOOC%E5%AD%A6%E4%B9%A0%E8%B4%A8%E9%87%8F%E7%9A%84%E5%85%B3%E9%94%AE%E5%9B%A0%E7%B4%A0%E6%8E%A2%E8%AE%A8_%E5%9F%BA%E4%BA%8E%E5%AD%A6%E4%B9%A0%E8%80%85%E8%A1%8C%E4%B8%BA%E8%A7%86%E8%A7%92_%E6%9D%8E%E4%B8%BD.pdf) — 一手；全文
- [石井等 (2017). グローバル MOOC における修了率と動画再生ログの分析. 日本教育工学会研究報告集 JSET17-5](https://www.waseda.jp/inst/ches/assets/uploads/2017/12/GlobalMOOC.pdf) — 一手；全文（四頁）

### 子問題 5　身分與歸屬
- [Good, Woodzicka, Wingfield (2010). *J Soc Psychol* 150(2):132–147](https://doi.org/10.1080/00224540903366552) — 一手；摘要（PubMed）；**不能引用**
- [Flore & Wicherts (2015). *Journal of School Psychology* 53](https://gwern.net/doc/psychology/cognitive-bias/stereotype-threat/2015-flore.pdf) — 一手；全文
- [Flore, Mulder, Wicherts (2018). *Comprehensive Results in Social Psychology*](https://doi.org/10.1080/23743603.2018.1559647) — 一手（註冊報告）；全文（Wayback）
- [Shewach, Sackett, Quint (2019). *J Applied Psychology*](https://gwern.net/doc/psychology/2019-shewach.pdf) — 一手；全文
- [Kizilcec & Saltarelli (2019). Psychologically inclusive design. CHI 2019](https://rene.kizilcec.com/wp-content/uploads/2019/05/kizilcec2019pid.pdf) — 一手；全文
- [Kizilcec & Saltarelli (2019). Can a diversity statement increase diversity in MOOCs? L@S 2019](https://rene.kizilcec.com/wp-content/uploads/2019/05/kizilcec2019diversity.pdf) — 一手；全文
- [Kizilcec 等 (2020). Welcome to the course. CHI 2020](https://rene.kizilcec.com/wp-content/uploads/2020/02/kizilcec2020welcome.pdf) — 一手；全文
- [Walton 等 (2023). Where and with whom does a brief social-belonging intervention promote progress in college? *Science* 380](https://gregorywalton.com/uploads/4/9/4/4/49448111/waltonetal2023.pdf) — 一手；全文。**有更正**：[10.1126/science.ads9718](https://doi.org/10.1126/science.ads9718)（2024-09-12，補充資料 Table S6 兩個數值對調，已讀）
- [Macnamara & Burgoyne (2023). *Psychological Bulletin*](https://artscimedia.case.edu/wp-content/uploads/sites/141/2020/06/26110416/Macnamara-Burgoyne-2023.pdf) — 一手；全文
- [Tipton 等 (2023). *Psychological Bulletin*（評論）](https://pmc.ncbi.nlm.nih.gov/articles/PMC10495100/) — 一手；全文
- [Yeager 等 (2019). *Nature* 573](https://pmc.ncbi.nlm.nih.gov/articles/PMC6786290/) — 一手；全文

### 子問題 6　自我診斷與前測
- [Pan & Carpenter (2023). Prequestioning and pretesting effects. *EPR* 35](https://doi.org/10.1007/s10648-023-09814-5) — 一手（回顧）；全文
- [St. Hilaire, Chan, Ahn (2024). Guessing as a learning intervention. *Psychonomic Bulletin & Review*](https://doi.org/10.3758/s13423-023-02353-8) — 一手；全文
- [Yang 等 (2023). Mind the gap between comprehension and metacomprehension. *RER*](https://discovery.ucl.ac.uk/10150804/) — 一手；全文（UCL 作者稿）
- [Prinz, Golke, Wittwer (2020). To what extent do situation-model-approach interventions improve relative metacomprehension accuracy? *EPR*](https://link.springer.com/article/10.1007/s10648-020-09558-6) — 一手；全文
- [Kim & Ko (2017). A pedagogical analysis of online coding tutorials. SIGCSE '17](https://faculty.washington.edu/ajko/papers/Kim2017CodingTutorialEvaluation.pdf) — 一手；全文
- [Google Technical Writing One：Audience](https://developers.google.com/tech-writing/one/audience) — 實務；全文
- [MDN Writing style guide](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide) — 實務；全文已存，只讀相關段
- [MDN Learn web development](https://developer.mozilla.org/en-US/docs/Learn_web_development) — 實務；全文
- [Diátaxis：Tutorials](https://diataxis.fr/tutorials/) — 實務；全文
- [fast.ai Practical Deep Learning for Coders](https://course.fast.ai/) — 實務；全文

---

## 讀取完整度盤點

| 來源 | 讀到什麼程度 | 阻礙 |
|---|---|---|
| Simonsmeier 2022 | ✅ 全文（作者接受稿，133,329 字元）；讀了摘要、效果量準備、資料概況、主要結果與 Table 2、絕對與標準化增益比較、調節變項段首 | 第一輪被 T&F 擋住；第二輪用 Exa 搜到 Trier 大學作者頁的接受稿。接受稿與刊出版可能有細節差異；討論的後半與補充資料沒讀 |
| Brod 2021 | ✅ 全文（15,661 字元，整篇讀完） | 無 |
| Tetzlaff 2025 | 🟡 轉引本站另一份筆記 | **我沒去拿**：原 PDF 在 `.work/teaching-text-research/src/tetzlaff2025.pdf`，任務書要求不重做，所以只引它核對過的數字 |
| McNamara 等 2011 | ✅ 全文；讀了摘要、討論首段 | 無 |
| Pre-training 2025 | ✅ 全文；讀了摘要、限制 | 結果數字段沒讀；依變項是自評認知負荷 |
| Danielson 2024 | ✅ 全文（158,245 字元）；讀了摘要、納入標準、backfire 段、主要結果與 Table、調節變項摘要、限制 | 雙欄 PDF，數字表用 raw 模式重抽才對得上 |
| Schroeder & Kucera 2022 | 🟡 轉引本站另一份筆記 | 同 Tetzlaff |
| Dersch 等 2026 | ✅ 全文（115,442 字元）；讀了引言、受試者招募段首句、討論前四段 | jina 版沒有摘要與作者欄；方法與結果的統計細節沒逐段讀 |
| Prinz 2021 | ✅ 全文；讀了引言首段、受試者、設計、材料、討論首節 | 無 |
| Smith 等 1993 | ✅ 全文已存；讀了摘要與一段案例分析 | **我沒讀完**，49 頁只看了約兩頁 |
| Zengilowski 2021 | 🔴 沒有合法公開的全文；只有書目與別人的轉述 | 第三輪：Unpaywall 與 OpenAlex 都只指到 figshare 的補充資料；CORE、Internet Archive Scholar、OSF 都沒有；作者 Schuetze 的個人頁只有履歷。Keenable 對 T&F 付費頁抓回的前 50,000 字元（`zengilowski2021_kf_pub0.md`）依 team-lead 裁決不用，**已刪除，沒讀過**。order 13 不引它的內容 |
| 湯澤・稲垣 2011 | 🟡 引言前段 | **我沒讀完**；特集內 12 篇論文都沒讀 |
| Hulleman & Harackiewicz 2009 | 🟡 **第三輪取得全文（未讀）** | ResearchGate 上作者 Chris Hulleman 自己上傳的版本，經 Keenable 抓取：`hulleman2009_kf_rg.md`，24,048（正文加補充資料）；另有官方補充資料 PDF `hulleman2009_supplement.pdf`，25,319；博士論文（ERIC ED498264）收錄同一個高中研究 |
| Canning & Harackiewicz 2015 | ✅ 全文（92,754 字元）；讀了摘要、總討論、限制 | 無 |
| Harackiewicz 2016 | ✅ 全文；讀了摘要、受試者與課程結構、主要結果一段、限制 | 中介分析與補充分析沒讀 |
| Canning 等 2019 | ✅ 全文；讀了摘要、引言相關段、受試者 | 無 |
| Hecht 2022 | ✅ 全文；讀了摘要、對 Durik 2007／2015 與 Canning 2015 的回顧段 | 無 |
| Asher & Harackiewicz 2025 | ✅ 全文；讀了摘要、受試者、統合七個實驗的結果與 Table 5、成績與索取資料兩段、限制 | 各單一實驗的細節沒讀 |
| UV 線上課 2025 | ✅ 全文；讀了摘要、受試者、結果摘述、限制 | 統計表沒逐項讀 |
| Lazowski & Hulleman 2016 | 🟡 期刊版只有摘要；**第三輪取得第一作者博士論文全文（未讀）** | 期刊版 Sage 付費。Lazowski 2015 年 JMU 博士論文（同一份統合分析的論文版）經 Wayback 取得 JMU 開放典藏的 PDF：`lazowski2015_dissertation.pdf`，297,817。論文版與期刊版的納入研究數與數字可能不同，引用時要寫明引的是哪一版 |
| Wang 2024 | ✅ 全文；讀了摘要、限制 | 無 |
| Howard 2024 | ✅ 全文；讀了摘要、限制 | 結果表沒讀；作者自述資料是相關性的 |
| Sundararajan & Adesope 2020 | 🟡 期刊版只有摘要；**第三輪取得作者博士論文全文（未讀）**，其中研究一就是這份統合分析 | 期刊版 Springer 付費。博士論文在 WSU 典藏開放下載：`sundararajan2018_dissertation.pdf`，176,796。論文版與期刊版的納入研究數與數字可能不同，引用時要寫明引的是哪一版 |
| Clinton & van den Broek 2012 | ✅ 全文；讀了摘要、受試者、總討論 | 結果統計沒逐項讀；作者沒有獨立的限制一節 |
| Hidi & Renninger 2006 | ✅ 全文；讀了摘要、教育意涵一節開頭 | 理論文章，其餘沒讀 |
| Kizilcec 2020 PNAS | ✅ 全文（34,115 字元）；讀了摘要、引言、四種介入的說明、主要結果三節、Table 1 | SI Appendix 沒讀 |
| Kizilcec 2017 Science | ✅ 全文（兩頁）；讀了第一頁 | 雙欄抽取混排，數字以 PNAS 2020 的 Table 1 回述為準 |
| Reich 2014 | ✅ 全文；讀了重點摘要、引言、意圖分布表 | Wayback 回的是 gzip，解壓後才能讀 |
| Jordan 2015 | ✅ 全文；讀了摘要、結論 | 無 |
| Reich & Ruipérez-Valiente 2019 | 🟡 全文在 q4 的目錄（我沒讀） | q4 經 ResearchGate 取得作者 Ruipérez-Valiente 自己上傳的 post-print：`.research/raw/learning-content/q4-time/reich2019-mooc-pivot.md`，13,833。q4 的筆記記載已讀正文 |
| Huang 等 2023 | ✅ 全文；讀了摘要、方法、來源國別段、因素表數列、結論 | 無 |
| Kizilcec & Schneider 2015 | ✅ 全文；讀了摘要、一段結果、限制 | 其餘沒讀；作者自述填問卷的人本來就較投入 |
| 錢靜（清華） | ✅ 全文 | 不是同儕審查論文 |
| 李麗等 2016 | ✅ 全文；讀了摘要、迴歸結果表、結論開頭 | 單一課程，迴歸樣本 588 人 |
| 石井等 2017 | ✅ 全文（四頁） | 無 |
| Good 等 2010 | 🟡 PubMed 摘要 | **三輪都拿不到**：Unpaywall、OpenAlex、Semantic Scholar 都標 closed；CORE 只有書目；Internet Archive Scholar、OSF 無；作者 Good 的個人頁只有履歷；Earlham 舊連結 404、Wayback 無快照；T&F 頁 Exa timeout、Keenable 403；找不到 ResearchGate 頁。不能引用 |
| Flore & Wicherts 2015 | ✅ 全文；讀了摘要、篩選結果、漏斗圖與 trim-and-fill、限制、結論 | 調節變項各節沒細讀 |
| Flore 等 2018 | ✅ 全文；讀了摘要、討論首段 | Wayback 回 gzip |
| Shewach 等 2019 | ✅ 全文；讀了摘要、整體效果一句、出版偏誤方法的說明、限制、結論 | 各子集的表沒逐項讀 |
| Kizilcec & Saltarelli 2019 CHI | ✅ 全文；讀了摘要、討論首段 | 無 |
| Kizilcec & Saltarelli 2019 L@S | ✅ 全文；讀了摘要、限制、結論 | 方法與結果的統計沒讀 |
| Kizilcec 2020 CHI | ✅ 全文；讀了摘要、討論首段 | 無 |
| Walton 2023 | ✅ 全文；讀了摘要、引言、主效果一段；更正公告全文（經 Exa） | 無 |
| Macnamara & Burgoyne 2023 | ✅ 全文；讀了摘要、納入標準段、限制開頭 | 雙欄抽取混排，三個統合分析的細節沒讀；數字以摘要為準 |
| Tipton 2023 | ✅ 全文；讀了摘要、效果量脈絡一段、重新分析的結語、限制 | 重新分析的數字沒抽到 |
| Yeager 2019 | ✅ 全文；讀了摘要、主效果段 | 無 |
| Pan & Carpenter 2023 | ✅ 全文（124,596 字元）；讀了文字教材一節、結論 | 其餘沒讀 |
| St. Hilaire 2024 | ✅ 全文；讀了引言相關段、主要結果、出版偏誤、調節變項一段、結論 | jina 版沒有摘要 |
| Yang 2023 | ✅ 全文；讀了摘要、納入標準、出版偏誤檢查的前兩種方法、限制 | 各介入的效果量表沒讀 |
| Prinz 2020（介入 meta） | ✅ 全文；讀了引言首段、主要結果、出版偏誤、討論首節 | 無 |
| Prinz 2020（基準 meta，*Educational Research Review*） | 🔴 | **擋住**：ScienceDirect 回 robot 頁、無 OA。+.24 這個數字只見於同作者介入 meta 的引言。不能直接引用 |
| Kim & Ko 2017 | ✅ 全文；讀了摘要、3.1 節 | 無 |
| Google〈Audience〉、MDN 兩頁、Diátaxis、fast.ai | ✅ 全文 | 無 |
| Qian & Lehman 2017 | 🟡 摘要（經 Exa） | **擋住**：ACM DL 403。沒進結論 |
| Durik & Harackiewicz 2007 | 🟡 摘要（Ovid、ERIC、Exa） | **三輪都拿不到**：Unpaywall、OpenAlex、Semantic Scholar 標 closed；CORE 與 OSF 的同名結果是別的文章；Internet Archive Scholar 無；Durik 的 NIU 個人頁只有履歷；找不到 ResearchGate 頁。不能引用 |
| Durik 等 2015 | 🔴 只有書目與摘要 | **三輪都拿不到**：Unpaywall、OpenAlex、Semantic Scholar 標 closed；CORE 只有書目；Internet Archive Scholar、OSF 無；Springer 頁經 Keenable 與 Exa 都只回摘要與參考文獻；academia.edu 頁只有書目。Keenable 搜它的 ResearchGate 頁時回的是另一篇（Hulleman 等 2010，作者 Harackiewicz 上傳，`hulleman2010_kf_rg.md`，50,311，截斷）。不能引用 |
| Wesenberg 等 2026（第二輪新增） | ✅ 全文（80,992 字元）；讀了先備知識一節、樣本、討論 | 兩個研究的結果表沒逐項讀 |
| Cheng, Wu, Wang, Wang（2025 線上／2026 刊出），Seductive details, cognitive load, and learning outcomes: A multi-level meta-analysis and MASEM，*Educational Psychology Review*（第三輪新增） | 🟡 只有研討會摘要與新聞稿（都沒讀，只存檔） | **拿不到全文**：Unpaywall、OpenAlex、Semantic Scholar 標 closed；OSF、Internet Archive Scholar、CORE 無；Springer 頁經 jina 只回參考文獻（`sd_masem2025_springer_refs_only.txt`）；找不到作者上傳版。存了 ECER 研討會摘要頁與華東師大的新聞稿（`sd_masem2025_ecer_abstract.html`、`sd_masem2025_eurekalert.html`）。不能引用 |
| Wesenberg, Jansen, Krieglstein, Schneider 等 2024／2025，seductive details 與外在動機（*Learning and Instruction*） | 🟡 **第三輪取得全文（未讀）** | 蘇黎世大學典藏 ZORA 的 DSpace API 找到檔案：`wesenberg2024_li_zora.pdf`，98,972。先前只讀過摘要 |

合計 58 列（第二輪後）：✅ 44、🟡 10、🔴 4。第一輪是 55 列、✅ 27、🟡 23、🔴 5。🟡 與 🔴 的來源依規則都不能列進參考資料：其中被付費牆或反爬蟲擋住的是 Hulleman 2009、Lazowski、Sundararajan、Good 2010、Durik 2007、Qian & Lehman、Learning and Instruction 2024、Reich & Ruipérez-Valiente、Zengilowski、Prinz 2020 基準 meta、Durik 2015；Tetzlaff 與 Schroeder 是轉引本站另一份筆記（那份筆記讀過全文，寫作時引那份）；湯澤・稲垣只讀了引言前段。✅ 的各列不是逐頁讀完，讀了哪些段落逐列寫明。

---

## 事實交叉表

只放來源說了什麼。「教材 note」＝`.work/teaching-text-research/notes.md`。

### 子問題 1　先備知識的量

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 493 個研究、685 個獨立樣本、126,050 人、8,776 個效果量；受試者平均 11.32 歲（SD 6.90）；北美 45%、歐洲 33%、亞洲 12% | Simonsmeier 2022 接受稿，結果首段 | — | ✅ 單一來源的窄事實 |
| 前測知識與後測知識的相關 rP+ = .531，95% CI [.509, .552]，476 個研究、7,772 個效果量，預測區間 −.067 到 .848（摘要寫 .534，正文與 Table 2 寫 .531） | Simonsmeier 2022 接受稿 | Brod 2021 的文字轉述一致 | ✅ |
| 前測知識與標準化學習增益的相關 rNG+ = −.059，95% CI [−.150, .034]，預測區間 [−.688, .621]；只有 69 個研究、697 個效果量，**沒有一個是隨機對照實驗** | Simonsmeier 2022 接受稿 | Brod 2021：平均而言不解釋增益 | ✅ |
| 前測知識與絕對增益（後測減前測）的相關 rAG+ = −.263 [−.370, −.149]，50 個研究；作者說絕對增益比標準化增益更受高先備者的天花板效應扭曲 | Simonsmeier 2022 接受稿 | — | ✅ 單一來源 |
| 九個隨機操弄先備知識的實驗（45 個效果量）：先備知識對後測知識 rP+ = .394 [.132, .605]，作者視為因果證據；操弄時間 5 到 180 分鐘 | Simonsmeier 2022 接受稿 | — | ✅ 單一來源 |
| 沒有發現出版偏誤（Egger 迴歸六種情況都不顯著；已發表與未發表的效果量相近） | Simonsmeier 2022 接受稿 | — | ✅ 單一來源 |
| 作者 2018 年的投影片是修訂前的版本（240 篇、4,327 個效果量；增益分析只有 14 個研究），數字與刊出版不同，不採用 | PsychArchives 投影片 | Simonsmeier 2022 接受稿 | ✅ 已釐清 |
| 測了迷思概念（不正確的先備知識）的研究都沒報告與增益的相關，所以無法分析 | Brod 2021 | — | ✅ 單一來源 |
| Brod 的三個條件：先備知識要被喚起、與任務相關、與要學的內容一致，三者都成立才可靠地有幫助；被喚起但不相關或不一致時會妨礙 | Brod 2021 | （評論，非實證） | ✅ 單一來源的理論主張 |
| 高協助教材：低先備者 d = 0.505 [0.260, 0.750]，高先備者 d = −0.428 [−0.647, −0.209]；60 個研究、5,924 人 | Tetzlaff 2025（教材 note） | — | ✅ 轉引 |
| 同一篇的限制：先備與協助都被二分，各研究的「高／低」距離不同 | Tetzlaff 2025（教材 note） | — | ✅ 轉引 |
| 事前訓練（概念圖與詞彙表）對先備高的大學生也降低外在認知負荷，沒有出現預期的 expertise reversal；136 名大學生。作者自述限制：先備知識測驗太簡單，高低兩組人數不均；只測了一種事前訓練形式 | Pre-training 2025 摘要與限制 | 對照 Tetzlaff 2025 | ❌ conflict（單一研究 vs 統合分析；依變項是自評認知負荷，不是學習成績） |
| 65 名四年級學童讀高低連貫的敘事文與科學文各一：知識多的學童讀低連貫的敘事文反而理解較好（reverse cohesion effect）；知識的影響在科學文比敘事文大。作者自述樣本的標準化測驗成績略高於平均、範圍偏窄 | McNamara 等 2011 摘要、受試者、限制 | McNamara 1996 的同方向結果收在教材 note | ✅ |
| 同一篇：只加連接詞而不補解釋性資訊，不足以幫年幼讀者讀懂難的文章 | McNamara 等 2011 摘要 | — | ✅ 單一來源 |

### 子問題 2　迷思概念

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 反駁式文字對比非反駁式文字，正確信念 g = 0.37（獨立組，67 個研究 222 個效果量）、0.36（有前測的設計，49 個研究）；錯誤信念 g = −0.38（10 個研究）；預註冊；71 篇文章、76 個研究、294 個效果量；只收科學主題 | Danielson 2024 | Schroeder & Kucera 2022：g = 0.41 [0.30, 0.51]，33 個研究（教材 note） | ✅ 兩份獨立統合分析量級相近 |
| 正確信念的 95% 預測區間 −0.53 到 1.26（獨立組）、−0.41 到 1.12（有前測） | Danielson 2024 Table | — | ✅ 單一來源 |
| 26 個調節變項都沒有顯著解釋異質性；爭議性主題與否也不顯著 | Danielson 2024 | Schroeder 2022：文長、年齡、測驗時間不顯著，出版類型顯著（教材 note） | ✅ |
| 對情緒與態度的效果不顯著（正向情緒 g = .24，區間 −.33 到 .82；負向情緒 −.04；態度 .08），且只有 7 個研究 | Danielson 2024 Table | — | ✅ 單一來源 |
| 限制：幾乎沒有小學生與歐美以外的樣本；多數研究沒報告受試者特徵 | Danielson 2024 | Schroeder 2022：最長的文章 1,542 字，作者說不清楚對教科書長度是否成立（教材 note） | ✅ |
| Schroeder 2022 的 37 個比較沒分先備知識，無法檢驗 expertise reversal | 教材 note | — | ✅ 轉引 |
| 德國教師與師培生（最終樣本 N = 336），數學性別迷思，2×2（個人化回饋 × 反駁文）：前測有迷思的人從個人化反駁文獲益最多；全體來看四組沒有差異；12.5% 的人後測比前測差，反效果最強的在個人化反駁文組，而且多半是前測沒有或不確定有迷思的人；作者推測是 familiarity backfire，並說明這不在預註冊的預測裡 | Dersch 等 2026 討論 | Danielson 2024 引 Lewandowsky：backfire 罕見且小；Dersch 自己引 Ecker 2023 沒複製出 familiarity backfire | ❌ conflict，列出不選邊 |
| Zengilowski 2021 批評反駁文研究主題太少、語氣過於權威 | Dersch 2026 的轉述 | Danielson 2024 轉述：該文回顧的研究只有 14% 沒有前測 | ⚠️ unverified（原文未讀） |
| 92 名德國大學生，共變數的迷思：讀一般文字時迷思多的人理解較差；讀反駁文或填 think sheet 時這個差距消失；兩種做法效果沒有差別 | Prinz 2021 | — | ✅ 單一研究 |
| 有迷思的學習者不只理解差，還更高估自己的理解與遷移 | Prinz 2021 引言引用 Prinz 2018、2019 | （原研究未讀） | ⚠️ 轉引，同一團隊 |
| Smith 等主張：把學生的想法當成要對抗並取代的錯誤，高估了新手與專家之間的斷裂；學生的既有想法在專家推理裡也用得到，學習是修整而不是替換 | Smith, diSessa, Roschelle 1993 摘要 | — | ✅ 理論立場，非實驗結果 |

### 子問題 3　動機、興趣、信心

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 大學普通生物，四個學期，N = 1,040（一般學生 850 人；第一代且弱勢族裔只有 64 人），雙盲隨機：寫課程內容與自己的關聯。第一代且弱勢族裔學生與多數學生的成績落差在對照組是 .84 個等第（d = .98），介入效果 .51 個等第（d = 0.55），落差縮小 61%；控制高中貧困指標後三因子交互作用仍顯著（p = .03）。作者自述限制：無法分開各族裔；第一代身分是二分變項 | Harackiewicz 2016 | Hulleman & Harackiewicz 2009（只有摘要，不能引用）：高中科學課同類介入提高低預期學生的興趣與成績 | ✅ 以 Harackiewicz 2016 為準；關鍵子群只有 64 人 |
| 三個實驗室研究（心算技巧，一小時）：直接告訴受試者用途，對有信心的人提高了知覺用途，對沒信心的人降低表現與興趣；讓受試者自己寫用途則有正面效果；先給用途資訊再讓他自己舉例，負面效果消失；對沒信心的人，日常生活的例子比職涯與學業的例子好 | Canning & Harackiewicz 2015 | Asher & Harackiewicz 2025（同一實驗室，七個實驗，N = 2,019，大學生學統計）：直接告知用途 × 信心的交互作用在知覺用途（d = 0.02, p = .764）、情境興趣（0.02, p = .716）、成績（p ≥ .523）都不顯著；直接告知用途 × 興趣也都不顯著 | ❌ conflict（同一實驗室，任務不同：心算技巧 vs 統計課影片） |
| 直接告知用途（對比控制組，七個實驗合併）：知覺用途 d = 0.41；被觸發的情境興趣 d = 0.08（p = .094）；維持的情境興趣 d = 0.15（p < .001）；事後索取統計課程資料的比例 39.2% 對 33.2%（OR = 1.35, p = .042）；當場成績 d = 0.03，不顯著。給選擇：知覺自主 d = 0.92，被觸發的情境興趣 d = 0.24，維持的情境興趣 d = 0.16，分心 d = −0.15，對索取資料沒有影響（OR = 1.02），成績 d = 0.04 不顯著。唯一顯著的信心交互作用是分心（d = 0.17, p = .006） | Asher & Harackiewicz 2025 Table 5 與正文 | — | ✅ 單一來源（七個實驗的內部統合，其中五個沒有預註冊） |
| Durik & Harackiewicz 2007 摘要：研究二（145 名大學生）強調用途的操弄，對數學個人興趣高的人提高動機，對興趣低的人降低動機 | Durik 2007 摘要（Ovid） | Hecht 2022 轉述 Durik 2015：把興趣與信心的共變拿掉後，調節變項其實是信心 | ⚠️ 兩篇都沒讀到全文，不能引用 |
| Canning 2015 自述限制：三個研究用同一個心算任務、單次一小時；直接告知與自己寫發生在不同時間點，無法分辨是做法不同還是時機不同 | Canning & Harackiewicz 2015 | Asher & Harackiewicz 2025 自述限制：萌發的個人興趣只用一個二分指標（是否索取資料）；沒有行為層面的投入指標；沒探討先備知識的調節 | ✅ |
| 兩年制學院隨機實地實驗：課業吃力的學生在兩種 utility value 寫作條件下，興趣與知覺用途都比對照組低；學生口吻的範例讓表現好的學生更有興趣，卻讓吃力學生的成績比教師口吻的版本低 | Canning, Priniski, Harackiewicz 2019 摘要 | 對照 Hulleman 2009、Harackiewicz 2016 | ❌ conflict（同一研究群自己報告的反向結果） |
| 線上高年級生物課，N = 1,243（589 對 654）：utility value 寫作組的課程參與（學習管理系統紀錄）較高、作文較長，但成績與對照組沒有顯著差別；作者列的可能原因是線上、高年級、2020 年春季疫情學期。自述限制：沒有量任何心理指標（興趣、動機、自我效能） | UV 線上課 2025 | Kizilcec 2020：價值關聯寫作只在有全球落差的課有效（見子問題 4） | ✅ 兩份線上情境的結果方向一致：效果比教室小且有條件 |
| （已併入上方 Asher & Harackiewicz 2025 兩列）Hecht 2022：用途資訊對一開始就有興趣的人觸發興趣；寫用途的作文提高測驗成績，對信心低的人尤其明顯 | Hecht 2022 摘要與回顧段 | — | ✅ 單一來源 |
| 動機介入統合分析平均 d = 0.49；隨機分派的效果比準實驗小 | Lazowski & Hulleman 2016 **摘要** | — | ⚠️ 只有摘要，不能引用，不進結論 |
| SDT 介入統合分析：36 個研究；實驗或準實驗設計下自主 g = 1.14、能力 g = 0.48、內在動機 g = 0.58，關聯感 g = 0.44 不顯著；沒有搜灰色文獻；三分之一以上的研究沒報告受試者族裔 | Wang 等 2024 | Howard 2024：8,693 個相關、637 個樣本；作者自述資料是相關性的，估計值不代表因果，學生表現好也可能反過來引出教師的支持行為 | ✅（介入多數由教師、家長執行，不是教材） |
| 有趣但與主題無關的細節會妨礙學習；調節變項包括圖片類型、傳遞形式、語言、學科、學習者能否自訂步調 | Sundararajan & Adesope 2020 **摘要**（沒有數字） | 三篇引用它的論文都寫整體 g = −0.33，但對規模的說法不同：Brock 2025「58 個研究」、Wang & Cheng（ECER 摘要）「42 個研究、68 個效果量」、Wesenberg 2026「68 個效果量」 | ⚠️ 原文未讀，不能引用；數字是轉引且細節互相不一致 |
| 兩個線上實驗（Prolific 招募的成人；研究一事前估算樣本 204 人）：無關細節的份量越多，回憶成績線性下降；遷移成績在研究一沒有效果、研究二呈非線性；先備知識與工作記憶容量都沒有顯著調節；自評外在認知負荷與內在動機都沒有隨份量改變 | Wesenberg 等 2026 | 該文回顧 Magner 2014：裝飾性插圖降低低先備者的成績、提高高先備者的成績 | ❌ conflict（先備知識是否調節，兩個來源方向不同；Magner 原文未讀） |
| 兩個實驗（N = 120、210）：無關細節只在「被規定要學」的單元傷害測驗成績，在「自願學」的單元沒有影響甚至有幫助，並經由興趣間接提高成績 | Learning and Instruction 2024 **摘要**（經 Exa） | Wang & Cheng ECER 摘要：2019–2025 的 51 篇，多層次模型 g = −0.16，比先前兩份統合分析小 | ⚠️ 兩者都只有摘要，不能引用；但這是與自學讀者最相關的一條線，值得寫作前補到全文 |
| 研究一 60 名、研究二 69 名美國大學生讀兩篇科學文：主題興趣與回憶、理解題正確率正相關；放聲思考顯示興趣高的人只在較連貫的那篇（月球起源）產生較多推論，推論部分解釋了興趣與理解的關係；較不連貫的那篇（鳴禽消失）沒有這個關係 | Clinton & van den Broek 2012 | — | ✅ 單一研究，相關設計，兩篇文章同時在主題與連貫度上不同 |
| 興趣發展四階段：被觸發的情境興趣、維持的情境興趣、萌發的個人興趣、成熟的個人興趣；早期階段主要是注意力與正向感受，多半要靠外部支持 | Hidi & Renninger 2006 | Asher & Harackiewicz 2025 以此為架構 | ✅ 理論模型 |

### 子問題 4　持續與輟學

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 221 門 MOOC：完成率（完成人數÷註冊人數）0.7% 到 52.1%，中位數 12.6%；課越長完成率越低；只用自動評分的課完成率較高；第一、二週是關鍵，之後活躍人數與交作業人數趨於平穩 | Jordan 2015 | Reich 2014：以註冊者為分母的證書率通常 2% 到 10% | ✅ |
| 九門 HarvardX 課的問卷填答者（79,525 人，回覆率 27%）：打算完成的人 22% 拿到證書，打算瀏覽的人 6%；意圖分布為完成 56%、旁聽 26%、未定 15%、瀏覽 3% | Reich 2014 | Kizilcec 2020 引言：Harvard、MIT、Stanford 的 MOOC 裡有意完成者的完成率約 20% | ✅ |
| 摘要列出三個定性結論：絕大多數 MOOC 學習者第一年之後不再回來；參與的成長幾乎都集中在最富裕的國家；低完成率六年來沒有改善 | Reich & Ruipérez-Valiente 2019 **摘要**（Science 頁，經 Exa） | Inside Higher Ed 報導的具體數字（2017–18 完成率 3.13%、隔年回流 12% 等） | ⚠️ 原文未讀，不能引用；具體數字只有新聞轉述 |
| 2.5 年、約 25 萬名學生、247 門課：原本預期中到大的效果沒有出現。長期規劃提示對完成率 β = 0.19 個百分點 [−0.69, 1.07]（先前在 3 門課 2,053 人是 +3.9 個百分點）；規劃類介入提高第一週活動量，第二週減弱，最終完成率看不出差別 | Kizilcec 2020 PNAS | — | ✅ 單一來源，預註冊、樣本極大 |
| 價值關聯寫作：只在「有全球成就落差」的課，把低度開發國家學生的完成率提高 2.79 個百分點 [1.30, 4.27]（第一年）與 2.74 個百分點（第二年），作者說比先前研究小一個量級；在沒有落差的課，事後分析顯示它讓同一群人的完成率下降 1.62 個百分點 | Kizilcec 2020 PNAS | Kizilcec 2017：兩門課的小樣本（Table 1 回述其中一個研究 n = 227）顯示落差被拉平 | ❌ conflict（同一團隊的放大複製，方向在部分課程相反） |
| 機器學習方法幾乎無法預測哪門課會有全球落差，也學不出有效的個人化介入策略 | Kizilcec 2020 PNAS 摘要 | — | ✅ 單一來源 |
| 系統性回顧：2008–2021 年七個資料庫，最後只有 21 篇符合；輟學因素歸成課程屬性、社會身分、認知能力、情緒、學習行為五類；21 篇裡 20 篇是量化；第一作者以英國 6 篇最多，中國 1 篇 | Huang 等 2023 | — | ✅（只做分類，沒有效果量） |
| 清華學堂在線四門課，有效樣本 167 人（招募 190 人，問卷回收率約 1.5%）：價值肯定寫作讓第一代大學生習題得分率比對照組高 6.15 個百分點、非第一代高 5.24 個百分點；對照組裡兩群有顯著差距，介入組沒有；作者說與 Kizilcec 2017 不同的是全體都提升 | 錢靜（清華新聞網） | 對照 Kizilcec 2020 | ⚠️ 非同儕審查、樣本小、自選樣本 |
| 同文引述：中國大學 MOOC 平台截至 2019 年課程通過率 1.5% | 錢靜 | （原始出處未查） | ⚠️ unverified |
| 早稻田在 edX 開的日語發音課：11,165 人註冊，完成率 7.5%（分母是至少播過一次影片的人）；完成者多用桌機，未完成者多用行動裝置；來自與日本關係較深國家的學習者完成率較高 | 石井等 2017 | — | ✅ 單一課程 |
| 14 門課 71,475 人：打算拿證書的人較可能看完多數影片、做多數作業；學歷之間的修課動機差異比性別之間明顯。作者自述限制：資料只來自自願填問卷的人，這些人本來就較投入，行為預測可能高估 | Kizilcec & Schneider 2015 | Reich 2014 的問卷回覆率 27% 有同樣問題 | ✅ |

### 子問題 5　身分與歸屬

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 高中生讀三種版本的化學課文（文字相同，照片不同）：女生看到女科學家照片時理解成績高於看到男科學家照片；男生相反 | Good 等 2010 **摘要** | 沒找到複製研究 | ⚠️ 只有摘要，樣本數與效果量未取得，不能引用 |
| 18 歲以下女生的 stereotype threat 統合分析：972 篇篩到 26 篇、47 個效果量，平均 g = −0.22；trim-and-fill 補進 11 個效果量後 g = −0.07 [−0.21, 0.06]，不顯著；Egger 檢定顯著；只有 7 個研究的樣本超過 100；四個調節變項都不顯著。作者結論：這批文獻受出版偏誤影響 | Flore & Wicherts 2015 | Shewach 2019：全部資料 d = −.22，校正出版偏誤後大幅下降；限定在接近正式考試條件的樣本 d = −.14（45 個樣本，3,532 人）；除四個樣本外都不是高利害考試。作者結論：舉證責任回到主張效果很大的一方 | ✅ 兩份統合分析一致：效果小且有出版偏誤 |
| 荷蘭 2,064 名高中生的註冊報告：女生的數學成績沒有 stereotype threat 效果，四個理論調節變項也都沒有；Bayes factor 強烈支持虛無假設 | Flore 等 2018 | 對照 Good 2010 與早期實驗室研究 | ❌ conflict |
| 線上 STEM 課廣告放性別包容的照片與文字：女性點擊率提高 26%，男性不變（N = 209,000）；註冊頁加包容聲明與圖片：女性註冊比例最多提高 18%（N = 63,000） | Kizilcec & Saltarelli 2019 CHI | — | ✅ 單一團隊；結果是點擊與註冊，不是學習 |
| 14 門 MOOC、29,000 人：課程頁加多元聲明，低社經地位學生的比例提高 3%，各課效果在 −0.5 到 7 個百分點之間；性別、年齡、國家發展程度都沒有顯著變化。作者自述限制：沒有量心理歷程，也沒有追蹤註冊後的表現 | Kizilcec & Saltarelli 2019 L@S | — | ✅ 單一來源 |
| 兩個程式課實地實驗、53,922 人：歡迎影片換成女講師或地位較低的同儕，某些年齡層的女性持續率反而較低，男性不受影響；男女講師一起出現能留住女性 | Kizilcec 2020 CHI | 作者自述與假設相反，且處理效果異質性大 | ✅ 單一來源；與 Good 2010 的方向不同 |
| 22 所學校、26,911 名學生：入學前不到 30 分鐘的線上歸屬感介入提高一年級全時修畢率，在過去修畢率較低的群體效果較大；只有在該群體於該校「有機會歸屬」時才有效。2024 年的更正只涉及補充資料 Table S6 兩個數值對調，作者聲明不影響結論 | Walton 等 2023 與更正公告 | 對照 Kizilcec 2020：線上課的同類介入效果小一個量級 | ✅（實體大學） |
| Growth mindset 介入：63 個研究、97,672 人，d = 0.05 [0.02, 0.09]，校正出版偏誤後不顯著；最高品質的 6 個研究 d = 0.02 [−0.06, 0.10]；有財務誘因的作者報告的效果較大 | Macnamara & Burgoyne 2023（數字取自摘要，正文雙欄抽取混排沒逐項核對） | Tipton, Bryan, Murray, McDaniel, Schneider, Yeager 2023：同一批文獻改用模型化異質性的方法，兩份統合分析在預期的子群都看得到效果；並主張可規模化介入的 0.10 SD 就算大。Yeager 2019：全美代表性樣本，低成就學生 GPA 提高 0.10（標準化 0.11），效果取決於同儕規範 | ❌ conflict，兩派方法之爭，列出不選邊；評論的作者之一 Yeager 是 mindset 介入的主要研究者 |

### 子問題 6　自我診斷與前測

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 讀者分辨「哪篇讀懂了、哪篇沒懂」的準確度（判斷與實際表現的相關）：沒有介入時加權平均 0.178；502 個效果、15,889 人、115 個研究；只收純文字教材。作者自述限制：多數研究在實驗室，材料不是學生自己的課業 | Yang 等 2023 | Prinz 2020 介入 meta：對照組 r = .14 [.09, .20]；該文引言引同作者基準 meta 為 +.24（基準 meta 原文未讀） | ✅ 兩份讀過的統合分析落在 .14 到 .18 |
| 引導讀者用「情境模型線索」判斷（延遲寫摘要、延遲列關鍵詞、延遲補圖、畫概念圖、重讀、告知測驗型態）：介入組 r = .41 [.33, .48]，g = 0.46；告知測驗型態看起來最有效，自我解釋不穩定；漏斗圖顯示可能有出版偏誤 | Prinz 2020 介入 meta | Yang 2023：延遲寫摘要、延遲列關鍵詞有效，多種介入合用有加成 | ✅ |
| 讀之前先答題（prequestion）：被問到的內容 g = 0.54 [0.42, 0.66]（97 個研究）；沒被問到的內容 g = 0.04 [−0.04, 0.11]（91 個研究）；要求猜答案時 0.65，不要求時 0.22；出版與未出版研究的效果量沒有顯著差異 | St. Hilaire 等 2024 | Pan & Carpenter 2023：好處出現在配對詞、文章、影片、現場講課；典型實驗裡受試者先備很低，前測題四分之三以上答錯 | ✅ |
| 教師常把前測題當診斷工具，用來看學生先備知識有多少 | St. Hilaire 2024 引言 | Brod 2021：仍然必須在教新內容前評估先備知識 | ✅ |
| 30 個熱門線上程式教學：沒有一個依學習者的程式經驗建議從哪個階段或模組開始；14 個考慮了教育程度，但只是模糊地分初階、中階、進階；只有 Code.org、Lightbot、Scratch 標明適合年齡 | Kim & Ko 2017 | — | ✅ 單一研究，2017 年的樣本 |
| 實務指引：文件＝讀者做事需要的知識與技能，減掉讀者已有的；先定義讀者角色；注意知識的詛咒 | Google Technical Writing | MDN 寫作指南：教學文的開頭段要說明會講什麼與讀者需要的先備知識 | ✅ 兩份業界指引一致 |
| MDN 學習區自述目標是把人從「初學者」帶到「能自在使用」，不是帶到專家；完全沒寫過程式的人從 Getting started 開始 | MDN Learn | fast.ai：唯一先備是會寫程式（一年經驗夠）、最好是 Python，加上高中數學 | ✅ 實務做法：在入口寫明先備與終點 |
| Diátaxis：教程裡幾乎所有責任在教的一方；教程的第一條規則是不要試著用講解來教，而是安排讓學習者做得出結果的經驗 | Diátaxis〈Tutorials〉 | — | ✅ 單一實務來源的主張，沒有成效數據 |

---

## 我的推論（與上表分開）

| 推論 | 依據 | 這個推論可能錯在哪 |
|---|---|---|
| 對作者來說，「讀者先備知識多」不保證這次讀得比較有收穫，要看內容有沒有把它喚起、接上，以及它是不是對的 | Simonsmeier 的增益相關接近零且區間極寬；Brod 的三個條件 | 增益那一半只有 69 個研究、全是相關設計，受試者平均 11 歲，以學校課程為主；用絕對增益算是負相關，用標準化增益算是零，結論取決於怎麼定義「學到多少」；九個隨機實驗顯示先教先備知識確實提高後測，所以「補先備」仍然有用；Brod 的三條件是評論，不是檢驗過的模型 |
| 一篇文章無法同時對新手與熟手最佳，分流（先備清單、跳讀指引、可收合的補充）比「寫得更詳細」合理 | Tetzlaff 的方向相反效果；McNamara 的 reverse cohesion；Kim & Ko 發現現有教學都沒做分流 | 「高／低先備」在各研究裡是相對的；pre-training 2025 沒看到反轉；沒有任何研究直接測過「可收合補充」或「跳讀指引」在網頁長文的效果；Kim & Ko 是 2017 年的樣本 |
| 「常見誤解」段落值得寫，但要針對真的常見的誤解，不要把讀者多半沒有的錯誤想法拿出來反覆講 | Danielson 與 Schroeder 的平均效果；Dersch 2026 的反效果集中在沒有迷思的人 | Dersch 是單一研究、主題是帶價值色彩的性別迷思、讀者是教師，而且迷思在問卷與回饋裡出現了四次；Ecker 2023 沒複製出 familiarity backfire；Danielson 的調節分析沒發現爭議性主題效果較差。把它推到程式或數學概念很可能過度 |
| 反駁式寫法的平均效果在本站的長篇導讀裡會比 0.37 小 | 實驗用 1,500 字以內短文、當天或短期測驗、受試者被要求讀完 | Schroeder 的文長調節不顯著，所以「越長越小」沒有直接證據；這只是從情境差異推的 |
| 文章裡直接講用途大概是安全的小加分：會讓讀者覺得內容有用、稍微提高後續找資料的機會，但別指望它讓人當下學得更好。「會傷到沒信心的讀者」目前不足以當成寫作規則 | Asher & Harackiewicz 2025：七個實驗沒有信心的調節，成績 d = 0.03；Canning 2015 的反效果只出現在心算技巧任務；Canning 2019 的反效果出現在要學生寫作文的課堂介入，不是直接告知 | 全部出自同一個實驗室；Asher 的受試者是修心理學導論的大學生、看的是統計教學影片；心算是技能任務、統計是知識任務，Hecht 2022 就推測信心在技能任務才重要，所以對本站的程式實作文，Canning 2015 的情境可能反而比較接近；第一輪我把這條寫成「可能適得其反」，是只讀了一邊 |
| 有趣的開場故事若與主線無關，對記住內容是負的，而且放越多越糟；但對自願來讀的人，傷害可能小很多甚至沒有 | Wesenberg 2026 兩個實驗（讀過）；Learning and Instruction 2024 的摘要（沒讀全文） | 後半句只靠一篇摘要，依規則不能寫進文章；Wesenberg 的受試者是拿報酬的線上受試者，不是自願讀者；統合分析原文我沒讀到 |
| 系列文的讀者流失主要發生在最前面一兩篇，而且多數離開的人本來就沒打算讀完 | Jordan：前兩週是關鍵；Reich 2014：意圖分布與 22% 對 6%（Reich & Ruipérez-Valiente 2019 的數字沒讀到原文，不列為依據） | MOOC 有開課日與期限，本站文章隨到隨讀；本站沒有任何自己的流量或完讀數據支持這個類比；Reich 的問卷回覆率 27% |
| 在文章裡加「規劃提示」「歸屬感訊息」這類輕量心理介入，對本站讀者的持續幾乎不會有可測的效果 | Kizilcec 2020：放大後小一個量級、只撐一到兩週、而且要看情境 | Walton 2023 在實體大學仍有效；清華的小樣本報告有效；本站讀者與 MOOC 學生不是同一群人 |
| 教材層次的身分線索（例子裡是誰、照片是誰）沒有我讀過全文的實證可以引用；有實證的是入口處的線索影響「誰點進來」 | Flore 2015 與 Shewach 2019（讀過）顯示實驗室效果小且受出版偏誤影響；Flore 2018 註冊報告無效果；Kizilcec 2019 的點擊與註冊效果；Kizilcec 2020 的女講師反效果 | Good 2010 我只讀摘要，不能引用；沒找到複製不等於複製失敗，可能是我沒搜到（沒查 Curate Science 或 PsychFileDrawer）；Kizilcec 的研究量的是註冊與持續，不是讀懂多少 |
| 讀者自己覺得「讀懂了」不可靠，所以文章附的自我檢查題必須有答案或判準，而且題目要問推論而不是回憶 | 後設理解準確度 .14 到 .18（兩份讀過的統合分析）；情境模型線索介入提高到 .41；告知測驗型態最有效 | 那些介入是讓讀者自己寫摘要或關鍵詞，不是作者附題目；「附題目能提高校準」是我從 test expectancy 推的，沒有直接證據 |
| 文章開頭放幾題前測題，可以同時當先備診斷與學習輔助，但只會幫到題目問到的那幾點 | St. Hilaire：0.54 對 0.04；教師實務上拿它當診斷 | 實驗裡的前測題會被要求作答，網頁讀者可以直接跳過；沒有研究測過「讀者用前測題決定要不要先讀前置文章」這個用法 |
| 有迷思的讀者最不會發現自己沒讀懂，所以「常見誤解」加「自我檢查」應該成對出現 | Prinz 2021 與它引用的 double curse 研究 | 同一團隊、德國大學生、統計主題；double curse 的原研究我沒讀 |

**共同落差**：上面的實驗多數是大學生、短教材、當場測驗、不能中途離開；自學者讀的是長篇、分次、可以隨時關掉分頁、沒有人收作業。任何效果量都不該原封不動搬到本站，方向可以參考，量級不行。

---

## 草稿骨架

### 建議拆成五篇（第五篇可縮成短篇或併入第四篇）

**第 1 篇：讀者帶著多少先備知識來**
- 聚焦問題：同一段解說，為什麼對有些讀者太少、對有些讀者太多？作者看不到讀者，能做什麼？
- 主要結論與證據強度：
  - 先備知識多的人讀完知道得多（r = .53），但先備知識不預測這一次學到多少（標準化增益 r = −.06，區間很寬）。強度：強（493 個研究的統合分析，已讀接受稿）。但書：增益分析只有 69 個研究、沒有隨機實驗、受試者平均 11 歲；用絕對增益算是負相關（−.26）
  - 先教先備知識會提高後測成績（九個隨機實驗，r = .39）。強度：中（研究少，區間寬）
  - 高協助的教材對新手有幫助、對熟手有害，量級相當。強度：中到強（統合分析；有一篇單一研究不一致）
  - 連貫度高的文字不是對所有人都好。強度：中（多個小研究）
  - 現成的線上教學幾乎不做先備分流。強度：弱（單一內容分析，2017）
- 本站案例：`course-guide-contract.md` 要求範圍卡寫「讀者先備」、總覽寫「先備與自我檢查」、未教過的先備給橋接連結；`series-curriculum-design` 的「找斷崖」步驟。可以拿 CS50 AI 總覽與 w00 的先備段落當例子，對照 fast.ai 與 MDN 入口的寫法。
- 與另一份研究的分工：expertise reversal 在「教材怎麼寫」的那一側由文字解說那篇處理，這篇只講讀者差異與分流。

**第 2 篇：讀者已經相信錯的東西**
- 聚焦問題：「常見誤解」段落有用嗎？對誰有用？會不會把本來沒有的誤解種進去？
- 主要結論與證據強度：
  - 指出誤解並解釋為什麼錯，平均比只講正確內容好（g ≈ 0.37 到 0.41）。強度：強（兩份獨立統合分析，其一預註冊）
  - 效果的預測區間跨過零，沒有找到穩定的調節變項。強度：強
  - 對沒有該誤解的讀者，反覆提起誤解可能有害。強度：弱（單一研究，作者自己說是事後解釋，另有複製失敗）
  - 有誤解的讀者同時高估自己懂多少。強度：弱到中（同一團隊）
  - 「誤解是要拔掉的東西」與「誤解是可以修整的材料」是兩種理論立場，前者主導了反駁文研究。強度：理論爭論，不是效果量
- 本站案例：`course-guide-contract.md` 的概念導讀要求「指出常見誤解」；CS50 AI 重寫時發現原專案參考程式六週跑不起來或規則寫反（`.work/reviews/2026-10-13-cs50ai-w0*-review.md`），這是「教材自己製造錯誤先備」的實例，可以寫作者端的對應做法（獨立審稿、實際跑過）。

**第 3 篇：「這很有用」該怎麼說——動機、興趣與有趣的細節**
- 聚焦問題：文章能不能讓人更想學？講用途、給選擇、放有趣的故事，各自對誰有效？
- 主要結論與證據強度：
  - 讓學習者自己寫出用途，在學期課裡提高低預期者的成績與興趣。強度：中（多個實地實驗，同一研究群；兩年制學院與線上課的結果不一致）
  - 直接告知用途：讓人覺得內容有用（d = 0.41）、稍微提高事後找資料的比例（39% 對 33%），對當場成績沒有效果。強度：中（七個實驗的內部統合，同一實驗室，五個沒有預註冊）
  - 「直接告知用途會傷到沒信心的人」：早期三個心算實驗有，後來七個統計課實驗沒有。強度：弱且衝突，不寫成規則，可以寫成「曾經這樣認為，後來沒複製出來」
  - 給選擇提高當下的投入與自主感（d = 0.92），不影響事後行為。強度：中
  - 無關的有趣內容放越多，回憶越差；先備知識與工作記憶沒有調節。強度：中（兩個實驗，單一論文）
  - 「有趣但無關的細節平均妨礙學習（g = −0.33）」與「自願學習時不傷」：兩條都只有摘要或轉引，**寫作前要補到全文，否則不能寫**
- 本站案例：`series-curriculum-design` 的「動機先於抽象」與每篇開頭的「場景」hook；可以檢查現有導讀的開場是與主線相關的問題，還是無關的趣聞。

**第 4 篇：為什麼大多數人讀不完**
- 聚焦問題：線上自學的人什麼時候離開、為什麼；作者能改變多少？
- 主要結論與證據強度：
  - MOOC 完成率中位數約 12.6%，有意完成者約 20% 到 22%。強度：強（Jordan 2015、Reich 2014、Kizilcec 2020 都讀過正文）
  - 「完成率六年沒改善、多數人隔年不回來」：只有摘要與新聞，**不能引用數字**，補到 Reich & Ruipérez-Valiente 2019 全文前只能略過
  - 流失集中在最前面兩週；課越長完成率越低。強度：中（單一資料集）
  - 規劃提示與價值寫作放大到 25 萬人後，效果小一個量級、只維持一兩週、而且看情境，有的情境是負的。強度：強（預註冊大型實地實驗）
  - 中文與日文平台的數字方向相同但資料薄。強度：弱
- 本站案例：系列文的第一篇與總覽承擔最多流失；本站沒有裝任何分析工具（team-lead 查過 `src/`、`wrangler.jsonc` 與正式站文章頁），沒有流量或閱讀行為資料；文章要明說這一點，不能拿 MOOC 的數字當成本站讀者的寫照。
- 範圍提醒：子問題四（隨時間維持）會處理間隔與複習，這篇只處理「人為什麼走」。

**第 5 篇（短篇，或併入第 4 篇）：誰覺得這不是寫給我的**
- 聚焦問題：例子、照片、講者、歡迎詞裡的身分線索，會不會影響誰讀得下去？
- 主要結論與證據強度：
  - Stereotype threat 在實驗室有小效果（g 或 d 約 −0.22），校正出版偏誤後接近零，大型註冊報告沒有效果。強度：強（三篇都讀過正文）
  - 教材圖片影響理解（Good 2010）：只有摘要，**不能引用**；這篇若沒有它，就沒有任何教材層次的直接證據可寫
  - 入口處的包容線索提高女性點擊與註冊。強度：中（大樣本，單一團隊，結果不是學習）
  - 換成女講師反而讓部分女性持續率下降；多元聲明只改變社經組成。強度：中（結果出乎作者預期）
  - 歸屬感與 growth mindset 的短介入：效果有無仍在爭論，看情境。強度：衝突
- 本站案例：站上是文字導讀，沒有講者；可談的是例子的選擇與語言（zh-TW 與 en 兩版）。這篇的證據離本站最遠，建議寫短，並把「不知道」講清楚。

**（可選）第 6 篇：讀者不知道自己懂不懂——自我檢查與前測題**
- 如果第 1 篇太長，把子問題 6 獨立出來。聚焦問題：讀者能判斷自己懂了沒嗎？文章開頭的題目與結尾的檢查題各有什麼用？
- 主要結論與證據強度：
  - 讀者判斷自己理解程度的準確度很低（.14 到 .18）。強度：強（兩份讀過的統合分析一致；多數是實驗室研究）
  - 延遲寫摘要、列關鍵詞、知道會被怎麼考，可以提高到 .41 左右。強度：中到強（可能有出版偏誤）
  - 讀前先答題只幫到被問到的內容（0.54 對 0.04）。強度：強
- 本站案例：`course-guide-contract.md`「自我檢查需答案或判準，不只寫『想一想』」已經與這組證據方向一致，可以直接當正面例子，並檢查現有題目是回憶題還是推論題。
- 與站上 Learning How to Learn 系列的分工：那個系列講學習者自己怎麼做提取練習；這篇講作者怎麼把檢查點放進內容。

### 取捨總結（給系列規劃用）

- 證據最強、離本站做法最近的是第 2 篇與第 6 篇；第二輪後第 1 篇的主證據也到位了。
- 最容易寫過頭的是第 3 篇與第 5 篇。第 3 篇的兩條主線（用途、無關細節）各有一半的關鍵來源讀不到全文；第 5 篇唯一的教材層次研究不能引用，建議改成併入第 4 篇的一節，只寫入口線索的實地實驗與 stereotype threat 的複製情形。
- 第 4 篇的數字很硬，但全是 MOOC；要明講類比的界線。

---

## 待解問題

- Simonsmeier 2022：已讀接受稿；刊出版與接受稿是否有數字差異沒核對（摘要 .534 對正文 .531 就是一例），引用時以哪一版為準要決定。
- Zengilowski 2021 的批判具體是什麼（方法混淆、理論問題各幾項）？目前只有兩篇後續論文各一句轉述。
- 需要使用者用機構權限或館際合作才拿得到、而且會影響文章能不能寫的五篇：Sundararajan & Adesope 2020、Learning and Instruction 2024（seductive details 與外在動機）、Reich & Ruipérez-Valiente 2019、Good 等 2010、Zengilowski 等 2021。次要的四篇：Durik 2007、Durik 2015、Hulleman 2009、Lazowski 2016。
- Reich & Ruipérez-Valiente 2019 的數字目前只有新聞報導，寫第 4 篇前要讀原文。
- Good 2010 的樣本數與效果量；有沒有直接複製（要查 Curate Science、Google Scholar 的被引清單）。
- 部落格、YouTube、互動教學頁的讀者持續研究：本輪沒找到，沒掃到 L@S 2023／2024 的目錄（dblp 與 ACM DL 都被擋）。
- 中文（CNKI、華藝）與日文（CiNii、J-STAGE 站內）資料庫沒有進去搜。
- 「讀者自選難度入口」的準確度：有沒有人測過讀者依先備清單自我分流分得對不對？本輪一篇都沒找到。
- 本站自己的數據：沒有。第一輪我寫「站上有 PostHog 與 GA」是錯的，沒查就寫；team-lead 查過後確認本站沒有裝分析工具，系列各篇的進入與離開、兩個語言版本的差異都沒有資料可看。
