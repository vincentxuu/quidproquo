---
title: "用 Python 寫私人 coding agent：M9 從 CLI prompt 走進全螢幕 TUI"
date: 2026-08-22
category: ai
tags: [coding-agent, python, tui, textual, approval, cancellation, harness-engineering]
lang: zh-TW
type: project
description: "Python coding agent 的第九個里程碑：用 Textual 組合 onboarding、live events、approval、safe stop 與結果畫面。"
tldr: "全螢幕不難，難的是讓 UI 不破壞 agent harness；事件、核准與取消都必須沿用 durable core contract。"
draft: true
glossary:
  - term: "TUI"
    definition: "在終端機中以全螢幕元件呈現的文字使用者介面。"
  - term: "cooperative cancellation"
    definition: "工作在安全邊界主動響應停止要求，而不是任意中斷正在進行的副作用。"
---

## TL;DR

M8 已把第一次啟動從空白 `Model:` 改成 provider-aware onboarding，但執行畫面仍是 prompt、event line、approval prompt 依序往下長。功能能用，體感不像 Claude Code、Codex、Pi 或 OpenCode。

M9 讓真實 TTY 的裸 `pca` 進入 Textual alternate screen：上方固定 repository/model context，中間是 live activity，底部是 task composer；修改與執行會開 modal，完成後顯示 changed files、checks、session 與 patch。`pca -p`、`pca exec` 與 non-TTY 完全不進 TUI。

## 畫全螢幕不難，取消才難

一個漂亮的 `Input` 與 `RichLog` 很快就能完成。危險的是 Stop。

PCA 的 tool 與 verification 會在 bounded host thread 中執行。若 Textual 直接 cancel worker，await 雖然結束，thread 仍可能修改 disposable workspace；同時 session lease 已被釋放，畫面卻宣稱可以安全 resume。這會讓 UI state、durable state 和真實副作用分裂。

因此 Stop 改成 cooperative cancellation：

- 等待 model 時可立即取消，因為尚未執行 repository side effect；
- approval modal 的 Ctrl+C 等同 Cancel decision；
- tool/check 一旦 started，就顯示「完成目前動作後停止」；
- completed event 與 checkpoint 落盤後，才寫 `cancelled / user_cancelled` result 並釋放 writer lease。

## TUI 只接兩個既有介面

我沒有把 Textual import 塞進 `AgentRunner`。UI 只接兩個 provider-neutral seam。

第一個是 `EventSink.emit(RunEvent)`。原本的 composite sink 先寫 durable JSONL，再把同一個 immutable event 交給 `TextualEventSink`。畫面可以 reducer 成「Thinking」「Using replace_text」「Verifying」，但不能自行判定成功；terminal `RunResult` 才是權威。

第二個是 `ApprovalPolicy.decide(ApprovalRequest)`。Read 自動 allow，Modify/Execute 顯示 Once、Session、Deny、Cancel。Modal 關閉與 Escape 都 fail closed，不會留下永遠等待的 future。

這兩個介面也是 [從模型元件到 Agent Harness](https://quidproquo.cc/ai/2026-08-10-model-component-harness-system/) 的實際應用：presentation 可以換，loop、tool、guard、checkpoint 與 provider contract 不必跟著重寫。

## Headless 仍是一等公民

完整 routing 是：

```text
pca                 -> TTY full-screen
pca "fix tests"     -> full-screen，預填並執行 task
pca --plain         -> line-oriented fallback
pca -p "..."        -> headless JSON
pca exec "..."      -> headless automation
PCA_NO_TUI=1 pca    -> environment fallback
```

這不是把所有路徑強迫改成 TUI。CI、pipe、pseudo-TTY automation 仍要 prompt-free；SSH 或 terminal capability 有問題時也必須有可診斷的 fallback。

## 測試不只看字串

Textual 8.2.8 的 `run_test()` 與 Pilot 會真的 mount screen、輸入 task、開 onboarding/approval modal 並按按鈕。測試同時驗證 config 仍是 atomic `0600` 非機密 JSON、raw events 能更新 activity、Once decision 精確回到 core，以及 started tool 收到 Stop 後一定先有 `tool.completed`，才有 `run.cancelled`。

另外用真實 PTY 執行裸 `pca`，確認 alternate screen、context、activity、composer、footer 都出現，Ctrl+C 後 terminal 也會恢復，不殘留 ANSI 畫面。

## 還沒有做什麼

目前 model contract 是 non-streaming，所以畫面是 step/tool live，不是 token streaming。`pca resume` 仍走既有 validated line path；要在 TUI replay history，應先提供經 `SessionStore` 驗證的 immutable event read API，而不是讓 UI 偷讀 JSONL。

也沒有加入多 agent tabs、embedded shell 或直接編輯來源 repo。全螢幕只是更好的 harness frontend，不是放寬安全範圍的理由。

## 學到的事

TUI 的價值不是邊框，而是把 context、activity、decision 與 result 放在同一個可信狀態機。最重要的實作往往不在 CSS，而在 Stop 到底代表「畫面不等了」，還是「系統已經安全停止」。

---

## 參考資料

- [Textual application framework](https://textual.textualize.io/)
- [Textual worker guide](https://textual.textualize.io/guide/workers/)
- [Textual testing guide](https://textual.textualize.io/guide/testing/)
- [Claude Code CLI reference](https://docs.anthropic.com/en/docs/claude-code/cli-reference)
- [OpenAI Codex CLI reference](https://developers.openai.com/codex/cli/reference/)
- [Pi coding agent](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent)
- [OpenCode CLI](https://opencode.ai/docs/cli/)
