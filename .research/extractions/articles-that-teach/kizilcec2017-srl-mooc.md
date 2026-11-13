# 抽取紀錄：Kizilcec、Pérez-Sanagustín、Maldonado 2017，Self-regulated learning strategies predict learner behavior and goal attainment in Massive Open Online Courses

- **書目**：René F. Kizilcec（Department of Communication, Stanford University）、Mar Pérez-Sanagustín（Department of Computer Science, Pontificia Universidad Católica de Chile）、Jorge J. Maldonado（同上，另掛 Universidad de Cuenca, Ecuador）。2017。Self-regulated learning strategies predict learner behavior and goal attainment in Massive Open Online Courses。*Computers & Education*, 104, 18–33。DOI 10.1016/j.compedu.2016.10.001。2016-06-09 收稿、2016-10-01 接受、2016-10-04 線上刊出（L30–35）。作者姓名與單位對過首頁（L14–23；文字檔的重音字母被拆開，姓名寫法以 PDF 首頁為準）。
- **原文檔（這次重抓的完整版）**：`.research/raw/learning-content/q4-time/kizilcec2017-srl-mooc-author-site.pdf`（16 頁）與同名 `.txt`（`pdftotext -layout`，1,017 行、98,364 位元組；期刊是單欄版面，沒有左右交錯）。下面的行號都是這個 `.txt` 的行號。
  - 來源：第一作者個人網站 `https://rene.kizilcec.com/wp-content/uploads/2016/11/kizilcec2017srl.pdf`。
- **原本清單上的檔**：`q4-time/kizilcec2017-srl-mooc.md`（145 行、50,273 位元組），是接受稿的文字，截在 5.1 節第一點中間（「According to the anal…」），5.1 後半、5.2 Limitations、6 Conclusion 全缺，表格也沒有版面。這次沒有用它。
- **版本**：刊出版（出版者排版，頁碼 18–33）。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 19（清單 D，19#7）

## 研究設計

- **類型**：觀察性、相關性研究（問卷自陳＋平台行為紀錄）。**沒有任何介入或隨機分派。** 作者自己的定性：「Observational accounts of SRL」「The resulting correlational findings」（L797–800）；行為分析是「exploratory」（L699）。
- **場域**：智利天主教大學在 Coursera 開的六門 MOOC，主題為工程、資訊科學、管理、交通、教育；**西班牙語授課、自訂進度（self-paced），教材一次全部開放、沒有期限**（L305–308）。每門 6–10 節，每節 5–10 支影片與數個評量（選擇題測驗、同儕互評）；多數評量是形成性的、可重複作答（L308–310）。資料收集於 2015 年 4–12 月（L314）。
- **受試者**：最終樣本 4,831 人（L305）。
  - 來源：6,709 人回答了入課時的選填問卷（L315、L327）。排除 385 份（同一課重複填或幾乎沒填）；另有 **1,450 份因為無法和課程資料對上而排除**（靠填答者手動輸入的資訊合併，輸入錯誤）；剩 4,874 份來自 4,831 人，43 人同時修兩門，各隨機留一門（L317–322）。
  - 六門課各有多少註冊者、問卷回答率多少，**原文沒有報告**。
  - 樣本特徵：平均 32.0 歲（SD 10.8）、女性 26%、學士以上 63%（碩博士 15%）、就業 60%、學生 25%（L312–313）。作者在限制裡說樣本「mostly Latin American learners」（L750–751）。
  - 自陳每週投入 4.9 小時（SD 3.1，中位數 4）；95% 打算看完所有影片、93% 打算做完所有評量；一半有該主題的先前經驗；先前開始過的線上課平均 2.4 門（SD 4.0，中位數 1）、完成過 1.8 門（SD 3.2，中位數 1）（L419–423）。
- **量了什麼**：
  - **SRL 自陳量表**：23 題、5 點量尺（編碼 0–4），改編自 Littlejohn & Milligan（2015）與 Barnard、Paton、Lan（2008）的問卷，取六個分量表：goal setting（4 題）、strategic planning（4）、self-evaluation（3）、task strategies（6）、elaboration（3）、help seeking（3）（L331–346）。題目順序隨機。整份問卷譯成西班牙文。不到 5% 的缺漏值用 predictive mean matching 插補（L352–355）。
  - 在入課時填一次（L327）；之後的行為與成就取自平台紀錄。
  - 個人目標：打算拿證書、打算做完所有評量、打算看完所有影片。達成的定義：拿到證書；完成 80% 以上評量；完成 80% 以上影片（Table 3 註 a）。
  - 行為：把連續互動切成 session（兩小時內至少互動一次算同一 session）；少於 5 秒的互動剔除；每個互動標成六種狀態之一（Table 2：Lecture Begin／Complete／Revisit、Assessment Attempt／Pass／Revisit）（L363–372、L473–482）。
- **分析**：
  - RQ1：Spearman 相關（各策略 × 目標達成，只算有表達該目標的人）；另配邏輯迴歸同時放入六個策略（L359–362）。
  - RQ2：(a) 轉移層級，6 策略 × 36 種轉移 = 216 個相關；(b) session 層級，6 策略 × 22 個行為指標 = 132 個相關，只含有超過一個 session 的人（N = 2,949）。只看 p < 0.01（以課程為叢集的 10,000 次 bootstrap）且 |r| > 0.045 的（L373–393）。
  - RQ3：27 個個人特徵對各策略的 elastic net 懲罰迴歸（90% LASSO＋10% Ridge，10 折交叉驗證）（L394–413）。

Table 1（L455–470，對過 PDF 第 7 頁）：各策略的平均（SD）、Cronbach's α、兩兩 Pearson 相關。

| 策略 | 例句 | M (SD) | α | 2 | 3 | 4 | 5 | 6 | 總分 |
|---|---|---|---|---|---|---|---|---|---|
| 1 Goal Setting | I set realistic deadlines for learning. | 3.0 (0.76) | 0.86 | 0.70 | 0.48 | 0.57 | 0.46 | 0.29 | 0.78 |
| 2 Strategic Planning | I organize my study time to accomplish my goals to the best of my ability. | 3.1 (0.65) | 0.75 | | 0.60 | 0.66 | 0.58 | 0.32 | 0.84 |
| 3 Self-evaluation | I think about what I have learned after I finish. | 3.3 (0.66) | 0.80 | | | 0.63 | 0.59 | 0.25 | 0.74 |
| 4 Task Strategies | When I study for this course, I make notes to help me organize my thoughts. | 3.1 (0.62) | 0.78 | | | | 0.72 | 0.35 | 0.87 |
| 5 Elaboration | When I am learning, I try to relate new information I find to what I already know. | 3.3 (0.64) | 0.77 | | | | | 0.32 | 0.77 |
| 6 Help Seeking | When I do not understand something, I ask others for help. | 2.6 (0.79) | 0.77 | | | | | | 0.58 |
| SRL 總分 | — | 3.0 (0.52) | 0.92 | | | | | | |

量尺上限是 4，六個策略的平均都在 2.6–3.3，分數集中在高端。

## 結果（逐項）

### RQ1：哪些自陳策略與達成個人目標有關

Table 3（L487–497，**對過 PDF 第 8 頁**；文字檔把負號與「≈」都弄丟了，下面以 PDF 為準）：Spearman 相關係數。* p < 0.05；** p < 0.005。

| 個人目標 | 表達該目標的比例（達成比例） | Goal setting | Strategic planning | Self-evaluation | Task strategies | Elaboration | Help seeking |
|---|---|---|---|---|---|---|---|
| 拿到證書 | 32%（8.9%） | 0.08** | 0.05* | ≈0 | 0.04 | 0.03 | −0.05* |
| 做完所有評量 | 93%（7.3%）ᵃ | 0.05** | 0.05** | 0.04* | 0.04* | 0.03 | −0.05** |
| 看完所有影片 | 95%（9.1%）ᵃ | 0.03* | 0.04** | 0.03* | 0.03* | 0.03 | −0.03 |

ᵃ 達成定義為完成 80% 以上的評量／影片。括號內的「達成比例」是以表達該目標的人為分母還是以全樣本為分母，表頭沒有寫明；內文說相關是「among those who expressed the goal」（L435–436）算的，分母應是前者，但不確定。

| # | 結果 | 數字 | 對照／條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 目標設定與三種目標達成都正相關 | ρ = 0.08**、0.05**、0.03* | 自陳分數高低之間的相關；只算表達該目標的人 | 4.1／Table 3 | L436–437 | 「goal setting and strategic planning were significant positive predictors of goal attainment for all three goals.」 |
| 2 | 策略規劃同上 | ρ = 0.05*、0.05**、0.04** | 同上 | 同上 | 同上 | 同上 |
| 3 | 求助是負相關 | ρ = −0.05*、−0.05**；看完影片 −0.03（p = 0.069，不顯著） | 同上 | 同上 | L437–438 | 「help seeking was a significant negative predictor of goal attainment (except for completing lectures, p = 0.069).」 |
| 4 | 自我評估、任務策略 | 只和做完評量、看完影片有關（0.03–0.04*）；和拿證書無關（≈0、0.04 不顯著） | 同上 | 同上 | L438–440 | 「Self-evaluation and task strategies were predictive only of completing assessments and lectures」 |
| 5 | 精緻化（elaboration） | 三個都是 0.03，不顯著 | 同上 | 同上 | L439–440 | 「elaboration was not at all correlated with goal attainment.」 |
| 6 | 邏輯迴歸（六個策略同時放入）：目標設定 | 目標設定高 1 SD，達成拿證書目標的勝算高 54%（z = 2.68，p = 0.007） | 同上；控制其餘五個策略 | 4.1 | L445–446 | 「learners who indicated 1 SD higher levels of goal setting had 54% higher odds of achieving their goal of earning a certificate (z = 2.68, p = 0.007).」 |
| 7 | 同一模型：求助 | 求助高 1 SD，拿證書的勝算低 27%（z = −3.11，p = 0.002；負號以 PDF 為準） | 同上 | 4.1 | L446–448 | 「the same model yielded 27% lower odds of certification (z = −3.11, p = 0.002) for learners who indicated 1 SD higher levels of help seeking.」 |
| 8 | 其他兩個目標 | 係數「highly significant and only somewhat smaller」，**沒有給數字** | 同上 | 4.1 | L448–449 | 「coefficient estimates predicting the other course goals were highly significant and only somewhat smaller.」 |
| 9 | 穩健性 | 加入人口統計、經驗、投入時間等共變項後結果一致；拿掉目標設定後，策略規劃也是強的正向預測因子。**都沒有給數字或表** | — | 4.1 | L443–445 | 「robust to regression adjustment for available covariates … strategic planning was also a strong positive predictor with goal setting excluded from the model.」 |
| 10 | 作者的小結 | 目標設定與求助是兩個關鍵預測因子 | — | 4.1 | L449–451 | 「learners who engaged in goal setting and avoided help seeking were significantly more likely to achieve their personal course goals.」 |

邏輯迴歸沒有表，只有上面這兩個勝算比。54% 與 27% 是**勝算**的變化，不是機率；基準達成率是 8.9%。

### RQ2：自陳策略在行為上的表現

Fig. 1（L527–548，對過 PDF 第 8 頁的圖）：全體學習者的轉移圖，只畫機率 > 15% 的箭頭。內文明寫的數字（L508–511）：

- 看完一支影片後：74% 接著看完另一支；13% 通過一個評量（圖上沒畫）。
- 剛通過一個評量後：66% 接著看完一支影片。
- 嘗試評量但沒通過後：29% 嘗試另一個評量、19% 通過另一個評量、21% 看完一支影片、27% 重看一支影片。
- 圖上另有四個數字內文沒有逐一說明：Lecture Begin 自迴圈 28、Lecture Begin → Lecture Complete 40、Assessment Revisit 自迴圈 31、Lecture Revisit 自迴圈 54，以及兩條標 35 與 23 的箭頭（從圖面看，35 連著 Assessment Revisit 與 Lecture Complete，23 連著 Lecture Revisit 與 Lecture Complete；箭頭方向我從圖上判讀，不確定）。

| # | 結果 | 數字 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 11 | 轉移層級：顯著相關的數量 | 216 個相關裡 34 個 p < 0.01；其中 14 個 |r| > 0.045；**最大 |r| = 0.065** | 3.3 | L378–381 | 「Of the 34 highly significant correlations, 14 correlations were relatively large in magnitude (i.e., |r| > 0.045; max. |r| = 0.065).」 |
| 12 | session 層級：顯著相關的數量 | 132 個相關裡 27 個 p < 0.01；其中 18 個 |r| > 0.045；**最大 |r| = 0.097**；N = 2,949 | 3.3 | L391–393 | 「Bootstrapping yielded 27 highly significant correlations, 18 of which were of relatively large magnitude (i.e., |r| > 0.045; max. |r| = 0.097).」 |
| 13 | 轉移層級的總結 | 自陳 SRL 較強的人，做完一項後較傾向回頭看教材而不是開始新的 | 4.2 | L515–517 | 「learners who report stronger SRL skills were more inclined to revisit course materials after completing other materials, instead of starting new materials.」 |
| 14 | 例外：求助 | 傾向求助的人，看完影片後較不會通過評量（Table 4 唯一的向下箭頭） | 4.2 | L517–518 | 「learners inclined to seek help were less likely to pass an assessment after completing a lecture.」 |
| 15 | session 層級的總結 | 目標設定、策略規劃、自我評估、任務策略較高的人，花在重訪評量的時間（絕對與比例）較多 | 4.2 | L582–584 | 「spent more time in absolute and relative terms on revisiting assessments.」 |
| 16 | 同上 | 目標設定、策略規劃較高的人，典型 session 花在評量的時間較多；任務策略較高的人花較多時間重看影片 | 4.2 | L584–586 | 「learners who reported using more task strategies devoted more time to revisiting lectures.」 |

Table 4（L551–572，對過 PDF 第 9 頁；文字檔把箭頭符號弄丟了。除了 Help Seeking 那一列是向下箭頭，其餘全是向上箭頭）：

| 策略 | 轉移層級 | session 層級 |
|---|---|---|
| Goal Setting | ↑ 通過評量或看完影片後重訪評量；↑ 看完影片後重看影片 | ↑ 總時間與 session 數；↑ 花在評量與重訪評量的時間（總量與比例）；↑ 做的評量數中位數與花在評量的時間中位數 |
| Strategic Planning | ↑ 通過評量後重訪評量或影片 | ↑ 花在重訪評量的時間（總量與比例）；↑ 花在評量的時間中位數 |
| Self-evaluation | ↑ 通過評量或看完影片後重訪評量；↑ 開始一支影片後重看影片；↑ 重看影片後開始一支影片 | ↑ 花在重訪評量的時間（總量與比例） |
| Task Strategies | ↑ 通過評量後重訪評量或影片；↑ 重看影片後開始一支影片 | ↑ 重訪內容的總時間；↑ 花在重訪評量的時間比例；↑ 花在重訪評量的時間中位數 |
| Elaboration | ↑ 看完影片後重訪評量 | 沒有顯著相關 |
| Help Seeking | ↓ 看完影片後通過評量 | 沒有顯著相關 |

**Table 4 只給方向，沒有給任何相關係數。** 全部這些相關的絕對值都在 0.045 到 0.097 之間（第 11、12 項）。

內文兩次寫「see Section 3.5」（L514、L581），但這篇的方法只有 3.1–3.3，沒有 3.5 節；指的應該是 3.3 的分析說明。

### RQ3：自陳策略隨個人特徵的差異

Fig. 2（PDF 第 10 頁，看過圖；27 個預測變項 × 6 個策略的懲罰迴歸係數熱圖，結果變項已標準化，空格代表被變項選擇剔除）。下面抄圖上印出的係數，欄序是 Goal Setting／Strategic Planning／Task Strategies／Elaboration／Self-evaluation／Help Seeking；「—」是空格。

| 預測變項 | GS | SP | TS | El | SE | HS |
|---|---|---|---|---|---|---|
| Age | 0.07 | 0.06 | 0.1 | 0.1 | 0.08 | ≈0 |
| Gender: Female | 0.02 | −0.06 | 0.03 | −0.07 | −0.08 | 0.16 |
| Education: Ph.D. | 0.09 | 0.25 | 0.17 | 0.12 | 0.2 | −0.25 |
| Education: Master's | 0.1 | 0.09 | 0.05 | — | −0.02 | — |
| Education: Professional | 0.06 | 0.04 | 0.03 | — | ≈0 | 0.06 |
| Education: Bachelor's | — | −0.01 | ≈0 | — | −0.08 | −0.03 |
| Occupation: Student | −0.03 | −0.08 | −0.18 | −0.13 | −0.23 | −0.02 |
| Occupation: Employed | 0.03 | 0.03 | — | — | −0.05 | 0.09 |
| Experience with topic | 0.04 | 0.04 | 0.05 | 0.08 | 0.05 | −0.1 |
| Online courses started | −0.14 | −0.11 | −0.08 | −0.04 | −0.09 | −0.1 |
| Online courses finished | 0.18 | 0.14 | 0.08 | 0.04 | 0.08 | 0.06 |
| Time commitment (hrs/wk) | 0.09 | 0.09 | 0.09 | 0.08 | 0.06 | 0.04 |
| Complete all assessments | 0.47 | 0.35 | 0.29 | 0.23 | 0.31 | 0.25 |
| Complete all lectures | 0.49 | 0.37 | 0.28 | 0.25 | 0.3 | 0.21 |
| OLEI: Research relevant | 0.21 | 0.25 | 0.27 | 0.23 | 0.24 | 0.14 |
| OLEI: Job relevant | 0.09 | 0.06 | 0.1 | 0.11 | 0.04 | 0.12 |
| OLEI: School relevant | 0.07 | 0.02 | 0.04 | 0.04 | 0.02 | — |
| OLEI: Earn certificate | 0.13 | 0.12 | 0.06 | 0.05 | 0.08 | 0.04 |
| OLEI: Prestigious uni./instr. | 0.13 | 0.14 | 0.13 | 0.06 | 0.06 | 0.1 |
| OLEI: Meet new people | 0.14 | 0.14 | 0.11 | 0.03 | 0.09 | 0.15 |
| OLEI: Take with others | 0.14 | 0.09 | 0.07 | 0.02 | −0.02 | 0.14 |
| OLEI: Personal growth | −0.09 | −0.06 | −0.07 | ≈0 | 0.11 | −0.09 |
| OLEI: Experience MOOC | −0.04 | −0.03 | −0.05 | −0.04 | −0.03 | 0.05 |
| OLEI: Fun and challenge | −0.12 | −0.1 | — | 0.03 | −0.03 | −0.11 |
| OLEI: Improve Spanish | — | — | 0.07 | — | −0.05 | — |
| OLEI: Career change | — | −0.05 | −0.05 | −0.08 | −0.05 | −0.12 |
| OLEI: General interest | −0.02 | −0.12 | −0.07 | — | −0.06 | −0.09 |

這些數字是我從圖上逐格讀的，圖的字很小，個別格子可能讀錯；要引用其中任何一格之前請再對一次 PDF 第 10 頁。原文沒有給標準誤或顯著性（懲罰迴歸本來就不給）。

作者對 Fig. 2 的文字（L598–631）：

- 年紀較大的人各策略分數都較高，求助除外。
- 女性：策略規劃、精緻化、自我評估較低；目標設定、任務策略較高，求助特別高。
- 博士學歷：整體較高，但求助低很多。
- 同時是學生的人：各策略一律較低，自我評估與任務策略尤其低。
- 開始過較多線上課的人自陳 SRL 較低；**完成過**較多線上課的人較高，目標設定尤其明顯。
- 打算看完所有影片或做完所有評量的人，SRL 分數高出最多 0.5 SD（L612–613）。
- 動機：為了證書、認識人、和別人一起修、學校或教師名氣、與研究／工作／學業相關 → 較高；一般興趣、轉職、好玩與挑戰、體驗 MOOC、個人成長 → 較低。

### 背景數字（作者引別人的）

- 2011 年底到 2015 年，550 個機構開了 4,200 門課、觸及超過 3,500 萬人（Shah 2015）（L61–62）。
- 典型 MOOC 的問卷回答者只有一半打算完成課程拿證書（L85–86）。
- Kizilcec & Halawa（2015）：20 門 MOOC、1,698 人，中輟理由四群依重要性為時間問題、課程難度、形式與內容、目標與期待；後續研究裡 84% 的回答者說「not enough time for the course」，其中一半也說容易分心（L190–195）。
- Kizilcec & Halawa（2015）：16 門 MOOC、超過 67,000 人（L256–258）。

## 作者自己列的限制

有獨立的 5.2 Limitations 節（L747–785），作者列三項：

1. **外部效度**（L750–763）：樣本多為拉丁美洲學習者、課程以西班牙語授課；課程是 2015 年 Coursera 上的自訂進度 MOOC。作者點名 Mullaney & Reich（2015）發現分批釋出與一次全開在持續與完成上有差別，並說平台當時的設計與資料埋點會影響學習者行為與研究者的解讀：「This highlights a structural limitation with implications for both the replicability of findings across platforms and time」。
2. **構念效度**（L764–773）：沒有採用任何一份完整的既有量表，而是挑六個策略、改編題目；整份問卷譯成西班牙文，由兩位懂構念的母語者翻譯，「Valid translation of survey instruments is a non-trivial issue and it warrants empirical validation.」（也就是沒有做翻譯版的效度驗證。）
3. **多數策略在平台上觀察不到**（L774–780）：「no data was available about whether learners set clear learning goals, engaged in note-taking while watching lectures, practiced self-explanation, or consulted friends or the Internet for help. … neither self-report nor course log data provides a complete account of online SRL and therefore limits the ability to draw valid conclusions about SRL in these environments.」

散在討論裡、作者自己的保留：

4. 行為指標和自陳策略相關，不代表那個行為就是在用那個策略：「Although the behavioral indicators were correlated with specific self-reported SRL strategies, they did not necessarily reflect applications of the strategies themselves. … the interpretation is not always clear and the activity log provides only an indirect account」（L691–694）。行為分析是由下而上的探索，結果要靠之後由上而下的驗證性研究（L698–701）。
5. 「重訪評量＝提取練習」是作者的推測：「suggests that learners engaged in retrieval practice」（L689–691）。平台紀錄分不出重做與只是回去查看（Table 2 的定義是「re-take or simply look up」，L482）。
6. 求助的負相關有多種解讀，作者列了自我選擇（自我效能低的人較常說會求助）、這幾門課的討論區幾乎沒人用（不到十幾則貼文或完全沒有）以致求助需求沒被滿足等（L702–716）：「could be either due to self-selection or a sign that learners' help-seeking needs were not met in the learning environment.」
7. 設計輔助要靠因果證據，而且作者自己點出兩個沒有效果的 SRL 介入：「The design of scaffolding certainly needs to be informed by causal evidence … (for examples of SRL interventions in MOOCs that did not have a positive impact, see Davis, Chen, Zee, Hauff, & Houben, 2016; Kizilcec et al., 2016)」（L739–741）。
8. 結論把本研究定位成給下一波實驗研究參考的相關性發現（L800–803）。

原文沒有談的：

- 樣本是填了選填問卷、且手動輸入的資訊能對上平台資料的人（6,709 份裡有 1,450 份因對不上而排除）；93–95% 自陳要做完全部，和一般註冊者差很多。回答率沒報告。
- 348 個相關（216＋132）只用 p < 0.01 的門檻篩，沒有做多重比較校正；照 1% 的門檻，光是隨機就預期約 3–4 個。
- 相關係數的絕對值很小（RQ1 為 0.03–0.08；RQ2 最大 0.097），原文沒有討論實務上的大小。
- 自陳量表在入課時填，分數集中在量尺高端（平均 2.6–3.3，滿分 4）。
- 23 題的完整題目在線上補充資料（L343「see Appendix」、L826–829），這份 PDF 沒有附，沒有讀到。

## 與摘要說法不一致的地方

逐項對過，方向一致，沒有數字衝突（摘要沒有任何效果量）。措辭上：

1. 摘要「goal setting and strategic planning predicted attainment of personal course goals」（L46–47）：對應的是 ρ = 0.03–0.08 的相關與一個勝算比（+54%）。「predicted」在這篇是統計上的預測，全篇沒有因果設計；摘要沒有給效果大小，也沒有說這是自陳量表。
2. 摘要「Learners with stronger SRL skills were more likely to revisit previously studied course materials, especially course assessments」（L48–49）：對應的相關最大 |r| = 0.097，而且求助這個策略是例外（正文 L646–648 有寫「except for help seeking」，摘要沒有）。
3. 標題與摘要用「SRL skills」「SRL strategies」，量到的是入課時的**自陳**傾向；作者在限制第 3 點承認實際有沒有用這些策略觀察不到。
4. 正文內部一處自相矛盾（不涉及摘要）：2.3 節說先前研究「found no significant gender differences」（L247–248），討論卻寫女性較常求助「in contrast to prior work that found gender differences」（L650–652），引的是同三篇文獻。照文意後者應是漏了否定詞，但原文就是這樣印的。
5. 討論第一點寫「goal setting and strategic planning stood out as particularly helpful strategies」（L669），「helpful」是因果用語；同一段稍後改口為「this converging correlational evidence」（L676）。

## 與清單「要撐的結論」不合的地方

清單寫的是：「目標設定與達成目標的關係；回頭看教材的行為」。

- **有關係，撐得住；寫成「有幫助」「會提高」撐不住。** 這是一次性的自陳問卷與之後行為的相關，沒有介入。能寫的是：「自陳較常設定目標的人，之後達成自己課程目標的比例略高」。
- **效果量要一起寫**：Spearman ρ = 0.03–0.08；邏輯迴歸裡目標設定高 1 SD、拿證書的勝算高 54%（基準達成率 8.9%）。只引「54%」會讓人以為效果很大。
- **「回頭看教材」同樣是相關**，最大 |r| = 0.097，Table 4 只給方向不給數字；而且作者自己說行為指標不一定代表在用那個策略，「重訪評量是提取練習」是推測，紀錄分不出重做與查看。
- **母群**：智利一所大學的六門西班牙語、自訂進度、沒有期限的 Coursera 課；填了選填問卷的人；93–95% 自陳要做完全部。和 19#4、19#5 的英語、有時程的課不同。
- **清單沒提、但同一篇裡的反向材料**：
  1. 求助是負相關（ρ = −0.05；勝算低 27%）。
  2. 精緻化（把新知識和舊知識連起來）和三種目標達成都不相關（ρ = 0.03，不顯著）；自我評估和拿證書無關（≈0）。
  3. 作者自己引了兩個「教 SRL 策略沒有效果」的介入研究（Davis 等 2016；Kizilcec 等 2016），並說輔助設計要靠因果證據。也就是說，這篇不能拿來撐「請讀者先設定目標就會讀完」。
  4. 開始過越多線上課的人自陳 SRL 越低，完成過越多的越高（Fig. 2）。
- 一手描述數字可用（都要帶「這六門課、問卷回答者」的條件）：32% 表達要拿證書；表達目標者的達成率 8.9%（證書）、7.3%（80% 以上評量）、9.1%（80% 以上影片）；看完一支影片後 74% 接著看完下一支。

## 讀取紀錄

讀的是重抓的 `kizilcec2017-srl-mooc-author-site.txt`（`-layout`，單欄版面）。

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 0 | 舊檔 `kizilcec2017-srl-mooc.md` 的開頭約 1,500 字元與結尾約 800 字元 | 只用來確認來源、版本（接受稿）與截斷位置，沒有通讀 |
| 1 | L1–520 | 首頁、摘要、1 Introduction、2 Related work（2.1 模型、2.2 線上學習與 MOOC 的 SRL、2.3 個別差異、2.4 研究問題）、3 Methods（3.1 參與者與脈絡、3.2 測量、3.3 分析方法）、4 Results 開頭、4.1（RQ1）、Table 1、Table 2、Table 3、4.2（RQ2）前半 |
| 2 | L520–1017 | 4.2 後半、Fig. 1、Table 4、4.3（RQ3）、Fig. 2 圖說、5 Discussion、5.1 Implications（四點）、5.2 Limitations（三點）、6 Conclusion、Acknowledgements、Appendix（只有補充資料連結）；L832–1017 是參考文獻（書目，掃過） |
| 對表 | PDF 第 7–10 頁（用 Read 直接看頁面） | Table 1 逐格對過；Table 3 逐格對過並補回負號與「≈0」；Table 4 補回箭頭方向；Fig. 1 的數字與內文對過；Fig. 2 逐格抄下係數；4.1 的 z = −3.11 負號以 PDF 為準 |

註腳 3（Winne & Hadwin 的四階段模型，L141–144）與註腳 4（OLEI 西語譯本的連結，L338–339）讀過。線上補充資料（23 題問卷全文）沒有取得、沒有讀。
