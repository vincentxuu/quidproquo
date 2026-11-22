# 抽取紀錄：Davis、Chen、van der Zee、Hauff、Houben 2016，Retrieval Practice and Study Planning in MOOCs（EC-TEL 2016）

- **書目**：Dan Davis、Guanliang Chen、Tim van der Zee、Claudia Hauff、Geert-Jan Houben（作者全名對 PDF 首頁與 Crossref 核過）。2016。Retrieval Practice and Study Planning in MOOCs: Exploring Classroom-Based Self-Regulated Learning Strategies at Scale。收於 *Adaptive and Adaptable Learning*（EC-TEL 2016），Lecture Notes in Computer Science，Springer，頁 57–71。doi 10.1007/978-3-319-45153-4_5。LNCS 卷號檔內與 Crossref 回應都沒有，沒有寫。
- **原文檔**：`.research/raw/learning-content/q4/davis2016-ectel-retrieval-planning.txt`，664 行、40,321 字元（40,521 位元組）。來源網址在檔頭：`https://chauff.github.io/documents/publications/ECTEL2016-davis.pdf`（共同作者 Hauff 的個人頁）。
- **版本**：作者稿（LNCS 樣式，14 頁，沒有出版者頁首與頁碼；刊出版是 57–71 共 15 頁）。內容與刊出版是否逐字相同沒有核對。
- **讀取日期**：2026-10-14
- **版面處理**：單欄，文字檔段落順序正常。同一份 PDF 重抓到 scratch（`…/scratchpad/d17b/ectel16.pdf`），Table 1（第 6 頁）、Table 2（第 10 頁）、Table 3 與 Table 4（第 11–12 頁）、Figure 3–5 都對過 PDF 版面，數字與文字檔一致。
- **供哪幾篇用**：order 17（把複習做進文章）。

## 研究設計

- **類型**：兩個各自獨立的 MOOC 現場實驗，用 edX 的 Cohorts 功能在註冊時隨機分組（L262–265）。兩個課程都是台夫特理工大學開的，2015 年開課；作者自己說選課是「opportunistic」（L240–243）。
- **研究一：提取練習**（Functional Programming，13 週）
  - 註冊 27,884 人、通過率 5.05%；進到分組的 9,836 人（35%），分三組（Table 1，L253–258）。Cohorts 功能啟用前註冊的人沒被分組，作者沒有把他們算進對照組（L266–274）。
  - 三組（L292–306）：(1) 對照組，無介入；(2) 「cued」組，每週最後一支講課影片之後、週測驗之前，出現一個空白文字框與提示「Please respond in 3-5 sentences to the following question: "In your opinion, what are the most important points from the previous video?"」；(3) 「given」組，同一位置給一段由作者之一寫的 3–5 句影片摘要，供被動閱讀。
  - 例外：第 7 週（Functional Parsers and Monads）在三段影片後各放一個提示（L288–291、註 4）。
  - cued 組的回答沒有人看、不評分、沒有回饋（L299–301）。
  - 各組人數只報了 cued 組 3,262 人（L335–336），另兩組沒有寫。
  - 這裡的「提取練習」是看完影片**當下**的自由回想式摘要，不是隔一段時間的複習題，也沒有延遲測驗。
- **研究二：讀書計畫**（Industrial Biotechnology，7 週）
  - 註冊 11,042 人、通過率 4.08%；進到分組的 1,963 人（18%），分兩組（Table 1）。
  - 實驗組 998 人（L339）；對照組人數原文沒寫（1,963 − 998 = 965 是我算的）。
  - 介入：每週導言放一個計畫提示與空白文字框（「describe, in detail, your study plan and desired learning objectives for the week」，附兩個範例），週末再放一個反思提示（L310–330）。
- **量了什麼**：週測驗成績、課程期末成績、工作階段數、在課時間、堅持度（「Final Week Reached」：最後一次看影片或交測驗所在的週）、影片觀看時間、論壇工作階段數。全部取自平台紀錄，沒有課後或延遲測驗。
- **分析用的子樣本（重要）**：
  - 提取練習的成績比較不是全體，只取「highly engaged learners」：第 1 週看影片時間超過該組平均（約 22 分鐘）的人（L345–347）。第二步再把介入組縮到「至少一次看介入內容 10 秒以上」的人（L381–383）。
  - 讀書計畫的 H4 比較，對照組取「highly engaged」（第 1 週看影片超過平均，約 33 分鐘，N = 329），實驗組取「至少點過一次計畫模組」的人（Study Planners，N = 146）以及「highly engaged 但沒碰計畫模組」的人（Non-Planners，N = 262）（L421–425、L463–468）。Study Planners 這一組原文沒有說是否也套用「highly engaged」的門檻。

## 結果（逐項）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文 |
|---|---|---|---|---|---|
| 1 | 提取練習介入的互動率（H1） | cued 組 3,262 人中，2,166 人（66.4%）至少有一次看影片紀錄；719 人（22%）點過任何一個提取提示 | 同一組人：看影片 vs 點介入 | 4，L335–338 | 「Of the 3,262 learners in the "cued" condition in Functional Programming, 2,166 (66.4%) logged at least one video-watching event in the course. Among these same learners only 719 (22%) clicked on any of the retrieval practice interventions.」 |
| 2 | 讀書計畫介入的互動率（H1） | 998 人中 759 人（76.1%）至少看過一次影片；147 人（14.7%）點過任何一個計畫模組 | 同上 | 4，L338–341 | 「Of the 998 learners exposed to the study planning modules in Industrial Biotechnology, 759 (76.1%) logged at least one video-watching event. Among these same learners, only 147 (14.7%) clicked on any of the study planning modules.」 |
| 3 | 提取練習：週測驗成績，三組比較 | 無顯著差異；**沒有報告任何檢定統計量、p 值或各組人數**；圖說寫顯著水準 α = 0.01 | cued vs given vs 對照，僅限 highly engaged 者 | 4.1，L343–350、Fig. 1 | 「The MANOVA test followed by the post hoc Games-Howell (equal variances not assumed) test yielded no significant differences between each group's weekly quiz grade.」 |
| 4 | 提取練習：只看真的看過提示 10 秒以上的人 | 週測驗（MANOVA）與期末成績（單因子 ANOVA）仍無顯著差異；同樣沒有統計量 | 同上，但介入組限縮為實際互動者 | 4.1，L379–389 | 「Using these new group definitions, we still observe no statistically significant differences between the groups … In turn, we fail to reject the null hypothesis of H2 in terms of both weekly quizzes and final course grades.」 |
| 5 | 讀書計畫：曝光的效果（H3） | 期末成績、堅持度與「many engagement metrics」無顯著差異；沒有統計量 | 實驗組全體 vs 對照組全體 | 4.2，L415–419 | 「found no significant differences in their final grades, course persistence, and many engagement metrics, thus leading us to fail to reject the null hypothesis of H3.」 |
| 6 | Study Planners 的工作階段數（Table 2） | 中位數 25.0 對 19.0，Mann-Whitney U = 20,070，p = 0.003 | 點過計畫模組者（N=146）vs 對照組 highly engaged 者（N=329） | L428–435、Table 2 | 「the study planners have a higher session count than the highly engaged learns (U =20,070, p=0.003)」 |
| 7 | Study Planners 的在課時間（Table 2） | 中位數 18.6 小時對 13.1 小時，U = 19,983，p = 0.002 | 同上 | L434–435、Table 2 | 「as well as a higher total amount of time spent in the course in hours (U =19,983, p=0.002).」 |
| 8 | 作者對 #6、#7 的另一種解讀 | — | — | L436–439 | 「An alternative interpretation, however, could be that students who are highly engaged with the course also tend to engage more with the planning intervention.」 |
| 9 | 堅持度（最後到達週） | ANOVA F(2,734) = 21.66，p < 0.001；Study Planners N=146、M = 4.60；對照 highly engaged N=329、M = 3.84（p < 0.001）；Non-Planners N=262、M = 3.28（p < 0.001） | 三組事後比較（Games-Howell） | L463–468 | 「the group who engaged with the study planning module (N=146, M=4.60) persisted deeper into the course than highly engaged learners in the control group (N=329, M=3.84, p<0.001) and highly engaged learners who were exposed to, but did not engage with, the study planning module (N=262, M=3.28, p<0.001).」 |
| 10 | 期末成績（Table 3） | ANOVA F(2,735) = 17.147，p < 0.001；Study Planners M = 46.42；對照 M = 36.44（差 9.98，p = 0.003）；Non-Planners M = 29.10（差 17.32，p < 0.001） | 同上 | L471–479、Table 3 | 「learners who engaged with the study planning module (M=46.42) earned higher grades than the highly engaged learners in the control group (M=36.44, p=0.003) and highly engaged learners who did not engage with the intervention (Non-Planners, M=29.10, p<0.001).」 |
| 11 | 計畫文字長度與投入的相關（Table 4） | Pearson r：總在課時間 0.361（N=176）、工作階段數 0.268（N=176）、平均工作階段長度 0.346（N=176）、看影片時間 0.346（N=170）、論壇工作階段 0.305（N=154）；皆在 α = 0.01 顯著 | Study Planners 內部 | L516–532、Table 4 | 「increases in the amount of text learners write in the study planning module are correlated with small-to-moderate increases in a number of key course engagement metrics.」 |
| 12 | 總結 | — | — | L572–578 | 「mere exposure to study planning and retrieval practice interventions is not sufficient to significantly increase learner engagement or final grades. Only when narrowing the samples to learners who actually engaged with the study planning intervention do we see significant results. However, the same does not apply for learners who engaged with the retrieval practice cues, where even learners who engaged with the retrieval cues show no significant difference in any measure of performance.」 |

## 作者自己列的限制

- 不順從：只有 14%–22% 的人實際碰了介入（L587–589：「given that between 14%–22% of the learners meet this criteria in our studies, we too note the "non-compliance" described in [1] as a problem.」）。
- 介入的頻率與時序不理想：提取練習應該更連續、留更多延遲（L590–592：「future testing of retrieval practice should be made more continuous and incorporate more lag time」）。
- 介入不夠顯眼；未來要做得更醒目或改成必做（L593–597）。
- Study Planners 的優勢可以有反向解讀（投入高的人本來就比較會去填計畫，L436–439）。
- Cohorts 功能無法回溯分組，只有 35% 與 18% 的註冊者進了實驗（L266–274）。
- 兩門課是就手邊有的選（L241–243）。
- 原文沒有獨立的限制節；沒有討論「只分析 highly engaged 子樣本」這個做法本身的問題。

## 與摘要說法不一致的地方

1. **摘要說「we do not confirm our hypothesis」，但四個假設裡 H1 得到支持、H4 作者也寫「in support of H4 at the 99% confidence level」**（L334、L419–420）。沒被支持的是 H2（提取）與 H3（計畫曝光）。摘要那句指的是全文的總假設（小改動能教會自我調節策略），不是正文編號的假設。
2. **結論把自我選擇的差異寫成「increases」**。結論寫「Only when accounting specifically for learners who engaged with the intervention directly do we observe significant increases in final grades and engagement」（L585–587），但那是「自己選擇去填計畫的人」對「對照組的高投入者」的比較，不是隨機分派的效果；正文 L436–439 自己也提了反向解讀，而且只針對投入指標提、沒有對成績與堅持度提。
3. **互動率的分母與敘述不符**。原文寫「Among these same learners only 719 (22%)」，「these same learners」文法上指那 2,166 位看過影片的人，但 719／2,166 = 33.2%，719／3,262 = 22.0%，所以 22% 的分母其實是整個 cued 組。讀書計畫同理：147／759 = 19.4%，147／998 = 14.7%。引用時要寫明分母是「被分到該組的全部人」。
4. **人數前後不一致**：點過計畫模組的人，L341 寫 147、L430 與 L465 寫 N = 146、Table 4 的相關分析 N = 176（比 147 還多，原文沒有解釋）。兩個 ANOVA 的自由度也差一（F(2,734) 對 F(2,735)，三組人數 146＋329＋262 = 737 對應前者）。
5. **提取練習的「無差異」完全沒有數字**：沒有 F、p、各組 N 或平均，只有兩張密度圖。能引的只有「作者報告無顯著差異」這句話，引不了效果量。
6. 比較組的門檻不對稱：對照組與 Non-Planners 限「highly engaged」，Study Planners 原文沒說有沒有套同一門檻。

## 與清單「要撐的結論」不合的地方

- **「同一團隊較早的兩個 MOOC 研究，提取練習與讀書計畫都沒有效果」**：大方向撐得住，但有四處要改寫。
  1. 「同一團隊」：與 2018 年那篇重疊的是 Davis、Hauff、Houben 三人；Kizilcec 不在這篇，這篇另有 Chen 與 van der Zee。
  2. 「提取練習沒有效果」：原文只在「第 1 週看影片超過平均」的子樣本裡比，沒有對全體隨機分派的人做比較，也沒有給任何統計量。寫法要是「作者報告在高投入的學習者之間沒有顯著差異」，不能寫成有數字支持的零效果。
  3. 這篇的「提取練習」是看完影片當下寫 3–5 句摘要，每週一次、沒有延遲。它和 order 17 談的「隔一段時間的複習題」不是同一種介入；作者自己也把缺少延遲列為要改的地方。拿它當「複習題無效」的證據會過頭，它能撐的是「放在課程裡、不強制的提示，約八成的人不會點」（cued 組 22% 點過，計畫組 14.7% 點過）。
  4. 「讀書計畫沒有效果」只對「曝光」成立。真的填了計畫的人，成績（46.42 對 36.44）、堅持度（4.60 對 3.84 週）、在課時間都顯著較高；這是自我選擇下的相關，不是因果，但文章若只寫「沒有效果」會漏掉這一半，而它正是作者結論的主要內容。

## 讀取紀錄

依序讀過原文檔 L1–664 全部（一次讀完）：L1–52（題名、作者、摘要、導言開頭、致謝註）、L53–88（導言、研究問題）、L89–208（2 相關研究）、L211–277（3.1 假設、3.2 課程、Table 1）、L278–330（3.3、3.4 介入設計）、L332–412（4 開頭、4.1 提取練習、Fig. 1–2）、L413–571（4.2 讀書計畫、Table 2–4、Fig. 3–5）、L572–597（總結、5 結論）、L598–664（參考文獻，只掃過）。

對過 PDF 版面的：Table 1（PDF 第 6 頁）、Table 2（第 10 頁）、Table 3（第 11 頁）、Table 4 與 Figure 5（第 12 頁）；第 10–11 頁的 ANOVA 與 Mann-Whitney 數字也對過。PDF 其餘頁沒有表，只讀文字檔。

## 2026-10-14 抽查後更正

- 讀取紀錄：把「L413–532」更正為「L413–571」。原先的分段漏列 L533–571。這一段確實讀過：原文檔 L533–571 是 Fig. 4 的圖說與座標、Table 4（L553–565）與 Fig. 5 的圖說，而結果第 11 項抄的 Table 4 五個 Pearson r（0.361、0.268、0.346、0.346、0.305）與 N（176、176、176、170、154）就在 L557–561，檔頭與讀取紀錄也寫了 Table 4、Figure 5 對過 PDF 第 11–12 頁。第 11 項的位置欄寫「L516–532、Table 4」，引文在 L530–532、表在 L553–565，沒有改動該欄。
