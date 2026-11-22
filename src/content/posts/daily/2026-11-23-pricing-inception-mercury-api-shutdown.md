---
title: "定價追蹤｜Inception 的 Mercury API 將於 12/28 關閉，疑似因 NVIDIA 併購案"
date: 2026-11-23
category: daily
type: digest
tags: [ai-agent, pricing, daily, nvidia]
lang: zh-TW
description: "Inception 官方文件確認 Mercury API（Mercury 3／Mercury Voice／Mercury Decide）將於 2026-12-28 停止服務，時間點緊接著 The Information 報導的 NVIDIA 逾 5 億美元併購案"
tldr: "Inception 官方 wind-down 頁面寫明 Mercury API（api.inceptionlabs.ai）2026-12-28 後停止服務、資料無法再存取，沒有官方替代方案。同一週 The Information 報導 NVIDIA 正洽談以逾 5 億美元併購 Inception，兩邊都未證實，但時間點高度重疊。"
series:
  name: "AI Pricing Watch"
  order: 39
---

> :globe: [English version](/posts/daily/2026-11-23-pricing-inception-mercury-api-shutdown-en)

## 變更摘要

Diffusion LLM 新創 Inception 在官方文件裡悄悄掛上一條 wind-down 公告：Mercury API（涵蓋 Mercury 3、Mercury Voice、Mercury Decide 三個產品）將於 2026 年 12 月 28 日之後停止服務，過了那天連先前送出的資料都拿不回來。公告本身沒解釋原因，但同一週 *The Information* 報導 NVIDIA 正在洽談以逾 5 億美元併購 Inception——兩家公司都沒證實這筆交易，但「併購傳聞」和「API 關閉公告」在同一週出現，已經足夠讓現有客戶把遷移排進行程表。這不是降價或促銷到期，是一次沒有官方替代方案的 API sunset，而且留給客戶的視窗只有約一個月。

## 前後對照

| 項目 | 現狀 | 12/28 後 | 變化 | 生效日 |
|---|---|---|---|---|
| Mercury API（api.inceptionlabs.ai） | 正常服務 | 停止接受請求 | 服務終止 | 2026-12-28 |
| Inception Platform 後台 | 可存取 | 無法存取 | 服務終止 | 2026-12-28 |
| 已上傳資料／請求紀錄 | 可查詢 | 無法存取（官方未說是否刪除） | 資料不可及 | 2026-12-28 |
| 帳單／發票紀錄 | 可在後台下載 | 需提前自行下載 | 需主動備份 | 2026-12-28 前 |

官方 wind-down 頁面原句：「After this date you will no longer have access to the service or to any data submitted to the platform.」沒有提到退款，也沒有說明資料截止後是否刪除或繼續保留但不給存取——這兩件事都是遷移時容易忽略的風險點。

## 成本試算

這次事件沒有新舊費率可比——重點不是「貴了多少」，是「遷移窗口夠不夠」。用一個具體場景換算時間壓力：

**場景**：一個每天呼叫 Mercury 3 處理 20,000 次請求的 Agent，今天（11/23）才知道這則公告。

| | 剩餘天數 | 建議動作 |
|---|---|---|
| 到服務終止（12/28） | 35 天 | 硬性上限 |
| 建議完成切換（抓安全邊界，公告本身未給） | 約 12/14 前 | 留 2 週觀察新供應商延遲與錯誤率 |
| 備份帳單／請求紀錄 | 立即 | 後台下載功能隨服務一起關閉 |

35 天聽起來足夠，但 diffusion LLM 的推論行為（平行去噪、延遲曲線）跟一般自回歸 LLM 不同，換到 Groq、Cerebras 或透過 OpenRouter／自架 LiteLLM proxy 做 A/B 測試，都需要重新量延遲與輸出品質，不是單純換一個 base URL。

## 對開發者/企業的影響

### 誰最受益

目前還在評估要不要導入 diffusion LLM 的團隊——這次事件等於提前看到一個訊號：當整個 diffusion LLM 賽道還只有少數玩家（Inception 是其中最早商業化的一個）時,平台方自己的存續風險比模型效能風險更需要列入選型考量。

### 競爭格局影響

Mercury API 關閉後，diffusion LLM 這個細分賽道的獨立 API 供應商又少了一家。對比生態：

| 定位 | 現況 |
|---|---|
| Inception（Mercury） | API 2026-12-28 關閉，疑似併入 NVIDIA |
| Google（Gemini Decide 系列） | 官方決策型模型，公告指南裡被列為 Mercury Decide 最接近的替代 |
| Groq／Cerebras | 快速推論供應商，非 diffusion 架構，但可做延遲層替代測試 |

這次事件沒有直接的「同賽道替代」——官方 wind-down 公告本身也沒指定替代模型，只在社群討論裡被拿來跟 Gemini Decide 比較決策類工作負載，這點值得留意：跟上週 Gemini 4 Argon 促銷到期（官方明確列出新舊價格）比，Inception 這次連「接替模型」都沒有，遷移成本結構完全不同。

### 行動建議

- 如果你在生產環境呼叫 `api.inceptionlabs.ai`：現在就去後台把請求紀錄、帳單、發票全部下載下來，公告寫的是「12/28 後拿不到」，不是「12/28 後可以晚點拿」
- 如果你用 Mercury Decide 做決策類工作：先用自己的資料跑一輪 Gemini Decide 系列的評測，不要等到 12 月中才開始找替代方案
- 如果你只是技術評估、還沒上生產：這次事件可以當成一個案例——選型 diffusion LLM 供應商時，把「公司存續／併購風險」和「模型品質」放在同一張評估表上

## 時效提醒（如有促銷/sunset）

:warning: **停用日期**：2026-12-28。Mercury API（Mercury 3／Mercury Voice／Mercury Decide）與 Inception Platform 後台將同時停止服務，過期後無法存取任何已提交的資料。遷移前請先在後台下載請求紀錄與帳單歷史。官方 wind-down 說明：[docs.inceptionlabs.ai/support/wind-down](https://docs.inceptionlabs.ai/support/wind-down.md)。

```diagram
title: Mercury API 關閉時間軸
desc: 從 NVIDIA 併購傳聞曝光（11/19）到 Mercury API 正式停止服務（12/28）只隔 39 天，扣掉本篇報導發布的 11/23，實際遷移窗口只剩約 35 天。
caption: 比例尺：1 天 ≈ 9.2px，起點 2026-11-19。12/14 是本文建議的安全遷移邊界，不是官方公告日期——官方 wind-down 頁面只給了 12/28 這一個日期。
---
<svg viewBox="0 0 640 280">
  <path class="dg-axis" d="M40 124H560"/>
  <path class="dg-axis" d="M140 124V130M232 124V130M325 124V130M417 124V130"/>
  <text class="dg-small" x="140" y="146" text-anchor="middle" dominant-baseline="central">11/19</text>
  <text class="dg-small" x="232" y="146" text-anchor="middle" dominant-baseline="central">11/29</text>
  <text class="dg-small" x="325" y="146" text-anchor="middle" dominant-baseline="central">12/9</text>
  <text class="dg-small" x="417" y="146" text-anchor="middle" dominant-baseline="central">12/19</text>

  <rect class="dg-band dg-band--warn" x="177" y="236" width="323" height="24"/>
  <text class="dg-small dg-text--warn" x="339" y="248" text-anchor="middle" dominant-baseline="central">遷移窗口：約 35 天（11/23 起算）</text>

  <g>
    <line class="dg-rule" x1="140" y1="76" x2="140" y2="118"/>
    <circle class="dg-dot" cx="140" cy="124" r="4"/>
    <text class="dg-label" x="140" y="40" text-anchor="middle" dominant-baseline="central">11/19 併購傳聞</text>
    <text class="dg-sub" x="140" y="62" text-anchor="middle" dominant-baseline="central">The Information 報導 NVIDIA 洽談中</text>
  </g>
  <g>
    <line class="dg-rule" x1="371" y1="130" x2="371" y2="172"/>
    <circle class="dg-dot" cx="371" cy="124" r="4"/>
    <text class="dg-label" x="371" y="186" text-anchor="middle" dominant-baseline="central">12/14 建議邊界</text>
    <text class="dg-sub" x="371" y="208" text-anchor="middle" dominant-baseline="central">留 2 週觀察新供應商（非官方日期）</text>
  </g>
  <g>
    <line class="dg-rule" x1="500" y1="76" x2="500" y2="118"/>
    <circle class="dg-dot dg-dot--accent" cx="500" cy="124" r="6"/>
    <text class="dg-label" x="500" y="40" text-anchor="middle" dominant-baseline="central">12/28 服務終止</text>
    <text class="dg-sub" x="500" y="62" text-anchor="middle" dominant-baseline="central">API 與後台資料都無法存取</text>
  </g>
</svg>
```

## 今日收穫

定價追蹤通常在抓「漲了多少、降了多少」，但這次最值得記的訊號不是價格，是「公告裡沒有接替模型」這件事本身——官方願意寫清楚新舊費率（像 Gemini 4 Argon 的促銷到期公告），代表這家公司打算繼續在這個市場上跟你收錢；只給一個關閉日期、不給替代方案，通常意味著平台方自己也在往別的方向走（這次疑似是被併購），遷移規劃要抓的不是「省多少錢」，是「還剩多少時間」。

## 參考資料

- [Inception: Mercury API wind-down notice（官方文件，服務終止日期與資料存取說明）](https://docs.inceptionlabs.ai/support/wind-down.md)
- [NVIDIA in talks to acquire AI developer Inception amid Mercury API wind-down（整理 The Information 報導的併購傳聞與公告時間點）](https://beri.net/article/nvidia-inception-acquisition-500-million-mercury-api-wind-down-december-28-diffusion-llm-migration)
- [本系列 10/17：Google 補上 Gemini 4 Argon 促銷到期日](/posts/daily/2026-10-17-pricing-google-gemini-argon-flash-promo-deadline)
