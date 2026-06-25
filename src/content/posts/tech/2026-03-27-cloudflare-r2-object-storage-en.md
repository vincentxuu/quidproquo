---
title: "Cloudflare R2: An S3 Alternative with Zero Egress Fees"
date: 2026-03-27
type: guide
category: tech
tags: [cloudflare-r2, object-storage, s3, cloudflare-workers]
lang: en
tldr: "R2 is Cloudflare's object storage service — S3-compatible API, zero egress fees, and native Workers binding. Stop worrying about bandwidth bills for media-heavy applications."
description: "An introduction to Cloudflare R2 object storage: S3-compatible with zero egress fees, native low-latency Workers binding, and ideal for media-intensive apps. Includes Worker operation examples, S3 SDK access patterns, and real-world usage from the NobodyClimb climbing platform."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-cloudflare-r2-object-storage)

If your app runs on Cloudflare Workers and you need somewhere to store images, S3 works — but you have to manage an AWS account, configure CORS, and keep an eye on egress fees (AWS charges for data transferred out of S3, and those bills can get nasty at scale). R2 solves all of this: S3-compatible API, zero egress fees, running on the Cloudflare network.

## What is R2

R2 is Cloudflare's object storage service, designed as a drop-in replacement for S3. Within the Cloudflare Workers ecosystem, R2 is the most natural storage choice.

**Key differences from S3**

| | AWS S3 | Cloudflare R2 |
|---|---|---|
| API compatibility | Native | S3-compatible (drop-in replacement) |
| Egress fees | Per GB ($0.09 USD/GB) | Free |
| Storage fees | $0.023 USD/GB | $0.015 USD/GB |
| CDN integration | Requires separate CloudFront setup | Direct Cloudflare CDN |
| Workers integration | Requires SDK + added latency | Native binding, low latency |

Zero egress fees matter a lot for media-heavy applications. Climbing logs involve large numbers of photos and video thumbnails — if those lived in S3, every time someone opened a photo you'd be paying egress. R2 eliminates that cost.

## Basic Usage (Cloudflare Workers)

**wrangler.toml binding configuration**

```toml
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "nobodyclimb-media"
```

**Working with R2 inside a Worker**

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
          'cache-control': 'public, max-age=31536000', // cache images for 1 year
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

## Accessing R2 via the S3-Compatible API

R2 also supports the AWS SDK, making it easy to upload from a Next.js server action or any other external service:

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

## How NobodyClimb Uses R2

NobodyClimb runs on a fully Cloudflare-native stack, with R2 handling all media storage:

```
User uploads a photo (climb log, story cover image)
        │
        ▼
Hono API (auth + generate upload key)
        │
        ▼
      R2 Bucket
    nobodyclimb-media/
    ├── climbs/{climbId}/
    │   ├── photo-original.jpg
    │   └── photo-thumb.jpg      ← thumbnail, video preview
    └── stories/{storyId}/
        └── cover.jpg
        │
        ▼
Cloudflare CDN (images served with cache-control, cached globally)
```

Both the original image and a thumbnail are stored separately. Thumbnails are what get displayed during page load — they need to be fast. The original only loads when someone actually opens it, so a bit more latency is acceptable.

## Trade-offs

**Pros**
- Zero egress fees — significant savings for media-heavy applications
- S3-compatible, so migration costs are low
- Native Workers binding with low latency
- Automatic Cloudflare CDN integration

**Cons**
- Less mature ecosystem than S3 (fewer features like Lambda triggers, lifecycle rules)
- Fewer geographic region options than S3
- Large organizations may still need the deep integration that the AWS ecosystem provides

## When to Choose R2

- You've already committed to Cloudflare Workers as your compute platform
- Your app is media-heavy (images, video thumbnails) and egress costs are a concern
- You're at a medium scale and don't need enterprise-grade AWS features

If you're not using Workers, S3 is probably the better fit. R2's biggest value comes from seamless integration with the Cloudflare ecosystem — using it in isolation reduces the advantage considerably.

## References

- [Cloudflare R2 Official Docs](https://developers.cloudflare.com/r2/)
- [R2 Pricing](https://developers.cloudflare.com/r2/pricing/)
- [Workers Storage Options Guide](https://developers.cloudflare.com/workers/platform/storage-options/)
- [NobodyClimb System Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [Cloudflare KV: Global Edge Key-Value Store](/posts/tech/2026-03-27-cloudflare-kv-key-value-store)
