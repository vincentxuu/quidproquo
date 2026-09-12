---
title: "AI-Native SDLC Playbook L7：平行 Session 與 Subagent"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, parallel-sessions, subagent, worktree]
lang: zh-TW
tldr: "一個工程師同時開多個 Claude Code session，每個跑在獨立的 git worktree 裡；重複性的驗證工作交給 subagent。瓶頸從「寫程式」變成「review 產出」。"
description: "Claude Academy AI-Native SDLC Playbook 第七課導讀：用平行 session 和 subagent 把一個工程師的產出從一條線變成多條線，以及實戰踩過的 worktree 陷阱。"
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 7
---

傳統開發的節奏是線性的——一個工程師一次處理一個任務，等 build、等測試、等 review，中間的空檔靠切換 context 填補，但每次切換都有認知成本。當 AI agent 能接手實作，這些等待時間就不再是必然的停頓，而是可以用來啟動下一個任務的空間。

[Claude Academy 的第七課](https://academy.claude.com/courses/ai-native-sdlc-playbook/parallel-sessions-and-subagents)教的就是怎麼把這個概念落地：用平行 session 同時推進多個任務，用 subagent 處理每個任務裡的重複性工作。

## 平行 Session 與 Subagent 的差異

課程一開始就畫了一條清楚的分界線：

> Parallel sessions raise the number of tasks an engineer can have in flight, while subagents keep each session focused on its own task.

**平行 session** 是完全獨立的 Claude Code 實例，各自跑在自己的 git worktree 裡，處理不同的任務。工程師是唯一的連接點——你在多個終端機之間切換，檢查進度、給指示、review 產出。

**Subagent** 是單一 session 內的輔助角色，有自己的 context window 和工具限制，專門處理重複性的子任務。典型的例子是「驗證器」——每次改完程式碼都需要跑 app、測試變更的行為、回報結果，這種事交給 subagent 比每次手動描述來得一致。

## 怎麼開始

### 從 Plan Mode 拆任務

平行化的前提是任務之間沒有檔案衝突。課程建議從 plan mode 的產出（`plan.md`）出發，把工作拆成獨立的區塊——修改不同檔案的任務可以平行，碰到同一個檔案的就留在同一個 session 裡循序執行。

### 用 Worktree 隔離

每個任務用專屬的 worktree 啟動：

```bash
claude --worktree feature-auth
claude --worktree fix-rate-limit
```

每個 worktree 是一個獨立的 checkout，在自己的分支上工作，檔案系統層級就隔開了，不會有兩個 session 同時改到同一個檔案的問題。

### 從 2-3 個 Session 開始

課程特別強調不要一開始就開很多 session。實際的天花板取決於你的 review 能力——只有在 review 跟得上的情況下才加新的 session。開了 5 個 session 但沒時間看產出，等於在製造技術債。

### 把重複工作變成 Subagent

反覆出現的工作模式可以編碼成 subagent。在 `.claude/agents/` 放一個 Markdown 檔案，定義名稱、用途描述、允許使用的工具：

```markdown
---
name: verifier
description: Runs the app and checks the change works before the session reports done
tools: Bash, Read
---

Start the app with make run. Exercise the changed behavior and the two
nearest neighboring flows. Report what you ran, what you saw, and any
behavior that does not match plan.md. Do not fix anything; report only.
```

注意最後一句：「Do not fix anything; report only.」這個限制很重要——驗證器只負責回報，修不修是工程師或主 session 的決定。職責分離讓每個角色的行為可預測。

## 治理：所有 Session 一視同仁

平行化帶來的風險是產出量暴增但品質不一致。課程的回應很直接：repository 裡的 hooks 和 permission settings 對所有 session 一律適用。你在 `.claude/settings.json` 設的規則——不能碰哪些路徑、commit 前要跑哪些檢查——每個 worktree 裡的 session 都會遵守。

活動紀錄也會標註到發起的工程師。多個 session 產出的 PR 都掛在同一個人名下，review 責任不會因為「是 AI 寫的」而消失。

## 實戰踩過的坑

我們在一個中型專案裡用 worktree 做平行開發，遇到幾個課程沒特別提到的問題：

### Port 衝突

多個 worktree 同時跑 dev server，預設 port 會撞。每個 worktree 需要指定不同的 port，或者乾脆在 CLAUDE.md 裡寫清楚「啟動 dev server 前先檢查 port 是否被佔用」。

### Git Staging 互搶

這是最陰險的坑。`git add` 和 pre-commit hook 之間有一個時間差——在這個空窗期，另一個 session 的 commit 可能會「掃走」你暫存的檔案。

我們的解法是養成一個紀律：**永遠用 `git commit -- <明確路徑>` 而不是 `git commit`**，明確指定要 commit 的檔案。commit 完再用 `git log --oneline -1` 確認是自己那筆。如果 push 被拒就 `git pull --rebase`。

這個規則後來直接寫進了 CLAUDE.md，讓每個 session 都自動遵守。

### Review 是真正的瓶頸

課程說的「只有在 review 跟得上的情況下才加 session」不是客套話。我們試過同時開 4 個 session，產出速度確實很快，但 review 積壓到第二天才看完，結果 merge 的時候衝突一堆。後來收斂到 2-3 個 session，配合一個專門跑驗證的 subagent，反而整體交付更順暢。

## 怎麼衡量效果

課程建議追蹤兩個指標：

- **Leading indicator**：每個工程師同時跑幾個 session（從 OpenTelemetry 匯出），以及一天中花在「主動操作」vs「等待」的時間比例
- **Lagging indicator**：每個工程師每週 merge 的變更數量，搭配 rework rate（從 PR 歷史算）

重點不是「開越多 session 越好」，而是在不增加 rework rate 的前提下，能穩定維持幾條平行線。

## 起步建議

1. 先確保有一份維護良好的 CLAUDE.md——所有 session 都會讀它，這是一致性的基礎
2. 在 CLAUDE.md 加上 commit 規則：指定檔案路徑、commit 後確認
3. 從 2 個 session 開始，一個做主要功能、一個修 bug 或寫測試
4. 把你最常重複描述的驗證步驟變成第一個 subagent
5. 一週後看 merge 數量和 rework rate，再決定要不要加第三個 session

## 參考資料

- [Parallel sessions and subagents — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/parallel-sessions-and-subagents)
- [Claude Code Agents — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/sub-agents)
- [Git Worktrees — Git Documentation](https://git-scm.com/docs/git-worktree)
- [AI-Native SDLC Playbook 課程導讀](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
