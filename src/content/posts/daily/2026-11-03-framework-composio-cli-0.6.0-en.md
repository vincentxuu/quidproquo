---
title: "Framework Update: Composio CLI 0.6.0"
date: 2026-11-03
category: daily
type: digest
tags: [ai-agent, framework, daily, composio]
lang: en
description: "Composio CLI 0.6.0 turns two previously implicit behaviors — what happens when a run is interrupted, and which account gets picked in a multi-account setup — into explicit contracts scripts can depend on"
tldr: "Three things in Composio CLI 0.6.0: (1) Breaking: SIGINT/SIGTERM/SIGHUP now map to explicit exit codes (130/143/129) instead of being treated as a clean finish; (2) Breaking: linking a developer account now requires a resolvable project and acting user, or the command fails outright; (3) Breaking: when a toolkit has multiple connected accounts and no default alias, the CLI no longer silently picks the newest one — you must specify it."
series:
  name: "AI Framework Changelog"
  order: 60
---

> 🌏 [中文版](/posts/daily/2026-11-03-framework-composio-cli-0.6.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Composio |
| Version | CLI v0.6.0 |
| Previous version | CLI v0.5.0 |
| Release date | 2026-11-01 |
| Release Notes | [CLI @composio/cli@0.6.0](https://github.com/ComposioHQ/composio/releases/tag/%40composio%2Fcli%400.6.0) |
| GitHub | [ComposioHQ/composio](https://github.com/ComposioHQ/composio) |
| Stars | 31k |

## Why this version matters

Composio is the CLI/SDK that lets agents connect to 200+ external tool integrations, and this release turns two previously implicit behaviors into explicit contracts. Before this, interrupting a running composio command — Ctrl+C, or being killed by a wrapper script after a timeout — didn't clearly tell the caller whether the user cancelled on purpose or the run actually finished, so automation scripts wrapping composio had to guess. This release maps the three interruption signals to fixed exit codes, so scripts can branch on them explicitly. The other fix targets multi-account setups: commands used to quietly default to the most recently created account when none was marked default. For agents that operate across several connected accounts at once, that was a risk that never raised an error — it just silently connected to the wrong account.

## Key Changes

- **Interruption signals map to explicit exit codes**: SIGINT/SIGTERM/SIGHUP now map to 130/143/129 respectively, and `run` forwards signals to its child process group while preserving the child's actual outcome → CI/agent scripts can branch on the exit code to tell "user cancelled" apart from "finished normally," instead of guessing whether an interruption counts as a failure
- **Developer commands resolve acting user/project consistently**: `dev connected-accounts link` always uses the developer project, root `link` keeps its consumer-project behavior, and commands now reject shared flags they can't honor → command semantics in multi-account/multi-project setups are no longer ambiguous
- **`--fail-fast` for listeners**: `listen` and `dev triggers listen` add `--fail-fast`, letting a sink failure abort immediately instead of being swallowed and continued → a long-running webhook/trigger listener can now plug into an existing "fail loudly" alerting setup
- **Connection listings fill in missing fields**: `connections list` now includes account IDs, aliases, and provider display names → scripts parsing the output no longer need a second API call to backfill those fields
- **Other fixes**: toolkit filters now correctly match slugs containing underscores, local file uploads keep their original MIME type, and proxy calls enforce consumer permission checks → several small bugs that used to be papered over by edge-case behavior are now explicit rules

## Breaking Changes

- Interruption signals now report explicit exit codes (SIGINT→130, SIGTERM→143, SIGHUP→129) instead of being treated as a clean finish:
  - Impact: any script that treated a composio CLI interruption as a successful completion (e.g. judging success even after killing the process on timeout) needs to recognize the new exit codes instead
- Linking a developer account now requires a resolvable developer project and acting user:
  - Impact: scripts that call `dev connected-accounts link` without first initializing the working directory or explicitly selecting a project will now fail outright, and need to initialize or specify a project first
- When a toolkit has multiple connected accounts and no `default` alias, the CLI no longer silently picks the most recently created one:
  - Impact: multi-account calls that relied on composio guessing an account now need to pass `--account <id|alias>` explicitly, or set a default alias on one of the accounts first

## Migration Guide

### Upgrading from 0.5.0 to 0.6.0

```bash
curl -fsSL https://composio.dev/install | sh
composio upgrade
composio --version
```

```bash
# If your script treated Ctrl+C as a failure, read the new signal exit codes instead
# 130 = SIGINT, 143 = SIGTERM, 129 = SIGHUP
composio run my-flow
if [ $? -eq 130 ]; then
  echo "cancelled by user, not a real failure"
fi

# In multi-account setups, specify the account explicitly instead of relying on the implicit "newest account"
composio dev connected-accounts link --account my-prod-account
```

Everything else is additive or a behavior fix — scripts that don't hit the three scenarios above keep working without any code changes.

## Comparison with other frameworks

A few days earlier (2026-10-29), Agno's v3.1.12 wired agents' own permission requests into AgentOS's existing Approval UI, letting a run pause into a persistable `PAUSED` state while waiting for a human to approve it — a fix at the agent-execution layer, deciding whether to keep running at all. Composio's fix here isn't about the agent's decision loop; it's two layers deeper, in the tool-integration layer — whose connection identity a call runs as, and whether an interruption counts as normal. Both are closing gaps that show up when an agent runs long and across multiple accounts or tools, just at different layers: one at agent execution, the other at the integration layer an agent calls out to.

## Today's Takeaway

I used to think a CLI being interrupted with Ctrl+C was an edge case not worth designing carefully for. Seeing Composio map three signals to fixed exit codes in this release made it clear why that assumption breaks down: once a CLI gets called from inside any automation or agent script, "what happened when it got interrupted" isn't an edge case — it's the core contract a script relies on to judge whether a run actually succeeded. The other fix in this release, no longer defaulting to "the newest account" in multi-account setups, is the same kind of problem: a human operating the CLI by hand would barely notice it, but an agent running across accounts silently connecting to the wrong one is more dangerous than an outright error.

## References

- [Composio CLI 0.6.0 Release Notes](https://github.com/ComposioHQ/composio/releases/tag/%40composio%2Fcli%400.6.0)
- [ComposioHQ/composio GitHub](https://github.com/ComposioHQ/composio)
- [Full Changelog: CLI 0.5.0...0.6.0](https://github.com/ComposioHQ/composio/compare/%40composio%2Fcli%400.5.0...%40composio%2Fcli%400.6.0)
- [Agno v3.1.12 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.12)
