---
title: "How to Use Cloudflare Email Service: Sending, Routing, and Product Notifications from Workers"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, cloudflare-email-service, email, workers, notifications, security]
lang: en
tldr: "Cloudflare Email Service connects transactional email, magic links, notifications, and inbound routing to Workers. Arbitrary outbound sending currently requires Workers Paid; inbound routing is available on Free and Paid, with DNS, quota, message-size, bounce, and anti-spam limits still shaping the design."
description: "A practical guide to Cloudflare Email Service: Email Sending, Email Routing, Workers bindings, REST API, SMTP, pricing, limits, security checks, and where it fits in the Edge Platform."
draft: false
series:
  name: "Cloudflare Edge Platform"
  order: 14
---

> 🌏 [中文版](/posts/tech/2026-08-30-cloudflare-email-service-workers)

Once a product has signups, login, payments, notifications, and support, email becomes part of the backend. You can use SendGrid, Postmark, SES, or your own SMTP setup. If your app already runs on Workers, [Cloudflare Email Service](https://developers.cloudflare.com/email-service/) removes one external piece of infrastructure: the HTTP request reaches a Worker, state goes to D1/R2/Queues, transactional email is sent directly from the Worker, and incoming mail to `support@` or `orders@` can be routed into Worker code.

Its role in the Cloudflare Edge Platform is not marketing automation or a full helpdesk. A more accurate description is this: Email Service is the outbound and inbound email pipeline for Workers applications. Use it for password resets, magic links, receipts, system alerts, and turning incoming email into programmable events.

## Start with the Split: Sending and Routing

Cloudflare Email Service has two main parts.

| Feature | What it does | Plan status | Typical use |
|---|---|---|---|
| Email Sending | Sends transactional email from an app | Beta; arbitrary recipients require Workers Paid | Magic links, verification, receipts, alerts |
| Email Routing | Routes inbound email to mailboxes or Workers | Available on Workers Free and Paid | `support@`, `contact@`, email-triggered automation |

That boundary matters. Email Routing lets your domain receive mail and forward it, or pass the message to a Worker's `email()` handler. Email Sending lets Workers, the REST API, or SMTP send outbound mail. Cloudflare's docs also note that sending to verified destination addresses in your account is free on all plans; sending to arbitrary recipients requires Workers Paid.

If all you need is `hello@example.com` forwarding to Gmail, Routing is enough. If your product sends signup email, OTPs, or payment notifications, then Sending brings plan, quota, and deliverability considerations.

## Prerequisite: DNS and Domain Onboarding

Email Service is not an API that can send from any arbitrary `from` address. The official docs require Cloudflare DNS. When you configure Sending, Cloudflare adds records related to bounce handling, SPF, DKIM, and DMARC. When you configure Routing, it adds MX, SPF, and DKIM records for inbound mail.

That is the tradeoff compared with a generic email API. You are not only calling an endpoint with an API key; you are wiring the domain's email path through Cloudflare. The upside is native sending and receiving from Workers. The constraint is that it fits best when the domain already lives on Cloudflare.

## Send Transactional Email from a Worker

In Workers, Email Sending uses a `send_email` binding. Wrangler configuration can look like this:

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

The Worker calls `env.EMAIL.send()`:

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

This API is a good fit for transactional email. For example, after a user submits a login form, a Worker writes a one-time token to D1 and sends a magic link. If sending fails, the event can go to [Queues](/en/posts/tech/2026-08-22-cloudflare-queues-en) for retry or manual review; the user does not need to wait on a slow external email API path.

I would still avoid putting bulk newsletters directly in the request path. Even when Email Service can send the message, the product flow should separate synchronous requests from background delivery:

- Login and verification emails: send in the request, with a clear error on failure.
- Receipts, reminders, digests: write to a queue and let a consumer batch and retry.
- Marketing sends: handle unsubscribes, list quality, throttling, deliverability monitoring, and legal requirements separately.

The limits page also says new accounts start with conservative daily quotas, which scale based on sending behavior, deliverability, and account standing. This is not a service to treat as unlimited bulk email on day one.

Security belongs in the first design pass. Login and verification emails need short-lived tokens, single-use records, rate limits, and auditable events; notifications should avoid putting sensitive data directly in the subject line or logs.

## Use REST API or SMTP for Non-Workers Systems

If your main app is not on Workers yet, the REST API is available:

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

SMTP fits systems that already have an SMTP client. Cloudflare's SMTP endpoint is `smtp.mx.cloudflare.net:465` and authenticates with an API token. That lets older systems connect to Email Service before being rewritten around Workers bindings.

For a new Cloudflare app, I would choose the binding first. It keeps email as part of the Worker runtime instead of scattering account IDs, endpoints, HTTP clients, and token handling through application code.

## Receive Email as a Worker Event

The simplest Routing setup forwards `support@example.com` to an existing mailbox. The more interesting option is to pass incoming email to a Worker:

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

The model is close to an HTTP handler, but the entry point is `email(message, env, ctx)`. You can route by recipient, sender, subject, or headers, and you can send replies. Cloudflare's example uses `mimetext` to build a MIME reply and sends it with `message.reply()`.

This is useful in AI apps too: users can create tickets by email, send attachments into R2, store support summaries in D1, or let an agent classify messages. The email entry point is noisy, though. You still need sender allowlists, attachment limits, loop protection, spam handling, idempotency, and audit logs.

## Limits that Shape Product Design

Cloudflare Email Service limits affect the product architecture:

- One email can have up to 50 combined `to`, `cc`, and `bcc` recipients.
- Subject lines can be up to 998 characters.
- Normal message size is capped at 5 MiB; verified destination addresses can receive up to 25 MiB.
- Custom headers are capped at 16 KB total.
- A domain can have up to 200 routing rules.
- An account can have up to 200 destination addresses.
- Inbound messages are capped at 25 MiB.

Routing to Workers still consumes Workers CPU and memory. On the Free plan, complex handlers can exceed limits and fail with `EXCEEDED_CPU` in Workers logs. For inbound email, a sturdier pattern is to parse only minimal metadata synchronously, store raw content or attachments in R2, and enqueue heavier work.

## Pricing: Watch Two Things

As of the official pricing page dated 2026-06-09, Email Routing is available on Workers Free and Workers Paid, with unlimited inbound emails. Arbitrary outbound Email Sending requires Workers Paid, includes 3,000 outbound emails per month, and then costs $0.35 per 1,000 emails.

Two details are easy to miss.

First, sends to verified destination addresses do not count toward monthly quota or daily sending limits. That is useful for testing, internal alerts, and simple routing-domain sends.

Second, Email Routing Workers are billed according to Workers pricing. Inbound email may be unlimited, but compute, storage, queues, and R2 writes still follow their own product rules.

## Where I Would Put It in an Edge Platform App

For a small SaaS on Cloudflare, the shape would be:

1. Worker handles signup, login, and payment webhooks.
2. D1 stores users, tokens, and email events.
3. Email Service sends magic links, verification, and receipts.
4. Queues handles non-immediate notifications and retries.
5. R2 stores raw incoming mail, attachments, or long-term archives.
6. Analytics Engine records send attempts, bounces, routing decisions, and latency.
7. Turnstile protects public forms from abusive signups or contact-form spam.

Email Service makes the most sense in that architecture. It does not replace every specialized email provider; it brings the product email path back into the Cloudflare runtime. For a small team, one fewer provider, one fewer webhook surface, and one fewer retry layer can be a real operational win.

## When I Would Avoid It

I would avoid Email Service in three cases:

- The main workload is newsletters, marketing automation, list segmentation, and subject-line testing.
- The domain is not on Cloudflare DNS and will not move there.
- The team needs mature deliverability tooling, dedicated IPs, or complex suppression and complaint workflows.

Those cases usually belong on a dedicated email platform. Cloudflare Email Service is better understood as a product email primitive for the Edge Platform: send the emails a Workers app needs, receive the messages the product should process, and keep the next step inside the same serverless architecture.

## References

- [Cloudflare Email Service](https://developers.cloudflare.com/email-service/)
- [Send emails](https://developers.cloudflare.com/email-service/get-started/send-emails/)
- [Route emails](https://developers.cloudflare.com/email-service/get-started/route-emails/)
- [Email Service limits](https://developers.cloudflare.com/email-service/platform/limits/)
- [Email Service pricing](https://developers.cloudflare.com/email-service/platform/pricing/)
- [Cloudflare Workers observability logs](https://developers.cloudflare.com/workers/observability/logs/)
- [Cloudflare Queues](https://developers.cloudflare.com/queues/)
