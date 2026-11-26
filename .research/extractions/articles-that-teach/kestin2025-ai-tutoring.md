# 抽取紀錄：Kestin 等 2025，Scientific Reports 15:17458（doi 10.1038/s41598-025-97652-6）

- **書目**：Greg Kestin、Kelly Miller、Anna Klales、Timothy Milbourne、Gregorio Ponti（2025）。AI tutoring outperforms in-class active learning: an RCT introducing a novel research-based design in an authentic educational setting. *Scientific Reports* 15, 17458。Kestin 與 Miller 註明同等貢獻，通訊作者 Kestin。作者姓名對過檔案首頁（L10）與 PDF 第 1 頁。五位作者都在哈佛（物理系；工程與應用科學學院）。
- **版本**：刊出版，開放取用（CC BY-NC-ND 4.0）。收稿 2025-03-25，接受 2025-04-07（L455）。
- **原文檔**：`.research/raw/learning-content/q6-evaluate/kestin2025aitutor.txt`，581 行、61,962 字元（62,941 位元組）；同目錄 `.pdf`，10 頁。文字檔是 `pdftotext -layout`，原版面是單欄正文加左側留白，段落沒有左右交錯；但頁尾註腳會插在正文中間（例如 L44–57、L125–136、L315–329）。
- **本次補抓**：補充資料（正文的 Table S1–S3、Figure S1、Supplementary Material 1 都在裡面，原目錄沒有）。來源是出版者 `https://static-content.springer.com/esm/art%3A10.1038%2Fs41598-025-97652-6/MediaObjects/41598_2025_97652_MOESM1_ESM.docx`，存為 `kestin2025aitutor_supp.docx` 與 pandoc 轉出的 `kestin2025aitutor_supp.txt`（191 行、13,819 位元組）。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 25（清單標為反例）、order 28（最大的正向結果與它靠多少人工）

## 研究設計

- **類型**：交叉設計的隨機對照試驗，兩週兩堂課。**原文沒有提到預先註冊。**
- **地點與時間**：哈佛大學 Physical Sciences 2（PS2，給生命科學學生的入門物理），2023 年秋季學期第 9、10 週（L354–374）。
- **受試者**：修課 233 人，納入 194 人。納入條件是同意參與、兩種條件都上過、「completion of all pre-tests and post-tests」（L360–362）。分兩組：Group 1 N = 96、Group 2 N = 98（補充資料 Table S2A）。
- **隨機單位**：平常一起做同儕教學的 2–3 人小組整組分派，不是個人（L356–357、L436–438）。
- **兩組基線**（Table S2B）：FCI 前測 13.3（SD 6.8）對 15.2（SD 8.7），t = −1.09，p = 0.28；期中考 81.1% 對 83.1%，p = 0.33。
- **流程**（Table S3，看過原圖）：
  - 第一週「表面張力」：Group 1 用 AI 家教、Group 2 上課。
  - 第二週「流體流動」：對調。
  - 每堂課：前測 → 課 → 後測與感受問卷。
- **對照條件（課堂主動學習）**：75 分鐘的課，其中 15 分鐘考前後測，作者「assume」學習時間 60 分鐘（L106–107）。老師介紹活動 → 學生小組做 → 老師針對性回饋。兩堂由兩位不同的授課老師教。
- **實驗條件（AI 家教，名叫 PS2 Pal）**：學生**在家**自己做（L87–88、L188）。同一份講義與活動；每個活動的引言改成**預錄影片**（哈佛 Bok Center 攝影棚製作，L321–323）；所有互動與回饋都來自 AI。
  - 模型 GPT-4-0613（補充資料）。
  - 系統提示詞分兩層：全作業共用的「assignment persona」（簡短回答、一次只給一步、不主動給完整解答，但學生「demand」時可以給）＋每一題的「question-specific prompt」，內含題目、答案與逐步解法。
  - 平台把學生依序帶過每一題的每一小部分（Fig. S1，看過截圖，網址列是 TeachGPT.com）。
  - 學生在介入前四週以上就接觸過這套 AI 教法，之後也陸續使用（補充資料 Table S1 下方說明）。
- **測驗**：由不參與 AI 設計與授課的另一位團隊成員依學習目標出題（L421–425）。Table S4 列出 24 題（T1A–T4X，四份卷各 6 題）的鑑別度與難度。題目認知層次：分析 33%、應用 41%、理解 21%、記憶 4%（註 8）。A、B 兩版。**滿分幾分原文沒有寫**；Fig. 1 縱軸到 5。
- **誘因**：兩種條件與前後測都給相同的參與分數；測驗成績不計入學期成績，但要「honest effort」才有參與分（L415–418）。
- **量了什麼、何時量**：每堂課當下的前測、課後立即的後測、四題五點量表的感受。AI 組另記錄平台使用時間。**沒有延後測驗。**AI 組的前後測在哪裡考、有沒有限時或監考，原文沒有寫。

## 結果（逐項）

### R1. 後測分數 — L94–103、Fig. 1（看過原圖）

- 後測中位數：AI 組 4.5（N = 142）、課堂組 3.5（N = 174）。前測基線中位數 2.75（兩組合併，N = 316）。
- Mann–Whitney 檢定 z = −5.6，p < 10⁻⁸。
- 原文（L98–99）：「The median learning gains for students, relative to the pre-test baseline (M = 2.75, N = 316), in the AI-tutored group were over double those for students in the in-class active learning group.」換算是 1.75 對 0.75（這兩個差是我算的）。
- Fig. 1 畫的是**平均**（從圖讀，約略值）：前測約 2.7、課堂後測約 3.5、AI 後測約 4.3，誤差線是一個標準誤。
- 「學習增益」的算法：兩種條件的後測各自減去**兩組合併的前測**，不是每個人自己的前後差（L95–96）。
- 註 5：作者說後測有天花板效應，所以用中位數。註 6：兩週資料合併呈現，各週趨勢相同（沒有給各週數字）。
- **人數對不上**：納入條件要求所有前後測都完成、N = 194，交叉設計下每個條件應該各有 194 筆後測；正文報的是 142 與 174（合計 316）。原文沒有解釋差額。

### R2. 線性迴歸 — L112–121、L151–156；補充資料 Table S1

應變數是後測分數，標準化係數，在學生層級叢集。

| 變數 | 標準化係數 |
|---|---|
| 條件（課堂 = 0，AI = 1） | 0.63*** |
| 前測（z） | 0.18** |
| 期中考（z） | 0.09 |
| FCI 前測（z） | 0.11 |
| 先前 AI 使用經驗 | −0.15** |
| 課堂主題 | 0.01 |
| 試卷版本 | −0.04 |
| 作答時間 | 0.1 |
| 常數 | 0.12 |
| R² | 0.21 |
| RMSE | 0.86 |

- 表中沒有標準誤、沒有 N。
- 原文（L153–156）：「While the linear regression suggests an effect size of 0.63, this is an underestimation due to ceiling effect; a quantile regression allows us to provide an estimate of the effect size that avoids ceiling effect in the post-test scores. Such an analysis provides an effect size in the range of 0.73 to 1.3 standard deviations.」
- **0.73–1.3 的分量迴歸沒有表**，正文與補充資料都沒有列是哪些分位數、各自多少。
- 以小組為叢集的替代模型：條件效果 p < 0.001，「negligible changes to the point estimates」（L438–440），沒有表。
- 先前 AI 使用經驗的負係數：作者解釋為早期 ChatGPT 使用者在課堂條件表現較差（對照條件內 r = −0.2，p < .05），實驗條件內沒有對應相關，作者據此說沒有新奇效應（補充資料）。

### R3. 作答時間 — L105–110、L157–159、Fig. 2（看過原圖）

- AI 組中位數 49 分鐘；70% 少於 60 分鐘、30% 多於 60 分鐘。
- Fig. 2 的分布從接近 0 分鐘到 200 分鐘以上都有；最左邊 0–5 分鐘那一格約有 5 人（從圖讀）。
- 課堂組的時間不是量的，是假定 60 分鐘。
- 原文（L157–158）：「there was no correlation between the time on task and students' post-test scores」。迴歸係數 0.1，無星號。
- 課堂進度感受：3.8% 覺得課堂「too fast」的學生，在 AI 課都花超過中位數時間；2.2% 覺得「too slow」的都少於中位數（L241–244）。

### R4. 學習經驗的感受 — L161–185、Fig. 3（看過原圖）；題目在補充資料

後測之後填，五點量表（1 非常不同意、5 非常同意）。四題原文：

- Engagement：「I felt engaged [while interacting with the AI] / [while in lecture today].」（兩個條件的題幹不同）
- Motivation：「I felt motivated when working on a difficult question.」
- Enjoyment：「I enjoyed the class session today.」
- Growth mindset：「I feel confident that, with enough effort, I could learn difficult physics concepts.」

| 題目 | AI 組 | 課堂組 | 檢定 |
|---|---|---|---|
| 投入 | 4.1（SD 0.98） | 3.6（SD 0.92） | t(311) = −4.5，p < 0.0001 |
| 動機 | 3.4（SD 1.0） | 3.1（SD 0.86） | t(311) = −3.4，p < 0.001 |
| 喜歡這堂課 | 約 4.0（從圖讀） | 約 3.9（從圖讀） | 不顯著，正文沒給數字 |
| 成長心態 | 約 4.1（從圖讀） | 約 4.05（從圖讀） | 不顯著，正文沒給數字 |

- 原文（L183–185）：「students in the AI group felt significantly more engaged and more motivated during the AI class session than the students in the in-class active learning group, and the degree to which both groups enjoyed the lesson and reported a growth mindset was comparable.」
- **四題裡沒有一題問「你覺得自己學到多少」。**這一節的標題叫「students' perceptions of learning」，量的是投入、動機、喜歡程度、成長心態。
- 另一個數字：83% 的學生說 AI 家教的解釋「as good as, or better than」課堂上的真人老師（L230–231）。沒有說這題何時問、幾人答。

### R5. 子群體 — L363–370

- FCI 前測低於 40% 與高於 40% 的兩群，AI 條件後測都顯著較好（p < 0.001）。CLASS 科學態度低於與高於 65% 的兩群也是。沒有表、沒有效果量。

### R6. 對照條件的品質佐證 — L379–393、L431–433

- 89% 的學生在期末說 PS2 比他們修過的其他哈佛 STEM 課用了更多主動學習。
- 兩位授課老師的教學評鑑高於系與學部平均（沒有數字）。
- 作者自己註明：證明這套課堂做法有效的文獻，作者群與本研究重疊（L380–382）。

### R7. 製作成本 — L443–450；補充資料

- 一堂 AI 課的題目提示詞與解答：正文說「over a few days」，補充資料說「over a couple of days」。活動與解答原本就為課堂寫好了，時間花在轉格式、逐題試對話、反覆修改。
- 平台軟體開發：「took several months」。
- 影片：攝影棚製作；主講的授課老師有十年科普影片主持與製作經驗（註 9）。
- 準確度靠預先寫好的逐步解法：「accuracy of our AI tutor relied on pre-written answers」（L311）。
- 光靠系統提示詞不夠：「a system prompt could not reliably provide enough structure to scaffold problems with multiple parts」，所以改由平台強制依序進行（L203–208）。

## 作者自己列的限制

「Context, limitations, and future directions」一節（L282–339）：

1. 情境是學生第一次實質接觸某個主題；活動與測驗集中在理解、應用、分析層次。
2. 效果「may also depend on several factors」：學生程度不一、高品質教學影片、能遵循複雜提示詞的模型（GPT-4）、熟悉內容的教師逐題寫的提示詞、鷹架式的平台結構、適合這種形式的內容（L287–292）。
3. 「we do not presume that structured AI tutoring will always outperform in-class active learning in all contexts」，例如需要綜合多個概念與高階批判思考的情境。
4. 準確度依賴預先寫好的答案；回饋是被動的，學生問了才給。
5. 建議 AI 用在課前，不取代面授（L268–270、L276–277）。

同一節裡也有一句相反方向的話：「While the advantages of the experimental condition are widely generalizable and our findings have broad implications」（L292–293）。

我讀到、原文沒有列為限制的：

- **只有課後立即後測**，沒有保留測驗。作者只在未來方向提到整門課可以加入間隔等策略。
- 只有兩堂課、一門課、一所學校；兩個主題各只被每個條件教過一次。
- 兩個條件同時差了好幾件事：地點（在家對教室）、是否有預錄影片、是否自訂步調、互動對象（AI 對同儕加老師）。作者自己把效果歸給個人化回饋與自訂步調（「We believe」，L234–236），沒有拆開測。
- 後測人數 142 與 174，和納入人數 194 不一致，原因未說明。
- AI 組的測驗施測條件沒有交代。
- 沒有預先註冊；分量迴歸、子群體分析、以小組叢集的模型都沒有表。
- 補充資料 Fig. S1 的平台標示為「TeachGPT.com」「© 2025 TeachGPT」；作者貢獻欄寫軟體構想、設計與工程都是 G.K.；利益衝突聲明是「The authors declare no competing interests」。這個平台與作者的關係我沒有另外查證。

## 與摘要說法不一致的地方

逐項對過，有四處：

1. 摘要：「They also feel more engaged and more motivated.」正文是四題中兩題顯著，另兩題（喜歡、成長心態）沒有差異。摘要沒提後兩題。
2. 摘要：「learn significantly more in less time」。時間的比較是 AI 組實測中位數 49 分鐘對課堂組**假定**的 60 分鐘，且 30% 的 AI 組學生花得比 60 分鐘多；迴歸裡作答時間與後測無關。
3. 摘要：「presenting a compelling case for its broad adoption in learning environments」。限制節自己說不預設在所有情境都會勝出，並列出效果可能依賴的六項條件。
4. 摘要與導言稱學生母群「broadly representative」（L81）；依據是 FCI 前測分數落在其他學校的常見範圍（L359–360、L366），沒有其他比較。

正文內部的小出入：

- Fig. 3 圖說寫「dependent t-tests」；正文報的 t(311) 是獨立樣本的自由度寫法（對應約 313 筆），兩者不一致。交叉設計下同一批學生兩個條件都有回答，哪一種才是實際做的，原文看不出來。
- Table S2A 的 Group 2 女男比 65.8:35.2，加起來 101。
- 提示詞準備時間：正文「a few days」、補充資料「a couple of days」。
- L181–182「relating enjoyment to growth mindset」應是「enjoyment and growth mindset」的筆誤。

## 與清單「要撐的結論」不合的地方

**order 25（標為反例）：「這裡感受（投入、動機）與成績同向，不是每次都反向」**——只撐得住字面，不能當 Deslauriers 2019 的反例。

- 量的是「投入感」與「動機」，**不是自評學到多少**。Deslauriers 那篇反向的是 feeling of learning；這篇沒有問這一題，兩者不是同一個東西，不能寫成「感受與學習這次同向」。
- 四題中兩題沒有差異。
- 可以寫的版本：成績較高的那個條件，學生自述的投入與動機也較高，喜歡程度與成長心態沒有差別；這篇沒有量自評學習。

**order 28：「最大的正向結果，以及它靠多少人工」**——後半撐得住，前半要加限定。

- 效果量：迴歸 0.63 SD；作者說分量迴歸是 0.73–1.3 SD，但沒有表。「最大」是跨研究的比較，這一篇本身無法支持。
- 這個數字的性質：兩堂課、課後立即測、後測人數 142 對 174、沒有預註冊、比較對象是課堂主動學習而不是「沒有 AI 的同一份自學教材」。
- 人工的部分原文寫得很具體，可以直接引：逐題預寫逐步解法、提示詞逐題試跑修改數天、平台開發數月、攝影棚預錄影片、平台強制逐小題依序進行。作者自己把這些列為效果可能依賴的條件。

## 讀取紀錄

正文檔，依序、首尾相接：

1. L1–300：標題、作者、摘要、導言、Results（後測、作答時間、迴歸、感受）、Discussion（設計、對教學的意涵、限制節前半）、註 1–9
2. L300–581（檔尾）：限制節後半、註 7–11、Conclusion、Methods（母群、課程、設計、其他控制）、資料可得性、參考文獻（35 條，全部看過）、致謝、作者貢獻、聲明、授權

補充資料 `kestin2025aitutor_supp.txt` L1–191 全部讀完：Table S1 與說明、Table S2A、S2B、Table S3（圖片，另開圖看過）、測驗效度說明與 Table S4、四題感受問卷原文、AI 家教系統說明、Fig. S1（開圖看過）、assignment persona 全文、一題 question-specific prompt 範例、註 1。

對過 PDF 版面的圖表：正文沒有表（所有數字表都在補充資料）。直接看了 PDF 第 3、4、5 頁的 Fig. 1、Fig. 2、Fig. 3；表格中「從圖讀」的數字是目測約略值。補充資料是 docx，Table S1、S2A、S2B、S4 由 pandoc 轉成文字表格，欄位清楚；沒有另外開 Word 版面核對。

沒讀的：GitHub 上的資料（github.com/HarvardAItutor/Study-Data-v4）。
