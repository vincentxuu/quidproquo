---
title: "2022 AI 頂會導讀：電腦視覺篇"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, cvpr, eccv, computer-vision, "2022", text-to-image, nerf, latent-diffusion]
lang: zh-TW
tldr: "2022 年是 CV 從「辨識」走向「生成」的轉折點——Latent Diffusion Models 在 CVPR 發表後催生了 Stable Diffusion，NeRF 從 2021 年的 25 篇暴增到 CVPR 單場超過 50 篇，ConvNeXt 替 CNN 打了一場漂亮的反擊戰，而 ECCV 則在 Tel Aviv 交出了 157 篇 Oral 的歷史最高紀錄。"
description: "2022 年 CVPR 與 ECCV 兩場頂級電腦視覺會議的得獎論文、高影響力研究、三條主要趨勢（文生圖從研究到產品、NeRF 爆發性擴張、CNN vs Transformer 的反擊與融合），以及投稿量成長帶來的審稿壓力。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 12
glossary:
  - term: "Latent Diffusion Model (LDM)"
    definition: "在壓縮後的潛空間而非原始像素空間執行擴散去噪過程的生成模型，大幅降低計算成本。Stable Diffusion 的核心架構。"
    context: "CVPR 2022 發表，後來成為 Stable Diffusion 的基礎。"
  - term: "NeRF (Neural Radiance Field)"
    definition: "用神經網路學習一個場景的輻射場，從少量拍攝角度合成新視角的連續 3D 表示法。"
    context: "2022 年在 CVPR 上出現超過 50 篇相關論文，從單篇突破變成一個完整子領域。"
  - term: "ConvNeXt"
    definition: "Facebook AI Research 提出的「現代化 CNN」架構，把 ResNet 逐步改造成接近 Transformer 的設計，證明純 CNN 也能達到 ViT 等級的性能。"
    context: "CVPR 2022 發表，是 CNN 陣營對 Vision Transformer 浪潮的正面回應。"
---

[上一篇（2021 電腦視覺篇）](/posts/ai/2026-08-24-ai-conference-2021-cv)把 Vision Transformer 入侵 CV 的元年和 NeRF 的起飛講完了。2022 年的變化更劇烈——最大的轉折不在「辨識」而在「生成」：一篇在 CVPR 發表的 Latent Diffusion Models 論文，幾個月後變成了席捲全球的 Stable Diffusion。

## CVPR 2022

**投稿 8,161 篇，接受 2,064 篇（25.3%）**，在紐奧良舉辦，是 COVID 後第一場完全恢復實體的 CVPR。

### 得獎論文

**Best Paper Award**

- **Learning to Solve Hard Minimal Problems** — Petr Hruby, Timothy Duff, Anton Leykin, Tomas Pajdla（Czech Technical University / Georgia Tech）。用代數幾何的方法解最小化問題（minimal problems），這類問題在多視角幾何、結構恢復（Structure from Motion）裡是核心運算。論文提出了一種學習求解器（learned solver）的框架，能自動找到比手工推導更高效的求解路徑。得獎在圈內引發討論——因為它是幾何方法而非深度學習，在 Transformer 當道的 2022 年顯得格外不同。

**Best Paper Honorable Mention**

- **Dual-Shutter Optical Vibration Sensing** — Mark Sheinin, Dorian Chan, Matthew O'Toole, Srinivasa Narasimhan（CMU）。利用全域快門與捲簾快門的差異來感測高頻振動，不需要特殊硬體——用一般相機就能做到傳統需要雷射測振儀才能做的事。

**Best Student Paper Award**

- **EPro-PnP: Generalized End-to-End Probabilistic Perspective-n-Points for Monocular Object Pose Estimation** — Hansheng Chen 等（Tongji University / Alibaba DAMO Academy）。把 PnP（Perspective-n-Point）問題重新建模為端到端可微分的機率框架，讓單目物體姿態估計可以直接用梯度下降來訓練，而不需要 RANSAC 這類非可微的後處理步驟。

**Best Student Paper Honorable Mention**

- **Ref-NeRF: Structured View-Dependent Appearance for Neural Radiance Fields** — Dor Verbin, Peter Hedman, Ben Mildenhall, Todd Zickler, Jonathan Barron, Pratul Srinivasan（Harvard / Google Research）。改進 NeRF 對反射表面的渲染品質，把 view-dependent 的外觀建模從原本的方向向量改為 reflected radiance，大幅改善鏡面反射和光澤表面的真實感。

### 高影響力論文（非得獎但影響深遠）

**High-Resolution Image Synthesis with Latent Diffusion Models** — Robin Rombach, Andreas Blattmann, Dominik Lorenz, Patrick Esser, Björn Ommer（LMU Munich / Runway）。這是 2022 年 CV 領域影響最深遠的一篇論文，日後被引用超過 4,800 次。核心想法：把擴散過程從像素空間搬到預訓練自編碼器的潛空間（latent space），配合 cross-attention 層接入文字等條件輸入。效果是計算成本大幅下降（相比直接在像素空間做擴散），品質卻不打折。幾個月後 Stability AI 基於這個架構釋出了 Stable Diffusion，讓文生圖從研究工具變成消費產品。

**Masked Autoencoders Are Scalable Vision Learners (MAE)** — Kaiming He, Xinlei Chen, Saining Xie, Yanghao Li, Piotr Dollár, Ross Girshick（Meta AI / FAIR）。把 NLP 裡 BERT 的遮罩預訓練思路搬到視覺：隨機遮掉 75% 的 patch，讓模型重建。關鍵設計是非對稱的 encoder-decoder——encoder 只處理可見的 patch，decoder 很輕量——所以訓練速度快 3 倍以上。MAE 迅速成為視覺自監督預訓練的主流方法，影響了後續一整批工作（VideoMAE、BEiT v2、ViTDet 等）。

**A ConvNet for the 2020s (ConvNeXt)** — Zhuang Liu, Hanzi Mao, Chao-Yuan Wu, Christoph Feichtenhofer, Trevor Darrell, Saining Xie（Meta AI / UC Berkeley）。這篇論文的核心論點很直接：如果把 ResNet 逐步「現代化」——加大 kernel size、改用 Layer Normalization、調整 stem 和 block 設計——純 CNN 架構也能達到 Swin Transformer 等級的性能。ConvNeXt 在 ImageNet 達到 87.8% top-1 準確率，在 COCO 偵測和 ADE20K 語義分割上也贏過 Swin。這不是說 Transformer 不好，而是說 2021 年的 ViT 浪潮裡，很多性能提升其實來自訓練技巧和架構設計原則的進步，不完全是 self-attention 的功勞。

**MetaFormer Is Actually What You Need for Vision** — Weihao Yu 等（National University of Singapore / Sea AI Lab）。用一個故意弱化的 token mixer（把 self-attention 換成 average pooling）做實驗，發現 Transformer 的性能優勢很大一部分來自整體架構（MetaFormer），而不是 self-attention 本身。PoolFormer 用平均池化取代注意力，性能卻仍然很有競爭力——這個反直覺的結果挑戰了「attention is all you need」在視覺領域的敘事。

**Grounded Language-Image Pre-Training (GLIP)** — Liunian Harold Li 等（UCLA / Microsoft Research）。統一了物件偵測和 phrase grounding 的預訓練框架，在 27M 的 grounding 資料上預訓練後，GLIP 可以做到 zero-shot 的物件偵測——在完全沒見過 COCO 圖片的情況下達到 49.8 AP。這代表 2021 年 CLIP 開啟的 vision-language 路線，在 2022 年已經開始產生偵測層級的實用應用。

### NeRF 的爆發

CVPR 2022 是 NeRF 研究量爆發的轉折點。根據 Georgia Tech 教授 Frank Dellaert 的整理，這一屆 CVPR 有**超過 50 篇 NeRF 相關論文**——相比 2021 年的 CVPR 和 ICCV 合計約 25 篇，一年內翻倍。值得注意的幾篇：

- **Plenoxels: Radiance Fields without Neural Networks** — Alex Yu 等（UC Berkeley）。完全不用神經網路，直接在 3D 體素網格上優化球諧係數。渲染速度大幅提升，證明 NeRF 的核心貢獻是「可微渲染 + 體積表示」這個框架，而不是 MLP 本身。
- **Mip-NeRF 360: Unbounded Anti-Aliased Neural Radiance Fields** — Jonathan Barron 等（Google Research）。把 Mip-NeRF 擴展到無界場景（不再限定在有限空間內），加上抗鋸齒和 distortion-based regularizer，成為戶外場景 NeRF 的新基準。
- **Direct Voxel Grid Optimization (DVGO)** — Cheng Sun 等（National Taiwan University）。跟 Plenoxels 一樣走「不用 MLP」的路線，直接在體素網格上做優化，但設計了兩階段的 coarse-to-fine 策略，訓練速度從原版 NeRF 的數小時壓到十幾分鐘。
- **Block-NeRF** — Matthew Tancik 等（Waymo / UC Berkeley）。把 NeRF 擴展到城市規模——用多個 Block-NeRF 拼接整個街區的 3D 模型，從 Waymo 的行車記錄影像重建舊金山的大範圍場景。

同時期 NVIDIA 的 **Instant Neural Graphics Primitives (Instant-NGP)** 用多解析度雜湊編碼（multiresolution hash encoding）把 NeRF 訓練壓到幾秒鐘，雖然發表在 SIGGRAPH 2022 而非 CVPR，但跟 Plenoxels、DVGO 一起構成了「加速 NeRF」的 2022 年主題。

## ECCV 2022

**投稿 6,773 篇，接受 1,645 篇（約 24.3%），其中 157 篇 Oral（2.7%）**，在以色列 Tel Aviv 舉辦。ECCV 是偶數年的 CV 大會（奇數年是 ICCV），2022 這屆有 276 位 Area Chair 和 4,719 位 Reviewer。

### 得獎論文

**Best Paper Award**

- **On the Versatile Uses of Partial Distance Correlation in Deep Learning** — Xingjian Zhen, Zihang Meng, Rudrasis Chakraborty, Vikas Singh（University of Wisconsin-Madison）。把統計學中的偏距離相關性（partial distance correlation）引入深度學習，用它做特徵解耦、域遷移、因果推斷等任務。得獎的原因是它展示了一個來自古典統計的數學工具如何在多個看似不相關的深度學習問題上都有用——不是做一個新模型，而是提出一個通用的分析框架。

**Best Paper Honorable Mention**

- **Pose-NDF: Modelling Human Pose Manifolds with Neural Distance Fields** — Garvita Tiwari, Dimitrije Antic, Jan Eric Lenssen, Nikolaos Sarafianos, Tony Tung, Gerard Pons-Moll（MPI for Informatics / Meta Reality Labs）。用神經距離場（Neural Distance Field）來建模人體姿態流形——把合理的人體姿態定義為高維空間中的零等位面，任意一個姿態到最近合理姿態的距離就是 NDF 的輸出。可以用來做姿態去噪、姿態補全等任務。

- **A Level Set Theory for Neural Implicit Evolution under Explicit Flows** — Ishit Mehta, Manmohan Chandraker, Ravi Ramamoorthi（UC San Diego）。把水平集方法（level set method）跟神經隱式表示結合，讓隱式表面可以在顯式流場（explicit flow）下做物理上合理的形變。

### 高影響力論文

**ViTDet: Exploring Plain Vision Transformer Backbones for Object Detection** — Yanghao Li, Hanzi Mao, Ross Girshick, Kaiming He（Meta AI / FAIR）。這篇的發現反直覺：做物件偵測不需要像 Swin Transformer 那樣設計分層架構——直接用 plain ViT（無層級結構）搭配簡單的 feature pyramid，加上 window attention（不需要 shifting），就能達到 61.3 AP（COCO）。搭配前面提到的 MAE 預訓練，ViTDet 證明了「plain ViT + masked pretraining」這條路線在下游偵測任務上也能跟分層設計競爭——簡化了視覺 backbone 設計的複雜度。

**BEiT v2: Masked Image Modeling with Vector-Quantized Visual Tokenizers** — Zhiliang Peng 等（Microsoft Research）。延續 BEiT 的遮罩影像建模路線，改用向量量化的視覺 tokenizer（不再依賴 DALL-E 的 codebook），在 ImageNet 上的 fine-tuning 性能超過 MAE。跟 MAE 一起構成了 2022 年視覺自監督的兩大流派：MAE 走「重建像素」路線，BEiT v2 走「預測離散 token」路線。

**VideoMAE: Masked Autoencoders are Data-Efficient Learners for Self-Supervised Video Pre-Training** — Zhan Tong 等（Nanjing University / Tencent）。把 MAE 的遮罩預訓練擴展到影片，發現影片的時序冗餘讓高遮罩率（90-95%）成為可能，而且只需要少量資料就能訓練出有效的影片表示。NeurIPS 2022 發表，但跟 ECCV 的 ViTDet 和 BEiT v2 一起構成了「MAE 生態系」在 2022 年的完整展開。

## 2022 年 CV 整體觀察

### 從辨識到生成的轉折

如果 2021 年的主題是「Transformer 取代 CNN」，2022 年的主題就是「生成超越辨識」。Latent Diffusion Models 在 CVPR 發表、Stable Diffusion 在 8 月開源、DALL-E 2 在 4 月公開、Google 的 Imagen 在 5 月發表——這些事件集中在同一年。文生圖從此不再是一篇論文裡的 demo，而是數百萬人每天在用的產品。ECCV 2022 的投稿裡，diffusion model 相關論文的佔比已明顯上升。

值得注意的是，**2022 年最重要的生成模型論文大多不在 CVPR/ECCV 發表**：DALL-E 2（OpenAI 技術報告）、Imagen（ICML 2022 workshop + arXiv）、DreamBooth（CVPR 2023）、Textual Inversion（ICLR 2023）都是先以 preprint 形式釋出，正式會議發表在後一年。這反映了一個正在加速的趨勢：頂尖生成模型的研發節奏已經快過會議審稿週期，preprint + 開源 > 等會議審稿。

### CNN 的反擊與融合

ConvNeXt 在 CVPR 2022 的出現不是 CNN 最後的挽歌，而是一次有說服力的反證：很多歸因給 Transformer 的性能提升，其實來自訓練策略和架構設計原則的現代化，不完全是 self-attention 的功勞。MetaFormer 更進一步——用 average pooling 取代 attention 也能 work。

2022 年之後的趨勢不再是「CNN 或 Transformer」的二選一，而是走向融合：ConvNeXt v2、UniFormer、EfficientFormer 等工作開始混合使用局部卷積和全域注意力。這個融合趨勢到 2023-2024 年變得更明確。

### NeRF 成為獨立子領域

CVPR 2022 的 50+ 篇 NeRF 論文標誌著 NeRF 從「一篇有趣的論文」正式變成一個有自己研究社群、多條分支路線的子領域。2022 年的分支已經很清楚：

- **加速派**：Plenoxels, DVGO, Instant-NGP——目標是把訓練從小時級壓到分鐘甚至秒級
- **擴展派**：Mip-NeRF 360, Block-NeRF——處理無界場景、城市規模
- **品質派**：Ref-NeRF——解決特定材質（反射、透明）的渲染問題
- **應用派**：動態場景、可編輯 NeRF、生成式 NeRF

到 2023 年底，3D Gaussian Splatting 出現後會對 NeRF 構成嚴重挑戰——但在 2022 年，NeRF 還是 3D 表示學習的絕對主流。

### 跟 2021 年相比的演變

| 維度 | 2021 | 2022 |
|---|---|---|
| 主旋律 | Transformer 入侵 CV（ViT, Swin, DeiT） | 生成模型從研究到產品（LDM → Stable Diffusion） |
| 自監督 | DINO, MoCo v3, SimSiam——方法論探索期 | MAE, BEiT v2——收斂為兩大流派（重建像素 vs 預測 token） |
| NeRF | ~25 篇（CVPR + ICCV 合計），以改進原版為主 | 50+ 篇（CVPR 單場），分化為加速/擴展/品質/應用四條路線 |
| CNN vs Transformer | CNN 被動防守，ViT 攻城略地 | ConvNeXt 證明 CNN 也能競爭，開始走向融合 |
| 多模態 | CLIP 開啟 vision-language 路線 | GLIP 把 vision-language 延伸到偵測，文生圖成為殺手應用 |

### 站在 2026 年回看：哪些 2022 年論文影響最深遠？

1. **Latent Diffusion Models**——Stable Diffusion 的技術基礎，催生了整個文生圖產業，引用數超過所有其他 CVPR 2022 論文
2. **MAE**——成為視覺自監督預訓練的事實標準，影響了 VideoMAE、AudioMAE 等跨模態延伸
3. **ConvNeXt**——終結了「CNN 已死」的敘事，ConvNeXt v2 持續在多個 benchmark 上保持競爭力
4. **Instant-NGP**（SIGGRAPH 2022）——多解析度雜湊編碼成為後續 3D 表示法的標準組件
5. **ViTDet**——確立了「plain ViT + MAE 預訓練」在偵測任務上的可行性，影響了 SAM（Segment Anything）等後續工作

---

## 參考資料

- [CVPR 2022 Paper Awards（官方）](https://cvpr2022.thecvf.com/cvpr-2022-paper-awards)
- [Computer Vision Awards — The Computer Vision Foundation](https://www.thecvf.com/?page_id=413)
- [ECCV 2022 Awards（官方 PDF）](https://eccv2022.ecva.net/files/2022/10/ECCV22-Awards.pdf)
- [High-Resolution Image Synthesis with Latent Diffusion Models — CVPR 2022 Open Access](https://openaccess.thecvf.com/content/CVPR2022/html/Rombach_High-Resolution_Image_Synthesis_With_Latent_Diffusion_Models_CVPR_2022_paper.html)
- [Masked Autoencoders Are Scalable Vision Learners — CVPR 2022 Open Access](https://openaccess.thecvf.com/content/CVPR2022/html/He_Masked_Autoencoders_Are_Scalable_Vision_Learners_CVPR_2022_paper.html)
- [A ConvNet for the 2020s — CVPR 2022 Open Access](https://openaccess.thecvf.com/content/CVPR2022/html/Liu_A_ConvNet_for_the_2020s_CVPR_2022_paper.html)
- [MetaFormer Is Actually What You Need for Vision — CVPR 2022 Open Access](https://openaccess.thecvf.com/content/CVPR2022/html/Yu_MetaFormer_Is_Actually_What_You_Need_for_Vision_CVPR_2022_paper.html)
- [GLIP: Grounded Language-Image Pre-Training — CVPR 2022 Open Access](https://openaccess.thecvf.com/content/CVPR2022/html/Li_Grounded_Language-Image_Pre-Training_CVPR_2022_paper.html)
- [ViTDet: Exploring Plain Vision Transformer Backbones for Object Detection — ECCV 2022 (Springer)](https://link.springer.com/chapter/10.1007/978-3-031-20077-9_17)
- [Mip-NeRF 360: Unbounded Anti-Aliased Neural Radiance Fields — CVPR 2022 Open Access](https://openaccess.thecvf.com/content/CVPR2022/html/Barron_Mip-NeRF_360_Unbounded_Anti-Aliased_Neural_Radiance_Fields_CVPR_2022_paper.html)
- [NeRF at CVPR 2022 — Frank Dellaert（Georgia Tech，NeRF 論文完整彙整）](https://dellaert.github.io/NeRF22/)
- [Instant Neural Graphics Primitives with a Multiresolution Hash Encoding — SIGGRAPH 2022](https://arxiv.org/abs/2201.05989)
- [CVPR 2022 Highlights: Frontier Research Trends — Microsoft Research](https://www.microsoft.com/en-us/research/lab/microsoft-research-asia/articles/cvpr-2022-highlights-frontier-research-trends-in-computer-vision/)
- [ECCV 2022 Highlights: Advancing the Foundations of Mixed Reality — Microsoft Research](https://www.microsoft.com/en-us/research/blog/eccv-2022-highlights-advancing-the-foundations-of-mixed-reality/)
- [Best Papers of Top Venues (GitHub, SarahRastegar)](https://github.com/SarahRastegar/Best-Papers-Top-Venues)
- [Top Conference Best Papers (GitHub, FeijiangHan)](https://github.com/FeijiangHan/Top-Conference-Best-Papers)
