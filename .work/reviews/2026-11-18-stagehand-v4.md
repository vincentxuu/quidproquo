# 審稿紀錄：2026-11-18-stagehand-v4（AI 瀏覽器自動化 order 8，中英共用）

## post-verify

獨立 subagent 查證（post-verify-report.md）。版本、日期、授權、README 程式碼逐行、act／observe／extract 行為、快取條件、variables、Chromium-only、domcontentloaded、v2→v4 時間、browse CLI 都對上一手來源。9 🟡，已修：
- goBack 139.5→17.5ms 放在「狀態搬進瀏覽器」段易誤讀為 v3→v4 → 改寫成「實驗中的批次指令、對遠端瀏覽器、跟 Playwright 比的中位數，單次執行」。
- 「自我修復只重試一次」說得太窄 → 限定為重播 Action 的情況，補指令式 act() 每次重推論。
- 快取表「cache: true」→「開通後預設生效，cache 可關或調門檻」；「任何瀏覽器」→「本機或 Browserbase」；門檻數的是「相同結果」。
- zh 引文漏 "reliably" → 補「可靠地」。
- Browser Run 因果 → 縮回 Cloudflare 原文。
- EHR 反例早於 v4 → 標「2026 年 5 月、v4 推出前」。
- 「官方建議不要重試 act()」→ 註明出自遷移指南與成本頁（act 文件 troubleshooting 另有重試範例，屬官方文件內部差異，不展開）。

## post-review

獨立 subagent 編輯審稿（post-review-report.md）。必修 2 條、建議 7 條，處理：
- S-1 文章承諾「下次不用再花」卻沒有跨次執行的寫法、主範例每次推論五次 → 新增「跨次執行重播」段：observe 一次存 JSON、之後讀檔 `act()`，開 `selfHeal`（reference 確認 `Stagehand.create` 有此選項）；註明存檔是延伸官方記憶體 Map 的寫法、上線前先驗證；README 範例前改說明「示範三個方法，每跑一次推論五次」。
- S-2 引述缺 inline 連結 → unreliable／跳過推論／快取／cache:false／重試 observe 各補連結。
- S-3 範圍卡要求的 v4 架構圖 → 新增 v3／v4 前後對照圖（SDK 每個 CDP 指令跨網路 vs 一則訊息給瀏覽器內 extension）。
- S-4 限制段越界做 Playwright 逐項比較 → 留 Stagehand 自身限制，比較留給 order 9。
- S-5 accessibility tree 首次出現補白話解釋。
- S-6 補 v4 網域政策（`setDomainPolicy`、window.open 彈窗在請求前被擋，v3 要開了再關）。
- S-7 規則檔補連結與放置位置（CLAUDE.md、.cursorrules）。
- S-8 英文 "too" 改 "do it on observe(), not on act()"。
- S-9 兩個起步段合併：「怎麼開始」第 3 步改指向「今晚就能做的事」。
- S-12 翻譯腔句改寫；S-14 browse CLI 補 README 連結。
- 未採納：S-10 標題（保留）、S-11 自指（保留一句聚焦問題，非 tldr）、S-13 下一篇連結待 order 9 上線後回填。

## post-polish

- check:tw 0／0；scan-ledger 無命中；check-process-leak、check-post-quality、check-post-references 通過；lang-parity 通過。
- register-scan：拆開 act 段、v4 理由段、agent() 替代路線、EHR 段四個最長句；但書密度 5%。
- 圖：兩張（決策流程、v3／v4 對照）diagram-preview 中英全 ✓；流程圖左移並縮成 504 寬去掉左側空白；英文版 BROWSER 標籤被線穿過，移到框右上角。
- 中英同步：每輪修改中英一起改。
