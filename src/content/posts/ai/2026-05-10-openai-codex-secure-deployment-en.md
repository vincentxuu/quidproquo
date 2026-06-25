---
title: "OpenAI's Codex Secure Deployment Strategy: Sandboxing, Auto-review, and Enterprise Governance"
date: 2026-05-10
category: ai
tags: [openai, codex, ai-agent, security, sandbox, enterprise]
lang: en
tldr: "In May 2026, OpenAI published its internal Codex deployment practices: sandboxes define technical boundaries, approval policies determine when to pause, Auto-review delegates approval decisions to a sub-agent instead of a human, and Managed configuration lets enterprise admins enforce policies top-down. The core philosophy: zero friction for low-risk actions, mandatory review for high-risk ones."
description: "OpenAI's complete framework for deploying Codex securely — covering sandbox modes, approval policies, Auto-review, network policies, and enterprise Managed configuration."
draft: false
---

🌏 [中文版](/posts/ai/2026-05-10-openai-codex-secure-deployment)

On May 8, 2026, OpenAI published [Running Codex safely at OpenAI](https://openai.com/index/running-codex-safely/), detailing how they deploy Codex — their AI coding agent — internally. The focus isn't on how capable Codex is at writing code. It's about how, when an agent can autonomously read files, execute commands, and operate developer tooling, an enterprise can draw boundaries, maintain audit trails, and navigate the trade-off between productivity and security. This article is best read as a reference governance framework for bringing AI agents into enterprise environments.

## Core Philosophy: Produce Within Boundaries, Stop at the Edge

OpenAI's deployment principle for Codex can be stated in one sentence: operate productively inside a constrained environment — zero friction for routine low-risk actions, mandatory review for high-risk ones.

Two orthogonal concepts underpin this:

- **Sandbox** defines the technical boundary — where Codex can write files, whether it can access the network, which paths are off-limits.
- **Approval policy** defines when to pause and ask a human — for example, when leaving the sandbox, accessing the network, or running untrusted commands.

These two work together: the sandbox is the underlying technical isolation layer; approval is the process-level human intervention point. Conflating these two in any governance discussion leads to policies that are either too strict (everything requires approval) or too loose (sandbox is open but nothing is reviewed).

## Sandbox Modes: read-only / workspace-write / danger-full-access

Codex uses OS-native sandbox mechanisms locally: Seatbelt on macOS, seccomp + landlock on Linux, and native implementations or WSL2 on Windows. The cloud version runs in isolated containers managed by OpenAI.

Three sandbox modes:

| Mode | Behavior | Use Case |
|------|----------|----------|
| `read-only` | Read only — no writes, no execution | Planning, Q&A, code review |
| `workspace-write` | Read/write within the workspace, run routine commands | Day-to-day development (default) |
| `danger-full-access` | No sandbox at all | Disposable CI containers, VMs |

The default is `workspace-write` with `network_access = false`: Codex can edit files and run `git`, `npm`, and `pytest`, but accessing the external network requires approval. `writable_roots` can further constrain which directories are writable — for example, limiting writes to `~/development` while blocking `node_modules`, `.env`, and `/etc`.

## Approval Policies: untrusted / on-request / never

The approval policy governs when Codex pauses to ask:

- `untrusted`: Only known-safe read operations run automatically; everything else requires approval
- `on-request`: Free movement within the sandbox; pauses only when crossing a boundary (network access, writing outside the sandbox, running untrusted commands)
- `never`: Never asks (suitable for non-interactive CI)

`on-request` is the most common sweet spot: Codex can edit files, run tests, and commit within the workspace — only pausing when installing a new dependency or accessing the network. A refactoring task goes from "hit Allow forty times" to "hit Allow once."

## Auto-review: Replacing Human Approval with a Sub-agent

This is the most interesting part of OpenAI's disclosure. Traditionally, users had two options: manual approval (interrupted at every boundary) or Full Access (hands-off entirely) — with nothing in between. Auto-review fills the middle ground by delegating approval decisions to a separate, independent Codex sub-agent.

According to [data from OpenAI's Alignment team](https://alignment.openai.com/auto-review/):

- In Auto-review mode, the frequency of interruptions to the user is roughly **200× lower** than with manual approval
- Among the small fraction of actions that do require review, Auto-review automatically approves approximately **99%**
- Even when an action is rejected, Codex finds a safer alternative path on its own in more than half of cases

Separation of concerns is key: the primary agent is optimized for completing the user's task and treats approval boundaries as obstacles. The Auto-reviewer has a much narrower job — judging whether a specific boundary-crossing action should be allowed — which makes the policy easier to monitor and iterate on. The Auto-reviewer's prompt is open-source and can be inspected directly.

Configuration:

```toml
# config.toml
approvals_reviewer = "auto_review"
sandbox_workspace_write.writable_roots = ["~/development"]

# requirements.toml (enterprise-enforced)
allowed_sandbox_modes = ["read-only", "workspace-write"]
```

## Network Policy: Off by Default, Allowlisted

Codex has no external network access by default. OpenAI manages this internally with a hosted network policy: known destinations are allowed, unwanted ones are blocked, and unknown domains require approval.

```toml
# requirements.toml
allowed_web_search_modes = ["cached"]

[experimental_network]
enabled = true
allow_local_binding = true
denied_domains = ["pastebin.com"]
allowed_domains = ["login.microsoftonline.com", "*.openai.com"]
```

Blocklisting obvious data-exfiltration channels like `pastebin.com` while only permitting login services and official APIs is a sensible default. In the cloud version, the entire agent phase is offline by default; network access is only permitted during the setup phase for installing dependencies, and any secrets available during setup are purged before the agent phase begins.

## Rules: Fine-grained Prefix-level Command Control

Not all shell commands carry equal risk. Rules let you set `allow`, `prompt`, or `forbidden` for specific command prefixes:

```python
# default.rules
prefix_rule(
    pattern = ["gh", "pr", ["view", "list"]],
    decision = "allow",
    justification = "Allows read-only GitHub PR inspection via gh CLI.",
)
prefix_rule(
    pattern = ["kubectl", ["get", "describe", "logs"]],
    decision = "allow",
    justification = "Allows Kubernetes resource inspection for debugging.",
)
```

Rules use Starlark syntax (Python-like but side-effect-free) and support `match` / `not_match` examples as inline unit tests to guard against misconfigured rules. When multiple rules match, Codex applies the strictest decision (`forbidden` > `prompt` > `allow`).

## Identity, Credentials, and Managed Configuration

Two areas that matter most in enterprise contexts:

**Identity binding**: CLI and MCP OAuth credentials are stored in the OS keyring; login is enforced through ChatGPT and bound to a designated enterprise workspace. All Codex activity appears in the ChatGPT Compliance Logs Platform.

```toml
cli_auth_credentials_store = "keyring"
mcp_oauth_credentials_store = "keyring"
forced_login_method = "chatgpt"
forced_chatgpt_workspace_id = "<workspace-uuid>"
```

**Managed configuration**: Enterprise admins can push a `requirements.toml` that users cannot override. It locks down permitted sandbox modes, approval policies, network behavior, MCP server allowlists, feature flags, and more. Configuration is sourced from three layers: cloud-pulled requirements, macOS managed preferences, and local requirements files — enabling per-team or per-environment policies while maintaining a consistent baseline.

```toml
# requirements.toml
allowed_web_search_modes = ["disabled", "cached"]
allowed_sandbox_modes = ["workspace-write"]
allowed_approval_policies = ["on-request"]
```

When a user tries to set a conflicting value, Codex automatically downgrades to a compatible value and notifies the user, rather than throwing an error.

## Agent-native Telemetry: Logs That Explain the "Why"

Control is only half the picture — visibility is the other half. Traditional security logs can tell you *what happened* (a file was modified, a network connection was attempted), but not *why* (the user's intent, the agent's reasoning context).

Codex supports OpenTelemetry log export, capturing:

- The original user prompt
- Tool approval decisions (who allowed, who denied, and why)
- Tool execution results
- MCP server usage
- Allow/deny events from the network proxy

```toml
[otel]
log_user_prompt = true
environment = "prod"

[otel.exporter.otlp-http]
endpoint = "http://localhost:14318/v1/logs"
protocol = "binary"
```

OpenAI feeds these logs into its own AI security triage agent: when an endpoint alert surfaces a suspicious event, Codex logs supply the original request, tool trace, approval decisions, and network policy context, allowing the triage agent to distinguish between "normal agent behavior," "benign mistakes," and "activity that actually warrants escalation." The same telemetry is also used to track internal adoption, tool usage patterns, and sandbox block frequency as a basis for deployment tuning.

## Overall Architecture

```
┌─────────────────────────────────────────────────────┐
│  Enterprise layer: Managed configuration             │
│  (requirements.toml)                                 │
│  — cloud-enforced / macOS preferences / local file  │
└─────────────────────────────────────────────────────┘
                        │ push
                        ▼
┌─────────────────────────────────────────────────────┐
│  User layer: config.toml + .rules                   │
└─────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
   ┌─────────┐    ┌──────────┐    ┌──────────┐
   │ Sandbox │    │ Approval │    │ Network  │
   │ boundary│    │ when to  │    │  policy  │
   │         │    │ pause    │    │          │
   └─────────┘    └──────────┘    └──────────┘
        │               │               │
        ▼               ▼               ▼
  ┌──────────────────────────────────────┐
  │  Codex Agent (local / cloud)         │
  └──────────────────────────────────────┘
                        │
                        ▼ OTel logs
  ┌──────────────────────────────────────┐
  │  SIEM / Compliance Platform /        │
  │  Security Triage Agent               │
  └──────────────────────────────────────┘
```

## Takeaways

The fundamental trade-off this framework makes is this: by combining **layered defaults + enterprise-enforced overrides + sub-agent approval**, it decouples "AI agent autonomy" and "enterprise governance controllability" into independently tunable knobs. Sandbox, approval policy, Rules, Managed config, and Telemetry each own a distinct layer, each adjustable to the team's risk tolerance, without coupling to the others.

What this means in practice: when you're about to deploy any coding agent inside an enterprise — not just Codex, but Claude Code, Cursor, Devin, or any equivalent — this document provides a concrete policy design template: what to enforce, what to delegate to Auto-review, which actions need audit logs, and which credentials should be bound to the OS keyring. Secure AI agent deployment is no longer a binary question of "give the agent permissions or not" — it's a design question of "how many layers of adjustable control surface to provide."

## References

- [Running Codex safely at OpenAI](https://openai.com/index/running-codex-safely/)
- [Auto-review of agent actions without synchronous human oversight](https://alignment.openai.com/auto-review/)
- [Agent approvals & security – Codex | OpenAI Developers](https://developers.openai.com/codex/agent-approvals-security)
- [Sandbox – Codex | OpenAI Developers](https://developers.openai.com/codex/concepts/sandboxing)
- [Managed configuration – Codex | OpenAI Developers](https://developers.openai.com/codex/enterprise/managed-configuration)
- [Admin Setup – Codex | OpenAI Developers](https://developers.openai.com/codex/enterprise/admin-setup)
- [Configuration Reference – Codex | OpenAI Developers](https://developers.openai.com/codex/config-reference)
- [Rules – Codex | OpenAI Developers](https://developers.openai.com/codex/rules)
- [Addendum to GPT-5.2 System Card: GPT-5.2-Codex](https://deploymentsafety.openai.com/gpt-5-2-codex)
