# 抽取紀錄：Radkowitsch、Vogel、Fischer 2020，International Journal of Computer-Supported Collaborative Learning 15:5–47（doi 10.1007/s11412-020-09316-4）

- **完整書目**：Anika Radkowitsch, Freydis Vogel & Frank Fischer (2020). Good for learning, bad for motivation? A meta-analysis on the effects of computer-supported collaboration scripts. *International Journal of Computer-Supported Collaborative Learning*, 15, 5–47. https://doi.org/10.1007/s11412-020-09316-4。收稿 2019-09-08、接受 2020-03-06、線上刊出 2020-04-16（原文檔 L14）。作者名對過首頁（L12、PDF p.5）。
- **版本**：刊出版，CC BY 4.0（L388；Projekt DEAL 開放取用，L292）。
- **原文檔**：`.research/raw/learning-content/q5-social/radkowitsch2020-scripts.md`（430 行、144,544 字元；檔頭記 URL Source 為 https://link.springer.com/content/pdf/10.1007/s11412-020-09316-4.pdf，即出版者開放取用 PDF，經 Jina reader 轉文字）。
- **對表用的 PDF**：LMU 機構典藏 https://epub.ub.uni-muenchen.de/73069/1/Radkowitsch2020_Article_GoodForLearningBadForMotivatio.pdf（Unpaywall 列為 LMU 典藏；檔內是出版者版面，43 頁）。Springer 直連被 JS challenge 擋，改用典藏。PDF 只存在 scratch，未存回 raw 目錄（raw 的 md 是完整的，只拿 PDF 對表）。
- **讀取日期**：2026-10-14
- **供哪幾篇 order 使用**：order 20（清單 F 第 20#3 列）；清單註明 order 11 談鷹架時可引。與 `vogel2017.md` 對照看重疊。

## 研究設計

- **類型**：隨機效果統合分析，只收（準）實驗研究（L90、L94）。
- **比較對象**（L90）：有 CSCL 腳本的協作 vs **沒有腳本的協作**（unguided／unstructured collaborative learning）。明文排除：兩種腳本互比、腳本對其他教學法（例如範例學習）、腳本對個人學習、對等待組（L90「Comparisons of two different CSCL scripts (e.g., Rummel et al. 2009), comparisons of CSCL scripts with other instructional means such as example-based learning (e.g., Rummel and Spada 2005), with individual learning (e.g., Peterson and Roseth 2016), or with waiting conditions were not considered」）。**所以這篇不回答「協作 vs 一個人學」**。
- **腳本的定義**（L90）：鷹架必須針對至少兩名學習者的協作過程，至少有一項活動要求學習者對夥伴說話；只靠分發教材隱性分派角色、沒有其他協作鷹架的不算。
- **依變項**（L94）：動機（以自我決定論或期望價值模型為本的自陳問卷；負向分量表反轉）、領域學習（分回憶測驗、應用測驗、混合測驗，L112–114）、協作技能（分協商、資訊分享、協調、混合，L116）。依變項都須在處理之後、獨立於處理量測；介入中的表現不算。
- **情境**：電腦支援、至少兩人一組（L94）。
- **出版條件**：只收英文、同儕審查期刊；排除研討會論文（L94）。
- **檢索**（L98–102）：2017 年 4 月與 2020 年 1 月兩輪，ERIC 與 Web of Science，加滾雪球。第一輪沿用 Vogel 等 2017 的檢索詞與納入條件，「all studies that were excluded during the literature search of Vogel et al. (2017), were also excluded」（L102），得 41 篇；第二輪（2017 年以後）再得 12 篇文章。標題摘要編碼 Kappa = .86；第一輪滾雪球的全文編碼 Kappa = 0.60（L102）。
- **樣本**（L106）：52 篇文章 56 個研究，刪掉 3 個重複資料的研究後為 **49 篇文章、53 個研究、5,616 人**（每研究 M = 102.3，SD = 118.5）；2000–2020 年；年齡 6–64 歲；高教 36 個研究、中小學 16、專業訓練 1；自然科學 17、社會科學 16、資訊 7、人文 4、醫學 3、其他 6。
- **編碼**（L112）：第一輪兩位作者雙重編碼 30%，其餘各編一半並互相檢查；第二輪全部雙重編碼。各研究的編碼與效果量見附錄 Table 4（正文寫 Table A4），共現次數見 Table 5（正文寫 Table A5）。
- **統計**（L124–128）：Hedges' g；逆變異數加權隨機效果模型；同一樣本多個結果或多個實驗組共用對照組時合成一個效果量；Q 與 I²；類別調節變項以 meta-regression 檢定；出版偏誤用 trim-and-fill 與三參數選擇模型（3PSM）。R 3.6.2、metafor。效果量大小以 Cohen 1988 判讀（0.20–0.49 小、0.50–0.79 中、≥ 0.80 大）。
- **何時量**：依變項取處理後量測；本篇沒有區分立即與延宕測驗做調節分析（Table 4 裡 Lee 2018 分列立即與延宕兩列，但沒有另外分析）。

## 結果（逐項）

表格數字都對過 PDF 版面（`pdftotext -layout`）。原文檔 md 把表格壓成一行，Table 1 的 p 值在 md 裡被黏成「8.073」，PDF 版面是 df = 8、p = .073。

### 動機（RQ1；Table 1，PDF p.18）

| # | 結果 | 數字 | 對照條件 | 節／表 | 位置 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 動機整體效果，不顯著 | g = 0.13（SE 0.07，95% CI −0.01 至 0.27），k = 9 個獨立效果（共 33 個效果） | 有腳本 vs 沒腳本的協作 | Results／Table 1 | L134–136、L151；PDF p.18 | 「the included studies reported 33 effects of CSCL scripts on motivation, of which 9 effects were independent. The analyses yielded a non-significant positive effect with a Hedges' g of 0.13」 |
| 2 | 動機異質性 | QB = 14.37，df = 8，p = .073；τ² = 0.018；I² = 42.77% | 同上 | Table 1 | L151；PDF p.18 | 「Summary Effect 9 0.13 0.07 −0.01 0.27 14.37 8 .073 0.018 42.77%」（照 PDF 版面） |
| 3 | 3PSM 校正 | g = 0.14（SE 0.10，CI −0.06 至 0.35，p = .17），與未校正無差（χ²(1) = 0.03，p = .86） | 同上 | Results | L136–140 | 「The 3PSM resulted in an adjusted Hedges' g of 0.14」 |
| 4 | trim-and-fill | 右側補 2 個研究，校正後 g = 0.16（SE 0.07，CI 0.01 至 0.31，p = .03），顯著 | 同上 | Results／Fig. 1a | L140 | 「These results indicate that CSCL scripts do not negatively affect motivation and that the results might be underestimated due to publication bias.」 |
| 5 | 個別研究型態（質性） | 報告動機的研究都是不顯著或顯著正向，沒有顯著負向；不顯著的多是大學生、指定角色（tutor／tutee、記錄者）的腳本 | 同上 | Discussion RQ1 | L215 | 「the results showed a small positive but non-significant effect ... with all studies either reporting non-significant or significant positive effects」 |
| 6 | 介入時間長短與動機（質性比較，只有 5 個研究） | 長期介入有顯著正向（Taylor & Baek 2019）也有零效果（Peterson & Roseth 2016）；短期（60–80 分鐘）兩個都是零效果；一個沒報時長 | 同上 | Discussion RQ1 | L215–219 | 「the existing data does not allow for conclusions on how motivation is affected by CSCL scripts over time」 |

注意：Table 4 裡個別的動機效果量其實有負值（例如 Demetriadis 2011 一個分量表 −0.63、Weinberger 2005 Study 2 −0.65、Rummel 2009 −0.39、−0.21、Peterson & Roseth 同步組 −0.12 等，L301、L343、L348、L351、L374）。正文「all studies ... non-significant or significant positive」說的是研究層級的顯著性，不是每一個分量表都 ≥ 0。

### 領域學習（RQ2；Table 2，PDF p.20）

| # | 結果 | 數字 | 對照條件 | 節／表 | 位置 | 原文一句 |
|---|---|---|---|---|---|---|
| 7 | 領域學習整體 | g = 0.24**（SE 0.04，CI 0.16 至 0.33），k = 54 個獨立效果（共 124 個效果）；Q = 101.77，df = 53，p < .001；τ² = 0.040；I² = 46.23% | 有腳本 vs 沒腳本的協作 | Results／Table 2 | L144、L169 | 「the meta-analysis resulted in a small significant positive summary effect, with Hedges' g of 0.24」 |
| 8 | 回憶測驗 | g = 0.27**（SE 0.07，CI 0.14–0.40），k = 32；I² = 57.92% | 同上 | Table 2 | L144、L169 | 「Recall test 32 0.27** 0.07 0.14 0.40」 |
| 9 | 應用測驗 | g = 0.21**（SE 0.07，CI 0.08–0.34），k = 30；I² = 55.32% | 同上 | Table 2 | 同上 | 「Application test 30 0.21** 0.07 0.08 0.34」 |
| 10 | 混合測驗，不顯著 | g = 0.09（SE 0.12，CI −0.14–0.33），k = 3 | 同上 | Table 2 | 同上 | 「Mixed test 3 0.09 0.12 −0.14 0.33」 |
| 11 | 出版偏誤：3PSM | g = 0.21（SE 0.06，CI 0.08–0.33，p < .01），與未校正無差（χ²(1) = 0.37，p = .54） | 同上 | Results | L144–146 | 「The Likelihood Ratio Test yielded no significant difference between the adjusted and the unadjusted model」 |
| 12 | 出版偏誤：trim-and-fill | 左側補 2 個，g = 0.22（SE 0.04，CI 0.14–0.31，p < .01） | 同上 | Results／Fig. 1b | L146 | 「the results could have been slightly influenced by publication bias」 |

### 協作技能（RQ2；Table 3，PDF p.20）

| # | 結果 | 數字 | 對照條件 | 節／表 | 位置 | 原文一句 |
|---|---|---|---|---|---|---|
| 13 | 協作技能整體 | g = 0.72**（SE 0.14，CI 0.44–1.01），k = 23 個獨立效果（共 41 個）；Q = 102.26，df = 22，p < .001；τ² = 0.378；I² = 82.21% | 有腳本 vs 沒腳本的協作 | Results／Table 3 | L156、L179 | 「The meta-analysis resulted in a significant medium-sized positive summary effect of Hedges' g = 0.72.」 |
| 14 | 排除兩個離群研究（Stegmann 2012、Weinberger 2010）後 | g = 0.59**（SE 0.11，CI 0.36–0.81），k = 21；I² = 71.13% | 同上 | Table 3 | L156、L179 | 「The resulting significant positive summary effect without these studies was also of medium size (Hedges' g = 0.59).」 |
| 15 | 協商技能 | g = 0.59**（SE 0.17，CI 0.26–0.91），k = 10；I² = 69.55% | 同上 | Table 3 | L156、L179 | 「Negotiation skills 10 0.59** 0.17 0.26 0.91」 |
| 16 | 資訊分享技能 | 含離群 g = 0.92**（SE 0.28，CI 0.38–1.47），k = 12，I² = 88.67%；排除離群 g = 0.60**（SE 0.20，CI 0.21–1.00），k = 10 | 同上 | Table 3 | L161、L179 | 「For information sharing skills, the analyses resulted in a medium sized Hedges' g of 0.60 (outliers excluded).」 |
| 17 | 協調技能 | 沒有任何研究量（k = 0） | — | Table 3、Discussion | L179、L207 | 「Remarkably, no studies investigated the effect of CSCL scripts on coordination skills.」 |
| 18 | 混合技能 | g = 0.52*（SE 0.21，CI 0.11–0.93），k = 5 | 同上 | Table 3 | L161、L181 | 「Mixed skills 5 0.52* 0.21 0.11 0.93」 |
| 19 | 出版偏誤 | 3PSM：含離群 g = 0.76（CI 0.33–1.18）、排除離群 g = 0.62（CI 0.27–0.97），都與未校正無差；trim-and-fill 沒補任何研究 | 同上 | Results／Fig. 1c | L183–191 | 「These results indicate that CSCL scripts positively affect collaboration skills, with no evidence of publication bias.」 |

個別離群效果量（Table 4）：Weinberger 2010 資訊分享 g = 3.17（L377）；Stegmann 2012 資訊分享 g = 2.49（個人）、2.89（小組）（L356）；另有 Lin 2018 & Chen 2018 資訊分享 2.42、2.48（L339）與 Noroozi 2013c 協商 1.89、1.42（L341），這兩個沒有被當離群排除。

### 提示的協作活動數量（RQ3；Table 2、3）

| # | 結果 | 數字 | 對照條件 | 節／表 | 位置 | 原文一句 |
|---|---|---|---|---|---|---|
| 20 | 領域學習：活動數量不是顯著調節變項 | Q(5) = 3.19，p = .67；殘差異質性 Q(52) = 114.51，p < .01 | 提示一、二、三種活動的腳本互比（研究間） | Results | L195 | 「the effectiveness of CSCL scripts did not significantly depend on the number of different collaboration prompts」 |
| 21 | 領域學習各格 | 一種：回憶 0.25*（k = 11）、應用 0.44**（k = 10）；兩種：回憶 0.25（不顯著，CI −0.24–0.74，k = 5）、應用 0.17*（k = 7）；三種：回憶 0.16*（k = 13）、應用 0.25**（k = 12） | 同上 | Table 2 | L169 | 照 PDF 版面列 |
| 22 | 協作技能：活動數量不顯著 | 含離群 Q(2) = 2.87，p = .24；排除離群 Q(2) = 0.55，p = .76 | 同上 | Results | L195 | 「The effect of CSCL scripts on collaboration skills did not depend significantly on the number of collaborative activities prompted」 |
| 23 | 協作技能各格 | 一種 1.09**（k = 10；排除離群 0.71**，k = 8）；兩種 0.67**（k = 7）；三種 0.52**（k = 10） | 同上 | Table 3 | L181 | 「Descriptively, the results show that CSCL scripts prompting only one type of collaborative activity were most effective, followed by ... two and three」 |

### 特定活動組合（RQ4；只做領域學習，Table 2）

| # | 結果 | 數字 | 對照條件 | 節／表 | 位置 | 原文一句 |
|---|---|---|---|---|---|---|
| 24 | 組合不是顯著調節變項 | Q(6) = 5.84，p = .44；殘差 Q(54) = 100.75，p < .01 | 各組合互比（研究間） | Results | L203 | 「the effect of CSCL scripts did not depend significantly on the specific combination of collaborative activities」 |
| 25 | 各組合 | 只協商 0.22（不顯著，CI −0.02–0.47，k = 8）；只資訊分享 0.34*（k = 11）；只協調 0.46**（k = 3）；協商＋資訊分享 0.43**（k = 4）；協商＋協調 k = 2 未估計；資訊分享＋協調 0.15（不顯著，CI −0.01–0.30，k = 8）；三種都有 0.20**（k = 25） | 同上 | Table 2 | L169–171 | 「scaffolding coordination is most effective for enhancing domain learning ... while scaffolding only negotiation resulted in a non-significant effect size」 |
| 26 | 協作技能的組合分析沒做 | 研究數不夠 | — | Results | L199 | 「the number of studies did not allow for conducting a moderator analysis with such a large number of moderator levels」 |

### 作者的整體判讀

- 動機：「there is no meta-analytical evidence for an overscripting effect. Thus, this criticism remains a postulate without corresponding empirical evidence」（L221）；但結論段也寫「the existing empirical evidence might still not be enough to refute this criticism completely」（L283）。
- 協作技能效果「deeply heterogeneous」，領域學習的小效果「clearly stable」（L261）。
- 「in some cases less is more」（L245）；結論段改說法為「For collaboration skills ... less is more ... For domain learning, these effects were less clear」（L289）。
- 調節變項沒有實質降低異質性（L211、L289「the present meta-analyses failed to identify clear moderators explaining this variance」）。

## 作者自己列的限制（Limitations，L273–279）

1. 腳本的設計與情境差異極大（從一小時的個人論證訓練到數週的角色扮演），難以比較與彙整。
2. 檢索詞限制：沒用「support」，可能漏掉對話代理人這類動態支援的研究（舉 Wang 等 2011）；只收兩篇對話代理人研究。
3. 編碼只能依「腳本要求了什麼活動」，多數研究沒報告學習者實際做了什麼；描述詳略不一、學習者可能只是表面照做。
4. 量動機的研究很少，且動機的概念化五花八門（期望價值、內外在動機、自我決定論）。
5. 研究總數偏少，調節變項各層級的研究數常太少或分布不均，尤其協作技能與動機；同層級內仍高度異質。
6. 調節變項比較全是研究間比較，幾乎沒有研究內操弄，「cannot be interpreted causally」（L279）。
7. 結論段補充：大多數研究介入期很短（L241）。

## 與摘要說法不一致的地方

1. 摘要說協作技能是「medium positive effect (Hedges' g = 0.72)」（L18），Discussion 開頭寫成「a medium to large positive effect on learning collaboration skills」（L207），結論前一段又寫「the large positive effect on collaboration skills is deeply heterogeneous」（L261）。依作者自己採用的 Cohen 標準（L128），0.72 是中等。
2. 摘要說本篇「offers the first counterevidence against the wide-spread criticism that CSCL scripts have negative motivational effects」（L18）。實際證據是 k = 9 的不顯著小正效果（CI 下限 −0.01），作者在結論段自己承認證據不足以完全反駁（L283）。「counterevidence」的強度要照結論段的保留說法引用。
3. Discussion 說「Notably, on all levels CSCL scripts were more effective in fostering domain learning as measured by application tests compared to recall tests」（L145）。Table 2 的「兩種活動」那一層是回憶 0.25、應用 0.17，回憶較高，與「on all levels」不符；而且整體也是回憶 0.27 > 應用 0.21（作者在同段自己承認）。
4. Discussion 說「combining prompts for two or more types of collaborative activities led to lower effect sizes than only prompting one of these activities」（L245）。領域學習的組合分析裡，協商＋資訊分享（0.43）高於只協商（0.22）與只資訊分享（0.34）（Table 2）。作者在 L149–152、L265 自己有寫「combined scaffolding does not always lead to smaller effects」，所以 L245 那句是過度概括。另外活動數量與組合兩個調節變項都不顯著（p = .67、.44、.24、.76），「less is more」只是描述性趨勢。
5. 納入條件的舉例與實際納入名單有表面矛盾：方法節把 Rummel 等 2009、Rummel & Spada 2005、Peterson & Roseth 2016 舉為「不予考慮的比較」的例子（L90），但三篇都出現在附錄 Table 4 的納入研究裡（L231、L232、L343–351）。合理的解讀是只排除了這些論文裡不合格的對比、保留了「有腳本 vs 沒腳本協作」的對比，但原文沒有明講。這是我的判讀，不確定。
6. 正文寫附錄表為 Table A4、A5，附錄實際編號是 Table 4、5（L112 對 L294、L384）。小事。

## 與清單「要撐的結論」不合的地方

清單（F 20#3）：「有腳本比沒引導的協作：領域知識 g = 0.24、協作技能 0.72、動機 0.13 不顯著」。

- 三個數字都對（Table 1–3）。要補的限定：
  1. 對照組是「沒有腳本的電腦支援協作」，不是一個人學。若 order 20 的主題是「一個人讀少了什麼」，這篇只能撐「協作有沒有加結構」，不能撐「協作勝過獨學」。
  2. 「領域知識」原文是 domain learning，含回憶與應用測驗；回憶 0.27、應用 0.21。
  3. 協作技能 0.72 異質性極高（I² = 82%），排除兩個離群研究後是 0.59；作者自己說這個效果「deeply heterogeneous」。
  4. 動機 0.13 只有 9 個獨立效果；trim-and-fill 校正後反而是顯著的 0.16。寫「不顯著」對，但不能寫成「證明腳本不傷動機」，作者自己保留。
  5. 樣本限於英文同儕審查期刊、電腦支援情境、2000–2020，高教為主（36/53）。

## 讀取紀錄

- 原文檔依序讀完：L1–L60（檔頭、摘要、引言到研究問題、納入條件前半）→ L60–L128（納入條件後半、檢索、樣本、編碼、統計）→ L130–L203（結果全文與 Table 1–3）→ L205–L289（討論、限制、結論）→ L291–L384（致謝、附錄 Table 4 全表、Table 5）→ L388–L430（授權聲明、參考文獻掃過、檔尾）。讀的是 scratch 裡每 1,500 字元折行、保留原行號的副本（294 個折行段，首尾相接涵蓋全檔）。
- 對 PDF 版面：Table 1（PDF p.18）、Table 2、Table 3（PDF p.20）、Table 5（PDF p.40）用 `pdftotext -layout` 逐列對過。Table 4 的個別效果量只在上面引用了幾個離群值與負值，引用者用前請再對一次 PDF p.32–39。
- Fig. 1（漏斗圖）是圖，md 沒有內容，沒有讀。

## 納入研究名單（供與 Vogel 2017 對照）

附錄 Table 4 列 53 個研究（L295–381）：Adamson 2014 S4；Belland 2011；Bouyias & Demetriadis 2012；Cáceres 2018；Chen & Chiu 2016；Chiu 2013；Cho & Jonassen 2002；Choi 2005；Demetriadis 2011；Ertl 2006 S2、S3；Ertl 2008；Gelmini-Hornsby 2011；Gijlers & de Jong 2009；Gijlers 2013；Haake & Pfister 2010；Hron 2000；Hsu 2015；Huang 2012；Kollar 2007；Kollar 2014；Lee 2015；Lee 2018；Lin 2020；Lin 2018 & Chen 2018；Mende 2017；Noroozi 2013b；Noroozi 2013c；Peterson & Roseth 2016；Puhl 2015；Rau 2017；Rienties 2012；Rummel & Spada 2005；Rummel 2009；Rummel 2012；Schellens 2007；Scheuer 2014；Schmitt & Weinberger 2019；Stegmann 2007；Stegmann 2012；Taylor & Baek 2019；Tsovaltzi 2014；Tsovaltzi 2015 S1、S3；Ulicsak 2004；van Aalst & Chan 2007 S2、S3；van Dijk 2014；Vogel 2016；Weinberger 2005 S1、S2；Weinberger 2010；Wu 2019。重疊比對見 `vogel2017.md`。
