---
title: "notebooklm-py：用 Python 操控 Google NotebookLM 的非官方 API"
date: 2026-04-05
category: ai
tags: [notebooklm, google, reverse-engineering, python, rpc]
lang: zh-TW
tldr: "notebooklm-py 透過逆向工程 Google 的 batchexecute RPC 協議，讓你用 Python / CLI / AI Agent 程式化操作 NotebookLM，包含音訊、影片、投影片、測驗等生成功能。"
description: "深入介紹 notebooklm-py 的技術原理：如何逆向 Google 內部 RPC 協議、Cookie 認證機制、以及超越 Web UI 的功能。"
draft: false
---

notebooklm-py 是目前最完整的 Google NotebookLM 非官方 Python API。它不只是簡單的爬蟲或 Selenium wrapper——而是直接逆向了 Google 內部的 RPC 協議，讓你能以程式化方式操作 NotebookLM 的所有功能，甚至包含網頁 UI 沒有暴露的能力。

## 核心技術：Google batchexecute RPC

NotebookLM 網頁版底層使用 Google 內部的 `batchexecute` RPC 協議。這不是 NotebookLM 獨有的——Google Photos、Google Translate 等產品都用同一套機制。

請求結構長這樣：

```
POST /_/LabsTailwindUi/data/batchexecute

f.req = [[[rpc_id, json_params, null, "generic"]]]
```

幾個關鍵設計：

- **RPC ID**：每個操作對應一個 6 字元識別碼（如 `wXbhsf`），這些 ID 是逆向工程得來的
- **位置敏感的參數**：payload 不是 key-value，而是巢狀 JSON 陣列，靠索引位置區分參數意義。缺少的位置必須填 `None`
- **Anti-XSSI 保護**：回應前綴 `)]}'\n`，需要先剝掉才能解析
- **CSRF Token**：透過頁面中的 `SNlM0e` 值作為 `at` 參數傳遞

這套協議沒有任何官方文件。開發者的做法是打開 Chrome DevTools，篩選 `batchexecute` 請求，在網頁上執行操作，然後從攔截到的請求中逐一拆解 RPC ID 和 payload 結構。

## 認證：Playwright 瀏覽器 Cookie 擷取

Google 沒有為 NotebookLM 提供 OAuth scope 或 API key，所以 notebooklm-py 用了一個務實的方案：直接用 Playwright 開瀏覽器讓使用者登入，然後擷取 session cookies。

```bash
pip install "notebooklm-py[browser]"
playwright install chromium
notebooklm login
```

流程是：Playwright 啟動 Chromium → 使用者手動登入 Google → 程式擷取 cookies 儲存到本地 → 後續所有 API 請求都帶上這些 cookies 模擬已登入狀態。

這意味著認證的生命週期等同於 Google session cookie 的有效期，過期就需要重新登入。

## 功能：不只是 Web UI 的鏡像

除了對應網頁上所有操作（建立筆記本、新增來源、聊天問答、生成音訊概覽等），notebooklm-py 還提供了 Web UI 做不到的事：

- **批量下載** artifacts（音訊、影片、投影片）
- **結構化匯出**：測驗和閃卡可匯出為 JSON / Markdown / HTML，而不只是在介面上看
- **心智圖階層資料擷取**：拿到結構化的樹狀資料
- **可編輯的 PPTX 下載**：網頁只給 PDF，這裡給你 PowerPoint
- **程式化權限管理**：批量設定分享和存取權限

所有內容生成都走同一個 `CREATE_ARTIFACT` RPC 方法，用不同的 type code 區分產出類型（音訊、影片、投影片、測驗等）。長時間任務會回傳 task ID，透過輪詢追蹤完成狀態。

## 三種使用方式

**CLI** 適合快速操作和腳本：

```bash
notebooklm create "Research Project"
notebooklm source add "https://example.com"
notebooklm generate audio "make it engaging" --wait
notebooklm download audio ./podcast.mp3
```

**Python API** 是 async-based，適合整合進應用：

```python
async with await NotebookLMClient.from_storage() as client:
    nb = await client.notebooks.create("Research")
    await client.sources.add_url(nb.id, "https://example.com", wait=True)
    result = await client.chat.ask(nb.id, "Summarize this")
```

**AI Agent 技能** 可以安裝到 Claude Code、Codex 或 OpenClaw：

```bash
notebooklm skill install
```

## 整體架構

```
使用者（Python / CLI / Agent）
        │
  NotebookLMClient（async session）
        │
  RPC 方法層（RPCMethod enum → 6 字元 RPC ID）
        │
  HTTP POST → /_/LabsTailwindUi/data/batchexecute
  （cookies + CSRF token + 巢狀 JSON payload）
        │
  Google NotebookLM 後端
        │
  回應解析（strip anti-XSSI → parse chunked JSON → dataclass）
```

## 整體來說

notebooklm-py 的核心取捨很明確：用逆向工程換來完整的程式化存取能力，代價是穩定性依賴 Google 不改動內部協議。

適合的場景：原型開發、研究、批量處理（例如一次幫 20 份文件生成 podcast 音訊）、或是把 NotebookLM 整合進 AI agent 工作流。

不適合的場景：生產環境、對穩定性有嚴格要求的服務。Google 改一個 RPC ID，整個功能就會壞掉。

目前 9.1k stars、650+ commits，是這個領域最成熟的選擇。如果你需要程式化操作 NotebookLM，這基本上是唯一的路。

## 參考資料

- [notebooklm-py GitHub Repository](https://github.com/teng-lin/notebooklm-py)
- [notebooklm-py RPC Reference](https://github.com/teng-lin/notebooklm-py/blob/main/docs/rpc-reference.md)
- [notebooklm-py RPC Development Guide](https://github.com/teng-lin/notebooklm-py/blob/main/docs/rpc-development.md)
- [Google NotebookLM](https://notebooklm.google.com/)
