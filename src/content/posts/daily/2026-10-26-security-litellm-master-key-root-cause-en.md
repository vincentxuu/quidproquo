---
title: "Security Alert | LiteLLM Supply Chain Attack — Root Cause Update: An Unrevoked Master Key Leaked Five Months Earlier"
date: 2026-10-26
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: en
description: "LiteLLM's full incident report rules out the earlier Claude Code log-leak theory: the real root cause of the October 21 supply chain attack was an Agent Platform master key that leaked in May and was never revoked. Attackers also used a near-invisible self-deleting GitHub Actions technique to steal more credentials."
tldr: "On October 24, LiteLLM published its full attack-chain investigation and retracted the October 23 theory that Claude Code's response logging leaked the GitHub token. The confirmed root cause: an Agent Platform master key leaked on May 27, 2026 into a public repo and was never actually revoked. On October 10, attackers used that key to steal an over-scoped (org-owner-level) GitHub token, then used throwaway branches with push-triggered workflows that self-deleted within minutes to steal more secrets almost invisibly, before hijacking the release pipeline on October 21. Defense: once a credential has leaked, assume it's compromised and force revocation even if the commit was overwritten; auditing GitHub Actions can't rely on existing branches alone — check the activity log."
series:
  name: "AI Security Alert"
  order: 63
---

> 🌏 [中文版](/posts/daily/2026-10-26-security-litellm-master-key-root-cause)

## Summary

On October 24, LiteLLM published its complete attack-chain investigation into the October 21 supply chain attack (the malicious v1.107.0 build shipped to PyPI, Docker Hub, and GHCR), and pushed the root cause back nearly five months — formally retracting the earlier theory. The hypothesis covered in this series on October 23 — that Claude Code had embedded a user's GitHub CLI OAuth token in a response body, which then got logged by an exposed internal deployment and leaked — has now been officially ruled out. The real starting point was an accidental commit on May 27, 2026 that leaked LiteLLM Agent Platform's master key, which was **never actually revoked** afterward. The update also adds technical detail Socket.dev dug up: attackers used a technique of creating short-lived branches that trigger an auto-run workflow and get deleted within minutes, leaving the credential theft almost invisible in ordinary repo history.

**Key facts**

| Item | Value |
|---|---|
| Incident type | Supply chain attack (root cause: a long-unrevoked leaked credential combined with an over-scoped token) |
| Scope | Same affected population as the October 23 report (LiteLLM v1.107.0 users); this update revises the root cause and attack technique, not the blast radius |
| Severity | Critical |
| CVE | None (LiteLLM treats this as a supply chain incident, not a single code vulnerability) |
| Sources | [The Hacker News](https://thehackernews.com/2026/10/leaked-litellm-master-key-let-attackers.html), [LiteLLM's official attack-chain report](https://docs.litellm.ai/blog/security-incident-oct-21-2026-attack-chain), [Socket.dev](https://socket.dev/blog/litellm-attack-timeline), [Microsoft Security Research](https://www.microsoft.com/en-us/security/blog/2026/10/23/inside-the-litellm-1-107-0-supply-chain-compromise-credential-theft-through-python-startup-hooks/) |

## Attack Surface Analysis

The full timeline is longer and more detailed than what was reported on October 23:

```diagram
title: Full timeline of the LiteLLM supply chain attack (official Oct 24 update)
desc: From a leaked master key in May to the release-pipeline hijack on October 21, with two near-invisible credential-theft runs in between.
step: 2026-05-27: Agent Platform master key accidentally committed to a public repo, never revoked afterward
step: 2026-10-10 22:11 UTC: attacker uses the master key to steal an over-scoped GitHub token
step: 2026-10-10 / 10-12: two rounds of credential theft via self-deleting branches running push-triggered workflows
step: 2026-10-21 10:08-11:08 UTC: branch protection overridden, release pipeline repointed to a lookalike repo
step: 2026-10-21 11:39 UTC: malicious v1.107.0 published to PyPI, Docker Hub, and GHCR
---
<svg viewBox="0 0 760 260">
  <line class="dg-rule" x1="60" y1="56" x2="60" y2="240"/>
  <line class="dg-rule" x1="220" y1="56" x2="220" y2="240"/>
  <line class="dg-rule" x1="380" y1="56" x2="380" y2="240"/>
  <line class="dg-rule" x1="540" y1="56" x2="540" y2="240"/>
  <line class="dg-rule" x1="700" y1="56" x2="700" y2="240"/>

  <g data-step="1">
    <circle class="dg-dot" cx="60" cy="100" r="6"/>
    <text class="dg-label" x="60" y="128" text-anchor="middle">05-27 master key leak</text>
    <text class="dg-caption" x="60" y="146" text-anchor="middle">never revoked after</text>
  </g>
  <g data-step="2">
    <path class="dg-line" d="M66 100H214" marker-end="url(#arrow)"/>
    <circle class="dg-dot" cx="220" cy="100" r="6"/>
    <text class="dg-label" x="220" y="128" text-anchor="middle">10-10 GitHub token stolen</text>
    <text class="dg-caption" x="220" y="146" text-anchor="middle">org-owner level</text>
  </g>
  <g data-step="3">
    <path class="dg-line dg-line--dashed" d="M226 100H374" marker-end="url(#arrow)"/>
    <circle class="dg-dot" cx="380" cy="100" r="6"/>
    <text class="dg-label" x="380" y="128" text-anchor="middle">more secrets via self-deleting branches</text>
    <text class="dg-caption" x="380" y="146" text-anchor="middle">two rounds, traces wiped in minutes</text>
  </g>
  <g data-step="4">
    <path class="dg-line" d="M386 100H534" marker-end="url(#arrow)"/>
    <circle class="dg-dot" cx="540" cy="100" r="6"/>
    <text class="dg-label" x="540" y="128" text-anchor="middle">10-21 release pipeline overridden</text>
    <text class="dg-caption" x="540" y="146" text-anchor="middle">repointed to lookalike repo</text>
  </g>
  <g data-step="5">
    <path class="dg-line dg-line--accent" d="M546 100H694" marker-end="url(#arrow-accent)"/>
    <circle class="dg-dot dg-dot--accent" cx="700" cy="100" r="6"/>
    <text class="dg-label dg-text--accent" x="700" y="128" text-anchor="middle">v1.107.0 published</text>
    <text class="dg-caption" x="700" y="146" text-anchor="middle">PyPI / Docker / GHCR</text>
  </g>
</svg>
```

It started on May 27, 2026, when a configuration file was committed to the public `LiteLLM-Labs/lite-harness` repo and accidentally contained the master key for LiteLLM Agent Platform — the tool the team uses internally to orchestrate coding agents. The team quickly spotted it and force-pushed over the commit, and judged that the leaked key needed to be revoked — but the master key itself was never actually revoked. That unrevoked key sat exposed for nearly five months until the night of October 10 (22:11–22:12 UTC), when an attacker used it to log into Agent Platform and extract a GitHub CLI OAuth token that was meant to let self-hosted cloud agents file pull requests on behalf of the service. The problem: that token "wasn't scoped down" — it was tied to the GitHub organization owner's account, so one step handed the attacker owner-level access across every repo in the organization. This is a textbook case of OWASP LLM06 Excessive Agency applied to a supply-chain setting: a credential granted to an agent tool carried far more scope than the task it was meant to perform (filing PRs), so a single leak became total compromise.

Rather than touching the release pipeline right away, the attacker first spent time stealing more credentials — using a technique Socket.dev later reconstructed from GitHub's activity logs. In two internal repos, `BerriAI/litellm` and `BerriAI/litellm-auto`, the attacker branched off a legitimate recent commit into a short-lived branch named `ci-tmp-<hex>`, pushed a workflow file (`.github/workflows/cache.yml`) with a commit message deliberately mimicking routine maintenance ("ci: bump cache config"), configured it to trigger on every push, let it run, and deleted the branch within minutes. Both runs (October 10 and October 12) completed so fast that, as Socket's researcher put it, the activity "leaves almost nothing behind in the repository's ordinary history" — only the activity log, not the branch list, reveals it happened. The first run harvested GitHub tokens and API keys for the team's Linear workspace, the LiteLLM deployment itself, and Together AI, plus the identifier and signing key of a GitHub App. The second run expanded the haul to API keys for Anthropic, OpenAI, AWS Bedrock, and Tavily — and, notably, the API key for GitGuardian, the very secret-scanning platform meant to catch this kind of leak, meaning the attacker gained the ability to see, and potentially suppress, the alerts that would have surfaced their own activity.

The actual release-pipeline hijack came on the morning of October 21: the attacker disabled branch protection and repointed the release source to a lookalike repo, `Berri-AI/litellm`, one hyphen off from the real `BerriAI/litellm`. This succeeded in part because of a timing coincidence: LiteLLM's normal release process requires one engineer to trigger a release and a separate, device-locked account to approve it, but that week the rule had been temporarily relaxed — to speed up bugfix backports — to let any two engineers trigger and approve each other's releases. The attacker, already holding two sets of maintainer-level credentials, simply plugged into that relaxed process. Tellingly, the attacker had org-owner-level access and could have disabled or rewritten the rule outright, but chose not to — likely to avoid leaving a more obvious trace. In other words, a routine, well-intentioned loosening of release controls the day before happened to open exactly the window the attacker needed.

## Defense

**Immediate actions**
- If your organization has ever accidentally committed a master key or any long-lived credential to a public repo, treat it as compromised and **actually complete revocation**, even if the commit was later overwritten — don't just mark it "pending revocation" and move on. The root cause here was precisely the gap between deciding a key needed revoking and actually revoking it.
- Audit the scope of GitHub tokens issued to agents or automation: check whether any are unnecessarily tied to an organization-owner account, and replace them with fine-grained tokens scoped to specific repos and operations.
- Check GitHub Actions activity logs, not just the current branch list, for the pattern of "create a short-lived branch, push a push-triggered workflow, delete the branch within minutes" — this is the newly disclosed technique, and it's invisible if you only look at existing branches.
- Review any temporary relaxation of release or approval permissions: confirm it has an expiry and a clear rollback mechanism, so "temporary" doesn't quietly become permanent.

**Long-term architecture**
- Leaked-credential handling needs an enforced closed loop: detect leak → mark for revocation → actually revoke → verify revocation took effect. All four steps are required; consider automated reconciliation between "marked pending revocation" and "still valid" credential lists.
- Protect AI, from this site's watchlist, offers supply chain scanning that can watch AI toolchain packages like LiteLLM for tampered releases or build configs — but the root cause here sits in credential lifecycle management, which scanning alone won't fix; pair it with a secrets-management platform that enforces revocation audits.
- CI/CD systems that allow `on: push` auto-triggered workflows deserve extra scrutiny: short-lived branches followed by immediate deletion is a detectable pattern (e.g., alert when a branch's lifetime falls below a threshold) rather than something you only discover by manually combing through the activity log.

## Impact

This update doesn't expand the affected population reported on October 23 (still users who installed v1.107.0 during the October 21 UTC morning window) — its significance is **correcting the root cause**. The earlier suspicion that Claude Code's response logging leaked the OAuth token has now been officially excluded; the real source traces back to a credential leak from six months earlier that was never properly cleaned up. Microsoft's malware analysis also adds persistence detail: v1.107.0 executes automatically at Python interpreter startup via `.pth` files and `sitecustomize.py`, triggering even if `litellm` is never imported, and because those startup files sit outside the LiteLLM application directory, removing only the application's own files can leave the malicious startup components behind. For any team running an agent platform that issues credentials so automation can act on GitHub or cloud resources, this incident demonstrates how an over-scoped credential and an incompletely revoked leaked credential compound into something far worse than either problem alone.

## Today's Takeaway

The October 23 report used the word "suspected" root cause, and this update directly overturned that theory — a reminder that early attribution in a security incident is often provisional, and should be revisited as the official investigation progresses rather than treated as final on day one. What's more striking is how far back the real root cause traced: a leak that was "overwritten and flagged for revocation" sat unresolved for nearly half a year before it was actually exploited, because the revocation itself was never completed. The lesson worth keeping isn't just "credentials leak" — it's that the step between identifying a risk and actually eliminating it, confirming the fix was really carried out, is often the easiest one to drop.

## References

- [Leaked LiteLLM Master Key Let Attackers Steal GitHub Tokens and Hijack Release Pipeline - The Hacker News](https://thehackernews.com/2026/10/leaked-litellm-master-key-let-attackers.html)
- [The attack chain behind the v1.107.0 LiteLLM release - LiteLLM official](https://docs.litellm.ai/blog/security-incident-oct-21-2026-attack-chain)
- [LiteLLM Attack Timeline - Socket.dev](https://socket.dev/blog/litellm-attack-timeline)
- [Inside the LiteLLM 1.107.0 Supply Chain Compromise - Microsoft Security Research](https://www.microsoft.com/en-us/security/blog/2026/10/23/inside-the-litellm-1-107-0-supply-chain-compromise-credential-theft-through-python-startup-hooks/)
- [Previous report in this series: LiteLLM's Release Pipeline Compromised (Oct 23 initial report)](/posts/daily/2026-10-23-security-litellm-supply-chain-llmjacking-en)
- [OWASP LLM Top 10 — LLM05: Supply Chain Vulnerabilities](https://genai.owasp.org/llmrisk/llm05-supply-chain/)
- [OWASP LLM Top 10 — LLM06: Excessive Agency](https://genai.owasp.org/llmrisk/llm06-excessive-agency/)
