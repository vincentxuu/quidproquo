# 抽查結果：第 17 組（`batch2-files.txt` 第 13–24 行，共 12 份）

抽查日期：2026-10-14。抽查者沒有參與精讀。

**抽樣方法**：`python3 -I`，`random.seed(檔名)`，母體是「## 結果（逐項）」到下一個 `## ` 之間、帶數字的表格列與條列。判斷「帶數字」前先去掉列首編號、行號（L123）、頁碼、表／圖編號、年份，避免只因引用行號就入選。`random.sample(母體, 3)`，抽到什麼查什麼，沒有換。Kirschner 2018 是理論文，去掉行號與年份後母體為 0，改用未過濾的同一種子抽三條（都是帶行號的引文），只核對引文與行號。

**表格的核對方式**：抽到表格數字的，除了對原文 `.txt`／`.md`，另把 PDF 該頁轉成圖（`pdftoppm`）直接看版面；沒有本機 PDF 的，改對出版者的表格頁（Karp Gershon 2021 的 SpringerOpen 表格頁、Kizilcec 2017 的 PMC 表格頁、Kobayashi 2019 meta 的 Wiley 文章頁表格）。

**讀取涵蓋**：起訖區間與 `wc -l`／`wc -c` 對照。

| 檔名 | 三個抽到的條目與核對結果 | 讀取涵蓋 | 來源版本 | 判定 |
|---|---|---|---|---|
| davis2018-activating-learning.md | (1) Cooperative Learning 17 篇、17/6/1、71%：Table 2 L170、Table 9 標頭「+: 17 / ∘ : 6 / -: 1」、L900「71%」，17/24 = 70.8%，對。(2) Cho & Lee 2013，N = 120、Env Class、Incentive None、−Engagement ∘Learning Gain：PDF 第 13 頁 Table 9 續表看圖對過；L1051–1054 正文敘述對。(3) Questioning 9 篇、7/7/0、50%：Table 2 與 Table 5 標頭「+: 7 / ∘ : 7」（L548 附近），對。 | L1–1817 首尾相接，`wc -l` 1,817，涵蓋全文；參考文獻掃過，聲明無附錄。 | TU Delft 機構典藏的刊出版（Taverne 計畫，作者機構依荷蘭著作權法公開），合法。 | 通過 |
| delrio-chanona2024-so-llm.md | (1)「25%」出處 L73：原句「stabilizes at around 25%」對（原文在 ChatGPT 後有註腳記號 f，紀錄省略）；L74 Fig. 2 圖說「Eight weeks after its introduction…」對。(2) 週發文量 11 萬→6 萬、「7,000k」筆誤、6 個月內 6 萬→4 萬、「more than 5 years worth of deceleration」：L51、L44 圖說「about 7,000 posts each year」都對。(3) Experienced −0.254（SE 0.0424），p < .001：PDF 第 7 頁 Table 2 看圖對過（−0.254***、(0.0424)）。 | L1–120、L121–244，`wc -l` 243，涵蓋全文；補充資料 S1–S8 聲明未取。 | PMC 刊出版（CC BY 4.0）；對表用的 PDF 是 OUP 排版版，取自匈牙利科學院 REAL 典藏（頁側有「Institute of Economics Budapest user」下載浮水印）。CC BY 允許轉載，合法；只是 PDF 不是出版者直接提供的檔。 | 通過 |
| gao2022-argumentative-scaffolding.md | (1) 自評全面理解 4.13 vs 3.84，t(62) = 2.10，p < .05，d = 0.54：L720–721 對，PDF 第 6 頁圖中正文對。(2) 第一階段問答 3.31 ± 4.45 vs 8.00 ± 6.54，t(30) = −2.37，d = −0.84：L556–558 與 PDF 第 6 頁 Table 2 看圖對過。(3) 陳述觀點 3.13 ± 1.89 vs 6.88 ± 3.65，t(30) = −3.65，p < .01，d = −1.29：L553–555 與 Table 2 看圖對過。 | 三段 1–400、400–820、820–1317，`wc -l` 1,317，涵蓋全文（含附錄問卷）。 | Frontiers 出版者 PDF，CC BY 開放取用，合法。 | 通過 |
| gillani2014-structural-limits.md | (1) 被濾掉的邊比例（Technical Feedback 兩期 89%、Cases 44%／39%、Study Groups 72%／71%、Final Project 46%／52%、FOBS-2 Readings 93%）：L35–42 與出版者 PDF 第 3 頁 Table 2 看圖逐格對過。(2) Study Groups「more than 2 out of 3 connections … insignificant」與 Facebook 一句：L43 對。(3) FOBS-2「8% of students' final scores … upvotes」：L47 對。 | L1–127 首尾相接，`wc -l` 127，涵蓋全文；補充資訊聲明未取，arXiv 預印本聲明未讀。 | PMC 與 Nature 出版者 PDF，CC BY-NC-SA 4.0，合法。 | 通過 |
| guo2025-udl-fidelity.md | (1) 英語學習者高忠實度 +39.7%、低 +14.6%：L190 原句對。(2) 中學後機構約 12 個月後持平：L182 原句對。(3) 領導承諾強者達高忠實度可能性 3.2 倍：L202 原句對。三條都是正文數字（全文無表格），圖只核了正文敘述。 | L1–120、121–240、241–360，`wc -l` 359，涵蓋全文。 | PMC 刊出版（CC BY-NC-ND 4.0），合法。 | 通過 |
| honma2022-smartphone-sigh.md | (1) 閱讀分數媒介主效果 F(1,32) = 26.445，P < 0.0001：原句對。(2) 潮氣容積 F(2,67) = 8.821、吸氣 8.639、呼氣 6.212、呼吸頻率 5.3622，全部 P < 0.0001，媒介無效果：原句對。(3) 嘆息次數 媒介 F = 26.623、時段 6.530、交互作用 F(2,134) = 9.169：原句對。**定位瑕疵**：紀錄標的字元位置偏前約 1,400–1,800 字元（#1 標「約 6,700–7,000」，實際在 8,367；#6、#7 標「約 7,000–8,000」，實際在 9,046–9,846）。數字、條件、所在節與原句都對，只是位置標錯。 | 字元 0–38,294 首尾相接，檔案 38,294 字元，涵蓋全文；補充材料聲明未取。 | PMC 刊出版（CC BY 4.0），合法。 | 通過（字元位置標錯，建議修正） |
| karpgershon2021-english-hdi-bias.md | (1) 3.MatSelx 評量偏差：已開發 0.033、開發中 −0.461、t(37.38) = 2.388、p = .022、n 152／41：出版者 Table 4 表格頁對；L556 原句「0.03−(−0.46) = 0.49」對。(2) 六門課完課 OR（1.684、1.442、1.248、1.207、1.097、1.114 與 p 值）：Table 4 表格頁逐格對。(3) RQ2 示例課次 OR 1.11、高 HDI 117／1,252（1,369）、低 HDI 64／763（827）：Table 3 表格頁對，L512 原句對，L507 確認只含非母語者。 | L1–240、241–476、477–676 依序，677–860 參考文獻掃過，861–1023 讀過，`wc -l` 1,023，涵蓋全文。 | SpringerOpen 出版者文章頁與表格頁（CC BY 4.0），經 Jina 轉文字，合法。表格沒對 PDF 版面（紀錄已聲明），對的是出版者表格頁，符合抽查說明。 | 通過 |
| kirschner2018-cclt.md | 結果節沒有帶數字的條目（理論文），改抽三條引文：(1) L45「A recent meta-analysis provides evidence that CSCL scripts substantially improve…（Vogel et al. 2016）」對。(2) L9「At best, one can say that its purported benefits are not always consistent…」對。(3) L89「This decision could very well be to not use collaborative learning.」對。 | L1–320 首尾相接，`wc -l` 320，涵蓋全文。 | PMC 刊出版（Springer 以 CC BY 4.0 存入），合法。取得網址是推定（紀錄已聲明）。 | 通過（無數字可抽，只核引文） |
| kizilcec2017-pnas-mcii-culture.md | (1) Table 1 N（國家數）3,112（85）、6,507（86）、2,123（81）、2,082（79）、1,972（78）、2,167（78）：PMC 表格頁存檔逐格對。(2) 問卷「if–then plans oversimplify」t(192) = 3.12，P = 0.002，d = 0.45：L180 對。(3) 集體與平衡國家無效果，實驗 1 \|b\| < 0.004、\|z\| < 0.38、P > 0.70；實驗 2 \|b\| < 0.023、\|z\| < 0.67、P > 0.51：L216 對。 | L1–662 首尾相接，`wc -l` 662，涵蓋全文（含 SI）。 | PMC 刊出版，合法。PDF 被 reCAPTCHA 擋，表格對的是 PMC 表格頁（紀錄已聲明）。 | 通過 |
| kobayashi2019-interactivity.md | (1)「only two experimental studies」：L31 對。(2) 三組差異 QB(2) = 118.79，p < .001：L32、Table 2 對。(3) 預期直接教並直接教 g = 0.84 [0.75, 0.93]，k = 4，Qw = 44.29***：L41 與出版者 PDF 第 3 頁 Table 2 看圖對過（紀錄當初只對 `-layout` 文字，這次補看了版面，一致）。 | L1–180，`wc -l` 179，涵蓋全文。 | Frontiers 出版者 PDF（CC BY），合法。 | 通過 |
| kobayashi2019-japanese-students.md | (1) 日本學生 vs 其他 QB = 7.63，p < .01：PDF 第 98 頁 Table 2 看圖對（7.63**）。(2) 排除日本學生後直接 g = 0.57 [0.40, 0.73]、Qw 18.91；間接 g = 0.31 [0.16, 0.45]、Qw 31.91、p < .005；QB = 4.90，p < .05：p. 98–99 正文看圖對。(3) 日本學生 g = 0.09，[−0.11, 0.29]，k = 6，Qw = 7.80：Table 2 看圖對。 | L1–150 首尾相接，`wc -l` 150，涵蓋全文。 | 靜岡大學機構典藏的紀要 PDF（出版者即該校），合法。 | 通過 |
| kobayashi2019-meta.md | (1) #14 對 #15 的差 QB(1) = 6.51，p < .05：L186 正文與 L189 Table 4 對。(2) 預期寫解釋或錄影 g = 0.27 [0.17, 0.37]，k = 18，QW = 74.39***：Table 4（L190）對。(3) 預期加實際教 g = 0.56 [0.52, 0.61]，k = 16，Q = 206.35，I² = 93%：L158 正文與 Table 3（L171）對。表格對的是 Wiley 文章頁表格（出版者 HTML）與 Firecrawl 的 PDF 解析檔，沒有看 PDF 版面（curl 403）。附帶確認：本文 Table 4 是互動 39.12、非互動 74.39；Perspective（interactivity）Table 2 把兩個 Qw 對調，`kobayashi2019-interactivity.md` 已記錄這個不一致。 | L1–273，`wc -l` 272，涵蓋全檔；參考文獻不在原文檔，紀錄已聲明。 | Wiley 出版者文章頁（Free Access；Unpaywall 列 bronze、publisher），合法。 | 通過 |

## 小結

- 12 份全部通過，沒有數字對不上。
- 要修的瑕疵：`honma2022-smartphone-sigh.md` 結果表的字元位置整批偏前約 1,400–1,800 字元，數字本身正確。
- 來源版本都合法。只有一處要留意：`delrio-chanona2024-so-llm.md` 的對表 PDF 取自 REAL（匈牙利科學院）典藏，不是出版者直接提供的檔；文章是 CC BY，所以轉載合法。
- 版面核對的範圍：Karp Gershon、Kizilcec、Kobayashi meta 三份沒有本機 PDF，表格對的是出版者／PMC 的表格頁，紀錄都有聲明。
