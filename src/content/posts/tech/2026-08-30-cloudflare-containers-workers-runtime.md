---
title: "Cloudflare Containers 怎麼用：當 Workers 需要完整 Linux runtime"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, containers, workers, durable-objects, runtime, deployment]
lang: zh-TW
tldr: "Cloudflare Containers 讓 Workers app 呼叫 on-demand serverless container，適合需要完整 filesystem、特定 runtime、既有 container image、更多 CPU/memory/disk 的工作。它不取代 Workers；Worker 保留入口與 routing，container 處理 runtime 太重的那段。"
description: "從 Cloudflare Containers 的 Worker routing、Container class、Durable Objects binding、image deploy、instance types、limits、pricing 與 Browser Run 邊界，拆解它在 Edge Platform 裡的定位。"
draft: true
series:
  name: "Cloudflare Edge Platform"
  order: 18
---

> 🌏 [English version](/en/posts/tech/2026-08-30-cloudflare-containers-workers-runtime-en)

Workers 很適合 HTTP API、edge rendering、webhook、lightweight background jobs、資料存取 glue code。但它不是萬用 runtime。只要你需要完整 filesystem、特定 binary、比較大的 memory/disk、平行 CPU core、或已經包好的 container image，單純 Workers 就會開始彆扭。

[Cloudflare Containers](https://developers.cloudflare.com/containers/) 補的是這段。官方文件把它描述成「用 serverless containers 強化 Workers」：你仍然用 Worker 接 request、做 routing、控權限、接 D1/R2/KV/Queues；真的需要 Linux-like environment 的部分，才送進 container。

所以它在 Cloudflare Edge Platform 裡不是第一篇該學的東西。先理解 Workers、D1、R2、Durable Objects、Queues、Workflows，再看 Containers，才會知道哪段該留在 isolate，哪段值得啟動 container。

## 什麼時候需要 Containers

我會在這些情境考慮 Containers：

- 既有工具已經以 container image 發佈，不想重寫成 Worker。
- 需要完整 filesystem 或 Linux-like environment。
- 需要特定 runtime、native dependency、binary 或 CLI。
- 需要更多 memory、disk，或多個 CPU core 平行運算。
- 要把短生命週期的重工作接進 Cloudflare app。
- AI app 需要跑程式、轉檔、分析 artifact、或呼叫一般 Workers 不適合承擔的工具。

反過來，如果只是一般 API routing、JSON processing、DB access、cache、auth、簡單 background job，就不要急著用 Containers。Workers 啟動快、成本模型單純，也比較容易靠 edge cache 和 bindings 組出穩定架構。

## 架構模型：Worker 控制，Container 執行

Containers 的核心模型是：

1. Worker 收 request。
2. Worker 根據 session、tenant、path、job id 決定要叫哪個 container instance。
3. Container instance on-demand 啟動。
4. Worker 把 request 轉給 container。
5. Container idle 一段時間後 sleep，停止計費。

官方範例大概長這樣：

```ts
import { Container, getContainer } from "@cloudflare/containers";

export class MyContainer extends Container {
  defaultPort = 4000;
  sleepAfter = "10m";
}

export default {
  async fetch(request, env): Promise<Response> {
    const { "session-id": sessionId } = await request.json();
    const instance = getContainer(env.MY_CONTAINER, sessionId);
    return instance.fetch(request);
  },
} satisfies ExportedHandler;
```

Wrangler 設定則同時宣告 `containers`、Durable Objects binding 和 migration：

```jsonc
{
  "containers": [
    {
      "class_name": "MyContainer",
      "image": "./Dockerfile",
      "max_instances": 5
    }
  ],
  "durable_objects": {
    "bindings": [
      {
        "class_name": "MyContainer",
        "name": "MY_CONTAINER"
      }
    ]
  },
  "migrations": [
    {
      "new_sqlite_classes": ["MyContainer"],
      "tag": "v1"
    }
  ]
}
```

這裡最容易漏掉的是 Durable Objects。Cloudflare Containers 不是「Worker 直接打某個 Kubernetes service」。`Container` class 本身 extends `DurableObject`，DO 負責 routing、lifecycle 和 persistent state；container process 則在 Linux VM 裡跑你的 image。

這也解釋為什麼你可以做 named container、stateful service、session routing、或 load balancing。Worker 仍是控制面，container 是資料面的一段執行環境。

## Deploy：Wrangler 會一起處理 Worker 和 image

Containers 需要本機 Docker 參與 build/push。官方 get started 文件要求部署時 Docker 要在本機跑起來；`wrangler deploy` 會上傳 Worker、用 Docker build/push container image，然後更新 Cloudflare network 上的 container instances。

換成 deployment 流程來看，Worker code、Docker image、Durable Object migration 要一起成功，才算這次 deployment 真正可用。

部署後也要注意 provisioning 時間。官方文件提醒，第一次 deploy 後 Worker URL 可能已經能回應，但 container 還在 provisioning，這時打 container route 可能會失敗。這種狀態不要誤判成程式壞掉，要用：

```bash
npx wrangler containers list
npx wrangler containers images list
```

以及 Cloudflare dashboard 的 Containers logs / metrics / status 來看。

image 可以指向 Dockerfile、含 Dockerfile 的目錄，或 Cloudflare Registry 上完整 image reference。container image 必須能跑在 `linux/amd64` architecture。

## Routing：固定 instance 還是 load balance

官方範例展示兩種 routing。

第一種是用 path 或 session id 找固定 instance。這適合：

- per-user session
- per-tenant worker
- short-lived job
- 需要保留 container-local state 的任務
- 需要細控 container lifecycle 的流程

第二種是把 request load balance 到多個 container instance。這適合：

- stateless API
- 可以重試的轉檔服務
- 多個 worker process 等價的處理器

如果要做 stateful routing，我會把 routing key 設計得很明確，例如 `tenantId:jobId` 或 `sessionId`。如果要做 stateless pool，則要確保任何 instance 都能處理任何 request，狀態放在 D1/R2/DO storage，而不是放在 container filesystem。

## Instance types 和 limits

Containers 的 CPU、memory、disk 由 instance type 決定。官方 limits 頁面列出六種 predefined instance types：

| Instance type | vCPU | Memory | Disk |
|---|---:|---:|---:|
| lite | 1/16 | 256 MiB | 2 GB |
| basic | 1/4 | 1 GiB | 4 GB |
| standard-1 | 1/2 | 4 GiB | 8 GB |
| standard-2 | 1 | 6 GiB | 12 GB |
| standard-3 | 2 | 8 GiB | 16 GB |
| standard-4 | 4 | 12 GiB | 20 GB |

也可以設定 custom instance type，但有幾個邊界：vCPU 最低 1、最高 4；memory 最高 12 GiB；disk 最高 20 GB；每個 vCPU 至少 3 GiB memory；disk 和 memory 的比例也有限制。

Account-level limits 則包含 concurrent memory 6 TiB、concurrent vCPU 1,500、concurrent disk 30 TB、image storage 50 GB。image size 和 instance disk space 相關。

這些數字讓 Containers 很適合 bursty heavy work，但也提醒你：container 不是拿來替代所有 request handler。instance type 選太大，memory 和 disk 都會用 provisioned resources 算成本。

## Pricing：啟動後才計費，但資源選型很重要

Containers 目前是 Workers Paid plan 功能。官方 pricing 頁面寫明，Containers 依 active running time 每 10ms 計費，Workers Paid 的 $5/month 方案內含一部分用量：

- Memory：每月 25 GiB-hours，超過後每 GiB-second $0.0000025。
- CPU：每月 375 vCPU-minutes，超過後每 vCPU-second $0.000020。
- Disk：每月 200 GB-hours，超過後每 GB-second $0.00000007。

Container 收到 request 或手動啟動後開始計費；instance sleep 後停止。Memory 和 disk 依你選的 instance type provisioned resources 計算，CPU 則看 active usage。

Network egress 另外計價。官方 pricing 頁面列出 North America & Europe 每 GB $0.025、Oceania/Korea/Taiwan 每 GB $0.05、其他地區每 GB $0.04，並各有月包含量。使用 Containers 時，Worker 和每個 container 背後的 Durable Object 也會各自依 Workers / DO pricing 計費。Logs 和 observability 則接 Workers Logs 的計費。

換句話說，Containers 成本不是只看「container 本身」。一個完整工作可能包含 Worker request、DO、container vCPU/memory/disk、network egress、R2、Queues、logs。

## 和 Browser Run、Sandbox SDK 的邊界

這三個服務很容易混在一起：

| 需求 | 優先看 |
|---|---|
| 開 headless Chrome、截圖、PDF、Playwright automation | Browser Run |
| 讓 agent 執行不可信或半可信程式碼 | Sandbox SDK |
| 跑既有 image、native binary、自訂 runtime、重型 service | Containers |

Containers 當然可以跑瀏覽器，也可以跑 code execution service，但這不代表它是每個場景的第一選擇。Browser Run 已經把 headless Chrome 管好；Sandbox SDK 則面向 agent code execution 的隔離模型。Containers 比較像 Cloudflare app 的 runtime escape hatch。

## 我會怎麼放進產品架構

假設你在 Cloudflare 上做一個 AI 內容處理產品，架構可以長這樣：

1. Worker 接 API request、驗證 tenant、寫 job record。
2. Queue 接重工作，例如轉檔、爬取後清理、artifact 分析。
3. Durable Object 用 job id 控制某個 container instance。
4. Container 跑 Python / Go / ffmpeg / native CLI。
5. R2 存輸入檔與輸出 artifact。
6. D1 存 job state、結果摘要、billing event。
7. Analytics Engine 記錄 duration、vCPU 估算、tenant usage、error type。

這樣切的好處是：Workers 保持薄，container 做它擅長的重 runtime，資料仍然回到 Cloudflare storage，觀測也留在同一個平台。

## 什麼時候先不要用

我會先避開這些情境：

- 任務可以用普通 Worker 在幾十毫秒內完成。
- 只需要 headless browser，Browser Run 已經夠。
- 只是想要長時間常駐服務，卻沒有設計 idle/sleep、健康檢查和成本控制。
- 團隊不想處理 Docker image、runtime patch、binary dependency。
- 狀態只存在 container filesystem，沒有回寫 D1/R2/DO。

Containers 讓 Cloudflare Edge Platform 的上限變高，但也把部署、資源選型、成本、觀測複雜度一起帶進來。把它放在系列後段是合理的：先用 Workers 和 bindings 解決 80% 的產品工作；剩下真的需要 Linux runtime 的 20%，再用 Containers 補上。

## 參考資料

- [Cloudflare Containers](https://developers.cloudflare.com/containers/)
- [Containers get started](https://developers.cloudflare.com/containers/get-started/)
- [Containers limits and instance types](https://developers.cloudflare.com/containers/platform/limits/)
- [Containers pricing](https://developers.cloudflare.com/containers/platform/pricing/)
- [Container class reference](https://developers.cloudflare.com/containers/reference/container-class/)
- [Durable Object Container API](https://developers.cloudflare.com/durable-objects/api/container/)
- [Containers examples](https://developers.cloudflare.com/containers/examples/)
