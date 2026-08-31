---
title: "工具推薦｜read4all — 讓 Agent 把 PDF、Office、截圖都讀成 Markdown"
date: 2026-09-01
category: daily
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "MCP server 讓 Agent 直接把 PDF / Office / 圖片 / 網頁文件轉成 Markdown，MinerU 雲端優先、無 key 時自動降級到秒級可用的本地函式庫"
tldr: "read4all 是一個 MCP server，把 PDF / Office / 圖片 / 網頁文件轉成 Markdown + 圖片，MinerU 雲端優先、無 key 時自動降級本地函式庫。安裝：uvx read4all。解決了『Agent 要讀附件，要嘛版面全丟光、要嘛得自己接一條轉檔工具鏈』的問題。"
series:
  name: "AI Tool of the Day"
  order: 17
---

> 🌏 [English version](/en/posts/daily/2026-09-01-tool-read4all-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | read4all |
| 類型 | MCP server（多格式附件 → Markdown 轉換） |
| GitHub | [int2t05/read4all](https://github.com/int2t05/read4all) |
| Stars | 1 |
| 語言 | Python |
| 授權 | MIT |
| 安裝 | `uvx read4all` |

## 解決什麼問題

你是否讓 Agent 讀過使用者丟來的 PDF 報告或內部 Office 文件，結果表格變成一堆對不齊的空白、公式整個消失、截圖裡的圖表 Agent 根本看不懂？純文字擷取工具只顧著把字挖出來，版面結構、表格邊界、圖片位置全部丟光；要保留這些資訊，通常得自己接一條「先判斷格式 → 呼叫對應函式庫 → 處理圖片 → 拼回 Markdown」的工具鏈，每加一種格式就多一段膠水程式碼。

read4all 把這條工具鏈包成一個 MCP 工具：`convert_to_markdown` 收到附件路徑後，優先呼叫 MinerU 雲端引擎做高精度的公式、表格、版面還原；沒有設定 `MINERU_API_KEY`，或雲端逾時、限流、附件超過 200MB／200 頁時，自動降級到本地函式庫鏈（PDF 用 pymupdf + pypdf + pdfplumber，Office／網頁用 MarkItDown）。降級不等於閹割——本地路徑照樣把表格擇優、圖表幾何標註、內嵌圖片抽取這些「深度能力」揉進去，只是精度比雲端引擎低一些。轉出的 Markdown 固定落在附件同級的 `<stem>/` 目錄，同一份檔案重複轉換會命中內容雜湊快取，秒級回傳。

適合場景：Agent 需要讀使用者上傳的 PDF 報告、公司內部 Office 文件、或截圖裡有表格與圖表的資料做摘要 / RAG；也適合純文字模型透過 `describe_images=True` 拿到圖片的文字描述，讓看不懂圖的模型間接「看懂」截圖內容。

## 快速上手

### 安裝

```bash
# 先裝 uv（如果還沒裝）
curl -LsSf https://astral.sh/uv/install.sh | sh

# uvx 會自動從 PyPI 拉取並執行 read4all，不需要預先安裝
```

`.mcp.json`：

```json
{
  "mcpServers": {
    "read4all": {
      "command": "uvx",
      "args": ["read4all"]
    }
  }
}
```

重啟 Claude Code 後即可對 Agent 說「把這個 PDF 轉成 Markdown」，觸發 `convert_to_markdown`。

### 基本用法

Agent 拿到兩個工具：

- `get_capabilities` — 查詢目前支援的格式、引擎、MinerU 是否可用
- `convert_to_markdown` — 唯一的轉換入口，回傳 `{md_path, images_dir, image_count, engine_used, fallback_reason, preview}`（`preview` 是前 2000 字，Agent 可以直接用，完整內容再讀 `md_path`）

```
你：把 report.pdf 轉成 Markdown
Agent：→ convert_to_markdown("report.pdf")
      ← engine_used: "pymupdf"（無 MinerU key，本地降級）
      ← report/report.md + report/images/img1.png ...
```

### 進階用法

配置 MinerU key 換取雲端引擎的高精度公式／表格／版面還原：

```bash
export MINERU_API_KEY="your_token"   # 從 https://mineru.net/apiManage 取得
```

再加上 VLM 端點，可以讓純文字模型「看懂」一般照片（不只是文件型截圖）：

```bash
export READ4ALL_VLM_BASE_URL="https://api.openai.com/v1"
export READ4ALL_VLM_API_KEY="..."
export READ4ALL_VLM_MODEL="gpt-4o-mini"
```

未配置 VLM 時，MinerU 對文件型圖片（截圖、掃描件）產生的 OCR 文字仍會寫入 `description`；配置後才會擴大到一般照片、圖表這類非文件型圖片。

## 與現有工具的比較

| | read4all | 自寫 pymupdf/pdfplumber script | MarkItDown（獨立使用） | 雲端 OCR SaaS（如 Textract） |
|---|---|---|---|---|
| MCP 原生，Agent 直接呼叫 | ✅ | ❌ | ❌ | 需自行包 |
| 無 key 也能用（本地降級） | ✅ | ✅（但要自己寫） | ✅ | ❌ |
| 高精度公式／表格／版面（有 key 時） | ✅（MinerU） | ❌ | ❌ | 部分支援 |
| 內容雜湊快取，重複轉換秒級 | ✅ | 需自行實作 | ❌ | 依廠商而定 |
| 全格式（PDF/Office/圖片/網頁）單一入口 | ✅ | 需自行整合 | ✅（不含深度提取） | 依廠商而定 |

## 注意事項

- **只讀不寫**：不做 PDF 生成、合併、拆分或填表，僅限「附件 → Markdown」單向轉換。
- **本地降級路徑有天花板**：本地函式庫不還原矢量路徑公式、不做本地 OCR，這兩項都需要 MinerU；無 key 時遇到掃描件或複雜公式，品質會明顯下降。
- **專案非常新**：今天（2026-08-31）才發布 PyPI 首版 `0.1.0`，GitHub repo 也是同一天建立、目前只有 1 顆星，尚未經過大規模社群驗證，正式導入前建議自己先跑一輪測試。MinerU key 務必用環境變數傳遞，不要寫進 `.mcp.json` 版控。

## 今日收穫

多數「降級」設計是把功能砍到最小可用，read4all 的降級鏈反而把深度提取能力（表格擇優、圖表幾何標註）也塞進本地路徑，讓「沒有雲端 key」不等於「只能拿到裸文字」。這跟单純「有 key 用雲端、沒 key 用陽春本地版」的兩檔式設計不同——它把降級鏈本身也當一個要優化的產品層級，而不是備援的備援。

## 參考資料

- [int2t05/read4all GitHub repo](https://github.com/int2t05/read4all)：README、工具表、降級鏈、產物契約均出自官方 repo。
- [int2t05/read4all repo metadata](https://api.github.com/repos/int2t05/read4all)：MIT 授權、Python、建立於 2026-08-31，經 GitHub API 確認。
- [read4all on PyPI](https://pypi.org/project/read4all/)：版本 0.1.0，發布於 2026-08-31，確認 `uvx read4all` 安裝路徑可用。
