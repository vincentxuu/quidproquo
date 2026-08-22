---
title: "Serper Search API 完整指南：把 Google 搜尋結果變成 Agent 可用 JSON"
date: 2026-08-22
category: ai
type: guide
tags: [serper, web-search, search-api, ai-agent]
lang: zh-TW
tldr: "Serper 是第三方 Google SERP API：用一個 POST 請求取得 organic、knowledgeGraph、peopleAlsoAsk 等結構化 JSON；真正上線前仍要驗證選填欄位、URL、重試與引用證據。"
description: "從 Serper Search API 的請求、結果結構、地區語言與分頁，到 production validation 與 SerpAPI、Brave、Tavily、Exa 的選擇邊界。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-serper-search-api-guide-en)

[Serper](https://serper.dev/) 是第三方 Google SERP API。你的程式把查詢送到 Serper，Serper 代為取得 Google 搜尋結果頁（Search Engine Results Page, SERP），再把頁面上的自然搜尋結果、知識圖譜與「其他人也問了」等區塊整理成 JSON。

這個定位要先講清楚：Serper **不是自有搜尋索引**，也不是替網頁建立語意索引的搜尋引擎。它提供的是 Google 結果頁的程式化存取層。這使它很適合需要 Google 結果形狀的 agent，也代表結果欄位會跟著查詢、地區和當下的 SERP 版面變動。

本文主脊是一筆請求如何走到可上線的資料：送出 request、辨認 result shapes、控制地區與分頁，最後在進入模型前完成驗證。資料查核日為 2026 年 8 月 22 日；範例依 Serper 官方網站與 API playground 顯示的介面整理，沒有用付費帳號做延遲或命中率實測。

## 送出第一個 Search request

先在 Serper dashboard 建立 API key，放進伺服器端環境變數。不要把 key 寫進前端程式、文章範例、紀錄檔或 Git repository。

```bash
export SERPER_API_KEY='<YOUR_SERPER_API_KEY>'
```

Search 使用 `POST https://google.serper.dev/search`，JSON body 至少要有 `q`。以下 Node.js 範例不需要額外套件：

```js
const response = await fetch("https://google.serper.dev/search", {
  method: "POST",
  headers: {
    "X-API-KEY": process.env.SERPER_API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    q: "Astro content collections official documentation",
    gl: "tw",
    hl: "zh-tw",
    num: 10,
    page: 1,
  }),
});

if (!response.ok) {
  throw new Error(`Serper request failed: ${response.status}`);
}

const data = await response.json();
console.log(data.organic?.map(({ title, link }) => ({ title, link })));
```

`X-API-KEY` 是憑證，必須只在 server、worker 或受控的後端工作中加入。瀏覽器直接呼叫會讓訪客在開發者工具中看到它；需要從前端搜尋時，應先呼叫自己的後端端點，再由後端轉送必要參數。

## Result shapes：不要假設每次都有同一組欄位

Serper [官方首頁的 Search 範例](https://serper.dev/)展示了幾種頂層區塊：

- `organic`：一般自然搜尋結果；常見欄位有 `title`、`link`、`snippet`、`position`，部分結果另有 `date`、`attributes` 或 `sitelinks`。
- `knowledgeGraph`：Google 知識圖譜；可能包含標題、類型、網站、描述、圖片與屬性。
- `peopleAlsoAsk`：相關問題，以及可能存在的摘要、標題與來源連結。
- `relatedSearches`：延伸查詢字串。

其他端點會有不同主體，例如 `/images` 回 `images`、`/news` 回 `news`。官方網站目前也列出 Maps、Places、Videos、Shopping、Scholar、Patents 與 Autocomplete。這些是不同的 SERP 類型，不該全部硬塞進同一個 TypeScript interface。

對 agent 最實用的通常是 `organic`。但「常見」不等於「必填」：某筆結果可能沒有 snippet，某次查詢可能沒有 knowledge graph，Google 也可能調整版面。先把資料正規化成自己的最小結構，再交給模型：

```ts
type SearchEvidence = {
  title: string;
  url: string;
  snippet?: string;
  position?: number;
};

function normalizeOrganic(payload: unknown): SearchEvidence[] {
  if (!payload || typeof payload !== "object") return [];
  const organic = (payload as { organic?: unknown }).organic;
  if (!Array.isArray(organic)) return [];

  return organic.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    if (typeof row.title !== "string" || typeof row.link !== "string") return [];

    try {
      const url = new URL(row.link);
      if (url.protocol !== "https:" && url.protocol !== "http:") return [];
      return [{
        title: row.title,
        url: url.toString(),
        snippet: typeof row.snippet === "string" ? row.snippet : undefined,
        position: typeof row.position === "number" ? row.position : undefined,
      }];
    } catch {
      return [];
    }
  });
}
```

這層轉換還有一個好處：模型只看到完成任務所需的欄位，不會把整包 SERP JSON、圖片網址與無關屬性都吃進 context window。

## Location、language 與 pagination 要一起測

搜尋結果沒有「全球唯一版本」。請求中的 `gl` 控制國家／地區，`hl` 控制介面語言；若要指定更細的地理情境，可使用 `location`。例如繁體中文的台灣結果可從 `gl: "tw"`、`hl: "zh-tw"` 開始，再用產品真正服務的城市測試。

這三個值不能當裝飾。搜尋「附近咖啡店」、新聞、購物與同名品牌時，地區差異會直接改變結果。production 做法是把 locale 明確映射成一組允許值，不要讓 agent 自由拼出任何字串：

```ts
const searchLocales = {
  "zh-TW": { gl: "tw", hl: "zh-tw", location: "Taiwan" },
  "en-US": { gl: "us", hl: "en", location: "United States" },
} as const;
```

`page` 從第一頁開始往後取，`num` 控制單頁要求的結果數。不要寫成「一直翻到沒有資料」的無界迴圈：agent 很容易因模糊任務花掉大量查詢額度，後頁的品質也通常較低。實務上先取第一頁，只有來源不足且任務允許時才取下一頁，並設定查詢次數上限。

分頁去重應該使用正規化 URL，而不是標題。移除 `utm_*` 等追蹤參數、統一 host 大小寫，再依 canonical URL 去重；不要移除所有 query parameters，因為文件頁的版本或文章識別碼可能真的放在 query string。

## Production validation：搜尋成功不等於證據可用

HTTP 200 只代表 Serper 回了資料，不代表資料適合直接回答。上線前至少做四層檢查：

1. **輸入限制**：限制查詢長度、`num`、最大頁數與可用 locale；拒絕空查詢。
2. **回應驗證**：把所有 SERP 區塊視為選填，只接受合法的 HTTP(S) URL 與字串欄位。
3. **操作韌性**：對網路錯誤與可重試狀態使用 exponential backoff 加 jitter；對驗證失敗、權限或額度錯誤不要盲目重送。
4. **證據流程**：SERP snippet 只用來挑來源。需要引用、數字或完整上下文時，再抓取原頁並保存 URL、擷取時間與實際引用段落。

快取也要按產品需求決定。Serper 官方 FAQ 表示查詢會即時送往 Google、不快取結果；這是供應商對服務行為的說明，不代表你的應用也不能快取。相同查詢可以短期快取以抑制重複 agent call，但新聞或價格資訊應使用較短 TTL，並在答案上標出檢索時間。

隱私邊界同樣重要：查詢字串會送到第三方服務。不要把姓名、電子郵件、內部客戶編號或未公開專案內容直接拼進 query。先刪除識別資訊；若查詢本身就是敏感資料，就不要使用外部搜尋 API。

## 跟 SerpAPI、Brave、Tavily、Exa 的邊界

這不是一張抽象評分表，而是先看你需要哪種資料來源與輸出形狀：

| 工具 | 核心邊界 | 適合從哪個問題開始 |
|---|---|---|
| [Serper](https://serper.dev/) | 第三方 Google SERP API，回傳整理後的結果區塊 | 「我要用簡單 JSON 取得 Google 結果。」 |
| [SerpAPI](https://serpapi.com/search-api) | SERP API，文件涵蓋多種搜尋引擎與大量引擎特有參數 | 「我要跨引擎，或精細控制某個 SERP 垂直類型。」 |
| [Brave Search API](https://api-dashboard.search.brave.com/app/documentation) | 由 Brave 自有 web index 提供搜尋 API | 「我不要把 Google SERP 當資料來源。」 |
| [Tavily](https://docs.tavily.com/documentation/about) | 面向 AI agent 的 Search、Extract、Map、Crawl 工作流 | 「我想在同一服務中找 URL、抽全文與走訪網站。」 |
| [Exa](https://docs.exa.ai/reference/search) | 自有索引與語意／神經檢索，能連同頁面內容交付 | 「我的查詢是概念描述，不只是 Google 關鍵字。」 |

Serper 的優勢是介面小、接入直接，而且保留 Google SERP 的熟悉形狀。限制也是同一件事：它不是全文抽取器，不替你驗證來源，也不提供自有索引的替代視角。若 agent 的下一步一定要讀正文，就把 Serper 當 discovery layer，再接一個受限的 fetch／extract layer。

價格、額度與延遲很容易過期。本文不把它們寫進選型結論；截至 2026 年 8 月 22 日，Serper 官方首頁列有 top-up 方案、各方案 queries-per-second 與一般查詢回傳時間，但採購前應直接重查[當日官方方案](https://serper.dev/)，並用自己的查詢集做延遲與結果品質測試。

## 整體來說

當需求明確是「把 Google 搜尋結果頁變成 agent 可處理的 JSON」，Serper 是邏輯很乾淨的起點。最小可行實作不是把 `organic` 原封不動塞給 LLM，而是固定 locale 和查詢預算、驗證選填欄位、正規化 URL，再對真的要引用的頁面做二次抓取。

如果需求其實是全文研究、語意搜尋或避免依賴 Google SERP，就應在架構階段改選 Tavily、Exa 或 Brave，而不是期待一支 SERP API 同時扮演 crawler、index 與 fact checker。延伸閱讀可接本站的 [Tavily Search API 完整指南](/posts/ai/2026-08-21-tavily-search-api-guide)、[Exa 神經搜尋介紹](/posts/ai/2026-08-21-exa-neural-search-for-agents)與[搜尋結果不等於網頁證據](/posts/ai/2026-08-22-agent-search-query-writing)。

## 參考資料

- [Serper 官方網站、API 範例、端點類型、方案與 FAQ](https://serper.dev/)
- [SerpAPI Search API 官方文件](https://serpapi.com/search-api)
- [Brave Search API 官方文件](https://api-dashboard.search.brave.com/app/documentation)
- [Tavily 官方文件：About](https://docs.tavily.com/documentation/about)
- [Exa Search API 官方文件](https://docs.exa.ai/reference/search)

