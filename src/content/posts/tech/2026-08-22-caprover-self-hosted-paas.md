---
title: "CapRover：Docker Swarm、Nginx 與 Persistent App 的自架 PaaS"
date: 2026-08-22
category: tech
type: deep-dive
tags: [caprover, paas, self-hosting, docker-swarm, devops]
lang: zh-TW
tldr: "CapRover 用 Docker Swarm、Nginx 與 captain-definition 提供簡化 PaaS；stateless app 可擴展，local persistent app 則被鎖在單一節點。"
description: "介紹 CapRover deployment、Docker Swarm、Nginx、scaling、persistent apps、registry、backup 與復原限制。"
series:
  name: "AI 時代的技術選擇"
  order: 82
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-caprover-self-hosted-paas-en)

[CapRover](https://caprover.com/docs/get-started.html) 是建立在 Docker Swarm 上的自架 PaaS，以 dashboard/CLI、Nginx、Let's Encrypt 與 one-click apps 簡化部署。Application 可從 source、Dockerfile 或 image 發佈，`captain-definition` 記錄 build/deploy recipe。

## Swarm 已存在，只是被包裝

CapRover 的 replicas、placement、service update 與 node failure 來自 Docker Swarm。[Cluster](https://caprover.com/docs/app-scaling-and-cluster.html) 可加入 manager/worker nodes，Nginx 對 stateless replicas load balance。這降低操作入口，並沒有消除 manager quorum、overlay network、registry、capacity、OS patch 與 node upgrade。

Production image 應推到外部 registry 並固定 immutable reference，讓新 node、rollback 和 disaster recovery 不依賴原 build host。Deploy 要處理 termination、connection drain、backward-compatible migration 與 health，而不是只看到容器啟動。

## Persistent App 會失去調度自由

[Persistent Apps](https://caprover.com/docs/persistent-apps.html) 把 Docker volume 或 host path 掛入 container，資料因此在 restart/update 後保留。但 app 會鎖在特定 server、不能 scale 到多 instances；node 故障時資料不會跟著 service 漂移。

Web/API 應保持 stateless，upload 放 object storage，database 使用 replication-aware 服務。若一定要單機 volume，需監控 disk、離站備份並演練把資料與 placement 一起復原；shared filesystem/plugin 會引入一致性與 failure semantics，不能當免費 HA。

## CapRover backup 不包含所有東西

[Backup/Restore](https://caprover.com/docs/backup-and-restore.html) 文件明示此功能仍具實驗性，標準 backup 包含 configuration 與 certificate 等控制狀態，但不含 container images 與 persistent directories。完整復原至少包含 CapRover state、registry images、volumes/databases、DNS、secrets 與 node labels。

CapRover 適合想用單一 VPS 起步、再用 Swarm 擴展 stateless services 的小團隊。偏 Compose 與多 remote servers 可看 Dokploy；偏多資源與 server control plane 可看 Coolify；要更強 policy/operator ecosystem 才進 Kubernetes。驗收需拔掉 worker 與 manager、重建 registry image、restore volume、更新 certificate，並確認 rollback 不破壞 schema。

## 參考資料

- [CapRover getting started](https://caprover.com/docs/get-started.html)
- [CapRover deployment methods](https://caprover.com/docs/deployment-methods.html)
- [App scaling and cluster](https://caprover.com/docs/app-scaling-and-cluster.html)
- [Persistent apps](https://caprover.com/docs/persistent-apps.html)
- [Backup and restore](https://caprover.com/docs/backup-and-restore.html)
