---
title: "Dokploy：Application、Docker Compose、Remote Server 與 Swarm 的自架 PaaS"
date: 2026-08-22
category: tech
type: deep-dive
tags: [dokploy, paas, self-hosting, docker-compose, devops]
lang: zh-TW
tldr: "Dokploy 同時支援單 container Application 與 Compose/Stack，並把單機、獨立 remote servers、Swarm cluster 定義成三種不同部署拓撲。"
description: "介紹 Dokploy Application、Docker Compose、Traefik、preview、remote/build servers、Swarm、volume backup 與安全邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 81
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-dokploy-self-hosted-paas-en)

[Dokploy](https://docs.dokploy.com/docs/core) 是以 Docker 與 Traefik 提供 Git-to-deploy、domain、TLS、log、monitoring、database、backup 與 preview 的自架平台。選它之前，先決定 workload 是單一 **Application**、多 service **Docker Compose**，還是需要 Swarm 的 **Stack**。

## Application 與 Compose 是不同抽象

[Application](https://docs.dokploy.com/docs/core/applications) 對應單一 service/container，可選 provider、build type、replicas、resource、volume 與 domain。Compose 則保留 multi-container topology；UI variables 會寫到 `.env`，但必須在 Compose 內用 `env_file` 或 `environment` 明確注入。

Dokploy 可替 Compose 加 Traefik labels，但 domain 變更需要 redeploy。應先 preview 最終 Compose，確認沒有把 database port 發到 host、沒有加入錯誤 shared network，也沒有把 secret 寫入可讀設定。

## Remote server 不等於 cluster

[Deployment options](https://docs.dokploy.com/docs/core/deployment-options) 分三種：同機 Dokploy Server 最簡單；Remote Servers 由 SSH 管理，各自有獨立 Docker/Traefik，彼此不組成 cluster；Swarm Nodes 才共同排程 replicas 與 load balance。需要隔離 region/customer 用 remote server，需要同一 application 跨機副本才用 Swarm。

Dedicated build server 可 build Application、push registry，再由 deployment server pull；Compose build 目前不適用。這使 registry 成為供應鏈與 availability 元件，必須固定 tag/digest、限制 push credential、保留 artifact 並測 registry outage。

## Volume backup 不是整機 recovery

[Compose storage](https://docs.dokploy.com/docs/core/docker-compose) 可用 bind mount 或 named volume；Dokploy volume backup 只支援 named volume。Swarm 上的 local volume 也不會因 scheduler 移動 container 就跟著走。Database backup 應用原生一致性工具，再加 off-site object storage 與 restore drill。

Preview deployment 會在自家 server 執行 PR code；官方特別提醒 public repository 不宜直接開啟，否則外部 contributor 可能執行 build/deploy。隔離 preview credentials、限制資源與數量、禁止 Docker socket/production network，合併後清理。

Dokploy 適合偏好 Compose、想管理多台獨立 VPS 或逐步進 Swarm 的 Docker 團隊。Coolify 的 resource catalog/control-plane 模型、CapRover 的簡化 Swarm、Kubernetes 的完整編排各有不同複雜度。驗收應測 UI host outage、remote SSH loss、Traefik reload、registry loss、preview 惡意 build 與 volume restore。

## 參考資料

- [Dokploy documentation](https://docs.dokploy.com/docs/core)
- [Dokploy applications](https://docs.dokploy.com/docs/core/applications)
- [Dokploy Docker Compose](https://docs.dokploy.com/docs/core/docker-compose)
- [Dokploy deployment options](https://docs.dokploy.com/docs/core/deployment-options)
- [Dokploy remote servers](https://docs.dokploy.com/docs/core/remote-servers)
- [Dokploy preview deployments](https://docs.dokploy.com/docs/core/applications/preview-deployments)
