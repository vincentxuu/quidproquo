# 抽取紀錄抽查：第五批（16 份）

- 抽查日期：2026-10-22
- 抽查者：獨立抽查員（沒參與精讀）
- 範圍：aghajani-2019-doc-issues-unveiled、aghajani-2020-practitioners-perspective、galan-2023-turnover-knowledge-loss、diataxis-four-types、stackoverflow-2024-professional-knowledge、dora-2023-documentation、ahmeti-2024-adr-action-research、nng-card-sorting、nng-tree-testing、tullis-wood-2004-card-sort-sample、nng-intranet-ia、gitlab-handbook-structure、kuric-2025-tree-testing-variants、cozijn-2007-intranet-task-vs-org、resnick-sanchez-2004-org-scheme-labels、obsidian-sync-import-bases。檔名都和任務書一致。
- 只讀檔，沒有改動任何抽取紀錄。

## 抽樣方法

- 候選範圍：
  - 標題含「可引用」「主張」「原句」的 `##` 節，以及它底下的 `###` 子節。15 份適用。
  - obsidian-sync-import-bases 沒有這幾節，改取「1. 同步」「2. Importer」「3. Bases」「4. Internal links」四節。
- 候選行：`-`、`數字.` 或表格列（排除分隔列）開頭。條件是去掉節／行／表等出處括號之後還有數字，或者有含 3 個以上拉丁字母的引文（"…"、“…”、「…」）。
- 排除：純標題行（`#` 開頭）、以「：」結尾的標籤行。
- 每份都先 `random.seed(17)`，再 `random.sample(候選, 3)`。腳本：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/spot5/sample.py`。
- 核對方式：
  - 用 `grep -n`、`sed -n` 回到全文找原處。
  - 數字逐個對到原句或原表，並確認分母與條件。
  - 雙欄 PDF 先確認左右欄，再判定節號。
  - 下列差異只是文字層的不同，不算不一致：彎直引號、ﬁ 連字、Markdown 強調、PDF 文字層的斷字空白（例如「reasona ble」）。

## 讀取紀錄總核對（`wc -l` / `wc -c`）

| 全文檔 | 紀錄行數 | 實際 `wc -l` | 紀錄 bytes | 實際 `wc -c` | 已讀區段 | 缺口 |
|---|---|---|---|---|---|---|
| aghajani-2019.txt | 870 | 870 | 115,400 | 115,400 | 1–300、300–599、600–870 | 無 |
| aghajani-2020.txt | 986 | 986 | 124,213 | 124,213 | 1–330、330–659、660–986 | 無 |
| galan-2023-part1.txt | 1,042 | 1,042 | 91,970 | 91,970 | 1–520、520–1042 | 無。線上補充表沒有取得，紀錄已說明 |
| galan-2023-part2.txt | 1,250 | 1,250 | 113,455 | 113,455 | 1–450、450–849、850–1250 | 無。Table 1 的勾選符號讀不出來，紀錄已說明 |
| diataxis.txt | 1,595 | 1,595 | 75,592 | 75,592 | 1–640、640–1219、1219–1595 | 無 |
| diataxis-part2.txt | 492 | 492 | 38,339 | 38,339 | 1–492 | 無 |
| so2024-professional.txt | 660 | 660 | 13,635 | 13,635 | 1–660 | 無 |
| so2024-professional-charts.txt | 94 | 94 | 14,092 | 14,092 | 1–94 | 無 |
| so2024-methodology.txt | 114 | 114 | 2,939 | 2,939 | 整檔 | 無 |
| dora2023.txt | 4,716 | 4,716 | 280,854 | 280,854 | 1–800、800–1600、1600–2500、2500–3600、3600–4716 | 無 |
| adr2024.txt | 807 | 807 | 50,491 | 50,491 | 1–420、420–808 | 無。檔尾是 `\f`，所以讀到 808 行是對的 |
| nng-card-sorting-definition.txt | 280 | 280 | 24,368 | 24,368 | 1–280 | 無 |
| nng-card-sorting-how-many-users-to-test.txt | 126 | 126 | 10,667 | 10,667 | 1–126 | 無 |
| nng-tree-testing.txt | 243 | 243 | 23,948 | 23,948 | 1–243 | 無 |
| nng-interpreting-tree-test-results.txt | 224 | 224 | 17,227 | 17,227 | 1–224 | 無 |
| tullis-wood-2004.txt | 182 | 182 | 12,980 | 12,980 | 1–182 | 無 |
| nng-intranet-information-architecture-ia.txt | 197 | 197 | 12,984 | 12,984 | 1–197 | 無 |
| nng-intranet-usability-guidelines.txt | 249 | 249 | 20,014 | 20,014 | 1–249 | 無 |
| nng-intranet-ia-methods.txt | 144 | 144 | 13,466 | 13,466 | 1–144 | 無 |
| gl-.txt／gl-handbook_.txt／gl-handbook_about_.txt | 110／130／132 | 全部相符 | 1,747／2,463／6,801 | 全部相符 | 各檔整檔 | 無 |
| gl-handbook_about_handbook-usage_.txt | 333 | 333 | 30,343 | 30,343 | 1–333 | 無 |
| gl-handbook_about_editing-handbook_.txt | 563 | 563 | 28,496 | 28,496 | 1–30、90–125、375–460，其餘用 grep | 約 60% 沒有逐行讀。紀錄已說明那部分是編輯工具的操作說明 |
| kuric-2025-tree-testing.txt | 958 | 958 | 117,149 | 117,149 | 1–330、330–650、650–959 | 無。檔尾沒有換行，所以實際有 959 行 |
| cozijn2007.txt | 195 | 195 | 31,263 | 31,263 | 依節讀完 1–195 | 無 |
| schackman2003_nl.txt（cozijn 對照版） | 652 | 652 | 36,010 | 36,010 | 1–25、120–420、500–652 | 26–119、421–499 沒有列在讀取紀錄裡。這是對照版，只用來核對數字，不影響主版本 |
| resnick2004.txt | 452 | 452 | 51,112 | 51,112 | 14–401（正文到參考文獻） | 無。1–13、402–452 是網站外框 |
| obs2-*.txt（13 檔） | 237／141／31／45／44／384／152／184／392／70／90／32／14 | 全部相符 | 12796／7399／1404／2030／1220／18036／8565／8992／14713／3220／3261／1083／1832 | 全部相符 | 四個主題的主頁全讀，旁證頁只讀相關段落 | views、settings、manage-notes、core-plugins 只讀了命中段。紀錄已說明這幾頁是旁證 |

- 16 份紀錄寫的行數與 bytes，全部和 `wc` 一致。
- 主要全文的區段都首尾相接。沒讀的部分都已在紀錄裡說明：gitlab Editing 頁約六成、obsidian 的旁證頁、cozijn 的荷文對照版。
- 「與摘要／常見轉述不一致處」節：16 份都不是空的。列點數依序是 aghajani-2019 6、aghajani-2020 7、galan 6、diataxis 6、SO 2024 6、DORA 7、ahmeti 6、nng-card-sorting 5、nng-tree-testing 4、tullis-wood 5、nng-intranet-ia 5、gitlab 4、kuric 5、cozijn 11、resnick 9、obsidian 10。

---

## 1. aghajani-2019-doc-issues-unveiled.md

全文檔：`fulltext/aghajani-2019.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L54 | "Half of the issues (50%) were related to information content findability, i.e., when the desired information was available but couldn't be found by a user" | 第 438–440 行左欄，在 Usability (138) 段裡（§IV-B） | 逐字相符。 |
| 2 | L57 | Readability 中 "lack of clarity represented more than half (55%) of these problems"；第二是錯字 | 第 446–447 行，Readability (107)。第 459–460 行 "The second most frequent cause for readability issues were simple typos" | 數字、原句、排序都相符。 |
| 3 | L73 | 工具類：Help required 90（83% 是 how-to 問題，79% 在 SO）、Support/Expectations 34、Bug 17、Tool migration 4 | 第 494 行 Support/Expectations (34)、第 508 行 Help required (90)、第 519–520 行 83% 與 79%、第 525 行 Tool migration (4)、第 529 行 Bug/Issue (17) | 數字都對。79% 的分母是 how-to 問題，不是整個 Help required 類（原文 "This type of question was mostly asked in SO (79%)"）。紀錄的括號寫法看得出來，不算錯。 |

判定：**通過**。

## 2. aghajani-2020-practitioners-perspective.md

全文檔：`fulltext/aghajani-2020.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L42 | "Lack of time to write documentation is the only issue in this category that was indicated as important by the majority (65%) of participants. Also, it is a frequently encountered issue." | 第 581–583 行右欄。Figure 2 第 460 行也印 65% | 逐字相符，數字和圖一致。 |
| 2 | L48 | "Increasing the budget dedicated to documentation was a recurring solution … attention it deserves when planning and allocating software resources." | 第 511–517 行左欄 | 逐字相符（跨行接合）。 |
| 3 | L53 | "7 out of 23 (30%) … by the majority (≥60%)"；"nine issues (39%) are considered relevant by less than 40% practitioners" | 第 540–545 行，§4 What 的 Summing up | 逐字相符。 |

判定：**通過**。

## 3. galan-2023-turnover-knowledge-loss.md

全文檔：`fulltext/galan-2023-part1.txt`、`fulltext/galan-2023-part2.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L48 | 組織層後果：績效／生產力下降，經由 "erosion of key organizational routines"、"damage of organizational memory"、營運中斷、關係流失、客戶流失、吸收能力下降 | Part I 第 660–672 行，§4.3 KLT outcomes | 六項機制與原文順序一致，引文逐字相符。原文另外還列了 organizational identity，紀錄沒寫，屬省略，不算錯。 |
| 2 | L59 | "However, studied organizations are often reported to lack holistic and circumspect KLT prevention strategies (…) and instead act on an ad-hoc basis (…)." | Part II 第 160–162 行，§2.2.1 | 逐字相符，節也對。 |
| 3 | L64 | "evidence is available for effective use of personalization-based approaches (e.g. workshops, informal learning opportunities) for the integration of knowledge with high level of complexity" | Part II 第 256–258 行，§2.2.2.3 | 逐字相符，節也對。 |

判定：**通過**。

## 4. diataxis-four-types.md

全文檔：`fulltext/diataxis.txt`、`fulltext/diataxis-part2.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L51 | "a tutorial can present something complex or advanced. … the user's study, or their work." | part2 第 138 行 | 逐字相符。 |
| 2 | L59 | Tutorial 三條原則、"Writing and maintaining tutorials can consume a remarkable amount of effort and time."、"all that work needs to be done again" | diataxis 第 511／531／537 行（三個小標題）、第 425 行、第 427 行 | 都相符。 |
| 3 | L62 | Explanation 可以有意見；"explanation tends to be scattered in small parcels in other sections."；可改名為 Discussion／Background／Conceptual guides／Topics | 第 216 行 "It can contain opinions"、第 1139 行 "Admit opinion and perspective"、第 1105 行、第 1089–1095 行 | 都相符。 |

判定：**通過**。

## 5. stackoverflow-2024-professional-knowledge.md

全文檔：`fulltext/so2024-professional.txt`、`fulltext/so2024-professional-charts.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L57 | 題目 "On an average day, how much time do you typically spend searching for answers or solutions … and waiting for a response)." | professional 第 244 行 | 逐字相符。 |
| 2 | L67 | 回答問題時間 All：<15 20.5／15-30 32.4／30-60 30.0／60-120 12.8／>120 4.3 | charts 第 32–33 行 "Daily time spent answering questions" 的 SVG | 五個數字都相符。 |
| 3 | L80 | 題目 "My company has:"（回覆 27,764） | professional 第 352 行、第 366 行 "Responses: 27,764 (42.4%)" | 相符。 |

判定：**通過**。

## 6. dora-2023-documentation.md

全文檔：`fulltext/dora2023.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L50 | Ch.8：work distribution 降低了男女的 burnout 差距，"had no impact on the level of burnout experienced by respondents who identify as underrepresented." | 第 2697–2708 行 | 轉述與原句都相符。 |
| 2 | L53 | 新人（在團隊 <1 年）生產力低 8% | 第 2786–2788 行 "New hires (<1 year of experience on team) score 8% lower on productivity than experienced teammates (>1 year experience)" | 相符。 |
| 3 | L57 | Knowledge sharing：對 software delivery／operational performance 正相關，對 organizational performance 是 "Minor decrease"；定義 "Team members answer questions once, and make the information available to others. People don't have to wait for answers." | 第 2387–2418 行，p.47 效果表：team perf Minor increase、org perf Minor decrease、delivery Substantial increase、ops Substantial increase。定義在第 405–410 行（Concepts and measures，註 7）。Ch.7 第 2309–2311 行另有一版措辭 "the information is available to others" | 相符。紀錄引的是 Concepts and measures 那一版的措辭，沒有引 Ch.7 的。 |

判定：**通過**。

## 7. ahmeti-2024-adr-action-research.md

全文檔：`fulltext/adr2024.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L44 | teamSys 架構師："The hardest part might be to actually decide whether it's a change that is made, whether it's to be considered as an ADR, or if it's just part of normal maintenance." | 第 567–570 行，§6.2（第 432 行起；§6.3 從第 580 行開始） | 逐字相符。紀錄的小標寫「§6.2、§6.3」，涵蓋了這段。 |
| 2 | L47 | "We have learned that the storage location of the documentation has an extreme impact on its usefulness and accessibility (C3)." | 第 625–627 行，§6.3 | 逐字相符。 |
| 3 | L50 | "some developers had difficulties integrating the creation of ADRs into their daily workflow." | 第 591–592 行，§6.3 | 逐字相符（原文跨行斷字 "in-tegrating"）。 |

判定：**通過**。

## 8. nng-card-sorting.md

全文檔：`fulltext/nng-card-sorting-definition.txt`（A）、`fulltext/nng-card-sorting-how-many-users-to-test.txt`（B）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L30 | 卡片命名避免重複字（A L99）：Toyota Camry／Matrix／Land Cruiser | A 第 99 行 | 相符，行號也對。 |
| 2 | L40 | 卡片分類是生成法（B L67–72）：「There is great variability in different people's mental models and in the vocabulary they use」 | B 第 68–70 行 | 逐字相符，行號範圍也對。 |
| 3 | L47 | A L87「We recommend 30­–50 cards」 | A 第 87 行 | 逐字相符（原文含軟連字號）。 |

判定：**通過**。

## 9. nng-tree-testing.md

全文檔：`fulltext/nng-tree-testing.txt`（A）、`fulltext/nng-interpreting-tree-test-results.txt`（B）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L36 | 深度不同的任務不要直接比（B L90–101）：州立圖書館（4 層）67% vs 食物券（7 層）43% | B 第 90–101 行的表 | 67%、43% 相符。路徑節點數分別是 4 與 7，與原文 "three more levels" 一致。原文另一句說食物券的內容在 "6 levels down"，是用另一種算法數層數，紀錄沒有引這句，不算錯。 |
| 2 | L40 | B L171「Typically, 50+ participants per tree are needed …」；B L175–177：二元指標用 N−1 two-proportion test、時間用 t test、三棵以上用 ANOVA | B 第 171、175、177 行 | 逐字相符，行號也對。 |
| 3 | L47 | B L171「50+ participants per tree」 | B 第 171 行 | 相符。 |

判定：**通過**。

## 10. tullis-wood-2004-card-sort-sample.md

全文檔：`fulltext/tullis-wood-2004.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L30 | 作者的外推警告（L157–160）：「we must exercise appropriate caution …」 | 實際在第 159–161 行 | 原句逐字相符（原文文字層是「app ropriate」）。行號偏了 2 行。 |
| 2 | L34 | 摘要（L11–13）：「Results indicate that reasonable structures are obtained from 20-30 participants.」 | 實際在第 16–18 行（摘要），第 18 行是這句 | 原句相符（原文文字層是「reasona ble」「participa nts」）。行號偏了 5 行。 |
| 3 | L35 | Table 1 底兩列（N=5/10/15/20/40）：平均分隔 2.0/1.3/1.5/1.1/0.75；拆開比例 69%/50%/45%/48%/35% | 第 147–148 行 | 10 個數字都相符。 |

- 另外抽看了同一份紀錄的其他行號，也有同樣的偏移：
  - 「Figures 3-6」紀錄寫 L97–98，實際在第 102 行。
  - 「Figures 3-7」紀錄寫 L103，實際在第 111 行。
  - 開放式卡片分類說明紀錄寫 L37–41，實際在第 45 行。
  - 172／168 人紀錄寫 L43–48，實際在第 51–52 行。
- 看起來行號是對應到加上 5 行來源標頭之前的版本，偏移量 2–8 行不等。

判定：**有小錯**。數字與原句都對，但行號系統性偏移。正確值：摘要在第 16–18 行；外推警告在第 159–161 行；Figures 3-6 在第 102 行；Figures 3-7 在第 111 行。

## 11. nng-intranet-ia.md

全文檔：`fulltext/nng-intranet-information-architecture-ia.txt`（A）、`fulltext/nng-intranet-usability-guidelines.txt`（B）、`fulltext/nng-intranet-ia-methods.txt`（C）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L35 | 77 個 IA 平均 7.6、中位數 7、範圍 3–31；C：組織規模與頂層類別數 r = 0.006；2007 年 11% 超過 12 個，2014 年沒有 | A 第 64–74 行（含表）、C 第 75 行 | 數字、原句都相符。 |
| 2 | L42 | B L54「likely because thoughtfully managed, formatted, and structured intranet content helped employees find information more efficiently.」 | B 第 54 行 | 逐字相符。這句確實是推測語氣，紀錄標「推測，非檢定結果」是對的。 |
| 3 | L48 | C L85「structural diversity ultimately made this an impossible goal」 | C 第 85 行 | 逐字相符。 |

判定：**通過**。

## 12. gitlab-handbook-structure.md

全文檔：`fulltext/gl-handbook_about_handbook-usage_.txt`（Usage）、`fulltext/gl-handbook_about_editing-handbook_.txt`（Editing）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L39 | Usage L163–165「Keep in mind that the biggest challenge cited by new employees is the vast amount of information to take in during onboarding.」 | Usage 第 165 行 | 逐字相符，行號範圍也對。 |
| 2 | L43 | 命名規則（Editing L118–120）：「Handbook URLs should describe their content and be as clean and easy to remember as possible」；目錄與頁面只用小寫 a–z、`-`、`_` | Editing 第 426 行（原文以 "In general," 開頭）、第 428 行 | 原句與規則都相符，但**行號錯**。第 118–120 行是 GitLab Duo 搬移頁面的範例，不是命名規則。 |
| 3 | L50 | Usage L156「Adhering to this hierarchy is sometimes counter-intuitive.」 | Usage 第 156 行 | 逐字相符。 |

判定：**有小錯**。命名規則的出處應該是 Editing 第 426–428 行，不是 L118–120。這兩行在紀錄說的已讀區段 375–460 之內，所以只是行號寫錯，不是沒讀。

## 13. kuric-2025-tree-testing-variants.md

全文檔：`fulltext/kuric-2025-tree-testing.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L57 | 原型之間（L575–585, Table 4）：成功率 Desktop 68%／Desktop-intrusive 68%／Mobile 59.7%（p = .047）；路徑長 Mobile 最長（8.74，p = .001）；信心 Mobile 最低（p = .003） | 第 579–583 行（χ² p = .047、H p = .001、p = .003）、第 591–600 行（Table 4：68%／68%／59.70%；path length 8.74；confidence 5.48 最低） | 都相符。 |
| 2 | L63 | L765–767「depending on which commonly used tree test variant is employed, the observed results of a tree test can significantly differ.」 | 第 765 行，§9 Conclusion | 逐字相符。 |
| 3 | L65 | L702–705「it should be understood that the tree test is in itself a model.」 | 第 704 行，§5.4 Discussion | 逐字相符。 |

判定：**通過**。

## 14. cozijn-2007-intranet-task-vs-org.md

全文檔：`fulltext/cozijn2007.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L53 | Exploration time：兩組都沒有顯著趨勢（任務式 F(1,3) = 3.89, p = .14；組織式 F(1,3) = 4.80, p = .11） | 第 160 行 | 數字相符。原文在這裡用的詞是 "orientation time"，紀錄寫 exploration time。紀錄的不一致處第 8 點已經說明原文兩個名稱混用，所以不算錯。 |
| 2 | L58 | 「In terms of organizational practice, the results of the experiment seem to favor an organization-based structure. The familiarity … more efficient task performance.」 | 第 172 行 | 逐字相符。 |
| 3 | L61 | 「whereas the labeling of hyperlinks in an organization-based structure seems straightforward, the labeling in a task-based structure seems to require special attention.」；第 6 題誤點 Control finances，答案在 Market products | 第 172 行 | 逐字相符，例子也對。 |

判定：**通過**。

## 15. resnick-sanchez-2004-org-scheme-labels.md

全文檔：`fulltext/resnick2004.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L47 | 找到商品數（L172–176）：組織方式不顯著，F(1,54) = 0.153, p = .697，任務式 4.7、商品式 4.6；標籤顯著，F(2,54) = 7.095, p = .002，高 5.2、中 4.0、低 4.9；交互作用未報告 | 第 172、174、176 行 | 數字都相符。這一段確實沒有報告交互作用。 |
| 2 | L52 | 結論（L204）：「the success of a Web site is more dependent on the quality of the labels than on the organizational scheme.」 | 第 204 行 | 逐字相符。 |
| 3 | L54 | 作者解釋（L192）：「Perhaps people, when shopping, … than the lower-quality labels used in the product-based organization.」 | 第 192 行 | 三句逐字相符（含原文大寫的 "Labels"）。 |

判定：**通過**。

## 16. obsidian-sync-import-bases.md

全文檔：`fulltext/obs2-notion.txt`、`fulltext/obs2-manage-notes.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L87 | 「The Notion API importer is new. Because of the complexity of Notion workspaces, some edge cases may not have been considered.」 | obs2-notion 第 67 行，在紀錄寫的範圍「行 64–81」內 | 逐字相符。 |
| 2 | L94 | 「Pages without child pages or databases will be imported as `[filename].md` …」「Databases are always represented as folders named `[database name]` with a `[database name].base` file inside.」 | obs2-notion 第 80、81 行 | 逐字相符。 |
| 3 | L124 | Manage notes.md 行 53：「When you rename a file, Obsidian automatically updates all the links to that file.」 | obs2-manage-notes 第 53 行 | 逐字相符，行號也對。 |

判定：**通過**。

---

## 摘要

| # | 紀錄 | 3 項抽樣 | wc 行數／bytes | 區段涵蓋 | 不一致欄 | 判定 |
|---|---|---|---|---|---|---|
| 1 | aghajani-2019-doc-issues-unveiled | 3/3 | 一致 | 完整 | 6 條 | 通過 |
| 2 | aghajani-2020-practitioners-perspective | 3/3 | 一致 | 完整 | 7 條 | 通過 |
| 3 | galan-2023-turnover-knowledge-loss | 3/3 | 一致（2 檔） | 完整（補充表未取得，已說明） | 6 條 | 通過 |
| 4 | diataxis-four-types | 3/3 | 一致（2 檔） | 完整 | 6 條 | 通過 |
| 5 | stackoverflow-2024-professional-knowledge | 3/3 | 一致（3 檔） | 完整 | 6 條 | 通過 |
| 6 | dora-2023-documentation | 3/3 | 一致 | 完整 | 7 條 | 通過 |
| 7 | ahmeti-2024-adr-action-research | 3/3 | 一致 | 完整 | 6 條 | 通過 |
| 8 | nng-card-sorting | 3/3 | 一致（2 檔） | 完整 | 5 條 | 通過 |
| 9 | nng-tree-testing | 3/3 | 一致（2 檔） | 完整 | 4 條 | 通過 |
| 10 | tullis-wood-2004-card-sort-sample | 內容 3/3；行號 2 處偏移 | 一致 | 完整 | 5 條 | 有小錯：行號系統性偏移 2–8 行（摘要應為 L16–18，外推警告應為 L159–161，Figures 3-6 應為 L102，Figures 3-7 應為 L111） |
| 11 | nng-intranet-ia | 3/3 | 一致（3 檔） | 完整 | 5 條 | 通過 |
| 12 | gitlab-handbook-structure | 內容 3/3；行號 1 處錯 | 一致（5 檔） | Editing 頁約六成沒有逐行讀（已說明） | 4 條 | 有小錯：命名規則出處應為 Editing L426–428，不是 L118–120 |
| 13 | kuric-2025-tree-testing-variants | 3/3 | 一致 | 完整 | 5 條 | 通過 |
| 14 | cozijn-2007-intranet-task-vs-org | 3/3 | 一致（主檔＋對照檔） | 主檔完整；荷文對照檔有兩段沒有列在讀取紀錄 | 11 條 | 通過 |
| 15 | resnick-sanchez-2004-org-scheme-labels | 3/3 | 一致 | 完整 | 9 條 | 通過 |
| 16 | obsidian-sync-import-bases | 3/3 | 一致（13 檔） | 主頁完整，旁證頁部分讀（已說明） | 10 條 | 通過 |

- 通過 14 份，有小錯 2 份（tullis-wood、gitlab），不通過 0 份。
- 抽中的 48 項數字與原句全部和原文相符。兩份小錯都只是行號寫錯，不影響內容，也沒有需要重讀的紀錄。
- 建議：
  - tullis-wood 全份的行號照實際檔案重標一次（加上 5 行標頭之後偏移了）。
  - gitlab 把 L43 的出處改成 Editing L426–428。
