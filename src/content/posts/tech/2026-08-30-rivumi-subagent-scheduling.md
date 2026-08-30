---
title: "Rivumi 的 Subagent Scheduling 與 Parent-owned Transactions"
date: 2026-08-30
category: tech
type: deep-dive
tags: [rivumi, coding-agent, subagents, scheduling, transactions]
lang: zh-TW
tldr: "Rivumi 把每次 subagent dispatch 正規化成最多四個節點的 dependency waves，讓同 wave 的唯讀 child 在隔離 workspace 平行分析，再由 parent 重新走 hook、approval 與 transaction 執行修改。"
description: "追蹤 Rivumi subagent dependency graph、wave concurrency、isolated child workspace、bounded handoff，以及 parent-owned transaction 的授權邊界。"
series:
  name: "Rivumi 架構拆解"
  order: 16
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-rivumi-subagent-scheduling-en)

[上一篇](/posts/tech/2026-08-30-rivumi-skills-hooks-plugins)拆開 repository-local 擴充的三種權限。當工作可以拆成幾條獨立調查線時，[Rivumi](https://github.com/vincentxuu/rivumi)還能 dispatch subagents；這裡的核心不是「多開幾個 agent」，而是誰擁有 workspace 與修改權。

## 先把依賴正規化成 waves

一次 `dispatch_subagents` 接受一到四個 child。每個 child 有唯一 ID、`scout`／`analyst`／`reviewer` 角色、instruction、最多六步，以及可選的 `depends_on`。Unknown dependency、重複 ID 或 cycle 都在啟動前被拒絕。

通過驗證後，scheduler 做 topological waves。同一 wave 中已經 ready 的 child 用 `asyncio.gather` 平行執行；下一 wave 等前一 wave 結束，再取得 bounded handoff。這是一個小型 dependency scheduler，不是常駐 worker pool，也沒有 priority、work stealing 或動態重新分派。

```text
wave 1: scout A ─┐
                  ├─ bounded handoff -> wave 2: reviewer C
wave 1: analyst B┘
                                      -> parent transaction
```

## Child 有自己的 run，也有更窄的 authority

Child 保留 parent 的 repository、base SHA、allowed paths 與 verification constraints，但使用 `<parent run>/subagents/<id>` 下的獨立 run root 和 disposable workspace。Subagent dispatch 在 child runner 裡關閉，避免遞迴展開。

目前 headless child policy 明確拒絕 modify 與 execute，因此 child 的工作是讀取、搜尋、分析與回報。後續 wave 收到的是先前結果的 bounded summary、status 與 changed-files 欄位，不是共享 mutable workspace。即使 report schema 能描述 changed files，現行 policy 下也不該把它理解成 child edit handoff。

## 修改交易由 Parent 擁有

Parent model 呼叫 `dispatch_subagents` 時可以附一個 proposed transaction。Child 能依 instruction 檢視方案，但 transaction 不是 child 偷渡回來的 tool authority。只有 child 完成後，parent runner 才組出 `tool_transaction`，重新經過 repeated-action guard、pre-tool hook、permission approval，最後在 parent workspace 依序執行。

因此 `dispatch_subagents` 本身分類為 read。真正碰到修改與執行的時刻，是 parent transaction；那時仍套用[order 11](/posts/tech/2026-08-30-rivumi-tool-program-transactions)說明的 transaction 與 rollback 契約。Reviewer 說「可以」不會取代 operator approval，child workspace 也不會直接 merge 回 parent。

## 上限是每次 dispatch，不是全域 worker quota

四個 child、六步與最多八個 proposed transaction steps 都是單次 call 的界線。程式仍有 parent loop 與 repeated-action guards，但沒有另一個全域 dispatch 次數配額。Trace analyzer 可以統計 roles、waves、transactions，或提醒沒有 reviewer；它分析已記錄的 events，不會自動重排下一次工作。

這套設計適合有清楚依賴、可以平行蒐集證據的任務。單一查詢或直接可做的修改，多一次 dispatch 只會增加 turn cost。用得其所時，child 擴張的是分析頻寬；parent 仍是唯一把建議變成 workspace side effect 的 owner。

[下一篇](/posts/tech/2026-08-30-rivumi-sdk-conversation-websocket)進入 embedding boundary，再由 IDE bridge 接到 order 19 的 Cloudflare capstone。

---

## 參考資料

- [Subagent schedule normalization and child runs](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/subagents.py)
- [Dispatch and parent transaction flow](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/loop.py)
- [Subagent unit tests](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_subagents.py)
- [Subagent end-to-end tests](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_loop_e2e.py)
