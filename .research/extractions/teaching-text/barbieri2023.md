# 抽取紀錄：Barbieri、Chawla、Miller-Cotto、Clerjuste 2023，Educational Psychology Review 35:11

合法公開來源：https://www.danamillercotto.com/uploads/4/7/7/2/47725475/barbieri_et_al__2023__we_meta-analysis.pdf （共同作者 Dana Miller-Cotto 的個人網站，Springer 排版的刊出版，2026-10-14 核對）。重新下載與手上的 `.work/teaching-text-research/src/barbieri2023.pdf` 位元組完全相同（1,154,449 位元組）。出版者頁（DOI 10.1007/s10648-023-09745-1）是付費，Unpaywall 標 closed；公開的是作者自己放的出版者版面。

原文檔：/Users/vincent/Work/study/quidproquo/.work/teaching-text-research/seq/barbieri2023.txt（共 2,678 行、102,543 位元組）
PDF：/Users/vincent/Work/study/quidproquo/.work/teaching-text-research/src/barbieri2023.pdf（Table 1、Table 2 用 `pdftotext -layout` 重抽對過）
讀取日期：2026-10-13

說明：文字檔第 597–1819 行是 Table 1（橫排的四頁表格），被拆成一行一格、欄位順序顛倒，從文字檔本身還原不了；用 layout 版重抽後 43 列都能逐列對上，下面 Table 1 的統計以 layout 版為準。

## 研究設計

- **研究類型**：統合分析；穩健變異估計（RVE）、隨機效果模型；調節變項用 meta-regression（第 27–30、392–394、1829–1832 行）。
- **問題**：例題對數學表現的平均效果，以及什麼調節這個效果（第 22–24、373–376 行）。作者說這是第一份針對數學例題效果的統合分析（第 24–25、78–80 行）。
- **例題效果的定義**：「These are implemented by replacing some or all problem-solving practice with worked examples to study, and examples are sometimes paired with similar practice problems.」（第 76–78 行）
- **檢索**（第 491–518 行）：
  - 第一輪：ERIC、PsycINFO、ProQuest Dissertations and Theses Global。檢索詞：worked examples／erroneous examples／incorrect examples／faded worked examples，各自 AND math/mathematics。
  - 「The ERIC and PsycINFO searches yielded an initial result of 763 items with 128 duplicates, while the ProQuest Dissertations and Theses Global yielded an initial result of 6726.」（第 496–498 行）
  - 另外：手動查引文（前向得 1 篇、後向得 4 篇，第 473–476 行）、在學術郵件論壇（COGDEVSOC）與 Twitter 徵求未發表研究（第 498–500 行）。
  - 第二輪：加 Web of Science，檢索詞把 mathematics 換成 statistics，「This second round yielded 534 abstracts to be screened.」（第 500–518 行）
  - 摘要寫篩了 8,033 篇摘要（第 26 行）。內文列的數字（763、128 篇重複、6,726、534）怎麼加出 8,033，原文沒有說；Fig. 1 流程圖沒有轉成文字。限制一節另寫「reviewing 6726 dissertation abstracts and approximately 1300 published works」（第 2275 行）。
- **納入標準**（PICOS，第 416–428 行）：對象是從幼兒園到成人的數學學習者；介入是以數學技能為目標的任何例題教材；結果是任何數學表現量數（正確率或解題錯誤數）；場域是實驗室或課堂。
- **對照組是什麼**（任務書指定要查）：
  - 「The comparison groups we focus on are worked examples for the treatment and any control group that does not include worked examples. This included a business-as-usual control or problem-solving control.」（第 422–425 行）
  - 研究概述段：「compared to a non-worked example-based control (e.g., a business-as-usual control or a problem-solving control)」（第 375–376 行）；「an appropriate control group (i.e., one that did not use examples)」（第 379–391 行）。
  - 結論段只講解題：「compared to solving practice problems alone」（第 2360 行）。
  - 討論段提到對照組「(e.g., often problem-solving alone)」（第 2204 行）。
  - 兩種對照組各佔多少、有沒有分開估計：原文沒有說。
- **排除標準八條**（第 440–466 行）：非英文；不是例題研究；內容不是數學（統計課若以軟體操作或寫程式為主也排除）；沒有連續的數學表現量數；質性研究；沒有不含例題的對照組；沒有隨機分派（學生或班級層級都可；沒有隨機分派但說明了分派機制的保留為準實驗，只有兩個研究）；例題是合作使用的（分析單位是學生）。
- **篩選與編碼**：每篇由兩位編碼者各篩一次，討論到 100% 一致（第 520–527 行）。資料抽取由兩位獨立編碼，初始一致率 91.40% 到 100.00%（第 537–541 行）。缺資料時聯絡作者，兩次沒回再聯絡共同作者；有 2 篇因此排除，最後 43 篇（第 542–559 行）。
- **編了哪些東西**（第 530–537 行）：每個後測的平均、標準差、人數；結果類型（正確率、錯誤數）；年級或年齡；由誰施測（研究者、教師、電腦家教）；內容（代數、幾何等）；例題類型；**例題是單獨呈現還是搭配練習題**；有沒有搭配自我解釋提示；用在初學還是練習。
- **三個調節變項**（第 562–567、1947–1972 行），各自一個獨立的模型、各一個虛擬變項：
  1. 例題類型：只用正確例題＝1；錯誤例題（單獨或和正確例題並用）＝0。
  2. 自我解釋提示：有搭配＝1；參照組是沒有搭配。
  3. 使用時機：用於練習＝1；參照組是用於初學（較大的那一組）。
  作者說選這三個是因為它們在納入研究裡變化最常見（第 216–218、394–397 行）。「例題是否搭配練習題」有編碼，但沒有當調節變項分析。
- **先備知識**：不做統計分析，只對 12 篇做敘述整理。理由：不是每個研究都有前測（「pretest only administered in 45% of the included effect sizes」，第 358 行），前測和後測不一定相同，各研究量法不同，而且沒有公認的方法統合交互作用項（第 568–578 行）。
- **效果量**：Hedges' g，用實驗組與對照組的平均、標準差、人數算（第 580–590 行）。同一篇有多個效果量，用 RVE 處理巢套（第 592–594、1829–1832 行）。
- **異質性**：I²；作者說研究數少時 Q 的檢定力低（第 1834–1849 行）。
- **受試者與材料**（第 1853–1886 行；Table 1）：
  - 43 篇文章、55 個研究、181 個效果量。55 個研究裡 2 個是準實驗（Carroll 1994 用前測配對；van Loon-Hillen 等 2012 一班實驗一班對照），其餘 53 個隨機分派（第 1853–1862 行）。
  - 35 篇用正確例題、13 篇用錯誤例題、3 篇有比較條件、6 篇用漸退例題（第 1862–1863 行）。
  - 「Most studies were conducted on middle school mathematics students and beyond, with only five studies conducted at the elementary school level. As such, most of the content targeted was either algebra or geometry.」（第 1863–1865 行）
  - 23 篇在美國做，20 篇在美國以外（第 1865–1878 行）。
  - 教師施測 22 篇、研究者施測 11 篇、電腦家教 10 篇（第 1879–1880 行）。
  - 結果量數多數是正確率，只有 3 篇報告解題錯誤數（第 1880–1882 行）。
  - 只有 4 篇在 2007 年（含）以前發表（第 1882–1884 行）。
  - 結論段：91% 在學校做、7% 在實驗室；26% 是抽離式研究、65% 在課堂情境（第 2361–2363 行）。
  - 60% 的文章內容是代數或幾何（第 2349 行）；93% 的文章只用正確率當結果（第 2262–2264 行）。
- **Table 1 的逐列統計**（layout 版；以下計數是我從表數出來的，原文沒有列這些合計）：
  - 43 列。「Examples paired」欄：PP（搭配練習題）29 篇、WE（例題單獨）14 篇。
  - 「Self-explanation prompts」欄：E（有提示）14 篇、E 與 N 都有 2 篇（Miller-Cotto 2017；Miller-Cotto 與 Auxter 2019）、N（沒有）27 篇。
  - 例題類型含 I（錯誤例題）的 13 篇裡，10 篇的自我解釋欄是 E（Adams 2014、Barbieri 與 Booth 2016 與 2020、Barbieri 與 Devlin 其中一列、Barbieri 等 2021、Begolli 等 2021、Booth 等 2013、Booth 等 2015c、McLaren 等 2015、Mwangi 與 Sweller 1998）；另 3 篇是 N（Barbieri 與 Devlin 另一列、Booth 等 2015b、Fitzsimmons 等 2021）。也就是「有自我解釋提示」和「含錯誤例題」在文章層級高度重疊。原文把兩者放在各自獨立的模型裡估，沒有討論這個重疊。
  - 表題是「Descriptions of included published studies」，但列裡有博士與碩士論文（Chen 2016、Cook 2017、Cozean 2010、Earnshaw 2014、Miller-Cotto 2017、Zimmerman 2015、Zormelo 2018）、研討會論文（Schwonke 等 2007）與兩列「Barbieri and Devlin, under review」。書目裡標星號的 43 筆有 Barbieri、Booth 與 Chawla 2022，Table 1 沒有這一列，而「Barbieri and Devlin, under review」在書目只有一筆、在表裡有兩列；哪一列對應 2022 那篇，原文沒有說。
  - 大學生或成人樣本 9 篇（Cook、Hilbert、Hsiao、Likourezos、Miller-Cotto 與 Auxter、Newman 與 DeCaro、Nye、van Harsel、Zimmerman）。

## 結果（逐項）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 整體效果 | g = 0.48，95% CI 0.36–0.60，p = 0.01，τ² = 0.5854 | 有例題的條件對不含例題的對照組（照常教學或解題） | The Worked Example Effect on Mathematics Outcomes | 1895–1897 | "The average effect size was g = 0.48 within our robust variance estimation (RVE) model with a 95% CI from 0.36 to 0.60, p = 0.01, 𝜏 2=0.5854." |
| 2 | 作者的定性 | medium | Cohen 的標準 | 同上 | 1897–1898 | "According to Cohen's standards, worked examples have a medium effect on mathematics outcomes." |
| 3 | 異質性 | I² = 93.72% | — | 同上 | 1898–1899 | "Significant heterogeneity was also detected, with I 2 = 93.72%." |
| 4 | 效果量的分布 | −0.88 到 4.66；38 個負向、4 個為零、139 個正向 | 181 個效果量 | 同上 | 1893–1895 | "After this reversal, effect sizes ranged from − 0.88 to 4.66. There were 38 effect sizes in the negative direction, four effect sizes with a value of zero and 139 in the positive direction." |
| 5 | 符號反轉 | 3 篇（Barbieri 等 2021、Carroll 1994、Reed 等 2013）以錯誤數或迷思為結果，符號反轉 | — | 同上 | 1888–1893 | "Thus, signs were reversed in these cases to represent the benefit or improvement." |
| 6 | 漏斗圖 | 作者目視判斷大致對稱 | — | Publication Bias | 1906–1907 | "Inspection of the contourenhanced funnel plots (see Fig. 3) demonstrated a relatively symmetric shape around the mean." |
| 7 | Egger 檢定 | B = −0.45，z = 5.87，95% CI [−0.78, −0.12]，p < 0.0001 | — | Publication Bias | 1907–1909 | "Results of the Egger's test indicated a significant intercept, B =  − 0.45, z = 5.87, 95% CI [− 0.78, − 0.12], p < 0.0001, suggesting publication bias." |
| 8 | Trim-and-fill 校正 | g = 0.44，SE = 0.06，95% CI [0.32, 0.56]，p = 0.0001 | 校正前 0.48 | Publication Bias | 1909–1911 | "subsequent trim-and-fill analyses showed that the effect of worked examples on mathematics performance would still be positive and significantly different from zero after adjusting for publication bias (g = 0.44, SE = 0.06, 95% CI [0.32, 0.56], p = 0.0001." 補了幾個研究原文沒有說。 |
| 9 | Fail-safe N（Rosenberg） | 13,915 | — | Publication Bias | 1911–1945 | "the fail-safe N test using the Rosenberg approach indicated that 13,915 studies would be needed to reverse the positive, significant effect size observed in the current study. Thus, no further publication bias tests were conducted." |
| 10 | 調節模型 1：只用正確例題 | β = 0.26，SE = 0.10，p = 0.027（內文寫 p = 0.03）；139 個效果量對 42 個（錯誤例題單獨 14、與正確例題並用 28） | 參照組：錯誤例題單獨或與正確例題並用 | Moderator Results、Table 2 | 1948–1952、1976–1977、2018–2024 | "correct worked examples (β = 0.26; p = 0.03) had a significant positive impact on the worked examples effect" |
| 11 | 調節模型 2：搭配自我解釋提示 | β = −0.24，SE = 0.11，p = 0.042（內文寫 p = 0.04）；57 個效果量對 124 個 | 參照組：沒有搭配提示的例題條件 | 同上 | 1952–1956、1977–1979、2038–2051 | "example-based conditions paired with self-explanation prompts had a significant negative impact on the worked examples effect, with (β =  − 0.24, p = 0.04)." |
| 12 | 調節模型 3：用於練習 | β = −0.15，SE = 0.16，p = 0.378（內文寫 p = 0.38）；82 個效果量對 99 個 | 參照組：用於初學 | 同上 | 1956–1974、2059–2075 | "although the example effect did not vary by timing of administration (β =  − 0.15; p = 0.38), it did indeed vary by correctness and whether examples were paired with explanation prompts." |
| 13 | 比例 | 沒有提示 69%、有提示 31%；正確例題 77%、其餘 23% | 效果量的比例 | Discussion | 2207–2214 | "a larger proportion of effect sizes corresponded to worked examples conditions without explanation prompts (69%) versus with prompts (31%) making the comparison somewhat unbalanced." |

Table 2（第 1999–2089 行；layout 版對過）只有三個係數、標準誤與 p 值。三個模型的截距、各子群自己的效果量（例如有提示的例題條件相對於對照組的 g 是多少）、殘餘異質性、解釋變異量，原文都沒有報告。所以「搭配提示的例題是否仍勝過沒有例題的對照組」原文沒有給數字。

### 先備知識的敘述整理（第 1980–2128 行）

- 43 篇裡 12 篇檢驗了先備知識與處理的交互作用（第 1981–1982 行）。
- 原文對「幾篇有顯著交互作用」前後兩種說法：
  - 「Of the twelve manuscripts that assessed aptitude-by-treatment interactions, two did not yield any significant interaction (i.e., Carroll, 1994; McLaren et al., 2015). The remaining ten manuscripts present at least one significant interaction.」（第 1987–1989 行）
  - 「Four manuscripts found that the effectiveness of varying forms of worked examples did not vary based on prior knowledge or achievement (i.e., Carroll, 1994; McLaren et al., 2015; Miller-Cotto, 2017; Miller-Cotto & Auxter, 2019).」（第 1997–1998 行）接著「However, eight manuscripts did indeed find that the effectiveness of examples varied by prior knowledge.」（第 2104–2105 行）
  - 2 篇對 4 篇、10 篇對 8 篇，原文沒有解釋兩種算法的差別。
- 12 篇的組成：6 篇是代數；4 篇只用正確例題，其中 2 篇的重點是漸退例題與自我解釋提示（Miller-Cotto 2017；Miller-Cotto 與 Auxter 2019）；其餘 8 篇含錯誤例題（第 1989–1996 行）。
- 方向不一：「Yet the direction of these effects varied.」（第 2105 行）
  - 3 篇對高先備者較有利（Bokosmaty 等 2015、Fitzsimmons 等 2021、Hartmann 等 2021）（第 2105–2107 行）。
    - Bokosmaty：幾何的熟手從只有步驟指引的例題受益較多，新手從步驟加定理指引的例題受益較多（第 2108–2111 行）。
    - Fitzsimmons：前測數線估計較準的人，從正確例題加回饋受益多於錯誤例題或解題對照（第 2111–2114 行）。
    - Hartmann：高先備的學生從錯誤例題條件受益多於解題對照（第 2115–2117 行）。（Table 1 裡 Hartmann 等 2021 的例題類型欄只標 T，和這句的「incorrect worked examples condition」對不上；照抄，無法確認哪邊對。）
  - 5 篇對低先備者較有利（Barbieri 與 Booth 2016、2020；Barbieri 等 2022；Booth 等 2015b、2015c）。「What these five studies have in common is that the example conditions included incorrect examples either alone or in combination with correct examples.」（第 2117–2122 行）
- 作者的判定：「this finding is in no way conclusive. Several studies that include incorrect examples in some form do not find them to be especially beneficial for those with low prior knowledge (i.e., Fitzsimmons et al., 2021; Hartmann et al., 2021; McLaren et al., 2015).」（第 2123–2128 行）
- 討論段的摘述（第 2232–2248 行）：「Strong conclusions cannot be made due to the small number of studies that tested aptitude-by-treatment interactions but also due to the variations in example conditions assessed.」兩個一般結論：依 2 個研究，漸退例題的效果不隨先備知識變；依 5 個研究，錯誤例題（單獨或並用）可能對低先備者特別有利，「However, two studies did not find this same pattern of results.」（結果段列的是 3 篇，這裡寫 2 個，照抄。）

## 作者自己的解釋與保留

1. **調節分析是描述性的，不是因果**（三個調節變項都適用）：
   - 研究概述：「the experimental manipulation in these studies is specific to example or control condition, but not necessarily to the moderators examined … Thus, results from moderator analyses are descriptive rather than causal.」（第 397–405 行）
   - 討論：「It is important to note that findings from moderator analyses are not causal primarily because we estimate the effect of these moderators by collapsing across worked examples conditions that may or may not be isolating effects of such features.」（第 2202–2203 行）
   - 「we are generally comparing effect sizes of worked examples conditions with self-explanation prompts to worked examples conditions without prompts across studies, rather than within study, and this type of comparison does not involve a crucial feature for making causal claims: random assignment to condition.」（第 2204–2207 行）
   - 「The same cautionary note applies to findings related to the correctness of example and the practice vs. acquisition results.」（第 2209–2210 行）
2. **自我解釋提示的負向結果**（任務書指定要查）：
   - 作者覺得意外：「The findings related to self-explanation prompts are somewhat surprising as some prior work that estimates the effect of self-explanation prompts suggests them as a useful addition to example-based materials.」並舉兩個在研究內隨機操弄、發現加提示有益的實驗（Barbieri 等 2019；Huang 與 Reiser 2012）（第 2162–2167 行）。
   - 解釋一，提示類型不同效果不同（引 Dunlosky 等 2013），並舉數學以外的例子 Kuhn 與 Katz 2009（兒童被提示自我解釋後表現較差，解釋品質不高）（第 2167–2177 行）。
   - 解釋二，提示引出的自我解釋品質不一：高品質的會引用原理，低品質的和較差的學習有關（第 2178–2185 行）。
   - 解釋三，和其他設計特徵並用時資訊重複，可能產生冗餘效應（第 2185–2186 行）。
   - 無法進一步分析：「Unfortunately, at the time of writing, most articles we reviewed did not provide many details about the types of self-explanation prompts included, preventing us from further coding the types of self-explanation prompts.」（第 2186–2189 行）
   - 比較不平衡（69% 對 31%）（第 2207–2209 行）。
   - 措辭：討論段「seem to be less effective」（第 2161 行）；摘要「may not be a fruitful design modification」（第 37–38 行）；結論段「some supplemental features (i.e., self-explanation prompts) being not necessary or even detrimental to their effectiveness of student performance」（第 2370 行）。結論段的措辭比討論段強。
   - 導言對既有文獻的交代：Rittle-Johnson 等 2017 的統合分析發現提示自我解釋有小到中的效果，但那份不限於搭配例題的情境（第 264–267 行）；「though explanation prompts are generally viewed as a helpful and now almost standard addition to examples, there is still variability in their effectiveness」（第 291–293 行）。
3. **正確例題較好的結果**：
   - 作者同樣覺得意外：「The findings related to correctness of example are somewhat surprising as much work examining the difference between the effectiveness of correct and incorrect examples either does not find a difference (e.g., Barbieri & Booth, 2016) or finds a benefit of incorrect examples (e.g., Barbieri & Booth, 2020).」（第 2226–2229 行）
   - 可能和先備知識有關：「It is possible, however, that correct examples are indeed more beneficial overall (as suggested by the current results) but that incorrect examples alone or in combination with correct examples may be more effective for those with low prior knowledge.」（第 2249–2250 行）
   - 可能和結果量數有關：93% 的文章只用正確率；如果量的是迷思強度或「負面知識」，可能沒有差別或錯誤例題較好。「conclusions on the effects of example type (e.g., varying by correctness) on other forms of important mathematical skills are not possible with the current data.」（第 2250–2265 行）
   - 原本想分開估計的類型（錯誤例題單獨、並用、漸退）因為研究太少只能併成兩類（第 2215–2219 行）。
   - 比例不平衡（77% 對 23%）（第 2213–2214 行）。
   - 理論：「Cognitive load theory does not currently support strong conclusions as to why learning from correct examples might be more favorable for students than incorrect examples.」（第 2342–2344 行）
4. **使用時機沒有差別的結果**：「timing of administration was also not experimentally manipulated in any of the included studies … It may be the case that the reason for using worked examples, whether it is for practice or skill acquisition, matters less than the design features used in combination with worked examples. Still, experimental work is needed」（第 2219–2225 行）。
5. **整體效果的解釋**：讀例題讓學習者把認知資源用在相關特徵與解題過程上，形成該題型的基模（第 2137–2152 行）。
6. **劑量**（任務書指定要查）：見限制第 3 條。作者的推測：「It is likely that a greater dosage of examples would yield a larger effect.」（第 2306–2307 行），沒有資料檢驗。
7. **實務建議**（任務書指定要查；第 2347–2355、2358–2375 行）：
   - 「The current meta-analysis provides additional evidence that worked examples alone or paired with similar practice problems remain a beneficial tool for teaching mathematics across a wide range of mathematics domains, though it is important to note that most manuscripts (60%) are related to algebra or geometry.」（第 2347–2349 行）
   - 建議在數學課堂更廣泛使用，並給教師製作例題的專業發展（第 2349–2351 行）。
   - 「It is important to note that the current findings are specific to the domain of mathematics.」其他領域（工程、電腦科學）要另外做（第 2351–2355 行）。
   - 結論：「studying worked examples alone or paired with similar practice problems are moderately effective at improving learners' mathematics performance across the school years, compared to solving practice problems alone.」（第 2358–2361 行）
   - 「with some forms (i.e., correct examples) being potentially more effective than others (e.g., incorrect examples)」（第 2368–2369 行）。
   - 多數研究在學校做，作者認為這提高了生態效度（第 2361–2366 行）。
8. **導言對 IES 指引的轉述**：2007 年指引對「例題與解題交替」是中等證據（第 93–94 行）；2012 年指引用例題的兩項是中等；2015 年代數指引對「用已解的題目搭配練習題」是最低等級（minimal），只找到三個支持的研究（第 119–127 行）。作者說這些指引「focus primarily on supporting rather than conflicting evidence」（第 129–130 行）。

## 作者列的限制

Strengths and Limitations（第 2269–2315 行）加上散在各處的：

1. 調節分析是跨研究比較，不是因果；三個調節變項都是（第 397–405、2202–2225 行）。「in addition to the limitations already noted about moderator analyses」（第 2292 行）。
2. 先備知識無法量化分析：前測各不相同；有前測的研究是少數（第 2294–2299 行）。「Such an analysis is a problem with meta-analysis as a statistical technique more generally.」
3. 劑量無法分析：「most articles lacked specific measurements of time to incorporate into our coding and analysis. There is great variability in the likely dosage of worked examples within our sample of studies, ranging from less than one class period (e.g., ~ 25 min) to examples administered throughout the academic year. Those that did report a general timing or dosage of examples reported a low dosage of examples (e.g., one class period or a handful of class periods).」（第 2299–2306 行）
4. 約半數研究在美國做；只收英文（第 2311–2315 行）。
5. 例題類型只能併成兩類（第 2215–2219 行）。
6. 自我解釋提示的類型沒有編碼，因為原研究沒交代（第 2186–2189 行）。
7. 93% 的文章只量正確率，對其他數學能力無法下結論（第 2262–2265 行）。
8. 60% 的文章是代數或幾何（第 2349 行）；小學層級只有 5 個研究（第 1864 行）。
9. 結果只適用於數學（第 2351–2352 行）。
10. 方法段的說法：研究數少時 Q 的檢定力低（第 1838–1839 行）；作者自稱「a small sample of studies」（第 581 行）。
11. 作者列的優點裡提到一個背景：例題文獻的研究常集中在少數研究團隊，RVE 用來處理這種巢套（第 2277–2280 行）。

## 與摘要不一致的地方

1. 摘要：「Exclusionary coding was conducted on 8033 abstracts」（第 26 行）。內文列出的檢索結果數字（763 含 128 篇重複、6,726、534）對不出 8,033，限制一節寫「6726 dissertation abstracts and approximately 1300 published works」（第 2275 行）。流程圖沒有文字，無法確認。
2. 摘要：「yield a sample of high quality experimental and quasi-experimental work」（第 26 行）。內文：55 個研究裡 2 個是準實驗，其中 van Loon-Hillen 等 2012 的分派理由作者自己說原文沒交代（第 1855–1861 行）。不算矛盾，但摘要沒有交代比例。
3. 摘要寫自我解釋提示「may not be a fruitful design modification」（第 37–38 行），沒有帶討論段「not causal」「across studies, rather than within study」的保留，也沒提作者自己舉的兩個反例實驗。
4. 摘要寫「Correct examples are particularly beneficial for learning overall」（第 37 行），沒有帶「描述性」與「可能對低先備者相反」的保留。
5. 摘要沒有提出版偏誤（Egger 顯著、校正後 0.44）。
6. 數字（43、55、181、g = 0.48、p = 0.01、三個調節變項的方向）逐項對過，相符。

## 與現有文章稿不一致的地方

第 1 篇＝ `2026-10-13-teaching-text-evidence.md`，第 2 篇＝ `2026-10-13-teaching-text-questions-feedback.md`。

1. **第 1 篇第 9 行**（tldr）：「給一題走得完的例題（數學的統合分析 g = 0.48）」→ 相符（第 1895 行）。
2. **第 1 篇第 30 行**（結論表）：「數學例題的統合分析 g = 0.48｜強，但幾乎都是數學解題」
   - 數字相符。「幾乎都是數學」不準：納入標準就限定數學（第 445–449 行），是全部。原文給的比例是 60% 的文章為代數或幾何（第 2349 行）、93% 只量正確率（第 2262–2264 行）。
   - 建議改：「強，但只收數學，九成只量解題正確率」。
3. **第 1 篇第 49 行**：「彙整了 55 個數學學習的實驗，對照組沒有例題，多半是直接做題。讀例題的學生成績平均高出 0.48 個標準差。」
   - 55：相符，但其中 2 個是準實驗（第 1855–1857 行），「55 個實驗」略寬。
   - 對照組：原文是「a business-as-usual control or problem-solving control」（第 424–425 行）。「多半是直接做題」原文沒有給比例，最接近的是討論段的「(e.g., often problem-solving alone)」（第 2204 行）與結論段「compared to solving practice problems alone」（第 2360 行）。建議改成「對照組沒有例題，是照常上課或只做題」。
   - 0.48 個標準差：相符（「almost half of a standard deviation (g = 0.48)」，第 2133 行）。
   - 「IES 2007…證據等級評為中等」：Barbieri 的轉述相同（第 93–94 行）。
4. **第 1 篇第 51 行**：「只放正確解法的例題，效果比混入錯誤解法的例題大。例題用在初學階段或用在教完之後的練習，效果沒有差別。」
   - 方向相符（第 1973–1977 行）。
   - 對照條件只寫了一半：參照組是「錯誤例題單獨（14 個效果量）或與正確例題並用（28 個）」（第 1950–1952 行），不只是「混入」。
   - **漏掉作者的保留**（這是這份來源最大的一條）：三個調節結果作者都說是描述性、不是因果（第 405、2202–2210 行）。稿子第 155 行只對自我解釋提示寫了這個保留，第 51 行這兩句沒有。作者還說正確例題較好的結果「somewhat surprising」，因為直接比較的實驗多半沒差別或錯誤例題較好（第 2226–2229 行），而且 5 篇研究顯示錯誤例題可能對低先備者較有利（第 2117–2122、2247–2250 行）；使用時機在納入研究裡沒有任何一個做過研究內的操弄（第 2219–2222 行）。
   - 建議改：「跨研究比較下，只用正確例題的研究效果量較大（β = 0.26），用在初學或練習沒有差別。作者說這些是描述性的比較，不是因果；直接比較正確與錯誤例題的實驗多半沒有差別或錯誤例題較好，有幾篇顯示錯誤例題對先備知識低的學生較有利。」
5. **第 1 篇第 53 行**：「後半句『緊接一題』來自 IES 的交替建議，Barbieri 的統合分析沒有單獨檢驗這個排法，這是我的推論。」
   - 「沒有單獨檢驗」：相符。原文有編碼「例題單獨或搭配練習題」（第 535 行），但沒有當調節變項。
   - 可補的事實：Table 1 的 43 篇裡 29 篇是例題搭配練習題（PP）、14 篇是例題單獨（WE）；作者的結論句是「worked examples alone or paired with similar practice problems」都有效（第 2347、2358–2359 行）。原文用的詞是「similar practice problem」（第 78、221 行），沒有說要「結構相同、數字不同」。
6. **第 1 篇第 155 行**：「Barbieri 等人的統合分析裡，搭配自我解釋提示的數學例題，效果比沒有搭配的小。Barbieri 等人說這是跨研究的比較，各研究的提示怎麼寫多半沒有交代，不能當成因果。」
   - 相符（第 1977–1979、2186–2189、2202–2207 行）。
   - 可補：(a) 作者自己舉了兩個研究內隨機操弄、加提示有益的實驗（第 2164–2167 行），這和稿子引的 Bisra 是同一方向，所以作者自己也沒有把這個結果當成定論；(b) 原文沒有報告「有提示的例題條件相對於對照組」的效果量，只有差值 β = −0.24，所以不能說搭配提示的例題沒有效；(c) 我從 Table 1 數到，含錯誤例題的 13 篇裡 10 篇也有自我解釋提示，兩個調節變項高度重疊而分開估計（這是我的計數，作者沒有討論）。
7. **第 1 篇第 178 行**：「例題的統合分析 I² 是 94%」→ 相符（93.72%，第 1898–1899 行）。
8. **第 1 篇第 179 行**：「例題的統合分析偵測到偏誤，校正後是 0.44」→ 相符（第 1907–1911 行）。
9. **第 1 篇第 180 行**：「例題的證據集中在數學。把它推到『解釋一個機器學習的概念』是我的延伸。」→ 和作者的說法一致（「the current findings are specific to the domain of mathematics」，第 2351–2352 行）。相符。
10. **第 1 篇第 181 行**：「幾項比較是跨研究的，例如預設顯示對點開才看、能重播對不能重播。」→ 這份來源的三個調節變項也屬於這一類，清單裡沒列。建議加「正確對錯誤例題、初學對練習」。
11. **第 1 篇第 193 行**（附錄），逐項：
    - 「篩選 8,033 篇摘要，納入 43 篇文章、55 個研究、181 個效果量」：相符（第 26–27 行）。
    - 「範圍從小學到大學的數學」：相符（「elementary grades to postsecondary settings」，第 23 行）；可補小學只有 5 個研究（第 1864 行）。
    - 「g = 0.48（95% CI 0.36–0.60），I² = 93.72%」：相符。
    - 「Egger 檢定顯著；trim-and-fill 校正後 g = 0.44（0.32–0.56）」：相符。
    - 「只用正確例題 β = 0.26（p = 0.03）；搭配自我解釋提示 β = −0.24（p = 0.04）；用於練習或初學 β = −0.15（p = 0.38）」：相符（Table 2 是 0.027、0.042、0.378）。
    - 「181 個效果量裡 69% 沒有搭配提示」：相符（第 2207–2208 行）。
    - 「43 篇裡有 12 篇檢驗先備知識的交互作用，10 篇至少有一項顯著，作者只做敘述性整理」：和第 1987–1989 行相符，但原文下一段寫 4 篇沒有隨先備知識變、8 篇有（第 1997–1998、2104–2105 行），原文自己前後不一。建議改成不依賴這個數字的寫法：「12 篇檢驗先備知識的交互作用，方向不一：3 篇對高先備者較有利、5 篇對低先備者較有利（都含錯誤例題）、4 篇沒有差別；作者說無法下定論」。
    - 「例題的使用量從不到一堂課（約 25 分鐘）到整學年都有，多數研究沒有報告時間」：相符（第 2299–2304 行）。可補「有報告的多半是低劑量」（第 2304–2306 行）。
    - 「約半數研究在美國做」：相符（第 2311–2312 行；23 篇對 20 篇）。
    - 沒寫但會影響解讀的：調節分析是描述性的；93% 只量正確率；60% 是代數或幾何；fail-safe N 13,915（作者以此為由不再做其他偏誤檢定，第 1944–1945 行）。
12. **第 1 篇第 227 行**（讀取範圍）：「讀了摘要、結果、出版偏誤、調節變項、先備知識與限制」。稿子引用的內容都在這些章節；第 4 條漏掉的保留在「討論」一節（第 2202–2231 行），不在所列的讀取範圍裡。本次已全文讀完，可改成「讀了全文」。
13. **第 2 篇第 163 行**（對照表）：「例題 g = 0.48（Barbieri 等 2023）…｜有支持；缺『例題後接一題自己做』」→ 數字相符。「例題後接一題」Barbieri 沒有檢驗（見第 5 條）。
14. **第 2 篇第 177 行**（建議 3：每節題目要讀者解釋原因）：沒有帶 Barbieri 的反向結果。審稿「建議修 10」指出這一點，**審稿者說得對**；第 1 篇第 155 行有並列，第 2 篇的建議清單沒有比照。
15. **第 2 篇第 267 行**：連結與第 1 篇相同。相符。

審稿報告「沒問題的項目」說 Barbieri 2023 數字核對相符：我逐項對過，數字都相符。審稿者沒找到的同類問題是上面第 4 條（正確例題與使用時機兩個調節結果沒帶「非因果」的保留）、第 2 條（「幾乎都是數學」）與第 11 條（先備知識 10 篇那個數字原文自己前後不一）。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | 1–400 | 標題、摘要、導言、Background、Theoretical Underpinnings、Variations in Design and Use（正確性、自我解釋提示、時機與先備知識）、Overview of the Current Study |
| 2 | 400–799 | Overview 末段（調節分析是描述性的）、Methods：納入與排除標準、檢索程序、排除編碼、資料抽取、調節變項、效果量計算；第 597 行起 Table 1（碎裂） |
| 3 | 800–1199 | Table 1 續（碎裂，一行一格） |
| 4 | 1200–1599 | Table 1 續（碎裂） |
| 5 | 1600–1999 | Table 1 末段與表注（第 1783–1785 行）、RVE 與異質性、Results：Study Descriptors、整體效果、出版偏誤、Fig. 2–3 圖說、調節結果、先備知識敘述整理開頭、Table 2 標題 |
| 6 | 2000–2399 | Table 2、先備知識敘述整理後半、Discussion、Strengths and Limitations、Implications for Theory and Practice、Conclusions、致謝、資料可得性；第 2394 行起 References |
| 7 | 2400–2678 | References（書目，掃過；用來核對 43 筆標星號的納入研究）、出版者聲明 |
| 補 | PDF layout | `pdftotext -layout src/barbieri2023.pdf`：Table 1 四頁（layout 檔第 643–781 行）逐列讀完 43 列；Table 2（layout 檔第 976–986 行） |

Fig. 1（流程圖）、Fig. 2（森林圖）、Fig. 3（漏斗圖）在文字檔裡只有圖說，圖的內容沒有讀到。

## 補記（2026-10-14，複審後整理）

原文檔最後一行沒有換行符號，`wc -l` 少算一行；多出的那一行只有換頁字元，沒有內容。

## 2026-10-14 更正

第 1 行標題的作者順序原本寫成 Barbieri、Miller-Cotto、Clerjuste、Chawla。回原文首頁確認（`.work/teaching-text-research/seq/barbieri2023.txt` 第 8–15 行：Christina Areizaga Barbieri、Kamal Chawla、Dana Miller-Cotto、Sarah N. Clerjuste），正確順序是 Barbieri、Chawla、Miller-Cotto、Clerjuste，已改。
