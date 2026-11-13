# 來源版本查核結果（2026-10-14）

範圍：15 份抽查結果（`group-01.md`–`group-15.md`）「來源版本」欄裡被標疑慮、或寫明抽取紀錄沒記取得網址的紀錄，共 38 份。沒有改 `src/`，沒有 commit，沒有刪任何抽取紀錄或原文檔。

## 做法

- 原來源：查抽取紀錄檔頭、`.research/2026-10-13-learning-content-q*.md` 與 reading-list 清單裡記的網址，再把那個網址重新下載，用 `cmp` 與手上的原文檔比位元組。位元組相同就確定手上的檔出自那裡。
- 合法版本：Unpaywall（email 參數 `unpaywall@example.org`）、OpenAlex、出版者頁、機構典藏、作者個人頁、Wayback。出版者頁擋 curl 的（ACM、SAGE、Taylor & Francis、Springer、Wiley、Science、APA、IOP），改用本機 Chromium 開頁面看存取標示，再從頁面內下載 PDF。
- ACM：15 篇的文章頁都標 FREE ACCESS 或 OPEN ACCESS，PDF 不登入就下載得到，頁面橫幅寫「ACM is now Open Access」。Unpaywall 與 OpenAlex 對其中多數仍標 closed，資料沒有跟上。
- 內容比對，由強到弱：(a) 位元組相同；(b) `pdftotext` 轉出的詞逐詞相同；(c) 版本不同時，比五詞片段的重合比例、全文帶小數點或百分號的數字，以及抽取紀錄引的英文原句有幾段在新版本逐字找得到，再用 `grep` 抽對幾個數字。(c) 的原句比對會因斷行與寫法不同漏算，只能當下限。
- 新下載的合法版本存回各來源的 raw 目錄，檔名帶來源（`-acm-dl`、`-sage-oa`、`-surrey-author-manuscript` 等）。位元組相同的沒有另存。

## 總表

「相同」欄：**位元組**＝重新下載的檔與手上的檔 `cmp` 無差異；**逐詞**＝位元組不同但轉出的文字逐詞相同；**版本不同**＝合法版本不是手上讀的那一版。

### 一、手上的檔就是合法版本，或合法版本內容相同（25 份）

| 紀錄檔名 | 原來源 | 合法版本網址 | 內容是否相同 | 處置 |
|---|---|---|---|---|
| `stefik2013-syntax.md` | vidarholen.net（第三方） | https://dl.acm.org/doi/10.1145/2534973 | 位元組相同（1,240,677） | 檔頭補合法來源；連結改寫 ACM DOI |
| `muldner2022-worked-examples.md` | Wayback 存的 ACM PDF | https://dl.acm.org/doi/10.1145/3560266 | 逐詞相同（20,865 詞） | 檔頭補合法來源；ACM 版另存 `q2-interactive/muldner2022-acm-dl.pdf` |
| `hsu2022-srl-scaffolds-multiwave.md` | Wayback 2022-06-14 存的 ACM PDF | https://dl.acm.org/doi/10.1145/3491140.3528312 | 位元組相同（1,174,988） | 檔頭補合法來源；原「請主編判斷」的疑慮解除 |
| `koedinger2016-doer-causal.md` | Wayback 2024-04-11 存的 ACM PDF | https://dl.acm.org/doi/10.1145/2883851.2883957 | 逐詞相同（6,708 詞） | 檔頭補合法來源；另存 `q3-activity/koedinger2016-acm-dl.pdf` |
| `xie2018-tracing.md` | 沒記；實為 faculty.washington.edu/ajko | https://dl.acm.org/doi/10.1145/3159450.3159527 ；https://faculty.washington.edu/ajko/papers/Xie2018TracingStrategies.pdf | 兩處都位元組相同（1,694,482）。ACM 現行提供的就是印「Most up-to-date version: 06/01/2021」的這一版 | 檔頭補合法來源 |
| `ericson2015-wipsce-ebook-usage.md` | 沒記；研究筆記寫經 Wayback | https://dl.acm.org/doi/10.1145/2818314.2818335 | 逐詞相同（8,688 詞） | 檔頭補合法來源；另存 `q3-activity/ericson2015wipsce-acm-dl.pdf` |
| `guo2018-nonnative.md` | 沒記；實為作者個人頁 pg.ucsd.edu | https://pg.ucsd.edu/publications/non-native-english-speakers-learning-programming_CHI-2018.pdf ；刊出版 https://dl.acm.org/doi/10.1145/3173574.3173970 | 作者頁位元組相同（211,403）。對 ACM 刊出版：11,866 詞對上 11,838，差在頁眉與參考文獻抽字順序 | 檔頭補合法來源，並註明「版本」應讀作作者自存的定稿；ACM 版另存 |
| `dasgupta2017-localized.md` | 沒記；實為作者網站 mako.cc | https://dl.acm.org/doi/10.1145/3051457.3051464 ；https://mako.cc/academic/dasgupta_hill-learning_code_localization-L@S2017.pdf | 兩處都位元組相同（892,591） | 檔頭補合法來源 |
| `kim2017-explaining-gap.md` | 沒記；實為共同作者實驗室 mucollective.northwestern.edu | https://mucollective.northwestern.edu/files/2017-ExplainingTheGap-CHI.pdf ；刊出版 https://dl.acm.org/doi/10.1145/3025453.3025592 | 實驗室頁位元組相同（3,816,934）。對 ACM 刊出版：9,559 詞對上 9,430，差在頁眉頁碼與參考文獻抽字順序 | 檔頭補合法來源；ACM 版另存 |
| `vancampenhout2023-doer-at-scale.md` | 沒記；研究筆記寫 Wayback 原檔 | https://dl.acm.org/doi/10.1145/3576050.3576103 | 逐詞相同（8,450 詞） | 檔頭補合法來源；另存 `q3-activity/vancampenhout2023-acm-dl.pdf` |
| `vanderzee2018-summaries-mooc.md` | 沒記；研究筆記寫 Wayback 原檔 | https://dl.acm.org/doi/10.1145/3170358.3170382 | 逐詞相同（8,954 詞） | 檔頭補合法來源；另存 `q3-activity/vanderzee2018-acm-dl.pdf` |
| `lopez2008-reading-tracing-writing.md` | 沒記；實為 UTS 機構典藏（作者稿） | https://opus.lib.uts.edu.au/bitstream/10453/10806/1/2008001530.pdf ；刊出版 https://dl.acm.org/doi/10.1145/1404520.1404531 | 典藏庫位元組相同（264,240）。對 ACM 刊出版：256 個小數與百分比全部相同，五詞片段 92.9% 重合 | 檔頭補合法來源；ACM 版另存 |
| `nelson2017-pltutor.md` | 沒記；實為 faculty.washington.edu/ajko | https://dl.acm.org/doi/10.1145/3105726.3106178 ；https://faculty.washington.edu/ajko/papers/Nelson2017PLTutor.pdf | 兩處都位元組相同（2,752,330） | 檔頭補合法來源 |
| `chi2014-icap.md` | 沒記；實為 ASU 教育學院網站 | https://education.asu.edu/sites/g/files/litvpz656/files/lcl/chiwylie2014icap_2.pdf | 位元組相同（535,696） | 檔頭補合法來源。出版者頁付費，公開的是作者單位放的出版社排版檔 |
| `latimier2021-spaced-retrieval.md` | 通訊作者實驗室頁 lscp.net | http://www.lscp.net/persons/ramus/docs/EPR20.pdf | 位元組相同（1,088,888） | 檔頭補合法來源，註明讀的是出版者版面；PsyArXiv、HAL 的預印本沒有比對 |
| `hofmeister2017-identifier-names.md` | 紀錄寫「沒查到」；實為薩爾蘭大學軟體工程講座著作頁 | https://www.se.cs.uni-saarland.de/publications/docs/HoSeHo17.pdf | 位元組相同（334,125） | 檔頭補合法來源。研究群著作頁，不是作者現任單位個人頁；IEEE 刊出版沒取得 |
| `castro-alonso2019.md` | 沒記；實為 Erasmus 機構典藏 | https://repub.eur.nl/pub/114594/Repub-114594.pdf | 位元組相同（880,880） | 檔頭補合法來源 |
| `prihar2022-trends.md` | 沒記；實為 EDM 論文集 | https://educationaldatamining.org/edm2022/proceedings/2022.EDM-long-papers.3/2022.EDM-long-papers.3.pdf | 位元組相同（1,357,905） | 檔頭補合法來源 |
| `sinha2021-productive-failure.md` | 沒記；**實為第三方網站 janfasen.nl**（抽查沒發現） | https://journals.sagepub.com/doi/10.3102/00346543211019105 （SAGE，Open access，CC BY 4.0） | 逐詞相同（16,360 詞） | 檔頭補合法來源；出版者 PDF 另存 `q3-activity/sinha_kapur2021-sage-oa.pdf`；連結不寫 janfasen.nl |
| `kirschner2006-minimal-guidance.md` | 沒記；實為 itgs.ict.usc.edu（頁面主人不明） | https://www.tandfonline.com/doi/abs/10.1207/s15326985ep4102_1 （T&F 標 Free access） | 同一版。五詞片段 95.8% 重合，紀錄引的 55 段原句全部找得到；差在封面頁與參考文獻抽字順序 | 檔頭補合法來源；出版者 PDF 另存 `q3-activity/kirschner2006-tandf-free-access.pdf` |
| `lombardi2021-curious-construct.md` | 沒記；研究筆記只寫「作者所屬單位網站」 | https://par.nsf.gov/servlets/purl/10282580 （NSF PAR）；APS 公開閱讀連結見檔頭 | NSF PAR 位元組相同（445,466）；經 APS 公開連結下載的出版者 PDF 逐詞相同（27,077 詞） | 檔頭補合法來源；出版者 PDF 另存 |
| `rivers2021-metacognition-practice-testing.md` | 沒記；研究筆記寫作者網站連到她的 Google Drive | https://www.michellelrivers.com/research/publications （該篇 PDF 連結） | 位元組相同（1,349,053） | 檔頭補合法來源。作者本人散布的出版者排版檔，出版者頁付費；依「作者個人頁」列為可用，**這一條請主線確認** |
| `kollmer2015-physicists.md` | 沒記；研究筆記寫經 Wayback 取得作者機構副本 | https://iopscience.iop.org/article/10.1088/1367-2630/17/1/013036 （IOP，OPEN ACCESS，CC BY 3.0） | 出版者 PDF 被機器人驗證擋下，沒拿到；改比出版者頁的全文文字，五詞片段 86% 重合，小數只有公式裡一個沒對上 | 檔頭補合法來源；頁面文字另存 `q2-interactive/kollmer2015-iop-oa-page-2026-10-14.txt` |
| `lai2023-ndhu-invideo-quiz.md` | 東華大學教學卓越中心網站 | https://ndhucte.ndhu.edu.tw/var/file/8/1008/img/4480/871814950.pdf | 位元組相同（991,297） | 檔頭補合法來源。報告自寫申請延後公開，延後期是否已過看不出來；無同儕審查 |
| `mullaney2015-staggered-release.md`（舊檔） | 舊檔是抓 dl.acm.org 文章頁的正文 | https://dl.acm.org/doi/10.1145/2724660.2724663 | 舊檔五詞片段 96.2% 在 ACM PDF 裡；舊檔缺表與圖 | 檔頭補一行；ACM PDF 另存 `q4-time/mullaney-reich2015-acm-dl.pdf`。數字依據仍是 HarvardX 工作論文，不變 |

### 二、有合法版本，但不是手上讀的那一版（4 份）

這四份都在檔頭加了 ⚠ 與合法來源兩行。合法版本已存回 raw，**但沒有逐項重對**，引用前要有人拿合法版本把會用到的數字與原句再對一次。

| 紀錄檔名 | 原來源 | 合法版本網址 | 內容是否相同 | 處置 |
|---|---|---|---|---|
| `alfieri2011.md` | lexiconic.net（第三方，APA 刊出版；重抓位元組相同） | https://openresearch.surrey.ac.uk/esploro/outputs/journalArticle/Does-Discovery-Based-Instruction-Enhance-Learning/99515521902346 （作者 Tenenbaum 現職機構典藏，82 頁作者稿）；補充表在 supp.apa.org | 版本不同。數字寫法不同（`d = -.38` 對 `d = –0.38`），作者稿沒有 fail-safe N 的段落，表格編號不同。抽對六組數字相同（108／580、56／360、−.38、kappa .87、反應時間 −.21、青少年 −.53 對成人 −.26）；28 段原句有 13 段逐字找得到 | ⚠＋合法來源。只在刊出版排版檔出現的內容不得引用；補充表不受影響。作者稿另存 `q3-activity/alfieri2011-surrey-author-manuscript.pdf`／`.txt` |
| `ericson2023-parsons-mimn.md` | 取得網址查不到的作者稿（110 頁） | https://dl.acm.org/doi/10.1145/3623762.3633498 （刊出版，gold OA，51 頁） | 版本不同。作者稿的附錄 A 刊出版沒有；文獻編號後移；統計寫法與部分句子改過；作者稿有未填的佔位句「a total of x participants」。作者稿 470 個數字在刊出版都找得到；47 段原句只有 23 段逐字找得到 | ⚠＋合法來源。紀錄的行號是作者稿的，不適用刊出版。**建議整份依 ACM 版重對**，ACM 版另存 `q2-interactive/ericson2023-parsons-wg-acm-dl.pdf`／`.txt` |
| `smith1993-misconceptions-reconceived.md` | 帶 2012 年戳記的 JSTOR 掃描檔（第三方轉存） | http://web.archive.org/web/20061105003329/http://ctl.sri.com/publications/downloads/MisconceptionsReconceived.pdf （共同作者 Roschelle 任職的 SRI CTL 著作頁，作者第四稿，101 頁） | 版本不同，差別大。五詞片段 78% 重合；61 段原句有 37 段逐字找得到、24 段沒有。抽對兩處數字相同（7.6 種策略、11 人裡 6 人與 7 人） | ⚠＋合法來源。刊出版的原句與頁碼不得直接引用；只有作者稿裡找得到的可引，註明出自作者稿。作者稿另存 `q1-learner/smith1993-sri-ctl-author-draft.pdf`／`.txt` |
| `patterson2018-behavioral-tools-mooc.md` | gwern.net 轉存（第三方） | https://hdl.handle.net/1813/74637 （Cornell eCommons，CHERI 工作論文 WP165，2015，68 頁） | 版本不同，差別大。五詞片段 50% 重合；多重檢定校正的段落工作論文沒有。相同的有 657 人、24%／0.29 SD／40%、作業 0.91（27%）、81%；37 段原句有 16 段逐字找得到 | ⚠＋合法來源。刊出版的數字不得直接引用；只有工作論文裡找得到的可引，註明出自工作論文。另存 `q4-time/patterson2015-cornell-cheri-wp165.pdf`／`.txt` |

### 三、找不到合法版本，標成不得引用（9 份）

| 紀錄檔名 | 原來源 | 合法版本 | 內容是否相同 | 處置 |
|---|---|---|---|---|
| `kerfoot2007.md` | Wright State University 網站轉貼（第三方） | 無。Wiley 頁只有摘要、PDF 回 403；Unpaywall、OpenAlex 標 closed | — | 檔頭加 ⚠ 不得引用 |
| `loibl2017-ps-i-theory.md` | wright.edu 活動頁上傳檔（第三方；重抓位元組相同） | 無。Springer 頁標「preview of subscription content」；ERIC 無全文 | — | 檔頭加 ⚠ 不得引用 |
| `hidi2006-four-phase-interest.md` | 來源不明的出版者排版 PDF | 無。T&F 頁沒有免費全文；Swarthmore 典藏只有書目 | — | 檔頭加 ⚠ 不得引用 |
| `kizilcec2017-science-global-gaps.md` | `uploads-ssl.webflow.com` CDN，掛在哪個網站查不到 | 無。science.org 付費；作者個人網站掛的 Science 作者推薦連結現在也導到付費頁 | — | 檔頭加 ⚠ 不得引用；註明可改從 2020 年 PNAS 那篇的 Table 1 引 n = 64、24 pp |
| `hulleman2009-relevance-science.md` | 正文：作者上傳 ResearchGate 的稿子，經 Keenable 轉抓、截斷；補充資料：Science 官方 SOM | 正文無可取得的版本。science.org 寫「Register for free to read this article」，沒有註冊、沒有取得；motivatelab.org 的連結 404 | 正文沒核對 | 檔頭加 ⚠：正文字句不得引用、正文檔不得列入參考資料；**只有官方 SOM 的數字與 ERIC 博士論文 ED498264 可引** |
| `chen2019-pjbl-meta.md` | Exa 抓的 ScienceDirect 預覽頁 | 無 | — | 原已自標；檔頭最上面補統一格式的 ⚠ |
| `fang2019-aleks-meta.md` | 搜尋服務抓的 T&F 付費頁正文 | 無 | — | 原已自標；檔頭最上面補統一格式的 ⚠ |
| `scheiter2007-learner-control.md` | Keenable 抓的 Springer 付費頁正文（紀錄沒有用它抽） | 無 | — | 原本只寫「未完成」，沒有不得引用的字樣；已補 ⚠ |
| `ashman2020-element-interactivity.md` | 期刊論文：Exa 抓的出版者頁（無正文）；數字出自 UNSWorks 博士論文 | 期刊論文無；博士論文合法（UNSWorks，CC BY 4.0） | — | 原本只寫「期刊論文未完成」；已補 ⚠：期刊論文不得引用，要引就引博士論文 |

## 抽查沒抓到、這次順帶發現的

- **`sinha2021`**：抽查寫「下載網址沒有記錄」，研究筆記 q3-activity L143 記的其實是 `janfasen.nl`，第三方個人網站。文章本身是 CC BY，已換成 SAGE 出版者 PDF，逐詞相同。
- **`ericson2023`**：抽查只說「與刊出版是否逐字相同沒有比對」。比對後確定手上那份是出版前的稿子，留有未填的佔位句。
- **`xie2018`、`nelson2017`**：抽查懷疑作者 2021 年更新的自存稿與 ACM 刊出版不同。ACM 現行提供的檔與作者頁的檔位元組相同。
- **ACM 15 篇**：全部拿得到出版者版本，Wayback 轉存的疑慮（`koedinger2016`、`muldner2022`、`hsu2022`、`vancampenhout2023`、`vanderzee2018`、`ericson2015`）一併解除。

## 要主線拍板或補做的事

1. 第二類四份（`alfieri2011`、`ericson2023`、`smith1993`、`patterson2018`）要有人拿合法版本逐項重對，否則只能引檔頭列出的已對數字。`ericson2023` 的合法版本就是刊出版，最值得重做。
2. `hulleman2009`：science.org 提供免費註冊閱讀。有人用自己的帳號取得刊出版後，正文就能核對，⚠ 可以改寫。
3. `rivers2021`、`chi2014`、`latimier2021`：都是作者或作者單位自己放的出版者排版檔，出版者頁是付費。這次依「作者個人頁／作者實驗室頁」列為可用；如果規則要收緊成「只收作者稿」，這三份要改標。抽查提到的 `janelli2021`、`kizilcec2017-srl-mooc`、`lindsey2014` 是同一種情況，抽查判無疑慮，這次沒有動。
4. `hofmeister2017`：來源是研究群著作頁上的作者稿，不是作者現任單位；IEEE 刊出版沒取得。
5. `lai2023`：延後公開的聲明與公開掛網並存，引用前可向主線確認要不要用。
6. 不合規的原文檔（`smith1993.pdf`、`alfieri2011.pdf`、`loibl2017.pdf`、`hidi_renninger2006.pdf`、`kizilcec2017-science.pdf`、`sinha_kapur2021.pdf`、`kirschner2006.pdf`、`kerfoot2007-spaced-education.txt`、`patterson2018-behavioral-tools-mooc.txt`、`hulleman2009_kf_rg.md`、`fang2019-aleks-meta.md`、`scheiter-gerjets2007-learner-control.md`）仍留在 raw 目錄，沒有刪。
7. 抽取紀錄檔頭沒有網址的還有約 40 份（PMC、arXiv、ERIC 這類以編號標示來源的），抽查沒有標疑慮，這次沒有處理。

## 任務二：四處小更正

每處都回原文確認過，更正記在各紀錄檔尾「2026-10-14 抽查後更正」一節。

| 紀錄 | 原寫法 | 原文 | 結果 |
|---|---|---|---|
| `kizilcec2020-scaling-interventions.md` 第 9 項 | 學士學位 73.6%–77.7% | SI Appendix 第 17 頁 Table S2（看過頁面影像）：四波 73.6%、71.6%、77.5%、77.7% | 抽查者對。改為 71.6%–77.7%。同項其餘四個範圍重看無誤 |
| `martinengo2024-spaced-digital-education.md` 第 9 項與 L111 | 九個裡五個信賴區間跨過 0 | `fig3.jpg`：下界 0.48、0.02、−0.00、−0.02、−0.14、−0.05、0.43、−0.39、−0.30 | 抽查者對。改為六個下界不大於 0（五個明確為負，Grad 2021 印成 −0.00）。九組數字本身沒抄錯 |
| `bego2024-spaced-retrieval-nine-stem.md` L102 | 本研究 8 門課以選擇題為主 | 原文檔 L511「In most of the eight STEM classrooms, multiple-choice questions were the primary vehicle」 | 抽查者對。改為「8 門課裡多數」 |
| `davis2016-retrieval-planning.md` 讀取紀錄 | L413–532，漏列 L533–571 | L533–571 是 Fig. 4、Table 4（L553–565）、Fig. 5；結果第 11 項的五個 r 與 N 在 L557–561 | 那一段確實讀過。區間改為 L413–571 並註明 |

## 這次沒做到的

- 版本不同的四份沒有逐項重對（見上）。
- `kollmer2015` 的出版者 PDF 沒拿到，只比了出版者頁的全文文字。
- `kerfoot2007`、`patterson2018` 的 raw 目錄本來就沒有 PDF，這次沒有補抓不合規來源的 PDF。
- 作者個人頁的歸屬（網站是不是作者本人的）靠網域與頁面內容判斷，沒有另外查證：`mako.cc`、`pg.ucsd.edu`、`michellelrivers.com`、`faculty.washington.edu/ajko`、`mucollective.northwestern.edu`、`lscp.net/persons/ramus`。
- Firecrawl 額度用完，沒有用到。

---

# 第二批：teaching-text 抽取紀錄的來源版本查核（2026-10-14）

範圍：`.research/extractions/teaching-text/` 全部 28 份。原文檔在 `.work/teaching-text-research/src/`，取得網址記在 `.work/teaching-text-research/sources.md`；那份清單沒記的（King-Shepard 2025、Delgado 2018、Lorch 2013、Prinz-Weiß 2023、Danielson 2024），從已發佈文章的參考連結找回。做法同第一批：把記下的網址重新下載、`cmp` 比位元組；再查 Unpaywall（占位 email）、OpenAlex、出版者頁（擋 curl 的用本機瀏覽器開）、作者個人頁與機構典藏。沒有改文章、沒有 commit。新下載的合法版本存回 `.work/teaching-text-research/src/`（`delgado2018-roderic-uv.pdf`、`yang2021-rongjunyu.pdf`、`bisra2020-sfu-thesis-etd21092.pdf`／`.txt`）。

## 總表

| 紀錄檔名 | 原來源 | 合法版本網址或「無」 | 內容是否相同 | 處置 |
|---|---|---|---|---|
| `barbieri2023.md` | 共同作者 Miller-Cotto 個人網站 | https://www.danamillercotto.com/uploads/4/7/7/2/47725475/barbieri_et_al__2023__we_meta-analysis.pdf | 位元組相同 | 補合法來源（作者放的出版者版面，出版者頁付費） |
| `bisra2018.md` | gwern.net（第三方） | 期刊版：無。博士論文：https://summit.sfu.ca/item/34322 | 版本不同：論文統合分析章與期刊版五詞片段 61% 重合，67 段原句有 36 段逐字找得到 | **⚠**：期刊版不得直接引用，只能引博士論文裡找得到的數字 |
| `bullock2019.md` | 俄亥俄州立大學傳播學院網站（共同作者單位） | https://comm.osu.edu/sites/comm.osu.edu/files/PUS%202019-%20Bullock%20et%20al..pdf | 位元組相同 | 補合法來源 |
| `cmu_alignment.md` | CMU 官方頁 | https://www.cmu.edu/teaching/assessment/basics/alignment.html | 機構頁，沒有重抓 | 補合法來源 |
| `cromley_chen2025.md` | Exa 抓的 NSF PAR 接受稿 | 暫時無：NSF PAR 的檔仍回 404（2026-11-01 才公開）；Elsevier 頁全文是否公開無法確認 | — | **⚠（暫時）**：11/1 後重抓比對相同即可解除 |
| `crossley2023.md` | Europe PMC XML | https://pmc.ncbi.nlm.nih.gov/articles/PMC10027808/ | 來源本身合法 | 補合法來源 |
| `danielson2024.md` | NSF PAR | https://par.nsf.gov/servlets/purl/10629626 | 位元組相同 | 補合法來源 |
| `delgado2018.md` | **webhomes.maths.ed.ac.uk/~swood34（非作者的個人頁，第三方）** | https://roderic.uv.es/bitstreams/439ce19e-fc9f-4a61-90f9-1b0f218205e8/download （作者單位典藏）；出版者頁 hybrid OA | 逐詞相同（11,664 詞；兩檔只在檔尾不同） | 補合法來源；**文章連結要換** |
| `diataxis.md` | 作者官網 | https://diataxis.fr/ | — | 補合法來源 |
| `hamaker1986.md` | andymatuschak.org（第三方） | 無（SAGE Restricted access；ERIC 只有摘要） | — | **⚠ 不得引用** |
| `ies2007.md` | IES 官方 | https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/20072004.pdf | 位元組相同 | 補合法來源 |
| `kaminski2008.md` | 第一作者 Kaminski 的實驗室網站 mathcog.org | https://mathcog.org/Publications/TheAdvantageOfAbstractExamplesInLearningMath.pdf | 位元組相同 | 補合法來源（作者實驗室放的 Science 版面） |
| `king_shepard2025.md` | 原本沒記；實為共同作者 Carpenter 個人網站 | https://shacarp.wixsite.com/mysite/published-articles （PDF：filesusr.com/ugd/f4b9f1_014e1ee…） | 位元組相同 | 補合法來源 |
| `koedinger2015.md` | 作者實驗室 pact.cs.cmu.edu | https://dl.acm.org/doi/10.1145/2724660.2724681 （OPEN ACCESS）；pact 著作頁 | 兩處都位元組相同 | 補合法來源 |
| `lorch2013.md` | 原本沒記；出版者本站 | https://journals.copmadrid.org/psed/archivos/ed2013v19n2a2.pdf | 位元組相同 | 補合法來源 |
| `pan_carpenter2023.md` | Exa 抓的 Springer OA 頁 | https://link.springer.com/article/10.1007/s10648-023-09814-5 （CC BY） | 來源本身合法，沒有重抓 | 補合法來源 |
| `prinz_weiss2023.md` | 原本沒記；KIT 機構典藏 | https://publikationen.bibliothek.kit.edu/1000164494/151691045 | 位元組相同 | 補合法來源 |
| `rey2019.md` | 共同作者 Wirzberger 個人網站 | https://maria-wirzberger.de/wp-content/uploads/2019/01/Rey2019_Article_AMeta-analysisOfTheSegmentingE.pdf | 位元組相同 | 補合法來源（作者放的出版者版面，出版者頁付費） |
| `sana2020.md` | Europe PMC XML | https://pmc.ncbi.nlm.nih.gov/articles/PMC8711814/ | 來源本身合法 | 補合法來源 |
| `schroeder_kucera2022.md` | Europe PMC XML | https://pmc.ncbi.nlm.nih.gov/articles/PMC8784251/ | 來源本身合法 | 補合法來源 |
| `stanny2016.md` | MDPI | https://www.mdpi.com/2227-7102/6/4/37 | 位元組相同 | 補合法來源 |
| `tetzlaff2025.md` | peDOCS 典藏 | https://www.pedocs.de/volltexte/2026/34113/pdf/Learn_and_Instr_2025_Tetzlaff_u.a._A_cornerstone_of_adaptivity.pdf | 位元組相同 | 補合法來源 |
| `trninic2020.md` | 柏克萊 Embodied Design Research Lab 網站 | 同左（暫列） | 位元組相同 | 補合法來源，**網站與作者的關係沒查證，請主線確認**；出版者頁 closed |
| `ulucinar2021.md` | ERIC | https://files.eric.ed.gov/fulltext/EJ1329091.pdf | 位元組相同 | 補合法來源 |
| `vanderbeken2018.md` | 根特大學典藏（作者稿） | https://biblio.ugent.be/publication/8548542/file/8548563.pdf | 位元組相同 | 補合法來源 |
| `wisniewski2020.md` | Frontiers | https://www.frontiersin.org/articles/10.3389/fpsyg.2019.03087/full | 位元組相同 | 補合法來源 |
| `wittwer_renkl2010.md` | Exa 抓的轉存檔（arc.educationapps.vic.gov.au，原檔來自 ResearchGate） | 無（Springer 付費，Unpaywall closed） | — | **⚠ 不得引用** |
| `yang2021.md` | gwern.net（第三方） | https://www.rongjunyu.org/_files/ugd/7b277c_23e6331e6f8f4144b7586a97d08f7190.pdf （共同作者 Rongjun Yu 個人網站） | 逐詞相同（33,289 詞；作者網站那份多一頁 APA 引用封面） | 補合法來源；**文章連結要換** |

合計：24 份補上合法來源（其中 `delgado2018`、`yang2021` 的原檔是第三方轉存，但合法版本內容相同）；4 份加 ⚠（`bisra2018`、`hamaker1986`、`wittwer_renkl2010`、`cromley_chen2025`，最後一份是暫時的）。

## 已發佈文章：要換成合法網址的連結

行號是 2026-10-14 的檔案；中英文版行號相同。

| 來源 | 檔案 | 行 | 現在的連結 | 換成 |
|---|---|---|---|---|
| Delgado 2018 | `2026-10-13-teaching-text-questions-feedback.md`、`-en.md` | 135、287 | `https://webhomes.maths.ed.ac.uk/~swood34/screen-versus-print.pdf` | `https://doi.org/10.1016/j.edurev.2018.09.003`（出版者 OA），或典藏庫 `https://roderic.uv.es/bitstreams/439ce19e-fc9f-4a61-90f9-1b0f218205e8/download` |
| Yang 2021 | `2026-10-13-teaching-text-questions-feedback.md`、`-en.md` | 56、279 | `https://gwern.net/doc/psychology/spaced-repetition/2021-yang.pdf` | `https://doi.org/10.1037/bul0000309`，全文連結 `https://www.rongjunyu.org/_files/ugd/7b277c_23e6331e6f8f4144b7586a97d08f7190.pdf`（共同作者網站） |
| Bisra 2018 | `2026-10-13-teaching-text-evidence.md`、`-en.md` | 270 | 括號裡的「全文鏡像」`https://gwern.net/doc/psychology/spaced-repetition/2018-bisra.pdf` | 拿掉鏡像連結；正文連結的 DOI 保留。另見下節：這篇要改標 |
| Bisra 2018 | `2026-10-13-teaching-text-questions-feedback.md`、`-en.md` | 281 | 同上 | 同上 |
| Hamaker 1986 | `2026-10-13-teaching-text-evidence.md`、`-en.md` | 131、278 | `https://andymatuschak.org/files/papers/Hamaker%20-%201986%20-%20The%20Effects%20of%20Adjunct%20Questions%20on%20Prose%20Learning.pdf` | 沒有合法全文可換，只能換成 `https://doi.org/10.3102/00346543056002212`；另見下節 |
| Hamaker 1986 | `2026-10-13-teaching-text-questions-feedback.md`、`-en.md` | 28、44、278 | 同上 | 同上 |

其餘連結已是合法版本，不用換：Barbieri（danamillercotto.com）、Rey（maria-wirzberger.de）、Bullock（comm.osu.edu）、Kaminski（mathcog.org）、Koedinger 2015（pact.cs.cmu.edu）、Trninic（edrl.berkeley.edu，待確認）、King-Shepard（Carpenter 網站）、Danielson（NSF PAR）、Prinz-Weiß（KIT）、Lorch（出版者）、Tetzlaff（peDOCS）、Vander Beken（UGent）、ERIC、MDPI、Frontiers、PMC、IES、Wittwer & Renkl 與 Cromley & Chen（兩者連結都是 DOI）。

## 已發佈文章：引用不得引用來源的行號

依規則這些行只能保留「這篇研究存在」的層次，數字要拿掉或改依合法版本（Bisra 可改依博士論文重對）。行號中英相同。

| 來源 | `teaching-text-evidence` | `teaching-text-questions-feedback` | 其他 |
|---|---|---|---|
| Bisra 2018 | 74、190、214、222、234、270 | 62、64、183、254、281 | — |
| Hamaker 1986 | 131、210、248、278 | 28、44、54、165、185、248、278 | — |
| Wittwer & Renkl 2010 | 66、167、214、216、223、232、269 | 294（只列在書目清單） | — |
| Cromley & Chen 2025（暫時，2026-11-01 後可解除） | 196、211、217、262、286 | 115、123、125、171、187、233、262、286 | `instructional-video-in-articles` 166、186、227；`diagrams-in-teaching-articles` 235、386、437 |

`grep` 抓到的是含作者名的整行，有些行（例如 evidence 214、222、223，diagrams 386、437）只是在限制或讀取說明裡提到名字，不一定有數字；改稿時逐行看。

## 要主線拍板的

1. 這四份標了不得引用，兩篇文章（中英共四個檔）的核心論點有幾處倚重它們：Hamaker 的 16 個百分點、Bisra 的 g = 0.55、Wittwer & Renkl 的 d = 0.16、Cromley & Chen 的分段 g = 0.19。要決定是改寫、拿掉，還是等合法版本（Cromley 等 11/1；Bisra 可改依博士論文逐項重對）。
2. `trninic2020` 的 edrl.berkeley.edu 是否算作者端，沒查證。
3. 作者自己放的出版者版面（Barbieri、Rey、Kaminski、King-Shepard、Bullock）比照第一批的 rivers2021 列為可用；規則若收緊要一起改。
4. 順帶看到、這次沒查的：同一批已發佈文章的影片與圖表兩篇還有幾個像是課程頁或第三方的連結，例如 `mechanism.ucsd.edu/bill/teaching/...larkin...1987.pdf`、`dsciclass.org/dsci310/Notes/Cleveland_McGill_EPT.pdf`、`hci.stanford.edu/courses/cs448b/papers/Tversky_...`、`archemedxinc.wpengine.com/...Mayer-Evidence-Based-Principles...pdf`。它們不屬於 teaching-text 這 28 份紀錄。
