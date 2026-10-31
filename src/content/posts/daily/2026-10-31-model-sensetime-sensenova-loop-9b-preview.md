---
title: "模型卡｜SenseNova Loop-9B-Preview"
date: 2026-10-31
category: daily
type: digest
tags: [ai-agent, model-release, daily, sensetime, model-family-sensenova]
lang: zh-TW
description: "商湯開源 SenseNova Loop-9B-Preview——用 Looped Transformer 架構讓同一組權重重複執行兩次，9B 參數在三項評測上打贏參數量三倍的 Qwen3.5-27B"
tldr: "SenseNova Loop-9B-Preview（`sensenova/SenseNova-Loop-9B-Preview`）：2026-10-30 商湯（SenseTime）開源，Apache 2.0；32 個獨立解碼器層中，第 4–27 層共享權重重複執行兩次（共 56 次層執行），搭配 two-stream mHC（Manifold-Constrained Hyper-Connections）管理兩條殘差流；訓練序列長度上限 262,144 tokens；官方消融實驗顯示單純加入 mHC 讓 GPQA Diamond +4.42 分、TeamBench +13.34 分；在 WorkBuddy Bench（66.9 vs 60.5）、AutomationBench（13.7 vs 10.2）、RaccoonPPT Bench（70.7 vs 59.1）三項評測上以 9B 參數超過參數量三倍的 Qwen3.5-27B，但在 Terminal Bench 2.1 與 T³-Banking 兩項落後；開源無官方 API，無定價"
series:
  name: "AI Model Tracker"
  order: 64
glossary:
  - term: "Looped Transformer"
    def: "讓解碼器裡同一組權重重複執行多次，在不增加儲存參數量的前提下加深模型有效運算深度的架構設計"
---

> 🌏 [English version](/posts/daily/2026-10-31-model-sensetime-sensenova-loop-9b-preview-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `sensenova/SenseNova-Loop-9B-Preview` |
| 廠商 | SenseTime（商湯） |
| 參數量 | ~9B 儲存參數；~14.6B 等效推理運算量（因循環區段的 24 層權重被重複執行兩次，56 次層執行只儲存 32 組權重） |
| Context Window | 262,144 tokens（官方文件標示的訓練階段最大序列長度，非正式對外公告的服務端上限） |
| Input 定價 (USD/1M tokens) | 未提供（僅開放權重，無官方託管 API） |
| Output 定價 (USD/1M tokens) | 未提供（同上） |
| 開源 | 是（Apache License 2.0） |
| 發布日 | 2026-10-30 |
| 官方公告 | [SenseTime on X](https://x.com/SenseTime_AI/status/2116151078219858346) |
| HuggingFace | [sensenova/SenseNova-Loop-9B-Preview](https://huggingface.co/sensenova/SenseNova-Loop-9B-Preview) |
| 家族 | SenseNova Loop（本站首篇，商湯「日日新」系列下的全新架構探索分支） |

## 能力亮點

- **循環解碼器（Looped decoder）**：輸入先過第 0–3 層，接著第 4–27 層這個區塊被套用兩次（`B(B(h))`），再經第 28–31 層與輸出頭產生結果——推理時做 56 次層運算，但只需要儲存 32 組解碼器層權重
- **Two-stream mHC（Manifold-Constrained Hyper-Connections）**：循環區段內用兩條殘差流搭配可學習的映射管理資訊流動，用 Sinkhorn normalization（20 次迭代）限制流混合矩陣；官方消融實驗顯示單獨加入 mHC 讓 GPQA Diamond 提升 4.42 分、TeamBench 提升 13.34 分
- **Hybrid attention**：每 4 層一組，3 個 linear attention 層接 1 個 full attention 層交錯排列，循環邊界對齊完整的 4 層組，兩次循環執行時注意力型態維持一致
- 以 9B 參數在 WorkBuddy Bench、AutomationBench、RaccoonPPT Bench 三項評測上超過參數量三倍的 Qwen3.5-27B（第三方帳號 TeksEdge 核實官方發布圖表數字後確認）

## Benchmark 表現

```diagram
title: SenseNova Loop-9B 以 9B 參數在三項評測上超過 Qwen3.5-27B
desc: 官方發布圖表顯示 SenseNova Loop-9B-Preview 在 WorkBuddy Bench、AutomationBench、RaccoonPPT Bench 三項評測上，分數都高於參數量三倍的 Qwen3.5-27B。
caption: 數字取自 SenseTime 官方發布圖表，經第三方 X 帳號 TeksEdge（@TeksEdge）核實截圖（2026-10-30）。Terminal Bench 2.1 與 T³-Banking 兩項官方圖表顯示 Loop-9B 落後 Qwen3.5-27B，原始分數未見公開逐字稿，故不列入本圖。換算：基線 y=300，繪圖區頂 y=60，網域 0–80 分，k=(300−60)÷80=3（每分 3 單位），長條頂 y=300−分數×3。
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">分數</text>
  <line class="dg-grid" x1="72" y1="240" x2="612" y2="240"/>
  <line class="dg-grid" x1="72" y1="180" x2="612" y2="180"/>
  <line class="dg-grid" x1="72" y1="120" x2="612" y2="120"/>
  <text class="dg-small" x="64" y="240" text-anchor="end" dominant-baseline="central">20</text>
  <text class="dg-small" x="64" y="180" text-anchor="end" dominant-baseline="central">40</text>
  <text class="dg-small" x="64" y="120" text-anchor="end" dominant-baseline="central">60</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <text class="dg-text--series" x="136" y="52" text-anchor="middle" dominant-baseline="central">Qwen3.5-27B</text>
  <text class="dg-text--series dg-text--accent" x="188" y="52" text-anchor="middle" dominant-baseline="central">Loop-9B</text>

  <rect class="dg-bar dg-c-s1" x="114" y="118" width="44" height="182"/>
  <rect class="dg-bar dg-c-accent" x="166" y="99" width="44" height="201"/>
  <rect class="dg-bar dg-c-s1" x="294" y="269" width="44" height="31"/>
  <rect class="dg-bar dg-c-accent" x="346" y="259" width="44" height="41"/>
  <rect class="dg-bar dg-c-s1" x="474" y="123" width="44" height="177"/>
  <rect class="dg-bar dg-c-accent" x="526" y="88" width="44" height="212"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="136" y="108" text-anchor="middle" dominant-baseline="central">60.5</text>
  <text class="dg-label dg-text--accent" x="188" y="89" text-anchor="middle" dominant-baseline="central">66.9</text>
  <text class="dg-sub" x="316" y="259" text-anchor="middle" dominant-baseline="central">10.2</text>
  <text class="dg-label dg-text--accent" x="368" y="249" text-anchor="middle" dominant-baseline="central">13.7</text>
  <text class="dg-sub" x="496" y="113" text-anchor="middle" dominant-baseline="central">59.1</text>
  <text class="dg-label dg-text--accent" x="548" y="78" text-anchor="middle" dominant-baseline="central">70.7</text>

  <text class="dg-sub" x="162" y="320" text-anchor="middle" dominant-baseline="central">WorkBuddy</text>
  <text class="dg-sub" x="342" y="320" text-anchor="middle" dominant-baseline="central">AutomationBench</text>
  <text class="dg-sub" x="522" y="320" text-anchor="middle" dominant-baseline="central">RaccoonPPT</text>
</svg>
```

| Benchmark | 分數 | 前代 | 競品最強（Qwen3.5-27B） |
|---|---|---|---|
| WorkBuddy Bench | 66.9 | 無（本系列首款公開版本） | 60.5 |
| AutomationBench | 13.7 | 無 | 10.2 |
| RaccoonPPT Bench | 70.7 | 無 | 59.1 |
| GPQA Diamond（加入 mHC 的消融增益） | +4.42 分 | 無 mHC 的對照版本 | — |
| TeamBench（加入 mHC 的消融增益） | +13.34 分 | 無 mHC 的對照版本 | — |

⚠️ 以上三項任務分數均為 SenseTime 官方發布圖表數字，經第三方 X 帳號 TeksEdge 核實截圖後轉錄，非官方逐字稿，也尚無獨立第三方復現。官方圖表另外列出 BIRD-Dev、AIDABench、Terminal Bench 2.1、T³-Banking 四項，其中 Terminal Bench 2.1 與 T³-Banking 官方圖表顯示 Loop-9B 落後 Qwen3.5-27B，但原始分數未見逐字稿公開，故不列入本表。

## 與前代/競品比較

SenseNova Loop 是商湯這個架構分支的首款公開版本，沒有嚴格意義上的「前代」可比；官方拿來對照的是同規模的 Qwen3.5-9B（第三方測試顯示 8 項官方圖表中贏 7 項、平 1 項）與刻意挑戰的 Qwen3.5-27B（參數量三倍）。

跟 Qwen3.5-27B 比，贏在辦公與自動化類任務（WorkBuddy、AutomationBench、RaccoonPPT 皆領先），但在 Terminal Bench 2.1（終端操作）與 T³-Banking（金融業務模擬）兩項落後。這個落差說明「循環計算深度」换來的推理能力增益不是均勻分布到所有任務類型——在需要嚴謹多步驟工具鏈執行、長交易序列推理的場景，目前仍不如直接堆參數的 27B 模型。

定價面沒有策略可比：Loop-9B 目前只開放權重，沒有官方 API 服務，跟 Gemini 4 Carbon、Kimi K3.1 Pro 這類同期公告的雲端模型走的是完全不同的商業模式——它賣的是「用更少儲存參數換取更深運算深度」的架構效率，不是價格競爭。

## 對 Agent 開發的意義

Looped Transformer 架構對 agent 開發最直接的意義是：用更深的運算路徑換取推理能力，但不需要增加模型的儲存體積——56 次層運算只佔用 32 組權重的顯存，這跟傳統「堆參數換智能」的路線不同。

- 如果你在消費級或邊緣 GPU（如 16GB RTX）上跑 agent：這類模型值得關注，因為它用 9B 規模的顯存成本，在辦公與自動化類任務上做到接近 27B 模型的效果，資源受限場景下的性價比更高
- 如果你在做需要多步驟工具鏈執行、長交易序列推理的場景（終端操作自動化、金融業務流程）：目前官方自己的圖表顯示 Loop-9B 在 Terminal Bench 2.1 與 T³-Banking 落後同系列的 27B 模型，不建議直接取代現有的工具鏈 agent
- 不適合：需要穩定公開 API、SLA 保證與現成定價的場景——目前只有開放權重，沒有官方託管服務，自架需要自行處理 LightLLM／SGLang 這類推理框架的客製化實作（`trust_remote_code=True` 載入自訂模型程式碼）

## 今日收穫

這篇點出一個跟「堆參數換智能」不同的方向：同一組權重重複執行,換取更深的有效運算路徑,而不是增加儲存參數量。對 agent 開發來說，這意味著「模型大小」與「推理深度」未来可能脫鉤，部署成本的算法會因此改變。但官方自己的消融圖表也顯示收益不是均勻分布——Terminal Bench、金融業務場景反而落後同系列的 27B 模型，說明「運算深度換智能」目前仍是針對性的優化，還不是能無差別套用的通解。

## 參考資料

- [SenseNova-Loop-9B-Preview 模型卡（Hugging Face）](https://huggingface.co/sensenova/SenseNova-Loop-9B-Preview)
- [OpenSenseNova/SenseNova-Loop GitHub 原始碼與 README](https://github.com/OpenSenseNova/SenseNova-Loop)
- [SenseTime on X：Introducing SenseNova Loop-9B-Preview](https://x.com/SenseTime_AI/status/2116151078219858346)
- [David Hendrickson（@TeksEdge）on X：SenseNova Loop-9B-Preview 第三方核實數字](https://x.com/TeksEdge/status/2116179128504480223)
- [商湯開源 SenseNova Loop-9B-Preview：探索以計算深度釋放模型潛力（新浪財經）](https://finance.sina.com.cn/roll/2026-10-30/doc-iniwziir8135422.shtml)
