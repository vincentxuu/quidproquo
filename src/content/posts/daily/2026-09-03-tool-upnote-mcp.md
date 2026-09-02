---
title: "工具推薦｜upnote-mcp — 讓 Claude 直接讀寫本機 UpNote 筆記，不用雲端不用 API key"
date: 2026-09-03
category: daily
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "MCP server 讓 Claude 直接讀寫桌面筆記軟體 UpNote 的本機資料庫，靠逆向工程 WAL 快照解決讀取正確性，寫入則透過官方 URL scheme，全程不碰雲端、不用 API key"
tldr: "upnote-mcp 是一個開源 MCP server，讓 Claude 讀取並新增 UpNote 筆記。安裝：clone repo 後 `npm install`。解決了筆記軟體沒有官方自動化 API、又不想把筆記資料丟上雲端的問題。"
series:
  name: "AI Tool of the Day"
  order: 19
---

> 🌏 [English version](/en/posts/daily/2026-09-03-tool-upnote-mcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | upnote-mcp |
| 類型 | MCP server（本機讀寫 UpNote 筆記，無雲端、無 API key） |
| GitHub | [ahmedco88/upnote-mcp](https://github.com/ahmedco88/upnote-mcp) |
| Stars | 1 |
| 語言 | JavaScript |
| 授權 | MIT |
| 安裝 | `git clone https://github.com/ahmedco88/upnote-mcp.git && cd upnote-mcp && npm install` |

## 解決什麼問題

你是否想過讓 Claude 直接把對話結論存進你平常在用的筆記軟體，結果發現多數筆記工具要嘛得開帳號連雲端才有自動化介面，要嘛乾脆沒有任何 API？UpNote 是一款主打本機優先、跨裝置同步的桌面筆記 App，官方自動化只給了「新增筆記」「新增筆記本」兩個 URL scheme，沒有官方 API、沒有 SDK，想讀取既有筆記內容更是完全沒有管道。

upnote-mcp 靠逆向工程解決了讀的問題：UpNote 用 SQLite 的 WAL（Write-Ahead Log）模式存資料，最新的筆記其實還沒寫回主檔案、而是留在 `-wal` 檔裡，單獨複製 `upnote.sqlite3` 拿到的會是過期快照。這個 server 把主檔和 `-wal`、`-shm` 三個檔案一起複製到暫存資料夾，用讀寫模式打開複製品讓 SQLite 自己重播 WAL，才能保證讀到的是最新內容；它也發現「筆記本裡有哪些筆記」這個關聯根本不在看起來合理的欄位裡，而是藏在一張 `lists` 表、用 `notebooks_<id>` 當 key 存一組 JSON note id 陣列。寫入則完全不碰資料庫本身——透過 UpNote 自己的 `upnote://` URL scheme 呼叫，等於是「請 UpNote 自己動手寫」，讀取路徑因此不可能把你的筆記寫壞。

適合場景：你已經在用 UpNote 記筆記，想請 Claude 把工作階段的重點、待辦、程式片段直接存進去，或反過來要 Claude 搜尋、摘要某個筆記本的內容，同時不想為此開一個雲端帳號或串一個要打 API key 的服務。

## 快速上手

### 安裝

```bash
git clone https://github.com/ahmedco88/upnote-mcp.git
cd upnote-mcp
npm install
```

接著在 MCP client 設定檔（如 `~/.claude.json` 或 Claude Desktop 的 `claude_desktop_config.json`）加入：

```json
{
  "mcpServers": {
    "upnote": {
      "command": "node",
      "args": ["/full/path/to/upnote-mcp/server.mjs"]
    }
  }
}
```

### 基本用法

Agent 會拿到讀寫兩類工具：`upnote_create_note`、`upnote_create_notebook`（寫）、`upnote_list_notebooks`、`upnote_list_notes`、`upnote_search_notes`、`upnote_get_note`、`upnote_recent_notes`、`upnote_list_tags`（讀）。

```
你：把這段對話的結論存到 UpNote，存進 "Claude Notes" 筆記本
你：幫我搜尋筆記裡跟 sourdough 有關的內容
你：摘要一下我的 Travel 筆記本
```

Claude 會自動選用對應工具——不需要你手動指定要呼叫哪一個。

### 進階用法

```json
"env": {
  "UPNOTE_DEFAULT_NOTEBOOK": "My Inbox",
  "UPNOTE_SNAPSHOT_DIR": "/private/only/you/can/read"
}
```

`UPNOTE_DEFAULT_NOTEBOOK` 改掉新筆記沒指定筆記本時的預設落點；`UPNOTE_SNAPSHOT_DIR` 把讀取快照搬離系統暫存資料夾預設路徑——共用機器上這個設定不是選配，見下方注意事項。

## 與現有工具的比較

| | upnote-mcp | 手動複製貼上進 UpNote | 雲端筆記 MCP（Notion / Evernote 類） | UpNote 官方 URL scheme |
|---|---|---|---|---|
| 本機執行、免帳號免 API key | ✅ | ✅ | ❌（需帳號＋API key） | ✅ |
| 可搜尋／摘要既有筆記 | ✅ | ❌（純手動） | ✅ | ❌（只能建立，不能讀） |
| 可編輯既有筆記 | ❌（UpNote 自動化本身的限制） | ✅ | 通常 ✅ | ❌ |
| 需要額外設定 MCP client | 需要 | 不需要 | 需要 | 不適用（非 MCP） |

## 注意事項

- **只能新增，不能編輯或加 tag**：這是 UpNote 官方自動化本身的限制（只提供「建立筆記」「建立筆記本」兩個動作），不是這個 server 沒做，README 明講改不了既有筆記。
- **讀取快照會留在暫存資料夾且不會自動清掉**：任何能讀你 temp 資料夾的程式都能看到完整筆記副本；共用或公司機器務必設定 `UPNOTE_SNAPSHOT_DIR` 指向只有自己能讀的路徑。
- **只在 Windows 11 + UpNote Store 版實測過**：macOS、Linux 的資料庫路徑和開啟指令雖然都寫了程式碼路徑，但作者標明「未測試」；Node 版本也要 22.13 以上（用到 `node:sqlite`）。
- **這是逆向工程，非官方文件**：UpNote 更新資料庫 schema 是隨時可能發生的事，README 開頭就寫「Unofficial」並提醒先備份。

## 今日收穫

這個工具真正的難點不是寫 MCP 協定本身（讀寫、掛 stdio transport都是套路），而是把一個沒有文件的桌面 App 本機資料庫搞懂：WAL 模式代表「檔案內容」跟「應用程式看到的資料」不是同一件事，複製主檔案不等於複製資料；而「筆記本裡有哪些筆記」這種關聯,資料庫設計者也不見得放在你以為合理的欄位裡。做本機優先的整合，跟做一般 REST API wrapper 完全是兩種功夫。

## 參考資料

- [upnote-mcp GitHub repo](https://github.com/ahmedco88/upnote-mcp)：README、server.mjs 原始碼、package.json 均出自官方 repo，含 WAL 快照機制、notebook 關聯資料結構、平台支援狀態。
- [Model Context Protocol 官方文件](https://modelcontextprotocol.io)：MCP 協定介紹。
