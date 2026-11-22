# 抽取紀錄：Davis、Chen、Hauff、Houben 2018，Computers & Education（文獻回顧）

- **書目**：Dan Davis（通訊作者）、Guanliang Chen、Claudia Hauff、Geert-Jan Houben（作者全名對 PDF 刊出版首頁與 TU Delft 封面頁核過，四位都屬 TU Delft）。2018。Activating learning at scale: A review of innovations in online learning strategies。*Computers & Education* 125, 327–344。DOI 10.1016/j.compedu.2018.05.019。收稿 2017-08-05、修訂 2018-04-05、接受 2018-05-28、線上 2018-06-01。
- **原文檔**：`.research/raw/learning-content/q5/davis2018-activating-tud.txt`，1,817 行、94,637 字元（96,155 位元組）；同名 `.pdf`，20 頁（第 1 頁是 TU Delft 封面，期刊頁 327–344 對應 PDF 第 3–20 頁）。
- **來源網址**：`https://repository.tudelft.nl/file/File_a9cf537f-342d-4ac3-8ebe-33bb5897d41e`（清單檔頭記錄）。封面頁 L10–40：「Document Version: Final published version」、「Green Open Access added to TU Delft Institutional Repository 'You share, we take care!' – Taverne project」，依荷蘭著作權法由作者機構公開。屬作者機構典藏的合法公開版本。
- **版本**：刊出版（Elsevier 排版）。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 21（留言區、論壇與社群）。清單 D 的 17#4「Davis 2018」是另一篇（The Half-Life of MOOC Knowledge），不是這篇，紀錄在 `davis2018-halflife.md`。
- **文字檔狀況**：單欄、不帶 `-layout` 的轉檔，正文可順讀；**表格被拆成一欄一段**（先列全部作者，再列全部 N、Env、Incentive、Result），要靠列序對齊。Table 4、7、8、9 與 Fig. 1、2 都直接看 PDF 頁面對過（見讀取紀錄）。

## 研究設計

- **類型**：系統性文獻回顧，**計票法**（vote counting：數各類別中顯著正向、無顯著、顯著負向的結果數）。沒有算效果量，沒有統合分析，沒有品質評估。有在 OSF 登錄（https://osf.io/jy9n6/，L206–207），資料與分析腳本公開。
- **研究問題**（L117）：「Which active learning strategies for digital learning environments have been empirically evaluated, and how effective are they?」
- **類別框架**（L118–144）：從 Hattie（2008）挑出十個「被 Hattie 認為有效、適合開放線上教育」的學習策略當分類。
- **檢索**（L121–140）：手動逐篇看 5 本期刊與 8 個會議（Table 1，L153–168）在 2009 到 2017 年 7 月間的所有論文。刊物是從已知研究的參考文獻滾雪球、加上詢問專家選出的，**不是關鍵字檢索**；作者理由是隨機對照試驗與成人樣本這兩個條件無法靠搜尋引擎索引篩出（L137–138）。
- **納入條件**（L123–126）：(1) 可擴充（不需人工評分、回饋或到場）；(2) 隨機對照實驗，各條件合計樣本至少 10 人；(3) 受試者至少 18 歲。
- **篩選結果**（L141–143）：7,706 篇中 126 篇（1.6%）符合，合計 132,428 名受試者。五篇同時歸入兩類，類別合計 131 篇（Table 2，L176–188）。
- **編碼維度**：實驗環境（ITS、Lab、LMS、Mobile、MOOC、Mturk、Native；L235–254）、參與誘因（$、Class、Credit、None、n/r；L255–264）、結果變項（期末成績、完成率、學習增益、考試分數、長期保留、遷移、ontrackness、各種投入、自我效能、效率；L265–300）。
- **分析方式**（L303–309）：除非另註，結果都是意向分析（ITT）；每個結果記成 +、∘、−。

## 結果（逐項）

### 全體

1. **126 篇，132,428 人**（L141–143）。
2. **環境與結果**（L195–199；Fig. 2a，PDF 第 6 頁對過）：MOOC 環境的結果 42% 正向、56% 無顯著、2% 負向；Native（專為研究做的系統）59% 正向、36% 無顯著、5% 負向。L196：「we see native environments yielding positive results at a much stronger rate than MOOCs (59% vs. 42% respectively)」。作者的兩個解釋（L197–199）：native 環境可為實驗量身打造；MOOC 研究都沒給參與誘因。
3. **樣本大小與結果**（L200–205；Fig. 2c）：500 人以上的研究正向結果 42%（無顯著 56%），10 到 100 人的研究 60%（無顯著 34%、負向 5%），卡方檢定 p < 0.05。101 到 500 人也是 60% 正向。L202–204：「We here find a statistically significant difference in the proportion of reported positive findings in large (42% in studies with 500 + participants) and small (60% in studies with 10–100 participants) studies using a χ 2 test ( p < 0.05).」卡方值與自由度沒報。
4. **誘因與結果**（L1511–1512；Fig. 2b）：無誘因的實驗 49% 正向、49% 無顯著、1% 負向；給錢的實驗 61% 正向、34% 無顯著、5% 負向。原文：「Compared to an even balance of positive and null findings in experiments without any incentive for the participant (49% + and 49% ∘), positive results are twice as likely as null results in experiments which provide a monetary incentive.」（61 對 34 是 1.8 倍，作者說「twice」。）
5. **每年篇數**（Fig. 1，PDF 第 5 頁）：2015 年最多（約 29 篇），2016 年約 20 篇；作者說 2015 到 2016 的下降原因只能臆測（L147）。

### 各類別（Table 2–12 與 4.1–4.10 節）

| 類別 | 篇數（Table 2） | 結果數 + / ∘ / − | 正向比例 | 所在 |
|---|---|---|---|---|
| Mastery Learning | 1 | 1 / 0 / 0 | — | Table 3，L325–348 |
| Meta-Cognitive Strategies | 24 | 15 / 20 / 3 | 39%（作者寫 23/38 = 61% 為無顯著或負向，L372） | Table 4，L393–531，PDF 第 9 頁 |
| Questioning | 9 | 7 / 7 / 0 | 50% | Table 5，L548–611 |
| Spaced vs. Massed | 1 | 1 / 0 / 0 | — | Table 6，L645–668 |
| Matching Learning Styles | 3 | 2 / 2 / 0 | 50% | Table 7，L688–721，PDF 第 11 頁 |
| Feedback | 21 | 14 / 22 / 2 | 37%（L738–739） | Table 8，L774–895，PDF 第 12 頁 |
| Cooperative Learning | 17 | 17 / 6 / 1 | 71%（L900、L1062） | Table 9，L903–1030，PDF 第 12–13 頁 |
| Simulations & Gaming | 18 | 19 / 9 / 0 | 68%（L1073） | Table 10，L1081–1189 |
| Programmed Instruction | 6 | 4 / 7 / 0 | 36% | Table 11，L1227–1275 |
| Interactive Multimedia | 31 | 28 / 12 / 4 | 64%（L1280） | Table 12，L1282–1460 |

（Cooperative、Simulations、Multimedia 的正向比例我用表頭計數驗算過：17/24、19/28、28/44。）

6. **結論的三大策略**（L1502–1506）：「we identify Cooperative Learning, Simulations & Gaming, and Interactive Multimedia as the three most promising strategies … 71% for Cooperative Learning, 68% for Simulations & Gaming, and 64% for Interactive Multimedia—compared to all other groups with more than one study which have an average of 43% positive results.」（我驗算：其他五類 39.5%、50%、50%、36.8%、36.4% 的不加權平均是 42.5%，與 43% 相符。）

### 跟社群、論壇、同儕有關的隨機實驗（逐列，Table 4、8、9 的列對齊已對 PDF）

這段回答清單的問題「裡面有沒有隨機分派社群功能的研究」。有，下列是 MOOC 或大規模環境中的隨機實驗，結果是本回顧的編碼（我沒有回原研究核對）：

7. **Kizilcec et al. 2014a**（Table 4，MOOC，N = 11,429，無誘因）：∘ 論壇參與、− 論壇參與。L373–374：「Kizilcec et al. (2014a) found a certain form of participation encouragement (collectivist-framed prompting) to actually decrease learners' participation in the course discussion forum.」
8. **Lamb, Smilack, Ho & Reich 2015**（Table 4，MOOC，N = 4,777，無誘因）：+ 論壇參與。正文沒有描述這篇。
9. **Coetzee, Fox, Hearst & Hartmann 2014**（Table 8 與 Table 10 都有，MOOC，N = 1,101，無誘因）：∘ 期末成績、∘ 持續度、+ 論壇參與。L742–744：「providing this positive feedback did indeed lead learners to post more frequently in the forum, but this did not have any impact on their final course grade.」
10. **Tomkin & Charlevoix 2014**（Table 8，MOOC，N = 20,474，無誘因）：∘ 完成率、∘ 投入。L745–748：講師在一個論壇積極回覆、另一個論壇不回覆，「The authors report no differences in either completion rate or course engagement between the two conditions.」
11. **Beheshitha, Hatala, Gašević & Joksimović 2016**（Table 8，環境欄標「Class」，N = 169）：∘ 論壇參與。正文沒有描述。
12. **Kulkarni et al. 2015b**（Table 9，MOOC，N = 2,422，無誘因）：+ 考試分數。L1032–1036：MOOC 學習者分成 2 到 9 人小組做即時視訊討論，「learners in groups with a larger diversity of nationalities performed significantly better on the course final exam than learners in groups with low diversity.」注意這句比的是**小組內國籍多元程度高低**，不是「有小組對沒小組」；本回顧沒有說明分派的是什麼。
13. **Cambre, Kulkarni, Bernstein & Klemmer 2014**（Table 9，MOOC，N = 2,474，無誘因）：+ 考試分數。正文沒有描述。
14. **Zheng, Vogelsang & Pinkwart 2014**（Table 9，MOOC，N = 1,730，無誘因）：∘ 投入、∘ 持續度、∘ 期末成績。L1038–1041：依偏好、性別、時區、人格、目標、語言演算法分組，相對隨機分組「to not have any effect on overall engagement, persistence, or final grade」。
15. **Labarthe, Bouchet, Bachelet & Yacef 2016**（Table 9，MOOC，N = 8,673，無誘因）：+ 持續度、+ 完成率、+ 投入。L1059–1061：MOOC 內的同儕推薦系統，相對沒有推薦的對照組「displayed significantly improved persistence, completion rate and engagement」。（同一團隊的 Bouchet et al. 2017 在 Loh et al. 2024 回顧裡出現，見 `loh2024-mooc-social-review.md`。）
16. **Cho & Lee 2013**（Table 9，環境欄標「Class」，N = 120）：− 投入、∘ 學習增益。L1051–1054：共同解釋比自我解釋的人對評量題較不投入。這是 Cooperative Learning 類唯一的負向結果。
17. **Bhatnagar et al. 2015**（Table 9，Native，N = 144，Class）：+ 修改答案。L1044–1048：把同學寫的解釋給學習者看，提高改成正確答案的機率。
18. **Konert et al. 2016**（Table 9，環境欄標「Class」，N = 396，無誘因）：+ 投入、+ 持續度。正文沒有描述。
19. 歸納：Cooperative Learning 類中 MOOC 環境的四篇（Kulkarni 2015b、Cambre 2014、Zheng 2014、Labarthe 2016）共 8 個結果，5 正向、3 無顯著；論壇相關的五篇 MOOC 實驗（Kizilcec 2014a、Lamb 2015、Coetzee 2014、Tomkin & Charlevoix 2014，加上非 MOOC 的 Beheshitha 2016）中，**沒有一篇在學業成績或完成率上有正向結果**；正向的只有「論壇發文量」本身。這是我從表格整理的，原文沒有這樣歸納。

### 其他會被引用的

20. **Davis et al. 2016**（Table 4，A 研究 N = 9,836、B 研究 N = 1,963，MOOC）：提取提示與讀書計畫兩個介入都沒有效果（L356–360），作者推測是因為可以不受罰地忽略提示。
21. **Yeomans & Reich 2017**（Table 4，A 研究 N = 293、B 研究 N = 3,520，MOOC）：表格把兩個研究的完成率都標成「−」。但參考文獻題名是「Planning prompts increase and forecast course completion」（L1808），題名與編碼方向看似相反，正文沒有描述這篇。PDF 第 9 頁核過表格確實是「-Completion Rate」。我沒有回原研究查，不確定是哪一邊錯。
22. **Kizilcec, Davis & Cohen 2017a**（Table 4，MOOC，N = 1,973）：+ 期末成績、+ 持續度、+ 完成率。
23. **Kizilcec, Papadopoulos & Sritanyaratana 2014b**（Table 12，Lab，N = 22）：講師臉部畫面疊加，學習者偏好有臉的影片，考試分數沒差（L1462–1464）。
24. **Yang, Shih & Chen 2016**：兩層式選擇題的學習增益比一層式高 0.5 個標準差（L537–540）。這是本回顧正文唯一給出效果量的地方。

## 作者自己列的限制

全文**沒有限制一節**。散在正文的自承：

- 刊物挑選來自滾雪球與專家諮詢，承認可能漏掉其他適合的期刊與會議（L139–140）。
- 部分 2017 年的期刊與會議論文集在撰寫時還沒出（L193–194，Table 1 以 † 標出）。
- 2015 到 2016 篇數下降的原因只能臆測（L147）。
- Simulations & Gaming 類多在自製環境，有可重現性的疑慮（L1071–1072）。
- 結論承認：依 Hattie 的大量研究，不能因為這裡的大量無顯著結果就說策略無效；轉到大規模數位情境才是挑戰（L1508–1510）。
- 誘因差異可能代表「同一個介入在有金錢誘因時有效、在自主學習情境無效」，研究的可推論性要小心（L1514–1517）。

## 與摘要說法不一致的地方

1. 摘要（L79–81）與結論說三類策略「most promising」、結論 L1519 寫「Guided by the proven efficacy of Cooperative Learning, Simulations & Gaming, and Interactive Multimedia」。但依據只是**顯著結果的比例**（計票），沒有效果量、沒有加權、沒有品質評估；Cooperative Learning 的 24 個結果中只有 8 個來自 MOOC。「proven efficacy」的強度超過方法能支持的程度。
2. 正文 L900 說 Cooperative Learning 是 MOOC 的主要機會「as evidenced by the prevalence of reported positive findings (71%)」，但 71% 主要來自 native、Class、Lab、Mturk 環境；本回顧自己的 Fig. 2a 顯示 MOOC 環境整體正向率只有 42%。
3. Table 2 的篇數與各表列數有兩處對不上：Meta-Cognitive Strategies 標 24 篇，Table 4 有 24 列，但其中 Davis 2016 與 Yeomans & Reich 2017 各拆成 A、B 兩列，實際是 22 篇；Interactive Multimedia 標 31 篇，Table 12 有 32 列。不確定 Table 2 數的是研究還是論文。
4. 環境分類在 3.1 節（L235–248）定義七種，沒有「Class」，但 Fig. 1 圖例與 Table 8、9 的 Env 欄都出現「Class」（Beheshitha 2016、Konert 2016、Cho & Lee 2013）。PDF 核過，原文如此。
5. 誘因比較：結論寫金錢誘因下正向結果是無顯著結果的「twice」，Fig. 2b 的數字是 61% 對 34%（約 1.8 倍）。
6. 其餘數字（126 篇、132,428 人、59% 對 42%、60% 對 42%、71%、68%、64%、43%）逐項對過，一致。

## 與清單「要撐的結論」不合的地方

清單原句：「大規模線上學習的介入回顧，裡面有沒有隨機分派社群功能的研究（掃描時沒讀到）」。

- 這不是結論而是待答問題。答案：**有**。納入條件本身就是隨機對照實驗，社群相關的至少有：論壇的聲望制度（Coetzee 2014）、講師是否參與論壇（Tomkin & Charlevoix 2014）、鼓勵發文的框架（Kizilcec 2014a）、小組視訊討論（Kulkarni 2015b）、分組演算法（Zheng 2014）、同儕推薦（Labarthe 2016）等，見上「結果」第 7–19 項。
- 可以撐的較強說法：在 MOOC 裡隨機分派的論壇介入，能提高發文量，但本回顧收錄的幾篇沒有一篇提高成績或完成率（Coetzee 2014、Tomkin & Charlevoix 2014；Kizilcec 2014a 的集體框架提示甚至降低發文）。小組與同儕配對類有正向結果（Kulkarni 2015b、Cambre 2014、Labarthe 2016），但演算法分組沒效（Zheng 2014）。
- 引用時要說清楚：以上每一項都是本回顧的 +／∘／− 編碼，沒有效果量；要寫數字或細節得回原研究。這篇的「Cooperative Learning 71% 正向」不能直接拿來說「MOOC 裡的協作功能有效」，理由見上「與摘要說法不一致」第 2 點。

## 讀取紀錄

- L1–41：TU Delft 封面頁（版本、著作權、Taverne 說明）
- L42–115：期刊首頁、作者、摘要、關鍵字、1 Introduction、通訊資訊與收稿日期
- L116–208：2 Method、Table 1、Table 2、Fig. 1 圖說、Fig. 2 的文字說明、OSF 登錄
- L209–301：3 Terminology（3.1 環境、3.2 誘因、3.3 結果變項）、Fig. 2 圖說
- L302–349：4 Review 開頭、4.1 Mastery learning、Table 3
- L350–532：4.2 Metacognitive strategies、Table 4
- L533–628：4.3 Questioning、Table 5
- L629–669：4.4 Spaced vs. massed practice、Table 6
- L670–726：4.5 Matching learning styles、Table 7
- L727–896：4.6 Feedback、Table 8
- L897–1066：4.7 Cooperative learning、Table 9（含續表）
- L1067–1208：4.8 Simulations & Gaming、Table 10
- L1209–1276：4.9 Programmed instruction、Table 11
- L1277–1500：4.10 Interactive multimedia methods、Table 12
- L1501–1526：5 Conclusion、致謝
- L1527–1817：參考文獻，掃過（無附錄、無補充資料）
- 對過 PDF 頁面：第 5 頁（Table 2、Fig. 1）、第 6 頁（Fig. 2a–c，所有百分比從圖上讀）、第 9 頁（Table 4 逐列對齊）、第 11 頁（Table 7）、第 12 頁（Table 8 與 Table 9 前半）、第 13 頁（Table 9 續表）。Table 3、5、6、10、11、12 只依文字檔列序對齊，沒有看 PDF；其中只有 Table 12 的 Kizilcec 2014b 被上面引用，列序在文字檔中一致（第 7 列：N 22、Lab、Credit、∘ Exam Score），與正文 L1462–1464 描述相符。
