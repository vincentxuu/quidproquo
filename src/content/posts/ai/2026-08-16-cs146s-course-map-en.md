---
title: "Stanford CS146S, Two Syllabi Side by Side: What Changed in a Year"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - agentic-coding
  - ai-agent
  - claude-code
  - context-engineering
  - ai-course
lang: en
type: deep-dive
series:
  name: "CS146S: Ten Weeks of AI-Native Development"
  order: 1
tldr: "Stanford CS146S's Fall 2026 syllabus compresses prompting from a full week into a single bullet, drops the terminal and UI-generation weeks, and adds Agent Skills, Agent-Ready Codebases, Background Agents, and AI-Native Team. Grading moved too: the final project fell from 80% to 50%, with 30% now on open source contributions. This series reads all ten weeks."
description: "A side-by-side comparison of Stanford CS146S: The Modern Software Developer for Fall 2025 and Fall 2026 — week-by-week topics, guest speakers, and grading weights, plus how to study it without a Fall 2026 reading list."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-16-cs146s-course-map)

Stanford runs a for-credit course called [CS146S: The Modern Software Developer](https://themodernsoftware.dev/). It does not teach you to write code; it teaches you to direct coding agents that write code. It first ran in fall 2025, and the fall 2026 syllabus (classes start 9/22) is already published — **with changes big enough to read as an industry signal**.

This series works through the Fall 2026 syllabus one week per post. This first post covers the course itself, then puts both syllabi side by side.

## The hard facts

The course site keeps its syllabus in a front-end chunk rather than in the page source, so the numbers below come from reading the site's actual data object:

- **3 units**, ten weeks, one session each Tuesday and Thursday (Fall 2025 ran Monday/Friday)
- Prerequisites: CS111/CS161-equivalent programming experience, CS221/229 recommended
- The FAQ puts the workload at **10–12 hours per week**: "Expect approximately 10-12 hours per week including lectures, assignments, and project work."
- Language-agnostic; examples lean on Python and JavaScript
- Auditing is open to Stanford students and staff, but "we won't be able to grade your homework or give advice on final projects"
- Instructor Mihail Eric, whose [LinkedIn](https://www.linkedin.com/in/mihaileric/) lists him as Head of AI at Monaco and an adjunct lecturer at Stanford

Everything from Fall 2025 is public: weekly slides, reading lists, and the [GitHub assignments repo](https://github.com/mihail911/modern-software-dev-assignments). That is the main reason this course is worth following — it isn't a syllabus you have to enroll to read.

An [earlier post on 2026 AI courses](/posts/ai/2026-07-10-ai-courses-2026-guide) already covered CS146S in one section, but only through Fall 2025. What follows is the new part.

## Ten weeks, both versions

| Week | Fall 2025 | Fall 2026 |
|---|---|---|
| 1 | Introduction to Coding LLMs and AI Development | **The Internals of Coding Agents** |
| 2 | The Anatomy of Coding Agents | **Advanced Context Engineering** |
| 3 | The AI IDE | **Agent Skills and CLI** |
| 4 | Coding Agent Patterns | **Customizing Your Agent and Repository** |
| 5 | The Modern Terminal | **Agent-Ready Codebases** |
| 6 | AI Testing and Security | **Agentic Code Review** |
| 7 | Modern Software Support | Security |
| 8 | Automated UI and App Building | **Background Agents** |
| 9 | Agents Post-Deployment | **Building an AI-Native Team** |
| 10 | What's Next for AI Software Engineering | **The Software Factory + The Future** |

Bold marks new or substantially rewritten weeks. Of the ten slots, only security survives in both versions; the other eight all moved.

## Three changes worth noting

**One: prompting went from a week to a bullet.**

Fall 2025 devoted an entire session to "Power prompting for LLMs," with readings covering Google's prompt engineering overview, the [Prompting Guide](https://www.promptingguide.ai/techniques) techniques page, and Karpathy's LLM deep dive. Fall 2026 opens with "Course intro + build Claude Code in 200 lines," followed by "deep dive into the system prompts that define the agent."

Prompting didn't disappear — it moved into Week 2 as "Advanced prompting techniques and when each applies," sharing the week with RePPIT, spec-driven development, and MCP. In one year, "how to ask" went from the course's starting point to a sub-topic of context engineering.

**Two: product tours got replaced by infrastructure.**

Two Fall 2025 weeks orbited specific products. Week 5, "The Modern Terminal," had a reading list of three Warp documents and Warp CEO Zach Lloyd as guest; Week 8, "Automated UI and App Building," featured Vercel's head of AI research. Neither week exists in Fall 2026.

What replaced them: **Agent-Ready Codebases** (is your repo fit for agents to work in), **Background Agents** (async, cloud-delegated, running in fleets), and **Building an AI-Native Team** (MCP portals, LLM gateways, model routing, cost). All three share a trait — they are not about the editor in front of you, they are about the system around you.

**Three: grading made upstream contribution a hard metric.**

| Component | Fall 2025 | Fall 2026 |
|---|---|---|
| Final Project | 80% | **50%** |
| Weekly Assignments | 15% | 15% |
| Open Source Contributions | — | **30%** |
| Class Participation | 5% | 5% |

Thirty percentage points came off the final project and landed intact on open source contributions. A course about using agents to write code now stakes nearly a third of the grade on whether you pushed changes back into someone else's repo — which says more about its intent than any course description.

## The guest list changed direction too

Fall 2025 leaned toward developer-tool CEOs: Warp's CEO, Semgrep's CEO, Graphite's CPO, Vercel's head of AI research, closing with a16z's Martin Casado.

Fall 2026 so far lists [Lee Robinson](https://leerob.com/cursor) (who left Vercel for Cursor in July 2025 to work on developer education), Boris Cherny (creator of Claude Code, listed here under Anthropic), Eno Reyes ([Factory](https://factory.ai/) co-founder and CTO, on agent readiness), Silas Alberti (Cognition), and Isaac Evans (Semgrep). Weeks 8, 9, and 10 still say TBD.

Alberti and Evans appear in both versions, but the topics shifted: Alberti moved from Week 3's "AI IDE" to Week 6's agentic code review.

## No Fall 2026 reading list — so what

At the time of writing (mid-August 2026) the course is a month out, and the Fall 2026 syllabus lists topics and session titles but **no assigned readings**. Fall 2025 had 45 readings, but the topics no longer line up.

Fall 2025's material, however, is fully public:

| Material | Count |
|---|---|
| Assigned readings | 45 |
| Lecture slide decks | 18 |
| GitHub assignments | 8 |

So this series works in two layers: **the Fall 2026 weekly topics are the skeleton, classroom content comes from the public Fall 2025 slides on the same topics, and only where Fall 2025 has no counterpart (Skills, Agent-Ready Codebases, Background Agents, AI-Native Team) do I go find primary material myself** — with every passage marked as either the course's claim or an outside source's.

The slides aren't reachable from the front page, but every session on the syllabus tab links one, as a public `docs.google.com/presentation` file. Reading them turns up a fair amount that appears in no official documentation or blog post — the four "what Claude actually does underneath" points in the Week 1 session, the eight-field design doc template in Week 3, the human/agent division-of-labor table in Week 4.

The self-sourced part includes: Week 2's RePPIT has [a full write-up by the instructor himself](https://mlops.community/blog/reppit-a-framework-to-ship-production-code-2-3x-faster) (MLOps Community, June 2026); Week 5's agent readiness has [Factory's published eight-pillar, five-level framework](https://factory.ai/news/agent-readiness); Week 3's skills have [Anthropic's engineering post](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills).

## How this series is laid out

One post per week plus this overview, eleven in total:

1. This post — the course and the two syllabi
2. Week 1, agent internals: the 200-line loop and production system prompts
3. Week 2, context engineering: RePPIT, spec-driven development, MCP, tool design
4. Week 3, Agent Skills and the CLI
5. Week 4, customizing your agent and repo: CLAUDE.md / AGENTS.md, hooks, subagents
6. Week 5, agent-ready codebases
7. Week 6, agentic code review
8. Week 7, security
9. Week 8, background agents
10. Week 9, the AI-native team
11. Week 10, the software factory and what's next

## What will go stale

- The Fall 2026 readings, slides, and assignment repo land only after classes start — the Fall 2025 page is the reference for what those artifacts last looked like
- Guest speakers for weeks 8, 9, and 10 are currently TBD
- Marketing lines like "world's first course of its kind," "10x productivity," and the newsletter's "trusted by 32K developers globally" are course self-descriptions with no independent verification
- The comparison between the two syllabi is my own item-by-item diff; the course publishes no changelog
- All classroom content quoted in this series comes from Fall 2025 slides; those sessions may be taught differently in Fall 2026

## References

- [CS146S: The Modern Software Developer](https://themodernsoftware.dev/) — Fall 2026 course site (overview / syllabus / FAQ tabs)
- [CS146S Fall 2025](https://themodernsoftware.dev/fall2025) — the older version, with the full reading list, slides, and guest list
- [CS146S Course | Stanford University Bulletin](https://bulletin.stanford.edu/courses/2274401) — the university's catalog entry
- [modern-software-dev-assignments](https://github.com/mihail911/modern-software-dev-assignments) — Fall 2025 assignment repo (8 assignments)
- The 18 Fall 2025 lecture decks hang off the syllabus tab of the [fall2025 page](https://themodernsoftware.dev/fall2025), as the Slides link beside each session
- [RePPIT: A Framework to Ship Production Code 2-3X Faster](https://mlops.community/blog/reppit-a-framework-to-ship-production-code-2-3x-faster) — Mihail Eric, MLOps Community, 2026-06-02
- [Introducing Agent Readiness](https://factory.ai/news/agent-readiness) — Factory, 2026-01-20
- [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — Anthropic Engineering, 2025-10-16
- [Which AI courses to take in 2026](/posts/ai/2026-07-10-ai-courses-2026-guide) — this site, comparing CS146S against other platforms (in Chinese)
