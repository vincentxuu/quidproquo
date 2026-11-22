# 抽取紀錄：Yeomans & Reich 2017，Planning Prompts Increase and Forecast Course Completion in Massive Open Online Courses

- **書目**：Michael Yeomans（Harvard University）、Justin Reich（Massachusetts Institute of Technology）。2017。Planning Prompts Increase and Forecast Course Completion in Massive Open Online Courses。LAK '17（Learning Analytics & Knowledge 研討會論文集），頁 464–473（頁碼取自 OpenAlex，手上的作者稿沒有印頁碼）。DOI 10.1145/3027385.3027416。作者姓名與單位對過作者稿首頁（L18–22、L70–74）。
- **原文檔（這次重抓的完整版）**：`.research/raw/learning-content/q4-time/yeomans2017-planning-prompts-dspace.pdf`（11 頁＝MIT 封面 1 頁＋正文 10 頁）與同名 `.txt`（不帶 `-layout` 的 `pdftotext`，1,338 行、55,206 位元組）。下面的行號都是這個 `.txt` 的行號。
  - 來源：MIT DSpace 機構典藏 `https://hdl.handle.net/1721.1/137973`。DSpace 現站對 curl 回 429，改取 Wayback 存的同一個檔：`https://web.archive.org/web/20221127090853id_/https://dspace.mit.edu/bitstream/handle/1721.1/137973/planning.pdf`。作者個人網站 `https://www.mikeyeomans.info/papers/planning.pdf` 另有一份 10 頁的同稿（抓下來比對過頁數，沒有另存）。
- **原本清單上的檔**：`q4-time/yeomans2017-planning-prompts.md`（217 行、38,674 位元組）。**確認不完整**：Table 1–4 全缺、Figure 全缺、4.2.1 的主要結果句子被截斷接到下一段（原檔 L118「M=13.8%, 95% CI= [11 We conducted two additional…」）、驗證率結果整段缺、Simple vs Plus 的數字整段缺、grit 的 AUC 缺、5.3.2 截在「z(720)=1.」、「These estimates are not causal」整段缺、致謝與參考文獻缺。舊檔不該再用。
- **版本**：作者最終稿（MIT 封面寫「Author's final manuscript: final author's manuscript post peer review, without publisher's formatting or copy editing」，L12–13）。稿上的版權欄還是 ACM 範本的佔位字（「Conference'10」「DOI: http://dx.doi.org/10.1145/12345.67890」，L58–61），不是刊出版。和 ACM 刊出版有沒有文字差異，沒有對過（刊出版在付費牆後）。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 19（清單 D，19#4）

## 研究設計

- **類型**：自然場域隨機實驗（「natural field experiment」，L30、L95–96），加上對計畫文字的預測建模（探索性）。有預註冊：「Our preregistration describes the methods in Study 2, but was posted before the outcome of Study 1 could be observed」（L239–240）；資料、程式、材料與預註冊分析計畫在 `https://osf.io/mky8n/`（L245–246）。
- **場域**：edX 平台上三門 HarvardX 課程，Business、Chemistry、Political Science（L225–226）；Table 1 的欄名是 Healthcare、Biochemistry、Government（L398–402）。課程 2–3 個月、每章依序開放；成績由測驗、同儕互評作業、自評參與組成（L228–232）。免費，可付 50–100 美元買「verified」證書（L233–235、L273–274）。
- **Study 1 / Study 2**：Study 1＝Business 一門；Study 2＝Chemistry 與 Political Science 兩門（L236–237）。
- **母群與分析樣本**：
  - 三門課共 60,778 人註冊（L338–339）。
  - 事前決定只分析其中一部分（L338–340）。納入規則：填課前問卷填到被分派條件的那一步（不論有沒有真的寫計畫，intent to treat）；自陳書面英文流利；第一個月內註冊（L287–296）。
  - **「打算拿證書」這個條件，3.3 節沒有明寫是納入標準**，但從後文可以確定主要樣本只含打算拿證書的人：穩健性檢查寫「we expand our sample again, to include people who did not intend to complete the course」（L607–608），5.2.3 寫「the students who had signed up in the first month and intended to complete the course」（L927–929）。
  - 主要分析樣本：Study 1 N = 293、Study 2 N = 1,760、合計 N = 2,053（Table 2，L585–591；對過 PDF 第 5 頁）。2,053 ÷ 60,778 ≈ 3.4%（這個百分比是我算的，原文沒寫）。
  - 各條件各多少人，原文**沒有報告**。
- **課前問卷**：每門 HarvardX 課的第一章，選填、不計分（L320–323）。「The majority of enrolled students did not attempt the pre-course survey. However, the vast majority of those students did not complete much else.」（L323–325）
- **意向題**（L302–311）：四選一——只是瀏覽／做一些但不拿證書／做到足以拿證書／還沒決定。57% 選打算拿證書；拿到證書的人裡 83% 當初打算拿；打算拿的人裡只有 16% 拿到（L313–317）。
- **介入**：
  - Study 1：兩個條件，planning 與 control。planning 組多一段提示，請學生描述為了投入課程內容、準時交作業所訂的具體計畫，下面兩個開放文字框。「students were not explicitly encouraged to make extra plans, or told about the benefits of planning」（L356–357）。14% 留白（L360–361）。control 組沒有任何額外材料（L352）。
  - Study 2：三個條件，control、simple-planning、planning-plus（L367）。simple-planning 的提示原文（L373–385）：請寫下學習計畫，例如 (a) 何時何地投入課程內容、(b) 用哪些具體步驟確保完成必修作業、(c) 遇到障礙怎麼應對；文字框數量增加。planning-plus 多兩件事：頁首明講計畫是提高貫徹率的有用策略；寫完後下一頁把學生寫的計畫列成「your plans for this course」，並鼓勵抄下來照著做（L386–393）。
- **量了什麼、何時量**：
  - 預註冊的唯一主要結果：是否拿到證書（成績過門檻，70–80%，依課程而定，且在截止日前達到）（L255–260）。課程結束後才發（L266–268）。
  - 探索性結果：課程期間付費升級 verified。作者明寫是預註冊之後才決定看的：「After pre-registration, we determined that verification rates were an outcome of increasing interest to MOOC stakeholders, and investigated this outcome in an exploratory manner.」（L279–282）
  - 成績分布雙峰：樣本中 49% 成績為零、16% 及格（L268–270）。
- **隨機分派檢查**：「p>0.05 for all balance tests in both studies」（L534–536）。
- **樣本特徵**（Table 1，L397–506，對過 PDF 第 5 頁）：

  | | Healthcare | Biochemistry | Government |
  |---|---|---|---|
  | 年齡，平均（SD） | 36.5 (11.7) | 30.0 (13.5) | 35.0 (14.6) |
  | 女性 | 61.8% | 50.6% | 55.3% |
  | 住在美國 | 31.7% | 42.9% | 51.6% |
  | 國家 HDI | .801 (.147) | .824 (.134) | .847 (.120) |
  | 全職工作 | 64.5% | 34.5% | 49.8% |
  | 兼職工作 | 17.4% | 16.0% | 14.8% |
  | 同時在學 | 22.6% | 49.7% | 33.1% |
  | 學士學位 | 84.3% | 49.9% | 56.0% |
  | 進階學位 | 51.9% | 24.2% | 26.5% |
  | 註冊過的 MOOC 數 | 3.9 (3.9) | 4.3 (4.4) | 4.3 (4.3) |
  | 完成過的 MOOC 數 | 2.6 (3.5) | 2.8 (3.9) | 3.2 (4.0) |
  | 開課前就註冊 | 36.9% | 59.7% | 76.3% |
  | 開課前就買 verified | 3.1% | 1.8% | 4.6% |

  75% 以前註冊過 MOOC（L532–533）。

## 結果（逐項）

### A. 完成率（預註冊的主要結果）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 兩個研究合併的拿證書比例 | 計畫提示組 17.7%（95% CI 15.6%–19.8%）對 控制組 13.8%（95% CI 11.3%–16.3%）；χ²(1) = 5.2，p = .023 | 有計畫提示 對 沒有任何額外材料；樣本是打算拿證書、第一個月註冊、英文流利、填了課前問卷的人（N = 2,053） | 4.2.1 | L510–515 | 「students prompted to write out their plans at the beginning of the course had a higher follow-through rate (M=17.7%, 95% CI=[15.6%, 19.8%]) than those who were not prompted write out their plans (M=13.8%, 95% CI=[11.3%, 16.3%]; 𝛘2(1)=5.2, p=.023).」 |
| 2 | 作者換算的相對增幅 | 29%（相對，不是百分點；17.7 ÷ 13.8 ≈ 1.28，絕對差 3.9 個百分點——後兩個數是我算的） | 同上 | 4.2.1 | L516–518 | 「The results imply that planning prompts increased course completion by 29% compared to the control condition.」 |
| 3 | 作者給的比較基準 | 效果大小相當於「上過並完成一門 MOOC 的人」與「從沒註冊過 MOOC 的人」之間的差 | — | 4.2.1 | L518–521 | 「this effect size is similar to the difference between students who have enrolled in (and completed) one MOOC before, and students who had never enrolled in a MOOC.」 |
| 4 | Table 2 模型 A：只有 Study 1 | 邏輯迴歸係數 0.609（SE 0.353），一顆星；N = 293；沒有課程固定效果；pseudo R² .013 | 計畫 對 控制 | Table 2 | L538–601 | 表列 |
| 5 | Table 2 模型 B：只有 Study 2（兩種計畫提示合併） | 0.252（SE 0.139），一顆星；N = 1,760；有課程固定效果；pseudo R² .008 | 同上 | Table 2 | 同上 | 表列 |
| 6 | Table 2 模型 C：Study 2 兩種提示分開 | Simple Plans 0.190（SE 0.161），**沒有星號**；Plans Plus 0.312（SE 0.158），兩顆星；N = 1,760；pseudo R² .008 | 各自 對 控制 | Table 2 | 同上 | 表列 |
| 7 | Table 2 模型 D：全部合併 | 0.302（SE 0.130），兩顆星；N = 2,053；有課程固定效果；pseudo R² .009 | 計畫 對 控制 | Table 2 | 同上 | 表列 |
| 8 | 穩健性檢查（探索性，數字不在這份稿裡） | 納入晚註冊但仍打算完成的人、再納入不打算完成的人：計畫的效果仍在；意向與註冊時間各有主效果；兩者都不調節計畫效果 | — | 4.2.1 | L603–614 | 「We conducted two additional exploratory robustness checks, reported in the full paper. … (iii) neither of these variables moderated the effect of planning on course completion.」 |

**Table 2 的星號沒有圖例。** 全文找不到 *、**、*** 各代表什麼顯著水準。用係數除以標準誤自己算：模型 A z ≈ 1.73、模型 B z ≈ 1.81、模型 D z ≈ 2.32、Simple Plans z ≈ 1.18、Plans Plus z ≈ 1.97（都是我算的）。照這些 z 值，一顆星對應 p < .10、兩顆星對應 p < .05 的慣例說得通，但這是推斷，原文沒寫。若推斷成立，**Study 1 與 Study 2 各自單獨都沒有達到 p < .05，合併後才達到**；simple-planning 單獨不顯著。

### B. 付費升級 verified（探索性，預註冊之後才加）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 9 | 樣本的 verified 比例 | 課程結束時 6%；其中 3.1% 在註冊時（看到提示前）就買了，2.9% 是課程中升級 | 整個樣本，不分條件 | 3.2.2 | L275–279 | 「By the end of the course, 6% of students in our sample were verified. However, 3.1% verified when they enrolled, before they saw the planning prompts. The other 2.9% upgraded their account during the course」 |
| 10 | 課程中升級的比例 | 計畫提示組 3.6%（95% CI 2.6%–4.6%）對 控制組 1.8%（95% CI 0.8%–2.8%）；χ²(1) = 4.41，p = .036 | 計畫 對 控制 | 4.2.1 Verification Rates | L619–622 | 「upgrades were more common among students who saw a planning prompt (M=3.6%, 95% CI=[2.6%, 4.6%]) than those in the control condition (M=1.8%, 95% CI=[0.8%, 2.8%]; 𝛘2(1)=4.41, p=.036).」 |
| 11 | 加上註冊時就買的，總 verified 比例 | 控制組 4.8%（95% CI 3.3%–6.3%）對 計畫組 6.7%（95% CI 5.4%–8.0%）；χ²(1) = 2.70，**p = .100**。作者說的「40%」是這一組數字（6.7 ÷ 4.8 ≈ 1.40） | 計畫 對 控制 | 同上 | L623–626 | 「this implies that planning prompts increased the total verification rate by 40%, from 4.8% in control (95% CI=[3.3%, 6.3%]) to 6.7% in the planning conditions (95% CI=[5.4%, 8.0%]); 𝛘2(1)=2.70, p=.100).」 |
| 12 | 問卷到升級的平均天數 | 控制組 15 天（SD 42）；計畫組 19 天（SD 46）；作者說相近，沒有檢定 | 計畫 對 控制 | 同上 | L630–633 | 「similar among students who did not receive a planning prompt (M=15 days, SD=42 days) and those who did (M=19 days, SD=46 days)」 |
| 13 | 因果機制 | 作者自己說不清楚 | — | 同上 | L627–630 | 「The causal mechanism between course progress and verification is unclear - some students may verify as a proactive commitment device, but others may simply wait to upgrade until after they are sure they will complete the course.」 |
| 14 | Table 3 模型 E：Study 2 合併 | 0.627（SE 0.319），兩顆星；N = 1,705；pseudo R² .010 | 計畫 對 控制 | Table 3 | L648–698 | 表列 |
| 15 | Table 3 模型 F：Study 2 分開 | Simple Plans 0.877（SE 0.34），三顆星；Plans Plus 0.308（SE 0.373），沒有星號；N = 1,705；pseudo R² .017 | 各自 對 控制 | Table 3 | 同上 | 表列 |
| 16 | Table 3 模型 G：全部合併 | 0.627（SE 0.319），兩顆星；N = 1,989；pseudo R² .045 | 計畫 對 控制 | Table 3 | 同上 | 表列 |

Table 3 的 N（1,705、1,989）比 Table 2（1,760、2,053）少 55 與 64 人；原文沒有說明為什麼。合理的猜測是排除了註冊時就買 verified 的人（2,053 的 3.1% ≈ 64），但原文沒寫，不確定。模型 E（只有 Study 2）與模型 G（全部）的係數與標準誤印得一模一樣（0.627、0.319），原文沒有說明；對過 PDF 第 6 頁，確實這樣印。

### C. Simple-planning 對 planning-plus（Study 2）

| # | 結果 | 數字 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 17 | 計畫字數 | plus 30.0 字（95% CI 28.8–31.2）對 simple 28.9 字（27.7–30.1）；t(1161) = 0.6，p = .518 | 4.2.1 Simple vs Plus | L639–642 | 「did not write longer plans」 |
| 18 | 書寫時間 | simple 137 秒（131–142）對 plus 148 秒（143–154）；t(1161) = 1.4，p = .141 | 同上 | L643–645 | 「or spend longer time writing, on average」 |
| 19 | 拿證書比例 | plus 18.8%（17.2%–20.4%）對 simple 16.8%（15.3%–18.3%）；χ²(1) = 0.7，p = .404 | 同上 | L645–700 | 「were only slightly larger than in the simple-planning condition」 |
| 20 | 升級 verified 比例，**方向相反** | plus 2.9%（2.2%–3.6%）對 simple 5.0%（4.1%–5.9%）；χ²(1) = 2.6，p = .104 | 同上 | L701–702 | 「while the difference in verification rates was in the opposite direction」 |
| 21 | 作者的處理 | 差異太小偵測不到，之後分析把兩種合併 | 同上 | L702–705 | 「If there is a true difference between these conditions, it is too small to detect in our data, so we collapse across these two planning conditions throughout our analyses.」 |

也就是說，「明講計畫有用＋把計畫回顯給學生」這個加強版，沒有量到比只問一句更好。

### D. 效果的異質性（探索性，沒有預註冊）

| # | 結果 | 數字 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 22 | 做法 | 13 個邏輯迴歸，各測一個 Table 1 共變項與處理的交互作用，控制課程固定效果與共變項主效果；p 值做 false discovery rate 校正 | 4.3 | L710–718 | 「many pretreatment covariates could plausibly moderate the treatment effect and we did not preregister any」 |
| 23 | 唯一顯著的調節變項：同時在實體學校就讀 | 交互作用 β = 1.27，SE = 0.37；z(1514) = 3.5，原始 p < .001；校正後 p = .043 | 4.3 | L719–724 | 「only one of the covariates - current enrollment in a brick-and-mortar school - significantly moderated the effect on course completion.」 |
| 24 | 迴歸係數換算的完成率 | 沒有同時在學：13.6% → 19.4%；同時在學：12.5% → 25.5% | 4.3 | L726–729 | 「planning increased completion rates from 13.6% to 19.4% among those not enrolled in school, and from 12.5% to 25.5% among students who were concurrently enrolled in school.」 |
| 25 | 年齡 | 第二強的調節變項，與在學高度相關，校正後不顯著 | 4.3 | L724–726 | 「The next strongest moderator, age, is highly correlated with school enrollment, and not significant after this correction.」 |
| 26 | 作者的解讀（標明探索性） | 計畫在有結構的學習環境支撐下較有效 | 4.3 | L730–734 | 「Though exploratory, this result is consistent with the diagnosis that follow-through in MOOCs is rare because of a lack of structure.」 |

交互作用檢定的自由度是 1514，比主要樣本 2,053 少；原文沒有說明少掉的人是誰（可能是共變項缺漏）。

### E. 用計畫文字預測完成（假設 2）

| # | 結果 | 數字 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 27 | 有寫計畫的比例 | 87% 寫了「sincere plans」（超過兩個字）；有寫的人平均 33.4 字（SD 28.4） | 5.1 | L744–747 | 「87% of the students in our sample wrote sincere plans (i.e. more than two words)」 |
| 28 | 計畫長度預測完成 | β = .004，SE = .002，z(1319) = 1.6，p = .156（不顯著） | 5.1 | L747–749 | 「The length of students' plans was, at best, a weak predictor of their likelihood of completing the course」 |
| 29 | 模型 | 2–3 個詞幹的 n-gram（出現在不到 1% 文件的剔除）＋字數＋哪些框留白；LASSO 邏輯迴歸（glmnet）；含課程固定效果；用 AUC 評估 | 5.2.1 | L761–811 | — |
| 30 | Study 1 當測試集 | 訓練：Study 2 所有打算完成的人（N = 1,792）；測試：Study 1（N = 156）。AUC = .659（95% CI .548–.771）；Mann-Whitney U = 1186，p = .009 | 5.2.2 | L814–821 | 「These forecasts proved successful in anticipating students' follow-through (AUC=.659, 95% CI=[.548,.771]; Mann-Whitney U=1186, p=.009).」 |
| 31 | Study 2 巢狀交叉驗證 | 20 折、分層、重複 10 次取平均。AUC = .579（95% CI .537–.622）；U = 83238，p < .001 | 5.2.3 | L918–930 | 「(AUC=.579, 95% CI=[.537,.622]; Mann-Whitney U=83238, p<.001)」 |
| 32 | 學生自己預估的完成機率 | 平均預估 83.5%，實際完成率 16.7%。AUC = .597（95% CI .555–.639）；完成者預估 87.7%（85.8–89.6）對 未完成者 82.9%（81.9–83.9），t(1157) = 4.1，p < .001 | 5.2.4 | L936–943 | 「The average student forecast (83.5%) was far more optimistic than the actual completion rate (16.7%).」 |
| 33 | Grit 量表（8 題） | AUC = .577（95% CI .546–.631）；加進自我預估的基準模型後沒有改善（χ²(1, N=1161) = 0.32，p = .572） | 5.2.4 | L946–955 | 「the grit scale forecasts did not improve the fit of the prediction model, beyond a baseline model of students' selfpredictions」 |
| 34 | 文字預測加進自我預估之上 | 有額外解釋力，χ²(1, N=1161) = 7.46，p = .006 | 5.2.4 | L955–957 | 「whereas the natural language forecasts did explain additional variance in course outcomes」 |

Table 4（LASSO 選出的特徵，L824–913，對過 PDF 第 7 頁；欄位是特徵、係數、出現在多少 % 的計畫）：

| 特徵 | 係數 | % 計畫 |
|---|---|---|
| work.cours | −0.0897 | 2.4 |
| free.time | −0.0496 | 5.5 |
| plan.studi | −0.0296 | 4 |
| time.day | −0.0287 | 1 |
| home.will | −0.0249 | 2.1 |
| onehour.daili | −0.0193 | 3.3 |
| discuss.board | 0.0004 | 2.8 |
| plan.engag | 0.0006 | 1.3 |
| will.engag | 0.0410 | 1.2 |
| complet.work | 0.0498 | 1.1 |
| [word count] | 0.0642 | — |
| hour.week | 0.0667 | 2.4 |
| cours.home | 0.0834 | 1.5 |
| watch.lectur | 0.2087 | 4.3 |

作者提醒這張表很稀疏、係數難解讀（L965–972）。

### F. 計畫內容：時間取向

| # | 結果 | 數字 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 35 | 主題模型 | LDA，15 個主題，用超過 10 個字的計畫（N = 1007）；主題數是研究者選的 | 5.3.1 | L975–988 | 「There are no hard-and-fast rules for choosing the number of topics」 |
| 36 | 質性觀察 | 「context」計畫（何時何地）對「action」計畫（教材與方法） | 5.3.1 | L999–1002 | 「the most stark pattern in the topic model was the divide between "context" plans, which focus on the time and location for learning, versus "action" plans, which focus on the materials and methods of learning.」 |
| 37 | 提到時間的比例 | 有寫計畫的人裡 89% 至少提一次時間（LIWC 時間詞字典） | 5.3.2 | L1006–1008 | 「89% of students who wrote any plan mentioned time at least once」 |
| 38 | 時間詞比例預測**較不可能**完成 | β = −0.223，SE = 0.091，z(1131) = 2.4，p = .015（非空白計畫，含課程固定效果） | 5.3.2 | L1009–1014 | 「the proportion of time words predicted that a given plan was less likely to succeed」 |
| 39 | 時間詞越具體越不可能完成 | β = −0.168，SE = 0.098，z(720) = 1.7，**p = .086**（未達 .05；只算至少含 4 個清單內時間詞的計畫） | 5.3.2 | L1022–1029 | 「The students who used more concrete time words were less likely to complete the course than students who used more abstract time words (β=-0.168, SE=0.098, z(720)=1.7, p=.086).」 |
| 40 | 作者明講這不是因果 | — | 5.3.2 | L1030–1032 | 「These estimates are not causal. Choice of plans is endogenous to contextual factors, like other time pressures, that also affect course completion.」 |

Figure 2（PDF 第 8 頁，看過圖）：橫軸計畫字數、縱軸完成可能性，單位是標準化迴歸係數；15 個主題以字母標示，藍色偏完成、紅色偏中輟。圖上沒有數值標籤，讀不出精確數字，不能引。位置最高的是 D（watch, video, lectur, question, answer），最低的是 A（studi, morn, home, even, work）與 H（night, use, block, email, resourc）。Figure 3 是文字雲，沒有數字。Figure 1（PDF 第 4 頁）是四種意向各自的拿證書／中輟占全體百分比長條圖，沒有數值標籤。

### G. 背景數字（作者引別人的，不是本研究的結果）

- 「over 35 million students have enrolled in one of 4,200 courses offered by over five hundred universities」[42]（L78–80）
- HarvardX／MITx 課程裡宣告打算完成的人只有 22% 完成 [16, 37]（L86–89）
- 完成率「typically less than 10% of enrolled students」[10]（L172–173）
- 既有的 MOOC 心理介入研究「has mainly produced null results [20, 23, 50]」（L184–185）
- 多數中輟發生在第一週 [10, 16]（L211–213）

## 作者自己列的限制

**原文沒有 Limitations 節。** 散在各處、作者自己承認的：

1. 文字分析的估計不是因果（L1030–1032）。
2. 異質性分析沒有預註冊、是探索性的（L710–712、L730）。
3. verified 結果是預註冊之後才加的探索性分析（L279–282）；機制不明（L627–630）。
4. 兩種計畫提示之間若有差別，本研究偵測不到（L702–704）。
5. Table 4 特徵稀疏、訓練樣本不大（「modest sample size for training」，L965–966）；LASSO 係數難解讀（L966–972）；主題數是主觀選的（L982–984）。
6. 兩個穩健性檢查的數字不在這篇裡，「reported in the full paper」（L603–604）。這份 10 頁稿就是會議論文全文，「full paper」指的是哪一份，原文沒說。
7. 結論用的是「initial evidence」（L1121–1123）。

原文沒有談的：樣本只佔註冊者約 3.4%，而且是填了選填問卷、宣告要拿證書的人，結果能不能推到其他學習者；各條件人數；Study 1、Study 2 單獨的統計檢定力；三門課只來自一個機構一個平台。

## 與摘要說法不一致的地方

1. **「payment for certificates by 40%」（L33）**：40% 對應的是「總 verified 比例」4.8% → 6.7%，這個比較 p = .100，沒有達到 .05（L623–626）。達到顯著的是「課程中升級」1.8% → 3.6%（p = .036），那是加倍，不是 40%。總討論另寫「students who planned were 40% more likely to pay for a verified certificate **during the course**」（L1057–1058），把 40% 套到課程中升級上，和 4.2.1 的數字對不上。摘要也沒有說這個結果是預註冊之後才加的探索性分析。
2. **「These prompts increased course completion by 29%」（L32–33）**：是相對增幅（13.8% → 17.7%，絕對差 3.9 個百分點）。摘要沒有說分析樣本只含打算拿證書、填了課前問卷的 2,053 人（60,778 註冊者的一小部分）。
3. **「This effect was largest for students enrolled in traditional schools」（L33–34）**：正文標明是探索性、沒有預註冊、13 個檢定校正後 p = .043（L710–730）。摘要沒有這些限定。
4. **「students whose plans focused on specific times were unlikely to complete the course」（L36–38）**：正文裡「時間詞比例」顯著（p = .015），但「時間詞的具體程度」是 p = .086（L1027）；而且作者明寫「These estimates are not causal」（L1030）。摘要的「specific times」對應的是沒有達到 .05 的那一項。
5. **「plan-making is a cheap and effective nudge」＋總討論「Planning prompts provided psychological scaffolding … and paid dividends weeks and months later」**：Table 2 裡兩個研究各自單獨都只有一顆星（照 z 值推算約 p ≈ .07–.08）；合併才到 p = .023。摘要與討論沒有提這一點。
6. 數字本身（29%、40%、三門 HarvardX 課）與正文對得上，除了上面第 1 點的指涉對象。

## 與清單「要撐的結論」不合的地方

清單寫的是：「小規模原始結果（14%→18%），和第 3 列對照」。

- **數字撐得住**：13.8% → 17.7%，四捨五入就是 14% → 18%（L513–515）。
- **「小規模」撐得住**，可以寫得更準：N = 2,053，三門課、一個機構。
- **引用時必須連著講的條件**（少了就會被讀成「對所有註冊者有效」）：
  1. 樣本是「填了選填的課前問卷、宣告要拿證書、第一個月註冊、英文流利」的人，佔 60,778 名註冊者約 3.4%。
  2. 對照組是「什麼都沒多給」。
  3. 兩個研究各自單獨沒有達到 .05（照表內係數與標準誤推算；星號無圖例），合併後 p = .023。
  4. 這是預註冊的主要結果；verified 與「在學者效果較大」都是探索性的。
- **清單沒提、但寫文章時用得到的反向材料**：
  - 加強版提示（明講計畫有用、回顯計畫）沒有比簡單版好（L637–705）。
  - 計畫裡寫越多時間詞的人越不可能完成（p = .015，相關不是因果）；這和「請讀者訂出何時何地讀」的常見建議方向相反，作者自己也指出它和先前場域實驗裡「具體時地計畫最有效」的說法不同，並提出一個未檢驗的調和假說（L1033–1041）。
  - 學生自估完成機率平均 83.5%，實際 16.7%（L936–938）。
- 這篇本身沒有任何後續複製的資訊；「和第 3 列（Kizilcec 等 2020）對照」要靠那一篇的抽取紀錄。

## 讀取紀錄

讀的是重抓的 `yeomans2017-planning-prompts-dspace.txt`（不帶 `-layout`）。

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 0 | 舊檔 `yeomans2017-planning-prompts.md` L1–217 | 整份讀過一次，用來判定缺了什麼（缺表、缺圖、多處截斷），之後不再使用 |
| 1 | L1–699 | MIT 封面、標題、摘要、1 前言、2 背景（2.1、2.2、兩個假設）、3 方法（3.1–3.4）、Table 1、4.1、4.2.1 完成率、Table 2、4.2.1 驗證率、4.2.1 Simple vs Plus 前半、Table 3 |
| 2 | L700–1338 | Simple vs Plus 後半、4.3 異質性、5 自然語言預測（5.1–5.3.2）、Table 4、6 總討論、7 致謝；L1134–1338 是參考文獻 54 筆（書目，掃過） |
| 對表 | PDF 第 4–9 頁（用 Read 直接看頁面）＋ `pdftotext -layout` 輸出 | Table 1（13 列 × 3 欄）、Table 2（模型 A–D 的係數、SE、星號、N、pseudo R²）、Table 3（模型 E–G）、Table 4（14 列）逐格對過；Figure 1、2、3 看過圖面 |

雙欄轉文字後 3.2.2 後面直接接 3.3 的第二段、3.3.1，再回到 3.2.3 與 3.3 的第一段（L287–340），順序交錯；對照 PDF 第 4 頁確認內容沒有缺。4.1 節也排在 4.2.1 之後（L524–536），同樣對過 PDF 第 5 頁。原稿有三個小節都編號為 4.2.1（完成率、驗證率、Simple vs Plus），是原文的編號，不是轉檔錯誤。

沒有附錄、沒有註腳。OSF 上的預註冊文件（`pre-analysis biochem.pdf`）沒有讀。
