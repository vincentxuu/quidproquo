---
title: "How Does the YouTube to NotebookLM Extension Work? Reverse Engineering and Cross-Tab Architecture Dissected"
date: 2026-04-20
type: guide
category: tech
tags: [chrome-extension, notebooklm, reverse-engineering, manifest-v3, youtube]
lang: en
tldr: "NotebookLM has no official API. This extension works by combining three techniques: reverse-engineered Google batchexecute RPC calls, DOM scraping, and cross-tab message passing."
description: "A deep dive into the implementation of the YouTube to NotebookLM Chrome extension — how it uses reverse-engineered batchexecute RPC, content script DOM scraping, and cross-tab messaging to add YouTube videos to NotebookLM without any official API."
draft: false
---

🌏 [中文版](/posts/tech/deep-dive/2026-04-20-youtube-to-notebooklm-extension-internals)

There's a Chrome extension called [YouTube to NotebookLM](https://chromewebstore.google.com/detail/youtube-to-notebooklm/kobncfkmjelbefaoohoblamnbackjggk) with 300,000 installs. With one click, it sends YouTube videos, playlists, and channels straight into NotebookLM. Sounds simple — but NotebookLM has no official API. So how does it actually work?

## NotebookLM Has No Official API

This is the core constraint the entire implementation works around. Google didn't release a NotebookLM Enterprise API until September 2025, and even then it was enterprise-only. The consumer version of NotebookLM exposes zero public endpoints.

So this extension takes the reverse engineering route: observe the network requests made by the NotebookLM web app, then figure out Google's internal RPC mechanism.

## Google batchexecute: The Shared RPC Backbone Across Google Services

Many Google services — Search, Maps, Docs, and more — share the same internal RPC mechanism. The endpoint follows this format:

```
POST https://notebooklm.google.com/_/LabsTailwindUi/data/batchexecute
Content-Type: application/x-www-form-urlencoded
```

Each operation maps to an opaque method code, for example:

| Operation | RPC Code |
|-----------|----------|
| List Notebooks | `wXbhsf` |
| Create Notebook | `CCqFvf` |
| Add Source | `izAoDd` |
| Get Notebook Details | `rLM1Ne` |

Authentication doesn't use tokens — it relies on the user's Google session cookie already present in the browser, plus a CSRF token (`SNlM0e`) scraped from the NotebookLM homepage. This means the user must be logged into NotebookLM in the same browser for the extension to work.

The risks of this approach are obvious: Google can change method codes or request formats at any time, instantly breaking the extension.

## Architecture: Three Components, Cross-Tab Communication

The extension uses Manifest V3, with three components each playing a distinct role:

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
NotebookLM Backend
```

Key settings in **manifest.json**:

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

## The YouTube Side: Extracting Video Info

`content.js` is injected into YouTube pages and is responsible for:

1. Extracting the video ID from the `?v=` query string in the URL
2. Scraping the title and channel name from the DOM
3. Using `MutationObserver` to watch for URL changes (YouTube is a SPA — switching videos doesn't cause a page reload)
4. Sending the data to the background service worker via `chrome.runtime.sendMessage`

Playlist and channel pages work the same way, just collecting multiple video URLs instead of one.

## The NotebookLM Side: DOM Scraping the Notebook List

With no API available, the only way to know which Notebooks a user has is to scrape the NotebookLM DOM directly:

```javascript
const notebooks = [];
const candidates = [
  ...document.querySelectorAll('div[role="button"]'),
  ...document.querySelectorAll('a[href*="notebook"]'),
  ...document.querySelectorAll('[data-testid]'),
];
// Filter out UI noise (dates, "46 sources", emoji...)
```

This runs inside `notebooklm-content.js`. The results are sent back to the background via `chrome.tabs.sendMessage` and then displayed in the popup's dropdown menu.

## What the Background Does

The service worker acts as the orchestrator for the entire flow:

- Receives video data from the YouTube content script
- Receives user actions from the popup (which Notebook to use, whether to create a new one)
- Finds or creates the NotebookLM tab and passes instructions into it
- The NotebookLM content script then makes the actual batchexecute API calls

One particularly clever detail: the batchexecute calls are made from within the NotebookLM tab's content script. This means the session cookie is automatically included in every request — no additional authentication handling required.

## Putting It All Together

This extension works because of three techniques working in concert:

1. **Reverse-engineered batchexecute**: No API? Find your own.
2. **DOM scraping**: No endpoint for the Notebook list? Scrape the screen.
3. **Cross-tab messaging**: Bypass CORS by having the NotebookLM tab make its own requests.

The design is clever, but it's fundamentally walking a tightrope — any Google update at any layer could break it overnight. For developers looking to build similar integrations, this is an excellent reference showing just how much automation you can achieve with Content Scripts + Service Workers + reverse engineering, even when there's no official API to work with.

---

## References

- [muhammedtaufiq/youtube-to-notebooklm-extension](https://github.com/muhammedtaufiq/youtube-to-notebooklm-extension) — open-source reference implementation
- [teng-lin/notebooklm-py](https://github.com/teng-lin/notebooklm-py) — Python reverse engineering implementation with a full RPC method list
- [eluchansky10/notebooklm-web-importer](https://github.com/eluchansky10/notebooklm-web-importer) — similar implementation with playlist and RSS support
- [Chrome Extension Manifest V3 Documentation](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
