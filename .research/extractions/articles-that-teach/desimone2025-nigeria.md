# 抽取紀錄：De Simone、Tiberti、Barron Rodriguez、Manolio、Mosuro、Dikoru 2025，World Bank Policy Research Working Paper 11125

- **書目**：Martín De Simone、Federico Tiberti、Maria Barron Rodriguez、Federico Manolio、Wuraola Mosuro、Eliot Jolomi Dikoru（作者全名對封面 L16–21 與標題頁 L91–92 核過）。〈From Chalkboards to Chatbots: Evaluating the Impact of Generative AI on Learning Outcomes in Nigeria〉。World Bank Policy Research Working Paper 11125，Education Global Department，2025 年 5 月。沒有 DOI；網址 https://documents1.worldbank.org/curated/en/099548105192529324/pdf/IDU-c09f40d8-9ff8-42dc-b315-591157499be7.pdf
- **版本**：工作論文（未經期刊審查）。存檔是**更新版**，標題頁寫「Originally published in the Policy Research Working Paper Series in May 2025. This version is updated in December 2025.」（L97–98）。我沒有 2025 年 5 月原版，兩版差在哪裡不知道；引用時要寫「2025 年 12 月更新版」。
- **原文檔**：`.research/raw/learning-content/q6-evaluate/desimone2025nigeria.txt`（`pdftotext -layout`，1,721 行、110,197 位元組；清單記 109,014 字元）；PDF 同目錄 `desimone2025nigeria.pdf`，51 頁（印刷頁碼到 49，前面多兩頁封面與摘要頁）。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 28（清單 28#9）
- 行號一律是 `.txt` 的行號；頁碼是 PDF 印刷頁碼。單欄排版，文字檔沒有左右欄交錯。

## 研究設計

- **類型**：學生層級隨機分派的實地實驗（RCT），課後輔導方案。沒有分層，沒有固定亂數種子（註 6，L427–431）。全文沒有提到預先註冊；摘要頁說世界銀行有「verified reproducibility package」（L31–34）。
- **地點與時間**：奈及利亞貝南市（Benin City）9 所公立學校，學校是因為有電腦教室才被選上（L303）。課後課 2024-06-03 到 07-11（Table 14，L1644），共六週。
- **受試者**：高中一年級（senior secondary 1），平均約 15 歲（Table 1：實驗組 15.19、對照組 15.12）。分析樣本女生占 77.3%（實驗組）與 79.5%（對照組）（Table 1，L1208）。
- **誰進得了抽籤**：全校一年級都被告知，十天內自願表達興趣的才進抽籤（L369–372）；導言說符合資格者有 52% 表達興趣（L139–141）。沒有表達興趣者的人口資料（L402–403）。
- **人數**：分派時實驗組 657、對照組 671；做完期末評量的只有實驗組 422、對照組 337（L409–412）。換算完測率是實驗組 64.2%、對照組 50.2%（我算的；原文沒有寫百分比，只在 L712–713 說兩組流失差異顯著）。主要迴歸的觀察數是 654（第三學期考試 636）（Table 2），比 422+337=759 少，原文沒有說明少掉的 105 人是誰（推測是沒有第二學期成績的人，原文沒寫，不確定）。Table 6 顯示 654 人裡實驗組 344 人，所以對照組是 310 人（我用減法算的）。
- **介入內容**（2.1 節，L291–363）：
  - 每週最多兩次、每次 90 分鐘的課後課，共 12 次（L142、L301–302）。
  - 工具是 Microsoft Copilot（當時以 GPT-4 為底）（L294、L298–299），免費、只需註冊。
  - **兩人共用一台電腦**（L318「Students worked in pairs, sharing a computer」），每堂平均 30 人（L301）。
  - **老師在場**：老師先受過一次三天的訓練（L320–324）；每堂由老師給起始提示詞，之後學生自由和 AI 互動，老師巡堂確保學生沒有離題（L332–334）。老師「did not provide direct instruction」（L320）。
  - 老師拿到三件式工具包：線上資源、AI 素養手冊、**每堂的課程指引（含建議的起始提示詞與追問）**（L334–338）；學生也有一本含起始提示詞的手冊（L340–341）。
  - 每堂對應高一英語課綱的一個主題，和正課進度一致（L330–331）。
  - 提示詞的設計目的是讓模型當家教而不是直接給答案，並用了提取練習、追問式闡述、具體例子（L342–346、註 3 L347–389）。附錄 Figure 11（p.49）的學生手冊範例裡，起始提示詞要求模型：回答後出題或追問確認理解、等學生作答、答錯先給提示、「if my reply is still incorrect you may provide the answer offering an explanation」。同一頁寫方案在第三學期第 7 到 11 週進行，第 11 週是複習週。
  - 第一堂課是教學生認識 Copilot、它的好處與風險（L325–329）。
  - 另有受訓的監測員用 Kobo Toolbox 記錄出席與每堂狀況（L359–363）。
  - 斷網與停電是常態（L314–316）。
- **比較對象**：對照組「did not receive any intervention but continued their regular learning in the classroom」（L406–408）。也就是對照組**沒有任何課後活動**，實驗組多了最多 18 小時（12 × 90 分鐘）有老師在場的學習時間。
- **量了什麼、何時量**：
  1. 研究團隊出的期末評量：紙筆、選擇題、專家依課綱命題，多版本題序隨機、有監考（L445–455）。三個部分：英語（主要結果，題數最多）、AI 知識、數位技能。計分有未加權、依命題者事前難度加權、IRT 三種（L456–467）。施測日 2024-07-11 到 07-12（Table 14），**課程一結束就測**。
  2. 學校自己辦的第三學期英語考試（L468–471），日期 2024-07-12（Table 14）。
  3. 基線：第一、第二學期的學校考試成績；基線與期末問卷（人口與社經資料）。
  - **沒有延後測驗**，沒有量學生的感受、動機或自評。也沒有分析學生與 AI 的對話紀錄。
- **分析**：ITT 迴歸，控制第二學期成績與學校固定效果，穩健標準誤（式 1，L488–494）。所有結果變項標準化成平均 0、標準差 1。

## 結果（逐項）

Table 1–13 全部對過 PDF 版面（p.29–41），數字與文字檔相符。

### 主要結果（ITT；對照條件一律是「抽中可參加課後課」對「沒抽中、只上正課」）

| # | 結果 | 數字 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 期末評量總分（加權） | 0.310 SD（SE 0.068），p<0.01，N=654 | Table 2 欄 1 | L1242–1252；L506 | 「The treatment effect on the total score (weighted) is 0.31 standard deviation (SE = 0.068)」 |
| 2 | 期末評量總分（IRT） | 0.263 SD（SE 0.068），p<0.01，N=654 | Table 2 欄 2 | L507–508 | 「the effect remains positive and significant at 0.263 standard deviation (SE = 0.068) when scaled using Item Response Theory」 |
| 3 | 學校第三學期英語考試 | 0.206 SD（SE 0.067），p<0.01，N=636 | Table 2 欄 3 | L510–512 | 「treatment also had a positive and significant impact on the third term exam score, with an effect size of 0.206 standard deviation (SE = 0.067), although this exam was not limited to the intervention's specific content.」 |
| 4 | 英語部分（作者指定的主要結果） | 0.238 SD（SE 0.068），p<0.01，N=654 | Table 3 欄 1 | L520–524 | 「followed by English skills (0.238 σ, SE = 0.068)」「Effects on English skills (our main outcome of interest) and on AI skills are statistically significant at the 1% level.」 |
| 5 | 數位技能部分 | 0.139 SD（SE 0.076），只在 10% 水準顯著 | Table 3 欄 2 | L522–525 | 「The effects on digital skills are statistically significant at the 10 % level.」 |
| 6 | AI 知識部分（三部分裡最大） | 0.309 SD（SE 0.077），p<0.01 | Table 3 欄 3 | L520–521 | 「the intervention had the largest effect on AI knowledge, with a coefficient of 0.309 standard deviations (SE = 0.077)」 |

注意：總分 0.31 裡含 AI 知識與數位技能兩部分，而實驗組第一堂課就在教 Copilot 是什麼，對照組沒有碰過。只談英語學習要用第 4 項的 0.238（或第 3 項的 0.206），不是 0.31。

### 基線平衡與選樣

| # | 結果 | 數字 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 7 | 基線成績差（實驗組減對照組） | 第一學期 0.131（SE 0.073，CI −0.013 到 0.275）；第二學期 0.096（SE 0.073，CI −0.048 到 0.24）。不顯著，但方向都偏實驗組 | Table 1 | L1214–1215；L425–440 | 「These differences are also statistically insignificant」；L495–497「it was still positive in favor of the treatment group」 |
| 8 | 兩組的學校組成不平衡 | School D：實驗組 24.2% 對照組 34.7%，差 −0.105（CI −0.17 到 −0.04）；School H：23% 對 12.8%，差 0.102（CI 0.048 到 0.156）。兩個信賴區間都不含零 | Table 1 | L1222、L1226 | 表列。內文只說人口與基線成績平衡（L417–422），沒有提這兩所學校 |
| 9 | 表達興趣的人和沒表達的人 | 第一學期：有興趣者高 0.085 SD（p<0.1）；第二學期反過來，沒興趣者高 0.147 SD（p<0.01）。N=1,564 與 1,586 | Table 12 | L376–399；L1564–1571 | 「The absence of a consistent directional pattern across terms suggests that selection into the program was not strongly or systematically correlated with academic performance.」 |

### 異質性（Table 4，依變項都是加權總分）

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 10 | 性別交互作用 | Treatment × Female = 0.420（SE 0.188），p<0.05。同一欄的 Treatment 主效果（即男生的效果）= −0.039（SE 0.172），不顯著 | L1312–1325；L563–569 | 「While the main effect of treatment is not statistically significant for this specification, the interaction term for treatment and being female is positive and significant (0.420) at the 5% level」 |
| 11 | 作者對性別結果的保留 | 受一所基線表現較差的女校影響 | L566–569 | 「This result should be interpreted with caution, as it appears to be influenced by the inclusion of a girls-only school that performed worse than others in the sample prior to the intervention.」 |
| 12 | 基線成績交互作用 | Treatment × 第二學期成績 = 0.151（SE 0.072），p<0.05：原本成績好的受益較多 | L1318–1319；L570–573 | 「students with higher prior academic performance benefited more from the intervention」 |
| 13 | 社經地位交互作用 | Treatment × SES = 0.113（SE 0.047），p<0.05，N=617：社經地位高的受益較多 | L1330–1331；L573–581 | 「students from higher SES backgrounds experienced larger treatment effects. This finding aligns with anecdotal evidence indicating that, for students from poorer households, this was often one of their first experiences using computers.」 |
| 14 | 分量迴歸 | 內文說各分量都正向且顯著；**沒有表也沒有數字** | L557–560 | 「The analysis indicates that the treatment has a positive and statistically significant effect across all quantiles」 |

第 10 項要小心讀：這個規格下男生的估計值接近零、標準誤很大（樣本約八成是女生），原文沒有另外報告男生子樣本的效果。導言與摘要寫的「所有基線程度都受益」（L159–160）來自第 14 項，沒有附數字。

### 出席與劑量（3.3 節）

| # | 結果 | 數字 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 15 | 實驗組平均出席率 | 約 72%；完全沒來的占 3.5% | 3.3 | L586–587、L626–627 | 「an average attendance rate of approximately 72%」「the non-compliers represent only 3.5% of those assigned to the treatment group」 |
| 16 | 每多出席一天（IV，以抽中與否當工具變項） | 加權總分 0.033 SD（SE 0.007）；IRT 0.028；第三學期考試 0.022；數位 0.015（p<0.1）；AI 0.033；英語 0.025（SE 0.007） | Table 5 | L1360–1361；L605–607 | 「an estimated effect size of approximately d=0.033 for each additional day of attendance」 |
| 17 | 保守調整後 | 0.031 SD／天（假設沒來的人就算來了也零效果） | 3.3 | L624–628 | 「the estimated effect size of each additional day of attendance is of 0.031」 |
| 18 | OLS 加值模型 | 全樣本 0.034／0.029／0.022；只看實驗組 0.041（SE 0.016）／0.034（SE 0.015，p<0.05）／0.050（SE 0.017），N=344／344／336 | Table 6 | L1384–1394 | 表列 |
| 19 | 二次項 | 加入出席天數平方後，一次項與二次項全部不顯著（如全樣本加權總分：0.013（SE 0.030）與 0.002（SE 0.003）） | Table 7 | L1409–1413；L642–644 | 「adding a quadratic term does not improve the fit, and the quadratic term is not significant」 |
| 20 | 頭幾天沒有效果（質性說法＋圖） | Figure 4（p.44）九個出席天數分組的平均分數：0–1.44 天約 −0.3、1.44–2.89 天約 −0.9（最低點）、之後逐段上升到 11.6–13 天約 +0.4。圖上數值是我目測的 | 3.3；Figure 4 | L648–656 | 「the first days of the program had little to no measurable impact on learning outcomes. This lag may reflect the time required for students to familiarize themselves with the technology」 |
| 21 | 外推到一整學年 | 36 週全勤約 2.23 SD；72% 出席率（21 週）約 1.55 SD；50% 出席率約 1.2 SD | 3.3 | L657–666 | 「our instrumental variables analysis predicts that attending the program for 36 weeks … would lead to gains of approximately 2.23 standard deviations.」 |
| 22 | 誰比較常來（Table 9，依變項是出席天數） | 女生少 1.6 天（SE 0.492，p<0.01）；SES 每高一單位多 0.348 天（p<0.01）；加第二學期成績：0.397 天（p<0.1）；加學校固定效果後女生與成績都不顯著。N=712／615／615 | Table 9 | L1484–1497；L622–623 | 「better performance in previous examinations correlates positively with attendance (Table 9)」 |

第 21 項是外推，不是觀察到的結果：資料只有六週、最多 12 次，直線假設來自第 19–20 項。第 16–18 項裡出席天數不是隨機分派的，Table 6 右半（只看實驗組）是相關。

### 穩健性（3.4 節）

| # | 結果 | 數字 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 23 | 逐一拿掉一所學校 | 加權總分效果 0.156（拿掉 School D，SE 0.085，只在 10% 顯著）到 0.360（拿掉 School F，SE 0.072）；其餘七所在 0.291–0.351，都 p<0.01 | Table 8 | L1435–1460；L699–706 | 「The estimated treatment effects range from 0.156 (SE = 0.085) when excluding Idia College to 0.360 (SE = 0.072) when excluding Imaguero College.」「given the large size of Idia College (219 of 657, or 33% of the sample), whose exclusion reduces the power of the calculation」 |
| 24 | Lee 邊界（處理兩組流失不等） | 加權總分 0.255–0.327，95% CI [0.115, 0.462]；英語 0.202–0.238，CI [0.058, 0.384]；數位 0.138–0.145，CI [−0.018, 0.297]（含零）；AI 0.232–0.351，CI [0.078, 0.489] | Table 10 | L1515–1521；L712–717 | 「The analysis shows that the treatment effects are always positive and significant, even following this conservative approach (Table 10).」 |
| 25 | 逆機率加權（處理流失） | 加權總分 0.272（SE 0.067）；IRT 0.227；**第三學期考試 0.134（SE 0.059，p<0.05）**；英語 0.194（SE 0.068）；**數位 0.102（SE 0.075，不顯著）**；AI 0.301。N=700（第三學期考試 858） | Table 11 | L1538–1549；L717–721 | 「finding that the estimated ITT effects remain largely unchanged (Table 11)」 |

第 23 項：內文用校名（Idia College、Imaguero College），表用代號（School D、School F），對照數值可知 D＝Idia、F＝Imaguero。拿掉 Idia 後效果砍半，作者歸因於樣本變小。

### 成本效益（4.1 節）

| # | 結果 | 數字 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 26 | 六週方案成本 | 總計 31,669 美元、657 人，每人約 48 美元；固定成本 13,740（43%），其中教材開發 9,900；變動成本 17,929，每人 27 美元 | Table 13 | L1584–1611；L732–741 | 「Implementing the 6-week pilot for 657 students, had a per-pupil cost of approximately $48, and the marginal cost is estimated at $9.」 |
| 27 | 人力 | 老師與監測員共 55 人（含備援），學生與老師比 12 | Table 13 | L1602–1603 | 表列 |
| 28 | 不含的成本 | 電費與學校基礎設施 | Table 13 註 | L1615–1616 | 「Electricity and school infrastructure costs are not included.」 |
| 29 | 換算成「照常上學的年數」（EYOS） | 英語 0.238 SD ≈ 1.5 年；總分 0.31 SD ≈ 2 年；每 100 美元 3.2 EYOS（假設報酬固定） | 4.1 | L752–760 | 「Our ITT effect of 0.238 standard deviation in English is equivalent to increasing 1.5 years of 'business-as-usual' schooling in Nigeria」 |
| 30 | 換算成薪資 | 薪資 +14%（用肯亞的報酬率代替，註 11）；每年多 392–630 美元；折現終身 7,767–12,517 美元；益本比 161–260 | 4.1 | L761–768 | 「the benefit-cost ratio of our pilot program is 161 to 260」 |
| 31 | LAYS | 效果只維持一年 0.3；維持到剩餘就學年數 0.9；每 100 美元 0.6–1.9 | 4.1 | L800–808 | 「If the effects last only one year, the intervention produces 0.3 LAYS.」 |
| 32 | 和其他 RCT 比 | 中低所得國家教育 RCT 的中位數效果是總分 0.10 SD、閱讀 0.14 SD（Evans & Yuan 2022）；本研究至少在第 80 百分位，只看語言結果約第 70 百分位 | 3.1 | L542–549 | 「the results found in this study are situated at least at the 80th percentile of all RCTs」 |

第 29–31 項全是把六週、剛結束就測的效果換算成長期的年數與薪資，原文沒有任何追蹤資料。

### 作者對機制的說法（不是檢定結果）

- 效果來自整套介入：L902–903「we interpret that the intervention as a whole -which includes the interaction with the LLM and teacher guidance with specific prompts- is driving the results.」
- 三個機制（L895–901）：提示詞設計成解釋而非給答案、老師監督引導、內容對齊課綱。
- 不認為只是多出來的上課時間：L904–913「We have reasons to believe that the effects are not driven solely by the additional time with teachers, given that the impact of human tutoring tends to be very low when is not one-on-one or in small groups (Nickow et al., 2020; Kraft and Lovison, 2024).」這是引別人的研究來推論，本研究沒有「只多上課、不用 AI」的對照組。
- 作者自己把這個方案歸類為更接近「computer-assisted instruction」（融入老師教學與課綱），不是獨立運作的「computer-assisted learning」（註 16，L905–908）。
- 與 Bastani 2024 的關係（L885–893）：作者說 LLM 被當捷徑時會傷害學習，本方案顯示「when used specifically as tutors adapted to specific use cases and contexts via prompting」可以改善學習。

## 作者自己列的限制

原文沒有 Limitations 節。散在各處的有：

1. **效果的來源拆不開**：未來研究一節說要加組別才能分開「additional instructional time and the interaction with the chatbot with teacher support」（L848–850），並提議加一組「老師一對一、不用科技」來直接比較（L843–848）。
2. **只有短期結果**：L851–853「Future studies should investigate whether the positive effects observed in the short term persist over time」。
3. **六週太短**：L821–823。
4. **不知道學生怎麼和 AI 互動**：需要質性分析才知道因果機制（L825–828）。
5. **外部效度**：只有有電腦教室的城市學校，應擴到鄉村（L835–836）；沒有未表達興趣學生的人口資料（L402–403）。
6. **學生層級隨機分派可能有外溢**（L530–533）；**部分對照組學生混進課後課**，因為有些老師頭幾週不願意擋人（L534–536）；頭幾週很多學生連帳號都建不起來（L536–538）。作者把這三點都解讀成「估計偏保守」（L539–541）。
7. **兩組流失差異顯著**（L712–713），用 Lee 邊界與逆機率加權處理。
8. **性別結果受一所女校影響**（L566–569）。
9. **可能擴大不平等**：成績好、社經地位高的受益較多，政策建議段提醒數位落差（L933–947）。
10. **規模放大後效果通常會變小**（L920–921，引 Evans & Yuan 2022）。
11. 課後方案會不會排擠校內時間、在校內做是否更好，不知道（L853–857）。
12. 提示詞還沒用到交錯與間隔練習（註 3，L384–389）。

原文沒有談的：期末評量是研究團隊自己出的、而且含實驗組學過對照組沒學過的 AI 內容；兩人共用一台電腦對個別學習的影響；沒有預先註冊。

## 與摘要說法不一致的地方

1. **英語效果的數字**：摘要寫「The effect on English, the main outcome of interest, was of 0.23 standard deviations」（L48–49）；Table 3 是 0.238，導言與成本段寫 0.24（L149、L800）。四捨五入應是 0.24。
2. **「1.5 to 2 years」**：摘要說學習增益「equating to 1.5 to 2 years of 'business-as-usual' schooling」（L40–41）。內文裡 1.5 年對應英語、2 年對應含 AI 與數位技能的總分（L752–755），不是同一個結果的範圍。
3. **「largest effects are for female students, and those with higher initial academic performance」**（L45–46）：相符，但摘要沒提社經地位高者受益較多（Table 4 欄 3），也沒提性別結果作者自己要讀者小心。
4. **「when designed and used properly, can have transformative impacts」**（L48–49）：設計上無法把 AI 的效果和「多 18 小時、有老師在場、對齊課綱的課後課」分開，作者自己在 4.2 節承認。
5. **模型名稱**：摘要與 2.1 節寫 Microsoft Copilot（以 GPT-4 為底）；導言寫「a publicly available LLM (ChatGPT-4)」（L138），2.1 節又寫「Microsoft Copilot, powered by ChatGPT-4」（L298）。用的是 Copilot。
6. **第三學期考試考什麼，三處說法不同**：導言說範圍「included the content of the entire year」（L153–154）；2.3 節說「covered the entire term's content」（L470）；Table 2 的註說「which content was unrelated to the intervention's material」（L1262）。課程每堂對應高一英語課綱的主題、與正課進度一致（L330–331），所以「無關」說不通；比較可信的是「範圍比課後課大」，但到底是整學期還是整學年，原文自己不一致。
7. **「always positive and significant」對 Table 10**（L716–717）：數位技能的 Lee 邊界 95% CI 是 [−0.018, 0.297]，含零。Table 11 的數位技能也不顯著（0.102，SE 0.075）。
8. **「largely unchanged」對 Table 11**（L720）：第三學期考試從 0.206 降到 0.134，英語從 0.238 降到 0.194。
9. **邊際成本 9 美元**（L733–734）對不上 Table 13：表上每人平均變動成本是 27 美元，全文沒有說 9 美元怎麼算。
10. **Table 13 加總**：固定成本四項相加是 13,700，表列 13,740；四季版相加 31,700，表列 31,740。註 9 說教材開發在全年版占固定成本 80%（L745），用表上數字算是 27,900／31,740＝88%。
11. **Idia College「219 of 657, or 33% of the sample」**（L703–704）：657 是分派到實驗組的人數，不是全樣本；Table 1 的 School D 占分析樣本實驗組 24.2%、對照組 34.7%。
12. **表註的錯置**：Table 3 的註是 Table 2 的註原樣照貼（說欄 2 是 IRT、欄 3 是第三學期考試，實際是數位與 AI）；Table 5 的註說「Model 6」是第三學期考試，實際是欄 3；Table 2–8 的註都指向「Section 4.1」說明評量，實際在 2.3 節。Table 6 與 Table 7 標題相同。
13. **觀察數對不起來**：Table 11 的 N 是 700（第三學期考試 858），比主迴歸的 654 與 636 多；Table 9 的 N=712 比分派到實驗組的 657 人多。原文都沒有說明。
14. 一處筆誤：L896「leveraged third key mechanisms」應為 three。

## 與清單『要撐的結論』不合的地方

清單寫：「低資源環境的正向結果；對照組沒有課後活動」。

- **兩半都撐得住**。正向結果：英語 0.238 SD、學校考試 0.206 SD（Table 2、3）。對照組：L406–408 明寫沒有任何介入。
- 但只寫這兩半會漏掉幾件會改變怎麼引用的事：
  1. 最常被引的 0.31 是含 AI 知識與數位技能的總分；英語是 0.238，校方考試是 0.206，校正流失後校方考試剩 0.134。
  2. 這不是「學生自己用 AI」：兩人一台電腦、老師全程在場、起始提示詞由研究團隊寫好、內容對齊課綱。作者自己說效果來自整套介入，也自己把它歸成 computer-assisted instruction。
  3. 「對照組沒有課後活動」之外還有：部分對照組學生混進了課後課、完測率兩組差 14 個百分點（64.2% 對 50.2%，我算的）、兩組的學校組成不平衡。
  4. 效果不是平均分布：成績好、社經地位高的受益較多；性別規格下男生的估計值是 −0.039（不顯著）。
  5. 全部是課程一結束就測的結果，沒有延後測驗；「相當於 1.5 到 2 年學校教育」是換算，不是量到的。
  6. 這是工作論文，而且存檔是 2025 年 12 月的更新版。
- 清單沒有寫但文章若要用的話要避開的：「一學年可得 1.2–2.2 SD」是六週資料的直線外推。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | L1–450 | 封面、摘要頁、標題頁、1 導言、2.1 介入、2.2 樣本與隨機分派、2.3 開頭；註 1–8 |
| 2 | L450–899 | 2.3 依變項、3.1 模型與主要結果、3.2 異質性、3.3 劑量、3.4 穩健性、4.1 成本效益、4.2 未來研究、4.3 政策意涵前半；註 9–15 |
| 3 | L899–1721 | 4.3 後半、註 16–18；參考文獻 L968–1196（掃過）；Table 1–14（L1202–1651）；Figure 1–8 圖說；附錄 A 圖說（L1701–1716） |
| 對表 | PDF p.29–41 | Table 1–13 逐格對過版面，與文字檔相符（Table 14 是時程表，只讀文字檔） |
| 看圖 | PDF p.43–49 | Figure 1–3（分數分布）、Figure 4（劑量反應）、Figure 5（出席天數分布）、Figure 6–7（抽籤資格與基線成績）、Figure 8（學校位置圖）、Figure 9–10（照片）、Figure 11（學生手冊範例，含起始提示詞全文） |

全文讀完，沒有缺節。沒有線上補充材料；reproducibility package 沒有打開。
