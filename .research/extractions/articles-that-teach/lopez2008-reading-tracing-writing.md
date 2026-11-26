# 抽取紀錄：Lopez、Whalley、Robbins、Lister 2008，Relationships between reading, tracing and writing skills in introductory programming（ICER 2008）

- **合法公開來源**：https://opus.lib.uts.edu.au/bitstream/10453/10806/1/2008001530.pdf （作者 Lister 所屬 UTS 機構典藏的作者稿，2026-10-14 核對；重新下載與手上的 `lopez2008.pdf` 位元組完全相同，264,240 位元組）；刊出版在 https://dl.acm.org/doi/10.1145/1404520.1404531（ACM Digital Library 自 2026-01-01 起全面開放取用，文章頁標示 FREE ACCESS），另存 `.research/raw/learning-content/q2-interactive/lopez2008-acm-dl.pdf`。兩版比對：版面都是雙欄、分欄位置不同，逐句無法對齊；改比全文的小數與百分比，256 個在兩版完全相同（ACM 版只多版權行的「$5.00」），五詞片段有 92.9% 重合，Table 1 的各題平均（5.2／75%、6.4／91%、3.7／93%、5.3／66%）兩版一致。

- **書目**：Mike Lopez（Manukau Institute of Technology，紐西蘭）、Jacqueline Whalley、Phil Robbins（Auckland University of Technology，紐西蘭）、Raymond Lister（University of Technology, Sydney，澳洲）。作者順序與單位對過 PDF 第 1 頁（`.txt` 首頁的姓名順序是亂的）。Relationships between reading, tracing and writing skills in introductory programming. *Proceedings of the Fourth International Workshop on Computing Education Research (ICER '08)*，2008 年 9 月 6–7 日，Sydney。DOI 10.1145/1404520.1404531、頁 101–112：**這兩項手上的 PDF 沒有印**，取自清單與 Nelson 2017 的參考文獻 [49]，我沒有另外向 ACM 核對。
- **原文檔**：`.research/raw/learning-content/q2-interactive/lopez2008.pdf`（11 頁）、`.txt`（1,548 行、53,415 字元；不帶 `-layout` 的 pdftotext，表格一格一行、雙欄段落有交錯）。
- **版本**：作者稿。PDF 的標題欄是「Microsoft Word - 2008_09_LopezEtAl2008…」，版面沒有頁碼與 DOI，只有 ACM 的授權聲明與「ICER 2008, September 6–7, 2008, Sydney, Australia.」。內容與刊出版是否逐字相同沒有核對。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 3（程式碼）#8
- **行號**：`.txt` 的行號。Table 1、2、3 與 Figure 7（路徑圖，`.txt` 裡完全沒有數字）是對 PDF 第 3、8、9 頁讀的。

## 研究設計

- **類型**：觀察研究，一次期末考的作答分析。沒有介入、沒有對照組。作者把考卷當研究工具（L197–203、L1425–1431）。
- **受試者**：單一學校、第一學期 Java 程式課結束時的期末考。78 人應考，其中 **38 人**同意把考卷當研究資料（L219–222）。學校名稱原文沒有寫（「a single institution」，L198）。同意者平均分數略高於全班（62% 對 58%，L224–225）。
- **考試**：28 頁、兩小時（L225–226）；學生上同一堂大班課，實習課分給四位助教；考卷主要由其中兩位出題，四位助教分題批改再互相複核（L227–233）。作者說這份考卷是「3 years of refinement and research informed assessment design」的結果（L236–237）。
- **題目與變項**（13 題、滿分 100；分析前先由作者與同事依教學經驗分成 8 類，分析中把 Tracing 拆成兩類，L682–688）：

  | 變項 | 題號 | 內容 | 滿分 | 平均（%） |
  |---|---|---|---|---|
  | Basics | 1–4 | 名詞配定義、名詞配程式碼、讀方法標頭、找語法錯誤 | 26 | 20.6（79%） |
  | Sequence | 5、6 | 把缺的幾行放回骨架程式；Parsons 題（6 行排順序，大括號已給） | 11 | 9.3（85%） |
  | Tracing1（非迴圈） | 7A–C | 三個指派敘述、`%` 運算、一個 if | 10 | 7.7（77%） |
  | Tracing2（迴圈） | 7D、7E(i) | 一個 while 迴圈、一個內含 if 的 for 迴圈 | 5 | 2.4（48%） |
  | Exceptions | 7E(ii)、12 | 傳 null 會怎樣、解釋兩個執行期例外 | 8 | 2.4（30%） |
  | Data | 8 | 資料型別與作用域 | 10 | 7.8（78%） |
  | Writing | 9、11 | 寫一個組字串的方法；替一個類別寫七行單元測試呼叫 | 12 | 4.4（37%） |
  | Explain | 10 | 三段程式「explain in plain English what it does」（加總陣列、印星號方陣、二分搜尋） | 8 | 3.2（40%） |
  | General | 13 | 四選一的短文題（耦合與內聚、陣列對 ArrayList、為什麼要測試、程式風格） | 10 | 4.7（47%） |

  以上數字取自 Table 2（PDF 第 3 頁）。全卷平均 62.7／100（Table 1）。
- **寫程式題的條件**（L999–1008）：批改時忽略小的語法錯誤；可能用到的函式庫方法都附了說明；第 9 題和考前一個月的練習很像；單元測試整學期都有教。
- **解釋題的條件**（L1017–1031）：學生考前在課堂與舊考卷看過這種題型和範例答案，也知道逐行描述是低分、總結整段在做什麼是高分；題目前言還再提醒一次。三段程式本身沒看過。
- **分析步驟**（第 4.1 節，L1082–1177）：
  1. 用多分 Rasch 模型把各題得分轉成等距變項（L1089–1097）；單向度假設用主成分分析檢查（L1131–1133）。
  2. 把 General（第 13 題）當成「一般個人特質」的估計，對每個其他變項各跑一次雙變項迴歸，再把 General 的效果減掉，得到七個「扣掉基準後」的變項（L1139–1154）。作者說這樣做也順便控制了只收同意者造成的偏誤。
  3. 研究問題一、二：檢定 Tracing 與 Writing、Explain 與 Writing 的 Pearson 相關是否為正（L1154–1158）。
  4. 研究問題三：以 Writing 為效標做逐步多元迴歸，每一步拿掉獨特貢獻最小的變項，停止條件是調整後 R² 最大、整體迴歸在 .01 顯著、每個變項在 .05 顯著；再把留下來的預測變項逐一當效標重複同一程序，畫成路徑圖（L1159–1174）。
  5. 殘差用 Jarque-Bera 檢定（L1175–1177）。

  所以後面的相關係數都是「Rasch 轉換、再扣掉短文題效果」之後的變項之間的相關，不是原始分數的相關。

## 結果（逐項）

| # | 結果 | 數字 | 位置 | 原文一句 |
|---|---|---|---|---|
| 1 | Tracing 要拆成兩個因素 | 7A、B、C 落在第一因素（負荷 0.5335、0.6901、0.7617），7D、7E(i) 落在第二因素（0.9030、0.8691）；varimax 轉軸 | 5.1；Table 3（PDF 頁 8）；L1186–1246 | 「All constructs were uni-dimensional with the exception of tracing which appears to have two underlying factors.」 |
| 2 | 變項之間大多正相關 | 平均相關 0.3864；唯一例外是 Data 對 Explain，小而不顯著的負相關 | 5.1；L1252–1255 | 「All of the derived variables showed positive inter-correlations with the exception of "Data" vs. "Explain" which had a small (but not significant) negative correlation.」 |
| 3 | Tracing（全部 15 分）與 Writing | r(36) = 0.5621，p = 0.0001；解釋 32% 變異，調整後 R² 30%；Writing = 0.9728 × Tracing − 3.1803，係數 99% CI 0.3269–1.6187 | 5.2；L1258–1269 | 「A Pearson correlation analysis produced a correlation of 0.5621 between (Tracing) and (Writing).」 |
| 4 | **Tracing1（非迴圈）與 Writing：作者判定不顯著** | r(36) = 0.3028，p = 0.0308 | 5.2；L1270–1274 | 「No significant correlation (r(36)=0.3028; p=0.0308) was found between Tracing1 (non-iterative) and Writing.」 |
| 5 | Tracing2（迴圈）與 Writing | r(36) = 0.6267，p < .0001；解釋 39% 變異，調整後 R² 38% | 5.2；L1274–1281 | 「There was a significant positive correlation between Tracing2 (iteration) and Writing (r(36)=0.6267; p<.0001).」 |
| 6 | Explain 與 Writing | r(36) = 0.5586，p = 0.0002；解釋 31% 變異，調整後 R² 29%；Writing = 0.6100 × Explain + 1.1772，係數 99% CI 0.2013–1.0187 | 5.3；L1286–1298 | 「A Pearson correlation analysis produced a correlation of 0.5586 between (Explain) and (Writing).」 |
| 7 | 路徑圖：Writing | 變異解釋 46%（調整後 43%），p < .0001；兩個預測變項：Tracing2（β 0.458，獨特貢獻 15%）、Explain（β 0.307，獨特貢獻 7%） | 5.4；Figure 7（PDF 頁 9） | 圖內數字；討論段「In combination, Tracing2 and Explain account for 46% of the variance in Writing」（L1391–1392） |
| 8 | 路徑圖：Explain | 30%（調整後 28%），p = .0004；預測變項 Tracing2（β 0.550，30%） | Figure 7 | 圖內數字 |
| 9 | 路徑圖：Tracing2 | 32%（調整後 30%），p = .0003；預測變項 Sequence（β 0.562，32%） | Figure 7 | 圖內數字 |
| 10 | 路徑圖：Sequence | 33%（調整後 29%），p = .0010；預測變項 Data（β 0.346，9%）、Basics（β 0.321，8%） | Figure 7 | 圖內數字 |
| 11 | 路徑圖：Tracing1 | 38%（調整後 34%），p = .0003；預測變項 Data（β 0.353，10%）、Basics（β 0.359，10%）。**Tracing1 沒有箭頭往上接到任何變項** | Figure 7；L1364–1367 | 「We were surprised that there isn't a statistically significant relationship between Tracing 1 and Tracing 2.」 |
| 12 | Exceptions | 在路徑圖裡沒有任何連線 | Figure 7；L1408–1410 | 「In retrospect, we are not surprised that Exceptions is unconnected in the path diagram. The particular writing tasks in this exam did not require a grasp of exceptions.」 |
| 13 | 共線性 | 變異數膨脹因子 1.30–1.43 | 5.4；L1316–1322 | 「at this sample size, the relative contribution of predictors is subject to considerable uncertainty.」 |
| 14 | 箭頭方向不是因果 | — | 5.4；L1309–1311 | 「The direction of the arrows should not be interpreted as evidence of causation (although that is of course plausible).」 |
| 15 | 與作者事前直覺不合：Sequence 排在 Tracing2 下面 | 作者原本認為補骨架與 Parsons 題是比追蹤更高的技能 | 6.1.2；L1376–1384 | 「we were surprised that the Sequence variable appeared lower in the path diagram than Tracing2 … perhaps the particular Parsons puzzle we used was too easy.」 |
| 16 | 與作者事前直覺不合：Explain 單獨解釋的變異比 Tracing2 少 | 31% 對 39% | 6.1.3；L1396–1405 | 「we were surprised that Explain alone accounts for a smaller amount of the variance in Writing than Tracing2 alone.」 |
| 17 | 描述統計：難易差距 | 最容易 Sequence 85%、Basics 79%；最難 Exceptions 30%、Writing 37%、Explain 40%、Tracing2 48% | Table 2（PDF 頁 3） | 表列 |
| 18 | Parsons 題比預期容易 | 第 6 題平均 4.9／6（83%）；四分之三的學生拿到 4 分以上；學生之前沒做過這種題 | 3.2.2；L768–777 | 「We were surprised at how well the students performed on this question」 |
| 19 | 寫程式題 | 第 9 題 1.8／6（29%），第 11 題 2.7／6（45%），合計 4.4／12（37%）；四分之一的學生拿 1 分以下 | 3.7；L976–977、L996–997、L1005–1008 | 「Despite such favorable circumstances, the average aggregate mark on these two writing questions was only 4.4 out of 12 (37%).」 |
| 20 | 迴圈追蹤題 | while 題 1.8／3（60%）；含 if 的 for 題 0.6／2（32%）；合計 2.4／5（48%） | 3.4；L887–893、L836–841 | 「The collective performance of the students was poor, with an average mark of 0.6 out of 2 (32%).」 |

## 作者自己列的限制

原文沒有 Limitations 節，下面是散在各節、作者自己寫的保留：

1. 相關不是因果：「the co-variances identified in this study are not, alone, evidence of causality」（L1341–1342）；路徑圖的箭頭方向也不是因果（L1309–1311）。作者的立場是先有一個假定的因果模型，統計結果與它一致能增加信心（L1342–1345）。
2. 樣本量下，各預測變項的相對貢獻「subject to considerable uncertainty」（L1320–1322）。
3. 用單一題目（第 13 題）當一般個人特質的估計，「is unable to capture the full range of personal factors」（L1143–1145）。
4. Parsons 題可能太簡單：學生可能靠「return 放最後」這類淺層規則就排對；題目把大括號的位置都給了，「may have given away too much information」（L778–788）。
5. Tracing1 的題目可能太簡單，所以看不到它和 Tracing2 的關係；題目的難度可能不只取決於題型，還取決於長度與用到的語法（L1366–1373）。
6. 解釋題可能不是很有效的評量題（L1403–1405）。
7. 技能可能不是嚴格的階層，上層技能可能同時受不只一個下層技能影響（L1400–1403）。
8. 寫程式題考的是對物件送訊息（呼叫方法），追蹤與解釋題考的是方法內部的控制結構，兩者考的內容不一樣；Tracing2 與 Explain 還能解釋 46% 的變異，可能反映的是一般推理能力，不是特定的程式知識（L1414–1422）。
9. 一場考試放不下夠多題：要好好研究解釋與寫的關係，可能要每人各做 20 題，考試做不到（L1441–1451）。
10. 樣本是自願同意的一半學生，平均略高於全班（L221–225）；作者主張把 General 當共變項可以控制這個偏誤（L1149–1152）。

原文沒有討論的：只有一所學校、一次考試、一種語言；8 分與 5 分的變項分數範圍很窄；逐步迴歸在 38 人上容易挑到偶然的變項；多重比較。

## 與摘要說法不一致的地方

1. **摘要沒有交代非迴圈追蹤與寫程式的相關不顯著。** 摘要寫「The performance of students on code tracing tasks correlated with their performance on code writing tasks」（L22–23）；正文裡 Tracing1 與 Writing 的 r = 0.3028、p = 0.0308，作者判定「No significant correlation」（L1271–1274）。摘要後半提到的階層只點名「the tracing of iterative code」（L30–31），算是間接交代。
2. **「不顯著」的門檻要留意。** p = 0.0308 在 .05 水準是顯著的；作者在前一段用的是 .01（「significant at the 0.01 level」，L1262），這裡沒有明寫門檻。引用時要寫成「r = .30，p = .03，作者以 .01 為門檻判定不顯著」，不能只寫「沒有相關」。
3. **摘要說「Parson's puzzles」是中間層級**，正文的變項是 Sequence，由一題補骨架（5 分）加一題 Parsons（6 分）組成，而且作者自己說那一題 Parsons 可能太簡單（L778–788、L1380–1381）。
4. **摘要的用詞是「suggests the possibility of a hierarchy」**（L27–28），結論段寫「We found statistical evidence which is consistent with our prior intuition」（L1431–1433），同一段又承認有兩個結果和事前直覺不合（L1434–1436；討論段 L1364、L1376、L1396 共三處寫 surprised）。
5. **正文與表格的小出入**：
   - 第 2 題：正文「6.1 out of 7 (91%)」（L718），Table 1 是 6.4（91%）。6.4 ÷ 7 = 91%，6.1 ÷ 7 = 87%，正文的 6.1 應該是筆誤。
   - General：Table 1 與 Table 2 是 47%，5.1 節寫「a mean of 48% and a standard deviation of 29%」（L1247–1248）。
   - Basics：Table 2 是 20.6／26，正文寫「21 out of 26 (79%)」（L742），是四捨五入。
   - 研究問題三在 1.1 節寫的是「Is the student performance on this exam consistent with a hierarchy of programming-related skills?」（L215–216），在 4.1 節變成「Can we elaborate the relationships between these and other constructs?」（L1160–1161）。
6. 討論段把 Tracing2 與 Writing 的相關寫成「p<.01」（L1330），結果段是 p < .0001（L1276），不矛盾，只是寫得較寬。

## 與清單「要撐的結論」不合的地方

清單寫：「追蹤、解釋與寫程式的能力相關（相關，不是因果）」。

- 撐得住，原文自己就說不是因果（L1309–1311、L1341–1342）。
- 要改寫得更準的地方：
  1. **有相關的是「迴圈的追蹤」**（r = .63）。最簡單的非迴圈追蹤和寫程式的相關是 r = .30、p = .03，作者判定不顯著，而且它在路徑圖上不接任何上層變項。只寫「追蹤與寫相關」會蓋掉這個差別。
  2. **規模**：一所學校、一次期末考、38 人（78 人中同意的那一半）；Tracing2 只有 2 小題共 5 分，Explain 3 小題共 8 分，Writing 2 題共 12 分。
  3. **相關係數是處理過的變項之間的**：先用 Rasch 模型轉換，再扣掉短文題代表的一般能力。
  4. **作者自己提的另一種解釋**：寫程式題考的是呼叫方法，追蹤與解釋題考的是迴圈，內容不重疊，所以這個相關可能反映一般推理能力（L1418–1422）。
  5. 「階層」是逐步迴歸在 38 人上畫出來的路徑圖，作者說它與事前直覺一致，同時列了三處意外（Sequence 在 Tracing2 之下、Explain 的解釋力比 Tracing2 小、Tracing1 與 Tracing2 無關）。
- 這篇沒有量的東西：先教追蹤或解釋，寫程式會不會進步。它只有一個時間點。

## 讀取紀錄

| 順序 | `.txt` 行號 | 內容 |
|---|---|---|
| 1 | L1–800 | 首頁、摘要、第 1 節前言（McCracken、Leeds、BRACElet 的脈絡）、1.1 研究問題、第 2 節樣本、第 3 節開頭、Table 1 與 Table 2、3.1 Basics、3.2 Sequence（含 Parsons 題的討論）、3.3 開頭 |
| 2 | L800–1548 | 3.3–3.9 各題說明（含 Figure 1–5 的程式碼）、第 4 節方法、第 5 節結果（5.1–5.4、Table 3）、第 6 節討論、第 7 節結論、致謝；L1460–1548 是參考文獻（掃過） |
| 對版面 | PDF 第 1–3 頁 | 作者姓名、單位與順序；Table 1（14 列 × 8 欄）與 Table 2（9 列 × 8 欄）逐格對過 |
| 對版面 | PDF 第 7–9 頁 | Figure 6（Rasch 反應機率圖）；Table 3 逐格對過；Figure 7 路徑圖的每個方框（變異解釋、調整後 R²、p）與每條路徑（β、半淨相關平方）都從圖上讀；5.2、5.3、5.4 依欄序重讀 |

PDF 第 4–6 頁（各題說明與 Figure 1–3 的程式碼）只讀了 `.txt`，沒有另外對版面；那幾頁沒有表格。原文沒有附錄。Figure 7 的箭頭方向以圖上所見為準（Data、Basics → Tracing1 與 Sequence；Sequence → Tracing2；Tracing2 → Explain 與 Writing；Explain → Writing），圖片解析度有限，Explain → Writing 那條路徑的獨特貢獻讀到的是 7%，與 46% − 39% = 7% 相符。
