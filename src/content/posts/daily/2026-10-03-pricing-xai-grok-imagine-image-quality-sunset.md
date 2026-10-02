---
title: "定價追蹤｜xAI 停用 grok-imagine-image-quality，11/2 起靜默轉址到 2.0"
date: 2026-10-03
category: daily
type: digest
tags: [ai-agent, pricing, daily, xai]
lang: zh-TW
description: "xAI 將於 2026-11-02 停用 grok-imagine-image-quality，屆時所有請求自動轉給更便宜的 grok-imagine-image-2.0（quality: low），不換程式碼也能省錢，但畫質預設被鎖在最低檔"
tldr: "xAI 的 grok-imagine-image-quality 將於 2026-11-02 停用（9/2 發出 60 天預告），屆時所有請求自動轉給 grok-imagine-image-2.0 並強制套用 quality: low，每張圖從 $0.05 降到 $0.04（↓20%）。重點是 2.0 本身不分 quality 計價——主動遷移並手動指定 quality: medium 可以拿到更好的畫質，價格完全一樣，只是被動等轉址的人會被鎖在最低畫質。"
series:
  name: "AI Pricing Watch"
  order: 15
---

> 🌏 [English version](/en/posts/daily/2026-10-03-pricing-xai-grok-imagine-image-quality-sunset-en)

## 變更摘要

xAI 在 9/2 發出 60 天預告，2026-11-02 起正式停用 `grok-imagine-image-quality`，模型代稱繼續可用但請求會被靜默轉給 `grok-imagine-image-2.0`，並強制套用 `quality: "low"`。單看價格這是一次降價——每張圖從 $0.05 降到 $0.04——但真正值得注意的是定價結構本身的變化：新模型 `grok-imagine-image-2.0` 不分 quality 計價，`low` 和 `medium` 同樣是 $0.04/image。換句話說，被動等系統自動轉址的人，拿到的是「降價但畫質被鎖死在最低檔」；主動在 11/2 前遷移、自己指定 `quality: "medium"` 的人，則是「降價且畫質更好」——同一次 API 變動，兩種遷移方式的結果完全不同。

## 前後對照

| 項目 | 舊 | 新 | 變化 | 生效日 |
|---|---|---|---|---|
| 模型代稱 | `grok-imagine-image-quality` | `grok-imagine-image-2.0`（quality: low，自動轉址） | 代稱保留，底層模型替換 | 2026-11-02 |
| 每張圖片價格 | $0.05/image | $0.04/image | ↓20% | 2026-11-02 |
| 可選畫質層級 | 無（單一畫質） | `low` / `medium` / `auto`，三者同價 $0.04/image | 新增選項，同價不同質 | 2026-11-02 起可用 |
| 單次編輯可帶入來源圖片數 | 不支援 | 最多 5 張 | 新增能力 | 2026-11-02 起可用 |
| 新增長寬比 | 不支援 21:9 / 5:2 | 支援 21:9 / 5:2 | 新增能力 | 2026-11-02 起可用 |

## 成本試算

**場景**：一個每天產生 1,000 張行銷素材圖片的 Agent，持續呼叫 `grok-imagine-image-quality`，完全不更動程式碼，讓它在 11/2 後被動轉址。

| | 舊定價（10 月） | 新定價（11 月起，轉址後） | 月省 |
|---|---|---|---|
| 每日成本 | $50 | $40 | $10 |
| **月成本（×30 天）** | **$1,500** | **$1,200** | **$300（↓20%）** |

這 $300/月的「省下來」是用畫質換的——轉址預設套用 `low`，是 2.0 三個畫質層級裡最陽春的一檔。如果改成主動遷移、程式碼裡明寫 `quality: "medium"`，月成本仍然是 $1,200，但換到的是「2.0 用更多運算資源精修細節」的版本，不必多付一毛錢。被動等轉址，等於白白放棄了這個免費的畫質升級。

## 對開發者/企業的影響

### 誰最受益

主動在 11/2 前完成遷移、而且會去讀 migration guide 的團隊受益最大——他們拿到降價＋畫質選擇權＋多圖編輯＋新長寬比四項好處。只掛著舊代稱不管的團隊，只拿到降價，其他三項能力和畫質控制權都錯過了。

### 競爭格局影響

「退役舊模型代稱、自動轉址到新模型」是近幾個月 xAI 和 OpenAI 共同的作法（OpenAI 8 月也用類似手法處理過模型退役），但這次 xAI 多了一個值得注意的細節：新舊模型之間不是單純的升級關係，而是用「畫質參數」把同一個價格拆成多檔，預設值刻意選了最低檔。對比圖像生成 API 市場，這種「同價不同質、預設給最低」的定價手法，比單純漲價或降價更容易在使用者沒注意的情況下悄悄降低服務水準。

### 行動建議

- 如果你的程式碼裡還寫死 `grok-imagine-image-quality`：11/2 前主動改成 `grok-imagine-image-2.0`，並明確帶 `quality` 參數，不要讓系統用 `auto`／轉址幫你決定
- 如果畫質對你的場景重要（行銷素材、對外交付成品）：直接指定 `quality: "medium"`，價格和 `low` 一樣是 $0.04/image，沒有理由讓系統預設把你鎖在最低檔
- 如果你在用 `grok-imagine-image-pro`：它已經轉址到 `grok-imagine-image-quality`，11/2 會跟著再轉一次到 2.0，建議直接一次遷移到位，不要讓請求疊兩層轉址
- 遷移只是把 `model` 欄位改成 `grok-imagine-image-2.0`，程式碼改動量很小，沒有理由拖到自動轉址生效

## 時效提醒

⚠️ **停用日期**：2026-11-02。`grok-imagine-image-quality` 之後仍可呼叫但會被靜默轉址到 `grok-imagine-image-2.0`（quality: low）。遷移指南：[grok-imagine-image-quality Retirement on November 2, 2026](https://docs.x.ai/developers/migration/imagine-image-quality-nov-2)。

## 今日收穫

多數定價追蹤只看「漲價還是降價」，但這次 xAI 的改動提醒了一件更隱蔽的事：退役公告裡的「自動轉址」不等於「無痛升級」——轉址的預設選擇權在廠商手上，而廠商預設給的不一定是對使用者最有利的那一檔。同一個新模型、同一個價格，主動遷移的人和被動等轉址的人，拿到的服務品質可以完全不同。看到「退役並自動轉址」的公告時，該問的不是「價格變了多少」，而是「轉址之後預設套用了什麼參數，那個預設對我划算嗎」。

## 參考資料

- [xAI：grok-imagine-image-quality Retirement on November 2, 2026](https://docs.x.ai/developers/migration/imagine-image-quality-nov-2)
- [xAI：API Pricing](https://docs.x.ai/developers/pricing)
- [AI Pricing Guru：Grok Imagine Image Quality Retirement: Cost Impact](https://www.aipricing.guru/news/grok-imagine-image-quality-retirement-cost-impact)
