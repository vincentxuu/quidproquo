---
title: "用 Cloudflare Workers AI 把前端 mock 變成真的：action-maker AI 整合全記錄"
date: 2026-03-24
category: tech
tags: [cloudflare-workers, hono, workers-ai, qwen3, langfuse, nextjs, postgresql]
lang: zh-TW
tldr: "把 action-maker 從假資料升級為 Cloudflare Workers AI 即時生成，架構拆成 Worker（純 AI）、Server（存資料）、Frontend（串接），踩了 Qwen3 thinking block 和 Workers AI response 格式兩個坑。"
description: "從產品需求到架構設計到實作踩坑，完整記錄如何用 Cloudflare Workers AI + Hono 建構 AI 行動建議生成服務，整合 PostgreSQL 紀錄追蹤與 Next.js 前端。"
draft: false
---

## TL;DR

把 action-maker 從假資料升級為 Cloudflare Workers AI 即時生成，架構拆成 Worker（純 AI）、Server（存資料）、Frontend（串接），踩了 Qwen3 thinking block 和 Workers AI response 格式兩個坑。

## 為什麼要做這件事

島島阿學有一個 action-maker 功能，用戶選一個分類（興趣、健康、學習...）輸入目標，系統生成三個難度的行動建議（初學/中級/進階）。問題是：這些建議是假的。前端 `setTimeout(800ms)` 之後回傳寫死的靜態資料，每次看到一樣的東西。

要讓它變真的，需要接 AI。但不只是接上去就好——用戶選完行動之後呢？以前是到結果頁就死路了，只能分享或重玩。真正該做的是讓用戶可以直接從結果「開始實踐」，建立一筆 practice 到 DB 裡追蹤。

同時還有一個場景：用戶選「我想自己設定」的時候，填了一個粗略的想法（「每天練吉他」），AI 應該要能幫他潤色成更具體的版本（「每天 15 分鐘練習 C、G、Am、F 四個和弦轉換，搭配節拍器從 60 BPM 開始」），但最終決定權在用戶手上。

所以這次要做三件事：AI 生成、AI 協作潤色、建立 practice 串接。

## 架構：誰該負責什麼

最關鍵的決策是 Worker 和 Server 的分工。三個方案擺在面前：

- **Worker 直連 DB**：少一跳，但 Worker 要處理 DB 邏輯，跟 Server 重複
- **Worker 呼叫 Server 存資料**：Worker 多一個 HTTP call，但職責單一
- **Worker 只管 AI，存資料全交給前端和 Server**：最簡單，但前端不一定有 user_id（生成不需登入）

選了第三個的變體：Worker 生成完後，自己背景呼叫 Server internal API 存紀錄（不阻塞回應），前端負責建立 practice 和回報用戶互動。

```
Frontend
  ├─ POST Worker /action-maker/generate    → AI 生成 3 個 actions
  ├─ POST Worker /action-maker/refine      → AI 潤色自訂 action
  ├─ POST Server /api/v1/practices         → 建立 practice（需登入）
  └─ PATCH Server /api/v1/ai-generations   → 回報用戶選了什麼

Worker
  ├─ Workers AI (Qwen3) → 生成內容
  ├─ Langfuse → 追蹤每次 AI call
  └─ POST Server /api/internal/ai-generations → 存紀錄（背景、5s timeout）

Server
  ├─ POST /api/internal/ai-generations → Worker 存紀錄（API Key 驗證）
  ├─ PATCH /api/v1/ai-generations/:sessionId → 前端回報互動（JWT 驗證）
  └─ POST /api/v1/practices → 既有的建立 practice API
```

核心原則：Worker 不碰 DB，不碰認證，只管「問 AI、拿答案」。存資料的事讓 Server 做，它本來就在做這件事。

## DB 設計：通用的 ai_generations

不只為 action-maker 設計，而是建了一張通用的 `ai_generations` table，用 `feature` + `action_type` 區分：

```sql
CREATE TABLE ai_generations (
    id SERIAL PRIMARY KEY,
    external_id UUID UNIQUE DEFAULT gen_random_uuid(),
    feature VARCHAR(50) NOT NULL,        -- 'action-maker', 未來 'checkin-encourage'
    action_type VARCHAR(20) NOT NULL,    -- 'generate', 'refine'
    session_id VARCHAR(64),              -- 前端生成的 UUID，串聯整個流程
    ip_hash VARCHAR(16),                 -- SHA-256 前 8 bytes，不存原始 IP
    user_id INT REFERENCES users(id),    -- nullable，生成時可能未登入
    status VARCHAR(20) DEFAULT 'success',
    input JSONB NOT NULL,
    output JSONB,                        -- nullable，AI 失敗時沒有 output
    model VARCHAR(100),
    latency_ms INT,
    user_interaction JSONB,              -- 前端後續回報：選了什麼、有沒有建立 practice
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

input/output 用 JSONB，不同 feature 結構不同但不用改 schema。`session_id` 讓同一用戶的 generate → refine → 建立 practice 可以串在一起分析。

之後想知道「AI 生了什麼 → 用戶選了什麼 → 有沒有真的去做」，一條 query 就搞定。

## Worker 實作：Hono + Workers AI

Tech stack 很輕量：Hono 做路由、Cloudflare KV 做 rate limit、Workers AI 跑推論。

### Rate Limit

用 factory pattern，generate 和 refine 共用同一個計數池：

```typescript
const rateLimiter = createRateLimiter("action-maker");

actionMakerRouter.post("/generate", rateLimiter, async (c) => { ... });
actionMakerRouter.post("/refine", rateLimiter, async (c) => { ... });
```

每個 IP 10 分鐘 5 次（generate + refine 合計）。KV 存 `{ count, resetAt }` 加上 TTL 自動過期。

### Prompt 設計

system prompt 指定 JSON 結構、字數限制、規則。支援 zh-TW 和 en 兩種 locale。關鍵是要夠具體：

```
你必須只回傳合法的 JSON 物件，不得包含 markdown、解釋文字或任何其他內容。
JSON 必須符合以下結構：
{
  "actions": [
    {
      "id": "<categoryId>-beginner-001",
      "categoryId": "<categoryId>",
      "level": "beginner",
      "locked": false,
      "title": "簡潔具體的行動標題",
      ...
    }
  ]
}
固定回傳 3 個行動（beginner、intermediate、advanced 各一）
```

refine 的 prompt 則是「保留用戶核心意圖，根據等級調整難度」，輸入用戶的粗略想法，輸出完善版本。

## 踩坑一：Qwen3 的 thinking block

Qwen3 是個 thinking model，會在正式回答前先「思考」：

```
<think>
用戶想學吉他，我應該根據不同等級設計行動...
初學者可以從基礎和弦開始...
</think>

{
  "actions": [...]
}
```

直接 `JSON.parse()` 一定炸。解法是先 strip 掉 `<think>` block：

```typescript
const cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
```

然後先嘗試直接 parse，失敗再用 regex 提取：

```typescript
let parsed;
try {
  parsed = JSON.parse(cleaned);
} catch {
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found");
  parsed = JSON.parse(jsonMatch[0]);
}
```

## 踩坑二：Workers AI 的 response 格式

文件說 Workers AI 回傳 `{ response: "..." }`，實測回來的是 OpenAI-compatible chat completion 格式：

```json
{
  "id": "chatcmpl-xxx",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "<think>...</think>\n{...}"
    }
  }]
}
```

兩種格式都要處理：

```typescript
let text: string;
if (typeof response === "string") {
  text = response;
} else if (typeof response === "object" && response !== null) {
  const r = response as Record<string, unknown>;
  if ("response" in r) {
    text = String(r.response);
  } else if ("choices" in r && Array.isArray(r.choices)) {
    const choices = r.choices as Array<{ message?: { content?: string } }>;
    text = choices[0]?.message?.content ?? "";
  } else {
    text = JSON.stringify(response);
  }
} else {
  text = JSON.stringify(response);
}
```

不判斷的話，`String(response)` 會得到 `[object Object]`，然後 JSON.parse 噴 "No JSON found"。debug 的時候還以為是 AI 沒回東西，其實回了，只是包在另一層裡。

## 前端：從 mock 到真實 AI

原本的 hook：

```typescript
// 假裝等 0.8 秒
await new Promise((r) => setTimeout(r, 800));
const fallback = getFallbackActions(input.category);
setActions(fallback);
```

改成：

```typescript
const response = await fetch(`${WORKER_URL}/action-maker/generate`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ category, topic, tags, locale, session_id }),
  signal: controller.signal,
});
```

Worker 掛了就 fallback 回靜態資料，用戶不會感覺到差異。加了 `isFallback` flag 讓 UI 可以顯示「這是預設建議」。

### AI 協作自訂

「我想自己設定」的流程從單純填表變成四步：

1. **選強度** — 初學 / 中級 / 進階
2. **填想法** — 標題 + 描述
3. **AI 潤色** — 呼叫 `/action-maker/refine`，或跳過直接用原本的
4. **比較選擇** — 採用 AI 版 / 自己修改 / 用原本的

用戶永遠有最終決定權。AI 只是提供一個更具體的版本參考。

### 結果頁建立 practice

結果頁加了「開始實踐」按鈕。沒登入會彈登入框，登入後自動建立 practice：

```typescript
const { data } = await createPractice({
  title: result.action.title,
  practiceAction: result.action.description,
  otherContext: result.triggerTiming,
  tags: [result.category],
  startDate: new Date().toISOString().split("T")[0],
  durationDays: 14,
  frequencyMinDays: 1,
  frequencyMaxDays: 1,
});
```

建完跳轉到 practice 頁面。用戶從「看到建議」到「開始追蹤」一氣呵成。

## 安全面

幾個注意到的點：

- **Internal API Key 用 timing-safe 比較**：`crypto.timingSafeEqual` 防 timing attack
- **IP 不存原文**：SHA-256 取前 8 bytes，只做統計用
- **PATCH 端點防越權**：只允許更新 `user_id` 為 null 或屬於自己的 row
- **AI 回傳的 `locked` 強制覆寫為 `false`**：不信任 AI 的欄位值
- **Input 截斷**：topic max 100、title max 30、description max 200、tags max 10 items each max 20 chars

## 整體來說

這次的核心取捨是把 Worker 做得極薄——只管 AI 呼叫，不碰 DB、不碰認證。好處是 Worker 邏輯簡單、部署快、容易測試（12 個 vitest 跑不到 2 秒）。壞處是多了一跳 server-to-server call 存紀錄，但用 `waitUntil` 背景執行不影響回應速度。

Qwen3 作為免費的 Workers AI 模型表現不錯，JSON 結構遵從度高，但 thinking block 是一定要處理的。如果之後換模型，只要改一行 `AI_MODEL` 常數。

從產品角度，action-maker 從一個「玩完就沒了」的工具變成了「玩完可以直接開始做」的入口。AI 生成 → 選擇行動 → 建立 practice → 每天打卡追蹤，閉環了。
