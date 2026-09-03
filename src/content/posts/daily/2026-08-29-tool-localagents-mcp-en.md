---
title: "Tool Pick | localagents — Offload Claude Code's Grunt Work to Your Own GPU"
date: 2026-08-29
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An MCP server lets Claude Code delegate repetitive coding subtasks to a local llama.cpp / vLLM model, so Claude only handles design and review while your Anthropic token budget goes further"
tldr: "localagents is an MCP server that lets Claude Code delegate subtasks to a local llama.cpp / vLLM model. Install: git clone + uv tool install -e . + claude mcp add. It solves the compatibility problem where a local model can't plug directly into Claude Code's conversation protocol — KV-cache placement and context window size both trip it up."
series:
  name: "AI Tool of the Day"
  order: 14
---

> 🌏 [中文版](/posts/daily/2026-08-29-tool-localagents-mcp)

## Tool Info

| Field | Value |
|---|---|
| Name | localagents |
| Type | MCP server (bridges subtasks to a local model) |
| GitHub | [ccebelenski/localagents](https://github.com/ccebelenski/localagents) |
| Stars | 5 |
| Language | Python |
| License | MIT |
| Install | `git clone https://github.com/ccebelenski/localagents.git && cd localagents && uv tool install -e .` |

## What Problem It Solves

Have you ever noticed that when Claude Code "adds a CLI to this module and writes a matching test," it burns roughly the same token budget as "deciding how to split this system's interfaces"? The first task is grunt work — write code against an existing interface, run tests, iterate until they pass. The second is where a model's judgment actually matters. Claude Code doesn't distinguish between the two: both run on the same model, and your token budget gets eaten up by the grunt work.

localagents is an MCP server that gives Claude Code a new tool, `run_agent`. Every call spins up a full headless Claude Code session — same toolset, same `CLAUDE.md`, same working directory — except its API traffic goes to a llama.cpp or vLLM server you run yourself, not to Anthropic. Claude writes the work brief, the local model does the work, and Claude reviews the result. The hard part isn't swapping in a different `base_url`. Claude Code's message format gets rejected by local chat templates — putting a `system` role mid-conversation makes Qwen's template fail outright with "System message must be at the beginning" — and Claude Code assumes by default that any unfamiliar model has a 200k context window, which kills the whole job the moment it hits llama.cpp's smaller window. localagents' shim layer handles both problems: it folds messages in place instead of moving them to the front (moving them would invalidate the KV-cache prompt prefix, adding 21-47 seconds of recompute per turn on a 27B model), and it probes each endpoint's actual context window live, feeding that back to Claude Code so auto-compact triggers at the right time.

Best for: teams that already have a capable GPU running llama.cpp or vLLM locally (the author uses a 27B Qwen model as the example) and want to offload interface-driven coding and test-writing grunt work, saving their Anthropic token budget for design conversations that actually need judgment. The project is still early — the author uses it daily, but the interface is expected to keep changing.

## Quick Start

### Installation

```bash
git clone https://github.com/ccebelenski/localagents.git && cd localagents
uv tool install -e .                  # puts `localagents` on PATH, editable install
cp models.example.yaml models.yaml    # edit to point at your own server (already gitignored)
claude mcp add --scope user local -- localagents --config "$PWD/models.yaml"
```

Dependencies: Python 3.12+, [uv](https://docs.astral.sh/uv/), Claude Code (the Agent SDK ships its own `claude` binary, no separate install needed), and a local server that speaks the Anthropic `/v1/messages` protocol — llama.cpp needs `--jinja` at startup, and vLLM needs `--enable-auto-tool-choice --tool-call-parser <parser>`. After installing, restart Claude Code or reconnect from the `/mcp` menu — the MCP server only loads at startup.

### Basic Usage

`models.yaml` defines where your local servers live and what to call each model:

```yaml
endpoints:
  llamacpp:
    base_url: http://127.0.0.1:8080
    backend: llama.cpp

models:
  qwen3.8-27b:
    notes: default mid-size coder on llama.cpp; run with --reasoning on
```

Once configured, just tell Claude to use a local model for a task. It calls `list_models` on its own to see what's running, then `run_agent` to start the job, tracking progress with `wait_job` / `job_status`:

```
Use the local model to add a --json flag to this CLI, and write matching tests.
```

If the model you asked for isn't running, Claude tells you exactly which one to start (for example, "`qwen3.8-27b` isn't running, please start it up"). Start `llama-server` yourself, reply "done," and Claude retries. Jobs that run past Claude Code's built-in 2-minute tool timeout automatically move to the background, so you don't have to babysit them.

### Advanced Usage

`isolation: worktree` runs each delegated task in its own git worktree (on a `local-agent/*` branch), keeping it only if it actually made changes, and attaches a diffstat to the job record so Claude can review the local model's output as a diff without dirtying your current working branch:

```
run_agent(task="Refactor the parser module with type annotations", model="qwen3.8-27b", isolation="worktree")
```

## Comparison With Existing Tools

The more common way to point Claude Code at a different model is an external proxy (like [claude-code-router](https://github.com/musistudio/claude-code-router)), which swaps `ANTHROPIC_BASE_URL` wholesale so all traffic reroutes. localagents takes a completely different approach: the main session stays on Claude, and only subtasks get delegated out.

| | localagents | External proxy (e.g. claude-code-router) | Manually setting `ANTHROPIC_BASE_URL` |
|---|---|---|---|
| Main session stays on Claude, only subtasks delegated | ✅ | ❌ (swaps the source for the whole session) | ❌ |
| KV-cache-friendly system message folding | ✅ | ❌ | ❌ |
| Auto-detects context window and feeds it back to Claude Code | ✅ | Depends on the proxy | ❌ |
| Git worktree isolation for local model changes | ✅ | ❌ | ❌ |
| Background job execution and tracking | ✅ (`wait_job` / `job_log` / `list_jobs`) | ❌ | ❌ |
| Backend lock-in | llama.cpp / vLLM | Usually supports many cloud/local providers | Whatever endpoint you wire up yourself |

## Caveats

- **Status is "early"**: the README states plainly, "Status: early. It works, I use it daily, and the interface will move" — tool names and parameters may still change.
- **Only targets llama.cpp and vLLM**: the author is explicit that "Ollama isn't a goal." If your local model server is Ollama, this tool doesn't currently support it.
- **Too small a context window causes thrashing**: the README reports a 64k window "thrashing" — Claude Code's fixed prompt plus compacted summaries fill the window within a few turns and trigger a safety cutoff that aborts the job outright. The author recommends at least 128k per slot.

## Takeaway

I assumed pointing an agent at a local model was just a matter of swapping an API endpoint, but localagents' shim reveals that the real bottleneck sits in protocol-compatibility details: Claude Code's embedded multi-turn system messages and its assumptions about context window size are exactly the things a local model server often can't handle. Swapping the endpoint is only step one — making a local model actually withstand Claude Code's conversation protocol is what a tool like this is really solving.

## References

- [ccebelenski/localagents GitHub repo](https://github.com/ccebelenski/localagents): README, architecture diagram, install steps, `models.yaml` example, shim internals, and context-window handling all come from the official repo.
- [ccebelenski/localagents LICENSE](https://raw.githubusercontent.com/ccebelenski/localagents/main/LICENSE): MIT license terms.
- [musistudio/claude-code-router GitHub repo](https://github.com/musistudio/claude-code-router): referenced as a representative example of the external-proxy approach.
