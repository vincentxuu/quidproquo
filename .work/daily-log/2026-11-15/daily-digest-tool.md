產出工具推薦：Copper（copper-kicad-mcp）— 讓 AI agent 操作 KiCad 設計可下單 PCB 的 MCP server（zh-TW + en）。

- 候選篩選：GitHub 搜尋「MCP server」「model context protocol」近 1–3 天新建 repo，加上 Groundlane web_search 查 Product Hunt / MCP 發佈新聞。排除一批同一時段、不同帳號、描述模板幾乎一致的 `blender-ai-copilot-*` 系列 repo（疑似刷星/模板灌水，見 2026-11-12 同一小時內建立、stars 266–275 高度一致），以及第一輪挑到的 ha-mcp（查 series order 時發現 2026-11-14 已經寫過同一個工具，換掉）。
- 最終選 Copper：MIT、Python、repo 建立於 2026-11-12，查核時 84 stars，README/文件齊全（INSTALL/CONFIG/PROVIDERS/FAB_PROFILES/COMPATIBILITY/ARCHITECTURE/CHANGELOG/SECURITY），有實際產出的範例板與生產檔。
- 圖解：有，流程圖（Copper 的設計迴圈：排線 → ERC/DRC → 過/不過分支），中英文各一張，座標結構一致。
- diagram-preview 未跑：無瀏覽器（本環境 Playwright 預裝版本與專案鎖定版本不一致，`chromium_headless_shell-1208` 找不到，只有 `-1243`）。`pnpm check:diagram-geometry` 兩篇皆 0 錯誤。
- check:references／check:lang-parity／check:tw／check:series-order 皆通過（check:tw、check:series-order 的 WARN 均為既有檔案，非本次新增）。
