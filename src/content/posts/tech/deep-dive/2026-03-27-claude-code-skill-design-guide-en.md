---
title: "Claude Code Skills: A Complete Guide to Turning Repetitive Workflows into Single Commands"
date: 2026-03-27
type: guide
category: tech
tags: [claude-code, skill, ai-agent, dx, automation, workflow, agent-skills]
lang: en
tldr: "A Skill is an SOP written for AI. Define the steps in a Markdown file and Claude follows them. No coding required, no frameworks to learn — just write down what an experienced person would do."
description: "A ground-up introduction to Claude Code Skills: the design philosophy, file structure, implementation patterns, and the trade-offs behind four real-world examples — format-commit, post, job-filter, and file-bug-issue."
draft: false
series:
  name: "Claude Code Automation Guide"
  order: 6
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide)

Every commit means thinking about the message format. Every new post means creating a file and filling in frontmatter. Every job search means running the same filtering process. None of these tasks are hard — they're just tedious to repeat, and every repetition is a chance to miss a step.

Claude Code Skills solve exactly this: **define a repetitive workflow in a Markdown file, then trigger it with a single `/skill-name` command. Claude follows the steps and handles the execution.**

Not a plugin. Not an API call. No code to write. It's simply an SOP written for AI to read.

## What Is a Skill?

A Skill is a Markdown file stored in the `~/.claude/skills/` directory. It describes:

1. When this skill should be used
2. What information to gather
3. The steps to execute, in order
4. What the output should look like

When Claude Code starts up, it scans this directory and registers all Skills as available commands. When you type `/skill-name` in a conversation, Claude loads the corresponding Markdown file and works through the steps defined inside.

### Skills vs. Hooks vs. Instruction Files

These three mechanisms are easy to confuse, but they serve very different purposes:

| Mechanism | Trigger | What it can do | Typical use |
|-----------|---------|----------------|-------------|
| **Hook** | Automatic (event-driven) | Run shell commands, pass/fail | Block commits when lint fails |
| **Skill** | Manual (`/name`) | Multi-step interactive workflows | Generate commit messages, write posts |
| **Instruction file** | Automatic (loaded on startup) | Behavioral guidance, no enforcement | Tell AI "run checks before committing" |

Hooks are passive safety nets. Skills are active workflows. Instruction files are behavioral nudges. For a detailed comparison, see [Three Layers of Quality Defense](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md).

## File Structure

```
~/.claude/skills/
├── format-commit/
│   └── SKILL.md
├── post/
│   └── SKILL.md
└── job-filter/
    └── SKILL.md
```

Each Skill is a folder containing a `SKILL.md` file. Beyond the main file, you can include templates, examples, scripts, and other supporting resources:

```
my-skill/
├── SKILL.md           # Main instructions (required)
├── template.md        # A template for Claude to fill in
├── examples/
│   └── sample.md      # Example output
└── scripts/
    └── validate.sh    # A script Claude can execute
```

The `SKILL.md` frontmatter needs at minimum a `description`:

```markdown
---
name: format-commit
description: Generate a commit message that matches the project format
---

# Format Commit Message

## Step 1: Analyze the changes
...
```

`name` is the command name (invoked as `/format-commit`); omit it and the folder name is used. `description` helps Claude decide when to suggest this Skill.

### Full Frontmatter Reference

Beyond `name` and `description`, a few more fields are worth knowing:

| Field | Description |
|-------|-------------|
| `disable-model-invocation` | Set to `true` to prevent Claude from auto-triggering; only manual `/name` invocations work |
| `user-invocable` | Set to `false` to hide from the `/` menu; only Claude can invoke it |
| `context` | Set to `fork` to run in an isolated subagent that doesn't affect the main conversation |
| `agent` | Used with `context: fork` to specify which agent type to use (`Explore`, `Plan`, ...) |
| `allowed-tools` | Restrict which tools are available during skill execution (e.g., `Read, Grep, Glob`) |
| `argument-hint` | Parameter hint shown during autocomplete (e.g., `[issue-number]`) |

**Who can trigger a Skill** is the most common design decision:

- Side-effecting Skills like `/deploy` → `disable-model-invocation: true` to prevent Claude from acting unilaterally
- Background-knowledge Skills like `legacy-system-context` → `user-invocable: false` so Claude loads them automatically when needed
- Most Skills work fine with the defaults

### Global vs. Project

| Location | Path | Scope |
|----------|------|-------|
| Enterprise | Deployed via managed settings | Everyone in the org |
| Global | `~/.claude/skills/` | All your projects |
| Project | `<project>/.claude/skills/` | This project only |
| Plugin | `<plugin>/skills/` | Wherever the plugin is enabled |

When Skills share the same name, precedence is: Enterprise > Global > Project. General-purpose Skills like commit formatting or writing posts belong in Global. Project-specific checklists belong in the project.

Monorepos are also supported: Claude automatically discovers `.claude/skills/` in subdirectories, so Skills in `packages/frontend/.claude/skills/` are picked up when you're editing frontend files.

## Designing a Skill: The Mental Model

The question isn't "what code should I write?" It's "if I were teaching a new team member how to do this, what would I say?"

### 1. Define the trigger

When should this Skill run? Write that in the description so Claude can suggest it based on conversation context.

```markdown
---
description: Use when committing changes - asks user for commit type and Why,
  auto-generates How from git diff
---
```

You can also mandate it in `CLAUDE.md`:

```markdown
# Commit process

Must use the format-commit skill when committing
```

### 2. Break it into steps

Decompose the workflow into clear steps. Each step should specify: what to do, which tools to use, and what the result should be.

Good step:

```markdown
## Step 1: Analyze the changes

1. Run `git diff --staged` to see what changed
2. Run `git status` to confirm which files are modified
3. Write a brief summary of the scope of changes
```

Bad step:

```markdown
## Step 1

Take a look at what changed and continue.
```

### 3. Make interaction points explicit

Specify clearly which steps require asking the user and which steps the AI should handle autonomously.

```markdown
## Step 2: Gather Why

**Why — ask the user:**
- question: "Please list the reasons that motivated this change"

**How — infer from git diff, do not ask the user:**
Run `git diff --staged`, analyze the changes, and summarize 3–5 concrete implementation details.
```

This distinction matters. Why is intent — only humans know it. How is fact — it's already in the diff, and AI can summarize it more accurately than humans can recall it.

### 4. Define the output format

Show Claude what the final output should look like. An example is best.

```markdown
## Output Format

<type>(<scope>): <short description>

## Why is this necessary?

- <reason 1>
- <reason 2>

## How does it address?

- <solution 1>
- <solution 2>
```

### 5. Add a confirmation step

Don't let AI execute irreversible actions directly. Preview first, confirm, then execute.

```markdown
## Step 5: Confirm and execute

1. Show the user the generated commit message
2. Ask if any changes are needed
3. Only run `git commit` after the user confirms
```

## Four Real-World Examples

### format-commit: Standardize commit messages

**Problem**: Thinking up a message format every time leads to lazy commits like "fix bug" — three months later, the git log tells you nothing.

**Design**:

```
git diff --staged → analyze changes
    ↓
Ask user for type (feat/fix/refactor...)
Ask user for scope (which module)
Ask user for Why (reason for the change)
    ↓
AI infers How from the diff
    ↓
Combine into type(scope): description + Why/How sections
    ↓
Preview → Confirm → git commit
```

**Trade-off**: Why must be asked of the human — the code diff can't reveal intent. How is not asked — what changed is already in the diff, and AI can summarize it more accurately than human memory can reconstruct it.

### post: Turn a conversation into a blog post

**Problem**: You solved an interesting technical problem and want to write it up. But creating the file, filling in frontmatter, and figuring out the structure from scratch feels like too much effort, and the motivation fades.

**Design**:

```
Determine category (tech/climbing/ai...)
    ↓
Select template (debug post / intro post / general)
    ↓
Extract content from the conversation
    ↓
Generate Markdown file (with frontmatter)
    ↓
Preview → Confirm → git add + commit
```

**Trade-off**: Keep templates minimal — just three (tech-post, tech-deep-dive, general-post). More templates means AI picks the wrong one. Writing style guidelines live inside the Skill itself, so they're enforced consistently without re-explaining them each time.

### job-filter: Two-layer job listing filter

**Problem**: JSON exports from job boards have hundreds of listings — reviewing them one by one is too slow.

**Design**:

```
104 JSON + LinkedIn JSON
    ↓
Layer 1: keyword pre-filter (Python regex, milliseconds)
    ↓
Layer 2: claude -p per-listing scoring (1–10)
    ↓
Output ranked report (Recommended / Decent / Skip)
```

**Trade-off**: Don't feed hundreds of listings to the LLM directly. Use keyword filtering first to remove obvious mismatches (PHP-only, C#-only), then apply LLM ranking to the remainder. Saves tokens, saves time.

### file-bug-issue: Turn a debug session into a GitHub issue

**Problem**: After twenty minutes debugging in Claude Code, you've found the root cause — but it's not the right time to fix it. Going to GitHub to file an issue means retyping all the error messages and analysis from scratch.

**Design**:

```
Gather from conversation context: error, repro steps, root cause, suggested fix
    ↓
Ask for repo → verify with gh repo view
    ↓
Draft issue → Preview → Confirm
    ↓
gh issue create --label bug
```

**Trade-off**: Label with `bug`, not `auto`. Not every bug should be auto-fixed by AI — let humans decide when to add the `auto` label and hand it off to a Remote Agent. See [Designing /file-bug-issue](/posts/tech/deep-dive/2026-03-27-file-bug-issue-skill-remote-agent) for the full design breakdown.

## Principles for Writing Skills

**Write for AI, not for humans.** Humans can follow a flowchart. AI needs explicit steps, concrete commands, and clear decision conditions.

**One Skill, one job.** `format-commit` handles commit messages. `pre-commit-check` handles quality checks. To combine them, chain them in `CLAUDE.md`: "run check before committing; run format only after it passes."

**Always confirm before irreversible actions.** Git commits, GitHub issue creation, API calls — all of these need a preview step before execution. AI occasionally misjudges; a human confirmation costs almost nothing.

**Use specific commands, not vague descriptions.** "Check code quality" is too vague. "Run `pnpm run lint`; if there are errors, run `pnpm run lint:fix` and check again" is something AI can actually execute.

**Testing is simple.** Run `/skill-name` once and watch whether Claude follows the steps. If not, edit the Markdown — no redeployment needed.

## Advanced Features

The basics above cover most use cases. But Claude Code provides a few advanced capabilities that enable more complex workflows.

### Dynamic Context Injection

The `` !`<command>` `` syntax runs a shell command before the Skill loads and injects the output into the prompt. Claude sees the command's output, not the command itself.

```markdown
---
name: pr-summary
description: Summarize a PR's changes
context: fork
agent: Explore
---

## PR Information
- Diff: !`gh pr diff`
- Comments: !`gh pr view --comments`
- Changed files: !`gh pr diff --name-only`

## Task
Summarize this PR based on the information above...
```

This is pre-processing — it happens before Claude runs, and Claude only sees the final result.

### Running in a Subagent

Adding `context: fork` runs the Skill in an isolated subagent context, keeping it from polluting the main conversation. Ideal for heavy search, analysis, or tasks that don't need the conversation history.

```markdown
---
name: deep-research
description: Research a topic thoroughly
context: fork
agent: Explore
---

Research $ARGUMENTS thoroughly:
1. Use Glob and Grep to find relevant files
2. Read and analyze the code
3. Produce a summary with specific file references
```

### Argument Passing

Skills can accept arguments. `$ARGUMENTS` captures all of them; `$0`, `$1` capture individual ones.

```markdown
---
name: fix-issue
description: Fix a GitHub issue
---

Fix GitHub issue $ARGUMENTS:
1. Read the issue description
2. Understand the requirements
3. Implement the fix
4. Write tests
5. Create a commit
```

`/fix-issue 123` → Claude receives "Fix GitHub issue 123."

### Built-in Bundled Skills

Claude Code ships with several built-in Skills that require no installation:

| Skill | Purpose |
|-------|---------|
| `/batch <instruction>` | Large-scale parallel changes — explores the codebase, decomposes tasks, executes each unit in an isolated worktree, and opens a PR |
| `/claude-api` | Loads Claude API reference docs; auto-triggered when writing Anthropic SDK code |
| `/debug [description]` | Enables debug logging and analyzes session logs for troubleshooting |
| `/loop [interval] <prompt>` | Runs a prompt repeatedly — useful for polling deployment status or periodic checks |
| `/simplify [focus]` | Dispatches three parallel review agents to inspect recent code changes and auto-fixes quality issues |

## Agent Skills: An Open Standard Across Tools

Claude Code's Skill format isn't proprietary. It follows the [Agent Skills](https://agentskills.io) open standard — developed by Anthropic and now adopted by 30+ AI tools.

That means the `SKILL.md` files you write **work beyond Claude Code**. All of the following tools support the same format:

**IDEs and editors**: Cursor, VS Code (Copilot), JetBrains Junie, Roo Code, Firebender, Kiro

**CLI tools**: Gemini CLI, OpenAI Codex, OpenCode, Goose, Mistral Vibe, Laravel Boost

**Platforms and frameworks**: GitHub Copilot, Databricks, Snowflake, Spring AI, Letta, OpenHands

**One Skill file, readable by different AI tools.** This is especially valuable for teams — not everyone uses Claude Code, but Skills committed to `.claude/skills/` in a repo are available to teammates using Cursor or any other compatible tool.

### Plugin Marketplace: Install Skills Others Have Built

Don't want to write your own? Claude Code has a Plugin system and Marketplace where you can install ready-made Skills.

The **official Marketplace** (`claude-plugins-official`) loads automatically on startup. Browse it in the Discover tab under `/plugin`, or visit [claude.com/plugins](https://claude.com/plugins) for the full catalog. Install with one command:

```bash
/plugin install github@claude-plugins-official
```

The official Marketplace includes plugins for:

| Category | Examples |
|----------|---------|
| **Code Intelligence** | LSP support for TypeScript, Python, Rust, Go, and more |
| **External integrations** | GitHub, GitLab, Slack, Notion, Jira, Linear, Figma, Sentry |
| **Development workflow** | commit-commands, pr-review-toolkit, agent-sdk-dev |
| **Document processing** | DOCX, PDF, PPTX, XLSX operations |

The **Anthropic Demo Marketplace** (`anthropics/claude-code`) requires manual setup and includes more example plugins:

```bash
/plugin marketplace add anthropics/claude-code
```

It offers feature-dev (a seven-stage feature development workflow), code-review (five parallel agents reviewing a PR), hookify (auto-generates hooks from conversation analysis), security-guidance (security pattern detection), and more.

Beyond the official sources, any Git repo can serve as a marketplace:

```bash
# GitHub repo
/plugin marketplace add your-org/claude-plugins

# Any Git URL (GitLab, Bitbucket, self-hosted)
/plugin marketplace add https://gitlab.com/company/plugins.git
```

Teams can configure `extraKnownMarketplaces` in `.claude/settings.json` so new members get the team's plugins automatically when they clone the repo.

### Community Ecosystem

Beyond the plugin marketplace, there's already a substantial community of Skills on GitHub:

| Project | Contents |
|---------|---------|
| [anthropics/skills](https://github.com/anthropics/skills) | Official example Skills (document processing, dev tools, etc.) |
| [awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | 75+ curated Skills across docs, dev, marketing, and automation |
| [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | Comprehensive list of Skills, hooks, plugins, and agents |
| [awesome-claude-plugins](https://github.com/ComposioHQ/awesome-claude-plugins) | Curated plugin list |
| [claude-code-plugins-plus-skills](https://github.com/jeremylongshore/claude-code-plugins-plus-skills) | 340 plugins + 1,367 Skills |
| [antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills) | 1,326+ Skills for Claude Code, Cursor, Codex, Gemini CLI |

GitHub repos tagged `agent-skills` now number over 2,100. Because Agent Skills is an open standard, most of these aren't Claude Code-exclusive — Cursor, Codex CLI, Gemini CLI, and others can use them directly.

**Installing community Skills is straightforward**: copy the skill folder into `~/.claude/skills/`. For full plugins, load them with `--plugin-dir` or install via the marketplace.

### Skill Sharing Levels

| Method | Best for |
|--------|---------|
| **Project Skill** | Committed to `.claude/skills/`, travels with the repo |
| **Plugin** | Packaged as a plugin, distributed via marketplace |
| **Enterprise deployment** | Pushed to everyone in the org via managed settings |

To submit a plugin to the official Marketplace, visit [claude.ai/settings/plugins/submit](https://claude.ai/settings/plugins/submit) or [platform.claude.com/plugins/submit](https://platform.claude.com/plugins/submit).

Official example Skills are available at [github.com/anthropics/skills](https://github.com/anthropics/skills).

## In Summary

The barrier to writing a Skill is low — no frameworks, no code, no APIs to learn. If you can write down the steps to accomplish something, you can turn it into a repeatable automated workflow.

And this isn't Claude Code-specific. Because Agent Skills is an open standard, the design work you invest transfers across tools. A Skill written for Claude Code today will work in Cursor, Gemini CLI, and Codex CLI tomorrow.

The genuinely hard part isn't the technical implementation — it's thinking clearly about how the workflow should work. Which steps require human judgment? Which can be automated? What should the output look like? What happens when something fails? These are workflow design questions, not programming questions.

If you have any repetitive process in your daily development — commit formats, PR templates, code review checklists, pre-deploy checks — it's worth turning into a Skill. Start with the simplest case, run it a few times, and refine it based on what actually breaks.

---

## References

- [Claude Code Skills official documentation](https://code.claude.com/docs/en/skills)
- [Agent Skills open standard](https://agentskills.io)
- [Official example Skills](https://github.com/anthropics/skills)
- [Claude Code Hooks official documentation](https://code.claude.com/docs/en/hooks)
- [Claude Code Subagents official documentation](https://code.claude.com/docs/en/sub-agents)
- [Claude Code Plugins official documentation](https://code.claude.com/docs/en/plugins)
- [Plugin Marketplace browsing and installation](https://code.claude.com/docs/en/discover-plugins)
- [Plugin Marketplace catalog](https://claude.com/plugins)
- [Equipping Agents with Agent Skills (Anthropic engineering blog)](https://anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Three Layers of Quality Defense in Claude Code: Hooks, Skills, and Instruction Files](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md)
- [Using a Claude Code Skill to Turn a Debug Session into a GitHub Issue](/posts/tech/deep-dive/2026-03-27-file-bug-issue-skill-remote-agent)
