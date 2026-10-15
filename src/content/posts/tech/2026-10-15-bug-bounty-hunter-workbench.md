---
title: "工作台: 使用 Chrome DevTools & Burp Suite Community 的實戰工具"
date: 2026-10-15
category: tech
type: guide
difficulty: 入門
tags: [bug-bounty, security, web-security, burp-suite, chrome-devtools, local-practice]
lang: zh-TW
description: "系列 3：教你建立完整的漏洞測試實驗環境，攔截請求、修改參數、觀察回應。"
tldr: "使用 Chrome DevTools Copy as cURL 與 Burp Suite Proxy/Repeater，測試本地伺服器上的漏洞。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 3
---

> 🌏 [English version](/posts/tech/2026-10-15-bug-bounty-hunter-workbench-en)

## TL;DR

**工作台是從理論到實驗的橋梁。** 你需要：Chrome DevTools（Copy as cURL）、Burp Suite Community（Proxy、Repeater）、本地測試伺服器（shop.mjs 127.0.0.1:8000）。掌握這三種工具後，你能重現漏洞、記錄回應、建立可重複的報告步驟。

---

## 情境

你剛註冊了漏洞獵人計畫，規則寫「僅限本地測試」。你沒有工具、沒有實驗環境，報告只寫「發現 XSS」，沒有重現步驟。Google VRP 會直接打 0.8x（$101,010 → $80,808）。

---

## 問題

**錯誤 1：沒有攔截工具，無法重複請求或觀察回應差異。**
**錯誤 2：沒有本地伺服器，測試真實目標可能違反規則，報告被拒絕。**
**錯誤 3：報告缺少 PoC（Proof of Concept），無法證明漏洞可重現。**

---

## 解決方案：三種工具

### 工具 1：Chrome DevTools — Copy as cURL

1. Chrome → F12 → Network
2. 訪問 `http://127.0.0.1:8000/api/search?q=coffee`
3. 右鍵 → Copy as cURL → 貼到終端機

**得到什麼**：完整 HTTP 方法、URL、標頭；可存成 `.sh` 重複執行，測試重現性。

### 工具 2：Burp Suite Community — Proxy & Repeater

1. 下載 Burp Suite Community（免費）
2. 啟動 Proxy → Intercept 開啟 → Repeater
3. 瀏覽 `http://127.0.0.1:8000/api/search?q=tea`
4. Burp 捕獲 → 右鍵 Send to Repeater → 修改 `q` 參數 → Send

**得到什麼**：暫停任意請求、修改參數、觀察狀態碼變化（200 vs 403 vs 404），測試權限驗證。

### 工具 3：本地測試伺服器 `shop.mjs`

```js
// shop.mjs — 只綁定在 127.0.0.1，外部無法存取
import http from "node:http";

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
    const { user, pass } = JSON.parse(raw);
    if (users[user] !== pass) return send(res, 401, { error: "wrong password" });
    const id = Math.random().toString(36).slice(2, 10);
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

**漏洞模拟**：
- `/api/orders/1532`（alice 的訂單），若直接改為 `1533`（bob 的訂單），正常應回 403，若回 200 → IDOR
- `/api/search?q=<script>alert(1)</script>`，若回應包含未轉義的 `<script>` → XSS

---

## 為什麼會這樣：報告品質的關鍵

Google VRP 最高獎金 $121,212（T0 S0 RCE + 1.2x）需要：
- 完整重現步驟（可用 curl / Burp Repeater 直接複製）
- 具體影響（洩漏多少資料、哪些 PII、金額估算）
- CVSS 3.1 評分與理由
- 修補建議

沒有這些，報告只值 $80,808（0.8x）。工作台的目的就是讓你能**生成這些證據**。

---

## 自我檢查（這篇重點：工具已掌握？）

- [ ] 你已成功攔截 `127.0.0.1:8000` 的請求（DevTools 或 Burp）
- [ ] 你能用 `curl` 重複執行同一個請求，觀察相同回應
- [ ] 你能修改 `q=` 或 `id=` 參數，觀察狀態碼變化（200 → 403 → 404）
- [ ] 你能用 Burp Repeater 測試 IDOR（`1532` → `1533`）
- [ ] 你知道為什麼「本地測試」是安全的：只綁定在 127.0.0.1

---

## 參考資料

- [PortSwigger — Burp Suite Documentation](https://portswigger.net/burp/documentation)
- [Chrome DevTools — Network requests](https://developer.chrome.com/docs/devtools/network/reference/)
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)
- [Node.js http module](https://nodejs.org/api/http.html)

---

*這篇是系列 3（工作台），前面：規則（1）、網站原理（2）；後面：XSS/IDOR（4）、RCE（5）、報告與分類（6）。*