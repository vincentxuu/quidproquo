---
title: "Tool Pick | comfy-mcp — Comfy's Official MCP Server That Lets Agents Run ComfyUI on Your Machine"
date: 2026-08-20
category: daily
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "Comfy's official local MCP server wraps comfy-cli into 39 MCP tools, letting Claude Code, Cursor, and other agents run ComfyUI workflows on your machine without you touching the terminal"
tldr: "comfy-mcp is Comfy's official local MCP server that wraps the full comfy-cli feature set into 39 MCP tools. Install: pip install comfy-mcp \"comfy-cli>=1.14.0\". It solves the problem where agents trying to run image/video generation workflows for you still need you to manually open a terminal, type commands, and verify that the right nodes and models are installed."
series:
  name: "AI Tool of the Day"
  order: 5
---

> 🌏 [中文版](/posts/daily/2026-08-20-tool-comfy-mcp)

## Tool Info

| Field | Value |
|---|---|
| Name | comfy-mcp |
| Type | MCP server |
| GitHub | [Comfy-Org/comfy-mcp](https://github.com/Comfy-Org/comfy-mcp) |
| Stars | 88 |
| Language | Python |
| License | AGPL-3.0-or-later OR Commercial |
| Install | `pip install comfy-mcp "comfy-cli>=1.14.0"` |

## What Problem It Solves

Ever tried using an agent for image or video generation tasks, only to find it can merely *tell you* which ComfyUI workflow and nodes to use — while installing packages, launching the server, running the workflow, and checking outputs are all on you? ComfyUI's native workflow is drag-and-drop nodes in a browser and click Queue. Agents had no standard way to touch the ComfyUI instance running on your machine.

comfy-mcp is a local MCP server maintained by Comfy-Org (the company behind ComfyUI). It wraps the entire `comfy-cli` into 39 MCP tools for agents to call: from `run_workflow` and `generate_image` for direct execution, to `validate_workflow` and `workflow_deps` for pre-flight checks on whether the required node packages are installed, `search_templates` / `fetch_template` for pulling ready-made workflows from the official template library, and even `launch_comfyui` / `install_node` so the agent can start the server and install packages on your behalf. Every tool calls `comfy --json --where local` under the hood — essentially turning commands you'd type manually in the terminal into structured, agent-callable interfaces.

Best-fit scenarios: automating image/video generation pipelines with Claude Code or Cursor — batch-running workflow variants, having the agent debug "why won't this workflow produce output" (via `validate_workflow` / `node_dependencies` to find missing nodes), or letting the agent pick a template from the official library and tweak parameters to your requirements.

## Quick Start

### Installation

```bash
pip install comfy-mcp "comfy-cli>=1.14.0"
comfy install    # if you don't have a ComfyUI workspace yet
comfy launch     # start ComfyUI
```

### Basic Usage

```json
// mcp.json for Claude Desktop / Cursor
{
  "mcpServers": {
    "comfy-mcp": {
      "command": "comfy-mcp",
      "env": {
        "COMFY_BIN": "/path/to/venv/bin/comfy"
      }
    }
  }
}
```

Core tools available once the agent connects:

- `server_info()` — check if ComfyUI is running and what hardware is available
- `search_templates(query, tag, model)` — search the official template library for workflows
- `run_workflow(workflow_path, wait, confirm_spend)` — execute a workflow
- `job(action="status|wait|watch|cancel", prompt_id)` — monitor queued jobs
- `fetch_outputs(prompt_id, out_dir)` — retrieve generated images/videos

### Advanced Usage

```bash
# Validate that all node packages a workflow needs are installed before running
comfy-mcp validate_workflow --workflow_path ./my_workflow.json

# Check dependencies and install missing nodes
comfy-mcp workflow_deps --workflow_path ./my_workflow.json
```

You can also fan out a single workflow into multiple parameter variants for the agent to batch-compare:

```bash
comfy-mcp vary_workflow \
  --workflow_path ./portrait.json \
  --slots '{"steps": [20, 30, 40], "cfg": [4, 7]}' \
  --out_dir ./variants
```

## Comparison with Alternatives

| | comfy-mcp | Manual ComfyUI Web UI | Comfy Cloud MCP |
|---|---|---|---|
| Agent can execute workflows directly | ✅ | ❌ | ✅ |
| Runs on your machine with your GPU/models | ✅ | ✅ | ❌ (runs on Comfy Cloud GPU) |
| No cloud credits needed | ✅ | ✅ | ❌ (pay-per-use) |
| Workflow dependency checks (nodes/models) | ✅ | Manual troubleshooting | Guaranteed by cloud environment |
| Officially maintained | ✅ Comfy-Org | — | ✅ Comfy-Org |

## Caveats

- **Dual-licensed under AGPL-3.0-or-later or a commercial license** — not plain MIT/Apache. If you're integrating comfy-mcp into a commercial product offered as a service, AGPL's copyleft clause may require you to open-source the combined work. Check whether your use case qualifies, or negotiate a commercial license.
- **Still in Beta** — the README itself labels it "Status: Beta." CI currently runs only on Python 3.10 and 3.14, with no explicit guarantee for versions in between.
- **Spend-guarded tools**: tools like `partner_generate` that call paid partner APIs always prompt for confirmation. `run_template` / `run_workflow` require an explicit `confirm_spend=True` to trigger the confirmation prompt, preventing agents from accidentally burning through your API credits.

## Takeaway

What makes comfy-mcp interesting isn't just "ComfyUI got an MCP interface." It's that the tool took the operational logic originally designed for humans typing commands in a terminal via comfy-cli and brought the full set — all 39 tools — into the agent-callable world. That includes steps like "validate dependencies before running" and "search the template library" — pre-flight checks that an experienced user would know to do, now structured as actions the agent can proactively call. The lesson: when a mature CLI tool connects to MCP, the real value isn't wrapping a thin adapter layer — it's also structuring those "extra steps an experienced user would take" into callable tools.

## References

- [Comfy-Org/comfy-mcp — GitHub](https://github.com/Comfy-Org/comfy-mcp)
- [Open Sourcing Comfy MCP on Local — Comfy Blog](https://blog.comfy.org/p/open-sourcing-comfy-mcp-on-local)
