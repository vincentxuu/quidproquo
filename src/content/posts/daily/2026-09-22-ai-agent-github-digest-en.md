---
title: "AI Agent GitHub Digest — 2026-09-22"
date: 2026-09-22
category: daily
tags: [ai-agent, github, open-source, daily, agent-security, agent-memory, mcp-server]
lang: en
description: "Nothing new hit trending today — instead five projects are backfilling the infrastructure agents need to run safely: policy engines, portable memory, a finance vertical template, and MCP tooling"
tldr: "Microsoft open-sourced agent-governance-toolkit (6,303 stars), enforcing tool-call policy in code instead of prompts, citing an ICLR 2025 paper showing 100% adaptive jailbreak success on GPT-4o/Claude 3/Llama-3; ai-memory grew from 2,900 to 7,575 stars in a month, giving 20+ coding agent CLIs a shared long-term memory; anthropics/financial-services ships the same finance-vertical agents as both a Cowork plugin and a Managed Agents API template, at 35,728 stars; the official MCP Inspector reached v2.7.0, unifying its web/cli/tui clients into one binary; coder/coder folds AI coding agents into Terraform-defined, controlled dev environments with no API keys in the workspace."
series:
  name: "AI Agent GitHub Digest"
  order: 38
---

## Today's Highlights

Nothing on today's candidate list is a new framework. All five trending projects are backfilling the same gap: agents are already capable enough to be given real permissions, so the open question has shifted to who answers for what they do — Microsoft moves prompt-level safety into code-enforced policy, Coder puts agents inside Terraform-defined controlled environments, the official MCP debugging tool hits v2, ai-memory frees memory from a single vendor, and Anthropic itself ships a full finance-vertical agent suite as both a Cowork plugin and a Managed Agent API template. The capability race is converging toward infrastructure.

## Trending Repos

### microsoft/agent-governance-toolkit ⭐ 6,303

[GitHub](https://github.com/microsoft/agent-governance-toolkit)　·　Python (with TypeScript/.NET/Rust/Go SDKs)　·　MIT

- **What it is**: Microsoft's open-source agent governance framework. It moves "is this tool call allowed" out of the prompt and into code — every tool call, message send, and delegation passes through a policy engine before it's allowed to run.
- **Why it matters**: the README cites hard data against relying on prompt-level safety alone — an ICLR 2025 paper ran adaptive attacks (with logprob access and suffix optimization) against GPT-4o, GPT-3.5, Claude 3, and Llama-3 and hit a 100% success rate. AGT's answer is to make denied actions "structurally impossible" rather than "probabilistically unlikely": a YAML/OPA/Cedar policy engine decides allow or deny, SPIFFE/DID/mTLS handle identity, every decision writes to a tamper-evident audit log, and it ships an MCP Security Gateway (scanning for tool poisoning, typosquatting, hidden instructions) plus Shadow AI Discovery (finding unregistered agents running in the wild). It's currently in Public Preview, so breaking changes are possible before GA.
- **Tech stack**: Python core + a Rust policy decision engine (fail-closed, stateless) + official TypeScript/.NET/Rust/Go bindings
- **Getting started**: easy — `pip install "agent-governance-toolkit[full]"`, then two lines of code wrap an existing tool function; it also installs directly as a Claude Code plugin.

---

### akitaonrails/ai-memory ⭐ 7,575

[GitHub](https://github.com/akitaonrails/ai-memory)　·　Rust　·　MIT

- **What it is**: a standalone memory server that lets Claude Code, Codex, Cursor, Gemini CLI, and 20+ other coding agent CLIs share one long-term memory — when this column [covered it on 2026-08-20](https://quidproquo.cc/posts/daily/2026-08-20-ai-agent-github-digest-en), it was at 2,900 stars; a month later it's at 7,575, and growth hasn't slowed.
- **Why it matters**: it solves the "switch agents, lose your memory" problem — quit Claude Code mid-task, open Codex in the same directory, and the next session picks up exactly where you left off: what failed, what's still open, no need to re-explain the architecture. Memory lives as a git-backed wiki of plain markdown files — `grep`-able, editable in Obsidian, hand-editable. The default path makes zero LLM calls; capture, search, and handoff all work with no API key at all. Teams can point everyone at one shared server, with personal session notes and shared project knowledge kept separate, plus built-in multi-user identity and an audit log.
- **Tech stack**: a single Rust binary + SQLite (a rebuildable derived index) + lifecycle hooks integrated across 20+ CLIs
- **Getting started**: moderate — you need to self-host the server first (a laptop or a home box both work), then wire hooks into each agent CLI; after that one-time setup it runs automatically in the background.

---

### anthropics/financial-services ⭐ 35,728

[GitHub](https://github.com/anthropics/financial-services)　·　Python　·　Apache-2.0

- **What it is**: Anthropic's official "Claude for Financial Services" — a set of reference agents, skills, and data connectors built for the workflows Anthropic sees most in investment banking, equity research, private equity, and wealth management.
- **Why it matters**: the same system prompt and skills ship two ways — install as a Claude Cowork plugin to use directly, or deploy through the Claude Managed Agents API (`/v1/agents`) behind your own workflow engine, with no logic to rewrite. Named agents include the Pitch Agent (comps/precedents/LBO all the way to a branded pitch deck), Market Researcher (sector or theme → industry overview, competitive landscape, peer comps, a shortlist of ideas), and Earnings Reviewer (earnings call plus filings → updated model → draft note). The README is explicit about the boundary: these agents only draft work product for a qualified professional to review — they don't give investment advice, execute trades, or post to a ledger, and every output is staged for human sign-off.
- **Tech stack**: Python + the Claude Cowork plugin format + the Claude Managed Agents API
- **Getting started**: easy — install the agents that match your work, then tune the prompts, skills, and connectors to how your firm actually does it.

---

### modelcontextprotocol/inspector ⭐ 10,916

[GitHub](https://github.com/modelcontextprotocol/inspector)　·　TypeScript　·　MIT

- **What it is**: the official MCP debugging tool — a web UI, CLI, or TUI for inspecting exactly which tools, resources, and prompts a given MCP server registers.
- **Why it matters**: v2 merges what used to be three separate web/cli/tui clients into a single `mcp-inspector` launcher binary, splits the old `--config` flag into `--config` and `--catalog`, and bumps the required Node engine version. v1 wasn't killed off — it lives on as a security-fixes-only legacy branch, still published to npm under the `v1-latest` tag, so nobody's forced to migrate overnight. The latest 2.7.0 (Sept 16) wraps every OAuth-flow request in a deadline.
- **Tech stack**: a TypeScript monorepo (Vite + React + Mantine for the web client, tsup-bundled CLI/TUI, Ink + React for the TUI)
- **Getting started**: easy — `npx @modelcontextprotocol/inspector` opens the web client directly; add `--cli` or `--tui` to switch interfaces.

---

### coder/coder ⭐ 16,345

[GitHub](https://github.com/coder/coder)　·　Go　·　AGPL-3.0

- **What it is**: a self-hosted cloud development environment platform where workspaces are defined in Terraform, plus a native AI coding agent that runs in the control plane rather than inside a user's workspace.
- **Why it matters**: unlike tools built to "spin up an agent on your laptop," this is built for what enterprises actually want — control. The agent can call Anthropic, OpenAI, Google, Bedrock, or a self-hosted model, but no API key ever enters a workspace; every action is tied to a user identity, and model usage, cost, and audit logs are managed centrally. Workspaces themselves connect over a WireGuard tunnel and shut down automatically when idle, to save on cost. For teams already using Coder to manage dev environments and now looking to bring AI coding agents under the same governance, it's one piece of infrastructure instead of bolting on a separate agent platform.
- **Tech stack**: Go + Terraform (workspace definitions) + WireGuard (the connection tunnel) + an AI Gateway (centralized model traffic)
- **Getting started**: moderate — `curl -L https://coder.com/install.sh | sh` gets a local server running quickly, but a production deployment needs PostgreSQL, a public URL, and Terraform templates written; governance features like the AI Gateway are advanced configuration.

## Notable Releases

No significant framework releases today. We checked all 13 frameworks on the watchlist (LangGraph, CrewAI, Mastra, pydantic-ai, Agno, Claude Code, Composio, smolagents, LlamaIndex, DSPy, Haystack, browser-use, the MCP spec) — in the last 48 hours only LangGraph 1.2.12 (a pure bug fix/minor feature, no breaking changes) and llama_index 0.14.25 (a batch of security patches across sub-packages) shipped, and neither clears the bar of "an important new feature or breaking change."

## Today's Takeaway

I used to assume the competition in the agent ecosystem was still about model capability and framework features. But not one of today's five trending projects is a new framework — all of them are backfilling "how do you run an agent safely and under control in production": policy engines, credential isolation, portable memory, maturing cross-vendor protocol tooling. Once agents are already good enough that you're willing to hand them real permissions, the next question isn't how much smarter they can get — it's who answers for what they do.

## References

- [microsoft/agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit)
- [Andriushchenko et al., ICLR 2025 (the paper behind the 100% adaptive-attack success rate)](https://arxiv.org/abs/2404.02151)
- [akitaonrails/ai-memory](https://github.com/akitaonrails/ai-memory)
- [This column, 2026-08-20 (ai-memory at 2,900 stars back then)](https://quidproquo.cc/posts/daily/2026-08-20-ai-agent-github-digest-en)
- [anthropics/financial-services](https://github.com/anthropics/financial-services)
- [modelcontextprotocol/inspector](https://github.com/modelcontextprotocol/inspector)
- [modelcontextprotocol/inspector v2.7.0 Release Notes](https://github.com/modelcontextprotocol/inspector/releases/tag/2.7.0)
- [coder/coder](https://github.com/coder/coder)
- [langchain-ai/langgraph 1.2.12 Release Notes](https://github.com/langchain-ai/langgraph/releases/tag/langgraph%3D%3D1.2.12)
- [run-llama/llama_index v0.14.25 Release Notes](https://github.com/run-llama/llama_index/releases/tag/v0.14.25)
