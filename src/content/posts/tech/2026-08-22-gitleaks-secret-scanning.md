---
title: "gitleaks：掃 Working Tree、Git History 與 CI Diff 的 Secret Detection"
date: 2026-08-22
category: tech
type: deep-dive
tags: [gitleaks, secrets, git, security, devsecops]
lang: zh-TW
tldr: "gitleaks 用 rules、regex、entropy 與 allowlists 掃檔案或 Git patches；找到 secret 後第一步是 revoke/rotate，而不是只刪檔或改寫 history。"
description: "介紹 gitleaks git/dir/stdin modes、rules、allowlists、baseline、pre-commit、CI、redaction、history scanning 與 incident response。"
series:
  name: "AI 時代的技術選擇"
  order: 116
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-gitleaks-secret-scanning-en)

[gitleaks](https://github.com/gitleaks/gitleaks) 是開源 secret scanner。`gitleaks git` 透過 `git log -p` 掃 commits/patches，`dir` 掃目前 files，`stdin` 接 pipeline input。Default rules 依 token prefix、regex、keyword 與 entropy 找 API keys、passwords 等；`.gitleaks.toml` 可擴充 internal credential format。

## 三個掃描時間點各自攔一層

Pre-commit/pre-push 提供快速 developer feedback，但 hook 可被略過；PR CI 掃新增 commits 並作 required check；scheduled full-history scan 處理舊 branch、tag 與規則更新後才辨識出的 secrets。Build artifact、container layer、ticket、chat 與 CI log 不一定在 Git，另需平台 secret scanning 與 log hygiene。

大型 legacy repository 可輸出 JSON/SARIF report 作 baseline，使 CI 只阻擋新 findings。Baseline 不是「舊 secrets 安全」：先逐筆確認是否仍有效並 rotate，再把已失效 finding fingerprint 納管。Global/rule allowlists 與 `gitleaks:allow` 只用於測試 fixture 等確認是假陽性的內容，並附理由；寬鬆 path allowlist 很容易遮蔽真 leak。

## 發現後先撤銷，不先清 Git

Secret 一旦 commit 就應假設已被 clone、cache、indexed 或出現在 CI log。Incident sequence 是 revoke/rotate、查 provider audit、找 exposure window/usage、更新 dependent services，最後才決定用 `git filter-repo` 等改 history。History rewrite 會影響 forks、open PR 與 commit SHAs，而且無法撤回已複製的 credential。

Scanner output 也含 secret material，CI 使用 `--redact`、限制 artifact retention 與 log access。Pin gitleaks version/action digest，使用最小 token，並測試 shallow clone 是否包含預期 commit range。上游目前將 Gitleaks 描述為 feature complete、未來以 security fixes 為主，採用時應把 maintenance status 與 alternative migration 納入評估。

gitleaks 專注 secret detection；Semgrep Secrets 加 semantic/validation；GitHub secret scanning 可做 provider partner alerts/push protection；zizmor 找 workflow 如何洩漏 token。最佳防線仍是 short-lived credentials、OIDC workload identity 與最小權限，讓漏出的值快速失效。

## 參考資料

- [Gitleaks repository and documentation](https://github.com/gitleaks/gitleaks)
- [Gitleaks configuration](https://github.com/gitleaks/gitleaks#configuration)
- [Creating a baseline](https://github.com/gitleaks/gitleaks#creating-a-baseline)
- [GitHub secret scanning concepts](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning)
