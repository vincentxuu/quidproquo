---
title: "Security Alert: A Downloads-Folder AGENTS.md File Hijacks Codex and Claude Code — No Click Required"
date: 2026-10-27
category: daily
tags: [ai-agent, security, daily, prompt-injection]
lang: en
description: "Forever Security caught a real attack in the wild: a malicious website can silently drop an AGENTS.md file into a user's Downloads folder, and a coding agent launched there follows it as trusted instructions — over 90% success getting Codex to install malware, roughly 50% success leaking Claude Code's OAuth token."
tldr: "Forever Security published research on October 22, 2026, describing how they caught a coding agent on a real customer's machine mid-attempt at installing the malicious npm package function-color. The trail led to an AGENTS.md file sitting in the customer's ~/Downloads folder. The researchers rebuilt the full attack chain and reproduced it against OpenAI Codex (over 90% success, persisting via the machine-wide ~/.codex/config.toml) and Claude Code (roughly 50% success via a forged CLAUDE.md that rewrites .claude/settings.json's ANTHROPIC_BASE_URL, leaking the OAuth token and enabling code execution). Browsers writing silently to ~/Downloads with no click and no approval is the precondition that makes this work — and the vendors' position is that there's nothing to patch. Defense: never run a coding agent with ~/Downloads as its working directory, and audit agent config files for unexpected changes."
series:
  name: "AI Security Alert"
  order: 65
---

> 🌏 [中文版](/posts/daily/2026-10-27-security-agents-md-downloads-hijack)

## What happened

Forever Security researchers Gal Weizman and Omer Samet published a report on October 22, 2026, describing how they caught a coding agent on a real customer's machine in the act of trying to install a known-malicious npm package, `function-color`. Tracing the instruction back, they found it hadn't come from any code or dependency — it came from an `AGENTS.md` file sitting in the customer's `~/Downloads` folder, a file format that many coding agents (OpenAI's Codex, Anthropic's Claude Code) automatically read on startup and treat as working instructions. Nobody knows how the file got there. The researchers rebuilt the entire attack chain and confirmed it: if a browser silently saves a malicious file into Downloads, and the user happens to launch their agent from that folder, the attack can run to completion with the user noticing nothing — over 90% success at getting Codex to install the malicious package, and roughly 50% success at escalating to account takeover on Claude Code. BleepingComputer, Help Net Security, Dark Reading, and CSOonline have all independently covered and corroborated the research.

**Key facts**

| Item | Detail |
|---|---|
| Attack type | Indirect prompt injection (via a local instruction file), combined with excessive agency |
| Affected | OpenAI Codex and Anthropic Claude Code, when launched with `~/Downloads` as the working directory (Forever's telemetry also notes Cursor CLI users share the habit, though the technical reproduction targeted only Codex and Claude Code) |
| Severity | High (a real victim machine, a reproducible PoC, and the vendors say there's nothing to patch) |
| CVE | None (the researchers and both OpenAI and Anthropic agree this isn't a traditional vulnerability) |
| Sources | [Forever Security's original report](https://forever.security/blog/hijacking-ai-agents-via-downloads-folder/), [BleepingComputer](https://www.bleepingcomputer.com/news/security/ai-coding-agents-hijacked-using-agentsmd-file-in-downloads-folder/), [Dark Reading](https://www.darkreading.com/application-security/in-the-wild-attack-ai-agents-trust-markdown) |

## Attack surface analysis

The attack chain has two layers: getting the file onto the machine, and getting the agent to actually act on it. The first layer exploits a thirty-year-old browser behavior nobody treated as a risk: Chrome, Edge, and Firefox all save web-triggered downloads straight into `~/Downloads` by default, with no click to approve and no prompt to choose a save location. That was never dangerous in a world where "downloaded file" meant "possibly executable," because operating systems long ago stopped unapproved downloads from running themselves. The problem is that coding agents treat plain-text files like `AGENTS.md` and `CLAUDE.md` as trusted project configuration rather than as untrusted input the user happened to download. So a web page can, without the user noticing anything, drop a long document disguised as "engineering guidelines" into Downloads. Later, when the user launches their agent from that same folder — Forever's telemetry shows roughly half its customers do exactly this, often to have the agent tidy up a recent download — the agent reads the planted file and treats it as its own marching orders.

```diagram
title: How a downloaded file hijacks Codex and Claude Code
desc: A malicious web page gets the browser to silently save AGENTS.md into Downloads; once an agent is launched from that folder, the file is treated as trusted instructions, leading Codex to install malware and Claude Code to leak its OAuth token
caption: Success rates are Forever Security's own test figures; the real attack chain also has to work around several independent controls (a trust gate, review, sandboxing, timeout kills, and more) — see the main text
---
<svg viewBox="0 0 640 440">
  <path class="dg-line" d="M320 76V88" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 148V164" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 224V232Q320 240 312 240H168Q160 240 160 248V260" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 224V232Q320 240 328 240H472Q480 240 480 248V260" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 320V356" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 320V356" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="180" y="20" width="280" height="56" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">Malicious page triggers a download</text>

  <rect class="dg-box" x="140" y="92" width="400" height="56" rx="6"/>
  <text class="dg-label" x="320" y="111" text-anchor="middle" dominant-baseline="central">Browser silently saves the file</text>
  <text class="dg-sub dg-mono" x="320" y="131" text-anchor="middle" dominant-baseline="central">~/Downloads/AGENTS.md</text>

  <rect class="dg-box" x="140" y="168" width="400" height="56" rx="6"/>
  <text class="dg-label" x="320" y="187" text-anchor="middle" dominant-baseline="central">Agent launched from Downloads</text>
  <text class="dg-sub" x="320" y="207" text-anchor="middle" dominant-baseline="central">file read as trusted instructions</text>

  <rect class="dg-box" x="20" y="264" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="283" text-anchor="middle" dominant-baseline="central">Writes machine-wide config</text>
  <text class="dg-sub dg-mono" x="160" y="303" text-anchor="middle" dominant-baseline="central">~/.codex/config.toml</text>

  <rect class="dg-box" x="340" y="264" width="280" height="56" rx="6"/>
  <text class="dg-label" x="480" y="283" text-anchor="middle" dominant-baseline="central">Rewrites project config</text>
  <text class="dg-sub dg-mono" x="480" y="303" text-anchor="middle" dominant-baseline="central">.claude/settings.json</text>

  <rect class="dg-box dg-box--warn" x="20" y="360" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="379" text-anchor="middle" dominant-baseline="central">Malware installed</text>
  <text class="dg-sub" x="160" y="399" text-anchor="middle" dominant-baseline="central">90%+ success rate</text>

  <rect class="dg-box dg-box--warn" x="340" y="360" width="280" height="56" rx="6"/>
  <text class="dg-label" x="480" y="379" text-anchor="middle" dominant-baseline="central">OAuth token leaked</text>
  <text class="dg-sub" x="480" y="399" text-anchor="middle" dominant-baseline="central">~50% success rate</text>

  <text class="dg-edge" x="240" y="228" text-anchor="middle" dominant-baseline="central">Codex</text>
  <text class="dg-edge" x="400" y="228" text-anchor="middle" dominant-baseline="central">Claude Code</text>
</svg>
```

The second layer is getting the model to actually follow through. Against Codex, the attackers wrapped the malicious instruction inside a section that reads like ordinary "local developer environment setup," asking the agent to register a fake "project tools" MCP server in `~/.codex/config.toml` — the machine-wide config, not something scoped to one folder — which in reality launches `npm install function-color` via `launchctl`. The researchers found this text worked around five independent controls, each a finding in its own right: a trust gate (once you've worked in Downloads, Codex treats it as a trusted project), review (a blunt "install this" request gets refused, but the same payload wrapped in a long engineering document gets through), a startup-only loading restriction (worked around with a one-off child session), the network sandbox (bypassed by having the model write its own `--dangerously-bypass-approvals-and-sandbox` flag), and a handshake timeout (handed off to `launchctl`, running outside Codex's control). Because the write lands in the machine-wide config, the damage isn't scoped to Downloads — every later Codex session, in any folder, loads the attacker's server.

Against Claude Code, the researchers found direct package-install instructions met much stronger resistance, so they pivoted to a forged `CLAUDE.md` disguised as "internal API gateway setup," getting the agent to write `.claude/settings.json` with an `ANTHROPIC_BASE_URL` pointing at a server the attackers control. That single rewrite accomplishes two things at once: every subsequent API call now ships Claude's OAuth token to the attacker's server (account takeover on its own), and the attacker's server can impersonate the model and feed back tool calls — including a `Bash` call carrying `dangerouslyDisableSandbox: true` — that Claude's own client runs as if the model itself had decided to. This maps to **LLM01: Prompt Injection** on the OWASP LLM Top 10 (the payload arrives via an indirect, local-file channel) combined with **LLM06: Excessive Agency** (the agent can rewrite the very configuration that defines its own trust boundary, and then trusts what it just wrote, far beyond what "reading a document" should require). Forever's position, which OpenAI and Anthropic don't dispute, is that this isn't a patchable bug — an agent following the instructions file in its working directory is doing exactly what it's designed to do. The gap is that a web page can silently change the contents of a folder the user trusts, and that seam falls outside anyone's existing threat model.

## How to defend against it

The practical move right now is to treat this as a known, unpatchable attack surface to route around through habit change, not to wait for a vendor fix. Longer term, it's worth adding the kind of behavioral monitoring that traditional endpoint security doesn't cover: an agent rewriting its own configuration or switching its own network endpoint.

**Immediate actions**
- Stop using `~/Downloads` as the working directory for Codex, Claude Code, or any coding agent — launch them only from an explicit project folder
- Check `~/.codex/config.toml` for unfamiliar `[mcp_servers.*]` entries, and check every project's `.claude/settings.json` for an `ANTHROPIC_BASE_URL`, proxy, or endpoint you didn't set
- Look for an `AGENTS.md` or `CLAUDE.md` you didn't write, whether in Downloads or in a freshly cloned repo, and read it before letting an agent near it
- Check for the malicious package Forever identified, `function-color` (now removed from npm); if it's installed anywhere, assume the whole machine is compromised and rotate every related credential and token immediately

**Longer-term architecture**
- Keep approval gates and sandboxes enabled, and treat any instruction that asks an agent to temporarily disable them as highly suspicious — that flag is almost always something the attacker wrote to talk the model into it
- Add integrity monitoring at the agent runtime layer that alerts in real time on non-user writes to files like `~/.codex/config.toml` or `.claude/settings.json`; watchlist company Netzilo is positioned exactly for this kind of agent runtime governance and one-click kill switch, suited to catching an agent rewriting its own configuration
- When agent traffic can be redirected to an unexpected endpoint (as with the `ANTHROPIC_BASE_URL` rewrite here), watchlist company WitnessAI focuses on visibility and guardrails for enterprise agent traffic, catching the moment a base URL gets redirected rather than waiting until the stolen token is actually used

## Scope of impact

Forever's customer telemetry shows roughly half of customers run an agent with `~/Downloads` as the working directory, and roughly a quarter of agent sessions open a real browser — this is not a niche edge case. For Claude Code alone, the company's customer base logged more than 1,300 sessions launched from a Downloads folder. The only confirmed real-world attack so far is the one caught on that customer's machine, stopped before the malicious install could run, with no actual damage done; how the `AGENTS.md` file got onto that machine's Downloads folder in the first place remains unknown, and there's no evidence yet of whether this is an isolated incident or has already been replicated at scale. Because OpenAI and Anthropic both regard this as inherent agent behavior — trusting the working directory is the design — rather than something to patch, this attack surface stays open until users and organizations change how they launch their agents.

If anyone on your team has a habit of letting Claude Code or Codex "tidy up Downloads" for them, this report describes the attack surface you're exposed to right now.

## Today's takeaway

Most prompt-injection scenarios assume the attack happens mid-task — the agent reads a malicious web page or PR while it's already working, and gets steered into doing something bad. What's different here is that the attack happens before any task begins, at the step where the agent loads its own working-directory configuration, and the goal isn't to get the agent to do one bad thing right now — it's to get the agent to quietly rewrite its own trust boundary (a global config file, an API endpoint), turning a single read into a persistent, machine-level, cross-session compromise. The reminder: an agent's "load my config" step is its own attack surface, not meaningfully safer than the "call a tool" step everyone already watches.

## References

- [Forever Security — Markdown Is the New Executable: Attackers Are Dropping Agent Instructions Into Your Downloads Folder From the Web](https://forever.security/blog/hijacking-ai-agents-via-downloads-folder/)
- [BleepingComputer — AI coding agents hijacked using AGENTS.md file in Downloads folder](https://www.bleepingcomputer.com/news/security/ai-coding-agents-hijacked-using-agentsmd-file-in-downloads-folder/)
- [Dark Reading — In-the-Wild Attack Abuses AI Agents' Trust in Markdown](https://www.darkreading.com/application-security/in-the-wild-attack-ai-agents-trust-markdown)
- [Help Net Security — AI coding agents fall for malicious instructions planted in the Downloads folder](https://www.helpnetsecurity.com/2026/10/26/ai-coding-agents-malware-openai-codex/)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/)
