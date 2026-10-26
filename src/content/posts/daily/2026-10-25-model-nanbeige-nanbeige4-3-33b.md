---
title: "模型卡｜Nanbeige4.3-33B"
date: 2026-10-25
category: daily
type: digest
tags: [ai-agent, model-release, daily, nanbeige, model-family-nanbeige]
lang: zh-TW
description: "BOSS直聘母公司 Kanzhun 旗下 Nanbeige 團隊開源 33.1B dense 模型——512K context、Apache 2.0，agentic coding 多項基準領先 Qwen3.8-27B，定位是為後續小模型蒸餾鋪路的 teacher model"
tldr: "Nanbeige4.3-33B：中國招聘平台 BOSS直聘母公司 Kanzhun 旗下 Nanbeige 團隊開源的 33.1B dense 模型，524,288 tokens（512K）context，Apache 2.0；Terminal-Bench 2.1 達 80.9（Qwen3.8-27B 73.0）、DeepSWE 65.5（Qwen 42.5）、JobBench 44.8（Qwen 34.5），但 SWE-Bench Pro 60.3 略輸 Qwen 61.7、GPQA Diamond 89.5 輸 Gemma4-31B 91.3；無官方 API 定價，純開放權重；官方定位它是 Nanbeige4.3 系列的旗艦 teacher model，用於蒸餾後續 Nanbeige4.3-3B 等小模型。"
series:
  name: "AI Model Tracker"
  order: 58
glossary:
  - term: "Nanbeige"
    def: "中國招聘平台 BOSS直聘母公司 Kanzhun Limited 旗下的開源大型語言模型團隊，先前以 3B 級小模型為主，Nanbeige4.3-33B 是其首款 30B 級旗艦模型"
---

> 🌏 [English version](/posts/daily/2026-10-25-model-nanbeige-nanbeige4-3-33b-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `Nanbeige/Nanbeige4.3-33B` |
| 廠商 | Nanbeige（中國招聘平台 BOSS直聘母公司 Kanzhun Limited 旗下 AI 團隊） |
| 參數量 | 33.1B（dense，無 MoE） |
| Context Window | 524,288 tokens（512K） |
| Input 定價 (USD/1M tokens) | 未提供（純開放權重，無官方代管 API） |
| Output 定價 (USD/1M tokens) | 未提供（同上） |
| 開源 | 是（Apache 2.0） |
| 發布日 | 2026-10-24 |
| 官方公告 | [Nanbeige/Nanbeige4.3-33B（Hugging Face 模型卡）](https://huggingface.co/Nanbeige/Nanbeige4.3-33B) |
| HuggingFace | [Nanbeige/Nanbeige4.3-33B](https://huggingface.co/Nanbeige/Nanbeige4.3-33B) |
| 家族 | Nanbeige 4.x（此前主力為 Nanbeige4.2-3B 等 3B 級小模型，4.3-33B 是該系列首款 30B 級旗艦） |

## 能力亮點

- **Agentic coding 大幅領先同量級模型**：Terminal-Bench 2.1 達 80.9（Qwen3.8-27B 73.0、Muse-Glimmer-30B 61.8、Gemma4-31B 47.2），DeepSWE 達 65.5（Qwen3.8-27B 僅 42.5）
- **35 種職業的 cowork 任務普遍領先**：JobBench 內部基準橫跨 35 種職業，Nanbeige4.3-33B 在大多數職業上贏過基線，整體分數 44.8 vs Qwen3.8-27B 的 34.5
- **512K context 原生支援**：524,288 tokens，官方建議 agent／工具呼叫場景用 `preserve_thinking=true` 保留多輪推理軌跡
- **明確定位為「teacher model」**：官方宣告這是 Nanbeige4.3 系列策略——先練出高容量 teacher，再蒸餾成後續的小模型（如 Nanbeige4.3-3B），不是獨立產品線的終點

## Benchmark 表現

| Benchmark | 分數 | 前代模型 | 競品最強（~30B 同量級） |
|---|---|---|---|
| Terminal-Bench 2.1（agentic coding） | 80.9 | —（首款 30B 級旗艦） | Qwen3.8-27B 73.0 |
| DeepSWE | 65.5 | —（首款 30B 級旗艦） | Qwen3.8-27B 42.5 |
| SWE-Bench Pro | 60.3 | —（首款 30B 級旗艦） | Qwen3.8-27B **61.7**（Nanbeige 落後） |
| JobBench（cowork，35 種職業） | 44.8 | —（首款 30B 級旗艦） | Qwen3.8-27B 34.5 |
| GPQA Diamond（推理） | 89.5 | —（首款 30B 級旗艦） | Gemma4-31B **91.3**（Nanbeige 落後） |

```diagram
title: Nanbeige4.3-33B 與 Qwen3.8-27B 四項 agentic 基準比較
desc: Nanbeige4.3-33B 在 Terminal-Bench 2.1、DeepSWE、JobBench 三項 agentic 基準大幅領先 Qwen3.8-27B，但在 SWE-Bench Pro 上小幅落後。
caption: 資料來源：Nanbeige 官方 Hugging Face 模型卡自測，評審模型與工具鏈見模型卡註腳，尚待外部複現。縱軸 0–100 分，基線 y=300、繪圖區頂 y=60，每分 2.4 單位（y = 300 − 分數 × 2.4）。
---
<svg viewBox="0 0 640 360">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">分數</text>
  <line class="dg-grid" x1="72" y1="60" x2="612" y2="60"/>
  <line class="dg-grid" x1="72" y1="180" x2="612" y2="180"/>
  <text class="dg-small" x="64" y="60" text-anchor="end" dominant-baseline="central">100</text>
  <text class="dg-small" x="64" y="180" text-anchor="end" dominant-baseline="central">50</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <g class="dg-c-accent">
    <rect class="dg-bar" x="94" y="106" width="44" height="194"/>
    <rect class="dg-bar" x="234" y="143" width="44" height="157"/>
    <rect class="dg-bar" x="374" y="155" width="44" height="145"/>
    <rect class="dg-bar" x="514" y="192" width="44" height="108"/>
    <text class="dg-text--series" x="116" y="44" text-anchor="middle" dominant-baseline="central">Nanbeige4.3-33B</text>
  </g>
  <g class="dg-c-s1">
    <rect class="dg-bar" x="150" y="125" width="44" height="175"/>
    <rect class="dg-bar" x="290" y="198" width="44" height="102"/>
    <rect class="dg-bar" x="430" y="152" width="44" height="148"/>
    <rect class="dg-bar" x="570" y="217" width="44" height="83"/>
    <text class="dg-text--series" x="172" y="44" text-anchor="middle" dominant-baseline="central">Qwen3.8-27B</text>
  </g>

  <text class="dg-sub" x="116" y="96" text-anchor="middle" dominant-baseline="central">80.9</text>
  <text class="dg-sub" x="172" y="115" text-anchor="middle" dominant-baseline="central">73.0</text>
  <text class="dg-sub" x="256" y="133" text-anchor="middle" dominant-baseline="central">65.5</text>
  <text class="dg-sub" x="312" y="188" text-anchor="middle" dominant-baseline="central">42.5</text>
  <text class="dg-sub" x="396" y="145" text-anchor="middle" dominant-baseline="central">60.3</text>
  <text class="dg-sub" x="452" y="142" text-anchor="middle" dominant-baseline="central">61.7</text>
  <text class="dg-sub" x="536" y="182" text-anchor="middle" dominant-baseline="central">44.8</text>
  <text class="dg-sub" x="592" y="207" text-anchor="middle" dominant-baseline="central">34.5</text>

  <text class="dg-sub" x="144" y="320" text-anchor="middle" dominant-baseline="central">Terminal-Bench 2.1</text>
  <text class="dg-sub" x="284" y="320" text-anchor="middle" dominant-baseline="central">DeepSWE</text>
  <text class="dg-sub" x="424" y="320" text-anchor="middle" dominant-baseline="central">SWE-Bench Pro</text>
  <text class="dg-sub" x="564" y="320" text-anchor="middle" dominant-baseline="central">JobBench</text>
</svg>
```

⚠️ 以上均為 Nanbeige 官方自測，模型卡的腳註說明部分基準使用 GPT-6 Sol 或 Claude Code 作為評審／執行工具，尚待外部獨立複現。

## 與前代/競品比較

Nanbeige4.3-33B 是這個系列第一款 30B 級模型，過去 Nanbeige 的公開模型都停在 3B 等級（如 Nanbeige4.2-3B），沒有真正的「前代」可比，比較對象只能是同量級的競品：Qwen3.8-27B、Muse-Glimmer-30B、Gemma4-31B。

跟 Qwen3.8-27B 比，Nanbeige4.3-33B 在偏 agent 的任務上贏得明顯：Terminal-Bench 2.1（80.9 vs 73.0）、DeepSWE（65.5 vs 42.5）、JobBench（44.8 vs 34.5）都大幅領先，代表它在「長流程寫程式」和「跨職業 cowork」這類需要多步驟工具呼叫的任務上調得更深。但 SWE-Bench Pro（60.3 vs 61.7）和 GDPval（84.8 vs 86.4）略輸，GPQA Diamond（89.5 vs Gemma4-31B 的 91.3）也不是最強——這代表它犧牲了一部分通用知識廣度，去換 agentic coding 的深度。

定價策略上完全沒有懸念：純開放權重、沒有官方代管 API，跟多數閉源大廠先定價再逐步開源的順序不同。官方把它定位成「teacher model」而非終端產品，真正的商業意圖是後續用它蒸餾出 Nanbeige4.3-3B 這類小模型——33B 本身更像是鋪路石，不是要跟 Qwen3.8-27B 搶市佔。

## 對 Agent 開發的意義

Nanbeige4.3-33B 最大的訊號不是分數本身，而是「先練大 teacher、再蒸餾小 student」這個明確公開的 size-ladder 策略——如果你在追蹤小模型（3B 級）agent 的能力天花板，這代表接下來值得注意的不是 33B 本身，而是用它蒸餾出來的 Nanbeige4.3-3B：teacher 分數高，蒸餾出的小模型上限才可能跟著墊高。

- 如果你在做自架、單卡可跑的 coding agent：33.1B dense 模型比 70B+ 級模型好部署，Terminal-Bench 2.1 和 DeepSWE 的大幅領先代表它在多步驟除錯／終端操作上可能比 Qwen3.8-27B 更可靠，值得實測對比。
- 如果你在做需要廣泛世界知識的通用助理：GPQA Diamond 和 SWE-Bench Pro 都不是最強，這類場景 Qwen3.8-27B 或 Gemma4-31B 可能更穩。
- 如果你在等小模型（3B 級）蒸餾版：先盯著這顆 33B teacher 的分數，再評估官方之後放出的 Nanbeige4.3-3B 能繼承多少能力——蒸餾品質上限受限於 teacher，這次 teacher 分數公開得相對完整，是個可以拿來對照的基準點。
- 不適合：需要官方 SLA 或代管 API 的生產環境——目前只有開放權重，沒有任何官方託管服務可用。

## 今日收穫

以前以為小模型蒸餾路徑都是「先找一個現成的大模型取其精華」，Nanbeige4.3 的做法是反過來：先專門練一個新的、自己的高容量 teacher model，再用它蒸餾後面的小模型系列。這代表蒸餾鏈的上限不再是「借用別人的大模型」，而是實驗室自己願不願意、有沒有能力先投入資源做好 teacher 這一層——33B 旗艦模型的存在本身，就是為了讓之後的 3B 小模型能蒸餾到更高的天花板。

## 參考資料

- [Nanbeige/Nanbeige4.3-33B（Hugging Face 模型卡）](https://huggingface.co/Nanbeige/Nanbeige4.3-33B)
- [explainx.ai：Nanbeige4.3-33B — Open Apache 2.0 Agent Model Tested Against Qwen3.8-27B](https://explainx.ai/blog/nanbeige-4-3-33b-open-agentic-model-guide-2026)
- [pasqualepillitteri.it：Nanbeige4.3-33B arrives open source and takes on Qwen3.8-27B in coding](https://pasqualepillitteri.it/en/news/27138/nanbeige-4-3-33b-open-source-en)
- [Nanbeige/Nanbeige4.2-3B（Hugging Face，前代小模型參考）](https://huggingface.co/Nanbeige/Nanbeige4.2-3B)
