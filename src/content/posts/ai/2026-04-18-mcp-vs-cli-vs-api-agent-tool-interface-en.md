---
title: "MCP vs CLI vs API: The Real Boundaries of Agent Tool Interfaces"
date: 2026-04-18
type: guide
category: ai
tags: [mcp, agent, cli, api, claude-code, tool-use]
lang: en
tldr: "MCP is not going away, but its effective scope is narrower than most people think. For local development, CLI and raw API almost always beat MCP. MCP's truly irreplaceable niche is the narrow gap of 'cross-agent shared local tool layer.'"
description: "Breaking down the five ways agents interact with tools — CLI, code generation, generic HTTP tools, OpenAPI/Actions, and MCP — and pinpointing MCP's real competitors and sole moat in each dimension."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-18-mcp-vs-cli-vs-api-agent-tool-interface)

"MCP will fade away as lightweight CLI interfaces rise" has been a recurring topic lately. Claude Code, Codex CLI, and Gemini CLI all treat bash as a first-class citizen and get along just fine without MCP. At the same time, others argue that MCP is the USB-C of the agent ecosystem — you can't live without it. This post breaks the proposition apart, lays out the five ways agents interact with tools, identifies MCP's real competitor in each dimension, and pinpoints the one position where it truly holds ground.

## Five Ways Agents Interact with Tools

We usually simplify this question to "MCP vs CLI," but that's a flattened binary. In practice, agents consume tools through five paths:

```
              Agent wants to do something
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   Generate code     Tool call        Shell exec
   (write & run)     (fill params)    (CLI wrapper)
                         │
             ┌───────────┼───────────┬─────────────┐
             ▼           ▼           ▼             ▼
        Generic HTTP  OpenAPI     Platform       MCP
        tool          as tools   Actions         server
                                 (managed secret)
```

Among these five, **API is the base layer** — CLI, SDK, MCP, Actions, and OpenAPI tools are all different wrappers around APIs. So the real question isn't "MCP or CLI" but rather "on top of this base layer, which wrapper is most agent-friendly."

## The Hidden Variable: Training Data Coverage

An LLM's "familiarity" with tools is extremely uneven — this is the key variable determining success rate, yet it's often overlooked.

```
        LLM success rate
          │
    raw API ─────────── Popular services (GitHub, Stripe): very high
          │             Obscure services: very low
          │
    CLI  ─────────────  Popular CLIs (gh, git, kubectl): very high
          │             Obscure CLIs: unstable
          │
    SDK  ─────────────  Popular SDKs: high
          │
    MCP  ─────────────  Overall medium-to-unstable
          │             (depends on tool description quality)
          └──────────────────────▶ Service popularity
```

The key insight: `curl` combined with popular service REST APIs has **millions of Stack Overflow and blog examples** in training data. MCP servers only started appearing in volume in the second half of 2024 — they have virtually zero representation in training data. Even with perfectly written tool descriptions, an LLM's success rate with "familiar protocol + familiar service" is still higher.

This is the heaviest argument against MCP: **it's a new protocol, and LLMs are better at old things.**

## Three Axes Determine Which to Choose

| Axis | Two ends | Impact |
|---|---|---|
| Host side | Has shell / code interpreter <-> No shell (pure chat UI) | No shell means no CLI, no code generation |
| Target side | Has mature CLI / popular API <-> GUI-only SaaS | No CLI and no well-documented API means the agent is effectively blind |
| Permissions | Agent can directly hold secrets <-> Secrets must be isolated from LLM | Enterprise, multi-tenant, audit log scenarios require isolation |

Crossing these three axes produces a more honest selection table:

| Scenario | Recommended | Rationale |
|---|---|---|
| Local Claude Code, writing code | CLI / code generation | Double advantage of shell + training coverage |
| Local agent operating popular SaaS (GitHub) | CLI (`gh`) | LLM already knows it well, no wrapper needed |
| Local agent operating obscure internal systems | Custom MCP server | No CLI, but needs repeated use |
| Claude Desktop user operating Notion | MCP | No shell, secrets need to be held by proxy |
| ChatGPT operating Salesforce | Platform Actions | Platform holds secrets, zero install for users |

Note: **only the last two rows are scenarios where MCP / Actions truly excel** — in other rows, CLI or code generation is usually the better choice.

## Head-to-Head Comparison of Five Approaches

| Approach | Schema source | Who holds secrets | Training coverage | Cross-agent sharing | Representative |
|---|---|---|---|---|---|
| Code generation | None (reads docs) | env / prompt | ⭐⭐⭐ | ❌ | Claude Code, Code Interpreter |
| Generic HTTP tool | None (LLM fills) | prompt | ⭐⭐⭐ | ❌ | `http_request(url, ...)` tool |
| OpenAPI tools | API provider | prompt / proxy | ⭐ | Difficult | Early ChatGPT Plugins |
| Platform Actions | API + platform | Platform-managed | ⭐ | ❌ (platform-locked) | ChatGPT Actions |
| MCP server | Server author | Server-managed | ⭐ | ✅ | Anthropic MCP ecosystem |
| CLI | Tool author | env / keychain | ⭐⭐⭐ (popular) | ❌ | `gh`, `wrangler`, `psql` |

Reading this table in reverse reveals that each of MCP's three claimed selling points has a competitor:

- **Structured schema**: OpenAPI has had this for ages, and API vendors are already writing them
- **Server-managed secrets**: Platform Actions can do this too (the difference is "user's local server" vs "platform-managed")
- **Cross-agent sharing**: ✅ This is MCP's true exclusive — a single MCP server can be used simultaneously by Claude Desktop, Cursor, VS Code agents, etc. OpenAPI / Actions / CLI cannot do this

## MCP's True Moat Is Only "Cross-Platform Sharing"

This was also its original design intent. Once you leave this position, every direction has a lighter, more familiar alternative:

```
┌────────────────────────────────────────────────────────────┐
│  MCP's only irreplaceable intersection                     │
│                                                            │
│  ① Host cannot generate code or open a shell               │
│  ② Target has no existing CLI or popular API                │
│     (LLM isn't familiar with it)                           │
│  ③ Secrets shouldn't be given to the LLM or handed         │
│     to an agent platform for management                    │
│  ④ The same set of tools needs to be shared across         │
│     multiple agent hosts                                   │
│                                                            │
│  All four conditions must be met simultaneously for        │
│  MCP to be truly indispensable                             │
└────────────────────────────────────────────────────────────┘
```

Condition ④ is especially critical — it's the one thing none of the other four approaches can achieve. Write one Notion MCP server, and Claude Desktop, Cursor, and any future IDE agent can all use it directly without each having to rewrite the integration. This "implement once, share across multiple hosts" value is the only place MCP truly holds ground.

Conversely, **MCP servers that are only used within a single agent host are essentially freeloading on the protocol** — using CLI or a code interpreter is usually more straightforward.

## The Bottom Line

"MCP fading vs rising" is a false dichotomy. A more accurate description is:

> MCP is converging from the overblown expectation of being "the USB-C of agents" back to the position where it truly belongs: **the cross-platform shared local tool layer**. Other scenarios — local developers, popular SaaS, pure chat UIs — each have lighter alternatives with better training coverage.

MCP won't disappear, because the need to "share tools across agent hosts" is real and irreplaceable. But it won't swallow the entire agent tool market either — because for developer scenarios, the combination of shell + popular CLI / API is almost always faster, more accurate, and more context-efficient.

We don't need MCP to vanish. We need it to stop taking on roles it was never meant to fill.

---

**2026-05-10 Postscript**: After Anthropic's 11/4 Code execution with MCP release, the "code generation" path materialized into a concrete pattern — Code Mode (lazy import + runtime). The full write-up is in [Code Mode: Moving Tool Definitions from Context into Code](/posts/ai/2026-05-10-code-mode-mcp-runtime-pattern).

## References

- [Model Context Protocol official website](https://modelcontextprotocol.io/)
- [Anthropic MCP announcement](https://www.anthropic.com/news/model-context-protocol)
- [Claude Code official documentation](https://docs.anthropic.com/en/docs/claude-code/overview)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- [ChatGPT Actions documentation](https://platform.openai.com/docs/actions)
- [GitHub CLI (`gh`)](https://github.com/cli/cli)
- [Simon Willison's blog (ongoing LLM tool use observations)](https://simonwillison.net/)
- [Armin Ronacher's blog (multiple commentaries on MCP design)](https://lucumr.pocoo.org/)
