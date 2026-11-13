# 抽取紀錄：Jordan 2014，Initial Trends in Enrolment and Completion of Massive Open Online Courses

- **書目**：Katy Jordan（The Open University, UK）。Initial Trends in Enrolment and Completion of Massive Open Online Courses. *The International Review of Research in Open and Distributed Learning*（IRRODL）15(1), 133–160，2014 年 2 月。DOI 10.19173/irrodl.v15i1.1651。ERIC 編號 EJ1024344。作者姓名與單位對過 PDF 首頁；卷期與頁碼取自各頁頁尾（「Vol 15 | No 1　Feb/14」，134–160；首頁沒印頁碼，依序推為 133）；刊名與 DOI 取自 Crossref（PDF 本身沒有印刊名與 DOI）。
- **版本**：期刊刊出版（開放取用），28 頁。
- **原文檔**：`.research/raw/learning-content/q4-time/jordan2014-mooc-completion.txt`（1,618 行、77,836 字元；`pdftotext -layout`，單欄版面，段落沒有交錯）。PDF 另存 `.research/raw/learning-content/q4-time/jordan2014-mooc-completion.pdf`（重抓自 https://files.eric.ed.gov/fulltext/EJ1024344.pdf）。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 19（為什麼多數人讀不完）第 2 列
- **行號**：原文檔行號。

## 研究設計

- **類型**：把公開流傳的課程數字彙整起來做的探索性分析。沒有平台的原始資料。作者明說目的是找趨勢，不是解釋或建模（L669–673、L707–709）。
- **母群與抽樣**（L122–142）：以 Class Central 的「已結束課程」清單為起點，只收 Coursera、edX、Udacity 三個平台。寫作當時（2013 年 7 月 22 日）清單有 279 門課（同一門課重開算多門）。
- **資料來源**（L113–120、L159–164）：網路搜尋（新聞、大學報告、研討會簡報、學生部落格）加上群眾外包，修課學生把授課者公布的數字貼到作者部落格。蒐集期間 2013 年 2 月 13 日到 7 月 22 日（L710–711）。
- **取得的資料量**（L162–164）：有註冊人數的 91 門（佔 279 門的 32.6%）；有完成數字的 42 門（15.1%）。
- **變項定義**：
  - 完成（L145–148）：「the percentages of students who had satisfied the courses' criteria in order to gain a certificate. The exact activities required to achieve this vary according to course.」拿到證書的比例；各課門檻不同。
  - 完成率的分母（L887–888）：預設是註冊總人數。
  - 活躍使用者（L148–154）：有些來源沒給定義；有定義的是指多少用過教材的人，例如登入過、試過一次測驗、看過至少一支影片。
  - 其他：開課日期、課程週數、Times Higher Education 2012–13 世界大學排名（L154–157）。
- **分析**（L669–681）：Minitab 線性迴歸，每個因素各自跑一次簡單迴歸，沒有做多元迴歸，理由是各欄位缺漏不一、每個檢定的 n 不同。殘差不常態，迴歸前做 Box-Cox 轉換（實際式子是取自然對數）。
- **原始資料全部印在文中**：Table 1（只有註冊人數的課）、Table 2（有活躍人數或完成人數的課），每筆附來源。

## 結果（逐項）

### A. 註冊人數

| # | 結果 | 數字 | 範圍／n | 行號 | 原文一句 |
|---|---|---|---|---|---|
| A1 | 註冊人數分布 | 4,500 到 226,652，中位數 42,844；非常態 | 91 門 | L724–728 | 「Total enrolment figures range from 4,500 to 226,652 students, with a median value of 42,844. The data does not exhibit a normal distribution (Figure 1); six-figure enrolments are not representative of the 'typical' MOOC.」 |
| A2 | 註冊人數隨開課日期下降 | ln(Enrolled) = 104.249 − 0.00226915 × StartDate，R² = 0.1719，p < 0.001 | n = 91（圖 2） | L812–823 | 「The relationship is relatively weak (time as a factor accounts for 17.2% of the variance observed …)」 |
| A3 | 課越長註冊越多 | ln(Enrolled) = 10.2248 + 0.0491206 × Length，R² = 0.0545，p = 0.029 | n = 87（圖 3） | L864–881 | 「The relationship is relatively weak, accounting for 5.5% of the variance observed」 |
| A4 | 大學排名對註冊人數（**無效果**） | 95% 水準下不顯著，沒有給數字 | 沒寫 n | L883–884 | 「the relationship between university ranking and enrolment figures was considered, although it was not found to be significant at the 95% level.」 |

### B. 完成率（分母＝註冊人數）

| # | 結果 | 數字 | 範圍／n | 行號 | 原文一句 |
|---|---|---|---|---|---|
| B1 | 完成率分布 | 0.9% 到 36.1%，中位數 6.5%；右偏 | 39 門 | L887–892 | 「This information was available for 39 courses in the sample. Completion rates range from 0.9% to 36.1%, with a median value of 6.5% (Figure 4). The data is skewed, so the higher completion rates are not representative, with completion rates of 5% being typical.」 |
| B2 | 多數課低於 10% | 「majority」；原文沒給門數。我用 Table 2 自己算是 39 門裡 31 門 | 39 門 | L1120–1121 | 「The majority of courses have been found to have completion rates of less than 10% of those who enroll, with a median average of 6.5%.」 |
| B3 | 完成率對開課日期、大學排名、註冊人數（**無效果**） | 都不顯著，沒有給數字 | 39 門 | L927–930 | 「No significant relationships were found between completion rate and date, university ranking, or the total number of students enrolled. Completion rates remained consistent across these factors.」 |
| B4 | 課越長完成率越低 | ln(PercentTotalCompleted) = 2.64802 − 0.100461 × CourseLength，R² = 0.2373，p = 0.002 | n = 39（圖 5） | L930–946 | 「The correlation in this case is negative, indicating that a lower proportion of students complete longer courses. Course length accounts for 23.4% of the variance observed」（R² 寫 0.2373，文字寫 23.4%，照錄） |

### C. 活躍使用者與「活躍者中的完成率」

| # | 結果 | 數字 | 範圍／n | 行號 | 原文一句 |
|---|---|---|---|---|---|
| C1 | 活躍人數佔註冊人數的比例很穩定 | Active = 0.543336 × Enrolled，R² = 0.9556，p < 0.001；文字先說約 50%，後說約 54% | n = 39（圖 6） | L993–1009 | 「The number of active students is remarkably consistent as a proportion of the total enrolment of the course (with approximately 50% of the total enrolment becoming active students).」「being approximately 54% of those who enroll」 |
| C2 | 以活躍者為分母的完成率 | 1.4% 到 50.1%，中位數 9.8%；仍偏向低值 | 正文說 33 門（L990–991），圖 7 圖說寫 n = 39（L1096–1097） | L1048–1054 | 「completion rates range from 1.4% to 50.1%, with a median value of 9.8% (Figure 7). While completion rates as a percentage of active students span a wider range than completion rates as a percentage of total enrolments, there remains a strong skew towards lower values.」 |
| C3 | 活躍者完成率對日期、排名、註冊人數、**課程長度**（**全部無效果**） | 都不顯著，沒有給數字 | 同上 | L1101–1105 | 「No significant relationships were found between completion rate as a proportion of active users and date, university ranking, total enrolment, or (in contrast to completion rate as a percentage of total enrolment) course length. This may suggest that enrolled students may be put off starting longer courses, but this is less of an issue for those who do become actively engaged in the course.」 |

### D. 作者引用的背景數字（不是本文結果）

- Stanford AI 課 2011 年秋：16 萬人註冊、2 萬人完成（L64–66，引 Rodriguez 2012）。
- Chronicle of Higher Education 2013 年 2 月調查：平均註冊 33,000 人、平均 7.5% 完成（L67–70，引 Kolowich 2013）。
- Coursera 學生學歷：學士 42.8%、碩士 36.7%、博士 5.4%（L48–51，引 Koller & Ng 2013）；賓州大學 Coursera 課：83.0% 大學畢業、44.2% 研究所學歷（L51–54，引 Emanuel）。
- 「motivation does not predict whether a student will complete a course (Breslow et al., 2013)」（L72–73）。這是引用。

### E. 用 Table 1、Table 2 自己重算的結果（我的計算，不是原文）

Table 1 有 41 列、Table 2 有 50 列（兩表都對過 PDF 第 5–11 頁的版面），合計 91 門。

- 有註冊人數的：Table 1 的 41 門＋Table 2 的 47 門＝**88 門**（Table 2 有三門沒有註冊人數：Learn to Program、Introductory Human Physiology、Healthcare Innovation and Entrepreneurship）。88 個值的範圍 4,500–226,652，與原文相同；中位數我算是 43,912，原文是 42,844（恰好是表中 E-learning and Digital Cultures 那門的值）。
- 同時有註冊與完成人數的：39 門。完成率中位數 6.54%，最低 0.92%（CS50x，24 週，150,349 人註冊、1,388 人完成），最高 36.09%（Equine Nutrition，5 週，23,322 人註冊、8,416 人完成）。**與原文 B1 完全相符。**
- 同時有活躍與完成人數的：34 門。比率中位數 9.85%，最低 1.37%（CS50x），最高 50.13%（edX 的 6.002x：6,000 活躍、3,008 完成）。範圍與中位數**與原文 C2 相符**，門數是 34，不是正文的 33 也不是圖說的 39。
- 同時有活躍與註冊人數的：39 門，與原文 C1 的 n 相符。
- 有完成人數的共 42 門，與方法節的「42 courses」相符；有活躍人數的共 42 門，方法節寫的是 33 門（L149）。
- Table 2 裡超過 15 週的課只有 CS50x（24 週），它同時是完成率最低的一門。B4 的負相關有多少靠這一個點，原文沒有做敏感度分析，我也沒有重跑迴歸。

## 作者自己列的限制

- **數字精度不一**（L697–700）：有的機構給精確數字，有的（尤其透過媒體發布的註冊人數）是整數概數。
- **多數課沒有公開資料**（L700–702）：「most of the courses that would have been eligible for inclusion (67.4%) have not released any data」。
- **公開與否可能有偏誤**（L702–704）：「Of the institutions or instructors choosing to make data available, bias may be introduced according to their motivations for publicizing this information, which are unknown.」
- **學生提供的數字靠信任**（L704–705）。
- **探索性質**（L707–709）：只找趨勢，不解釋、不建模。
- **沒有學習者的聲音**（L1162–1164）：「the data neglects the student voice. While these approaches can identify trends and patterns, they are unable to explore in detail the reasons behind the trends observed.」
- **只看了少數幾個公開可得的因素**（L1153–1159）；教學法（xMOOC 對 cMOOC）、評量類型都沒看。
- **證書數字看不到嘗試了但沒過的人**（L1145–1147）：「Figures about how many students achieved certificates obscure how many students attempted to gain a certificate but did not meet the criteria.」
- 作者對完成率這個指標本身的保留（L1133–1134）：「There are potentially many ways in which MOOC students may participate in and benefit from courses without completing the assessments.」也說不宜拿 MOOC 完成率和實體課程比（L1116–1118）。

## 與摘要說法不一致的地方

1. **「average」其實是中位數，而且兩個數字來自不同樣本**。摘要（L19–20）：「The average MOOC course is found to enroll around 43,000 students, 6.5% of whom complete the course.」43,000 是 91 門課註冊人數的中位數，6.5% 是其中 39 門課完成率的中位數；把兩個連成一句，讀起來像同一批課。
2. **摘要只講「完成率與課程長度負相關」，沒有講這個關係在改用活躍者當分母後消失**（C3）。作者自己在正文的解讀是「課太長讓人不想開始」，而不是「開始的人在長課裡更容易半途而廢」。
3. **「6.5%」與「5% being typical」並存**（L890–892）。同一段先給中位數 6.5%，再說典型是 5%，沒有說明 5% 怎麼來（看起來是指直方圖的眾數區間）。
4. **活躍比例兩種說法**：約 50%（L994）與約 54%（L1009），後者是通過原點的迴歸斜率。
5. **活躍者完成率的中位數兩種寫法**：結果節 9.8%（L1049），結論節「a median of 10%」（L1135–1136）。
6. **n 對不起來的地方**：(a) 方法節說有活躍人數的是 33 門（L149），結果節說 39 門有活躍與註冊、33 門有「活躍者中完成的比例」（L990–991），圖 7 圖說寫 n = 39（L1096–1097）；依印出的 Table 2 是 42 門有活躍人數、34 門可算活躍者完成率。(b) 註冊人數的分析寫 n = 91，並說這是「excluding three courses which are missing total enrolment figures」（L724–725）；但兩張表合計就是 91 列，其中三列沒有註冊人數，可算的是 88 門。是表少印了三門、還是 n 寫錯，從原文無法判斷。(c) 課程長度對註冊人數的迴歸寫 n = 87（L860），依表有註冊人數且有週數的是 85 門。這些落差不影響完成率中位數 6.5%（那個數字我重算相符），但註冊人數的中位數與兩條註冊人數迴歸，照表重算不出一樣的 n。
7. R² = 0.2373 在文字裡寫成 23.4%（L943–945）。

## 與清單「要撐的結論」不合的地方

清單寫：「早期完成率中位數 6.5%；與課程長度負相關」。

- **「早期完成率中位數 6.5%」撐得住**，重算也相符。要帶的限定：(a) 39 門課，是 2011 年 10 月到 2013 年 4 月開課、而且有人把註冊與完成人數公開出來的課，佔當時清單 279 門的 14%；公開與否不是隨機的，作者自己列為偏誤來源；(b) 完成＝拿到證書，分母＝註冊人數；(c) 範圍 0.9% 到 36.1%，很寬；(d) 若分母改成用過教材的人，中位數是 9.8%，範圍 1.4% 到 50.1%。
- **「與課程長度負相關」只對一種分母成立，要改寫**。以註冊人數為分母時是負相關（R² = 0.24，p = 0.002，n = 39）；以活躍者為分母時不顯著。作者的解讀是註冊的人可能因為課長而不開始，一旦開始，課長不長就不太有關係。文章如果想用它說「內容越長，讀者越讀不完」，原文不支持「開始讀的人」這一層；只能說「以全部註冊者計，長課的完成比例較低，但在真的開始的人裡看不到這個差別」。另外這是 39 門課的簡單迴歸，沒有控制科目、平台、評量方式，唯一超過 15 週的課（CS50x）同時是完成率最低的一門。
- 清單沒寫到、但對 order 19 有用的一點：註冊者裡約一半（約 50% 到 54%）成為活躍使用者，這個比例在各課之間很穩定（R² = 0.96，n = 39）。它和 Reich & Ruipérez-Valiente 2019 的「各課平均 52% 註冊者從未進入課程」方向一致，但兩篇的定義與資料來源都不同（這裡是各來源自己定義的「active」，多為二手公開數字），不能當成同一個量的兩次測量。
- 這篇和 Reich 2019 的完成率也不能直接並排：這裡 6.5% 的分母是註冊者；Reich 2019 Table S3 的 3.13%–5.91% 分母是進過課程的人。分母更嚴的反而數字更低，原因可能是年代、平台與課程組成不同，兩篇都沒有資料可以說明。

## 讀取紀錄

`jordan2014-mooc-completion.txt` 依序讀完：

- L1–820：題目、摘要、前言、方法、Table 1（L177–378）、Table 2（L388–664）、分析方法、限制、結果的註冊人數小節（含圖 1、圖 2、圖 3 前的迴歸）
- L820–1618：圖 3、註冊人數後半、完成率小節（圖 4、圖 5）、活躍使用者（圖 6、圖 7）、結論、致謝、參考文獻（L1184–1606，掃過；多為各課數字的來源網址）

兩段首尾相接，涵蓋全文。另外先用不帶 `-layout` 的重轉檔（scratch，2,930 行）讀過 L1–700（題目到 Table 1 中段），因為表格被拆成一格一行，改回原文檔從頭重讀；行號全部以原文檔為準。

對過 PDF 版面的表：Table 1（PDF 第 5–7 頁，期刊頁 137–139，41 列）、Table 2（PDF 第 8–11 頁，期刊頁 140–143，50 列）。逐列比對文字檔與頁面影像，欄位沒有錯位；Table 2 最後一列的註冊人數印成「26,915」（帶逗號），其餘不帶。E 節的重算是用文字檔的表格以程式解析後計算，解析結果逐列印出對過。

圖 1–7 是直方圖與散佈圖，文字檔只剩座標軸刻度；圖上個別點的位置沒有讀，結果一律取正文數字。
