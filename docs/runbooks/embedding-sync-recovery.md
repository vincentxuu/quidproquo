# Embedding 同步的資源限制與恢復

`Deploy production Worker` 成功後，內容索引同步仍可能獨立失敗。HTTP 503 且帶有 Cloudflare 1102 表示 Worker 資源超限；需由 Workers invocation outcome / CPU / memory 確認實際瓶頸，不能把請求等待時間當 CPU 時間。

## 單次工作量

- CLI 預設請求 20 個 chunks；Worker 端也將 posts 批次限制在 20 個，合計 contextual input 最多 24,000 個 JavaScript 字元。這是初始保守值，並非經生產效能量測後的保證，也不是 token 上限。
- 超過字數預算的尾端 chunks 留待下次；單一 chunk 已超預算時保留 checkpoint、回報 chunk ID，應重新切分來源內容，不截斷文字或假裝已建立向量。
- 每個批次在 Vectorize 寫入後才更新 D1 checkpoint；後續請求只取尚未完成的 chunks。

## CLI 的失敗恢復

- `--max-retries` / `EMBED_SYNC_MAX_RETRIES`：每批最多重試 5 次，僅針對網路失敗、timeout、429、502、503、504。401、語意錯誤、無進展的成功回應會立即失敗。
- 1102 會將下一次請求量減半，最低 1；普通暫時性錯誤保留批次大小。
- 退避從 500ms 倍增，參考數字格式的 Retry-After，最多等待 30 秒。單次 fetch 最多 60 秒，整次指令預設最多 10 分鐘（`--max-duration-ms` / `EMBED_SYNC_MAX_DURATION_MS`）。
- `--full` 第一個請求的失敗可能發生在 checkpoint 已重置之後。CLI 不會自動重送這個 reset；確認狀態後，以不含 `--full` 的指令續傳。全量指令已成功 reset 後的重試一律為增量。
- `--max-batches` 仍表示成功批次數，失敗重試不占此計數，但受重試及整體時間上限約束。非全量達上限會明確列出 pending，保持原有暫停語意；全量未完成則回傳非零 exit code。

## 驗收與維運

CI 目前上限 20 批；較小的單批量也代表一次部署最多處理約 400 個 chunks，字數預算可能讓實際數量更少。不能因 Worker 已部署或 CLI 暫停回傳 0，就宣告搜尋索引完整。應核對 pending checkpoints，並讓既有 search-freshness 驗證完成；若仍有積壓，另安排有界的增量續傳。這次未修改 CI、CPU 配額、資料表或執行正式同步。

本地測試：

```sh
node --test scripts/lib/__tests__/embedding-sync.test.mjs
pnpm exec vitest run src/lib/indexing/pipeline.test.ts src/pages/api/embed/sync.test.ts src/lib/retrieval/embedding.test.ts
```

正式同步必須由有權限的維運流程執行，不在測試中使用 production bindings。
