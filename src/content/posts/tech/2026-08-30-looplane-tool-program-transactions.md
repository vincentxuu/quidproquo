---
title: "Looplane 的 tool programs、transactions 與 safe concurrency"
date: 2026-08-30
category: tech
type: deep-dive
tags: [looplane, coding-agent, tool-use, transactions, concurrency]
lang: zh-TW
tldr: "Looplane 只平行執行同時標成 read-only、concurrency-safe 與 READ effect 的 tool call；tool_program 提供有界的 read-only repeat/branch，tool_transaction 則對可能碰到的 workspace files 做 snapshot 與失敗 rollback。它不是外部副作用的通用交易系統。"
description: "拆解 Looplane 的 read-only batching、bounded tool programs、file-backed transactions，以及哪些副作用無法 rollback。"
series:
  name: "Looplane 架構拆解"
  order: 11
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-looplane-tool-program-transactions-en)

單一 tool call 已經通過 path、permission 與 [OS sandbox](/posts/tech/2026-08-30-looplane-local-os-sandbox)，不代表多個 call 可以任意同時跑。Looplane 把組合方式拆成三種：可安全 batching 的唯讀呼叫、有界的 read-only program，以及需要檔案回復能力的 transaction。

## 平行執行要同時過三個條件

`AgentRunner._can_execute_concurrently()` 不只看 tool 名稱。definition 必須同時宣告 `read_only=True`、`concurrency_safe=True`，而 runtime effect classifier 也必須判為 `READ`。符合條件的一批 call 才用 `asyncio.gather` 執行；event 會記 batch start/completion，回傳 observations 仍維持原 request order。

這個三重檢查避免「看起來像 read」但 metadata 或 effect 不一致時誤入平行區。modify、execute 與 composite transaction 保持 sequential；原本的 repeated-action guard 也照樣計數，不會因為 batching 就失效。

## Tool program 是有界的 read-only 小程式

`tool_program` 只能呼叫 list files、read file、search text 與 git diff。它支援 repeat 和 `if_contains` branch，讓模型不用為每次小查詢多走一輪 model request。控制結構展開後仍受 step cap 約束，repeat 次數必須為正、巢狀深度最多三層，timeout 由外層 harness 控制。

雖然 program 內只允許 read-only tools，`tool_program` 這個 composite definition 本身沒有標成 concurrency-safe。program 內有前後相依與 branch observation，整包平行化會改變它的語意。

## Transaction 回復的是 workspace files

`tool_transaction` 可依序做 read、replace、apply、run check 與 git diff。執行前先保守計算所有可能碰到的 paths；即使某個 branch 最後沒有走到，那條分支的候選 path 也納入 snapshot。snapshot 保存原始 bytes、mode，以及檔案原本是否存在。

任何 step 失敗時，executor 把已存在檔案恢復到原 bytes/mode，並移除 transaction 期間新建的檔案。rollback 自己失敗會回報獨立錯誤，不能把半回復狀態說成成功。測試涵蓋修改後 check 失敗、既有檔還原與新檔移除。

## Atomic-ish 的範圍要寫清楚

這套 transaction 沒有 rollback process、database、network request、寄信、remote API 或 command 已造成的外部副作用。`run_check` 理想上應是檢查，不該偷偷做 deployment。它只提供 bounded workspace-file compensation，無法當成 ACID transaction。

下一篇回到 [state-first journal、replay 與 fork](/posts/tech/2026-08-23-looplane-state-first-event-journaling)：tool batch 與 transaction 發生過什麼，如何被 events、session state 與 artifacts 保存。

---

## 參考資料

- [ToolExecutor source](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/tools.py)
- [native loop concurrency source](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/loop.py)
- [tool program and transaction tests](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_tools.py)
- [read-only batch loop tests](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_loop_e2e.py)
