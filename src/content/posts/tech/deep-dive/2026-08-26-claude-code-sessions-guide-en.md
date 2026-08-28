---
title: "How to manage Claude Code sessions: --continue, --resume, /branch, and JSONL transcripts"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, sessions, resume, cli]
lang: en
tldr: "Claude Code writes every session line by line to a JSONL file under ~/.claude/projects/, kept for 30 days by default. This post breaks down --continue vs --resume, session naming rules, /branch fork semantics, and transcript export and cleanup settings."
description: "A complete guide to Claude Code sessions: what resume and fork each do, session picker shortcuts, cross-worktree and cross-project lookup rules, and script-friendly transcript interfaces."
draft: false
series:
  name: "Claude Code Deep Dives"
  order: 3
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-08-26-claude-code-sessions-guide)

The [series entry post](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works-en) spent one section on sessions: "stored under `~/.claude/projects/`, resume appends to the same ID, fork copies the history." This post expands the full lifecycle — where transcripts live, how to get back in, how to branch off, how to clean up. The desktop app, the web version, and the VS Code extension each keep their own session history; this post covers the CLI only.

## Where transcripts live: JSONL under projects

As you work, every message, tool call, and result is appended to a plaintext JSONL file:

```
~/.claude/projects/<project>/<session-id>.jsonl
```

`<project>` is your working directory path with non-alphanumeric characters replaced by `-`. The docs also flag the risk of parsing it directly: JSONL entries are Claude Code's internal format, and that format can change between versions. If you want session data for automation, use the export interfaces covered below instead of parsing this file yourself.

If you don't want records at all, there are switches for that too: the `CLAUDE_CODE_SKIP_PROMPT_HISTORY` environment variable suppresses writes everywhere, and a one-off non-interactive run takes `claude -p --no-session-persistence`.

## Getting back in: --continue vs --resume

To pick a conversation back up after exiting, these are the common entry points:

| Entry point | What it does |
|-------------|--------------|
| `claude --continue` | Resumes the most recent interactive session in the current directory |
| `claude --resume` | Opens the interactive session picker |
| `claude --resume <name>` | Resumes a named session directly |
| `claude --resume <session-id>` | Resumes by ID, from any directory |
| `claude --from-pr <number>` | Finds the session that created a GitHub PR |
| `/resume` inside a session | Opens the resume picker from the current session |

Resume doesn't load a copy — it appends new messages under the same session ID, so the same transcript keeps growing. What gets restored goes beyond the conversation: model and agent configuration, including the system prompt and tool restrictions, come back too. Permission mode depends on the resume path: direct terminal resume can restore the stored mode, while the picker and in-session `/resume` do not restore permission mode. `bypassPermissions` is not restored, and `plan` is retained only in some non-interactive or VS Code paths. Launch flags don't fully travel either: `--mcp-config`, `--settings`, and `--plugin-dir` need to be passed again on resume; settings that live in settings.json do not.

On Pro or Max plans there's also a token-saving design: when you resume a session that has been inactive for over an hour and exceeds 100,000 tokens, Claude Code asks whether to **resume from summary** — compacting immediately so later requests carry the summary instead of the full history, at the cost of whatever details the summary leaves out leaving your context.

## The picker and naming: making sessions findable

`claude --resume` or `/resume` inside a session opens the picker. Shortcuts worth memorizing:

- `Space` previews content, `Ctrl+R` renames
- `Ctrl+B` filters to the current git branch
- `Ctrl+W` widens to every worktree of the repo
- `Ctrl+A` widens to every project on this machine
- Paste a GitHub, GitHub Enterprise, GitLab, or Bitbucket PR/MR URL into search to find the session that created it

Three ways to name a session: `claude -n auth-refactor` at startup, `/rename` mid-session, or `Ctrl+R` in the picker. Unnamed sessions aren't anonymous either — Claude Code generates a title from your first prompt using a small/fast model, and that title works as a resume handle. Watch out for the other kind of default display name (like `my-app-3f`): it identifies running sessions in listings but won't resolve if you feed it to `claude --resume`.

## Branching: /branch and --fork-session

Trying a different approach without losing the path you were on is what fork is for. `--fork-session` and `/branch` both copy the conversation history into a new session ID while leaving the original unchanged.

Run `/branch try-streaming-approach` inside a session and the confirmation prints two session IDs — the new branch you're now in, and the original you can return to with `/resume`. On the command line, combine them as `claude --continue --fork-session`. One detail that trips people up: `/branch` within the same process carries over "allow for this session" grants, but `--fork-session` starts a new process where you re-approve.

The reverse trap matters too: resuming the same session in two terminals without forking interleaves both sides' messages into **one** transcript.

## Across worktrees and projects

Sessions are tied to directories, so the right way to work in parallel is git worktrees — one directory per branch, sessions isolated per worktree. The picker defaults to the current worktree; widen with the `Ctrl+W` / `Ctrl+A` shortcuts above.

The lookup order for resuming by ID is worth knowing: current directory and its worktrees first, then every other project on this machine — but the ID resolves only when **exactly one** other project holds it, so hand-copied duplicates report not-found rather than resuming an arbitrary copy. Also, `/cd` relocates a session into the new directory's storage, after which it appears in that directory's picker.

## Exporting and cleaning up

For humans: `/export` copies the conversation to your clipboard or saves it as a plain-text file, with tool outputs rendered readably.

For programs there are three interfaces, chosen by what triggers your script: one-shot runs use `claude -p --output-format json` to capture structured output plus session ID; follow-up questions go through `claude -p --resume <session-id>`; event-driven scripts read the `transcript_path` field hooks receive — for example a `SessionEnd` hook that archives the transcript when a session ends.

For cleanup, transcript retention is controlled by `cleanupPeriodDays` in settings.json, 30 days by default. Day-to-day context management is separate: `/clear` starts fresh while saving the previous conversation, `/compact` replaces history with a summary, and `/context` shows what's consuming space.

## Takeaway

The whole mechanism collapses into one sentence: **the transcript is the source of truth for resume, fork, and checkpoint rewind.** `--continue` appends under the same ID, `/branch` copies into a new one, and checkpoint rewind (see the [Checkpointing guide](/posts/tech/deep-dive/2026-03-28-claude-code-checkpointing-guide-en)) follows the session's checkpoints back to an earlier state. Auto memory is a separate layer: it is stored as project memory files, not inside the transcript itself. Once that division clicks, running parallel sessions, working across worktrees, and piping conversations into scripts stop blurring session history, context summaries, and long-term memory into one thing.

## References

- [Manage sessions — Claude Code Docs](https://code.claude.com/docs/en/sessions) — official reference for resume flags, picker shortcuts, naming rules, and transcript storage/retention
- [How Claude Code works — Claude Code Docs](https://code.claude.com/docs/en/how-claude-code-works) — resume vs fork session-ID semantics and the worktree parallelism section
- [Memory — Claude Code Docs](https://code.claude.com/docs/en/memory) — official reference for auto memory being stored separately from transcripts

## Changelog

- 2026-08-26: Initial version, based on the August 2026 official documentation.
