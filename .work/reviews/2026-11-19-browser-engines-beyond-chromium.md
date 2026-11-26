# 審稿紀錄：2026-11-19-browser-engines-beyond-chromium（AI 瀏覽器自動化 order 18，中英共用）

## post-verify

獨立 subagent 查證（scratchpad verify-15-18.md）。1 ❌、1 🔵、多項 🟡，全部處理：
- ❌ overlay 例子寫反：Bright Data 原文是 Chrome 上 Playwright 發現按鈕被遮住、點擊逾時，不是「Chrome 點到 overlay」→ 改正。
- 🔵「兩份第三方測試結論一致、時間沒有比較快」：Gologin（同一作者）在 25 並行時 Lightpanda 快約一倍 → 改成「資源一致、速度看並行量」，tldr 同步。
- 🟡 README 是說明文字 933 頁、表格標 100 頁；Kitesurf 3.8×／7×／1.7× 是 HTML 擷取對預熱 Chromium，補截圖列 3.1×／4.7×／1.8×；CPU 改 44%–48%；IntersectionObserver 拆成 YouTube 與 Next.js 兩例；Hermes 改「Lightpanda 列出的使用者」；GAIA 補 Level 1 與連結；表格補 MCP；Obscura 指紋隨機化改「可選的 stealth 模式」。

## post-review

獨立 subagent 編輯審稿（review-15-18.md）。處理：
- 必修全採納：overlay 改正；「指紋一眼認得出」收窄到 Lightpanda，Kitesurf 改引官方不適用情境；Lightpanda 1.0、170 萬 WPT、Hermes、GAIA、Obscura→Kitesurf 靈感、Moli／Ladybird／Servo、Kitesurf 數字都補 inline link。
- 未採納：Kitesurf 段與 order 24 的重疊（本篇只留兩三句並連過去）；樣本數另行標註（正文已寫「19 個網頁」「16 個公開網站」）。
- 待辦：order 24 Kitesurf 舊文過時（2026-11-12 開源、WPT 數字、playground 網址、9 月新功能），留到 19＋23 那批 post-update。

## post-polish

- check:tw 0／0；post-quality、process-leak、lang-parity 通過。
- 一併處理：order 17「想深入」補連到 18；總覽連結回填。
