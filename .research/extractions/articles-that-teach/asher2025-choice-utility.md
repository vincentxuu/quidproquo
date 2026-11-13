# 抽取紀錄：Asher & Harackiewicz 2025，Journal of Educational Psychology 117(4), 647–662

- **書目**：Michael W. Asher（Human Computer Interaction Institute, Carnegie Mellon University）、Judith M. Harackiewicz（Department of Psychology, University of Wisconsin-Madison）. Using Choice and Utility Value to Promote Interest: Stimulating Situational Interest in a Lesson and Fostering the Development of Interest in Statistics. *Journal of Educational Psychology*, 117(4), 647–662. doi: 10.1037/edu0000921。作者與單位對過 PMC 頁首（L50–76）。PMC 頁寫「Published in final edited form as: J Educ Psychol. 2024 Nov 11;117(4):647–662」「Issue date 2025 May」（L48、L78）：線上刊出 2024-11-11，卷期 2025 年 5 月。
- **原文檔**：`.research/raw/learning-content/q1-learner/patall2025_PMC12490784.txt`（1,318 行、100,872 字元、101,485 位元組；同目錄 `.html` 是來源）。檔名的 patall 是下載時取錯的代稱，與 Patall 無關。
- **版本**：PMC 作者稿（NIHMS2056968，PMC12490784），不是期刊排版版。
- **另外取得的作者公開資料**（作者的 OSF 專案 https://osf.io/hnptv ，正文 L632、L1117 指向它）：
  - `q1-learner/asher2025_osf_meta_analysis_results.csv`（https://osf.io/download/cs42j/ ）：統合迴歸輸出，與 Table 5 逐格相同，另含正文沒列的「Reflection」各列。
  - `q1-learner/asher2025_osf_results_studies_1-7.csv`（https://osf.io/download/8b6s3/ ，正文 L618 指向這個檔）：七個實驗各自的迴歸係數。
- **沒取得**：PMC 的補充資料 `NIHMS2056968-supplement-supplement.docx`（2.9 MB）。PMC 的檔案下載要先過瀏覽器端的運算驗證，curl 拿到的是「Preparing to download」頁；Europe PMC 回 403；Wayback 沒有存檔；OSF 專案裡沒有這個檔。正文交代放在補充資料的東西（課程細節、所有題目原文、各研究的描述統計與相關矩陣、「結合式」用途操弄的全部分析、事後檢定力分析的假設與程式）**沒有讀到**。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 14（清單 C 的 14#1）

## 研究設計

- **類型**：七個實驗室實驗（各自獨立樣本、同一套流程）的內部統合分析（internal meta-analysis）。正文明說不逐一報告各實驗：「Rather than reporting each study separately, we meta-analyze the studies」（L180）。所以清單上寫的「七個實驗各自的方法與結果沒讀」其實是原文正文就沒有逐一報告結果，只有 L508–535 的各研究設計與「初步結果」敘述；各實驗的係數只在 OSF 的 csv。
- **受試者**（L186、Table 1 L188–300）：University of Wisconsin-Madison 修普通心理學的大學部學生，拿課程學分；合計 N = 2,019；女性 59.1%（Table 1 的 All 列印 59.2）、白人 74.2%、亞裔 20.8%、西語裔 8%、黑人 3.6%；84% 是大一，平均 18.7 歲。各研究人數：S1 115（2020 春）、S2 256（2020 秋）、S3 100（2021 春）、S4 673（2021 秋）、S5 171（2022 春）、S6 377（2022 秋）、S7 327（2022 秋）。S2、S3 因疫情用視訊進行，其餘到場（L306）。
- **教材**：一段錄好的多元迴歸教學影片（一個連續預測變項加一個二分預測變項，教怎麼讀迴歸軟體輸出），所有人都看（L174、L308）。課程細節在補充資料，沒讀到；正文沒有寫影片長度，只在討論提到索取資料發生在 3 分鐘訊息的「20 minutes later」（L1075）。
- **流程**（L308–315、Figure 2）：基線問卷（數學信心、統計興趣）→ 操弄 → 迴歸課影片 → 問卷（對這堂課的被觸發情境興趣 TSI、對迴歸的被維持情境興趣 MSI、分心、知覺用途、自主感）→ 問要不要索取校內統計資源（要留電子郵件）→ 12 分鐘限時迴歸測驗（1–21 分，按評分規準）。
- **兩個主要操弄**：
  1. **直接告知用途（D-UV）**（L508）：上課前一段約 3 分鐘影片，講者說明線性迴歸在醫學（評估治療、找病因）、政治（預測選民行為）、心理學（回答人類行為成因）的用途。對照組看一段 3 分鐘的迴歸歷史影片。講的是職涯用途，作者自己在討論也這樣稱呼：「discussing the career-based usefulness of linear regression」（L1071）。
  2. **給選擇**（L514–521、Figure 3）：上課前從三支迴歸課影片裡挑一支，三支用不同的資料集與研究問題，但「all contained the same regression content in the same sequence」。對照用配對（yoked）設計：每個選擇組的人配一個不能選的人，前者選什麼、後者就被指派看什麼。
- **其他操弄**：S2 交叉了「歸因重構」訊息（L510）；S5 加了「知覺選擇」條件（只能在兩支裡選，其中一支是預試過多數人不想看的材料科學版，L525）；S6、S7 加了「結合式」用途操弄（課後看三句大學生談迴歸用途的引言，選一句、說為什麼、再寫迴歸對自己的用處，L531–535），這部分的分析全在補充資料。
- **量了什麼**（Table 2 L321–378）：基線數學信心（3 題，α .86–.92）、基線統計興趣（3 題，α .86–.95）、分心（3 題，α .79–.86）、迴歸的知覺用途（4 題，α .79–.86）、TSI（S1–6 兩題、S7 六題，α .72–.92）、MSI（3 題，α .80–.89）、自主感（S3–6 四題、S7 六題，α .69–.86；S1、S2 沒量）、是否索取資源（二分）、測驗成績。全部在同一次實驗內量，沒有追蹤。
- **分析**（L537–628）：第一階段每個研究各跑一個共同模型（Table 4；連續結果用一般線性模型、索取資源用邏輯斯迴歸；條件對比與基線信心、基線興趣交互）；連續依變項用排除操弄效果後的殘差標準差標準化，所以係數可讀成標準化平均差。第二階段用 metafor 做混合效果統合迴歸。調節分析（D-UV × 興趣、D-UV × 信心）用 S1–S6；D-UV × 選擇只用 S3、S4（合計 N = 773，L1007）。
- **預註冊**（L632）：S2、S4 與統合分析程序有預註冊；S1、S3、S5–7 沒有。S6、S7 在這次統合之前沒有單獨分析過（L535）。

## 結果（逐項）

Table 5（L638–956）是統合迴歸的結果，數字與作者 OSF 的 `meta_analysis_results.csv` 逐格對過，完全相同。d 為標準化平均差；「索取資源」那一區的 d 欄其實是對數勝算（正文換算成 OR）。

### 主效果（對照組＝沒有該操弄）

| # | 結果變項 | 直接告知用途 vs 對照 | 給選擇 vs 對照 | 選擇 vs 告知用途（兩者差） | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 迴歸的知覺用途 | d = 0.41，se 0.07，p < .001 | d = 0.09，se 0.07，p = .239（不顯著） | −0.33，p < .001 | Table 5 L660–682；L979 | 「the directly-communicated utility value manipulation had a strong, positive effect on participants' beliefs about the usefulness of regression, increasing reported beliefs by over .4 standard deviations relative to control, d = 0.41, p < .001.」 |
| 2 | 自主感 | d = 0.12，p = .079（不顯著） | d = 0.92，se 0.06，p < .001 | 0.81，p < .001 | L702–724；L983 | 「increasing perceived autonomy by more than .9 standard deviations relative to control, d = 0.92, p < .001.」 |
| 3 | 對這堂課的被觸發情境興趣（TSI） | d = 0.08，p = .094（不顯著） | d = 0.24，se 0.05，p < .001 | 0.16，p = .043 | L744–766；L987 | 「The choice manipulation increased triggered situational interest by .24 standard deviations relative to control, p < .001, and this effect size was significantly stronger than that of the directly-communicated utility value manipulation, p = .043.」 |
| 4 | 自陳分心 | d = 0.01，p = .881（不顯著） | d = −0.15，se 0.06，p = .017 | −0.16，p = .055（不顯著） | L786–808；L991 | 「The choice manipulation decreased distraction by .15 standard deviations relative to control, d = −0.15, p = .017.」 |
| 5 | 對迴歸的被維持情境興趣（MSI） | d = 0.15，se 0.04，p < .001 | d = 0.16，se 0.04，p < .001 | 0.01，p = .881（不顯著） | L828–850；L995 | 「These two effect sizes did not significantly differ, p = .881.」 |
| 6 | 索取統計資源（行為） | 對數勝算 0.30，se 0.15，p = .042；OR = 1.35；39.2% 對 33.2% | 0.02，p = .885；OR = 1.02（不顯著） | −0.28，p = .134（**不顯著**） | L870–892；L999 | 「Overall, 39.2% of participants in directly-communicated utility value conditions requested resources versus 33.2% of those in control conditions. In contrast, the choice manipulation had no influence on this outcome, OR = 1.02, p = .885. The difference between the odds ratios for the two manipulations was not significant, p = .134.」 |
| 7 | 課後測驗成績 | d = 0.03，se 0.05，p = .463（不顯著） | d = 0.04，se 0.05，p = .458（不顯著） | 0.00，p = .967 | L912–934；L1003 | 「Relative to control, there was no significant effect of the directly-communicated utility value manipulation on performance, d = 0.03, p = .463, nor was there an effect of the choice manipulation, d = 0.04, p = .458.」 |

### 調節：直接告知用途 × 基線興趣、× 基線信心（S1–S6）

| # | 結果變項 | × 興趣 | × 信心 | 行號 |
|---|---|---|---|---|
| 8 | 知覺用途 | −0.06，p = .474 | 0.02，p = .764 | L690–700；L979「ps ≥ .474」 |
| 9 | 自主感 | −0.03，p = .813 | 0.06，p = .376 | L732–742 |
| 10 | TSI | −0.09，p = .125 | 0.02，p = .716 | L774–784 |
| 11 | **分心** | −0.07，p = .231 | **0.17，se 0.06，p = .006（顯著）** | L816–826 |
| 12 | MSI | −0.08，p = .082（不顯著，方向為負） | 0.04，p = .371 | L858–868；L995 |
| 13 | 索取資源 | 0.04，p = .824 | 0.01，p = .962 | L900–910；L999 |
| 14 | 成績 | −0.01，p = .908 | −0.04，p = .523 | L942–952；L1003 |

- 第 11 列是全部 14 個調節檢定裡唯一顯著的一個。**表與正文對不起來**（見下方「內部不一致」）：Table 5 與 OSF csv 都把 0.17（p = .006）放在「D-UV × Confidence」，正文 L991 卻寫成與「baseline interest in statistics」的交互。照表與 csv 讀：信心越高的人，被告知用途後自陳分心越多；信心越低的人越少。照正文那句的方向描述（「decreased distraction for participants with lower levels of initial …, but it also increased distraction for those with higher levels」）也是同一個方向，只是變項名稱寫的是興趣。
- 第 12 列作者的解讀：「suggests that the manipulation may have been more effective at promoting maintained situational interest for participants who entered the session with lower levels of initial interest in statistics」（L995），不顯著，與作者事前預測的方向相反。
- 作者事前的預測（L545）：告知用途可能只對有信心的人有幫助，而且只對原本有興趣的人促進後段興趣發展。兩個都沒有得到支持。
- S2 專門為「告知用途會不會威脅沒信心的人」設計並預註冊，初步結果（L510）：「Contrary to our predictions, we found no evidence that the utility value manipulation threatened or undermined interest, engagement, or performance for less confident participants. Instead, at all levels of confidence (on average), students who received the utility value manipulation indicated stronger beliefs about the usefulness of regression and stronger feelings of maintained situational interest in regression.」

### 兩個操弄的交互（S3、S4，合計 N = 773）

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 15 | D-UV × 選擇，七個結果變項 | 全部不顯著，ps ≥ .382（知覺用途 0.17，p = .561；自主感 0.04，.795；TSI −0.28，se 0.50，.573；分心 0.07，.644；MSI 0.09，.382；索取資源 0.24，.450；成績 −0.05，.695） | Table 5；L1007 | 「For all outcomes, there were no significant interactions between the two manipulations, ps ≥ .382.」 |

### 中介（Table 6，L1013–1067；各研究先用 lavaan 算間接效果再統合）

| # | 路徑 | b | p |
|---|---|---|---|
| 16 | 告知用途 → 知覺用途 → MSI | .16 | < .001 |
| 17 | 告知用途 → 知覺用途 → 索取資源 | .03 | < .001 |
| 18 | 選擇 → 自主感 → MSI | .29 | < .001 |
| 19 | 選擇 → TSI → MSI | .06 | .009 |

Table 6 的表題寫「Indirect Effects of the Manipulations on Triggered Situational and Emerging Individual Interest」，但表內的依變項是被維持情境興趣與索取資源（L1015、L1041–1059）。

### 各研究的「初步結果」（正文敘述，L508–535）

| # | 研究 | 結果 | 行號 |
|---|---|---|---|
| 20 | S1（N = 115，兩格） | 告知用途組覺得迴歸較有用，d = 0.40 | L508 |
| 21 | S2（N = 256，2×2，預註冊） | 見上方引文；沒有發現對沒信心者的威脅 | L510 |
| 22 | S3（N = 100） | 選擇提高自主感 d = 0.66；TSI d = 0.34「although this effect was non-significant」 | L521 |
| 23 | S4（N = 673，預註冊） | 重現選擇對自主感與 TSI 的效果；選擇降低分心、提高 MSI；告知用途提高 MSI 但不提高 TSI；告知用途提高索取資源的可能 | L523 |
| 24 | S5（N = 171） | 「知覺選擇」組與標準選擇組在自主感、TSI、MSI 上都沒有顯著差異；作者推論選擇的效果「may have been driven more by perceived autonomy rather than interest matching」 | L527 |

### OSF 各研究係數（`asher2025_osf_results_studies_1-7.csv`，共同模型；正文沒有印）

索取資源這個行為指標，告知用途的對數勝算逐研究是：S1 0.73（p = .211）、S2 0.12（.646）、S3 −0.38（.403）、S4 0.49（p = .004）、S5 −0.06（.923）、S6 0.68（p = .059；csv 裡是反向編碼的 −0.68）。單獨達到顯著的只有 S4。成績的告知用途係數：S1 0.26（.150）、S2 0.02、S3 −0.05、S4 −0.02、S5 0.15、S6 0.12（反向編碼 −0.12，p = .362），沒有一個顯著。成績上的 D-UV × 信心：S1 0.04、S2 −0.11、S3 −0.03、S4 −0.04、S5 0.16、S6 −0.06（反向編碼 0.06），沒有一個顯著。

兩點要留意：(a) csv 裡 S1 的知覺用途係數是 0.62（p = .001），正文 L508 寫 d = 0.40；csv 是含基線興趣、信心及其交互的共同模型，正文那句沒說用哪個模型，我沒有重跑資料，不確定差在哪。(b) csv 裡 S1、S2 的「Autonomy」列數值與「Utility Value」列完全相同，但 Table 2 寫自主感只在 S3–S7 量；這兩列看來是輸出程式的重複，不能用。

## 作者自己的解釋

1. **告知用途管的是後段、選擇管的是當下**（L1075）：「direct communications about usefulness for important personal goals may do little to trigger situational interest in a learning session (and therefore have small or null effects on situational engagement and learning), but at the same time this type of directly-communicated utility value may be an effective means of promoting maintained situational interest, emerging individual interest, and longer-term engagement with content.」
2. **索取資料不等於真的去修課**（L1075）：「it is unlikely that effects of the directly-communicated utility value manipulation on resource requests translated to differences in participants actually signing up for statistics courses.」
3. **為什麼沒有調節**（L1085）：第一個可能（多數人本來就夠有興趣）作者自己說不太可能，因為 53% 的人基線興趣低於量尺中點 4；作者認為較可能的是檢定力不足：「even when analyzed as a set, Studies 1–7 had less than 30% power to detect condition × interest (or condition × confidence) interactions on continuous outcomes like maintained situational interest.」（事後模擬，細節在補充資料，沒讀到。）
4. **兩個操弄可加成**（L1087）：沒有交互，作者同樣先說可能是檢定力不足，再說概念上兩者各走各的機制。
5. **為什麼成績都沒變**（L1089）：告知用途帶來的是想再接觸的意願，短短一次實驗裡沒有機會再接觸；選擇對 TSI 與分心的效果「d ≤ 0.24, were likely too small to bring about significant indirect effects on performance」。「longer learning session」可能不同，是推測。
6. **與先前研究（Canning & Harackiewicz 2015、Durik 等 2015）不同的原因，作者放在導言**（L152）：先前研究除了 Hecht 等 2021 都用同一個心算乘法情境，「baseline confidence may have emerged as a particularly important moderator in this context because the mental math paradigm teaches participants a skill that requires high levels of mastery to be useful」。這是轉述 Hecht 等的說法，本研究沒有直接檢驗。
7. **不是所有用途都算**（L116）：告訴學生「這會考」屬於外在動機式的用途，「is unlikely to promote interest in the topic, and could even come across as coercive」。這是導言的論述，沒有對應的實驗條件。

## 作者自己列的限制（L1091–1099）

1. 萌發中的個人興趣只用一個二分指標（有沒有索取資源）量。
2. 被觸發情境興趣全靠自陳，沒有行為上的投入指標（例如暫停、倒帶、做筆記、切到別的分頁）。分心也是自陳。
3. 沒有量先備知識，無法檢驗它是否調節。
4. 全是大學生、單一學校；作者說這種「未來導向」的用途對更年輕的學生可能較沒效。
5. （散在討論）檢測調節與交互的檢定力不到 30%（L1085、L1087）。
6. （散在方法）七個研究裡只有兩個預註冊（L632）。

原文沒有說、但影響怎麼引用的：所有結果都在單次實驗內量到，最遠的「事後行為」是課後約 20 分鐘填一個要不要留電子郵件索取資料的選項；受試者是拿學分來做實驗的，看完影片才能走。

## 與摘要說法不一致的地方

1. 摘要（L88）：「only the utility value manipulation led students to request resources about statistics」。正文（L999）：告知用途的 OR = 1.35（p = .042），選擇的 OR = 1.02（不顯著），但**兩者的差不顯著（p = .134）**。「只有告知用途有效」是一個顯著、一個不顯著的對照，不是兩者之間有顯著差異。摘要沒有交代這一點；p = .042 也貼著門檻。
2. 摘要：「only the choice manipulation was effective at promoting self-reported attention and engagement during the session」。分心這一項，選擇對告知用途的差 p = .055（Table 5 L804–808），沒過 .05；討論（L1077）卻寫「These two effects significantly differed from the null effects of the directly-communicated utility value manipulation on the same outcomes」。TSI 的差顯著（p = .043），分心的差不顯著，討論那句對分心不成立。
3. 摘要：「both manipulations independently promoted situational interest in the topic」。相符（MSI 0.15 與 0.16）。
4. 摘要沒有提：成績兩個操弄都沒有效果；沒有發現信心或興趣調節（以及檢定力不到 30%）；唯一顯著的調節是分心。
5. 摘要與標題用「enduring interest」「interest that persists when instruction ends」「extended beyond the session」形容索取資源；實際上是同一次實驗裡、課後約 20 分鐘的一個勾選（L1075）。

### 內部不一致（照實記錄）

- L991：「This manipulation did not interact with participants' baseline interest in math, p = .231, but it did interact with their baseline interest in statistics, b = 0.17, p = .006」。量表沒有「baseline interest in math」（只有數學信心與統計興趣）；Table 5 與 OSF csv 裡 p = .231 是 × 興趣（−0.07），p = .006 是 × 信心（0.17）。這是作者稿的版本，刊出版有沒有更正我沒有查到（刊出版要付費）。引用時以表為準，並註明正文與表不一致。
- L186 寫女性 59.1%，Table 1 的 All 列是 59.2。
- Table 6 表題與內容不符（見上）。
- L521「assigned in control conditions the same number of times as it was chosen in the utility value conditions」：前後文講的是選擇條件，這裡的「utility value conditions」看來是「choice conditions」的筆誤。

## 與清單「要撐的結論」不合的地方

清單原句：「直接告知用途：提高知覺用途（d = 0.41）與事後索取資料的比例，對當場成績沒有效果；給選擇：提高自主感與當下投入，不影響事後行為；信心與興趣都沒有調節。反向／無效（對『直接講用途會傷到沒信心的人』與『講用途能提高成績』而言）」

| 清單說法 | 原文撐不撐得住 | 差在哪 |
|---|---|---|
| 告知用途提高知覺用途 d = 0.41 | 撐得住 | Table 5，p < .001 |
| 告知用途提高事後索取資料的比例 | 撐得住，但很弱 | 39.2% 對 33.2%，OR = 1.35，p = .042；逐研究只有 S4 單獨顯著；「事後」是課後約 20 分鐘、同一次實驗內 |
| 對當場成績沒有效果 | 撐得住 | d = 0.03，p = .463 |
| 給選擇提高自主感與當下投入 | 撐得住 | 自主感 0.92、TSI 0.24、分心 −0.15。清單漏了：選擇也提高對主題的被維持興趣（0.16），而且成績同樣沒變（0.04） |
| 給選擇不影響事後行為 | 要改寫 | 選擇的 OR = 1.02 不顯著是對的，但與告知用途的差不顯著（p = .134），不能寫成「告知用途比選擇更能帶動事後行為」 |
| 信心與興趣都沒有調節 | **要改寫** | 14 個檢定裡有 1 個顯著：分心上的 D-UV × 信心（0.17，p = .006；正文誤植為興趣）。其餘 13 個不顯著。而且作者自己說檢定力不到 30%，這是「沒偵測到」，不是「證明沒有」 |
| 反向於「直接講用途會傷到沒信心的人」 | 部分撐得住 | S2 專為此設計而沒有發現；統合裡成績與興趣上的 × 信心都接近零。但 (a) 檢定力低；(b) 教材從心算技巧換成迴歸概念、用途例子從日常／學業換成職涯，作者自己把差異歸因於任務性質（L152），不是推翻前人；(c) 信心量的是「數學」信心，不是對這個任務的預期 |
| 反向於「講用途能提高成績」 | 撐得住 | 兩個操弄都是零 |

另外，清單把「給選擇」的內容寫成「學統計時挑例子」。原文是從三支用不同資料集的影片裡挑一支看（L514–519），挑的是整堂課的包裝情境，不是在課中挑例題。S5 的結果還指出，選到的東西合不合興趣不是重點，有得選就夠（L527）。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | L1–450 | PMC 頁首、書目、摘要、導言（四階段模型、促進興趣、選擇操弄、用途操弄、現有證據與下一步）、本研究、方法（受試者、Table 1、標準流程、Table 2、Table 3 前半） |
| 2 | L451–930 | Table 3 後半、測量來源、各研究的操弄與初步結果（S1–S7）、分析計畫（四個研究問題、Table 4、兩階段分析）、透明度聲明、Table 5（到成績的 Choice vs. D-UV 之前） |
| 3 | L931–1318 | Table 5 其餘、Figure 4–6 的圖說、結果各小節、D-UV × 選擇、中介與 Table 6、討論、限制與未來方向、結論、教育意涵聲明、致謝；L1119–1246 參考文獻（掃過）；L1248–1318 PMC 頁尾 |
| 對表 | — | Table 5 全表對 `patall2025_PMC12490784.html` 的原始儲存格與作者 OSF 的 `meta_analysis_results.csv`，逐格相同。來源是 PMC 的 HTML，沒有 PDF 版面錯位的問題。Table 1、2、3、4、6 直接讀 HTML 轉出的文字（一格一行，順序沒亂） |

Figure 1–6 是圖檔，文字檔裡只有圖說；Figure 4–6 畫的是 Table 5 的數字，沒有另外看圖。補充資料沒有取得（見檔頭）。
