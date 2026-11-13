# 抽取紀錄：Guo & Reinecke 2014，Demographic Differences in How Students Navigate Through MOOCs

- **書目**：Philip J. Guo（MIT CSAIL／University of Rochester）、Katharina Reinecke（University of Michigan）。Demographic Differences in How Students Navigate Through MOOCs. *L@S 2014: Proceedings of the First ACM Conference on Learning @ Scale*，2014 年 3 月 4–5 日，Atlanta。ACM。DOI 10.1145/2556325.2566247。作者姓名與單位對過 PDF 首頁。頁碼原檔沒有印，不補。
- **版本**：作者機構頁公開的會議論文定稿（首頁有 ACM 版權聲明與 DOI），10 頁。
- **原文檔**：
  - 清單所列：`.research/raw/learning-content/q4-time/guo2014-mooc-navigation.txt`（638 行、71,467 字元；`pdftotext -layout` 的雙欄版，左右欄交錯，**沒有用它讀**）
  - 本次實際讀的：`.research/raw/learning-content/q4-time/guo2014-mooc-navigation-nolayout.txt`（1,203 行、51,987 字元；同一份 PDF 用不帶 `-layout` 的 `pdftotext` 重轉）
  - PDF：`.research/raw/learning-content/q4-time/guo2014-mooc-navigation.pdf`（重抓自 https://cs.rochester.edu/hci/pubs/pdfs/edX-MOOC-demographics-and-navigation_LAS-2014.pdf，即原檔檔頭所寫的來源）
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 18（系列的順序）第 12 列
- **行號**：以下一律是 `guo2014-mooc-navigation-nolayout.txt` 的行號；表格另標 PDF 頁碼。

## 研究設計

- **類型**：觀察性的伺服器紀錄分析（log data），沒有任何介入或分派。統計方法是多元線性迴歸，回報 ANOVA F、p 值與未標準化係數 b（L327–330）。
- **資料**：edX 2012 年秋季第一批課程中的四門（L259–264），選課理由是涵蓋當時三個 edX 成員學校、主題盡量分散。2013 年春季的課（含人文類）因資料不完整沒有納入。
- **四門課與人數**（Table 2，PDF 第 3 頁，對過版面）：

| 課程 | 主題 | 學校 | 全部學生 | 其中填了人口資料 | 拿到證書 | 其中填了人口資料 |
|---|---|---|---|---|---|---|
| 6.00x | 電腦科學與程式入門 | MIT | 65,475 | 50,581 | 5,758 | 4,155 |
| PH207x | 公共衛生統計 | Harvard | 31,851 | 28,363 | 4,915 | 4,528 |
| CS188.1x | 人工智慧 | Berkeley | 24,517 | 17,066 | 1,900 | 1,232 |
| 3.091x | 固態化學 | MIT | 18,703 | 14,152 | 2,072 | 1,575 |
| 合計 | | | 140,546 | 110,162 | 14,645 | 11,490 |

  - 填完全部人口資料（出生年、學歷、性別）的約 78%（L224–225、L274–276）。需要人口變項的分析排除沒填的人。
  - 拿到證書的約佔全部學生的 10%（L297–299「Many of our analyses only consider students who earned certificates (∼ 10% of all students)」）。**多數分析只用證書取得者**。
- **平台結構**（L134–146）：一門課分成數週（通常 8 到 16 週），每週有數個網頁，稱為 learning sequence；一個 sequence 是一堂講課（一串影片，中間可夾小測驗題）或一份計分評量（每週習題或期中、期末考）。教材每週釋出，但學生可以隨時回到已釋出的內容，「even when taking an assessment」（L141–143）。
- **變項定義**：
  - 證書（L289–299）：成績超過授課者訂的及格線就發，「usually around 60%」。作者把它當成「學生意圖」的控制變項。
  - Coverage（L305）：「The fraction of total learning sequences (lectures, problem sets, and exams) that the student visited.」分母是全部 sequence，含講課、習題、考試；「visited」是進過那個網頁，不是看完影片。
  - Backjump（L316–319）：「The number of times that this student navigated backwards from a learning sequence to another one released earlier in the term (e.g., from Lecture 6 to Lecture 4), divided by the total number of sequences visited by this student.」是 sequence 之間的跳動，並以該生造訪過的 sequence 數標準化。
  - 教科書事件（L320–324）：進入課程數位教科書的次數除以該生全部事件數，作者把它算成一種非線性瀏覽。
  - 討論區事件（L307–311）：發文次數除以該生全部事件數。
  - 年齡（L235–236）：由出生年推估，排除小於 10 歲或大於 80 歲。
  - 國家（L281–284）：用 IP 查 MaxMind GeoIP，多國時取存取次數最多的國家。
  - 生師比（L241–247）：聯合國教科文組織統計的各國小學生師比。作者自己加註：這個變項通常與人均 GDP、家戶所得中位數相關，「so observed effects might not be directly due to pedagogical quality」。
- **沒有量的東西**（L331–332）：不分析 sequence 內部的細部瀏覽（例如影片內跳轉）；不用時間當變項，因為從伺服器紀錄無法判定學生實際互動了多久。
- **沒有量學習成果**：只有課程成績與是否拿到證書，沒有獨立的學習測驗。

## 結果（逐項）

### A. 母群描述（全部學生，L339–423）

| # | 結果 | 數字 | 範圍 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| A1 | 平均年齡 | 28 歲（sd = 9.4）；77% 在 20–40 歲，13% 未滿 20，10% 超過 40 | 四門課全部學生 | L339–341 | 「The mean student age across all four courses in our data set was 28 years (sd=9.4). Most students (77%) were between 20 and 40 years old, with 13% under 20 and 10% over 40.」 |
| A2 | 最高學歷 | 全部學生：學士 38%、高中 28%；證書取得者：碩士 37%、學士 32% | 四門課 | L342–346 | 「students who earned a certificate most commonly held a master's degree (37%), followed by a bachelor's degree (32%)」 |
| A3 | 男性比例 | CS188.1x 86%、6.00x 83%、3.091x 70%、PH207x 56% | 各課 | L347–350 | 「86% male in CS188.1x (artificial intelligence), 83% in 6.00x … 70% in 3.091x (chemistry) and 56% in PH207x」 |
| A4 | 國家數 | 196 國（另加 10 個屬地）有人參加；157 國有人拿到證書 | 四門課 | L407–409 | 「Students from all 196 countries (plus 10 additional dependent territories such as Guernsey) participated in the four courses. Students from 157 countries ended up getting certificates.」 |
| A5 | 東亞比例極低 | 中國 0.1%、日本 0.08%、韓國 0.07%（佔全部學生） | 四門課全部學生 | L410–413 | 「making up only 0.1%, 0.08%, and 0.07% of the total student population」 |
| A6 | 各課證書取得者的前五大國 | Table 3（PDF 第 4 頁，對過）：6.00x 美 22%、印 9%、俄 7%、西 6%、英 6%、其他 50%（123 國）；PH207x 印 17%、美 16%、西 8%、英 5%、德 3%、其他 51%（133 國）；CS188.1x 美 19%、印 9%、俄 8%、西 8%、英 6%、其他 50%（103 國）；3.091x 美 18%、印 11%、西 11%、英 6%、俄 5%、其他 49%（106 國） | 證書取得者 | L357–405 | 表列 |
| A7 | 年齡與母國生師比的相關 | Spearman r = −.25（3.091x）、−.24（CS188.1x）、−.22（6.00x）、−.08（PH207x），皆 p < .001。美國生師比 14、平均年齡 33（sd 12）；印度生師比 40、平均年齡 27（sd 9） | 各課 | L414–419 | 「Spearman's correlation coefficients between a student's age and the student-teacher ratio of their home country were r = −.25 for 3.091x, −.24 for CS188.1x, −.22 for 6.00x, and −.08 for PH207x, all p < .001.」 |

### B. 涵蓋率（coverage；證書取得者）

| # | 結果 | 數字 | 對照／範圍 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| B1 | 各課證書取得者平均看過多少 sequence | 3.091x 67%、PH207x 77%、CS188.1x 81%、6.00x 86% | 只算拿到證書的人；單位是「造訪過的 sequence 佔全部 sequence 的比例」 | Coverage | L603–606 | 「Certificate-earning students viewed, on average, 67% of the learning sequences in 3.091x, 77% in PH207x, 81% in CS188.1x, and 86% in 6.00x.」 |
| B2 | 平均略過 22% | 22%（四門課平均；(67+77+81+86)/4 = 77.75，原文沒有說是不是依人數加權，四個數字的簡單平均恰好對得上） | 同上 | Coverage | L606–608 | 「Thus, students ignore, on average, 22% of the materials in those courses, yet still earn certificates. While we are not able to determine how deeply they engaged with the content that they accessed, coverage measurements at least show that a non-trivial amount of content gets completely skipped.」 |
| B3 | 人口變項對涵蓋率（Table 4，PDF 第 5 頁對過） | 年齡：6.00x F = 130、PH207x F = 238、CS188.1x F = 35、3.091x F = 160，皆 df = 1、p < .001。國家：F = 4.4（df 114）、4.5（df 128）、2.3（df 87）、3.7（df 97），皆 p < .001。性別：F = 23（p < .001）、1.1（p = .3）、30（p < .001）、1.8（p = .18）。教育年數：F = 1.3（p = .25）、18（p < .001）、.5（p = .49）、.5（p = .50）。課程順序同前 | 證書取得者，多元線性迴歸 | Table 4 | L491–592 | 「Age and country have statistically significant effects on coverage across all four courses, while gender and education years do not.」 |
| B4 | 年齡與涵蓋率 | b = .001 到 .01，四門課皆 p < .001；50 歲以上比 20 歲以下多約 10%（圖 3，原文沒寫是百分點還是相對比例；圖上兩組約在 0.72 與 0.87，較像百分點，但這是我讀圖的估計） | 證書取得者 | Coverage／Fig. 3 | L614–622 | 「The oldest group (over 50 years old) achieves, on average, 10% more coverage than the youngest group (under 20 years old).」 |
| B5 | 美國對印度 | 83% 對 71%，T(2829) = 20.2，p < .001 | 兩國證書取得者 | Coverage | L623–626 | 「Certificate earners from the U.S., on average, cover significantly more sequences (83%) than Indian certificate earners do (71%)」 |
| B6 | 生師比、成績對涵蓋率（Table 5，PDF 第 5 頁對過） | 6.00x（R² = .14）：年齡 .003、生師比 −.002、男性 .03、成績 .31、常數 .53，皆 p < .001。PH207x（R² = .13）：.004、−.004、.00（p = .14）、.57、.19，其餘 p < .001。CS188.1x（R² = .15）：.001、−.001、.04、.18、.61，皆 p < .001。3.091x（R² = .18）：.01、−.004、.03（p = .02）、.36、.21，其餘 p < .001 | 證書取得者；教育年數因與年齡共線被排除 | Table 5 | L425–489 | 「Across all four courses, a student's age and grade are positively correlated with coverage, while the student-teacher ratio of the student's country is negatively correlated.」 |

### C. 成績與討論區

| # | 結果 | 數字 | 範圍 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| C1 | 看得多的人成績高 | 見 Table 5 成績係數 .18 到 .57 | 證書取得者 | L643–645 | 「In all four courses, students who viewed more materials were more likely to achieve higher grades, which makes sense because they had more opportunities to learn and to get assessed」 |
| C2 | 人口變項對成績（控制涵蓋率） | 全部學生：年齡 F(1) = 47–404（CS188.1x、PH207x、6.00x）；生師比 F(1) = 973–2402（CS188.1x、6.00x），皆 p < .001。**只看證書取得者時四門課有三門不顯著**，例外是 CS188.1x（年齡 F(1) = 11、生師比 F(1) = 36，p < .001） | 全部學生對證書取得者 | L646–657 | 「However, the effects of age and student-teacher ratio are non-significant in three of the four courses when considering only certificate earners in the analysis」 |
| C3 | 討論區發文 | 年齡與學歷在三門課顯著：3.091x F(2,1572) = 4.4、PH207x F(2,4525) = 27.4、6.00x F(2,4152) = 24.6，皆 p < .001。有博士學位者發文「up to 32% less」 | 證書取得者 | L660–668 | 「students with Ph.D. degrees participated up to 32% less in forums than non-Ph.D. holders」 |
| C4 | 生師比對討論區參與（**無效果**） | 迴歸不顯著；Spearman r < .05（各課），p > .001 | 證書取得者 | L668–679 | 「we expected students from more teacher-centered educational systems … to be less likely to participate socially in MOOCs, but that turned out not to be the case.」 |

### D. 往回跳（backjump）

| # | 結果 | 數字 | 對照／範圍 | 節／圖表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| D1 | 證書取得者的往回跳頻率 | 每造訪一個 sequence 平均 1.04 次（sd = 0.62） | 四門課證書取得者 | Course Navigation Strategy | L690–691 | 「Certificate earners in our four courses performed an average of 1.04 backjumps for every learning sequence they visited (sd=0.62).」 |
| D2 | 沒拿證書者 | 每造訪一個 sequence 0.3 次（sd = 0.4）；作者說證書取得者是三倍 | 沒拿證書的學生 | 同上 | L691–694 | 「In contrast, students who did not earn certificates performed only 0.3 backjumps per visited sequence (sd=0.4). Thus, certificate earners repeat visiting prior sequences three times as often, presumably to review older content.」 |
| D3 | 往回跳的種類 | 評量跳回講課佔全部往回跳的 54%、講課跳回講課 30%（四門課平均）；T(4.6) = 5.2，p < .01。另兩類（評量到評量、講課到評量）只有圖，正文沒給數字 | 證書取得者 | Kinds of backjumps／Fig. 5 | L697–706 | 「Such lecture-to-lecture backjumps occur significantly less frequently (30% of total backjumps averaged across four courses) than assessment-to-lecture backjumps (54% across four courses) (independent t-test, T4.6 = 5.2, p < .01).」 |
| D4 | 兩門程式課的評量跳回講課比例較低 | 只有圖 5，沒有數字 | 6.00x、CS188.1x 對 3.091x、PH207x | Fig. 5 | L882–889 | 「Figure 5 also shows that assessment-to-lecture backjumps are less prevalent in the two programming-based courses (6.00x and CS188.1x).」 |
| D5 | 人口變項對往回跳（Table 6，PDF 第 7 頁對過） | 年齡：6.00x F = 26、PH207x F = 62、CS188.1x F = 16、3.091x F = 29，皆 p < .001。國家：F = 1.5（df 114，p < .001）、2.7（df 128，p < .001）、1.3（df 87，p = .02）、2.7（df 97，p < .001）。性別：F = 56（p < .001）、45（p < .001）、4.9（p = .03）、1.8（p = .19）。教育年數：F = .42（p = .52）、4.7（p = .03）、3.6（p = .06）、3.4（p = .07） | 證書取得者 | Table 6 | L708–797 | 「Age has statistically significant effects in all four courses, country in three courses, and gender in two.」 |
| D6 | 40 歲以上對 20 歲以下：講課跳回講課 | 多 5% 到 12%；除 CS188.1x 外皆顯著，χ²(1) = 149–280，p < .001 | 證書取得者，兩個年齡組 | Demographics and backjumps | L896–900 | 「certificate earners above 40 years of age performed 5% to 12% more lecture-to-lecture backjumps than those under age 20」 |
| D7 | 40 歲以上對 20 歲以下：評量跳回講課 | 少 2% 到 11%；四門課皆顯著，χ²(1) = 8.8–226，p < .003 | 同上 | 同上 | L900–904 | 「those above 40 years old performed 2% to 11% fewer assessment-to-lecture backjumps than those under 20 years old」 |
| D8 | 生師比與往回跳 | 三門課負相關：b = −.002（6.00x）、−.007（PH207x）、−.01（3.091x），皆 p < .01 | 證書取得者，控制其他人口變項與成績 | 同上 | L905–909 | 「student-teacher ratio had a negative correlation with backjumps, even controlling for other demographics and grades」 |
| D9 | 希臘對肯亞 | 希臘（生師比 10）每造訪一個 sequence 1.21 次；肯亞（生師比 47）.83 次；T(212) = 6.0，p < .001。前 30 大國佔全部證書取得者的 83%；美國 2,809 人、第 30 名肯亞 86 人 | 證書取得者 | Fig. 7 | L910–919 | 「Students from Greece backjump, on average, 1.21 times per visited sequence. In comparison, students from Kenya … .83 times per sequence visit」 |
| D10 | 40 歲以上的人，國家**無效果** | F(28–74) = 0.9–1.3，各課 p > .05 | 只看 40 歲以上證書取得者 | 同上 | L921–929 | 「for older certificate earners, country of origin seems to have no bearing on backjumps.」 |
| D11 | 性別 | 6.00x：男 .97、女 1.13；PH207x：男 .96、女 1.09，皆 p < .001。原文的檢定寫成「T6.4 = 858」「T7.0 = 4235」，下標與統計量看起來寫反了，照原文記，不改 | 證書取得者 | 同上 | L930–934 | 「In 6.00x, men averaged .97 backjumps per sequence visit, versus 1.13 for women (independent t-test, T6.4 = 858, p < .001).」 |
| D12 | 教科書使用 | 年齡 b = .00003–.0001，四門課 p < .001；40 歲以上比 40 歲以下多 27%（以每人事件總數標準化）。生師比**無獨立效果**（b ∼ 0，各課 p > .01） | 證書取得者 | Digital textbook usage | L943–948 | 「students over 40 accessed the textbook 27% more frequently than those under 40 … However, the student-teacher ratio does not have a statistically significant independent effect」 |

### E. 作者的解讀（不是量到的結果，引用時要標成推測）

- 往回跳是為了複習：「presumably to review older content」（L694）。
- 從評量跳回講課是在找答題要用的資訊：「which shows that they might be opportunistically looking up specific information needed to answer assessment questions」（L699–701）。討論節給了兩種解釋（L970–980）：一是投機查資料、動機是拿證書；二是學生把評量當成課程的學習目標清單。作者沒有資料區分這兩種。
- 略過 22% 的「可能原因」是開書式評量（L966「One likely cause for this coverage gap is "open book" assessments」）。原文接著說往回跳的分析「confirms this assumption」（L968），但那個分析只顯示評量之後較常跳回，沒有檢驗它與略過內容的關係。
- 討論節 L956–960 把結果說成「most students navigate through the learning content in a non-linear way」，並套用場依存／場獨立學習風格的說法。資料裡沒有量學習風格。

## 作者自己列的限制（L1078–1085、L1026–1036；雙欄交錯，兩段接起來才是完整一節）

- 只分析紀錄，無法直接量學生真正的動機、投入、選課意圖，也量不到修完之後學到多少；涵蓋率、證書、成績都只是代理指標（L1080–1084）。
- 樣本不代表各國一般人口：2012 年秋季第一批 edX 的學生較熟悉科技、英文較好，課程是英文授課的數理課（L1028–1030）。
- 瀏覽策略的原因只能推測；需要質性追蹤才能知道學生是在策略性取捨，還是因為不理解或缺乏動機（L1032–1036）。
- 方法節另有三點等同限制：不知道學生對造訪過的內容投入多深（L606–608）；沒有 sequence 內部的瀏覽與時間（L331–332）；edX 記不到學生跳去外部網站的行為（L886–889）。
- 生師比與經濟指標相關，效果未必來自教學方式（L245–247）。作者在討論節排除了語言因素（L1039–1045），並提出另一種解釋：高生師比國家的學生較想用最少力氣拿證書（L1045–1047）。

## 與摘要說法不一致的地方

1. **主詞被放大**。摘要寫的是「certificate earners skip on average 22% of the course content」（L22–23），正確。但結論節寫成「Analyzing the student log data from 140,546 students … we found that, on average, students skip 22% of the learning sequences entirely」（L1053–1054），把只在 14,645 名證書取得者身上算出的數字說成 140,546 人的結果。引用時主詞一定要是證書取得者。
2. **「frequently employ non-linear navigation」的依據只有往回跳**。摘要（L23）與結論（L1053「learners predominantly navigate through xMOOCs in a non-linear way」）說的非線性瀏覽，在資料上只有兩個指標：往回跳次數與教科書存取。往前跳、跳過不看的順序都沒有分析。「predominantly」沒有對應的比例數字。
3. **國家數**。摘要寫「over 196 countries」（L15），正文寫「all 196 countries (plus 10 additional dependent territories)」（L407–408）。
4. **Table 4 的圖說與表內數字不完全相符**。圖說說性別與教育年數對涵蓋率沒有顯著效果（L591–592），但表內性別在 6.00x 與 CS188.1x 是 p < .001，教育年數在 PH207x 是 p < .001。圖說較準確的讀法是「不是四門課都顯著」。
5. **Table 6 的圖說**說國家在三門課顯著、性別在兩門（L796–797）。表內 CS188.1x 的國家 p = .02、性別 p = .03，若以 .05 為準則國家是四門、性別是三門。原文沒寫用哪個門檻；正文其他地方混用 p < .01、p > .01、p > .05、p > .001。
6. 摘要沒有提到的無效果：只看證書取得者時，人口變項對成績在三門課不顯著（C2）；生師比對討論區參與與教科書使用沒有效果（C4、D12）；40 歲以上的人國家差異消失（D10）。

## 與清單「要撐的結論」不合的地方

清單寫：「完成者也略過 22%、從題目往回跳」。

- **「完成者也略過 22%」撐得住，但要加四個限定**：(a)「完成者」是拿到證書的人，門檻是成績過及格線（通常約 60%），不是看完課程的人；(b) 22% 是四門課各自平均（67%、77%、81%、86%）再平均的結果，課程間差距很大，3.091x 是略過 33%、6.00x 是 14%；(c) 單位是 learning sequence（一個網頁），「略過」是從沒進過那一頁，進了頁面但沒看完影片不算略過，所以這是下限；(d) 分母含習題與考試頁，不只是講課。資料是 2012 年秋季 edX 的四門數理課。
- **「從題目往回跳」撐得住的部分**：證書取得者的往回跳裡，從評量跳回講課佔 54%，高於講課跳回講課的 30%（四門課平均）。**撐不住的部分**：原文沒有量「為什麼」跳回去，「為了答題查資料」是作者的推測，且作者自己給了第二種解釋（把評量當學習目標）。兩門程式課這個比例較低，只有圖沒有數字。
- 清單沒寫到、但寫文章時容易誤用的一點：這篇沒有任何學習成果的測量，不能用來說「略過內容不影響學習」或「往回跳有助學習」。看得多的人成績較高（Table 5）是相關，而且成績本身就來自那些評量頁。
- 這篇的主軸其實是人口差異（年齡、國家生師比），清單引用的兩點是它的副結果。

## 讀取紀錄

依序讀過 `guo2014-mooc-navigation-nolayout.txt`：

- L1–620：標題、摘要、前言、Table 1（發現摘要）、MOOC 背景、線上學習策略文獻、Table 2、方法（資料、變項、分析）、發現的母群概述、Table 3、Table 5 與 Table 4 的數字區塊、Coverage 小節前半
- L620–1203：Coverage 後半、註腳 1、Grades、討論區、Course Navigation Strategy、Kinds of backjumps、Table 6 數字區塊、圖 6／圖 7 圖說、Demographics and backjumps、教科書使用、討論與設計建議、限制與未來工作、結論、致謝、參考文獻（24 筆，掃過）

兩段首尾相接，涵蓋全文。

對過 PDF 版面的表與圖：Table 2（第 3 頁）、Table 3 與圖 2（第 4 頁）、Table 4、Table 5、圖 3（第 5 頁）、圖 4、圖 5（第 6 頁）、Table 6、圖 6、圖 7（第 7 頁）。PDF 第 3–7 頁以頁面影像讀過；第 1–2、8–10 頁沒有表格，只讀文字版。Table 1 是純文字條列，文字版完整。

圖 5 的四類比例只有長條圖，正文只給兩個數字（54%、30%）；其餘比例沒有抄，因為讀圖不夠準。
