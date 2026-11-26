# Research: 文字、圖、影片之外，內容還能怎麼呈現（互動、程式碼、記號與術語）

代號：q2-interactive。日期：2026-10-13。上層範圍：`.research/2026-10-13-learning-content-series-scope.md` 的子問題 2。
原文存檔：`.research/raw/learning-content/q2-interactive/`（PDF 旁的同名 `.txt` 是 `pdftotext` 轉出的；`viz-` 開頭的是從 `.work/learning-visualization-research/src/` 複製來的同一份檔案）。

toolDegradation：Groundlane MCP 不在本 session 工具清單（ToolSearch 查 groundlane 無結果）；Groundlane 直接 HTTP 回 401。搜尋改用 Keenable keyless API（要帶 `X-Keenable-Title` 標頭才通），找開放版本用 OpenAlex API，抓取用 curl、Jina keyless reader（`r.jina.ai`，本輪可用）與 Exa。ACM Digital Library、ScienceDirect、IOP、Sage、digitalcommons.unomaha.edu 都擋 curl 與 Jina；Springer 付費文章用 Jina 只回參考文獻。

**讀取深度（第二輪後）**：第一輪多數來源只讀了摘要。第二輪把會進結論的來源補讀了方法、結果與限制段，補拿了 Muldner 2022 全文、Stefik 與 Siebert 2013、Ainsworth 2006、Sentance 2019、Hofmeister 2017 會議版、Higginson 與 Fawcett 2016 評論與 Kollmer 回覆。補讀改掉了第一輪的三個結論（Kim 2017 的文字條件、Yanagisawa 2020 的註解位置、Nelson 2017 的顯著性），改動處在下文標「第二輪更正」。仍然沒有任何一篇是從頭讀到尾，每個來源讀了哪幾段寫在盤點表。

## 選案（步驟 0）

### 母群定義

算：一份給人自學的公開內容，在文字、靜態圖、影片之外可以採用的呈現方式，而且有人量過它對理解、學習或實際使用行為的影響，或有做內容的人留下可查的製作紀錄。分三塊：(1) 讀者可以操作的東西（可調參數的圖、模擬、預測後揭曉、捲動觸發、互動教科書）；(2) 程式碼當教學內容（例題、子目標標籤、Parsons 題、追蹤、現場寫、可執行筆記本，以及「貼出來的程式能不能跑」）；(3) 記號、術語與抽象的選擇（公式密度、符號排版、行話、定義放哪、母語註解、識別字命名）。

不算：VR／AR 與沉浸式環境、嚴肅遊戲、智慧家教系統本身、醫學與職訓的情境模擬（高教 simulation-based learning 那一支）、純資料新聞的互動圖表設計（只取「讀者會不會動手」的數據）、AI 產生程式碼的教學（歸子問題 6）。

### 掃描方法與掃到的清單

24 組 Keenable 查詢（查詢字串與回傳存在 scratchpad，未入 raw），加上 Ericson 等 2022 與 Muldner 等 2022 兩份回顧的分類架構、explorabl.es 的作品總表、範圍檔已列的 Distill／Matuschak／ICER。之後用 OpenAlex 逐篇查開放版本與撤稿狀態（查到的都是 `is_retracted: false`）。

| 區塊 | 掃到的（粗體為選入深讀） |
|---|---|
| 互動：統合與回顧 | **D'Angelo 等 2014（K-12 STEM 模擬）**、**Castro-Alonso 等 2019（動態對靜態）**、**Berney 與 Bétrancourt 2016**、Höffler 與 Leutner 2007、**Karich 等 2014（learner control）**、Landers 與 Reddock 2017（learner control，網路教學）、Rey 等 2019（segmenting，文字研究已讀）、Chernikova 等 2020（高教模擬，不在母群）、2025 K-12 模擬統合（J Sci Educ Technol）、2025 互動學習環境 network meta、PhET 系統性回顧 2026、Rutten 等 2012、**Hundhausen 等 2002（演算法視覺化）**、Naps 等 2002、Ploetzner 等 2020／**2021**、**Tversky 等 2002** |
| 互動：讀者行為與單篇實驗 | **Conlen 等 2019（五萬次閱讀紀錄）**、**Tse 2016**、**Aisch 2017**、**Baur 2017**、**Kim 等 2017（先預測再看資料）**、**Mosca 等 2021（互動沒幫助）**、**Tjärnhage 等 2023（scrollytelling）**、**Edgcomb 與 Vahid 2014（zyBooks）**、Ericson 等 2015（ebook 互動功能使用率）、Pollari-Malmi 等 2017、OpenDSA 研究、Dragicevic 等 2019（explorable multiverse）、Evans 與 Gibbons 2007 |
| 互動：實務端 | **Hohman 等 2020**、**Victor 2011**、**Case〈How I Make Explorable Explanations〉**、**Red Blob Games making-of 三頁**、**Distill 2021 停刊聲明**、**Matuschak〈Why books don't work〉**、**explorabl.es/all**、Ciechanowski（只找到第三方介紹）、Parametric Press、Idyll、zenn 上 seya 的日文整理 |
| 程式碼：統合與回顧 | **Scherer 等 2020**、**Muldner 等 2022**、**Ericson 等 2022（Parsons WG）**、**Ericson 等 2023（多校 Parsons）**、Du 等 2020、**Selvaraj 等 2021（live coding）**、**Lister 等 2004** |
| 程式碼：單篇 | **Margulieux 等 2020**、**Morrison 等 2020**、Margulieux 與 Catrambone 2019、**Shah 等 2023**、Shah 等 2025、**Raj 等 2018**、Su 2025（教師觀點）、**Xie 等 2018**、**Nelson 等 2017**、**Cunningham 等 2017**、**Lopez 等 2008**、**Venables 等 2009**、Harrington 與 Cheng 2018、**2020 資料結構階層研究（UTS）**、Gaweda 等 2020（typing exercises）、**中田 2013（写経，日文）**、Sentance 等 2019（PRIMM）、翁浴芳 2005（臺師大碩論，程式設計電子教科書） |
| 程式碼：能不能跑、會不會過期 | **Pimentel 等 2019**、**Samuel 與 Mietchen 2024**、**Horton 與 Parnin 2018**、**Yang 等 2016**、**Zhang 等 2018**、**Tan 等 2023**、**Aghajani 等 2019**、Wang 等 2020、Johnson 2020、Ragkhitwetsagul 等 2019 |
| 記號與術語 | **Fawcett 與 Higginson 2012**、**Kollmer 等 2015**、Higginson 與 Fawcett 2016 評論與回覆、**Landy 等 2014**、**Head 等 2021（ScholarPhi）**、**Head 等 2022（math augmentation）**、**Bullock 等 2019**、Shulman 等 2020a（JLSP）、**Shulman 與 Bullock 2020b（PLOS ONE）**、**Yanagisawa 等 2020（glossing 統合）**、**Hofmeister 等 2019**、Stefik 與 Siebert 2013、**Lappi 等 2023（Stefik 複製研究）**、**Guo 2018**、**Dasgupta 與 Hill 2017**、Vander Beken 與 Brysbaert 2018（文字研究已讀）、**Olah 與 Carter 2017**、**Google Technical Writing〈Words〉**、Ainsworth 2006（DeFT）、glosario 多語詞彙表專案 |

### 覆蓋矩陣

| 維度 | 值 | 選入 | 缺口 |
|---|---|---|---|
| 證據類型 | 統合分析 | D'Angelo、Castro-Alonso、Berney、Karich、Scherer、Yanagisawa、Hundhausen（計票式） | Parsons、subgoal、live coding 都沒有量化統合，只有敘述性回顧 |
| | 單篇隨機或準實驗 | Kim、Mosca、Margulieux、Shah、Xie、Nelson、Bullock、Shulman、Hofmeister、Edgcomb | |
| | 真實環境的行為或語料 | Conlen（閱讀紀錄）、Dasgupta（Scratch）、Pimentel／Samuel／Horton／Yang／Tan（程式語料）、Fawcett／Kollmer（引用數） | 沒有「互動文章對學習成效」的實地資料，只有使用行為 |
| | 實務端 | Hohman、Victor、Case、Red Blob、Distill 停刊、Tse、Aisch、Google TW | Ciechanowski 沒有一手製作紀錄；3Blue1Brown 歸影片研究 |
| 結果方向 | 正向 | D'Angelo、Kim、Xie、Margulieux（小考）、Yanagisawa | |
| | 沒有效果或反向 | Karich、Mosca、Kim（文字條件）、Shah、Nelson（不顯著）、Margulieux（期考）、Ericson 2023（Parsons 對寫程式）、Bullock（定義無效）、Muldner 整理的各項虛無結果、Stefik（C 語法不比隨機好）、Kollmer（反駁） | |
| 對象 | K-12 | D'Angelo、Dasgupta | |
| | 大學初學者 | 程式教育全部 | |
| | 成人、專業者、一般網路讀者 | Conlen、Kim、Mosca（AMT）、Bullock、Hofmeister（72 位職業開發者）、Guo | 沒有「自學者讀長篇技術文」的學習成效實驗 |
| 語言 | 非英語 | 中田 2013（日文）、翁浴芳 2005（中文摘要）、Tjärnhage 2023（瑞典語施測）、Dasgupta（五國在地化）、Guo（86 國） | 中文、日文的互動教材統合與雙語術語實驗都沒找到，見偏誤 |
| 時間 | 2010 前／2010–2019／2020 後 | Hundhausen 2002、Lister 2004／多數／Scherer、Margulieux、Ericson、Shah、Samuel、Tan | |

缺口補搜一輪（中日文八組查詢）：臺灣找到 VR 後設分析（廖遠光 2023，不在母群）與一篇 2005 年程式設計電子教科書碩論；日文找到写経的學會論文一篇與 zenn 上一份實務者整理；「中英對照術語對理工學生閱讀的影響」「原文書對學習成效」只找到評論文章與對照表，沒有實驗研究。

### 偏誤

- 英語圈、美國大學的 CS1 課堂佔絕大多數。中文與日文我找過 Keenable 的八組查詢（關鍵字見上），沒有系統性查華藝、CiNii、知網的索引，所以「找不到」只代表這八組查詢找不到。
- 程式教育的研究對象幾乎都是修課學生，有成績壓力、有助教；自學者沒有這些。
- 互動這一塊的實務端名單（Victor、Case、Red Blob、Ciechanowski、Distill）是任務書給的加上我本來知道的。explorabl.es 總表有 180 筆，我只確認了筆數，沒有逐筆看，也沒有從裡面抽樣。
- 「程式跑不起來」的語料研究量的是 GitHub、Stack Overflow 與論文附的筆記本，不是教學文章。
- 沒有效果的研究我刻意找了，但發表偏誤仍在：D'Angelo 的 trim-and-fill 沒有補值，不代表沒有抽屜裡的研究。

## 子問題

1. 互動（讀者可以操作內容）比同樣內容的靜態版本多學到多少？靠的是哪一種互動？
2. 讀者實際會不會動手？做一篇互動文章的成本是多少？
3. 文章裡的程式碼要長什麼樣子，初學者才學得到東西（例題、子目標標籤、Parsons、追蹤、現場寫）？
4. 貼出來的程式有多少跑不起來、多久會過期？這件事和教學設計哪個先？
5. 記號、行話與術語的選擇對讀者有多大影響？定義、註解、翻譯放哪裡有用？
6. 這幾種呈現方式和文字、圖、影片什麼時候互相取代、什麼時候互補？

## 來源清單

等級依 `source-quality-criteria.md`；訪問日皆為 2026-10-13。

互動
- [Hohman, Conlen, Heer, Chau 2020, Communicating with Interactive Articles, Distill](https://distill.pub/2020/communicating-with-interactive-articles/) — 一手作者（實務者兼研究者的整理）；全文存檔、讀部分
- [Conlen, Kale, Heer 2019, Capture & Analysis of Active Reading Behaviors, EuroVis](https://idl.cs.washington.edu/files/2019-IdyllAnalytics-EuroVis.pdf) — A；全文存檔、讀部分
- [Tse 2016, Malofiej 簡報](https://github.com/archietse/malofiej-2016/raw/master/tse-malofiej-2016-slides.pdf) — B；全文
- [Aisch 2017, In Defense of Interactive Graphics](https://www.vis4.net/blog/2017/03/in-defense-of-interactive-graphics/)（經 web.archive.org 取得）— B；全文
- [Baur 2017, The death of interactive infographics?](https://medium.com/@dominikus/the-end-of-interactive-visualizations-52c585dcafcb) — B；讀開頭
- [D'Angelo 等 2014, Simulations for STEM Learning, SRI](https://www.sri.com/wp-content/uploads/2021/12/simulations-for-stem-learning-full-report.pdf) — B（機構報告，非期刊）；全文存檔、讀部分
- [Castro-Alonso 等 2019, Educational Psychology Review](https://repub.eur.nl/pub/114594/Repub-114594.pdf) — A；全文存檔、讀部分
- [Berney 與 Bétrancourt 2016, Computers & Education](https://access.archive-ouverte.unige.ch/access/metadata/75bf6876-cb91-4e2c-8ac6-9d0767449449/download) — A；圖像化研究已存檔，本輪只讀摘要
- [Ploetzner 等 2021, Instructional Science](https://link.springer.com/article/10.1007/s11251-021-09541-w) — A；圖像化研究已存檔，本輪只讀摘要
- [Tversky, Morrison, Bétrancourt 2002, IJHCS](https://hci.stanford.edu/courses/cs448b/papers/Tversky_AnimationFacilitate_IJHCS02.pdf) — A；讀摘要與談互動的兩段
- [Hundhausen, Douglas, Stasko 2002, JVLC](https://faculty.cc.gatech.edu/~stasko/papers/jvlc02.pdf) — A；讀摘要與圖 3 文字
- [Karich, Burns, Maki 2014, Review of Educational Research](https://doi.org/10.3102/0034654314526064) — A；摘要（[experts.umn.edu](https://experts.umn.edu/en/publications/updated-meta-analysis-of-learner-control-within-educational-techn/)）
- [Kim, Reinecke, Hullman 2017, CHI](https://mucollective.northwestern.edu/files/2017-ExplainingTheGap-CHI.pdf) — A；全文存檔、讀部分
- [Mosca, Ottley, Chang 2021, CHI](https://arxiv.org/pdf/2103.01701) — A；全文存檔、讀部分
- [Tjärnhage 等 2023, ECCE](https://digitaleconomy.wales/documents/ecce-2023-papers/06-The-Impact-of-Scrollytelling.pdf) — C（n=12）；全文存檔、讀部分
- [Edgcomb 與 Vahid 2014, ASEE](https://zybooks.com/wp-content/uploads/2016/06/Effectiveness-of-Online-Textbooks-vs.-Interactive-Web-Native-Content.pdf) — B，PDF 掛在 zyBooks 官網；讀摘要
- [Victor 2011, Explorable Explanations](http://worrydream.com/ExplorableExplanations/) — B；讀開頭
- [Case, How I Make Explorable Explanations](https://blog.ncase.me/how-i-make-an-explorable-explanation/) — B；讀部分
- Red Blob Games：[Making of: Introduction to A*](http://www.redblobgames.com/pathfinding/a-star/making-of.html)、[Making of: Line drawing](https://www.redblobgames.com/making-of/line-drawing/)、[Diagram structure](https://www.redblobgames.com/making-of/diagram-structure/) — B；A* 那頁讀開頭，另兩頁只存檔
- [Distill 2021, Distill Hiatus](https://distill.pub/2021/distill-hiatus/) — A（編輯部聲明）；讀相關段落
- [Matuschak 2019, Why books don't work](https://andymatuschak.org/books/) — B；讀開頭
- [explorabl.es/all](https://explorabl.es/all) — 社群目錄；只確認筆數
- [seya 2026, Explorable Explanation（zenn scrap，日文）](https://zenn.dev/seya/scraps/7536fa7ef87774) — C（實務者二手整理）；讀開頭

程式碼
- [Scherer, Siddiq, Sánchez Viveros 2020, Computers in Human Behavior](https://www.sciencedirect.com/science/article/pii/S0747563220301023) — A；摘要與 highlights
- [Muldner, Jennings, Chiarelli 2022, ACM TOCE](https://dl.acm.org/doi/10.1145/3560266) — A；全文經 web.archive.org 取得（`muldner2022-wb.pdf`）；讀第 1 節、2.1–2.2、2.3.3、3.1、6.1 全部
- [Sentance, Waite, Kallia 2019, Teaching computer programming with PRIMM, Computer Science Education（作者稿）](https://primmportal.com/wp-content/uploads/2020/10/teaching-computer-programming-with-primm-a-sociocultural-perspective.pdf) — A；摘要、研究設計段、結論
- [Ericson 等 2022, Parsons Problems and Beyond, ITiCSE-WGR](https://juholeinonen.com/assets/pdf/ericson2022parsons.pdf) — A；全文存檔、讀部分
- [Ericson 等 2023, Multi-Institutional Multi-National Studies of Parsons Problems, ITiCSE-WGR](https://repository.falmouth.ac.uk/5216/1/ITiCSE_2023_WorkingGroup_Parsons_Report.pdf) — A；全文存檔、讀部分
- [Margulieux, Morrison, Decker 2020, Int. J. STEM Education](https://stemeducationjournal.springeropen.com/articles/10.1186/s40594-020-00222-7) — A；全文存檔、讀部分
- [Morrison, Margulieux, Decker 2020, The curious case of loops](https://par.nsf.gov/servlets/purl/10301529) — A；摘要與結論
- [Shah 等 2023, An Empirical Evaluation of Live Coding in CS1, ICER](https://par.nsf.gov/servlets/purl/10491207) — A；摘要與結論
- [Raj 等 2018, Role of Live-coding, Koli Calling](https://pages.cs.wisc.edu/~gerald/papers/LiveCoding.pdf) — B；摘要與結論
- [Selvaraj 等 2021, Live Coding: A Review of the Literature, ITiCSE](https://dl.acm.org/doi/10.1145/3430665.3456382) — A；摘要
- [Xie, Nelson, Ko 2018, SIGCSE](https://faculty.washington.edu/ajko/papers/Xie2018TracingStrategies.pdf) — A；摘要與受試者
- [Nelson, Xie, Ko 2017, ICER](https://faculty.washington.edu/ajko/papers/Nelson2017PLTutor.pdf) — A；摘要與樣本
- [Cunningham 等 2017, ICER](https://gvu.gatech.edu/sites/default/files/related_project_files/p164-cunningham.pdf) — A；摘要
- [Lister 等 2004, ITiCSE WG](https://opus.lib.uts.edu.au/bitstream/10453/4126/3/2004000904.pdf) — A；摘要
- [Lopez 等 2008, ICER](https://opus.lib.uts.edu.au/bitstream/10453/10806/1/2008001530.pdf)、[Venables 等 2009, ICER](https://opus.lib.uts.edu.au/bitstream/10453/12063/1/2009002693.pdf)、[On the Evidence for a Learning Hierarchy in Data Structures Exams 2020, ACE](https://opus.lib.uts.edu.au/bitstream/10453/138544/4/On%20the%20Evidence%20for%20a%20Learning%20Hierarchy%20in%20Data%20Structures.pdf) — A；皆只讀摘要
- [中田豊久 2013, 写経プログラミングの学習効果に関する考察, JSAI](https://www.ai-gakkai.or.jp/jsai2013/webprogram/2013/pdf/61.pdf) — B；摘要與前言
- [Pimentel 等 2019, MSR](https://leomurta.github.io/papers/pimentel2019a.pdf) — A；摘要與結果相關段
- [Samuel 與 Mietchen 2024, GigaScience](https://pmc.ncbi.nlm.nih.gov/articles/PMC10783158/) — A；摘要
- [Horton 與 Parnin 2018, Gistable](https://arxiv.org/pdf/1808.04919) — A（ICSME，本輪讀 arXiv 版）；摘要與前言
- [Yang, Hussain, Lopes 2016, MSR](https://arxiv.org/pdf/1605.04464) — A；摘要與結果表說明
- [Zhang 等 2018, ICSE](http://web.cs.ucla.edu/~miryung/Publications/icse2018-ExampleCheck.pdf) — A；摘要
- [Tan, Wagner, Treude 2023, Empirical Software Engineering（arXiv 2212.01479）](https://arxiv.org/pdf/2212.01479) — A；摘要與結果段
- [Aghajani 等 2019, ICSE](https://csnagy.github.io/research/pdfs/2019/Aghajani2019-preprint.pdf) — A；摘要

記號與術語
- [Fawcett 與 Higginson 2012, PNAS](https://pmc.ncbi.nlm.nih.gov/articles/PMC3406806/) — A；摘要、資料與方法段
- [Kollmer, Pöschel, Gallas 2015, New Journal of Physics](https://iopscience.iop.org/article/10.1088/1367-2630/17/1/013036)（經 web.archive.org 取得作者機構副本）— A；摘要、前言、結論
- [Landy, Allen, Zednik 2014, Frontiers in Psychology](https://www.frontiersin.org/articles/10.3389/fpsyg.2014.00275/pdf) — A（理論綜述）；摘要與前言
- [Head 等 2021, ScholarPhi, CHI](https://arxiv.org/pdf/2009.14237) — A；摘要與研究概述段
- [Head, Xie, Hearst 2022, Math Augmentation, CHI](https://people.ischool.berkeley.edu/~hearst/papers/maugs_chi2022.pdf) — A；摘要
- [Bullock 等 2019, Public Understanding of Science](https://comm.osu.edu/sites/comm.osu.edu/files/PUS%202019-%20Bullock%20et%20al..pdf) — A；摘要、設計、H1 結果
- [Shulman 與 Bullock 2020, PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0239524) — A；摘要與結論
- [Yanagisawa, Webb, Uchihara 2020, SSLA（作者稿）](https://takumiuchihara.weebly.com/uploads/1/2/3/7/123756989/yanagisawa-webb-uchihara-2019-glossing_meta-analysis.pdf) — A；摘要與討論的註解語言段
- [Hofmeister, Siegmund, Holt 2019, Empirical Software Engineering](https://link.springer.com/article/10.1007/s10664-018-9621-x) — A；摘要。同一研究的 [2017 SANER 會議版](https://www.se.cs.uni-saarland.de/publications/docs/HoSeHo17.pdf) 全文存檔，讀摘要與設計
- [Stefik 與 Siebert 2013, An Empirical Investigation into Programming Language Syntax, ACM TOCE](https://www.vidarholen.net/~vidar/An_Empirical_Investigation_into_Programming_Language_Syntax.pdf)（第三方網站上的副本）— A；摘要、結論、效度威脅段開頭。另存 [Neil Brown 2018 的導讀投影片](http://twistedsquare.com/PWL-Stefik.pdf)（C，二手）
- [Higginson 與 Fawcett 2016, Comment, New J. Phys. 18:118003](https://iopscience.iop.org/article/10.1088/1367-2630/18/11/118003) 與 [Kollmer 等 2016, Reply, 18:118004](https://iopscience.iop.org/article/10.1088/1367-2630/18/11/118004) — A；經 Jina 取得，讀摘要與統計結果段
- [Ainsworth 2006, DeFT, Learning and Instruction](https://www.inf.ufpr.br/alexd/REPRESENTACOES_EXTERNAS/Ainsworth_2006.pdf)（課程網站上的副本）— A；摘要、第 2 節片段、結論
- [Lappi, Tirronen, Itkonen 2023, A replication study on the intuitiveness of programming language syntax, Software Quality Journal](https://link.springer.com/article/10.1007/s11219-023-09631-7) — A；前言片段（作者與年份經 OpenAlex 核對）；它複製的是 Stefik 與 Gellenbeck 2011，不是 Stefik 與 Siebert 2013
- [Guo 2018, CHI](https://pg.ucsd.edu/publications/non-native-english-speakers-learning-programming_CHI-2018.pdf) — A；摘要與設計限制段
- [Dasgupta 與 Hill 2017, Learning@Scale](https://mako.cc/academic/dasgupta_hill-learning_code_localization-L@S2017.pdf) — A；摘要與限制段
- [Olah 與 Carter 2017, Research Debt, Distill](https://distill.pub/2017/research-debt/) — B；讀談記號與 interpretive labor 的段落
- [Google Technical Writing One: Words](https://developers.google.com/tech-writing/one/words) — 官方課程；讀定義與一致性兩節

本站
- `.work/reviews/2026-10-13-cs50ai-w00-review.md` 到 `w06`（獨立審稿報告）、`.agents/skills/post/references/course-guide-contract.md`

## 讀取完整度盤點

✅＝全文存檔，且讀了摘要、樣本與設計、會進結論的結果段。🟡＝只讀摘要與少數段落，或只拿到部分。🔴＝沒讀到正文。

| 來源 | 程度 | 實際讀的 | 阻礙 |
|---|---|---|---|
| Conlen 2019 | ✅ | 摘要、第 1–2 節開頭、6.1–6.3 的統計、7.1 | 無 |
| Tse 2016 | ✅ | 全部投影片文字 | 無 |
| Aisch 2017 | ✅ | 全文含註腳 | 原站擋 curl，用 web.archive.org |
| D'Angelo 2014 | ✅ | Exhibit 5、6、10、11、13、調節變項表數段、發表偏誤段、限制段 | 前言與納入標準全文沒讀 |
| Castro-Alonso 2019 | ✅ | 摘要、納入標準、檢索段、整體效果段、發表偏誤段、限制段 | 各調節變項的數值表（Table 4、5）轉檔後欄位錯開，沒有逐格讀 |
| Kim 2017 | ✅ | 摘要、假設、設計、受試者、Core Results（圖與文字兩種條件）、限制段 | 理解題與另外兩個資料集的穩健性檢查沒讀 |
| Mosca 2021 | ✅ | 摘要、兩個實驗的受試者、討論、限制段 | 各條件的正確率數字沒讀 |
| Hundhausen 2002 | ✅ | 摘要、圖 3（轉成圖檔核對）與其下兩段 | 其餘沿用圖像化研究的閱讀 |
| Bullock 2019 | ✅ | 摘要、H1 推導、設計、H1 結果、限制段 | H2 以後的中介模型沒讀 |
| Shulman 2020b | ✅ | 摘要、結論、限制段 | 結果段的統計量沒讀 |
| Margulieux 2020 | ✅ | 樣本段、小考與期考結果、缺考與及格門檻段、限制段、結論 | SOLO 評分的分析沒讀 |
| Shah 2023 | ✅ | 摘要、5.1 方法、7.1 重點整理、7.3 效度威脅、結論 | 第 6 節各項檢定的數值沒逐一讀 |
| Muldner 2022 | ✅ | 第 1 節、2.1、2.2、2.3.3、3.1、6.1.1–6.1.5 | 2.3.1–2.3.2、3.2–3.3、第 4–5 節正文沒讀，靠 6.1 的作者總結 |
| Ericson 2023 | ✅ | 摘要、結論、Parsons 對寫程式那一項研究的結果段、干擾項研究的結果段 | 其餘各校的研究沒讀 |
| Nelson 2017 | ✅ | 摘要、樣本、結果段的組間比較、PLTutor 限制段開頭 | 無 |
| Lister 2004 | ✅ | 摘要、資料蒐集與分數分布（第 2–3 節開頭） | 訪談與塗鴉分析沒讀 |
| Yang 2016 | ✅ | 摘要、方法概述、Table 2 說明 | 無 |
| Tan 2023 | ✅ | 摘要、前言結果句、結果段的比例 | 無 |
| Samuel 2024 | ✅ | 摘要、Exceptions 段、討論開頭 | 限制段沒找到明確段落 |
| Dasgupta 2017 | ✅ | 摘要、前言、限制段 | 模型段沒讀 |
| Xie 2018 | ✅ | 摘要、受試者 | 無 |
| Fawcett 2012 | ✅ | 摘要、結果段、資料來源、方法第一段 | 無 |
| Higginson 2016 評論、Kollmer 2016 回覆 | ✅ | 兩篇的摘要；評論的統計重做段 | 回覆的正文只讀開頭 |
| Yanagisawa 2020 | ✅ | 摘要、註解類型的定義與編碼、討論的註解類型與語言段 | 結果表的迴歸係數沒讀 |
| Head 2021 | ✅ | 摘要、研究概述、可用性研究的受試者、7.2 限制 | 無 |
| Guo 2018 | ✅ | 摘要、前言、方法、Table 1、設計限制段 | 各類障礙的細項沒讀 |
| Stefik 與 Siebert 2013 | 🟡 | 摘要、前言、結論、效度威脅段開頭 | 四個研究的方法與數字沒讀；受試者人數取自二手投影片 |
| Sentance 2019 | 🟡 | 摘要、研究設計段、結論 | 後測的統計量沒讀 |
| Ainsworth 2006 | 🟡 | 摘要、第 2 節片段、結論 | 概念框架，只取定義 |
| Hohman 2020 | 🟡 | 自我解釋段、Challenges for Authoring、Critical Reflections、Looking Forward | 前半各領域的整理沒讀 |
| Kollmer 2015 | 🟡 | 摘要、前言、結論 | 第 2 節的圖表分析沒讀 |
| Pimentel 2019 | 🟡 | 摘要、方法的執行環境段、結果相關兩段 | 效度威脅段只讀開頭 |
| Horton 2018、Zhang 2018、Aghajani 2019 | 🟡 | 摘要；Horton 另讀前言與一段開發者回饋，Zhang 另讀方法片段，Aghajani 另讀前言 | 都只用到摘要裡的數字 |
| Morrison 2020、Raj 2018 | 🟡 | 摘要與結論；Raj 另讀受試者段 | Morrison 的樣本數沒找到 |
| Cunningham 2017、Lopez 2008、Venables 2009、2020 階層研究 | 🟡 | 摘要；後三篇另讀樣本數 | 都是相關研究，只用到摘要的結論 |
| Ericson 2022 | 🟡 | 摘要、4.4.1 學習成效段、4.4.2 開頭 | 265,000 字元只讀這幾段 |
| Hofmeister 2019／2017 | 🟡 | 期刊版摘要；會議版摘要與設計 | 期刊版 Springer 付費牆；會議版結果表沒讀 |
| Landy 2014、Head 2022、Lappi 2023 | 🟡 | 摘要加前言；Lappi 另讀受試者段 | Landy 是綜述，原始實驗沒讀 |
| Edgcomb 2014、Tjärnhage 2023 | 🟡 | 摘要；Tjärnhage 另讀方法與受試者 | 無 |
| Berney 2016、Ploetzner 2021、Tversky 2002 | 🟡 | 摘要；Tversky 另讀談互動的兩段 | 圖像化研究已讀過正文，本輪沒重讀 |
| Olah 2017、Distill 2021、Victor 2011、Matuschak 2019、Case、Red Blob A* making-of、Baur 2017、Google TW | 🟡 | 與本題相關的段落 | 無 |
| 中田 2013 | 🟡 | 英文摘要與日文前言 | 無 |
| seya 2026（zenn） | 🟡 | 開頭兩段 | 二手整理，只當線索 |
| Scherer 2020 | 全文已取得、尚未精讀 | 第一輪讀的摘要與 highlights；全文沒讀 | 2026-10-14 從挪威國家研究典藏 NVA 的公開檔取得出版版 PDF：`.research/raw/learning-content/q2/scherer2020-prog-meta.pdf`、`.txt`（182,824 字元） |
| Karich 2014 | 🟡 [摘要層級] | 摘要 | 仍無全文，管道見下方「第三輪找全文」。另存了慕尼黑工大 Clearinghouse 的德文四頁摘要評述（二手）：`q2/karich2014-tum-kurzreview.pdf`（16,489 字元） |
| Selvaraj 2021 | 全文已取得、尚未精讀 | 第一輪讀的摘要；全文沒讀 | 2026-10-14 經 Exa 取得 ACM 出版版的文字：`q2/selvaraj2021-livecoding-review.exa.md`（45,058 字元，含參考文獻；是轉出的文字不是 PDF） |
| Gaweda 2020 | 🟡 | 拿到的是海報不是論文 | ACM 擋 |
| Harrington 與 Cheng 2018 | 全文已取得、尚未精讀 | 沒讀 | 2026-10-14 經 Exa 取得 ACM 出版版的文字：`q2/harrington-cheng2018-tracing-writing.exa.md`（28,147 字元） |
| Ericson 2015（ebook 互動功能使用率） | 全文已取得、尚未精讀 | 沒讀 | 2026-10-14 經 Exa 取得：`q2/ericson2015-ebook-usage.exa.md`（59,554 字元） |
| Johnson 2020（Jupyter 課堂利弊） | 🟡 | 2026-10-14 經 Exa 取回全文，只在工具輸出裡看過，沒有存檔也沒有逐段讀；是作者的教學經驗與建議，不是實證研究 | 要用的話重抓一次存檔 |
| Shulman 等 2020a（JLSP） | 🔴 | 無 | Sage 付費牆 |
| Landers 與 Reddock 2017、2025 K-12 模擬統合 | 🔴 | Jina 只回參考文獻 | Springer 付費牆 |
| Chernikova 2020 | 存檔未讀 | 無 | 不在母群，沒用 |

統計（第三輪後）：✅ 26、🟡 約 29（摘要層級剩 Karich 1 個）、全文已取得尚未精讀 4（Scherer、Selvaraj、Harrington 與 Cheng、Ericson 2015）、🔴 3（Shulman 2020a、Landers 與 Reddock 2017、2025 K-12 模擬統合）。另外新取得 Raj 等 2020（live coding 對靜態範例的實驗）全文：`q2/raj2020-livecoding-vs-static.exa.md`（51,920 字元）與作者投影片 `q2/raj2020-livecoding-slides.pdf`。這一輪只存檔，沒有讀內容，結論沒有動。

### 第三輪找全文（2026-10-14，只用作者或出版者公開的版本）

ACM 在 2026-01-01 起把 Digital Library 全部內容改為開放取用（acm.org 公告〈ACM is Now Fully Open Access!〉），所以 ACM 的出版版現在是合法公開的；Unpaywall 與 OpenAlex 對舊文章仍標 closed，是資料還沒更新。ACM 網站本身仍擋 curl、Jina（含 browser 引擎）與 web.archive.org，只有 Exa 讀得到。

| 來源 | 試過的管道與結果 | 結果 |
|---|---|---|
| Scherer 2020 | Unpaywall：hybrid，列出兩個典藏 handle；兩個 handle 都轉到 nva.sikt.no；NVA 的 API 回報有公開的出版版檔案，取得簽章下載連結 | 拿到 PDF |
| Selvaraj 2021 | Unpaywall：hybrid，只有 ACM；Semantic Scholar 同；CORE 429；web.archive.org 無存檔；Jina 被驗證頁擋；作者頁（cseweb.ucsd.edu 兩個猜測網址）404；Exa 讀到全文 | 拿到文字 |
| Harrington 與 Cheng 2018 | Unpaywall、OpenAlex、Semantic Scholar 都標 closed；CORE 429；web.archive.org 無存檔；作者頁 403；Exa 讀到 ACM 出版版 | 拿到文字 |
| Ericson 2015 | Unpaywall：bronze；web.archive.org 有 2023 年的快照但內容是驗證頁；Exa 讀到全文 | 拿到文字 |
| Raj 等 2020 | Unpaywall：gold；Exa 第一次逾時、第二次讀到全文；ACSW 網站有作者投影片 | 拿到文字與投影片 |
| Karich 2014 | Unpaywall、OpenAlex、Semantic Scholar：closed，沒有任何開放版本；CORE 以 DOI 查無結果；ERIC API 回報無全文授權；OSF preprints 以題名查無結果；web.archive.org 無存檔；明尼蘇達大學 experts 頁只有摘要；搜尋作者博士論文沒有對應的典藏；Internet Archive Scholar 與 fatcat 的 API 本輪沒有回應 | 沒拿到。q4 的資料夾（`q4-time/karich2014-learner-control-meta.md`）也只有 ERIC 摘要頁 |
| Landers 與 Reddock 2017 | Unpaywall、OpenAlex、Semantic Scholar：closed | 我這邊沒拿到；q4 有一份 50,229 字元的檔（`q4-time/landers-reddock2017-learner-control-meta.md`），內容是否為全文我沒核對 |
| Shulman 等 2020a | Unpaywall、OpenAlex：closed；Semantic Scholar 標 bronze 但指向 Sage 付費頁 | 沒拿到 |
| Hofmeister 2019 期刊版 | Unpaywall、OpenAlex、Semantic Scholar：closed | 沒拿到；已有 2017 會議版全文 |
| Stefik 與 Siebert 2013 | 第二輪已有全文（`q2-interactive/stefik2013-syntax.pdf`，第三方網站上的副本）；現在 ACM 出版版也公開了，Exa 本輪逾時沒讀到 | 已有，精讀時建議改用 ACM 版對一次 |
| Kim 2017、Mosca 2021 | 全文第一輪就在手上（`q2-interactive/kim2017-explaining-gap.pdf`、`mosca2021-interaction.pdf`） | 不缺全文，缺的是讀 |
| Rubin 2013、Gaweda 2020 論文版 | Exa 逾時 | 沒拿到，可重試 |

沒試的管道：ResearchGate（需要登入或會擋機器抓取）、EdArXiv 的獨立搜尋（OSF API 已涵蓋）。CORE 與 Semantic Scholar 的題名搜尋多數被限流，只有 DOI 查詢成功。

## 事實交叉表

只放來源說了什麼。「來源 2」空白表示只有一個來源。

### 互動

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| K-12 STEM，用模擬對不用模擬，學業成就 g+=0.62（k=46，N=2,947，I²=78.55）；59 篇研究、128 個效果量 | D'Angelo 2014 Exhibit 10、5、6 | zenn 整理轉述同一數字 | ✅（機構報告，非同儕審查期刊） |
| 同一份：加了輔助（鷹架、表徵、回饋等）的模擬對原版模擬，成就 g+=0.49（k=50，N=3,342） | D'Angelo 2014 Exhibit 10 | | ✅ 單一來源 |
| 同一份：科學 k=42 g+=0.67；數學 k=4 g+=−0.15（信賴區間跨 0） | D'Angelo 2014 Exhibit 13 | | ✅ 單一來源 |
| 同一份：科學探究與推理能力，模擬對不用模擬 g+=0.26，k=6，不顯著 | D'Angelo 2014 | | ✅ 單一來源 |
| 動態對靜態視覺化：46 篇、82 個效果量、N=5,474，g+=0.23；排除了純文字條件；只收英文期刊文章；漏斗圖對稱、Egger 檢定 p=0.42。作者在限制段明講沒有把互動功能當調節變項 | Castro-Alonso 2019 摘要、納入標準、整體效果段、發表偏誤段、限制段 | Berney 2016：61 個研究、N=7,036、140 組比較，g=0.226（95% CI 0.12–0.33） | ✅ 兩份量值接近；兩份納入的研究有重疊，不是獨立證據 |
| 動畫由系統控制步調時 g=0.309 | Berney 2016 摘要 | | ✅ 單一來源；對照組的確切量值我沒讀 |
| 動畫在「辨認運動」上勝過靜態圖，靜態圖在「辨認空間配置」上勝過動畫；88 名大學生、齒輪機構 | Ploetzner 2021 摘要 | | ✅ 單一實驗 |
| 動畫看起來較好的研究，細看常是動畫組多給了資訊或多了互動；互動本身已知對學習者有益 | Tversky 2002 摘要與 1.6 | | ✅ 作者的回顧判斷 |
| 教育科技裡給學習者控制權，整體效果接近零：18 篇、29 個效果量，g=0.05 | Karich 2014 摘要 | | ⚠️ 摘要層級；Landers 與 Reddock 2017 可能有不同量值，沒讀到 |
| 24 個演算法視覺化實驗的計票式回顧，最主要的發現是「學生怎麼用視覺化」比「視覺化顯示什麼」更影響成效 | Hundhausen 2002 摘要 | | ✅ |
| 同一份：24 個實驗裡 11 個（46%）顯著有利、10 個（42%）不顯著、2 個（8%）顯著但分不出是不是視覺化的功勞、1 個（4%）顯著但方向相反 | Hundhausen 2002 圖 3（已把該頁轉成圖檔核對標籤） | | ✅ |
| 用圖呈現資料時，先讓讀者畫出預測、再顯示真實資料：四種做法的回想誤差都低於對照（預測加解釋 −4.08 個百分點，t=−4.02；預測加回饋 −3.54；只預測 −2.30），四種之間沒有差別。九個條件、378 名 AMT 受試者、每條件 42 人，資料是 12 個數值的投票結果 | Kim 2017 設計段與 Core Results | Hohman 2020 引用同一篇 | ✅ 單一實驗（Hohman 是轉引） |
| 第二輪更正。同一個實驗改用文字呈現資料時，預測與「預測加解釋」都沒有效果，只有「只解釋」降低誤差（−2.00，t=−2.07）；而且文字條件記住確切數值本來就比圖好，圖的誤差多 3.76 個百分點（多 36%） | Kim 2017「Visual vs Text」段 | | ✅ 單一實驗；結果變項是回想數值，不是概念理解 |
| 程式視覺化工具上讓學生先預測輸出，兩個實驗（N=78、231）後測都沒有顯著差異；另一個研究（N=91）被動看老師操作的那組在除錯題反而較高 | Muldner 2022 2.3.3 轉述 Banerjee 等、Al-Barakati 與 Al-Aama | Muldner 6.1.3：數個研究裡「只看」與「預測或自己步進」沒有顯著差異 | 🟡 轉引 |
| 在靜態的貝氏推理圖上加互動（勾選、拖曳、hover、tooltip），正確率都沒有提高；高空間能力者用 hover 版顯著變差。實驗一 530 人、實驗二 2,149 人，皆 AMT。作者註明這些互動沒有增加新資訊，並說可能存在有效的組合只是沒測到 | Mosca 2021 摘要、受試者段、討論、限制段 | | ✅ 單一研究兩個實驗；只測了貝氏推理一種題目 |
| 互動內容對零散內容的課：136 名程式入門學生、一堂 C++ 輸出敘述，互動版後測 8.6／11 對靜態版 7.3／11，進步多 16%（p=0.016） | Edgcomb 2014 摘要 | | ⚠️ 單一來源；PDF 掛在 zyBooks 官網，作者與該公司的關係我沒在文內查證；單堂課、立即後測 |
| Scrollytelling 對一般排版：感知到的投入度較高；12 人、21–26 歲、受試者內設計、瑞典語 | Tjärnhage 2023 | | ✅ 但樣本 12 人，量的是自評 |
| 「互動文章是否真的幫助溝通與學習，實證評估很有限」；大型出版者不公開內部數據 | Hohman 2020 Looking Forward | zenn 整理：explorable explanation 這個類型本身幾乎沒有直接的實證研究 | ✅（後者是二手） |

### 讀者會不會動手、製作成本

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 紐約時報 2015 年幾篇圖表裡，點了顯眼按鈕的讀者約 10–15% | Aisch 2017 註腳：數字是他量的；「85% 的人沒有忽略圖表，只是沒按按鈕」 | Baur 2017 轉述為「只有 10–15% 的人點按鈕，連必要的按鈕也是」 | ✅ 數字一致；⚠️ 原始資料沒公開，篇數與定義不明 |
| 紐約時報圖表部 2016 的三條規則：除了捲動之外要讀者做任何事，就得有驚人的回報；tooltip 當作沒人會看到，重要內容不要藏；跨平台做互動很貴 | Tse 2016 投影片 | Conlen 2019、Hohman 2020 引用 | ✅ |
| 「大多數讀者不按按鈕」不等於不該做互動；意思是重要內容不要藏在互動後面。tooltip 讓最投入的讀者查核資料，那篇因此收到創紀錄的更正 | Aisch 2017 | | ✅ |
| 節奏教學文 Beat Basics：桌機 4,456 人，停留中位數 86 秒，85% 與互動元件互動，73% 到達文末；手機停留中位數 20 秒，互動次數中位數 1 | Conlen 2019 6.1 | | ✅ |
| 降維入門文：桌機停留中位數 116 秒，76% 到文末；到文末的人有 59% 按過「看其他演算法」的按鈕；滑桿與細節按鈕的互動次數中位數是 0；先動滑桿再去看結果的讀者約 5% | Conlen 2019 6.2 | | ✅ |
| 吉他調音文：55,193 次造訪，桌機停留中位數 78 秒，撥弦中位數 22 次，23% 把六條弦都調完 | Conlen 2019 6.3 | | ✅ |
| 三篇共同現象：許多讀者很快捲到底就離開；手機讀者常讀完文字但不碰互動；細節只在點擊後才出現時，讀者可能永遠看不到 | Conlen 2019 6.2、7.1 | | ✅ |
| ❌ 讀者互動的比例 | 紐約時報：10–15% 點按鈕 | Conlen：一篇 85% 有互動、另一篇多數元件中位數 0 次 | ❌ conflict：量的東西不同（新聞圖表的按鈕對自選教學文的核心元件、社群媒體導流的讀者），不能合成一個數字 |
| 一篇互動教學要 1 到 5 個月 | Red Blob Games〈Making of: Introduction to A*〉 | | ✅ 單一作者自述 |
| 做互動文章「更接近做一個網站而不是寫一篇部落格」，常比靜態文章甚至學術論文花更多時間；網頁技術變動會讓互動內容幾年後壞掉 | Hohman 2020 Challenges | Distill 2021：瓶頸是「做這種文章要花的力氣，以及少見的科學加設計能力組合」；編輯團隊是志工，出現倦怠，停刊一年、可能無限期 | ✅ |
| Explorable Explanations 目錄有 180 筆（含作品與談作品的文章） | explorabl.es/all | Hohman 2020 寫「170+」 | ✅（兩個時間點） |
| Ciechanowski 一篇文章可以做一年，靠 Patreon 支持 | coolpeoplestories.com 的介紹文 | | ⚠️ unverified：第三方文章，沒找到本人說法 |

### 程式碼當教學內容

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 程式教學介入的統合：139 個介入、375 個效果量；學程式本身 g=0.81；視覺化介入 g=0.44；各教學法 g=0.49–1.02，彼此差異很小 | Scherer 2020 摘要 | | ⚠️ 摘要層級；對照組是什麼、多少是 K-12 的 Scratch 研究，沒讀到 |
| 例題的好處對初學者最大，隨經驗增加而消失 | Muldner 2022 第 1 節 | 文字研究筆記裡的 expertise reversal 來源 | ✅ |
| 追蹤例題附上 notional machine 的示意圖，低先備知識者的追蹤題表現較好；高先備知識者沒有差別，甚至在寫程式題上反而是簡略例題較好 | Muldner 2022 2.2 轉述 Mayer 三個實驗（N=80、40、56）與 Bayman 與 Mayer；6.1.3 的總結相同 | | 🟡 轉引，原始實驗沒讀 |
| 程式例題回顧的作者總結：(1) 現場示範式例題沒有證據勝過其他例題；(2) 例題加註解與子目標標籤顯著提高學習，子目標「有多個研究、已被複製」；(3) 旁白風格、文字對旁白、視覺風格都是虛無結果；(4) 只重排順序的 Parsons 題有省時間的報告但沒有學習優勢，加上自我解釋提示或要填的空格才有；(5) 泛用的自我解釋提示唯一一個研究是虛無；(6) 含錯誤的例題結果不一；(7) 視覺化工具多數勝過傳統活動，但對照組常沒有教追蹤，樣本多半偏小 | Muldner 2022 6.1.1–6.1.5 | | ✅ 敘述性回顧，沒有合併效果量 |
| 講解追蹤過程的影片，用文字、旁白或兩者並用，三個研究（N=61、186、77）都沒有顯著差異 | Muldner 2022 2.1 轉述 Morrison 與 Zavgorodniaia 等 | | 🟡 轉引 |
| 影片裡看不看得到講者，對學習與自我效能沒有影響（N=77，貝氏分析支持虛無） | Muldner 2022 2.1 轉述 Lee 與 Muldner | | 🟡 轉引 |
| 子目標標籤的例題用一整學期：N=265（實驗 120、對照 145）。小考平均 48% 對 41%（d=0.44），實驗組考的小考次數也較多（3.9 對 3.4，共 5 次）；期考兩組相同。對照組只考一次或兩次考試的比例是 7% 與 13%，實驗組是 5% 與 5%；「期考平均 70% 以下或沒考完」的比例是對照 44%、實驗 25% | Margulieux 2020 結果段 | Muldner 2022 把子目標列為已複製的發現 | ✅ 限制：學生自己選班、不是隨機分派；教實驗組的老師是研究團隊成員 |
| 子目標研究裡一個與認知負荷理論相反的結果被複製出來：例題與練習題情境不同的那組，表現比同構的那組好；作者說沒有解釋 | Morrison 2020 摘要與結論 | | ✅ |
| Parsons 題的文獻回顧：141 篇，22 篇有學習成效證據，受試者 27–736 人，多數是 Python 與 Java；「多種 Parsons 題都有學習成效」 | Ericson 2022 4.3–4.4.1 | | ✅ |
| 先前單校研究：Parsons 題通常比寫同樣的程式快，學習成效相當 | Ericson 2023 摘要與第 3 節轉述 | Ericson 2022 | ✅（兩份同一批作者） |
| ❌ 多校重做：Parsons 練習組與寫程式練習組，後測 107／400 對 111／400（p=0.60）；練習花的時間 1,783 秒對 1,600 秒（p=0.58），沒有比較快；Parsons 組要試更多次才答對 | Ericson 2023 結果段 | 先前單校研究說比較快 | ❌ conflict：成效相當這點一致，「比較省時間」沒有複製出來 |
| 練習時 Parsons 題帶干擾項（含常見錯誤的多餘區塊），後測的語法錯誤較少（18 對 23、13 對 19） | Ericson 2023 | | ✅ 單一研究 |
| PRIMM（先預測、執行、探究、修改、再自己寫）：13 所學校、493 名 11–14 歲學生、8–12 週，後測優於對照組 | Sentance 2019 摘要與方法 | | ✅ 準實驗、只有後測比較、不是每所學校都有對照組；PRIMM 是一整套教法，分不出是「預測」那一步的功勞 |
| 現場寫程式對講解寫好的程式：同一位老師、同樣內容與作業。漸進式開發、常見錯誤、print 用法、各類題型成績都沒有顯著差異；現場寫的那組較多人說抓不住注意力、不好抄筆記。學生自己選班，不是隨機；課程中途停課兩週 | Shah 2023 摘要、方法、7.1、7.3 | Muldner 2022 3.1：Rubin（N=146）考試、作業、總成績無差異，只有期末專案現場寫的組較好；Raj 等的實驗也無顯著差異。Selvaraj 2021 摘要：缺乏支持學習成效的實證 | ✅ 三個研究同向 |
| ❌ 學生認為現場寫程式有助於理解過程、學除錯、看到好習慣 | Raj 2018（印度一所工學院兩班共 103 人的回饋，紮根分析）；Muldner 3.1 列了五篇學生覺得有用的研究 | Shah 2023、Rubin、Raj 等量不到差異 | ❌ conflict：一邊是自述感受，一邊是成績與過程資料 |
| 花 5–10 分鐘教一套逐行追蹤、把變數值寫在紙上的策略：24 名 CS1 學生，追蹤題高 15%（p<0.05），期中考高 7% | Xie 2018 摘要 | Cunningham 2017：畫出追蹤過程的學生讀程式題成功率較高；畫不完整的和沒畫的一樣差 | ✅ Xie 樣本 24；Cunningham 是相關 |
| 第二輪更正。先學讀與追蹤、不寫程式的教材（PLTutor）對寫程式導向的 Codecademy：18 對 19 人，SCS1 進步 3.89 對 2.42（滿分 27），但組間差異不顯著（學習進步 d=.398，p<.41）；只有 PLTutor 組的前後測差異顯著；期中考平均兩組無差異 | Nelson 2017 摘要與結果段 | | ✅ 這是一個沒有達到顯著的小型研究，摘要的「高 60%」不能當成已證實的效果 |
| 多國入門課學生做 12 題讀程式選擇題：556 人做完全部，分數從 0 到 12 都有、眾數 8，最低四分位（0–4 分）佔 23% | Lister 2004 第 2–3 節 | | ✅ |
| 追蹤與解釋程式的能力和寫程式的能力相關，形成階層：會寫的人通常也會追蹤與解釋 | Lopez 2008、Venables 2009（146 人，換學校、換成 Python 仍成立） | 2020 資料結構階層研究（278 人）：追蹤加解釋解釋了寫程式題 46% 的變異 | ✅ 都是同一次考試內的相關，不是因果 |
| ❌ 到資料結構課時階層反過來，追蹤與解釋落在寫之後 | Harrington 與 Cheng 2018（經 2020 研究的摘要得知） | 2020 研究：反轉只在三種題目難度不相稱時出現 | ❌ conflict，且前者我沒讀到原文 |
| 照著打程式（写経）：打字速度與對 C 語言的理解有關聯，作者說不是因果 | 中田 2013 英文摘要 | | ✅ 單一研究，樣本數我沒讀到 |

### 程式能不能跑

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| GitHub 上的 Jupyter 筆記本：863,878 次有效的執行嘗試裡 24.11% 無錯誤跑完，4.03% 重現相同結果；常見例外之一是找不到檔案（12.59%） | Pimentel 2019 | | ✅ |
| 生醫論文附的筆記本：27,271 本裡 22,578 本是 Python，15,817 本有宣告相依套件，10,388 本裝得起來，1,203 本無錯誤跑完，879 本結果與原本相同；9,100 本（87.6%）丟出例外，最常見的是找不到模組、找不到檔案與匯入錯誤，缺相依套件造成的佔執行次數的 41.65% | Samuel 2024 摘要與 Exceptions 段 | | ✅ 方向與 Pimentel 一致，母群不同 |
| Python gist：75.6% 需要非簡單的環境設定才跑得起來；預設可直接執行的不到 25%，過半死在 ImportError；10,259 個 gist | Horton 2018 摘要與前言 | | ✅ |
| Stack Overflow 程式片段（共 300 萬個）：Python 76.22% 可解析、25.61% 可執行；JavaScript 65.88% 與 20.00%；Java 3.89% 可解析、1.00% 可編譯；C# 16.00% 與 0.12% | Yang 2016 | | ✅ 片段本來就不一定是完整程式，這個比例不等於「錯誤率」 |
| 217,818 則 Stack Overflow 貼文裡 31% 可能有 API 誤用；被採納或高票的答案沒有比較可靠 | Zhang 2018 摘要 | | ✅ 「可能」是工具偵測，不是人工確認 |
| GitHub 熱門專案的文件：28.9%（265／918）目前至少有一份文件引用了已不存在的程式元素；82.3% 在歷史上曾經如此；過期的引用平均已過期 4.7 年 | Tan 2023 | Aghajani 2019：文件問題的分類研究把「過期」列為一類 | ✅ |
| 本站審稿的做法：從中、英兩版文章各自抽出程式碼區塊，接進官方發的骨架檔實跑，另寫對照實作比對輸出 | w00、w01、w02、w05 審稿報告 | | ✅ |

### 本站案例：CS50 AI 七週專案節重寫前的狀況

任務書原本寫「六週跑不起來」，team-lead 已更正為不精確、不要引用。下表逐週核對。「作者自述」是文章「更新紀錄」2026-10-13 的條目；「審稿重現」是獨立審稿報告裡拿舊版實跑或回 git 上一版核對的紀錄；「我核對」是我用 `git show HEAD:<檔案>` 在重寫前的版本裡找到對應寫法。七週的共同點是專案節和官方發的檔案對不上。

| 週 | 重寫前的問題（作者自述） | 審稿重現 | 我核對 HEAD 版 |
|---|---|---|---|
| w00 Search | Degrees 的 `util.py` 片段給 `Node` 多了官方沒有的 `path_cost`，`QueueFrontier` 寫成獨立類別；參考實作照這個寫，搭配官方檔案會出錯 | w00 報告第 44–45 行：下載官方 `degrees/util.py` 對照，`Node.__init__` 只有三個參數 | 第 94、100、125 行有 `path_cost` 與獨立的 `class QueueFrontier:` |
| w01 Knowledge | Knights 的 Puzzle 3 放進官方 `puzzle.py` 推不出任何角色的身分；Minesweeper 的 `Sentence` 少了 `__eq__`，`add_knowledge` 沒扣掉已知地雷，實際執行不會結束；另有一個手寫的簡化版 `logic.py` 與官方寫法不符 | w01 報告第 158、174 行：舊版接官方 `main()`，Puzzle 3 沒有輸出；`add_knowledge` 15 秒未結束 | `class Sentence` 在、全檔沒有 `__eq__` |
| w02 Uncertainty | Heredity 被寫成概似加權取樣，貼了官方沒有的 `Person` 類別與自訂主迴圈（官方是列舉後正規化，`people` 是字典）；PageRank 缺規格要求的 `transition_model`，迭代版收斂時回傳前一輪數值，取樣版沒經過轉移模型 | w02 報告只確認新版實跑結果與規格頁相符，沒有重跑舊版 | 第 125 行有 `class Person:`；全檔沒有 `transition_model` |
| w03 Optimization | Crossword 貼的 distribution code 與官方不符（`__init__` 多一個參數、`overlaps` 結構不同、`solve` 少兩步）；參考實作用了官方沒有的 `add_constraints`、`self.constraints`、`is_consistent`、`forward_check`，放進官方檔案無法執行 | w03 報告第 292 行：回 git 上一版核對，舊版確實如此 | 第 114、176、180、205 行 |
| w04 Learning | Shopping 的 `train_model` 回傳 `(model, scaler)`，官方 `main` 直接對回傳值呼叫 `predict` 會出錯，還加了規格沒要求的標準化；Nim 把規則寫成「拿走最後一顆者獲勝」（官方是拿走最後一個的人輸），貼的類別與方法和官方 `nim.py` 對不上 | w04 報告第 156 行確認新版規則正確、「舊稿寫反的問題已修」 | 第 79、195 行回傳 `model, scaler`；Nim 那句我用關鍵字沒搜到原句，沒有獨立確認 |
| w05 Neural Networks | Traffic 把要自己寫的 `load_data` 寫成官方已提供；改寫了規格不准動的 `main`；損失函數用 `sparse_categorical_crossentropy`，和官方 `main` 的 one-hot 標籤不合；還寫了規格頁找不到依據的「check50 會載入 `traffic_model.h5`」 | w05 報告實跑的是新版 | 第 99、234 行的損失函數、第 239 行自訂 `main`、第 274、292 行的 `traffic_model.h5` |
| w06 Language | Parser 貼的 `Grammar` 類別、CYK 剖析與 `generate` 都不在官方檔案（官方要寫的是 `NONTERMINALS`、`preprocess`、`np_chunk`），執行指令用了不存在的 `sentences.txt`；Questions 專案已不在現行課程，改成 Attention 後，照官方 `requirements.txt`（沒鎖版本）安裝，當天裝到的 transformers 5.19.0 會在 `mask.py` 第 5 行 `ImportError` | w06 報告第 317、436 行記錄了另一組版本的 `TypeError` | 第 150 行 `class Grammar:`、第 74–177 行的 CYK；`requirements` 的結果在現行文章第 749 行 |

可以從這張表說的：七週的專案節在重寫前都有和官方檔案對不上的地方；其中 w00、w01、w03、w04（Shopping）、w06（Parser）的問題是「照文章貼進官方檔案會出錯、不結束或沒有輸出」，w01 的兩項有審稿者拿舊版實跑的紀錄；w02、w05 是把專案寫成另一種作法或改了不准改的部分；w04 的 Nim 是規則寫反。不能說的：「六週跑不起來」這種總數。各週舊版是否真的丟出例外，除了 w01 之外沒有人實跑過舊版，其餘是對照官方檔案後的判斷。

### 記號、行話、術語

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 生態與演化三本頂尖期刊 1998 年的 649 篇論文：正文每頁多一條公式，整體被引用數少 28%；來自非理論論文的引用少 35%；放在附錄的公式不減少引用 | Fawcett 2012 | | ✅ 觀察性資料 |
| ❌ 公式密度會妨礙溝通 | Fawcett 2012；Higginson 與 Fawcett 2016 評論：原結論來自負二項迴歸，不是看圖；不分理論與非理論，整體樣本每頁多一條公式引用少 22%；拿 Kollmer 的物理資料（Physical Review Letters 兩卷）做同樣的迴歸，每頁多一條公式引用少 6% | Kollmer 2015：物理學的引用分布與生物學很像，資料雜訊太大，不能把引用多寡歸給數學。Kollmer 2016 回覆：資料太吵、不足以辨認趨勢；就算有相關也不是因果，不能據此建議把公式藏進附錄 | ❌ conflict：雙方對「該不該做統計檢定、相關能不能當建議的依據」沒有共識。兩邊都同意這是相關 |
| 符號推理受排版影響：大學生判斷 a + b ∗ c + d = c + d ∗ a + b 這類等式是否成立時，間距或周圍圖形造成的視覺分組和運算優先順序一致就比較容易答對，不一致就容易錯 | Landy 2014 前言對 Landy 與 Goldstone 2007 的描述 | | 🟡 綜述轉述，原始實驗沒讀 |
| 行話讓一般讀者覺得難讀（N=650，η²=.11），接著提高抗拒、風險感，降低支持度 | Bullock 2019 | Shulman 2020b 摘要：兩個不緊急的主題重現了這個效果 | ✅ |
| 給行話加上滑鼠移上去就顯示的定義，處理流暢度沒有回升：定義主效果 F(1,636)=0.37，p=.543；交互作用也不顯著。定義組 323 人、無定義組 317 人 | Bullock 2019 設計、H1 結果、限制段 | | ✅ 單一實驗。作者自陳：沒有直接量理解；用滑鼠移上去這個做法本身引入了「去找定義」的行為；線上非代表性樣本；文章沒有圖也沒有來源線索。文中沒有報告受試者實際開了幾次定義 |
| 讀者有動機時行話的負面效果消失：N=393，COVID-19 主題沒有行話效果，洪水風險與緊急政策兩個主題有 | Shulman 2020b 摘要、結論、限制段 | | ✅ 單一實驗；每個主題只有一組訊息，AMT 樣本，作者說需要用別的訊息與樣本重做 |
| 第二語言閱讀加註解：42 篇研究、359 個效果量、N=3,802。有註解時學到的生字 45.3%（立即）與 33.4%（延宕），沒註解 26.6% 與 19.8%。母語註解勝過目標語註解，母語加目標語與只用母語相當 | Yanagisawa 2020 摘要與討論 | | ✅ 量的是學會生字，不是讀懂內容 |
| 第二輪更正。同一份的註解形式排序：選擇題式最有效；頁邊註解與超連結註解次之，作者的解釋是它們離目標字「不太近也不太遠」；最弱的兩種是緊貼在字旁邊的文內註解（in-text，定義是 provided next to the word）與文末詞彙表。作者另提醒選擇題式註解可能妨礙讀懂內文 | Yanagisawa 2020 註解類型定義段與討論 | | ✅ 第一輪我把 in-text 讀成「放在文章裡的註解比文末好」，方向弄反了 |
| ❌ 定義或註解有沒有用 | Bullock：隨選定義不改善流暢度 | Yanagisawa：註解明顯增加生字學習，而且要讀者動一下手的形式（超連結、選擇題）不比直接貼在旁邊的差 | ❌ 表面衝突；兩者對象（母語者讀科普對外語學習者）、結果變項（讀起來順不順對學到幾個字）都不同 |
| 非英語母語者學程式：840 份問卷、86 國、74 種母語；困難在讀教材、技術溝通、讀寫程式、同時學英文與程式；希望教材用簡單英文、不用文化特定的俚語、多用圖、嵌入行內字典；翻譯版常被認為品質較差 | Guo 2018 摘要、前言、方法與限制段 | | ✅ 問卷掛在英文網站 Python Tutor 上，作者自陳填答者的英文程度會高於一般學習者 |
| Scratch 使用者（五國、超過 15,000 人）：用母語介面與關鍵字的初學者，學到新程式概念的速度比同國用英文介面的人快 | Dasgupta 2017 摘要 | | ✅ 作者明言還不能說是因果 |
| 識別字用完整單字，72 位職業 C# 開發者找缺陷的速度比用單一字母或縮寫快 19%；字母與縮寫之間沒有差別；受試者內設計 | Hofmeister 2019 期刊版摘要；2017 SANER 會議版摘要與設計段 | | ✅ 兩版摘要一致；會議版的結果表與效度威脅段我沒讀完 |
| 新手用六種語言寫程式的正確率：採傳統 C 風格語法的 Perl 與 Java，沒有顯著高於關鍵字隨機產生的安慰劑語言 Randomo；偏離該風格的 Quorum、Python、Ruby 顯著較高。另有兩個調查請 166 名大一生評各種關鍵字直不直覺 | Stefik 與 Siebert 2013 摘要與結論；人數取自 Neil Brown 2018 的導讀投影片 | Lappi 等 2023：在芬蘭一所大學用芬蘭語說明重做直覺性調查（158 人），結果支持 Stefik 與 Gellenbeck 2011 | ✅ 作者自己說調查只是線索不是證明；Quorum 是作者自己設計的語言 |
| 作者加強公式可讀性的做法盤點：47 份文件、281 條公式、約 1,100 處加工（上色、標註、拆解）；訪談 12 位作者，主要結論是這件事做起來很繁瑣、各人做法差異很大，作者想要能分步驟呈現公式、按需顯示細節的工具 | Head 2022 摘要與前言 | | ✅ 描述作者怎麼做，沒有量讀者學得如何 |
| 把論文裡術語與符號的定義帶到讀者正在讀的位置（ScholarPhi）：27 位讀過機器學習論文的研究者（18 位博士生），回答問題更快、要翻的頁更少、自評更容易更有信心 | Head 2021 研究概述、受試者段、7.2 限制 | | ✅ 可用性研究：只用一篇論文、三個任務、每人 15–20 分鐘；量的是找資訊的時間 |
| 〈Research Debt〉的說法：記號與抽象是研究的使用者介面；壞的形式會留下來，因為轉換成本高，而且專家已經把它內化，新記號反而覺得彆扭，代價由新手承擔 | Olah 2017 | | ✅ 這是論述，文中沒有提出實證 |
| 多重表徵的框架（DeFT）：多種表徵並用「並不總是」帶來好處；表徵的功能分成互補、彼此限制解讀、促成更深的理解三類，學習者還得付出把不同表徵對起來的成本 | Ainsworth 2006 摘要、第 2 節、結論 | | 🟡 概念框架，不是實證；第 5 節的功能分類我只讀到片段 |
| Google 的技術寫作課：不熟的詞第一次出現時要定義或連到既有解釋；術語多就集中成詞彙表；同一個東西全篇用同一個詞 | Google TW〈Words〉 | | ✅ 業界準則，沒有附證據 |

## 我的推論（與上表分開）

| 推論 | 依據 | 這個推論可能錯在哪 |
|---|---|---|
| 「互動有效」的大數字（g=0.62）說的是課堂上以模擬取代或補充教學，不是一篇文章裡加一個滑桿。能直接對應到文章內互動元件的證據只有 Kim（圖上有用、文字上沒用）、Mosca（沒用或有害）、Edgcomb（有用但利益關係不明）三篇 | D'Angelo 的研究多為多堂課、有老師、K-12；Hohman 自己說實證評估有限；Castro-Alonso 明講沒有分析互動功能 | D'Angelo 裡也有單堂的研究（k=11，g=0.49）；我沒有逐篇看它納入的研究長什麼樣 |
| 「讓讀者先預測再看結果」不是一條可以到處套的規則。它在「用圖記住一組數值」上有效，換成文字呈現就沒效，放到程式視覺化工具上有兩個實驗量不到。比較站得住的說法是 Hundhausen 的：讀者拿它來做什麼，比它顯示什麼重要 | Kim 2017 兩種條件的結果；Muldner 轉述的 Banerjee 兩個實驗；Hundhausen 2002；Muldner 6.1.2：泛用的自我解釋提示唯一一個研究是虛無，針對性的（子目標空格、Parsons 加提示）才有效 | 這幾份的結果變項差很多（回想數值、後測、計票）；Banerjee 的學生沒有自己操作工具；PRIMM 的正向結果裡有預測這一步，只是分不出它的貢獻。第一輪我把這條寫成「有用的互動是讓讀者先表態」，證據撐不住那麼強的說法 |
| 對本站這種一個人寫的部落格，互動元件的合理位置是「選配的加深」，正文不靠它也要完整 | Aisch 與 Conlen 都說重要內容不要藏在點擊後面；Conlen 的手機讀者多半只讀字；Red Blob 一篇 1–5 個月；Distill 因成本停刊；Mosca 提醒一般作者沒有條件逐一測試互動設計 | Conlen 的三篇是設計給桌機的，手機數字反映的可能是適配沒做好；成本數字都來自高製作規格的作者，簡單的可調參數圖成本可能低一個數量級，但我沒有這一級的數據 |
| 文章裡的程式碼，第一件事是讀者照做跑得起來，而且要對著讀者實際會拿到的檔案驗證，這比子目標標籤、Parsons 或追蹤圖都優先 | 公開程式片段與筆記本的可執行率落在 4%–25%，最大宗的失敗原因是缺相依套件與找不到檔案；文件引用平均過期 4.7 年；本站七週專案節的問題幾乎都是「和官方檔案對不上」，其中 w06 是官方不鎖版本造成的 | 沒有任何一份研究量過「教學文裡的程式跑不起來」對學習的影響，這個優先順序是我的判斷；語料研究的母群（gist、SO 片段、研究筆記本）本來就不是為了給人照做；本站案例是一個系列、一位作者 |
| 在給程式碼的文章裡，值得做的教學加工依證據強弱排是：(a) 把例題切成有名字的步驟並加註解；(b) 對初學者，示範逐行追蹤並把狀態畫出來或寫出來；(c) 讓讀者做一點事，但要是針對性的（填子目標、排順序加解釋），不是泛泛地問「你覺得呢」 | (a) Margulieux 2020 與 Muldner 的總結（子目標已複製、註解有效）；(b) Xie 2018、Cunningham 2017、Muldner 轉述的 Mayer 實驗；(c) Muldner 6.1.2 | (a) 的成績優勢到期考消失；(b) Xie 只有 24 人，Mayer 的實驗很舊，且對有經驗者無效；(c) 都是課堂研究。三者都來自有課堂的初學者，本站讀者多半不是第一次寫程式，expertise reversal 可能讓這些加工變成多餘 |
| 文章作者不需要為了「呈現過程」而改做錄影或現場寫；把寫好的程式逐段講清楚，在量得到的結果上不輸 | Shah 2023、Rubin、Raj 等三個比較都沒有成績差異；Muldner 總結現場示範式例題沒有證據較好；旁白對文字、講者露不露臉也都是虛無 | 「沒有顯著差異」不等於等效，各研究的檢定力我沒查；Shah 是學生自選班；學生主觀上喜歡現場寫，而喜歡可能影響自學者會不會繼續看；Rubin 的期末專案是現場寫的組較好 |
| 行話的成本主要發生在讀者還沒決定要不要讀下去的時候；對已經有動機要學的讀者，重點是讓他查得到定義又不必離開正在讀的地方 | Bullock（流暢度下降）；Shulman 2020b（有動機時效果消失）；Head 2021（定義帶到眼前省時間）；Yanagisawa（頁邊與超連結註解優於文末詞彙表） | Bullock 與 Shulman 量的是態度與自評流暢度，沒有量理解；Bullock 的作者自己說 mouseover 這個做法引入了額外行為；Head 的受試者是研究者、15–20 分鐘；Yanagisawa 量的是外語生字 |
| 第二輪更正。「註解離字越近越好」不成立。Yanagisawa 的排序是頁邊與超連結最好（選擇題式除外）、緊貼在字旁邊的與文末的都最差。能從這裡推到技術文章的只有「不要只靠文末詞彙表」；括號裡緊跟著解釋這種本站常用的寫法，在這份統合裡對應的是效果最弱的那一類 | Yanagisawa 2020 | 那是外語學習者記生字，緊貼的註解讓人不用想就得到答案，所以記不住；技術文章的目的是讀懂當下這段，不是記住這個詞，兩者的目標可能相反。這條推論的方向我沒有把握 |
| 對中文讀者寫技術內容，英文術語保留原文並給中文說明，比全翻或全不翻穩妥 | Yanagisawa：母語註解勝過目標語註解，母語加目標語與母語相當；Guo：讀者要行內字典、認為翻譯版品質差；Dasgupta：母語介面學得較快；Stefik：關鍵字用什麼詞會影響新手正確率 | 沒有一份在測「中英並列的術語」；Guo 的樣本英文程度偏高；Dasgupta 是相關；我找不到中文圈的直接實驗 |
| 公式密度與引用數是負相關，這點在生物與物理兩份資料上都有統計結果（−22% 到 −28%、−6%）；但它能不能推到「讀者因此讀不懂」沒有人量過，爭論的另一方也是質疑這一步 | Fawcett 2012、Higginson 2016、Kollmer 2015／2016 | 引用數離理解很遠；高公式密度的論文可能本來就是讀者群較小的題目；物理那份的重做是原作者自己做的 |
| 〈Research Debt〉講的「壞記號由新手付代價」，最接近的實證是 Stefik 2013：C 風格語法對新手不比隨機關鍵字好。其餘（識別字命名、排版影響運算）都在窄範圍 | Stefik 2013、Hofmeister、Landy 轉述 | Stefik 的結論有利於他自己設計的語言；數學教育對符號意義的研究我這一輪沒找到，比較像是我沒找到而不是沒有 |

### 取代與互補（子問題 6 的整理，屬於推論）

Ainsworth 2006 的框架提醒：多種表徵並用不保證更好，讀者要多付一筆「把它們對起來」的成本，所以下表每一列問的是加上去的那一種有沒有做到正文做不到的事。

| 組合 | 關係 | 依據 | 把握 |
|---|---|---|---|
| 動畫對一組靜態圖 | 看內容：要學的是運動本身時動畫較好，要學空間配置時靜態圖較好；整體差距小（g≈0.23） | Ploetzner 2021、Castro-Alonso 2019、Berney 2016 | 中 |
| 互動元件對正文 | 互補且不對稱：正文必須獨立成立，互動是加在上面的一層；把內容放進互動裡會有一部分讀者看不到 | Tse、Aisch、Conlen | 中（行為資料，不是學習成效） |
| 圖對文字，用來記確切數值 | 文字較好（圖的回想誤差多 36%）；圖的好處在趨勢與可以畫上去的預測 | Kim 2017 | 中低（單一實驗） |
| 先預測再看答案，做成元件對寫成文字 | 不能互相取代：同一個實驗裡圖上的預測有效、文字的預測無效 | Kim 2017 | 中低；第一輪我寫成「可以用純文字做到」，是錯的 |
| 現場寫程式的影片對講解靜態程式 | 在成績上可互相取代 | Shah 2023、Rubin、Raj 等（經 Muldner） | 中 |
| 追蹤過程的文字說明對旁白 | 可互相取代 | Muldner 轉述的三個研究與其總結 | 中 |
| 程式碼對記憶體或狀態示意圖 | 對初學者互補；對有經驗者圖是多餘的 | Muldner 轉述 Mayer；Xie；Cunningham | 中 |
| 公式放正文對放附錄 | 與引用數有相關，對理解的影響不明 | Fawcett／Higginson 對 Kollmer | 低 |
| 術語原文對母語註解 | 互補 | Yanagisawa、Guo、Dasgupta | 中低（都是間接） |

從自學者讀長篇網路內容的角度看，落差有三處要在文章裡寫明：受試者幾乎都是修課的大學生或拿報酬的線上受試者；教材多半是一堂課或十幾分鐘；結果多半是立即後測。唯一長期的（Margulieux 一學期）顯示成績優勢在期考時消失，但中途放棄的人變少，這對沒有人盯的自學者可能是更要緊的結果，不過這一步是我的延伸。

## 草稿骨架

建議拆成三篇，另加一段可併入系列總結的整理。證據強度：強＝兩份以上獨立的統合或大樣本研究同向；中＝一份統合或數個單篇實驗；弱＝單一小樣本、轉引或只有論述。

### 篇一：文章裡該不該做互動

- 聚焦問題：一個人寫的教學文，加上可以操作的圖或模擬，讀者會多學到什麼；有多少人會真的去動；要付多少成本。
- 主要結論
  1. 課堂上用模擬的效果不小（g=0.62），但那是多堂課、有老師帶的情境；直接量「文章裡的互動元件」的研究很少，互動文章的圈內人自己也這麼說。（強，就「課堂模擬有效」而言；弱，就「文章互動有效」而言）
  2. 單純把畫面從靜態換成會動的，平均只多一點（g≈0.23）；把控制權交給學習者，平均接近零（後者只讀到摘要）。（中）
  3. 互動有沒有用看讀者拿它做什麼。圖上的「先畫預測再看資料」有效；同樣的做法換成文字無效；程式視覺化工具上的預測有兩個實驗量不到；篩選與 hover 類的互動在一個大樣本研究裡沒幫助，有一組人還變差。（中低；沒有一條通則）
  4. 讀者動手的比例從一成多到八成五都有，取決於互動是不是文章的主體、裝置、以及讀者怎麼來的；穩定的規律只有一條：放在點擊後面的內容，會有一部分人永遠看不到。（中）
  5. 成本是實打實的：一位熟手一篇 1–5 個月；Distill 的編輯部把停刊原因歸給製作成本與志工倦怠；互動內容幾年後會因為網頁技術變動而壞掉。（中，都是作者自述）
- 衝突要照實寫：紐約時報的 10–15% 對 Conlen 的 85%。
- 本站案例：站上目前沒有互動元件，這篇可以寫成「為什麼還沒做，以及要做的話先做哪一種」。course-guide-contract 要求的各節自我檢查題是純文字的「先想再看」，依 Kim 的文字條件不能假定它有同樣的效果，文章裡要照實講；它的依據在提取練習那一支（文字研究與子問題 3），不在這裡。
- 不要寫的：不要把 d=0.41–0.85 這類數字直接貼在「互動文章」上；不要引 Ciechanowski 的製作時間，除非找到本人說法。

### 篇二：文章裡的程式碼，先對得上讀者手上的檔案，再談教法

- 聚焦問題：貼在教學文裡的程式，要做到什麼程度才算盡到責任；之後哪些加工有證據。
- 主要結論
  1. 公開的程式片段與筆記本，原樣跑得起來的是少數（依語料不同在 4% 到 25% 之間），最大宗的原因是缺相依套件與找不到檔案；文件裡過期的引用平均放了 4.7 年沒人發現。（強，就「公開程式多半跑不起來」而言；沒有研究量過它對學習的影響）
  2. 把例題切成有名字的步驟並加註解：小考較好（d=0.44）、中途放棄的人較少，期考成績差距消失；回顧文章把子目標列為已複製的發現。（中到強）
  3. 只是把程式行打亂讓人排的 Parsons 題，學習成效和從頭寫差不多；「比較省時間」在多校重做時沒有出現；加上要解釋或要填空才有學習優勢。（中）
  4. 追蹤能力和寫程式能力高度相關（相關，不是因果）；花幾分鐘教逐行追蹤並把變數值寫下來，24 人的實驗裡追蹤題成績高 15%。附記憶體狀態圖對初學者有幫助，對有經驗的人沒有。「先學讀再學寫」的教材在唯一的比較裡差異不顯著。（中低）
  5. 現場寫程式被當成最佳實務，學生也喜歡，但三個比較都沒有量到成績差異，其中一個還多了「抓不住注意力、來不及記」的抱怨。（中）
  6. 講解程式的影片用字幕、旁白或兩者並用，三個研究都沒差；講者露不露臉也沒差。（中低，轉引）
  7. 語法與命名本身會影響新手：C 風格語法的正確率不比隨機關鍵字高；完整單字的識別字讓職業開發者找錯快 19%。（中低）
- 本站案例（這篇的主軸）：用上面「CS50 AI 七週專案節重寫前的狀況」那張表，不要寫「六週跑不起來」。可以寫的角度有三個：(a) 問題的型態幾乎都是「和官方發的檔案對不上」，不是演算法寫錯，所以只看程式本身看不出來，要接上官方檔案才會現形；(b) 審稿抓到它的方法是從中、英兩版各自抽出程式碼區塊接進官方骨架實跑，另寫對照實作比輸出；(c) w06 顯示連官方的安裝指令都會隨時間壞掉，文章要記下實際能跑的版本。舊版真的拿來實跑過的只有 w01，其餘是對照後的判斷，文章裡要分清楚。
- 可以提的做法：文章內程式碼的抽取與執行納入檢查流程（這是 Tier 2 的 CI 變更，文章裡只能寫成建議，要另外問使用者）。
- 與文字研究的分界：worked example 的一般效果（Barbieri 2023 等）在 `.work/teaching-text-research/notes.md`，這篇只寫程式特有的部分並引用它。

### 篇三：記號、行話與術語

- 聚焦問題：公式、符號、專有名詞與英文術語，哪些選擇真的會讓讀者卡住；作者能做什麼。
- 主要結論
  1. 行話會讓一般讀者覺得難讀並因此退開，隨選的定義救不回這個感受；讀者本來就有動機時這個效果不見。（中，兩個實驗，量的是感受與態度不是理解）
  2. 外語閱讀的註解：有註解比沒有好很多；母語註解勝過用原文解釋；形式上頁邊與超連結優於文末詞彙表，也優於緊貼在字旁邊的。（中，一份統合，對象是外語學習者、量的是記住生字）這條怎麼搬到技術文章我沒有把握，見推論表。
  3. 把定義帶到讀者眼前可以省下來回翻找的時間。（弱到中，27 人的可用性研究）
  4. 公式密度高的論文被引用較少，生物與物理的資料都有這個相關；雙方爭的是能不能據此建議作者少放公式。沒有人量過理解。（相關本身中，推到讀者行為低）
  5. 符號的排版會改變人怎麼算；語法用什麼詞會影響新手正確率。（中低，都在窄範圍）
  6. 〈Research Debt〉對壞記號的批評主要還是論述，最接近的實證是程式語法那一支。（照實寫成缺口）
- 本站案例：writing-guide 已有術語規則（中國用語替換表、術語硬譯的提醒）與「流暢度 > 術語密度」一條；可以對照這篇的證據檢查哪幾條有依據、哪幾條只是慣例。雙語文章的術語處理是現成的例子。CS229 那篇公式沒渲染的事（memory 有紀錄）可以當「記號連顯示都沒顯示」的極端個案。CS50 AI 審稿裡有幾條是術語一致性（「約束」與「限制式」、「播放列表」與「播放清單」），可以當「同一個東西全篇用同一個詞」的實例。
- 這篇偏誤最大：中文圈的直接研究一篇都沒找到，文章開頭就要寫明。

### 可併入系列總結的一段：什麼時候互相取代，什麼時候互補

用上面「取代與互補」那張表。能說的是：正文要能獨立成立；在量得到的結果上，現場寫對靜態講解、旁白對文字可以互換；動畫與靜態圖、圖與文字各有擅長的內容；加一種表徵要付對照的成本。這些都是推論，寫進文章時要標明。

## 待解問題

- Scherer 2020、Karich 2014、Selvaraj 2021 仍只到摘要，三條管道以上都試過。Karich 的 g=0.05 與 Scherer 的各項效果量如果要進文章，得請使用者提供全文或改寫成「摘要報告」。
- 本站案例裡，除了 w01，舊版程式沒有人實跑過。要在文章裡說「會出錯」，最好把 HEAD 版的程式碼區塊接進官方檔案各跑一次，留下錯誤訊息。w04 的 Nim 舊句我沒搜到原文。
- Yanagisawa 的「緊貼的註解最弱」怎麼搬到技術文章，需要找以理解（不是記字）為結果變項的註解研究；沒找到之前不要下建議。
- Kim 2017 的理解題結果與穩健性檢查沒讀；Mosca 各條件的數字沒讀。
- Castro-Alonso 的調節變項表轉檔後錯位，數值沒有逐格讀；要引用個別調節變項得看 PDF 的表。
- Stefik 2013 四個研究的方法與數字沒讀；166 人這個數字來自二手投影片。
- Harrington 與 Cheng 2018 原文沒拿到，階層反轉這條衝突只有一邊的說法。
- 數學教育對符號理解的研究這一塊仍然是洞。
- 中文與日文的查詢只有八組，沒有進華藝、CiNii、知網的索引查。
- 沒有做 research-source-registry 的來源沉澱。
