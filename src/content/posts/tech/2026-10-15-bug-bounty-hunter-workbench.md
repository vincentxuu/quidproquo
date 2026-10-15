---
title: "漏洞獵人的工作台：抓請求、改參數、驗證權限"
date: 2026-10-15
category: tech
type: guide
difficulty: 入門
tags: [bug-bounty, security, web-security, burp-suite, chrome-devtools, local-practice]
lang: zh-TW
description: "用本機 Node.js 範例、DevTools 與 Burp Repeater 建立可重複的 HTTP 與訂單授權對照。"
tldr: "先重跑對照組，再只改一個欄位；狀態碼或文字反射本身都不是漏洞證明。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 3
---

> 🌏 [English version](/posts/tech/2026-10-15-bug-bounty-hunter-workbench-en)

## 從一個請求開始

上一章解釋瀏覽器與伺服器怎麼交換資料。這一章把請求抓出來，改一個欄位，再看差異。讀完要能交出一份可重現的紀錄：原請求、修改後請求、兩份回應，以及它們代表什麼。

工作台像大樓櫃檯：你先看懂自己送了什麼單子，再試著改單子的內容。本篇只在自己電腦上練習；真實計畫是否允許某種測試，要回到第 1 篇的 scope 與規則確認。

## 建立可重複的本機基準

把下列程式存為 `shop.mjs`，執行 `node shop.mjs`。它只有登入、商品搜尋與訂單讀取三個功能。搜尋回傳 JSON，訂單會檢查擁有者，所以這是一個觀察 HTTP 與授權的基準，不是一個已經包含 XSS 或 IDOR 的靶場。

```js
// shop.mjs — local HTTP and authorization practice, not a production service
import http from "node:http";
import { randomBytes } from "node:crypto";

const users = { alice: "alice-pass", bob: "bob-pass" };
const sessions = {};
const orders = {
  1532: { owner: "alice", item: "Coffee Beans", address: "Taipei" },
  1533: { owner: "bob", item: "Filter", address: "Taichung" },
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", ...headers });
  res.end(JSON.stringify(body));
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  const sid = (req.headers.cookie ?? "").match(/session=(\w+)/)?.[1];
  const me = sessions[sid];

  if (req.method === "POST" && url.pathname === "/login") {
    let raw = ""; for await (const c of req) raw += c;
    let credentials;
    try { credentials = JSON.parse(raw); } catch { return send(res, 400, { error: "invalid JSON" }); }
    const { user, pass } = credentials ?? {};
    if (typeof user !== "string" || typeof pass !== "string" || !Object.hasOwn(users, user) || users[user] !== pass) return send(res, 401, { error: "wrong password" });
    const id = randomBytes(16).toString("hex");
    sessions[id] = user;
    return send(res, 200, { ok: true }, { "set-cookie": `session=${id}; HttpOnly; Path=/` });
  }
  if (url.pathname === "/api/search") {
    const q = url.searchParams.get("q") ?? "";
    const limit = Number(url.searchParams.get("limit") ?? 2);
    return send(res, 200, ["Coffee beans","Filter","Pour over kettle","Grinder"]
      .filter(p => p.toLowerCase().includes(q.toLowerCase())).slice(0, limit));
  }
  if (url.pathname.startsWith("/api/orders/")) {
    if (!me) return send(res, 401, { error: "not logged in" });
    const order = orders[url.pathname.split("/")[3]];
    if (!order) return send(res, 404, { error: "no such order" });
    if (order.owner !== me) return send(res, 403, { error: "not your order" });
    return send(res, 200, order);
  }
  send(res, 404, { error: "not found" });
}).listen(8000, "127.0.0.1", () => console.log("shop on http://127.0.0.1:8000"));
```

程式只監聽 `127.0.0.1:8000`。這讓練習目標留在本機，但不代表程式適合上線：它沒有完整的輸入大小限制、持久儲存或正式帳號保護。結束時按 Ctrl+C，登入狀態也會消失。

## 先用 curl 留下對照組

另開終端機執行下列指令。cookie jar 使用 `/tmp/qpq-shop.cookies`，方便後面的請求帶回同一個 session。

```sh
curl -i 'http://127.0.0.1:8000/api/search?q=coffee'
curl -i 'http://127.0.0.1:8000/api/orders/1532'
curl -i -c /tmp/qpq-shop.cookies -H 'Content-Type: application/json' \
  --data '{"user":"alice","pass":"alice-pass"}' \
  'http://127.0.0.1:8000/login'
curl -i -b /tmp/qpq-shop.cookies 'http://127.0.0.1:8000/api/orders/1532'
curl -i -b /tmp/qpq-shop.cookies 'http://127.0.0.1:8000/api/orders/1533'
curl -i -b /tmp/qpq-shop.cookies 'http://127.0.0.1:8000/api/orders/9999'
```

依序應看到：搜尋成功並含有 `Coffee beans`、未登入讀訂單回 401、登入成功、Alice 讀自己的訂單回 200、讀 Bob 的訂單回 403、不存在的訂單回 404。自己的訂單內有 `Coffee Beans` 與 `Taipei`。

這些是這支範例程式的約定。換一個網站，403 不一定能證明已登入，200 也不一定代表拿到別人的資料。判斷時要一起看身分、回應內容與預期權限。

## 用 DevTools 抓瀏覽器真的送出的請求

打開 Chrome 的 Network 面板，再瀏覽商品搜尋網址。選取該請求，查看 Headers 與 Response，然後選 Copy as cURL。把指令貼到終端機重跑，先確認沒有改任何欄位時，仍可得到相同結果。

接著只把 `q=coffee` 改成 `q=filter`。預期從咖啡豆變成濾紙，狀態都可能是 200。這一步練的是控制變因，不是看見輸入有反應就宣稱發現漏洞。複製真實登入請求時會連 cookie 一起帶走，報告或分享範例前要移除憑證。

## 用 Burp Repeater 改一個欄位

在 Burp 開啟內建瀏覽器，先打開本機搜尋網址。Proxy 的 HTTP history 能看到已經送出的請求；若開著 Intercept，先 Forward，避免請求一直卡住。對目標請求選 Send to Repeater，再修改參數並按 Send。

要觀察訂單授權，在該本機頁面的 DevTools Console 執行下面的登入請求；這個範例沒有登入表單。也可以將 curl 的完整登入後請求與 cookie 匯入 Repeater。

```js
await fetch("/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ user: "alice", pass: "alice-pass" }),
});
```

保持同一個 session，把訂單編號從 1532 改成 1533。預期是 403。換成 Bob 的 session 後讀 1533，則應成功；這才是身分與資源擁有者的對照。

## 從觀察到漏洞證據，還差哪一步

如果一個有問題的服務讓 Alice 讀到 Bob 的私密訂單內容，才有越權讀取的證據。HTTP 200、訂單編號存在或錯誤訊息不同，單獨看都不足以證明同一件事。

搜尋端點回傳 JSON 商品清單，不會把查詢字串當 HTML 執行。即使你送入 `<script>`，也不能憑回傳狀態碼宣稱 XSS。下一章會使用真正的瀏覽器執行情境與官方練習題，分清楚資料反射與腳本執行。

一份練習紀錄至少保留測試帳號、目標路徑、唯一改動欄位、預期結果、實際回應與結論。能讓另一個人照著做出相同結果，比工具截圖的數量更有用。報告品質會影響分流，但不能拿某家獎金表的倍率替每個案例保證價碼。

## 自我檢查

1. 沒登入與登入 Alice 時，讀 1532 的回應有何差別？
2. Alice 讀 1533 回 403，證明什麼？還沒證明什麼？
3. 為什麼搜尋回 200、甚至出現 `<script>` 字樣，都不等於 XSS？
4. 只改一個參數時，你如何排除 session 已過期的影響？

## 更新紀錄

- 2026-10-15：補可重跑的登入與授權對照，修正 JSON 搜尋與 XSS 的界線，移除固定獎金保證。

## 參考資料

- [Chrome DevTools: Network reference](https://developer.chrome.com/docs/devtools/network/reference/)
- [Burp Suite: Repeater](https://portswigger.net/burp/documentation/desktop/tools/repeater)
- [PortSwigger: Access control](https://portswigger.net/web-security/access-control)
- [PortSwigger: Cross-site scripting](https://portswigger.net/web-security/cross-site-scripting)
- [Node.js HTTP module](https://nodejs.org/api/http.html)
