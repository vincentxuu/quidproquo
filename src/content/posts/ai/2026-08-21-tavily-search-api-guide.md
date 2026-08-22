---
title: "Tavily Search API 完整指南：搜尋、抽取、Map 與 Crawl"
date: 2026-08-21
category: ai
type: guide
tags: [tavily, web-search, ai-agent, search-api, web-scraping]
lang: zh-TW
tldr: "Tavily 把 Search、Extract、Map、Crawl 做成同一組 agent 網路 API；免費方案每月有 1,000 credits，Search 的 basic、fast、ultra-fast 各用 1 credit，advanced 用 2 credits。"
description: "從第一個 Tavily Search 呼叫開始，說明搜尋深度、topic、全文抽取、網站 Map 與 Crawl、下游資料結構、錯誤重試、credits，以及查詢資料的隱私邊界。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-tavily-search-api-guide-en)

[Tavily](https://docs.tavily.com/documentation/about) 是給 AI agent 使用的雲端網路存取服務。`Search` 找來源並回傳相關片段，`Extract` 讀取已知 URL，`Map` 只找出網站內的網址，`Crawl` 則同時走訪網站與抽取內容。這四個端點放在一起，才是它和一般 SERP API 的主要差別。

本文把工具介紹和實作放在同一篇。主脊是一次檢索任務如何逐步擴大：先 Search，真的需要全文才 Extract，需要理解整個站才 Map 或 Crawl。資料查核日是 2026 年 8 月 21 日，本文沒有用帳號實際呼叫付費 API。程式碼與欄位是依官方 API reference 核對，不是延遲、命中率或反爬成功率實測。

## 先跑一個可控的 Search

先從 [Tavily dashboard](https://app.tavily.com/) 取得 API key，再安裝官方 Python SDK：

```bash
pip install tavily-python
export TAVILY_API_KEY='<YOUR_TAVILY_API_KEY>'
```

```python
import os
from tavily import TavilyClient

client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

response = client.search(
    query="Astro 目前的 stable release 是什麼？只找官方來源。",
    search_depth="basic",
    topic="general",
    max_results=5,
    include_domains=["astro.build", "github.com/withastro"],
    include_answer=False,
    include_raw_content=False,
    include_usage=True,
)

for item in response["results"]:
    print(item["title"], item["url"], item["score"])
```

官方 [Search API reference](https://docs.tavily.com/documentation/api-reference/endpoint/search) 顯示，每筆結果至少可帶標題、URL、相關內容與分數；開啟 `include_usage` 後，回應也會包含該次 credits 用量。`include_answer=False` 很重要：先保留來源，讓自己的程式決定是否要生成答案，不要一開始就把檢索與回答綁死。

## Search depth、topic 與回傳內容

`search_depth` 同時影響回傳內容、延遲取捨與 credits。依[官方說明](https://docs.tavily.com/documentation/best-practices/best-practices-search)，目前有四種深度：

| 深度 | 回傳內容 | 適合情境 |
|---|---|---|
| `ultra-fast` | 每個 URL 一段頁面摘要 | 互動式介面的低延遲提示 |
| `fast` | 依查詢重新排序的片段 | 要快，也要查詢相關片段 |
| `basic` | 依查詢重新排序的片段 | 多數一般搜尋的起點 |
| `advanced` | 搜尋範圍較廣的相關片段 | 冷門、新近或多面向問題 |

不要把 `advanced` 當固定預設。先用 `basic` 跑你真正會問的查詢；來源覆蓋不足時再升級。`auto_parameters=True` 雖然能自動選參數，但官方文件說它可能把深度升成 `advanced`，因此需要可預測成本時應明確指定 `search_depth`。

`topic` 是另一條軸。`general` 用於一般網路內容，`news` 用於近期新聞，API reference 也列出 `finance`。日期限制可用 `time_range` 或明確的 `start_date`、`end_date`。如果只想限定可信來源，用 `include_domains`；已知某站會製造大量噪音，就放進 `exclude_domains`。

Search 預設回傳的是相關片段，不等於整頁。把 `include_raw_content` 設為 `"markdown"` 才會在同一次搜尋加入清理後的頁面內容；也可以設為 `"text"`。官方[最佳實務](https://docs.tavily.com/documentation/best-practices/best-practices-search)建議，完整抽取可拆成 Search 找 URL、Extract 讀內容兩步。這樣比較容易控制 token、失敗處理與 credits。

## 已知 URL 用 Extract

已經知道要讀哪幾頁，就不要再搜尋一次。`Extract` 可接收一個或多個 URL，回傳 Markdown 或純文字；失敗的 URL 會另外放在 `failed_results`，不必讓整批一起失敗。

```python
pages = client.extract(
    urls=[
        "https://docs.tavily.com/documentation/api-credits",
        "https://docs.tavily.com/documentation/rate-limits",
    ],
    extract_depth="basic",
    format="markdown",
    include_usage=True,
)

for page in pages["results"]:
    print(page["url"], page["raw_content"][:500])

for failure in pages["failed_results"]:
    print("failed", failure)
```

依 [Extract API reference](https://docs.tavily.com/documentation/api-reference/endpoint/extract)，`advanced` 會嘗試取得更多資料，包括表格與嵌入內容，但可能增加延遲。若提供 `query`，Tavily 會依意圖重新排序抽取片段；此時可用 `chunks_per_source` 控制每頁帶回多少片段。想保存整頁做後續切塊時不要給 `query`，想把少量證據直接放進 agent context 才使用它。

## 先 Map，再決定要不要 Crawl

`Map` 和 `Crawl` 都從一個根網址開始走訪連結，但交付物不同：

- `Map` 只回傳找到的 URL，適合先看網站結構、篩掉不相關路徑。
- `Crawl` 會走訪並抽取頁面，適合文件站、產品目錄或要建檢索資料集的網站。

```python
site_map = client.map(
    url="https://docs.tavily.com",
    instructions="Find API reference and best-practice pages",
    max_depth=2,
    max_breadth=20,
    limit=50,
    select_paths=[r"/documentation/.*"],
    exclude_paths=[r"/documentation/integrations/.*"],
    allow_external=False,
    include_usage=True,
)

print(site_map["results"])
```

```python
crawl = client.crawl(
    url="https://docs.tavily.com",
    instructions="Extract pages about Search, Extract, Map, and Crawl",
    max_depth=2,
    max_breadth=20,
    limit=30,
    select_paths=[r"/documentation/api-reference/endpoint/.*"],
    allow_external=False,
    extract_depth="basic",
    format="markdown",
    include_usage=True,
)
```

[Map API reference](https://docs.tavily.com/documentation/api-reference/endpoint/map) 與 [Crawl API reference](https://docs.tavily.com/documentation/api-reference/endpoint/crawl) 都提供 `max_depth`、`max_breadth`、`limit` 與路徑規則。安全起點是小深度、小上限、`allow_external=False`。先看 Map 結果，再把相同的選擇規則交給 Crawl；不要從首頁直接放任 crawler 走完整個網站。

`instructions` 不是免費的語意糖。它會用自然語言決定哪些頁面值得走訪，而且官方 credits 文件說，Map 加上 instructions 後的計價會提高。若網站路徑穩定，先用 `select_paths`、`exclude_paths`；正規表示式說不清意圖時才加 instructions。

## 下游不要只存 answer

Tavily 可以用 `include_answer` 直接生成回答，但正式流程應保存可追溯的證據。最小資料結構至少要留下 query、來源 URL、標題、內容片段與檢索分數：

```python
from dataclasses import asdict, dataclass

@dataclass
class Evidence:
    query: str
    title: str
    url: str
    content: str
    score: float | None

query = "Tavily free plan credits"
response = client.search(
    query=query,
    search_depth="basic",
    max_results=5,
    include_answer=False,
)

evidence = [
    asdict(Evidence(
        query=query,
        title=item["title"],
        url=item["url"],
        content=item["content"],
        score=item.get("score"),
    ))
    for item in response["results"]
]
```

接下來才讓自己的 LLM 依固定 JSON Schema 產生結論與 citation URL。這種做法把「Tavily 找到什麼」和「模型如何解讀」分開，也能替換搜尋供應商。分數只適合在同一批結果內做排序線索；它不是跨查詢可比較的正確率。

## 錯誤與重試要分流

Search 的[錯誤回應](https://docs.tavily.com/documentation/api-reference/endpoint/search)區分了幾種狀況。`400` 是參數錯誤，`401` 是缺少或無效的 API key，`429` 是請求過多。`432` 是方案用量上限，`433` 是 pay-as-you-go 上限，`500` 是服務端錯誤。不要把它們全部套同一個 retry。

- `400`、`401`：修正請求或憑證，原樣重試沒有意義。
- `429`：依回應的 `retry-after` 等待，再做有上限的重試。
- `432`、`433`：停止呼叫，通知預算或帳號管理流程。
- `500`：使用指數退避與 jitter，並保留總時限。

官方[限流文件](https://docs.tavily.com/documentation/rate-limits)明確說 `429` 會帶 `retry-after`。批次搜尋仍要限制同時呼叫數量，讓單筆失敗回到自己的 query，不要讓 `asyncio.gather` 的一個例外取消整批。

## 免費 credits 與實際計價

依[官方定價文件](https://docs.tavily.com/documentation/api-credits)，Researcher 免費方案每月有 1,000 credits，不需信用卡。Credits 在每月第一天重設；用完後請求會停止，除非升級或啟用付費方式。這是每月用量配額，不是可累積的現金餘額。

| 操作 | Credits |
|---|---:|
| Search `basic`、`fast`、`ultra-fast` | 每次 1 |
| Search `advanced` | 每次 2 |
| Extract `basic` | 每 5 個成功 URL 為 1 |
| Extract `advanced` | 每 5 個成功 URL 為 2 |
| Map 無 instructions | 每 10 個成功頁面為 1 |
| Map 有 instructions | 每 10 個成功頁面為 2 |
| Crawl | Map 成本加 Extract 成本 |

Pay-as-you-go 的公開價格是每 credit 0.008 美元。正式估算不要只數 API calls：同一個 Crawl 會依成功 map 與 extract 的頁數累加。實際程式應開 `include_usage`、記錄 endpoint 與 query，再從一週真實流量估預算。

## 隱私政策比「ZDR」標語更重要

Tavily 的 [FAQ](https://docs.tavily.com/faq/faq)把 zero data retention 列為安全特性。2025 年 11 月更新的[隱私政策](https://www.tavily.com/privacy)寫得更具體：平台會蒐集 query data 與上傳文件，用來提供檢索。除非合約另有約定，也可能使用部分 query data 改善未來回應。政策也說 Tavily 會直接或透過第三方索引取得網路資料。

因此，不能只看到 FAQ 的 ZDR 就推定所有帳號、所有 API key 都不留查詢。若 query 會帶客戶名稱、內部代碼、尚未公開的產品資訊或個人資料，先確認合約、DPA、資料處理地區與 ZDR 適用範圍。確認前，最安全的動作是不要把敏感資料放進 query。

這也是雲端 Search API 和自架方案的根本差異。SearXNG 可控制中介層與日誌，但查詢仍會送往啟用的上游引擎；完全不能外流的資料，應該查自己的索引，而不是換一家雲端搜尋服務。

## Tavily、Exa、Linkup、SearXNG 怎麼選

| 工具 | 優先考慮的情境 |
|---|---|
| [Tavily](https://docs.tavily.com/documentation/api-reference/endpoint/search) | 想用同一組 API 做搜尋、已知頁面抽取與網站走訪 |
| [Exa](/posts/ai/2026-08-21-exa-neural-search-for-agents) | 重視神經檢索、自有網頁索引與語意找頁能力 |
| [Linkup](/posts/ai/2026-08-21-linkup-search-api-guide) | 想明確選 standard／deep，或直接要求 JSON Schema 輸出 |
| [SearXNG](/posts/ai/2026-08-21-searxng-complete-guide) | 要自架元搜尋、控制上游組合，也願意自己維運與抓全文 |

這張表不是效能排名。本站沒有把四個服務放在同一組查詢上實測。選型時先拿二十個真實問題做小型資料集，記錄來源命中、可引用性、延遲與 credits。敏感查詢要另外分流，不要讓平均分數掩蓋資料邊界。

## 整體來說

Tavily 的價值不是「又一支 search API」，而是把找 URL、讀已知頁面、看網站結構、抓多頁內容放在同一個認證與計價模型下。穩健的起點是 `basic` Search、五筆結果、不帶 answer 和 raw content。找到真正需要的 URL 後再 Extract；只有任務範圍本來就是整個網站，才進 Map 與 Crawl。

這篇沒有驗證 Tavily 對特定網站的抓取成功率，也沒有測量四種 search depth 的實際延遲與品質。那些需要固定查詢集、同時段呼叫與可重跑的評分方法，不能從文件推論。本文能確認的是 API 形狀、公開計價、錯誤語意與官方揭露的資料邊界。

## 參考資料

- [Tavily Quickstart](https://docs.tavily.com/documentation/quickstart)
- [Tavily Search API reference](https://docs.tavily.com/documentation/api-reference/endpoint/search)
- [Tavily Extract API reference](https://docs.tavily.com/documentation/api-reference/endpoint/extract)
- [Tavily Map API reference](https://docs.tavily.com/documentation/api-reference/endpoint/map)
- [Tavily Crawl API reference](https://docs.tavily.com/documentation/api-reference/endpoint/crawl)
- [Search best practices](https://docs.tavily.com/documentation/best-practices/best-practices-search)
- [Credits and pricing](https://docs.tavily.com/documentation/api-credits)
- [Rate limits](https://docs.tavily.com/documentation/rate-limits)
- [Tavily FAQ](https://docs.tavily.com/faq/faq)
- [Tavily Privacy Policy](https://www.tavily.com/privacy)
- 站內：[Exa 神經搜尋 API](/posts/ai/2026-08-21-exa-neural-search-for-agents)
- 站內：[Linkup Search API 完整指南](/posts/ai/2026-08-21-linkup-search-api-guide)
- 站內：[SearXNG 完整介紹](/posts/ai/2026-08-21-searxng-complete-guide)
