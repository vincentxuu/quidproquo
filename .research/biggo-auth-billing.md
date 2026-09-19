# BigGo Finance 登入＋計費機制深掘（2026-09-18）

> 對標 Genspark「一機制一檔」深度。只寫輸入有的；cookie／token 值一律不貼，只寫形狀；推測標明。
> 輸入：`.research/2026-09-18-biggo-finance-fullsite-walkthrough.md`（下稱 W）、
> `/tmp/biggo-chunks/__next_static_chunks_5747-d5b12e4de9c37bde.js`（下稱 B-5747）、
> `.playwright-mcp/biggo-R5-l5.har`（下稱 H5）、`.playwright-mcp/agent-model-dropdown.png`（下稱 P-drop）。
> 另引用同站 bundle `9106`／`app_layout` chunk 作計費靜態 corroboration（來源逐條標註，非原輸入清單內）。

證據等級：【E1】HAR 實測／【E2】bundle 靜態／【E3】截圖＋UI 實測／【P】推測。

## 1. 登入流程

### 1.1 觸發點（未登入會撞牆的位置）【E3】

| 位置 | 文案（原文） | 行為 |
|---|---|---|
| `/watchlist` | 「建立觀察清單…」＋「立即登入」按鈕 | 整頁牆，無內容（W §1.1） |
| 個股頁右側「自選」區 | 「登入以建立你的觀察清單 登入」 | 點加入追蹤→被導向登入（W §2） |
| 頂欄 | avatar（登入後才出現）＋「付費方案」按鈕 | P-drop 截圖實測：登入態頂欄有 avatar 下拉 |

### 1.2 帳密登入時間線【E1】

```text
T+0s  點「立即登入」→ 跳轉 https://account.biggo.com（BigGo 共用帳號中心，finance 站外）
T+1s  輸入帳密 → reCAPTCHA 本輪未跳挑戰（W §5）
T+2s  headed chromium 一次過 → 跳回 finance.biggo.com.tw，頂欄出現 avatar（登入態）
```

| 條件 | 結果 | 證據 |
|---|---|---|
| headless 直連登入 | `Access denied` 被擋 | W §5【E1】 |
| headed 帳密登入 | 一次過，無挑戰 | W §5【E1】 |
| 登入後跳轉 | 回原站（`url=location.href` 語義，見 1.3 參數） | 【P】＋【E2】 |

### 1.3 三方登入＝account.biggo.com php 端點（靜態，全為 bundle 內寫死）【E2】

函式 `hC(provider, lang)`（B-5747，模块 27281）：

| provider 參數 | 落點路徑 | 固定參數 |
|---|---|---|
| `google` | `/auth_google2.php` | `login=`（空）＋`url`=當前頁＋`lang`＋`source=web`＋`type=biggo3` |
| `facebook` | `/auth_facebook2.php` | 同上 |
| `apple` | `/auth_apple.php` | 同上 |

- 基址 `https://account.biggo.com`，跳轉方式為 `location.href=` 整頁跳（非 popup／非 OAuth redirect 參數，【P】：`type=biggo3` 疑為 BigGo 第三代帳號體系代號）。
- 帳密登入頁本體：`https://account.biggo.com?url=&lang=&source=web&type=biggo3`（＋可選 `method`），同函式 `s()`。
- 登出函式 `r()`：先清 `sessionStorage[user_session]`，再二選一跳轉——預設 `https://account.biggo.com/logout.php?url=&type=biggo3`，或站內 `/api/logout?url=`（B-5747）。

### 1.4 登入回跳後的狀態同步【E2】

- `login_state` cookie（常數 `pW`，B-5747 模块 82999）：取值 `success／logout／fail`，前端讀到即吐對應 toast（`login_suceess`／`logout_suceess`／`login_fail`，原文拼字照抄，含 `suceess`  typo），`logout／fail` 會清 `sessionStorage`，隨後刪掉該 cookie（`path=/`）。
- 使用者資訊不在 cookie／localStorage（W §3.3）：走 `GET /user/info` 按需取，`sessionStorage[user_session]` 快取 5 分鐘（`__cached_at`，B-5747 模块 45170）。
- 登入判斷 `f()`：`!!BG_AT || !!BG_ATS`（B-5747 模块 51113）——任一存在即視為登入態。

## 2. 憑證四件套＋附帶鍵

### 2.1 Cookie 四件套（Domain `finance…`／Path `/`，值已遮罩，只記形狀）【E3＋E2】

| Cookie | 形狀 | 屬性 | 用途判讀＋證據等級 |
|---|---|---|---|
| `BG_AT` | JWT 三段式（首段解出 `typ:JWT alg:ES256`，約 552 bytes） | Secure＋SameSite Lax，到期 2026（年票等級短命） | **Access Token**＝`Authorization: Bearer` 來源【E2 確認】：B-5747 讀 cookie 常數 `Mo` 直拼 `Bearer `（見 2.3）；H5 登入態 14/14 sparrowhawk 請求全帶 Bearer＋JWT 三段形【E1】 |
| `BG_RT` | 25 字元不透明字串 | Secure＋Lax | **Refresh Token**，供 `/api/v1/spaweb/auth` 用【P】：刷新 `fetch` 未顯式帶參（B-5747），推測靠同源 cookie 自動帶上；未逐包驗證 |
| `BG_SR` | 值 `1` | HttpOnly＋Secure＋Lax（唯一 HttpOnly，JS 讀不到） | 旗標，推測為 session 輪轉記號【P】：語義無靜態對應，沒拿到 |
| `fgp` | 35 hex 字元，到期 2027（長命） | — | 裝置指紋＝`X-Anonymous-User-Id`／`X-Fgp` 優先來源【E2 確認】：B-5747 `u()` 先讀 cookie `fgp`（常數 `AV`），無才 fallback（見 2.2） |

### 2.2 附帶鍵（同一常數表，B-5747 模块 82999）【E2】

| 鍵 | 常數名 | 位置 | 語義 |
|---|---|---|---|
| `BG_ATS` | `q6` | cookie | 第二登入憑證；登入判斷 `BG_AT \|\| BG_ATS`；內容形狀沒拿到 |
| `login_state` | `pW` | cookie | `success／logout／fail` 回跳一次性狀態（見 1.4） |
| `user_session` | `PE` | sessionStorage | `/user/info` 回應＋`__cached_at`，5 分鐘 TTL |
| `fgp` | `AV` | cookie（35 hex） | 見 2.1；匿名 id 第一優先 |
| `biggo_anonymous_id` | `EL` | localStorage | 匿名 id 第二優先；缺失時前端 `random-+crypto.randomUUID()` 生成並寫回 |
| `agent_model_pref` | — | localStorage | `{"model":"flash","thinking":false}`（原文實測，W §3.3）；發話 body 原樣直送後端（W §7.2） |

### 2.3 `Authorization: Bearer` 即 `BG_AT` 的對應證據【E2＋E1】

- 靜態（B-5747，兩處同模板）：一般 API `t=i.A.get(r.Mo); if(t) headers.Authorization="Bearer ".concat(t)`；SSE（Agent）`R()` 同式＋`X-Anonymous-User-Id`＋`Site`。`Mo` 即 `BG_AT`（常數表實測）。
- HAR（H5，14 筆 sparrowhawk 全帶）：sessions 建／list／history／DELETE、message POST×2、token-budget、scheduled-tasks×3——**全部只靠 `Accept＋Authorization: Bearer` 即通**，DELETE 清場 200 即此證明（W §3.2）。
- 反例（R2 匿名）：k-line 等行情請求僅 `Accept: application/json`，**無 Authorization 照樣全數 200**（W §3.5）。

### 2.4 匿名識別雙軌【E2】

| 標頭 | 值來源 | 附加條件（靜態） |
|---|---|---|
| `X-Anonymous-User-Id` | `fgp` cookie → `biggo_anonymous_id` → `random-uuid`（`u()`／`d()`，9106 chunk 模块 92812） | SSE／scheduled-tasks／token-budget 等 Agent 系請求常帶 |
| `X-Fgp` | 同一 `fgp` 值 | **僅白名單路徑**才加：`d=["/news/user/recommendations"]` 前綴匹配（B-5747）；其他端點不帶 |
| `Site` | `location.host` 映射 | 所有 API 請求；`?region=tw` 查詢參數由 host 映射產生（全站每筆皆帶，W §3.2） |

## 3. 刷新與重試

### 3.1 刷新端點：`GET /api/v1/spaweb/auth`（同站相對路徑，非 api.biggo.com）【E2】

- 單飛去重：`window.financeRefreshPromise`，併發刷新共用同一個 promise，結束後清零（B-5747 函式 `h()`）。
- 成功：`result` 為真→等 50ms 回傳（刻意小延遲，原因不明【P】）。
- 三句 warn 原文（照抄，console.warn 實測字串）：

| 情境 | warn 原文 | 後續 |
|---|---|---|
| fetch 本體網路失敗 | `[handleRefreshToken] 刷新請求網路失敗，維持登入` | throw，**維持登入態** |
| 401 或 `reason=expired` | `[handleRefreshToken] 工作階段失效，登出` | 觸發登出 `ri(!1)`＋throw `Session expired, please login again` |
| 其他非 200 | `[handleRefreshToken] 刷新暫時失敗，維持登入` | throw `Token refresh temporarily failed`，**維持登入態** |

- 設計判讀【P】：除「明確過期」外一律維持登入——把誤登出的代價看得比幽靈登入態重。

### 3.2 重試謂詞（B-5747 函式 `u()`，靜態實測）

| 條件 | 行為 |
|---|---|
| 回應 `resStatusCode===429` | **直接不重試**（return false，第一順位） |
| `tokenExpired` 旗標 | 最多重試 **2 次** |
| 其他錯誤 | 最多重試 **1 次** |
| 非 GET 且非 tokenExpired | **不重試**（tokenExpired 是唯一例外，寫入請求也可重打） |
| 退避 | `setTimeout 100ms×(retry+1)` 遞增（100／200／300ms） |
| 重打前 | 若 `tokenExpired` 先 `await h()` 刷新，再以 `__retry+1` 重打同一請求 |

- 與 W §3.4 的出入：W 記「401 → 刷新後重打一次（函式 z）」；靜態顯示刷新僅由 `tokenExpired` 旗標觸發，而 **401 是在刷新端點回來時→登出**（3.1）。兩者並存的合理解釋【P】：401 先被判成 `tokenExpired`（謂詞含 401 分支）走刷新，刷不過（再回 401／expired）才登出。謂詞的 401 分支本輪未完整還原，標待確認。
- SSE 錯誤類原文：`AgentSSEHttpError("Agent SSE request failed: {status} {statusText}")`（W §3.4）。

## 4. 匿名 vs 登入能力表

| 能力 | 匿名 | 登入 | 證據 |
|---|---|---|---|
| 讀新聞／行情／K 線／行事曆／Podcast 清單 | ✅ 全數 200，無需 Authorization | ✅ | W §3.2／§3.5【E1】 |
| Agent 對話（flash） | ✅（`X-Anonymous-User-Id`，額度未知） | ✅（Bearer，`tier:logged_in`） | W §5／§7.5【E1】 |
| 自選股 watchlist | ❌ 整頁「立即登入」牆 | ✅（本輪未建，僅驗牆存在） | W §1.1【E3】 |
| 個股「加入追蹤」 | ❌ 導向登入 | （未測） | W §2【E1】 |
| 排程 tasks CRUD／toggle | ❌ 未觸發（bundle 有端點，需登入【P】） | ✅ 建→toggle→刪全通（cron 由 Agent 生成，`expires_at` 預設 +1 年） | W §5【E1】 |
| 通訊軟體綁定（Telegram／LINE／Slack／Discord） | ❌（`link/code` 需登入【P】） | 未測觸發 | bundle 靜態（W §3.2） |
| `/billing` 帳號選單入口 | ❌（未登入 subscribe_cta 指 `/pricing`） | ✅ 選單有 Billing 圖示＋`/billing` 項；subscribe_cta 指 `/billing/plans` | app_layout chunk 靜態【E2】（輸入清單外，同站 bundle） |
| 模型 Pro／深度思考 | 🔒 下拉可見不可選 | 未測（需 Pro 帳號） | P-drop【E3】 |

## 5. 計費

### 5.1 `/pricing` 三欄全文照抄（W §1.5，webfetch 實測）

| | Free $0 | Pro $20美元/月・$192美元/年（省20%） |
|---|---|---|
| AI 模型 | Flash | Flash、Pro、Thinking 深度思考模式 |
| 主動式排程通知 | 每日 5 次 | 每日 150 次 |
| 通訊軟體連結 | Telegram、LINE、Slack、Discord | 同左 |
| 法說會新聞搶先看 | ❌（"限Pro版方案"） | 提前 30 分鐘搶先看 |
| 廣告 | 有廣告 | 無廣告 |

結帳文案原文：「透過 Stripe 安全結帳 · 支援信用卡 / 簽帳金融卡 · 隨時取消或降級」。

- 判讀【P】：月／年僅兩檔（無季／終身）；年付＝9.6 折標「省20%」是行銷取整（192 vs 240 實為 8 折，20% off 無誤）；排程 5→150 次（30 倍）是 Free／Pro 最陡的差距，Agent 排程即付費槓桿。

### 5.2 訂閱態靜態（9106／app_layout chunk【E2】，輸入清單外、同站 bundle）

| 項目 | 靜態事實 |
|---|---|
| 基路徑 | `/billing/me`（`api.biggo.com／finance` 下，經 `wi()` 發送＝自動帶 Bearer＋region） |
| 端點 | `GET payment-status`／`POST subscription/cancel`／`POST subscription/resume`／`POST subscription/change-plan`（body `{plan_code}`）／`POST checkout-sessions`／`GET payments` |
| 訂閱 context | `plan_code`→`isPro`；`is_active`→`isActive`；`cancel_at_period_end`→`isCanceling`；`scheduled_plan_code`＋`scheduled_change_at`（預約變 plan 語義【P】）；`shouldBlockAds = isPro｜isActive`（付費即去廣告，呼應 5.1） |
| PRO 徽章 | 登入＋`isPro` 時頂欄顯示 `PRO`（`PlanBadge`，`subscribe_cta` 同時隱藏） |
| 帳號選單 | Billing 圖示＋`/billing` 連結（i18n `common:billing`）；用量環「當前用量 20%」為 aria 實測（W §1.2） |

### 5.3 額度 tier（H5＋R4 HAR 實測）【E1】

- `GET .../sparrowhawk/token-budget?region=tw` 回體（H5 實測）：`tier:"logged_in"`，雙窗口——`window{window_hours:6, used_percent}`＋`weekly{used_percent}`，附 `reset_at／reset_in_sec`。
- 實測數字：hi 輪 3% → 工具輪 11%（R4）→ 後期用量環 20% → H5 28%（W §7.5＋H5 resp）。計費單位（token／次數）未知。
- 每輪 SSE 必帶 `budget_update` 事件（6h＋週雙窗口，W §7.3）。

### 5.4 模型下拉三選項（P-drop 看圖照抄）【E3】

| 選項 | 副標（原文） | 狀態 |
|---|---|---|
| Flash | 回覆最快 | ✓ 已選 |
| Pro〔Pro 徽章〕 | 適合複雜回覆 | 🔒 |
| 深度思考〔Pro 徽章〕 | 解決深度問題 | 🔒 |

- 靜態對應（9106 chunk 模块 23350【E2】）：模型表僅兩項——`{id:flash, gate:none}`／`{id:pro, gate:premium}`，預設 `flash`；「深度思考」是 `thinking` 布林旗（localStorage＋發話 body 皆 `{model, thinking}`），其 gate 本輪靜態未見。
- **Pro 功能未測→沒拿到**：Pro／Thinking 切換行為、30 分鐘搶先牆、`/billing` 頁本體、`payment-status` 回體，皆需 Pro 帳號（W 待深入項）。

## 6. 登入態頁面載入成本（R3-authed.har，820 筆中 66 finance calls，upstream 實測）【E1】

頁面順序（document 導航實測）：`/watchlist`(06:21:11，撞牆前）→ 登入 → `/watchlist`×3（06:21:18／22／25）→ `/pricing`（06:21:28）→ `/podcast`（06:21:31）→ `/`（06:21:34）。
group_id 一律遮罩（`v7OOqqAB…`）；`userid` 見 §7.4。

### 6.1 `/watchlist`：每載 15 支 API（×3 輪逐字同形，bytes 完全相同，upstream 小幅浮動）

| API | upstream（3 輪範圍） | 體 | 回包形狀（R3 實測，截短） |
|---|---|---|---|
| `GET stock/favorite/group/list` | 13–20ms | 130 B | `[{"id":"v7OOqqAB…","name":"My Favorite List","currency":null,"is_default":true,"stock_count":5}]`——自選分組（全文） |
| `POST stock/favorite/group/init` | 11–29ms | 78 B | 小包（內容未展開，標沒拿到→§9） |
| `GET stock/favorite/ernings-calls?group_id=` | 38–48ms | 1483 B | 路徑拼字即 `ernings-calls`（缺一 `a`，HAR 原文照抄，後端 typo 固化推測）；`{list:[{call_id:"US_NVDA_2026-08-26",title:"輝達 FY2027 第二季法說會",stock_id:"NVDA",image:"…fit/200…NVDA.png",date,is_liked:false,is_favorited:false}…]}` |
| `GET stock/favorite/calendar?group_id=` | 17–19ms | 34 B | `{"list":[]}`（空） |
| `GET news/favorite/stock/exchange?group_id=` | 20–29ms | 25 B | `[]`（空） |
| `GET stock/favorite/institutional-investors?group_id=` | 12–22ms | 80 B | `{foreign_investor:[],investment_trust:[],dealer:[]}`（三空） |
| `POST stock/change/chart` | 63–76ms | 14731 B | REQ `{"group_id":"v7OOqqAB…","m":"1M"}`；回 `{mode:"1M",stocks:[{stock_id,asset_type,name,image:"…fit/200…",currency,region,interval:"1d",timezone:"UTC",current_price,base_price,previous_close,change,change_percent,…}]}`（走勢圖批量，m 檔位推測） |
| `GET stock/favorite/list?group_id=` | 34–68ms | 3078 B | 自選 5 股明細（GOOG／NVDA／TSLA／SFTBY／SPY，呼應 R5 自選清單，§見 scheduling §2） |
| `GET billing/me/payment-status` | 0–3ms | 272 B | Free 回體見 §7.4（幾乎零成本，實測三輪 0–3ms） |
| `GET stock/related/news?stock_id=GOOG&size=10&page=1&start_date=…&end_date=…` | 103–155ms | 57413 B | 按自選逐股 fan-out（5 連發，日期窗 30 天，實測）；GOOG 最重 |
| `…stock_id=NVDA…` | 79–128ms | 45181 B | 同上 |
| `…stock_id=TSLA…` | 72–120ms | 43439 B | 同上 |
| `…stock_id=SFTBY…` | 40–56ms | 3930 B | 同上（明顯較輕） |
| `…stock_id=SPY…` | 22–52ms | 114 B | `{"total":0,"news_count":0,"major_count":0,"podcast_count":0,"ir_release_count":0,"news":[]}`——空股仍佔一次請求（N+1 形，見 §8） |

→ 單次 watchlist 載入 ≈15 支、≈200KB，牆時由 related/news fan-out 主導（5 股同秒並發，總牆≈最慢者，推測並行；upstream 數字實測）。

### 6.2 `/pricing`：只打 3 支（06:21:28，實測）

`group/list`＋`group/init`＋`payment-status`——定價頁不調業務 API，只確認登入＋訂閱態（推測用途；調用行為實測）。呼應 §4：未登入 `subscribe_cta` 指 `/pricing`，登入態指 `/billing/plans`（靜態）——定價頁本體與計費態解耦。

### 6.3 `/podcast`：5 支（06:21:31，實測）

| API | upstream | 體 | 形狀 |
|---|---|---|---|
| `GET podcast/sources` | 39ms | 77956 B | `{total:94,page:1,size:1000,sources:[{source_id,source_name,count:29,is_followed:false,followed_at:null,image_url:"…fit/160…",description}…]}`——79KB 節目清單（前輪「79KB」即此，互驗）；`fit/160` 第四種尺寸（見 news-content §9-#7） |
| `GET podcast/hot/key-entities?size=8` | 6ms | 3287 B | 同 R2（見 news-content §3.3） |
| `group/list`＋`group/init`＋`payment-status` | 13／29／0ms | — | 每頁標配三件套（見 §8） |

### 6.4 `/`（home）：10 支＋4 枚匿名探針（06:21:33–34，實測）

| API | upstream | 體 | 形狀 |
|---|---|---|---|
| `GET news/user/recommendations` | **248ms** | 14554 B | 全站單包最慢之一；`cursor`＋`variant:"personalized_v1"`（news-content §3 已有；此處 upstream 248ms 實測） |
| `GET news/hot/key-entities` | 6ms | 3207 B | 登入態照打（且帶 Bearer，見 §7.1） |
| `GET news/home/local/hot/list` | 223ms | 8636 B | 同包 R2 側 81ms——同端點耗時浮動大（實測兩值；後端 join 成本推測） |
| `GET news/home/hot/keywords/list` | 16ms | 45572 B | R2 側 46ms（同上，浮動實測） |
| `GET news/stock/list?sort=active｜rise｜fall` | 19／28／27ms | 2619／2599／2240 B | 三榜（news-content §3 互驗） |
| `group/list`＋`group/init`＋`favorite/list`＋`payment-status` | 13／16／40／1ms | — | 標配（favorite/list 本頁才打，watchlist 頁同） |
| 匿名探針 ×4（**無 Bearer**） | 0–2ms | 70–74 B | `GET /finance/scheduled-tasks`、`GET /finance/link/list`、`POST /finance/message`→`code:1`；`GET /finance/user/info`→`code:8`（錯誤包絡見 §7.3；是否為前端探針或走查殘留未定，標推測） |

## 7. request headers 對照＋基礎設施【E1＋P】

### 7.1 三態對照（finance 域：R2 40 筆／R3 66 筆／R5＋R6 29 筆，HAR 實測計數）

| 頭 | R2 匿名瀏覽器 | R3 腳本登入態 | R5／R6 瀏覽器登入態 |
|---|---|---|---|
| `authorization` | 0（全無） | 61 有／5 無（5 無即 §6.4 探針） | 全有（`Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI…`——前綴照抄至此，後段遮罩；與 §2.1 `BG_AT` ES256 形對上） |
| `site` | 0 | 0 | 全有（`finance.biggo.com.tw`，靜態 `Site` 映射互驗） |
| `x-anonymous-user-id` | 0 | 0 | 全有（32 hex，值不貼） |
| `x-doorkeeper-token` | 0 | 0 | 僅 `POST sessions`（見 §7.2） |
| `accept` | `application/json` | 同左 | 同左；`message` POST 用 `text/event-stream`（SSE，實測） |
| `origin`／`referer` | 有 | 有 | 有（`https://finance.biggo.com.tw[/]`） |
| `cookie` | **0** | **0** | **0**（三態 135 筆 finance calls 零 cookie——跨站 `api.biggo.com`＋SameSite Lax 不送，推測；鑑權全靠 Bearer，實測） |

判讀【P】：`site`／`anon-id` 為可選（R3 無之照樣全數 200）——前端便利頭、非鑑權；匿名态三無（§見 news-content §4.3）vs 登入態只多 Bearer（R3 證明 Bearer 即全部差別）。

### 7.2 `x-doorkeeper-token`：只卡建會話（R5／R6 `POST sessions` 獨有，HAR 實測）【E1＋P】

2464B JSON（鍵實測，值只記形狀）：`{challenge_token:"dk_v1.v4.local.…"`（PASETO local token 形，判讀推測）`, solutions:[{nonce,output}…]`（PoW 解，推測）`, client_signals:{v:1, env:{navigator:{language:"zh-TW",languages_count,hardware_concurrency:12,device_memory,…}}}}`。
`message`／`toggle`／`DELETE` 全不帶（R5／R6 29 筆其餘全無，實測）——bot 挑戰只守建會話入口（建會話是濫用入口，推測）。

### 7.3 response headers：與 R2 同源＋登入態特有【E1】

- 通用：`server: istio-envoy`＋`x-envoy-upstream-service-time`＋`zstd`＋精確源 CORS（全文見 news-content §8，不重貼）。
- SSE 特有（R5／R6 `message`）：`cache-control: no-cache`＋`x-accel-buffering: no`＋`x-request-id`（代理不緩衝串流，實測）。
- 錯誤包絡（R3 §6.4 探針，原文照抄）：`{"result":false,"error":{"code":1,"message":"Please use correct method."}}`（GET 打 POST-only 路徑：`/finance/scheduled-tasks`、`/finance/link/list`、`/finance/message`——注意**無 `sparrowhawk` 前綴**，與 bundle 真徑不同，見下）／`{"result":false,"error":{"code":8,"message":"Failed authentication."}}`（無 Bearer 打 `user/info`）。
- 保守聲明【P】：R3 探針是裸前綴路徑，bundle `O()` 的 `GET /link/list` 掛在 `sparrowhawk` 下——`code:1` 不能證偽 bundle 真徑；§9「`link/*` 未觸發」結論不變。

### 7.4 `user/info`＋`payment-status` 全文（R3 登入態，id 遮罩）【E1】

`GET user/info`（217 B，200，upstream 5ms）：`{"result":true,"data":{"name":"V…（已遮罩）","image":"（Google avatar URL，略）","at_userid":"@i…（已遮罩）","userid":"ivaOqqAB…（已遮罩）"}}`——Google 三方登入用戶（呼應 §1.3 `auth_google2.php`，推測）。
`GET billing/me/payment-status`（272 B，200，upstream 0–5ms，共 6 筆逐字相同）：

```json
{"result":true,"data":{"user_id":"ivaOqqAB…","is_active":false,"status":"none","plan_code":null,"cancel_at_period_end":false,"current_period_start":null,"current_period_end":null,"scheduled_plan_code":null,"scheduled_plan_name":null,"scheduled_change_at":null}}
```

→ Free 用戶基線（與 app_layout 靜態欄位逐一對上：`is_active→isActive:false`、`plan_code null→isPro:false`，故 PRO 徽章不顯示＋`shouldBlockAds=false` 有廣告，推測呼應；§9「`payment-status` 回體沒拿到」現改為「Free 回體已拿，Pro 回體仍缺」）。

## 8. 設計觀察（R3＋R5／R6 pin 下來的）【E1＋P】

| # | 觀察 |
|---|---|
| 1 | **Bearer 即 BG_AT**：R5／R6 前綴 `eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI` 與 §2.1 cookie 解碼（`typ:JWT alg:ES256`）對上（實測對應，值遮罩）；R3 腳本只帶 Bearer 即全通（實測） |
| 2 | **region 參數**：135 筆 finance calls 筆筆 `?region=tw`（實測）；`vary: Site` 佐證由 host 映射（推測，見 news-content §8） |
| 3 | **圖片代理簽名 POST**：`text/plain` 發 JSON（規避 preflight 推測）＋`{success,cached,取色,深淺兩套背景建議}`（全文見 news-content §6，不重貼） |
| 4 | **公開端點登入態也帶 Bearer**：R3 的 news 三件套全 `A=`（§6.4 實測）——後端對公開端點忽略 auth（推測；R2 證明無之亦 200） |
| 5 | **錯誤碼分級**：`code:1` 方法錯 vs `code:8` 鑑權錯（兩例原文實測；更多 code 未見，標沒拿到→§9） |
| 6 | **`ernings-calls` 拼字**：HAR 原文缺 `a`（實測照抄；後端 typo 固化推測——改路徑會斷舊版，故將錯就錯，推測） |
| 7 | **favorite 即 watchlist 後端名**：`favorite/*`＝自選股（group 先 `list` 後 `init` 固定二人轉，每頁必打，6 輪實測；`init` 78B 內容未展開→§9） |
| 8 | **related/news 按自選逐股 fan-out**：5 股各一發，空股（SPY `total:0`）仍佔一次（實測）——N+1 形，自選 expansion 即成本（推測；watchlist 最貴即此） |
| 9 | **payment-status 是登入態頁面標配**：watchlist×3／pricing／podcast／home 各至少一次（6 筆實測，0–5ms 近零成本）——PRO 徽章＋去廣告判定的每頁門票（推測，呼應靜態 `shouldBlockAds`） |

## 9. 沒拿到的＋殘留

### 9.1 沒拿到的（2026-09-18 補充後更新）

| 項目 | 卡點 |
|---|---|
| Pro／Thinking 切換、`法說會 30 分鐘搶先`牆 | 免費用戶下拉全鎖定，需 Pro 帳號 |
| `/billing` 頁內容、`checkout-sessions` 流程、**Pro 的** `payment-status` 回體 | Free 回體已拿（§7.4）；Pro 態需訂閱帳號 |
| `POST stock/favorite/group/init` 78B 回體內容 | 未展開（§6.1） |
| 更多 `error.code`（僅見 1／8） | R3 探針只撞出兩例（§7.3） |
| `BG_RT` 實際使用方式 | 刷新 fetch 無顯式參數，cookie 自動帶為推測，未逐包驗證 |
| `BG_SR=1` 語義、`BG_ATS` 內容 | 無靜態對應 |
| 登出後各 cookie 是否清除 | 未測 |
| 頂部 6 icon tooltip／aria（僅「加寬視窗」有 aria） | DOM 無資訊，語義維持推測（W） |
| 401→`tokenExpired` 謂詞分支 | 靜態未完整還原（見 3.2） |
| `zh_TW` locale 包內容 | B-5747 僅見語言包 manifest（`agent／billing／watchlist／quote…json` 檔名＋chunk 號），文案本體為 lazy chunk，未下載 |

### 9.2 殘留清單（W 實測，照錄）

- 測試會話 8 個＋排程 task 1 個**全數刪除**（DELETE／toggle 皆 200，list 驗證歸零）；現存「推薦其他podcast」為使用者原有，未動。
- 本機 `/tmp/biggo-har/profile` **含登入態 profile**（未追蹤，`/tmp` 重開機消失）；帳密暫存檔已刪。
- ⚠️ 對話內出現過**明文密碼，建議更換密碼**。
- 測試期間觸發的 `news/view-attest`（站方瀏覽信標）與用量計數（6h 窗口 3%→28%），無需也無法清理。

## 10. 一句話結論

登入是「BigGo 共用帳號中心＋四 cookie（BG_AT Bearer／BG_RT／BG_SR／fgp）＋同站刷新端點」三件套，失敗語義偏向維持登入；變現是「Flash 免費＋Pro／Thinking 雙鎖＋排程 5→150 次＋Stripe 結帳」四件套，額度以 `tier:logged_in`＋6h／週雙窗口計量——Pro 牆後（Pro 回體／Thinking／搶先牆／checkout）一律沒拿到，需 Pro 帳號再探。本輪新增：登入態頁面成本（watchlist 15 支／pricing 3 支／podcast 5 支／home 10＋4 探針，§6）、三態 headers 對照（Bearer 即全部差別，§7.1）、建會話獨佔 PoW（§7.2）、錯誤包絡 code 1／8（§7.3）、Free 的 `payment-status`＋`user/info` 全文（§7.4)。
