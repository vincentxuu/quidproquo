# 抽取紀錄：Yanagisawa、Webb、Uchihara 2020，How do different forms of glossing contribute to L2 vocabulary learning from reading? A meta-regression analysis

- **書目**：Akifumi Yanagisawa、Stuart Webb、Takumi Uchihara（University of Western Ontario）。*Studies in Second Language Acquisition* 42(2)，411–438。線上刊出 2020-01-14，紙本 2020 年 5 月。DOI 10.1017/S0272263119000688。作者姓名與首頁（L9–10）、Crossref 紀錄都對過，三者一致。
- **原文檔**：`.research/raw/learning-content/q2-interactive/yanagisawa2020-glossing.txt`（2,177 行、95,633 字元）與同名 `.pdf`（38 頁）。
- **版本**：作者接受稿（首頁 L5「Accepted for publication in SSLA (Cambridge University Press)」，Word 轉出、PDF 建立日 2019-10-30）。**不是刊出版**，刊出版在付費牆後（OpenAlex 標 closed），沒有讀到；頁碼一律寫作者稿的頁碼。刊出版若在校對時改過數字，這份紀錄看不到。
- **線上附錄**：正文引用的附錄 1–5 不在原文檔裡。本次從出版者的公開補充資料網址抓到（`https://static.cambridge.org/content/id/urn:cambridge.org:id:article:S0272263119000688/resource/name/S0272263119000688sup001.zip`，連結取自 Cambridge 摘要頁，免登入），解壓後存在 `.research/raw/learning-content/q2-interactive/yanagisawa2020-supplementary/`。檔名與附錄編號對不上：`sup005` 是附錄 1（納入研究書目）、`sup004` 是附錄 2（PRISMA 流程圖）、`sup003.xlsx` 是附錄 3（各研究基本資料）、`sup002` 是附錄 4（效果量算法）、`sup001` 是附錄 5（發表偏誤與方法變項）。附錄 4 的三條公式與附錄 5 的兩張漏斗圖是圖片，轉文字時掉了，沒有看到。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 4（記號、行話與術語）；清單註明與 order 24（語言、翻譯與手機）重疊。

## 研究設計

- **類型**：統合分析，三層統合迴歸（three-level meta-regression：抽樣變異、同研究內效果量之間、研究之間，L406–411），加 cluster-robust 變異估計與小樣本校正（L421–423）。R 的 metafor 與 clubSandwich（L424–425）。
- **檢索**（L249–259）：ERIC、PsycINFO、LLBA、ProQuest Global Dissertations、Google Scholar；關鍵字 gloss、glosses、glossing、vocabulary、reading、annotation、annotate、annotating、L2、foreign、second 的組合；收到 2018 年 8 月為止，資料庫檢索得 1,001 筆。另查三份先前統合分析與兩篇回顧的參考文獻。
- **流程圖數字**（附錄 2，`sup004.txt` L22–53）：資料庫 1,001 筆＋其他來源 65 筆 → 去重後 373 筆 → 篩掉 249 筆 → 全文評估 124 篇 → 排除 82 篇 → 納入 42 篇。排除原因：回顧或描述性文章 13、沒有檢驗註解式閱讀的字彙學習 7、多模態註解 9、沒有比較不同註解形式 6、受試者內設計 9、方法或報告品質差 13、不是附帶學習 5、統計資訊不足 13、語料庫式註解與字典使用 7（加總 82）。**1,001＋65 去重後剩 373，流程圖沒有說明怎麼從 1,066 掉到 373。**
- **納入與排除標準**（L261–301，原文說「seven criteria」，實際列了九條）：
  1. 實驗或準實驗，比較有註解組與無註解組，或比較不同的**單一模態**註解。
  2. 讀的是一篇或多篇文章；讀單句的不收。
  3. 受試者間設計；受試者內設計排除。
  4. 目標字全是生字，或用無意義字、前測控制先備知識。
  5. **只收附帶學習**（incidental）：受試者事先不知道會考字彙。被告知要考字彙、被明確要求學字彙、閱讀前後反覆受測的研究都排除（L282–290）。
  6. 有平均、標準差、人數。
  7. 英文撰寫。
  8. 不同條件用不同目標字的、方法交代不清的排除。
  9. 語料庫式註解排除。
- **最後納入**：42 個研究、N = 3,802、359 個後測分數（L305）。組成：期刊論文 31、研討會發表 3、紀要（bulletin）3、博士論文 3、碩士論文 1、線上報告 1（L308–309；附錄 3 逐列數過相符）。
- **受試者**（附錄 3 逐研究數出，正文沒有這張表）：
  - 地區：亞洲 19、中東 10、北美 9、歐洲 4。
  - 目標語：英語 34、西班牙語 4、德語 2、法語 1、日語 1。
  - 受試者母語：波斯語 11、英語 7、日語 6、韓語 6、中文 5、土耳其語 3、法語 1、荷蘭語 1、泰語 1、混合 1。
  - 外語情境（FL）39 個研究（92.9%），第二語言情境（SL）3 個（7.1%）（L1874–1876，附錄 3 相符）。
  - 就讀機構：大學 31、語言學校 6、中學 5（L1243–1244）。
  - 程度：42 個研究中只有 25 個報告程度；初級 9、中級 16、進階 3（L1205–1207）。25 個裡有 10 個（40%）沒說怎麼判定程度（L1213–1214）。
- **教材**：讀文章（非單句）。目標字佔全文字數的平均 2.7%（SD 1.8%，0.6%–7.7%）（L1194–1195）。
- **比較對象**：無註解閱讀；以及各種註解形式互比。
- **註解的編碼**（L334–338）與定義（L87–105）：
  - **類型**：marginal（頁邊，通常右側或頁底）、interlinear（行間）、**in-text（文內，緊接在該字之後）**、**glossary（文末，或另一張紙的清單）**、hyperlinked（要點擊或滑鼠移上去才出現）、multiple-choice（頁邊給幾個候選意思，讀者依上下文選一個）、no-gloss。前四種作者歸為「非互動」，後兩種歸為「互動」。
  - **語言**：L1（母語翻譯）、L2（目標語的定義或同義字）、L1 plus L2。
  - **模態**：textual、pictorial、auditory。
- **量了什麼**：**目標字的字彙知識，不是閱讀理解**。效果量是「相對學習增益」＝（後測平均 − 前測平均）÷（後測滿分 − 前測平均），也就是原本不會的字裡學會的比例（L376–386）。抽樣變異用後測標準差換算成比例後算 s²/n（L387–390）。
- **測驗格式**（L325–333）：recall（回想形義連結）、recognition（辨認字形或形義連結）、other（填空題與 Vocabulary Knowledge Scale）。分析註解形式時，測驗格式當共變項放進模型，參照水準是無註解與 recall（L440–443）。
- **何時量**：立即後測與延宕後測分開分析（L427）。延宕後測在處理後平均 15.9 天（SD 8.8，2–35 天）（附錄 5，`sup001.txt` L21）。
- **顯著水準**：5%；p < .10 當「邊緣顯著」報告，作者說明這不代表拒絕虛無假設（L428–430）。
- **編碼信度**：兩位作者先各編 5 篇，κ = .97；之後一人編完其餘，另一人抽編 12 篇，無不一致（L369–374）。原文寫「28.6% (12 out of 42) of the remaining studies」，12/42 的分母是全部 42 篇而不是剩下的 37 篇。
- **剔除**：Zhao & Ren (2017) 低程度組無註解條件的立即後測（變異極小）被剔除（L455–458）；理解度分析另剔除 Jacobs 等 (1994) 的 6 個效果量（L1183）。

## 結果（逐項）

Table 1–7 的每一格都對過 PDF 版面（`pdftotext -layout` 重轉，表在 PDF 第 12、14、16、18、20、23–24、25–26 頁）。原文檔把表拆成一行一格，行號寫該表的起訖。k＝研究數，n＝效果量個數。

### RQ1：整體效果（Table 1，L489–527，PDF 第 12 頁）

| # | 結果 | 數字 | 對照條件 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 有註解，立即後測 | 學會 45.3% 的生字（95% CI 38.7–51.8），k = 39，n = 154 | 絕對增益，不是與對照的差 | Table 1；L475–476 | 「glossed reading led to 45.3% (95% CI [38.7, 51.8]) of the unknown words were learned (b = 0.453, SE = 0.032, p < .001)」 |
| 2 | 無註解，立即後測 | 26.6%（CI 20.5–32.7），k = 27，n = 45 | 同上 | Table 1；L476–478 | 「Non-glossed reading yielded the learning of 26.6% … and this was significantly lower than glossed reading (b = -0.187, SE = 0.022, p < .001).」 |
| 3 | 有註解 vs 無註解，立即 | 差 18.7 個百分點，p < .001 | 有註解 vs 無註解 | L478 | 同上 |
| 4 | 有註解，延宕後測 | 33.4%（CI 27.0–39.8），k = 36，n = 113 | 絕對增益 | Table 1；L479–480 | 「glossed reading led to the learning of 33.4% (95% CI [27.0, 39.8])」 |
| 5 | 無註解，延宕後測 | 19.8%（CI 13.1–26.5），k = 28，n = 47 | 絕對增益 | Table 1；L480–481 | 「Non-glossed reading led to the learning of 19.8%」 |
| 6 | 有註解 vs 無註解，延宕 | 差 13.6 個百分點，p < .001 | 有註解 vs 無註解 | L482–483 | 「The difference … was significant (b = -0.136, SE = 0.021, p < .001), showing that the glossing effect was retained through to the delayed posttests.」 |
| 7 | 模型解釋的變異 | Pseudo-R²：立即 11%、延宕 9.4% | 只放「有無註解」一個變項的模型 | Table 1 註，L526–527 | 「11% and 9.4 % of the variance in the ESs was explained for the immediate and the delayed posttests, respectively.」 |

### 測驗格式（Table 2，L559–728，PDF 第 14 頁）

| # | 測驗格式 | 條件 | 立即：k／n／平均（CI）／p | 延宕：k／n／平均（CI）／p |
|---|---|---|---|---|
| 8 | Recall | 有註解 | 20／57／28.4%（18.2–38.7）／< .001 | 17／35／21.2%（14.6–27.9）／< .001 |
| 9 | Recall | 無註解 | 13／16／14.1%（5.8–22.5）／.002 | 13／16／13.3%（6.4–20.2）／< .001 |
| 10 | Recognition | 有註解 | 28／84／54.6%（45.4–63.9）／< .001 | 25／60／42.9%（35.6–50.3）／< .001 |
| 11 | Recognition | 無註解 | 20／25／33.8%（25.0–42.6）／< .001 | 20／24／25.6%（18.4–32.9）／< .001 |
| 12 | Other | 有註解 | 6／13／51.6%（34.7–68.6）／< .001 | 8／18／26.8%（21.4–32.2）／< .001 |
| 13 | Other | 無註解 | 4／4／26.8%（−0.9–54.5）／.055 | 6／7／12.0%（−1.1–25.2）／.066 |

（表中 p 值檢定的是「增益是否不為零」，不是有無註解的差。）

| # | 結果 | 數字 | 位置 | 原文一句 |
|---|---|---|---|---|
| 14 | 立即：註解與測驗格式的主效果都顯著，交互作用不顯著 | Gloss F(21.7) = 67.5，p < .001；Test format F(9.46) = 6.53，p = .017；交互作用 F(8.34) = 1.17，p = .356 | L540–542 | 「the interaction was non-significant, F(8.34) = 1.17, p = .356」 |
| 15 | 立即：辨認題分數比回想題高 | 高 24.8 個百分點，p = .003；other 比 recall 高 20.5，p = .045；other 與 recognition 無差（p = .589） | L543–546 | 「recognition tests led to a 24.8% higher ES than recall tests (b = 0.248, p = .003)」 |
| 16 | 延宕：註解 × 測驗格式交互作用顯著 | F(12) = 4.41，p = .037；註解效果用辨認題量比用回想題量高 9.3 個百分點（p = .008）；other 對 recall p = .574、對 recognition p = .127 | L547–553 | 「the glossing effect was 9.3% higher when measured with recognition tests compared to when measured with recall tests (b = 0.093, p = .008)」 |

### RQ2：註解類型（Table 3，L762–923，PDF 第 16 頁）

各列是「該類型減無註解」的增益差（百分點），模型控制了測驗格式。納入研究數（L735–736）：無註解 30、marginal 26、multiple-choice 13、hyperlinked 12、in-text 4、glossary 3、interlinear 1。

| # | 類型 | 立即：k／n／差（CI）／p | 延宕：k／n／差（CI）／p |
|---|---|---|---|
| 17 | Multiple-choice | 12／31／25.2（18.5–31.8）／< .001 | 12／21／15.6（9.0–22.3）／< .001 |
| 18 | Hyperlinked | 11／35／18.4（5.9–30.9）／.009 | 11／33／15.2（3.1–27.3）／.020 |
| 19 | Marginal | 25／69／17.8（13.5–22.0）／.001 | 21／50／12.8（9.6–16.0）／< .001 |
| 20 | Glossaries（文末詞彙表） | 2／3／17.4（**−27.7–62.5**）／.134，**不顯著** | 3／5／10.4（−9.9–30.6）／.147，**不顯著** |
| 21 | Interlinear | 1／4／16.0（8.5–23.5）／.004 | 0／0／—（沒有資料） |
| 22 | In-text（緊接在字後） | 4／12／11.0（−0.4–22.4）／.055，**不顯著** | 3／4／6.5（−19.0–32.1）／.412，**不顯著** |

類型之間的兩兩比較：

| # | 結果 | 數字 | 位置 | 原文一句 |
|---|---|---|---|---|
| 23 | 立即：選擇題式高於 in-text、interlinear、marginal | 對 in-text b = 0.142，p = .026；對 interlinear b = 0.092，p = .026；對 marginal b = 0.074，p = .035 | L746–748 | 「multiple-choice glosses contributed to significantly higher scores than in-text glosses (b = 0.142, p = .026), interlinear (b = 0.092, p = .026), and marginal (b = 0.074, p = .035)」 |
| 24 | 立即：interlinear 高於 in-text、低於 marginal | 對 in-text b = 0.050，p = .044；對 marginal 原文寫 b = 0.142，p = .023 | L748–751 | 「Interlinear glosses were significantly higher than in-text glosses (b = 0.050, p = .044) and significantly lower than marginal glosses (b = 0.142, p = .023), but note that only four ESs from Zarei and Hasani (2011) accounted for interlinear glosses.」 |
| 25 | 立即：**原文沒有報告 glossary 與任何其他類型有顯著差異**；也沒有報告 marginal、hyperlinked 與 in-text 有顯著差異 | 正文只列出 #23、#24 那五組 | L746–751 | — |
| 26 | 延宕：類型之間沒有任何一對顯著 | — | L755–756 | 「Multiple comparisons did not find any significant differences between each of the other gloss types.」 |
| 27 | 延宕的排序 | 選擇題式 > hyperlinked > marginal > glossary > in-text | L752–754 | 「The most effective gloss type on delayed posttests was multiple-choice, followed by hyperlinked, marginal glosses, glossaries, and in-text glosses in that order.」 |

注意：#24 的 interlinear 對 marginal「b = 0.142」與 Table 3 不合（17.8 − 16.0 = 1.8 個百分點，不是 14.2；0.142 正好是選擇題式減 in-text）。應是作者稿的筆誤，正確係數讀不到。

### RQ3：註解語言（Table 4，L950–1045，PDF 第 18 頁）

納入研究數（L930–931）：L1 31、L2 25、L1 plus L2 3、無註解 30。

| # | 語言 | 立即：k／n／差（CI）／p | 延宕：k／n／差（CI）／p |
|---|---|---|---|
| 28 | L1 plus L2 | 3／4／23.7（9.0–38.5）／.021 | 3／4／16.0（7.1–24.8）／.017 |
| 29 | L1（母語） | 30／77／20.3（15.4–25.3）／< .001 | 27／56／16.1（11.4–20.7）／< .001 |
| 30 | L2（目標語） | 23／65／16.3（10.9–21.8）／< .001 | 21／47／10.9（6.0–15.8）／< .001 |

| # | 結果 | 數字 | 位置 | 原文一句 |
|---|---|---|---|---|
| 31 | **立即：L1 對 L2 沒有達到 5% 顯著** | 差 4.0 個百分點，**p = .075** | L934–935 | 「Multiple comparisons revealed that L1 glosses contributed to 4.0% higher gains than L2 glosses (b = 0.040, p = .075).」 |
| 32 | 立即：L1 plus L2 對 L1、對 L2 都不顯著 | p = .367；p = .139 | L935–937 | 「There were no significant differences between L1 plus L2 glosses and L1 (p = .367) and between L1 plus L2 glosses and L2 (p = .139).」 |
| 33 | 延宕：L1 高於 L2，顯著 | 差 5.2 個百分點，p = .048 | L941–943 | 「multiple comparisons found the same results as immediate posttests; that there was a statistical significance between L1 and L2 glosses (b = 0.052, p = .048)」 |
| 34 | 延宕：L1 plus L2 對 L1、對 L2 都不顯著 | p = .962；p = .138 | L943–944 | 同段 |
| 35 | 語言 × 程度交互作用不顯著 | 立即 p = .430；延宕 p = .340。各程度的研究數：L1 註解初級 8、中級 11、進階 3；L2 註解同為 8、11、3 | L1230–1242 | 「did not find any significant interaction between gloss languages and proficiency (p = .430, p = .340, respectively), suggesting that L1 glosses yielded greater learning than L2 glosses, regardless of participants' L2 proficiency. However, this result should be interpreted with caution because a small number of studies included advanced learners」 |

### RQ4：註解模態（Table 5，L1073–1168，PDF 第 20 頁）

納入研究數（L1052–1053）：textual 42、pictorial 5、auditory 2。

| # | 模態 | 立即：k／n／差（CI）／p | 延宕：k／n／差（CI）／p |
|---|---|---|---|
| 36 | Auditory | 2／3／36.3（1.9–70.7）／.047 | 2／3／36.8（−40.9–114.5）／.108，不顯著 |
| 37 | Pictorial | 4／8／25.4（4.7–46.1）／.029 | 3／6／15.0（5.0–25.1）／.023 |
| 38 | Textual | 39／143／18.0（13.4–22.5）／< .001 | 36／104／12.7（9.1–16.4）／< .001 |

| # | 結果 | 數字 | 位置 | 原文一句 |
|---|---|---|---|---|
| 39 | 立即：模態之間沒有任何顯著差異 | — | L1058–1059 | 「Multiple comparisons did not find any significant differences across different gloss modes.」 |
| 40 | 延宕：auditory 對 pictorial 邊緣（p = .091）；textual 對 auditory p = .177；textual 對 pictorial p = .396 | b = 0.221 | L1064–1067 | 「auditory glosses were marginal significantly higher than pictorial glosses (b = 0.221, p = .091)」 |

L1061 提到「Figure 6」，作者稿裡沒有任何圖。

### RQ5：文本與學習者特徵（Table 6 立即，L1255–1452，PDF 第 23–24 頁；Table 7 延宕，L1458–1661，PDF 第 25–26 頁）

「主效果」＝該變項與增益的關係（不論有無註解）；「交互作用」＝該變項是否改變註解的效果。下表數字取自對過版面的表。

| # | 變項 | 立即：主效果 p／交互作用 p | 延宕：主效果 p／交互作用 p | 備註 |
|---|---|---|---|---|
| 41 | 教材是否為 L2 學習者而寫 | .229／.223 | .137／.540 | 為母語者而寫 k = 5（立即）、4（延宕）；為 L2 學習者 27、26 |
| 42 | 文本理解度（理解測驗得分百分比） | **.016**／.341；主效果係數 .004 [.001, .007]，k = 15，n = 83 | **.009**／.252；係數 .004 [.001, .007]，k = 14，n = 57 | 理解分數每高 10 個百分點，估計增益高 4 個百分點（L1186–1187） |
| 43 | 目標字佔比 | .938／.716 | .898／.866 | k = 30、28 |
| 44 | 文體（說明文為參照，敘事文） | .472／.171 | .800／.139 | 說明文 k = 18、15；敘事文 14、16 |
| 45 | CALL（螢幕閱讀） | .614／.942 | .491／.850 | No-CALL k = 26、23；CALL k = 15、15 |
| 46 | 程度（初級為參照） | .262／**.048**；中級交互作用 .125 [−.003, .253]；進階 −.062 [−.233, .110] | .331／.145；中級 .132 [.035, .229]；進階 −.041 [−.216, .135] | 初級 k = 9、7；中級 13、14；進階 3、2 |
| 47 | 就讀機構（中學為參照） | .398／.242 | .914／.150；語言學校交互作用 .183 [.027, .338] | 中學 k = 4、5；大學 30、27；語言學校 5、4 |

| # | 結果 | 數字 | 位置 | 原文一句 |
|---|---|---|---|---|
| 48 | 理解度與註解各自獨立作用 | 交互作用不顯著 | L1188–1191 | 「reading comprehension and Glossing independently influenced vocabulary learning from reading (i.e., glossing may promote vocabulary learning regardless of how well learners comprehend texts)」 |
| 49 | 立即：中級學習者從註解得益最多 | 中級比初級多 12.5 個百分點（p = .026）；中級比進階多 18.7（**p = .055**，原文稱 significantly）；初級對進階 p = .395 | L1224–1227 | 「intermediate learners benefitted from glosses significantly more than beginners (b = 0.125, p = .026) and advanced learners (b = 0.187, p = .055)」 |
| 50 | 延宕：語言學校學生得益較多（整體交互作用不顯著，作者稱 trend） | 對中學 b = 0.183，p = .030；對大學 b = 0.170，p = .088 | L1246–1249 | 「there was a trend on the delayed posttests that language school students benefitted more from glossing more than secondary school (b = 0.183, 95% CI [0.338, 0.273], p = .030)」 |
| 51 | 螢幕閱讀沒有優勢；作者指出這個變項只編了「教材是否在螢幕上」，沒管註解怎麼給 | 見 #45 | L1799–1813 | 「this meta-analysis operationalized CALL use as whether reading material was presented on a computer screen (as opposed to paper) without considering how the glosses were provided」 |

### 附錄 5 的結果（`yanagisawa2020-supplementary/S0272263119000688sup001.txt`）

| # | 結果 | 數字 | 行號 |
|---|---|---|---|
| 52 | 發表狀態不影響增益或註解效果 | 主效果立即 p = .245、延宕 p = .611；交互作用 p = .255、.583 | L4 |
| 53 | Egger 檢定不顯著；延宕後測的漏斗圖「略不對稱」 | 立即：增益 p = .512、註解效果 p = .324；延宕：p = .648、p = .182 | L5 |
| 54 | 沒有檢查受試者是否真的不認識目標字的研究（4 篇），延宕後測的註解效果較小 | 交互作用 p = .001；比直接控制的研究低 13.2 個百分點（p < .001），比做前導研究的低 9.9（p = .049）。剔除後重跑，作者說結果相似 | L18–19 |
| 55 | 分派方式不影響結果 | 隨機分派 29 篇、原班分派 10 篇、依程度系統分派 2 篇、其餘未報告；主效果 p = .659、.389；交互作用 p = .121、.814 | L20 |
| 56 | 延宕後測拖越久註解效果略減，邊緣 | b = −0.003／天，p = .091；主效果 p = .474 | L21 |
| 57 | 剔除有前測分數的研究後重跑，結果相同 | 42 篇中 29 篇（69%）目標字全為生字；前測分數當預測變項：增益 p = .265、.271；註解效果 p = .522、.149 | L24–25 |

## 作者自己列的限制

1. 只看學習增益，不知道某種形式為什麼比較好；要靠眼動或放聲思考研究（L1831–1839）。
2. 行間註解與聲音註解的研究太少（L1840–1842）；文末詞彙表與文內註解的研究也只有 2–4 篇（L1736–1737）。
3. 進階學習者的研究只有 3 篇，其中只有 Choi (2016) 比過 L1 與 L2；語言 × 程度的結論不穩（L1768–1770、L1842–1846）。
4. 各研究報告程度的依據不一，40% 沒說怎麼判定（L1213–1214、L1846–1849）。
5. 多數研究只量形義連結，沒量字彙知識的深度（L1849–1854）。
6. 各因素會混在一起，例如程度低的受試者會被配到較簡單的文章，統合分析拆不開（L1854–1866）。
7. 只有 16 篇（38.1%）報告測驗信度（L1868–1870）。
8. 39 篇（92.9%）是外語情境，第二語言情境只有 3 篇（L1874–1879）。
9. 教材、測驗、指導語常沒寫清楚，所以沒辦法分析「被註解的字有沒有加底線或標色」「測驗用哪種語言」「有沒有明確叫受試者查生字」這些變項（L1880–1884）。
10. 所有納入研究都是附帶學習、以讀懂文章為目的；作者自己用這一點解釋為何受試者可能略過註解（L1729–1733）。這不在限制一節，但等於界定了結論的適用範圍。

## 與摘要說法不一致的地方

1. **「L1 glosses yielded greater learning than L2 glosses」（L18–19）**：立即後測的差是 4.0 個百分點、p = .075，依作者自訂的 5% 水準沒有顯著；只有延宕後測顯著（5.2 個百分點、p = .048）。摘要沒有分立即與延宕。正文 L941–943 還把延宕結果說成「found the same results as immediate posttests; that there was a statistical significance」，等於把立即的 p = .075 也當成顯著。
2. **「in-text glosses and glossaries were the least effective gloss types」（L17–18）**：
   - 文末詞彙表的點估計並不是最低：立即 17.4，排六種裡第四，與頁邊註解的 17.8 幾乎相同；延宕 10.4，排五種裡第四。點估計最低的是 in-text（11.0、6.5）。
   - 「最弱」的依據是這兩種對無註解不顯著。但詞彙表立即只有 k = 2、n = 3，信賴區間 −27.7 到 62.5，是估不準，不是量到效果小。
   - 類型之間的直接比較裡，詞彙表沒有顯著輸給任何一種；in-text 只在立即後測顯著輸給選擇題式與行間註解。延宕後測沒有任何一對顯著。
3. **「Multiple-choice glosses were the most effective」（L17–18）**：立即後測有兩兩比較支持（高於 in-text、interlinear、marginal），但沒有報告高於 hyperlinked 或 glossary；延宕後測只是點估計最高，沒有任何一對顯著。
4. **「no significant difference among modes of glossing」**：相符。
5. **「Learning gains were moderated by test formats, comprehension of text, and proficiency」**：測驗格式與理解度相符；程度的主效果不顯著（p = .262、.331），顯著的是立即後測的程度 × 註解交互作用（p = .048），延宕不顯著（p = .145）。

正文與表之間另有幾處對不上（都以對過版面的表為準）：

- L755：延宕後測「In-text glosses and glossaries did not significantly differ from non-gloss (p = .147, p = .412, respectively)」，Table 3 是 glossary .147、in-text .412，順序相反。
- L1185、L1188：理解度立即主效果正文 p = .018、交互作用 p = .437；Table 6 是 .016、.341。
- L1192：理解度延宕主效果正文「p = 0.09」且稱 significantly；Table 7 是 .009。
- L1198：正文說說明文 18 篇、敘事文 17 篇；Table 6 是 18、14，Table 7 是 15、16。
- L1201–1202：正文說螢幕閱讀 28 篇、紙本 16 篇（加起來 44，超過 42）；Table 6 是 No-CALL 26、CALL 15，多寡方向相反。**哪一邊對，從作者稿判斷不出來。**
- L1206：正文說中級 16 篇；Table 6、7 是 13、14。
- L1248：正文的信賴區間「[0.338, 0.273]」是誤植；Table 7 是 [.027, .338]。
- L1685–1687 討論段說詞彙表與 in-text 在立即與延宕都對無註解不顯著，與 Table 3 相符。
- 附錄 3 逐列數出有無註解條件的研究是 29 篇，正文說 30 篇（L735、L931）；附錄 5 寫已發表 34 篇「79.1%」，34/42 是 81.0%。

## 與清單「要撐的結論」不合的地方

清單寫：「有註解比沒有好；母語註解較好；緊貼字旁與文末詞彙表最弱」。

1. **「有註解比沒有好」撐得住**，但要帶條件：量的是外語學習者在**不知道要考字彙**的情況下讀文章，事後記住幾成生字的意思（立即 45.3% 對 26.6%，約兩週後 33.4% 對 19.8%）。量的不是讀懂文章，也不是讀者有意要學的情況。
2. **「母語註解較好」只撐得住一半**：延宕後測顯著（差 5.2 個百分點，p = .048），立即後測不顯著（差 4.0，p = .075）。而且目標語註解對無註解本身就明顯有效（16.3、10.9，都 p < .001），作者自己強調這點（L1771–1774）。這裡的「母語註解」是把外語生字翻成母語，與本站的情況（中文文章裡的術語要不要附英文原文）方向不同，不能直接套。
3. **「緊貼字旁與文末詞彙表最弱」要改寫**：
   - 「緊貼字旁」若指 in-text（寫在字後面、文句之中），它的點估計確實最低，立即後測顯著輸給選擇題式（差 14.2）與行間註解（差 5.0）；但對頁邊、超連結、詞彙表都沒有報告顯著差異，延宕後測沒有任何差異顯著。
   - 「文末詞彙表最弱」原文撐不住：點估計與頁邊註解幾乎相同，只是研究太少（立即 2 篇 3 個效果量）所以對無註解不顯著。能說的是「文末詞彙表的研究少到估不出來」。
   - 作者對兩者為何較差的解釋（詞彙表太遠所以懶得翻、文內註解太近所以不用處理那個字，L1719–1733）是推測，原文用的是 may、might、could、「It is reasonable to speculate」，沒有資料檢驗。
4. 清單「目前找不到可精讀來源」那一節說這篇「量的是記住外語生字，不是理解」，這點讀完全文後確認是對的。另外要補一句：理解度在這篇裡是調節變項，不是結果變項（文章越讀得懂，生字記得越多；註解的效果不隨理解度改變）。
5. 清單沒提、但可能用得上的：效果最好的是讓讀者從幾個候選意思裡選一個（立即比頁邊註解多 7.4 個百分點，p = .035），作者的解釋同樣是推測；作者也提到選擇題式註解可能妨礙讀懂文章（L1715–1716，引 Martínez-Fernández 2008，並註明 Rott 2005 持相反看法）。

## 讀取紀錄

- 原文檔 `yanagisawa2020-glossing.txt` 依序讀：L1–560、L560–1259、L1259–1818、L1818–2177，首尾相接，涵蓋全文 2,177 行。其中 L1898–2154 是參考文獻，掃過；L2156–2161 附錄目錄；L2167–2177 兩則註腳。
- 表格對 PDF：Table 1、2、3、4、5、6、7 全部用 `pdftotext -layout` 重轉後逐格對過（重轉檔在 scratch 目錄，未存入 repo）。原文檔的 Table 6、7 有幾格順序被打亂（例如 L1305–1328 理解度與目標字佔比的 p 值交錯），上面一律用版面版的數字。
- 線上附錄：附錄 2（`sup004.txt` 89 行）、附錄 3（`sup003.txt` 117 行，115 列資料逐列讀過並數過分布）、附錄 4（`sup002.txt` 38 行）、附錄 5（`sup001.txt` 26 行）全文讀完；附錄 1（`sup005.txt` 44 行）是納入研究的書目，掃過。附錄 4 的公式圖與附錄 5 的漏斗圖沒有看到。
- 沒讀到的：刊出版（付費牆）。作者稿與刊出版的數字是否一致，沒有核對。
