# 抽取紀錄：Ali、Khusro、Alahmadi 2024，PeerJ Computer Science（doi 10.7717/peerj-cs.2599）

- **完整書目**：Amjad Ali, Shah Khusro & Tahani Jaser Alahmadi (2024). Accessible interactive learning of mathematical expressions for school students with visual disabilities. *PeerJ Computer Science*, 10, e2599. https://doi.org/10.7717/peerj-cs.2599 。收稿 2024-07-04、接受 2024-11-20、刊出 2024-12-23（原文檔 L10）。作者名對過原文檔檔頭（L6–8）與 Crossref（2026-10-14）。單位：前兩位 University of Peshawar 資訊系（巴基斯坦），第三位 Princess Nourah bint Abdulrahman University（沙烏地阿拉伯）。資助：King Salman Center for Disability Research（KSRG-2023-021）（L14）。
- **版本**：刊出版。PMC11784810（https://pmc.ncbi.nlm.nih.gov/articles/PMC11784810/），CC BY 4.0（L11）。Unpaywall（2026-10-14）：gold，出版者與典藏兩個位置都是 cc-by。Crossref 沒有更正或撤稿關聯。
- **原文檔**：`.research/raw/learning-content/q5-social/math-a11y2024.txt`（PMC JATS 轉文字，955 行、94,798 字元）。同目錄 `math-a11y2024.html` 是同一份 JATS（205,391 位元組），沒有另外讀。表格（Table 1–6）在 JATS 轉文字裡是一列一行、欄位以空白分隔，沒有錯位；這是 PMC 的 XML 表格，不是 PDF 版面轉文字，所以沒有另對 PDF。圖（Fig 1–4）沒看。
- **讀取日期**：2026-10-14
- **供哪幾篇 order 使用**：order 23（清單 F 第 12 列，暫定「數學式對視障學習者的可讀性」）

## 研究設計

- **類型**：系統開發論文加一次使用者評估。主體是一個 Python 工具：把純文字輸入的數學式用 SymPy 轉成 Content MathML（L58），用 lxml 解析成樹（L90–91），抽出項、因式、常數、變數、關係（Algorithm 1，L117–194），配鍵盤快捷鍵與語音輸出（pyttsx3、gTTS）（L199–211）。只支援一次與二次式（L56、L377）。
- **快捷鍵**（Table 2，L200–209）：Ctrl+E 讀整條式子、Ctrl+T 逐項讀、Ctrl+R 讀項之間的關係、Ctrl+N 導覽選項、左右鍵逐項移動、Ctrl+F 因式、Ctrl+C 常數、Ctrl+V 變數、Esc 離開。Algorithm 1 第 9 步寫的是 Ctrl+T、Ctrl+S（子項）、Ctrl+F，與 Table 2 不完全一樣（L178–186）。
- **受試者**（L241）：巴基斯坦開伯爾-普什圖省 Peshawar、Abbottabad、Swat 的公立盲校；15 位教師（男 8、女 7）、94 名學生（男 50、女 44），學生 11–20 歲、6 到 10 年級。立意選樣（「The participants were chosen deliberately」）。全盲 90、弱視 19（Table 3，L250–251；這是師生合計 109 人）。
- **教材**：Oxford 與開伯爾-普什圖省課本裡的一次、二次式（L19）。
- **比較對象**：NVDA 與 Access8Math（L257、L263）。怎麼比——同一批人輪流用三種工具還是分組、順序怎麼安排、每種工具用多久——**原文沒有寫**。
- **量了什麼**（L258–262）：正確率（受試者標出項、因式、常數、變數的能力）、可用性（自編 TAM 問卷：易用性、有用性）、理解（「Evaluated according to respondent's explanations and suggestions」）、導覽效率（完成時間與錯誤數）。
- **何時量**：使用 15 天後填問卷（L257）。**沒有前測，也沒有數學學習成績的測驗。**
- **分析**：ANOVA、Cronbach's α、主題分析（L263–264）。

## 結果（逐項）

| # | 結果 | 數字 | 對照條件 | 表／節 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 正確率 | 本工具 85%、NVDA 70%、Access8Math 65% | 三種工具 | Table 4 | L267–271 | 「the proposed solution had an accuracy of 85% which compared well with 70% of NVDA and 65% of Access8Math」 |
| 2 | 完成時間 | 10、15、20 分鐘 | 同上 | Table 4 | L269–271、L366 | 「an average task completion time of ten minutes and an error rate of 5% as compared to 15 min and 15% for NVDA as well as 20 min and 20% for Access8Math」 |
| 3 | 錯誤率 | 5%、15%、20% | 同上 | Table 4 | 同上 | 同上 |
| 4 | 可用性分數（1–5） | 4.5、3.5、3.0 | 同上 | Table 4 | L269–271 | 「Proposed solution 85 10 5 4.5」 |
| 5 | 教師問卷（n = 15，7 題） | 105 個回答中非常同意 81、同意 15、中立 8、不同意 1、非常不同意 0 | 單組，無對照 | Table 5 | L274–282 | 「Total 81 15 8 1 0 105」 |
| 6 | 學生問卷（n = 94，7 題） | 658 個回答中非常同意 253、同意 328、中立 76、不同意 1、非常不同意 0；「easy to use」那題中立 20；「would recommend」那題中立 24 | 單組，無對照 | Table 6 | L283–291 | 「Total 253 328 76 1 0 658」 |
| 7 | 教師 α | 0.949（算式完整列出：k = 7、總分變異 15.924、題目變異和 2.962） | — | 式 (3)–(7) | L306–361 | 「Cronbach's alpha for this questionnaire is 0.949」 |
| 8 | 學生 α | 同一段先寫 0.81，下一句寫 0.91 | — | — | L362–363 | 「found a value of 0.81.」「Therefore, Cronbach's alpha for this questionnaire is 0.91」 |
| 9 | ANOVA（教師） | F = 11.22、df = 6, 98、p = 0.00000022 | 7 個問卷題目之間的平均差 | Statistical evaluation | L364、L372 | 「the p value was as follows 0.00000022 … with an F value of 11.22 and degrees of freedom of 6 for between and 98 for within group variations」 |
| 10 | ANOVA（學生） | 一處 F = 4.005、p = 0.006；另一處 F = 2.94、p = 0.00638 | 同上 | 同上 | L364、L372 | 「F = 4.005 and p = 0.006」「an F value of 2.94 and a p -value of 0.00638」 |
| 11 | 易用比例 | 一處教師 86.7%、學生 82.9%；另一處教師 91.43%、學生 83% | — | Usability、Statistical evaluation、Discussion、Conclusions | L273、L372、L374、L376 | 「A vast majority of instructors (86. 7%) and students (82. 9%) said that the solution was easy to use and helpful」 |
| 12 | 「效果量」 | 教師 0.94、學生 0.91，沒有說是什麼效果量、怎麼算 | — | Discussion | L374 | 「The overall mean estimate of effect size was 0.94 for the instructor group and 0.91 for the student group.」 |
| 13 | 質性 | 易用、幫助理解；有學生需要時間適應，教師建議加訓練模組與入門教學 | — | Qualitative analysis | L367–371 | 「I needed extra time to get used to this new system.」 |
| 14 | 學生自述 | 「The proposed solution helps me understand what the equations mean, not just read them」 | — | 同上 | L369 | （同左） |

**我自己核的數字**：Table 5 非常同意加同意 = 96／105 = 91.43%，對得上 L372 的教師 91.43%；Table 6 非常同意加同意 = 581／658 = 88.3%，**與正文的學生 82.9% 或 83% 都對不上**。教師 α 的算式代入後確實約 0.95。

## 作者自己列的限制

- 只支援一次與二次式；沒有整合觸覺回饋等裝置（L377）。
- 只在特定情境做代數，未來要做其他數學領域與情境（L375）。
- 質性：使用者需要適應時間，需要訓練（L370–371）。
- 作者**沒有**列：無前測、無學習成績測驗、比較設計沒交代、問卷是自編且只有正向措辭、ANOVA 比的是題目之間而不是工具之間。

## 與摘要說法不一致的地方

- 摘要與結論說「Results indicate that the proposed solution improved mathematics accessibility and learning」（L13）、「Empirical evaluations … demonstrated that the developed solution improves learning outcomes」（L376）；正文**沒有任何學習成果測量**——沒有前後測、沒有數學測驗分數。「learning」的證據是問卷自評（Table 5、6）與 Table 4 的工具比較（正確率指的是受試者標記式子成分的正確率，L259）。
- 摘要說用 Cronbach's α「validated」評估（L13）；α 只代表問卷題目內部一致，不是效度。
- 同一篇文章內的數字互相矛盾：學生 α（0.81／0.91；結論 L376 又寫教師 0.895、學生 0.81）、學生 ANOVA（F 4.005／2.94）、易用比例（86.7%／91.43%；82.9%／83%）。
- ANOVA 比的是同一份問卷 7 題之間的平均差（df = 6, 98 = 7 題 × 15 人），作者把它解讀為「rejecting the null hypothesis」並當成支持工具有效的證據（L372），但這個檢定與工具是否有效無關。這是我的判讀。
- Table 3 的年齡分組（10–15 歲 35 人、16–30 歲 35 人、31–60 歲 39 人）與正文「學生 11–20 歲、教師 15 人」對不上：31–60 歲有 39 人，多於教師總數 15。
- Table 4 只有整數百分比與分鐘數，沒有標準差、人數、題數或檢定。
- 文獻比較表（Table 1）有引錯的出處：MathCAT 引的是 Verschoor & Straetmans 2010「MATHCAT: a flexible testing system in mathematics education for adults」（L47 與參考文獻），那是同名的電腦化適性測驗系統，不是螢幕閱讀器用的 MathCAT；EyeMath 引的 Hernández-Sabaté 等 2016 題名是「identifying mathematics problem solving processes in a RTS video game」，與表中描述的泰文 OCR 工具不符。

## 與清單「要撐的結論」不合的地方

清單第 12 列暫定「數學式對視障學習者的可讀性」，筆記寫「只落地未細讀」。

- 引言與文獻回顧**可以撐**一般性的背景說法，但都是轉述別人：螢幕閱讀器難以傳達上標、下標、分數、矩陣等依賴空間版面的結構（L22，引 Maćkowski 2018、Miesenberger 2022）；點字顯示器只能顯示簡單式子且要求點字能力（L25）；點陣圖與 PDF 的數學式不可及（L16）。要引這些，應該回頭讀它引的原始研究，不宜以這篇當出處。
- 這篇自己的資料**撐不起**任何「改善學習」的說法：沒有學習測驗、沒有前測、比較設計沒寫、問卷自編且全是正向題、數字前後矛盾。若文章要用，只能用它的工具設計（把式子拆成項、因式、常數、變數並可逐項語音導覽）當作「有人這樣做」的例子，不能引 85% 對 70% 或 91% 易用當成效證據。
- 對 order 23 寫教學文章的實際建議而言，這篇與「網頁上的數學式要用 MathML 而不是圖片」相關的只有背景敘述（L15–17、L22–24），沒有實驗比較 MathML 與圖片或 LaTeX。

## 讀取紀錄

- L1–250（檔頭、摘要、引言、相關研究、Table 1、系統架構、Algorithm 1、Table 2、使用情境、受試者、Table 3 前半）、L251–580（Table 3 後半、研究設計、評估標準、結果、Table 4–6、α 算式、ANOVA、質性、討論、結論、補充資料清單、聲明、參考文獻前段）、L581–955（參考文獻後段，篩出題名列逐條掃過）。首尾相接，涵蓋全檔。
- Table 1–6 都在 JATS 轉文字裡逐列讀過；Table 5、6 的列與欄總和我自己加總核過（都對得上表內的 Total）。
- Fig 1–4 沒看；Fig 4 是 Table 4–6 的圖示，正文數字都已在表中。補充資料（問卷原題、原始回答、程式碼）沒有下載。
