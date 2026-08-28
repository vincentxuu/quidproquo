---
title: "Claude Code Channels 怎麼運作：外部事件、reply tools 與 sender gating"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, channels, mcp, webhook]
lang: zh-TW
tldr: "Channels 是一種特殊的 MCP server，能把 CI 失敗、監控告警、Telegram 訊息這類外部事件直接推進正在跑的 Claude Code session，Claude 讀完事件還能透過 reply tool 從同一條通道回話。本文拆解 channel contract、雙向回覆、安全閘門與安裝需求。"
description: "深入介紹 Claude Code Channels：MCP server 如何宣告 channel capability、推送 notification events、讓 Claude 回話，以及 sender gating 和 permission relay 的安全設計。"
draft: false
series:
  name: "Claude Code 深入介紹"
  order: 21
---

> 🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-channels-guide-en)

這是「Claude Code 深入介紹」系列的[自動化篇之一](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)。系列前面講過 hooks 是在 agentic loop 的特定時點插你的腳本——但那些時點全是 loop 內建的事件。如果你人在外面，而 loop 外的世界發生了事：CI 掛了、監控系統跳告警、你在手機上想到一個新指示，Claude 都不會知道。Channels 補的就是這一塊。

## Channels 解決什麼問題

依官方文件的定義：

> A channel is an MCP server that pushes events into your running Claude Code session, so Claude can react to things that happen while you're not at the terminal.

關鍵字是「push」。一般 MCP server 是被動的：Claude 做任務時主動去查它。Channel 反過來——外部系統發生事件的瞬間，訊息就被推進你**已經開著的那個 session**，Claude 在下一輪就會讀到並行動。事件以 `<channel>` 標籤的形式進到 Claude 的 context，例如：

```text
<channel source="webhook" path="/" method="POST">build failed on main</channel>
```

要注意的是，事件只在 session 開著的時候會送達。要做成全天候接收，得讓 Claude Code 跑在背景程序或常駐終端機裡。

## 跟 hooks、MCP 有什麼不同

三者都在擴充 session，但方向不一樣：

| 功能 | 事件來源 | 方向 |
|------|----------|------|
| [Hooks](/posts/tech/deep-dive/2026-03-27-claude-code-hooks-guide) | agentic loop 內建事件 | loop 內部觸發你的腳本 |
| [MCP server](/posts/tech/deep-dive/2026-03-28-claude-code-mcp-server-integration) | Claude 主動查詢 | Claude 拉 |
| **Channels** | 外部系統 | 外部推進 session |

一句話區分：hooks 處理的是 loop 自己會產生的事件，channels 處理的是 loop 之外、你之外的世界主動找上門的事件。跟 Claude Code on the web 或 Claude in Slack 也不同——那些是開一個新的雲端 session，channels 是把事件送進你本地已經開著、已經載入專案檔案和對話記憶的 session。

## Channel contract：capability 宣告與 notification events

一個 channel 就是一般的 MCP server 加上三件事：

1. 在 Server constructor 的 capabilities 裡宣告 `claude/channel`——Claude Code 看到這個 key 才會把通知監聽器掛上來。
2. 用 `notifications/claude/channel` 方法推事件，`content` 是內文，`meta` 的每個 key 變成 `<channel>` 標籤的屬性。
3. 走 stdio transport——Claude Code 把它當子程序啟動。

最小的一個 channel server 大概長這樣：

```ts
const mcp = new Server(
  { name: 'webhook', version: '0.0.1' },
  {
    capabilities: { experimental: { 'claude/channel': {} } },
    instructions: 'Events arrive as <channel source="webhook" ...>. One-way: read them and act.',
  },
)
await mcp.connect(new StdioServerTransport())

Bun.serve({
  port: 8788,
  hostname: '127.0.0.1',
  async fetch(req) {
    await mcp.notification({
      method: 'notifications/claude/channel',
      params: { content: await req.text(), meta: { path: new URL(req.url).pathname, method: req.method } },
    })
    return new Response('ok')
  },
})
```

`instructions` 字串會進 Claude 的 system prompt，告訴它事件長什麼樣、要不要回、怎麼回。官方文件也提醒了一個容易踩的坑：光出現在 `.mcp.json` 不夠，server 必須再被 `--channels` flag 點名才會真的收得到訊息。

## 讓 Claude 回話：reply tools

只推不回的是單向 channel（警報轉發器）。要做聊天橋接器，就再加一個標準 MCP tool：capabilities 加 `tools: {}`，用 `setRequestHandler` 註冊一個 `reply` 工具，Claude 收完事件想回話時呼叫它，由 server 把文字 POST 回聊天平台。工具註冊本身沒有任何 channel 專屬的東西，就是[一般的 MCP tool](https://modelcontextprotocol.io/docs/concepts/tools)。

有個使用上的細節：Claude 透過 channel 回話時，你的終端機只顯示工具呼叫和「sent」確認，實際回覆內容出現在另一頭的平台。

## 安全設計：sender gating 與 permission relay

沒有閘門的 channel 就是 prompt injection 的入口——任何碰得到端點的人都能塞文字給 Claude。所以 contract 要求 server 在發 notification 前先比對 **sender allowlist**，而且要比對「傳訊者本人」的身分，不是聊天室身分：在群組裡 gate 房間的話，群裡任何人都能注入。

Telegram 和 Discord 用配對碼 bootstrap 白名單：你私訊 bot，bot 回配對碼，在 session 裡核可後你的帳號才進名單，之後其他人一律靜默丟棄。iMessage 不一樣，自己傳訊息給自己自動放行，其他聯絡人用 handle 一個個加。

第二層是 **permission relay**：Claude 要跑需要核可的工具時，session 會停在終端機的對話框等答案。宣告了 `claude/channel/permission` capability 的雙向 channel 可以把同一個提示轉發到你手機，遠端回 `yes <id>` 就放行。兩邊同時活著，先到的答案生效。因為「能透過 channel 回話的人」等於「能核准工具的人」，官方明講：只有驗證過 sender 的 channel 才該宣告這個 capability。

企業還有一層總開關：claude.ai Team／Enterprise 預設封鎖，要 Owner 在管理設定打開 `channelsEnabled`，還能用 `allowedChannelPlugins` 限定哪些 channel plugins 可用。Console API key 認證預設允許；但如果組織部署了 managed settings，就同樣要明確設定。Pro／Max 使用者不受組織閘門影響，每個 session 用 `--channels` 自行選擇開啟。

## 安裝：channel plugins 需要 Bun

Research preview 隨附 Telegram、Discord、iMessage 三個官方 channel plugins，外加一個跑在本機瀏覽器的 fakechat demo。每個 plugin 都是 Bun script，所以要先裝 [Bun](https://bun.sh)。流程以 Telegram 為例：

```
/plugin install telegram@claude-plugins-official
/telegram:configure <token>
```

退出後用 `claude --channels plugin:telegram@claude-plugins-official` 重啟，完成配對即通。

自己寫 channel 的話 runtime 不受限——硬性需求只有 MCP SDK 和 Node 相容環境，Bun、Node、Deno 都行；自製 channel 測試時要走 `--dangerously-load-development-channels` 開發旗標繞過 allowlist，但這個旗標不會繞過 `channelsEnabled` 這類組織政策。

## 典型場景

- **CI 結果轉發**：build 掛了，webhook 直接推進 session，Claude 已經開著你的 repo，當下就能查 log、改 code、重跑測試。
- **手機聊天橋接**：從 Telegram 問 Claude 問題，它在你的機器上、對你的真實檔案操作，答案回到同一個聊天視窗。
- **監控事件**：error tracker 或 deploy pipeline 的事件推進來，單向 channel 即可——Claude 讀了採取行動，不需要回話。

Channels 目前是 research preview，flag 語法和 protocol contract 都可能變。但「讓外部世界找到正在跑的 agent」這個位置，在整個自動化拼圖裡是排程（定時拉）和 Remote Control（你自己推）都補不上的一塊。

## 參考資料

- [Push events into a running session with channels — Claude Code Docs](https://code.claude.com/docs/en/channels.md) — Channels 定位、Telegram／Discord／iMessage 安裝流程、安全與 Enterprise 控制、與其他整合方式的比較
- [Channels reference — Claude Code Docs](https://code.claude.com/docs/en/channels-reference.md) — channel contract 完整規格：capability declaration、notification 格式、reply tools、sender gating、permission relay，含完整 webhook receiver 範例

## 更新紀錄

- 2026-08-29：校正 Console／Team／Enterprise 的 channels 預設行為，並補上自製 channel 開發旗標的 org policy 限制。
- 2026-08-26：初版，依 code.claude.com 官方文件撰寫（research preview 現狀）。
