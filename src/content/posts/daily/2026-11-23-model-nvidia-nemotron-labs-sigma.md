---
title: "模型卡｜NVIDIA Nemotron-Labs-Sigma"
date: 2026-11-23
category: daily
type: digest
tags: [ai-agent, model-release, daily, nvidia, model-family-nemotron]
lang: zh-TW
description: "NVIDIA 發布 Nemotron-Labs-Sigma——首個大規模連續擴散語言模型家族（3B／8B，14 個 checkpoint），把文字生成搬進 16 維連續空間，換來可控的少步蒸餾與自投機解碼加速"
tldr: "Nemotron-Labs-Sigma：2026-11-12 發布，3B／8B 兩尺寸共 14 個 checkpoint，NVIDIA Nemotron Open Model License 開源可商用；Base context 4,096 tokens、Instruct 8,192 tokens，無官方 API，需自架 CUDA GPU。8B 版 6 項任務平均 71.16，贏過前代離散擴散模型 NLD-8B 的 70.22；8 步少步蒸餾仍守住 70.34，自投機解碼在 NVIDIA GB200 上比純自回歸快 3.46 倍（峰值 4.20 倍）。賣點不是分數本身，而是連續空間讓擴散語言模型第一次能被穩定蒸餾與引導。"
series:
  name: "AI Model Tracker"
  order: 80
glossary:
  - term: "連續擴散語言模型"
    def: "在低維連續嵌入空間而非離散 token 類別空間做去噪生成的語言模型，相較傳統離散擴散模型（如 LLaDA、Dream）更容易做少步蒸餾與軌跡引導"
  - term: "NFE（Number of Function Evaluations）"
    def: "擴散模型生成一個區塊時呼叫去噪網路的次數；次數越少生成越快，但品質可能下降"
---

> :globe: [English version](/posts/daily/2026-11-23-model-nvidia-nemotron-labs-sigma-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `nvidia/Nemotron-Labs-Sigma-8B`（基礎）／`-8B-instruct`（指令，主要入口）／`-distill-8B-nfe{2,4,8,16}`（少步蒸餾）／`-distill-spec-8B`（自投機解碼）；3B 版本同上共 4 種變體，兩尺寸合計 14 個 checkpoint |
| 廠商 | NVIDIA（Nemotron Labs，與 Cornell、Georgia Institute of Technology 合作研究） |
| 參數量 | 3B／8B（Ministral 式 decoder-only backbone：分組查詢注意力、SwiGLU、旋轉位置編碼） |
| Context Window | Base 4,096 tokens；Instruct 8,192 tokens（皆含 prompt＋生成） |
| Input 定價 (USD/1M tokens) | 無官方 API——開源權重，需自架 |
| Output 定價 (USD/1M tokens) | 無官方 API——需 CUDA GPU（Ampere／Lovelace／Hopper／Blackwell），bfloat16，不支援 CPU 推論 |
| 開源 | 是（NVIDIA Nemotron Open Model License，可商用與非商用使用） |
| 發布日 | 2026-11-12 |
| 官方公告 | [arXiv:2610.02665 — Large Language Continuous Diffusion Models](https://arxiv.org/abs/2610.02665) |
| HuggingFace | [nvidia/Nemotron-Labs-Sigma（collection，14 個 checkpoint）](https://huggingface.co/collections/nvidia/nemotron-labs-sigma) |
| 家族 | Nemotron（NVIDIA 模型家族；前作 Nemotron Labs Dory 走自回歸＋推測解碼路線，Sigma 是家族首個連續擴散語言模型線，呼應更早的離散擴散前作 Nemotron-Labs-Diffusion／NLD） |

## 能力亮點

- 論文自稱「首個大規模（3B／8B）連續擴散語言模型家族」：在 16 維連續嵌入空間而非離散 token 類別空間做去噪，解決 LLaDA、Dream 等離散擴散模型因高維類別空間難以做軌跡引導的問題
- 區塊平行解碼（預設每區塊 64 tokens）＋標準 KV cache：已生成區塊直接快取重用，只有當前區塊需要反覆去噪，速度與品質可透過調整去噪步數（NFE）互換
- 少步蒸餾（distribution matching）在數學任務約 8 倍加速、程式碼任務約 4 倍加速，精度幾乎不掉；8 步蒸餾版 8B（`distill-8B-nfe8`）平均分仍守住 70.34，逼近 256 步教師模型
- 自投機解碼（diffusion head 起草一個 32-token 區塊、AR head 驗證）在 NVIDIA GB200＋SGLang 上比純自回歸解碼平均快 3.46 倍、峰值 4.20 倍（8B）／3.18 倍（3B），超過離散擴散前作 NLD-8B 的 3.04 倍

## Benchmark 表現

| 指標 | Sigma-8B（256-step DDPM） | 8 步蒸餾 Sigma-8B | 前代 NLD-8B（離散擴散） | AR 對照（Qwen3-8B） |
|---|---|---|---|---|
| 6 任務平均（GSM8K／Minerva／HumanEval／MBPP 等） | 71.16 | 70.34 | 70.22 | 68.91 |
| Instruct 版 6 任務平均 | 59.14 | — | 59.92 | — |
| GSM8K（Sigma-8B-instruct，256 DDPM，官方自測最佳值） | 91.96 | — | — | — |
| AIME25（Sigma-8B-instruct，同組最弱項） | 17.00 | — | — | — |
| 自投機解碼加速比（對比純 AR，GB200＋SGLang） | 3.46x（平均）／4.20x（峰值） | — | 3.04x | 1x（基準） |

:warning: 以上皆為 NVIDIA／論文作者團隊自測（第三方技術媒體 Marktechpost 彙整轉述同一批數字），截至發佈時尚無獨立第三方複測。32-token 區塊 DDIM 32 步、guidance 3、temperature 0.3 為官方推薦設定，不同取樣設定分數會變動。

## 與前代/競品比較

跟自己家族的前作比，Sigma 不是單純換個名字——運算空間整個換了：NLD（Nemotron-Labs-Diffusion）跟 LLaDA、Dream 一樣在離散 token 類別空間做去噪，Sigma 改成連續的 16 維嵌入空間，讓去噪軌跡變得平滑、可用梯度方式引導。基礎版的 6 任務平均分 71.16 小贏 NLD-8B 的 70.22，差距不大；但指令微調版反而小輸——Sigma-8B-instruct 的 59.14 不及 NLD-8B-instruct 的 59.92，說明「連續空間」在預訓練階段的優勢，到了指令微調階段還沒有完全轉換成分數上的領先，這是論文自己也沒有迴避的落差。

跟自回歸基線 Qwen3-8B（68.91）比，Sigma-8B 基礎版小贏近 2.3 分，但差距同樣有限——目前連續擴散的賣點不在「準確率碾壓自回歸」，而在結構性的加速空間：少步蒸餾（8 倍數學、4 倍程式碼）與自投機解碼（3.46 倍，優於 NLD 的 3.04 倍）這兩項，才是連續空間比離散空間多出來的額外紅利，因為平滑軌跡在低步數時退化得更溫和。

定價與商業策略這次不適用比較——這是研究用 checkpoint，NVIDIA 沒有提供託管 API，也還沒看到第三方推論平台上架；開源授權（NVIDIA Nemotron Open Model License）允許商用，但目前只支援自架 CUDA GPU（Ampere 以上），尚無量化版本。

## 對 Agent 開發的意義

這篇的重點不是「又一個新模型可以直接拿來用」，而是擴散語言模型的推理加速路線第一次在連續空間裡被系統性驗證：少步蒸餾與自投機解碼都是直接影響 agent loop 延遲與吞吐量的技術，而不是單純的準確率數字。

- 如果你在做高併發、延遲敏感的工具呼叫服務，且已經有自建 GPU 推論基礎設施：自投機解碼（diffusion head 起草＋AR head 驗證，輸出與貪婪 AR 解碼完全一致）值得追蹤，它用更少的前向傳遞次數換吞吐量，而不是犧牲正確性
- 如果你在研究或評估「平行解碼」這條路線本身（例如要決定要不要押注擴散 LLM 而非自回歸）：這篇論文提供了連續空間 vs 離散空間在相同任務集上的直接對照，是目前少數把兩種擴散路線放在同一張表上比較的公開資料
- 不適合：任何需要生產級部署的場景——4,096／8,192 tokens 的 context window 遠小於同期旗艦模型的百萬級 context，沒有官方 API，也沒有量化或 CPU 推論選項，現階段只適合有 GPU 叢集的研究團隊自行評估

## 今日收穫

連續擴散語言模型最有意思的地方，不是「擴散模型也能寫程式」，而是它把影像擴散模型早就在用的技巧——在連續空間裡做梯度引導、少步蒸餾——第一次系統性搬進文字生成。過去擴散 LLM 被視為自回歸的替代方案時，往往卡在離散 token 空間無法像影像像素一樣平滑插值；Sigma 證明把這個限制拿掉之後，少步蒸餾（8 倍加速）跟自投機解碼（3.46 倍）才真正跑得動，這代表擴散語言模型的效能天花板，很可能不在演算法本身，而在它選擇的表徵空間。

## 參考資料

- [arXiv:2610.02665 — Large Language Continuous Diffusion Models（NVIDIA／Cornell／Georgia Tech 官方論文）](https://arxiv.org/abs/2610.02665)
- [HuggingFace Collection：nvidia/Nemotron-Labs-Sigma（14 個 checkpoint）](https://huggingface.co/collections/nvidia/nemotron-labs-sigma)
- [HuggingFace 模型卡：nvidia/Nemotron-Labs-Sigma-8B（基礎版，架構與授權細節）](https://huggingface.co/nvidia/Nemotron-Labs-Sigma-8B)
- [HuggingFace 模型卡：nvidia/Nemotron-Labs-Sigma-8B-instruct（指令版，context window 8,192）](https://huggingface.co/nvidia/Nemotron-Labs-Sigma-8B-instruct)
- [Marktechpost：NVIDIA AI Releases Nemotron-Labs-Sigma, A Continuous Diffusion Language Model With 14 Checkpoints At 3B/8B（benchmark 數字彙整）](https://marktechpost.com/2026/11/20/nvidia-nemotron-labs-sigma-continuous-diffusion-language-model)

```diagram
title: 6 項任務平均分：連續擴散 vs 離散擴散 vs 自回歸
desc: Nemotron-Labs-Sigma-8B 基礎版 6 項任務平均分 71.16，小贏前代離散擴散模型 NLD-8B 的 70.22，也贏過自回歸基線 Qwen3-8B 的 68.91。
caption: 數字來自官方論文與 HuggingFace 模型卡（NVIDIA 自測，Marktechpost 彙整轉述），尚無獨立第三方複測。換算：基線 y=300，繪圖區頂 y=60，數值網域 60–75，k=240/15=16，y = 300 − (數值−60) × 16。
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">平均分</text>
  <line class="dg-grid" x1="72" y1="220" x2="612" y2="220"/>
  <line class="dg-grid" x1="72" y1="140" x2="612" y2="140"/>
  <text class="dg-small" x="64" y="220" text-anchor="end" dominant-baseline="central">65</text>
  <text class="dg-small" x="64" y="140" text-anchor="end" dominant-baseline="central">70</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">60</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="140" y="158.4" width="64" height="141.6"/>
    <rect class="dg-bar dg-bar--soft" x="480" y="140.0" width="64" height="160.0"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="310" y="141.4" width="64" height="158.6"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="172" y="148" text-anchor="middle" dominant-baseline="central">68.91</text>
  <text class="dg-label dg-text--accent" x="342" y="131" text-anchor="middle" dominant-baseline="central">71.16</text>
  <text class="dg-sub" x="512" y="130" text-anchor="middle" dominant-baseline="central">70.22</text>

  <text class="dg-sub" x="172" y="320" text-anchor="middle" dominant-baseline="central">Qwen3-8B（AR）</text>
  <text class="dg-label dg-text--accent" x="342" y="320" text-anchor="middle" dominant-baseline="central">Sigma-8B（連續擴散）</text>
  <text class="dg-sub" x="512" y="320" text-anchor="middle" dominant-baseline="central">NLD-8B（離散擴散）</text>
</svg>
```
