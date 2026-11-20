---
title: "Browser Use Complete Guide: The Agent Loop Behind Browser Automation"
date: 2026-08-21
category: ai
type: guide
tags: [browser-use, browser-automation, ai-agent, playwright, python]
lang: en
tldr: "Browser Use is a Python library where the model decides every step and drives a real browser. Version 1.0 (2026-11-10) replaced the engine: instead of picking click or type from a DOM list, the model writes code in a persistent Python REPL and talks raw CDP. The default model and browser are now Browser Use's cloud services, so a local browser needs Browser('chromium'); per-step actions in the run history, storage_state, and recorded replay are gone, and at runtime, remember that the model's Python runs as your user."
description: "A guide to Browser Use 1.0: the agent loop where the model writes Python each step, installation and version pinning, local versus cloud browsers, run results and the judge, structured output, logins and secrets, custom tools, the security boundary, Cloud costs, and failure diagnosis; plus the changes that most often bite when upgrading from 0.x."
draft: false
series:
  name: "AI Browser Automation"
  order: 14
---

> :globe: [中文版](/posts/ai/2026-08-21-browser-use-complete-guide)

> **Updated 2026-11-19:** this post was originally written for 0.x. Browser Use 1.0 (2026-11-10) replaced the engine, and the examples and explanations now use 1.0.6; for what changed from 0.x to 1.0, see "What to watch when upgrading from 0.x" near the end. If you still need 0.x, pin `browser-use<1` when installing.

[Browser Use](https://github.com/browser-use/browser-use) is a Python library that lets a language model drive a browser. You give it a task, and the agent decides each step, checks the result, and keeps going until it finishes or hits a stop condition.

It isn't another CSS selector library, and it isn't Playwright wrapped in a natural-language sentence. Browser Use is responsible for "what to do next"; the web page, the browser process, and the network remain the underlying conditions. This post is based on the official repository's README and [MIGRATING.md](https://github.com/browser-use/browser-use/blob/main/MIGRATING.md) (1.0.6); it didn't log into paid Cloud or submit forms on real accounts.

## The core: the model writes code, runs it, and looks at the result

A 1.0 task boils down to this loop:

```text
task
  → the model writes code in a persistent Python REPL (it can talk CDP directly and take screenshots when it needs them)
  → it runs; output or errors go back into context
  → repeat until the model calls finish(result), or the step or time limit is hit
```

In the project's words: "The model, a REPL and CDP. That's the whole agent." In 0.x, the framework first assembled the clickable elements on the page and the model picked one of click, type, or scroll each step; in 1.0 the model decides what to look at and how to act. For why it changed, see [What happened to the agent loop](/posts/ai/2026-11-19-browser-agent-loop-to-code-mode-en).

This is a different job from [AgentQL](/posts/ai/2026-08-21-agentql-semantic-web-extraction-en). AgentQL lets you specify the elements or data shape to find; Browser Use lets the model decide the next step in a multi-step flow. If the flow is fixed, selectors are stable, and every step can be written down, plain Playwright is usually cheaper and more predictable.

## Install and run the first local Agent

It requires Python 3.11 or newer, and you should **pin the exact version** (the README says "never `>=`", because releases move fast and can break APIs):

```bash
uv init --python 3.12 browser-use-demo
cd browser-use-demo
uv add 'browser-use==1.0.6'
```

Two 1.0 defaults to know first:

- **Without `llm`, it uses the `bu-4.0` model on the Browser Use gateway**, which needs `BROWSER_USE_API_KEY` (or log in with `browser-use login`). You can switch to the built-in `ChatOpenAI`, `ChatAnthropic`, or `ChatGoogle`, or a Pydantic AI model string (for example `'groq:<model>'`). LangChain chat models are no longer supported.
- **`Browser()` is a Browser Use Cloud browser.** For a local one, write `Browser('chromium')`; a cloud browser can't reach localhost or private addresses.

```python
import asyncio

from browser_use import Agent, Browser, ChatOpenAI


async def main() -> None:
    browser = Browser(
        "chromium",
        headless=True,
        allowed_domains=["docs.browser-use.com"],
    )
    agent = Agent(
        task=(
            "Open the Browser Use documentation and return the titles "
            "of the Agent and Browser quick-start pages. Do not leave the domain."
        ),
        llm=ChatOpenAI("gpt-6-luna"),  # needs OPENAI_API_KEY; omit llm to use bu-4.0
        browser=browser,
    )

    result = await agent.run(max_steps=12)
    print(result.status, result.final_result())
    print(result.cost_usd)


if __name__ == "__main__":
    asyncio.run(main())
```

`max_steps` is the first cap on cost and runaway behavior. In 1.0 a step is one model request, one piece of Python, and the default cap dropped from 0.x's 500 to 100, with a default `timeout` of 1,700 seconds as well. `allowed_domains` limits where the browser can navigate. On a first run, set `headless` to `False` to watch what the model actually does.

This is a minimal example assembled from the official API and wasn't run against an external model here. Rerun it against your own target sites before going live.

## Don't keep only the final sentence: save the run result

The result object `agent.run()` returns changed a lot in 1.0. 0.x per-step methods like `urls()`, `action_names()`, and `screenshots()` are gone, because 1.0 has no "one action per step". What to look at now:

- `result.status`: `completed`, `max_steps`, `timeout`, or `error`. Configuration errors raise before the browser starts; failures after that return `status='error'` instead of raising.
- `result.final_result()`, `result.success`: note that `is_successful()` is "the agent's own claim".
- `result.judgement`: by default, 1.0 sends one more request after each run so the same model judges it, including whether it detected a prompt injection or was blocked by a bot check. Its tokens count toward cost; turn it off with `judge=False` if you don't need it.
- `result.messages`, `result.usage`, `result.cost_usd`, and the `agent.workspace` folder. The workspace defaults to a temp directory that is kept after the run and holds page text, screenshots, and every cell's output, so delete it when you're done.

A production flow should save at least: the task, model and package versions, `status` and the final result, the judge's verdict, step count and total time, cost, and any browser settings that affect the result.

"The agent says it's done" isn't business success. After submitting a form, check the confirmation ID; after a download, verify the file exists; after extraction, validate against a schema.

## Constrain structured output with Pydantic

Free text is fine for people and bad for writing straight into a database. `output_model_schema` is kept in 1.0:

```python
from pydantic import BaseModel, HttpUrl


class DocPage(BaseModel):
    title: str
    url: HttpUrl


class DocResult(BaseModel):
    pages: list[DocPage]


agent = Agent(
    task="Return the Agent and Browser quick-start documentation pages.",
    browser=browser,
    output_model_schema=DocResult,
)

result = await agent.run(max_steps=12)
pages = result.structured_output
```

Schema validation only guarantees the shape of the output, not that the page content is right. URLs, prices, dates, and identifiers still need checking against the source; keep the page URL and capture time where it matters.

## Treat login state as a secret

1.0 removed `storage_state`. Login state is kept in one of these ways instead:

| Code | Which browser it uses |
|---|---|
| `Browser('chrome')` | The Chrome you have open, with your logins (enable `chrome://inspect/#remote-debugging` once) |
| `Browser('chrome', profile='Work')` | A new Chrome on a temporary copy of your `Work` profile; nothing is written back |
| `Browser('chromium', user_data_dir=...)` | A dedicated profile folder kept between runs |
| `Browser(cloud_profile_id=...)` | A persistent profile on Browser Use Cloud |

```python
browser = Browser(
    "chromium",
    user_data_dir="./profiles/portal",
    allowed_domains=["portal.example.com", "*.okta.com"],
)

agent = Agent(
    task="Open the account page and report whether the subscription is active.",
    browser=browser,
    use_vision=False,
    sensitive_data={
        "https://portal.example.com": {
            "account_password": "read-from-secret-manager",
        }
    },
)
```

`use_vision=False` means no screenshots reach the model. Values in `sensitive_data` are typed by the model calling `type_secret('account_password')`; domain-scoped values are typed only on matching pages; all values are masked as `<secret:account_password>` in cell output, checkpoints, tool results, and the final result. But the README is clear: "Not a sandbox: model-written Python can read the value", and screenshots and page JavaScript can reveal it too.

The `user_data_dir` folder holds cookies and tokens; don't commit it. The debugging port that `Browser('chromium')` and `Browser('chrome', profile=...)` open has no authentication, so on a shared machine other users can attach and take its logins; use a container or Cloud there. High-risk actions also need a policy outside the agent: before paying, deleting, submitting an application, or posting publicly, stop and have a person confirm the specifics.

## Custom tools own actions outside the browser

In 1.0 the model performs browser actions by writing code itself, so `Tools` is for things outside the browser: databases, internal APIs, human confirmation. Keep tools small and explicit; don't hand the agent a catch-all entry that runs arbitrary shell or SQL.

```python
from browser_use import Tools

tools = Tools()


@tools.action("Save a reviewed documentation URL")
def save_doc_url(title: str, url: str) -> str:
    if not url.startswith("https://docs.browser-use.com/"):
        return "Rejected: URL is outside the documentation domain"
    # Replace with a parameterized database call.
    return f"Queued for review: {title} {url}"
```

Connect the tools with `Agent(task=..., tools=tools)`. The parameters 0.x injected into tools (`browser_session`, `page_url`, and so on) are gone; a tool gets only what the model passes in. Tool return values enter later context, so return only the summary you need from large content.

## The security boundary: the model's code runs as you

This is the 1.0 change that needs the most attention. The REPL runs model-written Python as your user, and [MIGRATING.md](https://github.com/browser-use/browser-use/blob/main/MIGRATING.md) says plainly "This is not a sandbox": the model can read and upload any file your user can read. `allowed_domains` is likewise only "a guard for an aligned model, not a sandbox"; requests that an allowed page makes to other hosts aren't filtered. The project recommends running untrusted tasks in a container or VM.

## Open-source Agent and Cloud are deployment choices

The open-source package is [MIT licensed](https://github.com/browser-use/browser-use/blob/main/LICENSE); you maintain the browsers, models, proxies, monitoring, and concurrency yourself. The package sends anonymous telemetry by default; set `ANONYMIZED_TELEMETRY=false` to turn it off.

Browser Use now has three paths: the fully hosted Cloud agent, a CLI for Claude Code or Codex (installed as a skill with `browser-use skill install`), and the Python library covered here. Cloud API V4 needs the separate `browser-use-sdk` package; a minimal call:

```python
from browser_use_sdk.v4 import BrowserUse

client = BrowserUse()
run = client.runs.create(
    "Find the current Browser Use open-source quick-start page",
)
run = client.runs.wait_for_completion(run.id)
print(run.result)
```

Per the README, a Cloud browser costs $0.06 per hour. `result.cost_usd` covers only model, judge, and web search charges; the cloud browser and proxy are billed separately. Plans and prices change, so check [pricing](https://browser-use.com/pricing) and Billing again before going live.

Model tokens, judge requests, browser time, proxy traffic, and failed retries are separate cost lines. Don't estimate with "how much per task" alone; first record success rate, step count, browser time, and human handoff rate on representative tasks.

## Identify the failing layer first

| Symptom | Check first | What to do |
|---|---|---|
| `status='error'` | `result.error`: keys, model name, browser start failure | Usually configuration; fix what the message says |
| `status='max_steps'` or `timeout` | Whether the task has a stop condition; whether `result.partial` has intermediate results | Add completion criteria; to get intermediate results, ask the model in the task to save them with `checkpoint(..., partial=True)` |
| Can't reach localhost or the intranet | Whether you're on the default cloud browser | Switch to `Browser('chromium')` |
| Logins keep expiring | Profile, SSO domains | Rebuild the login state and restrict credential domains |
| CAPTCHA / challenge | Whether `result.judgement` flags a bot block; IP, request rate | Slow down or use a legitimate data source; don't claim it can always get through |
| Right format, wrong content | The schema only checks shape | Keep the source and validate the business result |
| Costs suddenly rise | Steps, model, judge, browser time | Set a budget, timeout, and per-task monitoring |

If the job is just extracting text from known URLs, start with Crawl4AI or a plain HTTP fetch; for UI tests with fixed selectors, start with Playwright. Browser Use is most valuable when the page path branches, decisions span pages, and the steps are hard to write down in advance. 1.0 removed 0.x's recorded replay (`rerun_history()`, `save_as_playwright_script()`), so if you need a flow that's identical every time, write it as a script yourself.

## What to watch when upgrading from 0.x

[MIGRATING.md](https://github.com/browser-use/browser-use/blob/main/MIGRATING.md) is thorough; the items people hit most:

- `Agent`, `Browser`, `Tools`, `run()`, and `final_result()` still exist; most settings 1.0 can't honor raise an error before the browser starts, while a few 0.x tuning knobs (such as `flash_mode`) log one warning and are ignored.
- `Browser()` changed from local Chromium to a cloud browser; local-only options like `Browser(headless=True)` raise `ValueError` on a cloud browser.
- The 0.x gateway models `bu-2-0`, `bu-2-0-mini-preview`, `bu-1-0`, and `bu-latest` are rejected.
- `storage_state`, the per-step result methods, recorded replay, step callbacks, and the planner and loop-detection settings were removed.
- The old `browser-use --mcp` tools (`browser_click` and friends) retired with the old engine, replaced by `--cli-mcp`'s `browser_exec` and `browser_screenshot`.

## The overall trade-off

Browser Use turns "let a model look at a page and take the next step" into a programmable agent loop, and 1.0 goes further by handing the model how it observes and acts too. The price is that results depend on the model, the page, logins, and the network together, so one successful demo isn't a production SLA; and the model's code runs directly on your machine.

A reliable starting point: pin the version, limit domains and steps, constrain output with a schema, save `status` and the judge's verdict, put high-risk side effects behind human confirmation, and run untrusted tasks in a container. Use the open-source Agent when you need custom control; consider Cloud when you don't want to maintain browser processes, proxies, and many sessions.

## Changelog

- 2026-11-19: Rewritten for Browser Use 1.0.6: the loop is now the model writing Python, examples use `Browser('chromium')` and the 1.0 result object, logins use profiles, and sections on the security boundary and upgrading from 0.x were added; outdated model-list and documentation links were removed.

## References

- [Browser Use GitHub repository](https://github.com/browser-use/browser-use)
- [Browser Use: MIGRATING.md (0.x → 1.0)](https://github.com/browser-use/browser-use/blob/main/MIGRATING.md)
- [Browser Use Cloud API V4 quick start](https://docs.browser-use.com/cloud/agent/quickstart)
- [Browser Use pricing](https://browser-use.com/pricing)
- [Browser Use: The Bitter Lesson of Browser Agents](https://browser-use.com/posts/bitter-lesson-browser-agents)
