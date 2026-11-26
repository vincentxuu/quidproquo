# 抽取紀錄：Freeman 等 2014，〈Active learning increases student performance in science, engineering, and mathematics〉

**書目**：Scott Freeman、Sarah L. Eddy、Miles McDonough、Michelle K. Smith、Nnadozie Okoroafor、Hannah Jordt、Mary Pat Wenderoth（2014）。Active learning increases student performance in science, engineering, and mathematics. *Proceedings of the National Academy of Sciences*, 111(23), 8410–8415. DOI 10.1073/pnas.1319030111。

作者全名對過刊出版 PDF 首頁。前六位除 Smith（University of Maine）外都在 University of Washington 生物系。編輯 Bruce Alberts；腳註標「Direct Submission article had a prearranged editor」。利益衝突聲明：無。

**原文檔**（都在 `.research/raw/learning-content/q3-activity/`）：
- `freeman2014.md`：正文，PMC 頁面轉的 markdown，253 行、64,038 位元組（清單記 63,815 字元）。沒有作者欄，圖只有連結。
- 本次重抓（清單標「SI 不在手上」）：`freeman2014_main.pdf`（刊出版 6 頁）、`freeman2014_SI.pdf`（8 頁）與 `freeman2014_SI.txt`（不帶 `-layout` 的 pdftotext，1,029 行、66,815 字元）、`freeman2014_st01.docx`–`st04.docx`（Table S1–S4）、`freeman2014_sfig01.pdf`–`sfig05.pdf`（Fig. S1–S5）。
- 重抓來源：PMC 的檔案（PMC4060654），PMC 現行網址有瀏覽器驗證擋 curl，改取 Wayback 存的 PMC 原檔，例如 `http://web.archive.org/web/20220808142829id_/http://www.ncbi.nlm.nih.gov/pmc/articles/PMC4060654/bin/1319030111_pnas.201319030SI.pdf`；其餘檔同一路徑規則（`/pdf/pnas.201319030.pdf`、`/bin/1319030111_pnas.1319030111.st0N.docx`、`.sfig0N.pdf`）。

**讀取日期**：2026-10-14
**版本**：刊出版（PMC 全文與出版社 PDF）
**供哪幾篇使用**：order 8（清單 B 8#1，結論 8-a；8-b 的「只有 16 個隨機分派」）

行號：「L」是 `freeman2014.md`；「SI L」是 `freeman2014_SI.txt`。

## 研究設計

- **類型**：統合分析，隨機效果模型，Comprehensive Meta-Analysis 軟體（L160–162）。
- **問題**：大學 STEM 課堂上，有主動學習的班與傳統講述的班，考試成績與不及格率差多少（L22–24）。只看**上課時段**的設計，不含實驗課、作業與課外活動（L22；SI L50–56）。
- **主動學習的定義**（L111–113）：請美加各大學生物系主動學習講座的 338 位聽眾在演講前寫下定義，編碼後得出共識定義：「Active learning engages students in the process of learning through activities and/or discussion in class, as opposed to passively listening to an expert. It emphasizes higher-order thinking and often involves group work.」
- **講述的定義**（L115）：依 Bligh，「continuous exposition by the teacher」；學生的活動假定只有抄筆記與偶爾主動發問。
- **檢索**（L119；SI L17–44）：
  - 手動翻 55 本 STEM 教育期刊 1998-06-01 到 2010-01-01 每一期的篇名（期刊清單在 Table S3；SI L23 誤寫成 Table S4）。
  - 七個資料庫：Web of Science、Expanded Academic Index、PubMed、ERIC、Compendex、ProQuest Science、ProQuest Dissertations and Theses；檢索詞列在 SI L30–35。
  - 33 份書目、回顧與統合分析的引用清單。
  - 從已編碼論文的參考文獻滾雪球。
  - 沒有起始年限，截止為 2010-01-01 前完成或發表。含學位論文與研討會論文；**沒有**向研究者索取未發表研究，不收只有摘要的研討會紀錄（SI L43–44）。
- **納入五條件**（L123）：(i) 傳統講述對上任一種主動學習介入，兩者每週上課總時數相差不超過 30 分鐘；(ii) 正規排課的大學部課程；(iii) 改動大致只限於上課或習題課的進行方式；(iv) 天文、生物、化學、資訊、工程、地質、數學、自然資源或環境科學、營養或食品科學、物理、心理、統計之一；(v) 有學業表現資料。條件在研究開始時訂定，之後沒改。
- **另外的品質門檻**：考試等值（兩組考題相同、或由不知假說的第三方判定等值、或由共同題庫隨機抽題；L139）。只說「考題相似」卻沒有資料的研究一律排除（SI L68–71）。只報不及格率的研究**不要求**考試等值（L170）。講述班在先備能力指標上顯著較差的研究也排除（SI L86–89）。
- **流程數字**：檢索得 642 篇 → 第一位編碼者（S.F.）判 244 篇為「easy rejects」→ 其餘 398 篇由兩人各自編碼後開會取得共識（L127–133）。244 篇裡抽 23 篇給第二位編碼者，22 篇（96%）同樣判排除（SI L57–64）。91 篇兩位編碼者都認為可收但缺算效果量的資料；寫信索取，4 週內沒回就剔除，最後補到 19 篇（SI L162–168）。
- **最後的資料**：158 個有考試成績的獨立比較、67 個有不及格率的獨立比較（L152）。摘要與正文說的「225 studies」是這兩個數相加，單位是獨立比較，不是論文篇數；SI 參考文獻裡被分析的論文編號是 49–234，共 186 筆。
- **受試者**：沒有報總人數。只給不及格率資料裡講述組共 29,300 名學生（L99）。地點沒有統計；課程是大學部正規課。
- **介入**（L22、L125）：種類與強度差很多，包括偶爾的小組解題、課堂學習單或 tutorial、clicker（有或沒有同儕教學）、PBL、studio／workshop 課程；占課堂時間 10% 到 100%。作者明說這份研究估的是「any active learning type and intensity」對傳統講述的平均效果。
- **量了什麼**：(i) 相同或正式等值的考試、概念量表或其他評量的分數，效果量用 Hedges' g；(ii) 不及格率，多數是 D、F 或退選的比例（DFW），效果量用對數勝算，再換成勝算比或風險比（L22、L164）。何時量：隨各研究，多為期中、期末或課程結束時的概念量表，沒有延宕測驗的分析。
- **設計類型與叢集修正**（L158）：資料來自兩種研究，一種是每位學生隨機分派，一種是「quasirandom」，學生自己選班、選課時不知道是哪種教法。後者是整班接受處理，樣本不獨立，作者用 Hedges 的方法做叢集修正；沒有任何納入研究報告組內相關係數，也查不到大學 STEM 課的數值，所以借用 K–12 數學成就的平均值 0.22。作者說修正對變異數影響大、對點估計影響不大。
- **一篇多筆的處理**：同一門課的多個對照或實驗班合併成一組比較；同一批學生的多個等值成果合併成一個效果量，相關係數設為 1（保守）；28% 的研究屬於合併多個成果（SI L216–240）。
- **學科合併**：天文併入物理、統計併入數學、自然資源與營養併入生物（SI L212–215）。所以分析時考試成績是 8 類、不及格率是 7 類（沒有心理）。

## 結果（逐項）

### 整體

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 考試與概念量表成績 | Hedges' g = 0.47，Z = 9.781，P << 0.001，n = 158 | 至少有一些主動學習的班 vs. 傳統講述的班 | Results | L28 | 「a weighted standardized mean difference of 0.47 (Z = 9.781, P << 0.001)—meaning that on average, student performance increased by just under half a SD with active learning compared with lecturing」 |
| 2 | 不及格率 | 勝算比 1.95，Z = 10.4，P << 0.001，n = 67；相當於風險比 1.5 | 傳統講述 vs. 主動學習（方向是講述較容易不及格） | Results | L28 | 「The overall mean effect size for failure rate was an odds ratio of 1.95 (Z = 10.4, P << 0.001). This odds ratio is equivalent to a risk ratio of 1.5」 |
| 3 | 原始平均不及格率 | 主動學習 21.8%，講述 33.8%；作者稱相差「55% increase」（33.8 ÷ 21.8 ≈ 1.55，是相對值；絕對差 12 個百分點，見 Fig. 1A 圖說） | 同上 | Results；Fig. 1 | L28、L34 | 「Average failure rates were 21.8% under active learning but 33.8% under traditional lecturing—a difference that represents a 55% increase」 |
| 4 | 換算成分數 | 0.47 SD 約等於考試平均多 6%、學期成績多 0.3（4 分制）；中位數從 B− 到 B 或 B 到 B+ | 依 University of Washington 三門入門課（生物、化學、物理）的考試標準差推算 | Discussion；SI | L89；SI L241–256 | 「a change of 0.47 SDs would produce an increase of about 6% in average examination scores and would translate to a 0.3 point increase in average final grade」 |
| 5 | 換算成百分位 | 講述班第 50 百分位的學生在主動學習下會到第 68 百分位 | 假設推算 | Discussion | L86 | 「would, under active learning, move to the 68th percentile of that class」 |
| 6 | 與先前統合分析比較 | 0.47 對先前的 0.50、0.51 | Ruiz-Primo 等 2011、Springer 等 1999（STEM 部分學科） | Discussion | L79 | 「almost identical to the weighted, grand-mean effect sizes of 0.50 and 0.51 published in earlier metaanalyses」 |
| 7 | 計票 | 有報統計檢定的研究裡 94 個顯著進步、41 個沒有 | 原研究自己的檢定 | Additional Results；Table S4A | L172 | 「94 reported significant gains under active learning whereas only 41 did not」 |
| 8 | 不及格率會不會只是考題變簡單 | 11 個多數或全部考題相同的研究，平均勝算比 1.97 ± 0.36（SE） | 與全體 1.95 幾乎相同 | Additional Results | L170 | 「The average odds ratio for these 11 studies was 1.97 ± 0.36 (SE)—almost exactly the effect size calculated from the entire dataset.」 |
| 9 | 少不及格人數的推算 | 講述組 29,300 人，改用主動學習會少 3,516 人不及格；約省 350 萬美元學費 | 假設推算 | Discussion | L99 | 「the data suggest that 3,516 fewer students would have failed these STEM courses under active learning」 |

關於第 4 項：SI 給的標準差是生物 12.5、化學 17.5、物理 18（百分制）。0.47 × 12.5 ≈ 5.9、× 17.5 ≈ 8.2、× 18 ≈ 8.5，這三個乘積是我算的，原文沒有寫；「約 6%」只對得上生物那一門。

### 方法品質的異質性（Table 1，對過刊出版 PDF p.8412）

只針對考試成績資料。

| # | 類別 | n | Hedges' g | SE | 95% CI |
|---|---|---|---|---|---|
| 10 | Quasirandom，沒有學生等值的資料 | 39 | 0.467 | 0.102 | 0.268–0.666 |
| 11 | Quasirandom，用來算效果量的評量前測無顯著差異 | 51 | 0.534 | 0.089 | 0.359–0.709 |
| 12 | Quasirandom，學業能力或準備度指標無顯著差異 | 51 | 0.362 | 0.092 | 0.181–0.542 |
| 13 | **Randomized assignment or crossover design** | 16 | 0.514 | 0.098 | 0.322–0.706 |
| 14 | 教師：沒有資料或兩組教師不同 | 59 | 0.472 | 0.081 | 0.313–0.631 |
| 15 | 教師：同一位、隨機指派、或每組 3 位以上 | 99 | 0.492 | 0.071 | 0.347–0.580 |

- 學生等值四類之間無異質性：Q = 2.097，df = 3，P = 0.553；教師兩類之間：Q = 0.007，df = 1，P = 0.934（L58）。原文：「Experiments where students were assigned to treatments at random produced results that were indistinguishable from three types of quasirandomized designs」。作者的結論是整體效果量對方法嚴謹度的差異是穩健的。
- 四類 n 加起來是 157 不是 158：有一個研究合併了兩個成果、兩個成果的學生控制方式不同，無法歸類（SI L113–120）。
- 第 13 類含**交叉設計**（同一批學生在同一門課裡兩種教法都上過；SI L110–112），不全是隨機分派。
- 第 15 列的信賴區間印成 0.347–0.580，以 g = 0.492、SE = 0.071 算應約為 0.353–0.631；PDF 與 PMC 都這樣印，疑為原表誤植，引用這一列的區間前要注意。
- **不及格率資料沒有隨機設計**（L96）：「Any analogy with biomedical trials is qualified, however, by the lack of randomized designs in studies that included data on failure rates.」Table S4B 也沒有學生等值或教師控制的欄位。
- Table S4A 的 Studnt 欄我逐列計數是 QRno 37、QRpre 52、QRacad 51、Rand 18（共 158），與 Table 1 的 39／51／51／16 不一致。原因原文沒說明，我不確定哪個對；引用以 Table 1 為準並註明。

### 其他異質性分析（正文與 Table S1、S2，docx 逐格讀出）

**考試成績（Table S1；附註：n 加總可能不到 158，因為缺資料）**

| # | 分組 | n | g | SE | 95% CI | 組間檢定 |
|---|---|---|---|---|---|---|
| 16 | 生物 | 33 | 0.303 | 0.110 | 0.086–0.519 | 學科：正文寫 Q = 910.537，df = 7，P = 0.160（L36） |
| 17 | 化學 | 22 | 0.388 | 0.137 | 0.120–0.656 | |
| 18 | 資訊 | 8 | 0.312 | 0.247 | −0.172–0.797（含 0） | |
| 19 | 工程 | 19 | 0.481 | 0.146 | 0.195–0.767 | |
| 20 | 地質 | 2 | 0.515 | 0.491 | −0.448–1.477（含 0） | |
| 21 | 數學 | 29 | 0.340 | 0.120 | 0.105–0.575 | |
| 22 | 物理 | 31 | 0.719 | 0.107 | 0.509–0.928 | |
| 23 | 心理 | 14 | 0.606 | 0.147 | 0.319–0.894 | |
| 24 | 概念量表 | 22 | 0.883 | 0.127 | 0.635–1.132 | 評量類型：Q = 10.731，df = 1，P << 0.001（L44） |
| 25 | 課程考試（教師自編） | 109 | 0.441 | 0.057 | 0.315–0.539 | |
| 26 | 小班（≤ 50） | 47 | 0.635 | 0.080 | 0.479–0.792 | 班級大小：Q = 6.726，df = 2，P = 0.035（L52） |
| 27 | 中班（50 < n ≤ 110） | 28 | 0.409 | 0.110 | 0.192–0.625 | |
| 28 | 大班（> 110） | 30 | 0.314 | 0.104 | 0.110–0.518 | |
| 29 | 主修生課 | 122 | 0.450 | 0.052 | 0.348–0.552 | Q = 0.045，df = 1，P = 0.883（L54），無差異 |
| 30 | 非主修生課 | 30 | 0.426 | 0.100 | 0.231–0.622 | |
| 31 | 入門課 | 116 | 0.455 | 0.054 | 0.349–0.562 | Q = 0.046，df = 1，P = 0.829（L54），無差異 |
| 32 | 高年級課 | 38 | 0.480 | 0.104 | 0.277–0.683 | |

- 第 16 項的 Q = 910.537 配 df = 7 卻得 P = 0.160，數字不相稱（PDF 與 PMC 都這樣印），疑為誤植；能引的是「學科之間無顯著差異」這個結論，不要引 Q 值。
- 班級大小的分法是編碼完成後看直方圖定的「三個自然分組」（SI L169–180；Fig. S4），不是事前訂的。158 個比較裡有 53 個沒有班級大小資料（Table S4A 我計數）。
- 作者對概念量表效果較大的解釋是假說（L44：「we hypothesize that…」），兩種評量可能測不同層次的認知技能。

**介入類型（Table S1F；只在 SI 報告）**：Q = 11.173，df = 7，P = 0.131，**無異質性**（SI L370–374）。

| # | 類型 | n | g | 95% CI |
|---|---|---|---|---|
| 33 | 個案研究 | 2 | 0.472 | −0.463–1.408（含 0） |
| 34 | Clicker | 19 | 0.507 | 0.249–0.765 |
| 35 | 互動示範 | 2 | 0.389 | −0.536–1.313（含 0） |
| 36 | 組合設計 | 18 | 0.702 | 0.420–0.985 |
| 37 | PBL | 9 | 0.156 | −0.215–0.526（含 0） |
| 38 | 小考（取代講述時間） | 5 | 0.361 | −0.115–0.837（含 0） |
| 39 | Studio／workshop | 9 | 0.772 | 0.435–1.109 |
| 40 | 學習單（合作小組解題） | 90 | 0.364 | 0.240–0.487 |

作者自己說這張表只是為了呼籲後續研究：樣本很不平衡；158 個裡 90 個被歸成「worksheets」，只因作者寫的是「cooperative in-class exercises」「group problem solving」「in-class tutorials」；編碼不精確，因為「at present there is no consensus about what various active learning types actually entail in practice」；原研究很少交代強度、時間長度、題目層次、分組方式、是否計分（SI L375–400）。

**不及格率（Table S2）**

| # | 分組 | n | 勝算比 | 95% CI | 檢定 |
|---|---|---|---|---|---|
| 41 | 生物 | 7 | 2.674 | 1.623–4.406 | 學科：Q = 11.73，df = 6，P = 0.068（L36） |
| 42 | 化學 | 14 | 2.149 | 1.834–2.519 | |
| 43 | 資訊 | 7 | 2.270 | 1.548–3.327 | |
| 44 | 工程 | 12 | 1.706 | 1.271–2.290 | |
| 45 | 地質 | 2 | 1.690 | 1.275–2.240 | |
| 46 | 數學 | 15 | 1.474 | 1.191–1.824 | |
| 47 | 物理 | 10 | 2.071 | 1.333–3.219 | |
| 48 | 指標：DFW | 28 | 1.997 | 1.631–2.445 | 指標類型：Q = 27.60，df = 7，P < 0.0001，**有異質性**（SI L406–409） |
| 49 | 指標：DF | 13 | 2.226 | 1.862–2.661 | |
| 50 | 指標：只算退選 | 14 | 1.879 | 1.430–2.470 | |
| 51 | 指標：FW | 4 | 1.193 | 0.991–1.437（含 1） | |
| 52 | 小班 | 17 | 2.518 | 1.982–3.200 | 班級大小：Q = 5.91，df = 2，P = 0.052（SI L418） |
| 53 | 中班 | 12 | 1.997 | 1.237–2.194 | |
| 54 | 大班 | 13 | 1.879 | 1.592–2.204 | |
| 55 | 入門課 | 44 | 1.994 | 1.732–2.296 | Q = 0.71，df = 1，P = 0.40（SI L422–424） |
| 56 | 高年級課 | 17 | 1.762 | 1.372–2.263 | |

其餘指標類別（F、升二年級、升三年級、進入後續課程）n 各為 1–3，不另列。第 53 列的點估計不在區間正中，照原表抄。

### 發表偏誤與敏感度分析

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 57 | 考試成績的漏斗圖**不對稱** | Kendall's tau 0.11，單尾 P = 0.02；Egger 截距 0.55，單尾 P = 0.00032 | SI L295–303 | 「both nonparametric and parametric tests indicate a statistically significant association between effect size and SE for the examination score data」 |
| 58 | 不及格率的漏斗圖對稱 | Kendall's tau 0.14，單尾 P = 0.10；Egger 截距 −0.43，單尾 P = 0.37 | SI L303–305 | 「no association for the failure rate data」 |
| 59 | Trim and fill 之後 | 考試成績 0.47（95% CI 0.37–0.56）；不及格率勝算比 1.94（1.71–2.20） | SI L306–313 | 「the degree of asymmetry observed in this study has virtually no impact on the estimates of mean overall effect size」 |
| 60 | Fail-safe N（Orwin） | 考試成績 114 個、不及格率 438 個效果為 0 的研究，才會把效果量降到 0.20 與勝算比 1.1 | L56；SI L316–326 | 「The fail-safe numbers were high: 114 studies on examination performance and 438 studies on failure rate」 |
| 61 | 去掉離群值 | 四分位距 0.59，下界 −0.76、上界 1.60；2 個低於下界、10 個高於上界；去掉 12 個後 g = 0.45（95% CI 0.38–0.51） | SI L331–342 | 「we recalculated the overall effect size with the 12 studies removed and found that it was 0.45」 |
| 62 | 離群值的特徵 | 兩個低值都是 PBL 且樣本極小（共 16 人與 25 人）；高值研究的主動學習占課堂時間 25%（1 個）、33%（1 個）、100%（7 個），1 個缺資料 | SI L343–355 | 「One unifying feature of these high-effect-size studies appeared to be the high intensity of the active learning component.」 |
| 63 | 不及格率逐一剔除 | 67 次重算，整體對數勝算在 1.49–1.60，平均 1.55（原文如此） | SI L356–364 | 「no one study had a disproportionate impact on the overall estimate」 |

第 63 項的數字若真是對數勝算，exp(1.55) ≈ 4.7，與整體勝算比 1.95 對不上；較可能是勝算比的筆誤，但原文沒有更正，我不確定，照抄並標記。

### 我從 Table S4 自己數的（原文沒有寫，引用時要說是從附表計數）

- 158 個考試成績比較裡，22 個的 Hedges' g 是負的；g 範圍 −1.152 到 3.722，中位數 0.364。
- 叢集修正後，158 個裡只有 23 個個別研究的 p < 0.05（Table S4A 的 p-value 欄）。這與第 7 項「94 個原研究自報顯著」不衝突：一個是修正後的檢定，一個是原作者未修正的檢定。
- 67 個不及格率比較裡，5 個勝算比小於 1（主動學習班不及格較多）；範圍 0.35 到 9.735。
- Table S4A 我只做了計數並讀了 Rand 的 18 列，沒有逐列讀完 158 列。

## 作者自己列的限制

1. 0.47 可能**低估**：主動學習班退選較少，留下的弱學生會拉低平均（L81；SI L413–417）。
2. 不確定普及後還有沒有這麼大的效果：做主動學習的教師都是自願者（L81：「The instructors who implemented active learning in these studies did so as volunteers. It is an open question whether student performance would increase as much if all faculty were required to implement active learning approaches.」）。
3. 無法評估主動學習的強度或類型與成績的關係，因為資料不足（L103）。
4. 不及格率的研究缺乏隨機設計（L96）。
5. 不及格指標有異質性，其中五類樣本極小；建議以後只用 DFW（SI L406–412）。
6. 介入類型的編碼不精確，沒有可靠的分類法（SI L375–400）。
7. 叢集修正用的組內相關係數借自 K–12 數學（L158）。
8. 作者把這批研究稱為「first-generation」，並說往後不宜再拿傳統講述當對照，應改做比較不同主動學習做法的「second-generation research」（L103）。

作者沒列但讀得出來的範圍限制：只含 STEM 與心理學課；只含上課時段的改動；兩組上課時數要求相近（差距不超過每週 30 分鐘），但沒有控制學生課外投入的時間；沒有延宕測驗；檢索截止於 2010-01-01。

## 與摘要說法不一致的地方

1. **發表偏誤**。摘要寫「Trim and fill analyses and fail-safe n calculations suggest that the results are not due to publication bias」，正文寫漏斗圖分析「also support a lack of publication bias」（L56）。SI 的實際結果是考試成績的漏斗圖**有顯著不對稱**（第 57 項），作者是依 trim and fill 後估計值沒變來下結論。摘要的句子沒有錯，但正文「漏斗圖支持沒有發表偏誤」這句比 SI 說得滿。
2. **「225 studies」**。摘要與正文都稱 225 個研究；實際是 158 + 67 個獨立比較，來自 186 篇文獻（SI 參考文獻 49–234），同一篇可以貢獻多筆，也可以同時出現在兩組資料。
3. **「hold across the STEM disciplines」**。資訊（n = 8）與地質（n = 2）的考試成績效果量信賴區間含 0（第 18、20 項）。正文的說法比較精確：有 10 個以上實驗的學科，考試成績或不及格率至少一項顯著（L36）。
4. **「robust to variation in the methodological rigor」**。這句只檢驗了考試成績資料（L58 明寫「for the examination score data」）；不及格率資料沒有做品質分組，也沒有隨機設計。
5. **學費數字**。正文寫省下超過 350 萬美元（L99），SI 同一段推算寫「The resulting estimated total of US $5,000,000」（SI L267–268）。兩個數字不一致，原文沒解釋。
6. SI 內部的指涉錯誤：SI L23 把期刊清單說成 Table S4（實為 S3）；SI L113 提「Table 1A」、SI L273 提「Fig. 4」，正文都沒有這兩個編號；Fig. S5 圖說寫考試成績漏斗圖 n = 160，分析的是 158。

其餘摘要數字（0.47、n = 158、1.95、n = 67、約 6%、1.5 倍、小班 ≤ 50 效果最大、概念量表效果較大）逐項對過，與正文及附表一致。

## 與清單「要撐的結論」不合的地方

- **8-a「大學課堂裡有主動成分的班比純講述的班好約半個標準差」**：撐得住，要加三個限定。(1) 範圍是 STEM 加心理學的大學部課程。(2) 0.47 是教師自編考試與概念量表混在一起的平均；只看教師自編考試是 0.441，概念量表是 0.883。(3) 做主動學習的教師都是自願者，作者自己說普及後能否維持是未決問題。「有主動成分」的說法與原文相符（「at least some active learning」，占課堂時間 10% 到 100%）。
- **8-b「只有 16 個隨機分派」**：數字出處是 Table 1，但這樣寫不準確，有四處要改。(1) 那一列是「Randomized assignment or crossover design」，含交叉設計。(2) 分母是 158 個考試成績比較（該分析實際用 157 個）；另外 67 個不及格率比較**沒有**隨機設計，沒有算在這 16 個裡。(3) 附表 S4 標成 Rand 的有 18 列，與 Table 1 的 16 不一致。(4) 作者拿這張表得到的結論與 8-b 的方向相反：隨機與非隨機研究的效果量沒有差別（Q = 2.097，P = 0.553），所以主張結果對方法品質穩健。要用這個數字支持「控制不全」，得同時交代作者的這個論證，並指出另外兩個更直接的數字：39 個比較完全沒有學生等值的資料，59 個沒有教師控制的資料或兩組教師不同。
- **8-b「主動學習是用『不是講述』來定義的」**：本文有直接材料。共識定義本身帶對比（「as opposed to passively listening to an expert」），納入條件 (i) 是「講述對上任一種主動學習介入」，SI 也承認各類主動學習實際上包含什麼「沒有共識」。但定義同時有正面內容（課堂上的活動或討論、強調高層次思考、常有小組合作），不是純排除式。
- 清單沒列但會影響寫法的：介入類型之間沒有顯著差異，而且 PBL、小考、個案研究、互動示範四類的區間都含 0（第 33–38 項）。寫「哪一種主動學習有效」時不能引這篇。

## 讀取紀錄

- `freeman2014.md`：L1–205 用 Read 依序讀（Significance、摘要、導言、Results、Fig. 1–3 圖說、Table 1、Discussion、Materials and Methods、Additional Results、致謝、腳註、參考文獻 1–12）；L206–253（參考文獻 13–51、Associated Data）去掉連結標記後讀完。全檔讀完。
- `freeman2014_SI.txt`：L1–861 用 Read 依序讀（SI 正文 L1–426 全讀；L428–861 是參考文獻 1–177）。L862–989 是參考文獻 178–234，**只掃過**。L985–1029（Fig. S1–S5 圖說與附檔清單）讀完。
- Table S1、S2、S3：從 docx 逐格讀出，全讀。
- Table S4：讀了欄位定義全文、兩張表的表頭與前三列、Rand 的 18 列；其餘用程式計數，**沒有逐列讀**。
- 圖：Fig. 1、2、3 看了刊出版 PDF p.8411–8412；Fig. S4、S5 看了。Fig. S1、S2、S3（逐研究的連線圖與森林圖，共 12 頁）**沒有看**，其資料在 Table S4。
- 對過 PDF 版面的表：Table 1（PDF p.8412 圖像與 `pdftotext -layout` 兩種方式都對過，六列數字與 `freeman2014.md` 一致）。正文內的 Q 值與 P 值對過 PDF p.8411。作者欄與單位對過 PDF 首頁。
