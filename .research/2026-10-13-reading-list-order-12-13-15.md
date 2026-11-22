# 精讀來源清單：order 12、13、15（deep-research 2.5 第二段「選讀」）

日期：2026-10-13
挑選者：q1-learner
狀態：只挑、不讀。這份清單給使用者看過之後才進入精讀。

對應筆記：`.research/2026-10-13-learning-content-q1-learner.md`（order 12、13、15）、`.research/2026-10-13-learning-content-q4-time.md` 篇四前半（order 15）。

路徑縮寫：
- `Q1/` = `.research/raw/learning-content/q1-learner/`
- `Q4/` = `.research/raw/learning-content/q4-time/`
- `TT/` = `.work/teaching-text-research/src/`

「總長度」是轉成純文字後的位元組數（`wc -c`），含參考文獻與頁首頁尾；精讀時讀取紀錄要以這個數字為分母。「之前讀到哪裡」照兩份筆記盤點表的記載，都是用關鍵字跳著讀的段落，沒有任何一篇從頭讀到尾。

挑選標準：文章裡會出現數字或「研究發現」字樣的結論，背後那一篇就要進清單；每篇清單至少一篇結果相反或沒有效果的研究（表中標「反向／無效」）。

---

## order 12　先備知識

聚焦問題：同一段解說為什麼對有些人太少、對有些人太多；作者看不到讀者能做什麼。

| # | 來源 | DOI／網址 | 要撐哪一條結論 | 檔案與總長度 | 之前讀到哪裡 |
|---|---|---|---|---|---|
| 1 | Simonsmeier, Flaig, Deiglmayr, Schalk, Schneider (2022). Domain-specific prior knowledge and learning: A meta-analysis. *Educational Psychologist* 57, 31–54 | [10.1080/00461520.2021.1939700](https://doi.org/10.1080/00461520.2021.1939700)；[作者接受稿](https://www.uni-trier.de/fileadmin/fb1/prof/PSY/PAE/Team/Schneider/SimonsmeierEtAl_2021.pdf) | 先備知識多的人讀完知道得多（r = .53）；先備知識不預測這次學到多少（標準化增益 r = −.06，預測區間很寬）；絕對增益是負相關；九個隨機實驗顯示先教先備知識會提高後測。**反向／無效**（對「知識越多學越多」而言） | `Q1/simonsmeier2021_am.pdf`、`.txt`，134,166 | 摘要、效果量準備一段、資料概況、主要結果與 Table 2、絕對與標準化增益比較、調節變項段首。討論後半、限制、補充資料沒讀。是接受稿，不是刊出版 |
| 2 | Brod (2021). Toward an understanding of when prior knowledge helps or hinders learning. *npj Science of Learning* 6:24 | [10.1038/s41539-021-00103-w](https://doi.org/10.1038/s41539-021-00103-w) | 先備知識要被喚起、與任務相關、與要學的內容一致才可靠地有幫助；這是解讀 #1 的框架。評論文章，不是實證 | `Q1/brod2021_PMC8377096.txt`，15,737 | 整篇讀過一次（短文），但沒有抽取紀錄 |
| 3 | Tetzlaff, Simonsmeier, Peters, Brod (2025). A cornerstone of adaptivity: A meta-analysis of the expertise reversal effect. *Learning and Instruction* 98:102142 | [10.1016/j.learninstruc.2025.102142](https://doi.org/10.1016/j.learninstruc.2025.102142) | 高協助教材對低先備者有幫助（d = 0.51）、對高先備者有害（d = −0.43）；「高／低」在各研究裡是相對的 | `TT/tetzlaff2025.pdf`、`.txt`，92,342 | 我沒讀；文字解說那份研究讀了摘要、納入標準、研究特徵、主結果、調節、限制、實務意涵（`.work/teaching-text-research/notes.md`） |
| 4 | McNamara, Ozuru, Floyd (2011). Comprehension challenges in the fourth grade: The roles of text cohesion, text genre, and readers' prior knowledge. *IEJEE* 4(1) | [ERIC EJ1070456](https://files.eric.ed.gov/fulltext/EJ1070456.pdf) | 連貫度高的文字不是對所有讀者都好：知識多的學童讀低連貫的敘事文反而理解較好；只加連接詞不補解釋不夠 | `Q1/mcnamara2011_EJ1070456.pdf`、`.txt`，103,392 | 摘要、受試者、討論首段、限制。方法與結果表沒讀 |
| 5 | Rethinking pre-training: cognitive load implications for learners with varying prior knowledge (2025). *Frontiers in Psychology* | [PMC12367772](https://pmc.ncbi.nlm.nih.gov/articles/PMC12367772/) | 事前訓練對高先備者也降低外在認知負荷，沒有出現預期的反轉。**反向／無效**（對 #3 而言） | `Q1/pretraining2025_PMC12367772.xml`，144,624（XML，含標記；沒有轉成純文字的版本） | 摘要、限制。方法與結果沒讀；作者群沒核對 |
| 6 | Scheiter & Gerjets (2007). Learner control in hypermedia environments. *Educational Psychology Review* 19 | [10.1007/s10648-007-9046-3](https://doi.org/10.1007/s10648-007-9046-3) | 讓讀者自己選路徑對誰有利：先備知識低的人需要預排的路徑 | `Q4/scheiter-gerjets2007-learner-control.md`，50,191。**檔案不完整**：Keenable 的 50k 視窗，缺開頭與結尾；Springer 付費 | q4 讀了中段四節（先備知識等）。要精讀得先補到完整全文 |
| 7 | Kim & Ko (2017). A pedagogical analysis of online coding tutorials. SIGCSE '17 | [10.1145/3017680.3017728](https://doi.org/10.1145/3017680.3017728)；[作者稿](https://faculty.washington.edu/ajko/papers/Kim2017CodingTutorialEvaluation.pdf) | 30 個熱門線上程式教學沒有一個依程式經驗建議起點；現成教學怎麼處理（或不處理）先備差異 | `Q1/kimko2017.pdf`、`.txt`，46,051 | 摘要、3.1 節。取樣方法、結果表、限制沒讀 |
| 8 | Mullaney & Reich (2015). Staggered versus all-at-once content release in massive open online courses. L@S '15 | [10.1145/2724660.2728672](https://doi.org/10.1145/2724660.2728672) | 給彈性，多數人就不照建議順序讀；所以每篇都要自己交代先備並給回去的連結 | `Q4/mullaney-reich2015-staggered-release.md`，35,212 | q4 讀了前言片段、結論。DOI 是我依題名填的，精讀時核對 |
| 9 | Google. Technical Writing One：Audience | [developers.google.com/tech-writing/one/audience](https://developers.google.com/tech-writing/one/audience) | 實務做法：文件 = 讀者需要的 − 讀者已有的；先定義讀者角色；知識的詛咒 | `Q1/google_tw_audience.html`、`.txt`，13,119 | 前半（定義讀者）讀過；後半沒讀 |
| 10 | MDN. Writing style guide | [developer.mozilla.org/…/Writing_style_guide](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide) | 實務做法：教學文開頭要寫明先備知識與涵蓋範圍 | `Q1/mdn_writing_learn.html`、`.txt`，53,407 | 只讀了關鍵字命中的四段 |

合計 10 個；有完整全文檔 9 個，1 個檔案不完整（#6）。

### 目前找不到可精讀的來源、所以不能寫的結論

- 「讀者依先備清單自己判斷該不該讀這篇，判斷得準不準」：兩輪都沒找到任何研究。
- 「可收合的補充說明、跳讀指引、分級入口在網頁長文的效果」：沒有找到直接研究。文章只能寫成本站的做法與理由，不能寫成有證據支持。
- 「連貫度高的文字對成人熟手較差」：手上只有四年級學童的研究（#4）。成人的原始研究（McNamara 等 1996）沒有全文。
- 「先備知識多的人學新東西比較快（rich-get-richer）」：只有摘要。

### 我認為該列但沒有全文的來源

| 來源 | 為什麼該列 | 試過的管道 |
|---|---|---|
| McNamara, E. Kintsch, Songer, W. Kintsch (1996). Are good texts always better? *Cognition and Instruction* 14(1) | reverse cohesion effect 的原始研究，成人樣本 | 文字解說那份研究試過 Exa、ASU 典藏、ERIC、Keenable，只到摘要與預覽片段；本輪 Unpaywall 查無 OA |
| O'Reilly & McNamara (2007). Reversing the reverse cohesion effect. *Discourse Processes* 43(2) | 結果相反：會用閱讀策略的高知識讀者讀高連貫文字反而較好 | Keenable 只找到 ERIC 與 ASU 的書目頁；Unpaywall 查無 OA。沒試 Exa 抓取 |
| Witherby & Carpenter (2022). The rich-get-richer effect. *JEP: LMC* 48 | 先備知識預測新學習的實驗證據，與 #1 的增益結果方向不同 | Keenable 只找到 PubMed 與 Ovid 摘要頁；Unpaywall 查無 OA。沒試作者網頁 |
| Scheiter & Gerjets 2007 的完整版 | #6 的檔案缺頭尾 | Springer 付費；q4 用 Keenable 只拿到 50k 視窗。沒試 jina 與 Exa |

---

## order 13　讀者已經相信錯的東西

聚焦問題：「常見誤解」段落有用嗎、對誰有用、會不會把誤解種進去。

| # | 來源 | DOI／網址 | 要撐哪一條結論 | 檔案與總長度 | 之前讀到哪裡 |
|---|---|---|---|---|---|
| 1 | Danielson 等 (2024). The effectiveness of refutation text in confronting scientific misconceptions: A meta-analysis. *Educational Psychologist* | [10.1080/00461520.2024.2365628](https://doi.org/10.1080/00461520.2024.2365628)；[NSF PAR 作者稿](https://par.nsf.gov/servlets/purl/10629626) | 反駁式文字平均比非反駁式好（正確信念 g = 0.37）；預測區間跨零；26 個調節變項都不顯著；對情緒與態度沒有顯著效果 | `Q1/danielson2024.pdf`、`.raw.txt`，158,811（`.txt` 是雙欄版面抽取，數字表會錯位，精讀用 `.raw.txt`） | 摘要、納入標準、backfire 一段、主要結果與一張表、調節變項摘要、限制。完整作者群沒核對 |
| 2 | Schroeder & Kucera (2022). Refutation text facilitates learning: A meta-analysis of between-subjects experiments. *Educational Psychology Review* 34, 957–987 | [10.1007/s10648-021-09656-z](https://doi.org/10.1007/s10648-021-09656-z)；[PMC8784251](https://pmc.ncbi.nlm.nih.gov/articles/PMC8784251/) | 第二份獨立統合分析（g = 0.41）；出版類型的調節；最長文章 1,542 字，對教科書長度是否成立不清楚 | `TT/schroeder_kucera2022.xml`、`.txt`，86,357 | 我沒讀；文字解說那份研究讀了摘要、方法、主結果、出版偏誤、調節變項表、討論、限制。DOI 是我依題名填的，精讀時核對 |
| 3 | Dersch, Thacker, Eitel (2026). Should we tell teachers that they are (in)correct? How personalized refutation text promotes or hampers conceptual change. *Educational Psychology Review* | [10.1007/s10648-026-10116-9](https://doi.org/10.1007/s10648-026-10116-9) | 對本來沒有該誤解的讀者，反覆提起誤解可能有害；12.5% 的人後測更差，集中在個人化反駁文組。**反向／無效** | `Q1/persrefutation2026.md`、`.txt`，116,675（jina 版，沒有摘要與作者欄） | 引言、受試者一段、討論前四段。方法、結果統計、限制沒讀 |
| 4 | Ecker, Sharkey, Swire-Thompson (2023). Correcting vaccine misinformation: A failure to replicate familiarity or fear-driven backfire effects. *PLOS ONE* 18 | [10.1371/journal.pone.0281140](https://doi.org/10.1371/journal.pone.0281140) | 「提起誤解會讓它更熟悉、更被相信」沒有複製出來。**反向／無效**（對 #3 的事後解釋而言） | `Q1/ecker2023_plos.pdf`、`.txt`，77,296（本輪新下載） | 完全沒讀，只確認了題名與作者 |
| 5 | Swire-Thompson, DeGutis, Lazer (2020). Searching for the backfire effect: Measurement and design considerations. *JARMAC* 9 | [10.1016/j.jarmac.2020.06.006](https://doi.org/10.1016/j.jarmac.2020.06.006)；[PsyArXiv 預印本](https://doi.org/10.31234/osf.io/ba2kc) | 反效果在文獻裡有多常見、量測上有什麼問題；讓文章能交代「會不會把誤解種進去」目前的整體證據 | `Q1/swire2020_psyarxiv.pdf`、`.txt`，71,967（本輪新下載；預印本，不是刊出版） | 完全沒讀，只確認了題名與作者 |
| 6 | Prinz, Golke, Wittwer (2021). Counteracting detrimental effects of misconceptions on learning and metacomprehension accuracy: The utility of refutation texts and think sheets. *Instructional Science* 49 | [10.1007/s11251-021-09535-8](https://doi.org/10.1007/s11251-021-09535-8) | 讀一般文字時誤解多的人理解較差，讀反駁文或填對照表時差距消失；兩種做法沒有差別 | `Q1/prinz2021.md`、`.txt`，86,916 | 引言首段、受試者、設計、材料幾段、討論首節。結果統計與限制沒讀 |
| 7 | Smith, diSessa, Roschelle (1993). Misconceptions reconceived: A constructivist analysis of knowledge in transition. *Journal of the Learning Sciences* 3(2), 115–163 | [10.1207/s15327809jls0302_1](https://doi.org/10.1207/s15327809jls0302_1) | 另一種立場：既有想法是可以修整的材料，不是要拔掉的錯誤。理論文章，沒有效果量 | `Q1/smith1993.pdf`、`.txt`，149,098（JSTOR 掃描版，49 頁） | 摘要與一段案例分析，約兩頁 |
| 8 | Brod (2021). 同 order 12 #2 | 同上 | 既有知識與新內容不一致時最難學；重組幅度越大越難。評論 | `Q1/brod2021_PMC8377096.txt`，15,737 | 整篇讀過一次，沒有抽取紀錄 |
| 9 | Chiodini 等。Programming Misconceptions 網站（progmiscon.org） | [progmiscon.org/misconceptions](https://progmiscon.org/misconceptions) | 實務端：程式領域有人把常見誤解逐條整理成目錄。本站讀者最接近的領域 | `Q1/progmiscon.html`、`.txt`，9,289（只有索引頁，沒有任何一條誤解的內頁） | 沒讀內容。精讀前要先抓幾條內頁與「關於」頁 |
| 10 | 本站材料：CS50 AI 七週導讀的審稿報告 | `.work/reviews/2026-10-13-cs50ai-w0*-review.md`（8 個檔） | 本站案例：原專案參考程式六週跑不起來或規則寫反，是教材自己製造錯誤先備的實例 | 8 個檔合計 349,728 | 只讀過 w01 的幾行。不是外部來源，不進參考資料，但文章要引它的內容就得讀完 |

合計 10 個（8 個外部研究或文件、1 個實務網站、1 組本站材料）；外部來源都有檔案，其中 #9 只有索引頁。

### 目前找不到可精讀的來源、所以不能寫的結論

- 「有誤解的讀者同時高估自己懂多少」（double curse）：原始研究是 Prinz 等 2018 與 2019，兩篇都沒有全文；手上只有 #6 引言裡的一句轉述。精讀 #6 之後也只能寫成「同一團隊先前的研究指出」，不能引數字。
- 「反駁文研究在方法上有哪些混淆」：Zengilowski 等 2021 沒有全文，只有兩篇後續論文各一句轉述。
- 「程式或數學教學文裡的常見誤解段落有沒有效」：兩份統合分析只收科學主題，受試者讀的是 1,500 字以內的短文。沒有找到程式教學文的反駁式寫法研究。這一點文章要寫成缺口。
- 「誤解要寫在正確解釋之前還是之後、要寫幾條」：沒有找到可引的來源。

### 我認為該列但沒有全文的來源

| 來源 | 為什麼該列 | 試過的管道 |
|---|---|---|
| Zengilowski, Schuetze, Nash, Schallert (2021). A critical review of the refutation text literature. *Educational Psychologist* 56 | 對整個研究典範的批判，是 #1、#2 的反面意見 | T&F 付費；figshare 只有補充資料；Wayback 無快照；Exa 兩輪（頁面 timeout、doi 只回書目）。2026-10-14 再找一輪：Unpaywall、OpenAlex、CORE、Internet Archive Scholar、OSF、作者個人頁都沒有合法公開的全文。Keenable 抓付費頁回了正文前 50,000 字元（`Q1/zengilowski2021_kf_pub0.md`），不是作者或出版社公開的版本，沒讀，等裁決 |
| Prinz, Golke, Wittwer (2018). The double curse of misconceptions. *Instructional Science* 46 | double curse 的原始研究 | 本輪只查了 Unpaywall（無 OA）。沒試 jina 抓 Springer 頁，也沒試作者機構典藏 |
| Prinz, Golke, Wittwer (2019). Refutation texts compensate for detrimental effects of misconceptions on comprehension and metacomprehension accuracy and support transfer. *J Educ Psychol* 111 | 同上，且直接測反駁文對後設理解的效果 | 只查了 Unpaywall（無 OA）。APA 期刊，沒試其他管道 |
| Qian & Lehman (2017). Students' misconceptions and other difficulties in introductory programming: A literature review. *ACM TOCE* 18(1) | 程式領域誤解的文獻回顧 | ACM DL 對 curl 回 403；Exa 只回摘要 |
| Chiodini 等 (2021). A curated inventory of programming language misconceptions. ITiCSE '21 | #9 網站背後的論文 | 只搜到 ACM DL 頁，沒有嘗試抓取 |

---

## order 15　讀者知不知道自己懂了

聚焦問題：讀者判斷自己懂了沒有多準；文章能做什麼讓他判斷得準一點。

| # | 來源 | DOI／網址 | 要撐哪一條結論 | 檔案與總長度 | 之前讀到哪裡 |
|---|---|---|---|---|---|
| 1 | Yang, Zhao, Yuan, Luo, Shanks 等 (2023). Mind the gap between comprehension and metacomprehension: Meta-analysis of metacomprehension accuracy and intervention effectiveness. *Review of Educational Research* | [10.3102/00346543221094083](https://doi.org/10.3102/00346543221094083)；[UCL 接受稿](https://discovery.ucl.ac.uk/10150804/) | 沒有介入時，判斷與實際表現的相關只有 0.178（約 55% 正確率）；哪些介入有效；理解越好判斷越準 | `Q1/yang2023_ucl.pdf`、`.txt`，176,119；`Q4/yang2023-mind-the-gap-meta.txt`，176,262（同一份接受稿的兩次下載，精讀挑一份） | q1：摘要、納入標準、出版偏誤檢查前兩種、限制。q4：摘要、總討論前半。各介入的效果量表沒讀。作者群我只確認到 Yang 與 Shanks，精讀時核對 |
| 2 | Prinz, Golke, Wittwer (2020). To what extent do situation-model-approach interventions improve relative metacomprehension accuracy? Meta-analytic insights. *Educational Psychology Review* 32 | [10.1007/s10648-020-09558-6](https://doi.org/10.1007/s10648-020-09558-6) | 介入把相關從 .14 拉到 .41（g = 0.46）；告知會被考理解題最有效；重讀幫助小；自我解釋不顯著（**無效**的一項） | `Q1/prinz2020sma.md`、`.txt`，103,076；`Q4/prinz2020-metacomprehension-meta.md`，144,171（同一篇，q4 版含連結標記） | q1：引言首段、主要結果、出版偏誤、討論首節。q4：結果、討論前半。各介入類型的表與限制沒讀 |
| 3 | Prinz, Golke, Wittwer (2021). 同 order 13 #6 | 同上 | 有誤解的讀者更高估自己；反駁文與對照表對判斷準確度的效果 | `Q1/prinz2021.txt`，86,916 | 同 order 13 #6；後設理解那部分的結果沒讀 |
| 4 | Rozenblit & Keil (2002). The misunderstood limits of folk science: An illusion of explanatory depth. *Cognitive Science* 26 | [PMC3062901](https://pmc.ncbi.nlm.nih.gov/articles/PMC3062901/) | 人覺得自己對機制的理解比實際深；被要求寫出解釋後自評下降 | `Q4/rozenblit-keil2002-ioed-jina.md`，154,400（完整）；`Q4/rozenblit-keil2002-ioed.md`，50,236（截斷版，不用） | q4：摘要、研究一結果、研究 1–6 總討論。研究 7–12 沒讀 |
| 5 | Deslauriers, McCarty, Miller, Callaghan, Kestin (2019). Measuring actual learning versus feeling of learning in response to being actively engaged in the classroom. *PNAS* 116 | [PMC6765278](https://pmc.ncbi.nlm.nih.gov/articles/PMC6765278/) | 感覺學得多不等於學得多：主動學習組自評低 0.56 個標準差，測驗高 0.46 | `Q4/deslauriers2019-feeling-of-learning.md`，34,679 | q4：方法、結果。討論與限制沒讀。作者群是我依記憶填的，精讀時核對 |
| 6 | Yan, Bjork, Bjork (2016). On the difficulty of mending metacognitive illusions. *JEP: General* 145 | [APA 全文 PDF](https://www.apa.org/pubs/journals/features/xge-xge0000177.pdf) | 就算告訴學習者哪種方法有效，錯誤的感覺也很難改 | `Q4/yan2016-mending-illusions.txt`，126,477 | q4：前言片段、總討論。各實驗的方法與結果沒讀 |
| 7 | Macaluso, Beuford, Fraundorf (2022). Familiar strategies feel fluent. *Journal of Intelligence* 10 | [PMC9590044](https://pmc.ncbi.nlm.nih.gov/articles/PMC9590044/) | 費力的做法被評為學得較少；76.6% 的人之後仍選比較不費力的那種 | `Q4/familiar-strategies-feel-fluent-2022.md`，121,956 | q4：研究一受試者與結果、討論與限制片段。研究二的學習成績段沒找到 |
| 8 | St. Hilaire, Chan, Ahn (2024). Guessing as a learning intervention: A meta-analytic review of the prequestion effect. *Psychonomic Bulletin & Review* | [10.3758/s13423-023-02353-8](https://doi.org/10.3758/s13423-023-02353-8) | 讀前先答題只幫到被問到的內容（g = 0.54），沒被問到的內容幾乎沒有效果（g = 0.04）。**反向／無效**（對「放幾題就能帶動整篇」而言） | `Q1/sthilaire2024.md`、`.txt`，137,658（jina 版，沒有摘要） | 引言相關段、主要結果、出版偏誤、調節變項一段、結論。納入標準、調節變項表、限制沒讀 |
| 9 | Pan & Carpenter (2023). Prequestioning and pretesting effects: A review of empirical research, theoretical perspectives, and implications for educational practice. *Educational Psychology Review* 35 | [10.1007/s10648-023-09814-5](https://doi.org/10.1007/s10648-023-09814-5) | 前測題在文章、影片、講課上的效果範圍；典型實驗裡受試者先備很低；前測題當診斷工具的用法 | `Q1/pan2023.md`、`.txt`，125,093 | 文字教材一節、結論。其餘沒讀 |
| 10 | Kovacs (2016). Effects of in-video quizzes on MOOC lecture viewing. L@S '16 | [10.1145/2876034.2876041](https://doi.org/10.1145/2876034.2876041) | 題目出現後讀者實際怎麼做：74% 會作答；常見行為是作答前往回找答案 | `Q4/kovacs2016-in-video-quizzes.md`，31,369 | q4：資料、方法、限制、seek 分析。後半沒讀 |
| 11 | Zengilowski 等 (2025). Encouraging metacognitive reflection through prompts in a computer-based learning platform: Failure to find a benefit in a large-scale randomized trial. L@S '25 | [10.1145/3698205.3729547](https://doi.org/10.1145/3698205.3729547) | 請學習者先反思自己懂多少，在 1,005 人的預先註冊實驗裡沒有任何效果。**反向／無效** | **沒有全文**。`Q4/zengilowski2025-metacognitive-prompts.md`，14,662，只有摘要與參考文獻。試過：ACM DL（付費牆）、Keenable（只回摘要）、Unpaywall（本輪查，無 OA）；q4 記載沒找到作者自存版 | 只有摘要 |

合計 11 個；有全文檔 10 個，1 個沒有全文（#11）。

與其他篇的重疊：#8、#9 也會被 order 9（文章裡的題目與回饋，已寫、審稿修正中）用到。精讀的抽取紀錄做一次，兩篇共用；order 15 只取「題目讓讀者看見自己不會什麼」這個角度。#5、#6、#7 與 order 16、25 可能共用。

### 目前找不到可精讀的來源、所以不能寫的結論

- 「文章附的檢查題能讓讀者判斷得更準」：統合分析裡有效的介入是讓讀者自己延後寫摘要、列關鍵詞，或事先告知會被怎麼考。作者替讀者準備題目這個做法，我沒有找到直接測它對判斷準確度的研究。文章只能寫成從「預期被考理解題」推出來的做法，並明說是推論。
- 「請讀者停下來想一想自己懂了沒，沒有用」：唯一的大型實驗（#11）只有摘要，拿不到全文就不能寫。
- 「程式或數學內容的後設理解準確度」：#1 只收純文字說明文，而且作者自述多數是實驗室研究、材料不是受試者自己的課業。
- 「隔天、隔週才出現的檢查題比當下的題目更能校準」：實驗裡的「延後」是讀完全部文本之後的幾分鐘。更長的延後沒有找到來源。
- 「沒有介入時相關約 .24」這個常被引用的數字：出自 Prinz 等 2020 的另一份統合分析，沒有全文。文章用 #1 的 0.178 與 #2 的 .14。

### 我認為該列但沒有全文的來源

| 來源 | 為什麼該列 | 試過的管道 |
|---|---|---|
| Zengilowski 等 2025（上表 #11） | 清單裡唯一的大型無效果實驗，而且情境是線上學習平台，離本站最近 | 見上表 |
| Prinz, Golke, Wittwer (2020). How accurately can learners discriminate their comprehension of texts? A comprehensive meta-analysis on relative metacomprehension accuracy. *Educational Research Review* 31 | 基準準確度的另一份統合分析，與 #1 的數字不同（+.24 對 0.178） | ScienceDirect 對 jina 回 robot 頁；Unpaywall 與 Semantic Scholar 查無 OA |
| Dunlosky & Lipko (2007). Metacomprehension: A brief history and how to improve its accuracy. *Current Directions in Psychological Science* 16 | 這個領域最常被引的短篇回顧；Unpaywall 標示出版社頁面可免費下載 | 本輪只查到 OA 位置（Sage 的 PDF 連結），沒有下載。Sage 先前對 curl 回 challenge，要換工具試 |
| Prinz 等 2018、2019（見 order 13） | 誤解與高估自己的關係 | 見 order 13 |

---

## 三篇合計

| 篇 | 清單來源數 | 沒有全文 | 檔案不完整 | 反向或無效果的來源 |
|---|---|---|---|---|
| order 12 | 10 | 0 | 1（Scheiter & Gerjets 2007） | Simonsmeier 2022（增益）、Pre-training 2025 |
| order 13 | 10 | 0 | 1（progmiscon 只有索引頁） | Dersch 等 2026、Ecker 等 2023 |
| order 15 | 11 | 1（Zengilowski 等 2025） | 0 | St. Hilaire 等 2024（未被問到的內容）、Prinz 等 2020（自我解釋）、Zengilowski 等 2025 |

三篇共用的來源：Brod 2021（12、13）、Prinz 等 2021（13、15）。去重後是 29 個不同的來源，照「一個 agent 最多 3 到 5 篇」算，精讀大約要 6 到 10 個 agent。

長度超過 12 萬位元組、一個 agent 大概只裝得下兩三篇的：Simonsmeier 2022、Pre-training 2025（XML）、Danielson 2024、Smith 等 1993、Yang 等 2023、Rozenblit & Keil 2002、Yan 等 2016、Macaluso 等 2022、St. Hilaire 等 2024、Pan & Carpenter 2023。

本輪為了確認能不能列入而新下載、完全沒讀的兩份：`Q1/ecker2023_plos.pdf`、`Q1/swire2020_psyarxiv.pdf`。

書目欄位裡我沒有核對、精讀時要回原文首頁確認的：Danielson 2024 的完整作者群、Schroeder & Kucera 2022 的 DOI、Mullaney & Reich 2015 的 DOI、Pre-training 2025 的作者群、Yang 等 2023 的完整作者群、Deslauriers 等 2019 的作者群。

---

## order 14　用途、興趣與有趣的細節（2026-10-14 追加）

聚焦問題：講用途、給選擇、放有趣的故事，各自對誰有效。

這一篇第一輪標「關鍵來源缺全文」。第三輪用公開管道補到四份（統合分析的博士論文版、自願對強制情境的實驗、Hulleman 2009 的作者上傳版、Lazowski 的博士論文），所以現在排得出清單。下表「之前讀到哪裡」寫「完全沒讀」的，是只下載、確認了題名與作者的檔案。

| # | 來源 | DOI／網址 | 要撐哪一條結論 | 檔案與總長度 | 之前讀到哪裡 |
|---|---|---|---|---|---|
| 1 | Asher & Harackiewicz (2025). Using choice and utility value to promote interest: Stimulating situational interest in a lesson and fostering the development of interest in statistics. *Journal of Educational Psychology* | [PMC12490784](https://pmc.ncbi.nlm.nih.gov/articles/PMC12490784/) | 直接告知用途：提高知覺用途（d = 0.41）與事後索取資料的比例，對當場成績沒有效果；給選擇：提高自主感與當下投入，不影響事後行為；信心與興趣都沒有調節。**反向／無效**（對「直接講用途會傷到沒信心的人」與「講用途能提高成績」而言） | `Q1/patall2025_PMC12490784.html`、`.txt`，101,485（檔名的 patall 是下載時取錯的代稱） | 摘要、受試者、統合七個實驗的 Table 5、成績與索取資料兩段、限制。七個實驗各自的方法與結果沒讀 |
| 2 | Canning & Harackiewicz (2015). Teach it, don't preach it: The differential effects of directly-communicated and self-generated utility-value information. *Motivation Science* 1(1) | [10.1037/mot0000015](https://doi.org/10.1037/mot0000015)；[PMC4610746](https://pmc.ncbi.nlm.nih.gov/articles/PMC4610746/) | 早期結果：直接告知用途降低沒信心者的表現與興趣；自己寫用途有幫助；日常例子比職涯例子好。與 #1 衝突的那一方 | `Q1/canning2015_PMC4610746.xml`、`.txt`，93,229（PMC 作者稿） | 摘要、總討論、限制。三個研究的方法與結果統計沒讀 |
| 3 | Canning, Priniski, Harackiewicz (2019). Unintended consequences of framing a utility-value intervention in two-year colleges. *Learning and Instruction* 62, 37–48 | [ERIC ED622933](https://files.eric.ed.gov/fulltext/ED622933.pdf) | 用途寫作在兩年制學院讓課業吃力的學生更沒興趣、成績更低。**反向／無效** | `Q1/utilityvalue_twoyear_ED622933.pdf`、`.txt`，119,428 | 摘要、引言相關段、受試者。結果與限制沒讀 |
| 4 | Harackiewicz, Canning, Tibbetts, Priniski, Hyde (2016). Closing achievement gaps with a utility-value intervention: Disentangling race and social class. *JPSP* 111 | [PMC4853302](https://pmc.ncbi.nlm.nih.gov/articles/PMC4853302/) | 學期課裡讓學生自己寫用途，縮小第一代且弱勢族裔學生的成績落差；關鍵子群只有 64 人 | `Q1/harackiewicz2016_PMC4853302.html`、`.txt`，127,294 | 摘要、受試者與課程結構、主要結果一段、限制。中介分析與補充分析沒讀 |
| 5 | Hulleman & Harackiewicz (2009). Promoting interest and performance in high school science classes. *Science* 326, 1410–1412 | [10.1126/science.1177067](https://doi.org/10.1126/science.1177067) | 用途寫作的原始實地實驗：提高低預期學生的興趣與成績 | `Q1/hulleman2009_kf_rg.md`，24,048（ResearchGate 作者上傳版，含正文與補充資料，經 Keenable 抓成文字，沒有圖表）；官方補充資料 `Q1/hulleman2009_supplement.pdf`、`.txt`，25,319 | 完全沒讀（先前只讀過 PubMed 摘要） |
| 6 | Hecht, Grande, Harackiewicz (2022). The role of utility value in promoting interest development. *Motivation Science* | [PMC9090178](https://pmc.ncbi.nlm.nih.gov/articles/PMC9090178/) | 用途資訊對一開始就有興趣的人才觸發興趣；信心的調節可能只在技能任務出現（解釋 #1 與 #2 為什麼不一致的線索） | `Q1/hecht2022.html`、`.txt`，115,426（Wayback 存的 PMC 頁） | 摘要、對 Durik 2007／2015 與 Canning 2015 的回顧段。兩個研究的方法與結果沒讀。作者群是我依記憶填的，精讀時核對 |
| 7 | A utility value intervention to support student engagement in online upper-level undergraduate courses (2025). *Frontiers in Education* | [10.3389/feduc.2025.1636446](https://doi.org/10.3389/feduc.2025.1636446) | 線上課裡用途寫作提高參與，但成績沒有差別。**反向／無效**；也是清單裡最接近線上自學情境的一篇 | `Q1/frontiers_uv_online2025.html`、`.txt`，68,122 | 摘要、受試者、結果摘述、限制。統計表沒讀；作者群沒核對 |
| 8 | Sundararajan (2018). Seductive details: A meta-regression and empirical study. 博士論文，Washington State University | [WSU 典藏](https://rex.libraries.wsu.edu/esploro/outputs/doctoral/SEDUCTIVE-DETAILS-A-META-REGRESSION-AND-EMPIRICAL/99900581709501842) | 有趣但無關的細節平均妨礙學習；哪些設計特徵有調節。這是 Sundararajan & Adesope 2020（*EPR* 32）的論文版，**期刊版沒有全文，引用時要寫明引的是論文版，數字可能與期刊版不同** | `Q1/sundararajan2018_dissertation.pdf`、`.txt`，176,796 | 完全沒讀 |
| 9 | Wesenberg, Jansen, Krieglstein, Schneider 等 (2024／2025). The influence of seductive details in learning environments with low and high extrinsic motivation. *Learning and Instruction* | [10.1016/j.learninstruc.2024.102054](https://doi.org/10.1016/j.learninstruc.2024.102054)；[ZORA 典藏](https://www.zora.uzh.ch/handle/20.500.14742/227121) | 無關細節只在「被規定要學」時傷成績，「自願學」時沒有影響甚至有幫助。**反向／無效**（對 #8 而言）；與自學讀者最相關 | `Q1/wesenberg2024_li_zora.pdf`、`.txt`，98,972 | 完全沒讀（先前只讀過摘要）。完整作者群與年份精讀時核對 |
| 10 | Wesenberg, Jansen, Krieglstein, Meusel, Schneider (2026). The more, the worse? The influence of the seductive detail amount on learning. *Instructional Science* | [10.1007/s11251-026-09781-8](https://doi.org/10.1007/s11251-026-09781-8) | 無關內容放越多，回憶越差；先備知識與工作記憶沒有調節 | `Q1/wesenberg2026.md`、`.txt`，81,629 | 先備知識一節、樣本、討論。兩個研究的方法與結果表沒讀 |
| 11 | Clinton & van den Broek (2012). Interest, inferences, and learning from texts. *Learning and Individual Differences* 22 | [ERIC ED534936](https://files.eric.ed.gov/fulltext/ED534936.pdf) | 對主題有興趣的讀者記得多、答得對，而且只在較連貫的文章上產生較多推論 | `Q1/clinton2012_ED534936.pdf`、`.txt`，148,832 | 摘要、受試者、總討論。結果統計沒讀 |
| 12 | Hidi & Renninger (2006). The four-phase model of interest development. *Educational Psychologist* 41(2) | [10.1207/s15326985ep4102_4](https://doi.org/10.1207/s15326985ep4102_4) | 區分「被觸發的情境興趣」與「個人興趣」；#1、#6 都用這個架構。理論文章 | `Q1/hidi_renninger2006.pdf`、`.txt`，131,215 | 摘要、教育意涵一節開頭 |

合計 12 個；都有全文檔。其中 #5 是從網頁抓成的文字、沒有圖表；#8 是博士論文版，不是期刊版。反向或無效果的有四個（#1、#3、#7、#9）。

與其他篇的重疊：Kizilcec 等 2020（PNAS，價值寫作放大到 25 萬人後的結果）屬於 order 19 的清單，order 14 只引用、不重複精讀。#10 的先備知識結果 order 12 也會用到。

備選，手上有檔但沒排進 12 個的：Priniski 等 2019（用途寫作裡「對自己有用」加「對別人有用」，`Q1/priniski2019_PMC6879189.txt`，120,349，完全沒讀）；Wang 等 2024（SDT 介入統合分析，`Q1/wang2024sdt.txt`，156,824，讀過摘要與限制，介入多數由教師執行）；Lazowski 2015 博士論文（動機介入統合分析的論文版，`Q1/lazowski2015_dissertation.txt`，297,817，完全沒讀）；Hulleman 等 2010（`Q1/hulleman2010_kf_rg.md`，50,311，作者上傳版但截斷在 50,000 字元，不完整）。

### 目前找不到可精讀的來源、所以不能寫的結論

- 「直接告知用途的反效果，其實是由信心而不是興趣調節」：這個說法出自 Durik 等 2015，沒有全文。更早的 Durik & Harackiewicz 2007 也只有摘要。文章要談這條線的來龍去脈，只能從 #2 與 #6 對它們的轉述寫，而且要明說是轉述。
- 「給讀者選擇」作為教材層次的做法：直接證據只有 #1 一篇（選擇的內容是學統計時挑例子）。選擇對動機的統合分析我沒有任何一份全文。這條線撐不起一節，建議在文章裡只佔一兩段。
- 「有趣的細節讓人願意讀下去」：所有 seductive details 的實驗都不讓受試者離開，量不到持續閱讀。沒有來源。
- 「把無關的趣聞放在框裡或文末就不傷」：#10 的回顧段提到有研究這樣主張，原始研究我沒有。
- 最新的統合分析（Cheng 等，*Educational Psychology Review*，doi 10.1007/s10648-025-10099-z，研討會摘要寫整體 g = −0.16，比先前兩份小）拿不到全文，這個數字不能寫。

### 我認為該列但沒有全文的來源

| 來源 | 為什麼該列 | 試過的管道 |
|---|---|---|
| Sundararajan & Adesope (2020). Keep it coherent. *Educational Psychology Review* 32, 707–734（期刊版） | #8 的正式刊出版；文獻裡被引用的是這一版 | Springer 付費；jina 只回參考文獻；Exa 只回摘要；Unpaywall、OpenAlex、Semantic Scholar 標 closed；Internet Archive Scholar、OSF 無。搜尋服務對付費頁的抓取檔依裁決已刪除，沒讀過 |
| Cheng, Wu, Wang, Wang（2025 線上／2026 刊出）. Seductive details, cognitive load, and learning outcomes: A multi-level meta-analysis and MASEM. *Educational Psychology Review* | 最新、方法較嚴的統合分析，效果量比前兩份小 | Unpaywall、OpenAlex、Semantic Scholar 標 closed；OSF、Internet Archive Scholar、CORE 無；Springer 頁經 jina 只回參考文獻；找不到作者上傳版。只存了 ECER 研討會摘要頁與華東師大新聞稿（`Q1/sd_masem2025_*.html`，沒讀） |
| Durik & Harackiewicz (2007). Different strokes for different folks. *J Educ Psychol* 99(3) | 「講用途對低興趣者有反效果」的原始研究 | 三輪都只有摘要：Unpaywall、OpenAlex、Semantic Scholar 標 closed；CORE、OSF 的同名結果是別的文章；Internet Archive Scholar 無；作者個人頁只有履歷；Exa 抓 DOI 只回摘要 |
| Durik, Shechter, Noh, Rozek, Harackiewicz (2015). What if I can't? *Motivation and Emotion* 39 | 把調節變項從興趣改成信心的那篇 | 同上；Springer 頁只回摘要與參考文獻；academia.edu 頁只有書目 |
| Hulleman, Godes, Hendricks, Harackiewicz (2010). Enhancing interest and performance with a utility value intervention. *J Educ Psychol* 102 | 用途寫作的實驗室加課堂研究，#4 的前身 | 只有截斷在 50,000 字元的作者上傳版；沒試別的管道取完整版 |
| Brock 等 (2025). The effect of seductive details on knowledge retention in physics videos. *Journal of Research in Science Teaching* | 影片情境的 seductive details，Unpaywall 標為 OA | 倫敦國王學院典藏的 PDF 連結回 403；沒試 Wiley 頁與 jina |
| Rey (2012). A review of research and a meta-analysis of the seductive detail effect. *Educational Research Review* 7 | 更早的一份統合分析，#8 之前的基準 | 沒試過任何管道，只在別的論文的引用裡看到 |

### 四篇合計（更新）

| 篇 | 清單來源數 | 沒有全文 | 檔案不完整或非正式版 | 反向或無效果的來源 |
|---|---|---|---|---|
| order 12 | 10 | 0 | 1 | 2 |
| order 13 | 10 | 0 | 1 | 2 |
| order 14 | 12 | 0 | 2（#5 無圖表、#8 是論文版） | 4 |
| order 15 | 11 | 1 | 0 | 3 |

四篇去重後 41 個不同來源。order 14 的 12 個裡有 3 個完全沒讀過（#5、#8、#9），其餘 9 個先前都只用關鍵字讀過片段。
