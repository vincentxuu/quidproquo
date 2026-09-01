---
name: daily-digest-model-card
description: "Routine C: event-driven new AI model detection and model card generation for quidproquo.cc/daily. No new model = no output."
---

# daily-digest-model-card

偵測新 AI 模型發佈並產出模型卡。事件驅動——沒有新模型就不產出任何檔案。

---

## 執行流程

```bash
# Step 1: 準備
git checkout main
git pull origin main
TODAY=$(TZ=Asia/Taipei date +%Y-%m-%d)

# Step 2: 讀 watchlist 找出 A1/A2 的模型廠商清單
cat src/data/agent-watchlist.json | jq '.companies[] | select(.section == "A1" or .section == "A2") | .name'

# Step 3: 執行「搜尋方法」偵測新模型（3a HF API + 3b 搜尋引擎 + 3c 官方 blog）
# Step 4: 兩層過濾 → 判斷是否有值得寫的新模型
# Step 5: 對每個新模型執行「詳情抓取」
# Step 6: 依「輸出格式」撰寫模型卡
# Step 7: 提交
git add src/content/posts/daily/${TODAY}-model-*.md
git commit -m "post(daily): model card ${TODAY}"
git push origin main || { git pull --rebase origin main && git push origin main; }
```

---

## 搜尋工具優先順序

| 用途 | 工具 | 說明 |
|---|---|---|
| **HuggingFace 趨勢** | Groundlane web_fetch 打 HF API | 結構化 JSON，最精確 |
| **搜尋/發現** | Groundlane `web_search` | 合併結果去重，覆蓋面最廣 |
| **特定頁面抓取** | Groundlane `web_fetch` | 已知 URL 的頁面內容擷取 |
| **結構化 API** | 直接呼叫（arxiv API、GitHub `gh` CLI） | 有 API 的來源不用搜尋工具 |

### Groundlane 工具契約

公開網頁研究與抓取一律使用 Groundlane MCP：`web_search` 找候選來源、`web_fetch` 讀已知 URL 或全文、`web_extract` 做 selector/table 欄位抽取。若最外層 tool list 沒看到 Groundlane，先檢查完整 callable tool inventory（含 deferred MCP tools）；仍沒有就回報 blocker。若 Groundlane 已掛載但 authorization 失敗，回報 blocker，並請使用者依 Groundlane free API / free tier 使用方式完成授權或修正 connector credential。不要自行改用 `web.run`、WebFetch、Playwright scraping、Exa、Tavily、Firecrawl、Jina、Linkup、`stealth_fetch`、`web-fetch` 或 `fetch_page`。

---

## 搜尋方法

### Step 3a：HuggingFace API 掃描（首要訊號源）

直接打 HuggingFace REST API，取得結構化 trending 資料。比搜尋引擎 `site:huggingface.co` 精確且不吃搜尋額度。

```
工具：Groundlane MCP → web_fetch
format: "text"（回傳 JSON）
```

| 查詢 | URL | 目標 |
|---|---|---|
| T1 | `https://huggingface.co/api/models?sort=likes7d&direction=-1&limit=30&filter=text-generation` | 文字生成模型 7 日 trending |
| T2 | `https://huggingface.co/api/models?sort=likes7d&direction=-1&limit=15&filter=image-text-to-text` | 多模態模型 7 日 trending |
| T3 | `https://huggingface.co/api/models?sort=likes7d&direction=-1&limit=10&filter=text-to-image` | 圖像生成模型 7 日 trending |
| T4 | `https://huggingface.co/api/models?sort=likes7d&direction=-1&limit=10&filter=text-to-video` | 影片生成模型 7 日 trending |

回傳 JSON 包含：`id`、`likes`、`trendingScore`、`downloads`、`tags`（含 `base_model`）、`createdAt`、`pipeline_tag`。

### Step 3b：搜尋引擎掃描（補充訊號）

用 Groundlane `web_search` 搜尋，捕捉 HF API 漏掉的閉源模型和官方公告。

```
工具：Groundlane MCP → web_search
每組查詢設定：
  max_results: 10
  published_after: "{昨天的 ISO 日期}"
  provider: "auto"
```

| 查詢編號 | query | 目標 |
|---|---|---|
| Q1 | `"new AI model" OR "model release" OR "model announcement" Claude OR GPT OR Gemini OR Llama` | 大廠閉源模型發佈 |
| Q2 | `"AI model launch" OR "foundation model" OR "open source model" Mistral OR Cohere OR DeepSeek OR Qwen OR GLM OR Yi OR MiniMax OR Phi` | 開源生態重要廠商 |

### 注意：Groundlane `web_search` 查詢執行

```
工具：Groundlane MCP → web_search
query: "new AI model released today 2026"
time_range: "day"
max_results: 5
```

### Step 3c：檢查官方 blog（Groundlane `web_fetch`）

只有在 Step 3a/3b 有初步信號時才做（避免每天空跑）。
針對信號中提到的廠商，抓其官方 blog 確認是否有正式公告：

```
工具：Groundlane MCP → web_fetch
url: "{vendor blog URL}"
format: "markdown"
```

| 廠商 | Blog URL |
|---|---|
| Anthropic | https://www.anthropic.com/news |
| OpenAI | https://openai.com/blog |
| Google | https://blog.google/technology/ai/ |
| Meta | https://ai.meta.com/blog/ |
| Mistral | https://mistral.ai/news/ |
| DeepSeek | https://api-docs.deepseek.com/news |
| Qwen (阿里) | https://qwenlm.github.io/blog/ |
| 智譜 Zhipu | https://zhipuai.cn/news |
| MiniMax | https://www.minimax.io/news |
| 01.AI (Yi) | https://01.ai/blog |
| Microsoft (Phi) | https://www.microsoft.com/en-us/research/blog/ |
| Stability AI | https://stability.ai/news |
| xAI (Grok) | https://x.ai/blog |

---

## 兩層過濾（Step 4）

### 第一層：去重到 base model

HF API 回傳的 `tags` 裡包含 `base_model:Qwen/Qwen3.8-27B` 之類的 tag。
所有帶 `base_model:*` tag 的衍生版歸到同一個 base model，只保留 base 本身或 trendingScore 最高的那個。

**直接排除**（不進第二層）：
- 純量化重新打包（GGUF / MLX / FP8 / AWQ / GPTQ），辨識方式：model ID 包含量化格式詞且上傳者非官方 org
- uncensored / abliterated 衍生版
- 同一 base model 的多個量化帳戶版本（unsloth、bartowski、TheBloke 等量化專戶）

### 第二層：判斷值不值得寫模型卡

去重後的候選，符合**任一條件**即觸發：

**A. 新 base model（最重要）**：
- `createdAt` 在 7 天內
- 沒有 `base_model:*` tag（自己就是原創 base）
- likes > 50
- 來自任何 org，不限 A1/A2 watchlist

**B. 官方公告確認的新模型**：
- 搜尋結果或 blog 掃描發現正式公告
- 不論開源或閉源

**C. 技術突破型衍生**：
- 有具體新方法（如投機解碼、新量化演算法、架構改良）
- 不是單純重新打包，而是有論文或技術文章支撐
- 在 model card 中以「技術突破」角度寫，而非當成新模型

**D. 社群爆量訊號**：
- 7 日 trendingScore 前 3
- 且 downloads > 100k
- 且不屬於上面排除的類別

**不觸發**（跳過）：
- API 功能更新但不是新模型（如新增 function calling 支援）
- 已經寫過模型卡的 base model 的後續衍生版（除非符合條件 C）
- 模型微調版本（fine-tune、adapter）——除非有重大性能提升且被廣泛採用

---

## 詳情抓取

### Step 5：取得模型完整資訊

**官方公告頁**（Groundlane 優先）——提取：
- 模型名稱 / Model ID（API 呼叫用的 ID，如 `claude-4-opus-20260815`）
- 參數量
- Context Window
- 支援的模態（text / vision / audio / code）
- 授權條款（Apache-2.0 / MIT / custom 等）

**HuggingFace 模型頁**（開源模型必抓）：
```
工具：Groundlane MCP → web_fetch
url: "https://huggingface.co/{model_id}"
format: "markdown"
```
提取 README 中的架構描述、benchmark 數據、使用方式。

**定價頁**（閉源模型或提供 API 的開源模型）——提取精確定價：

```
# Anthropic
web_fetch url: "https://www.anthropic.com/pricing"

# OpenAI
web_fetch url: "https://openai.com/api/pricing/"

# Google
web_fetch url: "https://ai.google.dev/pricing"

# DeepSeek
web_fetch url: "https://api-docs.deepseek.com/quick_start/pricing"
```

定價必須精確到小數（如 `$3.00 / 1M input tokens`），**不可寫「約」**。
開源模型若無官方 API 定價，可附第三方推論服務定價（Together、Fireworks 等）並標明來源。

**Benchmark 數據**——從公告中提取，或搜尋：
```
工具：Groundlane MCP → web_search
query: "{model_name} benchmark results MMLU SWE-bench"
max_results: 5
```

---

## 輸出格式

### 檔名

`src/content/posts/daily/${TODAY}-model-{model-slug}.md`

model-slug 規則：廠商-模型名稱，kebab-case（如 `anthropic-claude-4-5`、`openai-gpt-5`、`ornith-ai-ornith-1-5`）

### Frontmatter

```yaml
---
title: "模型卡｜{Model Name}"
date: YYYY-MM-DD
category: daily
tags: [ai-agent, model-release, daily, {vendor-slug}]
lang: zh-TW
description: "一句話概述新模型的定位和最大亮點"
tldr: "模型名稱、核心數字（context window、定價、關鍵 benchmark）、對 Agent 開發的意義"
series:
  name: "AI Model Tracker"
  order: N
glossary:
  - term: "{model family name}"
    def: "{一句話定義，如 Qwen：阿里通義千問開源模型家族}"
---
```

#### family tag（橋接家族系列文章）

在 frontmatter 的 `tags` 裡加入家族 tag，格式為 `model-family-{family-slug}`。
例如：`model-family-qwen`、`model-family-deepseek`、`model-family-llama`。

用途：週回顧 Routine L 可以查詢某家族累積了多少模型卡，判斷是否需要更新對應的 tech 家族系列文章。

### 內容結構（嚴格按以下順序和格式）

```markdown
## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | {API 呼叫用的完整 ID} |
| 廠商 | {公司名稱} |
| 參數量 | {如 200B，未公開寫「未公開」} |
| Context Window | {如 1M tokens} |
| Input 定價 (USD/1M tokens) | {精確到小數，如 $3.00} |
| Output 定價 (USD/1M tokens) | {精確到小數，如 $15.00} |
| 開源 | {是（授權名稱）/ 否} |
| 發布日 | {YYYY-MM-DD} |
| 官方公告 | [{廠商} Blog]({url}) |
| HuggingFace | [{model_id}]({url})（開源模型才填）|
| 家族 | {家族名稱}（如 Qwen 3.x、DeepSeek V4）|

## 能力亮點

{2-4 個 bullet，每個用一句話說明一個能力突破。
 必須包含具體數字（如「在 SWE-bench Verified 達 72.3%」）。}

## Benchmark 表現

| Benchmark | 分數 | 前代模型 | 競品最強 |
|---|---|---|---|
| {benchmark 名} | {分數} | {前代分數} | {競品名 + 分數} |

{列出 3-5 個最重要的 benchmark。⚠️ 標注自測結果。}

## 與前代/競品比較

{2-3 段分析。不只列數字，要回答：
 1. 比前代進步最大的是什麼？
 2. 跟競品比，贏在哪、輸在哪？
 3. 定價策略有什麼變化？}

## 對 Agent 開發的意義

{2-3 段分析，回答：
 1. 這個模型對 Agent 架構設計有什麼影響？（如 context window 變大 → 可以省掉 RAG？）
 2. 適合什麼樣的 Agent 場景？
 3. 不適合什麼？
 用「如果你在做 X：」的句式給具體建議。}

## 今日收穫

{1-3 句認知差。}
```

---

## 完整範例

```markdown
---
title: "模型卡｜Claude 4.5 Sonnet"
date: 2026-08-15
category: daily
tags: [ai-agent, model-release, daily, anthropic, model-family-claude]
lang: zh-TW
description: "Anthropic 發佈 Claude 4.5 Sonnet——1M context、$3/$15 定價、SWE-bench 72.3%，首次原生支援 MCP server 端執行"
tldr: "Claude 4.5 Sonnet：1M context window、input $3/output $15 per 1M tokens、SWE-bench Verified 72.3%（前代 4 Sonnet 為 64.1%）、首次支援 MCP server 端執行讓 Agent 可以作為 MCP tool provider"
series:
  name: "AI Model Tracker"
  order: 12
glossary:
  - term: "Claude"
    def: "Anthropic 開發的大型語言模型家族"
---

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `claude-4-5-sonnet-20260815` |
| 廠商 | Anthropic |
| 參數量 | 未公開 |
| Context Window | 1,000,000 tokens |
| Input 定價 (USD/1M tokens) | $3.00 |
| Output 定價 (USD/1M tokens) | $15.00 |
| 開源 | 否 |
| 發布日 | 2026-08-15 |
| 官方公告 | [Anthropic Blog](https://www.anthropic.com/news/claude-4-5-sonnet) |
| 家族 | Claude 4.x |

## 能力亮點

- SWE-bench Verified 達 72.3%，比前代 Claude 4 Sonnet（64.1%）提升 8.2 個百分點
- 原生 MCP server-side execution：模型可以直接作為 MCP tool provider，不只是 client
- Extended thinking 模式下推理步數上限從 16 步提升到 64 步
- 多語言程式碼生成：HumanEval 從 92.1% 提升到 96.8%

## Benchmark 表現

| Benchmark | 分數 | 前代 (4 Sonnet) | 競品最強 |
|---|---|---|---|
| SWE-bench Verified | 72.3% | 64.1% | GPT-5 71.8% |
| MMLU-Pro | 89.2% | 84.5% | Gemini Ultra 2 88.7% |
| HumanEval | 96.8% | 92.1% | GPT-5 95.3% |
| tau-bench (airline) | 68.5% | 55.2% | GPT-5 62.1% |

⚠️ 以上均為 Anthropic 自測，需等外部複現。SWE-bench Verified 分數已由 OpenAI 獨立團隊確認。

## 與前代/競品比較

跟 Claude 4 Sonnet 比，最大進步在 Agent 任務：tau-bench 從 55.2% 跳到 68.5%（+13.3pp），這代表在需要多輪工具呼叫的場景，成功率顯著提升。SWE-bench 的 72.3% 也是目前最高，但只比 GPT-5 的 71.8% 高 0.5pp——差距在誤差範圍內。

定價維持 $3/$15 不變（跟 Claude 4 Sonnet 一樣），在性能提升的前提下等於隱性降價。相比之下 GPT-5 的定價是 $5/$20，每 1M tokens 貴 67%（input）。

## 對 Agent 開發的意義

MCP server-side execution 是這次最大的架構變化。之前 Claude 只能作為 MCP client（呼叫別人提供的工具），現在可以作為 tool provider——這意味著你可以把 Claude 包成一個 MCP server，讓其他 Agent 呼叫它的特定能力。

- 如果你在做多 Agent 系統：Claude 4.5 可以作為「專家 Agent」被其他 Agent 透過 MCP 呼叫，不需要自己寫 adapter
- 如果你在做 coding Agent：SWE-bench 72.3% + 64 步 extended thinking 代表複雜多步驟 debug 的成功率會明顯提升
- 不適合：需要即時回應的場景（extended thinking 的延遲增加 2-3 倍），以及需要最低成本的高吞吐量批次處理（Haiku 更適合）

## 今日收穫

之前以為 MCP 的角色分工是固定的——模型永遠是 client、工具永遠是 server。Claude 4.5 的 server-side execution 打破了這個假設：模型本身也可以是 tool provider，這讓多 Agent 架構的彈性大增。
```

---

## 品質檢查清單（撰寫完成後逐項確認）

- [ ] Model ID 用 API 呼叫的完整 ID（如 `claude-4-5-sonnet-20260815`）
- [ ] 定價精確到小數，不寫「約」
- [ ] Context Window 寫具體數字
- [ ] Benchmark 表列出至少 3 個，含前代和競品比較
- [ ] 自測結果標注 ⚠️
- [ ] 「對 Agent 開發的意義」有具體的「如果你在做 X：」建議
- [ ] 官方公告有完整 URL
- [ ] 「今日收穫」是認知差，不是摘要
- [ ] description 和 tldr 已填寫
- [ ] `tags` 包含 `model-family-{family-slug}` 家族 tag
- [ ] 模型資訊表包含「家族」和「HuggingFace」欄位（開源模型）
- [ ] 文末有「## 參考資料」區段，每個事實主張附連結（`pnpm check:references` 會擋）
