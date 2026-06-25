---
title: "Solving Duplicate Config Files for Codex and Claude Code with a Symlink"
date: 2026-04-05
type: guide
category: tech
tags: [claude-code, codex, agents-md, symlink, dx, ai-tools]
lang: en
tldr: "Claude Code only reads CLAUDE.md; Codex only reads AGENTS.md. Teams using both end up maintaining two identical files. Fix: make CLAUDE.md a symlink pointing to AGENTS.md — one source of truth."
description: "When a team uses both Codex and Claude Code, maintaining duplicate config files is a constant headache. This post solves it with a single symlink command."
draft: false
---

🌏 [中文版](/posts/tech/2026-04-05-symlink-agents-md-claude-md)

## TL;DR

Claude Code only reads `CLAUDE.md`, and Codex only reads `AGENTS.md`. Teams working with both tools end up with two files containing identical content. Make `CLAUDE.md` a symlink pointing to `AGENTS.md`, and the problem disappears.

## Context

Some team members use Codex, others use Claude Code. Both tools require a Markdown config file to define skills, conventions, and context — but they each look for a different filename:

- **Codex**: reads `AGENTS.md`
- **Claude Code**: reads `CLAUDE.md`

The result: two files in the repo with exactly the same content.

## The Problem

Every time you update a feature, add a skill, or adjust a convention, you have to manually sync both files. If you forget, the two tools behave inconsistently — and debugging becomes a nightmare, because you're never sure which version of the config the AI actually read.

This violates the DRY principle and goes against every engineer's instinct to automate.

## The Fix

Make `CLAUDE.md` a symlink pointing to `AGENTS.md`:

```bash
# Make sure AGENTS.md is the file you want to maintain going forward.
# If CLAUDE.md is currently your primary file, move its content over first.
mv CLAUDE.md AGENTS.md

# Create the symlink
ln -s AGENTS.md CLAUDE.md
```

From now on, you only maintain `AGENTS.md`. When Claude Code reads `CLAUDE.md`, it follows the symlink and reads the same file.

Verify it worked:

```bash
ls -la CLAUDE.md
# CLAUDE.md -> AGENTS.md
```

Make sure to commit the symlink to the repo so everyone who clones it gets the setup for free.

## Why This Happens

Claude Code and Codex are products from different companies (Anthropic vs. OpenAI), and each defined their own config file convention — there's no shared standard yet. `AGENTS.md` is the format pushed by OpenAI's Codex; Claude Code doesn't recognize it. And Codex, in turn, doesn't recognize `CLAUDE.md`.

A symlink is the most fundamental file aliasing mechanism in Unix systems. Git natively tracks symlinks, so this approach works perfectly under version control. The one caveat is Windows — symlinks on Windows require elevated permissions or Developer Mode, so teams with Windows users may need an extra step.

## What I Learned

When two tools are at odds, you don't always have to wait for official support. Unix primitives are often the simplest glue.

## References

- [CLAUDE.md official docs](https://docs.anthropic.com/en/docs/claude-code/memory#claudemd)
- [AGENTS.md specification](https://openai.com/index/introducing-codex/)
- [Git's handling of symbolic links](https://git-scm.com/docs/gitfaq#_how_does_git_handle_symbolic_links)
