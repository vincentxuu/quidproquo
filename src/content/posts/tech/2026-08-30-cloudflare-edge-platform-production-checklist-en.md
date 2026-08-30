---
title: "Cloudflare Edge Platform Production Checklist: Custom Domains, Maintenance Pages, and Workers Limits"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, workers, deployment, custom-domains, limits, checklist]
lang: en
tldr: "Before a Cloudflare app goes live, do not stop at a successful deploy. Check Custom Domains, Routes, www/root redirects, maintenance pages, CPU/memory/subrequest limits, log sampling, and fallback paths. This appendix turns the Edge Platform series into a production checklist."
description: "A Cloudflare Edge Platform production checklist covering Workers Custom Domains, Routes, Custom Errors, maintenance pages, CPU and memory limits, subrequests, observability, and related pitfall posts."
draft: true
series:
  name: "Cloudflare Edge Platform"
  order: 19
---

> 🌏 [中文版](/posts/tech/2026-08-30-cloudflare-edge-platform-production-checklist)

The most common Cloudflare production issues are not always code bugs. They often come from routing, DNS, plan limits, maintenance pages, same-zone Worker calls, native modules, or log retention. A successful `wrangler deploy` means the Worker was uploaded. It does not prove the full production path is ready.

This post is the appendix for Cloudflare Edge Platform. It turns scattered production pitfalls into one checklist. It does not reintroduce Workers, D1, R2, Durable Objects, Queues, Workflows, Cache Rules, Smart Shield, Images, Email Service, Turnstile, Observability, Browser Run, or Containers. It answers a narrower question: what gets missed before launch?

## 1. Do Not Blur Custom Domains and Routes

[Cloudflare Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) attach all paths of a domain or subdomain to a Worker. Cloudflare creates DNS records and certificates for you. This is a good fit when the Worker itself is the origin.

Routes are a different model: a Worker intercepts requests matching a hostname/path pattern. Both send traffic to Workers, but their behavior differs.

Pre-launch checks:

- Is this hostname using a Custom Domain or a Route?
- Does the Custom Domain hostname already have a CNAME? The docs say a Custom Domain cannot be created on a hostname with an existing CNAME.
- Should both `example.com` and `www.example.com` work? Custom Domains use exact hostname matching.
- When one same-zone Worker calls another, is it using a service binding, or does the Custom Domain behavior allow the fetch?
- After deleting a Custom Domain, should the associated Advanced Certificate be removed too?

Related post: [The Correct Way to Bind Custom Domains to Cloudflare Workers](/en/posts/tech/debug/2026-03-12-cloudflare-workers-custom-domain-en).

## 2. Design Maintenance Pages Before Incidents

[Custom Errors](https://developers.cloudflare.com/rules/custom-errors/) can replace default Cloudflare error pages, and Custom Error Rules can serve custom content for HTTP errors 400 and above. Availability depends on plan: the official table shows Free does not support Custom Errors, while Pro, Business, and Enterprise do.

If you are on Free plan and need maintenance mode or outage messaging, a Worker returning a maintenance response is often more practical than relying on Cloudflare Custom Error Pages.

Pre-launch checks:

- Does the current plan support Custom Errors?
- Should API paths and HTML paths use different error responses?
- Is maintenance mode global, path-specific, or tenant-specific?
- Does the maintenance page avoid depending on the origin being maintained?
- Will status pages, health checks, or monitoring misread a maintenance response?

Related post: [Maintenance Page on Cloudflare Free Plan: Custom Error Pages Do Not Work, Use a Worker](/en/posts/tech/2026-03-13-cloudflare-worker-maintenance-page-free-plan-en).

## 3. Workers Limits Shape the Architecture

[Workers limits](https://developers.cloudflare.com/workers/platform/limits/) are not appendix material; they shape the system. Free plan has 100,000 requests per day. CPU time is 10 ms on Free; on Paid, HTTP requests default to 30 seconds and can be raised to 5 minutes. Memory per isolate is 128 MB. Subrequests are 50 per request on Free and 10,000 on Paid. Simultaneous outgoing connections are capped at 6 per request.

Those limits tell you where work belongs:

- CPU-heavy work: split it up, or move it to Queues, Workflows, or Containers.
- Large files: stream them or store them in R2 instead of buffering.
- Long workflows: use Workflows when durable steps matter.
- Bursty background work: process it through Queues.
- Per-session coordination: use Durable Objects.
- Browser automation: use Browser Run instead of trying to embed a browser in Workers.

Pre-launch checks:

- Does the request path perform CPU-heavy JSON/PDF/image processing?
- Does one request make too many subrequests?
- Are full request or response bodies loaded into memory?
- Is `ctx.waitUntil()` being used for work that needs more than 30 seconds?
- Are Queue consumer, Cron, and DO alarm duration limits enough?

## 4. Build Success Does Not Prove Runtime Compatibility

Frameworks such as Astro, Next.js, OpenNext, and Hono can run on Workers, but build-time and runtime boundaries still matter. Node native modules, filesystem assumptions, dynamic imports, SSR routes, and prerender routes can all behave differently before and after deployment.

Pre-launch checks:

- Do dependencies actually support the Workers runtime?
- Are there Node native modules?
- Can build-time imports execute inside prerender routes?
- Does local development resemble production runtime closely enough?
- Are adapter versions and Cloudflare compatibility date pinned?

Related post: [Astro + Cloudflare Workers: Native Modules Can Break Prerender Routes Too](/en/posts/tech/debug/2026-03-13-astro-cloudflare-native-module-en).

## 5. Turn on Observability Before the Incident

Workers Logs, traces, metrics, and Analytics Engine should not be added only after something breaks. At minimum, production requests should include request ID, route, tenant, status, duration, and important binding outcomes.

Pre-launch checks:

- Is `observability.enabled` set in Wrangler?
- Is production `head_sampling_rate` appropriate?
- Do error logs avoid PII, secrets, full prompts, and full email bodies?
- Does Analytics Engine store only usage/latency/error metrics rather than sensitive data?
- Do Browser Run, Containers, and Email Service have their own usage events?

Series post: [How to Use Cloudflare Observability: Workers Logs, Traces, and Analytics Engine](/en/posts/tech/2026-08-30-cloudflare-observability-analytics-engine-en).

## 6. Estimate Cost by Service Combination

Individual Cloudflare services can look cheap, but real cost appears in combinations. One AI request may use Worker, AI Gateway, Workers AI or an external provider, Vectorize / AI Search, R2, D1, and Analytics Engine. One screenshot job may use Worker, Queue, Browser Run, R2, and Logs.

Pre-launch checks:

- Which Cloudflare services does one user action trigger?
- Which services charge by request, storage, duration, or browser time?
- Do Free/Paid/Enterprise limits affect production?
- Do high-risk features have per-tenant rate limits?
- Is usage visible in a dashboard, or does it need Analytics Engine instrumentation?

## Minimal Launch Checklist

For a first Cloudflare app, I would write the checklist as:

1. Custom Domain / Route / redirect paths are listed.
2. Maintenance mode and error responses can be switched.
3. Workers limits have been checked against request paths.
4. Large files go to R2, long work to Queues / Workflows, coordination to Durable Objects.
5. Observability, structured logs, and basic metrics are enabled.
6. Secrets are not in code, logs, or R2 artifacts.
7. Every paid service has a rough usage estimate.
8. Deploy rollback or version strategy is known.

This checklist will not make a system perfect, but it avoids the common Cloudflare launch mistake: treating "deploy succeeded" as proof that the app can handle production traffic.

## References

- [Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Cloudflare Custom Errors](https://developers.cloudflare.com/rules/custom-errors/)
- [Cloudflare Workers Observability](https://developers.cloudflare.com/workers/observability/)
- [Cloudflare Queues](https://developers.cloudflare.com/queues/)
- [Cloudflare Workflows](https://developers.cloudflare.com/workflows/)
- [Cloudflare Containers](https://developers.cloudflare.com/containers/)
