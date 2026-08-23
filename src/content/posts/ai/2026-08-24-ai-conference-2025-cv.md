---
title: "2025 AI 頂會導讀：電腦視覺篇"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, cvpr, iccv, computer-vision, "2025", video-generation, 3d-gaussian-splatting, embodied-ai]
lang: zh-TW
tldr: "2025 是 CV 雙會年——CVPR 和 ICCV 同年舉辦。CVPR 投稿 13,008 創歷史新高，Best Paper VGGT 把 3D 重建從逐步最佳化拉到 feed-forward 推論；ICCV 的 Marr Prize 頒給了用文字生成可實際拼搭積木結構的 BrickGPT。3D Gaussian Splatting 全面取代 NeRF、video generation 從研究走向產品、flow model 開始取代 diffusion——CV 領域在這一年完成了多項典範轉移。"
description: "2025 年 CVPR 與 ICCV 兩場頂級電腦視覺會議的得獎論文、高影響力研究、四條主要技術趨勢（3D Gaussian Splatting 取代 NeRF、video generation 商業化、flow model 崛起、embodied AI 整合），以及審稿誠信新政策的影響。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 24
glossary:
  - term: "3D Gaussian Splatting"
    definition: "用大量 3D 高斯分佈來表示場景，透過 splatting（投影到螢幕上）做即時渲染。2023 年提出後迅速取代 NeRF 成為 3D 場景表示的主流方法。"
    context: "2025 年 CVPR 和 ICCV 都有大量 3DGS 論文，NeRF 則明顯退潮。"
  - term: "Marr Prize"
    definition: "ICCV 的 Best Paper Award 別名，紀念計算視覺先驅 David Marr。是 CV 領域最高榮譽之一。"
    context: "2025 年 Marr Prize 頒給了 CMU 的 BrickGPT。"
  - term: "Flow Model"
    definition: "一類生成模型，學習從雜訊到資料的連續流（flow）映射，與 diffusion model 的去噪過程不同。2025 年的趨勢是 flow model 開始在多個任務上取代 diffusion model。"
    context: "ICCV 2025 Best Student Paper FlowEdit 就是基於 flow model 的圖像編輯方法。"
---

2025 年是電腦視覺的雙會年——CVPR（6 月，Nashville）和 ICCV（10 月，Honolulu）同時在同一年舉辦。兩場會議的投稿量都創下新高，加起來超過 24,000 篇投稿、5,500 篇接受，幾乎是五年前（2021）同期的兩倍。這一年的 CV 研究有幾個清晰的主題：3D Gaussian Splatting 全面取代 NeRF、影片生成從學術走向商業、flow model 開始挑戰 diffusion model 的主導地位、embodied AI 把視覺理解跟機器人操作越拉越近。

## CVPR 2025

投稿 13,008 篇（較 2024 年的 11,532 成長 13%），接受 2,878 篇（最終到場發表 2,872 篇），接受率 22.1%——歷史最低。其中僅 3.3% 被選為 oral presentation。9,375 位與會者來自 75 個國家，118 場 workshop、25 場 tutorial、69 個 demo（較 2024 增長 33%）。

### Best Paper

**VGGT: Visual Geometry Grounded Transformer**
Jianyuan Wang, Minghao Chen, Nikita Karaev, Andrea Vedaldi, Christian Rupprecht, David Novotny（University of Oxford / Meta AI）

一個 feed-forward 神經網路，輸入 1 到數百張圖片，幾秒內同時估計相機姿態、場景深度、點對應關係等所有 3D 場景屬性。傳統 3D 重建需要多步驟 pipeline（SfM → MVS → mesh），VGGT 把整個流程壓縮成單次前向推論，速度快到可以即時使用。這篇論文代表的趨勢是 3D 視覺任務從「最佳化問題」轉向「直接推論」——跟 2021 年 NeRF 需要每個場景訓練半小時相比，是概念層級的跳躍。

### Best Student Paper

**Neural Inverse Rendering from Propagating Light**
Anagh Malik, Benjamin Attal, Andrew Xie, Matthew O'Toole, David B. Lindell（University of Toronto / Vector Institute / Carnegie Mellon University）

用 LiDAR 系統的多視角時間解析測量（time-resolved measurement）來做物理基礎的逆向渲染——不只重建幾何，還能重現光在場景中傳播的過程。這是把計算攝影（computational photography）和神經渲染結合的前沿工作。

### Best Paper Honorable Mention

- **MegaSaM: Accurate, Fast and Robust Structure and Motion from Casual Dynamic Videos** — Zhengqi Li, Richard Tucker 等（Google Research / UC Berkeley）。從手機隨手拍的動態影片中做 Structure from Motion，不需要靜態場景假設。
- **Navigation World Models** — Amir Bar, Gaoyue Zhou, Danny Tran, Trevor Darrell, Yann LeCun（UC Berkeley / Meta AI / NYU）。讓機器人在陌生環境中預測未來視野，用 world model 做導航。
- **Molmo and PixMo: Open Weights and Open Data for State-of-the-Art Vision-Language Models** — Matt Deitke 等 48 位作者（AI2）。完全開源的視覺語言模型家族 Molmo，配合全新的 PixMo 資料集（不依賴外部 VLM 生成），在開源 VLM 中達到 SOTA。
- **3D Student Splatting and Scooping** — Jialin Zhu, Jiangbei Yue, Feixiang He, He Wang（UCL / Peking University）。

### Best Student Paper Honorable Mention

**Generative Multimodal Pretraining with Discrete Diffusion Timestep Tokens**
Kaihang Pan, Wang Lin, Zhongqi Yue 等（NTU / Zhejiang University）

### Best Demo（並列）

**DynaMem and Robot Utility Models** — Haritheja Etukuru 等（NYU / Meta AI）。展示機器人如何用動態記憶體在真實環境中操作物件。

### 高影響力非得獎論文

- **DepthCrafter**（Wenbo Hu 等，Tencent / HKUST）：為開放世界影片生成時間一致的長序列深度圖，不需要相機姿態或光流作為輸入。
- **Video Depth Anything**（Sili Chen 等，ByteDance / HKU）：超長影片的一致深度估計，把 Depth Anything 的能力延伸到影片領域。
- **GEN3C**（NVIDIA）：3D 資訊引導的世界一致影片生成，支援精確相機控制。

## ICCV 2025

投稿 11,239 篇（較 ICCV 2023 的 8,088 成長 39%），接受 2,698 篇，接受率 24.0%。10 月 19-23 日在夏威夷 Honolulu 舉行。

這屆 ICCV 值得注意的一件事：延續 CVPR 2025 的做法，Program Chair 主動辨識出 25 位高度不負責任的審稿人，連帶桌面拒絕（desk rejection）了 29 篇相關投稿——其中 12 篇原本應該會被接受。這是審稿誠信政策從「事後追懲」走向「主動清除」的重要轉折。

### Marr Prize（Best Paper）

**BrickGPT: Generating Physically Stable and Buildable Brick Structures from Text**
Ava Pun, Kangle Deng, Ruixuan Liu, Deva Ramanan, Changliu Liu, Jun-Yan Zhu（Carnegie Mellon University）

第一個從文字提示生成物理上穩定、可實際拼搭的積木（LEGO）模型的方法。核心創新是推論過程中的物理感知驗證——用物理定律和組裝約束來即時修剪不可行的 token 預測。團隊釋出了 StableText2Lego 資料集（47,000+ 穩定結構、28,000+ 獨特 3D 物件），以及完整的程式碼和模型。

這篇論文有趣的地方在於它把 LLM 的 next-token prediction 跟硬物理約束結合——不是用 post-hoc 的方式篩選結果，而是在生成過程中就做物理驗證。這個「生成時驗證」的範式對所有需要滿足硬約束的生成任務都有啟發。

### Best Student Paper

**FlowEdit: Inversion-Free Text-Based Editing Using Pre-Trained Flow Models**
Vladimir Kulikov, Matan Kleiner, Inbar Huberman-Spiegelglas, Tomer Michaeli（Technion — Israel Institute of Technology）

一個不需要 inversion、不需要最佳化、模型無關的文字圖像編輯方法，基於預訓練的 flow model。這篇論文的意義超越圖像編輯本身——它代表 flow model 開始在應用層面取代 diffusion model，提供更乾淨的編輯管道。

### Honorable Mention

- **Spatially-Varying Autofocus** — Yingsi Qin, Aswin C. Sankaranarayanan, Matthew O'Toole（Carnegie Mellon University）。空間變化的自動對焦方法。
- **RayZer: A Self-supervised Large View Synthesis Model** — Hanwen Jiang 等（UT Austin / Adobe / Cornell）。自監督的大視角合成模型，不需要 3D 標註就能從 2D 圖像學習 3D 場景表示。

### 高影響力非得獎論文

- **EVER (Exact Volumetric Ellipsoid Rendering)**：用體積橢球體取代高斯 splatting，消除了 3DGS 的 popping artifact，在 Zip-NeRF 資料集上甚至超過 Zip-NeRF 本身。
- **SceneSplat**：第一個大規模 3DGS 室內場景資料集（SceneSplat-7K，6,868 場景），解決語義推理在 3DGS 中的泛化問題。
- **GeometryCrafter**（Tencent / Tsinghua）：把 DepthCrafter 的思路延伸到完整的幾何估計。
- **MINDCUBE**：測試 VLM 空間心理模型的 benchmark——結果發現最先進的 VLM 在空間推理上只略優於隨機猜測。

## 2025 CV 四大趨勢

### 一、3D Gaussian Splatting 全面取代 NeRF

2021 年 NeRF 論文在 ICCV 有 25+ 篇；2023 年 3DGS 首次出現；到 2025 年，3DGS 已經是 3D 場景表示的絕對主流。Paper Digest 的 ICCV 2023 vs 2025 對比直接寫道：「3D Gaussian Splatting 在 2025 爆發性成長，這個主題在 2023 幾乎不存在。」

NeRF 並沒有完全消失，但主要退到特定場景（精確光學模擬等）。3DGS 贏在即時渲染速度和可編輯性——EVER 這類工作進一步解決了原始 3DGS 的渲染瑕疵，SceneSplat 則為大規模資料集訓練鋪路。

### 二、Video Generation 從研究走向產品

Sora（OpenAI）、Kling（快手）、Runway Gen-3 等商業影片生成模型在 2024-2025 年間上線，但學術界的焦點已經從「能不能生成影片」轉向更深層的問題：

- **深度一致性**：DepthCrafter、Video Depth Anything 解決長影片的深度估計一致性。
- **3D 一致性**：GEN3C 用 3D 資訊引導影片生成，確保多視角一致。
- **4D 場景理解**：把 3D 加上時間軸，FICTION（4D 未來互動預測）、Uni4D 等工作開始嘗試直接從影片理解 4D 動態場景。

### 三、Flow Model 開始取代 Diffusion Model

這個趨勢在 ICCV 2025 特別明顯。FlowEdit 拿下 Best Student Paper，Paper Digest 的趨勢分析直接指出「生成模型從 diffusion 轉向 flow model 是一個主要趨勢」。Flow model 學習從雜訊到資料的連續映射，相比 diffusion model 的多步去噪過程，在推論效率和可控性上有結構性優勢。

### 四、Embodied AI 與 World Model 整合

Navigation World Models 拿下 CVPR Best Paper Honorable Mention，DynaMem 拿下 Best Demo——機器人和視覺理解的整合在 2025 年不再只是 workshop 主題。CVPR 2025 的官方趨勢總結把「autonomous driving 從模組化轉向端到端系統和 world model」列為主要方向之一。Genesis（通用可微分物理模擬器）等工作則從另一個角度推進——讓 embodied AI 的訓練從需要真實資料轉向完全模擬。

## 跟 2024 的對比

| 維度 | 2024 | 2025 |
|---|---|---|
| 投稿量 | CVPR 11,532 / ECCV 8,585 | CVPR 13,008 / ICCV 11,239 |
| 接受率 | CVPR 23.6% / ECCV 27.8% | CVPR 22.1% / ICCV 24.0% |
| 3D 表示主流 | 3DGS 快速成長，NeRF 仍有存在感 | 3DGS 絕對主導，NeRF 退居小眾 |
| 生成模型 | Diffusion model 主導 | Flow model 開始在多個任務上取代 diffusion |
| 影片研究 | 生成品質為主 | 深度一致性、3D 一致性、4D 理解 |
| Embodied AI | Workshop 級別居多 | Best Paper Honorable Mention + Best Demo |
| 審稿誠信 | 開始關注 AI 生成審稿 | 主動桌面拒絕不負責任審稿人相關論文 |

## 2026 年回頭看：哪些論文影響最大

1. **VGGT** — 如果 feed-forward 3D 重建的品質持續提升，它可能改變整個 3D 視覺的工作範式，讓「每場景最佳化」成為歷史。
2. **FlowEdit** — 作為 flow model 在應用層面取代 diffusion 的標誌性工作，它的影響會超越圖像編輯本身。
3. **Navigation World Models** — Embodied AI 社群的重要里程碑，把 world model 從概念驗證推向實際導航任務。
4. **Molmo / PixMo** — 完全開源的 VLM 生態系，對學術研究者和獨立開發者的意義重大。
5. **DepthCrafter / Video Depth Anything** — 影片深度估計的基礎設施級工作，下游應用（AR、影片編輯、自動駕駛）都會用到。

---

## 參考資料

- [CVPR 2025 Awards Press Release](https://cvpr.thecvf.com/Conferences/2025/News/Awards_Press)
- [CVPR 2025 Best Papers and Best Demos](https://cvpr.thecvf.com/Conferences/2025/BestPapersDemos)
- [CVPR 2025 Conference Wrap-Up](https://cvpr.thecvf.com/Conferences/2025/News/Wrap)
- [ICCV 2025 Paper Awards — IEEE TCPAMI](https://tc.computer.org/tcpami/awards/iccv-paper-awards/)
- [Computer Vision Awards — The Computer Vision Foundation](https://www.thecvf.com/?page_id=413)
- [BrickGPT — CMU Intelligent Control Lab](https://icontrol.ri.cmu.edu/news/iccv25.html)
- [BrickGPT GitHub Repository](https://github.com/AvaLovelace1/BrickGPT)
- [Top CVPR 2025 Papers — GitHub (SkalskiP)](https://github.com/SkalskiP/top-cvpr-2025-papers)
- [Key Computer Vision Trends: ICCV 2023 vs 2025 — Paper Digest](https://www.paperdigest.org/report/data/iccv-2025-computer-vision-trends.html)
- [Top Computer Vision Research Topics: CVPR 2025 — Paper Digest](https://www.paperdigest.org/report/data/cvpr-2025-topics.html)
- [ICCV Acceptance Rate and Submission Statistics — CS Conf Stats](https://csconfstats.xoveexu.com/conferences/iccv/)
- [ICCV 2025 Accepted Papers — Official](https://iccv.thecvf.com/Conferences/2025/AcceptedPapers)
- [CVPR 2025 Technical Program](https://cvpr.thecvf.com/Conferences/2025/News/Technical_Program)
- [ICCV 2025 Best Paper Awards — @ICCVConference](https://x.com/ICCVConference/status/1980704802691858682)
