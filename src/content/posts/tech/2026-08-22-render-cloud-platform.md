---
title: "Render：Web Service、Private Service、Worker 與 Cron 的完整 PaaS 拓撲"
date: 2026-08-22
category: tech
type: deep-dive
tags: [render, paas, cloud-computing, devops, backend]
lang: zh-TW
tldr: "Render 的價值不是只把 repository 變 URL，而是用不同 service type 表達 public HTTP、private listener、queue worker、cron、data store 與 Blueprint。"
description: "介紹 Render Web/Private Services、Background Workers、Cron、Postgres/Key Value、persistent disks、Blueprints、network 與部署。"
series:
  name: "AI 時代的技術選擇"
  order: 74
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-render-cloud-platform-en)

[Render](https://render.com/docs/service-types) 是 general-purpose PaaS，從 Git 或 container image 部署 Static Site、Web Service、Private Service、Background Worker、Cron/Workflow，並提供 Postgres、Key Value、private network、TLS、preview、health check 與 Blueprint IaC。

## Service type 是生命週期合約

Web Service 綁 public port，接 HTTP/WebSocket；Private Service 有內部 hostname/port，只接受同 region private network；Background Worker 沒有 inbound listener，持續 poll queue；Cron 在排程時執行後退出。不要用 Web Service 假裝 worker，也不要為無 listener 的 process 建 Private Service。

worker/cron 都要冪等。deploy 或 scale-in 會送 termination signal，程式要停止取新工作、完成或重新排隊 in-flight job。health endpoint 應證明能服務，但不要每次執行昂貴的全依賴查詢。

## Blueprint 讓 topology 可 review

[Blueprint spec](https://render.com/docs/blueprint-spec) 可宣告 service、database、region、plan、build/start command、health check、environment group 與 deploy hook。它應進 repository review；secret 只引用平台值，不寫進 YAML。database migration 放 pre-deploy command 時仍要考慮新舊 instance 同時存在與 rollback。

preview environment 很方便，但會建立真實 resource。設定 TTL/cleanup、budget、isolated credential 與 sanitized data，避免每個 PR 留下 database 和 public endpoint。

## Persistent Disk 會改變 HA 語意

預設 filesystem 是 ephemeral。[Persistent Disk](https://render.com/docs/disks) 可保存資料，但會限制多 instance scaling、zero-downtime deploy 與其他 job 存取。production database/search/queue 優先用 managed/external clustered service；若 attach disk 跑單 node stateful app，就要接受 failover/maintenance boundary 並做獨立 backup。

Render 適合多語言 Web API、private service、worker、cron 與 database 組成的中小型產品。frontend/framework edge integration 可比較 Vercel/Netlify；需要全球 machine placement 或低階 network control 可比較 Fly.io。驗收要部署壞版、停止 worker、重送 job、失去 database/Key Value、restore backup，確認 rollback、drain、alarm 與 Blueprint drift。

## 參考資料

- [Render service types](https://render.com/docs/service-types)
- [Render web services](https://render.com/docs/web-services)
- [Render private services](https://render.com/docs/private-services)
- [Render background workers](https://render.com/docs/background-workers)
- [Render Blueprint specification](https://render.com/docs/blueprint-spec)
- [Render persistent disks](https://render.com/docs/disks)
