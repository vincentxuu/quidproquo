# 抽取紀錄：Wise & Cui 2018，Unpacking the Relationship between Discussion Forum Participation and Learning in MOOCs: Content is Key（LAK '18，pp. 330–339，doi 10.1145/3170358.3170403）

- 作者全名（對過首頁）：Alyssa Friend Wise、Yi Cui（New York University，Learning Analytics Research Network）
- 原文檔：`.research/raw/learning-content/q5/wise-cui2018.pdf`（10 頁，頁碼 330–339）。清單列的 `q5/wise-cui2018.txt`（90,718 字元）是 `-layout` 雙欄轉文字，**沒有用**；改用不帶 `-layout` 的 `pdftotext` 重轉到 scratch（`wise.txt`，1,473 行、62,876 字元），行號都指這份重轉檔。舊檔 `q5-social/wise-cui2018.txt` 只有截斷的摘要，沒用。
- 版本：ACM 刊出版面（首頁有 ACM 版權聲明與頁碼 330 起，L91–102）。
- 取得網址與取用狀態：清單記載第二輪掃描者在 `https://dl.acm.org/doi/10.1145/3170358.3170403` 看到 FREE ACCESS 標示後用瀏覽器下載。**我沒能獨立確認這個標示**：2026-10-14 Unpaywall（email 參數用 unpaywall@example.org）回 `is_oa: false, closed`；curl 抓 `dl.acm.org/doi/pdf/...` 被 403 擋；Exa 抓到的頁面文字沒有取用標籤。所以「出版者公開」這一點目前只有掃描者的回報撐著，引用前若要更穩，應由人用瀏覽器開那一頁看一次。
- 讀取日期：2026-10-14
- 供：order 21（第 3 列）

## 研究設計

- **類型**：單一課程既有資料的觀察性學習分析（相關、卡方、迴歸），沒有任何操弄（L417–433）。
- **課程**：StatMed'14，史丹佛 Lagunita 平台 2014 年開的機率統計入門課（醫學研究的統計）。論壇是「補充、自由參加」，九個分區（General、Video、Homework 等），有兩位教學團隊成員參與（L419–433）。
- **受試者**：人口資料 15,073 個不重複帳號，39% 女、54% 男；83% 有學士以上學歷；來自 163 國（L436–468、Table 1–2）。有成績的 11,664 人；論壇資料 565 個學習者帳號；兩者都有的 555 人（L649–652）。
- **論壇內容分類**：作者先前的模型把 817 個討論串分成「與課程內容相關」（C）與「非內容」（NC），unigram／bigram 模型對開串與回覆的準確度 > .81，加上 DIPTiC 方法估計分類準確度 .88（L653–659）。
- **量了什麼**：通過與否（成績 ≥ 0.6 為通過）、期末成績（0–1）、貢獻量（串數、貼文數、C 與 NC 貼文數）、社會網絡中心性（degree、weighted degree、betweenness、closeness、eigencentrality；整體、C、NC 三張網絡）（L659–661、L622–635）。
- **沒有量的**：閱讀、瀏覽、按讚等非發文活動，資料集裡沒有（L343–345「non-posting activities are not always recorded, preventing inclusion in studies. This was the case for the present research.」）。

## 結果（逐項）

Table 3–9 都對過 PDF 第 5–8 頁版面。

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 全部有成績者的通過率 | 貢獻者 315／555 通過（57%），非貢獻者 906／11,109（8%）；χ²(1, N = 11,664) = 1,332.20，p < .001 | 有在論壇發文 vs 沒有 | 4.3.1；Table 3 | L637–671 | 「forum contributors were more likely to pass the course (57%) than non-contributors (8%)」 |
| 2 | 排除成績 ≤ 0.01 的人 | 11,664 人中 8,314 人（71%）成績 ≤ 0.01，被排除（含 63 位貢獻者）；剩 3,350 人，其中 492 人（15%）是貢獻者 | — | 4.3.1 | L673–687 | 「Among the 3,350 learners who remained, 492 (15%) were contributors and 2,858 (85%) were non-contributors.」 |
| 3 | 排除後的通過率 | 貢獻者 315／492（64%）vs 非貢獻者 906／2,858（32%）；χ²(1, N = 3,350) = 189.33，p < .001 | 同上，限成績 > 0.01 | 4.3.1；Table 4 | L688–692、L726–738 | 「Again, the comparison showed a higher percentage of passing among forum contributors」 |
| 4 | 貢獻類型與通過 | 只發非內容串（NC）178 人通過 57%；只發內容串（C）165 人通過 60%；兩種都發（NC+C）149 人通過 77%（調整殘差 3.8）；χ²(2, N = 492) = 14.74，p = .001 | 三種貢獻類型互比 | 4.3.2；Table 5 | L740–763、L809–827 | 「those who contributed to both kinds of discussions were more likely to pass the course (77% vs 57% / 60%)」 |
| 5 | 兩種都發的人也發得比較多 | 中位數串數：NC 1、C 1、NC+C 4；貼文數 1、1、5；Kruskal-Wallis 串數 χ²(2) = 297.641、貼文 χ²(2) = 244.492，p 都 < .001 | 同上 | 4.3.2；Table 6 | L694–724、L765–794 | 「learners posting to both C and NC threads participated more than the other two groups」 |
| 6 | 拆不開「多樣」與「量」 | 以串數、貼文數、是否兩種都發做邏輯迴歸，模型「沒有實質解釋通過與否的變異」 | — | 4.3.2 | L796–807 | 「The resulting model did not substantially explain variance in passing the course.」討論 L1189–1191：「it is not possible to disambiguate the effects of contribution quantity and diversity」 |
| 7 | 通過者裡，有發文 vs 沒發文的成績（**無差異**） | 315 vs 906 人；t(1,219) = 1.610，p = .107 | 限通過者 N = 1,221 | 4.4.1 | L927–930 | 「There was no overall difference in course grade between those who contributed to the discussion forums (in any way) (N = 315) and those who did not (N = 906)」 |
| 8 | 通過者裡，四組成績 | 非貢獻者 0.847（SD 0.108）、NC 0.835（0.109）、C 0.874（0.099）、NC+C 0.864（0.105）；F(3, 1,217) = 3.295，p = .020 | 四組互比 | 4.4.1；Table 7 | L931–934、L988–1033 | Table 7 列 |
| 9 | 通過者裡，有發內容串 vs 沒發 | 0.869（SD 0.102）vs 0.845（0.108）；計畫比較 t(1,217) = 3.056，p = .002 | C 與 NC+C 合併 vs NC 與非貢獻者合併 | 4.4.1；Table 7 | L934–938 | 「revealed higher course grades for those contributing to content discussions」；摘要寫成「87% vs 85%」 |
| 10 | 成績與各參與變項的相關（限通過的貢獻者） | 內容串貼文數 r = .188（p = .001）最高；非內容串貼文數 r = .009（p = .878）；內容相關的 6 個變項有 5 個顯著，非內容的 6 個只有 1 個（NC betweenness r = .119）顯著 | 相關 | Table 9；5.2 | L1079–1139、L1148–1150 | 「five of the six variables measuring content contributions were significantly correlated with course grade, in contrast to only one of the six variables measuring non-content contributions」 |
| 11 | 預測成績的最終模型 | 只剩一個預測變項「內容串貼文數」：β = .188，p = .001；R²adj = .032，F(1, 313) = 11.427 | 前向選取，先數量後網絡 | 4.4.2 | L1048–1054 | 「explained a significant but small proportion of variance in course grade (R2ADJ = .032, F (1, 313) = 11.427, p = .001)」 |
| 12 | 社會網絡指標沒有額外貢獻 | 網絡區塊 ΔR²adj = .017，F(8, 303) = 1.691，p = .100（數量區塊 R²adj = .029） | 數量區塊 vs 數量＋網絡區塊 | 4.4.2 | L985–986、L1048–1050 | 「The network block did not explain significant additional variance」 |
| 13 | 作者對整體關係的定性 | 關係弱 | — | 5.3 | L1270–1279 | 「it is critical to note that this research does not document a strong relationship between MOOC discussion participation and course performance.」 |
| 14 | 作者對通過率差距的解讀 | 未分類的論壇貢獻可能較反映投入、努力與堅持，而不是直接學到內容；因果方向不明 | — | 5.1 | L1059–1069 | 「these contrasting findings suggest that the role of (undifferentiated) forum contribution may relate more to engagement, effort and persistence than directly to learning of course content.」 |
| 15 | 參與人數的推估 | 排除成績 ≤ 0.01 後 15% 發文；套用另一篇研究「讀者對寫者 2 比 1」的比例，推估「多達 45%」以某種方式參與論壇 | 推估，不是本研究量到的 | 5.2 | L1252–1265 | 「Following [21]'s 2-to-1 guideline of readers-to-writers, this suggests that as many as 45% of learners participated in the forums in one way or another.」 |
| 16 | 先前文獻摘要（二手，引用時要回原文） | Coetzee 2014：論壇使用者成績中位數 22% vs 0%；[10] Gillani & Eynon 2014 商管 MOOC 貢獻者對非貢獻者 d = 4.0；[23] 自陳發文與成績 r < .15；[21] 論壇訪客只有 1／3 發文或投票 | — | 2.2 | L156–164、L311–322 | 只當線索 |

## 作者自己列的限制

- 單一門統計 MOOC；論壇是選修補充，不是課程設計的一部分；未來要看論壇被設計成教學元素時的情況；也要拆開貢獻的多樣性與數量（5.4，L1300–1312）。
- 沒有閱讀等非發文資料（L343–345）。
- 因果機制不明：可能是參與討論讓人學得更好，也可能是本來能力較強、較有自信的人才去參與，或興趣、投入同時影響兩者；建議量前後測興趣、控制起始能力、隨時間建模、可能時用實驗操弄討論的類型與程度（L1168–1213）。
- 課程成績是「黑箱」學習指標，可能抓不到論壇裡發生的其他學習，例如專業身分的形成（2.1、5.3，L213–216、L1286–1294）。
- 非通過者的成績分析留待未來（L920–921）。

## 與摘要說法不一致的地方

- 摘要寫「overall, 15% of course learners contributed to the forums and these learners had … (64% vs 32% passing)」（L36–39）。**這兩個數字都只限成績 > 0.01 的 3,350 人**（排除了 71% 的有成績者）。以全部 11,664 位有成績者算，發文者是 555 人（約 4.8%），通過率是 57% 對 8%（Table 3）。摘要的「overall」容易讓人以為是全體。
- 摘要的「87% vs 85%」是 Table 7 的 0.869 對 0.845，限通過者。
- 5.3 寫兩組只差「2 percentage points out of 100 (SD = .265)」（L1277），但 .265 是整份成績冊（N = 11,665）的 SD（L470–471）；通過者的 SD 約 .10（Table 7）。用 .265 會讓差距看起來比實際標準化後的小。
- 5.3 寫模型解釋「less than 5%」，正文是 3.2%（R²adj = .032），方向一致。
- 其餘數字逐項對過，沒有其他不一致。

## 與清單「要撐的結論」不合的地方

清單：「15% 的人在論壇貢獻；貢獻者通過率 64% 對 32%（觀察值）」。

- 數字本身對，但要加上分母：**排除成績 ≤ 0.01（占有成績者 71%）之後**的 3,350 人。不加限定直接寫「15% 的人在論壇貢獻」是錯的；全體有成績者裡發文的不到 5%，通過率對照是 57% 對 8%。
- 「觀察值」的標註正確：這篇沒有任何操弄，作者自己說因果不明，還提出貢獻可能只反映投入與堅持。
- 這篇更值得引的其實是限通過者的結果：發不發文成績沒差（p = .107）；只有發內容相關串的人高 2 個百分點，內容串發文數只解釋 3.2% 的成績變異；作者結論是「沒有記錄到強關係」。清單只寫通過率差距，會漏掉這篇自己最主要的保留。

## 讀取紀錄

- 重轉檔 L1–520（標題、摘要、引言、文獻回顧、研究框架、方法、資料、Table 1–2 開頭）
- L520–1079（Table 1–2、Figure 1、4.3 通過與否、Table 3–6、4.4 成績、Figure 2、Table 7–8、4.4.2 迴歸）
- L1079–1474（Table 9、討論 5.1–5.4、結論、致謝、參考文獻；參考文獻只掃過）
- 合計涵蓋全文。重轉檔的段落順序有左右欄交錯（例如 L139–147 是 2.1 的後半，排在 2.2 之前），閱讀時依 PDF 版面接回。
- 對過 PDF 版面：第 5 頁（Table 1–3、Figure 1）、第 6 頁（Table 4–6）、第 7 頁（Table 7–8、Figure 2）、第 8 頁（Table 9、5.1–5.2）。
