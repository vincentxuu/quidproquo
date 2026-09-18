---
title: "Tool Pick | TrustDex — Gate MCP Servers With ALLOW/ASK/BLOCK Before Your Agent Ever Sees Them"
date: 2026-09-19
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "A local-first, zero-dependency CLI that decides whether an MCP server, Agent Skill, or plugin is trustworthy before it's ever exposed to an agent, returning ALLOW/ASK/BLOCK, with signed snapshots to catch tampering later"
tldr: "TrustDex is a local-first, zero-runtime-dependency CLI that applies a policy to ALLOW/ASK/BLOCK any MCP server, Skill, or plugin before your agent can see it. Install: git clone, then npm test — no external packages needed. It fixes the default assumption that 'installable means trustworthy' by turning source review into an explicit gate before exposure, not an afterthought."
series:
  name: "AI Tool of the Day"
  order: 34
---

> 🌏 [中文版](/posts/daily/2026-09-19-tool-trustdex)

## Tool Info

| Field | Value |
|---|---|
| Name | TrustDex |
| Type | CLI (also runs as a GitHub Action) |
| GitHub | [grigent/trustdex](https://github.com/grigent/trustdex) |
| Stars | 1 (just released on 2026-09-18; a live count at time of writing) |
| Language | JavaScript (Node.js ≥ 20, zero runtime dependencies) |
| License | MIT |
| Install | `git clone https://github.com/grigent/trustdex.git && cd trustdex && npm test` |

## What Problem It Solves

Your agent's config file usually ends up with a growing `mcpServers` list assembled piecemeal: things you installed yourself, links a coworker sent you to add, snippets copied out of a tutorial. Once a client recognizes an entry, the agent can call it — nobody ever stopped to ask whether the source is trustworthy. A floating `@latest` version, an environment variable that looks like it's holding a secret, a command that shells straight out: these signals are usually buried in a long JSON blob nobody reads line by line.

TrustDex moves that judgment call to before the agent ever sees the tool. It reads your `mcp.json` (or Codex's `config.toml`), `SKILL.md` files, and plugin manifests, checks for observable signals — floating versions, install-on-run launchers, shell execution, filesystem-looking arguments, secret-like environment variable names, remote endpoints — and applies one of three built-in policy packs (`strict`, `official-first`, `development`) to return ALLOW/ASK/BLOCK for each entry. The `gate` command then writes a filtered config containing only the ALLOW entries; that's the file the agent actually loads, not the original unreviewed one. On later runs, `snapshot` and `diff` catch changes in source, version, or policy verdict, and `approve`/`recheck` layer an Ed25519 signature on top, so an "already reviewed" state becomes a record that can't be quietly edited later.

Good fit: a team that shares a base agent config but lets individuals add their own MCP servers — run a gate pass before handing it out; a CI check that blocks a PR from sneaking in an unreviewed remote MCP server; or just building the habit of reviewing before exposure into your own Claude Code or Codex setup, instead of having anything you install take effect immediately.

## Quick Start

### Install

```bash
git clone https://github.com/grigent/trustdex.git
cd trustdex
npm test        # Node's built-in `node --test` — package.json declares no runtime dependencies
```

### Basic Usage

```bash
# Check an MCP config against the built-in strict policy pack
node ./bin/trustdex.mjs inspect ./examples/mcp.json \
  --pack strict \
  --policy ./examples/trustdex.policy.json

# Write only the ALLOW entries to a new config the agent will actually load
node ./bin/trustdex.mjs gate ./examples/mcp.json \
  --pack official-first \
  --out .trustdex/gated-mcp.json
```

`examples/mcp.json` deliberately includes an unreviewed `calendar-helper@latest`, so running it under `strict` exits non-zero: `0` means everything was ALLOWed, `1` means something landed in ASK and needs a human look, and `2` means something was BLOCKed or the command itself failed — wire it straight into CI as a gate.

### Advanced Usage

```bash
# Run an online provenance lookup against a GitHub project, then explicitly
# record the result in a local trust store
node ./bin/trustdex.mjs provenance github modelcontextprotocol/servers
node ./bin/trustdex.mjs trust-source mcp io.github.user/server \
  --publisher "Example Publisher" \
  --out ./trust-store.json

# Re-inspect with that trust store attached — only sources it explicitly records get allowed
node ./bin/trustdex.mjs inspect ./mcp.json \
  --pack official-first \
  --trust-store ./trust-store.json
```

The `official-first` pack deliberately has no built-in allowlist of names that "look official." A source only gets allowed once you've explicitly written its publisher into the trust store; everything else stays in ASK or BLOCK.

## Comparison With Existing Approaches

TrustDex looks like it solves the same problem as [mcp-guardrail](/en/posts/daily/2026-08-25-tool-mcp-guardrail-en), which we covered earlier, but the timing is different: mcp-guardrail is a persistent proxy sitting between client and server that decides at call time; TrustDex is a one-shot CLI that decides whether the tool should be visible to the agent at all.

| | TrustDex | mcp-guardrail (runtime call-interception proxy) | Manual eyeballing of the config |
|---|---|---|---|
| When it decides | Before the agent sees the tool | At the moment the agent calls the tool | Whenever someone adds a new entry (manually) |
| What it decides on | Source, version drift, signatures, explicit trust-store evidence | Call-level rules defined in `policy.yaml` | Personal memory and judgment |
| Detects config drift over time | ✅ (snapshot + diff + signed recheck) | Requires a separate comparison | ❌ |
| Coverage | MCP servers + Agent Skills + plugin manifests + Codex `config.toml` | Currently focused on MCP stdio proxying | Unlimited scope, but no automation |
| Needs a persistent proxy process | ❌ (one-shot CLI / CI step) | ✅ | ❌ |

## Caveats

- v0.3 just shipped and currently has one star — it hasn't seen large-scale production use. The README is upfront about this: ALLOW only means "matches your configured policy," not "this tool is actually safe." It's not a malware scanner and doesn't sandbox anything; `THREAT_MODEL.md` explicitly lists "proving arbitrary third-party code is non-malicious" as out of scope.
- The first time you run it against an existing config, most third-party entries will land in ASK or even BLOCK, because `official-first` doesn't trust anything you haven't explicitly written into the trust store. Building that trust store takes real review time — it doesn't open everything up the moment you install it.
- `github-release` signature verification relies on GitHub's own reported verified status. A leaked signing key or a compromised upstream supply chain isn't covered — `THREAT_MODEL.md` also lists "protecting a stolen signing private key" as out of scope.

## Today's Takeaway

Tools we've covered before — mcp-guardrail, Sovereign MCP, mcp-spend-guard, agentgateway-lint — all guard the same half of the problem: once a tool is in the agent's hands, what dangerous things can it be stopped from doing. TrustDex is a reminder that the other half matters too: whether a tool gets shown to the agent at all should be a decision you can say no to, not something that's on by default. Turning "do I trust this source" into a signable, diffable, versioned record — instead of an ad hoc glance the moment you install something — leaves an audit trail you can actually go back and check.

## References

- [grigent/trustdex GitHub repo](https://github.com/grigent/trustdex): full README, covering install steps, the CLI command surface, policy pack behavior, and the trust-store format — the primary source for this article's technical detail.
- [TrustDex docs/THREAT_MODEL.md](https://raw.githubusercontent.com/grigent/trustdex/main/docs/THREAT_MODEL.md): explicitly lists in-scope and out-of-scope threats, used to verify the protection boundaries described in the Caveats section.
- [TrustDex package.json](https://raw.githubusercontent.com/grigent/trustdex/main/package.json): used to confirm the MIT license, the Node ≥20 requirement, and the zero-runtime-dependency claim.
- [mcp-guardrail tool pick (quidproquo)](/en/posts/daily/2026-08-25-tool-mcp-guardrail-en): the comparison point in this article's "Comparison With Existing Approaches" section — also MCP security, but at a different point in time.
