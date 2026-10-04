---
title: "定價追蹤｜Google 免費版 Gemini App 10/9 起只剩 Flash-Lite，Plus 失去 Pro 權限"
date: 2026-10-05
category: daily
type: digest
tags: [ai-agent, pricing, daily, google]
lang: zh-TW
description: "Google 公告 10/9 起免費版 Gemini App 個人帳號只能用 Flash-Lite，AI Plus（$7.99/月）失去 Pro model 存取權但保留 Flash，AI Pro（$19.99/月）則首次獲得原本 Ultra 專屬的 Deep Think"
tldr: "Google 10/9 起把免費版 Gemini App（個人帳號）的模型選項從「Flash-Lite／Flash／Pro（受限）」砍到只剩 Flash-Lite；AI Plus（$7.99/月）失去 Pro 存取權但保留 Flash；AI Pro（$19.99/月）與 AI Ultra 不受影響，AI Pro 還首次獲得原本 Ultra 專屬的 Deep Think。這不是 Gemini API 或 AI Studio 的定價變動，純粹是消費端 App 的用量政策緊縮。"
series:
  name: "AI Pricing Watch"
  order: 17
---

> 🌏 [English version](/en/posts/daily/2026-10-05-pricing-google-gemini-free-tier-flash-lite-only-en)

## 變更摘要

Google 公告從 2026-10-09 起收緊 Gemini App 個人帳號的模型存取權：免費版從「Flash-Lite、Flash、受限的 Pro」三個選項砍到只剩 Flash-Lite 一個；付費的 AI Plus（$7.99/月）則失去 Pro 存取權，但保留 Flash，確切生效日會個別以 email 通知，不是全員同一天切換。這不是漲價，也不是 Gemini API 的定價異動——Google 自己的公告明確限定在「個人帳號的 Gemini App」，開發端的 API、AI Studio、Workspace 都不受影響。這個動作延續的是 ChatGPT Pro 200 用量砍半同一套邏輯：免費和低價層級的護城河正在往上收，廠商把「能用哪個模型」變成跟月費一樣重要的分層變數。

## 前後對照

| 項目 | 舊 | 新 | 變化 | 生效日 |
|---|---|---|---|---|
| 免費版 Gemini App 可用模型 | Flash-Lite、Flash、Pro（受限用量） | 僅 Flash-Lite | 失去 Flash 與 Pro | 2026-10-09 |
| AI Plus（$7.99/月）可用模型 | Flash-Lite、Flash、Pro（受限用量） | Flash-Lite、Flash | 失去 Pro | 個別 email 通知，非 10/9 統一生效 |
| AI Pro（$19.99/月）可用模型與功能 | Flash-Lite、Flash、Pro；無 Deep Think | 不變，新增 Deep Think | 新增 Ultra 專屬功能 | 2026-10-09 公告同步生效 |
| AI Ultra（$99.99／$200 月）可用模型與功能 | Flash-Lite、Flash、Pro、Deep Think | 不變 | 無變化 | — |
| Gemini API／AI Studio／Vertex AI 定價與模型存取 | 不變 | 不變 | 無變化 | — |

## 成本試算

這次變動不改變任何單價，所以沒有 token 成本試算。真正的「成本」是免費與 Plus 使用者被迫升級才能維持原有工作流程的訂閱費差額：

| | 免費版（現況） | 想繼續用 Pro model 需升級到 | 月增訂閱費 |
|---|---|---|---|
| 免費使用者 | $0 | AI Pro $19.99/月 | $19.99 |
| AI Plus 使用者 | $7.99 | AI Pro $19.99/月 | $12.00 |

對一個月跑不到幾次 Pro model 的輕量使用者，這筆差額可能不值得；但對已經習慣拿免費或 Plus 額度跑複雜推理、程式碼或長文件分析的人，10/9 之後只能二選一：改用 Flash／Flash-Lite 硬頂，或是掏錢升級。

## 對開發者/企業的影響

### 誰最受益

AI Pro 訂閱戶是這次公告裡唯一單向受益的族群——月費沒變，卻拿到原本只有 Ultra（$99.99 起）才有的 Deep Think。對於偶爾需要深度推理但用量不到 Ultra 門檻的個人開發者，AI Pro 現在的性價比明顯墊高。

### 競爭格局影響

把「免費層級能不能碰旗艦模型」拉出來比較，Google 這次是主動往 OpenAI 的分層邏輯靠近：

| 廠商 | 免費層級可用的旗艦模型 | 備註 |
|---|---|---|
| **Google（10/9 起）** | 無，僅 Flash-Lite | Flash、Pro 都收回 |
| OpenAI ChatGPT Free | 無（僅限量 GPT-5 類輕量模型） | 旗艦 GPT-6 系列需付費 |
| Anthropic Claude Free | 無（僅限量存取，無指定旗艦保證） | 依流量動態調整 |
| Perplexity Free | 有限次數的旗艦模型試用 | 用量上限低 |

三大 Agent 廠商現在在免費層級上的策略趨同：旗艦模型一律收回成付費專屬，免費層級只用來體驗最便宜的小模型。這代表「免費測試旗艦模型能力」的視窗正在系統性關閉，開發者若想低成本驗證旗艦模型表現，愈來愈需要透過 API 的免費額度或促銷期，而不是消費端 App 的免費方案。

### 行動建議

- 如果你目前靠免費版 Gemini App 跑 Pro model 做複雜分析：10/9 前先確認哪些工作流程離不開 Pro，評估升級到 AI Pro（$19.99/月）是否划算，而不是臨時被切斷才反應
- 如果你是 AI Plus 訂閱戶且重度依賴 Pro model：留意 Google 的個別 email 通知日期，別等到真的被降級才發現
- 如果你是透過 Gemini API／AI Studio 開發應用：這次變動不影響你，不需要調整任何程式碼或計費邏輯，但可以預期消費端的分層邏輯未來可能往 API 端的免費額度延伸
- 如果你只是輕量使用、以 Flash 或 Flash-Lite 就能完成大部分任務：不需要採取任何行動，免費版對你幾乎無影響

## 時效提醒

⏰ **免費版模型限縮生效日**：2026-10-09。免費版 Gemini App（個人帳號）當天起只能選擇 Flash-Lite。
⏰ **AI Plus 失去 Pro 權限生效日**：因帳號而異，Google 會個別發送 email 通知確切日期，並非統一在 10/9 切換。

## 今日收穫

這次公告容易被誤讀成「Google 在漲價」，但精確地說，Google 完全沒動任何一個數字——$0、$7.99、$19.99 全部不變，變的只是「同樣的錢能用哪個模型」。對比 OpenAI 用砍用量上限（Pro 200 從 20x 砍到 10x）、Google 用砍模型選項，兩家殊途同歸：當推理成本持續下降、廠商不再需要靠漲價維持毛利時，用量與存取權限反而成了比牌價更敏感的槓桿。追蹤 AI 定價只看 input/output 單價已經不夠，免費與低價層級「能碰到哪個模型」正在變成同等重要、卻更難被量化比較的變數。

## 參考資料

- [XenoSpectrum：Gemini Cuts Pro Model Access for Free and AI Plus Users, While AI Pro Gains Deep Think](https://xenospectrum.com/en/gemini-october-model-access-limits)
- [Superpower Daily：Google Cuts Gemini Model Access for Free Users and AI Plus Subscribers](https://superpowerdaily.com/posts/google-cuts-gemini-model-access-for-free-users-and-ai-plus-subscribers)
- [Yahoo Tech：Google is changing which models you can access on its Gemini AI plans](https://tech.yahoo.com/ai/gemini/articles/google-changing-models-access-gemini-133000810.html)
- [Google：Google AI subscription updates from Google I/O 2026](https://blog.google/products-and-platforms/products/google-one/google-ai-subscriptions)
