---
title: "Tool Pick｜agentscan — scan your MCP configs for hardcoded keys, unpinned packages and plain-http servers"
date: 2026-11-25
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "An open-source, MIT-licensed local CLI that scans MCP config files for Claude, Cursor, VS Code and Windsurf, flagging hardcoded secrets, unpinned packages and remote servers reached over plain http; the author published a census of 84,813 public config files the same day"
tldr: "agentscan is an open-source CLI that runs locally and checks MCP config files for three kinds of risk: hardcoded secrets, unpinned packages and plaintext transport. Install: pip install agentscan-si, then run agentscan scan. The author scanned 84,813 public config files and found likely-real credentials in 3.3% of repos."
series:
  name: "AI Tool of the Day"
  order: 90
---

> :globe: [中文版](/posts/daily/2026-11-25-tool-agentscan)

## Tool Info

| Field | Value |
|---|---|
| Name | agentscan (PyPI package `agentscan-si`; the installed command is `agentscan`) |
| Type | CLI (scans locally; configs and findings are not sent anywhere) |
| GitHub | [SonawaneMayur/agentscan](https://github.com/SonawaneMayur/agentscan) |
| Stars | 1 (checked 2026-11-26; repo created 2026-10-17) |
| Language | Python (3.10+; GitHub's language stats show Jupyter Notebook because the repo includes research notebooks) |
| License | MIT |
| Install | `pip install agentscan-si` (or `uv tool install agentscan-si` / `pipx install agentscan-si`) |

## What Problem It Solves

Have you counted how many MCP servers your editor has attached? Each one is a few lines of JSON in `.mcp.json` or `mcp.json`, yet those lines decide three things at once: what code runs on your machine, which credentials it receives, and where your data goes. These files also get committed to repos all the time, and few people review them line by line the way they review `package.json`.

agentscan does one simple thing: it reads the MCP config files on your machine and runs three rules over them. MCP001 (high) finds API keys, tokens and passwords written directly into `env`, `headers`, arguments or URLs. MCP002 (medium) finds `npx`/`uvx`/`pipx` packages without an exact version, meaning every client restart runs the latest release. MCP003 (high) finds remote servers reached over `http://` or `ws://`. It reads configs for Claude Desktop, Claude Code, Cursor, VS Code and Windsurf, and the scan runs entirely on your machine.

It is worth writing up today because on 11/24 the author published a census run with it. In October 2026 he collected every MCP config file GitHub code search could reach (84,813 files across 72,243 public repositories) and scanned each one. 36.9% of repos had at least one finding; 2,356 repos (3.3%) published what looks like a real credential, including 370 OpenAI keys, 62 GitHub tokens, 55 Google API keys, 24 Anthropic keys and 2 Stripe live keys; and only 6.8% of npm-based MCP servers were pinned to a version (2,602 of 38,111). It fits when you maintain several MCP configs and want a check before opening a PR, or want CI to block risky configs.

## Getting Started

### Install

```bash
# Requires Python 3.10 or newer
pip install agentscan-si
agentscan --version
```

### Basic Usage

```bash
agentscan scan                       # current directory plus your user-level client configs
agentscan scan path/to/project       # only configs inside that directory
agentscan scan ~/.cursor/mcp.json    # a single file
agentscan scan --format json         # machine-readable output
agentscan rules                      # list rules
```

Exit codes: `0` means no findings at or above the threshold, `1` means there are some, `2` means a bad path. The default threshold is high; adjust it with `--fail-on`.

### Advanced Usage

Block pull requests that add risky configs with GitHub Actions (the example from the README):

```yaml
# .github/workflows/agentscan.yml
name: agentscan
on: [pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v6
      - run: uv tool install agentscan-si
      - run: agentscan scan . --fail-on medium
```

For fixing what it finds, the author's article gives before/after examples: reference an environment variable instead of pasting the secret, pin the package version, and use `https://` for remote servers.

```json
// Secret: reference an environment variable (syntax varies by client, e.g. ${VAR} in Claude Code's .mcp.json)
"env": { "SERVICE_API_TOKEN": "${SERVICE_API_TOKEN}" }

// npm package: pin the version
"args": ["-y", "@scope/some-mcp-server@1.4.2"]
```

If a key was ever committed, deleting it from the file is not enough. Rotate it, because it stays in git history.

## How It Compares

| | agentscan | Reviewing configs by hand | GitHub secret scanning |
|---|---|---|---|
| Understands MCP config structure (env, args, headers) | ✓ | ✓ (human effort) | No, it looks for known key formats |
| Catches unpinned packages | ✓ (MCP002) | Easy to miss | Outside its scope |
| Catches plaintext http/ws transport | ✓ (MCP003) | Easy to miss | Outside its scope |
| Can block PRs in CI | ✓ (`--fail-on`) | ✗ | A platform feature; behavior depends on account settings |
| Notifies the issuing provider of known key formats | ✗ | ✗ | ✓ (the author notes this is what the partner program does) |

The point of the table is the division of labor: GitHub's mechanism works after the fact on known key formats, while agentscan is something you run yourself before committing, and it also looks at version pinning and transport. They do not replace each other.

## Things to Watch

- **Very early-stage project**: the repo was created on 10/17, had 1 star when checked, and has a single maintainer. The README roadmap still lists SARIF output, tool-description pinning (to detect rug pulls) and live checks of MCP servers for prompt injection, none of which exist yet. Today there are only the three rules above.
- **It reads configs, not servers**: it cannot detect a malicious MCP server or a poisoned tool description, nor secrets that live outside these client config files. In the README's config table, Claude Desktop lists only the macOS path.
- **Discount the census numbers**: this is the author running his own tool with his own criteria, with no third-party replication. "Likely real" is estimated from placeholder words, length and Shannon entropy, and the author himself notes possible misclassification, and that keys may have been revoked since they were committed. Coverage is limited to default branches of public repos that GitHub code search can reach, so it does not describe your private setup. He also stresses that a finding is a risk, not a compromise: an unpinned package is only dangerous if that package is ever hijacked.
- **Finding is not fixing**: the tool points at locations; rotating keys and choosing which versions to pin is still your job.

## Today's Takeaway

I used to think of an MCP config as "settings". It is really a supply chain (whose code runs), a credential store (which keys it gets) and a data exit (where things are sent) in one file. The detail from the census worth remembering: the most popular servers are the least pinned. `@playwright/mcp` appears in 5,420 repos and only 10% pin it, because the projects' own install instructions show the unpinned form. The default path is the risky one, and it is also the one everyone copies.

## References

- [SonawaneMayur/agentscan — GitHub (README, rules, license)](https://github.com/SonawaneMayur/agentscan)
- [I scanned 72,000 public AI agent configs. Here's what's exposed, and how to fix yours. — DEV Community (the author's census, 2026-11-24)](https://dev.to/sonawanemayur/i-scanned-72000-public-ai-agent-configs-heres-whats-exposed-and-how-to-fix-yours-5g3i)
- [agentscan-si — PyPI (package page)](https://pypi.org/project/agentscan-si/)
- [GitHub REST API: repo metadata for SonawaneMayur/agentscan (stars, creation date)](https://api.github.com/repos/SonawaneMayur/agentscan)
