# 抽取紀錄：Belland、Walker、Kim、Lefler 2017，Review of Educational Research 87(2), 309–344

## 檔頭

- **書目**：Brian R. Belland、Andrew E. Walker、Nam Ju Kim、Mason Lefler（四人皆 Utah State University）。〈Synthesizing Results From Empirical Research on Computer-Based Scaffolding in STEM Education: A Meta-Analysis〉。*Review of Educational Research*, 87(2), 309–344。線上刊出 2016-10-10，期號日期 2017 年 4 月。DOI 10.3102/0034654316670999。PMID 28344365，PMCID PMC5347356。作者姓名對過 XML 的 `<contrib>` 與文末 Authors 小傳。
- **原文檔**：`.research/raw/learning-content/q3-activity/belland2017_PMC5347356.xml`（142 行、220,267 位元組，JATS XML）。
- **本次另存**（同目錄）：
  - `belland2017_PMC5347356.txt`：把上面 XML 去標籤轉成的純文字，358 行、106,417 位元組。**下面的行號一律指這個檔。**
  - `belland2017_figs/`：Figure 1–13 的 JPG，共 13 張。來源網址 `https://cdn.ncbi.nlm.nih.gov/pmc/blobs/7d14/5347356/<雜湊>/10.3102_0034654316670999-figN.jpg`，路徑取自 XML 內的 `cloudpmc-path` 註記。**所有調節變項的 n 與 ḡ 都只印在圖裡，XML 內文沒有，所以原 XML 不看圖是不完整的。**
- **讀取日期**：2026-10-14
- **版本**：刊出版（PMC 收的 SAGE 開放取用版，CC BY-NC 3.0；XML 帶卷期頁碼）。PMC 的 PDF 與 Europe PMC 的 PDF 都被 Cloudflare 擋下，沒有拿到 PDF，圖是逐張從 PMC 的圖檔位址取的。
- **沒有拿到的部分**：Supplementary Table S1（144 篇納入研究的書目）與 S2（每個 outcome 的編碼結果），原文說在期刊線上版（L116）。沒有試取。所以「哪幾篇有撤鷹架」這類逐篇資訊這份紀錄答不了。
- **供哪幾篇 order 使用**：order 11（結論 11-d）。

## 研究設計

- **類型**：統合分析，隨機效果模型（L91）。STATA 14 的 metan 套件。效果量 Hedges' g，用 ESFREE 線上工具算，能用前測的就用（ANCOVA F、前後測改變分數）（L44）。
- **研究問題**六個（L33）：整體效果；學習者特徵（教育階段、族群）；鷹架使用情境；評量層級；鷹架特徵（變化、變化依據、範圍、介入類型）；研究品質（設計、信度報告、效度報告）。
- **檢索**（L36、Figure 1）：資料庫（Education Source、PsychINFO、Digital Dissertations、CiteSeer、Proquest、ERIC、PubMed、Academic Search Premier、IEEE、Google Scholar），檢索詞 scaffold*、computer*、tutor*、intelligent tutoring system*、cognitive tutor* 的組合；六本期刊手動檢索；納入研究的參考文獻。Figure 1：總共 k = 7,479（資料庫 5,415、期刊 1,613、轉介 451）→ 預篩排除 6,442 → 合格 1,037 → 第一輪編碼排除 890 → 分析階段再排除 3（離群值）→ 144 篇、333 個 outcome。
  - Figure 1 第一輪排除理由與篇數：沒有控制組 190、資訊不足以算效果量 133、非 STEM 127、不符 Wood 等 1976 的鷹架定義 104、各組鷹架太相似 93、活動不以結構不良問題為中心 66、重複 47、沒有認知成果 42、沒有電腦互動或電腦鷹架 41、鷹架或問題描述不足 23、各組做不同任務 16、鷹架以評量形式給 8。（這幾項加起來 890。）
- **納入標準**（L42）：(a) 1993-01-01 到 2014-12-31 發表；(b) 有控制組，控制組「received an educational intervention but did not receive scaffolding」；(c) 量認知成果；(d) 資訊足以算效果量；(e) 提供的協助符合 Wood、Bruner、Ross 1976 的鷹架定義；(f) 學習者在做結構不良的 STEM 問題（至少具備四種結構不良特徵之一）。
  - 文末補充：介入如果在學習者接觸問題**之前**就給，或不合定義，排除（L211）。
- **受試者**：原文沒有報告總人數。教育階段依 outcome 數：小學 28、國中 108、高中 53、大學（含技職）132、研究所 11、成人 1（Figure 3）。地點沒有報告。
- **比較對象**：有電腦鷹架 vs 做同樣的問題導向教學但沒有鷹架。**不是**「撤鷹架 vs 不撤」的組內比較；鷹架變化的比較是把不同研究分成子群互比（跨研究比較）。
- **量了什麼**：認知成果的測驗，依 Sugrue 1995 分成 concept（回想、理解）、principles（預測假設情境）、application（用到新問題）三層（L30、L50–52）。原文沒有報告測驗離介入多久、有沒有延宕測驗。
- **編碼**（L72–89）：四位編碼者，每篇兩人獨立編（一位教授配一位研究生），再取共識。共識前的 Krippendorff's alpha（Table 1）：評量層級 .677、使用情境 .731、教育階段 .975、族群 .875、效果量計算 .995、信度報告 .697、鷹架變化 .758、鷹架介入 .716、鷹架依據 .704、鷹架範圍 .707、研究設計 .798、效度報告 .735。作者說門檻是 .667（L74）；評量層級只高出門檻 .010。
- **鷹架變化的定義**（L57–59）：None（整段介入中頻率與性質都不變）、Fading（只往減少走）、Adding（只往增加走，例子是學生按提示鈕）、Fading/Adding（兩個方向都有，例子是 SE-Coach 依學生模型調整）。看的是「頻率或間隔」與「鷹架性質」兩種變化。
- **鷹架依據（logic）的定義**（L60–63）：Performance-adapted（依表現）、Self-selected（學生自己要）、Fixed（設計時就排定時點）、None。
- **相依性處理**（L113）：79 篇有多個處理組、37 篇有多個評量層級，控制組平均被用在 2.3 個比較裡。先把同一研究裡所有編碼相同的 outcome 合成，515 → 333；再用 robust variance estimation 試 rho 0 到 1，說估計不變，所以把 333 個 outcome 當獨立報告。
- **離群值**（L94、L99）：5 個 outcome（z > 3.0 或 g ≥ 2.34）連同所屬 3 篇研究排除，338 → 333、147 → 144。作者說其中 4 個是讓控制組在沒有任何支援下解複雜問題。

## 結果（逐項）

對照條件：除非另註，每一列都是「有電腦鷹架 vs 沒有鷹架」，各列是不同研究子集（跨研究比較）。n 是 outcome 數，不是研究數也不是人數。**ḡ 與 n 取自圖檔；圖只畫信賴區間的菱形，沒有印 CI 的數字，所以下面沒有 CI 數值。** 原文也沒有報告任何調節變項的組間 Q 值，只給成對的 z。

### 整體

| # | 結果 | 數字 | 節／圖 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 整體效果 | ḡ = 0.46，n = 333（144 篇）；z = 18.19，p < .01 | Results；Figure 3 的 Overall 列；摘要 | L10、L117 | 「The overall mean effect size (see Figure 3) is greater than 0 at a statistically significant level, z = 18.19, p < .01」 |
| 2 | 異質性 | Q = 1096.96，I² = 69.7%，p < .01 | Results | L117 | 「a test for heterogeneity (Q = 1096.96, I2 = 69.7%, p < .01) indicates differences between effect size estimates」 |
| 3 | 換成百分等級 | 第 50 → 第 68 百分等級 | Discussion | L183 | 「On average, the use of computer-based scaffolding would bring students who were at the 50th percentile to the 68th percentile」 |
| 4 | 出版偏誤：Egger | 係數 0.336，SE 0.242，n = 333，t = 1.390，p = .166，95% CI −0.141 到 0.812 | Table 2 | L100–111 | 「we conducted a follow-up Egger's regression test and found no evidence of publication bias」（L99） |
| 5 | 出版偏誤：trim-and-fill | 沒有給數字 | Publication Bias | L99 | 「there was no significant difference between observed and adjusted effect sizes」 |

整體效果的 95% CI 原文沒有用數字寫出來（摘要、內文、結論都只有 0.46）。

### 鷹架變化與依據（11-d 直接相關）

| # | 結果 | 數字 | 節／圖 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 6 | 鷹架變化：None | ḡ = 0.45，n = 216 | Figure 7 | L144 | 「In 64.9% of included outcomes, scaffolding did not change over time.」 |
| 7 | 鷹架變化：Adding | ḡ = 0.46，n = 62 | Figure 7 | — | 圖列 |
| 8 | 鷹架變化：Fading | ḡ = 0.62，n = 12（菱形最寬，右端超過 0.8 刻度） | Figure 7 | — | 圖列 |
| 9 | 鷹架變化：Fading/Adding | ḡ = 0.50，n = 43 | Figure 7 | — | 圖列 |
| 10 | 鷹架變化：組間 | 不顯著，只寫 p > .05，沒有檢定統計量 | Results | L144 | 「Hedges' ḡ estimates were significantly greater than zero across scaffolding customization types (see Figure 7). Differences among effect size estimates were not statistically significant, p > .05.」 |
| 11 | 有撤鷹架的比例 | 16.5%（＝Fading 12 ＋ Fading/Adding 43 ＝ 55／333；單純 Fading 是 12／333 ＝ 3.6%，這個拆法是我照圖算的） | Discussion | L187 | 「Only 16.5% of the 333 outcomes in this study included fading, confirming the dearth of this strategy in scaffolding studies」 |
| 12 | 有變化的多半是智慧家教系統 | 沒有數字 | Discussion | L187 | 「Most studies that did include fading, adding, or fading and adding involved intelligent tutoring systems.」 |
| 13 | 鷹架依據：Fixed | ḡ = 0.62，n = 13 | Figure 8 | — | 圖列 |
| 14 | 鷹架依據：None | ḡ = 0.45，n = 216 | Figure 8 | — | 圖列 |
| 15 | 鷹架依據：Performance-adapted | ḡ = 0.47，n = 63 | Figure 8 | — | 圖列 |
| 16 | 鷹架依據：Self-selected | ḡ = 0.45，n = 41 | Figure 8 | — | 圖列 |
| 17 | 鷹架依據：組間 | 不顯著，p > .05 | Results | L144 | 「There were no differences in effect size on the basis of scaffolding logic, p > .05.」 |
| 18 | 與作者自己的先導統合分析方向不同 | 先導研究：不撤的效果量較高 | Discussion | L187；L28 | 「This finding differs from our pilot meta-analysis work, in which studies that did not fade scaffolding had higher effect sizes than studies that did fade scaffolding (Belland et al., 2015).」 |

### 鷹架範圍與介入類型

| # | 結果 | 數字 | 節／圖 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 19 | Generic（不含內容） | ḡ = 0.48，n = 60 | Figure 9 | — | 圖列 |
| 20 | Specific（含內容） | ḡ = 0.46，n = 273（82%） | Figure 9 | L144、L190 | 「Scaffolding associated with the vast majority of outcomes (82%) was context-specific.」 |
| 21 | 範圍：兩者互比 | z = −0.281，p = .778，不顯著 | Results | L144 | 「the two strategies were not significantly different from each other, z = −0.281, p = .778.」 |
| 22 | Conceptual | ḡ = 0.48，n = 227 | Figure 10（此圖表頭印的是 k，不是 n） | — | 圖列 |
| 23 | Metacognitive | ḡ = 0.42，n = 28 | Figure 10 | — | 圖列 |
| 24 | Strategic | ḡ = 0.44，n = 75 | Figure 10 | — | 圖列 |
| 25 | Motivation | ḡ = 0.41，n = 3，**與零無顯著差異**（菱形跨過零） | Figure 10 | L158 | 「Hedges' ḡ estimates were significantly greater than zero across all scaffolding intervention types except for motivation scaffolds」 |
| 26 | 介入類型：組間 | 不顯著，p > .05 | Results | L158 | 「Despite the range in effect sizes, there were no statistically significant differences among the scaffolding intervention types, p > .05.」 |

### 使用情境

| # | 結果 | 數字 | 節／圖 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 27 | Case-based learning | ḡ = 0.28，n = 15 | Figure 5 | — | 圖列 |
| 28 | Design-based learning | ḡ = 0.35，n = 4，**與零無顯著差異**，p = .14 | Figure 5 與圖說 | L135 | 「The effect of design-based learning is not statistically greater than zero, p = .14.」 |
| 29 | Inquiry-based learning | ḡ = 0.42，n = 69 | Figure 5 | — | 圖列 |
| 30 | Modeling/Visualization | ḡ = 0.51，n = 42 | Figure 5 | — | 圖列 |
| 31 | Problem-based learning | ḡ = 0.27，n = 38 | Figure 5 | — | 圖列 |
| 32 | Problem-solving（沒有指明特定教學模式的都歸這類） | ḡ = 0.53，n = 160 | Figure 5 | L56 | 「When no specific pedagogy was identified, studies were coded as problem-solving.」 |
| 33 | Project-based learning | ḡ = 1.33，n = 5（圖上超出刻度沒畫） | Figure 5 與圖說 | L135 | 「Project-based learning (ḡ = 1.33) has an estimate and confidence interval so high that it does not show on our −0.8 to 0.8 scale.」 |
| 34 | 專題式 > 其他六類 | 對 modeling z = 4.69、problem solving 5.09、case-based 5.36、inquiry 5.74、design-based 3.90、problem-based 6.08，全部 p < .01 | Results | L132 | 「Scaffolding's effect size was higher when used in the context of project-based learning than when used in the context of modeling/visualization, z = 4.69, p < .01 …」 |
| 35 | Problem solving > problem-based | z = 2.74，p < .01 | Results | L132 | 「When used in the context of problem solving, scaffolding had a higher effect size than when used in the context of problem-based learning, z = 2.74, p < .01.」 |
| 36 | 作者對專題式那一格的保留 | 只有少數 outcome | Discussion | L205 | 「The effect size estimate of project-based learning was derived from three outcomes, which warrant caution. Yet it was statistically higher than all other contexts of use.」 |

### 評量層級

| # | 結果 | 數字 | 節／圖 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 37 | Concept | ḡ = 0.40，n = 125 | Figure 6 | L181 | 「The effect size estimates for scaffolding at the assessment levels of concept, principles, and application were 0.40, 0.51, and 0.44, respectively.」 |
| 38 | Principles | ḡ = 0.51，n = 167 | Figure 6 | 同上 | 同上 |
| 39 | Application | ḡ = 0.44，n = 41 | Figure 6 | 同上 | 同上 |
| 40 | Principles > Concept | z = 2.17，p < .05 | Results | L138 | 「Scaffolding's influence was greater when measured at the principles level than when measured at the concept level, z = 2.17, p < .05.」 |

### 學習者特徵

| # | 結果 | 數字 | 節／圖 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 41 | Primary | ḡ = 0.55，n = 28 | Figure 3 | L182 | 「The overall effect size among elementary school students, middle school students, and high school students were 0.55, 0.37, and 0.48, respectively.」 |
| 42 | Middle | ḡ = 0.37，n = 108（各階段最低） | Figure 3 | L193 | 「Although the effect size was lowest for middle school」 |
| 43 | Secondary | ḡ = 0.48，n = 53 | Figure 3 | L182 | 同 41 |
| 44 | College | ḡ = 0.49，n = 132 | Figure 3 | — | 圖列 |
| 45 | Graduate | ḡ = 0.61，n = 11 | Figure 3 | — | 圖列 |
| 46 | Adult | ḡ = 0.86，**n = 1** | Figure 3 | L124 | 「The effect size estimate among adult learners was higher than that among college, secondary, middle level, and primary students, p < .01. However, caution is warranted, as the effect size estimate for adult learners is based on one outcome.」 |
| 47 | High performing | ḡ = 0.36，n = 8 | Figure 4 | — | 圖列 |
| 48 | Low income | ḡ = 0.51，n = 11 | Figure 4 | L126 | 「The estimate for low-income learners is also relatively large.」 |
| 49 | Traditional | ḡ = 0.48，n = 279 | Figure 4 | L126 | 「The traditional student group accounts for the largest number of outcomes」 |
| 50 | Under performing | ḡ = 0.28，n = 18 | Figure 4 | L126 | 「On the contrary, underperforming learners have a small effect size.」 |
| 51 | Under represented | ḡ = 0.41，n = 17 | Figure 4 | — | 圖列 |
| 52 | Traditional > Underperforming | z = 2.29，p < .05 | Results | L126 | 「The difference between traditional and underperforming was significant, z = 2.29, p < .05.」 |

### 研究品質

| # | 結果 | 數字 | 節／圖 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 53 | Random | ḡ = 0.40，n = 181 | Figure 11 | — | 圖列 |
| 54 | Group random | ḡ = 0.48，n = 54 | Figure 11 | — | 圖列 |
| 55 | Quasi-experimental | ḡ = 0.56，n = 98 | Figure 11 | — | 圖列 |
| 56 | 準實驗 > 隨機 | z = 2.95，p < .01 | Results | L165 | 「When scaffolding was studied using a quasi-experimental design, the effect size estimate was higher than when using a random design, z = 2.95, p < .01.」 |
| 57 | 信度報告 None／Attempt／Strong | ḡ = 0.46（n = 213）／0.49（n = 18）／0.47（n = 102）；組間不顯著 | Figure 12 | L171 | 「Notably, for 64% of outcomes, there was no reliability reporting at all. There were no differences among levels of reliability reporting, p > .05.」 |
| 58 | 效度報告 None／Attempt／Strong | ḡ = 0.44（n = 294）／0.56（n = 16）／0.69（n = 23） | Figure 13 | — | 圖列 |
| 59 | 效度 Strong > None | z = 2.27，原文印「p < .5」 | Results | L171 | 「The effect size estimate when there was strong validity reporting was significantly higher than when there was no validity reporting, z = 2.27, p < .5.」 |

第 53 列是 11-d 用得上的保守數字：只看個人隨機分派的 181 個 outcome，ḡ = 0.40，比整體 0.46 低。

### 作者拿來比的外部數字（都是轉述別的統合分析，不是這份的結果）

- 先導統合分析的整體效果 ḡ = 0.53（Belland 等 2015；L23）。
- 智慧家教系統：step-based ES = 0.76、substep-based 0.40（VanLehn 2011）；ḡ = 0.41（Ma 等 2014）；K–12 數學 0.09（Steenbergen-Hu & Cooper 2013）；大學生 0.37（同作者 2014）（L23）。
- 批判思考介入 ES = 0.34（Abrami 等 2008）、大學與研究生 0.19（Niu 等 2013）；電腦輔助教學 0.33（Tamim 等 2011）（L181）。
- 一學年標準化數學測驗的自然成長：小學 0.56–1.14、國中 0.3–0.41、高中 0.01–0.22（Hill 等 2008；L182）。
- 課後方案 0.16（Lauer 等 2006）、師徒方案 0.18（DuBois 等 2002）（L183）。

## 作者自己的解釋與保留（鷹架變化那一段）

1. 作者的預期是撤鷹架應該較好：「given the attention that fading has been given by scaffolding researchers … one would expect fading to lead to a significantly higher effect size estimate than not-fading.」（L187）
2. 對「沒有差別」的解讀用的是 may：「suggests that overscripting may not occur or does not negatively affect cognitive outcomes.」（L187）「This finding may indicate that fading as defined in the scaffolding literature is not necessary to promote student learning and performance」（L188）
3. **作者自己說檢定力可能不足**：「Further research is needed to disentangle these results. For example, if more empirical studies can be included that incorporate fading and adding, confidence intervals would likely narrow, and significant differences might emerge.」（L188）
4. 對 generic 對 specific 則講得比較滿：「The effect size estimates were so close as to render it unlikely that a significant difference would emerge if more studies on generic scaffolding were found. Even if a significant difference emerged, it would have little practical importance, as the magnitude of the difference would likely be on the order of 0.01 standard deviations.」（L190）。（圖上兩者差 0.02，內文寫 0.01，原文如此。）
5. 電腦鷹架比一對一鷹架少了隨機應變：「This results in considerably less contingency. … Computer-based scaffolding needs to be programmed ahead of time」（L25）。
6. 導言引「many have argued that scaffolding must be faded to be called scaffolding (Pea, 2004; Puntambekar & Hubscher, 2005)」（L28）。
7. 0.37 的定位：「would be labeled small to medium by Cohen's (1988) guidelines」（L193）。作者對整體 0.46 用的形容是「highly effective」（摘要 L10）、「highly efficacious」（結論 L215）、「substantial」（L182），**全文沒有把 0.46 稱作 medium**。

## 作者自己列的限制

Limitations 節（L208–213）加上散在各處的：

1. 質性研究、沒有控制組的量化研究都沒收，「our effect size estimates do not reflect all empirical research on computer-based scaffolding」（L209）。
2. 編碼表一個變項只能給一個值。智慧家教系統常同時有依表現撤除與學生自選提示，一律編成 performance-based（L210）。
3. 編碼只能照論文寫的：「Coding levels like "none" for scaffolding change, "traditional" for research populations, or "problem solving" for context of use indicate a lack of description about alternative options as much as a positive identification of a study feature.」（L210）。**這句直接影響 11-d：216 個編成「不變」的 outcome 裡，有一部分只是論文沒有描述，不是確認過沒有撤。**
4. 納入的文獻很雜（智慧家教系統、knowledge integration、activity theory 的假設不同），作者說可視為限制，但辯稱都限定在結構不良問題（L211–212）。
5. 只收 STEM（L213）。
6. 沒有檢查調節變項之間的交互與相依：「Future syntheses … might investigate interactions and dependencies between promising variables」（L212）；「Future research should use techniques like metaregression … Such an examination was beyond the scope of this article.」（L196）
7. 小格子：動機鷹架 n = 3、設計式學習 n = 3（圖上是 4）、成人 n = 1，「important to urge caution in interpreting their effect size estimates」（L199）。專題式那格「derived from three outcomes」（L205；圖上是 5）。
8. 找不到學齡前的合格研究（L194）；學習障礙學生的研究多是一對一鷹架，不合納入標準（L201）。
9. 64% 的 outcome 沒有報告信度（L171）；294／333 沒有報告效度（Figure 13）。作者只報數字，沒有放進限制節。
10. 準實驗的效果量顯著高於隨機（L165）。作者沒有把它當成整體估計可能偏高的限制討論，只說三種設計都偵測得到效果。

原文沒有說、但讀的時候看得到的：受試總人數、介入時間長度、後測時點都沒有報告；調節變項一次只看一個，成對 z 檢定沒有提多重比較校正；把同一研究的多個 outcome 當獨立。

## 與摘要說法不一致的地方

1. **摘要「Scaffolding's influence was greatest … among adult learners」**（L10）：成人那一格只有 1 個 outcome（Figure 3），結果段自己加了「caution is warranted」（L124），摘要與結論（L215）都沒有帶這個但書。
2. **摘要「did not vary on the basis of … presence or absence of scaffolding change」**（L10）：內文是「組間不顯著，p > .05」，而且作者在討論說更多研究進來後差異可能出現（L188）。摘要寫成沒有差別，內文是沒有偵測到差別。
3. **摘要「consistently positive … across various contexts of use, scaffolding characteristics」**：設計式學習（p = .14）與動機鷹架兩格與零無顯著差異（L135、L158），摘要沒提。
4. 摘要說的「144 experimental studies」包含準實驗（98／333 個 outcome，Figure 11）。

### 內文與圖、內文與內文不一致（照實記，不猜哪個對）

- 設計式學習：Figure 5 印 n = 4；討論寫 n = 3（L199）。
- 專題式學習：Figure 5 印 n = 5；討論寫「derived from three outcomes」（L205）。Figure 5 各列加總是 333，所以圖的數字彼此一致。
- 成人：L199 把成人（n = 1）列在「effect size estimate was not significantly different from zero」的情況裡；但 L124 說各教育階段都顯著大於零，而且成人顯著高於其他四個階段，Figure 3 的成人區間也沒有碰到零。
- 「p < .5」（L171）應是誤植，XML 原文如此。
- Figure 3 的圖說是「Comparison of effect size according to education level」，但整體效果（L117）也指向這張圖。

## 與清單『要撐的結論』不合的地方

清單 11-d：「軟體提供的鷹架有中等效果，撤不撤看不出差別。」

1. **「中等效果」**：數字 ḡ = 0.46 沒錯，但有四個條件要連著寫，不然會被讀成比原文寬：
   - 比較對象是「做同一套問題導向教學但沒有鷹架」的組，而且題目必須是結構不良的問題。這不是「有鷹架的教材 vs 一般教材」。
   - 「中等」不是作者的用詞（見上面解釋第 7 點）。
   - 只看隨機分派是 0.40（n = 181）；準實驗 0.56，顯著較高。
   - I² = 69.7%；5 個最大的效果量被當離群值拿掉。
2. **「撤不撤看不出差別」撐得住字面，但要降級**，理由都在原文裡：
   - 單純撤除只有 12 個 outcome，點估計 0.62 其實比不撤的 0.45 高，區間很寬；作者自己說樣本多了差異可能出現（L188）。這是「沒有偵測到」，不是「證明沒差」。清單檔末尾擔心的檢定力問題成立。
   - 「不撤」那 216 個有一部分是論文沒寫（限制第 3 點）。
   - 這是跨研究子群比較，沒有任何一個比較是同一研究裡隨機分派撤與不撤；有變化的多半是智慧家教系統（L187），系統類型與鷹架變化混在一起。
   - 只報「p > .05」，沒有檢定統計量。
   - 量的是介入後的認知測驗，原文沒有說測驗時鷹架還在不在、有沒有延宕。「撤了以後學生能不能獨立做」這份研究沒有量。
   - 同一組作者 2015 年的先導統合分析方向相反（不撤較好，L187）。
3. **「軟體提供的鷹架」**：納入的是電腦互動式鷹架（概念提示、問題提示、提示鈕、智慧家教系統的回饋等），納入標準排除了「在接觸問題之前給的介入」（L211）。文章裡預先寫好的引導文字合不合這個定義，原文沒有處理；不能直接拿 0.46 當成「文章裡加引導」的效果量。
4. 清單沒列、但同一份資料可用的：鷹架含不含內容沒有差（0.46 對 0.48，p = .778）；介入類型（概念／後設認知／策略）沒有差；鷹架放在專題式學習裡的 1.33 只有 5 個（或 3 個）outcome，不能引。

## 讀取紀錄

行號指 `belland2017_PMC5347356.txt`。

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | L1–74 | 期刊資訊、標題、作者、授權、摘要、導言六小節、研究問題、方法（檢索、納入標準、十項編碼定義、編碼程序） |
| 2 | L75–224 | Table 1、統計程序、出版偏誤、Table 2、相依性、結果全部、討論全部、限制、結論、作者小傳、經費聲明、參考文獻開頭兩筆 |
| 3 | L225–358 | 參考文獻（書目，掃過） |
| 圖 | `belland2017_figs/` fig1–fig13 | 13 張圖逐張看過。Figure 1 的排除篇數、Figure 3–13 每一列的 n 與 ḡ 都是從圖上抄的，並逐圖把 n 加總核對等於 333（全部相符） |

Table 1、Table 2 是 XML 內的文字表，沒有版面錯位問題；沒有對 PDF（PDF 拿不到）。註腳只有 Table 2 的表註與經費聲明，都讀了。Supplementary Table S1、S2 沒有讀。
