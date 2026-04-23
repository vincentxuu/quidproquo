---
title: "Cloudflare KV：全球邊緣的 Key-Value Store"
date: 2026-03-27
type: guide
category: tech
tags: [cloudflare-kv, key-value, cache, edge, cloudflare-workers]
lang: zh-TW
tldr: "KV 是 Cloudflare 的全球分散式 key-value store，讀取從最近的邊緣節點回應，延遲極低。適合快取、feature flag、暫態資料，但寫入是最終一致性。"
description: "Cloudflare KV 介紹：全球分散式 key-value store，邊緣讀取低延遲，TTL 原生支援。包含 Workers binding 用法、type 轉換技巧、與 D1 的選擇矩陣，以及 NobodyClimb 的 AI 問答快取實作。"
draft: false
---

KV 是 Cloudflare Workers 的全球 key-value store。資料同步到全球所有 Cloudflare PoP（Point of Presence），讀取從最近的節點回應，通常幾毫秒。如果你需要一個 serverless 的快取層，不想管 Redis，KV 是最直接的選擇。

## 核心特性

- **讀取極快**：從邊緣節點讀，通常幾毫秒
- **最終一致性**：寫入後可能要幾秒到幾十秒才同步到全球各節點——這是最重要的限制，不適合需要強一致性的場景
- **TTL 支援**：可以設過期時間，不用手動清理
- **大小限制**：value 最大 25 MB，key 最大 512 bytes

## 基本用法

**wrangler.toml 綁定**

```toml
[[kv_namespaces]]
binding = "KV"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
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
```

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
- 寫入有頻率限制（免費方案每分鐘 1000 次）
- 不適合高寫入頻率的場景

## 什麼時候選 KV

- 已經選定 Cloudflare Workers 作為運算平台
- 需要快取層但不想管 Redis
- 讀多寫少，可以接受最終一致性
- 資料有明確的 TTL（快取、暫態、session）

如果需要強一致性或複雜查詢，用 D1。如果需要高寫入頻率和 pub/sub，自架 Redis 更適合。

## 參考資料

- [Cloudflare KV 官方文件](https://developers.cloudflare.com/kv/)
- [Workers Storage Options 選擇指南](https://developers.cloudflare.com/workers/platform/storage-options/)
- [NobodyClimb 系統架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb RAG Pipeline 架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) — KV 在 semantic cache 中的角色
- [Cloudflare R2：零 Egress 費用的物件儲存](/posts/tech/2026-03-27-cloudflare-r2-object-storage)
