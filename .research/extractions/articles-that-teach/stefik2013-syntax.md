# 抽取紀錄：Stefik 與 Siebert 2013，An Empirical Investigation into Programming Language Syntax

- **合法公開來源**：https://dl.acm.org/doi/10.1145/2534973（刊出版，2026-10-14 核對）。ACM Digital Library 自 2026-01-01 起全面開放取用，文章頁標示 FREE ACCESS。從 ACM 重新下載的 PDF 與手上的 `stefik2013-syntax.pdf` 位元組完全相同（1,240,677 位元組，`cmp` 無差異），所以內容不必重對。手上那份當初取自第三方網站 vidarholen.net；引用與連結一律改寫 ACM 的 DOI。

- **書目**：Andreas Stefik（University of Nevada, Las Vegas）、Susanna Siebert（The Genome Institute, Washington University School of Medicine）。An Empirical Investigation into Programming Language Syntax. *ACM Transactions on Computing Education* 13(4), Article 19（2013 年 11 月），40 頁。DOI 10.1145/2534973。作者全名、刊物、卷期、DOI 都對過首頁（L9–11、L33–35）。
- **原文檔**：`.research/raw/learning-content/q2-interactive/stefik2013-syntax.txt`（2,909 行、221,586 字元；`pdftotext -layout` 轉的，原文是單欄排版，所以段落沒有左右交錯。字元數有一大半是版面留白與每頁的裁切標記，實際正文遠少於這個數字）；PDF `stefik2013-syntax.pdf`，40 頁。
- **讀取日期**：2026-10-14
- **版本**：刊出版（ACM 排版檔，頁碼 19:1–19:40，每頁帶裁切標記；文末 L2896「Received February 2013; revised June 2013; accepted July 2013」）。
- **供哪幾篇使用**：order 4（記號、行話與術語）。
- **經費與利益關係**：NSF CNS-0940521（L49）。作者就是 Quorum 語言的設計者，受測語言之一是 Quorum，結論末句建議新語言以 Quorum 的語法為基礎（L2572–2575、L2603–2604）。原文沒有利益衝突聲明，作者只在問卷的效度威脅裡談到這一點（L1733–1747）。

## 研究設計

全文四個研究，分兩組。研究 1、2 是問卷（主觀評分），研究 3、4 是隨機分派的實驗（寫程式的正確率）。作者自己把研究 1、2 定位成「formative clues」，不是證明（L598–601「we are not claiming that our survey somehow "proves" that a word or symbol is better than another; our survey is an investigative tool, not a proof」）。

### 研究 1、2（問卷）

- **類型**：線上問卷（LimeSurvey），自陳的主觀評分，沒有操弄、沒有表現測量。
- **受試者**：Southern Illinois University Edwardsville 資工系各年級課程的學生，共徵求 196 人（L414–416、L463–465）。
  - 研究 1：166 人作答（回應率 84.7%，L466）。依自陳的程式經驗年數分成 programmer 84 人（平均 2.57 年，SD 2.47）、non-programmer 82 人（自陳 0 年）。平均 21.3 歲；2 人非英語母語（L469–474）。
  - 研究 2：166 人作答，programmer 93 人（平均 2.38 年，SD 2.26）、non-programmer 73 人；7 人非英語母語；平均 21.3 歲（L475–479、L511）。有些人兩份都填（L479–480）。
  - 「non-programmer」是修資工系課程、但自陳總經驗 0 年的人。研究 1 有 22 人、研究 2 有 13 人的填答自相矛盾（勾了從沒寫過程式，卻又填了某個語言的經驗），問卷匿名所以無法回頭確認（L513–523）。Table I 也看得到：研究 1 的 non-programmer 欄裡 C++ 有 13 人填了大於 0 的經驗。
  - programmer 的經驗集中在 C++（研究 1：84 人裡 75 人；研究 2：93 人裡 80 人，Table I，L444）。
- **教材與作業**：
  - 研究 1：給一段英文的概念描述，請受試者替一串候選的字或符號評分，0（0% intuitive）到 10（100% intuitive）（L534–537）。六個範圍：型別與運算子、控制流程、資料結構、物件導向、輸入輸出與註解、aspect-oriented（L604–606）。題目以固定的隨機順序出現（L630–632）。
  - 研究 2：同樣的評分方式，但評的是整段語法（迴圈、字串、if、函式、回傳、建構子、繼承七個概念），取自九個語言：C++、Java、Smalltalk、PHP、Perl、Ruby、Go、Python、Quorum（L1379–1384）。不標示語言名稱，會洩漏語言的字（例如 java）換成 abc（L1494–1503）。Quorum 用的是從未釋出的 1.0 之前版本（L1504–1507）。
- **比較對象**：候選字／語言之間互比；programmer 對 non-programmer。
- **量了什麼**：只有「直覺程度」的主觀評分。作者沒有定義 intuitive（L1716–1720「we have not defined the term formally. We made this decision intentionally」）。
- **何時量**：單次問卷。
- **報告方式**：研究 1 每個概念只列評分最高的三個與最低的三個，括號內是（平均、標準差），沒有做統計檢定（L617–624）。研究 2 做了二因子 ANOVA 與 Tukey HSD（L1520–1523）。

### 研究 3、4（正確率實驗）

- **類型**：受試者間的隨機分派實驗，每人做六題（題目是受試者內的重複測量）。作者自稱「randomized controlled trials with placebo」（L2510）。
- **受試者**：同一所大學「non-computer programming classes」的學生，都確認過沒寫過程式（L1952–1961）。
  - 研究 3：徵求 19 人，1 人中途離開，剩 18 人；2011 年 4–7 月；每人酬勞 10 美元；平均 21.3 歲，12 男 6 女，全是英語母語；三組各 6 人（L1932–1941）。
  - 研究 4：徵求 73 人，2011 年 9 月到 2012 年 6 月，無酬（受試者庫）；1 人誤拿到第 3 題的解答而排除，剩 72 人；平均 20.1 歲，48 男 24 女；3 人非英語母語、1 人未答（L1942–1951）。分組失誤：Perl 13 人、Ruby 11 人，其餘各 12 人（L1945–1947；Table XXI，L1843–1859）。
- **條件（語言）**：研究 3 是 Quorum、Perl、Randomo 三組；研究 4 加上 Java、Ruby、Python 共六組（Table XXI）。
  - **Randomo** 是作者做的「安慰劑」語言：語法結構照 Quorum，但關鍵字與多數符號換成從 ASCII 表隨機挑的字元（例如 `if` 變成 `:`）；大括號、變數命名規則與加減乘除沒有隨機化（L1849–1853、L1889–1893）。
- **程序**：每場約兩小時（L2001）。受試者拿到該組語言的範例程式碼單張，**不教每一行的意思**，要自己從範例推出語意（L2008–2012「we intentionally did not teach participants what each line of syntax did」）。六題都是照英文規格寫出新程式，寫在文字編輯器裡（L2066–2071）。
  - 第 1–3 題可以看範例，時間到後發解答；第 4–6 題不能看範例、不給解答（L2052–2060；Table XXII，L2031–2040）。
  - 時間：研究 3 是前三題各 7 分鐘、後三題各 10 分鐘；研究 4 每題 6 分鐘（Table XXII）。
  - 題目涵蓋條件式、字串、變數、迴圈、函式、參數、回傳值、巢狀條件式（Table XXII）。
  - 原文沒有寫受試者能不能編譯或執行自己寫的程式，只寫「Write your code in the text editor open on the PC in front of you」（L2070–2071）。
- **量了什麼**：每題的「percent correct」。評分法叫 Artifact Encoding：把標準答案拆成一個個元件（例如某個變數有沒有正確定義），每個元件對就記 1、錯記 0，算百分比（L1794–1802）。另外把每個 token 的正確比例畫成 Token Accuracy Map（TAM）。
- **評分者一致性**：兩位評分者獨立評約 20% 的資料。研究 3 Kappa 0.80（原始一致率 91.0%）；研究 4 Kappa 0.84（92.0%）（L2116–2117、L2175）。
- **何時量**：當場，沒有延宕測驗。量的是第一次接觸某個語言兩小時內寫出的程式有多少元件正確，不是學習成效，也沒有量理解或保留。
- **研究 4 教材的錯字**：Ruby 組的範例單張在迴圈裡多了一行 `i = i + 1`；解答沒有這個錯；受試者寫了這一行不扣分（L2076–2083、L2108–2109）。

## 結果（逐項）

### 研究 1：字與符號的主觀評分（Table III–XVII；無統計檢定，只有平均與標準差）

括號內是（平均，標準差），0–10 分。下面只列比較可能被引用的幾項，其餘各表都逐列對過 PDF。

| # | 結果 | 數字 | 對照條件 | 表／節 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 迴圈用字，non-programmer 評分最高三個 | repeat (6.88, 2.94)、again (6.43, 3.05)、loop (6.30, 3.20) | 同一題的其他候選字 | Table V | L832–834 | 「repeat (6.88, 2.94), again (6.43, 3.05), loop (6.30, 3.20)」 |
| 2 | 迴圈用字，non-programmer 評分最低三個 | foreach (2.99, 2.97)、while (2.37, 2.70)、for (2.13, 2.83) | 同上 | Table V；3.2.2 | L832–834、L867–869 | 「what are perhaps the three most common words for looping in computer science, for, while, and foreach, were rated as the three most unintuitive choices by non-programmers. This result replicates previous work」 |
| 3 | 迴圈用字，programmer | 最高 loop (7.88, 2.28)、repeat (7.49, 2.70)、cycle (6.65, 2.45)；最低 duplicate (4.67)、foreach (4.35)、echo (4.13)。for 與 while 不在 programmer 的最低三名裡 | 同上 | Table V | L835–836 | 表列 |
| 4 | 條件式用字 | 兩組都把 if 評最高：non-programmer if (6.89, 2.78)、when (6.59)、require (6.46)；programmer if (8.37, 2.47) | 同上 | Table V | L827–831、L862–864 | 「For conditionals both programmers and non-programmers rated the word if highly, although several other choices were rated similarly well among non-programmers.」 |
| 5 | 判斷相等 | non-programmer：x = y (8.15, 3.10)、x is y (7.87, 2.84)、x == y (7.04, 3.29)；programmer：x == y (8.64, 2.20) 最高 | 同上 | Table VI | L902–905、L870–873 | 「Non-programmers, however, rated this choice highly, but lower than x = y or x is y.」 |
| 6 | 指派 | 兩組都把 `x = 1024` 評最高（non-programmer 6.90、programmer 7.87）；作者說它落在其他選項 95% 信賴區間之外，non-programmer 的 `x is 1024`（6.32）例外 | 同上 | Table IV | L771–774、L840–843 | 「both programmers and non-programmers rated the symbol = as the most intuitive choice for assignment (outside the 95% confidence intervals of all others with the exception of the word is (for non-programmers)).」 |
| 7 | 遞增 | 兩組都把 `x = x + 1` 評最高（7.06／8.37）；`x++` 在 programmer 排第二（7.44），不在 non-programmer 的前三 | 同上 | Table IV | L790–794、L851–856 | 「non-programmers did not rate the x++ shorthand highly」 |
| 8 | 餘數 | non-programmer 最高是 `x = remainder of 7 / 2`（5.96）；programmer 最高是 `x = 7 % 2`（6.86）、`x = 7 mod 2`（6.75） | 同上 | Table IV | L784–789 | 表列 |
| 9 | 布林型別的名稱 | non-programmer 沒有共識：condition (5.32)、logic (5.26)、binary (5.11)；boolean 在整數題與字串題都落在 non-programmer 的最低三名 | 同上 | Table III | L749–753、L798–799 | 「Non-programmers, on the other hand, presented little consistency in their ratings.」 |
| 10 | 例外處理 finally | regardless 最高（non-programmer 6.70、programmer 7.08）；作者說 finally 這個字兩組都評得差，但表只列前三與後三，finally 的分數沒印出來 | 同上 | Table XIII；3.2.4 | L1196–1200、L1219–1222 | 「the word finally was rated poorly by both programmers and non-programmers while the word regardless was rated well.」 |
| 11 | throw、catch | non-programmer 的 throw 題最低三名含 throw (3.11, 2.65)；catch 題兩組最高都是 error、detect、problem | 同上 | Table XIII | L1186–1195 | 表列 |
| 12 | 呼叫成員的符號（dot） | non-programmer 最高是 `Window:close` (6.24)；`Window.close` 是 programmer 最高 (6.94)，不在 non-programmer 前三 | 同上 | Table XII | L1165–1171、L1207–1210 | 「This somewhat odd result also replicates previous work」 |
| 13 | 泛型 | 作者判定沒有結論 | 同上 | Table VIII；3.2.3 | L964–965 | 「Generally, we find the results on generics to be inconclusive. If an intuitive syntax exists for representing generics, we did not appear to find it.」 |
| 14 | static | 作者判定沒有結論，連 programmer 也是 | 同上 | Table XI | L1131–1133 | 「for the last concept, static, we feel the results were generally inconclusive, even for our programmers.」 |
| 15 | aspect-oriented 用字 | 各選項差異小；pointcut 等社群用字評分特別低，作者說不清楚是受試者沒看懂題目還是真的沒有好字 | 同上 | Table XVI–XVII；3.2.6 | L1366–1372 | 「Whether this was because novices did not understand what we were asking or because they felt no word choice adequately described the concept is unclear.」 |
| 16 | 單行註解 | non-programmer：`//` (5.80)、comment (5.70)、note (5.50) 三者接近 | 同上 | Table XV | L1264–1266、L1293–1296 | 「non-programmers also rated the traditional single line comment used in C++ at approximately the same value (//).」 |
| 17 | 繼承 | 兩組最高都是 `truck is a vehicle`（6.56／7.38）；C++ 的冒號在 non-programmer 落在統計誤差範圍內（5.95） | 同上 | Table IX | L1008–1015、L1038–1040 | 「C++'s operator for inheritance, colon, was rated within the statistical margin of error of the English words is a by non-programmers.」 |

### 研究 2：整段語法的主觀評分（Table XIX、XX）

| # | 結果 | 數字 | 對照條件 | 表／節 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 18 | 語言主效果（全部題目合計） | F(8, 13428) = 71.071，p < .001，ηp² = .041 | 九個語言互比 | 3.3.2；Table XX | L1524–1525、L1637 | 「languages are rated significantly differently across the board (for all tasks)」 |
| 19 | 經驗主效果 | F(1, 13428) = 363.565，p < .001，ηp² = .026 | programmer 對 non-programmer | 同上 | L1526、L1593 | 表列 |
| 20 | 語言 × 經驗交互作用 | F(8, 13428) = 28.635，p < .001，ηp² = .017 | — | 同上 | L1593–1595 | 「Effects of this size are commonly interpreted as reliable but small.」 |
| 21 | 七個概念各自的檢定 | 語言主效果 ηp² 介於 .037（建構子）到 .131（if-else、return）；全部顯著 | 同上 | Table XX | L1632–1644 | 表題：「Results Indicate That Effects Were Relatively Small (ηp² < .1 in Many Cases), but Were Also Real and Easily Detectable (Literally All Effects Were Significant)」 |
| 22 | 整體評分，non-programmer | 最高 Quorum (5.53, 2.90)、Java (4.99, 2.88)、Ruby (4.95, 2.89)；最低 PHP (4.57)、Smalltalk (4.57)、Perl (4.09, 2.75) | 九個語言 | Table XIX | L1549–1551 | 表列 |
| 23 | 整體評分，programmer | 最高 Java (7.03, 2.77)、C++ (6.85, 2.89)、Quorum (6.22, 2.85)；最低 Python (5.15)、Perl (5.09)、Smalltalk (4.13) | 同上 | Table XIX | L1552–1553 | 表列 |
| 24 | Quorum 對其他語言（non-programmer，Tukey HSD） | 顯著高於 Go、C++、Perl、Python、Smalltalk、PHP（各 p < .001）與 Ruby（原文印「p < 0.024」）；對 Java **未達顯著**（p = .055） | Quorum 對各語言 | 3.3.2 | L1599–1603 | 「approached significance with Java (p = .055)」 |
| 25 | 同上，programmer | C++、Java、Quorum 三者沒有統計差異 | 同上 | 3.3.2 | L1603–1605 | 「there was no statistical difference between C++, Java, and Quorum, for these users」 |
| 26 | 作者對 24 的保留 | 評分高不等於真的比較直覺 | — | 3.3.2 | L1606–1608 | 「Obviously, this does not mean that Quorum is more intuitive than these languages, but it does mean that novices in our sample certainly perceived it to be.」 |
| 27 | 迴圈，non-programmer | 最高 Quorum 的 repeat times (5.93, 3.02)、Smalltalk 的 timesRepeat (5.40)、C++/Java 的 while (5.21)；最低 Perl/PHP 的 for (3.15)、Go 的 for (3.07)、Python 的 for i in range（指定 i）(3.01) | 各語言的迴圈寫法（共 27 種，df = 26） | Table XIX | L1554–1557 | 表列 |
| 28 | 迴圈，programmer | 最高三個都是 C++/Java：while (7.81)、do while (7.57)、for (7.31) | 同上 | Table XIX | L1558–1560 | 表列 |
| 29 | if，兩組 | 兩組最高都是 C++/Java（non-programmer 6.18、programmer 8.42） | 九個語言 | Table XIX | L1566–1570 | 表列 |
| 30 | C++ 經驗與 C++ 語法評分 | 迴歸 y = 5.37838 + 0.56818x（x 是自陳的 C++ 年數）；F(1, 1492) = 143.1，p < .001，R² = 0.08754，adjusted R² = 0.08693 | 自陳年數為預測變項 | 3.3.2 | L1609–1654 | 「users rated C++ syntax approximately half a point higher for every year of self-reported experience.」 |
| 31 | 30 沒有做的比較 | 其他語言沒有做，因為樣本幾乎只有 C++ 經驗 | — | 3.3.2 | L1653–1654 | 「Our sample generally only had experience with C++, so we did not compare this result with other languages.」 |

### 研究 3：三個語言，每組 6 人

| # | 結果 | 數字 | 對照條件 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 32 | 語言主效果（受試者間） | F(2, 15) = 7.759，p = .005，ηp² = .508 | Quorum、Perl、Randomo | 4.3 | L2138–2140 | 「differences between the programming languages were both significant and very large」 |
| 33 | 各組六題平均正確率 | Quorum M = .628（SD .198）；Perl M = .432（SD .179）；Randomo M = .341（SD .173） | 同上 | 4.3 | L2160–2164 | 見下列 |
| 34 | Quorum 對 Perl | p = .047，Quorum 較高 | Tukey HSD | 4.3 | L2160–2162 | 「users of Quorum … were able to program statistically significantly more accurately than users of Perl」 |
| 35 | Quorum 對 Randomo | p = .004，Quorum 較高 | 同上 | 4.3 | L2162–2163 | 同上 |
| 36 | Perl 對 Randomo | p = .458，**不顯著** | 同上 | 4.3 | L2163–2164 | 「Perl users were not able to program significantly more accurately than Randomo users, p = .458.」 |
| 37 | 題目的主效果（練習效果） | 第 1 題跨語言平均 M = .412（SD .237），最後一題 M = .552（SD .224）；F(5, 75) = 3.22，p = .011，ηp² = .177 | 第 1 題對第 6 題 | 4.3 | L2127–2133 | 「total cross-language averages for task 1 … raised slightly by the end of the experiment」 |
| 38 | 題目 × 語言交互作用 | F(10, 75) = .735，p = .689，ηp² = .089，不顯著 | — | 4.3 | L2133–2135 | 「implying there was no obvious interaction between task order and language」 |
| 39 | 球形檢定 | Mauchly χ²(14) = 12.071，p = .608，未違反 | — | 4.3 | L2124–2126 | — |

### 研究 4：六個語言，每組 11–13 人（Table XXIII，L2230–2240；對過 PDF 第 31 頁）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 40 | 語言主效果（受試者間） | F(5, 66) = 4.889，p = .001，ηp² = .270 | 六個語言 | 4.4 | L2192–2194 | 「initial accuracy rates of novices did, in fact, vary by programming language」 |
| 41 | 各組六題平均正確率（平均，標準差） | Ruby .558（.243）；Python .528（.246）；Quorum .508（.232）；Perl .429（.189）；Java .396（.194）；Randomo .344（.207） | — | Table XXIII | L2235–2240 | 表列 |
| 42 | 對 Randomo 顯著較高的三個 | Ruby p = .003；Python p = .011；Quorum p = .033 | 各語言對 Randomo，Tukey HSD | Table XXIII；4.4 | L2207–2209、L2235–2237 | 「some languages clearly had higher scores than placebo (Quorum (p = .033), Python (p = .011), and Ruby (p = .003))」 |
| 43 | 對 Randomo **不顯著**的兩個 | Java p = .922；Perl p = .573 | 同上 | Table XXIII；4.4 | L2209–2243 | 「for others, there was insufficient evidence to conclude that novices using those languages performed more accurately than placebo (Java (p = .922), Perl (p = .573))」 |
| 44 | 真實語言彼此之間 | 只有 Ruby 對 Java 顯著（p = .044）。其餘全部不顯著：Ruby–Python .994、Ruby–Quorum .940、Ruby–Perl .165、Python–Quorum .999、Python–Perl .412、Python–Java .141、Quorum–Perl .655、Quorum–Java .292、Perl–Java .987 | 兩兩比較，Tukey HSD | Table XXIII；4.4 | L2235–2246 | 「with one exception, no other languages showed significant differences between the others. The exception is that Ruby users had significantly higher accuracy rates than users in Java (p = .044).」 |
| 45 | Quorum 對 Perl 沒有複製出來 | 研究 3 是 p = .047（#34）；研究 4 是 p = .655。Quorum 的平均從 .628 降到 .508 | — | 4.4 | L2202–2206 | 「Quorum users scored lower overall compared to the pilot (a partial-non-replication)」 |
| 46 | Randomo 與 Perl 兩次的平均幾乎一樣 | Randomo .341 → .344；Perl .432 → .429 | 研究 3 對研究 4 | 4.4 | L2203–2205 | 「match very closely to the previous work (near-exact replication)」 |
| 47 | 題目的主效果 | F(4.20, 276.96) = 29.371，p < .001，ηp² = .308（Greenhouse-Geisser 校正） | 六題之間 | 4.4 | L2182–2185 | — |
| 48 | 題目 × 語言交互作用 | F(20.98, 276.96) = 1.64，p = .041，ηp² = .110，顯著 | — | 4.4 | L2185–2191 | 「programming language syntax may have had a small impact on the observed increase in scores over the tasks」 |
| 49 | 球形檢定 | Mauchly χ²(14) = 31.454，p = .005，違反，所以用校正 | — | 4.4 | L2179–2181 | — |

### Token 層級的觀察（Fig. 5、Fig. 6 與討論；都是描述性比例，沒有統計檢定）

Fig. 5 與 Fig. 6 的數字在 `.txt` 裡沒有（圖是點陣圖），下面是從 PDF 第 32、33 頁放大後讀的。每個 token 後面的兩個數字是研究 3、研究 4 的正確比例。

| # | 結果 | 數字 | 對照條件 | 圖／節 | 行號或頁碼 | 原文一句 |
|---|---|---|---|---|---|---|
| 50 | H05（各種語法變體的正確率相等）被拒絕，但沒有做檢定 | — | — | 4.5 | L2270–2281 | 「H05 should very obviously be rejected. For those who would like to see a statistically rigorous test here, the reader should keep in mind that we would only need show two tokens that have different rates.」 |
| 51 | 相等判斷的符號（只在第 6 題測） | Quorum 的 `=`：0.67；`==`：Perl 0、Java 0、Python 0.08、Ruby 0；Randomo 的 `!`：0.08 | 研究 4，各語言同一位置的 token | 4.5 | L2328–2335 | 「the character we randomly chose (!) to represent equality was used correctly by one participant, while the == was used correctly by only 1 out of 48 students in the other four languages.」 |
| 52 | 作者對 51 的結論 | 用詞很強 | — | 4.5 | L2327–2329、L2337–2338 | 「Our results offer a rather firm conclusion to this question—the single equals sign is a superior choice for novices」 |
| 53 | Quorum 的 `then` 與 `end`（Quorum 1.0，第 6 題） | 第一個 if 後的 then：.67、.5；第一個 else 後的 then：.17、.08；巢狀 if 後的 then：.67、.67；內層 end：.33、.08（兩處）；最外層 end：.5、0 | 研究 3、研究 4 | Fig. 5；4.5 | PDF 第 32 頁；L2316–2321 | 「in experiment 4, only one participant correctly placed the inner end tokens. … the TAM shows only up to 67% accuracy in the best case, with 8% in the then after the first else for experiment 4」 |
| 54 | 型別標註 | 新手大約只有一半的時候寫對 | 跨題目與語言 | 4.5 | L2377–2378 | 「novices only placed type annotations approximately half the time in our study, across tasks and languages.」 |
| 55 | 拿掉型別標註的好處很小 | 第 6 題總共只差一分 | — | 4.5 | L2392–2394 | 「the syntactic benefit of removing the type annotations is relatively small in our studies; a total of only one point in task 6 and slightly more in other tasks.」 |
| 56 | Perl 的 `$` | 這個字元的正確率在 0 到 85% 之間；`$_[0]` 研究 3 是 0%、研究 4 是 8% | — | 4.5 | L2395–2398 | 「the seemingly trivial addition of the $ operator in Perl led to accuracy rates for this character of between 0 and 85%.」 |
| 57 | Ruby 的 for 迴圈（第 4 題，研究 4） | for：.18；in：.09；`..`：.27 | — | Fig. 6；4.5 | PDF 第 33 頁；L2404–2408 | 「Novices only correctly used the word for approximately 18% of the time and the rest of the syntax for this construct did not do much better.」 |
| 58 | Quorum 的 repeat | 研究 4：58%；研究 3：85% | 對 Ruby 的 for（18%） | 4.5 | L2408–2410 | 「novices in experiment 4 used the word repeat correctly 58% of the time (85% in experiment 3), an increase of 322%.」 |
| 59 | 多加英文字不一定有幫助 | Ruby 的 in、Quorum 的 then 正確率都低 | — | Fig. 6 圖說 | L2369–2370 | 「simply adding extra words to make the syntax more English-like (e.g., in, then) does not necessarily benefit novices.」 |
| 60 | 分號 | 作者說對新手是相對小的問題 | — | 4.5 | L2437–2439 | 「semicolons are a relatively trivial issue for novices anyway [Denny et al. 2012], which our data supports in a very different way.」 |

### 作者自己的總結（第 6 節，L2516–2575）

七點裡與本系列相關的幾句，用詞照抄：

- (1)「non-programmers appear to rate higher those words that are both common in English and literal (e.g., for the concept of iteration, words such as repeat instead of for).」（L2518–2520）
- (2)「teachers, users, and designers of programming languages, especially those with significant experience, would be wise to check their assumptions before claiming a design is intuitive.」（L2524–2526）
- (5)「Some programming languages **may** not afford accuracy rates much higher than placebo. We document evidence that some languages (Ruby, Python, and Quorum) do afford accuracy rates higher than placebo, but found **insufficient evidence** to determine that this is the case for either Java or Perl.」（L2535–2538）
- (7)「While our results are preliminary, Token Accuracy Maps suggest the following.」（L2543–2544）

問卷討論裡，作者對「什麼叫直覺」的三個歸納（L1721–1725）：常見、英文裡意思明確的字評分高（repeat、undefined）；隱喻式的名稱評分低（throw、catch）；在程式裡的意思與英文裡的意思衝突的符號評分低（dot）。作者接著說「we still struggle with finding a definition of intuitiveness that is completely satisfying」，而且直覺與否取決於情境，這裡的情境是美國中部一所大學、英文問卷（L1725–1732）。

## 作者自己列的限制

問卷（研究 1、2；L1682–1747、L2450–2453）：

1. 評分的前提是題目的概念描述合理、受試者看懂了；進階概念（例外、aspect-oriented）缺乏共識，可能是沒看懂（L1683–1713）。
2. 「intuitiveness」沒有正式定義，而且取決於情境（美國中部一所大學的英文問卷）（L1716–1732）。
3. 作者是 Quorum 的設計者，可能有無意的偏誤；作者的辯護是問卷先於 Quorum（L1733–1741）。
4. 問卷結果對實際表現可能沒有影響：「our surveys may have no impact on actual performance in the field」（L2452）。
5. non-programmer 裡有自相矛盾的填答（研究 1 有 22 人、研究 2 有 13 人），無法查證（L513–523）。
6. 沒有問受試者有沒有用過 Quorum（L524–530）。

實驗（研究 3、4；L2465–2503）：

7. 題目簡單，不代表專業工作，「or perhaps even what students do in a college level course」（L2466–2470）。
8. 不清楚語法差異在真實課堂上的影響：「It remains unclear how syntactic changes impact novices in the field, especially given that novices in the classroom are taught using a variety of pedagogical styles」（L2470–2472）。
9. 控制越嚴，越不像實際情況（L2473–2475）。
10. 需要更大的樣本、換範例、看學習歷程其他階段的學生、測其他語法（L2477–2481）。
11. Randomo 這個安慰劑是第一次嘗試：「Ultimately, our choice is a first attempt.」（L1894–1896）
12. 研究 4 的分組人數失誤、Ruby 教材錯字（L1945–1947、L2076–2083）。

原文沒有談的：研究 3 每組只有 6 人、研究 4 每組 11–13 人的檢定力；「不顯著」不等於「沒有差別」（摘要與結論的用詞有時越過這條線，見下節）；語言之間除了用字還差很多別的（結構、型別、符號），整個語言的比較分不出是哪一項造成的，只有 Quorum 對 Randomo 這一組是結構相同、只換關鍵字與符號；受試者能不能執行程式；延宕後的結果；token 層級的比較全部沒有檢定、多數每格只有 11–13 人。

## 與摘要說法不一致的地方

逐項對過，數字沒有不一致。措辭上有四處：

1. 摘要寫 Perl 與 Java「did not afford accuracy rates significantly higher than a language with randomly generated keywords, but that languages which deviate (Quorum, Python, and Ruby) did」（L22–25），這是對的。但摘要沒有說：Quorum、Python、Ruby 三者對 Perl 與 Java 的直接比較，除了 Ruby 對 Java（p = .044）以外全都不顯著（Table XXIII）。也就是說，資料沒有顯示「偏離 C 風格的語言比 C 風格的語言正確率高」，只顯示前三者與 Randomo 分得開、後兩者分不開。
2. 結論節寫「many aspects of traditional C-style syntax … exhibits problems in terms of usability for novices」（L2593–2594），第 6 節的總結用的是「may not」與「insufficient evidence」（L2535–2538）。同一件事兩處的強度不同。
3. 4.3 節末寫「any language with C-style syntax would at least afford accuracy rates higher than a placebo. However, as this and the next experiment shows, this was not the case」（L2168–2170），把「不顯著」寫成「不是這樣」。數字上 Perl（.429）與 Java（.396）都高於 Randomo（.344）。
4. 摘要把四個研究並列，沒有說研究 3 對研究 4 有一項沒複製出來（Quorum 對 Perl，p = .047 → p = .655；內文 L2202–2206 自己稱為 partial-non-replication）。

## 原文內部對不上的地方（照實記錄，不猜哪個對）

- **「322%」**：L2408–2410 寫 repeat 的 58% 對 for 的 18% 是「an increase of 322%」。58 ÷ 18 ≈ 3.22，是 322% 倍，增加幅度是約 222%。
- **「85% in experiment 3」**（L2409）：研究 3 的 Quorum 組只有 6 人，6 人裡的比例不可能是 85%（5/6 = 83%）。同樣地 L2396–2397 的 Perl `$`「between 0 and 85%」，研究 3 的 6 人或研究 4 的 13 人（11/13 = 85%）才可能出現 85%；原文沒有說是哪一個研究。不確定是筆誤還是另有算法。
- **Table XIII 的 Try 題**（L1181–1185；PDF 第 16 頁確認不是轉檔問題）：programmer 那一列印的是「test (5.84, 2.76), check (6.05, 2.63), try (5.34, 2.87)」，前兩項的數字與 non-programmer 那一列一模一樣，而且 5.84 排在 6.05 前面（表應由高到低）；最低三名的 protect (3.45, 2.74)、preserve (3.50, 2.59) 也與 non-programmer 列完全相同。看起來是 programmer 列被誤植。
- **指派運算子「100%」**：L2335–2337 寫「100% of novices used the assignment operator correctly in task 6 for Quorum」。Fig. 5 第一行 `integer y = 6547` 的 `=` 是 1、1；但三處巢狀的 `y = y + 1000` 那幾行，`=` 後面印的是 .5、.25。原文沒有說明 100% 指的是哪一個位置；巢狀那幾行的低分也可能是整行沒寫所致（作者在 L2432–2437 說漏掉整行就不給分）。
- **Fig. 5 右側**：圖說說右邊是 Quorum 1.7 修改後的語法，其中巢狀的條件印成 `if > 1000`，少了 `y`（PDF 第 32 頁）。
- **設計的稱呼**：L1789「a repeated-measures between-subjects design」，兩個詞並用；實際是語言為受試者間、題目為受試者內。
- **研究 1 的 non-programmer**：定義是自陳 0 年經驗，但 Table I 的 NP 欄有人填了單一語言的經驗（C++ 13 人、HTML 8 人等）；作者在 L513–523 自己交代了。

## 與清單「要撐的結論」不合的地方

清單那一句：「語法用什麼詞會影響新手；C 風格不比隨機關鍵字好」。

**前半「語法用什麼詞會影響新手」**：撐得住，但要縮小講法。
- 最乾淨的證據是 Quorum 對 Randomo：兩者結構相同，只換關鍵字與多數符號，兩次實驗 Quorum 都顯著較高（研究 3 p = .004，.628 對 .341；研究 4 p = .033，.508 對 .344）。這一組比較支持「用字與符號有影響」。
- 「影響」的是什麼要寫清楚：沒寫過程式的大學生，不經教學、只看範例，兩小時內照規格寫出的短程式裡有多少元件正確。沒有量學會了多少、理解多少、之後記不記得，也沒有課堂情境。作者自己說「It remains unclear how syntactic changes impact novices in the field」（L2470–2471）。
- 換的不只是「詞」，還有符號（例如 `if` 換成 `:`、相等換成 `!`）。寫成「詞」會窄化；寫成「關鍵字與符號」才對。
- 問卷那一半（repeat 比 for 直覺等）是主觀評分，作者明說是線索不是證明（L598–601、L1679–1680）；programmer 與 non-programmer 的評分不同，而且這裡的 non-programmer 是資工系課堂上自陳零經驗的學生。

**後半「C 風格不比隨機關鍵字好」**：要改寫，照字面撐不住。
- 原文的結果是「沒有足夠證據顯示 Java、Perl 的正確率高於 Randomo」（p = .922、.573；研究 3 的 Perl p = .458），是不顯著，不是證明一樣或沒有比較好。作者在第 6 節自己的用詞是「may not afford accuracy rates much higher than placebo」「found insufficient evidence」（L2535–2538）。
- 數字上兩者都高於 Randomo（Java .396、Perl .429 對 .344）。每組只有 11–13 人（研究 3 是 6 人），原文沒有報告檢定力。
- 反過來的比較也不顯著：Quorum、Python、Ruby 對 Perl、Java，除了 Ruby 對 Java（p = .044）以外都分不開（Table XXIII）。所以不能寫成「非 C 風格的語言比 C 風格好」。
- 「C 風格」是作者的歸類：Perl 是「a relatively C-like syntax」（L2165），Java 是「more traditional C-style」（摘要）。受測的 C 風格語言只有這兩個，沒有 C 或 C++。
- Randomo 不是完全隨機：結構沿用 Quorum，大括號、變數命名與加減乘除保留（L1849–1853）。「隨機關鍵字」這個說法可以用，但要知道它的骨架是作者自己設計的語言。
- 建議的寫法：「有一組實驗裡，沒寫過程式的學生用 Java 或 Perl 寫出的程式，正確率和用一個關鍵字隨機挑的語言分不出高下（每組 11 到 13 人）；用 Ruby、Python 與作者自己設計的 Quorum 則分得出來。」並補上作者是 Quorum 的設計者。

**另外幾點清單沒提、但引用時會用到的**：
- 單一等號對雙等號（#51）是全文用詞最強的 token 層級結論，但只在一題測、每格 11–13 人、沒有檢定。
- 「加英文字不一定有幫助」（#59，then、in 的正確率都很低）是和「用白話的字比較好」方向相反的結果，同一篇裡兩者並存。
- 問卷裡 non-programmer 把 `//`、冒號繼承評得和英文字差不多（#16、#17），if 在兩組都是最高（#4）。不是所有傳統寫法都被評為不直覺。
- 經驗者對熟悉語法的評分隨年資上升（#30，R² 約 .09），作者據此提醒有經驗的人不要憑感覺說某個設計直覺（L2524–2526）。這一點對「寫作者自己覺得清楚的記號，讀者未必覺得」有直接的對應，但它是 C++ 一個語言、自陳年數的相關。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | L1–500 | 首頁、摘要、第 1 節導言、第 2 節相關研究、3.1 方法開頭、Table I |
| 2 | L500–1149 | 3.1.1 受試者後半、3.1.2 教材與作業、3.1.3 程序、3.2 研究 1 結果（3.2.1–3.2.4）、Table II–XI |
| 3 | L1149–1798 | Table XII–XVII、3.2.5–3.2.6、3.3 研究 2（Table XVIII–XX、Fig. 1–2 圖說）、3.4 問卷討論與效度威脅、第 4 節開頭（RQ2、H04、H05、Artifact Encoding） |
| 4 | L1798–2397 | 4.1 dummy treatment（含註腳 1）、Table XXI、4.2 方法（受試者、程序、Table XXII、教材）、4.3 研究 3 結果、4.4 研究 4 結果、Table XXIII、4.5 討論前半 |
| 5 | L2397–2909 | 4.5 討論後半、第 5 節整體討論與效度威脅、第 6 節總結、第 7 節結論、致謝；L2613–2894 參考文獻（掃過）；L2896 收稿日期 |

對過 PDF 版面的表與圖：

- PDF 第 11–17 頁：Table III–XV 逐列對過，與 `.txt` 相符（Table XIII 的異常在 PDF 上也是如此）。
- PDF 第 19–22 頁：Fig. 1、Table XVIII、Fig. 2、Table XIX、Table XX，相符。
- PDF 第 25、28 頁：Table XXI、Table XXII，相符。
- PDF 第 27 頁：Fig. 3 六個語言的範例程式（`.txt` 沒有內容，只有圖說）。
- PDF 第 29 頁：Fig. 4 是各語言各題的誤差線圖，圖上沒有印數字，沒有從圖上估值。
- PDF 第 31 頁：Table XXIII 逐格對過，相符；粗體是 .044、.003、.011、.033 四格。
- PDF 第 32、33 頁：Fig. 5、Fig. 6 以 260 dpi 轉成圖片放大後讀數字（上面 #53、#57）。
- 沒有另外對 PDF 的：Table I、II、XVI、XVII（`.txt` 版面整齊，欄位沒有錯位；Table I 的數字只用到 C++ 那一列與 Overall 列）。

原文沒有附錄。作者多次提到「replication packet available from the authors on request」，不是公開附件，沒有取得。
