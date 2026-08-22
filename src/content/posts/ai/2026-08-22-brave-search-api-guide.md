---
title: "Brave Search API 完整指南：用獨立搜尋索引替 Agent 取得網路結果"
date: 2026-08-22
category: ai
type: guide
tags: [brave-search, web-search, search-api, ai-agent]
lang: zh-TW
tldr: "Brave Search API 以 Brave 自有的網頁索引與排名模型提供 Web、News、Images、Videos 與 LLM Context 五類端點；核心搜尋不只是 Google SERP 的 API 包裝。"
description: "從獨立索引、搜尋端點與回應格式，到 freshness、地區、Safe Search、production 驗證、隱私與其他 Agent 搜尋 API 的選型邊界。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-brave-search-api-guide-en)

[Brave Search API](https://brave.com/search/api/) 是把 Brave Search 的網頁索引開放給程式使用的搜尋服務。它不是把 Google 或 Bing 的結果頁抓回來再轉成 JSON；Brave 的說法是，一般網頁結果來自自有索引與排名模型。這讓 Agent 可以取得另一套搜尋排序，而不只是替 Google SERP 換一層 API 包裝。

「獨立」也不能擴張解讀成整個產品完全沒有第三方資料。官方 [Web Search 文件](https://api-dashboard.search.brave.com/app/documentation/web-search)明載，運動、股票、天氣等 rich results 會整合第三方 API；網頁本身當然也屬於第三方內容。精準的說法是：**核心 Web Search 使用 Brave 自有的索引與排名模型，但某些附加資料仍可能來自第三方。**

## 先選對端點

Brave 不只提供一個通用搜尋路由。先按輸出用途選端點，會比把所有問題都丟給 Web Search 穩定：

| 端點 | 主要輸出 | 適合情境 |
|---|---|---|
| [`/v1/web/search`](https://api-dashboard.search.brave.com/api-reference/web/search/get) | 排名後的頁面、標題、URL、摘要及可能的其他結果區塊 | 搜尋 UI、來源探索、需要自行控制後處理的 Agent |
| [`/v1/news/search`](https://api-dashboard.search.brave.com/api-reference/news/news_search/get) | 新聞結果與發布時間等欄位 | 新聞監測、近期事件 |
| [`/v1/images/search`](https://api-dashboard.search.brave.com/api-reference/images/image_search) | 圖片、縮圖、來源頁與尺寸 | 視覺素材探索；仍須自行確認授權 |
| [`/v1/videos/search`](https://api-dashboard.search.brave.com/api-reference/videos/video_search/get) | 影片結果與來源資訊 | 教學影片或影音探索 |
| [`/v1/llm/context`](https://api-dashboard.search.brave.com/documentation/services/llm-context) | 依 URL 分組、為模型整理的文字片段 | 直接把搜尋內容送進 LLM 的 grounding 流程 |

Web Search 的 `web.results` 通常含 `title`、`url` 與 `description`；開啟 `extra_snippets=true` 後，每筆結果最多可再帶五段替代摘要。LLM Context 則改成以資料片段為中心的排序，省去自己把搜尋摘要拼成 prompt 的工作。若系統要呈現傳統搜尋結果，選 Web；若目標是提供模型上下文，先測 LLM Context。

## 最小可用呼叫

先在 dashboard 建立 subscription token，放進伺服器端環境變數。不要把金鑰寫入文章、前端 bundle、行動 App 或公開 repository：

```bash
export BRAVE_SEARCH_API_KEY="replace-with-your-token"

curl --get 'https://api.search.brave.com/res/v1/web/search' \
  --data-urlencode 'q=Cloudflare Workers AI agent' \
  --data-urlencode 'count=5' \
  --data-urlencode 'country=TW' \
  --data-urlencode 'search_lang=zh-hant' \
  --data-urlencode 'safesearch=strict' \
  -H 'Accept: application/json' \
  -H "X-Subscription-Token: ${BRAVE_SEARCH_API_KEY}"
```

在 Node.js 裡也應該由後端讀取環境變數，並只保留下游真正需要的欄位：

```js
const params = new URLSearchParams({
  q: "Brave Search API independent index",
  count: "5",
  freshness: "pm",
  safesearch: "strict",
});

const response = await fetch(
  `https://api.search.brave.com/res/v1/web/search?${params}`,
  {
    headers: {
      Accept: "application/json",
      "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY,
    },
  },
);

if (!response.ok) {
  throw new Error(`Brave Search failed: ${response.status}`);
}

const body = await response.json();
const evidence = (body.web?.results ?? []).map((item) => ({
  title: item.title,
  url: item.url,
  snippet: item.description,
}));
```

這層正規化很重要：不要讓模型直接依賴供應商完整 response。保留 query、URL、標題、摘要、抓取時間與供應商名稱，日後才能重播、稽核，也能換成其他搜尋服務。

## freshness、地區與 Safe Search 要明確設定

依 [Web Search API reference](https://api-dashboard.search.brave.com/api-reference/web/search/get)，`freshness` 可用 `pd`、`pw`、`pm`、`py` 表示過去一天、一週、一個月、一年，也可使用 `YYYY-MM-DDtoYYYY-MM-DD`。日期依內容回報的發布或更新時間判斷，不等於 Brave 實際讀到頁面的時間。因此需要法規版本、售價或軟體 release 時，仍要開啟來源頁驗證日期。

`country` 影響結果來源地區，`search_lang` 偏好內容語言，`ui_lang` 則控制回應中介面文字的語系；三者不是同一件事。服務台灣讀者時，不要只在 query 寫「台灣」，應明確傳入支援的地區與語言值，並用真實查詢驗證召回結果。

Web Search 的 `safesearch` 預設為 `moderate`，圖片端點則預設 `strict`。面向一般使用者的產品建議顯式指定，不要依賴可能隨版本變動的預設值。若開啟 spellcheck，也要記錄 response 裡被改寫的查詢，否則事後會不知道系統實際搜尋了什麼。

## Production 不是拿到 200 就算完成

搜尋結果是候選證據，不是事實判決。正式環境至少要做以下幾件事：

1. 對 `429`、`5xx` 與逾時做有上限的 exponential backoff，並設定整體 deadline。
2. 只有在 `query.more_results_available` 為真時才翻頁；不要盲目增加 offset 浪費額度。
3. 驗證 response schema，允許缺少 `web` 或結果少於 `count`，並拒絕非 HTTP(S) URL。
4. 高風險答案打開原始頁面交叉查核，保留引文與 URL；搜尋摘要可能截斷、過期或缺少上下文。
5. 把使用者輸入視為敏感資料：先移除不需要送出的姓名、帳號、內部代碼與機密內容。

Brave 的[定價頁](https://brave.com/search/api/)按請求量計費，並把查詢速率與功能依方案區分。價格、免費額度與容量會變，部署前應重新查 dashboard 與方案頁，不要把本文查核日的方案數字寫死進採購模型。官方 API reference 也列出多種錯誤回應，客戶端不能只處理成功路徑。

## 隱私、留存與內容權利

不要拿消費者版 Brave Search「預設隱私」的說法直接替 API 做保證。Brave 的 [API privacy notice](https://api-dashboard.search.brave.com/privacy-policy)在 **2025-12-04** 更新時寫明，API 查詢紀錄最多保留 90 天，用於計費與疑難排解。該文件也說 Brave 不蒐集能把查詢連回個人或裝置的識別資訊；API 客戶仍可能持有其他可識別使用者的資料。

因此產品方仍須在自己的隱私聲明裡說清楚查詢會送給 Brave，並依適用法律取得同意。現行 [Search API Terms](https://api-dashboard.search.brave.com/documentation/resources/terms-of-service)也把終端使用者告知與同意責任交給 API 客戶。若需求是零資料留存，不要從一般方案自行推定；官方把 Zero Data Retention 列為 Enterprise 能力，應以合約確認適用範圍。

API 回傳 URL 與摘要也不會把第三方內容授權轉給你。圖片下載、完整頁面抓取、長期儲存、再發布與模型訓練，都要另查方案權利與來源網站條款。

## 跟 Serper、SerpAPI、Tavily、Exa 怎麼分

| 工具 | 核心邊界 | 優先考慮的時機 |
|---|---|---|
| [Brave Search API](https://brave.com/search/api/) | Brave 自有索引與排名，另有 Web、新聞、圖片、影片及 LLM Context | 想讓 Agent 使用非 Google 包裝的通用搜尋來源 |
| [Serper](https://serper.dev/) | 官方定位是 Google Search API，提供搜尋、圖片、新聞、地圖、購物等 Google 結果類型 | 產品需求就是重現 Google SERP 結構 |
| [SerpAPI](https://serpapi.com/) | 解析多種搜尋引擎與垂直結果 | 同一套整合需要多個既有搜尋引擎或特定 SERP 元件 |
| [Tavily](/posts/ai/2026-08-21-tavily-search-api-guide) | 搜尋之外還整合 Extract、Map、Crawl | 想用一個 API 完成找 URL、讀頁面與走訪網站 |
| [Exa](/posts/ai/2026-08-21-exa-neural-search-for-agents) | 以神經搜尋與內容取得服務 Agent 工作流 | 查詢偏語意探索，並需要頁面內容而非傳統 SERP |

這張表不是品質排名。真正的選型測試應拿自己的查詢集，比較來源覆蓋、日期正確性、重複率、延遲與每個成功答案的成本。若供應商獨立性是架構需求，Brave 的自有索引是明確差異。若要的是 Google 的 local pack、shopping 或特定 SERP 元件，Serper 或 SerpAPI 的產品邊界更貼近需求。

## 整體來說

Brave Search API 最清楚的定位，不是「另一個便宜搜尋 API」，而是讓應用程式直接使用 Brave 的搜尋索引與排名。先用 Web Search 保留可稽核的 URL 與摘要；確定模型真的需要更密集的片段，再測 LLM Context。上線前把 freshness、地區、Safe Search、錯誤重試、資料最小化與來源查證寫進程式，不要留在 prompt 裡碰運氣。

## 參考資料

- [Brave Search API 產品與定價頁](https://brave.com/search/api/)
- [Brave Web Search 文件](https://api-dashboard.search.brave.com/app/documentation/web-search)
- [Brave Web Search API reference](https://api-dashboard.search.brave.com/api-reference/web/search/get)
- [Brave News Search API reference](https://api-dashboard.search.brave.com/api-reference/news/news_search/get)
- [Brave Image Search API reference](https://api-dashboard.search.brave.com/api-reference/images/image_search)
- [Brave Video Search API reference](https://api-dashboard.search.brave.com/api-reference/videos/video_search/get)
- [Brave LLM Context 文件](https://api-dashboard.search.brave.com/documentation/services/llm-context)
- [Brave Search independence announcement](https://brave.com/blog/search-independence/)
- [Brave Search API Privacy Notice](https://api-dashboard.search.brave.com/privacy-policy)
- [Brave Search API Terms of Use](https://api-dashboard.search.brave.com/documentation/resources/terms-of-service)
- [Serper 官方網站](https://serper.dev/)
- [SerpAPI 官方網站](https://serpapi.com/)
- 站內相關：[Tavily Search API 完整指南](/posts/ai/2026-08-21-tavily-search-api-guide)、[Exa：給 Agent 用的神經搜尋引擎](/posts/ai/2026-08-21-exa-neural-search-for-agents)、[如何讓搜尋結果變成可靠引用](/posts/ai/2026-08-22-search-results-reliable-citations)
