# 抽取紀錄：Aghajani et al. 2019, Software Documentation Issues Unveiled

read_status=full（作者頁 PDF，12 頁，ICSE 2019 會議版排版；未與 IEEE Xplore 版逐字比對）

## 書目

- 作者：Emad Aghajani, Csaba Nagy, Olga Lucero Vega-Márquez, Mario Linares-Vásquez, Laura Moreno, Gabriele Bavota, Michele Lanza（USI 瑞士、Universidad de los Andes、Colorado State）
- 年份／刊物：2019，ICSE 2019（41st International Conference on Software Engineering）
- 實際讀的檔案：https://emadpres.github.io/pdfs/icse2019.pdf（12 頁，含頁碼 1–12，無 DOI 頁腳）
- 全文文字檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/aghajani-2019.txt
- 複製套件：https://github.com/REVEAL-ICSE19-DocIssues/ReplicationPackage（論文 [56]，未開啟）

## 研究設計、樣本、比較、量了什麼

- RQ（§III）："What are the documentation issues faced by developers?"
- 設計：挖掘式（mining）質性研究，不是問卷。作者明說是為了避開過去問卷研究的偏誤："Previous studies investigating documentation issues have been based on surveying developers, which naturally leads to a somewhat biased view"（摘要）。
- 資料來源（Table II，§III-A）：
  - Stack Overflow：2018-06 dump，78 個文件相關 tag，非負分問題，28,792 討論（取問題＋兩個最高分答案＋被採納答案）。
  - GitHub issues／PR：GitHub Archive 2015-01～2018-04，≥10 forks 或 stars 的專案，66 個關鍵字比對標題或首帖 → 394,504 issues、375,745 PRs。
  - Apache 郵件列表：295 個 ASF 專案的 docs/dev/users 共 480 個列表 → 6,898 封 thread。
  - 候選總數 805,939。
- 抽樣：目標 99% 信心 ±5%（665 份）；但比例抽樣會讓 SO 與郵件列表幾乎消失（issue＋PR 佔 >90%），所以 SO、郵件列表各抽 96 份（95% ±10%），issue／PR 照比例 → 829 份（99% ±4.5%）。
- Table II 最終數字：人工分析 878（含替補）、偽陽性 49、有效 824、標記句子 1,548。
  - Issues 345／19／324／562；Mailing Lists 101／5／95／220；PR 332／21／310／581；SO 100／4／95／185。
- 標記：六位作者，Web app 輔助，以句子為單位，每份兩人獨立標，衝突由第三人裁決。標籤四類：問題、解法、文件類型、工具。問題類型起點用 Zhi et al. 2015 的 13 個品質屬性；文件類型起點 11 個預設標籤。
- 衝突率：765／829（92.27%）有衝突；自動解掉子字串類衝突後剩 592 份人工裁決。
- 產出：162 種文件問題的階層分類（Fig. 1），四大類：Information Content (What)、Information Content (How)、Process Related、Tool Related。
- 量了什麼：每類的 artifact 數（一份 artifact 可屬多類）；各類在四種來源的分布；子類的百分比。沒有嚴重度、沒有頻率以外的影響測量。

## 可引用結果

1. 四大類的 artifact 數（§IV、Fig. 1）
   - What 485、How 255、Process 81、Tool 134（有效 824 份，可重複計入）。
   - 原文："The number shown in the main categories of Figure 1 represents the number of artifacts related to that issue (e.g., 81 artifacts were related to process-related issues). Note that a single artifact might discuss multiple types of issues."

2. 內容（What）三子類：不完整最多，其次過時，再其次錯誤（§IV-A）
   - Completeness 268、Up-to-dateness 190、Correctness 72。
   - 原文："Completeness accounts for 55% of the issues related to the documentation content."
   - 原文："Up-to-dateness problems account for 39% of issues related to documentation content."
   - 注意：55%、39% 的分母是 What 類 485 份；Correctness 72／485 ≈ 15%（論文沒寫這個百分比，是我算的）。三者加總 >100% 因為可重複。

3. 過時（up-to-dateness）的定義與機制（§IV-A）
   - 原文："A document is outdated when it is not in sync with other parts of a system. Up-to-dateness differs from "Correctness" and "Completeness" in that the information was correct and complete before a change was introduced."
   - 原文："In 21% of these cases, the inconsistency appeared to be between a system's behavior and its description in the documentation. The discrepancy was usually triggered by a change in the code that required to change parts of the documentation or to add/remove content."
   - 最常見的過時子類："outdated references (e.g., links to old versions of the system), which was the most prevalent issue within this category."
   - 預防作法："adding this as one of the items to check in the contribution to-do list [82], or even making Javadoc update mandatory for pull request acceptance [83]."

4. 錯誤（correctness）最常出在範例程式碼（§IV-A）
   - 原文："The type of documentation most frequently impacted by correctness issues was code examples (e.g., [66]), accounting for 50% of the cases in which we labeled a documentation type, followed by installation guidelines (20%...)"
   - 不完整最常出在 API reference 與程式碼註解："API references and code comments are the types of documentation mostly affected by completeness issues."

5. 「寫了但找不到」：可用性問題一半是可尋性（§IV-B）
   - Usability 138、Readability 107、Maintainability 21、Usefulness 20。
   - 原文："Half of the issues (50%) were related to information content findability, i.e., when the desired information was available but couldn't be found by a user"
   - 原文："Information organization (18%) ... constitutes the second most common concern in this category."
   - 原文（討論）："if existing documentation cannot be found it conceptually does not exist"
   - Readability 中 "lack of clarity represented more than half (55%) of these problems"；第二是錯字。

6. 重複內容與多餘檔案（§IV-B Maintainability）
   - 原文："Just like in source code, duplicated content caused troubles for documentation maintainers, which were mostly resolved by replacing the clone with links and references."
   - 原文：Apache httpd 開發者 "get rid of these no-content files so they don't confuse the issue of what still needs to be documented"

7. 流程類：外部貢獻者不知道怎麼改（§IV-D）
   - Contributing to doc 50、Internationalization 20、Development issues caused by doc 8、Traceability 5、Doc-generator configuration 4。
   - 原文（使用者）："I don't know where I should modify this page, I have no problem to update it but because I know that cannot be modified directly I don't know where to do it"
   - 可追溯性的解法："move wiki to /docs [...] It also means docs are versioned with each new release"；無法版控時在每份文件頂端加 meta："(english version, author, reviewer)"
   - 原文："developers have to provide contributors with clear guidelines (ideally accompanied by documentation templates)"；"making a build fail when documentation issues are spotted"

8. 來源分布（Fig. 1 左側）
   - What：Issues 46%、PR 42%、Mailing 11%、SO <1%。How：Issues 40%、PR 37%、Mailing 17%、SO 6%。Process：Mailing 40%、PR 28%、Issues 21%、SO 11%。Tool：SO 61%、Issues 21%、PR 14%、Mailing 4%。
   - 原文："problems related to the content and how it is presented/organized are mostly discussed in issues and pull requests; and discussions about the documentation process and tools-related issues are mainly held in mailing lists and SO respectively."

9. 工具類：Help required 90（83% 是 how-to 問題，79% 在 SO）、Support/Expectations 34、Bug 17、Tool migration 4。

10. 結論句（§VI）
    - 原文："Developers (and users) prefer documentation that is correct, complete, up to date, usable, maintainable, readable and useful."
    - 原文："documentation is not a mere add-on to any software system, but a part of the system itself."

## 作者限制（§V Threats to Validity）

- 建構效度：關鍵字比對有偽陽性（已人工剔除）；只看 artifact 內寫的內容，"an issue was partially discussed in the mailing list and partially via chat" 會漏。
- 內部效度：人工標記主觀，以兩人獨立＋第三人裁決緩解。
- 外部效度："it is possible that our taxonomy of documentation issues depends on the particular set of discussions we analyzed, and that in other contexts developers discuss issues we did not encounter."
- 作者沒寫但結構上明顯的：全部是開源專案公開討論；沒有企業內部 wiki／Confluence 資料。

## 與摘要或常見轉述不一致處

- 數字不是「問題發生率」而是「被拿出來討論的次數」。被抱怨的才會出現在 issue／PR；沒人發現的過時文件不會被算到。所以「55% 是不完整」不能轉述成「55% 的文件不完整」。分母是 485 份「談內容問題」的 artifact。
- 「878 份 artifact」：摘要與結論寫 878，但有效只有 824（49 偽陽性、另有 5 份最後裁決時剔除）。內文另出現 665（原抽樣目標）與 829（實際分配）兩個數字，容易混用。
- 162 種問題類型是「分類節點數」，不是 162 種獨立嚴重問題；很多子類只有個位數 artifact。
- 樣本以 issue＋PR 為主（What 類 88% 來自 issue／PR），SO 只佔 What 類 <1%。若轉述成「Stack Overflow 上開發者最常抱怨文件不完整」是錯的。
- 本研究是開源、軟體技術文件（API、註解、安裝說明），不是企業內部知識庫。套用到「團隊 wiki 為什麼爛掉」要明說是類比：過時的機制（程式改了、文件沒跟著改）可以借，比例不能借。
- 「correctness 15%」是我自己算的（72／485），論文正文沒給這個百分比。

## 讀取紀錄

- 全文檔：fulltext/aghajani-2019.txt，870 行，115,400 bytes（`wc -lc`）；PDF 12 頁。
- 依序讀過：1–300 行（摘要、§I、§II、Table I、§III-A/B/C、§IV 開頭、Fig. 1 前半）→ 300–599 行（Fig. 1 後半、§IV-A Correctness/Completeness/Up-to-dateness 與討論、§IV-B、§IV-C、§IV-D 前半）→ 600–870 行（§IV-D 後半、§V、§VI、致謝、References、Artifacts' References）。涵蓋 1–870。雙欄 PDF，pdftotext 左右欄並排，逐欄對讀；Fig. 1 文字是 pdftotext 打散的樹狀圖，主類數字與正文核對一致。
- 管道：`curl -L -A "Mozilla/5.0"` 任務指定 URL → 200 PDF → `pdftotext -layout`（成功）。
