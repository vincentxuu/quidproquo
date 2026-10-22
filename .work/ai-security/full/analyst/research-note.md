# 調查修補線來源精讀與主張映射
2026-10-22；公開工具完整inventory無Groundlane；Exa MCP fallback。既有ai-for-security研究是起點，未把搜尋片段當正文。原始本輪抓取raw/fetch.json、fetch-0.md；來源專用raw重用路徑如下。

## 讀取與抽取
|ID|來源|讀取紀錄|可支持／不能支持|
|---|---|---|---|
|A1|GitHub Autofix docs|既有raw/fetch-0.md，順讀1–110，再110–末Next steps；完整抽取已讀|接CodeQL告警、片段context；原/新告警、語法、功能測試；部分/錯誤修補風險。廠商揭露，不推論工具成功率|
|A2|OWASP Logging|本輪raw/fetch-0.md 1485–1864，順讀完整頁到References|when/where/who/what、event/collection時間差、來源信任、PII/token遮蔽、缺失與完整性；異常不直接證明攻擊|
|A3|Security Copilot Agent RAI FAQ|既有raw/fetch-2.md 1–末Plugin Support，完整已讀|指定任務、managed/captured user、RBAC；不是自製agent能力或成效實證|
|A4|SIABench arxiv2603.06422v1|本輪raw/fetch-0.md逐段1–155、156–370、371–610、611–830、831–1190、1191–1484；全文含refs/附錄，後接arxiv說明與OWASP另算|資料/方法/假設/失敗模式；不引用論文任何分數|
|A5|Microsoft SOC Productivity 2024|既有raw/fetch-3.md順讀1–65、66–260、tail30至最後公式，全文抓取已讀；公式/表格排版損傷|觀察性、PS matching+DiD，依採用與結案時間；未觀測混淆/選案；不引用效果量或公式|

A4 metadata開頭Author欄誤列Alahmadi等，正文署名Jajodia/Sultana/Majumdar/Taylor/Vandenberghe。本組文章不提作者名，registry採正文。這也示範tool metadata不可當作者權威。

### A4完整論文抽取
研究問題：junior analyst的事件分析/分流能否用agentic benchmark測量。材料為訓練平台事件artifact與CIC/TII流量資料；真值人工回查artifact/flow。比較對象是不同模型與scaffold ablations，測量fully solved、partially solved、alert分類。本文不用模型排名或數值。
方法關鍵：II假設artifact完整可得、工具互動可靠、資源足夠；III-A分離LLM input與evaluation components；III-B以flow對齊標籤。IV多狀態tool/summary loop；Appendix B以LLM評答案，仍有judge風險。
失敗模式：V-B3 wrong commands / infinite loop / hallucination / shallow investigation / dependency；沒有完整原始證據，不從摘要編事件。
反向結果：V-D newer model有部分任務不用summarizer較好，不能寫摘要一律提升；Appendix F同時示範去偏問題會幫助與使任務更難。模型之間有prompt調整與重試/guardrail處理，不能稱所有條件完全相同。
限制：訓練資料污染仍可能；引導式junior questions不等於expert unguided SOC；CLI only；artifact完整假設不同於缺日誌實務；工具可能安裝latest而非全部釘死。沒有把benchmark當production安全保證。
摘要比對：摘要強調廣泛評測與貢獻；正文揭露guide nature、artifact完整假設、partial solved與fully solved差別，文章以後者限制解讀。不引用任何數字，免抓取表格排版損傷導致數字誤讀。

### A5完整抽取
設計：Defender telemetry觀察資料，採用者與matching control，再用log時間DiD；排除長案/部分跨採用區間。不是randomized trial。結果只說作者報告關聯，不引量。
限制：預算/人力/訓練共同變動不能識別因果，採用者自選，robustness部分spec失顯著；TTR不直接測結案正確/漏報。討論末較強因果措辭與摘要承認confound衝突，採較保守方法解讀。

## 五關與搜尋邊界
1 正文：上述五份全部抓取正文順讀；無片段引用。
2 歸屬：官方workflow/規範、vendor自述、benchmark研究、觀察研究、自製教學結果分開。
3 近年：A4 2026-03、A5 2024-11；未將undated docs假稱研究新證據。
4 反證：counter-search.json與search-0/1.json包含false positives/negatives、缺失紀錄、hallucination、部分修補、語義錯誤；正文保留否證範例。
5 飽和：對「本例如何設獨立判準/完整性/分權」的窄方法主張已有正文支持；領域效果比較仍會發現新來源，沒有宣稱領域飽和或AI一定提升能力。新增候選不進參考資料、不承擔結論。所有成效主張限於可重跑合成規則與真HTTP測試。

## 每篇主張映射
17 審碼/修補脈絡限制→A1；tenant漏owner→自製matrix12格；if掃描是刻意弱baseline，無工具性能推論。
18 四種驗收→A1；6/10/12/9→matrix輸出；撤權/快取為未執行延伸，不冒稱測過。
19 when/who/what與時間差→A2；來源/缺口→A2；失敗與完整artifact假設→A4；E001–005為合成，另HTTP18次trace真跑。
20 異常不等於惡意→A2；benign+attack真值→A4；roles/task→A3；8案例分流→fixture真跑，未判定不當良性。
21 identity/RBAC→A3；log trust與自動封鎖DoS→A2；approval digest/once/revision→自製記憶體模擬。expiry/concurrency/rollback未實作明說。
22 真值與評估分離→A4；observational/MTTR限制→A5；混淆矩陣/coverage/cost→固定8例可重算。無模型呼叫、無真實工時/API費測量。
