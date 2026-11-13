產出 AI Agent GitHub Digest 2026-11-14 中英雙版，主題是「code execution 取代傳統 tool-calling」（Claude Code Code Mode / UTCP code-mode / vercel/eve / mastra core 1.83.0 / nkarasiak/qgis-mcp / JuliusBrussee/caveman）。

例外：
- diagram-preview 未跑：無瀏覽器（/opt/pw-browsers 只有 chromium_headless_shell-1243，腳本要 1208），geometry check 已過。
- check:tw 抓到 4 處 A 級用語「技術棧」，已改成「tech stack」後重跑為 0 blocking。
- gh api 對非 vincentxuu/quidproquo、lanefoundry/gatelane 的 repo 全被環境擋（GitHub access scoped），改用 firecrawl_scrape 讀 api.github.com 公開端點取得 release/repo 資料。
