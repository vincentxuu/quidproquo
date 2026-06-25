---
title: "Claude Code Global Skills Not Found in New Sessions? Understanding Skill Discovery and How to Debug It"
date: 2026-03-27
type: debug
category: tech
tags: [claude-code, skills, ai-agent, dx, troubleshooting, settings]
lang: en
tldr: "Global skills live in ~/.claude/skills/, but they go missing in new sessions or the Desktop App? The problem usually isn't a missing file — it's that the skill descriptions aren't being loaded into context. This post clarifies the CLI vs Desktop App differences, the role of settings.json, and the most reliable fix."
description: "An analysis of why Claude Code global skills disappear in new sessions or the Desktop App, clarifying the skill discovery mechanism, the difference between settings.json and settings.local.json, and providing troubleshooting steps and best practices."
draft: false
series:
  name: "Claude Code Automation Guide"
  order: 19
---

🌏 [中文版](/posts/tech/2026-03-27-claude-code-global-skills-not-found)

You set up global skills, they show up in the CLI with `/`, but when you open a new session or switch to the Desktop App and ask Claude "what skills do you have?", it only lists the system defaults. Every time you have to manually remind it to "check the home directory."

This is a common frustration. The core reason usually isn't that "the file doesn't exist" — it's that **the skill descriptions weren't properly loaded into Claude's context window (the information visible within a single conversation)**.

## First: What Is a Skill?

A skill is an SOP written for Claude — at its core, just a Markdown file. You write down the steps of a workflow, and when you type `/skill-name` in a conversation, Claude loads that document and follows the steps.

For example, if every commit needs to follow a specific format, you can write a `format-commit` skill. Then you just type `/format-commit`. No code required, no frameworks to learn.

Skill files live under `.claude/skills/` directories in two varieties:

- **Global skills**: in your home directory at `~/.claude/skills/`, available across all projects
- **Project skills**: in `<project>/.claude/skills/`, scoped to that project only

Once you understand this distinction, the rest of the problem becomes clear.

## How Skill Discovery Works

When Claude Code starts, it automatically scans for skills in the following locations:

| Level | Path | Scope |
|-------|------|-------|
| **Global** | `~/.claude/skills/<name>/SKILL.md` | All projects |
| **Project** | `<project>/.claude/skills/<name>/SKILL.md` | That project only |
| **Plugin** | `<plugin>/skills/<name>/SKILL.md` | Where that plugin is enabled |

The **description** from each discovered skill (the `description` field in the `---` frontmatter block) gets injected into context so Claude knows what's available. The full content is only loaded when you invoke `/skill-name`.

Key point: **skills are discovered automatically by filesystem location**, not registered in `settings.json`. `settings.json` handles permission control (e.g., denying a skill), not skill registration.

## "Visible in `/`" and "Claude Knows About It" Are Two Different Things

This is the most common source of confusion:

- **Visible in the `/` list** → Claude Code's UI found the file — purely a filesystem-level result
- **Claude says "I have this skill"** → the skill description was actually sent into Claude's conversation context

These are not guaranteed to be in sync. `/` is the result of a filesystem scan; Claude's answer depends on whether the skill description is in its context. So "visible in `/` but Claude says it doesn't exist" is entirely possible — the skill description may have been truncated due to budget limits, or simply never loaded.

## Why New Sessions or the Desktop App Can't Find Skills

### Reason 1: The Desktop App Resolves the Home Path Differently

The Desktop App is a standalone application, and it may locate the "home directory" differently from your terminal. If the paths don't match, it simply won't find `~/.claude/skills/`.

**How to verify:** Run this inside the Desktop App:

```bash
echo $HOME
ls ~/.claude/skills/
```

Check whether the path matches what you see in the CLI.

### Reason 2: Skill Context Budget Exceeded

By default, Claude Code allocates only **2%** of the context window for skill descriptions. In plain terms: the amount of information Claude can "see" in a single conversation is limited, and skill descriptions only take up a small slice. If you have many skills or long descriptions, the later ones get truncated — and Claude won't know they exist.

**How to verify:**

```bash
# Run inside Claude Code
/context
```

Check the output for any warnings about skill budget. If there are, you can adjust via environment variable:

```bash
export SLASH_COMMAND_TOOL_CHAR_BUDGET=8000
```

### Reason 3: The Session Didn't Reload the Plugin

After modifying or adding skills, already-open sessions won't automatically detect the changes.

**Fix:**

```bash
/reload-plugins
```

Or simply open a new session.

### Reason 4: SKILL.md Format Issues

- The filename must be `SKILL.md` (case-sensitive — `skill.md` won't work)
- The file must have a valid `---` frontmatter block at the top
- `user-invocable: false` will hide the skill from the `/` list
- `disable-model-invocation: true` prevents Claude from using it proactively

```markdown
---
name: my-skill
description: This line is loaded into context — it determines whether Claude knows this skill exists
user-invocable: true
---

Skill content...
```

## What Does settings.json Have to Do With Skills?

Many people assume skills need to be "registered" in `settings.json` to work — **they don't**. Skills are discovered automatically by file location.

The only way `settings.json` affects skills is if **you've set a permission rule there that blocks them**.

Claude Code has three layers of configuration, where later layers override earlier ones:

| Config File | Location | Description |
|-------------|----------|-------------|
| `~/.claude/settings.json` | Home directory | Your global settings |
| `.claude/settings.json` | Project directory | Shared by the team, committed to git |
| `.claude/settings.local.json` | Project directory | **Your personal overrides**, not committed, highest priority |

If skills suddenly disappear, check all three files for any rules that deny `Skill` — especially `settings.local.json`, which has the highest priority and overrides everything else.

## The Most Reliable Approach: Project-Level Skills

The problem with global skills is that they depend on `~/.claude/` existing and being readable. Switching machines, switching apps, or different path resolution can all cause issues.

**The most reliable approach is to put important skills in the project directory:**

```
<project>/
└── .claude/
    └── skills/
        └── format-commit/
            └── SKILL.md
```

Benefits:

- **Consistent across interfaces**: CLI, Desktop App, and Web all use the project directory as the baseline — no dependency on the home path
- **Committed to git**: Team members share them automatically; nothing is lost when switching machines
- **No path resolution issues**: Relative to the working directory, unaffected by `$HOME` differences

Global skills are best for personal, general-purpose workflows that don't need to be shared with a team. But if reliability is the top priority, project-level is always more dependable.

## Troubleshooting Checklist

When skills can't be found, check in this order:

```bash
# 1. Does the file exist?
ls -la ~/.claude/skills/

# 2. Is the SKILL.md format correct? (check frontmatter)
head -10 ~/.claude/skills/*/SKILL.md

# 3. Is the Desktop App's HOME path consistent?
echo $HOME

# 4. Is the skill context budget exceeded?
# Run /context inside Claude Code to check

# 5. Is anything blocked by settings?
cat ~/.claude/settings.json | grep -i skill
cat .claude/settings.json | grep -i skill 2>/dev/null
cat .claude/settings.local.json | grep -i skill 2>/dev/null

# 6. Force a reload
# Run /reload-plugins inside Claude Code
```

## Summary

| Symptom | Most Likely Cause |
|---------|-------------------|
| Visible in `/`, but Claude says it doesn't exist | Skill description not loaded into context (budget exceeded or load timing) |
| Works in CLI, missing in Desktop App | `$HOME` path resolved differently |
| Missing in every new session | SKILL.md format error or blocked by settings |
| Shows up sometimes, not others | Context budget exceeded — later skills truncated |

One principle to remember: **if you want skills to work in all environments, putting them in the project directory is more reliable than the home directory.**

## References

- [Claude Code Skills — Official Docs](https://docs.anthropic.com/en/docs/claude-code/skills)
- [Claude Code Settings](https://docs.anthropic.com/en/docs/claude-code/settings)
- [Claude Code Skill Design Guide: Turn Repetitive Workflows into a Single Command](/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide)
- [Claude Code's Three-Layer Quality Defense: Hooks, Skills, and Agent Config Files](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md)
