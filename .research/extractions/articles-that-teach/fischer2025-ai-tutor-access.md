# 抽取紀錄：Mira Fischer、Holger A. Rau、Rainer Michael Rilke 2025〈AI Tutoring Enhances Student Learning Without Crowding Out Reading Effort〉IZA Discussion Paper No. 18338（2025 年 12 月）

- **書目**：Mira Fischer（BiB、WZB、IZA）、Holger A. Rau（Georg-August-Universität Göttingen）、Rainer Michael Rilke（WHU）。IZA Discussion Paper Series, IZA DP No. 18338, December 2025, ISSN 2365-9793。作者全名與單位對 PDF 第 2 頁（標題頁）核過。沒有 DOI 印在文件上。
- **版本**：討論稿（工作論文），未經期刊審查。封面頁自己寫「IZA Discussion Papers often represent preliminary work … Citation of such a paper should account for its provisional character.」（L52–53）。清單把它叫「Bonn 討論稿」，正確的系列名是 **IZA Discussion Paper**（IZA 設在波昂；檔案是從波昂大學圖書館的法定送存系統抓的）。
- **來源網址**：https://epflicht.ulb.uni-bonn.de/download/pdf/806391 （紀錄見 `_round3-fulltext-attempts.md` L56–57）
- **原文檔**：`.research/raw/learning-content/q6-evaluate/fischer-aitutor-bonn.txt`（1,086 行、64,965 字元）；PDF `fischer-aitutor-bonn.pdf`（30 頁；內文頁碼 = PDF 頁碼 − 2）。單欄版面，文字檔段落順序正常；`ff`、`ffi` 連字被轉成亂碼（「e”ect」＝effect、「di!cult」＝difficult），星號被轉成「→」。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 28（#11）
- **預先註冊**：AsPredicted，https://aspredicted.org/53sy-vhf7.pdf（註 3，L347–349）。我沒有去讀註冊文件，以下「預先註冊」一律是作者自述。

## 研究設計

- **類型**：實驗室裡做的個人層級隨機分派實驗，作者稱「pre-registered artefactual field experiment」（L140–141）。三組，受試者間設計。
- **受試者**：柏林工業大學（Technical University of Berlin）實驗經濟學實驗室，2025 年 2 月，14 個場次、平均每場 24 人，共 336 人（L269–273）；兩人在測驗時偷開 AI 家教或 PDF 視窗被抓到，事後排除（註 2，L311–314），分析樣本 334 人。各組人數：對照組 112、不設限組 102、設限組 120（L289–290）。每場次三組都有，個人層級隨機分派。學士與碩士生都有，學門分 9 類（表 A.2 列出 7 類）。18% 沒有德國 Abitur、31% 沒有 Abitur 數學成績（註 4，L423–425）。年齡、性別、母語、施測語言**原文沒有寫**。
- **教材**：Varian (2016)《Intermediate Microeconomics with Calculus》第九版國際學生版的兩段節錄（5 頁與 7 頁），PDF 形式（L190–193）。作者說刻意選一本講解清楚的教科書，好把 AI 家教在「解釋得更清楚」上的增益壓到最小，讓分析集中在學習行為（L193–196）。不能做筆記、不能畫線或註記（L213–214）。
- **AI 家教**：acemate 學習平台的聊天機器人，GPT-4 為底，用 RAG 從課程教材取段落回答（L218–224）。原文沒有說系統提示詞是什麼、有沒有限制它直接給答案。致謝寫明與 acemate 共同創辦人兼產品長 Paul Herman 合作（L100–102）；原文沒有另外的利益衝突聲明。
- **流程**：
  1. 基線階段：讀第一段教材 15 分鐘（三組都沒有 AI）→ 不看教材做 10 分鐘、25 題選擇題（test 1）→ 估自己答對幾題、評喜不喜歡準備與作答（L196–201）。
  2. 主階段：隨機分派 → 25 分鐘學習期 → 三組做同一份 10 分鐘、25 題選擇題（test 2），不能看教材也不能用 AI → 估答對題數、評喜歡程度、再估「為了考好，應該先讀多久才開始用 AI 家教」（L205–212）。
- **三個條件**（L229–264）：
  - Control：只用 PDF 閱讀器讀教材 25 分鐘。
  - AI Tutor (unrestricted)：25 分鐘全程左半螢幕 PDF、右半聊天視窗。
  - AI Tutor (restricted)：先只讀 PDF 10 分鐘，後 15 分鐘才出現聊天視窗。
- **誘因**：50 題與兩次自估各值 0.25 歐元；答錯不扣分；最後才知道成績（L214–217）。一場約 75 分鐘，平均報酬 16.72 歐元（L291）。
- **量了什麼、何時量**：test 2 成績（標準化，主要結果），學習期結束後**立刻**考；沒有延後測驗。行為面：第一次送出提示詞之前的時間（作者稱 reading time）、提示詞數、每分鐘提示詞數、平均字元數、提示詞類別。自陳面：最適閱讀時間的信念、準備與作答的喜歡程度、考後自估（confidence）。
- **分析**：OLS，控制 test 1 標準化分數、學門（9 類）、學士或碩士、學期（10 類）、場次固定效果（14 類），異質變異穩健標準誤（L370–393）。
- **預先註冊的兩個假設**：H1 有 AI 家教的人考得比只讀教材的人好（L335–337）；H2 **設限組會比不設限組考得好**（L363–364）。

## 結果（逐項）

表 1–4、表 A.1、A.2、圖 2、圖 A.2 都對過 PDF 版面。行號是文字檔行號，頁碼是內文頁碼。

### 主要結果（Table 1，L433–462，p.11）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 兩個 AI 組合併的效果 | 0.227 SD（SE 0.106），p < .05；N = 334；R² = 0.379 | 有 AI 家教（兩組合併，222 人）vs 只讀教材（112 人）；控制 test 1 與固定效果 | Table 1 欄 (1)；L399–402 | 「access to an AI tutor during the learning phase significantly improves test performance by 0.23 standard deviations (p < 0.05)」 |
| 2 | 不設限組 | 0.337 SD（SE 0.116），p < .01 | 不設限（102 人）vs 對照（112 人） | Table 1 欄 (2)；L404–405 | 「Students with unrestricted AI tutor access throughout the entire 25-minute learning period significantly outperform control group students by 0.34 sd (p < 0.01)」 |
| 3 | 設限組（**無顯著效果**） | 0.132 SD（SE 0.122），不顯著 | 設限（120 人）vs 對照（112 人） | Table 1 欄 (2)；L406–407 | 「students with restricted access did not perform significantly better than the control group」 |
| 4 | 不設限 vs 設限 | 差 0.21 SD（0.337 − 0.132 = 0.205）；F 檢定 p = 0.066，**作者在正文稱 marginally significant** | 兩個 AI 組互比 | Table 1 欄 (2) 底列；L407–409 | 「Contrary to Hypothesis 2, unrestricted access outperforms restricted access by 0.21 sd. This difference is marginally significant (F-test p = 0.066). We therefore reject Hypothesis 2.」 |
| 5 | 換算成相對百分比 | AI 整體 +5.8%；設限 +3.4%（不顯著）；不設限 +8.6%；不設限比設限高 5.1% | 相對於對照組（末項相對於設限組） | 註 5，L426–429 | 「AI tutor access overall resulted in a 5.8% higher performance, with restricted access improving performance by 3.4% (not sign.) and unrestricted access by 8.6% relative to the control group.」 |
| 6 | 基線成績的預測力 | test 1 係數 0.468（SE 0.050）、0.459（SE 0.051），p < .01 | — | Table 1 | 表列 |

原文**沒有**報告各組 test 2 的原始平均與標準差、沒有平衡檢查表、沒有不加控制變項的估計。

### 行為（Table 2，L502–537，p.13；Figure 2，p.14）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 7 | 第一次送提示詞之前的時間 | 設限組約 11.2 分鐘（係數 −13.476，SE 0.378）；不設限組約 5.7 分鐘（係數 −18.916，SE 0.737）；常數 24.628；N = 334 | 相對於對照組（對照組只能讀，25 分鐘是設計造成的） | Table 2 欄 (1)；L475–481 | 「Restricted-access students initially read for approximately 11.2 minutes … before submitting their first prompt, while unrestricted-access students read for 5.7 minutes」。正文寫係數 −18.915，表上是 −18.916。 |
| 8 | 提示詞總數（**無顯著差異**） | 不設限 6.1 vs 設限 7.0；係數 −0.836（SE 0.665），p > .10；N = 222 | 不設限 vs 設限 | Table 2 欄 (2)；L482–485 | 「unrestricted-access students tended to write slightly fewer prompts overall than restricted-access students (6.1 vs. 7.0), though this difference is not statistically significant」 |
| 9 | 每分鐘提示詞數 | 不設限少 0.234（SE 0.035），p < .01（正文寫 p < 0.001）；N = 222 | 不設限 vs 設限；分母是各自可用 AI 的分鐘數（25 與 15） | Table 2 欄 (3)；L485–487 | 「unrestricted-access students submitted 0.23 fewer prompts per minute of AI access (p< 0.001)」 |
| 10 | 平均提示詞長度 | 不設限短 8.864 字元（SE 4.070），p < .05；穩健迴歸；N = 212 | 不設限 vs 設限 | Table 2 欄 (4)；L487–489 | 「wrote prompts that were significantly shorter by on average 9 characters (p < 0.05)」 |
| 11 | 提示詞的時間分布 | 設限組在第 10 分鐘出現尖峰後遞減；不設限組隨時間遞增；兩條線性趨勢各 p < .001 | 兩個 AI 組各自的時間趨勢 | Figure 2；L491–495、L543–545 | 「restricted-access students begin prompting intensively immediately upon gaining AI access, with prompt frequency declining steadily thereafter (p < 0.001, OLS linear fit)」 |
| 12 | 提示詞內容（附錄 A.1，Table A.1，N = 212） | 不設限組「概念理解」類占比低 7.619 個百分點（SE 4.249，p < .1）；「記憶輔助」（摘要、簡化解釋、字卡）類占比高 6.858 個百分點（SE 3.476，p < .1）；應用解題 +0.589、考試準備 −0.280、其他 +0.452 都不顯著 | 不設限 vs 設限；依變項是每人各類提示詞的占比 | Table A.1，L931–955，p.24 | 表列。**正文沒有討論這張表的結果**，只在註 7 說附錄有分析。 |

欄 (2)(3) 的 N 是 222，欄 (4) 與表 A.1 的 N 是 212：有 10 個 AI 組學生沒有可算長度的提示詞（推測是一則都沒送）。這 10 人在欄 (1) 的「閱讀時間」怎麼記，原文沒有寫。

### 異質性（Table 3，L632–682，p.16；Table A.2，p.25）

對照條件一律是「有 AI 家教（兩組合併）vs 對照組」。每欄把樣本切成兩半再加交互作用項。

| # | 調節變項 | 參照群的 AI 效果 | 交互作用項 | 另一群的合計效果 p（F 檢定） | 原文 |
|---|---|---|---|---|---|
| 13 | Books（為樂趣讀書的頻率，自陳） | 0.129（SE 0.143），不顯著 | +0.215（SE 0.202），**不顯著** | 0.022 | L601–604 |
| 14 | Low Test 1 Score（test 1 低於中位數） | 0.176（SE 0.122），不顯著 | +0.178（SE 0.210），**不顯著** | 0.053 | L604–607「AI tutor benefits are concentrated among students with below-average baseline performance (p = 0.05, F-test)」 |
| 15 | Procrastinator（自陳拖延） | 0.353（SE 0.153），p < .05 | −0.222（SE 0.198），**不顯著** | 0.351 | L607–610 |
| 16 | Pleasure（多在意實驗中不要無聊） | 0.504（SE 0.158），p < .01（正文寫 p < 0.001） | −0.481（SE 0.199），p < .05 | 0.865 | L610–613 |
| 17 | AI Experience（三題平均） | 0.258（SE 0.137），p < .1 | −0.039（SE 0.205），不顯著 | 0.173 | L613–614「finds no moderating effect of prior AI chatbot experience」 |
| 18 | 依學門（Table A.2） | 人文 0.593（p < .05）、資工與電子 0.463（p < .1）；數理 0.378、製程工程 0.123、運輸與機械系統 0.003、營建與環境 0.153、經濟與管理 0.074 都不顯著 | — | — | L615–618「The significant treatment effects are concentrated on students in the humanities and in computer science and electronics, who showed the lowest performance in the control group.」對照組平均：人文 −0.797、資工 −0.230、經管 0.428。 |

五個調節變項裡，交互作用項本身顯著的只有 Pleasure 一個。作者自己的註 8（L626–628）：「none of these p-values are adjusted for multiple hypothesis testing and that evidence from these heterogeneity analyses should be treated as merely suggestive because of low statistical power.」

### 信念與感受（Table 4，L717–757，p.18；Figure A.2，p.26）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 19 | 「應該先讀多久再用 AI」的信念 | 對照組約 17 分鐘（常數 17.271）；不設限 −1.661（SE 0.768）、設限 −1.500（SE 0.723），都 p < .05；兩 AI 組互比 p = 0.833 | 各 AI 組 vs 對照 | Table 4 欄 (1)；L687–691 | 「control group students believe 17 minutes is optimal, compared to about 15.5 minutes in both AI treatments」 |
| 20 | 喜歡準備過程 | 設限 +0.308 SD（SE 0.125），p < .05；不設限 +0.199（SE 0.121），**不顯著**；兩 AI 組互比 p = 0.388 | 各 AI 組 vs 對照；控制 test 1 階段的同一題 | Table 4 欄 (2)；L697–699 | 「only restricted AI access significantly increases enjoyment of test preparation relative to control (0.31 sd, p < 0.05), while unrestricted access shows no significant effect」 |
| 21 | 喜歡作答過程（**無效果**） | 不設限 +0.043（SE 0.117）、設限 +0.183（SE 0.126），都不顯著 | 同上 | Table 4 欄 (3)；L699–700 | 「neither treatment significantly affects enjoyment of test-taking」 |
| 22 | 考後自估答對題數 | 不設限 +0.195 SD（SE 0.099），p < .1；設限 +0.217 SD（SE 0.093），p < .05；兩 AI 組互比 p = 0.830 | 各 AI 組 vs 對照；控制 test 1 的自估 | Table 4 欄 (4)；L701–704 | 「Being assigned AI assistance increases confidence by approximately 0.2 sd relative to control …, with no significant difference between treatments (F-test p = 0.83).」 |
| 23 | 自估與實際的落差 | 設限組自估 +0.22 SD、實際 +0.13 SD（不顯著）；不設限組自估 +0.20 SD、實際 +0.34 SD | 作者把兩張表的係數並排比較，沒有做檢定 | L704–711 | 「unrestricted-access students appear slightly underconfident, while restricted-access students appear somewhat overconfident relative to their gains」「perceived effectiveness of delayed AI access on average does not align with actual effectiveness」 |
| 24 | 信念與行為（Figure A.2） | 設限組第一次提示集中在第 10–12 分鐘（最高一格約 63 人）；不設限組第一次提示最高的兩格在第 1、2 分鐘（各約 20 人），信念的眾數在兩組都是 15 分鐘 | 同組內信念 vs 行為 | Figure A.2，p.26；L694–696 | 「access restriction was, indeed, behaviorally binding and induced behavior more aligned with these beliefs—which, however, decreased performance」。人數是我從圖上讀的近似值，原文沒有給數字。 |

## 作者自己列的限制

原文**沒有獨立的限制一節**。散在各處的有：

- 討論稿，封面聲明是初步成果（L52–53）。
- 異質性分析的 p 值沒有做多重檢定校正，檢定力低，只能當提示（註 8，L626–628）。
- 長期效果沒量：「The long-term effects on knowledge retention, higher-order reasoning, and learning skills remain open questions.」（L827–828）；未來要看重複或較長期的使用（L828–830）。
- 適用範圍自己加了條件：「at least in our setting」（L798–799）、「in settings where the goal is to promote skill acquisition rather than assess unaided performance」（L822–823）。
- 提示詞長度有極端值（有人把大段教材貼進聊天框），所以那一欄改用穩健迴歸（Table 2 註，L524–527）。
- 兩名作弊者事後排除（註 2）。

作者沒有提、但從設計讀得出來的（這是我的觀察，不是原文說法）：單次 25 分鐘、考試緊接在學習之後、只有選擇題、教材是 7 頁教科書節錄、沒有驗證 AI 回答的正確性、提示詞分類由 GPT-3.5-Turbo 自動做而沒有報告人工核對或一致性、平台業者是合作方。

## 與摘要說法不一致的地方

1. **摘要把 p = 0.066 寫成顯著。** 摘要：「unrestricted access significantly outperforms restricted access by 0.21 standard deviations」（L73–74）。正文：「This difference is marginally significant (F-test p = 0.066)」（L408）。照論文自己表格的星號標準，這是 10% 水準。結論段（L768–770）乾脆不提顯著性。
2. **摘要的 0.23 SD 是兩個 AI 組合併的數字，拆開後只有不設限組顯著。** 設限組 0.132（SE 0.122）與對照組無顯著差異。摘要沒有寫這一點；正文與結論有寫。
3. **標題與摘要說「沒有排擠閱讀」，但研究沒有量閱讀。** 所謂 reading time 是「第一次送出提示詞之前經過的時間」（Table 2 註，L528–530），送出第一則之後讀了多少沒有量。而且這個指標在兩個 AI 組都顯著低於對照組（設限 −13.5、不設限 −18.9 分鐘），正文自己寫「both AI treatments significantly reduced reading time relative to control students」（L475–476）。作者的論點是「不設限組仍先讀了 5.7 分鐘才開始問」，不是「閱讀時間沒有減少」。圖 A.2 另外顯示不設限組第一次提示最常出現在第 1、2 分鐘，5.7 是被少數晚問的人拉高的平均。
4. **摘要說 AI 家教對「基線知識較低、自我調節較強」的學生最有效。** Table 3 裡基線知識與拖延兩個交互作用項都不顯著（+0.178，SE 0.210；−0.222，SE 0.198），只有 Pleasure 的交互作用顯著；作者在註 8 自己說這些只能當提示。摘要沒有帶這個但書。
5. **摘要說設限造成「intensive bursts of prompting that disrupt learning flow」。** 提示詞的時間分布有資料（圖 2）；「打斷學習流程」沒有任何測量，是作者的解釋。
6. 小處：正文寫「splits the sample at the mean value」（L590），表註寫 Low Test 1 Score 是「below the median」（L673–674）；正文寫 Pleasure 那欄 p < 0.001，表上三顆星是 p < .01；正文係數 −18.915，表上 −18.916。

## 與清單「要撐的結論」不合的地方

清單寫：「+0.23 SD；不設限使用比先讀再用好，和『要設防護』的說法不合」。

- **「+0.23 SD」撐得住，但要連著條件寫**：這是兩個 AI 組合併 vs 只讀教材、25 分鐘學習後立刻考選擇題的數字。拆開後不設限 +0.34（p < .01），先讀再用 +0.13（不顯著）。
- **「不設限比先讀再用好」只能寫成「傾向較好」**：差 0.21 SD，p = 0.066，正文自己稱 marginally significant。寫成「顯著較好」是照抄摘要，和正文不合。可以穩當寫的是：預先註冊的假設（設限組會較好）沒有得到支持，方向相反。
- **「和『要設防護』的說法不合」撐不住，要改寫**。這個實驗測的「限制」只有一種：把 AI 家教延後 10 分鐘才開放。它沒有測「AI 不直接給答案」這類回答內容上的防護（Bastani 2025 測的那種）；兩個 AI 組用的是同一個以課程教材做 RAG 的家教，系統提示詞原文沒有交代。任務也不同：這裡是讀教科書節錄準備選擇題，不是練習解題。能寫的是「強制先讀 10 分鐘再開放，沒有比全程開放好」，不能寫成「防護沒有用」。作者自己在導言把 Bastani 的結果當成 H2 的依據（L346–354），結論反駁的是「怕學生太早依賴」這個擔心與「強制固定學習順序」的設計（L787–789），不是防護整體。
- 清單沒列、但這篇有的：(a) 設限組比較喜歡準備過程（+0.31 SD）且自估提高，成績卻沒有顯著提高，可供 order 25「感受與學習不同向」用，但那是並排兩張表的係數，沒有檢定；(b) 受試者普遍相信應該先讀 15–17 分鐘再用 AI，照這個信念行事的那一組沒有考得比較好。

## 讀取紀錄

依序讀完文字檔全部 1,086 行：

- L1–102：封面、標題頁、IZA 聲明、摘要、JEL、通訊作者、致謝
- L103–182：1 Introduction（含註 1）
- L183–292：2 Experimental Design（2.1–2.3，含 Figure 1 與註 2）
- L293–367：3 Hypotheses（含註 3）
- L368–467：4 Results 開頭、4.1、Table 1（含註 4、5）
- L468–597：4.2、Table 2、Figure 2（含註 6、7）
- L598–683：4.3、Table 3（含註 8）
- L684–762：4.4、Table 4
- L763–835：5 Conclusion
- L836–1044：附錄（Figure A.1、A.1 Prompt Classification 與分類用的提示詞全文、Table A.1、Table A.2、Figure A.2）
- L1045–1086：參考文獻（掃過）

對過 PDF 版面的：Table 1（PDF p.13）、正文 p.12（PDF p.14）、Table 2（PDF p.15）、Figure 2（PDF p.16）、4.3 正文（PDF p.17）、Table 3（PDF p.18）、4.4 正文（PDF p.19）、Table 4（PDF p.20）、Figure A.1 與 A.1（PDF p.24–25）、Table A.1（PDF p.26）、Table A.2（PDF p.27）、Figure A.2（PDF p.28）。文字檔的表格數字與 PDF 逐格相符；文字檔讀不出來的只有三張圖的座標數字，已直接看 PDF。

沒有讀的：預先註冊文件（外部連結）。本文沒有線上補充材料的說明。
