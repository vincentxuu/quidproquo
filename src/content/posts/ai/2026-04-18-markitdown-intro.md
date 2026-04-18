---
title: "MarkItDown：把任何檔案餵給 LLM 之前，先讓它變成 Markdown"
date: 2026-04-18
category: ai
tags: [markitdown, llm, rag, document-processing, python]
lang: zh-TW
tldr: "Microsoft 開源的輕量工具，把 PDF、Office、圖片、音訊等格式統一轉成 Markdown，專門為 LLM pipeline 設計。"
description: "介紹 Microsoft MarkItDown 的設計理念、支援格式、安裝與使用方式，以及在 RAG 和 LLM 前處理場景的實際應用。"
draft: false
---

把各種格式的文件餵給 LLM 之前，都要面對同一個問題：PDF 有排版雜訊、Word 有隱藏樣式、圖片沒有文字、Excel 是二進位格式。MarkItDown 是 Microsoft 開源的 Python 工具，核心就是做這一件事——把這些格式統一轉成 Markdown，讓 LLM 可以直接讀。

## 設計哲學：為機器，不為人類

MarkItDown 的文件開頭就說清楚了：它的輸出目標不是「人類閱讀美觀」，而是**機器消費**。

這個取向決定了它的設計選擇。它不追求把 PDF 還原成一模一樣的排版，而是把標題、清單、表格、連結這些**語義結構**保留下來，其他裝飾性的東西丟掉。對 LLM 來說，語義結構才是重點，版面配置沒有意義。

跟常見替代方案比較：

- **PyMuPDF / pdfplumber**：只處理 PDF，輸出是純文字，結構資訊容易丟失
- **python-docx**：只處理 Word，需要自己解析 XML 結構
- **Unstructured.io**：功能接近，但偏重非結構化文字的切割，MarkItDown 更聚焦格式轉換本身
- **MarkItDown**：一個介面處理多種格式，輸出是結構化 Markdown

如果你的場景是「把公司的 PDF、PPT、Excel 全部轉成可以餵給 LLM 的格式」，MarkItDown 省掉了為每種格式找不同 parser 的麻煩。

## 支援格式

| 類別 | 格式 |
|------|------|
| 辦公文件 | PDF、Word (docx)、PowerPoint (pptx)、Excel (xlsx/xls) |
| 網頁 / 結構化資料 | HTML、CSV、JSON、XML |
| 媒體 | 圖片（EXIF metadata + OCR）、音訊（語音轉文字） |
| 其他 | ZIP 壓縮檔、ePub、YouTube 影片字幕 |

圖片和音訊的轉換需要額外依賴，圖片走 OCR 或接 LLM 產生描述文字，音訊走語音轉文字（需要安裝對應 extras）。

## 安裝

```bash
# 完整安裝，支援所有格式
pip install 'markitdown[all]'

# 只裝需要的格式，減少依賴
pip install 'markitdown[pdf,docx,pptx]'
```

支援的 extras 包含：`pdf`、`docx`、`pptx`、`xlsx`、`xls`、`outlook`、`audio-transcription`、`youtube-transcription`、`az-doc-intel`。

## 使用方式

### CLI

```bash
markitdown document.pdf > output.md
markitdown document.pdf -o output.md
cat document.pdf | markitdown
```

CLI 適合快速測試或 shell 腳本批次處理。

### Python API

基本用法很直接：

```python
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("report.pdf")
print(result.text_content)
```

接 LLM 做圖片描述：

```python
from markitdown import MarkItDown
from openai import OpenAI

client = OpenAI()
md = MarkItDown(llm_client=client, llm_model="gpt-4o")
result = md.convert("screenshot.png")
print(result.text_content)  # 包含 AI 生成的圖片描述
```

也支援直接轉 URL 和 YouTube 字幕：

```python
result = md.convert("https://www.youtube.com/watch?v=xxxxx")
```

## 實際場景

**RAG 前處理**是最典型的場景。把公司內部的 PDF、Word、PPT 統一轉成 Markdown，再切 chunk、做 embedding，存進向量資料庫：

```python
from markitdown import MarkItDown
from pathlib import Path

md = MarkItDown()
for pdf in Path("./docs").glob("**/*.pdf"):
    out = pdf.with_suffix(".md")
    out.write_text(md.convert(str(pdf)).text_content, encoding="utf-8")
```

**直接餵給 Claude**：

```python
import anthropic
from markitdown import MarkItDown

text = MarkItDown().convert("contract.docx").text_content

client = anthropic.Anthropic()
msg = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": f"請摘要以下合約：\n\n{text}"}],
)
```

## 限制

- **PDF 掃描檔效果有限**：如果 PDF 是圖片掃描，基本文字擷取會失效，需要搭配 OCR 或 Azure Document Intelligence
- **複雜排版結構難還原**：多欄位排版、巢狀表格等複雜格式，轉換結果可能跑掉
- **媒體轉換需要系統依賴**：音訊轉文字需要 `ffmpeg`，OCR 需要對應函式庫

Azure Document Intelligence 後端對複雜 PDF 效果更好：

```python
md = MarkItDown(docintel_endpoint="https://<your-endpoint>.cognitiveservices.azure.com/")
```

## 整體來說

MarkItDown 的定位很清晰：格式轉換的瑞士刀，不做 chunking、不做 embedding、不做 parsing 以外的事。它把「把各種檔案變成 LLM 可以讀的東西」這個問題解決得夠好，然後讓你自己決定後續怎麼處理。

適合場景：異質格式文件的批次處理、RAG pipeline 的前處理、快速把公司文件轉成可查詢的格式。不適合場景：需要精確還原 PDF 排版、處理大量掃描檔（需要另外接 OCR 方案）。

## 參考資料

- [microsoft/markitdown - GitHub](https://github.com/microsoft/markitdown)
