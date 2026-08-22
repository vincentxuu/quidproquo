---
title: "changedetection.io Complete Guide: Selectors, Notifications, and Browser Steps"
date: 2026-08-21
category: ai
type: guide
tags: [changedetection-io, website-monitoring, web-scraping, self-hosted, docker]
lang: en
tldr: "changedetection.io is a web-change signal layer: narrow the monitored content, suppress noise, and notify downstream systems only when a meaningful change occurs. It is neither a search API nor a crawler replacement."
description: "Self-host changedetection.io with Docker, then configure watches, CSS and JSONPath filters, schedules, Apprise notifications, Playwright Browser Steps, dynamic pages, and false-positive controls."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-changedetection-web-monitoring-guide)

[changedetection.io](https://github.com/dgtlmoon/changedetection.io) periodically retrieves a known URL, stores snapshots, compares versions, and sends a notification when the content changes. It answers “did this page change?” It does not discover relevant pages across the web or crawl an entire site.

This guide follows the official repository, Wiki, and Compose configuration as checked on August 21, 2026. The goal is to build one quiet, trustworthy watch and then connect its change signal to a downstream data pipeline.

## Put It in the Right Layer

changedetection.io takes a known URL and emits a signal that a monitored region changed, along with diff content. Search, change detection, and crawling have separate jobs:

```text
Search service: discover URLs worth tracking
    ↓
changedetection.io: detect changes to known URLs
    ↓
Crawl4AI / ingestion worker: refetch, extract, validate, and store data
```

Recrawling one thousand mostly static pages every hour spends resources proving that nothing happened. changedetection.io can perform the cheaper comparison first and wake the heavier extraction path only after a change. Its snapshots and diffs are not a canonical dataset, however. Clean Markdown, structured fields, link discovery, and site-wide crawling still belong in a crawler.

## Start with Docker Compose

One container is enough when the target content is present in the HTML response. This minimal setup is derived from the official [`docker-compose.yml`](https://github.com/dgtlmoon/changedetection.io/blob/master/docker-compose.yml):

```yaml
services:
  changedetection:
    image: ghcr.io/dgtlmoon/changedetection.io
    container_name: changedetection
    ports:
      - "127.0.0.1:5000:5000"
    volumes:
      - changedetection-data:/datastore
    restart: unless-stopped

volumes:
  changedetection-data:
```

```bash
docker compose up -d
docker compose logs -f changedetection
```

Open `http://127.0.0.1:5000`. The named volume persists `/datastore`; the README's Compose update path is `docker compose pull && docker compose up -d`. Binding to `127.0.0.1` keeps the UI local. If remote access is required, put it behind a reverse proxy with TLS and access control instead of exposing the administration UI directly.

## Create the First Watch

Enter a URL on the home page, save it, and use **Recheck** to obtain a baseline snapshot. The first retrieval establishes the version that later checks can compare. Do not enable notifications until you have inspected the actual captured content.

Edit the watch and configure it in this order:

1. **Request**: start with the fast plain-text fetcher; switch to Playwright only when the page needs JavaScript.
2. **Filters & Triggers**: retain only the content that matters.
3. **Time & Date**: set the check interval and allowed schedule.
4. **Notifications**: add a notification URL and send a test message last.

This order matters. A whole-page diff commonly treats timestamps, advertisements, cookie banners, and recommendations as business events.

## Narrow the Watch with a Selector

The `CSS/JSONPath/JQ/XPath Filters` field accepts several selector types. The official [CSS Selector help](https://github.com/dgtlmoon/changedetection.io/wiki/CSS-Selector-help) stresses that the field takes a selector, not copied HTML:

```html
<div class="product">
  <span id="price">$39.00</span>
</div>
```

```css
.product #price
```

For a stable DOM, prefer semantic IDs, `data-*` attributes, or a narrowly scoped class. Avoid paths such as `div:nth-child(7)` that break when the layout moves. The Visual Selector can also select a region from the rendered page; the official README identifies it as a Playwright content-fetcher feature.

A JSON endpoint does not need to be converted to HTML. The official [JSON selector guide](https://github.com/dgtlmoon/changedetection.io/wiki/JSON-Selector-Filter-help) supports `json:` and `jq:` prefixes:

```text
json:$.items[?(@.status=="available")]
```

Use `json:$` to format and compare the entire JSON document. `jq:` supports more complex transformations, but the guide notes that jq must be installed separately outside environments that bundle it. JSONPath is simpler when only one field is needed.

## Filters and Triggers Solve Different Problems

The selector defines what region to compare. `Ignore lines containing` removes lines that should not count as changes. `Keyword triggers` narrows alerts to content matching selected terms. A practical split is:

- Include price, stock status, or an announcement body with a selector.
- Ignore “last updated,” random request IDs, and rotating recommendations.
- Trigger only when terms such as “available” or “registration open” appear.

Narrow the DOM first, then ignore remaining noise. A broad regular expression that removes every number may also hide a real price change. After each edit, inspect **Content after filters** and the diff to confirm that the retained text can still explain an event.

## Schedule at the Source's Pace

changedetection.io has a global `Time Between Check`; each watch can inherit or override it. The current form also supports weekday, time-range, and timezone limits, with business-hours and weekend presets in the repository's scheduler UI.

Match the schedule to the source:

- A daily announcement page may need hourly or daily checks.
- Inventory and ticket pages may justify a shorter interval, subject to origin load and blocking risk.
- A page updated only on weekdays can be limited to business hours in the correct timezone.

Global settings also expose `Random jitter seconds ± check`. Small jitter prevents a large watch set from hitting one origin at the top of the hour. A tighter schedule does not make an unstable selector reliable; it only produces false positives faster.

## Send Notifications through Apprise URLs

changedetection.io uses [Apprise](https://github.com/caronc/apprise) URL formats for email, Discord, Telegram, and custom HTTP endpoints. Configure shared destinations in global Settings and override them per watch where needed. The UI provides **Send test notification** and notification debug logs; inspect both before relying on an alert.

For an ingestion endpoint, the official [notification configuration notes](https://github.com/dgtlmoon/changedetection.io/wiki/Notification-configuration-notes#json-style-post--put-requests) recommend `post://`, or `posts://` for HTTPS, rather than `json://`. Apply `|tojson` to template values in a JSON body:

```json
{
  "watch": {{ watch_title | tojson }},
  "url": {{ watch_url | tojson }},
  "diff": {{ diff | tojson }}
}
```

The notification body must not be empty, and destination message limits still apply. Tokens such as `{{ diff }}` and `{{ current_snapshot }}` can become large. Human alerts should usually contain a title, URL, and short diff; let a worker refetch the complete content.

## Add Playwright Only for Dynamic Pages

The default fetcher fits pages whose content is present in the initial response. Add a browser service when JavaScript renders the price, a cookie dialog must be accepted, or content appears only after login:

```yaml
services:
  changedetection:
    image: ghcr.io/dgtlmoon/changedetection.io
    ports:
      - "127.0.0.1:5000:5000"
    volumes:
      - changedetection-data:/datastore
    environment:
      - PLAYWRIGHT_DRIVER_URL=ws://browser-sockpuppet-chrome:3000
    depends_on:
      browser-sockpuppet-chrome:
        condition: service_started
    restart: unless-stopped

  browser-sockpuppet-chrome:
    image: dgtlmoon/sockpuppetbrowser:latest
    hostname: browser-sockpuppet-chrome
    cap_add:
      - SYS_ADMIN
    environment:
      - SCREEN_WIDTH=1920
      - SCREEN_HEIGHT=1024
      - SCREEN_DEPTH=16
      - MAX_CONCURRENT_CHROME_PROCESSES=10
    restart: unless-stopped

volumes:
  changedetection-data:
```

These service names and the driver URL follow the current official Compose example. After startup, select the Playwright/Chrome fetcher in the watch's **Request** settings and verify the captured browser content.

## Browser Steps Run Before Selection

The official [Browser Steps](https://github.com/dgtlmoon/changedetection.io/wiki/Browser-Steps) page states that steps run before the Visual Selector and replay on every check. A typical sequence is:

```text
Navigate
→ Wait for selector
→ Click cookie consent
→ Fill username/password when required
→ Click submit
→ Wait for result
→ Visual Selector / content filter
→ Diff
```

Browser Steps fit repeatable interactions with a stable path. They are not a general browser agent. CAPTCHAs, one-time passwords, frequent redesigns, and sophisticated anti-bot systems can still break the flow. Credentials should not be embedded in a public Compose file or documentation example.

For a page that merely renders late, try an explicit wait first. The official [Run JavaScript before change detection](https://github.com/dgtlmoon/changedetection.io/wiki/Run-JavaScript-before-change-detection) page says custom JavaScript executes before filters and triggers, but it also requires Playwright.

## False Positives Usually Begin Upstream of the Diff

Debug a noisy watch in this order:

1. Inspect raw content: was the target content actually retrieved?
2. Inspect filtered content: does the selector retain only the necessary region?
3. Compare snapshots: did the body change, or only a timestamp, advertisement, or sort order?
4. Stabilize viewport, wait conditions, and browser actions for dynamic pages.
5. Add ignore regular expressions last, testing each against a real change.

Do not treat `diff_added` as a strict event schema. The official guide to [diff notification tokens](https://github.com/dgtlmoon/changedetection.io/wiki/Using-the-%7B%7Bdiff%7D%7D,-%7B%7Bdiff_added%7D%7D,-and-%7B%7Bdiff_removed%7D%7D-notification-tokens) notes that reordered lines may be classified as additions, removals, or changes. If the business event must say “price changed from A to B,” refetch and compare two validated structured values downstream.

## Treat the Signal as a Signal When Connecting Crawl4AI

changedetection.io and Crawl4AI should remain separate canonical tool guides because they own different lifecycle stages. Connect them like this:

```text
changedetection.io watch
  → posts:// notification
  → queue / ingestion endpoint
  → fetch watch_url with Crawl4AI
  → extract fields and validate schema
  → deduplicate by content hash
  → upsert the new version
```

Use the watch UUID or URL as an idempotency key so a retried notification does not create duplicate versions. Preserve the old record and retry when crawling fails; receiving “changed” is not a reason to delete canonical data first. Continue with the [Crawl4AI complete guide](/posts/ai/2026-08-21-crawl4ai-complete-guide-en) for extraction strategies.

## When It Is the Right Tool

changedetection.io is a good fit when:

- You monitor prices, inventory, announcements, regulations, or release notes at known URLs.
- You want a self-hosted signal sent to an existing notification or ingestion system.
- The page has no feed or webhook and changes relatively infrequently.

Choose another interface when:

- The URL is unknown and data must be discovered across the web: use a search API.
- You need site-wide link discovery, complete content archives, or batch extraction: use a crawler.
- The source already has a reliable webhook, RSS feed, or database CDC: consume the native event.
- You need second-level market data or another high-frequency stream: polling a web page is the wrong interface.

The tradeoff is straightforward. changedetection.io saves the cost of repeatedly crawling unchanged content, but reliable selectors, notifications, and downstream extraction boundaries remain your responsibility. As a signal layer it is excellent; as an attempted combination of search, crawler, and database, it becomes difficult to verify.

## References

- [changedetection.io repository and README](https://github.com/dgtlmoon/changedetection.io)
- [Official Docker Compose configuration](https://github.com/dgtlmoon/changedetection.io/blob/master/docker-compose.yml)
- [CSS Selector help](https://github.com/dgtlmoon/changedetection.io/wiki/CSS-Selector-help)
- [JSON Selector Filter help](https://github.com/dgtlmoon/changedetection.io/wiki/JSON-Selector-Filter-help)
- [Playwright content fetcher](https://github.com/dgtlmoon/changedetection.io/wiki/Playwright-content-fetcher)
- [Browser Steps](https://github.com/dgtlmoon/changedetection.io/wiki/Browser-Steps)
- [Notification configuration notes](https://github.com/dgtlmoon/changedetection.io/wiki/Notification-configuration-notes)
