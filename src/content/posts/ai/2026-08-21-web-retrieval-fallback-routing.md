---
title: "AI Agent 上網查資料的完整路由：Search、Fetch、Crawler、Browser 怎麼切換"
date: 2026-08-21
category: ai
type: deep-dive
tags: [web-search, web-scraping, ai-agent, retrieval, browser-automation, http]
lang: zh-TW
series:
  name: "搜尋與爬取實戰"
  order: 7
tldr: "Agent 上網不該一律開瀏覽器：先依任務分流 Search 或 Fetch，再按狀態碼、內容品質、JS shell、登入與 challenge 訊號逐級升級；每一步都受 retry、budget、快取、去重與來源紀錄約束。"
description: "AI Agent 的 Web retrieval fallback routing：Search、Fetch、Crawler、Browser 與受控 stealth 的責任邊界、失敗分類、decision table、預算與可執行 router pseudocode。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-web-retrieval-fallback-routing-en)

[系列前一篇](/posts/ai/2026-05-08-local-deep-research-walkthrough)談的是研究 Agent 怎麼規劃與整合來源。這篇把範圍縮到更底層：當 Agent 收到「找資料」或「讀這個網址」，到底該呼叫 Search、直接 Fetch、Crawler、Browser，還是受控的 stealth browser？

答案不是「哪個工具最強」，而是建立一條**由便宜、可預測、可稽核，逐步升級到昂貴且有副作用風險**的路由。成功也不能只看 HTTP `200`；登入頁、challenge page、soft 404 和空的 JavaScript shell 都可能是 `200`。

## 五條路徑，各自只做一件事

| 路徑 | 責任 | 適合的輸入 | 不該負責 |
|---|---|---|---|
| Search | 找候選 URL、補替代來源 | 問題、實體、未知網址 | 把 snippet 當全文證據 |
| Fetch | 讀已知 URL 的原始回應 | HTML、JSON、純文字、可直接下載的文件 | 執行 JavaScript、操作頁面 |
| Crawler | 從入口沿連結展開並抽正文 | 文件站、網站區段、多頁清單 | 模擬登入後互動 |
| Browser | 執行 JavaScript、等待網路與操作 UI | client-rendered page、consent、分頁、無限捲動 | 當預設 HTTP client |
| Controlled stealth | 在合法且已授權的範圍調整瀏覽器特徵 | 普通 Browser 被誤判、專用測試站 | 繞過權限、CAPTCHA、付費牆或網站政策 |

Search 和 Fetch 是兩個入口，不是固定前後關係：使用者給了 URL，就先 Fetch；只有問題沒有 URL，就先 Search。Crawler 和 Browser 才是後續升級。stealth 不是「成功率最高的第五級」，而是要另外通過來源授權與政策檢查的受控分支。

這也解釋了為什麼 [SearXNG 和 Crawl4AI](/posts/ai/2026-08-21-searxng-crawl4ai-setup) 不互相取代：前者回答「哪裡可能有答案」，後者回答「已知網站裡有哪些可讀內容」。

## 先判斷任務，再判斷失敗

Router 的第一個判斷不是工具，而是任務形狀：

- `discover`：沒有可信 URL，需要找候選來源。
- `read`：已有 URL，要取得單頁內容。
- `traverse`：要讀一個區段、文件樹或多個分頁。
- `interact`：答案必須經過 client-side render 或安全的 UI 操作才出現。
- `authenticated`：需要使用者已授權的 session；必須先確認 scope 與資料隔離。

第二個判斷才是上一步為什麼失敗。不要把所有失敗都壓成 `fetch_failed`，否則 Agent 只會盲目換工具。

| 訊號 | 分類 | 下一步 | 不該做的事 |
|---|---|---|---|
| DNS、connection reset、`502`、`503`、`504` | 暫時性傳輸失敗 | 有界重試；仍失敗再換來源 | 無限重試 |
| `429` | 限流 | 遵守 `Retry-After`；降低並行度 | 立刻換身分或大量 IP |
| `301`、`302`、`307`、`308` | 重新導向 | 追蹤有限次並保存 redirect chain | 跨協定或跨網域後仍沿用敏感 header |
| `401` | 未驗證 | 只有在授權 session 存在時進 auth lane | 猜密碼、借用別人的 cookie |
| `403`、`451`、robots 禁止 | 政策或存取限制 | 停止，或尋找可公開使用的替代來源 | 當成一般反爬而繞過 |
| `404`、`410` | 來源不存在 | Search canonical／替代來源 | 對同一 URL 重試 |
| `200` 但正文過短、只有導覽或登入表單 | 內容失敗 | 分類為 soft 404、auth wall 或 extraction failure | 宣告成功 |
| `200` 但只有 JS shell，script 後才有資料 | 呈現失敗 | Browser；若已知 API 且允許，也可直接 Fetch API | 用固定 sleep 猜載入時間 |
| challenge／CAPTCHA | challenge | 停止並回報；僅在明確授權環境走受控處理 | 自動破解或規避 |

[RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html)定義 HTTP status 的語意，但 status 不是內容品質分類器。例如 `403` 表示伺服器理解請求但拒絕處理，不等於「換一個更像真人的瀏覽器就可以」。[RFC 6585](https://www.rfc-editor.org/rfc/rfc6585.html)則明確指出 `429` 回應可以帶 `Retry-After`；router 應使用它，而不是立即重送。

## `200` 之後仍要做內容驗收

一次 retrieval 至少要通過四層：

1. **Transport**：response 可讀，redirect 沒有循環，content type 在支援範圍。
2. **Page identity**：canonical URL、title、主要語言和預期來源一致。
3. **Content quality**：正文長度、文字密度、必要欄位與 query relevance 達標。
4. **Policy**：沒有跨 auth scope、提交表單、碰觸禁止路徑或引用 challenge page。

內容門檻要依 task 設定，不能全站共用一個 `minChars = 500`。查匯率可能只要一個數字，讀規格則需要章節與版本。比較實用的做法是讓 task 宣告 `required_fields`、`expected_content_types` 與 `quality_checks`，router 只執行它們。

Browser 也不要靠「睡三秒」判斷成功。[Playwright 的 auto-waiting](https://playwright.dev/docs/actionability)會在執行動作前檢查元素狀態；讀資料時則應等待可觀察的 selector、response 或頁面狀態。等待條件應來自 task contract，而不是把延遲寫死。

## Retry 只處理可能自己恢復的錯誤

Retryable 通常包括 timeout、connection reset、`408`、`429` 和部分 `5xx`。non-retryable 通常包括格式不支援、明確的 `401`／`403`／`404`／`410`／`451`、policy denial，以及已確認的登入或 challenge page。

即使 retryable，也要同時有：

- 每個 stage 的 `maxAttempts`，例如 Fetch 2 次、Browser 1 次。
- exponential backoff 加 jitter，避免一批 worker 同時再撞一次。
- task deadline；剩餘時間不足就不開始下一次。
- idempotency 限制；這套路由預設只做讀取，不自動重送會改狀態的操作。

「換工具」不是 retry。Fetch 升級 Browser 會增加 latency、CPU、記憶體、cookie 和操作風險，應記為一次 escalation。

## Budget 與 depth 決定什麼時候停

沒有 budget 的 fallback tree 最後會變成暴力搜尋。每個 task 至少要帶：

```ts
type RetrievalBudget = {
  deadlineMs: number
  maxRequests: number
  maxSearchQueries: number
  maxPages: number
  maxDepth: number
  maxBrowserStarts: number
  maxCostUsd?: number
}
```

`maxDepth` 控制 crawler 從入口走多遠；`maxPages` 控制總展開量；`maxBrowserStarts` 避免每個候選網址都啟動一次瀏覽器。Budget 耗盡時要回傳 `budget_exhausted` 和已收集的部分證據，不要把它偽裝成「找不到」。

停止條件也要正向定義：必要 facts 已滿足、來源數達標、內容新鮮度通過，就停止。搜尋更多頁面不會自動讓答案更可靠。

## 快取、去重與來源紀錄是 router 的工作

快取 key 至少包含 canonical URL、representation variant，以及 auth scope。登入後內容不能只用 URL 當 key，否則可能把使用者 A 的頁面交給使用者 B。[RFC 9111](https://www.rfc-editor.org/rfc/rfc9111.html)區分 fresh、stale 與 validation；有 `ETag` 或 `Last-Modified` 時，應優先 conditional request，而不是永遠重抓或永遠相信舊資料。

去重分三層：

- URL normalization：移除 tracking parameter、處理 fragment、保留會改內容的 query。
- Redirect／canonical identity：把同一來源的別名合併，但保存原始鏈。
- Content fingerprint：相同正文只處理一次；不同來源轉載同文時仍保留 provenance。

每個 artifact 應記錄 `requested_url`、`final_url`、取得時間、route、status、content type、content hash、cache state、auth scope、父頁面與 search query。這種 provenance 讓答案中的 claim 可以追回具體 representation；[W3C PROV-O](https://www.w3.org/TR/prov-o/)提供了 entity、activity、agent 與 derivation 的通用資料模型。

## 一個可執行形狀的 router

下面省略 provider SDK，但保留真正影響控制流的 contract：分類結果、budget、policy 與 trace。

```ts
async function retrieve(task: Task, ctx: Context): Promise<Result> {
  const trace = ctx.trace.start(task)
  const candidates = task.url
    ? [{ url: normalize(task.url), discoveredBy: "user" }]
    : await searchWithBudget(task.query, ctx.budget, trace)

  for (const candidate of dedupe(candidates)) {
    if (!ctx.policy.mayFetch(candidate.url)) continue

    const cached = await ctx.cache.get(candidate.url, ctx.authScope)
    const fetched = await boundedFetch(candidate, cached, ctx, trace)
    const fetchVerdict = classify(fetched, task)

    if (fetchVerdict.kind === "usable") {
      const result = task.mode === "traverse"
        ? await crawlWithinBudget(candidate, task, ctx, trace)
        : toArtifact(fetched, trace)
      if (satisfies(result, task)) return trace.complete(result)
    }

    if (fetchVerdict.kind === "js-shell" && ctx.budget.browserStartsLeft > 0) {
      const rendered = await browseReadOnly(candidate, task.waitFor, ctx, trace)
      const browserVerdict = classify(rendered, task)
      if (browserVerdict.kind === "usable" && satisfies(rendered, task)) {
        return trace.complete(toArtifact(rendered, trace))
      }
      if (browserVerdict.kind === "challenge") {
        return trace.stop("challenge", { retryable: false })
      }
    }

    if (fetchVerdict.kind === "auth-required") {
      if (!task.requiresAuth || !ctx.authScope) continue
      const authorized = await browseWithAuthorizedSession(candidate, ctx, trace)
      if (satisfies(authorized, task)) return trace.complete(authorized)
    }

    if (!fetchVerdict.retryable) trace.recordStop(candidate, fetchVerdict.kind)
    if (ctx.budget.exhausted()) return trace.stop("budget_exhausted")
  }

  return trace.stop("no_acceptable_source")
}
```

真正實作時，`boundedFetch` 負責 redirect cap、timeout、`Retry-After`、backoff 與 cache validation；`classify` 負責 soft 404、登入頁、challenge、JS shell 與內容品質。把兩者拆開，才不會讓 transport retry 和工具 escalation 混成一團。

## 最後的預設值

一條安全而實用的預設路徑是：

```text
只有問題 → Search → Fetch candidates
已有 URL → Fetch
需要網站區段 → Fetch seed → Crawler
JS shell／安全互動 → Browser
登入內容 → 經授權的 Browser session，cache 按 auth scope 隔離
challenge／明確禁止 → 停止或換公開來源
任何階段 → 通過內容門檻就停；budget 用完也停
```

這套路由的重點不是讓 Agent「什麼網站都能進」，而是讓每次升級都有可解釋的失敗訊號、成本和政策理由。下一篇會把這些 contract 變成固定 corpus 與 regression gate：[Agent 搜尋品質怎麼驗收：Web Retrieval Benchmark 實作](/posts/ai/2026-08-21-web-retrieval-benchmark)。

## 參考資料

- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html)
- [RFC 6585: Additional HTTP Status Codes](https://www.rfc-editor.org/rfc/rfc6585.html)
- [RFC 9309: Robots Exclusion Protocol](https://www.rfc-editor.org/rfc/rfc9309.html)
- [Playwright Browser：Auto-waiting](https://playwright.dev/docs/actionability)
- [W3C PROV-O: The PROV Ontology](https://www.w3.org/TR/prov-o/)
- [站內：Agent 搜尋品質怎麼驗收](/posts/ai/2026-08-21-web-retrieval-benchmark)
