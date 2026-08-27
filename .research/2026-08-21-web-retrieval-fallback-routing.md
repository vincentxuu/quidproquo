# Research: Web Retrieval Fallback Routing

## 子問題

1. Search、Fetch、Crawler、Browser 與 controlled stealth 的責任邊界是什麼？
2. 哪些 HTTP、內容與頁面訊號可以安全地觸發 escalation？
3. Retryable 與 non-retryable 錯誤如何區分？
4. Budget、cache、deduplication 與 provenance 應放在哪一層？
5. 怎麼讓 router pseudocode 保持可執行形狀，又不綁定單一 provider？

## 來源清單

- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html) — IETF 標準／一手；訪問日：2026-08-21
- [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html) — IETF 標準／一手；訪問日：2026-08-21
- [RFC 6585: Additional HTTP Status Codes](https://www.rfc-editor.org/rfc/rfc6585.html) — IETF 標準／一手；訪問日：2026-08-21
- [RFC 9309: Robots Exclusion Protocol](https://www.rfc-editor.org/rfc/rfc9309.html) — IETF 標準／一手；訪問日：2026-08-21
- [Playwright: Auto-waiting](https://playwright.dev/docs/actionability) — 官方文件／一手；訪問日：2026-08-21
- [W3C PROV-O](https://www.w3.org/TR/prov-o/) — W3C Recommendation／一手；訪問日：2026-08-21

## 讀取完整度盤點

| 來源 | 讀到什麼程度 | 用途 |
|---|---|---|
| RFC 9110 | HTML 全文與 status semantics | 401、403、404、redirect、5xx 的路由語意 |
| RFC 9111 | HTML 全文；freshness、validation、authenticated cache | cache 與 revalidation contract |
| RFC 6585 | HTML 全文；429 與 Retry-After | rate-limit retry policy |
| RFC 9309 | HTML 全文；robots rules 與 access outcomes | policy gate，不把 robots denial 當技術失敗 |
| Playwright Auto-waiting | 官方頁全文；actionability 與等待條件 | Browser 不用固定 sleep 猜 ready state |
| W3C PROV-O | Recommendation 全文；Entity、Activity、Agent、derivation | retrieval artifact 與來源血緣 |

## 事實與推論分層

| 類型 | 敘述 | 依據 |
|---|---|---|
| 事實 | `429` 可以帶 `Retry-After` 指示等待多久 | RFC 6585 |
| 事實 | HTTP cache 需要區分 fresh、stale 與 validation | RFC 9111 |
| 事實 | `403` 是理解請求但拒絕處理，不能直接推論為可繞過的 bot block | RFC 9110 |
| 事實 | Browser action 應等待可觀察的 actionability／頁面狀態 | Playwright 官方文件 |
| 推論 | Search 與 Fetch 應是依輸入形狀選擇的兩個入口，不是固定串接 | 降低已知 URL 任務的額外 latency 與搜尋漂移 |
| 推論 | Fetch 升級 Browser 應記為 escalation，而不是 retry | 兩者成本、狀態與副作用面不同 |
| 推論 | challenge、auth wall 與 soft 404 必須是內容分類，不應只看 status | 這些頁面常以成功 status 傳回不可用內容 |
| 推論 | auth cache key 必須包含 scope | 避免相同 URL 在不同使用者間洩漏 representation |

## 文章邊界

- 涵蓋 route responsibility、failure classification、decision table、retry、budget、cache、dedupe、provenance 與 pseudocode。
- 不重做 Browser MCP 工具比較。
- 不提供 Cloudflare／CAPTCHA bypass 細節。
- 不處理 Deep Research 的問題分解、證據仲裁與停止策略。
- benchmark 指標、corpus 與 regression gate 留給系列第 8 篇。

## 草稿決策

- 預設 read-only，任何會改狀態的操作都不在自動 fallback 內。
- controlled stealth 只允許在明確授權與政策允許的環境，不能作為一般 403／challenge 的自動下一步。
- 每個 task 同時受 deadline、requests、pages、depth、browser starts 與選配 cost 上限約束。
- transport retry 與 tool escalation 分開記錄，避免觀測資料失真。
