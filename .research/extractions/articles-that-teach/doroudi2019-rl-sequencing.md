# 抽取紀錄：Doroudi、Aleven、Brunskill 2019，Where's the Reward? A Review of Reinforcement Learning for Instructional Sequencing

- **書目**：Shayan Doroudi、Vincent Aleven、Emma Brunskill（作者全名對過作者稿首頁 L4–5 與出版者頁）。*International Journal of Artificial Intelligence in Education*，29 卷，568–620 頁，2019-11-14 刊出。DOI 10.1007/s40593-019-00187-x。
- **原文檔**：`.research/raw/learning-content/q4-time/doroudi2019-rl-sequencing-review.txt`（2,287 行、194,937 字元、195,634 位元組）。來源是第一作者在 UCI 的個人頁（檔頭 L1 的網址），單欄版面，`pdftotext -layout` 轉出後段落沒有交錯。
- **版本**：作者稿（post-peer-review, pre-copyedit，L49–51 自述），40 頁。刊出版是混合開放取用（Unpaywall 標 hybrid）；Springer 的 PDF 直接抓會被機器人驗證擋下，改用 Exa 讀出版者頁的 HTML，只拿來對 4.2 節的幾個計數句（見「與摘要說法不一致的地方」）。行號一律是作者稿文字檔的行號。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 18（系列的順序）

## 研究設計

- **類型**：文獻回顧，兩部分。前半是歷史敘述（三波研究），後半是對實證研究的系統性整理，用「計票」方式（各研究顯著／不顯著的篇數），**沒有合併效果量，不是統合分析**。分群是作者自己說的「qualitatively cluster」（L488）。
- **回顧的動機**（L386–389）：作者自己在分數教學系統上跑了兩個實驗，都沒有顯著差異，想知道原因。「This review of the empirical literature was prompted by two experiments on RL-induced instructional sequencing that we ran in a fractions intelligent tutoring system. Both experiments resulted in no significant differences among the policies we tested.」
- **納入標準**（L417–437）：對照實驗，至少一個教學策略（policy）是用強化學習類方法得出的；四個條件——(1) 承認有一個學生學習模型；(2) 有一個把學生過去的觀察對應到教學動作的策略；(3) 用學生資料（離線或線上）學出模型或策略；(4) 若有模型，策略是對該模型近似最佳化。用啟發法（例如只看下一步的 myopic）求策略的也收；**參數是人手設定的不收**（L436–437），所以例如用手設參數的 BKT 做精熟學習不算。
- **檢索方式**（L438–445）：不是資料庫檢索。從作者已知的論文出發，對每篇做一步前向與後向引用追蹤，引用資料以 Google Scholar 2018 年 12 月為準。作者自己說：「if we have missed any relevant studies, they are disconnected (in terms of direct citations) from the studies that we have identified.」
- **納入數量**（L455–456）：「We found 34 papers containing 41 studies that matched our criteria, including a previously unpublished study that we ran on our fractions tutoring system」。
- **沒納入的相關論文**（L458–465）：19 篇只在離線資料上學策略、沒在真人身上測；至少 23 篇只用模擬資料；至少 8 篇只是提案；至少 14 篇有真人但不合標準（非實驗、條件間不只差在策略、參數手設）。腳註 6 列出的 14 篇裡有 Settles & Meeder 2016、Corbett & Anderson 1995、Lomas 等 2012。
- **受試者與教材**：各研究不同，見 Table 3–7。受試者數欄記的是「人數最少那一組的人數」（L600–601），不是總人數。
- **比較對象**：基準策略分五種代號（L596–600）——R 隨機、H 啟發法或專家設計、S 學生自選、RL+ 另一研究證實有效的 RL 策略、RL− 刻意把報酬最小化的 RL 策略。
- **量了什麼**（L1766–1772）：後測分數、學習增益、標準化學習增益、達到某完成度所需時間、介入期間的表現、每題時間。一個研究報告多個結果變項時，作者只挑一個，「tending to favor the outcome variable closest to what the instructional policies were directly optimizing」。
- **「顯著程度」五類的定義**（Table 2 圖說，L528–533）：Sig＝至少一個 RL 策略顯著勝過**所有**基準；ATI＝整體不顯著但對低成就學生顯著較好；Mixed＝勝過部分基準但不是全部；Not sig＝沒有顯著差異；Sig worse＝RL 策略顯著較差。

## 結果（逐項）

Table 2–9 都對過作者稿 PDF 版面（第 10–15、32–33 頁轉成圖檔逐列看），下列數字與文字檔一致。

### 整體計票（4.2 節，Table 2，L520–533）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 全部 41 個研究的分布 | Sig 21、ATI 4、Mixed 4、Not sig 11、Sig worse 1（合計 41） | RL 策略 vs 各研究自己的基準 | Table 2，L521 | 「All Studies 21 4 4 11 1」 |
| 2 | 作者的總結句 | 「過半」 | 同上 | L483 | 「Thus, over half of the studies found that adaptive policies outperform all baselines that were tested.」（21／41＝51%，是我算的，原文沒寫百分比） |
| 3 | 顯著研究的效果量 | 「常常」d ≥ 0.8，沒有給合併值 | 同上 | L484–486 | 「the studies that found a significant difference, as well as those that demonstrated an aptitude-treatment interaction, often found a Cohen's d effect size of at least 0.8」 |
| 4 | 唯一 RL 較差的研究 | Mettler 等 2011，d = −0.68 | 以 Atkinson 1972b 模型（有擬合資料）為 RL 策略 vs ARTS 策略（沒擬合資料，所以被歸為基準） | 腳註 7，L510–514；Table 9，L1906 | 「the "baseline" in this case was actually an adaptive policy that the authors developed」 |

### 五個群集（Table 2，L522–526）

| # | 群集 | Sig | ATI | Mixed | Not sig | Sig worse | 小計 |
|---|---|---|---|---|---|---|---|
| 5 | 配對聯想學習（內容彼此獨立，如單字卡） | 11 | 0 | 0 | 2 | 1 | 14 |
| 6 | 概念學習任務 | 4 | 0 | 2 | 1 | 0 | 7 |
| 7 | **排相依內容（Sequencing Interdependent Content）** | **0** | 0 | **2** | **6** | 0 | **8** |
| 8 | 排活動類型（內容順序固定，只決定做例題還是解題等） | 4 | 4 | 0 | 2 | 0 | 10 |
| 9 | 目標不是學習成效 | 2 | 0 | 0 | 0 | 0 | 2 |

### 排相依內容群集逐列（Table 5，L699–706；技術細節 Table 9，L1881–1905）

這一群最接近「一門課的單元順序」。作者的描述（L780–781）：「The sequencing task here is closest to traditional "curriculum sequencing," or ordering various content areas for a given topic.」

| # | 研究 | 領域 | 受試者 | 場域 | 基準 | 最少組人數 | 結果 | Table 9 的效果 |
|---|---|---|---|---|---|---|---|---|
| 10 | Green 等 2011 實驗 1 | 有限體算術 | 大學生 | 實驗室 | 隨機、啟發法 | 26 | Mixed | 對隨機 d ≈ 3.9；對啟發法不顯著 |
| 11 | Green 等 2011 實驗 2 | 人造語言 | 大學生 | 實驗室 | 隨機、專家 | 5 | Mixed | 對隨機「?」（作者查不出）；對專家不顯著 |
| 12 | Clement 等 2015 | 算術（硬幣） | 7–8 歲 | 課堂 | 難度遞增 | 133 | Not sig | — |
| 13 | David 等 2016 | 基礎數學 | K–12 | 課堂 | 難度遞增 | 35 | Not sig | — |
| 14 | Schatten 2017 | 基礎數學 | K–12 | 課堂 | 專家 | 49 | Not sig | — |
| 15 | Doroudi 等 2017a | 分數 | 四、五年級 | 課堂 | 螺旋難度 | 69 | Not sig | — |
| 16 | 附錄 B（本文作者未發表的實驗） | 分數 | 四、五年級 | 課堂 | 螺旋難度 | 100 | Not sig | — |
| 17 | Segal 等 2018 | 數學 | 七年級 | 課堂 | 難度遞增 | 9 | Not sig | — |

| # | 結果 | 位置 | 原文一句 |
|---|---|---|---|
| 18 | 這一群最不成功 | L794–796 | 「the studies in this cluster have been the least successful, with all of them resulting in either a mixed result or no significant difference between policies.」 |
| 19 | 作者對這一群的判定 | L867–868 | 「when it comes to sequencing interdependent content, there is not yet evidence that RL can induce instructional policies that are significantly better than reasonable baselines.」 |
| 20 | 兩個 Mixed 的內容 | L916–918 | 「The only exceptions to this were the lab studies run by Green et al. (2011) with university students, which actually showed that RL-induced policies did outperform random policies but not expert hand-crafted or heuristic baselines.」 |
| 21 | 結論裡的說法 | L1146–1153 | 「for sequencing interdependent content, we have yet to see if a data-driven approach can drastically improve upon other ways of sequencing such as expert-designed non-adaptive curricula. While the order of content almost certainly matters for domains with interconnected content (like mathematics), it can be difficult to identify good ways to adaptively sequence content with typical amounts of data.」 |
| 22 | 八個裡有兩個是作者自己的實驗 | Table 5 | Doroudi 等 2017a 與附錄 B |

### 其他群集的重點

| # | 結果 | 位置 | 原文一句 |
|---|---|---|---|
| 23 | 配對聯想：14 個裡 11 個 RL 勝 | L629、L655 | 「in 11 out of 14 studies, RL-induced policies outperformed baseline policies.」 |
| 24 | 配對聯想兩個不顯著的研究都用不含遺忘的 OEM 模型 | L655–658 | 「the model that was used was the OEM model—a simple model that does not account for forgetting and hence cannot space instruction of paired-associates over time.」 |
| 25 | 配對聯想群的基準多為隨機 | Table 3，L580–593 | 14 列裡基準只有 R 的 8 列；含 H 的有 Pavlik & Anderson 2008、Lindsey 等 2014、Lindsey 2014、Mettler 等 2011（我依表數的） |
| 26 | Lindsey 等 2014（八年級西班牙文單字，課堂） | Table 8，L1807–1809 | 對表現最好的基準（間隔排程）d = 1.05；基準是 A 集中、B 間隔 |
| 27 | Lindsey 2014（博士論文） | Table 8，L1810–1813 與腳註 d | 對隨機 d = 0.18；「The effect is likely deflated as students found a way to skip review words」 |
| 28 | 概念學習：多數勝過「某些」基準 | L734–741 | 「there was no one POMDP policy that outperformed baseline policies for all concept learning tasks. This study indicates that even though RL-induced policies may be effective, the same model may not be optimal for all tasks.」 |
| 29 | Sen 等 2018 的效果量很小 | Table 8，L1829–1833 | 對專家 d = 0.16、對隨機 d = 0.14（歸在 Sig） |
| 30 | 排活動類型：10 個裡 4 Sig、4 ATI | L834–836 | 「most of the studies in this cluster found either that RL-induced policies significantly outperformed baseline policies (four out of ten) or that there was an aptitude-treatment interaction favoring the RL-induced policy (four out of ten).」 |
| 31 | 這一群的基準：隨機或刻意做差的 | Table 6，L759–768 | 10 列的基準是 RL−（3 列）或 R（7 列），沒有一列是啟發法或專家 |
| 32 | 作者對這一群的保留 | L836–841 | 「it is not known if the RL-induced adaptive policies explored in this cluster would do better than a more reasonable heuristic (e.g., as suggested by the expertise-reversal effect).」 |
| 33 | 目標不是學習的兩個研究 | L851–852 | 「these two papers do not shed light on whether RL can be used to significantly improve student learning over strong baseline policies.」 |

### 基準強弱（5.3 節，L930–958）

| # | 結果 | 數字 | 位置 | 原文一句 |
|---|---|---|---|---|
| 34 | 有顯著或 ATI 的研究，多半只比了弱基準 | 24 個裡 17 個（71%） | L932–935 | 「Among the 24 studies that found a significant effect or aptitude-treatment interaction, 17 of them (71%) compared adaptive RL-induced policies to a random baseline policy and/or other RL-induced policies that have not been shown to perform well, rather than comparing to state-of-the-art baselines.」 |
| 35 | 沒有顯著的研究裡，只比弱基準的比例 | 6 個（35%） | L935–936 | 「among the studies that did not find a significant effect, only 6 of them (35%) only compared to random or RL-induced baseline policies.」 |
| 36 | 作者的推論 | — | L936–938 | 「This suggests that while the ordering of instructional activities matters, it does not give us insight into whether RL-based policies lead to substantially better instructional sequences than relying on learning theories and experts for sequencing.」 |
| 37 | 有些基準是故意做差的 | Chi 等 2010a、Lin 等 2015、Geana 2015 | L939–941 | 「researchers intentionally compared to baseline policies designed to perform poorly (e.g., by minimizing rewards according to a MDP)」 |
| 38 | 隨機不一定是爛基準 | — | L942–947 | 「random sequencing is not always unreasonable. … in paired-associate learning tasks, random policies may be reasonable because they happen to space problems fairly evenly.」 |
| 39 | 勝過合理基準最成功的例子在配對聯想 | Lindsey 等 2014、Pavlik & Anderson 2008 | L951–958 | 「The most successful cases of demonstrating that RL-induced policies can outperform reasonable baselines are in the context of paired-associate learning tasks.」但緊接著說還沒有人比過 Leitner 與 SuperMemo。 |

### 先備知識與場域（5.2 節，L900–928）

| # | 結果 | 位置 | 原文一句 |
|---|---|---|---|
| 40 | 課堂場域的成功率低 | L923–928 | 「only three out of 15 studies that were run in classroom settings found an RL-induced policy was significantly better than baselines and four found aptitude-treatment interactions.」 |
| 41 | 相依內容群幾乎都是 K–12 基礎數學，學生在系統外也在學 | L914–916 | 「almost all of the studies in the sequencing interdependent content cluster were on basic K-12 math skills, where the student was also presumably learning the content outside of using the systems in the studies.」 |
| 42 | 作者的解釋（推測語氣） | L901–902 | 「RL may have more room for impact in instructional settings where students are learning material for the first time」 |

### 學習者自選（6.1 節，L1074–1104）

| # | 結果 | 位置 | 原文一句 |
|---|---|---|---|
| 43 | 41 個研究裡只有一個把 RL 策略拿去對完全由學習者控制的策略 | L1078–1081 | 「only Atkinson (1972b) compared an RL-induced policy to a fully learner-controlled policy, and he found that while the learner-controlled policy was 53% better than random, it was not as good as the RL-induced policy (108% better than random).」Table 8 把同一比較記成「1vB: 36% increase」（L1790）。 |
| 44 | Green 等 2011：給不給學生三選一，專家策略都勝過隨機 | L1087–1089；Table 9 腳註 b | 「expert policies do better than random policies, regardless of whether either policy made all decisions or gave the student a choice of three actions to take.」 |

### 附錄 B：作者自己的分數教學實驗（L2135–2282）

| # | 項目 | 內容 | 行號 |
|---|---|---|---|
| 45 | 系統 | Fractions Tutor，四、五年級分數；三個主題（做出與命名分數、等值與比較、分數加法）；155 個活動，策略每一步從 155 個裡挑一個 | L2149–2162 |
| 46 | 先期資料 | 一千多名學生；前 26 個活動照先備關係圖、其餘 130 個均勻隨機不重複 | L2165–2181 |
| 47 | 第一個實驗 | 三百多名學生、五種策略，後測沒有顯著差異（另文 Doroudi 等 2017a） | L2138–2140、L2182–2184 |
| 48 | 基準策略 | 只給歸納與精煉類題目，依三個主題輪轉（螺旋），主題內隨機 | L2193–2198 |
| 49 | 基準組做的題數較多 | 基準組平均約 48 題，其他策略平均 28 題以下 | L2211–2212「students who had the baseline policy, did around 48 problems on average, whereas for all the other policies, the average was 28 problems or less.」 |
| 50 | 第二個實驗的新策略 | 依前次實驗的平均作答時間由短到長排題，加一條規則：題目涉及的技能用 BKT 判斷都已精熟（門檻 0.9）就跳過 | L2221–2227 |
| 51 | 事前模擬的預測 | 新策略比基準高 0.31 到 2.23 分（滿分 16），多數模型預測至少 1 分 | L2230–2233 |
| 52 | 第二個實驗結果 | 220 名四、五年級學生。後測：基準 8.12、新策略 7.97（滿分 16）。學習增益：基準 1.32、新策略 1.55，差異不顯著 | L2236–2243「students assigned the baseline policy had a mean posttest score of 8.12 (out of 16) and students assigned the new adaptive policy had a mean posttest score of 7.97 … While there was a positive difference in learning gains, it was not significant.」 |
| 53 | 作者的事後解釋一 | 學生群體與擬合模型用的舊資料不同；某個學區的預測差距本來就小得多 | L2247–2253 |
| 54 | 作者的事後解釋二 | 「耗時短的題目」在舊資料裡是學生做過很多題之後才遇到的；放到最前面，學生花的時間長得多 | L2260–2266「problems given early on were taking students much longer than those same problems took for students in our first experiment or in the baseline condition.」 |

原文沒有給第二個實驗的檢定統計量、p 值、標準差與各組人數（Table 5 只記最少組 100 人）。

### 作者歸納的六個條件（5.5 節，L994–1010）

RL 比較有幫助的情況：(1) 排程問題受到限制（狀態或動作空間小）；(2) 學習模型有心理學理論依據；(3) 心理學或學習科學的原則指出該情境裡順序重要；(4) 學生先備知識少（但足以從軟體學到東西）；(5) **比的是相對弱的基準**；(6) 部署前用較穩健的方式評估過。作者明說第 5 條是該避免的做法（L1014–1016）：「Others suggest practices that are actually best to avoid—such as using weak baseline policies when stronger baselines are available」。

### 歷史敘述（第 3 節，L276–377）

三波：1960–70 年代（教學機、CAI、數學心理學；Howard、Smallwood、Atkinson、Suppes）；1990–2010 年代（智慧家教系統、RL 成為領域、EDM／AIED）；2010 年代起（MOOC、深度 RL、深度學習）（Table 1，L282–298）。1970 年代中到 2000 年代初幾乎沒有相關研究（L332）。作者對第三波的態度（L372–373）：「we do not think these factors are sufficient for RL to leave its mark」。

## 作者自己列的限制

原文沒有 Limitations 節。散在各處、作者自己承認的：

1. 檢索靠引用追蹤，與已知論文沒有直接引用關係的研究會漏掉（L444–445）。
2. 「什麼算 RL 策略」的界線是作者劃的，收的是有 RL「味道」的研究（L404–413）。
3. 分群是質性的，作者承認還有別的分法（L543–546）。
4. 每個研究只挑一個結果變項，偏向挑策略直接最佳化的那個（L1770–1772）。
5. 有些效果量或細節從原論文推不出來，表中記「?」（L1861）；Geana 2015 的一個比較原文沒報顯著性，作者記「Not sig?」（L1914）。
6. 顯著的研究多半只贏過弱基準，所以計票結果不能說明 RL 勝過專家或理論（L936–938、L1154–1158）。
7. 對各群成敗的解釋（心理學理論、先備知識、資料量）都用推測語氣：「could, at least in part, be explained by」（L875–876）、「This could be in part due to」（L868–872）。
8. Chi 等 2009 其實是準實驗，基準策略先跑、資料拿來導出適應策略（Table 9 腳註 c，L1911–1912）。
9. Chiang 1974 實驗 2 的後測沒有顯著差異，因為反應時間有顯著差異才被歸為 Sig（Table 8 腳註 b，L1836–1837）。
10. 作者自己的穩健評估方法（REM）在附錄 B 的實驗裡預測失準（L979–991、L2274–2276）。

原文沒有說：沒有評估各研究的品質或偏誤風險；沒有處理出版偏誤（計票法對此特別敏感）；沒有說明分類由幾個人編碼、有沒有一致性檢查。

## 與摘要說法不一致的地方

摘要（L16–35）的幾句話與內文逐項對過：

1. 摘要「over half of the studies found that RL-induced policies significantly outperform baselines」：內文是 21／41，剛過半；而且摘要沒有提 5.3 節的但書（顯著的研究 71% 只比了弱基準）。摘要只讀得出「過半有效」，讀不出「多半贏的是隨機」。
2. 摘要沒有提「排相依內容」這一群 0／8 的結果，只寫「varying levels of success」。
3. **內文的計數句自相矛盾**（作者稿與 Springer 刊出版 HTML 都一樣）：
   - L474「Twenty-one of the 36 studies」：前一段與 Table 2 都是 41 個研究，36 應是筆誤。
   - L481「Ten studies found no significant difference」：Table 2 與 Table 9 逐列數都是 11。
   - L932「Among the 24 studies that found a significant effect or aptitude-treatment interaction」：Table 2 是 21 + 4 = 25。後一句的 6 個占 35%，推回分母是 17；24 + 17 = 41，所以這一段是用 24／17 的切法，與 Table 2 的 25／16 差一個研究，原文沒有解釋。5.3 節這一句我沒有在刊出版裡對到（Exa 取回的出版者頁在 5.1 節截斷）。
4. Table 3 把「R/S」（含學生自選）記在 Atkinson & Lorton 1969 那一列、Atkinson 1972b 記「R」（L581–582）；但 Table 8 裡有「Student Choice」基準的是 Atkinson 1972b，Atkinson & Lorton 1969 的基準只有 Cycle（L1789–1792）；內文 L1078–1079 也說只有 Atkinson 1972b 比過學習者控制。Table 3 這兩列的基準代號看來互換了，原文沒有更正。
5. Table 7 的圖說寫「not maximizing learning cluster」，Table 2 寫「Not Optimizing Learning」，節標寫「Maximizing Other Objectives」，三處名稱不同，指同一群。

## 與清單「要撐的結論」不合的地方

清單寫的是：「演算法排相依內容沒有贏過人排；顯著的研究多半只贏過弱基準」，標註「相依內容 0／8」。

- **「相依內容 0／8」**：撐得住，Table 2 與 Table 5 都是 8 個研究、Sig 為 0。要補的條件：
  - 0／8 的意思是「沒有一個研究顯著勝過**所有**基準」。其中 2 個（Green 等 2011）勝過隨機排序（實驗 1 對隨機 d ≈ 3.9），只是沒勝過啟發法或專家排的順序。所以不能寫成「演算法排的與亂排一樣」。
  - 「人排」要寫清楚是什麼：6 個不顯著的研究的基準是難度遞增（3 個）、專家（1 個）、螺旋難度（2 個）；都是不隨學生調整的固定順序。
  - 8 個裡 2 個是本文作者自己的實驗；6 個課堂研究都是 K–12 數學；最少組人數從 5 到 133。
  - 原文的用詞是「not yet evidence」「we have yet to see」，是「還沒有證據顯示更好」，不是「證明了沒有用」。這是計票，不是統合估計，沒有合併效果量與信賴區間。
  - 原文同時說順序本身很可能重要：「the order of content almost certainly matters for domains with interconnected content (like mathematics)」（L1151–1152）。這篇不支持「順序不重要」。
- **「顯著的研究多半只贏過弱基準」**：撐得住，數字是 24 個裡 17 個（71%），出處 5.3 節。引用時要連著分母寫，並註明這個 24 與 Table 2 的 25 差一個（見上）。另外原文也說隨機在某些情境不算弱基準（L942–947）。
- 清單沒提、但寫文章時容易誤用的地方：
  - 這篇回顧的對象是**強化學習類、用資料學出來的適應性排程**，手設參數的精熟學習、知識空間產品（如 ALEKS）都不在納入範圍。它不能拿來說「所有適應性學習系統排序都無效」。
  - 配對聯想（單字卡式複習排程）是成功率最高的一群（11／14），而且有課堂研究對間隔排程基準 d = 1.05（Lindsey 等 2014）。同一篇回顧同時支持「排獨立項目的複習時機有效」與「排相依內容的順序還沒看到效果」。

## 讀取紀錄

依序讀過（作者稿文字檔行號）：

- L1–330：檔頭、摘要、第 1 節、第 2 節（含 2.1、2.2）、第 3 節前半、Table 1
- L330–700：第 3 節後半、第 4 節（4.1 納入標準、4.2 結果與腳註 3–7）、Table 2、4.2.1、Table 3、Table 4、4.2.2 開頭
- L700–1100：Table 5、4.2.2 後半、4.2.3、Table 6、4.2.4、Table 7、4.2.5、第 5 節（5.1–5.5）、第 6 節開頭、6.1 前半
- L1100–1329：6.1 後半、6.2、6.3、第 7 節結論、致謝、參考文獻開頭（A 到 Corbett）
- L1330–1749：參考文獻其餘部分，**沒有讀**（說明允許只掃過；這一段我沒有逐條看）
- L1750–2287：參考文獻最後幾條、附錄 A（Table 8、Table 9 與全部腳註、A.1、A.2、A.3）、附錄 B（B.1–B.5）全文

對過 PDF 版面的表：Table 2（第 10 頁）、Table 3（第 11 頁）、Table 4（第 12 頁）、Table 5（第 13 頁）、Table 6（第 14 頁）、Table 7（第 15 頁）、Table 8（第 32 頁，橫排）、Table 9（第 33 頁，橫排）。逐列數過：Table 8 共 21 列、Table 9 共 20 列，合計 41；Table 9 裡 Not sig 11 列。Table 1 是文字表，文字檔可讀，沒有另外對圖。作者稿 PDF 重新從檔頭網址下載，放在 scratch 目錄，沒有存回 raw。
