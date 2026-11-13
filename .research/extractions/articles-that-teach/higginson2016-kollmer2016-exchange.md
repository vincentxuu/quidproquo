# 抽取紀錄：Higginson 與 Fawcett 2016 評論、Kollmer 等 2016 回覆（New Journal of Physics 18:118003、118004）

兩份文件是同一場爭論的最後兩手，合成一份紀錄。前情見 `fawcett2012-equations.md`（生物資料原論文與 2012 年的來函往返）、`kollmer2015-physicists.md`（物理資料）。

## 檔頭

**文件 A（評論）**
- Andrew D. Higginson、Tim W. Fawcett（Centre for Research in Animal Behaviour, College of Life and Environmental Sciences, University of Exeter）。Comment on 'Are physicists afraid of mathematics?'. New Journal of Physics 18 (2016) 118003。DOI 10.1088/1367-2630/18/11/118003。2016-02-16 收稿、04-04 修訂、10-21 接受、11-11 刊出。開放取用，CC BY 3.0。
- 原文檔：`.research/raw/learning-content/q2-interactive/higginson2016-comment.txt`（101 行、13,883 字元；Jina 轉 IOP 的 PDF，註明 4 頁）。行號寫「A L行號」。
- 正文引用的分析細節不在評論本文裡，在 Zenodo（doi 10.5281/zenodo.58792）。**本次補抓**：`higginson2016-zenodo58792.pdf`（3 頁）與 `.txt`（`pdftotext -layout`，89 行、6,669 字元），來源 `https://zenodo.org/api/records/58792/files/eq_physics_2pager_2016-07_27_Analysis.pdf/content`。Zenodo 紀錄的題名是「Statistical Analysis of the Effect of Equations on Citations」，文件內稱評論為「Equation-dense papers receive fewer citations—in physics as well as biology」（刊出時的題名不同）。行號寫「Z L行號」，用的是文件自己印的行號 1–62。

**文件 B（回覆）**
- Jonathan E. Kollmer、Thorsten Pöschel、Jason A. C. Gallas（單位同 2015 年論文）。Reply to Comment on 'Are physicists afraid of mathematics?'. New Journal of Physics 18 (2016) 118004。DOI 10.1088/1367-2630/18/11/118004。2016-10-17 收稿、10-25 接受、11-11 刊出。開放取用，CC BY 3.0。
- 原文檔：`.research/raw/learning-content/q2-interactive/kollmer2016-reply.txt`（108 行、15,592 字元；Jina 轉 IOP 的 PDF，註明 5 頁）。行號寫「B L行號」。
- **本次補抓**：`kollmer2016-reply-iop-page.md`（IOP 文章頁的 HTML 轉 markdown，表格有欄位分隔）、`kollmer2016-reply-fig1.jpg`、`kollmer2016-reply-fig2.jpg`（IOP 的高解析圖檔）；另存 `higginson2016-comment-iop-page.md`。

- **版本**：兩份都是刊出版。兩份的 PDF 直連被 IOP 擋下（回的是驗證頁），所以書目是對 Jina 轉出的 PDF 首頁文字與 IOP 文章頁，沒有看到 PDF 版面本身。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 4 #8

## 研究設計

兩份都不是新研究，是對既有兩批資料的再分析與論辯。

**評論的再分析（細節在 Zenodo）**
- 資料：Kollmer 等人提供的 PRL 第 94、104 卷資料，**n = 1,906**（Z L21、Table 1）。2015 年論文寫的是兩卷各取前 1,000 篇；為什麼是 1,906 而不是 2,000，兩份文件都沒有交代。
- 公式密度怎麼來的：PRL 幾乎都是四頁、沒有附錄，「Kollmer et al could simply divide the number of equations by four to get an approximate measure of equation density (Thorsten Pöschel, personal communication)」（Z L15–17）。密度範圍 0–8.75 個／頁，平均 ± SEM 1.237 ± 0.034；被引次數 0–809，平均 ± SEM 30.629 ± 1.026（Z L17–19）。
- 模型：負二項迴歸（R 的 glm.nb），依變項是被引次數，解釋變項是**公式密度、期刊卷別、兩者的交互作用**（Z L24–26）。變異數對平均的比超過 65，聚集參數 k = 0.475（Z L19–22）。沒有其他控制變項（作者數、參考文獻數、子領域都沒有；頁數幾乎固定所以不放）。卷別哪一卷是參照組沒有寫。
- 三個版本：(A) 全部；(B) 排除被引超過 100 次的；(C) 再排除沒有公式的（表題寫「containing at least one equation and with fewer than 100 citations」，Z L54–55）。

**回覆的再分析**
- 把「排除被引超過 100 次」這個條件反過來套到 2012 年的生物資料（649 篇），用同樣的負二項模型（公式密度、頁數、期刊、密度 × 頁數）重跑（B L46–48、Table 1）。排除後剩幾篇沒有寫。
- 兩張圖：生物資料的散點（全部、只留被引少於 100 次的）；三批資料的公式密度直方圖。

## 結果（逐項）

### 評論：物理資料的負二項迴歸（Zenodo Table 1；對過 PDF 第 3 頁版面）

OR 的定義同 2012 年論文（每多一單位、被引次數乘上的倍數）。表註說顯著的以粗體標示，但 PDF 上看不出粗體，以 P 值為準。

| # | 參數 | (A) 全部 n = 1,906 | (B) 排除被引 > 100 次 n = 1,809 | (C) 有公式且被引 < 100 次 n = 1,346 |
|---|---|---|---|---|
| 1 | 截距 | 17.86（16.53–19.31）；z 72.85；P < 0.001 | 17.16（16.01–18.39）；80.67；< 0.001 | 15.68（14.28–17.21）；57.97；< 0.001 |
| 2 | **公式密度（個／頁）** | **0.94（0.90–0.98）；−3.09；0.002** | **0.92（0.88–0.95）；−4.38；< 0.001** | **0.95（0.91–0.99）；−2.41；0.016** |
| 3 | 卷別 | 2.72（2.44–3.03）；18.10；< 0.001 | 1.92（1.74–2.12）；12.98；< 0.001 | 1.98（1.74–2.26）；10.11；< 0.001 |
| 4 | 公式密度 × 卷別 | 0.99（0.93–1.05）；−0.37；0.709 | 1.05（1.00–1.11）；1.88；0.061 | 1.04（0.98–1.10）；1.25；0.210 |

| # | 結果 | 數字 | 對照條件 | 位置 | 原文 |
|---|---|---|---|---|---|
| 5 | **−6%** | OR 0.94（第 2 列 A） | 每頁多一個獨立成行的公式；全部 1,906 篇 | A L65；Z L26–28 | 「equation density has a statistically significant negative effect on the number of citations, leading on average to 6% fewer citations for each additional equation per page.」 |
| 6 | −8% | OR 0.92（第 2 列 B） | 同上，排除被引超過 100 次的 97 篇 | A L65；Z L30–32 | 「This effect increases to 8% for papers that have been cited fewer than 100 times each.」 |
| 7 | −5% | OR 0.95（第 2 列 C） | 同上，再排除沒有公式的 | Z L33–36 | 「The negative effect of equation density was weaker (5% fewer citations for each additional equation per page), but still statistically significant」 |
| 8 | 與生物資料的比較 | 物理 6% 對生物 22%（整體密度）／28%（正文密度） | — | A L75 | 「The effect we found was considerably weaker than in a sample of papers from ecology and evolutionary biology [12], but still sizeable and statistically significant.」 |
| 9 | 反事實估算 | 45 篇被引 50–100 次、每頁 2 個公式的論文，若密度減半會多 476 次引用（佔它們總引用的 17%） | 模型外推，「all else being equal」 | A L75 | 「our statistical model predicts that, all else being equal, the 45 articles in KPG's data that are moderately well cited (50–100 citations) and equation dense (2 equations per page) would have attracted an additional 476 citations (17% of their total) if the authors had halved the density of equations in the main text.」 |

第 9 項沒有出現在 Zenodo 文件裡，算法只有評論這一句。

### 評論：對 2015 年論文三項批評的回應（沒有新數字）

| # | 2015 年論文的批評 | 評論的回應 | 位置 |
|---|---|---|---|
| 10 | 效果是分組畫圖造成的 | 結論來自把密度當連續變項的負二項迴歸，分組只是畫圖用：「This binning was entirely separate from our statistical analysis」 | A L41、L53 |
| 11 | 資料太吵 | 吵表示引用主要受別的因素影響，公式密度「alone explains a relatively small proportion of the variance—a point we emphasised in our original paper」；統計模型本來就是用來處理雜訊的 | A L53 |
| 12 | 漏掉兩篇公式密度高的高被引論文 | 圖與模型都含全部資料點；「nothing can be reliably inferred from two examples of heavily cited, equation-dense outliers selected from a sample of 649 articles」；這兩篇若公式少一點也許被引更多（「may have been even higher」，推測） | A L53 |
| 13 | 結論依賴理論／非理論的切分 | 不切分也有：「the effect is still present when analysing the entire sample (22% drop in citations for each additional equation per page)」 | A L53 |
| 14 | 用標準差誤差線判斷不顯著 | 描述性誤差線（標準差）不能這樣用；分組愈細每組愈小、誤差線愈長 | A L59–65 |
| 15 | 「怪罪數學」 | 不是本意；主張的是密度而非公式數量，建議是多用文字解釋、非必要的中間步驟放附錄 | A L69–75 |

第 11 項說「原論文強調過公式密度只解釋一小部分變異」：我在 2012 年論文全文裡沒有讀到這句話或任何解釋變異比例的數字（見 `fawcett2012-equations.md` 的讀取紀錄）。

### 回覆：生物資料排除高被引後的重跑（B Table 1；對過 IOP 文章頁的表格）

| # | 參數 | 估計值 | 標準誤 | z | P |
|---|---|---|---|---|---|
| 16 | (Intercept) | 3.195 | 0.144 | 22.143 | < 2e-16 *** |
| 17 | **equation density** | **−0.101** | 0.073 | −1.370 | **0.171**（不顯著） |
| 18 | Pages | 0.031 | 0.011 | 2.819 | 0.00481 ** |
| 19 | Journal Evolution | −0.068 | 0.097 | −0.703 | 0.48237 |
| 20 | Journal Proc B | −0.025 | 0.101 | −0.252 | 0.80132 |
| 21 | equation density × pages | 0.006 | 0.009 | 0.696 | 0.48620 |

- 估計值是對數尺度的係數（沒有取指數）。−0.101 換成倍數是 exp(−0.101) ≈ 0.90，也就是點估計仍是每頁多一個公式少約 10%，方向與原論文相同，只是不再顯著。這個換算是我做的，回覆沒有寫。
- `.txt` 裡這張表的截距 P 值掉了（B L57），以 IOP 文章頁為準。
- 排除後的篇數沒有寫。
- 原文對這張表的說法（B L46–48）：「If we apply the same standard to their data used in [2], the correlation reported there vanishes (P-value of 0.171, see our table 1), that is, a correlation cannot be substantiated.」

### 回覆：其他論點

| # | 論點 | 數字 | 位置 | 原文 |
|---|---|---|---|---|
| 22 | 評論為了得到強的顯著性才排除高被引論文 | — | B L46 | 「In order obtain strong significance of the correlation, their table 1—see column (B) of Higginson and Fawcett [4]—had to exclude those papers which earned more than 100 citations from the analysis.」 |
| 23 | 生物資料多數沒有公式 | 內文寫 649 篇中 **411** 篇沒有公式（B L50–52）；Figure 2 圖說寫 **402** 篇（B L73）；每頁一個以上的只有 85 篇 | B L50–52、L73 | 「of the 649 papers analyzed by them, 411 papers contain no equations at all. Furthermore, only 85 papers contain one or more equations per page」 |
| 24 | 兩卷不該合併 | 沒有數字 | B L54、L65 | 「both volumes were published with a temporal separation of 10 years」；「We point out that the correlation is much less significant when analyzing the volumes separately.」 |
| 25 | 相關不是因果 | — | B L67 | 「even if it would be possible to find a negative correlation between citation frequency and density of equations (the fact we dispute), this would not allow one to conclude that the total number of citations would increase if the authors would reduce the density of equations.」 |
| 26 | 替代解釋：子領域 | — | B L69 | 「different areas in any discipline (physics, biology) require different level of mathematical description and it seems quite natural that scientists working in a certain area cite preferred papers published in the same area. Since for several reasons the theoretical research areas are traditionally less populated, it appears quite naturally that there are differences in the citation rates」；作者自己說這個解釋「cannot be evidenced by pure statistical analysis」 |
| 27 | 自己的立場 | — | B L46 | 「our paper [1] pointed out that we did not find evidence for a correlation between citation frequency and density of equation. This is quite different from what Higginson and Fawcett claim, stating erroneously that we denied the existence of correlations」 |
| 28 | 總結 | — | B L71 | 「a correlation between the citation rate and the number of display equation cannot be evidenced by a statistical analysis based on the available data, dominated too much by noise.」；建議用更大的資料集 |

**回覆的圖（讀了圖檔）**
- Figure 1：生物資料的散點，(a) 全部，縱軸到 400；(b) 只留被引少於 100 次的。大量的點貼在密度 0 那條直線上；密度超過 4 的只有四、五個點，被引都在 30 次以下。圖說：「no trends are discernible when high impact papers are omitted」（B L59）。
- Figure 2：公式密度直方圖。(a) 生物：第一格（接近 0）約 500 篇，其後約 50、37、22、15，之後個位數。(b) PRL 第 104 卷：第一格約 450，之後約 140、100、75、43……。(c) PRL 第 94 卷：第一格約 350，之後約 160、120、97、60……。物理兩卷的第一格也最高，但尾巴比生物長得多。數字是目測。

## 作者自己列的限制

兩份都沒有 Limitations 節。

- 評論承認：物理的效果「considerably weaker」（A L75）；公式密度只解釋一小部分變異（A L53）；密度是用公式數除以 4 得到的「approximate measure」（Z L16）。
- 回覆承認：自己提出的子領域解釋無法只靠統計證實，「would need sociological and more elaborated research」（B L71）。
- 兩邊都沒有處理的：沒有任何一方控制子領域、作者數、參考文獻數（2015 年論文自己的圖顯示後兩者與被引有關）；被引次數是否反映「讀懂」完全沒有資料。

## 與摘要說法不一致的地方

**評論**
1. 摘要：「citation counts are lower for articles with a high density of equations」「a negative relationship … may extend across the breadth of the sciences」。依據是一本期刊兩卷的再分析；摘要用了「may」，內文 A L75 也用「suggests」「perhaps」。措辭一致，但「across the breadth of the sciences」的證據就只有生物三本期刊加物理一本。
2. 摘要沒有給 6% 這個數字，也沒有說它比生物的小很多；這兩點只在內文。
3. 內文第 9 項的「若密度減半會多 476 次引用」是因果式的外推，與摘要的「relationship」用詞不一致；回覆針對的正是這一句。
4. 內文說 2015 年論文「argued that there is no evidence for a relationship」（A L37）。2015 年論文的摘要寫的是趨勢「not reliable」，內文則有「do not display significant effects」。兩邊各引了對方較強的那句。

**回覆**
1. **第 22 項與 Zenodo 的表不合**：評論正文報的 6% 來自 (A) 全部論文那一欄，本身就顯著（P = 0.002）。排除高被引論文的 (B) 欄是加做的穩健性檢查（Z L30–31：「To allay the concerns expressed by Kollmer et al about heavily cited papers」）。說對方「必須排除高被引論文才顯著」不符合那張表。
2. **411 與 402**：同一篇文件內文與圖說的數字不同。2012 年論文說至少有一個公式的是 247 篇，649 − 247 = 402，圖說那個數字對得上。
3. 摘要與第 28 項說「a clear statistical correlation … is not possible because the data is too noisy」，內文第 27 項又說自己並沒有否認相關存在。兩句並存。
4. 「分卷分析時顯著性低很多」（第 24 項）沒有給任何數字或表。
5. 回覆把 2012 年論文的分類法說成「matching the keyword 'model' to the title of a paper」（B L34）；原論文是題名**或摘要**，而且被分類的是引用文，不是被引的 649 篇。

## 與清單「要撐的結論」不合的地方

清單的句子：「雙方爭的是什麼；用物理資料重做的 −6%」。

−6% 有原文與表可以對（Zenodo Table 1 (A)：OR 0.94，95% CI 0.90–0.98，P = 0.002，n = 1,906）。寫的時候要補這幾點，不然會寫過頭：

1. **−6% 是「每頁多一個獨立成行的公式」的模型係數**，PRL 的平均密度是 1.24 個／頁；模型只有密度、卷別與交互作用三項，沒有控制子領域、作者數、參考文獻數。它是相關。
2. **比生物的小很多**（6% 對 22%／28%），評論自己說「considerably weaker」。
3. **爭論沒有收斂**。同一期刊同一天刊出的回覆不接受這個結果，並回敬一個再分析：把同樣的「排除被引超過 100 次」套到生物資料，公式密度的係數變成不顯著（−0.101，P = 0.171）。不過這個係數的方向仍是負的（約 −10%），而且回覆指控對方「靠排除才顯著」與對方的表不符。
4. **「雙方爭的是什麼」可以整理成四件事**，都有原文可引：
   - 用眼睛看分組長條圖與標準差，還是用把密度當連續變項的計數迴歸（方法）。
   - 少數高被引論文算不算、該不該排除（兩邊各做了一次排除，各得到對自己有利的結果）。
   - 相關能不能推到「減少公式就會多被引」（評論第 9 項做了這個外推，回覆反對；2012 年 Fernandes 的來函早就提過同一點）。
   - 替代解釋：理論性強的子領域人少、彼此引用，所以被引少，與讀不讀得懂無關（回覆提出，Gibbons 2012 也提過類似的；兩邊都沒有資料能分辨）。
5. **雙方其實有共識的地方**：都同意引用資料很吵、公式密度只解釋很小一部分；評論方的實務建議是「多用文字解釋公式、非必要的中間步驟放附錄」，不是「刪公式」。

這整組文獻（#6、#7、#8）量的都是被引次數，沒有任何一篇量過讀者讀懂了沒有。清單在「不能寫的結論」已經這樣標了，讀完全文後這個判斷成立。

## 讀取紀錄

| 順序 | 位置 | 內容 |
|---|---|---|
| 1 | 評論 `.txt` A L1–101（一次讀完，依序） | IOP 封面頁資訊（L1–20）、題名與作者（L22–29）、摘要（L31–33）、第 1 節（L35–37）、第 2 節（L39–53，中間 L43–51 是首頁邊欄的日期與授權）、第 3 節（L55–65）、第 4 節（L67–75）、致謝（L77–79）、參考文獻 16 筆（L81–99，掃過） |
| 2 | Zenodo 文件全文（Z L1–62，三頁） | 方法與結果敘述（L12–36）、致謝與文獻（L38–53）、Table 1 與表註（L54–61）；Table 1 另用 Read 讀 PDF 第 3 頁影像逐格對過 |
| 3 | 回覆 `.txt` B L1–108（一次讀完，依序） | IOP 封面頁資訊（L1–20）、題名與作者（L22–26）、摘要與前情（L28–36）、Statistical analysis（L46–54、L65）、Table 1 與 Figure 1 圖說（L56–59）、Correlation versus causality（L67–71）、Figure 2 圖說（L73–74）、結尾段（L80）、致謝（L82–84）、參考文獻 9 筆（L86–106，掃過） |
| 4 | `kollmer2016-reply-iop-page.md` 的 Table 1 | 六列逐格對過；補回 `.txt` 掉的截距 P 值 |
| 5 | `kollmer2016-reply-fig1.jpg`、`-fig2.jpg` | 兩張圖 |

評論本文沒有表也沒有圖（IOP 文章頁確認過沒有表格）。兩份的 PDF 版面沒看到。
