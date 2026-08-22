---
title: "Scrapy Deep Dive: A Self-Hosted Crawler from Engine to Pipeline"
date: 2026-08-22
category: tech
type: deep-dive
tags: [scrapy, web-scraping, python, crawler, self-hosted]
lang: en
tldr: "Scrapy separates crawling into the Engine, Scheduler, Downloader, Spider, Item Pipeline, and middleware; it fits high-volume, rule-driven HTTP crawling where you need control over scheduling, throttling, retries, and storage."
description: "A component-by-component guide to Scrapy's Engine, Scheduler, Downloader, Spider, Item Pipeline, and middleware, including self-hosting, robots.txt, throttling, retries, and the choice between Selenium and managed services."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-scrapy-crawler-framework)

[Scrapy](https://docs.scrapy.org/en/latest/) is a Python framework for crawling websites and extracting structured data. It is more than a thin wrapper around “send one HTTP request, then parse one HTML page.” It is an asynchronous processing pipeline with explicit boundaries for scheduling, downloading, parsing, cleaning, and storage. Those boundaries begin to matter when a one-page script becomes a scheduled crawler that must handle failures, rate limits, and resumable jobs.

This article follows one component spine: Engine, Scheduler, Downloader, Spider, Item Pipeline, and the two middleware chains. It then puts those components into a self-hosted deployment with robots.txt handling, throttling, retries, and operational boundaries. The final section explains when Selenium or a managed service such as Bright Data or Zyte is a better fit.

## Engine: coordinate without encoding site rules

According to the [official architecture overview](https://docs.scrapy.org/en/latest/topics/architecture.html), the Execution Engine controls data flow among Scrapy's components. A Spider creates initial Requests and the Engine passes them to the Scheduler. The Scheduler selects another Request, which the Engine sends to the Downloader. When a Response returns, the Engine delivers it to the Spider, routes new Requests back to the Scheduler, and sends Items into the Pipeline.

```text
Spider -> Engine -> Scheduler -> Engine
                  ^              |
                  |              v
Item Pipeline <- Spider <- Middleware <- Downloader
```

The Engine coordinates; it should not know which CSS selector contains a product name. Site-specific rules belong in the Spider, reusable HTTP behavior belongs in downloader middleware, and validation or persistence belongs in item pipelines. Following that boundary keeps a site redesign from forcing changes throughout the project.

## Scheduler: choose the next URL, not merely store a list

The [Scheduler](https://docs.scrapy.org/en/latest/topics/scheduler.html) receives Requests from the Engine, stores them in memory or on disk, and returns them according to priority. The default Scheduler also works with a duplicate filter so that an equivalent Request does not repeatedly enter the queue. Request `priority`, queue classes, and concurrency settings all affect observed download order.

For an interruptible job, specify `JOBDIR` at startup. Scrapy can then persist pending Requests and duplicate-filter state for a clean stop and resume. The documentation warns that the files inside a job directory are implementation details; application code should not read or modify them directly.

```bash
scrapy crawl catalog -s JOBDIR=.scrapy-jobs/catalog
```

Do not mistake this Scheduler for a distributed queue. Scrapy explicitly states that it [does not include a built-in multi-server crawling facility](https://docs.scrapy.org/en/latest/topics/practices.html#distributed-crawls). For horizontal scaling, partition URLs or job scope first, then use an external scheduler to assign partitions to workers.

## Downloader: the asynchronous I/O layer

The Downloader turns a Request into a Response. Scrapy uses event-driven networking, so a process can work on other downloads while one remote server is responding. That differs fundamentally from a loop that blocks on each `requests.get()` call.

This layer handles HTTP, not page meaning. Proxies, cookies, redirects, compression, caching, and retry behavior belong in downloader middleware. Scattering proxy rotation and status-code checks across Spider callbacks produces inconsistent behavior as a project grows.

## Spider: site rules and navigation strategy

A Spider defines where a crawl starts, which pages to follow, and how a Response becomes an Item. The following minimal example runs as-is against Scrapy's public demonstration site, follows pagination, and writes JSON Lines.

```python
# quotes_spider.py
import scrapy


class QuotesSpider(scrapy.Spider):
    name = "quotes"
    allowed_domains = ["quotes.toscrape.com"]
    start_urls = ["https://quotes.toscrape.com/"]

    custom_settings = {
        "ROBOTSTXT_OBEY": True,
        "AUTOTHROTTLE_ENABLED": True,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 2,
        "DOWNLOAD_DELAY": 1.0,
    }

    def parse(self, response):
        for quote in response.css("div.quote"):
            yield {
                "text": quote.css("span.text::text").get(),
                "author": quote.css("small.author::text").get(),
                "url": response.url,
            }

        next_href = response.css("li.next a::attr(href)").get()
        if next_href:
            yield response.follow(next_href, callback=self.parse)
```

```bash
python -m pip install scrapy
scrapy runspider quotes_spider.py -O quotes.jsonl
```

The Spider should answer “how do I navigate this site?” and “what do I extract from this page?” Field cleanup, required-field validation, and database writes belong in the next component.

## Item Pipeline: turn extraction into trustworthy data

The [Item Pipeline](https://docs.scrapy.org/en/latest/topics/item-pipeline.html) processes Items from a Spider in configured order. Typical uses include cleaning HTML, validating fields, removing duplicates, and persisting records. Each component returns an Item to keep it moving or raises `DropItem` to stop processing that record.

```python
# pipelines.py
from scrapy.exceptions import DropItem


class RequiredFieldsPipeline:
    def process_item(self, item):
        item["text"] = item.get("text", "").strip()
        item["author"] = item.get("author", "").strip()
        if not item["text"] or not item["author"]:
            raise DropItem("missing quote text or author")
        return item
```

```python
# settings.py
ITEM_PIPELINES = {
    "myproject.pipelines.RequiredFieldsPipeline": 300,
}
```

Pipeline numbers define order. Splitting “normalize, validate, deduplicate, store” into small components is easier to test and replace than maintaining one class that performs every operation.

## Middleware: place shared policy at data-flow boundaries

Scrapy has two middleware chains with similar names but different positions.

- [Downloader middleware](https://docs.scrapy.org/en/latest/topics/downloader-middleware.html) sits between the Engine and Downloader. It can change an HTTP request before transmission or inspect a response or download exception. Proxies, authentication, retries, and robots.txt handling sit on this side.
- [Spider middleware](https://docs.scrapy.org/en/latest/topics/spider-middleware.html) sits between the Engine and Spider. It can inspect Responses entering a Spider and Requests or Items leaving it. Depth limits and cross-Spider output policies fit here.

Both chains are ordered, and requests and responses travel through them in opposite directions. Before adding custom middleware, inspect the built-in middleware order and choose an insertion point deliberately; the numeric order is behavior, not decoration.

## Self-hosting: make each crawl an observable job

The smallest deployment unit can be `scrapy crawl catalog` in a container or virtual machine. Start it with cron, a systemd timer, a Kubernetes Job, or an existing work queue. Send output through Feed Exports or a Pipeline, and collect stdout in centralized logging. Preserve the finish reason, HTTP status distribution, retry count, dropped Item count, and output count for each run. A process exiting normally does not prove that its dataset is complete.

Give every resumable execution its own persistent `JOBDIR`; never share one directory between running processes. The [official pause-and-resume guide](https://docs.scrapy.org/en/latest/topics/jobs.html) also notes that callbacks must be serializable and that state such as cookies may not persist completely between runs.

An external scheduler can launch individual Spiders. Scrapyd is an option when you want a remote scheduling API. For one large crawl across machines, partition URLs reproducibly and make each worker write to storage with stable unique keys. Scrapy itself does not supply cross-host coordination or global exactly-once processing.

## robots.txt, throttling, and the anti-bot boundary

Self-hosting is not permission to ignore site policy. Confirm that automated access, the terms of service, and the intended data use are allowed. Set an identifying `USER_AGENT` with a way for site operators to contact you. Scrapy's [`RobotsTxtMiddleware`](https://docs.scrapy.org/en/latest/topics/downloader-middleware.html#robotstxtmiddleware) filters requests forbidden by robots.txt only when `ROBOTSTXT_OBEY` is enabled.

`DOWNLOAD_DELAY` and `CONCURRENT_REQUESTS_PER_DOMAIN` establish hard boundaries. [AutoThrottle](https://docs.scrapy.org/en/latest/topics/autothrottle.html) adjusts the delay dynamically from the latency of each download slot while still respecting those limits. Begin with conservative settings over a small scope, observe remote latency and errors, and increase throughput gradually. “Not blocked yet” is not a safety signal.

Scrapy's throttling, cookie, and proxy middleware can manage HTTP traffic. They do not automatically solve JavaScript challenges, browser fingerprints, or interactive verification. When those mechanisms appear, look for a public API, data export, or explicit authorization first. Circumventing access controls is not an ordinary middleware configuration task.

## Failure retries: retry only temporary problems

The built-in [`RetryMiddleware`](https://docs.scrapy.org/en/latest/topics/downloader-middleware.html#retrymiddleware) reschedules Requests for temporary failures such as connection timeouts and selected server errors. A retry is not a success guarantee and should not conceal parser defects. Separate failures into three groups:

- Temporary network or server failure: retry a bounded number of times, then record the URL and reason.
- Rate limiting: reduce concurrency and frequency and honor `Retry-After`; tight retry loops add load.
- Missing selectors or invalid data: capture a sample and alert for a code change instead of repeating the same Request blindly.

Give every Item a stable unique key and use upsert or an equivalent write operation. Network retries and resumed jobs may process a page again; idempotent writes are safer than assuming exactly one execution.

## Choosing Scrapy, Selenium, or a managed service

| Option | Best fit | Main cost |
|---|---|---|
| [Scrapy](https://scrapy.org/) | High-volume, rule-driven HTML or APIs, link traversal, scheduled crawls | You operate scheduling, proxies, monitoring, and selectors |
| [Selenium](https://www.selenium.dev/documentation/) | JavaScript execution, form interaction, or reproducing a real browser flow | Browser processes are heavier; concurrency and debugging cost more |
| [Bright Data](https://docs.brightdata.com/) | A team wants to procure proxy and managed extraction infrastructure | Vendor interfaces and plans require separate cost and data-governance review |
| [Zyte](https://docs.zyte.com/) | A team wants to retain a Scrapy workflow while outsourcing some access and extraction | External integration, data-flow review, and vendor dependency |

Do not start a browser for a static page. First inspect the raw Response in Scrapy Shell. If it contains the target data, stay with Scrapy. Move only the steps that require client-side execution, clicks, or interactive login to Selenium. When the main problem is no longer parsing HTML but operating proxies, geographic endpoints, browser infrastructure, and block handling, a managed service may save operational time. That is a procurement and governance choice, not a direct Scrapy upgrade.

## Overall trade-off

Scrapy trades an explicit component model for control. The Engine connects data flow, the Scheduler manages pending Requests, the Downloader performs I/O, the Spider holds site knowledge, the Pipeline protects data quality, and middleware centralizes shared policy. It fits high-volume crawls that can be expressed as HTTP, selectors, and link rules.

To start tonight, run the minimal Spider, then add `ROBOTSTXT_OBEY`, conservative throttling, output validation, and failure observability in that order. Prove that one job on one machine is repeatable, resumable, and diagnosable before adding distributed execution or a managed anti-bot service.

## References

- [Scrapy official repository](https://github.com/scrapy/scrapy)
- [Scrapy architecture overview](https://docs.scrapy.org/en/latest/topics/architecture.html)
- [Scrapy scheduler](https://docs.scrapy.org/en/latest/topics/scheduler.html)
- [Scrapy spiders](https://docs.scrapy.org/en/latest/topics/spiders.html)
- [Scrapy item pipeline](https://docs.scrapy.org/en/latest/topics/item-pipeline.html)
- [Scrapy downloader middleware](https://docs.scrapy.org/en/latest/topics/downloader-middleware.html)
- [Scrapy spider middleware](https://docs.scrapy.org/en/latest/topics/spider-middleware.html)
- [Scrapy AutoThrottle](https://docs.scrapy.org/en/latest/topics/autothrottle.html)
- [Scrapy jobs: pausing and resuming crawls](https://docs.scrapy.org/en/latest/topics/jobs.html)
- [Scrapy common practices](https://docs.scrapy.org/en/latest/topics/practices.html)
- [Selenium documentation](https://www.selenium.dev/documentation/)
- [Bright Data documentation](https://docs.brightdata.com/)
- [Zyte documentation](https://docs.zyte.com/)
