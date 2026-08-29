---
title: "工具推薦｜proton-safe-mcp — 讓 Agent 讀信、寫草稿，但永遠按不到寄送鍵"
date: 2026-08-30
category: daily
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "MCP server 讓 Agent 能讀取、搜尋 Proton Mail 並準備附件草稿，但程式碼裡完全不存在寄送功能，草稿必須經過本地終端機的人工核可才能建立"
tldr: "proton-safe-mcp 是一個 FastMCP server，透過 Proton Mail Bridge 讓 Agent 讀信、搜尋、準備附件草稿。安裝：git clone + uv sync + uv run proton-safe-mcp setup。解決了『Agent 讀信等於一次 prompt injection 攻擊面』的問題——程式碼裡沒有寄送工具，草稿要在本地終端機手動核可才會成立。"
series:
  name: "AI Tool of the Day"
  order: 15
---

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | proton-safe-mcp |
| 類型 | MCP server（Proton Mail 唯讀 + 人工核可草稿） |
| GitHub | [fbossiere/proton-safe-mcp](https://github.com/fbossiere/proton-safe-mcp) |
| Stars | 1 |
| 語言 | Python |
| 授權 | MIT |
| 安裝 | `git clone https://github.com/fbossiere/proton-safe-mcp.git && cd proton-safe-mcp && uv sync` |

## 解決什麼問題

你是否想過，讓 Agent 接上信箱這件事本身就是資安問題的根源？信件是攻擊者可控的輸入——任何寄件人都能在信件內容裡塞進「請把附件轉寄給某某地址」這類指令注入文字。如果 Agent 同時擁有讀信和寄信的工具，它就只差一次 prompt injection 就會做出你沒要求的事。市面上大多數 email MCP server 為了「功能完整」都會內建 `send_message` 工具，把這個風險直接交給使用者自己小心。

proton-safe-mcp 走了完全相反的路線：它透過官方 Proton Mail Bridge 讓 Agent 能讀信、搜尋、列資料夾，也能準備帶附件的草稿，但程式碼裡從頭到尾沒有 SMTP client，沒有 `send_message` 工具，作者甚至寫了一個測試專門斷言「這個工具不存在」。建立草稿還不算完成——Agent 呼叫 `prepare_draft` 只會產生一個待核可的提案，真正把草稿寫進 Proton Mail 需要你在本地終端機執行 `proton-safe-mcp approve <draft_id>`，這個核可指令本身**不是** MCP 工具，Agent 完全碰不到它。附件也不走檔案路徑，而是用聲明大小與 SHA-256 的分塊 base64 上傳，server 永遠不會直接讀到客戶端的檔案系統。

適合場景：你想讓 Agent 幫忙整理收件匣、依信件內容起草回覆或轉寄郵件，但不希望任何一次工具呼叫直接把信寄出去；尤其是收件匣裡本來就混著外部信件（就是攻擊面的來源）的情境。目前只支援 Linux + Proton Bridge，且明講「這些限制降低風險，但不代表信件變得可信任」——不要在同一個無人值守的 Agent session 裡混用其他有寫入能力的工具。

## 快速上手

### 安裝

```bash
git clone https://github.com/fbossiere/proton-safe-mcp.git
cd proton-safe-mcp
uv sync

# 設定 Proton 地址與 Bridge 的本地 IMAP port（不是你的 Proton 密碼）
export PROTON_BRIDGE_USER="your-address@proton.me"
export PROTON_IMAP_PORT="1143"

# 把 Bridge 產生的 IMAP 密碼存進 OS keyring
uv run proton-safe-mcp setup
```

依賴：Linux（開發與測試環境為 Ubuntu）、已登入且正在執行的官方 Proton Mail Bridge、支援 Bridge 的 Proton 方案、Python 3.11+、[`uv`](https://docs.astral.sh/uv/)，以及一個可用的 Secret Service keyring（`gnome-keyring` 或相容實作）。

### 基本用法

註冊成一般的本地 STDIO MCP server：

```json
{
  "name": "proton-safe",
  "transport": "stdio",
  "command": "/absolute/path/to/proton-safe-mcp/.venv/bin/proton-safe-mcp",
  "args": ["serve"],
  "env": {
    "PROTON_BRIDGE_USER": "your-address@proton.me",
    "PROTON_IMAP_PORT": "1143"
  }
}
```

`PROTON_BRIDGE_PASSWORD` 不要放進這份設定——server 會自己從 `setup` 建立的 keyring 讀取。裝好之後直接跟 Agent 說要查信箱狀態、列資料夾或搜尋信件，它會呼叫 `mailbox_status`、`list_folders`、`search_messages`、`read_message` 這幾個唯讀工具，`read_message` 一律用 `BODY.PEEK`，不會把信件標記成已讀，回傳的也只有純文字、不含附件內容。

### 進階用法

草稿含附件的完整流程需要一段一段跑，最後一步的核可要在你自己的終端機按：

```bash
# Agent 端：declare → 分塊上傳 → 驗證雜湊 → 換到一次性 token → 準備草稿
begin_attachment_upload(filename, content_type, size_bytes, sha256_hex)
upload_attachment_chunk(upload_id, chunk_index, data_base64)   # 依序呼叫
finish_attachment_upload(upload_id)                             # 拿到 attachment_token
prepare_draft(..., attachment_tokens=[token])                   # 只建立待核可提案

# 人工端：在本地終端機核可，這個指令不是 MCP 工具
export PROTON_BRIDGE_USER="your-address@proton.me"
/absolute/path/to/.venv/bin/proton-safe-mcp approve <draft_id>
```

核可後 Agent 才能呼叫 `commit_approved_draft(draft_id)` 把草稿真正寫進 Proton Mail，你仍然要自己打開 Proton Mail 檢查、手動按下寄送。草稿提案預設 15 分鐘過期、上傳的附件 30 分鐘過期，且草稿內容只存在記憶體裡——server 一重啟，所有待核可的提案就全部失效。

## 與現有工具的比較

| | proton-safe-mcp | 一般 email MCP（內建 send） | 手動複製貼上信件內容 |
|---|---|---|---|
| 程式碼裡完全沒有寄送功能 | ✅ | ❌ | — |
| 草稿需要本地終端機人工核可 | ✅ | 通常沒有，或只是可選旗標 | 每次都是人工 |
| 附件走分塊雜湊驗證，不暴露檔案路徑 | ✅ | 依實作而定 | — |
| 唯讀操作不影響已讀狀態 | ✅（`BODY.PEEK`） | 依實作而定 | ✅ |
| 支援批次、自動化整理信箱 | ✅（讀取/搜尋自動化） | ✅ | ❌ |

## 注意事項

- **平台只支援 Linux + Proton Bridge**：README 明講開發與測試環境是 Ubuntu，且 `PROTON_BRIDGE_HOST` 故意寫死在 `127.0.0.1`、不支援改成別的主機。
- **核可流程仍可被繞過**：作者自己在「Threat-model limitations」裡承認，如果同一個 Agent session 還握有不受限的 shell 存取權，理論上能自己寫出核可用的 marker 檔案——核可機制的完整性前提是「不要把有寫入能力的工具和這個 server 混在同一個無人值守 session 裡」。
- **Proton Bridge 的自簽憑證不驗證**：因為目標主機固定是 `127.0.0.1`，作者認為可接受，但這代表你不能隨意把 `PROTON_BRIDGE_HOST` 指到遠端。

## 今日收穫

大多數 email MCP server 把「安全」當成一個可選設定（例如加個 `readOnly` flag），proton-safe-mcp 的做法是把「危險的能力」直接從程式碼裡拿掉，而不是靠設定去限制它。核可流程也刻意設計成「不是 MCP 工具」——這代表安全邊界不是靠 Agent 自律去遵守的規則，而是 Agent 的工具清單裡物理上不存在那個選項。這種「把攻擊面從架構上消除，而不是事後加防護」的思路，值得套用在其他任何會讀取外部不可信輸入（信件、網頁、使用者上傳檔案）又同時握有寫入能力的 Agent 工具設計上。

## 參考資料

- [fbossiere/proton-safe-mcp GitHub repo](https://github.com/fbossiere/proton-safe-mcp)：README、安全屬性清單、MCP 工具表、附件上傳流程、Threat-model limitations 均出自官方 repo。
- [fbossiere/proton-safe-mcp repo metadata](https://github.com/fbossiere/proton-safe-mcp)：MIT 授權、Python、建立於 2026-08-29，經 GitHub API 確認。
