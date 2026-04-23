---
title: "Docker DNS 解析：container_name vs network alias"
date: 2026-03-16
type: guide
category: tech
tags: [docker, dns, docker-compose, networking]
lang: zh-TW
tldr: "跨 Compose 專案只能靠 container_name 或 network alias 解析，而 alias 才支援 scale。"
description: "說明 Docker DNS 解析在同專案與跨專案的行為差異，以及 container_name 和 network alias 的適用情境。"
draft: false
---

在 Docker 裡，容器之間靠 DNS 互相找到對方。但 DNS 能解析什麼名稱，取決於容器之間的關係——是同一個 Compose 專案，還是跨專案共用 network。

## Docker DNS 解析規則

| 情境 | 可解析的名稱 |
|------|-------------|
| 同一個 Compose 專案內 | service name、container_name、network alias |
| 跨 Compose 專案（共用 external network） | container_name、network alias |

Service name 的 DNS 是 Compose 專案層級的，出了專案就不可見。

## container_name 的問題

`container_name` 跨專案雖然可解析，但有兩個硬傷：

**全域唯一限制**：Docker 不允許兩個容器用同一個 `container_name`。重新 `docker compose up` 時如果舊容器還沒清乾淨，會報錯：

```
Error: container name "/my-container" is already in use
```

**無法水平擴展**：`--scale` 啟動第二個副本時，第二個容器無法套用同一個 `container_name`，直接失敗。

## network alias 的優勢

```yaml
services:
  backend-dev:
    networks:
      dev-daodao-network:
        aliases:
          - backend-dev
```

Alias 設定在 network 層級，而不是容器層級。同一個 network 上的所有容器都能解析這個名稱，不限 Compose 專案。

**支援 scale**：多個副本可以共用同一個 alias。

```bash
docker compose up --scale backend-dev=2
```

兩個容器都掛上 `backend-dev` 這個 alias。DNS 查詢時回傳兩個 IP，nginx 或其他服務自動 round-robin，不需要額外的負載均衡設定。

## 什麼時候用哪個

**用 network alias**：跨 Compose 專案的服務互通，或者未來可能需要 scale 的服務。幾乎所有情況都應該用這個。

**用 container_name**：需要從 host 直接操作特定容器（`docker exec`、`docker logs`）時，container_name 讓指令更好寫。但這是維運方便，不是 DNS 用途。

兩者不衝突，可以同時設定：container_name 給人看、給 CLI 用，alias 給容器之間的 DNS 用。

## 參考資料

- [Docker 官方文件：Networking overview](https://docs.docker.com/network/)
- [Docker Compose 官方文件：Networking in Compose](https://docs.docker.com/compose/how-tos/networking/)
- [Docker 官方文件：docker compose up --scale](https://docs.docker.com/reference/cli/docker/compose/up/)
- [nginx 502：跨 Compose 專案的容器 DNS 解析踩坑](/posts/tech/2026-03-16-docker-cross-compose-nginx-502)
- [島島阿學技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
