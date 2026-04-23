---
title: "Claude Code Checkpointing：用 Git 建立 AI 操作的安全還原點"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, checkpointing, git, safety, undo, dx]
lang: zh-TW
tldr: "Claude Code 內建 git checkpoint 機制——每次重大操作前自動建立 commit，出問題可以一鍵還原。搭配 /undo 指令和 git worktree 隔離，讓 AI 的修改永遠可逆。"
description: "介紹 Claude Code 的 Checkpointing 安全機制：自動 checkpoint 的觸發時機、/undo 和 /rewind 指令、手動 checkpoint 策略、與 git worktree 的搭配使用，以及在 bypassPermissions 模式下的安全保障。"
draft: true
series:
  name: "Claude Code 自動化指南"
  order: 24
---

<!-- TODO: 待撰寫 -->
<!-- 參考官方文件：https://code.claude.com/docs/en/checkpointing.md -->

## 預計大綱

### Checkpointing 是什麼
- Claude Code 用 git 建立操作還原點
- 不是額外的系統——就是 git commit
- 讓 AI 的每次修改都可逆

### 自動 Checkpoint
- 什麼時候自動建立
- Checkpoint commit 的格式和辨識方式
- 與一般 commit 的差異

### 還原指令
- `/undo`：還原到上一個 checkpoint
- `/rewind`：還原到指定的 checkpoint
- 在 web/desktop 介面的 diff 預覽和還原

### 手動 Checkpoint 策略
```bash
git add -A && git commit -m "Checkpoint: before refactor"
```
- 在 YOLO 模式下特別重要
- 搭配 `--max-turns` 限制操作範圍

### 與 Git Worktree 的搭配
- 每個 sub-agent 在獨立 worktree 中工作
- Agent Teams 的 `--spawn worktree` 模式
- 多人/多代理同時修改不衝突

### 安全保障
- bypassPermissions 模式下的最後防線
- Checkpoint + Docker = 雙重保險
- 團隊環境中的 checkpoint 策略

## 參考資料

- [Claude Code Best Practices — Rewind with Checkpoints](https://docs.anthropic.com/en/docs/claude-code/best-practices#rewind-with-checkpoints) — 官方說明 checkpoint 機制與 /rewind 指令的使用方式
- [Claude Code Common Workflows — Git Worktrees](https://docs.anthropic.com/en/docs/claude-code/common-workflows#run-parallel-claude-code-sessions-with-git-worktrees) — git worktree 搭配 checkpoint 做平行隔離開發的官方教學
- [Claude Code Permission Modes](https://docs.anthropic.com/en/docs/claude-code/permission-modes) — bypassPermissions 模式的風險說明，checkpoint 是此模式下的安全保障
- [Git Internals — git commit 文件](https://git-scm.com/docs/git-commit) — git commit 機制官方文件，理解 checkpoint 底層實作
- [Git Worktree 官方文件](https://git-scm.com/docs/git-worktree) — git worktree 指令參考，搭配 checkpoint 做 sub-agent 隔離
- [Claude Code Settings](https://docs.anthropic.com/en/docs/claude-code/settings) — settings.json 中 sandbox 設定，與 checkpoint 組合形成雙重保護
- [Claude Code Overview](https://docs.anthropic.com/en/docs/claude-code/overview) — Claude Code 整體架構概覽，了解 checkpoint 在 agentic 工作流中的角色
