---
title: "Tool Pick｜gitlab-mcp-server — Two Tools Cover All 868 GitLab API Actions"
date: 2026-10-02
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An open-source Go MCP server for GitLab that exposes just two dynamic tools — find and execute — to reach 868+ REST/GraphQL actions, keeping startup context cost fixed at around ten thousand tokens no matter how many GitLab features exist"
tldr: "gitlab-mcp-server is an open-source MCP server that covers 868 GitLab API actions (1,094 on Ultimate) through two dynamic tools, find and execute. Install: npx -y @jmrp.io/gitlab-mcp-server or docker run ghcr.io/jmrplens/gitlab-mcp-server:latest. It solves the problem where mapping every API action to its own MCP tool floods the client's context window before the model does any actual work."
series:
  name: "AI Tool of the Day"
  order: 42
---

> 🌏 [中文版](/posts/daily/2026-10-02-tool-gitlab-mcp-server)

## Tool Info

| Item | Value |
|---|---|
| Name | gitlab-mcp-server |
| Type | MCP server (static binary / Docker / npm / PyPI / NuGet) |
| GitHub | [jmrplens/gitlab-mcp-server](https://github.com/jmrplens/gitlab-mcp-server) |
| Stars | 42 (created 2026-04-11, actively maintained, v3.1.0 shipped 2026-09-30) |
| Language | Go |
| License | MIT |
| Install | `npx -y @jmrp.io/gitlab-mcp-server` |

## What Problem It Solves

Have you ever wired up an MCP server for an API with real surface area? GitLab's REST and GraphQL APIs together span hundreds of endpoints — projects, branches, merge requests, issues, pipelines, jobs, groups, wikis, environments, deployments, packages, the container registry, runners, feature flags, CI/CD variables, and more. The standard approach — one MCP tool per API action — means the tool list's names, descriptions, and input schemas alone can eat a large chunk of the client's context window before the model has done anything at all; it drowns in the catalog before it starts working.

gitlab-mcp-server collects all 868 of those actions (1,094 on GitLab.com Ultimate) into a runtime action catalog, and by default exposes only two MCP tools: `gitlab_find_action` searches the catalog by keyword or natural language to locate the right action, and `gitlab_execute_action` runs it with the given parameters. What the model sees is always the schema for these two tools — it doesn't grow as GitLab ships more features or as higher-tier licenses unlock more endpoints. The maintainer measured this directly: under the default configuration, startup context lands at roughly 10,389 tokens regardless of whether you're on Free, Premium, or Ultimate (dropping to 1,724 if you turn off the shared resource/prompt context). For clients with more headroom, two alternative exposure modes exist: `meta` (34–52 domain-grouped tools) and `individual` (nearly one tool per action).

Where this fits: your agent needs to operate on GitLab — reviewing MRs, diagnosing why a pipeline failed, filing issues, drafting release notes — without GitLab's tool list crowding out every other MCP server's share of the context budget. It's also simply a solid, shipped example of the "dynamic tool" pattern if you're evaluating that design at real scale.

## Getting Started

### Install

```bash
# Zero install — the client launches it directly via npx
npx -y @jmrp.io/gitlab-mcp-server

# Or via Docker (auto-pulls the image)
docker run -i --rm -e GITLAB_TOKEN ghcr.io/jmrplens/gitlab-mcp-server:latest

# Or register it with Claude Code in one line
claude mcp add gitlab --env GITLAB_TOKEN=glpat-xxxx --transport stdio \
  -- docker run -i --rm -e GITLAB_TOKEN ghcr.io/jmrplens/gitlab-mcp-server:latest
```

`GITLAB_TOKEN` needs a GitLab Personal Access Token with the `api` scope. Self-managed GitLab also needs `GITLAB_URL` pointed at your instance.

### Basic Usage

```json
// Claude Desktop / Cursor / any client reading an mcpServers config
{
  "mcpServers": {
    "gitlab": {
      "command": "npx",
      "args": ["-y", "@jmrp.io/gitlab-mcp-server"],
      "env": { "GITLAB_TOKEN": "glpat-xxxxxxxxxxxxxxxxxxxx" }
    }
  }
}
```

Once connected, just ask in plain language — the model calls `gitlab_find_action` to locate the right action, then `gitlab_execute_action` to run it:

```text
"Review merge request !15 — is it safe to merge?"
"Why did the last pipeline fail?"
"List open issues assigned to me"
"Generate release notes from v1.0 to v2.0"
```

### Advanced Usage

```bash
# Read-only mode: disable every mutating action — good for letting an agent explore safely
GITLAB_MCP_READ_ONLY=true npx -y @jmrp.io/gitlab-mcp-server

# Safe mode: mutating actions stay visible, but return a JSON preview instead of actually running
GITLAB_MCP_SAFE_MODE=true npx -y @jmrp.io/gitlab-mcp-server
```

The two can run together: read-only removes the capability outright, while safe mode keeps it visible but dry-runs it first — useful for auditing or training runs.

## Compared to Existing Approaches

| | gitlab-mcp-server | One-tool-per-API-action | GitLab's own `glab` CLI wrapped as MCP |
|---|---|---|---|
| Tools exposed to the model | 2 by default (find/execute) | Hundreds or more | Usually still one per command |
| Startup context grows with feature count | No (fixed around 10K tokens) | Yes | Depends on the wrapper |
| Read-only / safe mode | Built-in env vars | Needs custom implementation | Needs custom implementation |
| Self-managed GitLab / OAuth | Yes (`GITLAB_URL` + OAuth mode) | Depends on implementation | Yes (native to `glab`) |
| Try before installing | Yes (hosted endpoint at `mcp.jmrp.io/gitlab`) | Usually not offered | No |

## Things to Watch

- **The hosted endpoint isn't meant for production use.** The README is explicit about this: `mcp.jmrp.io/gitlab` exists only so you can try it without installing anything — your token and every request pass through someone else's machine. For real use, install locally (npx, Docker, or the native binary) so credentials never leave your own environment.
- **Dynamic mode adds a layer of indirection.** Finding an action before executing it means one more model inference step than a traditional one-tool-per-action setup, which can cost more tokens on complex tasks than it saves — the fixed startup cost and the per-call cost are two separate ledgers, not one trade that always nets positive.
- **The maintainer withdrew their own previously published tool-calling benchmark.** The README states plainly that the earlier 99.5% success figure and related numbers were retracted because the measurement method leaked the expected answer into the scoring environment; a replacement benchmark harness is still being rebuilt. Don't treat the old numbers as evidence either way.
- **This is a solo-maintained project.** It's clearly active (a commit landed as recently as yesterday) and has 45 open issues, but there's no corporate backing or SLA — weigh that before depending on it in production.

## Today's Takeaway

Several MCP servers now run into the same structural problem: the richer an API's surface, the more the intuitive "one tool per action" approach floods the client's context window before the model gets to do anything. What gitlab-mcp-server's find/execute pattern really does is move "tool discovery" out of the schema layer and into runtime — the model's search only surfaces the handful of candidates it actually needs, instead of swallowing the full API's schema upfront. It's the same trade-off as "import everything" versus "look it up when you need it" in ordinary software engineering, just now priced in tokens instead of load time.

## References

- [jmrplens/gitlab-mcp-server — GitHub](https://github.com/jmrplens/gitlab-mcp-server)
- [gitlab-mcp-server README (install, tool surfaces, token footprint)](https://github.com/jmrplens/gitlab-mcp-server/blob/main/README.md)
- [gitlab-mcp-server v3.1.0 Release Notes](https://github.com/jmrplens/gitlab-mcp-server/releases/tag/v3.1.0)
- [Dynamic Toolset docs (find/execute design details)](https://github.com/jmrplens/gitlab-mcp-server/blob/main/docs/concepts/dynamic-tools.md)
- [AI Model Evaluation Results (withdrawal notice for the earlier benchmark)](https://github.com/jmrplens/gitlab-mcp-server/blob/main/docs/development/testing/model-results.md)
- [Model Context Protocol specification](https://modelcontextprotocol.io/specification)
