產出資安警報：AWS API MCP Server OAuth 權杖 audience 稽核缺失（CVE-2026-115413），中英雙版（series order 88）。

- 來源交叉驗證：AWS 官方安全公告 2026-152-AWS + GitHub Security Advisory GHSA-4prq-p2x5-w9fh + Newsweek 報導 Alt Security 揭露過程。
- 圖解：1 張循序圖（跨應用借用他人 token 呼叫 AWS API），中英各一版，check:diagram-geometry／check:diagram-text 皆 0 error。
- diagram-preview 未跑：無瀏覽器（chrome-headless-shell 執行檔不存在），check:diagram-geometry 與 check:diagram-text 已過。
- check:references／check:lang-parity／check:tw／check:series-order／check:no-emoji 皆通過，無 blocking。
