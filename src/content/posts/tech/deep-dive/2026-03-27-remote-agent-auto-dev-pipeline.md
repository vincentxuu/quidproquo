---
title: "讓 AI 自己接 Issue、寫 Code、開 PR：用 Claude Code Remote Agent 做到半夜自動開發"
date: 2026-03-27
category: tech
tags: [claude-code, remote-agent, scheduled-trigger, openspec, github-issues, automation, dx]
lang: zh-TW
tldr: "用 Claude Code 的 Scheduled Remote Agent，每 2 小時自動掃描 GitHub issues、實作功能、開 PR、修 review feedback。人類只需要寫 issue 和按 merge。搭配自製的 /publish-tasks skill，把 OpenSpec 的工程任務一鍵發成 GitHub issues。"
description: "從半自動到接近全自動的開發流程演化。用 Claude Code Remote Trigger 建立雲端排程代理，自動處理 GitHub issues 和 PR review feedback，搭配 OpenSpec 的 /publish-tasks skill 串起完整的需求到交付流水線。"
draft: false
series:
  name: "Claude Code 自動化指南"
  order: 15
---

上一篇寫了從 OpenSpec 到自動部署的八個階段。那套流程能跑，但有一個問題：每一步都要人類觸發。

「幫我開發這個功能」→ AI 寫 code →「幫我 commit」→ AI commit →「幫我 push」→ AI push →「幫我開 PR」→ AI 開 PR → CI 跑完 →「幫我收集 feedback」→ AI 收集 →「幫我修」→ AI 修。

每一步 AI 都做得很好，但人類要一直守在電腦前當調度員。這不是自動化，這是語音助理。

## 目標：人類只做兩件事

1. 寫需求（OpenSpec 或直接寫 issue）
2. Review + Merge

中間的「讀需求 → 開 branch → 寫 code → 跑測試 → commit → push → 開 PR → 修 review feedback → 通知可以 merge」全部讓 AI 自己跑。

## Claude Code Remote Trigger

Claude Code 有一個功能叫 Scheduled Remote Trigger。它的運作方式：

1. 你設定一個 cron 排程和一段 prompt
2. 時間到了，Anthropic 雲端自動啟動一個獨立的 Claude Code session
3. 這個 session 會 clone 你指定的 repo，執行 prompt 裡的任務
4. 做完後結果留在雲端

你的電腦可以關機，它照跑。不需要本地終端機 session。

## 設定

```bash
# 在 Claude Code 裡用 /schedule 建立
```

關鍵設定：

| 項目 | 值 |
|------|-----|
| 排程 | 每 2 小時（`0 */2 * * *`） |
| 模型 | claude-sonnet-4-6 |
| Sources | daodao-server、daodao-f2e、daodao-ai-backend、daodao-storage |
| 工具 | Bash、Read、Write、Edit、Glob、Grep |

`sources` 是一個 array，可以放多個 repo。雲端環境啟動時會全部 clone 並設好 git 認證。這很重要——如果只放一個 repo，agent 嘗試自己 `git clone` 其他 repo 會因為沒有認證而失敗。踩過這個坑。

## 兩個階段

Remote Agent 每次執行做兩件事：

### 階段 1：Issue 監聽

掃描 4 個 repo 的 `auto` label issues：

```bash
for REPO in daodaoedu/daodao-server daodaoedu/daodao-f2e daodaoedu/daodao-ai-backend daodaoedu/daodao-storage; do
  gh issue list --repo $REPO --label "auto" --state open --json number,title
done
```

對每個沒有對應 PR 的 issue：讀取 issue → cd 到對應 repo → 開 branch `auto/<number>-<desc>` → 實作 → 測試 → commit → push → 開 PR（Closes #number）→ 在 issue 留言。

### 階段 2：PR 巡邏

掃描 4 個 repo 的 open PRs，篩選 `auto/` 開頭的 branch。有新 review feedback 就修，CI 全綠且沒有未處理 review 就留言「可以 merge 了」。

## 路徑探索的教訓

第一版的 prompt 寫死了 repo 路徑（`~/daodao-server`），結果遠端環境的目錄結構跟預期不同。修正後加了一個準備步驟：

```bash
ls -la ~/ && find ~/ -maxdepth 2 -name '.git' -type d
```

讓 agent 自己探索目錄結構，用特徵檔案辨識 repo（`prisma/` = server、`apps/mobile/` = f2e、`pyproject.toml` = ai-backend、`migrate/sql/` = storage）。

遠端 agent 的 prompt 必須是防禦性的。不能假設任何路徑、環境變數、或系統狀態。它每次都是從零開始。

## /publish-tasks：連接 OpenSpec 和 Remote Agent

有了 Remote Agent，還缺一塊：怎麼把 OpenSpec 的工程任務變成它能讀懂的 GitHub issues？

手動建 issue 太慢，而且容易漏掉 context。所以做了一個 `/publish-tasks` skill：

```
/publish-tasks
```

它會：

1. 讀取 OpenSpec change 的 `tasks.md`、`proposal.md`、`design.md`、`specs/`
2. 找出所有未完成的 tasks（`- [ ]`）
3. 按 section 分組成邏輯 issues（同一個 section 的 tasks 合成一個 issue）
4. 讓你預覽分組，確認後建立

每個 issue 的 body 包含完整 context：

```markdown
## Context
**Change**: notification-system

### Why
（從 proposal.md 摘錄）

## Tasks
- [ ] 12.1 驗證留言事件...
- [ ] 12.2 驗證 P2 聚合...

## Technical Context
（從 design.md 摘錄相關的架構決策）

## Specs
（從 specs/ 摘錄相關的需求規格）

## Acceptance Criteria
- All tasks completed
- Tests pass
```

關鍵原則：**issue body 必須自給自足**。Remote Agent 沒有本地檔案，所有 context 都要寫在 issue 裡。如果 issue 寫得太簡略，agent 就會亂猜；寫得夠完整，它的實作品質會好很多。

## 完整流程

```
人類做的事                          AI 自動做的事
──────────                          ────────────

OpenSpec 探索需求
    ↓
產出 proposal → design
→ specs → tasks
    ↓
/publish-tasks                 →    GitHub Issues + auto label
                                         ↓
                                    每 2 小時掃描
                                    讀 issue → 開 branch
                                    實作 → 測試 → 開 PR
                                         ↓
                                    Review feedback 來了
                                    自動修 → push → 留言
                                         ↓
Review + Merge              ←      「CI 全綠，可以 merge 了！」
```

## 限制

誠實說：

| 限制 | 影響 |
|------|------|
| 方案只能 1 個 trigger | 用一個 trigger 掃描所有 repo 繞過 |
| 最短間隔 1 小時 | 不是即時反應，要等下一次掃描 |
| 每次 session 無記憶 | 無法累積上次的 context |
| 不適合設計決策 | 需求分析和架構設計仍然要人類做 |

最大的限制其實是：**AI 寫的 code 品質取決於 issue 的品質**。如果 issue 只寫「加一個通知功能」，出來的東西會很糟。但如果 issue 裡有完整的 spec、schema 設計、API 規格、acceptance criteria，品質就會高很多。

這也是為什麼 OpenSpec 的流程（Phase 1-2）不能自動化——那是決定「做什麼」和「怎麼做」的階段，需要人類判斷。Remote Agent 處理的是「按 spec 實作」的部分，這是它最擅長的。

## 從半自動到接近全自動

```
Phase 1.0  人類寫所有 code
Phase 1.5  人類觸發每一步，AI 執行
Phase 2.0  人類寫需求和 merge，中間全自動  ← 現在在這裡
Phase 3.0  ???
```

Phase 3.0 可能是 GitHub webhook 即時觸發（不用等 cron）、自動偵測新 issue、自動 merge 低風險 PR。但目前 Phase 2.0 已經夠用了。

真正的瓶頸不是自動化程度，而是 issue 的品質。花時間把需求寫清楚，比花時間讓 AI 更快開始工作更有價值。

## 參考資料

- [Claude Code 官方文件](https://docs.anthropic.com/en/docs/claude-code)
- [Claude Code Remote Agent 文件](https://docs.anthropic.com/en/docs/claude-code/remote-agents)
- [OpenSpec GitHub](https://github.com/openspec-dev/openspec)
- [GitHub CLI (gh) 官方文件](https://cli.github.com/manual/)
- [GitHub Issues 官方文件](https://docs.github.com/en/issues)
- [從 OpenSpec 到自動部署的 AI 驅動開發流程](/posts/tech/deep-dive/2026-03-27-ai-driven-dev-workflow-openspec-to-deploy) — 完整八階段流程，本文是其中「自動化」部分的進化
- [/file-bug-issue Skill 與 Remote Agent 串接](/posts/tech/deep-dive/2026-03-27-file-bug-issue-skill-remote-agent) — 用 Skill 把 Debug 對話轉成 Issue，交給 Remote Agent 修
- [Claude Code 的三層品質防線：Hook、Skill、指令檔](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md) — Skill 和 Hook 機制的詳細說明
