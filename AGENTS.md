# quidproquo — AI Agent 指引

這是 [quidproquo.cc](https://quidproquo.cc) 的部落格專案，以 Astro + Cloudflare Workers 建構。

## 寫文章

### 存放位置與檔名

```
src/content/posts/<category>/YYYY-MM-DD-<slug>.md
```

slug 用英文 kebab-case，取關鍵詞，例如：
- `src/content/posts/tech/2026-03-12-d1-batch-timeout.md`
- `src/content/posts/climbing/2026-03-15-first-outdoor-lead.md`

### Frontmatter

```yaml
---
title: ""           # 必填
date: YYYY-MM-DD    # 必填
category: ""        # 必填，見下方清單
tags: []            # 必填，全小寫 kebab-case，可空陣列
lang: zh-TW         # 必填，zh-TW 或 en
description: ""     # 選填，SEO meta description
tldr: ""            # 選填，一句話摘要（tech 類強烈建議）
draft: false        # 選填，true 時不顯示
---
```

### 支援的分類

`tech` / `climbing` / `surf` / `film` / `life` / `coffee` / `learning` / `ai` / `product` / `marketing` / `travel` / `design` / `education` / `policy` / `anime` / `career`

### 文章結構模板

**tech（踩坑 / 問題解決）**：

```
## TL;DR
## 情境
## 問題
## 嘗試過程
## 解法
## 為什麼會這樣
## 學到的事
```

**tech（工具 / 技術介紹）**：

開頭段落說明主題與讀者收穫。各段落至少涵蓋：設計哲學、與替代方案比較、適用情境、程式碼範例。結尾說明整體取捨。目標 1000–2000 字。

**其他分類**：無固定結構，依內容性質決定。

### 寫作風格

- 寫給「一週後的自己」，也寫給遇到同樣事情的人
- 直接，不客套，可以有情緒，不需要介紹自己
- tech：標題包含關鍵錯誤或技術名稱，具體 > 抽象
- climbing：臨場感，路線名稱、岩場地點、身體感受
- film：不劇透開頭，說清楚為什麼值得看（或不值得）
- career：誠實，包含猶豫和失敗的部分

### Commit 格式

```
post(<category>): <標題摘要>
```

例如：`post(tech): Cloudflare D1 batch timeout 踩坑記錄`
