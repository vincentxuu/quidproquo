# 抽取紀錄：Shaffer 等 2010，Algorithm Visualization: The State of the Field

- **書目**：Clifford A. Shaffer, Matthew L. Cooper, Alexander Joel D. Alon, Monika Akbar, Michael Stewart, Sean Ponce, Stephen H. Edwards (2010). Algorithm Visualization: The State of the Field. *ACM Transactions on Computing Education*, 10(3), Article 9, 22 pages（August 2010）。DOI 10.1145/1821996.1821997。作者名與單位對首頁（txt L3–9；Cooper 當時在 Microsoft，其餘 Virginia Tech）與 ACM Reference Format（L51–54）。
- **原文檔**：`.work/learning-visualization-research/src/shaffer2010.txt`（`pdftotext` 不帶 `-layout`，1,138 行、67,052 位元組）；PDF：同目錄 `shaffer2010.pdf`（22 頁）。
- **取得網址**：https://cs.utep.edu/makbar/papers/TOCE.pdf（共同作者 Monika Akbar 在 UTEP 的個人網頁；ACM DL 亦開放）。合法：作者個人頁公開版本。
- **版本**：刊出版排版（每頁頁尾「ACM Transactions on Computing Education, Vol. 10, No. 3, Article 9, Pub. date: August 2010」）。早期版本是 Shaffer 等 2007 SIGCSE 論文（L26）。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：系列第 2 篇（圖表）「演算法的圖」一節 L169、附錄 L414、參考資料 L450。

## 研究設計

- **類型**：現況清點（描述性），不是學習實驗，也不是系統性文獻回顧。
- **資料來源**：作者自建的 AlgoViz Wiki 演算法視覺化（AV）連結目錄（第 3 節）。範圍限於大學資料結構與演算法課程常教的主題（L85–95）。
- **蒐集方法**（3.3，L443–465）：從已知 AV 系統清單出發、依教學經驗擬主題表、用 Google 搜尋、再從找到的頁面順藤摸瓜與拆 URL 找更多。作者說這模擬教師找 AV 的方式（L524–526）。
- **計數規則**（4.1，L498–513）：一個程式含多個演算法的視覺化就分開計；同一程式的不同語言版或不同輸入只算一筆；插入／選擇／泡沫排序合成「quadratic sort」一筆。
- **品質評等**：編者給「Recommended」「Has Potential」「Not Recommended」三級（3.2，L344–348）。
- **時間點**：目錄數量截至 2010 年 3 月（L495）；連結追蹤自 2007 年 5 月起每週一次（L877）。

## 結果（逐項）

| # | 結果 | 數字 | 節／表 | 行號／頁 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 總數 | 超過 500 個 AV；依不重複連結算超過 450 個程式；舊系統（XTANGO、Balsa）未計入，計入會再多一百多筆 | 4.1 | L495、L510–518 | 「As of March, 2010, the collection contains links to more than 500 AVs.」 |
| 2 | 品質：摘要的說法 | 許多 AV 品質低，主題分布偏向少數較容易的主題 | 摘要 | L14–15 | 「Unfortunately, we found that many AVs are of low quality, and coverage is skewed toward a few easier topics.」 |
| 3 | 品質：評等數字 | 超過四分之三的條目已評等；其中 18% Recommended、42% Has Potential、30% Not Recommended（三者合計 90%，原文沒有說明另外 10%） | 5 | L988–990 | 「Of these, 18% are ranked as “Recommended,” 42% are ranked as “Has Potential,” and 30% are ranked as “Not Recommended.”」 |
| 4 | 評等的限制 | 作者打算日後正式研究評等是否受主觀偏誤影響 | 5 | L990–993 | |
| 5 | 排序占比 | 超過四分之一的 AV 在畫排序；Table II 排序共 130 個 | 4.4／Table II | L571–572、L672；PDF p.14 | 「Over a quarter of all collected AVs demonstrate sorting algorithms.」 |
| 6 | 排序 AV 多半只是換長條 | | 4.4 | L673–675 | 「many of these sorting AVs are variations on the classic “Sorting Out Sorting” video ... and merely show bars being swapped.」 |
| 7 | 線性結構 | 約 9%（Table I 線性結構 46） | 4.4／Table I | L569–571；PDF p.14 | 「About 9% of all AVs demonstrate linear structures such as stacks and queues」 |
| 8 | 壓縮與 NP-完備 | 壓縮演算法 18 個（3.5%），其中 13 個是 Huffman；NP-completeness 9 個（< 2%） | 4.4／Table II | L750–752；PDF p.14 | 「only 18 AVs (3.5%) cover compression algorithms and 13 of those are on Huffman coding. Even worse, a fundamental topic for upper-division courses like NP-completeness gets attention in only 9 AVs (< 2%).」 |
| 9 | Table I／II 其他類別（PDF 第 14 頁對過） | 搜尋結構 76、空間搜尋結構 31、其他資料結構 25；搜尋演算法 18、圖演算法 68、網路與 OS 10、動態規劃 9、計算幾何 20、字串比對 6、其他演算法 47 | Table I–II | PDF p.14 | 表 |
| 10 | 誰做的 | 不到三分之一是單打獨鬥（1–5 個）；約 10% 是小團隊（6–10 個）；約 60% 來自做過 10 個以上的團隊（Table III：31%、10%、25%、35%） | 4.5／Table III | L755–765 | |
| 11 | 實作 | 1990 年代中期以來幾乎都是 Java；略多於三分之二可直接在瀏覽器看 | 4.2 | L538–545 | |
| 12 | 散布 | 幾乎沒有 AV 放在大型組織化的典藏庫 | 4.3 | L552 | |
| 13 | 連結流失 | 2009 年 8 月 382 個不重複連結中 60 個（15.7%）曾失效，找回 49 個，11 個（2.9%）永久遺失；2010 年 3 月 455 個連結中 20 個（4.4%）找不到 | 4.7 | L878–889 | |
| 14 | 授權 | 全部免費；447 個已知狀態中 43% 不給原始碼 | 4.8 | L891–901 | |
| 15 | 文獻回顧中的 Hundhausen | 2002 年 meta-study，24 個研究；學生怎麼用比看到什麼影響大 | 2.2 | L291–295 | 「Hundhausen found that how students use an AV has more effect on learning outcomes than what they see.」 |
| 16 | 結論 | 困難主題（如 B-trees、NP-completeness）沒有令人滿意的 AV；小型開發者多半不知道成效研究的教訓 | 5 | L911–912、L926–930 | |

## 作者自己列的限制

- 什麼算一個 AV、什麼算靜態教材，界線仍難定（L766–833）。
- 搜尋偏向找得到的團隊與專案，漏掉的多半是單打獨鬥的小作品（L835–838）。
- 用「applet」當關鍵字造成偏誤，後來刻意補非 applet 的條目（L436–439）。
- 開發年份多靠推測（L847–849）。
- 第 4 節的資訊多半是人工整理，很快就會過時（L971–974）。
- 評等的主觀性尚未研究（L990–993）。

## 與摘要說法不一致的地方

- 摘要說「many AVs are of low quality」；正文的評等是 30% Not Recommended、42% Has Potential、18% Recommended（L988–990），「許多」大致對得上「Not Recommended」的 30%，但三項合計只有 90%，原文沒有說明缺口。其餘逐項對過，沒有不一致。
- 3.5% 的分母：18／3.5% ≈ 514，與「超過 500」相符，原文沒寫明分母。

## 與清單「要撐的結論」不合的地方

清單 D-9 寫「超過 500 個、四分之一在畫排序、18 個（3.5%）」。原文撐得住，但原文是「超過四分之一」（over a quarter），不是「四分之一」。

## 已發佈文章引用核對（第 2 篇 `2026-10-13-diagrams-in-teaching-articles.md`，2026-10-14 實查行號）

| 文章行 | 文章說法 | 原文是否一致 |
|---|---|---|
| L169 | 「Shaffer 等人（2010）清點了超過 500 個演算法視覺化」 | **一致**（L11–12、L495） |
| L169 | 「結論是許多品質不佳」 | **一致**（摘要 L14）。若要給數字：已評等的條目裡 30% 被評為不推薦、18% 推薦（L988–990），且是編者評等，作者自承尚未檢驗主觀偏誤 |
| L169 | 「而且超過四分之一都在畫排序」 | **一致**（L571–572） |
| L414（附錄） | 「只有 18 個視覺化（3.5%）涵蓋壓縮演算法，NP-completeness 只有 9 個。」 | **一致**（L750–752；Table II 對 PDF 第 14 頁） |
| L414、L450 | 「我讀了摘要與 4.4 節的片段。」 | 已讀完全文，這句要更新 |
| L169（語境） | 放在「後續的狀況不樂觀」之下 | 原文是現況清點與編者評等，不是學習成效研究；用來說「品質與主題分布不樂觀」可以，不能延伸成「視覺化沒有學習效果」。文章目前沒有這樣延伸 |

## 讀取紀錄

- txt L1–600、L600–1138 依序讀完（參考文獻 L1018–1133 掃過），兩段首尾相接，涵蓋全文。
- 對 PDF 第 14 頁（Table I、Table II 各列與數字配對）。Table III、IV 只讀 txt（文章沒有引用），txt 中數字與列名分離，配對未對 PDF。
