---
title: "OpenClaw 參考篇：Pi 已經被吸收掉了——內建 runtime 現在就叫 openclaw"
date: 2026-03-28
type: deep-dive
category: ai
tags: [openclaw, agent-runtime, architecture, pi, harness, plugin-sdk]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 32
tldr: "「OpenClaw 是 Pi 的 Gateway 殼」這個說法已經過期。官方文件現在寫的是：內建 runtime id 是 openclaw，而 pi 是會被正規化掉的 legacy 別名，「已經沒有外部 agent 框架套件」。留下的第三方 pi 相關依賴只剩一個終端機元件工具包。"
description: "OpenClaw 的 agent runtime 架構：內建 runtime 的模組佈局與邊界、runtime 選擇規則、模型執行期世代的原子快照，以及資源套件的 manifest 慣例。"
draft: false
---

這一篇原本是在講「Pi 整合架構」——OpenClaw 內嵌了一個叫 Pi 的 coding agent runtime，而 OpenClaw 是它的 Gateway 殼。

**這個框架已經不成立了。**

## 最大的變化：Pi 被吸收進核心

官方那一頁現在的標題是「**Agent runtime architecture**」，第一句話是：**OpenClaw 擁有內建的 agent runtime。**

而 runtime 選擇那節寫得很直接：

> 內建的 runtime id 是 **`openclaw`**。**legacy 別名 `pi` 會被正規化成 `openclaw`**；`codex-app-server` 正規化成 `codex`。

邊界那節更明確：

> 核心透過 OpenClaw 模組與 SDK barrel 呼叫內建 runtime；**已經沒有留下外部 agent 框架套件。**

唯一還在的第三方 pi 相關依賴是 `@earendil-works/pi-tui`——**一個終端機元件工具包**，給本地 TUI 與 session 的工具渲染器用。官方把「內部化它」列為另一件獨立的工作。

所以現在的正確說法是：**Pi 不是一個你需要理解的獨立層。** 如果你在舊設定或舊筆記裡看到 `pi` 這個 runtime id，它會被正規化掉，不會壞，但也不代表有一個叫 Pi 的東西還在那裡跑。

## 內建 runtime 的模組佈局

| 路徑 | 負責 |
|---|---|
| `src/agents/embedded-agent-runner/` | 內建的嘗試迴圈、模型選擇與供應商正規化、per-provider 請求參數、compaction、逐字稿與 session 接線 |
| `src/agents/sessions/` | Session 持久化、資源探索、session 內的 `extensions` 載入、prompt 模板、skills、主題、TUI 支撐的工具渲染器 |
| `packages/agent-core/` | 可重用的 agent 核心（`@openclaw/agent-core`）：agent 迴圈、harness 型別、訊息、compaction 輔助、prompt 模板、skills、session 儲存契約 |
| `src/agents/runtime/` | 把 `@openclaw/agent-core` 接到 plugin SDK 的 LLM 執行期的門面 |
| `src/agents/agent-tools*.ts` | OpenClaw 自有的工具定義、參數 schema、工具政策、tool-call 前後的 adapter、主機與沙箱的編輯工具 |
| `src/agents/agent-hooks/` | 內建的執行期 hook：compaction 保護、compaction 指示、context 修剪 |
| `src/agents/harness/` | Harness 登錄、選擇政策與生命週期 |
| `src/llm/` | 模型／供應商登錄、傳輸輔助、供應商特定的串流實作 |

有一條邊界規則值得知道：**plugin 使用有文件的 `openclaw/plugin-sdk/*` 進入點，不 import `src/**` 的內部實作。** 這是很標準的做法，但把它寫進架構文件代表他們真的在守。

## Runtime 選擇的完整規則

這組規則在模型那篇提過片段，這裡是完整版：

- 內建 runtime id 是 `openclaw`；plugin harness 註冊額外的 runtime id（例如 `codex`）
- Runtime 政策是 **model／provider 範圍的 `agentRuntime.id` 設定**，**model 條目勝過 provider 條目**
- 未設定或 `default` 解析成 `auto`
- **`auto` 選一個支援當前供應商路由的已註冊 plugin harness，否則用內建的 OpenClaw runtime**
- **單靠供應商或模型前綴永遠不會選到 harness**
- OpenAI 只在「確切的官方 HTTPS Platform Responses 或 ChatGPT Responses 路由、且沒有自訂 request 覆寫」時才隱含選到 `codex`；Completions adapter、自訂端點、帶自訂 request 行為的路由留在 `openclaw`，**明文 HTTP 的官方端點被拒絕**

## 模型執行期世代：一份原子快照

這是我覺得這頁最有工程價值的一段，而且在 3 月版沒有。

**Gateway 啟動，以及設定、plugin 或認證的發布，會為每個已設定的 agent 建立一個「已備妥的模型執行期世代」。** 每個世代擁有探索到的認證模板、模型登錄與投影後的模型目錄，**作為一份原子快照**。

實際效果分兩邊：

- **Agent 執行從那份快照 fork 出可變的認證與登錄儲存**
- **瀏覽、狀態、cron、doctor、TUI、PDF 與圖片路徑改讀已發布的目錄，而不是重複做檔案系統探索**

還有一條一致性保證：**失敗或過時的世代永遠不會跟較新的部分世代並存**——生命週期的擁有者必須先發布一份完整的替代品。

這解決的是一個很真實的問題：**設定變更時，系統的不同部分看到不一致的模型目錄。** 用「整份原子替換」而不是「逐項更新」，是分散式系統裡的老招數用在單機設定上。

## 資源套件的 manifest

資源套件在 `package.json` 的中繼資料裡宣告 OpenClaw 資源，條目是相對於套件根目錄的檔案路徑或 glob：

```json
{
  "openclaw": {
    "extensions": ["extensions/index.ts"],
    "skills": ["skills/*.md"],
    "prompts": ["prompts/*.md"],
    "themes": ["themes/*.json"]
  }
}
```

**沒有列在 manifest 裡的資源型別，會退回探索慣例目錄**（`extensions/`、`skills/`、`prompts/`、`themes/`）。

順帶一提，前面 plugin 那篇提到的一個安裝失敗症狀就與此有關：**`package.json missing openclaw.extensions`** 代表那個套件用了 OpenClaw 已不再接受的形狀，要加上 `openclaw.extensions` 指向建置後的執行期檔案。

## 整體來說

這一篇最值得帶走的不是架構圖，是**一個舊心智模型的除役**：不要再把 OpenClaw 想成「包著 Pi 的殼」。內建 runtime 就是 OpenClaw 自己的，Pi 這個名字只剩兩個殘跡——一個會被正規化掉的 legacy id，和一個終端機 UI 的第三方套件。

這也是讀這種快速演進專案的文件時最容易出錯的地方：**架構層的名詞比 API 更容易悄悄失效**，因為它們不會在你的設定檔裡報錯，只會讓你的理解跟現況慢慢分岔。

## 更新紀錄

- 2026-08-18：對照官方文件現況**大幅改寫，主題整個換掉**。原文的核心框架「Pi 是 OpenClaw 內嵌的 coding agent runtime，OpenClaw 是 Pi 的 Gateway 殼」已經過期：官方頁面改名為「Agent runtime architecture」，**內建 runtime id 就是 `openclaw`，`pi` 是會被正規化掉的 legacy 別名，且已無外部 agent 框架套件**，僅剩 `@earendil-works/pi-tui` 這個終端機元件工具包作為第三方依賴。新增：內建 runtime 的模組佈局與 plugin 不得 import `src/**` 的邊界、**完整的 runtime 選擇規則**（model 條目勝過 provider、`auto` 的解析、前綴永不選 harness）、**模型執行期世代的原子快照**（fork 可變儲存、其他路徑讀已發布目錄、失敗世代不與新的部分世代並存），以及資源套件的 manifest 慣例與 `openclaw.extensions` 缺漏的安裝症狀。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Agent runtime architecture](https://docs.openclaw.ai/pi) — 模組佈局、runtime 選擇與模型執行期世代
- [Agent runtimes](https://docs.openclaw.ai/concepts/agent-runtimes) — provider／model／runtime 的分層
- [Plugin SDK](https://docs.openclaw.ai/plugins/sdk-overview) — plugin 的合法進入點
- [Plugin architecture](https://docs.openclaw.ai/plugins/architecture) — `openclaw.extensions` 與 plugin 執行模型
- [Configuration reference](https://docs.openclaw.ai/gateway/configuration-reference) — 設定欄位總表
