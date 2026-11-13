# 抽取紀錄：Zhu、Raman、Xing & Slotta 2021，Curriculum design for social, cognitive and emotional engagement in Knowledge Building

- **書目**：Gaoxia Zhu（Cornell University，Department of Human Development，通訊作者）、Preeti Raman（University of Toronto，OISE）、Wanli Xing（University of Florida，Educational Technology）、Jim Slotta（University of Toronto，OISE）。International Journal of Educational Technology in Higher Education, 18, Article 37（2021）。2021-03-11 收稿、2021-05-20 接受；Crossref 刊出日 2021-07-30。DOI 10.1186/s41239-021-00276-9。作者全名對 PDF 首頁與 Crossref 核過。
- **版本**：出版者刊出版，CC BY 4.0 開放取用。
- **原文檔**：
  - `.research/raw/learning-content/q5/zhu2021-kb-engagement.md`：Jina reader 轉的 Springer PDF 文字，239 行、66,477 字元（`wc -c` 66,927 位元組）。來源網址 https://link.springer.com/content/pdf/10.1186/s41239-021-00276-9.pdf （檔頭記載）。
  - `.research/raw/learning-content/q5/zhu2021-kb-engagement.pdf`（這次新存，1,700,266 位元組，19 頁）：出版者 SpringerOpen 的 PDF。直接 curl 出版者網址只回 HTML 驗證頁，改從 Wayback 取 Unpaywall 列的出版者 PDF 網址快照：https://web.archive.org/web/20220623100849id_/https://educationaltechnologyjournal.springeropen.com/track/pdf/10.1186/s41239-021-00276-9 （Unpaywall 查詢 email=unpaywall@example.org；標 publisher、publishedVersion、cc-by）。拿這份 PDF 是為了看圖 2–5 的數字，文字的 md 檔沒有。
- **讀取日期**：2026-10-14
- **供哪幾篇 order 使用**：order 20 第 12 列（F 清單）

## 研究設計

- **類型**：設計本位研究（design-based research），單一班級、三個迭代週，**沒有對照組**、沒有前後測成就測驗、沒有推論統計。
- **受試者**：加拿大一所大型公立大學的 23 名教育碩士生，課程「Introduction to Computers in Education」，12 週、每週 3 小時實體課（主動學習教室）＋作業（Participants and course design，p. 4）。
- **介入**：課程採 Knowledge Building 取向，工具有 Google Drive（PDF 共同註解）、Padlet、Nearpod、Knowledge Forum（KF）。研究者在第 3、6、9 週收集學生回饋，據以改下一個焦點週的活動：
  - 第 3 週（學習社群）：課前共同註解文章，課堂上研究者示範 KF 的「rise-above」「build on」；研究者在 KF 先貼了兩個問題。
  - 第 6 週（科技支援公平與社會正義）：依學生建議，課前就在 KF 分享經驗與想法，課堂上找知識缺口、小組綜合後寫回 KF。研究者不再預設問題。
  - 第 9 週（身心健康與全人學習）：同第 6 週，另因學生說 KF 版面「messy」，加了全人學習架構圖當背景來組織筆記（Fig. 1）。
  - 三個焦點週的主題各不相同，知識建構每週重新開始（Discussion 末，p. 17）。
- **資料**（Data collection，p. 6–7）：
  - KF 筆記 259 則，含作者、build-on 關係、誰讀了哪則。
  - 情緒問卷（10 題 1–5 李克特，加 4 題開放題）：第 3 週 8 人填、第 9 週 21 人填，**只分析兩次都填的 8 人**。
  - 3 名學生在第 3、6 週的臉部錄影與螢幕錄影，用 iMotions Emotient 分析。
  - 課後 9 人半結構訪談。
- **分析**（Data analysis，p. 7–10）：
  - 社會網絡：Gephi，有向圖，讀者指向作者，允許多重邊；算密度與度中心性。
  - 內容分析：五大類（評價、提問、理論化、引用、整合），各分簡單／精緻或三種提問（Table 1）。兩人先共同編 30 則，再各自獨立編 30%（79 則），一致率 78.48%，其餘由一人編碼。
  - 情緒：8 人第 3 週與第 9 週比較；9 人訪談開放編碼；3 人 iMotions 比較第 3 與第 6 週各情緒持續時間。

## 結果（逐項）

圖 3–5 的數字原文正文沒寫，下面的百分比與平均是我從 PDF 第 11、13 頁長條圖目測讀出的近似值，引用時要寫「約」，不可當原文數字。

| # | 結果 | 數字 | 對照條件 | 節／圖 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 閱讀網絡密度逐週上升 | 0.57 → 0.74 → 1.09 | 第 3、6、9 週（同一班，無對照） | Social engagement，p. 10；Fig. 2 | 「the reading network density improved over the successive weeks, from 0.57 to 0.74, to 1.09. This indicates that students read more of each other's notes with each successive improvement of our design」 |
| 2 | 被讀最多的筆記從研究者轉向學生 | 無數字 | 第 3 週 vs 第 6、9 週 | p. 10 | 「In week 3, the researcher's notes were the ones most commonly read within the network, whereas in weeks 6 and 9 student-contributed notes became increasingly influential」 |
| 3 | 評價類筆記 | 圖 3 目測：簡單評價約 7.7%、7.5%、10.3%；精緻評價約 6.6%、14%、9.2% | 第 3、6、9 週 | Cognitive advancement，p. 11–12；Fig. 3 | 「In weeks 6 and 9, the students had greater percentages of Simple Appraisal and Elaborated Appraisal than they did in week 3」（第 6 週的簡單評價其實略低於第 3 週，見下方不一致處） |
| 4 | 提問類筆記比例下降 | 圖 3 目測：事實型約 5.5%、1.9%、1.1%；解釋型約 6.7%、5.6%、5.8%；深化型約 12%、8.5%、5.8% | 同上 | p. 12；Fig. 3 | 「the students asked a decreasing percentage of Factual Questions, Explanatory Questions, and Idea-deepening Questions over the weeks, suggesting their tendency to ask fewer questions」 |
| 5 | 理論化 | 圖 4 目測：直覺式約 24%、5.6%、15%；精緻式約 27.5%、41%、31% | 同上 | p. 12；Fig. 4 | 「Compared to week 3, students contributed fewer Intuitive Theorizing notes but more Elaborated Theorizing notes in weeks 6 and 9」 |
| 6 | 引用 | 圖 4 目測：簡單引用約 1%、2.7%、6.9%；精緻引用約 1%、3.8%、10.3% | 同上 | p. 12；Fig. 4 | 「there was an increasing trend of contributing Simple Referencing and Elaborated Referencing, suggesting the students gradually introduced more authoritative resources」 |
| 7 | 整合 | 圖 4 目測：簡單整合約 6.6%、3.8%、第 9 週無長條；精緻整合約 1%、5.6%、4.6% | 同上 | p. 12；Fig. 4 | 「the decrease of Simple Integrating and increase of Elaborated Integrating over the three weeks」（精緻整合第 9 週低於第 6 週） |
| 8 | 學生自述對課程主題的理解 | 只有訪談引語，無量化 | 9 人訪談 | Student learning about course themes，p. 12 | 「Most students who were interviewed indicated that their understanding of computers in education had improved」 |
| 9 | 自評情緒 | 圖 5 目測（1–5 量表）：正向約 3.67 → 3.65；負向約 2.87 → 2.63。沒有統計檢定、沒有標準差 | 8 人，第 3 週 vs 第 9 週 | Survey of student emotions，p. 12；Fig. 5 | 「Students expressed a lower sense of negative emotions across this time span, while their reports of positive emotions remained at a high level」 |
| 10 | 訪談：第 3 週的負面情緒來自新工具與雜亂版面 | 質性 | 9 人 | Interview on student emotions，p. 12–13 | 「learning to use a new tool itself and the messy views left the students with some negative feelings in week 3」 |
| 11 | iMotions 三個個案 | S1、S23 第 6 週喜悅較久；S15 正向沒增加、負向沒消失，作者歸因於滑鼠故障；S23 第 6 週沒有螢幕錄影 | 3 人，第 3 週 vs 第 6 週 | iMotions analysis，p. 13–14 | 「Unlike S1, S15's positive emotions did not increase, and negative emotions did not disappear」 |
| 12 | 作者自己承認密度上升部分可能只是時間 | — | — | Discussion，p. 14 | 「We would expect some degree of increasing reading network density as a simple result of the course progression (i.e., even with no changes to the design)」 |
| 13 | 第 3 週研究者預設兩題也可能造成差異 | — | — | Discussion，p. 15 | 「Another reason may be that the researchers had posted two questions in week 3, to help focus students' discussions, which made the students mainly read and respond to the two questions」 |
| 14 | 作者仍稱「顯示有效」 | — | 對照翻轉教室文獻 | Discussion，p. 15 | 「this study shows the effectiveness of requiring students to contribute ideas and experiences before class and then consolidate and extend those ideas during class」 |

## 作者自己列的限制（Discussion，p. 16–17）

1. 社會、認知、情緒參與的改善**不能完全歸因於**納入學生聲音：「establishing the precise extent of any causal links is not generally attainable through design-based research」。
2. 其他因素：學生越來越熟悉 KF、逐週形成更緊密的學習社群；多名受訪者說熟悉 KF 後才能專心改進想法。
3. 建議未來加入對照班（同一教師教的同一門課）並拉長設計期間。
4. 技術問題（滑鼠故障等）可能干擾參與。
5. 三個焦點週主題不同，知識建構每週重新開始；未來應研究跨較長時間的連貫知識建構。

我另外注意到（不是作者列的）：情緒問卷只有 8/23 人進分析、iMotions 只有 3 人且只比到第 6 週；每週筆記數沒報，所以百分比的分母不明；編碼只有 30% 雙人獨立編、一致率 78.48%，其餘一人編碼；沒有任何統計檢定；作者之一（Slotta）參與課程設計，研究者也在 KF 中貼文。

## 與摘要說法不一致的地方

- 摘要說根據「23 Masters of Education students」的回饋修改活動、結果「their level of negative affect decreased」。情緒問卷只分析了 8 人，負向情緒從約 2.87 降到約 2.63（目測），沒有統計檢定；摘要沒交代 8 人。
- 摘要把結果寫成「refining Knowledge Building activities based on students' feedback impacts their … engagement」與「soliciting students' input into course design can benefit their engagement」，帶因果語氣；正文 Discussion 自己承認不能歸因、密度上升本來就可能隨時間發生。
- 摘要說「they theorized more deeply」：精緻理論化第 9 週（約 31%）只比第 3 週（約 27.5%）略高，高點在第 6 週（約 41%）；直覺式理論化第 9 週又回升到約 15%。
- 摘要說「made greater efforts to integrate ideas」：精緻整合第 9 週（約 4.6%）低於第 6 週（約 5.6%），只是高於第 3 週（約 1%）。正文「increase of Elaborated Integrating over the three weeks」與圖不完全一致。
- 正文說第 6、9 週簡單評價比例高於第 3 週，圖 3 第 6 週（約 7.5%）略低於第 3 週（約 7.7%）。
- 密度定義寫成「the number of edges divided by the maximum number of possible edges」，照這個定義密度不會超過 1；第 9 週報 1.09，應該是因為允許多重邊（Data analysis 寫了「with multiple edges」），但原文沒解釋大於 1 的意思。

## 與清單「要撐的結論」不合的地方

清單寫「knowledge building 的研究拿什麼當結果（掃描時的印象是話語指標，不是對照組成效）」。

- 這一篇撐得住：結果是 KF 筆記的話語編碼百分比、閱讀網絡密度、8 人自評情緒、9 人訪談與 3 人臉部表情；**沒有對照組、沒有成就測驗、沒有推論統計**，作者自己也說設計本位研究無法建立因果。
- 要補一句：唯一涉及「學到什麼」的是訪談中學生自述理解提高（質性、9 人）。
- 不能用這篇推廣到「knowledge building 研究普遍如此」——它只是一個研究；要講整條線的結果指標，需要別的回顧性來源。

## 讀取紀錄

- md 檔依字元區間首尾相接讀：0–24,000（題名、作者、摘要、版權、Introduction、Social/cognitive/emotional engagement、Knowledge Building、Method、Participants、Design-based research、三個焦點週、Data collection、Data analysis、Table 1 前半）→ 24,000–50,000（Table 1 後半、編碼一致率、Findings 全部、Discussion 大半）→ 50,000–54,000（Discussion 末、Acknowledgements、Authors' contributions、Funding、作者單位、收稿日、參考文獻開頭）→ 參考文獻（51,258–66,477）只掃過頭尾，確認之後沒有附錄。
- PDF 第 10–13 頁直接看圖：Fig. 2（三週閱讀網絡）、Fig. 3、Fig. 4（筆記類型百分比）、Fig. 5（8 人正負情緒）。Table 1 是編碼表（類別、說明、例句），沒有數字，md 版文字可讀，沒另對版面。
- Fig. 1（KF 版面截圖）沒有逐項看，只是介面示意。
