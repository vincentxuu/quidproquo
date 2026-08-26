---
title: "Tool Pick | Phinq — Make Your Agent Ask Before It Acts, Catch High-Risk Operations Before They Land"
date: 2026-08-18
category: daily
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "An open-source runtime gatekeeper for AI agents: intercepts every tool call, classifies risk, pauses irreversible operations for your approval on Telegram/Slack, and keeps a tamper-proof hash-chain audit log"
tldr: "Phinq is an open-source runtime governance layer for AI agents. It intercepts every tool call and classifies its risk level — reversible operations pass through, irreversible ones (deletions, payments, credential access, bulk operations) pause for human approval. Install: npx @phinq/phinq. It solves the problem of unsupervised agents making irreversible damage with no trustworthy audit trail."
series:
  name: "AI Tool of the Day"
  order: 3
---

> 🌏 [中文版](/posts/daily/2026-08-18-tool-phinq)

## Tool Info

| Field | Value |
|---|---|
| Name | Phinq |
| Type | Runtime governance proxy / MCP gateway / SDK |
| GitHub | [phinq-co/phinq](https://github.com/phinq-co/phinq) |
| Stars | 5 (listed on Product Hunt mid-August 2026, "Launched this week") |
| Language | TypeScript (proxy/SDK), Python (governance skill version available on PyPI) |
| License | MIT |
| Install | `npx @phinq/phinq` |

## What Problem It Solves

Would you feel comfortable letting an agent run unattended through the night? The Phinq author's Product Hunt post cites two real incidents: in April this year, a coding agent wiped a company's production database and all its backups in nine seconds; in another case, a company had declared a freeze period, but an agent still purged 1,206 executive records. These aren't hypotheticals — the more tools an agent has access to and the more autonomously it runs, the harder it is to recover from a single bad judgment call.

Phinq's approach is to insert a "runtime checkpoint" between the agent and everything it can touch: every tool call goes through a classifier that assigns a risk level. Reversible actions (reading files, queries) pass through immediately; irreversible actions (deletions, credential access, payments, mass emails/bulk operations) get paused, and a Telegram or Slack notification pushes an "Approve / Deny" button to you. If you don't respond within 240 seconds, it auto-denies. Every decision — approved or denied — is written to a hash-chain audit log (RFC 8785 JCS + SHA-256) where any tampered, deleted, or reordered entry can be detected. It also provides `phinq learn`, which distills your past approve/deny history into draft rules you can reference, so governance standards accumulate over time instead of requiring fresh judgment every time.

Good fit for: teams running agents on long unattended automation (scheduled cleanups, batch processing, cross-system operations); scenarios where you need to prove "human oversight" to clients or auditors (the author notes the EU AI Act now requires human oversight); and any workflow using Claude Code, Codex, or other MCP-compatible agents that touches production resources.

## Getting Started

### Installation

```bash
# Interactive wizard: auto-detects Claude Code / Codex / Gemini CLI / Hermes / MCP,
# asks three questions, then prints the one-liner config to paste.
# Defaults to watch-only mode (observe, don't block).
npx @phinq/phinq
```

You can also run the proxy from source:

```bash
git clone https://github.com/phinq-co/phinq.git
cd phinq/proxy
npm install && npm run build && npm start
# Listening on 127.0.0.1:5100
```

### Basic Usage

After pointing your agent at the Phinq proxy, run in watch-only mode for a while to confirm the classification results match your expectations, then enable enforcement:

```bash
PHINQ_ENFORCE=1 \
PHINQ_TELEGRAM_BOT_TOKEN=*** \
PHINQ_TELEGRAM_CHAT_ID=*** \
npm start
```

Once enabled, Phinq sends an "Approve / Deny" button via Telegram for high-risk operations. Slack (Socket Mode) is also supported as an alternative approval channel.

If you don't want a standalone proxy, you can use MCP gateway mode to wrap any stdio MCP server without modifying the agent or server itself:

```jsonc
// MCP client config (works with Claude Code, Codex, etc.)
{
  "mcpServers": {
    "filesystem": {
      "command": "phinq-mcp",
      "args": ["--enforce", "--",
               "npx", "-y", "@modelcontextprotocol/server-filesystem", "/data"]
    }
  }
}
```

### Advanced Usage

A TypeScript SDK is also available for embedding governance directly into your own agent code at the function-call level:

```ts
import { PhinqGovernor } from "@phinq/governance";

const governor = new PhinqGovernor();
const { allowed } = await governor.gate(
  { name: "run_shell", args: { command } },
  { onHold: (req) => askOperator(req) }  // returns "approve" | "deny"
);

if (allowed) await runTool();
```

## Comparison with Alternatives

| | Phinq | Relying on prompt instructions | Manual code review |
|---|---|---|---|
| Runtime enforcement (agent can't see denied calls) | ✅ | ❌ (agent may ignore instructions) | ❌ (only visible after the fact) |
| Tamper-proof audit log (hash chain) | ✅ | ❌ | Requires custom build |
| No need for real-time human monitoring | ✅ (Telegram/Slack notifications) | ❌ | ❌ |
| Wraps any MCP server with zero changes | ✅ (`phinq-mcp` gateway) | — | — |
| Free and open source | ✅ MIT | — | — |

## Caveats

- **Classification currently looks at tool names, not arguments**: The author acknowledged in the Product Hunt comments that a tool like `delete_file` is currently treated as "irreversible on sight," but whether it's deleting a temp file or the only production backup, the classifier can't tell the difference yet. Shell-executed `rm -rf` / `DROP TABLE` does get argument checking, but it's conservative (mostly allowed through). Run in watch-only mode for a while before going live to confirm the classifications match your risk expectations.
- **Very new project with a single maintainer**: The GitHub repo was created on 2026-06-27, star count is single digits, and long-term maintenance and issue response speed remain to be seen. Read through the proxy's classification logic source code before deploying to production.
- **Approval channels require setup**: Telegram requires creating a bot via @BotFather; Slack needs Socket Mode enabled with multiple tokens. These prerequisites take time. Without an approval channel configured, Phinq can only run in watch-only mode and won't actually block anything.

## Takeaway

I used to think of "agent safety" as an after-the-fact exercise — write tests, watch logs, do post-mortems. Phinq reminded me that people are already building this into a "runtime governance layer," which is almost exactly the same idea as the Tier 0–3 classification this site defines in its own `CLAUDE.md` (autonomous / gate check / ask first / forbidden): instead of trusting the agent to always judge correctly, you spell out which actions are reversible and which aren't, and make irreversible ones always stop and wait for a human nod. This "governance as code" approach is only going to become more common.

## References

- [phinq-co/phinq — GitHub](https://github.com/phinq-co/phinq)
- [phinq-co/phinq-governance — GitHub](https://github.com/phinq-co/phinq-governance)
- [Phinq: Stops AI agents before they break something — Product Hunt](https://www.producthunt.com/products/phinq)
- [Building Phinq: How a Cronjob Failure Forced Me to Redesign Agent Governance From Scratch — DEV Community](https://dev.to/hythamh/building-phinq-how-a-cronjob-failure-forced-me-to-redesign-agent-governance-from-scratch-47og)
