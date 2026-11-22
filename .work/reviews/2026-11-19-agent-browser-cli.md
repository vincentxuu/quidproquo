# 審稿紀錄：2026-11-19-agent-browser-cli（AI 瀏覽器自動化 order 6，中英共用）

## post-verify

獨立 subagent 查證（scratchpad verify-6-17.md，#1–#29）。0 ❌、5 🟡，全部處理：
- 🟡 #5 snapshot 範例改用 README 的實際格式 `- link "Learn more" [ref=e1]`，指令寫 `@e1`。
- 🟡 #13 Ranger 的 22k–24k vs 50k 註明是情境 1；main session 自己讀過 Ranger 全文（文章未註明 MCP 版本，CLI snapshot 檔名日期 2026-03-26，早於 MCP 0.0.69）。
- 🟡 #19「沒有人拿掉 MCP」不成立：Browserbase 自架 MCP repo 已封存、npm 套件 deprecated，只留 hosted endpoint → 改寫。
- 🟡 #23 非互動終端機自動拒絕只在 `--confirm-interactive` 時 → 刪掉該半句，確認改成獨立說明。
- 補：agent-browser 0.10.0 Node 版支援 Firefox → 改成「早期 Node.js 版還能開 Firefox，現在沒有了」。

## post-review

獨立 subagent 編輯審稿（review-6-17.md）。處理：
- 必修全採納：6-必修-1 正文補 inline link（README、四份量測、gh-aw、docs 引文、Playwright CLI 引文、DevTools CLI）；6-必修-2 Ranger 加版本說明、收尾建議改成「看你手上那一版的行為」；6-必修-3 tldr「常多 2–3 倍」改「在一份量測裡」；6-必修-4 `auth save` 註明由人在自己的終端機跑。
- 建議採納：S1「有 shell 選 CLI 還是 MCP」補一條；S3 解釋 Browser Harness；S4 前綴比對會一起放行 `eval`；S5 站內連結；S7 範例拿掉與 policy 重複的 `--confirm-actions`、補 `--max-output` 說明；S8 模板句改寫；S9 英文三處措辭。
- 未採納：S2 量測改表格（四條各有條件與限制，清單比表格好讀）；S6 圖加回傳箭頭（caption 已說明兩個時間點，圖保持只畫結構）。

## post-polish

- check:tw 0／0；post-quality 抓到 tldr「真正」→ 改「更實際」，H2 同步；process-leak、diagram-geometry、lang-parity 通過。
- diagram-preview 中英 ✓（審稿 agent 跑）；正式站上線後截圖目視。
