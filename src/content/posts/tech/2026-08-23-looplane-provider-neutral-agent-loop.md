---
title: "Looplane 的 provider-neutral native loop：一次 model turn 如何走到驗證終態"
date: 2026-08-30
category: tech
type: deep-dive
tags: [looplane, coding-agent, ai-agent, python, llm]
lang: zh-TW
tldr: "Looplane 的 native lane 由 AgentRunner 掌握狀態轉移：準備 workspace、送出 model request、執行 tool calls、寫回 observations，模型沒有再呼叫工具時才進入 verification。step、wall time、重複動作、token 與取消條件都能先於模型宣告終止 run；provider adapter 的協定翻譯留給下一篇。"
description: "沿著 AgentRunner.run 追蹤 Looplane 一次 native turn 的狀態、tool observation、verification gate 與 deterministic terminal reason。"
series:
  name: "Looplane 架構拆解"
  order: 4
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-23-looplane-provider-neutral-agent-loop-en)

Orders 1–3 已建立使用者介面、disposable workspace，以及 [prompt／instructions／explicit memory](/posts/tech/2026-08-30-looplane-prompt-instructions-memory)。這篇進入 native lane：Looplane 自己持有的 `AgentRunner` 如何把一次 model request 變成 tool execution，再走到 verified success 或明確失敗。

「provider-neutral」在這篇只有一個意思：loop 依賴 canonical `ModelProvider.complete()` 與 `ModelTurn`，不把某家 API 的 wire format 寫進狀態機。各 adapter 如何翻譯 OpenAI、Anthropic、Gemini 或 Workers AI，留到 order 5。

## Native turn 的資料流

```text
TaskContract + restored/new session state
                │
                ▼
       AgentRunner.run()
                │
        model.requested
                │
                ▼
     ModelProvider.complete(messages, tools)
                │
                ▼
          canonical ModelTurn
          ├─ tool_calls ─► approve ─► execute ─► observations ─┐
          │                                                    │
          └─ no calls ─► verification ─► pass / repair / fail ◄┘
```

新 run 先固定 base SHA、寫入 request/session、建立 disposable workspace，再初始化 messages。resume 則沿用 manifest 裡的 step、usage、messages 與 active wall time。兩條路徑匯合後，每輪都在送模型前做 instruction/context reload 與必要的 reinjection，接著增加 step、發出 `model.requested`，取得 canonical `ModelTurn`。

如果 turn 含 tool calls，runner 逐一記錄 fingerprint、取得 approval、交給 `ToolExecutor`，再把 observation 寫回 messages，進入下一輪。如果 turn 沒有 tool call，runner 不直接相信文字答案，而是進入 `_verify_all()`。

## Verification 才能把 run 標成完成

模型說「完成」只代表它不再要求工具。`_verify_all()` 會重新執行 `TaskContract.verification` 中的命令：全部通過才回傳 `RunStatus.COMPLETED` 與 `terminal_reason="verified"`。若驗證失敗，bounded output 會以不可信測試輸出的身分回到 conversation，讓模型下一輪修正。

因此 native loop 的 success boundary 不在 provider finish reason，也不在 assistant 最後一句話。它在 runner 重新取得 verification outcomes 之後。這條路徑可由 `tests/test_loop_e2e.py` 的 focused cases 觀察：fixture model 發出工具、runner 執行、驗證失敗回饋，最後才完成或用明確 terminal reason 結束。

## Deterministic guards 可以先終止

`AgentRunner` 不只等待模型停下。它同時持有幾條由程式碼執行的 guard：

- `max_steps`：外層迴圈沒有無限次 model turn。
- wall-time budget：準備 workspace、provider call、tool 與 verification 共用剩餘時間。
- repetition fingerprint：正規化 tool name 與 arguments 後計數，連續重複會得到 `repeated_action`。
- token budget：usage 超過 contract 上限時終止，而不是再問模型要不要繼續。
- cancellation：等待模型或執行階段收到取消訊號時，回傳 `user_cancelled`。

這些限制屬於 runner state，不是 system prompt 中的建議。最典型的 fail-closed 情境是模型連續送出同一個修改：第三次不會再執行 side effect，而是以 repetition terminal reason 停止。`_record_fingerprint()` 使用正規化 JSON 的 hash，使參數鍵順序不同仍被視為同一個 call。

## Contract 讓狀態可以被保存與檢查

`TaskContract`、`ModelTurn`、`ToolObservation` 與 `VerificationOutcome` 都是明確資料結構。`ContractModel` 採 `extra="forbid"` 與 frozen model，避免未知欄位被靜默吞掉，也避免已寫入 session 的值被其他元件原地修改。

這個 contract boundary 讓 journal、resume 與 TUI 可讀同一套狀態。它也限制本篇的結論：provider-neutral 不代表每個 provider 行為相同，只代表 adapter 必須先把回應正規化成 loop 看得懂的值。下一篇只追 protocol translation 與 gateway；retry、fallback、cache hint 與 estimated cost 集中在 [order 6](/posts/tech/2026-08-30-looplane-model-routing-fallback-cost)。

## 目前沒有什麼

這個 loop 沒有因為 deterministic guards 就自動變成安全 sandbox。path、argv、permissions 與 OS containment 是 orders 8-10 的責任；subagent transaction、MCP authorization 與 external CLI handoff 也各有不同 owner。它同樣不保證模型能完成任務，只保證每個終態有可檢查的原因，而且 success 必須越過 verification gate。

若要比較其他 coding agent 把 loop、工具與驗證放在哪一層，可參考 [Pi 的極簡 terminal harness](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness)與 [Codex CLI](/posts/tech/2026-03-31-codex-cli-openai-coding-agent)。本系列下一篇會留在 Looplane code path，專門拆 `ModelProvider` 的 canonical contract 與 protocol translation。

---

## 參考資料

- [Looplane 官方 repo](https://github.com/vincentxuu/looplane)——`AgentRunner.run()`、contracts 與 loop tests 的 ground truth
- [Looplane M1 local harness 文件](https://github.com/vincentxuu/looplane/blob/main/docs/stages/m1-local-harness.md)——native harness 的設計背景
- [Pydantic model config](https://docs.pydantic.dev/latest/api/config/)——frozen 與 extra validation 的語意
