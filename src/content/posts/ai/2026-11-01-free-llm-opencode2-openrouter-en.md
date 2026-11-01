---
title: "How to Use LLMs for Free: OpenCode 2 Built-in Models and OpenRouter"
date: 2026-11-01
category: ai
type: guide
tags: [opencode, openrouter, llm, coding-agent]
lang: en
tldr: "Install OpenCode 2, select a built-in free model, and complete your first everyday task. Connect OpenRouter later if you want more models or a free API for your own application."
description: "Start with OpenCode 2's built-in free models without connecting OpenRouter first. Includes an everyday prompt example, optional OpenRouter integration, and a free API example."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-11-01-free-llm-opencode2-openrouter)

If you want AI to help plan dinner, organize tasks, or rewrite a message before subscribing to a paid plan, **install OpenCode 2 and select one of its free models directly**. You do not need to register with OpenRouter or prepare another provider's API key first.

OpenCode 2 is an AI coding agent that can read files, edit them, and use tools. Alongside support for external providers, it offers cloud-hosted free models you can use inside OpenCode. This guide starts with that shortest route to a small working example, then introduces OpenRouter as an optional next step.

## Start with the simplest free route

| What you want to do | Approach | What you need |
|---|---|---|
| Try everyday questions and writing help | OpenCode 2's built-in free models | A terminal and OpenCode 2 |
| Try other free models inside OpenCode | Connect OpenCode 2 to OpenRouter | An additional OpenRouter API key |
| Call a free LLM from your own application | Call the OpenRouter API directly | An API key and an HTTP client |

We will start with the first route. You should know how to open a terminal and change directories. You do not need to train a model or own a GPU.

“Built-in” means OpenCode has integrated the model service; inference still happens in the cloud. Free models suit learning and low-volume experiments, and the available models and usage allowances may change.

## Step 1: Install OpenCode 2

This guide uses the **OpenCode 2 terminal interface**. On macOS or Linux, if Node.js and npm are already installed, use the package installation command from the official V2 documentation:

```bash
npm install --global @opencode/cli
opencode --version
```

Check that the version starts with `2.` before continuing. If it shows `1.x`, find the executable your terminal is actually running:

```bash
which opencode
```

OpenCode 1 and 2 both use the command name `opencode`. If you previously installed V1, your terminal may still find that executable first. A working command alone does not confirm that you are running V2.

On Windows, download the standalone CLI executable for your architecture from the [official OpenCode 2 download page](https://opencode.ai/v2/docs). The V2 documentation currently does not support installation through Windows package managers, so do not reuse installation commands from a V1 tutorial.

## Step 2: Select a free OpenCode model directly

Create a practice directory and start OpenCode:

```bash
mkdir llm-playground
cd llm-playground
opencode
```

In the terminal interface, enter:

```text
/models
```

Do not guess from the name alone. Find a model in this order:

1. Search for `big-pickle` in `/models`, or look under the OpenCode provider for entries labeled Free.
2. Open the [official OpenCode model table](https://opencode.ai/v2/docs/console/models), find the same name, and check that **both Input and Output are Free** in the Pricing table. For example, Big Pickle's full ID is `opencode/big-pickle`. A model can be free without having “Free” in its name.
3. Return to `/models`, select that entry, and confirm the current model before starting the exercise below. You do not need to connect OpenRouter for this route.

If you have trouble finding a model in the picker, open another terminal tab, change to the same practice directory, and list the currently available OpenCode models:

```bash
opencode models | awk '/^opencode\//'
```

You might see model IDs in this format:

```text
opencode/big-pickle
opencode/glm-5.3-flash-free
```

This illustrates the output format; your actual list may differ. The command filters only for the `opencode/` provider; **it does not check prices**. If you have connected a paid account, the list may also include paid entries. Compare candidate IDs with the official Input and Output prices, then return to `/models` to search for and select the model.

OpenCode also offers paid models and subscriptions; not everything in the picker is free. Check that your selection is a free entry. You do not need to buy a Go subscription or add credits for this introductory exercise.

If you cannot see free models, search for the full model ID and check your version and the service's availability. If you already have custom configuration, check whether free models have been hidden: setting OpenCode 2's `OPENCODE_DISABLE_FREE_MODELS` to `1` or `true` hides these options.

Free usage still has limits, and some models are free for a limited time. If you exhaust the allowance, stop and try again later, or explore the OpenRouter route below. The built-in free offering is not an unlimited API.

## Step 3: Ask what you can cook tonight

Once you have selected a model, ask it a question as you would in a conversation. Suppose you have just come home from work and do not want to buy groceries:

```text
I have eggs, tofu, and cabbage in the fridge, plus oil, salt, and soy sauce.
Suggest dinner for two, nothing spicy, ideally ready in 30 minutes.
List the dishes and simple instructions, using only these ingredients where possible.
```

Check whether it followed your constraints. Did it add ingredients you do not have? Is the preparation too much work? You do not have to get the prompt perfect the first time. After reading its answer, follow up:

```text
I am tired today. Can you make it just one dish and use fewer pans?
```

That is your first task: describe a small everyday problem, then refine the request based on the answer. A coding agent can also answer everyday questions; you do not need a software project to start.

You can use the same approach to organize a grocery list, make a message sound more polite, or break down weekend chores. Start with something useful to you now instead of inventing a task just to test the tool.

## Connect OpenRouter when you want more free models

The built-in free models are enough to practice the basic workflow. Create an OpenRouter account if you want to try models from other providers or connect an LLM to your own application. OpenRouter puts models from different providers behind one API, giving you another optional way to access them.

### Create an API key

Sign in to [OpenRouter](https://openrouter.ai/), open [API Keys](https://openrouter.ai/settings/keys), and create a new key. A name such as `opencode-learning` makes its purpose easy to recognize later.

An API key lets a tool call the service on your behalf. Paste it into OpenCode's connection interface in the next step; you do not need to put it in project files. Keep it out of Git, frontend code, and public screenshots.

This exercise uses only free models. You do not need to purchase credits to access paid models first. Free requests still have account and provider limits. If you later need a higher allowance, evaluate payment then.

### Connect OpenRouter in OpenCode 2

In the terminal interface, enter:

```text
/connect
```

Select **OpenRouter** and paste your API key when prompted. Then enter:

```text
/models
```

### How to find a free model suitable for OpenCode

Find a candidate on the website, then check its complete ID and capabilities:

1. Open the [OpenRouter zero-input-price shortlist](https://openrouter.ai/models?max_price=0) and open a model that interests you. This only narrows the search; you still need to check its output price.
2. Confirm that the model ID **ends in `:free`** and that both input and output prices are zero. Do not confuse a paid model with its similarly named free variant. Adding `:free` to an arbitrary paid ID does not create a free version.
3. Check the model's supported parameters or capabilities for **tools / tool calling**. Tool calling lets the model ask OpenCode to read files, edit code, and perform other operations. Chat capability alone may not be enough for coding tasks.
4. Copy the full model ID, return to OpenCode's `/models`, and find and select the matching OpenRouter entry. If it is missing, use the configuration method in the next section.

For example, `recursive/flint-v1.0:free` is the raw ID used by the OpenRouter API. In OpenCode configuration, it becomes `openrouter/recursive/flint-v1.0:free`. The extra `openrouter/` is OpenCode's provider prefix. This example model may eventually be removed, but the search process and selection criteria remain the same.

#### Filter for free models with tool support from the terminal

If the website is hard to navigate and Python 3 is installed, run the following program in a regular terminal. It reads the public model catalog without an API key and does not make an inference request:

```bash
python3 - <<'PYCODE'
import json
from decimal import Decimal
from urllib.request import urlopen

url = "https://openrouter.ai/api/v1/models?supported_parameters=tools&q=%3Afree"
with urlopen(url, timeout=30) as response:
    models = json.load(response)["data"]

for model in models:
    price = model.get("pricing", {})
    if (
        model["id"].endswith(":free")
        and Decimal(price.get("prompt", "-1")) == 0
        and Decimal(price.get("completion", "-1")) == 0
        and "tools" in model.get("supported_parameters", [])
    ):
        print(model["id"])
PYCODE
```

It prints one complete model ID per line. Choose one in OpenCode. If the result is empty, this catalog response contains no candidates meeting these conditions; do not silently substitute a paid version. A catalog entry declaring tool support does not guarantee good results on every coding task. When using it to read files or change code, check that it can actually perform those operations correctly.

### What if the OpenRouter model is missing from the picker?

First, confirm that you connected OpenRouter in the current project, then reopen `/models`. OpenCode 2 model availability depends on the project, provider connection, and whether the model is enabled. Selecting a model in another project does not guarantee that it is available here.

If the free model is still listed in OpenRouter but missing from the picker, create `opencode.json` in your practice directory and add it under the V2 `providers` field. This is a **configuration template**: replace both occurrences of `vendor/model-name:free` with the full ID you selected.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "openrouter/vendor/model-name:free",
  "providers": {
    "openrouter": {
      "models": {
        "vendor/model-name:free": {}
      }
    }
  }
}
```

The first `openrouter/` in `model` is OpenCode's provider prefix. The remaining `vendor/model-name:free` is the OpenRouter model ID. Do not add the OpenCode prefix to an ID sent directly to the OpenRouter API.

Adding configuration cannot give a model tool support it lacks or restore a model that has been removed. Reopen OpenCode after editing the file and confirm the actual selection in `/models`. An existing session may retain its earlier choice; changing the default configuration does not automatically switch that session.

## To try the free API, you do not need OpenCode

For summaries, translation, or an LLM feature in your own application, you can call OpenRouter directly. Create an OpenRouter API key as described above before running this example. OpenCode's official free chat models must be used through OpenCode; do not treat them as a free API you can move into your own product.

The simplest starting point is `openrouter/free`. It filters currently available free models for the capabilities your request requires, then selects one at random. This is useful for checking API connectivity. For model comparisons or an ongoing coding session, I would select a specific `:free` model instead.

The following commands work in macOS's default zsh or Bash on Linux. Enter the key with input hidden so that the credential does not become part of your command history:

```bash
printf 'Paste your OpenRouter API key: '
read -rs OPENROUTER_API_KEY
printf '\n'
export OPENROUTER_API_KEY
```

Then send a request:

```bash
curl --fail-with-body https://openrouter.ai/api/v1/responses \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openrouter/free",
    "input": "Explain what an API is in one sentence."
  }'
```

A successful request returns JSON. The answer is inside a message in `output`, and the `model` field identifies the model that actually handled the request. The wording may vary between calls. First confirm that you receive a valid answer, then use the same kind of request in your own application.

## Troubleshooting limits and connection errors

| Symptom | What to check first |
|---|---|
| OpenRouter authentication failure or `401` | Check that you pasted the complete OpenRouter API key; reconnect if needed. |
| `429` or too many requests | Wait before retrying. Honor `Retry-After` when present rather than repeatedly resending. |
| OpenCode's built-in free allowance is exhausted | Stop retrying and wait as instructed by the service, or connect a free OpenRouter model separately. |
| A free model is temporarily unavailable | Choose another listed free model that supports tools. |
| Missing model or `Model unavailable` | Check the full ID, provider connection, and whether the model is enabled. |
| Chat works, but the model does not read or edit files | Check tool-calling support and OpenCode's permission prompts. |
| `402` or a credit-related error | Check your account balance and key limits. A negative balance can also affect free models. |

For OpenRouter, see [OpenRouter Limits](https://openrouter.ai/docs/api/reference/limits) for per-minute, daily, and upstream capacity restrictions on OpenRouter free models. Creating another key on the same account does not bypass the overall limits.

Data-use terms can differ between OpenCode's free models. For example, the official description of Big Pickle permits data use to improve the model. Check the [OpenCode Console model and privacy information](https://opencode.ai/v2/docs/console/models) before selecting a model.

Cloud-hosted free models still send requests to service providers. Start with everyday questions that contain no private data. Before submitting company code, customer data, or confidential content, check your organization's rules and the provider's data policies. Whether a tool is free and whether you may upload particular data are separate questions.

## What to try next

Start with requests such as “explain this function,” “add tests for this small function,” or “fix this bug with a clearly defined expected output.” Keep the scope specific, inspect the changes, and run the project's existing tests.

Free models let you learn this workflow first. If reliability, quality, or usage limits become a real obstacle, decide whether paying makes sense then. You do not need a collection of subscriptions before your first experiment.

To compare other free services, see [LLM inference free tiers and pricing](/posts/ai/2026-05-09-llm-inference-free-tier-comparison-en). For the multi-model service behind this setup, read the [OpenRouter routing guide](/posts/ai/2026-08-22-openrouter-model-routing-en).

## Update history

- 2026-11-01: Replaced the first task with planning dinner from fridge ingredients, demonstrating everyday questions and follow-up constraints without code or file creation.
- 2026-11-01: Added free-model discovery steps, input and output price checks, tool-calling filters, and full model ID examples.
- 2026-11-01: Made OpenCode 2's built-in free models the introductory route, moved OpenRouter to an optional extension, and clarified the difference between free models inside OpenCode and an external API.

## References

- [OpenCode 2: Installation and overview](https://opencode.ai/v2/docs)
- [OpenCode 2: CLI Commands](https://opencode.ai/v2/docs/cli/commands)
- [OpenCode 2: Providers](https://opencode.ai/v2/docs/providers/)
- [OpenCode 2: Console models, free options, and privacy](https://opencode.ai/v2/docs/console/models)
- [OpenCode 2: Models](https://opencode.ai/v2/docs/models/)
- [OpenRouter: Model catalog API and filter parameters](https://openrouter.ai/docs/api/api-reference/models/list-all-models-and-their-properties)
- [OpenRouter: Free Variant](https://openrouter.ai/docs/guides/routing/model-variants/free)
- [OpenRouter: Free Models Router](https://openrouter.ai/docs/guides/routing/routers/free-router)
- [OpenRouter: Quickstart](https://openrouter.ai/docs/quickstart)
- [OpenRouter: Limits](https://openrouter.ai/docs/api/reference/limits)
- [OpenRouter: Data Collection](https://openrouter.ai/docs/guides/privacy/data-collection)
