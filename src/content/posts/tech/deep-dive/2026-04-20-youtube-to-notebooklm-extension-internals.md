---
title: "YouTube to NotebookLM 擴充套件怎麼做到的？拆解逆向工程與跨 Tab 架構"
date: 2026-04-20
type: guide
category: tech
tags: [chrome-extension, notebooklm, reverse-engineering, manifest-v3, youtube]
lang: zh-TW
tldr: "NotebookLM 沒有官方 API，這個擴充套件靠的是逆向工程 Google 內部 batchexecute RPC + DOM scraping + 跨 Tab 訊息傳遞，三者組合完成整個流程。"
description: "拆解 YouTube to NotebookLM Chrome 擴充套件的實作細節：如何在沒有官方 API 的情況下，用逆向工程的 batchexecute RPC、content script DOM scraping 和跨 Tab 訊息傳遞把 YouTube 影片送進 NotebookLM。"
draft: false
---

🌏 [English version](/posts/tech/deep-dive/2026-04-20-youtube-to-notebooklm-extension-internals-en)

Chrome Web Store 上有個擴充套件叫 [YouTube to NotebookLM](https://chromewebstore.google.com/detail/youtube-to-notebooklm/kobncfkmjelbefaoohoblamnbackjggk)，裝了 30 萬人，可以一鍵把 YouTube 影片、播放清單、頻道送進 NotebookLM。看起來很簡單，但 NotebookLM 根本沒有官方 API——這東西到底怎麼做到的？

## NotebookLM 沒有官方 API

這是整個實作的核心前提。Google 在 2025 年 9 月才推出 NotebookLM Enterprise API，而且只開放給企業客戶。一般使用者用的 NotebookLM 沒有任何公開端點。

所以這個擴充套件走的是逆向工程路線：觀察 NotebookLM 網頁版的 network 請求，找出 Google 內部的 RPC 機制。

## Google batchexecute：Google 服務的共用 RPC 骨幹

Google 很多服務（Search、Maps、Docs...）都用同一個內部 RPC 機制，端點格式長這樣：

```
POST https://notebooklm.google.com/_/LabsTailwindUi/data/batchexecute
Content-Type: application/x-www-form-urlencoded
```

每個操作對應一個不透明的方法代碼，例如：

| 操作 | RPC 代碼 |
|------|---------|
| 列出 Notebook | `wXbhsf` |
| 建立 Notebook | `CCqFvf` |
| 新增 Source | `izAoDd` |
| 取得 Notebook 詳情 | `rLM1Ne` |

認證不靠 token，靠的是使用者瀏覽器裡的 Google session cookie，加上從 NotebookLM 首頁抓到的 CSRF token（`SNlM0e`）。這表示使用者必須在同一個瀏覽器裡登入 NotebookLM，擴充套件才能運作。

這類逆向工程的風險很明顯：Google 隨時可以換代碼或改請求格式，擴充套件就壞了。

## 架構：三個元件、跨 Tab 溝通

擴充套件採用 Manifest V3，三個元件各司其職：

```
YouTube (content.js)
        │ chrome.runtime.sendMessage
        ▼
background.js (Service Worker)
        │ chrome.tabs.sendMessage
        ▼
NotebookLM (notebooklm-content.js)
        │ fetch → batchexecute
        ▼
NotebookLM 後端
```

**manifest.json** 的關鍵設定：

```json
{
  "manifest_version": 3,
  "permissions": ["activeTab", "storage", "scripting", "notifications"],
  "host_permissions": [
    "https://www.youtube.com/*",
    "https://notebooklm.google.com/*"
  ],
  "content_scripts": [
    { "matches": ["https://www.youtube.com/*"], "js": ["content.js"] },
    { "matches": ["https://notebooklm.google.com/*"], "js": ["notebooklm-content.js"] }
  ],
  "background": { "service_worker": "background.js" }
}
```

## YouTube 那側：抓影片資訊

`content.js` 注入 YouTube 頁面，負責：

1. 從 URL `?v=` query string 取得 video ID
2. 抓 DOM 裡的標題、頻道名稱
3. 用 `MutationObserver` 監聽 URL 變化（YouTube 是 SPA，換影片不會 reload）
4. 把資料用 `chrome.runtime.sendMessage` 送給 background

播放清單和頻道頁面同理，只是改抓多個影片 URL。

## NotebookLM 那側：DOM Scraping Notebook 清單

因為沒有 API，要知道使用者有哪些 Notebook，只能 scrape NotebookLM 的 DOM：

```javascript
const notebooks = [];
const candidates = [
  ...document.querySelectorAll('div[role="button"]'),
  ...document.querySelectorAll('a[href*="notebook"]'),
  ...document.querySelectorAll('[data-testid]'),
];
// 過濾掉 UI 雜訊（日期、"46 sources"、emoji...）
```

這段跑在 `notebooklm-content.js`，結果透過 `chrome.tabs.sendMessage` 回傳給 background，再顯示在 popup 的下拉選單。

## Background 做什麼

Service Worker 是整個流程的協調者：

- 接收來自 YouTube content script 的影片資料
- 接收來自 popup 的使用者操作（選哪個 Notebook、要不要建新的）
- 找到或建立 NotebookLM tab，把指令傳進去
- 由 NotebookLM content script 實際呼叫 batchexecute API

值得注意的是，batchexecute 的呼叫在 NotebookLM tab 的 content script 裡發出，這樣 session cookie 自然帶上，不需要額外處理認證。

## 整體來說

這個擴充套件能運作，靠的是三個技巧的組合：

1. **逆向工程 batchexecute**：Google 沒給 API，自己找
2. **DOM scraping**：Notebook 清單沒有端點，刮畫面
3. **跨 Tab 訊息傳遞**：繞過 CORS，讓 NotebookLM tab 自己發請求

設計很聰明，但本質上是在走鋼索——任何一層的 Google 改版都可能讓它壞掉。對想做類似整合的開發者來說，這是個很好的範本，展示了在沒有官方 API 的情況下，Content Script + Service Worker + 逆向工程能組合出多完整的自動化流程。

---

## 參考資料

- [muhammedtaufiq/youtube-to-notebooklm-extension](https://github.com/muhammedtaufiq/youtube-to-notebooklm-extension) — 開源參考實作
- [teng-lin/notebooklm-py](https://github.com/teng-lin/notebooklm-py) — Python 版逆向工程，有完整 RPC method 列表
- [eluchansky10/notebooklm-web-importer](https://github.com/eluchansky10/notebooklm-web-importer) — 支援播放清單與 RSS 的類似實作
- [Chrome Extension Manifest V3 文件](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
