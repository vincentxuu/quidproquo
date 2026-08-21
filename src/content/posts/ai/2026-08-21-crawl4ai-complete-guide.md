---
title: "Crawl4AI 完整介紹：從 Markdown 抓取到結構化資料抽取"
date: 2026-08-21
category: ai
type: guide
tags: [crawl4ai, web-scraping, crawler, llm, ollama, structured-output]
lang: zh-TW
tldr: "Crawl4AI 負責 URL 之後的抓取與抽取：穩定 DOM 先用 JsonCssExtractionStrategy，只有語意判讀或版面不規則時才切 LLMExtractionStrategy。"
description: "以 Crawl4AI v0.9.x 示範 Markdown、CSS 與 LLM 結構化抽取、Ollama provider、CSS-first fallback、deep crawl、cache 與錯誤處理。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-crawl4ai-complete-guide-en)

[Crawl4AI](https://github.com/unclecode/crawl4ai) 是給 AI 工作流使用的非同步 crawler 與 scraper。它接收一個已知 URL，啟動瀏覽器、取得頁面，再輸出 Markdown、連結、metadata 或結構化 JSON。它不負責全網搜尋；還不知道 URL 時，先用搜尋服務或 SearXNG。

本文依據 Crawl4AI v0.9.x 文件與 v0.9.2 程式介面撰寫，資料查核日為 2026 年 8 月 21 日。主脊只有一條：先拿到可用內容，再用最低成本的方法把內容變成可靠資料。需要把它接上搜尋層，可回到 [SearXNG＋Crawl4AI 組合指南](/posts/ai/2026-08-21-searxng-crawl4ai-setup)。

## Crawl4AI 解決的是 URL 之後的問題

一個 Crawl4AI request 大致經過四層：

```text
URL
 └─ BrowserConfig：瀏覽器怎麼啟動
     └─ CrawlerRunConfig：這次怎麼抓、等多久、是否使用快取
         └─ Markdown / extraction strategy：輸出內容或 JSON
             └─ CrawlResult：success、status_code、markdown、links、metadata、error
```

`BrowserConfig` 管 headless、user agent、JavaScript 與瀏覽器生命週期；`CrawlerRunConfig` 管 extraction、cache、timeout、deep crawl 等單次行為。把兩者分開，才能讓同一個 browser session 執行不同抓取策略。

## 安裝與第一個 Markdown 結果

官方 quick start 的最短安裝路線是：

```bash
pip install -U crawl4ai
crawl4ai-setup
crawl4ai-doctor
```

第一個 request 不需要 extraction strategy：

```python
import asyncio
from crawl4ai import AsyncWebCrawler, BrowserConfig, CacheMode, CrawlerRunConfig

async def main():
    browser = BrowserConfig(headless=True)
    run = CrawlerRunConfig(cache_mode=CacheMode.BYPASS)

    async with AsyncWebCrawler(config=browser) as crawler:
        result = await crawler.arun("https://example.com", config=run)
        if not result.success:
            raise RuntimeError(f"{result.status_code}: {result.error_message}")
        print(result.markdown.raw_markdown)

asyncio.run(main())
```

官方 [Quick Start](https://docs.crawl4ai.com/core/quickstart/)說明，`AsyncWebCrawler` 預設使用 Chromium，並把 HTML 轉成 Markdown。production code 不要只讀 `markdown`：至少先判斷 `success`，失敗時保存 `status_code`、`error_message` 與 URL。

## Raw Markdown 與 Fit Markdown 不一樣

`result.markdown.raw_markdown` 接近完整頁面轉換結果；`fit_markdown` 是套用 content filter 後的精簡版本。依官方 [Markdown Generation](https://docs.crawl4ai.com/core/markdown-generation/)文件，filter 可以去掉 navigation、footer 與其他雜訊，但也可能一起刪掉正文邊緣資訊。

因此用途要分開：

- 保存原始證據、程式碼與連結時，保留 raw Markdown。
- 要把內容送進 LLM 或 embedding 時，再考慮 fit Markdown。
- 沒有設定 filter 時，不要假設 `fit_markdown` 一定存在或比 raw 更好。

## 先定義共同輸出契約

CSS schema 與 LLM JSON Schema 是兩種不同格式，不能把同一個 dict 直接餵給兩個 strategy。比較穩的做法，是讓兩條路最後都通過同一個 Pydantic model：

```python
from pydantic import BaseModel, TypeAdapter

class Product(BaseModel):
    name: str
    price: str | None = None
    url: str | None = None

Products = TypeAdapter(list[Product])

def validate_products(raw: str) -> list[Product]:
    return Products.validate_json(raw)
```

這個 model 才是下游 contract。CSS selector 或 prompt 可以改，但 storage、API 與測試不必跟著改。

## 確定性抽取：JsonCssExtractionStrategy

穩定列表頁、商品卡片與文件目錄，優先用 [JsonCssExtractionStrategy](https://docs.crawl4ai.com/extraction/no-llm-strategies/)。它沒有模型延遲與 token 成本，而且相同 HTML 會得到可重複的結果。

```python
import json
from crawl4ai import AsyncWebCrawler, CacheMode, CrawlerRunConfig
from crawl4ai import JsonCssExtractionStrategy

PRODUCT_CSS_SCHEMA = {
    "name": "Products",
    "baseSelector": "article.product",
    "fields": [
        {"name": "name", "selector": "h2", "type": "text"},
        {"name": "price", "selector": ".price", "type": "text"},
        {
            "name": "url",
            "selector": "a.details",
            "type": "attribute",
            "attribute": "href",
        },
    ],
}

async def extract_css(url: str):
    config = CrawlerRunConfig(
        cache_mode=CacheMode.ENABLED,
        extraction_strategy=JsonCssExtractionStrategy(PRODUCT_CSS_SCHEMA),
    )
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(url, config=config)
    if not result.success:
        raise RuntimeError(result.error_message)
    return validate_products(result.extracted_content)
```

`baseSelector` 找每筆重複項目，`fields` 再從項目裡取文字或 attribute。selector 找不到時不該立刻呼叫 LLM；先把 HTML fixture 放進測試，確認是網站改版、內容根本不存在，還是 JavaScript 尚未載入。

## 語意抽取：LLMExtractionStrategy 與 Ollama

資料散落在自然語言、版面頻繁變動，或欄位需要語意判讀時，才使用 [LLMExtractionStrategy](https://docs.crawl4ai.com/extraction/llm-strategies/)。Crawl4AI 透過 LiteLLM 的 provider string 選模型，Ollama 可指定本機 endpoint：

```python
from crawl4ai import LLMConfig, LLMExtractionStrategy

llm_strategy = LLMExtractionStrategy(
    llm_config=LLMConfig(
        provider="ollama/qwen3:8b",
        base_url="http://localhost:11434",
    ),
    schema=Products.json_schema(),
    extraction_type="schema",
    instruction="Extract every product. Preserve prices exactly as shown.",
    input_format="markdown",
    apply_chunking=True,
    extra_args={"temperature": 0},
)

async def extract_llm(url: str):
    config = CrawlerRunConfig(
        cache_mode=CacheMode.ENABLED,
        extraction_strategy=llm_strategy,
    )
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(url, config=config)
    if not result.success:
        raise RuntimeError(result.error_message)
    return validate_products(result.extracted_content)
```

本機模型省掉雲端 API 帳單，不會省掉延遲、記憶體與輸出錯誤。正式使用前，用固定頁面測欄位缺漏率，並記錄模型名稱、版本與 prompt；不要只確認 JSON 能 parse。

## CSS-first，LLM 只當有條件的 fallback

兩條路的切換條件應該是可觀測失敗，不是「CSS 看起來比較笨」：

```python
async def extract_products(url: str):
    try:
        rows = await extract_css(url)
        if rows and all(row.name.strip() for row in rows):
            return {"strategy": "css", "items": rows}
    except Exception as exc:
        css_error = str(exc)
    else:
        css_error = "empty_or_missing_required_fields"

    rows = await extract_llm(url)
    return {"strategy": "llm", "css_error": css_error, "items": rows}
```

這個 fallback 仍要有上限：每個 URL 最多呼叫一次 LLM。重試只處理 timeout 或暫時性服務錯誤；schema validation 失敗時，保存樣本後再修 selector 或 prompt。

## Deep crawl 一開始就要封頂

整站抓取最危險的不是速度慢，而是 calendar、faceted navigation 與 query parameter 讓 URL 無限展開。官方 [Deep Crawling](https://docs.crawl4ai.com/core/deep-crawling/)提供 BFS、DFS、filter chain 與 scorer；最小安全版本至少同時限制 domain、depth 與 page count：

```python
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
from crawl4ai.deep_crawling import BFSDeepCrawlStrategy

def canonical_url(url: str) -> str:
    parts = urlsplit(url)
    query = urlencode(sorted(
        (k, v) for k, v in parse_qsl(parts.query)
        if not k.startswith("utm_")
    ))
    return urlunsplit((parts.scheme, parts.netloc, parts.path, query, ""))

config = CrawlerRunConfig(
    cache_mode=CacheMode.ENABLED,
    deep_crawl_strategy=BFSDeepCrawlStrategy(
        max_depth=2,
        max_pages=30,
        include_external=False,
    ),
)

async with AsyncWebCrawler() as crawler:
    results = await crawler.arun("https://example.com/docs", config=config)

unique = {canonical_url(result.url): result for result in results}
```

production 還要用 `filter_chain` 排除登入、搜尋、日曆與檔案下載路徑。`canonical_url` 是自己的 ingestion key，不等於網站一定宣告了相同 canonical。

## Cache、並行與錯誤邊界

從 v0.5 起，舊的多個 boolean cache flags 已由 `CacheMode` 取代。官方不同頁面曾出現預設行為說法差異，因此 v0.9.2 範例一律顯式指定：需要新內容用 `BYPASS`，可接受重用用 `ENABLED`，不要依賴隱含預設。

批次 URL 可用 `arun_many()`，但並行數不是越高越好。先依 domain 限速，遇到 `429` 尊重 `Retry-After`，並把 HTTP 失敗、空內容、selector 失敗與模型 validation 失敗分開記錄。登入、CAPTCHA 與存取控制也不是多 retry 幾次就會消失的 crawler error。

## 什麼時候不該用 Crawl4AI

- 只抓靜態 HTML 且只需正文：Trafilatura 或 Readability 更輕。
- 要大規模、規則明確的排程 crawler：Scrapy／Crawlee 的成熟 middleware 可能更合適。
- 要操作表單、MFA 與多步互動：需要 browser agent，而不是 extraction strategy。
- 不知道要抓哪個 URL：先走 search；Crawl4AI 不是搜尋引擎。
- 不想維護瀏覽器、proxy 與 worker：選託管 crawler，把費用換成較少的維運責任。

Crawl4AI 的核心取捨不是「用不用 AI」，而是讓同一個 crawler 同時容納確定性與語意式抽取。穩定 DOM 先用 selector；只有 selector 不能表達的判斷才交給模型。把輸出 contract、fallback 條件與 crawl budget 先寫死，才不會讓方便的 API 變成無上限的成本與不可重現結果。

## 參考資料

- [Crawl4AI repository](https://github.com/unclecode/crawl4ai)
- [Crawl4AI Quick Start](https://docs.crawl4ai.com/core/quickstart/)
- [Markdown Generation](https://docs.crawl4ai.com/core/markdown-generation/)
- [LLM-Free Extraction Strategies](https://docs.crawl4ai.com/extraction/no-llm-strategies/)
- [LLM Extraction Strategies](https://docs.crawl4ai.com/extraction/llm-strategies/)
- [Deep Crawling](https://docs.crawl4ai.com/core/deep-crawling/)
- [Cache Modes](https://docs.crawl4ai.com/core/cache-modes/)
- [Browser, Crawler and LLM Configuration](https://docs.crawl4ai.com/api/parameters/)
- [CrawlResult](https://docs.crawl4ai.com/api/crawl-result/)
