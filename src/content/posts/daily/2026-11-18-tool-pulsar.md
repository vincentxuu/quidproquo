---
title: "工具推薦｜pulsar — 讓不同 harness 的 AI agent 互相傳訊息"
date: 2026-11-18
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "pulsar 是一個 MCP server，讓 Claude Code、Codex、OpenCode、Cursor、Gemini CLI 等不同 harness 的 agent 互相看到彼此、傳訊息、甚至叫醒閒置中的 session"
tldr: "pulsar 是一個 MCP server，讓同一台機器上不同 harness（Claude Code、Codex、OpenCode、pi、omp、Cursor、Gemini CLI）的 agent 互相看到、傳訊息、request/reply。安裝：npx pulsar setup。解決了跨 harness 的 agent 完全看不到彼此、無法協作的問題。"
series:
  name: "AI Tool of the Day"
  order: 82
---

> 🌏 [English version](/posts/daily/2026-11-18-tool-pulsar-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | pulsar |
| 類型 | MCP server |
| GitHub | [yocontra/pulsar](https://github.com/yocontra/pulsar) |
| Stars | 32（查核時；repo 建立於 2026-11-17） |
| 語言 | TypeScript |
| 授權 | MIT |
| 安裝 | `npx pulsar setup` |

## 解決什麼問題

你有沒有同時開著 Claude Code、Codex、Cursor 幾個視窗處理同一個 repo，但它們彼此完全不知道對方存在？一個 session 在改 auth 模組，另一個 session 同時在改同一支檔案，直到 push 衝突才發現撞車；想叫某個 agent「先別動 main，等我 tag 完 release」，只能自己切過去那個視窗手動打字,因為 agent 之間沒有任何管道互相通知。

Claude Code 本身有 `SendMessage` 可以叫醒同一個 harness 裡的其他 session，但只認 Claude。pulsar 把這件事做成跨 harness 的版本：一個常駐在本機的 daemon，維護機器上所有存活 agent 的名單（不管跑在 Claude Code、Codex、OpenCode、pi、omp、Cursor 還是 Gemini CLI），每個 agent 自動帶上 `harness`、`model`、`project`、`branch`、`pr` 等標籤，也可以自己加 `role:reviewer` 這種標籤。訊息可以指定名字、用 selector（`project=apparish`、`pr=1402`）找一群、或用 `*` 廣播給全部，而且是 push 不是 polling——一則 `urgent` 訊息可以直接插進某個閒置 agent 的下一輪對話，把它叫醒。

適合場景：同一台機器上跑多個 coding agent 協作同一個 repo、需要 agent 之間互相 review 或交接、或是想把「等另一個 agent 做完再繼續」從手動輪詢變成真正的事件通知。

```diagram
title: pulsar 如何讓不同 harness 的 agent 互相看到彼此
desc: Claude Code、Codex／OpenCode 等支援 push 的 harness,以及 Cursor／Gemini CLI 這類只能被動拉取的 client,都透過 MCP 連到同一台機器上的 pulsar daemon;daemon 統一維護名單、推送訊息,並把訊息寫進本機 SQLite 紀錄。
caption: 簡化示意:省略跨機器通訊與 Tailscale 遠端控制（README 列為尚未支援）。
---
<svg viewBox="0 0 640 400">
  <rect class="dg-zone" x="20" y="16" width="600" height="358" rx="8"/>
  <text class="dg-tag" x="36" y="38" dominant-baseline="central">本機（同一使用者）</text>

  <path class="dg-line" d="M230 86H400" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M230 176H400" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M230 266H400" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M490 282V302" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="40" y="54" width="190" height="64" rx="6"/>
  <text class="dg-label" x="135" y="77" text-anchor="middle" dominant-baseline="central">Claude Code</text>
  <text class="dg-sub" x="135" y="97" text-anchor="middle" dominant-baseline="central">push，可叫醒閒置</text>

  <rect class="dg-box" x="40" y="144" width="190" height="64" rx="6"/>
  <text class="dg-label" x="135" y="167" text-anchor="middle" dominant-baseline="central">Codex／OpenCode</text>
  <text class="dg-sub" x="135" y="187" text-anchor="middle" dominant-baseline="central">及 pi、omp</text>

  <rect class="dg-box dg-box--ghost" x="40" y="234" width="190" height="64" rx="6"/>
  <text class="dg-label" x="135" y="257" text-anchor="middle" dominant-baseline="central">Cursor／Gemini CLI</text>
  <text class="dg-sub" x="135" y="277" text-anchor="middle" dominant-baseline="central">僅 inbox，無 push</text>

  <rect class="dg-box dg-box--accent" x="400" y="70" width="180" height="212" rx="6"/>
  <text class="dg-label" x="490" y="167" text-anchor="middle" dominant-baseline="central">pulsar daemon</text>
  <text class="dg-sub" x="490" y="187" text-anchor="middle" dominant-baseline="central">名單 + 訊息匯流排</text>

  <rect class="dg-box dg-box--store" x="400" y="302" width="180" height="56" rx="6"/>
  <text class="dg-label" x="490" y="330" text-anchor="middle" dominant-baseline="central">SQLite 訊息紀錄</text>

  <text class="dg-edge" x="315" y="164" text-anchor="middle" dominant-baseline="central">push</text>
  <text class="dg-edge" x="315" y="254" text-anchor="middle" dominant-baseline="central">拉取</text>
</svg>
```

## 快速上手

### 安裝

```bash
npx pulsar setup
```

Setup 會先偵測機器上裝了哪些 agent harness，列出會改哪些檔案再詢問一次，每個被改的檔案都先備份。也可以指定只裝給某幾個 harness：

```bash
npx pulsar setup --client claude,codex --dry-run   # 先看計畫，不動手
npx pulsar setup --yes --all-detected               # 腳本用，不問問題
```

沒有 Node 環境：

```bash
curl -fsSL https://raw.githubusercontent.com/yocontra/pulsar/main/install.sh | bash
```

### 基本用法

```
> list agents on apparish

3 agents (project=apparish):
- apparish-auth   · [claude] · branch=main · busy · push · tags=workstream:auth
- codex@apparish  · [codex]  · branch=feat/billing · idle · push
- omp@apparish    · [omp]    · branch=main · idle · push

> tell everyone on apparish that main is frozen until the release is tagged

Sent m_mwk3jlo0 to 3 agents:
- apparish-auth: sent via claude-socket
- codex@apparish: sent via codex-queue
- omp@apparish: delivered via extension
```

Agent 自動獲得 `list_agents`、`send`、`reply`、`ask`（送出後直接等第一個回覆）、`wait`（等訊息、等某個回覆、或等某個 agent 轉閒置）、`inbox`、`set_identity`、`whoami` 這些 MCP 工具，CLI 則對應 `pulsar ls`、`pulsar send`、`pulsar inbox`、`pulsar tail`（即時看全部加入/離開/訊息）。

### 進階用法

```bash
# 用 selector 一次問一群 agent，並等回覆
pulsar send project=apparish --expect-reply "who owns the auth migration?"

# doctor：檢查 daemon 和每個 harness 的串接狀況
pulsar doctor
```

每個 agent 也能自己設定 `inbound` 政策（接受／保留／拒絕訊息），訊息內容一律標成「來自某個 peer agent」而不是「使用者」，不能用來核可任何操作——這條界線在 README 裡寫得很清楚。

## 與現有工具的比較

| | pulsar | Claude Code 內建 `SendMessage` | 手動切視窗通知 |
|---|---|---|---|
| 跨 harness（Codex、OpenCode、Cursor…） | ✅ | ❌（限 Claude） | ✅（但要人工） |
| 用 tag/selector 找一群 agent | ✅ | ❌ | ❌ |
| 廣播給全部 agent（`*`） | ✅ | ❌ | ❌ |
| push 叫醒閒置 agent | ✅ | ✅ | ❌ |
| 等回覆（`ask`/`wait`） | ✅ | ❌ | ❌ |
| 跨機器 | ❌（v1 僅限單機，README 預告 Tailscale 支援在路上） | ✅（Remote Control） | — |

## 注意事項

- **目前只限單機**：README 明寫多機通訊和透過 Tailscale 遠端控制是「coming soon」，現在只能協調同一台機器上的 agent。
- **信任邊界是作業系統使用者，不是 agent 身份**：daemon 用 Unix socket（`0700` 權限）辨識發送者，任何用你身份跑的程序都算可信——這跟你信任自己機器上的檔案是同一個等級的信任假設,不是額外的沙箱。
- **訊息來自 peer，不是操作者**：pulsar 自己強調送進來的訊息不能核准任何東西，但這仍然是訊息注入的管道之一，上限是 64KB／則、每個 agent 每分鐘 60 則、廣播每分鐘 6 次、inbox 最多 50 則未讀——拿去接外部或不受信的輸入前,先想清楚這條邊界。
- **沒有推送路徑的 harness 只能等 inbox**：目前只有 Claude Code、Codex、OpenCode、pi、omp 支援「叫醒閒置中的 agent」；接上其他 MCP client 的話,訊息會留在 inbox,靠下次呼叫任何 pulsar 工具時的「N 則未讀」提示才會被看到。

## 今日收穫

多 agent 協作最常卡住的地方,往往不是模型能力,而是「agent 之間沒有管道知道彼此在幹什麼」——結果變成人要在好幾個視窗之間手動傳話。pulsar 把這件事收斂成一個很窄的介面:一個機器範圍的名單 + 一條訊息匯流排,而且刻意不碰「怎麼分工」這個更複雜的問題,只解決「怎麼讓它們互相聽到」。跨 harness 這個設計選擇也值得注意:它沒有假設你會把所有 agent 工作都搬到同一個 harness,而是承認現實中一個人常常同時開著好幾種工具。

## 參考資料

- [yocontra/pulsar — GitHub](https://github.com/yocontra/pulsar)
- [pulsar README（原始檔）](https://raw.githubusercontent.com/yocontra/pulsar/main/README.md)
- [pulsar — package.json](https://raw.githubusercontent.com/yocontra/pulsar/main/package.json)
- [pulsar — npm](https://www.npmjs.com/package/pulsar)
- [Model Context Protocol 官方文件](https://modelcontextprotocol.io)
