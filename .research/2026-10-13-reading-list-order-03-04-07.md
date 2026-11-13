# 精讀來源清單：order 3（程式碼）、order 4（記號、行話與術語）、order 7（該不該做互動）

日期：2026-10-13。這是 deep-research 2.5 節第二段「選讀」的產物，只挑不讀。依據是掃描階段的筆記 `.research/2026-10-13-learning-content-q2-interactive.md`；那份筆記的結論不能直接成文，下面「要撐的結論」欄寫的是文章預定要說的話，精讀後可能要改或拿掉。

檔案路徑的前綴都是 `.research/raw/learning-content/q2-interactive/`（下稱 `R/`）。長度是轉出的 `.txt` 字元數，含頁首頁尾與參考文獻。「之前讀到哪裡」指掃描階段用關鍵字跳讀碰過的段落，沒有任何一篇從頭讀到尾。

## order 3：程式碼（12 個來源，全部有全文）

| # | 來源 | DOI 或網址 | 要撐的結論 | 檔案與長度 | 之前讀到哪裡 |
|---|---|---|---|---|---|
| 1 | Muldner, Jennings, Chiarelli 2022, A Review of Worked Examples in Programming Activities, ACM TOCE 23(1) | 10.1145/3560266 | 全篇的骨架：程式例題哪些設計有證據、哪些是虛無（示範式例題、旁白對文字、視覺化功能、泛用的自我解釋提示）；notional machine 圖只對低先備知識者有用 | `R/muldner2022-wb.pdf`、`.txt`，153,521 | 第 1 節、2.1、2.2、2.3.3、3.1、6.1；2.3.1–2.3.2、3.2–3.3、第 4–5 節沒讀 |
| 2 | Margulieux, Morrison, Decker 2020, Reducing withdrawal and failure rates in introductory programming with subgoal labeled worked examples, Int. J. STEM Education 7:19 | 10.1186/s40594-020-00222-7 | 把例題切成有名字的步驟：小考較好、中途放棄的人較少，期考差距消失 | `R/margulieux2020-subgoal.txt`（Jina 轉的 markdown，沒有 PDF），103,603 | 樣本、小考與期考結果、缺考與及格門檻、限制、結論；SOLO 分析沒讀 |
| 3 | Morrison, Margulieux, Decker 2020, The curious case of loops, Computer Science Education 30(2)（作者稿） | 10.1080/08993408.2019.1707544；https://par.nsf.gov/servlets/purl/10301529 | 子目標研究裡與認知負荷理論相反、且被複製出來的結果；先備經驗的差距一門課後消失 | `R/morrison2020-loops.pdf`、`.txt`，60,630 | 摘要與結論；樣本數沒找到 |
| 4 | Ericson 等 2023, Multi-Institutional Multi-National Studies of Parsons Problems, ITiCSE-WGR | 10.1145/3623762.3633498 | **無效果的那一篇**：Parsons 練習對寫程式練習，後測沒有差別，也沒有比較省時間；帶干擾項的版本後測語法錯誤較少 | `R/ericson2023-parsons-wg.pdf`、`.txt`，242,802（超過一個 agent 3–5 篇的份量，建議單獨派一個） | 摘要、結論、兩項研究的結果段 |
| 5 | Shah 等 2023, An Empirical Evaluation of Live Coding in CS1, ICER | 10.1145/3568813.3600122 | **無效果**：現場寫程式對講解寫好的程式，過程指標與成績都沒有差別，多了注意力與筆記的抱怨 | `R/shah2023-livecoding.pdf`、`.txt`，88,525 | 摘要、5.1、7.1、7.3、結論；第 6 節的檢定數值沒讀 |
| 6 | Xie, Nelson, Ko 2018, An Explicit Strategy to Scaffold Novice Program Tracing, SIGCSE | 10.1145/3159450.3159527 | 花幾分鐘教逐行追蹤並把狀態寫下來，追蹤題成績提高 | `R/xie2018-tracing.pdf`、`.txt`，41,883 | 摘要、受試者 |
| 7 | Nelson, Xie, Ko 2017, Comprehension First, ICER | 10.1145/3105726.3106178 | **不顯著**：先學讀再學寫的教材，摘要寫進步高 60%，組間差異沒達顯著 | `R/nelson2017-pltutor.pdf`、`.txt`，71,310 | 摘要、樣本、組間比較那一段 |
| 8 | Lopez, Whalley, Robbins, Lister 2008, Relationships between reading, tracing and writing skills in introductory programming, ICER | 10.1145/1404520.1404531 | 追蹤、解釋與寫程式的能力相關（相關，不是因果） | `R/lopez2008.pdf`、`.txt`，53,415 | 摘要；迴歸模型沒讀 |
| 9 | Pimentel, Murta, Braganholo, Freire 2019, A Large-scale Study about Quality and Reproducibility of Jupyter Notebooks, MSR | 10.1109/MSR.2019.00077；https://leomurta.github.io/papers/pimentel2019a.pdf | 公開筆記本原樣跑得起來的比例與失敗原因 | `R/pimentel2019.pdf`、`.txt`，64,017 | 摘要、執行環境段、結果兩段、效度威脅開頭 |
| 10 | Horton 與 Parnin 2018, Gistable: Evaluating the Executability of Python Code Snippets on GitHub, ICSME | arXiv:1808.04919 | 短程式片段多數需要額外設定才跑得起來，原因是相依套件與資源名稱 | `R/horton2018-gistable.pdf`、`.txt`，60,659 | 摘要、前言、一段開發者回饋 |
| 11 | Yang, Hussain, Lopes 2016, From Query to Usable Code: An Analysis of Stack Overflow Code Snippets, MSR | arXiv:1605.04464 | 貼在說明文字裡的程式片段，可解析與可執行的比例依語言差很多 | `R/yang2016-so-snippets.pdf`、`.txt`，44,334 | 摘要、方法概述、Table 2 說明 |
| 12 | Tan, Wagner, Treude 2023, Detecting Outdated Code Element References in Software Repository Documentation, Empirical Software Engineering | arXiv:2212.01479 | 文件裡引用的程式元素會過期，而且過期很久沒人發現 | `R/tan2023-outdated-readme.pdf`、`.txt`，53,665 | 摘要、前言結果句、結果段的比例 |

本站案例不在這 12 個裡，另外處理：依 team-lead 給的說法寫「12 個專案舊版有 11 個與官方檔對不上、其中 9 個是寫稿者實跑發現」，不寫「六週跑不起來」。這兩個數字不是我核對出來的；我在掃描筆記裡逐週核對的是七週各有哪些對不上，沒有逐專案數過 12 與 11，也沒有分過哪 9 個是實跑發現。動筆前要有人把 12 個專案列成表，來源是七篇文章的更新紀錄、`.work/reviews/2026-10-13-cs50ai-w0*-review.md` 與 `git diff HEAD`。

備選（有全文，篇幅允許再加）：Ericson 等 2022 Parsons 文獻回顧（`R/ericson2022-parsons-slr.txt`，266,775）；Samuel 與 Mietchen 2024（`R/samuel2024-biomed-notebooks.txt`，188,736）；Lister 等 2004（`R/lister2004.txt`，122,291）；Sentance 等 2019 PRIMM（`R/sentance2019-primm.txt`，119,869）；2020 資料結構階層研究（`R/harrington2020-hierarchy-ds.txt`，45,519）；Cunningham 等 2017（`R/cunningham2017-sketching.txt`，49,941）。

### 目前找不到可精讀來源、所以不能寫的結論

- 「教學文裡的程式跑不起來會讓讀者學得比較差」：沒有任何來源量過。文章只能說公開程式多半跑不起來，加上本站案例，不能說對學習的影響。
- 「程式教學各種做法的平均效果量」（Scherer 2020 的 g 值）：只有摘要。
- 「live coding 的文獻回顧結論」：Selvaraj 2021 只有摘要；要寫只能靠 Muldner 2022 與 Shah 2023 自己的文獻段。
- 「到了進階課，追蹤與寫的先後會反過來」：提出這個說法的 Harrington 與 Cheng 2018 沒有全文。
- 「照著打程式（写経）有沒有用」：手上只有中田 2013 一篇短文（`R/nakada2013-shakyo.txt`，26,264，只有相關）與一張海報，撐不起一條結論。

### 我認為該列但沒有全文的

| 來源 | 為什麼該列 | 試過的管道 |
|---|---|---|
| Scherer, Siddiq, Sánchez Viveros 2020, Computers in Human Behavior 109, 10.1016/j.chb.2020.106349 | 程式教學唯一的量化統合 | ScienceDirect 直連、Jina、web.archive.org、Exa（只回摘要）；Oslo 大學 handle 轉到 JavaScript 頁 |
| Selvaraj 等 2021, Live Coding: A Review of the Literature, ITiCSE, 10.1145/3430665.3456382 | live coding 的回顧 | ACM 直連、Jina、web.archive.org、Exa（只回摘要） |
| Harrington 與 Cheng 2018, Tracing vs. Writing Code, SIGCSE, 10.1145/3159450.3159530 | 階層研究的反例 | ACM 直連、Jina、web.archive.org |
| Rubin 2013（live coding 對靜態範例，N=146）與 Raj 等 2020（Live-coding vs Static Code Examples, ACE, 10.1145/3373165.3373182） | Muldner 引的另外兩個 live coding 比較 | 沒有去拿過，只在 Muldner 3.1 看到轉述 |
| Mayer 1981 與 Bayman 與 Mayer 1988（notional machine 圖的原始實驗） | 「示意圖只對初學者有用」的一手來源 | 沒有去拿過 |

## order 4：記號、行話與術語（12 個來源，全部有全文）

| # | 來源 | DOI 或網址 | 要撐的結論 | 檔案與長度 | 之前讀到哪裡 |
|---|---|---|---|---|---|
| 1 | Bullock, Colón Amill, Shulman, Dixon 2019, Jargon as a barrier to effective science communication, Public Understanding of Science 28(7) | 10.1177/0963662519865687 | 行話讓一般讀者覺得難讀；隨選的定義救不回這個感受 | `R/bullock2019-jargon.pdf`、`.txt`，30,960 | 摘要、H1 推導、設計、H1 結果、限制；H2 以後沒讀 |
| 2 | Shulman 與 Bullock 2020, Don't dumb it down, PLOS ONE 15(10) | 10.1371/journal.pone.0239524 | **無效果的條件**：讀者有動機時行話沒有負面效果 | `R/shulman2020-covid-jargon.pdf`、`.txt`，35,323 | 摘要、結論、限制；結果段的統計量沒讀 |
| 3 | Yanagisawa, Webb, Uchihara 2020, How do different forms of glossing contribute to L2 vocabulary learning from reading?, SSLA 42(2)（作者稿） | 10.1017/S0272263119000688 | 有註解比沒有好；母語註解較好；緊貼字旁與文末詞彙表最弱 | `R/yanagisawa2020-glossing.pdf`、`.txt`，95,633 | 摘要、類型定義與編碼、討論兩段；結果表沒讀 |
| 4 | Head 等 2021, Augmenting Scientific Papers with Just-in-Time, Position-Sensitive Definitions of Terms and Symbols, CHI | 10.1145/3411764.3445648 | 把定義帶到讀者眼前省下翻找的時間 | `R/head2021-scholarphi.pdf`、`.txt`，116,275 | 摘要、研究概述、受試者、7.2 限制 |
| 5 | Head, Xie, Hearst 2022, Math Augmentation, CHI | 10.1145/3491102.3501932 | 作者實際怎麼加工公式、做起來多費工（實務端） | `R/head2022-math-aug.pdf`、`.txt`，118,700 | 摘要與前言 |
| 6 | Fawcett 與 Higginson 2012, Heavy use of equations impedes communication among biologists, PNAS 109(29) | 10.1073/pnas.1205259109 | 公式密度與引用數負相關；附錄裡的公式不算 | `R/fawcett2012.txt`（Jina 轉 PMC，沒有 PDF），36,248 | 摘要、結果、資料來源、方法第一段 |
| 7 | Kollmer, Pöschel, Gallas 2015, Are physicists afraid of mathematics?, New J. Phys. 17:013036 | 10.1088/1367-2630/17/1/013036 | **結果相反**：物理資料看不出明確趨勢，引用數太吵 | `R/kollmer2015.pdf`、`.txt`，30,355 | 摘要、前言、結論；第 2 節沒讀 |
| 8 | Higginson 與 Fawcett 2016 評論、Kollmer 等 2016 回覆, New J. Phys. 18:118003、118004 | 10.1088/1367-2630/18/11/118003、…/118004 | 雙方爭的是什麼；用物理資料重做的 −6% | `R/higginson2016-comment.txt`，13,883；`R/kollmer2016-reply.txt`，15,592（Jina 轉的，沒有 PDF） | 兩篇摘要、評論的重做段 |
| 9 | Stefik 與 Siebert 2013, An Empirical Investigation into Programming Language Syntax, ACM TOCE 13(4) | 10.1145/2534973 | 語法用什麼詞會影響新手；C 風格不比隨機關鍵字好 | `R/stefik2013-syntax.pdf`、`.txt`，221,586（篇幅大，建議單獨派） | 摘要、前言、結論、效度威脅開頭 |
| 10 | Hofmeister, Siegmund, Holt 2017, Shorter Identifier Names Take Longer to Comprehend, SANER | 10.1109/SANER.2017.7884623 | 完整單字的識別字比縮寫與單字母快 | `R/hofmeister2017-saner.pdf`、`.txt`，79,134 | 摘要與設計 |
| 11 | Guo 2018, Non-Native English Speakers Learning Computer Programming, CHI | 10.1145/3173574.3173970 | 非英語母語者讀英文教材卡在哪、想要什麼 | `R/guo2018-nonnative.pdf`、`.txt`，81,232 | 摘要、前言、方法、Table 1、設計限制 |
| 12 | Dasgupta 與 Hill 2017, Learning to Code in Localized Programming Languages, Learning@Scale | 10.1145/3051457.3051464 | 母語介面與關鍵字和學得較快有關（相關） | `R/dasgupta2017-localized.pdf`、`.txt`，37,039 | 摘要、前言、限制；模型段沒讀 |

實務端另有兩份短文不佔名額，寫的時候當論述引用：Olah 與 Carter 2017〈Research Debt〉（`R/olah2017-research-debt.txt`，21,055）、Google Technical Writing〈Words〉（`R/google-tw-words.txt`，11,661）。與 order 24（語言、翻譯與手機）重疊的是 #3、#11、#12，兩篇要先分好誰用。

備選：Landy, Allen, Zednik 2014（`R/landy2014-perceptual.txt`，63,940，綜述）；Lappi, Tirronen, Itkonen 2023（`R/stefik-replication2023.txt`，102,262）；Ainsworth 2006（`R/ainsworth2006-deft.txt`，80,540）。

### 目前找不到可精讀來源、所以不能寫的結論

- 「數學記號的選擇會影響學習者讀不讀得懂」：沒有以學習者理解為結果變項的來源。手上的是引用數（#6–8）、作者做法（#5）、研究者找資訊的時間（#4）。
- 「定義放在哪裡最有助於讀懂內容」：#3 量的是記住外語生字，#1 量的是自評流暢度，都不是理解。這條只能寫成缺口。
- 「中英並列的術語對中文讀者有沒有幫助」：沒有任何來源，中文與日文各查過幾組關鍵字，沒有進索引庫。
- 「術語密度多高算太高」：沒有來源。

### 我認為該列但沒有全文的

| 來源 | 為什麼該列 | 試過的管道 |
|---|---|---|
| Shulman, Dixon, Bullock, Colón Amill 2020, The Effects of Jargon on Processing Fluency, Self-Perceptions, and Scientific Engagement, J. Language and Social Psychology, 10.1177/0261927X20902177 | 行話研究的第三篇，量了自我認知與投入 | Sage 付費牆；OpenAlex 無開放版本 |
| Landy 與 Goldstone 2007, How abstract is symbolic thought?, JEP:LMC | 排版影響運算的原始實驗 | 沒有去拿過，只讀了 2014 綜述的轉述 |
| Hofmeister 等 2019 期刊版, Empirical Software Engineering, 10.1007/s10664-018-9621-x | 會議版的擴充 | Springer 付費牆；已用 2017 會議版代替 |
| 數學教育對符號理解的研究（例如等號的操作性理解一系） | 記號這一題最該有的一塊 | 一組查詢沒打中，之後沒再找 |

## order 7：該不該做互動（12 個來源，全部有全文）

| # | 來源 | DOI 或網址 | 要撐的結論 | 檔案與長度 | 之前讀到哪裡 |
|---|---|---|---|---|---|
| 1 | D'Angelo 等 2014, Simulations for STEM Learning: Systematic Review and Meta-Analysis, SRI International | https://www.sri.com/wp-content/uploads/2021/12/simulations-for-stem-learning-full-report.pdf | 課堂上用模擬的效果量，以及它的情境（K-12、多堂課） | `R/dangelo2014-sim.pdf`、`.txt`，149,189 | Exhibit 5、6、10、11、13、部分調節變項表、發表偏誤、限制 |
| 2 | Castro-Alonso 等 2019, Gender Imbalance in Instructional Dynamic Versus Static Visualizations, Educational Psychology Review 31 | 10.1007/s10648-019-09469-1 | 動態對靜態平均只多一點；沒有分析互動功能 | `R/castro-alonso2019.pdf`、`.txt`，93,654 | 摘要、納入標準、檢索、整體效果、發表偏誤、限制；調節變項表沒讀 |
| 3 | Berney 與 Bétrancourt 2016, Does animation enhance learning? A meta-analysis, Computers & Education 101 | 10.1016/j.compedu.2016.06.005 | 同上的第二份統合；步調由誰控制的調節結果 | `R/viz-berney2016.txt`，104,600；PDF 在 `.work/learning-visualization-research/src/berney2016.pdf` | 本輪只讀摘要 |
| 4 | Hundhausen, Douglas, Stasko 2002, A Meta-Study of Algorithm Visualization Effectiveness, JVLC 13(3) | 10.1006/jvlc.2002.0237 | 讀者拿它做什麼比它顯示什麼重要 | `R/viz-hundhausen2002.txt`，93,901；PDF 在 `.work/learning-visualization-research/src/hundhausen2002.pdf` | 摘要、圖 3 與其下兩段 |
| 5 | Kim, Reinecke, Hullman 2017, Explaining the Gap, CHI | 10.1145/3025453.3025592 | 圖上先畫預測有效；**同一實驗的文字條件無效** | `R/kim2017-explaining-gap.pdf`、`.txt`，64,325 | 摘要、假設、設計、受試者、Core Results、限制；理解題與穩健性檢查沒讀 |
| 6 | Mosca, Ottley, Chang 2021, Does Interaction Improve Bayesian Reasoning with Visualization?, CHI | 10.1145/3411764.3445176；arXiv:2103.01701 | **無效果或反向**：在靜態圖上加互動沒有幫助 | `R/mosca2021-interaction.pdf`、`.txt`，75,127 | 摘要、受試者、討論、限制；各條件數字沒讀 |
| 7 | Conlen, Kale, Heer 2019, Capture & Analysis of Active Reading Behaviors for Interactive Articles on the Web, EuroVis | 10.1111/cgf.13720 | 真實讀者有多少人動手、手機與桌機的差別 | `R/conlen2019-idyll-analytics.txt`，67,821；PDF 在 `.work/learning-visualization-research/src/conlen2019-idyll-analytics.pdf` | 摘要、第 1–2 節開頭、6.1–6.3、7.1 |
| 8 | Hohman, Conlen, Heer, Chau 2020, Communicating with Interactive Articles, Distill | 10.23915/distill.00028 | 圈內人自己對證據與成本的評估 | `R/hohman2020-distill.txt`，71,485（從 HTML 轉的） | 自我解釋段與後三節；前半沒讀 |
| 9 | Tse 2016 簡報與 Aisch 2017〈In Defense of Interactive Graphics〉 | https://github.com/archietse/malofiej-2016 ；https://www.vis4.net/blog/2017/03/in-defense-of-interactive-graphics/ | 紐約時報的 10–15% 與它被誤讀的地方 | `R/tse2016-malofiej.txt`，2,320；`R/aisch2017-defense.txt`，6,835 | 兩份都讀完 |
| 10 | Distill 編輯部 2021, Distill Hiatus | 10.23915/distill.00031；https://distill.pub/2021/distill-hiatus/ | 製作成本與志工倦怠 | `R/distill2021-hiatus.txt`，16,762 | 相關段落 |
| 11 | Red Blob Games（Amit Patel）, Making of: Introduction to A* 等三頁 | http://www.redblobgames.com/pathfinding/a-star/making-of.html | 一位熟手一篇要多久、怎麼做 | `R/redblob-astar-making.txt`，10,453；`R/redblob-making-line.txt`，22,892；`R/redblob-diagram-structure.txt`，9,806 | A* 那頁的開頭 |
| 12 | Ploetzner, Berney, Bétrancourt 2021, When learning from animations is more successful than learning from static pictures, Instructional Science 49 | 10.1007/s11251-021-09541-w | 動畫與靜態圖各擅長什麼 | `R/viz-ploetzner2021.md`，106,620（Jina 轉的） | 摘要 |

備選：Edgcomb 與 Vahid 2014（`R/edgcomb2014-zybooks.txt`，19,006；PDF 掛在廠商官網）；Tjärnhage 等 2023（`R/scrollytelling2023.txt`，n=12）；Tversky 等 2002（`R/viz-tversky2002.txt`，55,289）；Baur 2017（`R/baur2017-death.txt`）。#3、#4、#12 與 order 2（圖）共用，寫之前要確認那一篇是否已有抽取紀錄可以沿用。

### 目前找不到可精讀來源、所以不能寫的結論

- 「把控制權交給學習者，平均效果接近零」：Karich 2014 只有摘要、Landers 與 Reddock 2017 只拿到參考文獻。系列規劃已把這點列為 order 18 的卡點，這篇同樣不能寫。
- 「互動文章比同內容的靜態文章學得更好（或沒有差）」：沒有直接比較的來源。能寫的只有課堂模擬、資料圖表與讀者行為三種旁證。
- 「互動教科書的互動功能實際使用率」：Ericson 2015 沒有全文。
- 「簡單的可調參數圖成本多少」：手上的成本數字都來自高規格作者。

### 我認為該列但沒有全文的

| 來源 | 為什麼該列 | 試過的管道 |
|---|---|---|
| Karich, Burns, Maki 2014, Updated Meta-Analysis of Learner Control Within Educational Technology, RER 84(3), 10.3102/0034654314526064 | 學習者控制的統合，結果接近零 | Sage 付費牆、ERIC（無全文）、web.archive.org；作者頁與 OSF 沒試 |
| Landers 與 Reddock 2017, A Meta-Analytic Investigation of Objective Learner Control in Web-based Instruction, J. Business and Psychology, 10.1007/s10869-016-9452-y | 同題的第二份統合 | Springer 付費牆，Jina 只回參考文獻 |
| Ericson 等 2015, Usability and Usage of Interactive Features in an Online Ebook for CS Teachers, WiPSCE, 10.1145/2818314.2818335 | 互動教科書裡誰用了什麼 | digitalcommons 驗證頁、Jina |
| Banerjee 等（程式視覺化工具上的預測，N=78、231） | 「先預測」在程式上無效的一手來源 | 沒有去拿過，只在 Muldner 2.3.3 看到轉述 |
| Bartosz Ciechanowski 本人談製作過程的文字 | 最常被舉的互動文章作者 | 只找到第三方介紹，沒找到本人說法 |

## 派工時要注意

- 清單裡的 DOI 有七個已用 OpenAlex 核對題名與年份（Morrison 2020、Pimentel 2019、Yanagisawa 2020、Hofmeister 2017、Distill Hiatus、Hundhausen 2002、Hohman 2020）；其餘取自原文首頁或掃描筆記，精讀時順手對首頁。
- 幾個檔案是 Jina 或 HTML 轉出的文字，沒有 PDF：Margulieux 2020、Fawcett 2012、2016 的評論與回覆、Hohman 2020、Ploetzner 2021。精讀前先確認轉檔完整（表格與圖說有沒有掉）。
- 超過 20 萬字元的三份（Ericson 2023、Stefik 2013、備選的 Ericson 2022）不適合和別的來源塞給同一個 agent。
