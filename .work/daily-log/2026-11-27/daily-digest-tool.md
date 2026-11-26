產出：工具推薦｜catscan（本機 Apple Vision OCR 截圖，抓 61 語言的文字截斷／重疊／未翻譯，CLI＋MCP server＋Playwright matcher），中英雙版。

例外：
- diagram-preview 未跑：無瀏覽器（/opt/pw-browsers 下沒有 chrome-headless-shell），check:diagram-geometry／check:diagram-text 中英兩版皆已過。
- 候選比較：GitHub 搜尋新 MCP server repos／Product Hunt／YC launches 當天候選多為已存在工具的舊文重現（如 Skyvern MCP、Hyperbrowser MCP 皆非今日新發佈）或過於同質（Fleetify 與昨日 Bernstein 同屬多 agent 協調類），選 catscan 因議題新穎（截圖 l10n/UI QA）、README 完整且附可重現 benchmark。
- catscan 剛於 2026-11-26 發佈，GitHub 僅 2 星、0 issue，已在文中「注意事項」註明為最沒被驗證過的一個。
