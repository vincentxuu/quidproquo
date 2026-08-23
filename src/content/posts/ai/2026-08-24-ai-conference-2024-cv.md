---
title: "2024 AI 頂會導讀：電腦視覺篇"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, cvpr, eccv, computer-vision, "2024", video-generation, gaussian-splatting]
lang: zh-TW
tldr: "2024 是 3D Gaussian Splatting 全面接管 3D 重建、video generation 從研究走向產品、vision-language model 深入各垂直領域的一年。CVPR 投稿量突破 11,500 篇再創紀錄，Best Paper 給了 Google Research 的 Generative Image Dynamics 和 UCSD/Google 合作的 Rich Human Feedback for Text-to-Image Generation；ECCV Best Paper 則頒給哥倫比亞大學的 Minimalist Vision with Freeform Pixels——一篇回歸光學基礎物理的非典型得獎作。"
description: "回顧 2024 年 CVPR 與 ECCV 兩場頂級電腦視覺會議的得獎論文、高影響力研究、四條主要技術趨勢（3DGS 生態爆發、video generation 產品化、vision-language model 垂直化、自動駕駛感知高峰），以及跟 2023 年的對比。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 20
glossary:
  - term: "3DGS"
    definition: "3D Gaussian Splatting 的縮寫。用一組 3D 高斯橢球體表示場景，透過 rasterization 直接投影到 2D 影像，實現即時渲染。2023 年底由 Kerbl et al. 提出，2024 年全面取代 NeRF 成為 3D 重建主流方法。"
    context: "CVPR 2024 Best Student Paper Mip-Splatting 和 Honorable Mention pixelSplat 都是 3DGS 改進工作。"
  - term: "world model"
    definition: "在自動駕駛語境中，指能根據當前觀察預測未來場景的生成式模型。通常基於 diffusion model 或 autoregressive model，輸出多視角影片或 3D 場景表示。"
    context: "CVPR 2024 出現多篇用 world model 做自動駕駛規劃的論文（Drive-WM、GenAD、DriveWorld）。"
---

> 本文是「[AI 頂會導讀](/posts/ai/2026-08-23-what-is-ai-top-conference)」系列的電腦視覺 2024 年度篇。

2024 年的電腦視覺研究有一個明確的主旋律：**生成式 AI 從 2D 全面擴展到 3D 和影片**。3D Gaussian Splatting（3DGS）在 2023 年底橫空出世後，2024 年的兩場大會被 3DGS 相關論文淹沒；Sora 在年初的 announcement 把 video generation 推上風口；vision-language model 則從通用走向醫學、生物、自動駕駛等垂直領域。CVPR 投稿量首次突破 11,500 篇，ECCV 也收到 8,585 篇——都是歷史新高。

## CVPR 2024

**投稿 11,532 / 接受 2,719 / 23.6%**，在西雅圖舉行。

### Best Paper Awards

| 獎項 | 論文 | 團隊 | 貢獻 |
|---|---|---|---|
| Best Paper | Generative Image Dynamics | Zhengqi Li, Richard Tucker, Noah Snavely, Aleksander Holynski（Google Research） | 從單張靜態圖片建模自然振盪動力學，生成照片級真實的循環動畫和互動模擬 |
| Best Paper | Rich Human Feedback for Text-to-Image Generation | Youwei Liang et al.（UCSD / Google Research / USC / Cambridge / Brandeis） | 首個針對文生圖的豐富人類回饋資料集，訓練 multimodal Transformer 預測並改善圖片生成品質 |
| Honorable Mention | EventPS: Real-Time Photometric Stereo Using an Event Camera | Bohan Yu et al. | 用事件相機做即時光度立體重建 |
| Honorable Mention | pixelSplat: 3D Gaussian Splats from Image Pairs for Scalable Generalizable 3D Reconstruction | David Charatan, Sizhe Li, Andrea Tagliasacchi, Vincent Sitzmann | 從影像對直接預測 3D Gaussian Splats，實現可擴展的泛化 3D 重建 |

### Best Student Paper Awards

| 獎項 | 論文 | 團隊 | 貢獻 |
|---|---|---|---|
| Best Student Paper | Mip-Splatting: Alias-free 3D Gaussian Splatting | Zehao Yu, Anpei Chen, Binbin Huang, Torsten Sattler, Andreas Geiger（Tübingen / ShanghaiTech / CTU Prague） | 引入 3D 平滑濾波器和 2D Mip 濾波器解決 3DGS 的鋸齒問題，在不同取樣率下都能無鋸齒渲染 |
| Best Student Paper | BioCLIP: A Vision Foundation Model for the Tree of Life | Samuel Stevens et al.（Ohio State / Microsoft Research / UC Irvine / RPI） | 在 1,000 萬張生物影像上訓練的視覺基礎模型，在 zero-shot 和 few-shot 物種分類上大幅超越通用模型 |
| Student Honorable Mention | SpiderMatch: 3D Shape Matching with Global Optimality and Geometric Consistency | | 3D 形狀匹配的全域最優解 |
| Student Honorable Mention | Image Processing GNN: Breaking Rigidity in Super-Resolution | | 用 GNN 突破超解析度的結構限制 |
| Student Honorable Mention | Objects as Volumes: A Stochastic Geometry View of Opaque Solids | | 從隨機幾何角度理解不透明物體 |
| Student Honorable Mention | Comparing the Decision-Making Mechanisms by Transformers and CNNs via Explanation Methods | | 用可解釋性方法比較 Transformer 和 CNN 的決策機制 |

### Longuet-Higgins Prize（Test of Time）

頒給 CVPR 2014 最具長期影響力的論文：**Rich Feature Hierarchies for Accurate Object Detection and Semantic Segmentation**（R-CNN），作者 Ross Girshick, Jeff Donahue, Trevor Darrell, Jitendra Malik。R-CNN 開創了用深度學習做物件偵測的典範，直接催生了 Fast R-CNN、Faster R-CNN、Mask R-CNN 這條主線，至今仍是物件偵測領域的基礎架構之一。

### 高影響力非得獎論文

**3DGS 生態**——CVPR 2024 是 3DGS 全面爆發的一屆。除了得獎的 Mip-Splatting 和 pixelSplat，還有大量重要工作：

- **4D Gaussian Splatting for Real-Time Dynamic Scene Rendering**（Guanjun Wu et al., HUST / Huawei）——把 3DGS 擴展到動態場景，用神經體素編碼建模 Gaussian 形變，在 800×800 解析度下達到 82 FPS 即時渲染。
- **PhysGaussian: Physics-Integrated 3D Gaussians for Inverse Rendering**（UCLA / Zhejiang / Utah）——把物理模擬（應力、塑性、彈性）直接嵌入 3DGS，省去 mesh 轉換步驟。
- **DrivingGaussian: Composite Gaussian Splatting for Surrounding Dynamic Autonomous Driving Scenes**（Xiaoyu Zhou et al.）——將 3DGS 應用到自動駕駛場景的動態重建。

**Video generation 與 world model**——OpenAI 在 2024 年 2 月發佈 Sora 技術報告，雖然 Sora 本身不是頂會論文，但帶動了整個 video generation 研究的加速：

- **GenAD: Generalized Predictive Model for Autonomous Driving**（Jiazhi Yang et al., OpenDriveLab / HKU / Tübingen）——自動駕駛領域首個大規模影片預測模型，基於 2,000+ 小時駕駛影片，可 zero-shot 泛化到未見過的駕駛資料集。
- **Drive-WM: Driving into the Future**（Yuqi Wang et al.）——首個與現有端到端規劃模型相容的駕駛 world model，能根據不同駕駛操作生成多種未來場景。

**Multimodal 理解**——

- **MMMU: A Massive Multi-discipline Multimodal Understanding and Reasoning Benchmark for Expert AGI**（Xiang Yue et al.）——跨學科多模態理解基準，在 Paper Digest 的影響力排名中名列前茅。

## ECCV 2024

**投稿 8,585 / 接受 2,387 / 27.8%**，在米蘭舉行。這是 ECCV 史上投稿量最高的一屆。

### Best Paper Award

**Minimalist Vision with Freeform Pixels** — Jeremy Klotz, Shree K. Nayar（Columbia University）

這是一篇非典型的 Best Paper。在整個 CV 社群都在追逐大模型和生成式 AI 的 2024 年，ECCV 把最高獎頒給了一篇回歸光學基礎物理的工作——研究如何用自由形狀的感測器像素（而非傳統的矩形網格）來設計更高效的視覺系統。Shree Nayar 是 Columbia 大學計算攝影（computational photography）領域的開創者之一，這篇論文延續了他長期關注的硬體-演算法協同設計方向。

### Best Paper Honorable Mentions

| 論文 | 團隊 | 貢獻 |
|---|---|---|
| Rasterized Edge Gradients: Handling Discontinuities Differentially | Stanislav Pidhorskyi, Tomas Simon, Gabriel Schwartz, He Wen, Yaser Sheikh, Jason Saragih（Meta） | 解決可微渲染中邊緣不連續性的梯度計算問題 |
| Concept Arithmetics for Circumventing Concept Inhibition in Diffusion Models | Vitali Petsiuk, Kate Saenko（Boston University） | 用概念算術繞過 diffusion model 的概念抑制機制，揭示安全防護的脆弱性 |

### Best Paper Candidates（值得關注）

ECCV 2024 公布了完整的 Best Paper Candidate 名單，其中幾篇特別值得注意：

- **Sapiens: Foundation for Human Vision Models**（Rawal Khirodkar et al., Meta Codec Avatars Lab）——在 3 億張人體影像上預訓練的基礎模型家族，覆蓋 2D 姿態估計、身體部位分割、深度估計、表面法線預測四大任務，0.3B 到 2B 參數的模型都大幅超越現有方法。在 Humans-5K 上比前 SOTA 高 7.6 mAP，展示了領域專用大規模預訓練的威力。
- **PointLLM: Empowering Large Language Models to Understand Point Clouds**（Runsen Xu et al., CUHK / OpenRobotLab）——首次讓 LLM 理解 3D 點雲，建立了 73 萬樣本的點雲-文字指令資料集，在人類評估的物件描述任務中超過 50% 的樣本優於人類標註者。全部審稿人給了 "strong-accept"。
- **PathMMU: A Massive Multimodal Expert-Level Benchmark for Understanding and Reasoning in Pathology**（Yuxuan Sun et al.）——病理學領域的大規模多模態基準。
- **SEA-RAFT: Simple, Efficient, Accurate RAFT for Optical Flow**——對經典 RAFT 光流方法的簡化與改進。

### Koenderink Prize（Test of Time）

2024 年同時頒給兩篇 ECCV 2014 的論文：

- **LSD-SLAM: Large-Scale Direct Monocular SLAM**（Jakob Engel, Thomas Schöps, Daniel Cremers, TU Munich）——開創了不依賴特徵點的直接法單目 SLAM，至今仍是視覺定位領域的重要基線。
- **Microsoft COCO: Common Objects in Context**（Tsung-Yi Lin et al.）——COCO 資料集已成為物件偵測、實例分割、關鍵點偵測等任務的標準基準，引用量超過萬次，是整個 CV 領域基礎設施級別的貢獻。

## 2024 年電腦視覺四大趨勢

### 1. 3DGS 全面接管 3D 重建

2023 年底 Kerbl et al. 發表原始 3D Gaussian Splatting 論文後，2024 年的兩場大會被 3DGS 相關工作淹沒。CVPR 2024 的 3DGS 論文數量從 2023 年的零篇（因為原始論文在 SIGGRAPH 2023 發表、時間來不及投 CVPR 2024 的 deadline）直接跳到數十篇。Best Student Paper（Mip-Splatting）、Honorable Mention（pixelSplat）、和大量 oral/spotlight 論文都是 3DGS 改進或應用。

跟 NeRF 相比，3DGS 的優勢在於：
- **即時渲染**：原始 3DGS 就能達到 30+ FPS，改進版本更快
- **顯式表示**：每個 Gaussian 都是可操作的幾何元素，方便編輯、物理模擬、動態建模
- **訓練效率**：分鐘級訓練 vs NeRF 的小時級

2024 年的擴展方向包括：4D 動態場景（4D-GS）、物理模擬整合（PhysGaussian）、自動駕駛場景重建（DrivingGaussian）、從影像對直接預測（pixelSplat）、抗鋸齒（Mip-Splatting）。NeRF 並沒有完全消失，但 3DGS 已經成為新工作的預設選擇。

### 2. Video generation 從研究走向產品

2024 年初 Sora 的 announcement 是一個分水嶺事件。雖然 Sora 本身不是頂會論文，但它證明了大規模 video generation 的可行性，帶動了整個領域的加速。CVPR 2024 的 Best Paper（Generative Image Dynamics）和 Best Paper（Rich Human Feedback for Text-to-Image Generation）都與生成式視覺直接相關。

自動駕駛領域尤其積極擁抱 video generation：GenAD、Drive-WM、Panacea、DriveWorld 等論文都用 diffusion model 生成多視角駕駛影片，既作為資料增強手段，也作為 world model 直接用於規劃。「用生成模型理解世界」從 LeCun 的概念倡議變成了可量化的研究方向。

### 3. Vision-language model 走向垂直領域

2024 年的 vision-language model 不再只是通用的圖文對齊——而是深入特定領域：
- **生物學**：BioCLIP（CVPR Best Student Paper）在 1,000 萬張生物影像上訓練，做物種辨識
- **病理學**：PathMMU（ECCV Best Paper Candidate）做病理切片的多模態推理
- **人體理解**：Sapiens（ECCV Best Paper Candidate）在 3 億張人體影像上專用預訓練
- **3D 理解**：PointLLM（ECCV Best Paper Candidate）讓 LLM 理解 3D 點雲
- **自動駕駛**：多篇論文用 MLLM 做駕駛場景理解和指令跟隨

這反映了一個更大的趨勢：通用基礎模型的邊際改進越來越小，但在垂直領域用高品質領域資料做專用預訓練或微調，仍然能拿到巨大的效能提升。

### 4. 自動駕駛感知研究高峰

CVPR 2024 的自動駕駛相關論文密度達到歷史高峰。除了上面提到的 video generation 和 world model 方向，BEV（Bird's-Eye-View）感知、端到端自動駕駛、多模態駕駛理解都有大量高品質工作。這跟產業端的需求直接相關——Tesla FSD、Waymo、各家中國自動駕駛公司都在大量投入，學術界的研究跟著產業節奏加速。

## 跟 2023 年的對比

| 維度 | 2023 | 2024 |
|---|---|---|
| 3D 重建主流 | NeRF 仍是主流，3DGS 剛出現 | 3DGS 全面接管，NeRF 退居邊緣 |
| Video generation | 學術探索階段，LDM → video 剛起步 | Sora 帶動產品化浪潮，自動駕駛 world model 爆發 |
| Vision-language | 通用 CLIP 系列為主 | 垂直領域專用模型（生物、醫學、人體、3D） |
| 自動駕駛 | 以 BEV 感知和規劃為主 | 加入 world model、video generation、MLLM |
| Best Paper 風格 | Visual Programming（無訓練）、Planning-Oriented AD | 生成式動力學（Generative Image Dynamics）、人類回饋（Rich Human Feedback） |

## 以後見之明回看：2024 年哪些論文影響最深遠

1. **3D Gaussian Splatting 生態**——Mip-Splatting、pixelSplat、4D-GS 等工作奠定了 3DGS 作為 3D 表示標準的地位，後續的 3D 生成、編輯、模擬工作幾乎都建立在 3DGS 之上。
2. **Sapiens**（Meta）——證明了「領域專用大規模預訓練 > 通用預訓練 + 微調」的路線在人體理解任務上的壓倒性優勢，影響了後續各種垂直領域基礎模型的設計思路。
3. **自動駕駛 world model**（GenAD、Drive-WM）——「用生成模型做規劃」這條路線在 2024 年被驗證可行，後續推動了 NVIDIA、Wayve 等公司將 world model 納入產品路線圖。
4. **Rich Human Feedback for T2I**——首個系統性的文生圖人類回饋框架，為後續用 RLHF/DPO 改進視覺生成模型提供了基礎資料集和方法論。
5. **Microsoft COCO 獲 Koenderink Prize**——提醒社群，十年前的一個資料集仍然是整個領域最重要的基礎設施之一，好的基準比好的模型活得更久。

---

## 參考資料

- [CVPR 2024 Best Paper Award Winners（官方公告）](https://cvpr.thecvf.com/Conferences/2024/News/Awards)
- [CVPR 2024 Best Paper Award Winners（IEEE Computer Society）](https://www.computer.org/press-room/cvpr-2024-announces-best-paper-award-winners)
- [ECCV 2024 Awards（官方頁面）](https://eccv.ecva.net/Conferences/2024/Awards)
- [ECCV 2024 Awards Detail（虛擬會場）](https://eccv2024.ecva.net/virtual/2024/awards_detail)
- [Columbia University — Outstanding Research and Best Paper Honors at ECCV 2024](https://www.cs.columbia.edu/2024/outstanding-research-and-best-paper-honors-at-eccv-2024/)
- [Computer Vision Awards — Best Paper / Longuet-Higgins Prize 歷年得獎列表](https://www.thecvf.com/?page_id=413)
- [ECCV Paper Awards — Koenderink Prize 歷年得獎列表（IEEE TCPAMI）](https://tc.computer.org/tcpami/awards/eccv-paper-awards/)
- [Longuet-Higgins Prize 歷年得獎列表（IEEE TCPAMI）](https://tc.computer.org/tcpami/awards/longuet-higgins-prize/)
- [CVPR 2024 Breaks Paper and Attendance Records](https://cvpr.thecvf.com/Conferences/2024/News/Wrap_Release)
- [Springer — Computer Vision ECCV 2024 Proceedings（前言含投稿／接受數字）](https://link.springer.com/book/10.1007/978-3-031-72855-6)
- [SarahRastegar/Best-Papers-Top-Venues（GitHub，各會議得獎論文彙整）](https://github.com/SarahRastegar/Best-Papers-Top-Venues)
- [52CV/CVPR-2024-Papers（GitHub，CVPR 2024 全部論文列表）](https://github.com/52CV/CVPR-2024-Papers)
- [4 Key Trends in CVPR 2024（VESSL AI）](https://vessl.ai/en/blog/cvpr2024)
- [Paper Digest — Most Influential CVPR Papers (2024-09)](https://www.paperdigest.org/2024/09/most-influential-cvpr-papers-2024-09)
- [Recent advances in 3D Gaussian splatting（Computational Visual Media, Springer）](https://link.springer.com/article/10.1007/s41095-024-0436-y)
