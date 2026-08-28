---
title: "Claude Code Checkpointing Deep Dive: Snapshots, the Rewind Menu, and Tracking Boundaries"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, checkpointing, rewind, undo, safety]
lang: en
tldr: "Checkpointing is not git commits: Claude Code snapshots your files before every user prompt, keeps the 100 most recent per session, and deletes them after 30 days. This piece breaks down the five rewind menu options, the tracking boundaries (bash, subagents, symlinks), and how checkpoints divide labor with git."
description: "A deep dive into Claude Code's Checkpointing: when snapshots trigger and how long they last, the /rewind menu options, what bash commands, subagents, and symlinks fall outside its coverage, and how checkpoints work alongside git and permission modes."
draft: false
series:
  name: "Claude Code Deep Dives"
  order: 4
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-checkpointing-guide)

This is part 4 of the [Claude Code Deep Dives](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works-en) series. The series opener split Claude Code's safety design into two lines of defense: checkpoints let you take back file changes, and permission modes control how much it can do without asking. This post expands on the first line: how snapshots are stored, how rewind works, and — just as important — what it cannot recover.

## What Problem It Solves

The price of an agentic loop is loss of control: the model may edit your files across dozens of consecutive steps with no human review in between. The traditional insurance policy is asking it to commit to git first — but letting an AI auto-commit clutters history, and in a directory that isn't a git repo, it simply doesn't work.

Claude Code's answer is to build restore points into the tool itself. The official docs put it plainly: "Before Claude edits a file, it snapshots the current contents." No setup required, no touching git history, works outside git entirely. When something goes wrong, you're two keystrokes away from the previous state.

## How Snapshots Work

The mechanism has three rules, all from the official [Checkpointing docs](https://code.claude.com/docs/en/checkpointing):

**Trigger**: every user prompt creates a new checkpoint. What gets tracked are direct edits made through Claude's built-in file editing tools — not a backup of the whole working directory.

**Retention**: a session keeps file snapshots for the 100 most recent checkpoints; the entire checkpoint data lives and dies with the session and is deleted after 30 days under the cleanup rules for `~/.claude`, adjustable via `cleanupPeriodDays`.

**Bound to the conversation**: because checkpoints are saved together with the conversation, `/rewind` still works after you resume a session with `--resume`.

## Rewind: Double Esc and Five Options

There are two ways to open the rewind menu: type `/rewind`, or press `Esc` twice while the prompt input is **empty**. Note that if the input has text in it, double `Esc` clears that text instead of opening the menu — cleared text goes into your input history, recallable with the up arrow.

The menu mainly lists prompts from the current session. Newer Claude Code versions add one `/clear` exception: until you exit or resume another session, the rewind menu may keep a previous-session entry that lets you return to the conversation you cleared. Once you pick a point, there are five actions:

| Option | What it does |
|--------|--------------|
| Restore code and conversation | Revert both code and conversation to that point |
| Restore conversation | Rewind only the conversation, keep current code |
| Restore code | Revert file changes, keep the conversation |
| Summarize from here | Compress everything after this point into a summary to free context |
| Summarize up to here | Compress everything before this point, keeping later messages intact |

(The menu also has a Never mind option, which cancels.) The two code-restore options appear only if there were tracked file changes after the selected checkpoint; if Claude edited nothing past that point, the menu offers just the conversation-related choices.

The two Summarize options deserve a closer look: they touch nothing on disk and compress only the conversation itself, working like a targeted `/compact` — say, after a long debugging session, folding the middle into a summary while keeping your initial instructions and latest progress. You can also type optional instructions on a selected summarize row to guide what the summary focuses on.

As for commands, there's nothing new to memorize: `/undo` and `/checkpoint` are both aliases of `/rewind`, with identical behavior.

## The Boundaries: What Rewind Can't Bring Back

Checkpointing draws a clear line around itself. Four boundaries worth memorizing:

**Bash changes aren't tracked.** Files touched by shell commands Claude runs — `rm file.txt`, `mv`, `cp` — can't be recovered via rewind. Only direct edits through the file editing tools are captured.

**Subagent edits usually aren't restored.** A typical subagent makes its edits inside its own flow, and those don't land in your session's checkpoints — reverting them means using git. One exception: a forked skill running in the foreground (`context: fork` with `background: false`) edits your working tree during your own turn, so rewind covers it normally.

**Symlinks and hard links are skipped.** During a restore, such paths are left untouched and you get a "Restored the code, but skipped N files" warning. Config files a dotfile manager symlinks into your project and files pnpm hard-links into place both fall into this category. To see exactly which paths get skipped, turn on debug logging with `/debug` before restoring — the log names each one.

**Out-of-session changes and remote operations aren't covered.** Edits you make yourself in an editor, or from another concurrently running session, are generally not captured; databases, APIs, and deployments were never within reach of a file snapshot in the first place.

## Working with Git, Not Replacing It

The official docs are unambiguous: checkpoints are for quick, session-level recovery — commits, branches, and permanent history remain git's job.

In practice the division looks like this: exploratory changes ("try approach A, switch if it fails") go through rewind — clean, and it never pollutes history; once a direction is confirmed, commit it immediately, because checkpoints expire after 30 days, cap out at 100, and don't follow you to another machine. Treating checkpoints as a git extension or replacement will eventually run into the boundaries above.

## Pairing with Permission Modes: The Last Line Before Letting Go

Looking back at the two lines of defense, what checkpoints can't cover happens to be the riskiest part: bash side effects and remote operations. Those belong to the second line — permission modes (`Shift+Tab` to cycle), which decide what Claude may do without asking.

So the right mindset isn't "checkpoints exist, so I can open up permissions freely" — it's the reverse: the wider your permissions, the better you need to know where checkpoints end. If you're considering fully hands-off modes like `--dangerously-skip-permissions`, read the earlier [bypass permissions risk analysis](/posts/tech/2026-03-16-claude-code-dangerously-skip-permissions-en) first. In that mode, checkpoints are your last way to take back file changes — powerless against bash and remote operations — and the remaining risk has to be contained by sandboxing and environment isolation.

One sentence to sum up: checkpoints make "breaking files" cheap, permission modes stop dangerous actions from happening at all, and git keeps the permanent record. Three layers, three jobs — don't expect any single one to carry everything.

## References

- [Checkpointing — Claude Code Docs](https://code.claude.com/docs/en/checkpointing) — Official explanation of snapshot triggers, the 100-checkpoint / 30-day retention rules, the five rewind menu options, and the bash/subagent/symlink limitations
- [How Claude Code works — Claude Code Docs](https://code.claude.com/docs/en/how-claude-code-works) — Official description of the checkpoints-and-permissions safety design and why remote operations can't be checkpointed
- [Commands — Claude Code Docs](https://code.claude.com/docs/en/commands) — Full command list defining `/rewind` and its `/checkpoint`, `/undo` aliases

## Update Log

- 2026-08-26: Fully rewritten against the current official docs, correcting the earlier draft's claims that "checkpoints are git commits" and "pair with git worktrees"; now centered on the snapshot mechanism and the rewind menu.
