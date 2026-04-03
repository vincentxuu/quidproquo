---
title: "ChemistryTimes 專案分析：AI 驅動的雙語每日電子報系統"
date: 2026-04-03
category: tech
tags: [chemistry-times, go, gin, mongodb, docker, ai-pipeline, claude-code, newsletter, automation, full-stack]
lang: zh-TW
tldr: "ChemistryTimes 是一個用 Go + Gin + MongoDB 打造的 AI 驅動雙語每日電子報系統。它把新聞聚合、AI 多階段生成、紐約時報風格的網頁閱讀器整合在一個 monolith 裡，用 Docker Compose 部署，搭配 Nginx + Let's Encrypt 做 SSL。整個內容生成流程由 Claude Code agent team 六階段串接完成。"
description: "深度分析 chemistrywow31/chemistry-times 專案——一個用 Go monolith 架構實作的 AI 自動化雙語電子報系統，涵蓋架構設計、技術選型、AI agent pipeline、部署策略與值得學習的設計決策。"
draft: false
---

## 專案概述

[ChemistryTimes](https://github.com/chemistrywow31/chemistry-times) 是一個 AI 驅動的內部每日電子報系統，自我定位為「bilingual web reader + automated content pipeline, all in one Go monolith」。它自動聚合新聞，透過 AI agent pipeline 生成雙語內容（繁體中文 + 英文），最終以類紐約時報風格的網頁介面呈現。

部署在 `chemistry-wow.com`，有兩個頻道：

- `/chemistry-times` — 主頻道（科技、AI、求職、資本動態）
- `/chemistry-game-times` — 遊戲產業專屬頻道

## 技術架構

### 技術棧

| 層級 | 技術選型 |
|------|----------|
| 後端 | Go 1.24 + Gin framework |
| 資料庫 | MongoDB 7 |
| 前端 | 原生 HTML/CSS/JS + Go templates |
| AI 生成 | Claude Code agent teams |
| 部署 | Docker Compose (4 containers) |
| 反向代理 | Nginx + Let's Encrypt SSL |

### 專案結構

```
chemistry-times/
├── claude_agents/    # AI agent team 定義與設定
├── web/              # 前端模板與靜態資源
├── internal/         # Go 應用核心邏輯
├── nginx/            # 反向代理設定
├── scripts/          # 發佈與工具腳本
├── docker-compose.yml
└── Dockerfile
```

### 架構特點：Go Monolith

這個專案選擇了 Go monolith 而非微服務架構，這是一個有意識的設計決策：

1. **單一部署單元**：一個 Go binary 處理 HTTP serving、template rendering、資料庫操作
2. **無 JS 框架**：前端用 Go templates + 原生 JS，不引入 React/Vue 等 SPA 框架
3. **跨平台編譯**：開發環境 Mac ARM64，目標環境 Linux AMD64，Go 的交叉編譯讓這件事很簡單

這種選擇適合內部工具——團隊規模小、部署簡單、維護成本低。

## AI Agent Pipeline

這是整個專案最有意思的部分。內容生成不是一次性的 LLM 呼叫，而是一個六階段的 agent pipeline：

```
選題 → 採訪報導 → 事實查核 → 深度分析 → 撰稿 → HTML 產出 → 審稿
```

### 六階段流程

1. **Selection（選題）**：從聚合的新聞源中挑選值得報導的主題
2. **Reporting（採訪報導）**：針對選定主題收集更多資料
3. **Verification（事實查核）**：交叉比對資訊的正確性
4. **Analysis（深度分析）**：加入脈絡和觀點
5. **Writing + HTML（撰稿 + 產出）**：生成雙語文章和排版好的 HTML
6. **Review（審稿）**：最終品質把關

這種 multi-stage pipeline 設計的好處：

- **品質控制**：每個階段有明確的輸入/輸出規格，錯誤不會在階段間累積
- **可除錯**：問題出在哪個階段很清楚
- **Coordinator pattern**：有一個協調者統籌整個流程，不是 agent 自己決定下一步

這跟目前 AI agent 設計的主流思路（orchestrator pattern）一致，比 fully autonomous agents 更可控。

## 部署架構

Docker Compose 跑 4 個 container：

```
┌──────────────┐     ┌──────────────┐
│    Nginx     │────▶│   Go App     │
│  (SSL/Proxy) │     │  (Gin HTTP)  │
└──────────────┘     └──────┬───────┘
                            │
┌──────────────┐     ┌──────▼───────┐
│  Certbot     │     │  MongoDB 7   │
│  (SSL Renew) │     │  (Database)  │
└──────────────┘     └──────────────┘
```

- **Nginx**：反向代理 + SSL 終端
- **Go App**：應用服務器
- **MongoDB**：文章和設定儲存
- **Certbot**：Let's Encrypt 自動續簽

這是一個標準的小型生產環境配置，足夠應付內部電子報的流量。

## 前端設計

### NYT 風格的報紙排版

前端模仿紐約時報的報紙排版，這不只是視覺選擇——電子報用報紙風格有閱讀體驗上的道理：

- 多欄排版讓掃讀更高效
- 明確的視覺層級（頭條、副標、內文）
- Dark mode 支援（現代化的務實選擇）

### Iframe 嵌入

文章內容使用 iframe 嵌入，這是一個值得討論的設計：

- **優點**：內容隔離、樣式不衝突、每篇文章可以有獨立的 HTML/CSS
- **代價**：SEO 不友善、無障礙性較差、額外的 HTTP 請求

對內部工具來說，這些代價是可以接受的。

## 內容分類

五大分類覆蓋了科技工作者關心的面向：

| 分類 | 內容 |
|------|------|
| AI Updates | AI 產業最新動態 |
| Tech Developments | 技術趨勢與產品更新 |
| Gaming Industry | 遊戲產業新聞 |
| Software Job Listings | 軟體工程師職缺情報 |
| Capital Movements | 投資與融資動態 |

## 值得學習的設計決策

### 1. Monolith > Microservices（對這個規模來說）

這個專案沒有為了架構而架構。一個 Go binary + MongoDB 就足夠了。不需要 Kubernetes、不需要 service mesh、不需要 event bus。

### 2. AI Pipeline 的 Coordinator Pattern

不讓 AI agent 自己決定流程，而是用明確的 coordinator 控制六個階段的執行順序。這確保了可預測性和可除錯性。

### 3. Claude Code Agent Teams

用 Claude Code 的 agent team 能力來組織多階段生成流程，比起手寫 LangChain/LangGraph chain，配置更直觀，維護更簡單。

### 4. 雙語同步生成

不是先寫中文再翻譯（或反之），而是在 pipeline 中同步處理雙語內容，避免翻譯的品質損失。

### 5. 沒有用前端框架

Go templates + 原生 JS 就夠了。內部工具不需要 SPA 的互動性，服務端渲染反而更簡單、更快。

## 可改進方向

1. **CI/CD**：目前看起來是手動部署，可以加上 GitHub Actions 自動化
2. **內容版本控制**：文章內容如果也用 Git 管理，可以追蹤修改歷史
3. **監控**：加上基本的 application monitoring（Prometheus + Grafana 或更輕量的方案）
4. **RSS 輸出**：讓讀者可以用 RSS reader 訂閱
5. **搜尋功能**：隨著內容累積，全文搜尋會越來越有價值

## 總結

ChemistryTimes 是一個務實的小型全端專案，最大的亮點是它的 AI agent pipeline 設計。用六階段串接取代單次 LLM 呼叫，用 coordinator pattern 控制流程，用 Claude Code agent teams 作為生成引擎——這套模式值得其他想做 AI 自動化內容生成的團隊參考。

技術選型上，Go monolith + MongoDB + Docker Compose 是小團隊做內部工具的經典搭配，不花俏但有效。前端用 Go templates 而不引入 JS 框架，也體現了「夠用就好」的工程判斷。

---

## 參考資料

- [chemistrywow31/chemistry-times - GitHub](https://github.com/chemistrywow31/chemistry-times)
- [Gin Web Framework](https://gin-gonic.com/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
