# 抽取紀錄：Head、Xie、Hearst 2022，Math Augmentation: How Authors Enhance the Readability of Formulas using Novel Visual Design Practices（CHI '22）

- **完整書目**：Andrew Head（Allen Institute for AI）、Amber Xie（UC Berkeley）、Marti A. Hearst（UC Berkeley）。Math Augmentation: How Authors Enhance the Readability of Formulas using Novel Visual Design Practices。CHI Conference on Human Factors in Computing Systems（CHI '22），2022 年 4 月 29 日–5 月 5 日，New Orleans。ACM，18 頁。DOI 10.1145/3491102.3501932。作者姓名、單位、DOI 對過首頁與 ACM Reference Format（L1–19、L57–71）。
- **原文檔**：`.research/raw/learning-content/q2-interactive/head2022-math-aug.pdf`（18 頁）與同名 `.txt`（4,319 行、118,700 字元）。這份 `.txt` 是不帶 `-layout` 轉的（我重轉一次，行數與字元數完全相同），下面的行號（L）就是這個檔的行號。
- **版本**：刊出版（ACM 版面，CC BY-NC-SA 4.0 開放取用，L57–62）。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 4（記號、行話與術語）#5

## 研究設計

兩個質性研究，**都沒有讀者、沒有量任何閱讀或學習成果**。

### 研究一：內容分析（第 3 節）

- **研究問題**（L292–296）：加工有哪幾種；每種有哪些變化；同一條公式會不會用到多種；加工是加在識別字這類簡單運算式上，還是也加在較複雜的運算式上。
- **樣本怎麼來的**（L306–321）：起點是 Hohman 等的「Awesome mathematical notation design」清單（Communicating with Interactive Articles 一文的附帶材料），清單上的文件本來就是因為「exhibited interesting notation design」才被列入；再滾雪球（從每份文件找它提到的其他加工文件，直到沒有新的），剔掉只是回顧別人做法的文件；最後**另外補 10 份近期機器學習論文的研究簡報**。
- **最後樣本**：47 份文件——網頁文章 15、研究簡報 10、教科書章節 6、推特對話 3、研究論文 3、Distill 文章 2、影片 2、課堂簡報 1、課堂講義 1、其他 4（L318–321；附錄 Table 2、3 逐份列出，我數過是 47）。
- **分析單位**（L327–340）：一條「被加工過的公式」，只算獨立成行的 display formula，手繪的不算。兩位作者各自抽公式，一致度 80.4%（Holsti 的指標），討論後得 279 條，分析中增減後定為 281 條。
- **編碼**（L341–383）：兩位編碼者（第一作者與另一位，致謝裡是 Grace Chang）對每條公式編 43 個向度（16 個是「有沒有這一種加工」）。每人約 50 小時、約 8 千個判斷。第一輪的 Krippendorff α：各向度中位數 .69，變異很大（σ = .32，最大 1，最小 −0.026）；作者說這顯示幾個向度有系統性歧見，之後靠「extensive discussions」解決。
- **計數規則**（L492–494、L404–409）：一種加工用在一個運算式上算 1 個 maug；**空白（spacing）不計入個數**，因為單位怎麼算有歧義。

### 研究二：訪談（第 4 節）

- **受訪者**（L1889–1897）：第一作者從研究一的文件裡挑出加工「particularly elaborate or intriguing」的，邀請 20 位作者，12 位參加（代號 A1–A12）。全部有學士學位，6 位有博士。職業是研究科學家、軟體開發者、設計師、工程主管等；「only two were formally employed as educators」。
- **程序**（L1898–1914）：Zoom 遠距，每次 30 分鐘，第一作者主持；打開受訪者自己的文件、指著其中一條加工過的公式，問為什麼這樣呈現、怎麼做的、哪裡卡、如果不必自己動手還想怎麼加工。5 位做了 15–45 分鐘的追加訪談。全部錄音。
- **分析**（L1915–1923）：逐字稿做主題分析；第一作者先從筆記定主題再回逐字稿擴充，第三作者複核摘錄。括號裡的數字是支持該主題的受訪者人數（L1939–1942）。

## 結果（逐項）

Table 1（文件 × 16 種加工的點陣圖）與第 5–12 頁的正文，我對過 PDF 頁面影像；Table 1 只有色塊沒有數字，百分比都出自正文。

### 研究一：數量與分布

| # | 結果 | 數字 | 分母／對照 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 加工總數 | 281 條公式共 1,182 個 maug；平均 4.2、中位數 3、σ = 5.2、最多 40 | 每條公式（不含空白） | 3.3.1 | L495–497 | 「Across all 281 formulas, 1,182 maugs were counted. Thus, formulas had an average of 4.2 maugs. The median number of maugs per formula was 3 maugs.」 |
| 2 | 用到幾種加工 | 約一半公式只用一種；47.7% 用兩種以上 | 281 條公式 | 3.3.1 | L498–501 | 「Approximately half of formulas featured only one kind of maug. The remaining half (47.7%) were augmented with two or more maugs.」（原句寫 maugs，依上下文與 R1 是「kinds」） |
| 3 | 最常見的搭配 | 標籤＋空白、標籤＋範圍標記 | — | 3.3.1 | L500–501 | 「The most frequent pairs of kinds of maugs were labels with spacing, and labels with extent markers.」 |
| 4 | 加工加在什麼上 | 識別字 31.4%、數字 6.3%、運算子 3.3%、整條公式 9.1%、其他運算式 49.9%（合計 100.0%） | 1,182 個 maug | 3.3.2 | L548–553 | 「A minority of maugs applied to identifiers (31.4%). … Nearly half of augmentations applied to other expressions (49.9%). This category included function calls, operations involving an operator and multiple operands, named constants, and embedded visualizations.」 |
| 5 | 不是每個符號都加工 | 至少有一個識別字被加工的公式裡，68.1% 另有識別字完全沒被加工 | 有識別字被加工的公式 | 3.3.2 | L554–557 | 「in 68.1% of the formulas where at least one identifier was augmented, at least one other identifier was not augmented at all.」 |
| 6 | 分類 | 16 種加工、4 大類：視覺記號、樣式、註記、互動 | — | 3.3.3 | L561–562、L675–685 | 「Formulas were augmented with 16 kinds of maugs, which are grouped into 4 high-level categories.」 |

### 研究一：各種加工出現在多少文件（分母都是 47 份文件，除非另註）

| # | 加工 | 數字 | 行號 | 原文一句或補充 |
|---|---|---|---|---|
| 7 | 字色 | 41.6% 的公式、70.2% 的文件 | L705–706 | 「Font color was altered in nearly half of formulas (41.6%), and in at least one formula in most documents (70.2%).」作者稱它是最普遍的一種 |
| 8 | 用顏色做「視覺連結」 | 70.2% 的文件至少用過一次；連到其他公式裡相似的運算式 40.4%、相同的運算式 29.8%、正文 36.2%、圖裡的圖形 34.0%、圖裡的標籤 23.4%、程式碼 6.4% | L713–717 | 「most (70.2%) documents used color at least once to establish visual links.」 |
| 9 | 字的明暗／透明度 | 8.5% | L718–721 | 讓某些運算式比周圍顯眼 |
| 10 | 空白 | 29.8% | L1351–1370（對 PDF 第 7 頁） | 三種用途：把符號分組成有意義的單位、對齊相鄰公式裡相關的運算式、排成格狀呈現整體。也有**非刻意**的空白，例如 LaTeX `\underbrace` 為了放標籤自動撐開（L1442–1470） |
| 11 | 幾何物件當運算式 | 6.4% | L693–698 | 用在視覺證明，或當作沒有其他意義的變數記號 |
| 12 | 資料視覺化當運算式 | 8.5% | L699–703 | 當作計算的範例輸入 |
| 13 | 背景色 | 12.8% | L1496–1499、L1377–1392 | 把注意力引到重要的運算式或整條公式 |
| 14 | 外框 | 23.4% | L1401–1436 | 多半框整條公式；少數是 HTML 輸入框的副作用 |
| 15 | 範圍標記（線或大括號） | 29.8%；出現時 90.0% 的公式同時有標籤 | L1438–1464 | 「Extent markers often appeared together with labels (i.e., in 90.0% of formulas in which they appeared)」 |
| 16 | 刪除線 | 6.4% | L1467–1471 | 表示該項已消去 |
| 17 | 指向箭頭 | 2.1%（只有一條公式） | L1480–1489 | 「Pointer arrows were rare, appearing in only one formula」 |
| 18 | 連接箭頭 | 17.0% | L1493–1498、L1595–1611 | 把公式連到它的來源公式、文字說明、圖裡的圖形 |
| 19 | 標籤 | 48.9% 的文件；281 條公式裡超過 300 個；有標籤的公式平均 3.3 個文字標籤（σ = 2.9，最多 13）；每份文件平均 6.3 個 | L1626–1635 | 「Labels were very common: over 300 labels were counted across all 281 formulas. Labels appeared in 48.9% of documents.」 |
| 20 | 標籤的內容 | 294 個含文字；文字標籤 75.9% 只有一個片語、6.8% 是完整句子；48 個（在 14 份文件）含數學記號；36 個（在 4 份文件）含圖示 | L1640–1738（與圖內文字交錯，對過 PDF 第 8 頁） | 「Text was typically short: 75.9% of text labels contained only one phrase, while 6.8% contained complete sentences」 |
| 21 | 標籤怎麼連到運算式 | 靠近、範圍標記、引線三種；有標籤的公式裡 30.0% 用範圍標記、45.6% 用引線、8.9% 兩者都用 | L1749–1768（對過 PDF 第 8 頁） | 「Of the formulas that had labels, 30.0% used extent markers, 45.6% used leader lines, and 8.9% used both.」 |
| 22 | 「偽標籤」 | 「A handful of documents」，列了 6 份（B2、B5、O1、W4、W5、W7） | L1819–1830、L1597–1606（對過 PDF 第 8 頁） | 公式上色，讓各段對應到旁邊一句說明裡同色的片語。作者說它「wide usage」 |
| 23 | 互動 | 可拖曳數值 2.1%（1 份）、可編輯輸入框 2.1%、連動選取 4.3%、外部控制項 8.5% | L1609–1810（對過 PDF 第 8 頁） | 「Because interactivity requires a document to be published in a dynamic medium, only a handful of documents exhibited interactivity」 |

### 研究二：作者為什麼做、怎麼做、多費工

括號裡的數字是幾位受訪者（共 12 位）。這一節第 9–12 頁的文字在 `.txt` 裡與圖內文字交錯，全部對過 PDF 頁面影像。

| # | 結果 | 數字 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 24 | 動機：怕讀者被記號嚇跑 | 5 位 | 4.2.1 | L1943–1947 | 「Authors feared that without scaffolding, readers would be too intimidated to attempt to understand notation.」形容詞：scary、dense、not that friendly、boring、big、hard to read |
| 25 | 讀者是自認不擅長數學的人 | 3 位 | 4.2.1 | L1947–1949 | 「authors were often writing for audiences who might self-identify as non-mathematical, such as social scientists or qualitative geoscientists (3)」 |
| 26 | 用途：把又大又密的公式拆開，讓人看出其實只有幾塊 | 「breaking up」3 位、「pieces」3 位 | 4.2.1 | L1950–1962、L2265–2277 | A1：「there's really just two [things], and zoom in on those two things」 |
| 27 | 用途：和文件裡同一個概念的其他表示法對起來 | 幫讀者在正文找到定義 2 位；對照說明圖 4 位 | 4.2.1 | L2591–2626（對過 PDF 第 10 頁） | 「For many authors, color served as a tool for relating formulas to alternative representations of the same mathematical idea elsewhere in the document.」 |
| 28 | 流程三步 | 先寫公式（幾乎都用 LaTeX）→ 加工 → 嵌進文件 | 4.2.2 | L2668–2695、L1998–2262（對過 PDF 第 10 頁） | 「Nearly all authors created formulas using the LaTeX language, although nearly all used different environments to write LaTeX.」 |
| 29 | 用什麼加工 | LaTeX 巨集：上色 6 位、標籤 2 位、空白與對齊 1 位。**8 位用直接操作的繪圖軟體**（Google Slides、PowerPoint、Mathcha、Illustrator、Inkscape）：上色 3、標籤 3、空白 2、畫幾何物件 2。有人兩種都用 | 4.2.2 | 同上 | 「Eight authors reported using direct manipulation drawing programs such as Google Slides, Microsoft PowerPoint, Mathcha, Adobe Illustrator, and Inkscape.」 |
| 30 | 互動要自己寫程式 | 2 位 | 4.2.2 | 同上 | 「Two authors implemented interactivity, writing code for custom solutions.」 |
| 31 | 設計靠感覺與判斷 | 3 位 | 4.2.3 | L2611–2701 | A4：「I would just characterize the entire thing as being extremely manual and extremely driven by sense.」 |
| 32 | **費工的數字（都是單一受訪者的自述）** | 一位平均一條公式一小時；另一位花 20 分鐘讓 LaTeX 的標籤長成他要的樣子 | 4.2.4 | L2738–2740 | 「One author reported, for instance, spending an average of one hour per formula; another described spending 20 minutes in LaTeX to get labels to appear just the way he wanted.」 |
| 33 | 靜態媒介的限制 | 想要隨選細節 2 位；想要逐步帶出複雜公式 5 位；「Few of the authors were writing in media where interactivity or animation were possible」 | 4.2.4 | L2744–2795 | 「Authors were often constrained to show readers more information about a formula than they wished readers to see.」 |
| 34 | 推導用文字講很囉嗦 | 1 位（A8）的例子：六步推導裡的兩步 | 4.2.4、Fig. 10 | L2728–2737、L2757–2776 | A8：「that's a *lot* of English to describe what's going on, and it's getting all technical jargon-y」 |
| 35 | 標記語言難用 | LaTeX 難用 2 位。Figure 12：一條只有 8 個識別字、5 個運算子、4 種顏色的公式，LaTeX 原始碼 414 個 ASCII 字元 | 4.2.4、Fig. 12 | L2796–2798、L2869–2913（對過 PDF 第 12 頁） | 「While the formula is comprised of only 8 identifiers, 5 operators, and 4 colors, it was authored using 414 ASCII characters in LaTeX.」 |
| 36 | manim 的學習成本 | 1 位估計新手要 1–2 個月才懂它的概念模型 | 4.2.4 | L3299–3358（對過 PDF 第 12 頁） | 「the author reported it had a steep learning curve, estimating it would take a newcomer 1-2 months of use before understanding its conceptual model.」 |
| 37 | 預設排版難看 | 2 位；A12 稱某個常用套件的結果「horrific」：標籤高度不一、多出來的水平空白 | 4.2.4、Fig. 13 | L3360–3366、L2974–3009、L3457–3460 | A12：「you can barely even tell that "b" is multiplied by "i," because the "i" is six inches off to the right」 |
| 38 | 加工會動到版面 | 1 位（A9）：顏色框弄亂行高 | 4.2.4 | L3016–3070 | 「it messes up with like the line heights and stuff」 |
| 39 | 繪圖軟體很瑣碎、容易出錯 | 4 位 | 4.2.4 | L3079–3192 | A4：「it would be super easy for me to leave the incorrect label somewhere … or copy-and-pasted the label from another page … and then just forget to edit it after I've pasted it」 |
| 40 | 加工的量要拿捏 | 怕顏色太多 3 位；A3 的「預算」說法：顏色用在一件事上就不能再用在別的事上 | 4.2.4 | L3471–3484 | A3：「once I've chosen what to use color for, I can't really use it again」；A9：「I used to actually use more color, but … Some of the information wasn't as important as others, so I got rid of a lot of it」 |
| 41 | 標籤的閱讀順序問題 | 1 位（A8）：多個標籤讓讀者不知道從哪裡讀起，所以改用偽標籤（公式與一句話同色） | 4.2.4 | L3367–3376、L3469–3470 | A8：「where [among the labels] do you start reading? Because it's no longer really like a left-to-right thing, like a sentence is.」 |
| 42 | 全篇一致的樣式很難維持 | 同類運算式跨公式用同色 5 位；一位長文件作者說全篇對應「another level of effort too far and would really need like software support」 | 4.2.4 | L3485–3506 | 同左 |
| 43 | 作者的主結論 | 加工「tedious」且設計高度分歧 | 1、7 | L123–128、L3696–3697 | 「The primary conclusion of these studies is that the practice of math augmentation is one that is tedious and yields highly divergent designs.」 |

### 設計建議（第 5 節，R1–R11）

對象是「未來的工具」，不是寫作者。與寫作做法直接相關的只有兩條的依據：

- R10（L3622–3630）：只標 x 這類識別字不夠，人實際加工的近半是較高層的運算式（依據是上面第 4 項）。
- R11（L3631–3640）：「Our informants believed that the effectiveness of augmentations tapered off when notation was augmented without care.」接著作者自己寫「While further studies are needed to characterize the complex tradeoffs between these design decisions」——這是受訪者的信念，不是量到的效果。

### 文獻回顧裡的二手說法（原文只各一句，沒有數字，要用得回原始論文）

L165–187：Österholm 2006「readers performed worse on a comprehension task when reading a math text with symbols, rather than a similar text containing solely prose」；Kohlhase 等 2018 讀者頻繁在公式與正文間切換；Shepherd 與 Sande 2014 學生逐符號讀、專家認得出慣用式；Wege 等 2020 符號對稱性影響對交換律的預期；Landy 與 Goldstone 2007 空白影響運算順序的解讀；Yung 與 Paas 2015「The addition of marks such as colors, borders, and arrows can reduce the cognitive load involved in solving algebra problems」；Jansen 等 1999 合式與否影響閱讀與辨認速度。這些我都沒有讀原文。

## 作者自己列的限制

（6.1，L3644–3660）

- 內容分析能推多遠受文件選取限制；影片、課堂講義等類別的文件很少，「we do not claim that theoretical saturation … was achieved」。
- 清單可能不完整：動畫不在 16 種裡，因為只出現在一份文件，雖然受訪者很想要。
- 「the frequencies of maugs may not be representative of all math documents」。
- 訪談只收到作者的信念：「our interview study does not provide clear guidance how authors should ideally augment formulas for their readers. Follow-up studies would be needed to assess how various augmentations affect the reading experience, including both the benefits and drawbacks of augmentation.」
- 未來工作段（L3676–3684）把這幾題列為未解：該用上色還是標籤來定義運算式；一條幾十個符號的公式最多能標幾個才不會壓垮讀者；要回答得做量學習、認知負荷與記憶的實證研究。

## 與摘要說法不一致的地方

- 題目與摘要說加工是為了「improve its readability」「enhance the readability」。全文沒有任何讀者資料；作者在限制段自己承認。摘要沒有寫這一點。
- 摘要稱「a comprehensive inventory」，限制段說清單「may not be complete」、沒有達到理論飽和。
- 摘要「1.1k augmentations」對應正文 1,182；正文註明空白沒有計入個數，摘要沒提。
- 摘要「47 blogs, textbooks, and other documents」沒有說其中 10 份是另外補進來的機器學習研究簡報，也沒有說起點是一份專收「有趣記號設計」的清單。
- 正文內部的數字用語不一致（都不影響方向）：
  - R1 寫「A majority of documents (68.0%)」用多種加工；這個數字在第 3 節沒有出現過（32/47 = 68.1%，我的換算；3.3.2 的 68.1% 是另一件事）。
  - R8 寫「many labels contained math notation (29.8%), and some contained visuals like icons (8.5%)」；依 3.3.3，29.8% 與 8.5% 是**文件**的比例（14/47、4/47），不是標籤的比例。以標籤計是 48 個與 36 個（總數「over 300」）。
  - R10 寫「nearly half of augmented formulas were expressions that could not be classified…(49.9%)」；49.9% 的分母是 maug 個數，不是公式。
  - 3.3.1 寫「two or more maugs」，R1 與前後文是「more than one kind of maug」。
- 其餘逐項對過（281 條公式、47 份文件、12 位受訪者、16 種、4 類、11 條建議、顏色最普遍、標籤次之），相符。

## 與清單『要撐的結論』不合的地方

清單寫的是「作者實際怎麼加工公式、做起來多費工（實務端）」。當作實務描述撐得住，但有四點要寫清楚：

1. **樣本是挑過的範例，不是一般做法**。文件來自一份專收好看記號設計的清單再滾雪球，受訪者又是從中挑「特別精緻或有意思」的 12 位（邀 20 位）。「七成文件用顏色」這類比例只能說「在這 47 份被挑出來的文件裡」，作者自己說頻率可能不具代表性。
2. **「多費工」的數字是個別受訪者的自述，沒有系統性的計時**：一位說平均一條一小時、一位說調標籤 20 分鐘、一位估 manim 要學 1–2 個月；另有一個可核對的實例（Figure 12：8 個識別字的公式要 414 個字元的 LaTeX）。可以寫「有作者說…」，不能寫成平均成本。
3. **這篇完全沒有證據說加工對讀者有用**。清單的缺口段已經寫「沒有以學習者理解為結果變項的來源」，這篇正是如此；它還提供了反向的作者信念（顏色太多會失效、標籤多了不知從哪讀起、顏色只能派給一件事），同樣沒有驗證。
4. 受訪者只有 2 位是教師，多數是研究者、工程師與設計師；寫作對象常是自認不擅長數學的讀者（3 位提到）。

可以補進文章的實務細節（清單那句話沒涵蓋到）：人實際加工的近半不是單一符號而是整塊運算式（49.9% 對識別字 31.4%）；多數公式只加工一部分符號（68.1%）；文字標籤多半是一個片語（75.9%），完整句子只占 6.8%；8 位受訪者是把 LaTeX 輸出成圖再用簡報或繪圖軟體加工。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | L1–899 | 標題、作者、Figure 1 圖說、摘要、1 前言、2 相關研究（2.1–2.3）、3.1 動機、3.2 方法（文件、單位、分析、worked example）、Figure 2–4 圖說、Table 1 說明、3.3.1、3.3.2、3.3.3 開頭（視覺記號、字色、視覺連結、明暗） |
| 2 | L900–1799 | Figure 5–7 圖說與圖內文字、3.3.3 其餘（空白、背景色、外框、範圍標記、刪除線、指向箭頭、連接箭頭、標籤、偽標籤、互動四種） |
| 3 | L1800–2699 | 4 研究二開頭、Figure 8 圖說、4.1 方法（受訪者、程序、分析、保密）、4.2.1 目標、Figure 9、4.2.2 流程、4.2.3 設計靈感 |
| 4 | L2700–3518 | Figure 10、11 圖說、4.2.4 挑戰（靜態媒介、標記語言、預設排版、繪圖軟體、拿捏份量、跨文件樣式、其他功能需求）、Figure 12、13 圖說 |
| 5 | L3519–4319 | 5 設計建議 R1–R11、6 限制與未來工作、7 結論、致謝；L3713–3874 參考文獻（掃過）；附錄 A.1 與 Table 2、3（47 份文件的代號、類型、標題、網址，逐列讀過並數過） |

- L725–1500、L1501–1850、L1963–2700、L2800–3460 這幾段，`.txt` 把圖裡的文字（Distill 文章、Byrne 版《幾何原本》、GAMUT 論文截圖等）與正文逐行混在一起，句子順序不可靠。我另外用 Read 直接看了 **PDF 第 5–12 頁的頁面影像**，把 3.3（含 Table 1）、3.3.3 全部、4.1、4.2.1–4.2.4 到「Hitting the sweet spot」開頭的正文逐段對過，上表的數字與引句以頁面影像為準。
- PDF 第 1–4 頁與第 13–18 頁沒有看頁面影像，只讀 `.txt`；這幾頁的文字沒有交錯（第 13 頁有 Figure 13 的圖內文字夾在中間，正文句子仍完整可辨）。
- Table 1 是色塊矩陣，沒有數字；我沒有逐格數色塊去重算各欄百分比。
- 補充材料（編碼手冊、281 條公式的完整編碼試算表）沒有抓，沒有讀。
- 原文沒有註腳。
