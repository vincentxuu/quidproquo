# AI 免費額度混合分工規劃

**目標：** 善用四大平台的免費 AI 額度，為 quidproquo 建立零成本的 AI 推論管線，涵蓋 RAG、摘要、翻譯、embedding 等需求。

**原則：** 每個平台只做它最擅長且免費額度最充裕的事，避免重複消耗。

---

## 免費額度總覽

| 平台 | 免費額度 | 重點模型 | 重置週期 |
|------|---------|---------|---------|
| **Cloudflare Workers AI** | 10,000 neurons/天 | Llama 3.x, bge-base-en, m2m100, bart-large-cnn | 每日 |
| **Gemini API** | 1,500 RPD (Flash), 50 RPD (Pro) | Gemini 2.0 Flash, text-embedding-004 | 每日 |
| **Grok API (xAI)** | $25 免費額度/月 | Grok-3-mini, Grok-2 | 每月 |
| **GitHub Actions** | 2,000 分鐘/月 | N/A（算力平台，非模型） | 每月 |

---

## 分工架構

```
┌─────────────────────────────────────────────────┐
│                 GitHub Actions                   │
│         (排程觸發 & 批次處理編排器)                │
│    Cron: 每週日 / PR Preview / Push to main       │
└────────┬──────────────┬──────────────┬───────────┘
         │              │              │
         ▼              ▼              ▼
┌──────────────┐ ┌─────────────┐ ┌──────────────┐
│  Cloudflare  │ │   Gemini    │ │   Grok API   │
│  Workers AI  │ │   API       │ │   (xAI)      │
│              │ │             │ │              │
│ · Embedding  │ │ · 長文摘要   │ │ · 品質審核    │
│ · 翻譯       │ │ · 文章生成   │ │ · 創意寫作    │
│ · 即時推論   │ │ · 多語言理解 │ │ · 備援生成    │
│ · 分類/標籤  │ │ · 文件分析   │ │              │
└──────────────┘ └─────────────┘ └──────────────┘
```

---

## 各平台職責分配

### 1. Cloudflare Workers AI — 即時推論主力

**角色：** 邊緣端即時推論，處理高頻、低延遲任務

**負責任務：**

| 任務 | 模型 | 預估消耗 |
|------|------|---------|
| 文章 Embedding | `bge-base-en-v1.5` | ~1 neuron/request，每日可處理數千 chunk |
| 中英翻譯 | `m2m100-1.2b` | ~5 neurons/request |
| 文章自動摘要 (短文) | `bart-large-cnn` | ~10 neurons/request |
| 即時 RAG 回答 | `llama-3.1-8b-instruct` | ~50-100 neurons/request |
| 文章分類/標籤建議 | `llama-3.2-3b-instruct` | ~20 neurons/request |

**每日額度分配建議（10,000 neurons）：**
- Embedding: 3,000 neurons（~3,000 chunks）
- RAG 即時回答: 4,000 neurons（~40-80 次對話）
- 翻譯 + 摘要: 2,000 neurons
- 分類/標籤: 1,000 neurons

**優勢：** 已在 `wrangler.jsonc` 綁定 `AI`，零額外設定。與 D1、Vectorize、R2 同生態系，資料不出站。

---

### 2. Gemini API — 長文處理 & 高品質生成

**角色：** 處理需要大 context window（1M tokens）或高品質輸出的任務

**負責任務：**

| 任務 | 模型 | 額度消耗 |
|------|------|---------|
| 長文摘要 / TL;DR 生成 | Gemini 2.0 Flash | 1 RPD/篇 |
| 文章 SEO description 生成 | Gemini 2.0 Flash | 1 RPD/篇 |
| 多篇文章交叉分析 | Gemini 2.0 Flash | 1-5 RPD |
| Embedding 備援 | text-embedding-004 | 1 RPD/batch |
| 草稿品質評分 | Gemini 2.0 Flash | 1 RPD/篇 |

**每日額度分配建議（1,500 RPD Flash）：**
- 文章處理（摘要/SEO/TL;DR）: 200 RPD
- RAG 備援生成（CF Workers AI 額度用完時）: 800 RPD
- 文件分析 & 交叉分析: 300 RPD
- 預留緩衝: 200 RPD

**優勢：** 1M context window 可一次處理超長文件。免費額度最充裕。多語言理解原生支援中文。

**注意：** 免費版資料可能用於模型訓練，不適合處理敏感內容。

---

### 3. Grok API (xAI) — 品質審核 & 創意備援

**角色：** 低頻高價值任務，發揮 $25/月額度的最大效益

**負責任務：**

| 任務 | 模型 | 說明 |
|------|------|------|
| 文章品質審核 | Grok-3-mini | 發布前 final check，每篇 1 次 |
| 創意標題/描述改寫 | Grok-3-mini | 提供不同風格的標題選項 |
| 備援生成 | Grok-3-mini | Gemini / CF 額度耗盡時 fallback |
| 即時性內容增強 | Grok-2 | 需要最新資訊時（Grok 有即時搜尋能力） |

**月度額度使用建議（$25/月）：**
- 品質審核: ~$5（約 100-200 次 mini 呼叫）
- 創意寫作: ~$5
- 備援生成: ~$10
- 即時搜尋增強: ~$5

**優勢：** Grok 有即時網路搜尋能力，適合需要最新資訊的場景。Grok-3-mini 性價比高。

**注意：** 免費版 RPM 限制嚴格（~2-10 RPM），不適合高頻任務。

---

### 4. GitHub Actions — 批次編排器

**角色：** 定時觸發批次任務，編排跨平台 AI 呼叫

**負責任務：**

| 任務 | 觸發方式 | 說明 |
|------|---------|------|
| 新文章 Embedding 同步 | Push to main | 偵測新/改文章 → 呼叫 CF Workers AI embedding |
| 每週內容分析報告 | Cron (週日) | 呼叫 Gemini 分析一週文章趨勢 |
| 爬蟲資料更新 | Cron (週日) | 觸發 `/api/crawl/sync` → 重新 embed |
| SEO 優化批次 | Cron (月初) | 掃描缺少 description 的文章 → Gemini 生成 |
| 健康檢查 | Cron (每日) | 驗證各 AI API 額度是否正常 |

**月度分鐘使用建議（2,000 min）：**
- CI/CD (lint + build + deploy): ~200 min
- 批次 AI 任務: ~300 min
- Preview 部署: ~200 min
- 預留緩衝: ~1,300 min

---

## Fallback 策略（額度耗盡時的降級方案）

```
優先順序：
1. Cloudflare Workers AI（每日重置，通常最先恢復）
2. Gemini API（每日重置，額度充裕）
3. Grok API（月度重置，省著用）

降級邏輯：
RAG 即時回答:  CF Workers AI → Gemini Flash → Grok-3-mini → 靜態搜尋（Pagefind）
Embedding:      CF Workers AI (bge) → Gemini (text-embedding-004) → 暫停入庫
翻譯:           CF Workers AI (m2m100) → Gemini Flash → 顯示原文
摘要:           CF Workers AI (bart) → Gemini Flash → 截取前 200 字
```

---

## 實作建議

### 統一 Provider 介面

```typescript
// src/lib/ai/provider.ts
interface AIProvider {
  generate(prompt: string, opts?: GenerateOpts): Promise<string>
  embed(text: string): Promise<number[]>
  isAvailable(): Promise<boolean>  // 檢查額度是否充足
}

// 實作各 provider
class CloudflareAIProvider implements AIProvider { ... }
class GeminiProvider implements AIProvider { ... }
class GrokProvider implements AIProvider { ... }

// 帶 fallback 的統一入口
class AIRouter {
  private providers: AIProvider[]

  async generate(prompt: string, opts?: GenerateOpts): Promise<string> {
    for (const provider of this.providers) {
      if (await provider.isAvailable()) {
        return provider.generate(prompt, opts)
      }
    }
    throw new Error('All AI providers exhausted')
  }
}
```

### 額度追蹤

```typescript
// 用 D1 記錄每日/月度使用量
// src/lib/ai/quota-tracker.ts
interface QuotaRecord {
  provider: 'cloudflare' | 'gemini' | 'grok'
  date: string        // YYYY-MM-DD
  requests: number
  tokens_used: number
  neurons_used?: number  // CF only
}
```

### 環境變數

```toml
# wrangler.jsonc 新增
[vars]
GEMINI_API_KEY = ""        # Google AI Studio API Key
GROK_API_KEY = ""          # xAI Console API Key

# Secrets (不寫在設定檔)
# wrangler secret put GEMINI_API_KEY
# wrangler secret put GROK_API_KEY
```

---

## 每月預估成本

| 項目 | 成本 |
|------|------|
| Cloudflare Workers AI | $0（10K neurons/天免費） |
| Gemini API | $0（1,500 RPD 免費） |
| Grok API | $0（$25/月免費額度） |
| GitHub Actions | $0（2,000 min/月免費） |
| **總計** | **$0/月** |

---

## 每日處理量預估

以 100% 使用免費額度計算：

| 指標 | 每日 | 每月 |
|------|------|------|
| RAG 對話次數 | 40-80 次 | 1,200-2,400 次 |
| 文章 Embedding | 3,000 chunks | 90,000 chunks |
| 翻譯請求 | 200-400 次 | 6,000-12,000 次 |
| 摘要生成 | 100-200 篇 | 3,000-6,000 篇 |
| 品質審核 | 3-5 篇 | 100 篇 |

---

## 下一步

- [ ] 建立 `src/lib/ai/provider.ts` 統一介面
- [ ] 實作 `CloudflareAIProvider`（最高優先，已有 binding）
- [ ] 實作 `GeminiProvider`（第二優先）
- [ ] 實作 `GrokProvider`（第三優先）
- [ ] 建立 `src/lib/ai/router.ts` fallback 路由
- [ ] 建立 `src/lib/ai/quota-tracker.ts` 額度追蹤
- [ ] 新增 GitHub Actions workflow: `ai-batch.yml`
- [ ] 整合到現有 RAG Phase 1 計畫
