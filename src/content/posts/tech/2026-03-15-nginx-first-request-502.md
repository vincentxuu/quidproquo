---
title: "nginx 第一個請求必定 502，之後全部正常"
date: 2026-03-15
category: tech
tags: [nginx, docker, dns, upstream, reverse-proxy]
lang: zh-TW
tldr: "nginx 用 set $variable 做動態 upstream 時，DNS 快取每 30 秒過期，第一個請求因無可用 IP 而 502。升到 nginx 1.27.3 改用 upstream + resolve 參數，DNS 在背景非同步更新，根治問題。"
description: "nginx 動態 upstream DNS 快取過期導致第一個請求 502 的根本原因，以及用 nginx 1.27.3 resolve 參數根治的方法。"
draft: false
---

## TL;DR

nginx 用 `set $variable` 做動態 upstream 時，DNS 快取每 30 秒過期，第一個請求因無可用 IP 而 502。升到 nginx 1.27.3 改用 `upstream` block + `resolve` 參數，DNS 在背景非同步更新，根治問題。

## 情境

服務跑在 Docker 上，nginx 作為 reverse proxy，upstream 是各個 container。為了支援零停機部署（container 重啟後 IP 會變），用了常見的 `set $variable` 技巧讓 nginx 每次請求都動態解析 DNS：

```nginx
# nginx.conf
resolver 127.0.0.11 valid=30s ipv6=off;

# conf.d/server.conf
location / {
    set $upstream production_app:3000;
    proxy_pass http://$upstream;
}
```

## 問題

跑了一個簡單的壓力測試：

```bash
for i in {1..5}; do
  curl -s -o /dev/null -w "%{http_code}\n" https://server.daodao.so/api/v1/health
done
```

結果：

```
502
200
200
200
200
```

三個不同的 endpoint 都一樣，**第一個請求必定 502，之後全部正常**。且 container 一直在跑，不是 cold start 的問題。

## 嘗試過程

**誤以為是 DNS TTL 快取問題，考慮拉長 valid=**：

```nginx
resolver 127.0.0.11 valid=300s ipv6=off;
```

不能根治，只是把發生頻率從「每 30 秒可能一次」變成「每 5 分鐘可能一次」。第一個請求遇到快取過期，還是會 502。

**考慮 proxy_next_upstream 自動重試**：

```nginx
proxy_next_upstream error timeout http_502;
proxy_next_upstream_tries 2;
```

對 GET 有效，但 POST 重試有重複送出的風險，不能當通用解法。

## 解法

nginx 1.27.3 把 `resolve` 參數從 NGINX Plus 開源出來了。改用 `upstream` block 並加上 `resolve`：

```nginx
# conf.d/upstreams.conf（集中管理所有 upstream）
upstream production_app {
    zone production_app 64k;
    server production_app:3000 resolve;
    keepalive 32;
}

upstream backend_prod {
    zone backend_prod 64k;
    server backend-prod:8000 resolve;
    keepalive 16;
}
```

```nginx
# conf.d/server.conf
location / {
    proxy_pass http://production_app;
    include /etc/nginx/snippets/proxy-headers.conf;
}
```

`resolver` 指令留在 `nginx.conf` 的 `http` block 即可，`resolve` 參數會使用它。

**`zone` 是必要的，不能省略。** `resolve` 要求 upstream 必須有 `zone` 分配共享記憶體，讓多個 worker process 共享 DNS 解析狀態。少了它，nginx 啟動時會報錯：

```
[emerg] resolving names at run time requires upstream "production_app" to be in shared memory
```

`zone <name> 64k` 的大小對單一 server 的 upstream 來說 64k 已經足夠。

## 為什麼會這樣

`set $variable` + `proxy_pass http://$variable` 的機制是：**每次請求進來時**，nginx 查 DNS 快取，若快取有效就直接用，若過期就發起非同步 DNS 查詢。

關鍵在於：**查詢期間沒有可用的 IP**，nginx 不會等，也不會用舊的 IP，直接回 502。查詢完成後快取更新，下一個請求命中快取，200。

這就是為什麼「第一個請求 502，之後全部正常」——後面的請求都在 DNS 快取還有效的 30 秒內打進來。

`resolve` 參數的差異在於：**DNS 更新發生在背景**，不綁定到任何一個請求。快取過期後，nginx 自己去更新，進來的請求繼續用舊的 IP 服務，更新完成後才切換。容器重啟 IP 改變時也會自動跟上，不需要 nginx reload。

## 學到的事

`set $variable` 是過渡方案，nginx 1.27.3 之後有更乾淨的解法。用之前先確認 nginx 版本。`resolve` + `zone` 要一起加，少一個就不能動。

## 參考資料

- [nginx - Module ngx_http_upstream_module (server directive, resolve parameter)](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#server)
- [nginx - Module ngx_http_core_module (resolver directive)](https://nginx.org/en/docs/http/ngx_http_core_module.html#resolver)
- [Docker embedded DNS server](https://docs.docker.com/engine/network/#dns-services)