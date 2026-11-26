# 抽取紀錄：Prinz、Golke、Wittwer 2020，Educational Psychology Review 32(4)

## 檔頭

- **書目**：Anja Prinz、Stefanie Golke、Jörg Wittwer（2020）。To What Extent Do Situation-Model-Approach Interventions Improve Relative Metacomprehension Accuracy? Meta-Analytic Insights. *Educational Psychology Review*, 32(4), 917–949。DOI 10.1007/s10648-020-09558-6。線上刊出 2020-10-14。三位作者都在 University of Freiburg 教育科學系；作者姓名對過刊出版首頁與 Crossref。CC BY 4.0 開放取用。
- **原文檔**：
  - `.research/raw/learning-content/q1-learner/prinz2020sma.txt`，570 行、103,076 位元組。jina 轉的 Springer 網頁版，一行一段。**這個檔不完整**：沒有摘要、十張表全部只剩「Full size table」、四個註腳的內文都不在。
  - 本次補抓：`.research/raw/learning-content/q1-learner/prinz2020sma_springer.pdf`（33 頁，期刊頁碼 917–949）與 `prinz2020sma_springer.txt`（不帶 `-layout` 的 pdftotext，2,513 行）。來源是 Wayback 對出版社開放取用 PDF 的存檔：`https://web.archive.org/web/20210429101426id_/https://link.springer.com/content/pdf/10.1007/s10648-020-09558-6.pdf`。直接向 link.springer.com 要 PDF 與表格頁，curl 都只拿到 3,038 位元組的 cookie 頁。
  - `q4-time/prinz2020-metacomprehension-meta.md` 是同一篇的另一次下載，沒有讀。
- **版本**：刊出版（version of record）。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 15。

行號寫 `prinz2020sma.txt` 的行號（L）；表、註腳、摘要寫期刊頁碼（p.）。

## 研究設計

- **類型**：統合分析，隨機效果模型，Comprehensive Meta-Analysis 軟體，效果量 Hedges' g（L142–150）。
- **量的是什麼**：相對後設理解準確度，即每位受試者跨多篇文本的「預測」與「測驗成績」的個人內相關，以 Gamma 為主、盡量避開 Pearson（L130）。另外編了理解成績（各人跨測驗的平均表現）當第二個結果（L132）。
- **研究池從哪來**（L70–96）：沿用作者另一份統合分析（Prinz 等 2020，*Educational Research Review*）的檢索，去重後 800 筆，初篩剩 214 筆，套用基準準確度的納入排除標準後剩 66 筆。本篇沒有重述檢索的資料庫與檢索詞。
- **66 筆那一層的排除標準**（L82–94）：重複報告；學習障礙或**第二語言**學習者；作者不會的語言（例如日文）；**文本放在多媒體環境裡、或搭配插圖或動畫**；受試者在測驗前有機會調整學習；非典型的閱讀、預測或測驗程序（可以畫重點、讀完隔一天才預測、測驗時文本還在）。
- **本篇加上的納入標準**（L98–112）：
  - 受試者是中小學生或大學生。
  - 文本是說明文。
  - 理解測驗要求推論或應用，「because the interventions are targeted at this kind of knowledge, that is, the situation model」（L102）。
  - 有一個完全沒有介入的對照條件，對上一個情境模型取向的介入條件。
  - 每一種介入至少要有兩個以上的研究符合。因此排除：畫圖、解釋給別人聽、**自己出題並作答**（Bugg & McDaniel 2012）、前導組織、有類比的文本、句子排序（L106）。
  - 介入要是典型做法（L108，各介入的定義見下）。
- **最後納入**：17 篇紀錄、28 個效果量、2,236 位受試者，出版年 2000–2020（L114；流程圖 Fig. 1，p. 928：800 → 214 → 66 → 17 → 28 個效果量）。
- **七種介入的操作定義**（L108–110）：
  - 延後寫摘要、延後列關鍵詞、延後完成圖表：關鍵是**全部文本讀完之後**才做。延後列關鍵詞的研究全都給了關鍵詞範例；延後完成圖表的研究全都有簡短訓練。前言另一處說這類作業要在「several minutes after reading」做才有效（L60）。
  - 自我解釋：閱讀當中做；所有研究都給一段範例文本與可能的自我解釋語句。
  - 概念圖：閱讀當中自己畫；所有研究都給了「extensive instruction and training」。
  - 重讀：做預測前把文本讀兩遍。
  - 理解測驗預期：「participants’ knowledge about the upcoming comprehension tests had to be manipulated via both (a) an explicit description of the nature of the test questions and (b) sample test questions about practice texts.」也就是不只口頭告知，還要先做過練習文本的範例題。對照組兩樣都沒有。
- **編碼**：一位受過訓練的研究助理與第一作者雙重編碼，分歧討論後一致率 100%（L126）。
- **分析單位**：Thiede 等 2010 實驗一、De Bruin 等 2011 實驗二各拆成兩個子群。Griffin 等 2019b 實驗四（自我解釋與測驗預期共用一個對照組）、Engelen 等 2018 實驗一（延後摘要與延後關鍵詞共用對照組）在算整體平均時各合成一個分數（設兩效果相關 r = .50），所以整體平均用 k = 26；做調節分析時再拆回獨立效果，所以各介入的 k 加起來是 28（L152–154、L168）。
- **調節變項**：介入（7 類）與介入類型（4 類：編碼式線索生成＝自我解釋＋概念圖；提取式線索生成＝三種延後作業；線索注意＝重讀；線索選擇＝測驗預期）（L136–138）。
- **出版偏誤**：漏斗圖、Rosenthal fail-safe N、trim-and-fill（L158–162）。

## 結果（逐項）

### 整體

| # | 結果 | 數字 | 對照條件 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 對照條件的加權平均相關 | r = .14，95% CI [.09, .20]，k = 26 | 完全沒有介入的條件 | L174 | 「There was a small average correlation in the control condition, r = .14, 95% CI [.09, .20], k = 26」 |
| 2 | 介入條件的加權平均相關 | r = .41，95% CI [.33, .48]，k = 26 | 七種介入合併 | L174 | 「and a medium-to-large average correlation in the intervention condition, r = .41, 95% CI [.33, .48], k = 26.」 |
| 3 | 整體效果 | g = 0.46，95% CI [0.33, 0.60]，p < .001，k = 26 | 介入 vs 無介入 | L174 | 「the average effect across all situation-model-approach interventions on relative metacomprehension accuracy was significantly positive and of medium size, g = 0.46」 |
| 4 | 異質性 | Q(25) = 70.46，p < .001，I² = 65% | — | L176 | 「reflects moderate-to-high heterogeneity」 |
| 5 | 中小學生 vs 大學生 | 中小學 g = 0.39 [0.15, 0.63]，k = 8；大學 g = 0.50 [0.33, 0.66]，k = 18；Q(1) = 0.52，p = .473 | — | 註 3，p. 932 | 「did not significantly differ from each other」 |
| 6 | 漏斗圖 | 不對稱，下方左側有缺口 | — | L180 | 「This indicates that a publication bias might be present.」 |
| 7 | Fail-safe N | 843（門檻 5k + 10 = 140） | — | L180 | 「843 studies with an effect size of zero would be needed to render the average effect nonsignificant.」 |
| 8 | Trim-and-fill | 補 4 個研究，校正後 g = 0.41 [0.28, 0.54] | — | L180 | 「the impact of publication bias in the present study seems to be negligible.」 |

第 1、2 列的 .14 與 .41 是這 26 個效果的對照條件與介入條件各自的加權平均，文字裡寫成 r，但資料以 Gamma 為主（Table 1 註 d 標出只有 Griffin 等 2008 兩個實驗用 Pearson）。

### 各介入對後設理解準確度的效果（Table 2，p. 933；對過 PDF）

| # | 介入 | k | g | 95% CI | Q | p（異質性） | I² |
|---|---|---|---|---|---|---|---|
| 9 | 延後寫摘要 | 6 | 0.49 | [0.22, 0.77] | 21.46 | .001 | 77 |
| 10 | 延後列關鍵詞 | 7 | 0.34 | [0.08, 0.61] | 18.23 | .001 | 67 |
| 11 | 延後完成圖表 | 2 | 0.72 | [0.22, 1.21] | 0.04 | .851 | < 1 |
| 12 | 自我解釋——**不顯著** | 2 | 0.34 | [−0.20, 0.89] | 10.68 | .001 | 91 |
| 13 | 概念圖——**邊緣，p = .097** | 2 | 0.47 | [−0.08, 1.03] | 0.04 | .841 | < 1 |
| 14 | 重讀 | 6 | 0.32 | [0.02, 0.61] | 15.45 | .009 | 68 |
| 15 | 理解測驗預期 | 3 | 0.84 | [0.40, 1.27] | 0.39 | .825 | < 1 |

- 調節分析**不顯著**：Q(6) = 5.71，p = .456，R² = .03（L196）。
- 兩兩比較（Table 3，p. 934；Bonferroni 校正後 α = .002）：**沒有任何一對達到顯著**。未校正時 p < .05 的只有兩對：測驗預期 vs 延後列關鍵詞（Q = 4.70，p = .030）、測驗預期 vs 重讀（Q = 4.79，p = .029）（L196）。原文結論：「the interventions do not substantially differ with regard to their impact on relative metacomprehension accuracy. Yet, there is a tendency for the test-expectancy intervention to be particularly effective」。
- 延後列關鍵詞依教育階段：中小學 g = 0.27 [−0.03, 0.57]，k = 5（邊緣）；大學 g = 0.58 [0.03, 1.14]，k = 2；Q(1) = 0.94，p = .333（L202）。

個別研究（Table 1，p. 929；對過 PDF）裡值得記的：
- **測驗預期的三個效果全部出自同一篇論文**（Griffin、Wiley、Thiede 2019b 的實驗一 g = 0.76、實驗三 0.79、實驗四 0.95），每組 n = 24–40。
- **自我解釋的兩個效果方向相反**：Griffin 等 2019b 實驗四 g = 0.89 [0.44, 1.35]（介入 M = 0.46，n = 40；對照 M = 0.08，n = 40）；Jaeger & Wiley 2014 實驗二 g = −0.32 [−0.89, 0.25]（介入 M = −0.05，n = 23；對照 M = 0.18，n = 24）。
- g 為負的效果共六個：Engelen 等 2018 的延後摘要 −0.18 與延後關鍵詞 −0.13（小學生）、De Bruin 等 2011 實驗二的四年級生 −0.10、Jaeger & Wiley 2014 自我解釋 −0.32、Chiang 等 2010 重讀 −0.01、Margolin & Snyder 2018 重讀 −0.11。
- 概念圖兩個效果：Redford 等 2012 實驗二 g = 0.43 [−0.20, 1.05]（n = 16 與 24，註 c 說資料因遺失與原論文略有出入）；Thiede 等 2010 實驗二 g = 0.51 [0.05, 0.97]（受試者內，n = 19）。

### 介入類型（Table 4，p. 935；對過 PDF）

| # | 類型 | k | g | 95% CI | Q | p | I² |
|---|---|---|---|---|---|---|---|
| 16 | 編碼式線索生成（自我解釋＋概念圖） | 4 | 0.41 | [0.03, 0.79] | 10.77 | .013 | 72 |
| 17 | 提取式線索生成（三種延後作業） | 15 | 0.45 | [0.28, 0.63] | 46.54 | < .001 | 70 |
| 18 | 線索注意（重讀） | 6 | 0.31 | [0.03, 0.60] | 15.45 | .009 | 68 |
| 19 | 線索選擇（測驗預期） | 3 | 0.84 | [0.41, 1.26] | 0.39 | .825 | < 1 |

- 調節分析不顯著：Q(3) = 4.07，p = .254，R² = .10（L212）。兩兩比較（Table 5，p. 936；校正後 α = .008）沒有一對顯著；未校正時線索選擇 vs 線索注意 Q = 4.79，p = .029。
- 提取式線索生成依教育階段：中小學 g = 0.31 [0.10, 0.52]，k = 8；大學 g = 0.62 [0.39, 0.86]，k = 7；Q(1) = 3.77，p = .052，R² = .27（L218）。原文稱「marginally significantly smaller」。

### 對理解成績的效果

| # | 結果 | 數字 | 位置 | 原文一句 |
|---|---|---|---|---|
| 20 | 整體 | g = 0.13，95% CI [0.002, 0.26]，p = .046，k = 26；Q(25) = 72.74，p < .001，I² = 66% | L222、L228 | 「significantly positive but small」 |
| 21 | 中小學 vs 大學 | 大學 g = 0.16 [0.01, 0.33]，k = 18（顯著）；中小學 g = 0.07 [−0.16, 0.29]，k = 8（不顯著）；Q(1) = 0.49，p = .483 | 註 4，p. 935 | 「this difference was not statistically significant」 |

各介入對理解成績（Table 7，p. 938；對過 PDF）：

| # | 介入 | k | g | 95% CI | Q | p | I² |
|---|---|---|---|---|---|---|---|
| 22 | 延後寫摘要——**方向為負，不顯著** | 6 | −0.17 | [−0.39, 0.05] | 9.26 | .099 | 46 |
| 23 | 延後列關鍵詞——不顯著 | 7 | 0.06 | [−0.16, 0.27] | 7.72 | .260 | 22 |
| 24 | 延後完成圖表——不顯著 | 2 | 0.11 | [−0.28, 0.50] | 1.44 | .230 | 31 |
| 25 | 自我解釋——不顯著 | 2 | 0.37 | [−0.09, 0.82] | 1.31 | .253 | 24 |
| 26 | 概念圖——顯著 | 2 | 0.67 | [0.22, 1.13] | 2.85 | .091 | 65 |
| 27 | 重讀——不顯著 | 6 | 0.18 | [−0.06, 0.42] | 24.33 | < .001 | 80 |
| 28 | 測驗預期——邊緣，p = .054 | 3 | 0.36 | [−0.01, 0.72] | 0.44 | .801 | < 1 |

- 調節分析顯著：Q(6) = 15.57，p = .016，R² = .37（L240）。校正後（α = .002）顯著的兩對：延後寫摘要 < 概念圖（Q = 12.59，p < .001）、延後寫摘要 < 測驗預期（Q = 9.85，p = .0017）（Table 8，p. 939）。
- 介入類型（Table 9，p. 940）：編碼式 g = 0.52 [0.20, 0.84]，k = 4；提取式 g = −0.03 [−0.17, 0.11]，k = 15（Q = 25.38，p = .031，I² = 45）；線索注意 0.18 [−0.06, 0.42]；線索選擇 0.36 [−0.01, 0.72]。調節分析 Q(3) = 12.03，p = .007，R² = .37；校正後（α = .008）提取式 < 編碼式顯著（Q = 12.08，p = .001）（Table 10；L256）。原文：「the cue-generation retrieval-based interventions do not support comprehension」。
- 提取式依教育階段：中小學 g = −0.03 [−0.19, 0.14]，k = 8；大學 g = −0.05 [−0.24, 0.14]，k = 7；Q(1) = 0.03，p = .874（L262）。

### 討論裡會被引用的說法

- 自我解釋為什麼不顯著（L274）：兩個研究，一正一負；Jaeger & Wiley 2014 的自陳線索分析顯示自我解釋沒有增加、反而傾向減少情境模型線索的使用。作者的推測是邊讀邊解釋讓讀者認知負荷過重；自我解釋搭配重讀的研究效果一致為正（Griffin 等 2008 實驗二；Wiley 等 2008 實驗二）。作者把自我解釋稱為「unreliable」（L272），不是「無效」。
- 測驗預期的實務優點（L278）：不需要訓練、不需要延後、不需要閱讀以外的額外時間。
- 結論的保留（L296）：「that such a minimal intervention can have such a large impact illustrates the ambiguity in what learners think it means to comprehend a text and suggests caution because their expectancy might easily be reverted.」以及「there might not be a one-size-fits-all intervention」。
- 前言引用的機制證據（L34）：光延後不生成（想一想文本、讀現成關鍵詞）或只把預測延後，都不影響準確度（Thiede 等 2005）；所以「生成」與「延後」兩者都要有。
- 前言引用（L44）：Redford 等 2012 實驗二，自己畫概念圖的人準確度高於對照組，拿到現成概念圖的人沒有。
- 前言引用（L54）：測驗預期在讀完之後才給也有效（Griffin 等 2019b 實驗三）。

## 作者自己列的限制（L286–292）

1. 只看到準確度隨介入改變，看不到是怎麼變的；線索使用、認知負荷等機制還不清楚（L286）。
2. 部分介入的研究很少，「in particular, for delayed-diagram completion, self-explaining, and concept mapping. Therefore, the conclusions regarding these interventions should be treated with caution」；同一介入的研究不是精確重複；還有其他介入（畫圖、解釋給別人）因為不到兩篇而沒納入（L288）。
3. 只處理相對準確度，沒處理絕對準確度與偏誤（高估、低估）；只談讀文本，能不能搬到背單字或解題「is questionable」（L290）。
4. 介入對理解的幫助比對後設理解小；多數研究的目的本來就不是提高理解（L292）。

散在正文的其他保留：延後寫摘要、延後列關鍵詞、自我解釋、重讀四項的異質性顯著，但研究太少，做不了調節分析（L202、L276）；漏斗圖不對稱（L180）。

原文沒有提、但從 Table 1 看得到的：測驗預期三個效果來自同一篇論文、同一組研究者。作者沒有把這點列為限制。

## 與摘要說法不一致的地方

逐項對過，有三處：

1. 摘要：「with the exception of self-explaining, each intervention had a significant positive effect on relative metacomprehension accuracy」（p. 917）。正文與 Table 2：概念圖只有邊緣顯著（p = .097，95% CI [−0.08, 1.03] 跨過 0）。討論首段也沿用「each … reliably enhances」（L272）。
2. 摘要：「across 28 effect sizes … a medium positive effect (g = 0.46)」。g = 0.46 是用 k = 26 算的（兩組共用對照組的效果先合成）；28 是調節分析時的效果數。
3. 摘要：「there was a tendency for setting a comprehension-test expectancy to be particularly effective」——用字是 tendency，與正文相符；但摘要沒說調節分析整體不顯著（p = .456）、校正後沒有任何一對差異顯著。

另外前言說基準準確度「on average as low as +.24 (i.e., without any intervention or support; Prinz et al. 2020)」（L14），本篇自己的對照條件平均是 .14。作者沒有討論這個差距。Yang 等 2023（見 `yang2023-metacomprehension.md`）主張 .24 混進了有測驗預期的條件。

## 與清單「要撐的結論」不合的地方

清單那句：「介入把相關從 .14 拉到 .41（g = 0.46）；告知會被考理解題最有效；重讀幫助小；自我解釋不顯著（無效的一項）」。

- **「從 .14 拉到 .41（g = 0.46）」**：數字撐得住。要連著寫的條件：受試者是學生、材料是沒有插圖的說明文、測驗是推論或應用題、介入多半附範例或訓練、17 篇紀錄。
- **「告知會被考理解題最有效」**：**撐不住，要改寫**。(a) 點估計最大（g = 0.84），但介入之間的調節分析不顯著（Q(6) = 5.71，p = .456），校正後沒有任何兩兩差異顯著，作者只說「tendency」。(b) k = 3，三個效果出自同一篇論文。(c) 介入不是只有「告知」，還包含先做練習文本的範例推論題。可以寫成「點估計最大、但只有同一組研究者的三個實驗，和其他介入的差距沒有通過統計檢定」。
- **「重讀幫助小」**：g = 0.32 [0.02, 0.61]，是七項裡點估計最小的，顯著；但和延後列關鍵詞（0.34）、自我解釋（0.34）幾乎一樣，介入之間沒有顯著差異。「小」只能指點估計排最後，不能寫成「比其他介入差」。
- **「自我解釋不顯著（無效的一項）」**：**「無效」撐不住**。自我解釋的點估計 g = 0.34，與延後列關鍵詞相同、比重讀高；不顯著是因為只有兩個研究、一個 +0.89 一個 −0.32（I² = 91%）。作者的用字是「unreliable」「of limited reliability」。而且 Yang 等 2023 用 k = 7 得到自我解釋顯著（MC 差 0.179，p < .001）。能寫的是「兩個實驗結果相反，結論未定」。
- **清單沒列、但原文有的反向結果**：延後寫摘要與延後列關鍵詞提高判斷準確度，卻不提高理解成績（提取式整體 g = −0.03；延後寫摘要 g = −0.17，方向為負）。如果文章要建議「讀完後寫摘要」，這一項要一起寫。
- **清單下方「找不到來源」一段**說「實驗裡的『延後』是讀完全部文本之後的幾分鐘」：原文定義是「after all texts had been read」，另一處寫「several minutes after reading」（L60）；本篇沒有給各研究實際延後幾分鐘的數字。排除標準裡明寫「讀完隔一天才預測」的研究被排除（L94），所以更長的延後確實不在這份資料裡。

## 讀取紀錄

`prinz2020sma.txt`（依序，首尾相接）：

| 段 | 行號 | 內容 |
|---|---|---|
| 1 | L1–150 | 前言全部、The Present Study、方法（檢索與篩選、編碼、結果變項、調節變項、效果量、平均效果的算法前半） |
| 2 | L150–319 | 方法後半（分析單位、出版偏誤、調節分析）、結果全部、討論、限制、結論、參考文獻開頭 |
| 3 | L320–570 | 參考文獻其餘（掃過）；檔尾沒有註腳與附錄 |

`prinz2020sma_springer.pdf`（補原檔缺的部分）：

| 頁 | 內容 | 讀法 |
|---|---|---|
| p. 917（PDF 第 1 頁） | 摘要、關鍵詞、作者單位 | 文字抽取 |
| p. 922、923、932、935 | 註 1–4 | 文字抽取＋版面 |
| p. 927–929（PDF 第 11–13 頁） | Fig. 1 流程圖、Table 1 及其註 a–f | 看 PDF 版面 |
| p. 933–936（PDF 第 17–20 頁） | Fig. 2 漏斗圖、Table 2–5 | 看 PDF 版面 |
| p. 937–940（PDF 第 21–24 頁） | Table 6–10 | 看 PDF 版面 |
| p. 945（PDF 第 29 頁） | 致謝、經費、利益衝突、授權聲明 | 文字抽取 |

- 十張表都對過 PDF 版面；本紀錄裡的表格數字全部取自 PDF，不是取自 jina 文字檔（那裡沒有表）。
- Table 6（各研究的理解成績）看過，只在本紀錄引用了彙總表 Table 7、9 的數字；Table 6 各列沒有逐一抄錄。
- PDF 正文頁（p. 918–926、930–932、941–944）沒有再逐字重讀一次，內容以 jina 文字檔讀過的為準；兩版只比對了印註腳時順帶看到的四段（L34、L40、L48、L180 的片段），這四段一致；其餘頁沒有比對。
- 這篇沒有附錄，也沒有線上補充資料的指引。
