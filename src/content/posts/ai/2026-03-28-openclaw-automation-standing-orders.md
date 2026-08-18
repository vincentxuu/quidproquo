---
title: "OpenClaw 自動化（二）：Standing Orders 是授權書，Automations 是時鐘"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, standing-orders, automation, agents-md, escalation, autonomy]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 25
tldr: "Standing orders 給 agent 對某個「程式」的永久操作權限，寫在 AGENTS.md 裡、每個 session 自動注入。它定義的是「被授權做什麼」，時間點則交給 automations——兩者分工，而且 automation 的提示應該引用 standing order 而不是複製它。"
description: "OpenClaw 的 standing orders：四個必要欄位（範圍、觸發、核准閘門、升級規則）、與 automations 的分工、bootstrap 會自動注入哪些檔案，以及執行—驗證—回報的紀律。"
draft: false
---

上一篇講**什麼時候跑**，這篇講**被授權做什麼**。

Standing orders 給你的 agent 對定義好的「程式」**永久的操作權限**。不必每個任務都下指令，而是定義好範圍、觸發條件與升級規則，讓 agent 在邊界內自主執行：

> 「週報是你的。每週五編好、送出，只有看起來不對勁時才升級給我。」

## 為什麼需要它

官方的對比很直白：

**沒有 standing orders**：每個任務都要提示 agent，例行工作會被遺忘或延誤，**而你自己變成瓶頸**。

**有 standing orders**：agent 在定義好的邊界內自主執行，例行工作照時程發生，你只在例外與核准時介入。

## 寫在哪裡：bootstrap 會注入什麼

Standing orders 定義在 agent workspace 的檔案裡。**建議直接寫進 `AGENTS.md`**，因為它每個 session 都會自動注入。設定較大時可以放進 `standing-orders.md` 之類的專屬檔案，再從 `AGENTS.md` 引用。

這裡有一份要記住的清單——**workspace bootstrap 自動注入的是：`AGENTS.md`、`SOUL.md`、`IDENTITY.md`、`USER.md`、`BOOTSTRAP.md`、`MEMORY.md`**，**但不包含子目錄裡的任意檔案**。

所以「我寫在 `docs/policies/rules.md` 裡了」是無效的，除非有東西去引用它。

反過來，如果你要的是**不受 standing orders 管轄**的一次性執行——例如 CI 或腳本——用 `openclaw agent exec`：它**跳過 workspace bootstrap 檔案**，所以每次一次性執行都是自足的。

## 一份 standing order 的四個欄位

每個程式要指定四件事：

1. **Scope（範圍）** — agent 被授權做什麼
2. **Triggers（觸發）** — 什麼時候執行（排程、事件或條件）
3. **Approval gates（核准閘門）** — 什麼事情動手前需要人簽字
4. **Escalation rules（升級規則）** — 什麼時候該停下來求助

範例的骨架：

```markdown
## Program: Weekly Status Report

**Authority:** 彙整資料、產生報告、送交關係人
**Trigger:** 每週五 16:00（由 automation job 強制執行）
**Approval gate:** 標準報告不需要。異常標記出來給人看。
**Escalation:** 資料來源不可用，或指標異常（偏離常態超過 2σ）

### 執行步驟
1. 從設定的來源拉指標
2. 與上週和目標比較
3. 產生報告到 Reports/weekly/YYYY-MM-DD.md
4. 透過設定的頻道送出摘要
5. 記錄完成到 Agent/Logs/

### 不要做的事
- 不要把報告寄給外部單位
- 不要修改來源資料
- **指標難看也不要跳過投遞——如實回報**
```

最後那條「指標難看也不要跳過投遞」是整份範例裡最值得學的一行。**明確寫出「不要做什麼」，比只寫「要做什麼」更能防住 agent 的自作聰明**——尤其是那種出於好意的自作聰明。

## 分工：授權書 vs 時鐘

Standing orders 定義 **what**（被授權做什麼），automations 定義 **when**（什麼時候發生）：

```text
Standing Order：「每日信箱分類是你的」
    ↓
Automation（每天 8:00）：「依 standing orders 執行信箱分類」
    ↓
Agent：讀 standing orders → 執行步驟 → 回報結果
```

**關鍵在於 automation 的提示應該引用 standing order，而不是複製它。** 這是很實際的建議：複製會造成兩份規則各自漂移，最後你不知道 agent 到底聽哪一份。

```bash
openclaw automations add \
  --name daily-inbox-triage \
  --cron "0 8 * * 1-5" \
  --tz America/New_York \
  --timeout-seconds 300 \
  --announce \
  --channel imessage \
  --to "+1XXXXXXXXXX" \
  --message "依 standing orders 執行每日信箱分類。檢查新警示、解析歸類並持久化每一項、回報摘要給擁有者、未知項目升級。"
```

## 三種觸發形態

官方的三個範例剛好示範了三種不同的觸發模式：

**週期循環**（內容與社群）——週一檢視指標、週二到週四起草、週五彙整簡報。這類 standing order 的價值在於**把一週的節奏寫下來**，而不是每天重新決定。

值得注意它的核准閘門寫法：**「所有貼文前 30 天需要擁有者審閱，之後轉為常設核准」**——這是一個有時限的信任升級，比永遠要審或一開始就全放權都務實。

**事件觸發**（財務處理）——偵測到新檔案或每月週期時執行。它的升級規則是量化的：

| 條件 | 動作 |
|---|---|
| 單筆超過 $500 | 立即警示 |
| 類別超出預算 20% | 在報告中標記 |
| 無法辨識的交易 | 詢問擁有者如何歸類 |
| 重試兩次後仍處理失敗 | 回報失敗，**不要用猜的** |

最後一條同樣是「不要做什麼」的具體化。

**持續監控**（系統監控）——每個 heartbeat 週期執行。它用了一張反應矩陣，把「自己處理」與「升級」分得很清楚：服務掛掉自動重啟，**只有重啟失敗兩次才升級**；磁碟低於 10% 直接警示擁有者；頻道離線先記錄並下個週期重試，**離線超過 2 小時才升級**。

這張表回答的其實是「agent 什麼時候該吵你」——而這正是自主性能不能實際運作的關鍵。

## 執行—驗證—回報

Standing orders 要配上嚴格的執行紀律才有用。官方給的迴圈是：

1. **執行** — 做實際的工作，**不要只是確認收到指令**
2. **驗證** — 確認結果
3. **回報** — 回報真實發生的事

第一步的括號很值得注意：「不要只是確認收到指令」——這跟上一篇排程器裡「只回中途狀態會被重新提示」是同一個問題的兩種對策，一個寫在給模型的規則裡，一個做在系統裡。**兩層都需要，因為前者是建議、後者才是機制。**

## 整體來說

Standing orders 的本質是**把「我信任你做這件事到什麼程度」寫成文件**。它有價值的不是「讓 agent 自動做事」那部分——automations 就能做到——而是**強迫你把授權邊界、核准閘門與升級門檻寫明白**。

寫的時候有兩個實用提醒：**放在 `AGENTS.md`（或從它引用），因為 bootstrap 只自動注入那六個檔案**；以及**多寫「不要做什麼」**——範例裡最有力的幾行全都是禁令。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。新增：**bootstrap 自動注入的六個檔案清單**（`AGENTS.md`、`SOUL.md`、`IDENTITY.md`、`USER.md`、`BOOTSTRAP.md`、`MEMORY.md`）與「子目錄裡的任意檔案不會被注入」的界線、**`openclaw agent exec` 作為跳過 bootstrap 的嚴格一次性入口**、四個必要欄位的完整範例、**automation 提示應引用而非複製 standing order** 的分工建議與 `openclaw automations add` 的實際指令（cron 已改名，`openclaw cron` 為別名）、三種觸發形態的範例（含有時限的信任升級與量化的升級門檻矩陣），以及執行—驗證—回報的紀律與它跟排程器層對策的關係。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Standing orders](https://docs.openclaw.ai/automation/standing-orders) — 四個欄位、範例與執行紀律
- [Automations](https://docs.openclaw.ai/automation/cron-jobs) — 時間面的強制執行
- [Agent workspace](https://docs.openclaw.ai/concepts/agent-workspace) — bootstrap 自動注入的檔案
- [Agent exec](https://docs.openclaw.ai/cli/agent) — 跳過 bootstrap 的一次性執行
- [Automation](https://docs.openclaw.ai/automation/) — 六種自動化機制的分工
