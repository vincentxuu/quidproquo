---
title: "Tool Pick | agentgateway-lint — Catching Dangerous agentgateway Configs Before They Merge"
date: 2026-09-13
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "An open-source Python CLI that statically checks agentgateway (an MCP/LLM/A2A traffic gateway) config files for wide-open CORS, LLM backends with no rate limit, hardcoded secrets, and more — grading A-F for use as a CI gate"
tldr: "agentgateway-lint is a static linter for agentgateway config files. It reads the YAML/JSON once, runs a set of security and hygiene rules, and outputs an A-F grade. Install: git clone then python3 -m agentgateway_lint samples/risky.yaml, no dependencies needed. It addresses the gap that agentgateway itself only checks whether a config is well-formed, not whether it's dangerous."
series:
  name: "AI Tool of the Day"
  order: 29
---

> 🌏 [中文版](/posts/daily/2026-09-13-tool-agentgateway-lint)

## Tool Info

| Field | Value |
|---|---|
| Name | agentgateway-lint |
| Type | CLI (static config analysis / linter) |
| GitHub | [shriramkv/agentgateway-lint](https://github.com/shriramkv/agentgateway-lint) |
| Stars | 19 |
| Language | Python |
| License | MIT |
| Install | `git clone https://github.com/shriramkv/agentgateway-lint.git` (no dependencies, runs immediately) |

## What Problem It Solves

If your team runs [agentgateway](https://agentgateway.dev) — an open-source Rust project under the Agentic AI Foundation that routes MCP servers, LLM providers, A2A, and plain HTTP traffic through one config file made of binds, listeners, routes, backends, and policies — you'll find that single config file is powerful and easy to get subtly wrong without noticing: a CORS policy that allows a wildcard origin *and* credentials at the same time, an LLM backend exposed with no rate limit, an API key pasted as a literal string instead of an environment reference. agentgateway itself only validates that the config is well-formed at load time; a config that's syntactically fine but riddled with logical landmines loads and ships just the same.

agentgateway-lint fills exactly that gap. It reads the config once and runs a set of structural checks (do bind ports collide, does every route actually reach a backend) plus security and hygiene checks: a CORS wildcard combined with `allowCredentials` is flagged as an error, an MCP or LLM backend with no auth policy gets caught, an LLM backend with no rate limit triggers a denial-of-wallet warning, a secret written as a literal instead of something like `$OPENAI_API_KEY` gets flagged, an admin endpoint bound to `0.0.0.0` is caught, and a sensitive backend served over plain HTTP is caught too — then it hands back a single A-F grade with actionable, itemized findings instead of a pile of warnings you have to triage yourself. It's deliberately tolerant of unknown fields: agentgateway moves fast, and an unrecognized key is quietly left alone rather than flagged as an error.

Good fit for: a team that already keeps its agentgateway config under version control and wants to block obvious-but-costly mistakes — a too-open CORS policy, a hardcoded key — before a PR merges; or a team that wants a hard CI gate (`--min-grade B`) on config quality instead of relying on human reviewers to catch it by eye.

## Quick Start

### Install

```bash
# Core functionality has zero dependencies; just Python 3.9+
git clone https://github.com/shriramkv/agentgateway-lint.git
cd agentgateway-lint
python3 -m agentgateway_lint samples/risky.yaml

# Or install it as a proper executable (registers the agentgateway-lint command)
pip install .
agentgateway-lint config.yaml

# Add PyYAML if you need full YAML syntax coverage (anchors, multi-line strings, etc.)
pip install PyYAML
```

### Basic Usage

The repo ships `samples/risky.yaml`, deliberately packed with a handful of real-world mistakes — the clearest way to see what the rules actually check:

```yaml
config:
  adminAddr: "0.0.0.0:9901"        # → admin endpoint exposed to the world
binds:
  - port: 3000
    listeners:
      - protocol: HTTP
        routes:
          - policies:
              cors:
                allowOrigins: ["*"]     # → CORS wildcard
                allowCredentials: true  # → combined with wildcard, flagged as an error
            backends:
              - ai:
                  groups:
                    - providers:
                        - name: openai
                          backendAuth:
                            key: "sk-live-1234567890abcdef"  # → secret written as a literal
  - port: 3000                       # → collides with the port 3000 bind above
    listeners:
      - protocol: HTTP
        routes:
          - name: mcp-fanout
            backends:
              - mcp:
                  targets:
                    - name: everything  # → MCP backend with no auth policy
```

```bash
agentgateway-lint samples/risky.yaml
# Per the README: this config grades F, with every issue above listed individually
# Compare against the clean version to see the difference:
agentgateway-lint samples/clean.yaml
```

### Advanced Usage

Wire it into CI so the pipeline fails whenever a config doesn't grade at least B:

```yaml
# .github/workflows/lint.yml
- name: Lint agentgateway config
  run: |
    pip install .
    agentgateway-lint config.yaml --min-grade B
```

```bash
# Machine-readable output for a dashboard
agentgateway-lint config.yaml --format json

# Generate a shields.io badge JSON you can drop straight into a README
agentgateway-lint config.yaml --format badge > badge.json
```

## Comparison With Existing Approaches

| | agentgateway-lint | agentgateway's built-in validation | A generic YAML linter (e.g. yamllint) |
|---|---|---|---|
| Checks the config is well-formed | ✅ | ✅ | ✅ (structural level only) |
| Understands agentgateway-specific fields (binds/backends/mcp…) | ✅ | ✅ | ❌ |
| Checks security semantics (CORS/auth/rate limit) | ✅ | ❌ | ❌ |
| Usable as a CI grade gate (`--min-grade`) | ✅ | Not supported — only load-or-fail | Requires writing your own rules |
| Core functionality has zero dependencies | ✅ (JSON fully supported; a built-in reader handles basic YAML) | — | Depends on the implementation |

## Caveats

- **About a month old, 19 stars, single maintainer.** The rule set almost certainly doesn't cover every corner of agentgateway's syntax, and unrecognized fields are silently ignored rather than flagged — meaning a genuinely dangerous new config shape might slip through unnoticed. Don't treat it as your only line of defense.
- **Purely static analysis.** It only inspects the config file itself — it won't verify that a backend is actually reachable or that credentials are valid at runtime; that still needs separate testing.
- **The built-in YAML reader handles block-style syntax only.** Anchors, multi-line strings, and other advanced YAML features need PyYAML installed for full coverage, or you risk false negatives; JSON input isn't affected by this limitation.

## Today's Takeaway

Collapsing all agent traffic routing into one YAML file is convenient to manage, but it also concentrates the blast radius when that file gets something wrong — a CORS policy left too open, or an LLM backend with no rate limit, might be the only thing standing between your company and a very bad day. What agentgateway-lint does is small (read a file once, run a handful of rules), but it moves the question "is this config safe" from "we'll find out when it breaks" to "caught at the PR stage" — which is exactly where a static analysis tool should sit.

## References

- [shriramkv/agentgateway-lint GitHub repo](https://github.com/shriramkv/agentgateway-lint): full README — design motivation, install instructions, CLI flags, the list of structural and security rules, the grading formula, and the CI example.
- [samples/risky.yaml](https://github.com/shriramkv/agentgateway-lint/blob/main/samples/risky.yaml): source of the sample config shown in this article.
- [pyproject.toml](https://github.com/shriramkv/agentgateway-lint/blob/main/pyproject.toml): source for the license (MIT), package name, and CLI entry point (`agentgateway-lint`).
- GitHub API repo metadata (`shriramkv/agentgateway-lint`): stars (19), language (Python), creation date (2026-08-13), and license (MIT), via the GitHub REST API.
- [agentgateway.dev](https://agentgateway.dev): source for agentgateway's own positioning (Agentic AI Foundation, MCP/LLM/A2A traffic gateway).
