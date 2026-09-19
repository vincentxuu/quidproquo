# Cloudflare Dash Ask AI 實測（2026-09-18）

來源：第二瀏覽器（playwright-core 自起 headed Chrome，profile 在 scratchpad）登入自己的帳號，從 `https://dash.cloudflare.com/<org>/home` 走完「開 Ask AI → 送唯讀問題 → 錄 WS 全量」。
指令為唯讀（點現成 chip「Find my account ID」，不做任何寫入／不改 DNS／不碰 Worker）。測試素材：自己的帳號（org `<org>`）。
原始擷取：`.playwright-mcp/cloudflare-askai-*.clean.*`（未追蹤，已遮罩；raw 僅留 scratchpad）。腳本：scratchpad `cf-askai/r{0,1,1b,1c,2,3,4}-*.mjs`。

## 定題
- Q1（L1+L2）：Ask AI 入口在哪、控制項／預設值／happy path 時間線是什麼？
- Q2（L3+L4）：傳輸方式？端點時序與事件型別？body／身分欄位？
- Q3（L5+L6）：中斷／失敗／權限邊界？與自家 quidproquo Ask AI pipeline 對照的改善路線？
- 本輪對照：有（L6 對 `src/pages/api/chat.ts`、`src/lib/conversation/`、`src/components/Chat/`，待讀碼後補）

## 1. UI 層（實測）
| 控制項 | 預設 | 點開看到 |
|---|---|---|
| 側欄 `Ask AI`（Manage account 上方）＋頂欄 `Ask AI` | 收合 | 右側抽屜，載入約 10s（`Getting things ready...`＋雲朵動畫） |
| 問候語 | — | `Good afternoon.`＋`What are we doing today?`（推測：依時段變化的靜態字串） |
| 建議 chip ×5 | — | `Orange vs Gray Cloud / What is the difference?`、`Bind R2 to a Worker / Connect object storage`、`Transfer a domain / Walk me through the process`、`Deploy a Worker / Help me get started`、`Find my account ID / Locate account and zone IDs` |
| 輸入框 | placeholder `Type @ to tag a resource or ? for shortcuts` | `@` 標註資源、`?` 快捷鍵（未展開實測，待 R5） |
| `New conversation` 按鈕、`Ask` 送出鍵 | — | 抽屜頂／底 |
| 隱私聲明（原文） | — | `Chats are recorded to improve the service and are processed in accordance with our Privacy Policy.` |
| 回答區 | — | 結構化回答（含內連 `Workers & Pages`、`Domains`）、追問 `Would you like me to look up the Zone ID for a specific domain on your account?`、回饋列（讚／踩／複製／Support 連結） |

→ 一句話觀察：Ask AI 是全域右抽屜（非獨立路由，`FRAMES` 只有 home 一個 frame），資源感知（`@` tag）是核心差異點。

## 2. 流程層（實測，R2/R3 兩次一致）
```
T+0s    點 chip「Find my account ID」（實際送出文字見下）
        ↓ GET /lee/ws 取 WS URL＋JWE token → wss://ax.cloudflare.dev/…（若已連線則跳過 configure）
T+1s    rpc createConversation → 首輪需先 configure（首輪實測回 error: "Agent has not been configured — call configure() first"）
        → configure({userId, userEmail:"", modelId:"", accountId, accountName}) → done
        → createConversation → {id, title, accountId, created_at}（title＝問題原文）
        → set_page_context({url, title, heading}) → cf_agent_use_chat_request({messages:[{id, role:user, parts:[{type:text}]}]})
T+2s    EntitlementAgent 起跑（capability-profile-<org>-<n>，見 L4）
T+2~40s reasoning-delta（~189 則）→ tool call report_profile → text-delta（~43 則）→ finish
T+60s   截圖確認完整回答已渲染（含帳號 ID、查 Zone ID 三步驟、追問）
```

## 3. 網路層（實測）
### 3.1 傳輸方式
- 主通道 **WebSocket**：`wss://ax.cloudflare.dev/agents/cloudflare-agent/<user>?_pk=<uuid>&t=<JWE A256GCMKW>`。SSE／輪詢皆無（實測）。
- REST 只做控制面（握手＋歷史），訊息本體全走 WS。

### 3.2 API 時序
| 順序 | 端點 | 用途／body 重點 |
|---|---|---|
| 1 | `GET /api/v4/lee/rollout/status?accountTag=<org>` | `{writePermissionsEnabled:true, writeRestrictedByAdmin:false}`（帳號層開關） |
| 2 | `GET /api/v4/lee/token/status` | `{isAuthenticated:true, tokenId, writeEnabled:false, optedOut:false, accountDisabled:false}`（注意：與 rollout 的 write 開關不一致，見 §5） |
| 3 | `GET /assets/cf-AIChatSidebarWrapper.<hash>.js` | 抽屜前端 bundle，懶載入 |
| 4 | `GET /api/v4/accounts/<org>/lee/ws` | 回 `{wsUrl, agentHost:"ax.cloudflare.dev", token:<jwe>, userTag, accountId:<acctNum>}` |
| 5 | `GET /api/v4/lee/conversations` | 歷史列表 `[{id, title, accountId, accountName, created_at, updated_at}]`（持久化證實） |
| 6 | `POST /api/v4/lee/token` | R1c 見過一次（換 token 用，body 未留，待補） |
| 7 | WS `wss://ax.cloudflare.dev/...` | 見 §4 |

### 3.3 身分與內部代號
- 代號 `lee`＝整條 Ask AI 後端命名空間（rollout／token／ws／conversations）；`ax.cloudflare.dev`＝agent host；agent 名 `cloudflare-agent`。
- WS 認證用 JWE（`alg:A256GCMKW, enc:A256GCM`），放 query `t`，另有 `_pk` uuid。Cookie 單獨不夠（未實測重打，推測：需 JWE）。

## 4. 事件／資料層（實測，R3 全量 470 frames：sent 3／recv 467）
| 方向 | 型別 | 數量 | 說明 |
|---|---|---|---|
| sent | `rpc createConversation` | 1 | args `[問題原文, accountId, accountId, accountName, true,false,true]`（後三 bool 語義不明，待深挖） |
| sent | `set_page_context` | 1 | `{url, title, heading}`——把當前頁面上下文餵給 agent（對照自家：我們沒有這層） |
| sent | `cf_agent_use_chat_request` | 1 | `{id, init:{method:POST, body:{messages:[{id, role, parts}]}}}`——把 REST 語義包進 WS |
| recv | `cf_agent_identity` | 1 | `{name:<user>, agent:"cloudflare-agent"}` |
| recv | `cf_agent_chat_messages` | 2 | 空歷史 `[]`（開場） |
| recv | `cf_agent_mcp_servers` | 1 | 兩個 MCP：`cloudflare-docs`（`https://docs.mcp.cloudflare.com/mcp`，state ready，prompt `workers-prompt-full` 指向 `developers.cloudflare.com/workers/prompt.txt`）＋`cloudflare-mcp-<org>`（`server_url: rpc:…`，帳號級工具）；工具例 `search_cloudflare_documentation` |
| recv | `cf_agent_session` | 2 | `{phase:"idle", tokenEstimate:17→8070, tokenThreshold:null}`（token 計量外顯） |
| recv | `agent-tool-event` | 250 | 外層：`{parentToolCallId:"capability-profile-<org>-<n>", sequence, event:{kind:started/chunk/finished, runId, agentType:"EntitlementAgent", …}}`；`finished` 帶 `summary:"Profile: free tier, 0 available / 0 unavailable"`＋`"replay":true` |
| recv | `cf_agent_use_chat_response` | 209 | `{id, body:"<AI SDK chunk JSON>", done}`——與上列逐一對應的雙軌轉發（推測：相容不同前端消費者） |
| 內層 chunk（body JSON） | `reasoning-delta ×189`、`text-delta ×43`、`reasoning-start/end`、`text-start/end`、`tool-input-start/delta/available`、`tool-output-available`、`start-step/finish-step ×2`、`start`、`finish(finishReason:stop)` | — | 即 **AI SDK v5 stream 協定原樣**（`finish-step` 出現兩次＝multi-step：先 EntitlementAgent 跑 `report_profile({tier:free,…})→{recorded:true}`，再主回答） |

→ 一句話結論：傳輸是「WS 上的雙軌轉發」——同一份 AI SDK v5 事件流同時以 `agent-tool-event`（帶 EntitlementAgent run 上下文）與 `cf_agent_use_chat_response`（裸 chunk）兩種 envelope 送達；先跑 entitlement profiling 再回答。

## 5. 邊界層（實測）
- **權限矛盾（實測）**：`rollout/status.writePermissionsEnabled=true` 但 `token/status.writeEnabled=false`。解讀（推測）：帳號允許寫入，但此次 token／此帳號（free tier？）被關寫——`report_profile` 回 `{tier:"free", available:[], unavailable:[]}` 佐證。寫入路徑未試（需使用者授權）。
- **首輪 configure 門檻（實測）**：未 configure 直接 createConversation 會被拒（原文 `"Agent has not been configured — call configure() first"`），client 自動補 configure 重試——值得學的重試模式。
- **刪除對話（實測失敗）**：`DELETE /api/v4/lee/conversations/<id>` 回 `404 {"error":"not found"}`——REST 無此端點（或路徑不同）。測試對話殘留，見殘留清單。
- **`@` 資源標註（實測，R5）**：選單標題原文 `REFERENCE A RESOURCE`，項目 `worker:—Workers`、`zone:—Websites (zones)`、`kv:—KV namespaces`、`queue:—Queues`、`workflow:—Workflows`、`vectorize:—Vectorize indexes`、`pipeline:—Pipelines`，鍵盤提示 `↑ ↓ to navigate / ↵ to choose / esc to dismiss`。
- **`?` 快捷鍵（實測，R5b，清空輸入後單獨打 `?`）**：選單標題原文 `SHORTCUTS`，項目 `Tag a resource (@)`、`Recent prompts (↑↓)`、`New line (⇧↵)`、`Stop response — Interrupt the agent while it's replying (esc)`、`Clear input — Empty the message box (esc)`。
- **中斷序列（實測，R5c）**：送唯讀長問題後 10s 按 esc → sent `{"type":"cf_agent_chat_request_cancel","id":"<reqId>"}`（id 與 `cf_agent_use_chat_request` 同值）→ recv `{"type":"cf_agent_use_chat_response","id":"<reqId>","body":"","done":true}`（空 body＋done 收尾，無錯誤、無部分文字保留標記）。UI：問題 bubble 留存、回答區空白、輸入框恢復可送。乾淨的 id 對應取消協定，值得學。
- **寫入請求被拒（實測，R6b，已授權）**：直送 `Create a read-only API token for my account now` → 無確認框、無工具呼叫、零寫入嘗試，直接文字拒絕（原文）：`can't create API tokens on your behalf — token creation isn't permitted through my API access. You can create one directly in the dashboard:`＋7 步圖文指引（含深連結 `Create API token`）＋追問 `Want me to help scope the token to specific products or zones?`。拒絕理由與 `token/status.writeEnabled:false` 一致（實測對應）。另記：agent 自稱 `Agent Lee`（`Agent Lee is thinking...`，即 `lee` 命名空間由來）；工具呼叫在 UI 顯示為 `→ searchDashboardPages → Documentation`；R6 的 `How do I create…` chip 送的是指引問句非寫入動作（未觸發拒絕）。
- **建議 chip 會輪換（實測）**：R1c（`Orange vs Gray Cloud`…`Find my account ID`）→ R5（`Domain settings`…`Environment variables`）→ R5b（`Create an API token`…`Bind R2`）——context 感知，觸發條件未深挖（推測：依對話狀態／頁面）。
- **自動化陷阱（實測）**：`getByRole(name:'Ask')` 預設子字串匹配，會命中頂欄 `Ask AI` 把抽屜關掉（R5 翻車）；輸入區送出鍵須 `exact:true` 或直接 `Enter`（plain Enter＝送出，`⇧↵`＝換行）。

## 6. 對照（已讀自家碼定稿：`src/pages/api/chat.ts` 實測）
| 項目 | Cloudflare Ask AI（實測） | quidproquo Ask AI（已讀碼） |
|---|---|---|
| 傳輸 | WS 雙軌轉發 AI SDK chunk | SSE（`step_start/tool_call/tool_result/step_complete/reasoning/token/done`，`chat.ts:181-226`） |
| 頁面上下文 | `set_page_context` 主動送 url/title/heading | 無（只送 message＋cacheMode） |
| 開場 profiling | EntitlementAgent 先跑 capability-profile 再回答 | 無（直接 planner；只有 semantic cache 短路，`chat.ts:130-144`） |
| 工具來源 | MCP（docs 全域＋帳號級 rpc） | 自家 retrieval（`related_posts`／`search_posts` tool_result，`chat.ts:208-217`） |
| 思考過程呈現 | reasoning-delta 全量下發（前端選渲染） | `reasoning` SSE 按 stage 累積＋AI Elements Reasoning（剛合併） |
| 中斷 | `cf_agent_chat_request_cancel{id}`＋空 done 收尾 | 待核對（前端有無送 cancel 未讀） |
| 歷史 | server 端 conversations 持久化 | semantic cache（`lookupSemanticCache/storeSemanticCache`），是否存完整對話待核對 |
| 寫入閘門 | rollout 開關＋token 級 `writeEnabled` 雙層 | `requestPolicy/cacheMode`，無雙層概念 |

### 一句話結論
對方是「帶頁面上下文＋開場能力盤點＋MCP 工具海」的通用 dashboard agent 通道；我們是「快、便宜、站內檢索專用」的問答管線——對方的 `set_page_context` 與 id 對應取消協定可直接學，EntitlementAgent 模式在我們推多能力時再考慮。
### 改善路線（建議）
- Phase 0（止血級 copy）：中斷時送 id 對應的 cancel（若還沒做）；`configure` 失敗自動重試一次。
- Phase 1（最高 CP）：問題送出時附當前頁面 url／title（等價 `set_page_context` 精簡版），讓回答能引用本站結構。
- 不要照抄：雙軌轉發（我們單一 SSE 已夠用）、MCP 工具海（我們是單一站點，不需要）、JWE-over-query（我們的 next 同源 SSE 不需要這種握手）。

## 自動化備註
- 抽屜載入約 10s（`Getting things ready...`），`innerText('body')` 抓得到但回答區文字需用截圖確認（body 切片 index 易切到 chip）。
- `TEXTBOX_COUNT`：載入完成前為 0，完成後為 1（placeholder 可抓）。
- 同一 profile 同時只能一個 Chrome 開；腳本間用 `rm SingletonLock/Socket/Cookie`＋`pkill` 交接；一支腳本做一件事、跑完 `ctx.close()`。
- Cloudflare 人機驗證本輪未觸發（`--disable-blink-features=AutomationControlled`＋低頻操作）。
- WS frame 超大（單則 20KB 切片仍可能截斷 JSON，分類時 `json.loads` 失敗的計為 nonjson，實為截斷所致非協定問題）。

## 已完成項目總覽
| 章節 | 項目 | 方法 |
|---|---|---|
| 定題 | Q1–Q3、唯讀素材、對照目標 | service-teardown §0 |
| L1 | 控制項表、placeholder／警語原文、路由（無獨立路由） | R1/R1c snapshot＋截圖 |
| L2 | happy path 時間線（兩次一致） | R2/R3 計時＋截圖 |
| L3 | WS＋7 支 REST、JWE 認證、雙層寫入開關 | response hook＋body 落檔 |
| L4 | 9 種 WS 型別＋15 種內層 chunk、MCP 清單、EntitlementAgent 流程 | 470 frames 全量分類 |
| L5 | configure 門檻原文、DELETE 404、權限矛盾、`@`／`?` 選單原文、中斷 cancel 序列、寫入拒絕原文、chip 輪換、getByRole 陷阱 | R4/R5/R5b/R5c/R6/R6b 實測＋截圖 |
| 清理 | 遮罩＋存檔（12 檔）；DELETE 測試對話失敗→殘留 | sed＋grep 驗證零命中 |
| L6 | 對照表定稿＋改善路線（Phase 0/1＋不要照抄） | 已讀 `src/pages/api/chat.ts` |

## 待深入項目（需要條件）
| 項目 | 需要條件 | 說明 |
|---|---|---|
| POST /lee/token 用途 | 再跑一次登入態過期流程 | 低優先 |

## 沒拿到的
- 對話刪除端點：`DELETE /lee/conversations/<id>` → `404 {"error":"not found"}`（原文照抄）。替代路徑：抽屜 UI 找刪除入口（未試）。
- 模型 ID：`configure` args 送 `modelId:""`（空字串），MCP 設定無模型資訊——模型選擇在 server 端，client 看不到（標 `推測`）。

## 殘留清單（需人工處理）
- 5 則測試對話（2 則 `Where do I find my account ID and zone ID?`、1 則 Orange/Gray cloud 長問題、1 則 `How do I create an API token?`、1 則 `Create a read-only API token for my account now`）：REST 無刪除端點，請在 Ask AI 抽屜用 UI 刪除（或保留無妨，全是唯讀問答，零寫入發生）。
