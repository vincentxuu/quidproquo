---
title: "Claude Code Plugins & Marketplaces: Packaging Skills, Hooks, and MCP into One Installable Unit"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, plugins, marketplace, skills, hooks]
lang: en
tldr: "Plugins add distribution, not new capabilities: they collect skills, agents, hooks, and MCP settings scattered across .claude/ into one manifest-backed directory that marketplaces can install, update, and version-pin. This post covers plugin structure, the minimal build flow, publishing a marketplace, and dependency version constraints."
description: "A deep dive into Claude Code plugins: plugin.json manifest and directory layout, ${CLAUDE_PLUGIN_ROOT}, local testing with --plugin-dir, the seven marketplace plugin source types, git tag-based version resolution, and when to ship a plugin instead of a standalone skill."
draft: true
series:
  name: "Claude Code Deep Dives"
  order: 16
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-plugins-marketplaces-guide)

The previous posts in this series covered [Skills](/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide) and [Hooks](/posts/tech/deep-dive/2026-03-27-claude-code-hooks-guide) — one extension type at a time. But when you want to hand a set of skills plus their matching hooks plus an MCP server to your team or community, copying files one by one becomes a disaster. Plugins exist for exactly this step.

## Plugins Solve Distribution, Not Capability

First, be clear about where the increment is. Skills, subagents, hooks, and MCP servers can all be configured individually in `.claude/` — no plugin needed. The one thing plugins add: they collect those scattered settings into a self-contained directory with a manifest, turning them into **one** versioned, installable unit.

The official comparison between the two approaches is blunt: standalone (`.claude/` directory) fits personal workflows, project-specific customizations, and quick experiments; plugins fit sharing with teammates, distributing to the community, and reuse across projects.

There's one more difference after installation: namespacing. The `hello` skill inside `my-first-plugin` is invoked as `/my-first-plugin:hello`. Multiple plugins with same-named skills won't clobber each other — something standalone can't do.

## Directory Structure

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json     # manifest (the only thing that lives here)
├── skills/             # <name>/SKILL.md
├── commands/           # flat .md skills (legacy format)
├── agents/             # custom sub-agents
├── hooks/
│   └── hooks.json      # event handlers
├── .mcp.json           # MCP server configs
├── .lsp.json           # LSP server configs (code intelligence)
├── monitors/           # background monitors
└── settings.json       # defaults applied when enabled
```

Two common pitfalls:

1. **Only `plugin.json` goes inside `.claude-plugin/`.** `skills/`, `agents/`, and `hooks/` all sit at the plugin root; putting them inside `.claude-plugin/` means they never get read.
2. **On install, the plugin directory gets copied to `~/.claude/plugins/cache`.** So when a skill or hook references bundled scripts, don't use relative paths reaching outside the plugin — those files won't come along. To reference files inside the plugin, use the `${CLAUDE_PLUGIN_ROOT}` environment variable, which always points at the plugin root.

## Building Your First Plugin

Three minimal steps:

```bash
mkdir my-first-plugin/.claude-plugin
```

Write the manifest:

```json
{
  "name": "my-first-plugin",
  "description": "A greeting plugin to learn the basics",
  "version": "1.0.0",
  "author": { "name": "Your Name" }
}
```

Add a skill at `skills/hello/SKILL.md`:

```markdown
---
description: Greet the user warmly and ask how you can help them today.
disable-model-invocation: true
---

Greet the user named "$ARGUMENTS" warmly and ask how you can help them today.
```

Local testing needs no marketplace — just point at the directory:

```bash
claude --plugin-dir ./my-first-plugin
```

Inside, run `/my-first-plugin:hello Alex`; `$ARGUMENTS` picks up what you typed. After edits, `/reload-plugins` hot-reloads without restarting the session.

Two shortcuts worth knowing: a plugin that ships exactly one skill can place `SKILL.md` directly at the plugin root, skipping `skills/` entirely; and `claude plugin init my-tool` scaffolds a self-loading skill-directory plugin under `~/.claude/skills/`, skipping even the install step.

## Installing: From the Official Marketplace to Team Repos

On the user side it's two steps: add the marketplace (register the catalog), then install individual plugins. The official marketplace, `claude-plugins-official`, registers itself on first interactive launch and ships ready-made LSP code intelligence, GitHub/GitLab integrations, and `commit-commands`:

```
/plugin install github@claude-plugins-official
```

`/plugin` opens an interactive panel with four tabs: Discover (browse), Installed (manage), Marketplaces (add/remove catalogs), and Errors (load failures). Installing asks you to pick a scope: user (you, across all projects), project (written to `.claude/settings.json`, installed for every collaborator on this repo), or local (just you, in this repo only).

The third-party community marketplace `anthropics/claude-plugins-community` must be added manually:

```
/plugin marketplace add anthropics/claude-plugins-community
```

For teams, put the marketplace in the project's `.claude/settings.json` (`extraKnownMarketplaces`); members get it registered automatically once they trust the repo folder, and `enabledPlugins` controls which plugins are enabled by default.

## Publishing Your Own Marketplace

A marketplace is just a repo with `.claude-plugin/marketplace.json` at its root:

```json
{
  "name": "company-tools",
  "owner": { "name": "DevTools Team" },
  "plugins": [
    {
      "name": "code-formatter",
      "source": "./plugins/formatter",
      "description": "Automatic code formatting on save",
      "version": "2.1.0"
    }
  ]
}
```

Each entry minimally requires `name` and `source`. Seven source types are supported: relative path (within the same repo), `github`, `url` (any git URL), `git-subdir` (sparse clone of a monorepo subdirectory), `npm`, `archive` (HTTPS zip download, optionally sha256-pinned), and `command` (a local command that prints the plugin directory). Git-based sources accept `ref` and `sha` to pin an exact commit.

Hosting is flexible: GitHub is officially recommended (`owner/repo` shorthand just works), and any git service including self-hosted servers works too — SSH URLs and branch suffixes like `#v1.0.0` included. Private repos are supported through your existing git credential helpers. On Team/Enterprise plans you can also distribute via Organization settings, synced by the Claude GitHub App so users never touch git credentials.

## Dependency Version Constraints

A plugin can declare dependencies on other plugins in its manifest:

```json
{
  "name": "deploy-kit",
  "version": "3.1.0",
  "dependencies": [
    "audit-logger",
    { "name": "secrets-vault", "version": "~2.1.0" }
  ]
}
```

A bare string tracks the latest version; the object form takes a semver range (`~2.1.0`, `^2.0`, `=2.1.0`). Without a constraint, the next upstream release moves everyone's dependency via auto-update — and can break your plugin without warning.

Version resolution runs off git tags named `{plugin-name}--v{version}`. Authors handle tagging with one command:

```bash
claude plugin tag --push
```

It validates the plugin contents, checks that the manifest and marketplace entry agree on the version, then tags and pushes. At install time, Claude Code lists the repo's tags and fetches the highest version satisfying the range. When multiple installed plugins constrain the same dependency, Claude Code intersects the ranges and resolves the highest version satisfying all of them; disjoint ranges fail outright with `range-conflict`.

Cross-marketplace dependencies are blocked by default — preventing one marketplace from silently pulling in sources you haven't reviewed. Opening them up requires an `allowCrossMarketplaceDependenciesOn` allowlist in the root marketplace's `marketplace.json`.

One more useful pattern: a manifest containing only `dependencies` and no components becomes a bundle — a platform team publishes `backend-standard`, and engineers install the whole standard toolkit with a single `claude plugin install`.

## When to Ship a Plugin

One axis decides everything: **does it need to leave your machine?**

- Only used in your own projects → standalone `.claude/`, fastest iteration. The official guidance is to start standalone and convert to a plugin when you're ready to share.
- Going to teammates or the community, needing versioned updates → plugin + marketplace.
- A single skill you want following you across projects → a `claude plugin init` skills-directory plugin is enough; skip the marketplace.
- A skill that only makes sense with a specific MCP server → the best plugin candidate, because packaging is the only way the MCP config travels with the skill.

How to design the skill itself is a separate topic — see [the Skills design deep dive](/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide); the hooks event model is in [the Hooks deep dive](/posts/tech/deep-dive/2026-03-27-claude-code-hooks-guide). For the series entry point, see [How Claude Code Works](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works).

One security note to close: plugins and marketplaces are highly trusted components that can execute arbitrary code with your user privileges. The official wording is "Only install plugins and add marketplaces from sources you trust" — before installing, check the Will install inventory and Context cost estimate in the `/plugin` panel so you know exactly what you're getting.

## References

- [Create plugins — Claude Code Docs](https://code.claude.com/docs/en/plugins) — plugin structure, manifest fields, `${CLAUDE_PLUGIN_ROOT}`, quickstart and migration steps
- [Discover and install prebuilt plugins — Claude Code Docs](https://code.claude.com/docs/en/discover-plugins) — marketplace installation flow, scopes, team configuration, and security warnings
- [Create and distribute a plugin marketplace — Claude Code Docs](https://code.claude.com/docs/en/plugin-marketplaces) — `marketplace.json` schema, seven plugin source types, hosting, and version resolution
- [Constrain plugin dependency versions — Claude Code Docs](https://code.claude.com/docs/en/plugin-dependencies) — declaring dependencies, semver constraints, git tag resolution convention, and cross-marketplace allowlists

## Update Log

- 2026-08-26: Initial version, written against the official code.claude.com docs (including the plugin dependency version constraint mechanism).
