---
title: "Claude Code × GitHub Actions：在 CI/CD 裡放一個 AI 代理"
date: 2026-03-28
category: tech
tags: [claude-code, ci-cd, github-actions, code-review, ai-agent, automation, dx]
lang: zh-TW
tldr: "用 claude-code-action 在 GitHub Actions 中跑 Claude Code——@claude 在 PR/Issue 留言自動回應、開 PR 觸發 AI code review、merge 後自動產生 release notes。支援 Anthropic API、AWS Bedrock、Google Vertex AI。搭配 CLAUDE.md 定義團隊標準。"
description: "完整介紹 Claude Code GitHub Actions 的設定與使用：從 /install-github-app 快速安裝、@claude 互動模式、自動化 prompt 模式，到 AWS Bedrock / Google Vertex AI 的企業級整合，以及 Code Review 自動審查功能。"
draft: true
series:
  name: "Claude Code 自動化指南"
  order: 17
---

<!-- TODO: 待撰寫 -->
<!-- 參考官方文件：https://code.claude.com/docs/en/github-actions.md -->
<!-- 參考官方文件：https://code.claude.com/docs/en/code-review.md -->
<!-- 參考官方文件：https://code.claude.com/docs/en/gitlab-ci-cd.md -->

## 預計大綱

### 為什麼在 CI 中用 Claude Code
- 即時 PR 建立：描述需求，Claude 自動開完整 PR
- 自動化實作：Issue 變成可工作的 code
- 遵循團隊標準：讀 CLAUDE.md 行為指引
- 安全：code 留在 GitHub runner 上

### 快速設定
- `/install-github-app`：一鍵安裝 GitHub App + secrets
- 手動設定：安裝 Claude GitHub App → 加 API key → 複製 workflow

### 基本 Workflow
```yaml
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  claude:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

### 兩種模式
- **互動模式**：@claude 在 PR/Issue 留言，Claude 自動回應
- **自動化模式**：用 `prompt` 參數指定指令，每次 event 自動執行

### 常見使用場景
- `@claude implement this feature based on the issue description`
- `@claude fix the TypeError in the user dashboard`
- `@claude how should I implement user auth for this endpoint?`
- 排程 daily report：`cron: "0 9 * * *"`

### Action 參數
| 參數 | 說明 |
|------|------|
| `prompt` | Claude 的指令 |
| `claude_args` | CLI 參數（--max-turns, --model 等）|
| `anthropic_api_key` | API key |
| `trigger_phrase` | 觸發詞（預設 @claude）|
| `use_bedrock` / `use_vertex` | 雲端提供商 |

### GitHub Code Review
- 每次 PR 自動 AI code review（不需要 @claude 觸發）
- 與 claude-code-action 的差異

### 企業級：AWS Bedrock & Google Vertex AI
- OIDC 身份驗證（不用存 credentials）
- Bedrock workflow 設定
- Vertex AI workflow 設定
- 自訂 GitHub App vs 官方 Claude App

### 成本控制
- GitHub Actions minutes 消耗
- API token 成本
- `--max-turns` 限制
- 條件觸發：只在 @claude 時跑
- Concurrency controls

### 安全最佳實踐
- 永遠用 GitHub Secrets 存 API key
- 最小權限原則
- Review Claude 的建議再 merge
- CLAUDE.md 定義行為邊界

### 與本地自動化的互補
- 本地 Hook：即時品質檢查
- CI Claude：深度 review + 跨檔案分析
- Scheduled Tasks：定期巡檢

## 參考資料

- [Claude Code GitHub Actions 官方文件](https://docs.anthropic.com/en/docs/claude-code/github-actions) — 完整的 GitHub Actions 整合指南，含快速設定、Action 參數與企業級配置
- [anthropics/claude-code-action on GitHub](https://github.com/anthropics/claude-code-action) — claude-code-action 官方原始碼與 README，包含各種使用範例
- [Claude Code — Code Review](https://docs.anthropic.com/en/docs/claude-code/code-review) — GitHub Code Review 功能說明，與 claude-code-action 的差異比較
- [Store Instructions and Memories](https://docs.anthropic.com/en/docs/claude-code/memory) — CLAUDE.md 使用方式，在 CI 環境中定義團隊行為標準
- [GitHub Actions 官方文件](https://docs.github.com/en/actions) — GitHub Actions 完整文件，含 workflow 語法、secrets 管理與觸發事件
- [AWS Bedrock — Amazon Claude 整合](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages.html) — AWS Bedrock 上使用 Anthropic Claude 的官方文件
- [Google Vertex AI — Claude 模型](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude) — Google Vertex AI 使用 Claude 的官方說明，適用於企業級 CI/CD 整合
