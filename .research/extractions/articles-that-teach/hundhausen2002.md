# 抽取紀錄：Hundhausen、Douglas、Stasko 2002，A Meta-Study of Algorithm Visualization Effectiveness

- **書目**：Christopher D. Hundhausen（University of Hawai'i，Laboratory for Interactive Learning Technologies）、Sarah A. Douglas（University of Oregon，Human-Computer Interaction Lab）、John T. Stasko（Georgia Institute of Technology，College of Computing/GVU Center）。Journal of Visual Languages and Computing 13(3)，259–290，2002。作者姓名與單位對過 PDF 首頁。
- **DOI**：PDF 首頁印的是 `10.1006/S1045-926X(02)00028-9`；清單寫的 `10.1006/jvlc.2002.0237` 是清單作者用 OpenAlex 核對的，我沒有另外核對兩者是否指向同一筆。
- **原文檔**：`.research/raw/learning-content/q2-interactive/viz-hundhausen2002.txt`（1,762 行、93,142 字元／93,901 位元組；與 `.work/learning-visualization-research/src/hundhausen2002.txt` 逐位元組相同）。PDF：`.work/learning-visualization-research/src/hundhausen2002.pdf`（32 頁）。
- **版本**：刊出版（Elsevier Science 版面，頁碼 259–290）。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 7（該不該做互動）第 4 列；清單註明與 order 2（圖）共用。
- **文字檔狀況**：單欄版面，內文段落順序正常；`ff`、`fi` 連字被轉成 `¡`、`¢`（例如 e¡ectiveness）。Table 2 在 PDF 是橫排跨四頁，文字檔裡欄位全部交錯，不能用；Table 4–7 是多欄名單，文字檔把各欄接在一起。**Table 2–7 與 Figure 3、5–8 全部改看 PDF 頁面**，下面的表格內容都以 PDF 為準。行號一律是文字檔行號。

## 研究設計

- **類型**：作者自稱「meta-study」，明說**不是**統計式的統合分析。沒有算任何效果量，做法是把研究分類後數「達顯著的有幾個、沒達顯著的有幾個」（vote counting），再加質性判讀。L733–737：「involves first classifying the studies in various principled ways based on their independent and dependent variables, and then scrutinizing the results of the studies vis-a-vis these classifications. Our analysis of study results includes both quantitative comparisons of the numbers of statistically significant and non-significant results in opposing classes of studies, and qualitative assessments of trends.」
- **為什麼不做統計統合**（L705–722）：兩個理由。一，研究太雜，自變項與依變項的操作方式差很多；二，就算挑出同質的一小群，「large discrepancies in the results of the studies in our sample would give rise to statistically uninformative conclusions」。
- **資料**：24 個受控實驗（全部是受試者間設計，L297–299）。L309–316：「To the best of our knowledge, this corpus comprises close to the entire population, if not the entire population, of published AV effectiveness experiments.」**沒有寫檢索方法、資料庫、年份範圍或納入排除流程。**
- **24 個實驗的來源集中**（照 Table 2 數）：Hansen 等 2000 一篇貢獻 8 個（Study I–VIII）、Lawrence 1993 博士論文貢獻 6 個（Chapter 4.4、5、6、7、8、9）、Byrne 等 1999 貢獻 2 個，其餘 8 個各一（Price 1990 碩士論文、Stasko 等 1993、Crosby 與 Stelovsky 1995、Gurka 1996 博士論文、Kann 等 1997、Mulholland 1998、Hundhausen 與 Douglas 2000、Jarc 等 2000）。Lawrence、Gurka、Price 三份在參考文獻裡都標 Unpublished（L1658–1660、L1672、L1688）。這個「集中」是我照表數的，作者只在前後測那一項提過「based almost entirely on the work of a single line of studies」（L1310–1311）。
- **受試者**：全文沒有任何一個實驗的人數、年級或地點。只知道情境是電腦科學教育，學的是演算法。
- **情境**：24 個裡 22 個是「study」情境（自己學完後考後測），2 個（Price、Mulholland）是「assignment」情境（用 AV 除錯或追蹤，量解出幾題與花多久）（L320–324）。
- **比較對象**：不一致。有的是 AV 對傳統教材（文字、講課），有的是 AV 的兩種版本互比（L713–715）。
- **量了什麼**：後測正確率為主；另有前後測進步量、除錯時間、解題數、作答時間、學習時間（Table 2）。
- **何時量**：學完當場考後測；Jarc 等是三週實驗課結束時考（Table 2）。沒有延宕測驗的描述。
- **不評研究品質**（L738–745）：「our analysis will not make judgments about the validity of each experiment... we will make the simplifying assumption that the results of each experiment in our corpus can be trusted roughly equally.」
- **分類由誰做**：把研究歸到哪個理論、兩組的「費力程度」相不相等，都是作者自己的判斷（「we judged」L834、「in our judgment」L1083、「we estimate」L1042）。沒有寫幾個人編碼、有沒有算一致性。

## 結果（逐項）

### A. 24 個實驗各自的結果（Table 2，PDF 第 8–11 頁，期刊頁 266–269；全部對過版面）

| 研究 | 操弄 | 量什麼 | 結果（照表） |
|---|---|---|---|
| Price [26] | 除錯時有動畫視圖 vs 沒有 | 除錯時間、有沒有找到 bug | No significant differences were found. |
| Stasko 等 [15] | 只有文字 vs 文字加動畫 | 後測正確率 | Non-significant trend was found favoring the text-and-animation group (t=1.111, df=18, p<0.13) |
| Lawrence Ch.4.4 | 資料筆數（表內寫 9、25、41）；表示方式（橫／直條、點） | 後測正確率 | No significant differences were found |
| Lawrence Ch.5 | 演算法呈現順序；有標籤 vs 無標籤；共變項：空間與語文能力 | 後測正確率、作答時間 | No significant differences were found；Spatial and verbal abilities not correlated with performance |
| Lawrence Ch.6 | 讀文字後被動看動畫 vs 讀文字後自己設計輸入資料再看 | 後測正確率、作答時間 | Participants who viewed animations for which they constructed their own data sets scored significantly higher on post-test |
| Lawrence Ch.7 | 彩色 vs 黑白；有演算法步驟標籤 vs 無 | 後測正確率、遷移作業正確率 | **黑白組顯著較高**；有標籤組顯著較高 |
| Lawrence Ch.8 | 先文字 vs 先動畫；演算法順序 | 後測正確率 | No significant differences detected |
| Lawrence Ch.9 | 只聽課 vs 聽課加被動看動畫 vs 聽課加自己設計輸入資料看動畫 | 自由作答後測、選擇／是非後測 | On free-response post-test, participants who heard lecture and actively viewed animation significantly outperformed students who only heard lecture |
| Crosby 與 Stelovsky [28] | 講課 vs 多媒體；認知風格（S 具體 vs N 抽象）；題型（文字 vs 圖） | 前後測進步 | 多媒體組顯著勝過講課組；認知風格與媒體有顯著交互作用，「S」型在多媒體下顯著較好 |
| Byrne 等 Study I [17] | 有動畫 vs 沒有；互動預測下一步 vs 不預測 | 後測正確率、預測正確率 | On post-test's 'hard' questions, participants who viewed the animation and/or made predictions performed significantly better than participants who did neither. |
| Byrne 等 Study II | 同上 | 同上 | 同上，但差異出現在後測的「procedural」題 |
| Gurka [20] | 有動畫 vs 沒有（表內註：想改進 Byrne 實驗的一部分） | 後測正確率 | No significant differences were found between the two groups；Animation group appeared to be highly motivated by the animation |
| Kann 等 [33] | 寫程式 vs 寫程式加自己做動畫 vs 寫程式加看動畫 vs 寫程式加看加做 | 程式正確率、後測正確率 | Participants who viewed animation scored significantly higher on post-test than participants who did not view animation |
| Mulholland [27] | 追蹤工具（三種文字追蹤器 vs 圖形追蹤器 TPM） | 解出幾題（每題最多 5 分鐘） | **用圖形追蹤器的人解出的題目顯著較少** |
| Hansen 等 Study I [14] | HalVis 超媒體 vs 只有文字 | 前後測進步（虛擬碼重排、模擬演算法操作、預測） | HalVis 顯著勝出 |
| Hansen Study II | 同上 | 同上 | HalVis 顯著勝出 |
| Hansen Study III | HalVis vs 精選文字**加解題練習** | 同上 | **No significant differences detected** |
| Hansen Study IV | HalVis vs 講課 | 同上 | HalVis 顯著勝出 |
| Hansen Study V | HalVis vs 文字加「自己選輸入資料主動看動畫」（Xtango） | 同上 | HalVis 顯著勝出 |
| Hansen Study VI | 完整 HalVis vs 拿掉動畫分段 vs 拿掉虛擬碼逐步標示 vs 拿掉互動提問 | 同上 | **No significant differences detected** |
| Hansen Study VII | 三種視圖的組合（四組） | 同上 | 用到 conceptual view 的組顯著勝過沒用到的 |
| Hansen Study VIII | 三種視圖全有 vs 只有其中一種（四組） | 同上 | 三種全有或只有 Detailed View 的組顯著勝過 conceptual 與 populated 組；conceptual 組顯著勝過 populated 組 |
| Hundhausen 與 Douglas [31] | 自己建構視覺化 vs 主動看現成的 | 追蹤與寫程式作業的正確率與時間 | **No significant differences were detected** |
| Jarc 等 [32] | 動畫軟體可預測下一步 vs 不可預測 | 三週實驗課結束時的後測、學習時間 | **後測沒有顯著差異**；The prediction group spent significantly more time using the animation software than the no-prediction group |

### B. 整體計數（Figure 3，PDF 第 12 頁；L325–352、L683–691）

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 1 | 達顯著 | 11／24（46%） | L326–329、Fig. 3 | 「Eleven of the 24 studies yielded a 'significant' result—that is, a statistically significant difference between the performance of (a) a group of students using some configuration of AV technology, and (b) another group of students using either an alternative configuration of AV technology, or no AV technology at all.」 |
| 2 | 未達顯著 | 10／24（42%） | L342、Fig. 3 | 「In contrast, a roughly equal number of studies (10) did not have a significant result.」 |
| 3 | 顯著但分不出是不是視覺化的功勞 | 2／24（8%），Byrne 等的兩個實驗 | L683–687 | 「students who made predictions regarding future animation frames while viewing algorithm animations performed significantly better than students who did not view animations or make predictions; however, the individual effects of prediction and animation could not be disentangled statistically.」 |
| 4 | 顯著但方向相反 | 1／24（4%），Mulholland | L688–691 | 「one study yielded a 'negative' result in which students who used AV technology actually performed significantly worse than students who used text-based tools.」 |

注意第 1 項的定義：「顯著」是指**任兩組之間**有顯著差異，包含 AV 的兩種版本互比，不等於「用了 AV 的組勝過沒用的組」。例如 Lawrence Ch.7 算顯著，內容是黑白勝彩色、有標籤勝無標籤。

### C. 依理論分類的顯著比例（Table 4、Figure 5，PDF 第 17–18 頁；L951–956）

作者把每個研究掛到一個理論名下（四個研究掛兩個，所以合計 28 筆）。

| # | 理論（操弄的是什麼） | 研究數 | 顯著數 | 比例 | 原文 |
|---|---|---|---|---|---|
| 5 | Cognitive Constructivism（操弄學習者做什麼） | 14 | 10 | 71% | L951–956「studies in support of Cognitive Constructivism have obtained the greatest number (10), and highest percentage (71%), of statistically significant differences. Based on this broad-brush analysis, one can conclude that Cognitive Constructivism has garnered the most consistent empirical support.」 |
| 6 | Epistemic Fidelity（操弄畫面的表示特徵或呈現順序） | 10 | 3 | 30% | Fig. 5；Mulholland 的反向顯著在這一條算成不顯著（註腳 a，L900–901） |
| 7 | Dual-coding（圖加文字標籤） | 2 | 1 | 50% | Fig. 5 |
| 8 | Individual Differences | 2 | 1 | 50% | Fig. 5 |

我照 Table 2 的結果去對 Table 4 的名單：Cognitive Constructivism 那一欄 14 個裡，Table 2 寫明顯著的有 8 個（Lawrence Ch.6、Ch.9、Crosby、Kann、Hansen I、II、IV、V），加上 Byrne 的兩個「分不出功勞」的才是 10 個。也就是說，**71% 把 Byrne 那兩個「預測與動畫分不開」的結果算成支持**。原文沒有明說這一點，是我對出來的。

### D. 依「兩組費力程度是否相等」分類（Table 5、Figure 6，PDF 第 19–20 頁；L1036–1099）

理論預測：費力不相等時，較費力的組會顯著較好；費力相等時沒有差別（L1087–1090）。

| # | 類別 | 內文數字 | 原文 |
|---|---|---|---|
| 9 | 費力相等（Effort equivalent） | 9 個裡 6 個沒有顯著差異（67% 符合預測；圖上標 33% 顯著） | L1092–1094「In six of the nine studies in which competing treatment group activities required roughly equivalent effort, no significant results were found.」 |
| 10 | 費力不相等（Effort not equivalent） | 14 個裡 10 個是較費力組顯著勝出（71%） | L1094–1096「in ten of the 14 studies in which one of the treatment groups required more effort, the group expending the higher level of effort significantly outperformed the other group.」 |
| 11 | 作者對這兩個比例的評語 | — | L1096「These results accord reasonably well with the theory's predictions.」 |
| 12 | 彙總 | 預測中 77% 的顯著結果、60% 的不顯著結果 | L1152–1154「Cognitive Constructivism predicts not only the greatest percentage of significant results (77%), but also a majority (60%) of the non-significant results.」 |
| 13 | Epistemic Fidelity | 「just 30% of the significant results」，另有一個顯著結果與理論完全相反 | L1154–1156 |
| 14 | 另兩個理論 | 研究太少 | L1156–1157「it is fair to say that the jury is still out on Dual-coding and Individual Differences theories.」 |

第 12 項的分母原文沒寫。我的推算：10／13＝77%（13＝11 個顯著加 2 個分不出功勞的），6／10＝60%（10 個不顯著）。推算對得上，但原文沒有給算式。

**費力不相等卻沒有顯著差異的 4 個**（照 Table 5 與 Table 2 對出來，其中三個作者自己點名，L1372–1374「Cognitive Constructivism would have predicted three [15, 31, 32] to have found a significant difference」）：
- Stasko 等：文字 vs 文字加動畫，不顯著。
- Hundhausen 與 Douglas：自己建構視覺化 vs 主動看現成的，不顯著。
- Jarc 等：可預測 vs 不可預測，後測不顯著，預測組花的時間顯著較多。
- Hansen Study VI：拿掉 HalVis 的某一項功能（含拿掉互動提問），不顯著（作者在 L1370–1371 說這兩個前後測研究裡理論會預測其中一個有差異，對名單只能是 VI）。

**作者舉的兩組對照例子**（L1135–1151）：
- Gurka 想複製 Byrne 的實驗但拿掉預測條件，兩組都有小組討論，投入程度沒有實質差別，結果不顯著。「Gurka's de facto equalization of participants' activities led to a non-significant result.」
- Hansen Study III 讓文字組除了讀文章還做紙筆練習，結果與 HalVis 沒有顯著差異。「the researchers' decision to engage the text-only participants as actively as participants in the HalVis group led to their failure to find a significant difference between the two groups' learning outcomes.」

### E. 依變項：量哪一種知識（Table 6、Figure 7，PDF 第 22 頁；L1196–1299）

| # | 測驗內容 | 圖上數字 | 作者的話 |
|---|---|---|---|
| 15 | 只考程序性知識 | 15 筆、67% 顯著 | — |
| 16 | 只考概念性知識 | 3 筆、67% 顯著（3 個裡 2 個） | L1285–1286「the sample size (3) is clearly too small for general conclusions to be drawn.」 |
| 17 | 概念加程序 | 圖上 8 筆、38% 顯著；內文寫「Nine studies」 | L1201 |
| 18 | 把 16 併進 17 | 45%（11 筆裡 5 筆） | L1296–1297 |
| 19 | 作者的結論 | 先說三種沒有差別，後面又說程序題較敏感 | L1282「no one measure appears to be more sensitive to learning effects than any other」；L1298–1299「In spite of these inconsistent results, procedural test questions still appear to be somewhat more sensitive to AV technology's educational benefits than conceptual questions.」 |

### F. 依變項：怎麼量（Table 7、Figure 8，PDF 第 23–24 頁；L1301–1374）

| # | 量法 | 數字 | 原文 |
|---|---|---|---|
| 20 | 只考後測 | 13 個裡 7 個顯著（54%） | L1308–1309 |
| 21 | 前後測進步量 | 9 個裡 7 個顯著（78%） | L1309–1310 |
| 22 | 作者的保留 | 幾乎全來自同一條研究線 | L1310–1313「one should keep in mind that it is based almost entirely on the work of a single line of studies. Nonetheless, given the difference in success rates, one can cautiously conclude pre- to post-test improvement may be more sensitive to learning differences than simple post-test performance.」 |
| 23 | 另一個保留 | 前測本身可能教了東西 | L1414–1418「The pre-test may give participants knowledge of the target algorithm outside of the treatment condition.」 |
| 24 | assignment 情境兩個研究 | 作者說都沒有顯著結果 | L1168–1169「Neither of these experiments yielded a significant result.」（其中 Mulholland 在 Figure 3 被算成反向顯著，見下方不一致） |

### G. 作者的總結（第 6 節）

| # | 內容 | 行號 | 原文 |
|---|---|---|---|
| 25 | 最主要的結論 | L1400–1401 | 「according to our analysis, how students use AV technology, rather than what students see, appears to have the greatest impact on educational effectiveness.」 |
| 26 | AV 有沒有效 | L1426–1427 | 「our answer to this question would have to be a qualified 'yes'.」 |
| 27 | 無效的那一面 | L1434–1437 | 「With few exceptions, we found that studies in which students merely viewed visualizations did not demonstrate significant learning advantages over students who used conventional learning materials. ... the mere presence of AV technology—however well-designed and informative the visual representations it presents may appear to be—does not guarantee that students will learn an algorithm.」 |
| 28 | 有效的那一面 | L1442–1447 | 「the most successful educational uses of AV technology are those in which the technology is used as a vehicle for actively engaging students in the process of learning algorithms」；例子是 what-if 分析（自己設計輸入）、預測練習、寫程式練習 |
| 29 | 對畫面品質的定位 | L1456–1458 | 「the form of the learning exercise in which AV technology is used is actually more important than the quality of the visualizations produced by AV technology. This is not to say that visualization quality does not matter—in a successful learning activity, a well-designed visualization certainly contributes—but rather to say that the form of activity is more important than the form of the visualization.」 |
| 30 | 活動的形式不重要、費力才重要（這是理論的立場，不是結果） | L1028–1032 | 「The Cognitive Constructivist position is that, as long as the learner's activity is salient to the target knowledge or skill, the effort required to engage in the activity is more important than its actual form.」 |

### H. 導言裡的背景說法（不是這篇的結果）

- AV 在主流電腦科學教育沒有普及（L56–58）。教師常說的四個理由：沒時間學、會佔掉課堂時間、做視覺化太花時間與力氣、覺得沒有教育效果（L59–67）。原文寫「Instructors commonly cite」，沒有給調查來源。
- 導言轉述 Chen 與 Yu 2000 的資訊視覺化統合分析：35 個實驗最後只剩 6 個夠同質，結論是個別差異對表現的影響比視覺化技術本身更大、更一致（L700–704）。這是轉述。

## 作者自己列的限制

原文沒有 Limitations 節，散在各處：

1. 不評各實驗的效度，假設每個實驗一樣可信（L738–745）。
2. 每個實驗等權重（L895、L1091、L1202）。
3. 粗分析的結論「must be considered tentative」（L959）。
4. 費力相不相等是作者的判斷（L1039–1043、L1083）。
5. 理論的預測有前提：教材要設計得夠好、資訊夠（註腳 b，L1102–1103）。這等於替不合預測的結果留了解釋空間。
6. 前後測進步量那個結果偏向單一研究線，而且有前測教學效應的方法問題（L1413–1418）。
7. 依變項範圍很窄，幾乎都是概念與程序知識的測驗（L1419–1423）。
8. 只收受控實驗；作者估計另有將近 30 個用其他方法（可用性測試、民族誌、問卷、觀察）的研究沒有收（L1549–1579）。
9. 實驗只看學生使用的那一段，沒有看準備與導入的成本（L1580–1590）：「how long did it take to prepare and set up the AV technology?」
10. 只看教育情境（L1591–1593）。
11. Dual-coding 與 Individual Differences 各只有 2 個研究（L1156–1157、L1396）。
12. 概念題只有 3 個研究（L1285–1286）。

作者**沒有提到**的：沒有效果量與樣本數（顯著與否受樣本大小左右）；沒有處理出版偏誤；24 個實驗有 14 個來自兩份來源，彼此不獨立；費力程度沒有獨立評分者；各組的學習時間沒有納入分析（只有 Jarc 一項提到預測組花較久）。這幾點是我讀完後的觀察，不是原文的話。

## 與摘要說法不一致的地方

1. 摘要寫「Our most significant finding is that how students use AV technology has a greater impact on effectiveness than what AV technology shows them」（L24–26），是肯定句；結論節寫的是「appears to have the greatest impact」（L1400–1401），前面還說粗分析「tentative」（L959）、兩個比例與理論「accord reasonably well」（L1096）。摘要沒有帶這些保留。
2. 摘要自稱「a systematic meta-study」（L20），關鍵字列了「Meta-analysis」（L29）。內文第 4 節明說沒有採用統計式的統合分析技術（L705），也沒有寫檢索程序。引用時不能稱它為 meta-analysis。
3. 摘要說依變項分析「enables us to determine which measurement techniques have been most sensitive」（L23–24）；內文對知識類型的結論自己說「inconsistent results」「difficult to interpret」（L1294、L1298），對前後測只敢「cautiously conclude ... may be」（L1312–1313）。

## 原文內部對不起來的地方（照實記錄）

1. **Table 5 兩欄的名單與內文數字對不上。**「Effort Equivalent」欄列了 10 個（Price、Lawrence Ch.4.4、5、7、8、Gurka、Mulholland、Hansen III、VII、VIII），內文與 Figure 6 都說 9 個。「Effort not Equivalent」欄列 14 個，其中 **Hansen Study VII 兩欄都有，Hansen Study VI 兩欄都沒有**。內文 L1370–1371 的說法只有在 VI 屬於「費力不相等」時才成立，所以右欄的 VII 很可能是 VI 之誤；左欄多出的一個，照比例推算可能是把反向顯著的 Mulholland 排除在 9 個之外。兩處都是我的推測，原文沒有更正說明。
2. **Table 7** 右欄（前後測）列了「Lawrence [16, Chapter 5]」，但 Lawrence Ch.5 同時在左欄，Table 2 寫它量的是後測正確率；而 Table 2 寫明量前後測進步的 **Hansen Study I 兩欄都沒有**。右欄那一筆很可能是 Hansen Study I 之誤（這樣 9 個裡 7 個顯著才對得上）。同樣是我的推測。
3. **Table 6**「Conceptual and procedural」欄列 8 個，Figure 7 的長條也是 8，內文 L1201 寫「Nine studies」。
4. **Procedural only 的 67%**：Table 6 那一欄 15 筆，照 Table 2 的結果我數到 11 筆顯著（73%），圖上是 67%（10 筆）。差的那一筆可能是 Kann 的程式正確率（Table 2 只說後測顯著），原文沒有逐筆交代。
5. Lawrence Ch.4.4 的資料筆數：內文 L351 寫「9 vs. 24 vs. 41」，Table 2 寫「9, 25, or 41」。
6. Mulholland：Figure 3 算「Significant result in wrong direction」，Figure 5 的註腳把它算成不顯著，L1168–1169 又說 assignment 情境的兩個實驗「Neither ... yielded a significant result」。
7. L1154–1155「having predicted just 30% of the significant results」：30% 其實是 Epistemic Fidelity 名下 10 個研究裡 3 個顯著，不是「所有顯著結果的 30%」。
8. Kann 等的結果在 Table 2 寫的是「看了動畫的人後測顯著較高」，比的是看與沒看；作者在結論把它當成「programming exercises」主動投入的成功例子（L1447）。四組都要寫程式，差別在有沒有看或做動畫，這個歸類原文沒有解釋。

## 與清單「要撐的結論」不合的地方

清單寫：「讀者拿它做什麼比它顯示什麼重要」。

- **方向撐得住**，這是作者自己的主結論（L24–26、L1400–1401、L1456–1458）。
- **強度要降**：依據是 24 個實驗的顯著與否計數，沒有效果量；分類是作者事後自己判斷的；Table 5 的名單與內文數字本身對不起來；作者結論用的是「appears」與「qualified 'yes'」。寫成「一份 2002 年的回顧數了 24 個實驗，操弄學習者活動的 14 個裡有 10 個顯著，操弄畫面表示的 10 個裡 3 個顯著」比寫成「證實」準確。而且那 10 個含 2 個分不出是預測還是動畫的功勞。
- **對象要寫清楚**：是電腦科學學生用演算法視覺化軟體學演算法，沒有人數，不是讀文章的讀者。「讀者」是清單替換的字，原文是 students／learners。
- **比的東西要寫清楚**：「顯示什麼」在這篇指的是表示特徵（顏色、標籤、資料筆數、條狀或點狀、呈現順序）；它**沒有**比較「互動圖」對「靜態圖」。
- **同一篇裡有三項對 order 7 更直接、而且方向相反或無效的結果**，清單沒有帶到：
  1. 把非視覺化組的活動量補齊後，差異就消失（Hansen Study III：文字加紙筆練習 vs HalVis，不顯著；Gurka）。這表示好處跟著「活動」走，不必是視覺化工具本身。
  2. 「先預測」不是穩定有效：Jarc 等的預測組後測沒有比較好，只是花的時間顯著較多；Byrne 等的預測效果與動畫分不開。
  3. 「自己建構」對「主動看現成的」沒有差別（Hundhausen 與 Douglas）；拿掉 HalVis 的互動提問也沒有差別（Hansen Study VI）。
- 這篇有一句成本面的話可用但只是提問：導入與準備的時間沒有任何實驗量過（L1580–1590）；教師不用 AV 的理由之一是做起來太花時間（L63–66，無調查來源）。

## 讀取紀錄

| 順序 | 文字檔行號 | 內容 |
|---|---|---|
| 1 | L1–449 | 首頁、摘要、第 1 節導言、Table 1、第 2 節範圍（2.1 使用情境、2.2 研究方法分類）、第 3 節資料前半、Table 2 第一頁（文字檔錯位） |
| 2 | L450–949 | Table 2 其餘（錯位）、Figure 3、第 3 節後半、第 4 節方法、5.1 開頭、5.1.1 四種理論、Table 3、5.1.2、5.1.3、Table 4 |
| 3 | L950–1429 | 5.1.3 後半、5.1.4、Figure 5、Table 5、註腳 b、Figure 6、5.2、5.2.1、Table 6、Figure 7、5.2.2、Table 7、Figure 8、第 6 節開頭、6.1、6.2、6.3 開頭 |
| 4 | L1430–1762 | 6.3 後半、6.4（6.4.1、Table 8、6.4.2、6.4.3）、致謝、參考文獻 1–60（書目掃過，確認 Lawrence、Gurka、Price 三份標 Unpublished） |

對過 PDF 版面的頁：第 1–2 頁（首頁書目與作者）、第 8–11 頁（Table 2 全表）、第 12 頁（Figure 3）、第 13–24 頁（Table 3–7、Figure 4–8 與其間內文）。PDF 第 3–7、25–32 頁只讀文字檔（單欄內文、Table 1、Table 8、參考文獻），另用 `pdftotext` 抽第 7、21 頁確認「9 vs. 24 vs. 41」與「Nine studies」兩處確實是原文。

原文有兩個註腳（a、b），都讀了；沒有附錄。
