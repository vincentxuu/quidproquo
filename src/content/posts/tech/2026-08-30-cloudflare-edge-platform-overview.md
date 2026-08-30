---
title: "Cloudflare Edge Platform 導讀：把網站和 app 跑在 Cloudflare 上"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, edge-platform, workers, architecture, deployment]
lang: zh-TW
tldr: "Cloudflare Edge Platform 這條系列回答一個產品問題：怎麼用 Workers、D1、KV、R2、Durable Objects、Queues、Workflows、Cache、Images、Email、Turnstile、Observability、Browser Run、Containers，把網站或 app 跑起來、跑穩、跑便宜。"
description: "Cloudflare Edge Platform 系列導讀，整理 Workers compute、app framework、data、state、async work、cache、origin protection、media、email、安全、observability、browser automation 與 containers 的閱讀順序。"
draft: true
series:
  name: "Cloudflare Edge Platform"
  order: 0
---

> 🌏 [English version](/en/posts/tech/2026-08-30-cloudflare-edge-platform-overview-en)

Cloudflare 很容易被理解成 CDN 或 DNS 服務，但如果你真的把產品搬上去，看到的會是一套 app platform：[Workers](https://developers.cloudflare.com/workers/) 跑程式，[D1](https://developers.cloudflare.com/d1/) 放 SQL 資料，[KV](https://developers.cloudflare.com/kv/) 做全球 key-value，[R2](https://developers.cloudflare.com/r2/) 放 object，[Durable Objects](https://developers.cloudflare.com/durable-objects/) 處理狀態和協調，再加上 Queues、Workflows、Cache Rules、Smart Shield、Images、Email Service、Turnstile、Observability、Browser Run、Containers。

這條系列叫 Cloudflare Edge Platform，核心問題是：「我怎麼用 Cloudflare 把一個網站或 app 跑起來、跑穩、跑便宜？」它是一條 architecture 和 deployment 導讀，不是產品型錄。

## 這條系列適合誰

適合這幾種讀者：

- 想把 Astro、Next.js、Hono API 或小型 SaaS 跑在 Cloudflare。
- 已經用 Workers，但不知道 D1、KV、R2、DO 該怎麼分工。
- 想把背景工作、長流程、cache、origin protection、email、form protection 一起設計。
- 想知道什麼時候 Workers 不夠，要用 Browser Run 或 Containers。

如果你主要問題是 LLM、RAG、agent、memory、sandbox、model gateway，請看另一條 [Cloudflare AI Stack](/posts/ai/2026-08-30-cloudflare-ai-stack-overview)。

## 閱讀順序

我會按產品成長順序讀：

1. **Compute**：Workers 是入口，Hono / OpenNext 是把 app framework 接上去。
2. **Data**：D1、KV、R2 先決定資料形狀。
3. **State and async work**：Durable Objects 處理協調，Queues 處理背景工作，Workflows 處理 durable multi-step process。
4. **Origin and delivery**：Hyperdrive、Cache Rules、Smart Shield、Images 讓既有資料庫、origin、media delivery 變穩。
5. **Product surface**：Email Service、Turnstile 補上通知、收信、表單保護。
6. **Production control**：Observability / Analytics Engine 讓系統可查，Browser Run 和 Containers 處理 Workers runtime 之外的任務。
7. **Appendix**：上線前檢查 Custom Domains、maintenance page、limits、build/runtime 邊界。

這個順序不照 Cloudflare 產品分類排，而是照產品落地順序排。先讓 request 進來，再決定資料去哪裡，接著處理背景工作、效能、安全、觀測，最後才看 escape hatch。

## 每個服務的定位

| 主題 | 你讀完應該知道 |
|---|---|
| Workers | edge runtime 和 serverless function 的差別 |
| D1 | 什麼資料適合 SQLite-style SQL |
| KV | 哪些資料能接受 eventual consistency |
| R2 | object storage 和 zero egress 的取捨 |
| Durable Objects | per-key state、coordination、WebSocket |
| Queues | 怎麼把慢工作移出 request |
| Workflows | durable steps 和 background jobs 的差別 |
| Hyperdrive | Workers 怎麼接既有 Postgres/MySQL |
| Cache Rules / Smart Shield | cache policy 和 origin protection 怎麼分工 |
| Images | 圖片 transformation、variant、delivery pipeline |
| Email Service | 交易信、收信 routing、Worker email handler |
| Turnstile | 表單和 public endpoint 的 bot protection |
| Observability | logs、traces、metrics、custom analytics |
| Browser Run | managed headless Chrome |
| Containers | Workers 之外的 Linux runtime |

## 什麼時候不要硬搬

Cloudflare 很適合邊緣入口、serverless API、小型到中型產品、global cache、R2 object workflow、AI app glue code。但不是每個 workload 都該搬：

- 需要長時間常駐 TCP service。
- 需要大型 VM、GPU、持久 block storage。
- 資料庫依賴複雜 transaction、extension、stored procedure。
- 團隊已經有成熟 Kubernetes / cloud ops，而且 Cloudflare 只會增加一層。

這條系列的目標不是把所有東西都塞到 Cloudflare。它要幫你判斷哪些產品部件放上去會變簡單，哪些部件該留在原本的 infra。

## 參考資料

- [Cloudflare Developer Platform docs](https://developers.cloudflare.com/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare storage options](https://developers.cloudflare.com/workers/platform/storage-options/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [Cloudflare Browser Run](https://developers.cloudflare.com/browser-run/)
- [Cloudflare Containers](https://developers.cloudflare.com/containers/)
