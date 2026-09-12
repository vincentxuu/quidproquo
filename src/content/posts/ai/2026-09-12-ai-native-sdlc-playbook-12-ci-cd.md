---
title: "AI-Native SDLC Playbook L12：CI/CD 整合與部署"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, ci-cd, deployment, devops, governance]
lang: zh-TW
tldr: "把 Claude 接進 CI/CD pipeline——從唯讀的 build 失敗分析開始，逐步加入寫入操作，透過 MCP 暴露部署工具，按環境分層授權。核心原則只有一句：「agent 可以做到 production gate 為止，不能通過它。」"
description: "Claude Academy AI-Native SDLC Playbook 第 12 堂課導讀：如何在 CI/CD pipeline 裡非互動式執行 Claude，從 build triage 到部署閘門的完整實作路徑。"
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 12
---

前幾堂課建立了 review 機制（L10）和核准閘門（L11），這堂課把它們接進 CI/CD pipeline——讓 Claude 在 pipeline 裡非互動式執行，做判斷、做修正、做部署，但永遠停在 production gate 前面。

## 課程怎麼教

### 從唯讀開始，逐步加寫入

課程的實作路徑很務實——不是一步到位，而是分階段升級 agent 在 pipeline 裡的權限：

**第一步：唯讀判斷**。Platform engineer 用 `claude -p` 在 pipeline job 裡做 build 失敗分類、摘要 flaky test、產出 changelog 草稿。這些都是唯讀操作，風險趨近於零。

課程提供的 pipeline step 範例：

```yaml
- name: Triage failed build
  if: failure()
  run: >
    claude -p "Read the build log at out/build.log. Identify the most
    likely cause, say whether the failure looks flaky or real, and write a
    three-line summary for the PR thread." >> triage.md
```

**第二步：受閘門保護的寫入**。修 lint 問題、更新產生的文件、回應 review comment。Agent 的寫入透過 PR 進來，branch protection 確保不會直接推到 main。

**第三步：沙箱化執行**。Agent job 跑在容器裡，受 network policy 限制，使用短期憑證，預設沒有 production credentials。

### 透過 MCP 暴露部署工具

這是這堂課最有意思的架構設計——不是讓 agent 執行部署腳本，而是把 deploy、status、rollback 包裝成 MCP tools，每個環境各自設定 scope。

這樣做的好處是：agent 的部署能力變成一份白名單，而不是一堆帶著 credentials 的 shell script。平台團隊控制白名單裡有什麼，agent 只能透過這些 tool 操作。

### 按環境分層授權

| 環境 | Agent 權限 |
|------|-----------|
| Development | 自由部署 |
| Staging | 中間地帶（依團隊定義） |
| Production | 必須有 release manager 核准 |

這個分層跟 L11 的 hooks 搭配——production deploy hook 在沒有 `RELEASE_APPROVAL` 的情況下擋住動作。

### 反覆演練 Rollback

課程特別強調 rollback 應該是 pipeline 裡「最常練習的路徑」。原因很直接：L13（Closing the loop on metrics）會講到當監控指標超出控制帶時，agent 需要觸發 rollback。如果 rollback 路徑沒有提前驗證過，緊急時刻根本不敢用。

### 治理原則

整堂課的治理原則濃縮成一句話：

> "The agent may act up to the production gate and cannot pass it."

用三個機制落實：

1. **Branch protection**：agent 的寫入變成 PR，沒有直接推 main 的路徑
2. **Production deploy hook**：擋到 release manager 核准為止
3. **Per-environment permission tiers**：定義 agent 在每個環境能做什麼

## 實戰對照

我們在一個中型專案裡還沒有用 Claude 做 CI pipeline 內的 triage，但已經在用 hook 做 pre-commit gate。我們的 `pnpm verify` 作為 pre-commit hook 跑 lint、reference check、skills sync 驗證——不通過就不能 commit。這跟課程講的「唯讀判斷」是同一個概念的不同實作：用自動化檢查降低人工 review 的負擔。

我們的治理分層概念也跟課程的環境分層對應：

| 我們的 Tier | 對應 |
|---|---|
| Tier 0（自主執行） | Development 環境的自由操作 |
| Tier 1（過閘門） | commit 前跑 verify，對應 branch protection |
| Tier 2（先問再做） | schema 變更、deploy、改 CI，對應 production gate |
| Tier 3（禁止） | 繞過檢查、無來源寫事實，對應 managed settings 的硬封鎖 |

我們還沒做的是「透過 MCP 暴露部署工具」——目前的部署還是人工觸發。但課程的 MCP 架構確實是更好的做法：把部署能力從 shell script 抽象成有 scope 的 tool，比直接給 agent shell access 安全得多。

## 給讀者的起步建議

1. **從 build 失敗 triage 開始**：加一個 `if: failure()` step，讓 Claude 讀 build log 產出三行摘要。零風險，但馬上能看到價值
2. **不要跳過沙箱**：agent 在 CI 裡跑一定要有容器隔離和短期憑證。不要偷懶用工程師自己的 API key
3. **rollback 先練**：不要等到真的出事才第一次跑 rollback。先在 staging 練到手熟，再讓 agent 有觸發它的權限
4. **MCP 優於 shell script**：如果你正在設計 agent 的部署路徑，用 MCP tool 包裝比給 shell access 好。白名單比黑名單安全

## 參考資料

- [CI/CD Integration and Deployment — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/ci-cd-integration-and-deployment)
- [Claude Code CLI Usage — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/cli-usage)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Academy：AI-Native SDLC Playbook 課程導讀](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
