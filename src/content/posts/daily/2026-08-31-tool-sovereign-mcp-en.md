---
title: "Tool Pick | Sovereign MCP — Catching Insecure Terraform Before the Agent Finishes Writing It"
date: 2026-08-31
category: daily
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An MCP server scans Terraform for security misconfigurations the moment an agent generates it, and fixes what it can, instead of waiting for a PR or CI to catch it"
tldr: "Sovereign MCP (sovereign-observer-mcp) is a locally-run MCP server that scans and auto-fixes Terraform security misconfigurations while an agent is writing them. Install: claude mcp add sovereign -- uvx sovereign-observer. It solves the problem that AI-generated IaC is insecure by default, and the mistake usually isn't caught until a PR or production."
series:
  name: "AI Tool of the Day"
  order: 16
---

> 🌏 [中文版](/posts/daily/2026-08-31-tool-sovereign-mcp)

## Tool Info

| Field | Value |
|---|---|
| Name | Sovereign MCP (sovereign-observer-mcp) |
| Type | MCP server (Terraform security scanning, checked as the agent writes code) |
| GitHub | [kraken222/sovereign-observer-mcp](https://github.com/kraken222/sovereign-observer-mcp) |
| Stars | 1 |
| Language | Python |
| License | Apache-2.0 |
| Install | `claude mcp add sovereign -- uvx sovereign-observer` |

## What Problem It Solves

Have you had an agent write Terraform for you, only to get blocked by CI's security scan later, discovering the RDS instance wasn't encrypted, the S3 bucket was publicly readable, or the database was missing deletion protection? A model's memorized provider defaults optimize for "it works," not "it is safe" — a misconfiguration like this is one attribute change in the editor, a review cycle once it's in a PR, and an incident once it ships. CI already catches this; it just catches it three days and one review comment later.

Sovereign MCP moves the scan to the moment the agent generates the code: you ask it to add an RDS instance for a service, it writes the HCL, calls `scan_terraform` on its own, gets back a findings list with file and line numbers, calls `apply_fixes` to mechanically correct what's safe to auto-fix, and only then shows you the result. The scan engine runs locally, built on the open-source Checkov, needs no account, and makes no network call on the default path — your Terraform never leaves your machine. Connect an organization account and the agent can call `org_requirements` before it even starts writing, pulling in your company's own rules (e.g. "backup retention must be at least 365 days") so a violation never gets written in the first place, instead of being written and then fixed.

Best for: teams that have agents (Claude Code, Cursor, VS Code Copilot, and Windsurf are all supported) generating a lot of IaC and want to move security review from the PR stage into the editor; also useful for teams that want compliance framework mappings (SOC 2, ISO 27001, PCI-DSS, and more) to cut down audit work. It doesn't scan running cloud resources and isn't a compliance assessment by itself — it only operates on the Terraform files themselves.

## Quick Start

### Installation

```bash
# Claude Code
claude mcp add sovereign -- uvx sovereign-observer
```

Cursor (`~/.cursor/mcp.json`), VS Code + GitHub Copilot (`.vscode/mcp.json`), and Windsurf (`~/.codeium/windsurf/mcp_config.json`) all use the same `uvx sovereign-observer` command — only the config file location differs. The first run downloads the scan engine (~100MB); after that it runs fully locally with no network needed.

### Basic Usage

Once installed, you don't call the tools yourself — just ask the agent to do something, and it decides when to scan:

```
You:   Add an RDS instance for the orders service
Agent: [writes HCL] → [calls scan_terraform] → [calls apply_fixes, fixes 4 findings] → shows the result
```

`scan_terraform` can scan files on disk or an agent's unsaved buffer, returning findings by severity with file and line numbers; `explain_finding` gives the full remediation for one finding — what's wrong and the exact fix; `secure_template` hands back a hardened starting point for a resource type, so the insecure version never gets written at all.

### Advanced Usage

With an organization account connected, your company's rules apply before the agent even starts writing:

```bash
# Get a token from Integrations → GitHub in the dashboard
export SOVEREIGN_TOKEN=...
```

```
You:   Add an RDS instance for the orders service
Agent: → org_requirements("aws_db_instance")
      ← "backup_retention_period must be at least 365"
        "region must be one of: eu-west-1, eu-central-1"
      [writes Terraform that already satisfies both]
      → scan_terraform → clean
```

Org rules are maintained as YAML in a dashboard, and findings from them are tagged `source: org_policy` so they're distinguishable from built-in rules. The only request this path makes is a `GET` for the org's rules — the README notes a test, `test_no_terraform_is_ever_uploaded`, that asserts nothing is sent up at the transport level, and that without a connected org account the server opens no socket at all.

## Comparison With Existing Tools

| | Sovereign MCP | Checkov CLI (standalone) | CI-stage scanning (tfsec / Checkov in CI) |
|---|---|---|---|
| Intervenes at the moment the agent generates code | ✅ | ❌ | ❌ |
| Rules can take effect before code is written (`org_requirements`) | ✅ | ❌ | ❌ |
| Provides mechanical auto-fixes (`apply_fixes`) | ✅ (single-attribute, verified-safe fixes only) | Requires custom integration | Usually reports only, doesn't fix |
| Compliance framework mappings (SOC 2 / ISO 27001 / PCI-DSS…) | ✅ | Depends on plugins | Depends on plugins |
| Feedback loop | In-editor, immediate | On manual run | After PR / merge |

## Caveats

- **`apply_fixes` is deliberately narrow**: it only applies single-attribute, in-place changes from a hand-verified allowlist, and never touches a value wired to a variable or expression, because even a syntactically clean mechanical fix can take a running system down.
- **Not a compliance assessment**: `check_compliance` returns control *mappings* that shorten an audit, but a clean scan doesn't mean the organization is compliant — most frameworks also require governance, process, and training obligations a configuration scanner can't observe. The README also states plainly that NCA (Saudi) control identifiers are provisional pending reconciliation with the official catalogue, and recommends citing subdomain names instead of IDs for now.
- **Scans Terraform only**: it doesn't scan live cloud accounts, container images, or dependencies. For live multi-cloud posture management and attack-path analysis, the vendor points to the same author's commercial product, [Sovereign Observer](https://sovereign-observer.com) — this MCP server is the free, editor-side slice of it.

## Takeaway

Most security tools intervene after the code is already written — a PR review, a CI pipeline, a post-deploy cloud scan — and the cost of fixing one misconfigured attribute climbs a notch at every stage further out. Sovereign MCP moves the intervention point to the exact moment the agent generates the code, and with `org_requirements` it even feeds the rules into the generation process itself, so a misconfiguration never exists in the first place instead of being caught and fixed after the fact. It's the same idea as architecturally eliminating an attack surface rather than bolting on protection afterward — except this time what's being eliminated isn't a dangerous tool, it's the moment a dangerous setting gets written.

## References

- [kraken222/sovereign-observer-mcp GitHub repo](https://github.com/kraken222/sovereign-observer-mcp): README, installation, tool table, org policy mechanism, and limitations all come from the official repo.
- [kraken222/sovereign-observer-mcp repo metadata](https://github.com/kraken222/sovereign-observer-mcp): Apache-2.0 license, Python, created 2026-08-30, confirmed via the GitHub API.
- [Checkov (bridgecrewio/checkov)](https://github.com/bridgecrewio/checkov): the open-source project Sovereign MCP's scan engine is built on, Apache-2.0 licensed.
