---
title: "Claude Code's Three-Layer Quality Defense: Hooks, Skills, and Instruction Files"
date: 2026-03-26
type: guide
category: tech
tags: [claude-code, ai-agent, dx, ci-cd, code-quality, claude-md, agents-md]
lang: en
tldr: "Hooks are automated safety nets (blocking bad commits), Skills are interactive workflows (running checks + auto-fixing), and instruction files (CLAUDE.md / AGENTS.md) are behavioral guidelines. Each layer operates independently, but together they enable an AI agent to automatically run lint, typecheck, and build checks before every commit."
description: "A deep dive into how Claude Code's three mechanisms — Hooks, Skills, and instruction files (CLAUDE.md / AGENTS.md) — each serve a distinct role and combine into an automated pre-commit quality pipeline, with real configuration examples and design tradeoffs."
draft: false
series:
  name: "Claude Code Automation Guide"
  order: 9
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md)

CI runs on GitHub Actions, and you only find out lint failed or types are broken after you push. One round-trip takes five to ten minutes, and fixing a single typo triggers another full run. The problem isn't bad CI design — it's that checks happen too late.

What if Claude Code ran lint, typecheck, and build checks *before* committing, and fixed any issues it found along the way? You don't need to change your CI setup at all. You just need to understand three mechanisms in Claude Code and how to use them.

## Three Mechanisms, Three Responsibilities

| Mechanism | Nature | What it can do | What it can't do |
|-----------|--------|---------------|-----------------|
| **Hook** | Auto-triggered shell command | Intercept, block, log | Cannot modify code, cannot interact |
| **Skill** | Workflow instructions Claude can load | Run checks, read errors, auto-fix, interact with the user | Not auto-triggered — must be called explicitly |
| **Instruction file** | Behavioral guidelines for the AI agent | Tell the AI "when to do what" | Not enforced — the AI may ignore it |

Each layer operates independently. A Hook can block commits without any Skill. A Skill can run checks without a Hook. An instruction file influences AI behavior without relying on the other two. But they complement each other when combined.

## Hooks: Automated Safety Net

Hooks are defined in `~/.claude/settings.json` and execute shell commands automatically when specific Claude events occur.

### Event Types

```
User sends a message ──→ UserPromptSubmit
Claude is about to use a tool ──→ PreToolUse
Claude finishes using a tool ──→ PostToolUse
Claude finishes the task ──→ Stop
```

### How They Work

```jsonc
// ~/.claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash(git commit*)",
        "hooks": [{
          "type": "command",
          "command": "cd $CLAUDE_WORKING_DIRECTORY && pnpm run lint && pnpm run typecheck"
        }]
      }
    ]
  }
}
```

`matcher` is the filter. `Bash(git commit*)` only triggers when Claude runs a command starting with `git commit`. If the command exits with code 0, execution proceeds; any non-zero exit code blocks it.

### Hook Limitations

Hooks run shell commands, not Claude itself. They can only report "passed" or "failed" — they can't instruct Claude to read error output and fix code. That's why Hooks are a safety net: a last line of defense ensuring bad code can't be committed even if other mechanisms are skipped.

### Practical Examples

```jsonc
{
  "hooks": {
    // Run lint + typecheck before commit
    "PreToolUse": [
      {
        "matcher": "Bash(git commit*)",
        "hooks": [{
          "type": "command",
          "command": "cd $CLAUDE_WORKING_DIRECTORY && pnpm run lint && pnpm run typecheck"
        }]
      }
    ],
    // Send a Mac notification when Claude finishes
    "Stop": [
      {
        "matcher": "",
        "hooks": [{
          "type": "command",
          "command": "osascript -e 'display notification \"Done\" with title \"Claude Code\"'"
        }]
      }
    ]
  }
}
```

## Skills: Interactive Workflows

A Skill is a Markdown file that describes steps for Claude to execute. Place it under `.claude/skills/` and Claude loads it on demand.

### The Key Difference from Hooks

Hooks can only judge pass/fail. A Skill lets Claude:

1. Run `pnpm run lint` and capture the error output
2. Read and understand the errors, locate the affected files
3. Modify the code
4. Run lint again to confirm the fix
5. Only proceed once everything passes

This is something a Hook cannot do. When a Hook blocks a commit, you have to fix it yourself. A Skill lets Claude fix it for you.

### Skill Structure

```
.claude/skills/
├── format-commit/SKILL.md      ← commit message formatting
└── pre-commit-check/SKILL.md   ← pre-commit quality check (new)
```

A sample `pre-commit-check` Skill:

```markdown
---
name: pre-commit-check
description: Run lint and typecheck before committing, auto-fix errors where possible
---

# Pre-Commit Check

## Step 1: Detect the sub-project

Determine the current sub-project from `$CLAUDE_WORKING_DIRECTORY` and select the appropriate commands.

## Step 2: Run lint

1. Run lint (e.g. `pnpm run lint`)
2. If there are errors, try `pnpm run lint:fix` for auto-fixes
3. Run lint again to verify
4. If errors remain → read the output, fix manually

## Step 3: Run typecheck

1. Run `pnpm run typecheck`
2. If there are errors → read the output and fix them one by one
3. Re-run after fixing to confirm

## Step 4: Report results

- All passing → inform the user that it's safe to commit
- Errors that can't be auto-fixed → list them and ask the user
```

### Separation of Concerns

Skills should not be coupled to each other. `pre-commit-check` is responsible only for quality checks; `format-commit` is responsible only for commit message formatting. The instruction file (CLAUDE.md) is responsible for telling Claude "run `pre-commit-check` before committing, then run `format-commit` once it passes."

## Instruction Files: Behavioral Guidelines

Different AI tools read different instruction files. Placed at the repo root, they are loaded automatically at startup and tell the AI what rules to follow in this project.

### Who Reads What

| File | Read by | Auto-loaded? |
|------|---------|-------------|
| `CLAUDE.md` | Claude Code | Yes, at startup |
| `AGENTS.md` | Cursor, Codex, Gemini CLI | Yes, by each respective tool |
| Prompts in CI/CD workflows | GitHub Models and similar APIs | **No** — they never auto-read any file |

This is the most common source of confusion. Claude Code **does not read** AGENTS.md. Cursor **does not read** CLAUDE.md. If your team uses multiple AI tools, you need to maintain both files and keep them in sync.

AI invoked via API inside CI/CD (for example, GitHub Models generating a PR description automatically) does not read any instruction files from the repo. Its prompt is hardcoded in the workflow YAML. If you want CI's AI to follow your conventions, you have to manually inject the file contents into the prompt:

```yaml
RULES=$(cat CLAUDE.md)
# Inject into system prompt
"content": "Please follow these rules:\n$RULES"
```

### Real Example (CLAUDE.md)

```markdown
# Commit Process

When committing, always follow these steps in order:

1. Run the `pre-commit-check` skill for quality checks
2. Once checks pass, run the `format-commit` skill to generate a commit message
3. Only execute git commit after the user confirms

## Check Commands by Sub-project

| Sub-project | lint | typecheck | lint:fix |
|-------------|------|-----------|----------|
| daodao-f2e | `pnpm run lint` | `pnpm run typecheck` | `pnpm run lint:fix` |
| daodao-server | `pnpm run lint` | `pnpm run typecheck` | `pnpm run lint:fix` |
| daodao-ai-backend | `make check` | — | `make format` |
```

### The Role of Instruction Files

Whether it's CLAUDE.md or AGENTS.md, these files are fundamentally *suggestions*, not *mandates*. The AI follows them in most cases, but it's not guaranteed. That's precisely why you need Hooks as a safety net — even if the AI skips the instruction file, the Hook will still intercept the commit.

## How the Three Layers Combine

```
User says "commit"
      │
      ▼
CLAUDE.md instructs: run the pre-commit-check skill first
      │
      ▼
┌─────────────────────────────┐
│  pre-commit-check skill     │
│  1. pnpm run lint           │
│  2. Fail → lint:fix → retry │
│  3. pnpm run typecheck      │
│  4. Fail → Claude reads and fixes code │
│  5. All pass → continue     │
└─────────────────────────────┘
      │
      ▼
format-commit skill (generates commit message)
      │
      ▼
Claude runs git commit
      │
      ▼
┌─────────────────────────────┐
│  Hook intercepts (safety net) │
│  Runs lint + typecheck again  │
│  Pass → commit succeeds       │
│  Fail → blocked               │
└─────────────────────────────┘
```

Under normal conditions, the Skill has already resolved any issues, and the Hook is just a formality. But if Claude skips the Skill and commits directly, the Hook will catch it.

## Relationship with CI

This is not a replacement for CI. CI runs remotely and acts as a team-level gatekeeper, running full tests, build verification, and security scans. Local Hooks and Skills are a personal-level fast check — the goal is to catch obvious errors before pushing and reduce how often CI fails.

```
Local (fast, seconds)          Remote (comprehensive, minutes)
Hook + Skill                   GitHub Actions CI
Intercepts before commit       Full check on PR
lint + typecheck               lint + typecheck + test + build
Claude auto-fixes              Manual fix required on failure
```

Two complementary layers — neither replaces the other.

## Why Not Just Use Existing Tools?

Pre-commit checks were a solved problem before Claude Code. Mature options have existed for years:

| Tool | Approach | Can block | Can auto-fix |
|------|----------|-----------|-------------|
| **husky + lint-staged** | Git pre-commit hook runs lint | Yes | Yes via `--fix`, format issues only |
| **lefthook** | Similar to husky, simpler config | Yes | Same as above |
| **pre-commit (Python ecosystem)** | `.pre-commit-config.yaml` | Yes | Same as above |
| **IDE live checks** | VS Code / WebStorm red underlines | Suggests, doesn't block | Partial quick fixes |

These tools handle lint formatting issues just fine. `eslint --fix` or `biome lint --write` can auto-fix most formatting and import problems.

**But they can't fix typecheck or build errors.**

```
TS2345: Argument of type 'string' is not assignable to
  parameter of type 'number'.
```

When this happens, husky can only block the commit. Then you have to go read the error yourself, find the right file, understand the context, fix the code, and run it again. If the fix triggers a chain of additional type errors, you do another round.

The difference with a Claude Code Skill: **the AI can read and understand error messages, comprehend the code context, directly modify files, and verify the fix.** That's something a shell script fundamentally cannot do.

### So Why Do You Still Need a Hook?

If a Skill can already fix things, why not rely on the Skill alone?

Because a Skill requires Claude to **actively run it**. If Claude forgets to run the Skill and commits directly (AI isn't 100% rule-compliant), or if you manually run `git commit` in the terminal and bypass Claude entirely, there's no check at all.

A Hook is a passive safety net. No matter who triggers the commit, it intercepts. No one needs to remember — **the mechanism guarantees it**.

### So Why Do You Still Need an Instruction File?

Hooks can block but can't fix. Skills can fix but need to be called.

Who calls the Skill? The instruction file.

CLAUDE.md says "run the `pre-commit-check` skill before committing," and Claude will proactively do it when it reads that instruction. Without an instruction file, Claude doesn't know this Skill exists, and doesn't know when to use it.

### Why All Three Layers Are Necessary

Each layer addresses a different failure mode:

| Failure mode | Who prevents it |
|-------------|----------------|
| Claude doesn't know to run checks | Instruction file tells it |
| lint/type errors need fixing | Skill lets Claude fix them |
| Claude skips the Skill and commits directly | Hook blocks it |
| Someone commits manually in the terminal | CI blocks it (after push) |
| Local gap — something slips through to remote | CI blocks it |

Any missing layer creates a hole. But you don't have to install everything at once — add incrementally based on your actual pain points.

## What About husky?

When the topic of pre-commit checks comes up, many people's first instinct is husky + lint-staged. It's the standard approach in the JavaScript ecosystem, but it's not a silver bullet.

### Where husky works well

- Single Node.js project
- Team discipline — nobody uses `--no-verify`
- Lint runs fast (within a few seconds)

### Where husky falls short

**It can be bypassed.** `git commit --no-verify` skips all git hooks. When people are rushing to ship, they do exactly this. Once one person makes a habit of it, it's effectively uninstalled.

**Monorepo configuration is complex.** If your repo mixes Node.js (ESLint / Biome), Python (ruff), and Go, where does husky live? How does lint-staged know which linter to run? Configuration complexity and maintenance cost are high.

**It slows down commits.** Linting an entire project takes several seconds to dozens of seconds. Once developers get frustrated, they start using `--no-verify` — a vicious cycle.

**Installation isn't always reliable.** husky relies on `postinstall` scripts to set up git hooks. CI environments, Docker builds, and `--ignore-scripts` installs can all result in husky silently failing to install.

### Compared to Claude Code Hooks

| | husky (git hook) | Claude Code Hook |
|--|--|--|
| Trigger timing | `git commit` command | When Claude uses the Bash tool |
| Who it affects | Everyone (once husky is installed) | Only Claude Code |
| Team sharing | Follows the repo, shared by all | In personal settings.json, not shared |
| Can it be bypassed? | Yes, with `--no-verify` | No (unless you edit settings) |
| Multi-language support | Requires extra setup | Shell command — runs anything |

The two don't conflict. If you already have husky and it's working well, keep it. If you don't, you don't necessarily need to install it for AI workflows — CI is the final line of defense, and Claude Code Hook + Skill already covers the AI collaboration scenario.

## In Summary

The division of labor among these three mechanisms is clear: the instruction file is the navigator, the Skill is the engine, and the Hook is the seatbelt. The navigator tells you which route to take, the engine gets you there, and the seatbelt protects you if something goes wrong.

Traditional git hook tools solve "blocking bad commits." Claude Code's unique value isn't in blocking — it's in *fixing*. The AI reads the error, modifies the code, and verifies the result. That feedback loop is something a shell script simply cannot do.

Recommended incremental adoption:

1. **Add commit conventions to CLAUDE.md** — zero cost; Claude follows them as soon as it reads them
2. **Add a pre-commit-check Skill** — lets Claude auto-fix lint and type errors
3. **Add a Claude Code Hook** — prevents Claude from skipping the Skill and committing directly
4. **Leave CI unchanged** — the final line of defense; no matter what happens locally, the PR will run a full check

## References

- [Claude Code Official Docs](https://docs.anthropic.com/en/docs/claude-code)
- [Claude Code Hooks Documentation](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [CLAUDE.md Instruction File Documentation](https://docs.anthropic.com/en/docs/claude-code/memory)
- [husky Official Docs](https://typicode.github.io/husky/)
- [lint-staged Official Docs](https://github.com/lint-staged/lint-staged)
- [lefthook Official Docs](https://github.com/evilmartians/lefthook)
- [Biome Official Site](https://biomejs.dev/)
- [From OpenSpec to Auto-Deploy: An AI-Driven Development Workflow](/posts/tech/deep-dive/2026-03-27-ai-driven-dev-workflow-openspec-to-deploy) — Hooks and Skills in a complete development workflow
- [The /file-bug-issue Skill and Remote Agent Integration](/posts/tech/deep-dive/2026-03-27-file-bug-issue-skill-remote-agent) — Another Skill design case study
- [Daodao Tech Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
