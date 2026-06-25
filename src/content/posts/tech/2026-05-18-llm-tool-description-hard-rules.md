---
title: "LLM agent 的 tool description 決定它怎麼選 tool：三個踩坑修法"
date: 2026-05-18
category: tech
type: debug
tags: [ai-agent, rag, llm, prompt-engineering, django, python]
lang: zh-TW
tldr: "把 tool description 從軟建議改成硬規則（白名單 + 後果說明），LLM 亂選 tool 的問題消失了；另外加 skip_signal=True 修掉 vector store 雙重 indexing。"
description: "記錄修 AI agent attachment 工具的三個 bug：binary format 路由規則、STOP THIS TURN 指令、Django post_save 觸發雙重 indexing。"
draft: false
---

🌏 [English version](/posts/tech/2026-05-18-llm-tool-description-hard-rules-en)

## TL;DR

把 tool description 從軟建議改成硬規則（白名單 + 後果說明），LLM 亂選 tool 的問題消失了；另外加 `skip_signal=True` 修掉 vector store 雙重 indexing。

## 情境

在建一個可以處理 attachment 的 AI agent，使用者可以上傳 PDF、Excel、圖片、純文字等檔案，agent 需要讀取或搜尋這些內容再回答。

系統有兩個 tool：

- `read_attachment_full_text`：直接讀純文字 attachment inline，不經過 index
- `ingest_attachment`：把 attachment 建立成 knowledge base，走 RAG 流程

理論上用哪個 tool 應該很清楚，但 LLM 常常選錯。

## 問題

三個獨立的 bug，但都源自同樣的根本原因：tool description 給的資訊不夠強。

**Bug 1：LLM 對 PDF 呼叫 `read_attachment_full_text`**

舊的 description 是這樣寫的：

```python
READ_ATTACHMENT_DESCRIPTION = (
    'Read the full text of an attachment without indexing. '
    'Use when the file is small/medium and the user wants a summary or full understanding. '
    'Plain-text formats (txt, md, csv, tsv, json, yaml, yml, log) are decoded directly. '
    'Output is truncated at 50,000 characters; if the file is larger or in a binary format, '
    'call ingest_attachment instead. The attachment must belong to the current conversation.'
)
```

「if the file is larger or in a binary format, call ingest_attachment instead」—這是建議，不是規則。LLM 看到這段後，對 PDF 仍有機率選 `read_attachment_full_text`，導致 tool 執行錯誤。

**Bug 2：ingest 完 LLM 繼續呼叫 retrieval tool**

舊的 dispatch 回傳訊息：

```
Indexing dispatched. The agent will be re-invoked automatically when indexing completes;
do not call retrieval tools in this turn — finish the current response and stop.
```

LLM 有時仍會在同一個 turn 繼續呼叫 `retrieve_text_nodes`，因為 index 尚未建好所以回空結果，然後回答「找不到相關內容」。

**Bug 3：vector store 出現重複 chunks**

`retrieve_text_nodes` 回傳的節點有重複，同樣的段落出現兩次，agent 回答會帶重複內容。

## 解法

**Bug 1：把白名單和拒絕清單都明確列出**

```python
READ_ATTACHMENT_DESCRIPTION = (
    'Read the full text of a plain-text attachment inline — no indexing. '
    'ONLY supports: txt, md, csv, tsv, json, yaml, yml, log. '
    'PDF, doc, docx, pptx, xlsx, html, images, and all other binary or non-plain-text formats '
    'are REJECTED by this tool; call ingest_attachment for those. '
    'Use when the file is small/medium and the user wants a summary or full understanding. '
    'Output is truncated at 50,000 characters. '
    'The attachment must belong to the current conversation.'
)
```

同步更新 `INGEST_ATTACHMENT_DESCRIPTION` 開頭直接說「REQUIRED for binary or non-plain-text formats」，在 tool 被選之前就先建立規則。

**Bug 2：改成 STOP 指令 + 說明後果**

```python
INGEST_DISPATCH_NEXT = (
    'STOP THIS TURN: Indexing has been dispatched. '
    'The index is not yet ready — any retrieval call (query_files / grep_files / retrieve_text_nodes) '
    'will return empty results. '
    'Finish your current response and stop. '
    'The agent will be automatically re-invoked when indexing completes.'
)
```

三個改動：
1. `STOP THIS TURN` 放最前面，指令感強烈
2. 說明後果：「will return empty results」讓 LLM 理解*為什麼*要停，而不只是被告知不要做
3. `ingest_attachment` 的 description 裡也同步加入「MUST end this turn immediately」，在 tool 被呼叫前就先提醒，不只靠 tool 回傳值

**Bug 3：加 `skip_signal=True` 防止雙重 indexing**

找到根本原因：`IngestAttachmentTool` 呼叫 `AttachmentService.create_knowledge_base_files_from_attachments()` 時，沒有帶 `skip_signal=True`。

```python
kb_files = AttachmentService(
    message_instance=None,
    attachments_data=None,
    skip_signal=True,          # 加這個
).create_knowledge_base_files_from_attachments(
    attachment_instances=[attachment],
    conversation_instance=attachment.conversation,
)
```

沒有 `skip_signal` 時，`ChatbotFile` 的 `post_save` signal 會觸發一個非同步 Celery 任務做 indexing，同時 `_ingest_sync` 又直接呼叫 `process_knowledge_base_file_tasks(sync=True)` 做同步 indexing——同一個檔案被 index 兩次，vector store 留下重複 chunks。

## 為什麼會這樣

Bug 1 和 Bug 2 的根本原因相同：**LLM 把「建議」當作可選項，只有「規則」才會被強制遵守。**

舊描述用的措辭是：
- 「if the file is larger or in a binary format, call X instead」→ 條件語句，LLM 自己判斷條件是否成立
- 「do not call retrieval tools in this turn」→ 祈使句，但沒有說明原因

新描述用的措辭是：
- 「are REJECTED by this tool」→ 動詞直接否定，沒有條件判斷餘地
- 「will return empty results」→ 說明後果，LLM 從自身利益的角度也不會再呼叫

另一個有效的模式是「description 預警 + return value 強化」：在 tool description 裡就說「呼叫完必須結束這個 turn」，在 tool 回傳時再說一次。重複同樣的指令，偏離的機率降低。

Bug 3 是 Django signal 副作用問題：在 runtime 動態建立 KB files 時，原有的 signal-based indexing 邏輯和 runtime 的同步 indexing 路徑互不知情，各自執行。解法是在 runtime 路徑裡繞過 signal。

## 學到的事

寫給 LLM 的 tool description 要當成 contract 寫，不是 README。說「REJECTED」比說「不支援」有效，說明後果比只下命令有效。

## 參考資料

- [Anthropic — Tool use overview](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview)
- [LlamaIndex — Knowledge Base indexing](https://docs.llamaindex.ai/en/stable/understanding/indexing/indexing/)
- [Django — Signals](https://docs.djangoproject.com/en/5.2/topics/signals/)
