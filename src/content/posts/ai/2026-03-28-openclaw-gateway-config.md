---
title: "OpenClaw Gateway 篇（一）：嚴格驗證會讓它拒絕啟動，以及那些擋住你自己的保護"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, gateway, configuration, json5, hot-reload, validation]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 26
tldr: "OpenClaw 的設定驗證是嚴格的——多一個不認識的鍵、型別不對、值無效，Gateway 就拒絕啟動。它會保留最後已知良好的設定，但啟動與熱重載都不會自動還原，只有 doctor --fix 會。"
description: "OpenClaw Gateway 設定完整指南：JSON5 格式與嚴格驗證、驗證失敗時的可用指令、last-known-good 與 .rejected 檔、防誤覆寫的三個條件、hybrid 熱重載，以及設定的兩桶規則。"
draft: false
---

Gateway 從 `~/.openclaw/openclaw.json` 讀一份**選用的 JSON5 設定**。檔案不存在時用安全的預設值。

這篇講的不是有哪些欄位（那在[設定參考](https://docs.openclaw.ai/gateway/configuration-reference)裡，而且很長），是**設定系統本身的行為**——尤其是它在什麼時候會擋住你。

## 嚴格驗證：不認識的鍵會讓它不開機

這是最該先知道的一條：

> OpenClaw 只接受**完全符合 schema** 的設定。未知的鍵、型別錯誤、無效的值，都會讓 Gateway **拒絕啟動**。

唯一的根層例外是 `$schema`（字串），好讓編輯器掛上 JSON Schema 中繼資料。

**驗證失敗時只有診斷指令能用**：`openclaw doctor`、`openclaw logs`、`openclaw health`、`openclaw status`。修法是 `openclaw doctor --fix`（`--repair` 是同一個旗標，`--yes` 跳過確認）。

這個設計取向很明確：**寧可完全不開機，也不要帶著一份你以為生效、實際上被忽略的設定跑。** 打錯一個鍵名就靜默失效，是設定系統最惡毒的失敗模式。

## last-known-good 不會自動救你

Gateway 在每次成功啟動後會保留一份**受信任的最後已知良好副本**。但有個關鍵限制：

**啟動與熱重載都不會自動還原它——只有 `openclaw doctor --fix` 會。**

驗證失敗時，Gateway 啟動失敗、或跳過那次重載並讓執行中的程序繼續用最後接受的設定。被拒絕的寫入還會另存成 **`.rejected.<時間戳>`** 供檢查——所以你不會弄丟剛才打的那份，可以拿去對照哪裡不合 schema。

還有一條晉升規則：**候選設定裡如果含有被遮蔽的機密佔位符**（`***`、`[redacted]` 這類），就不會被晉升為 last-known-good。這避免了「把一份遮蔽過的設定存成基準」這種很難查的災難。

## 防誤覆寫：三個會被擋下的形狀

Gateway 會擋掉看起來像意外覆寫的寫入，除非那次寫入明確允許破壞性變更。三個條件：

- **掉了 `gateway.mode`**
- **失去 `meta` 區塊**
- **檔案縮水超過一半**

這三個都是「程式化寫設定時最容易發生的災難形狀」——讀進來、改一點、寫回去，中間某一步把大部分內容弄丟了。用大小與關鍵鍵的存在與否當啟發式，簡單但有效。

## 檔案本身的注意事項

**設定路徑必須是一般檔案。** OpenClaw 自己的寫入是**原子性的**（rename 到那個路徑上），所以**符號連結的 `openclaw.json` 會讓它的目標被整個取代，而不是穿透寫入**——要避免用符號連結的設定佈局。

如果你把設定放在預設狀態目錄之外，讓 `OPENCLAW_CONFIG_PATH` 直接指向那個真實檔案。

還有一條啟動守門（在 CLI 那邊）：**Gateway 除非設定裡有 `gateway.mode=local`，否則拒絕啟動。** 臨時／開發用途可以加 `--allow-unconfigured` 繞過，它不會寫入或修復設定。設定檔存在但缺 `gateway.mode` 會被當成「損壞／被覆寫」處理——**Gateway 不會替你猜 `local`**。

## 熱重載：hybrid 是預設

`gateway.reload.mode` 有三個值，預設是 `hybrid`：

| 模式 | 行為 |
|---|---|
| `off` | 不重載設定 |
| `hybrid`（預設）| 安全的變更即時套用，需要重啟的就重啟 |

重載監看的是**當前有效的設定檔路徑**（從 profile／state 預設解析，或設了 `OPENCLAW_CONFIG_PATH` 就用它）。首次成功載入之後，執行中的程序服務的是**記憶體內的有效設定快照**；成功的重載會**原子地換掉那份快照**。

`messages` 這類設定存檔後不用重啟就會生效，只有在重載被關掉（`gateway.reload.mode: "off"`）時才需要重啟。

## 設定的兩桶規則

要在一長串欄位裡找到方向，記住這條分法：

- **根層的同級鍵**：基礎設施與跨 agent 的預設
- **`agents.defaults`**：agent 迴圈的行為
- **`agents.entries`** 底下的項目：在 schema 支援 per-agent 覆寫的地方，可以覆寫上面任一桶

## 四種編輯方式

```bash
openclaw onboard        # 完整引導
openclaw configure      # 設定精靈
openclaw config get agents.defaults.workspace
openclaw config set agents.defaults.heartbeat.every "2h"
openclaw config unset plugins.entries.brave.config.webSearch.apiKey
```

Control UI 的 **Config** 分頁會**從實際的設定 schema 動態產生表單**，包含欄位的 `title` / `description` 中繼資料，以及可用時的 plugin 與頻道 schema，並保留 **Raw JSON** 編輯器當逃生門。

設定介面現在分兩層：**常用欄位先顯示，進階欄位收在摺疊的「Advanced (N)」群組裡**。這個分層來自 schema 的 `uiHints`——`advanced: false` 標常用、`true` 標進階，沒有直接標註的葉節點會繼承最近的祖先層級，**完全沒有宣告祖先的路徑預設為進階**。要注意這**只影響呈現**，不影響驗證、預設值、重載行為，也不影響那個鍵能不能被設定。

給 agent 與工具用的還有一個：`config.schema.lookup` 可以抓單一路徑範圍的 schema 節點加上直接子節點摘要，適合做逐層下鑽的介面。官方也建議 **agent 在改設定前先用它查欄位層級的文件**，而不是憑印象改。

## 整體來說

這套設定系統的性格可以用兩句話概括：**對錯誤零容忍（不合 schema 就不開機），但對意外很保護（last-known-good、`.rejected` 備份、防覆寫啟發式）。**

實務上這代表兩個習慣：改完設定如果 Gateway 起不來，**先跑 `openclaw doctor` 看確切問題、再考慮 `--fix`**，不要急著把設定砍掉重寫；以及**不要用符號連結管理 `openclaw.json`**，因為原子寫入會把你的連結目標整個換掉。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。新增：**嚴格驗證會讓 Gateway 拒絕啟動**（未知鍵／型別錯誤／無效值，唯一根層例外是 `$schema`）與驗證失敗時僅存的四個診斷指令、last-known-good **不會**在啟動或熱重載時自動還原（只有 `doctor --fix` 會）、被拒絕的寫入另存 `.rejected.<時間戳>`、含遮蔽佔位符的候選不會被晉升、防誤覆寫的三個形狀（掉 `gateway.mode`／失去 `meta`／檔案縮水過半）、設定路徑必須是一般檔案與符號連結會被整個取代的原子寫入行為、`gateway.mode=local` 的啟動守門、hybrid 熱重載的快照原子替換、設定的兩桶規則，以及 Control UI 由 schema 動態產生表單與 `uiHints` 的常用／進階分層。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Configuration](https://docs.openclaw.ai/gateway/configuration) — JSON5、嚴格驗證、編輯方式與兩桶規則
- [Configuration reference](https://docs.openclaw.ai/gateway/configuration-reference) — 完整欄位參考
- [Configuration examples](https://docs.openclaw.ai/gateway/configuration-examples) — 可直接複製的完整設定
- [Gateway runbook](https://docs.openclaw.ai/gateway/) — 重載模式與營運指令
- [Gateway CLI](https://docs.openclaw.ai/cli/gateway) — `gateway.mode=local` 守門與 `--allow-unconfigured`
