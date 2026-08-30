---
title: "Cloudflare Images 怎麼用：圖片變體、格式轉換與交付管線"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, cloudflare-images, images, media, performance, cdn]
lang: zh-TW
tldr: "Cloudflare Images 有兩條路：把 R2/S3/origin 圖片拿來做 edge transformations，或直接把圖片存進 Images 再用 variant delivery。前者按 unique transformations 看成本，後者還要看 stored 和 delivered images。"
description: "從 Cloudflare Images 的 remote transformations、hosted images、variants、URL 格式、Workers binding、格式轉換、limits 與 pricing，拆解它在 Edge Platform 裡適合承擔哪一段圖片管線。"
draft: false
series:
  name: "Cloudflare Edge Platform"
  order: 13
---

> 🌏 [English version](/en/posts/tech/2026-08-30-cloudflare-images-pipeline-en)

圖片一多，網站就會開始長出奇怪的維運工作：縮圖、裁切、WebP/AVIF、retina 尺寸、社群預覽圖、使用者上傳、快取失效、原圖權限。你可以在 build 時先產生所有尺寸，也可以把圖片丟到 S3/R2 再寫一層處理服務。[Cloudflare Images](https://developers.cloudflare.com/images/) 提供第三種路：在 Cloudflare edge 動態轉換、最佳化、快取圖片，必要時連圖片 storage 也交給 Cloudflare。

它在 Edge Platform 裡的位置不是「另一個 CDN」。CDN cache 只管把已經存在的 response 放近使用者；Images 管的是圖片 pipeline：source image 在哪裡、要產生哪些尺寸、瀏覽器該拿 AVIF/WebP/JPEG、variant 怎麼命名、誰可以看原圖、每個月會產生多少 unique transformations，以及圖片 performance 要怎麼維持。

## 兩條整合路徑

Cloudflare Images 目前有兩種主要使用方式。

| 路徑 | 圖片放哪裡 | 你得到什麼 | 適合 |
|---|---|---|---|
| Bring your own storage | R2、S3、既有 origin | edge transformations + cache | 已經有 storage，只想即時 resize/format/crop |
| Hosted Images | Cloudflare Images storage | upload API + variants + delivery URL | 使用者上傳、產品圖、avatar、媒體資產想整包託管 |

Bring your own storage 的 URL 長這樣：

```txt
https://<ZONE>/cdn-cgi/image/<OPTIONS>/<SOURCE-IMAGE>
```

例如：

```txt
https://example.com/cdn-cgi/image/width=800,format=auto,quality=85/assets/hero.jpg
```

如果圖片存在 Cloudflare Images，delivery URL 長這樣：

```txt
https://imagedelivery.net/<ACCOUNT_HASH>/<IMAGE_ID>/<VARIANT_NAME>
```

例如：

```txt
https://imagedelivery.net/abc123/083eb7b2-5392-4565-b69e-aff66acddd00/public
```

第一條路比較像「圖片 transformation layer」；第二條路是「圖片 storage + transformation + delivery」。差別會直接反映在成本和資料所有權。

## Remote transformations：R2 / origin 圖片即時轉換

如果你已經把原圖放在 [R2](/posts/tech/2026-03-27-cloudflare-r2-object-storage) 或自己的 origin，remote transformations 通常是第一步。你先在 zone 上啟用 transformations，瀏覽器請求帶有 `/cdn-cgi/image/` 的 URL。Cloudflare 會看 edge cache：

- cache hit：直接回已最佳化的版本，不回 origin，也不重做 transformation。
- cache miss：抓原圖，套用 `width`、`format`、`quality`、`fit` 等參數，快取轉換結果，再回 browser。

同一張原圖、同一組參數，會被視為同一個 unique transformation。這點很重要：`width=800,format=auto` 和 `width=1200,format=auto` 是兩個版本；`quality=80` 和 `quality=85` 也會拆開。參數太自由，成本和 cache fragmentation 都會變差。

我會把尺寸收斂成一小組：

```txt
thumb: 320w
card: 640w
content: 960w
hero: 1440w
```

然後讓前端只從這些尺寸產生 `srcset`：

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

真正要避免的是讓 URL 任意帶 `width`。如果每個 browser 都能送出不同寬度，unique transformations 會被打散，edge cache 也更難命中。

## Hosted Images：用 variant 管交付規格

Hosted Images 把圖片存在 Cloudflare Images。你上傳圖片後，交付時用 account hash、image ID、variant name 組 URL。Cloudflare 會依瀏覽器支援自動挑較合適的格式：支援 AVIF 就用 AVIF，不支援就退到 WebP，再退到壓縮後的原格式。SVG 會以 sanitized SVG 方式交付。

variant 是 hosted images 的核心。預設有 `public` variant，也可以自建最多 100 個 predefined variants。每個 variant 定義 resize、fit、metadata 等選項。例如：

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

fit 選項決定圖片如何塞進框：

- `scale-down`：只縮小，不放大。
- `contain`：完整放進指定寬高，保留比例。
- `cover`：填滿指定區域，必要時裁切。
- `crop`：縮小並裁切，不放大小圖。
- `pad`：保留比例，多出的空間補背景色。

對產品頁、avatar、卡片封面，我會用 variant，而不是每次在 URL 上手寫尺寸。variant 名稱會變成設計系統的一部分：`avatar-small`、`card`、`hero`、`og`。這樣工程和內容端講的是同一組規格。

## Workers 裡的 Images

Images 也能透過 Workers 使用。常見用途不是取代所有 URL transformation；比較實際的是加上 application logic：

- 驗證使用者是否能看原圖。
- 把自訂 URL scheme 轉成 Images transformation。
- 依 device、network、tenant plan 動態調整尺寸和品質。
- 在 transformations 前後控制操作順序。

概念上會像這樣：

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

如果圖片是公開內容，URL interface 最簡單；如果圖片有權限、租戶、浮水印或 plan 差異，Worker 才值得放進管線。

## Limits：原圖和 Hosted Images 的限制不同

官方 limits 頁把 remote images 和 hosted images 分開：

| 類型 | 目前重要限制 |
|---|---|
| Remote image transformations | file size 100 MB；面積 100 MP；一般 dimension 12,000 px；AVIF dimension 1,200 px |
| Hosted Images upload | file size 10 MB；面積 100 MP；一般 dimension 12,000 px；AVIF dimension 1,200 px；metadata 1024 bytes |
| Images binding | `.input()` 最大 20 MB |

GIF/WebP animation 的限制看所有 frame 的總 megapixels。超過 50 MP 的 animation 會直接交付，不套 transformation；上限是 100 MP。官方也建議高解析動畫改用 MP4/WebM 這類 video formats，Cloudflare 另有 Stream / media transformations。

格式支援也要看方向：

- input：PNG、JPEG、GIF、WebP、SVG、HEIC，AVIF input 需要 Enterprise。
- output：PNG、JPEG、GIF、WebP、SVG、AVIF。
- SVG 不會 resize，Cloudflare 會用 `svg-hush` 做 sanitization，移除 script、外部連結、跨來源資源引用等風險。

如果你的產品允許使用者上傳任意圖片，這些限制要在 upload 前先擋，不要等 Images 回錯誤才處理。

## Pricing：不要只看流量

Images pricing 目前分三個 metric：

| 使用情境 | 計費 metric | 可用性 |
|---|---|---|
| 最佳化 Images 外部的圖片，例如 R2/origin | Images Transformed | Free / Paid |
| 最佳化存在 Cloudflare Images 的圖片 | Images Stored、Images Delivered | Paid |

Free plan 目前每月包含 5,000 個 unique transformations。超過後，不會額外收費；新的 transformations 會回 `9422` error，既有 cache 裡的 transformations 仍會正常服務。Paid plan 目前包含前 5,000 unique transformations，之後每 1,000 個 $0.50；Images storage 是每 100,000 張每月 $5；Images delivered 是每 100,000 次每月 $1。

幾個成本判斷：

- 同一張圖的不同尺寸是不同 unique transformation。
- 同一張圖的不同 quality/fit 也會拆成不同 transformation。
- `format=auto` 不會因為 AVIF/WebP/JPEG 產生多個 billable transformations。
- R2 + Images transformations 的成本要把 R2 storage/operations 和 Images transformed 加總。
- Hosted Images delivery URL 計 Images Delivered，不計 Images Transformed；但透過 Images binding 最佳化 hosted image 會計 Images Transformed。

正式發文前要再重查 pricing。圖片流量的成本很容易因產品包裝改變，不適合只靠記憶。

## 什麼時候用 Images，什麼時候不用

我會用 Cloudflare Images 處理這些情境：

- 部落格、文件站、電商、UGC 有大量圖片尺寸。
- 圖片原檔在 R2/S3，但想在 edge 即時轉成適合 device 的版本。
- 使用者上傳圖片，需要統一 variants、format、metadata policy。
- 產品需要 avatar、card、hero、OG image 這類固定規格。
- 圖片交付成本和效能已經值得單獨監控。

我不會用它處理這些情境：

- 少量靜態圖片，build time 產生尺寸就夠。
- 圖片其實是長影片、動畫或大型媒體檔，應該看 Stream / media transformations。
- 每次 request 都需要完全不同的動態圖，不容易命中 cache。
- 原圖本身不能公開，卻只靠 URL blur/crop 來遮內容；這要用 Worker 做 access control。

Images 的價值在「把圖片規格收斂成可維護的交付管線」。如果你的專案已經被縮圖腳本、storage migration、format negotiation 和 cache miss 搞亂，它會比自己維護一套 image service 更乾淨。

## Production 前的檢查清單

上線前我會確認：

- 選定 storage 模式：R2/origin transformations，或 Hosted Images。
- 圖片尺寸集合收斂，不讓 URL 任意產生無限寬度。
- `format=auto`、`quality`、`fit` 有預設策略。
- Hosted Images variants 命名和設計系統對齊。
- 使用者上傳先檢查 file size、dimension、format。
- 私有圖片經過 Worker 或 signed URLs，不靠 URL 參數遮掩。
- R2/origin、Images、Cache Rules、Smart Shield 的 cache 行為沒有互相打架。
- 成本估算拆成 transformations、stored、delivered，並把 R2 成本加回來。
- OpenNext / Next image optimization 若走 Cloudflare Images，要確認支援格式和額外成本。

Cloudflare Images 在 Edge Platform 裡補的是媒體管線：原圖放哪、怎麼轉、怎麼交付、怎麼計費。它和 R2、Cache Rules、Smart Shield 配在一起，才會從「圖片可以快一點」變成「產品的圖片系統不用自己養」。

## 參考資料

- [Cloudflare Images — Overview](https://developers.cloudflare.com/images/)
- [Cloudflare Images — Transformations overview](https://developers.cloudflare.com/images/optimization/transformations/overview/)
- [Cloudflare Images — Features](https://developers.cloudflare.com/images/optimization/features/)
- [Cloudflare Images — Serve uploaded images](https://developers.cloudflare.com/images/optimization/hosted-images/serve-uploaded-images/)
- [Cloudflare Images — Create predefined variants](https://developers.cloudflare.com/images/optimization/hosted-images/create-variants/)
- [Cloudflare Images — Limits and formats](https://developers.cloudflare.com/images/get-started/limits/)
- [Cloudflare Images — Pricing](https://developers.cloudflare.com/images/pricing/)
