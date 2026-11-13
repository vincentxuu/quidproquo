# 抽取紀錄：Head 等 2021，Augmenting Scientific Papers with Just-in-Time, Position-Sensitive Definitions of Terms and Symbols（ScholarPhi）

- **書目**：Andrew Head（UC Berkeley）、Kyle Lo（Allen Institute for AI）、Dongyeop Kang（UC Berkeley）、Raymond Fok（University of Washington）、Sam Skjonsberg（Allen Institute for AI）、Daniel S. Weld（Allen Institute for AI；University of Washington）、Marti A. Hearst（UC Berkeley）。*Proceedings of the 2021 CHI Conference on Human Factors in Computing Systems*（CHI '21），共 18 頁，2021-05-06。DOI 10.1145/3411764.3445648。七位作者的姓名與順序對過 PDF 首頁、PDF 中繼資料與 Crossref，三者一致（原文檔 L1–83 因雙欄交錯，作者順序是亂的，不能照文字檔抄）。
- **原文檔**：`.research/raw/learning-content/q2-interactive/head2021-scholarphi.txt`（2,235 行、116,275 字元）與同名 `.pdf`（18 頁）。
- **版本**：arXiv 預印本第 3 版（L10「arXiv:2009.14237v3 [cs.HC] 27 Apr 2021」），用 ACM 版型排版，頁數與 Crossref 登錄的 1–18 頁相同。**不是從 ACM Digital Library 下載的刊出版**；兩者是否逐字相同沒有核對。頁碼寫這份 PDF 的頁碼。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 4（記號、行話與術語）。

## 研究設計

這篇是系統論文，有三層實證資料，強度差很多，引用時要分開。

### (a) 形成性研究（3.1 節，L408–453，PDF 第 4–5 頁）

- 9 位讀者（4 位研究生、5 位大學部學生，代號 R1–9）。
- 各自帶一份自選的科學文本：6 人帶研究論文（5 篇資訊科學、1 篇建築），3 人帶教學性文本（資料科學、實驗設計、形式分析）。
- 讀 40 分鐘並放聲思考；遇到看不懂的段落就說出來，並說明要不要去查、去哪查、為什麼。
- 沒有比較組，沒有量化指標。

### (b) 四次前導研究（3.2 節，L497–525，PDF 第 5 頁）

- 12 個月的反覆設計，共五個原型，前四個各做一次前導研究：D（只有 declutter）4 人、S（側欄註記）4 人、T（工具提示）9 人、E（公式圖解與較複雜的工具提示）9 人。兩位研究者（S2、S3）參加了不只一次；前言說合計 24 位研究者（L167）。
- D、S 是觀察加放聲思考；T、E 是自行閱讀後 30 分鐘焦點團體加問卷，其中 7 人再做 15 分鐘訪談。每次讀不同的論文。
- 由**一位作者**做質性分析，得出七條設計動機 M1–M7（L523–525）。

### (c) 正式可用性研究（第 6 節，L1252–1476，PDF 第 11–12 頁）

- **受試者**：27 人，經大學與公司的郵件群組招募；納入條件是讀過機器學習論文。18 位博士生、5 位碩士生、3 位大學部學生、1 位專業研究人員。13 人自認領域是機器學習；21 人讀機器學習論文「有點自在或很自在」。報酬 20 美元禮券（L1261–1267）。
- **進行方式**：每場 1 小時，Zoom 遠端，記錄互動並錄螢幕（L1267–1271）。
- **教材**：所有人讀同一篇論文，Strubell 等〈Linguistically-informed self-attention for semantic role labeling〉。選它的理由是在自然語言處理領域廣為人讀，而且「uses some notation inconsistently and does not define all of its symbols explicitly」（L1272–1275）。
- **定義資料是人工整理的**：「a clean set of symbol, definition, and usage data was curated. Definitions were extracted by hand.」符號、定義式與用例自動抽取後少量人工修正（L1276–1281）。也就是說，這個實驗測的是介面，不是自動抽定義的效果。
- **流程**（L1282–1289）：同意書 → 用一篇兩頁論文做互動教學 → 讀教材論文摘要 → 一題計時練習 → **三題計時測驗，三種介面各一題，每題 4 分鐘**，每題後問信心與難易 → 自由閱讀 15–20 分鐘 → 問卷。
- **比較對象**（受試者內，L1293–1298）：
  - Basic：一般 PDF 閱讀器，有 Ctrl-F 搜尋（可區分大小寫、可標出全部相符處）。
  - Declutter：PDF 閱讀器加 declutter（選一個詞之後，把不含該詞的句子淡化）。
  - ScholarPhi：全部功能（點詞出現的定義提示、定義／定義式／用例清單、declutter、公式圖解、文前詞彙表）。
- **三道測驗題**（都是選擇題，L1302–1310）：
  - Results：「According to Table 1, which model achieves the best recall on WSJ data when GloVE embeddings are used?」
  - Dataset：「Which text corpora is the ConLL-2005 dataset made from? Select all that apply.」
  - Symbols：「What does T (upper case) mean in this paper? Select all senses in which T is used.」
- **分派**（L1319–1326）：九種「介面 × 題目」配對，每人做其中三種，每種介面與每種題目各碰一次；九種配對人數相同（各 9 人次）。順序平衡，三種介面順序各 9 人。
- **量了什麼**（L1397–1423）：Confidence（「I am confident I came up with the right answer.」五點量表）、Ease（「It was easy to find the answer.」五點量表）、Time（題目出現到按下一步或時間到的秒數）、Correct（複選題要全對且不多選才算對）、Area（看過的版面佔全文比例）、Distance（垂直捲動距離，以整篇文件長度為單位）。
- **沒有量的**：讀完之後懂了多少、記得多少。三道題都是「在論文裡找到某項資訊」的題目。
- **分析**（L1464–1467，附錄 A.1 L2180–2234）：每個指標配一個廣義線性混合模型，固定效果是介面、題目與兩者交互作用，受試者是隨機截距；Correct 用 logit 連結，其餘用恆等連結。介面的整體效果用 F 檢定（Correct 用概似比檢定）；兩兩比較用 emmeans 的雙尾 t 檢定；p 值做 Holm-Bonferroni 校正。α = 0.05。
- **自由閱讀階段**：看使用紀錄（各功能用了幾次）與主觀回饋，沒有對照條件。

## 結果（逐項）

### 可用性研究：三題計時測驗（Table 2，L1609–1673，PDF 第 14 頁；整張表對過 PDF 頁面）

表中數字是模型估計平均的差；p 值已校正。S＝ScholarPhi，D＝Declutter，B＝Basic。原表粗體（顯著）者標 ✔。

| # | 指標 | S − D（p） | D − B（p） | S − B（p） |
|---|---|---|---|---|
| 1 | Confidence（1–5） | 0.59（.094） | 0.19（.785） | 0.78（.020 ✔） |
| 2 | Ease（1–5） | 0.93（.005 ✔） | 0.78（.020 ✔） | 1.70（< .0001 ✔） |
| 3 | Time（秒） | −27.6（.015 ✔） | −16.8（.218） | −45.4（.0001 ✔） |
| 4 | Correct（百分點） | −15%（.393） | 15%（.393） | **0%（1.000）** |
| 5 | Distance（文件長度數） | −0.24（.572） | −0.66（.023 ✔） | −0.90（.001 ✔） |
| 6 | Area（百分點） | −11%（.047 ✔） | −14%（.009 ✔） | −25%（< .0001 ✔） |

原文的解讀句：

| # | 結果 | 位置 | 原文一句 |
|---|---|---|---|
| 7 | 答題時間：全功能版比一般閱讀器平均少 45.4 秒（每題上限 240 秒），比只有 declutter 的版本少 27.6 秒；declutter 對一般閱讀器不顯著 | 6.2 節 L1533–1535；Table 2 圖說 L1671–1672 | 「ScholarPhi outperformed the other interfaces in terms of time required to answer the test questions (Time) (Declutter and Basic were not significantly different).」 |
| 8 | **答對人數三種介面沒有顯著差異**；全功能版與一般閱讀器答對人數完全相同 | L1535–1536 | 「No statistically significant differences were observed in the number of participants who answered questions correctly among the three interfaces.」 |
| 9 | 答對與答錯人數（Figure 7，PDF 第 12 頁，對過圖）：ScholarPhi 答對 16、答錯 11；Declutter 答對 20、答錯 7；Basic 答對 16、答錯 11（各 27 人次） | Figure 7，L1435–1462 | 「Figure 7: Correctness of responses for test questions. A lower number of incorrect answers is preferred.」 |
| 10 | **全功能版在 Symbols 題幾乎都答錯**：定義清單沒有列出 T 的所有意思，受試者以為清單是完整的 | L1542–1553 | 「We found that participants almost always answered this question incorrectly using ScholarPhi because the definitions list did not show all of the usages, and the participants had the expectation that the definitions list showed all senses of the symbol. This highlights an important potential drawback of a tool like ScholarPhi: it can mislead if it implies incorrect information.」 |
| 11 | 另兩題（Results、Dataset）全功能版答得較好。各題各介面的答對人數原文沒有給數字 | L1545–1547 | 「participants performed better on both the Results and Dataset questions using ScholarPhi, but performed very poorly on the Symbols question with this interface.」 |
| 12 | 主觀難易：全功能版高於另兩者，declutter 高於一般閱讀器 | L1484–1487 | 「ScholarPhi outperformed Basic on Ease and Confidence, and Declutter on Ease. Declutter also reported higher Ease than Basic, but not higher Confidence.」 |
| 13 | 信心：全功能版只對一般閱讀器顯著，對 declutter 不顯著（p = .094） | L1487–1488 | 「ScholarPhi reported higher Confidence than Declutter, but this result was not significant at α = 0.05.」 |
| 14 | 看過的版面與捲動距離：兩種加強版都少於一般閱讀器；全功能版的版面又少於 declutter，距離則無顯著差 | L1537–1539 | 「participants traversed less screen Distance and viewed less Area of the paper under ScholarPhi and Declutter compared to Basic; ScholarPhi outperformed Declutter on Area but did not significantly outperform Declutter on Distance.」 |
| 15 | 介面的整體效果（附錄 A.1.2）：Correct p = .047、Ease p < .001、Confidence p = .040、Time p < .001、Distance p = .005、Area p < .001 | L2187–2191 | 「We found significance for Correct (p = .047), Ease (p < .001), Confidence (p = .040), Time (p < .001), Distance (p = .005), Area (p < .001)—even while controlling for question and participantspecific effects.」 |
| 16 | 量表改用序位模型重算，結論相同 | 附錄 A.1.4，L2203–2213 | 「yielded similar p-values—Ease (p < .001) and Confidence (p = 0.045)—and resulted in the same conclusions」 |

Figure 6（PDF 第 12 頁，對過圖）各量表的人次分布，由「非常不同意」到「非常同意」：

- Ease：ScholarPhi 0／0／3／11／13；Declutter 3／2／5／14／3；Basic 5／8／7／5／2。
- Confidence：Declutter 2／2／5／12／6；Basic 1／6／4／11／5；ScholarPhi 是 1／3／11／12 四段，後三段是中立 3、有點同意 11、非常同意 12，第一段的 1 人是「非常不同意」還是「有點不同意」從圖的顏色分不出來。

Figure 8（PDF 第 13 頁）只有散點與平均線，原文沒有給各介面的平均時間、版面比例、距離的數字，只有 Table 2 的差值。

### 可用性研究：自由閱讀階段的使用紀錄（6.3.2 節，L1594–1757，PDF 第 13–15 頁）

沒有對照條件，是「給了工具之後用不用」。

| # | 結果 | 數字 | 位置 | 原文一句 |
|---|---|---|---|---|
| 17 | 至少用過一項功能 | 27 人中 26 人（96%） | L1594–1595 | 「All readers except for one (96%) used at least one of ScholarPhi's features during the unstructured reading time.」 |
| 18 | 定義提示用得最多 | 符號的提示：27 人中 24 人至少開一次，中位數 10 次（σ = 13.8，最多 54）；術語的提示：26 人至少開一次，中位數 5 次（σ = 3.6，最多 14） | L1597–1604 | 「All but three readers opened at least one tooltip for a symbol, and all but one reader opened at least one tooltip for a term. … Readers opened tooltips for symbols a median of 10 times (σ = 13.8, max = 54), and for terms a median of 5 times (σ = 3.6, max = 14).」 |
| 19 | 清單（定義、定義式、用例） | 27 人中 20 人開過任一種；定義清單 18 人、定義式清單 3 人、用例清單 10 人 | L1701–1704 | 「Nearly all (20 of 27) readers opened a list of definitions, defining formulae, or usages during the unstructured reading task.」 |
| 20 | 公式圖解 | 27 人中 21 人開過；中位數 3 次（σ = 4.3，最多 14） | L1717–1721 | 「Almost all (21 of 27) readers opened an equation diagram during the unstructured reading task.」 |
| 21 | **文前詞彙表用得最少** | 27 人中 6 人看了 10 秒以上；有兩人在開始時分別看了 2 分鐘與 5 分鐘 | L1734–1743 | 「The priming glossary was the least-used feature during the unstructured reading task. A few readers (6 of 27) were observed consulting the priming glossary for a nontrivial amount of time, defined in our protocol to be 10 or more seconds.」 |
| 22 | 有人把詞彙表當提示不夠時的後備 | P3、P12、P14、P22 | L1743–1746 | 「Several readers appeared to visit the glossary as a fallback when the definition tooltip did not contain the information they sought」 |
| 23 | Declutter 評價分歧 | 只有 declutter 的那題所有人都至少啟用一次；有人看不出用途（P25）、覺得比提示沒多什麼（P22）、覺得 Ctrl-F 更有效率（P2） | L1679–1700 | 「In contrast to tooltips, which were unanimously appreciated, the declutter feature saw disagreement.」 |

### 可用性研究：預期使用頻率（自陳，6.3.1 節，L1582–1593）

| # | 功能 | 「always」／「often」人數（共 27 人） |
|---|---|---|
| 24 | 符號的定義提示 | 16／8 |
| 25 | 術語的定義提示 | 15／9 |
| 26 | 公式圖解 | 17／6 |
| 27 | 符號的 declutter | 5／13 |
| 28 | 術語的 declutter | 2／15 |
| 29 | 文前詞彙表 | 8／6 |

沒有人對任何功能選「never」（L1592–1593）。量表說是五點，卻列了六個選項（Never、Rarely、Sometimes、Often、Always、Unsure，L1586–1587）。主觀評語中，27 份開放式問卷有 8 份出現驚嘆號（L1567–1568）。

### 形成性研究（9 人）的觀察

| # | 觀察 | 位置 | 原文一句 |
|---|---|---|---|
| 30 | 9 人中 8 人對文中某個術語感到困惑 | L420–421 | 「All but one reader expressed confusion at a term used in the text (R1–3, R5–9).」 |
| 31 | 4 人對數學符號感到困惑 | L459–461 | 「Mathematical symbols were another source of confusion (R2–4, R6).」 |
| 32 | 讀者先從上下文猜（R3、R6–9），猜不出來就拖著，希望後面會解釋（R1、R3、R4、R6–9） | L472–477 | 「readers would sometimes delay looking up an explanation with the hope that they might find one later in the text」 |
| 33 | 拖到後來可能整段看不懂 | L477–481 | 「a reader may reach a point in the text where they lack an understanding of so many important terms that they can no longer understand the text without stopping and searching for explanations.」 |
| 34 | 去查被形容成不想要的「context switch」（R4）；5 人在同一份文本裡往回翻、往後跳、開文內詞彙表或用 Ctrl-F | L482–490 | 「One participant referred to this as an undesirable "context switch" which takes them out of the "headspace" of understanding a complicated passage (R4).」 |
| 35 | 一位讀者自己在頁邊為關鍵符號做了詞彙表 | L442–445 | 「One reader took a proactive approach to reducing the cost of within-paper lookups by assembling glossaries for key symbols in the margins of the text (R4, see Figure 3).」 |
| 36 | 作者的歸納：讀者會去別處找解釋，但盡量避免 | L449–451 | 「While readers do look for explanations elsewhere, they try to avoid doing so as it takes them away from the text they are trying to understand.」 |

### 前導研究（24 位研究者）得出的七條設計動機（3.3 節，L531–715，PDF 第 5–6 頁）

質性觀察，括號是原文標的受試者代號。

- **M1 依出現位置給定義**：同一個符號在一篇論文裡有多個意思（教材論文的 T 至少三種）。把所有意思列成清單時，讀者想知道哪個適用於眼前這段（S1–3）。讀者正在讀定義句時，不想再看到同一句的提示（S1、T9）。
- **M2 讓讀者能跳到定義的原處**：4 位讀者要求（原文寫 four，括號列的是 S1–3、T5、T6 共五個代號）。
- **M3 把散在各處的資訊集中**（E1、E2、E4）。
- **M4 提供線索**：可點的詞加淡淡的虛線底線，讀者喜歡（S2–4），後期版本可以關掉但沒人關。
- **M5 減少遮擋**：把定義、定義式、用例全塞進提示會遮住想看的文字（T4、T6、E7），而且第一個定義之外沒多大價值（T1、T4–6）。但有讀者仍偏好提示勝過側欄，因為「without losing their place in the text」（E3、E4）。最後的做法是只放最近一個定義的精簡提示。
- **M6 減少分心**：「I was trying to pay more attention to the paper than the tool and the paper requires a lot of overhead to understand. So I didn't have much left over for the tool」（E1，L693–695）。多種標色造成視覺雜亂（E3）。底線多次被問到是否干擾，都說不會（S2–4、T5、T7）。
- **M7 支援錯誤復原**：自動抽定義會出錯。

Table 1（L538–649，PDF 第 6 頁，對過頁面）列設計選項：定義來源（同節／同篇／其他論文）、選哪一個（最近／第一個／最相關／全部）、擺放位置（頁邊／行間／側欄或頁尾／提示）等。最後採用的是同篇論文、最近的定義、可重排的文字、提示與側欄並用。這張表是設計空間的整理，不是實驗結果。

### 介面設計的理由（第 4 節，作者的設計主張，沒有單獨檢驗）

- 提示放在被選的詞正下方，理由是讀者視線不必離開文字（L743–747「By placing the definition beneath the word, as opposed to placing it in a document margin or a glossary elsewhere in the text, a reader need not divert their gaze from the text.」）。
- 提示寬不超過半頁、高不超過四行（L747–749）。
- 多個定義時顯示「該處之前最近出現的那一個」（L750–756）。
- 在定義句本身點開時只顯示「Defined here.」（L802–806）。

### 自動抽取的準確度（第 5 節，與閱讀效果無關，但顯示定義資料不能靠自動化）

| # | 結果 | 數字 | 位置 |
|---|---|---|---|
| 37 | 符號位置偵測（12 篇開發集） | 平均精確率 96%、召回率 88%；先展開巨集召回率 91% | L1065–1068 |
| 38 | 符號位置偵測（實驗用的教材論文） | 精確率 98%、召回率 98%，不含圖裡的符號 | L1159–1161 |
| 39 | 定義辨識模型在 W00 資料集 | 精確率 73%、召回率 74% | L1170–1172 |
| 40 | 在教材論文上：縮寫展開（Schwartz-Hearst） | 精確率 55%、召回率 43% | L1179–1181 |
| 41 | 在教材論文上：術語與符號定義辨識（HEDDEx） | **精確率 24%、召回率 6%** | L1181–1183 |

### 文獻段裡作者自己轉述的相反證據（2.2.4 節，L325–347；二手轉述，沒有讀原始文獻）

- 外語學習的嵌入式註解有助字彙學習（引的正是 Yanagisawa 等 2020）與理解（引 Taylor 2006）。
- 「studies of texts augmented with hyperlinks have sometimes shown that these augmentations lead to worse comprehension of the texts, rather than better comprehension [21]」（L340–343，引 DeStefano 與 LeFevre 2007）。
- 可點的詞越顯眼，讀者越會去點（「click-happy behavior」，L338–340）。
- 作者的結論：「great care must be taken during design to make sure not to introduce features that will ultimately distract readers from the cognitively demanding task of reading」（L344–347）。

## 作者自己列的限制

1. 只用一篇論文、只測三道題；論文的清晰度差異很大（7.2 節，L1790–1799「A major limitation of the usability study is its focus on a single paper, where performance was measured for only three tasks.」）。
2. 自由閱讀只有 15–20 分鐘，受試者可能還沒碰到會讓他們日後不用的問題；需要長期研究（L1800–1807）。
3. 遠端施測，螢幕大小、電腦速度（有人的閱讀器會卡）、環境干擾都沒控制（L1468–1473）。作者接著把這點說成更貼近真實（L1474–1476）。
4. 定義是人工抽的；自動抽取的錯誤對可用性的影響留待後續研究（L1280–1281）。
5. 工具暗示了不完整的資訊時會誤導讀者（L1552–1553），寫在結果段，不在限制一節。
6. 現行定義偵測演算法的召回率不足（7.3 節，L1824–1825）。
7. 系統只處理有公開 TeX 原始檔的論文，作者稱這是權宜之計（L986–997）。

## 與摘要說法不一致的地方

1. **摘要「A usability study showed that the tool helps researchers of all experience levels read papers」（L38–39）**：
   - 全文沒有任何依資歷或經驗分組的分析。受試者組成有報告（18 位博士生、5 位碩士生、3 位大學部學生、1 位專業研究人員），但結果沒有按這些類別拆開，「all experience levels」沒有對應的資料。
   - 「helps … read papers」對應的量化結果是：在一篇論文上回答三道查找題，花的時間較少、看過的版面較少、自評較容易。答對率沒有提高（16／27 對 16／27）。沒有量理解或記憶。
2. **7.1 節把「Do the features of ScholarPhi aid readers' ability to understand the use of nonce words…?」答成「Yes」（L1763–1767）**，依據是答得較快、看得較少；同一節沒有提答對率沒有差、Symbols 題幾乎全錯。
3. **結論「These strong empirical results」（L1868）**：樣本是 27 人、一篇論文、每人每種介面一題。
4. 前言 L220–222「were more confident about their answers with ScholarPhi」：對一般閱讀器成立（p = .020），對 declutter 版不成立（p = .094）。
5. 6.2 節說三種介面的答對人數「No statistically significant differences」（L1535–1536），附錄 A.1.2 卻把 Correct 列在介面整體效果顯著的指標裡（p = .047，L2188）。兩者不矛盾（整體檢定顯著、兩兩比較校正後都不顯著），但正文沒有交代。
6. 7.1 節「Almost all participants opened a list of definitions, defining formulae, or usages at least once」（L1773–1774），數字是 27 人中 20 人（74%）。
7. 摘要「researchers were eager to have ScholarPhi's definitions available to support their everyday reading」：對應的是預期使用頻率的自陳（#24–29），相符，但是用了約一小時後的自陳，不是實際長期使用。

## 與清單「要撐的結論」不合的地方

清單寫：「把定義帶到讀者眼前省下翻找的時間」。

1. **「省下時間」撐得住，但只限查找題**：全功能版比一般 PDF 閱讀器每題平均快 45.4 秒（上限 240 秒），p = .0001；27 位讀過機器學習論文的人、一篇論文、三道題。
2. **省下的時間不能全算在「把定義帶到眼前」頭上**：全功能版同時有定義提示、清單、declutter、公式圖解、文前詞彙表，實驗沒有「只有提示」的條件。能拆的只有 declutter：單獨的 declutter 對一般閱讀器在時間上不顯著（−16.8 秒，p = .218），全功能版比 declutter 版再快 27.6 秒（p = .015），所以多出來的那些功能合起來有用，但不知道是哪一個。
3. **必須一起寫的反面結果**：答對率沒有提高；而且在問「T 在這篇論文裡有哪些意思」那題，用全功能版的人幾乎都答錯，因為他們以為工具列出的定義是完整的。寫「省時間」而不寫這一點，會把這篇說得比原文好。
4. **這篇沒有量「讀懂」**：清單「找不到可精讀來源」那一節說它量的是「研究者找資訊的時間」，讀完全文確認是對的。
5. **定義是人工整理的**。同一篇論文上自動抽取的精確率只有 24%、召回率 6%。這對寫文章的人的含意是：這個好處的前提是有人把定義逐條整理好。
6. 清單沒提、但對「定義放哪裡」可能用得上的三點，都只是使用紀錄或質性觀察，不是比較實驗：
   - 文前詞彙表是用得最少的功能（27 人中 6 人看了 10 秒以上）；點了才出現的提示用得最多（符號中位數 10 次）。
   - 前導研究裡，把太多內容塞進提示會遮住文字、讓人分心（M5、M6）；讀者正在讀定義句時不想再看到同一個定義（M1）。
   - 形成性研究的 9 位讀者碰到不懂的詞，多半先猜、再拖，盡量不離開正文去查。
7. 這篇的對象是「只在這一篇論文裡定義的詞與符號」（作者稱 nonce words，L102–111），讀者是研究者。它沒有處理領域通用的術語，也沒有處理初學者。作者在未來工作裡說受試者一再要求能查論文之外定義的術語（L1820–1822），這個需求系統沒有滿足。

## 讀取紀錄

- 原文檔 `head2021-scholarphi.txt` 依序讀：L1–600、L600–1219、L1219–1738、L1738–2235，首尾相接，涵蓋全文 2,235 行。其中 L1885–2178 是參考文獻（掃過），L2180–2234 是附錄 A.1（全讀）。
- 原文檔是雙欄 PDF 轉的，欄與圖說有交錯：首頁作者群（L1–83）、3.1 節（L439–492，右欄內容插在左欄之前）、4.1–4.3 節（L728–900）、Figure 6–8 的座標軸數字（L1312–1462、L1492–1532）、附錄 A.1.1–A.1.2（L2182–2234，A.1.2 的後半排在 A.1.3、A.1.4 之後）。交錯處都讀過兩欄並靠上下文接回，沒有發現缺段。
- 對過 PDF 頁面的：首頁作者（PDF 中繼資料與 Crossref）、Table 1（第 6 頁）、Figure 6 與 Figure 7（第 12 頁）、Figure 8（第 13 頁）、Table 2（第 14 頁）。另外直接讀了 PDF 第 10–14 頁的正文，與文字檔一致。
- 附錄 A.1.1 在文字檔裡只有短短一段（L2182–2185），另用 `pdftotext -layout` 重轉 PDF 第 18 頁核對，這一節原本就只有這幾句，沒有被截斷。
- 沒讀到的：ACM Digital Library 的刊出版；專案網站上的影片與示範。
