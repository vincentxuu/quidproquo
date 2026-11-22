# 抽取紀錄：Chen 等 2016〈Researching for better instructional methods using AB experiments in MOOCs: results and challenges〉

## 檔頭

- **書目**：Zhongzhou Chen、Christopher Chudzicki、Daniel Palumbo、Giora Alexandron（以上 MIT）、Youn-Jeng Choi（University of Alabama）、Qian Zhou（清華大學；原文拼作 Qinghua University）、David E. Pritchard（MIT）。〈Researching for better instructional methods using AB experiments in MOOCs: results and challenges〉。Research and Practice in Technology Enhanced Learning 11, 文章編號 9，2016 年 4 月 22 日刊出（2015-11-07 收稿、2016-03-22 接受）。DOI 10.1186/s41039-016-0034-4；PMCID PMC6302917；PMID 30613242。CC BY 4.0。作者名單、順序、單位對過檔案開頭的 PMC 中繼資料（清單上的七位作者與順序正確）。
- **原文檔**：`.research/raw/learning-content/q6-evaluate/chen2016abmooc_PMC6302917.txt`（63,113 字元，整份只有一行，`wc -l` 為 0；Europe PMC 全文 XML 抽成的純文字）；同目錄有原始 XML `chen2016abmooc_PMC6302917.xml`。本機沒有 PDF。
- **來源**：Europe PMC fullTextXML（PMC6302917）
- **讀取日期**：2026-10-14
- **版本**：刊出版（PMC 收錄的出版者版本）
- **供哪幾篇用**：order 25、order 26

## 研究設計

一門 MOOC 裡的兩個隨機分派實驗。課程是 edX 上的 8.MReVx Introductory Mechanics（2014 年那一期），給已有牛頓力學基礎的人複習用，12 個必修單元加 2 個選修單元；註冊約 11,000 人，拿到證書的「just over 500」（字元 8480–9429）。作者說這一期總共做了七個 AB 實驗，這篇只報告其中兩個（字元 5791：「we performed as many as seven AB experiments … In this paper, we present in detail the design, implementation, analysis, and result of two of those experiments.」）。

edX 的分組方式：使用者第一次存取實驗內容時才被隨機分組；所有人都參加所有實驗，除非退出課程（字元 7605–8480）。

### 實驗一：刻意練習活動（DPA）與拖放題

- **研究問題**：(1) DPA 是否比做傳統章末題更能培養解題能力？(2) 拖放（D&D）格式是否比選擇題（MC）格式更能培養單一專家技能？
- **設計**：在最後三個必修單元（10、11、12）的作業。學生分成 A、B、C 三組，每個單元各拿到三種作業之一：拖放格式的 DPA、選擇題格式的 DPA、傳統章末題（TRD）；三個單元輪替，所以每組三種都做過一次。之後大家做同一份第二次作業（傳統題），再考同一份小考（全是傳統題，多為數值或符號作答）。
- **教材**：每個 DPA 處理含 4 到 5 個序列、合計約 20 題，每個序列只練一項專家技能，每題附詳解；TRD 每單元 6 到 10 題。兩種設計成花差不多的時間。
- **兩種格式的差別不只格式**：MC 版把一題拆成兩個同時評分的子題（每次作答會知道哪一個子題對），所以給的作答次數比 D&D 少（D&D 可 5 到 10 次）。
- **樣本**：只看完成至少 70% 處理作業與至少 70% 小考的人：單元 10 有 219 人、單元 11 有 205 人、單元 12 有 280 人；三個單元裡至少碰過一題處理題的共 614 人（字元 19841–20488）。
- **量了什麼**：小考的第一次作答正確率（傳統題）；另外看 DPA 序列內後續題目的答對數（第一次與第二次作答）。作業時間從紀錄推估（單題上限 30 分鐘）。

### 實驗二：影片拍攝方式

- **研究問題**：(1) 能否設計一種降低講者認知負荷、提升講者表現的拍攝方式？(2) 講者表現是否影響學生的觀看行為？(3) 講者表現較好是否帶來較好的學習成果？
- **兩種影片**：
  - ID（instructor-dominant）：2013 年那一期拍的。講者與兩位學生坐在桌前面對鏡頭，講者一邊輔導學生一邊在平板上寫解法。
  - AT（assisted tutoring）：2014 年由同一位講者重拍其中四支。助教先在白板上說明題目，講者進場講解，助教退到鏡頭旁當聽眾，並依事先準備的問題清單在重點處發問。
  - 兩種版本差在拍攝年份、有無學生入鏡、平板對白板、有沒有事先備好的提問，片長也不同（377 到 1,187 秒）。
- **設計**：單元 8 與單元 9 的作業各有兩支影片，各講解一題作業。學生隨機分成 A、B 兩組：A 組在單元 8 看兩支 ID、單元 9 看兩支 AT，B 組相反。題目頁有連結通往影片，並提示先至少作答一次再看。
- **分析樣本**：每題 200 到 300 人作答，其中不到 30% 在最後一次作答前開過影片；之後的分析**只看這些在最後一次作答前看過影片的人**（每支影片每種版本 36 到 113 人）。
- **量了什麼**：講者每分鐘字數（wpm，逐字稿長度除以片長；四支裡只有三支有兩個版本的逐字稿）；平均總觀看時間占片長的百分比；有「長觀看」的學生比例（一次不中斷播放超過片長 70%）；該題最後一次作答的正確率。

## 結果（逐項）

Table 1、2、5 用原始 XML 逐列逐格核對過（純文字檔把表格壓成一串，欄位對應靠 XML 的列與 colspan 確認）；Table 3、4 的數字在純文字檔裡順序完整，對照表頭讀出。**沒有對 PDF 版面**（本機沒有 PDF）。

### 實驗一

| # | 結果 | 數字與對照條件 | 位置 | 原文 |
|---|---|---|---|---|
| 1 | 作業時間三種處理無顯著差異 | 中位數約 5,000 秒（1.4 小時）；資料未列出 | Results／Time-on-task（字元 20488 起） | 「with no statistically significant difference among the three different treatments nor among the three different groups found (data not shown)」 |
| 2 | 各單元小考：三組無顯著差異 | 單元 10：D&D 0.61（N 78）、MC 0.56（N 71）、TRD 0.62（N 70），ANOVA p = 0.23；單元 11：0.47（72）、0.43（64）、0.47（69），p = 0.52；單元 12：0.59（87）、0.61（103）、0.65（90），p = 0.22 | Table 1 | 「Simple one-way ANOVA reveals no significant difference between the three groups on any of the quizzes.」 |
| 3 | 三個單元合併：MC 版 DPA 比傳統作業低 4.7 個百分點 | MC − TRD = −4.70%（SD 2.10%），Z = −2.22，p = 0.026 | Table 2 | 「The only significant difference is between the TRD homework and DPA-MC, while DPA-D&D showed no significant difference with either of the other two.」 |
| 4 | D&D 對 MC、TRD 對 D&D 都不顯著 | D&D − MC = 2.30%，p = 0.27；TRD − D&D = 2.30%，p = 0.26 | Table 2 | 同上 |
| 5 | 序列內的後續題目：D&D 答對較多（只看一開始答錯的人） | 樣本是各序列裡第一、二題第一次沒答對的 20–30%（或說 20–40%）學生。第一次作答的答對題數差（D&D − MC）：序列 1 +0.73（p = 0.007）、序列 2 +0.75（p = 0.02）、序列 3 +0.64（p = 0.25）、序列 4 +0.79（p = 0.07）、序列 5 +0.02（p = 0.89）。兩次作答內：序列 1 +1.12（p < 0.001）、序列 2 −0.15（p = 0.9）、序列 3 +1.19（p = 0.03）、序列 4 +1.1（p = 0.02，註「population might be unequal」）、序列 5 −0.54（p = 0.15） | Table 3（字元 26060 起） | 「a highly significant difference at p < 0.01 level is observed for sequence 1 on both first and second attempt correct. Significant difference at p < 0.05 level is observed for sequence 2 on first attempt correct and sequences 3 and 4 on second attempt correct.」 |
| 6 | 選樣偏誤檢查 | 被選進分析的人，D&D 與 MC 兩組在人數比例（平均 28% 對 29%，p = 0.8）與 IRT 能力（平均 −0.45 對 −0.54，p = 0.43）上無顯著差異；序列 4 的人數比例差 p = 0.07 | Table 4 | 「On average, there is no difference observed between the two selected populations.」 |
| 7 | 期末問卷 | 47% 的學生認為 D&D 比較直覺，20% 認為 MC 比較直覺（引自 Chudzicki 2015 的學位論文，本文沒有給分母） | Summary and discussion（字元 30269 起） | 「47 % of students rated the D&D format as more intuitive than the MC format, and only 20 % rated the MC format as more intuitive」 |
| 8 | 作者的結論 | DPA 沒有比傳統題更能準備傳統題小考，MC 版還略差 | 字元 32009 起 | 「DPAs, especially in MC format, are slightly less effective preparation for a quiz containing traditional questions than solving traditional problems for the same amount of time.」 |

作者對第 5 項自己提的其他解釋（字元 30269–32009）：D&D 組每題可作答次數較多、每次得到的回饋較少，可能因此「掙扎」較久而學到較多；新格式可能只是比較吸睛。原文：「Further research is required to distinguish between these differences.」

作者對第 8 項提的三個可能原因：選來做 DPA 的技能可能不是學生小考答錯的原因；約四分之一的學生可能是教師，本來就會；小考等於開書考，量不到記憶上的好處。

### 實驗二

Table 5（每支影片的 AT 版對 ID 版；N 是「在最後一次作答前看過影片」的人）：

| 影片 | 片長（秒） | wpm | 作答人數 | 看影片人數 | 平均總觀看時間（占片長） | 有長觀看的比例 | 最後一次作答正確率 |
|---|---|---|---|---|---|---|---|
| AT1 | 1004 | 125 | 318 | 36 | 75% | 25% | 74% |
| ID1 | 1187 | 118 | 308 | 39 | 96% | 26% | 66% |
| 檢定 | | | | | p = 0.02（U） | p = 0.94（χ²） | p = 0.61（χ²） |
| AT2 | 659 | N/A | 294 | 113 | 88% | 41% | 93% |
| ID2 | 583 | N/A | 290 | 105 | 108% | 44% | 83% |
| 檢定 | | | | | p = 0.05（U） | p = 0.64（χ²） | p = 0.04（χ²） |
| AT3 | 731 | 142 | 223 | 67 | 101% | 45% | 82% |
| ID3 | 943 | 113 | 206 | 75 | 79% | 27% | 84% |
| 檢定 | | | | | p = 0.006（U） | p = 0.02（χ²） | p = 0.8（χ²） |
| AT4 | 377 | 145 | 212 | 39 | 79% | 46% | 84% |
| ID4 | 423 | 122 | 195 | 46 | 83% | 28% | 98% |
| 檢定 | | | | | p = 0.42（U） | p = 0.09（χ²） | p = 0.02（χ²） |

| # | 結果 | 數字與對照條件 | 位置 | 原文 |
|---|---|---|---|---|
| 9 | 講者語速：AT 版較快 | 影片 1：125 對 118 wpm；影片 3：142 對 113；影片 4：145 對 122；影片 2 的 ID 版逐字稿遺失。沒有檢定；講者只有一人 | Table 5；字元 38287 起 | 「in all three videos, the wpm in the AT setting is higher than that in the ID setting and the difference is larger for videos 3 and 4」 |
| 10 | 看影片的人很少 | 不到 30% 的作答者在最後一次作答前開過影片；沒看影片的人第一次作答正確率 30% 到 70% | 字元 40006 起 | 「less than 30 % accessed the videos before submitting their last attempt on the problem」 |
| 11 | 平均總觀看時間：方向不一致 | 影片 1、2 是 ID 版看得久（96% 對 75%，p = 0.02；108% 對 88%，p = 0.05）；影片 3 是 AT 版看得久（101% 對 79%，p = 0.006）；影片 4 不顯著 | Table 5；字元 40755 起 | 「the mean viewing time, a measure of total engagement, differed significantly on three of the four videos; however, the direction varied among the videos so no global conclusion seems warranted.」 |
| 12 | 有長觀看的學生比例：四支裡一支顯著 | 影片 3：AT 45% 對 ID 27%，p = 0.02；影片 4：46% 對 28%，p = 0.09（不顯著）；影片 1：25% 對 26%，p = 0.94；影片 2：41% 對 44%，p = 0.64 | Table 5 | 「While videos 1 and 2 showed little difference, on videos 3 and 4, the AT version resulted in more students with long views. The difference is statistically significant for video 3 but not for video 4 due to a smaller sample size.」 |
| 13 | 學習成果（該題最後一次作答正確率）：沒有一致的方向，**但有兩支顯著、方向相反** | 影片 2：AT 93% 對 ID 83%，p = 0.04（AT 較高）；影片 4：AT 84% 對 ID 98%，p = 0.02（ID 較高）；影片 1：74% 對 66%，p = 0.61；影片 3：82% 對 84%，p = 0.8 | Table 5；字元 42702 起 | 「we did not observe any consistent trend favoring one video format over the other among the four instances. For video 2, students watching the AT version outperformed students watching the ID version by 10 %, whereas on video 4, the trend was flipped.」 |
| 14 | 作者在討論段對投入的結論 | 以「有一次不中斷長觀看的學生比例」為準，說 AT 提高了投入 | 字元 43396 起 | 「the AT format leads to increased engagement, as measured by the percentage of students with one uninterrupted long view.」 |
| 15 | 作者在討論段對學習的結論與自己給的理由 | 說沒有顯著差異；歸因於天花板效應與看影片的樣本太小；沒有測遷移 | 字元 44434 | 「no significant difference was observed for students' performance on homework problems, which we suspect is partly due to the ceiling effect (most got it correct irrespective of watching the video) as well as the small sample size of those who watched the video. In particular, we did not test for transfer of learning from the video in this experiment」 |
| 16 | 和 Guo 等 2014 的關係 | 作者說「語速快投入較高」與 Guo 的總體結論一致，但 Guo 在這個語速區間（100–150 wpm）與片長（9–12 分鐘）的細部結果其實是語速越快投入越低 | 字元 43396–44434 | 「However, their detailed findings for the particular range of speech speeds (100–150 wpm) and video length (9–12 min) indicated a lower engagement level for higher speech speed.」 |
| 17 | 作者對影片研究的一句評語 | — | 字元 44434 之前 | 「A key factor in video watching is whether students learn from them and whether high engagement is accompanied by greater learning. Unfortunately, most MOOC video studies made no attempt to determine whether students learned from the videos.」 |

### 總討論（字元 45668 起）

| # | 內容 | 原文 |
|---|---|---|
| 18 | 作者對兩個實驗的總評 | 「Our first attempts at conducting and analyzing learning from AB experiments in a MOOC environment did not result in eye opening discovery or solid conclusions. This is not completely unexpected, as the majority of online AB testing shows no effect (Kohavi and Longbotham 2015).」 |
| 19 | 顯著結果都來自挑過的子樣本 | 「Notably, the significant results obtained in both experiments were on selected subsamples of the total population, which resulted in significantly smaller samples than one would have expected from the large MOOC registration numbers.」 |
| 20 | 難處一：學生組成太分散 | 技能變異約是一般大學班級的四倍（引 Colvin 等 2014）；實驗一有 60–70% 的學生本來就會那些技能；還偵測到用第二個帳號取得答案的人（Alexandron 等 2015）。「whatever instructional method … we try to evaluate will likely make a difference to only a subset of the entire MOOC population.」作者建議在實驗裡放前測來挑出會對處理有反應的人。 |
| 21 | 難處二：評量等於開書考 | 「essentially all MOOC quizzes are open book. Moreover, we have little to no control over the time and order in which students complete the assessments or if they complete them at all」；學生可能從課程其他地方、別的網站或書上學會；甚至可能先考再做處理。對策：分析紀錄確定先後；把學習過程本身當評量；平台提供「先做完處理才能解鎖評量」或限時測驗。 |
| 22 | 難處三：資料量大、種類多 | 同一題的表現可以用第一次正確率、最後一次正確率、平均作答次數、每次花的時間來量，選哪個沒有依據：「most of those decisions are based more on intuition plus trial and error to find good signal-to-noise ratios, rather than evidence-based research.」時間資料高度非常態，需要新的統計工具。 |

## 作者自己列的限制

原文沒有獨立的 Limitations 節，限制散在各實驗的討論與總討論：

1. 兩個實驗都沒有得到「solid conclusions」（第 18 項）。
2. 顯著結果只出現在挑過的子樣本（第 19 項）。實驗一的 D&D 優勢只在一開始答錯的 20–40% 學生裡看。
3. 實驗一：D&D 與 MC 不只差在格式，作答次數與回饋量也不同，無法區分是哪個因素；沒有用共同的題目去評量 DPA 要教的那項技能。
4. 實驗一：小考題目沒有針對 DPA 訓練的技能設計；評量是開書的。
5. 實驗二：看影片的樣本小、天花板效應、沒有測遷移（第 15 項）。
6. 評量指標是憑直覺與試誤選的（第 22 項）。
7. MOOC 學生是高度自我驅動的學習者，「whose behavior is not representative of typical high school or college students」（字元 45000 附近）。

作者**沒有**當成限制討論的事（我的觀察）：
- 這一期做了七個實驗，只報告兩個；其餘五個的結果沒有交代，只說會分享「lessons we learned from unsuccessful attempts」。
- 實驗二裡兩種影片是不同年份拍的，差異不只「講者負荷」一項；講者表現只用一位講者三支影片的語速來量，沒有檢定。
- 實驗二的分析樣本是「分組之後自己決定要不要看影片」的人，已經不是隨機分派下的完整比較；兩種版本下選擇看影片的比例是否相同，原文只列了人數（如影片 3：67／223 對 75／206），沒有檢定。
- 多支影片、多個指標各自檢定，沒有做多重比較校正。
- 實驗二每個人兩種版本都看了（不同單元），但分析是各影片分開的組間比較。

## 與摘要說法不一致的地方

1. **摘要說新拍法「improves the engagement of the students」**。內文的兩個投入指標裡，平均總觀看時間「direction varied among the videos so no global conclusion seems warranted」（影片 1、2 還是舊拍法看得久）；有長觀看的比例四支裡只有影片 3 顯著（影片 4 是 p = 0.09）。摘要的說法只對得上四支裡的一支、兩個指標裡的一個。
2. **摘要說「it has no significant impact on the learning outcomes」，討論段也寫「no significant difference was observed」**。Table 5 的最後一欄其實有兩個顯著差異：影片 2 是新拍法較高（p = 0.04），影片 4 是舊拍法較高（p = 0.02）。結果段的寫法「did not observe any consistent trend」才對得上表。準確的說法是「方向不一致」，不是「沒有顯著差異」。
3. **摘要說新拍法「can improve the fluency of the instructor」**。依據是一位講者、三支影片的每分鐘字數比較，沒有檢定；影片 1 只差 7 wpm。
4. **摘要說「a more interactive drag-and-drop format of DPA generates quicker learning than a multiple choice format」**。這只在「一開始答錯的 20–40%」子樣本、DPA 序列內的後續題目上成立；用傳統題小考量時 D&D 與 MC 沒有顯著差異（p = 0.27）。摘要沒有交代子樣本。
5. **摘要說「DPAs do not improve performance on solving traditional physics problems more than normal homework practice」**。內文更進一步：MC 版的 DPA 顯著比傳統作業差 4.7 個百分點（p = 0.026）。摘要只寫「沒有比較好」。

內文自身的不一致（照實記）：
- 字元 24555：「on three out of five sequences, the D&D group answered significantly more questions correctly on the first attempt than the MC group」；Table 3 的第一次作答只有序列 1（p = 0.007）與序列 2（p = 0.02）兩個達 .05，序列 4 是 p = 0.07。同一段後面逐一列舉時也只列了序列 1 與 2 的第一次作答。
- 被選進分析的學生比例，一處寫「20–30 % of students」，下一句寫「varies from 20 to 40 %」；Table 4 的範圍是 18% 到 41%。
- 總討論說兩個實驗「the size of the samples was sufficient to reveal some significant effect」，其中一項是「the importance of reducing the cognitive load on the instructor for generating more engagement」；講者的認知負荷本身沒有量，是從語速推論的。

## 與清單「要撐的結論」不合的地方

清單（order 25）：「拍攝方式提高投入、不改變學習」。清單（order 26）：「兩個 edX 實驗都沒有改變學習成果；MOOC 做實驗的三個難處」。

1. **「拍攝方式提高投入」要大幅降調**。這是摘要的說法，內文撐不住這麼強：
   - 觀看時間這個指標方向不一致，四支裡有兩支是舊拍法看得比較久。
   - 「長觀看比例」只有影片 3 顯著（45% 對 27%，p = 0.02），影片 4 不顯著，影片 1、2 幾乎一樣。
   - 可以寫的是：「作者在摘要裡說新拍法提高了投入；表裡四支影片只有一支在一個指標上顯著，另一個指標方向不一致」。
2. **「不改變學習」要改成「沒有一致方向」**。四支影片裡兩支的最後作答正確率有顯著差異，方向相反（影片 2 新拍法高 10 個百分點、影片 4 舊拍法高 14 個百分點）。而且量的是「看完影片後同一題最後答對了沒」，正確率 66% 到 98%，作者自己說有天花板效應、沒有測遷移，樣本每格 36 到 113 人。這個「學習」指標很弱，不足以說「投入提高而學習不變」。
3. **拿這篇當 order 25「投入上升但學習不動」的例子並不穩**：投入那一半與學習那一半都是不一致的結果。這篇裡真正能用在 order 25 的，是作者那句評語（第 17 項）：多數 MOOC 影片研究根本沒有量學生有沒有學到。那是作者的意見，不是這篇的實驗結果。
4. **「兩個 edX 實驗都沒有改變學習成果」要分開寫**：
   - 實驗一：用傳統題小考量，DPA 沒有比傳統作業好；選擇題版的 DPA 顯著較差（−4.7 個百分點，p = 0.026）。這是「新方法沒有比較好，其中一個版本還略差」，不是「沒有差異」。
   - 實驗一同時有一個正向結果：拖放格式在序列內的後續題目上答對較多（限一開始答錯的子樣本，五個序列裡第一次作答兩個顯著）。算不算「學習成果」看定義；作者稱它「quicker learning」。
   - 實驗二：見第 2 點。
   - 作者自己的總評「did not result in eye opening discovery or solid conclusions」可以照引。
5. **「MOOC 做實驗的三個難處」撐得住**：學生組成分散、評量等於開書考、資料量大且種類多（摘要原文：「wide student distribution, "open-book" nature of assessments, and large quantity and variety of data」），內文各有一段展開（第 20–22 項）。可以補上第 19 項：顯著結果都來自挑過的子樣本，以及七個實驗只報告兩個。
6. 清單寫作者名單「取自全文檔，精讀時核對」：核對過，七位、順序正確。

## 讀取紀錄

原文檔只有一行，依字元位置分三段首尾相接印出來讀：

| 順序 | 字元起訖 | 內容 |
|---|---|---|
| 1 | 0–22,000 | PMC 中繼資料（期刊、作者、單位、日期、授權）、摘要、關鍵詞、General background、Implementation of AB experiments on the edX platform、Structure of 8.MReVx、實驗一的背景（專家技能、刻意練習、DPA 設計、拖放題）、研究問題、實驗設計、兩種格式的題目、樣本選取、Time-on-task、小考表現的開頭 |
| 2 | 22,000–44,000 | Table 1、Table 2、D&D 對 MC 的單一技能分析、Table 3、選樣偏誤檢查與 Table 4、實驗一的小結與討論、實驗二的背景、兩種拍攝方式、實驗設置、講者語速、Table 5、學生樣本、觀看行為、學習成果、影片實驗討論的前半 |
| 3 | 44,000–63,113 | 影片實驗討論的後半、General discussion（優勢與三個難處）、縮寫、利益衝突聲明、作者貢獻、致謝（字元 53,198–54,283）；字元 54,283 以後是參考文獻（掃過） |

表格核對：Table 1、2、5 另從原始 XML 逐列印出核對（欄位與 colspan 對應）；Table 3、4 依純文字檔的順序對照表頭讀出，沒有另外用 XML 核對。圖 1–8 只有圖說，圖本身不在檔案裡（Fig. 5 的長條圖數字因此沒看到，Table 3 有對應數字）。沒有 PDF 可對版面。

純文字檔裡 Table 3 的表頭夾了多段 LaTeX 樣板字串（`\documentclass…`），是 XML 裡數學式的替代文字，不是正文。
