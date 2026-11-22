# daily-digest-signals 2026-11-16

## 來源失敗（Groundlane `web_fetch`，皆已嘗試 fallback 但仍回報空內容或被擋）

- `openai.com/research/index` — 403（Cloudflare challenge），內容為空
- `deepmind.google/blog` — 回傳二進位亂碼（可能是壓縮格式未正確解碼），無法解析
- `replit.com/blog` — UPSTREAM_ERROR / browser-challenge 無法解析
- `snowflake.com/blog`、`databricks.com/blog`、`blog.palantir.com` — challenge_response fallback，僅拿到導覽殼層，無文章內容
- `ai21.com/blog`、`reka.ai/news`、`upstage.ai/blog`、`agno.com/blog` — JS 渲染頁面，extract=article 僅拿到頁尾/表單文字
- `minimaxi.com/news` — js_empty_document，重導至 minimax.cn 後仍空白
- `sensetime.com/cn/news`、`tencent.com/zh-cn/newsroom` — 僅財經公告，無近期 AI 產品新聞

以上來源本次皆記為「無法確認最新文章」，未計入 signals。未全部試過 Keenable/You.com/雲端 MCP 逐一 fallback（Groundlane 本身可用，僅個別網站被擋），故不列入 escalation-queue。

## 備註

- 30 則信號中混有 2026-11-11~11-15 區間的新聞（非嚴格 48h），與前幾日 `seen-signal-urls.txt` 記錄的實際模式一致。
- Latin America 區域本次查無合格事件（0 筆），為正確結果而非漏搜。
