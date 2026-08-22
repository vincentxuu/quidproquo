---
title: "gitleaks: Secret Detection across Working Trees, Git History, and CI Diffs"
date: 2026-08-22
category: tech
type: deep-dive
tags: [gitleaks, secrets, git, security, devsecops]
lang: en
tldr: "gitleaks scans files or Git patches with rules, regexes, entropy, and allowlists; after a finding, revoke and rotate first rather than merely deleting a file or rewriting history."
description: "gitleaks git, dir, and stdin modes, rules, allowlists, baselines, pre-commit, CI, redaction, history scanning, and incident response."
series:
  name: "AI 時代的技術選擇"
  order: 116
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-gitleaks-secret-scanning)

[gitleaks](https://github.com/gitleaks/gitleaks) is an open-source secret scanner. `gitleaks git` reads commit patches through `git log -p`, `dir` scans current files, and `stdin` accepts pipeline content. Default rules combine token prefixes, regexes, keywords, and entropy; `.gitleaks.toml` can model internal credentials.

## Three scan times catch different layers

Pre-commit and pre-push provide fast feedback but can be bypassed. Pull-request CI scans new commits as a required check. Scheduled full-history scans cover old branches, tags, and secrets recognized by updated rules. Build artifacts, container layers, tickets, chat, and CI logs may never enter Git and need separate platform scanning and log hygiene.

Large legacy repositories can use JSON or SARIF reports as baselines so CI blocks only new findings. A baseline does not make old secrets safe: determine validity and rotate first, then track invalid findings by fingerprint. Use global and rule allowlists or `gitleaks:allow` only for confirmed fixtures and explain them. Broad path exclusions easily hide real leaks.

## Revoke before cleaning Git

Assume a committed secret has been cloned, cached, indexed, or logged. Revoke or rotate it, inspect provider audit records, identify exposure and use, update dependent services, and only then consider history rewriting. Rewriting affects forks, open PRs, and commit SHAs and cannot recall copied credentials.

Scanner output may contain secret material, so redact CI output and restrict artifact retention and logs. Pin the tool version or action digest, use minimal tokens, and verify shallow clones cover the intended commit range. The upstream project now describes Gitleaks as feature complete with future security fixes, so include maintenance status and migration options in adoption.

gitleaks specializes in secret detection; Semgrep Secrets adds semantic analysis and validation; GitHub secret scanning offers partner alerts and push protection; zizmor finds workflow paths that expose tokens. Short-lived credentials, OIDC workload identity, and least privilege remain the strongest layer because leaked values expire quickly.

## References

- [Gitleaks repository and documentation](https://github.com/gitleaks/gitleaks)
- [Gitleaks configuration](https://github.com/gitleaks/gitleaks#configuration)
- [Creating a baseline](https://github.com/gitleaks/gitleaks#creating-a-baseline)
- [GitHub secret scanning concepts](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning)
