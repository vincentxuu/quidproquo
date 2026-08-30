---
title: "2021 AI 頂會導讀：電腦視覺篇"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, cvpr, iccv, computer-vision, vision-transformer, "2021"]
lang: zh-TW
tldr: "2021 是 Transformer 正式入侵電腦視覺的元年——Swin Transformer 拿下 ICCV Best Paper，DINO 證明自監督 ViT 能自動學會物件分割，NeRF 從單篇論文變成一整個子領域。CVPR 和 ICCV 都因疫情改為全線上舉辦，但這一年產出的論文深遠影響了此後整個 CV 領域的架構選擇。"
description: "回顧 2021 年 CVPR 與 ICCV 兩場頂級電腦視覺會議的得獎論文、最具影響力的研究、三條主要技術趨勢（Vision Transformer 崛起、自監督學習突破、NeRF 爆發），以及疫情全線上舉辦對社群的影響。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 8
glossary:
  - term: "ViT"
    definition: "Vision Transformer，Google 於 2020 年提出的架構，把影像切成固定大小的 patch 當 token 送進標準 Transformer encoder，證明不用卷積也能做影像分類。"
    context: "2021 年各種改良版 ViT（DeiT、Swin、CvT）在 CVPR 和 ICCV 上大量出現，標誌著 Transformer 正式進入 CV 領域。"
  - term: "NeRF"
    definition: "Neural Radiance Field，用神經網路學一個連續的 3D 場景表示，給定任意視角就能渲染出逼真的影像。2020 年 ECCV Best Paper。"
    context: "2021 年 ICCV 上出現超過 25 篇 NeRF 相關論文，從單篇突破變成一整個子領域。"
  - term: "自監督學習"
    definition: "不依賴人工標註，讓模型從資料本身的結構學到有用的表示。常見做法包括對比學習（contrastive learning）和遮罩預測（masked prediction）。"
    context: "SimSiam、DINO、MoCo v3 等自監督方法在 2021 年取得重大突破，縮小了與監督學習的性能差距。"
---

> 🌏 [English version](/posts/ai/2026-08-24-ai-conference-2021-cv-en)

2021 年的電腦視覺圈，兩件大事同時發生：COVID-19 讓 CVPR 和 ICCV 兩場最重要的會議都改成全線上舉辦，而 Transformer 架構正式從 NLP 跨界入侵 CV，開始動搖 CNN 長達十年的統治地位。這篇回顧這兩場會議的得獎論文、最具影響力的研究，以及三條定義了 2021 年 CV 走向的技術趨勢。

## CVPR 2021

**基本數據**：投稿 7,093 篇，接受 1,661 篇，接受率 23.6%。全線上舉辦（原定地點 Nashville），時間 2021 年 6 月 19–25 日。

### Best Paper

**GIRAFFE: Representing Scenes as Compositional Generative Neural Feature Fields**
Michael Niemeyer、Andreas Geiger（Max Planck Institute for Intelligent Systems / University of Tübingen）

把 NeRF 的概念跟 GAN 結合：場景被拆成多個可獨立控制的物件，每個物件用一個小型 neural feature field 表示，最後合成一張可控的影像。關鍵貢獻不是影像品質本身，而是在 3D-aware 生成模型裡實現了物件級的可控性——可以獨立移動、旋轉、新增、刪除場景中的物件。這篇打開了後來 3D-aware controllable generation 的研究方向。

### Best Student Paper

**Task Programming: Learning Data Efficient Behavior Representations**
Jennifer J. Sun、Ann Kennedy、Eric Zhan、David J. Anderson、Yisong Yue、Pietro Perona（Caltech / Northwestern University）

用「任務程式化」的方式從少量標註學習動物行為表示，讓研究者可以用簡單的程式描述來定義新的行為分類任務，不需要大量標註資料。

### Best Paper Honorable Mentions

- **Exploring Simple Siamese Representation Learning**（Xinlei Chen、Kaiming He，Facebook AI Research）——SimSiam，證明不需要負樣本、不需要大 batch、不需要 momentum encoder，單純的 Siamese 網路加上 stop-gradient 就能學到好的表示。這篇對自監督學習社群的影響極大，因為它把方法簡化到了極致，逼迫社群重新思考對比學習到底為什麼有效。
- **Learning High Fidelity Depths of Dressed Humans by Watching Social Media Dance Videos**（Yasamin Jafarian、Hyun Soo Park，University of Minnesota）——用社群媒體上大量的跳舞影片作為訓練資料，學習穿著衣服的人體幾何（depth）。巧妙的資料來源選擇：跳舞影片包含多樣的姿勢、衣著、身體比例，而且量大到不需要人工標註。

### Best Student Paper Honorable Mentions

- **Less is More: ClipBERT for Video-and-Language Learning via Sparse Sampling**（Jie Lei 等，UNC Chapel Hill / Microsoft）——用稀疏取樣取代密集幀提取來做影片與語言的多模態學習，大幅降低計算成本。
- **Binary TTC: A Temporal Geofence for Autonomous Navigation**（Abhishek Badki 等，NVIDIA / UC Santa Barbara）——把碰撞時間（time-to-contact）估計簡化成二元分類問題，用於自動駕駛的安全邊界判斷。
- **Real-Time High-Resolution Background Matting**（Shanchuan Lin 等，University of Washington）——即時高解析度背景去除，不需要綠幕。

### CVPR 2021 的重要論文（非得獎但影響力巨大）

這一屆 CVPR 還有幾篇雖然沒拿獎，但後續引用量和實際影響力遠超多數得獎論文的工作：

- **Swin Transformer: Hierarchical Vision Transformer using Shifted Windows**（Ze Liu 等，Microsoft Research Asia）——這篇最終在幾個月後的 ICCV 2021 發表並拿下 Best Paper，但早在 CVPR 2021 時期就已經以 arXiv 預印本的形式在社群廣泛流傳。
- **Neural Body: Implicit Neural Representations with Structured Latent Codes for Novel View Synthesis of Dynamic Humans**（Sida Peng 等，Zhejiang University）——把 NeRF 擴展到動態人體，用結構化的隱碼表示人體姿態。

## ICCV 2021

**基本數據**：投稿 6,236 篇，接受 1,617 篇，接受率 25.9%。全線上舉辦（原定地點 Montreal），時間 2021 年 10 月 11–17 日。

### Marr Prize（Best Paper）

**Swin Transformer: Hierarchical Vision Transformer using Shifted Windows**
Ze Liu、Yutong Lin、Yue Cao、Han Hu、Yixuan Wei、Zheng Zhang、Stephen Lin、Baining Guo（Microsoft Research Asia）

如果說 ViT（2020）證明了 Transformer 「能」做視覺，Swin Transformer 就是證明 Transformer 「該」做視覺的那篇。它解決了 ViT 的兩個關鍵痛點：

1. **計算複雜度**：ViT 的全局自注意力對影像大小是平方複雜度，Swin 把注意力限制在局部視窗（window）內，複雜度降到線性。
2. **多尺度特徵**：ViT 只有單一解析度的 token，Swin 用層級式架構（hierarchical）產出多尺度特徵圖，可以直接接上 FPN 等下游偵測／分割 head——這是 CNN 時代 ResNet 能當萬用 backbone 的關鍵能力，Swin 讓 Transformer 也做到了。

「Shifted window」是核心設計：相鄰層的視窗互相錯開半個視窗大小，讓跨視窗的資訊可以流通，解決了固定視窗帶來的邊界問題。

Swin Transformer 累積超過 28,000 次引用，成為 CV 領域歷史上被引用最多的論文之一。它實質上終結了「ViT 只能做分類」的認知，讓 Transformer 成為 CV 各種任務（分類、偵測、分割、影像生成）的通用 backbone 選項。

### Best Student Paper

**Pixel-Perfect Structure-from-Motion with Featuremetric Refinement**
Philipp Lindenberger、Paul-Edouard Sarlin、Viktor Larsson、Marc Pollefeys（ETH Zürich）

把學到的特徵（learned features）整合進傳統的 Structure-from-Motion 流程，在特徵匹配之後加一步 featuremetric refinement，讓 keypoint 定位精度達到亞像素等級。

### Marr Prize Honorable Mentions

- **Mip-NeRF: A Multiscale Representation for Anti-Aliasing Neural Radiance Fields**（Jonathan T. Barron 等，Google Research）——解決 NeRF 在不同距離觀看時的鋸齒問題，用圓錐體取代射線做 ray casting，是 NeRF 從 toy demo 走向實用的關鍵一步。
- **OpenGAN: Open-Set Recognition via Open Data Generation**（Shu Kong、Deva Ramanan，CMU）——用 GAN 生成「未知類別」的合成資料來訓練 open-set 分類器。
- **Viewing Graph Solvability via Cycle Consistency**（Federica Arrigoni 等，CIIRC / University of Udine）——幾何視覺的理論工作，解決了 viewing graph 是否可解的完整判定條件。
- **Common Objects in 3D: Large-Scale Learning and Evaluation of Real-life 3D Category Reconstruction**（Jeremy Reizenstein 等，Facebook AI Research）——CO3D 資料集，包含約 19,000 個真實物件的多視角影片，填補了 3D category reconstruction 缺乏大規模真實資料的空白。

### ICCV 2021 的其他重要論文

- **DINO: Emerging Properties in Self-Supervised Vision Transformers**（Mathilde Caron 等，Facebook AI Research / Inria / Sorbonne University）——自監督訓練的 ViT 會自動在 attention map 中「學會」物件分割，不需要任何分割標註。這個「emergent property」是 2021 年最令人驚訝的發現之一，後續的 DINOv2（2023）成為 CV 領域最重要的預訓練 backbone 之一。
- **An Empirical Study of Training Self-Supervised Vision Transformers（MoCo v3）**（Xinlei Chen、Saining Xie、Kaiming He，Facebook AI Research）——系統性地研究自監督訓練 ViT 的穩定性問題，發現 batch size、learning rate、patch projection 層的凍結等因素對訓練穩定性有關鍵影響。
- **BARF: Bundle-Adjusting Neural Radiance Fields**（Cheng-Hung Chen Lin 等，UC Berkeley）——同時優化場景表示和相機位姿，移除了 NeRF 需要精確相機位姿作為輸入的限制。

## 三條主線：2021 CV 的技術趨勢

### 趨勢一：Vision Transformer 從實驗品變成主流架構

2020 年底 Google 發表的 ViT 證明了純 Transformer 可以做影像分類，但有兩個限制：需要海量預訓練資料（JFT-300M），而且只能做分類。2021 年，這兩個限制都被突破：

- **DeiT（Data-efficient Image Transformers）**（Hugo Touvron 等，Facebook AI Research，ICML 2021）——用知識蒸餾（distillation token）讓 ViT 只在 ImageNet-1K 上訓練就能達到競爭力，打破了「ViT 需要 JFT-300M」的認知。
- **Swin Transformer**（ICCV 2021 Best Paper）——讓 ViT 能做偵測、分割等密集預測任務，不再只是分類器。
- **CvT: Introducing Convolutions to Vision Transformers**（Haiping Wu 等，McGill / Microsoft，ICCV 2021）——把卷積嵌入 Transformer，融合兩者的優勢。
- **CrossViT: Cross-Attention Multi-Scale Vision Transformer**（Chun-Fu Chen 等，MIT-IBM Watson AI Lab，ICCV 2021）——多尺度雙分支 ViT。

到 2021 年底，「用 Transformer 還是用 CNN」已經從一個實驗性的問題變成了一個真實的架構選擇決策。Swin Transformer 提供了一個跟 ResNet 一樣泛用的 backbone 選項，後續的論文開始預設同時報告 CNN 和 Transformer backbone 的結果。

### 趨勢二：自監督學習突破——不需要標註也能學到好特徵

2021 年的自監督學習成果集中在兩條路線：

**對比學習（Contrastive Learning）路線的簡化**：
- SimSiam（CVPR 2021 Honorable Mention）把方法簡化到極致：不需要負樣本、不需要大 batch、不需要 momentum encoder。
- MoCo v3（ICCV 2021）系統性地解決了自監督訓練 ViT 的不穩定問題。

**自蒸餾（Self-Distillation）路線的突破**：
- DINO（ICCV 2021）發現自監督 ViT 的 attention map 會自動形成物件分割的 mask——這個 emergent property 不會出現在監督學習的 ViT 或 CNN 上。這暗示自監督學習不只是「逼近監督學習的便宜替代品」，而是能學到監督學習學不到的東西。

到 2021 年底，自監督方法在 ImageNet 線性探測上已經追到監督學習的 1-2% 以內。更重要的是，DINO 顯示的 emergent property 暗示了一個可能性：自監督預訓練的 ViT 或許比監督預訓練的版本更適合當通用 backbone。這個方向在後續的 DINOv2（2023）和 MAE（2022，Kaiming He，CVPR 2022 oral）中得到了進一步驗證。

### 趨勢三：NeRF 從單篇論文變成一整個子領域

NeRF（Neural Radiance Fields）在 2020 年 ECCV 上以一篇 Best Paper 驚艷亮相。到了 2021 年，ICCV 上出現了超過 25 篇 NeRF 相關論文——Frank Dellaert（Georgia Tech）在他的部落格「NeRF at ICCV 2021」中做了完整盤點。這些論文把 NeRF 從各個方向擴展：

- **品質與效率**：Mip-NeRF（Honorable Mention）解決了多尺度渲染的鋸齒問題；FastNeRF 把渲染速度提升到 200 FPS。
- **動態場景**：多篇論文把 NeRF 擴展到影片和動態人體（Neural Body 在 CVPR 2021，Dynamic View Synthesis 在 ICCV 2021）。
- **去除位姿依賴**：BARF 等論文開始移除 NeRF 需要精確相機位姿的限制。
- **可編輯性**：GIRAFFE（CVPR 2021 Best Paper）和多篇 ICCV 論文讓 NeRF 的場景可以被編輯和控制。
- **SLAM 整合**：iMAP（ICCV 2021）把 NeRF 式的隱式表示整合進即時 SLAM 系統。

NeRF 在 2021 年的爆發，預告了 3D 視覺從傳統幾何方法向神經隱式表示的典範轉移。後來的 3D Gaussian Splatting（2023）接棒成為這個方向的下一個里程碑。

## 疫情對社群的影響

CVPR 2021 和 ICCV 2021 都是全線上舉辦——這是兩場會議連續第二年（CVPR）和第一次（ICCV 改為線上）以虛擬形式進行。線上形式降低了參與門檻（不需要簽證、機票、住宿），但社群普遍反映最大的損失是非正式的學術交流：走廊裡的即興討論、poster session 的面對面問答、晚餐時的合作機會。2022 年開始，主要會議陸續恢復實體舉辦，這兩年的全線上經驗成為社群後來討論「混合模式」（hybrid）會議的重要參考。

## 整體來說

2021 年的 CV 頂會可以用三個關鍵字總結：**Transformer、Self-Supervised、NeRF**。Swin Transformer 讓 Transformer 有了取代 ResNet 成為通用 backbone 的資格，DINO 讓自監督學習展現出監督學習所沒有的新特性，NeRF 則從一篇論文膨脹成一整個子領域。這三條趨勢都不是在 2021 年結束的——它們各自定義了此後數年 CV 研究的主要方向，直到 2023-2024 年 diffusion model 和 3D Gaussian Splatting 帶來下一波典範轉移。

---

## 參考資料

- [CVPR 2021 Paper Awards（官方頁面）](https://cvpr2021.thecvf.com/node/329)
- [ICCV 2021 Paper Awards（官方頁面）](https://iccv2021.thecvf.com/iccv-2021-paper-awards)
- [CVPR 2021 Home — 全線上舉辦公告](https://cvpr2021.thecvf.com)
- [ICCV 2021 Home — 全線上舉辦公告](https://iccv2021.thecvf.com/home)
- [Computer Vision Foundation — Computer Vision Awards（歷年得獎彙整）](https://www.thecvf.com/?page_id=413)
- [Niemeyer & Geiger (2021), "GIRAFFE: Representing Scenes as Compositional Generative Neural Feature Fields", CVPR 2021](https://arxiv.org/abs/2011.12100)
- [Liu et al. (2021), "Swin Transformer: Hierarchical Vision Transformer using Shifted Windows", ICCV 2021](https://arxiv.org/abs/2103.14030)
- [Caron et al. (2021), "Emerging Properties in Self-Supervised Vision Transformers (DINO)", ICCV 2021](https://arxiv.org/abs/2104.14294)
- [Chen & He (2021), "Exploring Simple Siamese Representation Learning (SimSiam)", CVPR 2021](https://arxiv.org/abs/2011.10566)
- [Barron et al. (2021), "Mip-NeRF: A Multiscale Representation for Anti-Aliasing Neural Radiance Fields", ICCV 2021](https://arxiv.org/abs/2103.13415)
- [Chen, Xie & He (2021), "An Empirical Study of Training Self-Supervised Vision Transformers (MoCo v3)", ICCV 2021](https://arxiv.org/abs/2104.02057)
- [Touvron et al. (2021), "Training data-efficient image transformers & distillation through attention (DeiT)", ICML 2021](https://arxiv.org/abs/2012.12877)
- [Frank Dellaert, "NeRF at ICCV 2021"（NeRF 相關論文完整盤點）](https://dellaert.github.io/NeRF21)
- [He, Chen & Girshick (2021), "Masked Autoencoders Are Scalable Vision Learners (MAE)", arXiv 2021（CVPR 2022 發表）](https://arxiv.org/abs/2111.06377)
- [Paper Digest — Most Influential ICCV Papers](https://www.paperdigest.org/2025/09/most-influential-iccv-papers-2025-09-version)
- [SarahRastegar/Best-Papers-Top-Venues（GitHub 歷年最佳論文彙整）](https://github.com/SarahRastegar/Best-Papers-Top-Venues)
