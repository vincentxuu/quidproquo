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
| 排程要求 v1（R5） | `台積電股價跌破2400通知` | 同事件 | 【HAR】 |
| 排程要求 v2（R6，同義換字） | `台積電跌破2400通知`（與 v1 同義不同字，命名非模板化，推測 LLM 生成） | 同事件 | 【HAR】＋【推測】 |
| XYZQ 輪（同會話第二輪） | 無命名事件，沿用 `台積電股價跌破2400通知` | 該輪 SSE 無 `session_title` | 【HAR】 |
| 確認建成輪（同會話第二輪） | 無命名事件，沿用 `台積電跌破2400通知` | 同上 | 【HAR】 |
| abort 中斷輪 | `Untitled`（命名事件沒來得及發） | 無 `session_title` 事件 | 【HAR，R5】 |
| 建會話當下 | `name:null` | 命名是後續 SSE 事件，非建會話回應 | 【HAR】 |

### 2.4 abort 後狀態（R5-l5 entry 160–166，`/tmp/biggo-har/biggo-R5-l5.har` 實測）

| 項目 | 實測 | 證據 |
|---|---|---|
| 中斷輪 REQ | `POST /sparrowhawk/message` `{"message":"比較台積電、聯發科、廣達近四季的營收與毛利率趨勢，並給出結論","session_id":"<session>","page_metadata":{"url":"https://finance.biggo.com.tw/"},"model":"flash","thinking":false}`（06:37:44.449 同形） | 【HAR】 |
| 中斷輪 RESP | body 空（stream 被切斷，HAR `time:72ms`） | 【HAR】 |
| 中斷端點 | `POST /sparrowhawk/sessions/<session>/abort`（無 body）→ 200 `{"result":true,"data":{"aborted":true}}`（06:37:49.527，中斷輪發起後約 5.1s） | 【HAR】 |
| history 殘留全文 | `title:"Untitled"`；messages＝user 原文＋`{"role":"assistant","content":"","aborted":true}`（空 content＋`aborted` 旗標原文） | 【HAR】entry 165 |
| 額度側證 | abort 後 `GET token-budget` window 28%／weekly 5%（中斷輪不產生 budget 事件，用量照算，推測） | 【HAR】entry 166＋【推測】 |
| UI | 靜默：輸入框恢復可送，無錯誤文案（截圖 `stop-after.png`） | 【截圖】全站筆記 §5 |
| 前端處理 | `AbortError` 靜默結束（bundle：`if("AbortError"===e.name)return`，不進 onError） | 【靜態】 |
| 無 `done` 即未完成 | abort 輪 SSE 無 `done` 事件 | 【HAR】 |

## 3. 發話協議

四輪 REQ 同形（hi／2357／排程要求／中斷前），全文並排（session id 已遮罩；hi 輪 REQ 未錄到——capture 起於 06:30:29，hi 輪發生在 06:26——下表 hi 欄按同形推測，標【推測】，其餘三欄為 HAR 原文）：

| 欄位 | hi（推測） | 2357（R4 entry 153） | 排程要求（R6 entry 2） | 中斷前（R5 entry 161） |
|---|---|---|---|---|
| `message` | `hi` | `華碩(2357)本益比多少` | `如果台積電(2330)收盤價跌破2400元，請通知我` | `比較台積電、聯發科、廣達近四季的營收與毛利率趨勢，並給出結論` |
| `session_id` | `<session>`（d420…） | `<session>`（4a29…） | `<session>`（116b…） | `<session>`（14ef…） |
| `page_metadata.url` | `https://finance.biggo.com.tw/`（推測） | `https://finance.biggo.com.tw/` | `https://finance.biggo.com.tw/` | `https://finance.biggo.com.tw/` |
| `model` | `flash`（推測） | `flash` | `flash` | `flash` |
| `thinking` | `false`（推測） | `false` | `false` | `false` |

結論：五個欄位四輪完全一致；`page_metadata.url` 三輪實測皆為首頁（實測全程未離開首頁，換頁是否跟著變沒測到）【HAR】＋【推測】。

2357 輪 REQ 全文（代表形，id／URL 已遮罩）：

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

### 4.1 全輪 chunk 統計（完整 HAR 實測）

| 輪 | 總 chunks | delta | tool_calls | tool_result | session_title | budget_update | done | 特殊 |
|---|---|---|---|---|---|---|---|---|
| `hi`（寒暄，R4-hi-sse.json） | 20 | 17 | 0 | 0 | 1（`Greeting`） | 1（window 3%／weekly 1%） | 1 | 首塊長 delta |
| `華碩(2357)本益比多少`（R4 entry 153） | 253 | 240 | 5 | 5 | 1（`華碩2357本益比查詢`） | 1（window 20%／weekly 4%） | 1 | 工具全在 delta 前 |
| 排程要求 v1（R5 entry 154） | 201 | 194 | 2 | 2 | 1（`台積電股價跌破2400通知`） | 1（window 31%／weekly 5%） | 1 | 工具 `finance_favorite_groups`＋`list_my_channels`；首 delta 為英文前導句 |
| `XYZQ123現在多少錢`（亂碼，R5 entry 160） | 167 | 155 | 5 | 5 | 0（沿用既有 title） | 1（window 40%／weekly 6%） | 1 | 有工具！`read_skill`×3＋`es_query`×2（§6 原文「零工具」為誤判，截圖反推錯誤，HAR 為準） |
| 排程要求 v2（R6 entry 154） | 203 | 198 | 1 | 1 | 1（`台積電跌破2400通知`） | 1（window 44%／weekly 7%） | 1 | 工具僅 `list_my_channels` |
| 確認建成（R6 entry 159） | 143 | 138 | 1 | 1 | 0（沿用） | 1（window 47%／weekly 7%） | 1 | 工具 `schedule_task`＋新事件 `schedules_updated`（全文見 §6.2） |
| 中斷輪（R5 entry 161） | 0（stream 被 abort 切斷，HAR body 空） | 0 | 0 | 0 | 0 | 0 | 0（無 `done` 即未完成） | abort 後 history 留空 content＋`aborted` 旗（見 §2.4） |

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

### 4.3 budget_update 實測值（全天 progression，window 6h／weekly 雙軌）

| 時點 | window used | weekly used | 來源 |
|---|---|---|---|
| hi 輪 SSE 尾 | 3%，`reset_in_sec:20009` | 1% | 【HAR】`biggo-R4-hi-sse.json` |
| 工具輪前 GET（06:30:32） | 11%，`reset_in_sec:19766` | 3% | 【HAR】`token-budget`（R4 entry 142） |
| 2357 輪 SSE 尾 | 20%，`reset_in_sec:19762` | 4% | 【HAR】R4 entry 153 |
| abort 後 GET（06:37:49） | 28% | 5% | 【HAR】R5-l5 entry 166（中斷輪本身無 budget 事件） |
| R5 排程要求輪 SSE 尾 | 31%，`reset_in_sec:18964` | 5% | 【HAR】R5 entry 154 |
| XYZQ 輪 SSE 尾 | 40%，`reset_in_sec:18918` | 6% | 【HAR】R5 entry 160 |
| R6 排程要求輪 SSE 尾 | 44%，`reset_in_sec:18689` | 7% | 【HAR】R6 entry 154 |
| R6 確認建成輪 SSE 尾 | 47%，`reset_in_sec:18648` | 7% | 【HAR】R6 entry 159 |
| 後期用量環 | 20%（aria「當前用量 20%」） | — | 【截圖】（與 SSE 尾 20% 同值，呼應 6h 窗口，推測） |

是否按 token 或次數計費未知。`reset_at` 恆為 `2026-09-18T12:00:00+00:00`（window）／`2026-09-21T00:00:00+00:00`（weekly）；`window_hours:6`、`tier:"logged_in"`、`enabled:true` 全天不變。每輪 SSE 必帶 1 個 `budget_update`（中斷輪除外——stream 被切斷拿不到）。

`GET token-budget` RESP 全文形狀：`{"result":true,"data":{"enabled":true,"reset_at":"…","reset_in_sec":19766,"tier":"logged_in","window":{"reset_at":"…","reset_in_sec":19766,"window_hours":6,"used_percent":11},"weekly":{"reset_at":"…","reset_in_sec":235766,"used_percent":3},"used_percent":11}}`【HAR】。

### 4.4 hi 輪 SSE 全文（20 chunks 短，全貼，`biggo-R4-hi-sse.json` 實測，session id 遮罩）

delta 區（17 塊，依序）：

| # | delta 原文 | # | delta 原文 |
|---|---|---|---|
| 1 | `您好！我是 BigGo Finance 助理，可以幫您查詢台股、美股、日股的行情、財報、月營收、股利、法說會等資訊，也能做簡單的比較和整理。\n\n`（首塊長，一次給整段自我介紹） | 10 | `股票` |
| 2 | `需要` | 11 | `代` |
| 3 | `查` | 12 | `號` |
| 4 | `什麼` | 13 | `或` |
| 5 | `呢` | 14 | `公司` |
| 6 | `？` | 15 | `名稱` |
| 7 | `直接` | 16 | `就可以` |
| 8 | `告訴` | 17 | `。` |
| 9 | `我` | | |

尾三事件全文：

```json
{"type": "session_title", "session_id": "<session>", "name": "Greeting"}
{"type": "budget_update", "reset_at": "2026-09-18T12:00:00+00:00", "window": {"reset_at": "2026-09-18T12:00:00+00:00", "reset_in_sec": 20009, "window_hours": 6, "used_percent": 3}, "weekly": {"reset_at": "2026-09-21T00:00:00+00:00", "reset_in_sec": 236009, "used_percent": 1}, "used_percent": 3}
{"session_id": "<session>", "assistant_message_id": "<msg>", "done": true}
```

同輪另觸發 `GET history`（回 user `hi`＋assistant 全文，`title:"Greeting"`）與 `POST stock/current/price/list`（前端行情預取，推測與 Agent 無關）【HAR】。

### 4.5 2357 輪 SSE 全文節選（253 chunks，R4 entry 153 實測，session id 遮罩）

工具區 10 塊全文（stream 開頭，delta 之前）：

```json
{"session_id": "<session>", "type": "tool_calls", "content": [{"name": "read_skill"}]}
{"session_id": "<session>", "type": "tool_calls", "content": [{"name": "es_query"}]}
{"session_id": "<session>", "type": "tool_result", "content": {"name": "read_skill"}}
{"session_id": "<session>", "type": "tool_result", "content": {"name": "es_query"}}
{"session_id": "<session>", "type": "tool_calls", "content": [{"name": "read_skill"}]}
{"session_id": "<session>", "type": "tool_result", "content": {"name": "read_skill"}}
{"session_id": "<session>", "type": "tool_calls", "content": [{"name": "es_query"}]}
{"session_id": "<session>", "type": "tool_calls", "content": [{"name": "es_query"}]}
{"session_id": "<session>", "type": "tool_result", "content": {"name": "es_query"}}
{"session_id": "<session>", "type": "tool_result", "content": {"name": "es_query"}}
```

delta 首 5 塊：`"**華"`／`"碩"`／`" ("`／`"235"`／`"7"`；delta 尾 5 塊：`"漲"`／`"到"`／`" "`／`"948"`／`"。"`。中間 230 塊為文字續寫（逐字＋2–3 字塊，例 `d[10:15]=：／13／.／86／空格`、`d[100:105]=／／16／空格＋|／空格／939`，表格行片段），不再逐貼——240 塊 join 後 372 字元與 history 內 assistant content **逐字相等**（python 比對 `JOIN==HIST: True`）【HAR】。

尾三事件全文：

```json
{"type": "session_title", "session_id": "<session>", "name": "華碩2357本益比查詢"}
{"type": "budget_update", "reset_at": "2026-09-18T12:00:00+00:00", "window": {"reset_at": "2026-09-18T12:00:00+00:00", "reset_in_sec": 19762, "window_hours": 6, "used_percent": 20}, "weekly": {"reset_at": "2026-09-21T00:00:00+00:00", "reset_in_sec": 235762, "used_percent": 4}, "used_percent": 20}
{"session_id": "<session>", "assistant_message_id": "<msg>", "done": true}
```

### 4.6 回應時間線（HAR `startedDateTime`＋`time` 實測）

| 輪 | message 發起（UTC） | HAR `time`（總耗時） | history 回讀 | 首字時間 |
|---|---|---|---|---|
| hi | 06:26:31 前後（history `created_at`） | 無（capture 起於 06:30:29，沒錄到） | 有（`title:"Greeting"`） | 未知 |
| 2357 | 06:30:37.195 | 7000ms | 06:30:44.202（＋7.0s，對得上） | 未知（HAR 只記整筆 time，無逐塊時間；工具 10 事件在前，首字必在工具完成後，推測） |
| R5 排程要求 | 06:43:55.645 | 4510ms | 06:44:00.162（＋4.5s） | 同上未知 |
| XYZQ 亂碼 | 06:44:41.753 | 7152ms | 06:44:48.910（＋7.2s） | 同上未知 |
| R6 排程要求 | 06:48:30.416 | 4226ms | 06:48:34.649（＋4.2s） | 同上未知 |
| R6 確認建成 | 06:49:10.938 | 3379ms | 06:49:14.322（＋3.4s） | 同上未知 |
| 中斷輪 | 06:37:44.449（`time:72ms`，stream 被切斷） | — | abort 06:37:49.527 → Abort 前等待約 **5.1s** | 無（一個 delta 都沒回來） |

規律：有工具輪 4.2–7.2s；確認建成輪最快（3.4s，工具僅 `schedule_task` 一組）；history 回讀一律緊跟 stream 結束（差值≈`time`），可作 stream 結束的側證【HAR】。

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
| 模式 | read_skill（路由）→ es_query（檢索）→ 生成；寒暄零工具；亂碼輪照調工具（讀完才說查無，先查後否定）；排程輪調通道／自選／建 task 類工具 |

## 6. 六種問答實錄＋跨情境對照

跨情境對照表（證據等級見末欄；id 一律遮罩）：

| # | 情境 | 工具（calls＋results） | delta 數 | title（命名事件） | 額度變化（window／weekly） | 特殊事件 |
|---|---|---|---|---|---|---|
| 1 | `hi`（寒暄） | 0＋0 | 17（首塊長＋逐字） | `Greeting` | 3%／1% | 固定自我介紹，繁中敬語「您」【HAR】 |
| 2 | `台積電(2330)現在多少錢`（行情） | 有（body 未錄，截圖反推） | 未錄 | 沒拿到 | 未錄 | 文字＋互動卡：成交量卡＋k 線卡（tabs 1天／5天／1個月／6個月／YTD／1年／5年／最長，預設1天；Y軸2431.60–2467.20，收盤線2460.00）【截圖】 |
| 3 | `華碩(2357)本益比多少`（估值） | 5＋5（`read_skill`×2、`es_query`×3 calls） | 240 | `華碩2357本益比查詢` | 11%→20%／3%→4% | 答案先行→表格→解讀；delta join＝history 全文（§4.5）【HAR】 |
| 4 | `XYZQ123現在多少錢`（亂碼） | 5＋5（`read_skill`×3、`es_query`×2 calls；读完才說查無） | 155 | 無（沿用 `台積電股價跌破2400通知`） | 31%→40%／5%→6% | 先檢索後否定：查無才教有效格式（台股4碼如2330、美股字母如NVDA）＋追問公司名稱；同輪末尾追認排程確認（「要一起處理嗎」）【HAR】 |
| 5 | 排程要求（`跌破2400通知我`，R5 v1／R6 v2） | v1：2＋2（`finance_favorite_groups`＋`list_my_channels`）；v2：1＋1（僅 `list_my_channels`） | v1：194／v2：198 | v1 `台積電股價跌破2400通知`／v2 `台積電跌破2400通知`（同義不同字，命名非模板化，推測 LLM 生成） | v1：→31%／5%；v2：→44%／7% | 兩段式確認第一段：只查通道＋自選、不建 task（`scheduled-tasks` list `total:0`）；v1 首 delta 為英文前導句（`I'll set up a price alert…`，中英混排）【HAR】 |
| 6a | 中斷（`比較台積電、聯發科、廣達…`，發起後 5.1s abort） | 0（stream 被切斷） | 0 | `Untitled`（命名事件沒來得及發） | 無事件（abort 後 GET：28%／5%） | `abort`→`{"aborted":true}`；history 留空 content＋`aborted`旗；無 `done`【HAR】 |
| 6b | 確認建成（`好，就用你的建議…`，R6 entry 159） | 1＋1（`schedule_task`） | 138 | 無（沿用） | 44%→47%／7%→7%（weekly 不動） | 新事件 `schedules_updated`（見 §6.2 全文）；task 建成（cron `0 15 * * 1-5`，見下表）【HAR】 |

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

| 維度 | hi（寒暄） | 2330（行情） | 2357（估值） | XYZQ123（亂碼） | 排程要求 | 確認建成 |
|---|---|---|---|---|---|---|
| 工具呼叫 | 0 | 有（body 未錄） | 5＋5 | 5＋5（讀完才說查無） | v1: 2＋2／v2: 1＋1 | 1＋1（`schedule_task`） |
| 首句 | 自我介紹＋能力清單 | 數據行（成交量＋收盤時間） | 粗體答案句（數字先行） | 查無宣告（不報錯） | 確認句（頻率＋通道） | `已設好。` |
| 中段 | 追問句（要代號） | 互動卡（k 線＋tabs） | 5 日 markdown 表 | 有效格式範例（2330／NVDA） | 頻率選項／自選提醒 | 條件＋頻道＋首次執行提醒 |
| 結尾 | 無（等輸入） | 無（卡可自助切換） | 一句解讀（漲跌歸因） | 請確認代號＋追認排程 | 反問確認（「可以嗎」） | 改動邀請（「跟我說一聲就好」） |
| 語氣 | 繁中敬語「您」 | 陳述句＋已收盤註記 | 陳述＋微升／反映等歸因詞 | 引導式，不用錯誤碼 | 中英混排（v1 首句英文） | 陳述＋提醒 |
| 互動卡 | 無 | 有（成交量卡＋k 線卡） | 無（純表；截圖為 HTML 表渲染） | 無 | 無 | 無 |

### 6.2 排程輪（兩段式確認的證據，R6 entry 154／159＋scheduled-tasks）

| 句 | Agent 行為 | 後端狀態 | 證據 |
|---|---|---|---|
| 第一句 `如果台積電(2330)收盤價跌破2400元，請通知我` | 只調 `list_my_channels`（v2；v1 另調 `finance_favorite_groups` 查自選），回確認（固定時間查價、兩個做法、自選提醒、2400 數字質疑），不建 task | `scheduled-tasks` list `total:0` | 【HAR】R6 entry 154、history entry 3 |
| 第二句「好，就用你的建議：每個交易日收盤後檢查一次，通知發到 BigGo Web」 | 調 `schedule_task` 建成 recurring task；SSE 帶新事件 `schedules_updated` | task 物件見下表 | 【HAR】R6 entry 159 |

`schedules_updated` 事件全文（第 6 種 SSE 事件，§4 只列 5 種，此為排程建成輪獨有）：

```json
{"session_id": "<session>", "type": "schedules_updated"}
```

位置在 `tool_result(schedule_task)` 之後、首個 delta（`已`）之前；無 payload（task 詳情靠 `GET scheduled-tasks` 另查）【HAR】。

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
| `news/view-attest` 瀏覽信標＋用量計數（6h 窗口 3%→47%，見 §4.3） | 無需也無法清理 |
| 原始擷取未追蹤 | `.playwright-mcp/biggo-R4-agent.har` 等仅 R1 註記未追蹤；完整版 HAR 在 `/tmp/biggo-har/` 暫存 |

## 9. 設計觀察（跨 §2–§6 的規律，證據等級逐條標）

| # | 觀察 | 證據 |
|---|---|---|
| 1 | **先工具、後文字**：凡調工具的輪，全部 `tool_calls`／`tool_result` 在前、delta 在後，無交錯（2357：10 工具事件→240 delta；R5 排程：4 工具事件→194 delta，且首 delta 是英文前導句，工具結果先被「翻譯」成開場白，推測） | 【HAR】＋【推測】 |
| 2 | **工具名去參數化**：stream 內 `tool_calls` 只有 `content:[{name}]`、`tool_result` 只有 `content:{name}`，無 args、無結果原文；history 也只留最終文字。第三方想從 stream 還原「查了什麼、查到什麼」不可能，排程建成細節得另調 `scheduled-tasks` | 【HAR】 |
| 3 | **兩段式排程確認**：建 task 必須等使用者第二句明確同意；第一句無論怎麼寫（`請通知我`）都只回確認、不建（`total:0` 實測）。`schedule_task`＋`schedules_updated` 只出現在確認輪 | 【HAR】 |
| 4 | **abort 留痕**：中斷不靜默丟棄——history 留一條空 content assistant 訊息＋`"aborted":true` 旗標、title 停在 `Untitled`；前端 `AbortError` 靜默返回，兩端都不報錯 | 【HAR】＋【靜態】 |
| 5 | **用量事件每輪必帶**：每個正常結束的 SSE 尾巴都有 `budget_update`（window 6h＋weekly 雙軌，`reset_at` 恆定）；`done`＋`assistant_message_id` 是結束唯一信號，無 `done` 即未完成。前端用量環讀的應是同一數字（20% 對得上，推測） | 【HAR】＋【推測】 |
| 6 | **命名是 LLM 生成非模板**：同義排程要求兩次命名不同字（`台積電股價跌破2400通知` vs `台積電跌破2400通知`）；問句壓縮去括號加尾綴（`華碩(2357)本益比多少`→`華碩2357本益比查詢`）；寒暄固定 `Greeting`；命名事件在 delta 尾、budget 之前 | 【HAR】 |
| 7 | **亂碼先查後否定**：`XYZQ123` 照走 `read_skill`×3＋`es_query`×2（10 工具事件），讀完才說查無——無效代號不走捷徑拒答，而是檢索證偽後才教格式；且同輪末尾主動追認未完成的排程（多輪上下文保持） | 【HAR】 |
| 8 | **delta 即全文**：2357 輪 240 塊 join 與 history assistant content 逐字相等；SSE 是唯一真相來源，history 只是落盤版（`created_at` 兩條訊息同值，無逐塊時間） | 【HAR】 |
