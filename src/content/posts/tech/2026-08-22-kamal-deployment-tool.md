---
title: "Kamal：沒有常駐 Control Plane 的 Docker 部署工具"
date: 2026-08-22
category: tech
type: deep-dive
tags: [kamal, deployment, docker, self-hosting, devops]
lang: zh-TW
tldr: "Kamal 從操作者端透過 SSH 把 immutable image 部署到 servers，靠 kamal-proxy 切換流量；它不是 scheduler，也不替團隊管理主機與資料。"
description: "介紹 Kamal deploy.yml、SSH、registry、roles、kamal-proxy、accessories、secrets、rollback 與多主機邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 84
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-kamal-deployment-tool-en)

[Kamal](https://kamal-deploy.org/docs/installation/) 是從 CLI/CI 透過 SSH 部署 Docker image 的工具，不是常駐 dashboard 或 cluster scheduler。`config/deploy.yml` 宣告 service、image、servers、roles、registry、environment 與 proxy；遠端主機只需 Docker、kamal-proxy 和被部署的 containers。

## Deploy 是可追蹤的 image promotion

`kamal deploy` build image、以 Git version 標記、push registry、讓各 server pull，啟動新 container；新版本對 health path 回 `200` 後，kamal-proxy 才切流量並停止舊版。Registry 是 deployment source of truth，必須保留 digest、掃描 artifact、限制 credential 並處理 outage。

Roles 可把 web 與 workers 放在不同 hosts、commands 和 resource limits。Worker 沒有 HTTP readiness 可用時，仍要設 graceful stop、足夠 `stop_timeout`、queue visibility timeout 與 idempotency。多 web servers 之外仍需外部 load balancer；Kamal 不會替 hosts 自動新增容量或故障重排。

## Zero downtime 有前提

Proxy 只保證健康的新 container 接流量，不保證 database migration 相容。Schema 要 expand/contract；asset、session 與 cache 要能跨版本共存。Proxy 自身升級可 rolling reboot，但單 server 仍可能短暫中斷。

[Rollback](https://kamal-deploy.org/docs/commands/rollback/) 以舊 image 重啟 container，前提是 artifact 或舊 container 尚在；預設 prune policy 會限制窗口。Rollback 也不會回復 database，因此 migration rollback 要獨立設計。

## Accessories 不是 managed service

[Accessories](https://kamal-deploy.org/docs/configuration/accessories/) 可啟動 database、Redis 等 supporting containers，卻獨立於 main service deploy，沒有相同 zero-downtime 更新。掛載 directory/volume 只是 persistence，不是 replication、backup 或 failover。Production data 需單獨 lifecycle、版本 pin、off-site backup 與 restore drill。

Secrets 由 `.kamal/secrets` 解析環境或 password manager 值；檔案不可 commit 明碼，CI log 也不可展開。SSH 預設可需要 root 安裝 Docker，應使用受控 runner、host key verification、最小化 keys 與 audit hooks。

Kamal 適合希望「少一個 control plane」、以 immutable container 部署 Rails 或一般 web/worker 到自有 VPS 的團隊。需要 UI/service catalog 看 Coolify/Dokploy；需要自動 rescheduling/autoscaling 看 Kubernetes 或 managed PaaS。驗收應包含 registry loss、單 host loss、proxy rolling reboot、worker drain、accessory restore 與 schema-safe rollback。

## 參考資料

- [Kamal installation and deployment flow](https://kamal-deploy.org/docs/installation/)
- [Kamal configuration](https://kamal-deploy.org/docs/configuration/overview/)
- [Kamal roles](https://kamal-deploy.org/docs/configuration/roles/)
- [Kamal proxy](https://kamal-deploy.org/docs/commands/proxy/)
- [Kamal accessories](https://kamal-deploy.org/docs/configuration/accessories/)
- [Kamal rollback](https://kamal-deploy.org/docs/commands/rollback/)
