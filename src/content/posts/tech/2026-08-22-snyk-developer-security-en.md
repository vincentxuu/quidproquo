---
title: "Snyk: Connecting SCA, SAST, Container, and IaC Findings to Development"
date: 2026-08-22
category: tech
type: deep-dive
tags: [snyk, appsec, sca, sast, container-security]
lang: en
tldr: "Snyk maps code, open-source, container, and IaC findings to projects, remediation paths, and developer workflows; successful adoption depends on baselines, ownership, and executable policy."
description: "Snyk Code, Open Source, Container, IaC, reachability, monitoring, fix PRs, policy, CI gates, and data boundaries."
series:
  name: "AI 時代的技術選擇"
  order: 112
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-snyk-developer-security)

[Snyk](https://docs.snyk.io/scan-with-snyk) combines several application-security surfaces: Open Source scans dependencies and licenses, Code performs source analysis, Container inventories OS and application packages in final images, and IaC scans Terraform, Kubernetes, CloudFormation, and selected deployed cloud state.

## One CVE in different artifacts needs different remediation

A manifest scan sees a dependency graph; a container scan sees the built filesystem, including OS packages, unmanaged binaries, and compiled artifacts that may differ from manifests. IaC findings point to configuration paths, while SAST follows code flows. Project target, branch, build context, package manager, and image digest must remain traceable or duplicate dashboard findings cannot be owned.

Open Source suggests upgrades and pins, but a fixed version still needs compatibility tests. Reachability can lower the priority of a dependency whose vulnerable function is not called, subject to language and analysis support; it does not prove future inputs can never reach that code. Rank exploit maturity, exposure, asset criticality, fix availability, and compensating controls together.

## Gate new risk before freezing a historical backlog

Baseline a large legacy codebase, block newly introduced critical or high issues and license violations in PRs, then burn down existing debt. Every exception needs an issue, owner, expiry, and reason. `snyk test` provides an immediate CI gate; `snyk monitor` stores a snapshot and reevaluates it as disclosures change. Neither replaces the other.

Fix PRs alter graphs and base images and still require review, lockfile inspection, tests, and rollout. SCM and CI integrations may access source, manifests, registries, and cloud metadata. Check upload behavior, region, retention, brokers, and token scope.

Snyk fits organizations needing common governance across code, dependencies, containers, and IaC. Socket.dev emphasizes package behavior and malware; Semgrep makes custom code policy accessible; CodeQL enables deep semantic queries; Trivy is an open-source artifact and configuration scanner. Define a coverage matrix first so several scanners do not all miss the same deployment path.

## References

- [Snyk scanning overview](https://docs.snyk.io/scan-with-snyk)
- [Snyk Open Source](https://docs.snyk.io/scan-with-snyk/snyk-open-source)
- [Snyk Code](https://docs.snyk.io/scan-with-snyk/snyk-code)
- [How Snyk Container works](https://docs.snyk.io/scan-with-snyk/snyk-container/how-snyk-container-works)
- [Snyk IaC](https://docs.snyk.io/scan-with-snyk/snyk-iac)
- [Reachability analysis](https://docs.snyk.io/manage-risk/prioritize-issues-for-fixing/reachability-analysis)
