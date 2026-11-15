# 抽取紀錄：Heer & Bostock 2010，Crowdsourcing Graphical Perception

- **書目**：Jeffrey Heer, Michael Bostock (2010). Crowdsourcing Graphical Perception: Using Mechanical Turk to Assess Visualization Design. *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI 2010)*, Atlanta, April 10–15, 2010. DOI 10.1145/1753326.1753357（作者全名與單位對 PDF 首頁：Computer Science Department, Stanford University）。
- **原文檔**：`.work/learning-visualization-research/src/heer-bostock2010.txt`（`pdftotext` 不帶 `-layout`，1,173 行、56,145 位元組）；PDF：同目錄 `heer-bostock2010.pdf`（10 頁）。
- **取得網址**：http://vis.stanford.edu/files/2010-MTurk-CHI.pdf（作者所屬 Stanford Visualization Group 的論文頁；ACM DL 亦開放）。合法：作者實驗室公開版本。
- **版本**：會議論文刊出版排版（首頁有 ACM 版權聲明「CHI 2010, April 10–15, 2010, Atlanta」，txt L44–51）。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：系列第 2 篇（圖表，`2026-10-13-diagrams-in-teaching-articles.md`）「數量用位置表示」一節與表格「數量關係」列。
- **注意**：txt 把公式 `log2(|judged − true| + 1/8)` 抽成「+ 18」（L262、L277），對 PDF 第 3 頁是 1/8。

## 研究設計

- **類型**：圖形知覺實驗（不是學習實驗），平台是 Amazon Mechanical Turk。目的是驗證群眾外包能不能重現實驗室的圖形知覺結果，再做新實驗（L64–80、L159–171）。
- **實驗**：
  - **1A 比例判斷**：重做 Cleveland & McGill 1984 的 position-length 實驗。七種判斷類型：T1–T3 共同刻度上的位置、T4–T5 長度（這五種對應原研究）；新加 T6 角度（圓餅）、T7 圓面積（氣泡圖）（L187–192）。10 張圖 × 7 型 = 70 個 HIT，每張 N = 50；先指出兩個標記值較小者，再「make a quick visual judgment」估較小者是較大者的百分之幾（L193–197）。每次判斷付 $0.05（L199）。有資格測驗（L200–207）。
  - **1B 矩形面積**：T8 兩個中心對齊的矩形、T9 600×400 的 treemap；長寬比取 {2/3, 1, 3/2} 兩兩組合；2（顯示）× 9（長寬比）× 6 重複 = 108 HIT，每個 N = 24，$0.02（L425–446）。
  - **2 格線透明度**：重做 Stone & Bartram 的 alpha contrast 實驗，受試者調整散布圖格線透明度；task L「盡量淡但仍可察覺」、task D「最多能多明顯而不干擾」；5（背景）× 4（密度）× 3 = 60 HIT，N = 24，$0.02（L479–485、L489–528、L646–653）。
  - **3 圖高與格線間距**：長條圖或折線圖，高 40／80／160 px，格線每 10／20／50／100 單位；估兩值之差；2 × 3 × 4 × 3 = 72 HIT，N = 24，$0.02；3B 加 160、320 px，48 HIT，$0.04（L686–778）。
- **受試者**：共 186 位 Turker；1A 有 82 位（2009 年 6 月），其餘實驗 117 位（2009 年 9 月）（L794–797）。沒有年齡、教育程度等人口資料。
- **量了什麼**：1A／1B 用 Cleveland & McGill 的 log 絕對誤差；2 是 alpha 值；3 是 |判斷差 − 真實差|。

## 結果（逐項）

| # | 結果 | 數字／方向 | 對照條件 | 節／圖 | 行號／頁 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 1A 排序與原研究一致 | T1–T5 的準確度排序與 Cleveland & McGill 相同 | 群眾外包 vs 原實驗室研究 | Exp 1A Results／Fig. 3–4 | L264–269；PDF p.3–4 | 「The ranking of types by accuracy is consistent between the two experiments (Figure 4).」 |
| 2 | 位置勝過長度 | 位置編碼仍顯著勝過長度編碼；T4、T5 比原研究準 | T1–T3（位置）vs T4–T5（長度） | Exp 1A Results | L271–273 | 「Types 4 and 5 are more accurate than in the original study, but position encoding still significantly outperformed length encoding.」 |
| 3 | T1 與 T2 較接近 | 群眾外包裡兩者差距縮小，作者推測是螢幕較小 | T1 vs T2 | Exp 1A Results | L269–271 | 「Types 1 and 2 are closer in the crowdsourced study; this may be a result of a smaller display mitigating the effect of distance.」 |
| 4 | 角度、面積都比位置差；面積比角度差 | 新加的 T6、T7 | T6（角度）、T7（圓面積）vs 位置 | Exp 1A Results | L394–397 | 「psychophysical theory [7, 34] predicts area to perform worse than angle, and both to be significantly worse than position.」 |
| 5 | **角度沒有比長度差**（與理論預測不合） | | T6 vs T4–T5 | Exp 1A Results | L397–401 | 「Theory also suggests that angle should perform worse than length, but the results do not support this.」 |
| 6 | Fig. 4 讀圖（約略值，從 PDF 第 4 頁圖上目測，作者沒給數字表） | 群眾外包 log 誤差：T1 約 1.25、T2 約 1.4、T3 約 1.55、T4 約 2.0、T5 約 2.25、T6 約 2.2、T7 約 2.65、T8 約 2.5、T9 約 2.6；原研究 T1 約 1.4、T2 約 1.7、T3 約 1.85、T4 約 2.35、T5 約 2.75 | 九型互比 | Fig. 4 | PDF p.4 | 圖，無原文句。只能當方向，不能當數字引 |
| 7 | 1B 矩形面積 ≈ 圓面積 | 平均準確度相當 | T8／T9 vs T7 | Exp 1B Results | L457–458 | 「the accuracy of rectangular area judgments matches that of circular area judgments.」 |
| 8 | 長寬比效果；正方形最差 | p < 0.05；長寬比 1:1 的比較誤差最大 | 九種長寬比組合 | Exp 1B／Fig. 5 | L459–465；PDF p.4 | 「Somewhat surprisingly, comparisons of rectangles with aspect ratio 1 exhibited the worst performance」 |
| 9 | treemap 其他矩形不干擾 | T8 與 T9 無顯著差異 | T8 vs T9 | Exp 1B | L466–467 | 「We found no significant difference between the rectangle (T8) and treemap (T9) conditions」 |
| 10 | 2：密度有效、背景無效 | 密度 F(3,2413) = 3.49，p = 0.015；背景 F(4,2413) = 0.44，p = 0.779 | 同 Stone & Bartram | Exp 2 Results | L661–664 | 「consistent with Stone & Bartram’s findings」 |
| 11 | 2：alpha 0.2 當預設 | | | Exp 2 | L534–535 | 「Our results corroborate Stone & Bartram’s recommendation of alpha = 0.2 as a “safe” default.」 |
| 12 | 2：作業系統效果 | F(1,1391) = 10.24，p < 0.001；Mac OS X 10.6 前 220 筆 vs 其他 1,211 筆 | | Exp 2 | L600–605 | |
| 13 | 3：圖高 | 40 px 誤差顯著較高（p < 0.001），其他高度無顯著差異；超過 80 px 幫助不大（0–100 刻度） | 40／80／160／320 px | Exp 3 Results | L694–697 | 「suggest little benefit for increasing chart height beyond 80 pixels when using a 0-100 scale.」 |
| 14 | 3：格線 | 加格線提高準確度；10 與 20 無差異（p = 0.887）、50 與 100 無差異（p = 0.905）；建議格線間距至少 8 px | | Exp 3 Results | L713–717 | 「The results suggest that gridlines be separated by at least 8 pixels.」 |
| 15 | 品質 | 剔除的離群值只占 0.75%；沒有資格測驗的試跑超過 10% 回應不能用 | | Performance | L895–903 | |
| 16 | 時間 | 中位反應時間 42 秒（µ = 54，σ = 41），不適合細緻計時 | | Performance | L914–919 | |
| 17 | 報酬 | 高報酬完成較快（平均 0.8 天 vs 1.9 天，F(1,11521) = 2817.28）；高報酬時反而略不準（∆µ = 1.4，F(1,1136) = 7.79） | $0.04 vs $0.02 | Performance | L993–1006 | |
| 18 | 成本 | 總花費 $367.77；實驗室估計 $2,190；約 6 倍節省 | | Performance | L1011–1015 | |

## 作者自己列的限制

- 無法控制顯示器類型與尺寸、光線、觀看距離與角度（L58–61）。
- 標準 HIT 介面拿不到細緻的反應時間（L908–924）。
- 受試者跨實驗重疊，不是嚴格的受試者間或受試者內設計（L888–889）。
- 依賴物理或環境脈絡的研究不適合網路；可能測不到色盲或視力差異（L1080–1082）。
- 1A 把原研究「一人一疊 50 張」改成一張一個任務；95% 受試者依序接完所有任務，作者據此說仍維持受試者內格式（L251–257）。
- 作者自承付給 Turker 的報酬遠低於最低工資（L1019–1020）。

## 與摘要說法不一致的地方

逐項對過，沒有。摘要說「replicate previous studies of spatial encoding and luminance contrast」，正文確實是 1A（空間編碼）與 2（亮度對比）兩項。

## Heer & Bostock 重做了 Cleveland & McGill 的哪些部分（V09 特別交代）

- **重做的**：Cleveland & McGill 的 **position-length 實驗**，五種判斷類型（T1–T3 共同刻度上的位置、T4–T5 長度），沿用原研究的圖的數量、數值與外觀（L193–194「We mimicked the number, values and aesthetics of the original charts as closely as possible」）、相同的比例判斷任務、相同的 log 絕對誤差與 midmean、bootstrapping 信賴區間（L260–268）。
- **沒有照原樣重做的**：原研究另有 **position-angle 實驗**，作者說原研究的任務格式不同，無法直接比；所以本研究把角度（T6）與圓面積（T7）改成同一種格式新加進來，**這兩型沒有原研究的對應數據可比**（L274–275、L391–401）。1B 的矩形面積（T8、T9）是延伸，原研究也沒有。
- **程序上的改動**：原研究一人一疊 50 張紙本；這裡一張圖一個 HIT，每張 N = 50，螢幕 380×380 px（L193、L251–257）。
- 因此「位置 > 長度」有原研究與重做兩方一致的支持；「位置 > 角度、面積」「面積 < 角度」只來自這次群眾外包的新加判斷型（作者說與心理物理理論的預測相符）；「角度 < 長度」在這次結果**不成立**。

## 與清單「要撐的結論」不合的地方

清單 D-7 只寫「重做 Cleveland & McGill 的實驗，列參考」。原文撐得住「重做了空間編碼（position-length）的實驗」，但要補上：角度與面積兩型不是重做，是新加；而且研究量的是讀圖估比例的知覺準確度，不是學習成效。

## 已發佈文章引用核對（第 2 篇 `2026-10-13-diagrams-in-teaching-articles.md`，2026-10-14 實查行號）

| 文章行 | 文章說法 | 原文是否一致 |
|---|---|---|
| L142 | 「Heer 與 Bostock（2010）後來在 Mechanical Turk 上重做了空間編碼的實驗。」 | **一致**（L15、L68、L163–164、L181）。可補一句：角度與面積兩型是新加的，不是重做 |
| L142 | 「在讀完 Heer 與 Bostock 的全文之前，下面的動作是我的判斷。」 | 全文已讀完，這句要改寫（見下） |
| L144 | 「要讓讀者比大小、看趨勢，用折線、散點或長條。不要用圓餅的角度、氣泡的面積……」 | **部分能撐**：比例判斷上位置（T1–T3）顯著優於長度（T4–T5），角度（T6）與圓面積（T7）都顯著比位置差，面積又比角度差（L271–273、L394–397）。所以「比大小用共同刻度上的位置；不要用圓餅角度、氣泡面積」有這篇的知覺實驗支持。**但**：(a) 測的是長條圖與堆疊長條上的比例估計，不是折線或散點，也沒有測「看趨勢」；(b) 角度並沒有比長度差（L397–398），所以不能寫成「圓餅比長條差」的全面排序，只能說兩者都比共同刻度上的位置差；(c) 知覺準確度不等於學習成效 |
| L144 | 「……或顏色深淺表示數量。」 | **撐不住**：這篇沒有測顏色深淺編碼數量。實驗 2 的亮度對比是格線透明度設定，不是用亮度表示資料值。這部分仍是判斷 |
| L35（表格「數量關係」列，依據欄） | 「我的判斷；圖形知覺研究的排序，我還沒讀到能撐它的合法全文」 | 可改成：「位置優於角度與面積」有 Heer 與 Bostock 2010 的群眾外包知覺實驗支持（讀圖估比例的準確度，不是學習成效）；折線、散點與顏色深淺的部分仍是判斷 |
| L386 | 「只讀到摘要的有九篇……以及 Heer 與 Bostock 2010（另讀了引言，補精讀前不列參考資料）」 | 已完成精讀，這條要移出「只讀到摘要」清單，並可列入參考資料 |

**結論**：圖表篇「用位置表示數量」目前標為判斷。讀完 Heer & Bostock 後，**「比大小時，共同刻度上的位置比圓餅角度、氣泡面積準」能撐**（知覺準確度層次，含原研究重做與新加兩部分）；**「看趨勢用折線、散點」「不要用顏色深淺」撐不住**，仍須標判斷；也不能寫「角度比長度差」。

## 讀取紀錄

- txt L1–50、L50–499、L500–899、L899–1173 依序讀完（參考文獻 L1086–1172 掃過）。四段首尾相接，涵蓋全文。
- PDF 第 3 頁（Fig. 1–2、公式 1/8）、第 4 頁（Fig. 3、Fig. 4、Fig. 5）對過版面；Fig. 4 的排序與約略值以 PDF 為準。第 5 頁以後的 Fig. 8–14 沒有對 PDF（文章沒有引用實驗 2、3 與成本數字）。
