# 抽取紀錄：Tan、Wagner、Treude 2023，Detecting outdated code element references in software repository documentation

- **書目**：Wen Siang Tan（University of Adelaide）、Markus Wagner（Monash University）、Christoph Treude（University of Melbourne）。Detecting outdated code element references in software repository documentation。Empirical Software Engineering 29, 5（卷 29 第 1 期，文章編號 5，共 25 頁）。2023-09-25 接受、2023-11-21 線上刊出，卷期年份印的是 2024。DOI 10.1007/s10664-023-10397-6。CC BY 4.0。作者、單位、日期、DOI 對過刊出版首頁（P L1–49）；卷期另對過 Crossref（2026-10-14 查）。清單寫「2023」是線上刊出年。
- **讀了兩個版本**：
  - **刊出版（本紀錄以此為準）**：`.research/raw/learning-content/q2-interactive/tan2023-outdated-readme-published.pdf`（25 頁）與 `.txt`（1,262 行、61,661 字元，不帶 `-layout` 的 `pdftotext`）。**這是我 2026-10-14 重抓的**，來源是 Monash University 研究典藏 `https://researchmgt.monash.edu/ws/files/571668171/559717602_oa.pdf`（Unpaywall 列出的開放取用位置；檔案本身是 Springer 的刊出版排版，CC BY）。Springer 官網的 PDF 與 HTML 頁用 curl 抓到的是「Client Challenge」驗證頁，firecrawl 額度用完，所以改用機構典藏。
  - **預印本（清單原本指的檔）**：`tan2023-outdated-readme.pdf`、`.txt`（1,042 行、53,665 字元），arXiv:2212.01479v1，2022-12-02，arXiv 上只有 v1。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 3（程式碼）#12
- **行號**：「P L」是刊出版 `.txt` 的行號，「A L」是預印本 `.txt` 的行號。兩版的結果數字逐一對過，完全相同；差異列在最後一節前。

## 研究設計

- **類型**：提出一個自動偵測工具（DOCER），拿它掃公開專案的現況與歷史（mining study），再對 15 個專案開 issue 看維護者的反應。沒有讀者、學習者，也沒有量文件過期對使用者造成什麼後果。
- **「過期」的操作型定義**（P L343–383、Table 2）：文件裡提到的某個程式元素，在文件最後一次更新當時的原始碼裡找得到至少一個實例，而目前版本的原始碼裡一個都找不到，但文件裡還留著。實例的比對是整字、分大小寫、字串完全相同（P L377–378）。也就是說它只抓「被刪掉或改名的東西還留在文件裡」這一種過期。
- **資料**（P L157–166）：
  - `top1000`：GitHub 星數最高的 1,000 個專案，名單取自 gitstar-ranking，2022-06-20 蒐集。
  - `google`：Google 組織底下全部 2,279 個 GitHub 專案，同日蒐集。
  - 兩組的差別（刊出版才有）：大小中位數 31.7 MiB 對 1.5 MiB；存在時間中位數 7.6 年對 4.4 年；貢獻者中位數 181 人對 4 人（貢獻者數是 2023-05-05 補蒐集的，註腳 12）。
- **掃哪些文件**（P L145–156）：只有 README 與 GitHub wiki 頁，而且只收 GitHub 認得的標記格式。不含 docs 目錄、教學網站、部落格。
- **怎麼抽程式元素**（P L168–340、Table 1）：以 Treude 等 2014 的正規表示式清單為底，修改後共 21 條（駝峰式名稱、帶底線的名稱、函式呼叫樣式、全大寫兩個字母以上、反引號包起來的文字等）。**三個反引號的程式區塊沒有抽**，理由是內容較長、不容易比對到（P L332–333）；偵測網址的那條被拿掉。
- **人工標註**（P L206–230、P L1033–1039）：三位作者各自標同樣 50 個從 google 專案偵測到的程式元素，判定是不是真的過期，free-marginal kappa 0.92。標註的用途是修改正規表示式清單與挑 RQ4 的專案。**原文兩個版本都沒有報告這 50 個裡有幾個是真的過期，也沒有任何精確率或召回率。**
- **歷史分析**（P L437–531）：把主分支的每個 commit 連到對應的文件版本，用符號記錄每個元素在每個版本的狀態；只要某個零的前面出現過正整數就算曾經過期。只分析主分支（P L1023–1030）。
- **研究問題**（P L544–674）：RQ1 現況（幾個過期、過期多久）；RQ2 歷史上曾經過期的比例與存活時間；RQ3 怎麼被解決；RQ4 維護者對 issue 的反應。

## 結果（逐項）

### 分析到的專案（P L679–692；Fig. 8 看過 PDF 第 13 頁）

| | top1000 | google |
|---|---|---|
| 名單 | 1,000 | 2,279 |
| 複製失敗 | 1 | 1 |
| 逾時中止（top1000 一天、google 三天） | 8 | 1 |
| 完成分析 | 991 | 2,277 |
| 目前有至少一個過期參照 | 265 | 101 |
| 沒有過期參照 | 653 | 1,778 |
| 文件裡沒有任何比對得到原始碼的元素（No matches） | 73 | 398 |
| 有 README.md | 90.4%（896/991） | 88.7%（2,019/2,277） |
| 有 wiki 頁 | 60.0%（595/991） | 13.0%（297/2,277） |

### RQ1：現況（P L695–707、P L721–723；Fig. 9、10 看過）

| # | 層級 | top1000 | google | 原文 |
|---|---|---|---|---|
| 1 | 程式元素參照 | 3.9%（7,910/201,852） | 2.7%（1,283/48,078） | 「In the top1000 dataset, 3.9% (7910/201852) of the code element references detected are currently outdated.」 |
| 2 | 文件 | 19.2%（1,880/9,784） | 9.7%（287/2,947） | 「19.2% (1880/9784) of the documents contain at least one outdated reference to a code element」 |
| 3 | 專案 | 28.9%（265/918） | 5.4%（101/1,879） | 「28.9% (265/918) of the projects contain at least one outdated document.」 |
| 4 | 目前仍過期的參照，已過期多久（平均） | 4.7 年 | 4.2 年 | 「On average, the references are currently outdated for 4.7 years for projects in the top1000 dataset and 4.2 years for the google dataset (Fig. 10).」 |

分母的算法（原文沒有明說，我由 Fig. 8 的數字對出來）：專案層級的 918 ＝ 265 ＋ 653，1,879 ＝ 101 ＋ 1,778，**把「No matches」的專案排除在外**。若以完成分析的專案為分母，是 265/991 = 26.7% 與 101/2,277 = 4.4%。

Fig. 10 是小提琴圖：top1000 的分布從 0 拉到約 11 年，google 從 0 到約 8 年。原文只給平均，沒有給中位數或分位數。

### RQ2：歷史上曾經過期（P L726–774；Fig. 11、12、13 看過 PDF 第 14–15 頁）

| # | 層級 | top1000 | google |
|---|---|---|---|
| 5 | 專案 | 82.3%（658/800） | 29.7%（567/1,907） |
| 6 | 文件 | 40.7%（2,878/7,071） | 30.6%（925/3,018） |
| 7 | 程式元素參照 | 12.3%（23,588/191,849） | 7.1%（4,176/58,805） |
| 8 | 修好之後又再過期的參照 | 1.3%（2,431/191,849） | 0.4%（210/58,805） |

原文（P L726–731）：「we analysed all commits made to the main branch as well as merge commits on the main branch containing changes from feature branches for 800 projects from the top1000 dataset. 82.3% (658/800) of the projects, 40.7% (2878/7071) of the documents, and 12.3% (23588/191849) of the code element references are found to be outdated at some point in history.」

Fig. 12 的專案去向：

| | top1000 | google |
|---|---|---|
| 至少過期過一次 | 658 | 567 |
| 一直都是最新 | 142 | 1,340 |
| No matches | 55 | 353 |
| 逾時中止 | 144 | 18 |
| 複製失敗 | 1 | 1 |

所以 800 ＝ 658 ＋ 142，同樣排除了 No matches 的 55 個；**top1000 有 144 個專案因為逾時沒有分析到**（刊出版 P L762–764 才補上原因：「more projects exceeded the time limit when analysing all commits in the main branch」）。原文沒有說被中止的是哪一類專案；逾時多半與 commit 數量有關是我的推測，原文沒寫。658 ÷（658＋142＋55）= 77.0%，658 ÷ 1,000 = 65.8%（都是我算的）。

**存活時間（Fig. 13）**：

| # | 結果 | 數字 | 條件 | 原文 |
|---|---|---|---|---|
| 9 | 過期一個月後還沒修的比例 | top1000 55%、google 45% | **只算後來已經被修掉的參照**，且時間差大於零 | P L765–771：「Figure 13 contains only outdated code elements references that project maintainers have already fixed with a timestamp difference greater than zero. … For example, after one month, 45% (google) and 55% (top1000) of the references (that were eventually fixed) were still outdated.」 |

圖上我目視讀到的（原文沒有給這些數字，只能當大概）：橫軸是對數刻度的分鐘、小時、天、月、年、十年；一天時兩條線約在 0.75–0.85，一年時約在 0.15–0.25，十年處歸零。也就是說，**在後來被修掉的參照裡，大約一半在一個月內就被修掉，多數在一年內**。

### RQ3：怎麼被解決（P L810–830、Table 7；Fig. 14 看過 PDF 第 17 頁）

| # | | top1000 | google |
|---|---|---|---|
| 10 | 曾過期的參照裡後來被解決的 | 73.6%（17,368/23,588） | 55.5%（2,319/4,176） |
| 11 | 靠改原始碼（實例又出現） | 47.6%（8,271/17,368） | 50.2%（1,164/2,319） |
| 12 | 靠更新文件（拿掉那個參照） | 39.1%（6,783/17,368） | 43.3%（1,004/2,319） |
| 13 | 靠刪掉整份文件 | 13.3%（2,314/17,368） | 6.5%（151/2,319） |

作者自己在討論裡對第 11 列的解釋（P L982–987）：「In our findings, approximately half of the fixes were attributed to source code changes. This is because the action of mass deleting and restoring source code files was interpreted as a fix caused by source code changes. We can also observe in various reports that the number of code element instances found in the source code suddenly drops to 0 and back to the original count.」google 存活曲線在一個月附近的陡降，查出來是 google/j2objc 一次刪掉又還原大量原始碼檔（P L979–981）。

刊出版新增的 Fig. 14 與一句話（P L825–828）：相鄰 commit 之間實例數的差距，「0.29% of top1000 and 0.51% of google commits having a difference of more than 1000」。

這表示第 5–13 列裡有一部分「過期」與「修好」其實是原始碼被大量搬動造成的暫時歸零，不是文件真的過期過。原文沒有估計這部分占多少。

### RQ4：維護者的反應（P L834–871）

| # | 結果 | 數字 | 原文 |
|---|---|---|---|
| 14 | 開 issue 的專案 | 15 個（從 35 個「人工標註裡至少有一個真陽性」的 google 專案中，挑近一年有新 commit 的） | P L838–840（35 這個數字只有刊出版有） |
| 15 | 回應 | 4 個正面回應、4 個回報是誤判、7 個還沒回 | P L842–854：「4 projects have responded positively, while the other 4 reported the issues as false positives. 7 projects have not yet responded」 |
| 16 | 回報的過期處 | 19 處，其中 5 處已被修掉 | P L854–855 |

兩個誤判的例子（P L864–871）：一個 CMake 旗標已從原始碼移除，但維護者說文件對裝了多個 Python 版本的使用者仍然有用；另一個是 `text_out` 這個字串在原始碼裡刪了，功能還在程式邏輯裡。有回應的 8 個專案裡一半說是誤判，而這 15 個專案本來就是從「作者人工判定有真陽性」的專案挑出來的。

### 前言引用的別人的數字（背景，不是這篇的結果）

- Aghajani 等 2019：「"up-to-dateness problems" account for 39% of documentation content issues」（P L64–65）。
- de Souza 等 2005、Lethbridge 等 2003：超過三分之二的受訪者認為自己系統的文件過期了（P L65–67）。
- GitHub Open Source Survey 2017（Zlotnick）：「incomplete or outdated documentation is a pervasive problem, observed by 93% of respondents, yet 60% of contributors say they rarely or never contribute to the documentation」（P L1061–1062）。
- Sholler 等 2019：「outdated documentation may lead newcomers to a wrong understanding of the project, which is also demotivating」（P L1064–1065）。這是一篇「十條規則」文章裡的主張，不是測量結果。

## 作者自己列的限制（刊出版第 8 節 Threats to Validity，P L998–1046）

**構念效度**

1. 不是所有種類的過期都抓得到；圖片與影片裡的過期資訊抓不到（P L1000–1011）。
2. 正規表示式會造成誤判，例如被刪掉的最後一個實例其實只是原始碼註解的一部分（P L1011–1014）。
3. 更新日誌（change log）可能被誤判成過期，因為它本來就會提到已經移除的元素（P L1015–1018）。
4. 程式元素還在、但文件描述的關係已經不對的情況抓不到：「documentation could be considered outdated even if all code element references are matched」（P L1018–1021）。
5. 「These false positives are difficult to eliminate and require project maintainers to verify individually.」（P L1021–1022）
6. 只分析主分支（P L1023–1030，刊出版新增）。

**內部效度**：人工標註可能有偏誤；三位標註者分開標、一致性高；若用超過 50 個元素，正規表示式的修改與符合 RQ4 條件的專案數可能不同（P L1033–1039，刊出版新增）。

**外部效度**：「we cannot claim that the findings can be generalised to other GitHub repositories that are not in the datasets considered」，也不能推到其他版本控制平台（P L1042–1046，刊出版新增）。

相關研究一節另有一句（P L1091–1096）：完全相符的比對「may underestimate the number of actually outdated code element references, we err on the side of caution」。

原文沒有說的：偵測結果的精確率；分母排除 No matches 專案的理由；歷史分析裡逾時的 144 個 top1000 專案對比例的影響；大量刪除又還原造成的假過期占多少；4.7 年的平均有沒有被少數很舊的參照拉高（只給平均）。

## 與摘要說法不一致的地方

1. **摘要「most projects contain at least one outdated code element reference at some point in their history」只對 top1000 成立。** 兩組資料裡 top1000 是 82.3%，google 是 29.7%（P L759）。摘要寫「analysed over 3,000 GitHub projects and found that most projects…」，把兩組合在一起說；若把兩組做過歷史分析的專案合計，是（658＋567）÷（800＋1,907）= 45.3%（我算的），不到一半。結論段寫的是「the majority of the most popular projects on GitHub」（P L1137），比摘要準確。
2. **前言與結論說「過期好幾年才被修」，和 Fig. 13 對不上。** 前言（P L78–79）：「These references were typically outdated for years before they were noticed and fixed by project maintainers.」結論（P L1138–1139）：「these outdated references usually survived in the documentation for years before they were fixed.」但文中「年」這個數字只有一個來源：4.7 年與 4.2 年，是**目前仍然過期、還沒被修**的參照已經過期多久（RQ1）。被修掉的那些參照的存活時間在 Fig. 13，一個月後只剩 55% 與 45%。兩句話把「還沒修的放了多久」說成「修之前放了多久」。摘要本身沒有寫這句。
3. 摘要「some of which have already led to documentation fixes」：對應 19 處裡修了 5 處；摘要沒提有回應的 8 個專案裡 4 個說是誤判。
4. 82.3% 與 28.9% 的分母都排除了文件裡沒有可比對元素的專案，前言引用這兩個數字時寫成「of the most popular projects on GitHub」，沒有交代分母。

## 與清單「要撐的結論」不合的地方

清單寫的是：「文件裡引用的程式元素會過期，而且過期很久沒人發現」。

- **前半「會過期」撐得住，但要帶條件。** 能寫的是：一個只看 README 與 wiki 的自動工具，在星數最高的 1,000 個專案裡，偵測到 28.9%（265/918，分母排除沒有可比對元素的 73 個專案；以完成分析的 991 個算是 26.7%）目前至少有一處「文件還提到、原始碼裡已經找不到」的名稱；以參照計是 3.9%。Google 的 2,279 個專案是 5.4% 與 2.7%。
- **這些都是工具標出來的「可能過期」，沒有精確率。** 作者自己的用詞是 potentially outdated；RQ4 有回應的 8 個專案一半說是誤判；歷史分析裡約一半的「修復」被作者歸因於大量刪除又還原原始碼。文章不能把 28.9% 寫成「有 28.9% 的專案文件過期」，要寫成「被工具標出」。
- **後半「過期很久沒人發現」撐不住，要改寫。**
  - 「很久」：4.7 年是目前還留著的那批參照的平均年齡，是存量；原文沒有給中位數。已經被修掉的參照，一個月內約修掉一半（Fig. 13）。兩個數字要分開寫：「還留著的那些平均已經放了四年多；會被修的多半在一年內修掉」。原文自己在前言與結論把兩者混為一談，不能照抄那兩句。
  - 「沒人發現」：原文沒有量有沒有人發現，只量參照還在不在。誤判的例子裡有維護者明說那段文件是刻意留著的。
- **範圍比「文件」窄**：只有 README 與 wiki；程式區塊（三個反引號）裡的內容沒有抽，抽的是行文中的名稱與單一反引號的內容。所以這篇其實沒有檢查「文件裡的範例程式」過不過期，檢查的是散在說明文字裡的識別字。放進 order 3 談教學文裡的程式碼時要講清楚。
- **只抓一種過期**（名稱被刪或改名）；名稱還在但用法、參數、行為變了的情況抓不到。所以它對「文件過期有多普遍」是低估方向，對「標出來的是不是真的過期」又有未知比例的誤判，兩個方向都有。
- **沒有關於讀者或學習者受到什麼影響的資料**；前言與相關研究引的後果（demotivates newcomers 等）都是別的來源，其中 Sholler 2019 是主張不是測量。

## 兩個版本的差異（預印本 arXiv v1 對刊出版）

結果數字（RQ1–RQ4 的所有個數與百分比）兩版相同，逐一對過。刊出版多出來的內容：

1. 資料集描述：存在時間、貢獻者數的中位數與 Fig. 3、4（P L159–166）。
2. 「code elements」的定義一句（P L176、P L204–205）與 Table 1 的 21 條正規表示式。
3. kappa 0.92 加上「almost-perfect (McHugh 2012)」；預印本的註腳 14（「前人用過少於 50 個資料點」）刪掉了。
4. 研究問題拆出 RQ1.1、RQ1.2、RQ2.1、RQ2.2，RQ3 的問句改寫。
5. RQ2 說明分析的是主分支的全部 commit 與合併 commit，並補上歷史分析專案數較少是因為逾時（P L726–728、P L762–764）。
6. Fig. 13 的圖說重寫，明講分母是「已被修掉的參照」。
7. Fig. 14 與 0.29%、0.51% 兩個數字。
8. RQ4 補上「35 個專案」。
9. 實作一節補了操作步驟與 Table 8。
10. 預印本的第 8 節「Limitations」（A L806–821）擴成「Threats to Validity」三小節，新增主分支、內部效度、外部效度。
11. 用詞：「We hypothesise」改成「We posit」「We imagine」；未來工作多兩項（其他文件檔、多分支）。
12. 作者 Markus Wagner 的單位從 University of Adelaide 改成 Monash University。

## 讀取紀錄

| 順序 | 位置 | 內容 |
|---|---|---|
| 1 | 預印本 `.txt` A L1–1042（一次讀完） | 首頁、摘要、1 前言、2 動機例子、3 方法（3.1–3.4、Table 3.1–3.5）、4 研究問題、5 結果（RQ1–RQ4）、6 實作、7 討論、8 限制、9 相關研究、10 結論；A L957–1042 參考文獻（掃過） |
| 2 | 預印本 PDF 第 11–16 頁 | Table 3.5、Fig. 5.1–5.6、Table 5.1 看過版面；Fig. 5.1 與 5.5 的專案去向數字抄錄如上 |
| 3 | 刊出版 `.txt` P L1–40（用 head 印出）、P L40–1049、P L1049–1262 | 全文依序讀完：首頁、摘要、1–10 節、經費與資料聲明、利益衝突、授權；P L1183–1257 參考文獻（掃過） |
| 4 | 刊出版 PDF 第 13–17 頁 | Fig. 8–14、Table 7 看過版面，數字與 `.txt` 及預印本相同 |

對過版面的表：預印本 Table 3.5、5.1；刊出版 Table 7。刊出版的 Table 1（正規表示式）、Table 2–6、Table 8 只讀了 `.txt`，沒有另外對 PDF 版面，這幾張表沒有結果數字。刊出版 Fig. 2–5（專案大小、年齡、貢獻者數、語言）沒有看圖，只讀了內文給的中位數。Fig. 13 的一天與一年處的數值是我目視估的，原文只給了一個月的 45% 與 55%。線上附錄（Zenodo 7384588，專案名單、正規表示式、工具）沒有讀。
