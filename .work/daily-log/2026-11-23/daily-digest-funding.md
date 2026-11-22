產出兩篇融資速報：Genesis AI（Series A $500M，物理 AI／機器人大腦）與 Humyn Labs（Series A $47M，機器人訓練資料），中英各一篇，order 151/152。

- 搜尋工具：Groundlane MCP 登入被拒（signed-in 但 refused），依 fallback 鏈改用 Keenable keyless API（成功），再用內建 WebFetch 查 aifunding.me 補充交叉驗證。toolDegradation: "groundlane unavailable, using Keenable keyless"。
- firecrawl_scrape 查 aifunding.me 時回報 credits 用盡（連 MCP 每日額度），改用內建 WebFetch 查同一頁，取得結果，未影響產出。
- 兩篇均已有 flow-diagram 區塊（資料蒐集→訓練/標註→部署/交付），check:diagram-geometry／check:diagram-text 全綠；diagram-preview 未跑：環境只有 chromium_headless_shell-1243，專案 @playwright/test 要的是 1208，無相容瀏覽器可用，check:diagram-text 已過。
- Watchlist 狀態皆建議新增「物理 AI / 機器人」分類（目前已累積 Genesis AI、Humyn Labs、9 月 General Intuition 三家同類新創），尚未實際改 watchlist 檔案，留給人決定分類命名。
