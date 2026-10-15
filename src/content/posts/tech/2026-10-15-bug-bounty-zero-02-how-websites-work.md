---
title: "按下連結後，瀏覽器和伺服器交換了什麼？"
date: 2026-10-15
category: tech
type: guide
difficulty: 入門
tags: [bug-bounty, security, web, http, cookies, session, curl]
lang: zh-TW
description: "從零開始的資安獵人系列第 2 篇：用本地練習伺服器搭配 DevTools 與 curl，說明 URL 結構、HTTP 請求與回應、狀態碼、Cookie 與 Session，以及為什麼這直接決定你能不能在第 3 篇的工作台抓到漏洞。"
tldr: "按下連結後，瀏覽器組合出一個 HTTP 請求（方法、URL、Headers、Cookie），伺服器回應（狀態碼、內容、Set-Cookie）。Cookie 是伺服器認你身份的機制，沒有它你看不到訂單；有了它，IDOR 就可能發生在「換 ID 但沒換 Cookie」的情境。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 2
---

> 🌏 [English version](/posts/tech/2026-10-15-bug-bounty-zero-02-how-websites-work-en)

這是系列第 2 篇。第一篇教你選計畫、讀範圍；這篇回答：按下連結後，**實際上發生了什麼**？你不需要先學網路協定，只需要懂「瀏覽器送了什麼、伺服器回了什麼、Cookie 扮演什麼角色」——這三件事，是第 3 篇（工作台）能不能抓到漏洞的前提。

## 一個連結的完整生命週期

你在瀏覽器輸入 `http://example.com/search?q=coffee`，然後按 Enter。接下來發生的，不是「網站開了出來」，而是：

1. 瀏覽器解析 URL，分成「協定」「主機」「路徑」「參數」
2. 瀏覽器組合一個 HTTP 請求（Request），包括：方法（GET）、完整 URL、Headers（Cookie、User-Agent、Accept）
3. 瀏覽器透過 TCP 連線把請求送到伺服器
4. 伺服器解析請求，查資料庫或執行邏輯
5. 伺服器組合一個 HTTP 回應（Response），包括：狀態碼（200/404/403）、Headers（Content-Type、Set-Cookie）、內容（HTML/JSON）
6. 瀏覽器收到回應，解析內容，畫出畫面；如果回應帶 `Set-Cookie`，瀏覽器存起來，後續請求都帶上

這篇只講你能看到的部分，不講 TLS 握手或 HTTP/2 細節（那些在第 7–8 篇才用到）。

## URL 如何被拆成四段

以 `http://example.com/api/orders/1532?q=coffee` 為例：

| 部分 | 內容 | 意義 |
|---|---|---|
| 協定（Scheme） | `http` | 要用哪種語言說話（這裡用 HTTP/1.1） |
| 主機（Host） | `example.com` | 要打給哪台電腦（DNS 解析成 IP） |
| 路徑（Path） | `/api/orders/1532` | 伺服器要處理的「功能」和「資源 ID」 |
| 查詢參數（Query） | `q=coffee` | 額外的輸入，伺服器可能用來搜尋 |

漏洞常藏在「路徑」和「參數」裡：
- 路徑：`/api/orders/1532` → 改成 `1533`，看有沒有 IDOR（第 4 篇）
- 參數：`q=coffee` → 改成 `q=<script>...`，看有沒有 XSS（第 4 篇）
- 參數：`id=1532` → 改成別的值，配合 Cookie 看是否可跨帳號（第 4 篇 IDOR 實戰）

## 狀態碼：伺服器在說什麼？

| 狀態碼 | 意思 | 漏洞相關 |
|---|---|---|
| 200 OK | 成功，內容在回應 | 正常，但內容可能有洞 |
| 301/302 | 重新導向 | 有時用來繞過驗證 |
| 400 Bad Request | 參數錯誤 | 可能透露「你傳了什麼」，有資訊洩露風險 |
| 401 Unauthorized | 沒登入 | 你沒帶 Cookie，或 Cookie 過期 |
| 403 Forbidden | 知道你是誰，但不讓你進 | 你帶了 Cookie，但權限不夠（可能是 IDOR 的「有驗證但沒驗所有權」） |
| 404 Not Found | 找不到這個資源 | 但如果「別人的 ID」回 404 而「你的 ID」回 200，這本身就是資訊泄露（存在 vs 不存在） |
| 500 Internal Server Error | 伺服器掛了 | 可能是輸入導致的錯誤，可能是 RCE 前兆（第 5 篇） |

**實戰提示**：在 Burp Repeater（第 3 篇）改參數後，先看狀態碼，再看內容長度（Size）。同樣的功能，不同參數，狀態碼或大小不同，通常意味着「伺服器在做不同的事」——這就是漏洞的線索。

## Cookie 與 Session：伺服器如何「認你」？

Cookie 是伺服器在你第一次登入後，給你的「身份證」。後續每個請求，瀏覽器自動帶上。沒有它，伺服器不知道你是誰；有了它，伺服器可以查「這個 ID 屬於誰」。

這直接決定 IDOR：
- 如果伺服器只看 URL（`/orders/1532`），沒看 Cookie → 任何人改 ID 都能看（漏洞）
- 如果伺服器看 Cookie 但沒檢查「這筆訂單的 owner 是不是這個 Cookie 的使用者」→ 你可以用自己的 Cookie 看別人的訂單（漏洞）
- 如果伺服器檢查「Cookie 的使用者 == 訂單的 owner」→ 安全

### 本地練習：用 curl 測試 Cookie 行為

我們用第 3 篇建立的本地伺服器（`shop.mjs`，綁在 `127.0.0.1:8000`）：

```bash
# 1. 登入，取得 session cookie（存到 jar.txt）
curl -s -c jar.txt -H 'content-type: application/json' \
  -d '{"user":"alice","pass":"alice-pass"}' \
  http://127.0.0.1:8000/login

# 2. 用 cookie 查詢自己的訂單（200，內容完整）
curl -s -b jar.txt http://127.0.0.1:8000/api/orders/1532
# → {"owner":"alice","item":"咖啡豆","address":"台北市（alice 的地址）"}

# 3. 不帶 cookie 查詢（401，沒有登入）
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8000/api/orders/1532
# → 401

# 4. 用別人的 cookie（如果你有 bob 的 cookie）查別人的訂單（403，不是你的）
# 這就是「有驗證、有權限檢查」的正確行為
```

**關鍵洞察**：第 3 步的 `401` 和第 4 步的 `403` 從「安全」角度看都算「有防護」，但第 4 步的 `403` 也透露「這個訂單存在」（因為是 403 而不是 404）。在進階測試中，這種「存在/不存在」的差異，自己就是資訊洩露的線索（第 4 篇 IDOR 中提到）。

## 同源（Same-Origin）直覺版：為什麼 XSS 能偷 Cookie？

瀏覽器的「同源」規則簡單說：如果一個網頁來自 `https://example.com`，它的腳本不能讀取 `https://other.com` 的 Cookie。但反過來：**如果腳本本來就從 `example.com` 自己跑出來**，它就可以讀這個網域的所有 Cookie、做任何 HTTP 請求（只要帶上 Cookie）。

所以 XSS（第 4 篇）的危險性不是「跑了腳本」，而是「這個腳本來自信任的網站，所以能帶著使用者的憑證去做事」。這就是為什麼 `HttpOnly` Cookie 很重要：它告訴瀏覽器「這個 Cookie 不給 JavaScript 讀」，但如果 XSS 能做其他事（比如假冒使用者送 HTTP 請求），還是有風險。

## 實際操作：用 DevTools 看你自己的請求

1. 打開任何網站（例如你自己的練習伺服器），按 F12，切到 Network
2. 勾選 Preserve log（保留記錄），點擊搜尋或登入
3. 找到你剛送出的請求（旁邊有方法、URL、狀態碼）
4. 右鍵 → Copy as cURL：你得到完整的 curl 指令，包含 Cookie、Headers
5. 複製到終端機，改一個參數（例如 `q=coffee` 改 `q=tea`），再跑一次，觀察回應差異

這是第 3 篇工作台的「Copy as cURL」延伸：你現在不只是「看」請求，而是「懂它的每一部分」為什麼會回 200 或 404。

## 從這篇到第 3 篇的銜接

第 2 篇結束，你應該能：
- 看到一個 URL，指出哪是路徑、哪是參數
- 看到一個 HTTP 回應，指出狀態碼和內容
- 了解 Cookie 為什麼讓「同一個 URL」在不同帳號下有不同結果
- 用 curl 重發一個請求，並改變一個參數觀察差異

下一步（第 3 篇）：把這些能力用工具（DevTools、Burp Proxy、Repeater）自動化，並開始「盤點功能、改參數、記錄回應」的實戰流程。

## 參考資料
- [MDN — HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
- [MDN — Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [PortSwigger — Web Security Academy（HTTP 基礎）](https://portswigger.net/web-security)
- [OWASP — Session Management](https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication)
- [Google VRP Rules（對應的漏洞範圍與條件）](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
