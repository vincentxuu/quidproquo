---
title: "AI Agent GitHub Digest — 2026-11-19"
date: 2026-11-19
category: daily
tags: [ai-agent, github, open-source, daily, security, agent-skills, pydantic-ai, mastra]
lang: en
description: "Pydantic AI and CrewAI both spent today patching holes in their dependency chains; Mastra follows LoopForge with its own issue-to-PR Factory"
tldr: "Pydantic AI v2.70.0 fixes two high-severity ReDoS bugs, and CrewAI 1.15.42 patches a soupsieve CVE; Claude Code's red-team skill pack Claude-BugHunter breaks 1,000 stars in a day, Google wires Agent Skills into its own design tool Stitch, and Mastra ships its own issue-in, PR-out Factory template."
series:
  name: "AI Agent GitHub Digest"
  order: 96
---

> 🌏 [中文版](/posts/daily/2026-11-19-ai-agent-github-digest)

## Today's Highlight

Today's thread is security catching up with how fast these frameworks keep growing. Pydantic AI fixed two high-severity ReDoS bugs hiding in its own regexes, and CrewAI patched a CVE in a third-party dependency on the same day. On the tooling side, Mastra followed yesterday's Tencent LoopForge with its own issue-in, PR-out Factory template, and Google wired the Agent Skills open standard into its own design tool, Stitch — skills-as-plugins is turning into standard equipment across product lines.

## Trending Repos

### elementalsouls/Claude-BugHunter ⭐ 11,028 (+1,005)

[GitHub](https://github.com/elementalsouls/Claude-BugHunter)　·　Python　·　MIT

- **What it is**: A red-team/bug-hunting skill pack for Claude Code — 83 skills and 15 slash commands, curated from 681 disclosed HackerOne reports across 24 vulnerability classes, plus attack-chain templates for enterprise identity systems (M365/Entra, Okta, vCenter).
- **Why it matters**: Once installed, Claude Code doesn't just answer security questions — it works through a four-layer skill chain (recon → classify vulnerability → validate → write report) that triggers automatically from what you describe, with built-in Burp MCP integration and report templates. It packages a bug hunter's actual workflow into a reusable install, not a one-off prompt. The +1,005 stars in a day makes it one of today's fastest-growing agent-related repos.
- **Tech stack**: Claude Code Skills + 83 skill files + Burp MCP + the `cbh` CLI (installed via pipx)
- **Getting started**: Easy — one line, `/plugin install claude-bughunter@elementalsouls`, and every skill auto-triggers from what you describe, no manual invocation needed

---

### google-labs-code/stitch-skills ⭐ 10,350

[GitHub](https://github.com/google-labs-code/stitch-skills)　·　TypeScript　·　Apache-2.0

- **What it is**: Google Labs' own Agent Skills library, built to pair with Stitch (Google's AI UI design tool) and its MCP server, following the Agent Skills open standard — installable into Codex, Antigravity, Gemini CLI, Claude Code, and Cursor.
- **Why it matters**: This isn't a community plugin — Google split "design," "build," and "utility" skills into three separate packages (stitch-design / stitch-build / stitch-utilities) so coding agents can call Stitch's MCP server to do interface design. It's a concrete case of a major vendor applying the "skill marketplace" model to its own product line, and it's been flagged by automated trending-watcher bots two days running.
- **Tech stack**: Agent Skills open standard + Stitch MCP server + the `npx plugins`/`npx skills` CLIs
- **Getting started**: Medium — you need the Stitch MCP server configured first, then install into your coding agent with `npx plugins add google-labs-code/stitch-skills`

---

### ysunyang4/Nexus ⭐ 405

[GitHub](https://github.com/ysunyang4/Nexus)　·　TypeScript　·　AGPL-3.0

- **What it is**: A local MCP control plane that lets web-based AI assistants like ChatGPT and DeepSeek reach your computer through a browser extension — running file reads/writes, terminal commands, and Git operations across hundreds of tools, with scope and permissions you set yourself.
- **Why it matters**: Most MCP clients on the market only serve coding agents installed locally (Claude Code, Cursor). Nexus flips that: it's built for people who want to keep using the web version of ChatGPT but still have it act on their machine. It logs every tool call to a write-ahead log so a dropped connection won't replay actions, and sensitive files (`.env`, `.pem`, `id_rsa`) are masked by default. The developer posted about it themselves on the LINUX DO community forum, and it went from zero to 405 stars in five days.
- **Tech stack**: Tauri 2 desktop app + Fastify MCP server (Streamable HTTP) + SQLite WAL + browser extension
- **Getting started**: Medium — you need to install the Nexus desktop app and then the browser extension before web AI output can reach your local tools

---

### mastra-ai/softwarefactory-template ⭐ 64 (launched today)

[GitHub](https://github.com/mastra-ai/softwarefactory-template)　·　TypeScript　·　unlicensed

- **What it is**: The "Factory" template Mastra unveiled on Show HN today — connect your GitHub repo and it turns issues into plans, implementations, and pull requests for a human to review, all running on a Factory Server you host yourself, with optional Linear, Jira, and Slack integration.
- **Why it matters**: It's the same issue-in, PR-out, human-in-the-middle pattern as yesterday's Tencent LoopForge, but Mastra packaged it as a template where auth, storage, and sandboxing can each be swapped independently — not locked to one vendor. And Factory itself is built on Mastra's own framework, making it a public case of the company eating its own dog food.
- **Tech stack**: Mastra framework + PostgreSQL/pgvector + Docker sandbox, with swappable auth/storage/sandbox providers
- **Getting started**: Medium — `npm create factory` scaffolds the project, but you still need to configure GitHub App permissions and a model provider key before running your first issue

## Notable Releases

### Pydantic AI v2.70.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.70.0)

- **Key changes**: Fixed two high-severity ReDoS bugs — one in the regex that strips ANSI escape sequences under `strip_ansi` ([GHSA-m4cr-m4qc-9hh3](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-m4cr-m4qc-9hh3)), and one in the built-in `jwt` secret-redaction pattern ([GHSA-5m5q-5qj4-gx9h](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-5m5q-5qj4-gx9h)) — both fixed in `pydantic-ai-harness` 0.70.0. Also added `StreamGuardrail` (screens streamed output before the caller sees it), `PruneToolResults`, and forwarded `service_tier` to xAI.
- **Breaking changes**: No hard break at the function-signature level, but the release frames this as "Compatibility Notes" and lists 14 behavior changes, including Groq's output-format detection and Anthropic's retry logic.
- **Impact**: If your pipeline runs `strip_ansi` on model output, or uses the built-in `redact_secrets`/`secret_data()` `jwt` pattern on text an attacker can influence, either regex could previously be fed a few hundred KB of crafted input to stall the event loop for seconds to minutes before you upgrade to `pydantic-ai-harness` 0.70.0 — worth upgrading directly rather than weighing the risk first.

---

### CrewAI 1.15.42

[Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.42)

- **Key changes**: Made ChromaDB an optional extra instead of a required dependency, and switched Knowledge's default backend to a local Qdrant instead of locking it to Chroma. Also raised the soupsieve version floor to 4.0, fixing [CVE-2026-126190](https://github.com/advisories/GHSA-mmhr-3c5m-f64f).
- **Breaking changes**: If your code assumed Knowledge always uses ChromaDB — say, by calling the underlying Chroma client directly — the default backend is now Qdrant, and you'll need to explicitly specify which vector store to use.
- **Impact**: Using CrewAI's Knowledge API as-is won't break, but if your deployment pulled in ChromaDB as a side effect of installing crewAI — say, for some unrelated purpose — you now need to add the extra explicitly to still get it installed.

## Today's Takeaway

I used to assume agent-framework releases were mostly about adding features, but today Pydantic AI and CrewAI both shipped updates fixing holes introduced by what they pull in — one in a regex they wrote themselves, one in a third-party package's own CVE. The frameworks' own code wasn't the problem; the risk came up through the chain of dependencies they carry. It's a reminder that assessing an agent framework's risk surface means looking past its own commit log to the string of packages it drags along.

## References

- [elementalsouls/Claude-BugHunter - GitHub](https://github.com/elementalsouls/Claude-BugHunter)
- [AI Open Source Trends 2026-11-18 - kouweizhu/agents-radar#1006](https://github.com/kouweizhu/agents-radar/issues/1006)
- [google-labs-code/stitch-skills - GitHub](https://github.com/google-labs-code/stitch-skills)
- [ysunyang4/Nexus - GitHub](https://github.com/ysunyang4/Nexus)
- [mastra-ai/softwarefactory-template - GitHub](https://github.com/mastra-ai/softwarefactory-template)
- [Show HN: Mastra Factory](https://news.ycombinator.com/item?id=50548660)
- [Pydantic AI v2.70.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.70.0)
- [CrewAI 1.15.42 Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.42)
