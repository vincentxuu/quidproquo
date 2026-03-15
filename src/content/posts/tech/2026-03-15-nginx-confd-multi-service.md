---
title: "用 nginx conf.d 管理多服務 reverse proxy：以島島為例"
date: 2026-03-15
category: tech
tags: [nginx, devops, docker, reverse-proxy]
lang: zh-TW
tldr: "單一 nginx.conf 隨服務增加變得難以維護，用 include conf.d/*.conf 按服務拆分是標準解法。"
description: "介紹 nginx 作為 reverse proxy 的基本概念，以及用 conf.d include 模式管理多服務配置的實作方式，以島島多環境架構為具體案例。"
draft: false
---

部署多個服務時，nginx 幾乎是標配的入口層。但隨著服務增加，單一 `nginx.conf` 會快速膨脹成幾百行、難以 review 的配置文件。這篇介紹 nginx 的 `include` 機制，以及島島如何用 `conf.d/` 結構管理十幾個子域名的路由配置。

## nginx 是什麼

nginx 是一個高效能的 HTTP server，在 web 架構裡最常以 **reverse proxy** 的角色出現：接收外部請求，根據 domain 或路徑轉發到對應的後端服務。

```
使用者 → nginx → prod_website:3000
              → api_server:3000
              → ai_backend:8000
```

相較於讓每個服務各自暴露 port，把 nginx 放在前面有幾個好處：
- 統一管理 HTTPS、安全標頭、logging
- 後端服務不需要對外暴露 port
- 可以做 WebSocket upgrade、request buffering、靜態資源快取

## 單一 nginx.conf 的問題

nginx 的所有設定預設都寫在 `/etc/nginx/nginx.conf`。一個服務一個 `server` block，五個服務就五個 block，十個就十個。

島島在整合進單一檔案時，nginx.conf 膨脹到超過 500 行，涵蓋前端主站、product app、Node 後端、AI 後端、管理介面、部落格、n8n 等服務。每次新增路由都要在同一個檔案裡找位置，git diff 也很難看清楚到底改了哪個服務。

## conf.d include 模式

nginx 支援在 `http {}` 區塊內用 `include` 載入其他設定檔：

```nginx
http {
    # ... 全域設定 ...
    include /etc/nginx/conf.d/*.conf;
}
```

這樣可以把每個服務的 `server {}` block 拆成獨立檔案，放進 `conf.d/` 目錄。nginx 啟動時會自動載入所有 `.conf` 檔。

## 島島的拆分方式

島島按服務類型分成七個檔案：

```
nginx/
├── nginx.conf          # 全域設定（Cloudflare IP、DNS resolver）
└── conf.d/
    ├── website.conf    # daodao.so, dev.daodao.so, feat.daodao.so
    ├── product.conf    # app.daodao.so, app-dev, app-feat
    ├── server.conf     # server.daodao.so, server-dev（Node 後端）
    ├── ai.conf         # ai.daodao.so, ai-dev（Python AI 後端）
    ├── admin.conf      # admin.daodao.so（htpasswd 保護）
    ├── content.conf    # blog, docs, status
    └── n8n.conf        # n8n.daoedu.tw
```

`nginx.conf` 只保留全域設定，不包含任何 `server {}` block：

```nginx
http {
    include /etc/nginx/mime.types;
    sendfile on;
    keepalive_timeout 65;

    # Cloudflare 真實 IP
    set_real_ip_from 103.21.244.0/22;
    # ... 其他 Cloudflare CIDR ...
    real_ip_header CF-Connecting-IP;

    # Docker 內部 DNS（動態 upstream 解析用）
    resolver 127.0.0.11 valid=30s ipv6=off;

    include /etc/nginx/conf.d/*.conf;
}
```

每個 conf 檔只負責自己的服務，例如 `ai.conf`：

```nginx
# AI 後端（正式環境）
server {
    listen 80;
    server_name ai.daodao.so;

    location / {
        set $upstream_ai_prod backend-prod:8000;
        proxy_pass http://$upstream_ai_prod;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 60s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;

        # SSE / streaming
        proxy_buffering off;
        proxy_cache off;
    }

    location /api/v1/health {
        set $upstream_ai_prod_health backend-prod:8000;
        proxy_pass http://$upstream_ai_prod_health/api/v1/health;
        access_log off;
    }
}
```

## Docker 掛載

用 Docker 跑 nginx 時，需要同時掛載 `nginx.conf` 和 `conf.d/` 目錄：

```yaml
services:
  nginx:
    image: nginx:latest
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
```

## CI/CD：自動 syntax check 再 reload

島島把 nginx 配置抽成獨立 repo（`daodao-infra`），推送到 main branch 時由 GitHub Actions 自動驗證語法並 SSH 進 VPS reload：

```yaml
- name: Syntax check (local docker)
  run: |
    docker run --rm \
      -v ${{ github.workspace }}/nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
      -v ${{ github.workspace }}/nginx/conf.d:/etc/nginx/conf.d:ro \
      nginx:latest nginx -t
```

syntax check 通過後才 SSH 進 VPS 執行 `nginx -s reload`，失敗就中斷，不會把壞掉的設定推上去。

## 整體來說

`conf.d` 拆分沒有技術門檻，就是 `include` 一行加目錄結構。對多服務專案的價值在於：

- **git diff 清楚**：改 AI 後端路由只動 `ai.conf`，不會混進其他服務的 diff
- **新增服務零干擾**：加一個 `new-service.conf` 就好，不需要動現有檔案
- **出問題好定位**：nginx 報錯時會指出是哪個 conf 檔哪一行

適合任何跑多個子域名或服務的單機 VPS 部署。
