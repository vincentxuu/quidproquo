# Research: 學習怎麼隨時間維持（子問題四，代號 q4-time）

狀態：步驟 0–6 完成；2026-10-13 第二輪補讀完成（依主持人指示補方法、結果、限制，並重試被擋來源）。未 commit。
日期：2026-10-13
原文存放：`.research/raw/learning-content/q4-time/`（第二輪後約 100 個檔；四封贊助者信件的檔已刪）
上層範圍：`.research/2026-10-13-learning-content-series-scope.md` 子問題 4。站上 Learning How to Learn 系列處理「學習者自己怎麼安排」，本 note 只看「做內容的人能安排什麼」。

toolDegradation（第二輪補充：被擋來源另用 Exa `web_fetch_exa` 不帶 query 重試，取回 Reich 2019 正文與 Firth 2021 全文；Springer、SAGE、ACM、Taylor & Francis 的付費文章 Exa 也只回摘要）：Groundlane MCP 不在本 session 工具清單（ToolSearch 查不到）；Groundlane 直接 HTTP 回 401（無授權）。降到第三層 Keenable keyless API（搜尋與抓取都可用，需帶 `X-Keenable-Title` 標頭；抓取上限每頁約 50,000 字元，超過會截斷；10 RPS）。超過 50k 的文章改走 Europe PMC `fullTextXML`、ERIC／作者網頁／arXiv 的 PDF 加 `pdftotext`、`r.jina.ai` 讀取器（今天可用，未回額度錯誤）。You.com keyless 回 405，未用。Exa 已載入但沒用到。Springer、SAGE、Wiley、ScienceDirect、MDPI 用 curl 直抓都被擋，靠 Keenable 或 Jina 取回；其中 Springer 付費文章 Jina 只回參考文獻。

---

## 步驟 0　選案

### 0-1 母群定義

**邊界**：研究「學習成果隨時間的變化」與「做內容的人能安排的時間結構」之間關係的實證研究與實務作品。

算：(a) 把間隔、交錯、複習、順序、步調當成被操弄或被觀察的變項，且場域是真實課程、線上課程、教科書或公開的自學內容；(b) 量自學者判斷自己懂不懂的準確度，以及內容特徵怎麼改變它；(c) 線上自學的持續、輟學、遺忘、回訪的實際資料與介入實驗；(d) 實務端把這些做進產品或文章的作品與作者公開的資料。

不算：純實驗室字詞配對的間隔研究（只當背景，引統合分析）；學習者自己的讀書方法建議（站上 LHTL 系列已處理）；排課、學期制度等學校行政層面；動作技能訓練。

### 0-2 掃描方法與掃到的清單

| 方法 | 做了什麼 | 掃到 |
|---|---|---|
| 近五年統合分析與系統性回顧 | Keenable 搜「meta-analysis／systematic review」× spacing、interleaving、metacomprehension、learner control、SRL online、MOOC dropout、ALEKS、spaced repetition medical | Mawson & Kang 2025；Latimier 等 2021；Donoghue & Hattie 2021；Trumble 等 2024；健康專業間隔式數位教育統合 2024（PMC11502984）；醫學教育 SR 統合 2026；Anki 系統性回顧 2026；Brunmair & Richter 2019；Firth 等 2021；Yang 等 2023；Prinz 等 2020；Karich 等 2014；Landers & Reddock 2017；Fang 等 2019；Sun 等 2021（ALEKS，未取）；Huang 等 2023（MOOC 輟學）；Doroudi 等 2019；數學間隔與提取統合 2025（ERIC EJ1478558，未取）；K-12 線上 SRL 介入統合 2022（未取） |
| 手冊章節 | 沿用 scope 檔掃到的 IES Practice Guide 建議 1、6、7 與 Multimedia Handbook 第 35 章 learner control（只有目錄）；本輪另讀 Carpenter、Pan、Butler 2022（Nature Reviews Psychology）當作領域綜述 | Carpenter 等 2022；Scheiter & Gerjets 2007 |
| 研討會議程 | dblp 的 Learning@Scale 2024、2025 完整論文清單逐條以關鍵字篩（2024 頁被截斷在 50k）；LAK、L@S 過去場次用主題搜尋 | Davis 等 2018（LAK）；Yeomans & Reich 2017（LAK）；Mullaney & Reich 2015（L@S）；Guo & Reinecke 2014（L@S）；Kovacs 2016（L@S）；Zengilowski 等 2025（L@S，後設認知提示大型 RCT 無效，只到標題）；L@S 2022 SRL 鷹架多波研究；PATHOS 2026（ICER） |
| 推薦鏈 | 從 Kizilcec 等 2020 的被複製研究往回追；從 Mawson & Kang 的排除清單往回追；從 Matuschak 的 Mnemonic medium 總表頁往外追 | Baker 等 2016；Patterson 2018；Kizilcec 等 2017（C&E 與 Science）；Lindsey 等 2014；Lyle 等 2020；Greving & Richter 2019；Kerfoot 等 2007；Execute Program；Chessable、Dawnguide、Thought Saver（只列名） |
| 實務作品目錄 | Matuschak「Substantive examples of the mnemonic medium」「Mnemonic medium」總表；Duolingo 研究頁與官方部落格；Math Academy 教學法頁 | Quantum Country；Orbit；Execute Program；Duolingo HLR 與 streak；Math Academy（FIRe、知識圖譜） |
| 非英語 | 中文繁體（磨課師 完成率 輟學）、簡體（慕课 辍学 完成率 学堂在线）、日文（JMOOC 修了率；分散学習 授業 実践）各搜一輪 | 渡邉・向後 2017（日本教育工学会論文誌）；郭文忠等 2021（福州大學）；钱静（清華大學，學堂在線介入研究說明）；國家教育研究院電子報 179 期（未讀）；華藝「磨課師持續使用意願」（只到書目）；日文分散學習只搜到科普文與一篇 2008 認知科學會海報（未讀） |

完整候選清單約 95 筆（存 `scan1.txt`–`scan5.txt` 於 scratchpad，未入 repo），深讀 55 筆左右。

### 0-3 覆蓋矩陣

維度取捨標準：沿這個維度的不同值，做內容的人會不會做出不同決定。

| 維度 | 值 | 選入 | 缺口 |
|---|---|---|---|
| 場域 | 實驗室（只當背景） | Latimier 2021、Brunmair 2019、Yang 2023、Prinz 2020 | |
| | 實體課堂 | Mawson & Kang 2025、Lindsey 2014、Rohrer 2020、Greving & Richter 2019、義大利小學 2025 | |
| | 線上課程／MOOC | Davis 2018、Carvalho 2020、Kizilcec 2020、Baker 2016、Yeomans 2017、Patterson 2018、Mullaney 2015 | |
| | 公開網頁內容（非課程） | Quantum Country／Orbit（作者自己公布的資料） | **只有這一家**，沒有獨立研究者做的網頁文章回訪研究 |
| | 教科書 | Rohrer 等 2020（教科書題目分析） | 文字教科書的複習安排沒找到分析 |
| 結果方向 | 有效 | 多數 | |
| | 無效或反向 | Davis 2018、Kizilcec 2020、Baker 2016、Greving & Richter 2019、義大利小學 2025（間隔單獨無效）、Fang 2019、Karich 2014、Doroudi 2019 的相依內容子集、Maltagliati 2023、Zengilowski 2025（未讀） | |
| 介入層級 | 內容本身（順序、嵌入題、排程） | Rohrer、Lindsey、QC、Execute Program、PATHOS、Dringoli | |
| | 學習者行為（提示、nudge、承諾裝置） | Kizilcec、Baker、Yeomans、Patterson、Davis | |
| | 平台（發佈節奏、截止日） | Mullaney 2015、Helsinki 2020 | 只有自然實驗，沒有隨機分派 |
| 證據來源 | 同儕審查 | 上列多數 | |
| | 實務者自報 | Matuschak 筆記、Bernhardt、Duolingo 部落格、Math Academy | 都沒有第三方查核 |
| 語言／地區 | 英語圈 | 多數 | |
| | 非英語 | 德國（Greving & Richter、Prinz、Brunmair）、法國（Latimier）、義大利（小學 2025）、荷蘭（Davis）、芬蘭（Helsinki）、日本（渡邉・向後）、中國（钱静、郭文忠） | 臺灣只到書目；日本與中國找到的是態度問卷與說明文，沒有介入實驗的全文 |
| 時間 | 2015 以前 | Kerfoot 2007、Scheiter 2007、Adar 2008、Jordan 2014、Lindsey 2014 | |
| | 2015–2020 | 多數 | |
| | 2021 以後 | Mawson 2025、Yang 2023、Trumble 2024、間隔式數位教育統合 2024、PATHOS 2026、Anki 2026 | |

補搜一輪後仍空的格子：獨立研究者對「網頁文章讀者回訪行為」的研究（只找到 2008 年一般網頁回訪的 log 研究）；文字教科書的複習安排；臺灣的介入研究。

### 0-4 偏誤

- **MOOC 佔了線上自學證據的幾乎全部**。MOOC 有註冊、有截止日、有證書，和「搜尋進來讀一篇文章就走」的讀者差很遠。
- **嵌入式複習的資料只有一位作者**（Matuschak）在單一作品（Quantum Country，量子計算入門）上的自報，樣本是自己選擇留下來的讀者；公開可引的只有 2019 年的文章與他的公開工作筆記。
- **醫學教育佔了「間隔在真實課程」的很大一塊**（Kerfoot、間隔式數位教育統合 2024、Trumble、Anki 回顧），受試者有執照考壓力，動機結構和自學者不同。
- 交錯與後設理解的統合分析以實驗室、大學生、短教材為主；Firth 2021 自己寫明文獻被實驗室大學生研究主導。
- 實務端選到的四家（QC、Execute Program、Duolingo、Math Academy）都是活著的產品；沒找到公開檢討的失敗案例（Khan Academy 知識地圖移除、Orbit 停滯都沒查到一手說明）。
- 排序的實證（PATHOS、Dringoli、Baroody）各自只在一個主題上做，不能推到一般原則。
- 為什麼還是選這些：這是掃到的清單裡離「內容作者能安排什麼」最近的；缺口照實寫在待解問題。

---

## 子問題

1. **間隔與交錯搬到真實課程後還剩多少效果，什麼條件下消失？**
2. **把複習做進內容本身（mnemonic medium、定期電郵題、課內 SRS）的實際資料長什麼樣，卡在哪裡？**
3. **順序怎麼排：先備結構、螺旋、學習進程、演算法排序各有多少證據？**
4. **自學者判斷自己懂了沒有多準，內容能怎麼幫？**
5. **讓讀者自己選順序與速度，利弊各是什麼？**
6. **線上自學的持續、輟學、遺忘、回訪：實際數字是多少，哪些介入在大規模複製時失敗？**

---

## 來源清單

訪問日皆為 2026-10-13。角色：一手研究／統合分析／綜述／實務者自報／二手報導。取用層級見下節盤點表。

### 子問題 1　間隔與交錯

- [Mawson & Kang 2025, The Distributed Practice Effect on Classroom Learning: A Meta-Analytic Review of Applied Research](https://pmc.ncbi.nlm.nih.gov/articles/PMC12189222/) — 統合分析，Behavioral Sciences（MDPI）
- [Latimier, Peyre & Ramus 2021, A Meta-Analytic Review of the Benefit of Spacing out Retrieval Practice Episodes on Retention](http://www.lscp.net/persons/ramus/docs/EPR20.pdf) — 統合分析，Educational Psychology Review（頁首註明 corrected publication 2021）
- [Donoghue & Hattie 2021, A Meta-Analysis of Ten Learning Techniques](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2021.581216/full) — 統合分析
- [Murray 等 2025, A Meta-Analytic Review of the Effectiveness of Spacing and Retrieval Practice for Mathematics Learning](http://aidanhorner.org/papers/Murrayetal_EdPsychReview_2025.pdf) — 統合分析，預先註冊，Educational Psychology Review 37:75（第二輪新增）
- [Carpenter, Pan & Butler 2022, The science of effective learning with spacing and retrieval practice](https://www.nature.com/articles/s44159-022-00089-1) — 綜述，Nature Reviews Psychology
- [Lindsey, Shroyer, Pashler & Mozer 2014, Improving Students' Long-Term Knowledge Retention Through Personalized Review](https://home.cs.colorado.edu/~mozer/Research/Selected%20Publications/reprints/LindseyShroyerPashlerMozer2014Published.pdf) — 一手，Psychological Science
- [Lyle 等 2020, How the Amount and Spacing of Retrieval Practice Affect the Short- and Long-Term Retention of Mathematics Knowledge](https://eric.ed.gov/?id=EJ1245263) — 一手，Educational Psychology Review
- [Greving & Richter 2019, Distributed Learning in the Classroom: Effects of Rereading Schedules Depend on Time of Test](https://pmc.ncbi.nlm.nih.gov/articles/PMC6333692/) — 一手，預先註冊，Frontiers in Psychology
- [Retrieval practice enhances learning in real primary school settings, whether distributed or not（2025）](https://pmc.ncbi.nlm.nih.gov/articles/PMC12372469/) — 一手，義大利小五兩個班
- [Kerfoot 等 2007, Spaced education improves the retention of clinical knowledge by medical students](https://medicine.wright.edu/sites/medicine.wright.edu/files/page/attachments/Kerfoot%20etal%20spaced%20education%20retention%20knowledge%20MedEduc2007.pdf) — 一手 RCT，Medical Education
- [Spaced Digital Education for Health Professionals: Systematic Review and Meta-Analysis（2024）](https://pmc.ncbi.nlm.nih.gov/articles/PMC11502984/) — 統合分析（期刊名與作者未從原文核對，以 PMC 編號為準）
- [Trumble 等 2024, Systematic review of distributed practice and retrieval practice in health professions education](https://pmc.ncbi.nlm.nih.gov/articles/PMC11078833/) — 系統性回顧
- [The Effectiveness of Spaced Repetition in Medical Education: A Systematic Review and Meta-Analysis（2026）](https://pubmed.ncbi.nlm.nih.gov/41601436) — 統合分析，The Clinical Teacher
- [Anki Use and Academic Performance in Medical Education: A Systematic Review（2026）](https://link.springer.com/article/10.1007/s40670-026-02643-5) — 系統性回顧，Medical Science Educator
- [Brunmair & Richter 2019, Similarity matters: A meta-analysis of interleaved learning and its moderators](https://psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf) — 統合分析，Psychological Bulletin（接受稿）
- [Rohrer, Dedrick, Hartwig & Cheung 2020, A Randomized Controlled Trial of Interleaved Mathematics Practice](https://files.eric.ed.gov/fulltext/ED595322.pdf) — 一手，預先註冊叢集 RCT
- [Rohrer, Dedrick & Hartwig 2020, The Scarcity of Interleaved Practice in Mathematics Textbooks](https://files.eric.ed.gov/fulltext/ED611830.pdf) — 一手（教科書內容分析）
- [Firth, Rivers & Boyle 2021, A systematic review of interleaving as a concept learning strategy](https://bera-journals.onlinelibrary.wiley.com/doi/full/10.1002/rev3.3266) — 系統性回顧，Review of Education
- [Carvalho, Sana & Yan 2020, Self-regulated spacing in a massive open online course is related to better learning](https://pmc.ncbi.nlm.nih.gov/articles/PMC7076029/) — 一手（觀察），npj Science of Learning
- [Davis, Kizilcec, Hauff & Houben 2018, The Half-Life of MOOC Knowledge](https://dan7davis.github.io/papers/LAK18_Half_Life.pdf) — 一手 RCT，LAK；期刊版 [Encouraging Retrieval Practice in MOOCs](https://files.eric.ed.gov/fulltext/EJ1199897.pdf)

### 子問題 2　把複習嵌進內容

- [Matuschak & Nielsen 2019, How can we develop transformative tools for thought?](https://numinous.productions/ttft/) — 實務者自報（含兩個非正式實驗）
- [Matuschak & Nielsen 2019, Timeful Texts](https://numinous.productions/timeful/) — 實務者論述
- Matuschak 公開工作筆記（實務者自報，未經審查）：[Mnemonic medium](https://notes.andymatuschak.org/Mnemonic_medium)、[Effects of the mnemonic medium on reader memory](https://notes.andymatuschak.org/zqetsQERteJhyPitmRoaeE)、[2019 Quantum Country efficacy experiment](https://notes.andymatuschak.org/z2cKiAiZ8tAWiz4ZUoTaaBv)、[In-essay Quantum Country prompts boost performance on first repetition](https://notes.andymatuschak.org/zHMuXkWrGpDVQ6j82YNK2iD)、[readers appear less likely to recover from forgetting when reviews are scheduled too late](https://notes.andymatuschak.org/z5UfUeuEkvxPdAvMcpVPPew)、[Mnemonic essays may offer detailed retention … 35-50% reading time overhead](https://notes.andymatuschak.org/z4biJ7i6da3exh3qmXXohjh)、[Quantum Country readers reliably develop detailed retention](https://notes.andymatuschak.org/zRxhtQqHvLpatPLB4BvzMRB)、[Lessons learned from applying the mnemonic medium to non-technical texts](https://notes.andymatuschak.org/zG29usta2L9LLjkVbnvCzcV)、[The mnemonic medium works well for linear primers in established fields](https://notes.andymatuschak.org/zP8MVDmomB7UrTddVY34E1B)、[The mnemonic medium should give readers control over the prompts they collect](https://notes.andymatuschak.org/z3XqmAYKcD411jZgBik9oyXgcrarXycADWVeh)、[What's the big-picture impact of the mnemonic medium on readers?](https://notes.andymatuschak.org/zNGtyWTwns63fhzixGKZ1Bb)、[Regular spaced repetition memory practice is an onerous habit to adopt](https://notes.andymatuschak.org/z3DiwZKDuLxMV17mt2nWH7y)、[Mnemonic texts could be serialized in small sections over time](https://notes.andymatuschak.org/zJaSxZHpWr5fq7vQtHUVuMp)、[Substantive examples of the mnemonic medium](https://notes.andymatuschak.org/z7tvoovbepeoM99XZCSntef)、[Execute Program](https://notes.andymatuschak.org/z2LGZ8cXBcQMP7YuAHbeVyCSLZoiMXvQNKCok)
- Matuschak 另有四封贊助者信件（2021–2022），作者標明不得公開分享、不得引用；依其要求不使用，本 note 不含其內容，原文檔也已從 raw 目錄刪除。事實表裡 Quantum Country 的數字全部出自 2019 年公開文章與未加此標示的公開工作筆記。
- [Gary Bernhardt 在 Hacker News 的留言（2021-03）](https://news.ycombinator.com/item?id=26349754) — 實務者自報（Execute Program 創辦人）
- [Settles & Meeder 2016, A Trainable Spaced Repetition Model for Language Learning](https://research.duolingo.com/papers/settles.acl16.pdf) — 一手，ACL（Duolingo 員工）
- [Duolingo 官方部落格：The Duolingo Streak Uses Habit Research to Keep You Motivated](https://blog.duolingo.com/how-duolingo-streak-builds-habit/) — 實務者自報
- [Math Academy：Pedagogy](https://mathacademy.com/pedagogy) — 實務者自報
- [Kovacs 2016, Effects of In-Video Quizzes on MOOC Lecture Viewing](https://dl.acm.org/doi/10.1145/2876034.2876041) — 一手（log 分析），L@S

### 子問題 3　順序

- [Doroudi, Aleven & Brunskill 2019, Where's the Reward? A Review of Reinforcement Learning for Instructional Sequencing](https://cpb-us-e2.wpmucdn.com/faculty.sites.uci.edu/dist/f/847/files/2019/11/IJAIED-RL-Review-Author-Version.pdf) — 綜述（作者版），IJAIED
- [Fang 等 2019, A meta-analysis of the effectiveness of ALEKS on learning](https://doi.org/10.1080/01443410.2018.1495829) — 統合分析，Educational Psychology
- [Baroody 等 2022, Lessons Learned from 10 Experiments That Tested the Efficacy and Assumptions of Hypothetical Learning Trajectories](https://www.mdpi.com/2227-7102/12/3/195) — 一手綜合，Education Sciences
- [Gouvea 2019, Recent Progress in Learning Progressions Research（Current Insights）](https://pmc.ncbi.nlm.nih.gov/articles/PMC8727062/) — 二手評介，CBE—Life Sciences Education
- [Ireland & Mouthaan 2020, Perspectives on curriculum design: comparing the spiral and the network models](https://www.cambridgeassessment.org.uk/Images/598388-perspectives-on-curriculum-design-comparing-the-spiral-and-the-network-models.pdf) — 綜述，Research Matters（Cambridge Assessment）
- [Maltagliati 等 2023, Development and evaluation of a pre-clerkship spiral curriculum](https://pmc.ncbi.nlm.nih.gov/articles/PMC9848358/) — 一手，Medical Education Online
- [Dringoli 等 2021, The impact of content sequencing on quantitative problem-solving](https://arxiv.org/abs/1910.00145) — 一手，arXiv v2
- [Rivera Garrido 等 2026, PATHOS: A Pedagogical Method for Sequencing Instruction in Multi-Foundational Machine Learning](https://people.inf.ethz.ch/sverrirt/pdf/pathos.pdf) — 一手，預先註冊 RCT，ICER 2026

### 子問題 4　後設認知

- [Yang 等 2023, Mind the Gap Between Comprehension and Metacomprehension](https://discovery.ucl.ac.uk/id/eprint/10150804/2/Shanks_Mind%20the%20Gap%20Between%20Comprehension%20and%20Metacomprehension_AAM.pdf) — 統合分析（接受稿），Review of Educational Research
- [Prinz, Golke & Wittwer 2020, To What Extent Do Situation-Model-Approach Interventions Improve Relative Metacomprehension Accuracy?](https://link.springer.com/article/10.1007/s10648-020-09558-6) — 統合分析，Educational Psychology Review
- [Rozenblit & Keil 2002, The misunderstood limits of folk science: an illusion of explanatory depth](https://pmc.ncbi.nlm.nih.gov/articles/PMC3062901/) — 一手
- [Deslauriers 等 2019, Measuring actual learning versus feeling of learning](https://pmc.ncbi.nlm.nih.gov/articles/PMC6765278/) — 一手，PNAS
- [Yan, Bjork & Bjork 2016, On the Difficulty of Mending Metacognitive Illusions](https://www.apa.org/pubs/journals/features/xge-xge0000177.pdf) — 一手，JEP: General
- [Macaluso, Beuford & Fraundorf 2022, Familiar Strategies Feel Fluent](https://pmc.ncbi.nlm.nih.gov/articles/PMC9590044/) — 一手，Journal of Intelligence

- [Zengilowski 等 2025, Encouraging Metacognitive Reflection through Prompts in a Computer-Based Learning Platform: Failure to Find a Benefit in a Large-Scale Randomized Trial](https://dl.acm.org/doi/10.1145/3698205.3729547) — 一手，預先註冊 RCT，L@S 2025；**只讀到摘要**（第二輪新增）

### 子問題 5　learner control

- [Karich, Burns & Maki 2014, Updated Meta-Analysis of Learner Control Within Educational Technology](https://eric.ed.gov/?id=EJ1034262) — 統合分析，Review of Educational Research；二手：[Education Week 報導](https://www.edweek.org/leadership/review-casts-doubt-on-importance-of-learner-control-in-computerized-instruction/2014/05)
- [Landers & Reddock 2017, A Meta-Analytic Investigation of Objective Learner Control in Web-based Instruction](https://link.springer.com/article/10.1007/s10869-016-9452-y) — 統合分析，Journal of Business and Psychology
- [Scheiter & Gerjets 2007, Learner Control in Hypermedia Environments](https://link.springer.com/article/10.1007/s10648-007-9046-3) — 綜述
- [I determine my learning path, or not?（2022）](https://pmc.ncbi.nlm.nih.gov/articles/PMC9496864/) — 一手，Frontiers in Psychology
- [Mullaney & Reich 2015, Staggered Versus All-At-Once Content Release in MOOCs](https://dl.acm.org/doi/10.1145/2724660.2724663) — 一手（自然實驗），L@S
- [Guo & Reinecke 2014, Demographic Differences in How Students Navigate Through MOOCs](https://cs.rochester.edu/hci/pubs/pdfs/edX-MOOC-demographics-and-navigation_LAS-2014.pdf) — 一手（log 分析），L@S
- [Deadlines and MOOCs: How Do Students Behave in MOOCs with and without Deadlines（2020）](https://ieeexplore.ieee.org/document/9274023) — 一手，IEEE（赫爾辛基大學程式設計 MOOC）

### 子問題 6　持續、輟學、遺忘、回訪

- [Jordan 2014, Initial Trends in Enrolment and Completion of MOOCs](https://files.eric.ed.gov/fulltext/EJ1024344.pdf) — 一手，IRRODL
- [Reich & Ruipérez-Valiente 2019, The MOOC pivot](https://dspace.mit.edu/entities/publication/a06dc1d8-2d0e-4106-ae87-a09df222f032) — 一手，Science；二手：[Inside Higher Ed 報導](https://www.insidehighered.com/digital-learning/article/2019/01/16/study-offers-data-show-moocs-didnt-achieve-their-goals)
- [Kizilcec 等 2020, Scaling up behavioral science interventions in online education](https://www.pnas.org/doi/10.1073/pnas.1921417117) — 一手，預先註冊，PNAS
- [Yeomans & Reich 2017, Planning Prompts Increase and Forecast Course Completion in MOOCs](https://dl.acm.org/doi/10.1145/3027385.3027416) — 一手，LAK
- [Baker, Evans & Dee 2016, A Randomized Experiment Testing the Efficacy of a Scheduling Nudge in a MOOC](https://files.eric.ed.gov/fulltext/EJ1194402.pdf) — 一手，AERA Open
- [Patterson 2018, Can behavioral tools improve online student outcomes?](https://gwern.net/doc/psychology/personality/conscientiousness/2018-patterson.pdf) — 一手，JEBO
- [Kizilcec, Pérez-Sanagustín & Maldonado 2017, Self-regulated learning strategies predict learner behavior and goal attainment in MOOCs](https://www.sciencedirect.com/science/article/pii/S0360131516301798) — 一手，Computers & Education
- [L@S 2022, How Much and for Whom? A Multi-Wave Study of the Impact of Self-Regulated Learning Scaffolds on MOOC Student Academic Performance](https://dl.acm.org/doi/10.1145/3491140.3528312) — 一手，三波隨機實驗
- [A meta-analysis of the efficacy of self-regulated learning interventions on academic achievement in online and blended environments（2022）](https://www.tandfonline.com/doi/full/10.1080/0144929X.2022.2151935) — 統合分析，Behaviour & Information Technology（第二輪新增）
- [Sun 等 2021, The Effects of ALEKS on Mathematics Learning in K-12 and Higher Education: A Meta-Analysis](https://www.tandfonline.com/doi/full/10.1080/19477503.2021.1926194) — 統合分析；**只讀到摘要**（第二輪新增）
- [Huang, Jew & Qi 2023, Take a MOOC and then drop: A systematic review](https://pmc.ncbi.nlm.nih.gov/articles/PMC10133660/) — 系統性回顧，Heliyon
- [Custers 2010, Long-term retention of basic science knowledge: a review study](https://link.springer.com/article/10.1007/s10459-008-9101-y) — 綜述
- [Adar, Teevan & Dumais 2008, Large Scale Analysis of Web Revisitation Patterns](http://csail.mit.edu/~teevan/work/publications/papers/chi08.pdf) — 一手，CHI
- [渡邉文枝・向後千春 2017，JMOOC の講座における e ラーニングと相互評価に関連する学習者特性が学習継続意欲と講座評価に及ぼす影響](https://www.jstage.jst.go.jp/article/jjet/advpub/0/advpub_40100/_pdf/-char/ja) — 一手（問卷），日本教育工学会論文誌
- [郭文忠等 2021，针对 MOOC 高辍学率现象的分析及建议](https://ccds.fzu.edu.cn/jxcgj/papers/paper20.pdf) — 論述，高等理科教育
- [钱静，提高中国学习者慕课完成率的心理学研究](https://www.tsinghua.edu.cn/info/1666/70228.htm) — 研究者說明文（清華大學網站）

### 本站材料（只讀）

- `.agents/skills/series-curriculum-design/SKILL.md`、`.agents/skills/post/references/course-guide-contract.md`
- `src/lib/english-speaking.ts`（`scheduleReview`、`selectSession`）、`src/pages/posts/[...slug].astro`（系列上下篇導覽）
- `src/content/posts/learning/2026-08-04-learning-how-to-learn.md`（分散練習、交錯練習兩節）

---

## 讀取完整度盤點

第二輪（2026-10-13）補讀後的狀態。三級的意思：

- ✅＝取得全文，且讀了方法、結果、限制（或綜述的對應章節）。「讀到哪」欄寫實際讀的部分；沒有任何一篇是逐字讀完全文加附錄的。
- 🟡＝全文或正文在手上，但只讀了一部分；欄內寫明缺哪一段。
- 🔴＝只有摘要、只有二手報導、或沒讀。**依主持人規則，🔴 的來源不能列進文章的參考資料，也不能拿它的數字當依據。**

| 來源 | 讀到什麼程度 | 阻礙／備註 |
|---|---|---|
| Mawson & Kang 2025 | ✅ 全文讀到結論，略過參考文獻與附錄 | 無 |
| Latimier 等 2021 | ✅ 摘要、前言、討論 | 方法節沒細讀 |
| Murray 等 2025（第二輪新增） | ✅ 摘要、討論（含各子集結果與出版偏誤） | 作者網頁 PDF |
| Lindsey 等 2014 | ✅ 摘要、方法、結果、討論、附錄前段 | t 值在 PDF 轉文字後錯位，只用百分比與 d |
| Greving & Richter 2019 | ✅ 方法、結果（回想）、討論（第二輪補） | 理解測驗的係數表只看到開頭 |
| 義大利小學 2025 | ✅ 方法、結果、限制（第二輪補） | 作者名與期刊名沒從原文核對，引用前補書目 |
| Rohrer 等 2020（RCT） | ✅ 摘要、結果、討論 | 無 |
| Brunmair & Richter 2019 | ✅ 摘要、討論前半 | 無 |
| Firth 等 2021 | ✅ 全文經 Exa 取得（開放取用）；讀摘要、討論、限制（第二輪補） | 統合結果表沒逐列讀 |
| Trumble 等 2024 | ✅ 摘要、討論、限制、結論（第二輪補） | 無 |
| 健康專業間隔式數位教育統合 2024（PMC11502984） | ✅ 方法尾、知識保留結果、討論 | 抓回的文字沒有作者與期刊欄，引用前補書目 |
| Kerfoot 等 2007 | ✅ 摘要、討論 | 無 |
| Donoghue & Hattie 2021 | ✅ 摘要、討論；查了分散練習的表格列 | 無 |
| Carvalho 等 2020 | ✅ 結果、討論、方法開頭 | 無 |
| Davis 等 2018（LAK 版；期刊版讀了摘要與實務重點，內容一致） | ✅ 摘要、系統、設計、結果、結論 | 無 |
| Matuschak & Nielsen 2019（ttft） | ✅ Part I 兩節逐字讀；其餘各節沒讀 | 無 |
| Timeful Texts；Matuschak 公開筆記 15 則；Bernhardt HN 留言；Duolingo 部落格 | ✅ 各自全文 | 實務者自報 |
| Settles & Meeder 2016 | ✅ 摘要、兩個使用者實驗、Table 4、結論（第二輪補） | 模型推導沒讀 |
| Kovacs 2016 | ✅ 資料、方法、限制、seek 分析（第二輪補） | 後半沒讀 |
| Doroudi 等 2019 | ✅ 摘要、納入標準、Table 2、相依內容與活動類型兩群、5.3、第 6 節（第二輪補） | 17 萬字元沒全讀；歷史敘述略過 |
| Fang 等 2019 | ✅ 方法、討論前段 | 未確認取回是否完整 |
| Baroody 等 2022 | ✅ 方法、結果、方法學討論、結論（第二輪補） | 無 |
| Gouvea 2019 | ✅ 全文（第二輪補） | 二手評介，非原始研究 |
| Ireland & Mouthaan 2020 | ✅ 應用、優缺點、結論三節（第二輪補） | 概念性綜述 |
| Maltagliati 等 2023 | ✅ 方法、結果、限制（第二輪補） | 無 |
| Yang 等 2023 | ✅ 摘要、總討論前半 | 無 |
| Prinz 等 2020 | ✅ 結果、討論前半 | 無 |
| Yan 等 2016 | ✅ 前言片段、總討論 | 無 |
| Deslauriers 等 2019 | ✅ 方法、結果（第二輪補） | 無 |
| Macaluso 等 2022 | ✅ 研究一受試者與結果、討論與限制片段（第二輪補） | 研究二的學習成績段沒找到，只有摘要的一句 |
| Rozenblit & Keil 2002 | ✅ 全文經 Jina 取得；讀摘要、研究一結果、研究 1–6 總討論 | 研究 7–12 沒讀 |
| Scheiter & Gerjets 2007 | ✅ 中段四節（先備知識等） | Keenable 的 50k 視窗不含開頭與結尾；Springer 付費 |
| 2022 影片 learner control | ✅ 方法、結果、限制（第二輪補） | 作者名沒從原文核對 |
| Mullaney & Reich 2015 | ✅ 前言片段、結論 | 無 |
| Helsinki Deadlines 2020 | ✅ 資料、指標、結論、限制（第二輪補） | 作者名沒從原文核對 |
| Jordan 2014 | ✅ 摘要、完成率節 | 無 |
| Reich & Ruipérez-Valiente 2019 | ✅ 後印本正文全讀（第二輪經 Exa 從 ResearchGate 取得） | 各年完成率數值只在圖裡 |
| Kizilcec 等 2020 | ✅ 讀到 Materials and Methods 開頭 | 無 |
| Yeomans & Reich 2017 | ✅ 前言、總討論 | 無 |
| Baker 等 2016 | ✅ 摘要、結論、附錄信件 | 無 |
| Patterson 2018 | ✅ 摘要、結論 | 樣本數沒核對清楚 |
| Kizilcec 等 2017（C&E） | ✅ 接受稿的樣本、RQ1 結果、討論（第二輪補） | 50k 截斷，RQ2–3 的細節沒讀全 |
| L@S 2022 SRL 鷹架 | ✅ 設計、結果、討論（第二輪補） | Keenable 取回 15k，圖表缺 |
| 渡邉・向後 2017 | ✅ 方法、結果摘要、結論（第二輪補） | 無 |
| 本站 skill、程式、文章 | ✅ | 無 |
| Rohrer 等 2020（教科書） | 🟡 摘要、背景、限制、Saxon 例外段；**抽樣與編碼方法段沒找到** | 我沒找到；PDF 轉文字沒有清楚的節標 |
| PATHOS 2026 | 🟡 摘要、程序、效度威脅；**結果統計段沒找到，分析樣本數沒讀清楚** | 雙欄 PDF 轉文字後段落交錯 |
| Dringoli 等 2021 | 🟡 方法片段、結論 | 雙欄 PDF 交錯；arXiv 預印本 |
| Anki 回顧 2026 | 🟡 方法、結果前半；限制節沒讀 | 我沒讀完 |
| 線上 SRL 介入統合 2022（第二輪新增） | 🟡 摘要、整體結果；調節變項與出版偏誤沒讀 | Keenable 截在 50k |
| Guo & Reinecke 2014 | 🟡 摘要、發現條列、樣本表、指標定義；結果節沒讀到 | 雙欄 PDF 交錯，我沒找到對的段落 |
| Adar 等 2008 | 🟡 摘要、資料與方法；四種回訪型態的結果沒讀到 | 同上；且不是學習內容 |
| Kizilcec 等 2017（Science；第二輪新增） | 🟡 PDF 已存，只讀到前言 | 雙欄 PDF 交錯 |
| 钱静（清華） | 🟡 設計、結果、討論（第二輪補）；非同儕審查 | 研究者說明文 |
| 郭文忠等 2021 | 🟡 摘要與引言 | 論述文，沒再讀 |
| Huang 等 2023 | 🟡 摘要、因素一節開頭、限制 | 我沒讀完；結論沒用到它 |
| Cosyn 等 2021 | 🟡 摘要、討論（第二輪補） | 是系統描述，不是成效研究；結論沒用到 |
| Math Academy Pedagogy 頁 | 🟡 間隔與 layering 兩段 | 公司自述 |
| Carpenter 等 2022 | 🔴 只讀摘要與前言 | 全文在手上，我沒讀正文；引其內容前要補 |
| Karich 等 2014 | 🔴 只有摘要＋EdWeek 二手報導 | SAGE 付費牆；ERIC、Exa、Unpaywall、作者機構頁各試一輪都只有摘要 |
| Landers & Reddock 2017 | 🔴（結果）前言、框架、搜尋與納入條件讀了；**結果只到結構式摘要** | Springer 付費；Keenable 50k 視窗剛好截在結果前；Exa 只回摘要 |
| Lyle 等 2020 | 🔴 只有摘要（另讀了同團隊 2018 ASEE 海報的摘要） | Springer 付費 |
| Custers 2010 | 🔴 只有摘要 | Springer 付費；Ovid 頁抓回的不是正文 |
| 醫學教育 SR 統合 2026 | 🔴 只有 PubMed 摘要 | Wiley 擋，Exa 逾時 |
| Zengilowski 等 2025（L@S） | 🔴 只有摘要 | ACM 付費牆；Keenable 只回摘要與參考文獻；沒找到作者自存版 |
| Sun 等 2021（ALEKS） | 🔴 只有摘要 | Taylor & Francis 付費 |
| Harris 等 2021 | 🔴 只有參考文獻 | Springer 付費 |
| Inside Higher Ed 2019、EdWeek 2014、國教院電子報 179 期 | 🔴 二手報導或彙編（讀了） | 只用來指路 |
| 華藝「磨課師持續使用意願」 | 🔴 只有摘要 | 全文需登入 |
| Davis 等 2016（EC-TEL） | 🟡 第三輪取得全文（共同作者 Hauff 的網頁，14 頁，存 `q4/davis2016-ectel-retrieval-planning.txt`）；只讀摘要 | 待精讀 |
| Bego 等 2024（九門 STEM 入門課的間隔提取；第三輪新增） | 🟡 開放取用全文存 `q4/`；只讀摘要 | 與 Lyle 2020 同一團隊，待精讀 |
| Lyle 等 2022（微積分的間隔提取；第三輪新增） | 🟡 開放取用全文存 `q4/`；只讀摘要 | 同上 |
| The Math Academy Way；Matuschak「Log: Quantum Country analysis」；Matuschak「29%」筆記 | 🔴 沒讀（前兩者已存，第三個 404） | 決定不用，結論沒依賴它們 |

合計（第三輪後）：✅ 45 列；🟡 16 列；🔴 12 列。第二輪後是 45／13／13，第一輪是 26／37／8。第三輪新增的三列都是「全文在手、只讀摘要」。

第二輪重試被擋來源的結果：取到全文的有 Reich 2019（正文）、Firth 2021、Rozenblit & Keil 2002、Murray 2025、Kizilcec 2017 Science（PDF，未讀完）；仍只有摘要的有 Karich 2014、Landers 2017（結果節）、Lyle 2020、Custers 2010、醫學教育統合 2026、Zengilowski 2025、Sun 2021、Harris 2021。試過的管道：Exa `web_fetch_exa`（不帶 query）、Unpaywall、Keenable、r.jina.ai、Ovid 頁、ERIC、作者或機構頁、搜尋預印本。沒試的：OSF 站內搜尋（Unpaywall 都回 closed 後沒再逐一查）、直接寫信給作者。

**依賴 🔴 來源的說法，一律已在事實表標「不可當依據」，並在各篇骨架降強度或改寫。** 清單見文末〈第二輪補讀後改變的結論〉。

---

## 事實交叉表

只放來源說了什麼。數字後面括號是對照條件。

### 子問題 1　間隔與交錯在真實課程

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 只納入真實課堂、課程相關教材、間隔至少一天的研究後，分散對集中的效果 d = 0.54，95% CI [0.31, 0.77]（22 份報告、31 個效果量、N > 3000；檢索到 2023 年 6 月；I² = 92%） | Mawson & Kang 2025 | — | ✅ 單一來源（統合分析） |
| 同一技術混入實驗室研究時的估計是 d = 0.85 | Donoghue & Hattie 2021 表格（該列另有 150 與 152,952 兩個數字，欄名未核對） | Mawson & Kang 2025 轉引同一數字 | ✅ |
| Mawson & Kang 的全文篩選排除了近九成研究，最常見理由是設計脫離課堂情境；另有一批自稱分散練習的研究其實沒有重複接觸同一內容 | Mawson & Kang 2025 | — | ✅ 單一來源 |
| 該統合中閱讀領域的估計是 −0.11 [−0.42, 0.21]；小學場域的負向與不顯著效果最多；沒有任何研究的保留間隔超過 42 天；沒有任何研究讓學習者自己決定要不要分散 | Mawson & Kang 2025 | — | ✅ 單一來源 |
| 再接觸次數較少（三次以內）的研究效果較大；再接觸很多次的研究效果較小（作者標明是質性觀察，沒有統計檢定） | Mawson & Kang 2025 | — | ✅ 單一來源，作者自己標為未經量化驗證 |
| Donoghue & Hattie 的多數研究量的是事實性的表層學習、幾乎立即測、只測近遷移 | Donoghue & Hattie 2021 | — | ✅ 單一來源 |
| 間隔提取對集中提取：原始 g = 1.01 [0.68, 1.34]，有出版偏誤證據，trim-and-fill 校正後 g = 0.74 [0.55, 0.91]（11 個研究、39 個比較） | Latimier 等 2021 | — | ✅ 單一來源 |
| 漸增間隔對等距間隔：g = 0.034 [−0.10, 0.17]，不顯著（16 個研究、54 個比較）；作者說這與「間隔應該逐步拉長」的普遍看法不符 | Latimier 等 2021 | Mawson & Kang 2025（漸增間隔的效果量「偏小，有一個是負的」，但多數出自同一研究程序） | ✅ 方向一致 |
| 數學領域的間隔對集中：整體 g = 0.28（27 個研究、53 個效果量）；嵌在課程裡的 g = 0.24（17 個研究、26 個效果量），單獨教一段教材的 g = 0.43（較大但較不穩）；作者說比第二語言學習的估計（g = 0.80）小。數學裡提取對重學 g = 0.18，95% 信賴區間跨零，作者稱不穩健（7 個研究）。預先註冊 | Murray 等 2025（Educational Psychology Review；摘要、討論已讀） | Mawson & Kang 2025（數學 0.46 [0.09, 0.84]，但部分研究把間隔與交錯混在一起） | ✅ 方向一致，量值不同（納入條件不同） |
| 八年級西班牙語一學期（179 人，題目在受試者內隨機分給三種排程）：學期結束 28 天後的累積測驗，個人化間隔比集中多 16.5%、比一體適用的間隔多 10.0%；複習每週約 30 分鐘，約佔課程時間 10%；「集中」條件本身已分散在至少 6 天 | Lindsey 等 2014 | — | ✅ 單一來源 |
| 工程學生的微積分先修課，受試者內交叉「練習量 × 間隔」：跨學期（4 週後）的保留只受間隔影響，不受練習量影響 | Lyle 等 2020 [摘要層級；期刊全文付費牆] | 同團隊 2018 ASEE 海報 [摘要層級]（一個月後的保留：間隔有效、增加題數無顯著效果） | ⚠️ 兩處都只讀到摘要，**不可列入參考資料、不可當依據** |
| 德國七年級 191 人（八個班，個人層級隨機分派，預先註冊）重讀一篇 977 字的細菌細胞說明文，立即重讀或一週後重讀，4 分鐘後或一週後測；缺課後進分析的有 145 人。自由回想：集中組從 3.86 降到 1.79（降 50%），分散組 2.56 對 2.34（降 10%，不顯著）；短延遲時集中較好（p = .004）；一週後分散 2.34 對集中 1.79，差異不顯著（p = .297）。作者結論：一週後兩組持平，沒有出現預期的分散優勢；分散組讀得較慢、預期自己學得較差 | Greving & Richter 2019（方法、結果、討論已讀） | Mawson & Kang 2025（閱讀領域估計 −0.11） | ✅ 方向一致 |
| 同一篇的討論：課文的「集中重讀」本來就隔了整篇文章才回到同一句，嚴格定義的集中練習在實驗室外不存在；真實情境的研究比的其實是間隔長短（lag），不是有沒有間隔 | Greving & Richter 2019 | Lindsey 等 2014（其「集中」條件已分散在至少 6 天）；義大利小學 2025（兩個條件都有間隔） | ✅ 三處說法一致 |
| 義大利小五兩個班（15 與 18 人，各階段進分析的只有 25–27 人；班級層級指派，後兩階段未對調）學古代史短文：隔 4 天做填空提取 67.0% 對隔 1 天重讀 48.6%；同樣隔 1 天時提取 67.7% 對重讀 41.3%；同樣做提取時隔 4 天 45.9% 對隔 1 天 44.6%（F < 1）。作者自列限制：樣本小、未完全對調、有老師在場監督 | 義大利小學 2025（方法、結果、限制已讀） | — | ✅ 單一來源，樣本很小；間隔的對比只是 1 天對 4 天 |
| 醫學系三年級學生隨機分派，四個泌尿科主題中兩個每週收一封電郵題：95/133（71%）完成學年末測驗；收信主題的保留較好，對完成輪訓 6–8 個月與 9–11 個月者效果量 1.01 與 0.73；作者說研究沒控制兩組花的時間 | Kerfoot 等 2007 | — | ✅ 單一來源 |
| 健康專業的間隔式線上教育統合：23 個研究（19 個 RCT）；知識保留的合併估計 SMD 0.38 [0.10, 0.65]，只來自 2 個研究（其中一個是 2 年後追蹤 SMD 0.34）；沒有任何研究說明間隔長度的選擇理由；多數用電郵遞送 | 間隔式數位教育統合 2024（PMC11502984） | — | ✅ 單一來源 |
| 健康專業教育的分散與提取練習系統性回顧：63 個實驗中 43 個顯示顯著好處；異質性太高沒做統合；多數研究沒報告兩組的學習時間；作者自己提醒這種「幾個顯著」的摘要過於簡化，不能單獨當證據 | Trumble 等 2024（摘要、討論、限制、結論已讀） | — | ✅ 單一來源 |
| 醫學教育間隔重複統合：13 個研究、21,415 人，SMD 0.78 [0.56, 0.99] | The Clinical Teacher 2026 [摘要層級；Wiley 擋，Exa 逾時] | — | ⚠️ 只讀摘要，**不可列入參考資料、不可當依據** |
| Anki 與醫學生成績的系統性回顧：11 個研究、1,135 人，橫斷 5、前瞻世代 3、準實驗 2、混合方法 1，沒有隨機實驗；Anki 用量的定義各研究不同，異質性太大無法做統合；回顧本身未事先註冊 | Anki 回顧 2026（方法、結果前半已讀；限制節沒讀） | — | ✅ 單一來源 |
| 交錯對區塊的整體效果 g = 0.42（59 個研究、238 個效果量）；畫作 0.67；數學題 0.34；說明文與味覺不顯著；字詞 −0.39 | Brunmair & Richter 2019 | Firth 等 2021（全文已讀摘要、討論：26 個研究，效果量最高到 0.65；幾乎全是實驗室裡的大學生、短期、以視覺材料為主；有教育意義的延宕間隔很少，最長也只是幾天） | ✅ |
| 七年級數學 54 個班、15 位老師，四個月內交錯或區塊作業，一個月後無預警測驗：61% 對 38%，d = 0.83 [0.68, 0.97]；15 位老師各自的效果都是正的 | Rohrer 等 2020 | — | ✅ 單一來源（預先註冊叢集 RCT） |
| 同一研究的但書：每位老師都回報交錯作業花較多時間，研究沒量時間；學生有拿到詳解並訂正；交錯組很可能先從老師那裡得到過一些區塊練習 | Rohrer 等 2020 | — | ✅ |
| 六本代表性數學教科書的 13,505 題裡，交錯的只有 9.7%；作者自列限制是沒算可書寫的練習本，也不知道老師有沒有另外給交錯作業。例外是 Saxon 系列：七年級那本有 1,491 題區塊、3,016 題交錯，但該系列已不在作者查得到的教科書採用清單上 | Rohrer 等 2020（教科書；摘要、背景、限制、例外段已讀，**抽樣與編碼方法段沒找到**） | — | ✅ 單一來源；方法細節未核對 |
| 經歷過交錯與區塊後，只有 13% 的受試者判斷交錯比較有效；讓他們看到自己的成績並說明理論仍不足以改變偏好，要到資訊最完整的條件才有 75% 改判 | Yan 等 2016 | Macaluso 等 2022 [摘要]（交錯感覺越費力、越不熟悉，學習者越覺得沒學到，也越不會再選） | ✅ |
| Coursera 心理學導論（2013），5,615 人同意資料使用：同一位學生在分較多次讀完的單元，小考成績較高（β = 0.10）；這個關係在期末成績較低與做較少嵌入活動的學生身上較強；作者說無法排除第三變項 | Carvalho 等 2020 | — | ✅ 單一來源（觀察） |
| edX 地球科學課，隨機分派是否收到自動推送的舊單元題目（處理組 523、對照組 524）：處理組只有 102 人至少互動一次；意向處理分析對成績與拿證書都不顯著；課後兩週的保留測驗 6.6 對 6.2（滿分 10，N = 20）不顯著 | Davis 等 2018 | — | ✅ 單一來源 |
| 同一研究：拿到證書的學習者對舊單元題目的答對率從第 2 週 67% 降到第 6 週 49%；選擇題有 69% 會作答，要自己算出數字再輸入的題目只有 41%；決定略過的中位時間 7 秒 | Davis 等 2018 | — | ✅ |

**衝突**：無直接矛盾。Mawson & Kang 在閱讀領域接近零、Greving & Richter 與義大利小學在重讀與短間隔上無效，這三者彼此一致，但和「分散練習穩定有效」的總括說法不一致；差別在學什麼與怎麼再接觸，不是研究品質高低。

### 子問題 2　把複習嵌進內容

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| Quantum Country 第一篇有 112 個嵌在正文裡的題目；讀完幾天後寄電郵請讀者回來複習；答對就把間隔往上調（文內 → 5 天 → 2 週 → 1 個月 …），五次答對後到 4 個月，答錯降一級 | Matuschak & Nielsen 2019 | Timeful Texts 2019 | ✅（同一組作者） |
| 做完六輪複習的讀者，平均每題約 54 天的「已證明保留」；六輪複習約花 95 分鐘，文章約 4 小時讀完，作者估計時間成本不到五成 | Matuschak & Nielsen 2019 | Matuschak 筆記（35–50% overhead；90 分鐘） | ✅（作者自報，兩處數字略有出入：95 與 90 分鐘） |
| 上線六個月後，有 195 位使用者對八成以上的卡片達到一個月的保留；作者自己說這些數字要打折看 | Matuschak & Nielsen 2019 | — | ✅ 單一來源；**沒有分母**（讀過文章的總人數未公布） |
| 非正式實驗：8 張卡片對一部分人延後兩週複習。延後組（25 人）正確率 91% → 87%；正常複習組（16 人）89% → 96%；延後組四成的人退步，正常組沒有人退步；讀者仍在複習其他有重疊內容的卡片 | Matuschak & Nielsen 2019 | Matuschak 筆記（2019 efficacy experiment） | ✅（同一作者；樣本 41 人） |
| 作者自己列的四個主張與證據狀態：照做會記得（強）、不做會忘（開始有）、時間成本不高（中等）、能推廣到其他領域（**沒有證據**） | Matuschak 筆記「Effects of the mnemonic medium on reader memory」 | — | ✅ 單一來源 |
| 拿掉文內題目與複習、一個月後才第一次問：最難的兩題回想率 42%，有文內作答與補課複習的是 71% 與 68%；最簡單的一題是 89% 對 91%。跨兩個不同時期的實驗比較，作者自己說不是乾淨的對照 | Matuschak 筆記「In-essay prompts boost performance」 | — | ✅ 單一來源，作者標明限制 |
| 第一次複習排得越晚，忘掉後隔天補課也越難救回來（初次就答錯的題目：一週後忘、隔天又忘的佔 2%，兩個月後是 16%）；作者標「sketchy」 | Matuschak 筆記「less likely to recover」 | — | ✅ 單一來源，作者標為初步 |
| 作者認為這個做法在「成熟領域的線性入門」行得通，因為讀者願意照作者定的重點背；用到非技術文章時讀者回報「像作業」「有壓力」「被考試」，作者稱原設計「authoritarian」，主張改成讀者自己挑題 | Matuschak 筆記（linear primers；non-technical texts；reader control） | — | ✅ 單一來源（附讀者原話） |
| Quantum Country 的讀者多半出於好奇，沒有要用到的情境；作者在 2021 年找出 106 位做過 30 次以上複習、跨 270 天以上的使用者去問「所以呢」 | Matuschak 筆記「big-picture impact」 | — | ✅ 單一來源 |
| 作者自己列的採用障礙：養成每天複習的習慣很吃力；好處不會很快顯現；複習讓人覺得自己記性比實際差；沒有新題目進來時複習變得無聊 | Matuschak 筆記「Mnemonic medium」總表與「onerous habit」 | — | ✅ 單一來源 |
| Execute Program：第一天給 5 課就停，隔天先複習再給新課，無法一次刷完；課程從開始到結束的中位時間 8–18 天；長期使用者說強制間隔讓他們確認自己前一天真的懂了，也少了「今天該多做一點」的焦慮；偶有新使用者來信抱怨不能一天讀完 | Bernhardt HN 留言 2021 | Matuschak 筆記（先備課的複習通過後才解鎖下一課；課文假設讀者記得先前內容） | ✅（創辦人自報＋第三者描述機制） |
| Duolingo 把排程模型從 Leitner 換成 half-life regression 的線上實驗（六週、近一百萬人）：每日回訪整體 +0.3%、新課 +0.3%，練習 −7.3%（顯著）。第二個實驗（兩週、330 萬人）拿掉詞彙特徵後：整體 +12.0%、新課 +1.7%、練習 +9.5%（皆顯著）。量的是隔天有沒有回來，不是學到多少 | Settles & Meeder 2016 | — | ✅ 單一來源（公司員工發表於 ACL） |
| Duolingo 自報：連續紀錄 7 天以上的有 600 多萬人；改了延續紀錄時的動畫後，新使用者第 7 天還在用的機率 +1.7% | Duolingo 部落格 | — | ✅ 單一來源（公司自報，無方法細節） |
| Coursera 機器學習課：有影片內小考的影片，74% 的觀看者會作答；常見行為是看到題目後、作答前往回拖去找答案 | Kovacs 2016 [前言條列] | Guo & Reinecke 2014（拿證書者常從評量題往回跳到先前的講解） | ✅ 方向一致 |

### 子問題 3　順序

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 用強化學習決定教學順序的對照實驗共 41 個：21 個顯著勝過基準、4 個有適性交互作用、4 個混合、11 個不顯著、1 個顯著較差 | Doroudi 等 2019，Table 2 | — | ✅ 單一來源 |
| 按任務類型拆：配對聯想（字詞類）14 個裡 11 個顯著；**排「彼此相依的內容」的 8 個裡 0 個顯著**（2 個混合、6 個不顯著） | Doroudi 等 2019，Table 2 | — | ✅ 單一來源 |
| 作者的結論：演算法排序在受認知心理學理論約束時最成功；作者自己在分數教學系統做的兩個實驗都沒有顯著差異 | Doroudi 等 2019 | — | ✅ |
| 顯著或有適性交互作用的 24 個研究裡，17 個（71%）比的是隨機順序或其他表現不明的演算法，不是當時最好的做法；作者說這表示「順序有差」，但看不出演算法是否勝過依學習理論與專家排的順序 | Doroudi 等 2019，5.3 節 | — | ✅ 單一來源 |
| 該回顧裡唯一比較「完全由學習者決定順序」的研究（Atkinson 1972）：學習者自選比隨機好 53%，演算法比隨機好 108% | Doroudi 等 2019 轉述 | — | ⚠️ 轉引，未讀 Atkinson 原文 |
| ALEKS（以知識空間理論排「下一個可學的題目」）對其他教學方式：15 個研究、24 個樣本，隨機效果模型下與零無顯著差異；固定效果模型 g = 0.08（p = .02） | Fang 等 2019 | Sun 等 2021 [摘要層級]（33 個研究、56 個效果量、9,238 人，g = 0.05 [−0.01, 0.20]；當補充教材用時 0.43）——**只讀摘要，不可當依據** | ✅（以 Fang 為準） |
| 幼兒數學的假設性學習軌道（HLT）十個隨機實驗：檢驗「一級一級教比直接教目標好」的 7 個裡 4 個支持，另 3 個（未發表）作者歸因於方法問題；檢驗「同樣的活動，照軌道排比不排好」的 3 個裡只有 1 個支持，另 2 個兩組都有進步但無差別（其中一個把樣本加到三倍仍無差別）。作者結論：整體支持，但軌道法只跟所用的那條軌道一樣好，有些層級只是「有幫助」而不是必要先備 | Baroody 等 2022（方法、結果、方法學討論、結論已讀） | Gouvea 2019（評介三篇：學習進程是待驗證的模型；Alonzo 與 Elby 指出「層級」與資料不合，老師實際用的是逐題資料而非層級） | ✅ 方向一致 |
| 螺旋式課程源自 Bruner 以物理科學的知識結構為藍本；Bruner 原書沒有提出它有效的證據，評估螺旋課程成效的文獻很少，作者認為它多半是沒經檢驗就被接受的；批評包括每次都講得淺、會的人被迫重複、兩次造訪隔太久時累積複習不足，以及不適合結構鬆散的領域 | Ireland & Mouthaan 2020（應用、優缺點、結論三節已讀；概念性綜述，非系統性回顧） | — | ✅ 單一來源 |
| 亞利桑那大學醫學院把螺旋複習做成 500 題、32 次強制到場的課堂測驗：沒經歷過的兩屆預期它有幫助的評分是 8.2／10，實際經歷的一屆給 5.0；三屆的 USMLE Step 1 班平均 224、229、227，無顯著差異；問卷回收率 32–45%。作者自列限制：單一學校、各屆基線與課程長度不同（24 對 18 個月），無法判斷對成績的影響；該屆學生的意見是寧可自己安排、不要強制到場 | Maltagliati 等 2023（方法、結果、限制已讀） | — | ✅ 單一來源；歷史對照，非實驗 |
| 大一電磁學線上作業平台、兩年約 1,500 位學生：先看概念內容的組解題進步大於先看理論的組（p < .05，三種算法一致），先看例題的居中、不顯著；另有 111 人的問卷顯示教師與學生偏好的順序不同 | Dringoli 等 2021（arXiv v2 預印本；方法片段、結論已讀；摘要寫「超過 1,500」、結論寫「接近 1,500」） | — | ⚠️ 預印本，未確認是否經同儕審查；結果節沒讀全 |
| 大學 AI 課教擴散模型，預先註冊 RCT：照先備結構與認知負荷排出的順序，對照「照該領域研究發展的先後」的順序，第一份教材後當場監考測驗 d = 0.32（p = .011，**預先註冊的單尾檢定**），自評的內在與外在認知負荷都較低。作者自列限制：單一課程、單一學校、樣本以男性為主、只有一個主題 | PATHOS 2026（ICER；摘要、程序、效度威脅已讀；摘要寫 N = 209，程序段另有「224 人分到對照教材」，**分析樣本的定義沒讀清楚，結果統計段沒找到**） | — | ✅ 單一來源；樣本數待核對 |

### 子問題 4　判斷自己懂了沒

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 讀者判斷「哪篇懂得比較好」與實際測驗成績的個人內相關：沒有介入時加權平均 0.178 [0.155, 0.200]（115 個研究、502 個效果量、15,889 人）；作者換算約等於 54.5% 的判斷正確率；校正測量信度後約 0.312，換算 58% | Yang 等 2023 | Prinz 等 2020（對照條件 r = .14 [.09, .20]，k = 26） | ✅ |
| 介入能改善這個相關：整體 g = 0.46 [0.33, 0.60]，介入條件 r = .41；trim-and-fill 後 0.41。效果最大的是讓讀者預期會被考理解題；延後寫摘要（中）、延後補完圖表（中到大）有效；重讀與延後列關鍵詞是小到中；自我解釋不顯著（只有 2 個研究） | Prinz 等 2020 | Yang 等 2023（延後寫摘要、延後列關鍵詞有效；練習測驗能改善判斷準確度；介入可疊加） | ✅ |
| 理解得越好，判斷也越準（測驗成績與判斷準確度正相關） | Yang 等 2023 | Prinz 等 2020 早先以文本難度指標沒找到這個關係（Yang 等指出兩者指標不同） | ❌ conflict（Yang 等認為成績是較敏感的指標；未解） |
| 人覺得自己對複雜現象的理解比實際精確、深入；這個錯覺在解釋性知識上遠強於事實、程序或敘事，在機制看得見的東西上最穩固（摘要原話）。研究一：被要求實際寫出解釋、回答診斷題、對照專家說明後，幾乎所有受試者的自評都下降（時間主效果 F(4, 56) = 16.2，p < .001） | Rozenblit & Keil 2002（全文已取得；摘要、研究一結果、研究 1–6 總討論已讀，共 12 個研究只讀了前段） | — | ✅ 單一來源 |
| 哈佛大一物理兩個學期（選課 65 與 92 人），隨機分組、交叉設計、同一份教材：主動學習那堂課後，學生自評「學到多少」低 0.56 個標準差，當堂測驗卻高 0.46 個標準差（皆 p < .001）；量的是單堂課結束當下，不是延宕保留 | Deslauriers 等 2019（方法、結果已讀） | Yan 等 2016；Macaluso 等 2022（研究一 328 位大學生：76.6% 選擇之後用區塊；交錯被評為較費力 d = 0.55、學得較少 d = −0.47、較不熟悉 d = −0.45） | ✅ 方向一致 |
| 有效的學習方法被學習者少用，原因包括錯誤信念、不知道、方法本身違反直覺 | Carpenter 等 2022 [摘要與前言；正文沒讀] | Yan 等 2016；Macaluso 等 2022 | ✅（以後兩篇為準；Carpenter 只能當領域綜述的指路，引其內容前要補讀） |
| 七年級 1,005 人、線上數學練習平台、預先註冊 RCT：在看提示前先請學生反思自己目前懂多少，對提示使用、重做、練習表現、後測都沒有影響，高低先備知識者皆然 | Zengilowski 等 2025（L@S）[摘要層級；ACM 付費牆，Keenable 只回摘要與參考文獻] | — | ⚠️ 只讀摘要，**不可列入參考資料、不可當依據**；值得設法取全文 |

### 子問題 5　讓讀者自己選

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 教育科技中給學習者控制權的整體效果 g = 0.05（18 個研究、29 個效果量，1996–2012）；多數特徵與情境下也接近零 | Karich 等 2014 [摘要層級；SAGE 付費牆，ERIC、Exa、Unpaywall 都只有摘要] | EdWeek 2014 報導（二手） | ⚠️ 只讀摘要與二手報導，**不可列入參考資料、不可當依據** |
| 成人網路教學的學習者控制統合（62 個獨立樣本、97 個效果量，約三成未發表）：摘要列的發現是各類控制在實驗裡幾乎總是混在一起；它不是一個多維構念而是一組相關的設計選擇；對技能訓練普遍有效，對知識訓練與學員反應則差異很大；只有「順序控制」是各情境下大致不傷學習也不傷反應的一種 | Landers & Reddock 2017 [前言、框架、文獻搜尋與納入條件已讀；**結果節被截斷，發現只來自結構式摘要**] | Scheiter & Gerjets 2007（把控制分成順序、內容選擇、表徵、步調） | ⚠️ 結論層面只到摘要，**數字與發現不可當依據**；定義與納入條件可引 |
| 超媒體研究的回顧：先備知識低的學習者導覽較困難、用較表面的策略、學習成果較差、需要較多支援（總覽、預排路徑、階層式結構）；先備知識高的不需要額外支援。引 Salmerón 等 2005：先備知識低者照高連貫的順序讀學得多，先備知識高者照低連貫的順序讀學得多。作者結論：學習者控制看來只適合先備知識高、自我調節能力好的學生，但還沒有明確的設計規則 | Scheiter & Gerjets 2007（中段四節已讀：先備知識、自我調節、認知風格、概念基礎；開頭與方法學批評沒讀到） | — | ✅ 單一來源（敘述性綜述，2007） |
| 中文系與新聞系 86 位大學生隨機分兩組（44 對 42）上四支統計教學影片：可自由決定順序、可跳過、可先做題的組，總分 33.31 對 31.11（滿分 40，p = .009），差異在較難的兩支；自由組多花約 18 分鐘（5,244 對 4,176 秒）。作者自列限制：看不出成績差異是不是單純因為多花時間 | 2022 影片 learner control 研究（方法、結果、限制已讀） | — | ✅ 單一來源，樣本小，時間未控制 |
| HarvardX 同一門課的兩個版本（分週釋出 對 一次全部釋出）：一次全釋出時「跟著建議進度走」的時間約少一半；成績、持續、參與幾乎沒有差別；跟上進度對拿證書有小幅正向關係。作者：「學生會用掉任何給他們的彈性」；每一週都有很大一部分訪客只看課程最前面的內容 | Mullaney & Reich 2015（自然實驗，非隨機） | — | ✅ 單一來源 |
| 四門 edX 課 140,546 人（2012 年秋）：拿到證書的人平均只看了 78% 的學習單元，完全略過 22%；常往回跳，而且從評量題跳回講解比從講解跳回講解常見 | Guo & Reinecke 2014 [摘要、發現條列、樣本表、指標定義已讀；**結果節與限制節沒讀到**] | Kovacs 2016（Coursera 機器學習課：從影片內小考往回拖的頻率是基準的 55 倍；拿證書者開始看一支影片後 79% 會答其中的小考，72% 會看完） | ✅ 方向一致；Guo 的數字出自摘要層 |
| 赫爾辛基大學同一門 Java 程式課的兩個版本（固定時程 3,546 人、自訂進度 4,693 人）：以第一週的投入衡量，固定時程版的學生之後繼續的機率是自訂進度版的 3.5 倍，差距幾乎延續到課程結束。作者自列限制：兩版評分規則不同；**學生是自己選版本的**；沒有成績資料，沒量學到多少；只有程式設計一個主題 | Helsinki Deadlines 2020（資料、指標、結論、限制已讀） | — | ✅ 單一來源；自選分組，非因果 |

**衝突**：2022 影片研究（N = 86）發現自由控制成績較好但多花時間；Scheiter & Gerjets 說取決於先備知識；Helsinki 與 Mullaney 顯示拿掉時程後持續率下降或持平；Karich 與 Landers 兩份統合的結論只讀到摘要，不能拿來裁決。這些也不是同一個「控制」：前兩個是內容內的導覽，後兩個是時程。列出，不選邊。

### 子問題 6　持續、輟學、遺忘、回訪

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 早期 MOOC 的完成率（拿到證書者佔註冊者）中位數 6.5%，範圍 0.9%–36.1%（39 門課）；與課程長度負相關；約 54% 的註冊者成為活躍學生 | Jordan 2014 | — | ✅ 單一來源 |
| HarvardX 與 MITx 2012–2018（565 個開課次、1,267 萬人次註冊、563 萬人）：52% 的註冊者從未進入課程內容；最大的一屆新學習者（2015–16 年，110 萬人）隔年只有 12% 再修一門；隔年留存率逐屆下降，從第一屆的 38% 到 2016–17 年那屆的 7%；完成率六年間「沒有動」 | Reich & Ruipérez-Valiente 2019（後印本正文已全讀，經 Exa 取得） | Baker 等 2016 的課：48% 看了第一支影片、9% 拿到證書 | ✅ |
| 同一資料的各年完成率數值（全體 2017–18 年 3.13%、付費驗證者 46%） | Inside Higher Ed 2019（二手；這些數字在原文只出現在圖 3，正文沒有寫出） | — | ⚠️ 只有二手報導，**不可當依據**；原文只支持「六年沒有改善」這句話 |
| 註冊時表示打算修完的人，實際修完的約 22%（HarvardX／MITx）；另一處寫約 20% | Yeomans & Reich 2017 | Kizilcec 等 2020 | ✅ |
| 三門課 2,053 人：開課時請學生寫修課計畫，完成率從 14% 升到 18%（+29%） | Yeomans & Reich 2017 | Kizilcec 等 2020 Table 1 | ✅ |
| 把同一批介入放大到 247 門課、269,169 人、兩年半（預先註冊）：長期計畫提示對原目標族群的完成率效果是 +0.19 與 −0.23 個百分點，皆不顯著；計畫類介入只提高第一週的活動量，第二週就減弱，對最終完成率測不到；作者說放大後平均效果可以小一個數量級 | Kizilcec 等 2020 | — | ✅ 單一來源（原作者群自己的複製） |
| 同一研究：價值連結寫作在「有全球落差的課」裡讓低度發展國家學生的完成率多 2.79 與 2.74 個百分點（先前小樣本研究報的是 24 個百分點）；在沒有落差的課裡反而少 1.62 與 1.71 個百分點；哪門課會有落差事前預測不出來（預測準確率 54.3%，與亂猜的 50% 無顯著差別）；機器學習的個人化指派 13.38% 對不介入 12.81%，不顯著 | Kizilcec 等 2020 | 钱静（清華）引述 2017 年 Science 的原始結果作為在學堂在線複製的動機 | ✅（钱静的複製結果沒讀到） |
| Coursera 一門課 18,043 人：開課第一天請學生排定看第一支影片的時間，對近期參與沒有效果，對較長期的參與、持續與成績有弱顯著的**負向**效果，集中在臨開課才註冊與用 .edu 信箱的人；作者說無法用既有理論解釋 | Baker 等 2016 | — | ✅ 單一來源 |
| 一門 MOOC 中自願安裝時間管理軟體的學生：能事先設定每天分心網站時間上限的承諾裝置，讓課程時間多 24%、成績高 0.29 個標準差、完成率多 11 個百分點（+40%）；每半小時跳提醒與可封鎖分心網站兩種工具與對照組無顯著差別 | Patterson 2018 | — | ✅ 單一來源；樣本是自願者 |
| 智利天主教大學在 Coursera 的六門西班牙語自訂進度課，4,831 人（問卷＋log）：目標設定每高 1 個標準差，拿到證書的勝算高 54%；求助每高 1 個標準差，勝算低 27%；自我調節高的人較常回頭看已完成的教材，尤其是評量。自陳量表，相關 | Kizilcec 等 2017（C&E 接受稿；樣本、結果 RQ1、討論已讀） | — | ✅ 單一來源（觀察） |
| 一般教育與醫學教育的回顧：課程知識一年後約保留三分之二到四分之三，再一年降到略低於一半 | Custers 2010 [摘要層級；Springer 付費牆] | Lindsey 等 2014 引 Custers（醫學生一年後忘 25–35%） | ⚠️ 只讀摘要，**不可列入參考資料、不可當依據** |
| 一門 edX 課結束兩週後的 10 題測驗：兩組合計只有 20 人作答，平均約 6.2–6.6 分；作者據此說「約三分之二的課程知識被保留」，通過與未通過課程者相近 | Davis 等 2018（LAK 版與期刊版摘要一致） | — | ✅ 單一來源；N = 20，題目取自原課小考 |
| ColumbiaX MicroMasters 的 24 個開課次、2,650 位付費學習者，三波隨機實驗：互動式的自我調節介面（進度儀表、目標設定、提醒）對通過者的成績合計沒有可辨識的效果；對未通過者約高 1 個百分點，作者稱證據微弱（後驗方向為正的機率 60%） | L@S 2022 SRL 鷹架研究（設計、結果、討論已讀） | Kizilcec 等 2020（計畫類介入對完成率無效） | ✅ 方向一致 |
| 線上與混成學習的自我調節介入統合：50 篇文章、92 個研究，隨機效果 ES = 0.63 [0.47, 0.79]；92 個裡 71 個是準實驗、21 個隨機；異質性顯著 | 線上 SRL 介入統合 2022（Behaviour & Information Technology；摘要、整體結果已讀，調節變項沒讀） | L@S 2022、Kizilcec 等 2020（MOOC 裡的隨機實驗接近零） | ❌ conflict：統合的平均是中等效果，MOOC 的大型隨機實驗是零；可能差在研究設計與情境，未解 |
| 一般網頁瀏覽：先前研究估計 50%–80% 的瀏覽是回到看過的頁面；多數回訪發生在第一次造訪後不久，也有相當數量在隔了很久之後；回訪原因依頁面內容、結構與意圖而不同（61.2 萬人、五週 log） | Adar 等 2008 [摘要與前言] | — | ✅ 單一來源；**不是學習內容** |
| JMOOC 平均修了率約 10%，Coursera 與 edX 約 4–5%（引山川 2015）。該研究自己的講座：登錄 3,529 人，登入過的 71.4%，修了 22.0%；問卷回收 547 份，分析的 487 人全是修了者，平均 48 歲 | 渡邉・向後 2017（方法、結果、結論已讀） | — | ✅ 單一講座的數字；平台平均是轉引 |
| 中國大學 MOOC 平台：註冊逾 1,000 萬、選課逾 4,000 萬人次，課程通過率 1.5%。學堂在線四門課的心理介入：價值肯定讓習題得分率高 5–6 個百分點；作者自述問卷回收率約 1.5%，是主要限制 | 钱静（清華大學網站上的研究者說明文，非期刊論文；設計、結果、討論已讀） | 郭文忠等 2021（論述文，只讀前段） | ⚠️ 非同儕審查來源；平台數字未見原始公告 |

---

## 我的推論（與上表分開）

| 推論 | 依據 | 這個推論可能錯在哪 |
|---|---|---|
| 對內容作者來說，「再接觸時讀者要做什麼」比「隔多久」重要。隔一陣子重讀，一週內看不出好處（但忘得比較慢）；隔一陣子要他把東西想出來或用出來，證據較強。數學是例外要另外看：那裡提取對重學的效果不穩，間隔的效果也比語言學習小。 | Greving & Richter（一週後分散重讀與集中持平，集中組掉 50%、分散組掉 10%）；義大利小學（1 天對 4 天無差別，提取勝重讀）；Mawson & Kang（閱讀 −0.11）；Latimier（間隔提取 g 0.74）；Murray（數學：課程內間隔 g 0.24，提取對重學 0.18 且信賴區間跨零） | 兩個「重讀無益」的研究是中小學生、只測到一週；Greving & Richter 的趨勢其實對分散有利，測更久可能翻過來。Mawson & Kang 的領域差異沒通過檢定。成人讀技術文章時重讀的價值沒有人直接量過。 |
| 間隔表本身不必精算。固定間隔和漸增間隔在現有證據下分不出高下，先求「有第二次」。而且在真實情境裡，嚴格意義的「集中」本來就不存在，實際在比的是間隔長一點或短一點。 | Latimier（漸增對等距 g = 0.034）；Mawson & Kang（七天固定間隔最一致，作者標為質性觀察）；Greving & Richter 的討論；Lindsey（個人化排程比一體適用多 10%，但需要逐題作答資料） | Latimier 的比較全是提取練習、多為實驗室；Lindsey 顯示有資料時個人化確實有用。「不必精算」是對沒有作答資料的作者說的，不是一般結論。 |
| 把複習「推」給讀者，多數人不會接。嵌入式複習的瓶頸是讀者回不回來，不是排程演算法。 | Davis（523 人中 102 人互動過，略過的中位時間 7 秒）；Matuschak 自列的採用障礙；Kizilcec 2020（輕量介入在第二週就失效）；Reich（隔年回來修課的比例 7%） | Davis 是單一課程、彈窗形式；Quantum Country 沒公布分母，無法算回訪率；本站讀者的組成沒量過，可能比 MOOC 註冊者更有目的。 |
| 嵌入式間隔複習目前只在一種內容上有（作者自報的）正面資料：成熟領域、線性、讀者願意照單全收的入門。本站的課程導讀接近這個條件，一般的深度介紹文不接近。 | Matuschak「linear primers」「non-technical texts」兩則筆記；作者自己寫「推廣到其他領域沒有證據」 | 全部出自同一位作者對自己作品的判斷；沒有第二個獨立案例。Execute Program 是互動練習，不是文章。 |
| 文章裡最便宜的時間性做法，是在後面的篇章裡要讀者用到前面的東西（交錯的題目、回頭題），以及在讀者以為懂了的地方放一題要他產出答案。這兩件事不需要帳號、排程或回訪機制。證據在數學題上強，搬到其他內容是外推。 | Rohrer RCT（d = 0.83，機制含間隔與提取）；Rohrer 教科書分析（題目順序是出版者的選擇，現況 9.7%；Saxon 是反例）；Murray（課程內的間隔本來就夾帶交錯）；Prinz 與 Yang（延後產出與預期被考理解題能改善判斷） | Rohrer 是數學題、有老師、有詳解與訂正；Brunmair 顯示交錯對說明文不顯著；Firth 指出交錯文獻幾乎全是實驗室大學生與視覺材料。後設理解研究的教材是短文、延後是分鐘級，不是跨天跨篇。Math Academy 的 layering 只是公司自述，不算證據。 |
| 「讀完才出現的檢查題」比「讀的當下就出現的題目」更能讓讀者看出自己沒懂，但當下的題目另有引導注意力的作用，兩者不互相取代。 | Prinz（延後摘要與關鍵詞有效，立即的較弱）；Yang（同）；Bernhardt（隔天才考讓人確認自己真的懂）；Kovacs（影片內題目讓人往回找答案） | 「延後」在實驗裡是讀完全部文本之後，不是隔天；Kovacs 觀察到的往回找可能是在抄答案而不是在理解。 |
| 順序值得花力氣排的情況，是主題跨好幾個領域、先備關係複雜的時候；這時「照知識發展史講」是個可能被打敗的預設。但「順序本身」的效果比直覺小：同樣的活動排與不排，三個實驗只有一個有差。用演算法自動排相依內容，目前沒有贏過人排的紀錄。 | PATHOS（d = 0.32，單尾檢定，單一課程）；Dringoli（預印本，概念先於理論）；Baroody（一級一級教 4/7 支持；同活動排序 1/3 支持）；Doroudi（相依內容 0／8 顯著；顯著的研究多半只贏過隨機順序）；Fang（ALEKS 約等於零） | PATHOS 與 Dringoli 各只有一個主題，PATHOS 的樣本數我沒讀清楚、p 值是單尾；Baroody 是幼兒數學。Doroudi 的 8 個研究多數比的是演算法對合理基準。這些都沒直接測「系列文章的篇次順序」。 |
| 只要給彈性，多數人就不會照建議順序走，連完成的人也跳著看；所以每篇都該自己交代先備並給回去的連結。至於「給控制權對學習是好是壞」，我讀得到全文的證據只夠說：先備知識低的人需要預排的路徑，先備知識高的人不需要。 | Mullaney & Reich（彈性都會被用掉；每週都有大量訪客只看開頭）；Guo & Reinecke（拿證書者略過 22%，摘要層）；Kovacs（從題目往回跳）；Scheiter & Gerjets（先備知識的調節）；2022 影片研究（自由組成績較好但多花 26% 時間，N = 86） | **原本「平均不傷不幫（g = 0.05）」的說法靠的是 Karich 的摘要，已撤下**；Landers 的摘要另說「順序控制是唯一大致無害的一種」，同樣只到摘要。Scheiter & Gerjets 是 2007 年的敘述性綜述，談的是超媒體。部落格讀者多從搜尋進到單篇，行為沒有資料。 |
| 自訂進度的課持續率較低，但這個差距有多少是時程造成的不清楚；強加時程在開放內容上也做不到。作者能控制的是發佈節奏與每篇的長度。 | Helsinki（3.5 倍，但學生自選版本、兩版評分規則不同）；Mullaney（差異很小，自然實驗）；Jordan（完成率與課程長度負相關）；Execute Program（強制每日上限，付費產品，自報） | 沒有任何一個是隨機分派。Helsinki 與 Mullaney 的方向不完全一致。Jordan 的負相關可能只反映長課較難。把「課程長度」換成「系列篇數」是外推。 |
| 「完成率」拿來評估部落格系列不合適；比較有意義的量是：讀者進來的那一篇有沒有讓他能繼續往下讀或回頭找到先備。 | Reich（52% 從未進入內容）；Yeomans（有意完成者也只有 22% 完成）；Guo & Reinecke（完成者也略過 22%）；Mullaney（最前面的內容是最多人唯一看到的部分） | 這是價值判斷多於實證推論。本站沒有任何閱讀行為資料可以支持或反駁。 |
| 輕量的行為介入（計畫提示、排程提醒、自我調節儀表板）不值得做進文章：小規模有效的在大規模複製時效果剩十分之一或消失，付費學習者身上的三波實驗也接近零，而且事前無法預測對誰有效。 | Kizilcec 2020；Baker 2016；Davis 2018；L@S 2022（2,650 位付費學習者，合計無效） | Patterson 的承諾裝置有效（但要裝軟體、樣本是自願者）。線上 SRL 介入的統合平均是 ES 0.63，但以準實驗為主，和 MOOC 的隨機實驗對不上，這個衝突沒解。Zengilowski 2025 的無效結果只讀到摘要，不能算進來。 |

---

## 草稿骨架

建議拆成四篇。每篇列聚焦問題、主要結論與證據強度、本站可當案例的地方。順序是建議的閱讀順序。

### 篇一　間隔複習搬出實驗室之後還剩多少

**聚焦問題**：分散練習在真實課程裡的效果有多大，哪些情況下量不到，這對寫文章的人代表什麼。

**主要結論與證據強度**
- 真實課堂的效果比混入實驗室研究時小（d 0.54 對 0.85），異質性極高；數學又更小，嵌在課程裡的間隔是 g 0.24。〔中強：兩份統合分析（2025），都讀了結果與討論〕
- 隔一週重讀，一週後的成績和馬上重讀持平，沒有出現預期的優勢，但忘得比較慢（掉 10% 對掉 50%）；隔一陣子再提取才明顯勝過重讀。在數學上提取的優勢不穩。〔中：一個預先註冊的課堂實驗（145 人）、一個很小的小學研究、統合分析的領域分組與數學統合；只測到一週〕
- 間隔要不要逐步拉長，現有證據分不出來。〔中強：統合分析 16 個研究〕
- 沒有任何課堂研究讓學習者自己決定要不要分散；MOOC 裡的觀察資料顯示分較多次讀的單元成績較好，但那是相關。真實情境裡嚴格的「集中」不存在，比的是間隔長短。〔弱到中〕
- 醫學教育的電郵題是「內容作者把間隔做進去」最接近的成功案例，但受試者有考試壓力，兩年後的保留證據只來自一兩個研究；Anki 的研究沒有隨機實驗。（2026 年那份 SMD 0.78 的統合只讀到摘要，不用。Lyle 2020 的跨學期結果同樣只到摘要，不用。）〔中〕

**本站案例**
- LHTL 文章的「分散練習 ✅」一節只引了實驗室外重測仍成立的結果，沒提課堂效果縮小與重讀無效這兩點；新文章可以補上並互連，不重寫那一節。
- `/english` 口說練習頁其實已經有一個漸增間隔排程（`src/lib/english-speaking.ts` 的 `scheduleReview`：忘了 10 分鐘後、模糊 1 天後、記得則 3、6、12、24 天到上限 30 天，進度存 localStorage，沒有提醒）。任務書說「站上沒有任何回訪或複習機制」，對文章成立，對這一頁不成立。它正好是「有排程、沒有把人叫回來的管道」的實例。

### 篇二　把複習做進文章：Quantum Country 公布了什麼，沒公布什麼

**聚焦問題**：把題目和排程嵌進內容的作品，實際資料說了什麼；為什麼它沒有變成普遍做法。

**主要結論與證據強度**
- 留下來做完複習的讀者確實記得（平均每題約 54 天的已證明保留，時間成本不到五成）。〔弱：作者自報，自選樣本，沒有分母〕
- 文內就作答加上之後的複習，對難題的一個月回想率差很多（42% 對約 70%），對簡單題幾乎沒差。〔弱：跨實驗比較，作者自己標明不乾淨〕
- 作者自己判斷它只在成熟領域的線性入門行得通，並稱原設計太威權；推廣到其他文類沒有證據。〔作者觀點，附讀者原話〕
- 把題目推給讀者，多數人略過：MOOC 的隨機實驗裡八成的人從未互動，整體沒有效果。〔中：一個預先註冊的 RCT〕
- 強制間隔的商業產品（Execute Program）與大規模排程實驗（Duolingo）存在，但公開的結果量的是回訪，不是學會。〔弱：公司自報〕
- 寫文章要注意：能引的只有 2019 年公開文章與公開工作筆記；作者另有標明不得引用的贊助者信件，不使用。

**本站案例**
- 本站課程導讀符合「成熟領域、線性入門」；深度介紹文不符合。可以拿 CS50 AI 七週導讀當思想實驗：如果每週末放五題下週才出現的回頭題，要多少工、讀者要付出什麼。
- 課程導讀規格（`course-guide-contract.md`）已要求每篇有「檢驗該能力的問題與答案／判準」，這是文內題目；缺的是跨篇的回頭題。

### 篇三　系列的順序、交錯與讀者的自由

**聚焦問題**：系列文章的順序怎麼排有根據；後面的篇章要不要回頭用前面的東西；讀者不照順序讀時怎麼辦。

**主要結論與證據強度**
- 交錯題目在數學課的隨機實驗裡效果很大（d 0.83，一個月後無預警測驗），教科書卻只有一成題目是交錯的；但交錯對說明文不顯著、對字詞可能有害。〔強（數學）；中（其他領域的界線）〕
- 學習者經歷過交錯後仍有八成以上認為區塊比較有效，說明也很難改變。〔中強：同一篇論文的多個實驗〕
- 跨領域主題的順序，照先備結構排有機會勝過「照發展史講」。〔弱：一個預先註冊 RCT（單尾檢定、單一課程、樣本數待核對）、一個預印本，各一個主題〕
- 用演算法自動排相依內容，沒有贏過人排的紀錄；演算法排序顯著的研究多半只贏過隨機順序；知識空間理論產品的統合效果約為零。〔中：一份綜述、一份統合分析，都讀了結果〕
- 學習進程是待驗證的假設：一級一級教在 7 個實驗裡 4 個支持；同樣的活動排與不排，3 個裡只有 1 個有差。螺旋式課程的成效研究很少（綜述明講），唯一找到的醫學院實作是預期高、實際評價中等、成績無差別，而且是歷史對照。〔弱〕
- 只要給彈性，多數人就不會照建議順序走，連完成的人也略過約兩成內容。先備知識低的人需要預排的路徑。「給控制權平均不傷不幫」這句話目前只有摘要層的依據，不寫進文章，或要先取得 Karich 2014 與 Landers & Reddock 2017 全文。〔行為面：中；對學習的平均效果：無可引依據〕

**本站案例**
- `series-curriculum-design` skill 的五條弧線原則（可見先於不可見、動機先於抽象、一次一個跳躍、具體到形式、螺旋式加深）裡，「一次一個跳躍」與「先備先行」有 PATHOS 這類證據可以對上；「螺旋式加深」目前是沒有對照實驗支持的設計信念，文章可以照實寫。
- skill 的「找斷崖」步驟是人工檢查先備關係，和 PATHOS 用知識空間理論做的事同類，可以對照說明。
- 文章頁在有系列時把上下篇導覽換成系列順序（`src/pages/posts/[...slug].astro`），但每篇是否自己交代先備，要靠範圍卡的「前置」欄；可以抽查 CS50 AI 七週導讀有沒有做到「從搜尋直接進到第四週的讀者找得到路」。
- 「一堂一篇」的規則讓順序跟著原課走，等於把排序決定交給原課教師；這對應 Dringoli 發現的「教師偏好的順序與學生偏好的不同」。

### 篇四　讀者以為自己懂了，以及他會不會回來

**聚焦問題**：自學者判斷自己懂了沒有多準；內容能做什麼讓他判斷得準一點；線上自學的持續與回訪實際是什麼數字；哪些「幫助堅持」的做法在大規模複製時失敗。

**主要結論與證據強度**
- 讀者分辨「哪篇懂、哪篇沒懂」的準確度只比擲銅板好一點（相關 0.18，換算約 55%）。〔強：兩份統合分析，115 個研究〕
- 讓讀者預期會被問理解題、讀完之後才要他寫摘要或列關鍵詞，可以把相關拉到 0.4 左右；重讀幫助很小。〔中強：統合分析，但教材是短文、延後是分鐘級〕
- 被動聽講讓人覺得學到比較多、實際測驗較差（自評低 0.56 個標準差的那組，測驗反而高 0.46）；費力的做法被解讀成沒學到，四分之三的人之後仍選比較不費力的那種。〔中強：一個交叉設計的課堂實驗、兩篇多實驗論文，都讀了結果〕
- MOOC 註冊者過半從未進入內容；有意完成的人也只有約兩成完成；六年間沒有改善；新學習者隔年還回來的比例從 38% 掉到 7%。〔強：原文正文已讀。各年完成率的具體數值（3.13%、46%）只有二手報導，不用〕
- 計畫提示、價值寫作等輕量介入，在 25 萬人、247 門課的複製裡效果剩十分之一或消失，且無法預測對誰有效；排程提醒在一門 1.8 萬人的課裡是負效果；付費學習者的自我調節儀表板三波實驗合計無效。線上 SRL 介入的統合平均卻是中等效果（多為準實驗），兩者對不上，文章要照實寫成未解。〔強（MOOC 隨機實驗）；衝突未解〕
- 「學過的東西多久忘掉多少」目前沒有可引的依據：回顧只讀到摘要，MOOC 那個「兩週後剩三分之二」只有 20 人。要寫這一點得先取得 Custers 2010 全文或另找來源。〔無可引依據〕
- 讀者怎麼回訪教學文章，沒有找到直接研究。〔缺口〕

**本站案例**
- CS50 AI 七週導讀重寫前，專案參考程式有六週跑不起來或規則寫反，是獨立審稿抓到的（`.work/reviews/2026-10-13-cs50ai-w0*-review.md`）。這是作者端的同一個現象：寫的人讀自己的稿覺得通順，不等於它是對的；審稿在這裡扮演的角色，相當於研究裡的「延後、由別人出的理解題」。
- 課程導讀規格規定自我檢查要附答案或判準、不能只寫「想一想」，對應「產出後能對答案才校準得了」。
- 站上沒有閱讀行為資料，文章要明說這一點，不要拿 MOOC 數字當成本站讀者的寫照。

### 跨篇的取捨總結

- 做得到又有證據的：後篇用到前篇的題目、讀完之後才出現的產出題、每篇自帶先備說明與回頭連結。
- 有證據但做不到或代價高的：個人化間隔排程（要逐題作答資料）、強制每日上限（要帳號與付費動機）。
- 做得到但沒證據或證據是負的：計畫提示、鼓勵語、提醒通知、螺旋式重講。
- 限制：以上「有證據」多半是把課堂或 MOOC 的結果外推到單篇網頁文章，沒有一項是在部落格讀者身上直接量的。

---

## 待解問題

- （已拍板）Matuschak 的四封贊助者信件不使用。
- （已拍板）本站現況照實寫：文章沒有回訪或複習機制；`/english` 口說頁有存在 localStorage 的漸增間隔排程（`scheduleReview`），可當本站案例。
- Landers & Reddock 2017 的結果節與 Karich 2014 全文，第二輪用 Exa、Unpaywall、ERIC、機構頁重試後仍只有摘要。要寫 learner control 對學習的平均效果，得走圖書館館際合作或寫信給作者；在那之前文章不寫這個數字。
- Reich & Ruipérez-Valiente 2019 的正文第二輪已取得並讀完；各年完成率的數值只在圖 3，正文沒寫，文章不引 3.13% 與 46%。
- Lindsey 2014 的 t 值在 PDF 轉文字後看起來錯位，引用時只用百分比與 Cohen's d，或回原 PDF 版面核對。
- Patterson 2018 的樣本數沒核對清楚。
- 仍只有摘要、文章不能引的：Zengilowski 等 2025、Lyle 等 2020、Custers 2010、醫學教育統合 2026、Sun 等 2021、Karich 2014、Landers 2017 的結果。其中 Zengilowski 2025（篇四）與 Custers 2010（遺忘速度）最值得設法取得。Davis 等 2016 沒取到。The Math Academy Way、Cosyn 2021、Matuschak 分析日誌決定不用。
- 非英語：臺灣只找到一篇「磨課師持續使用意願」問卷研究的書目與國教院電子報，都沒讀；日文分散學習的課堂實踐只搜到科普文；中國的學堂在線介入研究只讀到設計、沒讀到結果。找過的地方：Keenable 繁體、簡體、日文各一到兩輪關鍵字。沒找 CNKI、CiNii、華藝的站內搜尋。
- 沒找到獨立研究者對「教學型網頁文章的回訪行為」的研究；Chartbeat 類的閱讀深度資料與 Readwise、Pocket 的回看資料都沒查。這是整個子問題最大的缺口。
- 實務端沒有失敗案例：Khan Academy 移除知識地圖、Orbit 後續發展、Coursera 行事曆功能的成效，都沒查到一手說明。
- 與其他子問題的邊界：提取練習本身的效果與題目怎麼出，屬於 q3-activity；動機與先備知識屬於 q1-learner；這裡只處理「什麼時候再出現」與「順序」。篇四的後設理解部分和 q3、q6 可能重疊，整合時需要對一次。


---

## 第二輪補讀後改變的結論

| 原本的說法 | 補讀後 | 原因 |
|---|---|---|
| 給學習者控制權的平均效果約為零（g = 0.05） | **撤下，不寫進文章** | Karich 2014 只有摘要；Landers 2017 的結果節被擋。改成只講讀得到全文的部分：彈性都會被用掉、先備知識低的人需要預排路徑 |
| 單純隔一陣子重讀沒有好處 | 改成「一週後持平、沒有出現預期優勢，但忘得較慢；只測到一週」 | 讀了 Greving & Richter 的結果：集中組掉 50%、分散組掉 10%，一週後分散組數值略高但不顯著 |
| 真實課堂的間隔效果 d = 0.54 | 保留，另加「數學更小：課程內 g = 0.24；數學裡提取對重學不穩健」 | 新取得 Murray 等 2025 |
| 義大利小學：間隔單獨無效 | 保留但降為旁證 | 讀了方法：每階段只有 25–27 人、班級層級指派、對比只是 1 天對 4 天 |
| 學習軌道十個實驗五個支持 | 拆開：一級一級教 4/7；**同樣活動排與不排只有 1/3** | 讀了 Baroody 的方法與結果，兩個假設是分開檢驗的 |
| PATHOS：照先備結構排勝過發現順序（d = 0.32） | 強度從「弱到中」降為「弱」 | p 值是預先註冊的單尾檢定；單一課程；分析樣本數我沒讀清楚 |
| 螺旋式課程幾乎找不到對照實驗（我的搜尋結果） | 現在有來源可引：綜述明講成效文獻很少、Bruner 原書沒給證據 | 讀了 Ireland & Mouthaan 的優缺點節 |
| 演算法排相依內容 0／8 顯著 | 保留，另加「顯著的研究七成只贏過隨機或弱基準」 | 讀了 Doroudi 5.3 節 |
| MOOC 完成率 3.13%、付費者 46% | **不引**；改引正文裡的 52% 從未進入、隔年留存 38%→7%、六年沒改善 | 取得 Reich 2019 正文；那兩個數字只在圖裡，我讀到的是二手報導 |
| 課程知識一年後剩三分之二到四分之三 | **撤下** | Custers 2010 只有摘要；另一個來源只有 20 人 |
| 跨學期的保留只受間隔影響（Lyle 2020） | **撤下** | 期刊版與海報都只讀到摘要 |
| 醫學教育間隔重複 SMD 0.78 | **撤下** | 只有 PubMed 摘要 |
| 輕量介入大規模複製失敗 | 保留並加強：付費學習者的 SRL 儀表板三波實驗合計也無效；但新增一個未解衝突——線上 SRL 介入統合的平均是 ES 0.63 | 讀了 L@S 2022 的結果與 2022 統合的整體結果 |
| 感覺學得多不等於學得多 | 保留，補上數字（自評 −0.56 SD、測驗 +0.46 SD；76.6% 仍選區塊） | 讀了 Deslauriers 與 Macaluso 的結果 |
| 交錯的界線 | 保留，補上「文獻幾乎全是實驗室大學生與視覺材料、延宕最長幾天」 | 取得 Firth 2021 全文 |
| 自訂進度的課持續率較低 | 降強度：學生是自己選版本的 | 讀了 Helsinki 的限制節 |

沒有改變的：Mawson & Kang、Latimier、Rohrer RCT、Brunmair、Davis 2018、Kizilcec 2020、Yang 2023、Prinz 2020 這幾個第一輪就讀了結果與討論的來源，結論不變。Quantum Country 的結論不變（全部出自 2019 年公開文章與公開筆記）。

仍待補的讀取：Rohrer 教科書分析的抽樣方法段、PATHOS 的結果統計與樣本數、Guo & Reinecke 的結果節、Kizilcec 2017（Science）正文、Carpenter 2022 正文。這五項的 PDF 都在手上，是雙欄轉文字後段落交錯、我沒找到對的段落，不是被擋。


---

## 第三輪：用公開管道再找一輪全文（2026-10-14）

只收作者或出版者合法公開的版本。結論沒有因這一輪改變；新取得的三篇都只讀了摘要，等精讀。精讀清單在 `.research/2026-10-13-reading-list-order-16-19.md`。

| 來源 | 試過的管道與結果 | 現況 |
|---|---|---|
| Karich, Burns & Maki 2014 | Unpaywall：closed。OpenAlex：closed，無開放位置。Semantic Scholar：CLOSED。CORE：連續回 429，沒查成。Internet Archive Scholar／fatcat：逾時，沒查成。ERIC：只有摘要頁，無全文。OSF 預印本標題搜尋：無。明尼蘇達大學 experts 頁：書目，無檔。academia.edu 上的條目：只有摘要與參考文獻。搜尋第一作者的學位論文：沒找到同題論文 | 仍只有摘要 |
| Landers & Reddock 2017 | Unpaywall、OpenAlex、Semantic Scholar：closed。CORE：429。fatcat：逾時。OSF：無。NSF PAR：無。ODU Digital Commons：找到的是 Reddock 另一份學位論文（Individual Differences and Usage of Learner Control），不是這篇。springerprofessional 與 Springer 頁：摘要。先前 Keenable 取回的 50k 視窗截在結果前 | 方法讀得到，結果仍只有結構式摘要 |
| Zengilowski 等 2025 | Unpaywall、OpenAlex、Semantic Scholar：closed。CORE：429。OSF：無。NSF PAR：無。ACM 頁：摘要與參考文獻。作者的 ORCID、dblp、Scholar 頁：書目；Schuetze 個人網站首頁沒有連到 PDF | 仍只有摘要 |
| Lyle 等 2020 | Unpaywall、OpenAlex：closed。Semantic Scholar：無。OSF：無。NSF PAR：這篇沒有，但有同一計畫的其他論文。路易維爾大學典藏：站內搜尋頁抓不到結果。ERIC：摘要。ASEE 2018 海報：有 PDF，但那是較早的會議版 | 仍只有摘要；**改取同一團隊兩篇開放取用的後續研究**（Lyle 等 2022、Bego 等 2024），已存 `q4/` |
| Custers 2010 | Unpaywall、OpenAlex、Semantic Scholar：closed。CORE：429。Springer 與 Ovid 頁：摘要。烏特勒支大學與 UMC Utrecht 典藏：找到的是同作者其他論文。搜尋結果裡有一份全文放在約翰霍普金斯的課程網站，**不是作者或出版者公開的版本，沒有下載** | 仍只有摘要 |
| 醫學教育間隔重複統合 2026 | Unpaywall、OpenAlex：closed。Semantic Scholar：無。OSF：無。PubMed：摘要。Wiley 與 Ovid 頁：擋。ResearchGate 條目：要向作者索取，不是公開檔 | 仍只有摘要 |
| Sun 等 2021 | Unpaywall、OpenAlex：closed。Semantic Scholar：無。OSF：無。NSF PAR（有 NSF 經費）：標題搜尋沒結果。McGraw Hill 的研究頁：摘要。Taylor & Francis 頁：摘要 | 仍只有摘要 |
| Davis 等 2016 | Unpaywall、OpenAlex、Semantic Scholar：green，指向萊頓大學典藏（頁面抓不到檔案連結）。CORE：有條目，下載回 HTML。作者 Davis 的網頁：沒列這篇。**共同作者 Hauff 的網頁有 PDF** | **取得**，`q4/davis2016-ectel-retrieval-planning.txt`，14 頁 |

沒查成的管道：CORE（整輪都回 429，只有 Davis 2016 查到一次）、Internet Archive Scholar／fatcat（逾時）。這兩個之後值得在沒有其他 agent 同時打的時候重試。OpenAlex 的標題搜尋也回 429，但 DOI 查詢是成功的。

另外更正：先前 q1 筆記寫本站有分析工具是錯的。主持人查過 `src/`、`wrangler.jsonc` 與正式站頁面，本站沒有裝任何分析工具，沒有流量資料。本筆記裡「站上沒有閱讀行為資料」的說法與此一致，不需改動。
