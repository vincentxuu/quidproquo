---
title: "工具推薦｜terminal-mcp — 讓 Agent 看到的是螢幕畫面，不是命令輸出"
date: 2026-09-26
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "MCP server 用完整 VT100/ANSI 終端機模擬把真實 PTY 曝露給 AI 助理，讓 Agent 能操作 vim、htop 這類全螢幕互動式程式，並支援畫面截圖與 session 錄影回放"
tldr: "terminal-mcp 是一個把真實終端機（PTY + 完整 xterm.js 模擬）曝露成 MCP server 的工具，讓 Agent 能像人一樣操作互動式 CLI 和全螢幕 TUI 程式。安裝：npm install -g @ellery/terminal-mcp。解決了一般 shell exec 工具遇到互動式提示或全螢幕重繪畫面就卡住或讀不懂的問題。"
series:
  name: "AI Tool of the Day"
  order: 37
---

> 🌏 [English version](/en/posts/daily/2026-09-26-tool-terminal-mcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | terminal-mcp |
| 類型 | MCP server |
| GitHub | [elleryfamilia/terminal-mcp](https://github.com/elleryfamilia/terminal-mcp) |
| Stars | 140 |
| 語言 | TypeScript |
| 授權 | MIT |
| 安裝 | `npm install -g @ellery/terminal-mcp` |

## 解決什麼問題

大部分 Agent 用來跑指令的工具，本質上是「丟一個字串進去、等 process 結束、把 stdout 撈回來」的一次性 exec。這在跑 `npm install`、`git status` 這類會結束的指令時沒問題，但一遇到互動式流程就卡住：`docker exec -it` 進容器、`git rebase -i` 開編輯器、套件安裝過程跳出 `y/N` 確認、`ssh` 要求輸入密碼，或是要看 `htop`、`vim`、`less` 這類全螢幕重繪畫面的程式，Agent 拿到的往往是一堆夾雜 ANSI escape code 的亂碼，或者乾脆等到逾時，因為它送出指令後不知道該不該等、等多久、畫面現在長什麼樣子。

terminal-mcp 的做法是不把終端機當管道，而是把它當畫面。它用 `node-pty` 起一個真實的偽終端機（macOS／Linux／Windows 皆可，Windows 走 ConPTY），再用 `@xterm/headless` 做完整的 VT100/ANSI 終端機模擬——也就是說它會像真正的終端機一樣追蹤游標位置、處理畫面重繪、記住目前螢幕上每個字元格的顏色與樣式。Agent 拿到的不是一串位元組，而是 `getContent`（純文字緩衝區）、`takeScreenshot`（可以是還原 ANSI 顏色的 JSON，也可以是真的 PNG 圖片）這種「螢幕現在長怎樣」的快照，`type` 送文字、`sendKey` 送 `Ctrl+C`、`ArrowUp`、`Enter` 這類特殊鍵，跟人操作終端機的方式一致。它支援跑多個獨立 session（預設上限 5 個，各自用 `sessionId` 定址），也能把整個 session 錄成 asciicast 格式，事後用 `asciinema play` 回放——這對稽核「Agent 到底在這台機器上做了什麼」或錄一段除錯過程當範例很有用。

適合場景：Agent 需要除錯或驅動全螢幕 TUI 程式（`vim`、`htop`、`k9s`）；CI/CD 或容器裡沒有 TTY，但流程中會跳出互動式提示需要應答；想錄下 Agent 操作終端機的完整過程供回放或稽核；一個 Agent 要同時盯著一個長跑的 build 和另一邊跑診斷指令，需要兩個互不干擾的 shell。

## 快速上手

### 安裝

```bash
# 全域安裝
npm install -g @ellery/terminal-mcp

# 或用安裝腳本
curl -fsSL https://raw.githubusercontent.com/elleryfamilia/terminal-mcp/main/install.sh | bash

# 自動偵測機器上裝了哪些 MCP client（Claude Code、Codex、Gemini CLI 等）並寫入設定
terminal-mcp setup --dry-run   # 先預覽
terminal-mcp setup             # 實際寫入
```

### 基本用法

```json
// .mcp.json — headless 模式：單一 process，內建 PTY，不需要 TTY，CI/容器都能用
{
  "mcpServers": {
    "terminal": {
      "command": "terminal-mcp",
      "args": ["--headless", "--cols", "120", "--rows", "40"]
    }
  }
}
```

```jsonc
// Agent 實際會呼叫的三個核心工具
{ "name": "type", "arguments": { "text": "htop" } }
{ "name": "sendKey", "arguments": { "key": "Enter" } }
{ "name": "takeScreenshot", "arguments": { "format": "text" } }
// 回傳含純文字內容、游標位置與終端機尺寸——Agent 讀到的就是畫面，不是原始輸出流
```

### 進階用法

```bash
# 開啟沙箱模式，限制這個 PTY 能碰到的檔案系統與網路範圍
terminal-mcp --sandbox --sandbox-config ~/.terminal-mcp-sandbox.json
```

```json
{
  "filesystem": {
    "readWrite": [".", "/tmp", "~/.cache"],
    "readOnly": ["~"],
    "blocked": ["~/.ssh", "~/.aws", "~/.gnupg"]
  },
  "network": { "mode": "all" }
}
```

## 與現有工具的比較

| | terminal-mcp | mcp-tty | iterm-mcp |
|---|---|---|---|
| 全螢幕 TUI 正確渲染（vim／htop） | ✅ 完整 VT100 模擬 | ❌ README 明講 ANSI 被剝除，全螢幕程式讀不出來 | 依賴實際 iTerm 視窗，非獨立模擬 |
| 跨平台 | ✅ macOS／Linux／Windows | ✅ macOS／Linux／Windows | ❌ 僅 macOS，且需另裝 iTerm2 |
| 無 TTY 的 headless/CI 場景 | ✅ `--headless` 單 process | ✅ | ❌ 需要真的有 iTerm2 App 在跑 |
| 多重獨立 session | ✅ 最多 5 個，`createSession`/`destroySession` | ✅ named session | ❌ 驅動的是你當下唯一的 iTerm 分頁 |
| 畫面截圖（PNG） | ✅ | ❌ | ❌ |
| Session 錄影回放（asciicast） | ✅ | ❌ | ❌ |
| 沙箱限制檔案系統／網路 | ✅ macOS Seatbelt／Linux bubblewrap | ❌ | ❌ |

## 注意事項

- **模式要選對**：預設是「互動＋client」雙 process 架構，需要一個真的 TTY 讓人先開著；CI、容器、遠端自動化這種沒有 TTY 的場景要明確加 `--headless`，否則會卡在等待 socket。
- **PNG 截圖需要額外依賴**：`takeScreenshot` 的 `png` 格式要求安裝 `@resvg/resvg-js`，預設不會自動帶入，沒裝會在呼叫時才發現失敗。
- **沙箱在 Windows 上只是優雅降級**：README 明講 Windows 沒有 Seatbelt／bubblewrap 對應機制，`--sandbox` 在 Windows 上會直接跑在無沙箱狀態，不要誤以為三個平台的隔離強度一致。
- **個人維護的專案**：140 星、15 fork，不是官方 Anthropic 專案，由單一維護者（elleryfamilia）持續開發，導入前留意後續版本節奏與 issue 回應速度。

## 今日收穫

多數「Agent 操作終端機」的工具解的是「怎麼把指令送進去、把輸出撈出來」，本質上還是把終端機當一條管道。terminal-mcp 反過來把終端機模擬做到完整——游標位置、畫面重繪、色彩屬性通通還原——讓 Agent 看到的是「螢幕現在長什麼樣」而不是「這個 process 印了什麼字」。這個差異平常感覺不出來，但只要 Agent 要除錯一個全螢幕 TUI 程式或應答互動式提示，兩者的可用性差距就會立刻顯現：線性文字流沒辦法表達游標移到哪、哪一行被重畫過，而畫面快照可以。

## 參考資料

- [elleryfamilia/terminal-mcp — GitHub](https://github.com/elleryfamilia/terminal-mcp)
- [terminal-mcp GitHub API metadata（license／stars／建立時間）](https://api.github.com/repos/elleryfamilia/terminal-mcp)
- [7ez/mcp-tty — GitHub](https://github.com/7ez/mcp-tty)
- [ferrislucas/iterm-mcp — GitHub](https://github.com/ferrislucas/iterm-mcp)
