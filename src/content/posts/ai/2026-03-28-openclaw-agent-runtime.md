---
title: "OpenClaw Agent Runtime：系統 prompt 是組出來的，而它被一條快取邊界切成兩半"
date: 2026-03-28
type: deep-dive
category: ai
tags: [openclaw, system-prompt, workspace, bootstrap, prompt-cache, sub-agents]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 10
tldr: "OpenClaw 每次執行都自己組系統 prompt，沒有執行期的預設 prompt。組出來的內容被一條內部快取邊界切開——穩定的 workspace 前綴在上面、每輪會變的頻道脈絡在下面——好讓有前綴快取的後端能跨頻道重用同一段前綴。"
description: "OpenClaw 系統 prompt 的三層組裝、供應商可貢獻的三個具名區段與快取邊界、prompt 的固定結構、長時間工作與子 agent 委派的指引，以及「prompt 護欄是建議而非強制」的界線。"
draft: false
---

上一篇講多 agent 的邊界，這篇講**單一 agent 每次執行時，模型實際看到什麼**。

第一句話就值得記：**OpenClaw 每次 agent 執行都自己建立系統 prompt，沒有執行期的預設 prompt。**

## 三層組裝

| 層 | 職責 |
|---|---|
| `buildAgentSystemPrompt` | 從明確的輸入渲染 prompt。**它是純渲染器，不直接讀全域設定** |
| `resolveAgentSystemPromptConfig` | 解析設定支撐的 prompt 旋鈕（擁有者顯示、TTS 提示、模型別名、記憶引用模式、子 agent 委派模式） |
| 執行期 adapter | 蒐集活的事實（工具、沙箱狀態、頻道能力、上下文檔案、供應商的 prompt 貢獻），呼叫設定好的 prompt 門面 |

分成三層的理由很實際：**讓匯出與除錯用的 prompt 介面跟真實執行對齊**，又不必把每個執行期細節塞進同一個巨型 builder。所以你在 debug 時看到的 prompt，跟實際跑的是同一套組裝路徑。

## 供應商可以貢獻，但不能取代

Plugin 供應商可以在**不取代 OpenClaw 自有 prompt** 的前提下加入快取感知的指引，方式有三種：

- 取代三個具名核心區段之一：`interaction_style`、`tool_call_style`、`execution_bias`
- 在 prompt **快取邊界之上**注入一段**穩定前綴**
- 在快取邊界**之下**注入一段**動態後綴**

官方明說：**模型家族特定的調校用供應商貢獻，legacy 的 `before_prompt_build` hook 留給相容性或真正全域的改動。**

內建的 GPT-5 家族貢獻就是這樣做的：一段 `stablePrefix` 行為契約（執行政策、工具紀律、輸出契約、完成契約），加上一個選用的 `interaction_style` 覆寫來調語氣。`plugins.entries.openai.config.personality` 控制那層語氣——`"friendly"` 是預設，`"off"` **只移除友善的覆寫，行為契約仍然保留**。

## 快取邊界：這才是重點

Prompt 被一條**內部快取邊界**切成兩半，切法很有講究：

**邊界之上（穩定）**：大塊的穩定內容，包含 **Project Context**。

**邊界之下（每輪易變）**：Control UI 嵌入指引、**Messaging**、Collapsible Details、**Voice**、**Group Chat Context**、Reactions、**Heartbeats**、**Runtime**。

目的是讓有前綴快取的本地後端**跨頻道回合重用同一段穩定的 workspace 前綴**——你在 Telegram 和 Slack 講話，前綴是同一份，只有底下那截不同。

還有一條相關的實作建議：**工具描述不該把當前頻道名稱寫死進去**，因為接受的 schema 本來就帶了那個執行期細節。寫進去就會讓本來穩定的東西變成每輪都不同。

一個澄清：**這條邊界是內部的傳輸中繼資料**，每個區段對 CLI 後端來說仍然都是系統 prompt 的指引。

## Prompt 的固定結構

| 區段 | 內容 |
|---|---|
| Tooling | 結構化工具是事實來源的提醒，加上執行期的工具使用指引 |
| Execution Bias | 對可行動的請求就在這一輪行動、做到完成或受阻、從弱的工具結果中恢復、對可變狀態要即時查、定案前先驗證 |
| **Promised Work** | 承諾未來／背景／委派／延續的工作**會產生跟進的擁有權**：結束這一輪之前要安排推播式的完成或觀察路徑，主動帶著結果或具體阻礙回來，**永遠不要把進行中（例如 `running`）當成完成** |
| Safety | 反對權力擴張與繞過監督的簡短護欄提醒 |
| Skills | 告訴模型怎麼按需載入 skill 指令 |
| OpenClaw Control | 設定與重啟優先用 `gateway` 工具，**不要自己發明 CLI 指令** |
| OpenClaw Self-Update | 用 `config.schema.lookup` 安全檢查、`config.patch` 修補、`config.apply` 整份替換，`update.run` 只在使用者明確要求時跑。**給 agent 的 `gateway` 工具拒絕改寫 `tools.exec.mode`** |
| Workspace / Documentation | 工作目錄、本機文件與原始碼路徑 |
| Sandbox | 啟用時：沙箱執行期、沙箱路徑、elevated exec 是否可用 |
| Temporal Context | 本地日期與時區（在快取邊界之下）；**精確時間來自 `session_status`** |
| Runtime / Reasoning | 主機、OS、node、模型、repo 根、thinking 等級；當前推理可見度與 `/reasoning` 切換提示 |

「Promised Work」這一段是我覺得最值得抄走的設計。它處理的是 agent 最常見的失敗模式之一——**說了「我等一下回報」然後就消失**。把「承諾即擁有權」寫進系統 prompt，並且明確禁止把 `running` 當完成，比事後責備模型有用。

## 長時間工作的指引

Tooling 區段帶了一組很具體的規則，等於官方對「agent 該怎麼等」的答案：

- **未來的跟進用 cron**（「等一下回來看」、提醒、週期性工作），**不要用 `exec` 的 sleep 迴圈、`yieldMs` 延遲花招，或反覆 `process` 輪詢**
- `exec` / `process` 只用於**現在啟動、然後在背景繼續**的指令
- 啟用自動完成喚醒時，**指令只啟動一次**，剩下交給推播式的喚醒路徑
- 對執行中的指令要看日誌、狀態、輸入或介入，用 `process`
- **較大的任務優先用 `sessions_spawn`**，子 agent 的完成是推播式的、會自動宣告回請求者
- **不要為了等完成而迴圈輪詢 `subagents list` / `sessions_list`**

這幾條合起來講的是同一件事：**輪詢是 agent 的反模式**，因為它把等待變成 token 消耗。

## 委派模式與 ultra 的並行編排

`agents.defaults.subagents.delegationMode` 預設 `"suggest"`。設成 `"prefer"` 會加入一個專門的 **Sub-Agent Delegation** 區段，要主 agent 當一個反應迅速的協調者，**把任何比「直接回覆」更複雜的東西都推給 `sessions_spawn`**。

這裡有一句重要的界線：**這只是 prompt，工具政策仍然決定 `sessions_spawn` 到底可不可用。**

而在 **`ultra` thinking 等級**且 `sessions_spawn` 可用時，還會再加一段 **Proactive Sub-Agent Orchestration**：把獨立的調查、實作與驗證平行化，簡單或緊密耦合的工作留在本地，**給每個子 agent 一個有界的目標**，並在回覆前綜合結果。

## 護欄是建議，不是強制

這句話官方寫得毫不含糊，值得原樣記住：

> 系統 prompt 裡的安全護欄是**建議性的，不是強制執行**。硬性強制要用工具政策、exec 核准、沙箱與頻道 allowlist；**操作者可以依設計關掉 prompt 護欄**。

這跟前面威脅模型那篇是同一種態度——把「靠說服模型」和「靠機制擋住」分開，不要讓前者假裝成後者。

## 整體來說

這篇的三個帶走點：**prompt 是組出來的**（所以你 debug 看到的就是真的）、**它被快取邊界切成穩定與易變兩半**（所以工具描述別寫死頻道名）、**護欄寫在 prompt 裡的部分只是建議**（所以真正的限制要往工具政策與沙箱找）。

而如果只能記一段設計，我會記「Promised Work」——它把「別說了不做」變成 prompt 裡的明文契約，而不是期待模型自己有這個習慣。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。新增：**系統 prompt 的三層組裝**（純渲染器／設定解析／執行期 adapter）與它讓 debug 介面與實際執行對齊的用意、**供應商可貢獻的三個具名區段與穩定前綴／動態後綴**（含 GPT-5 家族貢獻與 `personality` 只影響語氣層）、**prompt 快取邊界的切法**與工具描述不該寫死頻道名的建議、prompt 的完整區段結構（含 **Promised Work** 的跟進擁有權契約、OpenClaw Self-Update 與 `gateway` 工具拒絕改寫 `tools.exec.mode`）、**長時間工作的指引**（用 cron 而非 sleep 迴圈、不要輪詢等待）、`delegationMode` 與 `ultra` 等級的 Proactive Sub-Agent Orchestration，以及「prompt 護欄是建議而非強制」的明文界線。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [System prompt](https://docs.openclaw.ai/concepts/system-prompt) — 三層組裝、區段結構、快取邊界與委派指引
- [Agent loop](https://docs.openclaw.ai/concepts/agent-loop) — bootstrap 與 skills 注入的時機
- [Multi-agent routing](https://docs.openclaw.ai/concepts/multi-agent) — workspace 與 agentDir 的路徑
- [Sandboxing](https://docs.openclaw.ai/gateway/sandboxing) — 沙箱區段與 elevated exec
- [Skills](https://docs.openclaw.ai/tools/skills) — 按需載入的 skill 指令
