---
title: "Cloudflare KV：全球邊緣的 Key-Value Store"
date: 2026-03-27
updated: 2026-08-19
type: guide
category: tech
tags: [cloudflare-kv, key-value, cache, edge, cloudflare-workers]
lang: zh-TW
tldr: "KV 是 Cloudflare 的全球分散式 key-value store，讀取從最近的邊緣節點回應，延遲極低。適合快取、feature flag、暫態資料，但寫入是最終一致性。"
description: "Cloudflare KV 介紹：全球分散式 key-value store，邊緣讀取低延遲，TTL 原生支援。包含 Workers binding 用法、type 轉換技巧、與 D1 的選擇矩陣，以及 NobodyClimb 的 AI 問答快取實作。"
draft: false
series:
  name: "Cloudflare Edge Platform"
  order: 5
---

🌏 [English version](/posts/tech/2026-03-27-cloudflare-kv-key-value-store-en)

KV 是 Cloudflare Workers 的全球 key-value store。如果你需要一個 serverless 的快取層，不想管 Redis，KV 是最直接的選擇。

## 它其實是什麼：讀取快取，不是全球同步

最常被寫錯的一句話是「KV 會把資料同步到全球所有 PoP」。**它不會。** KV 的資料放在中央儲存，第一次在某個地點被讀到之後，才在那個地點被快取起來；沒人讀過的鍵在那裡就是 cold read，要回中央拿。

這個機制決定了兩件事：

- **第一次讀某個 key 一定比較慢**，之後才快。讀取模式很分散（每個 key 只被讀一兩次）的資料放 KV 沒有好處
- **寫入之後的可見性是不對稱的**：寫入對**同一個地點**的後續請求「通常」立即可見，但傳到世界其他地方可能需要最多 60 秒（或你指定的 `cacheTtl`）。要注意官方對前半句講得很保留——[How KV works](https://developers.cloudflare.com/kv/concepts/how-kv-works/) 原文是 *usually* immediately visible，並明講 **this is not guaranteed and therefore it is not advised to rely on this behaviour**。所以「同地點立即可見」可以拿來解釋現象，不能拿來當設計前提

所以「最終一致性」在 KV 上有個具體數字可以抓，不是模糊的「幾秒到幾十秒」。

## 核心特性

- **熱讀取極快**：命中該地點快取時通常幾毫秒
- **最終一致性**：同地點通常立即可見但官方不保證，跨地點約 60 秒甚至更久（官方寫的是 *up to 60 seconds or more*，沒有把上界寫死）（可用 `cacheTtl` 調整，最低 30 秒、預設 60 秒）
- **TTL 支援**：`expiration`（指定時間點）與 `expirationTtl`（相對秒數）兩種，不用手動清理
- **大小與數量限制**：key、value、每次 Worker 呼叫的操作數都有上限，數字見 [KV limits](https://developers.cloudflare.com/kv/platform/limits/)

## 基本用法

**Wrangler 設定檔綁定**

```jsonc
{
  "kv_namespaces": [{ "binding": "KV", "id": "<NAMESPACE_ID>" }]
}
```

**Worker 裡操作 KV**

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // 寫入（帶 TTL）
    await env.KV.put('config:ai-quota', JSON.stringify({ limit: 10 }), {
      expirationTtl: 3600, // 1 小時後過期
    });

    // 讀取
    const raw = await env.KV.get('config:ai-quota');
    if (!raw) return new Response('Not found', { status: 404 });
    const config = JSON.parse(raw);

    // 刪除
    await env.KV.delete('config:ai-quota');

    return Response.json(config);
  },
};
```

**讀取帶 type 轉換**

```typescript
// 直接取 JSON 物件
const data = await env.KV.get<{ limit: number }>('config:ai-quota', 'json');

// 取 ArrayBuffer（二進位資料）
const binary = await env.KV.get('some-key', 'arrayBuffer');

// 冷門 key 想壓低 cold read 延遲，可以拉長它在該地點的快取時間
const rare = await env.KV.get('rarely-read-key', { cacheTtl: 3600 });
```

`cacheTtl` 是雙面刃：拉長它會讓這個地點更久看不到其他地點寫入的新值。寫多讀多的資料不要動它。

## KV vs D1：怎麼選

在 Cloudflare 生態裡，常見疑問是 KV 和 D1（SQLite）怎麼選：

| 場景 | 選擇 |
|------|------|
| 快取、暫態資料、feature flag | KV |
| 需要 SQL 查詢、JOIN、ACID | D1 |
| 需要全球超低延遲讀取 | KV |
| 需要強一致性 | D1 |
| 資料量大、key 數量多 | KV（無限 key 數） |

KV 不是資料庫，沒辦法 range scan（不能「查所有 key 開頭是 `user:` 的資料」），只能精確 key 讀取。需要查詢能力的資料就放 D1。

## NobodyClimb 怎麼用 KV

NobodyClimb 用 KV 存兩類資料：

1. **影片資料暫存**：某些功能需要暫存影片的 metadata（處理中、已完成、錯誤狀態），TTL 設幾小時，處理完後自動過期
2. **AI 問答快取**：相同或相似的問題快取 LLM 回應，避免重複推論，TTL 幾十分鐘

```typescript
// 快取 AI 回應
const cacheKey = `ai-response:${hashQuery(userQuery)}`;
const cached = await env.KV.get(cacheKey, 'json');
if (cached) return cached;

const response = await generateAIResponse(userQuery, context);
await env.KV.put(cacheKey, JSON.stringify(response), {
  expirationTtl: 1800, // 30 分鐘
});
return response;
```

這種快取策略配合 RAG pipeline 裡的 semantic cache step——先查 KV 有沒有語義相近的快取，有就直接回，省掉整個 retrieval + generation 流程。

## 取捨

**優點**
- 全球讀取極快
- TTL 原生支援
- 操作 API 極簡單
- Serverless，不用管基礎設施

**缺點**
- 最終一致性，強一致性場景不適合
- 無法 range query，只能精確 key 讀取
- **對同一個 key 的寫入頻率上限是每秒一次，免費與付費方案都一樣**——這不是可以靠升級解決的限制。要對單一鍵做高頻更新（計數器、rate limiter 狀態）請改用 Durable Objects
- 免費方案的每日寫入次數額度很小（跟讀取額度差兩個數量級），拿 KV 當寫入密集的儲存會很快撞牆
- 併發寫同一個 key 是「最後寫的贏」，沒有 compare-and-swap

## 什麼時候選 KV

- 已經選定 Cloudflare Workers 作為運算平台
- 需要快取層但不想管 Redis
- 讀多寫少，可以接受最終一致性
- 資料有明確的 TTL（快取、暫態、session）

如果需要強一致性或複雜查詢，用 D1。如果需要對同一個鍵高頻寫入或做協調（計數、鎖、rate limit），用 Durable Objects；需要 pub/sub 就自架 Redis。

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「Cloudflare 邊緣tech stack」系列

## 參考資料

- [Cloudflare KV 官方文件](https://developers.cloudflare.com/kv/)
- [How KV works](https://developers.cloudflare.com/kv/concepts/how-kv-works/) — 快取層與一致性行為
- [KV limits](https://developers.cloudflare.com/kv/platform/limits/) — key/value 大小、每日額度、每次呼叫操作數
- [KV pricing](https://developers.cloudflare.com/kv/platform/pricing/)
- [Workers Storage Options 選擇指南](https://developers.cloudflare.com/workers/platform/storage-options/)
- [NobodyClimb 系統架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb RAG Pipeline 架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) — KV 在 semantic cache 中的角色
- [Cloudflare R2：零 Egress 費用的物件儲存](/posts/tech/2026-03-27-cloudflare-r2-object-storage)
