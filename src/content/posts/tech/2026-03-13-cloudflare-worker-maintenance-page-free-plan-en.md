---
title: "Cloudflare Free Plan Maintenance Page: Custom Error Pages Unavailable, Use a Worker Instead"
date: 2026-03-13
type: guide
category: tech
tags: [cloudflare, workers, nginx, devops]
lang: en
tldr: "Cloudflare Custom Error Pages require a paid plan. On the Free Plan, use a Worker with inline HTML to intercept 5xx responses instead."
description: "Cloudflare's Custom Error Pages aren't available on the Free Plan. This post documents how to use a Cloudflare Worker as a proxy to intercept nginx 5xx errors and serve a custom maintenance page."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-13-cloudflare-worker-maintenance-page-free-plan)

## TL;DR

Cloudflare's Custom Error Pages feature (which shows a custom page when nginx goes down) was restructured in 2025 and renamed to Error Pages under Rules — and it's **only available on paid plans**. The Free Plan workaround: deploy a Cloudflare Worker as a proxy, inline the maintenance page HTML directly in the Worker, and return it whenever the origin responds with a 5xx.

## Context

I was in the middle of splitting nginx out of the `daodao-server` repo into a new `daodao-infra` repo. During the switchover window (under a minute), I wanted a Cloudflare maintenance page as a fallback to prevent users from seeing raw errors during the gap.

## The Problem

I couldn't find Custom Error Pages anywhere in the Cloudflare Dashboard. The docs said it should be under **Rules → Custom Pages**, but all I could see under Rules was: Overview, Snippets, Cloud Connector, Trace, Page Rules, and Settings. No Custom Pages.

After digging around, I found that as of April 2025, the feature was renamed to **Error Pages** and moved under Rules — but it's **only available on Pro plans and above**. On the Free Plan, the option simply doesn't appear.

## The Solution

Use a Cloudflare Worker as a proxy with the maintenance page HTML inlined directly in the script.

```javascript
const MAINTENANCE_HTML = `...`;  // full HTML inlined here

export default {
  async fetch(request) {
    // Preview path — return the maintenance page directly without proxying
    if (new URL(request.url).pathname === '/maintenance.html') {
      return new Response(MAINTENANCE_HTML, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    try {
      const response = await fetch(request);
      if (response.status >= 500) {
        return new Response(MAINTENANCE_HTML, {
          status: response.status,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }
      return response;
    } catch {
      // Origin is completely unreachable
      return new Response(MAINTENANCE_HTML, {
        status: 503,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }
  },
};
```

After deploying, go to **Website → daodao.so → Worker Routes → Add Route**:
- Route: `daodao.so/*`
- Worker: select the Worker you just deployed
- Failure mode: **Fail open (continue)**

> Choose "fail open": if the Worker itself has an issue, requests fall through directly to nginx, so a Worker failure won't affect normal traffic.

## Testing

**Preview the maintenance page**

After deploying the Worker, visit it directly at:

```
https://<worker-name>.<account>.workers.dev/maintenance.html
```

The `/maintenance.html` path returns the maintenance page directly (no proxying), so you can verify the layout looks correct before binding a domain.

**Test 5xx triggering (after binding the domain)**

Stop nginx on the VPS:

```bash
docker stop nginx
```

Visit `https://daodao.so` — you should see the maintenance page instead of a raw error. Restore nginx when done:

```bash
docker start nginx
```

## Why This Happens

In April 2025, Cloudflare restructured Custom Pages into the more powerful Custom Error Rules (with conditional logic support), but gated the feature behind paid plans. The Free Plan dashboard shows no trace of it, and the official docs don't prominently flag the restriction — which is why it took a while to realize the feature simply wasn't available.

## What I Learned

Cloudflare Workers are incredibly versatile as a lightweight proxy layer — not just for edge functions. Whenever a platform feature is locked behind a paid tier, Workers can almost always replicate it in code. The Free Plan includes 100,000 requests per day, which is more than enough for most sites.

## References

- [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Custom Error Pages (Error Pages)](https://developers.cloudflare.com/rules/custom-error-responses/)
- [Workers routing](https://developers.cloudflare.com/workers/configuration/routing/)
- [Daodao Technical Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
