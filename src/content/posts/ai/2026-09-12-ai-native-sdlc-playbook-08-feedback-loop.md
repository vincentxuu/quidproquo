---
title: "AI-Native SDLC Playbook L8：給 Claude 一個回饋迴圈"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, feedback-loop, testing, ci-cd]
lang: zh-TW
tldr: "讓 Claude 在提交前自己驗證自己的產出——測試、build、截圖比對全部跑過才算完成。工程師收到的不再是「可能對」的程式碼，而是「已經通過驗證」的程式碼。"
description: "Claude Academy AI-Native SDLC Playbook 第八課導讀：怎麼建立 feedback loop 讓 agent 自我驗證，以及用 hook 防止 agent 為了讓測試過而改測試。"
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 8
---

AI agent 寫程式碼的速度很快，但「寫出來」和「寫對」之間有一段距離。傳統的驗證信號來得太晚——CI 要等幾分鐘、code review 要等幾小時、上線後的問題要等幾天甚至幾週。如果 agent 只負責產出、驗證全靠人，那工程師就變成瓶頸。

[Claude Academy 的第八課](https://academy.claude.com/courses/ai-native-sdlc-playbook/give-claude-a-feedback-loop)的核心論點只有一句：

> Always give Claude a way to verify its own work, whether tests, a build, or a screenshot diff.

## 回饋迴圈 ≠ 驗證 Subagent

課程特別區分了兩個容易混淆的概念：

- **回饋迴圈**（feedback loop）貫穿整個任務，Claude 寫一段、驗證一次、修正、再驗證，循環直到所有檢查都通過
- **驗證 subagent**（verifier）是第七課講的獨立角色，在任務結束時做一次完整檢查

兩者互補，但回饋迴圈是更基礎的機制。沒有回饋迴圈，Claude 只能在最後才知道自己寫的東西有沒有問題；有了回饋迴圈，每一步都有信號。

## 怎麼建立回饋迴圈

### 1. 把驗證步驟收攏成單一命令

如果驗證需要跑三個命令、看兩個 log、手動檢查一個頁面，Claude 很容易漏掉某一步。課程建議把所有驗證步驟包成一個目標，例如 `make test` 或 `npm test`，失敗時回傳非零 exit code。

### 2. 在 CLAUDE.md 裡寫清楚

驗證命令、健康輸出的樣子、什麼算「通過」，全部寫進 CLAUDE.md：

```markdown
## Verifying your work

- Build: make build (must finish with "Build succeeded")
- Test: make test (all green; never skip or delete a failing test)
- Lint: make lint (zero warnings)

Run all three before reporting any task complete, and paste the output.
If a test fails, fix the code, not the test.
```

最後一句是關鍵：「If a test fails, fix the code, not the test.」這是一條需要用 hook 強制執行的規則，後面會詳述。

### 3. 讓驗證目標可量化

模糊的指示（「確認功能正常」）會讓 Claude 自己判斷什麼算正常。課程建議用具體、可測量的目標：

- 「`test_status.py` 裡所有測試都通過」
- 「截圖跟 mock 一致」
- 「endpoint 回傳 200 並包含新欄位」

Claude 可以獨立判斷這些條件是否滿足，不需要人介入。

### 4. 修 Bug 時，先寫測試

這是課程裡最實用的具體建議：

1. 讓 Claude 把 bug 重現為一個測試
2. 確認測試確實失敗，而且失敗原因跟 bug 一致
3. Commit 這個測試
4. 要求 Claude 修 bug，但**不准修改測試檔案**（用 hook 強制）
5. 測試通過就證明 bug 已修復

這個流程的精妙之處在於：測試先 commit，Claude 就沒有「改測試讓它過」的退路。

### 5. UI 工作用視覺驗證

前端改動需要視覺確認。課程建議提供瀏覽器工具或截圖工具（透過 MCP），讓 Claude 能看到渲染結果。典型的迭代是 2-3 輪：改 → 截圖 → 比對 mock → 再改。

### 6. 保護迴圈不被弱化

回饋迴圈最大的風險是 agent 為了讓檢查通過而弱化檢查本身——刪掉失敗的測試、把 lint 規則從 error 降成 warning、跳過截圖比對。課程用 hooks 解決這個問題：

- 在修 bug 的任務裡，擋住對測試檔案的編輯
- 在 PR 裡檢查 diff 有沒有修改測試

## 實戰對照

我們在一個中型專案裡實作了類似的概念。`pnpm verify` 是我們的統一 gate，pre-commit 時自動跑 lint、內部參照檢查、skill 鏡像一致性驗證。一個命令，非零就擋。

具體的規則寫在 CLAUDE.md 的治理分級裡：

- **Tier 1（過閘門）**：任何 commit 都要通過 `pnpm verify`，紅了修真問題，不准 `--no-verify`
- **Tier 3（禁止）**：為了變綠而弱化檢查

我們也用 hook 做了類似的保護。`PreToolUse` hook 會檢查 Claude 試圖編輯的檔案，如果偵測到疑似憑證內容或違反 profile 規則的操作就擋下。`Stop` hook 則在 Claude 結束前印出每個被編輯檔案的檢查結果和 diff 行數。

效果很明顯：引入 feedback loop 之前，大約三成的 commit 在 CI 會紅（通常是 lint 或參照壞掉）；引入之後降到個位數百分比，因為 Claude 在本地就已經跑過驗證了。

## 治理與證據

課程強調回饋迴圈本身就是治理的一環：

- `make test` 的輸出、build log、截圖比對結果都是 Claude 自己跑的，不是人手動貼的——這些就是證據
- Session transcript 可以透過 OpenTelemetry 轉發到可觀測性平台
- PR 裡的 check run 結果對 reviewer 和稽核人員可見
- Code owner 做 review 時可以專注在意圖和風險，因為機械性的驗證已經附在 PR 裡了

## 怎麼衡量效果

- **Leading indicator**：agent 寫的變更第一次跑 CI 就通過的比率（CI 系統本身就有這個資料）
- **Lagging indicator**：每個 PR 的 review 時間（從 PR metadata 算），以及 change failure rate（從 incident tracker 算）

理想情況下，review 時間應該縮短——因為 reviewer 以前要抓的機械性問題（lint、測試沒跑、build 壞了）現在已經被 feedback loop 攔住了。

## 起步建議

1. 把所有驗證步驟包成一個命令，確保失敗時回傳非零 exit code
2. 在 CLAUDE.md 列出命令、預期輸出、什麼算通過
3. 加一條規則：「測試失敗時修程式碼，不修測試」
4. 用 hook 強制這條規則——至少在 bug fix 的分支上擋住對測試檔案的編輯
5. 一週後看 CI first-pass 成功率有沒有提升

## 參考資料

- [Give Claude a feedback loop — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/give-claude-a-feedback-loop)
- [Claude Code Hooks — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [AI-Native SDLC Playbook 課程導讀](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
