# Admin v2 規格：自製 coding agent 的操作台

狀態：Phase 1–6 代碼完成（2026-08-29），本機整合驗證通過；待 production/preview 環境觀察。決策來自逐題確認，範本為 Claude Code on the web
（實測紀錄：`.research/2026-08-27-claude-code-web-new-session-walkthrough.md`、
`.research/2026-08-27-claude-code-routines-web-ui-walkthrough.md`）。現況路由見 `docs/admin-route-map.md`。

## 1. 目標與原則

- **目標句**：讓我在手機上 5 分鐘內看完站況＋核准待辦，也要能設定與操作。
- **本質**：後台是「自己做的 Claude Code」的操作台。引擎是自己的（現有 `agent-os` kernel＋tool registry 為雛形），
  **不是**去跑 Anthropic 的 Claude Code。
- **指導原則：完整對齊 Claude Code**。物件、Mode、事件型別、權限協定、Routine 表單都以範本為準，不自創。
- 使用者：目前只有我，但要有 RBAC，之後可開給別人。
- 手機優先：一級頁面都要能在 390px 寬完成操作。

## 2. 物件模型

| 物件 | 定義 | 範本對應 |
|---|---|---|
| **Session** | agent 跑一次：指令 → agent loop（LLM＋tools）→ 事件流 → 結果；可續聊 | `/code/session_*` |
| **Routine** | 預先打包的 Session 參數＋Trigger＋Notifications＋Behavior。**Routine body 與建 Session 的 body 同構** | `/code/routines`（`job_config.ccr`） |
| **Flow** | **可視化自動化編排**（n8n／Flowise 型）：節點圖、trigger 節點、分支；agent 是其中一種節點，**agent 節點執行時建一個 Session**。獨立一級區，細部另案規劃 | — |
| Workflow 工具 | Session 內 agent 可呼叫的編排工具（對齊 Claude Code `Workflow`），與 Flow 是兩個東西，另外做 | `Workflow` tool |
| Pipeline job | 舊內容 pipeline，維持獨立，不併入 Session | — |

儲存：**Session 正本＝`agent_sessions`／`agent_messages`／`agent_events`**（對話＋事件流形態，對齊 stream-json）；**Flow run 正本＝`flow_runs`／`flow_step_runs`**（節點狀態表）。兩邊各自獨立，接點只有 `flow_step_runs.session_id` 指向 agent 節點建出的 Session；Session 頁可回鏈所屬 flow run。`agent_runs` 保留給 scheduler／legacy agent run 紀錄，不作為 Admin v2 chat session 正本。

## 3. Session 參數（第 1–7 題）

| # | 參數 | 定案 |
|---|---|---|
| 1 | 指令 | 必要；即事件流第一筆 `user` |
| 2 | 模型／effort | **列所有 provider 的模型**（providers registry）；effort／fast mode 依模型能力欄位顯示或灰掉 |
| 3 | 工具集 | 手動 Session **預設全開**；Routine **必勾選**；Settings 有預設工具集；Session 頁可臨時調整。勾選單位＝MCP server |
| 4 | 執行環境 | **要**：能跑指令、讀寫檔案。runner 抽象為介面，**預設 Cloudflare Containers／Sandbox**，Mac／VPS 為可切換 provider |
| 5 | Mode | **三檔照抄**：Auto／Accept edits（送 `default`）／Plan |
| 6 | Repo | **可選**：可不掛、可掛一或多個；不掛時仍起環境，只是無 clone 步驟 |
| 7 | 生命週期動作 | **全套**：Stop、續聊、Diff、Share（Private／Public）、Rename、Transcript view、Archive、Delete。不做 Open in Terminal／Desktop |

建 Session contract：Session 就是 chat。前端 composer 送出的第一句話是 `instruction`；後端相容 `instruction` 與 `prompt`，統一轉成第一個 `user` event/message，並用同一個 `sessionId` 建 D1 session 與 Durable Object run。Routine 的 Instructions 也是同構的第一個 user event，不另建一套「session contract」。

### 3.1 工具三層

| 層 | 工具 | 執行位置 | 網路 |
|---|---|---|---|
| 沙箱內建 | Bash、Read、Write、Edit、Glob、Grep | 容器 | Trusted：只放 git 與套件源 |
| Web | WebSearch、WebFetch | **Workers**（現有 search／reader provider：tavily／exa／jina／firecrawl） | 不受限 |
| MCP | 任意 MCP server 的工具 | **Workers 代理**，容器經 per-session 端點呼叫 | 不受限 |

agent loop 收到 `tool_use` 後依工具名分派；三層結果回同一條事件流。現有手寫 knowledge／action 工具（Notion、GitHub、Slack…）
逐步改走 MCP；search／reader 保留作為 Web 兩工具的實作。

### 3.2 權限協定（對齊範本）

- worker → `control_request/can_use_tool {display_name, input, decision_reason}` ⇄ client → `control_response {behavior: allow|deny, updatedInput}`
- Plan mode：計畫寫入沙箱 `plans/*.md` → `ExitPlanMode` 觸發核准卡（Reject／Accept／Accept and auto mode）
- 現有 policy 降為工具級 `permission_policy: always_allow | always_ask | always_deny`，翻成 runner 的 allowed／disallowed 清單；
  其餘交 Mode 裁決
- `initialize` 回應含 `pending_permission_requests[]`，重連時補畫

### 3.3 事件流

沿用 Agent SDK stream-json 事件型別（範本 §12 總表）：`system/init`、`assistant`、`user`、`result`、`control_request/response`、
`env_manager_log`（provision→clone→setup_script→start_agent 四步）、`system/post_turn_summary {status_category, status_detail, needs_action}`、
`prompt_suggestion`、`vcs_state_changed`、`compact_boundary`、`tool_progress`、`rate_limit_event`。
傳輸：一條 SSE `sessions/watch`（帶 resume_token），客戶端→伺服器全走 POST events。

## 4. Routine（第 8–10 題）

Routine ＝ Session 參數（§3）＋以下三塊。UI 上 composer 與 routine 表單共用同一元件。

| 塊 | 定案 |
|---|---|
| **Trigger** | **三種照抄、可疊加**：Schedule（Once／Hourly／Daily／Weekdays／Weekly／Custom cron；UTC 儲存＋隨機 stagger）、GitHub event（獨立 webhook 資源，quickpick＋filter）、API（fire URL＋Bearer token；regenerate 作廢舊 token、delete 後 401；**Paused 時 API fire 回 400 `routine_paused`，UI 的 Run now 不受限**） |
| **Notifications** | 「完成時通知我」開關＋通道 **Discord、Email、Slack**（v1）＋**Telegram**（第四通道）；ntfy 作開發期除錯通道。發不發由 agent 依 `<routine_summary>` 規則自決（沒事沉默、跑不起來要通知）。**平台層失敗（sandbox／setup 掛）由 Workers 直接發**，不經 agent，內容固定：routine 名＋失敗步驟＋stderr 前幾行 |
| **Behavior** | 兩開關：**Auto-fix pull requests**、**Create pull requests automatically**（全域 Settings 只當預設值） |

細節頁：Edit／Delete／Run now；狀態列 Active／Paused／Next run／Last run；Enabled 開關（部分更新）；Runs 列表＝帶 `trigger_id` 的 Session 查詢。
失敗 run 要正確計入分母（範本這裡有 bug，不抄）。

通道抽象：`NotificationChannel { send(summary); renderActions?(approvals) }`，每平台一個 adapter；Discord 第一階段 webhook，第二階段 Interactions Endpoint 做核准按鈕。

### 4.1 Routine 與 Flow 的邊界

Routine＝「一個 agent＋觸發器」；Flow＝「多節點圖＋觸發節點」。兩者的 trigger（Schedule／GitHub event／API）**共用同一套實作**，只是掛的對象不同。

## 5. IA 與路由

五個一級區，一套 Layout，手機優先。

```
/admin                      Home
/admin/sessions             Session 列表（Recents／Pinned／Archived；tag 區分手動／routine／API）
/admin/sessions/:id         Session 頁（事件流、步驟卡、Diff、權限卡、Plan 面板、actions）
/admin/routines             Routine 列表＋自然語言 Draft＋模板
/admin/routines/new
/admin/routines/:id         細節頁
/admin/flows                Flow 列表（可視化編排，另案規劃；現有 FlowBuilder 為起點）
/admin/flows/:id            Flow 編輯器
/admin/settings/*           見 §7
```

### 5.1 Home（第 11 題）

順序固定，手機一屏：
1. **需要你**（空則自動收起成一行綠字）：待核准（含按鈕）→ 失敗（重試）→ `needs_action` 的 session → 站況紅燈
2. **composer**：指令框＋一列控制項（Mode／模型／effort／repo／工具集／環境）
3. **Recents**：最近 session，狀態文字用 `post_turn_summary.status_detail`
4. **Usage** 一行：context %＋各 provider 本週費用 vs 自訂預算

## 6. 執行架構

```
瀏覽器 ──SSE watch / POST events──► Workers（調度、UI、事件流、Web 工具、MCP 代理、通知）
                                        │
                                        ├─ runner provider 介面
                                        │    ├─ Cloudflare Containers／Sandbox（預設）
                                        │    ├─ Mac（本機 runner，回連 Workers）
                                        │    └─ VPS
                                        └─ D1（sessions／events／routines／settings）、R2（artifact、transcript）
```

- 容器內只跑 agent worker（自製，非 Claude Code）：agent loop、沙箱 6 工具、把其餘 tool_use 回送 Workers。
- 憑證由 Workers 側注入（代理），容器內不落地。
- **Cloudflare Sandbox 已查證（2026-08-27，官方文件）**，採用 `@cloudflare/sandbox@next`（1.0 preview，`exec(argv)` 回 process handle）：
  - 自訂 Dockerfile（預設映像 Ubuntu 22.04＋Node 20＋git；**pnpm 需自加**），`wrangler deploy` 自動建映像。
  - 網路：`allowedHosts`／`deniedHosts`（glob、deny-by-default）、TLS interception（每實例臨時 CA）、runtime 可換 outbound handler → 直接對應 None／Trusted／Full／Custom。
  - **憑證由 Outbound Worker 注入**（沙箱發裸請求，Workers 依 host 補 token，可依 `containerId` 逐 session 給不同憑證）——不用自寫代理。
  - 規格：預設 standard-2（1 vCPU／6 GiB／12 GB）；價格 Workers Paid 含額，超出 CPU $0.00002／vCPU-s（依實際使用率）、台灣 egress $0.05／GB。
  - 生命週期：`sleepAfter` 10 分鐘閒置停機，**停機後檔案全丟**；provision 預設等 30 秒（冷啟動待實測）。
- **workspace 持久化**：repo 每 Session 重新 clone；artifact／transcript 寫 R2；Stop hook 強制 commit＋push（照抄範本 `stop-hook-git-check`）；續聊時容器已停 → 重跑 provision→clone（同分支）→setup，UI 顯示 Resumed；Routine 跑完 `destroy()`，手動 Session 交給閒置停機。不用 R2 FUSE 放 repo（git／node_modules 小檔隨機 I/O 太慢）。

## 7. Settings（第 12–13 題）

| 分頁 | 內容 | 現有來源 |
|---|---|---|
| Environments | runner 後端、Network（None／Trusted／Full／Custom＋allowed hosts）、env vars、setup script | 新 |
| Models | providers registry、金鑰、健康、預設模型／effort | `/console/providers` |
| Extensions | 子分頁 **MCP Servers**（加／移除、工具級 allow／ask／deny、預設工具集勾選）、**Skills**（專案 Git＋使用者 D1，import／export）、**Plugins**、**Marketplace**（GitHub repo URL 為來源清單） | `agent-ecosystem`、`agent-skills`、`/api/{skills,mcp-servers,plugins}` |
| Permissions | Mode 預設值、policy 規則 | `/console/policies` |
| Notifications | Discord／Email／Slack／Telegram 通道設定、平台層失敗通知開關 | 新 |
| Behavior | 全域預設：Auto-fix PR、Auto-create PR、Branch prefix | 新 |
| Access | RBAC users／roles／audit | `/console/rbac` |
| Site | 舊 Site Admin 整批：RAG、Content、Stats、pipeline job、ops、traces、deep-research 歷史 | `/admin/{rag,content,stats,jobs,ops,traces,deep-research}` |

## 8. 從現況到 v2 的對映

| 現有 | 去向 |
|---|---|
| `/admin/console`（flow selector）、`/console/runs/launch` | Home composer |
| `/console/runs`、`/console/runs/:id`（＋evidence、artifacts 子頁） | `/sessions`、`/sessions/:id`（evidence／artifacts 成為 session 頁的面板） |
| `/console/flows/**`、`/api/admin/flows/**` | `/admin/flows` 一級區（可視化編排的起點；細部另案） |
| `/console/cost` | Home 的 Usage 一行＋Settings › Models 的費用明細 |
| `/console/providers`、`/console/policies`、`/console/rbac` | Settings › Models／Permissions／Access |
| `agent-ecosystem`、`agent-skills` | Settings › Extensions（兩頁合一，資料搬到 D1） |
| `/api/admin/agents/*`（agent-os） | 保留為 legacy/scheduler 基礎；Admin v2 chat session 走 `/api/admin/sessions/*` |
| `/api/admin/agents/scheduled`、presets | Routine 的 Schedule trigger 與參數包 |
| 舊 Site Admin 13 頁 | Settings › Site |
| 兩套 Layout | 一套 |

## 9. 已定案的細節（原未決項，2026-08-27）

| 項目 | 定案 |
|---|---|
| Flow 定義 | 可視化自動化編排，獨立一級區（§2、§4.1）；Session 內 Workflow 工具另外做 |
| Session 正本表 | `agent_sessions`／`agent_messages`／`agent_events` 為 Session 正本；`flow_runs` 為 Flow run 正本，以 `flow_step_runs.session_id` 相接（§2） |
| Cloudflare Sandbox | 符合需求，採 `@next`；持久化策略見 §6 |
| Diff | **走 GitHub compare**（照抄範本）：push 後 Workers 打 `compare/{base}...{head}`；Stop hook commit 後事件流附 `git diff --stat` 摘要；不掛 repo 或未 push 無 Diff。理由：容器拋棄式、git 是持久層、GitHub 是可信方 |
| Share Public | **照抄範本**：整份 transcript 可看＋Usage Policy 警語（風險已提示：tool_result 可能含金鑰／個資，使用者自行判斷）。附帶：分享 id 不可猜、可撤回（撤回後 404） |

## 9b. 仍待實測

- Cloudflare Sandbox 冷啟動秒數。
- `@next` 的 API 在 1.0 正式版前可能再變。

## 10. 分期（定案 2026-08-27）

邏輯：先打通引擎（2），再排程（3），再權限（4）——沒有 Session 就沒有東西可排程、可核准。Cloudflare Sandbox 放第 5 期，
因為 Mac runner 最快能驗證引擎設計，沙箱的 Dockerfile／網路政策等引擎穩了再做不會白工。骨架獨立一期，讓現有後台先不亂、可單獨 review。

| 期 | 內容 | 做完得到什麼 |
|---|---|---|
| 1 | 一套 Layout＋五個一級區骨架（Home／Sessions／Routines／Flows／Settings 空殼）；舊 Site Admin 13 頁搬進 Settings › Site | 導覽乾淨，無新功能 |
| 2 | Session：事件流＋SSE watch＋Session 頁全套動作；runner 先用 Mac provider 打通 | Home 打一句話讓自己的 agent 跑，看即時事件 |
| 3 | Routine：Schedule＋API trigger、Discord webhook 通知 | 能排程、手機收得到通知 |
| 4 | Mode 三檔＋權限協定＋Plan 面板 | agent 會問要不要核准，手機上能按 |
| 5 | Cloudflare Sandbox provider、GitHub event trigger、Slack／Email／Telegram、Discord 互動核准 | 不靠 Mac、通道齊 |
| 6 | Extensions：MCP 代理、Marketplace | 工具擴充 |

每期開工前另寫該期的實作計畫（檔案、schema、migration），Tier 2 事項（schema、migration、flag）屆時逐項先問。
