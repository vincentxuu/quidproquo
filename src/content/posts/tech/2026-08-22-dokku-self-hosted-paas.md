---
title: "Dokku：把單台 Docker 主機變成 Git Push PaaS"
date: 2026-08-22
category: tech
type: deep-dive
tags: [dokku, paas, self-hosting, docker, devops]
lang: zh-TW
tldr: "Dokku 用 Git receiver、buildpack/Dockerfile、process model、Nginx 與 plugins 在單機提供 Heroku 式體驗；簡潔來自刻意縮小編排範圍。"
description: "介紹 Dokku application deployment、buildpacks、process scaling、proxy、plugins、storage、backup 與單機責任。"
series:
  name: "AI 時代的技術選擇"
  order: 83
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-dokku-self-hosted-paas-en)

[Dokku](https://dokku.com/docs/deployment/application-deployment/) 是把 Linux/Docker server 做成 Heroku-like PaaS 的工具。建立 app 後可用 `git push` 觸發 build 與 release，也支援 Dockerfile 和既有 image；process、config、domain、proxy 與 linked services 都由 `dokku` CLI 管理。

## Build、release、run 是主機上的 pipeline

預設以 Herokuish buildpacks 把 source 轉成 image，也能明確提供 Dockerfile。App 要監聽平台給的 `PORT`，用 Procfile/process types 拆 web、worker 等角色，再用 `ps:scale` 設副本。Nginx 預設只 proxy web processes，並在多個 containers 間 round-robin。

Build 會執行 repository 內容，因此 deploy key、Docker socket、build cache 與 host disk 都是攻擊面。CI 應限制誰能 push，固定 buildpack/image，避免把 production SSH key 放入 build context，並監控 image/cache 膨脹。

## Plugin 擴充能力，也擴充維運面

Dokku core 不預裝 PostgreSQL 等 datastore；官方或社群 plugins 提供 service create/link、Let's Encrypt 等功能。Plugin 可能以 root 安裝 hooks、改 proxy 或保存自己的資料，因此升級前要盤點版本相容性、來源與復原流程。`DATABASE_URL` 被注入只代表連上，不代表 migration、backup 或 HA 已完成。

Container filesystem 是 volatile。[Storage](https://dokku.com/docs/advanced-usage/persistent-storage/) 可掛 host directory/volume，但會把 app 綁到該主機。Upload 優先放 object storage；database 用一致性 dump/WAL 工具，不要只複製正在寫入的資料目錄。

## 單機簡潔就是選型邊界

[Backup/Recovery](https://dokku.com/docs/advanced-usage/backup-recovery/) 要涵蓋 Dokku config、apps、plugins、TLS、storage 與各 datastore；custom plugin 復原後還可能需要重跑 install/dependency triggers。主機遺失就是整個 control plane、runtime 與 local state 一起遺失，必須以乾淨 server 做過復原演練。

Dokku 適合單機、少量服務、偏 CLI/Git workflow，且團隊願意管理 Linux 的場景。需要 dashboard、多 remote servers 可看 Coolify/Dokploy；需要跨節點 scheduler 則看 Swarm/Kubernetes。驗收至少重建整台主機、回滾壞版、重送 worker job、續期 certificate 與 restore database。

## 參考資料

- [Dokku application deployment](https://dokku.com/docs/deployment/application-deployment/)
- [Dokku process management](https://dokku.com/docs/processes/process-management/)
- [Dokku Nginx proxy](https://dokku.com/docs/networking/proxies/nginx/)
- [Dokku persistent storage](https://dokku.com/docs/advanced-usage/persistent-storage/)
- [Dokku backup and recovery](https://dokku.com/docs/advanced-usage/backup-recovery/)
