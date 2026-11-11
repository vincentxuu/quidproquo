---
title: "Parallel AI Coding Agents Ate My RAM: Where Orphan Processes Come From and How to Reap Them"
date: 2026-11-11
category: ai
type: debug
tags: [coding-agent, claude-code, mcp, macos, developer-tools]
lang: en
tldr: "Run several Claude Code, Codex or Cursor sessions at once and their dev servers, test workers and Playwright MCP browsers keep running as orphans after the sessions end, until swap hits 30 GB and tests hang. macOS has no per-process memory cap, so it takes three layers: a SessionEnd hook, a periodic orphan reaper and a memory gate."
description: "Why AI coding agents leave orphan processes behind (re-parenting to PID 1, killing only the outer shell, one MCP server set per session), where Claude Code, Codex, Cursor, Cline and Playwright MCP stand today, and a three-layer defence on macOS using a SessionEnd hook, a launchd reaper and swap alerts, with its limits."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-11-11-ai-agent-orphan-processes)

## TL;DR

When you run several AI coding agent sessions side by side, the usual slowdown isn't the model. It's what the sessions leave behind: dev servers, test workers, [Playwright MCP](https://github.com/microsoft/playwright-mcp) and the browsers it launches. Once the program that started them exits, they get adopted by the system (their PPID becomes 1) and nobody ever stops them. macOS gives you no way to cap a single process's memory, so the fix is three layers: reap what a session started when it exits normally, periodically reap orphans nobody owns, and alert when memory is about to run out.

## Context

I usually keep several [Claude Code](https://code.claude.com/docs/en/overview) sessions open, each working in its own git worktree on the backend or frontend. One day a pytest run had been going for 25 minutes but had used only 1.5 minutes of CPU. The rest of the time it was waiting on memory paging.

## The problem

`sysctl vm.swapusage` showed 29.6 GB of swap in use out of 30.7 GB. The memory wasn't going to the agents I was actually using, but to processes nobody was using:

- 4 vite dev servers, up for more than a day, whose sessions had long since ended
- uvicorn and celery from another worktree, hanging off a session that had been open and resumed for two days
- 3 playwright-mcp processes, the oldest two days old; with its browsers it held about 3.5 GB

After all of that was stopped, swap usage dropped from 21 GB to 9 GB and the stuck tests started moving again.

## Check whether it's orphan processes

These three commands tell you within a minute:

```bash
# How much swap is in use (macOS)
sysctl vm.swapusage

# Biggest memory users (includes compressed memory, more accurate than ps RSS)
top -l 1 -o mem -n 10 -stats pid,mem,command

# Dev services whose parent is already launchd (PPID=1): these are the orphans
ps -axo pid,ppid,etime,command | awk '$2 == 1' | grep -E 'uvicorn|celery|vite|vitest|pytest|playwright-mcp'
```

The `etime` column is how long a process has been running. A dev server that's been up for hours with a parent of 1 is almost certainly unused.

## Why orphans get left behind

```diagram
title: After the agent dies, launchd adopts the dev server
desc: While the session is alive, vite runs under the agent's tool shell. After the agent exits abnormally, the shell disappears too, and npm and vite are adopted by launchd (PID 1) and keep running.
caption: Simplified: launchd was always there; it is drawn in the agent's old spot for comparison.
---
<svg viewBox="0 0 640 448">
  <text class="dg-heading" x="20" y="28" dominant-baseline="central">Session alive</text>
  <text class="dg-heading" x="340" y="28" dominant-baseline="central">After an abnormal exit</text>
  <line class="dg-rule" x1="316" y1="16" x2="316" y2="332"/>

  <path class="dg-line" d="M160 104V128" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 176V200" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 248V272" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M560 82H604Q612 82 612 90V218Q612 226 604 226H564" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M480 248V272" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="80" y="60" width="160" height="44" rx="6"/>
  <text class="dg-label" x="160" y="82" text-anchor="middle" dominant-baseline="central">Claude Code</text>
  <rect class="dg-box" x="80" y="132" width="160" height="44" rx="6"/>
  <text class="dg-label" x="160" y="154" text-anchor="middle" dominant-baseline="central">tool shell</text>
  <rect class="dg-box" x="80" y="204" width="160" height="44" rx="6"/>
  <text class="dg-label" x="160" y="226" text-anchor="middle" dominant-baseline="central">npm run dev</text>
  <rect class="dg-box" x="80" y="276" width="160" height="44" rx="6"/>
  <text class="dg-label" x="160" y="298" text-anchor="middle" dominant-baseline="central">vite + esbuild</text>

  <rect class="dg-box dg-box--accent" x="400" y="60" width="160" height="44" rx="6"/>
  <text class="dg-label" x="480" y="82" text-anchor="middle" dominant-baseline="central">launchd (PID 1)</text>
  <rect class="dg-box dg-box--ghost" x="400" y="132" width="160" height="44" rx="6"/>
  <text class="dg-label" x="480" y="154" text-anchor="middle" dominant-baseline="central">tool shell</text>
  <rect class="dg-box" x="400" y="204" width="160" height="44" rx="6"/>
  <text class="dg-label" x="480" y="226" text-anchor="middle" dominant-baseline="central">npm run dev</text>
  <rect class="dg-box dg-box--warn" x="400" y="276" width="160" height="44" rx="6"/>
  <text class="dg-label" x="480" y="298" text-anchor="middle" dominant-baseline="central">vite + esbuild</text>

  <text class="dg-edge dg-text--accent" x="604" y="154" text-anchor="end" dominant-baseline="central">adopt</text>
  <g class="dg-badge"><circle cx="384" cy="154" r="10"/><text x="384" y="154" text-anchor="middle" dominant-baseline="central">−</text></g>

  <line class="dg-rule" x1="20" y1="352" x2="620" y2="352"/>
  <text class="dg-tag" x="20" y="376" dominant-baseline="central">CHANGES</text>
  <g class="dg-badge"><circle cx="32" cy="404" r="10"/><text x="32" y="404" text-anchor="middle" dominant-baseline="central">−</text></g>
  <text class="dg-sub" x="52" y="404" dominant-baseline="central">Gone: agent + tool shell (crash)</text>
  <g class="dg-badge dg-badge--accent"><circle cx="352" cy="404" r="10"/><text x="352" y="404" text-anchor="middle" dominant-baseline="central">→</text></g>
  <text class="dg-sub" x="372" y="404" dominant-baseline="central">Re-parent: npm → launchd</text>
  <text class="dg-sub" x="52" y="432" dominant-baseline="central">vite gets no signal and keeps its memory and port</text>
</svg>
```

There are four causes, and they stack:

1. **Children don't die with their parent.** POSIX says that when a process exits, its children are adopted by a system process ([`_exit()`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/_exit.html)); on macOS that's launchd. An agent's tool shell is usually not the terminal's controlling process, so the children don't even get SIGHUP. They just keep running.
2. **The way agents start servers is designed to detach.** In `nohup uvicorn ... > log 2>&1 &`, the `&` returns immediately, [`nohup`](https://www.gnu.org/software/coreutils/manual/html_node/nohup-invocation.html) blocks SIGHUP, and adding `setsid` moves the process into a new group so a group kill misses it. When users reported this on the [Cursor forum](https://forum.cursor.com/t/agent-started-long-running-servers-vite-disappear-from-the-terminal-ui-aborting-the-agent-shell-orphans-the-process-ppid-1/171517), staff first asked whether the command used these forms.
3. **Stopping only kills the outer layer.** Node's [`subprocess.kill()`](https://nodejs.org/api/child_process.html) only kills the direct child; the official example says the process inside the shell is not terminated. For nested commands like `npm run dev` → `vite` → `esbuild` or `pytest` → xdist workers, stopping the shell leaves everything underneath running.
4. **One set of MCP servers per session.** The [MCP spec](https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle) makes the client responsible for shutting down stdio servers, and only as a SHOULD. Every session starts its own MCP servers, so parallel sessions multiply the process count. A [measurement post](https://jyoung.dev/blog/claude-code-parallel-sessions-memory/) found that in two of three sessions, the MCP servers used more memory than Claude Code itself.

Claude Code adds one more amplifier: [a foreground command that hits its timeout is moved to the background instead of being stopped](https://code.claude.com/docs/en/interactive-mode). A stuck pytest goes from living for one tool call to living for the whole session, and becomes an orphan if the session ends abnormally.

## You're not the only one

Every major tool has public reports, and most aren't fully fixed (status as of 2026-11):

| Tool | Representative report | Status |
|---|---|---|
| Claude Code | [#95821](https://github.com/anthropics/claude-code/issues/95821): after an MCP connect timeout the spawned process is never killed; 5 sessions accumulated 373 orphans | Open |
| Claude Code | [#96625](https://github.com/anthropics/claude-code/issues/96625): after a crash or force-quit, background processes are adopted by launchd and keep running | Open |
| Codex CLI | [#30408](https://github.com/openai/codex/issues/30408): each thread starts its own MCP set and never reaps it; about 9.3 GB after 25 threads | Open |
| Cursor | [Forum](https://forum.cursor.com/t/possible-memory-leak-with-test-command/147911): staff confirm background terminal processes don't shut down when a session ends | Known issue |
| Cline | [#14622](https://github.com/cline/cline/issues/14622): in hub mode MCP servers are never stopped; 10 Serena instances after a day and a half | Open |
| Playwright MCP | Claude Code [#78551](https://github.com/anthropics/claude-code/issues/78551): old browsers not reaped after reconnecting; about 13 GB over 3 days | Closed (not planned) |

There's also a cautionary tale in the other direction. A comment on Claude Code #96625 notes that Codex 0.97–0.98 once killed background jobs at the end of every turn, which broke legitimate long-running `nohup` jobs and watch loops. Tools can't just kill everything, which is part of why this has dragged on.

## What the official mechanisms cover

Claude Code actually cleans up well on a **normal exit**. The [docs](https://code.claude.com/docs/en/interactive-mode) say:

> Background tasks are automatically cleaned up when Claude Code exits. On macOS and Linux, when you stop a background task from `/tasks` or Claude Code stops it at exit, processes that detached from the task's shell, such as ones started under `setsid` or `timeout`, stop too.

The gaps are everything outside that guarantee:

- **Crash, kill, or closing the terminal.** The [SessionEnd hook](https://code.claude.com/docs/en/hooks) reasons are only `clear`, `resume`, `logout`, `prompt_input_exit` and `other`; the docs don't promise it fires on an abnormal exit.
- **SessionEnd gets very little time.** The default total budget is 1.5 seconds; raise it with a per-hook `timeout` or `CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS`.
- **Background sessions hand their processes on.** When the supervisor reaps an idle session, [its background shells carry over to the next process](https://code.claude.com/docs/en/agent-view); they only stop when you delete the session. `CLAUDE_CODE_DISABLE_BG_EXIT_HANDOFF=1` makes them stop with the process.
- **The memory cap is Linux-only.** `CLAUDE_CODE_TOOL_MEMORY_LIMIT` is built on cgroups and supports only Linux and WSL.

Codex has [`/ps` and `/stop`](https://developers.openai.com/codex/cli/slash-commands) to list and stop background terminals; Cursor's [sessionEnd hook](https://cursor.com/docs/hooks) is fire-and-forget. None of the three guarantees cleanup after an abnormal exit.

## Why macOS can't cap memory

On Linux, the most complete answer is to wrap the whole session in a cgroup (covered below). macOS has no cgroups, and the things that look like they should work don't:

- **`ulimit` doesn't work.** On macOS 26, `ulimit -m` returns "bad option" and `ulimit -v` returns "setrlimit failed". The `setrlimit(2)` man page says that when memory is tight, "the system will prefer to take memory from processes that are exceeding their declared resident set size". That's a reclaim preference, not a limit. launchd's `ResidentSetSize` uses the same wording.
- **Swap has no fixed ceiling.** Apple's [virtual memory documentation](https://developer.apple.com/library/archive/documentation/Performance/Conceptual/ManagingMemory/Articles/AboutMemory.html) says swap "uses all of the available space on the machine's boot partition". Idle pages of orphan processes keep getting swapped out; the system doesn't crash, it just gets slower.
- **The OS won't kill much for you either.** A comment in the [XNU source](https://github.com/apple-oss-distributions/xnu/blob/main/bsd/kern/kern_memorystatus.c) says macOS has only "a very limited jetsam that is only invoked under extreme conditions", i.e. when swap or compressor space is nearly exhausted.

The only real hard cap on macOS is a container: [Docker](https://docs.docker.com/engine/containers/resource_constraints/) `--memory`, or the Docker Desktop VM limit.

## My setup: three layers

Every single layer has holes, so I use three, each covering what the previous one misses:

| Layer | When it acts | Catches | Misses |
|---|---|---|---|
| 1. SessionEnd hook | Session exits normally | Dev servers and tests this session started | Crash, kill, sessions that never close |
| 2. Periodic reaper | Every 5 minutes | Orphans with PPID 1, long-running Playwright MCP | Services under a session that's still alive |
| 3. Memory gate | Continuously | Pauses the newest test run when tests exceed the cap; alerts when swap is nearly full | Doesn't kill anything itself; a human decides |

### Layer 1: a SessionEnd hook reaps what this session started

The hook walks up from itself to this session's `claude` process and reaps every matching process tree beneath it. Two details matter: take the process snapshot as soon as the hook starts (once `claude` exits its children get re-parented to launchd and the tree is gone), and fork into the background before killing so the 1.5-second budget doesn't cut it off.

```python
MATCH = re.compile(
    r"(^|[/\s])pytest(\s|$)|-m pytest|vue-tsc"
    r"|(^|[/\s])uvicorn\s|(^|[/\s])celery\s.*\bworker\b|manage\.py\s+runserver"
    r"|vite(\.js)?\s|vitest|pnpm\s+(dev|vite)\b|npm\s+run\s+dev\b"
)
# 1. snapshot: ps -axo pid=,ppid=,comm=,command=
# 2. walk up to the ancestor whose comm == "claude"
# 3. walk down collecting MATCH processes and their descendants
# 4. fork + setsid to detach, send SIGTERM (plus SIGCONT to wake paused ones), SIGKILL survivors after 5 s
```

Register the script under `hooks.SessionEnd` in `~/.claude/settings.json`. The pattern only lists dev services, so MCP servers aren't hit by mistake.

### Layer 2: launchd reaps orphans every 5 minutes

A LaunchAgent (`StartInterval` 300) runs a scanner with two rules:

- uvicorn, celery worker, runserver, vite, vitest or `pnpm dev` whose parent is already 1 and that have run longer than 4 hours: nobody owns them, reap the whole tree.
- Playwright MCP, whatever its parent, reaped after 12 hours. It often hangs off sessions that never close, and its browser tabs keep piling up.

```bash
ps -axo pid=,ppid=,etime=,command= | while read -r pid ppid etime cmd; do
  [ "$ppid" = 1 ] || continue
  grep -Eq "$PATTERN" <<<"$cmd" || continue
  grep -q 'mcp' <<<"$cmd" && continue
  [ "$(etime_secs "$etime")" -ge "$orphan_secs" ] || continue
  pids=$(tree "$pid" | tr '\n' ' ')
  log "REAP pid=$pid age=$etime tree=[$pids]"
  kill -TERM $pids; kill -CONT $pids
  ( sleep 10; kill -KILL $pids 2>/dev/null ) &
done
```

`tree` is a small function that recurses with `pgrep -P`. Give the script a `DRY_RUN=1` mode that only lists what it would touch, and run it once before installing.

### Layer 3: a memory gate

A separate resident watchdog sums the memory of every pytest and vue-tsc process tree every 5 seconds. Above half of physical RAM it sends SIGSTOP to the newest run (pausing, not killing) and resumes runs in order once usage drops. The layer-2 script also checks swap: at 80% or more it pops an `osascript` notification listing the top five memory users, at most once every 30 minutes.

Use `top`'s MEM column rather than `ps` RSS: under memory pressure many pages are compressed or swapped out, and RSS badly underestimates.

A paused test looks exactly like a hung one. That's what fooled me this time: I assumed the tests had deadlocked until the log showed the gate had paused them. So log every pause and resume clearly.

## Options on Linux and in containers

On Linux, [`systemd-run --user --scope`](https://www.freedesktop.org/software/systemd/man/latest/systemd-run.html) with [`MemoryHigh` and `MemoryMax`](https://www.freedesktop.org/software/systemd/man/latest/systemd.resource-control.html) caps an entire agent session, and writing to [`cgroup.kill`](https://docs.kernel.org/admin-guide/cgroup-v2.html) at the end takes down forked processes too, `setsid` or not:

```bash
systemd-run --user --scope -p MemoryHigh=6G -p MemoryMax=8G -p MemorySwapMax=0 -- claude
```

Be aware that when the OOM killer takes out an xdist worker, [the whole test run can hang](https://github.com/pytest-dev/pytest-xdist/issues/658), so wrap test commands in `timeout -k` as well.

Containers (one per agent) work on both platforms, but the devcontainer [`hostRequirements.memory`](https://containers.dev/implementors/json_reference/) field is a minimum requirement, not a cap; to limit memory add `--memory` to `runArgs`.

## Start fewer processes in the first place

Reaping is cleanup after the fact. These settings reduce what gets started:

- **Give Playwright MCP an idle timeout.** [`--idle-timeout`](https://github.com/microsoft/playwright-mcp) defaults to one hour for headless browsers and never for headed ones. To share one browser across agents, run it in HTTP mode with `--shared-browser-context`, at the cost of agents' tabs interfering with each other.
- **Size xdist workers by memory.** [`-n auto`](https://pytest-xdist.readthedocs.io/en/stable/distribution.html) looks only at physical CPU cores, not memory. When several agents run tests at once, lower it with `PYTEST_XDIST_AUTO_NUM_WORKERS`.
- **Use run-once test commands.** `vitest run` instead of `vitest`, `tsc` instead of `tsc --watch`. Watch mode never exits by design.
- **celery on macOS doesn't reap its children when SIGKILLed.** The [official docs](https://docs.celeryq.dev/en/stable/userguide/workers.html#stopping-the-worker) note that only Linux gets the `PR_SET_PDEATHSIG` safety net; on macOS you `pkill` them yourself.

## Limitations

- **The reaper will kill services you left running on purpose.** A dev server you started with `nohup` and meant to keep gets reaped after 4 hours. The thresholds are environment variables; tune them.
- **Sessions that never close slip through.** The service's parent is still alive, so layer 2 leaves it alone; only the swap alert reminds you to close it.
- **launchd doesn't run while the Mac is asleep**, so after waking it can take up to 5 minutes to catch up.
- There are community tools too: [cc-reaper](https://github.com/theQuert/cc-reaper) uses a Stop hook plus a LaunchAgent to reap Claude Code orphans with a similar approach, and is a good starting point to adapt.

## What I learned

Most AI agent tools clean up well when they exit normally. What leaks is crashes, forced exits and sessions that never close, and the more sessions you run in parallel, the more leaks you get. macOS gives you no memory cap to set, so you need your own periodic orphan reaper plus an alert for when swap is about to fill.

## References

- [Claude Code: Background Bash commands (interactive mode)](https://code.claude.com/docs/en/interactive-mode)
- [Claude Code: Hooks reference (SessionEnd)](https://code.claude.com/docs/en/hooks)
- [Claude Code: Agent view and the supervisor](https://code.claude.com/docs/en/agent-view)
- [Claude Code issue #95821: MCP retries leak orphaned processes](https://github.com/anthropics/claude-code/issues/95821)
- [Claude Code issue #96625: background processes orphaned after a crash](https://github.com/anthropics/claude-code/issues/96625)
- [Claude Code issue #78551: Playwright MCP browsers accumulating](https://github.com/anthropics/claude-code/issues/78551)
- [OpenAI Codex issue #30408: per-thread MCP processes never cleaned up](https://github.com/openai/codex/issues/30408)
- [Codex CLI slash commands (/ps, /stop)](https://developers.openai.com/codex/cli/slash-commands)
- [Cursor forum: agent-started vite orphaned with PPID 1](https://forum.cursor.com/t/agent-started-long-running-servers-vite-disappear-from-the-terminal-ui-aborting-the-agent-shell-orphans-the-process-ppid-1/171517)
- [Cursor forum: possible memory leak with test command](https://forum.cursor.com/t/possible-memory-leak-with-test-command/147911)
- [Cursor Hooks (sessionEnd)](https://cursor.com/docs/hooks)
- [Cline issue #14622: hub-mode MCP servers never stopped](https://github.com/cline/cline/issues/14622)
- [Playwright MCP README (--idle-timeout, --shared-browser-context)](https://github.com/microsoft/playwright-mcp)
- [MCP specification: Lifecycle › Shutdown](https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle)
- [Node.js child_process: subprocess.kill()](https://nodejs.org/api/child_process.html)
- [POSIX _exit()](https://pubs.opengroup.org/onlinepubs/9799919799/functions/_exit.html)
- [GNU coreutils: nohup](https://www.gnu.org/software/coreutils/manual/html_node/nohup-invocation.html)
- [Apple: About the Virtual Memory System](https://developer.apple.com/library/archive/documentation/Performance/Conceptual/ManagingMemory/Articles/AboutMemory.html)
- [XNU source: kern_memorystatus.c](https://github.com/apple-oss-distributions/xnu/blob/main/bsd/kern/kern_memorystatus.c)
- [systemd-run](https://www.freedesktop.org/software/systemd/man/latest/systemd-run.html)
- [systemd.resource-control (MemoryHigh, MemoryMax)](https://www.freedesktop.org/software/systemd/man/latest/systemd.resource-control.html)
- [Linux cgroup v2 documentation](https://docs.kernel.org/admin-guide/cgroup-v2.html)
- [pytest-xdist issue #658: hang after OOM kills a worker](https://github.com/pytest-dev/pytest-xdist/issues/658)
- [pytest-xdist: Distribution (-n auto)](https://pytest-xdist.readthedocs.io/en/stable/distribution.html)
- [Docker: Resource constraints](https://docs.docker.com/engine/containers/resource_constraints/)
- [Dev Container JSON reference (hostRequirements)](https://containers.dev/implementors/json_reference/)
- [Celery: Stopping the worker](https://docs.celeryq.dev/en/stable/userguide/workers.html#stopping-the-worker)
- [John Young: Claude Code Memory Usage: How Many Sessions Fit on One Machine](https://jyoung.dev/blog/claude-code-parallel-sessions-memory/)
- [cc-reaper](https://github.com/theQuert/cc-reaper)
