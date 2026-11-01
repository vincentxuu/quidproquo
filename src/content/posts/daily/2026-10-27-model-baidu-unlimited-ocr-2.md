---
title: "模型卡｜Baidu Unlimited OCR 2"
date: 2026-10-27
category: daily
type: digest
tags: [ai-agent, model-release, daily, baidu, model-family-unlimited-ocr]
lang: zh-TW
description: "Baidu 開源 Unlimited OCR 2——3.34B 視覺語言模型，靠 SR-SWA 稀疏注意力把百頁文件解析分數從前代的 0 分拉到 77.1 分"
tldr: "Baidu Unlimited OCR 2（`baidu/Unlimited-OCR-2`）：2026-10-27 開源，3.34B 參數（SAM ViT-B + CLIP-L 編碼器 + 12 層 MoE decoder，每 token 路由 6-of-64 專家＋2 共享專家）、131,072 tokens context window、MIT License；核心技術 SR-SWA（Sparse Reference Sliding Window Attention）把跨頁 text-visual attention 壓縮成固定 512-token 參照集；MPDocBench（幾十頁文件）總分 84.6，MarathonDocBench（百頁文件）總分 77.1，只比前者掉 7.5 分；前代 Unlimited-OCR 1.0 同測試下 MarathonDocBench 是 0.0 分、競品 Qwen3.8-Max 從 78.3 掉到 22.9；單張 NVIDIA A800-80GB 即可跑，BF16 權重約 6.7GB"
series:
  name: "AI Model Tracker"
  order: 60
glossary:
  - term: "Unlimited OCR"
    def: "Baidu 開源的長文件 OCR 模型家族，目標是讓任意長度的文件（從幾頁到上百頁）都能一次解析，不需要先切 chunk 再拼接"
---

> 🌏 [English version](/posts/daily/2026-10-27-model-baidu-unlimited-ocr-2-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `baidu/Unlimited-OCR-2` |
| 廠商 | Baidu |
| 參數量 | 3.34B（active 參數未公開；12 層 MoE decoder，每 token 路由 6-of-64 專家＋2 共享專家，架構延續 DeepSeek-OCR 的 DeepSeek3B-MoE-A570M 風格） |
| Context Window | 131,072 tokens |
| Input 定價 (USD/1M tokens) | 未提供（僅開放權重＋Baidu Cloud 文件，無官方託管 API 定價） |
| Output 定價 (USD/1M tokens) | 未提供（同上） |
| 開源 | 是（MIT License） |
| 發布日 | 2026-10-27 |
| 官方公告 | [Baidu Inc. on X：Unlimited OCR 2 is here](https://x.com/Baidu_Inc/status/2114910381311512987) |
| HuggingFace | [baidu/Unlimited-OCR-2](https://huggingface.co/baidu/Unlimited-OCR-2) |
| 家族 | Unlimited-OCR（前代 Unlimited-OCR 1.0 於 2026-06-22 發布，目標是把 DeepSeek-OCR 的長文件解析再往前推一步；本代核心技術是 SR-SWA） |

## 能力亮點

- **SR-SWA（Sparse Reference Sliding Window Attention）**：把跨頁 text-visual attention 壓縮成固定 512-token 的工作參照集（128-token 局部視窗＋32-token 區塊 top-16 選取），讓每一步解碼的延遲與記憶體幾乎不隨文件頁數增加
- **MarathonDocBench（百頁級文件）總分 77.1**，比次名 Kimi-K3 的 33.7 高超過 2 倍；對照 MPDocBench（幾十頁文件）的 84.6 分，只掉 7.5 分
- **對比前代 Unlimited-OCR 1.0**：同樣測 MarathonDocBench，前代是 0.0 分、這代是 77.1 分——前代在百頁文件直接崩潰，這代才真正做到「文件再長，解析品質也不崩」
- 3.34B 參數（SAM ViT-B + CLIP-L 編碼器＋12 層 MoE decoder），單張 NVIDIA A800-80GB 就能跑，BF16 權重約 6.7GB，多頁模式下每頁只消耗 273 個 image token

## Benchmark 表現

| Benchmark | 分數 | 前代 (Unlimited-OCR 1.0) | 競品最強 |
|---|---|---|---|
| MPDocBench（幾十頁文件，總分） | 84.6 | 61.9 | Qwen3.8-Max 78.3 |
| MarathonDocBench（百頁文件，總分） | 77.1 | 0.0 | Kimi-K3 33.7 |
| 文字抽取（Text，MarathonDocBench 子項） | 89.6 | 官方未公開子項分數 | 官方未公開 |
| 表格（Table，MarathonDocBench 子項） | 74.8 | 官方未公開子項分數 | 官方未公開 |
| 標題階層（Heading hierarchy，MarathonDocBench 子項，全模型最弱項） | 48.2 | 官方未公開子項分數 | 官方未公開 |

⚠️ 以上均為 Baidu 官方自測，且只公開在模型卡的 leaderboard 圖表裡（非表格數據，由第三方媒體整理轉錄）。MarathonDocBench 是 Baidu 自建的新 benchmark，尚無公開發布的資料集，也還沒有其他團隊獨立複現。

```diagram
title: Unlimited OCR 2 在長文件 benchmark 的分數落差明顯縮小
desc: Baidu Unlimited OCR 2 在 MPDocBench（幾十頁文件）與 MarathonDocBench（百頁文件）之間只掉 7.5 分；對照組 Qwen3.8-Max 掉 55.4 分，前代 Unlimited-OCR 1.0 直接掉到 0 分。
caption: 資料來源：Baidu 官方 leaderboard 圖表（2026-10-27，皆為自測分數，MarathonDocBench 為 Baidu 自建、尚無公開發布的 benchmark）。換算：基線 y=300，繪圖區頂 y=60，網域 0–100 分，k=(300−60)÷100=2.4（每分 2.4 單位），長條頂 y=300−分數×2.4。
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">分數</text>
  <line class="dg-grid" x1="72" y1="108" x2="612" y2="108"/>
  <line class="dg-grid" x1="72" y1="204" x2="612" y2="204"/>
  <text class="dg-small" x="64" y="108" text-anchor="end" dominant-baseline="central">80</text>
  <text class="dg-small" x="64" y="204" text-anchor="end" dominant-baseline="central">40</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <text class="dg-text--series" x="136" y="52" text-anchor="middle" dominant-baseline="central">MPDoc</text>
  <text class="dg-text--series dg-text--accent" x="188" y="52" text-anchor="middle" dominant-baseline="central">Marathon</text>

  <rect class="dg-bar dg-c-s1" x="114" y="97" width="44" height="203"/>
  <rect class="dg-bar dg-c-accent" x="166" y="115" width="44" height="185"/>
  <rect class="dg-bar dg-c-s1" x="294" y="112" width="44" height="188"/>
  <rect class="dg-bar dg-c-accent" x="346" y="245" width="44" height="55"/>
  <rect class="dg-bar dg-c-s1" x="474" y="151" width="44" height="149"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="136" y="87" text-anchor="middle" dominant-baseline="central">84.6</text>
  <text class="dg-label dg-text--accent" x="188" y="105" text-anchor="middle" dominant-baseline="central">77.1</text>
  <text class="dg-sub" x="316" y="102" text-anchor="middle" dominant-baseline="central">78.3</text>
  <text class="dg-sub" x="368" y="235" text-anchor="middle" dominant-baseline="central">22.9</text>
  <text class="dg-sub" x="496" y="141" text-anchor="middle" dominant-baseline="central">61.9</text>
  <text class="dg-label dg-text--accent" x="548" y="288" text-anchor="middle" dominant-baseline="central">0.0</text>

  <text class="dg-sub dg-text--accent" x="162" y="320" text-anchor="middle" dominant-baseline="central">Unlimited OCR 2</text>
  <text class="dg-sub" x="342" y="320" text-anchor="middle" dominant-baseline="central">Qwen3.8-Max</text>
  <text class="dg-sub" x="522" y="320" text-anchor="middle" dominant-baseline="central">Unlimited OCR 1</text>
</svg>
```

## 與前代/競品比較

跟前代 Unlimited-OCR 1.0 比，MPDocBench 只進步了 22.7 個百分點（61.9 → 84.6），但 MarathonDocBench 是從 0.0 直接跳到 77.1。這個對比說明前代的 `infer_multi` 多頁推論雖然能把整份文件丟進同一次請求，但沒有真正解決長序列的 attention 計算複雜度，超過某個頁數就整組崩潰；SR-SWA 的固定大小參照集才是解決瓶頸的關鍵，不是單純加大 context window 或多頁推論介面。

跟目前 MPDocBench 次強的 Qwen3.8-Max 比，短文件（幾十頁）時兩者只差 6.3 分（84.6 vs 78.3），幾乎打平；但換到百頁級的 MarathonDocBench，Qwen3.8-Max 從 78.3 暴跌到 22.9（掉 55.4 分），Unlimited OCR 2 只掉 7.5 分。這代表在短文件 benchmark 上的高分不保證長文件的穩定度——真正決定長文件解析品質的是有沒有針對超長序列設計的注意力機制，不是單純堆參數或擴大宣稱的 context window。

授權策略上，Unlimited OCR 2 跟同樣走開放權重路線的 DeepSeek-OCR-2（Apache 2.0）、PaddleOCR-VL-1.6（Apache 2.0）屬同一陣營，用 MIT License 把權重、程式碼和技術報告一次公開，沒有另闢付費 API 產品線。

## 對 Agent 開發的意義

- 如果你在做處理長文件的 agent（合約逐條比對、財報年度歸檔、整本書籍建 RAG 索引）：Unlimited OCR 2 的賣點是「不用先切 chunk」——`infer_multi` 一次吃進整份文件，並保留跨頁的表格、標題、段落結構，對需要「完整文件結構」而非「逐頁獨立文字」的下游任務（自動產生目錄、精準定位引用段落）特別有利
- 如果你在做文件解析 pipeline 且想自架推理：3.34B 參數、單張 A800-80GB、BF16 約 6.7GB 權重，代表中階 GPU 就能自架，不必呼叫外部 OCR API，對資料不能出境的場景（金融、醫療文件）是現實的選項
- 如果你的任務需要高準確度的標題／章節結構（自動產生目錄或章節摘要）：要注意 Heading hierarchy 是整個模型最弱的子項（百頁文件只有 48.2 分），這塊仍需要人工校對或額外後處理，不能全自動信任
- 不適合：需要官方雲端 API 與 SLA 保證的場景——Baidu 目前只提供開放權重與 Baidu Cloud 文件（非標準託管 API），定價與服務等級跟 OpenAI、Anthropic 這類代管 API 模式不同，需要自行評估部署與維運成本

## 今日收穫

之前以為「長文件 OCR」主要靠切 chunk 再拼接，或是乾脆擴大 context window 硬撐過去，Unlimited OCR 2 的 MarathonDocBench 結果打破了這個假設——前代用同樣「一次吃全部頁面」的策略（`infer_multi`），分數直接崩到 0；只有換上 SR-SWA 這種把 attention 壓縮成固定大小參照集的機制，才能讓解析品質不隨頁數崩潰。這提醒我：長序列任務的瓶頸常常不是「context window 夠不夠大」，而是注意力機制本身的計算複雜度有沒有被真正解決。

## 參考資料

- [Baidu：Unlimited-OCR-2 模型卡（Hugging Face）](https://huggingface.co/baidu/Unlimited-OCR-2)
- [Baidu：Unlimited-OCR GitHub 原始碼](https://github.com/baidu/Unlimited-OCR)
- [Baidu Inc. on X：Unlimited OCR 2 is here](https://x.com/Baidu_Inc/status/2114910381311512987)
- [MarkTechPost：Baidu Open-Sources Unlimited OCR 2 for Hundred-Page Document Parsing](https://www.marktechpost.com/2026/10/26/baidu-unlimited-ocr-2-open-source-long-document-ocr/)
- [explainX：Unlimited-OCR-2 — Baidu's 3B MIT OCR Model, How to Run It](https://explainx.ai/blog/baidu-unlimited-ocr-2-sr-swa-3b-mit-hundred-page-document-parsing-how-to-run-2026)
- [AlphaSignal：Baidu Open-Sources Unlimited OCR 2 to Parse Hundreds of Pages Without Breaking](https://alphasignal.ai/news/baidu-open-sources-unlimited-ocr-2-to-parse-hundreds-of-pages-without-breaking)
