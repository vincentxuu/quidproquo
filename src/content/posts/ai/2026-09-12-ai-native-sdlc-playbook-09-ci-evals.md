---
title: "AI-Native SDLC Playbook L9：在 CI 裡跑持續評估"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, evals, ci-cd, testing]
lang: zh-TW
tldr: "Evals 是 AI-native 版的 stage-gate QA——收集 20-50 個真實任務當測試案例，每次改動 CLAUDE.md、skills 或 hooks 時自動跑一輪，pass rate 掉了就擋 merge。每個線上事故都變成永久的 eval。"
description: "Claude Academy AI-Native SDLC Playbook 第九課導讀：怎麼在 CI pipeline 裡對 agent 的設定做回歸測試，以及把每個事故轉化成永久的防護網。"
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 9
---

第八課講的回饋迴圈解決了「單一任務內的驗證」——Claude 在提交前自己跑測試確認產出正確。但還有一個更上層的問題：**當你改了 CLAUDE.md、更新了 skill、調整了 hook，怎麼確定 agent 的整體行為沒有退化？**

[Claude Academy 的第九課](https://academy.claude.com/courses/ai-native-sdlc-playbook/continuous-evals-in-ci)給了一個很直接的答案：

> Evals are the AI-native equivalent of stage-gate QA.

傳統軟體用單元測試和整合測試確保程式碼改動不會破壞既有行為。AI-native 開發需要類似的機制，但測試的對象不是程式碼，而是 **agent 的設定**。

## 為什麼需要 Agent Evals

CLAUDE.md、skills、hooks 這三樣東西控制了 agent 的行為。改動任何一個，agent 的產出就可能不同：

- 把 CLAUDE.md 裡的「Money is always BigDecimal」拿掉，agent 可能開始用 `double` 處理金額
- 更新一個 security skill 的觸發條件，可能導致它在某些情境不再觸發
- 調整 hook 的 matcher pattern，可能漏擋某些應該被攔截的操作

這些變化不會被傳統的單元測試抓到，因為程式碼本身沒變——變的是產生程式碼的那個 agent 的行為。

## 怎麼建立 Eval Suite

### 1. 收集真實任務

課程建議從最近的實際工作中收集 20-50 個任務，每個任務配一組預期結果或驗收條件。不需要自己編造測試案例——真實的 PR 歷史就是最好的素材。

### 2. 轉換成 Eval 結構

每個 eval 包含：
- **Prompt**：任務描述（跟當初工程師給 Claude 的指令類似）
- **Acceptance checks**：驗收條件，例如測試通過、lint 乾淨、行為一致、符合政策

### 3. 在 CI 裡非互動式執行

課程提供了一個 GitHub Actions 的範例：

```yaml
name: Agent evals
on:
  pull_request:
    paths: ['CLAUDE.md', '.claude/**']
  schedule:
    - cron: '0 2 * * *'
jobs:
  evals:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g @anthropic-ai/claude-code
      - name: Run eval suite
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          for eval in evals/*.json; do
            claude -p "$(jq -r '.prompt' $eval)" \
              --allowedTools "Read,Edit,Bash(make test)" \
              --output-format json > result.json
            ./evals/check.sh "$eval" result.json
          done
```

幾個值得注意的設計：

- **觸發條件**：只在 PR 改到 `CLAUDE.md` 或 `.claude/` 目錄時觸發，加上每日凌晨 2 點定期跑一次
- **工具限制**：`--allowedTools` 只開放 Read、Edit、和受限的 Bash（只能跑 `make test`），不會讓 eval 過程中的 Claude 有完整的系統存取權
- **非互動式**：`claude -p` 跑完就結束，不需要人盯著

### 4. 設定 Pass Rate 門檻

把 eval 的 pass rate 設為 merge check——如果某個 skill 的改動導致 pass rate 下降，PR 就不能 merge，必須先解決退化的案例。

### 5. 每個事故變成永久的 Eval

這是整套機制裡最有價值的部分：每次線上出事，負責的團隊要把事故轉化成一個永久的 eval。這個 eval 會一直留在 suite 裡，確保同類問題不會再發生。

依 Anthropic 的說法，隨著 AI 能力進步，某些原本能區分好壞的 eval 會變得不再有鑑別力——模型進步到全都通過了。所以 eval suite 需要持續從監控中補充新案例，保持鑑別力。

## 實戰對照

我們在一個中型專案裡還沒做到完整的 CI eval，但有一個類似概念的基礎版本：skill 是從 `.agents/skills/` 編輯，然後用 `skills:sync` 同步到 `.claude/skills/`（後者是唯讀鏡像）。`pnpm verify` 會檢查兩邊是否一致——如果有人直接改了 `.claude/skills/` 而沒走正確流程，驗證就會失敗。

這本質上就是「agent 設定變更 → 自動驗證」的最基礎形式，只是驗證的是檔案一致性，還不是行為一致性。

如果要往課程建議的方向走，下一步是：

1. 收集最近 20 個實際的開發任務，記錄 prompt 和預期結果
2. 寫一個 `evals/check.sh`，比對 Claude 的產出跟預期結果
3. 在 CI 裡加一個 job，當 CLAUDE.md 或 skill 被改動時觸發

## 排程彈性

課程也承認不是每個團隊都適合在每次 PR 都跑 eval。有些組織可能更適合離線排程——例如每週跑一次完整 eval suite，而不是每次改動都跑。這取決於 agent 設定變更的頻率和 API 預算。

依 Anthropic 的說法：「Teams have discretion in scheduling. While the lesson provides instructions for continuous evaluations, some organizations may prefer running evals offline on set schedules rather than with every change.」

## 治理

Eval 機制本身就是治理的一部分：

- Pass rate 門檻作為 merge check 強制執行
- 每次 eval 的執行結果都有 log，可以跨時間比較
- Agent 設定的變更需要負責團隊的核准

## 怎麼衡量效果

- **Leading indicator**：eval pass rate 隨時間的趨勢，以及從線上事故到建立對應 eval 的時間（從 incident tracker 和 Git log 交叉比對）
- **Lagging indicator**：在 CI 裡被 eval 攔住的退化 vs 漏到線上才發現的退化（從 incident tracker 比對 eval 記錄）

理想狀態是：隨著 eval suite 越來越完整，漏到線上的退化數量持續下降。

## 起步建議

1. 從最近的 PR 歷史挑 20 個有代表性的任務，記錄原始 prompt 和驗收條件
2. 寫一個簡單的 check script，驗證 Claude 的產出是否滿足條件
3. 先用手動方式跑幾次，確認 eval 的鑑別力——它能區分好的 CLAUDE.md 和壞的嗎？
4. 確認有效後，加進 CI，設定在 CLAUDE.md 和 `.claude/` 變更時觸發
5. 每次線上事故後，加一條對應的 eval

## 參考資料

- [Continuous evals in CI — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/continuous-evals-in-ci)
- [Claude Code Non-Interactive Mode — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/cli-usage)
- [AI-Native SDLC Playbook 課程導讀](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
