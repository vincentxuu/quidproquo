---
title: "Seeing What an Agent Did Afterwards: Uber ADR, numbat, Adrian and How Far to Trust the Audit Record"
date: 2026-10-24
category: ai
type: deep-dive
tags: [security, ai-agent, claude-code, observability, guardrails]
lang: en
series:
  name: "AI Agent Security Tooling Map"
  order: 4
tldr: "Detection and audit tools run along a spectrum: the open-source release of Uber ADR reads records purely after the fact, numbat only monitors by default, and for most of the rest the selling point is that they can block before an action, yet they start out observing only. Whether a record can serve as evidence depends on who can change it: when the signing key sits on the same machine and user as the audited agent, tampering can be noticed but not prevented."
description: "How agent detection and audit tools such as Uber ADR, Perplexity numbat, Adrian and Cisco DefenseClaw work, what they do by default and when they fail, why an audit record may not stand as evidence, and what Claude Code itself can provide."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-10-24-agent-detection-audit)

The first three kinds of tool act before or during an action. The fourth answers a different question: once something has happened, how do you know what the agent actually did?

On the [series map](/posts/ai/2026-10-24-ai-agent-security-tooling-map-en), this is detection and audit, covering the "commands the agent runs" entry point. It is about whether you can still see what happened afterwards. If you want to know how these tools differ from [the guardrails in the last post](/posts/ai/2026-10-24-agent-guardrails-hooks-gateways-en), this post is for you. It relies on each project's documentation and papers; nothing was installed or tested.

## Guardrails act before, detection after, and many tools do both

A guardrail only catches the actions you thought of in advance; once an action is let through, it no longer knows what happened next. Detection cannot take an action back, but it can tell you what the guardrail let through and which rule needs adding. A guardrail asks whether this action should happen; detection asks what just happened.

In practice this kind of tool runs along a spectrum.

- Purest after the fact: the open-source release of Uber's [ADR](https://github.com/uber/ADR), which reads the session records an agent leaves behind, offline.
- Watches by default, does not block: Perplexity's [numbat](https://github.com/perplexityai/numbat), whose built-in rules are all in monitoring mode.
- A mix of detection and a pre-action gate: [Adrian](https://github.com/secureagentics/Adrian), Cisco's [DefenseClaw](https://github.com/cisco-ai-defense/defenseclaw), [clawdstrike](https://github.com/backbay-labs/clawdstrike), [failproofai](https://github.com/FailproofAI/failproofai) and [Prismor](https://github.com/PrismorSec/prismor). All five count as observability or audit tools, and the selling point is that they can block before a tool runs. But most start out only observing: Adrian defaults to Audit, DefenseClaw starts in observe on first setup, failproofai enables no policies after install, and Prismor observes everything by default, so you have to switch blocking on yourself. Only clawdstrike describes itself as fail-closed by default.

Take Adrian as an example. According to its [README](https://github.com/secureagentics/Adrian) and [docs](https://docs.adrian.secureagentics.ai/), it analyzes both the agent's activity (tool calls, outputs) and its reasoning traces to judge whether each action strays from what that agent is meant to do. It has Python and TypeScript SDKs and a Claude Code plugin, and you can choose audit-only or block mode in its configuration. That is its own description; there are no third-party accuracy figures.

So with this kind of tool, look at what it actually does and what its defaults are, not at which category it falls under.

## Uber ADR: reading records after the fact

ADR's sensor runs hourly and parses the session records agents leave on your machine, supporting Claude Code (JSONL files under `~/.claude/projects/`), Cursor, Codex and several others, then passes them to detectors.

What you can download is not what Uber runs. The open-source release has no Prevention component, which does the blocking, and the README for the Detection directory (the ADR-Bench and detector evaluation framework) says it is not for production use. Uber also has a pre-prompt hook, mostly regex-based, that blocks before the fact; it is not open source, so "ADR is purely after the fact" holds only for the open-source release.

"Deployed at Uber", and every number below, is the authors' own account in the [MLSys paper](https://arxiv.org/abs/2605.17380) and [slides](https://mlsys.org/media/mlsys-2026/Slides/3853_k9cXWDE.pdf), with no third-party verification. The accuracy figures come from ADR-Bench, where both the tasks and the detector are Uber's: it caught 28 of 42 malicious samples, a recall of about 67% (recall is explained in [post 1](/posts/ai/2026-10-24-skill-mcp-pre-install-scanners-en)). Of the alerts sent to human review after launch, about 49% were labeled false positives by analysts, 34% were true positives, and 17% were real but non-malicious activity such as internal red-teaming.

One part of the slides is worth a solo developer's attention. They say prompt injection was surprisingly rare in Uber's environment, and list several main concerns: secret exfiltration (marked as the most common), destructive commands, data exfiltration, and people not really supervising. The last refers to many people running YOLO mode (skip approvals, auto-run everything) for long stretches without a sandbox, and some approving fifty or more actions in one session, where approval fatigue amounts to no oversight.

## numbat: watches by default, does not block

numbat's built-in rules are all monitoring mode by default. To block, you copy the rule's complete YAML into a directory you control, keep the same id, add `enforce: true` and bump the version; and this works only for synchronous pre-action hooks, since the paths that read records offline cannot block (see its [enforcement doc](https://github.com/perplexityai/numbat/blob/HEAD/docs/enforcement.md)).

Its documentation is explicit: when a rule errors, the program crashes, output fails or the destination for records is unavailable, numbat does not send its deny response and leaves the decision to the host's normal permission flow, which may still prompt or deny. That resembles Claude Code hooks, where the action goes ahead by default when the hook fails; but the last post also showed that the Microsoft Agent Governance Toolkit plugin exits with 2, which blocks, on exceptions inside its scripts. So what happens on failure is something to look up for each tool.

## Can the record serve as evidence

To use an audit record as evidence, first separate two things: tamper-evident (a change leaves a trace) and tamper-proof (it cannot be changed).

Why worry about it? An agent that has been tricked by prompt injection runs as the same user you do; it can read its own records, and so will usually have a chance to change them.

Prismor's local audit trail has a hash chain plus Ed25519 signatures, but its [documentation](https://github.com/PrismorSec/prismor/blob/HEAD/docs/audit-trail.md) says the signing key sits on the same machine and any program running as the same user can read it, so it is tamper-evident, not tamper-proof; it also lists mitigations: an unoverridable rule blocks the agent from touching the audit directory, and you can export a signed checkpoint somewhere the agent cannot reach. clawdstrike gives each verdict an Ed25519-signed receipt, and the hash chain (Spine) belongs to its enterprise deployment; in single-machine mode the key is likewise written locally by `clawdstrike init --keygen`. numbat's default output file belongs to the same operating-system user that runs the agent, and its unsigned case-bundle manifest can prove only internal consistency, not authenticity of origin.

The Microsoft Agent Governance Toolkit from the last post has another limit: its [documentation](https://github.com/microsoft/agent-governance-toolkit/blob/HEAD/docs/LIMITATIONS.md) says the audit trail records what the agent attempted and does not verify whether the action succeeded.

My view is that what matters is not whether there is a hash chain but where the key and the logs live: anywhere the agent's own user can reach, changes cannot be stopped. For a personal development machine, the workable approach is to forward the records in real time to another machine.

For any audit record you are handed, ask two things first. Is the program that writes it running as the same user as the audited agent? Where does the signing key live? If either answer is "same machine, same user", the record can show afterwards that it was changed but cannot prevent the change.

Three more issues, the first two about completeness and the last about privacy. numbat's `hook status` verifies only that the configuration exists, not that the agent loaded or ran the hook, so a broken hook means no record. DefenseClaw's local audit database keeps seven days by default; to keep more you change the setting. Once the LLM judge is turned on (it is off by default), another database by default stores the raw request and response text of each judgment (`retain_judge_bodies` defaults to true), which may contain your secrets.

## What your Claude Code already leaves behind

Claude Code has three kinds of raw material. The first is the session transcript at `~/.claude/projects/<project>/<session>.jsonl`, which records every message, tool call and tool result in plain text and is kept for 30 days by default (`cleanupPeriodDays`). The second is the `prompt_id` in the input a hook receives, matching OpenTelemetry's `prompt.id`, which ties a prompt to the events that follow. The third is OpenTelemetry events, which you have to enable yourself.

Check them with the two questions above. The transcript runs as the same user as the agent, so it is not even tamper-evident: good for looking back yourself, not for evidence. It is also written asynchronously, so reading it live inside a hook may miss the last few entries. OpenTelemetry comes closer to "records out of reach of the monitored user" only if it goes through administrator-level managed settings to a collector on another machine: OTEL variables in a project's `.claude/settings.json` and `.claude/settings.local.json` are ignored, so the repo itself cannot change where data goes. That guards only against project settings; user-level settings and shell environment variables still take effect.

## How to use them

1. **Tonight, look at what your agent has read.** This maps to the biggest problem Uber reports: secret exfiltration. In a terminal, run:

   ```bash
   find ~/.claude/projects -name '*.jsonl' -mtime -7 -print0 \
     | xargs -0 grep -lE '\.ssh/|\.aws/(credentials|config)|/\.env($|[^a-z])'
   ```

   This lists sessions from the last seven days that touched credential paths. The pattern deliberately excludes `process.env` and `.envrc`, but `.env.example` and conversations that merely discuss these paths will still match, so expect some false positives. For a suspicious one, use `grep -n` to find the path and read backwards to see which command or message led the agent to read it. Transcripts are plain text and may contain the secrets themselves, so check that nobody is watching your screen before opening one, and do not paste whole sections into other tools.
2. **If you adopt a detection tool, monitor first and block later.** My suggestion: let it only monitor, look at the output once a week to sort out the false positives, and turn `enforce` on only for the one rule you are sure you want to block, one rule at a time. numbat's built-in rules are already in monitoring mode, so you can follow this rhythm there.
3. **Keep records where the agent cannot change them.** The simplest way is to send Claude Code's OpenTelemetry events to a collector on another machine. Set `CLAUDE_CODE_ENABLE_TELEMETRY=1` and `OTEL_LOGS_EXPORTER=otlp`, and point `OTEL_EXPORTER_OTLP_ENDPOINT` at that machine (check the variable names against the official monitoring page). In a team, have an administrator put this in managed settings so developers cannot change it; on a personal machine without that route, set it at least in your shell or user-level settings, knowing that this does not stop the same user from changing it. A signature made on the same machine under the same user can only show afterwards that something was changed.
4. **Decide first whether to log prompt content.** OpenTelemetry masks prompt content as `<REDACTED>` by default, and tool details and content have to be turned on separately with `OTEL_LOG_USER_PROMPTS`, `OTEL_LOG_TOOL_DETAILS` and `OTEL_LOG_TOOL_CONTENT` (`OTEL_LOG_TOOL_CONTENT` applies only to tracing, currently in beta). Prompts and tool output often hold secrets, so before you turn them on, write down how many days you will keep them and who can read them.
5. **Confirm the hook really runs.** For tools that collect data through a hook, a broken hook means no records. After every change to hook configuration, have the agent run `echo canary-12345`, then search the records for `canary-12345`; if it is not there, the hook is not recording.

## Where this leaves you

Seeing afterwards is a different kind of control from the first three: guardrails block before an action, a sandbox limits the reach, and detection tells you what happened. Tonight, do one thing: follow step 1 above and see whether your own session records show the agent reading credential paths.

Next is post 5, which changes the target from protecting your development environment to auditing the code you write. If you only use agents and do not build products, you can stop here.

## References

- [uber/ADR](https://github.com/uber/ADR)
- [ADR paper (MLSys 2026, arXiv:2605.17380)](https://arxiv.org/abs/2605.17380)
- [ADR slides (MLSys 2026)](https://mlsys.org/media/mlsys-2026/Slides/3853_k9cXWDE.pdf)
- [perplexityai/numbat](https://github.com/perplexityai/numbat)
- [secureagentics/Adrian](https://github.com/secureagentics/Adrian)
- [cisco-ai-defense/defenseclaw](https://github.com/cisco-ai-defense/defenseclaw)
- [backbay-labs/clawdstrike](https://github.com/backbay-labs/clawdstrike)
- [FailproofAI/failproofai](https://github.com/FailproofAI/failproofai)
- [PrismorSec/prismor](https://github.com/PrismorSec/prismor)
- [Claude Code docs: Hooks](https://code.claude.com/docs/en/hooks)
- [Claude Code docs: Monitoring (OpenTelemetry)](https://code.claude.com/docs/en/monitoring-usage)
- [Previous: Checking before an action](/posts/ai/2026-10-24-agent-guardrails-hooks-gateways-en)
