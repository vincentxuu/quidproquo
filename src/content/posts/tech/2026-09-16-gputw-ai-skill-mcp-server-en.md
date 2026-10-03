---
title: "What Is GPUtw AI Skill: A Skill Pack and MCP Server for AI Coding Assistants to Manage Taiwan GPU Cloud"
date: 2026-09-16
category: tech
type: deep-dive
tags: [gputw-ai, mcp, agent-skills, gpu-cloud, open-source, developer-tools]
lang: en
tldr: "GPUtw AI Skill is an official Agent Skill pack plus MCP server that lets Claude Code, Codex, Cursor, Copilot, and Gemini CLI manage GPUtw's Taiwan-based GPU cloud using natural language. 18 MCP tools cover catalog queries, instance lifecycle, status monitoring, and Vault operations. MIT licensed."
description: "An overview of GPUtw AI Skill V1.1.0-beta.1: its architecture, MCP tool inventory, installation methods, security model, supported platforms, and how it differs from calling the REST API directly."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-09-16-gputw-ai-skill-mcp-server)

[GPUtw AI Skill](https://github.com/GPUtw-ai/GPUtw-Skill) is an official AI coding assistant skill pack from [GPUtw.ai](https://gputw.ai/en). It does one straightforward thing: packages GPUtw's REST API documentation and operational logic into an Agent Skill so that Claude Code, OpenAI Codex CLI, Google Gemini CLI, Cursor, and GitHub Copilot can understand GPUtw's GPU catalog, deploy instances, monitor status, and move data — without users having to read API docs and write curl commands themselves.

V1.1.0-beta.1 (2026-09-16) adds an official [MCP](https://modelcontextprotocol.io/) server with 18 structured tools. The whole thing is MIT licensed, has no runtime dependencies, and keeps API keys on the local machine.

This article covers its architecture, tool inventory, installation methods, and security boundaries. If you don't know what GPUtw.ai is, start with [What Is GPUtw.ai: Taiwan's Local GPU Cloud, Short-Term Compute, and Researcher Workflows](/posts/tech/2026-08-29-gputw-ai-taiwan-gpu-cloud-en).

## The Problem Isn't the API — It's the Gap Between AI Assistants and the API

GPUtw.ai already has a public [REST API](https://docs.gputw.ai/zh-TW/docs/rest-api-quickstart). You can call it yourself with curl or Python. The problem is that when you tell Claude Code or Codex "spin up an RTX 3090 with PyTorch," the AI assistant doesn't know what GPUtw's endpoints look like, what parameters to pass, what the deployment sequence is, or which operations are destructive.

GPUtw AI Skill pre-packages that knowledge. Without it, you could write your own prompt to teach an AI assistant how to use the GPUtw API. With it, that work is already done, tested, comes with decision trees and error handling, and works across platforms.

The real increment isn't "letting you manage GPUs" — you could always do that. It's moving GPU management knowledge from your head into the AI assistant's context, reducing friction from "I want to do this" to "it's done."

## Three-Layer Lookup Architecture

GPUtw AI Skill organizes knowledge with three layers of progressive disclosure:

```
SKILL.md (decision tree, rules, quick reference)
  → guides/NN-*.md (12 integration guides, with snapshot tables)
      → references/docs-site.md → web_fetch gputw.ai/docs (live official docs)
```

The first layer is `SKILL.md` — what the AI assistant reads on load: deployment sequence, safety rules, common-mistake checklists. The second layer is 12 topical guides covering deployment, monitoring, Vault, networking, billing, and more. The third layer is live queries to official documentation — guide tables are 2026-09 snapshots, and when something falls outside the snapshot, the assistant fetches the latest docs via `web_fetch`.

This design avoids two extremes: it doesn't dump the entire API documentation into context (too large), and it doesn't just provide a link for the AI to crawl (too slow, too unreliable).

## MCP Server and 18 Tools

The core addition in V1.1.0-beta.1 is the official MCP server (npm package `@gputw/mcp-server`, TypeScript implementation, built on [MCP SDK](https://modelcontextprotocol.io/) 1.30). It wraps the GPUtw REST API into 18 structured tools in four groups:

### Catalog (4 tools)

| Tool | Purpose | API Scope |
|---|---|---|
| `list-gpus` | List available GPU models, pricing, stock | Public |
| `list-available-nodes` | Query available nodes for a specific GPU | `catalog:read` |
| `list-templates` | List environment templates | Public |
| `get-deploy-options` | Get deployment configuration options | Public |

### Instance Management (5 tools)

| Tool | Purpose | API Scope |
|---|---|---|
| `list-instances` | List all instances | `instances:read` |
| `create-instance` | Create a new instance | `instances:create` |
| `stop-instance` | Stop an instance | `instances:manage` |
| `delete-instance` | Delete an instance (destructive) | `instances:manage` |
| `restart-instance` | Restart an instance | `instances:manage` |

### Status Monitoring (4 tools)

| Tool | Purpose | API Scope |
|---|---|---|
| `get-instance-status` | Query instance status | `instances:read` |
| `get-instance-resources` | View GPU/CPU/memory utilization | `instances:read` |
| `get-instance-logs` | Retrieve container logs | `instances:read` |
| `get-instance-events` | Retrieve event history | `instances:read` |

### Vault Operations (5 tools)

| Tool | Purpose | API Scope |
|---|---|---|
| `list-vault` | List Vault files | `vault:read` |
| `get-vault-stats` | View storage usage | `vault:read` |
| `upload-to-vault` | Upload files (chunked, resumable, up to 2TB per file) | `vault:write` |
| `download-model-to-vault` | Download models from Hugging Face etc. to Vault | `vault:write` |
| `list-vault-downloads` | List download tasks | `vault:read` |

There's also an `exec-in-instance` tool that is off by default (requires setting `GPUTW_MCP_ALLOW_EXEC=1`). It executes commands as root inside the container, and every call is written to the account's audit trail.

Each tool carries MCP-standard `readOnlyHint`, `destructiveHint`, and `idempotentHint` annotations so AI assistants know which operations are safe and which need confirmation. Responses are field-projected from ~50 fields down to under 20, saving context space.

## Installation

GPUtw AI Skill supports multiple installation methods depending on platform and needs.

**Claude Code** (three options):

Plugin marketplace (recommended):

```bash
/plugin marketplace add GPUtw-ai/GPUtw-Skill
/plugin install gputw@gputw
```

Manual global install:

```bash
git clone https://github.com/GPUtw-ai/GPUtw-Skill.git ~/.claude/skills/gputw
```

MCP server only:

```bash
claude mcp add gputw -s user \
  -e GPUTW_API_KEY=gputw_live_xxx \
  -- npx -y @gputw/mcp-server@latest
```

**OpenAI Codex CLI**: Clone to `.gputw-skill/` or `~/.codex/gputw-skill/`, add a reference in the project's `AGENTS.md`.

**Google Gemini CLI**: Clone to `.gputw-skill/`, add a reference in `GEMINI.md`.

**Cursor**: Clone to `.gputw-skill/`, reference in Cursor Rules or `AGENTS.md`.

**GitHub Copilot**: Clone to `.gputw-skill/`, create `.github/copilot-instructions.md` pointing to the skill pack.

**Any MCP client** (Claude Desktop, VS Code, Windsurf, etc.): Add JSON config to the MCP settings file:

```json
{
  "mcpServers": {
    "gputw": {
      "command": "npx",
      "args": ["-y", "@gputw/mcp-server@latest"],
      "env": {
        "GPUTW_API_KEY": "gputw_live_xxx"
      }
    }
  }
}
```

To verify the installation, ask the AI assistant "What is the prefix for a GPUtw API key?" — the correct answer is `gputw_live_`.

## Security Model

Several aspects of GPUtw AI Skill's security design are worth noting:

**Key handling**: API keys (`gputw_live_` prefix) are read only from environment variables, placed only in the `Authorization` header, and never appear in query strings, logs, or hardcoded values. The MCP server actively redacts key strings that appear in output.

**Scope separation**: 17 API scopes with 5 presets — `readonly`, `deploy`, `operator`, `Upload token` (vault:write only), and `full` (includes exec). You can give the AI assistant a `readonly`-scoped key, letting it query data without being able to create instances.

**Exec is off by default**: `exec-in-instance` is root-level container execution, disabled by default. Enabling it requires both an `instances:exec`-scoped key and the `GPUTW_MCP_ALLOW_EXEC=1` environment variable. Every call is written to the account's audit trail.

**Browser-only operations**: SSH key management, top-up, password changes, team creation, notification settings, and admin operations don't go through the API — they can only be done in the web UI. The AI assistant will tell you "this needs to be done in the web interface" rather than trying to work around it.

## What the MCP Server Doesn't Cover Yet

V1.1.0-beta.1 is a beta release. The following operations are not yet available as MCP tools and need to be handled via curl or the REST API directly:

- Port and service exposure (HTTP ports, raw TCP/UDP)
- API key management
- Billing and invoicing queries
- Team management
- Notification settings
- Reservations and support tickets

The Skill content itself (guides, decision trees, error checklists) is at stable release.

## Who It's For

- Developers already using GPUtw.ai who want their AI assistant to help manage GPU instances.
- People who want to deploy GPUs via natural language for model fine-tuning (LoRA/QLoRA/[Unsloth](https://github.com/unslothai/unsloth)), image recognition (YOLO), inference ([vLLM](https://github.com/vllm-project/vllm), [llama.cpp](https://github.com/ggerganov/llama.cpp)), or image generation ([ComfyUI](https://github.com/comfyanonymous/ComfyUI)).
- Teams who want to integrate GPUtw into automated workflows (CI/CD, batch deployment, scheduled training) via the MCP server.

Not for:

- People who don't have a GPUtw.ai account and API key yet — the skill pack doesn't replace the platform itself. You still need to register and add credits first.
- People who need MCP tools for port management, billing, or team administration — those aren't covered yet.
- People expecting a one-click solution for complex training pipelines — the AI assistant can operate the API for you, but the knowledge required for model training (data preparation, hyperparameters, evaluation) is still yours.

## Overall

GPUtw AI Skill does one concrete thing: it turns the workflow of "user reads API docs, writes curl, manages GPU" into "tell the AI assistant what you want, it calls the API." 18 MCP tools cover the GPU catalog, instance lifecycle, status monitoring, and Vault operations. The security model includes key isolation, scope separation, and exec disabled by default.

It's a skill pack plus MCP server, not a new GPU platform. GPUtw.ai's own positioning, GPU inventory, pricing, and SLA evaluation are outside the scope of this article — see the [platform overview](/posts/tech/2026-08-29-gputw-ai-taiwan-gpu-cloud-en) for those.

To try it, the simplest path is running `claude mcp add gputw` in Claude Code with a `readonly`-scoped key, and letting it list the GPU catalog and templates first. Once that works, decide whether to install the full skill pack or upgrade the key scope.

## References

- [GPUtw AI Skill GitHub repo](https://github.com/GPUtw-ai/GPUtw-Skill)
- [GPUtw AI Skill CHANGELOG](https://github.com/GPUtw-ai/GPUtw-Skill/blob/master/CHANGELOG.md)
- [GPUtw.ai](https://gputw.ai/en)
- [GPUtw.ai REST API quickstart](https://docs.gputw.ai/zh-TW/docs/rest-api-quickstart)
- [GPUtw.ai API keys](https://docs.gputw.ai/zh-TW/docs/api-keys)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [@gputw/mcp-server npm](https://www.npmjs.com/package/@gputw/mcp-server)
- [What Is GPUtw.ai: Taiwan's Local GPU Cloud, Short-Term Compute, and Researcher Workflows](/posts/tech/2026-08-29-gputw-ai-taiwan-gpu-cloud-en) (in Chinese)
- [Should You Rent a GPU to Learn Model Training: GPUtw.ai, LoRA, Jupyter, and the First Round of Experiments](/posts/ai/2026-08-29-gputw-ai-learning-gpu-en) (in Chinese)
