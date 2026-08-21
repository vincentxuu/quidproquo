---
title: "Agent Plugins 1.0: OpenAI, Google, and AWS Unite to Standardize AI Agent Extensions"
date: 2026-08-21
type: deep-dive
category: ai
tags: [agent-plugins, mcp, agent-skills, open-standard, openai, google, aws, cursor, vercel]
lang: en
tldr: "Agent Plugins 1.0 is a packaging format that bundles Agent Skills (markdown instructions) and MCP server configs into a single directory, loadable by ChatGPT, Cursor, GitHub Copilot, Kiro, and VS Code. It's not a new protocol — it's the wrapper above protocols. Vercel initiated it, OpenAI/AWS/Microsoft/Cursor co-authored it, and Google joined on launch day. Anthropic isn't on the governance board, but MCP is a core primitive of the spec."
description: "The Agent Plugins 1.0 technical spec, plugin.json and mcp.json structure, how it layers on top of MCP, which clients support it at launch, and what this standard actually solves versus what it doesn't."
series:
  name: "Technology Choices in the AI Era"
  order: 21
draft: false
---

🌏 [中文版](/posts/ai/2026-08-21-agent-plugins-open-standard)

You wrote an MCP server that connects to your company's internal knowledge base. You wrote a skill that teaches agents how to use it for customer Q&A.

It works great in Cursor.

Then a colleague asks: "I use Copilot — can I install it?"

You look at Copilot's plugin structure, sigh, and rearrange the same MCP config and skill into a different directory layout. Another colleague uses ChatGPT. You do it again.

That was the reality of AI agent extensions before August 6, 2026.

---

## What This Standard Does

[Agent Plugins 1.0.0](https://agent-plugins.org/) is a **packaging format** — not a new protocol, not a new runtime. It defines a directory structure that bundles two existing things — [Agent Skills](https://agentskills.io/) (markdown instruction sets) and [MCP](https://modelcontextprotocol.io/) server configurations — into a single portable unit.

Package once, and ChatGPT, Cursor, GitHub Copilot, VS Code, and Kiro can all load it.

If you've read the site's [MCP overview](/posts/ai/2026-03-22-mcp-model-context-protocol), here's a layering analogy:

| Layer | Role | Analogy |
|---|---|---|
| **MCP** | Wire protocol — how agents call tools | USB-C interface |
| **Agent Skills** | Cognitive instructions — how agents think | User manual |
| **Agent Plugins** | Packaging format — bundles both | The box that holds the cable and the manual |

Agent Plugins doesn't replace MCP. It wraps MCP. Before this, a skill that depended on a specific MCP server required separate, undocumented setup steps for each client. Now one directory handles it.

## Who's Behind It

[Vercel initiated the proposal](https://vercel.com/blog/introducing-agent-plugins), published August 6, 2026. The Technical Steering Committee's Core Maintainers:

| Company | Role | Launch Client |
|---|---|---|
| Vercel | Initiator, Core Maintainer | — |
| OpenAI | Core Maintainer | ChatGPT, Codex |
| AWS | Core Maintainer | Kiro |
| Microsoft | Core Maintainer | GitHub Copilot, VS Code |
| Anysphere (Cursor) | Core Maintainer | Cursor |
| Google | Joined as Core Maintainer on launch day | Agents CLI, Data Agent Kit |

The significance is the **rare cross-camp collaboration**. OpenAI and Google compete fiercely on models, AWS and Microsoft are each other's biggest cloud rivals, and Cursor is eating into Copilot's IDE market — yet they all sat down and agreed on what a plugin directory should look like.

**Anthropic is not on the TSC.** But MCP team member Tobin South responded positively on X, saying plugins are "likely to become the default packaging mechanism" and that Claude Code's plugin structure is already compatible. Since Agent Plugins treats MCP as a core primitive, Anthropic is arguably the biggest indirect beneficiary.

Post-launch, additional clients have joined support, including Nous Research's Hermes Agent, x.ai's Grok Bot, OpenClaw, and NanoClaw.

## Technical Spec

### Directory Structure

A plugin is a filesystem directory:

```
my-plugin/
  plugin.json              # Manifest (required)
  skills/                  # Agent Skills
    summarize/
      SKILL.md
      references/
  mcp.json                 # MCP server config
  com.example.client/      # Client-specific extensions (reverse-domain naming)
```

No archive format, no registry, no package manager. You can inspect it with `ls` and version-control it with `git`. The spec explains: "Plugins use filesystem directories as the package unit... This keeps plugins inspectable with standard tools."

### plugin.json

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "knowledge-base",
  "version": "1.0.0",
  "description": "Internal KB search and Q&A",
  "author": { "name": "Acme Corp" },
  "keywords": ["search", "qa"],
  "extensions": {
    "com.cursor": { "shortcut": "kb" }
  }
}
```

Only `$schema` and `name` are required. The schema is closed — unknown top-level fields trigger warnings but don't invalidate the plugin; type mismatches on known fields are fatal.

Name rules are strict: 1–64 characters, lowercase alphanumeric plus `-` and `.` only, no consecutive `--` or `..`, must start and end with an alphanumeric character.

The `extensions` field is a namespace for client-specific data, keyed by reverse-domain identifiers. Clients ignore namespaces they don't recognize. This is one of the spec's smartest design choices — it acknowledges that different clients have different needs, but confines those differences to a compartment that doesn't pollute the portable contract.

### mcp.json

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  "mcpServers": {
    "local-tools": {
      "type": "stdio",
      "command": "./bin/server",
      "args": ["--data", "${PLUGIN_DATA}"]
    },
    "remote-api": {
      "type": "streamable-http",
      "url": "https://tools.example.com/mcp"
    }
  }
}
```

Three transport types: `stdio` (local subprocess), `streamable-http` (current MCP HTTP transport), and `sse` (legacy, optional). Clients must support at least one of stdio or streamable-http.

Two placeholder variables: `${PLUGIN_ROOT}` (absolute path to the plugin directory) and `${PLUGIN_DATA}` (client-managed persistent directory — survives updates, may be deleted on uninstall). Expansion is single-pass, non-recursive.

Security rules: `command` must be a single executable token, not a shell string; plugins must not embed credentials in `headers` or `env`; v1 defines no OAuth or credential-reference fields — authentication is entirely client-managed.

### Skill Discovery

Each immediate subdirectory under `skills/` that contains a `SKILL.md` file counts as one skill. No recursive search. Skills follow the [Agent Skills specification](https://agentskills.io/specification) — essentially a markdown file with optional `references/` and `scripts/` directories.

### Failure Isolation

This is the spec's most pragmatic design:

- Schema violations on required fields → reject the entire plugin
- Individual component failure (e.g., one skill with a broken SKILL.md) → skip only that component, load everything else
- Missing optional files → not an error

"A plugin that provides skills and an MCP server should not become entirely unusable because one server is unavailable."

### Client Conformance

A conformant client must:

1. Load a plugin from a directory path
2. Parse and validate `plugin.json` using the closed schema
3. Ignore unrecognized `extensions` namespaces
4. Discover components at fixed locations for supported types
5. Support at least one component type (skills or MCP)

Incremental adoption is explicitly allowed: a skills-only client can skip MCP entirely and still be conformant.

## What It Actually Solves

Back to the opening scenario. You have an MCP server and a skill. Three clients need them.

Before:

```
cursor-plugin/
  .cursor/mcp.json
  .cursor/skills/my-skill/SKILL.md

copilot-plugin/
  ... (Copilot's format)

chatgpt-plugin/
  ... (ChatGPT's format)
```

Three directories, same content, different structures. Change one, forget to update the others.

After:

```
my-plugin/
  plugin.json
  skills/my-skill/SKILL.md
  mcp.json
```

One directory. All three clients can read it.

This sounds simple, but it's the first time anyone in the AI agent ecosystem has sat down to standardize this — and "anyone" is six companies that compete on almost everything else.

## What It Doesn't Solve

A standard's boundaries matter as much as its contents. v1 explicitly excludes:

**No registry or package manager.** There's no `npm install @acme/kb-plugin`. How plugins are installed is entirely up to each client — Cursor might use a UI button, Copilot a CLI, ChatGPT a store.

**No authentication standard.** v1 doesn't define OAuth flows or credential references. If your MCP server needs an API key, how the user securely provides it is the client's problem.

**No archive or transfer format.** Plugins are directories, not `.zip` files. How they get from A to B is out of scope.

**Skill interpretation still varies by client.** The same SKILL.md may behave differently across clients — different models, different system prompt assembly, different context window management.

**v1 has only two component types.** The spec explicitly says other proposals — commands, hooks, agents, rules, LSP servers — are "too client-specific for a stable portable contract," deferred to future versions.

These limitations are deliberate. Vercel's announcement is direct: "The format is intentionally small and easy to implement." Standardize the smallest common denominator everyone can agree on, let clients compete on everything else — the same strategy MCP used when it first defined a minimum viable protocol.

## What It Means for Developers

If you're writing MCP servers or agent skills, **it's worth packaging them as Agent Plugins now.** The cost is minimal — add a `plugin.json` and adjust your directory structure. The benefit is that your tools are no longer locked to a single client.

If you're choosing an agent client, this standard means plugin ecosystems are no longer a user lock-in moat. Before, choosing Cursor meant only Cursor's plugins; now at least the base layer is interoperable. Client selection returns to what it should compare: model capabilities, UX, response speed, pricing.

If you're watching industry dynamics, this may be one of 2026's most significant standardization events. Not because the technology is innovative — a directory structure plus two JSON schemas, that's it. But because of **who sat at the table.** OpenAI and Google agreeing on a shared plugin format while competing on models was unimaginable a year ago. It signals that competition in the agent ecosystem is shifting from "who has better tool capabilities" to "who uses tools more intelligently." The tools themselves are becoming shared infrastructure; how agents use them is the new differentiator.

## What to Watch

1. **Whether Anthropic formally joins the TSC.** Claude Code's plugin structure is already compatible, but "structurally compatible" and "formally participating in governance" are different things.
2. **What v1.1 adds.** A working draft is underway on GitHub. The most discussed additions are authentication standardization and some form of plugin registry.
3. **Actual skill portability in practice.** Format unification isn't behavior unification — how the same SKILL.md performs across six clients will be the real litmus test for ecosystem maturity.

---

## References

| Data | Source | Date |
|---|---|---|
| Agent Plugins 1.0.0 spec | [agent-plugins.org/specification](https://agent-plugins.org/specification) | 2026-08-11 |
| Vercel announcement | [vercel.com/blog/introducing-agent-plugins](https://vercel.com/blog/introducing-agent-plugins) | 2026-08-06 |
| Google joining | [developers.googleblog.com](https://developers.googleblog.com/agent-plugins-package-your-skills-tools-and-more/) | 2026-08-06 |
| GitHub spec repo | [github.com/agentplugins/agent-plugins-spec](https://github.com/agentplugins/agent-plugins-spec) | As of 2026-08-21, 1.1k stars |
| Compatible clients list | [agent-plugins.org](https://agent-plugins.org/) compatible clients page | Checked 2026-08-21 |
