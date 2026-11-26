# Urry et al. 2021 — Don't Ditch the Laptop Just Yet: A Direct Replication of Mueller and Oppenheimer's (2014) Study 1 Plus Mini Meta-Analyses Across Similar Studies

read_status=read（全文 37 頁：正文、Table 1、Figure 1–3、參考文獻、Supplementary Material 全部；讀的是被接受版預印本，不是期刊排版版）

## 書目

- Urry, H. L., Crittle, C. S., Floerke, V. A., Leonard, M. Z., Perry, C. S., III, … Zarrow, J. E. (2021). Don't ditch the laptop just yet: A direct replication of Mueller and Oppenheimer's (2014) Study 1 plus mini meta-analyses across similar studies. *Psychological Science*, 32(3), 326–339. DOI 10.1177/0956797620965541。期刊版線上發表 2021-02-04。
- 讀的版本：PsyArXiv 預印本 DOI 10.31234/osf.io/vqyw6，首頁標示「Preprint accepted for publication in Psychological Science on July 30, 2020.」、「This preprint was generated on Thu Jul 30 19:51:47 2020.」（R Markdown 產生）。期刊版頁碼與排版可能不同，數字應一致但未逐字對照期刊版。
- 取得：`curl -L -A "Mozilla/5.0" https://osf.io/vqyw6/download` → HTTP 200，574,025 bytes PDF（37 頁）→ `pdftotext -layout` → `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/urry.txt`（1,682 行，114,607 bytes）。SAGE 期刊版是付費牆（Exa 搜尋結果顯示「Restricted access」）；沒有 PMC 版本。
- 預註冊 https://osf.io/qe3wb/wiki/home/（2017-03-07）；資料、材料、程式碼 https://osf.io/tr868/。期刊版有 Open Data／Open Materials／Preregistration 三個徽章。
- 背景：Tufts 大學部實驗心理學課（PSY 32，2017 春季）的教學型複製，約 80 名學生收資料。

## 設計

- 直接複製 Mueller & Oppenheimer (2014) Study 1（原研究 N = 65／67）。
- 受試者：Tufts 大學部 N = 145，排除 3 人後 N = 142；筆記缺 2 份，筆記相關分析 N = 140。62% 女、37% 男；58% 白人、24% 亞裔。酬勞 15 美元。
- 2（laptop vs longhand）× 5（TED 演講，與原研究相同，約 15 分鐘）受試者間設計，隨機分派。指示：「Please use your normal classroom note-taking strategy.」
- 看完後做干擾作業（打字測驗、Need for Cognition 量表、reading span），平均 24.02 分鐘，兩組相同；**不能複習筆記**，直接考試。
- 依變項：factual-recall（5–7 題）與 conceptual-application（3–5 題）開放式題目，12–15 位評分者盲評，ICC .90–.99；筆記字數；逐字重疊（筆記中與講稿相同的三字詞組比例，100×L/T）。
- 檢定力：80% 檢定力可偵測 d = ±0.47（測驗）／±0.48（筆記）；等價界限 ±0.49。原本希望 N ≥ 200（d = 0.40），但學期時間不夠。
- 分析：混合效應 ANOVA（演講為隨機效應）、與原效應比較的單尾檢定（TOSTER）、等價檢定、Bayes factor、線性混合迴歸。
- 探索性 mini meta-analysis：k = 8（M&O Study 1、2；Morehead et al. 2019 Exp 1、2 的立即測驗；本研究；Kirkland 2016；Luo et al. 2018；Mitchell & Zheng 2017），條件是操弄 laptop vs longhand、當天立即測驗、影片講課、報告測驗＋字數＋逐字重疊、大學生。factual/conceptual 只有 k = 7（Luo et al. 只報總分）。隨機效應模型（metafor）。

## 可引用結果

1. **筆記內容複製成功**（Results, Effect on Content of Notes）：laptop 字數 M = 230.69 vs longhand 136.16，t(94.63) = −5.22, p < .001，g = −0.90（原研究 −1.41）；逐字重疊 laptop 12.97% vs longhand 8.13%，g = −0.85（原研究 −0.93）。
2. **概念題的手寫優勢沒有複製**：原研究 g = 0.34（95% CI [−0.16, 0.83]）；本研究 g = −0.13（[−0.45, 0.20]，方向相反、略偏 laptop），與原效應顯著不同 t(139.03) = −2.78, p = .003，且等價於 0（±0.49）。比例正確：laptop .74 vs longhand .70。
3. **事實題兩研究都沒差**：原 g = 0.01；本研究 g = −0.08，等價於 0。比例正確 laptop .63 vs longhand .62。
4. **Mini meta-analysis（測驗）**：總分 g = 0.04（[−0.13, 0.20]），p = .645，等價於 0 ±0.38（Z = −4.10, p < .001），I² = 12.7%；factual g = 0.03（[−0.13, 0.19]），I² = 0%；conceptual g = 0.14（[−0.07, 0.35]），p = .182，I² = 38.5%。
   - 原句：「Equivalence, thus, suggests that the meta-analytic effect size was too small to have been detected in the original study.」（±0.38 是原研究以 33% 檢定力能偵測的效應量）
5. **Mini meta-analysis（筆記）**：laptop 字數 g = −0.91（[−1.18, −0.65]），I² = 69.7%；逐字重疊 g = −0.78（[−1.03, −0.54]），I² = 63.6%。
6. **字數、逐字重疊與成績的相關**（Supplementary, Continuous Predictors；Table A2）：字數正相關（model 4 b = .054, p < .001；model 5 .048, p < .01）；逐字重疊負相關（model 4 b = −.047, p < .01），但最佳模型 model 5（排除影響值）縮為 −.023 且不顯著；robust 版本又回到 b = −.045, t = −3.185。作者：「There is, thus, some ambiguity as to the extent of negative association between verbatim overlap and quiz performance in this study.」
7. **相關不是因果**（Discussion）：「It would be tempting to conclude that taking more notes causes better quiz performance or that taking verbatim notes causes worse performance. However, we did not manipulate word count or the extent to which the notes exhibited verbatim overlap with the lecture thus alternative explanations are plausible. Higher word count or lower verbatim overlap may be third-variable proxies for motivation, conscientiousness, and/or interest, any of which might prompt students to take more notes in their own words and do better on the test.」
8. **原研究的重新分析**：把題型當因子，原 Study 1 的筆記方式主效應 F(1, 63) = 1.01, p = .319，與題型交互 F(1, 63) = 0.87, p = .355——原資料本身也沒有顯著的交互作用（Supplementary, Treating Item Type as a Factor）。Bayes：原研究概念題 JZS BF10 = 0.45（偏虛無，anecdotal）；本研究 BF10 = 0.17；replication BF10 = 0.22。
9. **偏好差異**：原研究 50.77% 平常用筆電、30.77% 用筆記本；本研究 15.49% 筆電、53.52% 筆記本（χ²(3, n = 207) = 28.45, p < .001）。作者把這列為可能的「constraint on generality」。
10. 結論句：「Results, thus, did not support the idea that longhand note-taking improves performance via better encoding of information.」以及「students and professors who are concerned about detrimental effects of computer note-taking on encoding information to be learned in lectures may not need to ditch the laptop just yet.」

## 作者列的限制

- 收資料情境雜訊大：約 80 名學生在校園各處、不同時段、不同設備主持，「situation noise was likely a considerable source of random error」。
- 只測立即測驗、不能複習；有研究顯示差異只在可複習筆記時出現（Luo et al. 2018；M&O Study 3）。
- TED 演講短、陌生，不能暫停或發問，不像真實課堂。
- 沒有「不做筆記」對照組（引 Jansen, Lakens, & IJsselsteijn 2017）。
- 只看編碼，沒處理筆電的分心、輔助學習、身障需求等議題。
- mini meta-analysis 只有 8 篇、可能漏掉未發表研究、沒做出版偏誤分析，「should be considered preliminary」。
- 樣本 142 人，仍不足以偵測 d < 0.47 的效應；偏離預註冊 3 處（單尾檢定用 t 而非 Z；等價界限改為依實際樣本可達 80% 檢定力的值；只用三字詞組算逐字重疊）。
- 與原研究不同：Qualtrics 施測、干擾作業換成 M&O Study 2 的版本、用筆電看影片而非教室投影、2017 Tufts vs 約 2013 Princeton。

## 與摘要或常見轉述不一致處

- **樣本分組數字前後矛盾**：預印本摘要寫「laptop (N = 74) or longhand (N = 68)」（期刊版摘要依 Exa/PubMed 也是 laptop n = 74、longhand n = 68），但 Method／Participants 寫「68 participants in the laptop condition … and 74 in the longhand condition」。兩處相反，需要以 OSF 資料確認；引用時建議只寫總數 N = 142。
- **「approximately 30-minute delay」**：Method 說干擾期「sufficient to build in an approximately 30-minute delay」，但實測平均 24.02 分鐘（95% CI [23.36, 24.69]）。
- **常見轉述「研究證明手寫筆記比較好」**（Mueller & Oppenheimer 2014 的媒體版本）：本研究與 8 篇 mini meta-analysis 不支持；但 Urry 自己也引 Allen et al. 2020（較大、較異質的課堂研究統合分析）發現支持手寫的小效應。所以正確說法是「在實驗室立即測驗、不能複習的條件下，沒有證據顯示手寫較好」，不是「手寫筆電完全一樣」。
- **常見轉述「用自己的話記（非逐字）比較好」**：本研究只有相關證據，且逐字重疊的負相關不穩健（最佳模型不顯著）；作者明說可能是動機、認真程度等第三變項。APS Observer 的報導也寫「the results also do not confirm that taking more notes in your own words leads to better quiz performance」。
- 原研究的概念題效應在原始資料改用題型交互分析時就不顯著（p = .355），這是 Supplementary 才有的資訊，摘要沒提。

## 對 order 3 的意義

- 若文章想用「用自己的話寫才會記得」支持 Zettelkasten 的「永久筆記要改寫」：本研究顯示這個常被引用的筆記證據（M&O 2014）在直接複製與 8 篇小統合下都沒有成立；「自己的話」與成績的關聯只是相關且不穩健。比較站得住的生成證據要回到 Bertsch 2007／McCurdy 2020 的實驗室生成效應，並標明外推。
- 研究條件是「上課時記筆記、立即測驗、不能複習」，跟知識庫的長期維護、回頭查找不同，不能用來否定或支持知識庫做法，只能用來拿掉一個常見但站不住的論據。

## 讀取紀錄

- 1–64 行：標題、作者、單位、預印本標記、摘要、題詞。
- 66–115 行：引言、原研究與影響、本研究假設。
- 116–243 行：Method（預註冊、受試者、檢定力、材料、測驗計分、筆記內容測量、干擾作業、設計與程序）。
- 244–333 行：與原研究的 6 項差異、驗證性分析與推論標準。
- 334–508 行：Results（初步分析、Figure 1、Table 1、測驗與筆記內容效應、兩研究平均差）。
- 509–685 行：Exploratory Mini-Meta-Analyses（納入標準、k = 8 名單、Figure 2 測驗森林圖、Figure 3 筆記森林圖、異質性）。
- 686–715 行：Additional Exploratory Analyses 摘要。
- 716–856 行：Discussion（結果評估、mini meta、限制與未來方向、教學型複製、結論）。
- 857–888 行：Author Contributions、Acknowledgements。
- 889–967 行：參考文獻。
- 970–1158 行：Supplementary（樣本數理由、演講清單、計分、干擾作業細節、自評題、預註冊偏離、Table A1 描述統計與相關）。
- 1159–1225 行：影響值、文獻搜尋策略、效應量間相關。
- 1226–1527 行：Bayes factor、題型為因子的分析、連續預測變項（Table A2、Figure A2）。
- 1529–1565 行：筆記方式偏好差異。
- 1566–1682 行：R sessionInfo 與補充參考文獻（掃過）。
