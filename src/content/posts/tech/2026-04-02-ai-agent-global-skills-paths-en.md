---
title: "Where Should AI Agent Global Skills Live? The Division of Labor Between .claude, Codex Skills, and AGENTS.md"
date: 2026-04-02
type: guide
category: tech
tags: [ai-agent, skills, claude-code, codex, agents-md, developer-tools]
lang: en
description: "Dropping a skill into .claude doesn't make it available to every agent. This post breaks down how Claude Code, Codex Skills, and AGENTS.md divide responsibilities — and clarifies where global skills, project skills, and cross-agent rules actually belong."
tldr: "Skill paths are almost always runtime-specific. AGENTS.md is the reliable way to share rules across agents. Put personal reusable capabilities in each agent's supported global directory; put project workflows inside the repo."
draft: false
---

🌏 [中文版](/posts/tech/2026-04-02-ai-agent-global-skills-paths)

## TL;DR

Don't treat `~/.claude/skills/` as a shared standard that every AI agent reads.

The clearer picture from public documentation:

- Claude Code personal skills go in `~/.claude/skills/`
- Claude Code project skills go in `repo/.claude/skills/`
- Codex has its own Skills mechanism and catalog
- The most stable, predictable, git-worthy way to share rules across agents is `AGENTS.md`

One sentence: **put reusable capabilities in skills, put cross-agent rules in `AGENTS.md`.**

## The Situation

I originally assumed that putting a skill like `format-commit` into `.claude/skills/` would make it available to other agents as well.

That assumption fell apart quickly.

A single machine might run Claude, Codex, and other agent runtimes simultaneously. You end up with a pile of similar-looking directories:

```text
~/.claude/skills/
~/.codex/skills/
~/.agents/skills/
repo/.claude/skills/
repo/AGENTS.md
```

They look like variations of the same thing — just different paths. But they're not.

## The Problem

The core issue isn't "skill file in the wrong place." It's **mistaking a runtime's implementation path for a cross-agent standard**.

That mistake leads to several common misconceptions:

- I have a global skill — why isn't the other agent using it?
- Why does Claude trigger automatically but Codex doesn't?
- Why does committing a skill to the repo not make other agents pick it up?
- Is `~/.agents/skills/` a universal location that everyone supports?

The answer is almost always: **agents don't all read from the same paths, and they don't all treat "skills" as the same kind of mechanism.**

## What I Found

I started by looking for "the standard path" — and quickly discovered that public information is fragmented.

Claude Code's documentation is explicit and clean. It divides skills into three categories:

- Personal Skills: `~/.claude/skills/`
- Project Skills: `repo/.claude/skills/`
- Plugin Skills: bundled with plugins

Claude is clear that project skills should be committed to git so team members can use them after pulling.

Codex is different. The public emphasis isn't "put your skill in this specific folder." Instead, it focuses on:

- Codex has Skills
- OpenAI maintains a public Skills catalog
- Skills can be installed, shared, and reused

This design is more of a capability distribution mechanism — not a documentation emphasis on a single filesystem path.

`AGENTS.md` sits at the opposite end of the spectrum. Its entire point isn't to load skills for a specific agent — it's to:

- Define an open format
- Let different coding agents share the same set of project rules
- Capture commit conventions, test procedures, and project norms in one place

Once you see this, the conclusion is hard to miss: **skills are agent-specific; `AGENTS.md` is cross-agent.**

## The Solution

My approach settled into three layers — rather than searching for "one skill path that works everywhere."

### 1. Rules every agent should follow go in `AGENTS.md`

This layer holds:

- Commit message conventions
- Test and build commands
- Project structure and off-limits patterns
- Frontmatter rules for writing posts
- When to always include references

The reason is simple: these aren't skills — they describe how the entire repo works.

### 2. Project-specific workflows go in repo-level project skills

Good candidates include:

- `post`
- `format-commit`
- `release-note`
- `deploy-checklist`

If you mainly use Claude Code, this layer lives at:

```text
repo/.claude/skills/<skill-name>/SKILL.md
```

The value here isn't cross-agent coverage — it's giving everyone working in the same project with the same toolchain a consistent workflow.

### 3. Personal cross-project preferences go in each runtime's global skill mechanism

This layer is personal:

- Your commit style
- Your debug checklist
- Your code review habits
- Your common documentation generation flows

For Claude Code, the officially supported location is:

```text
~/.claude/skills/
```

For Codex, use Codex's own Skills mechanism — don't assume `.claude/skills/` will be picked up automatically.

### A structure that avoids common pitfalls

```text
repo/
├── AGENTS.md                  # Cross-agent project rules
├── .claude/
│   └── skills/               # Claude project skills
│       ├── post/
│       └── format-commit/
└── src/...

~/
├── .claude/
│   └── skills/               # Claude personal skills
└── (each agent's own global skill mechanism)
```

The key isn't how the directories look — it's not confusing "a runtime's load path" with "a universally shared standard."

## Why This Happens

Because `skill` and `agent instruction` solve two fundamentally different problems.

A `skill` is more like a reusable capability package:

- A set of instructions
- Optionally bundled with scripts, templates, and resources
- Applied by an agent automatically or semi-automatically in specific contexts

By nature, this is tightly coupled to a runtime. How an agent discovers a skill, triggers it, and installs it can differ across implementations.

`AGENTS.md` is a different kind of artifact. It doesn't give an agent a new capability — it tells the agent how this repo works:

- What the conventions are
- A stable, predictable entry point for any agent
- Rules that used to live scattered across READMEs, tribal knowledge, and verbal habits, now written down

Most people get stuck not because they don't understand skills, but because they're asking skills to carry cross-agent rule-sharing weight that skills were never designed for.

## What I Took Away

My decision rule is now simple:

- **Is this a repo rule?** Put it in `AGENTS.md`.
- **Is this a workflow capability for a specific agent?** Put it in that agent's skill system.
- **Is this a personal cross-project preference?** Put it in that agent's global skills.

And if you want it even more direct:

**Don't ask "which global skills directory do all agents read?" Ask "which things shouldn't be shared through skills at all?"**

## References

- [Claude Docs: Agent Skills](https://docs.claude.com/en/docs/claude-code/skills)
- [OpenAI Skills Catalog for Codex](https://github.com/openai/skills)
- [OpenAI Codex](https://openai.com/codex)
- [AGENTS.md](https://agents.md/)
