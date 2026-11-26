# vulnerability-evidence 中英作者自審

## post-verify
核對日期 2026-10-22。依全文逐項查核：
1. 第一篇政策/身分/租戶/工單內容：與authorization-demo.py逐項一致。
2. OWASP 要求產品需求先於實作、每請求檢查具體物件：完整authorization.md相關節支持（single-source confirmed，基本原則）。
3. OWASP 單元/整合測試不取代安全測試：完整authorization.md末節支持。
4. NIST 記錄本機副本不影響遠端、利用評分漏洞達成效果而非預期漏洞：完整source-07.md 2.2/2.3支持；僅歸因這份官方案例，不引成功率或泛稱模型必作弊。
5. Python 3.11+ 無額外套件、無HTTP/模型：程式僅argparse/json/pathlib；本機Python實跑，不宣稱所有Python版本均實測。
6. 指令與13案例：evidence-output.txt及evidence-run/transcript.jsonl，可重跑。
7. finding.json與transcript.jsonl：實際建立並JSON解析；預設stdout模式另在空暫存目錄跑，確認零檔案副作用。
8. fake AI/wrong response/403泄漏：明示人工組裝檢查器控制，不假稱模型或被測函式自然產生。
9. 錯副本和版本標籤：程式內選擇紀錄，正文不宣稱遠端身分保證。
10. 範例報告：觀察與程式回傳完全一致；不外推正式服務、寫入或帳號接管。
本次核對以上10組宣告，未由查證本身判文章覆蓋；結構另評如下。

## post-review
讀者目標：能交有原始輸入回覆、政策、目標資料核對及對照的可重現報告。正文的六項表、可跑demo、結果解讀、模板/填好報告、三題答案皆對準。
不重教登入或部署環境，前後篇轉手清楚；同租戶owner-only連續性確認。中英欄位/案例/命令/範圍一致。三欄表比額外SVG更直接，依diagram skill省略。
沒有紅項。建議由主agent獨立複審；這是作者自審，不標成獨立審稿。

## post-polish
已跑register-scan、ledger、check:tw、process-leak，紀錄在同目錄。
2長句/26段；數字密度命中均工單ID與範例報告，非統計堆疊。無模板化轉折、一般英文散文術語堆疊。命令/JSON/fixture保留精確原文。
人工回讀：開頭是會串API的中文客服助理開發者問題；每建議有命令、比較欄位或具體報告動作；無研究歷程漏進門面。

## 獨立審稿後修正（v2，取代上方13案例紀錄）
審稿指出預期build由觀測反推，無法抓到跑錯版本。已改在執行前固定expected_context，每案預定target/build獨立於event。新增wrong_build：預定fixed-v1但實際vulnerable-v1，必須判wrong_target_or_build。observe未知build現在顯式ValueError。
中英表格、版本說明與PASS數同步14；中文明列三個人工構造案例。
實跑14案例通過，另直接函式驗正反build錯配皆拒絕、正確fixed拒絕資料、未知build報錯。預設無副作用/輸出JSON/既有目錄不覆寫重新確認。
最新證據：evidence-output-v2.txt、evidence-run-v2/、evidence-independent-check-v2.txt；tw及process檢查v2通過。原v1檔只保留歷史，不再代表交付現況。
