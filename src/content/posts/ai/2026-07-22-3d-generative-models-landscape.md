---
title: "3D 生成式模型走到哪了：從 Lyra 2.0 拆解 2026 年的技術地圖"
date: 2026-07-22
category: ai
type: deep-dive
tags:
  - 3d-generation
  - gaussian-splatting
  - video-diffusion
  - 3d-reconstruction
  - lyra
  - cvpr-2026
  - nerf
  - embodied-ai
lang: zh-TW
tldr: "2026 年 3D 生成的核心範式是「video diffusion → feed-forward 3D 重建」，Lyra 2.0 是這條線的代表作。但 CVPR 2026 的三篇 Best Paper 暗示下一波轉向：SAM 3D 帶來 foundation model 級別的物件重建、D4RT 用統一 transformer 數秒重建動態 4D、O-Voxel 用結構化 latent 取代 Gaussian。3DGS 仍是主流但正在被表面原語挑戰，pixel-space diffusion 正在反攻 latent-space。"
description: "從 NVIDIA 的 Lyra 2.0 出發，拆解 2025–2026 年 3D 生成式模型的技術地圖：generative reconstruction 統一範式、3DGS 的統治與挑戰者、feed-forward 取代 per-scene optimization、動態 4D 的崛起，以及 CVPR 2026 三篇 Best Paper 揭示的下一波方向。"
draft: false
---

最近在研究 3D 模型生成，從 NVIDIA 四月發的 [Lyra 2.0](https://arxiv.org/abs/2604.13036) 開始，一路往外拉了二十幾篇論文。這篇不是逐篇摘要，而是用整片地圖的視角回答一個問題：**2026 年中，如果你想從頭理解 3D 生成式模型，應該看什麼、跳過什麼、注意哪些轉折？**

先講結論：這個領域正在經歷一次範式收斂和一次即將到來的範式分裂。收斂是「video diffusion + feed-forward reconstruction」成為共識管線；分裂是 3DGS 的壟斷正在被表面原語和結構化 latent 挑戰，而 pixel-space diffusion 正在反攻 latent-space。

## 一、Lyra 2.0 在解什麼問題

Lyra 2.0 的任務是：給一張影像，讓使用者定義相機軌跡，生成一個可以自由探索的 3D 世界。這不是新想法——用 video diffusion model 生成 camera-controlled 影片，再用 3D 重建把影片 lift 成場景——Lyra 1.0 和 Gen3C 都做過。Lyra 2.0 要解的是把這件事「做大」時會撞到的兩堵牆：

**空間遺忘（Spatial Forgetting）**：相機走遠了，之前看過的區域掉出 temporal context window。回頭時模型只能從頭幻覺，結構就不連續了。Lyra 2.0 的做法是維護每幀的 3D 幾何，但只拿它來做資訊路由——檢索跟目標視角最相關的歷史幀、建立密集對應——外觀合成仍然交給生成模型。這個「幾何做路由、生成做外觀」的解耦是論文最重要的設計決定：之前的方法把重建出的 3D 直接當 conditioning 塞回去，結果生成瑕疵汙染 3D、汙染的 3D 又汙染下一輪生成，error amplification。

**時間漂移（Temporal Drifting）**：自迴歸生成天生會累積誤差。每一步的小瑕疵經過幾十步就變成嚴重的色偏和結構扭曲。Lyra 2.0 用 self-augmented histories 訓練——讓模型在訓練時就看到自己退化的輸出，學會修正而不是傳播。這是個聰明的做法：與其試圖讓模型不犯錯，不如讓它學會從錯誤中恢復。

最終產出是 3D Gaussian Splats + Surface Mesh，用的是改良版 Depth Anything v3 做 feed-forward 重建，再用 OpenVDB 做層級式 mesh 萃取。

## 二、2026 年的共識管線

Lyra 2.0 不是孤例。攤開 2025–2026 年的場景級 3D 生成論文，幾乎所有人都在同一條管線上工作：

```
單張影像 / 文字 → camera-controlled video diffusion → 多視角影片 → feed-forward 3D 重建 → 3DGS / Mesh
```

差異在於管線的每一段怎麼做：

| 論文 | 影片生成策略 | 一致性維護 | 3D 表示 |
|------|------------|-----------|---------|
| Lyra 1.0 (ICLR 2026) | Self-distillation，RGB decoder 監督 3DGS decoder | Latent space 內蒸餾 | 3DGS |
| Gen3R (CVPR 2026) | VGGT 做 geometry VAE，與 video diffusion 的 appearance latents 對齊 | 幾何 × 外觀 latent 聯合生成 | 點雲 + 深度 + 位姿 |
| WorldStereo (2026-03) | 兩種 geometric memory 模組注入 VDM | Global memory + stereo memory | 點雲 |
| GGS (ICCV 2025) | U-Net 內整合 3D Gaussian feature field | Feature space 而非 latent space | 3DGS |
| Rein3D (2026-04) | Panoramic video-to-video diffusion 修復 | 全景先驗 + 放射狀探索 | 3DGS |

這條管線成為共識有兩個原因。第一，video diffusion model 的訓練資料是網際網路影片，規模和多樣性遠超任何 3D 資料集，所以它隱含的 3D 先驗品質極高。第二，把生成和重建分開讓兩邊各自演進——video model 越來越好，重建模型也越來越好，管線自動受益。

Gen3R 的做法值得單獨提：它把重建模型 VGGT 改造成 geometry VAE，讓幾何 latent 和外觀 latent 在同一個空間裡聯合生成。這不只是「生成完影片再重建」，而是生成的過程本身就在產出 3D 幾何。CVPR 2026 收了它，代表社群認可「重建 × 生成融合」的方向。

## 三、Feed-Forward 的極致追求

這條管線的下游——從影片幀到 3D 表示——正在發生一場靜默的革命：**消滅 per-scene optimization**。

傳統 3DGS 和 NeRF 需要對每個場景做幾分鐘到幾小時的優化。Feed-forward 方法只要一次前向傳遞，直接吐出 3D。代表作：

- **Depth Anything v3**：per-pixel 預測 3DGS 屬性，Lyra 2.0 直接採用
- **AnySplat**：從不受約束的任意視角 feed-forward 預測 3DGS，不需已知相機參數
- **AnchorSplat** (CVPR 2026)：用 anchor-aligned Gaussian 取代 pixel-aligned，只用 1/20 的 Gaussian 數量就超越 AnySplat
- **tttLRM** (CVPR 2026 Highlight)：用 Test-Time Training layer 實現線性複雜度的長上下文自迴歸 3D 重建

最新的 **PRISM**（2026-06）更激進：它直接取消了 diffusion sampling。觀察到幾何前向 warp 已經能覆蓋大部分目標視角，只剩一小塊殘差需要編碼器修正。結果推理時間從分鐘級降到 36 秒，品質仍然 competitive。

這個趨勢的方向很清楚：**未來的 3D 生成是「一張圖進去、3D 出來、不到一分鐘」**。

## 四、3DGS 的統治與挑戰者

打開 2025–2026 年的 3D 論文，幾乎每一篇都用 3D Gaussian Splatting 作為最終表示。NeRF 基本上退場了——不是因為效果差，而是 3DGS 的即時渲染和顯式表示太適合下游應用。

但 3DGS 有一個根本問題：**它沒有表面**。Gaussian 是一團半透明的橢球，渲染起來很漂亮，但你拿不到一個乾淨的 mesh 丟進遊戲引擎或物理模擬器。Lyra 2.0 用 OpenVDB marching cubes 做後處理萃取 mesh，但這本質上是「先做出一堆橢球，再硬擠出一個表面」。

CVPR 2026 Best Paper **O-Voxel**（Native and Compact Structured Latents for 3D Generation）和最新的 **FLAT**（2026-06）代表了兩條不同的挑戰路線：

**O-Voxel** 提出結構化 latent 表示，在 latent space 就編碼了精確的幾何和表面屬性。生成出來的 3D 資產品質遠超 Gaussian-based 方法。這是從表示層面的根本改變。

**FLAT** 更直接：首次從 video diffusion latents 解碼出 triangle splats 而不是 Gaussian splats。Triangle 天然定義表面。論文解決了 triangle 預測的梯度流問題（ray-centered rotation 參數化 + product window function），再加上輕量 test-time 精煉就能產出完全不透明的 game-engine-ready 表示。

這意味著：**3DGS 可能是一個過渡性技術**。它是從 NeRF 到真正 production-ready 3D 表示的橋樑，但終點可能是直接生成 mesh 或表面原語。

## 五、Pixel-Space 的反攻

另一個值得注意的訊號是 **PixWorld**（2026-07，目前最新），它挑戰了 latent-space diffusion 的壟斷地位。

幾乎所有 2025–2026 的 3D 生成方法都在 latent space 工作——先用 VAE 壓縮影像，在 latent 上做 diffusion，再解碼回來。PixWorld 的論點是：latent encoding 本身就在丟失資訊，而且 diffusion 目標定義在 latent features 上而不是底層 3D 表示上，這兩件事都在傷害品質。

PixWorld 直接在 pixel space 做 diffusion，監督定義在渲染影像上，不需要 VAE/RAE。再加上一個 geometry perception loss——用預訓練 3D foundation model 的特徵空間提供 3D 結構監督。

結果：一致超越 latent-space 生成方法，並匹配 SOTA 重建方法。

這不見得代表 latent-space 的終結，但它打開了一個之前被忽視的方向。pixel-space 的代價是計算量更大，但如果品質的天花板更高，硬體終究會追上來。

## 六、CVPR 2026 Best Papers 揭示的下一波

CVPR 2026 從 16,000+ 投稿中選出的 3D 相關 Best Paper 值得認真看，因為它們暗示了社群認為什麼方向最重要：

**D4RT**（Google DeepMind / Oxford）—— 統一 transformer 架構，數秒內從影片重建動態 4D 場景的完整幾何。輕量、可擴展。這篇獲 Best Paper 的訊號是：**4D 動態場景不再是 3D 的附屬品，而是獨立的一等公民**。

**SAM 3D**（Meta）—— 1.2B 參數的 Flow Transformer + MoT 架構，從單張自然影像預測每個物件的幾何、紋理和空間佈局，組成完整 3D 場景。搭配 human-in-the-loop 後訓練資料引擎和 DPO 偏好對齊，人類偏好測試 5:1 勝率。開源。這篇的訊號是：**3D 重建/生成正進入 foundation model 時代，post-training alignment 成為標配**。

**O-Voxel**（清華 / Microsoft Research）—— 結構化 latent 的 native 3D 生成。訊號同上一節：**表示本身比方法更重要**。

三篇分別指向：4D、foundation model、表示革新。如果要下注 2027 年的方向，這三個比「更好的 video diffusion」更值得關注。

## 七、一張給研究者的閱讀地圖

按照依賴關係和重要性排列的建議閱讀順序：

**必讀（理解基礎範式）：**
1. **Lyra 1.0** — self-distillation 框架，video diffusion → 3DGS 的起點
2. **Lyra 2.0** — 長序列一致性的 anti-forgetting / anti-drifting
3. **Gen3R** — 重建 × 生成融合，CVPR 2026

**重點（掌握當前 SOTA）：**
4. **SAM 3D** — 物件級 foundation model，CVPR 2026 Best Paper
5. **D4RT** — 動態 4D 重建，CVPR 2026 Best Paper
6. **AnchorSplat** — feed-forward 重建的效率極限

**前沿（理解下一波方向）：**
7. **FLAT** — triangle splats 取代 Gaussian
8. **PixWorld** — pixel-space 對 latent-space 的挑戰
9. **PRISM** — 去除 diffusion sampling，36 秒推理

**視興趣選讀：**
- Diff4Splat / ActionMesh — 動態 4D 生成（如果對遊戲或動畫有興趣）
- Rein3D — 室內場景（如果做 VR/AR）
- SAGE — Embodied AI 環境生成（如果做機器人）
- TIGON — 文字 + 影像雙模態 3D 生成

## 往哪走

3D 生成正處於一個有趣的時間點：基礎管線已經收斂（video diffusion + feed-forward reconstruction），但下一層的表示和訓練範式還沒定型。3DGS 可能只是過渡技術；latent-space 可能不是唯一選擇；foundation model + post-training alignment 正從 NLP 和 2D 視覺蔓延到 3D。

如果是做應用的——遊戲、VR/AR、機器人訓練環境——現在就可以用 Lyra 2.0 或 SAM 3D 級別的工具開始。如果是做研究的，表示層面的革新（FLAT、O-Voxel）和 pixel-space 路線（PixWorld）可能比在 latent-space 3DGS 上繼續調參更有長期價值。

動態 4D 是確定性最高的下一個爆發點。D4RT 拿了 Best Paper 不是偶然——靜態 3D 的品質已經「夠用」了，真正的缺口在動態。

## 參考資料

- [Lyra 2.0: Explorable Generative 3D Worlds](https://arxiv.org/abs/2604.13036) — Tianchang Shen, Xuanchi Ren 等, NVIDIA, 2026-04
- [Lyra: Generative 3D Scene Reconstruction via Video Diffusion Model Self-Distillation](https://arxiv.org/abs/2509.19296) — Sherwin Bahmani 等, NVIDIA, ICLR 2026
- [Gen3R: 3D Scene Generation Meets Feed-Forward Reconstruction](https://arxiv.org/abs/2601.04090) — Jiaxin Huang 等, CVPR 2026
- [D4RT: Efficiently Reconstructing Dynamic Scenes One D4RT at a Time](https://cvpr.thecvf.com/Conferences/2026/News/Best_Papers) — Chuhan Zhang 等, Google DeepMind / Oxford, CVPR 2026 Best Paper
- [SAM 3D: 3Dfy Anything in Images](https://ai.meta.com/sam3d) — Xingyu Chen 等, Meta, CVPR 2026 Best Paper
- [Native and Compact Structured Latents for 3D Generation (O-Voxel)](https://cvpr.thecvf.com/Conferences/2026/News/Best_Papers) — Jianfeng Xiang 等, 清華 / Microsoft Research, CVPR 2026 Best Paper
- [PixWorld: Unifying 3D Scene Generation and Reconstruction in Pixel Space](https://arxiv.org/abs/2607.05373) — arXiv 2026-07
- [FLAT: Feedforward Latent Triangle Splatting](https://arxiv.org/abs/2606.24876) — arXiv 2026-06
- [PRISM: Feed-Forward Single-Image 3D Reconstruction via Geometric Warp-Residual Modeling](https://arxiv.org/abs/2606.25430) — arXiv 2026-06
- [WorldStereo: Bridging Camera-Guided Video Generation and Scene Reconstruction](https://arxiv.org/abs/2603.02049) — arXiv 2026-03
- [Rein3D: Reinforced 3D Indoor Scene Generation](https://arxiv.org/abs/2604.10578) — arXiv 2026-04
- [Generative Gaussian Splatting (GGS)](https://arxiv.org/abs/2503.13272) — Katja Schwarz 等, Meta, ICCV 2025
- [Diff4Splat: Controllable 4D Scene Generation](https://arxiv.org/abs/2511.00503) — CVPR 2026
- [Uni3R: Unified 3D Reconstruction and Semantic Understanding](https://openaccess.thecvf.com/content/CVPR2026/papers/Sun_Uni3R_Unified_3D_Reconstruction_and_Semantic_Understanding_via_Generalizable_Gaussian_CVPR_2026_paper.pdf) — CVPR 2026
- [AnchorSplat: Feed-Forward 3D Gaussian Splatting with 3D Geometric Priors](https://openaccess.thecvf.com/content/CVPR2026/papers/Zhang_AnchorSplat_Feed-Forward_3D_Gaussian_Splatting_With_3D_Geometric_Priors_CVPR_2026_paper.pdf) — CVPR 2026
- [tttLRM: Test-Time Training for Long Context and Autoregressive 3D Reconstruction](https://cvpr.thecvf.com/virtual/2026/events/Highlights2026) — CVPR 2026 Highlight
- [VidSplat: Gaussian Splatting Reconstruction with Geometry-Guided Video Diffusion Priors](https://arxiv.org/abs/2605.11424) — arXiv 2026-05
- [TIGON: Text-Image Conditioned 3D Generation](https://openaccess.thecvf.com/content/CVPR2026/papers/Cen_Text-Image_Conditioned_3D_Generation_CVPR_2026_paper.pdf) — CVPR 2026
- [SAGE: Scalable Agentic 3D Scene Generation for Embodied AI](https://openaccess.thecvf.com/content/CVPR2026/papers/Xia_SAGE_Scalable_Agentic_3D_Scene_Generation_for_Embodied_AI_CVPR_2026_paper.pdf) — CVPR 2026
- [ActionMesh: Animated 3D Mesh Generation with Temporal 3D Diffusion](https://cvpr.thecvf.com/virtual/2026/events/Highlights2026) — CVPR 2026
