# 抽取紀錄：Fawcett 與 Higginson 2012，Heavy use of equations impedes communication among biologists

- **書目**：Tim W. Fawcett、Andrew D. Higginson（School of Biological Sciences, University of Bristol）。Heavy use of equations impedes communication among biologists. Proceedings of the National Academy of Sciences of the USA 109(29): 11735–11739，2012-07-17 刊出（線上 2012-06-25）。DOI 10.1073/pnas.1205259109。PMCID PMC3406806。Edited by Robert M. May；2012-04-04 收稿、2012-06-06 核可。
  - 作者、卷期頁碼、日期是對 NCBI efetch 回的 PMC 後設資料（`efetch.fcgi?db=pmc&id=3406806`），不是對 PDF 首頁：PNAS 的 PDF 回 403，PMC 的 PDF 連結回登入頁，拿不到。
- **版本**：刊出版的 PMC 全文（HTML 經 Jina 轉 markdown）。沒有 PDF。
- **原文檔**：
  - `.research/raw/learning-content/q2-interactive/fawcett2012.txt`（158 行、36,248 字元）**有缺**：第 36 行的 Table 1 從「20.189<0.001」的 `<` 到下一段「(>9 pages)」的 `>` 之間整段被當成 HTML 標籤吃掉，少了 Table 1 全部資料列、表註、以及一整段結果（非理論引用 27% 那一段）。
  - `.research/raw/learning-content/q2-interactive/fawcett2012.html`（167 行、38,792 字元）是同一次抓取的原始 markdown，**內容完整**；副檔名是 `.html` 但內容是 markdown。**本紀錄的行號一律是這個檔的行號。**
  - 本次補抓（都存在同一目錄）：
    - `fawcett2012-pmc-rendered.html`：PMC 頁面的 HTML（`https://r.jina.ai/https://pmc.ncbi.nlm.nih.gov/articles/PMC3406806/`，`X-Return-Format: html`），用來逐格對 Table 1、Table 2。
    - `fawcett2012-fig1.jpg`、`fawcett2012-fig2.jpg`：PMC 的圖檔（`cdn.ncbi.nlm.nih.gov/pmc/blobs/6a79/3406806/…fig01.jpg`、`…fig02.jpg`）。
    - 同期刊出的四封讀者來函與作者回覆（PNAS 109(45)，都在 PMC）：`fawcett2012-letter-gibbons.md`（PMC3494916）、`fawcett2012-letter-fernandes.md`（PMC3494922）、`fawcett2012-letter-chitnis-smith.md`（PMC3494925）、`fawcett2012-letter-kane.md`（PMC3494958）、`fawcett2012-reply.md`（PMC3494947）。這五份不在派工清單裡，是讀後設資料時發現的；內容短，全讀了，記在本紀錄後段。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 4 #6
- **沒讀到的**：Dataset S1（649 篇的逐篇資料，xlsx，在 PNAS 站上，403）。

## 研究設計

- **類型**：書目計量的觀察研究（相關，沒有任何操弄）。分析單位是論文。
- **樣本**（L18、L106）：1998 年刊在三本期刊的**全部**論文，共 649 篇：*Evolution* 186、*Proceedings of the Royal Society of London B* 342、*The American Naturalist* 121。選這三本的理由是 2010 年的 5 年影響係數在生態與演化專門期刊裡最高（6.041、5.442、5.385）。選 1998 年是因為夠近、書目資料完整，又夠久、看得到長期影響。
- **公式怎麼數**（L108）：數「equations, inequalities, and other mathematical expressions」，分正文與印出的附錄兩處。**只數獨立成行的公式**；同一行有兩個以上各算一個。「"In-line" equations printed fully within the text, without breaking its spacing or indentation, were not counted.」1998 年的線上附錄極少，有也不計。
- **自變項**：公式密度＝公式數 ÷ 全文頁數。範圍 0 到 7.29 個／頁，平均 ± SEM 0.43 ± 0.04，與頁數無關（r₆₄₇ = 0.056，P = 0.151）（L22）。公式數（不是密度）與頁數正相關（r₆₄₇ = 0.257，P < 0.001，L120）。
- **依變項**（L22、L110）：2011 年 5 月 Web of Science（SCI Expanded）的被引次數，扣掉自我引用（引用文與被引文有任一作者姓氏相同就算）。範圍 0–374，平均 ± SEM 44.80 ± 1.98。作者說納入自我引用時「we obtained very similar results」，沒有給數字。
- **引用文分成理論與非理論**（L45、L112）：下載到 29,072 篇引用文中 28,068 篇（96.5%）的摘要；題名或摘要出現「model*」（排除 model organism、statistical model、regression model 等十種實證用法）就算「理論」。這樣判出 6,229 篇（22.2%）是理論，作者自己說「is likely to be an overestimate」。隨機抽 200 篇人工核對，這個代理指標分對 84.5%。
- **模型**（L118–120）：負二項迴歸（R 的 MASS::glm.nb）。資料過度離散（變異數對平均的比 > 50）。解釋變項：公式密度、頁數、期刊（以 Am. Nat. 為參照）、公式密度 × 頁數。密度與頁數都當連續變項；圖裡的分組只是為了畫圖。另用 quasi-Poisson 重跑，作者說結論相同、係數相近，沒有列數字。
- **表裡的「OR」**：表註定義為「For a unit increase in the explanatory variable, the number of citations changes by a factor given by the OR」（L43），也就是每多一單位、被引次數乘上的倍數（計數模型的比率）。作者稱它 odds ratio，並舉例「an OR of 0.78 implies a decrease of 22%」。

## 結果（逐項）

Table 1、Table 2 的每一格都對過 PMC 的 HTML 表格（`fawcett2012-pmc-rendered.html`，有欄位邊界）；粗體＝原表標示 P < 0.05。沒有 PDF 可對。

### Table 1：不分正文與附錄的公式密度（L24–43）

| # | 參數 | 全部引用 OR（95% CI）；z；P | 非理論引用 | 理論引用 |
|---|---|---|---|---|
| 1 | 截距 | 28.67（20.69–39.74）；20.189；<0.001 | 20.93（14.77–29.66）；17.135；<0.001 | 6.14（4.17–9.03）；9.219；<0.001 |
| 2 | **公式密度（個／頁）** | **0.78（0.66–0.93）；−2.782；0.005** | **0.73（0.61–0.88）；−3.244；0.001** | 0.97（0.79–1.18）；−0.338；0.735（不顯著） |
| 3 | 總頁數 | **1.05（1.02–1.07）；3.929；<0.001** | **1.05（1.02–1.08）；3.692；<0.001** | **1.05（1.02–1.08）；3.379；0.001** |
| 4 | 刊在 Evolution（對 Am. Nat.） | 0.95（0.76–1.18）；−0.494；0.622 | 1.07（0.85–1.35）；0.573；0.567 | **0.70（0.54–0.91）；−2.692；0.007** |
| 5 | 刊在 Proceedings B（對 Am. Nat.） | 1.14（0.90–1.43）；1.102；0.270 | 1.22（0.95–1.55）；1.565；0.118 | 0.93（0.71–1.21）；−0.561；0.575 |
| 6 | 公式密度 × 頁數 | 1.02（1.00–1.04）；1.636；0.102 | 1.01（0.99–1.03）；0.937；0.349 | **1.03（1.01–1.05）；2.443；0.015** |

對應的內文句：
- 第 2 列全部引用：「Equation density negatively affects citation rates, leading on average to 22% fewer citations for each additional equation per page」（L22）。
- 第 2 列非理論引用：「the negative effect of equation density is strongest for nontheoretical papers, which provide 27% fewer citations for each additional equation per page」（L45）。
- 第 2、6 列理論引用：「there was no main effect of equation density on citations by theoretical papers … We did, however, record a significant positive interaction between equation density and the length of the cited paper.」（L53）
- 非理論引用的交互作用不顯著：「Statistically, however, the effect of equation density on nontheoretical citations was consistent across papers of different lengths (nonsignificant interaction term」（L45）。

### Table 2：正文公式與附錄公式分開（L57–78）

| # | 參數 | 全部引用 OR（95% CI）；z；P | 非理論引用 | 理論引用 |
|---|---|---|---|---|
| 7 | 截距 | 29.11（21.01–40.34）；20.287；<0.001 | 21.24（14.99–30.08）；17.230；<0.001 | 6.14（4.17–9.04）；9.221；<0.001 |
| 8 | **正文公式密度（個／頁）** | **0.72（0.57–0.92）；−2.673；0.008** | **0.65（0.50–0.84）；−3.330；0.001** | 0.96（0.73–1.26）；−0.311；0.755（不顯著） |
| 9 | **附錄公式密度（個／頁）** | 0.99（0.65–1.52）；−0.032；0.975（不顯著） | 1.07（0.68–1.70）；0.305；0.760（不顯著） | 0.98（0.60–1.61）；−0.067；0.946（不顯著） |
| 10 | 總頁數 | **1.05（1.02–1.07）；3.856；<0.001** | **1.05（1.02–1.08）；3.608；<0.001** | **1.05（1.02–1.08）；3.365；0.001** |
| 11 | 刊在 Evolution | 0.94（0.76–1.17）；−0.523；0.601 | 1.07（0.85–1.35）；0.553；0.580 | **0.70（0.54–0.91）；−2.691；0.007** |
| 12 | 刊在 Proceedings B | 1.13（0.90–1.42）；1.029；0.303 | 1.21（0.94–1.54）；1.503；0.133 | 0.93（0.71–1.21）；−0.562；0.574 |
| 13 | 正文公式密度 × 頁數 | 1.02（0.99–1.05）；1.572；0.116 | 1.02（0.99–1.05）；1.534；0.125 | 1.03（1.00–1.06）；1.788；0.074（接近顯著） |
| 14 | 附錄公式密度 × 頁數 | 1.00（0.96–1.04）；−0.073；0.941 | 0.97（0.93–1.02）；−1.161；0.246 | 1.03（0.98–1.08）；1.022；0.307 |

對應的內文句（L55）：
- 第 8 列：「each additional equation per page leading to a 28% drop in citations」；「Citations by nontheoretical papers decrease by 35% for each additional equation per page presented in the main text」。
- 第 9 列：「In contrast, equations presented in an appendix have no impact on citation rates」；「Additional equations in the appendixes, however, have no effect on nontheoretical citation rates」。
- 第 8、9、13 列理論引用：「Citations by theoretical papers are unaffected by the density of equations in either the main text or the appendixes …, but the interaction between the density of main-text equations and the length of the paper was close to significance (P = 0.074), again suggesting that long, equation-dense articles garner more citations from other theoretical papers.」

留意第 9 列的區間寬度：附錄密度的 95% CI 是 0.65–1.52（全部引用）、0.68–1.70（非理論）。「沒有效果」是點估計接近 1、區間很寬，原文沒有檢定「正文係數與附錄係數是否不同」。

### 內文的其他結果

| # | 結果 | 數字 | 對照條件 | 行號 | 原文 |
|---|---|---|---|---|---|
| 15 | 只留至少有一個公式的論文 | n = 247；整體密度 OR = 0.78，95% CI 0.64–0.96，z = −2.393，P = 0.017 | 密度高 vs 低（都有公式） | L86 | 「This analysis yielded similar results: The overall number of citations goes down with increasing equation density [odds ratio (OR) = 0.78, 95% confidence interval (CI) = 0.64–0.96, Wald z = −2.393, P = 0.017]」 |
| 16 | 同上，正文公式 | OR = 0.72，95% CI 0.55–0.93，z = −2.514，P = 0.012 | 同上 | L86 | 「this effect is due to equations in the main text (OR = 0.72, 95% CI = 0.55–0.93, Wald z = −2.514, P = 0.012)」 |
| 17 | 同上，附錄公式 | OR = 1.01，95% CI 0.67–1.52，z = 0.042，P = 0.966 | 同上 | L86 | 「rather than equations in the appendixes (OR = 1.01, 95% CI = 0.67–1.52, Wald z = 0.042, P = 0.966)」 |
| 18 | 作者由 15–17 得出的說法 | — | — | L86 | 「Thus, there is a quantitative effect of increasing the density of equations, not simply an aversion to citing papers containing any mathematics.」 |
| 19 | 短文（< 10 頁）的非線性描述（看圖說的，不是模型結果） | 每頁 ≤ 0.5 個公式的與沒有公式的被引一樣多；每頁超過 1 個時非理論引用少一半以上 | 依密度分組的平均 | L45；Fig. 1A | 「Articles less than 10 pages long with up to 0.5 equations per page are just as well cited as those with no equations, but increasing the equation density to more than one equation per page more than halves the number of nontheoretical citations」 |
| 20 | 長文（> 9 頁）的描述（看圖說的） | 完全沒有公式的被引最多；有公式之後密度高低看不出差別 | 同上 | L45；Fig. 1A | 「longer papers (>9 pages) receive more citations when they are completely equation-free, but beyond this difference, there appears to be no effect of quantitative changes in equation density」 |
| 21 | 正文密度、短文 | ≤ 0.5 提高到 > 1 個／頁時被引少一半以上 | 同上 | L55；Fig. 2A | 「For papers less than 10 pages long, the citation count more than halves when the main-text equation density is increased from 0.5 or less to more than one per page」 |
| 22 | 正文密度、長文 | 任何正文公式都看似降低被引 | 同上 | L55；Fig. 2A | 「whereas for longer papers (>9 pages), any equations in the main text appear to reduce citation success」 |
| 23 | 理論引用、10 頁以上 | 每頁超過 0.5 個公式時被引較多 | 同上 | L53；Fig. 1B | 「papers of 10 pages or more have increased citation success when they contain more than 0.5 equations per page」 |

### 圖（讀了圖檔，數值是我從長條目測的，只能當大略）

- **Fig. 1A**（非理論引用，平均 ± SEM；密度含正文與附錄；文長分 < 7 頁、7–9 頁、> 9 頁）：沒有公式約 20、24、33；≤ 0.5 約 19、21、24；≤ 1 約 18、14、23.5；> 1 約 8.5、8.5、19.5。
- **Fig. 1B**（理論引用）：沒有公式約 4.6、5.2、6.5；≤ 0.5 約 6.5、6.1、8.1；≤ 1 約 10.2、7.3、14.1；> 1 約 8.7、7.7、14.4。方向與 1A 相反：有公式的論文被理論文章引得較多。
- **Fig. 2A**（非理論引用對正文密度）：沒有約 20、23.5、33；≤ 0.5 約 22、20.5、21.5；≤ 1 約 15、17、24；> 1 約 9、7.5、23.5。
- **Fig. 2B**（非理論引用對附錄密度）：誤差線很長（例：短文 ≤ 1 那一格約 41，誤差線從約 23 到 72），各格沒有一致方向。
- 圖說都註明分組只為了畫圖，統計分析沒有分組（L51、L84）。圖裡各格的篇數沒有標。

## 作者自己列的限制

原文**沒有** Limitations 節。散在各處、作者自己承認的：

1. 理論／非理論的分類是粗略代理：「We used this as a rough proxy」；22.2% 可能高估；人工核對 200 篇的正確率 84.5%（L112）。
2. 自我引用的排除法（比對姓氏）會把同姓的別人也排掉：「this criterion might generate some spurious self-citations, they are likely to be rare」（L110）。
3. 只看印在紙本裡的附錄；1998 年線上附錄很少。現在附錄多半是另外下載的電子檔，效果可能不同，作者只說是「Our suspicion」，並建議幾年後重做（L98）。
4. 把公式搬到附錄有代價：「the risk of moving equations to an appendix is that the main text then glosses over the fine details of the model's assumptions」（L96）。
5. 在公式之間加說明文字要多佔版面，短篇幅期刊會擋（L94）。

原文沒有說、但設計上明擺著的（我的觀察）：
- 是相關研究。論文裡沒有控制論文的類型（理論或實證）、主題、作者等變項；模型裡只有頁數與期刊。作者用「只留有公式的 247 篇」那個分析來排除「讀者只是不引理論文」這個解釋。
- 只有一年（1998）、三本期刊、一個領域。
- 依變項是被引次數，沒有任何讀者層次的測量（閱讀、理解、誰跳過了什麼都沒量）。
- 行內公式不計入。

## 與摘要說法不一致的地方

數字逐項對過，沒有錯。措辭上有五處：

1. **因果用語**。摘要：「The density of equations in an article has a significant negative impact on citation rates」；題名用「impedes communication」。資料是觀察性的，內文自己的推論句寫的是「presumably impedes the wider dissemination of theoretical predictions」（L90）。「溝通受阻」是從被引次數推出來的，沒有量。
2. **摘要給的是 28% 與 35%（正文密度，Table 2），沒有給 22% 與 27%（整體密度，Table 1）**。兩組都對，但摘要第一句主詞是「The density of equations in an article」，後半才限定「in the main text」。引用時要寫明是「正文每頁多一個公式」。
3. **「每頁多一個公式」是很大的一步**。平均密度只有 0.43 個／頁，649 篇裡只有 247 篇有任何公式。28% 是模型係數換算，不是「多寫一個公式少 28% 引用」。
4. **摘要說理論引用的增加「is outweighed」**。理論引用的主效果不顯著（OR 0.97，P = 0.735）；顯著的是 Table 1 的密度 × 頁數交互作用（P = 0.015），到了 Table 2 分開正文與附錄後變成 P = 0.074。「長而公式多的論文較常被理論文引用」在分開的模型裡只是接近顯著。
5. **摘要：「equations presented in an accompanying appendix do not lessen a paper's impact」**。依據是附錄密度的係數不顯著（P = 0.975、0.760、0.946）且區間寬（0.65–1.52）。這是「沒有偵測到效果」，原文沒有做等效性檢定，也沒有直接比較正文與附錄兩個係數。
6. 內文對短文與長文的描述不同（19–22 項）：長文是「有沒有公式」的差別、短文是「密度超過每頁 1 個」的差別。摘要只給一個線性的百分比。作者有交代交互作用在非理論引用上不顯著。

## 與清單「要撐的結論」不合的地方

清單的句子：「公式密度與引用數負相關；附錄裡的公式不算」。

大致撐得住，要補四個條件才不會寫過頭：

1. **「負相關」只在來自非理論文章的引用上成立**。理論文章的引用與公式密度無關（OR 0.97／0.96），在長文裡還偏正向。寫成「公式多的論文被引得少」會漏掉這一半。
2. **「附錄裡的公式不算」要寫成「沒有偵測到關聯」**，並註明是 1998 年印在文末的紙本附錄；現在的線上補充資料作者明說沒有資料。
3. **量的是被引次數，不是讀懂沒有**。清單自己在「不能寫的結論」裡已經寫了這一點；原文支持這個判斷——全文沒有任何讀者層次的資料。
4. **數的只是獨立成行的公式**，行內的記號與式子不算。用來談「記號」的話，這篇其實沒有碰行內記號。

另外三件與 order 4 #7、#8 直接相關：

- **Gibbons 的來函用同一份資料加了期刊交互作用**，報告在 *The American Naturalist* 裡正文公式密度的 OR 是 2.1（公式密度愈高被引愈多），模型的 AIC 低 7.7（`fawcett2012-letter-gibbons.md`）。作者在回覆裡**承認這個結果**：「Interestingly, the more complex statistical analysis of Gibbons shows that the effect of equation density differs between journals, with a positive effect for articles published in The American Naturalist.」（`fawcett2012-reply.md`）也就是說，負向關聯在這三本期刊之間就不一致，這發生在物理學的爭論之前。
- **作者自己在回覆裡收窄了主張**：「It is not equations that are the problem; it is equations without sufficient accompanying text to explain the assumptions and implications for a broad biological audience. We do not recommend the indiscriminate removal of equations from scientific papers.」回覆的題名是「Communicating theory effectively requires more explanation, not fewer equations」。原論文的首選建議也是加說明文字（L94：「The best approach would be to add more explanatory text between the equations」），搬到附錄是次選。文章若引這篇來說「公式放附錄」，要帶上這個順序。
- **Fernandes 的來函**直接說這是把相關當因果（題名「No evidence that equations cause impeded communication among biologists」）；作者的回覆沒有反駁「是相關」這一點，回的是被引次數低的那一端值得在意。

## 同期來函與回覆（PNAS 109(45)，2012；全讀）

| 文件 | 作者 | 主張（一句） |
|---|---|---|
| Do not throw equations out with the theory bathwater（E3054，10.1073/pnas.1212498109） | James Gibbons | 加入期刊 × 密度 × 頁數的交互作用後模型較好（AIC 低 7.7），Am. Nat. 的正文公式密度 OR = 2.1，對照原模型跨期刊的 0.7；另提替代解釋：生物學家對理論研究的興趣本來就低，光靠引用分析分不開「公式密度」與「理論含量」。 |
| No evidence that equations cause impeded communication among biologists（E3057，10.1073/pnas.1211892109） | Fernandes（轉出檔沒抓到署名全名；回覆的文獻列作 Fernandes） | 相關不是因果；被引次數不等於被理解（舉 BLAST 與 P 值為高被引卻常被誤解的例子）。 |
| Mathematical illiteracy impedes progress in biology（E3055，10.1073/pnas.1213115109） | Nakul Chitnis、Thomas A. Smith | 被引次數不是溝通品質的好指標；把公式搬到附錄會讓作者少解釋、審稿人少檢查、讀者少花力氣。 |
| A suggestion on improving mathematically heavy papers（E3056，10.1073/pnas.1212310109） | Adam Kane | 建議在正文內做可展開的方塊，把附錄內容就地展開，不打斷閱讀。這是提議，沒有資料。 |
| Reply to Chitnis and Smith, Fernandes, Gibbons, and Kane（E3058–E3059，10.1073/pnas.1213721109） | Fawcett、Higginson | 見上節引文。另給一張表：2011 年生態與演化前 20 名期刊的理論論文比例，三本樣本期刊是 Evolution 0.188（304 篇）、American Naturalist 0.154（182 篇）、Proceedings B 0.109（495 篇），在 20 本裡排第 1、3、7；作者據此說自己的檢定偏保守，並「expect」理論比例低的期刊效果更強（預期，沒有資料）。 |

Gibbons 的 2.1 與 AIC 差只有來函裡這一句，沒有表、沒有信賴區間。

## 讀取紀錄

| 順序 | 位置（`fawcett2012.html` 行號） | 內容 |
|---|---|---|
| 1 | L1–35 | 題名、摘要、關鍵詞、前言三段、Results 第一段、Table 1 表頭（與 `.txt` L1–35 相同，讀的是 `.txt`） |
| 2 | L36–46 | Table 1 資料列、表註、非理論引用那一段（`.txt` 缺這一段，改讀 `.html`） |
| 3 | L47–86 | Fig. 1 圖說、理論引用段、正文對附錄段、Table 2、Fig. 2 圖說、只留有公式論文的分析（＝`.txt` L38–77） |
| 4 | L88–100 | Discussion 六段（＝`.txt` L79–91） |
| 5 | L102–120 | Materials and Methods：Data Collection、Statistical Analysis（＝`.txt` L93–111） |
| 6 | L122–167 | Supplementary Material（只有一行連結）、致謝、註腳、參考文獻 22 筆（掃過）、Associated Data |
| 對表 | `fawcett2012-pmc-rendered.html` 的兩個 `<table>` | Table 1（7 列 × 9 格）、Table 2（9 列 × 9 格）逐格對過，與 markdown 版一致 |
| 圖 | `fawcett2012-fig1.jpg`、`fawcett2012-fig2.jpg` | 四張長條圖 |
| 附帶 | 五份來函與回覆的正文全文、回覆的 Table 1 | 見上節 |

`.txt` 與 `.html` 用 `diff` 比過：除了 L36 起缺的那一段與參考文獻的項目符號空白外，兩檔相同。
