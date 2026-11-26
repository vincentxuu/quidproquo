# 審稿紀錄：事後怎麼看見 agent 做過什麼（series order 4）

審稿日：2026-10-24。審稿者是沒有參與撰寫的獨立 agent，報告全文在 session scratchpad（`review-verify-b3.md`、`review-structure-b3.md`，與第 5 篇合併）。下表「處理結果」不照子代理自述，是逐條回頭讀目前的 `agent-detection-audit.md` 與 `-en.md` 確認過的；標記：已修／部分修／未修／不修（理由）。

## post-verify

| 問題 | 處理結果（以目前稿件為準） |
|---|---|
| ❌ C1：五個混合體工具「預設行為是在工具使用前擋」不成立，只有 clawdstrike 預設 fail-closed，其餘預設只觀察 | 已修（zh 第 30 行、en 第 30 行改成「賣點是能擋，但預設先觀察」並逐一列 Adrian／DefenseClaw／failproofai／Prismor 的預設；tldr 同步） |
| 🟡 A9：Uber 簡報四項疑慮的排序，「破壞性指令排第二」無依據 | 已修（zh 第 44 行改成「列出幾項主要疑慮：機密外洩（標為最常見）、破壞性指令、資料外洩、人沒有真正在把關」；en 第 44 行同） |
| 🟡 A11：「ADR 純事後」忽略 Uber 另有 pre-prompt hook | 已修（zh 第 40 行、en 第 40 行補 regex 為主的 pre-prompt hook 未開源，「純事後」限定開源版；tldr 也寫「開源版」） |
| 🟡 A6：人工複核警報「約一半誤報」漏了第三類 | 已修（zh 第 42 行 49%／34%／17% 三類都列；en 同） |
| 🟡 A5：惡意樣本只有 42 個，讀者看不出樣本量 | 已修（zh 第 42 行「42 個惡意樣本抓到 28 個」；精確率 1.0 已刪） |
| 🟡 B3：fail-open 不等於放行，宿主仍可能詢問或拒絕 | 已修（zh 第 50 行、en 第 50 行：「決定交回宿主原本的權限流程，宿主仍可能詢問或拒絕」） |
| 🟡 B4：「這一層的共通設計」過度概括（DefenseClaw 預設 fail-closed，微軟外掛擋下） | 已修（zh 第 50 行改成「與此相近」並連到上一篇微軟外掛相反的例子；「共通設計」字樣已刪） |
| 🟡 B6：manifest 範圍是「未簽章的 case bundle」 | 已修（zh 第 58 行「未簽章的 case bundle manifest」） |
| 🟡 B1：啟用 enforce 的步驟寫得比實際簡單 | 已修（zh 第 48 行補「複製完整 YAML、沿用同 id、加 enforce、升版號」） |
| 🟡 C3／C5：clawdstrike 雜湊鏈屬企業版，單機金鑰也在本機 | 已修（zh 第 58 行拆開寫 Prismor 與 clawdstrike，並寫明單機模式金鑰由 `init --keygen` 寫在本機） |
| 🟡 C4：補 Prismor 自列的緩解 | 已修（zh 第 58 行「不可覆寫規則」與匯出簽章 checkpoint） |
| 🟡 C7：DefenseClaw 原始請求資料庫要有「啟用 LLM judge」的前提 | 已修（zh 第 66 行「啟用 LLM judge 之後（它預設是關的）…`retain_judge_bodies` 預設為 true」） |
| 🟡 D3／D7：OTEL 預設內容遮蔽；原文「因為內容裡有機密」是替文件推動機 | 已修（zh 第 86 行改成「預設會把 prompt 內容遮成 `<REDACTED>`」，`OTEL_LOG_TOOL_CONTENT` 只作用於 tracing（beta）；「機密」只當作者的提醒，不當文件原因） |
| 🟡 D5：repo 設定被忽略的範圍 | 已修（zh 第 72 行含 `.claude/settings.local.json`，並註明使用者層與 shell 仍有效） |
| 🟡 D1：補 transcript 明文、30 天清理 | 已修（zh 第 70 行）；`CLAUDE_CONFIG_DIR` 沒補（可選，不修） |
| 🟡 D4：managed settings 鎖端點，開關要一併鎖 | 已修（2026-10-24 對 https://code.claude.com/docs/en/monitoring-usage#how-managed-settings-lock-the-otlp-destination 核實：`OTEL_LOGS_EXPORTER` 等 selector 走一般優先序，開發者設定仍可關掉訊號；zh 怎麼用 #3 與第 72 行已補「連 exporter 一起放」） |
| 🟡 E1：grep pattern 太鬆且輸出會把明文機密顯示在終端機 | 已修（zh 第 79–83 行改為 `find … -mtime -7` 加收緊 pattern，註明誤報、明文警語） |
| 🟡 簡報作為出處：數字出自簡報而非論文，參考資料缺簡報連結 | 已修（zh 第 42 行與第 99 行已加簡報連結） |
| 🟡 歸因標籤過多（A2／A10 建議合併） | 已修（zh 第 42 行合為一句「…都是作者…自述，沒有第三方驗證」） |
| 🟡 A4：Detection 目錄範圍說明 | 已修（zh 第 40 行「Detection 目錄（ADR-Bench 與偵測器的評測框架）」） |
| ⚪ 未驗範圍（審稿者聲明）：monitoring-usage 後半、各 event hook schema、clawdstrike Spine 實作、DefenseClaw judge 實作行為 | 不修（聲明範圍；稿件只寫文件有明文的行為，Spine 只說「屬於企業版部署」） |
| ✅ A1–A3、A7、A8、A10、B2、B5、B7、C2、C6、C8、C9、D2、D6 | — |

## post-review

| 問題 | 處理結果（以目前稿件為準） |
|---|---|
| 4-1 斷崖 3→4：第一節沒比較護欄與偵測 | 已修（zh 第 24 行補「護欄只擋得住你事先想到的動作…偵測問的是剛才發生了什麼」；en 第 24 行同） |
| 4-2 標題點名 Adrian 正文卻沒內容 | 已修（zh 第 32 行新增 Adrian 段：分析活動紀錄與推理軌跡、SDK、Claude Code 外掛、audit／block 設定，並註明自述、無第三方準確度） |
| 4-3 「共通設計」與第 3 篇矛盾 | 已修（見 post-verify B4） |
| 4-4 沒講為什麼有人會改紀錄 | 已修（zh 第 56 行「為什麼要擔心這個？被 prompt injection 騙去做壞事的 agent，用的是和你同一個使用者身分」；en 第 56 行同） |
| 4-5 tldr 把 Uber 自述寫成通則 | 已修（tldr 已刪該句，zh／en 皆是；正文第 44 行改為「在他們的環境裡」） |
| 4-6 「對開發者最有用」是作者評價，沒接到「怎麼用」 | 已修（zh 第 44 行改為「也有參考價值的觀察」，怎麼用第 1 點開頭「對應 Uber 說的最大宗問題：機密外洩」） |
| 4-7 沒用判準檢視 transcript／OTEL | 已修（zh 第 72 行「用上一節的兩個問題檢視它們…」並提到非同步寫入後果） |
| 4-8 缺兩個自我檢查問題 | 已修（zh 第 64 行「先問兩件事」）；但仍是正文段落，沒有獨立成題與答案的 Q/A 格式，視為部分達成 |
| 4-9 YOLO 模式未解釋 | 已修（zh 第 44 行「略過批准、什麼都自動執行」） |
| 4-10 結尾缺今晚的動作 | 已修（zh 第 91 行） |
| 4-11 「兩個問題」數量不符；AGT 段落位置 | 已修（zh 第 66 行改「還有三個問題，前兩個…最後一個…」；AGT 段移到第 60 行並加「上一篇看到的」） |
| 4-12 光譜畫成軸線圖（可選） | 不修（可選；光譜各點位置只有 ADR 與 numbat 以外的未逐一核對，維持三項清單） |
| 4-13 怎麼用 #1 指令雜訊 | 已修（見 E1） |
| 4-14 怎麼用 #3 沒有動作 | 已修（三個變數名對 https://code.claude.com/docs/en/monitoring-usage 設定表核實；managed settings 檔位置對 https://code.claude.com/docs/en/managed-settings 核實：macOS `/Library/Application Support/ClaudeCode/`、Linux/WSL `/etc/claude-code/`、Windows `C:\Program Files\ClaudeCode\`；文件是給管理員部署寫的，沒排除單機，稿上註明「沒有實測」；文件另寫本機管理員可直接改檔、WSL 的 /etc/claude-code 使用者可寫，稿上已寫） |
| 4-15 #4 替來源推測動機 | 已修（見 D7） |
| 4-16 #2、#5 補具體做法 | 已修（zh 第 84 行「我的建議是…一次改一條」；第 87 行 `echo canary-12345`）；canary 做法是作者建議，稿上沒另外標註，但上下文是動作指示，可接受 |
| 系列銜接：召回率補第 1 篇連結 | 已修（zh 第 42 行） |
| 系列銜接：tamper-evident 中英並列 | 已修（zh 第 54 行首次並列） |
| 參考資料：具體行為句補 inline 連結到文件頁（8.5） | 已修（2026-10-24 補：DefenseClaw 7 天保存與 judge bodies → https://cisco-ai-defense.github.io/defenseclaw/docs/observability/#local-history；numbat `hook status` → https://github.com/perplexityai/numbat/blob/HEAD/docs/deployment.md#what-status-proves；Adrian → https://docs.adrian.secureagentics.ai/how-it-works 、/reliability 、/reference/claude-code；failproofai → README#install；clawdstrike → README#receipts／#quick-start／#design-principles；transcript 30 天 → https://code.claude.com/docs/en/claude-directory） |

## post-polish

| 問題 | 處理結果（以目前稿件為準） |
|---|---|
| P4-1 「自稱…賣點與預設行為」語序／推測行銷意圖 | 已修（zh 第 30 行改為「都屬於可觀測或稽核一類，賣點是能在工具執行前擋」；仍保留「賣點」一詞，但 verify 判定該部分成立） |
| P4-2 開頭名詞化 | 已修（zh 第 20 行） |
| P4-3 「涵蓋」翻譯腔 | 已修（zh 第 38 行「支援」） |
| P4-4 第 36 行但書與長修飾 | 已修（zh 第 40–42 行拆成兩段，結論先行） |
| P4-5 批准疲勞長前置修飾 | 部分修（zh 第 44 行仍是「一個 session 要批准五十次以上動作，批准疲勞等於沒有監督」，已拆成短句但未照建議用冒號句型） |
| P4-6 numbat 失敗行為「寫得很直接」 | 已修（zh 第 50 行「它的文件講得很明白」） |
| P4-7 不是 A 而是 B／離開使用者 | 已修（zh 第 62 行「我的看法是，關鍵不在…而在…」並標作者觀點） |
| P4-8 transcript／OTEL 段名詞塞滿 | 已修（zh 第 70 行先講三種原料，環境變數移到怎麼用 #4） |
| P4-9 結尾「另一道線」 | 已修（zh 第 91 行） |
| P4-10 同一結論三處重複 | 部分修（tldr、第 64 行、第 91 行仍各重申一次，第 91 行已縮短成類型區分，不再重講理由） |
| 英文版自然度（懸空 "it"、"selling point and default behavior"、"shared design"、"left the monitored user"） | 已修（en 第 18、44–50、52 行改寫；en 第 30 行仍用 "the selling point is that they can block"，語意可通，不修） |
| 章節標題「Claude Code 自己有什麼」像分類標籤 | 已修（zh 第 68 行「你手上的 Claude Code 已經留下了什麼」） |
| 機械檢查 | 審稿者原報告：check-process-leak 通過、scan-ledger 0 blocking、check-tw-terms 通過；`pnpm check:references` 當時因環境缺模組無法執行，這次也未重跑（只新增 .work 檔案，未動稿） |
