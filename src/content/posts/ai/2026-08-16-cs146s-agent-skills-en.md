---
title: "CS146S Week 3: An Agent Skill Is a Folder — the Hard Part Is Two Lines of Description"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - agent-skills
  - claude-code
  - agent-cli
  - context-engineering
  - ai-agent
lang: en
type: deep-dive
series:
  name: "CS146S: Ten Weeks of AI-Native Development"
  order: 4
tldr: "The Agent Skills spec fits in a sentence: a directory containing a SKILL.md. The real design is three levels of progressive disclosure — only name and description load at startup, the body loads on a match, bundled files load on demand. This site's own repo carries 35 skills and 7,893 lines of SKILL.md, and startup still costs only those 35 metadata pairs."
description: "Stanford CS146S Fall 2026 Week 3, 'Agent Skills and CLI': SKILL.md's three levels of progressive disclosure, where scripts end and instructions begin, how skills divide from MCP, and the security surface a skill introduces."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-16-cs146s-agent-skills)

This is the fourth post in the [CS146S series](/posts/ai/2026-08-16-cs146s-course-map-en), covering Week 3 of Fall 2026.

Three topics: what skills are, how SKILL.md plus scripts encode a workflow, and web skills extending agent capability beyond the repo — plus "working effectively from the CLI." The guest is [Lee Robinson](https://leerob.com/cursor), who moved from Vercel to Cursor in July 2025 to work on developer education.

This week did not exist in Fall 2025 — Agent Skills hadn't shipped yet.

## A suspiciously small spec

Anthropic's definition, from [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) (October 2025):

> At its simplest, a skill is a directory that contains a `SKILL.md` file. This file must start with YAML frontmatter that contains some required metadata: `name` and `description`.

That's it. No DSL, no registration flow, no runtime API. On December 18, 2025, Anthropic published it as a [cross-platform open standard](https://agentskills.io/), so the same folder can be handed to agents from different vendors.

Why does something this thin deserve a week? Because the problem it solves isn't "how do I describe a capability" — it's "how do I have many capabilities without blowing up context."

## Three levels of progressive disclosure

This is the core mechanism and the only thing you need to remember:

| Level | Contents | When it enters context |
|---|---|---|
| 1 | frontmatter `name` + `description` | At startup, for every installed skill |
| 2 | the `SKILL.md` body | When the model judges the skill relevant |
| 3 | other files referenced from the body | When the model decides it needs them |

Anthropic's analogy is a well-organized manual that "starts with a table of contents, then specific chapters, and finally a detailed appendix." Their example is a PDF skill where form-filling instructions live in a separate `forms.md`, keeping the main file lean and "trusting that Claude will read `forms.md` only when filling out a form."

The payoff line matters: because agents have filesystems and code execution, "the amount of context that can be bundled into a skill is effectively unbounded."

For a concrete case, take this site's own repo. `.agents/skills/` holds **35 skills across 50 files and 7,893 lines of SKILL.md**. Loading all of that into a system prompt would burn six figures of tokens before any work started. Under the three-level scheme, startup costs only those 35 name/description pairs.

## Which makes description the hard part

Level 1 is the only thing guaranteed to be read. Whether your skill gets opened at all rides on those two lines.

Anthropic's advice: "Pay special attention to the `name` and `description` of your skill. Claude will use these when deciding whether to trigger the skill in response to its current task."

In practice that means a description should be written as a **retrieval key**, not an introduction — put the phrases a user would actually say directly into it. Compare:

```yaml
# won't be retrieved
description: "A tool for writing posts"

# will be retrieved
description: "Convert a conversation, notes, or experience into a Markdown post
  under src/content/posts/<category>/. Use when the user says 'write this up',
  'turn this into a post', 'deep dive', or pastes notes and asks to publish.
  Do NOT use to edit an existing post — use the post-update skill instead."
```

The second version does three things: names the artifact, lists trigger phrases, and **explicitly excludes** the case it doesn't handle. That last item is the most frequently omitted and the most common cause of skills fighting each other.

## Scripts vs. instructions: what belongs in code

Skills can bundle code for the agent to execute. Anthropic's line on where to draw the boundary is practical:

> sorting a list via token generation is far more expensive than simply running a sorting algorithm. Beyond efficiency concerns, many applications require the deterministic reliability that only code can provide.

A workable test: **if the answer is unique, verifiable, and repeated, write a script; if it needs judgment and varies by situation, write instructions.** Their PDF skill splits exactly this way — extracting form fields is a Python script (Claude runs it without reading either the script or the PDF into context), while what to fill in is instructions.

This site's skills split the same way: `pnpm check:references` and `pnpm lint` are commands, while "when does a post require a references section" is a rule written into SKILL.md.

## Skills versus MCP

The most common question, with a clean answer:

- **MCP grants capability** — the agent couldn't reach that system at all until a server connected it
- **Skills grant procedure** — the agent already has the tools; it just doesn't know how your team does things

Anthropic positions them as complements too, noting they'll explore "how Skills can complement MCP servers by teaching agents more complex workflows that involve external tools and software."

The syllabus phrase "web skills and extending agent capability beyond the repo" probably lands on that boundary. What it means concretely won't be clear until classes start in September — the syllabus currently has only that one line.

## Security: this is a folder that executes

Anthropic includes a warning in the same post:

> malicious skills may introduce vulnerabilities in the environment where they're used or direct Claude to exfiltrate data and take unintended actions.

The advice is to install only from trusted sources, and to audit file by file otherwise — paying particular attention to code dependencies, bundled resources, and instructions that tell the agent to reach untrusted network sources.

Put plainly: **installing a skill means executing someone else's work inside your agent.** The threat model is closer to installing an npm package than to saving a prompt. That line runs into [Week 7's supply chain and prompt injection](/posts/ai/2026-08-16-cs146s-agent-security-en).

## How to write a skill that actually fires

Anthropic's four development guidelines, condensed:

1. **Start with evaluation** — run real tasks, find where the agent struggles, then write a skill for that gap; don't write first and hunt for a use
2. **Structure for scale** — split SKILL.md when it gets unwieldy; keep mutually exclusive or rarely used content separate
3. **Think from the model's perspective** — watch how it actually uses your skill, especially cases where it should have fired and didn't
4. **Iterate with the model** — after a task, ask it to write successful approaches and mistakes back into the skill; when it goes off track, ask it to self-reflect

Point 4 has an easily missed effect: you find out that the context the agent actually needs is not the context you **assumed** it needed.

## What will go stale

- "Web skills" is the Fall 2026 syllabus's term; the course hasn't defined it yet
- Implementations of the cross-platform Agent Skills standard vary in maturity; verify portability per client
- This site's skill counts are a 2026-08-16 snapshot

## References

- [CS146S Fall 2026 syllabus](https://themodernsoftware.dev/) — Week 3 topics and guest
- [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — Anthropic Engineering, 2025-10-16
- [Agent Skills open standard](https://agentskills.io/) — cross-platform spec, published 2025-12-18
- [anthropics/skills](https://github.com/anthropics/skills) — official open-source skill collection
- [Agent Skills documentation](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)
- [Cursor | Lee Robinson](https://leerob.com/cursor) — this week's guest on his current role
