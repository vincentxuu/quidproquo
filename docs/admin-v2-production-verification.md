# Admin v2 Production / Preview 驗證清單

狀態：待測（2026-08-29）。本檔記錄 Admin v2 Phase 1-6 在本機已驗證的範圍、尚未驗證的 production/preview 範圍，以及完成定義。

## 1. 已驗證範圍

以下只能支撐「本機串接完成」，不能外推成 production ready。

| 範圍 | 結論 | 證據 |
|---|---|---|
| 品質閘門 | 通過 | `pnpm verify` 全綠 |
| Build | 通過 | `pnpm build` 通過 |
| Admin chat contract | 通過 | 前端 composer `instruction` 與 API `prompt` 都轉成第一個 `user` event/message |
| D1 session identity | 通過 | API 建出的 `sessionId`、`agent_sessions.id`、Durable Object `/run` 使用同一個 id |
| 本機 Astro dev E2E | 通過 | `.work/admin-v2-e2e/2026-08-29T09-37-25-766Z/evidence.json` |
| 最小 Durable Object `/run` smoke | 通過 | `.work/admin-do-smoke/do-run.json`，events 含 `system/init`、`user`、`assistant`、`result` |
| OG image generator cache | 通過 | 首次產生 2978 張約 401.64s；第二次 `Generated 0, reused 2978` 約 0.82s；build 內同樣 reused |

## 2. 尚未驗證範圍

### 2.1 遠端 migration

尚未對 Cloudflare production 或 preview D1 套用 Admin v2 相關 migration。

通過條件：

- 遠端 D1 已存在 `agent_sessions`、`agent_messages`、`agent_events` 及 Admin v2 需要的欄位。
- migration 可重跑或可查詢目前狀態，不會破壞 legacy `agent_runs` / scheduler 資料。
- migration apply 前後有 row count / schema snapshot，不只看 CLI 成功訊息。

### 2.2 Cloudflare bindings 與 env

尚未在 production/preview 實際確認以下 binding 可用：

- `AGENT_SESSION_DO`
- `DB`
- `SESSION`
- R2 artifacts bucket
- Vectorize index
- provider / runner 相關 secrets
- notification channel secrets
- GitHub webhook / token 設定

通過條件：

- admin API 在 deployed worker 上能讀到必要 binding。
- secret 檢查只記錄 presence / length / hash prefix / HTTP outcome，不輸出 secret 值。
- 缺少 binding 時 API 回可診斷錯誤，不是空白頁或 500 無脈絡。

### 2.3 Production / preview Admin E2E

尚未在部署後用瀏覽器完成完整流程。

通過條件：

- `/admin` 或 `/console` 可載入，admin auth 正常。
- Home composer 建 session 成功。
- session detail 可看到 `system/init`、第一個 `user`、assistant/result event。
- session list 可看到新 session，狀態從 `pending` / `running` 正確轉為 `done` 或可診斷失敗。
- SSE watch 或目前實作的 watch path 可重連，不會漏掉最後 event。

### 2.4 完整 Workers runtime + Durable Object

本機最小 Durable Object smoke 通過，但完整 built worker 的 `wrangler dev` 曾出現 request hang；這不是通過證據。

通過條件：

- 完整 worker bundle 下，`/api/admin/sessions` POST 能 proxy 到 `AGENT_SESSION_DO`。
- DO `/run` 不只在最小 worker 裡可用，也在正式 bundle 中可用。
- request hang 的原因已定位或在 preview 環境證明不存在。

### 2.5 Runner provider / Sandbox

尚未證明 Cloudflare Sandbox/provider 在實境可完成 agent loop。

通過條件：

- Sandbox cold start 有實測秒數。
- provision、clone、setup_script、start_agent 四階段都有 `env_manager_log`。
- runner 能寫 artifact / transcript 到 R2。
- Stop / resume 的 git branch、commit、push 行為可觀察。
- repo 未掛載時仍可建立 session 並完成無 repo 任務。

### 2.6 Routine trigger 與通知

尚未在 production/preview 實測 Routine schedule、API fire、GitHub event trigger 與通知通道。

通過條件：

- Schedule trigger 在 UTC 儲存下按預期時間觸發。
- API trigger 對 active routine 回 202 或等價成功狀態；paused routine 回 `400 routine_paused`。
- GitHub event trigger 能以測試 repository 事件建立 session。
- Discord / Email / Slack / Telegram 至少各有一筆成功或明確失敗證據。
- 平台層 sandbox/setup 失敗由 Workers 直接通知，不依賴 agent 自述。

### 2.7 Mode / permission / approval

尚未在真實 UI + worker + runner 串接下驗證 Mode 與核准流程。

通過條件：

- Auto / default / plan 三種 mode 能進入 session event。
- `control_request/can_use_tool` 能在手機 UI 顯示核准卡。
- allow / deny / updatedInput 都會寫回 `control_response`。
- Plan mode 的 ExitPlanMode 核准能切回 auto mode 或保留 plan 狀態。

### 2.8 MCP proxy / Marketplace

尚未在 production/preview 實測 MCP server 安裝、工具列舉、工具呼叫與 marketplace 匯入。

通過條件：

- Settings > Extensions 能列出 MCP servers / skills / plugins / marketplace。
- session toolset 勾選能限制實際可用工具。
- MCP tool call 經 Workers proxy 執行，結果回同一條 session event stream。
- 失敗時能區分 auth、network、tool schema、provider unavailable。

### 2.9 Share / transcript / artifacts

尚未在 production/preview 驗證分享與 artifact 讀寫。

通過條件：

- Private session transcript 只有授權使用者可讀。
- Public share id 不可猜，撤回後 404。
- transcript / artifact 不輸出 secret。
- R2 artifact URL 或 signed access 行為符合權限預期。

## 3. 完成定義

Admin v2 只有在以下項目都完成後，才能標記為 production verified：

- 遠端 migration 已套用並留下 schema snapshot。
- production 或 preview 完成一次手動 session E2E。
- production 或 preview 完成一次 Routine trigger E2E。
- 至少一個 runner provider 完成真實 agent loop。
- 至少一個通知通道成功送達。
- 至少一個 MCP tool 經 proxy 成功執行。
- 權限核准流程在手機寬度可操作。
- 失敗路徑有可診斷錯誤，不是 silent failure。

## 4. 目前不得宣稱

- 不得宣稱 Admin v2 已 production ready。
- 不得宣稱 Cloudflare Sandbox 冷啟動時間已知。
- 不得宣稱所有 notification channel 已串通。
- 不得宣稱 MCP Marketplace 在 production 可用。
- 不得宣稱 secrets / bindings 已完整。
- 不得把本機最小 DO smoke 當成正式 worker runtime 的完整 E2E。

## 5. 下一步

1. 取得 production/preview 操作許可。
2. apply 遠端 D1 migration，保存 schema snapshot。
3. 部署 preview worker。
4. 在 preview 跑手動 session E2E。
5. 跑 Routine API trigger 與至少一個通知通道。
6. 跑 runner provider / Sandbox cold start 與 artifact 寫入。
7. 跑 MCP proxy smoke。
8. 將證據回填到本檔，並更新 `docs/admin-v2-spec.md` 狀態。
