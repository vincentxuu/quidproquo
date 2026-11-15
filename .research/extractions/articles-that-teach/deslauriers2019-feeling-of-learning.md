# 抽取紀錄：Deslauriers 等 2019〈Measuring actual learning versus feeling of learning in response to being actively engaged in the classroom〉

- **書目**：Louis Deslauriers、Logan S. McCarty、Kelly Miller、Kristina Callaghan、Greg Kestin（2019）。Measuring actual learning versus feeling of learning in response to being actively engaged in the classroom. *Proceedings of the National Academy of Sciences*, 116(39), 19251–19257. DOI 10.1073/pnas.1821936116。線上刊出 2019-09-04，紙本期 2019-09-24；收稿 2018-12-24、核可 2019-08-13。作者五人的姓名與單位對 XML 與 PDF 首頁資訊核過：全部在 Harvard University（物理系；McCarty 另掛化學與化學生物系；Miller 在工程與應用科學學院）。清單 C 說作者群「依記憶填的」，核對結果正確。
- **原文檔**：
  - `.research/raw/learning-content/q3-activity/deslauriers2019_PMC6765278.xml`，46 行、88,550 位元組（88,292 字元）。XML 行很長，我用 `python3 -I` 去標籤存成 scratch 逐段文字檔（303 行、49,050 字元）依序讀；下面「L」是那份 scratch 檔的行號，「¶」是 Results and Discussion 節內的段落序。
  - **本次重抓**：主文 PDF `deslauriers2019_PMC6765278.pdf`（7 頁，691,666 位元組）與補充資料 `deslauriers2019_SI_pnas.1821936116.sapp.pdf`（40 頁，36,096,560 位元組），都存回同一目錄。來源是 PMC 開放資料桶 `https://pmc-oa-opendata.s3.amazonaws.com/PMC6765278.1/`（同桶的 JSON 標 `is_pmc_openaccess: true`、授權 CC BY-NC-ND）。PNAS 官網與 Europe PMC 的直連都被 Cloudflare 擋（403）。
  - 清單 C、E 另外列的 `Q4/deslauriers2019-feeling-of-learning.md` 與 `deslauriers2019pnas_PMC6765278.txt` 是同一篇，我沒有另外讀那兩份檔。
- **讀取日期**：2026-10-14
- **版本**：刊出版（PMC6765278）；SI 是出版社版
- **供哪幾篇用**：order 8（8-e、8-a）、order 10（10-g）、order 15（清單 C 15#5）、order 25（清單 E 25#1）
- **利益聲明**：「The authors declare no conflict of interest.」PNAS Direct Submission。原文沒有經費聲明。免 IRB 審查（L60）。

## 研究設計

- **類型**：課堂裡的隨機交叉實驗（個人層級隨機分派，每人兩種教法各上一堂），在兩個學期各做一次；另附訪談、兩個補充迴歸、一個沒有對照組的學期介入。
- **受試者**：Harvard 微積分基礎的入門力學課，程度設定給物理主修（L40）。春季修課 65 人、秋季 92 人，共 157 人；8 人退出或沒做完，**149 人**參與（L60、L68）。多數人考慮主修物理，實際主修的不到三分之一（L41）。學校另有更進階的榮譽班把準備最好的學生吸走（L41）。前測 FCI 約 23–25／30，CLASS 約 73–78%（表 1）。
- **時間點**：15 週學期的第 12 週，連續兩堂課（L60）。課堂長度正文寫 90 分鐘（L40）；SI 封面寫「about 6-8 slides per 60 minutes class」（SI 第 1 頁），兩處不一致。
- **原本的課**：平常就是「interactive lecture」，以板書講述為主，穿插示範、偶爾的互動小考或概念題（L40）。所以實驗組是「主動學習變多」，對照組是「主動成分完全拿掉」，兩組都偏離平常上法（L40、¶16 L110）。
- **分派與交叉**（表 2，對過 PDF 第 3 頁）：

  | 主題 | A 組：教師 A、教室 A | B 組：教師 B、教室 B |
  |---|---|---|
  | 靜力平衡（第一堂） | 主動（實驗） | 被動（對照） |
  | 流體（第二堂） | 被動（對照） | 主動（實驗） |

  學生在實驗前沒上過這兩位教師的課（L68）。兩位教師都受過相同的主動學習訓練，也都有流暢講課的經驗（L68）。
- **教材**：兩組的投影片、紙本講義、書面回饋完全相同（L68–69）。講義有重點、公式、例題，留白讓學生填。
- **被動組**：教師照講義放投影片、解釋、示範、自己解例題，學生聽並跟著填答案；「Emphasis was placed on maximizing the fluency with which the information was delivered.」（L69）
- **主動組**：依 deliberate practice 原則，學生**分小組合作**先解例題，教師在教室走動提問與協助；每題學生試過之後，教師給出與對照組**完全相同**的完整解答（L69）。即使是主動組，約 50% 的課堂時間是教師在每個小組活動後做精簡的回饋小講（¶1 L72）。
- **作者定義的唯一差別**：「The crucial difference between the 2 groups was whether students were told directly how to solve each problem or were asked to try to solve the problems themselves in small groups before being given the solution.」（L69）
- **量了什麼、何時量**：每堂課**結束時立刻**填問卷，接著做 12 題選擇題的學習測驗 TOL（L60、¶1、L77）。沒有延後測驗。TOL 不計入成績，完成問卷與測驗有參與分數（L60、L77）。TOL 由另一位作者只依學習目標清單出題，出題者看不到教材，授課教師看不到題目（L68）。
- **問卷**（5 點量表，1 非常不同意、5 非常同意；題目原文見 SI 第 22–23 頁）：
  - Q1「I enjoyed this lecture on Static Equilibrium」
  - Q2「I feel like I learned a great deal from this lecture」（作者稱為 primary FOL item）
  - Q3「The instructor was very effective at teaching the material」
  - Q4「I wish all my physics courses were taught in the same way as this lecture」
  - Q5「This lecture mostly involved me as a listener while the instructor presented the information」（操弄檢核）
  - **作者把 Q1–Q4 四題合稱 FOL**（¶1 L72「The students then assessed their own FOL by rating their level of agreement with 4 additional statements」；圖 1 列出的四題就是 Q1–Q4）。所以複合 FOL 分數含「喜不喜歡」「教師教得好不好」「希望以後都這樣上」，不只是自評學了多少。
- **分析**：固定效果線性迴歸，學生層級；控制主題、學期、教師、CLASS、FCI、前兩次期中平均、性別（表 3）。模型 1 的 FOL 是四題依主成分分析加權的複合分數（¶4 L84）。

## 結果（逐項）

### 表 1：隨機分組的平衡（PDF 第 2 頁對過，與 XML 相同）

| 學期 | 指標 | A 組 平均（SD） | B 組 平均（SD） | t | df | p |
|---|---|---|---|---|---|---|
| 春（修課 65） | FCI 前測（0–30） | 23.3（6.57） | 24.8（4.35） | −0.96 | 49 | 0.34 |
| 春 | CLASS 前測（%） | 75.7（10.04） | 73.4（11.93） | 0.82 | 58 | 0.41 |
| 春 | 前兩次期中平均（%） | 77.9（13.4） | 78.1（14.4） | −0.07 | 63 | 0.94 |
| 秋（修課 92） | FCI 前測 | 23.6（4.19） | 24.6（3.40） | −1.05 | 70 | 0.30 |
| 秋 | CLASS 前測 | 77.7（9.84） | 75.5（14.04） | 0.75 | 78 | 0.46 |
| 秋 | 前兩次期中平均 | 70.5（13.0） | 72.02（13.9） | −0.54 | 84 | 0.59 |

表註：「Some study participants did not have pretest data; all 149 participants had midterm scores.」期中成績的 df 是 63 與 84；若是一般兩樣本 t 檢定，對應 65 + 86 = 151 人，與 149 不合。原文沒說用哪種 t 檢定，我無法判定是哪邊的問題，照實記。

### 表 3：主要結果（PDF 第 4 頁對過，與 XML 相同）

標準化係數；***P < 0.001，**P < 0.01，*P < 0.05。

| 迴歸參數 | 模型 1：FOL（z 分數） | 模型 2：TOL（z 分數） |
|---|---|---|
| Constant | 0.34 | −0.46 |
| Passive (0) versus active (1)（主要結果） | −0.56*** | 0.46*** |
| Topic（fluids = 0；statics = 1） | 0.44** | 0.44*** |
| Semester（spring = 0；fall = 1） | −0.37* | −0.29* |
| Instructor（A = 0；B = 1） | −0.03 | −0.12 |
| CLASS pretest（z） | 0.01 | 0.00 |
| FCI pretest（z） | −0.07 | 0.25*** |
| 前兩次期中平均（z） | −0.20* | 0.26*** |
| Gender（female = 0；male = 1） | −0.05 | 0.33* |
| R² | 0.17 | 0.39 |
| RMSE | 0.97 | 0.77 |

表註：OLS 或穩健標準誤結果相同；FOL 與 TOL 原始分數是兩個主題合併後才標準化。

| # | 結果 | 數字與對照條件 | 位置 | 原文 |
|---|---|---|---|---|
| 1 | 自覺學習（四題複合 FOL） | 主動組比被動組**低 0.56 SD**，P < 0.001；穩健標準誤 0.13（SI 第 40 頁） | ¶4 L84；表 3；SI §7 | 「The students in active classrooms reported more than half an SD (0.56) lower FOL compared with those in passive lectures.」 |
| 2 | 實際測驗（TOL，12 題選擇題，課後立刻考） | 主動組比被動組**高 0.46 SD**，P < 0.001；穩健標準誤 0.10 | ¶4 L84；表 3；SI §7 | 「students in active classrooms scored almost half an SD (0.46) higher on the examination.」 |
| 3 | 只用 Q2 單題取代複合分數 | 「virtually identical」，沒有給數字 | ¶4 L84 | 「The entire analysis is virtually identical if the primary FOL question 2 is used alone in place of this composite variable.」 |
| 4 | 加入每位學生的類別變項（自己當自己的對照） | 無實質改變，沒有給數字 | ¶4 L84 | 「we find no meaningful change using these additional covariates.」 |
| 5 | 拿掉所有學生層級共變項 | 點估計變動小於半個標準誤 | ¶4 L84 | 「the point estimates of the effects of active learning also show no meaningful change (less than half the SE).」 |
| 6 | 操弄檢核 Q5（我主要是聽眾） | 被動 3.9 對 主動 2.9，P < 0.001。SI 第 39 頁的圖分主題畫：靜力約 3.9 對 2.8、流體約 3.85 對 2.95（目測） | ¶1 L72 | 「the students in the passive lecture agreed more strongly (mean = 3.9) than those in the active classroom (mean = 2.9, P < 0.001).」 |
| 7 | 其他共變項：主題 | 靜力的 FOL 與 TOL 都比流體高 0.44 SD | 表 3 | — |
| 8 | 其他共變項：教師 | 不顯著（−0.03、−0.12） | 表 3 | — |
| 9 | 其他共變項：期中成績 | 期中越高，FOL 越**低**（−0.20*），TOL 越高（0.26***） | 表 3 | 正文沒有討論這個係數 |
| 10 | 其他共變項：性別 | 男性 TOL 高 0.33 SD（*），FOL 無差（−0.05）。正文沒有討論 | 表 3 | — |
| 11 | 同儕效應的敏感度分析 | 假設主動教室裡有係數 1.0 的同儕效應（作者稱 absurdly large），FOL 的標準誤由 0.13 變 0.15、TOL 由 0.10 變 0.13，仍 p < 0.001 | SI §7（第 40 頁）；¶5 L104 | 「The results of our study are robust even in the presence of large unobserved peer effects.」 |

### 圖 1、圖 2（PDF 第 3、4 頁；圖上沒有印數值，以下全部是目測）

左軸是 TOL 得分比例（0–1），右軸是同意程度（1–5）；誤差線是 1 SE。

| 項目 | 靜力：被動／主動 | 流體：被動／主動 |
|---|---|---|
| TOL（答對比例） | 約 0.64／0.73 | 約 0.57／0.66 |
| Q1 喜歡這堂課 | 約 4.1／3.8 | 約 4.0／3.4 |
| Q2 覺得學到很多 | 約 3.7／3.25 | 約 3.8／3.45 |
| Q3 教師教得有效 | 約 4.45／3.95 | 約 3.75／3.4 |
| Q4 希望物理課都這樣上 | 約 3.6／3.0 | 約 3.2／2.65 |

- 依目測，兩個主題的 TOL 差距都約 9 個百分點（12 題裡約 1 題）。原文沒有報告原始分數的平均與差值，這個換算是我從圖讀的，**不能當原文數字引用**。
- 主動組的 Q2 仍在中點 3 以上（摘要：「their perception of learning, while positive, was lower」）。Q4 在流體主題的主動組低於 3。
- 作者對兩張圖的三點歸納（¶3 L78）：「1) All of the FOL responses show a consistent student preference for the passive lecture environment. 2) Scores on the TOL, by contrast, are significantly higher in the active classroom. 3) These trends are similar for both the statics and fluids topics.」

### 為什麼會這樣：作者的三個因素與各自的證據

| # | 內容 | 數字 | 位置 | 原文 |
|---|---|---|---|---|
| 12 | 訪談：17 人，一對一結構式，兩學期都有，作者稱在 CLASS、FCI、期末成績上有代表性 | 15／17 覺得主動課「disjointed and lacking in flow」；活動與回饋之間頻繁打斷 14 則；擔心課堂上的錯誤沒被糾正 10 則；挫折與困惑 14 則；**沒有人**把分組當成問題；除 1 人外都覺得被動講課較愉快、較好跟 | ¶8 L107 | 「most students (15 of 17) found the instruction in the active classrooms disjointed and lacking in flow when compared with the more fluent passive lecture.」 |
| 13 | 訪談末：看過研究結果後 | 14／17 說會影響自己的讀書方式 | ¶8 L107 | 「14 out of 17 students said that it would.」 |
| 14 | 補充迴歸一：用「教師教得有效」（Q3）預測 Q2 | 覺得教師高度流暢者 Q2 高 0.51 SD，P < 0.001；**放進這一項之後，教法（主動對被動）不再顯著** | ¶9 L108 | 「Notably, the type of instruction (active vs. passive) was not significant in predicting FOL; only the perceived fluency of the instructor was relevant.」 |
| 15 | 把 Q3 當成「流暢度」的依據是另一批訪談（人數沒寫） | 學生把這題理解為解釋清楚、組織、流暢；也說得出「教師很有效但我沒學到多少」的情境 | ¶9 L108 | 「These interviews revealed that students interpret this question primarily as 1) clarity of explanations, 2) organization of presentation, and 3) smooth flow of instruction.」 |
| 16 | 補充迴歸二：在模型 2 加 FCI × Q2 交互作用 | 正向，「moderately significant (P < 0.05)」，沒有給係數 | ¶10 L109 | 「students with more prior expertise had a stronger (more positive) correlation between FOL and actual performance on the test.」 |
| 17 | 第三因素（不熟悉高強度主動學習）| 沒有直接資料；作者用兩個論證排除「只是新奇」：兩組都偏離平常上法；一對一家教的思想實驗 | ¶11 L110 | 「It is unlikely that the sheer novelty of student-centered active learning alone can account for students' negative response」 |

### 學期介入（沒有對照組）

| # | 內容 | 數字 | 位置 | 原文 |
|---|---|---|---|---|
| 18 | 在本研究結束後的下一個學期（SI 第 37 頁），同樣教法的物理課，學期初教師做 20 分鐘簡報（主動學習的證據、流暢感與 FOL 會誤導、本研究的結果），之後 10 分鐘問答（SI 第 39 頁） | 學期末問卷：「over 65%」自陳對主動學習效果的感受顯著改善；75% 自陳學期初的介入讓他們較能接受 | ¶12 L111 | 「over 65% of students reported on a survey that their feelings about the effectiveness of active learning significantly improved over the course of the semester. A similar proportion (75%) of students reported that the intervention at the beginning of the semester helped」 |

沒有對照班、沒有人數、沒有學習成果，全是學期末的自陳回顧。摘要與 Significance 稱之為「a successful example of such an intervention」。SI 簡報的第一張投影片另有一筆歷史對照（2014–15 主動學習年期末考 82.4 ± 0.8，N = 160；2013–14 傳統講課年 73.8 ± 1.1，N = 147；標「Learning Gain: 33%」，SI 第 33 頁）。那是給學生看的說服材料，不是本文的結果，33% 怎麼算的也沒寫。

## 作者自己列的限制

**原文沒有 Limitations 節**，也沒有任何一段以限制為題。作者自己提到、可視為限制的只有：

1. 學生程度好；作者把它轉成推廣的理由：程度較差的學生落差應該**更大**（¶15 L114「it is reasonable to expect that students who are less well prepared than those in our study would show even larger discrepancies」）。這是推測，沒有資料。
2. 學生沒有完全以學生為中心的課堂經驗（¶11 L110、¶16 L115）。
3. 同儕效應的非線性交互作用是「remaining concern」，用錄影與 SI 的敏感度分析回應（¶5 L104）。
4. 前人研究沒有量過不經教師宣導的學生反應，本研究的教師刻意不說服學生（摘要 L28；L36）。

作者沒有提、但會影響怎麼引用的事（我的觀察，不是原文的話）：

- **只有立即測驗**，沒有保留或延後測驗；每種教法只上一堂課。
- **單一學校、單一科目、兩位教師、12 題選擇題**。作者在結尾卻主張可推廣到其他學科與族群（¶15 L114；¶16 L115「we expect that these results are likely to generalize to a variety of college-level subjects」），依據是認知原理不限於物理，不是資料。
- **主動組同時改變了三件事**：先自己試、小組合作、教師巡堂協助。原文把差別描述成「先試再給解答 對 直接給解答」，但小組與教師互動也只有主動組有。
- **「FOL」四題裡有三題不是自評學習量**。0.56 SD 是複合分數；單題 Q2 的係數沒有印出來。
- **補充迴歸一是用同一份問卷的一題預測另一題**（Q3 預測 Q2），而 Q3 本身就是複合 FOL 的成分；兩題同時作答，方向無法判定。
- 「認知努力」沒有被測量（見下節第 1 點）。

## 與摘要說法不一致的地方

1. **Significance 說「We show that this negative correlation is caused in part by the increased cognitive effort required during active learning.」** 內文沒有量認知努力，也沒有操弄它。支撐的是 17 人訪談、Q3 預測 Q2 的迴歸、一個 P < 0.05 的交互作用。內文自己的用詞是「some evidence suggesting」（¶6 L105）、「it is likely that」（¶12 L111）、「could explain」（¶10 L109）。「show … is caused」超出內文。
2. **「negative correlation／anticorrelated」**（Significance；¶6 L105；¶16 L115）：內文報告的是兩個條件的**平均數反向**（FOL 低、TOL 高），沒有報告學生之間 FOL 與 TOL 的相關係數。唯一的個人層級資訊是交互作用（先備知識越高，FOL 與 TOL 的相關越正），主效果的方向與大小沒寫。把它寫成「越覺得學到的人學得越少」原文撐不住；撐得住的是「被分到主動課的那一堂，平均自評較低、平均成績較高」。
3. **摘要「Both groups received identical class content and handouts」**：講義與解答相同屬實；但主動組約一半時間在小組解題，教師的口頭講解量不同。「the exact same information from the handouts and the instructor」（L69）說的是書面內容與解答。
4. **Significance「a successful example of such an intervention」**：內文是無對照的自陳，65% 與 75%（第 18 項）。
5. 題目用詞不一：¶1 引 Q2 為「…from this class」，¶9、¶10 引為「…from this lecture」，SI 問卷是 lecture；¶9 引 Q3 為「The instructor was effective at teaching」，SI 是「very effective at teaching the material」。
6. 課堂長度 90 分鐘（正文）對 60 分鐘（SI 封面）。
7. 摘要「their perception of learning, while positive, was lower」：依圖 Q2 屬實；Q4 在流體主題的主動組低於中點（目測）。
8. 正文 ¶4 引 FCI 時標文獻 34、CLASS 標文獻 7（L83），方法節引 FCI 為文獻 32（L41）。文獻 34 是 Gire 等的 CLASS 研究，應為筆誤。

## 與清單『要撐的結論』不合的地方

- **8-e「學得多的那一組自覺學得少」**：撐得住，數字是 TOL +0.46 SD、FOL −0.56 SD。要連著寫的條件：同一批人交叉、各一堂課、課後立刻測、Harvard 入門力學 149 人；「自覺」是四題複合分數（含喜歡、教師有效、希望都這樣上）；主動組的自評仍高於中點。「組」的說法要小心：這是交叉設計，每個學生兩種都上過，不是兩群不同的人。
- **8-a 的「單一隨機實驗」**：可以當一個教材相同的隨機實驗例子，效果 0.46 SD。但它不能代表「主動對講述」的一般效果量：單堂課、立即測驗，而且主動組含小組與教師巡堂。清單 8-a 的「約半個標準差」是 Freeman 的數字，兩者只是數值接近，不要寫成互相印證。
- **10-g「學習者的感受與實際學習不一致」**：條件平均的層次撐得住。個人層次（同一個人的感受準不準）原文只有一個交互作用，不能寫成「感受與學習負相關」。
- **清單 C 15#5「感覺學得多不等於學得多：主動學習組自評低 0.56 個標準差，測驗高 0.46」**：數字正確（表 3）。「自評」要註明是四題複合。
- **清單 E 25#1「感受與實際學習可以反向；流暢被當成學到」**：前半撐得住。後半「流暢被當成學到」是作者的解釋，直接證據是：Q3（教師教得有效）每高一級距 Q2 高 0.51 SD 且教法不再顯著、17 人訪談、被動組教師被要求把流暢度做到最大。原文沒有獨立測量流暢度，是用訪談把 Q3 詮釋成流暢度。文章要寫成「作者認為」並交代這個代理指標；流暢度的實驗證據在作者引用的 Carpenter 等 2013（文獻 30），那一篇我沒讀。
- **清單 E 第 83 行**：確認。本文只在結尾引 Uttl 2017 與 Kornell & Hausman 2016 支持「教學評鑑要小心用」（¶16 L115），沒有轉述任何數字。
- **對這個系列（一個人讀文章）的適用性**：本文的主動條件是有同儕、有教師的課堂小組解題，沒有任何「獨自閱讀」的條件。能借用的只有「先試再看解答的人，當下覺得比較沒學到」這個方向，而且是從課堂推到閱讀的外推，要標明。
- **SI 讀過之後的補充**：清單 E 註明「SI 附錄沒讀」。SI 裡會影響正文的只有三處：問卷五題的原文（確認複合 FOL 的組成）、§7 的標準誤（0.13、0.10）、簡報是在研究結束後的下一學期做的。其餘是兩堂課的投影片與兩份 12 題測驗。

## 讀取紀錄

主文（scratch 逐段文字檔，L1–303 依序一次讀完）：

| 順序 | 範圍 | 內容 |
|---|---|---|
| 1 | L1–33 | 期刊資訊、標題、作者與單位、編輯與作者貢獻註、日期與授權、Significance、摘要、關鍵詞 |
| 2 | L34–37 | 引言三段 |
| 3 | L38–69 | Materials and Methods（含表 1、表 2） |
| 4 | L70–115 | Results and Discussion 全部 16 段（含圖 1、圖 2 圖說與表 3） |
| 5 | L116–129 | 補充資料標示、致謝、利益聲明、Direct Submission 註 |
| 6 | L130–303 | 參考文獻 45 條（掃過，用來核對文中編號） |

對過 PDF 版面：表 1（PDF 第 2 頁）、表 2 與圖 1（第 3 頁）、圖 2 與表 3（第 4 頁）。PDF 第 1、5–7 頁沒有另外看版面，內容以 XML 為準（這幾頁沒有表或圖）。

補充資料（SI，40 頁；`pdftotext` 不帶 `-layout` 的輸出 1,630 行，依序讀完 L1–1630）：

| SI 節 | 頁 | 內容 | 讀法 |
|---|---|---|---|
| 目錄 | 1 | 七節清單 | 文字 |
| 1 | 2–9 | 靜力平衡投影片與活動 1A–5 | 文字（題目附圖沒有看） |
| 2 | 10–21 | 流體投影片與活動 1–5 | 文字（公式與圖在文字層大半破損，沒有逐張看版面） |
| 3 | 22–23 | FOL 問卷五題 | 文字 |
| 4 | 23–28 | 靜力 TOL 12 題 | 文字（附圖沒有看） |
| 5 | 29–32 | 流體 TOL 12 題 | 文字（附圖沒有看） |
| 6 | 33–39 | 學期初 20 分鐘簡報的七張投影片與說明 | 逐頁看 PDF 版面 |
| 7 | 40 | 同儕效應的統計模型 | 文字 |

SI 第 1、2、4、5 節是教材與考題，沒有研究結果；我讀了全部文字，沒有驗算題目。
