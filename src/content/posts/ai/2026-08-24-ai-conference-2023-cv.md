---
title: "2023 AI 頂會導讀：電腦視覺篇"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, cvpr, iccv, computer-vision, "2023", segment-anything, gaussian-splatting]
lang: zh-TW
tldr: "2023 是 CV 從「看圖」走向「理解＋生成＋控制」的一年——Segment Anything 讓分割變成 zero-shot 通用能力，ControlNet 讓擴散模型可精準控制，3D Gaussian Splatting 以即時渲染速度挑戰 NeRF，DreamBooth 和 InstructPix2Pix 把文生圖從「生成」推向「編輯」。CVPR 投稿量突破九千、ICCV 突破八千，兩場會議恢復實體舉辦，規模與密度同創新高。"
description: "回顧 2023 年 CVPR 與 ICCV 兩場頂級電腦視覺會議的得獎論文、高影響力研究、三條主要技術趨勢（基礎分割模型、可控生成、3D 表示革新），以及從 2026 年回頭看哪些論文真正改變了後續研究方向。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 16
glossary:
  - term: "SAM"
    definition: "Segment Anything Model，Meta AI 於 2023 年發表的基礎分割模型，用 promptable 架構對任意影像做 zero-shot 分割，訓練資料集 SA-1B 包含超過 11 億個 mask。"
    context: "ICCV 2023 Best Paper Honorable Mention，後續衍生出 SAM 2（影片版）、EfficientSAM、FastSAM 等大量變體。"
  - term: "ControlNet"
    definition: "在已訓練好的擴散模型（如 Stable Diffusion）上外掛一個可訓練的控制分支，讓使用者透過邊緣圖、深度圖、姿勢骨架等條件精確控制生成結果，不需要重新訓練底層模型。"
    context: "ICCV 2023 Best Paper (Marr Prize)，改變了社群對可控生成的工作方式。"
  - term: "3D Gaussian Splatting"
    definition: "用數百萬個帶有位置、顏色、透明度和形狀參數的 3D 高斯橢球來表示場景，渲染時直接用可微分光柵化（rasterization）投影到螢幕，不走 ray marching。"
    context: "2023 年發表於 SIGGRAPH，以即時渲染速度和可微分訓練挑戰 NeRF，成為 3D 表示的新主流方向。"
---

2023 年的電腦視覺圈回到了久違的實體會議模式——CVPR 在溫哥華、ICCV 在巴黎，兩場都恢復了面對面交流。但更大的變化在論文內容本身：擴散模型從「能生成」演進到「能控制」，分割從需要訓練變成 zero-shot 通用能力，3D 表示從 NeRF 的隱式場走向 Gaussian Splatting 的顯式表示。這篇回顧這兩場會議的得獎論文、高影響力研究，以及定義 2023 年 CV 走向的三條技術趨勢。

## CVPR 2023

**基本數據**：投稿 9,155 篇，接受 2,359 篇，接受率 25.8%。實體舉辦於加拿大溫哥華，時間 2023 年 6 月 18–22 日。大會從 2,359 篇接受論文中選出 235 篇 Highlight Papers（約 10%），再從中選出最終得獎者。

### Best Paper Awards（2 篇並列）

**Visual Programming: Compositional Visual Reasoning Without Training**
Tanmay Gupta、Aniruddha Kembhavi（Allen Institute for AI）

不訓練任何神經網路，而是讓 LLM（GPT-3 / Codex）把視覺推理問題翻譯成 Python 程式碼，程式碼呼叫現成的視覺模組（物件偵測、深度估計、影像分割等）來組合出答案。核心洞見：與其讓一個巨大的端到端模型學會所有推理能力，不如把推理過程外包給程式碼的組合邏輯，視覺模型只負責感知。在 GQA、NLVR2 等 benchmark 上無需訓練就達到有競爭力的結果。這篇預示了後來 visual agent 的工作方式——把 LLM 當推理引擎，視覺模型當工具。

**Planning-oriented Autonomous Driving (UniAD)**
Yihan Hu、Jiazhi Yang、Li Chen 等（上海人工智能實驗室 / 武漢大學 / 香港中文大學）

把自動駕駛的感知（偵測、追蹤、地圖）、預測（軌跡預測、佔據預測）和規劃三個階段整合進一個統一的 Transformer 架構，用「以規劃為核心」的設計原則讓所有子任務都為最終的路徑規劃服務。之前的做法是各模組分別最佳化、再串接，容易出現誤差累積和目標不對齊的問題。在 nuScenes 上全面超越各子任務的單獨 SOTA，並首次展示端到端自動駕駛系統在多任務 benchmark 上的可行性。

### Best Paper Honorable Mention

**DynIBaR: Neural Dynamic Image-Based Rendering**
Zhengqi Li、Qianqian Wang、Forrester Cole、Richard Tucker、Noah Snavely（Google Research）

從一段單目影片合成任意視角的新影像——不只是靜態場景，而是包含動態物體的場景。把場景分解成靜態背景（用 NeRF）和動態前景（用 motion trajectory field），結合 image-based rendering 的思路，在時空上同時插值。在 Nvidia Dynamic Scenes 和自採的戶外影片上生成品質大幅超越之前的動態 NeRF 方法。

### Best Student Paper

**3D Registration with Maximal Cliques**
Xiyu Zhang、Jiaqi Yang、Shikun Zhang、Yanning Zhang（西北工業大學）

把 3D 點雲配準問題轉化成圖的最大團問題（maximal clique），用一致性圖上的最大團搜尋來找到 inlier correspondences。方法簡潔、速度快、在嚴重 outlier 情況下仍然穩健。在 3DMatch、3DLoMatch、KITTI 上全面 SOTA。

### Best Student Paper Honorable Mention

**DreamBooth: Fine Tuning Text-to-Image Diffusion Models for Subject-Driven Generation**
Nataniel Ruiz、Yuanzhen Li、Varun Jampani、Yael Pritch、Michael Rubinstein、Kfir Aberman（Google Research / Boston University）

只需要 3–5 張某個特定主體（寵物、物品、人物）的照片，就能把這個主體「植入」預訓練的文生圖模型，之後用文字指令把這個主體放進任意場景。技術上用了一個特殊的 identifier token 加上 class-specific prior preservation loss 來防止語言漂移（language drift）。從 2026 年回看，DreamBooth 開啟了整個「個人化生成」（personalized generation）的研究方向，後續的 IP-Adapter、InstantID、PhotoMaker 等都建立在它的問題定義之上。

### 其他高影響力論文

- **InstructPix2Pix: Learning to Follow Image Editing Instructions**（Tim Brooks、Aleksander Holynski、Alexei A. Efros，UC Berkeley / Google Research）——用 GPT-3 生成編輯指令、用 Stable Diffusion 生成訓練對，得到一個可以直接接受自然語言指令來編輯影像的模型。不需要每張圖單獨最佳化，前向傳播一次就完成編輯。
- **ODISE: Open-Vocabulary Panoptic Segmentation with Text-to-Image Diffusion Models**（Jiarui Xu 等，NVIDIA / UT Austin / Cornell）——利用文生圖擴散模型學到的內部表示做開放詞彙全景分割，證明擴散模型的中間特徵對語意理解有用，不只是生成。
- **Magic3D: High-Resolution Text-to-3D Content Creation**（Chen-Hsuan Lin 等，NVIDIA）——用粗到細（coarse-to-fine）的兩階段策略做文字到 3D 生成，先用低解析度 NeRF 加 SDS loss 生成粗略形狀，再用高解析度 mesh 精修細節。比 DreamFusion 快 2 倍、解析度高 8 倍。
- **Scaling Up Visual and Vision-Language Representation Learning With Noisy Text Supervision**——延續 CLIP 路線的大規模視覺-語言預訓練，探索更大規模、更嘈雜的網路資料如何影響表示學習。

## ICCV 2023

**基本數據**：投稿 8,088 篇，接受 2,160 篇，接受率 26.7%。實體舉辦於法國巴黎，時間 2023 年 10 月 2–6 日。

### Best Paper (Marr Prize)（2 篇並列）

**Adding Conditional Control to Text-to-Image Diffusion Models (ControlNet)**
Lvmin Zhang、Anyi Rao、Maneesh Agrawala（Stanford University）

在已訓練好的擴散模型上加一個可訓練的「旁路」控制網路，輸入邊緣圖（Canny edge）、深度圖、人體姿勢骨架、語意分割圖等條件，就能精確控制生成影像的構圖和結構，同時保留底層模型的生成品質。技術上把 Stable Diffusion 的 encoder 層做了一份「鎖定複製」（locked copy），旁路網路只訓練新增的 zero convolution 層，訓練成本極低。

ControlNet 的影響力遠超學術論文本身：它從根本上改變了創作者使用擴散模型的方式——從「碰運氣式的 prompt 調整」變成「我畫一張草圖 / 拍一張姿勢照片，模型按我的構圖生成」。開源社群在 ControlNet 發布後的幾個月內就衍生出數十種控制條件的變體（tile、inpainting、reference-only 等），整合進 Stable Diffusion WebUI 成為標配。

**Passive Ultra-Wideband Single-Photon Imaging**
Mian Wei、Sotiris Nousias、Rahul Gulve、David B. Lindell、Kiriakos N. Kutulakos（University of Toronto）

用單光子感測器（SPAD）實現被動（不需要主動發射光源）的超寬頻成像，能在極低光條件下捕捉場景的時間分辨資訊。純光學 / 計算成像的工作拿到 Marr Prize 在 CV 社群中相對少見，反映出 ICCV 評審對「不只是軟體演算法」的研究方向的重視。

### Best Paper Honorable Mention

**Segment Anything (SAM)**
Alexander Kirillov、Eric Mintun、Nikhila Ravi、Hanzi Mao 等（Meta AI）

用超過 11 億個 mask 的 SA-1B 資料集訓練出一個「可提示」（promptable）的分割基礎模型：給定一張影像加上任意的 prompt（點、框、文字、mask），SAM 就能輸出對應區域的分割結果。模型架構包含一個重量級的影像 encoder（ViT-H）、一個輕量的 prompt encoder、和一個快速的 mask decoder——影像 encoder 只需跑一次，之後可以即時回應不同的 prompt。

SAM 的意義不只是一個更好的分割模型，而是改變了分割任務本身的定義：從「訓練一個針對特定類別的分割器」變成「一個通用的分割引擎，告訴它你要什麼就分什麼」。從 2026 年回看，SAM 開啟的「segment-then-X」範式已經滲透進幾乎所有需要像素級理解的下游任務——從影片編輯到醫學影像到機器人感知。SAM 2（2024）進一步擴展到影片領域，SAM 的影響力仍在持續擴大。

### Best Student Paper

**Tracking Everything Everywhere All at Once (OmniMotion)**
Qianqian Wang、Yen-Yu Chang、Ruojin Cai、Zhengqi Li、Bharath Hariharan、Aleksander Holynski、Noah Snavely（Cornell University / Google Research / UC Berkeley）

對影片中每一個像素估計完整的長程軌跡——不只是 optical flow（相鄰兩幀的運動），而是跨越整段影片的全局一致運動場。用一個 quasi-3D 的標準空間（canonical space）把所有幀的運動統一起來，再用 test-time optimization 的方式對單段影片做最佳化。在長程密集追蹤上大幅超越之前的光流和 point tracking 方法。

### 其他高影響力論文

- **DINOv2: Learning Robust Visual Features Without Supervision**（Maxime Oquab 等，Meta AI）——技術上發表為 arXiv preprint（2023 年 4 月），在 ICCV 期間被大量討論。用 curated 的大規模無標註資料集訓練出通用視覺特徵，在下游任務上接近甚至超越有監督預訓練的 backbone。DINOv2 成為後續許多工作的 default visual encoder。
- **Scalable Diffusion Models with Transformers (DiT)**（William Peebles、Saining Xie，UC Berkeley / New York University）——用 Transformer 取代 U-Net 作為擴散模型的 backbone，證明 scaling law 在擴散模型上同樣成立。DiT 後來成為 Sora 等影片生成模型的架構基礎。
- **ImageBind: One Embedding Space To Bind Them All**（Rohit Girdhar 等，Meta AI）——把影像、文字、音訊、深度、熱成像、IMU 六種模態對齊到同一個嵌入空間，只用影像-文字對和影像與其他模態的自然配對，不需要所有模態的聯合標註。

## 2023 年 CV 的三條主要趨勢

### 趨勢一：基礎模型進入 CV——從 CLIP 到 SAM

如果說 CLIP（2021）是 CV 基礎模型的概念驗證，SAM（2023）就是第一個真正改變工作流程的 CV 基礎模型。SAM 證明了一個用足夠大的資料集訓練的 promptable 模型可以「開箱即用」地處理任意分割任務，不需要針對每個下游任務重新訓練。DINOv2 則從另一個角度做了同樣的事——提供一個可以直接拿來用的通用視覺特徵 backbone。

兩者共同的訊號：CV 圈開始接受「一個大模型解決一大類問題」的 paradigm，而不是每個任務各訓練一個專用模型。這在 2021-2022 年還是少數人的觀點，2023 年已經成為主流共識。

### 趨勢二：可控生成取代隨機生成

2022 年的 Stable Diffusion 和 DALL-E 2 證明了文生圖的可行性，但實際使用時最大的痛點是「不可控」——生成結果跟使用者想要的構圖、姿勢、風格經常對不上。2023 年的 ControlNet、DreamBooth、InstructPix2Pix 分別從三個角度解決這個問題：

- **ControlNet**：用結構化條件（邊緣、深度、姿勢）控制空間構圖
- **DreamBooth**：用少量照片控制主體身份（subject identity）
- **InstructPix2Pix**：用自然語言指令控制編輯方向

三者合在一起，把擴散模型從「有趣的玩具」升級成「可用的創作工具」。CVPR 2023 的官方趨勢報告也把「Render the Real」列為第一大趨勢——會議主辦方自己都觀察到這個方向轉換。

### 趨勢三：3D 表示革新——從 NeRF 到 Gaussian Splatting

NeRF 從 2020 年的 ECCV Best Paper 開始，到 2023 年已經產出了數百篇衍生論文。但 NeRF 有一個根本限制：它用隱式的 MLP 表示場景，渲染時需要沿每條光線做大量的 query（ray marching），速度慢、記憶體大。

2023 年 SIGGRAPH 發表的 **3D Gaussian Splatting**（Bernhard Kerbl、Georgios Kopanas、Thomas Leimkühler、George Drettakis，INRIA / Max Planck Institute）從根本上換了表示方式：用數百萬個帶參數的 3D 高斯橢球顯式地表示場景，渲染時用可微分光柵化（rasterization）而非 ray marching，達到即時渲染速度（30+ fps）同時保持高品質。

雖然 3DGS 本身不是 CVPR/ICCV 的論文（發表在 SIGGRAPH），但它對 CV 社群的衝擊在 2023 下半年已經非常明顯——ICCV 2023 上多篇 NeRF 相關論文開始引用或比較 3DGS，到 2024 年 CVPR/ECCV 上 3DGS 變體論文已經爆發性增長，Mip-Splatting 拿到 CVPR 2024 Honorable Mention。

同時，CVPR 2023 上的 DynIBaR（Best Paper Honorable Mention）和 ICCV 2023 上的 OmniMotion（Best Student Paper）都在處理動態場景的 novel view synthesis 和長程追蹤——動態場景理解是 NeRF / 3DGS 方法共同的下一個前沿。

## 跟 2022 年相比的變化

| 維度 | 2022 | 2023 |
|---|---|---|
| 生成模型 | 擴散模型「能生成」（Latent Diffusion, Imagen） | 擴散模型「能控制」（ControlNet, DreamBooth, InstructPix2Pix） |
| 分割 | 仍需針對特定任務訓練 | SAM 實現 zero-shot 通用分割 |
| 3D 表示 | NeRF 變體爆發（Instant-NGP, Mip-NeRF 360） | 3DGS 提出顯式替代方案，NeRF 開始面臨挑戰 |
| 視覺基礎模型 | MAE, BEiT v2（自監督預訓練） | DINOv2, SAM（直接可用的通用特徵 / 通用分割） |
| 自動駕駛 | 模組化為主 | UniAD 推動端到端統一架構 |
| 投稿量 | CVPR 8,161 / ECCV ~6,773 | CVPR 9,155 / ICCV 8,088 |

## 從 2026 年回看：哪些 2023 年論文影響最深遠

1. **Segment Anything (SAM)**——「segment-then-X」範式滲透進幾乎所有需要像素級理解的領域，SAM 2 擴展到影片，EfficientSAM、FastSAM 等讓它能在邊緣裝置上跑。2026 年的新論文仍在大量使用 SAM 作為前處理步驟。
2. **ControlNet**——可控生成從研究走向產品，成為 Stable Diffusion WebUI 和 ComfyUI 的標配元件。後續的 IP-Adapter、T2I-Adapter、ControlNet++（2024）都建立在它的框架之上。
3. **3D Gaussian Splatting**——雖然發表在 SIGGRAPH 而非 CV 會議，但 3DGS 在 2024-2025 的 CV 會議上已經取代 NeRF 成為 3D 表示的主流方法。2024-2025 年的 CVPR/ECCV/ICCV 上 3DGS 相關論文數量呈指數級增長。
4. **DreamBooth**——個人化生成（personalized generation）成為獨立的研究方向，IP-Adapter、InstantID、PhotoMaker 等後續工作都承襲了它定義的問題框架。
5. **DiT (Diffusion Transformer)**——用 Transformer 做擴散模型的 backbone 這件事，後來被 Sora（2024）、Stable Diffusion 3（2024）等下一代模型直接採用，DiT 的 scaling 分析成為架構選擇的重要依據。

---

## 參考資料

- [CVPR 2023 Best Paper Award Winners Announced（官方）](https://cvpr.thecvf.com/Conferences/2023/BestPaperAwards)
- [CVPR Reveals Top Five Trends in Computer Vision（官方趨勢報告）](https://cvpr.thecvf.com/Conferences/2023/TopTrends)
- [CVPR 2023 Closing Statement（官方投稿與接受統計）](https://cvpr.thecvf.com/Conferences/2023/ClosingStatement)
- [Computer Vision Awards — The Computer Vision Foundation（ICCV 歷年得獎列表）](https://www.thecvf.com/?page_id=413)
- [ICCV Paper Awards — IEEE TCPAMI（ICCV 歷年 Marr Prize 列表）](https://tc.computer.org/tcpami/awards/iccv-paper-awards/)
- [Best Papers of Top Venues — GitHub（跨會議得獎論文彙整）](https://github.com/SarahRastegar/Best-Papers-Top-Venues)
- [ICCV 2023 Top Papers, General Trends, and Personal Picks — AI Summer](https://theaisummer.com/iccv-2023/)
- [Segment Anything — Kirillov et al. (ICCV 2023)](https://segment-anything.com/)
- [ControlNet — Adding Conditional Control to Text-to-Image Diffusion Models (ICCV 2023)](https://arxiv.org/abs/2302.05543)
- [DreamBooth — Fine Tuning Text-to-Image Diffusion Models for Subject-Driven Generation (CVPR 2023)](https://dreambooth.github.io/)
- [3D Gaussian Splatting for Real-Time Radiance Field Rendering — Kerbl et al. (SIGGRAPH 2023)](https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/)
- [DINOv2: Learning Robust Visual Features Without Supervision — Oquab et al. (arXiv 2023)](https://arxiv.org/abs/2304.07193)
- [Scalable Diffusion Models with Transformers (DiT) — Peebles & Xie (ICCV 2023)](https://arxiv.org/abs/2212.09748)
- [Planning-oriented Autonomous Driving (UniAD) — Hu et al. (CVPR 2023)](https://arxiv.org/abs/2212.10156)
- [Visual Programming: Compositional Visual Reasoning Without Training — Gupta & Kembhavi (CVPR 2023)](https://arxiv.org/abs/2211.11559)
- [InstructPix2Pix: Learning to Follow Image Editing Instructions — Brooks et al. (CVPR 2023)](https://arxiv.org/abs/2211.09800)
