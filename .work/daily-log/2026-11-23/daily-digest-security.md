產出資安警報（中英雙版）：NebuSec 示範單一惡意網頁串連 Chromium 與 Linux 核心漏洞，攻破 Meta Muse agent 雲端沙箱，竊取並竄改使用者私訊與記憶、取得 VM root 碰到憑證儲存庫；Meta 發表前已修補，官方未證實或評論。

- Groundlane MCP 連線被拒（需使用者重新登入），Groundlane 直接 HTTP 回 401（需 OAuth bearer token，同一組登入狀態），依全域 fallback 鏈降為 Keenable keyless API 做搜尋發現；詳情抓取改用直接 curl 擷取頁面 HTML 後本機解析文字（Firecrawl 額度用盡，回應訊息：Your Firecrawl credits ran out. Daily MCP credits refresh in 22h 26m. Add credits or upgrade to keep going: https://www.firecrawl.dev/billing/1cscjebvah18y5jxykvsw4ve0tn9fxgs）。toolDegradation: groundlane unavailable + firecrawl scrape 額度用盡 → 改用 Keenable search + 本機 curl/HTML 解析。
- 事件已交叉驗證：NebuSec 官方研究報告＋技術分析（原始來源）與 The Hacker News（權威媒體）皆有報導，另有 AI Chat Daily、Bytechap 轉載確認。
- diagram-preview 未跑：無瀏覽器（/opt/pw-browsers 缺 chrome-headless-shell），check:diagram-geometry 與 check:diagram-text 中英文版皆已過 0 error。
- check:references／check:lang-parity／check:tw（0 blocking）／check:series-order（0 error，僅既有系列缺號 WARN）／emoji 檢查皆過。

---

本日第二起（同日另有新事件，event-driven 不限一篇）：產出資安警報（中英雙版，series order 85）：Together AI CEO 於 11/21 揭露，AI 編碼 agent 在開發公開 repo「xorl」時提交外洩憑證，導致未經授權者下載私有 Hugging Face repo 中存放的真實使用者 prompt 樣本（MiniMax M3／GLM-5.2／Kimi K2.6），並在樣本中搜尋、測試其他服務憑證（含 5 組 Dragos canary 憑證）；根因為 agent 的 commit 權限未被當成需要審查的高風險動作。

- Groundlane MCP 連線仍被拒（需使用者重新登入），依全域 fallback 鏈降為 Keenable keyless API 做搜尋發現；詳情抓取改用 WebFetch 直接讀 Together AI 官方部落格、Futurum Group、VectorWire 等頁面。toolDegradation: groundlane unavailable → Keenable search + WebFetch。
- 事件已交叉驗證：Together AI 官方揭露（原始來源）＋ Futurum Group 分析報導＋ VectorWire 彙整報導，三方皆引用同一組時間線與細節，互不矛盾。
- diagram-preview 未跑：環境瀏覽器版本不符（/opt/pw-browsers 裝的是 chromium_headless_shell-1243，腳本預期 1208），check:diagram-text 中英文版皆已過 0 error。
- check:references／check:lang-parity／check:tw（0 blocking）／check:series-order（0 error，僅既有系列缺號 WARN）／check:no-emoji 皆過。
