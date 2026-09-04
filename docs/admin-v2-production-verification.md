# Admin v2 Production / Preview 驗證清單

狀態：**已部署（production）**。Phase 1–6 代碼於 2026-08-29～08-30 合進 main，經 CI deploy workflow（`deploy.yml`）自動部署至 production，含 D1 migration apply。後續 08-30～09-04 持續有 production deploy 成功（CI deploy fix 系列 commits 佐證管線穩定運作）。

## 1. 已驗證範圍

### 1.1 本機驗證（2026-08-29）

| 範圍 | 結論 | 證據 |
|---|---|---|
| 品質閘門 | 通過 | `pnpm verify` 全綠 |
| Build | 通過 | `pnpm build` 通過 |
| Admin chat contract | 通過 | 前端 composer `instruction` 與 API `prompt` 都轉成第一個 `user` event/message |
| D1 session identity | 通過 | API 建出的 `sessionId`、`agent_sessions.id`、Durable Object `/run` 使用同一個 id |
| 本機 Astro dev E2E | 通過 | `.work/admin-v2-e2e/2026-08-29T09-37-25-766Z/evidence.json` |
| 最小 Durable Object `/run` smoke | 通過 | `.work/admin-do-smoke/do-run.json`，events 含 `system/init`、`user`、`assistant`、`result` |
| OG image generator cache | 通過 | 首次產生 2978 張約 401.64s；第二次 `Generated 0, reused 2978` 約 0.82s；build 內同樣 reused |

### 1.2 Production 部署（2026-08-30 起）

| 範圍 | 結論 | 證據 |
|---|---|---|
| D1 migrations 0026–0034 | 已 apply | CI `deploy.yml:107-112` 每次部署自動執行 `d1 migrations apply quidproquo-db --remote`；08-30 起多次 deploy 成功 |
| Cloudflare bindings | 已部署 | `wrangler.jsonc` 定義 `AGENT_SESSION_DO`（DO）、`DB`（D1）、`R2_AGENT_ARTIFACT`、`AGENT_QUEUE`（Queue）；deploy 成功即 binding 生效 |
| Durable Object migration | 已部署 | `wrangler.jsonc:21` DO migration tag `v1` + `new_sqlite_classes: ["AgentSessionDO"]` |
| Worker bundle | 已部署 | 合進 main 的代碼經 CI build + `wrangler deploy` 上線 |
| CI 管線穩定性 | 已驗證 | 08-30 多筆 CI fix commits（`91fced65` 序列鎖、`30dc6e12` 不取消進行中 deploy、`654faf27` 分離取消與索引鎖）表明管線已跑過多輪並收斂 |
| Session chat 後續 polish | 已部署 | `d71bf605` 重做 session chat、`06662311` 接入 assistant-ui、`cbe248af` 修正 loading 與事件同步，均在 08-30 合進 main |

### 1.3 Phase 1–6 代碼對應 commits

| Phase | 範圍 | 關鍵 commit |
|---|---|---|
| 1 | 路由全遷 + lib 重組 | `60a9bb75`–`6447df0a`（sidebar、dual-mode、settings hub） |
| 2 | Session 引擎 | `a60f5091`（migration + event types + session manager + runner interface）、`99a98700`（串接 chat session） |
| 3 | Routine trigger + 通知 | `85be985c` |
| 4 | Mode + 權限協定 | `aaf58dc0` |
| 5 | Sandbox provider + 多通道通知 + GitHub webhook | `ae7e6b23`、`1a29316f`（GitHub repo integration）、`c3a428e7`（GitHub App RSA keys） |
| 6 | MCP proxy + Marketplace | `ae7e6b23`、`ba33659f`（migration 號碼修正） |

## 2. 環境觀察待確認

以下項目代碼已部署，但尚未有人工實測紀錄。屬於「上線後功能驗證」層級，不阻塞部署。

### 2.1 Production Admin E2E

通過條件：

- `/admin` 可載入，admin auth 正常。
- Home composer 建 session 成功。
- session detail 可看到 `system/init`、第一個 `user`、assistant/result event。
- session list 狀態正確轉換。

### 2.2 Runner provider / Sandbox

通過條件：

- Sandbox cold start 有實測秒數。
- provision、clone、setup_script、start_agent 四階段都有 `env_manager_log`。
- runner 能寫 artifact / transcript 到 R2。

### 2.3 Routine trigger 與通知

通過條件：

- Schedule / API / GitHub event trigger 各跑一筆成功。
- Discord / Email / Slack / Telegram 至少各有一筆成功或明確失敗證據。

### 2.4 Mode / permission / approval

通過條件：

- Auto / default / plan 三種 mode 在 production UI 可操作。
- `control_request/can_use_tool` 核准卡在手機寬度可用。

### 2.5 MCP proxy / Marketplace

通過條件：

- Settings > Extensions 能列出 MCP servers / marketplace。
- MCP tool call 經 Workers proxy 執行成功。

### 2.6 Share / transcript / artifacts

通過條件：

- Private session transcript 只有授權使用者可讀。
- Public share id 不可猜，撤回後 404。
- R2 artifact URL 行為符合權限預期。

## 3. 完成定義（更新）

Admin v2 部署狀態：

- [x] 代碼合進 main 並通過 CI build。
- [x] D1 migrations 已透過 CI 自動 apply 至 production。
- [x] Cloudflare bindings（DO、D1、R2、Queue）已生效。
- [x] Worker bundle 已部署。
- [ ] production 完成一次手動 session E2E。
- [ ] production 完成一次 Routine trigger E2E。
- [ ] 至少一個 runner provider 完成真實 agent loop。
- [ ] 至少一個通知通道成功送達。
- [ ] 至少一個 MCP tool 經 proxy 成功執行。
- [ ] 權限核准流程在手機寬度可操作。

## 4. 下一步

1. 在 production 手動走一次 session E2E，截圖回填。
2. 跑一次 Routine API trigger 與通知通道。
3. 跑一次 Sandbox cold start + artifact 寫入。
4. 跑一次 MCP proxy smoke。
5. 將證據回填到本檔 §2 各節。
