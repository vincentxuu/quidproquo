---
name: post-verify
description: Fact-layer verification for a post draft under src/content/posts/<category>. Extract technical claims, cross-check against current authoritative sources, and produce a verdict report. Does NOT modify the file. Use when user says verify 一下 / 查證 / 對一下事實 / fact check / 確認版本 / 驗證 and references a draft post.
---

# post-verify skill

發文前的事實層審查。`post-review` 看格式與風格，`post-verify` 看「寫的是不是真的」。只報告，**永不 auto-fix**。

## 何時用

| 工作 | skill |
|---|---|
| 標題弱、tldr 弱、tags 分裂 | `post-review` |
| 章節結構亂、缺參考資料 | `post-review` |
| 價格、版本、API、命令、日期、統計、引用是否正確 | `post-verify` |
| 改文章內容 | `post-update` |

## 執行步驟

### 1. 定位草稿

使用者指定的路徑或 slug。多個候選就列出讓使用者挑。

### 2. 抽出技術宣告

逐段掃描，抽得寧多勿少：

| 類別 | 例子 |
|---|---|
| 版本號 | Astro 6、LangGraph 1.x、Node 22.12 |
| API / 函式名 | `createServerClient`、`BedrockModel` |
| 定價 / 數量 | GPT-4 $30/M tokens、5,000 stars |
| 命令 / 旗標 | `wrangler secret put`、`--frozen-lockfile` |
| 日期 | 2024 年 11 月發布、2026 年 1 月 GA |
| 統計 / metric | 提升 40%、24 passed tests |
| 直接引用 | 名人引用、文件原文、論文句子 |
| 第三方事實 | 研究團隊、會議、官方宣布 |

每條記錄位置、原句、類別。

### 3. 逐條驗證

優先使用官方文件、release note、論文、官方 blog、GitHub release。Codex 可用 `web.run` 搜尋/開頁；Claude 可用可用的 MCP search/scrape 工具。不要只靠模型記憶。

來源數依風險決定：

| Claim 風險 | 例子 | 最低來源要求 |
|---|---|---|
| 高風險 | 價格、版本變更、release 日期、統計、benchmark、法律/政策、研究結論 | 2 個獨立來源；至少 1 個 authoritative source |
| 中風險 | API 名稱、命令、設定旗標、產品能力、整合限制 | 1 個 authoritative source 可判 Confirmed；來源模糊或矛盾時再找第 2 個 |
| 低風險 | 官方文件明確列出的基本名詞、套件名稱、站內已驗證命令片段 | 1 個 authoritative source，標明 single-source |
| 直接引用 | 名言、文件原文、論文句子 | 必須找到原始出處；找不到原文就是 Unverifiable |

Verdict：

| Verdict | 含義 |
|---|---|
| 🟢 Confirmed | 達到該風險等級來源要求，內容符合 |
| 🟢 Confirmed (single-source) | 低/中風險 claim 由一個明確 authoritative source 支持 |
| 🟡 Unverifiable | 找不到必要來源 / 內容已被改動 / 暫時搜不到 |
| 🟠 Outdated | 以前是真的，現在變了 |
| 🔴 Contradicted | 來源直接打臉 |

### 4. 報告格式

```
post-verify report: <slug>

🔴 Contradicted
1. 「...」（line 42）
   -> 來源顯示 ...
   -> 來源 1: ...
   -> 來源 2: ...
   建議修法：...

🟠 Outdated
- ...

🟡 Unverifiable
- ...

🟢 Confirmed
- ...
```

報告交付後 skill 結束。若使用者要修，改用 `post-update`。

## 反合理化

| 想偷懶 | 為什麼不行 |
|---|---|
| LLM 知道答案就判 Confirmed | Confirmed 必須有外部來源 |
| 每條都硬湊兩個來源 | 低風險官方文件事實不需要劣質二手來源 |
| 高風險 claim 只找一個來源 | 價格、版本、統計、研究結論容易過時或轉述錯 |
| 直接幫他改錯誤 | 真錯或表述不同由作者決定 |

## 詳細參考

- 寫作風格：`../post/references/writing-guide.md`
- 改文章流程：`post-update`
