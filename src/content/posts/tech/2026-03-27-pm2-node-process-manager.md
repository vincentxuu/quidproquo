---
title: "PM2：Node.js 程序管理的實用選擇"
date: 2026-03-27
type: guide
category: tech
tags: [pm2, nodejs, process-manager, deployment]
lang: zh-TW
tldr: "PM2 讓 Node.js 應用在 server 上持續跑，掛掉自動重啟，可以開 cluster 模式用滿 CPU，Log 也幫你管好。部署在 VM 或 VPS 的 Node.js 應用幾乎都需要它。"
description: "PM2 的核心功能介紹：daemon 模式、cluster 模式、log 管理、ecosystem 設定檔、零停機重啟。以島島（DaoDao）的部署架構說明 PM2 在實際生產環境的用途。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-03-27-pm2-node-process-manager-en)

Node.js 跑在 server 上，你不能用 `node index.js` 然後關掉 terminal 就結束——process 會跟著消失。PM2 是個 process manager，讓 Node.js 應用以 daemon 方式執行、掛掉自動重啟、多核 CPU 可以開 cluster，Log 集中管理。

這些需求聽起來基本，但不用 PM2 的話你要自己解決，複雜度不低。

## 安裝與基本用法

```bash
npm install -g pm2
```

啟動一個應用：

```bash
pm2 start dist/index.js --name my-api
```

查看所有跑著的 process：

```bash
pm2 list
```

輸出類似這樣：

```
┌────┬──────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┐
│ id │ name     │ namespace   │ version │ mode    │ pid      │ status │ cpu  │
├────┼──────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┤
│ 0  │ my-api   │ default     │ 1.0.0   │ fork    │ 12345    │ online │ 0%   │
└────┴──────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┘
```

其他常用指令：

```bash
pm2 restart my-api    # 重啟
pm2 stop my-api       # 停止
pm2 delete my-api     # 從清單移除
pm2 logs my-api       # 看 log（即時串流）
pm2 monit             # 互動式監控面板
```

## Cluster 模式

Node.js 是單執行緒的，一個 process 最多用一個 CPU core。如果你的 server 有 8 cores，預設跑一個 Node.js process 等於浪費 7 個 cores。

PM2 的 cluster 模式用 Node.js 內建的 `cluster` 模組，自動開多個 worker process，每個 worker 跑一份應用，流量由 PM2 用 round-robin 分配：

```bash
pm2 start dist/index.js --name my-api -i max
```

`-i max` 表示開跟 CPU 數量相同的 worker。也可以指定數量：

```bash
pm2 start dist/index.js --name my-api -i 4
```

Cluster 模式的前提：你的應用是 stateless 的。如果 in-memory state 放在 process 裡（比如 session 存在 local memory），cluster 模式下不同 worker 的 state 不互通，會出 bug。Session 要放 Redis，不要放 process memory。

## Ecosystem 設定檔

每次用 CLI 啟動時打一大串參數很麻煩，用 `ecosystem.config.js` 管理設定：

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "api",
      script: "dist/index.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      max_memory_restart: "500M",
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
```

用設定檔啟動：

```bash
# 開發環境
pm2 start ecosystem.config.js

# 生產環境
pm2 start ecosystem.config.js --env production
```

`max_memory_restart` 設定當 process 記憶體超過閾值時自動重啟，避免記憶體洩漏讓 server 崩掉。

## Log 管理

PM2 預設把 stdout 和 stderr 寫到 `~/.pm2/logs/`。上面的 ecosystem 設定把 log 寫到 `./logs/`，比較好找。

即時看 log：

```bash
pm2 logs             # 所有 process 的 log
pm2 logs api         # 只看 api 這個 process
pm2 logs api --lines 100  # 最近 100 行
```

Log 檔案會一直長大。用 `pm2-logrotate` 定期切割：

```bash
pm2 install pm2-logrotate
```

預設每天切一次，超過 10MB 也會切，保留最近 30 天。

## 零停機重啟

普通的 `pm2 restart` 會先停再啟，中間有短暫的服務中斷。`reload` 指令做 rolling restart，cluster 模式下 worker 一個一個重啟，始終保持其他 worker 在服務中：

```bash
pm2 reload my-api
```

這讓你可以在不中斷服務的情況下部署新版本。

## 在 DaoDao 的用途

島島的部署是 Docker + PM2 + GitHub Actions 的組合。Docker 提供容器化環境，PM2 在容器內管理 Node.js process。

為什麼在容器內還需要 PM2？Docker 有自己的 restart policy，但 PM2 的 cluster 模式和 log 管理是 Docker 沒有直接提供的。對一個跑在 VM 上的 Node.js 後端，PM2 的 cluster 模式可以把 CPU 資源用滿，實際的 throughput 差異明顯。

CI/CD 流程：
1. GitHub Actions 觸發，build Docker image
2. Push image 到 registry
3. SSH 到 server，pull 新 image，啟動新容器
4. 容器內 PM2 以 cluster 模式管理 Node.js process
5. 部署完成，Discord webhook 通知

## 開機自動啟動

```bash
pm2 startup
```

PM2 會根據你的 OS 輸出一行指令，複製貼上執行，之後重開機 PM2 會自動啟動所有應用。

存當前的 process 清單：

```bash
pm2 save
```

這樣 PM2 知道重開機後要啟動哪些 process。

## 取捨

**優點：**
- 設定簡單，幾分鐘就能跑起來
- Cluster 模式無縫接入 Node.js，不需要改應用程式碼
- Log 管理開箱即用

**缺點：**
- Cluster 模式要求 stateless 應用，有 in-memory state 的應用要先重構
- 跟 Kubernetes 相比，功能和彈性差很多——但 K8s 的複雜度也高很多
- 在容器化部署（Kubernetes）的環境下，process management 通常由 K8s 負責，PM2 的角色變得重疊

PM2 的定位很明確：你有一台（或幾台）server，需要簡單地管理 Node.js process。不需要 K8s，也不用 serverless，就是 PM2。

## 參考資料

- [PM2 官方文件](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [PM2 Cluster Mode](https://pm2.keymetrics.io/docs/usage/cluster-mode/)
- [PM2 Ecosystem File](https://pm2.keymetrics.io/docs/usage/application-declaration/)
- [pm2-logrotate](https://github.com/keymetrics/pm2-logrotate)
- [島島（DaoDao）技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — DaoDao 的 Docker + PM2 部署架構
