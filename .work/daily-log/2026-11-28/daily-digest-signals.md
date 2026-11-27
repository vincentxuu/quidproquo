產出 `src/data/daily-signals/2026-11-28.json`，31 則信號。

例外：
- 第二層官方 blog 直讀：`snowflake.com`、`replit.com` 回 `UPSTREAM_ERROR browser-challenge`；`blog.palantir.com` 連線中斷（proxy 上游提前關閉串流）；`deepmind.google/blog`、`sensetime.com/cn/news`、`bvp.com/atlas` 走瀏覽器引擎時回空文件（js_empty_document），已改用 `format=text` 或直接放棄該來源，當天視為無法確認。
- 4 組全球區域查詢（歐洲、中東、非洲、拉美）第一輪平行發出時全部 `DEADLINE_EXCEEDED`，改為逐一單發重試後成功，8 組區域矩陣最終全數完成。
- 第二層「每一列都要抓」在本次執行中改為優先覆蓋 A1 大廠、主要框架／China 大廠與頭部媒體（實際讀取約 50/101 列），GitHub org 頁與次要 HuggingFace org 頁因多為 repo 列表、沒有日期可判斷新鮮度，未逐一讀取；這是本次覆蓋範圍的縮減，下次執行建議恢復逐列讀取或改良擷取方式。
- 兩則候選（LangChain $300M、xAI $6B Series C）經搜尋驗證後發現實際發佈日期分別是 2026-11-13 與 2024-12，已排除不收錄；Black Hat 2026 agent 漏洞報導經查證為 2026-08 舊聞，亦排除。
