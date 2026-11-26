# 抽取紀錄：Huurdeman, Aamodt & Heggø (2018) "More than Meets the Eye" – Analyzing the Success of User Queries in Oria

read_status=read（正文 L1–L134 讀完；L136 起為參考文獻）

## 書目

- Hugo Huurdeman、Mikaela Aamodt、Dan Michael Heggø（University of Oslo）。*Nordic Journal of Information Literacy in Higher Education* 10(1)，2018-05-31，peer reviewed。DOI: https://doi.org/10.15845/noril.v10i1.270 。資料公開於 https://github.com/uiolibrary/virak_paper_data（L56）。
- 讀取方式：curl 抓 doi.org 與 noril.uib.no 都沒有回應內容（HTTP 000）；改用 Exa web_fetch（doi.org URL）取得全文。圖表只剩圖說與部分表格文字。
- 全文檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o10-huurdeman-2018-oria.txt（193 行，53,281 bytes；長段落未斷行，行號以段落為單位）。

## 性質

- 大學圖書館探索系統（Primo／Oria）內建統計的交易紀錄分析。不是企業內網，但是少數把「零結果查詢」逐一判定原因的 2018 後實證研究。
- 樣本小：熱門查詢前 50 名＋零結果查詢隨機 50 筆人工編碼（L68）。

## 可引用結果（附行號）

1. 規模（L58–60；L130 表）：熱門查詢 3,729 個、115,590 次（占全部搜尋 4.9%）；零結果查詢 36,221 個不同查詢、52,257 次，同期全部搜尋 2,410,632 次（零結果約 2.2%，表 L130）。零結果查詢平均 5.6 個字，熱門 2.6 個。
2. 零結果原因（L92；50 筆樣本）：
   - 直接貼整段引文而找不到（文件其實在館藏）22%
   - 拼錯或引用錯 20%
   - 選錯搜尋範圍（其他範圍有結果）12%
   - 真的沒有這個資源 10%——作者稱 "perhaps being the only 'true' zero result searches"
   - 資源沒被索引（只索引了期刊或書，沒有篇章）6%
   - 欄位或語法錯 2%
   - 判斷不出原因 20%
3. 熱門查詢也會失敗（L84）：前 50 名有 20% 找不到目標（第一頁 10 筆內沒有），22% 判斷不出；失敗的熱門查詢平均回傳 650 萬筆，成功的約 3.8 萬筆（L86）——結果太多、排序沒把對的放前面。
4. 半年後重查（L94）：72% 仍零結果，28% 已改善；拼字建議只對一半的拼錯有提示。
5. 結論句（L118）："not encountering a book or article in the analysed library discovery system often does not mean that it is not available, but just that the system has trouble finding it with the current search terms."
6. 資料清理（L102）：紀錄混有館員查詢與課程示範查詢，要先分開。

## 沒寫的事

- 沒有使用者 session，不能看連續查詢（L108）。
- 沒有測試修正方案的效果。
- 圖書館書目資料，不是企業文件。

## 與摘要或常見轉述不一致處

- 摘要寫 "20% of the popular queries turned out to be unsuccessful"，但另有 22% 判斷不出；成功只有 58%（L84）。

## 限制

- 編碼樣本只有 50＋50；統計模組只給月／日聚合；作者坦承意圖判斷有主觀性（L108）。

## 對 order 10 的用法

- 「零結果 ≠ 沒有這份文件」的數字：50 筆零結果中只有 10% 是真的沒有；多數是寫了找不到（查法、範圍、索引、拼字）。
- 「熱門查詢也可能失敗」：零結果清單之外，還要實際跑熱門查詢看第一頁（呼應 NN/g「跑前 100 名」）。
