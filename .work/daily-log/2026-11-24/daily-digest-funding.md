產出：Sierra（客服 AI Agent，Bret Taylor 創辦）Series F $1.75B，估值半年翻倍至 $30B，中英雙版。

- toolDegradation: Groundlane MCP 登入被拒（需使用者重新授權），Groundlane 直接 HTTP 未試（WebFetch 不支援自訂 POST），改用 Keenable keyless API 搜尋（3 組查詢皆成功），跨頁面擷取改用 Exa `web_fetch_exa`。
- 候選篩選：q1/q2/q3 搜尋結果中 Sierra Series F（watchlist D1 既有公司，估值大幅更新）訊號最強且來源最多（10+ 家媒體），其餘候選（Agon 國防模擬 AI Series A $70M、AidenAI Series A $32M）主題與站內 Agent 聚焦不符，本次未寫。
- 交叉驗證：TechCrunch + TheNextWeb 兩獨立來源確認金額與估值，另以 TechCrunch 2024/2025 舊報導核對累計融資歷史（$110M→$175M→$350M→$950M→$1.75B）。
- 圖解：1 張長條圖（估值四輪變化），check:diagram-geometry / check:diagram-text 中英文皆 0 error；diagram-preview 未跑：無瀏覽器（/opt/pw-browsers 缺 chrome-headless-shell），已用兩支純 Node 檢查確認無疑。
- targeted verify：check:references／check:lang-parity／check:tw／check:series-order 皆無新增 WARN/ERROR；check:no-emoji 全站 0。
