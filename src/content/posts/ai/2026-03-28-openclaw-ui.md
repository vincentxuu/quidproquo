---
title: "OpenClaw UI：新增的側欄可以問「這個 session 在幹嘛」而不打斷它"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, control-ui, webchat, tui, pairing, session-observer]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 30
tldr: "Control UI 加了一條 session rail：它用 utility model 產生執行摘要，還附一個唯讀的伴讀 thread，讓你問「這個 session 現在怎樣」而不會進入或打斷主 agent 執行。它的內容不會進入 chat.history。"
description: "OpenClaw Control UI 的現況：session rail 與伴讀 thread、認證與裝置配對的兩道關卡、遺失 gateway token 的復原路徑，以及權限升級不會靜默重連的設計。"
draft: false
---

Control UI 是 Gateway 提供的一個小型 **Vite + Lit** 單頁應用，預設在 `http://<host>:18789/`，**直接對同一個埠上的 Gateway WebSocket 說話**。

這篇挑兩件事講：**新加的 session rail**，以及**進得去這個介面所需的兩道關卡**。

## Session rail：不打斷地問「現在怎樣」

這是 3 月之後最有意思的新東西。

你看著一個執行中的 session 時，Gateway 會**立刻**把模型最新的安全前言當成 session 標題顯示。有 utility model 可用時，累積夠多活動之後它可以**用更豐富的精簡狀態摘要取代那個標題**。

聊天介面用一條 **session rail** 承載結果：精簡的藥丸顯示即時摘要，展開後顯示**評估、計畫進度、pull request、經過時間，以及一個唯讀的伴讀 thread**。

幾個行為細節：rail 在執行卡住或需要輸入時**可以自己展開一次**；完成或失敗的執行會保留一個基於最終摘要的「finished」時間戳；寬版面下展開的 rail 停靠成 400px 的右欄，窄版與行動版則是覆蓋層。

### 伴讀的邊界寫得很清楚

伴讀回答關於選定 session 與其專案的問題，**而不會進入或打斷主 agent 執行**。這段的設計值得逐條看：

- 第一次提問時，Gateway **惰性載入選定 session 的有界可見快照**，才啟動 utility model
- 歷史暫時不可用時，**問題會保持可見並附 Retry**，而不是被當成空 session
- 伴讀對目標 session 的歷史／搜尋與 agent workspace **只有唯讀存取**
- 它有界的 thread **保存在 Gateway 記憶體裡**，切換 session 時會還原，並由 rail 的垃圾桶按鈕、session 重置、Gateway 重啟或閒置到期清除
- **它永遠不會進入 `chat.history`**，而且私有的參考脈絡不會被當成操作者對話儲存

在主輸入框打 `/btw <問題>` 或 `/side <問題>` 就會打開 rail 並在那裡問。反白訊息裡的文字則會提供 **More details**（立刻問伴讀）與 **Ask in side chat**（打開 rail 並帶一份可編輯的引用草稿）。

**Session 觀察預設是開的。** 安全前言標題**不需要** utility model，utility model 只負責更豐富的評估與終端摘要。要關掉或調整，去 **Settings → Appearance → Sidebar**，那裡也能檢視解析出來的小模型與它的來源；對應的設定鍵是 `gateway.controlUi.sessionObserver: false` 與 `agents.defaults.utilityModel: ""`。

這條 rail 解決的問題其實很普遍：**長時間執行的 agent 讓你不知道它在幹嘛，而唯一的查看方式是打斷它。** 用一個唯讀的伴讀繞開這個兩難，是很值得學的介面設計。

## 兩道關卡：先認證，再配對

進 Control UI 要過兩關，而且順序是固定的：**Gateway 認證跑在裝置配對之前。**

**第一關：Gateway 認證。** 透過 WebSocket 握手提供：`connect.params.auth.token`、`connect.params.auth.password`、Tailscale Serve 的身分標頭（需 `gateway.auth.allowTailscale: true`），或 trusted-proxy 的身分標頭。

**一條要記住的**：**直接的 loopback 連線不會繞過 token 或 password 認證。** 儀表板設定面板會為當前瀏覽器分頁與選定的 gateway URL 保留一個 token，**密碼則不會被保存**。

**第二關：裝置配對。** 從新的瀏覽器或裝置連線通常需要一次性的配對核准，症狀是 `disconnected (1008): pairing required`。

```bash
openclaw devices list
openclaw devices approve <requestId>
```

在 Gateway 主機上，**`openclaw dashboard` 是建議的擁有者路徑**：它開一個**短效、單次使用的配對連結**，並讓那個確切的簽章瀏覽器拿到耐久的管理員憑證。在同一個瀏覽器裡開新連結也能修復先前受限的憑證，而**另一個瀏覽器 profile 無法繼承或重放這份授權**。

## 遺失 token 的復原路徑

這個情境很容易遇到，而且沒讀過文件會卡住：

**如果 Gateway 在 token 模式下啟動但沒有設定 token，它會為那個程序產生一個臨時的執行期 token。而那個執行期 token 不會被寫進設定，所以無法復原**——結果就是連 loopback 的瀏覽器也會被拒絕。

復原步驟：

```bash
openclaw doctor --generate-gateway-token
# 重啟 Gateway
openclaw gateway auth-token --show   # 在互動式終端機裡
# 把輸出貼進 Control UI 設定
```

## 權限升級不會靜默發生

這條設計很值得標出來：

> 把一個**已配對**的瀏覽器從唯讀存取換成寫入／管理員存取，若走的是一般的已儲存或共享憑證，**會被當成一次核准升級，不是靜默重連**：OpenClaw **保留舊的核准、擋下更寬的重連，並要求你明確核准新的範圍集合。**

唯一的窄例外是**在 Gateway 主機上由 `openclaw dashboard` 或圖形化 onboarding 發出的全新擁有者交接**——而且它**只能升級兌換那次一次性交接的同一個簽章瀏覽器**。

連線中的 Control UI 回報存取受限時，可以在存取橫幅點 **Request admin**；橫幅也能收合成一個持續存在的 **Limited access** 標籤。

「擴權必須重新核准」是很基本的原則，但實務上很多系統會為了體驗把它做成靜默升級。這裡選了另一邊。

## 其他介面

**WebChat** 沒有獨立的 HTTP 埠，SwiftUI 的聊天介面直接連 Gateway WebSocket。遠端情境下走跟其他客戶端同一條 SSH／Tailscale 通道。

**TUI** 是終端機的互動介面，**Canvas host** 則由 Gateway 的 HTTP 伺服器在同一個埠上提供（`/__openclaw__/canvas/` 給 agent 可編輯的 HTML/CSS/JS、`/__openclaw__/a2ui/` 給 A2UI host）。

## 一個 Windows 專屬的排查點

**原生 Windows 的 LAN 綁定上，即使 `127.0.0.1` 在 Gateway 主機上可用，Windows 防火牆或組織管理的群組原則仍可能擋掉廣告出來的 LAN URL。**

在 Windows 主機上跑 `openclaw gateway status --deep`，它會回報可能被擋的埠、profile 不符，以及**原則可能忽略的本地防火牆規則**。

## 整體來說

Control UI 這一輪最值得看的是那條 session rail——它把「觀察一個執行中的 agent」從「打斷它」變成「問旁邊那個唯讀的伴讀」，而且明確保證那些問答不會污染主對話的歷史。

至於進入這個介面，記住兩件事就好：**認證與配對是兩道獨立的關卡（loopback 不豁免認證）**，以及**擴權一定要重新核准，不會靜默發生**。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。新增：**session rail 與唯讀伴讀 thread**（安全前言即時標題、utility model 產生的摘要、`/btw` 與 `/side` 入口、反白文字的 More details 與 Ask in side chat、伴讀只讀且不進入 `chat.history`、由 Gateway 記憶體保存與清除時機、`gateway.controlUi.sessionObserver` 與 `utilityModel` 的關閉方式）、**認證與裝置配對是兩道獨立關卡且 loopback 不豁免認證**、`openclaw dashboard` 的短效單次配對連結與不可跨瀏覽器重放、**遺失 gateway token 的完整復原路徑**（臨時執行期 token 不寫入設定故無法復原）、**權限升級被當成核准升級而非靜默重連**與擁有者交接的窄例外、Canvas host 的路徑，以及原生 Windows LAN 綁定被防火牆或群組原則擋住時的 `gateway status --deep` 診斷。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Control UI](https://docs.openclaw.ai/web/control-ui) — session rail、認證、配對與存取升級
- [WebChat](https://docs.openclaw.ai/web/webchat)、[TUI](https://docs.openclaw.ai/web/tui) — 其他介面
- [Gateway architecture](https://docs.openclaw.ai/concepts/architecture) — Canvas host 與協定
- [Node pairing](https://docs.openclaw.ai/gateway/pairing) — 配對生命週期
- [Windows](https://docs.openclaw.ai/platforms/windows) — LAN 綁定的防火牆排查
