---
title: "Zyte Deep Dive: From Scrapy Development and Anti-Bot Fetching to Scrapy Cloud"
date: 2026-08-22
category: tech
type: deep-dive
tags: [zyte, scrapy, web-scraping, anti-bot, cloud]
lang: en
tldr: "Scrapy owns crawl flow and data models, Zyte API handles fetching, browsers, and anti-bot infrastructure, and Scrapy Cloud adds deployment, scheduling, and output; each layer can be adopted independently."
description: "A Scrapy-project lifecycle tour of Zyte API, Automatic Extraction, and Scrapy Cloud, including minimal examples, cost and vendor lock-in, and compliance boundaries."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-zyte-api-scrapy-cloud)

[Scrapy](https://docs.scrapy.org/en/latest/) is an open-source Python crawling framework. [Zyte API](https://docs.zyte.com/zyte-api/usage/) and [Scrapy Cloud](https://docs.zyte.com/scrapy-cloud/) are commercial Zyte services. Treating all three as one product creates unnecessary confusion. Scrapy can be entirely self-hosted, Zyte API can be called from other HTTP clients, and Scrapy Cloud runs workloads without deciding which pages your crawler should visit.

This article follows the lifecycle of a Scrapy project: write a spider locally, hand difficult downloads to Zyte API, consider Automatic Extraction where selectors become expensive, and only then decide whether to deploy to Scrapy Cloud. That sequence also exposes the responsibility, cost, and lock-in at each layer.

## Stage one: build a testable crawl in Scrapy

Scrapy's central job is not bypassing blocks. It manages requests, responses, scheduling, deduplication, parsing, and item pipelines. [The official overview defines it as a high-level framework for crawling sites and extracting structured data](https://docs.scrapy.org/en/latest/intro/overview.html). Keeping CSS selectors, pagination rules, and output schemas in the spider preserves testable application logic even if the proxy provider or deployment platform changes later.

Start with a test site that needs neither authentication nor circumvention of access restrictions:

```python
import scrapy


class QuotesSpider(scrapy.Spider):
    name = "quotes"
    start_urls = ["https://quotes.toscrape.com/"]

    def parse(self, response):
        for quote in response.css("div.quote"):
            yield {
                "text": quote.css("span.text::text").get(),
                "author": quote.css("small.author::text").get(),
            }

        next_url = response.css("li.next a::attr(href)").get()
        if next_url:
            yield response.follow(next_url, self.parse)
```

Run `scrapy crawl quotes -O quotes.jl` to validate selectors and pagination locally. Configure considerate concurrency and delays, and save failed samples before labeling a parsing error as an anti-bot failure. If direct Scrapy downloads are reliable for a static site, adding a browser or proxy cost to every page buys little.

Selenium has a different role. It drives a browser you operate, which is useful for reproducing interactions and debugging. Scrapy is better suited to scheduling many URLs, retrying them, and moving results through a data pipeline. Self-hosted Selenium also leaves browser versions, resource consumption, proxy quality, and block detection to your team. Zyte API turns the fetching infrastructure into a remote API, but it does not replace the spider's navigation logic.

## Stage two: send only difficult fetches through Zyte API

After installing `scrapy-zyte-api`, existing Scrapy requests can retain their callbacks. Keep the API key in an environment variable rather than `settings.py` or version control:

```python
# settings.py
import os

ADDONS = {"scrapy_zyte_api.Addon": 500}
ZYTE_API_KEY = os.environ["ZYTE_API_KEY"]
ZYTE_API_TRANSPARENT_MODE = True
```

```python
import scrapy


class ProductSpider(scrapy.Spider):
    name = "product"

    async def start(self):
        yield scrapy.Request(
            "https://example.com/product/123",
            meta={"zyte_api_automap": {"browserHtml": True}},
        )

    def parse(self, response):
        yield {"title": response.css("h1::text").get()}
```

[Zyte's integration examples](https://docs.zyte.com/zyte-api/usage/examples.html) call this transparent mode: Scrapy still creates the request, while Zyte API becomes the downloader. Ask for `httpResponseBody` when a page does not need JavaScript. Request `browserHtml` and browser actions only when you need rendering, scrolling, screenshots, or background-request capture. [HTTP HTML and browser HTML can produce different DOMs](https://docs.zyte.com/zyte-api/usage/http.html), so switching inputs requires rerunning selector tests.

This layer mainly removes the operational work of proxy pools, browser fleets, retry policies, geolocation, and block handling. It is not permission to access any site, nor does it keep selectors from changing. A useful action tonight is to list the spider's failed URLs, route only domains that need rendering or encounter frequent blocks through Zyte API, keep the rest on direct downloads, and then compare success rate and cost.

## Stage three: decide whether Automatic Extraction should replace selectors

[Automatic Extraction](https://docs.zyte.com/zyte-api/usage/extract/spiders.html) remains a current Zyte API feature. It returns predefined structures for products, articles, job postings, forum threads, page content, and other supported types, and also supports custom attributes. Its input can be an HTTP response, browser HTML, or HTML supplied by the caller. The documentation describes HTTP as generally faster and cheaper, while a browser source is more suitable for JavaScript-heavy pages.

A Scrapy request can ask directly for a structured product:

```python
yield scrapy.Request(
    "https://example.com/product/123",
    meta={"zyte_api": {"product": True}},
    callback=self.parse_product,
)

def parse_product(self, response):
    product = response.raw_api_response["product"]
    yield {"name": product.get("name"), "price": product.get("price")}
```

This is attractive when page layouts vary, selector maintenance is expensive, and the desired data fits an official schema. It is a poor fit when fields are highly specific, results must map precisely to source nodes, every value must be explainable, or current selectors are already cheap and stable. Automatic Extraction adds extraction charges, and its schema and response semantics create another vendor lock-in point. Do not compare it solely by lines of CSS avoided: save sampled source HTML, structured results, and human-reviewed expected values, then measure missing and incorrect fields.

## Stage four: deploy, schedule, and retrieve data with Scrapy Cloud

Scrapy Cloud is a managed runtime, not another name for Zyte API. A Scrapy project using direct downloads, Zyte API, or another service can run there. Conversely, Zyte API does not require Scrapy Cloud. The services even have separate credentials, a distinction [called out in the Scrapy Cloud API documentation](https://docs.zyte.com/scrapy-cloud/usage/reference/http/).

The official workflow uses the `shub` CLI:

```bash
python -m pip install --upgrade shub
shub login
shub deploy YOUR_SCRAPY_CLOUD_PROJECT_ID
```

The [deployment guide](https://docs.zyte.com/web-scraping/tutorials/main/cloud.html) configures a Scrapy Cloud project and runtime stack. After deployment, a spider can start from the dashboard, Jobs API, or a periodic schedule. Each execution is a job and can receive spider arguments and setting overrides. A daily run and an ad hoc backfill can therefore share code instead of accumulating cron scripts on a server.

Items yielded by the spider enter Scrapy Cloud storage. The [download documentation](https://docs.zyte.com/scrapy-cloud/usage/items/download.html) covers dashboard, URL, and API retrieval, with CSV, JSON, JSON Lines, and XML outputs. A production pipeline should not end with a manual dashboard download. Have a downstream job fetch items by job ID, write them to your own store, and mark them consumed only after that succeeds. This creates a repeatable handoff.

Scrapy Cloud lock-in sits mostly in deployment configuration, schedules, job metadata, the Items API, and add-ons. A team that already runs Kubernetes, a scheduler, centralized logging, and object storage may get better consistency from self-hosted workers. A team that lacks reliable spider execution and observability, rather than another infrastructure project, can remove a layer of maintenance with Scrapy Cloud.

## Cost and responsibility boundaries

Zyte does not have one flat cost. Under the [current Zyte API pricing documentation](https://docs.zyte.com/zyte-api/pricing.html), request cost depends on the target site, HTTP versus browser fetching, and features such as actions, screenshots, and automatic extraction; only successful responses are billed, and the service assigns website tiers that may change. Scrapy Cloud instead prices execution units and plan capabilities, while [retention, maximum run time, scheduling, and Docker availability also vary by plan](https://docs.zyte.com/scrapy-cloud/pricing.html). A budget should therefore separate fetching requests from the execution environment instead of deriving a per-page figure from one monthly total.

Responsibility is divided as well:

| Layer | Primary owner | What it does not decide for you |
| --- | --- | --- |
| Scrapy spider | Development team | Whether data may be collected, field correctness, downstream use |
| Zyte API | Zyte-managed fetching service | Your legal basis, permissions, retention, and data governance |
| Automatic Extraction | Zyte-managed extraction service | Whether every field matches business meaning or is error-free |
| Scrapy Cloud | Zyte-managed runtime and storage | Spider logic, external warehouse, and the complete workflow |

Zyte's [compliant web scraping checklist](https://www.zyte.com/learn/compliant-web-scraping-checklist/) highlights non-public data, explicitly accepted site terms, copyright, personal data, IP sourcing, and external data use. A commercial anti-bot service does not transfer those judgments to the vendor. If any item raises concern, reduce scope, record provenance and purpose, and have counsel familiar with the relevant jurisdictions review it before testing whether a restriction can be bypassed.

## Overall trade-off

The most sensible way to adopt Zyte is to buy back operational time one layer at a time. Keep crawl and data logic in Scrapy. Add Zyte API when direct fetching is unreliable. Evaluate Automatic Extraction when selector maintenance is expensive. Add Scrapy Cloud when reliable execution, schedules, and a job-data interface are missing.

This stack fits teams with existing Python spiders, uneven target difficulty, and no desire to operate proxy pools and browser fleets. A small static site, a one-off script, or a team with a mature container platform may need only Scrapy. The important choice is not buying the whole stack at once; it is retaining raw inputs and measuring each layer separately so every outsourced responsibility still has an exit boundary.

## References

- [Scrapy documentation](https://docs.scrapy.org/en/latest/)
- [Zyte API usage documentation](https://docs.zyte.com/zyte-api/usage/)
- [Zyte API HTTP requests](https://docs.zyte.com/zyte-api/usage/http.html)
- [Zyte API browser automation](https://docs.zyte.com/zyte-api/usage/browser.html)
- [Zyte API Automatic Extraction](https://docs.zyte.com/zyte-api/usage/extract/spiders.html)
- [Zyte API pricing](https://docs.zyte.com/zyte-api/pricing.html)
- [Deploy and run on Scrapy Cloud](https://docs.zyte.com/web-scraping/tutorials/main/cloud.html)
- [Scrapy Cloud jobs](https://docs.zyte.com/scrapy-cloud/usage/jobs/)
- [Downloading data from Scrapy Cloud](https://docs.zyte.com/scrapy-cloud/usage/items/download.html)
- [Scrapy Cloud pricing](https://docs.zyte.com/scrapy-cloud/pricing.html)
- [Zyte terms of service](https://www.zyte.com/terms-and-services/)
- [Zyte compliant web scraping checklist](https://www.zyte.com/learn/compliant-web-scraping-checklist/)
