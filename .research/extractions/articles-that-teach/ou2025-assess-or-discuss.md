# 抽取紀錄：Ou & Joyner 2025，Assess or Discuss: Comparing Peer Assessment and Online Discussion for Enhancing Learning at Scale（L@S '25，pp. 222–226，doi 10.1145/3698205.3733927）

- 作者全名（對過首頁）：Chaohua Ou、David A. Joyner（Georgia Institute of Technology）
- 原文檔：`.research/raw/learning-content/q5/assess-or-discuss2025.pdf`（5 頁，頁碼 222–226）。清單列的 `q5/assess-or-discuss2025.txt`（44,059 字元）是 `-layout` 雙欄轉文字，**沒有用**；改用不帶 `-layout` 的 `pdftotext` 重轉到 scratch（`ou.txt`，550 行、34,055 字元），行號都指這份重轉檔。`q5-social/assess-or-discuss2025.txt`（10,071）是第一輪的摘要檔，沒用。
- 版本：ACM 刊出版面（首頁「© 2025 Copyright held by the owner/author(s). Publication rights licensed to ACM.」，L82–92）。
- 取得網址：Unpaywall（2026-10-14 查，email 參數 unpaywall@example.org）列 bronze，出版者頁 `https://dl.acm.org/doi/pdf/10.1145/3698205.3733927?download=true`。本機 PDF 是第二輪掃描者從 ACM 下載，下載網址沒有另外留紀錄；我用 curl 重抓被 ACM 擋（403），所以沒做雜湊比對，但檔頭的版權聲明與頁碼是 ACM 刊出版。
- 讀取日期：2026-10-14
- 供：order 21（第 4 列）

## 研究設計

- **類型**：單一課程五年資料的事後觀察分析。依參與分數做中位數切分分組，再比較組間成績（單因子 ANOVA）；另用課後問卷做複迴歸。沒有隨機分派，也沒有任何操弄（L177–219）。
- **課程**：美國一所大型研究型大學線上資訊科學研究所學程裡的一門專題式課程（教育科技），一年開三次，學生自訂一學期的專題（L189–199、L107–114）。**這是收學分的研究所課，不是開放註冊的 MOOC。**
- **受試者**：2020 春到 2024 秋共 1,451 人；男 73.3%（1,063）、女 26.7%（388）；平均 31 歲（SD 7.26）（L193–196）。
- **兩種參與活動與計分**（L115–129）：參與活動占課程總成績 15%。
  - 同儕互評：每週最多評八位同學的作業，早交有加分；有詳細說明、範例評語與標準化評分規準；每則評語由 AI 評分器打 0–2 分，被 95% 信心判為「沒用」的不給分；上限 100 分。
  - 線上討論：回應每日討論題或自開串，每則依品質與相關性給 0.2–3 分，上限 40 分。
- **分組**（L181–209）：同儕互評分數 > 55.5、討論分數 > 12.0 算「有實質參與」（中位數切分）。Collaborators（兩者都有）370 人（25.5%）；Reviewers（互評多、討論少）358 人（24.7%）；Discussants（討論多、互評少）350 人（24.1%）；Limited Contributors（兩者都少）373 人（25.7%）。
- **成效指標**：三份專題成果（Final Project、Project Paper、Project Presentation）各 0–100 分的加總（0–300）（L210–212）。
- **知覺指標**：課後問卷 1,057 人（72.8%）填答，自願、有課程加分；用四題七點量表：同儕互評的價值、非同步線上討論的價值、同儕支持、課程整體成效（L213–219）。

## 結果（逐項）

Table 1 與 Figure 1–2 對過 PDF 第 3–4 頁版面。

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 四組專題成績 | Reviewers M = 282.21（SD 17.27，n 358）；Collaborators 281.01（29.98，370）；Discussants 272.44（52.42，350）；Limited Contributors 260.81（68.35，373）（滿分 300） | 依參與分數事後分組 | 5.1；Table 1 | L255–259、L289–315 | 「Descriptive statistics indicated the highest average scores for Reviewers (M = 282.21, SD = 17.27) and Collaborators (M = 281.01, SD = 29.98)」 |
| 2 | ANOVA | F(3, 1447) = 16.63，p < .001，η² = .033（表註寫是 partial η²） | 同上 | 5.1；Table 1 | L266–269、L317–329 | 「indicating that approximately 3.3% of the variance in learning performance was attributable to the different participation patterns」 |
| 3 | 作者對效果量的保留 | 效果小，其他因素可能更重要 | — | 5.1 | L269–272 | 「While statistically significant, the small effect size suggests that other factors not examined in this particular analysis likely contribute more substantially to variations in learning performance」 |
| 4 | 事後比較（Games-Howell，因變異數不等，Levene p < .001） | Collaborators > Discussants（p = .039）；Reviewers > Discussants（p = .005）；兩者 > Limited Contributors（p < .001）；Collaborators vs Reviewers 無差（p = .909）；Discussants > Limited Contributors（p = .050） | 各組兩兩比較 | 5.1 | L223–228 | 「No significant difference emerged between Collaborators and Reviewers (p = .909)」「Discussants performed significantly better than Limited Contributors (p = .050).」 |
| 5 | 問卷描述統計（N = 1,054） | 課程成效 M = 5.73（SD 1.14）；同儕互評 4.93（1.67）；同儕支持 4.86（1.50）；線上討論 4.65（1.55）（七點量表） | 無對照 | 5.2 | L235–239 | 「online discussions received a slightly lower but still positive rating (M = 4.65, SD = 1.55)」 |
| 6 | 預測「同儕支持」知覺 | R² = .362，F(2, 1051) = 298.76，p < .001；互評價值 β = 0.42，討論價值 β = 0.26 | 兩個知覺變項互比 | 5.2；Figure 2 | L240–248 | 「The impact of peer assessment on peer support (β = 0.42) is notably greater than that of Online discussions (β = 0.26).」 |
| 7 | 預測「課程成效」知覺 | R² = .174，F(2, 1051) = 110.760，p < .001；互評 β = 0.27，討論 β = 0.21 | 同上 | 5.2；Figure 2 | L243–250 | 「peer assessment again shows a stronger predictive effect (β = 0.27) compared to online discussions (β = 0.21).」 |
| 8 | 兩人一組的係數差是否顯著 | 原文沒有檢定 0.42 vs 0.26、0.27 vs 0.21 的差異 | — | 5.2 | — | 「stronger predictor」是看係數大小下的判斷 |

## 作者自己列的限制

- 全文**沒有限制一節**。唯一的保留是 5.1 說效果量小、其他因素可能更重要（L269–272）。討論最後提到 25.7% 的低參與者需要介入（L335–338），結論說未來研究要在不同情境驗證（L403–405）。

## 與摘要說法不一致的地方

- 摘要與結論用因果語氣：「peer assessment is strongly linked to improved performance」（L28–29）、結論「active engagement in peer assessment activities significantly enhances student learning performance」（L382–384）、討論「the significant impact of peer assessment on learning performance justifies these efforts」（L331–332）。正文的設計是事後依參與分數分組的觀察比較，而且 5.1 自己說只解釋 3.3% 的變異、效果小。「strongly」與「enhances」比正文的證據強。
- 參與分數本身就依品質計分（互評經 AI 評分器過濾、討論每則 0.2–3 分看品質），所以「參與組別」混了投入程度與表現品質；正文沒有討論這一點，摘要也沒提。
- 問卷人數：方法寫 1,057 人填答（L215），結果用 N = 1,054（L235），差 3 人沒交代。
- Figure 1 的縱軸從 240 起（PDF 第 3 頁），視覺上把 260 到 282 的差距放大；圖說沒有註明。
- 摘要說回歸顯示互評「是比討論更強的預測因子」；正文沒有檢定兩個 β 的差異。
- 其餘數字逐項對過，沒有其他不一致。

## 與清單「要撐的結論」不合的地方

清單：「做同儕互評的人成績高於主要做討論的人（事後分組）」。

- 方向撐得住：Reviewers 與 Collaborators 的專題成績高於 Discussants（p = .005、.039），Collaborators 與 Reviewers 沒差。
- 要加的限定：
  1. 這是收學分的研究所線上課（喬治亞理工線上 CS 學程的一門課），不是 MOOC，也不是開放網路上的讀者。
  2. 事後依中位數切分，參與分數本身依品質計分；自我選擇與能力都沒控制。
  3. 整體只解釋 3.3% 的成績變異；四組平均差最大約 21 分（滿分 300），而且 Limited Contributors 的 SD（68.35）是 Reviewers（17.27）的四倍，差距主要可能來自低參與組裡少數極低分者（原文沒有分析，這是我的推測）。
  4. 「討論的人比幾乎不參與的人好」是 p = .050，剛好在門檻上。
- 問卷的部分量的是「學生覺得有多大價值」對「覺得有多少同儕支持」，兩者同源自評，不是學習成效。

## 讀取紀錄

- 重轉檔 L1–220（標題、摘要、引言、相關研究、研究情境、方法、分組）
- L220–410（結果 5.1–5.2、Table 1、討論、結論）
- L410–550（參考文獻，只掃過）
- 合計涵蓋全文。重轉檔的段落有左右欄交錯（例如 L107–134 的研究情境排在相關研究之前），依 PDF 版面接回。
- 對過 PDF 版面：第 3 頁（5.1–5.2、Figure 1–2）、第 4 頁（Table 1、討論、結論）。
