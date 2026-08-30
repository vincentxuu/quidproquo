---
title: "跟成熟 coding agent 學設計（32）：Subagent 與 worktree 隔離——讓主 loop 學會分工"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 32
tags: [coding-agent, subagent, multi-agent, git-worktree, rivumi, claude-code]
lang: zh-TW
tldr: "成熟 subagent 需要角色、fan-out 上限、權限收窄與成果回傳契約。rivumi 已有 native named-role schedule、平行 fan-out、子 task allowed_paths 不得超出 parent、預設禁用 unsafe exec，以及 parent-approved transaction proposal baseline；常駐 background lifecycle、遞迴深度管理與自動 worktree merge 仍未完成。"
description: "對照成熟 coding agent 的 subagent 編排與隔離，並核對 Rivumi named roles、bounded fan-out、權限收窄與 transaction proposal baseline。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-subagent-worktree-isolation-en)

系列第二部第 7 篇。先交代取證範圍：pi（badlogic/pi-mono）、omp（can1357/oh-my-pi）、opencode（sst/opencode）、codex（openai/codex Rust workspace）、claude-code（社群反編譯 v2.1.88，symbol 名稱可能與原版有出入）。所有引用都是我在本地 clone 實際 grep 過的。worktree 本身在系列第 3 篇〈workspace 隔離〉已經講過 EnterWorktreeTool，這篇聚焦的是**subagent 編排**——worktree 只是它的一個隔離選項。

## 能力問題：一個 loop 不夠用的三個瞬間

單 loop agent 遲早撞上三件事：

1. **context 污染**。叫主 agent「掃過這 20 個檔案找出相關的」，它讀完的每一行都留在主對話裡。探索用的垃圾內容和真正的決策混在一起，等 compaction 把它摘要掉時，重要細節也一起被壓扁。
2. **序列瓶頸**。「同時跑測試、查文件、review 三個候補做法」在單 loop 裡只能一次做一件。
3. **職責不清**。同一份 context 既當研究者又當實作者，prompt 裡的系統提示只能妥協出一個四不像。

Subagent 是這三題的共同答案：開一個乾淨的子 session、給它專屬的 system prompt 和工具池、跑完只把**結論**帶回主對話。難的不是 spawn，而是旁邊這些：子代理能不能再開子代理？權限怎麼繼承？改了檔案之後成果怎麼合回來？掛掉了算誰的？

## 五家怎麼做

### pi：沒有。這本身就是答案

grep 整個 pi-mono 的 packages，subagent 相關只在 RPC client 提到一處。pi 的核心刻意不做編排——它把最小 loop 和工具協議做好，其他交給宿主組裝。這是理解 omp 的前提：**下面整套都是 fork 加上去的**，兩代演進本身就是設計文件。

### omp：subagent 是有生命週期的一等公民

入口是 `oh-my-pi/packages/coding-agent/src/task/index.ts#TaskTool`。幾個值得抄的決定：

- **批次形狀**：一次呼叫可以帶 `tasks[]`，共用一段必填的 `context` 注入每個子代理的 system prompt——強迫模型把共享背景寫清楚，而不是讓 N 個子代理各自重讀。
- **結束協議**：子代理必須呼叫隱藏的 `yield` 工具才算收工。忘了就叫醒它，`oh-my-pi/packages/coding-agent/src/task/executor.ts` 的 `MAX_YIELD_RETRIES = 3`，最後一次直接 `toolChoice = yield` 強制交卷。
- **輸出上限**：`task/types.ts#MAX_OUTPUT_BYTES` 定 500,000 bytes，超量截斷但完整原文落盤成 artifact，用 `agent://<id>` 內部協議取用。
- **併發控制**：`task/parallel.ts#Semaphore` 做 session 級 fan-out 上限，且設定熱更新——改 `maxConcurrency` 連排隊中的任務都受影響。
- **生命週期**：`registry/agent-registry.ts#AgentStatus` 分 `running | idle | parked | aborted` 四態。跑完的子代理不銷毀，idle 七分鐘後 park 成可復活的殼——想追問就透過 hub 訊息把它叫醒，省掉重新鋪 context 的錢。
- **遞迴閘門**：`task.maxRecursionDepth` 到頂就把 task 工具從子代理的工具清單裡抽掉，不是靠 prompt 求它別再開。

隔離側最有趣：`task/worktree.ts#parseIsolationMode` 把 `none/auto/apfs/btrfs/zfs/reflink/overlayfs/projfs/block-clone/rcopy` 映射到底層 PAL（`crates/pi-iso`），auto 模式沿候補清單逐個試、失敗就 fallback，最糟也是 recursive copy。isolate 完的成果二選一：capture 成 patch 檔，或 commit 到分支 cherry-pick 回父 repo——而且 isolate 過的子代理明確標記為不可復活，因為 workspace 已經清掉了。

還有一個誠實的細節：headless 子代理沒有 UI 可以跳審批，所以 `runSubprocess` 直接把 approvalMode 強制成 yolo。這在 omp 的信任模型裡成立（子代理工具集本來就被裁剪過），但抄的時候要想清楚自己的審批語意。

### claude-code：per-spawn 的隔離矩陣

`claude-code-source/src/tools/AgentTool/AgentTool.tsx#AgentTool` 的 schema 就是設計文件：`subagent_type` 選專門代理、`model` 可覆寫、`run_in_background` 轉背景、`isolation: 'worktree'` 要求獨立工作副本、`cwd` 直接換工作目錄（和 worktree 互斥）。每個子代理拿自己 agent 定義的 system prompt，工具池也是用 `assembleToolPool` 獨立組裝的——權限模式和主 loop 脫鉤。

worktree 生命週期做得比想像細：`utils/worktree.ts#createAgentWorktree` 建 `agent-<id 前 8 碼>` 的暫存 worktree，跑完 `hasWorktreeChanges` 判斷——沒動靜就直接 `removeAgentWorktree` 刪掉，有產出則保留並把 `worktreePath`／`worktreeBranch` 寫進完成通知。**「垃圾自動回收、成果留路徑」**這個協議讓主 agent 不用猜子代理做了什麼。

背景執行走 `tasks/LocalAgentTask/LocalAgentTask.tsx#registerAsyncAgent` 註冊成 task，同步等待則由 `tools/TaskOutputTool/TaskOutputTool.tsx` 的 `block=true` 參數提供阻塞式輪詢。工具結果上限 `maxResultSizeChars: 100_000`。

### opencode：一個 subagent 一個 session

`opencode/packages/opencode/src/tool/task.ts#TaskTool` 的模型最乾淨：每個 subagent 就是一個帶 `parentID` 的真實 session，transcript 天然可查、可用 `task_id` resume 同一個子代理繼續問。防護靠兩條：

- 深度限制沿 parent 鏈往上數，`cfg.subagent_depth` **預設 1**——子代理不准再生子代理，除非你顯式放行。
- `agent/subagent-permissions.ts#deriveSubagentSessionPermission` 從父 session 和子代理定義推導權限規則，而且預設 deny 掉 `todowrite` 和 `task`——子代理沒拿到授權就不許用待辦清單和繁殖。

背景模式還在實驗旗標後面（`OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS=true`），完成時用合成訊息注入父對話。它的 prompt 引導也很務實：「不要 sleep、不要輪詢、不要跟背景任務碰同一批檔案」——直接把多代理協調的地雷寫進模型指令。

### codex：另一個軸的平行

codex 的 `codex-rs/cloud-tasks` 不是 in-process subagent，而是把任務派到雲端環境跑（含 best-of-n 對比）。放在這裡當對照：平行化的終點是把「開子進程」升級成「開子環境」，但協議問題——怎麼派、怎麼等、怎麼收回成果——是同一套。

## 學術依據

多 agent 協作的價值與風險都有實證。[MetaGPT](https://arxiv.org/abs/2308.00352) 證明給 agent 分配角色、按 SOP 傳遞結構化產物，能顯著降低「幻覺滾雪球」——這正是 subagent_type 加 outputSchema 的學理版。[CAMEL](https://arxiv.org/abs/2303.17760) 更早示範角色扮演式的雙 agent 協作，但也記錄了 agent 對話容易發散、需要中途干預——呼應 opencode 把「別亂碰彼此的檔案」寫進 prompt。Anthropic 自己的多 agent 研究系統文章（[How we built our multi-agent research system](https://www.anthropic.com/engineering/built-multi-agent-research-system)）則給了工程側的教訓：lead agent 學會拆任務、子代理平行省時間，但 token 消耗大約是單 agent 聊天的十幾倍——平行不是免費的。

## 原始設計草案（2026-08-25）

這份草案記錄的是 2026-08-25 當時的起點：native 路徑還沒有 subagent，external runtime 內部的子代理也不在 Rivumi 視野內。下列介面與隔離規則是當時的設計假設；文章後段會逐條核對 `2ed5efb` 已落地的 named-role fan-out 與 transaction proposal，避免把歷史草案誤讀成現在狀態。

草案如下：

**介面位置**：新增 `src/rivumi/subagent.py`，定義 `SubagentRunner.spawn(task, *, agent_profile, isolation) -> SubagentResult`。`SubagentResult` 是固定契約：`final_text`（截斷上限）、`patch_path`（若有檔案變更）、`usage`、`status`。這就是 omp `yield` 和 claude-code worktree 通知的合體——**成果永遠是「文字 + artifact 路徑」，不是整份 transcript**。

**隔離幾乎免費**：這是 rivumi 架構的意外紅利。`runtime.py#LocalGitWorkspace.prepare` 和 `conversation_workspace.py#ConversationWorkspace.create` 本來就每次 run 建 pinned-SHA 的拋棄式 clone——subagent 只不過是「多開一個 workspace」。不需要 omp 那十種 filesystem 後端，也不需要 claude-code 的臨時 worktree 管理，隔離邊界現成就有。

**編排規則**（抄共識）：

- 深度閘門預設 1（學 opencode），超頂直接從工具清單移除 spawn 工具。
- session 級 Semaphore 限 fan-out。
- 審批 fail-closed：headless 子代理遇到需要批准的操作**預設拒絕**並回報，而不是像 omp 強制 yolo——rivumi 的信任模型裡沒有「子代理工具集已被充分裁剪」的前提，方向必須反過來。
- 子事件以 `parent_run_id` 落進既有 JSONL 事件流，transcript 可以畫出巢狀邊界。

**風險與取捨**：

- **多子代理寫同一個 repo 會衝突**。第一版直接禁止：要嘛每個 subagent 各自 workspace 最後人工排序合 patch（rivumi 的 patch 本來就要人審），要嘛序列化執行寫入型任務。
- **成本**：Anthropic 自己說多 agent 是十幾倍 token。spawn 工具的 description 要寫明「探索型任務才用」。
- **external backend 不歸管**：omp adapter 底下的 omp 自己會開子代理，rivumi 看不到也不該管，標記為 runtime 自理即可。

## 與現有架構的銜接

在草案當時，native 路徑的探索會污染主對話，「先派三個方向各查一輪」只能手動開三個 process。現在的 bounded dispatch 已解掉第一層問題；常駐 background lifecycle、遞迴深度管理與自動 worktree merge 仍不在 baseline 內。

周邊 artifact、事件與 approval 歸因也已接進 `subagents.py` 與 planner tool，不再只是「只差拼裝」。仍需驗證的是 production trace、role override/inheritance 與多個寫入提案的整合策略。

一句話總結：成熟專案的共識是 subagent 必須有**明確的結束協議、輸出上限、深度閘門和隔離邊界**。Rivumi baseline 已落地角色、fan-out、權限收窄與 parent transaction approval；尚未完成的是常駐 lifecycle 與自動合併，而不是「完全沒有 subagent」。

## rivumi 現在的實作

截至 `2ed5efb`，native 路徑已經有 subagent baseline。`subagents.py` 定義 named roles 與各角色 instruction，能正規化 schedule、從 parent `TaskContract` 派生 child task，並驗證 child `allowed_paths` 不得擴張 parent 範圍。`loop.py` 的 planner tool 可一次提交多個 agent spec，執行層做 bounded parallel fan-out，結果以摘要與 artifact 資訊回到 parent。

安全預設也已落地：child runner 的 unsafe local execution 預設關閉，modify/execute approval 不會自動繼承；寫入型工作可以先提出 transaction proposal，由 parent 路徑批准後再套用。schedule event 另有分析器檢查 overlap、序列與角色分布，讓 fan-out 不只靠 prompt 約定。

這還不是 omp 那種可 park/revive 的常駐 lifecycle，也沒有完整 background task 管理、遞迴深度樹或自動 worktree merge/cherry-pick。既有 disposable workspace 是隔離地基，但「每個 child 的 branch 如何安全匯回」仍需要更完整的衝突與審批協議。

## 參考資料

- [Rivumi subagent scheduling 與 task derivation（固定 commit）](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/subagents.py)
- [Rivumi subagent tests（固定 commit）](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_subagents.py)

- [MetaGPT: Meta Programming for Multi-Agent Collaborative Framework（Hong et al., 2023）](https://arxiv.org/abs/2308.00352)
- [CAMEL: Communicative Agents for "Mind" Exploration（Li et al., 2023）](https://arxiv.org/abs/2303.17760)
- [How we built our multi-agent research system（Anthropic Engineering）](https://www.anthropic.com/engineering/built-multi-agent-research-system)
- [can1357/oh-my-pi — docs/tools/task.md](https://github.com/can1357/oh-my-pi/blob/main/docs/tools/task.md)
- [anthropics/claude-code](https://github.com/anthropics/claude-code)
- [sst/opencode](https://github.com/sst/opencode)
- [openai/codex](https://github.com/openai/codex)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
