---
title: "Claude Code Checkpointing：用 Git 建立 AI 操作的安全還原點"
date: 2026-03-28
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
