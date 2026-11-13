# 抽取紀錄：D'Angelo、Rutstein、Harris、Bernard、Borokhovski、Haertel 2014，Simulations for STEM Learning: Systematic Review and Meta-Analysis（SRI International 報告）

- **書目**：Cynthia D'Angelo, Daisy Rutstein, Christopher Harris, Robert Bernard, Evgueni Borokhovski, Geneva Haertel (2014). *Simulations for STEM Learning: Systematic Review and Meta-Analysis*. Menlo Park, CA: SRI International. March 2014. 作者全名對過封面內頁「Prepared By」（L23–30）與建議引用格式（L10–12）。沒有 DOI。網址 https://www.sri.com/wp-content/uploads/2021/12/simulations-for-stem-learning-full-report.pdf
- **版本**：機構報告（SRI Education 自行出版，Bill & Melinda Gates Foundation 出資，L6–9），不是同儕審查的期刊論文。正文有兩處留著期中報告的口吻：「initial findings」（L58–59）、「The final report includes more details on these factors」（L251–252）、「Currently authors representing 19 articles of the 59 articles (32%) have responded」（L4894–4896）。
- **原文檔**：`.research/raw/learning-content/q2-interactive/dangelo2014-sim.txt`（6,891 行、148,584 字元／149,189 位元組）；PDF `dangelo2014-sim.pdf`，64 頁。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 7（該不該做互動）#1
- **表格對照**：原文檔是不帶 `-layout` 的轉檔，表格一格一行，Exhibit 16、17、20、23、24 的欄位順序整個錯開。另用 `pdftotext -layout` 重轉到 scratch，Exhibit 4–33 全部逐列對過 layout 版；Exhibit 10、11、15（續）、16、20 另外直接看 PDF 頁面影像（PDF 第 23、28、32 頁）核對，layout 版與版面一致。下面的數字都是對過版面的；行號一律是原文檔的行號。

## 研究設計

- **類型**：系統性回顧加統合分析。
- **兩個研究問題**（L71–80、L1018–1035）：
  - RQ1：用模擬教學的 K–12 學生，對上「receive some other kind of instructional treatment」的 K–12 學生。
  - RQ2：用模擬的學生，對上用**同一個模擬再加上某種教學強化**（動態表徵、後設認知支援、延伸回饋等）的學生。強化版是實驗組。
- **模擬的定義**（L86–88、L143–159）：「a computer-based interactive environment with an underlying model」。夾在單純視覺化／動畫與電玩之間。有關卡、點數的算遊戲，排除；沒有互動的算視覺化，排除：「The important criterion is that the simulation includes some interactivity on the part of the user, centered usually on inputs and outputs or more generally, the ability to set parameters for modeling the phenomenon or system. Otherwise, the tool was labeled as a visualization rather than a simulation.」（L157–159）虛擬世界劃歸模擬（註 1，L161–165）。
- **檢索**（L360–414）：ERIC、PsycINFO、Scopus；標題、摘要、關鍵字欄位；simulation／computer simulation 加 STEM 內容詞，另加 multiple／dynamic／linked representation 以撈數學。**只收 1991–2012 年、同儕審查期刊的文章**，研討會論文與非同儕審查文獻一律排除（L401–411）。沒有搜灰色文獻。
- **篩選流程**（Exhibit 3，L437–482；L417–429）：2,722 篇摘要 → 取 260 篇全文 → 201 篇進入研究類型判定（實驗或準實驗 70、質性 83、前實驗 48）→ 70 篇裡 11 篇因資料不全或重複排除 → **59 篇、128 個效果量**（成就 96、科學探究與推理 17、非認知 15）。
- **受試者**：K–12 學生，不要求在正式學校情境（L350–353）。59 篇的年級分布：K–5 8 篇、6–8 年級 15 篇、9–12 年級 32 篇、跨年級 4 篇（Exhibit 5，L814–871）。地點：北美 21、歐洲 18、亞洲 6、未註明 14。領域：科學 49、數學 6、工程 3、科技 1。
- **人數**：RQ1 成就 N = 2,947；RQ2 成就 N = 3,342；RQ1 探究 N = 347；RQ2 探究 N = 689；RQ1 非認知 N = 663；RQ2 非認知 N = 205（Exhibit 10–12）。
- **效果量層級的描述**（Exhibit 6，L874–961）：RQ1 與 RQ2 各 64 個效果量。模擬類型（RQ1／RQ2）：現象模擬 22／41、虛擬實驗室 19／13、agent-based 5／3、虛擬世界 1／1、其他 2／6、未註明 15／0。評量方式（RQ1／RQ2）：嵌在模擬裡 1／15、用科技但不嵌入 1／7、不用科技 59／27、未註明 3／15。
- **比較對象**：RQ1 的對照組只描述為「non-simulation instruction」「some other kind of instructional treatment」。**報告沒有把對照組做了什麼（講述、實體實驗、讀課本等）編成變項，也沒有分類報告。** 內文只在舉例時提到個別研究（例如 Michael 2001 對照組用實體樂高，L4905–4907）。
- **量了什麼**：成就（內容知識）、科學探究與推理、非認知（態度、自我效能等）。
- **何時量**（Exhibit 31，L5260–5279；76 份評量）：介入當天內 29（含嵌入式評量）、兩週內 18、**超過兩週 5**、未註明 24。
- **評量是誰做的**（Exhibit 26，L5057–5072）：研究者自編 58、標準化測驗 1、未註明 17。
- **效果量與模型**（L661–775）：Hedges' g；用隨機效果模型估平均（g+）與 95% CI，用固定效果模型估異質性；調節變項用混合效果模型；Comprehensive Meta-Analysis。
- **編碼**：每篇兩人獨立編碼後討論定案（L655–659）。

## 結果（逐項）

### 整體（Exhibit 10–12，L1628–1815）

| # | 結果 | 數字 | 對照條件 | 表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | RQ1 成就 | g+ = 0.62*（SE 0.09，95% CI 0.45–0.79），k = 46，N = 2,947；Q-Total = 209.80，df = 45，p < .001，I² = 78.55 | 模擬 vs 沒有模擬的其他教學 | Exhibit 10 | L1628–1676 | 「Question 1 (N = 2,947): Simulation vs. No Simulation 46 0.62* 0.09 0.45 0.79」 |
| 2 | RQ2 成就 | g+ = 0.49*（SE 0.06，CI 0.36–0.61），k = 50，N = 3,342；I² = 62.66 | 強化版模擬 vs 原版模擬 | Exhibit 10 | 同上 | 「Simulation Plus Modification vs. Non-Modified Simulation 50 0.49* 0.06 0.36 0.61」 |
| 3 | 改善指數 | RQ1 23%、RQ2 19% | 同上 | 內文 | L1622–1623 | 「The improvement indices of these effect sizes were 23% and 19%, respectively.」 |
| 4 | RQ1 科學探究與推理 | g+ = 0.26（SE 0.15，CI −0.03–0.55），k = 6，N = 347，**不顯著**；I² = 36.32 | 模擬 vs 沒有模擬 | Exhibit 11 | L1677–1724、L1732–1737 | 「resulting in a weighted average effect size (random effects) of g+ = 0.26 that was low (Improvement Index = 10%) and not significantly greater than zero」 |
| 5 | RQ2 科學探究與推理 | g+ = 0.41*（SE 0.15，CI 0.13–0.70），k = 11，N = 689；I² = 68.77 | 強化版 vs 原版 | Exhibit 11 | 同上 | 「11 0.41* 0.15 0.13 0.70」 |
| 6 | RQ1 非認知 | g+ = 0.69*（SE 0.33，CI 0.05–1.33），k = 12，N = 663；Q-Total = 155.45，I² = 92.92 | 模擬 vs 沒有模擬 | Exhibit 12 | L1767–1815 | 「Question 1 produced the highest of all weighted average effect size (Improvement Index = 25.5%) and it also contained the highest level of between-study heterogeneity」（L1753–1757） |
| 7 | RQ2 非認知 | g+ = 0.52*（SE 0.25，CI 0.03–1.02），k = 3，N = 205 | 強化版 vs 原版 | Exhibit 12 | 同上；L1760–1762 | 「Question 2 for Non-Cognitive Outcomes produced only k = 3 studies, too few to provide a reasonable assessment」 |
| 8 | 兩題合併的成就 | g+ = 0.55，k = 96（把一個 +4.68 的極端值截到 +2.81 之後；截之前 0.57）；個別效果量範圍 −0.64 到 +4.68 | RQ1 與 RQ2 混在一起 | Outlier 段 | L1124–1133 | 「the large positive value of +4.68 was truncated to the next highest value of +2.81 … The average effect size was reduced from g+ = 0.57 to g+ = 0.55.」 |

### 數學對科學（Exhibit 13、18）

| # | 結果 | 數字 | 表 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 9 | RQ1 成就，數學 | g+ = **−0.15**（SE 0.19，CI −0.52–0.22），k = 4，不顯著 | Exhibit 13 | L1871–1914 | 「Math 4 -0.15 0.19 -0.52 0.22」 |
| 10 | RQ1 成就，科學 | g+ = 0.67*（SE 0.09，CI 0.50–0.84），k = 42；與數學的差異 Q = 15.28，df = 1，p < .001（表上標成 Q-Total） | Exhibit 13 | 同上；L1852–1861 | 「Math and science are significantly different from one another, but the math category contains only four cases and the g+ is negative.」之後 RQ1 的調節分析只做科學。 |
| 11 | RQ2 成就，數學 | g+ = 0.26（SE 0.17，CI −0.08–0.59），k = 10，不顯著 | Exhibit 18 | L3059–3102 | 「Math 10 0.26 0.17 -0.08 0.59」 |
| 12 | RQ2 成就，科學 | g+ = 0.53*（SE 0.07，CI 0.39–0.66），k = 40（38 個科學加 2 個工程，L3896–3897） | Exhibit 18 | 同上 | 表下印「Q-Total = 2.15 df = 1, p < .001」，內文說「there is still a significant difference」（L3045）。Q = 2.15、df = 1 對應的 p 不會小於 .001，數字與 p 值對不上，見「內部不一致」。 |

### RQ1 成就（只含科學）的調節變項（Exhibit 14–15，L1951–2510）

對照條件一律是「模擬 vs 沒有模擬」；各列是不同研究的子集，屬跨研究比較。NI＝文章沒寫，不納入組間檢定。

| # | 變項 | 各層級 g+（k） | 組間檢定 | 行號 |
|---|---|---|---|---|
| 13 | 年級 | K–5 1.42*（3，CI 0.003–2.84）；6–8 0.64*（12）；9–12 0.63*（26） | Q = 1.19，df = 2，p = .55，不顯著 | L1969–2007 |
| 14 | 教學語言 | 英語 0.78*（20）；非英語 0.40（11，CI −0.01–0.81，不顯著）；NI 0.74*（11） | Q = 2.10，df = 1，p = .11 | L2009–2046 |
| 15 | 地區 | 美國 0.79*（15）；歐洲 0.51（7，不顯著）；亞洲 0.84*（5）；中東 0.48*（11）；NI 0.88*（4） | Q = 4.85，df = 3，p = .18 | L2047–2118 |
| 16 | 模擬類型 | agent-based 0.78*（5）；現象 0.71*（17）；虛擬實驗室 0.68*（12） | Q = 0.31，df = 2，p = .86 | L2140–2177 |
| 17 | 是否要求協作 | 必須 0.95*（7）；可選 0.59*（7）；不協作 0.70*（7）；NI 0.58*（21） | Q = 1.33，df = 2，p = .52 | L2178–2227 |
| 18 | 分組 | 個人 0.50*（13）；兩人 0.80*（8）；小組 0.88*（10）；NI 0.60*（11）。兩人與小組合併 0.85*（18）對個人 | 三層 Q = 2.58，p = .28；兩層 Q = 2.46，df = 1，p = .12 | L2228–2304 |
| 19 | 彈性（模擬有多少結構） | 自由 0.58*（5）；部分結構 0.58*（15）；高度結構 0.89*（9）；NI 0.68*（13） | Q = 1.97，df = 2，p = .37 | L2305–2354 |
| 20 | 與課程的關係 | 嵌入課程 0.81*（22）；獨立但相關 0.53*（12）；獨立且無關 0.20（2，不顯著）；NI 0.56*（6） | Q = 4.33，df = 2，p = .12 | L2355–2404 |
| 21 | **使用堂數** | **一堂 0.49*（11）**；二到三堂 0.39*（3）；四到六堂 0.91*（9）；十一堂以上 0.44*（8）；NI 0.94*（11）。沒有七到十堂這一層。 | **Q = 12.32，df = 3，p = .006** | L2420–2451 |
| 22 | 每堂長度 | 15–30 分 0.63*（3）；40–50 分 0.72*（16）；60–80 分 0.46（2，不顯著）；90 分以上 0.60（5，不顯著）；NI 0.69*（16） | Q = 0.87，df = 3，p = .83 | L2452–2483 |
| 23 | 總時數（堂數 × 每堂長度） | 60 分以內 0.70*（8）；一到五小時 0.50*（8）；超過五小時 0.67*（7）；NI 0.74*（19） | Q = 0.96，df = 2，p = .62 | L2484–2509 |

- 堂數的事後比較（L1944–1949）：「Post hoc contrasts (Bonferroni's method, Hedges & Olkin, 1985) revealed that the category "four – six sessions" produced a significantly higher weighted average effect size (z = 2.53, p < .05) than the other three categories」。只給了一個 z 值，沒有三組各自的檢定。
- 作者對「十一堂以上反而低」的解釋是推測（L5434–5438）：「One possible explanation for this is that for the eight studies in which there were more than 11 sessions students who did not use the simulation still might have had enough instruction so that they were able to learn the material」。
- 作者對 RQ1 調節分析的總結（L1941–1944）：「While the average effect size in most levels within each variable category is significant, only one variable (Number of Sessions) significantly discriminates among levels.」

### RQ1 非認知成果的調節變項（Exhibit 16–17，L2517–3026）

k = 12，各格多半只有 1–5 個效果量。組間顯著的有：年級（6–8 年級 −0.40，k = 2；9–12 年級 0.92*，k = 10；Q = 7.46，p = .006）、教學語言（英語 −0.21，k = 4；非英語 1.48*，k = 7；Q = 26.96，p < .001）、地區（美國 −0.21，k = 4；歐洲 1.20，k = 2；土耳其 1.59*，k = 5；Q = 41.08，p < .001）、分組（個人 0.47，k = 4；兩人 1.58*，k = 2；小組 −0.48，k = 2；Q = 13.34，p = .001）、堂數（一堂 −0.21，k = 4；十一堂以上 1.59*，k = 5；Q = 40.44，p < .001）、總時數（60 分以內 −0.21，k = 4；超過五小時 1.58*，k = 2；Q = 12.15，p < .001）。

作者自己的判定（L5464–5468）：「While the moderator variable analysis did find some statistically significant differences, the small sample size in each of the categories suggests that these differences should be interpreted with caution and these results should not be generalized.」

反向的格子：美國的 4 個效果量平均 −0.21（CI −0.49–0.07）；一個現象模擬、四到六堂的效果量是 −0.71（CI −1.07 到 −0.34，顯著為負）。

### RQ2 成就的調節變項（Exhibit 19–22，L3105–4464）

對照條件一律是「強化版模擬 vs 原版模擬」。

| # | 變項 | 數學加科學（Exhibit 19–20） | 只含科學（Exhibit 21–22） | 行號 |
|---|---|---|---|---|
| 24 | 年級 | K–5 0.32（6，不顯著）；6–8 0.51*（11）；9–12 0.51*（25）；跨年級 0.51*（8）；Q = 0.59，p = .99 | K–5 0.43（5，不顯著）；6–8 0.51*（11）；9–12 0.58*（17）；跨 0.58*（7）；Q = 0.44，p = .93 | L3123–3172、L3751–3800 |
| 25 | 強化的種類 | 表徵 0.32*（19）；鷹架 0.60*（19）；合作學習 0.69*（4）；加實體實驗 0.39（2，不顯著）；觸覺 0.43*（3）；回饋 0.54*（2）；Q = 5.38，df = 5，p = .37 | 表徵 0.43*（10）；鷹架 0.60*（20）；合作學習 0.69*（4）；加實體實驗 0.39（2）；觸覺 0.43*（3）；回饋 0.54*（1）；Q = 2.74，df = 4，p = .60 | L3366–3391、L3965–4038 |
| 26 | 模擬類型 | agent-based 0.94*（3）；現象 0.41*（29）；虛擬實驗室 0.58*（11）；Q = 2.88，p = .24 | 數字相同；Q = 1.88，p = .39 | L3285–3364、L3923–3963 |
| 27 | **評量方式** | 不用科技 0.41*（27）；嵌在模擬裡 0.67*（5）；**用科技但不嵌入 0.11（4，CI −0.07–0.28，不顯著）**；NI 0.74（14）；**Q = 12.42，df = 2，p = .002** | 不用科技 0.51*（19）；嵌入 0.67*（4）；不嵌入 0.11（4）；NI 0.70（13）；Q = 13.96，p = .001 | L3392–3409、L4039–4088 |
| 28 | 協作 | 必須或可選 0.32*（19）；不協作 0.47*（13）；NI 0.68*（18）；Q = 0.91，p = .34 | 0.39*（13）；0.47*（10）；0.68*（17）；Q = 0.22，p = .64 | L3410–3424、L4089–4128 |
| 29 | 分組 | 個人 0.45*（20）；兩人 0.30（8，不顯著）；小組 0.42*（9）；NI 0.72*（13）；表列 Q = .38，df = 1，p = .11 | 個人 0.49*（16）；兩人 0.56（4，不顯著）；小組 0.43*（8）；Q = .22，df = 2，p = .90 | L3426–3444、L4129–4178 |
| 30 | **彈性** | 部分結構 0.45*（24）；高度結構 0.74*（11）；NI 0.40*（15）；Q = 2.49，df = 1，**p = .11，不顯著** | 部分結構 0.42*（22）；**高度結構 0.88*（9）**；NI 0.50*（9）；**Q = 7.00，df = 1，p = .008** | L3466–3503、L4202–4239 |
| 31 | 與課程的關係 | 嵌入 0.65*（11）；獨立相關 0.44*（25）；獨立無關 0.33*（5）；Q = 4.58，p = .10 | 0.65*（10）；0.52*（18）；0.33*（5）；Q = 3.74，p = .15 | L3504–3553、L4240–4289 |
| 32 | 堂數 | 一堂 0.45*（16）；二到三堂 0.28（12，不顯著）；四到六堂 0.76*（10）；十一堂以上 0.87*（3）；NI 0.39*（9）；Q = 7.41，df = 3，p = .06 | 一堂 0.47*（13）；二到三堂 0.44（7）；四到六堂 0.76*（8）；十一堂以上 0.87*（3）；Q = 4.02，p = .26 | L3554–3615、L4290–4351 |
| 33 | 每堂長度 | 15–30 分 0.22（4，不顯著）；40–50 分 0.62*（14）；60–80 分 0.62*（10）；90 分以上 0.54*（3）；Q = 4.66，p = .20 | 0.22（4）；0.67*（11）；0.63*（9）；0.54*（3）；Q = 5.13，p = .16 | L3616–3677、L4352–4413 |
| 34 | 總時數 | 60 分以內 0.35*（7）；一到五小時 0.59*（19）；超過五小時 0.68*（5）；NI 0.39*（19）；Q = 2.74，p = .25 | 0.38*（6）；0.60*（16）；0.68*（5）；Q = 1.91，p = .38 | L3678–3727、L4414–4463 |

- 作者對彈性的說法（L5518–5525）：「It was found that when the simulation was very structured the average effect size was higher than when the simulation allowed for more flexibility in the student interaction with the simulation. This is another a place in which more studies would be needed in order to further explain these results.」這個顯著結果只出現在只含科學的那一版（p = .008）；數學加科學那一版是 p = .11。RQ2 沒有「自由使用」這一層。
- 作者對評量方式的說法（L5507–5517）：不嵌入的科技評量那一格「There were only four effect sizes in this category and so not much can be generalized from this」。

### RQ2 科學探究與推理（Exhibit 23–24，L4475–4863）

k = 11。沒有任何調節變項組間顯著。各格 k 多半 1–6。幾個不顯著或接近零的格子：鷹架 0.19（k = 6，CI −0.30–0.68）、虛擬實驗室 −0.06（k = 3）、歐洲 −0.03（k = 2）、一堂 −0.03（k = 2）、嵌入式評量 0.33（k = 8，CI −0.01–0.68）。作者的判定（L5548–5552）：「these results should also be interpreted with caution as the small sample size in the different groups makes these results not generalizable.」RQ1 的探究成果（k = 6）沒有做調節分析（L4471）。

### 研究品質與出版偏誤

| # | 結果 | 數字 | 行號 |
|---|---|---|---|
| 35 | 隨機分派對準實驗（成就，兩題合併） | RCT 0.52（k = 32，CI 0.29–0.74）；QED 0.57（k = 64，CI 0.46–0.68）；Q = 0.18，p = .67 | Exhibit 7，L1242–1335 |
| 36 | 同上（探究） | RCT 0.37（k = 10）；QED 0.34（k = 7）；Q = 0.02，p = .89 | 同上 |
| 37 | 同上（非認知） | RCT 0.21（k = 3，CI −0.05–0.47，不顯著）；QED 0.80（k = 12，CI 0.14–1.46）；Q = 2.66，p = .10 | 同上 |
| 38 | 測驗的信效度資訊（成就） | 兩者都有 0.72（k = 12）；有其中一項 0.61（k = 37）；都沒寫 0.47（k = 47）。內文說效度四類 Q = 4.99，df = 3，p = .17；信度三類 Q = 1.25，df = 2，p = .54 | Exhibit 8，L1402–1456；L1379–1388 |
| 39 | 方法品質指數（五項各 0／1：成果測量來源、效果量取得方式、教師是否相同、教材是否相當、**作業時間是否相當**）對效果量的後設迴歸 | 成就：斜率 0.05，Q-Regression = 0.90，p = .34；探究：斜率 0.18，Q = 3.11，p = .08；非認知：斜率 −0.41，Q = 1.95，p = .16。128 個效果量的指數分布：1 分 9、2 分 27、3 分 54、4 分 20、5 分 18，平均 3.09 | Exhibit 9，L1499–1586；L1462–1492 |
| 40 | 出版偏誤（成就，k = 96，兩題合併） | classic fail-safe N 8,909；Orwin 371（降到 0.10）；trim-and-fill 補 0 個，g+ 維持 0.55 | L1171–1184 |
| 41 | 出版偏誤（探究，k = 17） | fail-safe 112；Orwin 51；trim-and-fill 補 1 個，0.36 → 0.33 | L1190–1205 |
| 42 | 出版偏誤（非認知，k = 15） | fail-safe 196；Orwin 51；trim-and-fill 補 0 個，維持 0.66 | L1217–1226 |

- 「作業時間是否相當」只是品質指數五項之一，報告**沒有單獨報告**有多少比較的兩組時間相當，也沒有拿它單獨當調節變項。
- 出版偏誤是把 RQ1 與 RQ2 合在一起檢查的，沒有分題；而且母群本身只有同儕審查期刊文章。

### 評量資訊（L4868–5362，Exhibit 25–33）

- 59 篇共 76 份評量。全文附完整題目的只有 13 份，附範例題的 28 份，完全沒附題目的 34 份（L4879–4886）。
- 題型（Exhibit 28）：選擇題 21、建構反應 11、兩者混合 30、互動式電腦任務 5、未註明 9。
- 信度有報告的過半，最常見是 Cronbach's alpha（31）；未註明 29。效度未註明 48（Exhibit 32–33）。
- 作者的總評（L5042–5053）：「most studies use researcher designed paper/pencil assessments. Moreover, we found that studies typically did not provide sufficient detail about the purposes, design method, and technical qualities of these assessments.」

## 作者自己列的限制（Limitations 節，L5554–5598）

1. 詳細描述模擬功能的文章多半不是研究，被排除；有研究的文章又多半不描述模擬的設計。所以「we could not conduct moderator analysis of specific simulation features」（L5568–5569）。
2. 數學、科技、工程的研究太少。工程的研究很多但受試者是大學生以上，被排除（註 5）。
3. 只收有效果量的研究，83 篇只有質性資料的研究沒有納入分析。

散在別處、作者承認的保留：

4. Cohen 的小中大門檻在教育領域可能誤導（L1048–1051）。
5. 改善指數假設效果量呈常態分布，「care needs to be taken in interpreting these percentages」（L1074–1077）。
6. 各成果類型與研究問題「should not be directly compared」（L5387–5391）。
7. 非認知與探究兩類的調節結果不能推廣（L5464–5468、L5548–5552）。
8. 結論的用詞是「can improve」與「there is still much to be learned」（L5626–5631）。

原文沒有討論的：對照組做了什麼；兩組花的時間；評量多半在介入當天或兩週內施測（只在描述段報告數字，沒有當限制）；研究者自編測驗與教材貼合的問題；只收期刊文章對出版偏誤的影響；同一篇文章貢獻多個效果量的相依性（128 個效果量來自 59 篇，沒有說明怎麼處理）。

## 內部不一致（照實記錄，不猜哪個對）

1. **評分者一致性有兩套數字**。方法段：全文納入／排除 94.50%（κ = 0.89，L621–622）、效果量辨識與計算 95.50%（κ = 0.97，L810–812）。結果段的清單：全文納入／排除 88.35%（κ = 0.77）、效果量比較決定 85.90%（κ = 0.72）、效果量計算 91.44%（κ = 0.83）（L991–1005）。
2. **篩選流程的數字對不起來**。內文說 201 篇（7%）摘要符合全部標準、約 350 篇（13%）資訊不足（L521–526）；Exhibit 3 寫摘要階段標為納入的是 158 篇、資訊不足 353 篇、其中排除 333 篇，卻有 260 篇全文被取回。158 加上 353 − 333 = 20 得 178，不是 260 也不是 201。結論另寫「Initial search results identified 260 articles, of which 59 (23%) met this requirement」（L5613–5614），把 260 說成初步檢索結果。
3. Exhibit 8 表下印「Q-Between = 2.66, df =1, p = .10」，與 Exhibit 7 非認知那一行一字不差，三個類別的 df 也不會是 1；內文給的是另外兩組數字（見結果 38）。
4. Exhibit 9 探究那一格印「p = .0」，內文寫 p = .08（L1491）。
5. Exhibit 18 的 Q = 2.15、df = 1 配 p < .001（見結果 12）。
6. Exhibit 14：英語那一列 CI 上限印 2.99（g+ 0.78、SE 0.11）；表尾多出一列「Intercept 1.80 0.85 0.12 3.47」，是 Exhibit 9 的數字；星號註寫 *p < .01，其他表都是 .05。
7. Exhibit 15：「Free Form」與「Some Structure」兩列的 g+、SE、CI 下限完全相同（0.58、0.17、0.25）。
8. Exhibit 16、17 有多格印了星號但 CI 跨過零（例如 6–8 年級 −0.40*，CI −1.05–0.26；Simulation Embedded 0.99*，CI −0.32–2.29）。
9. Exhibit 20 對 22：鷹架在數學加科學是 k = 19，只含科學反而是 k = 20；回饋 k 從 2 變 1 但 g+、SE、CI 完全相同。Exhibit 20 分組那一格三個類別卻寫 df = 1，且 Q = .38 配 p = .11。
10. 討論說只含科學的調節結果「were consistent with the results when both the math and science effect sizes were used」（L5535–5538），但彈性這一項在兩版裡一個顯著一個不顯著（結果 30）；Exhibit 20 前的內文也說評量方式是「the only substantive moderator variable that differentiates between levels」（L3277–3279）。
11. 品質指數那一段把 128 個效果量稱為 studies（L1475–1479，9 + 27 + 54 + 20 + 18 = 128）。
12. Exhibit 6 的評量方式列，RQ1「Not tech based」59 個效果量；Exhibit 25 以評量為單位是 39 份。單位不同，不算矛盾，引用時要分清楚。

## 與摘要說法不一致的地方

這份報告沒有摘要；開頭的 Overview（L57–82）只描述做了什麼，不報數字。拿結論（L5604–5631）對結果：

1. 結論說「overall, simulations have a beneficial effect over treatments in which there were no simulations」。成就成立（0.62）；但科學探究與推理不顯著（0.26，k = 6），數學的四個效果量平均是負的（−0.15）。結論後半有補一句研究「predominately in science education」，沒有提探究不顯著與數學為負。
2. 結論說「simulations, in many different configurations or contexts within the classroom, can improve student learning」。「many different configurations」的依據是調節變項幾乎都不顯著；但多數格子 k 很小，作者自己在每堂長度那裡承認「this may be due to the low number of effect sizes in some of the categories」（L5441–5443）。
3. 討論說表徵與鷹架兩類強化「were both found to have a statistically significant average effect」（L5496–5498）成立；但在探究成果上，鷹架是 0.19、不顯著（k = 6）。

## 與清單「要撐的結論」不合的地方

清單寫：「課堂上用模擬的效果量，以及它的情境（K-12、多堂課）」。

1. **效果量撐得住，但要連著條件寫**：0.62 是「模擬對上沒有模擬的其他教學」、成就測驗、46 個效果量、I² = 78.55；其中科學 0.67（k = 42）、數學 −0.15（k = 4）。只寫「模擬的效果量 0.62」會漏掉數學是負的、探究不顯著。
2. **「多堂課」撐不住**。RQ1 科學成就裡，有寫堂數的 31 個效果量中**一堂的最多（11 個）**，二到三堂 3、四到六堂 9、十一堂以上 8，另有 11 個沒寫。總時數有寫的 23 個裡，60 分鐘以內 8、一到五小時 8、超過五小時 7，另有 19 個沒寫。能說的是「從一堂到十一堂以上都有，將近四成沒有報告堂數或總時數」，以及「四到六堂那一層效果最大（0.91），十一堂以上回到 0.44」。
3. **「K-12」成立，但偏高中**：59 篇裡 32 篇是 9–12 年級；RQ1 科學成就 41 個效果量裡 26 個是 9–12 年級。
4. **「課堂上」大致成立但原文沒有給數字**：納入標準不要求正式學校情境（L352–353），編碼表有 Instructional Setting（教室、課後、校外、非正式）這一欄（L6643–6653），結果裡沒有報告分布。
5. **這份報告回答不了「互動比不互動好」**。模擬的定義要求有互動，沒有互動的視覺化在篩選時就排除了（38 篇摘要因此排除，Exhibit 4）；RQ1 的對照組是「沒有模擬」，不是「同內容的靜態版」，而且對照組做了什麼完全沒有編碼。所以 0.62 是「整套含模擬的教學對上別種教學」的差距，不能歸給互動這個特性。RQ2 比的是強化版對原版，兩邊都是互動的。
6. **與「讀文章自學」的距離**：受試者是 K–12 學生；多數有教師；評量 58／76 是研究者自編，超過兩週才測的只有 5 份；兩組花的時間是否相當沒有單獨報告。這些原文都有數字或明確缺項，寫進文章時應一併交代。
7. 與 order 7 主題直接相關、清單沒列的兩個結果：(a) RQ2 只含科學的分析裡，**高度結構的模擬（0.88，k = 9）顯著高於部分結構（0.42，k = 22）**，p = .008，但數學加科學合併時不顯著（p = .11），作者說需要更多研究；RQ1 的彈性不顯著（p = .37）。(b) 作者明說做不了模擬具體功能的調節分析（限制 1）。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | L1–900 | 封面、建議引用、目錄、Overview、背景、模擬的定義、既有回顧、統合分析簡介、方法（範圍、檢索、流程、Exhibit 3–4、篩選、編碼表、效果量、三種模型）、結果開頭、Exhibit 5、Exhibit 6 前半 |
| 2 | L900–2399 | Exhibit 6 後半、評分者一致性、研究問題、結果怎麼解讀、極端值、出版偏誤、研究設計、Exhibit 7–9、Exhibit 10–12 與敘述、RQ1 調節分析敘述、Exhibit 13–14、Exhibit 15 前半 |
| 3 | L2399–4298 | Exhibit 15 後半、Exhibit 16–17、RQ2 開頭、Exhibit 18–21、Exhibit 22 前半 |
| 4 | L4298–5697 | Exhibit 22 後半、Exhibit 23–24、評量資訊全節與 Exhibit 25–33、討論、限制、結論、參考文獻前半 |
| 5 | L5697–6891 | 參考文獻後半（掃過）、附錄 A 納入研究清單（掃過，59 筆書目）、附錄 B 編碼表全文（讀過，L6049–6869；其中 L6492–6589 與 L6389–6487 是同一頁重複印了兩次）、附錄 C（只有一張截圖，沒有文字）、封底 |
| 對表 | scratch 的 `pdftotext -layout` 輸出第 405–425、564–625、757–1262、1279–1368、1548–1640、1684–1815 行 | Exhibit 4–18、20、23–33 逐列對 k、g+、SE、CI、Q、df、p；Exhibit 19、21、22 在原文檔裡欄位沒有錯開，直接讀原文檔 |
| 對版面 | PDF 第 23、28、32 頁（報告頁碼 19、24、28） | Exhibit 10、11、15（續）、16、20 看頁面影像，與 layout 版一致 |

圖只有 Exhibit 1、2（兩張模擬畫面截圖）與 Exhibit 3（流程圖，文字已讀）；附錄 C 的截圖沒有看。
