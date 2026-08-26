---
title: "Claude Code 怎麼進 CI/CD：GitHub Actions 的 @claude 與 GitLab MR 流程"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, github-actions, gitlab-ci, ci-cd, ai-agent, automation, dx]
lang: zh-TW
tldr: "用 anthropics/claude-code-action 把 Claude Code 放進 GitHub Actions：/install-github-app 一條指令裝好，@claude 在 PR 和 Issue 留言就能叫它修 bug、把 issue 做成 PR；Bedrock／Vertex／Foundry 三種雲端後端走 OIDC 免存金鑰；GitLab CI/CD（beta）則用 .gitlab-ci.yml 一個 job 對應，所有變更走 merge request。"
description: "Claude Code 整合 GitHub Actions 與 GitLab CI/CD 的做法：安裝路徑、@claude 觸發語法、workflow YAML 範例、AWS Bedrock／Google Cloud Agent Platform／Microsoft Foundry 後端切換，以及 API key 管理與權限範圍的安全要點。"
draft: true
series:
  name: "Claude Code 深入介紹"
  order: 19
---

> 🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-ci-cd-github-actions-en)

[系列上一篇](/posts/tech/deep-dive/2026-03-28-claude-code-headless-mode-guide)講了 headless mode：用 `-p` 旗標讓 Claude Code 不進互動介面、跑完就退出。CI 整合就是把這個能力接上觸發器——GitHub Actions 和 GitLab CI/CD 是官方文件明確支援的兩條路。這篇講怎麼裝、怎麼觸發、企業環境怎麼換雲端後端。

## 在 CI 裡跑 agent，跟本地跑差在哪

本地跑 Claude Code，你在終端機前盯著它改 code；CI 裡跑，改成由儲存庫事件驅動——有人留言、有 PR 開起來、排程時間到了。三個實際差別：

- **context 來源不同**：本地靠你餘話補充背景；CI 裡 Claude 自己讀 issue 文字、PR diff 和 repo 檔案，所以 `CLAUDE.md` 變成唯一可靠的團隊規範來源。
- **輸出目的地不同**：本地的成果是你的工作目錄；CI 裡的成果是 commit、PR 和留言，全部留下紀錄。
- **權限模型不同**：本地你按 Shift+Tab 決定它多自由；CI 裡靠 workflow 的 permissions 區塊和 Action 的參數圈出邊界。

## 安裝：/install-github-app 或手動 workflow

官方文件的快速路徑是在 repo 目錄下跑 `/install-github-app`。前提是本機裝好 [GitHub CLI](https://cli.github.com) 並 `gh auth login`。它會幫你做三件事：安裝 Claude GitHub App、把憑證存成 repo secret（API key 用 `ANTHROPIC_API_KEY`，訂閱 token 用 `CLAUDE_CODE_OAUTH_TOKEN`）、推一個帶 workflow 檔的分支並幫你開好 PR。merge 那個 PR，`@claude` 就生效。

不想依賴本地 Claude Code，就走手動路徑，同樣三步自己來：到 [github.com/apps/claude](https://github.com/apps/claude) 安裝 App、加上述 secret 其中一個、把 [examples/claude.yml](https://github.com/anthropics/claude-code-action/blob/main/examples/claude.yml) 複製進 `.github/workflows/`。組織層級部署可以 App 只裝一次、secret 放 organization-level Actions secret，各 repo 只放 workflow 檔。

## @claude：在留言裡指名做事

Action 有兩種模式。workflow 沒給 `prompt` 輸入就是互動模式：Claude 等待觸發詞（預設 `@claude`），出現在 issue／PR 留言、code review 留言或新開 issue 的標題內文時才動手。給了 `prompt` 就是自動化模式：事件一到就跑，不等提及。

互動模式能做的事，官方舉的都是這類：

```text
@claude implement this feature based on the issue description
@claude fix the TypeError in the user dashboard component
@claude how should I implement user authentication for this endpoint?
```

第三個例子是問問題不動 code，第一個是直接把 issue 做成一個 PR——Claude 會在同一個 issue 或 PR 底下用留言回報進度。另外官方還有一條不需寫 workflow 的 Code Review 產品線（每個 PR 自動審查），那屬於系列另一篇的主題，這篇不展開。

## 最小 workflow 範例

回應 `@claude` 提及的最小設定，照官方文件原樣：

```yaml
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  claude:
    if: contains(github.event.comment.body, '@claude')
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write
      id-token: write
      actions: read
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 1
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

幾行不是樣板的值得解釋：`if` 讓不含 `@claude` 的留言根本不起 runner；`id-token: write` 是 Action 預設的 GitHub App 認證所需；`actions: read` 讓 Claude 能讀 PR 上的 CI 結果。自動化模式的關鍵參數是 `prompt`（純文字或 skill 指令）和 `claude_args`（CLI 旗標，例如 `--max-turns 5 --model claude-sonnet-5`）。跑之前還有兩道檢查：觸發者必須對 repo 有 write 權限，且必須是人類帳號——bot 要列入 `allowed_bots` 才會過。

## 換雲端後端：Bedrock、Vertex、Foundry

預設 Action 直接打 Claude API。企業若要求推理流量走自家雲帳號，官方支援三個後端，切換只改一個輸入：Amazon Bedrock 用 `use_bedrock: "true"`、Google Cloud Agent Platform 用 `use_vertex: "true"`、Microsoft Foundry 用 `use_foundry: "true"`。

三者的共通設計是用 OIDC 身份聯盟取代靜態金鑰：workflow 的 `id-token: write` 讓 GitHub 簽出短期 token，雲端那邊設好信任條件（限定到你的 repo），每次執行換短時憑證，repo 裡不用放任何長期金鑰。要補的設定各有重點：

| 後端 | repo secrets | 額外環境變數 |
|------|--------------|--------------|
| Bedrock | `AWS_ROLE_TO_ASSUME` | model ID 帶跨區域前綴，如 `us.anthropic.claude-sonnet-4-6` |
| Google Cloud | `GCP_WORKLOAD_IDENTITY_PROVIDER`、`GCP_SERVICE_ACCOUNT` | `ANTHROPIC_VERTEX_PROJECT_ID`、`CLOUD_ML_REGION` |
| Foundry | `AZURE_CLIENT_ID`、`AZURE_TENANT_ID`、`AZURE_SUBSCRIPTION_ID` | `ANTHROPIC_FOUNDRY_RESOURCE` |

## GitLab CI/CD：同樣的事，走 merge request

GitLab 沒有現成的 App 可裝，官方整合（beta，由 GitLab 維護）是建構在 CLI 與 Agent SDK 上的一個 CI job：`.gitlab-ci.yml` 加一段 job，`before_script` 用 `curl -fsSL https://claude.ai/install.sh | bash` 裝 CLI，`script` 裡跑：

```yaml
- >
  claude
  -p "${AI_FLOW_INPUT:-'Review this MR and implement the requested changes'}"
  --permission-mode acceptEdits
  --allowedTools "Bash Read Edit Write mcp__gitlab"
```

憑證是把 `ANTHROPIC_API_KEY` 設成 masked CI/CD variable。跟 GitHub 版最大的差別在觸發：GitLab 沒有內建的留言監聽，要做 `@claude` 提及驅動，得加「Comments (notes)」webhook，由你的 listener 在偵測到提及時呼叫 pipeline trigger API、帶入 `AI_FLOW_INPUT` 等變數。最簡單的入門方式是先靠 web 手動或 merge request 事件觸發。安全模型的骨幹相同：每個互動跑在隔離容器裡，所有變更一律經過 merge request，審核者和 approval 流程照常運作。Bedrock／Vertex 後端同樣支援，分別用 `CLAUDE_CODE_USE_BEDROCK=1`、`CLAUDE_CODE_USE_VERTEX=1` 加上 OIDC/WIF 設定。

## 安全注意

- **金鑰只進 secrets**：API key 或 OAuth token 一律放 GitHub Secrets／GitLab masked variable，官方警告寫得很直白——絕不 commit 進 repo。
- **權限最小化**：官方 Claude GitHub App 的權限集涵蓋所有 Claude 功能（Actions、Checks、Discussions 都讀寫）；只要跑 Claude Code Action 的話，可自建只有 Contents／Issues／Pull requests 三個權限的 custom GitHub App。
- **信任邊界**：write 權限檢查和 bot 檢查是內建的，但 public repo 上 fork PR 拿不到 secrets，評論型觸發仍建議在憑證步驟前先驗留言者權限。
- **人類把關**：Claude 推的 commit 照常走你的 CI 和 review 流程，merge 前看過 diff。
- **成本煞車**：`--max-turns` 限制迭代次數、job 層 timeout 防失控、concurrency controls 限並行——每個 run 燒的是 Actions minutes 加 token 兩種錢。

## 學到的事

CI 裡跑 Claude Code 的本質，是把 headless mode 接上版本控制平台的事件系統：GitHub 那邊 `@claude` 提及即觸發、issue 直接長成 PR；GitLab 那邊一切收斂到 merge request。共同的原則只有兩條——金鑰交給平台的 secret 機制，變更交給人類審查。

## 參考資料

- [Claude Code GitHub Actions — Claude Code Docs](https://code.claude.com/docs/en/github-actions) — 安裝路徑、互動／自動化模式、Action 參數、觸發者檢查與成本管理的官方說明
- [Use Claude Code GitHub Actions with cloud providers — Claude Code Docs](https://code.claude.com/docs/en/github-actions-cloud-providers) — Bedrock／Agent Platform／Foundry 三後端的 OIDC 設定、secrets 對照表與完整 workflow 範例
- [Claude Code GitLab CI/CD — Claude Code Docs](https://code.claude.com/docs/en/gitlab-ci-cd) — GitLab beta 整合的 job 寫法、`AI_FLOW_*` 觸發機制與 Bedrock／Vertex 配置範例

## 更新紀錄

- 2026-08-26：初版，依 2026-08 官方文件撰寫（含 Microsoft Foundry 後端與 GitLab beta 整合）。
