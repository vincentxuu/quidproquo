---
title: "Skill vs Subagent: Comparing Two Agent Collaboration Modes in Claude Code"
date: 2026-03-30
type: guide
category: ai
tags: [claude-code, multi-agent, subagent, skill]
lang: en
tldr: "A Skill is a prompt template you invoke manually. A Subagent is an independent agent that Claude routes to automatically. They look similar, but differ completely in trigger mechanism, tool isolation, and context management."
description: "Comparing the design philosophy, use cases, and implementation differences between Skills and Subagents in Claude Code"
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-30-skill-vs-subagent-comparison)

When doing AI development with Claude Code, you'll eventually hit a problem: a single agent can't handle everything. At that point, you have two paths -- Skills and Subagents. On the surface they look alike -- both extract capabilities out of the main agent -- but the design philosophy and use cases are completely different.

## Skill: A Button You Press Yourself

A Skill is essentially a **prompt template**. You define a system prompt, bind it to a slash command, and invoke it manually when needed.

```
/ai-expert Help me design a reranking strategy for a RAG pipeline
```

At execution time, the skill's prompt expands and is injected into the main conversation. Claude responds within the same context window. No independent session, no tool restrictions, no automatic triggering.

**Good fit for:**
- You know exactly which domain you're asking about
- Single tasks that don't need to chain with other capabilities
- Quickly switching Claude's "role"

**Not a good fit for:**
- You throw a large task at it and want automatic decomposition
- You need to restrict tool access (e.g., read-only, no writes)
- You need cross-session memory

**Practical example:**
You're developing a RAG system and hit an embedding model selection question. Just fire `/ai-expert` and ask. You know this is an AI domain problem -- you did the routing yourself.

## Subagent: Claude Finds Its Own Teammates

A Subagent is an **independent agent session** with its own system prompt, tool permissions, and can even be assigned a different model.

You define one by placing a markdown file in `.claude/agents/`:

```markdown
---
name: stock-analyst
description: Stock analysis expert. Analyzes price trends, financial reports, and technical indicators.
tools: Read, Bash, Grep
model: sonnet
memory: project
---

You are a stock analyst. Upon receiving a task, analyze technical indicators and provide specific recommendations.
```

The key difference is the `description` field -- Claude uses this description to **automatically decide** whether to delegate a task to this subagent. You don't invoke it manually; Claude decides on its own.

**Good fit for:**
- Complex tasks requiring multiple specializations where you want automatic division of labor
- Tool isolation is needed (e.g., a db-reader that can only run SELECT)
- Different models are needed (main agent uses opus for thinking, subagent uses haiku for repetitive work)
- An independent context window is needed to avoid bloating the main conversation

**Not a good fit for:**
- Simple Q&A that a single prompt can handle
- You always `@mention` manually -- at that point it's no different from a skill

**Practical example:**
You say "Analyze TSMC's recent stock price and generate an audio report." Claude determines on its own that it needs `stock-analyst` to analyze the data, then hands the result to `tts-agent` to generate audio. You only issued one prompt; the routing was automatic.

## Overall Architecture

```
┌───────────────────────────────────────┐
│            Your Prompt                 │
│                  │                     │
│                  ▼                     │
│          ┌──────────────┐             │
│          │  Main Agent  │             │
│          └──────┬───────┘             │
│                 │                      │
│         ┌───────┴───────┐             │
│         ▼               ▼             │
│    ┌─────────┐    ┌─────────┐        │
│    │  Skill  │    │Subagent │        │
│    │         │    │         │        │
│    │ You     │    │ Auto    │        │
│    │ invoke  │    │ routing │        │
│    │         │    │         │        │
│    │ Same    │    │ Separate│        │
│    │ context │    │ session │        │
│    └─────────┘    └─────────┘        │
│   Manual trigger  Auto trigger        │
└───────────────────────────────────────┘
```

## The Bottom Line

To decide which to use, ask yourself two questions:

| Question | Answer | Use |
|----------|--------|-----|
| Do I know what to ask and who to ask? | Yes | **Skill** |
| Do I want Claude to decide who to call? | Yes | **Subagent** |

The two aren't mutually exclusive. A Skill can be a preloaded capability inside a subagent. But the core trade-off is simple: if you always know who to call, just use a skill -- it's simple and direct. If you want to throw a task and have it automatically decomposed and delegated, define subagents and let Claude handle the routing. In most cases, start with skills, and when manual routing becomes a burden, upgrade to subagents.

## References

**Official documentation:**
- [Claude Code -- Custom Slash Commands (Skills)](https://docs.anthropic.com/en/docs/claude-code/slash-commands)
- [Claude Code -- Sub-agents](https://docs.anthropic.com/en/docs/claude-code/sub-agents)

**Related posts on this site:**
- [The Complete Guide to Claude Code Skills: Turn Repetitive Workflows into One-Line Commands](/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide) -- Skill design philosophy, file structure, and four practical examples
- [The Complete Guide to Claude Code Sub-agents: Custom AI Sub-agents and Parallel Execution](/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution) -- Full sub-agent configuration, tool control, and persistent memory
- [Claude Code Agent Teams: Multi-Agent Collaboration](/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide) -- Agent Teams multi-agent collaboration architecture
- [Claude Code's Three Layers of Quality Control: Hooks, Skills, and Config Files](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md) -- How hooks, skills, and config files work together
- [The Complete Guide to CLAUDE.md and AGENTS.md](/posts/tech/deep-dive/2026-03-28-claude-code-claude-md-agents-md-guide) -- Behavioral instructions written for AI
- [Google's Eight Multi-Agent Design Patterns](/posts/ai/2026-03-28-google-multi-agent-patterns) -- Use cases and trade-offs for eight patterns
