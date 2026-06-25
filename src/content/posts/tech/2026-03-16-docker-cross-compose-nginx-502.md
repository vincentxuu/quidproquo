---
title: "nginx 502：跨 Compose 專案的容器 DNS 解析踩坑"
date: 2026-03-16
type: guide
category: tech
tags: [docker, nginx, dns, docker-compose]
lang: zh-TW
tldr: "跨 Compose 專案時 service name 不可解析，要加 network alias 才能讓 nginx 找到容器。"
description: "記錄 nginx upstream 解析跨 Compose 專案容器失敗導致 502 的根本原因與解法。"
draft: false
---

🌏 [English version](/posts/tech/2026-03-16-docker-cross-compose-nginx-502-en)

## TL;DR

跨 Docker Compose 專案時，nginx 無法用 service name 解析容器。要在容器的 network 設定加上 alias，nginx 才能找到它。

## 情境

nginx 跑在 `daodao-infra`，AI 後端跑在 `daodao-ai-backend`，兩個獨立的 Compose 專案透過 external network `dev-daodao-network` 互通。

nginx upstream 設定：

```nginx
upstream backend_dev {
    server backend-dev:8000 resolve;
}
```

## 問題

持續收到 502，nginx log 顯示無法解析 `backend-dev`。

## 根本原因

ai-backend 的 docker-compose 當時長這樣：

```yaml
services:
  backend-dev:
    container_name: daodao-ai-backend-dev
    networks:
      - dev-daodao-network
```

Service name `backend-dev` 的 DNS 只在**同一個 Compose 專案內**有效。nginx 在另一個專案，所以查不到 `backend-dev`。

`container_name` 雖然跨專案可解析，但名稱是 `daodao-ai-backend-dev`，跟 nginx 期望的 `backend-dev` 對不上。

## 解法

移除 `container_name`，改用 network alias：

```yaml
services:
  backend-dev:
    networks:
      dev-daodao-network:
        aliases:
          - backend-dev
```

Network alias 在同一個 network 上的所有容器都可見，不限 Compose 專案。nginx 查詢 `backend-dev` → 解析成功 → 502 消失。

## 學到的事

跨 Compose 專案的容器互通，別靠 service name，要明確設定 network alias。

## 參考資料

- [Docker Compose networking](https://docs.docker.com/compose/how-tos/networking/)
- [Docker network aliases](https://docs.docker.com/reference/cli/docker/network/connect/#aliases)
- [nginx - Module ngx_http_upstream_module](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)
- [島島阿學技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
