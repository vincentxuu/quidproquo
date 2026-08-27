# Claude Code Routines — Web UI 實際操作紀錄（2026-08-27）

來源：以 Playwright 登入 vincent（Max 方案）帳號，實際開 https://claude.ai/code/routines 與
/code/routines/new 逐一點開表單控制項。第一輪只看不建（按 Cancel）；第二輪實際建立一個測試 routine 並跑一次，見文末。
本檔補既有專文 `src/content/posts/tech/deep-dive/2026-05-09-claude-code-scheduled-tasks-guide.md`
沒有從 UI 角度描述的細節；官方文件事實以該專文與 code.claude.com/docs/en/routines 為準。

## 列表頁（/code/routines）

- 標語：「Create templated routines that can be kicked off on schedule, by API, or webhook.」
- 右上 **New routine** 按鈕 → 進 /code/routines/new。
- 頁面中央有一個**自然語言草擬框**「What do you want automated?」＋ **Draft routine** 按鈕
  （空白時 disabled），附三個範例 chip：
  - Summarize my open PRs every weekday morning
  - Triage new issues and flag duplicates each morning
  - Draft release notes whenever a PR merges
- 本帳號目前「No routines yet.」
- 「Or start from a template」共 8 個模板（時間為以本機時區 GMT+8 顯示的預設值）：

| 模板 | 說明 | 預設觸發 | 標示連接器 |
|---|---|---|---|
| Briefing | 行事曆／信件／訊息摘要 | 平日 20:30 | Google Calendar · Gmail · Slack |
| Email triage | 收件匣分類、急件擬回覆 | 平日 23:00 | Gmail |
| System health check | 監控基礎設施錯誤／效能 | 每日 20:00 | PagerDuty · Datadog · Sentry |
| Issue triage | 分類 issue／bug／feature request | 平日 23:30 | Linear |
| PR review digest | open PR 總覽與待處理 | 週二～週六 02:00 | — |
| Dependency update check | 過期套件、安全修補、breaking change | 每週二 02:30 | — |
| Release notes drafter | PR 合進 main 時擬 release notes | GitHub `pull request closed` 事件 | — |
| Flaky test tracker | 找 CI 間歇失敗的測試 | 每週二 00:00 | — |

  → 模板預設時間以 UTC 為基準（20:30 GMT+8 = 12:30 UTC 等），沒有替使用者換算成當地早晨。

## 建立表單（/code/routines/new）

上半部欄位：
1. **Name**（必填，placeholder「e.g., Daily code review」）
2. **Instructions**（placeholder「Describe what Claude should do in each session」），有「Press and
   hold to record」語音輸入鈕
3. **Model** 下拉
4. **Select a repository** 下拉
5. **Cloud environment** 下拉

Trigger 三選一卡片（可 **Add another trigger** 疊加）：
- **Schedule**「Run on a recurring cron schedule or once at a future time」
  - 點開預設「Runs daily at 9:00 AM GMT+8」
  - 頻率鈕：**Once / Hourly / Daily / Weekdays / Weekly / Custom**，加一個 `At HH:MM` 時間框
  - 備註文字：「Runs are staggered by a few minutes to spread server load.」
- **GitHub event**「Run when a GitHub webhook event fires」——未選 repo 前 disabled，
  按鈕上直接寫「Select a repository first」
- **API**「Trigger from your own code by sending a POST request」

下半部「Routine settings」三個分頁：
- **Connectors**：預設帶入帳號所有已連接的 connector，本帳號共 12 個（Asana、Cloudflare Developer
  Platform、Gmail、Google Calendar、Google Drive、HyperFrames by HeyGen、Mermaid Chart、Notion、
  PostHog、Sentry、tldraw、visualize），每個有 Remove 鈕＋「Add connector」下拉。
  警語原文：「Claude can use all tools from these connectors — including writes — without asking
  for permission during runs. Remove any you don't want the agent to access.」
- **Behavior**：只有一個開關 **Auto-fix pull requests**（預設關）。
- **Notifications**：**Notify me when this routine finishes**（預設開）；通道 **Push notification**
  （預設勾）、**Email**、**Slack**（預設未勾）。

底部 **Cancel** / **Create**（必填未齊時 disabled）。

## 與專文的差異／可回寫

- 專文「設定的內容」未提：自然語言 Draft routine 入口、8 個模板與其預設時間、Behavior 的
  Auto-fix PR 開關、Notifications 三通道、Schedule 的六種頻率預設鈕與 GitHub trigger 需先選 repo。
- Connectors 警語與專文第 4 點一致（run 中不問權限、含寫入）。
- Stagger 說明與專文「會有幾分鐘的延遲」一致。

## 附帶觀察

- 首次以無 cookie 的 Playwright 開頁會被導到 `/logout?involuntary=1` 再回 login；登入後正常。
- 頁面 console 有 4 個 `/v1/toolbox/shttp/mcp/<id>` 405 與 1 個 `/v1/code/sessions/watch` 400，
  不影響 UI，推測是 connector 探測。

---

## 第二輪：實際建立並跑一次（2026-08-27 09:55–10:00）

建立 `walkthrough-test (safe to delete)`（`trig_01UiyFoLajjeVMZVGu6MioEq`），
repo `Playma-Co-Ltd/maiagent-api-examples`、Sonnet 5、Weekly、唯讀指令。跑完後已切 **Enabled = Off**
（狀態「Paused · All triggers are paused」），**未刪除**，留給使用者決定。

### 表單各下拉的實際選項
- **Model**：Default／Fable 5／Opus 5／Sonnet 5／Haiku 4.5／Opus 4.8／Opus 4.7／Opus 4.6／Sonnet 4.6；表單預設顯示 Opus 5。
- **Repository**：只列 GitHub App 有裝的 org——本帳號是 Playma-Co-Ltd 的 16 個 repo，**個人帳號 vincentxuu 的 quidproquo 不在清單**，搜尋也找不到。要用個人 repo 得先在 GitHub 裝 Claude GitHub App。
- **Cloud environment**：只有「Default」＋「Edit cloud environment」入口。
- **Schedule → Custom**：出現 Cron expression 框，Daily 09:00 GMT+8 會轉成 `0 1 * * *`——cron 以 UTC 儲存。
- **GitHub event**：選 repo 後才可用。快捷：PR opened（預設）／PR merged／Release published／Issue opened／Custom；Custom 是事件下拉（如 `pull_request.opened`）＋「Add a filter condition」。警語：「Fires on every matching event — this can consume your routine run limits quickly. Add a filter to narrow it down.」並顯示「Runs as vincent.xu@maiagent.ai」。

### ⚠ Connector 載入時序問題（實際踩到）
表單剛開時 Connectors 分頁只顯示 1 個（Asana），我把它移除後按 Create；建立完成的細節頁卻掛了 **13 個 connector**
（Slack、Mermaid Chart、Asana、tldraw、Google Calendar、PostHog、Cloudflare、Sentry、Claude_Code_Remote、Notion、
Gmail、HyperFrames、Google Drive）——其餘 12 個是在我操作後才載入並自動附上。
教訓：**建立後一定回細節頁確認 Runs with 區塊**，或先等 Connectors 分頁的計數穩定再移除。
修正方式：Edit → 逐一 Remove → Save，細節頁 Runs with 只剩 repo 與「Default · Sonnet 5」。

### 細節頁（/code/routines/<trig_id>）
- 頂部：Edit／Delete／Run now；狀態列：Active／Next run（例：Aug 31 at 9:00 AM）／No runs yet。
- 無 run 時提示：「Run it once to check the instructions and connectors work before the first scheduled run.」
- Configuration：Enabled 開關（關掉顯示「Off · All triggers are paused」，狀態列變 Paused）、Triggers、Runs with（repo、connectors、environment · model）、通知與建立者。
- Instructions 區塊可單獨 Edit。

### Run 結果
- Run now 後狀態列「Running now, started just now」，Runs 列表出現「⚡ 名稱 · Today at 9:58 AM · Manual」。
- 不到 1 分鐘完成：「Last run succeeded · 1 of 1 succeeded」。
- 點 run 進 session 頁 `https://claude.ai/code/session_01JBTbGh7cFE7EPaqTBRWYPJ?trigger=trig_…`：
  顯示「Routine: 名稱 · 排程」、Initialized session、模型 Sonnet 5、**Effort: High、Fast mode off**、右側 Runs 面板標「Cloud · Completed · MANUAL」。
- 回覆開頭是「This was a routine, no-op verification — no anomalies to report, so no notification needed.」——
  代表 run 有一層系統指示讓模型自行判斷要不要發通知，不是每次完成都推播。
- 結果內容正確（examples/ images/ inputs/ 三個目錄、.py 34／.cs 34／.md 19…），未改檔、未 push、未開 PR。

---

## 第三輪：API 層（2026-08-27，詳見 `2026-08-27-claude-code-web-new-session-walkthrough.md` §5、§7）
- Routine 在 API 是 `/v1/code/triggers` 資源（`trig_` 前綴，`anthropic-beta: ccr-triggers-2026-01-30`）；
  GitHub event trigger 另存 `/v1/code/webhook-triggers?routine_trigger_id=`。
- trigger 物件的 `job_config.ccr` 與 `POST /v1/code/sessions` 的 body 同構：Instructions 是第一個 `user` 事件、
  `allowed_tools` 固定 8 個（Bash/Read/Write/Edit/Glob/Grep/WebFetch/WebSearch）、`autofix_on_pr_create` 即 Behavior 開關、
  `mcp_connections` 即 Connectors 分頁、`notifications.channel` 即 Notifications 分頁。
- Run now = `POST /v1/code/triggers/<id>/run`，**Paused 狀態仍可手動 Run**（本次第二次 run 於 Enabled=Off 下成功）。
- `next_run_at` 帶隨機偏移（cron 01:00Z → 01:06:32Z）。

---

## 第四輪：從新對話實測搬入的 routine 相關證據（2026-08-27，來源 `2026-08-27-claude-code-web-new-session-walkthrough.md`）

### trigger 物件原文（`GET /v1/code/triggers/<trig_id>`，節錄，ID 略）
```json
{"id":"trig_…","name":"walkthrough-test (safe to delete)","created_via":"http_api",
 "cron_expression":"0 1 * * 1","enabled":false,"persist_session":false,
 "notifications":{"channel":{"email":false,"push":true,"slack":false}},
 "mcp_connections":[],"enabled_plugins":[],"extra_marketplaces":[],
 "job_config":{"ccr":{
   "environment_id":"env_…",
   "events":[{"data":{"type":"user","message":{"role":"user","content":"<Instructions 原文>"}}}],
   "session_context":{
     "allowed_tools":["Bash","Read","Write","Edit","Glob","Grep","WebFetch","WebSearch"],
     "autofix_on_pr_create":false,"model":"claude-sonnet-5",
     "sources":[{"git_repository":{"url":"https://github.com/<owner>/<repo>"}}],
     "outcomes":[{"git_repository":{"git_info":{"repo":"<owner>/<repo>","branches":["claude/eloquent-shannon"]}}}]}}},
 "last_run":{"session_id":"cse_…","status":"ROUTINE_RUN_STATUS_SUCCEEDED","fired_at":…,"finished_at":…},
 "next_run_at":"2026-08-31T01:06:32Z"}
```
- `created_via: "http_api"`——UI 建立也標 http_api，這個欄位分不出 UI／API。
- `outcomes.branches` 在建立時就固定一個 `claude/<隨機兩字>` 分支名，每次 run 共用（新對話則每個 session 由 `dust/generate_title_and_branch` 產生）。
- Run now 回 `{session_id:"cse_…", trigger:{…}}`；run 列表 `GET /v1/code/sessions?trigger_id=<id>&limit=30`。

### 第四條入口：session 裡的 Claude 自己管 routine
sandbox 內建 `Claude_Code_Remote` meta-MCP（`mcp_url=https://api.anthropic.com/v1/code/mcp/meta`，20 工具）含
`create_trigger／update_trigger／delete_trigger／fire_trigger／list_triggers／send_later`。
也就是除了 UI、`/routines/<id>/fire` 對外 API、GitHub webhook 之外，**任何 cloud session 裡的 Claude 都能建或觸發 routine**；
`send_later` 是一次性延後執行。這也是為什麼建立 routine 時 Connectors 預設帶 `Claude_Code_Remote`。

### 兩個「觸發」端點
| 端點 | 呼叫者 | 認證 |
|---|---|---|
| `POST /v1/code/triggers/<id>/run` | claude.ai 前端 Run now | 瀏覽器 cookie＋`anthropic-beta: ccr-triggers-2026-01-30` 等 ccr header |
| `POST …/routines/<id>/fire` | 官方文件的 API trigger | API key（對外） |

### `allowed_tools` 白名單 vs sandbox 實際載入
- routine 的 `allowed_tools` 只 8 個：Bash/Read/Write/Edit/Glob/Grep/WebFetch/WebSearch。
- 但同一個 Default 環境的 `system/init` 載入 **50 個內建工具**（含 Task、ToolSearch、Workflow、CronCreate、PushNotification…）＋
  **226 個 MCP 工具**（13 個 connector）。→ 白名單是「允許」層，不是「載入」層；是否真的擋 Task／ToolSearch，見 B4（待驗）。
- **repo 內 `.claude/skills` 完全不載入**（新對話 §8 證實）——routine Instructions 不能依賴 repo skill，
  流程要寫進 Instructions 本身，或用 setup script／`session-start-hook` 注入。

### 失敗路徑推論（新對話 §10.2 實測，routine 側待驗）
- setup script 非零退出 → `env_manager_log ERROR Setup script failed` → `start_cc` Skipped → `result {subtype:"error_during_execution", total_cost_usd:0}`。
- 推論：routine run 若 setup 失敗，`last_run.status` 應為非 SUCCEEDED 值且**不燒模型額度**；是否觸發「finished」通知，待 B2 驗證。
- Default 環境第二次起 `session_mode: resume-cached`（clone 變 Fetching）——routine 每次 run 應同樣走快取，起步秒數待 B1 量。

### run session 頁的事件來源（新對話 §5.5、§9.2）
- 側欄／細節頁狀態文字來自 `system/post_turn_summary {status_category, status_detail, needs_action}`，已見 `review_ready`／`blocked`。
- 「1 of 1 succeeded」對應 `last_run.status`；run 的唯讀 session 頁是否也收到 `prompt_suggestion`、`rate_limit_event`，待 B1。

### 新對話 vs Routine 對照
| | 新對話（/code） | Routine |
|---|---|---|
| 觸發 | 人手動送出 | cron／API／GitHub 事件／Run now／session 內 meta-MCP |
| Mode | Auto／Accept edits／Plan 可選 | 無選項，完全自主（`permission_mode` 未出現在 trigger 物件） |
| 分支 | 每 session 由 `generate_title_and_branch` 產生 | 建立時固定一個 `claude/<slug>`，各 run 共用 |
| Connectors | 從 Add 選單帶入 | 建立時預設全掛（有載入時序陷阱） |
| 通知 | 瀏覽器 push（要 Enable） | Push／Email／Slack，且由模型判斷要不要發 |
| 後續 | 可續聊、Open in Terminal／Desktop、Share | run 是唯讀 session 頁，從 routine 細節頁進 |
| 環境 | Default，可 Edit environment | 同一份 Default 環境 |

### 自動化備註（跑瀏覽器實驗會再踩）
- popover 多為 base-ui portal，用 `[data-base-ui-portal]` 抓文字最穩。
- Notifications banner 與 Settings「Save preferences」提示會攔截點擊，先按 Not now。
- Connectors 分頁計數要等穩定再 Remove（見第二輪時序問題）。
- 用瀏覽器 `fetch` 只帶 cookie 打 `/v1/code/...` 會回空 data，需帶 `anthropic-version／anthropic-beta／x-organization-uuid` 等 header；
  最省事是用 `browser_network_requests` 錄前端自己發的請求。

---

## 第五輪 B1：錄一次 Run now 的完整網路與事件流（2026-08-27 11:23，run `cse_01X7f1dciwwPwEGUKX9smqrY`，第 3 次 run）

工具：Playwright MCP 的瀏覽器被另一個 session 佔住，改用 playwright-core 複製登入 profile 自起第二個 Chrome（見 skill `playwright-second-browser`）。
原始檔（未追蹤）：scratchpad `b1-net.json`（952 requests）、`b1-bodies.json`、`b1-events.json`；系統指示全文存
`.research/raw/2026-08-27-routine-append-system-prompt.txt`（18,482 字）。

### 5.1 Run now 的 API 時序
| 順序 | 端點 | 重點 |
|---|---|---|
| 細節頁載入 | `GET /v1/code/triggers/<id>`、`GET /v1/code/webhook-triggers?routine_trigger_id=<id>`（回 `[]`）、`GET /v1/code/sessions?trigger_id=<id>&limit=30` | run 列表就是帶 `trigger_id` 的 session 查詢，回 `{data:[…], resume_token}` |
| 按 Run now | **`POST /v1/code/triggers/<id>/run`，body `{}`** | 回 `{session_id:"cse_…", trigger:{…完整 trigger 物件}}`；`last_fired_at` 立刻更新，`next_run_at` 不變（仍是 08-31 01:06:32Z，Enabled=Off 也照算） |
| 之後 | 前端輪詢 `sessions?trigger_id=` 與 `triggers/<id>`；**沒有** 額外的 run 狀態端點 | 「3 of 3 succeeded」由 run 列表各 session 的狀態算出 |
| 進 run 頁 | `GET /v1/code/sessions/session_<id>`、`…/share`、`…/events?limit=50&sort_order=desc`、`POST …/cse_<id>/client/presence`、`POST …/cse_<id>/events`（`control_request/initialize`）、`mark_read`、`POST /v1/code/github/compare-refs` → **404**（無 diff） | 與新對話 session 頁同一套 |

- run session 物件：`tags: ["config:routine-lineage-none","routine_notify_push"]`、`trigger_id`、`title: "⚡ <routine 名>"`、
  `status_bucket: review_ready`、`worker_status: idle`、`security_tier: standard`、`external_metadata.usage.cost_usd 0.2376`。
  → 通知通道是用 **tag** 掛在 session 上（`routine_notify_push`），`routine-lineage-none` 對應 `persist_session:false`（不續用上次 session）。
- session `config.origin: "force_run_trigger"`（排程觸發應是別的值，待驗）、`mcp_connector_ids: []`、**`outcomes.branches: ["claude/eloquent-shannon-pcdggx"]`**
  ——trigger 物件存的是 `claude/eloquent-shannon`，run 時再加 6 碼後綴，所以每次 run 分支其實不同。
- session config **沒有 `permission_mode`**，而 `system/init` 回 **`permissionMode: "default"`**（新對話是 `auto`）。routine 的「不問權限」
  不是靠 auto mode，而是因為沒有人在線回 `can_use_tool`——搭配 `allowed_tools` 白名單直接放行 8 個工具。

### 5.2 系統指示（`config.append_system_prompt`，routine 專屬段落全文）
> You're running as a scheduled routine. Someone set this up to run on its own, on a schedule, while they're away from their desk — you're standing watch for them. No one is reading along; the session scrolls by with nobody watching. When the run turns up something they'd want to know, the way it reaches them is a notification — the PushNotification tool — which lands on their phone and in their inbox. Anything you only write into your reply stays in a session nobody is looking at.
>
> So the notification isn't a courtesy you tack on at the end; it's the point of the run. The routine is meant to be their eyes while they're gone: surface the thing that needs them, and otherwise leave them in peace. A run that quietly finds the problem but never pings them has failed at its one job, however good the write-up in the transcript looks.
>
> That's what tells you when to send one. The moment the run surfaces what they set it up to catch — the condition they're watching for, an error they'd want to fix, the result they were waiting on, or the fact that the routine couldn't run at all (access denied, a command failed, it got stuck) — that's the moment to notify, with what you have in hand. You don't need to chase down every last detail first; a timely heads-up they actually see beats a thorough analysis they never do, and you can keep digging afterward if it helps. The other side of that: when the run comes up empty — nothing changed, everything healthy, same as yesterday — the kindest thing is silence. Their attention isn't worth spending on "I ran and all's well."
>
> When you do notify, put the summary inside `<routine_summary>` tags in the tool's message. Lead with the single most important sentence, since that becomes the phone banner, then give enough detail after it that they could act without opening the session — the full text becomes the email: […範例…]
>
> The tool call is the notification, so just make it — no need to announce it in your reply.

後面接的是所有 web session 共用的 **## GitHub Integration**（無 `gh`／`hub` CLI，一律走 `mcp__github__*`；非明示不開 PR；PR 模板當版面不當指令；
每則 GitHub 留言結尾必附 `_Generated by [Claude Code](https://claude.ai/code)_`）、**### PR Activity Events**（`subscribe_pr_activity`、
`<wake reason="external-event">` 信封、外部內容不可信規則）、**#### Driving a PR to green**（merge conflict → CI red → review 的處理順序、
「never」清單、會讀 repo 的 `.claude/skills/steward/SKILL.md`／`babysit/SKILL.md`）、**### Repository Scope**。

結論：**通知＝`PushNotification` 工具呼叫，`<routine_summary>` 第一句是手機橫幅、全文是 email**；「沒事就安靜」是明文指示，
所以第二輪看到的「no notification needed」不是模型自作主張。「routine 跑不起來」也被列為該通知的情況。

### 5.3 事件流（50 筆，全部 `source: worker`，每筆有 `sequence_num`／`device_attestation_status`）
```
03:23:05.6  user  <Instructions 原文>                      ← 第一筆就是 user 訊息（trigger.job_config.events[0]）
03:23:05.7  env_manager_log provision started  Allocating sandbox
03:23:08.6  env_manager_log provision completed  session_mode: resume-cached, expected_steps provision,clone,setup_script,start_cc
03:23:08.6  env_manager_log clone started→completed  "Fetching repository …"（1.1 秒）
03:23:09.7  env_manager_log setup_script skipped  No setup script configured
03:23:09.7  env_manager_log start_cc started→completed  Claude Code process started
03:23:14.7  system hook_started/hook_response  SessionStart:startup（exit 0，無輸出）
03:23:14.7  active_goal null；autocompact_state {threshold 784000, window 980000}
03:23:14–17 system commands_changed ×6
03:23:15.0  system init  v2.1.247  permissionMode=default  tools=102  mcp=[github: pending]  slash_commands=54
03:23:17    assistant thinking → 03:23:19 tool_use Bash(find … | uniq -c)
03:23:19    rate_limit_event  five_hour utilization 0.32, overageStatus rejected/org_level_disabled
03:23:19    user tool_result
03:23:25    assistant text（結果摘要）
03:23:26    system hook Stop（exit 0）
03:23:26    result success  num_turns 2, duration_ms 11035, duration_api_ms 10098, total_cost_usd 0.2376
            modelUsage: cache_creation 55476（ephemeral_1h）, cache_read 53550, input 4, output 497
```
- **按下 Run now 到 result 共 21 秒**：sandbox 3 秒、fetch 1 秒、Claude Code 啟動到 init 5 秒、模型 11 秒。
- `startup_timing.entrypoint: "remote_trigger"`（新對話應為別的值）、`warm_spare_claimed: false`、`resume_hydrate_ccr_events: 0`。
- **沒有 `post_turn_summary`、沒有 `prompt_suggestion`、沒有 `task_summary`**——run 是無人閱讀的 session，這些給 UI 用的事件不產生；
  但 session 物件仍有 `status_bucket: review_ready`（應由後端從 `result` 推）。
- 沒有 `PushNotification` 呼叫（結果為空，依指示保持沉默）。
- `system/init` 的工具：**47 個內建**（比新對話少 `AskUserQuestion`、`EnterPlanMode`／`ExitPlanMode`——沒人可問、不能進 plan mode）
  ＋ github MCP 55 個；MCP 只有 `github`（我已清空 connectors，證實 `mcp_connections` 即 run 時的 MCP 清單）。
  `Task`／`ToolSearch`／`Workflow`／`CronCreate`／`PushNotification` 都在載入清單裡——與 `allowed_tools` 8 個不符，白名單是否真的擋，仍待 B4。
- skills 27 個官方（同新對話），agents 6 個，`plugins: []`，`apiKeySource: none`，`fast_mode_disabled_reason: sdk_opt_in_required`。
- 每個 run 都是全新 session（`routine-lineage-none`），但環境是 `resume-cached`——**快取的是 sandbox 與 repo，不是對話**。

---

## 第五輪 B3：API trigger 實建與對外 fire 端點實測（2026-08-27 11:26–11:30）

### 表單行為
- Edit 是同一 URL 上的對話框（不換頁）。Add another trigger → **API** 卡展開為：`Call via API`／**Fire URL**（Inactive）／**Token**：
  「Generate a token to activate API access.」＋ Generate token 鈕／Example request。
- **按 Generate token 立刻落地**：`POST /v1/code/triggers/<id>/api-token`（body `{}`）回
  `{"api_url":"https://api.anthropic.com/v1/claude_code/routines/<trig_id>/fire","token":"sk-ant-oat01-…"}`；
  trigger 物件多出 `api_token_created_at`／`api_token_hint`（只留頭尾）。**不用按 Save，按 Cancel 之後 API trigger 仍掛在 routine 上**
  （細節頁 Triggers 列出「API」）。Token 全文只在這一次回應顯示，之後 UI 只給 hint；Regenerate 會作廢舊 token。
- 刪除：卡片上的 Delete → `DELETE /v1/code/triggers/<id>/api-token` → Fire URL 回 Inactive、Triggers 只剩 cron。刪後舊 token 打 fire 回 401。
- Enabled 開關 = `POST /v1/code/triggers/<id>` body `{"enabled":true|false}`（部分更新，不是 PUT）。

### 對外 fire 端點（curl 實測）
| 呼叫 | 結果 |
|---|---|
| 無 auth | 401 |
| `x-api-key: <token>` | 401（token 不是 API key，只能走 Bearer） |
| `Authorization: Bearer <token>`，無 `anthropic-version` | 400 `anthropic-version: header is required` |
| Bearer＋`anthropic-version: 2023-06-01`，routine **Paused** | **400 `{"reason":"routine_paused","message":"Routine is paused."}`**——與 UI Run now 不同，API fire 尊重 Enabled |
| 同上，routine Enabled，body `{}` | **200** `{"claude_code_session_id":"session_…","claude_code_session_url":"https://claude.ai/code/session_…","type":"routine_fire"}` |
| body 帶 `{"message":"…","foo":"bar"}` | 200，同上；多餘欄位被忽略，**沒有把 message 注入 Instructions**（run 內容與 `{}` 相同） |
| 3 秒後再 fire 一次 | 200，另開一個 session，**兩個 run 並行、各自成功**（不合併、不排隊） |
| GET fire | 405 |
| 同 token 打 `GET /v1/claude_code/routines` | 404——token 只對這一條 fire 路徑有效 |

- API 觸發的 run：`config.origin: "fire_routine"`（UI Run now 是 `force_run_trigger`）、Runs 列表標「**API**」（UI 是「Manual」）、
  分支各自 `claude/eloquent-shannon-<6 碼>`、tags 同樣 `routine-lineage-none`＋`routine_notify_push`、成本各 ≈$0.24。
- 因此 `origin` 至少三值：`force_run_trigger`／`fire_routine`／（排程觸發，待 B5 觀察）。

### 對 C 塊的回答
- **併發語意（部分解）**：連續 fire 不去重、不互斥，各開 session 並行。「上一 run 未完時下一 cron 到點」理論上同理，但未直接觀察。
- 本輪測試 routine 曾短暫 Enabled 約 20 秒（11:27），已關回 Off；token 已刪。累計 5 個 run（3 Manual＋2 API），全部 Archive 未做，留在 run 列表。

---

## 第五輪 B2：失敗注入——setup script `exit 1` 的 routine run（2026-08-27 11:31–11:45）

做法：`/code` 環境選單 → Add cloud environment… 建 `walkthrough-fail-env`（`POST …/cloud/create`，`init_script: 'echo …; exit 1'`，
Network Trusted）→ routine Edit → Cloud environment 改選它 → Save（`POST /v1/code/triggers/<id>` 送整份 `job_config.ccr`，`environment_id` 換掉）
→ Run now → 觀察 → 切回 Default → 封存環境（`POST …/environments/<env_id>/archive`，有「Archive environment?」確認框，回 `state: archived`）。

### 事件流（run `cse_01HsGryPcob4PdL8hpkYe4WJ`，第 6 次 run）
```
03:32:18.567  user  <Instructions>   client_platform:"force_run_trigger", inbound_origin:"trigger_fire"
03:32:18.6    env_manager_log provision started → 03:32:21.0 completed   session_mode: "new"（新環境，非 resume-cached）
03:32:21.1    env_manager_log clone started "Cloning repository …" → 03:32:22.6 completed（1.5 秒）
03:32:23.1    env_manager_log setup_script started "Running setup script"
03:32:23.2    env_manager_log ERROR "Setup script failed" {error_kind:"init_script", error_type:"init_script", step_status:"failed"}
03:32:23.2    assistant {isApiErrorMessage:true, text:"Setup script failed with exit code 1.\n\nScript output:\n[setup] routine failure injection\n\nEdit your environment's setup script and start a new session."}
03:32:23.2    result {subtype:"error_during_execution", is_error:true, errors:["Setup script failed with exit code 1."], total_cost_usd:0, num_turns:0, duration_ms:0}
```
（`start_cc` 沒有事件，UI 標 Skipped。）之後只剩我開 run 頁時 client 送的 `control_request/initialize`，worker 不再回應。

### 狀態怎麼呈現（三處不一致）
| 位置 | 顯示 |
|---|---|
| trigger 物件 `last_run` | `{status:"ROUTINE_RUN_STATUS_FAILED", fired_at, finished_at}`——fire 後 5 秒內就寫 FAILED（之前先是 `PENDING`） |
| run session 物件 | `status:"active"`、**`status_bucket:"working"`**、`worker_status:"WORKER_STATUS_UNSPECIFIED"`、`external_metadata.container_cc_version:""`、`last_init_error:{error_kind:"init_script", recoverable:"false", worker_epoch:"1"}` |
| routine 細節頁 | 狀態列「**Running now, started 7 minutes ago**」、「5 of 5 succeeded」（失敗的第 6 次不計入分母）；Runs 列表該筆標 **Running**，13 分鐘後仍如此 |
| run session 頁 | 步驟卡「Set up a cloud container ✓／Cloned repository ✓／Ran setup script **Failed**／Start Claude Code **Skipped**」＋「An API error occurred · Try sending your message again」＋「Session couldn't start — This session hit an error it can't recover from. Start a new session to continue.」 |

→ **`ROUTINE_RUN_STATUS_*` 目前見到三值：`PENDING`／`SUCCEEDED`／`FAILED`**。但 UI 的 run 狀態是從 session `status_bucket` 算的，
setup 失敗時 session 不會被收斂成 failed，於是細節頁永遠「Running」、成功率分母也不含它——**routine 失敗在 UI 上會被低估**，要看 trigger 的 `last_run`。

### 通知
- 指示明文把「routine couldn't run at all」列為該通知的情況，但 **setup 失敗時 Claude Code 根本沒啟動**（`start_cc` 未執行、cost 0），
  模型沒機會呼叫 `PushNotification`。session 上仍掛 `routine_notify_push` tag，事件流裡沒有任何通知相關事件；
  瀏覽器端 `GET /api/organizations/<org>/notification/preferences` 有被打，但無法從網路層證實有沒有推播——**「setup 失敗會不會通知」仍未定**，
  需看實際手機／email（使用者可查 11:32 有無推播）。
- 對比：模型層的工具失敗（新對話 §9.3）會照常 `result success`，模型可依指示決定通知；平台層的 provision／clone／setup 失敗則沒有模型介入。

### 其他
- 新環境第一次跑是 `session_mode: "new"`＋「Cloning」；Default 是 `resume-cached`＋「Fetching」——與新對話 §10.2 一致，routine 也走同一套快取。
- 環境對話框的 Archive 在「Update cloud environment」底部，齒輪入口是 Cloud 子選單每列的 16px 按鈕（無 aria-label，只有 sr-only 文字
  「environment settings」）；用 role 抓不到，要用座標點。
- 清理狀態：routine 已切回 Default、仍 Paused；失敗環境已 archived；6 個 run session 未 Archive（第 6 個在 UI 上永遠 Running，可能需手動 Archive）。

---

## 待補清單（2026-08-27 盤點，對照 `2026-08-27-claude-code-web-new-session-walkthrough.md`）

目前已證明的主幹：**Routine = 預先打包的 session 建立參數（`job_config.ccr`，與 `POST /v1/code/sessions` body 同構）＋ cron／webhook／API 觸發；run 就是一個普通 cloud session**。以下是還缺的部分，分三塊。

### A. 可直接從新對話筆記搬過來（零風險，附「待驗」標註）——✅ 已於第四輪搬入

| 主題 | 出處 | 對本篇的意義 |
|---|---|---|
| `Claude_Code_Remote` meta-MCP 的 `create_trigger／update_trigger／delete_trigger／fire_trigger／list_triggers／send_later` | §5.4 | session 裡的 Claude 可以自己建／觸發 routine——UI／API／webhook 之外的第四條入口 |
| `/v1/code/triggers/<id>/run`（內部、瀏覽器 header）vs 官方 `/routines/<id>/fire`（對外、API key） | §7 | 兩個端點的邊界 |
| `allowed_tools` 只有 8 個，但 sandbox `system/init` 列 50 內建＋226 MCP 工具 | §8 | 白名單是「允許」不是「載入」；是否真的擋 `Task`／`ToolSearch`，未驗 |
| setup script 失敗 → `error_during_execution`、`total_cost_usd 0`、`start_cc` Skipped | §10.2 | 推論 routine run 會標 FAILED、不燒額度；通知是否發，未驗 |
| `session_mode: resume-cached`（Default 環境第二次起 clone 變 Fetching） | §10.2 | routine 每次 run 是否 resume-cached，影響起步時間 |
| `post_turn_summary.status_category`／`prompt_suggestion`／`rate_limit_event` | §5.5、§9.2 | run 的唯讀 session 頁上這些事件有沒有出現；「1 of 1 succeeded」對應哪個欄位 |
| repo 內 `.claude/skills` 完全沒載入 | §8 | Instructions 不能靠 repo skill，流程要寫進 Instructions 或 setup script |
| 「新對話 vs Routine」對照表 | §4 | 本篇應放反向對照或互鏈 |
| trigger 物件 JSON 原文 | §7 | 讓本篇自足，不必外連 |
| 自動化備註（portal 抓法、Connectors 計數要等穩定、Notifications banner 攔點擊） | 自動化備註 | 下次實驗會再踩 |

### B. 需再開 Playwright 的實驗（可重用 `trig_01UiyFoLajjeVMZVGu6MioEq`，Paused，唯讀）

| # | 實驗 | 要確認的事 | 優先 |
|---|---|---|---|
| 1 ✅ | 錄 run 的網路與事件流（`GET /v1/code/sessions?trigger_id=`＋run session events） | 「要不要發通知」那層系統指示原文（看 `append_system_prompt` 有沒有露出）；`allowed_tools` 在 `system/init` 的呈現；`post_turn_summary` 是否存在 | 高 |
| 2 ✅ | 失敗注入（Instructions 改成失敗動作，或換壞 setup script 的環境） | `last_run.status` 的其他值、細節頁畫法、通知是否推、是否燒額度 | 高 |
| 3 ✅ | API trigger 卡實建 | 給不給 endpoint／token；與 `fire` 端點的對應 | 高 |
| 4 | `allowed_tools` 是否真的擋工具 | Instructions 要求用 `Task`／`ToolSearch`／connector 工具，看被拒與否 | 中 |
| 5 | Enabled=Off 時 cron 到點真的不跑 | 用 Once trigger 設 5 分鐘後驗證，反向證明 | 中 |
| 6 | GitHub event trigger 實建 | 多出的 `webhook-triggers` 資源與 filter 的 JSON 形狀 | 中 |
| 7 | Draft routine 自然語言草擬 | 走哪個生成端點、草稿填哪些欄位 | 低 |
| 8 | `persist_session` 欄位 | UI 無對應開關；是否為「每次 run 重開 vs 續用 session」 | 低 |

做完 A＋B 的 1–3：機制主幹有完整證據鏈。B 的 4–8：UI／API 邊角行為全覆蓋。

### C. 從外部觀察不到（只能靠官方文件或長期觀察）

- run 在 Anthropic 端的排隊位置、stagger 偏移演算法、run limit 實際額度與重置規則。
- 通知判斷的系統指示完整原文——若 B1 的 `append_system_prompt` 沒露出，只能從模型回覆反推。
- 併發語意：B3 證實連續 API fire 各開 session 並行不合併；cron 到點與前一 run 重疊的行為未直接觀察。
- `ROUTINE_RUN_STATUS_*` 的完整枚舉（已見 `PENDING`／`SUCCEEDED`／`FAILED`；是否有 CANCELLED／TIMEOUT 未知）。
