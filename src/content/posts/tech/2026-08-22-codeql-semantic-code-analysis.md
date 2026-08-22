---
title: "CodeQL：把 Codebase 抽成 Database，再用 Query 追 Data Flow"
date: 2026-08-22
category: tech
type: deep-dive
tags: [codeql, sast, github, static-analysis, security]
lang: zh-TW
tldr: "CodeQL 先由 language extractor 建立 code database，再以 QL queries 查 AST、types、calls、control/data flow；深度來自 model，也帶來 build extraction 與 query maintenance 成本。"
description: "介紹 CodeQL databases、extractors、query suites、path queries、taint tracking、custom packs、SARIF、GitHub code scanning 與 CI boundaries。"
series:
  name: "AI 時代的技術選擇"
  order: 114
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-codeql-semantic-code-analysis-en)

[CodeQL](https://codeql.github.com/docs/) 把 source code 視為可查詢資料。Language extractor 在 build 或 source extraction 時建立 database，包含 syntax、types、calls、control flow 與 data flow facts；QL query 再找 vulnerability、correctness bug 或 organization-specific pattern。結果可輸出 SARIF 並顯示於 GitHub code scanning。

## Database 品質決定 query 看得到什麼

Compiled language 通常需正確 build command、generated source、flags 與 dependencies；autobuild 方便，但 monorepo/custom build 可能只抽到部分 code。Dynamic language 也要確認 source root、generated/vendor exclusions。每次 scan 都應監看 extraction logs、file counts、language coverage，而不只是 workflow 綠燈。

Built-in `default` suite 偏高精度，`security-extended` 擴大 coverage 並可能增加 findings。Query metadata 定義 ID、kind、severity/precision 等；path query 顯示 source 到 sink 的 flow。Normal data flow 追值，taint tracking 額外 model 轉換後仍受不可信資料影響的 edges。Global analysis 更深也更昂貴，source/sink 與 framework models 必須精準。

## Custom query 是長期維護的 security code

Custom queries 可封裝 internal framework、過去 incident 或禁止的 credential flow，應放進 versioned CodeQL pack，附 query tests、help、owner 與 changelog。Library/API 升級可能改 data-flow model；要針對 known vulnerable/clean fixtures 測 precision/recall。單次 ad-hoc query 適合 threat hunt，不等於持續 gate。

GitHub default/advanced setup、CodeQL CLI 與 external CI 是不同 operating model。CLI 流程大致是 `database create`、`database analyze` 產 SARIF、再 upload；要釘 CLI/query pack version、限制 Actions permissions、保護 upload token，並區分 PR diff finding 與 default-branch full analysis。Licensing/availability 也依 public repository 與 GitHub Code Security plan 而異。

CodeQL 適合支援語言上的深 semantic/data-flow analysis與 security research；Semgrep 規則更快上手、適合 syntax/policy；Snyk 橫跨 SCA/container/IaC；zizmor 專掃 GitHub Actions。沒有 scanner 能證明 code 安全，finding 必須連回 exploitability、test、修補與 regression query。

## 參考資料

- [CodeQL documentation](https://codeql.github.com/docs/)
- [CodeQL CLI](https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-cli)
- [CodeQL queries](https://docs.github.com/en/code-security/reference/code-scanning/codeql/codeql-queries)
- [About CodeQL queries](https://codeql.github.com/docs/writing-codeql-queries/about-codeql-queries/)
- [Data flow analysis](https://codeql.github.com/docs/writing-codeql-queries/about-data-flow-analysis/)
- [Custom CodeQL queries](https://docs.github.com/en/code-security/concepts/code-scanning/codeql/custom-queries)
