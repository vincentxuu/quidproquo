---
title: "How to Use Cloudflare Images: Variants, Format Conversion, and Delivery Pipelines"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, cloudflare-images, images, media, performance, cdn]
lang: en
tldr: "Cloudflare Images has two paths: transform images stored in R2/S3/origin at the edge, or store images in Images and deliver named variants. The first is priced by unique transformations; the second also involves stored and delivered images."
description: "A practical guide to Cloudflare Images: remote transformations, hosted images, variants, URL formats, Workers usage, format conversion, limits, pricing, and where it fits in the Edge Platform."
draft: true
series:
  name: "Cloudflare Edge Platform"
  order: 13
---

> 🌏 [中文版](/posts/tech/2026-08-30-cloudflare-images-pipeline)

Once a site has many images, maintenance work appears quickly: thumbnails, crops, WebP/AVIF, retina sizes, social previews, user uploads, cache invalidation, and original-image access. You can prebuild every size at build time, or put images in S3/R2 and maintain a transformation service. [Cloudflare Images](https://developers.cloudflare.com/images/) offers a third path: dynamic transformation, optimization, and caching at the Cloudflare edge, with optional image storage handled by Cloudflare too.

Its role in the Edge Platform is not just "another CDN." CDN cache stores an existing response near users. Images owns the image pipeline: where the source image lives, which sizes exist, which format each browser receives, how variants are named, who can access originals, how many unique transformations are generated each month, and how image performance stays predictable.

## Two Integration Paths

Cloudflare Images currently has two main paths.

| Path | Where images live | What you get | Fit |
|---|---|---|---|
| Bring your own storage | R2, S3, existing origin | Edge transformations + cache | You already have storage and want real-time resize/format/crop |
| Hosted Images | Cloudflare Images storage | Upload API + variants + delivery URL | User uploads, product images, avatars, managed media assets |

Bring your own storage uses this URL shape:

```txt
https://<ZONE>/cdn-cgi/image/<OPTIONS>/<SOURCE-IMAGE>
```

For example:

```txt
https://example.com/cdn-cgi/image/width=800,format=auto,quality=85/assets/hero.jpg
```

Images stored in Cloudflare Images use this delivery URL:

```txt
https://imagedelivery.net/<ACCOUNT_HASH>/<IMAGE_ID>/<VARIANT_NAME>
```

For example:

```txt
https://imagedelivery.net/abc123/083eb7b2-5392-4565-b69e-aff66acddd00/public
```

The first path is an image transformation layer. The second is image storage plus transformation plus delivery. That difference shows up directly in cost and data ownership.

## Remote Transformations: Transform R2 / Origin Images at the Edge

If originals already live in [R2](/posts/tech/2026-03-27-cloudflare-r2-object-storage-en) or your own origin, remote transformations are usually the first step. Enable transformations on the zone, then the browser requests a `/cdn-cgi/image/` URL. Cloudflare checks edge cache:

- Cache hit: serve the optimized version from the edge without contacting origin or re-running the transformation.
- Cache miss: fetch the original, apply parameters such as `width`, `format`, `quality`, and `fit`, cache the transformed result, then serve it.

The same original image with the same parameter set is one unique transformation. That matters: `width=800,format=auto` and `width=1200,format=auto` are separate versions; `quality=80` and `quality=85` split again. Too many free-form parameters create both cost and cache fragmentation.

I would constrain sizes to a small set:

```txt
thumb: 320w
card: 640w
content: 960w
hero: 1440w
```

Then generate `srcset` from only those sizes:

```html
<img
  src="/cdn-cgi/image/width=960,format=auto,quality=85/images/post-cover.jpg"
  srcset="
    /cdn-cgi/image/width=320,format=auto,quality=85/images/post-cover.jpg 320w,
    /cdn-cgi/image/width=640,format=auto,quality=85/images/post-cover.jpg 640w,
    /cdn-cgi/image/width=960,format=auto,quality=85/images/post-cover.jpg 960w,
    /cdn-cgi/image/width=1440,format=auto,quality=85/images/post-cover.jpg 1440w
  "
  sizes="(max-width: 720px) 100vw, 960px"
  alt="Dashboard screenshot"
/>
```

Avoid arbitrary width parameters. If every browser can request a different width, unique transformations grow and edge cache hit rates fall.

## Hosted Images: Use Variants as Delivery Contracts

Hosted Images stores images in Cloudflare Images. After upload, delivery URLs use account hash, image ID, and variant name. Cloudflare picks the best format based on browser support: AVIF when supported, then WebP, then a compressed original format. SVGs are delivered as sanitized SVGs.

Variants are the core abstraction for hosted images. There is a default `public` variant, and you can create up to 100 predefined variants. Each variant defines resize, fit, metadata, and related options:

```bash
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/images/v1/variants" \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "id": "card",
    "options": {
      "fit": "cover",
      "metadata": "none",
      "width": 800,
      "height": 450
    },
    "neverRequireSignedURLs": true
  }'
```

Fit options define how the image is placed:

- `scale-down`: shrink only; never enlarge.
- `contain`: fit entirely within width/height while preserving aspect ratio.
- `cover`: fill the target box and crop if needed.
- `crop`: shrink and crop without enlarging small images.
- `pad`: preserve aspect ratio and fill extra space with a background color.

For product pages, avatars, cards, and hero images, I prefer variants over hand-written dimensions in URLs. Variant names become part of the design system: `avatar-small`, `card`, `hero`, `og`. Engineering and content then share the same delivery contract.

## Images From Workers

Images can also be used from Workers. The point is usually not to replace every URL transformation, but to add application logic:

- Check whether the user can access the original.
- Map custom URL schemes to Images transformations.
- Adjust size and quality by device, network, or tenant plan.
- Control operation order around transformations.

Conceptually:

```ts
export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    const imageKey = url.pathname.replace("/media/", "");

    if (!isAllowed(request, imageKey)) {
      return new Response("Not found", { status: 404 });
    }

    const originUrl = `https://assets.example.com/${imageKey}`;
    return fetch(originUrl, {
      cf: {
        image: {
          width: 960,
          fit: "scale-down",
          format: "auto",
          quality: 85,
        },
      },
    });
  },
};
```

For public images, the URL interface is simplest. When images have permissions, tenants, watermarks, or plan differences, putting a Worker in the pipeline starts to make sense.

## Limits: Remote and Hosted Images Differ

The official limits page separates remote images and hosted images:

| Type | Important current limits |
|---|---|
| Remote image transformations | file size 100 MB; area 100 MP; normal dimension 12,000 px; AVIF dimension 1,200 px |
| Hosted Images upload | file size 10 MB; area 100 MP; normal dimension 12,000 px; AVIF dimension 1,200 px; metadata 1024 bytes |
| Images binding | `.input()` maximum 20 MB |

GIF/WebP animation limits are based on total megapixels across all frames. Animations above 50 MP are delivered without transformations; the delivery limit is 100 MP. Cloudflare also recommends using video formats such as MP4/WebM for high-resolution animation; Stream and media transformations cover that direction.

Format support differs by direction:

- input: PNG, JPEG, GIF, WebP, SVG, HEIC; AVIF input requires Enterprise.
- output: PNG, JPEG, GIF, WebP, SVG, AVIF.
- SVG is not resized. Cloudflare sanitizes SVGs with `svg-hush`, removing risky features such as scripts, hyperlinks, and cross-origin references.

If the product accepts arbitrary user uploads, enforce these limits before upload instead of waiting for Images to fail.

## Pricing: Do Not Only Look at Traffic

Images pricing currently uses three metrics:

| Use case | Billing metric | Availability |
|---|---|---|
| Optimize images outside Images, such as R2/origin | Images Transformed | Free / Paid |
| Optimize images stored in Cloudflare Images | Images Stored, Images Delivered | Paid |

The Free plan currently includes 5,000 unique transformations per month. After that, new transformations return a `9422` error rather than charging you; existing cached transformations keep serving. The Paid plan currently includes the first 5,000 unique transformations, then charges $0.50 per 1,000 unique transformations. Images storage is $5 per 100,000 images stored per month. Images delivered is $1 per 100,000 delivered images per month.

Cost rules to keep in mind:

- Different sizes of the same image are different unique transformations.
- Different `quality` or `fit` values also split transformations.
- `format=auto` does not create separate billable transformations for AVIF/WebP/JPEG.
- R2 + Images transformations should count both R2 storage/operations and Images transformed usage.
- Hosted Images delivery URLs count as Images Delivered, not Images Transformed; optimizing a hosted image through the Images binding counts as Images Transformed.

Recheck pricing before publishing. Image-delivery pricing changes easily with product packaging, so it is a poor place to rely on memory.

## When to Use Images

I would use Cloudflare Images for:

- Blogs, documentation sites, ecommerce, and UGC with many image sizes.
- Originals stored in R2/S3 where edge resizing and format conversion are needed.
- User-uploaded images that need consistent variants, formats, and metadata policy.
- Product surfaces with avatars, cards, hero images, and OG images.
- Image delivery cost and performance are large enough to monitor separately.

I would not use it for:

- A small number of static images where build-time resizing is enough.
- Content that is really long video, animation, or large media; look at Stream / media transformations.
- Fully dynamic images where every request is unique and cache hit rates are poor.
- Private originals protected only by URL blur/crop parameters; use Worker access control instead.

Images is valuable when it turns image sizing into a maintainable delivery pipeline. If thumbnail scripts, storage moves, format negotiation, and cache misses are already making the project messy, it is cleaner than maintaining your own image service.

## Production Checklist

Before launch, I would check:

- Choose the storage path: R2/origin transformations or Hosted Images.
- Constrain image sizes so URLs cannot create unbounded widths.
- Set defaults for `format=auto`, `quality`, and `fit`.
- Align Hosted Images variant names with the design system.
- Validate file size, dimensions, and format before user upload.
- Protect private images with Workers or signed URLs, not visual URL parameters.
- Confirm R2/origin, Images, Cache Rules, and Smart Shield cache behavior do not conflict.
- Estimate cost across transformations, stored images, delivered images, and R2.
- If OpenNext / Next image optimization uses Cloudflare Images, confirm supported formats and extra cost.

Cloudflare Images fills the media-pipeline role in the Edge Platform: where originals live, how they are transformed, how they are delivered, and how they are priced. Paired with R2, Cache Rules, and Smart Shield, it turns "images load faster" into "the product does not need to run its own image service."

## References

- [Cloudflare Images — Overview](https://developers.cloudflare.com/images/)
- [Cloudflare Images — Transformations overview](https://developers.cloudflare.com/images/optimization/transformations/overview/)
- [Cloudflare Images — Features](https://developers.cloudflare.com/images/optimization/features/)
- [Cloudflare Images — Serve uploaded images](https://developers.cloudflare.com/images/optimization/hosted-images/serve-uploaded-images/)
- [Cloudflare Images — Create predefined variants](https://developers.cloudflare.com/images/optimization/hosted-images/create-variants/)
- [Cloudflare Images — Limits and formats](https://developers.cloudflare.com/images/get-started/limits/)
- [Cloudflare Images — Pricing](https://developers.cloudflare.com/images/pricing/)
