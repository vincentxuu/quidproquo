# 抽取紀錄：Mullaney 與 Reich 2015（L@S），讀的是作者公開的 2014 工作論文版

- **合法公開來源（舊檔的來源）**：https://dl.acm.org/doi/10.1145/2724660.2724663（L@S 2015 刊出版，2026-10-14 核對）。ACM Digital Library 自 2026-01-01 起全面開放取用，文章頁標示 FREE ACCESS，所以舊檔 `q4-time/mullaney-reich2015-staggered-release.md` 原先「付費頁正文」的疑慮已解除。ACM 的 PDF 另存 `.research/raw/learning-content/q4-time/mullaney-reich2015-acm-dl.pdf`；舊檔的五詞片段有 96.2% 在 ACM PDF 裡找得到，舊檔缺的是表格與圖（ACM PDF 多出 144 個小數）。本紀錄的數字依據仍是 HarvardX Working Paper No. 7（作者機構頁的 Wayback 存檔），這一點不變。

**書目（刊出版）**：Tommy Mullaney、Justin Reich。Staggered Versus All-At-Once Content Release in Massive Open Online Courses: Evaluating a Natural Experiment。Proceedings of the Second (2015) ACM Conference on Learning @ Scale（L@S '15，Vancouver，2015-03-14 至 18），第 185–194 頁。DOI 10.1145/2724660.2724663。頁碼取自 OpenAlex；Unpaywall 標示刊出版不是開放取用。

**書目（實際讀的版本）**：同題名、同作者，HarvardX Working Paper No. 7，2014-09-22，SSRN 2499729（DOI 10.2139/ssrn.2499729），10 頁。兩位作者當時都掛 Harvard University（PDF 首頁）。PDF 內嵌檔名是 `heroesx-natexp-2014.09.09.docx`，版面是 ACM 投稿範本（版權框還是範本文字），也就是投稿前的作者稿。

**原文檔**：

- 清單上的 `.research/raw/learning-content/q4-time/mullaney-reich2015-staggered-release.md`（89 行、35,212 位元組）**不完整，而且來源欄寫的是 `dl.acm.org`（付費頁）**：沒有摘要、五張表全缺、圖全缺、參考文獻缺，另有三處正文中斷（L20 課程介紹的開頭、L44 第 8 週之後的描述到 Figure 4 那段、L50 Figure 6 的說明後半）。依規則不拿它當依據。
- 重抓：作者機構網站 `harvardx.harvard.edu/files/harvardx/files/ssrn-id2499729.pdf` 現在已轉址，改從 Wayback 2015-09-10 的存檔取得（`https://web.archive.org/web/20150910061550id_/http://harvardx.harvard.edu/files/harvardx/files/ssrn-id2499729.pdf`）。存成 `q4-time/mullaney-reich2014-harvardx-wp7.pdf`（10 頁）與不帶 `-layout` 轉出的 `q4-time/mullaney-reich2014-harvardx-wp7.txt`（1,408 行、45,784 位元組）。**下面的行號都指這個 txt。**

**完成狀態**：工作論文版從頭到尾讀完，五張表與八張圖都對過 PDF 版面。**刊出版的摘要與表格沒有拿到**，所以下面的數字只確認到工作論文版；刊出版有沒有改數字，不確定。舊檔（刊出版正文片段）我也從頭讀了一遍，只用來列兩版的文字差異，不用來引數字。

**讀取日期**：2026-10-14。**供**：order 18、order 12。

## 研究設計

- **類型**：自然實驗（同一門課前後兩次開課的比較），不是隨機分派。作者明說「In ideal experimental conditions, the timing of content release would be the only difference between the two course runs; unfortunately, this was not the case.」（L383–385）
- **課程**：HarvardX 的 HeroesX（The Ancient Greek Hero，Gregory Nagy），edX 平台。27 章：24 個「Hour」加 2 章導言、1 章結語（L282–284）。每個 Hour 有 8 題選擇題（4 題內容題、4 題文本註解題），總分達 50% 拿證書（L292–300）。
- **兩個版本**（Table 1，對過 PDF 第 3 頁）：

| | v1 | v2（線上） | v2（哈佛學院修課生） |
|---|---|---|---|
| 起訖 | 2013-03-12 至 08-26 | 2013-09-08 至 12-08 | 同左 |
| 週數 | 20 | 13 | 13 |
| 影片數／總時數 | 295／34.532 | 294／34.585 | 同左 |
| 釋出方式 | 依序（約每週兩章） | 一次全部 | 一次全部 |
| 註冊人數 | 43,563 | 22,975 | 236 |
| 活躍學生 | 24,905 | 11,473 | 236 |
| 年齡中位數 | 30 | 30 | 20 |
| 學歷中位數 | 學士 | 學士 | 高中 |

- **v1 的細節**（L346–364）：註冊開放 83 天後開課；內容沒做完所以邊做邊放，偶爾一週沒有新內容；全部內容到 7 月 24 日才上齊；沒有任何期限，最後一天註冊也能拿證書。
- **v2 與 v1 不同的不只是釋出方式**（L374–424）：註冊期短、人數少；同一套教材同時給哈佛學院 236 人與進修推廣部 37 人的學分班使用；每週以信件公告學分班進度，當成線上學生的建議進度；有 4,319 人是 v1 的回鍋註冊者，其中 429 人在 v1 拿過證書。作者把這些稱為「a bundle of changes」。
- **量了什麼**：
  - 跟上進度（ontrackedness，刊出版拼成 ontrackness）：嚴格定義是當週釋出（v1）或當週建議（v2）的章；寬鬆定義再加前後各一週（v1 只能往前）（L436–447）。每人每週花最多時間的那一章算他那週的位置；時間由事件紀錄推估，兩個事件相隔超過 30 分鐘不計（L520–526）。
  - 三種個人層級的算法（Table 3）：(1) 開始之後所有週裡，在進度上的週數比例；(2) 有活動的週裡，在進度上的比例，排除頭兩週；(3) 總時間裡花在進度上的比例，排除頭兩週。
  - 成果：證書取得、成績中位數、活動天數、站上時數、看片數、論壇參與（Table 4）。**沒有任何學習測驗，也沒有前測**。
- **統計**：以證書取得為依變項的邏輯迴歸七個模型（Table 5），控制活動週數比例、版本與交互作用。

## 結果（逐項）

### 跟上進度的人有多少

| # | 結果 | 數字 | 對照條件 | 位置 | 原文 |
|---|---|---|---|---|---|
| 1 | v1 每週寬鬆在進度上的活躍學生 | 多數週為 30% 到 40% | 依序釋出 | L611–621，Fig. 6 | 「Between 30 and 40 percent of students are at least loosely on-track in most weeks in v1」 |
| 2 | v2 線上 | 20% 以下；嚴格在進度上的到課程尾聲之前都很少 | 一次釋出 | L621–623 | 「In v2, by contrast, 20 percent or fewer of edX students are loosely on-track during the course, and very few are strictly on-track until the end」 |
| 3 | v1 到第 8 週 | 多數學生花最多時間的地方已經不在進度上 | 依序釋出 | L545–557 | 「So even though several mechanisms, like sequential content release and regular emails, attempt to keep students on-track, asynchronous pacing was the norm rather than the exception by the middle of the course.」 |
| 4 | 每一週都有一群人停在 Hour 0 與 1 | 沒有給數字；Fig. 5 上「Shopping」佔活躍學生時間的比例，v1 第 5 週後約三到四成、v2 線上約三到五成（圖讀值） | 兩版都有 | L537–543、L603–607 | 「In every week of the course, there is a separate cluster of students spending the plurality of their time in Hours 0 and 1 … many of these students are "shoppers" [3] who examine introductory materials but never return.」 |
| 5 | 學分班學生 | 幾乎完全同步，直到第 14、15 週準備考試 | 同一套教材、有學分 | L571–573 | 「residential students maintain almost perfect synchronicity with the course syllabus until exam preparations begin in Weeks 14 and 15」 |

**Table 3（個人層級平均，對過 PDF 第 6 頁）**

| 算法 | v1 嚴格 | v1 寬鬆 | v2 線上 嚴格 | v2 線上 寬鬆 | v2 學院 嚴格 | v2 學院 寬鬆 |
|---|---|---|---|---|---|---|
| (1) 開始後各週 | 0.0190 | 0.0404（n = 24,782） | 0.0052 | 0.0231（n = 11,457） | 0.2331 | 0.6133（n = 236） |
| (2) 有活動的週，排除頭兩週 | 0.0594 | 0.1386（n = 17,773） | 0.0249 | 0.0758（n = 6,959） | 0.3174 | 0.8312（n = 235） |
| (3) 總時間，排除頭兩週 | 0.0552 | 0.1396（n = 17,773） | 0.0227 | 0.0739（n = 6,959） | 0.3233 | 0.8437（n = 235） |

原文的判讀（L733–741）：「These differences are statistically significant (p < 0.001) and substantial: across all operationalizations, students in HeroesX v1 spent about twice as much time on-track as students in v2.」沒有寫用什麼檢定。照表算，倍數在 1.7 到 3.7 之間（我算的）。兩版的絕對值都很低：依序釋出的 v1，寬鬆定義下也只有 4% 到 14%。

### 整體成果（Table 4，活躍學生，對過 PDF 第 7 頁）

| # | 指標 | v1 | v2 線上 | v2 學院 |
|---|---|---|---|---|
| 6 | 活躍學生 | 24,905 | 11,473 | 236 |
| 7 | 拿到證書 | 1,399 | 658 | 57 |
| 8 | 證書率（佔活躍學生） | 0.056 | 0.057 | 0.242 |
| 9 | 成績中位數（排除 0 分） | 0.090 | 0.100 | 0.260 |
| 10 | 活動天數中位數 | 3 | 3 | 51 |
| 11 | 站上時數中位數 | 0.673 | 0.777 | 22.525 |
| 12 | 平均看片數 | 7.934 | 6.718 | 10.127 |
| 13 | 用過論壇的學生 | 3,190（12.8%） | 869（7.6%） | 226（95.8%） |
| 14 | 平均發文 | 3.130 | 2.509 | 4.146 |
| 15 | 平均留言 | 8.127 | 8.272 | 1.456 |

- 佔全體註冊者的完成率，v1 是 3.2%（1,399／43,563，L361–364）；v2 原文沒有寫，照 Table 1 與 Table 4 算是 658／22,975 ≈ 2.9%（我算的）。
- 原文的判讀（L753–767、L887–889）：「we see very few differences in performance, persistence, and participation across the two versions of the course」「On the whole, however, the high level statistics about the course suggest minimal differences in student outcomes.」這一段沒有做任何顯著性檢定。
- 作者同時說這些變動可能互相抵銷（L879–887）：「It is possible that some elements within that bundle of changes might be counteracting each other, and that certain positive changes might be rendered unobservable by negative ones.」Figure 7 顯示兩版拿到證書的人，活動週數的分布很不一樣：v1 集中在活動週數比例 0.8 以上，v2 線上從低到高都有。

### 邏輯迴歸（Table 5，對過 PDF 第 8 頁；格內是 logit 與標準誤）

| | A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|---|
| 截距 | −5.537*** (0.079) | −5.406*** (0.079) | −5.429*** (0.079) | −5.311*** (0.084) | −5.321*** (0.084) | −5.239*** (0.082) | −5.247*** (0.082) |
| 版本（v2 = 1） | 0.851*** (0.115) | 0.767*** (0.115) | 0.774*** (0.115) | 0.845*** (0.129) | 0.91*** (0.128) | 0.816*** (0.126) | 0.851*** (0.115) |
| 活動週數比例 | 9.677*** (0.175) | 8.189*** (0.227) | 8.345*** (0.197) | 8.631*** (0.189) | 8.495*** (0.18) | 9.092*** (0.199) | 9.677*** (0.175) |
| 進度定義 | — | 寬鬆 | 嚴格 | 寬鬆 | 嚴格 | 寬鬆 | 嚴格 |
| 在進度上的週數（算法 1） | | 2.773*** (0.299) | 4.957*** (0.411) | | | | |
| 活動週裡在進度上（算法 2） | | | | 0.869*** (0.134) | 2.104*** (0.168) | | |
| 總時間在進度上（算法 3） | | | | | | 0.102 (0.146)，不顯著 | 1.379*** (0.204) |
| 版本 × 活動週數 | −1.812*** (0.274) | −1.179*** (0.323) | −1.134*** (0.296) | −1.606*** (0.292) | −1.423*** (0.286) | −2.051*** (0.299) | −1.596*** (0.289) |
| 版本 × 在進度上 | | 2.317** (0.72) | 4.373*** (1.191) | 0.56* (0.227) | 0.218 (0.332)，不顯著 | 1.07*** (0.241) | 0.666 (0.389)，不顯著 |
| n | 表上空白 | 36,738 | 36,738 | 24,732 | 24,732 | 24,732 | 24,732 |
| Pseudo R² | 表上空白 | 0.5592 | 0.5641 | 0.5398 | 0.5334 | 0.5292 | 0.5319 |

- 16：活動週數是最強的預測變項（L1144–1146「In all models, the proportion of weeks active is a stronger predictor of certification than the proportion of weeks on-track.」）。
- 17：有 75% 的週有活動的學生，拿證書的機率是 25% 的學生的 17 倍（L1133–1137，由 Model A 換算的調整後風險比）。
- 18：活動週數少的學生在 v2 比較容易拿證書，活動週數多的在 v1 比較容易（L1126–1131）。作者的解釋：v2 一次全放，可以用較少的週數做完；v1 的人被迫隔很多週回來（L1270–1273）。
- 19：在進度上與拿證書是正相關，但效果小（L1263–1265「their effects on student attainment are substantively modest (though statistically significant)」）。Model F 的主效果不顯著；交互作用在 E、G 不顯著。
- 20：在進度上的效果在 v2 比 v1 強（L1211–1215，「though not always significant」）。
- 21：Figure 8 用 Model E 畫六種典型學生；活動 20% 與 50% 週數的，v2 的預測證書率較高；活動 80% 的，v1 較高（L1232–1235）。

### 結論節的三點建議（L1284–1325）

- 22：「we suggest that instructional designers should assume that students will take advantage of any flexibility offered to proceed at their own pace. Even in courses with a recommended syllabus and norming mechanisms to encourage students to follow that syllabus, course developers should assume that most students will not stay on-track.」
- 23：「in every week of the course, a substantial portion of visitors engage with the very first contents of the course. For many students, it is the only part of the course they see.」作者自己稱這是「somewhat incidental」的發現。建議是：「One possible approach might be to have the first chapter of a course summarize the important ideas from the whole course, rather than simply introducing the first topic to be discussed.」這個建議沒有被檢驗過。
- 24：「we found very few differences in student performance, persistence, or participation resulting from changing the pattern of content release.」同段：「If we can make any statement with confidence, it is that students will take advantage of whatever flexibility in pacing is offered.」以及「engaging frequently from week to week is correlated with certificate attainment」。

## 作者自己列的限制

1. 不是隨機分派，v2 是一整包變動（L383–393、L417–421）。
2. 對學習幾乎沒有掌握：測驗是格式固定的選擇題，適合用應試技巧；持續、表現、參與能不能代表學習「is unknown」（L890–900）。
3. 只能說在進度上與拿證書有小幅正相關，不能說它讓人學得更好（L1326–1331）。
4. 沒有量論壇討論的品質（L1333–1339）。
5. 單一課程（人文類、沒有期限、選擇題評量），不能推到所有 MOOC（L1341–1348）。
6. 散點圖把每人每週歸到單一章（L574–578）。
7. 在進度上的好處「may not apply equally to different types of learners」（L1279–1280）。

作者沒有列、但看得到的：Table 4 的比較沒有做檢定；兩版長度不同（20 週對 13 週），v1 的「依序」其實是內容還沒做完；v2 有近五分之一的註冊者是回鍋的（4,319／22,975，我算的）。

## 與摘要說法不一致的地方

（對的是工作論文版的摘要；刊出版摘要沒拿到。）

1. **釋出期間**：摘要寫「content was released weekly over four months」（L12–13），正文寫「weekly or semi-weekly bundles over five months between March and August」（L147–149），課程細節是 3 月 12 日到 7 月 24 日、約每週兩章（L346–354）。
2. **摘要結尾比正文樂觀**：摘要說「releasing content all at once may be a viable strategy for MOOC designers」（L25–27）；正文結論寫的是兩邊各有代價的取捨（「at least a modest tradeoff」，L1316–1319），並沒有推薦哪一種。
3. **「slightly」**：正文說論壇參與在 v1「slightly higher」（L765–767），Table 4 是 12.8% 對 7.6%。
4. **看片數方向寫反**：正文說「The certification rate, hours on site, and video watching behavior are slightly higher in v2」（L764–765），Table 4 的平均看片數是 v1 7.934、v2 6.718，v1 較高。
5. **mean 與 median**：正文說表裡是「mean days of activity」「mean hours on site」（L757–760），Table 4 的列名是 Median。
6. **Table 1 的標題印錯**，寫成「Sample Student Pathways from HeroesX v1」（L368），內容是兩版課程的比較。
7. **Table 5**：Model A 沒有 n 與 Pseudo R²；Model G 的版本與活動週數係數（0.851、9.677）與 Model A 完全相同，其他各欄都不同，可能是誤植，原文沒有說明。內文還說 Model A 顯示「weeks on-track」與證書的關係（L1122–1123），但 Model A 沒有這個變項，應是「weeks active」。
8. **Figure 8**：內文說 v1 是黑色實線、v2 是灰色虛線（L1222–1223），PDF 圖例看起來相反（虛線標 spring v1）。哪個對，不確定。

**兩版文字差異**（舊檔的刊出版片段對工作論文）：刊出版把 ontrackedness 改成 ontrackness；多了「students would have been randomly assigned」與一段「students in v1 and v2 may differ in unobservable ways … Causal inferences … depend upon the assumption, which appears reasonable but cannot be proven」；學習測量的但書改寫成「there were no diagnostic tests to establish baseline student knowledge」；結論多一句不能排除兩屆學生有系統性差異；少了引 Staker 與 Horn 的一句。也就是刊出版的因果但書比工作論文更重。

## 與清單「要撐的結論」不合的地方

清單：「彈性都會被用掉；開頭是最多人唯一看到的部分」，並標「反／無：釋出方式幾乎沒差」。

- **「彈性都會被用掉」撐得住**，是作者自己最有把握的一句（結果 22、24）。可補的數字：依序釋出時每週也只有 30% 到 40% 的活躍學生在進度上，一次全放時降到 20% 以下。
- **「開頭是最多人唯一看到的部分」要改寫。** 原文是「For **many** students, it is the only part of the course they see」，沒有給比例，也沒有說是多數；作者稱它為附帶發現。可以佐證但不等於這句話的數字：活躍學生的活動天數中位數是 3 天、站上時數中位數約 0.7 小時。應寫成「每一週都有一大群人停在最前面兩章，對許多人來說那是唯一看到的部分」。「把全課重點放進第一章」是作者的提議，沒有驗證。
- **「釋出方式幾乎沒差」要加三個但書**：（一）比的是一整包變動，不是單獨的釋出方式；（二）成果是證書率與活動量，沒有學習測量；（三）「幾乎沒差」沒有檢定，而且論壇參與率從 12.8% 掉到 7.6%，看片數也是 v1 較高。這是「沒看到差異」的觀察，不是「釋出方式不影響學習」的證據。
- 清單「沒有可精讀的來源」表把這篇歸為自然實驗、只能寫成觀察，與原文相符。
- 給 order 12 的提醒：這篇談的是課程進度，不是單篇內容的開頭怎麼寫；能用的只有上面改寫後的那一句。

## 讀取紀錄

`mullaney-reich2014-harvardx-wp7.txt`：

| 順序 | 行號 | 內容 |
|---|---|---|
| 1 | L1–203 | 題名、作者、摘要、關鍵詞、背景與脈絡、Figure 1 說明、兩個研究問題 |
| 2 | L205–424 | HeroesX 自然實驗（課程結構、v1 與 v2 的差異、特殊族群）、Table 1 |
| 3 | L425–749 | 跟上進度的定義、Table 2、Figure 2–6 的說明、三種算法、Table 3 |
| 4 | L749–1238 | 變動有沒有後果：Table 4、Figure 7、學習測量的但書、Table 5、七個模型的說明、Figure 8 |
| 5 | L1239–1362 | 結論與三點建議、限制 |
| 6 | L1363–1408 | 參考文獻（12 筆，逐筆看過） |

對過 PDF 版面：第 3–9 頁，含 Table 1、2、3、4、5 與 Figure 2–8。轉文字檔裡五張表都被拆成一行一格，本紀錄的表格數字一律以 PDF 頁面為準。Figure 1（第 2 頁，六位學生的路徑）只讀了文字說明，沒看圖。

舊檔 `mullaney-reich2015-staggered-release.md` L1–90 也從頭讀過一遍，只用於上面的「兩版文字差異」。
