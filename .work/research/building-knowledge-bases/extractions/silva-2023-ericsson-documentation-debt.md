# 抽取紀錄：Silva, Unterkalmsteiner & Wnuk (2023) Towards identifying and minimizing customer-facing documentation debt

read_status=full（arXiv 全文；兩欄 PDF 改用非 layout 模式轉文字後逐段讀）

## 書目

- Lakmal Silva（Blekinge Institute of Technology 與 Ericsson AB）、Michael Unterkalmsteiner、Krzysztof Wnuk（BTH）
- 2023 ACM/IEEE International Conference on Technical Debt（TechDebt 2023）。DOI: https://doi.org/10.1109/techdebt59074.2023.00015（Exa 顯示 IEEE 上線 2024-02-16）
- 讀的檔：arXiv:2402.11048 v1（2024-02-16），curl https://arxiv.org/pdf/2402.11048（HTTP 200，286,312 bytes）→ `pdftotext`（不加 -layout；-layout 版兩欄交錯無法讀）
- 全文檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o9-silva.txt（1,121 行，57,774 bytes）。兩欄 PDF 的轉檔有部分段落左右欄交錯（尤其行 400–460），行號僅供定位。

## 研究設計（性質：實證，單一產品的缺陷報告分析＋解法提案）

- 對象：Ericsson 一個在 Kubernetes 上、用 Helm 管理生命週期的微服務產品「System A」（行 222–230）。
- 資料（行 275–286）：2019-03～2022-09 已解決的 bug 報告 1,663 筆；其中 438 筆導致文件更新，120 筆是因程式修正連帶改文件，318 筆是純文件缺陷。
- 抽樣與分類（行 300–308）：從 318 筆抽 101 筆（涵蓋 67 份對外文件，每份至少一筆、缺陷多的文件至少抽一半），用 Aghajani et al. 的文件缺陷分類法分類。
- 先導測試：10 筆中 8 筆兩人分類一致（行 337–344）。
- 解法（DDG 動態產生文件、ADT 自動化文件測試）只是提案與設計，沒有實作評估（結論段）。

## 可引用結果

1. 文件缺陷占比（行 280–285）：1,663 筆 bug 中 438 筆（26%，本紀錄自算）導致文件更新；318 筆（19%）是純文件缺陷。
2. 缺陷集中在哪類文件（RQ1，Table III；Exa 版全文段落）：超過一半在 Deployment Guides（129）與 Installation Guides（53）。
3. **自動產生的文件缺陷少**（行 451–458）："It is worth highlighting that the dynamically generated Release Notes only contained eight issues." 作者用 "We could conjecture" 推測是因為從可靠資訊源自動產生——是推測，不是比較實驗。
4. 缺陷類型（RQ2，行 406–415）：101 筆中 86 筆（85%）屬 Information Content (What)；第二層 Completeness 37、Correctness 30、Up-to-dateness 19；第三層最多的是 Erroneous code examples 23、Missing/Poor documentation 15、Missing configuration instructions 14、Outdated content 14。
5. 時間成本（RQ3，行 560–572 附近）：內部文件缺陷平均約 5 天才指派到團隊、約 10 天解決；外部回報約 7 天指派、約 7 天解決；40%（126/318）是外部回報；沒有一筆被評為最高嚴重度。
6. 可被自動化解法擋下的比例（行 600–604）：59% 的文件缺陷；換算 188 筆，占同期 1,663 筆 bug 的 11%。
7. 根因描述（行 616–633）：命令由開發者手動執行後轉給文件團隊，"mistakes ... can propagate unnoticed"；"the lack of automated documentation testing makes the information outdated very quickly, since detecting documentation discrepancies is a manual process."

## 可引用原句

- 結論（摘要）："In practice, documentation debt can easily go undetected since a large share of resources and focus is dedicated to deliver high-quality software."
- 解法核心（摘要）："both based on defining a single and robust information source for documentation."

## 沒寫的事

- 沒實作、沒評估 DDG／ADT；「59% 可避免」是分類後的推估上限。
- 沒有 owner、驗證週期或刪除相關的內容；對外文件由技術寫手維護（行 188–190），組織角色沒有細談。
- 解決時間只反映時程，作者自己說 "only a weak indicator of defect cost"。

## 與摘要或常見轉述不一致處

- 若有人轉述成「自動產生文件讓缺陷降到 8 筆」：原文只說 Release Notes 這一份文件只有 8 筆，沒有自動化前後比較，作者用 conjecture。
- 摘要寫 "Missing documentation (35)"、內文 RQ2 段第三層是 "Missing/Poor documentation (15)"＋"Missing configuration instructions (14)"，討論段又寫 "Missing documentation (36)"；摘要 "Outdated content (19)"，結果段第三層是 "Outdated content (14)"（19 是第二層 Up-to-dateness 的總數）——數字在摘要、結果與討論之間不完全一致，引用時用結果段 Table II 的第二層數字（Completeness 37、Correctness 30、Up-to-dateness 19）較穩。

## 限制

- 單一公司單一產品；作者承認外部效度問題，只做了命名對映（行 405–411）。
- 101 筆抽樣，非隨機（刻意多抽缺陷多的文件）。
- 對外（customer-facing）文件，不是團隊內部 wiki。

## 對 order 9 的用法

- 支持「能從程式或設定自動產生、能自動測試的文件，就不要靠人記得更新」；也說明「過時」只是文件缺陷的一部分（Up-to-dateness 19/86），缺漏與錯誤更多。
- 是 2023 年後的產業個案，可補時效；但它談的是 docs-as-code 的延伸（自動化），不是 docs-as-code 本身的成效證據。
