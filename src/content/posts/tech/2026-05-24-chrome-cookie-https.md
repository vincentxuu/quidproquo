---
title: "手機 Chrome 登入後跳回登入頁：HTTP 入口沒有轉 HTTPS 的踩坑記錄"
date: 2026-05-24
category: tech
type: debug
tags: [cloudflare, debugging, cookie, chrome, nextjs, auth]
lang: zh-TW
tldr: "手機 Chrome 登入後跳回登入頁，不一定是 OAuth 或前端狀態壞掉；這次根因是 app-dev.daodao.so 的 HTTP 入口沒有 301 到 HTTPS，導致 /auth/me 以 http origin 發出時沒有帶 auth_token。"
description: "記錄一次手機 Chrome 登入 loop 的排查：從後端 auth log、Origin/Referer、Set-Cookie、/auth/me 401，最後定位到 Cloudflare Always Use HTTPS 未生效。"
draft: false
---

🌏 [English version](/posts/tech/2026-05-24-chrome-cookie-https-en)

## TL;DR

手機 Chrome 登入後跳回登入頁，不一定是 OAuth 或前端狀態壞掉；這次根因是 `app-dev.daodao.so` 的 HTTP 入口沒有 301 到 HTTPS，導致 `/auth/me` 以 `http` origin 發出時沒有帶 `auth_token`。

## 情境

問題發生在 dev 環境。使用者回報手機 Chrome 登入後會自動跳回登入頁，但 Safari 看起來正常。

系統大致是：

- 前端：Next.js product app，部署在 `app-dev.daodao.so`
- 後端：Express API，部署在 `server-dev.daodao.so`
- 登入：Google OAuth callback 由後端設定 `auth_token` cookie，再 redirect 回前端
- 登入狀態確認：前端呼叫 `/api/v1/auth/me`

這類問題很容易先懷疑前端 route guard：OAuth callback 後還沒刷新 auth state，就被 client-side guard 判定未登入。但這次真正的線索在 request header。

## 問題

手機 Chrome 登入後跳回登入頁。後端看到 `/api/v1/auth/me` 回 401：

```json
{
  "method": "GET",
  "url": "/api/v1/auth/me",
  "message": "缺少認證令牌"
}
```

這代表後端沒有拿到可用 token。可能原因至少有三種：

- OAuth callback 沒有設定 `Set-Cookie`
- 瀏覽器有收到 cookie，但後續 request 沒有送出
- request 根本來自另一個 origin / protocol，讓 cookie 規則不符合

因為 Safari 正常、Chrome 不正常，所以重點放在 cookie、secure context、Origin / Referer、CORS。

## 嘗試過程

先在後端補兩個診斷 log。

第一個放在 OAuth callback 設定 cookie 後，只記錄環境資訊，不印 token：

```ts
const setCookieHeader = res.getHeader("Set-Cookie");
loggerService.info("OAuth callback set auth cookie", {
  userAgent: req.get("User-Agent"),
  origin: req.get("Origin"),
  referer: req.get("Referer"),
  host: req.get("Host"),
  forwardedProto: req.get("X-Forwarded-Proto"),
  frontendUrl,
  cookieDomain: process.env.COOKIE_DOMAIN,
  redirectTarget,
  setCookieHeaderCount: Array.isArray(setCookieHeader) ? setCookieHeader.length : setCookieHeader ? 1 : 0,
});
```

第二個放在 `/auth/me` 缺 token 時，同樣不印 token 值，只印 cookie 名稱和布林值：

```ts
loggerService.warn("Auth me missing token", {
  userAgent: req.get("User-Agent"),
  origin: req.get("Origin"),
  referer: req.get("Referer"),
  host: req.get("Host"),
  forwardedProto: req.get("X-Forwarded-Proto"),
  cookieDomain: process.env.COOKIE_DOMAIN,
  cookieNames: Object.keys(req.cookies ?? {}),
  hasAuthTokenCookie: Boolean(req.cookies?.auth_token),
  hasAuthorizationHeader: Boolean(req.get("Authorization")),
  secFetchSite: req.get("Sec-Fetch-Site"),
  secFetchMode: req.get("Sec-Fetch-Mode"),
  secFetchDest: req.get("Sec-Fetch-Dest"),
});
```

新的 log 很快指出異常點：

```json
{
  "message": "Auth me missing token",
  "origin": "http://app-dev.daodao.so",
  "referer": "http://app-dev.daodao.so/",
  "host": "server-dev.daodao.so",
  "cookieDomain": ".daodao.so",
  "cookieNames": ["_ga", "_ga_52MHR7GXYH", "ph_phc_...", "_clck"],
  "hasAuthTokenCookie": false,
  "secFetchSite": "cross-site"
}
```

這裡有兩個重點：

1. 後端收到的 `Origin` / `Referer` 是 `http://app-dev.daodao.so`。
2. cookie 裡沒有 `auth_token`。

但同一次登入流程後面，OAuth callback 有成功設定 cookie：

```json
{
  "message": "OAuth callback set auth cookie",
  "frontendUrl": "https://app-dev.daodao.so",
  "cookieDomain": ".daodao.so",
  "redirectTarget": "https://app-dev.daodao.so/auth/callback?...",
  "setCookieHeaderCount": 1
}
```

而 callback 後的 `/api/v1/auth/me` 也回 200。這代表 OAuth 本身不是壞的，cookie 在 HTTPS callback 後可以正常運作。

接著直接測 HTTP 入口：

```bash
curl -I -L http://app-dev.daodao.so
```

修正前，Cloudflare 直接回 200：

```http
HTTP/1.1 200 OK
Server: cloudflare
link: <http://app-dev.daodao.so/>; rel="alternate"; hreflang="zh-TW"
```

如果 HTTP 有被強制轉 HTTPS，這裡應該要是 301 或 302，`Location` 指向 `https://app-dev.daodao.so/`。

## 解法

在 Cloudflare 對 `daodao.so` 開啟 `Always Use HTTPS`。

Cloudflare 後台路徑：

1. 進 Cloudflare Dashboard
2. 選 `daodao.so`
3. 進 `SSL/TLS`
4. 進 `Edge Certificates`
5. 開啟 `Always Use HTTPS`

修正後再測：

```bash
curl -I http://app-dev.daodao.so
```

結果變成：

```http
HTTP/1.1 301 Moved Permanently
Location: https://app-dev.daodao.so/
Server: cloudflare
```

手機 Chrome 再次登入後，流程恢復正常。

## 為什麼會這樣

Cloudflare 有代理流量，不代表 HTTP 入口一定會自動轉成 HTTPS。

這次 `http://app-dev.daodao.so` 可以直接回 200，所以瀏覽器確實可能在某些情境下用 HTTP origin 發出 request。對登入 cookie 來說，這很容易出問題：

- `auth_token` 是跨子網域使用的安全 cookie。
- `SameSite=None` 的 cookie 需要 `Secure`，也就是要走 HTTPS。
- 前端 request 以 `http://app-dev.daodao.so` 作為 origin 時，Chrome 會用不同的安全上下文和 site 判定。
- 後端看到 `secFetchSite: "cross-site"`，且沒有收到 `auth_token`。

MDN 對 `Set-Cookie` 的說明提到，`SameSite=None` 必須搭配 `Secure`。MDN 的 Fetch `credentials` 文件也提醒，瀏覽器是否送出 credential、是否尊重 `Set-Cookie`，會受 request credentials 設定影響。這些條件都正確時，仍然要確保頁面本身不是從 HTTP origin 發出 request。

所以這次不是「手機 Chrome 不支援登入」，也不是「OAuth callback 沒設 cookie」。真正的問題是：HTTP 入口還活著，讓某些 request 出現在錯的 origin。

## 學到的事

登入問題不要只看「有沒有 cookie」。要同時看：

- OAuth callback 有沒有 `Set-Cookie`
- `/auth/me` request 有沒有帶 `auth_token`
- `Origin` / `Referer` 是 `http` 還是 `https`
- `Sec-Fetch-Site` 是 `same-site` 還是 `cross-site`
- Cloudflare 的 HTTP 入口是否真的 301 到 HTTPS

一句話：**服務在 Cloudflare 上，不等於 HTTP 入口已經關掉；登入系統要把 HTTP 到 HTTPS 的轉址當成基本驗收項目。**

## 參考資料

- [Cloudflare Docs: Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/)
- [MDN: Set-Cookie header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
- [MDN: Request.credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)
- [MDN: Cross-Origin Resource Sharing credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
