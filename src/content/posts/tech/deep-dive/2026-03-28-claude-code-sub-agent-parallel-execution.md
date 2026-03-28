---
title: "Claude Code Sub-agent 與平行執行：拆解複雜任務的策略"
date: 2026-03-28
category: tech
tags: [claude-code, sub-agent, parallel-execution, worktree, ai-agent, dx]
lang: zh-TW
tldr: "Claude Code 的 Agent tool 可以啟動子代理平行處理獨立任務。搭配 git worktree 隔離，多個代理能同時在不同分支上工作。本文介紹子代理的運作機制、使用時機、worktree 隔離模式，以及實際的多任務拆解策略。"
description: "深入介紹 Claude Code 的子代理（sub-agent）機制：Agent tool 的使用方式、子代理類型（Explore、Plan、general-purpose）、git worktree 隔離模式、平行執行的限制與最佳實踐。"
draft: true
series:
  name: "Claude Code 自動化指南"
  order: 10
---

<!-- TODO: 待撰寫 -->

## 預計大綱

### 子代理是什麼
- Agent tool 的基本概念
- 主代理 vs 子代理的關係
- 什麼時候該用子代理

### 子代理類型
- general-purpose：通用任務
- Explore：快速搜尋與探索
- Plan：架構設計與規劃
- 各類型的工具權限差異

### 平行執行
- 同一訊息中啟動多個子代理
- 前台 vs 背景執行
- 依賴關係的處理策略

### Git Worktree 隔離
- isolation: "worktree" 的運作原理
- 每個子代理在獨立分支上工作
- 變更的合併策略

### 實際案例
- 多檔案重構：每個模組一個子代理
- 研究 + 實作平行進行
- 多個 PR 同時開發

### 限制與注意事項
- 子代理的 context window 限制
- 權限繼承（特別是 YOLO 模式）
- 成本考量
