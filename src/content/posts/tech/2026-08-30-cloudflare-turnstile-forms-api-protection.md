---
title: "Cloudflare Turnstile 怎麼用：保護表單與公開 API，不靠傳統 CAPTCHA"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, cloudflare-turnstile, security, forms, bot-protection]
lang: zh-TW
tldr: "Turnstile 是 Cloudflare 的 CAPTCHA 替代方案：前端 widget 產生 token，後端必須用 Siteverify API 驗證。token 有效 300 秒、只能驗一次；只放 widget 不驗 token，等於沒有完成防護。"
description: "從 Turnstile widget、Managed/Non-interactive/Invisible 模式、implicit/explicit rendering、Siteverify API、token 期限、testing keys、analytics 與 plan 限制，拆解它如何保護表單與公開 endpoint。"
draft: true
series:
  name: "Cloudflare Edge Platform"
  order: 15
---

> 🌏 [English version](/en/posts/tech/2026-08-30-cloudflare-turnstile-forms-api-protection-en)

公開表單和公開 API 很快就會遇到同一個問題：你想讓真人能送出留言、登入、註冊、訂閱 newsletter、提交 waitlist，卻不想讓 bot 把 endpoint 當免費寫入管道。[Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) 是 Cloudflare 的 CAPTCHA 替代方案，重點不在叫使用者選紅綠燈，而是用一組 client-side challenges 判斷瀏覽器與訪客風險，再產生一個後端必須驗證的 token。

Turnstile 可以用在任何網站，不要求網站流量一定經過 Cloudflare CDN。它在 Edge Platform 裡的位置很明確：放在表單、登入、註冊、comment、contact、公開 mutation endpoint 前面，減少自動化濫用。真正的 security 防線是「widget token + server-side verification + rate limit + application rules」一起運作。

## Turnstile 的基本流程

官方 get started 文件把流程拆成兩步：前端嵌入 widget 產生 token，後端呼叫 Siteverify API 驗證 token。

```txt
Visitor
  |
  v
Turnstile widget in browser
  |
  +--> token: cf-turnstile-response
  |
  v
Your form/API endpoint
  |
  v
POST https://challenges.cloudflare.com/turnstile/v0/siteverify
  |
  v
allow or reject original request
```

每個 widget 有兩把 key：

- **sitekey**：公開，放在 HTML 或前端程式裡，用來 render widget。
- **secret key**：私密，只放在後端，用來打 Siteverify。

最容易犯的錯是只放前端 widget。Cloudflare 文件講得很直接：server-side validation 是 mandatory。token 可能被偽造、過期或重放；後端沒有打 Siteverify，這個 endpoint 其實沒有被保護。

## 選 widget type：先用 Managed

Turnstile 有三種 widget type：

| type | 行為 | 適合 |
|---|---|---|
| Managed | 依訪客風險決定是否顯示 checkbox | 大多數表單，官方推薦起點 |
| Non-interactive | 不要求訪客互動 | 想降低干擾，但仍可保留可見 widget |
| Invisible | 完全隱藏 | SPA、動態流程、submit 時才驗 |

我會預設從 Managed 開始。它保留足夠透明度，使用者知道這個表單有驗證，也讓 Cloudflare 依風險決定是否需要互動。Invisible 適合更成熟的流程，但 debug 和使用者回饋要做得更完整，否則失敗時使用者只會覺得按鈕壞掉。

appearance 和 execution 是另外兩個控制點：

- `appearance: "always"`：widget 一開始就可見。
- `appearance: "execute"`：challenge 開始後才顯示。
- `appearance: "interaction-only"`：只有需要使用者互動時才顯示。
- `execution: "render"`：render 後就跑 challenge。
- `execution: "execute"`：等你呼叫 `turnstile.execute()` 才跑。

靜態表單通常用預設值就好；多步驟表單、checkout 或 SPA 可以把 execution 延後到真正 submit 前，避免 token 太早產生後過期。

## 前端：implicit rendering 最少程式碼

最簡單的整合是在頁面載入 Turnstile script，表單裡放一個 `cf-turnstile` div：

```html
<script
  src="https://challenges.cloudflare.com/turnstile/v0/api.js"
  async
  defer
></script>

<form action="/api/contact" method="POST">
  <input name="email" type="email" autocomplete="email" required />
  <textarea name="message" required></textarea>
  <div class="cf-turnstile" data-sitekey="<YOUR-SITE-KEY>"></div>
  <button type="submit">Send</button>
</form>
```

Turnstile 會自動在 form 裡加一個 hidden input，name 是 `cf-turnstile-response`，表單送出時一起送到後端。

Cloudflare 文件特別提醒：`api.js` 必須從 `https://challenges.cloudflare.com/turnstile/v0/api.js` 這個 exact URL 載入，不要自己 proxy 或 cache。它未來會更新，自己快取可能讓 Turnstile 壞掉。

如果是 SPA 或動態表單，用 explicit rendering：

```html
<script
  src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
  defer
></script>

<div id="turnstile-widget"></div>

<script>
  window.onload = function () {
    turnstile.render("#turnstile-widget", {
      sitekey: "<YOUR-SITE-KEY>",
      theme: "auto",
      size: "flexible",
      callback: function (token) {
        document.querySelector("input[name=turnstileToken]").value = token;
      },
    });
  };
</script>
```

Managed 和 Non-interactive widget 有三種 size：`normal`、`flexible`、`compact`。一般表單我會用 `flexible`，避免手機窄版 layout 被固定 300px 寬度撐壞。

## 後端：Siteverify 才是真正的 gate

Turnstile 的驗證 endpoint 是：

```txt
POST https://challenges.cloudflare.com/turnstile/v0/siteverify
```

必要參數：

- `secret`：widget secret key。
- `response`：前端送來的 token。

可選參數：

- `remoteip`：訪客 IP。
- `idempotency_key`：你產生的 UUID，用來安全 retry validation request。

在 Workers 裡可以這樣寫：

```ts
type TurnstileResult = {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
  action?: string;
  cdata?: string;
};

async function verifyTurnstile(request: Request, env: Env): Promise<TurnstileResult> {
  const body = await request.formData();
  const token = body.get("cf-turnstile-response");

  if (typeof token !== "string" || token.length === 0) {
    return { success: false, "error-codes": ["missing-input-response"] };
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: request.headers.get("CF-Connecting-IP"),
      idempotency_key: crypto.randomUUID(),
    }),
  });

  return response.json<TurnstileResult>();
}

export default {
  async fetch(request, env): Promise<Response> {
    const validation = await verifyTurnstile(request, env);

    if (!validation.success) {
      return Response.json(
        { error: "verification_failed", codes: validation["error-codes"] ?? [] },
        { status: 400 },
      );
    }

    return Response.json({ ok: true });
  },
};
```

token 特性要寫進系統設計：

- token 最長 2048 characters。
- token 產生後有效 300 秒。
- token 只能驗證一次。
- 過期或重放會回 `timeout-or-duplicate`。

這代表長表單要注意時間。使用者填太久，token 過期後要呼叫 `turnstile.reset()` 重新產生，不要把錯誤直接丟給使用者。

## action、cdata、hostname：把驗證接回應用邏輯

Turnstile 不該只回傳 `success: true` 就結束。你還要把驗證結果接回自己的 application rules：

- `hostname` 要在你的允許清單內。
- `action` 要符合這次表單或 endpoint，例如 `login`、`contact`、`signup`。
- `cdata` 可以放你要追蹤的非敏感資料，例如 flow id 或 experiment id。
- 同一個 IP / account / session 的失敗率要接到 rate limit 或風險分數。

例如 contact form 的 server-side gate 可以是：

```ts
if (!validation.success) reject();
if (validation.hostname !== "example.com") reject();
if (validation.action !== "contact") reject();
if (tooManyAttempts(ip, "contact")) reject();
```

Turnstile 解的是「這個 request 是否通過挑戰」。它不會替你判斷留言內容是不是 spam、不會做帳號風控、不會處理商業邏輯授權。公開 mutation endpoint 還是要有 rate limiting、內容規則、權限檢查和審核流程。

## 測試：不要用 production key 跑自動化

Turnstile 會把 Selenium、Cypress、Playwright 這類自動化測試工具視為 bot。官方提供 dummy sitekeys 和 secret keys，讓測試穩定。

常用組合：

| sitekey | secret | 結果 |
|---|---|---|
| `1x00000000000000000000AA` | `1x0000000000000000000000000000000AA` | always pass |
| `2x00000000000000000000AB` | `2x0000000000000000000000000000000AA` | always fail |
| `1x00000000000000000000AA` | `3x0000000000000000000000000000000AA` | timeout-or-duplicate |

測試 key 可用在 `localhost`、`127.0.0.1` 和任意 development domain。production secret key 會拒絕 dummy token，所以前後端要一起切測試 key，不能只換 sitekey。

我會把 key 分環境：

```txt
TURNSTILE_SITEKEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

正式環境才用真 key，並且只放 secret 在 server-side secret store，不進前端 bundle。

## Analytics 和 plans

[Turnstile Analytics](https://developers.cloudflare.com/turnstile/turnstile-analytics/) 可以看 widget traffic、solve rate、top hostnames、browsers、countries、user agents、ASNs、operating systems、source IPs。這些資料適合拿來回答：

- 哪個 form 被打最多？
- 哪些 ASN 或 IP 的失敗率異常？
- 某個 browser / country 是否大量 fail？
- token validation 是否有被後端正確呼叫？

Plans 目前很簡單：Free 和 Enterprise。Free plan 是免費，最多 20 widgets、每個 widget 10 hostnames、unlimited challenges / verification requests、analytics lookback 最長 7 天。Enterprise 有 unlimited widgets、每 widget 最多 200 hostnames、any hostname widget、30 天 analytics lookback、ephemeral IDs、offlabel 等能力。

大多數 production app 可以先用 Free。需要多網域、白標、進階 bot detection、device fingerprinting 或嚴格合規時，再看 Enterprise。

## 什麼時候用 Turnstile

我會在這些地方放 Turnstile：

- contact form、comment form、newsletter signup。
- login、signup、password reset。
- waitlist、coupon claim、trial signup。
- 匿名或低信任使用者能觸發的 expensive action。
- 任何公開 mutation endpoint 前面。

我不會拿它取代這些東西：

- authentication：Turnstile 不知道使用者是誰。
- authorization：Turnstile 不知道使用者能不能做這件事。
- rate limiting：通過挑戰的真人也可能濫用。
- WAF / bot management：Turnstile 是 endpoint-level challenge，不是整站流量策略。
- fraud detection：付款、優惠券、帳號濫用還要自己的風控。

在 Edge Platform 裡，Turnstile 比較像 request admission control。它先幫你擋掉一層自動化流量，後面仍然要接 rate limit、session、權限、資料驗證與審核。

## Production 前的檢查清單

上線前我會確認：

- 每個環境用不同 widget，dev/staging/prod 不共用 key。
- production widget 限制 hostnames，不放 `localhost`。
- secret key 只放在 server-side secret，不進前端。
- 後端一定呼叫 Siteverify，失敗就拒絕原始 request。
- token 過期和 duplicate 有清楚錯誤處理，前端會 reset widget。
- SPA / 多步驟表單用 explicit rendering 或 execute mode 控制驗證時間。
- action / cdata / hostname 會被後端檢查，不只看 `success`。
- 自動化測試用 dummy keys，不碰 production key。
- Analytics 有人看，異常 ASN/IP/hostname 會進入處理流程。
- Turnstile 後面仍有 rate limit、資料驗證、權限與 spam moderation。

Turnstile 的價值在於低干擾地增加一道 request gate。它不會讓公開 endpoint 自動安全，但它能把「任何人都能直接 POST」改成「通過挑戰、被後端驗證、再進入應用規則」。對大多數表單和公開 API，這已經是很值得補上的第一層。

## 參考資料

- [Cloudflare Turnstile — Overview](https://developers.cloudflare.com/turnstile/)
- [Cloudflare Turnstile — Get started](https://developers.cloudflare.com/turnstile/get-started/)
- [Cloudflare Turnstile — Embed the widget](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/)
- [Cloudflare Turnstile — Widget configurations](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/)
- [Cloudflare Turnstile — Validate the token](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Cloudflare Turnstile — Test your implementation](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
- [Cloudflare Turnstile — Analytics](https://developers.cloudflare.com/turnstile/turnstile-analytics/)
- [Cloudflare Turnstile — Plans](https://developers.cloudflare.com/turnstile/plans/)
