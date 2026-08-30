---
title: "2021 AI 頂會在收什麼題目：Transformer 擴散、自監督學習與 Diffusion 的起點"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, research-trends, "2021", topic-analysis, transformer, self-supervised-learning, diffusion-model, graph-neural-network]
lang: zh-TW
tldr: "2021 年是 AI 頂會的分水嶺：Transformer 從 NLP 全面入侵 CV 與時序領域，自監督學習成為各會議最熱門關鍵詞，Diffusion Model 拿下 ICLR Outstanding Paper 但還沒有人意識到它會取代 GAN——而 GNN 和 Federated Learning 正處於論文量的歷史高峰，之後開始走下坡。"
description: "回顧 2021 年 NeurIPS、ICML、ICLR、ACL、EMNLP、CVPR、ICCV、AAAI 九大會議的得獎論文與主題分布，從研究方向的維度分析哪些題目正在爆發、哪些開始冒頭、哪些已飽和，以及站在 2026 年回頭看哪些方向的投入回報最高。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 9
glossary:
  - term: "Diffusion Model"
    definition: "一類生成模型，透過逐步加噪再學習去噪的過程生成數據。2021 年在 ICLR 拿下 Outstanding Paper，2022 年起橫掃圖像生成領域。"
    context: "2021 年還在學術圈內部討論，尚未進入公眾視野。"
  - term: "Self-Supervised Learning"
    definition: "不需要人工標註的學習方法，模型從數據本身的結構中學習表徵（如遮蔽部分輸入讓模型預測）。"
    context: "2021 年的 ICML、CVPR、ICCV 都有大量自監督學習論文，是當年最熱門的跨領域關鍵詞。"
  - term: "Vision Transformer (ViT)"
    definition: "將原本用於文字序列的 Transformer 架構直接套用到圖像，把圖片切成 patch 當 token 處理。"
    context: "2020 年底 Google 提出 ViT，2021 年各個 CV 會議立刻出現大量 Transformer-based 視覺模型。"
---

> 🌏 [English version](/posts/ai/2026-08-24-ai-conference-2021-topics-en)

2021 年的 AI 頂會處在一個特殊的時間點：GPT-3 剛在前一年發表但還沒有 ChatGPT，Stable Diffusion 還不存在，RLHF 只是少數人在研究的冷門題目。但如果你翻開 2021 年各大會議的得獎論文和接受論文關鍵詞，會發現所有即將在 2022-2024 年爆發的方向——Diffusion Model、多模態、大型語言模型的對齊——都已經在 2021 年留下了清楚的訊號。這篇從「研究方向」而非「單場會議」的角度，整理 2021 年九大 AI 頂會到底在收什麼題目。

## 最熱門：Transformer 從 NLP 吃掉所有領域

2021 年最顯眼的跨會議趨勢是 **Transformer 架構的全面擴散**。2017 年 Transformer 在 NLP 領域問世，到 2020 年底 Google 發表 ViT（Vision Transformer），把圖片切成 patch 當 token 處理並在 ImageNet 上達到跟 CNN 可比的效果——而 2021 年就是 CV 社群全面接受這個範式的一年。

**ICCV 2021 的 Best Paper（Marr Prize）頒給了 Swin Transformer**——微軟亞洲研究院的 Ze Liu 等人提出的層級式 Vision Transformer，用 Shifted Window 機制讓 Transformer 能處理高解析度圖像，成為後續兩年 CV 領域最被引用的 backbone 之一。這篇論文的得獎本身就是一個訊號：Vision Transformer 不再是 NLP 借來的外來物，而是 CV 自己的核心架構。

同年的 **CVPR 2021 Best Paper Honorable Mention 頒給了 Exploring Simple Siamese Representation Learning**（Xinlei Chen、Kaiming He），另一方面探索 Transformer 在自監督學習裡的應用。**AAAI 2021 的 Outstanding Paper 之一是 Informer**——Beihang 團隊提出的高效 Transformer 架構，專門處理長序列時間序列預測，顯示 Transformer 已經從 NLP 和 CV 進一步擴展到時序領域。

根據一項對 2017-2025 年五大 AI 會議（ACL、CVPR、ICLR、ICML、NeurIPS）共 80,814 篇主軌論文的關鍵詞分析（Khanbayov et al., arXiv 2606.12828），**Transformer 相關論文在 2021 年出現了明確的加速拐點**——不是線性成長，而是跨會議同步爆發。這跟 RL 的穩定線性成長形成鮮明對比。

## 自監督學習：當年最大公約數

如果要選一個 2021 年跨越 ML、CV、NLP 三個領域都在密集投稿的方向，答案是**自監督學習（Self-Supervised Learning, SSL）**。

**ICML 2021 的 Outstanding Paper Honorable Mention 之一是「Understanding Self-Supervised Learning Dynamics without Contrastive Pairs」**（Yuandong Tian、Xinlei Chen、Surya Ganguli），從理論角度分析為什麼 BYOL 這類不需要負樣本的自監督方法也能學到好的表徵——這是當年最核心的開放問題之一。

**CVPR 2021** 的 Exploring Simple Siamese Representation Learning（前面提到的 Best Paper Honorable Mention）同樣在探索自監督學習的極簡設計。**ICCV 2021** 則有大量 Transformer + 自監督的組合論文。**NeurIPS 2021** 的接受論文中，self-supervised learning 是出現頻率最高的關鍵詞之一。

自監督學習在 2021 年之所以成為最大公約數，背後有一個很實際的推力：標註數據昂貴，而預訓練模型的效果已經證明無監督或自監督的表徵學習可以替代大量人工標註。這個趨勢在 NLP 領域已經由 BERT（2018）和 GPT 系列驗證過，2021 年是 CV 和多模態領域全面跟進的年份。

## 正在冒頭：Diffusion Model 拿到 ICLR Outstanding Paper

2021 年最值得回顧的「冒頭」方向是 **Diffusion Model**。

**ICLR 2021 的 8 篇 Outstanding Paper 之一是「Score-Based Generative Modeling through Stochastic Differential Equations」**（Yang Song、Jascha Sohl-Dickstein、Diederik P. Kingma、Abhishek Kumar、Stefano Ermon、Ben Poole）。這篇論文用隨機微分方程統一了 score-based model 和 denoising diffusion model 兩條路線，建立了 Diffusion Model 的理論基礎框架。

同年稍早，Dhariwal 和 Nichol 發表了「Diffusion Models Beat GANs on Image Synthesis」，在 ImageNet 上首次用 Diffusion Model 打敗了 GAN 的 FID 分數。年底 Nichol 等人又發表了 GLIDE，展示文字引導的 Diffusion 圖像生成。

但 2021 年的 Diffusion Model 有一個很重要的特徵：**它還沒有出圈**。2021 年的 Diffusion 論文主要出現在 ICLR 和 NeurIPS，數量不多但品質極高（包括 Outstanding Paper）。根據前述的跨會議主題分析，Diffusion Model 在 2021 年的論文量還處於「低基數」階段——真正的爆發要等到 2022 年 Stable Diffusion 和 DALL·E 2 發布之後。

這是一個典型的「相變前訊號」：一個方向在頂會拿到最高榮譽但論文總量還很少，代表學術社群的評審委員會已經認可其重要性，但大部分研究者還沒有跟進。從 2021 年的 ICLR Outstanding Paper 到 2022 年的全面爆發，中間只隔了一年。

## 正在冒頭：多模態學習與 CLIP 效應

2021 年初 OpenAI 發表了 **CLIP**（Contrastive Language-Image Pre-training）和 **DALL·E**，把文字和圖像的聯合表徵推到了新的水準。這兩篇論文本身不是在頂會上發表的（CLIP 發在 ICML 2021，DALL·E 以技術報告形式發布），但它們對 2021 年各大會議的影響是即時的。

**EMNLP 2021 的 Best Long Paper 就是一篇多模態論文**：「Visually Grounded Reasoning across Languages and Cultures」（Fangyu Liu 等人），建立了一個跨語言、跨文化的視覺推理 benchmark，挑戰「現有多模態模型是否真的理解圖像內容，還是只在英語語境的數據上擬合」。這篇得獎論文反映的是多模態研究的一個重要轉向：從「做出一個能配對文字和圖像的模型」轉向「檢驗這個模型在非英語、非西方的語境下是否還有效」。

CLIP 帶動的另一個效應是 **zero-shot 和 open-vocabulary** 的研究開始在 CV 會議大量出現——既然 CLIP 能在沒見過的類別上做分類，那其他視覺任務（偵測、分割）能不能也做到？這個問題在 2021 年開始被密集研究，到 2022-2023 年成為 CV 會議的主流方向之一。

## 高峰期：GNN 和 Federated Learning

2021 年有兩個方向處於論文量的歷史高峰，之後開始下降或停滯：

**Graph Neural Networks（GNN）** 在 2021 年仍然是各大 ML 會議的熱門方向。ICLR 2021 的 Outstanding Paper 之一是「Learning Mesh-Based Simulation with Graph Networks」（Tobias Pfaff 等人，DeepMind），用 Graph Networks 做物理模擬。NeurIPS 2021 也有大量 GNN 論文。但從跨會議的論文量趨勢來看，GNN 在 2021 年左右到達了 ICLR/ICML/NeurIPS 的出現頻率高峰——之後不是消失，而是從「獨立的熱門方向」變成「被吸收進其他方向的工具」。

**Federated Learning** 在 2021 年同樣處於高峰。ICML 2021 的 Outstanding Paper Honorable Mention 之一是「Optimal Complexity in Decentralized Training」，探討去中心化訓練的理論下界。NeurIPS 2021 的 Federated Learning 相關論文數量也是歷年最高之一。但跟 GNN 類似，Federated Learning 的論文量在 2021-2022 年之後開始趨於平穩，部分原因是核心的理論問題已經被大量研究過，剩下的主要是工程和應用層面的工作。

## 還在穩定成長：強化學習

**強化學習（RL）** 在 2021 年仍然是 NeurIPS 和 ICML 的核心方向之一，但成長模式跟 Transformer 和 Diffusion 很不同：RL 的論文量是**穩定線性成長**，沒有出現突然的爆發或急劇下降。

NeurIPS 2021 的 Outstanding Paper 之一是「Deep Reinforcement Learning at the Edge of the Statistical Precipice」（Rishabh Agarwal 等人），直接挑戰 RL 社群的評估方法——指出很多 RL 論文只用 3-5 個 random seed 就宣稱自己的演算法優於 baseline，統計上其實站不住腳。另一篇 Outstanding Paper「On the Expressivity of Markov Reward」則從理論角度探討 MDP 的 reward 表達能力。

AAAI 2021 的另一篇 Outstanding Paper「Exploration-Exploitation in Multi-Agent Learning: Catastrophe Theory Meets Game Theory」則把 catastrophe theory 引入多智能體學習的分析。

RL 在 2021 年的特點是**理論深化**多於**應用擴張**——核心問題（探索、評估、multi-agent）被更嚴謹地處理，但 RL 的實際應用場景還沒有像後來的 RLHF 那樣找到殺手級用途。

## 開始被重視：公平性、偏見與倫理

2021 年是 AI 倫理和公平性研究在頂會的存在感明顯提升的一年。

**ACL 2021 的 Best Theme Paper 是「Including Signed Languages in Natural Language Processing」**——直接指出 NLP 社群長期忽略手語這種視覺語言形式。NeurIPS 2021 首次引入系統性的 Ethics Review 流程，要求所有投稿附上 broader impact statement。AAAI 2021 設立了 AI for Social Impact 特別軌，Outstanding Paper 頒給了「Mitigating Political Bias in Language Models through Reinforced Calibration」。

ACL 2021 的 Outstanding Papers 中也包含 fairness 相關工作，包括語言模型中性別偏見的量化和緩解方法。

從論文量來看，fairness / bias / ethics 相關論文在 2021 年顯著增加，但跟 Transformer 或自監督學習不同，這個方向的成長更多是「制度推動」——會議主辦方主動設立 ethics review、social impact track、theme paper 等機制，拉動了投稿量。

## 2021 年得獎論文一覽

以下整理九大會議的主要得獎論文，方便快速查閱：

| 會議 | 獎項 | 論文 | 方向 |
|---|---|---|---|
| ICLR | Outstanding Paper | Score-Based Generative Modeling through SDEs | Diffusion Model |
| ICLR | Outstanding Paper | Learning Mesh-Based Simulation with Graph Networks | GNN / 物理模擬 |
| ICLR | Outstanding Paper | EigenGame: PCA as a Nash Equilibrium | 理論 / 博弈論 |
| ICLR | Outstanding Paper | Beyond Fully-Connected Layers with Quaternions | 模型壓縮 |
| ICML | Outstanding Paper | Unbiased Gradient Estimation in Unrolled Computation Graphs with PES | 優化 / 元學習 |
| ICML | Honorable Mention | Understanding Self-Supervised Learning Dynamics without Contrastive Pairs | 自監督學習 |
| ICML | Honorable Mention | Optimal Complexity in Decentralized Training | 去中心化 / FL |
| NeurIPS | Outstanding Paper | A Universal Law of Robustness via Isoperimetry | 理論 / 魯棒性 |
| NeurIPS | Outstanding Paper | MAUVE: Measuring the Gap Between Neural Text and Human Text | 文本生成評估 |
| NeurIPS | Outstanding Paper | Deep RL at the Edge of the Statistical Precipice | RL 評估方法 |
| CVPR | Best Paper | GIRAFFE: Compositional Generative Neural Feature Fields | 3D 生成 / NeRF |
| CVPR | Honorable Mention | Exploring Simple Siamese Representation Learning | 自監督學習 |
| ICCV | Best Paper | Swin Transformer | Vision Transformer |
| ICCV | Honorable Mention | Mip-NeRF | 3D / NeRF |
| ACL | Best Paper | Vocabulary Learning via Optimal Transport for NMT | 機器翻譯 |
| ACL | Best Theme | Including Signed Languages in NLP | 語言多樣性 |
| EMNLP | Best Long Paper | Visually Grounded Reasoning across Languages and Cultures | 多模態 / 多語言 |
| AAAI | Outstanding Paper | Informer: Beyond Efficient Transformer for Long Sequence Forecasting | Transformer / 時序 |
| AAAI | Outstanding Paper | Exploration-Exploitation in Multi-Agent Learning | 多智能體 / 博弈論 |

## 站在 2026 年回頭看：哪些選擇的回報最高

如果一個研究者在 2021 年初決定投入某個方向，到 2026 年的回報（以論文引用、後續工作量、產業影響力衡量）差異極大：

**最高回報方向**：
- **Diffusion Model**：2021 年進入的人拿到了先發優勢。2022 年 Stable Diffusion 和 DALL·E 2 爆發後，所有 2021 年的基礎工作（score-based SDE、classifier guidance）都成為高引用論文。Yang Song 的 ICLR 2021 Outstanding Paper 截至 2026 年的引用數已超過 4,000。
- **Vision Transformer**：Swin Transformer 成為後續兩年 CV 領域最常用的 backbone，引用數超過 15,000。所有在 2021 年投入 ViT 變體研究的人都趕上了這波紅利。
- **多模態學習**：CLIP 帶動的 vision-language 方向在 2022-2025 年持續爆發，成為 GPT-4V、Gemini 等多模態大模型的基礎。

**穩定但沒有爆發**：
- **自監督學習**：2021 年的熱度在 2022 年之後被「大模型直接用大量數據做預訓練」的路線部分取代。方向沒有消失，但不再是獨立的熱門關鍵詞，而是被吸收進「foundation model」的敘事中。
- **強化學習**：穩定成長，但真正的殺手級應用（RLHF for ChatGPT）要到 2022 年 InstructGPT 才出現。2021 年投入 RL 理論的人受益程度取決於他們是否有跟上 RLHF 這條分支。

**已經過了高峰**：
- **GNN**：2021 年是高峰，之後論文量趨平。方向沒有死掉但不再是獨立的熱門 track，更多是作為分子建模、推薦系統等具體應用裡的工具。
- **Federated Learning**：類似 GNN，2021 年後理論問題大致被探索完畢，剩下的工作更偏工程和部署。
- **傳統 GAN 改進**：在 Diffusion Model 證明能打敗 GAN 之後，純粹改進 GAN 架構的論文量明顯下降。

**結論很直接**：2021 年的 ICLR Outstanding Paper（Diffusion Model）和 ICCV Best Paper（Swin Transformer）兩篇得獎論文，事後證明是接下來四年裡影響力最大的方向的起點。評審委員會在這兩個案例裡的判斷是準確的——得獎論文不只是「當年做得好的工作」，而是對後續研究方向有預測力的訊號。

---

## 參考資料

- [ICLR 2021 Outstanding Paper Awards（官方公告，ICLR 官方 Medium）](https://iclr-conf.medium.com/announcing-iclr-2021-outstanding-paper-awards-9ae0514734ab)
- [NeurIPS 2021 Award Recipients（官方公告）](https://blog.neurips.cc/2021/11/30/announcing-the-neurips-2021-award-recipients/)
- [ICML 2021 Awards（官方頁面）](https://icml.cc/virtual/2021/awards_detail)
- [CVPR 2021 Paper Awards（官方頁面）](https://cvpr2021.thecvf.com/node/329)
- [ICCV 2021 Paper Awards（官方頁面）](https://iccv2021.thecvf.com/iccv-2021-paper-awards)
- [ACL 2021 Paper Awards（官方頁面）](https://2021.aclweb.org/program/accept)
- [EMNLP 2021 Best Long Paper: Visually Grounded Reasoning across Languages and Cultures（ACL Anthology）](https://aclanthology.org/2021.emnlp-main.818)
- [AAAI 2021 Outstanding and Distinguished Papers（官方頁面）](https://aaai.org/conference/aaai/aaai-21/aaai-outstanding-and-distinguished-papers/)
- [Khanbayov et al. (2026) "Topical Phase Transitions in Artificial Intelligence Research: Large-Scale Evidence and an Early-Warning Signature for Emerging Topics"（arXiv:2606.12828，80,814 篇主軌論文的跨會議主題分析）](https://arxiv.org/abs/2606.12828)
- [SarahRastegar/Best-Papers-Top-Venues（GitHub，各頂會歷年 Best Paper 彙整）](https://github.com/SarahRastegar/Best-Papers-Top-Venues)
- [Dhariwal & Nichol (2021) "Diffusion Models Beat GANs on Image Synthesis"（NeurIPS 2021）](https://arxiv.org/abs/2105.05233)
- [Radford et al. (2021) "Learning Transferable Visual Models From Natural Language Supervision"（CLIP, ICML 2021）](https://arxiv.org/abs/2103.00020)
