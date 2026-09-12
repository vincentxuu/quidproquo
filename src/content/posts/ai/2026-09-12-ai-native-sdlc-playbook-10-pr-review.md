---
title: "AI-Native SDLC Playbook L10：AI 進入 PR Review 迴圈"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, code-review, pr-review, governance]
lang: zh-TW
tldr: "讓 AI 做第一輪 PR review，人類只看意圖與風險——這堂課教你怎麼設定 REVIEW.md、分層 review pass、建立 review comment 自動修正迴圈，以及為什麼寫程式的 agent 不能自己批准自己的 PR。"
description: "Claude Academy AI-Native SDLC Playbook 第 10 堂課導讀：AI 如何嵌入 PR review 流程，從 REVIEW.md 定義、自動修正迴圈到治理原則的完整解析。"
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 10
---

PR review 是開發流程裡最吃人力的環節之一。工程師寫完程式碼之後，PR 在 queue 裡等 reviewer 有空，reviewer 逐行看 diff、留 comment，作者改完再推一版，reviewer 再看一次——來回幾輪，一個 PR 從開到合可能要好幾天。

這堂課要解決的問題很直接：**把 review 裡「機械性檢查」的部分交給 Claude，讓人類 reviewer 專注在「這個改動是否達成目的」和「風險是否可接受」。**

## 課程怎麼教

### REVIEW.md：定義 review 的標準

課程引入了一個新的 artifact——`REVIEW.md`，放在 repo 根目錄，由 tech lead 撰寫。它定義 Claude review PR 時要跑哪些 pass、怎麼分類 finding 的嚴重程度、以及什麼不需要報告。

依課程提供的範例：

```markdown
# Review instructions
## Passes
Run three passes and tag each finding with its pass:
- Bugs: logic errors, broken edge cases, subtle regressions
- Security: injection risks, authentication gaps, PII in logs
- Compliance: the change matches spec.md, plan.md and our design principles

## What Important means here
Reserve Important for findings that would break behavior, leak data
or breach a policy. Style and naming are nits.

## Cap the nits
Report at most five nits per review; summarize the rest as a count.

## Do not report
Generated files under src/gen/ and anything CI already enforces.
```

這份文件的設計很聰明——它不是一份通用的 review checklist，而是**把你的團隊對「什麼重要、什麼不重要」的共識編碼成機器可執行的指令**。

### 兩個方向的 review

Claude 在 PR review 裡有兩個角色：

1. **Review 別人的 PR**：透過 Managed Code Review service（由管理員在 repo 啟用）或 `claude-code-action`（跑在 CI 裡），每個 PR 都會收到一致的 review pass，finding 按嚴重程度排序
2. **回應自己 PR 上的 review comment**：reviewer 在 PR 裡 tag `@claude`，Claude 就會修正並推新 commit。整個對話紀錄留在 PR thread 裡

### 人類依然掌握核准權

這是治理層面最重要的原則：**finding 本身不會批准或擋下 PR**。Branch protection 依然要求人類 code owner 的批准。Claude 提供的是情報，不是決策。

依課程的說法：「The agent that wrote code cannot approve it.」寫程式的 agent 不能同時是批准者——這確保了職責分離。

### Review comment 自動修正迴圈

這個機制是整堂課最實用的部分：

1. Reviewer 在 PR 上留 comment 並 tag `@claude`
2. Claude 讀 comment、修正程式碼、推 commit
3. 修正和原始 comment 都留在 PR thread 裡，形成完整的審計軌跡

有些團隊會把這包成自定義 slash command——掃描所有未解決的 comment 和失敗的 check，逐一處理，推修正，直到 PR 全綠、只剩 code owner 批准。

### 回饋迴圈到 CLAUDE.md

課程強調：當 review 連續發現同一類錯誤兩次，就該把修正寫進 `CLAUDE.md`，防止後續 PR 再犯。Review 也會標出 `CLAUDE.md` 裡已經過時的資訊。

## 實戰對照

我們在一個中型專案裡實作了類似的機制，核心設計是 **clean-context review**——spawn 一個全新的 subagent，只餵 diff 和規範，完全看不到開發過程的對話。

為什麼要這樣做？因為開發者在同一個 session 裡自己 review 自己的程式碼，會有「我覺得有做」被誤認為「真的有做」的偏差。乾淨的 context 迫使 reviewer 只看 diff 裡實際存在的東西。

我們的 reviewer bot 還會對每條 finding 做對抗式查證：

- **真的 bug** → 修正並推 commit
- **誤報** → 留下證據說明為什麼不是 bug，然後 resolve
- **不確定** → 交給人類判斷

這個三分法讓人類 reviewer 的注意力集中在「需要人類判斷的事」，而不是從一堆 finding 裡自己篩選。

## 給讀者的起步建議

1. **先寫 `REVIEW.md`**：不需要很完美，先把你團隊最在乎的 3 個 review pass 寫下來就好。Bug、Security、跟 spec 的一致性是最常見的起點
2. **啟用 review comment 迴圈**：這是 ROI 最高的功能——reviewer 留 comment，Claude 自動修，省掉「作者改 → 推 → reviewer 再看」的來回
3. **建立 nit 上限**：課程建議每次 review 最多 5 個 nit，其餘用數字帶過。這很重要——nit 太多會讓重要的 finding 被淹沒
4. **不要跳過「寫程式的不能批准」這個原則**：即使是小團隊，也該確保 PR 的批准來自不同的人或不同的 context

## 參考資料

- [AI in the PR Review Loop — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/ai-in-the-pr-review-loop)
- [Claude Code Review — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/code-review)
- [Claude Academy：AI-Native SDLC Playbook 課程導讀](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
