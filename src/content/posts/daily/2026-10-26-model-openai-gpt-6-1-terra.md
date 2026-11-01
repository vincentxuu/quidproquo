---
title: "模型卡｜GPT-6.1 Terra"
date: 2026-10-26
category: daily
type: digest
tags: [ai-agent, model-release, daily, openai, model-family-gpt]
lang: zh-TW
description: "OpenAI 發佈 GPT-6.1 Terra——電腦操作與視覺推理專用的性價比分支，標準單價比前代砍半，Terminal-Bench 4.0 分數翻倍以上"
tldr: "GPT-6.1 Terra（`gpt-6.1-terra`）：2026-10-26 上線，1,050,000 tokens context window；定價 input $1.00／output $5.00／cached input $0.05（比 GPT-5.6 Terra 與 GPT-6.1 Sol 的標準單價砍半）；Terminal-Bench 4.0（max effort）50.3% 比前代 21.5% 翻倍以上；Agents' Last Exam medium effort 比前代高 15 個百分點、成本約其 1/3，追平 GPT-6 Astra 但成本僅其 1/10；max effort 下比 Claude Opus 5.5 token 效率高 3 倍、單任務成本約其 1/9；內部事實錯誤率 low effort 從前代 53.6% 降到 16.7%"
series:
  name: "AI Model Tracker"
  order: 59
glossary:
  - term: "GPT"
    def: "OpenAI 開發的大型語言模型家族，Terra 是鎖定電腦操作與視覺推理、強調性價比的中階分支"
---

> 🌏 [English version](/posts/daily/2026-10-26-model-openai-gpt-6-1-terra-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `gpt-6.1-terra` |
| 廠商 | OpenAI |
| 參數量 | 未公開 |
| Context Window | 1,050,000 tokens |
| Input 定價 (USD/1M tokens) | $1.00（cached $0.05） |
| Output 定價 (USD/1M tokens) | $5.00 |
| 開源 | 否 |
| 發布日 | 2026-10-26 |
| 官方公告 | [OpenAI：Introducing GPT-6.1 Terra](https://openai.com/index/introducing-gpt-6-1-terra/) |
| 家族 | GPT-6.1（同系列 GPT-6.1 Sol 2026-09-29 發佈、input $2／output $10；旗艦 GPT-6 Astra input $10／output $50；前代 GPT-5.6 Terra input $2／output $12） |

## 能力亮點

- Agents' Last Exam（電腦操作實測任務）medium effort 下比前代 GPT-5.6 Terra 高 15 個百分點，成本只要前代約 1/3；分數追平旗艦 GPT-6 Astra，但每 token 價格僅其 1/10
- max effort 下 token 效率比 Claude Opus 5.5 高 3 倍以上、每 token 價格僅其 1/4，換算單任務成本約降至對方 1/9；完成任務速度比 GPT-6 Astra 與 GPT-6.1 Sol 快 3 倍以上
- Terminal-Bench 4.0（命令列 coding agent 任務）max effort 達 50.3%，比前代公佈的 21.5% 翻倍以上
- 內部事實錯誤率 low effort 從前代 53.6% 降到 16.7%（降幅約 37 個百分點），max effort 降到 4.3%，已接近旗艦 GPT-6 Astra 與 GPT-6.1 Sol 的水準

## Benchmark 表現

| Benchmark | 分數 | 前代 (GPT-5.6 Terra) | 競品最強 |
|---|---|---|---|
| Agents' Last Exam（medium effort） | 高於前代 +15pp，成本約前代 1/3 | 基準線（官方未公佈絕對分數） | 追平 GPT-6 Astra，成本僅其 1/10 |
| Terminal-Bench 4.0（max effort） | 50.3% | 21.5% | 官方未在本次公告列出其他模型分數 |
| 內部事實錯誤率（low effort，越低越好） | 16.7% | 53.6% | 官方未列出競品同設定分數 |
| 內部事實錯誤率（max effort，越低越好） | 4.3% | 22.3%（官方稱「降 18 個百分點」反推） | 與 GPT-6 Astra、GPT-6.1 Sol 相近 |
| Terminal-Bench-Science 0.1（max effort） | 優於 GPT-6.1 Sol，成本更低；距 Claude Opus 5.5 僅差 5 分 | 未在本次公告提供 | 落後 Claude Opus 5.5 約 5 分，但成本不到其 1/5 |

⚠️ 以上均為 OpenAI 官方自測與自選比較基準（各自設定的 reasoning effort），尚待第三方獨立複現；多數為官方公佈的「相對差距」而非雙方絕對分數，GPT-5.6 Terra 與競品的部分具體數字官方未在本次公告完整列出。

```diagram
title: GPT-6.1 Terra 內部事實錯誤率：前後代對照
desc: GPT-6.1 Terra 在 low effort 與 max effort 兩種 reasoning 設定下，事實錯誤率都比前代 GPT-5.6 Terra 大幅下降。
caption: 資料來源：OpenAI 官方公告自測結果（2026-10-26）。max effort 的前代基準值由公告揭露的降幅反推：4.3% + 18 個百分點 = 22.3%。換算：基線 y=300，每百分點 4 單位（y = 300 − 數值 × 4），縱軸從 0 起，網域 0–60。
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">錯誤率（%）</text>
  <line class="dg-grid" x1="72" y1="140" x2="612" y2="140"/>
  <line class="dg-grid" x1="72" y1="220" x2="612" y2="220"/>
  <text class="dg-small" x="64" y="140" text-anchor="end" dominant-baseline="central">40</text>
  <text class="dg-small" x="64" y="220" text-anchor="end" dominant-baseline="central">20</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <text class="dg-text--series" x="172" y="52" text-anchor="middle" dominant-baseline="central">GPT-5.6 Terra</text>
  <text class="dg-text--series dg-text--accent" x="244" y="52" text-anchor="middle" dominant-baseline="central">GPT-6.1 Terra</text>

  <rect class="dg-bar dg-c-s1" x="140" y="86" width="64" height="214"/>
  <rect class="dg-bar dg-c-accent" x="212" y="233" width="64" height="67"/>
  <rect class="dg-bar dg-c-s1" x="364" y="211" width="64" height="89"/>
  <rect class="dg-bar dg-c-accent" x="436" y="283" width="64" height="17"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="172" y="76" text-anchor="middle" dominant-baseline="central">53.6%</text>
  <text class="dg-label dg-text--accent" x="244" y="223" text-anchor="middle" dominant-baseline="central">16.7%</text>
  <text class="dg-sub" x="396" y="201" text-anchor="middle" dominant-baseline="central">22.3%</text>
  <text class="dg-label dg-text--accent" x="468" y="273" text-anchor="middle" dominant-baseline="central">4.3%</text>

  <text class="dg-sub" x="208" y="320" text-anchor="middle" dominant-baseline="central">low effort</text>
  <text class="dg-sub" x="432" y="320" text-anchor="middle" dominant-baseline="central">max effort</text>
</svg>
```

## 與前代/競品比較

跟 GPT-5.6 Terra 比，這次標準單價直接砍半：input 從 $2.00 降到 $1.00、output 從 $12.00 降到 $5.00，是定價策略而非只是分數進步。分數面也沒有縮水——Terminal-Bench 4.0 從 21.5% 翻倍以上到 50.3%、事實錯誤率在 low effort 降了約三分之二——代表這代 Terra 同時達成「更便宜」與「更強」，不是用降分換降價。

跟旗艦 GPT-6 Astra 比，Agents' Last Exam 上 Terra 已經追平 Astra 的分數，但每 token 價格只要 Astra 的十分之一；MMMU-Pro 視覺推理也幾乎追平 Astra 與 GPT-6.1 Sol。這把 OpenAI 自家產品線的定位往下壓：原本只有旗艦才能做到的電腦操作精度，現在用中價位模型就能逼近。

跟 Claude Opus 5.5 比，Terra 在 max effort 下 token 效率高 3 倍、價格僅其 1/4，兩者相乘讓單任務成本差距拉大到約 9 倍；但在 Terminal-Bench-Science 0.1 這類最吃重科研推理的任務上，Terra 仍落後 Opus 5.5 約 5 分——OpenAI 自己也沒有宣稱這代 Terra 是分數天花板，而是把「夠好的分數＋大幅降低的成本」當成賣點。

## 對 Agent 開發的意義

這次發布把焦點放在「電腦操作」（computer use）與「視覺推理」兩項能力上，對應的是需要大量重複執行、但單次任務不需要頂尖推理能力的 agent 場景。

- 如果你在做需要讀取畫面、操作桌面應用、填表單或剪輯影片的 agent：Terra 在 OSWorld 2.1（桌面多步驟任務）medium effort 下已經超過前代的最佳分數，且成本更低，是目前這類場景裡性價比最高的選項
- 如果你在做高量處理但預算有限的 pipeline（如讀取發票並寫入記帳系統）：標準單價砍半到 input $1／output $5，加上 cached input $0.05，重複性高的批次工作成本可以大幅下降
- 如果你在做 coding agent：Terminal-Bench 4.0 翻倍以上的進步值得重新評估是否能用 Terra 取代部分原本交給 Sol 或 Astra 處理的中等複雜度任務；但官方明言「最複雜的 coding 任務仍建議用 GPT-6.1 Sol 或 GPT-6 Astra」
- 不適合：需要頂尖科研推理能力的場景——Terminal-Bench-Science 0.1 上 Terra 仍落後 Claude Opus 5.5 約 5 分，這個差距這次沒有補上

## 今日收穫

這次發佈沒有挑戰任何分數天花板，卻同時把標準單價砍半、把事實錯誤率降了超過三分之二——說明 OpenAI 現階段在中價位分支上追求的不是「刷新紀錄」，而是把旗艦等級的電腦操作能力用十分之一的價格做出來。對 agent 開發者來說，這種「分數持平但成本結構整個下移」的發布，往往比榜單上多幾個百分點更值得重新計算一次現有 pipeline 的單位成本。

## 參考資料

- [OpenAI：Introducing GPT-6.1 Terra](https://openai.com/index/introducing-gpt-6-1-terra/)
- [OpenAI Deployment Safety：GPT-6.1 Terra system card](https://deploymentsafety.openai.com/gpt-6-1-terra)
- [OpenRouter：GPT-6.1 Terra model page](https://openrouter.ai/openai/gpt-6.1-terra)
- [9to5Mac：OpenAI upgrades ChatGPT and Codex with new GPT-6.1 Terra model](https://9to5mac.com/2026/10/26/openai-upgrades-chatgpt-and-codex-with-new-gpt-6-1-terra-model)
