---
title: "CLAUDE.md 與 AGENTS.md 完整指南：寫給 AI 看的行為指引"
date: 2026-03-28
category: tech
tags: [claude-code, claude-md, agents-md, ai-agent, dx, configuration]
lang: zh-TW
tldr: "CLAUDE.md 是專案層級的 AI 行為指引，AGENTS.md 是給子代理的任務範本。兩者都是 markdown，不用寫程式，但能大幅改變 AI 的行為品質。本文介紹語法、放置位置、繼承規則，以及實際案例。"
description: "深入介紹 Claude Code 的指令檔系統：CLAUDE.md 與 AGENTS.md 的語法、檔案結構、繼承規則、與 Hook/Skill 的搭配方式，以及如何用指令檔打造團隊共用的 AI 開發規範。"
draft: true
series:
  name: "Claude Code 自動化指南"
  order: 3
---

<!-- TODO: 待撰寫 -->

## 預計大綱

### CLAUDE.md 是什麼
- 專案層級的 AI 行為指引
- 放在 repo 根目錄，Claude Code 啟動時自動讀取
- 類似 .editorconfig 但對象是 AI

### 檔案放置與繼承規則
- 專案根目錄 vs 子目錄
- `~/.claude/CLAUDE.md`（全域）vs 專案層級
- 繼承與覆蓋的優先序

### CLAUDE.md 語法與最佳實踐
- 基本結構：專案描述、技術棧、慣例
- 常見指令模式：commit message 格式、命名規範、測試策略
- 反模式：過長、過於模糊、與 Hook 職責重疊

### AGENTS.md 是什麼
- 給子代理（sub-agent）的任務範本
- 什麼時候需要 AGENTS.md vs CLAUDE.md

### 實際案例
- Monorepo 中每個子專案的 CLAUDE.md
- 前後端不同的 coding style 指引
- 搭配 Hook 和 Skill 的完整設定

### 與 Hook、Skill 的分工
- 指令檔 = 建議（AI 可能忽略）
- Hook = 強制（exit code 決定）
- Skill = 流程（按步驟執行）
