---
title: "一句話發一篇 IG 輪播 — 從手動 3 小時到全自動的 Pipeline 拆解"
date: 2026-04-01
category: ai
tags: [claude-code, instagram, automation, playwright, github-actions, meta-graph-api]
lang: zh-TW
tldr: "用 Claude Code 當 orchestrator，串接 Playwright 截圖、catbox.moe 圖床、Meta Graph API 發布、Telegram 通知，一句話完成 IG 輪播圖文的生成與發布。"
description: "完整拆解用 Claude Code + Playwright + GitHub Actions 自動化 IG 輪播圖文的 pipeline，從文案生成到自動發布，每個環節的工具選擇與設計邏輯。"
draft: false
type: guide
---

以前做一組 IG 輪播，流程大概是這樣：想主題、寫文案、開 Canva 排版、調字體顏色、匯出圖片、開 IG app 上傳、寫 caption、加 hashtag。整套做完，2-3 小時跑不掉。

現在我跟 Claude 說一句話：「做一組 AI 自動化主題的 IG 輪播，5 張英文內文」，然後去倒咖啡。回來的時候 Telegram 通知已經跳出來了：發布成功。

這篇拆解整條 pipeline 怎麼建的。

---

## 整體架構

```
你說一句話
    ↓
Claude Code（orchestrator）
    ↓ 生成文案
    ↓ 填入 HTML 模板
    ↓ Playwright 截圖 → PNG
    ↓ 上傳 catbox.moe → 取得公開 URL
    ↓ 呼叫 Meta Graph API → 發布 IG 輪播
    ↓ Telegram Bot 通知
    ✓ 完成
```

重點：**這不是一個工具，是一條 pipeline。** Claude Code 是 orchestrator，負責串接每個環節。每個環節都是獨立的，可以單獨替換。

---

## Step 1：說出你想發什麼

沒有表單、沒有設定檔。直接用自然語言描述：

> 「做一組 AI 自動化主題的 IG 輪播，5 張英文內文」

Claude 會從這句話裡解析出：

- **主題**：AI 自動化
- **張數**：5 張
- **語言**：英文
- **風格**：預設（也可以指定，像「科技感深色背景」）

這就是 LLM 當 orchestrator 最大的優勢——輸入介面就是自然語言，不需要定義 schema。

---

## Step 2：Claude 生成文案

根據主題，Claude 自動產出每張圖的內容結構：

| 張數 | 內容 |
|------|------|
| 第 1 張 | Hook — 吸引停下滑的標題 |
| 第 2-4 張 | 核心內容 — 每張一個重點，標題 + 說明 |
| 第 5 張 | CTA — 行動呼籲（Follow / Save / Share） |

這裡的關鍵不是「AI 會寫文案」這件事，而是**結構化輸出**。每張圖的標題、副標題、內文、CTA 都是結構化的資料，後面才能自動填進模板。

---

## Step 3：HTML 模板 + Playwright 截圖

這一步是整條 pipeline 最精巧的地方。

傳統做法是用 Canva 或 Figma 手動排版。但圖片其實就是「固定版面的視覺呈現」——跟網頁一模一樣。所以：

1. **用 HTML/CSS 寫模板**：定義好輪播圖的版面、字體、配色、間距
2. **Claude 把文案填進模板**：每張圖對應一個 HTML 檔案
3. **Playwright 開瀏覽器截圖**：把 HTML render 成 1080×1080 的 PNG

為什麼用 Playwright 而不是 Satori 或 Puppeteer？

- **Satori** 不支援完整 CSS（沒有 flexbox gap、沒有 grid）
- **Puppeteer** 可以，但 Playwright 的 API 更乾淨，且原生支援多瀏覽器
- Playwright 的 `page.screenshot()` 可以直接指定 viewport 大小，輸出就是精確的 1080×1080

```javascript
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1080, height: 1080 });
await page.setContent(htmlContent);
await page.screenshot({ path: `slide-${i}.png` });
```

模板是可以換的。想換風格，換一個 HTML 模板就好，文案邏輯完全不用動。

---

## Step 4：上傳圖床

Meta Graph API 要求圖片必須是**公開可存取的 URL**。本地檔案不行、私有 URL 不行。

所以需要一個圖床。選 [catbox.moe](https://catbox.moe) 的原因：

- **免費**，不需要註冊
- **API 簡單**，一個 POST 就能上傳
- 回傳的 URL 是公開的，Meta API 能直接抓
- 檔案保留時間足夠長（不會在 API 呼叫前就過期）

```bash
curl -F "reqtype=fileupload" -F "fileToUpload=@slide-1.png" https://catbox.moe/user/api.php
# 回傳：https://files.catbox.moe/abc123.png
```

如果你需要更穩定的方案，可以換成 Cloudflare R2 或 S3——pipeline 裡只需要換掉上傳那一步，其他都不用動。

---

## Step 5：Meta Graph API 發布

Instagram 的輪播發布透過 [Meta Graph API](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/content-publishing) 完成，流程分三步：

### 1. 為每張圖建立 media container

```
POST /{ig-user-id}/media
  image_url={公開URL}
  is_carousel_item=true
```

### 2. 建立 carousel container

```
POST /{ig-user-id}/media
  media_type=CAROUSEL
  children={container_1_id},{container_2_id},...
  caption={你的caption和hashtag}
```

### 3. 發布

```
POST /{ig-user-id}/media_publish
  creation_id={carousel_container_id}
```

三步都是 REST API，Claude Code 直接用 `curl` 或 `fetch` 呼叫就好。需要的是一組 Instagram Business Account 的 access token，這個在 Meta Developer Portal 設定一次就行。

---

## Step 6：Telegram 通知

發布成功後，打一個 Telegram Bot API：

```
POST https://api.telegram.org/bot{token}/sendMessage
  chat_id={your_chat_id}
  text=✅ IG 輪播發布成功：{post_url}
```

為什麼用 Telegram 而不是 email 或 Slack？因為通知是給自己看的，Telegram 最輕量。要換成 Discord webhook 或 LINE Notify 也是一行的事。

---

## GitHub Actions：讓整條 pipeline 跑在 CI 上

上面所有步驟都可以在本地跑，但放到 GitHub Actions 上有幾個好處：

- **不佔本地資源**：Playwright 吃記憶體，放 CI 跑比較乾淨
- **可排程**：用 `cron` trigger 定時發文
- **可追蹤**：每次執行都有 log，出錯知道斷在哪
- **Secrets 管理**：Meta token、Telegram token 放在 GitHub Secrets

```yaml
on:
  workflow_dispatch:  # 手動觸發
  schedule:
    - cron: '0 9 * * 1'  # 每週一早上 9 點

jobs:
  publish-carousel:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npx playwright install chromium
      - run: node scripts/generate-carousel.js
      - run: node scripts/upload-and-publish.js
        env:
          META_ACCESS_TOKEN: ${{ secrets.META_ACCESS_TOKEN }}
          TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
```

---

## 工具清單總整理

| 環節 | 工具 | 角色 |
|------|------|------|
| 流程控制 | Claude Code | Orchestrator，理解指令、生成文案、呼叫各工具 |
| 文案生成 | Claude Code | 根據主題產出結構化的輪播內容 |
| 圖片生成 | Playwright | HTML → PNG 截圖 |
| 圖片託管 | catbox.moe | 提供公開 URL 給 Meta API |
| IG 發布 | Meta Graph API | 建立 carousel 並發布 |
| 通知 | Telegram Bot | 發布結果推播 |
| 自動化執行 | GitHub Actions | CI/CD 環境，排程與 secrets 管理 |

---

## 設計邏輯：為什麼這樣切

這條 pipeline 的設計有幾個刻意的選擇：

**每個環節都可以單獨替換。** 圖床從 catbox 換到 R2？改一個 function。通知從 Telegram 換到 Discord？改一行 URL。模板想換風格？換一個 HTML 檔案。這是 pipeline 思維，不是 monolith。

**Claude Code 當 orchestrator，不當 runtime。** Claude 負責理解意圖、生成內容、決定流程。但實際的截圖、上傳、API 呼叫都是確定性的腳本在做。LLM 做它擅長的事（語言、推理），確定性工作交給確定性工具。

**建完之後邊際成本趨近零。** 第一次建 pipeline 花時間，但建完之後每次發文就是一句話的事。模板可以重複用，文案自動生成，發布自動完成。時間成本從 2-3 小時降到接近零。

---

## 整體來說

這套 pipeline 解決的不是「AI 能不能寫文案」的問題，而是「從想法到發布之間有多少摩擦力」的問題。

每一步單獨看都不難——寫文案、做圖、上傳、發文。但串在一起要 2-3 小時，是因為每一步都需要人去操作、等待、切換工具。把這些摩擦力全部用自動化消除掉，剩下的就只有最有價值的那一步：決定要說什麼。

這也是 Claude Code 作為 agent harness 的一個具體應用——它不只是聊天機器人，而是一個能串接工具、執行多步驟任務的 orchestrator。IG 輪播只是其中一個場景，同樣的架構可以套到任何「多步驟、跨工具」的工作流程上。

---

## 參考資料

- [Meta Graph API — Content Publishing](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/content-publishing)
- [Playwright — Screenshots](https://playwright.dev/docs/screenshots)
- [GitHub Actions — Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [catbox.moe — API](https://catbox.moe/tools.php)
- [Telegram Bot API — sendMessage](https://core.telegram.org/bots/api#sendmessage)
