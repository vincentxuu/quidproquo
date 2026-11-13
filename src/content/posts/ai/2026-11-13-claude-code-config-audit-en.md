---
title: "Auditing My Claude Code Setup: What Belongs in CLAUDE.md, Hooks, and Auto Memory"
date: 2026-11-13
category: ai
type: guide
tags: [claude-code, claude-md, hooks, agent-memory, context-engineering]
lang: en
tldr: "Seven days, 85 sessions: 104 compactions, 20 SIGKILLs, 24 type-check OOMs, 72 user corrections. The fix: move no-exception rules from CLAUDE.md into PreToolUse hooks, and drop 16 MEMORY.md entries that git already knew or that had gone stale."
description: "A full personal audit of a Claude Code setup: writing preferences into CLAUDE.md per the official docs, enforcing local-test consent with a hook, counting repeated mistakes from session transcripts, and cleaning MEMORY.md by the auto memory rules."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-11-13-claude-code-config-audit)

## TL;DR

I wrote my personal preferences into the global [`~/.claude/CLAUDE.md`](https://code.claude.com/docs/en/memory) of [Claude Code](https://code.claude.com/docs/en/overview), scanned the transcripts of 85 sessions from the past seven days for repeated mistakes and wasted resources, then cleaned up auto memory against the official docs. Three takeaways:

1. A rule with no exceptions, like "never run tests locally without my consent", isn't enough in CLAUDE.md. It belongs in a [PreToolUse hook](https://code.claude.com/docs/en/hooks).
2. The biggest waste wasn't the rules. It was long sessions: the top eight sessions each burned 0.87 to 1.8 billion tokens, and most were compacted four to six times.
3. MEMORY.md held a batch of "PR progress" entries that git already records and that had long gone stale. Two of them even described mechanisms that never shipped as if they were current rules.

## Context

The machine has 18 GB of RAM. I keep several Claude Code sessions open at once, each running pytest, vue-tsc, headless browsers, and dev servers. I wanted three things:

- Global instructions for how to communicate and solve problems: Traditional Chinese, conclusion first, keep symptoms and root causes apart.
- Resource limits: check load before starting, at most three headless browsers at a time, close them when done.
- No local tests without my consent.

The catch: the first half of the global `CLAUDE.md` is a team template synced by a CLI, the personal section comes after it, and the memory folder had already piled up 147 auto memory entries.

## Problem 1: where does a rule have to live to work?

The official docs are blunt that CLAUDE.md is context, not enforcement:

> "Claude treats them as context, not enforced configuration. To block an action regardless of what Claude decides, use a PreToolUse hook instead."
> — [Claude Code docs: How Claude remembers your project](https://code.claude.com/docs/en/memory)

The best practices page uses type-checking as its example: a "typecheck before you finish" line in CLAUDE.md

> "works most of the time, not every time."
> — [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices)

So I split the rules into two kinds:

| Kind | Examples | Where it goes |
|---|---|---|
| Judgment calls | Conclusion first, separate facts from guesses, don't widen scope | CLAUDE.md |
| No exceptions | No tests without consent, check resources before starting | A hook; CLAUDE.md keeps one line pointing to it |

The personal section sits after the team template's `<!-- END ... -->` marker, because the sync tool only rewrites what's between the markers. The section opens by saying it wins over shared guidance and skill or harness workflows when they conflict. The docs warn that with two conflicting instructions, Claude "may pick one arbitrarily". Without an explicit order, a team workflow step like "run pytest before push" would collide with the personal rule.

## Problem 2: where did seven days of sessions go?

Transcripts live in `~/.claude/projects/<project>/*.jsonl`, about 978 MB over seven days. Load was around 15 with 34% memory free at the time, so instead of sending subagents to read them, I streamed them line by line with a Python script that only keeps counters. The fields that mattered:

- `tool_result.is_error`: tool errors, grouped by tool name and a normalized first error line.
- `system` with `subtype == "compact_boundary"`: compactions.
- `[Request interrupted`: user interruptions.
- `usage` on assistant messages: input, cache read, and cache creation tokens added up.
- Words like "why", "again", and "wrong" in user messages, to catch corrections and pushback.

```python
for line in open(path, errors="ignore"):
    if len(line) > 2_000_000:   # skip giant lines so memory stays flat
        continue
    o = json.loads(line)
    if o.get("type") == "system" and o.get("subtype") == "compact_boundary":
        compactions[sid] += 1
    usage = (o.get("message") or {}).get("usage")
    if o.get("type") == "assistant" and usage:
        tokens[sid] += sum(usage.get(k, 0) for k in
                           ("input_tokens", "cache_read_input_tokens",
                            "cache_creation_input_tokens"))
```

Results:

| Metric | Count |
|---|---|
| Sessions | 85 |
| Compactions | 104; the top eight sessions had 4–6 each |
| Tokens (incl. cache read) | About 15.4 billion; one session reached about 1.8 billion |
| User interruptions / rejected tool calls | 54 / 21 |
| Processes SIGKILLed | 20 |
| vue-tsc heap OOM / SIGABRT | 24, each one blocking a commit |
| Memory watchdog pausing processes | 77 |
| Calls to a search tool after its credits ran out | 28 |

One class of errors had nothing to do with model ability: the shell is zsh, but the model writes bash habits.

- `[ "$a" == "$b" ]`: zsh treats `==` as a filename expansion and fails with `== not found`. I hit this myself while writing the audit script.
- Storing a command in a variable and running it: zsh doesn't word-split, so you get `command not found: env -u ...`.
- `~/.zshenv` had `. "$HOME/.cargo/env"` for a file that doesn't exist, so every Bash output began with an error line, adding noise to everything.

The 72 user messages roughly fell into three kinds of pushback:

- **Scope creep**: "Why do we need so many switches?" "Why change that?"
- **Stopping halfway without saying so**: "Why isn't the PR open yet?" "Why is it still a draft?"
- **Wrong verification order**: "It isn't merged, so how can you verify it on dev?"

All three are judgment problems that a hook can't block, so they became checkable sentences in CLAUDE.md:

```markdown
- 範圍：只做被要求的。要新增開關、設定、gate、流程，或找其他人之前，先問並說明為什麼不能更小。
- 完成：說「完成」前逐項對照原始需求；沒做完（含 PR 還是 draft、還沒開）就明講剩什麼與原因。
- Shell 是 zsh：`[ ]` 比較用 `=` 不用 `==`；不把指令存進變數再執行；等待條件用 Monitor，不用 sleep 輪詢。
```

(In English: only do what was asked and ask before adding switches, settings, gates, processes, or people; before saying "done", check against the original request and say what's left; the shell is zsh, so use `=` in `[ ]`, don't run commands stored in variables, and wait with Monitor instead of `sleep` loops.)

Following [Claude Academy](https://academy.claude.com/courses/claude-code-in-action/a-claude-md-that-follows), each line names the replacement instead of only saying "don't do X".

## Fix 1: a hook that enforces "ask before running local tests"

`~/.claude/hooks/local-test-consent` is a PreToolUse(Bash) hook. It splits the command on `&&`, `;`, and `|`, strips wrappers like `env` and `nice`, and checks whether a segment starts with a test runner:

- Blocked: `pytest`, `vitest`, `jest`, `playwright`, `vue-tsc`, `python -m pytest`, `manage.py test`, `pnpm test` / `type:check` / `e2e`.
- `git commit` is blocked only in the front-end repo, whose pre-commit hook runs a full-project vue-tsc that can use 8 GB.
- Allowed: `grep pytest`, `cat pytest.ini`, `echo pnpm test`, `pnpm lint`, `ruff check`, `makemigrations --check`.

On a match it exits 2, and stderr tells the model to ask the user first. Only after the user agrees does the model append `# [test-consent]` to get through. I ran 19 sample commands through it, and every block and pass came out as expected.

```python
def main():
    data = json.load(sys.stdin)
    cmd = (data.get("tool_input") or {}).get("command", "")
    if not cmd or "[test-consent]" in cmd:
        return 0
    hits = [seg for seg in re.split(r"&&|\|\||;|\||\n", cmd)
            if is_test(words(seg.strip()))]
    if not hits:
        return 0
    sys.stderr.write("⛔ This command runs tests locally. Explain the scope and load "
                     "to the user, and only after they agree, resend it with "
                     "`# [test-consent]`. Never add the marker yourself.\n")
    return 2
```

Why not `permissionDecision: "ask"`: my session runs in bypass permissions mode, and I couldn't find a clear statement in the docs about whether ask still prompts there. Exit 2 blocks in every mode. The downside is that the model could add the marker on its own, so both stderr and CLAUDE.md say never to add it yourself, and subagents must report back to the main conversation instead of deciding.

Along the way I found an old bug. An existing push-check hook read the command with `json.load(stdin).get('command')`, but PreToolUse input nests it under `tool_input.command`. It had never blocked a single push since it was installed; it only looked like it was working. I changed it to `(d.get('tool_input') or {}).get('command')` and aligned its message with the new rule: either the user agreed and tests passed, or the PR says "not verified locally, relying on CI".

## Fix 2: a SessionStart hook that injects a resource snapshot

"Check `memory_pressure` and load before starting" in CLAUDE.md only works if the model remembers. A [SessionStart hook](https://code.claude.com/docs/en/hooks)'s stdout is added to context, so it can print one line at the start of every session:

```bash
#!/bin/bash
free=$(memory_pressure 2>/dev/null | awk -F': ' '/free percentage/{print $2}')
load=$(sysctl -n vm.loadavg | awk '{print $2", "$3", "$4}')
top3=$(top -l 1 -o mem -n 3 -stats command,mem | tail -3 \
       | awk '{m=$NF; $NF=""; sub(/ +$/,""); printf "%s %s；", $0, m}')
echo "本機資源（18 GB RAM、12 核）：可用記憶體 ${free}，load ${load}，前三名 ${top3}" \
     "可用 <25% 或 load > 核心數時，重負載工作一律依序執行。"
```

(The message reads: "Local resources (18 GB RAM, 12 cores): free memory, load, top three processes. If free memory is under 25% or load exceeds the core count, run heavy work one at a time.")

The `awk` part handles process names with spaces, such as `Orca Helper`: the last column is memory, the rest is the name. It costs under 100 tokens per session.

## Fix 3: cleaning auto memory by the official rules

The docs define auto memory like this:

> "`project`: ongoing work, deadlines, and decisions that Claude can't derive from the code or git history"
>
> "Claude skips anything it can derive from the codebase, such as architecture, file paths, or debugging fixes."
> — [Claude Code docs: Auto memory](https://code.claude.com/docs/en/memory)

Two facts that are easy to miss:

- Each session loads only the "first 200 lines or 25KB, whichever comes first" of MEMORY.md. Mine was at 147 lines and 22.7 KB, close to the limit.
- Memory files are excluded from `cleanupPeriodDays`, so they stay forever until someone deletes them.

The scope the docs list for [`/doctor prompt-audit`](https://code.claude.com/docs/en/memory) covers CLAUDE.md, rules, skills, commands, and subagents, but not auto memory. Stale or contradictory memories are yours to catch.

I read every entry and checked each fact it mentioned with `gh pr view` and `git ls-tree origin/develop`:

| Problem | Count | Example | Action |
|---|---|---|---|
| Only tracked PR progress, PR already merged | 8 | "Three PRs merged on such-and-such date" | Deleted |
| Described something unshipped as a current rule | 2 | "High-risk changes must be reviewed by a specific person", but the PR was closed and the files aren't in develop | Deleted |
| Contradicted another memory | 4 | One said "add `--create-db` when switching worktrees", another said "don't", and the index line said "DROP first" | Rewritten to one consistent answer |
| File written but missing from the index | 2 | "Never DROP and rebuild the local DB" had never been loaded | Indexed or merged |
| Conflicted with the new rule | 5 | "Always run pytest before push", "always record a demo for acceptance" | Changed to "list the scope, wait for consent; if not run, say so" |

MEMORY.md went from 147 lines to 132. What I kept in full is what git can't tell you: environment traps (a port that's always taken, CI and local using different prettier versions), decisions the user made and why, and where external resources live.

I also added one line to CLAUDE.md so the same kind of entry stops piling up:

```markdown
- 不記 git／gh 查得到的事（PR 狀態、合併日期、commit、分支進度）；project 類只記查不到的決策、約定與卡點，並寫明「刪除條件」，條件達成就刪。
```

(In English: don't record what git or gh can tell you, such as PR status, merge dates, commits, or branch progress; project memories only keep decisions, agreements, and blockers git can't show, each with a "delete when" condition, and get deleted once it's met.)

The "delete when" condition turned out to be the most useful format from this whole exercise, for example "delete after the fix PR merges" or "delete after the 11/14 recalculation is reported". At the next cleanup you only check whether the condition is met, instead of judging the whole entry again.

## Why it happens

- **CLAUDE.md and memory are both context, and neither executes anything.** However clearly they're written, a conflicting skill or workflow instruction can still win. Rules with no exceptions need to live somewhere that actually stops the command.
- **Auto memory only grows.** The size check at write time only warns when the file is nearly full. Stale entries, contradictions, and copies of git history never trigger anything.
- **The biggest cost is long sessions, not badly written rules.** A session compacted four to six times rereads a large cache each time. The Help Center's advice:

  > "When you switch from 'fix the login bug' to 'refactor the billing module,' run `/clear` and start fresh."
  > — [Give Claude context: CLAUDE.md and better prompts](https://support.claude.com/en/articles/14553240-give-claude-context-claude-md-and-better-prompts)

## Takeaway

Judgment calls go in CLAUDE.md, no-exception rules become hooks, and expired facts get deleted from memory. Put any of the three in the wrong place and you get rules nobody follows, hooks that never fire, and memories that mislead.

## References

- [How Claude remembers your project (CLAUDE.md and auto memory)](https://code.claude.com/docs/en/memory)
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)
- [Hooks reference](https://code.claude.com/docs/en/hooks)
- [A CLAUDE.md that follows — Claude Academy](https://academy.claude.com/courses/claude-code-in-action/a-claude-md-that-follows)
- [Give Claude context: CLAUDE.md and better prompts — Claude Help Center](https://support.claude.com/en/articles/14553240-give-claude-context-claude-md-and-better-prompts)
