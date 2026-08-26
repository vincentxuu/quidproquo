---
title: "定價追蹤｜Google 不砍價，改砍帳單結構：Gemini Enterprise 推出承諾折扣與離峰費率"
date: 2026-08-27
category: daily
tags: [ai-agent, pricing, daily, google]
lang: zh-TW
description: "Google Cloud 8/26 為 Gemini Enterprise 推出 Flexible Savings Plans（1 年期折 10%、3 年期折 20%）、新的 pay-as-you-go 方案，以及即將上線的離峰批次最高 5 折——不是調降標價，是重新設計帳單結構來對抗 AI 帳單震撼"
tldr: "Google Cloud 為 Gemini Enterprise 新增 Flexible Savings Plans（月支出承諾制，1 年期折 10%、3 年期折 20%，無上下限）、新的 pay-as-you-go 消費方案，以及即將推出的離峰批次處理（最高省 50% inference 成本），2026-08-26 生效。這不是像 OpenAI GPT-5.6 Sol 那樣調降標價，而是新增一整套帳單結構工具——對比 OpenAI 打的是標價戰，Google 打的是 FinOps 治理戰。"
series:
  name: "AI Pricing Watch"
  order: 5
---

> 🌏 [English version](/en/posts/daily/2026-08-27-pricing-google-gemini-enterprise-flexible-billing-en)

## 變更摘要

上週我們才記錄過 OpenAI 對 GPT-5.6 Sol 動手術式砍價（input ↓20%、output ↓33%），這週輪到 Google 出招——但打法完全不同。Google Cloud 8/26 官方部落格宣布為 Gemini Enterprise 全線導入新的帳單彈性：月支出承諾制的 Flexible Savings Plans（1 年期折 10%、3 年期折 20%）、新的 pay-as-you-go 消費方案取代純 per-seat 訂閱、以及即將上線的離峰批次處理（最高省一半 inference 成本）。標價本身一分未動——Google 沒有跟進 OpenAI 的降價戰，而是把戰場轉移到「帳單怎麼算」，這是更接近傳統雲端廠商（AWS Savings Plans、GCP CUD）的打法，賭的是企業真正在意的是可預測的月度支出，而不是牌價數字。

## 前後對照

| 項目 | 舊制 | 新制 | 變化 | 生效日 |
|---|---|---|---|---|
| Gemini Enterprise app 付費模式 | 僅有 per-seat 月費訂閱（固定配額，用不完浪費） | 新增 pay-as-you-go 消費制，無底薪、按標準 API 費率計量 | 新增選項 | 2026-08-26（部分客戶先開放，逐步擴大） |
| 長期用量折扣 | 無 spend-based 承諾方案 | Flexible Savings Plans：1 年期折 10%、3 年期折 20%（月支出承諾制，無上下限） | 新增 | 2026-08-26（已開放自助購買） |
| 離峰／批次處理費率 | 無 | 可延後執行的任務改到離峰時段跑，最高省 50% inference 成本 | 新增 | 即將推出（官方未給精確日期） |
| 專案支出上限與告警 | 需自行監控 | Cloud Billing 主控台可直接設定月度硬上限，達 50%/80%/100% 自動 email 告警 | 強化 | 2026-08-26 |

## 成本試算

**場景**：一個 Gemini Enterprise 月支出穩定在 $10,000 的企業團隊（涵蓋 Gemini Enterprise app、Agent Platform、Antigravity 用量）。

| | 現行（無承諾） | FSP 1 年期（↓10%） | FSP 3 年期（↓20%） |
|---|---|---|---|
| 月支出 | $10,000 | $9,000 | $8,000 |
| 年支出 | $120,000 | $108,000 | $96,000 |
| 年省 | — | $12,000 | $24,000 |

**另一個場景**：其中 $3,000/月屬於可延後執行的批次任務（如離線資料處理、非即時 agent 跑批）。若離峰折扣上線後全數改到離峰時段執行，這部分成本可再降到約 $1,500/月，疊加 FSP 後，3 年期承諾下的總月支出可壓到約 $6,500，相當於原始 $10,000 的 35% 折扣。

## 對開發者/企業的影響

### 誰最受益

用量穩定或持續成長、已經在多團隊間共用 Gemini Enterprise 配額的企業——這正是 FSP「無上下限、月支出承諾」設計要抓的對象。另一群受益者是有大量可延後執行工作負載的團隊（批次資料處理、離線 agent 任務、非即時的程式碼審查跑批），離峰折扣專門針對這類「能忍受較長回應時間」的用量設計。相對地，用量波動大、還在評估階段的團隊反而不適合現在就簽 FSP——條款明確寫「購買後不可取消或修改」，未達成的承諾額度仍要付全額月費。

### 競爭格局影響

Axios 報導點出一個關鍵對比：Anthropic 目前提供的是「設定月度支出上限、達標即暫停」這類防禦性工具，OpenAI 則是走激進降價路線（近期對 GPT-5.6 Sol 砍價 20-33%）。Google 這次的動作是第三條路——不碰標價，改賣「用得多就打折」的承諾制折扣，外加離峰時段套利。這更像是把 AWS/GCP 傳統雲端運算的 Savings Plans 邏輯直接搬進 AI token 計費，賭的假設是：企業 FinOps 團隊要的不是牌價戰勝出者，而是誰能把 AI 支出納入既有的雲端預算治理框架。目前三大廠各打一張不同的牌：OpenAI 打價格、Anthropic 打防禦性額度控管、Google 打承諾制折扣與治理工具，還沒有人同時把三張牌都打出來。

### 行動建議

- 如果你的 Gemini Enterprise 月支出已經連續數月穩定或持續成長：evaluate 3 年期 FSP 前，先用官方新推出的 Google Cloud Pricing Calculator 抓歷史用量分布，再決定承諾金額——記住 FSP 不可取消，額度用不完當月不能延到下月。
- 如果你的工作負載有相當比例是可延後執行的批次任務：先別急著簽長期承諾，等離峰折扣正式上線（官方只說「即將推出」）再重新算一次總成本，離峰折扣可能讓你的實際承諾額度需求下修。
- 如果你正在多個廠商間比較 TCO：不要只比較牌價（GPT-5.6 Sol 的 $4/$20 vs. Gemini 模型的費率），FSP 和離峰折扣會讓 Google 的實際到手價比牌價低 20-50%，需要用你自己的用量模式重新試算，牌價比較在這個階段已經不夠用。

## 今日收穫

OpenAI 和 Google 這兩週對「企業覺得 AI 太貴」給出了兩種完全不同的答案：OpenAI 選擇降低商品本身的單價（token 牌價戰），Google 選擇重新設計購買商品的方式（承諾制折扣、離峰套利、支出治理工具）。這不是巧合,而是兩種商業模式基因的直接反映——OpenAI 主要靠 API 直接銷售 token，價格是最直接的競爭槓桿；Google 本業是雲端運算，早就有一整套 Savings Plans／CUD 的定價工程可以複用,對它來說「賣治理工具」比「打價格戰」更符合既有優勢。對追蹤定價的人來說,這代表未來看到「降價」新聞時要分兩種讀法：一種是牌價真的變便宜(比較容易量化),另一種是購買方式變便宜(需要自己套用用量模式才看得出實際省了多少)——後者更難比較,但可能才是雲端廠商真正想競爭的戰場。

## 參考資料

- [FinOps for the AI era: New flexible billing and cost controls for agents — Google Cloud Blog](https://cloud.google.com/blog/products/ai-machine-learning/flexible-billing-and-cost-controls-for-agents-on-google-cloud)
- [Flexible Savings Plans | Google Cloud Documentation](https://docs.cloud.google.com/docs/cuds-flexible-savings-plans)
- [Exclusive: Google targets AI sticker shock with suite of new tools — Axios](https://www.axios.com/2026/08/26/exclusive-google-targets-ai-sticker-shock-with-new-tools)
- [Google rolls out flexible billing, cost controls for AI agents — CIO Dive](https://www.ciodive.com/news/google-rolls-out-flexible-billing-cost-controls-ai/828832/)
