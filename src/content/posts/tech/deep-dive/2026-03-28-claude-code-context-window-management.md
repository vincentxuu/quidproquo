---
title: "Claude Code Context Window 管理：理解 AI 的記憶邊界"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, context-window, optimization, token, dx]
lang: zh-TW
tldr: "Claude Code 每個功能消耗不同的 context：根目錄 CLAUDE.md 每次請求都在（子目錄的按需載入）、Skills 只載描述、MCP 只載 tool name、Sub-agent 完全隔離。理解這些差異才能有效管理你的 context window，避免 AI 行為異常。"
description: "介紹 Claude Code 的 context window 管理：各功能的載入時機和 context 成本、auto-compaction 機制、context 用滿時的症狀與對策，以及 CLAUDE.md / Skills / MCP / Sub-agents / Hooks 的 context 最佳化策略。"
draft: true
series:
  name: "Claude Code 自動化指南"
  order: 23
---

🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management-en)

<!-- TODO: 待撰寫 -->
<!-- 參考官方文件：https://code.claude.com/docs/en/context-window.md -->
<!-- 參考官方文件：https://code.claude.com/docs/en/features-overview.md -->

## 預計大綱

### Context Window 是什麼
- Claude 每次請求能「看到」的資訊總量
- Token 限制：所有 input + output 的上限
- 為什麼理解 context 管理很重要

### 各功能的 Context 成本

| 功能 | 載入時機 | 載入什麼 | Context 成本 |
|------|---------|---------|-------------|
| CLAUDE.md | Session 開始 | 根目錄與上層的完整內容 | 每次請求都在；子目錄的 CLAUDE.md 只在讀到該目錄檔案時載入 |
| Skills | Session 開始 + 使用時 | 描述（開始）→ 完整內容（使用時）| 低（描述每次在）|
| MCP servers | Session 開始 | Tool names（完整 schema 預設 deferred，需要時經 tool search 載入） | 低，直到使用 |
| Sub-agents | 啟動時 | 全新 context | 與主對話隔離 |
| Hooks | 觸發時 | 無（外部執行）| 零（待確認：官方文件未明寫；hook 的 stdout 若回注 context 仍會消耗） |

### CLAUDE.md 的 Context 策略
- 控制在 200 行以內（官方建議值；硬上限是 4 MiB，超過整檔跳過）
- 參考資料移到 Skills
- 用 `.claude/rules/` 拆分
- `.claude/rules/` 的 path-scoped rules 只在讀到符合 pattern 的檔案時載入，不是每次工具呼叫都載

### Skills 的 Context 最佳化
- `disable-model-invocation: true`：隱藏到手動呼叫（待確認：官方 skills 文件只說 frontmatter 可控制由誰觸發，未列此欄位名）
- 精確的 description 幫助 Claude 正確委派
- 避免多個 skill 描述重疊

### Sub-agents 保護 Context
- 把高輸出量的操作丟給 sub-agent
- 跑測試、抓文件、處理 log → sub-agent 做，只回傳摘要
- Agent Teams 更進一步：每個 teammate 有完全獨立的 context

### Auto-compaction 機制
- Context 接近容量上限時自動觸發壓縮（待確認：95% 門檻與 `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` 未在官方文件查到）
- Sub-agents 也支援 auto-compaction

### Context 用滿的症狀
- Claude 忘記之前的指示
- Skills 沒有正確觸發
- 行為品質下降
- 對策：開新 session、用 sub-agent、精簡 CLAUDE.md

## 更新紀錄

- 2026-08-22：依官方文件查證大綱主張——CLAUDE.md 上限改為 4 MiB、補子目錄 CLAUDE.md 與 path-scoped rules 的按需載入、MCP schema deferred；未查到的主張標「待確認」

## 參考資料

- [Manage costs effectively](https://code.claude.com/docs/en/costs) — 官方建議 CLAUDE.md 控制在 200 行內、把專門指示移到 skills 以縮小基礎 context

- [Explore the Context Window](https://docs.anthropic.com/en/docs/claude-code/context-window) — Anthropic 官方互動式 context 模擬，視覺化呈現各功能在 session 中的 token 消耗
- [Claude Code Best Practices — Manage Context Aggressively](https://docs.anthropic.com/en/docs/claude-code/best-practices#manage-context-aggressively) — 官方 context 管理最佳實踐，含 /compact、/clear 與 subagent 使用策略
- [Store Instructions and Memories](https://docs.anthropic.com/en/docs/claude-code/memory) — CLAUDE.md 精簡建議與 auto memory 機制，減少 session 啟動時的 context 佔用
- [Claude API — Token 計費說明](https://docs.anthropic.com/en/docs/about-claude/models/overview) — Claude 模型的 context window 大小與計費方式
- [Extend Claude Code](https://docs.anthropic.com/en/docs/claude-code/extend-claude-code) — Skills vs MCP vs Hooks 的 context 成本比較與選擇指南
- [Claude Code Subagents](https://docs.anthropic.com/en/docs/claude-code/sub-agents) — Subagent 機制說明，利用獨立 context window 保護主對話
- [Claude Code Common Workflows — Use Subagents for Investigation](https://docs.anthropic.com/en/docs/claude-code/common-workflows#use-subagents-for-investigation) — 官方示範如何用 subagent 做 codebase 探索，避免污染主 context
