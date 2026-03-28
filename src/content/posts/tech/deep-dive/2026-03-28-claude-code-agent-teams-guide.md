---
title: "Claude Code Agent Teams：讓多個 AI 代理組隊協作"
date: 2026-03-28
category: tech
tags: [claude-code, agent-teams, multi-agent, parallel-execution, ai-agent, dx]
lang: zh-TW
tldr: "Agent Teams 讓你啟動多個 Claude Code 實例同時工作——一個當 team lead 分配任務，其他 teammates 各自獨立執行、互相溝通、共享任務清單。適合平行 code review、競爭假設除錯、跨層開發。目前是實驗性功能。"
description: "深入介紹 Claude Code 的 Agent Teams 功能：多代理協作架構、Team Lead 與 Teammate 的角色、共享任務清單、inter-agent messaging、顯示模式（in-process vs tmux split panes），以及與 Sub-agent 的比較和實際使用案例。"
draft: true
series:
  name: "Claude Code 自動化指南"
  order: 11
---

<!-- TODO: 待撰寫 -->
<!-- 參考官方文件：https://code.claude.com/docs/en/agent-teams.md -->

## 預計大綱

### Agent Teams 是什麼
- 多個 Claude Code 實例組成團隊協作
- Team Lead + Teammates 的架構
- 與 Sub-agents 的關鍵差異：teammates 可以互相溝通，sub-agents 只能回報給主代理
- 實驗性功能，需手動啟用 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`

### 什麼時候該用 Agent Teams
- Research & Review：多人同時從不同角度審查
- 新功能開發：每個 teammate 負責不同模組
- 競爭假設除錯：多個 teammate 測試不同理論，互相挑戰
- 跨層協調：前端、後端、測試各一個 teammate
- 不適合的場景：循序任務、同檔案編輯、依賴關係多的工作

### 啟動你的第一個 Agent Team
- settings.json 設定 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS: "1"`
- 用自然語言描述任務和團隊結構
- Claude 自動建立 team、spawn teammates、協調工作

### 控制你的 Agent Team

#### 顯示模式
- **In-process**：所有 teammates 在同一個 terminal，用 Shift+Down 切換
- **Split panes**：每個 teammate 一個 tmux/iTerm2 pane，同時看到所有輸出
- `teammateMode` 設定：`"auto"` / `"in-process"` / `"tmux"`

#### 指定 Teammates 與模型
- 自然語言指定數量和角色
- 可指定每個 teammate 使用的模型（如 Sonnet）

#### 任務管理
- 共享任務清單：pending → in progress → completed
- 任務依賴：未完成的依賴會 block 後續任務
- Lead 指派 vs Teammates 自行認領
- File locking 防止多人同時認領同一任務

#### 直接與 Teammates 對話
- In-process：Shift+Down 切換，Enter 查看，Escape 中斷
- Split panes：直接點擊 pane 互動

#### Plan Approval
- 要求 teammate 在實作前先提出計畫
- Lead 審核後才允許開始實作
- 可設定審核標準（如「必須包含測試」）

### 架構細節
- Team Lead：主 session，建立 team、spawn teammates、協調
- Teammates：獨立的 Claude Code instances
- Task List：共享任務清單，存在 `~/.claude/tasks/{team-name}/`
- Mailbox：代理間的訊息系統
- Team config：`~/.claude/teams/{team-name}/config.json`

### 代理間的溝通
- 自動訊息傳遞：不需要輪詢
- Idle 通知：teammate 完成後自動通知 lead
- message vs broadcast
- 權限繼承：teammates 繼承 lead 的權限設定

### Hooks 整合
- `TeammateIdle`：teammate 即將閒置時觸發
- `TaskCreated`：任務建立時觸發
- `TaskCompleted`：任務完成時觸發
- Exit code 2 可以阻擋並回饋

### 實際案例

#### 平行 Code Review
```
Create an agent team to review PR #142:
- Security reviewer
- Performance reviewer
- Test coverage reviewer
```

#### 競爭假設除錯
```
Spawn 5 teammates to investigate different hypotheses.
Have them debate and disprove each other's theories.
```

### 最佳實踐
- 給 teammates 足夠的 context（不會繼承 lead 的對話歷史）
- 團隊大小：3-5 人最佳，每人 5-6 個任務
- 適當的任務粒度：不要太小（overhead > 效益）也不要太大
- 避免檔案衝突：每個 teammate 負責不同檔案
- 定期監控和調整

### 限制
- 不支援 session resumption（in-process teammates）
- 任務狀態可能延遲
- 關閉 teammates 可能很慢
- 一個 session 只能有一個 team
- 不支援巢狀 teams
- Lead 固定不能轉移
- Split panes 需要 tmux 或 iTerm2

### Agent Teams vs Sub-agents 比較表
| | Sub-agents | Agent Teams |
|---|---|---|
| Context | 獨立，結果回傳給呼叫者 | 獨立，完全獨立 |
| 溝通 | 只能回報給主代理 | Teammates 互相直接溝通 |
| 協調 | 主代理管理所有工作 | 共享任務清單，自我協調 |
| 適合 | 專注任務，只需要結果 | 需要討論和協作的複雜工作 |
| Token 成本 | 較低 | 較高 |
