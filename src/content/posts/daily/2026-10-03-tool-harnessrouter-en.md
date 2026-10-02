---
title: "Tool Pick｜HarnessRouter — One API to Run Codex, Claude Code, Hermes, and Other Coding Agent Harnesses"
date: 2026-10-03
category: daily
type: digest
tags: [ai-agent, tool, daily, sdk]
lang: en
description: "An open-source self-hosted platform that wraps ready-made coding agent harnesses like Codex, Claude Code, and Hermes behind one OpenAI Responses-compatible API via the Unified Harness Protocol, so a product stops rewriting session/streaming/file handling for every new harness it adds"
tldr: "HarnessRouter Community Edition is an Apache-2.0 self-hosted platform that wraps agent harnesses like Codex, Claude Code, and Hermes behind one API using the Unified Harness Protocol (UHP). Install: docker run -d --name harnessrouter -p 127.0.0.1:3000:3000 -v harnessrouter:/data harnessrouter/harnessrouter. It solves the problem of rewriting session, streaming, file, and cancellation logic every time a product integrates another coding agent harness."
series:
  name: "AI Tool of the Day"
  order: 43
---

> 🌏 [中文版](/posts/daily/2026-10-03-tool-harnessrouter)

## Tool Info

| Item | Value |
|---|---|
| Name | HarnessRouter (Community Edition) |
| Type | Self-hosted agent backend platform (single Docker container, OpenAI Responses-compatible API) |
| GitHub | [HarnessRouter/harnessrouter](https://github.com/HarnessRouter/harnessrouter) |
| Stars | 2,846 (created 2026-08-09, still getting commits today; hit #1 Product of the Day on Product Hunt as Community Edition on 2026-08-16, with a Launch YC page) |
| Language | Python |
| License | Apache-2.0 (the CE core; bundled agent harness CLIs keep their own upstream licenses; Starter Kits ship under separate terms) |
| Install | `docker run -d --name harnessrouter -p 127.0.0.1:3000:3000 -v harnessrouter:/data harnessrouter/harnessrouter` |

## What Problem It Solves

Want your product to run on complete, ready-made coding agent harnesses — Codex, Claude Code, Hermes — instead of building an agent runtime from scratch on top of a model's function calling? The catch is that every harness starts differently, continues sessions differently, streams differently, handles files differently, and reports errors differently. Wiring up one means writing a glue layer; switching to another, or comparing which harness/model combo is cheaper or faster, means doing it all over again.

HarnessRouter collapses "how a product drives a complete agent harness" into an open protocol, the Unified Harness Protocol (UHP), exposed through an OpenAI Responses-compatible interface: send a task, pick the harness via `metadata.harness_id` (Codex, Claude Code, Hermes, Pi, DeepSeek Harness, and others). Community Edition is the self-hosted reference implementation of that protocol — a single Docker container running Console, Gateway, and Runner, with provider keys, session state, and generated files staying on your own machine. The maintainers are explicit about where this sits relative to MCP: MCP governs how one agent calls tools; UHP governs how a product drives an entire agent harness and gets back its full execution lifecycle — sessions, streaming, files, cancellation. The two aren't competing; they cover different boundaries.

Where this fits: teams that want to let users pick which coding agent handles a task (reviewing a PR, writing SQL, drafting slide content) inside their own product, or that are evaluating several harness/model combinations for cost and latency and don't want to rebuild an integration layer for each one.

## Getting Started

### Install

```bash
# 1. Start it (first run pulls the image, ~700MB)
docker run -d --name harnessrouter \
  -p 127.0.0.1:3000:3000 \
  -v harnessrouter:/data \
  harnessrouter/harnessrouter

# 2. Wait for first launch to finish (it installs the bundled harness CLIs along the way)
docker logs -f harnessrouter
# Open the browser once you see "[harnessrouter] ready on :3000"

# 3. Open http://localhost:3000, sign in with harnessrouter / harnessrouter, change the password immediately
```

### Basic Usage

Once a model provider's API key is connected in the Console and a task has run there once, integrate the same API into your own backend:

```bash
export HARNESSROUTER_BASE_URL=http://localhost:3000/api/harness

curl --fail-with-body -sS "$HARNESSROUTER_BASE_URL/v1/responses" \
  -H "Authorization: Bearer ${HARNESSROUTER_API_KEY:?}" \
  -H 'content-type: application/json' \
  -d '{
    "input":"Check the README for outdated commands and report which section is wrong",
    "metadata":{"harness_id":"claude-code"},
    "model":"claude-opus-5-5",
    "stream":false
  }'
```

Swap `metadata.harness_id` to `codex`, `hermes`, or any other enabled harness, and the application code doesn't change — only which coding agent runs underneath.

### Advanced Usage

Pass sensitive values — tokens, keys — to the agent through an `env` reference instead of writing them into the prompt. The docs call out that models tend to drop or swap characters when retyping long literal strings, so reference them instead of spelling them out:

```json
{
  "input": "Deploy to staging, the token is in $DEPLOY_TOKEN",
  "metadata": {
    "harness_id": "codex",
    "env": { "DEPLOY_TOKEN": "vault:deploy-staging" }
  },
  "model": "gpt-5.4"
}
```

`vault:name` reads a secret your own workspace stored via `PUT /v1/mcp-secrets/{ref}`, and the resolved value is redacted everywhere it could leave the sandbox — the response, the stream, the trace, the stored record — even if the agent prints it back out.

## Compared to Existing Approaches

| | HarnessRouter CE | Hand-rolled glue per harness | A single harness's native SDK/CLI |
|---|---|---|---|
| Switching between harnesses | One field change | Custom integration per harness | Locked to one harness |
| Unified session/streaming/files/cancellation | Built in, OpenAI Responses-compatible | Needs custom implementation | Whatever that harness exposes |
| Open protocol, not vendor-locked | Yes (UHP spec + conformance suite) | — | No |
| Self-hosted, data stays local | Yes (CE) | Yes | Depends on the harness |
| Credential isolation (per-session OS user) | Built in | Needs custom implementation | Depends on the harness |
| Still need to manage your own provider API keys | Yes | Yes | Yes |

## Things to Watch

- **The container must start as root, but that doesn't mean the whole service runs as root.** The entrypoint and Runner keep root only to create a separate OS user per session; the Console and Gateway themselves run unprivileged, and each agent process runs under its own session's user. Passing `--user` makes the container refuse to start outright, so remove it before upgrading if you set it before.
- **No bundled model or trial key.** You bring your own provider API key and paste it into the Console; HarnessRouter doesn't give you model credits. The bundled harness CLIs (Codex, Claude Code, etc.) install automatically on first launch, but they're still external dependencies — their own versioning and licensing risk is yours to track.
- **Starter Kits and Community Edition don't share a license.** CE itself is Apache-2.0, but the Slides, Sheets, and Dashboards Starter Kits ship under different terms — don't assume one license covers both when deciding what you can use commercially.
- **Both the company and the project are young.** Open-sourced in August 2026, it crossed roughly three thousand stars and picked up a YC credit within two months, but it still has 17 open issues and no formal SLA. Weigh the maintenance risk yourself before relying on it in production — a fast star count isn't the same as production-proven.

## Today's Takeaway

The agent ecosystem keeps repeating the same move at a higher layer. OpenRouter collapsed "integrate with many model providers" into one API; HarnessRouter now collapses "integrate with many complete coding agent harnesses" into one protocol. The gap between the two says something about how agent infrastructure is stacking: above the model sits the harness (the layer that wraps a model with tools, memory, and an execution environment), and now above the harness sits a protocol for driving the harness itself. MCP solves how an agent calls tools; UHP solves how a product treats a whole agent harness as a swappable backend — two layers that will keep getting mentioned in the same breath, even though they govern entirely different boundaries.

## References

- [HarnessRouter/harnessrouter — GitHub](https://github.com/HarnessRouter/harnessrouter)
- [HarnessRouter README (quickstart, API, architecture diagram)](https://github.com/HarnessRouter/harnessrouter/blob/main/README.md)
- [Self-hosting guide (install, root-privilege design, security model details)](https://github.com/HarnessRouter/harnessrouter/blob/main/docs/self-hosting-guide.md)
- [Launch YC: HarnessRouter open-source announcement](https://www.ycombinator.com/launches/Sv6-harnessrouter-open-sourcing-the-world-s-first-unified-interface-for-agent-harnesses-and-the-unified-harness-protocol)
- [Unified Harness Protocol official site](https://unifiedharnessprotocol.org)
- [Show HN discussion thread](https://news.ycombinator.com/item?id=49335595)
