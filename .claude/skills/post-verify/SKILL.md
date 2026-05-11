---
name: post-verify
description: Fact-layer verification for a post draft under src/content/posts/<category>/ — extract every technical claim (version numbers, API names, prices, commands, dates, metrics, quoted statistics), cross-check each against current authoritative sources via MCP search/scrape (tavily / exa / firecrawl), and produce a verdict report (Confirmed / Outdated / Unverifiable / Contradicted). Does NOT modify the file. Complementary to `post-review` (which covers style/structure). Use when user says verify 一下 / 查證 / 對一下事實 / fact check / 確認版本 / 驗證 and references a draft post.
---

# post-verify skill

發文前的事實層審查。`post-review` 看格式與風格，**`post-verify` 看「寫的是不是真的」**。模型訓練資料截止會讓 LLM 自信地寫出過時的版本號、API 名稱、定價——這個 skill 抓的就是那些。

只報告，**永不 auto-fix**——是真錯還是只是換個說法，由使用者決定。

## 何時用 vs 跟其他 skill 區分

| 工作 | skill |
|---|---|
| 標題弱、tldr 沒數字、tags 分裂 | `post-review` |
| 章節結構亂、缺 `## 參考資料` | `post-review` |
| 「OpenAI 的 GPT-4 售價 $X」是不是真的 | **`post-verify`** |
| 「LangGraph 1.x breaking change 是 Y」是不是真的 | **`post-verify`** |
| 命令 `pnpm dlx foo` 是不是還能用 | **`post-verify`** |
| 改文章內容 | `post-update` |

## 工具映射

跟 `deep-research` 一樣的工具家族；目的不同。CLAUDE.md 規定：**不用內建 WebFetch / Playwright，只用 MCP**。

| 用途 | 首選 |
|---|---|
| 找官方頁面 | `tavily_search`、`exa_web_search` |
| 抓官方文件 / release note 內容 | `firecrawl_scrape`、`tavily_extract` |
| 程式碼 / GitHub 議題 / API spec 導向 | `exa_web_search` + `firecrawl_scrape` |
| 多版本快速比對 | `tavily_search` 用 `time_range: month/year` |

## 執行步驟

### 1. 定位草稿

使用者指定的路徑或 slug。多個候選 → 列出讓使用者挑。

### 2. 抽出所有技術宣告

逐段掃描，分類列出。**抽得寧多勿少**——少抽一條等於漏掉一個風險。

| 類別 | 例子 |
|---|---|
| 版本號 | "Astro 6"、"LangGraph 1.x"、"Node 22.12" |
| API / 函式名 | "createServerClient"、"BedrockModel"、"@tool 裝飾子" |
| 定價 / 數量 | "GPT-4 $30/M tokens"、"5,000 stars in days" |
| 命令 / 旗標 | "wrangler secret put X"、"--frozen-lockfile" |
| 日期 | "2024 年 11 月發布"、"2026 年 1 月 GA" |
| 統計 / metric | "提升 40% 可見度"、"24 passed tests" |
| 直接引用 | 「Karpathy 說："xxx"」 |
| 第三方事實 | "Anthropic 在 KDD 2024 發表"、"Princeton 研究團隊" |

每條紀錄：
- 出現位置（行號或段落）
- 原句
- 類別

### 3. 逐條驗證（每條 ≥ 2 來源）

對每條 claim：

1. `tavily_search` / `exa_web_search` 找權威來源（官方文件 / release note / 論文 / 官方 blog 為優先）
2. `firecrawl_scrape` 或 `tavily_extract` 抓內容
3. 跟 claim 比對

來源排序：

```
官方 release / docs / 論文  >  作者本人 (X / blog) > 高品質二手  >  內容農場（跳過）
```

每條給 verdict：

| Verdict | 含義 |
|---|---|
| 🟢 Confirmed | 兩個獨立來源都符合 |
| 🟡 Unverifiable | 找不到第二來源 / 內容已被改動 / 暫時搜不到 |
| 🟠 Outdated | 來源支持「以前是真的，現在已經變了」 |
| 🔴 Contradicted | 來源直接打臉 |

### 4. 產出報告

```
post-verify report: <slug>
─────────────────────────

🔴 Contradicted (要修)
1. 「GPT-4 input $30/M tokens」（line 42）
   → 官方目前 GPT-4.1 input $3/M tokens（2026-05 platform.openai.com 定價頁）
   → 來源 1: https://openai.com/api/pricing
   → 來源 2: https://platform.openai.com/docs/pricing
   建議修法：改寫成「GPT-4.1 input $3/M tokens（2026-05）」

🟠 Outdated (建議修)
2. 「LangGraph 預設 InMemorySaver」（line 88）
   → 1.0 後預設改用 ... 詳見 release note

🟡 Unverifiable (待人工確認)
3. 「Princeton 研究中 keyword stuffing 表現 -9%」（line 130）
   → arxiv 2311.09735 abstract 沒列 -9%；Performance Department 整理表有 -9%
   → 建議引用 Performance Department 的 breakdown 文章作為二手對應

🟢 Confirmed (不必動)
4. 「Astro 6 SSR mode」 ✓
5. 「Cloudflare Workers 支援 D1 / Vectorize / KV」 ✓
...
```

### 5. 永不 auto-fix

| 真錯 / 只是表達不同 / 故意保留歷史背景 | 由使用者決定 |
|---|---|
| 改寫法 / 加 disclaimer / 完全保留 | 由使用者決定 |
| 全文搜尋還有沒有同類錯誤 | 使用者要才做 |

報告交付後 skill 結束。如果使用者要修，**改用 `post-update` skill**。

## 反合理化

| 想偷懶 | 為什麼不行 |
|---|---|
| 「LLM 知道答案就直接判 Confirmed」 | LLM 訓練資料截止；Confirmed 必須有兩個獨立 web 來源 |
| 「找到一個來源就下判斷」 | 一手來源也會錯版本；至少兩源是底線 |
| 「直接幫他改錯誤」 | 是不是真錯只有作者知道；auto-fix 會導入新錯誤 |
| 「Confirmed 的不報」 | 報告 Confirmed 的避免使用者重複自查 |
| 「跳過 quoted 引用，反正引用一定對」 | 名言類引用最常被 LLM 誤記，要查原始出處 |
| 「Unverifiable 直接判錯」 | 找不到不等於錯，要明確標 Unverifiable |

## 跟既有 skill 的關係

```
   post (新文)              post-update (改舊文)
        │                          │
        ▼                          ▼
   post-review (style)        post-verify (fact)
        │                          │
        └──────── 報告 ───────────┘
                    │
                    ▼
               使用者決定要修哪些
                    │
                    ▼
              post-update 動手改
```

`post-review` 與 `post-verify` 可以同時跑（不衝突），但兩個 skill 報告分開閱讀，不要混在一起。

## 詳細參考

- 寫作風格與 GEO 規則：`../post/references/writing-guide.md`
- frontmatter schema：`../post/references/frontmatter-schema.md`
- 改文章流程：`post-update` skill
