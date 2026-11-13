# 抽取紀錄：Martella、Martella、Yatcilla、Newson、Shannon、Voorhis 2023，Educational Psychology Review 35:107

## 檔頭

- **書目**：Amedee Marchand Martella、Ronald C. Martella、Jane K. Yatcilla、Alexandra Newson、Eric N. Shannon、Charissa Voorhis（2023）。How Rigorous is Active Learning Research in STEM Education? An Examination of Key Internal Validity Controls in Intervention Studies. *Educational Psychology Review*, 35, 文章編號 107（共 48 頁）。doi 10.1007/s10648-023-09826-1。Accepted 2023-10-14，Published online 2023-11-04。作者姓名與單位對過首頁（L18）與末頁（L1028–1036）：UC Santa Barbara（第一作者）、University of Colorado at Colorado Springs、Purdue（圖書館與教育研究）、University of Oregon、University of Missouri。
- **版本**：刊出版（publisher version），CC BY 4.0 開放取用（L868）。
- **原文檔**：
  - 清單原列的 `.research/raw/learning-content/q3-activity/martella2023.md`（1,148 行、228,751 字元）是 Springer HTML 頁轉的，**缺摘要、缺 Table 1 與 Table 2 的內容（只剩「Full size table」連結）、缺兩張圖**，而且每個引用都內嵌整條參考文獻。這份沒有拿來當讀本。
  - 2026-10-14 重抓刊出版 PDF 的文字：`https://r.jina.ai/https://link.springer.com/content/pdf/10.1007/s10648-023-09826-1.pdf`（Springer 的 PDF 直連被 bot 檢查擋下，Wayback 沒有存檔，Europe PMC 沒收）。存成 `.research/raw/learning-content/q3-activity/martella2023_springer_pdf.md`（558 行、142,129 字元），再用 `fold -s -w 240` 折行成讀本 `martella2023_springer_pdf_folded.txt`（**1,036 行、142,607 字元**）。**下面所有行號都是這份折行檔的行號。**
  - 兩張圖從出版者圖檔主機另抓（`media.springernature.com/full/springer-static/image/art%3A10.1007%2Fs10648-023-09826-1/MediaObjects/10648_2023_9826_Fig{1,2}_HTML.png`），直接看圖。圖檔只放在 session scratch，沒有存進 repo。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 8（結論 8-b 的方法批評）

## 研究設計

- **類型**：方法學回顧（作者自稱 systematic review，L803）。不是統合分析，**沒有算任何效果量**，也沒有檢驗「控制做得差的研究效果是不是比較大」。做的事是：把每篇文章對 12 項內部效度控制逐項編碼，算各代碼的篇數與百分比（L350–351）。
- **兩批文章**：
  1. **Freeman 等 2014 統合分析收的文章**。Freeman 的補充表 S4 有 225 個研究，本文作者辨認出 187 篇文章；1 篇（Mays, n.d.，代表 2 個研究，原列「pers comm」）要不到；再剔掉 10 篇（代表 15 個研究）；**最後編碼 176 篇**（L112–116、L321–326）。剔掉的 10 篇理由：課程是特殊兒童導論（1 篇）、是課程做法或已發表研究的回顧（2 篇）、是課堂經驗或做筆記方法的描述（2 篇）、是軼事觀察（1 篇）、比的是「常考／突襲小考 vs 不考」（4 篇）（L323–326）。
  2. **2015–2022 的新文章抽樣**。沿用 Freeman 的檢索詞再修改：排除心理學課、納入醫護健康類課程（STEMM）、新增檢索詞（personal response system、team-based learning、inquiry based learning、discovery learning、flipped、passive learning 等，L137–140）。資料庫：Web of Science Core Collection、PubMed、ERIC、Engineering Village、ProQuest Dissertations and Theses Global（L142–146）。兩次檢索：2020-02-19（收 2015-01-01 起）與 2022-09-09（收 2020-02-20 起）（L127–128）。篩選流程（L152–165 與 Fig. 1）：2015–2020 有 6,861 筆，標題摘要篩後 191 篇進全文，留 176 篇；2020–2022 有 2,893 筆（L152 寫 2,894），137 篇進全文，留 84 篇；合計 260 篇。**從 260 篇簡單隨機抽約 33%，共 84 篇編碼**（L338）。
- **2015–2022 的納入標準**（L154–157，八條）：(a) 至少一個主動學習介入對講述介入、或對另一個主動學習介入；(b) 大學部；(c) 一般面授課，不含榮譽班與補救班；(d) 主要學期；(e) STEM 科系；(f) 介入排在主要上課時段，不是實驗課或討論課；(g) 有學業表現資料；(h) 有對照組的話要明確標示是講述還是主動學習。
- **編碼項目**：6 項基本特徵（Table 1：科系、比較組別、介入期間、評量類型、哪一組表現較高、學生偏好）與 12 項內部效度控制（Table 2）。12 項控制的來源是 APA 報告標準 2008、Cook 等 2015（CEC 標準）、Cook & Campbell 1979、Martella 等 2013、Theobald 等 2020、WWC 標準手冊 4.1（L174–176）。
- **12 項控制**（L178–196、L303–317）：研究設計（隨機／準實驗）；組別等值——用與依變項直接相關的量數（前測、同類考試分數）；組別等值——用間接相關的量數（GPA、SAT／ACT、先修課）；流失是否等值；樣本數是否相配（兩組差距不超過 25%）；授課者是否相同；實驗與控制變項有沒有操作型定義；劑量（學生花在課程內容上的課內外時間）有沒有交代、兩組是否相等；實施時段是否相同；教的內容是否相同；依變項量數兩組是否相同；實施忠實度。
- **編碼者與一致性**：Freeman 那批由第四、五、六作者各編約三分之一（61、58、57 篇），**第二作者獨立把 176 篇全部再編一次並當主評分者**；總一致率 92.5%（各項範圍 65.2%–100%）；不一致時**一律採主評分者的代碼**（L327–334）。2015–2022 那批由第一作者編 69 篇、第四作者編 15 篇，第二作者同樣全部再編，總一致率 93.0%（範圍 78.2%–100%）（L343–346）。一致的認定很嚴：代碼要完全相同才算（L330–332）。
- **分析單位是「文章」不是「研究」**：一篇文章有多個實驗時算一篇，各實驗做法不同就給「組合代碼」，組合代碼另成一類、不重複計入單項（L321–322、L350–351）。
- **預先註冊**：只有檢索策略註冊在 OSF（10.17605/OSF.IO/GFT4B，L862）；註冊的是 2010 年以後，檢索後才改成只收 2015 年以後（L126–127）。編碼表與分析沒有寫到有預先註冊。
- **資料**：「Data are available upon request」（L862）。有線上補充資料（L858），本次沒有取得、沒讀。

## 結果（逐項）

百分比的分母：Freeman 批 N = 176、2015–2022 抽樣 N = 84、合併 N = 260。表格數字出自 Table 1（L198–234）與 Table 2（L238–299），正文敘述出自 L357–646。

### A. 整體嚴謹度

| # | 結果 | 數字 | 條件 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| A1 | 12 項全達標的文章 | Freeman 批 0 篇；2015–2022 抽樣 0 篇 | **把實施忠實度算進去**時 | L455–456、L551、L795–796 | 「If implementation fidelity were included in the analysis, no articles would have met all of the controls. Therefore, 100% of the articles had at least one internal validity control issue」 |
| A2 | 寬鬆算法下 11 項全達標 | Freeman 批 2.3%（4 篇：Basili & Sanford 1991、Bilgin 2006、Carmichael 2009、Randolph 1992）；2015–2022 抽樣 1.2%（1 篇：Lape 等 2016）；合併 1.9%（5 篇） | 寬鬆條件三個：(a) 不算實施忠實度，而且已有直接量數顯示等值時不算間接量數；(b) 操作型定義與劑量「部分」也算過；(c)「未說明」一律當作達標 | L452–455、L548–551、L640–643 | 「Only 2.3% articles … successfully met each of the 11 internal validity controls; this analysis (a) excluded both implementation fidelity … (b) allowed for partial ratings … (c) gave articles the benefit of the doubt」 |
| A3 | 「未說明」改算不達標 | Freeman 批剩 0.6%（1 篇，Randolph 1992）；2015–2022 抽樣 0 篇；合併 0.4% | 仍不算實施忠實度 | L454–455、L550–551、L643 | 「only 0.6% (i.e., Randolph, 1992) would have met all controls, excluding implementation fidelity」 |
| A4 | 完全達標的控制項數分布 | Freeman 批：達標半數以下 61.9%、7–10 項 24.4%；2015–2022：64.3%、19.0%；合併：62.7%、22.7%；三批都沒有 11 項全達標的 | 「fully met」的嚴格算法；直接或間接等值量數擇一計分，所以是 11 項 | L457–459、L554–555、L645–646、Fig. 2 | 「The majority (61.9%) of the articles met half or fewer of the controls, only 24.4% of the articles met 7 to 10 of the controls, and no articles met all 11 of the controls.」 |

Fig. 2 是三批文章「達標 0–11 項」的長條圖，圖上沒有標數值。看圖：0 項與 11 項三批都接近零；眾數在 2–6 項之間，每一格大約 5%–23%。文字給的兩段（半數以下、7–10 項）相加不到 100%，差額（Freeman 批 13.7%、2015–2022 批 16.7%、合併 14.6%）是剛好達標 6 項的文章，這是我算的，與圖上 6 項那一格的高度相符。

### B. 逐項控制（Table 2）

每格是「Freeman 批／2015–2022 抽樣／合併」。

| # | 控制 | 數字 | 位置 |
|---|---|---|---|
| B1 | 隨機分派設計 | 18 篇 10.2%／7 篇 8.3%／25 篇 9.6%。另有 1 篇 Freeman 批文章是兩校各用一種設計（組合代碼） | L243 |
| B2 | 準實驗設計 | 155 篇 88.1%／74 篇 88.1%／229 篇 88.1%。準實驗指「比不同年度或用現成班級」（L399） | L243 |
| B3 | 受試者內設計 | 2 篇 1.1%／3 篇 3.6%／5 篇 1.9% | L243 |
| B4 | 直接相關量數顯示兩組等值 | 有且等值 23.3%／31.0%／25.8%；有但不等值 2.3%／11.9%／5.4%；**沒報告 72.7%／54.8%／66.9%** | L244–245 |
| B5 | 間接相關量數（GPA、SAT 等） | 有且等值 11.9%／10.7%／11.5%；有但不等值 2.3%／2.4%／2.3%；**沒有 47.7%／65.5%／53.5%**；只給人口統計 3.4%／8.3%／5.0%；其餘是各種組合代碼 | L245–254 |
| B6 | 前後測之間流失超過 30% | 有 15.3%／10.7%／13.8%；沒有（或低於 30%）26.1%／33.3%／28.5%；**未說明 58.5%／56.0%／57.7%** | L255–256 |
| B7 | 兩組流失有差異 | 有 20.5%／6.0%／15.8%；沒有 19.9%／16.7%／18.8%；**未說明 59.7%／77.4%／65.4%** | L257–258 |
| B8 | 樣本數相配（差距不超過 25%） | 是 40.9%／50.0%／43.8%；否 46.0%／34.5%／42.3%；未說明 11.4%／13.1%／11.9% | L258–259 |
| B9 | 同一位授課者 | 是 33.0%／45.2%／36.9%；否 46.0%／26.2%／39.6%；未說明 19.3%／27.4%／21.9% | L259–260 |
| B10 | 實驗變項有操作型定義 | 完整 50.0%／51.2%／50.4%；部分 39.8%／45.2%／41.5%；沒有 10.2%／3.6%／8.1% | L269–270 |
| B11 | **控制變項有操作型定義** | 完整 19.9%／25.0%／21.5%；部分 32.4%／34.5%／33.1%；**沒有 47.7%／40.5%／45.4%** | L271–272 |
| B12 | 實驗變項劑量有交代 | 有 40.3%／25.0%／35.4%；部分 27.8%／40.5%／31.9%；沒有 31.8%／34.5%／32.7% | L273–274 |
| B13 | 控制變項劑量有交代 | 有 31.8%／21.4%／28.5%；部分 22.7%／36.9%／27.3%；沒有 45.5%／41.7%／44.2% | L275–276 |
| B14 | 兩組劑量相等 | 相等 29.5%／19.0%／26.2%；不相等 13.1%／7.1%／11.2%；**未說明 57.4%／73.8%／62.7%** | L277–285 |
| B15 | 同一時段實施 | 是 47.2%／42.9%／45.8%；否 43.8%／51.2%／46.2%；同學期不同週 0.6%／3.6%／1.5%；未說明 5.7%／0.0%／3.8% | L285–286 |
| B16 | 教的內容相同 | 是 63.6%／48.8%／58.8%；否 13.6%／4.8%／10.8%；未說明 22.2%／46.4%／30.0% | L286–287 |
| B17 | 依變項量數兩組相同 | 是 78.4%／65.5%／74.2%；否 8.5%／9.5%／8.8%；部分 5.7%／7.1%／6.2%；無法判斷 7.4%／14.3%／9.6% | L287–288 |
| B18 | **實驗組有實施忠實度檢核** | 有 7.4%／6.0%／6.9%；**沒有 92.6%／94.0%／93.1%** | L296–297 |
| B19 | **控制組有實施忠實度檢核** | 有 6.3%／6.0%／6.2%；**沒有 93.8%／94.0%／93.8%** | L298–299 |

補充敘述：

- 流失超過 30% 的文章裡，流失有組間差異的比例：Freeman 批 92.6%、2015–2022 批 22.2%、合併 75.0%（L416、L519、L609）。
- Freeman 自己說排除了學生不等值、授課者不等值、考試不等值的研究，本文作者編碼後仍在這三項找到問題。原文在 B4、B5、B9、B17 四段各寫一次「The following results were obtained despite the fact that Freeman et al. (2014) reported they excluded articles that did not have student equivalence」（L403、L409、L422、L444），討論再總結一次（L791–792）。

### C. 基本特徵（Table 1）

| # | 項目 | 數字（Freeman 批／2015–2022／合併） | 位置 |
|---|---|---|---|
| C1 | 比較組別是「主動學習 vs 講述」 | 89.2%／85.7%／88.1%；「主動 vs 主動」只有 1.1%／1.2%／1.2% | L203–204 |
| C2 | 介入期間是整學期 | 83.5%／79.8%／82.3%；只有一堂課的 2.8%／6.0%／3.8% | L212 |
| C3 | 只用研究者或教師自編（或題庫）評量 | 43.2%／52.4%／46.2%；單獨或與其他合用 69.9%／79.8%／73.1% | L213、L376、L483、L574 |
| C4 | 只用標準化常模評量 | 6.8%／8.3%／7.3%；單獨或合用 22.2%／21.4%／21.9% | L213、L379、L484、L575 |
| C5 | 主動學習組統計顯著較高 | 29.5%／39.3%／32.7% | L222 |
| C6 | 講述組統計顯著較高 | 0.6%／0.0%／0.4% | L223 |
| C7 | 主動學習組較高但不顯著 | 14.8%／4.8%／11.5% | L223 |
| C8 | 依量數而異（混合） | 19.9%／21.4%／20.4% | L224 |
| C9 | **沒做推論統計** | 17.0%／16.7%／16.9%（Table 1 三個「No stats analysis」列加總；其中偏向實驗組的 15.9%／15.5%／15.8%） | L224–225、L386、L490、L580 |
| C10 | 彙總：只顯示主動學習組較好 | Freeman 批 64.8%；合併 64.6%。2015–2022 批 64.3%，但原文措辭是「in some way」 | L389、L495、L582 |
| C11 | 彙總：只顯示講述組較好 | 4.0%／3.6%／3.8% | L389、L495–496、L582–583 |
| C12 | 沒報告學生偏好 | 63.1%／67.9%／64.6% | L226 |
| C13 | 學生偏好主動學習組 | 佔全部文章 27.3%／19.0%／24.6%；佔有直接比較偏好的文章 73.8%（Freeman 批）、59.3%（2015–2022） | L233、L660–662 |
| C14 | 科系分布 | Freeman 批數學最多 18.2%；2015–2022 批工程最多 33.3%；合併工程 18.1% | L201–203、L365、L474、L565 |

### D. 討論與結論裡的論點（不是數據，但會被引用）

| # | 論點 | 位置 | 原文一句 |
|---|---|---|---|
| D1 | 主動學習沒有統一定義，只剩「減少或取消講述」這個共通點；用「不是什麼」來定義會出問題 | L651–652 | 「there is not a unified definition on what it involves (Lombardi et al., 2021), other than the reduction or elimination of lecture. A problem ensues when an approach is defined by what it is not versus what it is.」 |
| D2 | 「傳統講述法」同樣沒有統一定義 | L653–654 | 「there is not a unified definition of what is meant by the “traditional lecture method” (Zakrajsek, 2018)」 |
| D3 | 在 Freeman 的定義下，主動學習課可以有高達 90% 的時間在講述，講述課可以有將近 10% 的主動學習 | L667–668、L732–734 | 「active learning courses could involve up to 90% of the class period spent on lecture and still be deemed an active learning course and lecture courses could involve just under 10% of the class period spent on active learning」 |
| D4 | 科學教育文獻裡絕大多數主動學習條件至少有 20% 課堂時間或每週 30 分鐘在講述（轉引 Martella 等 2021a） | L652–653 | 「the overwhelming majority of active learning conditions in the science education literature have been found to devote at least 20% of class time or 30 min per week to lecture」 |
| D5 | 「主動 vs 講述」是假二分 | L664–667、L834 | 「“Lecture or active learning” reflects a false dichotomy and an unneeded choice.」 |
| D6 | 沒有操作型定義時能下的結論只到「標成講述的那一組比標成主動學習的那一組差」 | L735–736 | 「all we can conclude in a study is that what is labeled lecture/ traditional instruction is less effective than what is labeled active learning without knowing what specifically occurred in each」 |
| D7 | 同一位授課者也不保證乾淨：授課者知道自己在教哪一種，可能有偏好 | L716–719 | 「having the same instructor for both (all) groups may remove one confound … but could add another one (e.g., bias for or against one instructional method over another one)」 |
| D8 | 達標項數少不等於整體較弱；要看是哪一項、多嚴重，只能逐篇判斷 | L673–677 | 「the presented data should be viewed as an indication of where there are internal validity flaws in the literature versus the severity of each flaw which can only be determined on a study-by-study basis」 |
| D9 | 作者承認要求每項都達標不切實際 | L796–799 | 「We realize that it is unrealistic to expect articles to meet all internal validity controls. These articles are in applied settings.」 |
| D10 | 結論用的是「有可能」：沒控制混淆時，得到的結果可能不是主動學習的真實效果 | L843–844 | 「it is possible that the results obtained in these articles are not reflecting the true effect of active learning interventions (nor lecture interventions)」 |
| D11 | 現有文獻答不了的四個問題：哪種主動學習最有效／主動學習由什麼構成（外顯動作還是認知行為）；講述品質會不會改變結果；主動學習該在教學順序的哪裡出現；主動與講述各該多少劑量 | L844–847 | 「In our review of 260 articles, we cannot answer any of these questions with the current literature base.」 |
| D12 | 建議跳出「主動 vs 講述」，改研究促進認知投入的策略（自我解釋、提取練習），並研究講述怎麼跟參與式活動整合 | L829–836 | 「moving away from the constructivist teaching fallacy (Mayer, 2004) where being behaviorally active is equated with being cognitively active」 |
| D13 | 導言：把「行為上主動」當成「認知上主動」是 Mayer 2004 說的 constructivist teaching fallacy | L52–54 | 「an assumption that has been referred to as the constructivist teaching fallacy because it equates active learning (cognitively active) with active teaching (behaviorally active; Mayer, 2004, p. 15)」 |
| D14 | 作者也寫了正面的話：以各種變體與劑量顯示主動學習有效的文章數量壓倒性地多，證據「看起來清楚」，問題在這批文獻的品質夠不夠讓人相信是自變項造成的 | L668–670 | 「Although the evidence seems clear based on the overwhelming number of articles showing the effectiveness of active learning in all variations and dosages, we must determine the quality of the literature base」 |

## 作者自己列的限制

六條（L803–820）：

1. Freeman 的 1 篇文章（2 個研究）找不到，另剔掉 10 篇（15 個研究）。作者說已納入 94.1% 的文章、92.4% 的研究，結果不太可能因此改變。
2. 編碼單位是文章不是研究，為的是每篇文章權重相同；一篇多研究的文章可能拿到組合代碼。
3. 抽樣從 2015 年起，不是從 Freeman 收錄截止的 2010 年起，所以 2010–2014 的文章不在任何一批裡。
4. 新一批的檢索策略跟 Freeman 不同：加了醫護健康類、排除心理學。作者把這條寫成優點（「provides a more in-depth look」）。
5. 2015–2022 只編了隨機抽出的三分之一。作者報告抽樣誤差約 8.82%（L817），沒有寫怎麼算的。我用 n = 84、N = 260、p = .5、95% 信賴水準加有限母體校正算出來是 8.8%，數字對得上，但這是我的推算，不是原文給的算式。
6. 評分者一致性雖高於可接受水準，別的研究者可能會編出不同的代碼；結果是「based on our assessment」。

另外兩條是討論裡寫的保留，不在六條內：

- 本文只看內部效度，沒看統計結論效度、p-hacking、檢定力不足、出版偏誤（L826–829，列為未來方向）。
- 各項缺失的嚴重度沒有評，只能逐篇判斷（L673–677）。

利益聲明：「The authors declare no competing interests」（L866）。經費：第一作者的 NSF 研究生獎學金與博士後獎學金（L853–856）。讀的時候留意到的立場背景：第一、第二作者此前已發表過批評主動學習文獻的文章（Martella, Lovett & Ramsay 2021a；Martella, Yatcilla 等 2021b 檢查 Freeman 被引用得準不準；Martella & Schneider in press），本文多處自引。這是我的觀察，原文沒有把它列為限制。

## 與摘要說法不一致的地方

逐項對過，有下面幾處。前兩處是摘要與正文之間，其餘是正文各處之間或正文與圖表之間。

1. **摘要「no articles … met each of the 12 internal validity controls」省略了條件。** 正文說的是「把實施忠實度算進去」才是零篇（L455–456、L795–796）。不算實施忠實度、用寬鬆算法時 Freeman 批有 4 篇、新批有 1 篇達標（L452、L548）。摘要沒有錯，但單看摘要不會知道零篇靠的是「93% 的文章沒做忠實度檢核」這一項。
2. **摘要說「a random sample of more recent active learning articles」，沒寫新批的收錄範圍跟 Freeman 不同**（加醫護、排除心理學、多了檢索詞）。兩批不是同一個母群的前後期，摘要把兩批並列時沒提。
3. **講述組較好的比例，討論與結果不一致。** 結果寫 Freeman 批 4.0%（L389），討論寫 3.4%（L657）。對 Table 1：顯著偏控制組 1 篇、不顯著偏控制組 5 篇，合計 6 篇是 3.4%；再加「沒做統計、偏控制組」1 篇是 7 篇 4.0%。兩個數字用了不同的算法，原文沒說明。
4. **「most articles did not have the same dosage between/among groups」（L745）表格撐不住。** Table 2 的劑量不相等只有 11.2%（合併），相等 26.2%，62.7% 是未說明。正確的說法是「多數文章沒有交代到能判斷劑量是否相等」。
5. **結論「half of the articles … compared groups from different years, with the control group almost always reflecting the prior year(s)」（L841–842）在結果裡沒有對應的編碼。** 最接近的是「實施時段不同」46.2%（合併），但那一項沒有區分是不同年度還是不同學期，也沒有編「控制組是不是前一年」。
6. **「most articles that used a quasi-experimental design did not establish that the groups were equivalent」（L687）沒有交叉表。** Table 2 給的是全部文章裡 66.9% 沒報告直接量數，沒有按設計類型分開算。
7. **寬鬆算法的「2.3% 達標 11 項」與 Fig. 2 的「沒有文章達標 11 項」是兩種算法**（前者部分與未說明都算過，後者要 fully met）。同一段先後出現，容易被讀成矛盾。
8. **Fig. 1 的數字對不起來。** 2020–2022 那一支：2,893 篇篩標題摘要，排除框寫 n = 587，下一格卻是 137 篇進全文（2,893 − 587 = 2,306）。2015–2020 那一支是對的（6,861 − 6,670 = 191）。另外 L152 寫 2020–2022 可篩選的是 2,894 篇，L162–163 與圖寫 2,893。
9. **評分者一致率的算式寫錯**：L330「dividing the number of agreements by disagreements and multiplying by 100」，照字面不會得到 92.5% 這種數字，應該是除以總數。原文照抄，沒有更正啟事可對。
10. **2015–2022 批的彙總句措辭跟另兩批不同**：Freeman 批與合併寫「showed only the experimental group to be more effective」／「outperform」，2015–2022 批寫「more effective … in some way」（L495）。三個數字的算法相同（顯著偏實驗、不顯著偏實驗、沒統計偏實驗、兩者的組合），我用 Table 1 重算過：106+8 = 114／176 = 64.8%、50+4 = 54／84 = 64.3%、156+12 = 168／260 = 64.6%。也就是說這三個「約 65%」**把沒做推論統計與不顯著的文章都算進去了**；只算統計顯著的話是 29.5%／39.3%／32.7%（另有 1 與 3、1 與 6 等組合代碼）。

## 與清單「要撐的結論」不合的地方

清單寫的是 8-b：「這批研究的控制普遍不全；『主動學習』是用『不是講述』來定義的。」（標註：方法批評）

- **前半句撐得住，但有四個範圍限制要一起寫。**
  1. 「這批研究」是兩批：Freeman 2014 收的 176 篇，與 2015–2022 的 84 篇隨機抽樣（母群 260 篇，收錄範圍與 Freeman 不同）。
  2. 「不全」有很大一部分是**沒報告**，不是**已知有缺失**。流失、劑量是否相等、流失差異這三項的「未說明」都在 57%–65%（合併）；真正編成「有問題」的是 13.8%、11.2%、15.8%。寫成「多數研究有某某缺失」會說過頭。
  3. 本文**沒有分析效果量**，沒有證明主動學習的效果是假的或被高估，結論句用的是「it is possible」（D10）。也沒有檢驗控制越差效果越大。不能拿這篇說「Freeman 的半個標準差不可信」，只能說「內部效度的控制多半沒做或沒交代，因果歸因的把握打折」。
  4. 作者自己說達標項數少不代表研究弱、嚴重度要逐篇看（D8），也承認全部達標不切實際（D9）。
- **「只有零篇全達標」這個最常被引的數字要帶條件**：靠的是實施忠實度那一項（93% 沒做）。寬鬆算法下有 5 篇。
- **後半句撐得住，而且原文有直接的句子**（D1，L651–652）。要注意兩點：這是討論段的論述，引的是 Lombardi 等 2021，不是本文編碼出來的結果；本文自己的數據能撐的相鄰說法是 B11——**45.4% 的文章完全沒有給控制組（講述）操作型定義**，實驗組沒給的只有 8.1%。「講述是什麼」比「主動學習是什麼」更沒人交代，這一點清單的句子沒寫到，而且比轉引 Lombardi 更直接。
- **清單 8#1 那一列提到 8-b 裡「只有 16 個隨機分派」**（那是 Freeman 那一列的事，不是我這批的來源）。供對照：本文對 Freeman 那批的編碼是 **18 篇文章**（10.2%）用隨機分派設計，另有 1 篇是兩校各用一種設計。單位是文章不是研究，而且只涵蓋 176 篇，跟 Freeman 自己以研究為單位算的數字不能直接比。兩個數字哪個該用，要等讀 Freeman 的那一批回報。

## 讀取紀錄

讀本：`martella2023_springer_pdf_folded.txt`，依序、首尾相接：

| 段 | 行號 | 內容 |
|---|---|---|
| 1 | L1–230 | 首頁、摘要、導言、方法（檢索、納入標準、篩選、編碼項目定義前半）、Table 1 |
| 2 | L230–469 | Table 1 末段、Table 2 全表、編碼項目定義後半、兩批的編碼程序與一致性、資料分析、Freeman 批結果全部 |
| 3 | L469–679 | 2015–2022 批結果全部、合併結果全部、討論開頭 |
| 4 | L679–873 | 討論逐項、Final Note、六條限制、Moving Forward、結論、經費、資料可得性、利益聲明、授權 |
| 5 | L873–1019 | 參考文獻：只掃過（每行看前 150 字元），沒有逐條讀 |
| 6 | L1020–1036 | 參考文獻末兩條、出版者註記、作者單位 |

圖表核對：

- **Table 1、Table 2**：我手上沒有能直接看的 PDF 版面（Springer PDF 直連被擋，OCR 服務額度用完）。改用兩種方式核對：(1) 把兩張表每一個區塊的三欄數字逐格抄出來加總，23 個區塊三欄全部等於 176／84／260，而且每一列「Freeman + 抽樣 = 合併」全部成立；(2) 正文結果段（L357–646）幾乎把表裡每個百分比重述一次，逐項對過與表相符。**所以數字沒有錯位，但這不是「對過 PDF 版面」**，照實註記。
- **Fig. 1、Fig. 2**：直接看出版者的圖檔。Fig. 1 的數字不一致已記在上面第 8 點；Fig. 2 沒有標數值，只能讀大概高度。
- **線上補充資料**：沒有取得，沒讀。正文沒有引用補充資料裡的任何表或數字，只在 L120 提到檢索策略放在 OSF。

沒讀的檔：清單原列的 `martella2023.md`。我讀了它的前 150 行（導言，與 PDF 版逐句相同），並確認它缺摘要、缺兩張表的內容；其餘沒有再讀一遍。
