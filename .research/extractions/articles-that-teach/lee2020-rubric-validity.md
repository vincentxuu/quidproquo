# 抽取紀錄：Lee、Recker、Yuan 2020，Online Learning 24(1)

- **書目**：Ji Eun Lee、Mimi Recker（Utah State University）、Min Yuan（University of Utah）。〈The Validity and Instructional Value of a Rubric for Evaluating Online Course Quality: An Empirical Study〉。*Online Learning* 24(1)，245–263，2020 年 3 月。DOI 10.24059/olj.v24i1.1949。作者姓名與單位對過首頁（L8–12）。首頁的建議引用格式把副標打成「And empirical study」（L31），是原刊的錯字。
- **原文檔**：`.research/raw/learning-content/q6-evaluate/lee2020rubricvalidity.txt`（884 行、64,809 字元）；PDF `lee2020rubricvalidity.pdf`（19 頁）。單欄版面，文字檔段落沒有交錯。
- **讀取日期**：2026-10-14
- **版本**：刊出版（頁尾有期刊名與頁碼 245–263）
- **供哪幾篇使用**：order 26（#6）
- **行號**一律是 `.txt` 的行號；頁碼是期刊頁碼。

## 研究設計

- **類型**：單一大學的觀察性研究，兩部分。(1) 量表的內部一致性信度與探索性因素分析；(2) 路徑分析，把量表分數、LMS 點擊紀錄算出的互動量、課程通過率串起來。沒有任何介入或隨機分派到處理組。作者全篇用「causal relationships」（L20、L73、L646、L672）稱呼路徑分析的結果，但資料是橫斷的相關資料。
- **量表**：AS rubric，由該校 Academic Support 單位的教學設計師合作編成，改自 Quality Matters（QM）量表。9 個面向、51 題，二分計分（Yes = 1、No = 0）（L267–274、L298–299）。作者開頭就說原訂面向有問題（各面向題數 3 到 12 題不等；有的題目不貼合所屬面向），所以「decided to ignore the predefined dimensions and generate new ones」（L275–290）。
- **樣本（研究問題 1）**：美國一所中型公立大學 2012–2016 年開的 2,797 門線上課裡，由教學設計師「randomly selected」202 門評分（L292–295）。大學部 173 門（85.6%）、研究所 29 門（14.4%），跨學門。**每門課只由一位教學設計師評**，在學期初評（L297–298）。
- **樣本（研究問題 2）**：202 門裡有 81 門缺 LMS 互動資料或學生期末成績而排除，剩 121 門、5,240 名學生（L302–304）。分析單位是課程（Table 2 註，L336）。
- **互動量怎麼量**（Table 2，L311–336，對過 PDF p.251）：依 Moore／Anderson 的四類互動，從 LMS（討論段稱 Canvas，L658）點擊紀錄取變項：
  - 教師–內容（IC）：教師張貼的附件數、討論主題數、wiki 主題數、測驗數、作業數，五項平均
  - 學生–內容（SC）：學生平均看的附件數、討論數、wiki 主題數，加上測驗完成比例、作業完成比例，五項平均
  - 學生–學生（SS）：學生平均張貼的討論訊息數（一個變項）
  - 學生–教師（SI）：**教師**張貼的討論訊息數（一個變項）
  - 全部先轉 Z 分數
- **成果變項**：課程通過率＝拿到 A、B、C、D 的人數除以修課人數（L305–308）。5,240 人裡 169 人（3%）成績是 W（開學三週後退選）（L308–310）。沒有量任何獨立的學習測驗。
- **分析**：KR-20 加逐步刪題（每次刪掉會讓 KR-20 上升最多的題，直到不再上升）；四分相關係數後做 EFA（ULS 抽取、Promax 轉軸、負荷量門檻 0.4，用特徵值與平行分析定因素數）；路徑分析用 R 的 psych 與 lavaan（L344–362）。
- **文獻回顧部分**（L110–206）：在 ERIC 與 Google Scholar 用 online course、quality、rubric、evaluation 檢索，加上參考文獻與同事推薦，找到 31 份量表，依三條標準（用於評線上課程品質；兩個以上面向且有定義；用於高等教育）留下 10 份，看發展過程、面向、信效度測試。

## 結果（逐項）

### 文獻回顧的 10 份量表（Table 1，L132–175；本表未另對 PDF 影像，文字檔單欄、欄位沒有錯位）

| # | 結果 | 數字／內容 | 行號 | 原文一句 |
|---|---|---|---|---|
| 1 | 多數量表改自別的量表 | 10 份 | L121–122 | 「most of the rubrics were adapted from other existing rubrics, rather than based on online learning theories or models」 |
| 2 | 有交代修訂過 | 8 份 | L123 | 「eight rubrics noted that they went through several rounds of revisions」 |
| 3 | 公開報告信度或建構效度結果 | 0 份；Table 1 有 8 份標「Not reported」 | L195–196 | 「none of the reviewed rubrics publicly reported the results of reliability or construct validity tests」 |
| 4 | 提到做過實證測試 | 2 份（#4 Palomar College：做過 pilot test 但沒報結果；#10 QM：量過 rater agreement） | L196–198 | 「Only two rubrics (Rubric #4 and #10 in Table 1) noted that they underwent empirical testing, such as a measurement of rater agreement, but details were not reported.」 |
| 5 | 五個共通面向 | 課程設計與介紹；學習目標與評量；互動與合作；學習資源與支援；課程科技與無障礙 | L179–182 | 表列 |
| 6 | 各量表重點不同 | QM 42 題加權，近 30% 權重在學習目標與評量、11% 在互動與合作；加州社區學院那份 48% 的題目在科技與無障礙 | L183–193 | 「Rubric #10 (Quality Matters, 2018) consisted of 42 weighted items with almost 30% of the weight addressing “learning objectives and assessment” and only 11% of the weight focused on “interaction and collaboration.”」 |

作者對 Jaggars & Xu 2016 的轉述（L216–219，二手，本批沒有該文原文）：兩所美國社區學院 23 門線上課，四個量表面向只有「interpersonal interaction」對期末成績有顯著正向影響。

### 研究問題 1：信度與因素結構（Table 3、4、5 都對過 PDF p.252–255）

| # | 結果 | 數字 | 對照／條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 7 | 51 題的初始信度 | KR-20 = .82 | 202 門課，每門一位評分者 | L369 | 「The initial KR-20 coefficient for 51 items was .82.」 |
| 8 | 逐步刪題後 | 刪 8 題（占 16%），43 題 KR-20 = .87 | 同上 | L370–371 | 「eight items were eliminated (16% of the total) (see Table 3), and the KR-20 coefficient for 43 items increased to .87」 |
| 9 | 被刪的 8 題是哪些 | 4 題屬無障礙（#39 影音有字幕或逐字稿、#40 掃描 PDF 可被螢幕閱讀器讀、#41 圖片有文字描述、#42 圖片有 alt）；4 題（#28 資源容易取用、#30 跨作業系統、#31 沒有不合理的軟體要求、#47 對工具與媒體有足夠說明） | — | L372–374、Table 3 L379–386 | 「four of the eliminated items (item #39, #40, #41, #42) were related to the “accessibility” dimension. The other four eliminated items (item #28, #30, #31, #47) related to course technology issues」 |
| 10 | EFA 適合度 | Bartlett χ²[903] = 16200.13，p < .05；KMO = .70 | 43 題、202 門課 | L401–403 | 照抄數字 |
| 11 | 因素解 | 九因素，解釋 73% 變異 | 用特徵值與平行分析選 | L406–410 | 「The nine-factor solution explained 73% of the total variance.」 |
| 12 | EFA 再刪 4 題 | #11（跨兩個因素，負荷量 0.46 與 0.43）、#08、#29、#32（主負荷量不到 .4） | — | L410–413、Table 4 L469–474 | 「another four items were eliminated because one cross-loaded onto two factors, and the other three did not have primary factor loadings of .4 or above」 |
| 13 | 合計刪題 | 12 題（8 + 4），留 39 題；12/51 = 23.5%，作者說「almost one-fourth」 | — | L478、L726–727 | 「almost one-fourth of the rubric items were identified as problematic」 |
| 14 | 留下的題目裡還有一題不合 | #12「Course fees, if any, are explained」落在「Course Facilitation」，作者說不像同一個構念；仍留在 39 題裡 | — | L572–573、Table 5 註 L554 | 「did not seem to measure the same construct as other items, which implies that revisions to the rubric are needed」 |
| 15 | 九個因素與題數 | F1 學習活動與教材 10 題（14% 變異）；F2 課程介紹與設計 4 題；F3 學習者支援 3 題；F4 學習者投入與互動 6 題（F2–F4 各 9%）；F5 學習目標 3 題；F6 課程帶領 4 題（各 7%）；F7 課程資訊 3 題；F8 課程科技 3 題；F9 課程管理 3 題（各 6%） | — | Table 4 L419–421、Table 5 L483–554、L563–578 | 表列 |

Table 4 的特徵值（對過 PDF p.253）：5.99、4.08、3.70、4.03、3.09、3.01、2.51、2.59、2.44。

### 研究問題 2：路徑分析（Table 6 與 Figure 2、3 對過 PDF p.256–257）

Table 6 描述統計（N = 121 門課、5,240 名學生）：

| 變項 | M | SD | Min | Max |
|---|---|---|---|---|
| F1 學習活動與教材 | 0.92 | 0.16 | 0.10 | 1.00 |
| F2 課程介紹與設計 | 0.87 | 0.26 | 0.00 | 1.00 |
| F3 學習者支援 | 0.87 | 0.30 | 0.00 | 1.00 |
| F4 學習者投入與互動 | 0.76 | 0.30 | 0.00 | 1.00 |
| F5 學習目標 | 0.88 | 0.27 | 0.00 | 1.00 |
| F6 課程帶領 | 0.83 | 0.25 | 0.00 | 1.00 |
| F7 課程資訊 | 0.95 | 0.17 | 0.00 | 1.00 |
| F8 課程科技 | 0.93 | 0.17 | 0.00 | 1.00 |
| F9 課程管理 | 0.80 | 0.26 | 0.00 | 1.00 |
| IC 互動（Z） | 0.00 | 0.67 | −0.95 | 3.37 |
| SC 互動（Z） | 0.00 | 0.58 | −1.22 | 2.44 |
| SS 互動（Z） | 0.00 | 0.99 | −0.63 | 4.97 |
| SI 互動（Z） | 0.00 | 0.99 | −0.73 | 4.86 |
| 課程通過率 | 0.90 | 0.12 | 0.45 | 1.00 |

| # | 結果 | 數字 | 對照／條件 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 16 | 初始模型（九個因素→四種互動→通過率，加九個因素→通過率的直接路徑）適配很差 | χ²[6] = 89.34，p < .05；CFI = .37 | 121 門課 | L614–619 | 「it did not have a satisfactory model fit (Comparative Fit Index [CFI] = .37, recommended to be greater than .90) and included nonsignificant paths」 |
| 17 | 刪掉不顯著路徑後的最終模型 | χ²[6] = 14.26，p < .05；CFI = .91；RMSEA = .11。作者說「good model fit」 | 同上；模型是看資料修出來的 | L628–629 | 「We therefore dropped the nonsignificant paths and reconducted the path analysis, which showed good model fit (χ2[6] = 14.26; p < .05, CFI = .91, RMSEA = .11).」 |
| 18 | 「學習者投入與互動」分數 → SC 互動 | β = .286，p < .05 | 最終模型，標準化係數 | L647–648、Fig. 3 | 「“learner engagement & interaction” scores had significant influences on Student-Content (β = .286, p < .05), Student-Student (β = .333, p < .05), and Student-Instructor interactions (β = .365, p < .05)」 |
| 19 | 同上 → SS 互動 | β = .333，p < .05 | 同上 | 同上 | 同上 |
| 20 | 同上 → SI 互動 | β = .365，p < .05 | 同上 | 同上 | 同上 |
| 21 | SC 互動 → 通過率 | β = .358，p < .05 | 同上 | L649–650 | 「Student-Content interaction had a significant direct effect on passing rate (β = .358, p < .05)」 |
| 22 | 「課程帶領」分數 → 通過率（直接） | β = .155，p > .05，**不顯著**；在初始模型裡顯著、最終模型不顯著 | 同上 | L630–632、L697–699 | 「all path coefficients were significant at the .05 level except for one path (Course Facilitation - Passing rate, β = .155, p > .05)」「had positive and significant influences on passing rates in the initial model, but not in the final model」 |
| 23 | 其他八個面向對任何一種互動都沒有顯著影響 | 無數字（初始模型的係數沒有列表） | 初始模型 | L674–682 | 「only rubric scores related to the “learner engagement and interaction” construct had a positive and significant effect on online interactions」「The quality measures for the other dimensions did not have a significant impact on any of the types of online interactions.」 |
| 24 | SS 互動 → 通過率 | **不顯著**（無數字）；最終模型圖上 SS、SI 都沒有連到通過率的路徑，IC 整個不在最終模型裡 | — | L683–687、Fig. 3 | 「only SC interaction had a significant and positive effect on passing rates」「SS interaction did not have a significant effect on passing rates」 |
| 25 | 模型解釋力 | 通過率變異的約 16.3% | 最終模型 | L650–651 | 「approximately 16.3% of the variance in passing rate is explained by this model」 |
| 26 | Fig. 3 另有 | 「學習者投入與互動」與「課程帶領」之間的雙箭頭 .43（圖上沒有星號，正文沒有提） | — | PDF p.257 | 圖上數字 |

作者的解讀（L699–703）：「course design elements related to “learner engagement and interaction” are an important aspect of course quality, indirectly contributing to course performance」。**原文沒有報間接效果的檢定**（沒有 Sobel、bootstrap 或間接效果係數），間接效果是從兩段各自顯著的路徑推出來的。

## 作者自己列的限制（L711–722）

1. 全部課程來自同一所大學，有自己的機構文化。
2. 每門課只有一位評分者，無法算評分者間信度。
3. 用二分計分；李克特量尺可能比較好用。
4. 資料跨多個學門，而先前研究（Ke, 2013）發現線上互動型態有學門差異。
5. 未來應看其他學習成果（滿意度、堅持度）。
6. 討論段另說（L706–709）：模型只解釋 16.3% 的通過率變異，學生端的因素（學業背景、相關經驗）也影響完課。

作者沒有列、但從原文看得出來的（以下是我的觀察，不是作者的話）：

- 量表分數與通過率都貼近上限：九個因素平均 0.76–0.95，通過率平均 0.90（Table 6）。
- 最終模型是先跑完整模型、再把不顯著路徑刪掉後重跑，屬於事後修模；χ² 仍顯著、RMSEA = .11。初始模型與最終模型報的自由度同為 6（L618、L629），原文沒有解釋。
- EFA 用 43 題配 202 門課。
- Table 4 裡有幾題在別的因素上也有達 0.4 的負荷量但沒被標為跨因素：item12 在 F2 是 −0.44（F6 是 0.46）、item10 在 F4 是 0.40（F7 是 0.99）、item46 在 F1 是 0.40（F8 是 0.66）、item23 在 F9 是 −0.43（F1 是 0.87）。Table 4 註寫「Factor loadings < .4 are suppressed」，但表裡所有負荷量都印出來了。
- 「通過」含 D，退選（W）算沒通過；通過率不是另外量的學習。

## 與摘要說法不一致的地方

- 摘要（L20）與正文都說「investigating causal relationships」，但設計是相關性的路徑分析；這是用詞與設計不相稱，不是數字不一致。
- 摘要說「only rubric items related to learner engagement and interaction have a significant and positive effect on online interactions, while only student-content interaction significantly and positively influence course passing rates」，與正文相符。摘要沒有提：初始模型適配很差（CFI = .37）、最終模型是刪路徑後得到的、量表分數對通過率沒有任何顯著的直接路徑、間接效果沒有檢定、解釋變異 16.3%。
- 摘要說「eliminate 12 problematic items」，正文 8 + 4 = 12，相符；但正文另指出留下來的 item12 也不合（L572–573），摘要沒提。
- 正文內部：結果段說被刪的後四題「related to course technology issues」（L373–374），討論段改說「related to course technology or course materials and resources」（L661–662）；Table 3 看題目內容，#28、#30 是「Resources & materials」，討論段的說法比較準。
- 正文內部：「Factors 2, 3, and 4 each explained 9%」（L563）與 Table 4 相符，但 Table 4 的特徵值 F3（3.70）小於 F4（4.03），因素沒有照特徵值排序。
- Table 1 寫 University of North Dakota 量表是 2017，參考文獻寫 2016（L164–167 對 L869）。

## 與清單「要撐的結論」不合的地方

清單寫：「改自 QM 的量表近四分之一題目有問題；多數面向與通過率無關」。

- **前半撐得住**，但要帶條件：12/51 題（23.5%），「有問題」的意思是「逐步刪題會拉高 KR-20 的 8 題」加上「EFA 裡跨因素或負荷量不到 .4 的 4 題」；評分只有一位評分者、二分計分、單一學校。被刪的 8 題集中在無障礙與科技／資源取用，作者歸因於題目用詞不精確（如「unreasonable」「sufficient」沒有定義，L663–666）。這是 AS rubric（改編版）的結果，不是 QM 本身的結果；QM 本身沒有被測。
- **後半要改寫**。原文的結果比「多數面向無關」更強也更窄：
  - 最終模型裡，九個面向**沒有任何一個**對通過率有顯著的直接路徑（唯一留下的直接路徑「課程帶領→通過率」β = .155 不顯著）。
  - 只有「學習者投入與互動」一個面向顯著預測互動量（SC、SS、SI），其餘八個面向對四種互動都不顯著。
  - 與通過率相連的只有 SC 互動（β = .358）；面向→SC→通過率的間接效果沒有檢定。
  - 所以比較準的寫法是「九個面向裡只有一個與 LMS 上的互動量有關，沒有一個直接預測通過率」。
- 成果變項是課程通過率（含 D、平均 0.90），不是獨立量的學習；互動量是點擊與張貼次數。清單那句若被寫成「量表分數與學習無關」會超出原文。
- 文獻回顧那段（10 份量表沒有一份公開報告信效度結果）可以引，但那是作者自己找的 10 份高教線上課程量表，檢索沒有寫日期與流程圖。

## 讀取紀錄

- L1–450：`.txt` 連續讀（首頁、摘要、導言、文獻回顧、Table 1、方法、Table 2、分析、結果 RQ1、Table 3、Table 4 前半）
- L451–884：`.txt` 連續讀（Table 4 後半、Table 5、RQ2、Table 6、討論、限制、結論、參考文獻 L764–879 掃過）
- PDF p.251–257（PDF 第 7–13 頁）逐頁看過版面：Table 2、Table 3、Table 4（兩頁）、Table 5（兩頁）、Table 6、Figure 2、Figure 3 的數字都與 `.txt` 對過，一致。
- Table 1（PDF p.248）與 Figure 1（p.247）沒有另看 PDF 影像；Figure 1 的內容只讀到圖說。
- 沒有附錄。全文讀完。
