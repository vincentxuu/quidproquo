---
title: "模型卡｜DeepSeek-V4-Flash-Vision-Exp"
date: 2026-09-01
category: daily
tags: [ai-agent, model-release, daily, deepseek, model-family-deepseek]
lang: zh-TW
description: "DeepSeek 為 V4-Flash 系列首次裝上「眼睛」——同一套 MoE 骨幹加視覺模組，文字 agent 分數不降反升，多模態 agent 表現逼近 Claude Opus 4.8，定價卻與純文字版完全相同"
tldr: "DeepSeek-V4-Flash-Vision-Exp：284B 總參數／13B 啟用參數 MoE，1M context、384K 最大輸出；定價與 V4-Flash 完全一致（Input $0.44／Output $1.32，尖峰；離峰對半）；文字 agent benchmark 7 項中贏 6 項（DeepSeek 甚至以 59.3 分超越 Opus-4.8 的 58.0）；多模態 agent 貼近 Opus-4.8（ApexBench 落後 2.9 分、ZeroBench 反超）；每張圖片壓縮到最多 384 tokens、約 800×800 解析度上限，代價是細節辨識力"
series:
  name: "AI Model Tracker"
  order: 11
glossary:
  - term: "DeepSeek V4"
    def: "DeepSeek 開發的旗艦大型語言模型家族，分 Flash（輕量）與 Pro（旗艦）兩線，2026 年起加入實驗性多模態分支"
---

> 🌏 [English version](/en/posts/daily/2026-09-01-model-deepseek-deepseek-v4-flash-vision-exp-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `deepseek-v4-flash-vision-exp`（API 呼叫用；HuggingFace 倉庫為 `deepseek-ai/DeepSeek-V4-Flash-Vision-Exp`） |
| 廠商 | DeepSeek |
| 參數量 | 284B 總參數／13B 啟用參數（稀疏 MoE，架構與 DeepSeek-V4-Flash-0731 相同，只是加了視覺模組並繼續訓練） |
| Context Window | 1,000,000 tokens（最大輸出 384K tokens） |
| Input 定價 (USD/1M tokens) | $0.44（尖峰，cache miss）／$0.22（離峰，cache miss）；cache hit 再降到 $0.014／$0.007 |
| Output 定價 (USD/1M tokens) | $1.32（尖峰）／$0.66（離峰） |
| 開源 | 是（MIT License，權重與參考推論程式碼公開於 HuggingFace） |
| 發布日 | 2026-08-21（API 上線公告） |
| 官方公告 | [DeepSeek-V4-Flash-Vision-Exp Release: Multimodal API Now Live](https://api-docs.deepseek.com/news/news260821/) |
| HuggingFace | [deepseek-ai/DeepSeek-V4-Flash-Vision-Exp](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-Vision-Exp) |
| 家族 | DeepSeek V4.x（V4-Flash 分支首個多模態實驗版） |

## 能力亮點

- 文字 agent 能力不降反升：7 項文字 agent benchmark 中贏過純文字版 V4-Flash-0731 六項，DeepSeek 自己的 harness 測出 DeepSeek（程式碼修復類任務）59.3 分，甚至超過 Claude Opus 4.8 的 58.0 分
- 多模態 agent 表現逼近 Opus-4.8：ApexBench（Pass@1）36.5 分，只落後 Opus-4.8 的 39.4 分 2.9 分；ZeroBench（Pass@5）35.0 分反而領先 Opus-4.8 的 34.0 分
- 圖片幾乎零成本：每張圖片最多換算 384 tokens，以離峰價 $0.22/1M 計算，一張圖大約 $0.00008，社群估算「一美元可以看 2,500 張圖」
- API 相容性零門檻：沿用 V4-Flash 既有的 Chat Completions／Anthropic Messages／Responses 三種介面，把 model 字串換成 `deepseek-v4-flash-vision-exp` 即可，同日發布的 DeepSeek Harness 0.1.1 已內建支援

## Benchmark 表現

| Benchmark | Vision-Exp | V4-Flash-0731（純文字前代） | Opus-4.8（競品最強） |
|---|---|---|---|
| Terminal Bench 2.1 | 83.9 | 82.7 | 85.0 |
| DeepSWE | 59.3 | 54.4 | 58.0 |
| Toolathlon-Verified | 75.9 | 70.3 | 76.2 |
| ApexBench (Pass@1，多模態) | 36.5 | 26.2† | 39.4 |
| Agents' Last Exam（多模態） | 27.3 | 25.2† | 25.7 |
| ZeroBench (Pass@5，多模態) | 35.0 | – | 34.0 |

⚠️ 以上皆為 DeepSeek 官方以自家 DeepSeek Harness（Minimal Mode，`temperature=1.0`、`top_p=0.95`）自測，屬發布當日數據，尚無獨立第三方複現。標 † 的兩項中，V4-Flash-0731 是純文字模型，測試時直接忽略題目裡的多模態元素，因此該欄分數僅供參考，不是「同一起跑點」的比較。

## 與前代/競品比較

跟被 fork 出來的 V4-Flash-0731 比，Vision-Exp 最反直覺的地方不是「多了視覺」，而是文字能力也變好了——DeepSWE 進步 4.9 分、Toolathlon-Verified 進步 5.6 分，DeepSeek 官方公告只用「維持相當」帶過，但實際數字顯示這是一次連帶的文字能力升級，不只是掛上視覺編碼器。多模態這邊，扣掉 V4-Flash-0731「看不懂圖」造成的虛高對比後，跟 Opus-4.8 的差距其實不大：ApexBench 落後 2.9 分、Chartography 落後 0.7 分，但 Agents' Last Exam 與 ZeroBench 兩項反而領先。

定價策略是這次最激進的部分：Vision-Exp 完全比照 V4-Flash 既有價格表，沒有為視覺能力加價一分錢。相較之下 Claude 系列與 GPT 系列的視覺輸入通常會疊加圖片 token 成本，DeepSeek 直接把圖片壓到 384 token 上限，用「解析度」換「幾乎免費」。

## 對 Agent 開發的意義

Vision-Exp 的定位很清楚：這不是給人看圖聊天用的通用視覺模型，是為「跑螢幕、跑程式碼」的 agent 場景設計的。OpenRouter 上線頭三天的流量顯示，最大宗使用者是 Claude Code、`pi` 等 coding harness，幾乎沒有人拿它當純聊天模型用——這跟文字 agent benchmark 全面提升的方向完全吻合。

- 如果你在做 coding agent 或 CLI agent：文字 agent benchmark 六項中贏過前代，換句話說即使完全不餵圖片，把 model 字串換成 Vision-Exp 都可能是純益處的升級；DeepSWE 分數甚至壓過 Opus-4.8
- 如果你在做需要偶爾「看螢幕截圖」的 agent（例如驗證 UI 是否渲染正確、讀取簡單圖表）：384 token／約 800×800 解析度上限的成本幾乎可以忽略，適合「看個大概」的判斷型任務
- 不適合：需要讀清楚小字的場景，例如收據上的 8pt 字、密集儀表板或工程圖——800×800 的降採樣上限會直接吃掉細節；官方也標明目前不支援 FIM（fill-in-the-middle），若你的 pipeline 依賴 FIM 做行內程式碼補全，不能直接把 model 字串換過來

## 今日收穫

以為「加裝視覺能力」通常要拿文字能力去換，這篇的資料顯示不一定——DeepSeek 拿同一顆 MoE 骨幹續訓出視覺模組後，文字 agent benchmark 反而普遍提升。這提醒我評估多模態模型升級時，不能只看「多模態分數有沒有變好」，也要回頭核對純文字任務有沒有連帶受益或受損，兩者不必然同向變動。

## 參考資料

- [DeepSeek-V4-Flash-Vision-Exp Release: Multimodal API Now Live — DeepSeek API Docs](https://api-docs.deepseek.com/news/news260821/)
- [Models & Pricing — DeepSeek API Docs](https://api-docs.deepseek.com/quick_start/pricing)
- [Vision — DeepSeek API Docs](https://api-docs.deepseek.com/guides/vision)
- [HuggingFace model card: deepseek-ai/DeepSeek-V4-Flash-Vision-Exp](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-Vision-Exp)
- [DeepSeek V4 Flash Vision Exp: same price, one big catch — eesel AI](https://www.eesel.ai/blog/deepseek-v4-flash-vision-exp)
- [DeepSeek Launches Multimodal Vision Model V4-Flash-Vision-Exp — KuCoin](https://www.kucoin.com/news/flash/deepseek-launches-multimodal-vision-model-v4-flash-vision-exp)
