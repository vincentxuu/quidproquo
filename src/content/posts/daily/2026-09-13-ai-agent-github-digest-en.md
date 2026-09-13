---
title: "AI Agent GitHub Digest — 2026-09-13"
date: 2026-09-13
category: daily
tags: [ai-agent, github, open-source, daily, mcp, developer-tools, agent-security]
lang: en
description: "worktrunk tackles parallel multi-agent work, CloddsBot lets agents pay each other via x402, pentagi has agents hunt their own vulnerabilities — today's GitHub trending is drifting toward agents handling their own business"
tldr: "max-sixty/worktrunk makes git worktree management as simple as switching branches, built for running multiple coding agents in parallel; melgarafael/DeskcommCRM opens a whole CRM to AI agents via MCP, targeting WhatsApp sales; alsk1992/CloddsBot bakes in the x402 protocol so agents can pay each other in USDC, while also bundling 200x-leverage trading into the same chat interface; vxcontrol/pentagi runs fully autonomous agents doing penetration testing inside a Docker sandbox; DSPy 3.4.0 Beta 1 swaps its LM execution layer for a built-in engine, replacing 3.3's experimental types"
series:
  name: "AI Agent GitHub Digest"
  order: 29
---

## Today's Highlights

Today's trending projects share a direction: agents aren't just "helping you write code" anymore — they're starting to handle real work that requires autonomous decisions. worktrunk solves the infrastructure problem of running multiple agents in parallel, DeskcommCRM lets an agent run customer relationships directly, CloddsBot uses the x402 protocol to let agents pay each other without a human approving every transaction, and pentagi has an agent plan and execute its own penetration tests. The boundary of autonomy is pushing from "writing code" toward "spending money" and "taking action."

## Trending Repos

### max-sixty/worktrunk ⭐ 7,140 (+137)

[GitHub](https://github.com/max-sixty/worktrunk)　·　Rust　·　MIT OR Apache-2.0

- **What it is**: A CLI tool that makes git worktree management as simple as switching branches, so you can run several coding agents in parallel without them stepping on each other's changes.
- **Why it matters**: Creating a new worktree with plain git takes three separate name-typing steps (`git worktree add -b feat ../repo.feat && cd ../repo.feat`); worktrunk collapses that into one line, `wt switch -c feat`, and adds LLM-generated commit messages, one-command squash/rebase/merge, and shared build caches across worktrees (no rebuilding `node_modules` on APFS/btrfs/XFS). As "running 5-10 Claude Code / Codex agents at once" becomes normal, this is exactly the kind of infrastructure gap that native git never closed.
- **Tech stack**: Rust + git worktree + a shell hook system
- **Getting started**: Easy — `brew install worktrunk && wt config shell install` and you're done

---

### melgarafael/DeskcommCRM ⭐ 1,707 (+505)

[GitHub](https://github.com/melgarafael/DeskcommCRM)　·　TypeScript　·　MIT

- **What it is**: An open-source "AI sales operating system" from a Brazilian team — a self-hosted CRM where an AI agent natively greets, qualifies, and closes customers over WhatsApp, positioned against Kommo, Octadesk, and Intercom.
- **Why it matters**: Instead of bolting a chatbot onto the outside of a CRM as a customer-service layer, it exposes the entire CRM through an internal MCP server so the agent can actually operate it — moving a customer through funnel stages, deciding whether to hand off to a human, and proposing its own process improvements based on conversation outcomes (a human still has to approve them). A multi-tenant architecture lets the same core service power e-commerce, clinics, real estate, and online courses — just swap the vocabulary (a "lead" here is a "customer," there it's a "patient"). Gaining 505 stars in a day suggests real demand for "AI-native vertical SaaS" in Latin America's SMB market.
- **Tech stack**: Next.js 16 + Supabase (Postgres + pgvector) + WAHA (WhatsApp) + Vercel AI SDK v7
- **Getting started**: Medium — a one-click VPS install script is provided, but you'll need a domain, a Supabase account, and an AI provider key

---

### alsk1992/CloddsBot ⭐ 2,411 (+377)

[GitHub](https://github.com/alsk1992/CloddsBot)　·　TypeScript　·　MIT

- **What it is**: An open-source AI trading terminal where a single agent operates across 1,000+ markets at once — prediction markets (Polymarket, Kalshi), crypto spot, perpetuals with up to 200x leverage, and Solana token launches, all driven by chat commands.
- **Why it matters**: The real point isn't the trading strategy — it's baking the x402 protocol in for agent-to-agent USDC micropayments. An agent can pay for its own compute, buy a trading strategy another agent wrote, or even launch its own token to raise funds, without a human approving each transaction. It's a concrete case of "agent commerce" going from concept to running code. But the flip side needs saying too: it packages real-money 200x-leverage trading into the same chat interface, and no matter how thorough the risk engine (VaR/CVaR, circuit breakers) is, the risk of automated leveraged trading itself doesn't disappear just because the UI is convenient.
- **Tech stack**: Claude (Anthropic) + TypeScript + LanceDB (semantic memory) + the x402 protocol
- **Getting started**: Hard — involves real funds, private-key management, and multiple exchange API keys; read the risk-control and security docs thoroughly before going live

---

### vxcontrol/pentagi ⭐ 23,286 (+193)

[GitHub](https://github.com/vxcontrol/pentagi)　·　Go　·　Custom license (includes an EULA)

- **What it is**: A fully autonomous penetration-testing AI agent system where the agent plans and executes an entire pentest itself, aimed at security researchers and authorized penetration-testing teams.
- **Why it matters**: Every action runs inside an isolated Docker sandbox, with 20+ built-in professional security tools (nmap, Metasploit, sqlmap) and long-term memory that retains successful test paths for future reference, plus an optional Graphiti (Neo4j) knowledge graph for semantic linking. Unlike a "one-click attack script," it emphasizes observability — every agent decision can be supervised and traced, which is what gives it the confidence to put "Fully Autonomous" in its own name.
- **Tech stack**: Go + Docker sandbox + multiple LLM providers (Anthropic, OpenAI, DeepSeek, and more) + Langfuse observability
- **Getting started**: Medium — `docker compose up` brings up the full stack, but confirm you have authorization for the target before running it

## Notable Releases

### DSPy 3.4.0 Beta 1

[Release Notes](https://github.com/stanfordnlp/dspy/releases/tag/3.4.0b1)

- **What changed**: The LM execution layer now runs on DSPy's built-in `lm15` engine (`engine="auto"` prefers native execution, falling back to LiteLLM only for unsupported paths); custom LM backends now implement a `complete(Request) -> Response` interface instead of subclassing `BaseLM`; ReActV2 supports async execution; a local CPython interpreter now runs trusted code; GEPA supports custom Flex code proposals.
- **Breaking changes**: The experimental LM types introduced in 3.3 are being replaced in this release — the maintainers describe 3.4 as the "LM transition release" and 3.5 as the migration deadline. If you've customized an LM, passed OpenAI-format messages directly to an LM, or used the `n` parameter for multiple completions, review the compatibility docs before upgrading.
- **Impact**: This is still beta (`pip install --upgrade "dspy==3.4.0b1"`; plain `pip install dspy` won't pick it up), so there's no rush if you're not affected. If you're already using a custom LM or relying on streaming, test both the native and LiteLLM engine paths in a staging environment first.

## Today's Takeaway

I used to think agent "autonomy" stories were still mostly about "writing its own code, running its own tests." Today's crop of projects shifted that — worktrunk solves the infrastructure problem of "multiple agents working at once," which is a prerequisite for scaling; but the real watershed is CloddsBot's x402 payments. Once an agent can pay for things itself without a human approving every transaction, it stops being a "tool" and becomes "an actor with a budget." Once that step is taken, the question isn't "can the agent do this" anymore — it's "how much spending authority should it get."

## References

- [max-sixty/worktrunk — GitHub](https://github.com/max-sixty/worktrunk)
- [melgarafael/DeskcommCRM — GitHub](https://github.com/melgarafael/DeskcommCRM)
- [alsk1992/CloddsBot — GitHub](https://github.com/alsk1992/CloddsBot)
- [vxcontrol/pentagi — GitHub](https://github.com/vxcontrol/pentagi)
- [GitHub Trending (daily, captured 2026-09-13)](https://github.com/trending?since=daily)
- [DSPy 3.4.0 Beta 1 Release Notes](https://github.com/stanfordnlp/dspy/releases/tag/3.4.0b1)
