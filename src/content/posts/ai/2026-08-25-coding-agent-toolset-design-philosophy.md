---
title: "跟成熟 coding agent 學設計（18）：工具集設計哲學——tool surface 的邊界劃分"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 18
tags: [coding-agent, tool-design, rivumi, function-calling, claude-code]
lang: zh-TW
tldr: "Rivumi 的核心 surface 已從七個長到九個：新增 read-only `tool_program` 與可 rollback 的 `tool_transaction`，搜尋優先走 ripgrep，仍不開任意 shell；native MCP 只從 allowlist 動態加入，缺少可信 read-only metadata 就按 execute 審批。"
description: "對照五個成熟 coding agent 的 tool surface，拆解 Rivumi 九個核心工具、有界工具程式、transaction rollback、ripgrep 搜尋與 native MCP 動態暴露。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-toolset-design-philosophy-en)

上一篇談了[session 持久化](/posts/ai/2026-08-25-coding-agent-session-persistence-crash-recovery)，這篇回到更上游的問題：你到底該給模型幾個工具？

本篇取證範圍：**pi**（badlogic/pi-mono）、**omp**（can1357/oh-my-pi）、**opencode**（sst/opencode）、**codex**（openai/codex 的 Rust workspace）、**claude-code**（社群反編譯 v2.1.88，symbol 名稱可能與原版有出入）。所有引用都是我在本地 clone 實際 grep 過的。

## 設計問題：tool surface 怎麼切

工具是模型的手。手太多有兩個成本：每個工具的 name、description、schema 都吃 context window；更重要的是選擇越多，小模型越容易選錯——該用 grep 卻去 cat 整個檔案、該用精準編輯卻整檔重寫。手太少則做不了事：沒有搜尋工具的 agent 在陌生 codebase 裡只能瞎猜路徑。

所以真正的設計問題不是「幾個」而是「邊界畫在哪」：哪些能力合併成一個工具、哪些拆開？哪些工具永遠在場、哪些按需載入？副作用等級（唯讀／寫入／執行）要不要讓 harness 知道？[SWE-agent 論文](https://arxiv.org/abs/2405.15793)把這件事叫 ACI（agent-computer interface）設計，結論很直接：interface 品質對 agent 表現的影響不下於模型本身。

## 五家怎麼做

### pi：八個工具、兩種套餐

pi 的全部內建工具就是一個列舉：`pi-mono/packages/coding-agent/src/core/tools/index.ts#allToolNames`——`read`、`bash`、`powershell`、`edit`、`write`、`grep`、`find`、`ls`，八個。更有意思的是它預先打包兩種 surface：`index.ts#createCodingTools` 只給 `read/bash/edit/write` 四個，`index.ts#createReadOnlyTools` 給 `read/grep/find/ls` 四個唯讀的。「能寫」和「只讀」是兩個現成的套餐，不是靠 prompt 叮嚀。

每個工具都在工具層自我限界：read 的輸出走 `truncateHead`，超過行數或 byte 上限就截斷並標註（`core/tools/read.ts` 引用 `truncate.ts#truncateHead`）。edit 要求 `oldText` 在檔案中唯一（`core/tools/edit.ts#editSchema`），把「模糊取代」這類政策問題直接排除在 schema 外。

### omp：fork 爆量後的分級救火

omp 是 pi 的 fork，工具數遠超八個——光 `packages/coding-agent/src/tools/` 底下就有 browser、computer、eval、gh-pr 系列。它活下來的方式是載入分級：`oh-my-pi/packages/coding-agent/src/tools/essential-tools.ts#ESSENTIAL_BUILTIN_TOOL_NAMES` 把 `read/write/bash/edit/glob/computer/eval/task/hub/learn/manage_skill` 十一個釘為 `"essential"`（永遠出現在模型可見 schema），其餘一律 `"discoverable"`——要靠搜尋才會被發現。註解裡還記錄了一個真 bug（issue #5764）：UI 層重新註冊內建工具時意外把它降級成 discoverable，導致掛載的裝置整個消失。工具一多，「誰在 surface 上」本身就變成需要防禦的不變量。

### opencode：依模型換編輯工具

opencode 的內建清單在 `opencode/packages/opencode/src/tool/registry.ts#tools`：shell、read、glob、grep、edit、write、task、fetch、todo、search、skill、patch 等，約十五個。關鍵程式碼是同一個函式裡的過濾器：modelID 含 `gpt-` 且非 oss 就只暴露 `ApplyPatchTool`、隱藏 `EditTool` 和 `WriteTool`，其他模型反向。同一份能力，不同模型吃不同的介面形狀。另外 task 工具的 description 是執行期動態生成的（`registry.ts#describeTask`），把可用 subagent 清單灌進描述文字——description 不只是文件，是路由表。

### codex：逐項組裝，最小 surface 是安全屬性

codex 沒有固定工具集，只有組裝函式。`codex-rs/core/src/tools/spec_plan.rs#add_core_tool_sources` 按 feature flag、環境數、`model_info` 逐一決定要不要註冊 shell、MCP resource、plan、view_image、apply_patch。最能說明設計哲學的是註解明寫的那條規則：guardian reviewer 這種受限角色**只拿得到** `exec_command`、`write_stdin`、`view_image` 三個工具，其他全部排除。工具面越小，需要審的東西越少。

shell 本體 `codex-rs/core/src/tools/handlers/shell_spec.rs#create_exec_command_tool_with_environment_id` 也值得看：schema 裡內建 `yield_time_ms` 和 `max_output_tokens` 兩個 bounded 參數，把「等多久、回多少」的控制權交給模型但由 harness 夾住範圍；sandbox 升級是顯式的 enum 參數而非自由文字。

### claude-code：effect 標註當一等公民

claude-code 的 `src/tools` 目錄下有四十三個工具資料夾，但真正定義 surface 語意的介面在 `src/Tool.ts#Tool`：每個工具必須實作 `isReadOnly(input)`、可選的 `isDestructive(input)`、`isConcurrencySafe(input)`、`isOpenWorld(input)`。注意參數是 **input**——同一個工具可以對某些輸入唯讀、某些輸入破壞。harness 的審批、平行排程、UI 摺疊全建立在這些標註上，而不是每處各寫一份 if 清單。

面對工具爆炸，它的答案和 omp 同向：`shouldDefer` 讓工具延後載入，要靠 `ToolSearch` 才能被呼叫（`Tool.ts#shouldDefer`）；`searchHint` 提供關鍵字比對用的短語。Skill 則收斂成單一的 SkillTool 路由表——`src/tools/SkillTool/prompt.ts#getPrompt` 的 prompt 固定說明呼叫方式，可用 skill 以 `- name: description` 列表注入 system reminder，描述還有截斷預算。一百個 skill 也只佔一個工具的位置。

還有一個反直覺的細節：BashTool 的 input schema 裡有一個內部欄位 `_simulatedSedEdit`，被刻意從模型可見的 schema omit 掉（`src/tools/BashTool/BashTool.tsx#inputSchema`）——註解明講，暴露它會讓模型配對無害命令加任意檔案寫入來繞過權限與沙箱。schema 不只是給模型的 API，也是攻擊面。

## rivumi 的選擇：有界核心工具，沒有任意 shell

rivumi 的核心 surface 在 `src/rivumi/tools.py#_tool_definitions`。原本七個工具仍在：`list_files`、`read_file`、`search_text`、`replace_text`、`apply_patch`、`run_check`、`git_diff`；現在再加 `tool_program` 與 `tool_transaction`。前者在一次 model tool call 裡執行最多八步 read-only 小程式，支援有界 `repeat` / `if_contains`，把多次 read/search 的 round trip 收進 harness；後者把 read/edit/allowlisted check 組成可 rollback 的 modify+execute transaction。兩者的 control flow、步數與可呼叫 op 都由 schema 夾住，仍然沒有任意 bash。

`search_text` 也不再只是 Python walk：ripgrep 存在時會用 literal `rg` 並尊重 `.gitignore`，之後仍通過 allowed path 與輸出上限。`run_check` 則只接受任務契約宣告的 enum name，執行 exact argv、`shell=False`、sanitized environment。這些改善的是大型 repository 的搜尋成本與多工具 round trip，不會把窄工具面偷偷變成 shell。

第二個差異是**上限是累積的，不是單次的**。`apply_patch` 和 `replace_text` 每次成功後都重跑 `tools.py#reviewable_patch`，重新檢查整個工作區的未提交 diff 是否還在 byte/line/file 上限內，超了就 rollback 本次操作。很多個「各自很小」的編輯加總起來可能超出最終 artifact 的可審查預算——單次檢查抓不到這種滲漏。

第三個是**編輯前必讀的機械化**。`tools.py#replace_text` 維護一個 `_read_versions` ledger：`read_file` 完整讀完才記 SHA-256，編輯時 hash 不符就拒絕。SWE-agent 式的「先看再改」在這裡不是 prompt 約定，是 Python 程式碼。加上 old_text 必須恰好出現一次、新檔案只能走 `apply_patch`（diff 才可審）、原子寫入加失敗回滚，這個工具窄到幾乎不會做出不可預期的事。

第四是 effect metadata 已經有一部分搬到 `ToolDefinition`：`read_only` 與 `concurrency_safe` 同時供 prompt policy、平行調度與 MCP trust classification 使用；`approvals.py` 仍保留 READ/MODIFY/MODIFY_EXECUTE/EXECUTE 的最終 fail-closed 對照。native MCP tool 也能動態加入 surface，但只載入 allowlist server，resource/prompt bridge 固定 read，遠端 tool 沒有可信 read-only annotation 就按 execute 審批。

代價也很清楚：core surface 雖然從七個長到九個，外加 opt-in MCP/subagent，仍做不了任意 shell 工作流；`tool_program` 不能修改、跑 check 或叫 MCP，`tool_transaction` 任一步失敗就 rollback。這是可測的 baseline，不是大型 repository 成功率或第三方 MCP production 安全性的證明。

## 學術依據

[SWE-agent 論文](https://arxiv.org/abs/2405.15793)（Yang et al., 2024）提出 ACI 設計四原則，其中最相關的實驗證據是：同一個模型，換不同的檔案檢視介面（有無行號、有無搜尋）成功率差距顯著——他們設計的 search/read/edit 介面讓 agent 成功率明顯高於開放式 shell 操作。五家的收斂也印證這點：pi 和 opencode 的 grep/find/read 分立、rivumi 的 search_text，全是論文裡那套「窄而明確」的介面形狀。

function calling 的官方文件從 API 角度補了另一半：[Anthropic 的 tool use 文件](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)和 [OpenAI 的 function calling guide](https://platform.openai.com/docs/guides/function-calling)都強調工具描述品質直接影響選擇正確率，且建議工具數量保持精簡、語意不重疊——「少而清晰」不是風格偏好，是模型行為的已知約束。

## 還能改善什麼

1. **MCP discovery 需要真正的 surface 分級**。allowlist 與動態 refresh 已落地，但多 server 時仍可能把大量 schema 平鋪給模型。下一步才是 omp essential/discoverable 或 ToolSearch 式延遲載入。
2. **把 input-sensitive effect 做完整**。`ToolDefinition` 已有 read-only/concurrency metadata，MCP annotation 也會被翻譯；但像「同一工具因參數而改變風險」仍缺統一判斷與不信任 server annotation 的驗證層。
3. **動態 description**。opencode 的 `describeTask` 示範了描述可以是執行期的路由表。rivumi 的 run_check enum 已經是動態生成的，下一步可以把每個 check 的最近一次結果摘要進描述，讓模型不用盲選。
4. **用量測決定批次界線**。`tool_program` / `tool_transaction` 已證明 bounded code mode 可行；接下來要用真實 run 比較 round trip、token、rollback 與誤用率，再決定八步上限或更多 control flow，而不是直接擴成通用語言。

系列下一篇回頭處理 session 的另一面：run artifacts 的契約——一次執行結束後，磁碟上應該留下哪些互相印證的檔案。

## 參考資料

- [badlogic/pi-mono — packages/coding-agent](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent) — 八工具清單與 coding/read-only 套餐
- [can1357/oh-my-pi — packages/coding-agent](https://github.com/can1357/oh-my-pi/tree/main/packages/coding-agent) — essential/discoverable 載入分級
- [sst/opencode — packages/opencode](https://github.com/sst/opencode/tree/main/packages/opencode) — 依模型切換編輯工具與動態 task 描述
- [openai/codex — codex-rs/core](https://github.com/openai/codex/tree/main/codex-rs/core) — 逐項組裝的 tool spec plan 與 exec_command schema
- [anthropics/claude-code](https://github.com/anthropics/claude-code) — 官方 repo（發布 minified bundle；本篇引用自社群反編譯 v2.1.88）
- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://arxiv.org/abs/2405.15793) — ACI 設計對 agent 表現的影響
- [Anthropic Tool Use 文件](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)、[OpenAI Function Calling Guide](https://platform.openai.com/docs/guides/function-calling) — 工具描述品質與數量的官方建議
- [Rivumi tools（固定 commit `2ed5efb`）](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/tools.py)
