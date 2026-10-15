---
title: "按下連結後，瀏覽器和伺服器交換了什麼？"
date: 2026-10-13
category: tech
type: guide
difficulty: 入門
tags: [bug-bounty, security, web, http, cookies, session, curl]
lang: zh-TW
description: "系列第 2 篇：用 DevTools 與本地 curl 練習理解 URL、HTTP 請求與回應、狀態碼、Cookie 和 Session。"
tldr: "瀏覽器送出方法、請求目標、標頭與適用的 Cookie；伺服器回傳狀態、標頭和內容。認出使用者只是身分驗證，每筆訂單仍須另外檢查存取權限。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 2
---

> 🌏 [English version](/posts/tech/2026-10-13-bug-bounty-zero-02-how-websites-work-en)

這是系列第 2 篇。第 1 篇教你選計畫、讀範圍；這篇回答：按下連結後，實際發生了什麼？看懂瀏覽器送什麼、伺服器回什麼，以及工作階段 Cookie 的角色，就能接著在第 3 篇檢查請求。

## 一個連結的完整生命週期

在瀏覽器輸入 `http://example.com/search?q=coffee`。從應用程式的角度看，接著會發生：

1. 瀏覽器把 URL 拆成協定、主機、路徑與查詢參數。
2. 組合 HTTP 請求，包含 GET 等方法、請求目標，以及 Accept、適用的 Cookie 等標頭。
3. 透過連線送到伺服器。底層傳輸取決於 HTTP 版本：HTTP/1.1、HTTP/2 使用 TCP，HTTP/3 則使用建立在 UDP 上的 QUIC。
4. 伺服器解析請求，執行應用程式邏輯，可能查詢資料庫。
5. 回傳 HTTP 回應，包含狀態碼、Content-Type 或 Set-Cookie 等標頭，以及 HTML、JSON 等內容。
6. 瀏覽器處理回應，可能呈現 HTML、執行腳本並繼續請求其他資源；接受 Cookie 後，會在後續符合範圍與瀏覽器政策的請求中帶上。

這篇聚焦在你能檢查的應用資料。完整網路流程還有 DNS、建立連線、HTTPS 使用的 TLS、快取等細節，先不深入也能完成本地練習。

## URL 如何拆成四段

以 `http://example.com/api/orders/1532?q=coffee` 為例：

| 部分 | 內容 | 意義 |
|---|---|---|
| 協定（Scheme） | `http` | 使用 HTTP；光看這個字串不能決定是 HTTP/1.1 |
| 主機（Host） | `example.com` | 目的主機，通常透過 DNS 解析 |
| 路徑（Path） | `/api/orders/1532` | 應用程式路由，這裡也包含物件識別碼 |
| 查詢參數（Query） | `q=coffee` | 應用程式可能使用的額外輸入 |

路徑和參數可以用來觀察行為：

- 把 `/api/orders/1532` 改成 `1533`，看伺服器是否檢查擁有權。
- 把 `q=coffee` 換成另一個搜尋詞，比較結果。
- 在授權的 XSS 練習環境，追查輸入最後進入 HTML 或會把字串解讀為程式碼的瀏覽器介面。

改 ID 或放入看似腳本的字串，都只是測試輸入，本身還不是漏洞證據。第 4 篇會接著說明。

## 狀態碼：伺服器在說什麼？

| 狀態碼 | 意思 | 接著觀察什麼 |
|---|---|---|
| 200 OK | 請求成功 | 內容是否只有這個帳號可存取的資料？ |
| 301／302 | 重新導向 | Location 指向哪裡，後續仍有檢查權限嗎？ |
| 400 Bad Request | 伺服器認為請求無效 | 錯誤訊息是否揭露敏感實作細節？ |
| 401 Unauthorized | 缺少有效的驗證憑證 | 工作階段是否缺漏、過期或無效？ |
| 403 Forbidden | 伺服器拒絕請求 | 哪個應用規則拒絕？不能只憑狀態碼認定已登入 |
| 404 Not Found | 資源不可取得，或伺服器不揭露它 | 可能刻意隱藏資源是否存在 |
| 500 Internal Server Error | 伺服器發生未預期錯誤 | 記錄相關輸入與回應；這不能證明 RCE |

在 Repeater 每次只改一個參數，比較狀態碼、內容與大小。差異是理解應用行為的線索，也可能完全符合預期；先確認帳號、資源與權限政策，再判斷有沒有漏洞。

擁有者拿到 `200`、其他帳號拿到 `404`，不會自動構成資訊洩漏。即使 `403` 與 `404` 透露存在差異，也要確認「是否存在」本身是敏感資訊，而且測試確實造成未授權揭露。

## Cookie 與 Session：伺服器如何認你？

Cookie 儲存一個值，瀏覽器可在符合條件的請求中帶上。工作階段 Cookie 常放一個識別碼，讓伺服器對應到登入的使用者；其他 Cookie 也可能只記偏好或狀態，並不一定是身分憑證。應用程式也能採用不依賴 Cookie 的驗證方式。

訂單 API 要分開看身分驗證與權限檢查：

- 沒登入、只改 URL 就能取得私人訂單，代表缺少存取控制。
- 認得登入狀態，卻沒檢查你可不可以讀這筆訂單，仍可能洩漏別人的資料。
- 每次請求都檢查適用的擁有權或角色政策，才能守住這個邊界。

知道你是誰，不能直接回答你能讀哪些物件。

### 本地練習：用 curl 測試 Cookie 行為

先啟動第 3 篇的 `shop.mjs`，監聽 `127.0.0.1:8000`。範例中，訂單 `1532` 屬於 Alice，`1533` 屬於 Bob。

```bash
# 1. 以 Alice 登入，儲存工作階段 Cookie。
curl -s -c jar.txt -H 'content-type: application/json' \
  -d '{"user":"alice","pass":"alice-pass"}' \
  http://127.0.0.1:8000/login

# 2. 帶 Alice 的 Cookie 讀自己的訂單。
curl -s -b jar.txt http://127.0.0.1:8000/api/orders/1532
# 預期內容：{"owner":"alice","item":"Coffee Beans","address":"Taipei"}

# 3. 不帶 Cookie 重送：範例回傳 401。
curl -s -o /dev/null -w "%{http_code}\n" \
  http://127.0.0.1:8000/api/orders/1532

# 4. 保持 Alice 的 Cookie，讀 Bob 的訂單：範例回傳 403。
curl -s -b jar.txt -o /dev/null -w "%{http_code}\n" \
  http://127.0.0.1:8000/api/orders/1533
```

這個應用程式用 `401` 表示沒有有效工作階段、`403` 表示登入者不是訂單擁有者。這個解讀來自範例程式，不能直接套在所有伺服器上。範例有擋住跨帳號讀訂單，沒有刻意留下 IDOR。

## 同源直覺版：為什麼 XSS 能以使用者身分操作？

來源（origin）由協定、主機與連接埠組成；瀏覽器限制腳本跨來源讀取資料。XSS 的危險在於，攻擊者控制的程式碼在有漏洞的應用程式脈絡中執行，可能利用受害者在該應用的權限。

Cookie 還有額外規則。JavaScript 無法透過 `document.cookie` 讀取 `HttpOnly` Cookie，其他 Cookie 能否讀到也受範圍限制。可是 `HttpOnly` 不會阻止注入的腳本發出允許的同源請求，瀏覽器仍可能替請求帶上工作階段 Cookie。因此它能減少 Cookie 被偷讀的風險，不能讓 XSS 變得無害。

在練習環境用無害的執行標記即可；證明 XSS 不需要偷 Cookie 或別人的資料。

## 實際操作：用 DevTools 看自己的請求

1. 開啟本地練習應用程式，再打開 DevTools → Network。
2. 勾選 Preserve log，執行搜尋或登入。
3. 找到請求，檢查方法、URL、請求標頭、回應狀態與內容。
4. 右鍵 → Copy as cURL，匯出終端機指令。登入請求可能包含憑證，請留在自己環境，分享前先遮蔽。
5. 在本地重送，只改一個參數，例如 `q=coffee` 改成 `q=tea`，比較回應。

你現在能把瀏覽器動作對回 HTTP 交換，而不只是看到最後顯示的畫面。

## 從這篇到第 3 篇

你應該能：

- 指出 URL 的路徑與查詢參數。
- 找到 HTTP 回應的狀態與內容。
- 解釋同一個 URL 為什麼在不同帳號下有不同結果。
- 用 curl 重送請求，每次只改一個參數。

下一步是把 DevTools、Burp Proxy 與 Repeater 串起來，建立盤點功能、修改輸入、記錄回應的流程。

## 更新紀錄

- 2026-10-15：補齊英文並同步兩語，修正 Cookie、狀態碼與本地練習，移除只靠回應差異判定漏洞的說法。

## 參考資料

- [MDN — HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
- [MDN — HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
- [MDN — Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)
- [MDN — Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
- [PortSwigger — Web Security Academy](https://portswigger.net/web-security)
- [OWASP — Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
