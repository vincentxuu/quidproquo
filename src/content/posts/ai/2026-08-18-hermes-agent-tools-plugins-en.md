---
title: "The Hermes Agent Tool Layer: What Happens When 3,300 MCP Tools Won't Fit in Context"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, mcp, plugins, tool-search, subagent, code-execution]
lang: en
series:
  name: "Hermes Agent Documentation Guide"
  order: 7
tldr: "Attach enough MCP servers and the tool schemas alone eat your context — upstream's extreme example is Cloudflare's ~3,300 tools, whose names alone run about 32K tokens. Hermes answers with Tool Search: MCP and non-core plugin tools collapse into three bridge tools and schemas load on demand, while core tools never defer. Separately, plugins are disabled by default and only run when named in `plugins.enabled`."
description: "The Hermes Agent tool layer: toolset grouping, the three tiers of Tool Search progressive disclosure, execute_code's two modes and environment scrubbing, delegate_task subagent isolation, MCP configuration and the curated catalog, and the four plugin types with their discovery precedence."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-hermes-agent-tools-plugins)

Post 7 in the series. [Start with the opener](/en/posts/ai/2026-08-18-hermes-agent-intro).

This layer carries a problem common to every modern agent: **the more tools you attach, the more tokens you burn before doing any work.** Hermes handles it more thoroughly than most frameworks, which makes it worth studying on its own.

## Tools come in sets

Tools are grouped into toolsets that can be enabled or disabled per platform via `hermes tools`. The high-level categories: web (`web_search`, `web_extract`), terminal and files (`terminal`, `process`, `read_file`, `patch`), browser (`browser_navigate`, `browser_snapshot`, `browser_vision`), media (`vision_analyze`, `image_generate`, `text_to_speech`), agent orchestration (`todo`, `clarify`, `execute_code`, `delegate_task`), memory (`memory`, `session_search`), automation (`cronjob`), and integrations (Home Assistant, MCP).

A reminder from [the opener](/en/posts/ai/2026-08-18-hermes-agent-intro): the README says 40+ tools while the architecture page says 70+ tools and 28 toolsets. For exact counts go to the Built-in Tools Reference, not to any blog post.

## Tool Search: schemas on demand

The docs state the problem crisply: with several MCP servers or non-core plugins attached, **their JSON schemas consume a substantial fraction of the context window on every turn**, even when only two are relevant to the question.

Tool Search is the opt-in answer. When active, MCP and non-core plugin tools are replaced in the model-visible tools array by three bridge tools:

```
tool_search(query, limit?)     — search the deferred-tool catalog
tool_describe(name)            — load one tool's full schema
tool_call(name, arguments)     — invoke a deferred tool
```

Two design details worth stealing:

**Core tools never defer.** `terminal`, `read_file`, `write_file`, `patch`, `search_files`, `todo`, `memory`, `browser_*`, `web_search`, `clarify`, `execute_code`, `delegate_task`, and `session_search` always load directly. Only MCP and non-core plugin tools are eligible.

**The bridge unwraps.** When the model calls `tool_call`, Hermes dispatches the underlying tool by its real name — **pre/post tool-call hooks, guardrails, and approval prompts all run against the real tool**, and the CLI and gateway activity feeds show the underlying tool rather than `tool_call`. That matters: otherwise a wrapper layer would quietly route around the entire approval system.

Activation is tiered, and what scales is how much of the catalog stays visible, not whether schemas defer:

| Tier | Condition | What the model sees |
|---|---|---|
| 0 | No MCP/plugin tools | Everything eager, no bridge |
| 1 | The deferred listing fits the budget | Bridge plus name + short description per deferred tool (degrading to names only); **degradation is per server**, so one oversized server collapsing to a summary line doesn't cost the small ones their listings |
| 2 | Even names-only exceeds the budget | Bare bridge plus one summary line per server (name + tool count); individual tools are reachable only through `tool_search` |

The docs' tier-2 example is concrete: **Cloudflare's flat API surface alone is ~3,300 tools whose names are ~32K tokens.** The listing budget is `min(threshold_pct% of context, listing_max_tokens)`, re-evaluated every time the tools array is assembled — so adding or removing servers mid-session moves you between tiers immediately.

## `execute_code`: collapsing pipelines into one turn

`execute_code` lets the agent write Python that calls Hermes tools over RPC. The payoff is turning "search → filter → process each → summarize" into a **single LLM turn**, with intermediate results never entering context.

Know the difference between the modes:

```yaml
code_execution:
  mode: project      # project (default) | strict
  timeout: 300
  max_tool_calls: 50
```

`project` runs in the session's working directory with the active virtualenv's python, so project dependencies (`pandas`, `torch`) and relative paths (`.env`, `./data.csv`) resolve. `strict` runs in a temp staging directory with Hermes's own python — maximum reproducibility, but project deps and relative paths don't resolve.

The security posture is **identical in both modes**: environment scrubbing (stripping `*_API_KEY`, `*_TOKEN`, `*_SECRET`, `*_PASSWORD`, `*_CREDENTIAL`, `*_AUTH`) and the tool whitelist apply either way. The docs call this out explicitly — switching mode changes nothing about security, so don't reach for `strict` as a sandbox.

A skill that genuinely needs an environment variable takes a different route: declaring `required_environment_variables` in its SKILL.md frontmatter registers those vars as passthrough when the skill loads — and only the ones actually set.

## `delegate_task`: subagents know nothing

`delegate_task` spawns child AIAgent instances with isolated context and their own terminal sessions; **only the final summary returns to the parent's context**. Three run concurrently by default, configurable with no hard ceiling.

The docs flag the most common mistake with a warning:

> **Critical: Subagents Know Nothing** — Subagents start with a completely fresh conversation… The subagent's only context comes from the `goal` and `context` fields.

So `delegate_task(goal="Fix the error")` is broken usage — the child has no idea which error. The parent must pass the file path, the error text, the project location, the Python version, everything. This is the universal tax of multi-agent systems: **the context you save is paid for in manual restatement**, and an incomplete restatement buys you confident wrong answers.

One more implementation detail: top-level delegation runs in the background — Hermes returns a handle immediately so the conversation continues and posts results back as a new message — whereas an orchestrator subagent waits on its own workers so it can synthesize before returning.

## MCP: configure and it's connected

MCP servers go straight into `config.yaml`:

```yaml
mcp_servers:
  filesystem:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/projects"]
```

Local stdio servers and remote HTTP servers mix in one config, tools are discovered and registered at startup, and per-server filtering lets you **expose only the tools you actually want the agent to see** — the most direct lever on the context cost described above.

Two useful entry points: `hermes mcp` is the interactive picker, and `hermes mcp catalog` lists Nous-reviewed servers (**all disabled by default** — install only what you want). Coming from Claude Code, `hermes import-agent claude-code` maps the `mcpServers` block in `~/.claude.json` to Hermes's `mcp_servers` and brings skills and instructions along.

ACP goes the other direction: Hermes runs as an ACP server so VS Code, Zed, and JetBrains can drive it, using a curated `hermes-acp` toolset that **deliberately excludes messaging delivery and cron management** because those don't fit editor UX. It needs the `.[acp]` extra.

## Plugins: off unless named

This is one of the best defaults in the project:

> **General plugins and user-installed backends are disabled by default** — discovery finds them… but nothing with hooks or tools loads until you add the plugin's name to `plugins.enabled`.

Plugins are discovered and listed in `hermes plugins`, but no third-party code runs until you name it. The `disabled` deny-list always wins over `enabled`.

The four plugin types differ in selection semantics, which people mix up:

| Type | What it does | Selection |
|---|---|---|
| General plugins | Tools, hooks, slash commands, CLI subcommands | Multi-select |
| Memory providers | Replace or augment built-in memory (Honcho, Mem0…) | **One active at a time** |
| Context engines | Replace the built-in context compressor | **One active at a time** |
| Model providers | Declare an inference backend | Many registered, one picked via `--provider` |

Discovery precedence runs bundled → user `~/.hermes/plugins/` → project `.hermes/plugins/` → pip entry points → Nix, with **later sources overriding earlier ones**. A same-named user plugin therefore replaces a bundled one — the supported way to swap built-in behavior without editing the repo. Project-level plugins additionally require `HERMES_ENABLE_PROJECT_PLUGINS=true`, a gate that earns its place: otherwise cloning a repo would mean running someone else's plugin code.

Also worth remembering: **not every extension needs Python.** TTS/STT backends and shell hooks are config-driven shell commands, MCP servers are external processes, and gateway hooks are a `HOOK.yaml` plus `handler.py` dropped into a directory. Picking the right surface beats writing a plugin.

## The takeaway

If you keep one thing from this post: **decide the context cost before attaching MCP servers.** Per-server filtering and Tool Search are two different gates — the first is you choosing what's exposed, the second is the system choosing when schemas load. Skip both and you pay 30K tokens before asking a question.

Next: [the gateway and scheduled automation](/en/posts/ai/2026-08-18-hermes-agent-gateway-cron).

## References

- [Hermes Agent — Tools & Toolsets](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools)
- [Hermes Agent — MCP Integration](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)
- [Hermes Agent — Plugins](https://hermes-agent.nousresearch.com/docs/user-guide/features/plugins)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Agent Client Protocol](https://agentclientprotocol.com/)
