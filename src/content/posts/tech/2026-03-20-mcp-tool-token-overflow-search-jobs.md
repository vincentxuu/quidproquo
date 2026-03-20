---
title: "MCP Tool 回傳 1M 字元：search_local_jobs 的 token 爆炸問題"
date: 2026-03-20
category: tech
tags: [mcp, python, claude-code, debug]
lang: zh-TW
tldr: "MCP tool 回傳 description 欄位導致 1033 筆職缺超過 token 上限，改成預設不回傳 description 並加上分頁就解決了。"
description: "記錄一次 MCP search tool 超出 token 上限的除錯過程，以及 Claude 如何在錯誤的格式假設下連續踩坑。"
draft: false
---

## TL;DR

`search_local_jobs("AI")` 回傳 1,033 筆職缺，含 `description` 共 1,082,675 字元，超出 MCP token 上限。結果被存成檔案，Claude 連續三次因格式誤解而解析失敗，才在第五次拿到正確答案。根本解法：預設不回傳 `description`，改成摘要欄位 + 分頁。

## 情境

`offernow` 是一個本地職缺搜尋工具，透過 MCP server 讓 Claude 直接查詢本地 JSON 資料。有天問了一句「幫我查有多少 AI 職缺」，然後事情就開始不對了。

## 問題

```
Error: result (1,082,675 characters) exceeds maximum allowed tokens.
Output has been saved to /Users/.../.claude/tool-results/mcp-offernow-search_local_jobs-xxx.txt
```

結果被存成檔案，Claude 得自己去讀。檔案格式是 MCP 的 tool-result 格式：1,033 個 `{type, text}` 物件的陣列，每個 `text` 是一筆 job 的 JSON 字串。

## 嘗試過程

**第一次**：假設 `text` 是一個 jobs 陣列，只解析第一個 item：

```python
jobs = json.loads(item['text'])  # 得到單一 job (dict，21 個欄位)
for job in jobs:                 # 迭代 dict = 拿到 key 字串
    src = job.get('source')      # AttributeError: 'str' has no .get()
```

印出 `Total AI jobs found: 21` 就報錯——21 是一筆 job 的欄位數，不是職缺數。

**第二次**：試著印出第一筆資料，但語法寫錯：

```python
json.dumps[jobs[0], ensure_ascii=False](:200)  # SyntaxError
```

**第三次**：用 `list(jobs.keys())[:3]` 確認結構，輸出 `['job_id', 'job_name', 'company']`——仍然在看單一 job 的欄位，以為找到了資料結構的線索，其實還是錯的。

**第四次**：終於發現整個 `data` 是 1,033 個 item，每個 item 的 `text` 是一筆獨立的 job JSON。

**第五次**：正確解法：

```python
for item in data:
    if item.get('type') == 'text':
        job = json.loads(item['text'])
        src = job.get('_source', 'unknown')
        sources[src] = sources.get(src, 0) + 1
```

結果：104 有 647 筆，LinkedIn 有 386 筆，共 1,033 筆。

## 解法

問題出在 `search_local_jobs` 把 `description` 原封不動回傳。這個欄位佔了資料量的大宗，1,033 筆一起回傳就爆了。

修改後的 tool：

```python
@mcp.tool()
def search_local_jobs(
    keyword: str,
    source: str = "all",
    limit: int = 50,
    offset: int = 0,
    include_description: bool = False,
) -> dict:
    EXCLUDE_FIELDS = {"description", "address"}
    # ... 搜尋邏輯不變 ...

    page = matched[offset: offset + limit] if limit > 0 else matched[offset:]

    if not include_description:
        page = [{k: v for k, v in job.items() if k not in EXCLUDE_FIELDS} for job in page]

    return {
        "total": total,
        "by_source": by_source,
        "offset": offset,
        "limit": limit,
        "count": len(page),
        "results": page,
    }
```

現在「有多少 AI 職缺」直接從 `total` 和 `by_source` 拿答案，不需要任何 workaround。

## 為什麼會這樣

兩層問題疊加：

1. **Tool 設計**：搜尋工具回傳完整 job 物件，包含長達數千字的 `description`。搜尋場景根本不需要描述全文。
2. **錯誤格式假設**：MCP 超出 token 上限時，會把每個 content item 分開儲存成陣列。Claude 第一次看到這個格式，連續三次假設「text 是 jobs 陣列」而非「每個 item 是一個 job」。

## 學到的事

搜尋 API 回傳摘要欄位就夠了，description 留給 detail endpoint。
