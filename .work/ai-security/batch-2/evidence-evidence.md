# 第2篇範圍與證據
讀者問題：AI說越權成功時，我要留下什麼，才有辦法獨立重現並排除假陽性？讀後能交出有請求、實際回覆、資料核對與對照的報告。
大綱：假說與觀察分開 → 六項證據表 → 跑自製函式實驗 → 排除錯目標/假成功 → 報告 → 練習答案。
來源完整讀取：source-07.md NIST CAISI 2.1/2.2/2.3（基準測試中的評分漏洞、改副本未改目標；不外推所有AI或成功率）；batch-1/research/raw/authorization.md OWASP Introduction/Validate Permissions/Lookup IDs/Tests（政策、物件授權、單元測試限制）。皆本機既有完整公開來源快照，未進行新增網頁抓取。
例子全部自製；AI建議文字是教學示意，沒有呼叫模型。原始觀察是in-process函式呼叫，不是HTTP。三欄比較表可完整表達判斷，依diagram skill不強加圖。
維持第一篇政策：同租戶且本人擁有；Alice/N-1、Bob/N-2屬north；Carol/S-1屬south。
範例oracle：獨立固定期望表驗內容與允許關係，不呼叫被測授權函式決定期望。不宣稱可驗任意外部服務。目標與build標籤只為此程式內路由紀錄，不是遠端身分認證。

v2：獨立審稿後以預先固定expected_context排除觀察自證；新增wrong_build使總數14，未知build拒絕。最新執行證據均帶-v2。
