---
title: "跟成熟 coding agent 學設計（5）：Verification gate——改了檔案不算成功，驗過才算"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 5
tags: [coding-agent, harness-engineering, verification, testing, evaluation, llm-agents]
lang: zh-TW
description: "LLM 自稱做完不等於做完。拆解 pi、OMP、OpenCode、Codex、Claude Code 五家如何處理任務完成判準——從純 prompt 呼籲到 Claude Code 的對抗式驗證 subagent——對照 rivumi 的硬性 verification gate 設計。"
tldr: "五家參考專案裡沒有任何一家在 harness 層強制「宣告的驗證指令全過才算成功」：pi 靠模型自覺、OpenCode 和 Codex 把驗證寫進 system prompt、Claude Code 用獨立的對抗式驗證 subagent 但仍是軟性合約、只有 OMP 的 cleanse 真的由 harness 跑檢查。rivumi 選最硬的一條路：改過檔案就必須重跑所有宣告的驗證指令，全過才給 terminal_reason=verified；沒動任何檔案就不重跑（no_changes），把「跑不跑」變成程式碼決定，不是模型決定。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-verification-gate-en)

## 設計問題

Agent 跑完一輪，model 吐出一段 final answer：「我已經修好了，測試全部通過。」請問此刻任務完成了嗎？

答案是：你什麼都還不知道。LLM 的完成宣言是生成的文字，不是執行的結果。它可能真的跑了測試、也可能只是把「測試通過」這四個字當成敘事的一部分寫出來——研究上這種幻覺完成宣言（hallucinated completion）是 agent 最常見的失敗模式之一：改錯地方、改一半、或根本沒改，但收尾語氣篤定。所以每個 agent harness 都得回答三個問題：

1. 「成功」的判準是誰說了算——model、harness、還是使用者？
2. 驗證指令在哪裡宣告？誰負責跑？
3. 驗證失敗之後，是結束、還是餵回去再來一輪？

## 五家怎麼做

### pi：刻意最小化，驗證留給使用者

pi 的系統提示由 `pi-mono/packages/coding-agent/src/core/system-prompt.ts#buildSystemPrompt` 組裝，guidelines 只有「簡潔回覆」「清楚標示檔案路徑」這類條目，整個 `packages/coding-agent/src/` 裡找不到任何 verification gate——agent turn 結束就是結束，沒有 harness 層的檢查關卡。這不是偷懶，是設計選擇：pi 把自己定位成可組裝的核心，驗證策略交給上層應用和使用者。

### OpenCode：寫進 prompt 的義務，不是程式碼的閘門

OpenCode 的預設提示 `opencode/packages/opencode/src/session/prompt/default.txt` 明文要求：「完成任務後必須用 Bash 跑 lint 和 typecheck 指令……NEVER assume specific test framework」。它的 beast 模式提示（`opencode/packages/opencode/src/session/prompt/beast.txt`）更激烈：「問題真正解決之前 NEVER end your turn」「測試不夠嚴謹是這類任務的第一大失敗模式」。文字很兇，但執行主體仍是 model——它可以選擇不跑，harness 不會攔。

### Codex：分情境的驗證哲學

Codex 把驗證寫成 system prompt 的一節（`codex/codex-rs/core/gpt_5_1_prompt.md` 的 "Validating your work"）：有測試就用、從改動處最近的測試跑起、別去修不相干的壞測試；而且要不要主動跑測試取決於 approval mode——non-interactive 模式下可以放手跑，interactive 模式下先建議、等使用者確認。這是把「何時驗證」也變成一個需要政策的地方，比 OpenCode 細膩，但同樣停在 prompt 層。

### OMP：cleanse 讓 harness 自己跑檢查

五家裡第一個真的把驗證搬進程式碼的是 OMP。它的 cleanse 子系統（`oh-my-pi/packages/coding-agent/src/cleanse/loop.ts#CleanseLoopDependencies`）由 harness 執行診斷收集、派工修復 subagent、然後跑一輪 `verify()` 複檢；診斷來源是真的外部 checker binary（`oh-my-pi/packages/coding-agent/src/cleanse/checkers.ts#CheckerPlan`），不是 model 自評。不過它的目標域較窄——清掉 lint/型別/診斷類問題，不是通用任務完成判準。另外 OMP 的 goals 模式（`oh-my-pi/packages/coding-agent/src/goals/runtime.ts#completeGoalFromTool`）仍允許 model 自行宣告 goal 完成，只靠 token/時間預算煞車。

### Claude Code：獨立的對抗式驗證者

Claude Code（decompiled v2.1.88）走得最遠。它內建一個 verification subagent（`claude-code-source/src/tools/AgentTool/built-in/verificationAgent.ts#VERIFICATION_SYSTEM_PROMPT`），提示詞開宗明義：「你的工作不是確認實作可行——是想辦法弄壞它」，並列出兩種它要對抗的失敗模式：verification avoidance（找藉口不跑檢查、唸一遍程式碼就寫 PASS）和被前 80% 完成度迷惑。輸出格式強制要求每個 check 附上實際執行的指令與原始輸出——「reading code is not verification」——最後只能給 `VERDICT: PASS / FAIL / PARTIAL`。更關鍵的是合約層（`claude-code-source/src/constants/prompts.ts`，tengu_hive_evidence feature gate）：非平凡實作（3 檔以上修改、後端/API、基礎建設）必須先過獨立驗證才能回報完成，「你不能自己判 PARTIAL——只有 verifier 能給 verdict」。`claude-code-source/src/tools/TodoWriteTool/TodoWriteTool.ts` 甚至會在使用者連續關掉三個以上 task 卻沒有任何驗證步驟時，注入提醒叫 model 去生 verifier。但要誠實說：這整套仍是 prompt 與 reminder 層的軟性合約，model 理論上可以無視，harness 沒有硬擋。

## rivumi 的選擇與差異

rivumi 選了五家都沒走的那條路：**把完成判準做成 harness 裡的硬閘門**。

任務契約裡必須宣告至少一條驗證指令（`rivumi/src/rivumi/contracts.py#VerificationCommand`——精確 argv allowlist，永不經過 shell 直譯）。迴圈裡只有 modify-effect 工具成功執行才會立起 `_made_changes` 旗標（`rivumi/src/rivumi/loop.py#_run`）；model 給出 final answer 時：

- 沒改任何檔案 → 直接 `terminal_reason="no_changes"` 收尾，不重跑 checks——省時間，也避免「沒事卻跑出紅燈」的噪音；
- 有改檔 → 由 `_verify_all`（`rivumi/src/rivumi/loop.py#_verify_all`）逐條重跑宣告的指令，全過才 `terminal_reason="verified"`；
- 有任何一條失敗 → 失敗輸出以「不可信的測試輸出」身分餵回對話，修到預算耗盡為止；model 的 final answer 從頭到尾不影響判定。

這正是 `docs/progress.md` Security invariants 那句話的字面實作：「A model final answer that changed files is not success until all declared verification commands pass.」

驗證指令本身也要過 approval（`_verify_all` 裡以 `ApprovalReason.FINAL_VERIFICATION` 逐條送審），被拒絕就記成失敗的 outcome——閘門不因為使用者說「不用跑了」而悄悄轉綠。這套設計在真實 provider 上驗證過：M3 的 live eval（manifest 在 `evals/live/tiny-python-bug.json`，runner 是 `scripts/eval_live_provider.py`）連跑五次 Ollama qwen3:4b，五次都是 `terminal_reason="verified"` 收尾、且只改到目標檔案；重點不是那個 5/5，而是「完成」這個狀態每次都由 pytest 的 exit code 說了算，model 的收尾宣言只是參考。

與五家的差異在於防線位置：pi/OpenCode/Codex 把驗證放在模型的良知裡，Claude Code 放在另一個模型的對抗裡，rivumi 放在程式碼裡。代價也明顯——rivumi 只適合能事先宣告驗證指令的封閉任務（修 bug、過 eval），不像互動式 agent 可以邊聊邊做；而且本地驗證跑的是受信任 repo 的程式碼，沒有 OS 級沙箱，這是已知限制。另外 resume 之後閘門保守地維持武裝狀態，寧可多跑一次 checks。

## 學術依據

這個設計直接對應 [SWE-bench](https://arxiv.org/abs/2310.06770) 的核心方法學：每個任務附帶 fail-to-pass 測試，patch 的正確性由測試執行結果判定，與 model 的自述完全無關。SWE-bench 之所以成為標準，正是因為它把「做完」的定義從語言移到了執行。[SWE-agent](https://arxiv.org/abs/2405.15793) 更進一步顯示 agent 介面設計（含回饋迴路）會大幅影響 pass rate——驗證失敗訊息怎麼餵回去、餵什麼，本身就是設計變數。[Reflexion](https://arxiv.org/abs/2303.11366) 則提供了失敗後那一輪的理論基礎：把環境的回饋轉成語言自我反思，下一輪才會變好——rivumi 把驗證 stderr 餵回去的做法就是這個迴路的極簡版，只是反思交給 model、判準留在 code。

## 改善路線

誠實盤點，rivumi 還缺三件事：

1. **分級驗證**。現在是全有全無：任何一條 check 失敗就整批餵回。可以借 Codex 的「從最近處跑起」思路，先跑快而近的（單元測試）再跑慢而廣的，縮短失敗回饋延遲。
2. **獨立驗證視角**。Claude Code 對抗式 verifier 最有價值的部分不是跑測試，而是「測試套件本身可能是 LLM 寫的自嗨測試」。rivumi 目前完全信賴宣告的 checks；可以加一個唯讀的審查 pass，專挑宣告之外的邊界打。
3. **沙箱內驗證**。本地跑 checks 等於把受信任 repo 的程式碼放上主機執行。接 Cloudflare Sandbox（系列 order 10 主題）之後，驗證閘門才能既硬又安全——這也是五家裡 Codex 用 OS 沙箱收尾的同樣理由。

驗證閘門的本質只有一句話：**讓「成功」變成一個可以被機器判定的述詞，而不是一段聽起來很有信心的文字。**

## 參考資料

- [SWE-bench: Can Language Models Resolve Real-World GitHub Issues?](https://arxiv.org/abs/2310.06770)
- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://arxiv.org/abs/2405.15793)
- [Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)（`packages/coding-agent/src/core/system-prompt.ts`）
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)（`packages/coding-agent/src/cleanse/`、`src/goals/`）
- [sst/opencode](https://github.com/sst/opencode)（`packages/opencode/src/session/prompt/`）
- [openai/codex](https://github.com/openai/codex)（`codex-rs/core/gpt_5_1_prompt.md`）
- [anthropics/claude-code](https://github.com/anthropics/claude-code)
