---
title: "2021 AI 頂會導讀：機器學習篇"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, neurips, icml, iclr, aaai, ijcai, "2021", machine-learning, diffusion-model, self-supervised-learning, reinforcement-learning]
lang: zh-TW
tldr: "2021 年是 diffusion model 超越 GAN、自監督學習理論突破、RL 評估方法論覺醒的一年。NeurIPS 收了 9,122 篇投稿創當時紀錄，ICLR 的 Score-Based Generative Modeling 論文日後成為整個 diffusion 生態的理論基石，ICML 則在優化理論與自監督學習動力學分析上交出紮實貢獻。"
description: "2021 年 NeurIPS、ICML、ICLR 三大機器學習會議以及 AAAI、IJCAI 的得獎論文、高影響力論文、與年度趨勢完整導讀。涵蓋 diffusion model 崛起、自監督學習理論化、RL 評估方法論反思、Transformer 架構實驗（MLP-Mixer、Decision Transformer）等關鍵進展，並以後見之明回顧哪些 2021 年論文真正改變了後續研究方向。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 6
glossary:
  - term: "diffusion model"
    definition: "一類生成模型：先在訓練資料上逐步加噪（forward process），再學一個去噪網路把噪音逆轉回資料（reverse process）。2021 年被證明在影像生成品質上超越 GAN。"
    context: "NeurIPS 2021 的 Diffusion Models Beat GANs 與 ICLR 2021 的 Score-Based Generative Modeling through SDEs 是 diffusion 生態的兩大基石論文。"
  - term: "self-supervised learning（自監督學習）"
    definition: "不依賴人工標註，從資料本身的結構設計預訓練任務（如遮蔽預測、對比學習）來學表徵。2021 年的研究重心從『能不能 work』轉向『為什麼 work』的理論分析。"
    context: "ICML 2021 的 DirectPred 論文首次從非線性動力學角度解釋 BYOL/SimSiam 等非對比式 SSL 為什麼不會崩塌。"
  - term: "GAN（生成對抗網路）"
    definition: "由生成器與判別器對抗訓練的生成模型，2014 年提出後長期主導影像生成領域，直到 2021 年被 diffusion model 在 FID 指標上超越。"
    context: "Diffusion Models Beat GANs 的標題本身就是一個時代轉折的宣言。"
---

> 🌏 [English version](/posts/ai/2026-08-24-ai-conference-2021-ml-en)

2021 年是機器學習會議的轉折年。投稿量還沒到後來 2024–2025 年的爆炸程度，但已經在快速爬升；更重要的是，幾個日後定義整個領域走向的研究方向——diffusion model、自監督學習的理論化、RL 評估方法論——都在這一年的頂會上交出了關鍵論文。這篇以 NeurIPS、ICML、ICLR 三大 ML 會議為主軸，附帶 AAAI 與 IJCAI 的重點，整理 2021 年得獎論文與高影響力工作，並用後見之明回看哪些論文真正改變了後來的研究方向。

## NeurIPS 2021

投稿 9,122 篇，接受 2,334 篇（25.6%），是當時投稿量最高的一屆 NeurIPS——這個紀錄在 2022 年就被打破了。最大貢獻機構：Google（177 篇）、Microsoft（116 篇）、DeepMind（81 篇）；學術端 MIT（142 篇）、Stanford（139 篇）、CMU（117 篇）領先。

### Outstanding Paper Awards

NeurIPS 2021 選出六篇 Outstanding Paper（沒有「Best Paper」這個稱呼，改用 Outstanding Paper 已是 NeurIPS 的慣例）：

1. **A Universal Law of Robustness via Isoperimetry** — Sébastien Bubeck, Mark Sellke（Microsoft Research / Stanford）。證明了一個普適定律：如果要讓插值足夠平滑（robust），參數量必須是「僅僅做到插值」所需的 d 倍（d = 資料維度）。這從理論上解釋了為什麼深度學習實務中總是需要大量 over-parameterization。

2. **Deep Reinforcement Learning at the Edge of the Statistical Precipice** — Rishabh Agarwal, Max Schwarzer, Pablo Samuel Castro, Aaron Courville, Marc Bellemare（Google Brain / Mila）。指出 deep RL 論文普遍只跑少數 seed 就用 mean/median 做比較，統計上根本站不住腳。提出 `rliable` 工具包，倡導 interval estimation 與 performance profile。這篇對 RL 社群的影響比任何一篇新演算法都大——它改變的是大家怎麼評估所有演算法。

3. **On the Expressivity of Markov Reward** — David Abel, Will Dabney, Anna Harutyunyan, Mark Ho, Michael Littman, Doina Precup, Satinder Singh（DeepMind / Brown / Princeton）。探討 Markov reward function 的表達能力邊界：證明存在某些合理的「任務」定義是任何 Markov reward 都無法捕捉的。是 reward design 領域少見的、從公理化角度切入的理論貢獻。

4. **MAUVE: Measuring the Gap Between Neural Text and Human Text using Divergence Frontiers** — Krishna Pillutla, Swabha Swayamdiha, Rowan Zellers, John Thickstun, Sean Welleck, Yejin Choi, Zaid Harchaoui（U. Washington / AI2）。提出 MAUVE 指標，用 divergence frontier 比較生成文字與人類文字的分布差異，比 BLEU、perplexity 等既有指標更能反映開放式文字生成的品質。

5. **Moser Flow: Divergence-based Generative Modeling on Manifolds** — Noam Rozen, Aditya Grover, Maximilian Nickel, Yaron Lipman（Weizmann / Meta）。在流形上做連續正規化流的新方法，不需要 ODE solver，訓練效率大幅提升。Lipman 後來提出的 Flow Matching 可以視為這條研究線的延伸。

6. **Continuized Accelerations of Deterministic and Stochastic Gradient Descents, and of Gossip Algorithms** — Mathieu Even, Raphaël Berthier, Francis Bach 等（INRIA / ETH Zürich）。用連續時間框架重新推導 Nesterov 加速，得到更乾淨的收斂分析和首個嚴格加速的非同步 gossip 演算法。

### Datasets & Benchmarks Track Best Papers

2021 年是 NeurIPS 首次設立 Datasets & Benchmarks Track 的一屆：

- **MAUVE**（同時獲得 Outstanding Paper，見上）
- **Benchmarking Multimodal AutoML for Tabular Data with Text Fields** — Xingjian Shi 等（Amazon）

### Test of Time Award

頒給 NeurIPS 2010 的 **Online Learning for Latent Dirichlet Allocation**（Matthew Hoffman, David Blei, Francis Bach）——開創了隨機變分推論的先河，讓 LDA 可以在大規模文本語料上實際跑起來，後續催生了整個 stochastic variational inference 研究方向。

### 不在得獎名單但後來影響深遠的論文

NeurIPS 2021 有幾篇非得獎論文，事後看來影響力遠超多數得獎作品：

- **Diffusion Models Beat GANs on Image Synthesis** — Prafulla Dhariwal, Alexander Nichol（OpenAI）。標題就是結論：用 classifier guidance 讓 diffusion model 在 ImageNet 上的 FID 打敗 BigGAN。這篇在 Paper Digest 的「NeurIPS 歷年最有影響力論文」榜上長期排名 2021 年第一。它不是 diffusion model 的發明（那是 2020 年的 DDPM），但它證明了 diffusion model 可以在實際圖片生成品質上取代 GAN——而 GAN 已經統治影像生成領域七年。

- **SegFormer: Simple and Efficient Design for Semantic Segmentation with Transformers** — Enze Xie 等（HKU / NVIDIA）。用 Transformer encoder + 輕量 MLP decoder 做語義分割，在 ADE20K 上建立新 baseline，被後續大量視覺 Transformer 工作引用。

- **MLP-Mixer: An all-MLP Architecture for Vision** — Ilya Tolstikhin 等（Google Brain）。刻意拿掉 convolution 和 attention，純用 MLP 的 token-mixing 與 channel-mixing 達到有競爭力的 ImageNet 精度。這篇的意義不在提出新 SOTA，而在實驗性地證明「attention 不是唯一的路」，推動了社群重新思考 inductive bias 的必要性。

- **Decision Transformer: Reinforcement Learning via Sequence Modeling** — Lili Chen 等（UC Berkeley）。把 RL 問題重新框架成 sequence modeling：用 Transformer 吃（return, state, action）序列，條件化 desired return 來生成動作。雖然性能不是最強，但「RL as sequence modeling」這個 framing 啟發了後來一整條 offline RL + foundation model 的研究線。

- **NeuS: Learning Neural Implicit Surfaces by Volume Rendering for Multi-view Reconstruction** — Peng Wang 等（HKU / Zhejiang U.）。用 signed distance function + volume rendering 做多視角三維重建。在 neural radiance field（NeRF）之後，NeuS 成為 neural implicit surface 方向的關鍵一步。

## ICML 2021

投稿 5,513 篇，接受 1,184 篇（21.5%）。ICML 在 2021 年的投稿量約為 NeurIPS 的六成，但接受率更嚴格。Google 仍然是最大貢獻機構（超過 100 篇），學術端 Stanford、UC Berkeley、MIT 領先。

### Outstanding Paper Award

- **Unbiased Gradient Estimation in Unrolled Computation Graphs with Persistent Evolution Strategies** — Paul Vicol, Luke Metz, Jascha Sohl-Dickstein（Google Brain / U. Toronto）。針對展開計算圖（unrolled computation graph，例如訓練 learned optimizer 或調超參數）的梯度估計問題，提出 Persistent Evolution Strategies（PES）：把計算圖切成一系列截斷的 unroll，每次 unroll 後做 ES 更新，並用累積修正項消除截斷偏差。兼顧低偏差、低記憶體與快速更新。

### Outstanding Paper Honorable Mentions

- **Oops I Took A Gradient: Scalable Sampling for Discrete Distributions** — Will Grathwohl, Kevin Swersky, Milad Hashemi, David Duvenaud, Chris Maddison（Google Brain / U. Toronto）。用離散分布的似然梯度做 Metropolis-Hastings 提議更新，在 Ising model、RBM、高維離散影像資料等 hard setting 上大幅優於通用 sampler。

- **Understanding Self-Supervised Learning Dynamics without Contrastive Pairs** — Yuandong Tian, Xinlei Chen, Surya Ganguli（Meta AI / Stanford）。首次用非線性學習動力學分析了 BYOL/SimSiam 等非對比式自監督學習方法為什麼不會崩塌到 trivial representation。提出 DirectPred：不用梯度訓練 predictor，直接用輸入統計量設定線性 predictor。理論預測與 ImageNet 上的 ablation 實驗吻合。

- **Optimal Complexity in Decentralized Training** — Yucheng Lu, Christopher De Sa（Cornell）。給出去中心化隨機非凸優化的 tight lower bound，揭示 D-PSGD 等現有演算法的理論 gap，並提出 DeTAG 達到下界。

- **Solving High-Dimensional PDEs with Latent Spectral Models** — Lorenz Richter, Leon Sallandt, Nikolas Nüsken（TU Berlin / Bielefeld）。用 tensor train 格式結合 backward SDE，在高維 PDE 上達到與 neural network 方法可比的精度但計算更高效。

### 不在得獎名單但值得注意的論文

- **Learning Transferable Visual Models From Natural Language Supervision（CLIP）** — Alec Radford 等（OpenAI）。雖然 CLIP 的 arXiv preprint 在 2021 年 1 月就已公開，它正式出現在 ICML 2021 的論文集裡。用 4 億筆（圖片, 文字）配對做對比預訓練，學到可 zero-shot transfer 的視覺表徵。CLIP 是後來 DALL-E 2、Stable Diffusion 等文字到圖片生成模型的核心組件——如果要選一篇定義 2021 年的論文，CLIP 是最強的候選之一。

- **Improved Denoising Diffusion Probabilistic Models** — Alexander Quinn Nichol, Prafulla Dhariwal（OpenAI）。在 DDPM 基礎上做了幾個簡單修改（learned variance schedule、cosine schedule），讓 diffusion model 在 log-likelihood 上也變得有競爭力，不只是 sample quality。

- **Zero-Shot Text-to-Image Generation（DALL-E）** — Aditya Ramesh 等（OpenAI）。用 Transformer 自回歸建模文字與圖片 token，實現文字到圖片生成。DALL-E 本身的影像品質在今天看來已經過時，但它示範了「把影像生成當成 token prediction」的路線可行，啟發了後續所有 autoregressive image generation 工作。

- **Training Data-Efficient Image Transformers & Distillation Through Attention（DeiT）** — Hugo Touvron 等（Facebook AI Research / Sorbonne）。證明 Vision Transformer 不需要 Google 規模的資料（JFT-300M）也能 work——用 ImageNet-1K + 知識蒸餾就夠了。DeiT 讓 ViT 從「只有 Google 才能跑」變成「任何有 8 張 GPU 的實驗室都能跑」。

- **EfficientNetV2: Smaller Models and Faster Training** — Mingxing Tan, Quoc Le（Google）。在 EfficientNet 的基礎上結合 progressive resizing 和 NAS，訓練速度快 5-11 倍。是 ConvNet 陣營在 ViT 浪潮下的最後一批主要改進之一。

## ICLR 2021

投稿 3,014 篇（Paper Copilot 數據），接受 860 篇（28.5%）。ICLR 的接受率在三大 ML 會議中最高，但這也反映了它的投稿池當時規模較小。八篇論文獲得 Outstanding Paper Award。

### Outstanding Paper Awards

1. **Score-Based Generative Modeling through Stochastic Differential Equations** — Yang Song, Jascha Sohl-Dickstein, Diederik P. Kingma, Abhishek Kumar, Stefano Ermon, Ben Poole（Stanford / Google Brain）。建立了 score-based generative model 的統一 SDE 框架，把 SMLD、DDPM 等看似不同的方法統一在同一個連續時間擴散過程下，並給出精確的似然計算方式。這篇是整個 diffusion model 理論體系的奠基論文——後來幾乎所有 diffusion model 的理論分析都從這個 SDE 框架出發。

2. **Learning Mesh-Based Simulation with Graph Networks** — Tobias Pfaff, Meire Fortunato, Alvaro Sanchez-Gonzalez, Peter Battaglia（DeepMind）。用 graph neural network 學 mesh-based 物理模擬（流體、布料），在精度和泛化上都超越傳統 GNN simulator。

3. **EigenGame: PCA as a Nash Equilibrium** — Ian Gemp, Brian McWilliams, Claire Vernade, Thore Graepel（DeepMind）。把 PCA 重新表述成賽局問題：每個特徵向量是一個 player，Nash 均衡對應到 PCA 解。可以在 195TB 規模的資料集上分散式地做 PCA。

4. **Beyond Fully-Connected Layers with Quaternions: Parameterization of Hypercomplex Multiplications with 1/n Parameters** — Aston Zhang 等（AWS / NTU / ETH Zürich / Mila）。把四元數全連接層推廣到任意 n 維超複數，用 1/n 的參數量達到可比性能。

5. **Complex Query Answering with Neural Link Predictors** — Erik Arakelyan, Daniel Daza, Pasquale Minervini, Michael Cochez（UCL / VU Amsterdam）。用 neural link predictor 回答知識圖譜上的複雜查詢（存在量化、合取、析取），不需要把整個圖嵌入到向量空間。

6. **Rethinking Architecture Selection in Differentiable NAS** — Ruochen Wang 等（UCLA）。指出 DARTS 等可微分 NAS 方法的 architecture selection 步驟有根本缺陷——supernet 的權重共享導致架構排名與獨立訓練的排名不一致——並提出修正方案。

7. **Neural Synthesis of Binaural Speech from Mono Audio** — Alexander Richard 等（Facebook Reality Labs）。用 neural network 從單聲道語音 + 頭部相關轉換函數合成雙耳音頻，用於 VR/AR 場景的空間音效。

8. **Optimal Rates for Averaged Stochastic Gradient Descent under Neural Tangent Kernel Regime** — Atsushi Nitanda, Taiji Suzuki（U. Tokyo / RIKEN）。在 NTK regime 下給出 averaged SGD 的最優收斂率，填補了理論空白。

### 值得注意的非得獎論文

- **How Neural Networks Extrapolate: From Feedforward to Graph Neural Networks** — 據報導是 ICLR 2021 最高評分論文。系統性地研究不同架構的外推行為，發現 ReLU 網路在訓練分布外傾向線性外推。

## AAAI 2021（附帶）

投稿 7,911 篇，接受 1,692 篇（21.4%）。AAAI 的投稿量僅次於 NeurIPS 但接受率更低。

### Outstanding Paper Awards

- **Informer: Beyond Efficient Transformer for Long Sequence Time-Series Forecasting** — Haoyi Zhou 等（北京航空航天大學 / UC Berkeley / Rutgers）。針對長序列時間序列預測的高效 Transformer 架構，用 ProbSparse self-attention 把複雜度從 O(n²) 降到 O(n log n)。在多個長序列預測 benchmark 上大幅超越基線。這篇在 AAAI 2021 得獎論文中引用數最高，成為時間序列 Transformer 的早期代表作。

- **Exploration-Exploitation in Multi-Agent Learning: Catastrophe Theory Meets Game Theory** — Stefanos Leonardos, Georgios Piliouras（SUTD）。用突變理論（catastrophe theory）分析多智能體學習中的 exploration-exploitation 動態，證明 catastrophic transitions 的存在。

### Distinguished Papers

- **On the Tractability of SHAP Explanations** — Guy Van den Broeck 等（UCLA）。分析 SHAP 解釋的計算複雜度。
- **Mitigating Political Bias in Language Models through Reinforced Calibration** — Ruibo Liu 等（Dartmouth）——同時獲得 AI for Social Impact 特別軌道的 Outstanding Paper。
- **Self-Attention Attribution: Interpreting Information Interactions Inside Transformer** — Yaru Hao, Li Dong, Furu Wei, Ke Xu（Microsoft Research Asia / 北京航空航天大學）。

## IJCAI 2021（附帶）

投稿 4,204 篇，接受 587 篇（14.0%）。IJCAI 的接受率在主要 AI 會議中最低。

### Distinguished Paper Awards

IJCAI-21 只頒發了 3 篇 Distinguished Paper，從 587 篇接受論文中選出：

- **Keep Your Distance: Land Division With Separation** — Edith Elkind（Oxford）, Erel Segal-Halevi（Ariel U.）, Warut Suksompong（NUS）。公平分割問題的新變體：要求分配的土地之間有最小間隔距離。
- **On the Relation Between Approximation Fixpoint Theory and Justification Theory** — VUB 團隊。連結兩個知識表示理論框架。

### 其他重要獎項

- **Research Excellence Award**：Richard Sutton（Alberta），表彰其對強化學習基礎理論的終身貢獻。
- **Computers and Thought Award**（傑出青年科學家）：Fei Fang（CMU），表彰其在安全博弈與社會公益 AI 上的工作。

## 2021 年整體觀察

### 三個定義這一年的主題

**1. Diffusion model 從理論到實證的突破**

2020 年 DDPM 論文證明了 diffusion model 能生成有品質的圖片，但還沒有打敗 GAN。2021 年三件事加在一起改變了格局：ICLR 的 Score-Based Generative Modeling through SDEs 建立了理論統一框架，ICML 的 Improved DDPM 解決了 log-likelihood 問題，NeurIPS 的 Diffusion Models Beat GANs 直接在 FID 上終結了 GAN 的統治。到 2021 年底，整個生成模型社群的重心已經從 GAN 轉向 diffusion——而這個轉向在 2022 年的 DALL-E 2、Stable Diffusion 出現後變得不可逆。

**2. 自監督學習的理論化**

BYOL（2020）和 SimSiam（2020）已經證明不需要 negative pairs 也能做自監督學習，但沒有人能說清楚為什麼不會崩塌。2021 年 ICML 的 DirectPred 論文首次給出了基於非線性學習動力學的解釋。同期 ICLR 的 EigenGame 則從另一個角度（博弈論）重新理解表徵學習。自監督學習從「empirically works but theoretically mysterious」開始走向理論化。

**3. RL 評估方法論的覺醒**

NeurIPS 的 RLiable（Deep RL at the Edge of the Statistical Precipice）是 2021 年最不像傳統頂會論文但影響最深遠的工作之一：它不提出新演算法，只提出「你們以前比較演算法的方式統計上根本不合格」。配合 On the Expressivity of Markov Reward 從理論端質疑 reward function 的表達能力，2021 年可以說是 RL 社群開始認真反思自身方法論的一年。

### 跟 2020 年相比的關鍵變化

- **Transformer 從 NLP 全面入侵視覺領域**：ViT（2020 年 arXiv，2021 年 ICLR）打開了大門，DeiT（ICML 2021）讓它平民化，SegFormer（NeurIPS 2021）把它推到語義分割，MLP-Mixer 則在質疑 attention 是否真正必要。2020 年的視覺頂會還是 ConvNet 的天下，2021 年已經是 ViT 主導的格局。

- **投稿量開始加速**：NeurIPS 從 2020 年的 9,467 篇到 2021 年的 9,122 篇看起來略降，但整體趨勢已經很清楚——投稿量在快速膨脹，審稿系統開始承壓（這個壓力在 2024–2025 年爆發成全面危機）。

- **「開源一切」的文化進一步強化**：CLIP、DALL-E 的程式碼和模型權重（或社群復現版本）在論文發表後迅速可用，加速了後續研究。這和 2020 年 GPT-3 只開放 API、不開放權重的做法形成對比。

### 用後見之明看：2021 年哪些論文影響最持久

如果只能從 2021 年三大 ML 會議中選五篇「事後證明最重要」的論文，名單大概是：

1. **Score-Based Generative Modeling through SDEs**（ICLR）——diffusion model 理論基石
2. **CLIP**（ICML）——多模態預訓練的典範
3. **Diffusion Models Beat GANs on Image Synthesis**（NeurIPS）——生成模型典範轉移的臨門一腳
4. **Deep RL at the Edge of the Statistical Precipice**（NeurIPS）——改變了整個 RL 社群的評估標準
5. **Decision Transformer**（NeurIPS）——「RL as sequence modeling」的 framing 啟發了後來 foundation model for RL 的整條研究線

這份名單和當年的得獎名單只有部分重疊——得獎是委員會在論文發表時的判斷，影響力是事後的結果，兩者不一樣是正常的。

---

## 參考資料

- [NeurIPS 2021 Award Recipients（官方公告）](https://blog.neurips.cc/2021/11/30/announcing-the-neurips-2021-award-recipients)
- [NeurIPS 2021 Awards 頁面](https://nips.cc/virtual/2021/awards_detail)
- [NeurIPS 2021 Fact Sheet（官方 PDF）](https://neurips.cc/media/Press/NeurIPS_2021-Fact_Sheet.pdf)
- [ICML 2021 Awards 頁面](https://icml.cc/virtual/2021/awards_detail)
- [ICLR 2021 Outstanding Paper Awards（官方公告）](https://iclr-conf.medium.com/announcing-iclr-2021-outstanding-paper-awards-9ae0514734ab)
- [AAAI-21 Outstanding and Distinguished Papers（官方頁面）](https://aaai.org/conference/aaai/aaai-21/aaai-outstanding-and-distinguished-papers)
- [IJCAI-21 Awards 頁面](https://ijcai-21.org/awards/index.html)
- [IJCAI 2021 Best Paper Award Winners — AIhub](https://aihub.org/2021/08/24/congratulations-to-the-ijcai2021-best-paper-award-winners)
- [NeurIPS 2021 — 6 Outstanding Papers, 2 D&B Best Papers, Test of Time Award — Synced](https://syncedreview.com/2021/12/01/deepmind-podracer-tpu-based-rl-frameworks-deliver-exceptional-performance-at-low-cost-156)
- [AAAI 2021 Best Papers Announced — Synced](https://syncedreview.com/2021/02/04/aaai-2021-best-papers-announced)
- [Most Influential NIPS Papers — Paper Digest](https://www.paperdigest.org/2024/09/most-influential-nips-papers-2024-09)
- [Most Influential ICML Papers — Paper Digest](https://www.paperdigest.org/2023/09/most-influential-icml-papers-2023-09)
- [ML and NLP Research Highlights of 2021 — Sebastian Ruder](https://www.ruder.io/ml-highlights-2021)
- [An Overview of ICML 2021's Publications — VinAI](https://www.vinai.io/an-overview-of-icml-2021s-publications)
- [SarahRastegar/Best-Papers-Top-Venues — GitHub（各年 best paper 彙整）](https://github.com/SarahRastegar/Best-Papers-Top-Venues)
- [Edith Elkind distinguished paper at IJCAI-21 — Oxford CS News](https://www.cs.ox.ac.uk/news/1963-full.html)
