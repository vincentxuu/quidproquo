---
title: "Security Alert | LiteLLM's Release Pipeline Compromised — A Claude Code Token Leak Traces Back to an LLMjacking Supply Chain Attack"
date: 2026-10-23
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: en
description: "LiteLLM's PyPI/Docker Hub/GHCR release pipeline was compromised on October 21, shipping a malicious v1.107.0 with a credential stealer and backdoor. The suspected root cause: Claude Code embedding a user's GitHub CLI OAuth token in a response body that got logged and later exfiltrated."
tldr: "LiteLLM v1.107.0 (PyPI/Docker Hub/GHCR) was swapped for a malicious build on the morning of 2026-10-21 UTC, carrying a backdoor that steals cloud/AI credentials and phones home hourly to run arbitrary code. Wiz observed the stolen AWS credentials being tested against Bedrock just 4.5 hours later — a pattern consistent with LLMjacking. The suspected root cause: an internal deployment that was accidentally exposed to the public internet had logged a GitHub CLI OAuth token that Claude Code had embedded in a response body, and attackers used that token to seize release access. Defense: check whether you installed v1.107.0, isolate and rotate every credential immediately, and pin containers by digest instead of tag."
series:
  name: "AI Security Alert"
  order: 61
---

> 🌏 [中文版](/posts/daily/2026-10-23-security-litellm-supply-chain-llmjacking)

## Summary

LiteLLM, the open-source LLM gateway/proxy project, had its release pipeline compromised around 4:00 a.m. PST on October 21, 2026, pushing a malicious build (v1.107.0) carrying a credential stealer and backdoor to PyPI, Docker Hub, and GHCR. Anyone who installed it via pip without pinning a version between 11:39–13:23 UTC, or who pulled the `v1.107.0`/`latest`/`main-latest`/`main-stable` Docker tags between 11:46–14:20 UTC, is affected. LiteLLM's own investigation currently points to a root cause where attackers broke into an internal deployment that had been accidentally exposed to the public internet, and recovered a GitHub CLI OAuth token that leaked into that deployment's logs — because Claude Code, in certain situations, embeds a user's OAuth token in its response body, and once a response gets logged, the token goes with it. The attackers then used that access to hijack the release workflow. This is LiteLLM's second supply chain compromise this year (the first, back in March, was attributed to TeamPCP); the team pulled the malicious build faster this time, but the technique itself was stealthier.

**Key facts**

| Item | Value |
|---|---|
| Incident type | Supply chain attack (compromised release pipeline, not a code vulnerability) |
| Scope | Any environment that installed an unpinned pip version, or pulled the `v1.107.0`/`latest`/`main-latest`/`main-stable` Docker/GHCR image, during the October 21 UTC morning window; enterprise customers on LiteLLM's private registry were not affected |
| Severity | Critical |
| CVE | None (treated as a supply chain incident rather than a single code flaw; no CVE was requested) |
| Sources | [The Hacker News](https://thehackernews.com/2026/10/litellm-suspects-github-token-leak-in.html), [LiteLLM's official advisory](https://docs.litellm.ai/blog/security-incident-oct-21-2026), [Wiz](https://www.wiz.io/blog/litellm-compromised-steals-credentials), [Aikido](https://www.aikido.dev/blog/litellm-compromised-infostealer-rat), [JFrog](https://research.jfrog.com/post/litellm-hijacked-again/) |

## Attack Surface Analysis

The attackers didn't need a bug in LiteLLM's code — they went straight for the question of who gets to publish a release. The chain started on October 19, when the maintainers temporarily widened release permissions so two internal engineers could ship daily bugfix backports for customers. The attackers had their hands on three sets of developer GitHub CLI credentials, one of which could trigger GitHub workflows; they used a token belonging to a GitHub organization owner to disable branch protection, force-pushed the malicious changes in, and pointed the release workflow at a lookalike repository (`Berri-AI/litellm`, a single hyphen away from the real `BerriAI/litellm`) so the signing and publish steps treated the poisoned artifact as legitimate. LiteLLM currently suspects those credentials originated from an internal deployment that was "accidentally exposed to the public internet, under an innocuously named account" — and that this machine's logs contained a GitHub CLI OAuth token because Claude Code, under certain conditions, embeds a user's OAuth token in the response body it returns, and once that response gets logged, the token leaks right along with it.

```diagram
title: Root-cause chain behind the LiteLLM release pipeline compromise
desc: Claude Code's response embeds a GitHub OAuth token, which an internet-exposed internal deployment logs; attackers steal it and use it to push a poisoned release to the package registry.
step: Claude Code's response embeds a GitHub CLI OAuth token
step: Attackers breach the internet-exposed internal deployment
step: The deployment's logs leak the stolen OAuth token
step: Attackers use the stolen access to push poisoned build v1.107.0
---
<svg viewBox="0 0 720 320">
  <line class="dg-rule" x1="108" y1="72" x2="108" y2="300"/>
  <line class="dg-rule" x1="280" y1="72" x2="280" y2="300"/>
  <line class="dg-rule" x1="452" y1="72" x2="452" y2="300"/>
  <line class="dg-rule" x1="624" y1="72" x2="624" y2="300"/>

  <g data-step="1">
    <path class="dg-line" d="M108 132H276" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="194" y="120" text-anchor="middle" dominant-baseline="central">response w/ token</text>
  </g>
  <g data-step="2">
    <path class="dg-line" d="M452 180H284" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="366" y="168" text-anchor="middle" dominant-baseline="central">breach exposed host</text>
  </g>
  <g data-step="3">
    <path class="dg-line dg-line--dashed" d="M280 228H448" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="366" y="216" text-anchor="middle" dominant-baseline="central">steal OAuth token</text>
  </g>
  <g data-step="4">
    <path class="dg-line dg-line--accent" d="M452 276H620" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-text--accent" x="538" y="264" text-anchor="middle" dominant-baseline="central">push poisoned build</text>
  </g>

  <rect class="dg-box" x="42" y="24" width="132" height="48" rx="6"/>
  <text class="dg-label" x="108" y="48" text-anchor="middle" dominant-baseline="central">Claude Code</text>
  <rect class="dg-box" x="214" y="24" width="132" height="48" rx="6"/>
  <text class="dg-label" x="280" y="48" text-anchor="middle" dominant-baseline="central">Internal host</text>
  <rect class="dg-box" x="386" y="24" width="132" height="48" rx="6"/>
  <text class="dg-label" x="452" y="48" text-anchor="middle" dominant-baseline="central">Attacker</text>
  <rect class="dg-box dg-box--accent" x="558" y="24" width="132" height="48" rx="6"/>
  <text class="dg-label" x="624" y="48" text-anchor="middle" dominant-baseline="central">Release pipeline</text>
</svg>
```

The malicious build's own tradecraft was also stealthier than March's incident. Installing the package dropped a `cook.pth` path file that made the Python interpreter automatically import `cook.py` on every startup — a script that deobfuscates itself and runs a stealer routine named "privcollect," harvesting system, browser, developer, cloud, and AI tool credentials and POSTing them to an attacker-controlled domain. The same install also dropped a `sitecustomize.py` that only runs on Linux/macOS, spinning up a background daemon that polls a GitHub "dead drop" file every hour for the attacker's current C2 domain, then downloads and executes a second-stage Python payload from it. Wiz noted that combining both the `.pth` file and `sitecustomize.py` launch points in the same attack is the first documented case of this dual technique in the wild. Wiz subsequently observed that, starting about 4.5 hours after the exfiltration, attackers began running `sts:GetCallerIdentity` against the stolen AWS instance role credentials, followed by `bedrock:ListFoundationModels` and `ListModels` calls — a combination that is a textbook LLMjacking probe (confirm the credential works, then survey which models are available to abuse); in a subset of environments, attackers went further and enumerated IAM roles and users.

Mapped to the OWASP LLM Top 10, the root cause falls squarely under **LLM05: Supply Chain Vulnerabilities** — once any link in the release pipeline's trust chain (a temporarily widened permission, a CI credential, the signing process) fails, every downstream installer gets poisoned regardless of how clean the application code itself is. But the more interesting wrinkle here is what triggered the breach in the first place: **an AI tool's output, once logged, can become an unexpected credential leak path.** This isn't the usual "we forgot to redact a secret in the logs" mistake — it's an agent tool embedding an identity credential in its normal response content, so that any downstream system that logs responses as a matter of course ends up leaking the token too. That's a fresh variant of LLM02: Sensitive Information Disclosure, specific to agentic tool chains.

## Defenses

**Immediate actions**
- Check whether you installed LiteLLM `v1.107.0`: run `pip show litellm` for the version, or `docker images | grep litellm` and compare image digests (note that `latest`, `main-latest`, and `main-stable` all pointed at the poisoned build during the window)
- If you find it: remove it immediately, isolate any host that ran it, hunt for `cook.pth`, `cook.py`, and `sitecustomize.py` in your Python package directories, and block outbound traffic to the known exfiltration domain
- Assume every credential reachable from that host — cloud API keys, CI tokens, GitHub CLI OAuth tokens, AI provider keys — is compromised, and rotate all of them; don't just edit a local config file
- Audit any logging system that captures the output of AI tools or agents, and confirm response bodies aren't inadvertently carrying OAuth tokens or other identity credentials

**Longer-term architecture**
- Pin containers and packages by digest instead of tag (a `latest`-style tag will hand the poisoned build to everyone pulling it the moment a supply chain attack happens); lock dependency hashes in CI
- Treat every "temporary" expansion of release permissions as a red flag — this incident started with a routine, short-lived permission grant, and there needs to be an explicit process for revoking and auditing it afterward
- From the watchlist, Protect AI specializes in scanning AI/ML supply-chain packages and artifacts for malicious code injected into build configs or startup hooks — a good fit for gating version bumps on tooling like LiteLLM or model files
- If you pipe agentic coding tools (like Claude Code) through a logging proxy or gateway, evaluate whether responses need credential masking before they're written to logs, so an agent's normal output doesn't become an accidental credential leak

## Impact

LiteLLM says the poisoned build was pulled within 3 hours of release, and enterprise customers on its private registry were unaffected — but anyone pulling from the public PyPI/Docker Hub/GHCR channels without version pinning could still have installed it during the window. Because the malware activates globally through Python's `.pth`/`sitecustomize` mechanism, "any program run in that Python environment — not just one that calls LiteLLM — would trigger it," which means the real blast radius is likely wider than a simple download count would suggest. Wiz has confirmed stolen cloud credentials being used for LLMjacking probes, but public reporting so far hasn't quantified exactly how many accounts were affected or the financial scale of any model abuse. It's also worth noting that while this attack reused the `.pth` technique from March's TeamPCP incident, the security research community (Socket) has found no evidence so far linking the two directly.

## Today's Takeaway

What surprised me most about this incident wasn't the attack mechanics themselves — supply chain compromise, credential theft, and LLMjacking are all familiar patterns. It's the extra link in the root-cause chain: an AI coding agent's normal behavior (embedding an OAuth token in its response) became the starting point for an attacker to seize release access, simply because a downstream system logged that output as a matter of routine. I used to think about credential leaks mostly in terms of human error — hardcoding a secret, checking in a config file by mistake. This is a reminder that any step where an agent tool's output passes through an identity credential — logging, monitoring, debug dumps — needs to be treated as a potential leak surface, not just the places where a person might fat-finger a copy-paste.

## References

- [LiteLLM Suspects GitHub Token Leak in AI Gateway Logs Behind Malicious Package Release - The Hacker News](https://thehackernews.com/2026/10/litellm-suspects-github-token-leak-in.html)
- [LiteLLM official security incident advisory](https://docs.litellm.ai/blog/security-incident-oct-21-2026)
- [LiteLLM compromised: credentials stolen via infostealer and RAT - Wiz](https://www.wiz.io/blog/litellm-compromised-steals-credentials)
- [LiteLLM compromised with infostealer and RAT - Aikido](https://www.aikido.dev/blog/litellm-compromised-infostealer-rat)
- [LiteLLM Hijacked Again - JFrog Research](https://research.jfrog.com/post/litellm-hijacked-again/)
- [OWASP LLM Top 10 — LLM05: Supply Chain Vulnerabilities](https://genai.owasp.org/llmrisk/llm05-supply-chain/)
- [OWASP LLM Top 10 — LLM02: Sensitive Information Disclosure](https://genai.owasp.org/llmrisk/llm02-sensitive-information-disclosure/)
