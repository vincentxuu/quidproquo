---
title: "zizmor：專門掃 GitHub Actions 的 Template Injection 與 Token 風險"
date: 2026-08-22
category: tech
type: deep-dive
tags: [zizmor, github-actions, ci-security, supply-chain, security]
lang: zh-TW
tldr: "zizmor 針對 workflow/action YAML 做 domain-specific static analysis，找 template injection、過寬 permissions、artifact credential leak 與 unpinned uses；它不分析被呼叫 shell script 本身。"
description: "介紹 zizmor audits、GitHub Actions expression injection、permissions、SHA pinning、artipacked、online/offline mode、autofix 與 CI integration。"
series:
  name: "AI 時代的技術選擇"
  order: 117
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-zizmor-github-actions-security-en)

[zizmor](https://docs.zizmor.sh/) 是針對 GitHub Actions workflows 與 composite actions 的 static analyzer。CI YAML 同時是程式、權限宣告與供應鏈入口；一般 YAML lint 只看 syntax，zizmor 理解 `${{ }}` expression、events、job permissions、`uses:` references、credentials persistence 與 artifact flow。

## Template expression 進 shell 是 code injection

`run: echo "${{ github.event.issue.title }}"` 會在 shell 啟動前把 attacker-controlled title 展開成 script text。安全做法是先放進 environment variable，再由 shell 以正確 quoting 當 data 使用。`pull_request_target`、issue/comment events、fork checkout 與 privileged secrets 組合尤其危險；不能只在某一行加 quote 就假設整個 workflow safe。

`permissions` 應從 workflow/job 明確設 `{}` 或最小 read/write scopes，publish/deploy job 再個別提高。Checkout 的 persisted credential、artifact 中的 `.git` credential、cache poisoning 與 self-hosted runner persistence 都要一起審視。zizmor 的 `artipacked`、excessive permissions、template injection 等 audits 分別覆蓋部分風險。

## SHA pinning 防 ref 變動，不證明 action 安全

Branch/tag 可被移動，zizmor 預設 `unpinned-uses` policy 要求 actions 以 full commit SHA pin。仍需確認該 SHA 對應可信 release、review action source、由 Renovate 更新 digest。Pin 只防 upstream ref 後續改寫，無法消除被 pin commit 本身的惡意行為。

Offline audit 可找多數 syntax/policy issues；online mode 查 GitHub API 解析 refs、remote actions 與 autofix，token 對 private repositories 通常只需 contents read。`--fix` 預設做 safe fixes，unsafe fixes 必須 review。Ignore 可 inline 或 `zizmor.yml`，要限到最小 line/column、附理由與 expiry。

zizmor 不分析 `run:` 指向的 shell/Python script 內容，也不能模擬所有 runtime permission。搭配 CodeQL/Semgrep 掃 source、gitleaks 掃 secrets、action SHA pinning、OIDC short-lived publish identity、environment approvals 與 branch protection。Workflow change 應視為 production code/security boundary 由 CODEOWNERS 審查。

## 參考資料

- [zizmor documentation](https://docs.zizmor.sh/)
- [Quickstart](https://docs.zizmor.sh/quickstart/)
- [Audit rules](https://docs.zizmor.sh/audits/)
- [Unpinned uses audit](https://docs.zizmor.sh/audits/#unpinned-uses)
- [Usage and limitations](https://docs.zizmor.sh/usage/)
- [Configuration](https://docs.zizmor.sh/configuration/)
