---
title: "OpenClaw 行動平台：手機是周邊，不是 Gateway——連 Apple Watch 都有自己的傳輸"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, ios, android, watchos, nodes, mobile, pairing]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 5
tldr: "iOS 與 Android 的 app 是 node，不是 Gateway：它們不跑 Gateway 服務，Telegram 或 WhatsApp 的訊息也是落在 Gateway 上而不是手機上。Apple Watch 比較特別——因為 watchOS 擋掉一般 app 的低階網路，它改用簽章過的 HTTPS 輪詢。"
description: "OpenClaw 的行動裝置支援：node 的角色定位、配對流程與逾時、能力核准的三段權限、watchOS 的專屬傳輸，以及 Telegram Dashboard Mini App 這條從手機操作的路徑。"
draft: false
---

行動裝置在 OpenClaw 裡的角色只有一個詞：**node（周邊）**。

## 手機不是 Gateway

這是最該先建立的心智模型：

> Node 是**周邊，不是 gateway**：它們不跑 gateway 服務，而**頻道訊息（Telegram、WhatsApp 等）落在 gateway 上，不是落在 node 上。**

換句話說，你手機上的 app 不會自己去連 Telegram。它連的是**你的 Gateway**，然後把手機獨有的能力（相機、螢幕、位置、通知、Canvas）借給 agent 用。

一個 node 是連上 Gateway 並宣告 `role: "node"` 的伴隨裝置（macOS／iOS／watchOS／Android／無頭），透過 `node.invoke` 暴露指令面：`canvas.*`、`camera.*`、`device.*`、`notifications.*`、`system.*`。

## watchOS 為什麼特別

大部分 node 走**操作者埠上的 Gateway WebSocket**。但有一個例外，理由很技術也很具體：

> 選用的直連 Apple Watch node 在**同一個埠上使用簽章過的 HTTPS 輪詢**，因為 **watchOS 對一般 app 封鎖了通用的低階網路**。

這是「平台限制決定架構」的乾淨例子——不是設計者偏好輪詢，是 WebSocket 那條路在 watchOS 上對一般 app 不開放。

Watch 的設定也走不同的核准路徑：**用管理員鑄造的、短效的 node-only 設定碼**來核准它**固定的低風險指令面**；之後要擴充能力**仍然需要正常的核准流程**。

還有一條升級順序要注意：**直連 watchOS 的 HTTPS 傳輸需要當前的協定版本**——啟用直連模式前，要跟 Gateway 一起更新 watch app。

## 配對：兩個獨立的儲存

這是 node 這塊最容易搞混的地方，值得講清楚。**有兩套配對紀錄，管的事情不同：**

**裝置配對（device pairing）** — node 在連線時提出簽章過的裝置身分，Gateway 為 `role: node` 建立一筆裝置配對請求。**這一套管的是傳輸層認證。**

```bash
openclaw devices list
openclaw devices approve <requestId>
openclaw nodes status
```

**Node 配對儲存**（`openclaw nodes pending/approve/reject/remove/rename`）— 這是**另一個由 gateway 擁有的儲存**，追蹤 node 跨重連時**已核准的指令與能力面**。官方明說：**它不管傳輸認證，那是裝置配對的事。**

還有一條安全保證：**裝置配對紀錄是耐久的「已核准角色」契約。Token 輪替留在那份契約內，它無法把一個已配對的 node 升級成配對核准從未授予的角色。**

### 待處理請求的行為

**待處理的配對請求會在裝置最後一次重試的 5 分鐘後過期**——但有個貼心設計：**持續重連的裝置會讓它那一筆待處理請求（與 `requestId`）保持存活，而不是每幾分鐘就鑄造一個新提示。**

反過來，如果 node 用**變更過的認證細節（角色／範圍／公鑰）**重試，**先前的待處理請求會被取代並產生新的 `requestId`**，客戶端會收到 `device.pair.resolved` 事件——所以**核准前應該重跑一次 `openclaw devices list`**。

## 核准範圍是分三段的

這個設計很值得看：**核准所需的權限跟著待處理請求宣告的指令走**：

| 請求宣告的指令 | 需要的範圍 |
|---|---|
| 無指令 | `operator.pairing` |
| 非 exec 的 node 指令 | `operator.pairing` + `operator.write` |
| `system.run` / `system.run.prepare` / `system.which` | `operator.pairing` + **`operator.admin`** |

也就是說，**批准一台只要看看相機的手機，和批准一台能在你機器上執行 shell 指令的裝置，需要的權限不一樣。** 這比「配對就是配對」的一刀切安全得多。

移除也有對應的細緻度：`openclaw nodes remove --node <id|name|ip>` 對裝置支撐的 node 會**撤銷該裝置在已配對裝置儲存裡的 `node` 角色並斷開那個裝置的 node 角色 session**——**混合角色的裝置保留它的紀錄、只失去 `node` 角色，而純 node 的裝置紀錄則被刪除**。同時也會清掉 node 配對儲存裡的對應條目。

## 從手機真正操作它的兩條路

**一、行動 app 當 node**：手機提供相機、位置、通知、Canvas 這些本地能力，Gateway 留在雲端或家用主機上。前面雲端部署那篇提過這個組合——**state 集中在雲端，感官留在本地。**

**二、Telegram 的 Dashboard Mini App**：在跟 bot 的 DM 裡打 `/dashboard`，可以把完整的 Control UI 當成 Telegram WebApp 打開。前提是 `gateway.tailscale.mode` 設成 `serve` 或 `funnel`，而且你的數字 Telegram user ID 要在有效的 `allowFrom` 或 `commands.ownerAllowFrom` 裡——**萬用字元和使用者名稱都不算數**。

第二條路的好處是**不需要裝任何東西**，缺點是需要先把 Tailscale 的發布模式設好。

## 版本落差：先升 Gateway，再升 node

分階段升級整批裝置時，順序是有規定的：

> **先升級 Gateway，再逐一升級每個 node。**

Gateway 的 WebSocket 接受 **N-1 協定窗口**內的已認證 node 客戶端——當前 v4 的 Gateway 因此接受 v3 的 node（前提是連線同時宣告 `role: "node"` 與 `client.mode: "node"`）。但**操作者與 UI 的 session 仍然必須用當前協定。**

N-1 的 node 在升級期間**仍然可見且可管理**，Gateway 會記錄 `legacy node protocol accepted` 並附上升級建議。配對、裝置認證、指令 allowlist 與 exec 核准**全部照常適用**，但 **plugin 擁有的能力與指令會隱藏起來直到 node 升到當前協定**。比 N-1 更舊的 node 需要在重連前用其他方式升級。

## 整體來說

行動平台這一層的設計可以濃縮成一句：**手機借出能力，Gateway 保有權威。**

而其中最值得學的是**核准範圍的三段分級**——它承認「配對一台裝置」不是單一決策，而是取決於那台裝置想要什麼。一台只要回報位置的手機，和一台想跑 `system.run` 的機器，本來就不該用同一個門檻。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。新增：**node 是周邊而非 gateway** 的定位（頻道訊息落在 Gateway 上）、**watchOS 的簽章 HTTPS 輪詢傳輸**與其理由（watchOS 封鎖一般 app 的低階網路）、watch 的短效 node-only 設定碼與升級順序要求、**裝置配對與 node 配對是兩個獨立儲存**（前者管傳輸認證、後者追蹤指令能力面，且 token 輪替無法升級角色）、**待處理請求 5 分鐘過期但持續重連會保活**、認證細節變更會取代舊請求並需重查、**核准範圍的三段分級**（無指令／非 exec／`system.run` 分別需要不同權限）、`nodes remove` 對混合角色與純 node 裝置的不同處理、Telegram Dashboard Mini App 作為免安裝的手機操作路徑，以及**版本落差的 N-1 窗口與「先升 Gateway 再升 node」的順序**。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Nodes](https://docs.openclaw.ai/nodes/) — 配對、能力、核准範圍與版本落差
- [Node pairing](https://docs.openclaw.ai/gateway/pairing) — 請求與核准的完整生命週期
- [iOS](https://docs.openclaw.ai/platforms/ios)、[Android](https://docs.openclaw.ai/platforms/android) — 各平台的 app
- [Telegram](https://docs.openclaw.ai/channels/telegram) — Dashboard Mini App 的前提
- [Nodes troubleshooting](https://docs.openclaw.ai/nodes/troubleshooting) — 排查手冊
