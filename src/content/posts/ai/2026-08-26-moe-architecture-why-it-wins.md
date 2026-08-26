---
title: "MoE 為什麼贏：從 Ornith 到 MiniMax，2026 年前沿模型都在用的架構"
date: 2026-08-26
category: ai
type: deep-dive
tags: [moe, architecture, inference, code-model, open-source, benchmark, deployment]
lang: zh-TW
series:
  name: "認識 AI 模型"
  order: 9
tldr: "2026 年幾乎所有前沿開源模型都是 MoE 架構：Ornith 35B 只啟用 3B 打贏 31B dense、MiniMax M3 用 456B 總量但 45.9B 啟用拿下 SWE-bench Pro 59%、DeepSeek V4 用 1.6T 總量但 49B 啟用。這篇用四個案例解釋 MoE 為什麼在 coding 和 agentic 任務上佔據主流。"
description: "MoE 架構深入介紹：稀疏啟用原理、推論成本與品質的取捨、Ornith / MiniMax / DeepSeek / Qwen 四個案例拆解，以及 dense vs MoE 的實際選擇指南。"
draft: false
glossary:
  - term: "MoE"
    def: "Mixture of Experts，混合專家架構——模型有多組參數但每次只啟用一部分，兼顧能力和效率"
  - term: "Gating Network"
    def: "門控網路，MoE 架構中負責決定每個 token 要送到哪些 expert 處理的路由機制"
  - term: "Expert"
    def: "MoE 中的一組 FFN 參數。每個 expert 可以理解為一個「專家子網路」，模型會根據輸入選擇性地啟用其中幾個"
---

> 🌏 [English version](/en/posts/ai/2026-08-26-moe-architecture-why-it-wins-en)

2026 年的前沿開源模型有一個共同點：幾乎都是 MoE。[Ornith 1.5-35B-A3B](/posts/tech/2026-08-26-ornith-deepreinforce-model-family) 用 3B 啟用量打贏 31B dense 模型、[MiniMax M3](/posts/tech/2026-08-26-minimax-model-family) 用 456B 總量但只啟用 45.9B、DeepSeek V4 Pro 是 1.6T 總量但 49B 啟用、Qwen3.8 最大版本是 2.4T 總量但 95B 啟用。依 [DeepInfra 的分析](https://deepinfra.com/blog/mixture-of-experts-llm-economics-price-drop)，MoE 已經「從研究好奇心變成前沿模型的主流架構」。這篇用實際案例拆解 MoE 為什麼贏、什麼時候不該用。

## MoE 是什麼

傳統 dense 模型（如 Llama、Gemma）的每一層都是一個大型前饋網路（FFN），每個 token 都要經過所有參數。MoE 把這個 FFN 拆成多個「expert」——各自是一組獨立的參數——再加一個 gating network（門控網路）決定每個 token 要送到哪幾個 expert。

```
Token → Gating Network → 選出 top-k experts → 只跑這 k 個 → 合併輸出
```

關鍵在「只跑這 k 個」。如果一個模型有 256 個 expert 但每次只啟用 8 個，那每個 token 的實際計算量只有 8/256 = 3.1% 的總參數。模型可以「知道很多」——總參數量代表它能儲存的知識和推理策略——但不用每次推論都付全部的計算成本。

依 Google [GLaM 研究](https://arxiv.org/abs/2112.06905)的結果，一個 1.2 兆參數的 MoE（64 個 expert 啟用）在零樣本任務上超越了 175B 的 dense 模型，同時推論 FLOP 只有一半。

## 四個案例：MoE 怎麼贏

### Ornith 1.5-35B-A3B：3B 啟用打贏 31B Dense

[Ornith](/posts/tech/2026-08-26-ornith-deepreinforce-model-family) 的 35B-A3B 是最極端的效率案例。總參數 35B、每 token 啟用約 3B，但在 [SWE-bench Verified 拿到 79.0](https://ornith.ai/ornith_1_5.html)——同量級唯一破 79 的模型，甚至超越 11 倍大的 Qwen3.5-397B（76.4）。

更驚人的對比是 Gemma 4-31B（dense，31B 全啟用）：SWE-bench Verified 只有 52.0。Ornith 用 3B 的推論成本做到 79 分，Gemma 用 31B 的推論成本做到 52 分。

這不是 MoE 本身的魔法——Ornith 的 self-improvement RL 訓練方法功不可沒——但 MoE 提供了讓這種效率差異成為可能的架構基礎。

### MiniMax M3：MSA + MoE 做到 1M Context

[MiniMax M3](/posts/tech/2026-08-26-minimax-model-family) 是 456B 總量、45.9B 啟用的 MoE。它的技術亮點不只是 MoE，還有自研的 MiniMax Sparse Attention（MSA）——用 KV-block 選擇取代全注意力，讓長上下文推論成本降到約 1/20。

M3 在 [SWE-bench Pro 拿到 59.0%](https://www.mindstudio.ai/blog/ornith-1-5-35b-a3b-benchmarks)，是首個在此 benchmark 突破 59% 的開源權重模型。MoE + 稀疏注意力的組合讓 1M context window 在推論成本上變得可行。

### DeepSeek V4：Fine-Grained MoE 的極致

DeepSeek V4 Pro 是 1.6T 總參數、49B 啟用。DeepSeek 的 MoE 特色是 fine-grained expert——把 expert 切得更細，搭配 shared expert（每個 token 都會經過的基底 expert）加上 routed expert（按 token 選擇性啟用）。依 [DeepSeek V4 技術報告](https://arxiv.org/abs/2606.19348)，routed expert 使用 FP4 精度進一步壓縮記憶體。

V4-Flash 更極端：284B 總量、13B 啟用。這就是 DeepSeek 能把 API 定價壓到 $1.98/M output tokens 的原因——每個 token 只跑 13B 的計算量。

### Qwen3.8：從 0.6B 到 2.4T 的全譜系

Qwen3.8 家族同時提供 dense 和 MoE 版本：小模型（0.6B、1.7B、4B、8B、32B）用 dense，旗艦（235B-A22B、2.4T-A95B）用 MoE。這個雙軌策略反映了一個實際判斷：**小模型用 dense 更簡單，大模型不用 MoE 就跑不起來**。

2.4T-A95B 的配置是 2.4 兆總參數、95B 啟用——如果做成 dense，推論一個 token 就要跑 2.4T 的計算量，不論算力還是記憶體都不實際。MoE 讓「兆級參數」從理論變成可部署。

## MoE 的代價

MoE 不是免費的午餐。

### 記憶體：全部都要載入

MoE 省的是計算（FLOP），不是記憶體。一個 35B MoE 模型每 token 只啟用 3B，但推論時 35B 的權重全部要載入 GPU 記憶體。這意味著：

- **Ornith 35B-A3B** 的推論速度接近 3B 模型，但 VRAM 需求接近 35B 模型
- **DeepSeek V4 Pro**（1.6T）需要多張高階 GPU 才能跑，即使每 token 只啟用 49B

社群的應對方式是 expert offloading——把不常用的 expert 放到 CPU 記憶體或硬碟，只在需要時載入 GPU。但這會增加延遲。

### Expert 負載均衡

如果 gating network 總是把 token 送到同樣幾個 expert，其他 expert 等於浪費。訓練時需要加入 load balancing loss 確保每個 expert 被均勻使用。DeepSeek 的 shared expert 設計部分解決了這個問題——基底知識放在共用 expert，專業知識放在路由 expert。

### 批次推論的效率反轉

依 [DeepInfra 分析](https://deepinfra.com/blog/mixture-of-experts-llm-economics-price-drop)：MoE 的效率優勢在低到中等批次大小最明顯。在極大批次（數千個並行請求）時，MoE 的路由開銷和記憶體存取模式反而可能比 dense 更慢——因為不同請求的 token 被路由到不同 expert，破壞了 GPU 的批次計算效率。

## Dense vs MoE：什麼時候選哪個

| 場景 | 建議 | 原因 |
|---|---|---|
| 手機 / 邊緣裝置 | Dense（9B 以下） | 記憶體受限，MoE 的總參數佔用太大 |
| 單張消費級 GPU | 看情況 | 量化後的 35B MoE 可以塞進 12GB，但 expert offloading 會慢 |
| 多 GPU 伺服器 | MoE | 記憶體充裕時，MoE 的推論速度和品質同時贏 |
| 高吞吐 API 服務 | MoE（但要小心） | 低延遲贏，但極大批次要工程調校 |

## 為什麼 2026 年所有前沿模型都是 MoE

一句話：**在 dense 架構下，增加能力就必須增加每個 token 的計算成本；MoE 可以增加能力（加 expert）而不增加每個 token 的計算成本。**

這個特性在 2026 年變得關鍵，因為模型競爭已經進入「兆級參數」時代。Dense 模型在百 B 級別就遇到推論成本天花板——沒有人付得起每個 token 跑 1T 參數的帳單。MoE 讓前沿模型可以繼續擴大參數（儲存更多知識），同時把每個 token 的成本控制在使用者能接受的範圍。

這也是為什麼 Ornith、MiniMax、DeepSeek、Qwen 這些「黑馬」能在 coding benchmark 上追平甚至超越閉源模型——MoE 讓小團隊用合理的推論成本部署出有競爭力的模型。

## 參考資料

- [How Mixture of Experts Models Changed LLM Economics — DeepInfra](https://deepinfra.com/blog/mixture-of-experts-llm-economics-price-drop)
- [GLaM: Efficient Scaling of Language Models with Mixture-of-Experts — Google (arXiv:2112.06905)](https://arxiv.org/abs/2112.06905)
- [DeepSeek-V4 技術報告 (arXiv:2606.19348)](https://arxiv.org/abs/2606.19348)
- [Mixture-of-Experts (MoE) LLMs — Cameron R. Wolfe](https://cameronrwolfe.substack.com/p/moe-llms)
- [Ornith 1.5 官方技術報告](https://ornith.ai/ornith_1_5.html)
- [Ornith：小團隊用自我改進 RL 做出的開源 Coding 黑馬](/posts/tech/2026-08-26-ornith-deepreinforce-model-family) — 站內
- [MiniMax：聊天機器人公司做出的 Coding 模型，性價比碾壓閉源](/posts/tech/2026-08-26-minimax-model-family) — 站內
