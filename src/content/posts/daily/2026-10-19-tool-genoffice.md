---
title: "工具推薦｜GenOffice — 讓 Agent 直接編輯真正的 Word/Excel/PowerPoint 檔案"
date: 2026-10-19
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "開源 MCP server 讓 Claude Code、Cursor 等 agent 直接產生保留原始格式的真實 Word/Excel/PowerPoint 檔案，不是轉檔近似品"
tldr: "GenOffice 是一個開源 AI Office 套件，透過 genoffice MCP server 把 29 個工具開給 agent，直接編輯真實 .docx/.xlsx/.pptx 且保留未改動部分的格式。安裝：claude mcp add --transport stdio genoffice -- genoffice mcp。解決了 agent 產文件只能吐 Markdown 近似品、Excel 公式變成死數字的問題。"
series:
  name: "AI Tool of the Day"
  order: 59
---

> 🌏 [English version](/posts/daily/2026-10-19-tool-genoffice-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | GenOffice |
| 類型 | MCP server（含桌面 App／CLI／Agent Skill） |
| GitHub | [genspark-ai/genoffice](https://github.com/genspark-ai/genoffice) |
| Stars | 9,945 |
| 語言 | TypeScript |
| 授權 | Apache-2.0 |
| 安裝 | `claude mcp add --transport stdio genoffice -- genoffice mcp` |

## 解決什麼問題

你是否遇過：要求 agent 幫忙生一份投資人簡報或一份報表，它吐出來的是 Markdown，你再手動貼進 PowerPoint 調格式；或是要它改一份既有的 Word 文件，結果整份文件的樣式、頁首頁尾、追蹤修訂全部跑掉，因為背後其實是整份重寫再轉檔。Excel 更明顯——agent 給的是算好的數字，不是公式，資料一變，表格就是死的。

GenOffice 把每個指令同時做成 CLI 和 MCP 工具（`genoffice mcp` 一次給 29 個工具），讓 agent 直接對真實的 `.docx`／`.xlsx`／`.pptx` 下手，而不是生成近似品再轉檔。核心機制是「窄範圍 patch」：開檔時把原始 XML 解析成區塊樹，每個區塊都錨定回原始 XML；存檔時只把被動到的區塊重新序列化，其他區塊原封不動地複製回去，所以文件存回 Word/Excel 後還是正常檔案，不是看起來像但其實跑掉格式的東西。Sheets 的公式（如 `=SUM(B2:B9)`）維持即時運算，Slides 則有逐頁 `check`／`audit` 機制會在組裝前先抓版面溢出和重疊。

適合場景：需要產出能直接拿給非技術同事看的 Word 報告、要保留公式的 Excel 分析表、或是要生成一份真正可編輯（不是圖片拼貼）的 PowerPoint 投資簡報。

## 快速上手

### 安裝

```bash
# 1. 先到 GitHub Releases 下載並安裝 GenOffice 桌面 App
#    （macOS dmg／Windows exe／Linux deb·rpm·AppImage），它會附帶 genoffice CLI
# https://github.com/genspark-ai/genoffice/releases/latest

# 2. 把 genoffice MCP server 接進 Claude Code
claude mcp add --transport stdio genoffice -- genoffice mcp
```

### 基本用法

```bash
# 保留原始格式，只改動需要改的部分
genoffice docs read report.docx --range 0-9 --json
genoffice docs apply report.docx --ops edits.json

# Excel 公式維持即時運算，不是貼死數字
genoffice create --type xlsx --from table.json --out sales.xlsx

# Markdown/HTML/docx/xlsx/pptx 互轉，PDF 也能雙向轉
genoffice convert report.md --to pdf
```

### 進階用法

```bash
# 分段產出一份投影片：先定風格與大綱，再逐頁檢查，最後組裝
genoffice slides check deck/outline.json --json
genoffice create --type pptx --spec deck/pages --outline deck/outline.json \
  --out deck/solar-system.pptx --json
genoffice slides audit deck/solar-system.pptx --json   # 檢查版面溢出／重疊
genoffice slides render deck/solar-system.pptx --out shots/   # 每頁存一張 PNG 給自己看
```

## 與現有工具的比較

| | GenOffice MCP | LLM 直接吐 Markdown 再轉檔 | python-docx／openpyxl 手刻腳本 |
|---|---|---|---|
| 保留原始檔案未改動部分的格式 | ✅（窄範圍 patch） | ❌（轉檔常跑掉樣式） | 需自行處理 |
| Excel 公式維持即時運算 | ✅ | ❌（通常變成死數字） | ✅ 但要自己寫 |
| Agent 直接呼叫，不用寫程式 | ✅（MCP 工具／CLI） | 部分 | ❌ 需要寫 Python |
| 內建逐頁排版檢查 | ✅（`slides_audit`） | ❌ | 需自行實作 |
| 本機執行，檔案不外流 | ✅（只有 AI 呼叫本身出機器） | 視工具而定 | ✅ |

## 注意事項

- **不是輕量 npm 工具**：要用 MCP／CLI 得先裝整套 GenOffice 桌面 App（Electron + Rust xlsx sidecar），比單純 `npx` 安裝的小工具重，第一次設定要多花幾分鐘下載。
- **PDF 相關指令需要顯示環境**：`render`、轉 PDF、`create_pdf` 會在背後叫起隱藏的 GenOffice 進程；在無頭伺服器上跑，要搭配虛擬顯示（`xvfb-run`）才不會卡住。
- **企業模組授權不同**：主體是 Apache-2.0，但 `ee/` 目錄（未來的企業功能）用的是另一份 GenOffice Enterprise License，混用時要注意分界，別直接假設整個 repo 都是 Apache-2.0。

## 今日收穫

一直以為 agent 產文件的終點就是吐 Markdown、再想辦法轉檔成 Office 格式，看完才發現真正的差別在「哪些 bytes 被動過」——GenOffice 把每次 AI 編輯都收斂成針對 OOXML 樹的窄範圍 patch，沒被改到的部分原封不動複製回去，文件存回 Word/Excel 才會是真正能用的檔案，而不是外觀相似、內部結構其實是另一種東西的近似品。

## 參考資料

- [genspark-ai/genoffice — GitHub](https://github.com/genspark-ai/genoffice)
- [GenOffice 官方網站](https://genoffice.ai/)
- [GenOffice MCP server 說明（README #10）](https://github.com/genspark-ai/genoffice#mcp-server)
- [GenOffice CLI 與 Agent Skill 說明（README）](https://github.com/genspark-ai/genoffice#command-line-and-agent-skill)
- [LICENSE — Apache-2.0](https://github.com/genspark-ai/genoffice/blob/main/LICENSE)
