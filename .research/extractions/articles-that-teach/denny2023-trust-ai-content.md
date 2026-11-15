# 抽取紀錄：Denny、Khosravi、Hellas、Leinonen、Sarsa 2023，arXiv:2306.10509v2

- **書目**：Paul Denny（University of Auckland）、Hassan Khosravi（University of Queensland）、Arto Hellas（Aalto University）、Juho Leinonen（University of Auckland）、Sami Sarsa（Aalto University）（2023）〈Can We Trust AI-Generated Educational Content? Comparative Analysis of Human and AI-Generated Learning Resources〉。arXiv:2306.10509v2 [cs.HC]，2023-07-03（頁面日期 July 4, 2023）。作者姓名與單位對過首頁（L6–27）。存檔沒有期刊 DOI；這一版是否後來正式刊出，檔內沒有資訊，我沒有另外查。
- **原文檔**：`.research/raw/learning-content/q6-evaluate/denny2023trustaicontent.txt`（815 行、67,340 字元，`pdftotext -layout`；參考文獻 L640–810）；PDF 同名 `.pdf`，15 頁。
- **版本**：預印本（arXiv v2）。稿內仍留著匿名審稿用的佔位字 `{AnonymizedTool}` 與「{Anonymized - details present on title page}」（L208、L635–636），是投稿稿沒有清乾淨的狀態。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 28（#2）
- **版面**：單欄，文字檔段落順序正確。Table 1–8、Listing 1、Figure 2–4 對過 PDF 第 6–11 頁，數字與文字檔一致。

## 研究設計

- **類型**：課堂內的觀察比較（不是隨機分派實驗）。把 LLM 產生的學習資源混進學生互評的資源池，學生不知來源地評分（盲評），再比較兩種來源拿到的評分。
- **研究問題**（L78–81）：RQ1 給同樣的範例，學生寫的與 AI 產生的資源在長度與語法特徵上差在哪；RQ2 學生對兩者的正確性與有幫助程度評分有何不同。
- **場域**：University of Auckland 大一程式設計課，工程學程必修，用 C 語言，2022 年修課人數 950（L213–217）。作者說這門課競爭激烈（成績決定大二分流），退選或不及格通常不到 5%。
- **受試者人數**：原文沒有寫有多少學生參與產出或評分，只有資源數與評分數（Table 2）。
- **任務**（L231–245）：每週實作課的最後一題，佔成績 2% 的實作課的一部分。學生寫一個「code example」：一段自選的程式碼加一段自然語言說明（規定第一句寫整體目的，之後可補逐行細節，幾句即可）。
- **平台**：文中匿名為 `{AnonymizedTool}`；2.3 節寫明本研究用的平台是 RiPPLE（L167「RiPPLE [33], which is the platform we use in the current study」）。
- **共同的起點**：教學團隊寫了 6 個範例（都是單一函式，Table 1），3 個放在實作說明、3 個放在搭配的講課裡（L271–276）。
- **AI 資源怎麼產生**（L277–303）：把同樣的 6 個範例當 few-shot 提示餵給 Codex（code-davinci-002），temperature 0.7，產生 100 個新的 code example；其中 50 個用 3 個範例的短提示、50 個用 6 個範例的長提示。兩種提示的差別「is outside the scope of the current study」，沒有分析。AI 產出**沒有經過人工篩選或正確性檢查**就全數放進資源池（原文沒有提到任何篩選步驟）。
- **評分**（L304–308，Figure 3）：學生用平台的互評功能評分，看不到來源。評分表有五項，每項五個選項：程式碼的正確與精確、說明的正確與精確、整體有幫助程度、整體品質（decision），選項是 Poor／Needs Improvement／Satisfactory／Great／Outstanding；另有評分信心（Very low 到 Very High）。分數如何編碼成數字原文沒有寫（表中中位數為 4）。
- **資料量**（Table 2，L408–413）：學生產生 886 個資源、收到 4,053 筆評分；AI 產生 101 個資源、收到 446 筆評分；合計 987 個資源、4,499 筆評分。
- **分析**（L313–315）：量化資料用 Mann-Whitney U，類別資料用卡方；p < 0.05。評分是以「一筆評分」為單位比較，沒有處理同一個評分者或同一個資源的重複（原文沒有提到任何分層或多層次處理）。
- **沒有做的**：沒有專家或教師檢查兩種資源實際對不對；沒有量任何學習成果；沒有問學生能不能分辨來源。

## 結果（逐項）

### RQ1　內容差異

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 程式碼長度 | 中位數：AI 224 字元、學生 377 字元；平均 AI 252（σ 113）、學生 693（σ 1,750）；U = 25123.5，p < .001 | AI 產生 vs 學生產生的 code 部分 | 4.1／Table 6 | L493–495、L510、L514–518 | 「there is a considerable (and statistically significant, Mann-Whitney U = 25123.5, p < .001) difference in the lengths of the code components produced, with the median length being 224 characters for the AI and 377 for the students」 |
| 2 | 說明長度（方向相反） | 中位數：AI 395 字元、學生 303 字元；平均 AI 405（σ 133）、學生 373（σ 329）；U = 55834.5，p < .001 | AI vs 學生的 explanation 部分 | 4.1／Table 6 | L510–512、L514–518 | 「the direction is the opposite, with students producing a median of 303 characters for their explanations compared to 395 characters for the AI」 |
| 3 | 關鍵字分布 | 三組（教師、AI、學生）的關鍵字原始次數分布有顯著差異，卡方 p < .001 | 教師 6 個範例 vs AI vs 學生 | 4.1／Table 3 | L476–477 | 「The difference in the distributions between all three groups (based on the raw number of keyword occurrences) is statistically significant using a Chi-squared test (p < .001).」 |
| 4 | 每 1,000 字元的關鍵字次數（Table 5） | `int`：教師 10.76、AI 14.86、學生 6.13；`while`：1.34、2.12、0.52；`for`：1.34、2.2、1.63；`return`：1.79、3.54、1.5；`else`：1.79、0.51、0.7；`double`：0.45、0.04、0.6；`if`：3.14、3.26、2.35 | 同上 | Table 5 | L502–507 | 「The AI uses 'while' frequently compared to humans: four times more than students, and slightly under twice as often as instructors.」（L470–471） |
| 5 | 只有學生用到的關鍵字 | float、do、case、continue、short、unsigned、true、struct、const、false、default、typedef、auto、goto、signed、static、switch | 學生 vs AI 與教師 | 4.1 | L421–423 | 「only students had some occurrences for the following keywords」 |
| 6 | AI 的說明幾乎沒有文法或拼字錯誤 | 沒有給數字 | — | Discussion | L573–574 | 「We observed almost no grammatical or spelling errors in the explanations produced by Codex.」 |
| 7 | AI 的產出貼近範例，學生的變化大 | 質性描述；學生有人寫完整程式、含 include、測試案例、註解 | — | Discussion | L553–556、L571–572 | 「the AI seems to mirror the given examples and instructions more closely」 |

Table 3（原始次數）與 Table 4（每個資源平均次數）也對過 PDF：Table 4 的 AI 列是用 101 個資源算的（378 ÷ 101 = 3.74）。

### RQ2　學生的評分（Table 7、Table 8；L523–540、L563–568）

| # | 評分項目 | 學生產生（Mdn／平均／σ） | AI 產生（Mdn／平均／σ） | 檢定 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 8 | 程式碼正確性 | 4／4.09／0.91 | 4／4.03／0.98 | U = 885785.0，p = 0.46 | L527–528、L533 | 「none of the differences are statistically significant (U = 885785.0, p = 0.46 for code correctness; U = 940809.5, p = 0.13 for explanation correctness; U = 894970.0, p = 0.72 for helpfulness)」 |
| 9 | 說明正確性 | 4／4.01／0.93 | 4／4.10／0.87 | U = 940809.5，p = 0.13 | 同上 | 同上 |
| 10 | 有幫助程度 | 4／3.91／0.94 | 4／3.89／0.97 | U = 894970.0，p = 0.72 | 同上 | 同上 |
| 11 | 整體品質（decision） | 4／3.94／0.91 | 4／3.85／0.97 | U = 860373.5，**p = 0.07** | L539–540、L567–568 | 「the differences are not statistically significant (U = 860373.5, p = 0.07 for decision; U = 922883.5, p = 0.43 for confidence)」 |
| 12 | 評分信心 | 4／3.95／0.78 | 4／3.97／0.81 | U = 922883.5，p = 0.43 | 同上 | 同上 |

評分基礎：學生資源 4,053 筆、AI 資源 446 筆（Table 2）。五項都沒有顯著差異；方向上，程式碼正確性、有幫助程度、整體品質是學生的資源平均略高，說明正確性是 AI 略高。整體品質的 p = 0.07 最接近門檻，方向是學生的資源較高。

## 作者自己列的限制

這篇沒有獨立的「限制」一節，散在討論與結論：

- 沒有量學習成果，也不知道這些初步觀感會不會隨時間維持（L591–592「there is a need for studies to examine the long-term impact of the use of AI-generated resources on learning outcomes and to ascertain whether these initial perceptions of the usefulness of AI-generated content hold up over time」）。
- 沒有顯著差異不等於沒有差異，換更大的母群或別的情境可能出現（L593–595）。
- 這批學生誘因強、投入高；學生投入低的課堂，學生產生的內容品質通常較差，結果可能不同（L595–599）。
- 只測一種資源（入門程式課的 code example）（L626–628）。
- 給 AI 的範例很同質，AI 產出的變化因此有限（L587–590、L615–616）。
- 短提示與長提示的差別留待後續（L286–299）。

作者沒有列、但設計上存在的：沒有任何獨立的正確性檢查，所以「正確性」是學生的觀感分數；作者自己在 2.3 節引用的同平台研究也提到學生的評鑑能力有差異（L169–171「finding a strong correlation between student and expert ratings of artefacts while acknowledging variations in students' evaluation skills」）。評分以筆為單位，沒有處理評分者與資源的巢狀結構。參與學生人數沒有報告。

## 與摘要說法不一致的地方

- **摘要寫「is equivalent to」**（L41–42「the quality of AI-generated resources, as perceived by students, is equivalent to the quality of resources generated by their peers」）：正文做的是 Mann-Whitney 差異檢定，五項都不顯著，沒有做等效性檢定；整體品質一項 p = 0.07。正文與結論自己的用詞較保守（「comparable」L579、「largely on par」L612）。
- **AI 資源的數量**：方法段寫產生 100 個並全數放進平台（L279、L301–302），Table 2 寫 AI-generated 101 個（L412）；Table 4 的平均數也與 101 相符。多出來的 1 個原文沒有解釋。
- **標題問「Can We Trust」，摘要與正文回答的是「學生覺得一樣好」**：整篇沒有任何一項測量是在檢驗內容可不可信（實際正確率），只有觀感評分。摘要有寫「as perceived by students」，算是有交代，但標題比內容大。
- **討論段「AI 的程式碼長度與教師的範例相當」**（L551「The length of AI-generated code appears to be comparable to that of instructors'」）：文中沒有報告教師範例的長度。用 Table 3 與 Table 5 反推（24 次 `int` ÷ 每千字元 10.76 次 ÷ 6 個範例）教師範例平均約 372 字元，比較接近學生的中位數 377，而不是 AI 的平均 252。這是我用表內數字算的，原文沒有這個數字；同一算法套在 AI（378 ÷ 14.86 × 1000 ÷ 101 = 252）與學生（3765 ÷ 6.13 × 1000 ÷ 886 = 693）都與 Table 6 的平均吻合。
- 其餘逐項對過（長度方向、關鍵字、評分無顯著差異），與摘要一致。

## 與清單『要撐的結論』不合的地方

清單寫：「學生盲評 AI 與同學寫的範例，觀感無差異（沒有測辨認）」。

- **撐得住**，括號裡的但書也對：研究只讓學生在不知來源下評分，沒有問學生能不能分辨來源。
- 要補上的條件：
  1. 比較對象是**同學**寫的範例，不是教師或專家寫的教材。這是「AI 不比大一學生差」，不是「AI 與人寫的教材一樣好」。
  2. 「觀感」含三個細項與一個整體分，全部是學生打的分數；**沒有人檢查實際正確性**，所以這篇不能拿來支持「AI 產生的內容是正確的」或「可以信任」。
  3. 「無差異」是五項差異檢定不顯著（p = 0.07 到 0.72），不是等效性檢定；整體品質 p = 0.07，方向是學生的資源略高。
  4. 沒有量學習成果。
  5. 模型是 Codex（code-davinci-002）、內容是 C 語言的短函式加短說明、學生是高誘因的工程大一生。
  6. 參與人數原文沒寫，只能寫「987 個資源、4,499 筆評分」。
- 另一個可用但清單沒提的結果：AI 的產出緊貼範例、變化小，學生的產出長度與用到的語法都更多樣（RQ1）。

## 讀取紀錄

依序讀原文檔 `denny2023trustaicontent.txt`：
- L1–420（標題、摘要、1 Introduction、2 Related Work、3 Methods、Table 1、Table 2、4.1 開頭）
- L421–815（4.1 其餘、Listing 1、Table 3–8、4.2、5 Discussion、6 Conclusion、聲明、References）

兩段首尾相接，涵蓋全文 815 行。參考文獻 L640–810 逐條掃過。本篇沒有附錄。

對過 PDF 版面：PDF 第 6–11 頁，含 Figure 2（建立介面）、Figure 3（評分介面，五點量尺的選項文字取自這張圖）、Figure 4、Table 1–8、Listing 1。Figure 1（範例資源的截圖，PDF 第 4 頁）沒有另外開圖看，正文 L234–245 已描述它的兩個部分。
