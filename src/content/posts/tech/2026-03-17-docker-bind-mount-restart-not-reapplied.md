---
title: "docker restart 不會重新套用 volumes —— bind mount 失效排查記錄"
date: 2026-03-17
category: tech
tags: [docker, docker-compose, bind-mount, devops]
lang: zh-TW
tldr: "docker restart 不會重建容器，volumes 設定改了必須用 docker-compose down && up 才會生效。"
description: "記錄一次 Docker bind mount 失效的完整排查過程：容器與宿主機看到不同目錄內容、檔案遺失、以及停電重啟的預防方案。"
draft: false
---

## TL;DR

`docker restart` 不會重建容器，所以 `docker-compose.yml` 裡的 volumes 設定改了之後，必須跑 `docker-compose down && docker-compose up -d` 才會生效。光是 restart，bind mount 不會更新。

## 情境

NestJS 後端服務跑在 Docker 容器裡，匯出功能會把處理好的 PDF 移動到指定目錄（透過 bind mount 對應到宿主機的 `/data/exports/{category}/`）。某天匯出功能突然壞掉。

## 問題

```
Log_Level: "warn"
Log_Message: "匯出失敗，目標目錄不存在：/app/exports/category-a/files/type-b"

Log_Level: "error"
Log_Message: "BadRequestException: 匯出失敗，請重新檢查資料目錄，重新匯出"
  at validateTargetDirectories
```

`validateTargetDirectories` 在匯出前會確認目標目錄存在，這裡拋出代表路徑根本不見了。

## 嘗試過程

**第一步：確認宿主機目錄存在**

以為是宿主機缺少目錄，但直接確認，目錄確實存在且有資料。

**第二步：進容器看**

```bash
docker exec my-app ls /app/exports/category-a/files
# 輸出：20260317
```

宿主機有 `type-b/` 目錄，容器卻只看到一個叫 `20260317` 的東西。嘗試把它當目錄列出：

```bash
docker exec my-app ls /app/exports/category-a/files/20260317/
# ls: /app/exports/category-a/files/20260317/: Not a directory
```

`20260317` 是一個**檔案**，不是目錄，而且是今天的日期。這是 app 自己在容器 filesystem 上建立的，跟宿主機一點關係都沒有。兩邊內容完全不同，代表 **bind mount 沒有生效**。

**第三步：確認 docker inspect**

```bash
docker inspect my-app --format '{{json .Mounts}}' | python3 -m json.tool
```

```json
{
  "Source": "/data/exports/category-a/files",
  "Destination": "/app/exports/category-a/files",
  "Mode": "rw",
  "RW": true
}
```

設定有，但就是沒套用。

## 解法

```bash
docker-compose down && docker-compose up -d
```

`down` 會完全移除容器，`up` 重建時才會把 volumes 設定套進去。

重建後驗證雙向都通：

```bash
# HOST → CONTAINER
touch /data/exports/category-a/files/type-b/test.txt
docker exec my-app ls /app/exports/category-a/files/type-b/
# 看得到 test.txt ✓

# CONTAINER → HOST
docker exec my-app touch /app/exports/category-a/files/type-b/test2.txt
ls /data/exports/category-a/files/type-b/
# 看得到 test2.txt ✓
```

## 為什麼會這樣

Docker 的 bind mount 是在容器**建立時**（`docker create`）套用的，不是在啟動時。`docker restart` / `docker stop + start` 只是停止再啟動同一個容器，容器的 metadata（包含 volumes 設定）不會更新。

所以流程應該是：改了 `docker-compose.yml` 的 volumes → `docker-compose down`（移除容器）→ `docker-compose up`（用新設定重建容器）。

## 附帶損失

在 bind mount 失效期間，app 執行了一次匯出（copy + delete）：

```
/app/storage/files/.../file.pdf   ← 從這裡移走（宿主機，有效）
  → /app/exports/category-a/files/type-b/file.pdf  ← 寫到容器 filesystem（無效）
```

來源（宿主機）的檔案被刪掉了，目的地卻是容器自己的 filesystem。容器重建後 filesystem 清空，**檔案兩端都消失，無法恢復**，只能重新上傳。

## 預防停電重啟後再次失效

停電重開機後，若 Docker 容器比儲存掛載點更早啟動，bind mount 可能又抓到空目錄。

**本地磁碟**：加 restart policy 就夠了。

```yaml
services:
  my-app:
    restart: unless-stopped
```

**NFS 或網路儲存**：讓 Docker 在 NFS 就緒後才啟動。

```ini
# /etc/systemd/system/docker.service.d/override.conf
[Unit]
After=network-online.target remote-fs.target
Wants=network-online.target remote-fs.target
```

```bash
systemctl daemon-reload && systemctl restart docker
```

## 學到的事

`docker restart` ≠ 重建容器。volumes 設定改了，一定要 `down + up`。
