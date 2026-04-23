---
title: "GitBook：把文件變成產品的文件平台"
date: 2026-04-02
type: guide
category: tech
tags: [gitbook, documentation, knowledge-base, markdown, git, developer-tools]
lang: zh-TW
tldr: "GitBook 是一個以 Git 為底層的文件平台，支援 Markdown 編輯、版本控制、多人協作。適合技術文件、API docs、內部知識庫。免費方案對個人和小團隊夠用。"
description: "GitBook 介紹：Git-based 文件平台，核心功能、使用場景、與其他文件工具的比較、設定方式，以及什麼時候該用 GitBook。"
draft: false
---

GitBook 是一個讓你用寫 code 的方式管理文件的平台。底層用 Git 做版本控制，內容用 Markdown 寫，最後產出一個有搜尋、有導覽、可以自訂域名的文件網站。如果你曾經為了寫技術文件在 Notion、Confluence、自架 wiki 之間猶豫，GitBook 值得認真考慮。

## 核心特性

- **Git 同步**：可以綁定 GitHub / GitLab repo，push 就自動更新文件站。反過來，在 GitBook 網頁編輯器改的內容也會 commit 回 repo
- **Markdown + 富文本**：支援純 Markdown 撰寫，也提供 WYSIWYG 編輯器給不熟 Markdown 的人用
- **版本控制**：每次修改都有歷史紀錄，支援 change request（類似 PR）的審核流程
- **全文搜尋**：內建搜尋，支援中文，使用者不用翻目錄就能找到內容
- **多空間（Spaces）**：一個組織可以有多個獨立文件空間，例如 API Docs、User Guide、Internal Wiki 各一個
- **自訂域名**：付費方案可以綁自己的 domain（例如 `docs.yourcompany.com`）
- **AI 搜尋**：內建 AI 助手，可以用自然語言問問題，它會從你的文件裡找答案

## 基本設定：GitHub 同步

GitBook 最強的工作流是和 GitHub repo 雙向同步。設定方式：

1. 在 GitBook 建立一個 Space
2. 進入 Space 設定 → Integrations → GitHub
3. 選擇要同步的 repo 和 branch
4. 選擇同步方向：
   - **GitBook → GitHub**：在 GitBook 編輯，自動 push 到 repo
   - **GitHub → GitBook**：在 repo 改 Markdown，自動更新 GitBook
   - **雙向同步**：兩邊都可以改，GitBook 負責 merge

```
你的 GitHub Repo
├── README.md          # 首頁
├── SUMMARY.md         # 目錄結構（GitBook 用這個檔案決定導覽列）
├── getting-started/
│   ├── installation.md
│   └── quick-start.md
├── guides/
│   ├── authentication.md
│   └── deployment.md
└── api-reference/
    ├── endpoints.md
    └── errors.md
```

## SUMMARY.md：文件的骨架

GitBook 用 `SUMMARY.md` 決定左側導覽列的結構。這是整個文件站最重要的檔案：

```markdown
# Summary

## Getting Started

* [安裝](getting-started/installation.md)
* [快速開始](getting-started/quick-start.md)

## Guides

* [身份驗證](guides/authentication.md)
* [部署](guides/deployment.md)

## API Reference

* [端點](api-reference/endpoints.md)
* [錯誤碼](api-reference/errors.md)
```

巢狀結構用縮排表示，GitBook 會自動產生多層的側邊導覽。

## 適用場景

| 場景 | 適合程度 | 說明 |
| :--- | :--- | :--- |
| **開源專案文件** | 非常適合 | 免費、Git 同步、社群可以 PR 改文件 |
| **API 文件** | 適合 | 支援 OpenAPI import、程式碼區塊高亮 |
| **團隊內部知識庫** | 適合 | 權限控管、多空間、搜尋功能完整 |
| **產品使用手冊** | 適合 | 支援多語系、自訂品牌 |
| **個人筆記** | 普通 | 可以用，但 Notion / Obsidian 更靈活 |
| **部落格** | 不適合 | 沒有 RSS、沒有時間軸、不是為文章設計的 |

## 與其他文件工具的比較

### GitBook vs Notion

Notion 是通用型工作空間，GitBook 專注文件。如果你的目標是「對外公開的技術文件」，GitBook 的搜尋、導覽、SEO 都比 Notion 公開頁面好很多。但如果你只是要內部團隊協作，Notion 的靈活性更高。

### GitBook vs Docusaurus / VitePress

Docusaurus 和 VitePress 是靜態網站產生器，你要自己 build、自己 deploy。好處是完全可控，壞處是要維護 CI/CD pipeline 和版本升級。GitBook 是 managed service，不用管 infra，但客製化程度較低。

### GitBook vs Confluence

Confluence 是企業級 wiki，功能多但肥。GitBook 的介面乾淨，上手快，Git 整合比 Confluence 好很多。但如果你的公司已經全套 Atlassian（Jira + Confluence），切換成本不低。

### GitBook vs ReadMe

ReadMe 專注 API 文件，有互動式 API explorer。如果你的核心需求是 API docs，ReadMe 比 GitBook 更專精。但如果你除了 API 還有其他文件需求，GitBook 的通用性更好。

### GitBook vs Mintlify

Mintlify 是目前對 GitBook 威脅最大的競品。設計更現代、API playground 內建、MDX 支援好。OpenAI、Anthropic、Cohere、Mistral 等 AI 公司的 API 文件幾乎都選了 Mintlify。GitBook 的優勢在免費方案更大方、WYSIWYG 編輯器對非工程師更友善。

## 定價

| 方案 | 價格 | 重點功能 |
| :--- | :--- | :--- |
| **Free** | $0 | 1 個公開空間、無限頁面、Git 同步、社群支援 |
| **Plus** | $6.70/月/人 | 多空間、自訂域名、PDF export、進階權限 |
| **Pro** | $12.50/月/人 | SSO、API、進階分析、優先支援 |
| **Enterprise** | 洽談 | SLA、專屬支援、合規功能 |

免費方案對個人專案和開源文件來說綽綽有餘。

## 快速上手

### 方法一：從 GitBook 網頁開始

1. 到 [gitbook.com](https://www.gitbook.com) 註冊
2. 建立 Organization → 建立 Space
3. 直接在網頁編輯器裡寫文件
4. 需要時再設定 GitHub 同步

### 方法二：從 GitHub Repo 開始

1. 在 repo 裡建立 `SUMMARY.md` 和對應的 Markdown 檔案
2. 到 GitBook 建立 Space，設定 GitHub Integration
3. 選擇 repo 和 branch，啟用同步
4. GitBook 自動讀取 `SUMMARY.md`，產生文件站

### 方法三：用 GitBook CLI（已棄用）

早期的 `gitbook-cli` npm 套件已經不再維護。現在 GitBook 完全是 SaaS 產品，不需要本地安裝任何東西。如果在網路上看到 `npm install -g gitbook-cli` 的教學，那是過時的。

## 實用技巧

- **用 `.gitbook.yaml` 控制同步行為**：可以指定 root 目錄、排除特定檔案

```yaml
# .gitbook.yaml
root: ./docs/

structure:
  readme: README.md
  summary: SUMMARY.md
```

- **Change Requests**：啟用後，每次修改都要經過審核才會發布，適合多人協作的團隊
- **自訂 favicon 和 logo**：在 Space 設定裡上傳，讓文件站看起來像你的產品的一部分
- **嵌入外部內容**：支援嵌入 YouTube、CodeSandbox、Figma 等第三方內容
- **Variants（多版本）**：可以維護同一份文件的多個版本（例如 v1、v2），使用者可以切換

## 什麼時候不該用 GitBook

- 你需要高度客製化的頁面設計 → 用 Docusaurus / VitePress
- 你的文件超過幾千頁且結構複雜 → 考慮 Confluence 或自建方案
- 你只是要個人筆記 → Obsidian 或 Notion 更適合
- 你需要離線使用 → GitBook 是純線上服務

## 結語

GitBook 的定位很清楚：用最低的設定成本，把 Markdown 文件變成一個專業的文件網站。Git 同步讓你不用離開熟悉的工作流，WYSIWYG 編輯器讓非工程師也能貢獻內容。免費方案的功能對大多數場景已經夠用，是目前技術文件平台裡上手最快的選項之一。

## 參考資料

- [GitBook 官方網站：Git-based 文件平台](https://www.gitbook.com/)
- [GitBook 官方文件：GitHub 同步與 SUMMARY.md 設定](https://docs.gitbook.com/)
- [GitBook vs Docusaurus：技術文件工具比較](https://www.gitbook.com/)
- [GitBook 定價方案：Free、Plus、Pro、Enterprise](https://www.gitbook.com/pricing)
