---
title: "模型卡｜Gemini Omni 1.1 Flash"
date: 2026-09-02
category: daily
tags: [ai-agent, model-release, daily, google, model-family-gemini]
lang: zh-TW
description: "Google 將 Gemini Omni Flash 從 preview 轉正為 gemini-omni-1.1-flash——scene extension 從只讀最後 1 秒延伸到 10 秒、新增 first/last frame 控鏡，4K 輸出以 upscale 方式提供，定價按解析度分層（360p $0.03～4K $0.30／秒）"
tldr: "Gemini Omni 1.1 Flash（gemini-omni-1.1-flash）：2026-08-27 正式 GA，取代 6/30 上線的 preview；閉源，按輸出秒數計費：360p $0.03、720p $0.10（預設）、1080p $0.15、4K $0.30（皆為 upscale）；Artificial Analysis Text-to-Video Arena 無音訊榜第一（1322 Elo），含音訊榜第二（1237，落後 Wan3.0 的 1241）；新增 scene extension（10 秒上下文、累積可延伸到 40 秒）與 first/last frame interpolation 控鏡"
series:
  name: "AI Model Tracker"
  order: 12
glossary:
  - term: "Gemini Omni"
    def: "Google DeepMind 的原生多模態影片生成／編輯模型家族，可同時處理文字、圖片、音訊、影片輸入輸出"
---

> 🌏 [English version](/en/posts/daily/2026-09-02-model-google-gemini-omni-1-1-flash-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `gemini-omni-1.1-flash` |
| 廠商 | Google（Google DeepMind） |
| 參數量 | 未公開 |
| Context Window | 非傳統文字模型，無 context window 概念；單次生成 4～10 秒影片（24fps），可用 `previous_interaction_id` 做對話式延伸，累積最長 40 秒（10 秒一段，最多 4 段） |
| Input 定價 (USD/1M tokens) | 不適用（依輸出秒數計費，見下方）；文字／thinking prompt 部分為 $1.50（Standard tier） |
| Output 定價 (USD/1M tokens) | 換算自影片輸出 $17.50／1M tokens：360p $0.03／秒、720p $0.10／秒（預設原生解析度）、1080p $0.15／秒（upscale）、4K $0.30／秒（upscale） |
| 開源 | 否 |
| 發布日 | 2026-08-27（GA 正式版；取代 2026-06-30 上線的 `gemini-omni-flash-preview`，該 preview 端點將於 2026-09-30 退役） |
| 官方公告 | [Google Blog：Gemini Omni 1.1 Flash lets you build with more control](https://blog.google/innovation-and-ai/technology/developers-tools/build-with-gemini-omni-1-1-flash) |
| HuggingFace | 無（閉源，僅透過 Gemini API／AI Studio／Enterprise Agent Platform 提供） |
| 家族 | Gemini Omni（前代為 2026-06-30 發布的 Gemini Omni Flash Preview） |

## 能力亮點

- Scene extension 從前代「只讀最後 1 秒」躍進到分析前 10 秒上下文，視覺一致性明顯提升，且可 10 秒一段累積延伸到最長 40 秒
- 新增 first/last frame interpolation：指定起訖兩張關鍵幀，模型生成中間的連續運鏡，可用於運鏡環繞、變焦轉場、無縫循環
- 360p draft 模式比標準 720p 快up to 60%、成本只要三分之一，適合先低成本迭代再放大輸出
- 在 Artificial Analysis Text-to-Video Arena「無音訊」榜單排名第一（Elo 1322），領先第二名 MiniMax H3（1302）

## Benchmark 表現

| Benchmark | Gemini Omni 1.1 Flash | 前代（Omni Flash Preview） | 競品最強 |
|---|---|---|---|
| AA Text-to-Video Arena（無音訊，Elo） | 1322（第 1 名） | 未曾單獨列入官方榜單分數 | MiniMax H3 1302（第 2） |
| AA Text-to-Video Arena（含音訊，Elo） | 1237（第 2 名） | — | Wan3.0 1241（第 1） |
| AA Image-to-Video Arena（含音訊，Elo） | 約 1203（第 1 名） | — | Dreamina Seedance 2.0 720p 約 1197（第 2） |
| 單次累積延伸長度 | 最長 40 秒（10 秒 ×4） | 官方文件未列累積上限，僅讀取最後 1 秒作延伸依據 | Wan3.0 單次 30 秒（無多輪延伸串接機制） |
| 最高輸出解析度 | 4K（upscale） | 僅 720p，無 1080p／4K 選項 | Veo 3.1 Fast 4K，同為 $0.30／秒 |

⚠️ Arena Elo 為 Artificial Analysis 盲測排行榜即時分數（擷取於 2026 年 8 月底），每週會因新一輪投票變動，非廠商自測數字；scene extension、解析度與計費規格為 Google 官方公告與文件所載。

## 與前代/競品比較

跟自家 preview 版比，Omni 1.1 最大的進步不是解析度而是「可控性」：scene extension 的上下文視窗從 1 秒擴大到 10 秒，讓多段延伸的視覺與敘事更連貫；first/last frame interpolation 則是第一次讓開發者能精準指定鏡頭運動的起點與終點，不用只靠文字描述碰運氣。360p draft 模式的加入，也把「先低成本試錯、再放大成本輸出」的工作流程直接內建進 API。

跟競品比，Omni 1.1 在「無音訊」T2V 榜單排名第一（1322 Elo），但「含音訊」榜上被 Wan3.0（1241）反超，只排第二（1237）——代表它的優勢集中在畫面品質與運鏡可控性，音畫同步生成還不是最強項。定價上，720p 每秒 $0.10 跟前代持平，沒有因為功能增加而漲價；但 4K 每秒 $0.30 跟 Google 自家 Veo 3.1 Fast 的 4K 同價，並不是靠低價搶市。

定價策略採「解析度分層」——360p 只要 720p 三分之一價格，鼓勵開發者先大量生成候選再挑選放大——這跟 Alibaba Wan3.0 的按解析度定價邏輯相似，顯示主流影片模型正收斂到同一種計費模型：draft 便宜、正式輸出貴。

## 對 Agent 開發的意義

`previous_interaction_id` 把「生成 → 看結果 → 用自然語言改一個地方」變成同一個 session 內的多輪對話，而不必每次重新描述整個場景。對做內容生成 pipeline 的 agent 來說，這代表可以省掉自己維護「上一版影片描述 + diff」狀態管理邏輯的成本，直接把版本狀態交給 API 端追蹤。

- 如果你在做行銷／社群內容自動化 agent：可以先用 360p draft 模式讓 agent 大量生成候選，人工或另一個評分 agent 篩選後，只把選中版本升到 4K，大幅壓低平均生成成本
- 如果你在做長影片敘事 pipeline：40 秒累積延伸上限搭配 first/last frame interpolation，可以設計「先生成關鍵幀 → 模型補中間運動」的分鏡工作流，取代手動關鍵幀動畫
- 不適合：需要精確音畫同步的場景（含音訊 Arena 排名不是它的強項，Wan3.0、MiniMax H3 更適合）；也不適合需要離線／本地部署或想自行微調的場景，因為完全閉源，只能走雲端 API

## 今日收穫

以為「4K 輸出」代表原生渲染品質全面提升，但 Omni 1.1 的 4K 其實是 upscale（放大）而非原生渲染，原生只到 720p。這提醒我看影片模型規格表時要分清楚「原生解析度」跟「upscale 解析度」，兩者對細節保真度的意義完全不同；定價表上每秒費用的落差（$0.10 對 $0.30）某種程度上也反映了這個事實——upscale 是相對便宜的算力任務，不是三倍的原生渲染成本。

## 參考資料

- [Google Blog：Gemini Omni 1.1 Flash lets you build with more control](https://blog.google/innovation-and-ai/technology/developers-tools/build-with-gemini-omni-1-1-flash)
- [Gemini API 文件：Generate and edit videos with Gemini Omni Flash](https://ai.google.dev/gemini-api/docs/omni)
- [Gemini API Release notes：Gemini Omni Flash in public preview (2026-06-30)](https://ai.google.dev/gemini-api/docs/changelog)
- [Google DeepMind Model Card：Gemini Omni Flash](https://deepmind.google/models/model-cards/gemini-omni-flash)
- [Artificial Analysis：Text to Video Leaderboard](https://artificialanalysis.ai/video/leaderboard/text-to-video)
- [the-decoder：Google's Gemini Omni 1.1 Flash makes AI video generation cheaper and more flexible](https://the-decoder.com/googles-gemini-omni-1-1-flash-makes-ai-video-generation-cheaper-and-more-flexible)
- [Dataconomy：Gemini Omni 1.1 Flash Adds 4K Video Upscaling](https://dataconomy.com/2026/08/28/google-gemini-omni-11-flash-ai-video-tools)
- [Hedra：Best AI Video Models in 2026](https://www.hedra.com/blog/best-ai-video-models)
