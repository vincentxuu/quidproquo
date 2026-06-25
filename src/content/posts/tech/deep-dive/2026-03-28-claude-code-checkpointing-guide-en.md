---
title: "Claude Code Checkpointing: Building Safe Restore Points for AI Operations with Git"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, checkpointing, git, safety, undo, dx]
lang: en
tldr: "Claude Code has a built-in git checkpoint mechanism — it automatically creates a commit before each major operation so you can roll back with a single command if anything goes wrong. Combined with /undo, /rewind, and git worktree isolation, every AI-driven change stays fully reversible."
description: "A guide to Claude Code's Checkpointing safety mechanism: when auto-checkpoints trigger, how to use the /undo and /rewind commands, manual checkpoint strategies, integrating with git worktree, and how checkpoints act as a last line of defense in bypassPermissions mode."
draft: true
series:
  name: "Claude Code Automation Guide"
  order: 24
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-checkpointing-guide)

<!-- TODO: To be written -->
<!-- Reference official docs: https://code.claude.com/docs/en/checkpointing.md -->

## Planned Outline

### What Is Checkpointing
- Claude Code uses git to create operation restore points
- Not a separate system — it's just git commits
- Makes every AI-driven change reversible

### Auto Checkpoints
- When auto-checkpoints are created
- Format and identification of checkpoint commits
- Difference from regular commits

### Rollback Commands
- `/undo`: roll back to the previous checkpoint
- `/rewind`: roll back to a specific checkpoint
- Diff preview and rollback in the web/desktop interface

### Manual Checkpoint Strategy
```bash
git add -A && git commit -m "Checkpoint: before refactor"
```
- Especially important in YOLO mode
- Combine with `--max-turns` to limit operation scope

### Integrating with Git Worktree
- Each sub-agent works in an isolated worktree
- Agent Teams `--spawn worktree` mode
- Multiple people/agents editing simultaneously without conflicts

### Safety Guarantees
- Last line of defense in bypassPermissions mode
- Checkpoint + Docker = double protection
- Checkpoint strategy in team environments

## References

- [Claude Code Best Practices — Rewind with Checkpoints](https://docs.anthropic.com/en/docs/claude-code/best-practices#rewind-with-checkpoints) — Official explanation of the checkpoint mechanism and how to use the /rewind command
- [Claude Code Common Workflows — Git Worktrees](https://docs.anthropic.com/en/docs/claude-code/common-workflows#run-parallel-claude-code-sessions-with-git-worktrees) — Official guide to using git worktree with checkpoints for parallel isolated development
- [Claude Code Permission Modes](https://docs.anthropic.com/en/docs/claude-code/permission-modes) — Risk explanation for bypassPermissions mode, where checkpoints serve as the safety net
- [Git Internals — git commit documentation](https://git-scm.com/docs/git-commit) — Official git commit documentation for understanding checkpoint's underlying implementation
- [Git Worktree official documentation](https://git-scm.com/docs/git-worktree) — git worktree command reference for sub-agent isolation with checkpoints
- [Claude Code Settings](https://docs.anthropic.com/en/docs/claude-code/settings) — Sandbox settings in settings.json, combined with checkpoints for dual-layer protection
- [Claude Code Overview](https://docs.anthropic.com/en/docs/claude-code/overview) — Overall Claude Code architecture overview, understanding checkpoints' role in agentic workflows
