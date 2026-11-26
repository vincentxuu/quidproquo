# 抽取紀錄：Castro-Alonso、Wong、Adesope、Ayres、Paas 2019，Gender Imbalance in Instructional Dynamic Versus Static Visualizations: a Meta-analysis

- **合法公開來源**：https://repub.eur.nl/pub/114594/Repub-114594.pdf （鹿特丹伊拉斯姆斯大學機構典藏 RePub，共同作者 Paas 的單位，2026-10-14 核對）。重新下載與手上的 `castro-alonso2019.pdf` 位元組完全相同（880,880 位元組）。Unpaywall 標 green，典藏庫永久連結 http://hdl.handle.net/1765/114594 。

- **書目**：Juan C. Castro-Alonso、Mona Wong、Olusola O. Adesope、Paul Ayres、Fred Paas（作者姓名與順序對過 PDF 首頁與末頁的 Affiliations，L6–10、L2495–2529）。Educational Psychology Review 31(2), 361–387，2019。DOI 10.1007/s10648-019-09469-1。卷期頁碼取自 OpenAlex（2026-10-14 查），手上的 PDF 是線上先行版，頁首只印期刊名與 DOI，沒有卷期頁碼。
- **原文檔**：`.research/raw/learning-content/q2-interactive/castro-alonso2019.txt`（2,530 行、93,654 字元）；PDF `castro-alonso2019.pdf`（27 頁）。我另用不帶 `-layout` 的 `pdftotext` 重轉一次，結果與原 `.txt` 行數、字元數完全相同，所以行號直接用原檔。
- **讀取日期**：2026-10-14
- **版本**：刊出版（Springer 線上先行版排版，未編卷期）
- **供哪幾篇使用**：order 7（該不該做互動）#2
- **表格對照**：原 `.txt` 的表格被拆成一行一格。Table 3、4、5 用 `pdftotext -layout` 抽第 14、16、17 頁逐列對過；Table 2（橫排，跨第 11–13 頁）與 Fig. 1、Fig. 2 直接看 PDF 第 8、10、11、12 頁的版面，第 13 頁（Table 2 最後一段）只靠 `.txt` 欄位順序對應，沒有看版面。

## 研究設計

- **類型**：統合分析，只收「隨機分派」的組間實驗（L13–14「a meta-analysis of randomized experiments」；納入標準第 5 條 L329–330，沒有明說隨機分派的研究排除）。
- **比較對象**：一組看動態視覺化（動畫、模擬、影片），一組看靜態視覺化（靜止插圖、投影片、照片）（L27–28）。純文字條件、同一組同時有動態與靜態的混合條件排除（L324–325）。
- **「動態」的定義比一般寬**：L325–328「By “dynamic,” in addition to common dynamic visualizations such as videos and animations, we also considered depictions that other researchers have called “static–sequential” (e.g., Imhof et al. 2011) or “successive static” (e.g., Lowe et al. 2011).」也就是一張一張依序出現的靜態圖也歸在動態組。
- **納入標準九條**（L307–334）：(1) 1990–2017 年出版；(2) 英文；(3) 同儕審查期刊論文；(4) 組間設計，比較至少一個動態與一個靜態視覺化，內容是 STEM 或操作程序類（manipulative–procedural）任務；(5) 明說隨機分派；(6) 樣本全是中小學或大學學生；(7) 有可量的表現成果，如保留與遷移測驗；(8) 資料足以算效果量；(9) **報告了整體樣本的性別比**。
- **檢索**（L337–343）：檢索詞 `animation OR animated AND (visualization OR picture)`，查 ProQuest–ERIC、ProQuest–APA（PsycARTICLES、PsycINFO）、Web of Science（SSCI 四個類別）。得 1,470 篇，去重後 1,269 篇。原文沒寫檢索日期。
- **篩選流程**（L344–368、Fig. 1 對過 PDF 第 8 頁）：1,269 篇摘要 → 排除 1,107 篇 → 162 篇讀全文 → 排除 125 篇（其中 72 篇是因為沒報性別比）→ 資料庫來源 37 篇；另從 5 篇經典論文與 3 篇統合分析（Berney 與 Bétrancourt 2016、Höffler 2010、Höffler 與 Leutner 2007）的參考文獻補 8 篇，再加 1 篇（Lusk 與 Atkinson 2007）→ **46 篇、82 個效果量、N = 5,474**。
- **受試者**：82 個比較中 19 個（23%）是中小學生、63 個（77%）是大學生；60 個（73%）是 STEM、22 個（27%）是操作程序類（L370–372）。樣本女性比例的中位數是 60%（L1560）。
- **量了什麼**：各原始研究的學習成果測驗（保留、遷移等），統合時每個比較一個 Hedges' g；正值代表動態組較好（L384–393）。**什麼時候量（立即或延宕）原文沒有編碼，也沒有交代**。
- **分析**（L396–417）：Comprehensive Meta-Analysis 2.2.064 與 SPSS 24；加權平均效果量 g+；以 95% 信賴區間是否跨零判斷顯著；QB 檢定同質性，I² 表示異質程度。**原文沒有寫用的是固定效果還是隨機效果模型**。
- **離群值**：3 個效果量 Z > 3.3，沒有刪除，改成 windsorize（調到接近次大或次小值）（L421–428）。
- **編碼者一致性**：兩位作者先各讀 145 篇摘要（約 10%）與同樣 10 個實驗，一致率都寫 100%（L347–348、L375–376）。
- **調節變項**：受試者特徵 3 個（女性比例、空間能力對哪種視覺化有幫助、教育階段）、介入特徵 3 個（任務類型、學習領域、比較時用的媒體）、方法特徵 3 個（是否報各組性別比、是否有前測、是否報測驗信度）。

## 結果（逐項）

下列各表的對照條件一律是「動態視覺化組 vs 靜態視覺化組」，正值＝動態組較好；各列是不同研究子集，屬跨研究比較。「原文一句」欄照抄 `-layout` 版面的該列（N、k、g+、SE、LCI、UCI、QB、df、p、I²）；星號是原表的「*p < 0.05」。

### 整體（Table 3 第一列，原檔 L1316–1544；PDF 第 14 頁）

| # | 結果 | 數字 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 整體效果 | g+ = 0.23*（SE 0.03，95% CI 0.17–0.28），k = 82，N = 5,474 | Overall Effect／Table 3 | L448–449、L1546–1547 | 「there is an overall (N = 5474; k = 82) statistically significant positive effect of learning with dynamic visualizations (g+ = 0.23), which corresponds to a small size (Cohen 1988).」 |
| 2 | 異質性 | QB(81) = 252.64，p < 0.001，I² = 67.94% | 同上 | L1548–1552 | 「The overall distribution was highly heterogeneous, QB(81) = 252.64, p < 0.001, I2 = 68%.」 |
| 3 | 未加權的效果量分布 | M = 0.20，SD = 0.57，多數落在 −0.40 到 0.80 | Results／Fig. 2 | L428–431 | 「The effect sizes (M = 0.20, SD = 0.57) are mainly clustered between − 0.40 and 0.80 standard deviations.」 |
| 4 | 個別效果量的方向（**我自己從 Table 2 數的，原文沒有這個統計**） | 82 個裡打星號（p < 0.05）且為正的 18 個、打星號且為負的 5 個、沒打星號的 59 個；範圍 −1.55 到 1.70 | Table 2 | L731–761、L1057–1090、L1248–1266 | 負向顯著的五個：Park 與 Gittelman 1992 (2) −0.82*、Soemer 與 Schwan 2016 exp 1 −0.57*、exp 2 −0.49*、Zacks 與 Tversky 2003 exp 2 的兩個 −1.50*、−1.55* |

### 受試者特徵（Table 3，PDF 第 14 頁）

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 5 | 女性比例：組間 | QB(1) = 28.41，p < 0.001 | L1564–1565 | 「The between-levels difference was statistically significant, QB(1) = 28.41, p < 0.001.」 |
| 6 | 女性 59% 以下的樣本 | g+ = 0.36*（SE 0.04，CI 0.29–0.43），k = 35，N = 2,932，I² 70.35 | Table 3 | 「59% or less 2932 35 0.36* 0.04 0.29 0.43 114.66 34 < 0.001 70.35」 |
| 7 | 女性 60% 以上的樣本 | g+ = 0.07（SE 0.04，CI −0.01–0.15），k = 47，N = 2,542，**不顯著**，I² 58.02 | Table 3；L1562–1564 | 「Dynamic visualizations were associated with statistically significant effect sizes for studies that had 59% or less females (g+ = 0.36), but not for studies with 60% or more females (g+ = 0.07).」 |
| 8 | 空間能力：組間 | QB(3) = 3.32，p = 0.34（不顯著） | Table 3 | 「Total between 3.32 3 0.34」 |
| 9 | 沒量空間能力 | g+ = 0.23*（SE 0.03，CI 0.17–0.29），k = 63，N = 4,269 | Table 3；L1576 | 「most of the studies in our metaanalysis (k = 63, 77% of the total effects) did not measure any spatial ability」 |
| 10 | 空間能力對動態、靜態都有幫助 | g+ = 0.30*（SE 0.09，CI 0.13–0.47），k = 9，N = 552 | Table 3 | 「All (static and dynamic) 552 9 0.30* 0.09 0.13 0.47 9.55 8 0.30 16.20」 |
| 11 | 空間能力只對靜態有幫助 | g+ = 0.20（SE 0.12，CI −0.03–0.43），k = 5，N = 287，不顯著 | Table 3 | 「Static only 287 5 0.20 0.12 − 0.03 0.43 4.26 4 0.37 6.17」 |
| 12 | 沒幫助或沒報告 | g+ = 0.06（SE 0.11，CI −0.15–0.27），k = 5，N = 366，不顯著 | Table 3 | 「None/not reported 366 5 0.06 0.11 − 0.15 0.27 2.20 4 0.70 0.00」 |
| 13 | 沒有任何研究發現空間能力只對動態有幫助 | — | L1582–1583 | 「We could not find any study in which spatial ability helped to learn only from dynamic presentations.」 |
| 14 | 教育階段：組間 | QB(4) = 11.47，p = 0.02 | L1595–1596 | 「The between-levels difference of educational level was statistically significant, QB(4) = 11.47, p = 0.02.」 |
| 15 | 小學 | g+ = 0.53*（SE 0.14，CI 0.25–0.80），k = 7，N = 199 | Table 3 | 「Elementary school 199 7 0.53* 0.14 0.25 0.80 5.96 6 0.43 0.00」 |
| 16 | 國中 | g+ = 0.44*（SE 0.10，CI 0.25–0.64），k = 8，N = 423 | Table 3 | 「Middle school 423 8 0.44* 0.10 0.25 0.64 11.26 7 0.13 37.81」 |
| 17 | 國中＋高中 | g+ = 0.38（SE 0.24，CI −0.08–0.84），k = 1，N = 72，不顯著 | Table 3 | 「Middle + high school 72 1 0.38 0.24 − 0.08 0.84 0.00 0 1.00 0.00」 |
| 18 | 高中 | g+ = 0.12（SE 0.18，CI −0.22–0.46），k = 3，N = 130，不顯著 | Table 3 | 「High school 130 3 0.12 0.18 − 0.22 0.46 2.41 2 0.30 17.00」 |
| 19 | 大學 | g+ = 0.19*（SE 0.03，CI 0.13–0.25），k = 63，N = 4,650，I² 72.01 | Table 3；L1596–1598 | 「the dynamic visualizations were more effective for elementary school students (g+ = 0.53), than for middle school students (g+ = 0.44), than for university students (g+ = 0.19).」 |

### 介入特徵（Table 4，原檔 L1615–1815；PDF 第 16 頁）

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 20 | 任務類型：組間 | QB(1) = 0.56，p = 0.45（不顯著） | Table 4；L1605–1606 | 「without between-levels significant differences」 |
| 21 | STEM | g+ = 0.24*（SE 0.03，CI 0.18–0.30），k = 60，N = 4,380 | Table 4 | 「STEM 4380 60 0.24* 0.03 0.18 0.30 164.43 59 < 0.001 64.12」 |
| 22 | 操作程序類 | g+ = 0.18*（SE 0.06，CI 0.06–0.31），k = 22，N = 1,094 | Table 4 | 「Manipulative–procedural 1094 22 0.18* 0.06 0.06 0.31 87.65 21 < 0.001 76.04」 |
| 23 | 學習領域：組間 | QB(5) = 12.95，p = 0.02 | L1817–1818 | 「the between-levels difference was statistically significant, QB(5) = 12.95, p = 0.02」 |
| 24 | STEM：生物與醫學（B） | g+ = 0.27*（SE 0.05，CI 0.17–0.36），k = 11，N = 1,866，I² 0.00 | Table 4 | 「STEM (B) 1866 11 0.27* 0.05 0.17 0.36 9.86 10 0.45 0.00」 |
| 25 | STEM：物理與化學（P） | g+ = 0.19*（SE 0.06，CI 0.06–0.31），k = 23，N = 1,017 | Table 4 | 「STEM (P) 1017 23 0.19* 0.06 0.06 0.31 41.68 22 0.01 47.22」 |
| 26 | STEM：地質與其他科學（G） | g+ = 0.38*（SE 0.09，CI 0.21–0.55），k = 11，N = 565，I² 85.33 | Table 4 | 「STEM (G) 565 11 0.38* 0.09 0.21 0.55 68.15 10 < 0.001 85.33」 |
| 27 | STEM：科技、工程、數學（T；程式邏輯、機率題例題、比例題例題、圖形與方程式轉換都歸這類） | g+ = 0.15*（SE 0.07，CI 0.02–0.28），k = 15，N = 932 | Table 4；Table 2 的 T 類題目 | 「STEM (T) 932 15 0.15* 0.07 0.02 0.28 39.28 14 < 0.001 64.36」 |
| 28 | 操作程序：課綱內（S；急救包紮、寫漢字假字、引擎故障排除） | g+ = 0.01（SE 0.09，CI −0.17–0.19），k = 8，N = 523，**不顯著** | Table 4 | 「Manipulative–proc. (S) 523 8 0.01 0.09 − 0.17 0.19 24.94 7 < 0.001 71.93」 |
| 29 | 操作程序：課綱外（NS；打結、摺紙、樂高、玩具組裝） | g+ = 0.34*（SE 0.09，CI 0.17–0.51），k = 14，N = 571 | Table 4；L1821 | 「nonsyllabi (g+ = 0.34) was significantly higher than syllabi (g+ = 0.01)」 |
| 30 | 比較時用的媒體：組間 | QB(1) = 20.74，p < 0.001 | L1829–1830 | 「The between-levels difference was statistically significant, QB(1) = 20.74, p < 0.001.」 |
| 31 | 同一種媒體（全部是電腦動態 vs 電腦靜態） | g+ = 0.26*（SE 0.03，CI 0.21–0.32），k = 75，N = 5,050 | Table 4；L1826–1827 | 「All studies on the same medium compared computer dynamic versus computer static visualizations.」 |
| 32 | **不同媒體（反向）** | g+ = −0.20*（SE 0.10，CI −0.39 至 −0.01），k = 7，N = 424；靜態組較好 | Table 4；L1831–1836 | 「for different media, the effects were in the opposite direction, showing that statics outperformed dynamic (g+ = − 0.20).」 |
| 33 | 不同媒體的 7 個比較來自哪裡 | 電視動態 vs 35 mm 幻燈片靜態（Swezey 等 1991，1 個，−0.05）；電腦動態 vs 紙本靜態（Mayer 等 2005 四個實驗 −0.31、−0.50、−0.57、−0.64；Mayer 等 2007 兩個實驗 −0.17、0.21）。七個個別效果量在 Table 2 都沒打星號 | L1827–1829；Table 2 | 「Different media research involved either television dynamic versus 35 mm slide statics (Swezey et al. 1991) or computer dynamic versus paper statics (Mayer et al. 2005, 2007).」 |

### 方法特徵（Table 5，原檔 L1863–2016；PDF 第 17 頁）

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 34 | 是否報各組性別比：組間 | QB(1) = 0.06，p = 0.80（不顯著）；沒報 g+ = 0.23*（k = 64，N = 4,177）、有報 g+ = 0.21*（k = 18，N = 1,297） | Table 5；L1848–1853 | 「dynamic visualizations produced statistically significant benefits over static presentations regardless of whether studies reported gender distributions for every compared group (g+ = 0.21) or not (g+ = 0.23).」 |
| 35 | 是否有前測：組間 | QB(1) = 1.64，p = 0.20（不顯著）；沒前測 g+ = 0.19*（SE 0.04，CI 0.12–0.27，k = 32，N = 2,796）、有前測 g+ = 0.26*（SE 0.04，CI 0.18–0.34，k = 50，N = 2,678） | Table 5；L1854–1857 | 「dynamic presentations produced statistically significant differences over statics regardless of if pretests were used (g+ = 0.26) or not (g+ = 0.19).」 |
| 36 | 是否報測驗信度：組間 | QB(1) = 13.77，p < 0.001；沒報 g+ = 0.12*（SE 0.04，CI 0.04–0.20，k = 51，N = 2,668，I² 72.97）、有報 g+ = 0.32*（SE 0.04，CI 0.25–0.40，k = 31，N = 2,806，I² 44.34） | Table 5；L1861–L2022 | 「in studies that reported reliability of their learning test, dynamic presentations were associated with higher weighted mean effect size (g+ = 0.32) and were significantly different than studies that did not report reliability of their outcome measures (g+ = 0.12).」 |

### 發表偏誤（L2024–2040）

| # | 結果 | 數字 | 原文一句 |
|---|---|---|---|
| 37 | 漏斗圖 | 作者說對稱（**圖沒有附在文中**） | 「the funnel plot … showed a symmetrical distribution around the weighted mean effect.」 |
| 38 | Egger 迴歸 | p = 0.42 | 「clearly showing the absence of publication bias (p = 0.42)」 |
| 39 | 傳統 fail-safe N | 974 篇 | 「974 additional qualified studies would be required to invalidate the overall effect size found in this meta-analysis.」 |

### 與前人統合的對照、以及作者怎麼解讀（Discussion，L2042–2179）

- 作者把自己的 0.23 與 Höffler 與 Leutner 2007（26 篇、76 個比較，d = 0.37）、Berney 與 Bétrancourt 2016（61 篇、140 個比較，g+ = 0.23）並列，說方向一致（L2049–2054）。
- **性別的解讀與納入研究裡唯一一篇直接操弄性別的研究方向相反**：L2069–2076「males may benefit more from dynamic visualizations than females. This is opposite to the single study included in this metaanalysis in which gender was an independent variable (Wong et al. 2015) … static visualizations were more beneficial for males, and dynamic presentations were more beneficial for females (not reported here).」作者說方向「warrants further investigations」。性別這個調節變項是研究層級的樣本女性比例（中位數切半），不是個人層級的比較。
- 教育階段：年級越高效果越小，作者說這不在預期內（L2103「this lower effect for more adult students was not predicted」）。
- 媒體：作者的解讀是螢幕媒體可能不如紙本或幻燈片，並引 Delgado 等 2018 的紙本閱讀統合（L2146–2149）；同時承認 k = 7 太少（L2151–2152「hinders reaching a strong conclusion」）。
- 信度：作者把「有報信度的研究效果較大」解讀成令人放心的結果（L2174–2176）。
- 任務類型：Höffler 與 Leutner 2007 在程序動作知識上得到 d = 1.06，本篇操作程序類只有 0.18，作者歸因於兩篇對任務的定義不同（L2122–2127）。

## 作者自己列的限制（L2181–2195）

1. 納入標準嚴（尤其第 9 條要求報性別比），很多有空間能力測量的動態對靜態研究因此被排除。前文也寫到 48 篇研究「除了沒報性別比之外全部符合」而被排除（L355–356）。
2. **沒有分析其他調節變項，點名的有寫實程度與互動功能**：L2187–2189「we did not consider other moderating variables, such as level of realism, interaction features, and similar variables that are known to affect learning from visualizations」。
3. 大學樣本來自很多不同科系，沒有分科系比較。
4. 散在正文裡的保留：空間能力的結論要小心，因為多數研究沒量（L1586–1587、L2094–2096）；不同媒體的結論要小心，因為研究少（L1840–1841）。

原文**沒有**把下列幾點列為限制（是我讀的時候注意到的，不是作者說的）：只收英文同儕審查期刊論文；沒有交代固定或隨機效果模型；沒有編碼測驗是立即或延宕；「靜態依序呈現」被算進動態組；不同媒體那 7 個比較裡，Mayer 等 2005 的題目是「annotated illustrations versus narrated animations」（L2384–2386 參考文獻），除了媒體不同，文字是印的還是用講的也不同。

## 與摘要說法不一致的地方

- 摘要寫「the dynamic visualizations were more effective on samples with less females and more males (g+ = 0.36)」，沒有寫另一半：女性 60% 以上的樣本 g+ = 0.07、不顯著（Table 3）。也沒有寫納入研究中唯一直接比較性別的 Wong 等 2015 方向相反（L2069–2074）。
- 摘要寫「educational level, learning domain, media compared, and reporting reliability measures moderated the results」，與 Table 3–5 的組間檢定相符；沒寫的是不同媒體時方向反過來（g+ = −0.20）。
- 正文內部一處數字不一致：L1603–1604 寫「manipulative–procedural tasks were less represented (k = 22, 17%)」，但 L372 與 Fig. 1 寫的是 27%，22/82 也是 27%；17% 應是筆誤（17% 是下一段課綱外任務 k = 14 的比例）。
- 其餘摘要數字（46 篇、82 個效果量、5,474 人、g+ = 0.23）逐項對過，與正文與表相符。

## 與清單「要撐的結論」不合的地方

清單寫的是「動態對靜態平均只多一點；沒有分析互動功能」。

- **「平均只多一點」撐得住**：g+ = 0.23，作者自己稱 small。要連著寫的條件：46 篇隨機分派實驗、1990–2017 年英文期刊論文、77% 的比較是大學生、成果是各研究自己的學習測驗、異質性高（I² = 68%）。大學生子集是 0.19；女性過半的樣本是 0.07、不顯著。
- **「沒有分析互動功能」撐得住**，而且是作者自己在限制裡寫的（L2187–2189）。但要小心一點：這不等於「納入的研究都沒有互動」。納入名單裡有題目就是談互動的研究（Patwardhan 與 Murthy 2015「When does higher degree of interaction lead to higher learning in visualizations?」，g = −0.39，不顯著），互動功能有沒有、有多少，本篇完全沒編碼。所以這篇只能用來說「動態對靜態」，不能拿來說互動有沒有用。
- **不要把這篇和 Berney 與 Bétrancourt 2016 算成兩份獨立證據**。本篇有 8 篇納入研究是從 Berney 2016 等三篇統合的參考文獻補來的（L364–367），兩篇的納入名單大量重疊；兩篇整體效果都是 0.23 不算獨立複製。兩篇定義也不同：Berney 排除影片、只收解說型動畫，本篇收影片與操作程序任務。對照見 `berney2016.md`。
- 清單沒提、但寫文章時可能會誤用的三點：(a) 這篇的「動態」包含依序出現的靜態圖；(b) 作者的主題是性別，而性別結論是研究層級的相關，且與唯一的直接比較相反，不宜引成「男生比較適合動畫」；(c) 不同媒體時靜態勝出（−0.20，k = 7）是「電腦或電視的動態 vs 紙本或幻燈片的靜態」，作者自己說不能下強結論。

## 讀取紀錄

依序讀過原檔全部 2,530 行，區間首尾相接：

| 區間 | 內容 |
|---|---|
| L1–60 | 首頁、摘要、前言開頭 |
| L60–699 | 前言其餘、調節變項的理論背景、Table 1、研究問題與假設、方法（納入標準、檢索、篩選、效果量、資料分析）、結果開頭、Table 2 第一頁 |
| L700–1399 | Table 2 第二、三頁與表註、Table 3 開頭 |
| L1400–2039 | Table 3 其餘、整體效果、受試者／介入／方法三組調節結果、Table 4、Table 5、發表偏誤 |
| L2039–2530 | 討論、限制與未來方向、結論、致謝與聲明、參考文獻（掃過，用來核對納入研究的題目）、作者單位 |

對過 PDF 版面的圖表：Fig. 1（第 8 頁）、Fig. 2（第 10 頁）、Table 2 前兩頁（第 11、12 頁）、Table 3（第 14 頁，`-layout`）、Table 4（第 16 頁，`-layout`）、Table 5（第 17 頁，`-layout`）。Table 1 是三列的理論觀點對照表，只讀 `.txt`，沒對版面。Table 2 第三頁（第 13 頁）沒對版面。漏斗圖原文沒附。

## 附記：與 Berney 與 Bétrancourt 2016 重疊的研究（2026-10-14 補）

2026-10-14 對照 `berney2016.md`（該紀錄「與清單『要撐的結論』不合的地方」一節列出的兩邊都有的研究）數出。這些研究兩份統合分析都收，作者姓氏也在兩份原文檔（`castro-alonso2019.txt`、`viz-berney2016.txt`）各搜得到；這不是逐篇比對兩份完整納入名單的結果，實際重疊可能更多。共 14 篇：

1. Adesope 與 Nesbit 2013
2. Mayer 等 2005
3. Mayer 等 2007
4. Kalyuga 2008
5. Lewalter 2003
6. Lin 與 Atkinson 2011
7. Münzer 等 2009
8. Paik 與 Schraw 2013
9. Park 與 Gittelman 1992
10. Rieber 1991
11. Scheiter 等 2006
12. Thompson 與 Riding 1990
13. Wong 等 2009
14. Wu 與 Chiang 2013

另外，本篇有 8 篇是從 Berney 與 Bétrancourt 2016 等三份統合分析的參考文獻補來的（L364–367）。

補記（2026-10-14 複審）：審稿者另用兩份原文參考文獻裡標星號的納入研究交叉比對，作者、年份、題名都對上的同樣是這 14 篇（Rieber 1990 在兩邊是不同論文，不算）。部分參考文獻跨行沒有解析到，所以仍寫「至少」。
