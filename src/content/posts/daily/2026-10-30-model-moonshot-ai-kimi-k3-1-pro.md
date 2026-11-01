---
title: "模型卡｜Kimi K3.1 Pro"
date: 2026-10-30
category: daily
type: digest
tags: [ai-agent, model-release, daily, moonshot-ai, model-family-kimi]
lang: zh-TW
description: "Moonshot AI 發布 Kimi K3.1 Pro——2.8T MoE 開源模型定價砍三分之一，Terminal-Bench 4.0 獨立測試衝上 67% 追平頂級閉源模型"
tldr: "Kimi K3.1 Pro：2026-10-23 發布，2.8T 總參數／104B 啟用 MoE、1M context window、input $2.00／output $10.00（USD/1M tokens，比前代 K3 降 33%）；Terminal-Bench 4.0 獨立測試 67%（前代僅 13%），Artificial Analysis Intelligence Index 55.1 分排名全球第四；weights 尚未公開，官方承諾 2026-11-04 前開源，屆時預估將是分數最高的開源模型"
series:
  name: "AI Model Tracker"
  order: 63
glossary:
  - term: "Kimi"
    def: "Moonshot AI 推出的對話與 agent 模型家族，K3.1 Pro 為 K3 的後訓練旗艦版本"
---

> 🌏 [English version](/posts/daily/2026-10-30-model-moonshot-ai-kimi-k3-1-pro-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `kimi-k3.1-pro`（Highspeed 版為 `kimi-k3.1-pro-highspeed`）|
| 廠商 | Moonshot AI |
| 參數量 | 2.8T 總參數／104B 啟用（Mixture-of-Experts）|
| Context Window | 1,048,576 tokens（1M） |
| Input 定價 (USD/1M tokens) | $2.00 |
| Output 定價 (USD/1M tokens) | $10.00 |
| 開源 | 是（weights 尚未發布，官方承諾 2026-11-04 前開放；授權條款尚未公布，前代 K3 使用自訂 Kimi K3 License）|
| 發布日 | 2026-10-23（美國時間）／2026-10-24（中國時間） |
| 官方公告 | [Kimi Blog：Kimi K3.1 Pro Tech Blog](https://www.kimi.ai/blog/kimi-k3-1-pro) |
| HuggingFace | 尚未上架（weights 未發布，暫無連結） |
| 家族 | Kimi K3.x（K3 的後訓練版本，K3.1 系列首作） |

## 能力亮點

- Terminal-Bench 4.0 成績大幅跳升：Moonshot 自測 65.7%（略輸 Claude Opus 5.5 的 66.4%，但贏過 GPT-6 Astra 的 58.2%），第三方 Artificial Analysis 獨立測得 67%——是 AA 測過的所有模型裡最高分，比前代 K3 的 13% 跳了 54 個百分點
- Artificial Analysis Intelligence Index v4.3.2 拿下全球第四（55.1 分），只落後 Claude Opus 5.5（57.6）、Claude Sonnet 5.5（56.0）、Meta Muse Wonder Full（55.8），比 K3 自己的 43.6 分進步 11.5 分
- 定價砍三分之一：input／output 從 K3 的 $3.00／$15.00 降到 $2.00／$10.00（每 1M tokens），但 AA 測出 K3.1 Pro 平均每個任務多用 14% 輸出 token，實際每任務成本接近持平
- 開源前主動移除網路攻擊訓練資料：在 xdev-bench-hard 弱點挖掘測試上，保留攻擊資料的內部 checkpoint 可解 90.5%（pass@3），正式開源版刻意壓到 81.0%，是少見「主動調降特定能力後才開源」的案例

## Benchmark 表現

| Benchmark | 分數 | 前代 (K3) | 競品最強 |
|---|---|---|---|
| Terminal-Bench 4.0（Artificial Analysis 獨立測試） | 67% | 13% | Claude Sonnet 5.5 64% |
| Terminal-Bench 4.0（Moonshot 自測，Claude Code harness） | 65.7% | 未列出 | Claude Opus 5.5 66.4% |
| Artificial Analysis Intelligence Index v4.3.2 | 55.1（第四） | 43.6 | Claude Opus 5.5 57.6 |
| GDPval-AA（Elo，AA 獨立測試） | 1,846（第三） | 1,534 | Claude Opus 5.5 1,866 |
| BenchCAD with tools（Moonshot 自測） | 92.7% | 未列出 | Claude Opus 5.5 96.2%、GPT-6 Astra 95.9% |

⚠️ Terminal-Bench 4.0（Moonshot 自測版）、BenchCAD、OfficeQA Pro v2、xdev-bench-hard 均為 Moonshot 官方自測，尚無第三方獨立複現；Terminal-Bench 4.0（獨立版）、Intelligence Index、GDPval-AA 為 Artificial Analysis 第三方平台獨立測得。兩家對同一題 Terminal-Bench 4.0 給出不同分數（67% vs 65.7%），測試 harness 與設定不同，結果不能直接相加比較。

```diagram
title: Kimi K3.1 Pro 在 Intelligence Index 上追到只差 Claude Opus 5.5 2.5 分
desc: K3.1 Pro 55.1 分比前代 K3 的 43.6 分進步 11.5 分，逼近 Claude Sonnet 5.5（56.0）與 Claude Opus 5.5（57.6），差距收斂到個位數。
caption: 資料來源：Artificial Analysis Intelligence Index v4.3.2（felloai.com 整理，2026-10-23 查證）。換算：基線 y=300，繪圖區頂 y=60，網域 0–60 分，k=(300−60)÷60=4（每分 4 單位），長條頂 y=300−分數×4。
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">分</text>
  <line class="dg-grid" x1="72" y1="140" x2="612" y2="140"/>
  <line class="dg-grid" x1="72" y1="220" x2="612" y2="220"/>
  <text class="dg-small" x="64" y="140" text-anchor="end" dominant-baseline="central">40</text>
  <text class="dg-small" x="64" y="220" text-anchor="end" dominant-baseline="central">20</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="107.5" y="125.6" width="64" height="174.4"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="242.5" y="79.6" width="64" height="220.4"/>
  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="377.5" y="76" width="64" height="224"/>
    <rect class="dg-bar dg-bar--soft" x="512.5" y="69.6" width="64" height="230.4"/>
  </g>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="139.5" y="115.6" text-anchor="middle" dominant-baseline="central">43.6</text>
  <text class="dg-label dg-text--accent" x="274.5" y="69.6" text-anchor="middle" dominant-baseline="central">55.1</text>
  <text class="dg-sub" x="409.5" y="66" text-anchor="middle" dominant-baseline="central">56.0</text>
  <text class="dg-sub" x="544.5" y="59.6" text-anchor="middle" dominant-baseline="central">57.6</text>

  <text class="dg-sub" x="139.5" y="320" text-anchor="middle" dominant-baseline="central">Kimi K3</text>
  <text class="dg-label dg-text--accent" x="274.5" y="320" text-anchor="middle" dominant-baseline="central">K3.1 Pro</text>
  <text class="dg-sub" x="409.5" y="320" text-anchor="middle" dominant-baseline="central">Sonnet 5.5</text>
  <text class="dg-sub" x="544.5" y="320" text-anchor="middle" dominant-baseline="central">Opus 5.5</text>
</svg>
```

## 與前代/競品比較

跟 K3 比，最大進步集中在 agentic coding 與長任務執行：Terminal-Bench 4.0 從 K3 的 13% 跳到 67%（AA 獨立測試），GDPval-AA 的 Elo 分數也漲了 312 分。Moonshot 官方把這歸功於「後訓練階段投入遠超過 K3 的 RL 運算量，橫跨數百個下游領域」，而不是換了新架構——K3.1 Pro 骨幹跟 K3 完全相同，一樣是 2.8T 總參數／104B 啟用的 MoE。

跟競品比，K3.1 Pro 在 Intelligence Index 上只落後 Claude Opus 5.5 2.5 分，排名全球第四；一旦 11 月 4 日前 weights 真的公開，Artificial Analysis 估算它會成為目前分數最高的開源模型，把開源與閉源旗艦的差距從 12 分收斂到 3 分。但官方自己的 BenchCAD 測試顯示 K3.1 Pro 在 3D 建模能力上仍落後 Claude Opus 5.5（92.7% vs 96.2%）與 GPT-6 Astra（95.9%），不是全面碾壓。

定價策略上，K3.1 Pro 把 input／output 價格各砍 33%（$3/$15 → $2/$10），表面上是降價，但 AA 測出它平均每個任務用的輸出 token 比 K3 多 14%，實際每個任務的花費幾乎沒變——這代表 Moonshot 選擇用「同樣的錢換更強的模型」而非單純降價搶市占。

## 對 Agent 開發的意義

weights 要等 11 月 4 日才公開，現在能做的只有先用 API 版本驗證效果，還沒辦法自己架起來跑。

- 如果你在做需要自架、資料不能出境、或要客製微調的 coding agent：先用 `kimi-k3.1-pro` API 版本跑你自己的測試集，確認效果後等 11/4 weights 公開再決定是否自架——AA 預估公開後它會是目前分數最高的開源模型
- 如果你在做長任務執行（long-horizon）的 agent：官方案例顯示 K3.1 Pro 能在 167 次任務、420 次獨立檢查的迴圈裡自己發現並修正 36 處物理模擬的計算錯誤，顯示它在「跑很久、自己除錯」這類場景上有實測案例可參考，不只是 benchmark 數字
- 如果你在比較開源旗艦模型的性價比：定價降了三分之一，但實際每任務成本因為輸出 token 變多幾乎打平，選型時別只看牌價，要用自己的任務實測總花費
- 不適合：需要頂級資安紅隊／漏洞利用能力的場景——Moonshot 在開源前刻意移除相關訓練資料，把 xdev-bench-hard 分數從可達到的 90.5% 壓到 81.0%，官方明確表示這是設計選擇而非能力上限

## 今日收穫

過去看「開源 vs 閉源」常常是二元選擇——要嘛全部能力都給、要嘛全部不給。Kimi K3.1 Pro 的作法是先量化出「移除攻擊資料前後的能力差」（90.5% vs 81.0%），再決定開源哪個版本，等於把「要開放多少能力」變成一個可以分段調整的旋鈕，而不是單純的是非題。

## 參考資料

- [Kimi Blog：Kimi K3.1 Pro Tech Blog](https://www.kimi.ai/blog/kimi-k3-1-pro)
- [felloai.com：Kimi K3.1 Pro: Moonshot's Cheaper, Stronger K3, Explained](https://felloai.com/kimi-k3-1/)
- [Unite.AI：Moonshot AI Releases Kimi K3.1 Pro, First Model in New K3.1 Series](https://www.unite.ai/moonshot-ai-releases-kimi-k3-1-pro-first-model-in-new-k3-1-series/)
- [innfactory.ai：Moonshot Kimi K3.1 Pro: Pricing, Licence, GDPR](https://innfactory.ai/en/ai-models/moonshot-kimi/)
