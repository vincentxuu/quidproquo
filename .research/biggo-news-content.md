# BigGo Finance 新聞內容管線 Deep-dive（2026-09-18）

> 來源：`.research/2026-09-18-biggo-finance-fullsite-walkthrough.md`（§1.4、§1.6、§3.2、§4、§6）、
> `.research/2026-09-16-biggo-finance-podcast-ai-teardown.md`（前輪 podcast）、
> `.playwright-mcp/biggo-R2-news-list-1.json`（`GET .../news/list?limit=1` 回應全文）、
> `.playwright-mcp/biggo-R2.har`（53 筆裁剪版）＋ `/tmp/biggo-har/biggo-R2.har`（935 筆完整版）、`/tmp/biggo-har/biggo-R3-authed.har`。
> 條件：匿名未登入真瀏覽器（headless chromium）＋登入態 R3 交叉；base 皆為 `https://api.biggo.com/api/v1/finance`，每筆皆帶 `?region=tw`。
> id 一律遮罩（僅留前 8 碼）；直接引文皆為原文照抄。

## 1. 定位：AI 內容管線，不是新聞站

BigGo Finance 的新聞不是轉載通訊社電文，而是一條 **AI 內容產出管線**：以外語財經來源為原料，產出中文結構化全文（Summary＋Content 長文＋Keywords＋key_entities＋關聯 quote chips），免費開放閱讀，變現靠 Pro 方案的 AI 對話、排程通知與法說會搶先看（見 walkthrough §1.5）。

核心設計只有一句話：**同一 id，雙檢視**。`a7724b8f…` 同時存在 `/news/a7724b8f…` 與 `/podcast/a7724b8f…` 兩種路由、內容高度重疊（webfetch 對讀實測）——「一次 AI 產出、兩種檢視模式」。news 偏「快訊＋全文」，podcast 偏「外語轉譯＋結構化筆記」（walkthrough §6 原文）。

前輪 podcast 筆記的結論可濃縮為一段：Podcast AI 摘要是把英語頂級財經節目自動轉成高品質中文結構化筆記的免費流量入口，摘要品質（主題段落＋表格＋引述＋未解矛盾）遠超同類工具的段落式摘要，策略是降低語言門檻→導流到個股頁→自選股→通知→Pro；競品全景（含 Podwise／BibiGPT／Snipd 等直接競品九宮格與分群矩陣）全文見 `.research/2026-09-16-biggo-finance-podcast-ai-teardown.md` §4–§5，本篇不再展開。

### 1.1 內容飛輪（前輪 §3.1 濃縮，實測＋推測已標）

```text
英語財經 Podcast／外電（原料）
  → ASR＋LLM 結構化＋中文化（管線，模型未公開）
  → /news 全文＋/podcast 筆記（雙檢視，實測）
  → 搜尋流量＋站內個股頁導流（推測）
  → 自選股（需登入，實測）→ 排程通知 → Pro $20/月（實測，見下表）
```

變現對照（`/pricing` 實測，全文見 walkthrough §1.5）：

| | Free $0 | Pro $20/月・$192/年 |
|---|---|---|
| AI 模型 | Flash | Flash、Pro、Thinking 深度思考模式 |
| 主動式排程通知 | 每日 5 次 | 每日 150 次 |
| 法說會新聞搶先看 | ❌（"限Pro版方案"，原文） | 提前 30 分鐘搶先看 |
| 廣告 | 有廣告 | 無廣告 |

結帳文案原文：「透過 Stripe 安全結帳 · 支援信用卡 / 簽帳金融卡 · 隨時取消或降級」。新聞／Podcast 本體免費——它是 content marketing，不是商品（前輪結論，本輪價格表佐證）。

## 2. 新聞物件詳解（17 欄逐欄）

樣本：`.playwright-mcp/biggo-R2-news-list-1.json`（档名像 `limit=1`，內容實為第一頁 **20 則**，以內容為準；`total:10000`，`stock_ids` 51 個、`all_stocks_to_query` 54 個皆有值，見 §2.1）。
首則 id `a75574c6…`，標題「巴西低所得補助調漲15% 大選前夕強化家計支援」，`content` 1155 字、`summary` 188 字；20 則中 19 `realtime`＋1 `podcast`（`fb668ce5…` 宮川達彥 2 奈米文），**全部有全文、無空殼**（與 recommendations／hot keywords 的殼物件相反，見 §3）。外層 `{result, data:{total, news, stock_ids, all_stocks_to_query}}`。

### 2.1 外層

| 欄位 | 樣本值 | 判讀 |
|---|---|---|
| `result` | `true` | 成功旗標（全站一致，實測） |
| `data.total` | `10000` | 整數上限哨兵值，不是真實總數（實測數字；atte. 個股 related/news 回 `total:5825`＋細分，見 §4） |
| `data.news` | `[ SkeletalNews×1 ]` | 本批新聞陣列 |
| `data.stock_ids` | `["001440.KS","AMZN","GNRC","1815.TW","2368.TW",…]` 共 51 個（HAR JSON 實測，前 8 照抄） | 本批 20 則關聯股票代號清單（跨市場：`.TW`／`.KS`／美股代號混排，實測） |
| `data.all_stocks_to_query` | 前 8 與 `stock_ids` 相同，共 54 個（多 3 個，實測） | 前端下一輪行情批量查詢用的代號清單，對應 `POST stock/current/price/list`（用途推測，欄位存在＋有值實測；多出的 3 個來源未追） |

### 2.2 17 欄逐欄

| # | 欄位 | 樣本值（`a75574c6…`） | 判讀 |
|---|---|---|---|
| 1 | `id` | `"a75574c6-…"`（uuid） | 全站通用主鍵：`/news/{id}`、`agent/suggestions?id=`、`related/*?news_id=`、`similar`、`polls` 共用同一 uuid（HAR 實測） |
| 2 | `sort` | `[1789709741918]` | 毫秒時間戳排序鍵，陣列包單值（實測數字；walkthrough §4 原文） |
| 3 | `type` | `"realtime"` | 即時新聞；對應 `/topics/Latest` 流（實測） |
| 4 | `title` | 「巴西低所得補助調漲15%…」 | 中文 AI 標題（實測） |
| 5 | `content` | 9 段中文長文＋`##` 小標（「強調與財政紀律的一致性」「研議債務救濟方案」「對選戰的影響」） | AI 全文，含結構化小標（實測） |
| 6 | `summary` | 約 150 字中文摘要 | AI 摘要，列表頁與內頁共用（實測） |
| 7 | `image` | `img.biggo.com/…/fit/240/…webp`（內嵌 base64url 指向 `img.bgo.one/…ai_generated/2026-09/a75574c6…_1789710072_default.jpg`） | AI 配圖，詳見 §6（實測） |
| 8 | `community_content` | `null` | 社群補充欄，本樣本為空（實測；local/hot 樣本見空字串 `""`，見 §3） |
| 9 | `key_entities` | 9 項：魯拉總統／家庭補助金／弗拉維奧·波索納羅參議員／…／INSS／巴西中央銀行 | AI 抽取的關鍵實體，中英混合粒度（人名＋機構＋政策名詞，實測）；餵給 hot key-entities（推測） |
| 10 | `timestamp` | `1789709741`（秒級） | 發布時間；與 `sort` 毫秒值同源（`sort[0]/1000≈timestamp`，實測數字可互驗） |
| 11 | `highlight_content` | `null` | 搜尋命中高亮內文，無命中時 null（實測；hot keywords 回應中有 `<em>聯準會</em>` 實例，見 §3） |
| 12 | `highlight_title` | `null` | 同上，標題版（實測；walkthrough §4 記有 `highlight_title` 欄，`highlight_content` 另計） |
| 13 | `stocks` | `[]` | 關聯股票；本樣本巴西政治文故為空。有值時形狀見 §3（`{symbol,count,asset_type,region,current_price,daily_change,…}`，實測） |
| 14 | `futures` | `[]` | 關聯期貨；同上（實測） |
| 15 | `is_liked` | `null` | 匿名未登入故 null；登入態應為 bool（推測，寫入未執行） |
| 16 | `is_favorited` | `null` | 同上（實測 null） |
| 17 | `is_not_interested` | `null` | 同上；對應「不感興趣」回饋（實測 null） |

註：walkthrough §4 列的欄位名含 `highlight_content`／`highlight_title`，與本樣本 JSON 鍵一致（17 欄全對上，無落差）。

### 2.3 欄位間的互驗關係（實測數字）

- `sort[0] = 1789709741918`（毫秒）vs `timestamp = 1789709741`（秒）：`1789709741918/1000 = 1789709741.918`，同源，前者列表排序用，後者展示用（實測可互驗）。
- `key_entities`（單篇 9 項）→ 聚合成 `news/hot/key-entities` 的 `{entity,count}`（如「聯準會」25 次，實測）；podcast 側另有一套計數（OpenAI 49，實測）——兩池分開算（實測對比）。
- `stocks[]` 有值時的完整形狀（以 local/hot 首則 `e4e868d7…` 實測原文）：

| 欄位 | 範例值 |
|---|---|
| `symbol` | `"6933.TW"`／`"NVDA"` |
| `count` | `2`／`1`（文中提及次數，推測） |
| `asset_type` | `"stock"` |
| `region` | `"tw"`／`"us"` |
| `current_price` | `342`／`219.2308` |
| `daily_change`／`daily_change_percent` | `-3.5`／`-1.01` |
| `daily_volume` | `3608000`／`96079300` |

- `image` 尾段解码（實測，用 base64url 還原）：`aHR0cHM6Ly9pbWcuYmdvLm9uZS9uZXdzLWltYWdlL2FpX2dlbmVyYXRlZC8yMDI2LTA5L2E3NTU3NGM2…` → `https://img.bgo.one/news-image/ai_generated/2026-09/a75574c6-…_1789710072_default.jpg`——檔名含新聞 id＋毫秒時間戳＋`default` 變體後綴（含日期分桶 `/2026-09/`，實測）。
- 三態互動欄（`is_liked`／`is_favorited`／`is_not_interested`）匿名全 `null`；對應的寫入端點本輪未碰（超出授權範圍，walkthrough §5 實測記載）。

## 3. 列表與推薦端點

base `https://api.biggo.com/api/v1/finance`，全部普通 HTTPS JSON（無 WS、無 SSE，53 筆 mime 計數實測）。下表 params 皆為 HAR 原文。

| 端點 | params（HAR 實測） | 回應形狀（HAR 實測） |
|---|---|---|
| `GET .../news/home/local/hot/list` | `?region=tw` | `[{id,title,content,image,community_content:"",summary,key_entities[],highlight:null,timestamp,stocks[{symbol,count,asset_type,region,current_price,daily_change,daily_change_percent,daily_volume}],futures[]}]`；樣本首則 `e4e868d7…`「AMAX-KY單櫃訂單衝上百萬美元」，stocks 含 `6933.TW`＋`NVDA` 即時價 |
| `GET .../news/home/hot/keywords/list` | `?region=tw` | `[{entity,en_entity,news:[{id,title,summary,key_entities,content,image,highlight,timestamp,stocks,futures}]}]`；樣本首組 `聯準會/Federal Reserve`，`highlight` 含 `"<em>聯準會</em>"` 高亮（原文實測） |
| `GET .../news/hot/key-entities` | `?size=8&region=tw` | `[{entity,count,en_entity}]`；回 30＋ 項（`size=8` 未截斷，實測）：聯準會 25、OpenAI 14、輝達 12、Anthropic 11…（實測數字） |
| `GET .../podcast/hot/key-entities` | `?size=8&region=tw` | 同形；內容明顯偏 AI／科技：OpenAI 49、Claude 40、Anthropic 38、NVIDIA 24…（實測數字）——news 偏總經、podcast 偏 AI，選題池不同（實測對比） |
| `GET .../news/user/recommendations` | `?region=tw`（R3 登入態；翻頁用 `cursor`，見下） | `{cursor,variant:"personalized_v1",news:[…]}`；樣本首則 `cc1b1a03…`「AI 搶料排擠消費市場…」，`content:""`＋`summary:null`（只給殼，點進才拿全文，實測） |
| `GET .../news/stock/list` | `?sort=active｜rise｜fall&region=tw`（可加 `stock_id=2330.TW`） | 三榜；個股頁右側「最活躍／上漲最多／下跌最多」即此（HAR＋頁面對讀，實測） |
| `GET .../news/home/list` | walkthrough §3.2 記載 `GET .../news/home/list` | 本次裁剪版 53 筆＋完整版 935 筆 HAR 內**未見**此路徑（實測無；首頁新聞流實際打的是 local/hot＋hot keywords＋recommendations 三件套，見上） |

cursor 翻頁（R3 登入態實測原文）：首輪回

```json
{"cursor": "eyJzaWQiOiAiMjAyNi0wOS0xOFQwNjoyMTozMy45OTM3NDIrMDA6MDAiLCAibiI6IDEsICJ2IjogInBlcnNvbmFsaXplZF92MSJ9", "variant": "personalized_v1"}
```

解開即 `{"sid":"2026-09-18T04:21:33.993742+00:00","n":1,"v":"personalized_v1"}`——時間游標＋序號＋演算法版本號；R3 僅打了一輪，`cursor` 回傳參數名未實測（沒拿到的部分，見 §10）。

### 3.2 local/hot 與 list 全文的鍵差異（HAR＋JSON 對讀，實測）

`local/hot/list` 首則鍵（11 鍵）：`[id,title,content,image,community_content,summary,key_entities,highlight,timestamp,stocks,futures]`。
對比 `news/list` 全文 17 欄（§2.2），local/hot **少 6 鍵**：無 `sort`、`type`、`highlight_content`、`highlight_title`、`is_liked`、`is_favorited`、`is_not_interested`（實為少 7 欄），且 `highlight` 為單數合併鍵（全文版拆成 `highlight_title`＋`highlight_content` 兩欄）。
判讀：local/hot 是列表專用的瘦身形狀（無排序鍵、無搜尋高亮拆分、無互動三態，推測；鍵存在與否實測）。`community_content` 在 local/hot 為空字串 `""`、全文版為 `null`（實測差異，語義不明）。

### 3.3 列表三件套耗時（R2 HAR，`x-envoy-upstream-service-time` 實測）

HAR 自帶 `time` 全數 <1ms（仅 receive 有值，疑似匯出失真，不可信）；以下以上游服務耗时為準（後端真實處理時間，實測）：

| 端點 | upstream（ms） | 回體大小 | 備註 |
|---|---|---|---|
| `news/hot/key-entities?size=8` | 2 | 3211 B | 30＋ 項全回，`size=8` 未截斷（見 §3.1） |
| `news/home/local/hot/list` | 81 | 8636 B | 最慢的列表端點（推測含行情 join） |
| `news/home/hot/keywords/list` | 46 | 46129 B | 最大包；唯一帶 `cache-control: public, s-maxage=60`（見 §8） |
| `podcast/hot/key-entities?size=8` | 3 | 3287 B | 與 news 池同形（見下） |
| `stock/related/news?stock_id=2330.TW&size=9&page=1` | 81 | 51166 B | 個股頁用；`total:5825` 全文見 §4.2 末 |

key-entities 兩池 REQ 全文（query 照抄）：`?size=8&region=tw` 兩者完全相同，只有路徑 `news/hot/` vs `podcast/hot/` 不同（實測）。
RESP 全文形狀：`{"result":true,"data":[{"entity","count","en_entity"}…]}`；news 池 30＋ 項（`{"entity":"聯準會","count":25,"en_entity":"Federal Reserve"}` 開頭，全文過長，截前 5 項＋總項數註明），podcast 池 `OpenAI 49` 開頭（同式截斷）。`size=8` 兩池皆未生效——不是分頁參數（推測為遺留參數；行為實測）。

### 3.1 回應範例（HAR 原文摘錄，id 遮罩）

hot keywords 首組（`聯準會`，實測）：回 `entity`＋`en_entity`＋`news[]`，每則新聞帶 `highlight` 高亮 HTML——

```json
{"entity": "聯準會", "en_entity": "Federal Reserve", "news": [{
  "id": "0ac4822d-…", "title": "人民幣中間價連八升 離岸價破6.7創逾四年新高",
  "highlight": "此波升值發生在美國<em>聯準會</em>啟動升息週期、美元指數仍處近七週高檔之際…",
  "timestamp": 1789709728, "stocks": [], "futures": []}]}
```

同組第二則 `b847f604…`「在岸離岸人民幣雙雙升破6.70關卡」的 `summary` 為 `null`、`content` 為 `""`——殼先行、全文後取（實測；與 recommendations 殼物件同 pattern）。

key-entities 兩池對比（同 `size=8`，實測數字）：

| 排名 | news 池 | podcast 池 |
|---|---|---|
| 1 | 聯準會 25 | OpenAI 49 |
| 2 | OpenAI 14 | Claude 40 |
| 3 | 輝達 12 | Anthropic 38 |
| 4 | Anthropic 11 | NVIDIA 24 |
| 5 | SK海力士 11 | ChatGPT 18 |

→ news 池是總經＋半導體，podcast 池是 AI 模型＋科技人物（伊隆·馬斯克 16、Dario Amodei 13，實測）——兩個選題池各自獨立計數（實測對比，推測對應不同編輯線）。

個股三榜：`news/stock/list?sort=active｜rise｜fall` 在 `/quote/2330.TW` 頁載入時各打一次（不帶 `stock_id` 的全站版＋帶 `stock_id=2330.TW` 的個股版，HAR 實測共 6 筆）——榜單是全站共用端點、個股頁只是加參數重打（實測）。

## 4. 內頁關聯網絡（一則新聞打 6 支 API）

以 `a75574c6…`（巴西補助文，無關聯股票）實測，內頁載入時並發：

| 端點 | params | 回應（HAR 實測） | 判讀 |
|---|---|---|---|
| `GET .../news/related/symbols` | `?news_id=a75574c6…&region=tw` | `{"stocks":[],"futures":[]}` | 關聯 quote chips；本則無故全空。有值時 chip 點進 `/quote/{symbol}`（頁面實測） |
| `GET .../news/related/products` | `?news_id=…&region=tw` | `{"products":[]}` | 關聯商品（比價主業的遺緒，推測）；本則空 |
| `GET .../news/similar/list` | `?news_id=…&region=tw` | `{news_ids:[6 個 uuid], list:[{id,title,timestamp}×6]}` | 相似新聞；本則 6 則多為雜訊（「韓法企業家齊聚巴黎」「NCSoft 新作」…僅 2 則巴西相關，實測）——相似度品質待加強（實測評價） |
| `GET .../news/polls` | `?news_id=…&region=tw` | `{"polls":[]}` | 內頁投票；本則無投票（實測空） |
| `GET .../agent/suggestions` | `?id=a75574c6…&region=tw`（注意：此處 param 名是 `id` 不是 `news_id`） | `{"suggestions":[]}` | Agent 追問 chips；**本則為空陣列**——該頁無預設追問，不是沒接線（端點 200 有回，實測）。有內容時應為浮層 Agent 的 starter prompts（推測） |
| `POST .../news/view-attest` | `?region=tw`，body 空 | HAR 200（walkthrough §3.2）；裁剪版未收錄 body（實測） | 瀏覽見證信標：讀即打點，供熱門／推薦計數用（推測用途；「attest」命名實測） |

對照組（有股票的內頁）：`a7724b8f…` 內頁 SSR 即有關聯 quote chips（`1398.HK`／`BABA`／`GS`／`QCOM`，頁面實測）——related/symbols 有值時即渲染此列。

### 4.1 similar 6 則全表（`a75574c6…` 巴西補助文，HAR 實測原文標題）

| # | id（遮罩） | 標題 | 相關度判讀 |
|---|---|---|---|
| 1 | `9919bfd1…` | 韓法企業家齊聚巴黎，簽署AI、量子、能源合作MOU共3項 | 無關（雜訊，實測） |
| 2 | `466ba5c1…` | 亞曼尼創辦人逝世週年，股權出售正式啟動… | 無關（雜訊，實測） |
| 3 | `df87a916…` | 魯拉談連任後的巴西債務「不擔憂」 | 相關（同主角，實測） |
| 4 | `3f16f2ef…` | NCSoft公開新作《Like or Die》… | 無關（雜訊，實測） |
| 5 | `ee53d29d…` | 巴西參議員波索納洛擬設憲法債務上限 | 相關（同人物＋財政主題，實測） |
| 6 | `3ff82a39…` | 中國企業拿下巴西23億雷亞爾AI大單 | 弱相關（同地名，實測） |

→ 6 中 2 相關、1 弱相關、3 雜訊；向量召回疑似以實體交集為主、主題權重不足（推測；樣本僅一頁）。

### 4.2 suggestions 空陣列的三種讀法（皆有實測支撐，結論為推測）

1. 該頁無預設追問（端點 200、`{"suggestions":[]}`，實測）——不是前端沒接線。
2. param 名是 `?id=` 而非 `?news_id=`（HAR 實測原文），與 related／similar／polls 不同名——suggestions 屬 Agent 側（`agent/` 命名空間）而非新聞側，key 體系是 Agent 的（實測差異）。
3. 有內容時應為浮層 Agent 的 starter prompts，點選後相當於 `POST sparrowhawk/message` 帶 `page_metadata.url`（該機制 R4 實測存在；此處銜接為推測）。

個股側回望：`GET .../stock/related/news?stock_id=2330.TW&size=9&page=1` 回 `{total:5825, news_count:5729, major_count:96, podcast_count:104, ir_release_count:9, news:[…]}`（HAR 實測）——**新聞與 podcast 在同一計數體系下**（`podcast_count` 並列），雙檢視共用本體的計數證據。

### 4.3 內頁 6 支 REQ/RESP 全文＋耗時（R2 HAR，`a75574c6…` 頁，id 遮罩）

REQ 共通頭（6 支 GET 全同，HAR 原文）：`accept: application/json`＋`origin: https://finance.biggo.com.tw`＋`referer: https://finance.biggo.com.tw/`；**無 authorization、無 cookie、無 site**（匿名三無，實測；登入態對照見 `biggo-auth-billing.md` §7）。
query 兩種 key：`?news_id=<uuid>&region=tw`（related／similar／polls）vs `?id=<uuid>&region=tw`（suggestions，Agent 側命名，見 §4.2）。

短回包四則，全文照抄（皆 200）：

| 端點 | upstream | RESP 全文 |
|---|---|---|
| `news/related/symbols` | 11ms | `{"result":true,"data":{"stocks":[],"futures":[]}}`（49 B） |
| `news/related/products` | 2ms | `{"result":true,"data":{"products":[]}}`（38 B）＋`cache-control: public, s-maxage=300`（唯一 300s 快取，見 §9） |
| `agent/suggestions` | 10ms | `{"result":true,"data":{"suggestions":[]}}`（41 B） |
| `news/polls` | 13ms | `{"result":true,"data":{"polls":[]}}`（35 B） |

`similar/list` 全文（974 B，200，upstream 97ms——**內頁 6 支中最慢**，向量召回成本，推測）：

```json
{"result":true,"data":{"news_ids":["9919bfd1-…","466ba5c1-…","df87a916-…","3f16f2ef-…","ee53d29d-…","3ff82a39-…"],"list":[{"id":"9919bfd1-…","title":"韓法企業家齊聚巴黎，簽署AI、量子、能源合作MOU共3項","timestamp":1788914211},{"id":"466ba5c1-…","title":"亞曼尼創辦人逝世週年，股權出售正式啟動…LVMH、L'Oréal、EssilorLuxottica各有盤算","timestamp":1788515738},{"id":"df87a916-…","title":"魯拉談連任後的巴西債務「不擔憂」 指利率高漲為主因","timestamp":1787901952},{"id":"3f16f2ef-…","title":"NCSoft公開新作《Like or Die》 以宇宙實況主為背景的射擊遊戲搶攻市場","timestamp":1787788541},{"id":"ee53d29d-…","title":"巴西參議員波索納洛擬設憲法債務上限，佔GDP 65%即凍結支出","timestamp":1787770011},{"id":"3ff82a39-…","title":"中國企業拿下巴西23億雷亞爾AI大單 華為攜手科大訊飛打造拉美算力樞紐","timestamp":1787385933}]}}
```

（`news_ids` 與 `list[].id` 一一對應，順序一致，實測；`list` 項只有三鍵 id／title／timestamp——點進才拿全文，殼物件 pattern，見 §3。）

`view-attest` REQ 全文特徵（HAR 實測，與上 5 支不同形）：
- headers 只有 7 個：`sec-ch-ua*`＋`Referer`＋`User-Agent`＋`Content-Type: text/plain;charset=utf-8`＋`Accept-Language`——**無 accept、無 origin**，`sendBeacon` 指紋（推測為 `navigator.sendBeacon` 發出；行为實測，API 歸屬推測）。
- body 空，RESP 200 空體、**無任何 response headers**（HAR 實測）。
- 判讀：純發射後不管（fire-and-forget）信標；query 只有 `?region=tw`，連 `news_id` 都不帶——當頁 id 若有上報只可能在信標體內，但體為空（實測空體）。要不是靠 referer／server 端 session 歸因，就是本輪該欄位預留未用（推測兩種讀法並存）。

內頁 6 支耗時對照（upstream 實測）：

| 端點 | upstream（ms） | 回體 | 快取頭 |
|---|---|---|---|
| similar/list | **97** | 974 B | 無 |
| polls | 13 | 35 B | 無 |
| related/symbols | 11 | 49 B | 無 |
| suggestions | 10 | 41 B | 無 |
| related/products | 2 | 38 B | `s-maxage=300` |
| view-attest | （無 upstream 頭） | 0 B | —（無回頭） |

→ 最貴的是相似召回（97ms ≈ 其餘 5 支總和，實測數字）；空回包三則（symbols／products／polls／suggestions 皆空，本頁）各自仍付 2–13ms——內頁 associations 是固定 6 連發、不因有無結果而剪枝（推測；本頁行為實測）。

## 5. news vs podcast 雙檢視對照（同 id `a7724b8f…`）

| 項目 | `/news/a7724b8f…` | `/podcast/a7724b8f…` |
|---|---|---|
| 內容本體 | Summary＋Content 長文（含 H3、表格、blockquote、mermaid flowchart、inline 圖片） | 高度重疊的中文長文（webfetch 對讀實測） |
| 獨有欄位 | Published／Updated（ISO 時間）、Author `"BigGo Editorial Team"`（原文）、Keywords | Host／Guest、標籤 chips、時長（如 `00:28`）、語言 |
| 封面 | `img.biggo.com` AI 配圖 | `img.youtube.com/vi/…/hqdefault.jpg` 影片縮圖 |
| 列表入口 | `/topics/Latest`（約 20 則＋「13 分鐘前」） | `/podcast`（篩選：收藏／內容追蹤頻道／全部頻道） |
| 定位 | 消費即時資訊 | 消費外語深度內容的中文化 |

→ walkthrough §6 原文一句話結論：「同一 AI 內容管線、兩種檢視；news 偏『快訊＋全文』，podcast 偏『外語轉譯＋結構化筆記』。」（實測）

## 6. 圖片管線（三網域＋簽名代理）

| 網域 | 用途（實測） | URL 形狀（原文，id 遮罩） |
|---|---|---|
| `img.biggo.com` | 列表縮圖（CDN 代理層） | `…/fit/240/0/sm/0/aHR0…webp`（新聞列表 `fit/240`；local/hot 用 `fit/950`；內嵌段為 base64url 原圖地址） |
| `img.bgo.one` | 原圖倉庫（內文圖＋AI 生成圖源） | `img.bgo.one/news-image/ai_generated/2026-09/a75574c6…_1789710072_default.jpg`（解码自 `image` 尾段，實測）；內頁 Content inline 圖直接引用此域 |
| `img.youtube.com` | podcast 封面 | `img.youtube.com/vi/…/hqdefault.jpg`（頁面實測） |

簽名代理：`POST https://api.biggo.com/api/v1/image/icd/url`（R2 HAR 內 13 筆，全部 200，upstream 全 0–2ms——纯 CPU 取色＋簽名、無外部依賴，推測）。
注意信封與全站不同：**`{"success":true,"results":[…]}`**，不是 `{result,data}`（HAR 實測原文）——icd 是圖片服務自有命名（推測）。

REQ 全文（一則短例，3 urls，HAR 實測原文，檔名 hash 保留）：

```json
{"urls":["https://img.biggo.com/cwppcr_HQL2…/fit/200/…1762.TW.svg.webp","https://img.biggo.com/gwCNxds0…/fit/200/…2850.TW.svg.webp","https://img.biggo.com/VnGnsrpq…/fit/200/…2832.TW.svg.webp"]}
```

（解其中一段：`…/c3ltYm9scy8xNzYyLlRX…` → `…/symbol-icons/symbol/1762.TW.svg`——股標原圖在 S3，`img.biggo.com/…/fit/200/…` 是代理縮放層，實測解码。）
REQ 頭特徵：`content-type: text/plain;charset=UTF-8`（發 JSON 卻報 text/plain——規避 CORS preflight 的常見手法，推測；`accept: */*`，HAR 實測）。

RESP 單項全文（`1762.TW` 股標，4090 B 回包中第一項，HAR 實測原文，截前兩色＋結構）：

```json
{"url":"https://img.biggo.com/cwppcr_HQL2…(與請求 URL 相同)",
 "colors":[{"hex":"#DFE1E8","percentage":75.4,"rgb":{"r":223,"g":225,"b":232}},{"hex":"#D70F1F","percentage":20.5,"rgb":{"r":215,"g":15,"b":31}},…],
 "has_transparency":false,"dominant_tone":"light",
 "edge_analysis":{"dominant_edge_color":"#DFE1E8","transparency_ratio":0,"edge_luminance":0.7536459793470535},
 "recommendation":{"light_mode":{"target_background":"#FFFFFF","contrast_ratio":1.3,"needs_background":true,"suggested_background":"#808080","suggested_background_rgb":{"r":128,"g":128,"b":128},"gray_level":128,"final_contrast_ratio":3,"reason":"淺色/透明邊緣在淺色背景需要灰底襯托"},"dark_mode":{"target_background":"#121212","contrast_ratio":14.3,"needs_background":false,"suggested_background":null,"final_contrast_ratio":14.3,"reason":"淺色邊緣在深色背景下對比度足夠"}},
 "cached":true}
```

逐欄（超出 §6 原記載的新欄，HAR 實測）：

| 欄位 | 值（例） | 判讀 |
|---|---|---|
| `url` | 與請求相同 | 回音確認（批量對齊用，推測）；簽名體現在首段 hash（`cwppcr_HQL2…`，推測為簽名，實測有此段） |
| `colors[]` | `{hex,percentage,rgb}` | 整圖主色票（§6.1 原有，實測） |
| `has_transparency`／`dominant_tone` | `false`／`"light"` | 去背＋明暗判斷（實測有欄） |
| `edge_analysis` | `{dominant_edge_color,transparency_ratio,edge_luminance}` | 邊緣色＋透明比＋亮度（實測有欄；`edge_luminance` 浮點 16 位，實測） |
| `recommendation.light_mode／dark_mode` | `{target_background,contrast_ratio,needs_background,suggested_background,reason}` | **淺色／深色模式各給一套佔位背景建議**（中文 reason 原文，實測）——前端按主題切 skeleton 底色（推測用途） |
| `cached` | `true` | 該 url 分析結果有快取（實測有欄；13 筆是否全 true 未逐筆核，標推測） |

### 6.1 一次完整代理往返（HAR 實測原文，截短）

REQ（批量一次多圖，實測）：

```json
{"urls": ["https://img.biggo.com/AzcM…/fit/200/0/sm/0/aHR0cHM6Ly9zMy5iaWdnby5jb20vZmluYW5jZS1tZWRpYS1tYXRlcmlhbC9zeW1ib2wtaWNvbnMvc3ltYm9sLzYyMTQuVFcuc3Zn.webp", "…3605.TW.svg…", "…2493.TW.svg…", "…"]}
```

解其中一段：`aHR0cHM6Ly9zMy5iaWdnby5jb20vZmluYW5jZS1tZWRpYS1tYXRlcmlhbC9zeW1ib2wtaWNvbnMvc3ltYm9sLzYyMTQuVFcuc3Zn` → `https://s3.biggo.com/finance-media-material/symbol-icons/symbol/6214.TW.svg`——股標原圖在 S3，`img.biggo.com/…/fit/200/…` 是代理縮放層（實測解码）。

RESP 首項色票全表（HAR 實測原文，`1310.TW` 股標）：

| hex | percentage | rgb |
|---|---|---|
| `#DFE1E8` | 77.1 | 223,225,232 |
| `#EE0F0E` | 18.1 | 238,15,14 |
| `#DFE1E7` | 1.6 | 223,225,231 |
| `#BD272A` | 0.8 | 189,39,42 |
| `#E18F92` | 0.7 | 225,143,146 |
| `#FDD0D5` | 0.6 | 253,208,213 |
| `#F7B1B4` | 0.4 | 247,177,180 |
| 餘項 | 0.4／0.3… | … |

→ 灰底 77%＋品牌紅 18%，即該股標的主視覺構成；前端未渲染圖片前即可用此配 skeleton（推測用途；色票數據實測）。

三網域分工一句話：`img.biggo.com` 是對外的尺寸代理（`fit/240` 列表、`fit/950` 內頁首圖、`fit/200` 股標，實測三種），`img.bgo.one` 是原圖倉庫（含 `ai_generated/` 與 `stockr_library_covers/` 兩種桶前綴，實測），`img.youtube.com` 只服務 podcast 封面（實測）。寫爬蟲時三域分開處理（walkthrough 自動化備註原文）。

## 7. 做得好的地方＋限制（每條標實測／推測）

做得好的（實測）：

- 摘要結構化程度高：H2/H3＋表格＋blockquote＋mermaid 全文標配，遠超段落式摘要（實測）。
- 英→中徹底重寫而非機械翻譯：podcast 長文＋新聞全文皆中文母語品質（實測評價）。
- 零摩擦：匿名可讀全文＋行情（k-line 請求僅 `Accept: application/json`、無 Authorization 全數 200，實測）；免裝 app 免帳號（實測）。
- 關聯網絡完整：一則新聞配 symbols／similar／polls／suggestions／attest 五件套（實測）；key_entities 中英對照（`en_entity`）方便跨語言檢索（實測）。
- 推薦已個人化：`variant:"personalized_v1"`＋時間游標翻頁（R3 登入態實測）。

限制（實測）：

- SSR 空骨架＋CSR：`/earnings-call`、`/calendar`、`/market` 圖表區、「為你推薦」在 webfetch 下幾乎為空（實測）；SEO 與無 JS 體驗吃虧。
- similar 品質不穩：巴西文配出巴黎 MOU＋韓遊新作（實測，§4）。
- suggestions 常空：實測頁 `{"suggestions":[]}`，追問入口形同虛設（實測該頁；是否全站皆空未知）。

限制（推測）：

- 選題疑為編輯台人工挑（podcast 節目清單 79KB `podcast/sources`，更新機制未驗證；前輪亦列為沒拿到）。
- 無原音檔／原文連結（推測版權考量，前輪結論）。
- `total:10000` 哨兵＋recommendations 殼物件（`content:""`）代表列表只給索引、全文另取，弱網下多一輪（推測）。

## 8. 基礎設施（R2 response headers 實測）

53 筆回頭普查（finance＋image 域通用，HAR 原文）：

| 頭 | 值 | 出現 |
|---|---|---|
| `server` | `istio-envoy` | 全部（JSON＋SSE 同源，見 scheduling 檔 R6） |
| `x-envoy-upstream-service-time` | `0`–`248`（單位 ms，實測為數字字串） | 全部 JSON 回包；view-attest（空體信標）無此頭 |
| `content-encoding` | `zstd` | 全部 JSON（全站 zstd 壓縮，實測） |
| `content-type` | `application/json; charset=utf-8`（finance）；`application/json`（icd 無 charset，實測差異） | 全部 |
| `access-control-allow-origin` | `https://finance.biggo.com.tw` | 全部（精確源，非 `*`，實測） |
| `access-control-allow-headers` | `Authorization,Content-Type,Site,X-Fgp` | finance 域全部——**點名四個自訂頭**：`Authorization`（Bearer）、`Site`（登入態瀏覽器送，見 auth-billing §7）、`X-Fgp`（僅 recommendations 白名單，見該檔 §2.4）、`Content-Type`（icd 的 text/plain） |
| `access-control-allow-methods` | `GET, POST, DELETE, PATCH, OPTIONS` | finance 域全部（與排程 CRUD 四動詞對應，見 scheduling §4） |
| `access-control-allow-credentials` | `true` | finance 域全部（icd 無此頭，實測差異） |
| `vary` | `Site, Origin, Accept-Encoding` | finance 域（按 `Site` 區分快取——呼應 `?region=tw` 由 host 映射，見 auth-billing §2.4） |
| `cache-control` | `public, s-maxage=60` 僅 hot keywords；`public, s-maxage=300` 僅 related/products | 僅 2 端點（其餘無快取頭，實測） |
| `date` | `Fri, 18 Sep 2026 06:01:2x–51 GMT` | 全部（R2 全輪 06:01:28→06:01:51，約 23s 打完 53 筆，實測） |

判讀：API 閘道是 Envoy（istio），CORS 鎖死 finance 站源；邊緣快取只給了兩個讀多寫少端點（hot keywords 60s、related/products 300s）——其餘寧可回源（推測快取策略；頭行為實測）。

## 9. 設計觀察（本輪新增，實測＋推測已標）

| # | 觀察 | 證據等級 |
|---|---|---|
| 1 | **uuid 全站通用**：`a75574c6…` 同時是 news 內頁 key、suggestions 的 `?id=`、related／similar／polls 的 `?news_id=`（§4.3 實測）；20 則 list 首則即內頁實測頁（§2 實測）——id 零轉換，全站同一主鍵空間 | 實測 |
| 2 | **sort 是毫秒鍵**：`sort[0]/1000≈timestamp`（§2.3 實測）；local/hot 瘦身版直接拿掉 `sort`（§3.2 實測）——排序只在全文索引側需要，列表側由服务端排好（推測） | 實測＋推測 |
| 3 | **空 suggestions 的三種讀法保留**（§4.2 原結論不變，補強）：端點活著（upstream 10ms＋200，§4.3 實測）、param 命名 `?id=` 屬 Agent 側（§4.3 實測）、非空時應為 starter prompts（銜接 R4 `page_metadata` 機制，推測） | 實測＋推測 |
| 4 | **殼先行、全文後取是全站 pattern**：recommendations `content:""`（§3 實測）、hot keywords 第二則 `summary:null`＋`content:""`（§3.1 實測）、similar 三鍵（§4.3 實測）——列表只給索引級欄位，點進才取全文（推測為弱網優化） | 實測＋推測 |
| 5 | **`size` 參數是擺設**：`key-entities?size=8` 兩池皆回 30＋ 項（§3.3 實測）——後端忽略或另有預設（推測；前端照傳，實測） | 實測＋推測 |
| 6 | **圖片是「簽名＋取色」一體服務**：icd 回包把 skeleton 配色（colors／edge／light-dark recommendation／cached）一次給齊（§6 實測）；REQ 用 `text/plain` 發 JSON 規避 preflight（推測，頭實測）；upstream 0–2ms 近乎純本地計算（實測數字） | 實測＋推測 |
| 7 | **三圖床分工**（§6 原結論＋R3 佐證）：`img.biggo.com` 尺寸代理（`fit/240` 列表、`fit/950` 首圖、`fit/200` 股標、`fit/160` podcast 來源，實測四種）→ 原圖 `img.bgo.one`（`ai_generated/`＋`stockr_library_covers/` 兩桶，實測）→ podcast 封面 `img.youtube.com`（實測）；R3 `podcast/sources` 78KB 回包內 `image_url` 全走 `img.biggo.com/fit/160`（實測） | 實測 |

## 10. 沒拿到的（2026-09-18 補充後更新）

- ASR 引擎與摘要 LLM 型號（未公開；前輪＋本輪皆無）。
- 內容更新頻率與選題標準（需長期觀察或官方說法；walkthrough 待深入項延續）。
- `user/recommendations` 第二頁 `cursor` 回傳參數名（R3 只打一輪，實測無）。
- `agent/suggestions` 非空時的形狀（實測頁為空陣列；upstream 10ms 證明端點活著，見 §4.3）。
- polls 投票的寫入協議（超出授權範圍，未碰）。
- Pro／Thinking 與「法說會提前 30 分鐘搶先看」（需 Pro 帳號，免費用戶下拉全鎖定）。
- 工具參數與檢索原文（SSE stream 內只有工具 `name`；history 只有最終文字，R4 實測）。
- 本輪已補齊（不再是缺口）：列表三件套耗時（§3.3）、內頁 6 支 REQ/RESP 全文（§4.3）、icd 完整欄位（§6）、基礎設施頭（§8）。
