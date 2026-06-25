---
title: "The Complete Guide to CLAUDE.md and AGENTS.md: Behavior Instructions Written for AI"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, claude-md, agents-md, ai-agent, dx, configuration]
lang: en
tldr: "CLAUDE.md is a project-level behavioral guide for AI. AGENTS.md is a task template for sub-agents. Both are plain Markdown — no code required — yet they dramatically shape the quality of AI behavior. This guide covers syntax, file placement, inheritance rules, and real-world examples."
description: "A deep dive into Claude Code's instruction file system: the syntax, file structure, inheritance rules, and how CLAUDE.md and AGENTS.md integrate with Hooks and Skills to establish a shared AI development standard across your team."
draft: true
series:
  name: "Claude Code Automation Guide"
  order: 3
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-claude-md-agents-md-guide)

<!-- TODO: To be written -->

## Planned Outline

### What is CLAUDE.md
- Project-level behavioral guide for AI
- Placed in the repo root directory; automatically read when Claude Code starts
- Similar to `.editorconfig`, but the audience is AI

### File Placement and Inheritance Rules
- Project root directory vs. subdirectories
- `~/.claude/CLAUDE.md` (global) vs. project-level
- Priority order for inheritance and overrides

### CLAUDE.md Syntax and Best Practices
- Basic structure: project description, tech stack, conventions
- Common instruction patterns: commit message format, naming conventions, testing strategy
- Anti-patterns: too long, too vague, overlapping with Hook responsibilities

### What is AGENTS.md
- Task templates for sub-agents
- When to use AGENTS.md vs. CLAUDE.md

### Real-World Examples
- Per-package CLAUDE.md in a monorepo
- Different coding style guides for frontend and backend
- Full configuration combined with Hooks and Skills

### Division of Responsibilities: Instructions vs. Hooks vs. Skills
- Instruction files = suggestions (AI may ignore them)
- Hooks = enforcement (determined by exit code)
- Skills = workflows (executed step by step)

## References

- [Store Instructions and Memories](https://docs.anthropic.com/en/docs/claude-code/memory) — The official complete guide to CLAUDE.md and AGENTS.md, including file locations, inheritance rules, and best practices
- [Claude Code Best Practices — Write an Effective CLAUDE.md](https://docs.anthropic.com/en/docs/claude-code/best-practices#write-an-effective-claudemd) — Official guidance on CLAUDE.md structure, conciseness principles, and common mistakes
- [Claude Code Settings](https://docs.anthropic.com/en/docs/claude-code/settings) — Settings like `claudeMdExcludes` to control which CLAUDE.md files are loaded in a monorepo
- [Claude Code Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks) — Hook mechanism explained, and understanding the fundamental difference from CLAUDE.md "suggestions"
- [Extend Claude Code](https://docs.anthropic.com/en/docs/claude-code/extend-claude-code) — Guide to choosing and combining Skills, Hooks, and MCP, including the role of CLAUDE.md
- [OpenAI — AGENTS.md Specification](https://github.com/openai/openai-agents-python) — OpenAI's AGENTS.md format reference, for understanding cross-tool AI behavioral instruction standards
- [Claude Code — .claude Directory Structure](https://docs.anthropic.com/en/docs/claude-code/dot-claude-directory) — Complete documentation of the `.claude/` directory, providing context for where CLAUDE.md fits in the configuration system
