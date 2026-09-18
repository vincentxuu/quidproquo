# BigGo Finance Agent 對話機制 deep-dive（2026-09-18）

來源：全站筆記 `.research/2026-09-18-biggo-finance-fullsite-walkthrough.md`（§2 R4 時間線、§3 sparrowhawk、§4 SSE、§7 Agent 行為）、HAR `.playwright-mcp/biggo-R4-agent.har`（7 筆，完整版 `/tmp/biggo-har/biggo-R4-agent.har`）、hi 輪 SSE `.playwright-mcp/biggo-R4-hi-sse.json`、前端 SSE 客戶端 `.playwright-mcp/biggo-R2-agent-sse-chunk.js`、2357 輪拆解 `/tmp/biggo-har/r4_dump.txt`、截圖 `.playwright-mcp/agent3-after-quote.png`（2330 行情卡）、`agent4-after-pe.png`（2357 估值表）。
會話皆為登入態 headed chromium 實測；session id 一律寫 `<session>`、message id 寫 `<msg>`，不貼 token。結論後標證據等級：【HAR】／【靜態】／【截圖】／【推測】。

## 1. 產品定位

Agent 在全站的位置：頂部導覽 7 個主入口＋1 個 Agent 入口，全域浮層（全屏 modal 蓋住首頁左側新聞欄），overlay 而非換頁【截圖】。

| 項目 | 原文／實測 | 證據 |
|---|---|---|
| 浮層標題 | `✦ Agent`（R1 截圖）／`Agent`（R4 截圖，`✦` 為圖示字體差異，推測同一控制項） | 【截圖】 |
| 自我介紹（R1 浮層首句） | 「嗨！我是 BigGo Finance 助理，可以幫你查台股／美股／日股的行情、財報、月營收、股利、法說會內容和各類財經新聞。」＋「有想查哪一檔，或想比較什麼嗎？直接跟我說代號或公司名稱就可以。」 | 【截圖】 |
| 自我介紹（hi 輪 SSE，敬語版） | 「您好！我是 BigGo Finance 助理，可以幫您查詢台股、美股、日股的行情、財報、月營收、股利、法說會等資訊，也能做簡單的比較和整理。\n\n需要查什麼呢？直接告訴我股票代號或公司名稱就可以。」 | 【HAR】 |
| 能力邊界（市場） | 台股／美股／日股（未提韓／陸港；但個股頁 `/quote/` 實測支援 `000660.KS`、`1398.HK`、`600030.SS` 路由存在，Agent 是否支援沒測） | 【截圖】＋【推測】 |
| 能力邊界（資料） | 6 類：行情、財報、月營收、股利、法說會內容、財經新聞（＋簡單比較和整理） | 【HAR】 |
| 預設模型 | `Flash`「回覆最快」✓；`Pro`「適合複雜回覆」🔒、`深度思考`「解決深度問題」🔒（免費用戶鎖定） | 【截圖】 |
| 定價對照（`/pricing` 實測） | Free $0：Flash；Pro $20美元/月・$192美元/年：Flash＋Pro＋Thinking 深度思考模式、每日 150 次排程（Free 每日 5 次）、法說會提前 30 分鐘搶先看、無廣告 | 【靜態】全站筆記 §1.5 |
| 模型偏好儲存 | localStorage `agent_model_pref = {"model":"flash","thinking":false}`，前端本機直送後端 | 【靜態】 |
| 互動卡渲染 | 行情回答配前端互動卡（成交量卡＋台積電 k 線卡）；卡片 payload 不在 SSE 內，前端另調行情 API（推測） | 【截圖】＋【推測】 |

→ 一句話：會調工具的財經問答 agent——skill 路由（read_skill）＋財經檢索（es_query）＋逐字串流，前端再把回答配上互動卡；排程走兩段式確認，不會自作主張（全站筆記 §7 原文）。

## 2. 會話生命週期

開面板即建新會話：三次開啟產生三個會話（`d420…`、`1d54…`、`4a29…`），body `{}`【HAR】。`/agent/c/` 有歷史路由但未走，能否回放舊會話沒拿到。

### 2.1 端點表（base `https://api.biggo.com/api/v1/finance`，每筆皆帶 `?region=tw`）

| # | 方法＋路徑 | 用途 | 認證 | 實測結果 |
|---|---|---|---|---|
| 1 | `POST /sparrowhawk/sessions` | 建會話 | Bearer（清場 DELETE 只帶 Accept＋Bearer 即 200，故建會話同理推測） | → `{id, name:null}`【HAR】 |
| 2 | `GET /sparrowhawk/sessions` | 列會話 | 同上 | → `{current_session_id, limit, offset, has_more, total, items[]}`【HAR】 |
| 3 | `GET /sparrowhawk/sessions/<session>/history` | 讀歷史 | 同上 | → `{session_id, current_session_id, title, has_more, limit, offset, messages[]}`【HAR】 |
| 4 | `POST /sparrowhawk/message` | 發話（SSE） | 同上 | 見 §3、§4【HAR】 |
| 5 | `PATCH /sparrowhawk/sessions/<session>` | 改名 `{name}` | 沒拿到（bundle 有函式，HAR 未觸發） | 沒拿到 |
| 6 | `POST /sparrowhawk/sessions/<session>/abort` | 中斷（UI Stop 用） | 同上 | → `{"aborted":true}`【HAR，R5 實測】 |
| 7 | `DELETE /sparrowhawk/sessions/<session>` | 刪會話 | Bearer 單獨即夠【HAR】 | → `{data:null}`【HAR】 |
| 8 | `PUT /sparrowhawk/sessions/<session>/activate` | 回到某會話（推測） | 沒拿到 | bundle 有函式，HAR 未觸發【靜態】 |
| 9 | `GET /sparrowhawk/sessions/search` | 搜尋會話 | 沒拿到 | bundle 有函式，HAR 未觸發【靜態】 |
| 10 | `POST /sparrowhawk/sessions/<session>/regenerate` | 重生成 | 沒拿到 | bundle 有函式（`{assistant_message_id, message?, page_metadata?}`），HAR 未觸發【靜態】 |
| 11 | `GET /sparrowhawk/token-budget` | 額度查詢 | 同上 | 見 §7.5【HAR】 |

注意：裸 `/sessions`＋`/message`（無 sparrowhawk 前綴）手刻實測 403 `correct-method`；真路徑是 `/sparrowhawk/*`【HAR】。

### 2.5 R4 操作時間線（登入態 headed chromium，HAR 實測）

| T | 動作 | 備註 |
|---|---|---|
| T+0s | `POST /sparrowhawk/sessions` → `{id, name:null}` | 建會話，body `{}` |
| T+1s | `POST /sparrowhawk/message {message, session_id, page_metadata:{url}, model:"flash", thinking:false}` | SSE：delta×N → session_title → budget_update → done＋assistant_message_id |
| T+8s | 問「華碩(2357)本益比多少」 | 先 tool_calls／tool_result（read_skill→es_query…），再 delta 全文 |
| T+12s | 答完渲染互動卡 | 2330 輪：成交量卡＋台積電 k 線卡（截圖） |
| T+15s | `GET history`／`DELETE /sessions/{id}` → 200 | 清場（見 §8.2） |

### 2.6 request／response 形狀

| 端點 | REQ（實測原文，id 已遮罩） | RESP（實測原文，id 已遮罩） |
|---|---|---|
| 建會話 | `{}` | `{"result":true,"data":{"id":"<session>","name":null,"created_at":"2026-09-18T06:30:37.202607+00:00"}}` |
| 列會話 | （無 body） | `{"result":true,"data":{"current_session_id":"<session>","limit":20,"offset":0,"has_more":false,"total":2,"items":[{"id":"<session>","title":"華碩2357本益比查詢","name":"華碩2357本益比查詢","message_count":2,"created_at":"…","updated_at":"…","is_current":true,"match":{"type":"preview","snippet":"華碩(2357)本益比多少","message_id":"<msg>"},"unread":false,"channels":["biggo"]}, {"id":"<session>","title":"推薦其他podcast","name":"推薦其他podcast","message_count":2,…,"is_current":false,…,"channels":[]}]}}` |
| 讀歷史 | （無 body；`?limit&offset`，實測 `limit:50, offset:0`） | `{"result":true,"data":{"session_id":"<session>","current_session_id":"<session>","title":"華碩2357本益比查詢","has_more":false,"limit":50,"offset":0,"messages":[{"id":"<msg>","role":"user","content":"華碩(2357)本益比多少","created_at":"…"},{"id":"<msg>","role":"assistant","content":"**華碩 (2357) 本益比：13.86 倍**…","created_at":"…"}]}}` |
| 刪會話 | （無 body） | `{"result":true,"data":null}` |
| 中斷 | （無 body） | `{"aborted":true}` |

### 2.3 session_title 命名規則

| 情境 | title | 命名事件 | 證據 |
|---|---|---|---|
| `hi` 寒暄 | `Greeting`（英文固定） | SSE `session_title` 事件 `{"type":"session_title","name":"Greeting"}` | 【HAR】 |
| `華碩(2357)本益比多少` | `華碩2357本益比查詢`（問句壓縮：去括號＋加「查詢」） | 同事件，`name` 為壓縮後問句 | 【HAR】 |
| abort 中斷輪 | `Untitled`（命名事件沒來得及發） | 無 `session_title` 事件 | 【HAR，R5】 |
| 建會話當下 | `name:null` | 命名是後續 SSE 事件，非建會話回應 | 【HAR】 |

### 2.4 abort 後狀態

| 項目 | 實測 | 證據 |
|---|---|---|
| 中斷端點回應 | `POST abort` → 200 `{"aborted":true}`；stream 直接斷（該 message 無 body） | 【HAR，R5】 |
| history 殘留 | assistant 空 content 訊息＋`"aborted":true` 旗標；title 停在 `Untitled` | 【HAR，R5】 |
| UI | 靜默：輸入框恢復可送，無錯誤文案（截圖 `stop-after.png`） | 【截圖】全站筆記 §5 |
| 前端處理 | `AbortError` 靜默結束（bundle：`if("AbortError"===e.name)return`，不進 onError） | 【靜態】 |
| 無 `done` 即未完成 | abort 輪 SSE 無 `done` 事件 | 【HAR，R5】 |

## 3. 發話協議

三輪 REQ 一致（hi／2357／R5 中斷前），REQ 全文（id／URL 已遮罩）：

```json
{"message": "華碩(2357)本益比多少", "session_id": "<session>",
 "page_metadata": {"url": "https://finance.biggo.com.tw/"},
 "model": "flash", "thinking": false}
```

| 欄位 | 說明 | 證據 |
|---|---|---|
| `message` | 使用者原文（`hi`／`華碩(2357)本益比多少` 兩輪實測） | 【HAR】 |
| `session_id` | 建會話回的 id；bundle 內可選（`...n?{session_id:n}:{}`，沒帶時後端新建，推測） | 【HAR】＋【靜態】 |
| `page_metadata.url` | 每輪都送當前頁＝onboarding「可問當前頁面」的實現 | 【HAR】 |
| `model` | `flash`，與 localStorage `agent_model_pref` 一致（前端偏好直送後端） | 【HAR】 |
| `thinking` | `false`，同上；即 Pro Thinking 開關（推測） | 【HAR】＋【推測】 |
| 省略規則 | bundle：`model`／`thinking`／`session_id`／`page_metadata` 皆條件式展開，有值才送；`thinking` 僅 `typeof === "boolean"` 才送 | 【靜態】函式 `L` |

### 3.1 認證來源（DevTools 截圖＋bundle 交叉，全站筆記 §3.3）

| 存處 | 鍵 | 內容形狀 | 用途判讀 |
|---|---|---|---|
| Cookie | `BG_AT` | JWT（`typ:JWT alg:ES256`，552 bytes），Secure＋SameSite Lax，到期 2026 | Access Token＝`Authorization: Bearer` 來源（推測） |
| Cookie | `BG_RT` | 25 字元不透明字串，Secure＋Lax | Refresh Token，`/api/v1/spaweb/auth` 刷新用（推測） |
| Cookie | `BG_SR` | 值 `1`，HttpOnly＋Secure＋Lax | 旗標（推測為 session 輪轉記號） |
| Cookie／localStorage | `fgp` | 35 hex 字元，到期 2027 | 裝置指紋＝`X-Anonymous-User-Id` 來源（推測） |
| localStorage | `agent_model_pref` | `{"model":"flash","thinking":false}` | 模型偏好，前端本機直送後端 |

傳輸層（bundle 函式 `L`／`R`／`z`／`J`，`biggo-R2-agent-sse-chunk.js` 實測）：

| 函式 | 對應 bundle 符號 | 職責 | 證據 |
|---|---|---|---|
| 建會話 | `g`（`createAgentSessionCSR`） | `POST /sparrowhawk/sessions`，body `{}`，需 `X-Doorkeeper-Token`＋`X-Anonymous-User-Id` | 【靜態】 |
| 列會話 | `f` | `GET /sparrowhawk/sessions`，支援 `unread` 參數 | 【靜態】 |
| 改名 | `_` | `PATCH /sparrowhawk/sessions/<id>`，body `{name}` | 【靜態】 |
| 刪除 | `m` | `DELETE /sparrowhawk/sessions/<id>` | 【靜態】 |
| 回到會話 | `w` | `PUT /sparrowhawk/sessions/<id>/activate`（語義為推測） | 【靜態】＋【推測】 |
| 中斷 | `p` | `POST /sparrowhawk/sessions/<id>/abort` | 【靜態】＋【HAR】R5 |
| 讀歷史 | `j` | `GET /sparrowhawk/sessions/<id>/history`，`{session_id→n, limit, offset}` | 【靜態】 |
| 搜尋 | `y` | `GET /sparrowhawk/sessions/search`，支援 `scope`（逗號 join） | 【靜態】 |
| 額度 | `k` | `GET /sparrowhawk/token-budget` | 【靜態】 |
| 發話 | `L` | `POST /sparrowhawk/message`（SSE，見下） | 【靜態】＋【HAR】 |
| 重生成 | `N` | `POST /sparrowhawk/sessions/<id>/regenerate`，`{assistant_message_id, message?, page_metadata?}`（message trim 後為空則不送） | 【靜態】 |
| 標頭 | `R` | `Content-Type`＋`Accept: text/event-stream`＋Bearer＋匿名 id＋Site | 【靜態】 |
| 地區 | `A` | `?region=`（host 解析，`tw`） | 【靜態】 |
| 狀態檢查 | `x` | 非 ok 即拋 `AgentSSEHttpError` | 【靜態】 |
| 401 重打 | `z` | 401 → 刷新後重打一次 | 【靜態】 |
| SSE 解析 | `J` | `onEvent`／`onDone`／`onError` 回調驅動 | 【靜態】 |

| 項目 | 實測 | 證據 |
|---|---|---|
| URL 拼接 | `"https://api.biggo.com"+"/api/v1/finance"+"/sparrowhawk/message"+?region=`（region 由 host 解析，`tw`） | 【靜態】函式 `L`＋`A` |
| 請求標頭 | `Content-Type: application/json`＋`Accept: text/event-stream`＋`Authorization: Bearer <token>`＋`X-Anonymous-User-Id`（無 token 時匿名）＋`Site`（host 解析） | 【靜態】函式 `R` |
| Doorkeeper | 建會話（函式 `g`）需 `X-Doorkeeper-Token`（`pk_live_…`＋challenge 解謎，函式 `h`）；發話 `L` 不帶此標頭 | 【靜態】 |
| 401 處理 | 401 → 調 `/api/v1/spaweb/auth` 刷新後重打一次（函式 `z`）；失敗只 warn「刷新請求網路失敗，維持登入」 | 【靜態】 |
| 重試語義 | `tokenExpired` 最多重試 2 次、間隔 100ms 遞增；429 直接不重試；非 GET 不重試（除 tokenExpired 例外） | 【靜態】函式 `u` |
| 中斷 | `signal`（AbortController）傳入 fetch；`AbortError` 靜默返回 | 【靜態】函式 `L` |
| 錯誤類 | `AgentSSEHttpError("Agent SSE request failed: {status} {statusText}")` | 【靜態】類 `S` |
| 解析器 | `body.getReader()`＋`TextDecoder` 自解析 `\n\n`／`data:` JSON，`done:true` 結束；`error` 欄位轉 onError；手寫最小子集，非 Agent SDK stream-json 同構 | 【靜態】函式 `J` |

## 4. SSE 事件詳解

5 種事件（`POST .../sparrowhawk/message` 回應，逐行 `data: JSON`）：

| # | 事件形狀 | 說明 | 證據 |
|---|---|---|---|
| 1 | `{"session_id":"<session>","delta":"…"}` ×N | 逐塊文字串流（見粒度表） | 【HAR】 |
| 2a | `{"session_id":"<session>","type":"tool_calls","content":[{"name":"read_skill"}]}` | 工具呼叫，只含 name，無 args | 【HAR】 |
| 2b | `{"session_id":"<session>","type":"tool_result","content":{"name":"read_skill"}}` | 工具回來，只含 name，無結果內容 | 【HAR】 |
| 3 | `{"type":"session_title","session_id":"<session>","name":"…"}` | 自動命名（`Greeting`／`華碩2357本益比查詢`） | 【HAR】 |
| 4 | `{"type":"budget_update","reset_at":"…","window":{"reset_at":"…","reset_in_sec":…,"window_hours":6,"used_percent":…},"weekly":{…},"used_percent":…}` | 額度事件，每輪 1 個 | 【HAR】 |
| 5 | `{"session_id":"<session>","assistant_message_id":"<msg>","done":true}` | 結束＋訊息 id；無 `done` 即未完成 | 【HAR】 |

### 4.1 兩輪 chunk 統計（完整 HAR 實測，非 dump 截斷版）

| 輪 | 總 chunks | delta | tool_calls | tool_result | session_title | budget_update | done |
|---|---|---|---|---|---|---|---|
| `hi`（零工具） | 20 | 17（首塊長＋逐字） | 0 | 0 | 1（`Greeting`） | 1（window 3%／weekly 1%） | 1 |
| `華碩(2357)本益比多少`（工具輪） | 253 | 240 | 5 | 5 | 1（`華碩2357本益比查詢`） | 1（window 20%／weekly 4%） | 1 |

### 4.2 delta 粒度（工具輪 240 塊，實測分佈）

| 塊長度（字元） | 數量 | 備註 |
|---|---|---|
| 1 | 144 | 主體：逐字（`**華` 除外，首塊 3 字元含 markdown） |
| 2 | 72 | 中英混排塊（` (`、`235` 等） |
| 3 | 20 | — |
| 4 | 2 | — |
| 8 | 2 | 最長塊（表格行片段，推測） |
| 合計字元 | 372（delta join 後長度；history 內 assistant content 全文對應） | 【HAR】 |

hi 輪相反：首塊即整段自我介紹（`您好！我是…整理。\n\n`），之後逐字（`需要`／`查`／`什麼`／`呢`／`？`／`直接`…`。`），共 17 塊【HAR】。工具輪 2–3 字一塊、hi 輪逐字——與長度有關為推測。

### 4.3 budget_update 實測值

| 輪 | window（6h） | weekly | 來源 |
|---|---|---|---|
| hi 輪 SSE | `used_percent:3`，`reset_in_sec:20009`，`reset_at:2026-09-18T12:00:00+00:00` | `used_percent:1`，`reset_at:2026-09-21T00:00:00+00:00` | 【HAR】`biggo-R4-hi-sse.json` |
| 工具輪前 GET | window 11%／weekly 3% | `tier:"logged_in"`，`enabled:true` | 【HAR】`token-budget` |
| 工具輪 SSE 尾 | window 20%／weekly 4%，`reset_in_sec:19762` | 同上 | 【HAR】完整 HAR |
| 後期用量環 | 20%（aria「當前用量 20%」） | — | 【截圖】 |

是否按 token 或次數計費未知。`GET token-budget` RESP 全文形狀：`{"result":true,"data":{"enabled":true,"reset_at":"…","reset_in_sec":19766,"tier":"logged_in","window":{"reset_at":"…","reset_in_sec":19766,"window_hours":6,"used_percent":11},"weekly":{"reset_at":"…","reset_in_sec":235766,"used_percent":3},"used_percent":11}}`【HAR】。

hi 輪 SSE 全文結構（20 chunks，`biggo-R4-hi-sse.json` 實測）：首塊長 delta（`您好！我是 BigGo Finance 助理，…整理。\n\n`）＋16 塊逐字（`需要`／`查`／`什麼`／`呢`／`？`／`直接`／`告訴`／`我`／`股票`／`代`／`號`／`或`／`公司`／`名稱`／`就可以`／`。`）＋`session_title`（`Greeting`）＋`budget_update`＋`done`（`assistant_message_id:<msg>`）。同輪另觸發 `GET history`（回 user `hi`＋assistant 全文，`title:"Greeting"`）與 `POST stock/current/price/list`（前端行情預取，推測與 Agent 無關）【HAR】。

## 5. 工具鏈

2357 輪序列（完整 HAR 實測，10 個工具事件交錯）：

| 序 | 事件 | content | 解讀 |
|---|---|---|---|
| 1 | `tool_calls` | `read_skill` | 路由 skill（先讀技能選路） |
| 2 | `tool_calls` | `es_query` | 財經資料檢索（推測為 Elasticsearch） |
| 3 | `tool_result` | `read_skill` | 回 |
| 4 | `tool_result` | `es_query` | 回 |
| 5 | `tool_calls` | `read_skill` | 二次路由（推測：首輪結果不足再選路） |
| 6 | `tool_result` | `read_skill` | 回 |
| 7 | `tool_calls` | `es_query` | — |
| 8 | `tool_calls` | `es_query` | 連發 2 個（推測：並行查多日／多指標） |
| 9 | `tool_result` | `es_query` | 回 |
| 10 | `tool_result` | `es_query` | 回 |

| 規則 | 實測 |
|---|---|
| 總量 | `tool_calls` ×5＋`tool_result` ×5；工具名僅 `read_skill`、`es_query` 兩種 |
| 參數與結果 | 不進 stream（只有 name；history 只有最終文字） |
| 順序證據 | 先工具、後文字：10 個工具事件全部在 240 個 delta 之前；`session_title` 在 delta 尾、 `budget_update`＋`done` 在最後（§4.1 顺序由 chunk 位置實測） |
| 模式 | read_skill（路由）→ es_query（檢索）→ 生成；寒暄／亂碼輪零工具（見 §6） |

## 6. 四種問答實錄＋回答結構分析

實錄總表：

| 問法 | 工具 | 回答結構 | title | 證據 |
|---|---|---|---|---|
| `hi`（寒暄） | 零（stream 全是 delta＋title＋budget＋done） | 固定自我介紹，繁中敬語「您」；`需要查什麼呢？直接告訴我股票代號或公司名稱就可以。` | `Greeting` | 【HAR】 |
| `台積電(2330)現在多少錢`（行情） | 調工具（body 未錄） | 文字（成交量、收盤時間）＋互動卡：`成交量 約 35,250 張（37,087,655 股）`＋`台股今日 13:30 已收盤。`＋`台積電 (2330.TW)` k 線卡（tabs：`1 天`／`5 天`／`1 個月`／`6 個月`／`YTD`／`1 年`／`5 年`／`最長`，預設 `1 天`；Y 軸 2431.60–2467.20，收盤線 2460.00 紅線，09:00–13:00） | 沒拿到 | 【截圖】`agent3-after-quote.png` |
| `華碩(2357)本益比多少`（估值） | 5＋5（§5） | 答案先行→表格→解讀：粗體答案句「**華碩 (2357) 本益比：13.86 倍**（2026/09/17，當日收盤 948.0 元）」＋ 5 日 markdown 表（日期／收盤／本益比／股價淨值比／殖利率；09/14、09/11 收盤 `—` 仍有估值欄）＋一句解讀「近一週本益比從 13.51 微升至 13.86，主要反映股價由 928 漲到 948。」；UI 渲染為 HTML 表（表頭 `日期`／`收盤`／`本益比`／`股價淨值比`／`殖利率`） | `華碩2357本益比查詢` | 【HAR】＋【截圖】`agent4-after-pe.png` |
| `XYZQ123現在多少錢`（亂碼） | 零工具（推測，截圖輸出反推） | 正常回合、不報錯：教有效格式（台股 4 碼數字如 2330、美股字母如 NVDA）＋請確認代號；工具失敗≠回合失敗的例證 | 沒拿到 | 【截圖】`agent5-gibberish.png`（全站筆記 §5） |
| `跌破2400通知我`（排程，加錄） | 不直接建 task | 兩段式確認：第一句只建會話不建 task（`total:0`），回確認（頻率＋通道，「要一起處理嗎」）；第二句「好，用你的建議」才建成 recurring task（cron 由 Agent 生成：`0 15 * * 1-5`、timezone `Asia/Taipei`、expires 預設＋1 年、target channel biggo、message 條件模板含跌破／未跌破雙分支文案） | 沒拿到 | 【HAR】全站筆記 §5、`biggo-R6-task.json` |

2357 表格全文（history assistant content，實測）：

| 日期 | 收盤 | 本益比 | 股價淨值比 | 殖利率 |
|---|---|---|---|---|
| 2026/09/17 | 948.0 | 13.86 | 2.34 | 4.43% |
| 2026/09/16 | 939.0 | 13.73 | 2.31 | 4.47% |
| 2026/09/15 | 928.0 | 13.57 | 2.29 | 4.53% |
| 2026/09/14 | — | 13.65 | 2.30 | 4.50% |
| 2026/09/11 | — | 13.51 | 2.28 | 4.55% |

日期皆為交易日（含 09/14 週日收盤「—」但仍有估值欄）【HAR】。

### 6.1 回答結構分析（四輪對比）

| 維度 | hi（寒暄） | 2330（行情） | 2357（估值） | XYZQ123（亂碼） |
|---|---|---|---|---|
| 工具呼叫 | 0 | 有（body 未錄） | 5＋5 | 0（推測） |
| 首句 | 自我介紹＋能力清單 | 數據行（成交量＋收盤時間） | 粗體答案句（數字先行） | 格式教學（不報錯） |
| 中段 | 追問句（要代號） | 互動卡（k 線＋tabs） | 5 日 markdown 表 | 有效格式範例（2330／NVDA） |
| 結尾 | 無（等輸入） | 無（卡可自助切換） | 一句解讀（漲跌歸因） | 請確認代號 |
| 語氣 | 繁中敬語「您」 | 陳述句＋已收盤註記 | 陳述＋微升／反映等歸因詞 | 引導式，不用錯誤碼 |
| 互動卡 | 無 | 有（成交量卡＋k 線卡） | 無（純表；截圖為 HTML 表渲染） | 無 |

### 6.2 排程輪（加錄，兩段式確認的證據）

| 句 | Agent 行為 | 後端狀態 | 證據 |
|---|---|---|---|
| 第一句 `跌破2400通知我` | 只回確認（頻率＋通道，「要一起處理嗎」），不建 task | `scheduled-tasks` list `total:0`（只建會話不建 task） | 【HAR】全站筆記 §5 |
| 第二句「好，用你的建議」 | 建成 recurring task | task 物件見下表 | 【HAR】`biggo-R6-task.json` |

task 物件實測欄位：

| 欄位 | 值 |
|---|---|
| `task_type` | `recurring` |
| `action_kind` | `chat_message` |
| `cron` | `0 15 * * 1-5`（自然語言→cron 由 Agent 生成） |
| `timezone` | `Asia/Taipei` |
| `expires_at` | ＋1 年（預設） |
| `target` | `{channel:biggo, label:BigGo Web}` |
| `message` | 條件通知模板（跌破／未跌破雙分支文案） |

後續 toggle（POST 200）→ DELETE（200）→ list 歸零，全生命週期走通【HAR】。

## 7. UI 行為

| 控制項 | 原文／預設 | 行為 | 證據 |
|---|---|---|---|
| onboarding 提示 | 「在此 Agent 視窗中可以直接詢問跟「當前網站頁面」相關的內容」＋「知道了」 | 關掉後才露出輸入框；`page_metadata:{url}` 即此承諾的實現 | 【截圖】＋【HAR】 |
| 輸入框 placeholder | 「問任何問題…」（R4 截圖）／「問任何問題...」（bundle 快照差異，半形省略號，推測同框不同版本） | 底部全寬輸入框 | 【截圖】 |
| 模型選擇 | 「Flash ▾」（下拉選項未點開，沒拿到；pricing 頁證實 Pro／Thinking 存在） | 有 aria「選擇模型，目前為 Flash」 | 【截圖】 |
| 用量環 | 「當前用量 20%」 | 呼應 token-budget 6h 窗口（推測） | 【截圖】 |
| 發送按鈕 | 右下箭頭 ↑（灰色禁用態，空輸入時）；有 aria「送出」 | 有文字後啟用（推測，常見模式） | 【截圖】＋【推測】 |
| 送出鍵 | 浮層內 `問任何問題…`＋↑ 鍵 | 實測 | 【HAR】全站筆記 §2 |
| 頂部搜尋框陷阱 | Enter 在頂部搜尋框只會做站內搜尋（`GET /stock/search/suggest?q=hi`＋搜尋結果頁），不會送 Agent | Agent 送出必須用浮層內輸入框 | 【HAR】全站筆記 §2 |
| 使用者氣泡 | 右側淺綠氣泡（`hi`／`華碩(2357)本益比多少` 實測） | — | 【截圖】 |
| 標題列 6 icon | 由左到右：開新對話、歷史、排程、日曆?／彈出、加寬、關閉 X（hover 無 tooltip、無 aria，語義為推測；僅「加寬視窗」有 aria） | `/agent/c/` 歷史路由存在但未走 | 【截圖】＋【推測】 |
| 空輸入發送 | 灰色禁用（推測未實測點擊） | 沒拿到點擊行為 | 【截圖】 |

## 8. 沒拿到的＋殘留

### 8.1 沒拿到的（沿用全站筆記）

| 項目 | 說明 |
|---|---|
| 頂部 6 icon 的 tooltip／aria | hover、DOM `[role=tooltip]` 皆無；僅「加寬視窗」有 aria；語義維持推測 |
| 工具參數與檢索結果原文 | stream 內只有 name；history 只有最終文字 |
| `Flash ▾` 下拉選項 | 未點開；pricing 頁證實存在 Pro／Thinking |
| Pro／Thinking 切換行為、法說會 30 分鐘搶先牆 | 需 Pro 帳號；免費用戶下拉全鎖定 |
| PATCH 改名、search、activate、regenerate | bundle 有函式，HAR 未觸發 |
| 排程觸發／通知到達 | 建→toggle 關→刪全通；觸發需等到 15:00，未等 |
| 投票／收藏等寫入 | 超出授權範圍，不碰 |
| Podcast 選題標準與更新頻率 | 需長期觀察或官方說法 |

### 8.2 殘留清單（沿用全站筆記）

| 項目 | 狀態 |
|---|---|
| 測試會話 8 個＋排程 task 1 個 | 全數刪除（DELETE／toggle 皆 200，list 驗證歸零）；現存「推薦其他podcast」為使用者原有，未動 |
| 本機 `/tmp/biggo-har/profile` | 含登入態 profile（未追蹤，`/tmp` 重開機消失）；帳密暫存檔已刪；對話內出現過明文密碼，建議更換 |
| `news/view-attest` 瀏覽信標＋用量計數（6h 窗口 3%→20%） | 無需也無法清理 |
| 原始擷取未追蹤 | `.playwright-mcp/biggo-R4-agent.har` 等仅 R1 註記未追蹤；完整版 HAR 在 `/tmp/biggo-har/` 暫存 |
