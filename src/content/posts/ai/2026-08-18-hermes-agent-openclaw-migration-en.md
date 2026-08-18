---
title: "Migrating From OpenClaw to Hermes Agent: What Moves, What Doesn't, and the Archive Directory"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, openclaw, migration, claude-code, codex]
lang: en
series:
  name: "Hermes Agent Documentation Guide"
  order: 10
tldr: "`hermes claw migrate` imports persona, memory, skills from four locations, model and provider config, platform tokens, and the approval allowlist — but secrets are never imported silently, and even `--preset full` requires an explicit `--migrate-secrets`. What can't move (cron jobs, plugins, hooks, the multi-agent list, deep channel config) isn't discarded but parked in `~/.hermes/migration/openclaw/<timestamp>/archive/` for manual work. Coming from Claude Code or Codex is a different command: `hermes import-agent`."
description: "A complete mapping of the OpenClaw to Hermes Agent migration: config key translations, the four skill sources, four-tier API key resolution, the three SecretRef formats, the archive list, and the eight-step post-migration checklist."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-hermes-agent-openclaw-migration)

Post 10, the last in the series. [Start with the opener](/en/posts/ai/2026-08-18-hermes-agent-intro).

Restating the correction from [the opener](/en/posts/ai/2026-08-18-hermes-agent-intro): **Hermes is not OpenClaw's successor.** They are separate projects by separate teams and OpenClaw continues on its own path. `hermes claw migrate` is a one-way move, not a merger. For OpenClaw itself, this site has a [full documentation series](/en/posts/ai/2026-03-28-openclaw-overview).

## Three commands, one principle

```bash
hermes claw migrate                              # always previews, then asks
hermes claw migrate --dry-run                    # preview only
hermes claw migrate --preset full --migrate-secrets --yes   # keys included, no prompt
```

The source defaults to `~/.openclaw/`, with automatic detection of the legacy `~/.clawdbot/` and `~/.moltbot/` directories (and the legacy `clawdbot.json` / `moltbot.json` filenames).

The principle running through it is **preview first**: the full plan prints before anything is written. In the same spirit, a restore point is written by default to `~/.hermes/backups/pre-migration-*.zip` (disable with `--no-backup`, restore with `hermes import`). Conflicts default to **refusing to apply** rather than overwriting; `--overwrite` is explicit, and skills have their own `--skill-conflict skip|overwrite|rename`.

The rule most worth remembering: **no preset imports secrets silently.** Not even `--preset full` — API keys require an explicit `--migrate-secrets`. That's the right design, because "bring everything across" and "copy my API keys into another tool's .env" are decisions of different character and shouldn't share a flag.

## What moves

**Persona and memory.** `SOUL.md` is copied directly. `MEMORY.md` and `USER.md` are **parsed into entries, merged with what you already have, and deduplicated** (using the `§` delimiter) rather than overwritten. Daily memory files under `workspace/memory/*.md` all fold into the main memory. `AGENTS.md` only lands if you pass `--workspace-target`.

Workspace paths fall back to `workspace.default/` and `workspace-main/`, because OpenClaw renamed `workspace/` to `workspace-main/` recently and uses `workspace-{agentId}` for multi-agent setups.

**Skills come from four sources**, all landing in `~/.hermes/skills/openclaw-imports/`: workspace skills, shared skills in `~/.openclaw/skills/`, cross-project personal skills in `~/.agents/skills/`, and project-shared skills in `workspace/.agents/skills/`. **All four are scanned** — more thorough than most migration tools.

**The config key mapping** is the most valuable part of that doc, because it doubles as a concept dictionary between the two systems. A few interesting rows:

| OpenClaw | Hermes | Conversion |
|---|---|---|
| `agents.defaults.timeoutSeconds` | `agent.max_turns` | **`timeoutSeconds / 10`, capped at 200** |
| `agents.defaults.thinkingDefault` | `agent.reasoning_effort` | always/high/xhigh → high; auto/medium/adaptive → medium; off/low/none/minimal → low |
| `agents.defaults.compaction.mode` | `compression.enabled` | off → false, anything else → true |
| `approvals.exec.mode` | `approvals.mode` | **auto → off**, always → manual, smart → smart |
| `exec-approvals.json` | `command_allowlist` | Patterns merged and deduped |

That first row deserves attention: **the two systems have fundamentally different resource models** — one counts seconds, the other counts turns — so `timeoutSeconds / 10` is an estimate, not an equivalence. Check `agent.max_turns` after migrating.

Read the last row carefully too: OpenClaw's "auto" maps to **approvals off** in Hermes semantics. If you assume approvals are still guarding you post-migration, they aren't — set it back to `smart` per [the security post](/en/posts/ai/2026-08-18-hermes-agent-security).

MCP servers (including `tools.include`/`exclude` filters), TTS settings (searched across three possible locations in priority order), browser CDP config, session-reset policy, timezone, and human delay all have mappings.

**Platform tokens and allowlists** land in `~/.hermes/.env`: Telegram, Discord, Slack, Signal, Matrix, and Mattermost all support both flat and accounts layouts, and `allowFrom[]` arrays become comma-joined `*_ALLOWED_USERS`. **WhatsApp is the exception** — it uses Baileys QR pairing rather than a token, so you re-pair with `hermes whatsapp` afterward.

## Key resolution and SecretRefs

With `--migrate-secrets` on, keys are collected from four sources in priority order: `models.providers.*.apiKey` in `openclaw.json` → `~/.openclaw/.env` → the `env` sub-object in `openclaw.json` → `agents/main/agent/auth-profiles.json`. Earlier sources win; later ones fill gaps.

Targets are also allowlisted: `OPENROUTER_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `DEEPSEEK_API_KEY`, `GEMINI_API_KEY`, `ZAI_API_KEY`, `MINIMAX_API_KEY`, `ELEVENLABS_API_KEY`, `TELEGRAM_BOT_TOKEN`, `VOICE_TOOLS_OPENAI_KEY`. **Keys outside that list are never copied** — more conservative than "move everything," and correctly so.

OpenClaw tokens come in three shapes: plain strings, environment templates like `${TELEGRAM_BOT_TOKEN}`, and SecretRef objects. The first two and `source: "env"` SecretRefs resolve automatically; **`source: "file"` and `source: "exec"` do not** — the migration warns and you add them yourself via `hermes config set`. This is the category most likely to surface as a breakage days later.

## What doesn't move: everything goes to the archive

Anything without a direct equivalent isn't dropped — it's saved to `~/.hermes/migration/openclaw/<timestamp>/archive/` for manual attention:

| Item | How to rebuild in Hermes |
|---|---|
| `IDENTITY.md` | Merge into `SOUL.md` |
| `TOOLS.md` | Not needed; Hermes has built-in tool instructions |
| `HEARTBEAT.md` | Use cron jobs |
| `BOOTSTRAP.md` | Use context files or skills |
| **Cron jobs** | Recreate with `hermes cron create` |
| **Plugins / hooks / webhooks** | Rewrite as Hermes plugins and gateway hooks |
| Memory backend config | `hermes honcho` |
| **Multi-agent list** | Use Hermes profiles |
| Channel bindings and deep channel config | Manual per-platform setup |

The bolded rows carry the real work. **Cron jobs in particular don't migrate** — if you have a whole schedule running on OpenClaw, that's the bulk of the migration cost, and until you rebuild them they simply don't run, silently. Converting a multi-agent setup to profiles is a conceptual refactor, not a copy.

## The eight-step post-migration checklist

Upstream's list, worth following literally:

1. Read the migration report (migrated, skipped, conflicting counts)
2. Review the archive directory — everything there needs a human
3. **Start a new session** — imported skills and memory don't affect the current one
4. `hermes status` to check provider authentication
5. Restart the gateway if you migrated platform tokens
6. `hermes config show` and verify `session_reset` matches your expectations
7. Re-pair WhatsApp with `hermes whatsapp`
8. Once everything works, run `hermes claw cleanup` to rename leftover OpenClaw directories to `.pre-migration/` and **prevent two sets of state from coexisting**

Step 8 is the one most likely to be skipped and the most annoying to skip: two agent systems pointing at similar state directories makes it very hard to tell who wrote what when something goes wrong.

## Coming from Claude Code or Codex is a different command

Not `claw migrate` but `hermes import-agent`, which auto-detects `~/.claude` or `~/.codex`:

| Claude Code | Hermes |
|---|---|
| `CLAUDE.md` | Split into `MEMORY.md` entries |
| `settings.json` `permissions.allow` (`Bash(...)`) | `command_allowlist` |
| `settings.json` `permissions.deny` (`Bash(...)`) | **`approvals.deny`** |
| `mcpServers` in `~/.claude.json` | `mcp_servers` |
| `skills/<name>/` | `~/.hermes/skills/claude-code-imports/` |
| `commands/*.md` | **Skipped**, with a note to convert them into skills |

Prefix rules like `Bash(npm run test:*)` become `npm run test*` globs, while non-`Bash` permission rules (`Read(...)`, `WebFetch`, …) gate Claude-specific tools and are reported as unmapped rather than force-translated.

On the Codex side, `AGENTS.md` and `memories/*.md` become memory entries, `[mcp_servers.*]` in `config.toml` becomes `mcp_servers`, and skills land in `codex-imports/`.

One shared rule worth memorizing: **credentials are never imported.** `~/.claude/.credentials.json` and `~/.codex/auth.json` are never read, and MCP environment variables or headers with secret-looking names (`*_TOKEN`, `*_API_KEY`, `Authorization`, …) are stripped and listed in the report so you re-add them deliberately.

## Closing the series

Ten posts, compressed to three sentences:

1. **Hermes's differentiator is the learning loop, and the cost of a learning loop is reproducibility** — `write_approval` is where you buy predictability back.
2. **Its defaults mostly sit on the conservative side** (deny-all gateway, cron that stops when misconfigured, plugins that don't run unless named, a hardline blocklist you can't remove), which is what makes running it resident defensible.
3. **Lists rot; judgments don't** — providers, tool counts, and model IDs change monthly, so the things worth retaining are structural: which balance a subscription draws from, that files left in a sandbox don't come back, and that switching to an isolated backend removes human approval.

Every fact in this series was checked against the upstream docs as of August 2026. For precise, current details, treat the [official documentation](https://hermes-agent.nousresearch.com/docs/) as authoritative.

## References

- [Hermes Agent — Migrate from OpenClaw](https://hermes-agent.nousresearch.com/docs/guides/migrate-from-openclaw)
- [Hermes Agent — Import from Other Agents](https://hermes-agent.nousresearch.com/docs/user-guide/import-from-other-agents)
- [Hermes Agent documentation](https://hermes-agent.nousresearch.com/docs/)
- [Hermes Agent on GitHub](https://github.com/NousResearch/hermes-agent)
- [On this site: the OpenClaw documentation series](/en/posts/ai/2026-03-28-openclaw-overview)
