---
title: "用 Astro + Cloudflare Workers 從零建立低摩擦部落格"
date: 2026-03-12
category: product
tags: [astro, cloudflare, d1, claude-code, blog]
lang: zh-TW
description: "為什麼建 quidproquo.cc、怎麼選技術棧、post skill 如何讓寫作零阻力"
draft: false
---

## 為什麼要建

我有習慣把解決過的問題記錄下來，但這些筆記散落在本機、Notion、GitHub issue 裡，幾個月後根本找不到。

我也想要一個可以展示廣度的地方——不只是技術，還有攀岩、衝浪、電影、咖啡。履歷表放不下這些，LinkedIn 又太正式。

所以需求是：**一個什麼都能放、寫起來沒有阻力的地方。**

## 名字的由來

Quid pro quo 是拉丁語，意思是「等價交換」。

兩部動漫都碰過這個概念，角度不一樣。

進擊的巨人裡，阿爾敏說：

> 什麼都無法捨棄的人，什麼也改變不了。

為了戰勝怪物，有時必須捨棄自己的人性。這道出了在極端環境下，變革者必須承受的代價。

鋼之鍊金術師裡，阿爾馮斯說：

> 為了得到什麼，就必須付出同等的代價，這就是鍊金術的「等價交換」原則。那時的我們堅信，這就是世界的真理。

但到了結局他昇華了這句話：**如果得到十，就加上自己的一份心意，變成十一還給這個世界。**

這打破了冰冷的等價，帶出了互助、無私與愛的力量。

我認同這個方向——記錄不只是存起來，是把經歷換成對別人也有用的東西，然後多給一點。名字就這樣定了。

## 為什麼不用現成的

Notion、Medium、Substack 都試過。問題在於它們都有摩擦：要切換視窗、登入、適應編輯器。解完一個問題後，那股「想記下來」的衝動撐不過這些步驟。

更重要的是，這個部落格本身就是一個 portfolio piece——一個跑在 Cloudflare 全端的應用，這樣才有意思。

## 技術選擇

**Astro 6**：內容導向、Cloudflare 整合完善、文章用 Content Collections 管理乾淨。沒有選 Next.js 是因為不需要那麼重。

**Cloudflare Workers**：靜態資源 + server-side 邏輯都在同一個平台，不需要管 hosting。

**Cloudflare D1**：文章的衍生資料庫。Markdown 是 source of truth，D1 是 build 時自動同步的副本，為 Phase 4 的 RAG 搜尋鋪路。

**Hybrid 渲染**：文章頁 `prerender = true`（靜態、速度快、SEO 好），API endpoints 走 SSR。

## 核心設計：post skill

整個架構裡最重要的部分不是資料庫設計，是 **post skill**。

在 Claude Code CLI 的 `.claude/skills/post/` 放一個 skill，解完問題後說一句「寫成文章」，它就會：

1. 判斷分類（tech / climbing / film / ...）
2. 套用對應模板
3. 填入 frontmatter
4. 存到 `src/content/posts/<category>/`
5. commit

整個流程不超過一分鐘，不需要切換視窗。這才是「零摩擦」。

## 雙路徑架構

Markdown 是唯一的 source of truth，D1 是衍生的副本。

```
post skill 產生 .md
        │
┌───────┴───────┐
↓               ↓
靜態部落格      D1 資料庫
（讀者看文章）  （未來 RAG 搜尋用）
```

D1 壞了可以從 `.md` 完全重建，沒有什麼是不可逆的。

## 現在的狀態

Phase 1+2 完成：

- Astro 6 + Cloudflare Workers 部署
- Content Collections + i18n（zh-TW / en）
- 首頁、文章頁、分類頁、標籤頁
- D1 schema + build-time sync
- post skill

這篇文章本身就是用 post skill 產生的。

## 接下來

- Phase 3：用 Cloudflare Browser Rendering 定期爬技術文件
- Phase 4：Vectorize + Workers AI 做 RAG 搜尋

先把寫作習慣建立起來，其他的事後加。
