---
title: "AI 日報 — 2026-10-01"
date: 2026-10-01
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "OpenAI 用私募資金卡位提前反超 Anthropic 估值，DeepSeek 把訓練工具鏈原封不動搬上華為晶片——資本與晶片兩條護城河今天同時出現裂縫"
tldr: "OpenAI 洽談至少 300 億美元過渡輪，估值目標約 1.4 兆美元、反超 Anthropic 最近一輪私募估值，8 月營收年化已達 400 億美元；Anthropic IPO 招股資料外流，顯示上半年營運費用達 73.3 億美元，上市時程恐延至 11 月期中選舉後；DeepSeek 9/30 把 TileLang、DeepGEMM、DeepEP、FlashMLA 等訓練核心工具鏈開源移植到華為 Ascend 平台，與既有 Nvidia 版本一一對應；今日無 Stage 1 Arxiv／GitHub Digest 產出"
draft: false
series:
  name: "AI 日報"
  order: 47
---

> 🌏 [English version](/posts/daily/2026-10-01-ai-agent-daily-en)

## 一句話判斷

**OpenAI 搶在 Anthropic 掛牌前用私募資金把估值衝回 1.4 兆美元，DeepSeek 同一週把原本綁死 Nvidia 的訓練工具鏈原封不動搬上華為晶片——資本層的領先賽和晶片層的替代選項，正在同時鬆動兩大巨頭各自最深的護城河。**

## 深度分析：兩條護城河同時被鬆動

我認為今天兩則看似不相關的新聞，其實都在講同一件事：巨頭賴以維持領先的鎖定機制，正在被對手主動攻破。

證據 A（同業競爭）：彭博報導 OpenAI 正在洽談至少 300 億美元的過渡輪，估值目標約 1.4 兆美元，較今年 3 月重新定價上漲 64%，足以反超 Anthropic 最近一輪私募估值；報導同時指出 OpenAI 8 月營收年化已衝到 400 億美元，較 7 月成長 70%。這筆錢的時機耐人尋味——就在路透取得的 Anthropic IPO 招股資料外流，顯示其上半年營運費用高達 73.3 億美元，上市時程很可能因原定的 11 月期中選舉而延後之際，OpenAI 選在對手還沒掛牌比對公開財報之前，先用私募資金把「誰是估值龍頭」的敘事定錨下來。

證據 B（供應商議價力）：DeepSeek 9/30 把訓練 V4 系列模型用的核心工具鏈——TileLang、DeepGEMM、DeepEP、FlashMLA——開源到華為 Ascend 平台，且每個元件都與先前開源的 Nvidia 版本一一對應，開發者不用重寫程式邏輯就能換硬體後端，雙方並透露正在合作開發以 Ascend 950 晶片組成的 128 卡超節點方案。過去中國模型團隊被綁在 Nvidia，不完全是晶片效能問題，更多是 CUDA 生態轉換成本太高；DeepSeek 現在主動把這個轉換成本攤平。

對從業者的意義：如果你的產品規劃仰賴「某家晶片廠或某家模型廠會持續保持定價／效能優勢」，這兩件事都值得拿來重新檢查假設——晶片層的替代選項正在變得可行，模型層的資本軍備競賽也可能反映到更激進的企業採購折扣。對台灣建構者而言，更實際的含意落在採購策略上：評估 AI 基礎設施合約時，「是否只綁一家供應商」現在值得單獨拉出來當風險項，而不是預設 Nvidia／OpenAI／Anthropic 的現有地位會一直維持下去。

## 今日動態

### 廠商動態

**OpenAI**：洽談至少 300 億美元過渡輪，估值目標約 1.4 兆美元，作為原訂 IPO 延後後的橋接資金；彭博報導其 8 月營收年化已達 400 億美元，較 7 月成長 70%。（[來源](https://www.bloomberg.com/news/articles/2026-09-29/openai-targets-30-billion-in-new-funding-at-1-4-trillion-value)）

**Anthropic**：路透取得的 IPO 招股資料顯示，公司上半年營運費用達 73.3 億美元，上市時程可能因原定 11 月期中選舉而延後；9/28 發表 Claude Sonnet 5.5 補完 5.5 系列產品線（Claude Opus 5.5 已於 9/22 推出）。（[來源](https://www.cnbc.com/2026/09/28/anthropics-ipo-prospectus-shows-sweeping-ai-vision-surging-costs-reuters.html)）

### 模型與基礎設施

**DeepSeek 開源 Ascend 完整工具鏈**：9/30 把 TileLang、DeepGEMM、DeepEP、FlashMLA 等訓練核心套件移植到華為 Ascend 平台，每個元件與既有 Nvidia 版本一一對應；雙方並透露正在開發以 Ascend 950 晶片組成的 128 卡超節點方案。細節見上方「深度分析」。（[來源](https://pandaily.com/deepseek-ascend-infra-oss-tilelang-deepgemm-deepep-superpod-flex)）

### 商業案例 / 融資 / 併購

**OpenAI 過渡輪**：詳見上方「廠商動態」，若成局將把 OpenAI 私募估值重新推回業界之首，早於雙方任何一家正式掛牌前完成。（[來源](https://www.bloomberg.com/news/articles/2026-09-29/openai-targets-30-billion-in-new-funding-at-1-4-trillion-value)）

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| OpenAI 目標過渡輪規模 | ≥300 億美元 | [Bloomberg](https://www.bloomberg.com/news/articles/2026-09-29/openai-targets-30-billion-in-new-funding-at-1-4-trillion-value) |
| OpenAI 目標估值 | 約 1.4 兆美元（較 3 月漲 64%） | [Bloomberg](https://www.bloomberg.com/news/articles/2026-09-29/openai-targets-30-billion-in-new-funding-at-1-4-trillion-value) |
| OpenAI 8 月營收年化 | 400 億美元（較 7 月 +70%） | [Bloomberg](https://www.bloomberg.com/news/articles/2026-09-29/openai-targets-30-billion-in-new-funding-at-1-4-trillion-value) |
| Anthropic 上半年營運費用 | 73.3 億美元 | [CNBC/Reuters](https://www.cnbc.com/2026/09/28/anthropics-ipo-prospectus-shows-sweeping-ai-vision-surging-costs-reuters.html) |

## 今日 Digest 一覽

今天 Stage 1 例行 routine（Arxiv Digest、GitHub Digest 等）尚未產出，故無文章可列。

## 明日關注

- OpenAI 300 億美元過渡輪是否正式敲定，最終估值是否真的站上 1.4 兆美元
- DeepSeek－華為 Ascend 128 卡超節點的獨立效能驗證何時出現，能否比得上同規模的 Nvidia 叢集
- Anthropic IPO 招股書細節是否有更多分析陸續流出，上市時程是否真的遞延到期中選舉後

## 今日收穫

之前以為中美 AI 供應鏈脫鉤的卡點主要在晶片產能與出口管制；今天看到 DeepSeek 把整套訓練工具鏈原封不動搬上 Ascend，才意識到真正卡住替代路徑的其實是軟體生態的轉換成本——一旦這個成本被主動攤平，晶片產能反而變成相對好解決的問題。這對台灣半導體供應鏈的意義是：純粹的製程／產能優勢可能不足以維持長期議價力，軟體生態綁定能力也要一併列入評估。

## 參考資料

- [OpenAI Targets $30 Billion in Funding at $1.4 Trillion Value — Bloomberg](https://www.bloomberg.com/news/articles/2026-09-29/openai-targets-30-billion-in-new-funding-at-1-4-trillion-value)
- [Anthropic's IPO prospectus shows sweeping AI vision, surging costs — CNBC/Reuters](https://www.cnbc.com/2026/09/28/anthropics-ipo-prospectus-shows-sweeping-ai-vision-surging-costs-reuters.html)
- [Anthropic rolls out second Claude 5.5 model as it builds toward IPO — Reuters](https://www.reuters.com/technology/anthropic-rolls-out-second-claude-55-model-it-builds-toward-ipo-2026-09-28/)
- [DeepSeek Open-Sources Ascend Versions of TileLang, DeepGEMM and More — Pandaily](https://pandaily.com/deepseek-ascend-infra-oss-tilelang-deepgemm-deepep-superpod-flex)
- [DeepSeek and Huawei release TileLang for Ascend chips, taking aim at CUDA](https://pasqualepillitteri.it/en/news/19580/tilelang-deepseek-huawei-ascend-cuda)
