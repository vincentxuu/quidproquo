# 抽取紀錄：Rivera Garrido 等 2026，PATHOS（ICER 2026 Vol. 1，doi 10.1145/3765964.3811657）

- **書目**：Diego Rivera Garrido\*、Sverrir Thorgeirsson\*、Damiano Meier、Luigi Pizza、Lahari Goswami、Jesus Solano、Carlos Cotrini、Zhendong Su（八位皆 ETH Zurich；\* 並列第一作者）。PATHOS: A Pedagogical Method for Sequencing Instruction in Multi-Foundational Machine Learning. *Proceedings of the ACM Conference on International Computing Education Research Vol. 1 (ICER 2026 Vol. 1)*，2026-08-11 至 14，Uppsala。ACM，15 頁。CC BY 4.0。作者全名對過 PDF 首頁與 ACM Reference Format。頁眉的作者簡稱是「Rivera, Thorgeirsson, …」，引用時姓氏寫 Rivera Garrido 或 Rivera 要統一。
- **原文檔**：`.research/raw/learning-content/q4-time/pathos2026-sequencing-ml.txt`（`pdftotext -layout` 的雙欄版，939 行、123,549 字元、124,288 位元組；左右欄交錯，沒用它讀）。
- **本次重抓**：同一來源 `https://people.inf.ethz.ch/sverrirt/pdf/pathos.pdf`（並列第一作者 Thorgeirsson 的 ETH 個人頁），PDF 存為 `q4-time/pathos2026-sequencing-ml.pdf`（15 頁）；不帶 `-layout` 重轉的單欄文字存為 `q4-time/pathos2026-sequencing-ml-plain.txt`（1,892 行、94,444 字元、95,183 位元組）。**下面的行號一律是這份 plain 檔的行號。**
- **讀取日期**：2026-10-14
- **版本**：作者個人頁上的 ACM 排版稿（有 ACM 版權頁、ISBN、DOI）。沒有和 ACM Digital Library 上的版本逐字比對。
- **供哪幾篇使用**：order 18（系列的順序）
- **沒讀的東西**：GitHub 上的補充材料（完整測驗、訪談編碼簿、教材）與預先註冊文件 `https://aspredicted.org/kk4zv3.pdf` 沒有取。凡是「與預註冊一致」的說法都只是作者自述。

## 研究設計

- **類型**：預先註冊的課堂隨機對照試驗，交叉設計；主要分析只用交叉之前的第一次測驗，所以是受試者間比較（L267–272、L697–721）。
- **地點與時間**：ETH Zurich 一門大型的人工智慧課，2025 年 11 月到 2026 年 1 月（L690–692）。
- **受試者**：
  - 修課 448 人，隨機分派 224 人到實驗教材、224 人到對照教材（L701–703）。學生不知道自己拿到哪一種順序（L703–705）。
  - 到場考第一次測驗的 221 人，其中 209 人同意把成績用於研究：實驗組 100 人、對照組 109 人（L1327–1330）。**分析樣本 209 人是 448 位被隨機分派者的 47%。**
  - 流失差異檢定：χ²(1) = 0.574，p = 0.449（L1330–1331）。我用 100/224 對 109/224 加 Yates 校正驗算得 0.574，吻合，所以這個檢定的分母是 448。
  - 179 人報年齡，平均 23.6 歲（SD 3.2）；178 人報性別，女性 23 人（13%）、男性 155 人（L1331–1335）。
  - 204 人（98%）報對擴散模型的熟悉度，平均 1.96／5（SD 1.27）；對照組 2.02、實驗組 1.89，雙尾 t 檢定 p = 0.464（L1336–1339）。
- **教材**：擴散模型（diffusion models）的教學影片加講義、投影片；每支 5 到 20 分鐘，兩週內釋出，每週約兩小時（L1070–1075）。對照組影片總長約 6,832 秒（約 114 分鐘；第 1 週 4,272 秒、第 2 週 2,560 秒），實驗組約 6,670 秒（約 111 分鐘；第 1 週 4,410 秒、第 2 週 2,260 秒）（L1221–1228）。程式練習影片兩組完全相同；非程式影片由同樣三位講者製作，「the only differences between the two versions lying in the transition segments, while the core instructional material remained the same」（L1228–1233）。同一主題在兩個版本由同一位講者講（L1215–1219）。教材上傳後只開放給被分派的那一組（L1212–1214）。
- **教材開始前**：兩組都先上同一堂 30 分鐘的擴散模型概論（L1061–1069）。
- **兩種順序**（Figure 2b、2c，已對 PDF 第 7 頁影像；Figure 4，已對第 9 頁影像）：
  - 實驗組（PATHOS）：SDE → FP → EM → AR ｜ MC → ULA → HTSM → NCSM → ALS ｜ DDPM。分成三段：隨機微積分、Langevin 取樣方法、DDPM（L673–684）。
  - 對照組（discovery order，照研究文獻出現的順序）：MC → HTSM → NCSM → ULA → ALS → DDPM → EM → SDE → AR → FP。
  - 作者說對照順序與 Stanford CS236、MIT 6.S184 的做法一致：兩門課教的每個主題在對照組裡相對位置相同，三者都把 score 與取樣放前面、把 SDE 與 Fokker-Planck 這些連續時間基礎放後面；對照組為了自成一體多加了 MC 與 EM（L988–999）。
- **PATHOS 怎麼排的**（§3，L479–684）：
  1. 教師把主題切成概念項目（這次 10 個，由三位助教與授課教師依文獻回顧決定，L629–639）。
  2. 建有向的「複雜度圖」：10 個項目的完全有向圖共 100 條可能的邊，**刪掉違反先備關係（surmise relation）的邊後剩 24 條**（L642–644）。12 位不參與研究的評分者（7 位其他 AI 課的助教、5 位做 AI 研究的博士生）用 7 點量表評每條邊「從 A 轉到 B 的認知負荷」，取平均當邊的成本；評分者一致性中等，平均標準差 1.53、平均變異係數 0.43（L647–655）。另加一個「空」節點連到可當一段開頭的項目。
  3. 求最小生成樹，拿掉空節點後得到生成森林，每棵樹是一段；樹再拆成路徑決定段內順序。段與段的先後由教師決定，建議照起始成本由低到高（L591–609）。
- **比較對象**：只有呈現順序不同。作者明說不主張對照順序是最佳，也不替「照發展史」當一般原則辯護（L1005–1007）。
- **量了什麼**：
  - 主要結果：32 題四選一的選擇題測驗，每個主題 3 到 4 題、各主題權重相同；紙本、45 分鐘、有人監考、閉卷；答對一題一分、猜錯不扣分；閱卷者不知道分組（L1044–1055）。Markov chains 因為課程已教過所以不考，DDPM 拆成理論與訓練兩個主題，共十個主題（L1040–1043）。測驗由研究團隊與助教自編；一位擴散模型領域的教授與一位博士生（都不是作者）逐題對過兩份教材，確認答案所需資訊兩邊都有（L1050–1052）。Cronbach's α = 0.80（L1418–1419）。
  - 次要結果：Morrison 等人改編的 Cognitive Load Component Survey 的內在負荷與外在負荷兩個分量表，0 到 10 分；線上、不計分、自願填（L966–974、L1362–1363、L1676–1677）。
  - 另有 8 位學生的事後訪談（實驗組 4 位、對照組 4 位，從回應邀請者中隨機抽）（L1428–1430）。
- **何時量**：見下面「不一致」第 1 點。§4.3 寫第一份教材之後三週、交叉之前（L1026–1027）；§7.2 寫教材釋出到測驗之間有三週（L1684）。**沒有延後測驗**；交叉後的第二次測驗不分析（L714–718）。
- **統計**：預註冊的單尾獨立樣本 Student's t 檢定（L729–734、L952–963）；預註冊不排除離群值、不做常態檢定（L735、L949–950）。另報 Welch、雙尾、Mann-Whitney 當敏感度分析。

## 結果（逐項）

### 主要結果：學習測驗（§5，L1349–1359）

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 主要檢定 | 單尾 Student's t，p = 0.011；Cohen's d = 0.322，標準誤 0.140 | PATHOS 順序（n = 100）對 discovery order（n = 109） | L1349–1352 | 「We found that the experimental group performed significantly better (𝑝 = 0.011), and that Cohen’s 𝑑, i.e., the effect size, was 0.322, with a standard error of 0.140.」 |
| 2 | 答對率 | 實驗組 62.6%，對照組 57.3%（差 5.3 個百分點；以 32 題計約 1.7 題，題數是我換算的） | 同上 | L1352–1353 | 「The experimental group achieved an average correctness rate of 62.6%, while the control group’s correctness rate was 57.3%.」 |
| 3 | 雙尾 | p = 0.021，仍顯著 | 同上 | L1355–1356 | 「A two-sided t-test remained significant (𝑝 = 0.021), indicating that the significance does not depend on the choice of one-sided testing.」 |
| 4 | Welch t | t(207) = −2.33，p = 0.010 | 同上 | L1356–1357 | 「A Welch’s t-test not assuming equal variances (t(207) = -2.33, 𝑝 = 0.010)」 |
| 5 | Mann-Whitney | U = 4547.50，p = 0.019 | 同上 | L1357–1358 | 「a non-parametric Mann-Whitney U test (U = 4547.50, 𝑝 = 0.019) also corroborated the primary analysis.」 |
| 6 | 檢定力 | 以預先設定的 α = 0.05、power = 0.8、d = 0.5 算，單尾需 102 人、雙尾需 128 人 | — | L1343–1348 | 「we needed 102 participants in total for one-sided hypothesis testing (128 for two-sided testing), which our study surpassed.」 |
| 7 | 熟悉度不預測成績（無效果） | 全體 r = 0.004，p = 0.955；實驗組 r = −0.075，p = 0.461；對照組 r = 0.094，p = 0.338 | 自評熟悉度對測驗成績 | L1339–1342 | 「We did not see evidence that the self-reported familiarity with diffusion models could predict learning outcomes」 |
| 8 | 測驗分數分布 | 全體平均 59.6%（SD 16.6%），最高 93.8%（32 題對 30 題），沒有天花板效應 | — | L1419–1422 | 「the highest score was 93.8% (30 out of 32), and the average was 59.6% (SD = 16.6%).」 |

原文沒有給 d 的信賴區間、各組的標準差、t 值（Student's）。

### 次要結果：認知負荷問卷（Table 1，PDF 第 12 頁，已對 layout 文字）

填答者 55 人，每人最多貢獻兩筆（每種教材一筆）。b = 實驗 − 對照，負值代表實驗教材評分較低。

| 量表 | 對照 M (SD)，n | 實驗 M (SD)，n | b | SE | z | p（雙尾） | d [95% CI] |
|---|---|---|---|---|---|---|---|
| 內在負荷 IL | 6.25 (1.79)，47 | 5.88 (2.22)，37 | −0.412 | 0.191 | −2.155 | .031 | −0.220 [−0.468, −0.028] |
| 外在負荷 EL | 3.99 (2.09)，47 | 3.27 (2.08)，38 | −0.635 | 0.297 | −2.137 | .033 | −0.308 [−0.662, −0.037] |

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 9 | 多重比較校正 | 兩個負荷結果做 Benjamini-Hochberg 後調整 p = 0.033；連主要測驗一起三個檢定，調整 p 也都是 0.033 | L1375–1379 | 「all three results remain significant (adjusted 𝑝 = 0.033).」 |
| 10 | 預註冊的成對 t 檢定（只限兩份都看完的人，單尾）：內在負荷 | 29 對；對照 M = 6.29（SD 2.08），實驗 M = 5.86（SD 2.44）；t(28) = −2.10，p = .022，d = −0.39，雙尾 95% CI [−0.84, −0.01] | L1381–1383 | 「The paired ttest revealed a significant difference in the predicted direction」 |
| 11 | 同上：外在負荷 | 30 對；對照 M = 3.84（SD 2.11），實驗 M = 3.27（SD 2.29）；t(29) = −1.77，單尾 p = .044，d = −0.32，**雙尾 95% CI [−1.23, 0.09]（含 0）** | L1384–1386 | 「This difference was also significant: 𝑡 (29) = −1.77, 𝑝 = .044, 𝑑 = −0.32, twosided 95% CI [−1.23, 0.09].」 |

### 探索性結果（§6）

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 12 | 分主題：DDPM 理論差最多 | d = 0.62（實驗 > 對照）。這是十個主題裡唯一給了數字的 | L1394–1396 | 「The greatest difference between the quiz performance was on the topic of DDPM theory, where the experimental group outperformed the control group with a Cohen’s 𝑑 of 0.62.」 |
| 13 | 其他提到的主題 | Fokker-Planck、Euler-Maruyama、ULA 也是實驗組較好（沒有數字）。其餘主題沒有逐一報告 | L1398–1411 | 「Two topics with similar trends are Fokker-Planck and Euler-Maruyama.」 |
| 14 | 作者自己加的但書 | 每個主題只有 2 到 4 題，只能當提示 | L1412–1414 | 「these topic-level comparisons should be treated as suggestive rather than conclusive.」 |
| 15 | 訪談：兩組都覺得內容本身難 | 多數人歸因於高等數學底子不足 | L1437–1446 | 「“I thought the topic itself was hard, both the material and the quizzes were difficult.”」（P01） |
| 16 | 訪談：實驗組 | 4 人裡 3 人說順序幫助了概念連貫；但有 2 人覺得節奏太快 | L1447–1449、L1463–1465、L1534–1535 | 「However, the feedback was not uniformly positive, with two experimentalgroup participants, perceiving the delivery as “fast-paced,”」 |
| 17 | 訪談：對照組 | 有人說內容「very fragmented」、主題之間難以連起來，尤其是從 DDPM 經 Euler-Maruyama 轉到 SDE 那一段 | L1536–1543 | 「P02 described the content as “very fragmented” while P04 noted difficulty "making connections between one topic to another".」 |

### 實驗前的教材審查（§4.2，L1010–1020）

- 8 位課程助教在不知道研究目的下看過影片草稿，多數認為整體教材清楚、直覺、有吸引力。
- 問偏好哪一份時**四對四平手**（L1018–1020：「panelists split evenly: four for each condition.」）。作者拿這點當「對照組不是稻草人」的證據（L1633–1636）。

### 從 Figure 2 讀出、原文沒有明寫的兩點（我的觀察，引用前要再確認）

- 對照順序用到的每一步轉換（MC→HTSM 4.58、HTSM→NCSM 3.25、NCSM→ULA 4.08、ULA→ALS 2.58、DDPM→EM 4、EM→SDE 3.5、SDE→AR 3.17、SDE→FP 3.17）都是複雜度圖裡保留下來的邊，也就是沒有被當成「違反先備關係」刪掉。所以這個實驗比的不是「守先備關係對不守」，而是兩條都被評分者認為教得通的路徑裡，轉換成本總和低、同一群概念連著教的那一條，對上照發展史的那一條。
- 圖上標的成本我自己加總：PATHOS 順序約 30.84，對照順序約 34.33（各含段落起始成本）。原文沒有給這兩個總和。

## 作者自己列的限制

§7.1（L1604–1645）與 §7.2（L1660–1690）：

1. 不主張 PATHOS 產出最佳順序。7 點量表評分只是 element interactivity 的近似（L1606–1609）。
2. 邊的權重靠專家判斷，評分者分歧不小（平均 SD 1.53），「changes to a few ratings could have produced a different minimum spanning tree and thus a different instructional sequence」（L1609–1612）。
3. 結果可能反映的是對照順序差，而不是實驗順序好；訪談有支持這個可能的說法（L1620–1629）。作者的綜合判斷：對照是合理但在某些地方可能次佳的順序（L1638–1639）。
4. 「we also do not claim that PATHOS would produce a comparable advantage against an arbitrarily strong baseline instructional sequence」；PATHOS 不是設計來贏過已經長期教學迭代磨過的順序（L1639–1645）。
5. 單一課程、單一學校、樣本以男性為主、只有擴散模型一個主題；能否推到其他主題、學校、教師未知（L1660–1668）。
6. **優勢能否持續更久未知**（L1668–1669）。
7. 其他有結構、刻意處理順序的方法可能一樣有效（L1669–1670）。
8. 測驗是研究團隊自編，不是標準化測驗；雖有獨立專家核過，仍可能無意中偏向某一順序（L1670–1675）。
9. 認知負荷是次要結果，問卷不計分、自願，回收率低於測驗，填答者可能和沒填的人有系統性差異；是自陳、可能有回溯偏誤（L1676–1680）。
10. 兩組在同一門課，三週內可能互相討論或分享教材；作者認為這種汙染只會讓兩組更像，所以真實效果可能不低於量到的（L1682–1690）。
11. 訪談樣本小而且是自己報名的（L1553–1554）。
12. 建一條 PATHOS 順序「requires significant time investment」（L1701–1702）。

## 與摘要說法不一致的地方

逐項對過，數字本身（N = 209、p = 0.011、d = 0.32）與內文一致。以下是摘要沒交代或內文自己對不上的地方：

1. **測驗時間點內文前後不一**。§4.1 兩次寫測驗在第一份教材之後「immediately」舉行（L706、L714）；§4.3 寫「three weeks after the first diffusion tutorial」（L1026）；§7.2 寫「the three-week period between tutorial release and the learning assessment」（L1684）。教材分兩週釋出，所以比較說得通的讀法是「教材開始釋出後三週、交叉之前」，離看完最後一支影片大約一週；但原文沒有講清楚。引用時不要寫「立即後測」，也不要寫「三週後的延後測驗」。
2. **摘要的「N = 209」是同意且到考的人數**，被隨機分派的是 448 人（L701–703）。摘要沒有寫 448，也沒有寫 p = 0.011 是單尾。
3. **摘要說學生「reported significantly lower intrinsic and extraneous cognitive load」**，沒有交代那是 55 位自願填答者（209 人的 26%，448 人的 12%）、在交叉之後填的問卷，而且分析方法偏離了預註冊（L1262–1279）。這一項不是隨機分派下的比較：填兩份教材評分的人是自己選擇兩份都看的（L1262–1264）。
4. **摘要說「sequencing alone can meaningfully improve learning outcomes」**；內文承認兩個版本的轉場段落不同（L1231–1233），而且測驗題是自編的。「alone」是在這個限度內成立。
5. 每個主題的題數：§4.3 寫 3 到 4 題（L1044），§4.5 與 §6.1 寫 2 到 4 題（L1285、L1412）。
6. 檢定力分析用的是預設的 d = 0.5（需 102 人），實際量到的是 d = 0.32。原文稱之為 post-hoc power analysis（L1343–1344），但算的是偵測 d = 0.5 所需人數。
7. 探索性分析解釋 DDPM 理論的差異時說實驗組「had already constructed schemas for the prerequisite concepts」（L1396–1398），但在 PATHOS 的生成森林裡 DDPM 自成一段，沒有任何邊從別的概念連過去（Figure 2b）；DDPM 排在最後是教師決定段落先後的結果，不是演算法從先備關係推出來的。

## 與清單「要撐的結論」不合的地方

清單寫：「照先備結構排勝過照發展史講（d = 0.32，單尾）」。

- **數字撐得住**：d = 0.322，單尾 p = 0.011（L1349–1352）。
- **「單尾」這個但書可以放輕**：雙尾也顯著（p = 0.021），Welch 與 Mann-Whitney 也一樣（L1355–1358）。真正該帶的但書是別的：
  1. 「照先備結構排」不精確。PATHOS 是「在不違反先備關係的轉換裡，用專家評的轉換難度求最小生成樹，並讓同一群概念連著教完」。對照順序的每一步轉換也在保留下來的邊裡（見上面我的觀察）。較準確的寫法：「用專家評估的轉換難度排出來的順序，勝過照研究發展史的順序」。
  2. 分析的是 448 位被分派者裡到考且同意的 209 人（47%）。
  3. 差距是答對率 62.6% 對 57.3%，自編的 32 題選擇題，測驗在教材釋出後三週；沒有更長期的保留資料。
  4. 單一學校、單一課程、單一主題、一次實驗，尚未有複製。
  5. 作者自己說不主張對更強的基準也有同樣優勢，也承認結果可能部分來自對照順序在某些地方較差。8 位助教事前看教材時偏好是四比四。
  6. 排順序的輸入是 12 位評分者的主觀評分，分歧不小（平均 SD 1.53／7），改幾個評分就可能排出不同順序。
- 清單「之前讀到哪」提到結果統計段與分析樣本數沒讀清楚：這次已讀清楚，樣本與統計都在 §5（L1327–1359），Table 1 只管認知負荷問卷，不是學習成績。

## 讀取紀錄

- plain 檔依序讀完：L1–L560（首頁、摘要、§1、Figure 1 的圖內文字與圖說、§2.1–2.4、§3.1、§3.2 前段）→ L560–L1200（§3.2 後段、§3.3、§4.1、Figure 2 與 Figure 3 的圖內文字與圖說、§4.2、§4.3、§4.4 前段、Figure 4）→ L1200–L1730（§4.4 後段、§4.5、§4.6、§5、§6.1、§6.2、Table 1、§7.1、§7.2、§8、致謝、參考文獻開頭）→ L1730–L1892（參考文獻 [5]–[56]，只掃過）。四段首尾相接，涵蓋全文。
- **對過 PDF 的表與圖**：Table 1（第 12 頁，`pdftotext -layout` 單頁輸出逐格對過）；Figure 2 三個面板（第 7 頁影像：兩種順序的編號與邊的成本）；Figure 4（第 9 頁影像：對照順序與 MIT 6.S184、Stanford CS236 的對照）。§5 開頭的受試者段（221／209／100／109、χ²、年齡、性別、熟悉度）另用第 10 頁的 layout 輸出核過；主要檢定那一段只讀了 plain 檔。
- 論文沒有附錄。補充材料（GitHub）與預註冊文件沒有取、沒有讀。
- 原本的 `-layout` 雙欄檔沒有拿來讀；兩份文字來自同一個 PDF。
