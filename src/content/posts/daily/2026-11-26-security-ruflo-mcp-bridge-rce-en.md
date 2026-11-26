---
title: "Security Alert | Ruflo's MCP Bridge Had Zero-Auth RCE, Letting Attackers Steal Keys and Steer Agent Output Long-Term (CVE-2026-59726)"
date: 2026-11-26
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: en
description: "Security researchers at Noma Security found that the MCP Bridge in the open-source AI agent orchestration platform Ruflo shipped exposed to the network with zero authentication by default. A single HTTP request got shell access inside the container, stole every configured LLM API key, and could poison Ruflo's AgentDB learning store to steer that instance's future agent output (CVE-2026-59726)."
tldr: "Noma Security found that Ruflo (formerly Claude Flow, 80k+ GitHub stars) shipped a docker-compose default that exposed its MCP Bridge's 233 tools on 0.0.0.0:3001 with no authentication at all. A single request could run arbitrary shell commands, steal every configured LLM provider key, and poison the AgentDB learning store so every future agent output on that instance stays under the attacker's influence — upgrading to the patched version doesn't undo that poisoning, so operators have to audit and clean it up by hand."
series:
  name: "AI Security Alert"
  order: 87
---

> :globe: [中文版](/posts/daily/2026-11-26-security-ruflo-mcp-bridge-rce)

## Incident Overview

Security research firm Noma Security (via Noma Labs) published a report on 2026-07-29 describing an unauthenticated remote-code-execution flaw in the **MCP Bridge** of **Ruflo**, an open-source AI agent orchestration platform (formerly Claude Flow, with over 80,000 GitHub stars and the number-two ranking on MCPMarket). The MCP Bridge is Ruflo's built-in Express.js server that handles every tool call made through the Model Context Protocol, exposing 233 tools in one place — covering shell access, database operations, agent management, and memory storage. It's effectively the platform's central nervous system. Ruflo's default `docker-compose.yml` binds both the bridge and its internal MongoDB to `0.0.0.0` (every network interface), and the `POST /mcp` endpoint performed no token or header check whatsoever. Researcher Eli Ainhorn used a single unauthenticated HTTP request calling the `terminal_execute` tool to get a shell as the container's `node` user, then chained together a full eight-step attack: stealing every configured LLM provider key, spinning up an attacker-controlled agent swarm on the victim's own keys and compute, poisoning the AgentDB learning store so that every future agent output on that instance stays under the attacker's influence, pulling chat history out of an unauthenticated MongoDB, and finally planting a backdoor that survives a restart. Ruflo's team shipped a fix within hours of the 2026-06-30 report, releasing version 3.16.3 on July 1; the [GHSA-c4hm-4h84-2cf3 advisory](https://github.com/ruvnet/ruflo/security/advisories/GHSA-c4hm-4h84-2cf3) and [CVE-2026-59726](https://www.cve.org/CVERecord?id=CVE-2026-59726) weren't made public until 2026-11-24 — nearly five months after the patch.

**Key Facts**

| Field | Value |
|---|---|
| Incident type | Unauthenticated RCE / privilege escalation + AI memory poisoning (a zero-auth MCP endpoint led to shell access, then chained into key theft and poisoning of the agent's learning store) |
| Scope | Self-hosted Ruflo docker-compose chat stacks (chat UI, MCP Bridge, nginx, MongoDB) prior to 3.16.3; running the Ruflo CLI locally over stdio is outside this risk |
| Severity | Critical (sources disagree on the exact CVSS score — Ruflo's own release note says 9.8, while Noma Labs and i10x report 10.0 — but both describe it as the top severity tier) |
| CVE | [CVE-2026-59726](https://www.cve.org/CVERecord?id=CVE-2026-59726) |
| Sources | [Noma Security's research write-up](https://noma.security/noma-labs/rufroot-the-mcp-bridge-vulnerability-that-turns-agents-into-rogue-admins-cve-2026-59726), [GitHub Security Advisory GHSA-c4hm-4h84-2cf3](https://github.com/ruvnet/ruflo/security/advisories/GHSA-c4hm-4h84-2cf3), [CVE.org record](https://www.cve.org/CVERecord?id=CVE-2026-59726), [i10x.ai coverage](https://i10x.ai/news/ruflo-mcp-bridge-unauthenticated-shell-api-keys-agentdb-poisoning) |

## Attack Surface Analysis

The entry point sits in the trust model of MCP itself: Ruflo's MCP Bridge hands every `tools/call` request straight to `executeTool()` with no authentication layer in between. The platform does maintain a command blocklist (`AUTOPILOT_BLOCKED_PATTERNS`) that rejects dangerous operations, but that blocklist is only enforced inside the autopilot chat flow — the externally reachable `/mcp` and `/mcp/:group` routes bypass it entirely. So an attacker only needs the target's IP address and the default port 3001 to call `terminal_execute` and run arbitrary shell commands inside the bridge container as `node` (UID 1000). Noma Labs confirmed this step was reproducible using an out-of-band (OAST) callback to Burp Collaborator, but the exact commands and payload chain weren't published.

Everything after that is just more calls to the same unauthenticated endpoint. Ruflo's docker-compose injects every configured LLM provider key (OpenAI, Anthropic, Google, OpenRouter, and so on) as environment variables, and child processes inherit the full environment through `{ ...process.env }` — effectively handing those keys straight to the attacker. With the keys and compute budget in hand, an attacker can call `swarm_init` and `agent_spawn` to launch their own agent swarm billed to the victim. The more unusual step is the `agentdb_pattern-store` tool, which lets an attacker write malicious "patterns" into Ruflo's learning pipeline — Noma's example is a forged SOC2 compliance policy that instructs the AI to embed an attacker-controlled URL in every deployment script it generates afterward, so every user of that instance keeps getting influenced output with no way to tell. The same network also had an unauthenticated MongoDB on port 27017 that an attacker could use to dump and exfiltrate all stored conversations. Finally, by writing a file to `/app/beacon.js`, wiring it into `index.js` via `require()`, and relying on Docker's `restart: unless-stopped` policy, the attacker could make the backdoor come back automatically even after the container was killed.

This maps to **LLM06: Excessive Agency** on the OWASP LLM Top 10 — the MCP Bridge exposed 233 tools, including arbitrary shell execution, directly to the network, and the only authorization check that actually existed sat in the user-facing chat flow rather than on every real tool-invocation path — as well as **LLM04: Data and Model Poisoning**, since `agentdb_pattern-store` let an unauthorized caller write directly into the agent's learning store, whose output every user of that instance then trusted and acted on. The incident is also a reminder of something easy to miss about MCP risk: it isn't only about an LLM being tricked into calling a dangerous tool. When the entire tool-invocation endpoint can be hit directly, bypassing the LLM altogether, agent security degrades into an ordinary — if higher-stakes — web API authentication problem.

```diagram
title: How one unauthenticated MCP request took Ruflo from zero access to steering agent output long-term
desc: An attacker sends an unauthenticated tool call to a publicly exposed Ruflo MCP Bridge, gets a container shell, then in sequence steals LLM keys, hijacks compute, poisons the AgentDB learning store, and plants a backdoor that survives the patch.
caption: Compiled from Noma Security's research write-up and the GitHub security advisory; the exact exploitable payload is omitted.
step: Attacker sends an unauthenticated tool call to the exposed MCP Bridge (0.0.0.0:3001)
step: Calls terminal_execute to get a shell as the node user inside the container
step: Reads environment variables to steal OpenAI, Anthropic, Google, and OpenRouter keys
step: Uses the stolen keys and compute to launch an attacker-controlled agent swarm
step: Writes to the AgentDB pattern store, poisoning that instance's future agent output
step: Plants a backdoor that restarts on boot, surviving even a patched upgrade
---
<svg viewBox="0 0 760 596">
  <path class="dg-line" d="M380 88V128" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M380 188V228" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M380 288V328" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M380 388V428" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--accent" d="M380 488V528" marker-end="url(#arrow-accent)" data-step="5"/>

  <g data-step="1">
    <rect class="dg-box" x="200" y="32" width="360" height="56" rx="6"/>
    <text class="dg-label" x="380" y="51" text-anchor="middle" dominant-baseline="central">Unauthenticated call to the MCP Bridge</text>
    <text class="dg-sub" x="380" y="71" text-anchor="middle" dominant-baseline="central">Target: exposed on 0.0.0.0:3001</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="220" y="132" width="320" height="56" rx="6"/>
    <text class="dg-label" x="380" y="151" text-anchor="middle" dominant-baseline="central">terminal_execute gets a container shell</text>
    <text class="dg-sub" x="380" y="171" text-anchor="middle" dominant-baseline="central">Runs as the node user (UID 1000)</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="200" y="232" width="360" height="56" rx="6"/>
    <text class="dg-label" x="380" y="251" text-anchor="middle" dominant-baseline="central">Steals LLM provider keys from env vars</text>
    <text class="dg-sub" x="380" y="271" text-anchor="middle" dominant-baseline="central">OpenAI, Anthropic, Google, OpenRouter</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="200" y="332" width="360" height="56" rx="6"/>
    <text class="dg-label" x="380" y="351" text-anchor="middle" dominant-baseline="central">Launches an attacker-run agent swarm</text>
    <text class="dg-sub" x="380" y="371" text-anchor="middle" dominant-baseline="central">Billed to the victim's keys and compute</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="200" y="432" width="360" height="56" rx="6"/>
    <text class="dg-label" x="380" y="451" text-anchor="middle" dominant-baseline="central">Poisons the AgentDB learning store</text>
    <text class="dg-sub" x="380" y="471" text-anchor="middle" dominant-baseline="central">Steers all future agent output on the instance</text>
  </g>

  <g data-step="6">
    <rect class="dg-box dg-box--accent" x="200" y="532" width="360" height="56" rx="6"/>
    <text class="dg-label" x="380" y="551" text-anchor="middle" dominant-baseline="central">Plants a boot-persistent backdoor</text>
    <text class="dg-sub" x="380" y="571" text-anchor="middle" dominant-baseline="central">Patched upgrade alone can't remove poisoned data</text>
  </g>
</svg>
```

## Defense Strategies

**Immediate Actions**
- Check whether you're self-hosting Ruflo: `docker ps --format '{{.Names}} {{.Ports}}'` — seeing `0.0.0.0:3001->3001` or `0.0.0.0:27017->27017` means you're still on the vulnerable defaults
- Upgrade to Ruflo 3.16.3 or later and pull the updated `docker-compose.yml` — the new version refuses to start without `MONGO_INITDB_ROOT_PASSWORD`, and also requires `MCP_AUTH_TOKEN` for any public bind
- If ports 3001 or 27017 were ever exposed, rotate every OpenAI, Google, OpenRouter, and Anthropic key immediately, and check each provider's usage logs for calls you didn't make
- Audit the AgentDB pattern store (`.swarm/memory.db` in the Ruflo working directory) for entries no one on your team wrote — especially ones instructing the agent to add extra network calls, telemetry, or "compliance" code to its output. **Upgrading the patched version does not remove poisoned data already written** — it has to be audited and cleaned by hand

**Long-Term Architecture**
- Treat any MCP server's tool-invocation endpoint like any other API that touches sensitive resources: authenticate every request, expose only the tools you actually need by default, and avoid binding the bridge to `0.0.0.0` unless you must
- Don't rely solely on a cloud firewall or security group: on many Linux hosts, Docker writes published ports into iptables ahead of ufw's rules, so a ufw deny rule alone may never take effect. Use your cloud security group, or bind to `127.0.0.1` directly, for anything that actually matters
- Check whether child processes really need to inherit the full environment — even after the patch, Ruflo still passes the complete set of keys to every tool backend (per-backend key scoping remains a follow-up item), which means "the patch is live" doesn't mean "the key-exposure surface is gone." Defenses need to account for what a compromised tool process can actually reach
- Put a write-permission gate on any tool that can write to an agent's learning or memory store (AgentDB, vector memory, and the like) — don't let every caller who can reach the MCP endpoint unconditionally shape future output. Vendors focused specifically on agentic AI security, such as Noma Security or WitnessAI from our watchlist, are worth a look for this kind of inventory

## Impact

Ruflo's npm packages saw 62,000 downloads of `ruflo`, 103,000 of `@claude-flow/cli`, and 13,000 of `claude-flow` in the week of 2026-11-23 alone — but that only measures CLI usage, and nobody has published a count of how many Docker bridges were actually reachable on the network. The advisory itself doesn't mention any exploitation found in the wild. The window the flaw actually existed in was long: the patched 3.16.3 shipped on 2026-07-01, but the CVE wasn't public until 11-24 — nearly five months during which there was no CVE number for scanners like npm audit or Dependabot to match against, leaving the project's own release note as the only warning available. The scope is also clearly bounded: the advisory describes the self-hosted docker-compose chat stack specifically, and simply running Ruflo as a local stdio MCP server inside Claude Code is outside this attack chain — though the advisory's authors note the CLI's default localhost binding is still an open item they haven't fully confirmed. If your own agent infrastructure uses a similar self-hosted-MCP-bridge-plus-persistent-learning-store architecture, the real lesson here isn't this one vulnerability — it's that patching only fixes access control, not data that's already been poisoned. Any intrusion that touches an agent's memory or learning pipeline needs a data-integrity audit as a mandatory part of incident response, not just a version bump.

## Today's Takeaway

This incident splits "MCP security" into two genuinely different problems: one is a classic missing-web-API-authentication issue — anyone can call the tools — and the other is a risk unique to agent systems. Once an attacker can write to the storage layer an agent actually learns or remembers from, patching the vulnerability itself isn't nearly enough, because the poisoned data keeps shaping every user's future output inside a system that otherwise looks like it's working fine. In other words, "data-integrity audit" belongs on an agent system's incident-response checklist right alongside "patch the vulnerability" — a fixed CVE doesn't mean the incident is closed.

## References

- [RufRoot: The MCP Bridge Vulnerability That Turns Agents Into Rogue Admins (CVE-2026-59726) — Noma Security](https://noma.security/noma-labs/rufroot-the-mcp-bridge-vulnerability-that-turns-agents-into-rogue-admins-cve-2026-59726)
- [Unauthenticated RCE in ruflo MCP bridge default docker-compose deployment — GitHub Security Advisory GHSA-c4hm-4h84-2cf3](https://github.com/ruvnet/ruflo/security/advisories/GHSA-c4hm-4h84-2cf3)
- [CVE Record: CVE-2026-59726 — CVE.org](https://www.cve.org/CVERecord?id=CVE-2026-59726)
- [Release v3.16.3 — Security release — GitHub](https://github.com/ruvnet/ruflo/releases/tag/v3.16.3)
- [Ruflo MCP bridge flaw handed out shells and AI keys; a patch won't undo poisoning — i10x.ai](https://i10x.ai/news/ruflo-mcp-bridge-unauthenticated-shell-api-keys-agentdb-poisoning)
