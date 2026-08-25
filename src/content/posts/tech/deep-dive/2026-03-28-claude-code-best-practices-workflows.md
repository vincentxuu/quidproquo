---
title: "Claude Code 最佳實踐與常見工作流程：官方推薦的使用模式"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, best-practices, workflows, tips, productivity, dx]
lang: zh-TW
tldr: "整理 Claude Code 官方推薦的使用模式：如何寫好 prompt、善用 plan mode 規劃、用 git worktree 平行開發、管理 context window、處理大型 codebase，以及從初學到進階的成長路徑。"
description: "彙整 Claude Code 的最佳實踐和常見工作流程：prompt 技巧、plan → implement → review 循環、git worktree 平行 session、context 管理策略、大型 codebase 處理、從 default 到 auto mode 的漸進式信任。"
draft: true
series:
  name: "Claude Code 自動化指南"
  order: 26
---

🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-best-practices-workflows-en)

<!-- TODO: 待撰寫 -->
<!-- 參考官方文件：https://code.claude.com/docs/en/best-practices.md -->
<!-- 參考官方文件：https://code.claude.com/docs/en/common-workflows.md -->

## 預計大綱

### Prompt 技巧
- 具體優於模糊：包含檔案名、函數名、錯誤訊息
- 定義完成標準：「修完後跑測試」「改完提 PR」
- 分階段給指令 vs 一次講完

### Plan → Implement → Review 循環
1. `/plan` 讓 Claude 分析和規劃
2. 確認方向後切換到 auto mode 或 acceptEdits
3. Review diff，必要時 `/undo`

### Git Worktree 平行開發
```bash
# 建立 worktree
git worktree add ../feature-auth -b feature/auth
cd ../feature-auth
claude
```
- 多個 Claude session 同時在不同 branch 上工作
- 避免互相干擾

### Context 管理策略
- 長對話定期開新 session
- 大任務拆成小 session
- 善用 sub-agent 隔離 context
- `/compact` 手動壓縮
- CLAUDE.md 精簡（< 200 行）

### 大型 Codebase 處理
- CLAUDE.md 描述專案結構
- Skills 封裝常用查詢模式
- Sub-agents 做 exploration
- 不要一次給太多檔案

### 漸進式信任
1. 新專案用 `default` → 逐步確認
2. 熟悉後切 `acceptEdits` → 只確認指令
3. 信任後用 `auto` → classifier 把關
4. 隔離環境才用 `bypassPermissions`

### 團隊協作模式
- CLAUDE.md 進 version control
- .claude/settings.json 統一團隊規範
- Skills 封裝團隊 SOP
- Plugin 跨 repo 分發

### 常見反模式
- Context 塞太滿（CLAUDE.md 太長）
- 不看 diff 直接 accept
- YOLO 模式裸跑（沒有 checkpoint）
- 一個 session 跑太多不相關的任務

## 參考資料

- [Claude Code Best Practices](https://docs.anthropic.com/en/docs/claude-code/best-practices) — Anthropic 官方最佳實踐指南，涵蓋 prompt 技巧、context 管理與自動化擴展
- [Claude Code Common Workflows](https://docs.anthropic.com/en/docs/claude-code/common-workflows) — 官方常見工作流程，含 Plan Mode、git worktree、sub-agent 使用方式
- [Store Instructions and Memories](https://docs.anthropic.com/en/docs/claude-code/memory) — CLAUDE.md 寫法與最佳化建議，包含 auto memory 機制說明
- [Claude Code Permission Modes](https://docs.anthropic.com/en/docs/claude-code/permission-modes) — default、acceptEdits、auto、bypassPermissions 各模式的行為與適用情境
- [Explore the Context Window](https://docs.anthropic.com/en/docs/claude-code/context-window) — 互動式模擬，解析各功能在 session 中消耗的 token 量
- [Claude Code Settings](https://docs.anthropic.com/en/docs/claude-code/settings) — settings.json 完整設定參考，含 hooks、permissions、env 欄位
- [Git Worktree 官方文件](https://git-scm.com/docs/git-worktree) — git worktree 指令完整說明，理解平行開發的底層機制
- [Claude Code Overview](https://docs.anthropic.com/en/docs/claude-code/overview) — Claude Code 功能概覽與各平台整合說明
