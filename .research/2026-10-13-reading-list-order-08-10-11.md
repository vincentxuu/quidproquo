# 精讀來源清單：order 8、10、11（deep-research 2.5 節第二段「選讀」）

日期：2026-10-14
狀態：待使用者確認。只挑清單，還沒精讀，沒有抽取紀錄。
依據：`.research/2026-10-13-learning-content-q3-activity.md`（掃描階段的筆記，結論只能用來決定讀哪些）與 `.research/2026-10-13-learning-content-series-plan.md`。

讀法提醒：下表「之前讀到哪」一欄全部是掃描階段用關鍵字定位讀的，沒有任何一篇從第一頁讀到最後一頁。「要撐的結論」是掃描時得到的暫定說法，精讀後可能改寫或刪掉。

檔案路徑沒寫目錄的，都在 `.research/raw/learning-content/q3-activity/`。長度是純文字檔的字元數。

---

## order 8　「做中學」的證據在量什麼

暫定結論編號：

- 8-a　大學課堂裡有主動成分的班比純講述的班好約半個標準差。
- 8-b　這批研究的控制普遍不全；「主動學習」是用「不是講述」來定義的。
- 8-c　ICAP 的四級排序是假說；外顯行為不等於內在處理。
- 8-d　doer effect 在多門課裡一致出現，但是相關性資料，沒有隨機實驗；主要作者與產品有利益關係。
- 8-e　學得多的那一組自覺學得少。

| # | 來源 | DOI／網址 | 要撐的結論 | 檔案與長度 | 之前讀到哪 |
|---|---|---|---|---|---|
| 1 | Freeman 等 2014〈Active learning increases student performance in science, engineering, and mathematics〉PNAS | 10.1073/pnas.1319030111 | 8-a；8-b 裡「只有 16 個隨機分派」 | `freeman2014.md`，63,815。SI（納入標準、各研究清單）不在手上，沒試過取 | 摘要、結果、Table 1、討論前半 |
| 2 | Martella 等 2023〈How Rigorous is Active Learning Research in STEM Education?〉Educational Psychology Review | 10.1007/s10648-023-09826-1 | 8-b（**方法批評**） | `martella2023.md`，228,751（含參考文獻） | 結果末段、討論、六項限制、結論；編碼方法沒讀 |
| 3 | Lombardi、Shipley 等 2021〈The Curious Construct of Active Learning〉Psychological Science in the Public Interest | 10.1177/1529100620973974 | 8-b 的定義問題 | `lombardi2021.pdf`／`.txt`，194,497 | 沒讀。只經 Martella 轉引 |
| 4 | Deslauriers 等 2019〈Measuring actual learning versus feeling of learning…〉PNAS | 10.1073/pnas.1821936116 | 8-e；8-a 的單一隨機實驗 | `deslauriers2019_PMC6765278.xml`，88,292 | 設計、迴歸結果表、訪談段 |
| 5 | Chi & Wylie 2014〈The ICAP Framework〉Educational Psychologist | 10.1080/00461520.2014.965823 | 8-c | `chi_wylie2014.pdf`／`.txt`，145,284 | 摘要、定義、covert 處理的但書數段；成對比較表只看到一張 |
| 6 | Thurn 等 2023〈Questioning central assumptions of the ICAP framework〉npj Science of Learning | 10.1038/s41539-023-00197-4 | 8-c（**反方評論**） | `thurn2023_PMC10652002.xml`，58,796 | 摘要與導言 |
| 7 | Koedinger 等 2015〈Learning is Not a Spectator Sport〉L@S | 10.1145/2724660.2724681 | 8-d 的「六倍」 | `.work/teaching-text-research/src/koedinger2015.txt`，65,206（文字研究的檔） | 我沒讀；文字研究讀了摘要、研究問題、結果段、結論 |
| 8 | Koedinger 等 2016〈Is the doer effect a causal relationship?〉LAK | 10.1145/2883851.2883957 | 8-d 的因果論證 | `koedinger2016.pdf`／`.txt`，43,607 | 沒讀（第二輪才取得）。先前只經 Van Campenhout 轉述 |
| 9 | Van Campenhout 等 2023〈The Doer Effect at Scale〉LAK | 10.1145/3576050.3576103 | 8-d 的複製、作者自述的限制、利益關係 | `vancampenhout2023.pdf`／`.txt`，55,093 | 摘要、因果模型的邏輯、限制、結論；結果表沒讀 |
| 10 | Lekshmi-Narayanan、Asher、Brusilovsky & Carvalho 2025〈Can Motivated Students Do More Activities?〉CSEDM'25 workshop | https://par.nsf.gov/servlets/purl/10632298 | 8-d（**無效果**：摘要寫在 Runestone 的 AP Java MOOC 裡「failed to identify a doer effect in learning outcomes」） | `motivated_doer_nsfpar.pdf`／`.txt`，31,808 | 只讀了摘要。workshop 論文，證據等級要在精讀時判斷 |
| 11 | Kozanitis 等 2022（共同作者姓名在抓到的檔裡被去掉，精讀時補）〈Effect of active learning versus traditional lecturing… humanities and social sciences〉Higher Education | 10.1007/s10734-022-00977-8 | 8-a 能不能推到 STEM 以外 | `kozanitis2022.md`，94,802（有方法、結果、討論各節） | 沒讀 |

備選（不在主清單）：Theobald 等 2020（`theobald2020_PMC7104254.xml`，146,137，沒讀），題目是成就落差，與本篇聚焦問題關係較遠。

---

## order 10　讀者真的會做嗎

暫定結論編號：

- 10-a　擋在動線上的小考，多數人會答。
- 10-b　另外跳出、可略過的提示，少數人會碰，對成績無效。
- 10-c　有學分的教材：不給分約五成完成，給一點分超過九成；多數題目是先試答才看答案。
- 10-d　能選的時候學習者偏好重讀；題目答得出來時才願意自我測驗。
- 10-e　抄答案的人考試成績下滑。
- 10-f　課前測驗會讓一部分人離開。
- 10-g　學習者的感受與實際學習不一致（與 8-e 共用來源）。

| # | 來源 | DOI／網址 | 要撐的結論 | 檔案與長度 | 之前讀到哪 |
|---|---|---|---|---|---|
| 1 | Kovacs 2016〈Effects of In-Video Quizzes on MOOC Lecture Viewing〉L@S | 10.1145/2876034.2876041 | 10-a | `kovacs2016.pdf`／`.txt`，40,012 | 摘要、發現清單、略過行為段 |
| 2 | Davis、Kizilcec、Hauff & Houben 2018〈Scaling Effective Learning Strategies: Retrieval Practice…in MOOCs〉Journal of Learning Analytics | 10.18608/jla.2018.53.3 | 10-b（**無效果**，預先註冊） | `davis2018.pdf`／`.txt`，82,984 | 摘要、qCard 設計、遵從率、過程指標 |
| 3 | van der Zee 等 2018〈Evaluating retrieval practice in a MOOC〉LAK | 10.1145/3170358.3170382 | 10-b 的旁證：可略過的寫摘要任務有多少人做、寫與讀沒有差別 | `vanderzee2018.pdf`／`.txt`，56,818 | 摘要、研究 1 敘述統計首段 |
| 4 | Janelli & Lipnevich 2021〈Effects of pre-tests and feedback on performance outcomes and persistence in MOOCs〉Computers & Education 161:104076 | 10.1016/j.compedu.2020.104076 | 10-f（**無效果加反向**：摘要寫對全體學習成果無影響、課前測驗降低續讀） | `janelli2021.pdf`／`.txt`，69,664 | 只讀了摘要（第二輪才取得）。先前只經 Pan & Carpenter 轉引 |
| 5 | Yuen、Edgcomb & Vahid 2016〈Will Students Earnestly Attempt Learning Questions if Answers are Viewable?〉ASEE | https://peer.asee.org/will-students-earnestly-attempt-learning-questions-if-answers-are-viewable.pdf | 10-c 的先試答比例 | `yuen2016.pdf`／`.txt`，21,136 | 摘要與零星兩段 |
| 6 | Edgcomb & Vahid 2015〈How Many Points Should Be Awarded for Interactive Textbook Reading Assignments?〉 | https://zybooks.com/wp-content/uploads/2016/06/How-Many-Points-Should-Be-Awarded-for-Interactive-Textbook-Reading-Assignments_.pdf | 10-c 的給分與完成率 | `edgcomb2015points.pdf`／`.txt`，17,798 | 摘要（讀到一半被我的擷取長度截斷） |
| 7 | Ericson、Moore、Morrison & Guzdial 2015〈Usability and Usage of Interactive Features in an Online Ebook for CS Teachers〉WiPSCE | 10.1145/2818314.2818335 | 10-c 的非產品方對照：沒有學分的教師自學電子書，十人裡五人讀完前八章 | `ericson2015wipsce.pdf`／`.txt`，52,534 | 只讀了摘要（第二輪才取得） |
| 8 | Vaughn & Kornell 2019〈How to activate students' natural desire to test themselves〉Cognitive Research: Principles and Implications | 10.1186/s41235-019-0187-y | 10-d | `vaughn_kornell2019.md`，76,468 | 摘要與 Significance |
| 9 | Rivers 2021〈Metacognition About Practice Testing〉Educational Psychology Review | 10.1007/s10648-020-09578-2 | 10-d 的回顧面 | `rivers2021.pdf`／`.txt`，155,284 | 只讀了摘要（第二輪才取得全文） |
| 10 | Palazzo、Lee、Warnakulasooriya & Pritchard 2010〈Patterns, correlates, and reduction of homework copying〉Phys. Rev. ST Phys. Educ. Res. | 10.1103/PhysRevSTPER.6.010104 | 10-e | `palazzo2010.pdf`／`.txt`，55,398 | 摘要 |
| 11 | Deslauriers 等 2019（同 order 8 第 4 項） | 10.1073/pnas.1821936116 | 10-g | 同上 | 同上 |
| 12 | Kizilcec 等 2020〈Scaling up behavioral science interventions in online education〉PNAS | 10.1073/pnas.1921417117 | 10-b 的背景（**大規模無效果**：輕量介入搬到 247 門課後沒有先前的效果） | `kizilcec2020_PMC7334459.xml`，76,270 | 摘要 |

備選：zyBooks 2017 使用行為報告（`zybooks_usage2017.txt`，15,448，只讀摘要），與第 5、6 項同一作者群，資訊重疊。Guzdial 的 ICER 2015 預告部落格（`guzdial_blog_icer2015.md`，二手）只能當線索。

---

## order 11　專案、卡關與引導

暫定結論編號：

- 11-a　先解題再講解平均有利，但有效的版本依賴對比案例、小組或接著學生自己的解法講。
- 11-b　對年紀小的學習者、通用技能、各部分互相牽連的內容，先講解較好。
- 11-c　沒有協助的探索比明示教學差；有回饋、例題、鷹架的探索較好；引導的種類有沒有差。
- 11-d　軟體提供的鷹架有中等效果，撤不撤看不出差別。
- 11-e　專題式學習對成績的統合效果為正，但研究設計弱、全部有老師與小組。
- 11-f　認知學徒制的方法裡，文章做得到哪幾種。
- 11-g　本站案例：CS50 AI 專案節與官方誠信政策。

| # | 來源 | DOI／網址 | 要撐的結論 | 檔案與長度 | 之前讀到哪 |
|---|---|---|---|---|---|
| 1 | Sinha & Kapur 2021〈When Problem Solving Followed by Instruction Works〉Review of Educational Research | 10.3102/00346543211019105 | 11-a；11-b 的低年級與通用技能子群 | `sinha_kapur2021.pdf`／`.txt`，128,740 | 摘要、前人回顧、PF 準則編碼與佔比、Table 2 範例、限制首段；調節變項結果表與出版偏誤段沒讀 |
| 2 | Loibl、Roll & Rummel 2017〈Towards a Theory of When and How Problem Solving Followed by Instruction Supports Learning〉Educational Psychology Review | 10.1007/s10648-016-9379-x | 11-a 的有效條件 | `loibl2017.pdf`／`.txt`，91,340 | 摘要 |
| 3 | Ashman、Kalyuga & Sweller 2020〈Problem-solving or Explicit Instruction: Which Should Go First When Element Interactivity Is High?〉Educational Psychology Review | 10.1007/s10648-019-09500-5 | 11-b（**結果相反**） | **沒有全文。** 只有 `ashman2020_springer.exa.txt`（12,319，摘要與參考文獻）。試過：Unpaywall（closed）、Springer `content/pdf`（導回付費頁）、Exa MCP 與公開端點、Semantic Scholar、Wayback、Keenable 找 UNSWorks／ResearchGate／作者部落格。CORE keyless API 回非 JSON，沒查成 | 摘要 |
| 4 | DeCaro 等 2023〈Bringing exploratory learning online〉Frontiers in Education 8:1215975 | 10.3389/feduc.2023.1215975 | 11-a 搬到線上還成不成立（最接近遠距情境的一篇；仍是同步視訊課，不是獨自閱讀） | `decaro2023.pdf`／`.txt`，40,488 | 只讀了導言一段（第二輪才取得） |
| 5 | Alfieri、Brooks、Aldrich & Tenenbaum 2011〈Does Discovery-Based Instruction Enhance Learning?〉Journal of Educational Psychology | 10.1037/a0021017 | 11-c（**無協助探索為負向結果**） | `alfieri2011.pdf`／`.txt`，149,501 | 摘要 |
| 6 | Lazonder & Harmsen 2016〈Meta-Analysis of Inquiry-Based Learning: Effects of Guidance〉Review of Educational Research | 10.3102/0034654315627366 | 11-c 的引導種類 | `lazonder2016.exa.txt`，123,727（Exa 抽出的文字，沒有 PDF 原檔，表格排版要在精讀時確認有沒有壞） | 沒讀（第二輪才取得） |
| 7 | Kirschner、Sweller & Clark 2006〈Why Minimal Guidance During Instruction Does Not Work〉Educational Psychologist | 10.1207/s15326985ep4102_1 | 11-b、11-c 的立場文（**反方立場**，不是資料） | `kirschner2006.pdf`／`.txt`，86,327 | 摘要 |
| 8 | Belland、Walker、Kim & Lefler 2017〈Synthesizing Results From Empirical Research on Computer-Based Scaffolding in STEM Education〉Review of Educational Research | 10.3102/0034654316670999 | 11-d | `belland2017_PMC5347356.xml`，219,697 | 摘要、研究問題、鷹架變化的編碼說明；結果表沒讀 |
| 9 | Zhang & Ma 2023〈A study of the impact of project-based learning on student learning effects〉Frontiers in Psychology | 10.3389/fpsyg.2023.1202728 | 11-e | `zhang_ma2023.md`，109,949 | 摘要與主要效果段 |
| 10 | Condliffe 等 2017〈Project-Based Learning: A Literature Review〉MDRC | https://files.eric.ed.gov/fulltext/ED578933.pdf | 11-e 的「promising but not proven」（**保留評語**） | `condliffe2017.pdf`／`.txt`，262,767（78 頁報告；精讀建議限第 V、VI 節與前言，要在抽取紀錄寫明沒讀的節） | 前言、摘要性結論段 |
| 11 | Collins、Brown & Holum 1991〈Cognitive Apprenticeship: Making Thinking Visible〉American Educator | https://www.aft.org/ae/winter1991/collins_brown_holum | 11-f | `collins1991.md`，79,961 | 傳統學徒制四要素、reciprocal teaching 一段 |
| 12 | Chen & Yang 2019〈Revisiting the effects of project-based learning on students' academic achievement〉Educational Research Review | 10.1016/j.edurev.2018.11.001 | 11-e 的第二份統合分析 | **沒有全文。** `chen_yang2019_sd.exa.txt`（18,895，Highlights、摘要、各節首段、參考文獻）。試過：Unpaywall（closed）、ScienceDirect（Cloudflare）、Exa、LearnTechLib（抓取錯誤）、Wayback、Keenable 找作者頁與 ResearchGate | 摘要與 Highlights |

本站材料（不算研究來源，11-g 用）：`cs50ai_honesty.md`（5,898，全讀過）；`src/content/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge.md` 的專案節；`.work/reviews/2026-10-13-cs50ai-w0*-review.md` 七份。

備選：Ericson 等 2022 的 Parsons 回顧（`.research/raw/learning-content/q2-interactive/ericson2022-parsons-slr.txt`，265,346）依系列規劃屬於 order 3，這裡不列；Tetzlaff 等 2025（文字研究的檔）屬於 order 12。

---

## 找不到可精讀的來源，所以不能寫的結論

### order 8

- **「六倍」或任何 doer effect 的效果量能不能講成因果。** 手上四篇（第 7 到 10 項）全是觀察資料，沒有一篇隨機分派「做練習」。精讀後最多只能寫成「一致的相關，一篇沒有複製出來」。
- **一個人讀文章時，加練習比不加好多少。** 清單裡沒有任何一篇的比較對象是「同一篇文章有題目對沒題目」。這個數字不能寫；相關證據在 order 9 的來源裡。
- **ICAP 四級的實證排序。** 手上只有提出者的理論文與一篇評論，沒有獨立的統合分析。掃描時看到 Wiggins 2017、Henderson 2019、Vosniadou 2023，都沒有取檔。只能寫成「假說與對它的批評」。
- Freeman 2014 的納入標準與個別研究特徵在 SI，SI 不在手上。若要寫「哪些做法算主動學習、各佔多少」，要先取 SI。

### order 10

- **公開文章或部落格讀者的作答率、展開率。** 沒有任何來源。清單裡最接近的是 MOOC（第 1 到 4 項）與有學分的教材（第 5、6 項）。筆記裡「兩成到五成」是我的跨情境推論，不能當事實寫。
- **非產品方、大樣本的互動電子書使用資料。** Ericson、Guzdial & Morrison 2015（ICER）拿不到（ACM 封閉，Unpaywall 與 Semantic Scholar 標 closed，Exa 兩次逾時，Wayback 無存檔）。替代的第 7 項只有十位教師。所以「先試答比例八成多」這類數字只有產品方來源，要照實標。
- **題目擺放位置的因果效果。** 第 1 項與第 2 項是不同課、不同平台的兩個數字，沒有一篇直接操弄位置。只能並列，不能寫成「擺在動線上會提高作答率」。
- **本站自己的數字。** 沒有量，系列規劃已列為待使用者決定。

### order 11

- **Ashman 2020 的任何數字。** 只有摘要，照 2.5 節不能引數字、不能列進參考資料。這一篇是清單裡唯一直接與 productive failure 對打的隨機實驗；拿不到的話，11-b 只能靠第 1 項的子群結果與第 7 項的立場文，要寫明反方的一手實驗沒讀到。Kalyuga & Singh 同系列的另一篇（doi 10.1007/s10212-019-00445-5）也只抓到參考文獻。
- **Chen & Yang 2019 的數字（d+=0.71 與調節變項）。** 同上，只有摘要與各節首段。它的 Highlights 與第 9 項在地區調節上方向相反，沒有全文就無法處理這個衝突；11-e 只能用第 9、10 項。
- **「預先寫好常見錯解當對比案例」對獨自閱讀的人有沒有效。** 沒有來源。第 4 項是最接近的，但它是同步視訊課。
- **一個人做專案（沒有老師、沒有小組）的學習效果。** 清單裡的專題式學習研究全部有老師。沒有來源可以撐「自學者做專案有效」或「無效」。
- **認知學徒制搬到文字教材的實證效果。** 第 11 項是理論文。掃描時看到 Minshew 2021、Matsuo 2020 兩篇回顧，沒有取檔，也不確定與文字教材有關。11-f 只能寫成依定義的對照，不能寫成有證據。
- **鷹架撤不撤（11-d）** 只有第 8 項一份統合分析；若精讀後發現該調節分析的檢定力不足，這一條要降級或刪掉。
