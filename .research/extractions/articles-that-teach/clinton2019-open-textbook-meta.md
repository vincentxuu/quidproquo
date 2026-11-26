# 抽取紀錄：Clinton & Khan 2019，開放教科書統合分析，AERA Open 5(3)

- **書目**：Virginia Clinton、Shafiq Khan（兩人皆 University of North Dakota）。Efficacy of Open Textbook Adoption on Learning Performance and Course Withdrawal Rates: A Meta-Analysis. *AERA Open*, July–September 2019, Vol. 5, No. 3, pp. 1–20。DOI 10.1177/2332858419872212。作者姓名與單位對過 PDF 首頁與文末「Authors」（Clinton 是助理教授、Khan 是博士生，nolayout L2467–2473）。
- **原文檔**（都在 `.research/raw/learning-content/q6-evaluate/`）：
  - `clinton2019oermeta.pdf`：20 頁。
  - `clinton2019oermeta.txt`：1,123 行、125,012 字元。`pdftotext -layout` 版，雙欄交錯，沒有用它讀。
  - `clinton2019oermeta.nolayout.txt`：2,473 行、83,287 字元。本次用不帶 `-layout` 的 `pdftotext` 重轉後存回原目錄。**下面的行號（L…）都指這個檔。** 這個版本的表格被拆成一欄一串，表格數字一律以 PDF 頁面為準。
- **讀取日期**：2026-10-14
- **版本**：刊出版（出版者 PDF，CC BY-NC 4.0）
- **供哪幾篇使用**：order 27

## 研究設計

- **類型**：統合分析，事前登記（L169「A search and analysis plan for this meta-analysis was preregistered prior to beginning this project (Clinton, 2019b).」）。納入的原始研究幾乎都是準實驗；作者在導言就說「random assignment is generally not feasible for comparing textbooks, nearly all of the research has involved quasi-experiments with varying levels of quality in terms of controlling for confounders」（L111–114）。
- **比較**：用開放教科書的課 vs 用商業教科書的課。**比的是教科書的授權與價格類型，不是同一份內容的兩種寫法。**
- **三個研究問題**（L156–166）：RQ1 學習成效；RQ2 退選率；RQ3 方法上的混淆因素是否調節 RQ1 與 RQ2 的結果。
- **納入標準**（L170–186）：比較開放與商業教科書的學習表現或退選率；有足夠統計資訊（或作者應要求提供）；英文；受試者是高等教育學生；不限發表形式，未發表資料也收。
- **檢索**（L187–224）：Scopus、DOAJ、ProQuest、PsycINFO、ERIC，2018 年 8 月；得 578 筆，去重後 461 筆，由第一作者一人篩標題摘要，97 筆進全文，全文後 20 筆相關（其中 3 筆後來因缺統計量移除）。再經郵件群組、寄信給作者、推特、Open Education Group 網站、往前往後引文搜尋、Open Education 2018 會議補充。2018 年 10 月停止。最後「a total of 22 reports with 23 independent studies (Gurung, 2017, reported two independent studies)」（L221–222）。
- **學習成效分析**：22 個研究、26 個效果量（L776–777）。Hedges' g，正值表示開放教科書較好。同一研究多個測量用 robust variance estimation（robumeta，假設相關 .8）加小樣本校正。二分變項（如是否 C 以上）由勝算比轉成標準化平均差（L247 附近）。
- **退選分析**：11 個研究，各一個勝算比；OR < 1 表示開放教科書的退選較少。隨機效果模型（R 套件 meta）。退選率只有 5 個研究在發表物裡有報告，另外 6 個是作者應要求提供的（L788–792）。
- **學習怎麼量**（Table 1，PDF 第 4–5 頁）：22 個研究裡多數是課程成績或「C 以上」；用標準化或研究者自編測驗的是 Allen 2015（化學標準化測驗的常態化增益）、Gurung 2017 兩個研究（選擇題小考）、Medley-Rath 2018（後測）。考試成績的有 Engler 2019、Hardin 2019、Hendricks 2017、Jhangiani 2018。
- **地點**：美國與加拿大，唯一例外是智利一篇（Westermann Juárez & Venegas Muggli 2017）。全部是高等教育。
- **編碼**：依 Study DIAD（Valentine & Cooper 2008）改的 11 題（附錄 B）。第一作者編碼並自己重編一次，研究助理另編 25%，κ = 0.78（L234–238）。

## 結果（逐項）

### 學習成效

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號／頁 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 整體效果 | g = 0.01，SE = 0.08，95% CI [−0.16, 0.19]，p = .87，k = 22 | 開放教科書的課 vs 商業教科書的課 | Results／Learning Efficacy | L831–834；PDF p.8 | 「there were no reliable differences in learning performance between students in courses with open textbooks compared with students in courses with commercial textbooks, g = 0.01, SE (standard error) = 0.08, 95% CI (confidence interval) = [−0.16, 0.19], p = .87」 |
| 2 | 異質性 | I² = 98.17 | 同上 | 同上 | L828–830 | 「the I2 was 98.17, which would indicate a substantial amount of heterogeneity.」 |
| 3 | 檢定力分析 | 以 d = 0.2、k = 22、高異質性算，檢定力 = 1；改用每篇人數的中位數再算仍是 1 | — | 同上 | L836–845；附錄 C 程式 L2088–2091（平均 n1 = 1178、n2 = 3785；中位數 n1 = 353、n2 = 423） | 「the power was 1—indicating a great likelihood that there was sufficient power to detect a small effect.」 |
| 4 | 等價檢定 | Z = −2.25，p = .01，等價界限 d = 0.2 | 效果是否落在 ±0.2 內 | 同上 | L846–851 | 「The equivalence test was significant, Z = −2.25, p = .01, assuming a small effect size of Cohen’s d = 0.2. An interpretation of this finding was that the main effect … was statistically equivalent to zero.」 |
| 5 | 出版偏誤 | 漏斗圖看不出偏誤；Egger 截距 β = −1.49，95% CI [−5.12, 2.13]，p = .40。用的是各研究合併後的效果量，因為 RVE 沒有經驗證的出版偏誤檢定 | — | 同上 | L852–876；Figure 3（PDF p.10） | 「Publication bias was also tested quantitatively using Egger’s test of the intercept, which did not differ significantly from zero … indicating unlikely publication bias」 |
| 6 | 離群值 | 小提琴圖顯示有離群值，兩側大致均等，全部保留 | — | 同上 | L818–826；Figure 2 | 「The effect sizes outside of the thin gray line indicate that there were outliers. However, this was approximately evenly distributed on both sides, and all effect sizes were included so as not to lose information」 |

**各研究的 g（Table 3，PDF 第 9 頁，橫排表格；另把該頁以 130 dpi 轉圖、轉正後逐列對過）**：

| 研究 | 同一位教師 | 控制先備成就 | 同一份測量 | g | SE | O／C／T |
|---|---|---|---|---|---|---|
| Allen 等 2015 | Yes | Yes | Yes | 0.02 | 0.07 | 377／348／725 |
| Basu Mallick 等 2018 | No | No | No | −0.14 | 0.02 | 4247／14474／18,721 |
| Chiorescu 2017 | Yes | No | No | 0.20 | 0.14 | 159／447／606 |
| Choi & Carpenter 2017 | Yes | No | No | −0.44 | 0.12 | 175／114／289 |
| Clinton 2018 | Yes | No | No | 0.23 | 0.09 | 204／316／520 |
| Colvard 等 2018 | Yes | No | No | 0.21 | 0.01 | 10,141／11,681／**12,692** |
| Engler & Shedlosky-Shoemaker 2019 | Yes | Yes | Yes | 0.00 | 0.28 | 24／25／49 |
| Feldstein 等 2012 | No | No | No | 0.20 | 0.05 | 1,394／2,176／3,570 |
| Grewe & Davis 2017 | No | Yes | No | 1.104 | 0.20 | 58／60／118 |
| Grissett & Huffman 2019 | Yes | No | Yes | −0.16 | 0.26 | 31／29／60 |
| Gurung 2017 Study 1 | No | Yes | Yes | −0.87 | 0.07 | 405／398／803 |
| Gurung 2017 Study 2 | No | Yes | Yes | −0.48 | 0.07 | 823／584／1,407 |
| Hardin 等 2019（合併） | No | No | Yes | 0.22（content knowledge 0.39、critical thinking 0.06） | .06 | 507／1118.5／**1575.5** |
| Hendricks 等 2017 | Yes | No | No | 0.12 | 0.05 | 755／750／1505 |
| Hilton 等 2013 | Yes | No | No | −0.09 | 0.30 | 2,043／4,164／6,207 |
| Hilton 等 2016 | No | No | No | 0.12 | 0.03 | 2,014／43,223／45,237 |
| Jhangiani 等 2018（合併） | No | Yes | Yes | 0.18（Exam 1 0.01、Exam 2 0.02、Exam 3 0.52） | 0.15 | 94／83／177 |
| Lawrence & Lester 2018 | Yes | No | No | −0.06 | 0.10 | 178／200／378 |
| Medley-Rath 2018（合併） | Yes | 後測 Yes／課程成績 No | Yes | 0.08（posttest −0.21、course grade 0.36） | 0.29 | 23／24／47 |
| Robinson 2015 | No | No | No | −.12 | .03 | 1908／1908／3816 |
| Westermann Juárez & Venegas Muggli 2017 | Yes | No | No | −.10 | .04 | 31／30／61 |
| Winitzky-Stephens & Pickavance 2017 | No | No | No | −.02 | .06 | 329／1120／1449 |
| Random model（all k = 22） | | | | .01 | .08 | 25,920／83,272.5／100,012.5 |

我自己從這張表數的（原文沒有這樣寫）：22 個研究裡 g 為正的 11 個、為零的 1 個、為負的 10 個；範圍 −0.87（Gurung Study 1）到 1.104（Grewe & Davis）。「同一位教師」Yes 12 個；「控制先備成就」Yes 6 個（Medley-Rath 只有一個測量算）；「同一份測量」Yes 8 個。

### 調節分析（只做學習成效）

| # | 結果 | 數字 | 節／表 | 行號／頁 | 原文一句 |
|---|---|---|---|---|---|
| 7 | 截距 | β = −0.03，SE 0.1，T = −0.26，df = 13.27，p = .80，CI [−0.24, 0.19] | Table 4（PDF p.10） | L1217–1244 | 表列 |
| 8 | 是否控制先備成就 | β = 0.22，SE 0.52，T = 0.43，**df = 3.54**，p = .69，CI [−1.30, 1.74] | Table 4 | 同上 | 表列 |
| 9 | 是否同一位教師 | β = −0.02，SE 0.15，T = −0.122，df = 14.81，p = .91，CI [−0.35, 0.31] | Table 4 | 同上 | 表列 |
| 10 | 是否同一份測量 | β = −0.39，SE 0.46，T = −0.83，**df = 3.34**，p = .46，CI [−1.78, 1.01] | Table 4 | 同上 | 表列 |
| 11 | 作者對 8、10 的判定 | 不能採信，結論是「不確定」 | Moderator Analyses | L1253–1255 | 「With fewer than 4 degrees of freedom, the results cannot be trusted, and therefore, it was inconclusive whether these two moderators have effects.」 |
| 12 | 作者對 9 的判定 | 不知道是真的沒差還是檢定力不足 | 同上 | L1255–1258 | 「it is uncertain whether the findings for instructor indicated that there is truly no difference or if there was simply a lack of power to detect a difference.」 |
| 13 | 沒有檢驗的調節變項 | 「是否比較同一門課」與「測量是否計入課程成績」因每類不足 6 個效果量而沒做 | 同上 | L880–886 | 「a minimum of six effect sizes per potential moderator category was required … Therefore, potential moderators such as the same course being compared and whether the learning measure was part of a course grade or only for a research study (e.g., for the studies in Gurung, 2017) were not examined.」 |

### 退選率

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號／頁 | 原文一句 |
|---|---|---|---|---|---|---|
| 14 | 整體 | OR = 0.71，k = 11，95% CI [0.56, 0.90]，p = .005；N = 78,593（O 16,209／C 62,384） | 開放教科書的課 vs 商業教科書的課 | Withdrawal Rate／Table 5（PDF p.11） | L1266–1271 | 「the withdrawal rate for students in courses with open textbooks was lower than that of students in courses with commercial textbooks; OR (odds ratio) = 0.71, k = 11, 95% CI [0.56, 0.90], p = .005」 |
| 15 | 異質性 | I² = 83.09 | 同上 | 同上 | L1264–1266 | 「the heterogeneity of effect sizes was substantial, with an I2 of 83.09」 |
| 16 | 離群值 | 分布明顯負偏；離群值的方向與主效果相反，保留 | — | 同上 | L1273–1275、L1408–1412 | 「the distribution of effect sizes was quite negatively skewed, indicating likely outliers. However, the outliers were opposite the direction of the main effect.」 |
| 17 | 沒有做出版偏誤檢查 | 過半研究的退選數字不是發表的 | — | 同上 | L1414–1419 | 「examining publication bias in a manner similar to what was done with learning efficacy … would be inappropriate given that half of the findings were not published.」 |
| 18 | 沒有做調節分析 | 每格研究數不夠 | — | Discussion | L1505–1509 | 「there should be caution with interpreting withdrawal findings because some studies compared courses with different instructors … and there were not enough studies in each cell to conduct moderator analyses.」 |

**各研究的 OR（Table 5，PDF 第 11 頁，對過版面）**：Chiorescu 2017 0.5 [0.23, 1.08] p = .08（發表）；Clinton 2018 0.36 [0.23, 0.57] p < .001（發表）；Colvard 2018 0.82 [0.73, 0.93] p = .002（作者提供；原發表的是含 D、F 的 DFW 率）；Grewe & Davis 2017 0.56 [0.25, 1.26] p = .16（作者提供）；Grissett & Huffman 2019 **3.00** [0.30, 30.35] p = .35（作者提供，O 36／C 34）；Hendricks 2017 0.75 [0.48, 1.17] p = .21（作者提供）；Hilton & Laman 2012 0.46 [0.28, 0.76] p = .002（發表）；Hilton 2013 **1.23** [1.09, 1.38] p = .001（發表，方向相反且顯著）；Hilton 2016 0.97 [0.84, 1.12] p = .68（發表）；Jhangiani 2018 0.44 [0.10, 1.89] p = .27（作者提供）；Lawrence & Lester 2018 0.51 [0.25, 1.03] p = .06（作者提供）。

我自己數的：11 個裡個別達 p < .05 且 OR < 1 的 3 個（Clinton、Colvard、Hilton & Laman），p < .05 且 OR > 1 的 1 個（Hilton 2013），其餘 7 個個別不顯著。

### 討論裡作者對「為什麼學習沒有差」給的解釋（都是推測）

1. access hypothesis 預測開放教科書應該較好，但「the findings from this meta-analysis do not provide support for this hypothesis」（L1453–1460）。
2. 免費取得可能只對少數學生有學習上的好處；舉 Colvard 2018 低收入補助資格學生受益較多；如果有社經地位資料，它可能是顯著的調節變項（L1460–1474，「It could be that if…」）。
3. 兩類教科書品質相近、取得不是問題（L1474–1478）。
4. 教師知道有學生沒買書而調整教法，「based on conjecture」（L1478–1484）。
5. **教科書類型可能本來就對學習影響很小**（L1485–1494）：「Finally, it could also be possible that the type of textbook simply has little influence on student learning. For example, one experiment comparing commercial textbooks from different publishers found no differences between types in learning from reading them (Durwin & Sherman, 2008).」另舉兩篇所有學生都拿得到商業教科書的研究（Clinton, Legerski & Rhodes 2019；Robinson 等 2014），結果是沒有差異或開放教科書小幅較好。這三篇我都沒讀，是作者轉述。

對退選：作者推測落後的學生有免費教科書可補進度（L1496–1505），但緊接著提醒要謹慎（上表第 18 項）。Hilton 2013 的反向結果，作者引原作者的說明：採用開放教科書同時改了數學分班政策（L1510–1518）。

## 作者自己列的限制

「Limitations and Future Directions」一節（L1516–1603）：

1. 只收高等教育；符合條件的 K–12 研究只知道一篇（Robinson 等 2014）（L1519–1541）。
2. 地理範圍不具代表性：美加為主，智利一篇（L1542–1553）。
3. 摘要篩選只有一個人做，可能漏掉（L1554–1563）。
4. 沒找到顯著的調節變項，但異質性很大，表示可能有；研究變多後才有檢定力（L1564–1569）。
5. 研究彼此差很多：學科、樣本數、評分標準、各校退選期限與政策都不同（L1570–1578）。
6. **退選率的差異可能讓「修完課的學生」組成不同**：退選的人通常學業背景較弱，「this could lead to student differences in the courses that cannot be accounted for in the data available for these meta-analyses」（L1579–1589）。也就是學習成效那個 g 是在修完的人身上比的，兩組留下來的人可能不一樣。
7. 閱讀媒介（紙本或螢幕）沒控制；開放教科書較可能在螢幕上讀，而另有統合分析說紙本閱讀略好（L1590–1603）。

散在別處的：導言說幾乎都是準實驗、不同教師、不同測量工具是明顯的混淆（L111–133）；兩個調節變項 df < 4 不可信（L1253–1255）；退選的出版偏誤無法評估（L1414–1419）。

## 與摘要說法不一致的地方

1. **N = 100,012 與 Table 3 的分欄加總對不上。** 摘要寫「k = 22, g = 0.01, p = .87, N = 100,012」。Table 3 末列 O = 25,920、C = 83,272.5、T = 100,012.5。我把 22 列逐一加過：O 欄合計 25,920、C 欄合計 83,272.5，兩者相加是 **109,192.5**；T 欄合計才是 100,012.5。差額來自兩列的 T 欄：Colvard 2018 印 12,692，但 10,141 + 11,681 = 21,822（Table 5 同一研究的 T 就印 21,822）；Hardin 2019 合併列印 1575.5，但 507 + 1118.5 = 1625.5。原文沒有說明，看起來是表格排印錯誤，哪個數字進了分析我無法判斷。引用人數時寫「約十萬人（表內分欄加總為 109,192）」或只寫「22 個研究」。
2. **「No significant moderators were identified」省略了正文的保留。** 正文說三個調節變項裡兩個「cannot be trusted」「inconclusive」（df < 4），第三個不知道是真的沒差還是檢定力不足（L1253–1258）；退選率根本沒做調節分析（L1505–1509），雖然 RQ3 問的是 RQ1 與 RQ2 兩者。摘要那句話是「沒檢出」，不是「檢驗過、沒有」。
3. 摘要寫「there were no differences in learning efficacy」；正文結果句是「no reliable differences」（L831），討論是「appeared to be no effect」（L1425），結論是「no meaningful differences」（L1609）。摘要沒有提 I² = 98.17，也沒有提個別研究從 −0.87 到 1.104。
4. 摘要的退選結果沒有提：11 個研究裡 6 個的數字是私下向作者要來的、沒有做出版偏誤檢查、I² = 83.09。

### 其他內部不一致（照實記錄，不猜哪個對）

- **流程圖與內文的數字對不上**（Figure 1，PDF p.7；內文 L192–224）。圖：篩 461 筆、排除 247 筆、全文 97 筆（461 − 247 = 214，不是 97）。圖列「Authors recommended (n = 2)」，內文說這一步「yielded one additional report」（L209 附近）。全文排除 80 筆，97 − 80 = 17；圖上另外來源合計 5 筆（2 + 0 + 1 + 1 + 1），17 + 5 = 22，與「22 reports」相符；照內文的 1 筆算則是 21。
- Table 1 與 Table 3 的樣本數：Gurung 2017 Study 2 開放組 Table 1 印 753、Table 3 印 823；Hendricks 2017 商業組 Table 1 印 1,492、Table 3 印 750。
- Table 2 與 Table 5：Colvard 商業組 11,691 對 11,681；Hilton 2013 商業組 4,164 對 4,168。
- Table 3 的 SE 有幾列與樣本數不相稱：Hilton 2013（N = 6,207）SE 0.30；Westermann Juárez（N = 61）SE .04。原文沒有說明，我不推測原因。
- 等價檢定：內文只報告界限 d = 0.2 的結果。附錄 C 的程式同時跑了 ±0.1 與 ±0.2 兩組界限（L2098–2103），±0.1 的結果內文沒有報告。（用程式裡的 ES = 0.0136、se = 0.0827 自己算，±0.1 的上界檢定 Z ≈ −1.04，不會顯著；這是我的計算，不是原文數字。）所以「統計上等同於零」只在 ±0.2 的界限下成立。

## 與清單『要撐的結論』不合的地方

清單寫：「開放教科書不讓人考較高（g = 0.01），退選較少」。

1. **g = 0.01 撐得住，但「考」字要改。** 22 個研究的成果測量多數是課程成績或是否 C 以上，不是考試；而且各研究用的測量在兩組之間多半不是同一份（「同一份測量」只有 8 個）。寫成「學習表現（多數是課程成績）沒有可靠差異」。
2. **要連著寫信賴區間與異質性。** CI [−0.16, 0.19]、I² = 98.17；個別研究從 −0.87 到 1.104。「沒有差」是平均上，不是每一門課都沒差。
3. **「退選較少」方向撐得住（OR = 0.71），但證據比學習那一邊弱**：11 個研究、6 個數字是向作者要來的、沒有出版偏誤檢查、沒有調節分析、有一篇顯著反向；作者自己說要謹慎。只能寫成「相關」，不能寫成開放教科書「讓」學生少退選。
4. **這篇對 order 27 的適用範圍要標明。** 它比的是「免費授權的教科書 vs 付費教科書」，兩者是不同作者寫的不同書，差別混著價格、取得、內容、教師。它沒有檢驗「把既有內容重新講一次」這件事。和 order 27 最相關的其實是討論裡那句推測——教科書類型可能本來就對學習影響很小（L1485–1488）——但那是作者列的四五種可能解釋之一，依據是他們轉述的另一篇實驗（Durwin & Sherman 2008，我沒讀），不是這份統合分析的結果。
5. 兩個結果要一起看：退選較少可能改變了留下來的人的組成（作者限制第 6 點），所以 g = 0.01 不是在可比較的兩群人身上量的。清單那一句把兩件事並列，沒有交代它們互相牽連。
6. 人數若要引用，見上一節第 1 點。

## 讀取紀錄

| 順序 | 位置（`clinton2019oermeta.nolayout.txt` 行號） | 內容 |
|---|---|---|
| 1 | L1–330 | 首頁、摘要、導言、Literature Review、研究問題、方法（納入標準、檢索、編碼、統計程序）、Table 1 被拆散的前段 |
| 2 | L330–860 | Table 1、Table 2 的拆散文字、同研究多測量的處理、RVE、勝算比、I²、Results 開頭（離群值、主效果、檢定力、等價檢定、出版偏誤前半） |
| 3 | L860–1420 | 出版偏誤後半、調節分析、Table 3 與 Table 4 的拆散文字、退選率結果、Table 5 的拆散文字 |
| 4 | L1420–1800 | Discussion 全節、Limitations and Future Directions、Conclusion、附錄 A（檢索詞）、附錄 B（編碼題目 1–9、Table B1 前段） |
| 5 | L1800–2143 | Table B1 後段、附錄 B 第 10–11 題、附錄 C（資料字典、R 程式全文）、致謝、ORCID |
| 6 | L2143–2473 | 參考文獻：掃過開頭約 40 行與結尾約 75 行（含文末作者簡介 L2467–2473），中段沒有逐筆讀 |
| 對表 | PDF 第 4–11 頁（用 Read 讀頁面影像）；第 9 頁另以 `pdftoppm -r 130` 轉圖轉正 | Table 1（p.4–5）、Table 2（p.6）、Figure 1 流程圖（p.7）、Figure 2（p.8）、Table 3（p.9，逐列對 g、SE、O、C、T 並自行加總）、Figure 3 與 Table 4（p.10）、Table 5（p.11，逐列對並自行加總：16,209／62,384／78,593 相符） |

沒對版面的：Table B1（各研究 11 題的品質編碼，PDF 第 15 頁）。只讀了拆散的文字版，欄位對齊不可靠，所以上面沒有引用它的任何一格。Figure 4（退選率小提琴圖，PDF 第 12 頁）沒有看圖，只讀了內文描述。

沒讀的：納入的 22 篇原始研究、Clinton 2019b 的事前登記文件、Durwin & Sherman 2008。
