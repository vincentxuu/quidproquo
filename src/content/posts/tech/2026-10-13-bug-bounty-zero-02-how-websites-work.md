---
title: "網站怎麼運作：URL、HTTP 請求與回應、Cookie 與 curl 實測"
date: 2026-10-13
category: tech
type: guide
tags:
  - bug-bounty
  - security
  - web-security
  - http
  - cookie
  - devtools
lang: zh-TW
description: "給沒有資安背景的人：按下一個連結之後，瀏覽器與伺服器之間交換了什麼。拆開 URL、HTTP 請求與回應、狀態碼、Cookie 與同源規則，並用 curl 與瀏覽器開發者工具看自己的請求。"
tldr: "按下連結，瀏覽器會用 URL 組出一份 HTTP 請求，伺服器回一份帶狀態碼的回應；Cookie 是伺服器發的「入場手環」，讓無記憶的 HTTP 認得你。讀完能在開發者工具的 Network 面板找到一個請求，指出 URL、方法與 Cookie 各在哪一段。範例只打自己本機。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 2
---

> 🌏 [English version](/posts/tech/2026-10-13-bug-bounty-zero-02-how-websites-work-en)

你在瀏覽器按下一個連結，背後到底發生了什麼？這篇把答案拆成五樣東西：URL、HTTP 請求、HTTP 回應、Cookie、同源規則。讀完你能在自己的瀏覽器開發者工具裡找到一個請求，指出哪一段是 URL、哪一段是方法、哪一段是 Cookie。

這是「從零開始的資安獵人」系列的第 2 篇。[第 0 篇](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check)查證了幾個頂級獎金的數字，[第 1 篇](/posts/tech/2026-10-13-bug-bounty-zero-01-rules-and-scope)講規則與測試範圍。下一篇要講的 XSS、IDOR 這類常見網站漏洞，全都建立在這篇的概念上，先把地基看懂，後面才不會只是背名詞。

這篇只講基礎，不涉及任何攻擊手法，也不談 HTTP/2、HTTP/3 的細節。先備知識是會用瀏覽器，不需要會寫程式。

## 先看全貌：一次點擊的時間線

我們照時間順序走一遍，這就是全文的主脊：

| 步驟 | 發生什麼 | 本文哪一節 |
|---|---|---|
| 1 | 你按下連結，瀏覽器拿到一個 URL | URL |
| 2 | 瀏覽器組出一份 HTTP 請求，送給伺服器 | 請求 |
| 3 | 伺服器處理，回一份 HTTP 回應 | 回應與狀態碼 |
| 4 | 回應裡的 Cookie 被瀏覽器收下，下次一起帶上 | Cookie |
| 5 | 頁面載入後，瀏覽器限制不同來源的程式互相讀取 | 同源規則 |

依 [MDN 對 HTTP 的概述](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)，請求一律由瀏覽器發起，不是伺服器（後來雖有一些機制能模擬伺服器主動推送，本文先不談）。瀏覽器先要一份 HTML，解析後再為 CSS、JavaScript、圖片各發一次請求，最後拼成你看到的頁面。所以一次「開網頁」通常是很多個請求，不是一個。

## URL：地址的四段

先看 URL（網址）。以本文後面會用的 `http://127.0.0.1:8000/me?lang=zh` 為例，依 [MDN 的 URL 說明](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL)拆開：

| 片段 | 範例 | 白話 |
|---|---|---|
| 協定（scheme） | `http` | 用哪種方式溝通，網站通常是 HTTPS 或 HTTP |
| 網域與埠（authority） | `127.0.0.1:8000` | 找哪一台伺服器、哪一個「門」；省略埠時，HTTP 用 80、HTTPS 用 443 |
| 路徑（path） | `/me` | 要這台伺服器上的哪個資源 |
| 查詢參數（query） | `?lang=zh` | 附帶給伺服器的 `key=value` 小紙條 |

MDN 用寄信比喻：協定是郵政服務，網域是城市，埠是郵遞區號，路徑是大樓，參數是大樓裡的房號。另外還有 `#` 後面的片段（fragment），它只留在瀏覽器，**不會送到伺服器**，這點在下一篇有用。

## 請求與回應：兩張結構一樣的便條

HTTP 訊息可以直接用人眼讀。依 [MDN 的 HTTP 訊息說明](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages)，請求與回應都由四塊組成：一行起始行、一組 header、一個空行、一個可有可無的 body。

一份請求的第一行叫 request-line，格式是 `<方法> <目標> <協定版本>`，例如 `GET /me HTTP/1.1`。方法說明你想做什麼：[GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods) 是「把資源給我」，POST 是「我要送資料給你」。header 是附在訊息上的中繼資料，像 `Host`（找哪個網站）、`Cookie`（等一下講）。body 只有 POST、PUT、PATCH 這類請求會有，例如你送出表單時的欄位內容。

回應的第一行叫 status line，格式是 `<協定版本> <狀態碼> <原因>`，例如 `HTTP/1.1 404 Not Found`，後面接回應 header 和 body（網頁內容本身）。

## 狀態碼：伺服器的第一句話

狀態碼是三位數，看開頭那一位就能大致分類，[MDN 的狀態碼總表](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)分成五類（資訊、成功、轉址、用戶端錯誤、伺服器錯誤）。入門先記住三個：

- **200 OK**：請求成功。
- **404 Not Found**：[伺服器找不到你要的資源](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/404)。
- **401 與 403 容易搞混**：[401 Unauthorized](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/401) 是請求缺少有效的身分驗證資料，意思是「你是誰？先證明」。[403 Forbidden](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/403) 是伺服器看懂了請求但拒絕處理，換個身分重新登入也不會改變結果。最常見的情況是「你已經登入了，但沒有權限做這件事」。

這組差異之後會反覆出現：判斷一個網站有沒有把「誰能看什麼」管好，常常就是在看它該回 403 的時候回了什麼。

## Cookie 與 session：入場手環

HTTP 本身沒有記憶。[MDN 寫得很直接](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)：HTTP 是 stateless，同一條連線上前後兩個請求之間沒有任何關聯。那網站怎麼知道你剛登入過？靠 Cookie。

把網站想成一個有入場管制的園區。你在門口出示證件（帳號密碼），櫃台確認後**發給你一條手環**。之後你每走到一個園區的攤位，都亮出手環，攤位不用再查證件，看手環就知道你是誰。對照到 HTTP：

1. 你送出帳號密碼。
2. 伺服器驗證通過，在回應裡放一個 [Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie) header，內容通常是一個 session ID（手環上的編號）。
3. 瀏覽器收下，之後對同一個網站的每個請求，都在 `Cookie` header 裡帶上它。
4. 伺服器用編號查出「這條手環屬於 alice」，回傳她的頁面；編號無效就回登入頁或錯誤。

這四步是 [MDN 的 Cookie 指南](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)描述的登入流程。session 指的就是伺服器這一側記著「這個編號是誰」的那份狀態。

手環要有用，編號必須沒人猜得到。MDN 提醒，Cookie 的值預設使用者看得到也改得到，所以建議放一個不透明、由伺服器查詢的識別碼，而不是把敏感資訊直接寫在裡面。有些 Cookie 會帶 `HttpOnly`（網頁上的 JavaScript 讀不到，只在請求時自動送出），這是對 XSS 的緩解措施，詳細留到下一篇。

## 同源規則：瀏覽器的直覺版

最後一個概念。你同時開著銀行網站和一個陌生網站，為什麼陌生網站的程式讀不到銀行頁面的內容？因為瀏覽器有 [same-origin policy（同源政策）](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy)。

「源」（origin）由協定、網域、埠三者組成，三個都一樣才算同源。MDN 的例子，以 `http://store.company.com/dir/page.html` 為基準：

| 另一個網址 | 是否同源 | 原因 |
|---|---|---|
| `http://store.company.com/dir2/other.html` | 同源 | 只有路徑不同 |
| `https://store.company.com/page.html` | 不同源 | 協定不同 |
| `http://store.company.com:81/dir/page.html` | 不同源 | 埠不同 |
| `http://news.company.com/dir/page.html` | 不同源 | 網域不同 |

直覺版口訣：不同源之間，**可以寄信、可以嵌入，但通常不能讀對方的內容**。MDN 的分類是：跨源的寫入（連結、轉址、表單送出）通常允許，跨源的嵌入（圖片、script、iframe）通常允許，跨源的讀取通常禁止。同源政策是瀏覽器的安全機制（[PortSwigger](https://portswigger.net/web-security/cors/same-origin-policy)），所以用 curl 這類不是瀏覽器的工具發請求，不受它限制；但 curl 送出的也只是你自己的請求，不會帶上別人的 Cookie。細節（CORS 怎麼放行）留到之後再談。

## 實測：用 curl 看一次完整的請求與回應

下面的實驗只打自己電腦。我在沙盒裡的 curl 連不到 example.com（名稱解析失敗），所以改用 Python 內建的 `http.server` 寫了一個極小的本機伺服器：`/login` 會發 Cookie，`/me` 要有 Cookie 才認得人，其他路徑回 404。以下輸出是 2026-10-13 在沙盒裡實際執行的結果（curl 8.5.0、Python 3.13），我只刪掉了 curl 的進度條。

伺服器程式（存成 `server.py`，用 `python3 server.py` 啟動，只聽 127.0.0.1:8000）：

```python
from http.server import BaseHTTPRequestHandler, HTTPServer

class H(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith("/login"):
            body = b"welcome\n"
            self.send_response(200)
            self.send_header("Set-Cookie", "session=abc123; HttpOnly; Path=/")
        elif self.path.startswith("/me"):
            if "session=abc123" in self.headers.get("Cookie", ""):
                body = b"hello, alice\n"
                self.send_response(200)
            else:
                body = b"please log in\n"
                self.send_response(401)
        else:
            body = b"not here\n"
            self.send_response(404)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

HTTPServer(("127.0.0.1", 8000), H).serve_forever()
```

第一步，不帶任何 Cookie 去要 `/me`（`-i` 讓 curl 把回應 header 也印出來）：

```bash
curl -i "http://127.0.0.1:8000/me?lang=zh"
```

```http
HTTP/1.0 401 Unauthorized
Server: BaseHTTP/0.6 Python/3.13.16
Date: Tue, 13 Oct 2026 14:29:25 GMT
Content-Type: text/plain; charset=utf-8
Content-Length: 14

please log in
```

第二步，去 `/login`，看伺服器發的手環：

```bash
curl -i http://127.0.0.1:8000/login
```

```http
HTTP/1.0 200 OK
Server: BaseHTTP/0.6 Python/3.13.16
Date: Tue, 13 Oct 2026 14:29:25 GMT
Set-Cookie: session=abc123; HttpOnly; Path=/
Content-Type: text/plain; charset=utf-8
Content-Length: 8

welcome
```

第三步，亮出手環再要一次 `/me`：

```bash
curl -i -H "Cookie: session=abc123" http://127.0.0.1:8000/me
```

```http
HTTP/1.0 200 OK
Server: BaseHTTP/0.6 Python/3.13.16
Date: Tue, 13 Oct 2026 14:29:25 GMT
Content-Type: text/plain; charset=utf-8
Content-Length: 13

hello, alice
```

同一個網址 `/me`，有沒有 `Cookie` header，答案就從 401 變成 200。這就是 session 的全部原理。另外要一個不存在的路徑，會得到 `HTTP/1.0 404 Not Found`，body 是 `not here`。

想看**請求**長什麼樣，加 `-v`，以 `>` 開頭的行是 curl 送出的請求（輸出中 `*` 開頭的是 curl 自己的連線訊息，這裡略過）：

```bash
curl -v http://127.0.0.1:8000/me
```

```text
> GET /me HTTP/1.1
> Host: 127.0.0.1:8000
> User-Agent: curl/8.5.0
> Accept: */*
>
< HTTP/1.0 401 Unauthorized
```

對照前面的結構：`GET /me HTTP/1.1` 是 request-line（方法、目標、版本），下面三行是 header，空行代表 header 結束。順帶一提，這個玩具伺服器回的是 `HTTP/1.0`，是 Python 這個模組的預設，真實網站多半回 HTTP/1.1 或更新的版本，不影響你讀懂結構。它的 401 也省略了 MDN 說 401 應附帶的 `WWW-Authenticate` header，這是為了讓範例精簡，不是 401 的標準寫法。

最後，不想手動複製 Cookie，可以讓 curl 自己存手環：

```bash
curl -s -c jar.txt http://127.0.0.1:8000/login > /dev/null
curl -s -b jar.txt http://127.0.0.1:8000/me
# hello, alice
```

`-c` 把伺服器發的 Cookie 存進檔案，`-b` 從檔案讀出來帶上。瀏覽器做的就是這件事，只是全自動。

## 今晚能做的事：在開發者工具找到自己的請求

照這幾步，用任何你有帳號的網站（甚至剛才的本機伺服器）都行：

1. 開一個分頁，按 `Control+Shift+J`（Mac 是 `Command+Option+J`）打開 Chrome DevTools，切到 **Network** 分頁。依[Chrome 官方教學](https://developer.chrome.com/docs/devtools/network)，DevTools 只記錄它開著之後發生的請求，所以現在是空的，**重新整理頁面**才會出現紀錄。
2. 在表格標題列按右鍵，勾選 **Method**、**URL**、**Cookies** 欄位（依[Network 功能參考](https://developer.chrome.com/docs/devtools/network/reference)，這些是可加的欄位）。現在每一列就直接寫著方法、完整 URL，以及這個請求帶了幾個 Cookie。
3. 點最上面那一列（通常是主 HTML 文件）。在 **Headers** 分頁會看到 General（含網址與狀態碼）、Response Headers、Request Headers 三塊；開 **Cookies** 分頁可看這個請求帶出去的 Cookie。如果頁面有表單或查詢參數，**Payload** 分頁會列出來。
4. 對照自己寫下三件事：URL 的四段各是什麼、方法是 GET 還是 POST、Cookie 的名稱是什麼。能寫出來，這篇的目標就達成了。

Firefox 也有同樣的 Network 面板，欄位名稱略有不同，本文只實際核對了 Chrome 的文件。

## 限制

這篇刻意簡化了幾件事。HTTP/2 起，訊息會被包進 frame，不再能直接用人眼讀，這篇不展開。Cookie 還有 `SameSite`、`Domain`、`Path`、過期時間等屬性，本文只提了 `HttpOnly`，其餘留待討論具體漏洞時再補。同源政策也只講了直覺版，沒有談 CORS。另外，用 curl 練習時請只打自己的本機或你有權限的目標，第 1 篇講的範圍與規則在這裡同樣適用。

## 整體來說

按下連結之後，瀏覽器依 URL 組出請求、伺服器回應並附上狀態碼，Cookie 讓無記憶的 HTTP 認得你，同源規則限制不同來源的程式互相讀取。這五樣東西，每一樣都是漏洞獵人日後的觀察點：URL 裡的參數會被伺服器怎麼用、該回 403 的時候回了什麼、手環的編號能不能被猜到。

這也是為什麼要先學這些。第 0 篇查證的是少數頂級價碼，而入門者實際遇到的多是網站層的常見漏洞，下一篇[常見網站漏洞](/posts/tech/2026-10-13-bug-bounty-zero-03-common-web-bugs)會用這篇的語言，講 XSS 與 IDOR 各是出了什麼事。

## 參考資料

- [Overview of HTTP（MDN）](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)
- [What is a URL?（MDN）](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL)
- [HTTP messages（MDN）](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages)
- [HTTP request methods（MDN）](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)
- [HTTP response status codes（MDN）](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
- [401 Unauthorized（MDN）](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/401)
- [403 Forbidden（MDN）](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/403)
- [404 Not Found（MDN）](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/404)
- [Using HTTP cookies（MDN）](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)
- [Set-Cookie header（MDN）](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)
- [Same-origin policy（MDN）](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy)
- [Same-origin policy（PortSwigger Web Security Academy）](https://portswigger.net/web-security/cors/same-origin-policy)
- [Inspect network activity（Chrome for Developers）](https://developer.chrome.com/docs/devtools/network)
- [Network features reference（Chrome for Developers）](https://developer.chrome.com/docs/devtools/network/reference)
- 站內：[Bug Bounty 頂級獎金查證（第 0 篇）](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check)、[規則與測試範圍（第 1 篇）](/posts/tech/2026-10-13-bug-bounty-zero-01-rules-and-scope)、[常見網站漏洞（第 3 篇）](/posts/tech/2026-10-13-bug-bounty-zero-03-common-web-bugs)
