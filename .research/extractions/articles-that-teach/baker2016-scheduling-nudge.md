# 抽取紀錄：Baker、Evans、Dee 2016，A Randomized Experiment Testing the Efficacy of a Scheduling Nudge in a Massive Open Online Course (MOOC)

- **書目**：Rachel Baker（University of California, Irvine）、Brent Evans（Vanderbilt University）、Thomas Dee（Stanford University）。2016。A Randomized Experiment Testing the Efficacy of a Scheduling Nudge in a Massive Open Online Course (MOOC)。*AERA Open*，October–December 2016，Vol. 2，No. 4，pp. 1–18。DOI 10.1177/2332858416674007。作者姓名與單位對過首頁（L18–23）。CC-BY 3.0 開放取用（L63–65）。
- **原文檔**：
  - `.research/raw/learning-content/q4-time/baker2016-scheduling-nudge.txt`（清單原檔，`pdftotext -layout`，1,070 行、117,252 位元組）。下面寫「L」的是這個檔的行號。雙欄並排、左右欄可分辨，表格版面完整。
  - 這次另存：`q4-time/baker2016-scheduling-nudge.pdf`（18 頁，來源 `https://files.eric.ed.gov/fulltext/EJ1194402.pdf`，ERIC 收的刊出版）與 `q4-time/baker2016-scheduling-nudge-nolayout.txt`（不帶 `-layout` 重轉，1,988 行、86,335 位元組）。下面寫「NL」的是重轉檔的行號。
- **版本**：刊出版（出版者排版，含頁碼 1–18）。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 19（清單 D，19#5）

## 研究設計

- **類型**：大型場域隨機對照實驗，單一課程。全文沒有提到預註冊。
- **場域**：Coursera 上一門「science-based MOOC」，2013 年首次開課；不太技術、沒有先修條件（L216–219）。課名沒有公開。8 個主題各一週；每週約 12 支影片、每支約 10–20 分鐘（L225–228）。拿證書兩條路：每週測驗＋每週習題，或每週測驗＋期末專題；總成績至少 70%（L219–224；註 4，L968–975）。
- **受試者**：18,043 人，條件是有有效 e-mail、在開課至少 2 天前註冊（L235–237、L362–364）。之後註冊的人不在實驗內。參與者不知道自己在實驗中（NL L604–605）；IRB 依 Coursera 的一般同意條款核准（註 3，L964–967）。
- **分派**：以三個變項區組化——有沒有填教師的課前問卷、e-mail 是不是 gmail.com、是不是 .edu——之後隨機分派，處理組 n = 9,022、控制組 n = 9,021（L364–366、L312–315）。教師不知道誰在哪一組（L275–276）。
- **處理組收到什麼**（L277–302；信件全文在附錄 Figure A1，L867–891）：
  - 開課前 2 天，一封以課程團隊名義、教師署名的信：提醒課程開始、第一週的要求與預估時間（約兩小時），加上一句「Research finds that students who schedule their work time in advance get more out of their courses. Toward that end, please click on the link below to schedule when you will watch the first video entitled "Week 1 introduction:"」。
  - 連到一份兩題的問卷（單選鈕）：打算哪一天看第一支影片、哪一個小時（當地時間）。問卷另寫要學生「make note of the day and time you selected on your calendar」（L297–299）。
  - 第二週影片釋出前，再收到一份幾乎相同的問卷，排第二週第一支影片（L300–303）。
  - 也就是說，介入只請學生排**每週第一支影片**的觀看時間，共兩次；不是持續提醒，也沒有任何違約後果（作者稱為 soft commitment，註 2，L949–963）。
- **控制組收到什麼**（L317–341；Figure A2，L897–922）：同一天收到內容相同的信，只是把排程那句換成請學生回報用哪個瀏覽器看課，連到一題五選一的問卷。第二週**沒有**收到對應的問卷信，但收到教師發給全班的兩封非問卷信。
- **污染檢查**：監看討論區一週，數百個活躍討論串裡只有一串提到排程提示，瀏覽 308 次，沒有後續討論（L342–357）。
- **量了什麼**（L325–332）：五個結果，全部取自平台紀錄，沒有流失——
  1. 有沒有看第一週第一支影片
  2. 有沒有看第二週第一支影片
  3. 看過的不重複影片數
  4. 課程成績（0–100）
  5. 有沒有拿到證書
- **估計**：ITT 用線性迴歸（二元結果用線性機率模型），放入處理、三個區組變項、註冊時間三類、國家三類（L320–344）。註 6：probit 與負二項模型結果「substantively similar」（L982–986）。TOT 用兩階段最小平方法，以「打開任一份排程問卷」（Table 5）或「完成任一份」（Table 6）定義接受處理。
- **平衡檢查**（Table 2，L373–394，對過 PDF 第 7 頁的版面文字）：用前測特徵預測處理狀態，沒有任一項在 10% 水準顯著；聯合 F = 0.64，p = 0.7228；R² = 0.0002。
- **樣本描述**（Table 1，L249–292；N = 18,043，括號內是標準差）：

  | 變項 | 平均 |
  |---|---|
  | 看了第一週第一支影片 | 0.468 (0.499) |
  | 看了第二週第一支影片 | 0.322 (0.467) |
  | 看過的不重複影片數 | 19.025 (31.617) |
  | 課程成績（0–100） | 11.170 (27.284) |
  | 拿到證書 | 0.089 (0.285) |
  | 處理組：打開第一週排程問卷 | 0.125 (0.330) |
  | 處理組：完成第一週排程問卷 | 0.101 (0.301) |
  | 處理組：打開第二週排程問卷 | 0.065 (0.246) |
  | 處理組：完成第二週排程問卷 | 0.049 (0.216) |
  | 處理組：打開任一份 | 0.159 (0.366) |
  | 處理組：完成任一份 | 0.127 (0.333) |
  | 控制組：打開瀏覽器問卷 | 0.139 (0.346) |
  | 控制組：回答瀏覽器問卷 | 0.135 (0.341) |
  | @gmail 信箱 | 0.561 (0.496) |
  | .edu 信箱 | 0.028 (0.164) |
  | 填了課前問卷 | 0.077 (0.266) |
  | 早註冊（開課前 ≥ 1 週） | 0.569 (0.495) |
  | 晚註冊（開課前 < 1 週） | 0.224 (0.417) |
  | 註冊日期缺漏 | 0.207 (0.405) |
  | 美國國內 | 0.170 (0.376) |
  | 國際 | 0.420 (0.494) |
  | 國家缺漏 | 0.409 (0.492) |

  Coursera 不收人口統計資料，年齡、性別、學歷、收入都沒有（L240–243）。IP 位址約 60% 的人有（L250）。

## 結果（逐項）

### A. 接受率（Table 3，L436–464，對過 PDF 第 8 頁）

| # | 結果 | 數字 | 對照條件 | 表／節 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 處理組打開任一份排程問卷 | 15.9%（係數 .159，SE .004，p < .001；三個模型相同） | 控制組拿不到排程問卷，基準為 0 | Table 3 (1)–(3) | L443–444；NL L667–669 | 「nearly 16% of treatment students opened at least one of the scheduling surveys」 |
| 2 | 處理組完成任一份排程問卷 | 12.7%（係數 .127，SE .003–.004，p < .001） | 同上 | Table 3 (4)–(6) | L443–444；NL L669–671 | 「12.7% completed a survey and committed to watching the lecture video on a specific date and time.」 |
| 3 | 第一週、第二週各自 | 第一週：12.5% 打開，其中 80%（處理組的 10.1%）選了時間；第二週：6.5% 打開，其中 76%（4.9%）選了時間 | — | 註 5 | L976–981 | 「Twelve-and-a-half percent of students in the treatment condition opened the first scheduling survey, and 80% of them (10.1% of all treatment students) selected a day and time」 |
| 4 | 控制組的瀏覽器問卷回應率略高 | 控制組 13.9% 打開、13.5% 回答；處理組 12.5% 打開、10.1% 選了時間 | 第一份問卷，兩組互比 | Blocking… | L315–319 | 「The response rate for the first survey is slightly higher for the control survey」 |
| 5 | 誰比較會接受（Table 3 模型 3，打開） | 填過課前問卷 +.141***；晚註冊 +.023***；註冊日期缺漏 +.061***；國際 −.028***；國家缺漏 −.106***；gmail −.005、.edu −.011 不顯著 | 參照組：早註冊、國內 | Table 3 (3) | L445–458 | 表列 |
| 6 | 作者對接受率的定性 | 相對於只有 7.7% 填課前問卷算高，但整體偏低，本身是發現 | — | Treatment Uptake | L467–470 | 「the overall modest uptake of this treatment is itself a substantive finding and consistent with recent precommitment studies.」 |
| 7 | 排了時間的人有沒有照做 | 填了第一份問卷的人 85% 看了第一支影片；多數在排定當天看，當天看的人多數在排定時間前後一小時內 | 只描述處理組內有排的人，沒有對照 | Treatment Uptake；Figure 1、2 | L471–476、L467–471 | 「85% of students who filled in the first survey did watch the first video」「Students who commit to watching the video on a specific day and time are mostly adhering to their schedule.」 |

Figure 1（PDF 第 9 頁，看過圖）：學生承諾的觀看時間密度圖，高峰在影片釋出隔天（Day 2）晚上 9 點附近，之後下降；每天晚上各有小峰。Figure 2：左圖實際觀看日相對承諾日的直方圖，最高一格在 0（約 380 人，從圖上讀的，不精確）；右圖是當天觀看者相對承諾時刻的小時差。兩張圖都沒有數值標籤。

### B. 主要結果：意向處理（ITT）估計（Table 4，L520–551，對過 PDF 第 10 頁）

對照條件：被分派到排程提示 對 被分派到瀏覽器問卷的控制組；N = 18,043；控制共變項。† p < .10，* p < .05，** p < .01，*** p < .001。

| # | 結果變項 | 處理係數（SE） | 顯著性 | 控制組平均 | R² |
|---|---|---|---|---|---|
| 8 | 看了第一週第一支影片 | −0.010（0.006） | 不顯著 | 0.474 | 0.283 |
| 9 | 看了第二週第一支影片 | −0.003（0.006） | 不顯著 | 0.322 | 0.214 |
| 10 | 看過的不重複影片數 | −0.733（0.419） | † p < .10 | 19.37 | 0.209 |
| 11 | 課程成績（0–100） | −0.642（0.381） | † p < .10 | 11.49 | 0.122 |
| 12 | 拿到證書 | −0.008（0.004） | † p < .10 | 0.093 | 0.085 |

- 作者的文字（L483–494、L506）：「there were no effects of the scheduling device on near-term outcomes and weakly significant negative effects for later outcomes.」「Relative to control students, students assigned to treatment watched three quarters of a video less, had over-a-half-pointlower course grade, and were nearly 10% less likely to earn a certificate (from a baseline of 9.3% of control students earning a certificate).」
- **五個 ITT 估計沒有任何一個達到 p < .05。** 三個負向的都只有 p < .10；兩個近期結果的點估計也是負的但不顯著。
- 「nearly 10%」是相對值：−0.008 ÷ 0.093 ≈ −8.6%（我算的）；絕對差是 0.8 個百分點。
- 作者對「只有遠期結果顯著」的解讀是推測：「might reflect the dynamic nature of engagement; as course participation is a recursive process, this early treatment could have an effect that grew over time」（L507–512）。

Table 4 的其他係數（參考用，都是共變項不是處理效果）：填過課前問卷 +0.198***／+0.190***／+12.100***／+14.670***／+0.118***；gmail −0.048***／−0.059***／−4.696***／−4.006***／−0.039***；.edu −0.091***／−0.115***／−8.322***／−4.851***／−0.042***；晚註冊 0.006／−0.005／−1.671**／1.142*／0.009；註冊日期缺漏 0.372***／0.145***／3.874***／1.393***／−0.005***；國際 −0.080***／−0.069***／−2.933***／−0.294／0.003；國家缺漏 −0.693***／−0.518***／−31.568***／−16.918***／−0.136***。

### C. 對接受者的效果（TOT）與次群體（Table 5，L581–622，對過 PDF 第 11 頁）

Table 5：以「打開任一份排程問卷」為接受處理的兩階段最小平方估計。對照條件：同一次群體內，處理組的接受者 對 控制組（工具變項是隨機分派）。

| 次群體 | n | 第一階段（打開） | 第一週影片 | 第二週影片 | 影片數 | 成績 | 證書 |
|---|---|---|---|---|---|---|---|
| 全樣本 | 18,043 | 0.159*** (0.004) | −0.062 (0.040) | −0.017 (0.039) | −4.600† (2.648) | −4.029† (2.408) | −0.048† (0.026) |
| @gmail | 10,128 | 0.149*** (0.005) | −0.063 (0.057) | 0.027 (0.054) | −4.223 (3.576) | −3.86 (3.122) | −0.037 (0.033) |
| .edu | 498 | 0.166*** (0.023) | −0.461† (0.249) | −0.487* (0.238) | −38.036* (15.190) | −29.593* (13.781) | −0.246† (0.141) |
| 其他信箱 | 7,425 | 0.173*** (0.006) | −0.027 (0.056) | −0.030 (0.057) | −2.181 (4.033) | −1.838 (3.823) | −0.042 (0.041) |
| 填過課前問卷 | 1,386 | 0.436*** (0.019) | −0.041 (0.047) | −0.036 (0.055) | −7.219† (4.181) | −3.826 (4.348) | −0.057 (0.049) |
| 沒填課前問卷 | 16,657 | 0.136*** (0.004) | −0.070 (0.049) | −0.015 (0.047) | −4.150 (3.165) | −4.393 (2.819) | −0.048 (0.030) |
| 早註冊 | 10,261 | 0.146*** (0.005) | −0.053 (0.054) | −0.002 (0.056) | −2.357 (4.194) | −1.204 (3.758) | −0.027 (0.040) |
| 晚註冊 | 4,042 | 0.209*** (0.009) | −0.059 (0.066) | −0.047 (0.069) | −10.836* (4.955) | −11.584* (4.687) | −0.112* (0.050) |
| 註冊日期缺漏 | 3,740 | 0.143*** (0.008) | −0.078 (0.111) | −0.001 (0.083) | −0.159 (1.909) | 0.424 (1.423) | −0.004 (0.004) |
| 國內 | 3,076 | 0.253*** (0.011) | −0.089 (0.064) | −0.093 (0.070) | −8.276 (5.201) | −7.018 (4.715) | −0.073 (0.051) |
| 國際 | 7,585 | 0.197*** (0.006) | −0.038 (0.056) | 0.022 (0.057) | −3.949 (4.239) | −3.925 (3.875) | −0.050 (0.042) |
| 國家缺漏 | 7,382 | 0.081*** (0.004) | −0.074 (0.100) | −0.008 (0.075) | −0.505 (1.786) | −0.318 (1.355) | −0.010† (0.006) |

作者對 Table 5 的文字：

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 13 | 全樣本 TOT：證書 | −4.8 個百分點，10% 水準顯著；控制組 9.3%；相對 −52% | L564–571 | 「the causal effect of taking up the treatment on the certificate outcome was negative 4.8 percentage points, which is significant at the 10% level. … Relative to this baseline, treatment uptake decreased this measure of long-term persistence and engagement by 52%.」 |
| 14 | 全樣本 TOT：成績、影片數 | 成績 −4.0（控制組平均 11.5）；影片數 −4.6（控制組平均 19） | L571–575 | 「reduced course grades by 4.0 percentile points relative to a control group mean of 11.5. Finally, it reduced the number of lectures watched by 4.6 relative to a control group mean of 19.」 |
| 15 | 沒有任何次群體是正效果 | — | L628–630 | 「although for no group do we find a positive effect of the scheduling device.」 |
| 16 | 填過課前問卷的人（最投入的一群） | 接受率最高（44% 打開）；點估計一律為負，只有影片數邊際顯著 | L632–639、L625–626 | 「The soft commitment device tested in our experiment did not affect this group of highly motivated students.」 |
| 17 | 負效果集中在兩群 | 晚註冊者與 .edu 信箱 | L627–632 | 「The negative results observed for the full sample appear to be driven by two groups」 |
| 18 | 晚註冊的接受者 | 少看約 11 支影片、成績低近 12 分、拿證書機率低 11 個百分點（Table 5：−10.836*、−11.584*、−0.112*） | L632–636 | 「Later registrants who took up the treatment watched on average 11 fewer videos, scored nearly 12 points lower on their final grade, and were 11 percentage points less likely to receive a certificate」 |
| 19 | 晚註冊不是「落後要補課」 | 這些人仍在開課前註冊 | L636–639 | 「these "later registrant" students still registered before the course began, so these results were not driven by their having to catch up on missed work.」 |
| 20 | .edu 信箱的接受者 | 498 人、樣本的 2.8%；第一、二週影片機率低 46–49 個百分點、少看 38 支、成績低近 30 分、證書低近 25 個百分點 | L687–699 | 「The treatment caused significant negative outcomes for these students across all five outcomes we observed.」 |

Table 6（L643–684，對過 PDF 第 12 頁）：改以「完成任一份排程問卷」定義接受處理，估計值全面略大、顯著性型態相同。全樣本：第一階段 0.127***；影片數 −5.778†（3.328）、成績 −5.061†（3.027）、證書 −0.06†（0.032）。.edu：第一階段 0.124***；−0.616†、−0.651*、−50.859*、−39.57*、−0.329†。晚註冊：第一階段 0.173***；−0.071、−0.057、−13.098*、−14.001*、−0.135*。填過課前問卷：第一階段 0.377***；影片數 −8.355†，其餘不顯著。其餘各列全部不顯著，除了國家缺漏的證書 −0.014†。

TOT 的上下界說明（L509–516、L554–563）：若把「收到信」當作處理且假設人人都讀了，TOT 等於 ITT（下界）；以「完成問卷」定義是上界；Table 5 的「打開」在中間。

### D. 背景數字（作者引用或描述，不是實驗效果）

- MOOC 註冊者略多於一半看第一支影片，只有 10% 看完 80% 以上影片（引 Evans、Baker、Dee 2016；Jordan 2014；Perna 等 2015）（L72–77）。
- 本課程：48% 看了第一支影片，9% 拿到證書（註 1，L939–948）。
- 學生看影片的眾數時間約當地晚上 8 點（L99–101）。
- 7.7% 填了教師的課前問卷（L255–258）；填答者絕大多數說修課是因為有趣（L790–795）。
- Patterson（2014）：封鎖分心網站的承諾裝置，完成率 +11 個百分點、表現 + 超過四分之一個標準差；但只隨機分派了在金錢誘因下自願的 18% 註冊者（L229–243）。這是本文作者的轉述。
- Kizilcec、Pérez-Sanagustín、Maldonado（2016）：告知 653 名 MOOC 使用者一組讀書策略有效，對投入與持續沒有效果，檢定力不足以偵測小效果（L146–153）。同樣是轉述。

## 作者自己列的限制

有獨立的 Limitations 節（L406 起；NL L600–650）。

1. 「There are two primary limitations in this study: our inability to investigate standard subgroups and potential concerns about external validity.」（NL L610–612）
2. 沒有人口統計資料，無法依性別、種族、學歷、社經地位做次群體分析（NL L612–617）。
3. 只研究一個平台上的一門課（NL L618–619）。作者接著說沒有理由認為這門課的學生和典型 MOOC 學生不同，但也承認「we cannot say definitely」（NL L637–650）。
4. 內部效度：作者認為「extremely high」——沒有流失、參與者不知情、討論區沒有污染跡象（NL L601–609）。
5. 看不到學生有沒有收到或讀信，接受率可能被低估（註 7，L987–991；L302–304）。
6. 統計顯著不等於實務顯著（Power 節，L362–364）。
7. 機制不明：討論節列了五種可能解釋（修課動機、期待不符、沒照排程做而產生的愧疚或羞恥、覺得被冒犯、被點出時間管理的弱點），加上隨機分派失衡，**都沒有檢驗**，每一種都只附上未來可以怎麼測（L788–852）。作者自述：「In summary, we are puzzled by the results」（L853）。
8. 對 .edu 與晚註冊者為什麼受害，作者寫的是「We hypothesize」（L697–701）與「The same theory may apply」（L708）。.edu 信箱的人到底是誰（在學生、教職員、校友）作者也不確定（L687–693）。
9. 結果可能只適用 MOOC（L862–863、L839–842）。

原文沒有談的：次群體分析（12 列 × 5 個結果，兩種定義）沒有做多重比較校正，也沒有說次群體是不是事前指定的；控制組在第二週少收一封問卷信，兩組收到的聯絡次數不完全相等（作者只描述了這個設計，沒有把它列為限制）。

## 與摘要說法不一致的地方

逐項對過，數字與方向一致。措辭上有四處要留意：

1. 摘要「had no effects on near-term engagement and weakly significant negative effects on longer-term course engagement, persistence, and performance」（L29–30）：與 Table 4 相符。「weakly significant」在本文一律指 p < .10；沒有任何 ITT 估計達到 .05。摘要沒有給效果大小（少看 0.73 支影片、成績低 0.64 分、證書低 0.8 個百分點）。
2. 摘要「these negative effects are highly concentrated in two groups」（L30–32）：對得上 Table 5、6，但那兩群的估計是 TOT（接受者的效果），不是 ITT；摘要沒有分清楚。
3. 正文「The treatment caused significant negative outcomes for these students across all five outcomes」（.edu，L690–692）：Table 5 裡 .edu 的五個結果有兩個（第一週影片、證書）只有 † p < .10，三個是 * p < .05。「significant … across all five」比表強。
4. 正文「nearly 10% less likely to earn a certificate」是相對值（約 −8.6%），絕對差 0.8 個百分點；「reduced … by 52%」同樣是相對值，而且是 TOT。引用時要寫清楚是哪一種。
5. 討論開頭一處用「our null or negative results」（L743），另一處用「weakly significant, modestly negative effects」（L732–733）；兩種說法並存。

## 與清單「要撐的結論」不合的地方

清單寫的是：「排程提醒無效，長期指標弱負向」。

- **方向撐得住**：近期兩個結果不顯著；影片數、成績、證書三個遠期結果為負、p < .10。
- **要改的用詞**：
  1. 「提醒」不準。介入是開課時請學生**自己排定每週第一支影片的觀看時刻**（前兩週各一次）的軟性預先承諾，沒有後續提醒、沒有罰則。寫成「排程提示」或「請讀者預先排時間」比較貼近。
  2. 「弱負向」要帶條件：ITT 效果很小（證書 −0.8 個百分點，基準 9.3%），而且只到 p < .10；較大的數字（−4.8 個百分點、−52%）是對接受者的 TOT 估計。
  3. 只有 12.7% 的處理組學生真的排了時間；排了的人 85% 看了第一支影片。「沒效」不是因為排了卻沒照做。
  4. 負效果集中在晚註冊者（n = 4,042）與 .edu 信箱（n = 498）兩個次群體，都是事後次群體分析、沒有多重比較校正；作者自己說對原因「puzzled」。
  5. 沒有任何次群體出現正效果，包含最投入的填過課前問卷者（44% 打開問卷）。
- **和 19#4（Yeomans & Reich 2017）並排寫時要注意的差別**（各自原文裡的事實，不是我的綜合結論）：這篇的樣本是全部在開課兩天前註冊的人（N = 18,043，不篩意向），介入是排一支影片的時間；Yeomans & Reich 的樣本是填了課前問卷、宣告要拿證書的 2,053 人，介入是開放式的學習計畫。兩篇的介入與母群都不同，不能寫成「同一種介入一篇有效一篇無效」。
- 一手數字可用：控制組 9.3% 拿到證書、47.4% 看了第一週第一支影片、32.2% 看了第二週第一支影片（Table 4 控制組平均）。

## 讀取紀錄

| 順序 | 檔案與行號 | 內容 |
|---|---|---|
| 1 | 原檔（layout）L1–400 | 首頁、摘要、前言、Prior Literature（MOOC 的持續、時間管理與排程、預先承諾）、Experimental Design（Setting and Data、Table 1、Experimental Design and Implementation、Blocking/Estimation/Balance、Table 2、Power、Limitations 前段）。左右欄分開依序讀 |
| 2 | 重轉檔（nolayout）NL L1–120 | 首頁到前言，確認與原檔一致 |
| 3 | 重轉檔 NL L380–1099 | 處理描述後段、Table 1、控制組設計、污染、區組與估計、Power、Table 2、Limitations 全節、Results（Treatment Uptake、Main Results、TOT 說明、Treatment Heterogeneity 開頭）。此檔的 Table 3–5 數字被拆成一行一格，沒有用它讀表 |
| 4 | 原檔 L436–775 | Table 3、接受率後段、Main Results、Table 4、TOT、Treatment Heterogeneity、Table 5、Table 6、.edu 與晚註冊的討論、Discussion 前半 |
| 5 | 原檔 L766–1070 | Discussion 後半（五種可能機制、Poor Randomization、總結）、Conclusion、附錄（Figure A1 處理組信、A2 控制組信、A3／A4 問卷截圖只有圖說）、Authors' Note、註 1–7；L994–1065 是參考文獻（書目，掃過）、作者簡介 |
| 對表 | PDF 第 8–12 頁（用 Read 直接看頁面） | Table 3、Table 4、Table 5、Table 6 逐格對過係數、標準誤、星號、樣本數；Figure 1、2 看過圖面。Table 1、Table 2 以原檔的版面文字（L249–292、L373–394）為準，沒有另外看 PDF 頁面影像 |

重轉檔 NL L120–380（前言後段到處理描述）與 NL L1099–1988（Table 5 以後）沒有用重轉檔讀，這兩段的內容分別由原檔 L123–306 與 L581–1070 涵蓋。附錄 Figure A3、A4 是問卷截圖，文字檔只有圖說，沒有看圖。
