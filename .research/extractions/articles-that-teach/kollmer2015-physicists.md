# 抽取紀錄：Kollmer、Pöschel、Gallas 2015，Are physicists afraid of mathematics?

- **合法公開來源**：https://iopscience.iop.org/article/10.1088/1367-2630/17/1/013036 （IOP 出版者頁，刊出版，頁面標示 OPEN ACCESS、CC BY 3.0，2026-10-14 核對）。出版者的 PDF 端點被機器人驗證擋下，沒有拿到 PDF；改把出版者頁的全文文字存成 `.research/raw/learning-content/q2-interactive/kollmer2015-iop-oa-page-2026-10-14.txt` 與手上的 `kollmer2015.txt` 比對：五詞片段有 86% 重合（差在公式與圖說的排法），全文的小數只有一個「0.5」沒對上（公式裡的排版）。手上的 `kollmer2015.pdf` 是經 Wayback 取得的作者機構副本（檔名 `kolmer_etal_NJP2015.pdf`），內容是 IOP 刊出版面，文章開放授權。

- **書目**：Jonathan E. Kollmer、Thorsten Pöschel、Jason A. C. Gallas。Are physicists afraid of mathematics? New Journal of Physics 17 (2015) 013036。DOI 10.1088/1367-2630/17/1/013036。2014-10-06 收稿、2014-12-12 接受、2015-01-20 刊出。作者與書目對過 PDF 首頁。
  - 單位（首頁）：Institute for Multiscale Simulations, Friedrich-Alexander-Universität Erlangen；Max-Planck Institute for the Physics of Complex Systems, Dresden；Departamento de Física, Universidade Federal da Paraíba；Instituto de Altos Estudos da Paraíba。
- **版本**：刊出版（開放取用，CC BY 3.0）。
- **原文檔**：`.research/raw/learning-content/q2-interactive/kollmer2015.txt`（383 行、30,355 字元；單欄，段落順序正常，只有首頁的摘要與版權宣告兩欄交錯在 L44–60）；PDF 同名 `.pdf`，7 頁。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 4 #7（與 #6 Fawcett 2012、#8 的 2016 評論與回覆是同一場爭論，見 `fawcett2012-equations.md`、`higginson2016-kollmer2016-exchange.md`）
- 行號是 `.txt` 的行號。

## 研究設計

- **類型**：書目計量的觀察研究，兩部分：(1) 用 Fawcett 與 Higginson 2012 公開的補充資料重畫生物學的引用分布；(2) 對物理期刊做同樣的畫法。
- **全文沒有表，也沒有任何統計檢定、迴歸或 p 值**。所有結論都來自四張圖上「各組平均 ± 標準差」的長條與作者的目視判讀。誤差線是**標準差**，不是標準誤（Figure 2 圖說，L196–197：「The error bar gives the standard deviation around the average citation count of each bin.」）。全文也沒有任何公式（作者在結尾當玩笑說是故意的，L339–341）。
- **(1) 生物資料**：Fawcett 與 Higginson 的 649 篇（1998 年三本生態演化期刊）。重畫四種：原始散點；照原論文的四個密度組（無、< 0.5、< 1、> 1 個／頁）乘三個文長組；換一種文長分組；不分文長。分別對「非理論引用」與「全部引用」各畫一次（Figure 1，L127–143）。
  - Figure 1 圖例上的篇數（PDF 第 3 頁）：原分組 < 7 頁 235 篇、7–9 頁 212 篇、> 9 頁 202 篇；另一種分組 < 6 頁 117 篇、6–10 頁 374 篇、> 10 頁 158 篇（各自加總都是 649）。
- **(2) 物理資料**（L181–219）：Physical Review Letters 第 94 卷（2005）與第 104 卷（2010）各自的**前 1,000 篇**一般論文（評論、回覆、勘誤排除）。PRL 每卷涵蓋半年，每篇上限約四頁，沒有附錄。
  - 公式怎麼數：解析美國物理學會提供的 XML 原始檔，數「dformula」元素，也就是獨立成行的公式（L210–211）。另外對第 104 卷數全文的等號「=」個數，含行內（L261–265）。
  - 引用數：用 DOI 向 Thomson Reuters 的 Links AMR 介面查「timesCited」，**含自我引用**（L214–216）。查詢日期原文沒寫。
  - 「每頁公式數」怎麼算（公式數除以什麼頁數）原文沒有寫明。
  - 沒有控制任何變項（子領域、作者數、文長都沒有進模型，因為沒有模型）。
- **比較方式**：把論文依公式密度分組，每組算平均被引次數與標準差，用三種組距各畫一次（Figure 2）；再用前 500、前 750、前 1,000 篇各畫一次看樣本大小的影響（Figure 4）。

## 結果（逐項）

因為沒有表，下面的數字除了內文明寫的以外，都是我從 PDF 第 3–6 頁的圖上目測的長條高度，只能當大略；每一項都標了來源。

### 生物資料重畫（2.1 節，Figure 1）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文 |
|---|---|---|---|---|---|
| 1 | 不分文長、只看**非理論引用** | 目測：無公式約 37、< 0.5 約 26、< 1 約 33、> 1 約 21 | 四個密度組的平均被引次數 | Fig. 1(d)；L141 | 「Panel (d) shows the same negative trend of the slope, which is important for reaching the conclusions of [1].」 |
| 2 | 不分文長、看**全部引用** | 目測：無公式約 55、< 0.5 約 44、< 1 約 58、> 1 約 43 | 同上 | Fig. 1(h)；L142–143 | 「However, after including citations from all sources, panel (h) presents no evident trend in the slope. This fact contradicts the statement that a higher equation density would decrease the citation success of a paper.」 |
| 3 | 作者由 1、2 得出的說法 | — | — | L144、L159–160 | 「these panels seem to show unambiguously that the definition of 'non-theoretical papers' has a strong impact on the distribution of citations, changing it from an almost constant distribution into a distribution with a negative trend.」 |
| 4 | 換一種文長分組 | 沒有給數字 | 原分組 vs 另一種分組 | Fig. 1(c)(g) 圖說 L155–156 | 「Notice that this considerably affects the slopes.」 |
| 5 | 被引最多的兩篇公式密度都高 | Clark 1998（Am. Nat.）：1.9 個／頁、被引 300 次，其中 118 次來自「非理論」；Orr 1998（Evolution）：2.7 個／頁、被引 291 次，其中 182 次來自「非理論」 | 個案 | L167–172 | 「by far the two most cited papers that they analyzed have very high equation densities and high citation counts coming from non-theoretical papers. … We believe these to be important pieces of information which obviously contradict the main thesis of [1].」 |
| 6 | 對原分組的批評 | 密度範圍 0–7 個／頁，四組切在 0、0.5、1 | — | L173–179 | 「we find the original four bins used in [1] … to be rather odd and arbitrary. … the type of binning selected strongly influences the final outcome of the analysis」 |
| 7 | 原始資料很吵 | 沒有數字 | — | L178–179 | 「a cursory look at the raw data in panels (a) and (e) reveals that the signal is incredibly noisy, a fact sufficient to raise questions about any general statement one could possibly make.」 |
| 8 | 作者的小結 | — | — | L161–162 | 「Our re-analysis of the biological data shows no evidence that future citations can be directly manipulated by inserting or removing equations in the main part of the papers.」 |

### 物理資料（2.2 節，Figure 2）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文 |
|---|---|---|---|---|---|
| 9 | 照 Fawcett 的四組分，第 94 卷（2005） | 目測平均：0 個約 55、< 0.5 約 46、< 1 約 45、> 1 約 38；標準差的誤差線長度與平均值同量級 | 四個密度組的平均被引次數 | Fig. 2(a) | 見第 11 項 |
| 10 | 同上，第 104 卷（2010） | 目測平均：0 個約 20、< 0.5 約 16、< 1 約 15、> 1 約 15 | 同上 | Fig. 2(d) | 見第 11 項 |
| 11 | **作者對 9、10 的判讀：平均值隨密度下降，但判定不顯著** | 沒有檢定 | — | L245–248 | 「plotting our data with their choice of binning also shows a decrease with equation density, despite differences in mathematical training of the groups of authors. However, such decrease is not significant because it is well within the large error bars.」 |
| 12 | 組距切細之後 | 沒有數字 | 八組（0、< 1 … > 6）與更細 | Fig. 2(b)(c)(e)(f)；L248–250 | 「When plotting with finer binning the differences seem to vanish and the data essentially shows a plateau with huge standard deviations, being sometimes dominated by a single high-impact paper」 |
| 13 | 兩卷的比較 | — | 第 94 卷 vs 第 104 卷 | L227–230、L250–251 | 「citations from both volumes display qualitatively similar behavior, despite the fact that volume 94 had five more years to collect citations than volume 104.」 |
| 14 | **作者的結論** | — | — | L251–252 | 「We conclude that our data do not display significant effects caused by equation density.」 |
| 15 | 單一高被引論文 | Kovtun、Son、Starinets 2005（PRL 94, 111601）：三位作者、16 個編號公式、兩張圖、被引超過 800 次，是 Fig. 2(b)(c) 那個高峰 | 個案 | L289–291 | 「corresponding to the large peak in figure 2(b), (c), contains three authors, 16 numbered equations, two figures, and has so far receive more than 800 citations.」 |
| 16 | 樣本大小 | 前 500、750、1,000 篇的圖形相近 | 三種樣本大小 | Fig. 4；L298–303 | 「From figure 4 one may easily recognize that there is no significant dependence on the sample size.」 |

### 其他指標（2.3 節，Figure 3）

| # | 結果 | 位置 | 原文 |
|---|---|---|---|
| 17 | 許多物理論文沒有任何獨立成行的公式 | L254 | 「surprisingly, a large number of papers in physics contain no displayed equations.」（沒有給比例） |
| 18 | 改數等號（含行內），第 104 卷：看不出趨勢 | Fig. 3(a)；L261–265 | 「This figure does not reveal any clear trend, similarly to what happens when counting only displayed equations」 |
| 19 | 參考文獻愈多、被引愈多（第 104 卷） | Fig. 3(b)；L266–269 | 「A factor apparently affecting citation success seems to be the number of references that a paper contains」 |
| 20 | 作者數愈多、被引略多（第 104 卷，只看少於 50 位作者的） | Fig. 3(c)；L284–285 | 「the number of authors in a paper seems to display some (mild) trend」 |
| 21 | 圖的數量：第 94 卷在每頁約一張圖處有相對高點，第 104 卷是平的 | Fig. 3(d)；L292–297 | 「ignoring the large error bars one could possibly argue that data for volume 94 display relative maxima for papers which contain an average of one figure per page. Thus, the number of figures in the paper seems to have an overall higher impact than the number of equations that it contains.」 |

第 19–21 項同樣沒有檢定，誤差線同樣很長；作者自己在 Fig. 3 圖說裡寫「Note the large uncertainty of the data in all panels」（L241–242）。

### 討論的結論句

| # | 位置 | 原文 |
|---|---|---|
| 22 | L309–311 | 「We find that conclusions drawn by Fawcett and Higginson [1] from the analysis of papers published by biologists are strongly dependent on their artificial subdivision of papers into theoretical and non-theoretical work. They also disregarded relevant data contradicting their thesis.」 |
| 23 | L311–313 | 「The idea that a lack of training in reading/doing mathematics is responsible for the lack of citations seems not to be true since data reflecting habits of a broad community of physicists displays similar trends as those found in publications by biologists.」 |
| 24 | L314–321 | 「we emphasize that in all cases the citation data is so noisy that its not reliable for identifying unambiguous trends capable of predicting citation success.」 |
| 25 | L322 | 「To get cited, it seems that it does not really matter how much math one uses.」 |

## 作者自己列的限制

原文沒有 Limitations 節。作者自己承認的只有：

1. 引用資料很吵、常被單一高被引論文左右（L249–250、L287–288）。這同時是作者的主要論點。
2. 1,000 篇分成 20–30 組時每組篇數少，標準差估得不穩；作者用不同樣本大小重畫來回應（L298–303）。
3. 生物資料只能重畫公開的那些欄位：「Additional re-analysis involving other quantifiers was not possible from the data provided in the supplementary material」（L162–163）。
4. 自我引用沒有扣掉，理由是 Fawcett 與 Higginson 說扣不扣差不多（L215–216）。

原文沒有說、但方法上明擺著的（我的觀察）：
- 用「標準差的誤差線重疊」當成「不顯著」的依據。標準差描述的是個別論文的離散程度，不是平均數的不確定性；每組有幾十到幾百篇時，平均數的標準誤遠小於標準差。原文沒有做任何檢定，所以「not significant」不是統計檢定的結果。
- 沒有控制文長、期刊、作者數等變項；Fawcett 與 Higginson 的主張是控制頁數與期刊後的迴歸係數，兩邊算的不是同一個量。
- 只有一本期刊、兩卷各前 1,000 篇，PRL 有四頁上限、沒有附錄，所以無從檢驗「公式放附錄」那一半。
- 「每頁公式數」的分母沒有交代。

## 與摘要說法不一致的地方

1. **摘要沒有說物理資料「沒有趨勢」，說的是「與生物資料驚人地相似」**：「we find striking similarities with distribution of citations recorded in biological sciences. However, based on the standard deviations in citation data of both communities … we argue that trends in statistical indicators are not reliable to unambiguously blame mathematics for the existence or lack of citations.」（L57–59）內文 L245–246 也明寫照同樣分組「also shows a decrease with equation density」。也就是物理資料的平均值**同方向下降**，作者的主張是這個下降不可靠。
2. 內文結論句「our data do not display significant effects」（L251–252）與「it does not really matter how much math one uses」（L322）比摘要的「not reliable to unambiguously blame」強；前者沒有檢定支撐。
3. 內文轉述 Gibbons 時寫成「instead of diminishing, citations actually increase with the equation density」（L92–93）。Gibbons 來函的原話是「for some journals, citations actually increase with equation density」，指的是 *The American Naturalist*（見 `fawcett2012-equations.md`）。這是轉述過頭。
4. 內文說 Fawcett 與 Higginson 的結論「strongly dependent on their artificial subdivision of papers into theoretical and non-theoretical work」（L309–310）。原論文 Table 1 的「全部引用」那一欄（不分理論與否）公式密度的係數也是顯著負向（0.78，P = 0.005；正文密度 0.72，P = 0.008）。Kollmer 等人看的是不控制頁數的四組平均（Fig. 1(h)），原論文是控制頁數與期刊的迴歸，兩者不是同一個分析；本文沒有重跑那個迴歸。

## 與清單「要撐的結論」不合的地方

清單的句子：「**結果相反**：物理資料看不出明確趨勢，引用數太吵」。

「結果相反」撐不住，後半句要改寫：

1. **不是相反的結果**。物理資料照同樣的分法，各組平均被引次數隨公式密度**下降**（第 94 卷目測約 55 → 38，第 104 卷約 20 → 15），作者自己寫「also shows a decrease」「striking similarities」。這篇的主張是「下降落在很長的標準差誤差線裡，所以不能據此怪罪數學」。
2. **「看不出明確趨勢」是目視標準差長條得出的判斷，全文沒有任何檢定**。照實的寫法是「作者認為這個下降不可靠，但沒有做統計檢定」。
3. 這篇對生物資料的批評有三點是具體的、可以引的：改變分組會改變圖形（第 4、6 項）；不分文長、看全部引用時四組平均沒有單調下降（第 2 項）；被引最多的兩篇公式密度都高（第 5 項）。但第 2 項是不控制頁數的粗平均，不能拿來否定原論文控制頁數後的係數。
4. 這篇另有一個推論可以引但要標是推論：物理學家數學訓練好卻出現類似圖形，所以「缺乏數學訓練」不像是原因（第 23 項）。

這篇的結論隨後被原作者用同一批物理資料重新分析反駁，物理學家也回了一篇；引用這篇一定要連同那兩篇一起看（`higginson2016-kollmer2016-exchange.md`）。

## 讀取紀錄

| 順序 | 位置 | 內容 |
|---|---|---|
| 1 | `.txt` L1–383（一次讀完，依序） | 首頁、摘要（L44–60，與版權宣告交錯，摘要句子本身完整）、1 Introduction（L62–119）、2.1 生物資料重分析（L121–179，含 Figure 1 圖說）、2.2 物理資料（L180–252，含 Figure 2、3 圖說）、2.3 其他指標（L253–303，含 Figure 4 圖說）、3 Discussion（L305–341）、致謝（L343–349）、參考文獻 28 筆（L351–380，掃過） |
| 2 | PDF 第 3–6 頁（Read 讀頁面影像） | Figure 1（八格）、Figure 2（六格）、Figure 3（四格）、Figure 4（十八格）；圖例上的篇數與長條高度由此目測 |

原文沒有表、沒有附錄、沒有補充資料。PDF 第 1–2 頁與第 7 頁只有文字，以 `.txt` 為準，沒有另外看頁面影像。
