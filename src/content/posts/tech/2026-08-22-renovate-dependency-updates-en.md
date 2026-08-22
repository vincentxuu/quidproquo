---
title: "Renovate: Turning Dependency Updates into a Governed Continuous Process"
date: 2026-08-22
category: tech
type: deep-dive
tags: [renovate, dependencies, automation, supply-chain, devops]
lang: en
tldr: "Renovate is more than an update-PR bot: packageRules, grouping, schedules, minimum release age, and automerge policy determine update speed, review noise, and supply-chain exposure."
description: "Renovate managers, datasources, packageRules, presets, Dependency Dashboard, grouping, automerge, lockfile maintenance, and secure update strategy."
series:
  name: "AI 時代的技術選擇"
  order: 115
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-renovate-dependency-updates)

[Renovate](https://docs.renovatebot.com/) scans package manifests, lockfiles, container images, GitHub Actions, Terraform, and other declarations. Managers extract current dependencies, datasources discover releases, and configuration controls branches and pull requests. Its value is policy for cadence, risk, and ownership—not a queue of bot PRs.

## packageRules is an update-governance language

Rules match packages, datasources, managers, dependency types, SemVer update types, release age, and vulnerability signals and then set groups, schedules, labels, reviewers, range strategies, and automerge. Runtime majors, dev-tool patches, container digests, and GitHub Action SHAs deserve different policies.

```json
{
  "extends": ["config:recommended"],
  "packageRules": [{
    "matchDepTypes": ["devDependencies"],
    "matchUpdateTypes": ["patch"],
    "automerge": true
  }]
}
```

Grouping reduces noise but makes failures harder to isolate, and one package can block a whole group. Monorepo presets synchronize related packages. Security updates should bypass ordinary monthly schedules. The Dependency Dashboard exposes pending, blocked, errored, and approval-gated work, useful for manually approving majors.

## Tests and branch protection bound automerge trust

Automerge means rules and required checks passed, not that a release is benign or semantically compatible. Begin with lockfile maintenance and low-risk dev patches. Production dependencies need reliable unit, integration, and end-to-end tests, artifact scanning, rollout, and rollback. Give bot tokens minimal permissions and keep secrets away from forked or untrusted code.

`minimumReleaseAge` leaves time for unpublishing and malware detection, but may delay security fixes, so vulnerability updates need exceptions. SHA-pinned Actions and digest-pinned images improve reproducibility; PRs should retain readable versions and verify upstream identity.

Renovate orchestrates updates across ecosystems. Dependabot offers tighter GitHub integration; Socket.dev analyzes behavior; Snyk and OSV supply vulnerability intelligence; Sigstore and SLSA verify provenance. Update automation accelerates remediation but is not a security verdict.

## References

- [Renovate documentation](https://docs.renovatebot.com/)
- [Configuration options](https://docs.renovatebot.com/configuration-options/)
- [Presets](https://docs.renovatebot.com/key-concepts/presets/)
- [Automerge](https://docs.renovatebot.com/key-concepts/automerge/)
- [Dependency Dashboard](https://docs.renovatebot.com/key-concepts/dashboard/)
- [Best-practices preset](https://docs.renovatebot.com/presets-config/#configbest-practices)
