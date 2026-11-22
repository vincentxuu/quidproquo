產出 AI Agent Arxiv Digest 2026-11-14（中英雙版），主題：Agent 系統「看起來有把關」跟「實際發生了什麼」之間的可觀測性缺口，選定 guardscope（2611.15223）、tau2-bench 評測者分歧研究（2611.14581）、Breaking Bad 獎勵破解激活訊號（2611.14996）三篇。

例外事項：
- Semantic Scholar 直接查詢與 Groundlane `paper_lookup` 對三篇入選論文皆連續回傳 429（rate limited），guardscope 另外回傳「paper not found」（尚未被索引）；venue/引用速度改記錄為「preprint，發布 3-4 天，尚無引用資料」，未違反選案標準（背景信號查證已盡力，未用來跳過可信度門檻）。
- diagram-preview 未跑：環境內建瀏覽器版本（chromium_headless_shell-1243）與專案 Playwright 預期版本（1208）不符，`--skip-if-no-browser` 正常跳過，圖解本身已依規則畫在中英雙版（三層可觀測性缺口示意圖，座標與文字對應翻譯）。
- `pnpm check:tw` 第一輪在新文章抓到 2 個 A 級用語（插件→外掛、對標→比對標準答案誤判為對標），已修正，確認 0 blocking。
