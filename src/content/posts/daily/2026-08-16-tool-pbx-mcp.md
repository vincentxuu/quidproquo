---
title: "工具推薦｜pbx-mcp — 讓 Agent 用同一套工具讀懂 Asterisk 和 FreeSWITCH"
date: 2026-08-16
category: daily
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "MCP server 讓 AI Agent 直接查詢 Asterisk 和 FreeSWITCH 這兩套語法完全不同的開源 PBX 系統，統一成一組工具介面，預設唯讀且寫入工具在唯讀模式下根本不會註冊"
tldr: "pbx-mcp 是一個 MCP server，把 Asterisk（AMI）和 FreeSWITCH（ESL）兩套不同協定包成同一組 MCP 工具。安裝：npx -y pbx-mcp。解決了維運兩套 PBX 系統時要記兩套指令語法、且讓 Agent 誤執行變更指令的問題。"
series:
  name: "AI Tool of the Day"
  order: 1
---

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | pbx-mcp |
| 類型 | MCP server |
| GitHub | [ictinnovations/pbx-mcp](https://github.com/ictinnovations/pbx-mcp) |
| Stars | 3（2026-08-09 剛發佈） |
| 語言 | TypeScript |
| 授權 | MIT |
| 安裝 | `npx -y pbx-mcp` |

## 解決什麼問題

如果你同時維運 Asterisk 和 FreeSWITCH——這是開源電話交換系統（PBX）裡最主流的兩套方案——你大概很熟悉那種「查個線路狀態要切兩套腦袋」的感覺。Asterisk 用 AMI（Asterisk Manager Interface，TCP 5038 上的行協定，`Key: Value` 配對），FreeSWITCH 用 ESL（Event Socket Layer，TCP 8021，Header block 加 `Content-Length`）。兩邊的指令、輸出格式、連線方式完全不同，想讓 AI Agent 幫你查「哪個分機在線上」「trunk 為什麼斷了」，你得先教它兩套語言。

pbx-mcp 把這兩個協定的 client 都自己實作了一遍（不是包一層現成 CLI 的 wrapper），對外統一成一組 MCP 工具：`asterisk_channels`、`asterisk_endpoints`、`freeswitch_registrations`、`freeswitch_sofia_status` 這類唯讀查詢工具，Agent 呼叫哪一套完全看你設定了哪一組環境變數——只設 Asterisk，Agent 就看不到 FreeSWITCH 的工具，反之亦然。更關鍵的是安全模型：伺服器預設唯讀，`asterisk_originate`、`freeswitch_hangup` 這類會改變通話狀態的寫入工具，在唯讀模式下根本不會出現在 `tools/list` 裡——不是「執行時被擋」,而是 Agent 從一開始就看不到這個工具存在，除非你手動設 `PBX_MCP_ALLOW_WRITE=true`。

適合場景：自己架設 VoIP/客服電話系統、需要值班時讓 Agent 快速排查「線路掛了嗎」「SIP trunk 註冊狀態」的維運團隊，或是想在既有 Asterisk/FreeSWITCH 部署上疊一層自然語言查詢介面的開發者。

## 快速上手

### 安裝

```bash
# 需要 Node.js 18+
npx -y pbx-mcp

# 或全域安裝
npm install -g pbx-mcp

# 也可用 Docker
docker run ghcr.io/ictinnovations/pbx-mcp
```

### 基本用法

在 Claude Desktop（或其他 MCP client）的設定檔加入伺服器，透過環境變數指定要連哪一套系統——只填其中一組，或兩組都填：

```json
{
  "mcpServers": {
    "pbx": {
      "command": "npx",
      "args": ["-y", "pbx-mcp"],
      "env": {
        "ASTERISK_AMI_HOST": "10.0.0.10",
        "ASTERISK_AMI_USERNAME": "mcp",
        "ASTERISK_AMI_PASSWORD": "your-secret",
        "FREESWITCH_ESL_HOST": "10.0.0.11",
        "FREESWITCH_ESL_PASSWORD": "your-password"
      }
    }
  }
}
```

設定好之後就能直接問 Agent「現在有哪些通話在線上」「SIP trunk 有沒有掉線」，Agent 會自動呼叫 `asterisk_channels`、`freeswitch_sofia_status` 這類唯讀工具去查活的系統狀態，而不是翻舊的維運 wiki。

### 進階用法

需要讓 Agent 也能掛斷異常通話或撥測試電話時，才打開寫入模式，並用 allowlist 收斂 CLI/API passthrough 的可用指令：

```bash
# 開啟寫入工具（asterisk_originate / hangup 等才會出現在 tools/list）
export PBX_MCP_ALLOW_WRITE=true

# asterisk_cli / freeswitch_api 這類「任意指令」通道
# 預設只允許 core show / pjsip show / dialplan show（Asterisk）
# 與 status / show / sofia（FreeSWITCH）這類唯讀前綴，逐字比對，
# 而非前綴比對——所以 "sofia" 過得了，"sofia profile internal restart" 過不了
```

## 與現有工具的比較

| | pbx-mcp | 直接開 Asterisk/FreeSWITCH CLI | 自寫 Agent 腳本呼叫 AMI/ESL |
|---|---|---|---|
| 統一 Asterisk + FreeSWITCH 介面 | ✅ | ❌（各自指令集） | 需自行實作兩套 |
| MCP 原生、免改 Agent 程式碼 | ✅ | ❌ | ❌ |
| 寫入工具預設不存在（非僅擋執行） | ✅ | — | 需自行實作 |
| 指令 allowlist + shell metacharacter 過濾 | ✅ | — | 需自行實作 |
| 免安裝額外協定 client | ✅（內建 AMI/ESL client） | — | 需另裝套件 |

## 注意事項

- **這是一個剛發佈、star 數還很低（3）的新專案**：適合先在測試環境評估，正式上線前建議自行檢視原始碼，尤其是 AMI/ESL 認證資訊的處理方式。
- **AMI/ESL 帳密務必用最小權限**：README 建議另開一個僅有唯讀權限的 AMI 使用者給 pbx-mcp 用，不要直接複用管理員帳號，並搭配網路隔離（只讓 MCP server 所在主機能連到 5038/8021）。
- **`asterisk_cli` / `freeswitch_api` 的 allowlist 是逐字比對前綴**：新增自訂 allowlist 規則時要小心「看起來安全但其實會觸發狀態變更」的子指令，例如 FreeSWITCH 的 `sofia` 允許但 `sofia profile internal restart` 不允許，自行擴充規則時建議照這個逐字比對邏輯，不要改成前綴比對。

## 今日收穫

一開始以為這種「幫 Agent 包一層 CLI」的 MCP server 大多是把既有指令行工具包一層 JSON 的薄殼，但 pbx-mcp 其實是從協定層（AMI 的行協定、ESL 的 header block）自己重新實作了兩個 client——而且它的「安全」不是靠 prompt 提醒 Agent 別亂執行,而是架構上讓危險工具在唯讀模式下直接不存在於 `tools/list`。這是一個提醒：MCP server 的安全設計重點不在「擋掉危險呼叫」,而在「一開始就不要讓 Agent 看到危險工具」。

## 參考資料

- [ictinnovations/pbx-mcp — GitHub](https://github.com/ictinnovations/pbx-mcp)
- [ICT Innovations Releases pbx-mcp, an Open Source MCP Server for Asterisk and FreeSWITCH — PRLog](https://www.prlog.org/13163497-ict-innovations-releases-pbx-mcp-an-open-source-mcp-server-for-asterisk-and-freeswitch.html)
- [I built an MCP server so I could stop memorising two PBX command sets — Tahir Almas, DEV Community](https://dev.to/tahiralmas/i-built-an-mcp-server-so-i-could-stop-memorising-two-pbx-command-sets-401o)
- [pbx-mcp on npm](https://www.npmjs.com/package/pbx-mcp)
