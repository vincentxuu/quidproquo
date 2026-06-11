---
title: "One Sentence to an IG Carousel — From 3 Hours Manual Work to a Fully Automated Pipeline"
date: 2026-04-01
category: ai
tags: [claude-code, instagram, automation, playwright, github-actions, meta-graph-api]
lang: en
tldr: "Use Claude Code as an orchestrator to chain Playwright screenshots, catbox.moe image hosting, Meta Graph API publishing, and Telegram notifications — generate and publish an IG carousel from a single sentence."
description: "A step-by-step guide to building an IG carousel automation pipeline: Claude Code generates copy, Playwright takes screenshots, catbox.moe hosts images, Meta Graph API publishes, and Telegram notifies — with complete source code."
draft: false
type: guide
---

> 🌏 [中文版](/posts/ai/2026-04-01-ig-carousel-automation-pipeline)

Making an IG carousel used to go something like this: brainstorm a topic, write copy, open Canva, lay out the design, tweak fonts and colors, export images, open the IG app, upload, write a caption, add hashtags. The whole process easily took 2-3 hours.

Now I tell Claude one sentence: "Make an IG carousel about AI automation, 5 slides in English," then go pour myself a coffee. By the time I'm back, the Telegram notification has already popped up: published successfully.

This post breaks down how to build this entire pipeline step by step, with complete source code.

---

## Overall Architecture

```
You say one sentence
    ↓
Claude Code (orchestrator)
    ↓ Generate copy (structured JSON)
    ↓ Fill HTML template
    ↓ Playwright screenshots → 5 × 1080×1080 PNGs
    ↓ Upload to catbox.moe → get 5 public URLs
    ↓ Call Meta Graph API → publish IG carousel
    ↓ Telegram Bot notification
    ✓ Done
```

**This isn't a tool — it's a pipeline.** Claude Code is the orchestrator, responsible for chaining each step together. Each step is independent and can be swapped out individually.

---

## Prerequisites: What You Need to Set Up First

Before you begin, there are a few one-time setup tasks:

### 1. Meta Developer Account & Instagram Business Account

This is the most tedious step, but you only need to do it once:

1. Go to [Meta for Developers](https://developers.facebook.com/) and create a developer account
2. Create an App (choose the "Business" type)
3. Add the "Instagram Graph API" product in your App settings
4. Your Instagram account must be a **Business Account** or **Creator Account**, and it must be **linked to a Facebook Page**
5. Get an access token in Graph API Explorer with these permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_read_engagement`

**Getting a long-lived token:** The default token only lasts 1 hour. Use the short-lived token to exchange for a long-lived token (60 days) in Graph API Explorer:

```bash
curl -X GET "https://graph.facebook.com/v21.0/oauth/access_token?\
grant_type=fb_exchange_token&\
client_id={app-id}&\
client_secret={app-secret}&\
fb_exchange_token={short-lived-token}"
```

### 2. Get Your Instagram User ID

```bash
curl -X GET "https://graph.facebook.com/v21.0/me/accounts?access_token={token}"
# Get the page_id from the returned page data

curl -X GET "https://graph.facebook.com/v21.0/{page-id}?fields=instagram_business_account&access_token={token}"
# The instagram_business_account.id in the response is your IG User ID
```

Save this ID — you'll need it for publishing later.

### 3. Telegram Bot

1. Search for `@BotFather` on Telegram and send `/newbot`
2. Follow the instructions to set a bot name and get your `bot_token`
3. Send any message to your bot
4. Call `https://api.telegram.org/bot{token}/getUpdates` to get your `chat_id`

### 4. Install Playwright

```bash
npm init -y
npm install playwright
npx playwright install chromium
```

---

## Step 1: Tell Claude What You Want

Just use natural language:

> "Make an IG carousel about AI automation, 5 slides in English"

Claude Code parses this sentence into concrete tasks and starts executing step by step. No forms, no config files — natural language is the interface.

You can also be more specific:

> "Make a carousel about the 5 most common RAG mistakes, use a dark tech-style template, in Chinese"

Claude will adjust the copy and template style based on your description.

---

## Step 2: Claude Generates Structured Copy

Claude produces structured JSON for the topic, with clearly defined fields for each slide:

```json
{
  "slides": [
    {
      "type": "hook",
      "title": "You Don't Need 10 Tools",
      "subtitle": "to automate your Instagram",
      "body": ""
    },
    {
      "type": "content",
      "title": "1. Claude Code",
      "subtitle": "The Orchestrator",
      "body": "Generates copy, controls the pipeline, calls every tool in sequence."
    },
    {
      "type": "content",
      "title": "2. Playwright",
      "subtitle": "HTML → Image",
      "body": "Renders your template in a real browser and screenshots it at 1080×1080."
    },
    {
      "type": "content",
      "title": "3. Meta Graph API",
      "subtitle": "Publish Directly",
      "body": "No manual upload. Three API calls and your carousel is live."
    },
    {
      "type": "cta",
      "title": "Save This Post",
      "subtitle": "",
      "body": "Follow @youraccount for more automation breakdowns."
    }
  ],
  "caption": "You don't need 10 tools to automate IG posting...",
  "hashtags": "#automation #claudecode #instagram #ai"
}
```

The key here is **structured output**. Each slide has fixed fields (title, subtitle, body, type) so the data can be automatically injected into the HTML template downstream. If Claude only generated a block of prose, the subsequent steps couldn't be automated.

---

## Step 3: HTML Template + Playwright Screenshots

This is the most elegant part of the pipeline. Images are essentially "fixed-layout visual presentations" — exactly like a web page. So we write templates in HTML/CSS and use Playwright to screenshot them as PNGs.

### HTML Template Example

Create a `templates/carousel-dark.html`:

```html
<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1080px;
    height: 1080px;
    background: #0a0a0a;
    color: #ffffff;
    font-family: 'Inter', 'Noto Sans TC', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px;
  }
  .slide-number {
    font-size: 18px;
    color: #666;
    margin-bottom: 24px;
    letter-spacing: 2px;
  }
  .title {
    font-size: 64px;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 24px;
  }
  .subtitle {
    font-size: 32px;
    color: #888;
    margin-bottom: 40px;
  }
  .body {
    font-size: 28px;
    line-height: 1.6;
    color: #ccc;
    max-width: 800px;
  }
  .accent { color: #6366f1; }
  .handle {
    position: absolute;
    bottom: 60px;
    right: 80px;
    font-size: 20px;
    color: #444;
  }
</style>
</head>
<body>
  <div class="slide-number">{{slideNumber}}</div>
  <div class="title">{{title}}</div>
  <div class="subtitle">{{subtitle}}</div>
  <div class="body">{{body}}</div>
  <div class="handle">@youraccount</div>
</body>
</html>
```

Different `type` values can map to different template variants (hook uses oversized text, CTA adds button styling), or you can use a single template and switch via CSS classes.

### Playwright Screenshot Script

Create `scripts/generate-carousel.js`:

```javascript
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

// Read copy from Claude-generated JSON
const data = JSON.parse(readFileSync('carousel-data.json', 'utf-8'));
const template = readFileSync('templates/carousel-dark.html', 'utf-8');

mkdirSync('output', { recursive: true });

async function generateSlides() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1080 });

  for (let i = 0; i < data.slides.length; i++) {
    const slide = data.slides[i];

    // Replace placeholders with actual copy
    const html = template
      .replace('{{slideNumber}}', slide.type === 'hook' ? '' : `${i} / ${data.slides.length}`)
      .replace('{{title}}', slide.title)
      .replace('{{subtitle}}', slide.subtitle || '')
      .replace('{{body}}', slide.body || '');

    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `output/slide-${i + 1}.png` });

    console.log(`✓ slide-${i + 1}.png generated`);
  }

  await browser.close();
  console.log(`\n${data.slides.length} slides generated in output/`);
}

generateSlides();
```

After running this, the `output/` folder will contain 5 × 1080×1080 PNGs.

**Why Playwright instead of other tools?**

| Tool | Problem |
|------|---------|
| Satori | Doesn't support full CSS (no `gap`, no `grid`, custom fonts are a pain) |
| Puppeteer | Works, but Playwright's API is cleaner with native multi-browser support |
| Canvas (node-canvas) | Requires manual coordinate calculations — layout hell |
| Canva API | Paid, and the API has many limitations |

Playwright uses HTML/CSS directly for layout, so designers can edit templates without touching JavaScript.

---

## Step 4: Upload to catbox.moe Image Hosting

Meta Graph API requires images to be **publicly accessible URLs**. Local files won't work, and URLs requiring authentication won't work either.

catbox.moe is a free image host — no registration needed, one POST request and you're done.

### Upload Script

Add the upload logic to `scripts/upload-and-publish.js`:

```javascript
import { readFileSync, readdirSync } from 'fs';

async function uploadToCatbox(filePath) {
  const formData = new FormData();
  formData.append('reqtype', 'fileupload');
  formData.append('fileToUpload', new Blob([readFileSync(filePath)]), filePath.split('/').pop());

  const res = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: formData,
  });

  const url = await res.text();
  console.log(`✓ ${filePath} → ${url}`);
  return url.trim();
}

// Upload all slides
const files = readdirSync('output')
  .filter(f => f.endsWith('.png'))
  .sort()
  .map(f => `output/${f}`);

const imageUrls = [];
for (const file of files) {
  const url = await uploadToCatbox(file);
  imageUrls.push(url);
}

console.log('\nAll images uploaded:', imageUrls);
```

After running this, you'll get a set of public URLs like:

```
https://files.catbox.moe/abc123.png
https://files.catbox.moe/def456.png
...
```

**Alternative:** If you need more reliable hosting, you can switch to Cloudflare R2 or AWS S3. You only need to change the `uploadToCatbox` function — everything else stays the same.

---

## Step 5: Publish IG Carousel via Meta Graph API

Instagram carousel publishing requires three API calls. Here's the complete implementation:

```javascript
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const IG_USER_ID = process.env.IG_USER_ID;
const API_BASE = `https://graph.facebook.com/v21.0`;

// Step 5a: Create a media container for each image
async function createMediaContainer(imageUrl) {
  const res = await fetch(`${API_BASE}/${IG_USER_ID}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: imageUrl,
      is_carousel_item: true,
      access_token: ACCESS_TOKEN,
    }),
  });
  const data = await res.json();

  if (data.error) throw new Error(`Container failed: ${data.error.message}`);
  console.log(`✓ Container created: ${data.id}`);
  return data.id;
}

// Step 5b: Create the carousel container
async function createCarousel(containerIds, caption) {
  const res = await fetch(`${API_BASE}/${IG_USER_ID}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      media_type: 'CAROUSEL',
      children: containerIds.join(','),
      caption: caption,
      access_token: ACCESS_TOKEN,
    }),
  });
  const data = await res.json();

  if (data.error) throw new Error(`Carousel failed: ${data.error.message}`);
  console.log(`✓ Carousel container: ${data.id}`);
  return data.id;
}

// Step 5c: Publish
async function publishCarousel(carouselId) {
  const res = await fetch(`${API_BASE}/${IG_USER_ID}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: carouselId,
      access_token: ACCESS_TOKEN,
    }),
  });
  const data = await res.json();

  if (data.error) throw new Error(`Publish failed: ${data.error.message}`);
  console.log(`✓ Published! Post ID: ${data.id}`);
  return data.id;
}

// Chain it all together
const containerIds = [];
for (const url of imageUrls) {
  const id = await createMediaContainer(url);
  containerIds.push(id);
}

const caption = `${data.caption}\n\n${data.hashtags}`;
const carouselId = await createCarousel(containerIds, caption);
const postId = await publishCarousel(carouselId);
```

### Common Pitfalls

- **Containers can't be used immediately after creation**: Meta needs time to process images. If carousel creation fails, add a polling mechanism that checks `GET /{container-id}?fields=status_code` every few seconds, waiting until `FINISHED` before proceeding
- **Images must be JPEG or PNG**, recommended size is 1080×1080 (square) or 1080×1350 (4:5)
- **Captions are limited to 2200 characters**, with a maximum of 30 hashtags
- **Maximum 50 posts per 24 hours** (Instagram Graph API rate limit; the limit is 100 if using the Instagram API with Instagram Login)

Adding container status polling:

```javascript
async function waitForContainer(containerId, maxRetries = 10) {
  for (let i = 0; i < maxRetries; i++) {
    const res = await fetch(
      `${API_BASE}/${containerId}?fields=status_code&access_token=${ACCESS_TOKEN}`
    );
    const data = await res.json();

    if (data.status_code === 'FINISHED') return true;
    if (data.status_code === 'ERROR') throw new Error('Container processing failed');

    console.log(`  ⏳ Container ${containerId} status: ${data.status_code}, retrying...`);
    await new Promise(r => setTimeout(r, 3000));
  }
  throw new Error('Container processing timed out');
}
```

---

## Step 6: Telegram Notification

After a successful publish, send yourself a Telegram notification:

```javascript
async function sendTelegramNotification(postId) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  const message = `✅ IG carousel published successfully\nPost ID: ${postId}\nhttps://www.instagram.com/p/${postId}/`;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
    }),
  });

  console.log('✓ Telegram notification sent');
}

await sendTelegramNotification(postId);
```

---

## GitHub Actions: Run the Pipeline in CI

Put all the above steps into GitHub Actions so you don't use local resources, and you can even schedule automated posts.

### Workflow File

Create `.github/workflows/ig-carousel.yml`:

```yaml
name: Publish IG Carousel

on:
  workflow_dispatch:
    inputs:
      topic:
        description: 'Carousel topic'
        required: true
        default: 'AI automation tools'
      slides:
        description: 'Number of slides'
        required: true
        default: '5'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          npm ci
          npx playwright install chromium --with-deps

      - name: Generate carousel images
        run: node scripts/generate-carousel.js
        env:
          TOPIC: ${{ github.event.inputs.topic }}
          SLIDE_COUNT: ${{ github.event.inputs.slides }}

      - name: Upload and publish to Instagram
        run: node scripts/upload-and-publish.js
        env:
          META_ACCESS_TOKEN: ${{ secrets.META_ACCESS_TOKEN }}
          IG_USER_ID: ${{ secrets.IG_USER_ID }}
          TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
```

### Setting Up GitHub Secrets

Go to your repo's Settings → Secrets and variables → Actions, and add:

| Secret Name | Value |
|---|---|
| `META_ACCESS_TOKEN` | Long-lived token from Meta Graph API |
| `IG_USER_ID` | Your Instagram Business Account ID |
| `TELEGRAM_BOT_TOKEN` | Your Telegram Bot token |
| `TELEGRAM_CHAT_ID` | Your Telegram chat ID |

### Trigger Methods

- **Manual trigger**: Go to the Actions page, click "Run workflow," and fill in the topic and slide count
- **Scheduled trigger**: Add `schedule` for automated posting:

```yaml
on:
  schedule:
    - cron: '0 1 * * 1,4'  # Every Monday and Thursday at UTC 01:00 (09:00 Taiwan time)
```

---

## Complete File Structure

```
your-repo/
├── .github/
│   └── workflows/
│       └── ig-carousel.yml        # GitHub Actions workflow
├── templates/
│   ├── carousel-dark.html         # Dark template
│   └── carousel-light.html        # Light template (optional)
├── scripts/
│   ├── generate-carousel.js       # Playwright screenshots
│   └── upload-and-publish.js      # Upload + Meta API + Telegram
├── output/                        # Generated images (gitignore)
└── carousel-data.json             # Claude-generated copy (gitignore)
```

---

## Tool List & Alternatives

| Component | Currently Using | Alternatives | Swap Cost |
|-----------|----------------|-------------|-----------|
| Orchestration | Claude Code | — | — |
| Copy Generation | Claude Code | GPT-4, Gemini | Change API call |
| Image Generation | Playwright | Puppeteer | Change screenshot API |
| Image Hosting | catbox.moe | Cloudflare R2, S3, Imgur | Change upload function |
| IG Publishing | Meta Graph API | — | Only option |
| Notifications | Telegram | Discord webhook, LINE Notify, Slack | Change one URL |
| CI/CD | GitHub Actions | GitLab CI, local cron | Change workflow file |

Each component is an independent module — swapping any one doesn't affect the others.

---

## The Big Picture

This pipeline doesn't solve the "can AI write copy" problem — it solves the **how much friction exists between an idea and publishing** problem.

Each step in isolation is straightforward — write copy, create images, upload, publish. But strung together it takes 2-3 hours because every step requires a human to operate, wait, and switch tools. Eliminate all that friction with automation, and what's left is the only step that truly matters: **deciding what to say.**

Building the pipeline the first time takes effort to wire everything together. But once it's built, the marginal cost of each post approaches zero. One sentence goes in, one carousel comes out.

This is also a concrete application of Claude Code as an orchestrator — it's not just a chatbot, but an automation engine capable of chaining tools and executing multi-step tasks. IG carousels are just one scenario; the same architecture can be applied to any "multi-step, cross-tool" workflow.

---

## References

- [Meta Graph API — Content Publishing](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/content-publishing)
- [Playwright — Screenshots](https://playwright.dev/docs/screenshots)
- [GitHub Actions — Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [catbox.moe — API](https://catbox.moe/tools.php)
- [Telegram Bot API — sendMessage](https://core.telegram.org/bots/api#sendmessage)
