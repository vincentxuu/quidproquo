# 抽取紀錄：Huang、Thoeni、Fryer 2025，OSF 預印本（doi 10.31219/osf.io/rdtg5_v2）

- **書目**：Weijiao Huang（香港大學 Teaching and Learning Innovation Centre）、Andrew Thoeni（University of North Florida, Coggin College of Business；通訊作者）、Luke K. Fryer（香港大學）。作者全名與單位對首頁 L3–16 核過，也與 Crossref 紀錄相符。〈Interact more, learn more? A randomized controlled trial of GenAI tutors on student course interest, self-efficacy, and learning performance〉。OSF Preprints，第 2 版，2025-07-08 貼出。DOI 10.31219/osf.io/rdtg5_v2（Crossref 標為第 1 版 rdtg5_v1 的新版本）。
- **版本**：預印本，未經同儕審查。2026-10-14 查 OSF API：第 2 版是最新版、未撤回、沒有登記對應的期刊版 DOI。有沒有後來刊出的期刊版我沒有查到，不確定。
- **原文檔**：`.research/raw/learning-content/q6-evaluate/huang2025genaitutor-osf.txt`（docx 轉文字，777 行、81,907 字元）；原始檔同目錄 `huang2025genaitutor-osf.docx`（來源 https://osf.io/download/nw4zy/）。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 28（清單 28#10，標 ⊖）
- 行號是 `.txt` 的行號。文字檔每段一行，所以一個行號可能是一整段；表格被拆成一格一行，表內數字另外從 docx 逐列重抽對過。

## 研究設計

- **類型**：學生層級隨機分派的課堂實地實驗（RQ1），加上實驗組內部的觀察分析（RQ2–5）（L29）。全文沒有提到預先註冊，也沒有檢定力分析。IRB 判定為豁免（L68）。
- **地點與課程**：美國東南部一所公立州立大學商學院的行銷學入門課（L68）。16 週，實際授課 14 週；一個非同步線上班（看錄影）與兩個面授班（約 40 人與約 200 人）（L69）。
- **受試者**：開學第一週加退選結束後，同意參加的學生被隨機分到兩組。扣掉退出、退選、沒有做完前後測與前後問卷的人，最後 253 人：對照組 126、實驗組 127（L69）。**原文沒有寫當初分派了多少人，也沒有寫各組流失多少。** 平均年齡 21.9；女 114、男 136、非二元 3；線上 108、面授 145；每週工作 40 小時以上 37 人、不到 40 小時 135 人、沒有工作 76 人、未答 5 人（Table 1，L71–258）。
- **介入**（L261、L267）：
  - 實驗組從第 4 週起可以無限制使用「GenAI Tutor」，到第 14 週。收到通知、連結與使用提示。
  - 這個 Tutor 是「customized ChatGPT-4o API integrated with course materials」，課程資料包括詞彙、每章的高階摘要、可當起點的概念題範例（L267）；另一處說是用 Microsoft Azure AI（「Copilot」）建的 RAG 系統（L260）。
  - 系統指示要它「primarily posing questions and assessing answers related to a given chapter or discussing concepts with a student and answering the student's questions」（L267）。
  - **用不用、用多少由學生自己決定，不算分**（L267「could engage with the GenAI Tutor as often as they desired」；L578「its use was not tied to any course credit」）。
- **比較對象**：對照組不能用 Tutor，其餘完全相同。兩組都照常上課、都被鼓勵用同一套 Quizlet 單字卡做線上練習（非強制，沒有使用紀錄）。L267：「the only difference between the control and treatment groups was the treatment group had access to the GenAI Tutor.」所以比的是「**多給一個可選用的 AI 家教**」對「不給」，不是「用 AI」對「不用 AI」。
- **量了什麼、何時量**：
  1. **學習表現**：兩次課內考試，各 50 題選擇題，授課老師命題（L279）。第 3 週那次（考前三週內容）當前測；第 14 週那次當後測，「covered different learning content」（L268），考的是「the content learnt during the final period of the class」（L279）。兩次考的內容不同，不是同一份測驗重複施測，所以分析用各自標準化後的分數（L347）。
  2. **課程興趣**：5 題、6 點量表（附錄 A，L671–676）。
  3. **自我效能**：4 題、6 點量表（附錄 A，L678–682）。
  - 2、3 在頭兩週（前問卷）與介入後（後問卷）各量一次（L264、L268）。
  4. **使用量**：只記錄登入的時間戳記，沒有每次用多久，也沒有對話內容（L280、L578）。課程分四個時期，第一期是介入前；依後三期裡有幾期登入過，把實驗組分成 None（從沒登入）、One-time（一期）、Occasional（兩期）、Regular（三期都有）（L280）。注意「One-time」是「只在一個時期登入過」，不是只登入一次。
  5. 前問卷另有 3 題問對生成式 AI 的熟悉度與使用頻率（5 點量表；附錄 A，L684–687）。
- **分析**：RQ1 用差異中之差異（DiD）迴歸；RQ2 用單因子 ANOVA；RQ3 用 Spearman 相關；RQ4 用 Wilcoxon 等級和檢定；RQ5 寫的是獨立樣本 t 檢定（L283–286）。軟體 JMP 18.1.2。
- **量表品質**（附錄 B，L688–776）：CFA 配適 T1 RMSEA = 0.077、CFI = 0.959；T2 RMSEA = 0.057、CFI = 0.982（L282）。McDonald ω：課程興趣 0.834／0.866，自我效能 0.822／0.828（Table 8）。AVE：課程興趣 0.504／0.565，自我效能 0.536／0.547（Table 9）。

## 結果（逐項）

Table 1–9 的數字都從 docx 的表格結構逐列重抽對過，與下面一致。

### RQ1：有 Tutor 使用權 對 沒有（隨機分派）

| # | 結果 | 數字 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 基線是否相當 | 興趣 p = .464；自我效能 p = .962；考試 p = .151，都不顯著 | 3.4 | L283 | 「found no significant difference (interest: p = .464; self-efficacy: p = .962; test score: p = .151)」 |
| 2 | 課程興趣的描述統計 | 對照組 n=96：前 4.94（SD 0.70）→ 後 5.07（SD 0.81）；實驗組 n=95：前 4.99（SD 0.66）→ 後 5.06（SD 0.66） | Table 2 | L293–343 | 表列 |
| 3 | 課程興趣（H1a） | 整體模型不顯著：R² = 0.01，F(3, 384) = 0.71，p = .549；組別 β = −0.01，p = .850；時間 β = −0.05，p = .173；**組別×時間 β = −0.02，p = .645** | 4.1 | L291 | 「These results reveal that the changes in students' course interest did not differ significantly between the two groups after the intervention.」 |
| 4 | 自我效能的描述統計 | 對照組 n=96：5.04（SD 0.64）→ 5.37（SD 0.61）；實驗組 n=95：5.05（SD 0.69）→ 5.34（SD 0.61） | Table 2 | L316–329 | 表列 |
| 5 | 自我效能（H1b） | 整體模型顯著：R² = 0.05，F(3, 440) = 7.38，p < .001；時間主效果顯著（β = −0.14，p < .001）；組別 β = 0.01，p = .789；**組別×時間 β = −0.01，p = .739** | 4.1 | L346 | 「there was no significant difference in the changes in self-efficacy between the groups」 |
| 6 | 考試成績的描述統計 | 對照組 n=126：前測 77.90%（SD 0.09）→ 後測 80.50%（SD 0.12）；實驗組 n=127：76.20%（SD 0.10）→ 80.10%（SD 0.11） | Table 2 | L330–343 | 表列 |
| 7 | 學習表現（H1c，標準化分數） | 整體模型不顯著：R² = 0.00，F(3, 502) = 0.72，p = .541；組別 β = 0.05，p = .222；時間 β = −0.00，p = .997；**組別×時間 β = 0.04，p = .418** | 4.1 | L347 | 「none of the parameters reached statistical significance」 |
| 8 | 作者補的一句「趨勢」 | 標準化分數對照組下降、實驗組上升（Figure 2），不顯著 | 4.1 | L348 | 「none of the initial hypotheses of RQ1 were confirmed. However, an observed trend indicated that the standardized test scores declined in the control group but increased in the treatment group (see Figure 2).」 |

第 8 項換成原始分數是：對照組 +2.6 個百分點、實驗組 +3.9 個百分點（我用 Table 2 相減），差 1.3 個百分點。原文沒有給組間差異的效果量或信賴區間，所以不能從這篇說「效果小到多少以下」，只能說沒有偵測到差異。

### RQ2：實驗組內，用得多的人 對 用得少的人（觀察，非隨機）

n = 95（實驗組裡前後問卷與考試都做完的人）。四組人數：None 18、One-time 43、Occasional 19、Regular 15（Table 3，L359–438）。

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 9 | 課程興趣（H2a） | None 4.93（SE 0.16）、One-time 5.03（0.10）、Occasional 5.16（0.15）、Regular 5.15（0.17）；F(3,91) = 0.48，p = .700 | L357、L367–390 | 「the results of ANOVA tests indicated these differences were not statistically significant」 |
| 10 | 自我效能（H2b） | None 5.21（0.15）、One-time 5.38（0.09）、Occasional 5.30（0.14）、Regular 5.40（0.16）；F(3,91) = 0.42，p = .740 | L357、L391–414 | 「no group differences were found」 |
| 11 | 學習表現（H2c，z 分數） | None 0.03（0.22）、One-time 0.20（0.14）、**Occasional −0.30（0.21）、Regular −0.05（0.24）**；F(3,91) = 1.32，p = .273 | L357、L415–438 | 「these differences did not reach statistical significance … there was insufficient evidence to support H2a-c.」 |
| 12 | 使用量本身 | 95 人裡 18 人從沒登入、43 人只在一個時期登入過，合計 61 人；三個時期都有登入的只有 15 人 | L564、L568 | 「a considerable number of inactive users (18 students in the "None" group and 43 students in the "One-time" group)」「Only 15 students interacted continuously with the Tutor.」 |
| 13 | 什麼時候用 | 登入集中在考試前後；原因不明 | L565 | 「our data only captured the login records across three time periods and showed that their usage peaked around assessments. … our data did not reveal the underlying reasons for these usage patterns.」 |

第 11 項的方向值得記：成績平均最高的是只在一期登入過的人，登入最勤的兩組反而在平均以下，但都不顯著，每組只有 15 到 43 人。這一段是觀察資料，誰用得多不是隨機決定的。

### RQ3–5：誰比較常用（實驗組內的相關）

| # | 結果 | 數字 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 14 | 事前對生成式 AI 的熟悉度與登入次數 | ρ = .14，p = .129（n = 126）；平均 2.90／5 | 4.3、Table 4 | L442、L450–453 | 「showed no significant relationships」 |
| 15 | 平常用 AI 查資料的頻率 | ρ = .16，p = .083；平均 1.98／5 | 同上 | L442、L454–457 | 「although each correlation was positive」 |
| 16 | 用 AI 幫助學課程內容的頻率 | ρ = .15，p = .095；平均 2.10／5 | 同上 | L442、L458–461 | 同上 |
| 17 | 面授 對 線上（H4，作者原本預期線上用得多） | 面授 n = 74、平均等級 73.21；線上 n = 53、平均等級 51.14；z = −3.37，p < .001，r = 0.30。**方向和假設相反** | 4.4 | L465 | 「showing face-to-face students logged in more frequently than online students. These results support H4, but in the opposite direction.」 |
| 18 | 沒工作 對 有工作（H5） | 沒工作 n = 44，登入次數 M = 6.02（SD 7.08）；有工作 n = 83，M = 2.77（SD 3.68）；z = 3.02，p = .003，r = 0.268 | 4.5 | L467 | 「with non-working students logging in more frequently (M = 6.02, SD = 7.08) than working students (M = 2.77, SD = 3.68)」 |
| 19 | 事後分析：工作狀態與上課方式 | 兩類（有／無工作）對上課方式：p = .057，不顯著（n = 248）。三類：每週工作 40 小時以上的 37 人裡 27 人（72.97%）在線上班；不到 40 小時 135 人裡 54 人（40.00%）；沒工作 76 人裡 26 人（34.21%）；χ²(2, N = 248) = 16.58，p < .001，Cramér's V = 0.259 | 4.6、Table 5 | L469–527 | 「Students working 40 or more hours were more likely to be in the online class (73%) compared to the face-to-face classes (27%).」 |

第 18 項的 6.02 與 2.77 是整個介入期（約 11 週）的登入次數，可以拿來描述「這個家教被用得多稀」。

### 假設總表（Table 6，L529–554）

H1a、H1b、H1c、H2a、H2b、H2c、H3a、H3b、H3c 全部「Not supported」；H4「Supported in opposite direction」；H5「Supported」。

### 作者對零結果的解釋（都是推測，沒有檢定）

- 用得太少可能蓋掉效果：L558「students' low engagement with the Tutor could be reducing the effect, considering a number of inactive users」。
- 興趣與自我效能一開始就高（約 5／6），沒有多少上升空間（L560）。
- 兩組都有 Quizlet，Tutor 能多加的價值有限：L561「The use of Quizlet could provide accessible support for learning in this introductory marketing course, where the Tutor may have limited added value in this context. This may explain the lack of significant differences in post-test performance」。
- 互動的量不等於質：L566「it is the quality - not just the presence - of interaction that influences student learning」（引 Woo & Reeves 2007）。
- 給老師的建議：L582「the benefits of using GenAI, in its current form, should be carefully considered, especially when traditional instruction already provides effective learning support (e.g., through regular low-stakes assessments).」

## 作者自己列的限制

第 6 節（L578）：

1. AI 部分由第三方供應商開發，拿不到學生與 Tutor 的對話紀錄，無法分析互動內容。
2. 沒有做深度訪談，不知道學生怎麼看待用這個工具學習。
3. 作者自稱這是一個大型計畫的「preliminary study」。
4. 受試者是商學院學生，而且是自願參加（opt-in），推廣性受限。
5. 使用 Tutor 不算分，是選用資源，「may have contributed to the relatively low engagement」。
6. 沒有涵蓋其他自然條件：向老師或同學求助、每週花的時間、**是否使用其他生成式 AI 工具**。

散在別處的：

7. 只有登入時間戳記，沒有使用時長（L280）。
8. Quizlet 沒有使用資料（L267）。
9. 事前的 AI 經驗是自陳的，沒有客觀量（L569）。
10. RQ2 是觀察不是操弄（L565）。

原文沒有談的：沒有檢定力分析、沒有報告組間差異的效果量與信賴區間；沒有報告分派人數與流失；對照組學生可以自己去用 ChatGPT 之類的工具（只在限制第 6 點間接帶到）；問卷只有 191 人做完（253 人的 75%）；後測只考最後一個時期的內容，而 Tutor 的使用橫跨三個時期。

## 與摘要說法不一致的地方

摘要的每一句結果都對得上內文（三項結果無組間差異；組內依使用頻率無差異；面授與沒工作的人用得較多；事前 AI 經驗無關）。逐項對過，數字上沒有矛盾，但有以下幾處：

1. **摘要與標題叫它「randomized controlled trial」**，隨機分派的只有「有沒有使用權」。摘要第二句「compared students using the GenAI Tutor with a control group」（L21）會讓人以為比的是實際使用者；實際上實驗組 95 個做完問卷的人裡有 18 人從沒登入。
2. **摘要「regardless of the frequency of interaction」**（L21）：頻率是用「三個時期裡有幾期登入過」分的四類，不是登入次數，也不是用了多久。
3. 摘要沒有提兩組都有 Quizlet，也沒有提使用量很低；這兩點是作者自己在討論裡拿來解釋零結果的。
4. **內文自己的不一致**：
   - 自由度與樣本數對不上：H1a、H1b 都說分析限於 191 人（L291），191 人 × 2 個時間點是 382 筆，但 H1a 的 F(3, 384) 對應 388 筆、H1b 的 F(3, 440) 對應 444 筆。H1c 的 F(3, 502) 對應 506 筆 = 253 × 2，是對的。
   - H5 的人數：內文說沒工作 44、有工作 83（L467）；Table 1 的實驗組是沒工作 42、有工作 82（68 + 14）、未答 3。同一句還說分析「只含有填工作狀態的人（n = 127）」，但 127 是整個實驗組。
   - H5 的檢定：方法段與結果段都寫「independent samples t-tests」（L286、L467），報的統計量卻是 z = 3.02。
   - 5.3 節引錯表：說「descriptive results (in Table 3)」顯示事前 AI 經驗低（其實是 Table 4），又說「none-user group in Table 2」（其實是 Table 3）（L568）。
   - H2 的寫法前後不同：2.4 節寫的是用得多的人高於「students without the GenAI Tutor」（L51），Table 6 與分析比的是實驗組內用得多與用得少的人。
   - H1b 的時間效果寫「β = −0.14, p < .001, Cohen's ƒ2 < 0.01, insignificant effect」（L346），p < .001 卻說 insignificant effect，應是指效果量小；而且係數是負的，描述統計是上升的（5.04→5.37），原文沒有說明編碼方向。
   - Tutor 的底層一處說 ChatGPT-4o API（L267），一處說 Microsoft Azure AI（「Copilot」）（L260）。
5. **引用文獻的錯置**：L36 把「metacognitive laziness」說成 Bastani 2024 發現的效果、「also noted by Fan et al. (2024)」；這個詞出自 Fan 等人那篇，不是 Bastani。這是原文的轉述問題，不要跟著轉引。

## 與清單『要撐的結論』不合的地方

清單寫：「RAG 家教對興趣、自我效能、成績都無差異」。

- **撐得住，但主詞要改**。原文比的是「多提供一個可選用、不算分的 RAG 家教」對「不提供」，三項結果的組別×時間交互作用都不顯著（p = .645、.739、.418）。寫成「RAG 家教沒有效」或「用了也沒差」就超出原文：
  1. 實際使用量很低。做完問卷的 95 個實驗組學生裡，18 人從沒登入、43 人只在一個時期登入過；整個介入期的平均登入次數是有工作者 2.77 次、沒工作者 6.02 次。
  2. 兩組都有 Quizlet 單字卡，作者自己說 Tutor 在這門課能多加的價值可能有限。
  3. 沒有檢定力分析，也沒有效果量的信賴區間，253 人的樣本排除不了小效果。
  4. 後測只考最後一個時期的內容；興趣與自我效能起點就在 5／6 上下。
- **「用得多的人也沒有比較好」**（組內四類，p = .700、.740、.273）是觀察結果，不是實驗結果，每組 15 到 43 人。可以寫，但要標明是相關。
- 清單把它標成 ⊖（結果相反或無效果）是對的。這篇量到的是**「把工具放在那裡讓學生自己取用」的結果，而多數學生幾乎沒有用**；這個說法比「RAG 沒用」更接近原文。（它和清單上其他篇的關係我沒有比，那是綜合階段的事。）
- 這篇是預印本，作者自稱 preliminary study，內文有多處樣本數與自由度對不上（見上節第 4 點），引用時統計量只引組別×時間的 p 值與描述統計，並註明未經審查。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | L1–260 | 標題、作者與單位、摘要、1 導言、2 文獻回顧與假設（2.1–2.4，RQ1–5、H1–H5）、3.1 情境與受試者、Table 1 |
| 2 | L260–777 | 3.1 後半、3.2 程序、3.3 資料蒐集與工具、3.4 分析；4.1–4.6 結果、Table 2–6；5 討論（5.1–5.4）；6 限制；7 結論；參考文獻 L584–665（掃過）；附錄 A 量表題目（L669–687）；附錄 B CFA 結果與 Table 7–9（L688–776） |
| 對表 | docx | 用 `python3 -I` 讀 `word/document.xml`，把 Table 1–9 逐列印出來對，與文字檔相符 |
| 看圖 | docx 內嵌圖 | Figure 1（研究設計與資料蒐集時程）看過，內容與 3.2 節文字相符，圖上標了三次登入時期。**Figure 2（兩組前後測標準化分數圖）是 EMF 格式，打不開，沒有看到**；內文對它的描述只有 L348 一句，數字不受影響 |

全文讀完，沒有缺節。文字檔沒有頁碼。
