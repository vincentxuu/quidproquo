# daily-digest-signals 例外記錄 — 2026-11-27

Groundlane MCP 全程可用（首選工具），未觸發 fallback 鏈降級；以下是個別來源層級的失敗，不影響整體產出（30 組全球區域矩陣與社群查詢皆已實際執行完畢）。

## 來源層級失敗（web_fetch）

- `deepmind.google/blog`：兩次嘗試皆失敗。直讀（http backend）回傳 gzip 二進位亂碼；改用 `format: text` + `render: always`（browser backend）後回傳空文件（`fallbackReason: js_empty_document`）。該來源本次無法確認，未收錄 DeepMind 官方 blog 信號（已改用第三方報導取得 DeepMind HFE benchmark 信號）。
- `blog.palantir.com`：`UPSTREAM_ERROR / browser-challenge`，存取挑戰無法解析，本次無法確認。
- `www.databricks.com/blog`：第一次直讀只回傳訂閱 CTA（無文章列表），第二次改用 render 嘗試遇 `DEADLINE_EXCEEDED / browser-challenge`，本次無法確認。
- `www.ai21.com/blog`、`www.reka.ai/news`：頁面為 JS 動態渲染，直讀僅取得空殼（newsletter CTA / 分類標籤），無法取得文章列表，本次無法確認。
- `www.minimaxi.com/news`：被重導向至 `minimax.cn/news`（簡體版），僅回傳隱私權頁尾，無法取得文章列表，本次無法確認。

## 工具層級暫時性錯誤（已自動重試成功）

- Groundlane `web_search` 在首輪執行時對「AI startup funding Series raise」及「(Taiwan OR China...) 東亞」等 5 個查詢回傳 `DEADLINE_EXCEEDED`，單獨重試後全部成功，未使用備援工具。

## 去重處理

- 初稿納入 xAI `$6B Series C`（來源 `x.ai/news`）與 Cognition `SWE-2.1`（`cognition.com/blog/swe-2-1`），比對 `seen-signal-urls.txt` 後發現：
  - `cognition.com/blog/swe-2-1` 已於 2026-11-25 收錄過，屬實際重複，移除。
  - `x.ai/news` 為非永久連結（頁面內容會隨時間改變），曾於 2026-09-12 以不同內容收錄過；因找不到本次公告的專屬永久連結，移除以避免誤判。
- 最終收錄 32 則信號（relevance 全數 ≥ 0.5，unverified 比例 3%）。
