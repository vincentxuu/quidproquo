## Why

There is no systematic way to evaluate how an AI agent project compares to a production-grade agent harness. Developers building agents (in any language, for any LLM) lack a reference framework to identify architectural gaps — they don't know what they don't know. Claude Code's source represents one of the most mature agent harnesses available, making it an ideal reference for extracting universal capability dimensions.

## What Changes

- Create an independent project (`~/Projects/agent-architecture-diff-tool/`) with:
  - A **capability reference document** (`architecture.md`) defining 39 dimensions across 3 categories (Harness Engineering, Context Engineering, Prompt Engineering), each with maturity levels 0-5
  - A **detection signals file** (`signals.yaml`) with file patterns, code patterns, and evaluation criteria per dimension
  - A **Claude Code skill** (`/agent-diff`) that scans any agent project against the reference and produces a scored gap report with action plans
- Install the skill globally via `~/.claude/skills/` for use in any project

## Capabilities

### New Capabilities

- `reference-architecture`: Extract and maintain a 39-dimension capability checklist from Claude Code's source — the "answer key" for agent maturity assessment
- `architecture-diff-skill`: Claude Code skill that dispatches parallel subagents to scan a target project, score it against the reference, and produce a Markdown gap report with action plans

### Modified Capabilities

(none — no existing specs)

## Impact

- **New project**: `~/Projects/agent-architecture-diff-tool/` (independent git repo)
- **New skill**: `~/.claude/skills/agent-diff.md` (symlink)
- **Dependencies**: None — the skill uses only Claude Code's built-in tools (Agent, Glob, Grep, Read, Write)
- **Reference source**: `/Users/xiaoxu/Projects/claude-code-source` (read-only, used only during Phase 1 extraction)
