---
title: "跟成熟 coding agent 學設計（20）：Run artifacts 契約——跑完之後憑什麼審計？"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 20
tags: [coding-agent, run-artifacts, auditability, rivumi, observability]
lang: zh-TW
tldr: "agent 跑完之後，「模型說它做完了」不是證據。codex 把 trace 拆成 manifest + JSONL + payloads 的 bundle、omp 用 SQLite 鏡像磁碟上的固定檔案、pi 用 runs.jsonl 索引原生 session 檔。rivumi 選了最硬的一條：每個 run 固定六個檔案，缺一個就不算完成，patch 審計看 changes.patch 不看口頭宣稱。"
description: "對照 codex、omp、pi、opencode、claude-code 五家原始碼，拆解 run artifacts 的三種儲存取捨——固定 schema 檔案、單一 JSONL、SQLite——以及 rivumi 六檔契約的設計理由與改善路線。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-run-artifacts-contract-en)

上一篇講了[測試一個會動的 agent](/posts/ai/2026-08-25-coding-agent-testing-a-moving-agent)，這篇處理測試之後的問題：run 跑完（或跑一半死掉）之後，留下什麼？

## 設計問題

Agent run 有兩個特性讓事後審計變難。第一，過程不可重現：同一個 prompt 配上非決定性的模型，跑第二次結果就是不一樣的，你沒有「再跑一次看看」的選項。第二，口頭宣稱不可信：模型的最終文字說「我修好了、測試都過了」，這句話本身沒有任何證據力。

所以問題其實是三個：**除錯時靠什麼重建過程？審計時憑什麼相信結論？比較實驗時用什麼當對照單位？** 這三個問題共用同一個答案——run 結束時留在磁碟上的東西。差別只在於各家把什麼寫下來、用什麼格式、以及格式承諾到多硬。

## 五家怎麼做

**codex** 是分層最細的。基礎層是 session 錄製：`openai/codex/codex-rs/rollout/src/lib.rs#decode_rollout_line` 定義了 `RolloutLine`（timestamp + ordinal + item），逐行寫進 `rollout-<timestamp>-<thread_id>.jsonl`（`codex-rs/rollout/src/rollout_file_name.rs#parse`），resume 和投影共用同一個解碼器。往上疊的是 trace bundle：`codex-rs/rollout-trace/src/bundle.rs` 固定了四件套——`manifest.json`（schema 版本、trace id、root thread）、`trace.jsonl`（append-only 原始事件）、`payloads/` 目錄（大體積的 request/response 原文，`payload.rs#RawPayloadRef` 只存引用）、`state.json`（reducer 重放後的快取）。`raw_event.rs#RawTraceEvent` 的註解講得很白：統一信封是為了「reducer 看懂事件之前，就能先做部分重放和損壞檢查」。查詢需求則另外交給 SQLite（`codex-rs/rollout/src/state_db.rs#init`）。

**omp** 的 metaharness 把「experiment → run → trace」做成統一實驗模型。關鍵決定寫在 `can1357/oh-my-pi/packages/metaharness/src/store.ts#RunStore` 的檔頭註解：**檔案系統才是 source of truth**（Harbor 每 trial 寫 `result.json`），SQLite 只是鏡像，`store.ts#syncRun` 從 job 目錄重讀並 upsert。也就是說 omp 兩種都要——磁碟上的固定檔案保證可攜與可稽核，SQLite 保證 dashboard 能查。

**pi** 走輕量索引路線。eval 的 reporter 把每次 harness run 追加一行進 `.eval/runs.jsonl`，記錄 schema 版本、usage、timings、errors，然後用 `persistEvalArtifactReferences` 指向原生 Pi session JSONL 附件（`badlogic/pi-mono/packages/evals/src/vitest-evals/reporter.ts#appendHarnessRunReport`）。session 本體由 `packages/coding-agent/src/core/session-manager.ts#SessionManager._appendEntry` 逐 entry append 進 `<timestamp>_<sessionId>.jsonl`。

**opencode** 是五家裡唯一直接以 SQLite 為主的：v2 的 session 層用 drizzle 定義了 `SessionTable`、`MessageTable`、`PartTable` 等表（`sst/opencode/packages/core/src/session/sql.ts`），讀取走 `session/store.ts`。好處是查詢和一致性免費，代價是脫離伺服器之後沒有可以直接 `cat` 或 `git diff` 的原始紀錄。

**claude-code** 最樸素：每個專案一個目錄、每個 session 一個 `.jsonl` transcript（`anthropics/claude-code src/utils/listSessionsImpl.ts` 掃 `getProjectsDir()` 底下的 `.jsonl`），prompt 歷史另存一行式 `history.jsonl`（`src/history.ts`）。單一 append-only 檔案，夠用就好。

## rivumi 的選擇與差異

rivumi 的契約在 `docs/progress.md` 的「Required artifacts per run」：每個 run 目錄固定六個檔案——`request.json`、`events.jsonl`、`checkpoint.json`、`changes.patch`、`test.log`、`result.json`（實作還會多寫一個 `verification.json` 存每次檢查的 exit code 與輸出）。M1 stage doc 的驗收標準明文要求「六個檔案存在且對 terminal state 的描述一致」。

跟五家比起來，幾個刻意的差異：

**固定 schema 檔案，而不是單一 JSONL。** claude-code 和 pi 用一個 JSONL 打天下，但 rivumi 要的是不同消費者各取所需：審 patch 的人只開 `changes.patch`、查失敗先看 `result.json` 的 `terminal_reason`、除錯才翻 `events.jsonl`。六個檔案的邊界就是六種審計問題的邊界。

**patch 即證據。** `loop.py#_finish` 在收尾時重新收集 reviewable diff 寫入 `changes.patch`；如果連 patch 都收不出來，整個 run 直接降級成 `failed` / `patch_artifact_failed`，不會留下一個「說成功但拿不出 patch」的目錄。「模型說改好了」永遠不進證據鏈——證據只有 git diff 和 verification exit code。

**secrets 不落 artifact。** 檢查子程序用的是 `runtime.py#sanitized_subprocess_env`——白名義環境變數加斷言防線，API key 根本進不了 `test.log` 可能捕獲的環境。artifact 是會被分享、被貼進 issue 的東西，寫入前就要乾淨。

**契約對外部 runtime 也成立。** 就算是 Codex CLI 這種外部 backend，`external_runner.py#_finalize` 照樣補齊同樣六個檔案，外加一個 `backend-result.json` 放原生輸出。換 runtime 不換審計介面。

## 工程依據

三種儲存的取捨可以收斂成一句話：**JSONL 換 durability，SQLite 換 queryability，固定檔案換 legibility。**

Append-only JSONL 的核心價值是 crash-safe：寫到第 N 行掛掉，前 N−1 行仍然有效。codex 的 `RawTraceEvent` 統一信封、rivumi `events.py#EventWriter.append` 的 O_APPEND + fsync，都是同一個賭注。SQLite 的價值在聚合查詢，opencode 和 codex 的 state db 都是為了「列出/搜尋/排序 session」這類操作；但 omp 的做法提醒了關鍵：索引可以是 derived data，**原始紀錄必須是人可讀的檔案**，資料庫壞了或 schema 演進了，磁碟上的東西還在。rivumi 選固定檔案，等於是把 legibility 放在第一位，queryability 目前用不上（單 run 的規模不需要 SQL），durability 由 `events.py#atomic_write_json` 的 temp-file + rename + directory fsync 補上。

學術側對應的是 evaluation 可重現性這條線：SWE-bench（[arXiv:2310.06770](https://arxiv.org/abs/2310.06770)）之所以能成為共同參考點，正是因為每個實例都有固定的輸入契約和 pass/fail 判定；SWE-agent（[arXiv:2405.15793](https://arxiv.org/2405.15793)）進一步把 agent–computer interface 當成一等設計物件。Run artifacts 契約是同一個思想往營運端的延伸：判定標準不能活在對話裡。[Anthropic 的 Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) 也把 observability 列為 agent 上生產線的前置條件，而 observability 的最小單位就是一份完整的 run 紀錄。

## 還能改善什麼

1. **沒有 secret scanner。** 環境白名單擋住了主要通道，但工具輸出本身（例如 `cat` 到一個含 key 的檔案）仍可能把秘密帶進 events.jsonl。M1 stage doc 已誠實列為 limitation；gitleaks 式的 artifact 掃描是下一步。
2. **缺 experiment 層。** omp 的 experiment → run → trace 三層讓「同一個問題的不同 arm」可以併排比較；rivumi 目前每個 run 是孤島，比較靠人肉開目錄。
3. **沒有 reduced view。** codex 的 reducer 把原始事件重放成語意化的 `RolloutTrace`（`state.json` 快取），rivumi 的 events.jsonl 只有原文，run 大了之後人審成本會上升。
4. **result.json 可以帶 artifact checksum。** 現在 `artifacts` dict 只存路徑；加上 SHA-256 才能證明「這份 result 描述的就是這些檔案」，審計鏈才算閉環。

系列下一篇講 headless 模式與 CI 使用——artifacts 契約正是 headless 能被信任的前提。

## 參考資料

- [openai/codex — codex-rs/rollout](https://github.com/openai/codex/tree/main/codex-rs/rollout) 與 [codex-rs/rollout-trace](https://github.com/openai/codex/tree/main/codex-rs/rollout-trace) — session 錄製與 trace bundle 格式
- [can1357/oh-my-pi — packages/metaharness](https://github.com/can1357/oh-my-pi/tree/main/packages/metaharness) — experiment→run→trace 模型與 SQLite 鏡像
- [badlogic/pi-mono — packages/evals](https://github.com/badlogic/pi-mono/tree/main/packages/evals) — eval artifact 慣例與 runs.jsonl 索引
- [sst/opencode — packages/core/src/session](https://github.com/sst/opencode/tree/main/packages/core/src/session) — SQLite-first 的 session 儲存
- [anthropics/claude-code](https://github.com/anthropics/claude-code) — 官方 repo（發布 minified bundle；本篇引用自社群反編譯 v2.1.88）
- [SWE-bench: Can Language Models Resolve Real-World GitHub Issues?](https://arxiv.org/abs/2310.06770) — 固定輸入契約與判定標準
- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://arxiv.org/abs/2405.15793) — interface 作為一等設計物件
- [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic 的 agent 工程原則
