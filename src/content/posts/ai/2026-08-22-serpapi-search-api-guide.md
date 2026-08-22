---
title: "SerpAPI 完整指南：多搜尋引擎、結構化 SERP 與非同步查詢"
date: 2026-08-22
category: ai
type: guide
tags: [serpapi, web-search, search-api, ai-agent]
lang: zh-TW
tldr: "SerpAPI 的核心是代管搜尋結果頁的抓取與解析：用 engine 指定來源，取得結構化 SERP，再自行處理地區、分頁、非同步輪詢與結果驗證。"
description: "從請求、結構化結果、地區與分頁，到 Search Archive 非同步流程，說明 SerpAPI 適合什麼搜尋工作，以及和 Serper、Brave Search、Tavily、Exa 的邊界。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-serpapi-search-api-guide-en)

[SerpAPI](https://serpapi.com/search-api) 是代管的 SERP（search engine results page，搜尋引擎結果頁）抓取與解析服務。你指定 Google、Bing、YouTube、Google Scholar 等搜尋介面，它負責送出查詢、處理代理伺服器與頁面變動，再把自然搜尋結果、廣告、知識圖譜或在地結果整理成 JSON。它的主要價值不是替你建立一份網頁索引，而是把「取得某個搜尋引擎此刻呈現的結果頁」包成 API。

這個定位很重要。SerpAPI 另外有仍在 preview 的自有 Search Index API，但本文談的是它成熟的多引擎 SERP API layer，不把兩者混為一談。若產品要比較排名、追蹤特定搜尋版面，或同時查一般搜尋、購物、地圖與學術結果，SerpAPI 很合適；若只想替 Agent 找幾篇相關文章並抽出答案，它不一定是最短路徑。

本文沿著一筆請求的生命週期走：`engine` request → structured result → pagination/location → async/archive → production validation。看完應該能寫出一個不會只在 demo 正常的搜尋整合。

## 從 engine request 到結構化結果

所有搜尋都從 `/search` 進入，`engine` 決定後續參數和回傳結構。以下用 Google engine 示範；API key 只從伺服器端環境變數讀取，不要放進前端 bundle、網址範例或版本控制。

```ts
const params = new URLSearchParams({
  engine: "google",
  q: "site:cloudflare.com workers ai agents",
  location: "Taipei City, Taiwan",
  gl: "tw",
  hl: "zh-tw",
  api_key: process.env.SERPAPI_API_KEY!,
});

const response = await fetch(`https://serpapi.com/search.json?${params}`);
if (!response.ok) {
  throw new Error(`SerpAPI HTTP ${response.status}`);
}

const data = await response.json();
if (data.search_metadata?.status !== "Success" || data.error) {
  throw new Error(data.error ?? "Search did not complete successfully");
}

const results = (data.organic_results ?? []).map((item: any) => ({
  title: item.title,
  url: item.link,
  snippet: item.snippet,
  position: item.position,
}));
```

Google engine 的 JSON 不只有 `organic_results`。依結果頁實際出現的版位，還可能有 local results、ads、knowledge graph、answer box、images、news、shopping 或 videos。這正是 SerpAPI 與「只回傳十條網址」API 的差異：它保留 SERP 的版面語意，適合排名監測、競品研究與垂直搜尋資料擷取。

代價是 schema 依 engine 和查詢而變。不要假設每次都有 `organic_results`，也不要把 HTTP 200 當成業務成功。官方狀態文件明確區分 `Processing`、`Queued`、`Success` 與 `Error`；而 `Success` 仍可能是空結果。正式環境至少要同時檢查 HTTP status、`search_metadata.status`、頂層 `error`，再驗證應用真正需要的欄位。

## 地區與分頁不是附加選項

搜尋結果會受地區、語言、國家網域和裝置影響。未指定 `location` 時，結果可能承接代理伺服器的位置；只傳 `location`，來源國家仍可能影響結果。Google engine 文件因此建議用城市層級的 `location`，並搭配 `gl` 固定國家。若名稱可能有多個匹配，先呼叫免費的 [Locations API](https://serpapi.com/locations-api)，儲存回傳的 canonical name 或 location ID，而不是每次讓服務猜測。

分頁也要由 engine 的回應驅動。Google 可以用 `start=10` 取得下一頁，但比較穩妥的做法是讀 `serpapi_pagination.next`：該 URL 會保留原查詢參數。迴圈仍需設定頁數上限、結果去重與停止條件，避免某個 engine 的版面變化造成無限抓取。

```ts
let nextUrl: string | undefined = firstUrl;
const seen = new Set<string>();

for (let page = 0; page < 3 && nextUrl; page += 1) {
  const response = await fetch(nextUrl);
  const data = await response.json();

  if (!response.ok || data.search_metadata?.status !== "Success" || data.error) {
    throw new Error(data.error ?? `Search failed on page ${page + 1}`);
  }

  for (const item of data.organic_results ?? []) {
    if (item.link) seen.add(item.link);
  }
  nextUrl = data.serpapi_pagination?.next;
}
```

這裡的「位置」是重現查詢條件，不是保證所有使用者都看到相同排名。搜尋引擎仍可能依時間、實驗版面與個人化因素調整結果。做監測時，把 engine、query、location、`gl`、`hl`、device 與抓取時間一起存下來，才有辦法解釋差異。

## 非同步查詢與 Search Archive

同步模式會維持 HTTP 連線直到結果完成。大量批次工作可以加上 `async=true`，先取得 `search_metadata.id`，再用 [Search Archive API](https://serpapi.com/search-archive-api) 輪詢。官方文件列出的狀態是 `Queued`、`Processing`、`Success` 或錯誤；完成後的 JSON 或 HTML 只會在 archive 保留有限期間，上線時應重新確認期限。

```ts
async function waitForSearch(searchId: string) {
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    const url = new URL(`https://serpapi.com/searches/${searchId}.json`);
    url.searchParams.set("api_key", process.env.SERPAPI_API_KEY!);

    const response = await fetch(url);
    const data = await response.json();
    const status = data.search_metadata?.status;

    if (status === "Success") return data;
    if (status === "Error" || data.error) throw new Error(data.error);
    await new Promise((resolve) => setTimeout(resolve, 1_500));
  }

  throw new Error("SerpAPI search timed out");
}
```

`async=true` 不能和 `no_cache=true` 一起用。SerpAPI 的快取只會在所有查詢參數完全相同時命中；目前官方文件說命中快取不計搜尋額度，但快取期間可能調整。這表示「要最新結果」與「要可預測成本」是不同需求：不要在全域預設關閉快取，而應讓少數時效敏感工作明確要求新抓取。

Archive 也不是你的永久資料庫。若結果需要稽核或重跑，成功後就把必要欄位、原始 search ID、查詢參數與時間寫進自己的儲存空間。若查詢可能包含敏感資訊，先看 SerpAPI 的資料處理與保存條件；官方文件另提供企業方案的 `zero_trace`，但開啟後會降低除錯能力。服務條款也明確表示不保證服務永不中斷或完全無錯，因此 timeout、重試與降級路由仍是你的責任。

## 正式環境要驗證什麼

先把「搜尋成功」定義成應用可檢查的 contract，而不是看到 JSON 就算成功：

1. **輸入白名單**：限制可用 engine、頁數、地區與查詢長度，API key 僅留在後端。
2. **狀態驗證**：檢查 HTTP status、`search_metadata.status` 和 `error`；把空結果當成獨立情況。
3. **schema 驗證**：每個 engine 各自定義最小 schema；額外欄位允許通過，必要欄位缺少就告警。
4. **重試邊界**：只對 429、5xx 或處理中狀態採指數退避；400、401、403 不要盲目重試。
5. **可觀測性**：記錄 search ID、engine、耗時、狀態、結果數與快取策略，但不要記錄 API key。
6. **結果品質**：抽樣檢查目標版位是否存在、網址是否可開啟，以及同一固定查詢的 schema 是否漂移。

真正容易漏掉的是「解析成功但產品不能用」。例如 `Success` 卻沒有自然搜尋結果、地區名稱選到錯的城市，或 answer box 有內容但沒有應用需要的來源網址。這些都不是單看 uptime 能發現的問題。

## 和 Serper、Brave Search、Tavily、Exa 怎麼分

| 工具 | 主要抽象 | 優先考慮的情況 |
|---|---|---|
| [SerpAPI](https://serpapi.com/search-api) | 多種搜尋引擎與垂直 SERP 的代管抓取、解析 | 要指定來源引擎、保留 SERP 版位，或查購物、地圖、學術等垂直結果 |
| [Serper](https://serper.dev/) | 精簡的 Google 搜尋 API | 只需要 Google 類型結果，希望整合面較小 |
| [Brave Search API](https://api-dashboard.search.brave.com/app/documentation) | Brave 自有索引提供的搜尋 API | 想降低對 Google SERP 的依賴，直接使用獨立搜尋索引 |
| [Tavily](/posts/ai/2026-08-21-tavily-search-api-guide) | 面向 AI 檢索的搜尋、內容與答案工作流 | Agent 想拿可供回答使用的內容，不在意重現特定 SERP |
| [Exa](/posts/ai/2026-08-21-exa-neural-search-for-agents) | 語意／神經搜尋與內容擷取 | 查詢偏概念探索、相似頁面或研究型檢索 |

SerpAPI 最難取代的不是「搜尋」兩個字，而是 engine breadth 與 SERP fidelity。反過來說，如果你的 downstream 只接受 `{title, url, snippet}`，也不在乎結果來自哪個版面，多引擎 schema 可能只是額外複雜度。

## 整體取捨

SerpAPI 適合把搜尋結果頁當成資料來源的系統。它替你吸收反爬蟲、代理伺服器與頁面解析的大量維運工作，也讓同一個 API 入口連到多種搜尋引擎；你則要承擔 engine-specific schema、地區重現、非同步狀態與資料保存的工程責任。

最實際的導入方式，是先選一個 engine、三個固定查詢與一個明確版位，保存完整輸入和最小輸出 schema，連續跑幾天再決定是否擴大。若需求只是替 Agent 找資料，先比較 Tavily、Exa 或 Brave；若需求是「Google 在台北用手機搜尋這個詞時，SERP 出現了什麼」，SerpAPI 才真正對題。

> 文件與服務條款查核日期：2026-08-22。快取、archive 保存期限、方案功能與條款可能調整，上線前應再查官方頁面。

## 參考資料

- [SerpAPI — Google Search API](https://serpapi.com/search-api)
- [SerpAPI — Search Archive API](https://serpapi.com/search-archive-api)
- [SerpAPI — Supported Locations API](https://serpapi.com/locations-api)
- [SerpAPI — Status and Error Codes](https://serpapi.com/api-status-and-error-codes)
- [SerpAPI — Legal Documents](https://serpapi.com/legal)
- [Serper — Google Search API](https://serper.dev/)
- [Brave Search API documentation](https://api-dashboard.search.brave.com/app/documentation)
- [Tavily Search API documentation](https://docs.tavily.com/documentation/api-reference/endpoint/search)
- [Exa Search API documentation](https://docs.exa.ai/reference/search)
