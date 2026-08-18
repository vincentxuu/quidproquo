---
title: "OpenClaw Nodes 深入：核准綁的是計畫，不是你之後改過的指令"
date: 2026-03-28
type: deep-dive
category: ai
tags: [openclaw, nodes, system-run, exec, approvals, remote-execution]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 29
tldr: "遠端 node 執行最值得看的是核准的綁定方式：exec 在核准前先備好一份標準化的 systemRunPlan，核准之後 gateway 轉發的是那份存起來的計畫，不是任何之後被呼叫端改過的指令、cwd 或 session 欄位——而且執行前會重新驗證工作目錄。"
description: "OpenClaw 遠端 node host 的執行模型：gateway 與 node 的職責分工、系統執行核准綁定到標準化計畫與具體檔案運算元、無法唯一辨識時的拒絕策略，以及節點在場偵測。"
draft: false
---

上一篇講行動裝置怎麼當 node，這篇講**把指令送到另一台機器上執行**這件事——以及它的核准為什麼設計成現在這樣。

## 職責分工

用 node host 的情境是：**Gateway 跑在一台機器上，而你想讓指令在另一台上執行。** 模型仍然只跟 gateway 說話，gateway 在選到 `host=node` 時把 `exec` 呼叫轉發給 node host。

| 角色 | 負責 |
|---|---|
| Gateway 主機 | 接收訊息、跑模型、路由工具呼叫 |
| Node 主機 | 在 node 機器上執行 `system.run` / `system.which` |
| 核准 | **在 node 主機上強制執行**（存於 `~/.openclaw/state/openclaw.sqlite#exec_approvals_config`）|

第三列值得停一下：**核准是在被執行的那台機器上強制的**，不是在 Gateway 上。這是對的方向——真正承受後果的機器擁有否決權。

## 核准綁定：這篇的重點

遠端執行的核准有一個很容易被忽略的攻擊面：**你核准的那一刻看到的指令，和實際執行的指令，中間有一段時間差。** OpenClaw 對這段時間差做了三層處理。

### 一、綁定到標準化計畫

> 核准支撐的 node 執行**綁定確切的請求脈絡**。exec 路徑在核准之前先備好一份**標準化的 `systemRunPlan`**；一旦核准，**gateway 轉發的是那份存起來的計畫，不是任何之後被呼叫端編輯過的 command／cwd／session 欄位**，而且**執行前會重新驗證工作目錄**。

這是很紮實的設計。它擋掉的是「先送一個無害的指令去要核准，核准後再把參數換掉」這個模式——**核准的對象是計畫本身，不是一個之後還能改的請求物件。**

「執行前重新驗證工作目錄」則是另一層：**即使計畫沒被改，環境也可能在核准與執行之間變化。**

### 二、綁定到具體的檔案運算元

> 對直接的 shell／runtime 檔案執行，OpenClaw 還會**盡力綁定一個具體的本地檔案運算元**，並在**該檔案在執行前發生變化時拒絕執行**。

也就是說，核准「跑這個腳本」之後，如果那個腳本檔案被換掉了，執行會被擋下來。這處理的是核准後的 TOCTOU（檢查與使用之間的時間差）問題。

### 三、辨識不出來就拒絕，而不是假裝

這條最值得抄：

> 如果 OpenClaw **無法為某個直譯器／runtime 指令辨識出恰好一個具體的本地檔案**，**核准支撐的執行會被拒絕，而不是假裝有完整的 runtime 涵蓋**。更廣的直譯器語意，請用沙箱、獨立主機，或明確的可信 allowlist／完整工作流。

**「拒絕，而不是假裝有涵蓋」**——一個安全機制承認自己的邊界，並在邊界外選擇失敗而不是降級，比一個號稱涵蓋一切但實際上有洞的機制好得多。

## 兩套配對儲存（複習與補充）

上一篇提過，這裡補上完整規則：

- **裝置配對**管傳輸層認證。**裝置配對紀錄是耐久的「已核准角色」契約，token 輪替留在契約內，無法把 node 升級成配對從未授予的角色。**
- **`node.pair.*` / `openclaw nodes pending|approve|reject|remove|rename`** 是**另一個 gateway 擁有的 node 配對儲存**，追蹤 node 跨重連時已核准的指令與能力面，**不管傳輸認證**。

`nodes status` 只在某個 node 的**裝置配對角色包含 `node`** 時才標記為 paired。

移除的權限也分層：`operator.pairing` 可以移除其他裝置上的非操作者 node 紀錄；而**一個裝置 token 呼叫端要撤銷自己在混合角色裝置上的 node 角色，額外需要 `operator.admin`。**

## 節點在場偵測

一個 3 月之後新增、而且用途很具體的功能：連線中的原生 Mac 可以在 **Settings → Permissions → Active computer detection** 選擇加入**合併過的實體輸入活動**回報（**也需要輔助使用權限**）。

Gateway 會把**最新的合格 Mac 標記為 `active`**，給 agent 一個穩定的 node-id 提示，並**在延遲的後備之前把 node 連線警示路由到那裡**。

解決的問題很日常：**你有三台 Mac 都連著，agent 該把通知送到哪一台？** 答案是「你現在正在用的那台」，而判斷依據是實體輸入活動——這比讓 agent 猜或讓你手動指定實際得多。

## macOS 的節點模式：不要開兩個

前面桌面那篇提過，這裡再標一次因為它很容易踩：**macOS 選單列 app 以一個 node 的身分連上 Gateway**，並替 node-host 指令面加上原生的 Canvas、相機、螢幕、通知與電腦控制指令。

**不要在那台 Mac 上再啟一個 CLI node**——app 已經把對應的 CLI node-host 執行期當成內部 worker 在跑，而且**它是唯一的 Gateway 連線與 node 身分**。

## 傳輸的現況

大部分 node 走**操作者埠上的 Gateway WebSocket**。舊的 **Bridge protocol（TCP JSONL）現在只是歷史**——對目前的 node 而言是 legacy 傳輸。

唯一的例外是直連的 Apple Watch node，它在同一個埠上用簽章過的 HTTPS 輪詢（原因見上一篇）。

## 整體來說

Nodes 這一層真正有工程含量的地方不是「手機可以當周邊」，而是**遠端執行的核准怎麼做到可信**。

三條規則值得帶走，而且它們在任何有「人核准、機器執行」的系統裡都成立：**核准綁定的應該是一份不可再編輯的計畫**、**執行前要重新驗證環境**、以及**辨識不出邊界時要拒絕而不是降級涵蓋**。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。新增：**遠端 node host 的職責分工**與核准在 node 主機上強制執行的位置、**核准綁定的三層設計**（綁定標準化的 `systemRunPlan` 而非之後可編輯的欄位、執行前重新驗證工作目錄、盡力綁定一個具體本地檔案運算元並在檔案變更時拒絕、無法唯一辨識時拒絕而不假裝涵蓋）、**兩套配對儲存的分工**與「token 輪替無法升級角色」的保證、`nodes status` 的 paired 判定、移除 node 角色的權限分層（自撤混合角色需 `operator.admin`）、**節點在場偵測**（實體輸入活動決定哪台 Mac 是 `active`，需輔助使用權限）、macOS node 模式不可再啟第二個 CLI node，以及 Bridge protocol 已成為歷史傳輸。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Nodes](https://docs.openclaw.ai/nodes/) — 配對、遠端 node host 與核准綁定
- [Active computer presence](https://docs.openclaw.ai/nodes/presence) — 在場偵測的設定與隱私
- [Node pairing](https://docs.openclaw.ai/gateway/pairing) — 請求／核准生命週期
- [Exec tool](https://docs.openclaw.ai/tools/exec) — `host=node` 的執行路徑
- [Nodes troubleshooting](https://docs.openclaw.ai/nodes/troubleshooting) — 排查手冊
