---
title: "跟成熟 coding agent 學設計（12）：小模型能寫程式嗎——能力邊界與 eval 紀律"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 12
tags: [coding-agent, small-models, evaluation, harness-engineering, ollama, llm-agents]
lang: zh-TW
description: "qwen3:4b 讀對了檔案卻寫壞 diff，這算是會寫程式嗎？拆解 pi、OMP、Codex 如何設計 model-backed eval 與編輯格式，對照 rivumi 五次真實 Ollama 評測的分項證據紀律。"
tldr: "小模型卡的不是『不會想』而是『格式不穩』：tool call JSON、diff hunk 計數、context 預算都會爆。五家參考專案的共識是把評測建立在真實模型行為上（pi 的 model-backed eval、OMP 從真實 session log 校準編輯基準、Codex 甚至為弱模型放寬 parser），rivumi 則選最窄但最硬的路：一個 fixture、五次真實 Ollama 執行、manifest 宣告改哪些檔案和哪些 patch 片段才算過，並且把 M2 的失敗原封不動留成證據——不把 mock 當 E2E，不把部分成功講成全過。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-small-model-coding-en)

## 設計問題

先講一個真實故事。rivumi 在 M2 接上本地 Ollama 跑 [Qwen3](https://arxiv.org/abs/2505.09388) 的 `qwen3:4b`，給它一個小到不能再小的任務：calculator 的減法寫成了減號，改成加法讓 pytest 通過。結果是——模型兩次都正確讀到目標檔案、正確指出那一行錯了，然後吐出一個 hunk 行數算錯的 unified diff，`git apply --check` 直接退貨，接著 response budget 燒完，任務失敗。這段紀錄保留在 `docs/stages/m2-interactive-cli-provider-gateway.md`，而且刻意不刪。

這就是 4B 級小模型的典型卡點，而且有三個：

1. **Tool call 格式**。小模型對 JSON schema 的遵從度不穩，偶爾夾帶自然語言或截斷的參數。
2. **Diff 格式**。Unified diff 要求精確的 hunk 行數算術，這恰恰是小模型最弱的「數得出來但數不對」類任務。
3. **Context 上限**。Qwen3 的隱藏推理會先吃掉 token 預算，M3 就遇過一次 1024-token turn bound 被思考耗盡、連 tool call 都還沒發出的案例。

但更麻煩的是第二層問題：**eval 怎麼設計才不騙自己**。拿 mock LLM 測 harness，測到的只是 harness 自己；跑一次成功可能是運氣；「讀對了檔案」是部分成功，講成「agent 能修 bug」就是造假。小模型研究最容易犯的錯，不是模型太弱，而是量測太軟。[SWE-bench](https://arxiv.org/abs/2310.06770) 之所以成為標準，正是因為它用真實 GitHub issue 加上 fail-to-pass 測試當判準，不讓模型自評。

## 五家怎麼做

### pi：eval 就是行為測試，跑真的 session

pi 把 eval 做成 vitest 的第一公民：`pi-mono/packages/evals/src/pi-harness.ts#createPiCodingAgentHarness` 把真的 `AgentSession` 包進 [vitest-evals](https://github.com/getsentry/vitest-evals)，在隔離的暫存專案裡跑，`runs.jsonl` 索引每次執行的原生 session JSONL。關鍵立場寫在 README 第一句：「model-backed checks」——沒有 mock，每一次 eval 都是花真 token 換真行為，而且 artifact 留下來可以事後稽核。

### OMP：用真實使用資料校準基準，再用統一模型記錄

OMP 的 `oh-my-pi/packages/typescript-edit-benchmark/src/tasks.ts#EditTask` 定義了 input/expected 目錄成對的編輯任務，`src/verify.ts#VerificationResult` 的判分方式很務實：輸出先過 Prettier 再比對，程式碼還容忍多餘空行——因為它要量的是「編輯對不對」，不是「格式潔癖」。更有趣的是 `src/edit-shape-stats.ts`：它掃真實 session log 裡成功的 edit 呼叫，量出中位數五行的變更、近半數單 hunk，再回頭校準 fixture 難度。**基準題不是拍腦袋出的，是從真實工作負載量出來的。**

往上 一層，`oh-my-pi/packages/metaharness/src/store.ts#RunRow` 和 `#TraceRow` 把 Harbor、edit benchmark、SnapCompact 三種基準統一成 experiment → run → trace 模型，SQLite 儲存、同一個 dashboard 看 score/tokens/cost。配套的 `packages/stats` 再把日常真實使用的 cache rate、error rate、tokens/s 做成觀測儀表——eval 數字有了對照組。

### Codex：承認弱模型存在，parser 主動讓步

`codex/codex-rs/apply-patch/src/parser.rs#PARSE_IN_STRICT_MODE` 是整份研究裡我覺得最誠實的一行程式碼：常數設為 `false`，註解直說「目前唯一已知需要寬鬆解析的是 gpt-4.1」，所以所有模型都用 Lenient 模式。Codex 用自訂的 `*** Begin Patch` 格式而非嚴格 unified diff，parser 還替特定模型容忍格式瑕疵——**harness 為模型的弱點設計，而不是假裝弱點不存在**。另外 Claude Code 靠 `claude-code-source/src/services/compact/autoCompact.ts` 在接近 context 上限時自動壓縮，等於承認「假設 context 夠用」本身就是設計錯誤。（至於 OpenCode，repo 內找不到獨立的 benchmark 套件，eval 策略偏向外部的 CI 流程——這本身也是一種光譜上的位置。）

## rivumi 的選擇與差異

M2 的失敗直接變成 M3 的規格。rivumi 的答案分三塊：

**任務宣告在 manifest，不在程式碼裡。** `evals/live/tiny-python-bug.json` 寫死：預期只改 `src/tiny_python_bug/calculator.py`、patch 必須含 `-    return left - right` 和 `+    return left + right` 兩個片段、必須成功呼叫 `replace_text`、8 步 300 秒上限、5 次至少 4 次過。

**每次嘗試都是全新的世界。** `scripts/eval_live_provider.py#prepare_source` 每次 attempt 都複製 fixture、重新 `git init`、commit、記 HEAD 和 tree digest；`tree_digest` 事後驗證源碼位元組完全沒動。五次真實 Ollama 執行各自留下 events 和 result 的 SHA-256，成功的工具序列都是 `list_files, read_file, replace_text, run_check`。

**分項記錄，失敗也是證據。** transport、tool-use、edit、verification、task-completion 各自分開看：M2 的 4B 讀對檔案算 tool-use 層的成功、edit 層的失敗，兩件事不被混在一起講。最終 M3 以 5/5 通過（門檻 4/5），stage doc 卻明寫「M3 does not interpret the 5/5 result as broad 4B-model reliability」——結論範圍鎖死在 manifest 裡那個 fixture。

與五家的差異很清楚：rivumi 沒有 OMP 那種大規模 benchmark 基礎設施，選的是**窄但硬**——一個任務、五次重複、可重現的 artifact 與 hash。代價是覆蓋率近乎零，換到的是每一句宣稱都有檔案可以指。

## 學術依據

[SWE-bench](https://arxiv.org/abs/2310.06770) 確立了兩件事：eval 任務應該來自真實軟體（GitHub issue），判準應該是可執行的測試而非模型自述。rivumi 的 fail-to-pass pytest 加上 patch 斷言，本質上是它的縮小版。模型側，[Qwen3 技術報告](https://arxiv.org/abs/2505.09388)顯示 4B 級模型在推理模式下的能力與限制並存——能推理解題，但輸出格式穩定度仍是短版，這與 M2/M3 觀察到的行為一致。

## 改善路線

按優先順序：

1. **Fixture 多樣化**。一個 one-line fix 的可重現性已經證明，下一步是多檔案、需要多次編輯的任務，否則 eval 只覆蓋 replace_text 的甜蜜點。
2. **借 metaharness 的統一記錄**。experiment → run → trace 的 SQLite 模型適合 rivumi 未來跑跨模型比較（qwen3 對照其他小模型），不用每次手拼 summary.json。
3. **像 edit-shape-stats 一樣量自己**。等 rivumi 有真實使用量後，回頭校準 fixture 難度，別讓基準停留在玩具題。
4. **考慮 Codex 式的格式讓步**。replace_text 已經繞開了 diff 算術；若未來支援更強的本地模型，可以重新評估是否放回 unified diff，反之則維持現狀。

小模型能不能寫程式？目前的答案是：能找到正確語義修改，但 harness 得替它把格式風險全部接走——而且你必須先有一套不騙自己的 eval，才有資格回答這個問題。

## 參考資料

- [SWE-bench: Can Language Models Resolve Real-World GitHub Issues?](https://arxiv.org/abs/2310.06770) — small model coding eval 與 rivumi evaluation 紀律的基準。
- [Qwen3 Technical Report](https://arxiv.org/abs/2505.09388)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)（`packages/evals`）
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)（`packages/typescript-edit-benchmark`、`packages/metaharness`、`packages/stats`）
- [openai/codex](https://github.com/openai/codex)（`codex-rs/apply-patch`）
- [anthropics/claude-code](https://github.com/anthropics/claude-code)
