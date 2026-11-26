# Order23寫前問題與查證
2026-10-22；自製整合演練，非模型或第三方測試。
讀者問題：攻擊、防護、調查能否對同一輪請求交出可重現證據？能力：執行10筆HTTP案例、核兩版資料內容/稽核、保留正常功能並交報告。
主脊：固定判準→執行→核原始產物→驗修補→選擇AI分工→遷移條件；不評模型成功率。

來源限定用途：
- OWASP Authorization Cheat Sheet全文已於batch1研究/本輪重讀關聯段：需求導出政策、逐物件檢查、授權單元/整合測試不等於完整安全驗收。原文.work/ai-security/batch-1/research/raw/authorization.md。
- NIST CAISI全文於前批完整讀且獨立查核：區分grading成功與原定弱點、改錯本機副本為無效嘗試，不將後者當高成功案例。原文.work/research/ai-security/ai-for-offense/raw/source-07.md。
- HackerOne Quality Reports已完整正文讀取：重現條件、角色、預期/實際、影響與必要紀錄，原文batch2/research/quality-reports.md。只用報告結構，不用廠商效率宣稱。
教學圖選擇：本篇主要是產物/判準對照，以表格即可；已有總覽系統圖，不再重畫同一框箭頭圖。

實跑：ticket-lab-tests.log為18真HTTP案例+health/audit/UTC/redaction；integrated-run-03為最終整合程式，兩版本各5筆，vulnerable未授權2/fixed0、合法各3。report記Python/platform/server及runner SHA256，audit逐條與HTTP actor/resource/status/build/target/eventID及回傳工單比對。
固定模型工作只提供讀者提示與分工，本文未實際call任何模型；prepared patch builds不是AI生patch結果。雲端/SSH是遷移選項未實跑。供讀者下載的session字串是公開合成fixture，不具production認證能力。

作者自審：兩語全文回讀，24篇範圍之外不額外引入模型能力/價格。原NIST中文總括句已改成明確區分無效副本嘗試。register1長句/36段、但書5%、ledger無命中、check:tw/process-leak通過；獨立交叉審另列，不以作者自審替代。
