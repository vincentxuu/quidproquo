---
title: "OpenClaw 工具篇（二）：Skills 的六層優先順序，與子 agent 不給訊息工具的理由"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, skills, subagents, sessions-spawn, skill-workshop, clawhub]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 21
tldr: "Skills 從六個來源載入、同名時高優先者勝，而 per-agent 的清單是取代不是合併。子 agent 預設拿不到 session 與訊息工具——它回傳純文字給父 agent，人看得到的回覆權留在父 agent 手上。"
description: "OpenClaw 的 skills 與子 agent：六層載入優先順序、node 託管的 skills、agent allowlist 的取代語意、$skill 引用、Skill Workshop 提案佇列，以及子 agent 的推播式完成與投遞重試。"
draft: false
---

Skills 教 agent **怎麼做事**，子 agent 讓它**同時做很多事**。這兩件事放在一起講，是因為它們共用同一個問題：**怎麼在不炸掉 context 的前提下擴充能力。**

## Skills 的六層載入優先順序

Skill 是含 `SKILL.md` 的目錄。OpenClaw 從六個來源載入，**同名時最高優先者勝**：

| 優先 | 來源 | 路徑 |
|---|---|---|
| 1（最高）| Workspace skills | `<workspace>/skills` |
| 2 | 專案 agent skills | `<workspace>/.agents/skills` |
| 3 | 個人 agent skills | `~/.agents/skills`（僅預設狀態）|
| 4 | 受管理／本地 skills | `<state>/skills` |
| 5 | 內建 skills | 隨安裝附帶 |
| 6（最低）| 額外目錄 | `skills.load.extraDirs` + plugin skills |

Skill 根目錄**支援分組佈局**——`SKILL.md` 出現在設定根目錄下的任何地方（最深 6 層）都會被發現，資料夾路徑只是為了整理。**skill 的名稱與斜線指令來自 frontmatter 的 `name` 欄位**（缺少時才用目錄名），agent allowlist 也是比對這個 `name`。

有一條遷移提醒：**Codex CLI 的原生 `$CODEX_HOME/skills` 不是 OpenClaw 的 skill 根目錄**，要用 `openclaw migrate plan codex` 盤點、`openclaw migrate codex` 複製過來。

## Node 託管的 skills

一個連線中的無頭 node 可以發布它自己 skills 目錄裡的 skill。它們**在 node 連線時出現在正常的 agent skill 清單裡，斷線就消失**。

同名衝突時**本地或 Gateway 的 skill 保住名字，node 的那個會拿到確定性的 node 前綴名稱**。因為它的檔案、相對引用與二進位檔都在 node 上，載入與執行要用 `exec host=node node=<id>`；改了 node 的 skill 檔案之後要**重啟 node host**。

## Allowlist：位置與可見性是兩回事

這是最容易誤解的一組概念：**skill 的位置（優先順序）與 skill 的可見性（哪個 agent 能用）是分開的控制。**

```json5
{
  agents: {
    defaults: { skills: ["github", "weather"] },
    entries: {
      writer: { default: true },        // 繼承 github、weather
      docs: { skills: ["docs-search"] }, // 完全取代預設
      "locked-down": { skills: [] },     // 沒有任何 skill
    },
  },
}
```

規則：省略 `agents.defaults.skills` 代表預設不限制；省略 `agents.entries.*.skills` 代表繼承；**非空的 per-agent 清單是最終集合，不與預設合併**。

有效的 allowlist 會**橫跨 prompt 建構、斜線指令發現、沙箱同步與 skill 快照**——不是只影響其中一處。

但官方加了一句很重要的界線：**這不是主機的 shell 授權邊界。** 如果同一個 agent 能用 `exec`，就要另外用沙箱、OS 使用者隔離、exec 的 deny/allow 清單與 per-resource 憑證去約束那個 shell。

## 在 prompt 裡引用 skill

Control UI 的輸入框打 `$` 可以搜尋當前 agent 可用的 skill，選中會插入穩定的指令名稱：

```text
Use $github and $release_notes to summarize this change for the release.
```

幾個實際規則：**一則訊息最多引用 8 個不同的 skill**；引用了超過上限或被 allowlist 藏起來的 skill 時，OpenClaw 會**回傳可見的錯誤，而不是默默忽略**。

常見的大寫 shell 變數（`$HOME`、`$PATH`、`$EDITOR`）維持普通文字，要引用同名 skill 得用小寫；要讓引用保持字面意義就寫 `\$name`。

還有一個權限相關的旗標：**`disable-model-invocation: true`** 讓 skill 不出現在 `$` 選單與模型的正常 prompt 裡，**模型無法自己選它**——但獲授權的使用者明確寫 `$skill-name` 仍然可以叫用。這個分離很實用：有些 skill 你希望存在、但不希望模型自作主張用。

## Skill Workshop：agent 不能直接改 SKILL.md

3 月之後新增的機制，而且設計取向值得注意：**Skill Workshop 是 agent 與你的實際 skill 檔案之間的一道提案佇列。**

當 agent 發現可重用的工作時，它**起草一份提案，而不是直接寫進 `SKILL.md`**。你審查、核准之後才會有任何改動。

```bash
openclaw skills workshop list
openclaw skills workshop inspect <proposal-id>
openclaw skills workshop evaluate <proposal-id>
openclaw skills workshop apply <proposal-id>
```

這跟前面多 agent 那篇「agent 可以要求建立 agent，但需要操作者核准」是同一個模式：**允許 agent 自我改進，但把改進變成提案而不是既成事實。**

## 子 agent：推播式的背景執行

子 agent 是從既有執行 spawn 出來的背景 agent 執行，各自跑在自己的 session（`agent:<id>:subagent:<label>`），完成時**宣告**結果回請求者的聊天頻道。每一次子 agent 執行都被追蹤成一個背景任務。

目標很明確：平行化研究與慢速工具工作而不阻塞主執行、預設保持隔離、**讓工具面難以被誤用**、支援可設定的巢狀深度。

### 三條關鍵的行為規則

**一、`sessions_spawn` 是非阻塞的**，立刻回傳 run id。需要子結果的 agent 回合應該在 spawn 之後呼叫 **`sessions_yield`**——那會結束當前回合，讓完成事件當成下一則模型可見的訊息抵達。

**二、完成是推播式的。** 官方寫得很直接：spawn 之後**不要**為了等它完成而迴圈輪詢 `/subagents list`、`sessions_list` 或 `sessions_history`，只在除錯時按需查狀態。

**三、子 agent 預設拿不到 session 與訊息工具。** 原生子 agent **沒有 message 工具**，它回傳純助理文字給父／請求者 agent，**人看得到的回覆權留在父 agent 的正常投遞政策手上**。

第三條的理由很值得想：如果子 agent 能自己說話，一次 spawn 五個就會有五個聲音同時對使用者講話。把「說話權」收攏在父 agent，等於強制它先綜合再開口。

還有一條防禦性設計：**子 agent 的輸出是給請求者 agent 綜合的報告與證據，不是使用者撰寫的指令文字，不能覆寫系統、開發者或使用者政策。**

### 投遞的韌性

完成的交付做得比我預期的仔細：

- 交回請求者 session 時帶**穩定的冪等鍵**
- 如果請求者執行還活著，**先嘗試喚醒／引導那個執行**，而不是另開一條可見的回覆路徑
- 叫不醒就退回請求者 agent 的交接，**而不是丟掉宣告**
- 直接交接不可用時退回佇列路由；排隊中的完成維持 `session_queued` 狀態直到耐久佇列落定
- **自動投遞最多重試 30 分鐘**，約 15 秒起跳、退避上限 5 分鐘。永久失敗或超過期限時，**成功的子任務會顯示為被阻擋，而不是把結果丟棄**
- 被阻擋的結果**保留 7 天**，可以從 Tasks 頁或 `openclaw tasks retry` / `dismiss` 處理

「失敗時顯示為阻擋而不是丟棄」這條，是把「工作做完了但沒送到」跟「工作沒做」分開——這在背景任務系統裡是很值得抄的區分。

### 成本提醒

官方特別標了一段：**每個子 agent 預設有自己的 context 與 token 用量。** 重複性高或量大的任務，用 `agents.defaults.subagents.model` 把子 agent 設成便宜的模型，主 agent 留在高品質模型上。

只有在子 agent **真的需要請求者當前的逐字稿**時，才用 `context: "fork"` spawn（thread 綁定的子 agent session 預設就是 fork，因為它們是把當前對話分支成後續 thread）。

## 整體來說

Skills 與子 agent 都是「擴充能力但不炸 context」的答案，方向卻相反：**skill 把知識延後到需要時才載入，子 agent 把工作移到另一個 context 裡去做。**

而兩者共用同一種安全直覺——**不要讓被擴充出來的東西直接對人說話或直接改自己**。子 agent 沒有 message 工具，agent 改 skill 要走提案佇列。這兩個限制看起來瑣碎，實際上是把「自主」與「不受控」分開的關鍵。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。Skills 部分新增：**六層載入優先順序表**與分組佈局、名稱來自 frontmatter `name`、**node 託管的 skills**（連線期間可用、同名時取得 node 前綴、需 `exec host=node` 執行）、位置與可見性是分開控制、**allowlist 為取代而非合併且橫跨 prompt／指令發現／沙箱同步／快照**、「這不是 shell 授權邊界」的界線、**`$skill` 引用**（上限 8 個、超過會可見報錯、大寫 shell 變數的處理）、`disable-model-invocation`，以及 **Skill Workshop 提案佇列**與 Codex skills 的遷移指令。子 agent 部分新增：`sessions_spawn` 非阻塞與 `sessions_yield` 的搭配、**推播式完成與不要輪詢的明確指引**、**子 agent 預設無 message 工具**與其設計理由、子輸出不得覆寫政策、**投遞韌性**（冪等鍵、喚醒優先、30 分鐘重試、7 天保留、阻擋而非丟棄）與成本提醒（子 agent 專用便宜模型、`context: "fork"` 的使用時機）。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Skills](https://docs.openclaw.ai/tools/skills) — 載入順序、allowlist、`$` 引用與 node 託管
- [Skill Workshop](https://docs.openclaw.ai/tools/skill-workshop) — 提案佇列的生命週期與 CLI
- [Sub-agents](https://docs.openclaw.ai/tools/subagents) — spawn、完成交付與投遞韌性
- [Creating skills](https://docs.openclaw.ai/tools/creating-skills)、[Self-learning](https://docs.openclaw.ai/tools/self-learning) — 自訂與自我學習
- [Swarm](https://docs.openclaw.ai/tools/swarm) — 從程式碼編排並行 agent
