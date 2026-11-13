# 精讀清單：已發佈五篇沒有抽取紀錄的來源（deep-research 2.5 節的「選讀」）

日期：2026-10-14
對應：`.work/reviews/2026-10-14-published-five-fix-log.md` 第三節「沒有紀錄可對的來源」。主體是系列第 5 篇（影片，`2026-10-13-instructional-video-in-articles.md`）與第 6 篇（版面，`2026-10-13-video-beside-text-layout.md`），另含第 1 篇（證據）、第 2 篇（圖表）、第 9 篇（提問）引用但沒有紀錄的來源。
這份清單只決定「精讀哪些、用哪個檔」。清單上的來源目前都**沒有抽取紀錄**，精讀完成前不能引數字。「文章引用了什麼」欄取自修改紀錄，是要回原文核對的對象，不是已確認的事實。

## 欄位說明

- 篇名代號：V＝影片（第 5 篇）、L＝版面（第 6 篇）、D＝圖表（第 2 篇）、E＝證據（第 1 篇）、Q＝提問（第 9 篇）。行號是 2026-10-14 實查的中文檔行號（含附錄與參考資料列）。
- 路徑前綴：`W/`＝`.work/`；`R/`＝`.research/raw/learning-content/`。`R/pub5/` 是這次新取得的檔。
- 長度是 `wc -c` 位元組數（2026-10-14 實查）。PDF 轉文字的含版面空白；網頁轉文字的含站台頁首頁尾，正文較少。
- 「完整」：✓＝開檔看過頭尾，正文到參考文獻（或附錄）都在；⚠＝內容完整但本機檔的取得來源不合規或版本有疑問，精讀前要先處理。
- 「轉引」標記：文章是經另一份文獻轉述這篇的，原研究從沒讀過。精讀它是為了核對轉述是否正確。

## 這次新取得的檔（`R/pub5/`）

| 檔案 | 來源網址 | 說明 |
|---|---|---|
| `alfieri2013-lrdc-wayback.pdf`／`.txt`（138,403） | https://web.archive.org/web/20221206173751id_/https://www.lrdc.pitt.edu/schunn/papers/ContrastingCasesMeta-AlfieriEtAl2013.pdf | 共同作者 Schunn 在 Pitt LRDC 的論文頁；現址 404，取 Wayback 2022 快照。檔內是出版者排版（首頁有 Routledge 下載戳記） |
| `richland2009-uchicago.pdf`／`.txt`（88,022） | https://learninglab.uchicago.edu/Pre-Testing_files/RichlandKornellKao.pdf | 第一作者 Richland 在芝加哥大學的實驗室網站 |
| `trafton-reiser1993-escholarship.pdf`／`.txt`（24,785） | https://escholarship.org/uc/item/71d733c9 | CogSci 第 15 屆會議論文集，eScholarship 開放（題名頁有原刊錯字 Contributinos） |
| `geller2017-pmc.xml`／`.txt`（65,664） | https://pmc.ncbi.nlm.nih.gov/articles/PMC5655599/（Europe PMC fullTextXML） | CR:PI 開放取用 |
| `carpenter2018-classroom-lab.pdf`／`.txt`（60,244） | https://664ef278-1723-43c6-bbe1-3bd4e65a87fe.filesusr.com/ugd/f4b9f1_37c42b13d679480fa2d2274d4607b2c7.pdf | 第一作者 Carpenter 的實驗室網站（https://shacarp.wixsite.com/mysite/published-articles，2026-10-14 開頁確認連結在該篇條目下） |
| `soong2006-ascilite.pdf`／`.txt`（12,867） | https://ascilite.org/conferences/sydney06/proceeding/pdf_papers/p179.pdf | ascilite 2006 會議論文集，出版者開放 |
| `navarrete2025-springer.jina.md`（223,939） | https://link.springer.com/content/pdf/10.1007/s40593-025-00481-x.pdf（經 Jina reader，64 頁） | Springer 開放取用（hybrid）。取代舊檔 `W/video-layout-research/navarrete.txt`（120,728，Exa 抓的網頁版，前輪自述沒讀完） |

另外確認、但本機沒有新檔的：

- Tversky、Morrison、Bétrancourt 2002：舊檔 `W/learning-visualization-research/src/tversky2002.pdf` 原本取自 Stanford 課程頁；這次從 Tversky 本人在 Teachers College 的教師頁（https://www.tc.columbia.edu/faculty/bt2158/faculty-profile/files/_Morrison_Betrancourt_AnimationCanitfacilitate.pdf）下載，`cmp` 位元組相同，來源改記教師頁即可。
- Carpenter & Toftness 2017：舊檔的 filesusr.com 網址同樣出自 Carpenter 實驗室網站的該篇條目（2026-10-14 開頁確認）。
- Larkin & Simon 1987、Heiser & Tversky 2006：Wiley 的 pdfdirect 免費開放（Unpaywall／OpenAlex 列 bronze，Exa `web_fetch` 實測可讀到正文）；curl 與 Jina 都被 Cloudflare 擋，本機沒有存到出版者版。

## 一、有合法全文的研究來源（38 個）

### 影片（第 5 篇）

| # | 書目 | DOI／網址 | 文章引用了什麼 | 檔案與長度 | 合法來源 | 完整 |
|---|---|---|---|---|---|---|
| V-1 | Harley 2020, Videos as Instructional Content: User Behaviors and UX Guidelines（NN/g） | https://www.nngroup.com/articles/instructional-video-guidelines/ | 8 位受試者、頁首／該節／頁尾三個位置的觀察、引句、片長標示、26% 開字幕。V 8、28–29、61–75、90、106–110、136–150、224–225、237、259 | `W/video-guide-research/dl/t5.txt`，17,324（原始 HTML `dl/raw5.html`） | NN/g 官網 | ✓（使用性研究報告，沒有方法章；頭尾是站台選單） |
| V-2 | Karnad 2013, Student use of recorded lectures（LSE 報告） | https://researchonline.lse.ac.uk/id/eprint/50929/1/Karnad_Student_use_recorded_2013_author.pdf | 學生只回看特定段落、成績較低者較常整堂看完、Soong／Traphagan／Leadbeater 的轉引數字。V 114–116、224–226、231、243、264 | `W/video-guide-research/dl2/lse.txt`，57,713（PDF：`dl2/lse.raw`） | LSE Research Online（作者稿） | ✓（檔尾是附錄表，頁碼 23） |
| V-3 | Soong, Chan, Cheers & Hu 2006, Impact of video recorded lectures among students（ascilite）（轉引，經 Karnad） | https://ascilite.org/conferences/sydney06/proceeding/pdf_papers/p179.pdf | 1,160 人問卷，「只看不懂的段落」34.5%、「準備考試」21.46%。V 114、231、243 | `R/pub5/soong2006-ascilite.txt`，12,867（5 頁） | ascilite 論文集 | ✓ |
| V-4 | Kim, Guo, Seaton, Mitros, Gajos & Miller 2014, Understanding In-Video Dropouts and Interaction Peaks in Online Lecture Videos（L@S） | 10.1145/2556325.2566237 | 862 支影片、重看者離開率 78.6% 對 48.6%、61.3%／54.1%、每支 3.7 個高峰、五類成因、61% 伴隨畫面切換。V 120–122、224、239–241、262–263 | `W/video-guide-research/dl2/kim.txt`，69,255（PDF：`dl2/kim.raw`） | 作者 Gajos 個人頁 https://kgajos.seas.harvard.edu/papers/kim14video.pdf；另有 Harvard DASH、MIT DSpace 典藏 | ✓（雙欄 `-layout`，表格要對 PDF） |
| V-5 | Guo, Kim & Rubin 2014, How Video Production Affects Student Engagement（L@S） | 10.1145/2556325.2566239 | 6 分鐘、9 分鐘、127,839 人、約 690 萬次觀看、1 倍速占 76%、作答率 56／48／43／41／31%。V 128、186、224、229、239、262 | `W/video-guide-research/dl/guo.txt`，59,108（PDF：`dl/guo.pdf`） | 作者研究群網站 https://up.csail.mit.edu/other-pubs/las2014-pguo-engagement.pdf；ACM DL 自 2026 年起開放 | ✓（雙欄 `-layout`） |
| V-6 | Pavel, Reed, Hartmann & Agrawala 2014, Video Digests（UIST）**V、L 共用** | 10.1145/2642918.2647400 | V：192 份摘要、0.55 對 0.28、p = 0.080；L：只引版面描述。V 8、34、142、224、245、265；L 59–65、237、256 | `W/video-guide-research/dl2/digest.txt`，72,285（PDF：`dl2/digest.raw`） | 作者 Agrawala 在 Stanford 的論文頁 http://vis-ucb-maneesh.stanford.edu/papers/videodigests/videodigests_small.pdf | ✓（雙欄 `-layout`） |
| V-7 | Carpenter & Toftness 2017, The effect of prequestions on learning from video presentations（JARMAC 6） | 10.1016/j.jarmac.2016.07.014 | 57% 對 38%、d = 1.00、未問到內容 d = 0.54、85 人、事前答對率 5%。V 156–158、222–223、247、266；E 121 只提存在 | `W/video-guide-research/dl2/preq.txt`，45,129（PDF：`dl2/preq.raw`） | Carpenter 實驗室網站（見上） | ✓（出版者排版） |
| V-8 | Szpunar, Khan & Schacter 2013, Interpolated memory tests reduce mind wandering and improve learning of online lectures（PNAS） | 10.1073/pnas.1221764110 | 84% 對 59%、d = 1.03、32 人／48 人與各組比例。V 174–176、222、230–231、253、269 | `W/video-guide-research/dl2/szp-full.txt`，31,815（HTML：`szp-full.html`） | PMC3631699 | ✓（補充材料 SI 沒抓，正文引用到 SI 的要另抓 PNAS 的 SI PDF） |
| V-9 | Lawson & Mayer 2021, Benefits of Writing an Explanation During Pauses in Multimedia Lessons（Educ. Psychol. Rev.）**V、Q 共用** | 10.1007/s10648-021-09594-w | 三個實驗 126／131／128 人、8.06 對 5.41、各組分數、p 值、時間倍數；Q：只讀現成解釋的組沒有顯著勝過對照。V 178、222、228、230、251、268；Q 58 | `W/video-guide-research/dl2/pause.txt`，90,600 | PMC7985227 | ✓（頭尾是 PMC 站台雜訊） |
| V-10 | Brame 2016, Effective Educational Videos: Principles and Guidelines（CBE—LSE 15） | 10.1187/cbe.16-03-0125 | 6 分鐘以內、引導問題（轉引 Lawson 等 2006）。V 186、255、270 | `W/video-guide-research/dl/t1.txt`，38,521 | PMC5132380 | ✓ |

### 版面（第 6 篇）

| # | 書目 | DOI／網址 | 文章引用了什麼 | 檔案與長度 | 合法來源 | 完整 |
|---|---|---|---|---|---|---|
| L-1 | Kim, Latzke, Bragg, Zhang & Chang 2023, Papeos: Augmenting Research Papers with Talk Videos（UIST） | 10.1145/3586183.3606770；arXiv:2308.15224 | 16 人、NASA-TLX 5.50／5.31／4.50、p = 0.002、kappa 0.712、288 位使用者等。L 8–9、26、61、92–112、198、225、230、243、253 | `W/video-layout-research/papeos.txt`，132,007（不帶 `-layout` 版：`papeos-flow.txt`，105,447；PDF：`papeos.pdf`） | arXiv 作者版 | ✓（含附錄） |
| L-2 | Kim, Guo, Cai, Li, Gajos & Miller 2014, Data-Driven Interaction Techniques for Improving Navigation of Educational Videos（UIST，LectureScape） | 10.1145/2642918.2647389 | 12 人、96 對 106 秒、評分、12 人裡 11 人、附錄人口資料。L 8、61、67–74、198、224、239、254 | `W/video-layout-research/lecturescape.txt`，75,320（flow 版：`ls-flow.txt`，58,870） | 作者 Gajos 個人頁；MIT DSpace 亦有 | ✓ |
| L-3 | Shin, Berthouzoz, Li & Durand 2015, Visual Transcripts（ACM TOG 34(6)） | 10.1145/2816795.2818123 | 9 人、0.83／0.81／0.87、各 p 值、7／9 人、附錄數字。L 8、61、79–88、224、241、255 | `W/video-layout-research/vt.txt`，58,980 | ACM DL 出版者版（OpenAlex 列 bronze；ACM 自 2026 年全面開放）。本機檔是 Exa 從 ACM PDF 轉的文字 | ⚠ 內容完整（到參考文獻末條），但沒有本機 PDF，表格可能錯位；curl 與 Jina 被 ACM 的 Cloudflare 擋。精讀前用瀏覽器另存 PDF，至少對表 |
| L-4 | Noetel 等, Multimedia Design for Learning: An Overview of Reviews With Meta-Meta-Analysis（預印本；刊出版 RER 92(3), 2022）**L、D 共用** | 10.31234/osf.io/pynzr；刊出版 10.3102/00346543211052329 | L：29 篇回顧、58 個比較、g = 0.41／0.27、p = 0.02、各信賴區間、1,189 個研究；D：0.63、0.43、0.33、0.70 對 0.20、0.41 對 0.27、78,177 對 79,415 人。L 146、154、226、231、245、257；D 73–102、382–383、399、448 | `W/video-layout-research/noetel.txt`，124,427（與 `W/learning-visualization-research/src/noetel2022-preprint.txt` 相同；原檔是 docx） | OSF 預印本 https://osf.io/pynzr/download；刊出版 RER 也是 gold OA | ✓（預印本。文章引的是預印本數字，抽取紀錄要註明版本；有餘力對一下刊出版的同一組數字） |
| L-5 | Zhang, de Koning & Paas 2024, Does presentation size of instructional materials influence the split-attention effect?（Applied Cognitive Psychology 38(4)） | 10.1002/acp.4223 | 146 人、2×2 設計、全部無效果、附錄細節。L 150、154、243、247、253、258 | `W/video-layout-research/zhang2024.txt`，78,143（flow 版：`zh-flow.txt`，63,100；PDF：`zhang2024.pdf`） | TU Delft 典藏的刊出版（CC BY-NC-ND） | ✓ |
| L-6 | Navarrete, Nehring, Schanze, Ewerth & Hoppe 2025, A Closer Look into Recent Video-based Learning Research（IJAIED） | 10.1007/s40593-025-00481-x | 257 篇、57%、25%、PRISMA、約八成用 STEM 影片。L 173、177、231、249、259 | `R/pub5/navarrete2025-springer.jina.md`，223,939（64 頁） | Springer 開放取用 | ✓（超過 20 萬字元，單獨一批；舊的 Exa 檔不用） |

### 圖表（第 2 篇）

| # | 書目 | DOI／網址 | 文章引用了什麼 | 檔案與長度 | 合法來源 | 完整 |
|---|---|---|---|---|---|---|
| D-1 | Guo, Zhang, Wright & McTigue 2020, Do You Get the Picture? A Meta-Analysis of the Effect of Graphics on Reading Comprehension（AERA Open） | 10.1177/2332858420901696 | g = 0.39、39 個實驗、簡答題 0.67、Trim and Fill 0.28。D 9、71–73、213、382、397、447 | `W/learning-visualization-research/src/guo2020.txt`，96,673 | ERIC https://files.eric.ed.gov/fulltext/EJ1248499.pdf（gold OA） | ✓ |
| D-2 | Cooper, Sidney & Alibali 2018, Who Benefits from Diagrams and Illustrations in Math Problems?（Applied Cognitive Psychology 32） | 10.1002/acp.3371 | 92 人、勝算比 5.94。D 104、401、449 | `W/learning-visualization-research/src/cooper-sidney-alibali2018.txt`，83,962 | 作者 Alibali 實驗室網站 https://alibali.psych.wisc.edu/wp-content/uploads/sites/371/2018/02/CooperSidneyAlibali2018.pdf | ✓（檔尾是表） |
| D-3 | Trypke, Stebner & Wirth 2023, Two types of redundancy in multimedia learning: a literature review（Frontiers in Psychology） | 10.3389/fpsyg.2023.1148035 | 表 4 的雙向結果。D 108、403、450 | `W/learning-visualization-research/src/trypke2023.txt`，107,151 | Frontiers 開放取用；PMC10192876 | ✓ |
| D-4 | Larkin & Simon 1987, Why a Diagram is (Sometimes) Worth Ten Thousand Words（Cognitive Science 11） | 10.1111/j.1551-6708.1987.tb00863.x | 三個優勢與英文原句。D 31、118–128、405、451 | `W/learning-visualization-research/src/larkin-simon1987.txt`，87,300 | 合法版本：Wiley pdfdirect 免費開放。本機檔取自 UCSD 課程網站（mechanism.ucsd.edu），**不合規** | ⚠ 精讀前改用 Wiley 版：瀏覽器另存 PDF，或用 Exa `web_fetch`（已實測可讀）全文另存，再讀新檔。文章的參考連結也要換成 DOI |
| D-5 | Tversky 2011, Visualizing Thought（topiCS 3） | 10.1111/j.1756-8765.2010.01113.x | 箭頭實驗（轉引 Heiser & Tversky 2006）。D 136、407、452 | `W/learning-visualization-research/src/tversky2011.txt`，133,871 | 作者教師頁 https://tc.columbia.edu/faculty/bt2158/faculty-profile/files/2011_Tversky_VisualizingThoughts.pdf | ✓ |
| D-6 | Heiser & Tversky 2006, Arrows in Comprehending and Producing Mechanical Diagrams（Cognitive Science 30）（轉引，經 Tversky 2011） | 10.1207/s15516709cog0000_70 | 箭頭實驗本身。D 136 | 無本機檔 | Wiley pdfdirect 免費開放（bronze；Exa 實測可讀） | ⚠ 精讀前另存 Wiley 版 |
| D-7 | Heer & Bostock 2010, Crowdsourcing Graphical Perception（CHI） | 10.1145/1753326.1753357 | 重做 Cleveland & McGill 的實驗，列參考。D 142、199、411、425、454、463–465 | `W/learning-visualization-research/src/heer-bostock2010.txt`，56,145 | 作者實驗室 http://vis.stanford.edu/files/2010-MTurk-CHI.pdf；ACM DL 開放 | ✓ |
| D-8 | Naps 等 2002, Exploring the role of visualization and engagement in computer science education（ITiCSE WGR） | 10.1145/782941.782998 | 六類投入方式與第一個假設。D 165、415、456 | `W/learning-visualization-research/src/naps2002.txt`，121,346 | 共同作者 Rodger 在 Duke 的網頁 https://users.cs.duke.edu/~rodger/jflappapers/Naps2002.pdf；ACM DL 開放 | ✓ |
| D-9 | Shaffer, Cooper, Alon, Akbar, Stewart, Ponce & Edwards 2010, Algorithm Visualization: The State of the Field（TOCE 10(3)） | 10.1145/1821996.1821997 | 超過 500 個、四分之一在畫排序、18 個（3.5%）。D 169、417、457 | `W/learning-visualization-research/src/shaffer2010.txt`，67,052 | 共同作者 Akbar 的網頁 https://cs.utep.edu/makbar/papers/TOCE.pdf；ACM DL 開放 | ✓ |
| D-10 | Sibia 等 2025（EuroVis 教育論文） | Eurographics Digital Library（10.2312/eved.20251027，DOI 未經 Crossref 核對） | 90 篇、288 篇。D 169、419、458 | `W/learning-visualization-research/src/sibia2025-eurovis.txt`，59,351 | Eurographics 數位圖書館 https://diglib.eg.org/bitstreams/c65f8ea5-9633-4a64-8758-906ce2e446e1/download | ✓（作者全名與 DOI 精讀時對首頁） |
| D-11 | Tversky, Morrison & Bétrancourt 2002, Animation: can it facilitate?（IJHCS 57） | 10.1006/ijhc.2002.1017 | 心臟血流的例子與英文原句；動畫一節的整體判斷。D 175–191、421、423、433、459–461 | `W/learning-visualization-research/src/tversky2002.txt`，55,289 | 作者教師頁（見上，位元組相同）。舊紀錄寫的 Stanford 課程頁要改 | ✓ |
| D-12 | Nesbit & Adesope 2006, Learning With Concept and Knowledge Maps: A Meta-Analysis（RER 76） | 10.3102/00346543076003413 | 0.28、0.19、0.82、0.47、0.74、0.39、55 個研究等大量數字。D 223、227、427、466 | `W/learning-visualization-research/src/nesbit-adesope2006.txt`，97,093 | 作者 Nesbit 在 SFU 的網頁 https://sfu.ca/~jcnesbit/articles/NesbitAdesope2006.pdf | ✓（檔尾是表 8；表格數字要對 PDF） |
| D-13 | Schroeder, Nesbit, Anguiano & Adesope 2018, Studying and Constructing Concept Maps: a Meta-Analysis（Educ. Psychol. Rev. 30） | 10.1007/s10648-017-9403-9 | 0.72、0.43、0.29、0.58、I² = 87.5。D 225–227、429、467 | `W/learning-visualization-research/src/schroeder2018-conceptmap.txt`，92,269 | SFU Summit 典藏的作者稿 | ✓（作者稿，數字要註明版本；檔尾是圖 2 說明） |
| D-14 | Leutner & Biele 2025, Without Integration, Everything Is Nothing: A Meta-Analysis of the Effects of Drawing…（Educ. Psychol. Rev.） | 10.1007/s10648-025-10067-7 | g = 0.04、−0.10、14 個研究、1,213 人。D 235、437、469 | `W/learning-visualization-research/src/integration-meta2025.md`，216,811 | Springer 開放取用（經 Jina 轉文字） | ✓（超過 20 萬字元，單獨一批；網頁版含站台雜訊與參考文獻） |

### 證據（第 1 篇）

| # | 書目 | DOI／網址 | 文章引用了什麼 | 檔案與長度 | 合法來源 | 完整 |
|---|---|---|---|---|---|---|
| E-1 | Fyfe & Nathan 2019, Making "concreteness fading" more concrete as a theory of instruction（Educational Review 71） | 10.1080/00131911.2018.1424116 | 具體漸退的理論，追溯到 Bruner 1966。E 76、213 | `W/teaching-text-research/src/fyfe_nathan2019.txt`，76,453 | Indiana University ScholarWorks（作者機構典藏） | ✓（作者稿，檔尾是圖 5） |
| E-2 | Alfieri, Nokes-Malach & Schunn 2013, Learning Through Case Comparisons: A Meta-Analytic Review（Educational Psychologist 48） | 10.1080/00461520.2013.775712 | 摘要結論「比較兩個案例勝過一次看一個」。E 82、213 | `R/pub5/alfieri2013-lrdc-wayback.txt`，138,403 | 共同作者 Schunn 在 Pitt LRDC 的論文頁（Wayback 快照，見上） | ✓（注意：舊紀錄的 alfieri2011 是另一篇） |
| E-3 | Trafton & Reiser 1993, The Contributions of Studying Examples and Solving Problems to Skill Acquisition（CogSci 15）（轉引，經 IES 2007） | eScholarship 71d733c9 | 六個例題全排在前面，學得比交替少。E 55、216 | `R/pub5/trafton-reiser1993-escholarship.txt`，24,785 | eScholarship（CogSci 論文集） | ✓ |
| E-4 | Richland, Kornell & Kao 2009, The pretesting effect: Do unsuccessful retrieval attempts enhance learning?（JEP: Applied 15）（轉引，經 Pan & Carpenter） | 10.1037/a0016496 | 2 分鐘答 5 題再讀 8 分鐘對讀 10 分鐘、含一週後測。E 216、240 | `R/pub5/richland2009-uchicago.txt`，88,022（15 頁） | 第一作者實驗室網站 | ✓ |
| E-5 | Geller, Carpenter, Lamm, Rahman, Armstrong & Coffman 2017, Prequestions do not enhance the benefits of retrieval in a STEM classroom（CR:PI 2）（轉引，經 Pan & Carpenter） | 10.1186/s41235-017-0078-z | 「兩個課堂研究」之一：讀前問一題加課後再考，和只課後考沒有差別。E 216、240 | `R/pub5/geller2017-pmc.txt`，65,664 | PMC5655599 | ✓ |
| E-6 | Carpenter, Rahman & Perkins 2018, The effects of prequestions on classroom learning（JEP: Applied 24）（轉引，經 Pan & Carpenter） | 10.1037/xap0000145 | 「兩個課堂研究」之二。E 216、240 | `R/pub5/carpenter2018-classroom-lab.txt`，60,244（11 頁） | 第一作者實驗室網站（見上） | ✓ |

### 提問（第 9 篇）

| # | 書目 | DOI／網址 | 文章引用了什麼 | 檔案與長度 | 合法來源 | 完整 |
|---|---|---|---|---|---|---|
| Q-1 | Kandemir, Esposito, Gurgand & Ramus 2026, A Meta-Analysis of the Impact of Feedback Timing on Learning Outcomes in Computer-Assisted Learning（Educ. Psychol. Rev. 38） | 10.1007/s10648-026-10117-8；ERIC EJ1504374 | 立即與延遲回饋平均沒有差別（目前標「只讀到摘要」）。Q 159、234 | `R/q3-activity/kandemir2026_hal.txt`，147,146（PDF：`kandemir2026_hal.pdf`） | HAL hal-05546645（https://hal.science/hal-05546645v1，作者存放） | ✓（檔尾是參考文獻） |
| Q-2 | Weissgerber, Brunmair & Rummer 2021, Null and Void? Errors in Meta-analysis on Perceptual Disfluency and Recommendations to Improve Meta-analytical Reproducibility（Educ. Psychol. Rev. 33） | 10.1007/s10648-020-09579-1 | 「正式發表的批評」：Xie 2018 編碼有錯，重算後遷移結論大致成立、回想有疑問。Q 129、234 | `W/teaching-text-research/src/PMC7854329.txt`，99,679（XML：`PMC7854329.xml`） | PMC7854329 | ✓（XML 轉文字，開頭是後設資料） |

## 二、找不到合法全文的研究來源（24 個）

這些在文章裡只能寫「存在」或「只讀到摘要」，不能引數字、不能列參考資料。試過的管道：OpenAlex、Unpaywall（占位 email）、Keenable、作者與機構網頁、ERIC、Wayback；圖表與證據篇的來源前輪另試過 Exa、Jina、NSF PAR、PMC（見 `W/learning-visualization-research/sources.md`、`W/teaching-text-research/sources.md`）。

| 書目 | DOI | 文章裡引用它的行號 | 現在文章怎麼用它 | 備註 |
|---|---|---|---|---|
| **Mayer 2021**, Evidence-Based Principles for How to Design Effective Instructional Videos（JARMAC 10） | 10.1016/j.jarmac.2021.03.007 | V 164、168、186、227、231、249、267；E 190 | **引了數字並列參考**：分段 d = 0.67、先備訓練 d = 0.85、生成活動 d = 0.68、煞車系統例子 | 本機有 `W/video-guide-research/dl2/mayer.txt`（61,533），但取自 archemedxinc.wpengine.com（公司網站轉存），不合規。另找到的 units.it Moodle 課程檔（接受稿）也是第三方。Unpaywall／OpenAlex 皆 closed。**這篇影響最大，要另外決定怎麼處理** |
| **Fiorella & Mayer 2016**, Eight Ways to Promote Generative Learning（EPR 28） | 10.1007/s10648-015-9348-9 | D 231、435、468 | **引了內容並列參考**：畫圖有效的條件、Schwamborn 的 d = 0.81 | 本機 `W/learning-visualization-research/src/fiorella-mayer2016.txt` 與 `R/q3-activity/fiorella_mayer2016.pdf` 取自一所蘇格蘭中學網站，不合規；其他候選是健身部落格、vdoc.pub，都不合規 |
| **Cleveland & McGill 1984**, Graphical Perception（JASA 79） | 10.1080/01621459.1984.10478080 | D 142、409、453 | **引了任務排序並列參考** | 本機 `cleveland-mcgill1984.txt` 是課程網站上的 JSTOR 下載檔；其他候選（UW、Wisconsin Canvas、Course Hero）都是課程或第三方 |
| Schroeder & Cenkci 2018, Spatial Contiguity and Spatial Split-Attention Effects（EPR 30）（經 Noetel 轉引） | 10.1007/s10648-018-9435-9 | D 88、386、399；L 146、231、245、247 | g = 0.63（經 Noetel 轉引，標只讀摘要） | |
| Schneider, Beege, Nebel & Rey 2018, signaling 統合分析（Educ. Res. Rev. 23）（經 Noetel 轉引） | 10.1016/j.edurev.2017.11.001 | D 96、386、399、431 | 0.43（經 Noetel） | |
| Sundararajan & Adesope 2020, Keep it Coherent（EPR 32） | 10.1007/s10648-020-09522-4 | D 102、386、399；Q 119、234 | D：0.33 經 Noetel；Q：只讀摘要 | `R/q1-learner/sundararajan2020.md` 只有參考文獻；博士論文版已有紀錄 |
| Adesope & Nesbit 2012, Verbal redundancy in multimedia learning environments（JEP 104）（經 Noetel 轉引） | 10.1037/a0026147 | D 399 | 0.15、0.29、−0.04 經 Noetel | 修改紀錄寫 2012；OpenAlex 列 2011 線上 |
| Höffler & Leutner 2007, Instructional animation versus static pictures（L&I 17） | 10.1016/j.learninstruc.2007.09.013 | D 177、386、399、421 | d = 0.37 經 Berney；0.40／−0.05 經 Noetel | |
| Novick & Hurley 2001, To Matrix, Network, or Hierarchy（Cognitive Psychology 42） | 10.1006/cogp.2000.0746 | D 132、385、386 | 只提存在 | |
| Fiorella & Zhang 2018, Drawing Boundary Conditions for Learning by Drawing（EPR 30） | 10.1007/s10648-018-9444-8 | D 233、386 | 只提存在 | |
| Zhang & Fiorella 2021, Learning by drawing: When is it worth the time and effort?（CEP 66） | 10.1016/j.cedpsych.2021.101990 | D 233、386 | 只提存在 | Unpaywall 列 bronze，但 ScienceDirect 實測只給摘要與片段 |
| Cromley, Du & Dane 2020, Drawing-to-Learn（JSET 29） | 10.1007/s10956-019-09807-6 | D 235、386、437 | 只讀摘要 | 與 Cromley & Chen 2025 是不同篇 |
| Kueker & Moore 2023, Learning from screencast software tutorials（JCAL） | 10.1111/jcal.12875 | L 152、231 | 只提存在 | |
| Ploetzner 2022, The effectiveness of enhanced interaction features in educational videos: a meta-analysis（ILE） | 10.1080/10494820.2022.2123002 | L 175、231 | 只提存在 | ploetzner2021 紀錄是另一篇 |
| Traphagan, Kucsera & Kishi 2010, Impact of class lecture webcasting on attendance and learning（ETR&D 58）（經 Karnad 轉引） | 10.1007/s11423-009-9128-7 | V 231、243 | 83%／70% | |
| Leadbeater, Shuttleworth, Couperthwaite & Nightingale 2013, Evaluating the use and impact of lecture recording in undergraduates（C&E 61）（經 Karnad 轉引） | 10.1016/j.compedu.2012.09.011 | V 116、231、243 | 七人中六人、5 小時門檻 | Birmingham／Aston 典藏頁沒有檔 |
| Lawson, Bodle, Houlette & Haubner 2006, Guiding Questions Enhance Student Learning from Educational Videos（Teaching of Psychology 33）（經 Brame 轉引） | 10.1207/s15328023top3301_7 | V 255 | 8 個引導問題、成績較高 | |
| Luiten, Ames & Ackerson 1980, advance organizers 統合分析（AERJ 17） | 10.3102/00028312017002211 | E 149、213 | 只讀摘要 | |
| McNamara, Kintsch, Songer & Kintsch 1996, Are Good Texts Always Better?（C&I 14） | 10.1207/s1532690xci1401_1 | E 159、213 | 只讀摘要 | 舊紀錄的 mcnamara2011 是另一篇 |
| Pressley, Tanenbaum, McDaniel & Wood 1990, prequestions 實驗（CEP 15）（經 IES 轉引） | 10.1016/0361-476X(90)90003-J | E 180、216 | 要作答才有效 | |
| Schworm & Renkl 2006, Computer-supported example-based learning（C&E 46）（經 Bisra 轉引） | 10.1016/j.compedu.2004.08.011 | E 184、216 | 只給提示的組勝過提示加可點選解釋 | |
| Van der Kleij, Feskens & Eggen 2015, Effects of Feedback in a Computer-Based Learning Environment（RER 85） | 10.3102/0034654314564881 | Q 74、159、234 | 只讀摘要 | UTwente、ACU、Cito 的典藏頁都沒抓到檔（頁面可能要 JS），值得再用瀏覽器試一次 |
| Ginns, Martin & Marsh 2013, Designing Instructional Text in a Conversational Style（EPR 25） | 10.1007/s10648-013-9228-0 | Q 113、234 | 只讀摘要 | Western Sydney 典藏頁沒有檔 |
| Xie, Zhou & Liu 2018, Null Effects of Perceptual Disfluency on Learning Outcomes（EPR 30） | 10.1007/s10648-018-9442-x | Q 129、234 | 只讀摘要 | 批評文（Q-2）有全文 |

前三列與其他列不同：文章**現在仍引用數字或內容並列進參考資料**，依據是不合規來源的檔。這三篇不是補讀能解決的，要先決定改寫成「存在」還是另想辦法取得合法版本（例如向作者索取）。

## 三、官方文件與網站類（不進精讀批次）

這些不是研究，核對方式是對網頁存檔逐句比對文章的說法；存檔沒有的要重抓並記抓取日期。

| 來源 | 文章行號（約） | 存檔 | 核對方式 |
|---|---|---|---|
| Schade 2014, Video Usability（NN/g） | V 110、260 | `W/video-guide-research/dl/t8.txt`、`dl/raw8.html` | 對存檔，確認「影片只能循序觀看」的轉述 |
| Lavigne 2024, Wistia 播放率文章 | V 75、225、261 | `W/video-guide-research/dl/t6.txt`、`dl/raw6.html` | 對存檔；文章已註明它沒有數字也沒有依據 |
| Google Search Central 部落格 2023-12（影片主內容）與 Video SEO best practices | V 96、98、271–272 | `dl/t4.txt`、`dl/raw4.html`；`dl/t7.txt`、`dl/raw7.html` | 對存檔，並重抓現行版看條件有沒有改 |
| web.dev, Best practices for using third-party embeds | V 272 附近 | `dl/t3.txt`、`dl/raw3.html` | 對存檔 |
| 六個課程網站頁面（V）與五個實測頁面（L） | V 參考資料、L 118–141 | `W/video-guide-research/dl/peers/p1–p10.txt`；`W/video-layout-research/sites/`（截圖、`results*.json`） | 對存檔與量測輸出；網站會改版，結論標日期 |
| CafeMedia 2021 sticky elements；Coalition for Better Ads 標準與 Large Sticky Ads | L 160–167、260–261 | `W/video-layout-research/cafemedia.txt`、`betterads.txt`、`betterads-sticky.txt` | 對存檔：不到一成、超過三成、17%、30%、超過 15 萬人 |
| HTML Standard, iframe 元素 | L 參考資料 | `W/video-layout-research/html-iframe.txt` | 對存檔 |
| WCAG 2.2 與 W3C 複雜圖片教學 | D 253–255、271、471 | `W/learning-visualization-research/src/w3c-*.md`；已有紀錄 `w3c2024-wcag22.md`、`w3c-wai2026-complex-images.md` | 先看既有紀錄是否涵蓋文章引的準則，缺的對存檔 |
| Apple HIG Typography／Accessibility | D 257、441、472 | `src/apple-hig-typography.json`、`apple-hig-accessibility.json` | 對 JSON 裡的字級表（17pt／11pt 等） |
| mermaid、rehype-mermaid、D2 文件 | D 273、289–290、473 | `src/mermaid-accessibility.md`、`rehype-mermaid-README.md`、`d2-themes.md` | 對存檔，並對 repo 實際安裝的版本 |
| 13 個教學網站的字數與圖數、Distill 暫停公告 | D 298–318、474 | `src/sites/`、`site-counts/output.txt`；已有紀錄 `distill2021-hiatus.md` | 重跑 `site-counts/count_sites.py` 對數字 |
| Wiggins & McTighe, Understanding by Design（書） | Q 151 | 無 | 只交代出處，文章沒引內容；不需核對 |
| NSF PAR「接受稿 2026-11-01 起公開」 | Q 111、235；E 190、214 | 無 | 開 https://par.nsf.gov/biblio/10637927 截存頁面上的公開日 |

## 四、精讀批次表

一批 3–5 篇；超過 20 萬字元的單獨一批。規則照 `.research/2026-10-14-close-reading-brief.md`，抽取紀錄寫到 `.research/extractions/articles-that-teach/`。

| 批次 | 來源（本清單編號） | 合計長度（約） | 特別交代 |
|---|---|---|---|
| V01 | V-1 Harley、V-2 Karnad、V-3 Soong | 88,000 | Karnad 轉引 Soong 的數字，兩篇要互相對；Harley 抽的是位置觀察與 26% 的出處句 |
| V02 | V-4 Kim 2014、V-5 Guo 2014、V-6 Pavel 2014 | 201,000 | 三篇都是雙欄 `-layout` 轉文字，表格與圖說對 PDF（`.raw`／`.pdf`）。Pavel 同時記 V 引的瀏覽實驗與 L 引的版面描述 |
| V03 | V-7 Carpenter & Toftness、V-8 Szpunar、V-9 Lawson & Mayer、V-10 Brame | 206,000 | Lawson & Mayer 另記 Q 58 的「只讀現成解釋」那一句；Brame 記它怎麼轉述 Lawson 2006 |
| V04 | L-1 Papeos、L-2 LectureScape、L-3 Visual Transcripts | 266,000 | Papeos 讀 flow 版、表對 PDF；Visual Transcripts 先另存 ACM PDF |
| V05 | L-4 Noetel（預印本）、L-5 Zhang 2024 | 202,000 | Noetel 同時供 L 與 D，D 引的 0.63、0.43、0.33、0.41 對 0.27 等轉引數字一併抽；記預印本摘要與結果段 78,177／79,415 的差異 |
| V06 | L-6 Navarrete 2025 | 224,000 | 單獨一批 |
| V07 | D-1 Guo 2020、D-2 Cooper 2018、D-3 Trypke 2023 | 288,000 | |
| V08 | D-4 Larkin & Simon、D-5 Tversky 2011、D-6 Heiser & Tversky 2006 | 約 260,000（Heiser 未計） | 先另存 Wiley 版的 Larkin 與 Heiser；Tversky 2011 對 Heiser 的轉述要和原文對 |
| V09 | D-7 Heer & Bostock、D-8 Naps 2002、D-9 Shaffer 2010、D-10 Sibia 2025 | 304,000 | Heer & Bostock 抽它重做 Cleveland & McGill 的哪些部分（Cleveland 本身沒有合法全文） |
| V10 | D-11 Tversky 等 2002、D-12 Nesbit & Adesope 2006、D-13 Schroeder 等 2018 | 245,000 | 兩篇概念圖統合分析的表格數字都要對 PDF |
| V11 | D-14 Leutner & Biele 2025 | 217,000 | 單獨一批 |
| V12 | E-1 Fyfe & Nathan、E-2 Alfieri 2013、E-3 Trafton & Reiser | 240,000 | Trafton & Reiser 對 IES 的轉述（`ies2007` 紀錄第 86 行） |
| V13 | E-4 Richland 2009、E-5 Geller 2017、E-6 Carpenter 2018 | 214,000 | 三篇都對 Pan & Carpenter 的轉述（`pan_carpenter2023` 紀錄第 38、220 行） |
| V14 | Q-1 Kandemir 2026、Q-2 Weissgerber 等 2021 | 247,000 | Kandemir 對照 Van der Kleij 2015 摘要的延遲回饋說法（後者沒有全文，只能比摘要） |

共 14 批、38 篇。第二節的 24 篇與第三節的網站類不進批次。

## 交給使用者決定的事

1. Mayer 2021、Fiorella & Mayer 2016、Cleveland & McGill 1984 三篇，文章現在引了數字或內容、也列在參考資料，但手上的檔都不是合法來源，也找不到合法版本。要改寫成「存在」並移出參考資料，還是另找管道（例如寫信向作者要）？
2. Larkin & Simon 1987 的參考連結目前指向 UCSD 課程網站，Tversky 等 2002 指向 Stanford 課程網站；合法版本分別是 Wiley 免費版與 Tversky 的教師頁，連結要換。
