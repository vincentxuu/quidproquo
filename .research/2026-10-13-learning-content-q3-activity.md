# Research: 讀的人要做什麼才算在學？（子問題三，代號 q3-activity）

日期：2026-10-13
狀態：research note，未寫文章、未改 repo 內任何文章／skill／程式。原文存 `.research/raw/learning-content/q3-activity/`（81 個檔）。

toolDegradation：Groundlane MCP 不在本 session 工具清單；Groundlane 直接 HTTP 回 401；Keenable keyless 可用（要帶 `X-Keenable-Title` 標頭），本輪搜尋都走它；You.com 沒用到；全文抓取主要靠 `curl` 直抓開放 PDF、Europe PMC fullTextXML、keyless `r.jina.ai`（寫到磁碟，不經對話）、Wayback `id_` 原檔；Exa 只用來補三篇 Springer 摘要與一次搜尋。ScienceDirect、ACM DL、SAGE、HAL 對 `curl` 與 Jina 都回 Cloudflare 驗證頁；OpenAlex 連打會 429。

讀取程度的標法（比模板多分一級，避免把「檔案在手」當成「讀過」）：

- ✅ 全文在手，讀了摘要、設計、主要結果與限制段（不是逐字讀完）
- 🟡A 全文在手，但只讀了摘要與用關鍵字定位的幾段
- 🟡B 只拿到摘要
- 🔴 沒拿到，或下載了沒讀

---

## 步驟 0　選案

### 0-1 母群定義

**算**：學習者在讀／看教材之外被要求「做」的事，以及這件事有沒有實證效果、學習者實際做不做的研究。包含：練習與回饋、提取練習、自我解釋與其他生成活動、ICAP 與 active learning 的統合分析、專題式學習、鷹架與撤除、認知學徒制、productive failure、desirable difficulties；以及線上教材裡內嵌活動的行為資料（做了多少、跳過多少、先看答案的比例）。

**不算**：純粹的課堂經營（分組方式、點名加分）；學習者自己安排的讀書方法（站上 Learning How to Learn 系列）；間隔複習的排程（子問題四）；互動式解說的呈現形式（子問題二）；adjunct questions、prequestions、self-explanation prompts 的基本效果（`.work/teaching-text-research/notes.md` 已整理，本 note 只引用）。

### 0-2 掃描方法與掃到的清單

1. **OpenAlex 題名檢索**：30 組關鍵字、2017 年以後、依被引數排序、每組取前 8 筆，共 221 列，原始輸出存 `raw/.../_openalex-title-scan-2017plus.txt`。醫學、機器學習的同名雜訊人工剔除。
2. **Keenable 搜尋**：約 45 組查詢，用來找開放全文、L@S／LAK／ASEE 的行為資料論文、實務端材料，以及日文、中文、德文查詢各一到兩組。
3. **推薦鏈**：從 Sinha & Kapur 2021、Fiorella 2023、Van Campenhout 2023 的前人回顧段往回追。
4. **沿用本站既有掃描**：`2026-10-13-learning-content-series-scope.md` 的兩本 Cambridge 手冊目錄、IES 指引。

掃到並判斷與本題相關的清單（依主題；粗體是選入深讀的）：

| 主題 | 掃到的 |
|---|---|
| active learning 統合分析與批評 | **Freeman 2014**、Theobald 2020、**Martella 2023**、Kozanitis 2022（人文社科）、Shi 2019（科技輔助）、Ting 2022（亞洲學生 STEM）、Arık 2020、Lombardi 2021（定義，經 Martella 轉引）、**Deslauriers 2019** |
| ICAP | **Chi & Wylie 2014**、**Thurn 2023**、Wiggins 2017、Henderson 2019、Vosniadou 2023、Lim 2019 |
| doer effect | Koedinger 2015（文字研究已讀）、Koedinger 2016、Koedinger 2018（EDM）、Van Campenhout 2021、**Van Campenhout 2023**、Maiyuran 2019、Butler 2025（非 WEIRD 族群）、Van Campenhout 2025（AI 出題） |
| 提取練習、公開與默想作答 | Yang 2021（文字研究已讀）、Adesope 2017、**Smith 2013**、**Sundqvist 2017**、**Tauber 2018**、Sumeracki & Castillo 2022、Kubik 2020／2022、**Rivers 2021**、**Vaughn & Kornell 2019** |
| 回饋的時機與形式 | **Swart 2019**、**Fyfe 2021（ManyClasses 1）**、**Kandemir 2026**、Corral 2020、Wisniewski 2020（文字研究已讀）、Fu & Li 2020（二語） |
| 沒有自動評分時 | **Yan 2022**、Yan 2021、Sanchez 2017、**Keuning 2018**、Messer 2023 |
| 生成活動 | **Fiorella & Mayer 2016**、**Brod 2021**、**Fiorella 2023**、Bisra 2018（文字研究已讀）、Rittle-Johnson 2017、Tan 2025、**Lachner 2021**、**伊藤・垣花 2009**、**小林 2020** |
| productive failure | **Sinha & Kapur 2021**、**Loibl 2017**、**Ashman 2020**、Chowrira 2019、Weaver 2017、DeCaro 2023（遠距）、González-Cabañes 2023（Campbell protocol）、Jacobson 2019、Darabi 2018（經 Sinha 轉引） |
| desirable difficulties | Bjork & Bjork 2020、**de Bruin 2023**、Zepeda 2020、**Brunmair & Richter 2019**、Rovers 2018 |
| 專題式學習 | **Chen & Yang 2019**、**Zhang & Ma 2023**、**Wijnia 2024**、**Condliffe 2017（MDRC）**、Balemen 2018、Zhang 2024（運算思維）、Kwon 2025、漢斯出版 2023 中文述評 |
| 引導多寡 | **Kirschner, Sweller & Clark 2006**、**Alfieri 2011**、Lazonder & Harmsen 2016（未取得） |
| 鷹架與撤除 | **Belland 2017**、Kim 2017、**Doo 2020**、Cai 2022、Thomann 2025、Foster 2017、Miller-Cotto 2019 |
| 認知學徒制 | **Collins, Brown & Holum 1991**、Collins & Kapur 2022（手冊章）、Minshew 2021、Matsuo 2020 |
| 程式教學的練習形式 | Ericson 2017／2018／2022、Du 2020、Weinman 2021、Scherer 2020 |
| 內嵌活動的行為資料 | **Kovacs 2016**、**Davis 2018**、**van der Zee 2018**、**Yuen 2016**、**Edgcomb 2015**、**zyBooks 2017**、Ericson 2015、**Palazzo 2010**、Janelli & Lipnevich 2021（經 Pan & Carpenter 轉引）、Kizilcec 2020、Rice 2019 |
| 實務端 | **Wilson《Teaching Tech Together》**、**Matuschak & Nielsen 2019**、**CS50 AI 誠信政策與 check50 文件**、**The Odin Project**、Exercism、freeCodeCamp（後兩者下載未讀） |

### 0-3 覆蓋矩陣

維度的取捨標準：沿這個維度走，做內容的人會不會做出不同的決定。

| 維度 | 值 | 選入 | 缺口 |
|---|---|---|---|
| 證據類型 | 統合分析 | Freeman、Sinha & Kapur、Belland、Alfieri、Brunmair、Yan、Swart、Kandemir、Zhang & Ma、Chen & Yang、Wijnia、Doo | |
| | 多場域預先註冊實驗 | Fyfe 2021、Davis 2018、Kizilcec 2020 | |
| | 觀察性的行為記錄 | Kovacs、Van Campenhout、Yuen、Edgcomb、Palazzo | 都不是「免費網路文章」的讀者 |
| | 理論與立場文 | Chi & Wylie、Kirschner、Collins、de Bruin | |
| 結果方向 | 正向 | 多數 | |
| | 沒有效果 | Fyfe 2021、Kandemir 2026、Davis 2018、Kizilcec 2020、伊藤・垣花 2009 的錄影組 | |
| | 反向或有條件反向 | Ashman 2020、Sinha & Kapur 的低年級與通用技能、Brunmair 的單字材料、Alfieri 的無協助探索 | |
| | 方法批評 | Martella 2023、Thurn 2023 | |
| 情境 | 實驗室 | Smith、Tauber、Vaughn & Kornell、Sundqvist | |
| | 有老師的課堂 | Freeman、Deslauriers、Sinha & Kapur 多數、PjBL 全部 | |
| | 有學分的線上教材 | Van Campenhout、zyBooks 三篇、Palazzo | |
| | 沒有學分的自學（MOOC、公開文章） | Kovacs、Davis、van der Zee、Matuschak & Nielsen | **只有四個，且沒有一個是部落格文章** |
| 活動需不需要別人 | 一個人可做 | 提取、自我解釋、畫圖、解題、專案 | |
| | 需要老師或同伴 | ICAP 的 interactive、PF 的「接著學生解法講」、認知學徒制的 coaching、PjBL 的小組 | 這一列沒有「一個人做」的對照研究 |
| 語言／地區 | 英語圈 | 多數 | |
| | 非英語 | 伊藤・垣花 2009、小林 2020（日文）；Zhang & Ma 2023、Yan 2022 的作者在中國與香港但以英文發表；Doo 2020 作者在韓國 | 中文、德文只做了搜尋，沒有找到可用的一手研究 |
| 立場 | 支持少引導 | Kapur、Chi | |
| | 支持多引導 | Kirschner、Sweller、Ashman | |
| 利益關係 | 無 | 多數 | |
| | 作者是產品方 | Van Campenhout（VitalSource）、Yuen／Edgcomb／Vahid（zyBooks）、Matuschak & Nielsen（自己的作品） | 行為資料幾乎都來自產品方，獨立資料只有 Kovacs、Davis、Palazzo |

### 0-4 偏誤

- **語言**：選入的一手研究除兩篇日文外都是英文。日文在 J-STAGE 找到《教育心理学研究》兩篇並讀了摘要與部分正文。中文用繁體與簡體各搜了兩組（提取練習／測驗效應的後設分析、生產性失敗的教學實驗、項目式學習的元分析），回來的是推廣文、翻譯講義與敘述性述評（漢斯出版 2023 年一篇、sciscanpub 一篇），沒有找到可核對數字的中文一手研究；CNKI、華藝沒有進去查。德文搜了一組（Lernen durch Lehren 的統合分析），回來的是 Zenodo 上的自述文件，沒有採用。
- **情境**：受試者以大學生為主。課堂研究有老師、有同學、有成績；行為資料多半來自有學分的課。直接量「沒有任何外部誘因的讀者會不會做內嵌練習」的研究，本輪只找到 MOOC 的三篇，沒有找到公開文章或部落格的資料。
- **來源**：內嵌練習的完成率資料六篇裡有四篇出自販售該教材的公司，數字可能偏樂觀。
- **年代**：統合分析取 2017 年以後為主，較早的只留被反覆引用的（Kirschner 2006、Alfieri 2011、Freeman 2014、Collins 1991）。
- **我沒讀完的**：🟡A 有 35 個，見盤點表。結論只用讀到的段落；沒讀到調節變項表的統合分析，本 note 只引整體效果與摘要寫明的調節結果。

---

## 步驟 1　細子問題

1. **「主動比被動好」這個說法有多少證據？** Freeman 2014 之後的批評是什麼；ICAP 的排序被驗證到什麼程度；doer effect 是因果還是相關。
2. **內嵌的練習與提取要怎麼設計？** 寫下來與在腦中想有沒有差；答案要不要立刻給；回饋給到多細；沒有自動評分時怎麼辦。
3. **讀者實際會不會做？** 內嵌練習的嘗試率、跳過率、先看答案的比例；什麼設計讓比例變高或變低；讀者自己的感受與實際學習是否一致。
4. **先讓人卡關再講解（productive failure、desirable difficulties）在一個人讀的時候還成不成立？** 效果、邊界條件、反向結果。
5. **專題、鷹架、認知學徒制能不能放進一篇文章或一個系列？** 專題式學習的證據；沒有引導的探索的證據；鷹架要不要撤；一個人做專案時缺的是什麼。
6. **生成活動（自我解釋、教別人、畫圖）一個人做有沒有用？** 尤其是「講給想像中的對象聽」。

---

## 來源清單

訪問日皆為 2026-10-13。

### A 主動學習、ICAP、doer effect

- [Freeman et al. 2014, PNAS 111(23):8410–8415](https://pmc.ncbi.nlm.nih.gov/articles/PMC4060654/) — 一手統合分析；全文
- [Martella et al. 2023, Educational Psychology Review（doi 10.1007/s10648-023-09826-1）](https://link.springer.com/article/10.1007/s10648-023-09826-1) — 一手方法回顧；全文
- [Deslauriers et al. 2019, PNAS 116(39):19251–19257](https://pmc.ncbi.nlm.nih.gov/articles/PMC6765278/) — 一手實驗；全文
- [Chi & Wylie 2014, Educational Psychologist 49(4):219–243](https://education.asu.edu/sites/g/files/litvpz656/files/lcl/chiwylie2014icap_2.pdf) — 一手理論文；全文在手、讀部分
- [Thurn et al. 2023, npj Science of Learning 8:49](https://doi.org/10.1038/s41539-023-00197-4) — 一手評論；全文在手、讀部分
- [Van Campenhout et al. 2023, LAK23](https://doi.org/10.1145/3576050.3576103)（Wayback 原檔）— 一手觀察研究，作者任職 VitalSource；全文
- Koedinger et al. 2015（L@S）— 引自 `.work/teaching-text-research/notes.md`，未重讀

### B 練習、提取、回饋

- [Smith, Roediger & Karpicke 2013, JEP:LMC 39(6):1712–1725](https://learninglab.psych.purdue.edu/downloads/2013/2013_Smith_Roediger_Karpicke_JEPLMC.pdf) — 一手實驗；全文在手、讀部分
- [Sundqvist, Mäntylä & Jönsson 2017, Frontiers in Psychology 8:1018](https://doi.org/10.3389/fpsyg.2017.01018) — 一手實驗；全文在手、讀摘要
- [Tauber et al. 2018, JARMAC 7(1):106–115](https://www.sciencedirect.com/science/article/abs/pii/S2211368116301292) — 一手實驗；摘要與出版商頁的摘錄
- [Fyfe et al. 2021, AMPPS 4(3)（ManyClasses 1）](https://doi.org/10.1177/25152459211027575)（Wayback）— 一手預先註冊多班實驗；全文在手、讀部分
- [Kandemir et al. 2026, Educational Psychology Review 38:13](https://link.springer.com/article/10.1007/s10648-026-10117-8) — 一手統合分析；摘要
- [Swart, Nielen & Sikkema-de Jong 2019, Educational Research Review 28:100296](https://www.sciencedirect.com/science/article/pii/S1747938X1930154X) — 一手統合分析；摘要
- [Yan et al. 2022, Educational Research Review 37:100484](https://lirias.kuleuven.be/retrieve/c559d267-5b4c-4541-9a6c-fe5c223c7c18) — 一手統合分析；全文在手、讀摘要
- [Keuning, Jeuring & Heeren 2018, ACM TOCE 19(1)](http://hkeuning.nl/SLRAutomatedFeedbackGeneration-preprint.pdf) — 一手系統性回顧；全文在手、讀摘要
- Yang 2021、Wisniewski 2020、Sana 2020、Pan & Carpenter 2023 — 引自文字研究的 notes，未重讀

### C 讀者實際做不做

- [Kovacs 2016, L@S](http://hci.stanford.edu/publications/2016/invideo/invideo-las2016.pdf) — 一手記錄分析；全文
- [Davis, Kizilcec, Hauff & Houben 2018, Journal of Learning Analytics 5(3):21–41](https://files.eric.ed.gov/fulltext/EJ1199897.pdf) — 一手預先註冊實驗；全文
- [van der Zee et al. 2018, LAK18](https://doi.org/10.1145/3170358.3170382)（Wayback 原檔）— 一手；全文在手、讀部分
- [Yuen, Edgcomb & Vahid 2016, ASEE](https://peer.asee.org/will-students-earnestly-attempt-learning-questions-if-answers-are-viewable.pdf) — 一手記錄分析，作者任職 zyBooks；全文在手、讀部分
- [Edgcomb & Vahid 2015, 加分多少才夠](https://zybooks.com/wp-content/uploads/2016/06/How-Many-Points-Should-Be-Awarded-for-Interactive-Textbook-Reading-Assignments_.pdf) — 同上；讀摘要
- [zyBooks 2017 使用行為](https://zybooks.com/wp-content/uploads/2024/05/Student-Usage-and-Behavioral-Patterns-with-Online-Interactive-Textbook-Materials.pdf) — 同上；讀摘要
- [Palazzo et al. 2010, Phys. Rev. ST Phys. Educ. Res. 6:010104](https://journals.aps.org/prper/pdf/10.1103/PhysRevSTPER.6.010104) — 一手記錄分析；讀摘要
- [Vaughn & Kornell 2019, Cognitive Research: Principles and Implications 4:35](https://doi.org/10.1186/s41235-019-0187-y) — 一手實驗；讀摘要與 Significance
- [Rivers 2021, Educational Psychology Review 33:823–862](https://link.springer.com/article/10.1007/s10648-020-09578-2) — 回顧；摘要
- [Matuschak & Nielsen 2019〈How can we develop transformative tools for thought?〉](https://numinous.productions/ttft/) — 一手作者自述；讀相關段
- [Kizilcec et al. 2020, PNAS 117(26):14900–14905](https://pmc.ncbi.nlm.nih.gov/articles/PMC7334459/) — 一手；讀摘要

### D 先失敗、有益的困難

- [Sinha & Kapur 2021, Review of Educational Research 91(5):761–798](https://janfasen.nl/wp-content/uploads/2023/05/Sinha-and-Kapur-PS-I.pdf) — 一手統合分析；全文
- [Loibl, Roll & Rummel 2017, Educational Psychology Review 29:693–715](https://wright.edu/sites/www.wright.edu/files/uploads/2017/Mar/event/Loibl2016_TheoryProblemSolvingandInstruction.pdf) — 回顧；讀摘要
- [Ashman, Kalyuga & Sweller 2020, Educational Psychology Review 32:229–247](https://link.springer.com/article/10.1007/s10648-019-09500-5) — 一手實驗；摘要
- [Brunmair & Richter 2019, Psychological Bulletin 145(11)](https://psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf) — 一手統合分析（作者稿）；讀摘要
- [de Bruin et al. 2023, Educational Psychology Review 35:19](https://link.springer.com/article/10.1007/s10648-023-09766-w) — 理論；讀摘要
- [Chowrira et al. 2019, npj Science of Learning 4:1](https://www.nature.com/articles/s41539-019-0040-6) — 一手；讀部分（課堂分組研究，與自學無直接關係，結論未用）

### E 專題、引導、鷹架、學徒制

- [Chen & Yang 2019, Educational Research Review 26:71–81](https://www.sciencedirect.com/science/article/pii/S1747938X19300211) — 一手統合分析；摘要
- [Zhang & Ma 2023, Frontiers in Psychology 14:1202728](https://pmc.ncbi.nlm.nih.gov/articles/PMC10411581/) — 一手統合分析；讀摘要與主要效果
- [Wijnia et al. 2024, Educational Psychology Review 36:29](https://link.springer.com/article/10.1007/s10648-024-09864-3) — 一手統合分析；讀摘要
- [Condliffe et al. 2017, MDRC 文獻回顧](https://files.eric.ed.gov/fulltext/ED578933.pdf) — 高品質二手；讀前言與結論段
- [Alfieri et al. 2011, Journal of Educational Psychology 103(1):1–18](https://lexiconic.net/pedagogy/edu-103-1-1.pdf) — 一手統合分析；讀摘要
- [Kirschner, Sweller & Clark 2006, Educational Psychologist 41(2):75–86](https://itgs.ict.usc.edu/papers/Constructivism_KirschnerEtAl_EP_06.pdf) — 立場文；讀摘要
- [Belland et al. 2017, Review of Educational Research 87(2):309–344](https://pmc.ncbi.nlm.nih.gov/articles/PMC5347356/) — 一手統合分析；讀摘要與鷹架變化的編碼段
- [Doo, Bonk & Heo 2020, IRRODL 21(3)](https://www.irrodl.org/index.php/irrodl/article/view/4638) — 一手統合分析；讀摘要
- [Collins, Brown & Holum 1991, American Educator](https://www.aft.org/ae/winter1991/collins_brown_holum) — 一手理論文；讀部分

### F 生成活動

- [Fiorella & Mayer 2016, Educational Psychology Review 28:717–741](https://doi.org/10.1007/s10648-015-9348-9) — 回顧；讀摘要與邊界條件段
- [Brod 2021, Educational Psychology Review 33:1295–1318](https://link.springer.com/article/10.1007/s10648-020-09571-9) — 回顧；讀摘要
- [Fiorella 2023, Educational Psychology Review 35:50](https://link.springer.com/article/10.1007/s10648-023-09769-7) — 理論；讀摘要與導言
- [Lachner et al. 2021, Educational Psychology Review（doi 10.1007/s10648-021-09643-4）](https://doi.org/10.1007/s10648-021-09643-4) — 回顧；全文在手、讀摘要與三段
- [伊藤貴昭・垣花真一郎 2009，教育心理学研究 57:86–98](https://www.jstage.jst.go.jp/article/jjep/57/1/57_1_86/_pdf) — 一手實驗；讀摘要與導言
- [小林敬一 2020，教育心理学研究 68:401–414](https://www.jstage.jst.go.jp/article/jjep/68/4/68_401/_pdf) — 回顧；讀摘要與導言
- Bisra 2018 — 引自文字研究的 notes

### G 實務端

- [Wilson《Teaching Tech Together》](https://teachtogether.tech/en/index.html) — 實務作者；讀形成性評量、Parsons Problems、faded examples 三段
- [CS50 AI Academic Honesty](https://cs50.harvard.edu/ai/honesty/) — 官方；全頁
- [check50 文件首頁](https://cs50.readthedocs.io/projects/check50/en/latest/) — 官方；全頁
- [The Odin Project〈How This Course Will Work〉](https://www.theodinproject.com/lessons/foundations-how-this-course-will-work) — 官方；讀相關段

---

## 讀取完整度盤點

| 來源 | 程度 | 讀了什麼／阻礙 |
|---|---|---|
| Freeman 2014 | ✅ | 摘要、結果、Table 1、討論前半。SI 沒讀 |
| Martella 2023 | ✅ | 結果末段、討論、六項限制、結論。編碼方法段沒讀 |
| Deslauriers 2019 | ✅ | 設計、Table 2–3 的迴歸結果、訪談段 |
| Van Campenhout 2023 | ✅ | 摘要、因果模型的邏輯、限制、結論 |
| Davis 2018 | ✅ | 摘要、qCard 設計、遵從率、過程指標 |
| Sinha & Kapur 2021 | ✅ | 摘要、前人回顧、PF 準則編碼與各準則佔比、Table 2 範例、限制首段。調節變項結果表沒讀 |
| Kovacs 2016 | ✅ | 摘要、發現清單、略過行為段 |
| Chi & Wylie 2014 | 🟡A | 摘要、定義、covert 處理的但書數段。成對比較表只看到一張。**我沒讀完** |
| Thurn 2023 | 🟡A | 摘要與導言。論證主體**我沒讀完** |
| Fyfe 2021 | 🟡A | 摘要、敘述統計段。**我沒讀完** |
| Smith 2013 | 🟡A | 摘要、實驗 4 結果。實驗 1–3 **我沒讀** |
| Sundqvist 2017 | 🟡A | 摘要與文獻回顧一段 |
| van der Zee 2018 | 🟡A | 摘要、研究 1 敘述統計首段 |
| Yuen 2016、Edgcomb 2015、zyBooks 2017 | 🟡A | 各讀摘要；Yuen 多讀兩段 |
| Palazzo 2010 | 🟡A | 摘要 |
| Vaughn & Kornell 2019 | 🟡A | 摘要與 Significance |
| Matuschak & Nielsen 2019 | 🟡A | 「early impact」數段 |
| Kizilcec 2020 | 🟡A | 摘要 |
| Loibl 2017、Brunmair 2019、de Bruin 2023、Chowrira 2019 | 🟡A | 摘要（Chowrira 多讀設計段） |
| Zhang & Ma 2023、Wijnia 2024、Alfieri 2011、Kirschner 2006、Doo 2020 | 🟡A | 摘要（Zhang & Ma 加主要效果段） |
| Condliffe 2017 | 🟡A | 前言、摘要性結論段 |
| Belland 2017 | 🟡A | 摘要、研究問題、鷹架變化的編碼說明。結果表**我沒讀** |
| Collins 1991 | 🟡A | 傳統學徒制四要素、reciprocal teaching 一段 |
| Fiorella & Mayer 2016、Brod 2021、Fiorella 2023 | 🟡A | 摘要與邊界條件數段 |
| Yan 2022、Keuning 2018 | 🟡A | 摘要 |
| 伊藤・垣花 2009、小林 2020 | 🟡A | 摘要與導言 |
| Lachner 2021 | 🟡A | 摘要，以及用關鍵字定位到的口頭對書面、未複製研究的三段。模型與邊界條件的主體**我沒讀完** |
| Wilson TTT、Odin Project | 🟡A | 指定段落 |
| CS50 AI honesty、check50 | ✅ | 短頁，全讀 |
| Swart 2019 | 🟡B（第二輪仍未取得） | 第一輪：ScienceDirect 對 curl／Jina 回 Cloudflare；Leiden 典藏回 Access Blocked；Exa 只回摘要與參考文獻；Wayback 無存檔。第二輪：Unpaywall 列為 hybrid OA，兩個位置（ScienceDirect `/pdf` 與 Leiden handle 1887/82748）用瀏覽器與純 curl 兩種 UA 都是 403 或 Access Blocked；`/pdfft` 下載端點 403；Exa（MCP 與公開端點，maxCharacters 40 萬）對 ScienceDirect 文章頁、`/pdf`、Leiden 的 view／download 都只回摘要加參考文獻或抓取錯誤；Europe PMC 無收錄；Wayback 對 ScienceDirect PDF 與 Leiden 檔案皆無存檔；Keenable 找作者網頁、學位論文章節、ResearchGate 無結果。Tavily、Firecrawl 沒試。手上只有 `swart2019_sd.exa.txt`（16,674 字元，摘要與參考文獻） |
| Kandemir 2026 | 📥 全文在手、未讀（摘要讀過） | 第二輪：HAL 的 Anubis 只擋瀏覽器 UA，改用純 curl 直接下載作者稿成功。`kandemir2026_hal.pdf`／`.txt`（146,525 字元）。Unpaywall 標 closed；Springer 版仍是付費牆 |
| Ashman 2020 | 🟡B（第二輪仍未取得） | Unpaywall 標 closed；Springer `content/pdf` 被導回付費頁（Exa 回 CRAWL_REDIRECT）；Exa 公開端點對文章頁只回摘要與參考文獻（`ashman2020_springer.exa.txt`，12,319 字元）；Semantic Scholar 無開放 PDF；Wayback 無存檔；Keenable 找 UNSWorks、ResearchGate、作者部落格無全文，只有第三方摘要文（laurenmarg.com，未採用）。CORE keyless API 回非 JSON，沒查成 |
| Rivers 2021 | 📥 全文在手、未讀（摘要讀過） | 第二輪：作者個人網站 michellelrivers.com 的出版清單連到她自己的 Google Drive，下載成功。`rivers2021.pdf`／`.txt`（155,284 字元）。第一輪的 Springer 抓取只有參考文獻，改名為 `rivers2021_springer_refs_only.md` |
| Tauber 2018 | 📥 全文在手、未讀（摘要讀過） | 第二輪：正確 DOI 是 10.1016/j.jarmac.2016.10.004（第一輪我猜錯）。WashU 記憶實驗室的作者版 PDF 對 curl 回 404，但 Exa 有快取，經 Exa 公開端點取得全文文字。`tauber2018.exa.txt`（54,206 字元，含方法與參考文獻）。沒有 PDF 原檔 |
| Chen & Yang 2019 | 🟡B（第二輪多了各節首段） | Unpaywall 標 closed；Exa 公開端點取得 ScienceDirect 的 Highlights、摘要與 section snippets（`chen_yang2019_sd.exa.txt`，18,895 字元，其中正文只有各節首段）；LearnTechLib 抓取錯誤；Wayback 無存檔；Keenable 找作者頁與 ResearchGate 無全文。Highlights 寫「西方學生的效果大於東亞學生」，與 Zhang & Ma 2023 的地區結果方向不同，精讀時要處理，本輪不改結論 |
| Koedinger 2016（doer effect 因果）| 📥 全文在手、未讀 | 第二輪：Wayback 這次查到 ACM PDF 的存檔（2024-04-11），用 `id_` 原檔下載成功。`koedinger2016.pdf`／`.txt`（43,607 字元） |
| Ericson, Guzdial & Morrison 2015（ICER，Runestone 電子書使用分析）| 🔴（第二輪仍未取得） | Unpaywall 與 Semantic Scholar 皆標 closed；ACM 頁與 PDF 經 Exa 兩次 CRAWL_LIVECRAWL_TIMEOUT；Wayback 無存檔；Keenable 找 Georgia Tech、ResearchGate 無全文。q2-interactive 目錄裡的同名檔只有 555 bytes。替代：同一團隊同年的 WiPSCE 論文〈Usability and Usage of Interactive Features in an Online Ebook for CS Teachers〉（doi 10.1145/2818314.2818335）經 Wayback 取得全文，`ericson2015wipsce.pdf`／`.txt`（52,534 字元，未讀）；Guzdial 的部落格預告文存為 `guzdial_blog_icer2015.md`（二手，未讀） |
| Ericson 2022（Parsons 回顧）| 📥 全文在手、未讀 | 檔案在別的子問題目錄：`.research/raw/learning-content/q2-interactive/ericson2022-parsons-slr.pdf`／`.txt`（265,346 字元），沒有複製 |
| Scherer 2020、Thomann 2025 | 🔴（第二輪仍未取得） | Unpaywall 都標 hybrid OA。Scherer：ScienceDirect 擋，Wayback 的 HTML 存檔只有外殼，挪威典藏（nva.sikt.no）是 JS 頁、抓不到檔案連結，Exa 只回 2,798 字元。Thomann：ScienceDirect 擋，哥廷根典藏 403，Exa 只回 2,946 字元。兩篇都不在 order 8、10、11 的清單裡 |
| Janelli & Lipnevich 2021 | 📥 全文在手、未讀 | 第二輪：正確 DOI 是 10.1016/j.compedu.2020.104076。共同作者 Lipnevich 個人網站的 PDF 下載成功。`janelli2021.pdf`／`.txt`（69,664 字元） |
| Lazonder & Harmsen 2016 | 📥 全文在手、未讀 | 第二輪：Unpaywall 指到格羅寧根大學典藏的出版社版 PDF；curl 與 Jina 被 Cloudflare 擋，經 Exa 公開端點取得全文文字。`lazonder2016.exa.txt`（123,727 字元）。沒有 PDF 原檔 |
| Sumeracki & Castillo 2022 | 🔴（第二輪仍未取得） | 正確 DOI 是 10.1037/tps0000332。Unpaywall 標 closed；Ovid 頁經 Exa 只回 1,738 字元；沒找到作者自存版 |
| Theobald 2020、Kozanitis 2022、Van Campenhout 2021／2023（CEUR 兩篇）、Exercism、freeCodeCamp | 🔴 | 已下載，**我沒讀**，結論未用 |

合計（第二輪後）：✅ 9、🟡A 35、🟡B 3（Swart、Ashman、Chen & Yang）、📥 全文在手未讀 7（Kandemir、Rivers、Tauber、Koedinger 2016、Janelli、Lazonder、Ericson 2022）、🔴 10。第一輪為 ✅ 9、🟡A 35、🟡B 6、🔴 14。更正與撤稿：用 OpenAlex `is_retracted` 查了 Freeman、Theobald、Martella、Chi & Wylie、Thurn、Deslauriers、Koedinger 2016、Swart、Fyfe、Smith、Yan、Keuning、Brod、Fiorella & Mayer、Sinha & Kapur、Loibl、Ashman、de Bruin、Belland、Kirschner、Alfieri、Kizilcec、Brunmair、Wijnia、Chen & Yang、Rivers 共 26 篇，皆為 false；其餘沒查。

### 第二輪取全文（2026-10-14）

只取檔與更新上表，沒有改事實交叉表、推論表與草稿骨架。新檔一律放在原本的 `.research/raw/learning-content/q3-activity/`（任務書寫的是 `q3/`，為了不把同一子問題拆成兩個目錄，沿用原目錄）。

這一輪管用的三條路，第一輪沒試到：

- **HAL 的 Anubis 只擋瀏覽器 UA。** 不帶 `-A` 的純 curl 直接拿到 PDF。
- **Exa 的公開 MCP 端點（`https://mcp.exa.ai/mcp`）可以用 curl 呼叫**，回傳直接寫到磁碟、不經對話，`maxCharacters` 設 40 萬。Exa 有快取的 PDF（WashU、格羅寧根）即使原站 404 或 Cloudflare 也拿得到。對 ScienceDirect、Springer 付費頁只回摘要。
- **Wayback 的可用性 API 不穩定**：同一個網址第一輪回空、第二輪回到存檔。查不到要隔一段時間再查。

第二輪另外取得、第一輪沒掃到或沒下載的（都未讀，供選讀用）：

| 檔案 | 來源 | 長度 |
|---|---|---|
| `lombardi2021.pdf`／`.txt` | Lombardi, Shipley 等 2021〈The Curious Construct of Active Learning〉, Psychological Science in the Public Interest 22(1)（作者所屬單位網站） | 194,497 字元 |
| `motivated_doer_nsfpar.pdf`／`.txt` | Lekshmi-Narayanan, Asher, Brusilovsky & Carvalho 2025〈Can Motivated Students Do More Activities?〉, CSEDM'25 workshop（NSF PAR） | 31,808 字元 |
| `decaro2023.pdf`／`.txt` | DeCaro 等 2023〈Bringing exploratory learning online〉, Frontiers in Education 8:1215975 | 40,488 字元 |
| `covert_demand2025.md` | 〈Does Retrieval Demand Moderate the Effectiveness of Covert Retrieval Practice?〉, Educational Psychology Review 2025（屬 order 9 的題目） | 91,021 位元組 |

沒拿到的：Kalyuga & Singh 系列的〈Exploring factors influencing the effectiveness of explicit instruction first and problem-solving first approaches〉（Springer `content/pdf` 只回參考文獻，已刪）。

另：`notes.andymatuschak.org` 上一封 2021 年的 Patreon 信有 Quantum Country 的隨機分派資料，頁首標明「Private copy; not to be shared publicly」，已刪除下載檔、不引用。

---

## 事實交叉表

只放來源說了什麼。「—」表示只有單一來源。

### 1 主動比被動好？

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 大學 STEM 課堂，有某種主動學習的班對傳統講述的班：考試與概念測驗 +0.47 SD（158 個研究）；不及格的勝算比 1.95（67 個研究），平均不及格率 21.8% 對 33.8% | Freeman 2014 摘要與結果 | Deslauriers 2019 單一實驗得到同量級（見下） | ✅ |
| Freeman 比較的是「課堂時段」的設計，不含作業與實驗課；主動學習的做法「varied widely in intensity and implementation」，從偶爾分組解題到整門 studio 課 | Freeman 2014 | Martella 2023：主動學習沒有統一定義，「other than the reduction or elimination of lecture」 | ✅ |
| 158 個考試成績研究裡，隨機分派或交叉設計的只有 16 個（g=0.514）；其餘是準隨機。四類設計的效果量無顯著差異（Q=2.097, df=3, p=.553） | Freeman 2014 Table 1 | — | ✅ 單一一手 |
| 回頭檢查 Freeman 收錄的文章與 2015–2022 抽樣文章共 260 篇：100% 至少有一項內在效度控制沒做到；62.7% 只做到一半以下；約半數拿不同年度的班相比，對照組幾乎都是前一年 | Martella 2023 | — | ✅ 單一一手 |
| Martella 的結論：現有文獻答不出哪種主動學習有效、講述的品質有沒有影響、劑量多少；建議改研究自我解釋、提取練習這類具體策略 | Martella 2023 結論 | — | ✅ |
| Freeman「效果不受方法嚴謹度影響」對 Martella「沒有一篇控制齊全」 | Freeman 2014 | Martella 2023 | ❌ conflict（兩者量的不是同一件事：Freeman 比的是設計類別之間的效果量，Martella 數的是每篇缺幾項控制。不選邊） |
| 哈佛入門物理，隨機分派、同教材、交叉設計，149 人有期中成績：主動教學組測驗高 0.46 SD，自評「學到很多」低 0.56 SD；主動組仍有約五成時間是老師的短講 | Deslauriers 2019 | de Bruin 2023 摘要：學習者因費力與自覺學得少而抗拒有益的困難 | ✅ |
| ICAP 假說：投入模式由外顯行為區分，學習效果 Interactive > Constructive > Active > Passive | Chi & Wylie 2014 | Thurn 2023 的轉述一致 | ✅ |
| Chi & Wylie 自己承認：學生可能表面被動、心裡在做深層處理；外顯行為與內在歷程可能不一致 | Chi & Wylie 2014 | Thurn 2023 以此為批評核心 | ✅ |
| Thurn 等的批評：外顯行為不能可靠指示學習歷程；四種模式沒有放諸四海皆準的排序，「較低」的模式用對人、對時機時會勝出；不應建議實務工作者靠 ICAP 選介入 | Thurn 2023 摘要 | — | ✅ 單一一手（評論文） |
| 一門心理學 MOOC（期末考者 939 人）：做活動的標準化係數約為看影片或讀頁面的六倍；作者自述是相關性資料 | Koedinger 2015（引自文字研究 notes） | Van Campenhout 2023 轉述：五門課的中位數為 6 | ✅ |
| 七門課、18,546 名學生、1,520 萬筆事件：做練習的係數一律為正且顯著、一律大於閱讀；控制「單元外的練習量」後，單元內練習仍顯著，該模型得到的做／讀比為 3.5 | Van Campenhout 2023 | — | ✅ 單一一手，作者任職教材公司 |
| 同文的限制：七門課來自同一所線上、能力本位的學校；迴歸模型「does not prove causality」；需要因果發現演算法或真正的實驗 | Van Campenhout 2023 §4.3 | — | ✅ |

### 2 內嵌練習怎麼設計

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 課堂測驗的統合分析：整體 g=0.499；有訂正回饋 0.537，無回饋 0.374；對照組若做其他精緻化策略，g=0.095 | Yang 2021（引自文字研究 notes） | — | ✅ 轉引本站另一份研究 |
| 單字表與配對詞：在腦中想答案（covert）與寫出來（overt）的測驗效果相等；實驗 4 covert 還略高 | Smith 2013（四個實驗，大學生） | Sundqvist 2017 實驗 1–2 無差異 | ✅ |
| 教科書的關鍵詞定義：寫出來優於在腦中想，累積統合 d=0.43；兩天後測；作者建議學複雜材料時用 overt | Tauber 2018 摘要 | Sundqvist 2017 實驗 3–4：overt 略優，效果小 | ⚠️ Tauber 只到摘要 |
| 「covert 與 overt 一樣好」對「overt 較好」 | Smith 2013 | Tauber 2018 | ❌ conflict（材料不同：單字表對定義。Tauber 的解釋是 covert 時對熟悉的詞不會把答案想完） |
| 回饋時機，電腦輔助學習，51 個研究、160 個效果：立即對延遲 g=0.03，95% CI [−0.08, 0.13]；異質性大；延遲一天以上的研究很少 | Kandemir 2026 摘要 | Fyfe 2021：38 個大學班級，立即對延遲數日（平均 2.58 天），效果 0.002，95% HDI [−0.05, 0.05]；40 個預先註冊的調節變項都不顯著 | ✅（Kandemir 只到摘要） |
| 讀文本的回饋，104 個對比、6,124 人：有回饋對沒回饋 g=0.35；讀完後給比閱讀中給有效；讀完後給的情況下，詳細解說與給正確答案都優於只告知對錯；閱讀中給則各類型無差 | Swart 2019 摘要 | Wisniewski 2020（引自文字研究）：高資訊量回饋 d=0.99，只給強化或懲罰 0.24 | ⚠️ Swart 只到摘要 |
| 先測再讀時，測完立刻給正確答案的組，後測 .58，不給的 .66 | Sana 2020 實驗 3（引自文字研究 notes） | — | ✅ 轉引；單一實驗、單一主題 |
| 自我評量介入對學業表現 g=0.585，同儕評量 0.606（175 個研究、626 個效果）；重複量數設計的效果量大於實驗／準實驗設計 | Yan 2022 摘要 | — | ✅ 單一一手 |
| 101 個程式練習的自動回饋工具：回饋多半在指出錯誤，較少告訴學生怎麼修、下一步做什麼；教師不易調整工具 | Keuning 2018 摘要 | — | ✅ 單一一手 |
| 實務端的題型建議：診斷用的選擇題（每個誘答對應一個迷思）、Parsons Problems（排程式碼順序）、faded examples（逐步挖空的例題） | Wilson TTT | Collins 1991 的 scaffolding 與 fading | ✅ |

### 3 讀者實際做不做

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| Coursera 機器學習課：開始看一支影片的人有 74% 會作答影片內的小考；76% 第一次就答對；使用者不太會快轉跳過小考；有小考的影片中途離開率較低 | Kovacs 2016 | — | ✅ 單一一手 |
| edX 一門 MOOC，預先註冊：523 人被分到會跳出舊題目的提取練習提示，只有 102 人至少互動過一次；對成績與投入都沒有效果 | Davis 2018 | Kizilcec 2020：25 萬人、247 門課，輕量行為介入沒有出現先前研究的中到大效果 | ✅ |
| 兩門 MOOC（合計約 1.3 萬人）：寫影片摘要與讀現成摘要都與小考成績正相關，兩者之間沒有明顯差別；可自由略過；研究 1 有 823 人寫過或讀過至少一則 | van der Zee 2018 | — | ✅ 單一一手 |
| 有學分的互動教科書：答案一鍵可看時，550 名學生平均有 84% 的題目是先試答才看答案；1% 的學生先試答的題目不到兩成；先試答的比例隨學期下降 | Yuen 2016 | Edgcomb 2015：1,394 人、8 門課，給分後先試答比例只從 92% 小幅變為 86%（摘要原句在此被截斷，變化的確切條件沒讀到） | ✅（同一作者群，任職教材公司） |
| 同一批教材：不給分時完成率約 50%；給 2–10 分即超過 90% | Edgcomb 2015 摘要 | zyBooks 2017：兩門要求並計分的課，完成 92% 的指定活動 | ✅（同上） |
| MIT 物理線上作業：抄答案的比例隨學期上升、越接近期限越高；抄超過三成題目的人，期末同類題的相對成績下滑約 2 個標準差 | Palazzo 2010 摘要 | — | ✅ 單一一手 |
| 可以選的時候，學習者多數選重讀而不選純測驗；提供兩個或四個字母的提示後，多數改選自我測驗；答案猜不到時提示不損害學習，猜得到時測驗效益略降 | Vaughn & Kornell 2019（四個實驗，配對詞） | Rivers 2021 摘要：學習者只在容易答對的條件下自我測驗 | ✅（Rivers 只到摘要） |
| MOOC 的課前測驗：整體無益，拿到課前測驗的人較容易退出 | Janelli & Lipnevich 2021，經 Pan & Carpenter 2023 轉引（文字研究 notes） | — | ⚠️ unverified（轉引） |
| Quantum Country：原型上線六個月後，195 名使用者在八成以上卡片上達到一個月的保留；讀完文章約 4 小時，六輪複習約 95 分鐘。沒有給讀過文章的總人數 | Matuschak & Nielsen 2019 | — | ✅ 單一一手，作者自述、無分母 |

### 4 先失敗、有益的困難

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 先解題再講解（PS-I）對先講解再解題（I-PS）：53 個研究、166 個比較，g=0.36，95% CI [0.20, 0.51]；依 PF 設計原則高度落實時 0.37–0.58 | Sinha & Kapur 2021 | Loibl 2017：PS-I 只有在用了對比案例或講解接著學生的解法時才有效 | ✅ |
| 二到五年級與通用技能的學習，效果量偏向先講解 | Sinha & Kapur 2021 摘要 | Ashman 2020：五年級、兩個隨機實驗（N=64、71），先明示教學在相似題上較好；元素互動性提高後連遷移題也較好 | ✅（Ashman 只到摘要） |
| 近 75% 的比較是數學與物理，且集中在少數子題（例如變異數） | Sinha & Kapur 2021 限制 | — | ✅ |
| PF 的落實準則包含：小組解題（53.01% 的比較有做）、講解時接著學生的解法（44.58%）、解題與講解階段的社會性引導 | Sinha & Kapur 2021 編碼段 | — | ✅ |
| 校正出版偏誤後，估計的真實效果為 g=0.87，比未校正的 0.36 大 | Sinha & Kapur 2021 摘要 | — | ✅ 單一一手（校正後變大並不常見；方法段沒讀，不評論） |
| 「先解題較好」對「元素互動性高時先講解較好」 | Sinha & Kapur 2021 | Ashman 2020；Kirschner 2006 | ❌ conflict（不選邊） |
| 交錯練習：59 個研究、238 個效果，整體 g=0.42；畫作 0.67、數學題 0.34；說明文與味覺不顯著；單字材料反向 −0.39 | Brunmair & Richter 2019 摘要 | — | ✅ 單一一手 |
| 學習者不欣賞有益的困難，費力與自覺學得少使他們抗拒 | de Bruin 2023 摘要 | Deslauriers 2019；Vaughn & Kornell 2019 | ✅ |

### 5 專題、引導、鷹架

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 專題式學習對傳統教學的學業成就：d+=0.71（30 篇、46 個效果、12,585 名學生、九國） | Chen & Yang 2019 摘要 | Zhang & Ma 2023：66 篇、190 個效果，合併 0.441，學業成就 0.650；亞洲的效果大於西歐與北美 | ⚠️（Chen & Yang 只到摘要；兩者數字不同，納入範圍不同） |
| MDRC 對 K-12 PBL 的回顧：證據「promising but not proven」；許多研究的設計無法排除其他因素；數學與語文的證據較少；已發表研究可能偏向正面結果 | Condliffe 2017 | — | ✅ 單一來源（二手回顧） |
| 問題／專題／案例式學習對動機：d=0.498，異質；用在單一課程時效果大於整個課程體系 | Wijnia 2024 摘要 | — | ✅ 單一一手 |
| 沒有協助的探索式學習對明示教學：d=−0.38，95% CI [−.44, −.31]（580 個比較）；有協助的探索（回饋、例題、鷹架、引出解釋）對其他教學：d=0.30 [.23, .36]（360 個比較） | Alfieri 2011 摘要 | Kirschner 2006 摘要：引導的優勢只有在學習者有足夠先備知識時才開始消退 | ✅ |
| 電腦提供的鷹架（STEM、問題導向課程）：144 個實驗研究、333 個結果，g=0.46；效果不因鷹架有沒有隨時間改變（撤除、增加）、依什麼邏輯改變而不同；成人學習者的效果最大 | Belland 2017 摘要 | Doo 2020：線上高教的鷹架效果大（18 篇、64 個效果）；後設認知類最多也最大 | ✅ |
| 「鷹架必須撤除才算鷹架」的理論主張對「撤不撤效果沒差」的統合結果 | Belland 2017 引 Pea 2004、Puntambekar & Hubscher 2005 | Belland 2017 自己的結果 | ❌ conflict（理論對資料，同一篇內並陳） |
| 先備知識低的人受高協助之益（d=0.505），先備知識高的人反受其害（d=−0.428） | Tetzlaff 2025（引自文字研究 notes） | Kirschner 2006 | ✅ 轉引 |
| 認知學徒制把傳統學徒制的示範、鷹架、撤除、指導搬到認知技能上，重點是讓看不見的思考歷程變得看得見 | Collins, Brown & Holum 1991 | — | ✅ |
| CS50 AI 的誠信政策把「在重新繳交前取得作業解答」「向任何過去、現在、未來的學生提供作業解答」列為 not reasonable | CS50 AI honesty 頁 | — | ✅ 官方一手 |
| check50 讓教師自動判定程式正確性並在學生寫的時候給自動回饋 | check50 文件 | — | ✅ |
| The Odin Project 對學習者的說法：專案不是測驗記了多少，而是讓資訊在解題時回來的練習點 | Odin Project | — | ✅ 官方自述 |

### 6 生成活動

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 八種生成策略（摘要、製圖、畫圖、想像、自我測驗、自我解釋、教別人、動作演示）各有邊界條件：摘要適合短的、非空間性的說明文；製圖需要大量事前訓練；畫圖在有訓練、有指定要畫什麼、有半成品可補時較有效 | Fiorella & Mayer 2016 | Fiorella 2023：產出的品質能預測後測；引導不足時部分學習者做不出像樣的產出 | ✅ |
| 六種生成策略對大學生都有效；小學生證據不一 | Brod 2021 摘要 | — | ✅ |
| 自我解釋 g=0.55；若對照組拿到現成解釋，g=0.35 | Bisra 2018（引自文字研究 notes） | — | ✅ 轉引 |
| 對不會回應的對象講解（錄影、想像的聽眾）有時有效，但近年數篇研究沒有複製出來；其中一篇在課堂有效、搬到實驗室後自我解釋與非互動教學都不比提取或控制組好，作者推測是受試者先備知識不足 | Lachner 2021 摘要與正文一段 | 伊藤・垣花 2009：大學生學統計的散布度，面對面講解組（13 人）後測高於對鏡頭講解組（14 人）與只準備組（14 人）；後兩組無顯著差異 | ✅（伊藤的樣本每組 13–14 人） |
| 非互動教學的形式：對鏡頭口頭講解有效、寫給虛構對象則無效（Hoogerheide 2016 的標題結論）；材料較複雜時口頭也優於書面（Lachner 2018） | Lachner 2021 的轉述 | 伊藤・垣花 2009 的對鏡頭組沒有優於控制組 | ❌ conflict（「對鏡頭講有效」對「對鏡頭講無效」；Hoogerheide 與 Lachner 2018 原文沒讀，只經回顧轉述） |
| 教別人為什麼有效的五種解釋裡，知識建構與後設認知兩種有一些證據，動機、說明產出、提取練習三種證據很少或不一致 | 小林 2020 摘要 | — | ✅ 單一來源（回顧） |

---

## 我的推論（與上表分開）

| 推論 | 依據 | 可能錯在哪 |
|---|---|---|
| Freeman 的 0.47 不能直接當成「文章加練習比純文章好 0.47」的證據 | Freeman 比的是有老師的課堂時段；Martella 指出控制不全；Deslauriers 的主動組有一半時間是老師回饋 | 課堂裡起作用的成分若主要是「被迫作答加上立刻有解說」，那一篇有題目、有詳解的文章其實複製了大半。現有資料分不出來 |
| 對獨自閱讀的人，ICAP 四級裡最上面一級（interactive）不存在，可用的差別只剩 active 與 constructive 之間 | Chi & Wylie 的定義；獨自閱讀沒有對話對象 | AI 對話工具可能算一種互動對象，本輪沒有查這方面的研究（屬於子問題六） |
| 自我檢查題寫「先寫下答案，再展開」是有依據的，尤其題目要的是一段解釋而不是一個詞 | Tauber 2018（定義類材料 overt 較好，d=0.43）對 Smith 2013（單字表無差） | Tauber 只讀到摘要；兩個實驗都是心理系學生背定義，不是推導或計算題。也沒有研究測過「摺疊答案」這個具體介面 |
| 摺疊答案「立刻可看」本身不太是問題；要擔心的是讀者沒先想就展開 | 回饋時機的兩份大型證據都接近零（Kandemir、Fyfe）；先試答比例在有學分的教材裡是 84–92% | 84–92% 來自有學分、有儀表板的課；公開文章的讀者沒有任何人看著，比例可能低很多。Sana 2020 有一個相反方向的結果（先測後立刻給答案較差），但那是課前測驗 |
| 答案區塊應該寫出為什麼，而不只是給結果 | Swart 2019（讀完後給的詳細回饋與正確答案都優於只告知對錯）；Wisniewski 2020；Yang 2021 的有無回饋差 | Swart 的摘要沒有把「詳細解說」與「只給正確答案」分出高下；兩者差多少要看正文，沒讀到 |
| 題目放在閱讀動線上、不作答就得主動繞過，比另外跳出來或放在頁尾的做的人多 | Kovacs 74%（影片播到就停下來的小考）對 Davis 19.5%（另外跳出的提示） | 兩篇的課、平台、題目性質都不同，不是只差擺放位置。這是跨研究比較，不是實驗 |
| 公開文章的內嵌練習，實際作答率大概落在兩成到五成之間，而且會隨篇幅往後下降 | Davis 19.5%、Edgcomb「不給分約 50%」、Yuen「先試答比例隨學期下降」 | 沒有任何一篇量的是部落格讀者；這個區間是我從相鄰情境拼出來的，可能高估也可能低估。本站沒有量過 |
| 讀者覺得「有題目的文章比較累、學得比較少」不代表真的學得少 | Deslauriers 2019；de Bruin 2023；Vaughn & Kornell 2019 | Deslauriers 是課堂，量的是當堂測驗。對自學者，「覺得累」可能直接導致關掉頁面，那就真的學得少 |
| 想提高自我測驗的意願，可以把題目做得「有提示、答得出來」 | Vaughn & Kornell 2019；Rivers 2021 | 材料是配對詞；提示讓答案猜得到時效益會降（同文實驗 4） |
| 在一篇文章裡照搬 productive failure 不太可行；可行的弱化版是「先丟一題、再講解，講解時對照幾種常見的錯誤解法」 | PF 的落實準則有小組、有「接著學生自己的解法講」；Loibl 說有效的條件是對比案例或接著學生解法；文章可以預先寫出常見錯解當對比案例 | 這個弱化版其實更接近 prequestion（文字研究已整理，沒被問到的內容效果很不一致）。用「預先寫好的錯解」取代「讀者自己的錯解」有沒有同樣效果，本輪沒找到直接證據 |
| 對完全的新手、內容各部分互相牽連時，先講解再練習比較穩 | Ashman 2020；Sinha & Kapur 對低年級的結果；Kirschner 2006；Tetzlaff 2025 | Ashman 的受試者是小學五年級；本站讀者是成人。Sinha & Kapur 的整體結果方向相反 |
| 課程導讀附「專案」時，讀者真正缺的不是題目，是做的過程中的回饋與卡住時的協助 | Alfieri（無協助探索 −0.38，有協助 +0.30）；Belland（電腦鷹架 0.46）；PjBL 的研究全部有老師 | Alfieri 的「探索」多半是概念發現，不是寫程式專案。CS50 有 check50 可以當回饋來源，條件比一般文章好 |
| 把專案的完整參考實作直接貼在導讀裡，在教學上與對官方課程的規範上都有疑慮 | CS50 AI 誠信政策明文把提供與事先取得解答列為 not reasonable；Palazzo 2010（抄答案與考試成績下滑相關）；例題效果文獻（文字研究：例題對新手有益） | 例題文獻支持「給新手看完整解法」；但那是另給同構題練習的情況，不是把要繳的那一題直接給解。政策怎麼適用於第三方導讀，要人判斷，我沒有資格下結論 |
| 鷹架「撤不撤」對文章作者不是首要問題，「有沒有」才是 | Belland 2017 的調節結果 | 我沒讀結果表，只依摘要。Belland 的鷹架是軟體內的提示，不是文章的寫法 |
| 「講給想像中的人聽」「寫一篇筆記教別人」這類建議，證據比一般印象弱 | 伊藤・垣花 2009；Lachner 2021；小林 2020 | 伊藤每組 13–14 人，檢定力低；Lachner 轉述的研究裡也有對鏡頭口頭講解有效的，方向不一致。對寫作型的讀者（寫筆記、寫文章教別人）較不利的是「書面無效」這一條，但它只有轉述 |
| doer effect 目前是「一致的相關」，不是「已證明的因果」 | Koedinger 2015 自述相關；Van Campenhout 2023 自述模型不證明因果、需要實驗；作者群與產品有利益關係 | Koedinger 2016 的因果分析我沒讀到原文；可能比轉述的更強 |

---

## 草稿骨架

### 這個子問題可以拆成幾篇

建議四篇，另加一篇視情況併入別的子問題。每篇的「證據強度」用三級：強（多個統合分析或大型預先註冊實驗方向一致）、中（有統合分析但情境差很遠，或只有一兩個一手研究）、弱（單一小研究、摘要層級、或我自己的跨研究推論）。

#### 篇一　「做中學」的證據到底在量什麼

- **聚焦問題**：「主動學習比被動好」是教學文章最常被引用的一句話，它的證據是什麼、能不能推到一個人讀文章。
- **主要結論與強度**
  - 大學 STEM 課堂裡，有某種主動成分的班比純講述的班好約半個標準差（強，但限課堂）。
  - 這批研究的控制普遍不全，「主動學習」是用「不是講述」來定義的（中；單一方法回顧）。
  - ICAP 的四級排序是假說；外顯行為不等於內在處理，提出者自己也這樣寫（中）。
  - doer effect 在多門課裡一致出現，但至今沒有隨機實驗，主要作者與產品有利益關係（中）。
  - 學得多的那一組自覺學得少（中；單一實驗加理論文）。
- **本站案例**：站上的導讀在規格裡寫「每節一題」，可以拿來問：這一題對應 ICAP 哪一級、依據是哪一類研究。`course-guide-contract.md` 第 82 行已經誠實寫了依據的限制，可當正面例子。

#### 篇二　文章裡的練習題：寫下來、給答案、給到多細

- **聚焦問題**：在一篇沒有自動評分的文章裡放自我檢查題，哪些設計細節有證據。
- **主要結論與強度**
  - 題目要解釋或定義時，寫下來比在腦中想好；背單字這類則沒差（中；有衝突，Tauber 只到摘要）。
  - 答案立刻給或晚點給，平均沒有差（強；一份統合分析加一份 38 班的預先註冊實驗）。
  - 答案裡要有解說，不只是對錯（中；Swart 只到摘要）。
  - 沒有自動評分時，給判準讓讀者自評是有依據的做法，但自評研究裡設計較弱的效果量較大（中）。
  - 程式題的自動回饋工具多半只指出哪裡錯（中；單一回顧）。
  - 實務端常用的題型：診斷型選擇題、Parsons Problems、faded examples（實務建議，本輪沒有核對各自的效果研究，Parsons 的回顧沒拿到）。
- **本站案例**：CS50 AI 導讀每篇九到十題摺疊答案，題幹寫「先寫下答案，再展開」，答案寫出推理。這個做法與上面三條對得上，可以直接當示範；也要寫明沒有量過讀者是否真的先寫。

#### 篇三　讀者真的會做嗎

- **聚焦問題**：內嵌練習的嘗試率、跳過率、先看答案的比例；哪些設計改變這些比例。
- **主要結論與強度**
  - 擋在動線上的小考，約四分之三的人會答（中；單一 MOOC）。
  - 另外跳出、可以不理的提示，約兩成的人碰過，對成績沒有效果（中；單一預先註冊實驗）。
  - 有學分的教材：不給分約五成完成，給一點分就超過九成；八成多的題目是先試答才看答案（中；產品方資料）。
  - 學習者能選的時候偏好重讀；給提示、讓題目答得出來，自我測驗的比例會上升（中；實驗室配對詞）。
  - 抄答案的人考試成績明顯下滑（中；單一觀察研究）。
  - 公開文章讀者的作答率，沒有找到任何直接資料（缺口，要明寫）。
- **本站案例**：本站沒有量過摺疊答案的展開率，也沒有量過讀者有沒有先作答。這一篇最誠實的寫法是把這個缺口講出來，並說明如果要量可以量什麼（展開事件、展開前的停留時間）。要不要加這種量測牽涉 schema 與追蹤，屬 Tier 2，本 note 只記為待解問題。

#### 篇四　專案、卡關與引導：一個人做的時候少了什麼

- **聚焦問題**：productive failure、專題式學習、鷹架、認知學徒制這些在課堂裡有老師的做法，搬到一篇導讀或一個系列時，哪些成分還在、哪些不見了。
- **主要結論與強度**
  - 先解題再講解平均有利，但有效的版本依賴對比案例或接著學生自己的解法講；對低年級與通用技能則相反（強於整體方向，中於邊界條件）。
  - 專題式學習對成績的統合效果為正，但研究設計弱、全部有老師與小組，獨立回顧的評語是「有希望但未證實」（中）。
  - 沒有協助的探索比明示教學差；有回饋、例題、鷹架的探索比較好（強；580 與 360 個比較）。
  - 軟體提供的鷹架有中等效果，撤不撤沒有可見差別（中；我只讀摘要）。
  - 認知學徒制六種方法裡，文章做得到示範與鷹架，做不到即時指導（弱；這是我依 Collins 的定義做的對照，不是實證）。
  - 交錯練習對說明文沒有顯著效果，對單字反而較差，不是通用的「困難」（中；單一統合分析摘要）。
- **本站案例**：CS50 AI 七篇的專案節。可寫的有三點：（1）原本的參考程式六週跑不起來或規則寫反，獨立審稿後才修正，這說明「給解答」這件事本身的品質風險；（2）check50 是讀者唯一的外部回饋來源，而審稿報告註明 check50 沒實跑；（3）導讀貼出完整參考實作，與 CS50 AI 誠信政策的文字有出入，見待解問題。

#### 可併入別處的一篇　生成活動一個人做的版本

- **聚焦問題**：自我解釋、畫圖、摘要、教別人，一個人讀的時候哪些還有效。
- **主要結論與強度**：大學生身上各策略都有正面證據，但各有邊界條件，而且產出品質決定效果（中）；對鏡頭或想像聽眾講解的效果不穩定，寫給虛構對象的版本證據更弱（弱到中）；自我解釋的優勢在對照組拿到現成解釋時縮小（中，引自文字研究）。
- **建議**：與文字研究（self-explanation prompts）及圖像化研究（畫圖）重疊多，建議併入那兩篇，或在篇二留一節，不單獨成篇。

### 核心概念（給 `post` skill 用）

讀者「做了什麼」比「看了什麼」更能預測學到多少，這個說法方向上有很多證據支持，但證據幾乎都來自有老師、有同學、有成績的場合。把它搬到一個人讀網路文章時，三件事同時改變：沒有人回應你的答案、沒有人看你有沒有做、卡住時沒有人接手。系列這一段要回答的是，在這三個條件下，文章作者手上還剩哪些工具。

### 關鍵設計決定

- 題目擺哪裡：擋在動線上，或可略過。
- 作答形式：要求寫下來，或默想即可。
- 答案：立刻可看與否（影響小）；有沒有解說（影響較大）。
- 練習的順序：先講解再練，或先丟題目再講。
- 專案：給到什麼程度（題目、鷹架、部分解法、完整解法），回饋從哪裡來。

### 跟替代方案的比較

- 純解說、不放題目：最省讀者力氣，讀者自覺學得多；提取與回饋的效益拿不到。
- 互動式自動評分（zyBooks、Runestone 這類）：完成率與先試答比例都有資料，但要平台與維護成本，且完成率靠學分撐。
- 交給外部（官方 autograder、MOOC 作業）：回饋品質最好，但導讀自己控制不了，也碰到誠信政策。

### 適合／不適合的情境

- 適合放自我檢查題：概念與定義、可手算的小例子、可用一兩句判準核對的推理。
- 不適合硬搬：需要小組與教師即時引導的 productive failure；需要長時間與同儕的專題。

### 限制／已知問題

- 沒有任何一篇研究的受試者是「免費公開文章的讀者」。
- 行為資料多半來自產品方。
- 六個關鍵來源只到摘要（Swart、Kandemir、Ashman、Rivers、Tauber、Chen & Yang）。
- 非英語文獻只有兩篇日文。

### 取捨總結

題目要放，而且要讓讀者先作答、答案要有解說，這三點的依據最穩。要不要先讓讀者卡關、專案給到多細，證據互相衝突，取決於讀者的先備知識與有沒有外部回饋。讀者實際做不做，本站沒有資料，文獻也沒有對應情境的資料。

---

## 待解問題

- **CS50 AI 專案節的完整參考實作與官方誠信政策。** 政策原文把「Providing or making available solutions to assessments to anyone」與「Accessing a solution to some assessement prior to (re-)submitting your own」列為 not reasonable。站上七篇導讀的專案節貼了可執行的參考實作。這是不是該改、怎麼改（例如只留思路與鷹架、把完整解法移除或延後），需要人拍板；建議登錄 `docs/governance/escalation-queue.md`。我沒有改任何文章。
- 本站要不要量摺疊答案的展開行為。量了才有辦法寫篇三的本站資料；涉及前端事件與可能的儲存，屬 Tier 2。
- Swart 2019、Kandemir 2026 的正文拿不到。篇二關於「答案要有解說」「時機不重要」兩條結論目前有一半靠摘要。若使用者有機構存取權，補這兩篇最划算。
- Koedinger 2016 與 Ericson 2015 的原文沒拿到；前者關係到 doer effect 能不能講成因果，後者是唯一非產品方的互動電子書使用資料。
- Parsons Problems、faded examples 的效果研究本輪沒有深讀（Ericson 2022 回顧被擋）。若篇二要推薦題型，這塊要補。
- productive failure 的「預先寫好常見錯解當對比案例」在獨自閱讀時有沒有效，沒有找到直接研究；DeCaro 2023（遠距的 exploratory learning）與 González-Cabañes 2023 的 Campbell protocol 可能有線索，沒讀。
- 中文一手研究沒有找到可核對的；若系列要宣稱涵蓋華語圈，需要進 CNKI 或華藝查。
- 生成活動是否獨立成篇，要與文字研究、圖像化研究的負責人對一次範圍。
