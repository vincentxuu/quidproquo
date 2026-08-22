---
title: "Semgrep：把組織的安全規則寫成可讀、可測的 Static Analysis"
date: 2026-08-22
category: tech
type: deep-dive
tags: [semgrep, sast, appsec, static-analysis, security]
lang: zh-TW
tldr: "Semgrep 讓團隊用接近 source syntax 的 patterns 與 taint rules 自訂 SAST policy；規則品質取決於 positive/negative tests、framework modeling 與 exception lifecycle。"
description: "介紹 Semgrep pattern rules、metavariables、taint mode、SAST/SCA/secrets、diff-aware CI、custom rules、nosemgrep 與 rollout。"
series:
  name: "AI 時代的技術選擇"
  order: 113
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-semgrep-static-analysis-en)

[Semgrep](https://semgrep.dev/docs/) 的核心優勢是讓 static analysis rules 看起來接近目標語言 source code。簡單 pattern 可封鎖危險 API、缺少參數或組織禁止用法；metavariable 與 semantic matching 跨越變數名稱和部分語法差異；taint mode 則描述 untrusted source 經 propagator 流向 dangerous sink、是否通過 sanitizer。

```yaml
rules:
  - id: no-shell-user-input
    languages: [javascript]
    message: User input reaches shell execution
    severity: ERROR
    mode: taint
    pattern-sources:
      - pattern: req.$ANY
    pattern-sinks:
      - pattern: exec($CMD, ...)
```

## Rule 是 code，也需要 tests 和 review

每條 custom rule 應附會命中的 positive fixtures 與不能誤報的 negative fixtures，鎖定 rule engine version，在 CI 跑 `semgrep --test`。Framework wrapper、sanitizer、ORM helper 與 internal abstraction 變動時要更新 modeling。只貼一段 production incident code 當 pattern，通常會產生 brittle rule。

Semgrep CE 可本機/CI 執行 community/custom rules；商業平台另整合 Semgrep Code、Supply Chain 與 Secrets，能力、interprocedural analysis、reachability、triage 和資料處理依 edition/configuration 而異。評估時使用自己的 languages/frameworks 與已知 vulnerabilities 做 benchmark，不以產品總稱推論每個 engine 都支援相同深度。

## Diff-aware gate 與 full scan 是兩種節奏

PR 掃描聚焦新 code，能讓新增 finding 立即有 owner；default branch/scheduled full scan 才能抓 framework model 或 ruleset 更新後浮現的舊問題。Blocking policy 先從高訊號規則開始。`nosemgrep` 或 platform ignore 必須附 justification、owner、expiry；否則 exception 會變永久 blind spot。

Secrets finding 要立即 revoke/rotate，從 git history 移除只是在降低後續曝光；SCA finding 要確認 dependency reachability 和 fix；SAST finding 需 trace source/sink 與 exploit precondition。Semgrep 適合快速把 incident lesson 與 coding policy 自動化；CodeQL 適合更深 semantic query，Snyk 做整合 AppSec governance，gitleaks 專注 secret patterns/history。多工具要 deduplicate 並明確分派 authoritative finding source。

## 參考資料

- [Semgrep documentation](https://semgrep.dev/docs/)
- [Writing Semgrep rules](https://semgrep.dev/docs/writing-rules/overview)
- [Taint mode](https://semgrep.dev/docs/writing-rules/data-flow/taint-mode/overview)
- [Testing rules](https://semgrep.dev/docs/writing-rules/testing-rules)
- [Semgrep CI](https://semgrep.dev/docs/semgrep-ci/overview)
- [Sample CI configurations](https://semgrep.dev/docs/semgrep-ci/sample-ci-configs)
