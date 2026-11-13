# 抽取紀錄：Geller、Carpenter、Lamm、Rahman、Armstrong、Coffman 2017，Cognitive Research: Principles and Implications 2, 42

- 書目（PMC XML 作者欄核對）：Jason Geller（University of Alabama-Birmingham，心理系）、Shana K. Carpenter、Monica H. Lamm、Shuhebur Rahman、Patrick I. Armstrong、Clark R. Coffman（以上 Iowa State University）。Prequestions do not enhance the benefits of retrieval in a STEM classroom. *Cognitive Research: Principles and Implications*, 2017, 2:42. DOI 10.1186/s41235-017-0078-z。2017-10-25 刊出，CC BY 4.0。
- 原文檔：`.research/raw/learning-content/pub5/geller2017-pmc.txt`（XML 轉文字，19 行、65,664 位元組、65,176 字元；正文幾乎全在少數幾行長行裡，下面位置一律用字元位置）；XML：`geller2017-pmc.xml`（113,311 位元組）。
- 取得網址：https://pmc.ncbi.nlm.nih.gov/articles/PMC5655599/ （Europe PMC fullTextXML）。PMC 開放取用，出版者 CC BY，合法。
- 版本：刊出版（PMC 收錄的出版者 XML）。
- 讀取日期：2026-10-14
- 供哪幾篇使用：系列第 1 篇（證據）的轉引核對；對照 `teaching-text/pan_carpenter2023.md` 第 220 行 (c)。

## 研究設計

- 類型：真實課堂中的受試者內比較（題目類型為受試者內變項）；題目沒有隨機分派或平衡（字元 22,890 附近「questions could not be randomly assigned or counterbalanced across question type」），改用題目難度當共變數。
- 受試者：Iowa State University 化學工程「Material and Energy Balances」課，二年級化工主修。77 人選課，3 人退選、12 人不同意使用資料，剩 62 人（字元 18,455–19,200）。課堂比較分析 59 人，每週小考分析 57 人（各因缺資料排除）。
- 課程情境：每週三次、每次 50 分鐘、15 週；採團隊導向學習（team-based learning），課堂有短講解與小組應用題；每次課前要讀指定教材（字元 19,200–20,600）。
- 教材與題目：三個內容單元各選 5 堂、共 15 堂；每堂從 AIChE Concept Warehouse 選三題選擇題（概念題，常要套用物理定律推理），彼此概念獨立、難度盡量對齊；對不齊時把最難的當讀前題、最容易的當「只在小考出現」題；難度差距讀前題到新題不超過 0.10、到小考題不超過 0.30（字元 20,612–25,400）。
- 流程（字元 25,863–33,000）：
  - 課堂開頭：用 clicker 答一題讀前題，**不給回饋**，接著評信心、熟悉度、讀了多少指定教材。
  - 課堂最後約 10 分鐘：同一題再考一次（稱 postquestion，選項重排）並評信心，老師公布答案並簡短解釋；再考一題新題（new question）並評信心，同樣公布答案與解釋。
  - 每週五課後釋出線上小考，週日晚上 10 點截止：含讀前題（postquestion）、新題、從未出現的同堂第三題（quiz-only），交卷後顯示正確答案與解釋。只算第一次作答。
  - 第一堂（第 1 週）是練習，不分析，共分析 14 堂。
- 比較：
  1. 課末：postquestion（讀前考過一次）對新題（沒有讀前題）→ 讀前提問的效果。
  2. 每週小考：新題對小考題 → 提取練習的效果；postquestion 對新題 → 讀前題是否加大提取練習的效果。
- 統計：t 檢定（共變數為題目難度），不顯著的比較附 Bayes factor（BF01）。

## 結果（逐項）

| # | 結果 | 數字 | 對照條件 | 位置 | 字元位置（約） | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 讀前題答對率 | 0.35（SD 0.15），高於猜對機率 26.5%，t(58) = 4.01，d = 0.74 | 對機率 | Results，圖 3 前 | 36,300–36,900 | 「reflecting some prior knowledge of the material at the time of the prequestions」 |
| 2 | 同一題課前到課末 | 顯著進步，t(58) = 4.50，p < 0.001，95% CI [0.058, 0.15]，d = 0.65 | 讀前題對 postquestion | Results | 36,900–37,300 | 「students improved significantly at answering the same question from the beginning of class to the end of class」 |
| 3 | 課末：讀前考過的題目對新題 | 沒有顯著差異，t(58) = 1.52，p = 0.13，95% CI [−0.029, 0.219]，d = .35，BF01 = 3.20 | postquestion 對新題 | Results | 37,300–37,700 | 「indicating that students did not show greater memory for prequestioned information relative to non-prequestioned information」 |
| 4 | 題目難度的影響 | 不顯著，ts < 1.43，ps > 0.15，BFs01 > 3 | 共變數 | Results | 37,700–37,885 | — |
| 5 | 信心評分 | 讀前 2.70 → 課末 2.97，t(58) = 7.04，d = 0.66；課末 postquestion 2.97 對新題 2.60，t(58) = 8.92，d = 0.88 | — | Predictors | 38,700–39,200 | — |
| 6 | 預測課末答對的迴歸（表 1） | 五個預測變項 R² = 0.20，F(5, 51) = 2.64，p = 0.034；只有讀前答對與否顯著，β = 0.447，SE 0.137，p = 0.001；讀前信心 0.102（p = 0.528）、GPA 0.131（p = 0.330）、熟悉度 −0.134（p = 0.415）、閱讀量 0.068（p = 0.626），BF01 都 < 3 | — | Predictors、表 1 | 39,200–40,716 | 「No evidence emerged that prequestion confidence, or any of the other predictors, was significantly related to postquestion accuracy.」 |
| 7 | 新題答對的迴歸 | 沒有預測變項顯著，ts < 1.30，ps > 0.20 | — | 同上 | 40,716–41,033 | — |
| 8 | 每週小考：提取練習效果 | 新題勝過小考題，t(56) = 6.38，p < 0.001，95% CI [0.190, 0.362]，d = 1.35；postquestion 勝過小考題，t(56) = 4.03，95% CI [.132, .389]，d = 0.93 | 新題、postquestion 對從未考過的題 | 讀前題對提取練習、圖 4 | 43,300–43,800 | 「Consistent with the benefits of retrieval practice, testing students at the end of class boosted performance on those same questions on the weekly quizzes.」 |
| 9 | 每週小考：讀前題有沒有加大提取練習效果 | 沒有，t(56) = 0.77，p = 0.44，95% CI [−0.043, 0.097]，d = 0.16，BF01 = 7.20 | postquestion（課前＋課末考過）對新題（只課末考過） | 同上 | 43,800–44,100 | 「indicating that prequestions did not enhance the benefits of retrieval practice」 |
| 10 | 摘要「Significance」段的 30% | 課末考過的內容在之後小考上「remembered 30% better」 | 對同堂沒考過的內容 | Significance | 5,000–5,100 | 「material that was tested at the end of class was remembered 30% better on a later review quiz」 |
| 11 | 作者對差異的解釋（推測） | 課堂內容長且複雜、50 分鐘難以維持注意；讀前題不給回饋；題目需計算推理 | — | Discussion | 45,719–46,200、50,063–51,800 | 「prequestions may be better suited for brief segments of information from class, similar to the benefits of interpolated testing」 |
| 12 | 作者的實務建議 | 課堂時間有限時，練習題留到上完課再問 | — | Conclusions | 52,917–53,900 | 「practical advice may be to withhold practice questions at the beginning of class and reserve them until after the lesson」 |

圖 3、圖 4 的各組平均答對率沒有寫在正文，PMC XML 只有圖說，本紀錄沒有各組平均。

## 作者自己列的限制

- 題目沒辦法隨機分派或平衡到各題型，只能對齊難度並放共變數（字元 22,890 附近）。
- 小考考的是課堂出現過的同一題，成績可能來自記住題目與答案；沒有測更高層次理解或遷移（字元 48,823–49,300）。
- 信心與後來答對沒有關係這一點要保留：本研究整體沒有讀前效果，迴歸裡的 Bayes 證據也只是弱（字元 52,000–52,600）。

## 與摘要說法不一致的地方

- 摘要說「prequestions do not appear to enhance learning」。正文課末比較是不顯著，但點估計 d = .35、95% CI [−0.029, 0.219]，BF01 = 3.20 只剛過 3；讀數方向偏向讀前考過的題目，只是不顯著。討論段寫「Bayesian analyses, which revealed substantial evidence in favor of the null hypothesis」（字元 49,700 附近），對課末那一項是勉強的（3.20）。每週小考那一項 BF01 = 7.20 才較明確。
- 表 1 的 GPA 一列 β = 0.131、SE = 0.035，若 SE 與 β 同尺度，比值近 3.7，卻報 p = 0.330；閱讀量一列也類似。可能 β 是標準化、SE 是非標準化，原文沒說明。不影響主要結論，但不要引表 1 的 SE。
- 「Significance」段的「30% better」沒有在正文給出對應的平均數，正文只有 CI [0.190, 0.362]；30% 的計算方式原文沒交代。

## 與清單「要撐的結論」不合的地方

清單 E-5：「『兩個課堂研究』之一：讀前問一題加課後再考，和只課後考沒有差別」。

- 撐得住（結果 9：每週小考上 postquestion 對新題，p = 0.44，BF01 = 7.20）。
- 要補的條件：讀前題不給回饋、課末再考時有公布答案與解釋；題目是化工概念選擇題；比的是「同一個人身上的不同題目」，題目沒有平衡；延後測驗是同週的線上小考，最多約一週後（週五釋出、週日截止）。
- 課末那一項（讀前題本身有沒有讓課末答得較好）也不顯著，但效果量 d = .35、證據只是勉強支持虛無。

## 已發佈文章引用核對

對象：`src/content/posts/learning/2026-10-13-teaching-text-evidence.md`（現行行號；清單寫的 216、240 已位移成 218、242）。

1. 第 242 行：「兩個課堂研究裡，讀前問一題加課後再考，和只在課後考沒有差別。」
   → **與 Geller 2017 一致**（結果 9）。
   → 精確度的保留：「沒有差別」是不顯著加 BF01 = 7.20，可以這樣寫。若要更細，應補「讀前題沒有附答案；課後再考時有公布答案」，因為作者自己把「讀前沒給回饋」列為可能原因之一（結果 11）。
2. 第 218 行：「Pan 與 Carpenter 轉述的……兩個課堂研究……原研究我都沒有讀。」→ 現在已讀 Geller，這句要改。

對 Pan 與 Carpenter 的轉述（`.work/teaching-text-research/seq/pan_carpenter2023.txt` 第 455–463 行）：

- 「undergraduate students attempted a single pre-instruction question prior to a given lecture」：一致，只是這門課是團隊導向學習，課堂以小組練習為主、講授只占一部分，「lecture」是概稱。
- 「then attempted that question again at the end of the lecture … Another, previously unpracticed question was also included at the end of lecture」：一致。
- 「On a posttest occurring up to one week later」：一致（每週小考，週五釋出、週日截止）。
- 「Performance was not significantly better for the question that had been practiced twice」：一致（結果 9）。
- 「The authors of both studies … speculated that how pre-instruction testing was implemented and characteristics of the course materials may have been factors」：一致（結果 11：沒給回饋、內容長且複雜）。

## 讀取紀錄

- 字元 0–16,000（後設資料、摘要、Significance、Background 前半）、16,000–34,000（Background 後半、Methods、Procedure、Results 開頭）、34,000–52,000（分析方法、三組結果、表 1、Discussion 大半）、52,000–65,176（Discussion 末、Conclusions、附註、致謝、參考文獻掃過），依序讀完。
- 表 1 是 XML 轉文字後的一列一格，逐列對過 XML 中的 `table-wrap`（全文只有這一張表），五列數字與 R² 都相同。圖 1–4 只有圖說，沒有數值。
