# 抽取紀錄：Bastani 等 2025，PNAS 122(26) e2422633122（doi 10.1073/pnas.2422633122）

- **書目**：Hamsa Bastani、Osbert Bastani、Alp Sungu、Haosen Ge、Özge Kabakcı、Rei Mariman（2025）。Generative AI without guardrails can harm learning: Evidence from high school mathematics. *Proceedings of the National Academy of Sciences* 122(26), e2422633122。2025-06-25 線上刊出，期別日期 2025-07-01。前三位作者註明同等貢獻，通訊作者 Alp Sungu。作者全名對過 PMC 版首頁與 SI 附錄首頁，兩處一致。
- **更正啟事**：PNAS 122(34) e2518204122（doi 10.1073/pnas.2518204122，PMC12403119），2025-08-20。本次讀過全文：只更正 Osbert Bastani 的單位（改為 Department of Computer and Information Science），沒有動任何數字。原文檔 L3 的單位是更正前的版本。
- **版本**：刊出版（PMC 的 JATS XML 轉文字，CC BY-NC-ND）。
- **原文檔**：`.research/raw/learning-content/q6-evaluate/bastani2025pnas_PMC12232635.txt`，36 行、46,326 字元（多數段落擠在同一行，以下位置用「@字元位置」標）。同目錄 `.xml` 是來源。
- **本次補抓**：SI 附錄（正文多處引用，原目錄沒有）。來源 Europe PMC 補充檔 `https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12232635/supplementaryFiles`（zip），存為 `bastani2025pnas_sapp.pdf`（43 頁）、`bastani2025pnas_sapp.txt`（不帶 `-layout` 的 pdftotext，2,483 行、73,385 字元），另存正文三張圖 `bastani2025pnas_fig01.jpg`、`_fig02.jpg`、`_fig03.jpg`。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 25（感受段）、order 28（無防護較差、有防護打平）

## 研究設計

- **類型**：實地隨機對照試驗，以班級為隨機單位（cluster RCT），三組。預先註冊（aspredicted.org/4DL_Q3J），**預註冊的主要分析是三組之間無輔助考試成績的兩兩 t 檢定**；正文 Table 1 的迴歸是作者另外提出的「較嚴謹的設定」（SI A.6，sapp L206–226）。
- **地點與時間**：土耳其一所大型高中（致謝寫 TED Ankara Koleji），2023–2024 學年秋季學期（@12111 前後）。
- **受試者**：9、10、11 年級約 50 個班、「nearly 1,000」名學生。主樣本排除資優班（honors，非隨機編班）與沒填基線問卷的學生：SI Table A.1 主樣本 839 人（GPT Tutor 277、對照 320、GPT Base 242）；含資優班 943 人（312／349／282）。迴歸觀察值 2,848（學生 × 場次）。班級 × 場次層級的迴歸 N = 172（SI Table B.12），換算主樣本約 43 班（這個 43 是我用 172÷4 算的，原文沒寫）。
- **課程**：四場各 90 分鐘，合計約占該學期數學課程 15%。每場三段：(1) 老師複習並在黑板解例題；(2) 有輔助的練習；(3) 閉書、不開電腦的考試。考試每一題對應一題「conceptually very similar」的練習題（@12374–13229）。第 1、3 段三組相同。練習與考試都算進學期成績。
- **三組**（只差第 2 段）：
  - 對照：只有課本與筆記，**沒有發裝置**。
  - GPT Base：發筆電，介面仿 ChatGPT，提示詞只給題目並要它當家教。
  - GPT Tutor：同介面，提示詞加兩樣東西——(a) 不准給完整解答、只給漸進提示；(b) 老師寫的每題正解、常見錯誤與對應提示。另有歡迎訊息與三個建議提問（SI A.1，sapp L94 前）。
  - 模型：GPT-4-0613（sapp L38 起）。
  - 兩組 GPT 的學生都先看一支 5 分鐘內的示範影片（兩組影片不同），登入頁有使用提示（SI A.2）。
- **評分**：外聘獨立評分者依老師訂的評分表盲評，紙本作答，卷上沒有組別資訊（SI A.5）。
- **量了什麼、何時量**：練習成績（第 2 段）、考試成績（同一堂課第 3 段，緊接著考）、每場考完的五題感受問卷、GPT 兩組的全部對話紀錄、學期初 10 分鐘背景問卷。**沒有任何延後測驗**。
- **遵從度**：5 個班級場次沒照分配執行（筆電晚到、老師忘記、介面故障，其中 2 個是資優班），主分析用意向分析（SI B.1、Table B.4）。
- **缺席率**：平均 12.3%，三組無差異（SI B.6、Table B.13，N = 3,247）。

## 結果（逐項）

成績一律是 0–1 的標準化分數；係數是相對對照組的差。括號內是以班級叢集的標準誤。

### R1. 練習階段（有輔助）— Table 1 第 (1) 欄（@18149）

- GPT Base +0.137（0.031），p < .01；GPT Tutor +0.361（0.032），p < .01。對照組平均 0.284、SD 0.287。N = 2,848，R² = 0.389。
- 換成百分比：+48% 與 +127%（0.137／0.284、0.361／0.284，我驗算過相符）。
- 原文（@16836 後）：「GPT Base and GPT Tutor substantially increased student scores in the GPT-assisted practice sessions by 0.137 and 0.361 (out of 1), respectively, relative to the control arm that only had access to textbooks (mean performance of 0.28).」
- **這項比較不在預註冊內**。SI A.6（sapp L206 後）把「comparing performance on assisted practice problems」列在未預註冊的探索性分析。

### R2. 考試（無輔助）— Table 1 第 (2) 欄

- GPT Base −0.054（0.022），p < .05；GPT Tutor −0.004（0.013），不顯著。對照組平均 0.321、SD 0.277。N = 2,848，R² = 0.386。
- 「17%」的來源是 0.054／0.321（我驗算 16.8%）。
- 原文（@18556）：「student performance in the GPT Base arm degraded by 0.054 (out of 1) relative to that of the control arm. In other words, GPT Base diminished the average control student's performance on the unassisted exam by 17%. Student performance in the GPT Tutor arm was statistically indistinguishable from that of the control arm, and the point estimate was smaller by an order of magnitude (−0.004).」
- 以對照組 SD 換算約 −0.19 SD（0.054／0.277；這個換算是我做的，原文沒有報標準化效果量）。

### R3. 預註冊的 t 檢定版本 — SI Table A.2（sapp p.10，對過 PDF 版面）

| 比較 | 練習差 | 95% CI | 考試差 | 95% CI | p |
|---|---|---|---|---|---|
| GPT Base − 對照 | 0.19 | [0.165, 0.214] | −0.035 | [−0.057, −0.012] | 0.003 |
| GPT Tutor − 對照 | 0.385 | [0.359, 0.411] | −0.006 | [−0.030, 0.018] | 0.613 |
| GPT Tutor − GPT Base | 0.195 | [0.169, 0.221] | 0.028 | [0.005, 0.052] | 0.019 |

- 預註冊分析下，GPT Base 的考試差是 **−0.035**，比迴歸的 −0.054 小；除以對照組平均 0.321 約 11%（11% 是我算的，原文沒寫）。方向與顯著性不變。
- Table A.3（加入沒填問卷者）：GPT Base −0.027 [−0.049, −0.006]，p = 0.013；GPT Tutor −0.005，p = 0.676。
- 這個 t 檢定沒有處理班級叢集（原文說迴歸才「clusters standard errors at the classroom level」）。

### R4. 穩健性 — SI Table B.5、B.6、B.7（對過 PDF 版面）

- 排除未遵從的班級場次（N = 2,805）：GPT Base 考試 −0.054*（0.022）、GPT Tutor −0.004（0.013）。
- 題目層級（練習 N = 13,484、考試 N = 11,392）：GPT Base 考試 −0.054*、GPT Tutor −0.004。
- 納入資優班：GPT Base 考試 −0.064*（0.026）、GPT Tutor +0.001（0.018）。
- 納入未填問卷者：−0.069**（0.027）、+0.001（0.017）。
- 加入問卷變數當控制：**−0.041***（0.021）、−0.001（0.012）。
- 各種設定下 GPT Base 考試係數落在 −0.041 到 −0.069；GPT Tutor 落在 −0.006 到 +0.001，沒有一個顯著。

### R5. 學生感受 — 正文 @20791–21441；SI B.3 與 Table B.8（sapp L871 起，對過 PDF p.13–14）

每場考完問五題。(1) 這整堂課學到多少、(2) 這次小考考得如何、(4) 第 2 段練習對解考題多有用：五點量表，ordered probit。(3) 考試花了幾分鐘、(5) 願意放棄幾分鐘考試時間換取 AI 協助：取區間中點，OLS。

| | (1) 自評學到多少 | (2) 自評考得如何 | (3) 作答時間 | (4) 練習的價值 | (5) 願意換的時間 |
|---|---|---|---|---|---|
| GPT Base | −0.0783（0.0800） | −0.0218（0.0774） | −0.114（0.799） | 0.113（0.0804） | 2.245**（0.692） |
| GPT Tutor | 0.0711（0.0551） | 0.130*（0.0563） | 0.953*（0.399） | 0.271**（0.0562） | 3.710**（0.561） |
| N | 2,603 | 2,594 | 2,523 | 2,549 | 2,321 |

- GPT Base：自評學到多少、自評考得如何兩項與對照組**無顯著差異**（點估計都是負的）。
- GPT Tutor：實際考試沒有比較好，但**自評考得比較好**（0.130，p < .05）；覺得練習比較有價值（0.271，p < .01）；自評學到多少不顯著。
- 原文（@20791 後）：「While students in the GPT Base arm performed worse on the exam (relative to the control arm), they did not perceive that they performed worse or learned less. Similarly, while students in the GPT Tutor arm did not perform better on the exam (relative to the control arm), they perceived that they performed significantly better.」
- SI 原文（sapp p.14）：「Overall, these results suggest that despite the negative effect of GPT Base and the null effect of GPT Tutor on real exam performance, students attribute some value to having access to GPT and potentially overvalue its benefits.」
- 這是預註冊的次要分析（SI A.6）。
- 要注意的性質：比的是**組平均**，不是「考差的那些人」個別的自評；GPT Base 那兩項是「沒有偵測到差異」，不是證明了感受相等；問卷是考完才填、每項單題。

### R6. 異質性 — SI B.4、Table B.9–B.11（對過 PDF p.15–16）

- 預註冊變數：前一年 GPA、有無私人家教、自習時數。「prior exposure to generative AI」也有預註冊，但因問卷是整學期陸續填的而放棄（sapp 註 3）。
- 考試成績：三個變數的交互作用項**全部不顯著**（GPT Base × 高於中位數 GPA −0.026（0.024）；× 私人家教 0.0170（0.0224）；× 自習時數 0.0284（0.0200））。
- 練習成績：低 GPA 學生從 GPT Base 得到較多（交互作用 −0.077**）；有私人家教者從 GPT Base 得到較多（0.0735*）。這兩項到了考試都消失。

### R7. 成績離散度 — SI B.5、Table B.12

- 以班級 × 場次的 HHI 衡量（N = 172）。練習：GPT Base −0.0429*、GPT Tutor −0.0773**（離散變小）。考試：−0.0162 與 0.00113，都不顯著。
- 原文（@21835 後）：「the reduction in the skill gap does not persist when access to AI is removed.」探索性分析。

### R8. GPT Base 的答錯率 — 正文 @24430–26677；SI C.1

- 用學生最常送的訊息「What is the answer?」（占 GPT Base 組首則訊息的 31%，sapp C.2 末）對 57 題練習題各問 10 次。
- 答對 51%；邏輯錯誤 42%；算術錯誤 8%（三個數字加起來 101%，原文如此，應是四捨五入）。
- 原文（@25041 前後）：「We find that GPT Base gives a correct answer only 51% of the time on average; it makes logical errors 42% of the time and arithmetic errors 8% of the time.」
- 這是研究者事後重跑得到的錯誤率，不是學生實際收到的回覆的錯誤率。

### R9. 錯誤率與成績 — Table 2（@27002）；SI Eq. 5、Table C.14

題目層級迴歸，加入錯誤率與組別的交互作用（練習 N = 13,484，考試 N = 11,392）。

- 練習：GPT Base × 邏輯錯誤率 −0.448**（0.036）；GPT Base × 算術錯誤率 −0.492**（0.117）。
- 考試：GPT Base × 邏輯錯誤率 −0.029（0.040），不顯著；GPT Base × 算術錯誤率 −0.099（0.056），不顯著。
- 加了交互作用後，GPT Base 的考試主效果是 −0.035（0.027），不顯著。
- 另有：GPT Tutor × 算術錯誤率在練習 0.329**、在考試 0.095*（原文沒有討論這兩項）。邏輯錯誤率的主效果在考試是 **+0.178****（原文沒有解釋這個正號；註腳 §§ 只解釋練習階段的負號是題目較難）。
- 作者的推論（@27832 後）：錯誤沒有外溢到考試、算術錯與邏輯錯對練習的影響一樣大，「Both these results suggest that students are simply copying answers from GPT Base.」
- 整段錯誤率分析是**未預註冊的探索性分析**（SI A.6）。

### R10. 互動內容 — 正文 @29186–32169；Fig. 3（看過原圖）；SI C.2、Fig. C.4、C.3、Table C.15

- 每題平均訊息數（Fig. 3A，從圖讀，約略值）：GPT Base 四場都約 2.1–2.2；GPT Tutor 約 3.5、4.3、5.1、4.9。
- 完全沒有敷衍訊息（照抄題目或直接要答案）的對話比例（Fig. 3B，從圖讀）：GPT Base 約 0.20、0.28、0.25、0.25；GPT Tutor 約 0.41、0.51、0.42、0.50。也就是 **GPT Tutor 組仍有大約一半的對話含有要答案或照抄題目的訊息**。
- 第一場第一次互動：GPT Base 56%、GPT Tutor 42% 是照抄題目或要答案；第一場各題首則訊息合計：GPT Base 升到 67%、GPT Tutor 降到 37%（@30808）。
- GPT Base 四場最常見的首則訊息類型（Fig. C.4a）：第 1 場照抄題目 38%、要答案 29%、求助 8%；第 2 場要答案 35%、照抄 33%；第 3 場 25%、24%；第 4 場 36%、26%。
- GPT Tutor（Fig. C.4b）：第 1 場照抄題目 31%、自己試答 27%、要答案 6%；第 2 場用範本求助 37%；第 4 場自己試答 24%、範本求助 22%、照抄 13%。
- 平台停留時間（Table C.15，N = 1,617）：GPT Base 平均 15.5 分鐘（SD 6.4），GPT Tutor 多 2.046 分鐘（0.322），約多 13%。
- 分類方法：Sentence-BERT + UMAP + HDBSCAN，394 個群再聚成 29 個後設群，人工貼標。

## 作者自己列的限制

Discussion 末段（@35240–36598）：

1. 只有兩種 AI 家教、一個科目（數學）、土耳其一所高中。數學有客觀評分標準，寫作這類科目沒有。
2. 部署在 2023 年秋，生成式 AI 還很新；使用者的互動方式可能已經不同，模型也進步很多。
3. 「we focus on short-term outcomes due to limitations imposed by our partner school」；長期結果是未來方向。
4. 機制分析需要更細的對照實驗補強。

散在別處的：

- 註腳 ‡（@38307）：分析的是短期學習（用當堂考試估計），不是長期學習；作者主張拐杖機制「suggests」兩者都會受害，這是推論不是量到的。
- GPT Tutor 仍是被動回應，不會主動提問（@33955）。
- GPT Tutor 每題的提示詞要老師寫，「This problem-specific construction is labor-intensive」（@11400 前後）；雇了兩位數學老師兼職做（註腳 §、SI A.3）。
- GPT Tutor 練習考很高但考試沒贏的可能原因：學生可以叫它核對答案，對照組要交卷後才看到解答（@18556 後）。
- 初始互動差異可能來自 GPT Tutor 有建議提問、GPT Base 沒有（註腳 ##）。

我讀到、原文沒列為限制的：

- 對照組沒有筆電，兩個 GPT 組有；「有沒有裝置」與「有沒有 AI」綁在一起。
- 「防護」同時改了兩件事（不給答案＋塞進老師寫的正解與提示），兩者沒有拆開測。GPT Base 的答錯率約一半，GPT Tutor 因為提示詞有正解而很少錯，所以兩組差異不能只歸給「不給答案」。
- 考試緊接在練習後、題目與練習題高度相似。

## 與摘要說法不一致的地方

逐項對過，數字沒有不合，但有四處摘要沒交代或寫法比正文強：

1. 摘要與 Significance 的「17% reduction」「48%」「127%」來自迴歸（Table 1）。**預註冊的分析是 t 檢定**，考試差是 −0.035（約 11%），摘要沒提。
2. 摘要的 48% 與 127%（練習成績）是**未預註冊**的比較（SI A.6），摘要沒區分。
3. 摘要寫「nearly a thousand high school math students」；主分析樣本是 839 名填了問卷的非資優班學生，含資優班 943 人。
4. 摘要說負面效果「largely mitigated by the safeguards in GPT Tutor」；正文是「statistically indistinguishable」且點估計仍為負（−0.004），預註冊 t 檢定是 −0.006。摘要沒寫 GPT Tutor **沒有正向效果**，這一點在正文導言才講（「though we still do not observe a positive effect」，@8000 前後）。

原文內部的小出入（SI）：

- SI B.3 內文說 GPT Base 組願意放棄「about 2.5 minutes (8.3%)」，Table B.8 的係數是 2.245。GPT Tutor 的 3.7 分鐘（12.3%）與表中 3.710 相符。
- Fig. 1 的 GPT Tutor 提示詞開頭說學生在學「properties of conditional proposition」，但題目是解析幾何的直線方程式（看過原圖）；圖說標為 11 年級第一場第一題。
- 正文說 Fig. 3A 是「in a given session」的平均訊息數，圖說與座標軸寫「per problem」。

## 與清單「要撐的結論」不合的地方

**order 25：「考差的人不覺得自己學得少（感受段）」**——方向撐得住，寫法要改三處。

- 原文比的是組：GPT Base **這一組**平均考得較差，而這一組的自評（學到多少、考得如何）與對照組沒有顯著差異。不是追蹤「考差的個人」。
- 那是不顯著的結果（係數 −0.078，SE 0.080；−0.022，SE 0.077），只能寫「沒有偵測到他們覺得自己學得較少」，不能寫成「他們覺得一樣好」。
- 清單漏了更直接的一半：**GPT Tutor 組實際沒有考得比較好，卻顯著自評考得較好**（0.130，p < .05），也覺得練習較有價值（0.271，p < .01）。這才是「感受高於實際」的正向證據。
- 數字在 SI Table B.8，正文沒有任何感受的數字；引用時要標 SI。

**order 28：「無防護時考試較差；有防護時打平」**——撐得住，要加四個但書。

- 「較差」：迴歸 −0.054（17%），預註冊 t 檢定 −0.035；兩個都要能交代。
- 「打平」是與**沒有 AI 的對照組**統計上無差異（−0.004，SE 0.013），不是有學到更多。
- 考試是同一堂課緊接著考，沒有延後測驗；作者自己說是短期結果。
- 「防護」包含老師逐題寫的正解與提示，不只是一句「不要給答案」；而無防護的那一版在這批題目上約一半機率給錯答案。

## 讀取紀錄

正文檔（字元位置，首尾相接）：

1. @0–26000：書目、Significance、摘要、導言、Experimental Design、Main Results、Table 1、感受、異質性、離散度、穩健性、機制段開頭
2. @25200–26450：補上一段輸出截斷處的重疊區（Fig. 2 圖說到 Table 2 之前）
3. @26400–46326（檔尾）：Table 2、Student Engagement、Discussion、致謝、作者貢獻、註腳、資料可得性、參考文獻（28 條，全部看過）

SI 附錄 `bastani2025pnas_sapp.txt`（行號）：

4. L1–420：首頁、A.1–A.6、Table A.1 數字欄
5. L420–1100：Table A.1 列名、Table A.2、A.3、B.1–B.4、Table B.4–B.10 前半
6. L1100–1750：Table B.10、B.11、B.5、B.6、Table B.12、B.13、C.1–C.3、Table C.14、Fig. C.4、C.5、Table C.15 前半
7. L1750–2483（檔尾）：Table C.15、附錄 D（九到十一年級四場的全部練習題與考題）、參考文獻

對過 PDF 版面的表（SI 用 `pdftotext -layout` 逐頁對，SI 是單欄）：Table A.1（p.9）、A.2、A.3（p.10）、B.7（p.13）、B.8（p.14）、B.9（p.15）、B.10、B.11（p.16）、C.15（p.24）。Table B.4、B.5、B.6、B.12、B.13、C.14 只讀了不帶 layout 的文字版，欄位順序清楚、沒有另對。

正文 Table 1、Table 2 來自 PMC 的 XML（不是 PDF 轉文字），沒有雙欄錯位問題；沒有另外對出版者 PDF。

看過的圖：正文 Fig. 1（提示詞全文）、Fig. 3（兩張長條圖，數值是從圖上讀的約略值）。Fig. 2（錯誤率直方圖）存了檔但沒開。SI 的 Fig. A.1–A.3、C.5 只讀到圖說，圖本身沒看。

更正啟事：全文讀過（很短）。

沒讀的：預註冊文件本身（aspredicted.org/4DL_Q3J）、GitHub 上的資料與程式。
