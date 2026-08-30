---
title: "Cloudflare Observability 怎麼用：Workers Logs、Traces 與 Analytics Engine 的分工"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, observability, analytics-engine, monitoring, logs, metrics]
lang: zh-TW
tldr: "Workers Observability 負責 debug 和 request tracing；Workers Analytics Engine 負責高基數產品事件與自訂 metrics；GraphQL Analytics API 則查 Cloudflare 既有產品資料。把三者分清楚，才不會把 log 當資料庫，也不會把 billing、monitoring、產品分析混在一起。"
description: "從 Cloudflare Workers Logs、real-time logs、Tail Workers、Logpush、traces、metrics、Workers Analytics Engine、SQL API 與 GraphQL Analytics API，拆解 Cloudflare app 上線後該怎麼觀測。"
draft: false
series:
  name: "Cloudflare Edge Platform"
  order: 16
additionalSeries:
  - name: "Cloudflare AI Stack"
    order: 13
---

> 🌏 [English version](/en/posts/tech/2026-08-30-cloudflare-observability-analytics-engine-en)

把網站或 app 搬到 Cloudflare 後，第一個問題通常是「怎麼跑」。下一個問題很快就會變成：「出事時我要去哪裡看？」Workers 沒有一台你可以 SSH 進去的機器，也沒有傳統 VM 上的 `/var/log`。你看到的是 distributed runtime、edge request、binding call、queue consumer、Durable Object、Email handler、AI Gateway call、R2/KV/D1 操作。

所以 Cloudflare Observability 的重點不是把 `console.log` 接到 dashboard 而已。比較實際的設計問題是：哪些資料是 debug 用的 logs？哪些是 request lifecycle 的 traces？哪些是要長期查詢、分客戶、分功能、做 usage-based billing 的 metrics？哪些又是 Cloudflare 已經幫你收好的 HTTP / Firewall / Load Balancing analytics？

這篇把它拆成三層：[Workers Observability](https://developers.cloudflare.com/workers/observability/) 看 app runtime，[Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/) 寫自訂高基數事件，[GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/) 查 Cloudflare 既有產品資料。

## 三種資料，不要混用

我會先用這張表決定資料要去哪裡：

| 你想知道的事 | 放哪裡 | 典型問題 |
|---|---|---|
| 某次 request 為什麼 500 | Workers Logs / traces | 哪個 handler、哪個 binding call、哪個 exception |
| 剛 deploy 後有沒有壞 | real-time logs、metrics | error rate、CPU time、duration 是否異常 |
| 每個 customer 一天用了幾次功能 | Analytics Engine | usage-based billing、feature adoption、per-customer health |
| Cloudflare network 上的 HTTP / Firewall 數據 | GraphQL Analytics API | requests、bytes、status code、WAF / LB 維度 |
| 要送到既有監控系統 | OTLP export、Logpush、Tail Workers | Honeycomb、Grafana Cloud、Axiom、Sentry、S3/R2 |

這個分工比「有沒有 dashboard」更重要。Log 是拿來查一段事件的上下文；metric 是拿來長期聚合；trace 是看 request 走過哪些步驟；analytics API 是查 Cloudflare 產品已經收集的彙總資料。

把 log 當產品資料庫，三個月後會很痛苦。把 billing event 只寫在 `console.log`，也會很難補帳。

## Workers Logs：先讓 request 可查

[Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/) 會收集 invocation logs、custom logs、errors 和 uncaught exceptions。新建立的 Workers 預設會啟用 observability；既有 Worker 則可以在 Wrangler 裡設定：

```jsonc
{
  "observability": {
    "enabled": true,
    "head_sampling_rate": 1
  }
}
```

production 流量大時，可以把 `head_sampling_rate` 調低，例如 `0.01` 代表 1% sampling。Cloudflare 文件寫明，Workers Logs 的 head-based sampling 範圍是 0 到 1；未設定時預設是 1。

我會從第一天就用 structured JSON log：

```ts
console.log({
  event: "email_send_attempt",
  requestId,
  userId,
  template: "magic_link",
  status: "queued",
});
```

不要只寫：

```ts
console.log(`sent email for user ${userId}`);
```

前者可以用欄位 filter；後者之後只能做文字搜尋。Cloudflare 文件也特別建議 JSON log，因為 Workers Logs 會抽出欄位並索引。

Workers Logs 的 limits 也要放進設計：Free plan 每天有 200,000 log events、保留 3 天；Paid plan 每月包含 20 million log events、保留 7 天，超過後以每 million log event 計價。單一 log 最大 256 KB，超過會被截斷。

所以 log 內容要能幫你 debug，但不能把整個 request body、完整 prompt、完整 email、PII 或大物件塞進去。需要留存的 payload 放 R2；log 只放 pointer、狀態和必要 metadata。

## Real-time logs、Tail Workers、Logpush：不同出口

Workers Observability 裡有幾種 log 出口：

- Real-time logs：deploy 或 local debug 時看近即時事件。
- Tail Workers：用 Worker 自己過濾、sample、轉換 telemetry。
- Workers Logpush：把 Workers Trace Event Logs 送到 R2、S3 或其他 logging provider。
- OpenTelemetry export：把 traces 和 logs 送到有 OTLP endpoint 的系統。

如果團隊已經有 Grafana Cloud、Honeycomb、Axiom 或 Sentry，不一定要把 Cloudflare dashboard 當唯一觀測面板。比較乾淨的做法是：Cloudflare dashboard 負責 first response；長期 incident workflow 和跨服務關聯，送到既有 observability stack。

Tail Workers 適合你想在送出前做 filtering 或 transformation。Logpush 適合把原始事件保留下來，尤其是合規、稽核、長期調查。OTLP export 則比較接近現代 tracing/logging 系統的標準路徑。

## Traces：看 request 走過哪些服務

Cloudflare 的 Workers tracing 會自動捕捉 fetch calls、binding operations 和 handler invocations。這對 Edge Platform 很重要，因為一個 request 可能會碰到：

- Worker handler
- KV read
- D1 query
- Durable Object RPC
- R2 object read
- Queues producer
- 外部 `fetch()`

只看 log 會知道「發生錯誤」，但 trace 可以幫你看到「卡在哪一段」。如果 Durable Object 很慢、D1 query 變長、外部 API timeout，trace 比單點 log 更容易指出瓶頸。

AI app 也一樣。一次聊天可能包含 AI Gateway、Vectorize query、R2 文件讀取、D1 conversation 寫入、agent tool call。這些步驟如果只靠最後一個 response status，很難判斷是模型慢、檢索慢、資料庫慢，還是工具呼叫壞掉。

## Metrics：平台健康先用內建指標

Workers 的 metrics and analytics 會提供 request counts、error rates、CPU time、wall time、execution duration 等內建指標。這些是第一層 monitoring。

我會先設幾個基本問題：

- request count 有沒有突然掉到 0？
- 5xx / exception rate 有沒有升高？
- CPU time 是否接近方案限制？
- wall time 是否被外部 API 拉長？
- Queue consumer 是否開始堆積失敗？
- Email handler 是否出現 `EXCEEDED_CPU`？

這些問題不用一開始就全部自建。先用 Workers 內建 metrics 和 logs 把 runtime health 看清楚，再把產品層事件寫進 Analytics Engine。

## Analytics Engine：自訂高基數事件

[Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/) 是另一種資料形狀。Cloudflare 官方描述它可以寫 unlimited-cardinality analytics，並用 SQL API 查詢。它不負責回答「這次 request 為什麼壞」這種單次 debug 問題，適合處理的是：

- 每個 customer 的 API usage。
- 每個 feature 的採用率。
- 每個 user segment 的 latency 或錯誤率。
- usage-based billing。
- AI app 的 token、retrieval、tool call、gateway cache hit 指標。

Wrangler binding 類似這樣：

```jsonc
{
  "analytics_engine_datasets": [
    {
      "binding": "EVENTS",
      "dataset": "app_events"
    }
  ]
}
```

Worker 裡寫 data point：

```ts
env.EVENTS.writeDataPoint({
  blobs: ["email", "magic_link", "success"],
  doubles: [Date.now() - startedAt],
  indexes: [tenantId],
});
```

`blobs` 是用來 group/filter 的字串維度，`doubles` 是數值，`indexes` 是 sampling key。官方文件也提醒，目前 `writeDataPoint()` 接受 ordered arrays，所以欄位順序要固定；`indexes` 雖然是 array，實際上只能提供單一 index。

查詢時可以用 SQL API：

```sql
SELECT
  blob1 AS area,
  blob2 AS action,
  SUM(_sample_interval) AS events
FROM app_events
WHERE timestamp >= NOW() - INTERVAL '1' DAY
GROUP BY area, action
ORDER BY events DESC
LIMIT 20
```

Analytics Engine 的 limits 也會影響 instrumentation：每次 `writeDataPoint` 最多 20 個 blobs、20 個 doubles、1 個 index；所有 blobs 加總最多 16 KB；每個 Worker invocation 最多寫 250 個 data points；資料保留三個月。

## Pricing：先看寫入點數和查詢數

Analytics Engine pricing 以 data points written 和 read queries 計算。官方 pricing 頁面在 2026-04-23 寫的是：

- Workers Free：每天 100,000 data points、10,000 read queries。
- Workers Paid：每月 10 million data points、1 million read queries；超過後 data points 每 million $0.25，read queries 每 million $1.00。

同一頁也註明，目前不會因 Workers Analytics Engine 使用量被收費，pricing 是先公布，讓使用者估算 Cloudflare 開始計費後的成本。

產品設計上，我會把「每次 request 一筆」當作預設上限。真的需要多筆事件時，要確認它們代表不同業務事件，而不是把 debug log 轉成 analytics event。

## GraphQL Analytics API：查 Cloudflare 已有資料

[GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/) 查的是 Cloudflare network 和各產品的 analytics dataset，例如 HTTP requests、Firewall、Load Balancing。它適合拿來做 dashboard、報表、趨勢查詢。

它的 endpoint 是：

```txt
https://api.cloudflare.com/client/v4/graphql
```

GraphQL API 的定位和 Analytics Engine 不一樣。Analytics Engine 是你在 Worker 裡主動寫自訂事件；GraphQL Analytics API 是查 Cloudflare 已經收集的產品資料。官方文件也提醒，GraphQL API 的資料不應該拿來當 billing usage 的依據，因為它衡量的是整體 consumption/usage，和可計費流量口徑不同。

## 我會怎麼設計第一版觀測

小型 Cloudflare app 上線時，我會先做這組：

1. Wrangler 開 `observability.enabled`。
2. production 設合適的 `head_sampling_rate`。
3. 所有 request log 都帶 `requestId`、`tenantId`、`route`、`status`。
4. 錯誤 log 只放必要 metadata，不放完整 PII、prompt、email body。
5. 重要業務事件寫 Analytics Engine：signup、email sent、queue job done、AI request、retrieval hit。
6. 用 Queues / Workflows / Email Service 時，把 job id、workflow id、message id 放進 log 和 analytics event。
7. 需要長期保留或外部 incident workflow，再接 OTLP export 或 Logpush。

這套設計不華麗，但足夠回答三個問題：現在有沒有壞？這次為什麼壞？哪個 customer 或 feature 正在消耗系統？

## 和 AI Stack 的關係

AI app 更需要 observability，因為錯誤通常不只是一個 HTTP 500。模型可能回得慢，AI Gateway 可能 fallback，Vectorize 查不到東西，R2 文件可能缺失，agent tool 可能失敗，Sandbox 執行可能 timeout。

我會把 AI 事件寫成固定 schema：

```ts
env.EVENTS.writeDataPoint({
  blobs: ["ai", "chat", model, gatewayStatus],
  doubles: [tokensIn, tokensOut, latencyMs],
  indexes: [tenantId],
});
```

然後用 logs/traces 查單次錯誤，用 Analytics Engine 看長期趨勢。這樣才不會把每次 prompt 全塞進 log，也不會因為只看平均 latency 而看不出某個 tenant、某個 model、某個 retrieval path 正在出問題。

Observability 在 Edge Platform 裡是上線後的安全網；在 AI Stack 裡則是成本、品質和可靠性的共同語言。

## 參考資料

- [Cloudflare Workers Observability](https://developers.cloudflare.com/workers/observability/)
- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
- [Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/)
- [Get started with Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/get-started/)
- [Workers Analytics Engine limits](https://developers.cloudflare.com/analytics/analytics-engine/limits/)
- [Workers Analytics Engine pricing](https://developers.cloudflare.com/analytics/analytics-engine/pricing/)
- [GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/)
