---
title: "Security Alert | Microsoft's Agent Framework Poisoned on PyPI With a .pth Startup Hook That Steals Azure and GitHub Actions Credentials"
date: 2026-11-19
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: en
description: "Microsoft's official AI agent framework package, agent-framework, shipped two malicious PyPI releases that use a .pth startup hook to steal Azure and GitHub Actions credentials on every Python launch."
tldr: "Attackers published agent-framework 1.26.1 and 1.26.2 to PyPI on 2026-11-17, using a .pth startup hook so the credential stealer runs on any Python launch without the package ever being imported. It harvests Azure, Azure DevOps, and GitHub Actions credentials and tokens, then exfiltrates them to a webhook.site endpoint. Defense: don't run pip show/uninstall first — that itself triggers the stealer — check site-packages directly for the malicious .pth file, then rotate every credential from a clean machine."
series:
  name: "AI Security Alert"
  order: 82
---

> 🌏 [中文版](/posts/daily/2026-11-19-security-microsoft-agent-framework-pypi-credential-stealer)

## Incident Overview

Microsoft's open-source AI agent build-and-orchestration framework, `agent-framework`, had two malicious versions published to PyPI 33 minutes apart on the evening of 2026-11-17: 1.26.1 and 1.26.2. Both use Python's `.pth` startup-hook mechanism so the credential stealer runs **on every Python process start** — even if the user's code never actually `import`s `agent_framework`. If the package is sitting in the environment, running `pip` itself is enough to trigger it. The targets are Azure CLI, Azure DevOps, and GitHub Actions credentials. PyPI has since quarantined both releases, but how the attacker obtained publishing access remains unclear. At least nine independent security research teams — Aikido, Chainguard, Endor Labs, OX Security, SafeDep, Socket, StepSecurity, JFrog, and Google-owned Wiz — each published their own analysis of the same incident.

**Key Facts**

| Field | Value |
|---|---|
| Incident type | Supply chain attack (official AI agent framework package poisoned with a .pth startup-hook credential stealer) |
| Scope | Environments (dev machines and CI/CD runners) that installed or auto-updated to `agent-framework` 1.26.1/1.26.2 between roughly 20:35–21:20 UTC on 2026-11-17; the package averages about 190,000 downloads a month |
| Severity | Critical (steals credentials and can actively mint fresh cloud tokens, so rotating old keys alone isn't enough) |
| CVE | None assigned as of writing |
| Sources | [The Hacker News](https://thehackernews.com/2026/11/attackers-compromise-microsofts-agent.html), [GBHackers](https://gbhackers.com/microsofts-ai-agent-framework-package-compromised-on-pypi/), [SecurityWeek](https://www.securityweek.com/microsoft-agent-framework-releases-poisoned-with-credential-stealer/), [Socket.dev analysis](https://socket.dev/blog/agent-framework-pypi-package-compromised-with-credential-stealer), [JFrog Security Research](https://research.jfrog.com/post/agent-framework-hijack/) |

## Attack Surface Analysis

The attacker never touched Microsoft's source code or build pipeline. JFrog's analysis found that the attacker repacked a clean wheel locally and published it straight to PyPI, bypassing the upstream CI/CD entirely. That puts the failure squarely on publishing access: it's still unclear whether the attacker stole a maintainer's PyPI token or obtained publish rights some other way, but the result is that both malicious versions went live under the official account's identity, so a package manager would see nothing to distrust.

The real trick is abusing Python's `.pth` file mechanism. Version 1.26.1 drops `agent_framework_meta.pth` into the `site-packages` root, containing a single import statement. Python executes every `.pth` file's import line on **every** interpreter start, so just running any `python` command — even `pip` itself — in an environment that has the package installed triggers the `agent_framework_meta` module, which calls `_telemetry._start()` to collect credentials asynchronously in the background (fork-and-detach on Unix, a daemon thread elsewhere, guarded by an `_AF_TEL` environment variable to avoid re-triggering in the same process tree). Version 1.26.2 goes further: it moves the payload to `af_runtime_diag.pth`/`af_runtime_diag.py` and restores the package's original initializer byte-for-byte, so anyone inspecting only that file would assume the package is clean — while also expanding collection to GitHub Actions OIDC tokens.

What gets collected: pattern-matched environment variables; `~/.azure/*.json`, `.npmrc`, `pip.conf`, `.netrc`, `.git-credentials`, `.docker/config.json`, Hugging Face tokens, Azure DevOps agent credentials, and `.env`/JSON config files; plus Azure DevOps OIDC tokens, Azure managed-identity tokens, and Azure Instance Metadata Service (IMDS) responses. SafeDep points out the payload doesn't just read credentials already on disk — it actively requests **new** tokens from the platform: in an Azure DevOps pipeline it uses `SYSTEM_ACCESSTOKEN`/`SYSTEM_OIDCREQUESTURI` to exchange for a federated token, and on Azure compute it calls the managed-identity endpoint (`IDENTITY_ENDPOINT` on App Service/Functions, `169.254.169.254` elsewhere). Everything is serialized to JSON, zlib-compressed, Base64-encoded, and sent via HTTPS POST to a hard-coded `webhook.site/d381fd80-ec62-42ad-8f5c-d1b15103c9bb` endpoint.

```diagram
title: How the malicious agent-framework releases get a credential stealer to run on every Python launch
desc: Once the attacker obtains publishing access and ships a malicious wheel to PyPI, installing it writes a .pth file that the Python interpreter auto-executes on every subsequent launch, quietly harvesting credentials and minting fresh cloud tokens before exfiltrating everything to the attacker's webhook.site endpoint.
caption: Compiled from technical analyses by The Hacker News, GBHackers, Socket.dev, and JFrog.
step: Attacker obtains PyPI publishing access by unknown means
step: Publishes malicious agent-framework 1.26.1/1.26.2 wheels
step: User or CI/CD runs pip install, writing the .pth file into site-packages
step: Any later Python launch triggers the .pth import — no agent_framework import needed
step: Background async collection of credentials and fresh cloud tokens
step: Data compressed and encoded, then exfiltrated via HTTPS POST to webhook.site
---
<svg viewBox="0 0 760 596">
  <path class="dg-line" d="M400 88V128" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M400 188V228" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M400 288V328" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M400 388V428" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--accent" d="M400 488V528" marker-end="url(#arrow-accent)" data-step="5"/>

  <g data-step="1">
    <rect class="dg-box" x="280" y="32" width="240" height="56" rx="6"/>
    <text class="dg-label" x="400" y="51" text-anchor="middle" dominant-baseline="central">Attacker gets PyPI publish access</text>
    <text class="dg-sub" x="400" y="71" text-anchor="middle" dominant-baseline="central">method unknown</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="260" y="132" width="280" height="56" rx="6"/>
    <text class="dg-label" x="400" y="151" text-anchor="middle" dominant-baseline="central">Publishes 1.26.1 / 1.26.2</text>
    <text class="dg-sub" x="400" y="171" text-anchor="middle" dominant-baseline="central">two releases, 33 minutes apart</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="260" y="232" width="280" height="56" rx="6"/>
    <text class="dg-label" x="400" y="251" text-anchor="middle" dominant-baseline="central">pip install writes .pth file</text>
    <text class="dg-sub" x="400" y="271" text-anchor="middle" dominant-baseline="central">site-packages root</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="240" y="332" width="320" height="56" rx="6"/>
    <text class="dg-label" x="400" y="351" text-anchor="middle" dominant-baseline="central">Any Python launch triggers it</text>
    <text class="dg-sub" x="400" y="371" text-anchor="middle" dominant-baseline="central">no import needed</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="220" y="432" width="360" height="56" rx="6"/>
    <text class="dg-label" x="400" y="451" text-anchor="middle" dominant-baseline="central">Harvests creds, mints fresh tokens</text>
    <text class="dg-sub" x="400" y="471" text-anchor="middle" dominant-baseline="central">Azure / Azure DevOps / GitHub Actions</text>
  </g>

  <g data-step="6">
    <rect class="dg-box dg-box--accent" x="260" y="532" width="280" height="56" rx="6"/>
    <text class="dg-label" x="400" y="551" text-anchor="middle" dominant-baseline="central">Exfiltrated to webhook.site</text>
    <text class="dg-sub" x="400" y="571" text-anchor="middle" dominant-baseline="central">zlib-compressed, Base64-encoded</text>
  </g>
</svg>
```

This maps to **LLM05 Supply Chain Vulnerabilities** in the OWASP LLM Top 10: the root cause isn't a model or prompt weakness, but the lack of enforced source verification (provenance signing, Sigstore attestation) in the publishing pipeline the AI developer ecosystem relies on. What makes this incident notable is that the attack surface sits one layer below "the agent running" — this isn't a model being tricked into excessive agency; it's **the SDK used to build the agent being tampered with before the agent ever runs**. As long as the package is present, even an unrelated `python --version` on a dev machine can trigger the theft.

## Defense Playbook

**Immediate actions**
- **Don't run `pip show agent-framework` or `pip uninstall` first** — both start Python, and if a malicious version is already installed, that action itself re-triggers the stealer. Check the filesystem directly instead: look for `agent_framework_meta.pth` or `af_runtime_diag.pth` under `site-packages`
- Once confirmed, isolate affected dev machines and CI/CD runners, and determine whether they installed or updated the package within the roughly 20:35–21:20 UTC exposure window on 2026-11-17
- Check proxy/DNS logs for traffic to `webhook.site/d381fd80-ec62-42ad-8f5c-d1b15103c9bb` as corroborating evidence of compromise
- Rotate every potentially exposed credential — Azure CLI, Azure DevOps, GitHub Actions, npm/pip/Git/Docker, Hugging Face — from a **clean** system, not the infected one; pin the package back to the last safe version, 1.26.0, and rebuild from a clean environment
- Audit Azure sign-in and activity logs, and review GitHub Actions workflows that deploy to Azure — the attacker didn't just steal existing credentials, it actively minted new tokens from the platform, so rotating old keys alone won't cover that exposure

**Long-term architecture**
- `.pth`-based startup hooks — "triggers on install, no import required" — have already shown up in multiple Python supply-chain attacks (including the earlier LiteLLM incident). Import-based monitoring alone can't catch this; site-packages integrity checks and startup-hook scanning need to become routine in both CI/CD and dev-environment audits
- For fast-iterating packages like AI agent frameworks, use hash-pinned lockfiles and verify publishing provenance/signatures rather than trusting package name and maintainer identity alone
- Move CI/CD cloud credentials to least-privilege, short-lived identities so a single leaked credential has a minimal usable window
- Adopt ML/AI supply-chain scanning tools such as Protect AI that cover Python package dependencies, extending the audit scope from "is the model itself safe" to "has the SDK used to build the agent been tampered with"

## Impact

`agent-framework` averages roughly 190,000 downloads a month (JFrog separately estimates about 40,000 weekly), but actual exposure depends on how many environments happened to install or auto-update during that roughly 45-minute window on November 17. PyPI quickly quarantined both versions, which limits new installs going forward, but quarantining the package doesn't retroactively remove the stealer from machines that already installed it, nor invalidate credentials already exfiltrated. Because the attacker could also mint fresh Azure and GitHub Actions tokens rather than just reading existing ones, the real blast radius may extend well past a simple count of "who installed the malicious version" — assessing it properly requires cross-referencing cloud identity activity logs. This is also the second time a Microsoft-related PyPI package has been hit by a supply-chain attack this year: in May, `durabletask` was used by the TeamPCP actor to distribute the Mini Shai-Hulud worm, signaling continued attacker focus on Microsoft's AI/agent-adjacent presence on PyPI.

## Today's Takeaway

Most of the security incidents covered here lately focus on the agent being tricked mid-run — prompt injection, over-privileged tool calls. This one is a reminder that there's a layer underneath that: **the SDK used to build the agent can already be compromised before the agent ever starts running.** A `.pth` startup hook runs the stealer on any Python launch without your code ever touching the package — that's no longer a question of the agent's trust boundary, it's a question of whether the ground you built the agent on was ever clean to begin with. For an AI development ecosystem that leans heavily on rapid `pip` iteration, this kind of attack is much harder to catch by reviewing your own code than a prompt injection targeting a single application.

## References

- [Attackers Compromise Microsoft's Agent Framework PyPI Package to Steal Cloud Credentials — The Hacker News](https://thehackernews.com/2026/11/attackers-compromise-microsofts-agent.html)
- [Microsoft's AI Agent Framework Package Compromised on PyPI to Steal Cloud Credentials — GBHackers](https://gbhackers.com/microsofts-ai-agent-framework-package-compromised-on-pypi/)
- [Microsoft Agent Framework Releases Poisoned With Credential Stealer — SecurityWeek](https://www.securityweek.com/microsoft-agent-framework-releases-poisoned-with-credential-stealer/)
- [Agent Framework PyPI package compromised with credential stealer — Socket.dev](https://socket.dev/blog/agent-framework-pypi-package-compromised-with-credential-stealer)
- [Microsoft's agent-framework Hijacked on PyPI via Silent .pth Startup Hook — JFrog Security Research](https://research.jfrog.com/post/agent-framework-hijack/)
- [Microsoft agent-framework on PyPI: Credential Stealer — Mend](https://www.mend.io/blog/microsoft-agent-framework-pypi-credential-stealer/)
