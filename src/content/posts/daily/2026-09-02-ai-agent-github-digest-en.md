---
title: "AI Agent GitHub Digest — 2026-09-02"
date: 2026-09-02
category: daily
tags: [ai-agent, github, open-source, daily, mcp, agent-security, personal-agent, rag]
lang: en
description: "The personal-agent boom keeps growing while an NVIDIA-grade skill security scanner ships in the same week — OpenClaw passes 380k stars, SkillSpector patches the supply-chain gap underneath it"
tldr: "openclaw/openclaw, a self-hosted personal assistant, has climbed to 388k stars by wiring WhatsApp, Telegram, Slack and other chat channels into one Gateway. The same week, NVIDIA shipped SkillSpector, which scans Claude Code, Codex, and MCP skills for 71 vulnerability patterns — research it cites found 26.1% of skills contain vulnerabilities and 5.2% show likely malicious intent. Also today: stablyai/orca turns parallel multi-agent coding into a full IDE, and VectifyAI/PageIndex challenges the assumption that RAG needs a vector database with a reasoning-based tree index. claude-code v2.1.257 adds a Containment Escape security rule, and agno v3.0.5 stops swallowing embedding failures silently and starts reporting them honestly."
series:
  name: "AI Agent GitHub Digest"
  order: 18
---

> 🌏 [中文版](/posts/daily/2026-09-02-ai-agent-github-digest)

## Today's Highlights

Two sides of the same coin showed up on GitHub Trending today: personal-agent adoption keeps scaling up, and the supply-chain risk underneath it just got a proper scanner. OpenClaw, a self-hosted personal assistant, has already rolled up to 388k stars — and almost simultaneously, NVIDIA shipped SkillSpector, built specifically to scan Claude Code, Codex, and MCP skills for malicious code before you install them. The bigger the ecosystem gets, the less optional "scan before you install" becomes.

## Trending Repos

### openclaw/openclaw ⭐ 388,497

[GitHub](https://github.com/openclaw/openclaw) · TypeScript · MIT (with some exceptions)

- **What it is**: a self-hosted personal AI assistant that wires models, tools, and chat channels (WhatsApp, Telegram, Slack, Discord, Signal, iMessage, and more) together through a single Gateway. The same architecture runs as a solo assistant on one laptop or a shared team deployment — configuration is the only difference.
- **Why it's worth a look**: it continues the "self-hosted personal agent" thread from the past couple of days (nanobot and CowAgent yesterday), but goes further toward a finished product. Its "trusted gateway, untrusted execution, deterministic policy" architecture spells out the security boundary explicitly: tools run on the host by default, and you have to configure sandboxing yourself before connecting other users or exposing the Gateway remotely.
- **Tech Stack**: TypeScript/Node.js, a Gateway control plane plus multi-channel connectors and a skill/plugin system.
- **Getting Started**: Low — a one-line install script or `npm install -g openclaw` gets you running; wiring up multiple chat platforms' APIs/webhooks takes extra setup.

---

### NVIDIA/SkillSpector ⭐ 15,531

[GitHub](https://github.com/NVIDIA/SkillSpector) · Python · Apache-2.0

- **What it is**: a security scanner from NVIDIA that checks a Claude Code, Codex, or MCP skill for prompt injection, data exfiltration, and supply-chain risk before you install it.
- **Why it's worth a look**: the README cites hard numbers — 26.1% of skills contain vulnerabilities, and 5.2% show likely malicious intent. SkillSpector runs 71 vulnerability detection patterns across 17 categories (prompt injection, memory poisoning, MCP tool poisoning, and more), in a two-stage pipeline of fast static analysis plus optional LLM semantic evaluation, and it's part of the NVIDIA Verified Skills pipeline. Set against skill marketplaces like OpenClaw's growing fast, this kind of scanner only gets more urgent.
- **Tech Stack**: Python, static rules plus AST/taint analysis and YARA signatures, with optional LLM semantic evaluation and live CVE lookups against OSV.dev.
- **Getting Started**: Low — `skillspector scan ./my-skill/` just works, and there's a Docker image if you don't want to install Python.

---

### stablyai/orca ⭐ 59,083

[GitHub](https://github.com/stablyai/orca) · TypeScript · MIT

- **What it is**: a YC-backed agent development environment (ADE) for running a whole fleet of parallel coding agents (Claude Code, Codex, Cursor, OpenCode, and more) at once, across desktop, mobile, and VPS.
- **Why it's worth a look**: its headline feature is "Parallel Worktrees" — fan a single prompt out to five agents, each running in its own isolated git worktree, then compare the results and merge the winner. Most parallel multi-agent workflows so far have lived in a terminal or a script; orca turns it into a full IDE experience, complete with a mobile companion app for checking progress and sending follow-ups on the go.
- **Tech Stack**: TypeScript, an Electron desktop shell, git-worktree isolation, and integrations with multiple coding-agent CLIs.
- **Getting Started**: Medium — the desktop app is ready to use out of the box, but getting real value from parallel development means wiring up subscriptions or API keys for several agents at once.

---

### VectifyAI/PageIndex ⭐ 35,476

[GitHub](https://github.com/VectifyAI/PageIndex) · Python · MIT

- **What it is**: a vectorless approach to document retrieval — it turns a document into a tree-structured table of contents and lets an LLM reason its way through the tree to find the right section, instead of relying on embedding similarity.
- **Why it's worth a look**: mainstream RAG defaults to "vector database plus chunking," and PageIndex names the problem with that default directly — similarity isn't the same as relevance. It hits 98.7% accuracy on the FinanceBench financial-QA benchmark and claims to be up to 16.6x cheaper than feeding a model the raw PDF at 420 pages. Worth evaluating for long, well-structured professional documents — financial reports, regulations, technical manuals.
- **Tech Stack**: Python, an LLM-driven reasoning tree index (no vector database, no chunking), pluggable into the OpenAI Agents SDK or the Claude Agent SDK.
- **Getting Started**: Medium — `pip install pageindex` gets the concept running quickly, but you'll want to run a real evaluation to see whether this indexing style fits your document types.

## Notable Releases

### Claude Code v2.1.257

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.257)

- **Key changes**: adds a Containment Escape rule so that, in auto mode, cloud metadata-credential fetches, egress evasion, and cross-tenant reach are no longer auto-approved unless your environment explicitly marks them as expected; adds Claude Fable 5.1 as the new default Fable model; adds `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` to force every subagent onto one model setting.
- **Breaking Changes**: no major API changes, but `defaultMode: "bypassPermissions"` set in a project or local `settings.json` is now ignored — it has to live in user or managed settings, or be passed via `--permission-mode`.
- **What it means for you**: if you let an agent touch cloud infrastructure in auto mode, this update adds a real layer of protection — but it also means some actions that used to auto-approve will now stop and ask first, so you may need to mark specific actions as expected for your environment.

---

### agno v3.0.5

[Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.0.5)

- **Key changes**: embedding failures are now surfaced honestly instead of silently swallowed — ingestion that fails now reports `failed` or `partial` instead of falsely claiming `completed`; adds a `partial` content status; adds a GandrTools text-to-speech toolkit.
- **Breaking Changes**: embedders now raise `EmbeddingError` on failure instead of returning an empty array; AWS Bedrock embedding failures now raise `EmbeddingError` instead of `ModelProviderError`; `skip_if_exists=True` no longer skips content marked `failed` or `partial` — it re-embeds it.
- **What it means for you**: if your code wraps a Bedrock embedding call in `except ModelProviderError`, it will stop catching the error after this upgrade — switch to `except EmbeddingError`. Also worth checking: content in your knowledge base that used to show "completed" may get relabeled `failed` or `partial` after upgrading — meaning it was never actually fully indexed. This is agno's second fix this week that turns "failure quietly papered over" into "failure reported honestly," after yesterday's `ingest_path` default flip.

## Today's Takeaway

OpenClaw passing 380k stars and NVIDIA shipping a skill scanner in the same week look like two separate stories, but they're really one story from two angles: once personal-agent adoption crosses a certain scale, "how much of the skill marketplace has nobody carefully reviewed" stops being a theoretical risk and becomes a number you can measure — 26.1% vulnerable, 5.2% likely malicious. How fast the ecosystem grows sets how urgently the security tooling underneath it has to catch up.

## References

- [openclaw/openclaw](https://github.com/openclaw/openclaw)
- [OpenClaw README](https://raw.githubusercontent.com/openclaw/openclaw/main/README.md)
- [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector)
- [SkillSpector README](https://raw.githubusercontent.com/NVIDIA/SkillSpector/main/README.md)
- [stablyai/orca](https://github.com/stablyai/orca)
- [orca README](https://raw.githubusercontent.com/stablyai/orca/main/README.md)
- [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex)
- [PageIndex README](https://raw.githubusercontent.com/VectifyAI/PageIndex/main/README.md)
- [Claude Code v2.1.257 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.257)
- [agno v3.0.5 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.0.5)
- [GitHub Trending — Daily](https://github.com/trending?since=daily)
