# 抽取紀錄：Settles、Meeder 2016，A Trainable Spaced Repetition Model for Language Learning（ACL 2016）

- **書目**：Burr Settles（Duolingo）、Brendan Meeder（Uber Advanced Technologies Center；註明研究在 Duolingo 時進行）（作者全名對 PDF 首頁與 Crossref 核過）。2016。A Trainable Spaced Repetition Model for Language Learning。Proceedings of the 54th Annual Meeting of the Association for Computational Linguistics（Volume 1: Long Papers），頁 1848–1858，Berlin，2016-08-07 至 12。doi 10.18653/v1/P16-1174（DOI 不在檔內，用 Crossref 查到並核過題名、作者、頁碼）。
- **原文檔**：`.research/raw/learning-content/q4-time/settles2016-duolingo-hlr.txt`，713 行、61,238 字元（61,731 位元組）。來源網址在檔頭：`https://research.duolingo.com/papers/settles.acl16.pdf`（作者所屬公司的研究頁）。
- **版本**：刊出版（頁尾有 ACL 論文集頁碼 1848–1858，11 頁，含附錄 A.1–A.3）。
- **讀取日期**：2026-10-14
- **版面處理**：原文檔是 `pdftotext -layout` 的雙欄輸出，左右欄並排，公式被拆散。同一份 PDF 重抓到 scratch（`…/scratchpad/d17b/settles.pdf`），Table 2（PDF 第 6 頁，論文頁 1853）、Table 3 與 Table 4（PDF 第 7 頁，論文頁 1854）直接看 PDF 頁面對過，含粗體與星號。Table 1 與 Table 5 只讀文字檔（是範例資料與縮寫表，不會被引用）。
- **供哪幾篇用**：order 17（把複習做進文章）。
- **利益關係**：兩位作者做這項研究時都在 Duolingo，受測系統是自家產品。

## 研究設計

這篇有三個部分，設計各不相同。

### A. 模型（§3）

- Half-life regression（HLR）：假設記憶依 Ebbinghaus 遺忘曲線指數衰退，p = 2^(−Δ/h)，p 是答對機率、Δ 是距上次練習的時間、h 是半衰期（L207–221）。半衰期用特徵的加權和估計：ĥ = 2^(Θ·x)（L185–190）。
- 特徵兩類（L291–320）：互動特徵（該學習者看過這個字幾次、答對幾次、答錯幾次，實作時取平方根，註 5）；詞素標記特徵（約兩萬個指示變數，一個詞素標記一個）。
- 損失函數：預測答對率的平方誤差＋半衰期項（權重 α）＋L2 正則（L226–278）。
- Leitner 與 Pimsleur 被寫成 HLR 的特例（固定權重，附錄 A.2，L637–661）。
- Duolingo 上線初期用的是 Leitner 的變體；改模型的動機是學生抱怨強度條不反映實際學到的東西（L194–200）。

### B. 歷史資料評估（§4.1）

- 資料：兩週的 Duolingo 紀錄，1,290 萬筆「學生–單字」的課或練習工作階段，涵蓋所有課程的所有學生（L354–357）。前 90% 訓練、後 10% 測試（L325–327）；前 100 萬筆用來調參數（λ = 0.1、α = 0.01、學習率 0.001，L377–380）。
- 比較對象：HLR 四個變體（有無詞素特徵 -lex、有無半衰期項 -h）、Leitner、Pimsleur、邏輯迴歸（有無詞素特徵）、固定預測平均答對率 0.859。
- 指標：平均絕對誤差 MAE（預測答對率與實際的差）、AUC（把答對的字排在答錯的字前面的機率）、COR_h（預測半衰期與代數估計半衰期的 Spearman 等級相關）。

### C. 兩個上線的使用者實驗（§4.3、§4.4）

- **實驗 I**：所有學生隨機分成 HLR（實驗）與 Leitner（對照）；演算法決定技能樹上的強度條數值與練習時單字的排序，其餘相同。為期六週，「just under 1 million students」（L412–420）。
- **實驗 II**：數個月後，所有學生隨機分成 HLR -lex（實驗，只用互動特徵）與 HLR（對照）。為期兩週，330 萬學生（L463–466）。
- **量了什麼**：只有「daily retention」——做了某項活動的學生，隔天回來再做的比例（L421–424：「what percentage of students who engage in an activity return to do it again the following day?」）。三個指標：任何活動（含群眾翻譯、論壇討論等）、新課、練習工作階段。
- **沒有量的**：兩個使用者實驗都沒有任何學習成果（答對率、測驗、保留）指標。全文沒有任何地方檢驗「用 HLR 排程的學生是否記得比較多」。這是我讀完的觀察，作者沒有把它列為限制。

## 結果（逐項）

### Table 2：歷史資料評估（L324–350，已對 PDF 第 6 頁；粗體為該指標最佳，* 為 p < 0.001）

| 模型 | MAE↓ | AUC↑ | COR_h↑ |
|---|---|---|---|
| HLR | **0.128*** | 0.538* | **0.201*** |
| HLR -lex | **0.128*** | 0.537* | 0.160* |
| HLR -h | 0.350 | 0.528* | −0.143* |
| HLR -lex-h | 0.350 | 0.528* | −0.142* |
| Leitner | 0.235 | **0.542*** | −0.098* |
| Pimsleur | 0.445 | 0.510* | −0.132* |
| LR | 0.211 | 0.513* | n/a |
| LR -lex | 0.212 | 0.514* | n/a |
| Constant p̄ = 0.859 | 0.175 | n/a | n/a |

| # | 結果 | 數字 | 對照條件 | 位置 | 原文 |
|---|---|---|---|---|---|
| 1 | HLR 的預測誤差 | MAE 0.128 對 Leitner 0.235（少 45.5%，百分比是我算的）、對 Pimsleur 0.445、對邏輯迴歸 0.211、對固定預測 0.175 | 預測單次工作階段的答對率 | Table 2；L381–382 | 「the top two HLR variants are not far behind, and they also reduce MAE compared to Leitner by least 45%.」 |
| 2 | 只有兩個 HLR 變體贏過「一律猜平均」 | HLR 與 HLR -lex 的 MAE 0.128 < 0.175；Leitner、Pimsleur、邏輯迴歸都比固定預測差 | 固定預測 p̄ = 0.859 | L361–365 | 「these are the only two approaches with MAE lower than a baseline constant prediction of the average recall rate in the training data」 |
| 3 | 排序品質 AUC：Leitner 最高 | Leitner 0.542 > HLR 0.538 > HLR -lex 0.537；全部只略高於隨機的 0.5 | — | L378–380、註 7 L383–391 | 「The Leitner method did yield the highest AUC values among the algorithms we tried.」「AUC of 0.5 implies random guessing (Fawcett, 2006), so the AUC values here may seem low.」 |
| 4 | 詞素特徵幾乎沒有幫助 | HLR 與 HLR -lex 的 MAE 相同（0.128），AUC 0.538 對 0.537，COR_h 0.201 對 0.160 | 有無詞素特徵 | L368–370 | 「While lexeme tag features made limited impact」 |
| 5 | 半衰期項很重要 | 拿掉後 MAE 0.128 → 0.350 | 有無 h 項 | L369–374 | 「the h term in the HLR loss function is clearly important: MAE more than doubles without it」 |
| 6 | 平均答對率 | 0.859 | 訓練資料 | 註 7 | 「p̄ = 0.859, so most words are recalled correctly and predictions tend to be high.」 |

### Table 4：使用者實驗（L395–402，已對 PDF 第 7 頁）

表題：「Change (%) in daily student retention for controlled user experiments. Statistically significant effects (p < 0.001) are marked with *.」

| 實驗 | Any | Lesson | Practice |
|---|---|---|---|
| I. HLR（v. Leitner） | +0.3 | +0.3 | −7.3* |
| II. HLR -lex（v. HLR） | +12.0* | +1.7* | +9.5* |

| # | 結果 | 數字 | 對照條件 | 位置 | 原文 |
|---|---|---|---|---|---|
| 7 | 實驗 I：任何活動的隔日回訪 | +0.3%（不顯著） | HLR vs Leitner，六週，近 100 萬人 | Table 4；L429–432 | 「The HLR group showed a slight increase in overall activity and new lessons, but a significant decrease in practice.」 |
| 8 | 實驗 I：新課的隔日回訪 | +0.3%（不顯著） | 同上 | 同上 | 同上 |
| 9 | 實驗 I：練習工作階段的隔日回訪 | **−7.3%**（p < 0.001） | 同上 | 同上 | 同上 |
| 10 | 實驗 I 之後的決定 | 練習回訪顯著下降，仍全面上線 HLR；理由是事前學生的說法加上事後的「anecdotal feedback」 | — | L432–440 | 「Prior to the experiment, many students claimed that they would practice instead of learning new material "just to keep the tree gold," but that practice sessions did not review what they thought they needed most. This drop in practice — plus positive anecdotal feedback about stength meter quality from the HLR group — led us to believe that HLR was actually better for student engagement, so we deployed it for all students.」 |
| 11 | 實驗 II 的起因 | 上線數個月後，活躍學生抱怨某些字或技能不管怎麼練都衰退得很快；追查到詞素特徵的大負權重，作者判斷是過度擬合 | — | L444–454 | 「active students pointed out that particular words or skills would decay rapidly, regardless of how often they practiced.」「This implied that some feature-based overfitting had occurred」 |
| 12 | 實驗 II：任何活動的隔日回訪 | +12.0%（p < 0.001） | HLR -lex vs HLR，兩週，330 萬人 | Table 4；L467–472 | 「All three retention metrics were significantly higher for the HLR -lex group. The most substantial increase was for any activity」 |
| 13 | 實驗 II：新課 | +1.7%（p < 0.001） | 同上 | 同上 | 同上 |
| 14 | 實驗 II：練習 | +9.5%（p < 0.001） | 同上 | 同上 | 「recurring lessons and practice sessions also improved (possibly as a byproduct of the overall activity increase)」 |
| 15 | 上線後的成長（作者的信念，無資料） | 「consistent 5% month-on-month growth in active Duolingo users」 | 無對照 | L477–481 | 「believe that its improvements are at least partially responsible for the consistent 5% month-on-month growth in active Duolingo users since the model was launched.」 |

### 其他

| # | 內容 | 位置 | 原文 |
|---|---|---|---|
| 16 | 權重分析：正權重多為同源字與常見、短、變化簡單的字；負權重多為不規則形、罕見字、分詞與未完成體。作者自稱是「cursory analysis」 | §4.2 L428–446；L526 | 「Positive weights are associated with cognates and words that are common, short, or morphologically simple to inflect」 |
| 17 | Table 3 的權重例子（每語言六個，例如 EN camera 0.77、writing −0.81；DE war −1.10） | L395–420 | 表列（已對 PDF） |
| 18 | 實作時半衰期的上下限 | 附錄 A.3，L655–657 | 「we bound p̂Θ ∈ [0.0001, 0.9999] and ĥΘ ∈ [15 min, 9 months] in practice.」 |
| 19 | Pimsleur 原始間隔表 | 附錄 A.2，L641–644 | 「5 sec, 25 sec, 2 min, 10 min, 1 hr, 5 hr, 1 day, 5 days, 25 days, 4 months, and 2 years」 |
| 20 | 資料與程式碼公開 | L545–550 | `https://github.com/duolingo/halflife-regression` |
| 21 | 背景宣稱（公司委託研究，非本文結果，不要轉引） | L80–83 | 「Early research suggests that 34 hours of Duolingo is equivalent to a full semester of university-level Spanish instruction (Vesselinov and Grego, 2012).」 |

## 作者自己列的限制

這篇沒有限制節。散在各處、作者自己承認的有：

- AUC 都很低，接近隨機；作者歸因於預測任務本身雜訊大與值域受限（多數字都答對）（註 7，L383–391）。
- 詞素特徵過度擬合，讓學生受挫（L508–513：「lexeme tag features failed to improve predictions much, and in fact seemed to frustrate the student learning experience due to over-fitting」）。
- 新語言課沒有訓練資料可擬合詞素權重（冷啟動，L454–457）。
- 寫作時不知道 multiscale context model，沒有比較；也沒有和 SuperMemo 一類的演算法比（L470–486）。
- 權重分析只是粗略的（L526–528）。
- 實驗 II 的課與練習回訪上升可能只是整體活動上升的副產品（L472–474）。
- HLR 兩個變體 COR_h 為正「seems reasonable since they are the only two to directly optimize for it」（L366–368），等於承認這個指標對它們有利。

作者**沒有**提的（我的觀察，不是原文）：使用者實驗沒有量學習；每日回訪變化的「%」沒說是相對變化還是百分點；沒有報告基準回訪率、各組人數與信賴區間；實驗 I 上線的決定與唯一顯著的指標方向相反，依據是軼事回饋。

## 與摘要說法不一致的地方

1. **摘要的「HLR was able to improve Duolingo daily student engagement by 12%」不是 HLR 對原本的 Leitner**。+12.0% 來自實驗 II，比的是**拿掉詞素特徵的 HLR** 對**完整的 HLR**（Table 4 第二列）。HLR 對 Leitner（實驗 I）的結果是任何活動 +0.3%（不顯著）、新課 +0.3%（不顯著）、練習 −7.3%（顯著下降）。換句話說，12% 量到的是「修掉自己上線版本的過度擬合」帶來的回升，不是「可訓練的排程模型比手調規則好」的證據。
2. **摘要的「reducing error by 45%+ compared to several baselines」只對部分基準成立**。從 Table 2 算（我算的）：對 Leitner 少 45.5%、對 Pimsleur 少 71.2%，但對邏輯迴歸少 39.3%（0.211 → 0.128）、對「一律猜平均」少 26.9%（0.175 → 0.128）。正文自己的說法較準：「compared to Leitner by least 45%」（L381–382）；§4.3 又寫成「cutting MAE nearly in half」（L408）。
3. **摘要與結論都只談預測準確，沒有提 Leitner 在 AUC 上最高**。結論寫 HLR「significantly more accurate at predicting student recall rates than either of the previous methods」（L499–502），這在 MAE 上成立，在排序品質（AUC 0.538 對 0.542）上不成立；而作者自己說 AUC 對應的正是「用來排練習優先順序」這個用途（L351–353）。
4. 摘要把「engagement」當成果；全文沒有任何學習成果的量測。摘要沒有宣稱改善學習，所以這不算矛盾，但引用時不能把這篇寫成「排程改善了記憶」。

## 與清單「要撐的結論」不合的地方

- **「大規模排程實驗量的是隔天回訪」**：撐得住。兩個實驗的結果變項都是 daily retention（隔天回來做同一類活動的比例），沒有學習指標。
- **「第一個實驗練習量反而下降 7.3%」要改寫**。−7.3% 不是練習量，是「練習工作階段的隔日回訪率」的變化：當天做了練習的學生，隔天又回來練習的比例下降（Table 4 表題是「Change (%) in daily student retention」，正文只寫「a significant decrease in practice」）。原文沒有報告練習題數或練習時間。另外原文沒說 7.3% 是相對變化還是百分點，寫的時候照表題寫「變化 7.3%」，不要自己補成其中一種。
- 清單沒寫、但文章若引這篇必須帶上的三點：(a) 摘要那個 12% 是實驗 II（簡化版對完整版），不是新模型對舊規則；(b) 新模型對舊規則的實驗裡，整體回訪與新課回訪沒有顯著變化；(c) 作者是受測公司的員工，上線決定部分依據軼事回饋。
- Davis 等 2018 的相關研究段把這篇描述成「0% probability of remembering after seven days」並說其支援系統「significantly improves learners' memory」。這篇原文沒有這兩個說法：遺忘曲線範例只是 h = 1 的示意圖（Figure 4a，L222–237），而且全文沒有量記憶改善。不要從 Davis 2018 轉引對這篇的描述。

## 讀取紀錄

依序讀過原文檔 L1–713 全部（一次讀完）：L1–64（題名、作者、摘要、1 導言、2 Duolingo 開頭）、L65–122（Figure 1–2、2 與 2.1）、L123–180（2.1 尾、2.2、3.1、3.2 開頭、Figure 3）、L181–240（3.2 尾、3.3 模型與損失函數）、L241–323（Figure 4、Table 1、3.3 尾、3.4 特徵、4 開頭）、L324–394（Table 2、4.1、註 6–7）、L395–449（Table 3、Table 4、4.2、4.3、4.4 開頭）、L450–507（4.4 尾、5 其他相關研究、6 結論前半）、L508–584（結論後半、資料與程式碼、致謝、參考文獻前半）、L585–651（參考文獻後半、Table 5、附錄 A.1、A.2 開頭）、L652–713（附錄 A.2 尾、A.3）。參考文獻只掃過。

對過 PDF 版面的：Table 2（PDF 第 6 頁）、Table 3 與 Table 4（PDF 第 7 頁），含粗體、斜體與星號；§4.1 後半與 §4.3 的正文也在這兩頁一併對過。Table 1（範例資料）與 Table 5（縮寫表）沒有另外對版面。附錄的公式在文字檔裡被拆散，我沒有逐項對 PDF，紀錄裡也沒有引用公式本身的係數，只引了 A.2、A.3 的文字敘述。
