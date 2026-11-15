---
title: "Security Alert | Prompt Injection Chained Through GitHub Actions Flaws Straight to OpenAI Codex's npm Publishing Rights"
date: 2026-11-14
category: daily
tags: [ai-agent, security, daily, prompt-injection, supply-chain]
lang: en
description: "Security firm Depi disclosed a full exploit chain that starts with a prompt injection in a GitHub issue and ends with the signing authority needed to publish OpenAI's official npm package @openai/codex. OpenAI has patched it and paid a bounty."
tldr: "Depi found that opening a malicious issue against openai/codex's issue-labeler workflow triggers a prompt injection against the Codex agent. From there, an unauthenticated debug channel inside the GitHub Actions runner leaks CI tokens, which get chained through cache poisoning and a separate known bug into npm signing credentials capable of publishing a malicious @openai/codex release — a package downloaded millions of times a month. OpenAI patched it and paid a bounty; the whole chain was proven only in Depi's own test environment, with no real users affected."
series:
  name: "AI Security Alert"
  order: 77
---

> 🌏 [中文版](/posts/daily/2026-11-14-security-codex-npm-supply-chain-prompt-injection)

## What happened

On November 11, security firm Depi published research disclosing a full exploit chain that starts with a prompt injection in a GitHub issue and ends with the ability to publish OpenAI's official npm package `@openai/codex`. The entry point was a GitHub Actions workflow in the `openai/codex` repository that reads newly opened issues to suggest labels. Because it was configured with `allow-users: "*"`, anyone could open an issue and have its title and body fed straight into the Codex agent's prompt — the opening for a prompt injection. Depi used that opening to get code execution inside the agent's sandbox, then used an unauthenticated debug channel buried in the GitHub Actions runner to read a CI token out of process memory, and finally chained that into a separate known bug to obtain publishing credentials for a real release. Depi disclosed responsibly through Bugcrowd; OpenAI has patched the issue and paid an initial bounty. The entire chain was proven only in Depi's own test environment — no real users' package updates were affected.

**Key facts**

| Item | Value |
|---|---|
| Incident type | Prompt injection chained into a supply chain attack (CI/CD exploit chain) |
| Scope | `openai/codex`'s issue-labeler workflow, the GitHub Actions runner, and the `@openai/codex` npm package (millions of downloads per month) |
| Severity | Critical (capable of a large-scale supply chain RCE in theory; caught before any real exploitation) |
| CVE | None (disclosed via Bugcrowd bug bounty, not formally numbered) |
| Sources | [Depi research report](https://depi.security/blog/20261111-backdooring-codex/), [SecurityWeek](https://www.securityweek.com/in-other-news-new-cisa-director-nominee-connected-car-hacking-baker-tilly-data-breach/), [The Defiant](https://thedefiant.io/frontier/ai/researchers-say-codex-flaw-put-npm-releases-at-risk) |

## Attack surface analysis

The chain has three stages, and each one rests on the same assumption: that an AI agent can be trusted as a component in the pipeline.

The first stage is the prompt injection itself. `issue-labeler.yml` feeds `github.event.issue.title` and `github.event.issue.body` directly into the Codex agent's prompt. The workflow treats that text as data, but the agent receives it in the same natural-language context as its trusted instructions, with no way to tell which parts are authorized instructions and which were written by a stranger. Depi found a prompt structure that made the model misread the issue content as a fresh set of system instructions, then compressed and encoded the shell script it wanted executed so Codex's own safety checks couldn't recognize its intent — getting arbitrary command execution inside the sandbox's `workspace-write` permission level.

The second stage is the sandbox escape. `workspace-write` mode disables network access, restricts writes to the current directory and `/tmp/`, and drops `ptrace`. But the two .NET processes behind a GitHub runner — `Runner.Listener` and `Runner.Worker` — create CoreCLR debug pipes under `/tmp/`, and on Linux, pipes are just files; opening them with `open()` isn't blocked by any of those restrictions. That debug protocol has no authentication at all: anyone who can open the pipe can issue a "read memory" command against `Runner.Worker` and pull secrets straight out of its process memory, including `ACTIONS_RUNTIME_TOKEN` and `GITHUB_TOKEN` — the sandbox strips environment variables from the child process, but it does nothing to protect its parent's memory.

The third stage is where it becomes a real supply chain attack. With no network access inside the sandbox, Depi exfiltrated the stolen tokens in chunks through the issue's own output log, then used them outside the sandbox. Because the token was still a valid OpenAI identity, it could be used to poison the GitHub Actions cache belonging to a separate workflow (`rust-ci.yml`) that held `Actions: write` permission — GitHub's cache is an unverified tar archive extracted without any content check, so a malicious file can land at an arbitrary path. The next time that workflow restored its cache, the planted file executed and abused its `Actions: write` permission to create a fake release. When a maintainer deleted that fake release, it triggered a separate, previously disclosed bug involving the `release: delete` action — discovered by security researcher Adnan Khan — that handed over an OpenID Connect token. With that token and write access, the attacker could request a signing JWT trusted by npm and publish a new version of `@openai/codex`.

```diagram
title: From one GitHub issue to npm publishing rights
desc: A single malicious issue triggers a prompt injection, escapes the sandbox to read a CI token, chains that through cache poisoning and a known bug, and arrives at signing credentials for the official package — caught by OpenAI before the final step was actually exploited.
caption: Simplified from Depi's November 11, 2026 research.
step: Anyone can open an issue to trigger the workflow (allow-users: "*")
step: Prompt injection makes Codex run encoded code inside its sandbox
step: An unauthenticated debug channel in /tmp leaks the CI token from Runner.Worker's memory
step: The stolen token poisons the cache of another workflow with Actions:write permission
step: Restoring the cache runs the planted file, abusing write access to create a fake release
step: A maintainer deletes the fake release, triggering a known bug that yields an OIDC token
step: The OIDC token buys an npm signing JWT — able to publish a malicious release, caught by OpenAI at this step
---
<svg viewBox="0 0 712 600">
  <path class="dg-line" d="M320 26V48" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M320 104V126" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M320 182V204" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M320 260V282" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M320 338V360" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line" d="M320 416V438" marker-end="url(#arrow)" data-step="6"/>
  <path class="dg-line dg-line--warn" d="M320 494V516" marker-end="url(#arrow-warn)" data-step="7"/>

  <circle class="dg-dot" cx="320" cy="20" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="120" y="48" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="68" text-anchor="middle" dominant-baseline="central">Anyone can open an issue to trigger the workflow</text>
    <text class="dg-sub" x="320" y="88" text-anchor="middle" dominant-baseline="central">allow-users: "*" exposes the agent to outside input</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="120" y="126" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="146" text-anchor="middle" dominant-baseline="central">Prompt injection runs code inside Codex's sandbox</text>
    <text class="dg-sub" x="320" y="166" text-anchor="middle" dominant-baseline="central">Encoded payload evades its own safety checks</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="120" y="204" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="224" text-anchor="middle" dominant-baseline="central">An unauthenticated debug pipe in /tmp leaks memory</text>
    <text class="dg-sub" x="320" y="244" text-anchor="middle" dominant-baseline="central">Pulls the CI token out of Runner.Worker</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="120" y="282" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="302" text-anchor="middle" dominant-baseline="central">The stolen token poisons another workflow's cache</text>
    <text class="dg-sub" x="320" y="322" text-anchor="middle" dominant-baseline="central">Target workflow holds Actions: write permission</text>
  </g>

  <g data-step="5">
    <rect class="dg-box" x="120" y="360" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="380" text-anchor="middle" dominant-baseline="central">Restoring the cache runs the planted file</text>
    <text class="dg-sub" x="320" y="400" text-anchor="middle" dominant-baseline="central">Abuses write access to create a fake release</text>
  </g>

  <g data-step="6">
    <rect class="dg-box" x="120" y="438" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="458" text-anchor="middle" dominant-baseline="central">Deleting the fake release triggers a known bug</text>
    <text class="dg-sub" x="320" y="478" text-anchor="middle" dominant-baseline="central">Yields an OIDC token</text>
  </g>

  <g data-step="7">
    <rect class="dg-box dg-box--warn" x="120" y="516" width="400" height="64" rx="6"/>
    <text class="dg-label" x="320" y="540" text-anchor="middle" dominant-baseline="central">The OIDC token buys an npm signing JWT</text>
    <text class="dg-sub" x="320" y="562" text-anchor="middle" dominant-baseline="central">Could publish a malicious release — caught by OpenAI here</text>
  </g>
</svg>
```

Mapped to the OWASP LLM Top 10: the starting point is **LLM01 Prompt Injection**; `allow-users: "*"` letting any untrusted outsider feed input to the agent maps to **LLM06 Excessive Agency**; and the end point is **LLM05 Supply Chain Vulnerabilities** — `@openai/codex` is an agent that runs code on developer machines with developer credentials, and turning on auto-update removes the human review step that would normally catch a bad release.

## Defenses

**Immediate actions**
- Audit every GitHub Actions workflow that feeds externally-controlled text — issues, PR descriptions, comments — directly to an AI agent; if it's set to allow any outside trigger (like `allow-users: "*"`), restrict it to trusted maintainers or org members
- Give jobs that process outside text read-only tokens only, and never let them share a runner or cache with a workflow that holds cache-write, release, or publish permissions — those execution environments and credential scopes should be fully separated
- If you run Codex CLI or any auto-updating AI coding agent, consider a short cooldown before pulling freshly published updates, so the wider community has time to catch anything bad first

**Long-term architecture**
- Enforce least privilege on CI/CD tokens — audit which workflows genuinely need `write` or `Actions: write`, and confirm that release-related events (like `release: delete`) can't unexpectedly trigger a path to a higher-privilege token
- Treat GitHub Actions cache as untrusted input: verify provenance before restoring it, instead of extracting its contents unchecked
- Just as Depi's own "Upstream Security Platform" is what originally flagged this attack path, a tool focused on mapping AI agent attack surfaces — such as watchlist entry Zenity — can trace where a workflow's inputs ultimately lead in terms of privilege, before an agent gets wired into CI/CD, catching this kind of trigger-to-credential-to-publish chain before it's actually strung together

## Impact

Depi fully validated the chain in a test environment but never carried out the final publishing step against the real `openai/codex` repository, and no malicious version was ever published to npm — no real user's Codex CLI update was affected. OpenAI patched the issue immediately after receiving the full proof of concept through Bugcrowd and has paid an initial bounty of $1,000, with the case still under further review (OpenAI's bounty policy caps out at $100,000 for critical findings). What's worth paying attention to is the scale: `@openai/codex` is downloaded millions of times a month, and it's an agent that runs code on developer machines with developer credentials — if this chain had actually been weaponized into a malicious release, the blast radius would approach that of the 2025 Shai-Hulud npm supply chain worm.

If your team also lets an AI coding agent handle issue triage, PR review, or any step in CI, the attack surface this incident represents isn't "will this agent follow a malicious instruction" — it's "which credentials in this agent's execution environment is it able to touch that it shouldn't be able to touch."

## Takeaway

What's genuinely interesting about this chain is that the only "AI" part of it is the opening prompt injection — everything after that, from the sandbox escape to the cache poisoning to trading up for an OIDC token, is a straightforward CI/CD security problem that has nothing to do with how smart the model is. The lesson is that defending an AI agent's attack surface can't stop at "can we get the model to refuse a malicious instruction" — every shared runner, every unauthenticated local channel, and every overly-privileged neighboring workflow in the agent's execution environment is one more link this kind of chain can walk down.

## References

- [Depi — Backdooring the next release of Codex through GitHub Action pipeline exploit chaining](https://depi.security/blog/20261111-backdooring-codex/)
- [SecurityWeek — In Other News: New CISA Director Nominee, Connected Car Hacking, Baker Tilly Data Breach (includes the OpenAI Codex backdoor risk item)](https://www.securityweek.com/in-other-news-new-cisa-director-nominee-connected-car-hacking-baker-tilly-data-breach/)
- [The Defiant / Frontier — Researchers Say Codex Flaw Put npm Releases at Risk](https://thedefiant.io/frontier/ai/researchers-say-codex-flaw-put-npm-releases-at-risk)
- [Cacheract — GitHub Actions cache poisoning tool by Adnan Khan](https://github.com/adnaneKhan/cacheract)
- [Unit 42 — Shai-Hulud npm supply chain worm](https://unit42.paloaltonetworks.com/npm-supply-chain-attack/)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/)
