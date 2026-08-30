---
title: "Cloudflare Cache Rules：什麼該快取，什麼要保持動態"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, cloudflare-cache-rules, cdn, caching, edge-computing, performance]
lang: zh-TW
tldr: "Cloudflare Cache Rules 是 zone 層的快取政策：用 request expression 決定哪些內容 eligible for cache、Edge TTL/Browser TTL 怎麼算、cache key 包哪些維度，以及遇到 stale、ETag、purge 時怎麼處理。它適合管理 CDN 快取規則；Worker Cache API 則適合程式化存取。"
description: "從預設快取行為、Cache eligibility、Edge TTL、Browser TTL、custom cache key、CF-Cache-Status、Rulesets API 到 Cloudflare Trace，拆解 Cloudflare Cache Rules 的實務設計。"
draft: true
series:
  name: "Cloudflare Edge Platform"
  order: 11
---

> 🌏 [English version](/posts/tech/2026-08-30-cloudflare-cache-rules-edge-cache-policy-en)

Cloudflare 的快取很容易被講成一句「把 CDN 打開就好」。實際上，產品一旦有登入頁、API、preview、圖片、RSS、OG image、文件下載、AI 產生的 artifact，真正要決定的是：哪些東西能進 shared cache，哪些東西必須保持 dynamic，TTL 由 origin 說了算還是由平台覆蓋，purge 時能不能精準清掉。

[Cloudflare Cache Rules](https://developers.cloudflare.com/cache/how-to/cache-rules/) 是這一層的工具。它在 zone 的 Ruleset Engine 裡，針對符合條件的 request 設定 cache eligibility、Edge TTL、Browser TTL、cache key、Cache Reserve eligibility、stale 行為、strong ETag 等快取政策。它不是 Worker 裡的 `caches.default`，也不是下一篇要談的 Smart Shield；Cache Rules 解的是「這個 URL 應不應該被 Cloudflare cache，以及用哪個規則 cache」。

```txt
Browser
  |
  v
Cloudflare Ruleset Engine
  |
  +-- Cache Rules: eligibility, TTL, cache key, stale, ETag
  |
  v
Cloudflare cache
  |
  v
Origin / Worker / R2-backed app
```

## 先理解預設行為

沒有自訂規則時，Cloudflare 主要依副檔名、HTTP method 和 origin response header 判斷是否快取。官方文件列出的預設行為有幾個會直接影響實作：

- 只有 `GET` request 會被 cache；其他 HTTP method 不會。
- `Cache-Control: private`、`no-store`、`no-cache`、`max-age=0` 通常會讓資源不進 cache，行為也受 Origin Cache Control 影響。
- 有 `Set-Cookie` response header 時，Cloudflare 預設不會把它當成一般 public cache。
- Cloudflare 預設依副檔名快取靜態資產；HTML 和 JSON 預設不會因 MIME type 自動進 CDN cache。
- 沒有 cache header 時，部分 status code 會套用 default Edge TTL，例如成功回應和部分 redirect / not found。

這代表 Cache Rules 的第一個用途，是把預設不夠精準的地方寫成明確的 caching policy，而不是一口氣「全部 cache 起來」。靜態 asset 可以積極 cache；登入後頁面、個人化 API、帶 cookie 的 response，要先 bypass。這也是 performance 工作最容易踩線的地方：快取命中率變高很迷人，但錯誤共享 response 的代價更大。

## Cache Rules 控制什麼

Cache Rule 由兩部分組成：match expression 和 action parameters。

Match expression 可以看 URL、path、query string、cookie、hostname、referer、SSL、user agent、X-Forwarded-For、request headers、file extension 等欄位。透過 API 建立時，Cache Rules 會部署到 `http_request_cache_settings` phase，action 是 `set_cache_settings`。

```jsonc
{
  "expression": "(starts_with(http.request.uri.path, \"/assets/\"))",
  "description": "cache immutable build assets",
  "action": "set_cache_settings",
  "action_parameters": {
    "cache": true,
    "edge_ttl": {
      "mode": "override_origin",
      "default": 31536000
    },
    "browser_ttl": {
      "mode": "override_origin",
      "default": 31536000
    }
  }
}
```

常用設定可以分成幾類：

- **Cache eligibility**：匹配後要 `Bypass cache`，還是讓它 `Eligible for cache`。
- **Edge TTL**：Cloudflare edge 上保存多久；可以 respect origin、override origin，或沒有 header 時 bypass。
- **Browser TTL**：瀏覽器端保存多久；這和 Cloudflare edge cache 是兩件事。
- **Cache Key**：同一個 URL 在什麼條件下算同一份 cache，例如 query string、device type、header、cookie、host、country、language。
- **Serve stale**：origin 更新時是否允許先回舊內容。
- **Respect Strong ETags**：是否用 strong ETag 做 byte-for-byte revalidation。

我會把 Cache Rules 當成 production policy，而不是臨時最佳化。規則一多，順序、命名和測試比 TTL 數字本身還重要。

## Edge TTL 和 Browser TTL 分開想

Edge TTL 控制 Cloudflare cache；Browser TTL 控制使用者瀏覽器 cache。這兩個不要混在一起。

對 hashed build assets，例如 `/assets/app.4f3a9c.js`，可以把 edge 和 browser 都設長。檔名含 hash，部署新版本時 URL 會變，舊檔留在 cache 裡也不會污染新頁面。

對 HTML，通常要保守。若是公開、可接受短暫舊內容的 marketing page，可以讓 edge cache 幾分鐘，browser TTL 短一點或 respect origin。若是登入後 dashboard，應該 bypass。

對 API，要先看資料語意。公開、不含個資、更新頻率低的 read API 可以 cache；含 session、authorization、cookie、per-user response 的 API 不該進 shared cache。

```txt
/assets/*        edge: 1 year, browser: 1 year
/blog/*          edge: minutes to hours, browser: short or origin-controlled
/api/public/*    edge: short, cache key includes real variants
/api/me/*        bypass
/admin/*         bypass
```

這裡最常見的事故是把 browser TTL 設太長，導致使用者拿著舊 HTML；或把 Edge TTL 覆蓋 origin 後，忘了 origin 原本用 `private` / `no-store` 保護個人化內容。

## Cache Key 不要越細越好

Cache key 決定「哪些 request 可以共用同一份 response」。預設 key 通常接近 URL；Cache Rules 可以把 query string、headers、cookies、host、device type、geo、language 等維度納入 key。

加 key 維度有成本。把 `Accept-Language` 加進去，語系會分開；把 device type 加進去，mobile/desktop 會分開；把 cookie 加進去，hit rate 可能直接掉下來，purge 也變難。

Cloudflare 文件特別提醒：custom cache key 若包含 headers、cookies 或其他 request properties，dashboard 的 single-file purge 可能無法正常清掉，因為 dashboard purge request 無法帶齊那些值。這種情況要改用 API purge by URL 並帶完整 key 維度，或用 purge by host、prefix、tag、purge everything。

我會用這個順序判斷：

1. URL path 已經唯一嗎？可以就不要改 cache key。
2. Query string 裡只有 tracking params 嗎？可以 ignore 或只 include 真正影響內容的參數。
3. Header/cookie 真的會改變 response body 嗎？沒有就不要放進 key。
4. 一旦放進 key，purge 策略要一起設計。

Cache key 是快取正確性的邊界，不是單純的效能旋鈕。

## Bypass 要先寫

Cache Rules 的實務順序通常是先寫 bypass，再寫 eligible。先保護不能 cache 的路徑，再逐步放寬。

我會先列出這些 bypass 規則：

- `/admin/*`
- `/api/me/*`
- `/api/auth/*`
- 任何會回個人資料、權限資料、一次性 token 的 endpoint
- 帶 session cookie 且 response 不是 public 的頁面
- preview / draft / staging 路徑

接著才寫可 cache 的路徑：

- hashed static assets
- public blog posts
- images and downloadable public files
- public metadata endpoints
- OG image 或 screenshot 產物，前提是 URL key 穩定

如果 origin 已經正確回 `Cache-Control`，Cache Rules 可以選擇 respect origin。若 origin 不好改，例如第三方 origin、legacy app、或 framework default header 不符合需求，才用 Edge TTL override。

## 看 CF-Cache-Status，不要用感覺猜

快取問題要看 response header。`CF-Cache-Status` 會告訴你 Cloudflare 這次怎麼處理：

- `HIT`：命中 cache。
- `MISS`：資源 eligible，但當下 cache 沒有，所以回 origin。
- `BYPASS`：request 原本 eligible，但 origin response header 或條件讓它最後不能存。
- `DYNAMIC`：request 在一開始就不 eligible，沒有進 cache lookup。
- `EXPIRED` / `REVALIDATED` / `STALE` / `UPDATING`：和過期、revalidation、stale-while-revalidate 有關。

`BYPASS` 和 `DYNAMIC` 最容易混。`DYNAMIC` 通常表示 request 階段沒資格，例如 HTML/JSON 沒有規則、或 bypass rule 命中。`BYPASS` 通常表示 request 已經 eligible，但 response 回來後被 `no-store`、`private`、`Set-Cookie`、大小限制、`Authorization` 條件等擋掉。

調規則時，我會用 curl 連打同一個 URL：

```bash
curl -I https://example.com/blog/post
curl -I https://example.com/blog/post
```

第一次可能是 `MISS`，第二次才應該變 `HIT`。如果一直是 `DYNAMIC`，先查 rule 是否命中；如果一直是 `BYPASS`，看 origin response header。

## 用 Trace 查規則，用 Log 看現場

[Cloudflare Trace](https://developers.cloudflare.com/rules/trace-request/) 可以模擬一個 HTTP/S request，看到規則、快取與安全設定會怎麼套用。它適合回答「這條 Cache Rule 為什麼沒有 match」「某個 cookie 或 query string 會不會命中 bypass」「規則順序是不是錯了」。

但 Trace 是模擬，不是 production traffic。真的要查歷史流量、錯誤率、效能趨勢、特定使用者請求，應該看 Log Explorer、Workers logs、Analytics 或 origin logs。

我會把上線流程寫成：

1. 在 staging host 或 narrow path 上加 rule。
2. 用 Trace 驗證 match expression。
3. 用 curl / browser devtools 看 `CF-Cache-Status` 和 `Age`。
4. 確認 purge 策略。
5. 再擴大到整個 path 或 hostname。

## Cache Rules、Worker Cache API、Smart Shield

這三個常被混在一起。

Cache Rules 是 zone 層政策。它適合用來控制路徑、hostname、query、cookie、header 對 Cloudflare CDN cache 的影響。規則在平台層生效，適合讓團隊 review、用 API 或 Terraform 管理。

[Workers Cache API](https://developers.cloudflare.com/workers/runtime-apis/cache/) 是程式層工具。Worker 可以用 `caches.default` 或 `caches.open()` 存取 response，適合由程式產生 cache entry、改 response header 後再 put、或做局部刪除。Cloudflare 文件也提醒 Cache API 是 data center-local，而且不支援 Tiered Cache；若 Worker 是 middleware 並透過 `fetch()` 讀 origin，通常用 `fetch` 搭配平台 cache 設定更順。

Smart Shield 則是 origin 保護策略。Cache Rules 決定哪些內容該 cache、怎麼 cache；Smart Shield 會比較像下一層：「origin 在尖峰時要如何少被打到，遇到失效、revalidation、tiered cache、origin load 時怎麼防護」。所以這篇只把 Cache Rules 的邊界畫好，不把 Smart Shield 的內容提前寫完。

## 上線前檢查

我會用這份短清單檢查 Cache Rules：

- 先列 bypass：admin、auth、per-user API、preview、帶敏感 cookie 的 response。
- 靜態 asset 有 hash 才給長 TTL。
- HTML 的 browser TTL 保守，避免使用者長時間卡舊頁面。
- API 只 cache public、可共用、可接受 stale 的 response。
- Cache key 只納入真的會改變 response body 的維度。
- 自訂 cache key 後，同步設計 purge by URL/header、prefix、host 或 tag。
- `BYPASS` 和 `DYNAMIC` 分開查，不用感覺猜。
- 上 production 前用 Cloudflare Trace 和 `CF-Cache-Status` 驗證。
- 規則用 API 或 Terraform 管理時，避免 PUT 範例直接覆蓋既有 ruleset。

Cache Rules 的價值不在「快取越多越好」，而在把 shared cache 變成可 review 的平台政策。能共用的內容放到 edge，不能共用的內容明確 bypass，cache key 和 purge 一起設計，這樣 Cloudflare 才是在幫產品省 origin 成本，而不是替你保存一份錯的 response。

## 參考資料

- [Cloudflare Cache Rules](https://developers.cloudflare.com/cache/how-to/cache-rules/)
- [Available Cache Rules settings](https://developers.cloudflare.com/cache/how-to/cache-rules/settings/)
- [Cache Rules examples](https://developers.cloudflare.com/cache/how-to/cache-rules/examples/)
- [Create a cache rule via API](https://developers.cloudflare.com/cache/how-to/cache-rules/create-api/)
- [Cache Rules Terraform example](https://developers.cloudflare.com/cache/how-to/cache-rules/terraform-example/)
- [Default cache behavior](https://developers.cloudflare.com/cache/concepts/default-cache-behavior/)
- [Origin Cache Control](https://developers.cloudflare.com/cache/concepts/cache-control/)
- [Cloudflare cache responses](https://developers.cloudflare.com/cache/concepts/cache-responses/)
- [How Workers interacts with Cloudflare cache](https://developers.cloudflare.com/workers/reference/how-the-cache-works/)
- [Cloudflare Trace](https://developers.cloudflare.com/rules/trace-request/)
