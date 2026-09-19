---
title: "一句 'Write a script' 的差距：Skill Instructions 如何決定 LLM 成功或失敗"
date: 2026-09-19
category: ai
type: debug
tags: [agent-skills, llm, bedrock, claude, debugging, context-engineering, stream-stall]
lang: zh-TW
tldr: "自建的 AI 助理用 Opus 4.6 生成 docx 連續兩次 stream_stall（90 秒超時）。根因是 skill instructions 少了一句 'Write a script'，導致模型走 inline code output 路徑。claude.ai 的官方 SKILL.md 有這句話，穩定走 bash 執行。"
description: "完整記錄一次 LLM skill instructions 差異導致生產環境連續失敗的除錯過程：從 DB 排查 stream_stall 到比對 claude.ai 的 API 行為。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-19-docx-skill-instructions-stream-stall-en)

## TL;DR

AI 助理平台 用 Opus 4.6 生成 Word 文件，連續兩次觸發 Bedrock 的 `stream_stall`（90 秒超時）。排查從 DB 的 `retry_attempts` 開始，追到 600K token 的累積 input，拆解 agent loop 步驟後發現：成功的對話用 bash tool 執行 JS 腳本，失敗的對話在 text output 裡 inline 寫 code。根因是 seed reconciler 把 docx skill instructions 覆蓋成精簡版，少了引導模型寫檔執行的那句話。claude.ai 用的官方 SKILL.md 明確寫 "Write a `docx` (npm) script"，模型穩定走安全路徑。

## 情境

2026-09-19 凌晨，使用者在 dev 環境的 AI 助理平台（Claude 4.6 Opus via [Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html)）送出一個簡單的 prompt——要求用 ELI5 風格把五個 AI 主題做成一份說明文件。連續兩次，都收到「系統暫時無法處理您的請求」。同樣的 prompt、同樣的 chatbot、同樣的 LLM，相隔 4 分鐘，兩次都失敗。

## 問題

從 dev DB 查兩個 conversation 的 outgoing message metadata：

```json
{
  "retry_attempts": [
    {"finish_reason": "stream_stall", "timeout_seconds": 90}
  ],
  "llm_input_token_usage": 159,
  "cache_read_input_tokens": 393946,
  "cache_creation_input_tokens": 200777
}
```

`stream_stall`——[Bedrock ConverseStream](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_ConverseStream.html) 的串流在 90 秒內沒有產出新的 chunk，被系統的 stall guard 判定超時。兩個對話的 metadata 幾乎一模一樣。

## 嘗試過程

### 第一層：159 tokens 的 prompt 怎麼變成 600K input？

使用者的 prompt 只有 159 non-cache tokens，但 `cache_read + cache_creation` 加起來近 600K。查 AI 助理平台 的配置：22 個 tools、13 個 skills、4,628 字元的 system prompt，全部加起來約 60K tokens 的靜態 context。

600K 的來源是 **agent loop 的累積效應**。AI 助理平台 跑 canvas agent mode，每一步 tool call 後要重送完整 context。Bedrock prompt caching 幫了忙（靜態部分只送一次），但每步新增的 tool results 是增量 tokens，加上 stall 後的 non-streaming retry 又算一次——4 步 loop + 1 次 retry，累積到 600K。

### 第二層：為什麼會 stall？

系統的 `_StallGuardedEventStream` 用一個 reader thread 監控 ConverseStream 的 chunk 間隔，超過 90 秒判定 stall。從 `content_payload` 還原 agent 步驟：

| 步驟 | LLM 決策 | Tool Calls |
|---|---|---|
| 1 | 搜尋 5 個主題 | `Global_Tavily_Search_Tool` ×5 |
| 2 | 載入 docx skill | `skill_expand_tool`（docx） |
| 3 | 讀取 SKILL.md | `read_workspace_file` |
| 4 | 開始生成 docx... | **← stall** |

模型在第 4 步嘗試在 text response 裡**直接寫完整的 JavaScript code**（docx-js API 呼叫）。在 Opus 4.6 + 大 context 的推理延遲下，chunk 間隔超過 90 秒。

### 第三層：成功的對話怎麼走的？

查過去 60 天 Opus 4.6 + docx skill 的所有對話——6 次成功、3 次失敗（含 prod 也有 stall）。成功的 tool call 序列完全不同：

```
skill_expand_tool → read SKILL.md → read docx-js.md
→ bash (write JS file) → bash (node run) → bash (validate)
→ present_files ✅
```

**成功的全部用 `bash` tool 寫 JS 檔案再用 `node` 執行。** 失敗的在 text output 裡 inline 寫 code。差異不在模型版本或 Bedrock 負載——在於模型選擇了哪條執行路徑。

### 第四層：為什麼模型的路徑選擇不穩定？

查 docx skill 的更新歷史，發現它在**失敗的前一天（09-18）被 seed reconciler 覆蓋**。精簡版（3,266 字元）只列了工具清單，沒有明確說「寫成檔案再用 node 執行」。

追溯到 [seed reconciler phase 2 PR](https://github.com/Playma-Co-Ltd/maiagent-django/pull/7116)——工程師從 prod DB 快照 skill 內容寫進 code，但 prod 的 docx skill 本來就是精簡版。Reconciler 只是把這個現狀固化了。

## 對照：claude.ai 怎麼做的？

用 Playwright 操作 claude.ai，送出同樣的 prompt。從 network requests 抓到關鍵 API：

```
GET /api/organizations/.../conversations/.../wiggle/download-file
    ?path=/mnt/skills/public/docx/SKILL.md
```

claude.ai 從 sandbox 的 `/mnt/skills/public/docx/SKILL.md` 讀取 skill 內容。Diff 確認它跟 [Anthropic 官方 GitHub](https://github.com/anthropics/skills/tree/main/skills/docx) 幾乎一致（91 行）。

依 Anthropic 官方 SKILL.md，建立新文件的指引是：

> **Create** a new document: Write a `docx` (npm) script — see gotchas below

從 conversation API 還原 claude.ai 的執行步驟：

| # | Tool | 動作 |
|---|---|---|
| 1 | `view` | 讀 SKILL.md |
| 2 | `bash_tool` | 檢查 `require('docx')` + 查中文字型 |
| 3 | `create_file` | 寫 `make_rag_doc.js`（12,340 chars） |
| 4 | `bash_tool` | `node make_rag_doc.js` → 產出 .docx |
| 5 | `bash_tool` | `soffice` 轉 PDF → `pdftoppm` 轉圖 |
| 6-8 | `view` | 看 page-1/2/3.jpg 驗證渲染 |
| 9 | `bash_tool` | 發現列表編號 bug → 改 JS → 重跑 |
| 10 | `present_files` | 交付 |

模型看到 "Write a `docx` (npm) script" → 自然寫 `make_rag_doc.js` 再用 `node` 執行。每步都是獨立的 tool call，不存在 90 秒 stall 的問題。

## 解法

在 seed registry 的 `skill-docx` instructions 中加入三條強制執行規則：

```markdown
## ⚠️ Execution rules (mandatory)
- You MUST read `/workspace/skills/docx/SKILL.md` completely before
  writing any code.
- When creating a new document, write a `docx` (npm) script to a
  `.js` file, then execute it with `node <file>`. NEVER write
  JavaScript code inline in your text response.
- After generating the .docx, verify the output:
  soffice → convert to PDF → pdftoppm → visually check page images.
```

[PR #8285](https://github.com/Playma-Co-Ltd/maiagent-django/pull/8285)：1 個檔案、1 行改動。

## 為什麼會這樣

三層原因疊加：

1. **Opus 4.6 在大 context 下的推理延遲**：22 個 tools + 13 個 skills + 多步 agent loop 累積的 history，生成長段 JS code 時 inter-token latency 超過 90 秒。
2. **精簡版 skill instructions 沒有引導模型走安全路徑**：列了「Create new documents: `docx-js`」但沒說「寫成檔案再用 node 執行」。模型有時走 bash（成功），有時走 inline text（失敗）。
3. **90 秒 stall timeout 對 Opus 長輸出偏短**：claude.ai 的同一個任務花了 3 分鐘以上，但它的 Code Interpreter 沒有 chunk-level stall timeout。

根本問題不是 Opus 太慢，而是 **skill instructions 的一句話差異讓模型走上了不同的路徑**。

## 學到的事

Skill instructions 不只是「告訴模型有什麼工具」——它是**路徑設計**。當存在多條可行路徑時（bash 執行 vs inline output），instructions 要明確把模型導向你想要的那條。

"Write a script" 不是建議，是護欄。

## 參考資料

- [Anthropic Skills — docx SKILL.md](https://github.com/anthropics/skills/tree/main/skills/docx) — claude.ai 使用的官方 docx skill
- [Amazon Bedrock ConverseStream API](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_ConverseStream.html) — stream_stall 的底層 API
- [PR #8285: fix(seeds): add execution rules to docx skill](https://github.com/Playma-Co-Ltd/maiagent-django/pull/8285) — 本次修復
- [PR #7116: feat(seeds): seed reconciler phase 2](https://github.com/Playma-Co-Ltd/maiagent-django/pull/7116) — seed reconciler 引入 docx skill 管理
