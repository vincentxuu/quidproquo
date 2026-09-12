---
title: "AI-Native SDLC Playbook L5：CLAUDE.md 把團隊知識變成 Agent 的記憶"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, claude-md, context-engineering, governance]
lang: zh-TW
tldr: "CLAUDE.md 是放在 repo 根目錄的上下文檔案，讓 Claude 在每次 session 開始時就知道這個專案的慣例、指令、架構和地雷。課程的核心建議：同樣的錯犯兩次，就寫進 CLAUDE.md。"
description: "Claude Academy AI-Native SDLC Playbook 第五課導讀：CLAUDE.md 的定位、寫法、治理機制，以及為什麼它是 AI-native 開發流程的基礎設施。"
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 5
---

每個團隊都有一堆「只有老手知道」的潛規則：建置指令要加什麼 flag、哪個模組不能動、金額為什麼一定要用 BigDecimal。這些知識散落在 wiki、Slack 歷史訊息、和資深工程師的腦袋裡。新人靠踩坑學、AI agent 靠運氣猜。

[Claude Academy 第五課](https://academy.claude.com/courses/ai-native-sdlc-playbook/claude-md)要解決的就是這個問題：**把團隊的隱性知識變成一份 Claude 每次 session 都會讀的檔案。**

## 課程教了什麼

### CLAUDE.md 是什麼

`CLAUDE.md` 放在 repo 根目錄，是 Claude Code 在每次 session 開始時自動載入的上下文檔案。依 [Anthropic 官方文件](https://docs.anthropic.com/en/docs/claude-code/memory)的說法，它的作用是讓 Claude 理解團隊的慣例、指令、架構模式和常見錯誤。

課程用一句話總結：「以前存在人腦和 wiki 裡的知識，現在變成 agent 在每次 session 開頭就讀的檔案。」

### 怎麼建立

1. 在 repo 裡執行 `/init`，Claude 會根據已有的內容自動產出初始版本
2. 精簡到「第一天就需要知道的事」：建置指令、測試方式、lint 規則、重要慣例、反覆出現的坑
3. Commit 進 git，讓整個團隊共用同一份，修改走 code review
4. 建立工作規則：**同樣的錯犯兩次，就把修正寫進 CLAUDE.md**
5. 控制在一頁以內——Claude 每次 session 都會全部讀進去，過時的內容只是浪費 context

### 範例結構

課程給了一個支付服務的範例：

```
# Payments service
## Commands
- Build: make build
- Test: make test (unit), make itest (integration, needs docker)
- Lint: make lint (runs in CI; fix before pushing)
## Conventions
- Java 21, Spring Boot 3. No new Lombok.
- Money is always BigDecimal, never double.
- Every endpoint needs an integration test in src/itest.
## Architecture
- api/ holds REST controllers, core/ holds domain logic,
  adapters/ talks to external systems.
- Kafka events are defined in schemas/; never edit generated classes.
## Things Claude gets wrong
- Do not bump dependency versions; the platform team owns them.
- The legacy v1/ package is frozen; changes go in v2/.
```

關鍵結構：**Commands → Conventions → Architecture → Things Claude gets wrong**。最後一個區塊特別重要——它是從實際錯誤中累積出來的，每一條都對應一個真實的踩坑。

### 治理面

課程強調 `CLAUDE.md` 不只是「方便的文件」，而是**可審查、可稽核的 agent 指令**：

- 所有修改都走版控，有完整的變更紀錄
- 團隊慣例統一套用到每個 session，不因人而異
- Code owner 可以要求 `CLAUDE.md` 的修改需要特定人核准

### 怎麼衡量效果

課程建議追蹤兩個指標：

- **先行指標**：Claude 重複犯 `CLAUDE.md` 已經記載的錯誤的頻率（應該趨近於零）
- **落後指標**：新成員從加入到第一個 merged PR 的時間（應該縮短）

## 實戰對照：從一頁到分層治理

在我們的一個專案裡，`CLAUDE.md` 早就不只是一份「備忘錄」——它演化成了一套分層的行動治理框架。

### Tier 分級制度

我們把 agent 可以做的事分成四個等級：

| Tier | 範圍 | 說明 |
|------|------|------|
| 0 | 自主執行 | 讀檔、跑檢查、依 skill 寫文章 |
| 1 | 過閘門 | 任何 commit 都要通過 verify gate |
| 2 | 先問再做 | schema 變更、deploy、刪已發佈內容 |
| 3 | 禁止 | 繞過檢查、無來源寫事實、未確認就 revert |

這個分級不是一開始就設計好的，而是從實際踩坑中長出來的。每次 agent 做了不該做的事，我們就在 `CLAUDE.md` 裡加一條規則，逐漸形成了現在的結構。

### verify gate 的角色

`CLAUDE.md` 裡寫了 `pnpm verify` 是品質閘門，agent 在每次 commit 前都要跑過。這個 gate 背後串了 lint、內部連結檢查、skill 同步驗證等多個檢查項目。如果紅了，agent 要修真正的問題，不能用 `--no-verify` 繞過——這也寫在 `CLAUDE.md` 裡。

### 幾個學到的事

**「一頁以內」是對的，但要定義什麼算一頁。** 我們的 `CLAUDE.md` 包含 commit convention、分支策略、verify gate 說明，加起來大約 150 行。超過這個量的細節就該搬到 skill 裡，而不是全塞在 `CLAUDE.md`。

**「Things Claude gets wrong」是最有價值的區塊。** 我們在裡面記了像「不要自己發明新分類」「不要用 `--no-verify` 繞過 pre-commit」這類規則。每一條都來自真實的事故，效果立竿見影。

**CLAUDE.md 需要定期清理。** 過時的規則不只浪費 context，還可能跟新規則衝突。我們大約每兩週做一次精簡，刪掉已經被 hook 或 skill 取代的條目。

## 給讀者的起步建議

### 第一步：跑 /init，但別照單全收

`/init` 產出的版本通常太長、太泛。花 15 分鐘把它砍到只剩「不知道會出事」的東西：建置指令、不能碰的地方、反覆出錯的地方。

### 第二步：加上「Things Claude gets wrong」

開一個專門的區塊，每次 Claude 犯錯就加一條。不需要事先想好所有規則——讓錯誤驅動，兩週後這個區塊就會成為整份文件最有價值的部分。

### 第三步：讓修改走 code review

把 `CLAUDE.md` 加進 CODEOWNERS，指定 tech lead 或資深工程師為 reviewer。它是 agent 行為的設定檔，改動的影響範圍等同於改 CI 設定——不應該隨便改。

### 第四步：搭配 hook 做硬性執行

`CLAUDE.md` 是建議性的——Claude「應該」遵守，但技術上可以不遵守。對於絕對不能違反的規則（例如「不能推 production」），用 hook 做確定性的阻擋。下一課（L6 Skills）和 L11（Hooks）會深入這個主題。

## 參考資料

- [The CLAUDE.md — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/claude-md)
- [Claude Code Memory (CLAUDE.md) — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/memory)
- [AI-Native SDLC Playbook 課程導讀](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
