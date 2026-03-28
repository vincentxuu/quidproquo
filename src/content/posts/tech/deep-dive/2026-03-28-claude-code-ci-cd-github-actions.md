---
title: "Claude Code × CI/CD：在 GitHub Actions 裡放一個 AI 代理"
date: 2026-03-28
category: tech
tags: [claude-code, ci-cd, github-actions, ai-agent, automation, code-review, dx]
lang: zh-TW
tldr: "把 Claude Code 放進 GitHub Actions，讓 AI 在 CI pipeline 裡自動 review PR、修 lint 錯誤、產生 changelog、甚至自動修 failing test。本文介紹設定方式、安全考量、實際 workflow 範例，以及成本控制策略。"
description: "完整介紹如何在 GitHub Actions 中整合 Claude Code，包含 action 設定、secrets 管理、常見 workflow 範例（自動 review、自動修復、changelog 產生），以及成本和安全的設計取捨。"
draft: true
series:
  name: "Claude Code 自動化指南"
  order: 14
---

<!-- TODO: 待撰寫 -->

## 預計大綱

### 為什麼把 Claude Code 放進 CI
- 從本地自動化到雲端自動化
- 與 Scheduled Tasks / Remote Agent 的差異
- 適合的場景 vs 不適合的場景

### 基本設定
- GitHub Action 中安裝 Claude Code
- ANTHROPIC_API_KEY 的 secrets 管理
- 權限與安全設定

### 常見 Workflow 範例
- PR 自動 Review：開 PR 觸發 Claude 審查
- Lint 自動修復：CI 失敗後 Claude 自動修 + push
- Changelog 產生：merge 到 main 自動產生 release notes
- Test 修復：failing test 自動分析 + 提交修復

### 安全設計
- --dangerously-skip-permissions 在 CI 中的風險
- 最小權限原則：disallowedTools 設定
- PR 權限控制：避免 AI 直接 merge

### 成本控制
- Token 用量估算
- 條件觸發：只在特定條件下跑 Claude
- 快取與增量處理策略

### 與本地 Hook 的互補
- 本地 Hook 做第一道防線
- CI Claude 做深度 review
- 避免重複檢查的設計
