---
title: "zizmor: Finding Template Injection and Token Risks in GitHub Actions"
date: 2026-08-22
category: tech
type: deep-dive
tags: [zizmor, github-actions, ci-security, supply-chain, security]
lang: en
tldr: "zizmor performs domain-specific static analysis on workflow and action YAML for template injection, broad permissions, artifact credential leaks, and unpinned uses; it does not analyze called shell scripts."
description: "zizmor audits, GitHub Actions expression injection, permissions, SHA pinning, artipacked, online and offline modes, autofix, and CI integration."
series:
  name: "Technology Choices in the AI Era"
  order: 117
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-zizmor-github-actions-security)

[zizmor](https://docs.zizmor.sh/) is a static analyzer for GitHub Actions workflows and composite actions. CI YAML is simultaneously code, a permission declaration, and a supply-chain entry point. Generic YAML lint sees syntax; zizmor understands expressions, events, job permissions, `uses:` references, persisted credentials, and artifact flow.

## Template expressions entering a shell are code injection

`run: echo "${{ github.event.issue.title }}"` expands an attacker-controlled title into script text before the shell starts. Put the value into an environment variable and consume it as quoted data. Combinations of `pull_request_target`, issue or comment events, fork checkout, and privileged secrets are especially hazardous. Quoting one line does not prove the workflow safe.

Set workflow or job `permissions` to `{}` or minimal scopes, elevating only publish and deploy jobs. Review persisted checkout credentials, `.git` credentials packed into artifacts, cache poisoning, and self-hosted runner persistence. zizmor audits such as `artipacked`, excessive permissions, and template injection cover distinct parts of this surface.

## SHA pinning prevents ref movement, not malicious actions

Branches and tags can move, so `unpinned-uses` defaults to full commit SHAs. Confirm the SHA corresponds to a trusted release, review source, and let Renovate update it. Pinning prevents later ref replacement but does not make the pinned commit benign.

Offline mode finds many syntax and policy issues. Online mode queries GitHub to resolve refs and remote actions and support fixes; private-repository tokens generally need read-only contents. `--fix` defaults to safe changes, while unsafe fixes require review. Scope inline or `zizmor.yml` ignores to the narrowest location with rationale and expiry.

zizmor does not analyze shell or Python scripts invoked by `run:` and cannot simulate every runtime permission. Combine it with CodeQL or Semgrep, gitleaks, SHA pinning, short-lived OIDC publishing identities, environment approvals, and branch protection. Treat workflow changes as production security boundaries under CODEOWNERS review.

## References

- [zizmor documentation](https://docs.zizmor.sh/)
- [Quickstart](https://docs.zizmor.sh/quickstart/)
- [Audit rules](https://docs.zizmor.sh/audits/)
- [Unpinned uses audit](https://docs.zizmor.sh/audits/#unpinned-uses)
- [Usage and limitations](https://docs.zizmor.sh/usage/)
- [Configuration](https://docs.zizmor.sh/configuration/)
