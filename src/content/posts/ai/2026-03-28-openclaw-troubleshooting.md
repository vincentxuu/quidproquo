---
title: "OpenClaw 維運篇：前 60 秒的七行指令，與「感覺變笨了」通常不是模型的錯"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, troubleshooting, doctor, diagnostics, tool-profile, install-policy]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 31
tldr: "官方的分診流程是七行指令跑一遍、兩分鐘出診斷。而「assistant 感覺受限、工具不見了」這個最常見的症狀，多半是工具 profile——minimal 只允許 session_status，coding 才是新本地設定的預設。"
description: "OpenClaw 的排查手冊：前 60 秒的指令階梯與每行該看什麼、工具 profile 造成的能力落差、本地 OpenAI 相容後端的相容旗標，以及 plugin 安裝政策 fail closed 與檔案擁有權的復原。"
draft: false
---

這是整個系列裡最該收藏的一篇——不是因為有趣，是因為你會在半夜用到。

## 前 60 秒：照順序跑

官方把它叫做「分診大門：兩分鐘拿到診斷，再跳到深入的那一頁」。

```bash
openclaw status
openclaw status --all
openclaw gateway probe
openclaw gateway status
openclaw doctor
openclaw channels status --probe
openclaw logs --follow
```

每一行該看到什麼：

| 指令 | 好的輸出 |
|---|---|
| `openclaw status` | 顯示已設定的頻道，沒有認證錯誤 |
| `openclaw status --all` | 產出完整、可分享的報告 |
| `openclaw gateway probe` | `Reachable: yes`。`Capability: ...` 是探測**證明**的認證層級 |
| `openclaw gateway status` | `Runtime: running`、`Connectivity probe: ok`、合理的 `Capability`。加 `--require-rpc` 可要求讀取範圍的 RPC 證明 |
| `openclaw doctor` | 沒有阻擋性的設定／服務錯誤 |
| `openclaw channels status --probe` | Gateway 連得上時回傳**每個帳號的即時傳輸狀態**；連不上時退回純設定摘要 |
| `openclaw logs --follow` | 穩定的活動，沒有重複的致命錯誤 |

有一行的解讀值得標出來：**`Read probe: limited - missing scope: operator.read` 是「診斷能力降級」，不是連線失敗。** 看到它不用急著懷疑網路。

## 最常見的症狀：感覺變笨了

> **Assistant 感覺受限或工具不見了**

這個症狀最容易被誤判成「模型不行」，但官方把它放在第一個專門段落，答案通常是**工具 profile**：

| Profile | 範圍 |
|---|---|
| `minimal` | **只允許 `session_status`** |
| `messaging` | 很窄，給純聊天的 agent |
| `coding` | **新本地設定的預設**（repo、檔案、shell 與執行期工作）|
| `full` | 移除 profile 限制；**只給受信任的、操作者控制的 agent** |

而且 **per-agent 的 `agents.entries.*.tools` 覆寫會收窄或擴張根層 profile**——所以「同一個 Gateway 上另一個 agent 明明可以」不代表設定沒問題。

診斷用 `openclaw status` / `--all` / `doctor`，改完 profile 之後**重啟或重載 Gateway，再用 `openclaw status --all` 重新確認**。

## 本地 OpenAI 相容後端：直接測得通，走 OpenClaw 就掛

這個排查流程很具體，值得完整記下來。症狀是：你自架的 `/v1` 後端直接打 `/v1/chat/completions` 探測沒問題，但 `openclaw infer model run` 或正常的 agent 回合會失敗。

按順序試：

1. 錯誤提到 **`messages[].content` 期待字串** → 設 `models.providers.<id>.models[].compat.requiresStringContent: true`
2. **只在 OpenClaw 的 agent 回合失敗** → 設 `models.providers.<id>.models[].compat.supportsTools: false` 再試
3. **小的直接呼叫可以、較大的 OpenClaw prompt 讓後端崩潰** → **那是上游模型／伺服器的限制，不是 OpenClaw 的 bug**

第三點的措辭很誠實。文件願意寫「這不是我們的問題」而不是含糊帶過，對排查的人反而有幫助——**它讓你停止在錯的地方找。**

## Plugin 相關的三種卡住

### 一、`package.json missing openclaw.extensions`

代表那個 plugin 套件用了 OpenClaw 已不再接受的形狀。修法在 plugin 那邊：加上 `openclaw.extensions` 指向建置後的執行期檔案（通常是 `./dist/index.js`），重新發布，再裝一次。

### 二、安裝政策 fail closed

症狀是更新跑完了但 plugin 過時、被停用，或顯示 `blocked by install policy`、`install policy failed closed`、`Disabled "<plugin>" after plugin update failure`。

原因通常是 `security.installPolicy` 的規則寫得太死。官方列了幾種**該避免的政策形狀**：

- **把 OpenClaw 自有的 plugin 凍結在某個確切的舊版本**（例如只允許 `@openclaw/*@2026.5.3`）
- **只用來源種類封鎖**（每個 npm、網路，或 `request.mode: "update"` 的請求）
- **把政策指令當成選配**——啟用 `security.installPolicy` 後，**缺失、緩慢、不可讀或權限被擋的政策執行檔都會 fail closed**
- 核准版本時**沒有把請求的 `openclawVersion` 拿去對照 plugin 候選的中繼資料**

背後的原因是：**`@openclaw/*` 的 plugin 版本通常跟著 OpenClaw 發布走**，所以一次 OpenClaw 更新可能在更新後同步階段需要對應的 plugin 更新。

復原：

```bash
openclaw doctor --deep
openclaw plugins update --all
openclaw status --all
```

政策是刻意嚴格的話，就在受信任的升級窗口內放寬、跑完 `plugins update --all`、再恢復嚴格規則。如果更新失敗導致 plugin 被停用，**先 inspect 再重新啟用**：

```bash
openclaw plugins inspect <plugin-id> --runtime --json
openclaw plugins enable <plugin-id>
```

### 三、可疑的檔案擁有權

```text
blocked plugin candidate: suspicious ownership (... uid=1000, expected uid=0 or root)
plugin present but blocked
```

意思是 plugin 檔案的 Unix 擁有者跟載入它們的程序不同。**不要移除 plugin 設定**——修檔案擁有權，或用擁有狀態目錄的那個使用者去跑 OpenClaw。

Docker 安裝以 `node`（uid 1000）執行，修主機的 bind mount：

```bash
sudo chown -R 1000:1000 /path/to/openclaw-config /path/to/openclaw-workspace
openclaw doctor --fix
```

刻意以 root 執行的話，改修受管理的 plugin 根目錄：

```bash
sudo chown -R root:root /path/to/openclaw-config/npm
openclaw doctor --fix
```

## 一個模型端的具體錯誤

`HTTP 429: rate_limit_error: Extra usage is required for long context requests` —— 這是 Anthropic 的長 context 需要額外用量方案，官方有專門的段落。它不是一般的速率限制，改重試策略沒用。

## 整體來說

這份手冊的組織方式本身就值得學：**症狀優先，而不是元件優先。** 你半夜遇到問題時知道的是「它不回話了」，不是「Gateway 的頻道模組有問題」。

而其中最實用的一條是那個工具 profile 的段落——**當 agent「感覺變笨」時，先查它被允許用什麼工具，再懷疑模型。** 這條經驗在任何 agent 系統裡都成立。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。新增：**前 60 秒的七行指令階梯**與每行該看到什麼（含 `Read probe: limited` 是診斷降級而非連線失敗、`gateway status --require-rpc`）、**「感覺變笨」的工具 profile 診斷**（`minimal` 只允許 `session_status`、`coding` 是新本地設定的預設、per-agent 覆寫會改變結果）、**本地 OpenAI 相容後端的三步相容旗標流程**（`compat.requiresStringContent`、`compat.supportsTools`，以及第三步明說是上游限制而非 OpenClaw bug）、**plugin 的三種卡住**（缺 `openclaw.extensions`、`security.installPolicy` fail closed 的四種該避免的政策形狀與復原步驟、檔案擁有權被擋時的 Docker 與 root 兩種修法），以及 Anthropic 長 context 的 429 專屬錯誤。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [General troubleshooting](https://docs.openclaw.ai/help/troubleshooting) — 症狀優先的分診大門
- [Gateway troubleshooting](https://docs.openclaw.ai/gateway/troubleshooting) — Gateway 與模型端的深入 runbook
- [Tool profiles](https://docs.openclaw.ai/gateway/config-tools) — 完整的 profile 與群組表
- [Plugins](https://docs.openclaw.ai/tools/plugin) — 安裝政策與擁有權問題
- [Channel troubleshooting](https://docs.openclaw.ai/channels/troubleshooting) — 各頻道的診斷與修復
