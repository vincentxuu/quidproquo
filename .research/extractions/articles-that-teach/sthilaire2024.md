# 抽取紀錄：St. Hilaire、Chan、Ahn 2024，Psychonomic Bulletin & Review 31(2), 411–441

**書目**：Kyle J. St. Hilaire、Jason C. K. Chan、Dahwi Ahn (2024). Guessing as a learning intervention: A meta-analytic review of the prequestion effect. *Psychonomic Bulletin & Review*, 31(2), 411–441. doi: 10.3758/s13423-023-02353-8。線上刊出 2023-08-28。作者全名對過作者稿首頁（三人當時都在 Iowa State University；作者註說本文出自 St. Hilaire 的博士論文，St. Hilaire 後來在 Chegg, Inc.；NSF 2017333 部分資助）。卷期頁碼取自 OpenAlex 與 Europe PMC（PMID 37640836），兩處一致。Unpaywall 標為 bronze OA（出版社頁面免費閱讀，無授權條款）。

**原文檔**（主檔）：`.research/raw/learning-content/q1-learner/sthilaire2024.txt`（943 行、137,188 字元、137,658 位元組；jina 抓的 Springer 刊出版頁面）。這份檔**缺四樣東西**：摘要、六張表的內容（只有表名）、兩個註腳的內文、補充資料。圖也只有圖說。

**這次補抓的檔**（都存回 `q1-learner/`）：

| 檔 | 內容 | 來源 |
|---|---|---|
| `sthilaire2024-tables.md`（490 行、22,729 位元組） | Table 1–6 全部 | 出版社頁面 `https://link.springer.com/article/10.3758/s13423-023-02353-8/tables/1`…`/tables/6`（經 r.jina.ai 讀取）。Table 4–6 夾著頁面導覽文字，表本身完整 |
| `sthilaire2024-manuscript-isu.pdf`、`.txt`（105 頁、3,461 行、166,754 位元組） | 作者稿全文，含摘要、註腳、表註 | Iowa State University 機構典藏 `https://dr.lib.iastate.edu/handle/20.500.12876/Nr1V987z`（bitstream fd171cce…）。OpenAlex 標為 submittedVersion |
| `sthilaire2024-supplement-isu.pdf`、`.txt`（14 頁、308 行、21,952 位元組） | Supplemental Materials：各調節變項怎麼編碼 | 同一典藏紀錄（bitstream aeec2e79…） |

**版本**：正文讀刊出版；摘要、註腳 1–2、表註取自作者稿；表取自出版社表格頁。作者稿只用來補缺，沒有整份與刊出版逐句比對；對過的數字（摘要 g 與 k、整體效果、2006 年前後分組）兩版一致。
**讀取日期**：2026-10-14
**表格對照**：Table 1–6 用的是出版社自己的 HTML 表格頁（結構化表格，不是 PDF 轉文字），正文引到的每個數字都和表逐一對過，不一致處列在後面。出版社 PDF 抓不到（curl 拿到的是驗證頁），沒有對 PDF 版面。
**供哪幾篇使用**：order 15（讀者知不知道自己懂了）；清單註記 order 9（文章裡的題目與回饋）共用。

## 研究設計

- **類型**：預先註冊的統合分析（OSF：`https://osf.io/69jqx/`；事後加入的調節變項與預測放在修訂文件，L138）。前半是質性回顧與兩個理論說法（memory precursor、curiosity precursor）的預測。
- **prequestion effect 的定義**（L12、L22）：學習前先問題目，之後的教材裡同時有「能回答這些題目的內容」與「不能回答的內容」，學習者要自己在教材裡**找到**答案。作者把它和 pretesting effect 分開：後者是答一題就給那一題的答案（回饋），不需要搜尋。原文（L22）：「the prequestion paradigm examines learning through discovery, whereas the pretesting paradigm examines learning through feedback」。
- **兩個依變項**（L56）：specific effect＝前測組與控制組在「前測問過的題目」上的保留測驗成績差；general effect＝兩組在「前測沒問過的新題目」上的差。控制組沒有前測，所以對他們來說所有題目都是沒問過的（L52）。
- **檢索**（L142）：2021 年 3 月初搜、2021 年 8 月終搜。PsycINFO、ERIC、Scopus、ProQuest Dissertations and Theses、PsycArticles；另查三個研討會摘要集、前後向引文、聯絡九個研究團隊（七個回覆、五個提供資料）。第一作者一人初篩；投稿後三位作者重看 142 筆被排除的紀錄，救回 2 筆（排除一致率 98.6%）。
- **納入與排除**（L150–179，原文說八條、實際列了九條）：
  1. 要有不給前測題的控制組；受試者內設計必須是兩篇無關的文章、只有一篇給前測題（L155）。
  2. 要有保留測驗成績（L158）。
  3. 排除 pretesting effect 研究（L161）。
  4. 只收內容豐富的教材（文章、影片講課）；排除配對聯想、圖片、非語文作業，以及**數學計算**這類「did not speak directly to memory performance」的材料（L164）。
  5. **排除在學習前階段就給正確答案回饋的研究**（L167）。
  6. **排除把題目嵌在學習階段中的研究**（embedded prequestions；L170）：「Embedded prequestions are provided to participants during the study phase, meaning participants do not need to retrieve the prequestions from long-term memory.」
  7. 只收英文（L173）。
  8. 同一筆資料只收一次（L176）。
  9. 要能算效果量；圖上量、或由 t／F 轉換；有聯絡作者（L179）。
- **最後納入**（L181）：76 筆紀錄＝42 篇期刊論文、24 篇未出版學位論文、6 篇未出版研討會報告、4 筆未出版資料。specific effect 共 7,902 人、general effect 共 7,705 人。
- **編碼**（L185）：兩位編碼者（第一作者與他訓練的大四學生），一致率 96%。
- **效果量**（L197–223）：Cohen's d 轉 Hedges' g。13 筆紀錄沒有變異數資料，用其餘研究的平均標準差代入（控制組 SD = .17、前測組問過的題 .19、沒問過的題 .18）。受試者內設計沒有任何一篇報相關，一律假設 r = .50（L215）。同一研究多個實驗組對一個控制組時，整體模型裡合併成一個效果量；調節分析裡則拆開，所以有些調節變項的 k 加起來比整體多（L217–221）。R 的 meta 套件，隨機效果，DerSimonian–Laird，Knapp-Hartung 調整。
- **調節變項**：理論相關 9 個（Table 1）＋經驗性 11 個（L193）。原本要做的「前測到學習之間的延宕」（只有 2 篇有）、國別（北美以外只有 5 篇）、實驗場域（**教室 k = 1、線上 k = 4**）都因為研究太少而放棄（補充資料 L60–67、L77–82、L98–103）。

## 結果（逐項）

### 整體效果（L231；Table 2、Table 3 首列）

| # | 結果 | 數字 | 對照條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | specific effect | g = 0.54 [0.42, 0.66]，k = 97，p < .001 | 學習前拿到前測題（多數被要求猜答案、不給回饋）對沒有前測題；在前測問過的題目上比 | L231 | 「The pooled effect size for the specific effect was g = 0.54 [0.42, 0.66], providing solid evidence that prequestions enhance learning of the tested material (k = 97), p< .001.」 |
| 2 | specific effect 的方向分布 | 85% 為正，15 個研究為負 | 同上 | L231 | 「most effect sizes were positive (85%), with only 15 studies demonstrating negative effects」 |
| 3 | specific effect 異質性 | τ² = .21，I² = 80%，Q = 489.98，p < .001 | 同上 | L231 | 「There was significant heterogeneity in the data, τ 2 = .21, I 2 = 80%, Q = 489.98, p< .001」 |
| 4 | general effect | g = 0.04 [−0.04, 0.11]，k = 91，p = .349（不顯著） | 同樣兩組，在前測**沒問過**的題目上比 | L231 | 「there was virtually no evidence for the general effect, g = 0.04 [−0.04, 0.11], as 54% of studies showed positive effects and 46% of studies showed either no effect or a negative effect (k = 91; see Fig. 5), p = .349.」 |
| 5 | general effect 異質性 | τ² = .07，I² = 60%，Q = 225.92，p < .001 | 同上 | L231 | 「There was also substantial heterogeneity in the data」 |

### 出版偏誤（L235–247）

| # | 檢查 | specific | general | 行號 |
|---|---|---|---|---|
| 6 | 已出版對未出版 | 已出版 g = 0.59（53 個研究）對未出版 g = 0.49（45 個） | 已出版 g = 0.06（51 個）對未出版 g = 0.003（40 個） | L237；兩者差異 ps > .437 |
| 7 | Egger 檢定 | t(95) = 1.38，p = .172 | t(89) = −0.05，p = .964 | L239 |
| 8 | PET-PEESE | PET 截距 β = 0.37，p = .041 → 用 PEESE，**校正後 g = 0.45**，p < .001 | PET β = 0.04，p = .714；PEESE β = 0.05，p = .402 | L245 |

原文（L245）：「the adjusted effect sizes (i.e., g = 0.45 for the specific effect; g = 0.04 for the general effect) are only slightly deflated compared to the original effect size estimates」。

### specific effect 的類別調節變項（Table 2，全表照錄）

| # | 調節變項 | 層級：k、g [95% CI] | Q_B | p |
|---|---|---|---|---|
| 9 | 是否要求猜答案 | Guess：70、0.65 [0.53, 0.77]；**Read-Only（只看題不作答）：29、0.22 [−0.02, 0.45]** | 11.05 | < .001 |
| 10 | 題目與教材穿插 | Massed：49、0.50 [0.28, 0.71]；Interleaved：49、0.57 [0.47, 0.68] | 0.44 | .509 |
| 11 | 前測題型 | 選擇題：42、0.51 [0.36, 0.67]；簡答：57、0.58 [0.41, 0.75] | 0.31 | .578 |
| 12 | 前測題考什麼 | Factual：88、0.58 [0.45, 0.72]；**Conceptual：22、0.28 [−0.03, 0.60]** | 3.22 | .073 |
| 13 | 教材類型 | **Text：77、0.51 [0.37, 0.65]**；Audiovisual：21、0.66 [0.49, 0.83] | 1.94 | .163 |
| 14 | 問過與沒問過內容的關係 | Related：12、0.63 [0.40, 0.86]；Unrelated：77、0.54 [0.40, 0.67] | 0.61 | .435 |
| 15 | 研究設計 | 受試者間：85、0.54 [0.40, 0.67]；受試者內：12、0.57 [0.34, 0.80] | 0.08 | .774 |
| 16 | 受試者年齡 | Adults：77、0.62 [0.50, 0.74]；**Grade School Children：20、0.22 [−0.11, 0.56]** | 5.45 | .020 |
| 17 | 控制組做什麼 | 假前測（無關題）：5、0.66 [−0.19, 1.52]；延長學習時間：17、0.66 [0.48, 0.83]；只學習：75、0.51 [0.36, 0.65] | 1.95 | .378 |
| 18 | 前測階段計時 | 實驗者控制：36、0.63 [0.48, 0.77]；自訂步調：60、0.48 [0.31, 0.65] | 1.71 | .190 |
| 19 | 學習階段計時 | 實驗者控制：50、0.65 [0.54, 0.76]；**自訂步調：45、0.42 [0.20, 0.63]** | 3.85 | .049 |
| 20 | 保留測驗題型 | 選擇題：47、0.42 [0.27, 0.57]；簡答：50、0.67 [0.49, 0.85] | 4.65 | .031 |
| 21 | 前測與保留測驗題型是否相同 | Match：74、0.54 [0.40, 0.68]；Mismatch：23、0.55 [0.32, 0.77] | 0.00 | .950 |
| 22 | 是否剔除前測就答對的題 | Include：31、0.60 [0.50, 0.71]；Exclude：6、0.83 [0.49, 1.17]；**Undefined：60、0.48 [0.30, 0.67]** | 4.58 | .101 |

原文（L271）：「Both the memory and curiosity precursor accounts correctly predicted a greater specific effect when participants were asked to guess the answer to the prequestions during the pre-study phase (g = 0.65) than when they were not (g = 0.22), p< .001. Indeed, amongst all of the moderator variables, prequestion guessing had the strongest influence on the PE.」

三個層級的 CI 含 0：只看題不作答（#9）、概念題（#12）、小學到中學生（#16）；假前測控制（#17）也含 0，但只有 5 個效果量。

### general effect 的類別調節變項（Table 3，全表照錄）

| # | 調節變項 | 層級：k、g [95% CI] | Q_B | p |
|---|---|---|---|---|
| 23 | 是否要求猜答案 | Guess：71、0.06 [−0.02, 0.14]；Read-Only：23、−0.07 [−0.28, 0.13] | 1.76 | .185 |
| 24 | 題目與教材穿插 | Massed：48、0.11 [0.02, 0.20]；Interleaved：44、−0.06 [−0.18, 0.07] | 4.41 | .036 |
| 25 | 前測題型 | 選擇題：40、0.04 [−0.07, 0.14]；簡答：53、0.04 [−0.06, 0.15] | 0.01 | .913 |
| 26 | 前測題考什麼 | Factual：77、0.03 [−0.06, 0.11]；Conceptual：22、0.07 [−0.10, 0.25] | 0.28 | .600 |
| 27 | 教材類型 | **Text：70、−0.005 [−0.10, 0.09]**；Audiovisual：22、0.17 [0.05, 0.29] | 5.69 | .017 |
| 28 | 問過與沒問過內容的關係 | Related：15、0.17 [0.05, 0.30]；Unrelated：72、0.01 [−0.08, 0.10] | 4.78 | .029 |
| 29 | 研究設計 | 受試者間：78、0.02 [−0.06, 0.11]；受試者內：13、0.09 [−0.02, 0.20] | 0.99 | .319 |
| 30 | 受試者年齡 | Adults：73、0.02 [−0.06, 0.10]；Children：18、0.11 [−0.11, 0.33] | 0.70 | .403 |
| 31 | 控制組做什麼 | 假前測：5、0.20 [−0.22, 0.61]；延長學習時間：17、0.10 [−0.04, 0.25]；只學習：69、0.01 [−0.08, 0.10] | 2.28 | .320 |
| 32 | 前測階段計時 | 實驗者控制：34、0.04 [−0.08, 0.16]；自訂步調：56、0.03 [−0.07, 0.14] | 0.00 | .944 |
| 33 | 學習階段計時 | 實驗者控制：50、0.11 [0.01, 0.21]；**自訂步調：39、−0.05 [−0.17, 0.08]** | 4.12 | .042 |
| 34 | 保留測驗題型 | 選擇題：45、0.03 [−0.09, 0.14]；簡答：46、0.05 [−0.06, 0.16] | 0.07 | .791 |
| 35 | 前測與保留測驗題型是否相同 | Match：66、0.003 [−0.09, 0.09]；Mismatch：25、0.14 [−0.003, 0.28] | 2.69 | .101 |
| 36 | 是否剔除前測就答對的題 | Include：31、0.13 [0.04, 0.21]；Exclude：6、0.10 [−0.32, 0.52]；Undefined：54、−0.04 [−0.16, 0.08] | 5.21 | .074 |

原文（L277）：「prequestions produced a larger general benefit for massed study (g = 0.11) than for interleaved study (g = −0.07), p = .036, for nontested retention questions that were related to the prequestions (g = 0.17) than those unrelated to the prequestions (g = 0.01), p = .029, and for audiovisual (g = 0.17) than text materials (g = −0.005), p = .017.」作者的但書（L313）：「For all three of these moderators, the magnitude of the general effect in the condition that was predicted to promote the PE did not exceed g = 0.20.」

### 連續調節變項（Table 4、Table 5，全表照錄）

| # | 調節變項 | specific：k、β [CI]、p | general：k、β [CI]、p |
|---|---|---|---|
| 37 | 每題給多少時間 | 34、−0.003 [−0.01, 0.01]、.481 | 34、0.01 [0.001, 0.01]、.020 |
| 38 | 前測題數 | 97、−0.004 [−0.02, 0.01]、.672 | 93、−0.002 [−0.02, 0.01]、.724 |
| 39 | 前測答對率 | 40、−0.49 [−1.06, 0.09]、.095 | 37、0.22 [−0.35, 0.79]、.441 |
| 40 | 出版年 | 97、0.01 [−0.0002, 0.01]、.060 | 91、0.008 [0.004, 0.01]、< .001 |
| 41 | 閱讀速度（字／分；只算實驗者控制學習時間的研究） | 25、0.002 [−0.001, 0.005]、.282 | 24、−0.004 [−0.006, −0.001]、.005 |
| 42 | 學習到測驗的保留間隔（分鐘取對數） | 96、−0.04 [−0.14, 0.06]、.412 | 84、−0.04 [−0.11, 0.03]、.263 |

- 前測答對率（#39）的但書（L271）：有兩個離群值（答對率約 80%，受試者是學自己專業新知的成人專家，Anderson 1978），保留在分析裡；不到 30% 的研究有報前測成績，「these data should be interpreted with caution」。
- 出版年分組（L343，事後分析）：2006 年以前的研究 general effect g = −0.09，p = .118，k = 49；2006 年以後 g = 0.15，p < .001，k = 42。註腳 2（作者稿）：選 2006 是因為這一波 prequestion 研究大約與 2000 年代中期對教育相關記憶現象的興趣同時出現。作者的解讀（L343）：可能反映研究興趣轉向「什麼設計會出現 general effect」，而且「The positive trend toward observing a positive general PE makes this conclusion less definitive.」
- 保留間隔（#42）兩邊都不顯著；補充資料說多數研究是學完立刻測。

### 理論評估（Table 6；L311–327）

- memory precursor 對 specific effect：六個預測只有一個成立（猜答案 > 只看題），四個是零結果（每題時間、題數、穿插、題型）。原文（L311）：「the memory precursor account received very little support regarding the specific effect」。對 general effect：四個可檢驗的預測有三個成立（#24、#27、#28），題數不成立。
- curiosity precursor 對 specific effect：成立的也只有「猜答案」這一個，而它同時是 memory precursor 的預測，分不出來（L321）；題型零結果；概念題對事實題方向相反（p = .073）；前測答對率邊緣（表註：N* = Null evidence at p = .094）。對 general effect：兩個預測都是零結果（L323）。
- 作者指出注意力說法本身有不可否證的問題：眼動研究裡前測題讓人看相關段落「更久」和「更短」的結果都被拿來支持同一個說法（L333）。
- 質性回顧裡的機制線索（不是統合分析結果，L74）：St. Hilaire & Carpenter 2020a 發現前測題的好處限於學習者有找到並記進筆記的內容；沒找到答案的題目，成績與亂猜無異。Pan 等 2020 發現記得前測題的程度預測效果大小。

## 作者自己列的限制

本文沒有獨立的限制一節，散在各處：

- general effect「幾乎為零」的結論是暫定的，因為它隨出版年上升（L343、L357）。
- 理論預測是作者自己對文獻的詮釋，「individual readers might dispute some of the predictions」（L66、L124、L331）。
- 前測答對率的資料少、有離群值，而且調節分析的單位是研究不是個人，「a meta-analysis might not be ideal to address this question」（L271、L349）。
- 兒童的效果量信賴區間很寬、k 少，「We caution against drawing strong conclusions」；年長者只有 4 篇，併入成人（L281、L353、補充資料 L88–96）。
- 概念題只有 22 個效果量（L319）。
- 動機：實驗室裡低誘因、指示模糊的控制組可能不像前測組那麼投入，給控制組誘因後效果可能縮小（L351）。
- 教室與線上的研究極少：「few studies have explored the benefits of prequestions in the classroom (Carpenter et al., 2018; Hollen, 1970; Jersild, 1929) or online learning」（L351）；補充資料寫教室 k = 1、線上 k = 4。
- 多數受試者是大學生；很少研究報人口資料；注意力控制、工作記憶的個別差異幾乎沒研究（L353）。
- 60 個 specific 效果量沒交代是否剔除前測就答對的題（#22），作者自己說剔除才是唯一能把效果歸給「實驗中學到」而不是先備知識的做法（L193）。
- 出版偏誤檢查「no publication bias analyses are foolproof」（L227）。
- 作者沒列、但從方法可見的：13 筆紀錄的標準差是代入的；受試者內設計一律假設 r = .50；初篩只有一人；調節分析彼此不獨立、沒有多重比較校正；只收英文。

## 與摘要說法不一致的地方

1. 摘要：「a moderate specific effect (g = 0.54, k = 97)」。與正文一致；但摘要沒有提 I² = 80%、PEESE 校正後 0.45，也沒有提只看題不作答（0.22）、概念題（0.28）、兒童（0.22）這三個層級的 CI 含 0。
2. 摘要：「Overall, the attention-based account received support from some theoretically relevant moderator analyses.」正文裡對 specific effect（唯一確定存在的效果）只有一個調節變項支持，作者自己寫「very little support」（L311）；同一篇的 L327 又寫「our moderator analyses provided considerable support for the memory precursor account, at least as it pertains to the general effect」，而 general effect 本身不顯著。摘要的說法偏樂觀。
3. k 不一致：整體模型 k = 97（L231、Table 2、Egger 自由度 95），但方法節寫「a total of 98 studies evaluated the specific effect」（L221），出版狀態分組也是 53 + 45 = 98（L237）。原文沒解釋。
4. 未出版來源的數目兩處不同：納入紀錄是 24 篇學位論文、6 篇研討會、4 筆資料（L181）；出版偏誤一段的 specific effect 是 30、12、3（L237）。前者算「紀錄」、後者算「研究」，但 4 筆對 3 筆對不上，原文沒說明。
5. 正文與表的數字出入：interleaved 的 general effect 正文 −0.07（L277）、表 −0.06；出版年對 specific 的 p 正文 .058（L281）、表 .060；前測答對率的 p 正文 .094（L271、L319、Table 6 註）、表 .095。
6. L281 說經驗性調節變項「five produced significant results」，列的五個裡出版年對 specific 是 p = .058、閱讀速度對 specific 是 p = .282；保留測驗題型（specific，p = .031）被算進去但正文沒有再描述或討論。
7. L341：「answering conceptual prequestions still benefited learning relative to control」。Table 2 概念題的 CI 是 [−0.03, 0.60]，含 0。
8. 討論 L297：「nearly half of them demonstrated a negative general effect and the remaining demonstrated a positive general effect」；結果節 L231 寫的是 46%「either no effect or a negative effect」。
9. 納入標準正文說「eight criteria」（L152），實際列了九條。
10. 清單註記「jina 版，沒有摘要」屬實；另外這份檔也沒有任何一張表的內容，先前的掃描不可能讀過調節變項表。

## 與清單「要撐的結論」不合的地方

清單那句：「讀前先答題只幫到被問到的內容（g = 0.54），沒被問到的內容幾乎沒有效果（g = 0.04）。反向／無效（對『放幾題就能帶動整篇』而言）」。

- 兩個數字與方向都撐得住（#1、#4）。要補的條件如下，少了就會寫過頭：
  1. **「答題」兩個字是關鍵**。只把題目放在前面讓人看、不要求作答，效果是 0.22 [−0.02, 0.45]，CI 含 0（#9）。本站文章若只是在開頭列幾個問題而讀者不作答，對應的是這一格，不是 0.54。
  2. **這個數字不涵蓋「答完立刻給答案」與「題目穿插在內文裡」**。給回饋的（排除標準 5）與嵌在學習階段的題目（排除標準 6）都被排除。order 9 若要談文章中段的題目與回饋，這篇不是證據；它只管「讀前、不給答案、之後自己在文中找到」這一種。
  3. 文字教材分開看：specific 0.51、general −0.005（#13、#27）。「沒被問到的內容幾乎沒有效果」在文字教材上更明確。
  4. 「幾乎沒有效果」不是「一律沒有」：沒問過的內容若與問過的相關，g = 0.17 [0.05, 0.30]（k = 15）；影音教材 0.17；2006 年後的研究 0.15。作者自己說這個結論「somewhat tentative」。
  5. 學習者自訂步調時（網路文章就是這種），specific 降到 0.42、general 是 −0.05（#19、#33）；學完多半立刻測；教室研究 k = 1、線上 k = 4；小學到中學生的 CI 含 0。
  6. 概念題（要推論、答案不直接寫在教材裡）的 specific effect 是 0.28、CI 含 0，事實題 0.58（#12）。「幫到被問到的內容」主要是事實性內容上的證據。
  7. 0.54 的異質性很高（I² = 80%），PEESE 校正後 0.45。
- order 15 想取的角度「題目讓讀者看見自己不會什麼」：**這篇沒有量任何後設認知或自我評估的準確度**。相關的只有兩處：前言引 Hartley & Davies 1976 說前測題的功能之一是「highlight what students do not know」（L58，是別人的論述、沒有資料）；以及 curiosity precursor 假設人察覺知識缺口後會去找答案，這個說法在本文只得到「weak support」，前測答對率與效果的負相關是 p = .094／.095 且有離群值。不能拿這篇當「題目能校準讀者自我判斷」的證據。
- 清單把它標成對「放幾題就能帶動整篇」的反向證據，成立；更準確的寫法是「讀前猜題的好處集中在被問到的那幾點，尤其是文字教材」。

## 讀取紀錄

主檔 `sthilaire2024.txt`，依序讀完：

- L1–133：標題、引言、Trends and related phenomena、paradigm 三階段、specific／general 定義、attention-based account、memory precursor 與 curiosity precursor 的全部預測、The current study
- L134–293：Method（資料可得性、檢索、九條納入排除標準、編碼、效果量計算）、Results（整體效果、出版偏誤、理論相關與經驗性調節分析）
- L294–358：Discussion 全部（理論評估、注意力說法的問題、經驗性調節變項、未來方向）、Conclusion
- L359–943：參考文獻，只掃過（看了開頭十餘筆與每隔數十行的抽樣，確認檔案在參考文獻結束、後面沒有註腳或聲明）

補抓檔：

- `sthilaire2024-tables.md`：Table 1–6 全讀，每一列都抄進上面的表或對過正文
- `sthilaire2024-supplement-isu.txt`：L1–308 全讀（調節變項編碼說明 L1–127 逐行讀；其後是補充資料自己的參考文獻，掃過）
- `sthilaire2024-manuscript-isu.txt`：**只讀了**標題頁與摘要（L1–36）、註腳 1（L151–158 附近）、註腳 2（L1228–1229）、Table 1 註（L2089 起）、Table 2 註（L2471–2473），其餘沒有逐行讀

沒有讀到的：Figure 1–9 的圖本身（PRISMA 流程圖各步驟篩掉幾筆、兩張森林圖的逐篇效果量都在圖裡，主檔只有圖說）；OSF 上的資料檔與預先註冊文件沒有開；出版社 PDF 抓不到。因此「哪 76 筆紀錄各自的效果量」這一層沒有核對。
