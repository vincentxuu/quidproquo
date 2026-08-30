---
title: "How to Use Cloudflare Turnstile: Protect Forms and Public APIs Without Classic CAPTCHA"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, cloudflare-turnstile, security, forms, bot-protection]
lang: en
tldr: "Turnstile is Cloudflare's CAPTCHA alternative: the client widget generates a token, and the server must validate it with the Siteverify API. Tokens expire after 300 seconds and are single-use; a widget without server validation is incomplete."
description: "A practical guide to Turnstile widgets, Managed/Non-interactive/Invisible modes, implicit and explicit rendering, the Siteverify API, token expiry, testing keys, analytics, and plan limits."
draft: true
series:
  name: "Cloudflare Edge Platform"
  order: 15
---

> 🌏 [中文版](/posts/tech/2026-08-30-cloudflare-turnstile-forms-api-protection)

Public forms and public APIs run into the same problem quickly: you want real people to comment, log in, sign up, subscribe, or join a waitlist, but you do not want bots to treat the endpoint as a free write path. [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) is Cloudflare's CAPTCHA alternative. Instead of asking users to pick traffic lights, it runs client-side challenges that evaluate browser and visitor risk, then generates a token your backend must verify.

Turnstile can run on any website and does not require traffic to be proxied through Cloudflare's CDN. Its place in the Edge Platform is clear: put it in front of forms, login, signup, comments, contact flows, and public mutation endpoints. The real security boundary is the widget token plus server-side verification plus rate limits plus application rules.

## The Basic Flow

Cloudflare's get started guide splits Turnstile into two steps: embed a client widget to generate a token, then validate that token on the server with the Siteverify API.

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

Each widget has two keys:

- **sitekey**: public, used in HTML or frontend code to render the widget.
- **secret key**: private, used only by the backend to call Siteverify.

The common mistake is stopping at the frontend widget. Cloudflare's docs are explicit: server-side validation is mandatory. Tokens can be forged, expired, or replayed. If the backend does not call Siteverify, the endpoint is not protected.

## Pick a Widget Type: Start With Managed

Turnstile has three widget types:

| Type | Behavior | Fit |
|---|---|---|
| Managed | Decides whether to show a checkbox based on visitor risk | Most forms; Cloudflare's recommended starting point |
| Non-interactive | Does not require visitor interaction | Lower-friction flows with a visible widget |
| Invisible | Fully hidden | SPAs, dynamic flows, submit-time verification |

I would start with Managed. It keeps enough visibility that users know verification exists, while letting Cloudflare decide when interaction is needed. Invisible mode fits more mature flows, but debugging and user feedback must be better; otherwise a failed challenge looks like a broken button.

Appearance and execution are separate controls:

- `appearance: "always"`: widget is visible from page load.
- `appearance: "execute"`: widget appears only after the challenge begins.
- `appearance: "interaction-only"`: widget appears only when visitor interaction is required.
- `execution: "render"`: challenge runs after render.
- `execution: "execute"`: challenge runs only after `turnstile.execute()`.

Static forms usually work with defaults. Multi-step forms, checkout, or SPAs can defer execution until submit time so the token does not expire before the user finishes.

## Frontend: Implicit Rendering Is the Smallest Integration

The simplest integration loads the Turnstile script and places a `cf-turnstile` div inside the form:

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

Turnstile automatically adds a hidden input named `cf-turnstile-response` inside the form, and the token is submitted with the other fields.

Cloudflare specifically warns that `api.js` must be loaded from the exact URL `https://challenges.cloudflare.com/turnstile/v0/api.js`. Do not proxy or cache it yourself. Future updates can break if you serve a stale copy.

For SPAs or dynamic forms, use explicit rendering:

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

Managed and Non-interactive widgets have three sizes: `normal`, `flexible`, and `compact`. For normal forms, I would use `flexible` so narrow mobile layouts are not forced around a fixed 300px widget.

## Backend: Siteverify Is the Real Gate

Turnstile validation uses this endpoint:

```txt
POST https://challenges.cloudflare.com/turnstile/v0/siteverify
```

Required parameters:

- `secret`: widget secret key.
- `response`: token from the client.

Optional parameters:

- `remoteip`: visitor IP address.
- `idempotency_key`: a UUID you generate to safely retry validation requests.

In Workers:

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

Token properties belong in the system design:

- Tokens can be up to 2048 characters.
- Tokens are valid for 300 seconds.
- Tokens are single-use.
- Expired or replayed tokens return `timeout-or-duplicate`.

Long forms need special handling. If the user takes too long, call `turnstile.reset()` and generate a fresh token rather than sending the user a raw backend error.

## action, cdata, and hostname Connect Verification to App Logic

Turnstile should not stop at `success: true`. Tie the result back to application rules:

- `hostname` should match your allowlist.
- `action` should match the form or endpoint, such as `login`, `contact`, or `signup`.
- `cdata` can hold non-sensitive tracking data, such as flow ID or experiment ID.
- Failure rates by IP, account, or session should feed rate limits or risk scoring.

For a contact form, the server-side gate might be:

```ts
if (!validation.success) reject();
if (validation.hostname !== "example.com") reject();
if (validation.action !== "contact") reject();
if (tooManyAttempts(ip, "contact")) reject();
```

Turnstile answers whether this request passed a challenge. It does not decide whether a message is spam, whether an account is trusted, or whether business authorization allows the action. Public mutation endpoints still need rate limiting, content rules, permissions, and review flows.

## Testing: Do Not Use Production Keys in Automation

Turnstile detects automation tools such as Selenium, Cypress, and Playwright as bots. Cloudflare provides dummy sitekeys and secret keys for predictable tests.

Common combinations:

| sitekey | secret | Result |
|---|---|---|
| `1x00000000000000000000AA` | `1x0000000000000000000000000000000AA` | always pass |
| `2x00000000000000000000AB` | `2x0000000000000000000000000000000AA` | always fail |
| `1x00000000000000000000AA` | `3x0000000000000000000000000000000AA` | timeout-or-duplicate |

Test keys work on `localhost`, `127.0.0.1`, and any development domain. Production secret keys reject dummy tokens, so switch frontend and backend keys together; replacing only the sitekey is not enough.

I would split keys by environment:

```txt
TURNSTILE_SITEKEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

Use real keys only in production, and keep the secret key in server-side secret storage, never in the frontend bundle.

## Analytics and Plans

[Turnstile Analytics](https://developers.cloudflare.com/turnstile/turnstile-analytics/) shows widget traffic, solve rate, top hostnames, browsers, countries, user agents, ASNs, operating systems, and source IPs. Use it to answer:

- Which form is being hit most?
- Which ASNs or IPs have abnormal failure rates?
- Is a browser or country failing unusually often?
- Is token validation being called by the backend?

Plans are currently simple: Free and Enterprise. The Free plan is free, supports up to 20 widgets, 10 hostnames per widget, unlimited challenges / verification requests, and analytics lookback up to 7 days. Enterprise has unlimited widgets, up to 200 hostnames per widget, any hostname widgets, 30-day analytics lookback, ephemeral IDs, offlabel, and related capabilities.

Most production apps can start on Free. Enterprise becomes relevant for many domains, white-labeling, advanced bot detection, device fingerprinting, or stricter compliance requirements.

## When to Use Turnstile

I would put Turnstile in front of:

- contact forms, comment forms, newsletter signup
- login, signup, password reset
- waitlists, coupon claims, trial signup
- expensive actions triggered by anonymous or low-trust users
- public mutation endpoints

I would not use it as a replacement for:

- authentication: Turnstile does not know who the user is.
- authorization: Turnstile does not know whether the user can perform the action.
- rate limiting: real users can still abuse a flow.
- WAF / bot management: Turnstile is an endpoint-level challenge, not a whole-site traffic policy.
- fraud detection: payments, coupons, and account abuse still need product-specific risk checks.

In the Edge Platform, Turnstile is request admission control. It removes one layer of automated traffic before the request reaches rate limits, sessions, permissions, data validation, and moderation.

## Production Checklist

Before launch, I would check:

- Each environment has its own widget; dev, staging, and prod do not share keys.
- Production widgets restrict hostnames and do not allow `localhost`.
- Secret keys live only in server-side secrets, not frontend code.
- Backend always calls Siteverify and rejects failures.
- Expired and duplicate tokens have clear handling, and the frontend resets the widget.
- SPAs and multi-step forms use explicit rendering or execute mode to control timing.
- `action`, `cdata`, and `hostname` are checked server-side, not ignored after `success`.
- Automated tests use dummy keys, not production keys.
- Analytics are monitored, and abnormal ASN/IP/hostname patterns have an owner.
- Turnstile is followed by rate limits, validation, permissions, and spam moderation.

Turnstile adds a low-friction request gate. It does not make a public endpoint automatically safe, but it changes the shape from "anyone can POST directly" to "the request passed a challenge, was verified by the backend, and then entered application rules." For most forms and public APIs, that is the right first layer.

## References

- [Cloudflare Turnstile — Overview](https://developers.cloudflare.com/turnstile/)
- [Cloudflare Turnstile — Get started](https://developers.cloudflare.com/turnstile/get-started/)
- [Cloudflare Turnstile — Embed the widget](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/)
- [Cloudflare Turnstile — Widget configurations](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/)
- [Cloudflare Turnstile — Validate the token](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Cloudflare Turnstile — Test your implementation](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
- [Cloudflare Turnstile — Analytics](https://developers.cloudflare.com/turnstile/turnstile-analytics/)
- [Cloudflare Turnstile — Plans](https://developers.cloudflare.com/turnstile/plans/)
