---
title: "Cloudflare Workers 綁定自訂網域的正確寫法"
date: 2026-03-12
category: tech
tags: [cloudflare, workers, wrangler, dns]
lang: zh-TW
tldr: "wrangler.jsonc 的 routes 用 custom_domain: true，pattern 只填 hostname，不加 /*"
description: "在 wrangler.jsonc 設定 custom domain 時的格式坑：不能帶路徑或萬用字元"
draft: false
type: debug
---

## TL;DR

`routes` 的 `pattern` 只填 hostname，不加 `/*`，搭配 `custom_domain: true`。

## 情境

部落格部署到 Cloudflare Workers 後，想把 `quidproquo.cc` 綁上去，取代預設的 `*.workers.dev` 網址。

## 問題

在 `wrangler.jsonc` 加了這樣的設定：

```jsonc
"routes": [
  { "pattern": "quidproquo.cc/*", "custom_domain": true }
]
```

`wrangler deploy` 報錯：

```
Invalid Routes:
  quidproquo.cc/*:
  Wildcard operators (*) are not allowed in Custom Domains
  Paths are not allowed in Custom Domains
```

## 解法

Custom domain 的 `pattern` 只填 hostname，不帶路徑或萬用字元：

```jsonc
"routes": [
  { "pattern": "quidproquo.cc", "custom_domain": true },
  { "pattern": "www.quidproquo.cc", "custom_domain": true }
]
```

改完之後需要重新 `astro build`，因為 Cloudflare adapter 會把設定複製進 `dist/server/wrangler.json`，直接 `wrangler deploy` 會用舊的 dist 檔。

## 為什麼會這樣

Custom domain 和 route pattern 是兩種不同的機制。Route pattern（如 `example.com/*`）是給 Zone-based routing 用的，會做路徑比對。Custom domain 是直接把整個 hostname 指向 Worker，不需要也不允許路徑。

## 學到的事

`custom_domain: true` 的 pattern 就是 hostname，加了路徑就壞。每次改 `wrangler.jsonc` 都要重新 build。
