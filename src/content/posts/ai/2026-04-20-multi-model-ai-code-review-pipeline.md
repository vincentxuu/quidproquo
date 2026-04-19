---
title: "用 Codex + Gemini + Claude 做多引擎 Code Review：原理、模式與實作"
date: 2026-04-20
category: ai
tags: [claude-code, gemini-cli, codex-cli, code-review, agentic-workflow, multi-model]
lang: zh-TW
tldr: "AI 模型審查自己的程式碼時會自我合理化，用三個不同 CLI 做獨立 review 可以有效捕捉盲點——這篇介紹背後的設計哲學與實際的工作流程模式。"
description: "為什麼 AI 做 code review 需要多個模型？本文介紹社群中出現的五種多引擎 workflow 模式，以及如何用 Codex CLI、Gemini CLI、Claude Haiku 組成一套實用的三引擎 review pipeline。"
draft: false
---

今年初，Codex CLI 公開發布、Gemini CLI 開源，AI coding 工具的格局從「一個 IDE 外掛」變成「多個 CLI 工具互相協作」。社群裡出現了一批有趣的模式：不是讓 AI 寫更多程式碼，而是讓不同 AI 互相 review 彼此的輸出。

這篇文章整理了目前社群中最常見的多引擎 workflow，以及為什麼「讓同一個模型 review 自己寫的程式碼」根本上是個問題。

## 為什麼一個模型不夠

Lad MCP Server 的作者（一間 AI 顧問公司）在 README 裡說得很清楚：

> "LLMs generate text token by token. When an agent makes a questionable design choice early on, every subsequent token tries to justify and reinforce that mistake to maintain cohesion. The agent effectively gaslights itself."

這就是「壞 token」問題。模型生成了一段有問題的程式碼，但因為接下來的 token 都需要保持語意連貫，它會繼續強化那個錯誤的方向，而不是質疑它。讓同一個模型 review 自己的輸出，本質上是讓它讀自己的推理鏈——它看到的是「合理」，因為它一開始就是這樣推理過來的。

換一個沒有這段 token 歷史的模型，它才能真正「挑戰」而不是「合理化」。

multi-model-review 這個專案的說法也類似：
> "A different model reading the same spec and diff has: different training data (catches issues the builder's model is blind to), different calibration on severity (less confirmation bias), different house style."

---

## 五種主要模式

### 模式一：Drafter + Reviewer 分工

最常見的做法。Claude Code 負責規劃和實作，Codex 負責最終的程式碼審核和套用。

以 Synapse 為例：

```
init → plan → Gate（人工確認）
     → Claude/Gemini 生成 diff 草稿
     → Codex 審核並重寫成 production 品質的程式碼
     → verify（lint/typecheck/test）
     → Claude/Gemini 審核最終 diff
```

外部模型只生成草稿，永遠不直接動你的檔案。Codex 是執行的守門人。

### 模式二：Consensus Gate（多數決把關）

三個模型並行 review，必須達到共識才能放行。Cerberus 把這個模式做成 Claude Code plugin：

```
Claude Code 的任何輸出
    → 並行送給 Codex + Gemini + Claude Opus
    → 多數決
    → 通過：session 自動核准
    → 不通過：要求修改，最多循環 3 輪
```

支援 `--mode fast|smart|max`，max 模式用最強的推理深度，對應高風險的程式碼變更。

### 模式三：Markdown 作為模型間的介面

模型之間不直接溝通，而是透過磁碟上的 markdown 檔案交接。multi-model-review 的流程：

```bash
# Claude 把 review 所需的所有資訊打包
/multi-model-review:review-package

# 你手動把這個 package 送給另一個模型
gemini --file .cross-review/packages/<timestamp>/review-package.md \
  > .cross-review/packages/<timestamp>/review-report.md

# Claude 讀取報告並逐一處理問題
/multi-model-review:apply-review
```

這個模式的好處是不需要模型之間有任何整合，你可以把同一個 package 送給 Codex 和 Gemini，然後比較兩份報告。

### 模式四：Orchestration Daemon

一個常駐服務監聽 GitHub issue，根據 label 決定要派給哪個 CLI：

```
GitHub comment: /review
    → daemon 讀取 label：agent:codex
    → 啟動 Codex CLI review session
    → 實作完成後自動觸發 review
```

ghiagor 支援 `/plan`、`/implement`、`/review`、`/loopfix` 等指令，可以在 GitHub 上用 slash command 直接控制哪個 AI 做什麼。

### 模式五：MCP Server 包裝多引擎

Lad MCP Server 把雙引擎 review 包成兩個 MCP tool（`system_design_review`、`code_review`），任何支援 MCP 的 client 都可以用。預設用 OpenRouter 同時呼叫兩個不同的模型（kimi-k2 + minimax），宣稱讓 AI 生成程式碼品質提升 15-20%。

---

## 角色分工的規律

翻了十幾個專案，每個模型被信任做的事情有明顯的傾向：

| 模型 | 常見角色 |
|------|---------|
| **Claude Code** | 架構規劃、風險分析、安全性、套用修正 |
| **Gemini CLI** | 前端/UX 審核、可及性、廣度掃描、文件 |
| **Codex CLI** | API 可行性、程式碼執行把關、DX 檢查 |
| **Cursor Agent** | 檔案結構、模組導覽、專案佈局 |

這不是硬性規則，但反映了社群實際使用下來的感覺：Gemini 對 UI 相關問題比較敏感，Codex 對可執行性和 API 設計比較嚴格，Claude 對架構和安全性比較深入。

---

## 實作：三引擎 review pipeline

基於上面的模式，我目前的 code review 流程是這樣：

### 步驟 1：確認 base branch

```bash
BASE=$(gh pr view --json baseRefName -q .baseRefName 2>/dev/null \
  || git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null \
    | sed 's|refs/remotes/origin/||' \
  || echo "main")
```

### 步驟 2：Codex Review

```bash
codex review \
  "Focus on repository code only. Check: logic errors, security issues, performance, architecture consistency." \
  -c 'model_reasoning_effort="high"' \
  --enable web_search_cached
```

Codex 的 `review` subcommand 有自己的 diff 解析和 P1/P2 問題分級，`--enable web_search_cached` 讓它可以查文件。

### 步驟 3：Gemini Review

```bash
git diff "$BASE"...HEAD | gemini -p "Review this diff.
Report issues as a table: | Severity | File | Issue | Suggestion |
Severity: High (bug/security), Medium (perf/maintainability), Low (style).
Be direct. No compliments." \
  --approval-mode yolo
```

### 步驟 4：Claude Haiku Review

```bash
git diff "$BASE"...HEAD | claude -p "Review this diff.
Same table format. Same severity levels.
Be direct. No compliments." \
  --model claude-haiku-4-5-20251001
```

Haiku 用 headless mode，速度快，token 成本低，適合當第三個獨立意見。

### 步驟 5：Cross-model 分析

三個引擎跑完後比對發現：
- 三者都回報 → High，必須修
- 兩者回報 → 強烈建議確認
- 只有一個回報 → 可能是模型特定的偏好，讓人自己判斷

---

## 整體來說

多引擎 review 的核心假設是：不同 AI 模型有不同的訓練資料、不同的風格偏好、不同的盲點。讓它們獨立審查同一份程式碼，再比對分歧，是目前最低成本的「提升 AI code review 可信度」的方式。

缺點是時間成本——三個 CLI 串行跑下來，可能要 5-10 分鐘。如果 diff 很大，Codex 的 review 單獨就可能需要 3-5 分鐘。

目前這個做法適合 push 前做一次完整的品質把關，不適合在每個小改動後都跑。

---

## 參考資料

- [Synapse — Codex-based drafter+reviewer pipeline](https://github.com/snakeying/Synapse)
- [Cerberus — Consensus gate with auto-iteration](https://github.com/charlieyou/cerberus)
- [multi-model-review — Portable handoff via markdown](https://github.com/formin/multi-model-review)
- [Lad MCP Server — Dual-reviewer via OpenRouter](https://github.com/Shelpuk-AI-Technology-Consulting/lad_mcp_server)
- [ghiagor — GitHub-issue-driven orchestration daemon](https://github.com/pppontusw/ghiagor)
- [cross-model-code-review-skill — Confidence-scored consensus matrix](https://github.com/craigkitterman/cross-model-code-review-skill)
- [CodMate — 655 stars, session manager for all three CLIs](https://github.com/loocor/codmate)
- [matthewod11-stack/claude-setup — Parallel spec review with 4 models](https://github.com/matthewod11-stack/claude-setup)
- [ai-dev-skills — Model-agnostic shared skill library](https://github.com/davideagostini/ai-dev-skills)
