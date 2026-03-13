---
title: "Cloudflare Free Plan 設維護頁：Custom Error Pages 不能用，改用 Worker"
date: 2026-03-13
category: tech
tags: [cloudflare, workers, nginx, devops]
lang: zh-TW
tldr: "Cloudflare Custom Error Pages 需要付費方案，Free Plan 可改用 Worker inline HTML 攔截 5xx。"
description: "Cloudflare Free Plan 無法使用 Custom Error Pages，本文記錄用 Worker 攔截 nginx 5xx 並顯示自訂維護頁的解法。"
draft: false
---

## TL;DR

Cloudflare 的 Custom Error Pages（在 nginx 掛掉時顯示自訂頁面）2025 年後已整合進 Rules，
改名為 Error Pages，且**只有付費方案才能用**。
Free Plan 的替代方案：建一個 Cloudflare Worker 當 proxy，
把維護頁 HTML inline 在 Worker 裡，origin 回 5xx 時直接回傳。

## 情境

正在把 nginx 從 `daodao-server` 獨立成 `daodao-infra` repo，
計劃在切換期間（< 1 分鐘）用 Cloudflare 的維護頁保底，
避免用戶在這段空窗期看到裸錯誤。

## 問題

在 Cloudflare Dashboard 找不到 Custom Error Pages。
文件說在 **Rules → Custom Pages**，但 Rules 底下只有：
概觀、Snippets、雲端連接器、追蹤、網頁規則、設定。沒有 Custom Pages。

查了一下，2025 年 4 月後這個功能已更名為 **Error Pages**，
移進 Rules 底下，**但只有 Pro 以上方案才有**。Free Plan 完全看不到。

## 解法

用 Cloudflare Worker 做 proxy，維護頁 HTML 直接 inline 在 Worker 裡。

```javascript
const MAINTENANCE_HTML = `...`;  // 完整 HTML inline

export default {
  async fetch(request) {
    // 預覽路徑（直接回傳維護頁，不 proxy）
    if (new URL(request.url).pathname === '/maintenance.html') {
      return new Response(MAINTENANCE_HTML, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    try {
      const response = await fetch(request);
      if (response.status >= 500) {
        return new Response(MAINTENANCE_HTML, {
          status: response.status,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }
      return response;
    } catch {
      // origin 完全無回應
      return new Response(MAINTENANCE_HTML, {
        status: 503,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }
  },
};
```

部署後，到 **網站 → daodao.so → Workers 路由 → 新增路由**：
- 路由：`daodao.so/*`
- Worker：選剛部署的 Worker
- 失敗模式：**失敗開放（繼續）**

> 失敗模式選「開放」：若 Worker 本身出問題，請求直接到 nginx，不會因 Worker 掛掉影響正常流量。

## 測試

**預覽維護頁外觀**

Worker 部署後，直接訪問：

```
https://<worker-name>.<account>.workers.dev/maintenance.html
```

Worker 的 `/maintenance.html` 路徑會直接回傳維護頁（不做 proxy），
可以確認頁面樣式是否正確。

**測試 5xx 觸發（綁定 domain 後）**

在 VPS 上暫停 nginx：

```bash
docker stop nginx
```

訪問 `https://daodao.so`，應看到維護頁而非裸錯誤。
測完後恢復：

```bash
docker start nginx
```

## 為什麼會這樣

Cloudflare 在 2025 年 4 月把 Custom Pages 整合重構，
升級成更強的 Custom Error Rules（支援條件式邏輯），但把功能鎖在付費方案。
Free Plan 的 dashboard 完全不顯示這個選項，官方文件也沒有特別標注限制，
導致找了很久才發現根本沒這個功能。

## 學到的事

Cloudflare Worker 作為輕量 proxy 用途很廣，不只是 edge function，
遇到平台功能被鎖在付費方案時，Worker 幾乎都可以用程式碼自己實作。
Free Plan 每日 10 萬次請求，一般站台綽綽有餘。
