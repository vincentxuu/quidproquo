---
title: "nginx 重啟後 Cloudflare 一直回 502，但 origin 明明是正常的"
date: 2026-03-15
category: tech
tags: [nginx, cloudflare, docker, reverse-proxy, debugging]
lang: zh-TW
tldr: "nginx 重啟期間短暫出錯，Cloudflare 偵測到 origin 不健康後停止轉發請求，自己回傳 502。localhost 打 origin 是 200，nginx access log 空白是關鍵線索。等 Cloudflare 自動 re-check 即可恢復。"
description: "nginx 重啟導致 Cloudflare 標記 origin 不健康，所有請求被 Cloudflare 攔截回傳 502 的診斷過程與解法。"
draft: false
---

## TL;DR

nginx 重啟期間短暫出錯，Cloudflare 偵測到 origin 不健康後停止轉發請求，自己回傳 502。localhost 打 origin 是 200，nginx access log 完全空白是關鍵線索。等 Cloudflare 自動 re-check 即可恢復。

## 情境

調整 nginx upstream 設定後重啟 nginx，部分子網域開始持續回傳 502。不是「第一個請求 502，之後 200」的模式，而是**全部都 502**。

受影響的子網域：`app.daodao.so`、`app-dev.daodao.so`、`app-feat.daodao.so`

正常的：`server.daodao.so`、`ai-dev.daodao.so`

## 問題

```bash
for i in {1..5}; do
  curl -s -o /dev/null -w "%{http_code}\n" https://app.daodao.so
done
502
502
502
502
502
```

## 嘗試過程

**容器是健康的：**

```bash
docker ps | grep prod_product
# Up 2 weeks (healthy)
```

**從 nginx container 直接打 upstream，200：**

```bash
docker exec nginx curl -s -o /dev/null -w "%{http_code}" http://prod_product:3001
# 200
```

**從 VPS 的 localhost 打，也是 200：**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost -H "Host: app.daodao.so"
# 200
```

**nginx error log 空白，access log 也空白。**

這是最關鍵的線索——**requests 根本沒進到 nginx**。

**查 response header：**

```bash
curl -si https://app.daodao.so | head -20
```

```
HTTP/2 502
content-type: text/plain; charset=UTF-8
content-length: 15
server: cloudflare
cf-ray: 9dcb32d71dc4b486-SIN

error code: 502
```

注意幾個點：
- `server: cloudflare`，不是 nginx
- `content-type: text/plain`，nginx 的 502 頁面是 HTML
- 沒有 `cf-cache-status` header
- body 是 `error code: 502`（15 字元）

這不是 nginx 回的，也不是 Cloudflare 的快取——是 **Cloudflare 自己產生的錯誤頁面**。

## 根本原因

nginx 這次重啟其實發生了兩次：

1. 第一次：新設定有問題（upstream 缺少 `zone` 指令），nginx 啟動失敗
2. 第二次：修正後重啟成功，但啟動初期 upstream DNS 尚未解析完成，短暫回傳 502

Cloudflare 偵測到 origin 連續出錯，觸發了 origin health check 機制，**暫時停止把請求轉發到 origin，改由自己直接回傳 502**。

為什麼只有部分子網域受影響？因為 Cloudflare 是**以 hostname 為單位**追蹤 origin 健康狀態。剛好在 nginx 重啟的短暫窗口內有請求打到這些子網域，就被標記為不健康。

## 解法

等 Cloudflare 自動 re-check origin，確認恢復後就會繼續轉發。實際測試約幾分鐘內自動恢復。

不需要任何操作，但下次可以提前確認的是：

```bash
# 確認是 Cloudflare 的問題，不是 nginx
curl -si https://your-domain.so | grep "server:"
# server: cloudflare → 確認是 CF 在回

# 確認 origin 本身正常
curl -s -o /dev/null -w "%{http_code}\n" http://localhost -H "Host: your-domain.so"
# 200 → origin 沒問題，等 CF 即可
```

## 預防

nginx 盡量用 `reload` 取代 `restart`，零停機且不重置共享記憶體狀態，可以避免觸發 Cloudflare 的 origin health check：

```bash
docker exec nginx nginx -s reload
```

## 學到的事

nginx access log 完全空白 = 請求沒有到 nginx。遇到 502 先確認 `server:` header，是 `cloudflare` 就去查 Cloudflare，是 `nginx` 才去查 nginx。

## 參考資料

- [Cloudflare Error 502 Bad Gateway](https://developers.cloudflare.com/support/troubleshooting/cloudflare-errors/troubleshooting-cloudflare-5xx-errors/#error-502-bad-gateway-or-error-504-gateway-timeout)
- [Cloudflare Health Checks](https://developers.cloudflare.com/health-checks/)
- [nginx - Controlling nginx (reload vs restart)](https://nginx.org/en/docs/control.html)
