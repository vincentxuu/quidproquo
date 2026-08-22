---
title: "Renovate：把 Dependency Updates 變成可治理的持續流程"
date: 2026-08-22
category: tech
type: deep-dive
tags: [renovate, dependencies, automation, supply-chain, devops]
lang: zh-TW
tldr: "Renovate 不只是開升級 PR；packageRules、grouping、schedule、minimumReleaseAge 與 automerge policy 決定更新速度、review noise 和供應鏈暴露。"
description: "介紹 Renovate managers、datasources、packageRules、presets、dependency dashboard、grouping、automerge、lockfile maintenance 與安全更新策略。"
series:
  name: "AI 時代的技術選擇"
  order: 115
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-renovate-dependency-updates-en)

[Renovate](https://docs.renovatebot.com/) 掃描 repository 內 package manifests、lockfiles、Docker image、GitHub Actions、Terraform 等依賴宣告，透過 manager 抽取目前版本、datasource 查新版本，再依 configuration 產 branch/PR。真正價值是把更新頻率、風險分級與責任寫成 policy，而不是累積一排 bot PR。

## packageRules 是更新治理語言

可依 package、datasource、manager、dependency type、SemVer update type、age、vulnerability 等條件設定 group、schedule、labels、reviewers、range strategy 與 automerge。Production runtime major、dev-tool patch、Docker digest 與 GitHub Action SHA 不應套同一規則。

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

Grouping 能降低 PR noise，但一組太大會讓失敗難定位，且其中一個 package 阻塞全組。Monorepo preset 可把同系列 packages 同步升級；security update 則不應等一般 monthly schedule。Dependency Dashboard 提供 pending、blocked、error 與 approval queue，適合讓 major updates 先經人工批准。

## Automerge 的信任邊界是 tests 與 branch protection

Automerge 只代表規則與 required checks 綠，不代表 dependency 沒有惡意行為或 semantic regression。先從 lockfile maintenance、低風險 dev dependency patch 開始；production dependency 必須有可靠 unit/integration/e2e、artifact scan 和 rollout/rollback。Bot token 採最小 permissions，fork/untrusted code 不得取得 secrets。

`minimumReleaseAge` 可延遲採用剛發布版本，為撤版與 malware detection 留觀察窗；代價是 security fix 也可能被延後，需為 vulnerability alerts 設例外。Pin GitHub Actions SHA、Docker digest 可提高 reproducibility，但 Renovate PR 仍應顯示人可讀版本並驗證 upstream identity。

Renovate 適合跨 ecosystem 的依賴更新 orchestration。Dependabot 與 GitHub 整合更直接；Socket.dev 分析 package behavior；Snyk/OSV 提供 vulnerability intelligence；Sigstore/SLSA 驗證 artifact provenance。更新 automation 是修補速度的引擎，不是安全 verdict。

## 參考資料

- [Renovate documentation](https://docs.renovatebot.com/)
- [Configuration options](https://docs.renovatebot.com/configuration-options/)
- [Presets](https://docs.renovatebot.com/key-concepts/presets/)
- [Automerge](https://docs.renovatebot.com/key-concepts/automerge/)
- [Dependency Dashboard](https://docs.renovatebot.com/key-concepts/dashboard/)
- [Best-practices preset](https://docs.renovatebot.com/presets-config/#configbest-practices)
