---
title: "AI Agent GitHub Digest — 2026-10-05"
date: 2026-10-05
category: daily
tags: [ai-agent, github, open-source, daily, mcp, agent-security, personal-agent]
lang: en
description: "OpenAI's paid personal-agent product Dots launched a week ago, and the community already shipped an open-source clone built on Composio. The same day also brought an MCP config security auditor and a 'System 1' decision model faster than an LLM."
tldr: "**open-dot** (550 stars) is an open-source rebuild of OpenAI's Dots, the paid personal-agent product launched 9/29, wired to Composio's 1,500+ app integrations and running on your own Mac. **mcp-audit-tool** (91 stars) is a pure-Python CLI that scans MCP client configs for OWASP MCP Top 10 risks like tool poisoning, rug pulls, and hardcoded secrets. **strands-decider** (331 stars) is a lightweight decision model for the Strands Agents SDK — it doesn't generate text, it only picks between options or scores on a scale, faster than an LLM and with a calibrated confidence score. **answer-me-with-html** (977 stars) is an agent skill that gets a model to produce a readable one-page HTML answer using roughly 1/7 the output tokens of hand-writing the page directly. Both framework releases inside today's 48-hour window were already covered or fell short of this series' bar, so there's no Notable Release to report."
series:
  name: "AI Agent GitHub Digest"
  order: 51
---

> 🌏 [中文版](/posts/daily/2026-10-05-ai-agent-github-digest)

## Today's Highlight

OpenAI shipped Dots, a subscription-gated personal agent, just last Friday (9/29) — and within days the community had an open-source rebuild running. The same batch of releases brought a security auditor built specifically for MCP client configs, and a lightweight decision model positioned somewhere between an LLM and a traditional classifier. The thread connecting today's picks isn't one breakout framework — it's the agent ecosystem patching its own foundations: who can clone a tech giant's idea fast, who's guarding the holes in MCP, and who's saving agents from LLM calls they don't actually need.

## Trending Repos

### open-dot ⭐ 550

[GitHub](https://github.com/composio-community/open-dot) · TypeScript · MIT

- **What it is**: An open-source rebuild of OpenAI's Dots — the paid personal-agent product (ChatGPT Pro or Business Premium required) launched 9/29 — running on your own Mac with your own OpenAI key, or open models like Kimi, DeepSeek, and Qwen via OpenRouter.
- **Why it's worth watching**: Each "dot" keeps its own logged-in browser; when it hits a login wall or a CAPTCHA, you can take over directly from the Computer tab. Saved passwords are encrypted with a key in the macOS Keychain and typed straight into the page — the model never sees them. It connects to Gmail, Calendar, Slack, Notion, GitHub, and 1,500+ other apps through Composio, and it reads freely but asks before it sends, posts, pays, or changes anything, checking each risky action against rules you write (like "ask before replying to email"). That a community project can ship a feature-complete clone of a frontier lab's product within a week says the engineering bar for "personal agent" has dropped — the real moat is ecosystem integrations and trust mechanics, not the agent loop itself.
- **Stack**: Electron desktop app + Composio (app integrations) + E2B / Docker (sandboxed execution) + OpenAI / OpenRouter
- **Getting started**: Medium — the desktop app itself installs easily, but wiring up Composio, E2B, and triggers to get the full feature set takes a fair number of setup steps.

---

### mcp-audit-tool ⭐ 91

[GitHub](https://github.com/graygnatconsole/mcp-audit-tool) · Python · MIT

- **What it is**: A pure-Python CLI that scans MCP client configs — files like `claude_desktop_config.json` and `.cursor/mcp.json` — for tool poisoning, rug pulls (unpinned package versions that fetch whatever's newest on every launch), hardcoded secrets, command injection, and unauthenticated remote servers.
- **Why it's worth watching**: The MCP ecosystem has exploded to thousands of public servers, and nobody's really been auditing these client config files — a single `npx -y some-mcp-server` line can hand a model your filesystem, credentials, and execution rights. The tool needs no Node.js, Docker, or LLM API key: it's pure static analysis, with 12 rules mapped to the OWASP MCP Top 10, and it can emit SARIF straight into CI. Compared to broader MCP security scanners, it deliberately narrows scope to static config auditing — the payoff is a scan that finishes in seconds with zero runtime dependencies.
- **Stack**: Pure Python (no external runtime dependencies) + SARIF output + GitHub Actions CI integration
- **Getting started**: Easy — `pip install mcp-audit-tool`, then run one command against your config file. No service to stand up, no browser to install.

---

### strands-decider ⭐ 331

[GitHub](https://github.com/strands-labs/strands-decider) · Python · MIT

- **What it is**: A small "decision model" (also called a System 1 model) built for the [Strands Agents SDK](https://github.com/strands-agents/sdk-python) — instead of generating arbitrary text, it only does two things: pick from a set of options, or score something on a scale, with a calibrated confidence attached to every answer.
- **Why it's worth watching**: Agent workflows are full of small decisions — "which team should handle this ticket," "how urgent is this message" — that don't need an LLM's creativity but aren't worth training a dedicated classifier for either. strands-decider sits in that gap: faster inference than an LLM, without the data-labeling and training time a traditional classifier needs. The standout detail is the calibration — the project's own evaluation shows that at a confidence of 0.9 or above, answers are correct roughly 95% of the time on short classification tasks it's never seen, giving you a concrete threshold for when to just trust the answer versus confirm with a human. That's not something frontier LLM inference APIs expose today.
- **Stack**: PyTorch + MLX (Apple Silicon acceleration) / CUDA / CPU multi-backend + Strands Agents SDK
- **Getting started**: Medium — `pip install strands-decider` gets you the CLI, but you still need a pretrained model (like `strands-decider-2B-hobson-v19`) to actually use it, and swapping or fine-tuning your own takes extra digging.

---

### answer-me-with-html ⭐ 977

[GitHub](https://github.com/QingYunA/answer-me-with-html) · JavaScript · MIT

- **What it is**: An agent skill that gets Claude Code, Codex, Cursor, and similar tools to answer a hard question with a readable, laid-out one-page HTML, instead of a wall of plain text or a page the model had to hand-code from scratch.
- **Why it's worth watching**: Asking a model to "answer in HTML" directly works, but it's expensive — the model has to type out every line of CSS, every wrapper `div`, every SVG coordinate as output tokens. This skill has the model write only the content, handing layout off to a bundled CLI. The project's own benchmark (same question, same model — Claude Sonnet 5.5, asked both ways) found 6,873 output tokens and 46 seconds for the direct-HTML approach versus 923 tokens and 13 seconds with the skill — 3.6x faster. Total cost doesn't drop proportionally, though, since the skill adds two extra conversation turns (loading the skill, running the CLI) that each re-read context; what you save is wait time, not the bill.
- **Stack**: Node.js CLI (bundled inside the skill, no separate `npm install`) + Markdown-to-layout engine
- **Getting started**: Easy — have your agent run `npx -y skills add` to install it; how you ask questions day to day doesn't change.

## Notable Releases

No significant framework release today. The only two things that moved inside the 48-hour window were Pydantic AI v2.54.0 (released 10-03, already covered in yesterday's 10-04 digest) and Claude Code v2.1.289 (released 10-03, a set of small stability fixes — terminal freezing, stacked deny/ask rules — with no breaking changes called out, which doesn't clear this series' bar for a patch release).

## Today's Takeaway

OpenAI's own Dots has been live for barely a week, and open-dot already rebuilt the entire "personal agent running errands in the background" experience as open source. That tells you building a capability-equivalent personal agent is no longer the moat — the hard part is everything downstream of that: how passwords get stored, who approves risky actions, what the model is never allowed to see. mcp-audit-tool showing up the same day is the other side of that same coin — once anyone can open-source-clone an agent product, someone has to start guarding the pile of MCP configs sitting underneath it.

## References

- [composio-community/open-dot](https://github.com/composio-community/open-dot)
- [graygnatconsole/mcp-audit-tool](https://github.com/graygnatconsole/mcp-audit-tool)
- [strands-labs/strands-decider](https://github.com/strands-labs/strands-decider)
- [QingYunA/answer-me-with-html](https://github.com/QingYunA/answer-me-with-html)
- [GitHub Trending (daily)](https://github.com/trending?since=daily)
- [Pydantic AI v2.54.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.54.0)
- [Claude Code v2.1.289 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.289)
