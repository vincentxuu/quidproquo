---
title: "Cloudflare Email Service 怎麼用：讓 Workers 寄信、收信與處理產品通知"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, cloudflare-email-service, email, workers, notifications, security]
lang: zh-TW
tldr: "Cloudflare Email Service 把產品常見的交易信、magic link、通知與收信 routing 接進 Workers。寄任意收件人目前需要 Workers Paid；收信 routing 可在 Free/Paid 使用，但仍要注意 DNS、配額、message size、bounce 和 anti-spam 邊界。"
description: "從 Cloudflare Email Service 的 Email Sending、Email Routing、Workers binding、REST API、SMTP、pricing、limits 與安全檢查，拆解它在 Edge Platform 裡適合承擔哪一段產品通訊流程。"
draft: true
series:
  name: "Cloudflare Edge Platform"
  order: 14
---

> 🌏 [English version](/en/posts/tech/2026-08-30-cloudflare-email-service-workers-en)

產品一旦有註冊、登入、付款、通知、客服，就會碰到 email。你可以接 SendGrid、Postmark、SES，也可以自己管 SMTP。但如果你的 app 已經跑在 Workers 上，[Cloudflare Email Service](https://developers.cloudflare.com/email-service/) 的吸引力在於少一段外部 infra：HTTP request 進 Worker，資料寫 D1/R2/Queue，交易信直接從 Worker 送出；使用者寄到 `support@` 或 `orders@`，也能 route 到 Worker 做分類、轉寄或自動回覆。

它在 Cloudflare Edge Platform 裡的位置不是行銷信平台，也不是完整客服系統。比較準確的說法是：Email Service 是 Workers 應用的出站與入站 email 管線。你用它送 password reset、magic link、receipt、系統 alert；也用它把收進來的信變成可程式化事件。

## 先分清楚：Sending 和 Routing

Cloudflare Email Service 由兩塊組成。

| 功能 | 做什麼 | 方案狀態 | 典型用途 |
|---|---|---|---|
| Email Sending | 從 app 對外寄交易信 | Beta；寄任意收件人需要 Workers Paid | magic link、驗證信、訂單通知、系統 alert |
| Email Routing | 收進來的信轉寄到信箱或 Worker | Workers Free / Paid 可用 | `support@`、`contact@`、信件觸發自動化 |

這條界線很重要。Email Routing 可以讓你的網域收信並轉寄，或把信交給 Worker 的 `email()` handler。Email Sending 則讓 Worker、REST API 或 SMTP 對外寄信。Cloudflare 文件也特別註明：寄到帳號內已驗證的 destination address 在所有方案都是免費的；但要寄給任意收件人，需要 Workers Paid。

如果只是想要 `hello@example.com` 轉寄到 Gmail，Routing 就夠了。如果產品要寄註冊信、OTP、付款通知，才會碰到 Sending 的方案、配額和 deliverability。

## 前置條件：DNS 和網域驗證

Email Service 不是一個可以隨便拿任何 `from` address 發信的 API。Cloudflare 官方文件要求使用 Cloudflare DNS。設定 Sending 時，Cloudflare 會幫你的 domain 加上和 bounce、SPF、DKIM、DMARC 相關的 DNS records；設定 Routing 時，會加上收信用的 MX、SPF、DKIM records。

這也是它和一般 email API 的差異。你拿到的不只是一把 API key 和一個 endpoint，還會把網域的 email path 接到 Cloudflare。好處是 Workers 可以靠 binding 直接送信、收信；代價是這套比較適合已經把 domain 放在 Cloudflare 的產品。

## 從 Worker 寄交易信

在 Workers 裡，Sending 用 `send_email` binding。Wrangler 設定可以長這樣：

```jsonc
{
  "send_email": [
    {
      "name": "EMAIL",
      "remote": true
    }
  ]
}
```

Worker 端則是直接呼叫 `env.EMAIL.send()`：

```ts
interface Env {
  EMAIL: SendEmail;
}

export default {
  async fetch(request, env): Promise<Response> {
    const result = await env.EMAIL.send({
      to: "user@example.com",
      from: "login@example.com",
      subject: "Your sign-in link",
      html: "<p>Open this link to sign in.</p>",
      text: "Open this link to sign in.",
    });

    return Response.json({ messageId: result.messageId });
  },
} satisfies ExportedHandler<Env>;
```

這種 API 很適合交易信。比方說使用者送出登入表單後，Worker 先把 one-time token 寫進 D1，再寄 magic link。寄信失敗時，你可以把事件丟進 [Queues](/posts/tech/2026-08-22-cloudflare-queues) 做 retry 或人工檢查；使用者不需要卡在外部 email API 的延遲上。

但我不會把大量 newsletter 直接塞進 request path。即使 Email Service 能寄信，產品設計上仍要分開同步 request 和背景發送：

- 登入信、驗證信：可以在 request 中寄，失敗時回明確錯誤。
- 訂單收據、提醒、digest：比較適合先寫入 queue，再由 consumer 批次送。
- 大量行銷信：要另外處理退訂、名單品質、節流、投遞監控和法規。

Email Service 文件的 limits 也提醒：新帳號會從保守 daily quota 起步，系統會依寄送行為、deliverability 和帳號狀態調整。這代表你不能把它當成「第一天就能無限制寄大量信」的服務。

安全性也要提早處理，實作上要有一份 email security checklist。登入信和驗證信要有短效 token、一次性使用紀錄、rate limit 和可追蹤的 audit log；notifications 類型的通知則要避免把敏感資料直接放進 subject 或 log。

## 用 REST API 或 SMTP 接非 Workers 系統

如果你的主 app 還不在 Workers，也可以用 REST API：

```bash
curl "https://api.cloudflare.com/client/v4/accounts/{account_id}/email/sending/send" \
  --header "Authorization: Bearer <API_TOKEN>" \
  --header "Content-Type: application/json" \
  --data '{
    "to": "user@example.com",
    "from": "welcome@example.com",
    "subject": "Welcome",
    "html": "<p>Welcome.</p>",
    "text": "Welcome."
  }'
```

SMTP 則適合已經有 SMTP client 的系統。Cloudflare 的 SMTP endpoint 是 `smtp.mx.cloudflare.net:465`，用 API token 驗證。這讓舊系統可以先接進 Cloudflare Email Service，不必第一天就改成 Workers binding。

如果是新做的 Cloudflare app，我會優先用 binding。原因很單純：binding 讓寄信成為 Worker runtime 的一部分，不用把 account id、endpoint、HTTP client 和 token handling 散在自己的程式裡。

## 收信：把 email 變成 Worker event

Routing 的基本用法是把 `support@example.com` 轉寄到既有信箱。但比較有意思的是把 incoming email 交給 Worker：

```ts
import { EmailMessage } from "cloudflare:email";

export default {
  async email(message, env, ctx): Promise<void> {
    const subject = message.headers.get("subject") ?? "";

    if (message.to.startsWith("support@")) {
      await message.forward("team@example.com");
      return;
    }

    await message.forward("admin@example.com");
  },
} satisfies ExportedHandler;
```

這裡的模型和 HTTP handler 很像，只是入口變成 `email(message, env, ctx)`。你可以依收件地址、寄件者、標題、headers 做 routing，也可以自動回覆。Cloudflare 文件裡的範例會用 `mimetext` 建 MIME reply，並透過 `message.reply()` 回信。

這個能力在 AI app 裡也會很實用：使用者寄信建立 ticket、寄附件進 R2、把客服信摘要後丟進 D1、或把信件交給 agent 做初步分類。只是要記住，email 入口非常髒。你需要做 sender allowlist、附件大小限制、loop protection、spam 處理、idempotency 和審計紀錄。

## Limits：產品設計要先知道的邊界

Cloudflare Email Service 的限制會直接影響產品設計：

- 一封信的 `to`、`cc`、`bcc` 合計最多 50 個收件人。
- subject 最多 998 characters。
- 一般 message size 上限 5 MiB；寄給 verified destination address 時可到 25 MiB。
- custom headers 合計 16 KB。
- Routing rule 每個 domain 最多 200 條。
- 每個 account 最多 200 個 destination addresses。
- inbound message size 上限 25 MiB。

另外，Routing 到 Worker 仍會消耗 Workers 的 CPU 和 memory。Free plan 上複雜 handler 可能超過限制，失敗會在 Workers logs 裡看到 `EXCEEDED_CPU`。所以 inbound email handler 不應該做太重的同步工作。比較穩的做法是解析最小 metadata，把原始內容或附件放到 R2，然後把工作丟進 queue。

## Pricing：不用猜，先看兩件事

以 2026-06-09 的官方 pricing 頁面來看，Email Routing 在 Workers Free 和 Workers Paid 都可用，inbound emails unlimited。Email Sending 的任意收件人寄送需要 Workers Paid，包含每月 3,000 封 outbound emails，之後每 1,000 封 $0.35。

這裡有兩個容易誤解的點。

第一，寄到 verified destination addresses 不算入 monthly quota，也不算 daily sending limits。這適合測試、內部通知、或把 routing domain 當成簡單的發送來源。

第二，Email Routing Workers 依 Workers pricing 計費。也就是說，收信本身可以 unlimited，但你在 Worker 裡做的運算、儲存、queue、R2 寫入，還是各自照 Cloudflare 服務的規則算。

## 我會怎麼放進 Edge Platform 架構

如果我在 Cloudflare 上做一個 SaaS，小型架構會長這樣：

1. Worker 接註冊、登入、付款 webhook。
2. D1 存 user、token、email event。
3. Email Service 寄 magic link、verification、receipt。
4. Queues 處理非即時通知和 retry。
5. R2 存 incoming email 原文、附件或長期留存檔案。
6. Analytics Engine 記錄 send attempt、bounce、routing decision、latency。
7. Turnstile 保護 public form，避免 signup 或 contact form 被濫用。

Email Service 的價值在這裡會比較清楚：它不是取代所有專業 email 平台；它把產品需要的那段交易信與收信入口拉回 Cloudflare runtime。對小團隊來說，少一個 provider、少一組 webhook、少一段 retry plumbing，通常就值得寫進架構選項。

## 什麼時候不該選它

我會避開三種場景：

- 你主要要做大量 newsletter、行銷自動化、名單分群、A/B subject line。
- 你的 domain 不在 Cloudflare DNS，也不打算移。
- 你需要已成熟的 deliverability tooling、專屬 IP、複雜 suppression/complaint workflow。

這些場景用專門 email 平台比較實際。Cloudflare Email Service 比較像 Edge Platform 的 product email primitive：讓 Workers 產品能寄該寄的信、收該收的信，並把後續處理接回同一套 serverless 架構。

## 參考資料

- [Cloudflare Email Service](https://developers.cloudflare.com/email-service/)
- [Send emails](https://developers.cloudflare.com/email-service/get-started/send-emails/)
- [Route emails](https://developers.cloudflare.com/email-service/get-started/route-emails/)
- [Email Service limits](https://developers.cloudflare.com/email-service/platform/limits/)
- [Email Service pricing](https://developers.cloudflare.com/email-service/platform/pricing/)
- [Cloudflare Workers observability logs](https://developers.cloudflare.com/workers/observability/logs/)
- [Cloudflare Queues](https://developers.cloudflare.com/queues/)
