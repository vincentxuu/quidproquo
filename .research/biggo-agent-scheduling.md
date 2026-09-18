# BigGo Finance：排程通知＋額度機制 deep-dive（2026-09-18 實測）

> 範圍：Agent 主動式排程通知（scheduled-tasks CRUD＋兩段式確認）與額度系統（token-budget＋SSE budget_update）。
> 來源：`.research/2026-09-18-biggo-finance-fullsite-walkthrough.md`（§1.5／§3／§5／§7.4–7.5）、`.playwright-mcp/biggo-R6-final.har`、
> `.playwright-mcp/biggo-R6-task.json`、`.playwright-mcp/agent5-schedule.png`、chunk `5747-d5b12e4de9c37bde.js`（靜態）。
> 證據分級：【實測】＝ HAR／截圖／JSON 回包；【靜態】＝ bundle 程式碼未觸發；【推測】＝未驗證判讀。
> id 一律遮罩（前 8 碼＋…）。原文照抄，不翻譯。

## 1. 定位：主動式排程通知在免費／Pro 差異中的位置

付費方案 `/pricing` 實測三欄（原文照抄）【實測】：

| | Free $0 | Pro $20美元/月・$192/年（省20%） |
|---|---|---|
| AI 模型 | Flash | Flash、Pro、Thinking 深度思考模式 |
| 主動式排程通知 | 每日 5 次 | 每日 150 次 |
| 通訊軟體連結 | Telegram、LINE、Slack、Discord | 同左 |
| 法說會新聞搶先看 | ❌（"限Pro版方案"） | 提前 30 分鐘搶先看 |
| 廣告 | 有廣告 | 無廣告 |

結帳文案原文：「透過 Stripe 安全結帳 · 支援信用卡 / 簽帳金融卡 · 隨時取消或降級」。

定位觀察：

| 事實【實測】 | 判讀【推測】 |
|---|---|
| 排程通知是 Free／Pro 對照表 5 列中的 1 列，額度差 30 倍（5 vs 150） | 排程是付費牆內第二硬的數量牆（第一是模型三選項） |
| 通訊軟體連結四家（Telegram、LINE、Slack、Discord）兩方案相同 | 通道綁定本身不收費，收費點在觸發次數 |
| Agent 浮層用量環 aria 原文「當前用量 20%」 | 額度消耗對免費用戶可見，是升級漏斗的一部分（推測） |

## 2. 兩段式確認流程：第一句只建會話，第二句才建 task

實測會話（登入態 headed chromium，`agent5-schedule.png` 截圖＋R6 HAR）【實測】：

| 順序 | 誰 | 原文（照抄） |
|---|---|---|
| 1（使用者） | user | 「如果台積電(2330)收盤價跌破2400元，請通知我」 |
| 2（Agent） | agent | 「I can set up a recurring check for this. A couple of things to clarify first:」＋下表三點 |
| 3（使用者） | user | 「好，用你的建議」（walkthrough §5 實測記錄；截圖未收入此句） |
| 4（系統） | — | task 建成（`total:1`，見 §3） |

Agent 回覆三點（截圖原文照抄）：

| 點 | 原文 |
|---|---|
| 1 | 「觸發後要多久檢查一次？我無法即時監看盤中每一筆成交，只能用「定期檢查」的方式。建議的頻率：・每個交易日收盤後（例如 TW 時間 14:00 之後）・或每天一次」 |
| 2 | 「通知方式： 你目前只有一個可推送的頻道 — BigGo Web，我就發到這裡。」 |
| 3 | 「補充說明： 台積電 (2330) 目前不在你的自選清單裡（你的清單是 GOOG / NVDA / TSLA / SFTBY / SPY）。要不要我也幫你把 2330 加入自選？」 |
| 收尾問句 | 「先確認一下：「每個交易日收盤後檢查一次，若收盤價 < 2400 就通知我」這樣的設定可以嗎？或是你想改成別的頻率？」 |

時間線【實測】：

| 階段 | 證據 |
|---|---|
| 第一句後 | `GET scheduled-tasks` 回 `total:0`——**只建會話，不建 task** |
| 第二句「好，用你的建議」後 | `total:1`，task 物件落袋（全文見 §3） |
| 之後 | toggle（POST 200）→ DELETE（200）→ list 歸零（見 §4） |

關鍵行為：Agent **不會自作主張建 task**，先宣告能力邊界（無即時監看、只能定期檢查）再要確認。walkthrough 原話：「排程走兩段式確認，不會自作主張」。

## 3. task 物件詳解（`biggo-R6-task.json` 全文，id 遮罩）

外層：`{"result":true,"data":{"items":[…],"limit":50,"offset":0,"has_more":false,"total":1,"total_oneshot":0,"total_recurring":1}}`

逐欄【實測】：

| 欄位 | 值（原文） | 說明 |
|---|---|---|
| `id` | `d5e23d1a-…（後段遮罩）` | task 主鍵 |
| `task_type` | `recurring` | 週期型；list 另計 `total_oneshot:0`、`total_recurring:1` |
| `action_kind` | `chat_message` | 觸發後發一則聊天訊息（推測語義） |
| `description` | `每交易日收盤後檢查台積電(2330)是否跌破2400元` | Agent 生成的人話摘要 |
| `status` | `active`（建成時）→ toggle 後 `paused` | 見 §4 |
| `next_fire_at` | `2026-09-18T07:00:00+00:00` | ＝ 台北 15:00，當天收盤後（推測對應關係） |
| `last_fire_at` | `null` | 尚未觸發過 |
| `fire_count` | `0` | 同上 |
| `run_at` | `null` | 週期型不用此欄（推測） |
| `cron_expr` | `0 15 * * 1-5` | 週一～五 15:00；**自然語言→cron 由 Agent 生成**（§6） |
| `timezone` | `Asia/Taipei` | 用使用者時區，非 UTC |
| `expires_at` | `2027-09-18T06:49:12+00:00` | 建成時刻 `2026-09-18T06:49:12`＋**1 年**；過期預設 1 年【實測，推測為預設值】 |
| `max_fires` | `null` | 無次數上限 |
| `message` | 見下表雙分支模板 | 觸發時餵給 Agent 的指令 |
| `schedule_label` | `在 15:00, Monday 到 Friday (Asia/Taipei)` | 人話標籤（中英混雜原文） |
| `session` | `null` | 未綁定特定會話 |
| `target` | `{"channel_type":"biggo","user_identity_id":null,"label":"BigGo Web"}` | 推送通道＝站內；呼應 §2 第 2 點 |
| `created_at`／`updated_at` | `2026-09-18T06:49:12.642400+00:00` | 建成即兩者相同 |

message 雙分支模板（原文照抄）：

> 「請查詢台積電 (2330) 今日收盤價。若收盤價跌破 2400 元，通知使用者「台積電 2330 收盤價已跌破 2400 元，今日收盤 XX 元」；若未跌破，則回報「台積電 2330 今日收盤 XX 元，未跌破 2400 元」。」
>
> 結構：`查詢指令`＋`跌破分支（通知）`＋`未跌破分支（回報）`，`XX` 為執行時填空。條件模板由 Agent 生成（推測，見 §6）。

### 3.1 cron 與觸發時刻對照【實測＋推測】

| 欄位 | 值 | 解讀 |
|---|---|---|
| `cron_expr` | `0 15 * * 1-5` | 分`0` 時`15` 週`1-5`（週一～五）；日期欄 `*` |
| `timezone` | `Asia/Taipei` | cron 按台北時間解釋【推測】 |
| `next_fire_at` | `2026-09-18T07:00:00+00:00` | ＝ 台北 15:00；09-18 為週五，落在 `1-5` 內【實測數字，對應關係推測】 |
| 會話建議 | 「每個交易日收盤後（例如 TW 時間 14:00 之後）」 | Agent 提議 14:00 之後，實際落點 15:00【實測】 |
| `expires_at` | 建成＋1 年（秒級對齊 `06:49:12`） | 預設效期 1 年【推測為預設值】 |

## 4. CRUD 端點表（bundle 靜態＋R6 HAR 實測）

base：`https://api.biggo.com/api/v1/finance/sparrowhawk`，每筆皆帶 `?region=tw`。

### 4.1 排程 CRUD（chunk `5747`，函式 `v/E/T/b/P`）【靜態＋實測】

| 函式 | 方法＋路徑（bundle 原文形狀） | 用途 | 實測狀態碼 |
|---|---|---|---|
| `v(params)` | `GET /scheduled-tasks` | list（分頁 `limit/offset`） | 200（R6：建成前 `total:0`→建成後 `total:1`→刪除後 `total:0`） |
| `E(id, body)` | `PATCH /scheduled-tasks/{id}`（`body:JSON.stringify`） | 改 task（推測：改名／改設定） | 未觸發，沒拿到 |
| `T(id)` | `POST /scheduled-tasks/{id}/toggle` | 啟停切換 | 200（`active`→`paused`，回包為完整 task 物件） |
| `b(id)` | `DELETE /scheduled-tasks/{id}` | 刪除 | 200（回 `{"result":true,"data":{"cancelled":true}}`） |
| `P(params)` | `GET /scheduled-tasks/search` | 搜尋 task | 未觸發，沒拿到 |

R6 實測序列（`biggo-R6-final.har`，13 筆相關）【實測】：

| # | 方法＋路徑 | 狀態 | 回包要點 |
|---|---|---|---|
| 1–2 | `GET /scheduled-tasks?region=tw` ×2 | 200 | 建成後 `total:1`（第一句後為 `total:0`，見 §2） |
| 3 | `POST /scheduled-tasks/{id}/toggle?region=tw` | 200 | `status:paused` |
| 4 | `DELETE /scheduled-tasks/{id}?region=tw` | 200 | `{"cancelled":true}` |
| 5 | `GET /scheduled-tasks?region=tw` | 200 | `items:[]`，`total/total_oneshot/total_recurring` 全 0 |

同 HAR 內會話清場序列（排程會話善後）【實測】：

| # | 方法＋路徑 | 狀態 | 回包要點 |
|---|---|---|---|
| 6 | `GET /sparrowhawk/scheduled-tasks?region=tw`（ sandwich 間重複查） | 200 | 與 #1–2 同形 |
| 7 | `GET /sessions?region=tw` | 200 | 含排程測試會話（title「台積電跌破2400通知」） |
| 8 | `DELETE /sessions/116be989-…（後段遮罩）?region=tw` | 200 | 排程測試會話刪除 |
| 9 | `GET /sessions?region=tw` | 200 | 僅剩使用者原有「推薦其他podcast」 |
| 10 | `GET /token-budget?region=tw` | 200 | `used_percent:40`（見 §5.1） |

### 4.2 通訊軟體綁定 link（函式 `O/W/K`）【靜態為主】

| 函式 | 方法＋路徑 | 用途 | 實測 |
|---|---|---|---|
| `O(signal)` | `GET /link/list` | 已綁定通道列表 | 未觸發 |
| `W()` | `POST /link/code` | 取綁定碼；回 `{code, expiresAt: Date.now()+1e3*expires_in_seconds}` | 未觸發；`expires_in_seconds` 為後端給的有效秒數 |
| `K(code)` | `DELETE /link/{encodeURIComponent(code)}` | 解綁 | 未觸發 |

對照：pricing 頁宣稱四家（Telegram、LINE、Slack、Discord），但本次 Agent 實測回覆「你目前只有一個可推送的頻道 — BigGo Web」【實測】——綁定流程走完前，排程只能推站內（推測）。

### 4.3 認證與重試（bundle 靜態）【靜態】

| 項 | 內容 |
|---|---|
| 標頭 | `Authorization: Bearer {BG_AT}`；匿名讀僅 `Accept: application/json`（HAR 實測） |
| 401 | 刷新 token（函式 `h`，打 `/api/v1/spaweb/auth`）後重打一次；`tokenExpired` 帶 `__retry` 計數器（計數上限見 walkthrough：最多重試 2 次，100ms 遞增——bundle 內數字未逐字核對，標推測） |
| 429 | 直接不重試 |
| 非 GET | 不重試（tokenExpired 例外） |
| SSE 錯誤類 | `AgentSSEHttpError("Agent SSE request failed: {status} {statusText}")`（原文） |

## 5. 額度系統（token-budget 逐欄＋SSE 事件＋用量環）

### 5.1 `GET /sparrowhawk/token-budget` 回包（R6 HAR 全文）【實測】

```json
{"result":true,"data":{"enabled":true,"reset_at":"2026-09-18T12:00:00+00:00","reset_in_sec":18693,
"tier":"logged_in","window":{"reset_at":"2026-09-18T12:00:00+00:00","reset_in_sec":18693,
"window_hours":6,"used_percent":40},"weekly":{"reset_at":"2026-09-21T00:00:00+00:00",
"reset_in_sec":234693,"used_percent":6},"used_percent":40}}
```

逐欄：

| 欄位 | 值 | 說明 |
|---|---|---|
| `enabled` | `true` | 額度開關開著 |
| `tier` | `logged_in` | 登入態等級（匿名 tier 未測，沒拿到） |
| `window.window_hours` | `6` | 滑動窗口 6 小時 |
| `window.used_percent`／頂層 `used_percent` | `40`（R6 時點） | 兩者相同，頂層為窗口值的鏡像（推測） |
| `window.reset_at`／`reset_in_sec` | `2026-09-18T12:00:00+00:00`／`18693` | 窗口重置點（UTC 正午＝台北 20:00，推測為固定 RESET 時刻） |
| `weekly.used_percent` | `6` | 週窗口用量 |
| `weekly.reset_at` | `2026-09-21T00:00:00+00:00`（週一） | 週重置點 |

### 5.2 用量数字序列【實測】

| 時點 | used | 來源 |
|---|---|---|
| hi 寒暄輪 | 3% | R4 HAR |
| 工具輪（2357 本益比） | 11% | R4 HAR |
| 後期用量環 aria「當前用量 20%」 | 20% | 浮層 aria＋截圖 |
| R6 排程輪 | 40% | R6 HAR `token-budget` |

### 5.3 SSE `budget_update` 事件【實測】

每輪 message 回應必帶 1 個（2357 那輪 253 chunks 含 1 個）：

| 欄位 | 內容 |
|---|---|
| `type` | `budget_update` |
| `reset_at` | 重置時刻 |
| `window` | `{window_hours:6, used_percent, reset_in_sec}` |
| `weekly` | `{…}`（週窗口，欄位形狀同上） |

### 5.4 計費單位

**沒拿到**：按 token 還是按次數計費未知。walkthrough 原話：「是否按 token 或次數計費未知」。不寫推測細節。

### 5.5 額度事件在完整 SSE 序列中的位置（2357 估值輪，253 chunks）【實測】

| 階段 | 事件 | 次數 | 內容 |
|---|---|---|---|
| 工具 | `tool_calls`＋`tool_result` 交錯 | 各 ×5 | 序列：`read_skill`→`es_query`→（回）→`read_skill`→（回）→`es_query`×2→（回×2）；只有 name，無參數無結果 |
| 命名 | `session_title` | ×1 | 以問句自動命名 |
| 本文 | `delta` | ×240 | 2–3 字一塊（hi 輪是逐字；與長度有關，推測） |
| 額度 | `budget_update` | ×1 | 6h 窗口＋週窗口＋百分比 |
| 收尾 | `done`＋`assistant_message_id` | ×1 | 無 `done` 即未完成（abort 輪無此事件，實測） |

寒暄輪（`hi`）對照：**不調工具**，stream 全是 delta＋title＋budget＋done；title 取 `"Greeting"`；繁中敬語「您」。工具輪 title 取問句（"華碩2357本益比查詢"）；abort 輪 title 停在 `"Untitled"`（命名事件沒來得及發）。

## 6. 與一般排程產品的差異觀察（推測標明）

| 一般排程產品（常見形狀，不屬實測） | BigGo 實測形狀 | 差異判讀 |
|---|---|---|
| 使用者填 cron／選頻率表單 | 使用者說人話（「跌破2400通知我」），`cron_expr:"0 15 * * 1-5"` 由 Agent 生成 | 自然語言轉 cron【推測：由 Agent 按確認內容組裝】 |
| 條件邏輯由使用者寫規則 | `message` 雙分支模板（跌破／未跌破）由 Agent 生成，觸發時再餵回 Agent 執行查詢＋撰寫通知 | 條件模板即 prompt，執行器＝Agent 自己【推測】 |
| 即時觸發（價格穿線即推） | Agent 明說「我無法即時監看盤中每一筆成交，只能用定期檢查」 | 輪詢語義，非事件驅動【實測宣告】 |
| 通道先綁定才能建排程 | 未綁定四家通道仍可建 task，target 落 `biggo` 站內 | 通道缺失不擋建立，只降級推送目標【實測】 |
| 建完即生效無需確認 | 兩段式確認（§2），第一句 `total:0` | 防誤建，確認是建 task 的必要條件【實測】 |
| 排程名使用者自填 | `description`＋`schedule_label` 由 Agent 生成（中英混雜原文） | 命名也是生成物【推測】 |

## 7. 沒拿到的＋殘留

### 7.1 沒拿到的

| 項 | 狀態 |
|---|---|
| `PATCH /scheduled-tasks/{id}` 改 task | bundle 有，**未實測觸發** |
| `GET /scheduled-tasks/search` | bundle 有，**未測** |
| `GET /link/list`、`POST /link/code`、`DELETE /link/{code}` | bundle 有，**全未觸發**；`expires_in_seconds` 真值未知 |
| task 實際觸發＋通知到達 | 建→toggle→刪全通；觸發需等到 15:00，**未等** |
| 計費單位（token vs 次數） | **標沒拿到**（§5.4） |
| 匿名 tier 的 token-budget | 未測 |
| Pro／Thinking 切換、法說會 30 分鐘搶先牆 | 需 Pro 帳號，未測 |
| 工具參數與檢索結果原文 | stream 內只有 tool name；history 只有最終文字 |
| 頂部 6 icon tooltip／aria（僅「加寬視窗」有 aria） | hover、DOM 皆無，語義維持推測 |
| 第二句後 Agent 的建成回覆原文 | walkthrough 只記 task 建成，未留存建成宣告文字 |

### 7.2 殘留清單【實測】

| 項 | 狀態 |
|---|---|
| 排程 task | 建 1 刪 1，list 驗證歸零（`total/total_oneshot/total_recurring` 全 0） |
| 測試會話 8 個 | 全 DELETE 200；現存僅使用者原有「推薦其他podcast」，未動 |
| 本機 `/tmp/biggo-har/profile` | 含登入態 profile（未追蹤，`/tmp` 重開機消失） |
| 帳密暫存檔 | 已刪；對話內出現過明文密碼，建議更換（walkthrough 原話） |
| `news/view-attest` 瀏覽信標＋用量計數（6h 窗口 3%→40%） | 站方側，無需也無法清理 |
