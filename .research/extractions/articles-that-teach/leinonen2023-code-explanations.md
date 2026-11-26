# 抽取紀錄：Leinonen 等 2023，ITiCSE 2023（存檔為 arXiv:2304.03938v1）

- **書目**：Juho Leinonen（University of Auckland）、Paul Denny（University of Auckland）、Stephen MacNeil（Temple University）、Sami Sarsa（Aalto University）、Seth Bernstein（Temple University）、Joanne Kim（Temple University）、Andrew Tran（Temple University）、Arto Hellas（Aalto University）（2023）〈Comparing Code Explanations Created by Students and Large Language Models〉，*Proceedings of the 2023 Conference on Innovation and Technology in Computer Science Education V. 1 (ITiCSE 2023)*，July 8–12, 2023，Turku, Finland，ACM，8 頁。doi:10.1145/3587102.3588785。八位作者的姓名、順序、單位對過 PDF 首頁與頁內的 ACM Reference Format。
- **原文檔**：`.research/raw/learning-content/q6-evaluate/leinonen2023codeexplanations.txt`（489 行、63,649 字元，`pdftotext -layout`，雙欄左右交錯，**沒有用它讀**）；PDF 同名 `.pdf`，8 頁。
- **實際讀的檔**：不帶 `-layout` 重轉的 `.research/raw/learning-content/q6-evaluate/leinonen2023codeexplanations.seq.txt`（908 行、45,742 字元；我這次新增，下面的行號都是這個檔的行號）。重轉後正文順序正確，但首頁作者區塊、Figure 1–2 與 Table 1–2 的格子被拆成一行一格，這幾處一律以 PDF 版面為準。
- **版本**：作者稿（arXiv v1，2023-04-08），頁面帶 ACM 版權區塊與 ITiCSE 2023 的 DOI，內容是會議論文的作者版本；沒有和 ACM 刊出版逐字比對。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 28（#3）

## 研究設計

- **類型**：課堂內的觀察比較，兩階段。先收學生寫的程式碼解說，再把抽樣出來的學生解說與 LLM 產生的解說混在一起讓學生評分。不是隨機分派到條件的實驗；隨機的是每位學生看到哪四則解說。沒有量學習成果。
- **研究問題**（L139–141）：RQ1 學生與 LLM 寫的程式碼解說在正確、長度、易懂三方面差多少；RQ2 學生看重解說的哪些面向。
- **場域與受試者**：University of Auckland 大一程式設計課，C 語言，2022 年約 1,000 人修課（L244–246）。Lab A 每個函式收到 963 則學生解說（L280–281）；Lab B 有 954 位學生參與評分（L313–314）。作者自述這些學生是新手（L703）。
- **教材**（Figure 1，PDF 第 4 頁）：三個 C 函式 `LargestValue`、`CountZeros`、`AverageNegativeValues`，各含一個走訪陣列的迴圈，函式名稱就點出演算法（L268–271）。程式碼都是正確的（L714–715）。
- **Lab A**（L253–255、L272–277）：學生看三個函式，各寫一段「簡短說明這個函式的用途」。
- **Lab B**（L255–267）：兩週後，每位學生看 4 則解說，從 54 則的池子裡隨機抽（L288–289、L232–233），評三題；最後回答一題開放題「What is it about a code explanation that makes it useful for you?」。
- **54 則怎麼來的**（L278–288，Figure 2）：
  - 學生的 27 則：每個函式的 963 則依**字數**分成三層——最短的 10%、中間 10–90%、最長的 10%——每層隨機抽 3 則，每個函式 9 則。也就是說 27 則裡有 18 則來自最短與最長的各 10%，**不是學生解說的代表性樣本**。
  - LLM 的 27 則：用 GPT-3 為每個函式各產生 9 則。模型是 davinci-text-002（L729；原文如此寫）。提示詞只在結果段間接提到是請它說明「the following code snippet」的用途（L612–614），完整提示詞、溫度、有沒有挑選或剔除都沒有寫。
- **評分題**（L235–240，各五點）：
  - 「This explanation is easy to understand」：Strongly disagree 到 Strongly agree
  - 「This explanation is an accurate summary of the code」：同上
  - 「This explanation is the ideal length」：Much too short、A little too short、Ideal、A little too long、Much too long（3 分代表剛好）
- **學生知不知道來源**：原文沒有寫。整篇沒有出現 blind 或類似字眼，也沒有說學生是否被告知池子裡有 AI 產生的解說。
- **分析**（L290–309）：四個 Mann-Whitney U 檢定（易懂、正確、理想長度、實際字元長度），Bonferroni 校正門檻 p < 0.05/4 = 0.0125；另報 Rank-Biserial Correlation（RBC）與 Common-Language Effect Size（CLES）。RQ2 是對隨機抽出的 100 則開放題回答做主題分析。評分以「一筆評分」為單位彙總比較。

## 結果（逐項）

### RQ1　評分比較（Table 1、Table 2，PDF 第 4 頁，已對版面）

| # | 項目 | 學生寫的（平均／中位數） | LLM 產生的（平均／中位數） | U | p（未校正） | RBC | CLES | 是否過 Bonferroni 門檻 |
|---|---|---|---|---|---|---|---|---|
| 1 | 易懂 | 3.75／4.0 | 4.12／4.0 | 1421596.0 | 3.010 × 10⁻³¹ | 0.206 | 0.397 | 是 |
| 2 | 是程式碼的正確摘要 | 3.78／4.0 | 4.0／4.0 | 1568575.5 | 2.866 × 10⁻¹² | 0.123 | 0.438 | 是 |
| 3 | 長度理想（3 = 剛好） | 2.75／3.0 | 2.66／3.0 | 1860870.5 | 0.025 | −0.040 | 0.520 | **否**（0.025 > 0.0125） |
| 4 | 實際長度（字元） | 811／738 | 760／731 | 1779386.0 | 0.764 | 0.006 | 0.497 | 否 |

（表在 seq 檔 L423–458 與 L496–533 被拆散，上面的數字是照 PDF 版面逐格讀的。）

| # | 結果 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|
| 5 | 易懂與正確兩項有顯著差異，LLM 較高 | 4.2 | L484–487 | 「we observe statistically significant differences between the student- and LLM-generated code explanations in whether they are easy to understand and in whether they are accurate summaries of the code」 |
| 6 | 長度的觀感與實際長度都沒有顯著差異 | 4.2 | L487–489 | 「As per Bonferroni correction, there is no statistically significant difference in student-perceptions of whether the code explanations were of ideal length, and there is no statistically significant difference in the actual length of the code explanations.」 |
| 7 | 作者對 CLES 的白話解讀：一學生一 LLM 配對時，學生那則較易懂的約 40%、LLM 那則較易懂的約 60%；正確性是約 44% 對 56% | 4.2 | L535–544 | 「the proportion of pairs where the LLM-generated code explanation is easier to understand is approximately 60%」 |
| 8 | **效果量弱** | 4.2 | L544–549 | 「Although these differences are statistically significant (and visible, as seen in Figure 3), the effect sizes can be considered weak (RBC < 0.3).」 |
| 9 | 作者的推論：評分較高不是因為 LLM 寫得比較長或比較短 | 5.1 | L657–659 | 「There were no differences in either perceived or actual length of student- and LLM-created code explanations, so the increased ratings are not due to the LLM creating longer (or shorter) explanations.」 |

長度觀感的兩個平均（2.75、2.66）都低於 3，方向是兩種來源都被覺得略短，LLM 的稍微更偏短。

### 4.3　最高分與最低分的例子（`LargestValue`，依正確與易懂的平均排序）

| # | 來源 | 易懂 | 正確 | 長度 | 內容特徵 | 行號 |
|---|---|---|---|---|---|---|
| 10 | LLM 最高 | 4.2 | 4.5 | 3.5 | 一段，逐步講迴圈怎麼比較、怎麼更新 max | L571–580 |
| 11 | LLM 最低 | 4.1 | 3.7 | 2.0 | 只有一句：「This code snippet returns the largest value in an array of integers.」 | L581–585 |
| 12 | 學生最高 | 4.2 | 4.5 | 3.6 | 先講用途與回傳型別，列出兩個輸入，再講掃描過程 | L586–599 |
| 13 | 學生最低 | 3.3 | 3.3 | 1.6 | 只有一個片語：「to find the largest value within the array」 | L600–602 |

注意第 11、13 兩則：一句話的解說內容並沒有錯，但「正確摘要」的分數被打到 3.7 與 3.3。學生打的「正確」分數顯然混進了「講得夠不夠細」。這是我對這四個例子的觀察；作者在 4.4 有相近的說法（見第 19 項）。

| # | 結果 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|
| 14 | LLM 的 27 則全部以「This code snippet」或「The purpose of this code snippet」開頭；作者說部分是提示詞造成的 | 4.3 | L611–614 | 「all of the LLM-generated explanations started out with the statement "This code snippet" or "The purpose of this code snippet" while the student generated explanations differed more. This was partially due to the prompting of the LLM」 |
| 15 | 兩種來源的解說多半結構相似：用途、分析程式碼、回傳值 | 4.3 | L614–616 | 「most of the explanations by both students and the LLM generally followed a similar structure: function's purpose, analysis of the code, and finally the return output」 |
| 16 | 被學生形容為差的解說：漏細節，且太長或太短 | 4.3 | L606–610 | 「Bad explanations were characterized as those that missed some details of the code while either being too long or too short.」 |

### RQ2　主題分析（n = 100 則開放題回答，4.4）

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 17 | 關注具體面向 vs 概括面向 | 具體 57 人、概括 65 人（有人兩者都提） | L622–624 | 「students were almost evenly split between focusing on specific (n=57) and generic (n=65) aspects of the code with some students' responses including both」 |
| 18 | 具體面向的細項 | 需要逐行解說 21%；變數名稱、輸入與輸出參數 36%；定義術語 8% | L624–627 | 「students described the need for a line-by-line explanation (21%). Students also focused on even lower-level details like the names of variables, the input and output parameters (36%), and defining terms (8%).」 |
| 19 | 長度 | 40% 明確提到長度；對理想長度沒有共識，重點在「用最少的字傳達最多資訊」；短的解說被評得低，即使切中要點 | L631–640 | 「Students appeared to rate short explanations low, even when the explanation was to the point and might be something that a teacher would appreciate.」 |
| 20 | 學生另外想要、解說裡少見的東西 | 例子、範本、寫這段程式時的思路 | L627–629 | 「students requested examples, templates, and the thought process behind how the code was written」 |
| 21 | 作者的解讀：新手可能偏好較詳細的解說 | 推測語氣 | L640–642 | 「Students, them being novices, likely preferred more detailed explanations」 |

### 討論段的宣稱

| # | 宣稱 | 行號 | 原文一句 | 備註 |
|---|---|---|---|---|
| 22 | 學生偏好逐行解說，與過去「explain-in-plain-English」研究把抽象的 relational 回答評得比逐行的 multi-structural 回答高相反 | L680–685 | 「This finding was somewhat surprising as prior work… has typically rated 'relational' responses – short, abstract descriptions of the purpose of the code – higher than 'multi-structural' – line-by-line – responses. This suggests that there might be a mismatch between instructor and student opinions on what makes a good explanation.」 | 數字依據是 100 人中 21% 提到逐行（第 18 項），加上短解說被評低（第 19 項） |
| 23 | LLM 的解說可當作學生練習讀程式與寫解說時的範例 | L654–664 | 「This suggests that LLM-created code explanations could be used as examples on courses with the goal of supporting students in learning to read code.」 | 建議；本篇沒有測用了之後學得如何 |
| 24 | 過度依賴的風險與代幣制的構想 | L665–673 | 「One downside mentioned in previous work is potential overreliance on LLM support」 | 構想；沒有測 |

## 作者自己列的限制（5.3，L702–732）

- 學生是新手，會影響他們寫出什麼解說、也影響他們怎麼評分；過去研究發現學生與教師對同儕出題的評分有差異。作者直接寫：程度較好的學生或教師寫的解說「possible – even likely」會被評得比 GPT-3 高（L708–710）。
- 新手看重的解說類型可能與進階者不同，之後可能轉而看重較抽象、較短的解說（L710–713）。
- 只給正確的程式碼，沒有測解說或找出有錯程式的情況；函式相對簡單（L714–718）。
- **只看學生對解說品質的觀感，沒有量學習有沒有差異**（L719–720「we only looked at student perceptions on the quality of the explanations. Future work should study whether there are differences in student learning」）。
- 資料是彙總分析的，有些學生可能四則都是 LLM 的、有些四則都是學生的。作者說對「剛好看到兩則 LLM、兩則學生」的子樣本做過簡短分析，效果相近，但沒有報數字（L721–728）。
- 用的是 davinci-text-002，較新的 003 已在 2022 年 11 月推出（L729–732）。

作者沒有列、但設計上存在的：(1) 學生的 27 則是依長度分層抽的，三分之二來自最短與最長的各 10%，而學生又明顯把短解說評得低，這會把學生那一邊的平均往下拉；(2) 「正確」是學生打的分數，沒有專家核對；(3) 沒有交代學生是否知道來源；(4) LLM 的 27 則是否經過挑選沒有交代；(5) 評分以筆為單位，沒有處理同一評分者與同一則解說的重複。

## 與摘要說法不一致的地方

- **摘要「rated as being significantly easier to understand and more accurate summaries of code than student-created explanations」**：與 Table 2 一致，但摘要沒有寫正文自己下的判斷「the effect sizes can be considered weak (RBC < 0.3)」（L548–549）。平均差是易懂 0.37 分、正確 0.22 分（五點量表），中位數都是 4.0。
- **摘要「with respect to accuracy」、導言「perceived as more accurate」**：量的是學生對「是不是正確摘要」的同意程度，不是解說內容的實際正確率。導言用了 perceived，摘要沒有。
- **導言「equivalent in terms of ideal length」**（L143）：長度觀感的未校正 p = 0.025，只是沒過 Bonferroni 門檻 0.0125，沒有做等效性檢定；「equivalent」比統計結果強。
- **摘要「explanations created by students in a large course (n ≈ 1000)」**：約 1,000 是修課人數；實際拿來比較的學生解說只有 27 則（每個函式 9 則），對上 LLM 的 27 則。評分者是 954 人。摘要的寫法容易讓人以為比的是一千份學生解說。
- 其餘（長度無顯著差異、可自動產生）逐項對過，與正文一致。

## 與清單『要撐的結論』不合的地方

清單寫：「同上（學生盲評 AI 與同學寫的範例，觀感無差異；沒有測辨認），另一個樣本；學生偏好逐行解說」。

- **「觀感無差異」不對，要改寫**：這一篇的結果是學生把 LLM 的解說評得**顯著較高**（易懂 4.12 對 3.75，p = 3.0 × 10⁻³¹；正確 4.0 對 3.78，p = 2.9 × 10⁻¹²），效果量弱（RBC 0.206、0.123）。無顯著差異的只有長度觀感與實際長度。它和 Denny 2023 不是同一個結果，不能併成一句「觀感無差異」。
- **「盲評」原文沒有寫**：整篇沒有說學生不知道來源。Denny 2023 明寫 blind，這一篇沒有。只能寫「原文沒有交代學生是否知道來源」。
- **「沒有測辨認」撐得住**：沒有任何一題問學生分不分得出來源。
- **「另一個樣本」要注意重疊**：同一所大學、同一年（2022）的大一 C 語言課，與 Denny 2023 的場域描述幾乎相同（那一篇寫 950 人，這一篇寫約 1,000 人）。兩篇是不是同一門課的同一批學生，兩份原文都沒有說；不能寫成兩個獨立樣本。
- **「學生偏好逐行解說」是作者的說法，數字很薄**：依據是 100 則開放題回答中 21% 提到需要逐行解說，另有 36% 提到變數名稱與輸入輸出、40% 談長度，再加上短解說被評得低。沒有做「逐行 vs 概括」的直接比較。比較穩的寫法是「學生把只有一句的解說評得低，即使它沒有錯；約兩成的人主動說想要逐行解說」。
- **比較基準偏弱**：學生那 27 則有 18 則取自最短與最長的各 10%；作者自己也說教師或程度較好的學生很可能勝過 GPT-3。所以這篇支持的是「GPT-3 的解說在新手眼裡不比一批（含極端長短的）新手解說差」，不是「AI 寫的解說比人寫的好」。
- 沒有量學習成果，作者明列為限制。

## 讀取紀錄

依序讀重轉檔 `leinonen2023codeexplanations.seq.txt`，一次讀完 L1–908：
- L1–98 標題、作者區塊、摘要、關鍵字、CCS、版權區塊、ACM Reference Format
- L100–149 1 Introduction
- L151–230 2 Related Work（2.1–2.3）
- L232–240（評分三題，版面上屬 3.1.2 的後半，重轉時排到 3 之前）、L242–309 3 Method（3.1.1–3.1.3）
- L311–549 4.1、4.2（含被拆散的 Figure 1、Figure 2、Table 1、Table 2）
- L551–616 4.3
- L618–642 4.4
- L644–732 5 Discussion（5.1–5.3）
- L734–753 6 Conclusion、致謝
- L755–907 References（逐條掃過）

涵蓋全文 908 行。本篇沒有附錄。

對過 PDF 版面：第 1 頁（作者、單位、摘要、版權區塊）、第 3–5 頁（3 Method 全部、Figure 1、Figure 2、Table 1、Table 2、Figure 3、4.3 的四則例子）。Table 1 與 Table 2 的每一格都以 PDF 為準。Figure 3 是四條堆疊長條（GPT-3 與學生各在易懂、正確兩題的回答分布），圖上沒有標數字，只用來確認方向與正文一致。
