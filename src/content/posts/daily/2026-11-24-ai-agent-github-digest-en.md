---
title: "AI Agent GitHub Digest — 2026-11-24"
date: 2026-11-24
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, mcp, security]
lang: en
description: "Claude-BugHunter and superpowers climb the chart by packaging expertise as skills; dbx takes the other route and bakes AI and MCP directly into the tool itself; paper-orchestra's 3.2x growth in five days is another win for vertical tasks over general frameworks"
tldr: "elementalsouls/Claude-BugHunter gained 1,716 stars today, the fastest on the whole trending board; obra/superpowers passed 324,000 total stars on the skill-bundle route; t8y2/dbx skips external agents and builds its own AI assistant and MCP server straight into a database tool; google-research/paper-orchestra's star count is up 3.2x in five days. No framework release cleared the bar today."
series:
  name: "AI Agent GitHub Digest"
  order: 101
---

> :globe: [中文版](/posts/daily/2026-11-24-ai-agent-github-digest)

## Today's Highlight

Pull apart today's "agents getting skills" wave and a fork is taking shape: Claude-BugHunter and superpowers, both new to the chart today, are on the same path — package expertise as a skill and drop it into an existing agent. One teaches Claude Code penetration testing and bug hunting; the other teaches it a software engineering methodology. dbx takes the opposite route: it builds its own AI SQL assistant and MCP server straight into the database tool, instead of waiting for someone else's agent to load its skill. Meanwhile paper-orchestra — which we covered five days ago, narrowly focused on the single task of writing a paper — went from 1,889 to 6,024 total stars, a 3.2x jump. That's another independent case of the same pattern: general frameworks cool off faster than tools built for one vertical task.

## Trending Repos

### elementalsouls/Claude-BugHunter ★18,447 (+1,716/day)

[GitHub](https://github.com/elementalsouls/Claude-BugHunter)　·　Python　·　MIT + CC BY 4.0

- **What it is**: A bundle of 83 Claude Code skills plus 15 slash commands that packages the entire bug-hunting and external red-team workflow — methodology, attack patterns distilled from 681 disclosed HackerOne reports, enterprise identity/infrastructure attack chains, and a seven-question gate for reports before submission. Everything triggers automatically by topic; you never call a skill by name.
- **Why it's worth watching**: Most "give your agent a skill" projects stop at general coding help. This one turns a security researcher's actual field manual — VRT mappings, out-of-scope rebuttal templates included — into a skill bundle outright. It gained 1,716 stars today, the fastest growth on the entire trending board, which says the ceiling for "package rare expertise as a skill" is higher than it looks.
- **Tech stack**: Claude Code Skills system + Burp Suite MCP integration + the `cbh` CLI (installed via pipx)
- **Learning curve**: Low — one line with `/plugin marketplace add` installs it; the HackerOne API key can be left blank and the public tools still work.

---

### obra/superpowers ★324,432 (+788/day)

[GitHub](https://github.com/obra/superpowers)　·　Shell　·　MIT

- **What it is**: Packages a full software engineering methodology — red/green TDD, YAGNI, DRY, nailing down requirements before writing code, agents reviewing each other's work — into a set of skills that trigger automatically, so a coding agent doesn't just "have skills," it follows a discipline.
- **Why it's worth watching**: It already supports over a dozen agent harnesses — Claude Code, Antigravity, Codex, Cursor, Gemini CLI, and more — which says the bet isn't on any single tool; it's that "software engineering discipline" itself can be decoupled from any one agent and shipped on its own. Total stars have passed 324,000, and it's still gaining a steady 788 a day, which says this methodology isn't a one-off novelty.
- **Tech stack**: The open Agent Skills format + each harness's own plugin/marketplace mechanism
- **Learning curve**: Low — one install command per harness; using it across multiple harnesses means installing it separately for each.

---

### t8y2/dbx ★31,188 (+34/day)

[GitHub](https://github.com/t8y2/dbx)　·　Rust　·　Apache-2.0

- **What it is**: A 25MB cross-platform database manager supporting 100+ databases (MySQL, PostgreSQL, MongoDB, ClickHouse, and more), with a built-in AI SQL assistant. It also ships a separately distributed MCP server written in Rust, so agents like Claude Code and Cursor can query databases through connections already configured in DBX.
- **Why it's worth watching**: Unlike the two skill bundles above, dbx doesn't wait for someone else's agent to load its skill — it builds AI capability into the tool itself. The MCP server even splits access into read-only, writable, and high-risk-write tiers, which shows that for something as sensitive as a database, vendors are already taking "how far should an agent be allowed to go" seriously, instead of just exposing a wide-open interface.
- **Tech stack**: Rust + a Tauri 2 desktop shell + a standalone MCP server package (`@dbx-app/mcp-server`)
- **Learning curve**: Medium — the desktop app works out of the box, but connecting an agent means installing the MCP server separately and configuring a connection allowlist.

---

### google-research/paper-orchestra ★6,024 (+234/day)

[GitHub](https://github.com/google-research/paper-orchestra)　·　Python　·　Apache-2.0

- **What it is**: A multi-agent framework from Google Research built specifically to write a submittable academic paper, splitting the work across agents — literature review, outline, drafting each section, revision, figures — and producing a final LaTeX manuscript.
- **Why it's worth watching**: When we first covered this repo five days ago (11/18), it had 1,889 total stars; today it's at 6,024 — a 3.2x jump — with no major news hook or new feature behind it. The pull is purely "focused on one concrete vertical task." Set against the general skill bundles we've been tracking (CLI-Anything, last30days-skill), whose daily gains have been shrinking, this is a second independent case of the same pattern: general frameworks lose their novelty faster than vertical tools do.
- **Tech stack**: Python + LaTeX automation + the Semantic Scholar API, with a choice of Gemini or OpenAI models
- **Learning curve**: Medium — you need your own LaTeX template and a set of raw materials; it's not ready to run out of the box.

## Notable Releases

No framework release cleared the bar today. Across the 13 frameworks checked (LangGraph, CrewAI, the MCP spec, Mastra, Pydantic AI, Agno, Claude Code, Composio, smolagents, LlamaIndex, DSPy, Haystack, browser-use), none shipped anything new in the last 48 hours — the most recent were browser-use 1.0.8 (11/22, a patch already covered in the previous article) and LangGraph 1.2.24 (11/20). Mastra did get a Launch YC page today introducing its TypeScript agent framework, but that's a launch listing, not a version bump — the package itself is still 1.40.1 from 11/18, so it doesn't count here.

## Today's Takeaway

I started out assuming "package expertise as a skill" and "build the agent into the tool itself" were two parallel approaches serving different situations. But lining up dbx's permission tiers against Claude-BugHunter's and superpowers' topic-triggered skills shows they're answering the same question — how to let an agent act only when it should, without making someone call a skill by name every time. One side solves it with triggers that read the situation; the other solves it with permission tiers that cap what the tool can do. Different mechanisms, same goal.

## References

- [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter)
- [obra/superpowers](https://github.com/obra/superpowers)
- [t8y2/dbx](https://github.com/t8y2/dbx)
- [google-research/paper-orchestra](https://github.com/google-research/paper-orchestra)
- [paper-orchestra, covered 11/18 (★1,889 at the time)](/posts/daily/2026-11-18-ai-agent-github-digest-en)
- [GitHub Trending (snapshot taken 2026-11-23)](https://github.com/trending?since=daily)
- [LangGraph 1.2.24 Release Notes](https://github.com/langchain-ai/langgraph/releases/tag/1.2.24)
- [browser-use 1.0.8 Release Notes](https://github.com/browser-use/browser-use/releases/tag/1.0.8)
- [Launch YC: Mastra](https://ycombinator.com/launches/Muk-mastra-the-open-source-javascript-framework-for-building-agents)
- [Mastra npm package (latest 1.40.1)](https://www.npmjs.com/package/mastra)
