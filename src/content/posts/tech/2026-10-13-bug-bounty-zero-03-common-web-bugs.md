---
title: "網站最常見的兩種洞：XSS 與 IDOR，為什麼獎金差這麼多"
date: 2026-10-13
category: tech
type: guide
tags:
  - bug-bounty
  - security
  - web-security
  - xss
  - idor
  - owasp
lang: zh-TW
description: "用一段能在自己電腦跑的小程式，看懂 XSS（讓別人的瀏覽器執行不該執行的腳本）與 IDOR（把網址上的 id 換成別人的就能看到別人的資料），再對照 Google 獎金表，說明兩者各落在哪一格、為什麼價位不同。"
tldr: "XSS 是網站把使用者輸入原樣放進網頁，讓別人的瀏覽器把它當程式執行，修法是輸出時轉義。IDOR 是伺服器收到 id 就給資料，沒檢查這筆資料是不是你的，修法是伺服器端檢查擁有者。Google 獎金表把 XSS 放在「在受害者瀏覽器執行程式碼」（C0），一般 Google 應用基準 10,000 美元；IDOR 放在邏輯漏洞（S2），價位看洩漏的資料多敏感，同樣在一般 Google 應用上是 3,133.7 到 31,337 美元。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 4
---

> 🌏 [English version](/posts/tech/2026-10-13-bug-bounty-zero-03-common-web-bugs-en)

這是「從零開始的資安獵人」第 4 篇。[網站怎麼運作](/posts/tech/2026-10-13-bug-bounty-zero-02-how-websites-work)講了 HTTP、cookie 與 same-origin。這篇用那些基礎，看網站最常見的兩種洞：XSS 與 IDOR。第 13 篇[查證頂級獎金](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check)時用到的 [Google 獎金表](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)，這篇會回頭把這兩類洞對到具體的格子。

讀完你應該能做到一件事：看一段簡單的網頁程式碼，指出哪裡是 XSS、哪裡是 IDOR，並說出怎麼修。

[上一章的工作台](/posts/tech/2026-10-15-bug-bounty-hunter-workbench)介紹如何觀察與重送請求。這裡用同一套操作，分清楚瀏覽器執行了什麼，以及伺服器允許誰讀取資料。

## 先講比喻

**XSS** 像在社區公佈欄貼一張紙條。公佈欄不檢查內容，你貼的是「請大家翻到背面寫上自己的門鎖密碼」，路過的人就照做了。網站是公佈欄，瀏覽器是路過的人，紙條是一段腳本。

**IDOR** 像飯店櫃台只看房號、不看人。你說「我要 502 號房的帳單」，櫃台就遞給你，沒問你是不是 502 的住客。

兩個比喻的差別很關鍵：XSS 是「別人的瀏覽器被騙去做事」，IDOR 是「伺服器自己把不該給的資料給出去」。

## XSS：讓別人的瀏覽器執行不該執行的腳本

[OWASP 的定義](https://owasp.org/www-community/attacks/xss/)是：惡意腳本被注入到原本可信的網站，瀏覽器沒辦法分辨這段腳本不該被信任，就會執行它。成因是網站把使用者輸入放進輸出的網頁，卻沒有驗證或編碼。

腳本一旦跑起來，就能做網站自己的程式碼能做的事。[MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) 列了三項：讀寫頁面內容、讀寫 local storage、帶著使用者的憑證送出 HTTP 請求。這就是為什麼第 2 篇的 same-origin 很重要：腳本是從這個網站「自己」的頁面跑出來的，瀏覽器當它是自己人。

OWASP 把 XSS 分成兩種常見型態。**反射型**是輸入從請求進來、馬上在回應裡被印出來，例如搜尋結果頁或錯誤訊息，攻擊者要想辦法讓受害者點到那條網址。**儲存型**是輸入先被存進資料庫，之後每個看到那頁的人都會執行，OWASP 提到的老例子是留言板。

### 最小範例（只在自己的電腦練習）

下面這支程式用 Node.js（不需要安裝任何套件）開兩個只綁在 `127.0.0.1` 的小伺服器，一個有洞、一個修好，再用程式自己送請求，把回應印出來。`127.0.0.1` 只有你這台電腦連得到，外面看不到。

```js
// demo.mjs，只在自己的電腦練習：所有伺服器只綁 127.0.0.1
import http from "node:http";

// --- 假資料：兩個使用者、三張筆記 ---
const sessions = { "alice-token": "alice", "bob-token": "bob" }; // cookie -> 使用者
const notes = {
  1: { owner: "alice", text: "Alice 的日記" },
  2: { owner: "bob", text: "Bob 的銀行備忘" },
  3: { owner: "alice", text: "Alice 的購物清單" },
};

// --- XSS：有洞版與修法版 ---
const escapeHtml = (s) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
   .replaceAll('"', "&quot;").replaceAll("'", "&#x27;");

function greet(req, res, safe) {
  const name = new URL(req.url, "http://x").searchParams.get("name") ?? "";
  const shown = safe ? escapeHtml(name) : name; // 有洞版：原樣塞進 HTML
  res.setHeader("content-type", "text/html; charset=utf-8");
  res.end(`<p>Hello, ${shown}</p>`);
}

// --- IDOR：有洞版與修法版 ---
function getNote(req, res, safe) {
  const me = sessions[(req.headers.cookie ?? "").replace("session=", "")];
  if (!me) { res.statusCode = 401; return res.end("not logged in"); }
  const id = new URL(req.url, "http://x").pathname.split("/")[2];
  const note = notes[id];
  if (!note || (safe && note.owner !== me)) { // 修法：伺服器端檢查擁有者
    res.statusCode = 404; return res.end("not found");
  }
  res.end(note.text);
}

const app = (safe) => http.createServer((req, res) =>
  req.url.startsWith("/greet") ? greet(req, res, safe) :
  req.url.startsWith("/notes/") ? getNote(req, res, safe) :
  (res.statusCode = 404, res.end("?")));

const listen = (s) => new Promise((r) => s.listen(0, "127.0.0.1", () => r(s.address().port)));
const get = async (port, path, cookie) => {
  const r = await fetch(`http://127.0.0.1:${port}${path}`, { headers: cookie ? { cookie } : {} });
  return `${r.status} ${await r.text()}`;
};

const vuln = app(false), fixed = app(true);
const [pv, pf] = [await listen(vuln), await listen(fixed)];
const payload = encodeURIComponent("<script>alert(1)</script>");

console.log("== XSS ==");
console.log("有洞版 :", await get(pv, `/greet?name=${payload}`));
console.log("修法版 :", await get(pf, `/greet?name=${payload}`));
console.log("== IDOR（我是 alice，改成讀 id=2，那是 bob 的）==");
console.log("有洞版 :", await get(pv, "/notes/2", "session=alice-token"));
console.log("修法版 :", await get(pf, "/notes/2", "session=alice-token"));
console.log("修法版讀自己的 id=1 :", await get(pf, "/notes/1", "session=alice-token"));
vuln.close(); fixed.close();
```

我在沙盒用 Node.js v22.22.0 跑 `node demo.mjs`，實際輸出如下：

```text
== XSS ==
有洞版 : 200 <p>Hello, <script>alert(1)</script></p>
修法版 : 200 <p>Hello, &lt;script&gt;alert(1)&lt;/script&gt;</p>
== IDOR（我是 alice，改成讀 id=2，那是 bob 的）==
有洞版 : 200 Bob 的銀行備忘
修法版 : 404 not found
修法版讀自己的 id=1 : 200 Alice 的日記
```

先看 XSS 這兩行。`name` 是從網址參數進來的使用者輸入。有洞版把它直接接進 HTML，回應裡出現了一個真的 `<script>` 標籤。瀏覽器收到這樣的 HTML，就會把它當成腳本執行（這點是 OWASP 與 MDN 的說明，本篇的腳本只印出伺服器的回應，沒有開瀏覽器驗證）。修法版把 `<` 換成 `&lt;`、`>` 換成 `&gt;`，瀏覽器看到的就只是一串要顯示的文字，不是標籤。

**找 XSS 的位置**：問自己「這個變數的值是誰能控制的？它被放進 HTML 之前有沒有轉義？」範例裡就是 `${shown}` 那一行。

**修法是輸出轉義**。[OWASP 的 XSS 防護備忘錄](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)說，要把變數放進 HTML 標籤之間時，用 HTML 實體編碼，也就是上面那五個字元的替換；用 JavaScript 顯示文字時，優先用 [`textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) 而不是 `innerHTML`，MDN 也提醒 `innerHTML` 處理的是原始 HTML，可能受 XSS 影響。同一份備忘錄還提醒：不同位置（HTML 內文、屬性、JavaScript、網址）要用不同的編碼方式，所以實務上優先用框架內建的自動轉義，不要自己手寫。

## IDOR：把 id 換成別人的

[OWASP 的 IDOR 防護備忘錄](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html)說，IDOR 的成因是缺少存取控制檢查：沒有驗證使用者是否有權存取那筆資料。它列了三個要素：一個物件（帳號、文件、訂單）、一個指向物件的參照（id、檔名、token），以及缺少的物件層級授權檢查。

備忘錄自己的例子很直白：網址是 `https://example.org/users/123`，攻擊者把 123 改成 124 就看到別人的資料，問題在於 app 沒有先檢查使用者有沒有權限看 124。

回到範例輸出的第二段。Alice 帶著自己的登入 cookie，請求 `/notes/2`，那是 Bob 的筆記。有洞版直接回 200 和 Bob 的內容，因為程式只確認「你有登入」，沒確認「這筆是你的」。登入和授權是兩件事：前者是知道你是誰，後者是決定你能碰什麼。

**找 IDOR 的位置**：看到「用請求裡的 id 去撈資料」的地方，問「這行之後，有沒有拿目前登入者跟資料的擁有者比對？」範例裡就是 `notes[id]` 那一行。

**修法是伺服器端檢查擁有者**。範例修法版多了 `note.owner !== me` 就回 404，Alice 讀自己的 id=1 仍然正常。回 404 而不是 403 是[備忘錄](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html)提到的做法之一：如果資源是否存在本身也很敏感，就把「不存在」和「沒權限」回成同樣的結果。

兩個常見誤解：

- **把 id 改成難猜的亂數就安全**。備忘錄說，複雜的識別碼（如 GUID）可以當額外一層防禦，但存取控制檢查仍然必要，因為攻擊者若拿到別人的網址，應用程式還是得擋下來。
- **把檢查寫在前端**。[OWASP Top 10:2025 的 A01 Broken Access Control](https://top10.owasp.org/2025/A01_2025-Broken_Access_Control/)（IDOR 被歸在這一類）寫明，存取控制只有在受信任的伺服器端程式碼或 serverless API 才有效，因為攻擊者無法改動那裡的檢查。2025 版還特別舉了一個例子：存取控制全寫在前端，攻擊者直接用 curl 打後台網址就繞過了。換句話說，請求是從使用者手上的瀏覽器送出的，使用者想改什麼就能改什麼，伺服器不能假設送來的 id 是誠實的。

## 對回 Google 獎金表

第 13 篇的獎金地圖會在技術篇之後回顧這些類別；這裡先學會看懂格子本身。以下數字取自規則頁的獎金表（我於 2026-10-13 查看）。

| 類別 | 規則頁的例子欄 | T0（Tier 0 域名或全球影響） | T1 | T2（一般 Google 應用，如 *.google.com） |
|---|---|---|---|---|
| C0 在客戶端執行程式碼 | Web: Cross-site scripting（行動裝置／硬體：Code execution） | 20,000 | 15,000 | 10,000 |
| S2a 邏輯漏洞，影響 Information Tier 0 或 Critical Actions | Direct object reference、remote user impersonation | 50,000 | 50,000 | 31,337 |
| S2b 邏輯漏洞，影響 Information Tier 1 或 Impactful Actions | Direct object reference、remote user impersonation | 31,337 | 31,337 | 13,337 |
| S2c 邏輯漏洞，影響 Information Tier 2 或 Moderate Actions | Direct object reference、remote user impersonation | 7,500 | 5,000 | 3,133.7 |

單位是美元。XSS 在表裡對應一列（C0），同一列內的金額只隨網域層級變動。IDOR 在「邏輯漏洞」下分成三列，金額先看洩漏或改動的資料多敏感，再看網域層級。

規則頁對資料敏感度的分級是這樣的：

- Tier 0 是憑證與能導致帳號被接管的資料，例如信件內容、OAuth token、密碼。
- Tier 1 是高敏感的使用者資料，例如 Drive 文件內容、照片、私人行事曆、付款資訊。
- Tier 2 是中繼資料與敏感度較低的資料，例如少數私人文件的標題、Email 位址（除非本來就公開）。

所以規則頁的邏輯可以這樣讀：XSS 多了一個問題要問「這是哪個網域」，IDOR 則要同時問「洩漏了什麼」和「在哪個網域」。同樣在一般 Google 應用上，IDOR 若碰到 Tier 0 資料，基準是 31,337，是 XSS（10,000）的三倍多；若只碰到 Tier 2 資料，基準是 3,133.7，反而比 XSS 低。

規則頁的範例剛好各給了一個：

| 範例（規則頁原文大意） | 計算 | 金額 |
|---|---|---|
| `*.google.com` 上的 IDOR，可外洩使用者的已存地址（PII） | T2、S2b，品質 1x | 13,337 |
| 一個容易利用、影響所有經 Google 翻譯成英文頁面的 XSS（全球影響層級） | T0、C0，品質 1x | 20,000 |

這兩個範例不能直接互比，因為一個在 T2、一個在 T0。我想說的是別把這張表讀成「IDOR 一定比 XSS 值錢」。規則頁沒有這樣寫，表裡同時存在 IDOR 比 XSS 低（Tier 2 資料）和比 XSS 高（Tier 0、Tier 1 資料）的格子。能下的結論是：這張表對 IDOR 是按資料敏感度給價，所以碰到敏感資料時，IDOR 的格子可以比 XSS 高。

另外兩點：實際金額還會乘上報告品質係數（0.8、1、1.2），也可能因為需要大量使用者互動、需要事先取得存取權等原因被降級，最後金額由獎金審議小組裁量。規則頁也寫了測試原則：只能對自己的帳號測試，不要存取別人的資料。

## 限制

這篇是入門直覺，真實世界沒這麼乾淨。

- 範例的 XSS 防線只有一層。真實網站通常還會加 Content Security Policy（CSP），這是由伺服器告訴瀏覽器「哪些腳本來源可以執行」的機制，細節見 [MDN 的 CSP 說明](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)。OWASP 與 MDN 都說 CSP 是縱深防禦，不能取代輸出轉義。
- 範例的輸入簡單到只有一種位置（HTML 內文）。OWASP 備忘錄列了屬性、JavaScript、CSS、網址等不同位置各有不同編碼規則，這篇沒有展開。
- 範例的 IDOR 只檢查讀取。OWASP 備忘錄指出，讀取、建立、更新、刪除、匯出、管理動作都要檢查。
- 這篇沒有教怎麼繞過防護，也不會教怎麼攻擊真實網站。未經授權測試別人的網站可能違法；規則頁自己寫的是只測自己的帳號。

## 合法的練習去處

下面三個都是我在官方頁面確認存在的練習資源，其中 PortSwigger 的官方頁面明說是免費的。它們的設計目的就是讓你合法地練習，不必碰真實網站。

- [PortSwigger Web Security Academy](https://portswigger.net/web-security)：官方頁面說明它是免費的線上網站安全訓練，有互動式實驗室，也說明沒有 Burp Suite 專業版時，可以用免費的社群版體驗。追蹤進度要註冊帳號。
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)：OWASP 專案頁的描述是用於安全訓練的不安全網頁應用程式，涵蓋 OWASP Top 10 的漏洞。
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/)：OWASP 的訓練用應用程式；XSS 條目也提到它有跨站腳本與資料編碼的課程。

今晚能做的事：把上面的 `demo.mjs` 存下來跑一次，然後把有洞版的 `/notes/2` 請求改成別的 id、把 `name` 換成別的文字，觀察回應怎麼變。再挑 Juice Shop 或 PortSwigger 的 XSS 與 access control 各一個入門實驗室。下一篇[什麼是 RCE](/posts/tech/2026-10-13-bug-bounty-zero-04-what-is-rce)，看獎金表最上面那一列。

## 參考資料

- [Google and Alphabet VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)（獎金表、資料敏感度分級、範例、測試原則）
- [OWASP：Cross Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/)
- [OWASP Cheat Sheet：Cross Site Scripting Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP Cheat Sheet：Insecure Direct Object Reference Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html)
- [OWASP Top 10:2025 A01 Broken Access Control](https://top10.owasp.org/2025/A01_2025-Broken_Access_Control/)
- [MDN：Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
- [MDN：Node.textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/)
- 本系列：[第 13 篇 Bug Bounty 頂級獎金查證](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check)、[第 2 篇 網站怎麼運作](/posts/tech/2026-10-13-bug-bounty-zero-02-how-websites-work)、[第 5 篇 什麼是 RCE](/posts/tech/2026-10-13-bug-bounty-zero-04-what-is-rce)

[上一篇：第 3 篇](/posts/tech/2026-10-15-bug-bounty-hunter-workbench)・[下一篇：第 5 篇](/posts/tech/2026-10-13-bug-bounty-zero-04-what-is-rce)
