# 抽取紀錄：Cleverley, Cousins & Burnett (2023) Impact of COVID-19 on search in an organisation

read_status=read（PMC 全文 L1–L360 讀完；L360 之後為參考文獻）

## 書目

- Paul H. Cleverley、Fionnuala Cousins、Simon Burnett（Robert Gordon University）。*Journal of Information Science* 49(1): 43–58，2023 Feb（online 2021）。DOI: https://doi.org/10.1177/0165551521989531 ；CC BY 4.0。
- 讀取方式：2026-10-22 curl 抓 https://pmc.ncbi.nlm.nih.gov/articles/PMC9895274/ → pandoc。圖（Figure 1–12）只有圖說，沒有圖內數字。
- 全文檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o10-cleverley-covid-pmc.txt（427 行，57,323 bytes）。

## 性質

- 單一知識密集跨國企業（10 萬人以上，索引數億筆內網頁、文件、討論串）的企業搜尋紀錄分析，2020-01 至 2020-05 共 250 萬次查詢，2019 同期為基準（L176–180）。紀錄只有查詢字、次數、日期、CTR；沒有使用者 ID，無法看連續查詢（L182–184）。

## 可引用結果（附行號）

1. 用 CTR 判斷需求沒被滿足（L182）："the lower the CTR, the more probable that users making that query did not see any results that they deemed useful to click on."
2. 低 CTR 例子（L306）：遮蔽過的查詢「covid [地點 1]」被查 129 次，只有 1 次點擊。
3. 組織沒看紀錄（L264、L308）：IT 確認疫情期間沒人用過搜尋紀錄；"search logs were not monitored by the organisation (not unusual in the enterprise [32]). This resulted in its inability to 'know' that uncertainty was not being made clearer in many situations."
4. 同義詞（L266、L310）：查詢裡出現 9 種寫法（'Coronovirus'、'corona virus'、'covid'、'covid-19'、'covix-19'…）；'corona' 系列 CTR 高於 'covid' 系列，作者推論是沒設同義詞造成不同結果——"the vocabulary problem"，"This supports the assertion that use of synonyms may improve results and CTR."
5. 舊內容排在前面（L298）：組織做了很多 COVID 溝通頁，"none were promoted as the 'key ones' and the search engine often returned older results ranked higher than the latest information."
6. 企業查詢很短、幾乎不問句（L282）：問句型查詢 <0.5%，Google 約 8%。
7. 約 20% 查詢是翻頁（L220）。
8. 心理健康相關查詢比例上升（L312）；作者提醒員工可能怕公司搜尋可回溯到個人而不敢查（L320）——與個資處理相關。
9. 結論建議（L344–346）：確保同義詞、支援文件型查詢、把最新資訊排好；做一個類似 Google Trends 的搜尋紀錄儀表板。

## 沒寫的事

- 沒有零結果分析；失敗是用低 CTR 推論。
- 沒有介入實驗（沒有加了同義詞之後的前後比較）；同義詞的效益是從 CTR 差異推論。
- 沒有詞彙落差的比例。

## 與摘要或常見轉述不一致處

- 摘要說 "Low click through rates imply some information needs were not met"——是推論，作者用 "imply"、"probable"，不是驗證。

## 限制

- 單一公司、疫情特殊期間；部分查詢因可辨識公司而遮蔽（L196、L298）。作者自己說只是 "scratched the surface"（L334）。

## 對 order 10 的用法

- 補 NN/g 沒講的訊號：「有結果但沒人點」也是缺口，零結果清單抓不到。
- 「寫了但找不到」的實例：內容存在、但舊頁排前面、沒有被指定為權威頁。
