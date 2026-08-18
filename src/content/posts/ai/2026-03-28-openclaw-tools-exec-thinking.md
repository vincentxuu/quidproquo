---
title: "OpenClaw 工具篇（三）：關掉檔案工具不會讓 exec 變成唯讀"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, exec, shell, security, thinking, slash-commands]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 22
tldr: "exec 是一個會改變狀態的 shell 面：關掉 write、edit、apply_patch 這些檔案工具，完全不會讓它變成唯讀。而沙箱預設是關的，所以 host=auto 實際上會解析到 gateway——真的要沙箱就明確寫，它至少會 fail closed。"
description: "OpenClaw exec 工具的執行位置解析、單位陷阱與安全設計：host 的四個值、timeoutSeconds 與 yieldMs 的單位差異、PATH 與 loader 覆寫的拒絕、shell 快照，以及背景執行與排程的分界。"
draft: false
---

`exec` 是整組工具裡影響最大的一個，這篇只講它、以及圍繞它的幾個控制。

## 第一句話就是重點

> `exec` 是一個**會改變狀態的 shell 面**：指令可以在選定的主機或沙箱檔案系統允許的任何地方建立、編輯或刪除檔案。**停用 OpenClaw 的檔案系統工具（例如 `write`、`edit`、`apply_patch`）不會讓 `exec` 變成唯讀。**

這條值得單獨記住，因為它正好破解一個很自然的誤解：**「我把寫檔工具關掉了，所以 agent 動不了我的檔案」——不成立。** 只要 `exec` 還在，shell 就在。

## 執行在哪裡：`host` 的四個值

`host` 只接受 `auto`、`sandbox`、`gateway`、`node`——**它不是主機名稱選擇器**，長得像主機名稱的值會在指令執行前就被拒絕。

解析規則：

- **`auto`**：有活躍的沙箱執行期就解析到 `sandbox`，否則解析到 `gateway`
- **沙箱預設是關的**，所以「什麼都沒設」的情況下 `host=auto` 實際上跑在 **gateway 主機上**
- **明確寫 `host=sandbox` 在沒有沙箱時會 fail closed**，而不是安靜地跑到 gateway 上

最後這條是好設計：**隱含的預設可以寬鬆，明確的要求必須被尊重或報錯。** 如果你打算讓某段指令一定在沙箱裡跑，就明確寫出來。

其他規則：per-call 的 `host=node` 可以從 `auto` 指定；**per-call 的 `host=gateway` 只有在沒有活躍沙箱時才允許**；`host=node` 需要已配對的 node（多個 node 時用 `exec.node` 或 `tools.exec.node` 選一個）。

順帶一提：**`exec host=node` 是 node 唯一的 shell 執行路徑**，舊的 `nodes.run` 包裝已經移除。

## 單位陷阱

這個坑很具體，官方自己也標了出來：

| 參數 | 單位 |
|---|---|
| `timeoutSeconds`（exec）| **秒** |
| `yieldMs`（exec 的同層參數）| **毫秒** |
| `timeout`（`process` 工具的同名參數）| **毫秒** |

所以 exec 的逾時參數叫 `timeoutSeconds` 是刻意的——**讓單位出現在呼叫點上**。預設 `tools.exec.timeoutSeconds` 是 1800（30 分鐘），per-call 設 `0` 則停用該次呼叫的 exec 程序逾時。

## 安全設計裡值得學的幾條

**拒絕 PATH 與 loader 覆寫。** 主機執行（`gateway` / `node`）會拒絕 `env.PATH` 與 `LD_*` / `DYLD_*` 的覆寫，**防止二進位劫持或注入程式碼**。這是很典型的攻擊面，直接在參數層擋掉比事後偵測乾淨。

**Shell 快照。** 非 Windows 的 gateway 主機上，bash 與 zsh 的 exec 指令使用啟動快照：OpenClaw 從 shell 啟動檔擷取可 source 的別名／函式與一小組安全的環境變數到 `$OPENCLAW_STATE_DIR/cache/shell-snapshots/`，每次 exec 前先 source 它。**看起來像機密的變數會被排除**，沙箱與 node 的 exec 不使用這份快照。要關掉設 `OPENCLAW_EXEC_SHELL_SNAPSHOT=0`。

這個機制解決的是「agent 跑的指令找不到我平常用的別名」，同時避開了「把整份環境含機密一起帶進去」。

**Shell 選擇有 fallback 邏輯。** 非 Windows 上用 `SHELL`，但**如果 `SHELL` 是 fish，會優先找 `bash`（或 `sh`）**以避開 fish 不相容的 bashism，兩者都沒有才退回 `SHELL`。Windows 上優先探索 PowerShell 7（`pwsh`），再退回 Windows PowerShell 5.1。

**有些指令 exec 跑不了。** `openclaw channels login` 是互動式的頻道認證流程，`/approve` 需要走核准指令處理器而不是 shell——這兩個在 exec 裡都會被擋。頻道登入要在 gateway 主機的終端機跑，或用頻道專屬的登入工具（例如 `whatsapp_login`）。

**環境標記。** OpenClaw 會在 spawn 的環境裡設 `OPENCLAW_SHELL=exec`（PTY 與沙箱執行也一樣），讓 shell／profile 規則可以偵測到自己在 exec 工具的脈絡裡。頻道來源的執行還會在 `OPENCLAW_CHANNEL_CONTEXT` 暴露一小段發送者／聊天身分的 JSON。

## 核准與 elevated

per-call 的 `security` 參數**在正常工具呼叫時被忽略**——`gateway` / `node` 的安全性衍生自 `tools.exec.mode` 與主機核准檔案，只有操作者明確授予 elevated 存取時才可能強制成完整存取。

`ask` 也類似：基準模式衍生自 `tools.exec.mode` 與主機核准。**對頻道來源的模型呼叫，當有效的主機 ask 是 `off` 時 per-call 的 `ask` 被忽略；否則它只能往更嚴格的方向收**。

方向性很清楚：**per-call 參數可以加嚴，不能放寬。**

`elevated` 則是明確請求逃出沙箱到設定的主機路徑（預設 `gateway`，或 `tools.exec.host=node` 時走 node），**只有在當前 session／供應商啟用了 elevated 存取時才可用**。

## 別用 sleep 迴圈模擬排程

這組指引在系統 prompt 裡也有，這裡是工具層的版本：

- **現在就開始、然後在背景繼續**的指令用 `exec` / `process`
- 啟用自動完成喚醒時，**指令只啟動一次**，靠推播路徑喚醒
- 要看日誌、狀態、輸入或介入用 `process`
- **不要用 sleep 迴圈、timeout 迴圈或反覆輪詢來模擬排程**
- **之後才要發生或週期性的工作，用 cron**

agent 啟動的背景指令會出現在 Web、iOS 與 Android 的背景任務檢視裡直到完成，而**任務帳本會在完成 heartbeat 再次喚醒 agent 之前定案**——順序上先記帳、再喚醒。

## Script preflight 的邊界

有個細節值得知道：常見 Python／Node shell 語法錯誤的 script preflight 檢查**只檢視有效 `workdir` 邊界內的檔案**。腳本路徑解析到 `workdir` 之外時，那個檔案就跳過 preflight。

而且 **`host=gateway` 且有效政策是 `security=full` 加 `ask=off` 時，preflight 完全跳過**——也就是說，你把安全設到最寬鬆時，連這層便利檢查也一併失去。

## 整體來說

`exec` 的正確心智模型是：**它是一個 shell，而 shell 的能力邊界由主機與沙箱決定，不由 OpenClaw 的其他工具開關決定。**

所以要限制它，能用的槓桿是：沙箱（換執行位置）、`tools.exec.mode` 與主機核准（換權限）、OS 使用者隔離（換身分）。**把 `write` 關掉不在這份清單上。**

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。新增：**「停用檔案工具不會讓 `exec` 變成唯讀」的明確聲明**、`host` 只接受四個值且非主機名稱選擇器、**沙箱預設關閉使 `host=auto` 實際解析到 gateway 而明確的 `host=sandbox` 會 fail closed**、`exec host=node` 是 node 唯一的 shell 路徑（`nodes.run` 已移除）、**`timeoutSeconds` / `yieldMs` / `process` 的 `timeout` 單位差異**、主機執行拒絕 `env.PATH` 與 `LD_*`／`DYLD_*` 覆寫、**shell 啟動快照**（排除機密、沙箱與 node 不使用、可用環境變數關閉）、fish 與 PowerShell 的 shell 選擇邏輯、`openclaw channels login` 與 `/approve` 無法透過 exec 執行、`OPENCLAW_SHELL` 與 `OPENCLAW_CHANNEL_CONTEXT` 環境標記、**per-call 的 `security`／`ask` 只能加嚴不能放寬**、背景執行與 cron 的分界，以及 script preflight 的 workdir 邊界與在最寬鬆政策下被跳過的行為。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Exec tool](https://docs.openclaw.ai/tools/exec) — 參數、執行位置解析、安全設計與設定
- [Elevated mode](https://docs.openclaw.ai/tools/elevated) — 逃出沙箱的主機路徑
- [Sandboxing](https://docs.openclaw.ai/gateway/sandboxing) — 沙箱模式與 `tools.exec.host` 的互動
- [Tools and custom providers](https://docs.openclaw.ai/gateway/config-tools) — 工具政策與群組語意
- [Automation](https://docs.openclaw.ai/automation) — cron 與背景任務
