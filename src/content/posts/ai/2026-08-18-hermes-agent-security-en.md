---
title: "The Hermes Agent Security Model: There's a Floor Below --yolo That You Can't Remove"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, security, approvals, prompt-injection, ssrf, sandbox]
lang: en
series:
  name: "Hermes Agent Documentation Guide"
  order: 9
tldr: "Approvals default to smart mode: an auxiliary model waves through low-risk commands, auto-denies genuinely dangerous ones, and escalates the uncertain cases to you. Neither `--yolo` nor `approvals.mode: off` can disable the hardline blocklist (`rm -rf /`, fork bombs, `dd` to a physical disk), and `approvals.deny` is its user-editable counterpart, evaluated before yolo. Upstream is explicit that the threat model is an honest-but-wrong agent, not an adversarial process."
description: "A full pass over the Hermes Agent security model: the three approval modes, the hardline blocklist and deny rules, file-write protection and HERMES_WRITE_SAFE_ROOT, SSRF and website blocking, Tirith scanning, context-file prompt-injection protection, and checkpoint rollback."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-hermes-agent-security)

Post 9 in the series. [Start with the opener](/en/posts/ai/2026-08-18-hermes-agent-intro).

For an agent that runs commands, writes files, browses the web, and answers messaging platforms, the security model isn't a feature — it's the precondition for using it at all. Hermes covers this layer more thoroughly than most, and more usefully, **upstream states what it protects against and what it doesn't**.

## Three approval modes

```yaml
approvals:
  mode: smart              # smart | manual | off
  timeout: 300             # no answer → denied (fail-closed)
  cron_mode: deny          # behavior for scheduled runs
  single_query_mode: deny  # behavior for one-shot -q sessions
```

| Mode | Behavior |
|---|---|
| `smart` (default) | An auxiliary LLM assesses risk: low-risk commands (e.g. `python -c "print('hello')"`) are auto-approved **for that command only**, genuinely dangerous ones are auto-denied, and uncertain cases escalate to a manual prompt |
| `manual` | Always prompt on dangerous commands |
| `off` | No checks at all — equivalent to `--yolo` |

Note the defaults for `cron_mode` and `single_query_mode`: **headless contexts default to `deny`** — a scheduled job or a `-q` query that hits a dangerous command is blocked so the agent has to find another path, rather than auto-approved. It's the same posture as the `blocked_config` behavior from [the gateway post](/en/posts/ai/2026-08-18-hermes-agent-gateway-cron): **when nobody is watching, the default is not to act.**

The 300-second approval timeout is fail-closed too: no answer means denied.

The interactive CLI offers four choices — `once`, `session` (this pattern for the rest of the session), `always` (written into the permanent allowlist in `config.yaml`), and `deny` (default). On messaging platforms you reply yes or no.

## The floor below `--yolo`

YOLO mode activates via `hermes --yolo`, the `/yolo` toggle, or `HERMES_YOLO_MODE=1`. While active the UI carries two persistent reminders — a red banner at session start and a `⚠ YOLO` fragment in the status bar. That detail matters: **a dangerous mode must stay visible.**

But YOLO has a floor. The **hardline blocklist** trips before the approval layer even sees a command, with no override flag anywhere:

| Pattern | Why it's hardline |
|---|---|
| `rm -rf /` and obvious variants | Wipes the filesystem root |
| `rm -rf --no-preserve-root /` | The explicit "yes I mean root" version |
| `:(){ :\|:& };:` | Bash fork bomb; pegs the host until reboot |
| `mkfs.*` on a mounted root device | Formats the live system |
| `dd if=/dev/zero of=/dev/sd*` | Zeroes a physical disk |
| Piping untrusted URLs to `sh` | An RCE surface too broad to handle by approval |

It sits above `--yolo`, above `approvals.mode: off`, above cron's headless `approve` mode, and above a user who clicked "allow always." Upstream's advice is pragmatic: **if a legitimate workflow genuinely needs one of these — say you operate a wipe-and-reinstall pipeline — run it outside the agent.**

`approvals.deny` is the user-editable counterpart, also evaluated before yolo:

```yaml
approvals:
  deny:
    - "git push --force*"
    - "*curl*|*sh*"
    - "dd if=* of=/dev/*"
```

Patterns are case-insensitive fnmatch globs matched against **the same normalized, deobfuscated command variants** the dangerous-pattern detector uses, so quoting tricks like `git pu""sh --force` don't slip past. This makes "let the agent do everything except these specific things, ever" a configurable policy — the best-designed cell in the whole approval system, in my view.

Two limits to remember. **Deny rules only apply to host-reaching backends** (local, SSH, host-mounted Docker); isolated container backends skip the guard stack entirely. And upstream's threat-model note deserves to be copied verbatim by everyone building this kind of system:

> Deny rules are a guardrail against an honest-but-wrong agent… They are not a sandbox against a deliberately adversarial process — for that, use an isolated backend (Docker, Modal) or an egress-restricted environment.

## Mining your own approval history

`hermes approvals suggest` scans the session database for dangerous-classified commands you actually approved, aggregates them into patterns, and ranks by frequency ("`git push *` — approved 14x").

Three safety rules keep the feature from backfiring: **nothing is ever applied automatically** (an explicit `--apply 1,3` is required); **destructive classes are never proposed** no matter how often approved — recursive deletes, `sudo`, disk writes, credential and system-config edits, pipe-to-shell, SQL DROP, process kills, and every hardline class, with the docs noting that `rm -rf build/` approved a hundred times still never yields an `rm` entry; and anything already covered by your allowlist is skipped.

## File writes: blocked outright, no prompt

Before `write_file` or `patch` touches disk, the target is checked against a denylist. **Blocked writes return an error immediately — no approval prompt, and no way to override from the chat UI.** Always-blocked categories:

- OS credentials: `~/.ssh/` (keys, `authorized_keys`), `~/.aws/`, `~/.kube/`, `/etc/sudoers`, `~/.netrc`
- Hermes credentials: `auth.json`, `.env`, `.anthropic_oauth.json`, `mcp-tokens/`, `pairing/` under HERMES_HOME
- Project secrets: `.env`, `.env.local`, `.env.production`, `.envrc` anywhere on disk

One well-reasoned exception: **`~/.ssh/config` is approval-gated rather than hard-blocked**, since the client config holds no private-key material and editing host aliases or `ProxyJump` is routine work. It can still carry `ProxyCommand` directives that execute commands, so the write is never silent, and non-interactive callers fail closed.

`HERMES_WRITE_SAFE_ROOT` is the optional sandbox, restricting writes to given prefixes. Heed the warning: **don't casually add it to `~/.hermes/.env`** — point it at a project directory and the agent can no longer write `~/.hermes/cron/jobs.json` or profile skills. Use `:` to allow both.

And the most honest paragraph in the whole security page:

> Write guards apply to `write_file` and `patch` only. The `terminal` tool runs as the same OS user and can still `cat` or overwrite denied paths via shell commands.

**Write protection prevents accidents, not malice.** Under the same OS user, a shell always routes around it. The only real boundary is an [isolated backend](/en/posts/ai/2026-08-18-hermes-agent-terminal-backends).

There's also a useful display feature: `display.file_mutation_verifier` (on by default) appends a file-mutation footer to each turn, and the docs say plainly that when the model claims an edit succeeded and the verifier disagrees, **trust the verifier**. That's a direct answer to models reporting false success.

## The network side: SSRF and website blocking

Every URL-capable tool — web search, web extract, vision, browser — validates URLs first. Blocked: private ranges (RFC 1918), loopback, link-local (**including the cloud metadata endpoint at `169.254.169.254`**), CGNAT/RFC 6598 (common for Tailscale and WireGuard), and cloud metadata hostnames like `metadata.google.internal`. DNS failures count as blocked (fail-closed), and **redirect chains are re-validated at every hop** so transparent redirects can't bypass it.

Home networks and LAN-only Ollama endpoints have a global opt-out for legitimate private access, and in the other direction `security.website_blocklist` blocks internal services and admin panels across `web_search`, `web_extract`, `browser_navigate`, and every URL-capable tool at once.

## Two content-level scanners

**Tirith** (`security.tirith_enabled`, on by default) scans command content before execution for what pattern matching misses: homograph URL spoofing, pipe-to-interpreter patterns (`curl | bash`), and terminal injection attacks. It auto-installs from GitHub releases with SHA-256 verification (plus cosign provenance when available). `tirith_fail_open: true` is the default — commands proceed if it's missing or times out — and high-security environments should set it to `false`. Windows has no prebuilt binary and silently skips it (pattern matching still runs), so use WSL if you need it.

**Context-file injection protection** scans `AGENTS.md`, `.cursorrules`, and `SOUL.md` for instructions to ignore prior instructions, suspicious keywords hidden in HTML comments, attempts to read `.env` / `credentials` / `.netrc`, credential exfiltration via `curl`, and invisible Unicode (zero-width spaces, bidirectional overrides). A hit blocks the whole file with a `[BLOCKED: …]` notice.

That one matters enormously in the "clone a repo and run the agent" workflow — **the `AGENTS.md` in that repo is text someone else wrote, and it goes into your system prompt.** The same scanning applies to [memory entries](/en/posts/ai/2026-08-18-hermes-agent-memory-skills), for the same reason.

## Checkpoints: opt-in since v2

Automatic snapshots and `/rollback` are now **off by default**, because — in upstream's own words — most users never use `/rollback` and the shadow-store storage is non-trivial over time. Enable per session with `hermes chat --checkpoints` or globally with `checkpoints.enabled: true`.

The mechanism is worth a look: a single shared **shadow git repository** under `~/.hermes/checkpoints/store/` that **never touches your project's real `.git`**, shared across all projects so git's content-addressable object store deduplicates across projects and turns. Snapshots trigger before `write_file`/`patch` and destructive terminal commands (`rm`, `mv`, `sed -i`, `dd`, output redirects, `git reset/clean/checkout`), at **most one per directory per turn**.

`/rollback <N>` **preserves your hand-edits** by default; `--all` overwrites them too. You can preview with `/rollback diff <N>` or restore a single file with `/rollback <N> <file>`.

## How to configure this layer

Set the strength by who's watching:

- **Local, interactive, you're present**: defaults are fine (smart approvals, local backend), plus a few `approvals.deny` entries for things you never want to see.
- **Resident on messaging platforms**: turn on [write approval for memory and skills](/en/posts/ai/2026-08-18-hermes-agent-memory-skills), move to the Docker backend (remembering that this disables dangerous-command approval and makes the container the boundary), and block your internal network with `website_blocklist`.
- **Fully unattended**: keep `cron_mode: deny`, set `tirith_fail_open: false`, tighten `HERMES_WRITE_SAFE_ROOT`, and treat an isolated backend as mandatory.

Last in the series: [migrating from OpenClaw](/en/posts/ai/2026-08-18-hermes-agent-openclaw-migration).

## References

- [Hermes Agent — Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)
- [Hermes Agent — Checkpoints and /rollback](https://hermes-agent.nousresearch.com/docs/user-guide/checkpoints-and-rollback)
- [Hermes Agent — Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)
- [tirith — command content security scanning](https://github.com/sheeki03/tirith)
- [OWASP — Server-Side Request Forgery](https://owasp.org/www-community/attacks/Server_Side_Request_Forgery)
