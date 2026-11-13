# 抽取紀錄：Shah 等 2023，An Empirical Evaluation of Live Coding in CS1（ICER '23）

- **書目**（對 PDF 首頁核過）：Anshul Shah、Emma Hogan、Vardhan Agarwal、John Driscoll、Leo Porter、William G. Griswold、Adalbert Gerald Soosai Raj (2023). An Empirical Evaluation of Live Coding in CS1. In *Proceedings of the 2023 ACM Conference on International Computing Education Research V.1 (ICER '23 V1)*, August 07–11, 2023, Chicago, IL, USA, pp. 476–494（19 頁）。DOI 10.1145/3568813.3600122。七位作者都在 University of California, San Diego。CC BY 4.0。
- **版本**：刊出版（ACM 出版者 PDF）。
- **原文檔**：`.research/raw/learning-content/q2-interactive/shah2023-livecoding.pdf`（19 頁）、`shah2023-livecoding.txt`（不帶 `-layout` 的 `pdftotext`，2,177 行、88,525 字元）。同目錄的 `shah2023-livecoding.html` 只是 ACM 的防機器人頁（472 位元組），沒有內容。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 3（程式碼）#5
- 下文行號是 `shah2023-livecoding.txt` 的行號，頁碼是論文頁碼（476–494）。文字檔裡所有表格都被拆成一格一行、欄位錯開，**下面每張表的數字都是對 PDF 頁面影像讀的**。

## 研究設計

- **類型**：準實驗，處理組對對照組，沒有隨機分派（L358「We ran a quasi-controlled experiment」；L1775–1777）。
- **場域**：UC San Diego 的 CS1（Python），2022 年秋季。全課 538 人自己選三個講課班，其中兩班由同一位老師教，拿這兩班比較（L358–371，p.479）。選課時學生不知道哪班用哪種教法。
- **兩個條件**（4.2 節，L384–L484）：
  - 靜態程式組（9:30 那班）：老師放寫好的程式碼投影片，在上面手寫註記——畫記憶體圖、把重要的行畫線、列出迴圈每一輪的值（Fig. 1a）。
  - 現場寫程式組（11:00 那班）：老師在 IDE 開 Python 檔當場打，邊打邊說想法；有時從樣板程式開始；刻意分小步加程式、用 print 追蹤變數；有時刻意撞錯再示範除錯（Fig. 1b）。依循 Brown 與 Wilson 的建議。
  - 兩班同一位老師、同樣內容、同樣的參與活動、同樣的作業與考試，都有錄影可回看。作者寫「唯一差別是上課時間與程式範例的呈現方式」（L390–392）。老師兩種教法都教過很多次。
  - **劑量**：一週兩堂 80 分鐘的課；作者在討論段說程式範例只佔講課時間的一半（L1684–1688「within the lectures themselves, code examples make up only half of the time」）。除講課外每週還有實習、作業、練習單、線上教科書的閱讀測驗（Table 1，p.480）。
- **受試者**：同意參與研究的學生，靜態組 115 人（該班的 63.1%）、現場組 110 人（62.5%）（L509–511）。Table 2（p.482）：
  - 有程式經驗：現場組 48.1%、靜態組 48.7%。
  - 年級：大一 47.7% 對 52.6%；大二 23.9% 對 21.9%；大三 17.5% 對 13.2%；大四 9.2% 對 8.8%；大五 1.8% 對 3.5%。
  - 自評能修好這門課的信心（1–5）：現場組 1.8%／5.5%／44.5%／37.3%／10.9%；靜態組 4.3%／11.3%／36.5%／38.3%／9.6%。
  - 能接受的最低學期成績：現場組 A 級 61.7%、B 級 32.2%、C 級 6.1%；靜態組 50.9%、46.4%、2.7%。
  - 入學 GPA：現場組 3.85、靜態組 3.87，t 檢定不顯著（沒給統計量，L539–543）。
  - 現場組信心略高、想要的成績略高，作者說因為其他背景相近所以不擔心（L536–548）。
- **出席**：14 堂必修的講課，兩組出席率都在約 80–95% 之間（Fig. 2，p.481，只有折線圖沒有數字表）。
- **中斷**：學期最後兩週因助教罷工停課，停課期間沒有講課、實習、作業；之後只有期末程式挑戰、期末考、教學評量（L486–495）。
- **量了什麼、何時量**（Table 3，p.482）：
  - RQ1 寫程式的過程：在監考環境下做的「coding challenges」，每次按 Run／Submit 都留快照。7 次短的（上課中、10 分鐘、1–2 個函式；其中 1 次是找出並修正語意錯誤的除錯題）、1 次中的（15 分鐘、改版 Rainfall 問題）、1 次長的（40 分鐘、兩個要寫巢狀迴圈的函式）。只有長的那次算成績，其餘只算參與（L561–589）。指標：MID（漸進開發量尺，越低越好）、RED（重複錯誤密度，越低越好）、每次執行新增的 print 數、正確率、到正確為止的分鐘數與編譯次數。
  - RQ2 成績：6 次程式作業、6 份練習單、期中考（2 小時）、期末考（3 小時），兩次考試都是現場監考。練習單與考試的題目依 Venables 等人的分類歸成五類（Table 4，p.483）：基本題（練習單 3、期中 4、期末 7）、寫程式（4、2、4）、追蹤含迴圈（5、2、7）、追蹤不含迴圈（7、7、6）、解釋程式（13、0、0）。
  - RQ3 上課感受：(a) 期中隨作業發的必填問卷，兩題開放題（哪些地方有幫助、有什麼改進建議），靜態組 97 份（同意者的 84%）、現場組 94 份（85%）；兩位編碼者開放編碼，第三輪的 kappa：好處 0.70、缺點 0.91（L915–944）。(b) 學校官方的期末匿名教學評量，靜態組 107 人、現場組 95 人填答，取兩題五點量表：「Lectures hold your attention」「Instructor's lecture style facilitates note-taking」（L945–962）。
- **統計**：兩樣本 t 檢定為主；正確率用比例 z 檢定；除錯題的生產力因人少用 Mann-Whitney U；評量兩題用卡方趨勢檢定；開放題編碼結果不做推論統計。同一族的檢定在 p < .05 時才套 Holm-Bonferroni 校正（L824–826）。效果量門檻採 Funder 與 Ozer：0.05 很小、0.10 小、0.20 中、0.30 大（L987–991）。正的效果量代表現場組較好（L991–994）。

## 結果（逐項）

### RQ1 寫程式的過程（6.1 節，p.484–485）

| # | 指標 | 現場組 | 靜態組 | 檢定 | 表 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | MID，短題（1 個函式），越低越好 | N = 108，M = 1.447（SD 1.374） | N = 114，M = 1.562（SD 1.227） | t = 0.656，p = 0.513，效果量 0.088 | Table 5 | 「Across one-function and two-function challenges, there was no statistically significant difference between the two groups.」（L1007–1009） |
| 2 | MID，較長題（2 個函式） | N = 107，M = 1.376（SD 0.986） | N = 111，M = 1.446（SD 1.047） | t = 0.503，p = 0.616，效果量 0.068 | Table 5 | 同上 |
| 3 | RED，TypeError，越低越好 | N = 110，M = 0.145（SD 0.357） | N = 115，M = 0.169（SD 0.382） | t = 0.494，p = 0.622，效果量 0.066 | Table 6 | 「For all the comparisons we made, there were not any statistically significant differences and very small effect sizes.」（L1016–1018） |
| 4 | RED，SyntaxError | N = 110，M = 0.177（SD 0.363） | N = 115，M = 0.176（SD 0.295） | t = −0.021，p = 0.983，效果量 −0.003 | Table 6 | 同上 |
| 5 | RED，NameError | N = 110，M = 0.069（SD 0.143） | N = 115，M = 0.073（SD 0.162） | t = 0.212，p = 0.832，效果量 0.028 | Table 6 | 同上 |
| 6 | 每次執行新增的 print 數 | N = 109，M = 0.065（SD 0.073） | N = 115，M = 0.064（SD 0.098） | t = 0.048，p = 0.961，效果量 0.007 | Table 6 | 「The difference between the groups in terms of the number of print statements added per run was also trivial.」（L1018–1019） |
| 7 | 期末程式挑戰（40 分鐘、算成績）正確率 | N = 99，64.6% | N = 103，57.3% | z = 1.072，p = 0.284，效果量 0.151 | Table 7 | — |
| 8 | 除錯挑戰（10 分鐘、不算成績）正確率 | N = 81，25.9% | N = 78，14.1% | z = 1.859，p = 0.063，效果量 0.299 | Table 7 | 「The rate of correctness in the live-coding group was 11.8% percentage points higher on the debugging challenge with an effect size of 0.299. However, the difference between the groups was not statistically significant.」（L1021–1023） |
| 9 | 期末挑戰到正確為止的分鐘數（只算做對的人） | N = 64，M = 13.715（SD 8.655） | N = 59，M = 16.111（SD 8.379） | t = 1.539，p = 0.126，效果量 0.278 | Table 8 | 「Though the time until a correct implementation was about 2 minutes lower—an effect size of 0.278—for the live-coding group, on average, we ultimately saw no statistically significant difference based on the p-values.」（L1026–1028） |
| 10 | 期末挑戰到正確為止的編譯次數 | N = 64，M = 16.492（SD 13.855） | N = 59，M = 17.745（SD 12.395） | t = 0.521，p = 0.603，效果量 0.095 | Table 8 | 同上 |
| 11 | 除錯挑戰到正確為止的分鐘數 | N = 21，M = 5.36，中位數 5.81，IQR 3.73 | N = 11，M = 6.25，中位數 6.31，IQR 1.41 | U = 102，p = 0.606，效果量 0.117 | Table 9 | — |
| 12 | 除錯挑戰到正確為止的編譯次數 | N = 21，M = 6.00，中位數 4.00，IQR 4.00 | N = 11，M = 8.45，中位數 7.00，IQR 2.50 | U = 65，**p = 0.046**，效果量 0.437；校正後不顯著 | Table 9 | 「There was no significant difference in the minutes or compilations until a correct implementation after applying a Holm-Bonferroni correction」（L1030–1032） |

- 13. 在程式作業（可找人幫忙、雜訊較大）的資料上重做同樣分析，也不顯著，數字沒有報告（L1000–1004）。
- 注意方向：#7–12 這六項生產力指標全都偏向現場組，其中 #8、#9、#12 的效果量照作者自己採用的門檻屬中到大（0.278–0.437），只是都沒過顯著門檻（#12 是校正前過、校正後沒過）。除錯題做對的只有 21 人對 11 人。作者在 7.1 節的寫法是「had a slightly higher rate of correctness on the final and the debugging coding challenges, though not statistically significant」（L1660–1662）。

### RQ2 成績（6.2 節，p.486–487）

Table 10（練習單，六份合計，各題型平均正確率）：

| 題型 | 現場組（N = 108） | 靜態組（N = 115） | t | p | 效果量 |
|---|---|---|---|---|---|
| 基本題 | 0.906（SD 0.147） | 0.886（SD 0.159） | 0.986 | 0.325 | 0.132 |
| 解釋程式 | 0.888（SD 0.155） | 0.884（SD 0.137） | 0.196 | 0.845 | 0.026 |
| 追蹤（含迴圈） | 0.813（SD 0.215） | 0.819（SD 0.211） | −0.183 | 0.855 | −0.025 |
| 追蹤（不含迴圈） | 0.877（SD 0.173） | 0.857（SD 0.169） | 0.834 | 0.405 | 0.112 |
| 寫程式 | 0.724（SD 0.268） | 0.715（SD 0.245） | 0.260 | 0.795 | 0.035 |

Figure 3（考試各題型正確率，只有長條圖上的百分比，沒有檢定數值）：

| 題型 | 期中 現場／靜態 | 期末 現場／靜態 |
|---|---|---|
| 基本題 | 91.17%／91.03% | 88.21%／89.05% |
| 追蹤（含迴圈） | 68.14%／65.33% | 71.36%／70.13% |
| 追蹤（不含迴圈） | 83.03%／82.25% | 87.33%／88.88% |
| 寫程式 | 82.57%／81.04% | 75.73%／76.73% |

- 14. 練習單：「None of our p-values indicate statistical significance.」（L1041–1042）
- 15. 考試：「None of the comparisons showed any significant p-values or effect sizes greater than the threshold for a small effect.」（L1043–1044）考試沒有解釋程式題。

Table 11（成績，滿分 100；現場組 N = 110、靜態組 N = 115）：

| 項目 | 現場組 M（SD） | 靜態組 M（SD） | t | p | 效果量 |
|---|---|---|---|---|---|
| 程式作業 | 93.363（12.134） | 93.507（10.865） | −0.094 | 0.926 | −0.012 |
| 練習單 | 89.663（15.499） | 88.664（13.404） | 0.514 | 0.607 | 0.069 |
| 期中考 | 82.539（16.397） | 81.632（15.081） | 0.429 | 0.668 | 0.057 |
| 期末考 | 78.789（19.993） | 79.385（18.183） | −0.231 | 0.817 | −0.031 |
| 學期總成績 | 89.094（13.231） | 88.855（13.274） | 0.135 | 0.892 | 0.018 |

- 16. 「The results suggest that there was no significant difference in academic performance throughout the course. Accordingly, we only see very small or negligible effect sizes.」（L1047–1048）

### RQ3 上課感受（6.3 節，p.487–489）

Figure 4（期中開放題「哪些地方對你的學習有幫助」，各標籤佔該組回答的比例；一則回答可有多個標籤；無推論統計）：

| 類別 | 標籤 | 靜態組（97 份） | 現場組（94 份） |
|---|---|---|---|
| 讀懂程式 | 逐段拆解 | 23.71% | 14.89% |
| | 正確程式的參照 | 20.62% | 9.57% |
| | 整體理解程式 | 16.49% | 0.00% |
| 寫程式的過程 | 寫程式時的思考過程 | 7.22% | 9.57% |
| | 除錯／避免錯誤 | 6.19% | 13.83% |
| | 寫程式 | 4.12% | 11.70% |
| | 測試程式 | 0% | 7.45% |
| 範例的特色 | 老師的講解 | 8.25% | 13.83% |
| | 程式的變化版本 | 2.06% | 7.45% |
| | 預測輸出 | 2.06% | 3.19% |
| | 看到輸出 | 5.15% | 0.00% |
| 上課體驗 | 跟著老師一起做 | 3.09% | 8.51% |
| | 記筆記 | 0.00% | 2.13% |
| | 小組學習 | 1.03% | 5.32% |
| 應用 | 抽象概念的應用 | 13.40% | 2.13% |

Figure 5（期中開放題「有什麼改進建議」）：

| 類別 | 標籤 | 靜態組 | 現場組 |
|---|---|---|---|
| 步調 | 慢一點 | 2.06% | **18.09%** |
| | 快一點 | 1.03% | 1.06% |
| 講課層次 | 多一點互動 | 6.19% | 7.45% |
| | 多一點範例 | 4.12% | 7.45% |
| | 把範例放上網 | 2.06% | 5.32% |
| | 更有條理 | 1.03% | 1.06% |
| | 用現場寫程式 | 3.09% | 0.00% |
| 範例的呈現 | 多解釋 | 8.25% | 12.77% |
| | 展示過程 | 5.15% | 2.13% |
| | 多一點註解文件 | 5.15% | 2.13% |
| | 附其他資源 | 2.06% | 0.00% |
| | 註記寫好一點 | 10.31% | 0.00% |
| | 顯示輸出 | 5.15% | 0.00% |
| 範例的內容 | 更像作業 | 4.12% | 4.26% |
| | 多一點程式變化 | 9.28% | 5.32% |
| | 難一點的範例 | 6.19% | 4.26% |
| | 多一點 bug | 5.15% | 1.06% |
| | 少一點 bug | 0.00% | 1.06% |
| 沒有建議 | 沒有 | 23.71% | 34.04% |

（Fig. 5 的標籤文字與附錄 Table 13 的碼本略有出入：圖上寫「post examples online」「show other resources」，碼本寫「make examples easier to see later」「show references to textbook chapters」。）

- 17. 「almost one-fifth (18%) of responses from the live-coding group mentioned that the instructor should slow down in the live-coding group, whereas only 2% of responses from the static-code group mentioned that the instructor should slow down.」（L1064、L1601–1603）18.09% 換算是 94 份中的 17 份，2.06% 是 97 份中的 2 份（我的換算）。
- 18. 靜態組較常提：加註解文件、展示寫的過程、多一點變化（L1604–1607）。現場組沒有建議的比例較高（34.04% 對 23.71%），原文沒有評論這一點。
- 19. 好處方面：靜態組較多人提「讀懂程式」類，現場組較多人提「寫程式的過程」類（L1059–1062）。

Figure 6（期末匿名教學評量，五點量表各選項比例）：

| 題目 | 組別 | 非常不同意 | 不同意 | 普通 | 同意 | 非常同意 |
|---|---|---|---|---|---|---|
| 講課能抓住你的注意力 | 現場組 | 1.09% | 5.43% | 15.22% | 32.61% | 45.65% |
| | 靜態組 | 0.95% | 0.95% | 10.48% | 32.38% | 55.24% |
| 老師的講課方式方便記筆記 | 現場組 | 2.20% | 12.09% | 26.37% | 21.98% | 37.36% |
| | 靜態組 | 0.97% | 5.83% | 18.45% | 30.10% | 44.66% |

- 20. 原文的檢定結果（L1614–1640）：「A Chi-square test of trend for both evaluation items revealed an association between the type of lecture example and students' feeling that lectures held attention and facilitated note-taking. We obtained p-values < 0.001 when applying this test, indicating that students in the live-coding group were more likely to disagree that lectures held attention or facilitated note taking.」沒有給卡方值與自由度。
- 合計（我由 Fig. 6 相加）：注意力題同意＋非常同意，現場組 78.3%、靜態組 87.6%；不同意＋非常不同意，現場組 6.5%、靜態組 1.9%。筆記題同意＋非常同意，現場組 59.3%、靜態組 74.8%；不同意＋非常不同意，現場組 14.3%、靜態組 6.8%。也就是兩組都以同意居多，差在現場組同意的人少約 9 與 15 個百分點。

### 討論與結論段的說法（7、8 節）

- 「Nearly across the board, we saw a lack of statistically significant differences between the live-coding and static-code groups.」（L1644–1645）有顯著的只有注意力與筆記兩題。
- 「We ultimately conclude that live coding neither improved students' programming process skills based on our chosen metrics nor did it detract from students' performance on traditional assessments.」（L1669–1670）
- 學生說「看到」了過程（思考、寫、除錯、測試），但沒有變成量得到的過程差異；作者的解釋：看到與做得出來之間還有一步，認知師徒制六種方法裡現場寫程式只用到示範一種（L1737–1748）。
- 沒差的可能原因：講課只是學習經驗的一小部分，程式範例只佔講課的一半（L1678–1691）。
- 抱怨的可能原因（作者的推測，沒有資料）：老師同時打字與講解，學生不知道該抄程式還是抄講解；沒有手寫註記，學生抄不到記憶體圖與追蹤表（L1708–1715）。
- 與先前研究一致：Rubin 2013、Soosai Raj 等 2020、Shah 等 2023（遠距版）、Shannon 與 Summet 2015 都沒有成績差異（L1691–1693）。文獻段另記：Rubin 的現場組在大型專題上顯著較高；Soosai Raj 等 2020（印度、資料結構課、180 人）現場組講課中的外在認知負荷較低、前後測無差異（L249–267）。這些是本篇的轉述，不是本篇的資料。
- 結論用語是「might not」：「our findings indicate that live coding might not actually impart the multitude of perceived and intended benefits of the pedagogy identified in prior work」（L1825–1826）。前言把結果稱作「inconclusive」（L134）。

## 作者自己列的限制（7.3 節，L1772–1819）

1. 沒有隨機分派，學生自己選班；比過人口特徵、先備經驗與高中表現，仍可能有其他差異。
2. 教學評量可能有選擇偏誤：感受極端的學生較可能填。
3. 講課以外的學習活動很多，可能蓋掉講課範例的效果；兩週停課期間學生用各種方式複習，影響可能更大。
4. 只是一門 CS1，半數是大一；進階課可能不同。
5. 只評了「老師在課堂上現場寫」這一種形式；學生上台寫、預錄螢幕錄影等變體沒評。
6. 過程資料多在上課中蒐集，代表的是有來上課的學生，不知道對不來上課的學生如何。
7. 絕大多數學生上課帶自己的電腦，資源較少的環境可能不同。

## 與摘要說法不一致的地方

1. **摘要「no statistically significant differences … on programming process metrics」**：字面成立，但省略了方向與大小。六項生產力指標全部偏向現場組，除錯題正確率 25.9% 對 14.1%（p = 0.063，效果量 0.299）、除錯題編譯次數校正前 p = 0.046（效果量 0.437）。除錯題只有 159 人作答、32 人做對，檢定力有限。摘要的「沒有差別」不等於「證明沒有效果」，正文自己用的詞是 inconclusive。
2. **摘要「more students in the live-coding group reported that lectures were too fast and failed to facilitate note-taking」**：摘要沒提「注意力」那一題，前言與 7.1 節有提。「too fast」來自開放題編碼（18% 對 2%），原文明寫這部分不做推論統計（L963）；有檢定的是評量兩題。
3. **評量兩題的 p < 0.001 我重算不出來**：由 Fig. 6 的百分比可以唯一還原出人數（注意力題現場組 1／5／14／30／42 共 92 人、靜態組 1／1／11／34／58 共 105 人；筆記題現場組 2／11／24／20／34 共 91 人、靜態組 1／6／19／31／46 共 103 人，還原後的百分比與圖上完全相同）。用 1–5 分等距計分的 Cochran-Armitage 趨勢檢定重算，注意力題 z ≈ −1.89、p ≈ .058，筆記題 z ≈ −2.06、p ≈ .040，與原文的「p-values < 0.001」差很多。**這是我自己的重算**，原文沒有給統計量、計分方式與軟體，我不確定作者實際怎麼算的；能確定的只有圖上的比例。引用時建議只引比例，不要引 p < 0.001，或註明原文報告的 p 值無法由圖上資料重現。
4. 評量的填答人數：正文寫靜態組 107 人、現場組 95 人填了評量（L949），由 Fig. 6 還原的單題人數是 105／103 與 92／91，差距應是單題未作答，原文沒說明。
5. 評量是學校官方匿名評量，原文沒有說填答者是否限於同意參與研究的 115／110 人；兩班全班人數由同意率回推約 182 與 176 人（我的推算）。所以 RQ3 的評量樣本與 RQ1、RQ2 的樣本不一定是同一批人——不確定。
6. 6.2.1 寫考試各題型「沒有任何效果量超過小效果門檻」，但考試部分只給了 Fig. 3 的百分比，沒有效果量或 p 值可核對。練習單的基本題（0.132）與追蹤不含迴圈（0.112）效果量其實超過作者採用的小效果門檻 0.10，那句話只針對考試，不算矛盾，記下以免誤引。
7. 其餘逐項對過（樣本數、三類結果的方向、限制），沒有。

## 與清單「要撐的結論」不合的地方

清單寫：「**無效果**：現場寫程式對講解寫好的程式，過程指標與成績都沒有差別，多了注意力與筆記的抱怨」。

- **「成績沒有差別」撐得住**：五項成績效果量在 −0.031 到 0.069 之間，p 都在 0.6 以上；各題型也沒有差。
- **「過程指標沒有差別」要改寫成「沒有偵測到顯著差別」**：漸進開發（MID）與錯誤密度（RED）、print 用量確實幾乎為零（效果量 0.09 以下）。但生產力那一組方向一致偏向現場組，除錯題的兩項接近或短暫越過顯著門檻。比較準確的說法是「漸進開發與重複犯錯的指標看不出差別；除錯題現場組做對的比例較高（25.9% 對 14.1%）但未達顯著」。
- **「講解寫好的程式」不夠精確**：對照組不是唸程式，是老師在寫好的程式上手寫註記、畫記憶體圖與追蹤表。兩邊都有老師的口頭講解。學生對靜態組的抱怨之一正是「註記寫好一點」（10.31%）。
- **「多了注意力與筆記的抱怨」要改寫**：
  1. 兩組多數人都同意講課能抓住注意力（78% 對 88%）、方便記筆記（59% 對 75%）；差別是現場組同意的比例較低，不是多數人抱怨。
  2. 原文報告 p < 0.001，但我由圖上資料重算約為 .06 與 .04（見上一節第 3 點），顯著程度存疑。
  3. 清單漏了最大的一項差距：開放題裡 18% 的現場組回答要老師慢一點，靜態組 2%（無檢定）。
  4. 評量是匿名的全班評量，樣本可能不等於研究樣本。
- **適用範圍**：這是課堂講課的比較（同一位老師、一學期、範例只佔講課一半、講課只是課程的一部分）。它不是「文章裡放逐步建構的程式」對「放完成的程式加註解」的比較；要拿來支持文字教材的寫法是類推，作者沒有做這個推論。
- 清單沒提、可能有用的：現場組在開放題中較常說看到除錯、寫的過程、測試（13.83%／11.70%／7.45% 對 6.19%／4.12%／0%），但行為指標沒跟上——「看到示範」與「自己會做」之間有落差，是作者的主要論點。

## 讀取紀錄

- `shah2023-livecoding.txt` 依序讀：L1–60（首頁、作者、摘要前半）→ L60–799（摘要後半、1 前言、2 理論架構、3 相關研究、4 實驗設計、5.1、Table 1–3）→ L799–1558（5.1 統計、5.2、5.3、6 結果、Table 5–11 的文字殘片）→ L1558–2177（Table 11 數字、6.3、7 討論、7.3 限制、8 結論、致謝、參考文獻、附錄 Table 12–13 碼本）。四段首尾相接，涵蓋全檔。參考文獻 L1834–2036 只掃過。
- 對過 PDF 版面：Table 1 與 Fig. 1（p.480）、Fig. 2（p.481）、Table 2–3（p.482）、Table 5–9（p.485）、Table 10 與 Fig. 3（p.486）、Table 11 與 Fig. 4（p.487）、Fig. 5–6（p.488）直接看 PDF 頁面影像；Table 4（p.483）對 `pdftotext -layout` 的輸出。
- 附錄 Table 12、13（碼本，p.493–494）讀的是文字檔，沒有另外對版面；內容是標籤定義，沒有數字。
- 文中註腳連結 `https://bit.ly/allCodingChallenges`（各次挑戰的題目）沒有去開。
