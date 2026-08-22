---
title: "自己架一套搜尋後端：SearXNG + Crawl4AI，從零到接進 Claude Code"
date: 2026-08-21
category: ai
type: guide
tags: [searxng, crawl4ai, self-hosted, web-search, mcp, docker]
lang: zh-TW
series:
  name: "搜尋與爬取實戰"
  order: 3
tldr: "三個元件、各做一件事：SearXNG 負責找、Crawl4AI 負責讀、一層薄薄的程式把兩者黏起來。有三個預設值不改就不會動——`formats` 預設只吐 HTML、`secret_key` 預設是 `ultrasecretkey`、limiter 開了會擋你自己的程式。另外官方安裝方式在 2026 年 3 月換過，網路上多數教學指的 searxng-docker 已經封存了。"
description: "自架搜尋後端的實作步驟：用官方 compose 範本跑 SearXNG、改對三個關鍵設定、用 Crawl4AI 把網頁轉成 Markdown、黏成一個 API，最後接成 MCP 給 Claude Code 用。附每一步的驗證指令。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-searxng-crawl4ai-setup-en)

[系列前一篇](/posts/ai/2026-08-21-self-hosted-search-stack)說明了為什麼 Tavily 和 Exa 沒有地端版，以及自己組一套要付出什麼。這篇是實作：怎麼真的把它跑起來。

先說這篇的內容是怎麼來的——指令和設定都出自官方文件與 SearXNG 的 `settings.yml` 原始碼，版本標在文中。速度、成功率這類需要實測的數字，這篇不給；要數字的話那是另一種文章。

## 三個東西，各做一件事

自架的搜尋後端就這三塊：

| 元件 | 做什麼 | 不做什麼 |
|---|---|---|
| SearXNG | 把你的問題同時丟給 Google、Bing、DuckDuckGo 等引擎，收回結果去重合併 | 不抓網頁內容，只給標題、連結、摘要 |
| Crawl4AI | 拿一個網址，把整頁抓下來變成乾淨的 Markdown | 不會幫你找網址 |
| 你寫的黏著層 | 把上面兩個串起來，包成一個 API | 沒有現成好用的，自己寫比較快 |

第三塊為什麼要自己寫，前一篇解釋過：現成的包裝專案都還是幾十顆星的個人作品。而底下這兩個元件社群夠大，黏起來也不到三百行。

## 第一步：把 SearXNG 跑起來

**先講一個容易踩的坑。** 你在網路上找到的 SearXNG 安裝教學，九成會叫你 clone `searxng/searxng-docker` 這個 repo。那個 repo 已經在 2026 年 3 月 28 日封存，官方 README 直接寫 `searxng-docker repository is superseded`。現在的做法是從主 repo 抓 compose 範本：

```bash
mkdir -p ./searxng/core-config/
cd ./searxng/

curl -fsSL \
  -O https://raw.githubusercontent.com/searxng/searxng/master/container/docker-compose.yml \
  -O https://raw.githubusercontent.com/searxng/searxng/master/container/.env.example

cp -i .env.example .env
# 編輯 .env，改成你要的值

docker compose up -d
```

起來之後會有兩個服務，`docker compose ps` 看得到：

```
NAME             ...  PORTS
searxng-core     ...  0.0.0.0:8080->8080/tcp
searxng-valkey   ...  6379/tcp
```

Valkey 是 Redis 的分支，SearXNG 拿它做 bot 防護的計數。設定檔會落在 `core-config/settings.yml`。

## 第二步：改三個設定，不改就不會動

這三個是預設值擋路的地方，全部在 `core-config/settings.yml`。

**一、預設只吐 HTML。** 這是最多人卡住的一關。SearXNG 的原始碼裡寫死：

```yaml
search:
  # remove format to deny access, use lower case.
  # formats: [html, csv, json, rss]
  formats:
    - html
```

也就是說你打 API 拿到的是一整頁網頁，不是 JSON。程式要用就得加上去：

```yaml
search:
  formats:
    - html
    - json
```

**二、密碼是公開的預設值。** `settings.yml` 裡的 `secret_key` 出廠值就是字串 `ultrasecretkey`，全世界都知道。改掉：

```bash
sed -i "s|ultrasecretkey|$(openssl rand -hex 32)|g" core-config/settings.yml
```

也可以用環境變數 `SEARXNG_SECRET` 覆蓋，不用動檔案。

**三、limiter 開了會擋到你自己。** limiter 是 SearXNG 用來擋機器人的機制，預設是關的（`limiter: false`）。它擋的判斷依據就是「這個請求看起來不像瀏覽器」——而你的程式正好不像瀏覽器。如果你的實例只在內網或本機用，維持關閉最省事：

```yaml
server:
  limiter: false
```

要對外開放就得反過來：開 limiter、前面架反向代理、然後幫自己的程式開白名單。

## 第三步：確認搜尋真的出得來

改完設定重啟，然後驗證：

```bash
docker compose restart core
curl -s "http://localhost:8080/search?q=crawl4ai&format=json" | head -c 400
```

看到 JSON 就對了。如果回的是一大坨 HTML，代表 `formats` 沒吃到——檢查設定檔有沒有正確掛進容器。如果回 403，那是 limiter 在擋。

SearXNG 預設用 GET，所以參數直接接在網址後面。常用的幾個：`q` 是查詢字串、`categories` 選類別（`general`、`news`、`science`、`it`）、`language` 指定語言、`engines` 指定只用哪幾家。

## 第四步：Crawl4AI 把網頁變 Markdown

SearXNG 只給你連結和摘要。摘要通常不夠 LLM 用，所以要有人去把整頁讀回來。

```bash
pip install crawl4ai
crawl4ai-setup
```

`crawl4ai-setup` 這行不能跳過，它負責裝 Playwright 的瀏覽器。漏了的話第一次執行會失敗，錯誤訊息是找不到 Chromium。

```python
import asyncio
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, CacheMode

async def fetch(url: str) -> str:
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(
            url=url,
            config=CrawlerRunConfig(
                cache_mode=CacheMode.BYPASS,   # 不吃快取，每次都重抓
                scan_full_page=True,           # 自動捲到底，把 lazy load 的內容逼出來
                page_timeout=30000,
            ),
        )
        return result.markdown

print(asyncio.run(fetch("https://example.com")))
```

`result` 裡除了 `markdown` 還有 `links`、`media`、`status_code`、`success`、`error_message`。要判斷抓失敗，看 `success` 而不是看 `markdown` 是不是空字串——有些頁面本來就沒什麼內容。

## 第五步：黏起來

有了「找」和「讀」，剩下就是串。最小可用的版本大概長這樣：

```python
import asyncio, httpx
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, CacheMode

SEARXNG = "http://localhost:8080/search"

async def search_and_read(query: str, top_k: int = 3):
    # 1. 找
    async with httpx.AsyncClient() as client:
        r = await client.get(SEARXNG, params={"q": query, "format": "json"})
        hits = r.json()["results"][:top_k]

    # 2. 讀（平行抓，不要一個一個等）
    cfg = CrawlerRunConfig(cache_mode=CacheMode.BYPASS)
    async with AsyncWebCrawler() as crawler:
        pages = await asyncio.gather(
            *[crawler.arun(url=h["url"], config=cfg) for h in hits],
            return_exceptions=True,     # 有一頁掛掉不要拖垮整批
        )

    # 3. 合併
    return [
        {"title": h["title"], "url": h["url"],
         "content": p.markdown if not isinstance(p, Exception) else None}
        for h, p in zip(hits, pages)
    ]
```

三個地方值得注意：

- **平行抓，但別開太大。** 每個 Crawl4AI 請求背後是一個瀏覽器分頁，同時開十幾個記憶體會很快吃緊。
- **`return_exceptions=True` 不能省。** 抓網頁一定會有失敗的，沒有它一頁壞掉整批就沒了。
- **抓不到就用摘要頂著。** SearXNG 回的結果本來就有 `content` 欄位，抓不回全文時至少還有東西可以用。

## 第六步：接進 Claude Code

包成 MCP server 之後，agent 就會自己去用。最小的形狀：

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("local-search")

@mcp.tool()
async def web_search(query: str, top_k: int = 3) -> list[dict]:
    """Search the web and return page contents as Markdown."""
    return await search_and_read(query, top_k)

if __name__ == "__main__":
    mcp.run()
```

註冊到 Claude Code：

```bash
claude mcp add local-search -- python /path/to/server.py
```

光註冊還不夠。agent 看得到工具，不代表知道什麼時候該用。在 `CLAUDE.md` 裡寫清楚優先順序，它才會照做——這跟[繞過 Cloudflare 那篇](/posts/tech/deep-dive/2026-03-28-bypass-cloudflare-anti-bot-for-ai-agent)的做法一樣。

## 放哪台機器很重要

**別放雲端主機。** 這是自架搜尋最常翻車的地方，而且跟你的設定對不對無關。搜尋引擎對機房來的流量特別敏感，AWS、GCP、大型 VPS 業者的網段常常查幾次就開始回空結果。住宅 IP 就順很多。

前一篇引用過一段實測心得，講的就是這件事：

> Search engines treat datacenter IPs as presumed-guilty. From a hyperscaler range (AWS, GCP, the big Hetzner/OVH pools) SearXNG starts handing back empty results within a handful of queries; from a residential IP you look like a person.
> —— Jingbiao, "Giving an Agent a Search Engine It Actually Owns", 2026-06-20

實務上的擺法是：家裡一台常開的小主機（mini-PC、NAS 都行），服務只綁 `127.0.0.1`，然後用 Tailscale 之類的工具從筆電連過去。不要直接開到公網。

## 兩件事這套解不了

**查詢還是會外流。** SearXNG 自己沒有索引，它是把你的問題轉發給 Google 和 Bing。所以自架保證的是「不經過 Tavily 或 Exa、不計費、不限量」，不是「沒人知道你查了什麼」。真的不能外流，要走的是自建語料庫那條路。

**抓回來的東西會咬人。** 網頁裡可以藏指令，而模型讀到就會照做。自架之後沒有任何廠商幫你過濾，你就是唯一那層防護。這條線見[〈Agent 安全的同一條裂縫〉](/posts/ai/2026-06-04-agent-security-prompt-injection-trust-boundaries)。

## 什麼時候該放棄自架

自架這套的維護成本主要在兩處：上游引擎會壞（SearXNG 有一半引擎預設是關的，因為常常被擋），以及難搞的網站抓不回來。

如果你發現自己一週要修兩次、或者要處理的目標站台本來就有嚴格反爬，那就是該回去付錢的訊號。Tavily、Exa 這類服務的價值有一大半就在替你扛這些。判斷的完整依據在[前一篇](/posts/ai/2026-08-21-self-hosted-search-stack)。

## 參考資料

- [SearXNG 官方容器安裝文件](https://docs.searxng.org/admin/installation-docker.html) — 現行的 compose 安裝方式
- [searxng/searxng-docker](https://github.com/searxng/searxng-docker) — 已於 2026-03-28 封存，僅供辨識舊教學
- [SearXNG settings.yml 原始碼](https://github.com/searxng/searxng/blob/master/searx/settings.yml) — `formats`、`secret_key`、`limiter` 的預設值出處
- [SearXNG search 設定文件](https://docs.searxng.org/admin/settings/settings_search.html) — 可用的輸出格式清單
- [Crawl4AI](https://github.com/unclecode/crawl4ai) — 78,805 stars、Apache-2.0（2026-08-21 查詢）
- [Model Context Protocol](https://modelcontextprotocol.io/) — MCP 官方文件
- [Giving an Agent a Search Engine It Actually Owns](https://jingbiao.me/2026/06/20/online-research/) — 機房 IP 與住宅 IP 的實測差異
- 站內：[Tavily 和 Exa 沒有地端版](/posts/ai/2026-08-21-self-hosted-search-stack)
- 站內：[AI 爬蟲工具全景圖](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape)
- 站內：[Agent 安全的同一條裂縫](/posts/ai/2026-06-04-agent-security-prompt-injection-trust-boundaries)
