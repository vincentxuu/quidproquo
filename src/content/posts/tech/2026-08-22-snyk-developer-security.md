---
title: "Snyk：把 SCA、SAST、Container 與 IaC Findings 接進開發流程"
date: 2026-08-22
category: tech
type: deep-dive
tags: [snyk, appsec, sca, sast, container-security]
lang: zh-TW
tldr: "Snyk 的價值是把 code、open-source、container 與 IaC findings 對到 project、fix path 與 developer workflow；成功導入取決於 baseline、ownership 與可執行的 policy。"
description: "介紹 Snyk Code、Open Source、Container、IaC、reachability、monitoring、fix PR、policy、CI gating 與資料邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 112
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-snyk-developer-security-en)

[Snyk](https://docs.snyk.io/scan-with-snyk) 把多種 application security 分析放進同一平台：Open Source 做 dependency vulnerability/license SCA，Code 做 source static analysis，Container 盤點 final image 內 OS/application packages，IaC 掃 Terraform、Kubernetes、CloudFormation 等設定與部分 deployed cloud state。

## 同一 CVE 在不同 artifact 不是同一修法

Manifest scan 看 dependency graph；container scan 看實際 image filesystem，可能包含 OS package、unmanaged binary 或不同於 manifest 的 compiled artifact。IaC finding 是 configuration path，SAST finding 是 source-to-sink code flow。Project target、branch、build context、package manager 與 image digest 必須可追溯，否則 dashboard 的 duplicate findings 無法分派。

Open Source 提供 upgrade/pin/remediation advice，但「有 fixed version」不代表升級安全；要跑 compatibility tests。Reachability 可降低「dependency 存在但 vulnerable function 沒被呼叫」的優先級，仍受語言與分析支援限制，也不能證明未來 input/path 永不可達。Exploit maturity、asset exposure、business criticality、fix availability 與 compensating control 應一起排序。

## Gate 新風險，不要第一天封死歷史 backlog

大型舊 codebase 可先 baseline，PR 只阻擋新增 critical/high 或違反 license policy，再逐步清 backlog。每個 exception 要有 issue、owner、expiry 與 reason。`snyk test` 適合 CI 即時 gate；`snyk monitor` 保存 snapshot 並在 database 新增 disclosure 時持續重評。兩者不能互相取代。

Fix PR 會改 dependency graph 或 base image，仍要 human review、lockfile diff、tests 與 rollout。Snyk SCM/CI integration 需要 source、manifest、image registry 或 cloud metadata 權限；導入前核對 code upload、region、retention、broker/self-hosted integration 與 token scope。

Snyk 適合需要跨 code/dependency/container/IaC 統一 governance 的組織。Socket.dev 更著重 package behavior 與 malware；Semgrep 易寫 organization-specific code rules；CodeQL 適合深 semantic/data-flow queries；Trivy 是開源 artifact/config scanner。先定義 coverage matrix，再選工具，避免買了四個 scanner 卻留下同一個 deploy path 沒掃。

## 參考資料

- [Snyk scanning overview](https://docs.snyk.io/scan-with-snyk)
- [Snyk Open Source](https://docs.snyk.io/scan-with-snyk/snyk-open-source)
- [Snyk Code](https://docs.snyk.io/scan-with-snyk/snyk-code)
- [How Snyk Container works](https://docs.snyk.io/scan-with-snyk/snyk-container/how-snyk-container-works)
- [Snyk IaC](https://docs.snyk.io/scan-with-snyk/snyk-iac)
- [Reachability analysis](https://docs.snyk.io/manage-risk/prioritize-issues-for-fixing/reachability-analysis)
