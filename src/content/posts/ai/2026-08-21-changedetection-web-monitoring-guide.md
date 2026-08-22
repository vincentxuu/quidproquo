---
title: "changedetection.io 完整指南：用 selector、通知與 Browser Steps 監控網頁"
date: 2026-08-21
category: ai
type: guide
tags: [changedetection-io, website-monitoring, web-scraping, self-hosted, docker]
lang: zh-TW
tldr: "changedetection.io 是網頁變更訊號層：先縮小監控範圍、排除雜訊，再把真正的變更通知下游；它不是搜尋 API，也不該取代 crawler。"
description: "從 Docker 自架開始，實作 changedetection.io 的 watch、CSS/JSONPath filter、排程、Apprise 通知、Playwright Browser Steps、動態頁監控與誤報治理。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-changedetection-web-monitoring-guide-en)

[changedetection.io](https://github.com/dgtlmoon/changedetection.io) 是可自架（self-hosted）的網頁監控工具，會定期取得指定 URL、保存快照、比較前後版本，並在內容改變時送出通知。它最適合回答「這個已知頁面有沒有變」，不是「網路上有哪些相關頁面」，也不是「把整個網站爬下來」。

本文依據 2026 年 8 月 21 日查核的官方 repository、Wiki 與 Compose 設定撰寫。主線只有一條：先建立一個安靜、可信的 watch，再把變更訊號接到後續資料流程。

## 先把它放在正確的一層

changedetection.io 的輸入是已知 URL，輸出是「某個監控範圍發生變更」以及差異內容。搜尋服務、crawler 與它分工如下：

```text
搜尋服務：找出值得追蹤的 URL
    ↓
changedetection.io：判斷既有 URL 是否改變
    ↓
Crawl4AI / ingestion worker：重新抓取、抽取、驗證並寫入資料庫
```

若每小時都重爬一千個幾乎不會變的頁面，成本花在「確認沒變」。changedetection.io 可以先做便宜的差異判斷，只有變更時才喚醒較重的抽取流程。不過它的快照與 diff 不是 canonical dataset；需要乾淨 Markdown、結構化欄位、站內連結探索或整站 crawling，仍應交給 crawler。

## 用 Docker Compose 啟動

只監控伺服器直接回傳的 HTML 時，一個 container 就能開始。以下是依官方 [`docker-compose.yml`](https://github.com/dgtlmoon/changedetection.io/blob/master/docker-compose.yml) 縮成的最小設定：

```yaml
services:
  changedetection:
    image: ghcr.io/dgtlmoon/changedetection.io
    container_name: changedetection
    ports:
      - "127.0.0.1:5000:5000"
    volumes:
      - changedetection-data:/datastore
    restart: unless-stopped

volumes:
  changedetection-data:
```

```bash
docker compose up -d
docker compose logs -f changedetection
```

開啟 `http://127.0.0.1:5000`。資料放在具名 volume 的 `/datastore`，更新則依官方 README 執行 `docker compose pull && docker compose up -d`。綁在 `127.0.0.1` 表示只有本機能直接連線；要從外部使用，應放在有 TLS 與存取控制的 reverse proxy 後方，而不是把管理介面裸露到公網。

## 建立第一個 watch

在首頁輸入 URL 並儲存，先按 **Recheck** 取得基準快照。第一次抓取的目的，是建立之後可比較的版本；不要在尚未看過實際輸出前就開通知。

進入 watch 的編輯頁面後，依序確認：

1. **Request**：先用預設的快速文字請求；頁面需要 JavaScript 時才切換 Playwright。
2. **Filters & Triggers**：只留下真正關心的節點。
3. **Time & Date**：設定檢查間隔與可執行時段。
4. **Notifications**：最後才加通知 URL 並送測試訊息。

這個順序很重要。未經 filter 的整頁 diff，常把日期、廣告、cookie banner 或推薦內容當成業務事件。

## Selector 先縮小監控面積

watch 的 `CSS/JSONPath/JQ/XPath Filters` 欄位接受多種 selector。官方 [CSS Selector help](https://github.com/dgtlmoon/changedetection.io/wiki/CSS-Selector-help) 強調欄位裡要填 selector，不是貼 HTML：

```html
<div class="product">
  <span id="price">NT$1,299</span>
</div>
```

```css
.product #price
```

如果頁面 DOM 穩定，優先選語意清楚的 `id`、`data-*` 或小範圍 class，避免 `div:nth-child(7)` 這類版面稍改就失效的路徑。也可以用 Visual Selector 在瀏覽器畫面上點選區塊；官方 README 說明這項功能使用 Playwright content fetcher。

JSON endpoint 不必先轉成 HTML。官方 [JSON selector 說明](https://github.com/dgtlmoon/changedetection.io/wiki/JSON-Selector-Filter-help) 支援 `json:` 與 `jq:` 前綴，例如：

```text
json:$.items[?(@.status=="available")]
```

只想把整份 JSON 排版後再比較，可用 `json:$`。複雜轉換能用 `jq:`，但官方文件也註明 `jq` 需要在非內建環境另外安裝；若只是取一個欄位，JSONPath 比多加一層相依套件簡單。

## Filter 與 trigger 解決不同問題

selector 決定「比較哪個區塊」，`Ignore lines containing` 決定「哪些行不算變更」，`Keyword triggers` 則把通知收窄到符合關鍵詞的內容。實作上可以這樣分：

- 價格、庫存、公告正文：用 selector 納入。
- 「更新時間」、隨機 request ID、輪播推薦：用 ignore text 或 regex 排除。
- 只有出現「available」「招生中」才要通知：用 keyword trigger。

先縮小 DOM，再忽略殘餘雜訊；不要一開始就寫一條吞掉所有數字的 regex，否則價格真的改了也會被消音。每次調整後都看一次 **Content after filters** 與 diff，確認留下的文字仍足以解釋事件。

## 排程不是越密越好

changedetection.io 有全域 `Time Between Check`，每個 watch 也能選擇沿用全域設定或自行覆寫。現行表單另支援星期、時段與時區限制，官方 repository 的排程 UI 也提供 business hours 與 weekend 範本。

排程應跟來源的更新節奏一致：

- 每天發布一次的公告：每小時甚至每天檢查即可。
- 庫存或票券頁：可縮短間隔，但要考慮來源負載與封鎖風險。
- 只在工作日更新的內部頁面：限制在正確時區的工作時段。

全域設定也提供 `Random jitter seconds ± check`。加入小幅 jitter 可避免大量 watch 在整點同時打向同一個網站。更密的排程不會讓不穩定 selector 變可靠，只會更快製造誤報。

## 用 Apprise URL 送通知

changedetection.io 透過 [Apprise](https://github.com/caronc/apprise) 的 URL 格式支援 email、Discord、Telegram 與自訂 HTTP endpoint。可先在全域 Settings 設共同目的地，再由個別 watch 覆寫；介面提供 **Send test notification** 與 notification debug logs，正式啟用前兩者都要看。

若要把事件送進自己的 ingestion endpoint，官方 [Notification configuration notes](https://github.com/dgtlmoon/changedetection.io/wiki/Notification-configuration-notes#json-style-post--put-requests) 建議用 `post://` 或 HTTPS 的 `posts://`，而不是 `json://`。JSON body 中的模板值應套 `|tojson`：

```json
{
  "watch": {{ watch_title | tojson }},
  "url": {{ watch_url | tojson }},
  "diff": {{ diff | tojson }}
}
```

通知本文不可為空，也要留意目的服務的訊息長度。`{{ diff }}`、`{{ current_snapshot }}` 可能很大；傳給人看的訊息保留標題、URL 與短 diff，完整內容由 worker 重新抓取會更穩。

## 動態頁才啟用 Playwright

預設 fetcher 適合 HTML 已在初始 response 裡的頁面。價格要等 JavaScript render、需要按 cookie consent、登入後才看得到內容時，才加瀏覽器服務：

```yaml
services:
  changedetection:
    image: ghcr.io/dgtlmoon/changedetection.io
    ports:
      - "127.0.0.1:5000:5000"
    volumes:
      - changedetection-data:/datastore
    environment:
      - PLAYWRIGHT_DRIVER_URL=ws://browser-sockpuppet-chrome:3000
    depends_on:
      browser-sockpuppet-chrome:
        condition: service_started
    restart: unless-stopped

  browser-sockpuppet-chrome:
    image: dgtlmoon/sockpuppetbrowser:latest
    hostname: browser-sockpuppet-chrome
    cap_add:
      - SYS_ADMIN
    environment:
      - SCREEN_WIDTH=1920
      - SCREEN_HEIGHT=1024
      - SCREEN_DEPTH=16
      - MAX_CONCURRENT_CHROME_PROCESSES=10
    restart: unless-stopped

volumes:
  changedetection-data:
```

這些 service 名稱與連線 URL 來自目前官方 Compose 範例。啟動後，在 watch 的 **Request** 選 Playwright/Chrome fetcher，再確認瀏覽器抓到的內容。

## Browser Steps 先操作，再做 selector

官方 [Browser Steps](https://github.com/dgtlmoon/changedetection.io/wiki/Browser-Steps) 文件指出，步驟會在 Visual Selector 前執行，而且每次檢查都會重播。典型流程是：

```text
Navigate
→ Wait for selector
→ Click cookie consent
→ Fill username/password（必要時）
→ Click submit
→ Wait for result
→ Visual Selector / content filter
→ Diff
```

Browser Steps 適合可重播、路徑固定的互動，不等於完整 browser agent。驗證碼、一次性密碼、頻繁改版或複雜反機器人機制，仍可能讓流程失敗。憑證也不應直接寫進可公開的 Compose 或文章範例。

頁面只是延遲 render 時，可先增加 wait；需要額外執行 JavaScript 時，官方 [Run JavaScript before change detection](https://github.com/dgtlmoon/changedetection.io/wiki/Run-JavaScript-before-change-detection) 說明程式會在 filter 與 trigger 前執行，但同樣需要 Playwright。

## 誤報通常不是 diff 的錯

穩定監控可以按這個順序除錯：

1. 看 raw content：真的抓到目標內容嗎？
2. 看 filtered content：selector 是否只留下必要區塊？
3. 看前後快照：變的是正文，還是時間戳、廣告與排序？
4. 動態頁固定 viewport、等待條件與操作步驟。
5. 最後才加 ignore regex；每一條都用真實變更回測。

也不要把 `diff_added` 當成嚴格事件 schema。官方對 [diff notification tokens](https://github.com/dgtlmoon/changedetection.io/wiki/Using-the-%7B%7Bdiff%7D%7D,-%7B%7Bdiff_added%7D%7D,-and-%7B%7Bdiff_removed%7D%7D-notification-tokens) 的說明指出，行重排可能被判成加入、刪除或修改。需要業務等級的「價格從 A 變 B」時，下游應重新抽取兩個結構化值再比較。

## 接 Crawl4AI 時，只把通知當訊號

changedetection.io 與 Crawl4AI 不該合成同一個工具介紹，因為兩者負責不同生命週期。實務上的接法是：

```text
changedetection.io watch
  → posts:// 通知
  → queue / ingestion endpoint
  → 依 watch_url 呼叫 Crawl4AI
  → 抽取欄位並驗證 schema
  → 內容 hash 去重
  → upsert 新版本
```

worker 要把 watch UUID 或 URL 當冪等鍵，通知重送時也不重複寫入。抓取失敗則保留舊資料並重試，不要因為收到「有變」就先刪除 canonical record。Crawl4AI 的抽取方法可接續 [Crawl4AI 完整介紹](/posts/ai/2026-08-21-crawl4ai-complete-guide)。

## 什麼時候該選它

適合 changedetection.io 的情境：

- 已知頁面的價格、庫存、公告、法規或 release notes 監控。
- 希望自架，並把變更送往既有通知或 ingestion 系統。
- 網頁沒有 feed 或 webhook，但更新頻率不高。

不適合的情境：

- 不知道 URL，要從全網發現資料：用搜尋 API。
- 要探索整站連結、保存完整內容或批次抽取：用 crawler。
- 來源已有可靠 webhook、RSS 或資料庫 CDC：直接接原生事件來源。
- 要秒級行情或高頻串流：輪詢網頁不是正確介面。

整體取捨很明確：changedetection.io 省下的是「反覆抓了卻沒有變」的成本，但你仍要為 selector、通知與下游抽取定義可靠邊界。把它當訊號層，它很好用；把它當搜尋、crawler 與資料庫的總和，系統很快就會失去可驗證性。

## 參考資料

- [changedetection.io repository and README](https://github.com/dgtlmoon/changedetection.io)
- [Official Docker Compose configuration](https://github.com/dgtlmoon/changedetection.io/blob/master/docker-compose.yml)
- [CSS Selector help](https://github.com/dgtlmoon/changedetection.io/wiki/CSS-Selector-help)
- [JSON Selector Filter help](https://github.com/dgtlmoon/changedetection.io/wiki/JSON-Selector-Filter-help)
- [Playwright content fetcher](https://github.com/dgtlmoon/changedetection.io/wiki/Playwright-content-fetcher)
- [Browser Steps](https://github.com/dgtlmoon/changedetection.io/wiki/Browser-Steps)
- [Notification configuration notes](https://github.com/dgtlmoon/changedetection.io/wiki/Notification-configuration-notes)
