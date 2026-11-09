---
title: "模型卡｜GPT-Image-2.6"
date: 2026-11-07
category: daily
type: digest
tags: [ai-agent, model-release, daily, openai, model-family-gpt-image]
lang: zh-TW
description: "OpenAI 發布 GPT-Image-2.6（Flare／Sunburst）——新增 GIF 動畫、markup 精準編輯與 SVG 向量輸出，定價維持 2.5 代不變，但 LMArena 初期榜單顯示本代反而落後自家前代"
tldr: "GPT-Image-2.6（API ID：gpt-image-2.6-flare／gpt-image-2.6-sunburst）：OpenAI 於 2026-11-04 發布，新增 GIF 動畫生成、markup 標註精準編輯、SVG 向量輸出；定價維持 2.5 代不變（text in $5／image in $8／image out $30，每 1M tokens）；LMArena 文字生成圖片榜（preliminary，2026-11-02 讀取）顯示 2.6 Sunburst 落後自家 2.5 Sunburst，但 Artificial Analysis 隔兩天後的轉述又稱 2.6 家族拿下雙榜冠亞軍——同一個模型在不同榜單、不同讀取時間點排名互相矛盾"
series:
  name: "AI Model Tracker"
  order: 69
glossary:
  - term: "GPT-Image"
    def: "OpenAI 的圖像生成與編輯模型系列，從 2025-04 的 GPT Image 1 發展到本次的 GPT-Image-2.6，2.5 代起分出 Flare（快）／Sunburst（精細）兩個 API 變體"
  - term: "LMArena"
    def: "前身為 Chatbot Arena，用大量使用者兩兩盲比投票算出 Elo 式分數的獨立模型評測平台，圖像生成與編輯各有獨立榜單"
---

> 🌏 [English version](/posts/daily/2026-11-07-model-openai-gpt-image-2-6-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `gpt-image-2.6-flare`／`gpt-image-2.6-sunburst` |
| 廠商 | OpenAI |
| 參數量 | 未公開 |
| Context Window | 不適用（圖像生成模型；輸出總像素上限 8,294,400px，單邊不超過 3,840px，超過 2560×1440 標為實驗性） |
| Input 定價 (USD/1M tokens) | 文字輸入 $5.00；圖像輸入 $8.00（cache $2.00） |
| Output 定價 (USD/1M tokens) | $30.00（兩個變體相同，與 2.5 代持平） |
| 開源 | 否 |
| 發布日 | 2026-11-04 |
| 官方公告 | [OpenAI：Introducing Images 2.6](https://openai.com/index/introducing-images-2-6/) |
| 家族 | GPT-Image 系列（GPT Image 1，2025-04 → GPT Image 2，2026-04 → GPT-Image-2.5，2026-09 → GPT-Image-2.6，本次） |

## 能力亮點

- 新增 GIF 動畫生成：從文字 prompt 或上傳圖片直接產出會動的 GIF，可調動畫速度並逐格編輯，最多 16 格
- markup 精準編輯：在 API 傳入透明 PNG 疊圖標註要改哪一塊，取代純文字描述修改範圍；同時新增 SVG 向量輸出，是目前除 Recraft 外少數能直接吐向量圖的 API
- Flare 變體生成速度再加快約 50%，最低品質設定下最快 6 秒出圖；Artificial Analysis 實測顯示 Flare 的文字生成圖片中位延遲從前代約 55 秒降到約 30 秒
- 新增 `complexity` 參數獨立於 `quality` 控制模型規劃程度，預設為 `high`；消費端新增可重複使用的角色／寵物參考圖，不用每次重新上傳

## Benchmark 表現

| 來源 | GPT-Image-2.6 | 前代（2.5 代） | 對照 |
|---|---|---|---|
| LMArena 文字生成圖片榜（Medium 品質，preliminary，2026-11-02 讀取） | Sunburst 1409±13（第 2 名，2,967 票）／Flare 1384±13（第 4 名，2,792 票） | 2.5 Sunburst 1427±5（第 1 名，54,913 票）／2.5 Flare 1399±5（第 3 名） | Nano Banana 2.1 1325±9（第 7 名） |
| LMArena 單圖編輯榜（同上讀取日） | Sunburst 1476±10（第 3 名）／Flare 1462±10（第 5 名） | 2.5 Sunburst 1517±5（第 1 名）／2.5 Flare 1482±5（第 2 名） | MAI-Image-2.7-Preview 1469±7（第 4 名） |
| Artificial Analysis 雙榜（2026-11-06 第三方轉述）⚠️ | 文字生成圖片與編輯雙榜雙雙拿下前兩名 | 原文稱「超越 2.5 代」，未附精確分差數字 | 原文未列出其他模型對照分數 |

⚠️ 三組數字來自不同獨立平台、不同品質設定（LMArena 用 Medium，OpenAI 官方未說明 Artificial Analysis 用哪個品質檔）、不同讀取時間點（11-02 對 11-06），且都不是 OpenAI 自測。LMArena 兩筆 2.6 資料的投票數（約 2,800～3,000 票）遠低於 2.5 代的 5 萬多票，區間寬度也是鄰近名次的兩倍以上，屬於統計上還不穩定的早期樣本；Artificial Analysis 這邊截至 11-05 甚至尚未收錄 2.6，11-06 才出現「拿下雙榜冠亞軍」的說法，但原始文章沒有附上分數，只能視為第三方轉述，無法逐一核對換算。

```diagram
title: GPT-Image-2.6 發布後四天的評測結論反轉
desc: LMArena 榜單標示日期 11-02 時 2.6 排名在自家 2.5 代之後，Artificial Analysis 在 11-05 尚未收錄此模型，11-06 的第三方轉述卻改稱 2.6 拿下雙榜冠亞軍
caption: 日期為各榜單自述或讀取時間點，非嚴格事件發生順序；LMArena 的榜單標示日期甚至早於 OpenAI 11-04 的正式發布。
---
<svg viewBox="0 0 620 280">
  <path class="dg-axis" d="M40 124H560"/>

  <rect class="dg-band dg-band--warn" x="100" y="236" width="400" height="24"/>
  <text class="dg-small dg-text--warn" x="300" y="248" text-anchor="middle" dominant-baseline="central">兩榜單對同一模型結論相反</text>

  <g>
    <line class="dg-rule" x1="100" y1="76" x2="100" y2="118"/>
    <circle class="dg-dot dg-dot--accent" cx="100" cy="124" r="6"/>
    <text class="dg-label" x="100" y="40" text-anchor="middle" dominant-baseline="central">2026-11-02</text>
    <text class="dg-sub" x="100" y="62" text-anchor="middle" dominant-baseline="central">LMArena：落後 2.5</text>
  </g>

  <g>
    <line class="dg-rule" x1="300" y1="130" x2="300" y2="172"/>
    <circle class="dg-dot" cx="300" cy="124" r="4"/>
    <text class="dg-label" x="300" y="186" text-anchor="middle" dominant-baseline="central">2026-11-04</text>
    <text class="dg-sub" x="300" y="208" text-anchor="middle" dominant-baseline="central">官方正式發布</text>
  </g>

  <g>
    <line class="dg-rule" x1="400" y1="76" x2="400" y2="118"/>
    <circle class="dg-dot" cx="400" cy="124" r="4"/>
    <text class="dg-label" x="400" y="40" text-anchor="middle" dominant-baseline="central">2026-11-05</text>
    <text class="dg-sub" x="400" y="62" text-anchor="middle" dominant-baseline="central">AA 尚未收錄</text>
  </g>

  <g>
    <line class="dg-rule" x1="500" y1="130" x2="500" y2="172"/>
    <circle class="dg-dot dg-dot--accent" cx="500" cy="124" r="6"/>
    <text class="dg-label" x="500" y="186" text-anchor="middle" dominant-baseline="central">2026-11-06</text>
    <text class="dg-sub" x="500" y="208" text-anchor="middle" dominant-baseline="central">稱拿下雙榜冠亞軍</text>
  </g>
</svg>
```

## 與前代/競品比較

跟 2.5 代比，2.6 的定價完全沒變（text in $5／image in $8／image out $30，每 1M tokens），新增的 GIF、markup 編輯、SVG 向量輸出都算在同一套費率裡，等於免費加功能。但耐人尋味的是：截至目前能看到的獨立評測（LMArena），2.6 的兩個變體在「畫質偏好」這個維度上反而雙雙輸給自家 2.5 代的對應變體——速度大幅提升、功能明顯增加，畫質卻沒有同步躍進，至少目前的早期投票數據是這樣顯示。

跟 Google Nano Banana 2.1 比，兩家都是按 token 計費且圖像輸出同樣是 $30／1M tokens，但 Google 圖像輸入只要 $1.50（OpenAI 要 $8），而且 Google 額外公布了「1K 圖消耗 1,120 tokens，等於 $0.0336」這種可以直接換算成每張圖價格的資訊，OpenAI 沒有公布對應換算，開發者得自己實測才知道真實成本。社群已有報告指出同樣 prompt 在 2.6 的 `low`／`medium` 品質設定下，耗費的輸出 token 數比 2.5 明顯更高（一份報告是約 1,136 比 344 tokens），代表即使費率沒變，實際帳單可能不降反升。

跟走「每張圖固定價」路線的 ByteDance Seedream 5.0 flash（$0.018／張）、Recraft V4.1 Flash（$0.007／張）比，GPT-Image-2.6 的按 token 計費在高量生產場景下完全無法事先精算預算，這是整個 GPT-Image 系列（跟同樣按 token 計費的 Nano Banana）共有的結構性缺點，不是這次升級解決的問題。

## 對 Agent 開發的意義

如果你在做素材自動化 agent（行銷圖、社群貼文配圖、品牌吉祥物動畫）：GIF 生成＋可重複使用參考圖，可以把「畫同一個角色的多張變體」這種以前要靠 prompt 工程硬湊一致性的任務，變成存一次參考圖就重複呼叫；但要先用自己的實際 prompt 測一輪 token 消耗，別直接假設帳單會跟 2.5 代一樣。

如果你在做需要向量輸出的設計 pipeline（logo、icon、UI 元件）：markup 編輯＋SVG 匯出讓「指出要改哪一塊」不用再靠文字描述座標，SVG 輸出又能直接進排版工具不用再描圖；但 Recraft 用固定每張圖價格也提供 SVG，兩者的差異已經不是功能有無，而是計費模式可不可預測。

不適合：需要精算單張圖成本的高量生產場景（每月數千張以上的素材流水線），這種情境下按 token 計費的不確定性會壓過新功能帶來的好處，Seedream 或 Recraft 的固定每張圖價格更適合排預算；也不適合現在就拿「某個排行榜第一名」當選型依據——同一天的兩個獨立榜單對 2.6 的畫質排名根本互相矛盾，等票數跟榜單都穩定下來才值得當成選型證據。

## 今日收穫

之前以為「獨立第三方榜單」至少比廠商自己的 benchmark 更可信、更穩定；GPT-Image-2.6 這次打破了這個假設——同一個模型，LMArena（preliminary、投票數只有前代的 5%）顯示它排名掉到自家前代之後，兩天後 Artificial Analysis 的轉述又說它拿下雙榜冠亞軍，而且後者連分數都沒附。榜單本身的更新速度跟上線後的統計噪訊，現在已經是圖像模型發布週期裡跟定價、功能同等重要的變數：任何「發布當天就拿下第一」的說法，都該先問清楚是哪個榜、哪個品質檔、讀取在哪一天。

## 參考資料

- [OpenAI：Introducing Images 2.6（官方公告）](https://openai.com/index/introducing-images-2-6/)
- [OpenAI's GPT-Image-2.6 Flare and Sunburst Top Every Image Leaderboard（AlphaSignal）](https://alphasignal.ai/news/openai-s-gpt-image-2-6-flare-and-sunburst-top-every-image-leaderboard)
- [GPT-Image-2.6: What Changed, Flare vs. Sunburst, Pricing（Oimi AI Studio）](https://oimi.ai/en/blog/what-is-gpt-image-2-6)
- [GPT Image 2.6 vs Gemini, FLUX and Seedream Compared（Digital Applied，含 LMArena 完整榜單數字）](https://www.digitalapplied.com/blog/gpt-image-2-6-vs-gemini-flux-seedream)
- [GPT Image 2.6: Flare vs Sunburst, Pricing and API Guide（Digital Applied）](https://www.digitalapplied.com/blog/gpt-image-2-6-flare-sunburst-api-guide)
- [OpenAI Developer Community：Images, upgraded — introducing ChatGPT Images 2.6](https://community.openai.com/t/images-upgraded-introducing-chatgpt-images-2-6/1412901)
