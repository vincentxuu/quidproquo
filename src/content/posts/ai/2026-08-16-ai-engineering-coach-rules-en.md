---
title: "The 45 Rules of microsoft/AI-Engineering-Coach: An Opinion About Agentic Engineering, Written as Executable Thresholds"
date: 2026-08-16
category: ai
type: deep-dive
tags: [agentic-coding, context-engineering, claude-code, codex, open-source, harness-engineering]
lang: en
tldr: "A VS Code extension open-sourced by Microsoft employees that reads your local Claude Code / Codex / OpenCode session logs. The real payload is 45 Markdown rules: prompts under 30 characters, sending the next message within 15 seconds of receiving 20 lines of AI code, instruction files over 4,000 bytes — turning 'context engineering' into numbers you can argue with."
description: "A breakdown of the 45 anti-pattern rules in microsoft/AI-Engineering-Coach: what it claims good agentic engineering looks like, the rules-as-Markdown architecture and its trust gate, and which thresholds are really value judgments dressed as measurements."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-16-ai-engineering-coach-rules)

[AI Engineer Coach](https://github.com/microsoft/AI-Engineering-Coach) is a VS Code extension that reads your local AI coding session logs and tells you where you're using AI badly. It has 3,548 stars, an MIT license, and roughly 59,000 lines of TypeScript. The README closes by stating plainly that this is an open-source community effort by Microsoft employees and is **not** an official Microsoft product.

But the dashboard isn't the part worth reading. The `src/core/rules/` directory is. Forty-five Markdown files, each defining one bad habit in AI-assisted coding, each with concrete trigger thresholds. It's the most specific document I've seen on what "using AI well to write code" actually means — specific enough to argue with.

## What it is, briefly

It ships as a VS Code extension, and the same webview bundle also runs as a canvas inside the GitHub Copilot app. The core function: parse local AI coding logs, turn them into scores and charts. Read-only, never modifies your logs, zero telemetry, nothing leaves your machine.

Cross-harness coverage is its most practical value. One dashboard consumes five sources:

| Harness | Log location |
|---|---|
| [Claude Code](https://code.claude.com/docs/en/overview) | `~/.claude/projects/<encoded-path>/<uuid>.jsonl` |
| [Codex CLI](https://github.com/openai/codex) | `~/.codex/sessions` (plus `archived_sessions`) |
| [OpenCode](https://github.com/sst/opencode) | probed via `findOpenCodeDirs()` |
| VS Code Copilot | `.../User/workspaceStorage` |
| Copilot App / CLI | parsed in-process in canvas mode |

Usage data from each harness is currently locked inside its own format, and nothing else does the cross-comparison. That alone is worth something.

Installation is a chore: it isn't published to a marketplace or a Releases page, so you clone the repo and build the `.vsix` yourself with `npm ci && npm run package`.

## What the 45 rules claim

This is the repo's real payload. Four groups, 45 rules total (prompt-quality 16, tool-mastery 12, session-hygiene 9, code-review 8). The representative ones, with the numbers it actually sets.

### Prompt quality

- **`lazy-prompting`**: prompts shorter than 30 characters, when they account for more than 30% of requests.
- **`low-constraint-usage`**: fewer than 8% of prompts contain a constraint word. Its constraint list is a single regex: `do not|don't|must not|never|without|avoid|only|strictly|limit to|at most|at least|no more than|require|restrict|exclude|ensure|must|shall`. The argument is that constraints narrow AI output and reduce hallucinations.
- **[`no-spec-driven-development`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/rules/no-spec-driven-development.md)**: fewer than 20% of sessions open with a spec, plan, or structured requirements. The rule description says outright: "Spec-first development consistently beats vibe-coding."
- **[`instruction-bloat`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/rules/instruction-bloat.md)**: a `copilot-instructions.md`-style file larger than 4,000 bytes. The reasoning is solid — such files "are prepended to **every** request's system prompt," and the fix is to "keep the always-on payload under ~4 KB."

### Code review

- **[`speed-accept`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/rules/speed-accept.md)**: sending the next message within 15 seconds of receiving 20+ lines of AI code, five or more times. Its advice contains one line worth stealing: "A quick glance is not a review."
- **[`vibe-coding`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/rules/vibe-coding.md)**: a single session producing 100+ lines of AI code from no more than 5 user messages, where the opening message contains no bullet list, numbering, heading, or spec keyword. Its phrasing: "velocity without understanding creates knowledge debt."

### Session hygiene

`mega-sessions` catches sessions past 50 messages; `session-drift` catches one session mixing 4+ task types; `runaway-agent-loops` catches a single agentic request burning 15+ tools — the signal that the agent is spinning on a failing approach.

### Tool mastery

This is the most practical group, and it's almost entirely about money.

- **[`reasoning-effort-overuse`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/rules/reasoning-effort-overuse.md)**: more than half of requests running at high or max reasoning effort. It claims "every `-high` or `-xhigh` request typically costs 2–4× more output tokens than `-medium` or default for the same answer" — that's the project's own estimate, not a vendor figure, but the direction is right: effort controls thinking depth and overall token spend.
- **[`cache-hit-starvation`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/rules/cache-hit-starvation.md)**: prompts over 5,000 tokens with a cache hit rate below 10%. It attributes this to "churning instructions, frequent compaction, or unstable system prompts." That diagnosis is exactly right — [prompt caching is a prefix match](https://platform.claude.com/docs/en/build-with-claude/prompt-caching), and any byte change anywhere in the prefix invalidates everything after it, so churning instructions really does kill the cache outright.
- **[`mcp-tool-bloat`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/rules/mcp-tool-bloat.md)**: more than 40 distinct tools in one session. Every registered tool adds tokens to every request, used or not.
- **`excessive-file-context`**: attaching 30+ files to a single prompt.

These four groups aren't the same kind of thing. The first two are behavioral claims; the fourth is cost engineering — and the fourth group's thresholds hold up better, because they map to verifiable mechanisms.

## Rules as Markdown

The smartest architectural decision here: the 45 rules aren't hardcoded TypeScript, they're 45 `.md` files. YAML frontmatter carries the thresholds, plus a small DSL block:

```yaml
---
id: vibe-coding
group: code-review
severity: high
scope: sessions
thresholds:
  minAiLoc: 100
  maxUserPrompts: 5
  minSessions: 3
---
```

````
```detect
scan: sessions
match: flatSumField(requests, "aiCode", "loc") >= thresholds.minAiLoc AND \
  requestCount <= thresholds.maxUserPrompts
aggregate: count
check: count >= thresholds.minSessions
```
````

The pipeline is `scan → match → aggregate → reduce → check → severity → examples`. Three design highlights:

1. **`severity` can be an expression**, not just a static high/medium/low. `broken-flow-state` declares `severity: flow.lowScoreRate > 0.8` — severity decided by the data.
2. **Three stacked rule layers**: built-in, personal (`~/.ai-engineer-coach/`), and project (`<workspace>/.ai-engineer-coach/`). A team can commit its own standards into the repo and version them alongside the code.
3. The UI ships a Rule Editor and a REPL-style Rule Playground for testing rules live against your own data.

Extending the rule set requires no code changes, which turns "our team thinks X is a bad habit" into something you can send as a pull request. The authoring format is documented in [`docs/AUTHORING_RULES.md`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/docs/AUTHORING_RULES.md).

## The trust gate: they thought about the threat model

Because rules can load from a project directory, a malicious repo could hand you rules to execute. The header comment in [`rule-trust.ts`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/rule-trust.ts) says so directly:

> Personal and project files are NOT trusted by default: a malicious repository could drop a `.ai-engineer-coach/rules/` directory whose DSL executes the moment the dashboard is opened.

The answer is trust-on-first-use: every local rule file's contents are SHA-256 hashed, recorded only after the user explicitly approves, and re-verified on every subsequent load — any edit invalidates the prior approval. Files that fail the check are skipped and queued in a pending list for the UI to surface.

Paired with `safe-regex.ts` to block ReDoS: patterns capped at 1,000 characters, test input capped at 100,000, and rejected patterns cached in a deny list to avoid re-warning on every row. For a tool whose job is "show charts," that's a level of security thinking well above average, and worth copying.

## Which thresholds are measurement, and which are value judgments

This is my biggest reservation.

**There are two scoring systems on the same screen.** The five practice score cards run `100 − a penalty per triggered rule` (high costs 12, medium 7, low 3), driven by the 45 rules. But the weekly trend line beside them runs a completely separate hardcoded penalty function in [`detectors/scoring.ts`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/detectors/scoring.ts), which looks at only seven crude signals: message under 30 characters, no file references, cancelled, before 5 AM, weekend, code accepted within 5 seconds, no tools used. The card number and the trend line next to it are not the same thing, and the UI never says so.

**"Weekend" and "late night" are counted as engineering quality.** In that trend function, a request before 5 AM adds a 0.3 penalty and a weekend request adds 0.2, both feeding the session-hygiene score. That's a value judgment, not a measurement — different time zones, shift work, and after-hours side projects all get penalized indiscriminately. What it measures is *when you work*, and then calls it hygiene.

**One of the five groups doesn't use the rule engine at all.** The README says 45 rules cover five practice areas including context management, but the `context-management` group has zero Markdown rules — `analyzer-context.ts` hardcodes four checks in TypeScript instead (Context Bloat, Compaction Storm, Context Amnesia Risk, Runaway Context Growth). The most fashionable group is the least extensible one.

**Claude and Codex users are second-class.** A number of rules are marked `requiresIdeContext: true` and are skipped for non-VS Code harnesses; Skill Finder, Learning Center, and the Context Health AI review all depend on the VS Code built-in language model API and are hidden entirely in canvas mode.

The dividing line is actually clean: **thresholds mapping to verifiable mechanisms hold up** (prompt cache prefix invalidation, instruction files entering every system prompt, tool count consuming tokens); **thresholds mapping to human behavioral preferences are opinions** (weekends, late nights, 15 seconds, 5 messages). Mixing both into one score means you can no longer argue with them separately.

As an aside, I ran all 205 DSL expressions across the 45 rules through the project's own `validateExpression`. Exactly one fails to compile: line 36 of `no-plan-mode.md` has a string mangled by a bad edit. Testing it confirms the rule never fires — of the advertised 45 rules, 44 actually work. A small defect, but it matches another signal: recent commits are almost entirely dependabot version bumps, and the README itself admits the Burndown page is "temporarily disabled" and the Output page's token breakdown "temporarily hidden."

## Overall

**Worth reading, not necessarily worth installing.** Thirty minutes spent reading `src/core/rules/` pays off more than actually running the extension and looking at charts. Those 45 rules are a rare artifact: they translate the vague phrase "context engineering" into a set of thresholds with numbers — arguable, refutable numbers. You can disagree with 4,000 bytes or 15 seconds, but it at least states its position in a form that can be tested, which is more than most writing on agentic engineering manages.

The software itself is cleanly built, and the "rules as Markdown + layered overrides + trust gate" combination is worth borrowing. But the scoring model is cruder than its presentation suggests, the installation barrier is high, and the project appears to have entered maintenance mode.

If you take one thing from it: take the rule list and go through it asking "do I agree with this threshold?" Fold the ones you agree with into your team's standards, and work out *why* for the ones you don't — that "why" is usually more useful than the rule itself.

## References

- [microsoft/AI-Engineering-Coach](https://github.com/microsoft/AI-Engineering-Coach) — the project repo (MIT)
- [`src/core/rules/`](https://github.com/microsoft/AI-Engineering-Coach/tree/main/src/core/rules) — source for all 45 rules
- [`docs/AUTHORING_RULES.md`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/docs/AUTHORING_RULES.md) — rule and metric authoring format
- [`src/core/rule-trust.ts`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/rule-trust.ts) — the trust-on-first-use gate
- [`src/core/detectors/scoring.ts`](https://github.com/microsoft/AI-Engineering-Coach/blob/main/src/core/detectors/scoring.ts) — the weekly-trend penalty function
- [Anthropic — Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) — prefix matching and cache invalidation
- [Claude Code documentation](https://code.claude.com/docs/en/overview)
- [openai/codex](https://github.com/openai/codex), [sst/opencode](https://github.com/sst/opencode)
- Related on this site: [The Model Is a Component, the Harness Is the System](/posts/ai/2026-08-10-model-component-harness-system-en)
- Related on this site: [Context and Memory: Where Agents Actually Fail](/posts/ai/2026-08-10-agent-context-memory-failure-en)
- Related on this site: [Security: Prompt Injection Can Only Be Contained in the Harness](/posts/ai/2026-08-10-agent-security-harness-layer-en)
