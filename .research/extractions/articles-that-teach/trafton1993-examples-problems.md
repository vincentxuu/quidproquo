# 抽取紀錄：Trafton & Reiser 1993，The Contributions of Studying Examples and Solving Problems to Skill Acquisition

- **書目**：J. Gregory Trafton（Princeton University, Cognitive Science Laboratory）、Brian J. Reiser（Northwestern University, The Institute for the Learning Sciences）。1993。Proceedings of the Fifteenth Annual Conference of the Cognitive Science Society（Boulder, CO），pp. 1017–1022（頁碼取自其他文獻的引用，例如 Reiser 等人的後續論文參考文獻；本機作者版沒有頁碼）。無 DOI。作者全名對過 PDF 首頁。
- **原文檔（本紀錄依據）**：`.research/raw/learning-content/pub5/trafton-reiser1993-gregtrafton.pdf`（6 頁）／`.txt`（`pdftotext` 不帶 `-layout`，509 行、24,668 字元）。
- **取得網址**：https://gregtrafton.com/papers/studying%20examples%20solving%20problems%20skill%20acquisition.pdf （第一作者 J. Gregory Trafton 的個人網站論文頁，合法公開）。2026-10-14 下載。
- **版本**：作者版（LaTeX 排版、無論文集頁碼與頁首；首頁有 ONR 經費註腳）。不是論文集刊出排版，但內容是會議論文全文。
- **讀取日期**：2026-10-14
- **供哪篇使用**：第 1 篇（證據，`src/content/posts/learning/2026-10-13-teaching-text-evidence.md`）；核對 IES 2007 指引的轉述（`.research/extractions/teaching-text/ies2007.md` 第 86 行）。

## 重要：清單指定的檔是錯的論文

清單 G 的 E-3 指定 `R/pub5/trafton-reiser1993-escholarship.pdf`／`.txt`（464 行、24,785 字元，取自 https://escholarship.org/uc/item/71d733c9 ）。我從第 1 行讀到第 464 行並看了 PDF 第 1–2 頁：**封面頁是 Trafton & Reiser 的 eScholarship 題名頁，但第 2–7 頁正文是 Keith Vander Linden〈Generating Effective Instructions〉（論文集 pp. 1023–1028）**，談 IMAGENE 指令文字生成系統，和例題完全無關。eScholarship 上 Vander Linden 那篇自己另有條目（https://escholarship.org/uc/item/66x4f980 ）。也就是說 eScholarship 71d733c9 條目掛錯了 PDF（條目頁的摘要是對的）。2026-10-14 用 curl 重抓 eScholarship 被 CloudFront 403 擋，無法確認現在是否已修正；Exa 讀到的條目頁摘要仍是 Trafton & Reiser 的。

**結論：舊檔不能當 Trafton & Reiser 的原文；清單 G 的「合法來源」欄要改成第一作者網站版。** 若文章參考資料連到 eScholarship 71d733c9，讀者點進去拿到的是別篇論文。

## 研究設計

- **類型**：實驗室實驗，2×2 受試者間設計（PDF p.2 左欄「We manipulated the order of problems (alternating or blocked sources and targets) and the activity on the sources (study examples or problems to solve).」txt L105–109）。
  - 排法：交替（每個 source 後面緊接相似的 target）對 集中（全部 source 之後才是全部 target）。
  - source 的活動：讀附註解的例題（example）對 自己解（solve）。
  - 四組：Alternating Example（AE）、Alternating Solve（AS）、Blocked Example（BE）、Blocked Solve（BS）（Table 1，PDF p.3；txt L114–175）。
- **受試者**（PDF p.3 Method，txt L196–206）：「The subjects were 40 undergraduate paid volunteers from Princeton University and other nearby colleges.」每組 10 人，依 Math SAT 大致配對。程式設計修課不超過一學期、沒學過 LISP。註 1：另有 3 人因電腦當機、1 人因耗時超過次慢者 2 個標準差而排除。
- **教材**：入門 LISP 教科書（Anderson, Corbett & Reiser 1987）兩章，在 BATBook 電子書與解題環境中進行。例題包含題目敘述、解題程式，以及「several sentences of explanation describing how the program satisfied the problem's constraints」（txt L185–187）。受試者可搜尋說明文字，但**任何時候都看不到先前的例題或自己先前的解答**（txt L196–197「they did not have access to prior examples or their prior solutions at any time」）。
- **程序**（PDF p.4，txt L246–252）：第 1 章大家相同；第 2 章套用實驗條件。「There were six sources and six targets; subjects in the two solve conditions solved twelve problems and saw no examples, subjects in the two example conditions studied six examples and solved six problems.」
- **量了什麼**（txt L291–305）：source 的讀／解時間、target 的解題時間、每題第一次解答的正確率、後測答案正確率。正確率以「讓程式變正確最少要加、刪、換幾個元件」計分。
- **何時量**：學習階段當下；學習後立即做後測，後測是「three near transfer problems」，可在 LISP 視窗自測但送出時沒有回饋（txt L256–285）。沒有延後測驗。

## 結果（逐項）

| # | 結果 | 數字 | 對照 | 位置 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 第 1 章基準相同 | 解對 98% 以上；時間與嘗試次數各 F 不顯著 | 四組 | p.4 Results，txt L307–311 | 「Students solved over 98% of the problems correctly in Chapter 1. As expected, there were no differences in overall time or solution attempts, all F's non-significant.」 |
| 2 | 交替例題 vs 集中例題：target 解題時間 | AE 較快，Tukey p < .05（Figure 1：AE 總時間約 51 分鐘、BE 約 78 分鐘，數字是我從圖讀的近似值） | AE vs BE | p.4 右欄，txt L253–272；Figure 1 p.5 | 「subjects who solved problems interleaved with examples took less time on the target problems than subjects who studied a block of source examples and a block of target problems (see Figure 1), Tukey test, p < .05.」 |
| 3 | 同上：第一次解答正確率 | 85% vs 78%，Tukey p > .10（**無差異**） | AE vs BE | p.4 右欄 | 「The accuracy of first solution attempts did not differ for the Alternate Example condition and the Blocked Example conditions (85% vs. 78%), Tukey test, p > .10.」 |
| 4 | 讀例題時間相同 | F < 1 | AE vs BE | p.4 右欄 | 「subjects spent equal time studying examples, F < 1.」 |
| 5 | **交替例題 vs 集中例題：後測** | AE 較高，Tukey p < .05（Figure 2：AE 約 89%、BE 約 67.5%，圖讀近似值；BE 誤差線很長，約 59–76） | AE vs BE | p.4 右欄；Figure 2 p.5 | 「Subjects in the Alternating Example condition submitted more accurate solutions than subjects receiving blocked examples, Tukey test, p < .05.」 |
| 6 | 集中自解 vs 集中例題：target 解題時間 | BS 較快，F(1,35) = 11.2，p < .01 | BS vs BE | p.5 左欄 | 「subjects in the Blocked Solve condition solved the target problems faster than subjects in the Blocked Example condition, F(1,35) = 11.2, p < .01.」 |
| 7 | 同上：第一次解答正確率 | F(1,35) = 2.05，n.s. | BS vs BE | p.5 左欄 | 「there were no differences in accuracy of first solutions, F(1,35) = 2.05, n.s.」 |
| 8 | 同上：後測 | BS 較高，F(1,35) = 5.2，p < .05（Figure 2：BS 約 83.5%） | BS vs BE | p.5 左欄 | 「subjects in the Blocked Solve condition performed better on the posttest than subjects in the Blocked Example condition, F(1,35) = 5.2, p < .05.」 |
| 9 | 交替例題 vs 交替自解：target 時間 | AE 稍慢，F(1,35) = 2.68，p < .12（不顯著） | AE vs AS | p.5 右欄 | 「this difference is not reliable, F(1,35) = 2.68, p < .12.」 |
| 10 | 同上：第一次解答正確率 | 85% vs 87%，F(1,35) < 1 | AE vs AS | p.5 右欄 | 「The accuracy of the first solutions for Alternating Example and Alternating Solve subjects also did not differ (85% vs. 87%), F(1,35) < 1.」 |
| 11 | 同上：後測 | AE 較高，F(1,35) = 4.3，p < .05（Figure 2：AS 約 76.5%） | AE vs AS | p.5 右欄 | 「subjects in the Alternating Example condition performed better on the posttest than did subjects in the Alternating Solve condition, F(1,35) = 4.3, p < .05.」 |
| 12 | AE 後測最高 | 文字敘述 | AE vs 其他三組 | p.6 左欄，txt L439–445 | 「Even though subjects who studied examples took somewhat longer, their time was well spent: they performed better than all other conditions on the posttest.」（注意：原文沒有報 AE 對 BS 的檢定） |
| 13 | 作者的結論 | — | — | p.6，txt L478–497 | 「The most efficient way to present material to acquire a skill is to present an example, and then a similar problem immediately following.」 |

Figure 2 的交互作用方向：例題組在交替時最好、集中時最差；自解組反而集中（約 83.5）高於交替（約 76.5）。原文沒有報 AS vs BS 的檢定。

## 作者自己列的限制

原文沒有獨立的限制節。正文承認的不確定只有：交替兩組的比較「the results were somewhat puzzling」（txt L386），以及 AE 比 AS 快慢不顯著。作者沒有討論樣本量（每組 10 人）、後測只有三題近遷移、沒有延後測驗、只有 LISP 一個領域；這些是我讀到的缺口，不是作者寫的。

## 與摘要說法不一致的地方

- 摘要說「learning occurs best when the sources are problems to be solved, rather than examples」的前提是「if sources are not accessible or remembered」，正文支撐的是 BS > BE（集中條件）。正文同時發現交替條件下例題勝過自解（AE > AS），摘要沒有提這個結果。不算矛盾，但摘要只講了一半。
- 摘要說分開例題與題目「hindered learning」，正文的後測差異顯著，但第一次解答正確率沒有差異（85% vs 78%，p > .10）。摘要沒提這個沒差異的指標。

## 與清單「要撐的結論」不合的地方

清單 E-3：「六個例題全排在前面，學得比交替少。」

- 原文撐得住：BE（六個例題全部在前、六題在後）後測低於 AE（交替），Tukey p < .05；target 解題時間也較長。
- 要補的條件：每組只有 10 人；後測是學習後立即做的三題近遷移；第一次解答正確率沒有差異；受試者在解題時看不到先前的例題（這是作者刻意設的條件，交替的好處被解釋為「例題還記得」）；領域是 LISP 程式設計，不是數學。
- IES 2007 的轉述（ies2007 紀錄第 86 行：「if students are given all six examples before all six problems, they learn significantly less than if the examples and problems are interleaved, with the same six examples and six problems alternating in order.」）與原文一致：六個 source、六個 target，AE 與 BE 讀的是相同例題、解的是相同題目。IES 沒說每組 10 人、只立即測，也沒提 BS > BE。

## 已發佈文章引用核對

文章：`src/content/posts/learning/2026-10-13-teaching-text-evidence.md`（2026-10-14 讀到的版本）。

| 行 | 文章說法 | 與原文是否一致 |
|---|---|---|
| 55 | 「指引轉述一個直接比較排法的實驗：把六個例題全部排在六題之前，學得比交替少。」 | **一致**。原文 AE vs BE 後測 Tukey p < .05。文章明說是經指引轉述，沒有引數字，措辭沒有超出原文。可補（非必要）：受試者 40 人、每組 10 人、LISP、立即後測。 |
| 218 | 「轉引：……IES 指引轉述的排法實驗……原研究我都沒有讀。」 | 現在已讀原文，這句在下次更新時可以改寫；原文與 IES 轉述一致。 |
| 參考資料 | 文章若要把 Trafton & Reiser 列入參考，**不要連 eScholarship 71d733c9**（該條目的 PDF 是 Vander Linden 的別篇論文），改連第一作者網站版。2026-10-14 這版文章沒有把它列成獨立連結（只經 IES 轉述）。 |

## 讀取紀錄

- 錯檔 `trafton-reiser1993-escholarship.txt`：L1–464 依序讀完（題名頁 L1–24；Vander Linden 正文 L26–463）；PDF 第 1–2 頁看過圖，確認是錯的論文。
- 正確檔 `trafton-reiser1993-gregtrafton.txt`：L1–509 依序讀完（題名與摘要 L1–48；導言 L49–112；Table 1 L114–175；預測與方法 L176–252；Table 2 L209–245；後測與結果 L253–437；結論與參考文獻 L439–509）。
- txt 的雙欄交錯與統計式（F 值、p 值）在 txt 中斷裂，PDF 第 3、4、5 頁全頁看圖，Table 1、Table 2、Figure 1、Figure 2 與所有 F／p 值都依 PDF 頁面記錄。PDF 第 1、2、6 頁的文字以 txt 為準（無表格）。
