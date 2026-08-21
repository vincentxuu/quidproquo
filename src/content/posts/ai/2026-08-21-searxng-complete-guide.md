---
title: "SearXNG 完整介紹：引擎調校、JSON API 與自架維運"
date: 2026-08-21
category: ai
type: guide
tags: [searxng, web-search, self-hosted, docker, ai-agent]
lang: zh-TW
tldr: "SearXNG 是元搜尋引擎，不是 crawler，也沒有自己的全網索引。這篇以官方 2026.8.20 文件為準，從 Compose 安裝、settings.yml、引擎選擇與 JSON API，一路做到空結果診斷。"
description: "完整說明 SearXNG 的查詢流程、Compose 安裝、settings.yml 結構、引擎選擇、JSON API、機房網路限制與維運診斷。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-searxng-complete-guide-en)

[SearXNG](https://docs.searxng.org/) 是把同一個問題送往多個搜尋服務，再合併結果的元搜尋引擎。它不建立自己的全網索引，也不負責打開結果頁、執行 JavaScript 或抽取全文。對 agent 來說，它解決的是「先找到 URL」，不是「把 URL 讀完」。

這篇以 2026-08-21 查讀的官方文件版本 `2026.8.20+487d7a96e` 與同日 `master` 原始碼為準。走完後，你會有一套能在本機回 JSON、能控制引擎範圍，而且查不到時知道該看哪裡的 SearXNG。需要把搜尋結果接去抓全文，再看[組合指南](/posts/ai/2026-08-21-searxng-crawl4ai-setup)；這篇只談 SearXNG。

## SearXNG 是什麼，也不是什麼

SearXNG 的上游可以是一般搜尋引擎、學術資料庫、套件目錄、影音平台，甚至是你自己接上的離線引擎。官方的[已設定引擎清單](https://docs.searxng.org/user/configured_engines.html)在本文查證時列出 270 個引擎，其中 83 個預設啟用。這不表示每次查詢都會打 83 個上游：類別、使用者偏好、查詢語法與引擎狀態還會再篩一次。

它和三種常被混在一起的工具不同：

| 類型 | 自己持有索引 | 取得全文 | 主要責任 |
|---|---:|---:|---|
| SearXNG 元搜尋 | 否 | 否 | 聚合多個上游的標題、URL、摘要與額外欄位 |
| SERP API | 通常否 | 視產品而定 | 代管上游適配、代理與可用性，按量計費 |
| 自建搜尋索引 | 是 | 索引前要先取得 | 搜自己的文件，控制資料生命週期與權限 |
| crawler／browser | 否 | 是 | 已知 URL 之後抓取、渲染或抽取內容 |

所以「資料不能送到外部」時，SearXNG 不是答案。它仍會把查詢送到你啟用的上游；自架控制的是中介層與紀錄，不會讓外部搜尋服務看不到查詢。

## 一次查詢在裡面怎麼走

SearXNG 的核心流程可以縮成五步：

```text
query
  -> 依 category、!bang、偏好與狀態選 engine
  -> 平行呼叫各 engine adapter
  -> 把不同回應正規化成共同 result 欄位
  -> 合併重複結果並計分排序
  -> 輸出 HTML / JSON / CSV / RSS
```

每個上游的查詢網址、語言欄位與解析方式都不同，因此 SearXNG 為每個服務維護 adapter。官方的[引擎架構說明](https://docs.searxng.org/dev/engines/engine_overview.html)也直接指出，不存在一套能通吃所有搜尋引擎的通用 API。

結果不是單純串接。[`ResultContainer` 原始碼](https://github.com/searxng/searxng/blob/master/searx/results.py)會合併重複項目，保留哪些引擎找到它以及各自名次，再依名次、出現次數和 engine `weight` 計分。這代表 `weight` 是排序訊號，不是「送出更多請求」或「保證某家排第一」。

## 最小安裝與第一個 JSON 查詢

前置條件是 Docker Compose，以及可選但很方便的 `jq`。官方現在建議直接使用主 repository 的 Compose 範本，而不是舊的 `searxng-docker` 專案：

```bash
mkdir -p ./searxng/core-config
cd ./searxng

curl -fsSL \
  -O https://raw.githubusercontent.com/searxng/searxng/master/container/docker-compose.yml \
  -O https://raw.githubusercontent.com/searxng/searxng/master/container/.env.example

cp .env.example .env
printf '\nSEARXNG_HOST=127.0.0.1\nSEARXNG_SECRET=%s\n' \
  "$(openssl rand -hex 32)" >> .env
```

在 `core-config/settings.yml` 放進這份最小設定：

```yaml
use_default_settings: true

general:
  instance_name: "Local SearXNG"
  enable_metrics: true

search:
  safe_search: 0
  default_lang: "zh-TW"
  formats:
    - html
    - json

server:
  # Compose 會用 .env 的 SEARXNG_SECRET 覆寫這個值。
  secret_key: "ultrasecretkey"
  # 僅綁 127.0.0.1 的私人實例可關閉；對外服務請開啟並設定 Valkey。
  limiter: false
  image_proxy: false

outgoing:
  request_timeout: 3.0
  max_request_timeout: 10.0

valkey:
  url: valkey://valkey:6379/0
```

`use_default_settings: true` 很重要：它先載入內建設定，再用你的檔案覆寫需要改的部分。否則你等於接手維護整份預設檔。`formats` 也必須包含 `json`；[Search API 文件](https://docs.searxng.org/dev/search_api.html)說明，請求未開放的格式會直接回 `403 Forbidden`。

啟動並驗證：

```bash
docker compose up -d
docker compose ps

curl --get 'http://127.0.0.1:8080/search' \
  --data-urlencode 'q=SearXNG JSON API' \
  --data 'categories=general' \
  --data 'pageno=1' \
  --data 'format=json' \
  | jq '{query, count: (.results | length), unresponsive_engines}'
```

有 `results` 陣列就完成最小路徑。若是 403，先別碰引擎；先確認 `json` 已開放，以及 limiter 是否擋到你的程式。

## settings.yml 的真正結構

官方的[`settings.yml` 文件](https://docs.searxng.org/admin/settings/settings.html)把設定分成數個區塊。實務上先掌握這五個：

| 區塊 | 影響範圍 | 常用設定 |
|---|---|---|
| `general` | 整個 instance | 名稱、除錯、metrics |
| `server` | HTTP 服務 | `secret_key`、limiter、base URL、image proxy |
| `search` | 查詢預設與失敗退避 | 語言、安全搜尋、輸出格式、suspension |
| `outgoing` | 所有上游連線 | 全域 timeout、連線池、HTTP/2、proxy |
| `engines` | 單一上游 | category、timeout、weight、語言、啟停狀態 |

`search.default_lang`、`safe_search` 是 instance 預設；API 的 `language`、`safesearch` 可以逐次覆寫。`outgoing.request_timeout` 是全域上游等待時間，而單一 engine 的 `timeout` 會覆寫它。引擎特別慢時，應只調那一個，不要先把整個 instance 都拖慢。

要縮小預設引擎集合，可以保留官方設定、只載入指定項目：

```yaml
use_default_settings:
  engines:
    keep_only:
      - duckduckgo
      - wikipedia
      - arxiv
      - pubmed
      - semantic scholar
      - openalex

engines:
  - name: openalex
    disabled: false
  - name: arxiv
    timeout: 5.0
    weight: 1.2
```

名稱必須和當前版本一致。先查自己的 `/config`，不要從別人的文章複製：

```bash
curl -s 'http://127.0.0.1:8080/config' \
  | jq '.engines[] | {name, shortcut, categories, enabled}'
```

## 引擎怎麼選，不是全部打開就好

每多開一個上游，就多一個 timeout、CAPTCHA、版面改動或 rate limit 的失敗點。先用任務類型決定 category，再從每類挑少數互補來源：

| 需求 | 初始選法 | 檢查重點 |
|---|---|---|
| 一般網頁 | `general` 中挑 2–4 個不同來源 | 你的出口 IP 是否常遇到 CAPTCHA；語言是否支援 |
| 新聞／近期資料 | `news`，再挑支援 `time_range` 的引擎 | 發布日期是否真的回傳；不要假設每個引擎都吃時間條件 |
| 程式與套件 | `it`，優先官方 repository／套件索引類引擎 | 是否支援分頁；結果是專案頁還是一般文章 |
| 學術論文 | `arxiv`、`pubmed`、`semantic scholar`，需要時再開 `openalex` | 領域覆蓋、API key、timeout；Google Scholar 常走較脆弱的網頁解析 |
| 圖片／檔案 | 使用對應 category，不和 general 混打一輪 | 回傳的是頁面 URL、媒體 URL，還是縮圖 |
| 需要 API key 的來源 | 填好 key 後才把 `inactive` 改成 `false` | 額度、授權與 secret 管理 |

三個狀態不要混淆：

- `disabled: true`：預設不使用，但仍出現在設定與偏好中，使用者可手動開。
- `inactive: true`：不載入該引擎；需要 API key 的引擎常用這個預設。
- suspended：執行期間因 403、429、CAPTCHA 等錯誤暫停，不是靜態設定。

[`search.suspended_times`](https://docs.searxng.org/admin/settings/settings_search.html)控制不同錯誤的暫停時間。不要為了「提高成功率」把它全部設為零；那只會讓已被封鎖的上游立刻再被打一次。

## 給 agent 使用的 JSON API

截至本文版本，官方 Search API 契約列出的查詢參數包括 `q`、`categories`、`language`、`pageno`、`time_range`、`format` 與 `safesearch`。它**沒有列出獨立的 `region` 或 `engines` 參數**。語言／地區使用 `language=zh-TW` 這類 locale，adapter 支援到什麼程度仍由各引擎決定；單次指定引擎則用官方 [search syntax](https://docs.searxng.org/user/search-syntax.html) 的 `!bang` 放進 `q`。

通用搜尋：

```bash
curl --get 'http://127.0.0.1:8080/search' \
  --data-urlencode 'q=site:docs.searxng.org search api' \
  --data 'categories=general' \
  --data 'pageno=1' \
  --data 'format=json'
```

繁中 locale 與近期範圍：

```bash
curl --get 'http://127.0.0.1:8080/search' \
  --data-urlencode 'q=人工智慧治理 台灣' \
  --data 'categories=general,news' \
  --data 'language=zh-TW' \
  --data 'time_range=month' \
  --data 'safesearch=1' \
  --data 'format=json'
```

指定學術 category 與三個引擎：

```bash
curl --get 'http://127.0.0.1:8080/search' \
  --data-urlencode 'q=!arx !pub !se retrieval augmented generation evaluation' \
  --data 'categories=science' \
  --data 'language=en' \
  --data 'pageno=1' \
  --data 'format=json'
```

`time_range`、分頁、安全搜尋與 locale 都只有在 adapter／上游支援時才生效；不是所有引擎都會接受同一組條件。要知道自己的版本支援什麼，查 `/config` 與「Preferences」頁，比抄固定清單可靠。

JSON 頂層包含 `query`、`results`、`answers`、`corrections`、`infoboxes`、`suggestions` 與 `unresponsive_engines`；這可從官方[`webutils.py`](https://github.com/searxng/searxng/blob/master/searx/webutils.py)核對。一般結果常見的欄位有 `title`、`url`、`content`、`engines`、`positions`、`score` 與 `publishedDate`，但不同 result type 不一定齊全。Agent 的 citation 資料至少保留：

```python
def citation_record(item: dict) -> dict:
    return {
        "title": item.get("title"),
        "url": item.get("url"),
        "snippet": item.get("content"),
        "published_at": item.get("publishedDate"),
        "engines": item.get("engines", []),
        "score": item.get("score"),
    }
```

`score` 只能用來排同一次 SearXNG 回應，不能當成跨 query 的相關性機率。URL 也只是引用候選；要做可靠引用，仍要抓回原頁核對主張。

## 機房 IP 是自架的真正限制

SearXNG 可以控制自己的程式，控制不了上游如何看待出口 IP。官方甚至有一頁專門說明如何透過 SSH SOCKS tunnel，從伺服器 IP 打開被擋的引擎並人工解 CAPTCHA。這足以證明「設定正確」不等於「上游一定讓你查」。

常見回應包括 403、429、CAPTCHA、解析錯誤、timeout，以及看似成功但結果為空。SearXNG 會把部分錯誤寫進 `unresponsive_engines`，並依例外類型暫停該引擎。你可以換引擎、等待 suspension 結束，或替特定 engine 設 proxy；不能靠提高重試次數把封鎖變成正常服務。

本文沒有提供「台灣住宅 IP 比某家機房成功多少」之類的數字，因為那需要在固定日期、區域、query 與流量下實測。能從官方資料確定的只有：上游可能依伺服器 IP 觸發 CAPTCHA 或拒絕存取，而且不同 engine adapter 的支援能力不同。

## 空結果怎麼診斷

空陣列不是一種錯誤，而是好幾種問題長得一樣。照這個順序排：

```text
HTTP 不是 200？
  ├─ 403 -> JSON format 未開，或 limiter 擋請求
  └─ 5xx -> 先看 core logs 與 settings.yml 載入錯誤

HTTP 200，但 results 為空？
  ├─ unresponsive_engines 有內容 -> 按 engine 的 timeout / 403 / 429 / CAPTCHA 處理
  ├─ 指定單一 !engine 仍為空 -> 查該 engine 狀態、上游與 adapter
  ├─ 拿掉 language / time_range 後恢復 -> 原引擎不支援或條件太窄
  ├─ 多個 engine 全 timeout -> 查容器 DNS、出口網路與 proxy
  └─ 只有特定 query 為空 -> 改成較寬的 query，再逐步加條件
```

先把回應縮成可讀摘要：

```bash
curl --get 'http://127.0.0.1:8080/search' \
  --data-urlencode 'q=!ddg searxng' \
  --data 'format=json' \
  | jq '{count: (.results | length), unresponsive_engines}'
```

接著看服務日誌：

```bash
docker compose logs --tail=200 core
docker compose logs -f core
```

若全部引擎都 timeout，從容器內檢查 DNS：

```bash
docker compose exec core python -c \
  'import socket; print(socket.getaddrinfo("duckduckgo.com", 443))'
```

若只有單一引擎慢，先在 `/stats` 看 engine response time，再只調它的 `timeout` 或停用它。若是 403、429 或 CAPTCHA，查看 `unresponsive_engines` 的錯誤與 suspended 狀態；等待、換來源或調整該 engine 的網路路徑，不要立刻無限重試。

## 維運邊界與什麼時候不該用

SearXNG 是 rolling release；官方維運文件說明，`master` 的每個 commit 都是一次 release。Production 不要永遠追 `latest`：在 `.env` 固定 `SEARXNG_VERSION`，先在測試 instance 更新，再檢查 `/config`、三組固定 query、空結果率與 `unresponsive_engines`。

Compose 更新流程是：

```bash
docker compose pull
docker compose up -d
docker compose ps
```

SearXNG 適合想自己控制引擎組合、查詢紀錄與成本，而且能接受上游偶發故障的團隊。下面幾種情況應直接選別的工具：

- 需要供應商承諾的 SLA、固定延遲與支援窗口：用商業 Search API。
- 要搜尋內部文件並落實 ACL、刪除與 freshness：建立自己的搜尋索引。
- 已知 URL，要取得正文或執行 JavaScript：用 crawler 或 browser。
- 要語意相似度而不是關鍵字／上游排名：用 embedding 與向量搜尋，或語意搜尋服務。
- 沒有人能持續處理 adapter 失效、CAPTCHA 和網路問題：不要把自架當成零維運成本。

真正的取捨很直接：SearXNG 把供應商帳單換成你自己的維運責任。先用少量引擎跑穩、保留錯誤 metadata，再擴充，比一次打開整張引擎清單可靠。

## 參考資料

- [SearXNG 官方文件](https://docs.searxng.org/)
- [SearXNG 容器安裝](https://docs.searxng.org/admin/installation-docker.html)
- [SearXNG settings.yml](https://docs.searxng.org/admin/settings/settings.html)
- [SearXNG Search API](https://docs.searxng.org/dev/search_api.html)
- [SearXNG 引擎設定](https://docs.searxng.org/admin/settings/settings_engines.html)
- [SearXNG 已設定引擎清單](https://docs.searxng.org/user/configured_engines.html)
- [SearXNG ResultContainer 原始碼](https://github.com/searxng/searxng/blob/master/searx/results.py)
- [SearXNG JSON 回應原始碼](https://github.com/searxng/searxng/blob/master/searx/webutils.py)
- [從伺服器 IP 處理 CAPTCHA](https://docs.searxng.org/admin/answer-captcha.html)
- [SearXNG 維運與更新](https://docs.searxng.org/admin/update-searxng.html)
- 站內：[SearXNG + Crawl4AI 組合指南](/posts/ai/2026-08-21-searxng-crawl4ai-setup)
