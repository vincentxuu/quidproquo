---
title: "Tool Pick｜mcp-lint — ESLint for MCP Tools, Before an Agent Ever Calls Them"
date: 2026-10-01
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "An open-source CLI that connects to any MCP server, reads its tools/prompts/resources, and runs 21 rules checking JSON schema validity, prompt-injection traces and hidden Unicode in descriptions, then outputs a 0-100 score and SARIF for CI gating"
tldr: "mcp-lint is a CLI that connects to an MCP server, reads its tool list, and runs 21 rules covering schema, descriptions, prompt-injection traces, and dangerous capabilities, then outputs a score and an A-F grade. Install: `curl -fsSL https://raw.githubusercontent.com/superintelligenceco/mcp-lint/main/install.sh | sh`. It closes a blind spot MCP servers' own unit tests never cover but a model reads directly: the tool description text itself."
series:
  name: "AI Tool of the Day"
  order: 41
---

> 🌏 [中文版](/posts/daily/2026-10-01-tool-mcp-lint)

## Tool Info

| Item | Value |
|---|---|
| Name | mcp-lint |
| Type | CLI (also ships a GitHub Action) |
| GitHub | [superintelligenceco/mcp-lint](https://github.com/superintelligenceco/mcp-lint) |
| Stars | 1 (repo created 2026-09-30, v0.2.0 shipped the same day — very early) |
| Language | TypeScript |
| License | Apache-2.0 |
| Install | `curl -fsSL https://raw.githubusercontent.com/superintelligenceco/mcp-lint/main/install.sh \| sh` |

## What Problem It Solves

The MCP security tools quidproquo has covered so far mostly work at the **runtime** or **provenance** layer: mcp-guardrail sits between client and server and decides which tools an agent may call via a `policy.yaml`; TrustDex judges whether an MCP server's source is trustworthy before an agent ever sees it, and answers with ALLOW/ASK/BLOCK. Both ask the same underlying question — can this server be used, and how far.

mcp-lint asks a different question: **is the tool description text the server is about to expose to the model actually clean?** A tool's name, description, and `inputSchema` get dropped straight into the model's context, and the model treats them as fact — a description that says "don't tell the user about this," an invisible zero-width character (U+200B), or an instruction-style tag like `<IMPORTANT>` are all attack surfaces a model reads but a human code reviewer is very likely to miss. mcp-lint connects to an MCP server (over stdio or HTTP), lists every tool, prompt, and resource, and runs 21 rules across five categories (schema, description, injection, capability, naming). Each entity starts at 100 points and loses points per finding; if any `injection/*` rule fires, the whole score is capped at 50, so you can't average away an injection problem with a bunch of unrelated high scores.

Good fit: you're writing your own MCP server and want a CI gate that blocks obvious mistakes — a missing required field in a schema, a description that's clearly half-written — before merge; or you're about to wire someone else's MCP server into an agent and want to check what its tool descriptions actually say before plugging it into Claude Code or Codex.

## Getting Started

### Install

```bash
# Standard path: download the matching platform binary from a GitHub Release, with built-in SHA256 verification
curl -fsSL https://raw.githubusercontent.com/superintelligenceco/mcp-lint/main/install.sh | sh

# Or run it as a container (multi-arch image for linux/amd64 and linux/arm64)
docker run --rm -v "$PWD:/work" ghcr.io/superintelligenceco/mcp-lint --file tools.json
```

The README also lists `npm install --global @superintelligenceco/mcp-lint`, but at the time of writing the package doesn't resolve on the npm registry yet (likely still mid-publish). The GitHub Release v0.2.0 binaries, `SHA256SUMS`, and SPDX SBOM are real, downloadable files, so the curl installer above is the reliable path for now.

### Basic Usage

```bash
# Launch and lint a stdio MCP server directly
mcp-lint -- npx -y @modelcontextprotocol/server-everything

# Lint a Streamable HTTP server that needs an auth header
mcp-lint --url https://mcp.example.com/mcp -H "Authorization: Bearer $MCP_TOKEN"

# A saved tools/list JSON file can be linted offline, no need to actually start the server
mcp-lint --file tools.json --min-score 80
```

Sample output (excerpted from the README):

```text
tool fetchUrl
  error    injection/instruction-phrases   The description tells the model to "not tell the user"
  warning  capability/unconstrained-network  Parameter url has no domain restriction

Score 50/100  Grade F  (6 errors, 10 warnings, 3 info)
Failed: score is below the minimum of 70.
```

### Advanced Usage

```bash
# Save one connection's snapshot, then lint the snapshot in CI without restarting the server each time
mcp-lint --save mcp-snapshot.json -- node dist/server.js
mcp-lint --file mcp-snapshot.json --min-score 85 --sarif mcp-lint.sarif
```

The SARIF report feeds directly into GitHub code scanning, and the project ships a ready-made GitHub Action that turns a PR check red when the score misses `min-score`:

```yaml
- uses: superintelligenceco/mcp-lint@v0.2.0
  with:
    command: node dist/server.js
    min-score: "80"
    upload-sarif: "true"
```

## Compared to Existing Tools

| | mcp-lint | mcp-guardrail | TrustDex |
|---|---|---|---|
| What it checks | The tool/prompt/resource metadata text itself | Runtime permission on every tool call | Source trust before an agent is exposed to the server |
| When it runs | Dev time / CI, can run offline | Runtime, sits between client and server | Before an agent sees the server for the first time |
| Needs an actual tool call | No (`--file` lints a saved snapshot offline) | Yes (the proxy intercepts the call) | No |
| Output plugs into a CI gate | Yes (SARIF + GitHub Action) | No (runtime audit log) | No (ALLOW/ASK/BLOCK before launch) |
| Catches "instructions hidden in a description" | Yes (the injection/* rule group) | No | No (only looks at source, not content) |

## Caveats

- **Very early-stage project.** Created 2026-09-30, GitHub shows just 1 star, and v0.2.0 was its first tagged release the same day. The feature set is complete, but it hasn't been battle-tested by outside users, and it's unclear yet whether the rule set has obvious false positives.
- **The npm package doesn't resolve yet.** The README badge points to `@superintelligenceco/mcp-lint`, but the npm registry returned 404 as of this writing — likely mid-publish or not yet synced. Use the curl installer or Docker instead of waiting on npm.
- **It only checks exposed metadata, not runtime behavior.** Rules like `capability/shell-exec` and `capability/unconstrained-network` just flag a tool as potentially risky — they don't execute anything, and they can't tell if a server swaps its description dynamically after it's live. That gap is still mcp-guardrail's territory.
- **Rules rely on string/pattern matching.** `injection/instruction-phrases` catches known phrasings like "ignore previous instructions," but a rewording or a different language isn't guaranteed to trip it. Treat it as a first filter, not the only line of defense.

## Today's Takeaway

Most MCP security tools that have surfaced recently ask "can this server be trusted" or "should this particular call be allowed" — both runtime questions. mcp-lint is a reminder that something happens earlier: a tool's name, description, and schema all land in the model's context before any call ever happens. Checking whether code is written correctly has been standard practice for thirty years, courtesy of tools like ESLint. The equivalent check — whether the metadata exposed to a model is written *safely* — is only now getting its first tools in the MCP ecosystem.

## References

- [superintelligenceco/mcp-lint — GitHub](https://github.com/superintelligenceco/mcp-lint)
- [mcp-lint README (full rule list and scoring)](https://github.com/superintelligenceco/mcp-lint/blob/main/README.md)
- [mcp-lint v0.2.0 Release Notes](https://github.com/superintelligenceco/mcp-lint/releases/tag/v0.2.0)
- [mcp-lint documentation site (architecture)](https://superintelligenceco.github.io/mcp-lint/architecture/)
- [Model Context Protocol specification (tools/list, inputSchema)](https://modelcontextprotocol.io/specification)
