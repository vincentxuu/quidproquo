---
title: "Browser Use Complete Guide: The Agent Loop Behind Browser Automation"
date: 2026-08-21
category: ai
type: guide
tags: [browser-use, browser-automation, ai-agent, playwright, python]
lang: en
tldr: "Browser Use combines browser state, model decisions, and actions such as click, type, and extract into a repeatable loop. The open-source package favors custom tools and execution control; Cloud manages browsers, profiles, proxies, and concurrent work."
description: "Learn the Browser Use agent loop, Python setup, structured output, authentication state, custom tools, security boundaries, open-source versus Cloud deployment, costs, and failure handling."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-browser-use-complete-guide)

[Browser Use](https://github.com/browser-use/browser-use) is a Python framework that lets a language model operate a browser. A developer supplies a task; the agent repeatedly reads page state, chooses an action, executes it, and checks the result until it finishes or reaches a stop condition.

It is not another CSS-selector library, nor is it merely Playwright wrapped in one natural-language call. Browser Use owns the decision about what to do next. Selectors, CDP, browser processes, and the website remain execution constraints underneath it. This article uses the official repository, open-source documentation, and Cloud API V4 documentation available on August 21, 2026. It did not sign into paid Cloud or submit forms against real accounts.

## The core is observe, decide, act, and verify

A Browser Use task can be reduced to this loop:

```text
task
  → read page state and available elements
  → LLM selects click / type / scroll / extract / done
  → browser executes the action
  → new state, tool result, or error returns to context
  → continue until completion or a limit is reached
```

This differs from [AgentQL](/posts/ai/2026-08-21-agentql-semantic-web-extraction-en). AgentQL lets a developer describe the element or data shape to find; Browser Use lets a model choose the next action in a multi-step flow. When the path is fixed, selectors are stable, and every step can be specified in advance, direct Playwright code is usually cheaper and more predictable.

## Install and run the first local Agent

The current official README requires Python 3.11 or newer and installs with `uv add browser-use` or `pip install browser-use`. The example below uses Browser Use's hosted model gateway. The [official model list](https://github.com/browser-use/browser-use/blob/main/browser_use/llm/README.md) also documents providers including OpenAI, Anthropic, Google, Groq, and Ollama.

```bash
uv init browser-use-demo
cd browser-use-demo
uv add browser-use python-dotenv
```

```bash
export BROWSER_USE_API_KEY="your-key"
```

```python
import asyncio

from browser_use import Agent, Browser, ChatBrowserUse


async def main() -> None:
    browser = Browser(
        headless=True,
        allowed_domains=["docs.browser-use.com"],
    )
    agent = Agent(
        task=(
            "Open the Browser Use documentation and return the titles "
            "of the Agent and Browser quick-start pages. Do not leave the domain."
        ),
        llm=ChatBrowserUse(model="bu-2-0-mini-preview"),
        browser=browser,
    )

    history = await agent.run(max_steps=12)
    print(history.final_result())
    print(history.urls())
    print(history.errors())


if __name__ == "__main__":
    asyncio.run(main())
```

`max_steps` is the first boundary on cost and runaway behavior. `allowed_domains` restricts browser navigation. For the first run, set `headless=False` and watch what the model actually clicks; switch back to headless mode after the flow is understood.

This is a minimal example assembled from the documented API shape. It was not executed against an external model for this article. The package changes quickly, so pin a version and rerun the task against your own target site before deployment.

## Do not keep only the final sentence

`agent.run()` returns an `AgentHistoryList`. In addition to `final_result()`, the official [output documentation](https://docs.browser-use.com/open-source/customize/agent/output-format) exposes visited URLs, action names, errors, screenshots, model outputs, completion status, and duration.

A production workflow should retain at least:

- The task, model, and package version.
- The final result and `is_successful()` value.
- A summary of visited URLs, actions, and errors.
- Step count, total duration, and external tool cost.
- Browser and profile settings that affect the result.

An agent saying that it is done is not proof of business success. Check for a confirmation ID after a form submission, verify a downloaded file, and validate a schema before storing extracted data.

## Constrain structured output with Pydantic

Free-form text is convenient for people and awkward for databases. The open-source Agent accepts a Pydantic model through `output_model_schema`:

```python
from pydantic import BaseModel, HttpUrl


class DocPage(BaseModel):
    title: str
    url: HttpUrl


class DocResult(BaseModel):
    pages: list[DocPage]


agent = Agent(
    task="Return the Agent and Browser quick-start documentation pages.",
    llm=ChatBrowserUse(model="bu-2-0-mini-preview"),
    browser=browser,
    output_model_schema=DocResult,
)

history = await agent.run(max_steps=12)
result = history.structured_output
```

Schema validation proves the response shape, not the truth of page content. Validate URLs, prices, dates, and identifiers against their sources. Preserve source URLs and retrieval time when they matter.

## Treat authentication state as a secret

Browser Use can connect to system Chrome, load Playwright-format storage state, or use a persistent Cloud profile. The official [authentication guide](https://docs.browser-use.com/open-source/customize/browser/authentication) also recommends restricting navigation with `allowed_domains` and disabling vision on sensitive pages so screenshots are not sent to the model.

```python
browser = Browser(
    storage_state="session.json",
    allowed_domains=["portal.example.com", "*.okta.com"],
)

agent = Agent(
    task="Open the account page and report whether the subscription is active.",
    browser=browser,
    llm=ChatBrowserUse(model="bu-2-0-mini-preview"),
    use_vision=False,
    sensitive_data={
        "https://portal.example.com": {
            "account_password": "read-from-secret-manager",
        }
    },
)
```

`session.json` may contain cookies and local-storage tokens; never commit it. Put an external policy around high-impact actions as well. Stop before payment, deletion, application submission, or public posting and ask a person to confirm the exact operation.

## Custom tools own actions outside the browser

Browser Use `Tools` can connect a task to a database, internal API, or human approval. Keep tools narrow. Do not give an agent a universal entry point for arbitrary shell commands or SQL.

```python
from browser_use import Tools

tools = Tools()


@tools.action(description="Save a reviewed documentation URL")
def save_doc_url(title: str, url: str) -> str:
    if not url.startswith("https://docs.browser-use.com/"):
        return "Rejected: URL is outside the documentation domain"
    # Replace with a parameterized database call.
    return f"Queued for review: {title} {url}"
```

Tool results enter subsequent model context. Return only the necessary summary for large payloads; otherwise every step can resend the full content, increasing both tokens and latency.

## Open-source Agent and Cloud are deployment choices

The open-source package uses the [MIT license](https://github.com/browser-use/browser-use/blob/main/LICENSE). You operate the browser, model, proxy, monitoring, and concurrency. The package sends anonymous telemetry by default; the [official telemetry guide](https://docs.browser-use.com/development/monitoring/telemetry) documents `ANONYMIZED_TELEMETRY=false` for opting out.

Cloud API V4 puts each run in a session and creates a workspace for persistent files. Its minimum call looks like this:

```python
from browser_use_sdk.v4 import BrowserUse

client = BrowserUse()
run = client.runs.create(
    "Find the current Browser Use open-source quick-start page",
)
run = client.runs.wait_for_completion(run.id)
print(run.result)
```

Cloud also offers persistent profiles, proxies, live views, and recordings. On the current [public pricing page](https://browser-use.com/pricing), Pay As You Go has no monthly subscription. It lists browser sessions at $0.06 per hour and proxy data at $10 per GB; credits are purchased separately. Plans and prices can change, so recheck Billing before deployment.

Model tokens, agent or skill calls, browser time, proxy traffic, and failed reruns are separate cost lines. Do not estimate from one average “task price.” Measure success rate, steps, browser time, and human takeover rate on representative tasks.

## Identify the failing layer first

| Symptom | Check first | Direction |
|---|---|---|
| Button not found | DOM, iframe, page readiness | Add an explicit wait or use a more stable state |
| Same action repeats | Stop condition and tool result clarity | Lower the step limit and define completion |
| Login keeps failing | Storage state, profile, SSO domains | Rebuild auth state and scope credentials by domain |
| CAPTCHA or challenge | IP, fingerprint, action frequency | Slow down or use a legitimate source; do not promise bypass |
| Correct shape, wrong content | Schema only validates shape | Preserve sources and apply business validation |
| Cost spikes | Steps, model, browser time, retries | Set budgets, timeouts, and task-level monitoring |

For main-content extraction from a known URL, start with Crawl4AI or a normal HTTP fetch. For UI tests with stable selectors, start with Playwright. Browser Use is most valuable when page paths branch, decisions span multiple pages, and the next action is difficult to encode in advance.

## The overall trade-off

Browser Use turns “let a model inspect a page and choose the next action” into a programmable agent loop. The trade-off is that outcomes depend on the model, page state, authentication, network, and tool descriptions together. A successful demo is not a production SLA.

A reliable starting point is to restrict domains and steps, validate output with a schema, retain full history, and put high-impact side effects behind human approval. Use the open-source Agent when you need control; evaluate Cloud when you do not want to operate browser processes, proxies, and large numbers of sessions.

## References

- [Browser Use GitHub repository](https://github.com/browser-use/browser-use)
- [Browser Use Agent output format](https://docs.browser-use.com/open-source/customize/agent/output-format)
- [Browser Use authentication](https://docs.browser-use.com/open-source/customize/browser/authentication)
- [Browser Use Cloud API V4 quick start](https://docs.browser-use.com/cloud/agent/quickstart)
- [Browser Use Cloud profiles](https://docs.browser-use.com/cloud/guides/authentication)
- [Browser Use pricing](https://browser-use.com/pricing)
- [Browser Use telemetry](https://docs.browser-use.com/development/monitoring/telemetry)
