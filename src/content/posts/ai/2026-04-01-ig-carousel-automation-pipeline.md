---
title: "一句話發一篇 IG 輪播 — 從手動 3 小時到全自動的 Pipeline 實作教學"
date: 2026-04-01
category: ai
tags: [claude-code, instagram, automation, playwright, github-actions, meta-graph-api]
lang: zh-TW
tldr: "用 Claude Code 當 orchestrator，串接 Playwright 截圖、catbox.moe 圖床、Meta Graph API 發布、Telegram 通知，一句話完成 IG 輪播圖文的生成與發布。"
description: "手把手教你建一條 IG 輪播自動化 pipeline：Claude Code 生成文案、Playwright 截圖、catbox.moe 圖床、Meta Graph API 發布、Telegram 通知，附完整程式碼。"
draft: false
type: guide
---

以前做一組 IG 輪播，流程大概是這樣：想主題、寫文案、開 Canva 排版、調字體顏色、匯出圖片、開 IG app 上傳、寫 caption、加 hashtag。整套做完，2-3 小時跑不掉。

現在我跟 Claude 說一句話：「做一組 AI 自動化主題的 IG 輪播，5 張英文內文」，然後去倒咖啡。回來的時候 Telegram 通知已經跳出來了：發布成功。

這篇手把手拆解整條 pipeline 怎麼建，附完整程式碼。

---

## 整體架構

```
你說一句話
    ↓
Claude Code（orchestrator）
    ↓ 生成文案（結構化 JSON）
    ↓ 填入 HTML 模板
    ↓ Playwright 截圖 → 5 張 1080×1080 PNG
    ↓ 上傳 catbox.moe → 取得 5 個公開 URL
    ↓ 呼叫 Meta Graph API → 發布 IG 輪播
    ↓ Telegram Bot 通知
    ✓ 完成
```

**這不是一個工具，是一條 pipeline。** Claude Code 是 orchestrator，負責串接每個環節。每個環節都是獨立的，可以單獨替換。

---

## 前置準備：你需要先設定好什麼

在開始之前，有幾個一次性的前置作業：

### 1. Meta Developer 帳號與 Instagram Business Account

這是最麻煩的一步，但只要做一次：

1. 到 [Meta for Developers](https://developers.facebook.com/) 建立開發者帳號
2. 建立一個 App（選「Business」類型）
3. 在 App 設定裡加入「Instagram Graph API」產品
4. 你的 Instagram 帳號必須是 **Business Account** 或 **Creator Account**，並且**連結到一個 Facebook Page**
5. 在 Graph API Explorer 取得 access token，勾選以下權限：
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_read_engagement`

**取得長效 token：** 預設 token 只有 1 小時效期。到 Graph API Explorer 用短效 token 換長效 token（60 天）：

```bash
curl -X GET "https://graph.facebook.com/v21.0/oauth/access_token?\
grant_type=fb_exchange_token&\
client_id={app-id}&\
client_secret={app-secret}&\
fb_exchange_token={short-lived-token}"
```

### 2. 取得 Instagram User ID

```bash
curl -X GET "https://graph.facebook.com/v21.0/me/accounts?access_token={token}"
# 從回傳的 page 資料中取得 page_id

curl -X GET "https://graph.facebook.com/v21.0/{page-id}?fields=instagram_business_account&access_token={token}"
# 回傳的 instagram_business_account.id 就是你的 IG User ID
```

把這個 ID 記下來，後面發布要用。

### 3. Telegram Bot

1. 在 Telegram 搜尋 `@BotFather`，發送 `/newbot`
2. 照指示設定 bot 名稱，取得 `bot_token`
3. 跟你的 bot 隨便發一則訊息
4. 呼叫 `https://api.telegram.org/bot{token}/getUpdates` 取得你的 `chat_id`

### 4. 安裝 Playwright

```bash
npm init -y
npm install playwright
npx playwright install chromium
```

---

## Step 1：跟 Claude 說你要什麼

直接用自然語言：

> 「做一組 AI 自動化主題的 IG 輪播，5 張英文內文」

Claude Code 會把這句話解析成具體任務，然後開始逐步執行。不需要表單、不需要設定檔，自然語言就是介面。

你也可以更具體：

> 「做一組輪播，主題是 5 個最常見的 RAG 錯誤，用深色科技風模板，中文」

Claude 會根據描述調整文案內容和模板風格。

---

## Step 2：Claude 生成結構化文案

Claude 根據主題產出結構化的 JSON，每張圖有明確的欄位：

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

關鍵：**結構化輸出**。每張圖的欄位固定（title、subtitle、body、type），後面才能自動填進 HTML 模板。如果 Claude 只是生成一段散文，後面的步驟就沒辦法自動化。

---

## Step 3：HTML 模板 + Playwright 截圖

這一步是整條 pipeline 最精巧的地方。圖片其實就是「固定版面的視覺呈現」——跟網頁一模一樣。所以用 HTML/CSS 寫模板，Playwright 截圖輸出 PNG。

### HTML 模板範例

建立一個 `templates/carousel-dark.html`：

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

不同的 `type` 可以對應不同模板變體（hook 用超大字、CTA 加按鈕樣式），或者全部用同一個模板但靠 CSS class 切換。

### Playwright 截圖腳本

建立 `scripts/generate-carousel.js`：

```javascript
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

// 從 Claude 生成的 JSON 讀取文案
const data = JSON.parse(readFileSync('carousel-data.json', 'utf-8'));
const template = readFileSync('templates/carousel-dark.html', 'utf-8');

mkdirSync('output', { recursive: true });

async function generateSlides() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1080 });

  for (let i = 0; i < data.slides.length; i++) {
    const slide = data.slides[i];

    // 把 placeholder 換成實際文案
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

執行後 `output/` 資料夾會有 5 張 1080×1080 的 PNG。

**為什麼用 Playwright 而不是其他工具？**

| 工具 | 問題 |
|------|------|
| Satori | 不支援完整 CSS（沒有 `gap`、沒有 `grid`、自訂字體麻煩） |
| Puppeteer | 可以，但 Playwright API 更乾淨，原生支援多瀏覽器 |
| Canvas（node-canvas） | 要手動算座標，排版地獄 |
| Canva API | 要付費，且 API 限制多 |

Playwright 直接用 HTML/CSS 排版，設計師也能改模板，不用碰 JavaScript。

---

## Step 4：上傳 catbox.moe 圖床

Meta Graph API 要求圖片必須是**公開可存取的 URL**。本地檔案不行、需要認證的 URL 也不行。

catbox.moe 是免費圖床，不需要註冊，API 一個 POST 搞定。

### 上傳腳本

在 `scripts/upload-and-publish.js` 裡加入上傳邏輯：

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

// 上傳所有 slides
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

執行後會拿到一組公開 URL，像是：

```
https://files.catbox.moe/abc123.png
https://files.catbox.moe/def456.png
...
```

**替代方案：** 如果需要更穩定的託管，可以換成 Cloudflare R2 或 AWS S3。只需要改 `uploadToCatbox` 這一個 function，其他邏輯不用動。

---

## Step 5：Meta Graph API 發布 IG 輪播

Instagram 輪播發布需要三步 API 呼叫。以下是完整實作：

```javascript
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const IG_USER_ID = process.env.IG_USER_ID;
const API_BASE = `https://graph.facebook.com/v21.0`;

// Step 5a：為每張圖建立 media container
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

// Step 5b：建立 carousel container
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

// Step 5c：發布
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

// 串起來
const containerIds = [];
for (const url of imageUrls) {
  const id = await createMediaContainer(url);
  containerIds.push(id);
}

const caption = `${data.caption}\n\n${data.hashtags}`;
const carouselId = await createCarousel(containerIds, caption);
const postId = await publishCarousel(carouselId);
```

### 常見踩坑

- **container 建立後不能馬上用**：Meta 需要時間處理圖片。如果 carousel 建立失敗，可以加一個 polling 機制，每隔幾秒用 `GET /{container-id}?fields=status_code` 檢查狀態，等到 `FINISHED` 再繼續
- **圖片必須是 JPEG 或 PNG**，尺寸建議 1080×1080（正方形）或 1080×1350（4:5）
- **caption 最多 2200 字元**，hashtag 最多 30 個
- **每 24 小時最多發 50 則貼文**（Instagram Graph API rate limit，使用 Instagram API with Instagram Login 的話上限是 100 則）

加入 container 狀態檢查：

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

## Step 6：Telegram 通知

發布成功後，發一則 Telegram 通知給自己：

```javascript
async function sendTelegramNotification(postId) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  const message = `✅ IG 輪播發布成功\nPost ID: ${postId}\nhttps://www.instagram.com/p/${postId}/`;

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

## GitHub Actions：讓 pipeline 跑在 CI 上

把上面所有步驟放進 GitHub Actions，就不用佔本地資源，還能排程自動發文。

### Workflow 檔案

建立 `.github/workflows/ig-carousel.yml`：

```yaml
name: Publish IG Carousel

on:
  workflow_dispatch:
    inputs:
      topic:
        description: '輪播主題'
        required: true
        default: 'AI automation tools'
      slides:
        description: '張數'
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

### 設定 GitHub Secrets

到 repo 的 Settings → Secrets and variables → Actions，加入：

| Secret 名稱 | 值 |
|---|---|
| `META_ACCESS_TOKEN` | Meta Graph API 的長效 token |
| `IG_USER_ID` | 你的 Instagram Business Account ID |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot 的 token |
| `TELEGRAM_CHAT_ID` | 你的 Telegram chat ID |

### 觸發方式

- **手動觸發**：到 Actions 頁面點 "Run workflow"，填入主題和張數
- **排程觸發**：加上 `schedule` 就能定時發文：

```yaml
on:
  schedule:
    - cron: '0 1 * * 1,4'  # 每週一、四 UTC 09:00（台灣時間）
```

---

## 完整檔案結構

```
your-repo/
├── .github/
│   └── workflows/
│       └── ig-carousel.yml        # GitHub Actions workflow
├── templates/
│   ├── carousel-dark.html         # 深色模板
│   └── carousel-light.html        # 淺色模板（可選）
├── scripts/
│   ├── generate-carousel.js       # Playwright 截圖
│   └── upload-and-publish.js      # 上傳 + Meta API + Telegram
├── output/                        # 生成的圖片（gitignore）
└── carousel-data.json             # Claude 生成的文案（gitignore）
```

---

## 工具清單與替代方案

| 環節 | 目前用 | 替代方案 | 替換成本 |
|------|--------|---------|---------|
| 流程控制 | Claude Code | — | — |
| 文案生成 | Claude Code | GPT-4、Gemini | 換 API call |
| 圖片生成 | Playwright | Puppeteer | 換截圖 API |
| 圖床 | catbox.moe | Cloudflare R2、S3、Imgur | 換 upload function |
| IG 發布 | Meta Graph API | — | 唯一選擇 |
| 通知 | Telegram | Discord webhook、LINE Notify、Slack | 換一行 URL |
| CI/CD | GitHub Actions | GitLab CI、本地 cron | 換 workflow 檔 |

每個環節都是獨立模組，換掉任何一個不影響其他部分。

---

## 整體來說

這套 pipeline 解決的不是「AI 能不能寫文案」的問題，而是**從想法到發布之間有多少摩擦力**的問題。

每一步單獨看都不難——寫文案、做圖、上傳、發文。但串在一起要 2-3 小時，是因為每一步都需要人去操作、等待、切換工具。把這些摩擦力全部用自動化消除掉，剩下的就只有最有價值的那一步：**決定要說什麼。**

第一次建 pipeline 需要花時間把每個環節串起來。但建完之後，每次發文的邊際成本趨近零。一句話進去，一篇輪播出來。

這也是 Claude Code 作為 orchestrator 的具體應用——它不只是聊天機器人，而是能串接工具、執行多步驟任務的自動化引擎。IG 輪播只是其中一個場景，同樣的架構可以套到任何「多步驟、跨工具」的工作流程上。

---

## 參考資料

- [Meta Graph API — Content Publishing](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/content-publishing)
- [Playwright — Screenshots](https://playwright.dev/docs/screenshots)
- [GitHub Actions — Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [catbox.moe — API](https://catbox.moe/tools.php)
- [Telegram Bot API — sendMessage](https://core.telegram.org/bots/api#sendmessage)
