---
title: "Learning from Mature Coding Agents (12): CLI Ergonomics — Make New Tools Feel Already Familiar"
date: 2026-08-25
category: ai
tags: [coding-agent, cli, developer-experience, codex, claude-code, opencode, rivumi]
lang: en
type: deep-dive
description: "Comparing the command surfaces of Claude Code, Codex, Pi, OMP, and OpenCode CLIs — positional prompts, exec/resume conventions, -p print mode — and how rivumi absorbs these conventions without weakening its safety boundaries."
tldr: "Mature coding-agent CLIs have converged on the same conventions: positional prompt, -p means print, exec is headless, resume is a first-class command, -C changes directory; rivumi inherits this vocabulary directly, driving learning cost close to zero."
draft: false
series:
  name: "跟成熟 coding agent 學設計"
  order: 13
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-cli-ergonomics)

## The Design Problem: Muscle Memory Is the Biggest Existing Asset

Build a new coding agent and no matter how capable it is, you hit the same wall: users must first learn your interface. Every invented flag, every "huh, that's not what I thought it meant" moment loses people. Conversely, if a brand-new tool's first impression is "this works like what I use every day," learning cost drops to nearly zero — your fingers just know.

That's the core of CLI ergonomics: **don't invent vocabulary, inherit it**. Among Nielsen's usability heuristics, "consistency and standards" ranks fourth, and its point is exactly this: platform conventions belong to users, not to you. [clig.dev](https://clig.dev/) likewise lists "following existing command-line conventions" as a first principle.

But what *are* the conventions? Talking in the abstract proves nothing, so I read the source code of five mature coding agents and compared their command surfaces directly.

## How the Five Do It

### Claude Code: positional prompt plus four key flags

Claude Code's commander definition states its default behavior outright: "starts an interactive session by default, use -p/--print for non-interactive output":

- The root command takes a `[prompt]` positional argument (the program definition in `claude-code-source/src/main.tsx`)
- `-p, --print`: "Print response and exit (useful for pipes)"
- `-c, --continue`: continue the most recent conversation in the current directory
- `-r, --resume [value]`: resume by session ID, or open an interactive picker

Interactive is the default; headless is opt-in — and headless stacks a whole group of options that only apply there (`--output-format`, `--max-turns`).

### Codex: the usage string is the manifesto

Codex uses clap, and its root usage reads `codex [OPTIONS] [PROMPT]` alongside `codex [OPTIONS] <COMMAND> [ARGS]` (`codex/codex-rs/cli/src/main.rs`, `MultitoolCli`). In the subcommand table:

- `Exec(ExecCli)` carries visible alias `"e"` — "Run Codex non-interactively"
- `Resume(ResumeCommand)` and `Fork(ForkCommand)` are first-class commands
- `Cli` in `codex-rs/exec/src/cli.rs` accepts a `[PROMPT]` positional, falling back to stdin when absent
- Directory switching uses `-C/--cd` (`SharedCliOptions` in `codex-rs/utils/cli/src/shared_options.rs`) — direct descent from `git -C` and `tar -C`

### Pi: hand-written parser, identical vocabulary

Pi skips frameworks and parses args itself, but the conventions align fully: `--print/-p`, `--continue/-c`, `--resume/-r` all live in `parseArgs` at `pi-mono/packages/coding-agent/src/cli/args.ts`; everything after `--` goes into the `messages` positional. Modes split into `modes/interactive` (TUI) and `modes/print-mode.ts` (non-interactive) — interactive and headless are two modes of one tree, not two programs.

### OMP: a fork inherits ergonomics too

OMP is a fork of Pi, and the parse logic in `oh-my-pi/packages/coding-agent/src/cli/args.ts` keeps `--print/-p`. That fact is itself part of the argument: even when forking someone else's project, the CLI surface is the last thing you need to touch — because it was already right.

### OpenCode: bare command opens the TUI; run is non-interactive

In OpenCode's yargs definition, the default command (`$0`) is `$0 [project]` from `cmd/tui.ts` — typing `opencode` drops you into the TUI. The non-interactive path is `RunCommand` in `cmd/run.ts`: `"run [message..]"`, where message is an array-typed positional and models take `-m provider/model`. Notably, within the `run` subcommand `-p` is given to `--password` (for attaching to a remote server) — subcommands may own local vocabulary, but the root-level convention stays clear.

### The Converged Shared Vocabulary

| Convention | Claude Code | Codex | Pi | OMP | OpenCode |
|------|-------------|-------|----|----|----------|
| positional prompt | ✓ | ✓ | ✓ | ✓ | ✓ |
| interactive by default | ✓ | ✓ | ✓ | ✓ | ✓ |
| `-p` = print/headless | ✓ | (exec) | ✓ | ✓ | unused at root |
| continue/resume | ✓ | ✓ | ✓ | ✓ | `-c`/`-s` |
| `-C/--cd` for directory | (cwd is location) | ✓ | — | — | `--dir` |

Five projects evolving independently converged on the same answers — not coincidence, but forty years of command-line sedimentation.

## rivumi's Choice and Its Differences

rivumi is my own Python coding agent. The M7 stage goal fits in one sentence: make it feel like a daily-driver coding CLI without replacing the loop or weakening safety boundaries (stage doc: rivumi/docs/stages/m7-familiar-cli-ergonomics.md).

The implementation has three layers.

**Layer one: default routing.** Typer's command groups demand a subcommand by default, but rivumi wants `rivumi fix this bug` to just run. So there's a custom `DefaultCommandGroup`: if the first argument isn't a known subcommand, it silently inserts a hidden `chat` command (`DefaultCommandGroup.parse_args` in `src/rivumi/cli.py`). This keeps `rivumi resume` and `rivumi auth` dispatching normally while arbitrary text becomes the initial prompt — the same shape as Codex's usage declaration, implemented in Python.

**Layer two: vocabulary alignment.** `chat()` carries three aliases `--cd/-C/--repo` (`-C` follows Codex/git; `--repo` preserves legacy automation), and `--print/-p` means non-interactive JSON output (the `chat` function in `src/rivumi/cli.py`). `exec` aliases `run`; both are the headless path. `resume` is a first-class command defaulting to `"last"`, matching Claude Code's `-c` mental model. Historically `-p` once meant provider; M7 deliberately changed it and left a migration error message — because Claude Code and Pi users expect `-p` to mean print.

**Layer three: config holds no secrets.** `rivumi config` stores only three non-secret fields: `provider`, `model`, and `api_url` (`CliConfig` in `src/rivumi/cli_config.py`), with an `extra="forbid"` schema, atomic writes, mode 0600; API keys always come from environment variables or credential stores. Convenience must not trade away safety: what gets saved is typing, not approval.

Just as worth recording is what rivumi deliberately does **not** do: no full-screen TUI, no slash commands, no fuzzy spelling correction — mistype a subcommand and that word becomes a prompt, following Codex's logic. Each omission is a conscious trade-off, not missing work.

## Engineering / UX Evidence

- **Consistency and standards**: Nielsen Norman Group lists "follow platform conventions" as the fourth of ten usability heuristics — user time belongs to the task, not your interface ([Consistency and Standards](https://www.nngroup.com/articles/consistency-and-standards/)).
- **The CLI conventions compendium**: [clig.dev](https://clig.dev/) (Command Line Interface Guidelines) systematically covers exit codes, stdin/stdout, flag naming; all five projects' behavior maps onto it.
- **The POSIX lineage of directory switching**: from `git -C` and `tar -C` to Codex's `-C/--cd`, the same letter serving the same mental model for three decades.
- **The projects' own docs** corroborate: Claude Code's [CLI reference](https://docs.claude.com/en/docs/claude-code/cli-reference) documents the semantics of `-p`, `--continue`, and `--resume`; the [Codex CLI docs](https://developers.openai.com/codex/cli/) and [OpenCode docs](https://opencode.ai/docs/) likewise position `exec`/`run` as the non-interactive paths.

Worth emphasizing: these conventions aren't aesthetic preferences. For agentic CLIs, whether `-p` means print directly determines whether a one-line CI script runs — the interface *is* the API.

## Improvement Roadmap

rivumi already scores on "looks familiar." Three directions come next:

1. **Add continue**: today there's only `resume [session]`; a no-argument "continue most recent session" path would align with Claude Code's `-c`.
2. **Session picker**: both Claude Code's and Codex's resume ship an interactive picker by default; rivumi only accepts an ID or `last`.
3. **Fork semantics**: Codex's `Fork` and Claude Code's `--fork-session` show that branching a new thread off an old session is now an expected capability, but rivumi's stage doc deliberately defers it — mutating durable tasks needs a protocol decision, not parser sugar.

The most honest test of CLI ergonomics: find someone who uses Claude Code or Codex daily and have them type at your tool with zero documentation. Their fingers will tell you the answer.

## References

- [Nielsen Norman Group — Consistency and Standards](https://www.nngroup.com/articles/consistency-and-standards/)
- [Command Line Interface Guidelines (clig.dev)](https://clig.dev/)
- [Claude Code CLI reference](https://docs.claude.com/en/docs/claude-code/cli-reference)
- [OpenAI Codex CLI](https://developers.openai.com/codex/cli/)
- [OpenCode documentation](https://opencode.ai/docs/)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono) (source evidence: packages/coding-agent/src/cli/args.ts)
- [openai/codex](https://github.com/openai/codex) (source evidence: codex-rs/cli/src/main.rs, codex-rs/exec/src/cli.rs)
- [sst/opencode](https://github.com/sst/opencode) (source evidence: packages/opencode/src/index.ts, src/cli/cmd/run.ts)
