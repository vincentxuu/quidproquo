---
title: "AgentQL Complete Guide: Semantic Web Extraction and Playwright Automation"
date: 2026-08-21
category: ai
type: guide
tags: [agentql, web-scraping, browser-automation, playwright, structured-output, ai-agent]
lang: en
tldr: "AgentQL replaces brittle CSS and XPath selectors with queries shaped like the data you want: `query_data` returns structured values, while `query_elements` returns interactive Playwright locators. The public Starter plan lists 50 free API calls per month, but its payment, hard-stop, and remote-browser reset rules still need to be verified in Billing."
description: "Learn AgentQL query syntax, structured extraction, local and remote Playwright usage, debugging, pricing boundaries, and how AgentQL differs from Crawl4AI, AutoScraper, and Browser Use."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-agentql-semantic-web-extraction)

[AgentQL](https://github.com/tinyfish-io/agentql) is a toolkit for web extraction and browser automation. You describe a target with semantic fields such as `product_name` or `add_to_cart_btn`, then use the result through its Python or JavaScript SDK, REST API, or Playwright. You still own the workflow, error handling, and data validation. AgentQL handles the narrower question: which data or element on this page matches the description?

That division of responsibility matters. AgentQL is neither a whole-site crawler nor a browser agent that independently plans a task. It is closer to a semantic locator layer on top of Playwright. When a redesign changes the DOM but preserves the function and meaning of a control, a query may keep working without an immediate CSS-selector rewrite.

This guide follows one path from understanding to implementation: define the output shape, decide whether to retrieve data or interactive elements, and only then add remote browsers, debugging, and cost controls. Feature and pricing details reflect the official pages available on August 21, 2026.

## Start with the AgentQL query

An AgentQL query resembles GraphQL without colons or commas, but it does not query a fixed schema. Field names are free-form. The backend uses their names, page content, hierarchy, and parenthetical hints to locate a target. The [official query syntax documentation](https://docs.agentql.com/agentql-query/query-intro) defines four structures you will use repeatedly:

```text
{
    product_category
    products[] {
        name
        price(as a float, or null if not present)
        add_to_cart_btn(the button inside this product card)
    }
}
```

- `{ ... }` encloses the query.
- `products[]` requests a list of similar items.
- Nested blocks express structural relationships on the page.
- `( ... )` supplies semantic context and can state the expected format or missing-value behavior.

Put one term on each line and do not add commas. The documentation recommends lowercase names with underscores, `_btn` for clickable controls, and `_box` for inputs. These are not HTML attributes. They are conventions that make the intent less ambiguous.

Do not turn a parenthetical hint into a long prompt. If a page has two “Sign in” controls, first add hierarchy such as `header { sign_in_btn }` or `login_form { sign_in_btn }`, then add one short description if ambiguity remains. Type instructions are hints rather than a static type guarantee. The [official type-hinting example](https://docs.agentql.com/accuracy/type-hinting) asks for a float or `null` so that an unrated business does not unpredictably produce `No rating`, `0.0`, or an empty value.

A useful first exercise is small: open a familiar product listing and query only `products[] { name price }`. Add descriptions, types, and interactive controls one at a time after that works. A twenty-field first query is much harder to diagnose.

## `query_data` and `query_elements` serve different jobs

The same query notation can describe data and page elements, but the method determines what comes back.

Use `query_data` for extraction. It returns a Python dictionary or JavaScript object shaped like the query, ready for JSON serialization, a database, or downstream validation.

```python
import agentql
from playwright.sync_api import sync_playwright

PRODUCT_QUERY = """
{
    products[] {
        name
        price(as a float, or null if not present)
    }
}
"""

with sync_playwright() as p, p.chromium.launch(headless=True) as browser:
    page = agentql.wrap(browser.new_page())
    page.goto("https://scrapeme.live/shop/")

    data = page.query_data(PRODUCT_QUERY, mode="fast")
    for product in data["products"]:
        print(product["name"], product["price"])
```

The [official Quick Start](https://docs.agentql.com/quick-start) installs the package with `pip3 install agentql`, runs `agentql init`, and provides `AGENTQL_API_KEY`. This example launches headless Chromium. Change `headless=True` to `False` while learning so you can see the page state.

`query_elements` returns wrapped Playwright locators for clicking, filling, or inspecting elements. It is not a shortcut for data retrieval; if you only need values, `query_data` makes the contract clearer.

```python
SEARCH_QUERY = """
{
    search_products_box
}
"""

controls = page.query_elements(SEARCH_QUERY)
controls.search_products_box.fill("Charmander")
page.keyboard.press("Enter")
```

For one interactive target, `page.get_by_prompt("search input field")` is another option. Use `query_elements` when several targets have a meaningful structure. Playwright still performs the action, so its navigation, waiting, browser-context, cookie, and exception-handling concepts continue to apply.

## Moving from local Playwright to a remote browser

Local execution is the clearest starting point: Playwright launches Chromium on your machine, the AgentQL SDK wraps its `Page`, and semantic queries go to the AgentQL service. The SDK repository is MIT-licensed, but that does not make the core query service offline. Queries require an API key and consume service allowance.

The [official remote-browser guide](https://docs.agentql.com/browser/remote-browser) also provides hosted browser sessions. Create a session, obtain its CDP URL, and connect with Playwright's `connect_over_cdp`:

```python
import agentql
from agentql.tools.sync_api import create_browser_session
from playwright.sync_api import sync_playwright

session = create_browser_session()
print("Watch:", session.get_page_streaming_url(0))

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp(session.cdp_url)
    page = agentql.wrap(browser.new_page())
    page.goto("https://example.com")
    print(page.query_data("""
    {
        title
        main_content
    }
    """))
    browser.close()
```

A remote session exposes CDP access, a live streaming URL, browser profiles, and proxy settings. It fits schedulers without a local browser, server-side runs that need an observable screen, or teams centralizing browser infrastructure. If local Playwright already works reliably, AgentQL does not require a migration to remote browsers; both modes use the same wrapped-page API.

Authenticated pages do not grant AgentQL new permissions. Your Playwright flow must still sign in or load a legitimately obtained session, and you remain responsible for the site's terms and data-use rules. Semantic location can find a control; it cannot authorize access.

## Debug in the right order: inspect the element before rewriting the hint

Because an AgentQL query is not a static selector, debugging cannot stop at “the syntax parsed.” A practical sequence is:

1. Run the smallest possible query against the live page in the [AgentQL Debugger Chrome extension](https://docs.agentql.com/debugger-extension).
2. Choose **Fetch Web Elements** first, then hover the result to inspect the DOM element it selected.
3. Choose **Fetch Data** and inspect the returned shape and missing values.
4. If the target is ambiguous, add nested hierarchy before adding a longer description.
5. Keep representative pages as regression fixtures and validate required fields, types, and sensible ranges.

The SDK defaults to `fast` mode. Use it for straightforward, repeated queries. If a complex page omits data, try `mode="standard"` as described in the [official Standard Mode guide](https://docs.agentql.com/accuracy/standard-mode). Standard Mode is not a universal repair mechanism. If a query conflates a header with a login form, a slower mode cannot invent the structural hint you omitted.

Timing is another failure source on dynamic pages. `query_data` waits for network idle by default, but analytics streams and infinite scrolling can prevent a useful steady state. Express “the page is ready to query” as an explicit Playwright step before running AgentQL. If the result enters a production pipeline, add schema validation in your code. Semantic queries reduce locator maintenance; they do not eliminate incorrect data.

## Free allowance and cost: known prices, unknown stop behavior

The [AgentQL pricing page](https://www.agentql.com/pricing) listed two free entry points on the verification date:

| Entry point | Published allowance | Published constraints |
|---|---:|---|
| Trial | 300 API calls and 1 remote-browser hour | 10 calls/minute and 1 concurrent remote session; explicitly says no credit card required |
| Starter | 50 free API calls per month and 10 included remote-browser hours | $0.02 per API call after the allowance, $0.12 per remote-browser hour, and 5 concurrent sessions |

The table does not establish three operational facts: whether Starter always works without a payment method, whether exceeding an allowance hard-stops or enters a billable state, and the precise reset period for the included browser hours. The public page says both `$0/monthly` and lists overage rates without documenting those controls completely.

Before scheduling a recurring job, open the authenticated Billing page and verify its payment method, spending cap, remaining balance, and browser-hour rules. Test the workload against a fixed sample under a low allowance first. Keep API calls and remote-browser time as separate cost lines; “50 calls per month” does not describe browser infrastructure charges.

## Boundaries with four neighboring tools

| Tool | What it primarily handles | Why that is not AgentQL |
|---|---|---|
| Native Playwright selectors | Reproducible location by role, text, CSS, or XPath | Most deterministic and fully local, but you maintain changes to page structure |
| [Crawl4AI](/posts/ai/2026-08-21-crawl4ai-complete-guide-en) | Fetching pages, cleaning Markdown, whole-site crawling, and extraction strategies | It owns content acquisition and normalization; AgentQL targets semantic data or controls on the current page |
| AutoScraper | Learning local extraction rules from example values | It is an example-driven library; AgentQL uses free-form queries backed by a hosted service |
| Browser Use | Having a model observe a page and plan a multi-step browser task | It decides what to do next; AgentQL finds the element or data shape specified by the developer |

AgentQL fits pages whose fields and interaction intent remain stable while their DOM changes, such as extracting the same product fields across several stores or reducing locator maintenance inside an existing Playwright workflow. It is a poor fit when processing must stay offline, data cannot be sent to an external service, the job requires crawling an entire site, every location must be reproduced by a fixed selector, or the task has not yet been decomposed into explicit steps.

## The overall trade-off

AgentQL raises a selector from “how the DOM is written” to “what this element does.” In exchange, location no longer depends only on local rules; API allowance, service availability, and data governance join the design. The strongest pattern is not to rewrite an entire automation flow in natural language. Keep control flow in Playwright and give AgentQL the brittle locations that are hardest to maintain or reuse across sites.

Converge each query against three to five representative pages in the Debugger, move that same query into the SDK, validate its output before database writes, and verify Billing hard caps before enabling a schedule. Those concrete checks are what turn AgentQL from a compelling demo into a maintainable data workflow.

## References

- [AgentQL official repository](https://github.com/tinyfish-io/agentql)
- [AgentQL Query Introduction](https://docs.agentql.com/agentql-query/query-intro)
- [Best Practices for AgentQL Queries](https://docs.agentql.com/agentql-query/best-practices)
- [Scraping data with query_data](https://docs.agentql.com/scraping/scraping-data-sdk)
- [AgentQL Python Page API](https://docs.agentql.com/python-sdk/api-references/agentql-page)
- [AgentQL Debugger Extension](https://docs.agentql.com/debugger-extension)
- [AgentQL Remote Browser](https://docs.agentql.com/browser/remote-browser)
- [AgentQL Pricing](https://www.agentql.com/pricing)
