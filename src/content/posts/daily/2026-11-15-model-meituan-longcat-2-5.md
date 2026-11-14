---
title: "模型卡｜LongCat-2.5"
date: 2026-11-15
category: daily
type: digest
tags: [ai-agent, model-release, daily, meituan, model-family-longcat]
lang: zh-TW
description: "美團發佈 LongCat-2.5——1.6T MoE 把視覺理解折進同一個 token stream，agentic RL 讓 DeepSWE 分數從 9.7% 跳到 64.6%，一週後補發 MIT 權重"
tldr: "LongCat-2.5：1.6T 總參數、約 48B 活躍、1M context，API 定價 input $0.30／output $1.20（每 1M tokens）；DeepSWE v1.1 從前代 LongCat-2.0 的 9.7% 跳到 64.6%，BrowseComp 91.9% 為同場最高分；視覺 token 折進 backbone，支援『visual coding』"
series:
  name: "AI Model Tracker"
  order: 73
glossary:
  - term: "LongCat"
    def: "美團（Meituan）開發的開放權重 agentic 模型家族，以動態 MoE 與長上下文為特色"
---

> 🌏 [English version](/posts/daily/2026-11-15-model-meituan-longcat-2-5-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `LongCat-2.5` |
| 廠商 | Meituan（美團）／LongCat 團隊 |
| 參數量 | 1.6T 總參數，約 48B 每 token 活躍（MoE） |
| Context Window | 1,000,000 tokens |
| Input 定價 (USD/1M tokens) | $0.30（限時價，未快取；快取輸入 $0.006） |
| Output 定價 (USD/1M tokens) | $1.20 |
| 開源 | 是（MIT，權重於公告一週後補發） |
| 發布日 | 2026-11-01（公告／API 上線），2026-11-09（補發權重） |
| 官方公告 | [LongCat-2.5 Blog](https://longcat.ai/blog/longcat-2.5/) |
| HuggingFace | [meituan-longcat/LongCat-2.5](https://huggingface.co/meituan-longcat/LongCat-2.5) |
| 家族 | LongCat 2.x |

## 能力亮點

- DeepSWE v1.1 從前代 LongCat-2.0 的 9.7% 跳到 64.6%（+54.9 個百分點），Terminal Bench v4.0 從 3.0% 跳到 38.5%，PaperBench 從 45.2% 跳到 82.1%——官方把這歸因於 agentic RL 的階段性跃變，不是訓練資料規模的漸進提升
- BrowseComp 91.9%，是整個比較集合（含 Claude Opus 5、GPT-5.6-Sol、DeepSeek-V4.1-Flash）裡最高分
- 視覺輸入直接折進同一個 1.6T MoE backbone：影像經殘差向量量化（RVQ）轉成離散 token，跟文字共用同一個 token 流與同一套目標函數，不需獨立的 vision encoder adapter，官方稱之為「visual coding」——讀截圖、UI、圖表後直接寫程式碼
- W4A4 量化（4-bit 權重與活化）讓 decode throughput 比 W8A8 基準提升 42.77%，支援在單卡記憶體小於 80GB 的國產 AI 加速器上訓練與推論

## Benchmark 表現

| Benchmark | 分數 | 前代 (LongCat-2.0) | 競品最強 |
|---|---|---|---|
| Terminal Bench v2.1 | 88.4 | 70.8 | DeepSeek-V4.1-Flash 90.6 |
| DeepSWE v1.1 | 64.6 | 9.7 | DeepSeek-V4.1-Flash 74.2 |
| PaperBench | 82.1 | 45.2 | GPT-5.6-Sol 83.3 |
| HLE（含工具） | 63.1 | 37.5 | Claude-Opus-5 64.7 |
| BrowseComp | 91.9 | 79.9 | DeepSeek-V4.1-Flash 91.5（LongCat-2.5 為全場最高） |

⚠️ LongCat-2.5／LongCat-2.0 的分數為官方自測；競品分數依官方揭露，部分取自公開技術報告或官方排行榜（標 `*`），部分為官方自行跑測、僅供參考（未標註來源的競品分數）。外部獨立複現尚未出現。

## 與前代/競品比較

跟 LongCat-2.0 比，最大進步集中在 agentic RL 任務上：DeepSWE v1.1、Terminal Bench v4.0、PaperBench 都是數倍甚至十倍以上的跳升，而不是個位數百分點的微調。官方的說法是「長橫跨度 agentic RL 在數據、環境、演算法、harness 四個軸同時 scale」帶來的階段性改變，而非單純加大訓練資料規模。

```diagram
title: LongCat-2.5 對 LongCat-2.0 的三項 agentic benchmark 跳升
desc: LongCat-2.5 在 DeepSWE v1.1、Terminal Bench v4.0、PaperBench 三項 agentic benchmark 上都比前代 LongCat-2.0 跳升數倍到十倍以上
caption: 資料來源：LongCat-2.5 Hugging Face 模型卡官方評測表（2026-11）。換算：基線 x=200，每 1 分 4 單位（x = 200 + 分數 × 4），橫軸從 0 起。
---
<svg viewBox="0 0 640 300">
  <text class="dg-small" x="20" y="20" dominant-baseline="central">分數（%）</text>

  <line class="dg-grid" x1="400" y1="50" x2="400" y2="280"/>
  <line class="dg-grid" x1="600" y1="50" x2="600" y2="280"/>
  <text class="dg-small" x="400" y="34" text-anchor="middle">50</text>
  <text class="dg-small" x="600" y="34" text-anchor="middle">100</text>
  <line class="dg-axis" x1="200" y1="50" x2="200" y2="280"/>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="200" y="56" width="39" height="24"/>
    <rect class="dg-bar dg-bar--soft" x="200" y="134" width="12" height="24"/>
    <rect class="dg-bar dg-bar--soft" x="200" y="212" width="181" height="24"/>
  </g>
  <g class="dg-c-accent">
    <rect class="dg-bar" x="200" y="86" width="258" height="24"/>
    <rect class="dg-bar" x="200" y="164" width="154" height="24"/>
    <rect class="dg-bar" x="200" y="242" width="328" height="24"/>
  </g>

  <text class="dg-sub" x="247" y="68" dominant-baseline="central">9.7 LongCat-2.0</text>
  <text class="dg-label dg-text--accent" x="466" y="98" dominant-baseline="central">64.6 LongCat-2.5</text>
  <text class="dg-sub" x="220" y="146" dominant-baseline="central">3.0</text>
  <text class="dg-label dg-text--accent" x="362" y="176" dominant-baseline="central">38.5</text>
  <text class="dg-sub" x="389" y="224" dominant-baseline="central">45.2</text>
  <text class="dg-label dg-text--accent" x="536" y="254" dominant-baseline="central">82.1</text>

  <text class="dg-label" x="192" y="83" text-anchor="end" dominant-baseline="central">DeepSWE v1.1</text>
  <text class="dg-label" x="192" y="161" text-anchor="end" dominant-baseline="central">Terminal Bench v4.0</text>
  <text class="dg-label" x="192" y="239" text-anchor="end" dominant-baseline="central">PaperBench</text>
</svg>
```

跟競品比，LongCat-2.5 在 BrowseComp（91.9%，全場最高）、AutomationBench 上領先，但在最難的 repo-scale 工程任務上仍輸 Claude Opus 5 不少：Terminal Bench v4.0 輸 15.4 分（38.5 對 53.9），NL2Repo 輸將近 15 分（60.5 對 75.3）。DeepSeek-V4.1-Flash 則在 DeepSWE v1.1 與 Terminal Bench v2.1 上贏過 LongCat-2.5。純視覺 benchmark 表現中等：VideoMME 85.2 輸 Kimi-K3 的 90.0。官方自己的結論是「全面能打、視覺程式碼有特色，但還不是最難工程任務的第一名」。

定價上 input $0.30／output $1.20（每 1M tokens，限時價），cached input 只要 $0.006，走的是跟 DeepSeek-V4.1-Flash 類似的中低價區間，明顯比 Claude Opus 5、GPT-5.6-Sol 便宜。API 相容 OpenAI 與 Anthropic 協議，可以直接接進 Claude Code、Codex、OpenCode 等既有 harness，對想低風險試用中國前沿模型的團隊是個切入點。

## 對 Agent 開發的意義

視覺理解折進同一個 token 流，代表 agent 可以在同一個推理迴圈裡讀 UI 截圖、圖表或渲染結果，然後直接動手修改程式碼——官方內部用小模型做的 t-SNE 示範顯示視覺和文字 embedding 確實交織在同一個語義空間，不是硬接起來的兩套系統。

- 如果你在做需要「看畫面再寫程式碼」的 agent（前端除錯、視覺驗收迴圈、截圖轉程式碼）：LongCat-2.5 省掉額外接 vision encoder adapter 的工程成本，可以直接用同一個模型跑完整迴圈
- 如果你在做長流程、產出要「看得到自己做完」的任務（3D 場景生成、互動式網頁、資料整併報告）：官方附的流體模擬、3D 展示、城市 diorama 等 demo 顯示這是刻意訓練方向，而不是附帶能力
- 不適合：repo 規模很大、步驟極度複雜的工程任務——這些場景 Terminal Bench v4.0、NL2Repo 都還是輸 Claude Opus 5 一截，現階段 Claude Opus 5 仍是更穩的選擇；也不適合要立刻自架開放權重的團隊做長期規劃依賴——官方公告當天明確說「沒有開放權重計畫」，一週後才反悔補發 MIT 權重，這個承諾本身就不穩定

## 今日收穫

之前以為「多模態折進 backbone」只是省一個 adapter 的工程選擇，但 LongCat-2.5 的 t-SNE 示範顯示視覺跟文字 embedding 真的落在同一個語義空間——這代表 agent 看螢幕跟讀文件用的是同一套推理，不是兩套系統拼接。另一個認知差：開放權重不是發布當天就能確定的承諾，LongCat-2.5 公告當天明確說「沒有開放權重計畫」，一週後卻補發 MIT 權重——追蹤開源模型動態時，發布當天的授權聲明不能直接當成最終答案。

## 參考資料

- [LongCat-2.5 官方技術部落格](https://longcat.ai/blog/longcat-2.5/)
- [LongCat-2.5 Hugging Face 模型卡與完整 benchmark 表](https://huggingface.co/meituan-longcat/LongCat-2.5)
- [Meituan LongCat 官方帳號宣布開放 MIT 權重](https://x.com/Meituan_LongCat/status/2119793531393040462)
- [LongCat-2.5 technical breakdown — LongCat AI](https://www.longcatai.org/news/longcat-2-5)
- [LongCat-2.5 benchmarks, pricing & context window — LLM Stats](https://llm-stats.com/models/longcat-2.5)
- [Meituan Releases LongCat 2.5 on Chinese Chips — Tech Times](https://www.techtimes.com/articles/329925/20261103/meituan-releases-longcat-25-chinese-chips-benchmark-claims-await-independent-tests.htm)
