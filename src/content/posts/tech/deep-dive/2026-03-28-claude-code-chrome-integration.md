---
title: "Claude Code × Chrome：從 CLI 操控瀏覽器做前端開發自動化"
date: 2026-03-28
category: tech
tags: [claude-code, chrome, browser-automation, frontend, testing, dx]
lang: zh-TW
tldr: "claude --chrome 讓 Claude Code 連上你的 Chrome 瀏覽器——讀 console log、點按鈕、填表單、截圖、錄 GIF。寫完 code 直接在瀏覽器驗證，不用切換 context。共享你的登入狀態，能操作 Google Docs、Notion 等已登入的 app。"
description: "介紹 Claude Code 的 Chrome 整合（beta）：安裝設定、browser automation 能力、實際使用案例（live debugging、設計驗證、表單自動化、資料擷取），以及在 VS Code 中的整合方式。"
draft: true
series:
  name: "Claude Code 自動化指南"
  order: 21
---

<!-- TODO: 待撰寫 -->
<!-- 參考官方文件：https://code.claude.com/docs/en/chrome.md -->

## 預計大綱

### 什麼是 Chrome 整合
- `claude --chrome` 連上 Chrome 瀏覽器
- 基於 Claude in Chrome extension
- 共享瀏覽器登入狀態
- Beta 階段，支援 Chrome 和 Edge

### 設定方式
- 安裝 Claude in Chrome extension（v1.0.36+）
- `claude --chrome` 啟動
- 或 session 內 `/chrome` 啟用
- 設為預設：`/chrome` → "Enabled by default"

### 能力範圍
- 開新分頁、導航到 URL
- 點擊、輸入、滾動
- 讀取 DOM 和 console log
- 截圖和錄 GIF
- 跨分頁操作

### 實際案例

#### Live Debugging
```
我剛更新了登入表單驗證。
打開 localhost:3000，試著用無效資料提交，
檢查錯誤訊息是否正確。
```

#### 設計驗證
```
我按照 Figma mock 做了 UI，
打開瀏覽器確認是否一致。
```

#### Console Log 分析
```
打開 dashboard 頁面，
檢查 console 有沒有載入時的錯誤。
```

#### 表單自動化
```
我有 contacts.csv 的客戶資料。
幫我去 CRM 網站逐筆填入。
```

#### 操作已登入的 Web App
```
根據最近的 commits 寫一份專案更新，
加到我的 Google Doc 裡。
```

#### 錄製 Demo GIF
```
錄一段 GIF 展示結帳流程，
從加入購物車到確認頁面。
```

### 限制與注意事項
- 遇到 CAPTCHA 或登入頁面會暫停請你處理
- 不支援 Brave、Arc 等非主流 Chromium 瀏覽器
- 不支援 WSL
- 預設啟用會增加 context 消耗
