---
title: "Cloudflare R2：零 Egress 費用的 S3 替代方案"
date: 2026-03-27
updated: 2026-08-19
type: guide
category: tech
tags: [cloudflare-r2, object-storage, s3, cloudflare-workers]
lang: zh-TW
tldr: "R2 是 Cloudflare 的物件儲存，S3 相容 API、零 egress 費用、Workers 原生 binding。媒體密集的應用不用再擔心流量帳單。"
description: "Cloudflare R2 物件儲存介紹：S3 相容但零 egress 費用，Workers binding 原生低延遲，適合媒體密集應用。包含 Worker 操作範例、S3 SDK 存取方式，以及 NobodyClimb 攀岩平台的實際用法。"
draft: false
series:
  name: "Cloudflare 邊緣tech stack"
  order: 4
---

🌏 [English version](/posts/tech/2026-03-27-cloudflare-r2-object-storage-en)

如果你的應用跑在 Cloudflare Workers 上，你需要地方存圖片——用 S3 可以，但要管 AWS 帳號、設 CORS、還要注意 egress 費用（AWS 從 S3 傳資料出去要收費，流量大了帳單很嚇人）。R2 解決了這個問題：S3 相容 API、零 egress 費用、跑在 Cloudflare 網路上。

## R2 是什麼

R2 是 Cloudflare 的物件儲存服務，設計來取代 S3。對 Cloudflare Workers 生態來說，R2 是最自然的選擇。

**和 S3 的主要差異**

| | AWS S3 | Cloudflare R2 |
|---|---|---|
| API 相容性 | 原版 | S3 相容（drop-in replacement） |
| Egress（傳出到 Internet） | 按 GB 收費 | 免費 |
| CDN 整合 | 需要另設 CloudFront | 直接走 Cloudflare CDN |
| Workers 整合 | 需要 SDK + 額外延遲 | 原生 binding，低延遲 |
| 區域選擇 | 區域數量多 | 自動選址，另有 location hint 與司法管轄限制 |

單價會變，看 [R2 定價](https://developers.cloudflare.com/r2/pricing/) 與 AWS 官方頁；這裡只留形狀。R2 的計費有三軸：**儲存量（GB-月）＋ Class A 操作（會改變狀態的，如 `PutObject`、`ListObjects`）＋ Class B 操作（讀取類，如 `GetObject`、`HeadObject`）**。刪除是免費操作。egress 一律不收錢。

Egress 免費這點對媒體密集的應用來說很重要。攀岩紀錄有大量圖片、影片縮圖，如果存在 S3 上，每個人打開照片都要付 egress——R2 省掉這塊。

有一個容易被低估的坑：**Class A 比 Class B 貴一個數量級**。大量小檔案的上傳、或是頻繁 `ListObjects` 分頁掃 bucket，帳單會由操作費而不是儲存費主導。另外 Infrequent Access 儲存類別除了操作費更貴，還多了**資料取回費**與 30 天最短儲存期——冷資料不是無腦丟進去就會比較便宜。

## 基本用法（Cloudflare Workers）

**Wrangler 設定檔綁定**

```jsonc
{
  "r2_buckets": [{ "binding": "BUCKET", "bucket_name": "nobodyclimb-media" }]
}
```

**Worker 裡操作 R2**

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const key = url.pathname.slice(1); // /images/foo.jpg → images/foo.jpg

    if (request.method === 'PUT') {
      await env.BUCKET.put(key, request.body, {
        httpMetadata: {
          contentType: request.headers.get('content-type') ?? 'application/octet-stream',
        },
      });
      return new Response('Uploaded', { status: 200 });
    }

    if (request.method === 'GET') {
      const object = await env.BUCKET.get(key);
      if (!object) return new Response('Not Found', { status: 404 });

      return new Response(object.body, {
        headers: {
          'content-type': object.httpMetadata?.contentType ?? 'application/octet-stream',
          'cache-control': 'public, max-age=31536000', // 圖片 1 年快取
        },
      });
    }

    if (request.method === 'DELETE') {
      await env.BUCKET.delete(key);
      return new Response('Deleted', { status: 200 });
    }

    return new Response('Method Not Allowed', { status: 405 });
  },
};
```

## 透過 S3 相容 API 存取

R2 也支援 AWS SDK，方便從 Next.js server action 或其他服務上傳：

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const command = new PutObjectCommand({
  Bucket: 'nobodyclimb-media',
  Key: `climbs/${climbId}/photo.jpg`,
  Body: imageBuffer,
  ContentType: 'image/jpeg',
});

await s3.send(command);
```

## NobodyClimb 怎麼用 R2

NobodyClimb 是全 Cloudflare 架構，R2 負責所有媒體儲存：

```
使用者上傳照片（攀登紀錄、故事配圖）
        │
        ▼
Hono API（驗證 + 產生 upload key）
        │
        ▼
      R2 Bucket
    nobodyclimb-media/
    ├── climbs/{climbId}/
    │   ├── photo-original.jpg
    │   └── photo-thumb.jpg      ← 縮圖，影片預覽圖
    └── stories/{storyId}/
        └── cover.jpg
        │
        ▼
Cloudflare CDN（圖片有 cache-control，全球快取）
```

原始圖存一份，thumbnail 另外存——thumbnail 是頁面載入時顯示的，要快，原始圖只有點開才用，可以接受慢一點。

## 取捨

**優點**
- 零 egress 費用，媒體密集應用省很多
- S3 相容，遷移成本低
- Workers binding 原生，低延遲
- 自動走 Cloudflare CDN

**缺點**
- 不如 S3 生態成熟——AWS 那邊十幾年的第三方工具、稽核與合規整合不是短期能追上的
- 可選的實體位置比 S3 的區域數量少（R2 預設自動選址，另有 [location hint 與司法管轄限制](https://developers.cloudflare.com/r2/reference/data-location/) 可指定，但粒度不同）
- 大型組織可能還是需要 AWS 生態的深度整合

有兩件事**不再**是 R2 的缺點：[物件生命週期規則](https://developers.cloudflare.com/r2/buckets/object-lifecycles/)（自動過期、自動轉到 Infrequent Access）和[事件通知](https://developers.cloudflare.com/r2/buckets/event-notifications/)（物件建立/刪除時觸發 Queue 或 Worker，等同 S3 的 Lambda trigger）現在都有了。

## 什麼時候選 R2

- 已經選定 Cloudflare Workers 作為運算平台
- 媒體密集（圖片、影片縮圖），egress 費用是考量
- 規模中等，不需要 AWS 的企業級功能

如果你沒有用 Workers，S3 可能更合適。R2 的最大價值在於跟 Cloudflare 生態的無縫整合，拆出來單獨用優勢就小很多。

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「Cloudflare 邊緣tech stack」系列

## 參考資料

- [Cloudflare R2 官方文件](https://developers.cloudflare.com/r2/)
- [R2 定價說明](https://developers.cloudflare.com/r2/pricing/) — 儲存、Class A / Class B 操作與免費額度
- [R2 物件生命週期規則](https://developers.cloudflare.com/r2/buckets/object-lifecycles/)
- [R2 事件通知](https://developers.cloudflare.com/r2/buckets/event-notifications/)
- [R2 資料存放位置](https://developers.cloudflare.com/r2/reference/data-location/)
- [Workers Storage Options 選擇指南](https://developers.cloudflare.com/workers/platform/storage-options/)
- [NobodyClimb 系統架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [Cloudflare KV：全球邊緣 Key-Value Store](/posts/tech/2026-03-27-cloudflare-kv-key-value-store)
