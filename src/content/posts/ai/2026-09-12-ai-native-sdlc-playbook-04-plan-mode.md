---
title: "AI-Native SDLC Playbook L4：Plan Mode 先寫計畫再寫程式"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, plan-mode, context-engineering]
lang: zh-TW
tldr: "Claude Code 的 plan mode 讓工程師在寫任何程式碼之前，先產出一份可審查、可版控的實作計畫（plan.md）。設計審查從 PR diff 前移到計畫階段，修正成本從「改程式碼」降到「改文件」。"
description: "Claude Academy AI-Native SDLC Playbook 第四課導讀：為什麼 plan mode 應該是 Claude Code session 的預設起點，以及 plan.md 如何成為稽核鏈的一環。"
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 4
---

大多數工程師拿到需求後的第一個動作是打開編輯器開始寫。這在傳統開發裡合理——腦中的設計只有自己看得到，寫出來才能討論。但當 Claude Code 成為執行者，「先寫再改」的成本結構就翻轉了：**讓 AI 先寫一份計畫，修改計畫比修改程式碼便宜一個數量級。**

[Claude Academy 第四課](https://academy.claude.com/courses/ai-native-sdlc-playbook/plan-mode)把 plan mode 定位為 Claude Code session 的預設起點，不是可選功能。這篇文章拆解這堂課的核心概念，搭配實戰觀察，說明為什麼「先計畫」不只是好習慣，而是整個 AI-native SDLC 的基礎設施。

## 課程教了什麼

### Plan mode 的運作方式

Plan mode 下，Claude 可以讀取整個 codebase，但**不能修改任何檔案**。工程師把前一階段產出的 `intent.md`（需求）和 `spec.md`（規格）餵進去，要求 Claude 產出一份實作計畫，內容包含：

- 會改動哪些檔案
- 工作的執行順序
- 用什麼測試來證明改動正確
- 可能的風險

工程師可以反覆追問：「這個改動可能搞壞什麼？」「哪一步風險最高？」「你放棄了哪些替代方案？」直到計畫清楚到**任何一個沒看過對話的工程師都能照著做**。

### plan.md 的角色

確認後的計畫會被 commit 為 `plan.md`，跟 `intent.md`、`spec.md` 一起進版控。依課程的說法，這份文件有三個用途：

1. **稽核紀錄**：誰同意了這個計畫、什麼時候同意的，都記錄在 git history 裡
2. **PR 審查基準**：Stage 5（Deploy）的 PR review 會比對最終 diff 跟 `plan.md` 是否一致
3. **實作指引**：有了紮實的計畫，Claude 的實作通常一次到位，不需要來回修正

課程特別強調：**當實作過程偏離計畫，要在同一個 commit 更新 `plan.md`**。甚至建議用 hook 來確保兩者同步。

### 從 plan mode 到 auto mode

課程也提到了進階用法：隨著護欄成熟（調校過的 `CLAUDE.md`、編碼了組織規範的 skills、會擋住危險操作的 hooks、完整的測試套件），auto mode 會成為例行工作的預設模式。

依課程的說法：「重心從『看著 agent 逐行修改、逐次核准』轉向『在較長的自主 session 後審查產出物』。」這個轉變是漸進的——先從 plan mode 建立信任，再逐步放寬到 auto mode。

### 跟既有系統共存

課程務實地討論了遺留系統的問題。大多數組織的需求追蹤不在 Markdown 裡，而是在 Jira、ServiceNow、Confluence 裡。課程提供三種共存模式：

| 模式 | 真相來源 | 適合 |
|------|----------|------|
| Repo 為主 | Markdown 是權威紀錄，Jira 放連結 | 工程主導的組織 |
| 遺留系統為主 | Jira 是權威，Markdown 是工作副本 | 有合規審計要求 |
| 雙向連結 | 兩邊都放對方的 ID/SHA | 過渡期的最低門檻 |

## 實戰對照：plan-first 的真實體驗

在我們維護的一個中型專案裡，開發流程的入口就是 plan-first：拿到需求後先在 plan mode 裡確認設計方向，包含要動哪些檔案、測試策略、以及可能的風險點，確認後才進入 build 階段。

幾個觀察：

**計畫品質取決於 CLAUDE.md 的品質。** 如果 `CLAUDE.md` 沒有記錄架構慣例和已知地雷，Claude 產出的計畫會忽略專案特有的限制。我們曾遇過 Claude 規劃要改一個被凍結的 legacy 模組，因為 `CLAUDE.md` 沒寫「這個模組不能動」。加上去之後就再也沒發生。

**plan mode 是新人最好的 onboarding 工具。** 不熟悉 codebase 的人在 plan mode 裡跟 Claude 對話，等於在做一次有引導的 codebase 導覽。比讀文件快，比直接改 code 安全。

**「一次到位」的前提是計畫足夠具體。** 課程說「implementation is often a single pass」，這在計畫寫到檔案層級時確實如此。但如果計畫只寫了方向（「加一個 API endpoint」），Claude 的實作還是會需要來回修正。**好的 plan.md 讀起來像 TODO list，不像會議紀錄。**

## 給讀者的起步建議

### 第一步：養成 plan mode 的肌肉記憶

不需要一開始就全流程（intent.md → spec.md → plan.md）。先從一個習慣開始：**每次開新的 Claude Code session，先進 plan mode。** 問 Claude「你打算怎麼做這件事」，看看它的計畫合不合理，再決定要不要讓它執行。

### 第二步：把計畫存下來

即使不用 `plan.md` 這個名字，也建議把確認過的計畫存進版控。當 PR 被質疑「為什麼這樣改」的時候，有一份事前計畫比事後解釋有說服力得多。

### 第三步：用 hook 防止計畫與實作脫節

課程建議用 hook 確保 `plan.md` 跟實際改動保持同步。一個簡單的做法是在 commit 時檢查：如果改動的檔案不在 `plan.md` 列出的範圍內，就發出警告。

### 關於 auto mode 的時機

課程的建議很務實：先把護欄建好（`CLAUDE.md` + Skills + Hooks + 測試），再逐步放寬到 auto mode。如果你還在「每次都要盯著 Claude 改檔案」的階段，那表示護欄還不夠——回去補 `CLAUDE.md` 和 hooks，而不是硬切 auto mode。

## 參考資料

- [Claude Code Plan Mode — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/plan-mode)
- [Claude Code Memory (CLAUDE.md) — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/memory)
- [AI-Native SDLC Playbook 課程導讀](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
