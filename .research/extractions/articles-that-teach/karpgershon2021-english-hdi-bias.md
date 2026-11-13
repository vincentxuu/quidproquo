# 抽取紀錄：Karp Gershon、Ruipérez-Valiente、Alexandron 2021，International Journal of Educational Technology in Higher Education 18, 41（doi 10.1186/s41239-021-00275-w）

- 完整書目：Sa'ar Karp Gershon（Weizmann Institute of Science, Department of Science Teaching）、José A. Ruipérez-Valiente（University of Murcia）、Giora Alexandron（Weizmann）。Defining and measuring completion and assessment biases with respect to English language and development status: not all MOOCs are equal. *Int J Educ Technol High Educ*, 18, 41 (2021). 收稿 2021-03-15，接受 2021-05-19，刊出 2021-07-27（原文檔 L46、L916–930）。作者全名對過文章頁作者列（L65–67）與作者資訊節（L869–884）。
- 版本：刊出版（version of record），CC BY 4.0 開放取用（L45、L906）。
- 原文檔：`.research/raw/learning-content/q5-social/mooc-english-bias2021.md`，1,023 行、144,938 字元（145,523 位元組）。來源網址：https://educationaltechnologyjournal.springeropen.com/articles/10.1186/s41239-021-00275-w （出版者 SpringerOpen 文章頁，經 Jina reader 轉文字；檔頭 L3 有記錄）。正文在 L112–630，L677–860 是參考文獻，其後是站台頁尾。
- **原文檔缺表**：網頁轉文字只留下「Full size table」連結，Table 1–5 的數字都不在檔裡。這次補抓：
  - `q5-social/mooc-english-bias2021-tables.md`（4,242 位元組）：出版者的五個表格頁 https://link.springer.com/article/10.1186/s41239-021-00275-w/tables/1 到 /tables/5，經 r.jina.ai 轉文字。下面所有表格數字都出自這份。
  - `q5-social/mooc-english-bias2021-pdf.jina.md`（72,422 位元組）：出版者 PDF https://link.springer.com/content/pdf/10.1186/s41239-021-00275-w.pdf 經 r.jina.ai 轉文字（21 頁），用來對正文段落與頁碼；這份 PDF 轉文字的表格不完整，所以表格以表格頁為準。直接用 curl 抓 PDF 被出版者回傳機器人驗證頁，沒有本機 PDF。
- 讀取日期：2026-10-14
- 供：order 24（語言、翻譯與手機）第 1 列

## 研究設計

- **類型**：觀察性的次級資料分析（學習分析加心理計量），沒有介入、沒有隨機分派。
- **資料**：MITx 在 edX 開的 158 個課次（run）、120 門課，2013–2018 年，280 萬選課、78,562 張證書（L391）。引言另寫「~150 MITx MOOC runs…more than two million enrollments and 78,000 certificates」（L187），是概數。
- **受試者**：
  - RQ1–RQ3：至少看過一次課程教材的人（viewers），N = 1,586,305；分析單位是**課次**，不是個人（L391）。
  - RQ4：六門課裡拿到證書的人；RQ5：其中一門（3.MatSelx）。分析單位是學習者（L391）。
- **語言與發展程度怎麼判定**（L406–414）：取每位學習者最常出現的 IP 位址所屬國家。IP 在美、澳、加、愛爾蘭、紐西蘭、英國、千里達及托巴哥者算英語母語，其餘都算非母語。HDI 0–0.7 算開發中（低 HDI），0.7–1 算已開發（高 HDI），門檻沿用 Kizilcec 等 2017。原文：「It is important to note that all of the English-native countries are high HDI countries as well, meaning there is not any English-native country with low HDI status.」（L414）
- **量了什麼**（L416–436）：(1) 完課——依各課評分規則達到及格，二元變項，作者稱「'broad brush' binary measure」（L427）；(2) 能力估計——以 2PL 試題反應理論（IRT）由課內作業與測驗的「第一次作答對錯」估計（L429–451）。作答者不到 10% 的題目與幾乎不提供資訊的題目刪除，缺值當 Missing-At-Random（L453）。
- **完課偏差怎麼算**：每個課次做 2×2 列聯表，算勝算比（odds ratio），再看各課次對數勝算比的平均是否不為 0（L481–494）。
- **比較**：
  - RQ1：只取高 HDI 國家的學習者，比英語母語 vs 非母語（L481）。
  - RQ2：只取非英語母語者，比高 HDI vs 低 HDI（L506）。
  - RQ3：同一門課不同課次之間的勝算比差距，對上不同課之間的差距（L526）。
  - RQ4：六門課（三門有完課偏差、三門沒有，各取證書數最多的三門）裡，拿到證書者的 IRT 能力，已開發 vs 開發中（L540–542）。
  - RQ5：在 3.MatSelx 用 Mantel–Haenszel 與邏輯迴歸兩種差異試題功能（DIF）方法找出偏差題目，刪掉後看能力差距（L560–570）。
- **何時量**：都是課程結束後的紀錄資料，沒有前測。

## 結果（逐項）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 語言與完課（RQ1）：**沒有找到差異** | 各課次勝算比平均 M = 1.076，p = 0.464，共 159 個課次（原文如此，見下節） | 高 HDI 國家內，英語母語 vs 非母語的完課勝算 | RQ1 | L494 | 「The odds ratio is distributed with mean M = 1.076, which is insignificantly different from 1 with p = 0.464. Thus, we conclude that the likelihood of completing the course is similar for both groups, hence completion is independent of the language.」 |
| 2 | RQ1 示例課次 | 勝算比 1.14；母語 61 完課／572 未完（633），非母語 117／1,252（1,369） | 3.MatSelx 2017 第三期，已開發國家 viewers | Table 2 | L488；表格頁 2 | 「The odds-ratio for this course is 1.14, meaning that being a native speaker increases one's odds to complete the course by 14%.」（我用表內四格驗算：61×1252／(572×117) = 1.141，一致） |
| 3 | HDI 與完課（RQ2）：**有差異** | 勝算比平均 M = 1.83，p < .001，137 個課次 | 非英語母語者內，高 HDI vs 低 HDI 的完課勝算 | RQ2 | L512 | 「The mean odds ratio M = 1.83, is significantly different from 1 with p < .001. In other words, controlling for language by focusing on learners from non English-native countries, the completion odds of a learner from high HDI countries are 1.83 times larger than the odds of a learner from low HDI countries.」 |
| 4 | 同上，換算成低 HDI 的角度 | 低 HDI 的完課勝算是高 HDI 的 55%（1／1.83） | 同上 | Summary of results；Conclusion | L576、L628 | 「The odds of learners from low HDI countries to complete MOOCs successfully are 55% of those of learners from high HDI countries.」 |
| 5 | RQ2 示例課次 | 勝算比 1.11；高 HDI 117／1,252（1,369），低 HDI 64／763（827） | 3.MatSelx 2017 第三期，非母語 viewers | Table 3 | L512；表格頁 3 | 「The odds ratio for this course is 1.11, meaning that being from a high HDI country increases one's odds to complete the course by 11%.」（驗算 117×763／(1252×64) = 1.114，一致） |
| 6 | 課程本身與完課偏差（RQ3） | 同一門課不同課次之間對數勝算比的絕對差：M = 0.16（n = 124 對，Mdn = 0.05）；不同課之間：M = 0.3（n = 1,992 對，Mdn = 0.26）；Welch t(137.55) = 6.01，p < .001 | 同一門課的課次配對 vs 不同課的課次配對（只含非母語者） | RQ3、Fig. 3 | L528 | 「Since the changes are absolute we can infer that course related factors contribute for a mean change of 0.3 − 0.16 = 0.14. Thus, we conclude that "the course matters" with respect to completion bias.」 |
| 7 | 「課程解釋 47%」 | 0.14／0.30 ≈ 47% | 同上 | RQ4 開頭；Summary；Conclusion | L540、L580、L628 | 「As the course explains almost half of the value of the odds ratio (47%)…」。注意：47% 是兩種配對「對數勝算比絕對差的平均」相減後的比例，不是勝算比本身的 47%，見下節 |
| 8 | 六門課的完課偏差（Table 4 的 OR 列） | ESD.SCM1x 1.684（p < .001）、8.MReVx 1.442（.004）、7.00x.2 1.248（.029）；JPAL101SPAx 1.207（.248）、CTL.CFx 1.097（.622）、3.MatSelx 1.114（.505） | 各課高 vs 低 HDI 的完課勝算比 | Table 4 | 表格頁 4 | 表列 |
| 9 | 拿到證書者的能力差距（RQ4）：六門有五門**沒有**評量偏差 | 已開發／開發中 IRT 能力平均：SCM1x −0.048／0.089（t(206.73) = 0.98，p = .331）；8.MReVx −0.041／0.095（t(191.67) = 0.79，p = .434）；7.00x.2 0.04／0.183（t(132.1) = 1.12，p = .266）；JPAL101SPAx 0.053／0.582（t(4.18) = 2.375，p = .074）；CTL.CFx −0.001／−0.043（t(55.43) = 0.247，p = .806） | 完課者中，已開發 vs 開發中國家 | RQ4、Table 4、Fig. 4 | L542；表格頁 4 | 「Among the six courses, five do not contain assessment bias.」 |
| 10 | **反向**：四門課開發中國家完課者的能力反而較高（都不顯著） | 4／6（67%）：SCM1x、8.MReVx、7.00x.2、JPAL101SPAx（由 Table 4 對出是哪四門） | 同上 | Discussion | L609 | 「In four of six (67%) courses the difference in ability by HDI is actually opposite from expected, with low HDI learners achieving greater mean ability than high HDI ones, although all differences are statistically insignificant.」 |
| 11 | 唯一有評量偏差的課 3.MatSelx | 已開發 M = 0.03（表 0.033），開發中 M = −0.46（表 −0.461），t(37.38) = 2.39，p = 0.022；差 0.49 個標準差；n = 152 人（表寫 152／41 題） | 完課者中，已開發 vs 開發中 | RQ4、Table 4 | L556 | 「Thus, the assessment bias in this course-run can be calculated as 0.03−(−0.46) = 0.49 measured in standard deviations.」 |
| 12 | 完課偏差與評量偏差沒有系統關聯 | 有評量偏差的那門課（3.MatSelx）沒有完課偏差；有完課偏差的三門都沒有評量偏差 | 跨六門課 | RQ4 | L542、L556 | 「To conclude the results of RQ4, we see no evidence that completion bias and assessment bias are systematically associated.」 |
| 13 | 西語授課的課沒有完課偏差 | JPAL101SPAx 完課 OR 1.207（p = .248） | — | RQ4 | L540 | 「As an anecdote, the course JPAL101SPAx is using Spanish as the instruction language, which can be an explanation for the lack of completion bias.」（作者自稱 anecdote，n = 1 門課） |
| 14 | DIF 刪題（RQ5）：效果很弱，其中一法**反向** | 原模型 36 題，差距 0.49；MH 刪 1 題（3%）後差距 0.50（102%，變大）；邏輯迴歸刪 3 題（8%）後 0.45（92%），差距仍顯著 p = .035 | 3.MatSelx 刪題前 vs 刪題後 | RQ5、Table 5 | L560–570；表格頁 5 | 「However, even after removing the items discovered by these methods, the difference between the means of ability estimate in the groups (assessment bias) is still statistically significant (p = .035). The assessment bias is still present after the DIF treatment.」 |
| 15 | 與 Türkay 等 2017 相反 | Türkay：英語學習者拿證書的勝算約為母語者的 60%（p < .001）；本研究：控制 HDI 後語言與完課無關 | — | Discussion | L588–591 | 「The language variable, when controlling for development, was found to be independent of MOOC completion, which contradicts (Türkay et al., 2017), which reported that the odds of ELLs to obtain a certificate are ∼60%, p < .001 of those of native speakers.」 |
| 16 | 作者對矛盾的五種解釋 | (a) 完課與證書高度相關但不相同；(b) 資料集不同（~150 MITx vs ~100 HarvardX）；(c) 模型與控制變項不同；(d) Türkay 合併所有學習者算，本研究逐課算，可能是辛普森悖論；(e) 本研究用 IP 推語言，Türkay 用 edX 問卷，有自我選擇偏誤 | — | Discussion | L593–599 | 「These different results call for additional research on the role that language may play in MOOCs」 |
| 17 | 六門課的特性 | 見 Table 1：五門英語授課，JPAL101SPAx 西語；CTL.CFx 是一週的監考考試，不是一般課程；3.MatSelx 三週自學課 | — | Table 1 | L393–397；表格頁 1 | 「In terms of content and pedagogy, except for CTL.CFx, the courses followed an active learning pedagogy, with graded formative assessment…」 |

## 作者自己列的限制（L624）

- 以最常用 IP 代表語言與發展程度，會誤分類：住在英語國家的非母語者、住在非英語國家的母語者、用 VPN 的人。作者認為準確度足夠，但沒有給驗證數字。
- 國家層級的 HDI 忽略國內差異，用全國平均代表個人社經地位（L289 另稱「a (very) rough estimate for personal SES」）。
- 資料只來自 MITx：「This is _not_ a randomly selected set of MOOCs in terms of domain (almost entirely science and technology), course design (e.g., MITx MOOCs may be more problem-solving oriented), and the learner population that these courses may attract.」
- IRT 假設能力在作答期間固定，但形成性評量本來就預期能力會成長（L440）。
- RQ5 的非參數 DIF 方法檢定力較低；題目偏差太多時逐題方法會失效（L617）。

## 與摘要說法不一致的地方

1. **課次數**：摘要與方法寫 158 個課次（L79、L391），RQ1 寫「over the 159 course runs」（L494），引言寫「~150」（L187）。原文沒有解釋差一個從哪來。
2. **「課程有相近的影響」**：摘要說「not only the specific population of learners is responsible for this bias, but also that the course itself has a similar impact」（L79）；正文的依據是 47%，而 47% 是「同課配對 vs 異課配對的對數勝算比絕對差」的比例（L528），不是勝算比的分解。結論與摘要把它寫成「explains 47% of the value of the odds ratio」（L580、L628），比計算本身說得強。RQ3 的設計也有前提：假設同一門課不同課次之間只有學習者族群在變（L526），這個假設沒有檢驗。
3. **DIF 的「weak, yet positive results」**（L79）：Table 5 的 MH 法刪題後差距從 0.49 變成 0.50（102%），是反方向；只有邏輯迴歸法縮小到 0.45（92%），而且仍顯著。摘要的「positive」只對其中一種方法成立。
4. **3.MatSelx 的人數與題數對不上**：Table 1 寫 N viewed 884、n certified 884（兩個數字相同，看起來是表格錯誤）；RQ5 正文寫 241 位完課者、152 人進入最終模型（L560）；Table 4 寫 n = 152／41（學習者／題目），Table 5 與正文寫 36 題（L568）。另外 Table 2、3 的同一門課（2017 第三期）光是已開發國家 viewers 就有 2,002 人、非母語 viewers 2,196 人，比 Table 1 的 884 還多。我沒辦法判斷是不同課次、不同篩選還是表格錯誤，原文沒有說明。
5. **RQ1 示例課次的 Table 2 與 Table 3 共用同一列數字**（高 HDI 非母語 117／1,252／1,369），這本身一致（兩表的交集就是高 HDI 非母語者），不算矛盾，記下來供引用時不要誤以為是兩個獨立樣本。
6. **JPAL101SPAx 的 t 檢定自由度 4.18**（Table 4）：開發中國家完課者的能力平均 0.582 對已開發 0.053，差距是六門課最大，但 df 只有 4.18、p = .074。原文沒有解釋自由度為何這麼小（推測某一組人數極少，不確定）。
7. 摘要說「we do not find evidence regarding a negative effect of not being English-native」，與正文 RQ1 一致；但正文 RQ1 結論句寫成「completion is independent of the language」（L494），是由不顯著推到「獨立」，比摘要說得強。

## 與清單「要撐的結論」不合的地方

清單原句：「開發中國家學習者較難完成；非英語母語本身沒有找到負面效果」。

- 前半撐得住：非英語母語者中，低 HDI 的完課勝算是高 HDI 的 55%（勝算比 1.83，137 課次，p < .001）。但這是**觀察相關**，HDI 是用 IP 推的國家層級指標，作者自己說它只是個人社經地位的「(very) rough estimate」。
- 後半要加四個限定才撐得住：
  1. 只在**高 HDI 國家**內比（因為英語母語國家全都是高 HDI），所以印度、奈及利亞這類低 HDI 但英語通用的國家完全不在 RQ1 裡；結論不能推到低 HDI 的非母語者。
  2. 「母語」是用 IP 國家推的，不是學習者的實際語言能力；新加坡、荷蘭、北歐這類英語能力高的非英語國家都算「非母語」，這會把語言效果稀釋掉（這是我的推論，原文只列了 IP 誤分類與 VPN）。
  3. 量的是**完課**，不是學到多少；完課者的 IRT 能力只比了 HDI，沒有比語言。
  4. 是「沒找到證據」（M = 1.076，p = .464），不是「證明沒有效果」，沒有等價性檢定；而且與 Türkay 等 2017（約 60%）直接相反，作者自己也說需要更多研究。
- 另外清單沒提到、但 order 24 可能會用的：完課者裡開發中國家的能力在 5／6 門課不比已開發差、4 門反而較高（都不顯著）——也就是「難的是撐到最後，撐到最後的人學得不差」。這是六門課、完課者的倖存者樣本，作者自己稱為「open question」（L615）。

## 讀取紀錄

- 原文檔 L1–240（頁首、書目、摘要、引言、文獻回顧前段）、L241–476（文獻回顧後段、方法全節）、L477–676（結果 RQ1–RQ5、結果摘要、討論與限制、結論、資料可得性、縮寫表），依序讀完。
- L677–860 參考文獻：掃過。
- L861–1023 致謝、經費、作者資訊、貢獻、利益衝突、授權、書目資訊、關鍵詞、站台頁尾：讀過，頁尾是站台導覽。
- 補抓的 `mooc-english-bias2021-tables.md`：Table 1–5 全讀，並用 Table 2、3 的四格驗算了正文的 1.14 與 1.11。
- 補抓的 `mooc-english-bias2021-pdf.jina.md`：只用來對 RQ1、RQ4、RQ5 與討論段落（文字與網頁版一致）及收稿日期；沒有從頭讀。
- 表格沒有對到 PDF 版面（拿不到本機 PDF），是對出版者自己的 HTML 表格頁。Fig. 1–4 是圖片，沒有看到圖中數值，只用圖說。
