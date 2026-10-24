---
title: "AI Agent GitHub Digest — 2026-10-25"
date: 2026-10-25
category: daily
tags: [ai-agent, github, open-source, daily, agent-sandbox, mcp, version-control]
lang: en
description: "NVIDIA pushed agent sandboxing down into the kernel, and an independent developer rebuilt the version-control system Anthropic described but never open-sourced — today's GitHub trending is all about the plumbing that lets a lot of agents run at once"
tldr: "**NVIDIA/OpenShell** (19.3k★, +893) pushes agent sandboxing down into the kernel and runs formal verification on every policy change before it ships; **feder-cr/git-ai** (988★) rebuilds Scion — the system Anthropic described in public but never open-sourced — so hundreds of agents can write to the same branch without Git grinding to a halt; **makecindy/cindy** (3,971★, +471) wraps Claude Code and Codex into one desktop/mobile client; and AWS's own **agent-toolkit-for-aws** (3,055★) packages the MCP servers and guardrails agents need to deploy on AWS into an official plugin set. Releases: Pydantic AI v2.61.0's compatibility notes lock down thinking-setting overrides and how `CohereModel` handles unsupported files; Haystack v3.4.1 joins LangGraph in raising its certifi floor after a certificate authority's private keys leaked."
series:
  name: "AI Agent GitHub Digest"
  order: 71
---

> 🌏 [中文版](/posts/daily/2026-10-25-ai-agent-github-digest)

## Today's Highlight

Today's throughline is the infrastructure for running a lot of agents at once. NVIDIA's OpenShell pushes sandbox isolation down into the kernel and runs formal verification on every policy change before it ships. feder-cr/git-ai rebuilds Scion — the version-control design Anthropic wrote about publicly but never open-sourced — so hundreds of agents can edit the same branch without classic Git grinding to a halt. Cindy wraps both the Claude Code and Codex harnesses into one desktop/mobile client, and AWS packaged its own MCP servers and guardrails into an official Agent Toolkit. In the background, Pydantic AI and several other frameworks are raising their certifi floor in response to a certificate authority key leak.

## Trending Repos

### NVIDIA/OpenShell ⭐ 19,332 (+893)

[GitHub](https://github.com/NVIDIA/OpenShell)　·　Rust　·　Apache-2.0

- **What it is**: NVIDIA's own open-source runtime for AI agents. Every agent runs in an isolated sandbox, and OpenShell governs — at the kernel level — which files it can touch, which syscalls it can make, and which network destinations it can reach.
- **Why it matters**: Most "agent security" tools review logs after the fact; OpenShell intercepts at the kernel before access ever happens. Before a policy change ships, formal verification flags whether it would quietly grant access to a new host or API, so the riskier changes wait for a human to approve them. Agents themselves never see real credentials — OpenShell only attaches them to outbound requests once a policy check passes.
- **Tech stack**: Rust kernel-level enforcement + a Python CLI (PyPI's `openshell`) + Docker/Podman/host virtualization sandboxes
- **How hard to adopt**: Medium — one curl script installs the CLI and a local gateway, but running it in production means reading through the gateway/supervisor/sandbox architecture and writing real policies first.

---

### feder-cr/git-ai ⭐ 988

[GitHub](https://github.com/feder-cr/git-ai)　·　Go　·　MIT

- **What it is**: An independent, open-source "Git for AI agents" — a rebuild of Scion, the internal system Anthropic described in a public engineering post but never released, built to let hundreds of agents read and write the same branch without classic Git becoming the bottleneck.
- **Why it matters**: The approach is direct — clients stay connected and fetch only the objects they need, history queries are answered and cached server-side, landing a change uses compare-and-swap instead of a merge queue, and every change is recorded in a changeset log, all on top of ordinary Git repos underneath. Conflicts can be handed to any LLM provider, a deterministic rule, or nothing at all — and a model's proposed resolution only actually lands if the verification command you configure passes against the exact tree about to be merged; otherwise the conflict goes back to the agent.
- **Tech stack**: Go + SQLite/PostgreSQL (the changeset log) + object storage (file/S3/GCS/Azure)
- **How hard to adopt**: Medium — it's compatible with ordinary Git repos underneath, but getting Scion-style sparse clones and automatic conflict resolution means wiring up a resolver and a verify command per the docs.

---

### makecindy/cindy ⭐ 3,971 (+471)

[GitHub](https://github.com/makecindy/cindy)　·　TypeScript　·　Apache-2.0

- **What it is**: An open-source desktop/mobile AI agent client that wraps the Claude Code and Codex coding harnesses into one interface, letting you reuse a coding plan you're already paying for — instead of a separate bill — while switching models and harnesses within the same workspace.
- **Why it matters**: Most "multi-harness" setups are something a developer wires up themselves against an SDK; Cindy ships it as an app an end user can just download. A single task can be planned, run in parallel, and reviewed across different harness × model combinations, while workspace, memory, skills, and tools stay continuous across the switch. It can also drive a browser, a computer, and a phone, and pick up work from messaging apps and schedules.
- **Tech stack**: pnpm monorepo + Node.js 22 + a Claude Code/Codex harness adapter layer + desktop/mobile clients
- **How hard to adopt**: Low — download and install from the official site; bringing your own API key or a local model takes a bit more setup.

---

### aws/agent-toolkit-for-aws ⭐ 3,055

[GitHub](https://github.com/aws/agent-toolkit-for-aws)　·　Python　·　Apache-2.0

- **What it is**: AWS's own set of MCP servers, skills, and plugins that give existing coding agents — Claude Code, Codex, Cursor, Devin, Kiro, and others — the tools and guardrails they need to deploy and manage services on AWS.
- **Why it matters**: Getting an agent to safely operate on AWS used to mean piecing together IAM permissions, SDK conventions, and deployment steps yourself. This toolkit splits into official plugins — `aws-core` (service selection, CDK/CloudFormation, serverless, containers), `aws-agents` (Bedrock/AgentCore), `aws-data-analytics`, and `aws-agents-for-devsecops` (incident investigation, code review, penetration testing) — that install straight from the Claude Code marketplace.
- **Tech stack**: Python + AWS CLI integration + the Claude Code plugin marketplace
- **How hard to adopt**: Low — one line, `aws configure agent-toolkit` or `/plugin install aws-core@claude-plugins-official`, and you're set up.

## Notable Releases

### Pydantic AI v2.61.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.61.0)

- **What changed**: A provider-specific thinking setting from a broader scope now warns when it overrides the `thinking` you set; for models that can't turn thinking off, `thinking=False` now sends the least thinking that model will accept instead of silently dropping the setting; and a file in a `CohereModel` tool return that isn't supported now raises `NotImplementedError` instead of being quietly dropped.
- **Breaking changes**: All three are listed under the official "⚠️ Compatibility Notes" — code that returns a file from a `CohereModel` tool without checking type support will now fail loudly on upgrade instead of silently losing data, as it did before.
- **Impact**: If you're stacking `thinking` settings across multiple scopes (provider/model/call), check which layer is actually winning first — after the upgrade, an outer-scope override gets logged, which is a good way to catch a layering you hadn't noticed.

---

### Haystack v3.4.1 (a cross-framework certifi security fix)

[Release Notes](https://github.com/deepset-ai/haystack/releases/tag/v3.4.1)

- **What changed**: This isn't a feature release — it's a response to eMudhra/emSign's intermediate certificate authority (CA) keys being found weak enough to recover externally ([GHSA-6q48-6c7w-9gw2](https://github.com/advisories/GHSA-6q48-6c7w-9gw2)). `certifi` has pulled the affected emSign root certificates, and several frameworks that depend on it transitively through httpx/requests — Haystack and LangGraph (1.2.17) among them — raised their floor to `certifi>=2026.10.19` within days of each other.
- **Breaking changes**: None — it's purely a trust-chain dependency bump, no API changes.
- **Impact**: If your project pins an older `certifi` (or vendors it into a container image), raise the floor to 2026.10.19 or later and rebuild the image — otherwise your trust chain still carries a certificate that's now flagged as a risk.

## Today's Takeaway

I used to think "agent security" was mostly about prompt-injection defenses at the model layer. Seeing NVIDIA push the perimeter down to the kernel, and git-ai redesign version control itself to withstand hundreds of agents writing at once, made it clearer that what actually holds up "a lot of autonomous agents running at the same time" is isolation and concurrency control at the OS and infrastructure layer — not just writing more careful prompts.

## References

- [NVIDIA/OpenShell on GitHub](https://github.com/NVIDIA/OpenShell)
- [feder-cr/git-ai on GitHub](https://github.com/feder-cr/git-ai)
- [Anthropic: Redesigning source control (the Scion post)](https://www.anthropic.com/engineering/redesigning-source-control)
- [makecindy/cindy on GitHub](https://github.com/makecindy/cindy)
- [aws/agent-toolkit-for-aws on GitHub](https://github.com/aws/agent-toolkit-for-aws)
- [Pydantic AI v2.61.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.61.0)
- [Haystack v3.4.1 Release Notes](https://github.com/deepset-ai/haystack/releases/tag/v3.4.1)
- [GHSA-6q48-6c7w-9gw2 (the certifi/emSign security advisory)](https://github.com/advisories/GHSA-6q48-6c7w-9gw2)
