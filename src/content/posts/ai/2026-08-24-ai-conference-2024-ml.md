---
title: "2024 AI 頂會導讀：機器學習篇"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, neurips, icml, iclr, aaai, ijcai, "2024", machine-learning, inference-scaling, diffusion-model]
lang: zh-TW
tldr: "2024 年是 ML 頂會投稿量爆炸的一年：NeurIPS 收到 15,671 篇創歷史紀錄，ICML 和 ICLR 也分別突破九千和七千。研究主題從「把模型練更大」轉向「推論時怎麼花算力更聰明」——test-time compute scaling 成為年度最重要的新方向。Best Paper 層面，VAR 用 next-scale prediction 在影像生成上超越 diffusion、Rectified Flow 成為 Stable Diffusion 3 的理論基礎、ICLR 首次頒發 Test of Time Award 給 VAE 原論文。"
description: "2024 年 NeurIPS、ICML、ICLR 三大機器學習會議以及 AAAI、IJCAI 的得獎論文、高影響力研究、與年度趨勢完整導讀。涵蓋 test-time compute scaling 崛起、Rectified Flow 與影像生成新典範、AI agent 框架爆發、Mixture-of-Experts 主流化，以及投稿量暴增對審稿體系的衝擊。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 18
glossary:
  - term: "test-time compute"
    definition: "在推論（inference）階段投入更多運算資源來提升模型表現，例如讓模型花更多步驟推理或產生多個候選答案再篩選，跟傳統靠加大模型參數量來提升表現是不同的 scaling 軸。"
    context: "2024 年多篇論文證明推論時多花算力的效益可以超過等量的預訓練 scaling。"
  - term: "rectified flow"
    definition: "一種生成模型的訓練框架，讓資料與雜訊之間以直線路徑連接，使得推論時只需要更少的取樣步驟就能產生高品質結果。Stable Diffusion 3 的理論基礎。"
    context: "ICML 2024 Best Paper 之一就是 rectified flow 的 scaling 研究。"
---

> 🌏 [English version](/posts/ai/2026-08-24-ai-conference-2024-ml-en)

> 本文是[「AI 頂會導讀」系列](/tags/ai-conference)的一部分。系列總覽見[〈AI 頂會是什麼〉](/posts/ai/2026-08-23-what-is-ai-top-conference)。

2024 年是 ML 頂會歷史上最擁擠的一年。NeurIPS 投稿量首次突破 15,000 篇，ICML 逼近萬篇，ICLR 也站上 7,400 的新高。但最值得注意的不是規模本身——而是這一年的研究重心出現了明確的轉向：從「怎麼把模型練更大」到「怎麼在推論時花算力花得更聰明」，test-time compute scaling 成為年度最重要的新主題。

## NeurIPS 2024

投稿 15,671 / 接受 4,037（25.8%）。投稿量比 2023 年的 12,343 成長 27%，但接受率幾乎不變，意味著篩選壓力全部轉嫁到審稿端。

### Best Paper Awards

NeurIPS 2024 的 Best Paper 分成 Main Track 和 Datasets & Benchmarks Track 兩條線，主軌有 2 篇 Best Paper 和 2 篇 Runner-Up：

**Best Paper（主軌）**

1. **Visual Autoregressive Modeling: Scalable Image Generation via Next-Scale Prediction**
   — Keyu Tian, Yi Jiang, Zehuan Yuan, Bingyue Peng, Liwei Wang（北京大學 / 字節跳動）

   提出 Visual AutoRegressive（VAR）方法，把影像生成從「逐像素預測 next-token」改成「逐解析度預測 next-scale」。這個看似簡單的 reformulation 效果驚人：在 ImageNet 上超越 diffusion model 的 FID，同時推論速度快 20 倍。這篇論文的核心洞見是 autoregressive 模型在影像上表現差，不是 AR 本身的問題，而是 tokenization 順序的問題。

2. **Stochastic Taylor Derivative Estimator: Efficient Amortization for Arbitrary Differential Operators**
   — Zekun Shi, Zheyuan Hu, Min Lin, Kenji Kawaguchi（新加坡國立大學 / Sea AI Lab）

   提出 STDE 方法，能在單一 GPU 上幾分鐘內解百萬維度的偏微分方程——之前的方法要用整個叢集跑好幾天。技術上是把微分運算子的計算成本從 O(n) 壓到 O(1)，透過隨機 Taylor 展開攤銷掉梯度計算。

**Best Paper Runner-Up（主軌）**

3. **Not All Tokens Are What You Need for Pretraining**
   — Zhenghao Lin, Zhibin Gou, Yeyun Gong, Xiao Liu, Yelong Shen, Ruochen Xu, Chen Lin, Yujiu Yang, Jian Jiao, Nan Duan, Weizhu Chen（清華大學 / Microsoft Research）

   提出 Rho-1 語言模型，核心想法是：預訓練時不需要每個 token 都學，只學「有價值的」token 就好。用一個參考模型的 perplexity 來篩選 token，在 few-shot 數學推理上提升 30%，同時大幅減少訓練所需的 compute。

4. **Guiding a Diffusion Model with a Bad Version of Itself**
   — Tero Karras, Miika Aittala, Tuomas Kynkäänniemi, Jaakko Lehtinen, Timo Aila, Samuli Laine（NVIDIA）

   發現可以用模型自己的「較差版本」（訓練不足或架構較小的版本）來做 guidance，取代需要額外分類器的 classifier-free guidance。效果不僅不亞於傳統方法，還能在不犧牲多樣性的情況下達到更高品質——在 ImageNet 上創下新紀錄。

**Best Paper（Datasets & Benchmarks Track）**

5. **The PRISM Alignment Dataset: What Participatory, Representative and Individualised Human Feedback Reveals About the Subjective and Multicultural Alignment of Large Language Models**
   — Hannah Rose Kirk 等（牛津大學 / Cohere）

   從 75 個國家的 1,500 名參與者收集 LLM alignment 回饋，揭示現有 RLHF 方法忽略了文化差異和個體偏好的多樣性。這是第一個真正跨文化、大規模的 alignment 資料集。

### Test of Time Award

NeurIPS 2024 的 Test of Time Award 頒給了兩篇 2014 年的論文：

- **Generative Adversarial Nets** — Ian Goodfellow 等人。引用數超過 85,000 次，開啟了整個生成模型的時代。
- **Sequence to Sequence Learning with Neural Networks** — Ilya Sutskever, Oriol Vinyals, Quoc V. Le（Google）。用 LSTM 做序列到序列的翻譯，奠定了現代 NMT 和後來 Transformer 出現的基礎。

### 高影響力非得獎論文

- **Scaling LLM Test-Time Compute Optimally Can Be More Effective Than Scaling Model Parameters**（Charlie Snell, Jaehoon Lee, Kelvin Xu, Aviral Kumar；Google DeepMind）——年度最受討論的論文之一，直接證明在推論時投入更多算力（讓模型多想幾步），效益可以超過等量的預訓練 parameter scaling。這篇論文某種程度上定義了 2024 年 ML 研究的方向轉折。
- **Large Language Models Must Be Taught to Know What They Don't Know**——用 1,000 個樣本微調就能顯著改善 LLM 的不確定性校準，讓模型更可靠地區分「知道」和「不知道」的問題。
- **The Mamba in the Llama: Distilling and Accelerating Hybrid Models**——把大型 Transformer 蒸餾成 Transformer-SSM 混合架構，在保持對話能力的同時大幅加速推論。State space model（如 Mamba）在 2024 年持續是 Transformer 的最強競爭者。
- **You Don't Need Domain-Specific Data Augmentations When Scaling Self-Supervised Learning**——在 scale 夠大的時候，只用最基本的 cropping 做 data augmentation 就能達到 state-of-the-art，打破了「自監督學習需要精心設計 augmentation 策略」的假設。
- **Why Do We Need Weight Decay in Modern Deep Learning?**——提供了 weight decay 在現代深度學習中的理論理解，發現它在視覺和語言模型上的作用機制根本不同。

## ICML 2024

投稿 9,473 / 接受 2,609（27.5%）。在維也納舉辦（7 月 21-27 日），共有 10 篇 Best Paper。

### Best Paper Awards

1. **Scaling Rectified Flow Transformers for High-Resolution Image Synthesis**
   — Patrick Esser, Sumith Kulal, Andreas Blattmann, Rahim Entezari, Jonas Müller, Harry Saini, Yam Levi, Dominik Lorenz, Axel Sauer, Frederic Boesel, Dustin Podell, Tim Dockhorn, Zion English, Robin Rombach（Stability AI）

   這篇是 Stable Diffusion 3 的理論基礎。透過改進 rectified flow 模型的 noise sampling 策略（偏向 perceptually relevant scales），並做了從 450M 到 8B 參數的大規模 scaling study，證明 rectified flow + MMDiT backbone 在高解析度文生圖上全面超越傳統 diffusion formulation。更重要的是 scaling 曲線沒有飽和跡象。

2. **Debating with More Persuasive LLMs Leads to More Truthful Answers**
   — Akbir Khan, John Hughes, Dan Valentine, Laura Ruis, Kshitij Sachan, Ansh Radhakrishnan, Edward Grefenstette, Samuel R. Bowman, Tim Rocktäschel, Ethan Perez（Anthropic / UCL / NYU）

   讓 LLM 之間辯論來提升答案的真實性——即使辯論的 LLM 更有說服力，人類判官仍然能在辯論後做出更準確的判斷。這對 AI safety 的 scalable oversight 問題很有意義：它提供了一種不需要人類自己懂答案、也能判斷 AI 是否正確的機制。

3. **Position: Considerations for Differentially Private Learning with Large-Scale Public Pretraining**
   — Florian Tramèr, Gautam Kamath, Nicholas Carlini（ETH Zürich / 滑鐵盧大學 / Google DeepMind）

   Position paper 直接質疑當前 DP-SGD 搭配大規模公開資料預訓練的做法：如果預訓練資料本身就包含敏感資訊（而且大模型會記住它），那微調階段的 differential privacy 保護了什麼？點出了 DP + foundation model 生態的根本矛盾。

4. **Genie: Generative Interactive Environments**
   — Jake Bruce, Michael Dennis, Ashley Edwards, Jack Parker-Holder 等（Google DeepMind）

   從網路影片中學會生成可互動的 2D 遊戲環境——不是單純生成影片，而是真的能接收動作輸入並產生相應的下一幀。這是 world model 從「觀看」到「互動」的關鍵跳躍。

5. **Position: Measure Dataset Diversity, Don't Just Claim It**
   — Dora Zhao, Jerone Andrews, Orestis Papakyriakopoulos, Alice Xiang（Sony AI）

   另一篇 Position paper，指出 ML 領域許多論文聲稱自己的資料集「多元」，但缺乏量化指標支持。提出了量化 dataset diversity 的框架。

6. **Stealing Part of a Production Language Model**
   — Nicholas Carlini, Daniel Paleka, Krishnamurthy Dvijotham, Thomas Steinke 等（Google DeepMind / ETH Zürich）

   展示可以從生產環境中的語言模型 API 逆向工程出模型的部分內部結構（包括 embedding dimension 和最後一層的精確權重），成本只需要幾美元的 API 呼叫。對 model-as-a-service 的安全假設是直接挑戰。

7. **VideoPoet: A Large Language Model for Zero-Shot Video Generation**
   — Dan Kondratyuk, Lijun Yu, Xiuye Gu, Jose Lezama, Jonathan Huang 等（Google Research）

   用一個統一的大型語言模型架構同時處理文字到影片、影像到影片、影片編輯等多種任務。跟 Sora 同期但走的是 LLM tokenization 路線而非 diffusion 路線。

8. **Discrete Diffusion Modeling by Estimating the Ratios of the Data Distribution**
   — Aaron Lou, Chenlin Meng, Stefano Ermon（Stanford）

   把 diffusion model 的連續空間方法擴展到離散資料（如文字），透過估計資料分布的比率而非直接估計分布本身。為離散資料的生成模型提供了新的理論框架。

9. **Probabilistic Inference in Language Models via Twisted Sequential Monte Carlo**
   — Stephen Zhao 等

   用 twisted SMC 方法在語言模型上做精確的機率推論，能夠從有約束條件的分布中取樣——比如「生成一段同時滿足某種風格和某種事實約束的文字」。

10. **Information Complexity of Stochastic Convex Optimization: Applications to Generalization, Memorization, and Tracing**
    — Idan Attias, Gintare Karolina Dziugaite, Mahdi Haghifam, Roi Livni, Daniel Roy

    從資訊理論角度統一了泛化、記憶和資料追蹤三個看似不同的問題，證明它們底層是同一個 information complexity 度量。

### Test of Time Award

**DeCAF: A Deep Convolutional Activation Feature for Generic Visual Recognition**（Jeff Donahue, Yangqing Jia, Oriol Vinyals, Judy Hoffman, Ning Zhang, Eric Tzeng, Trevor Darrell；ICML 2014）。在 2014 年 CNN 還未被廣泛信任的年代，這篇論文證明了凍結預訓練 CNN（AlexNet）的權重、只訓練最後一層線性層，就能在多種視覺任務上大幅提升效能——也就是後來 transfer learning 和 feature extraction 的原型。

## ICLR 2024

投稿 7,401 / 接受 2,261（30.5%）。2024 年是 ICLR 首次頒發 Test of Time Award 的歷史性一年。

### Outstanding Paper Awards（5 篇）

1. **Generalization in Diffusion Models Arises from Geometry-Adaptive Harmonic Representations**
   — Zahra Kadkhodaie, Florentin Guth, Eero P. Simoncelli, Stéphane Mallat（NYU / Flatiron Institute）

   從數學上解釋為什麼 diffusion model 能泛化——不是靠記憶訓練資料，而是因為它們學到了資料流形的幾何自適應調和表示。這篇為 diffusion model 的「為什麼 work」提供了迄今最嚴謹的理論框架。

2. **Learning Interactive Real-World Simulators**
   — Sherry Yang, Yilun Du, Seyed Kamyar Seyed Ghasemipour, Jonathan Tompson, Leslie Pack Kaelbling, Dale Schuurmans, Pieter Abbeel（Google DeepMind / MIT / Berkeley）

   UniSim——從文字和動作指令生成互動式的真實世界模擬。跟 Genie（ICML 2024）是同一個方向但更進一步：不只能互動，還能模擬真實物理世界的場景。

3. **Never Train from Scratch: Fair Comparison of Long-Sequence Models Requires Data-Driven Priors**
   — Ido Amos, Jonathan Berant, Ankit Gupta

   挑戰了長序列建模領域的一個常見實驗設計缺陷：很多論文從零開始訓練模型然後比較，但如果考慮從預訓練模型遷移學習，結論可能完全不同。提出更公平的比較方法論。

4. **Protein Discovery with Discrete Walk-Jump Sampling**
   — Nathan C. Frey, Dan Berenberg 等（Prescient Design / NYU）

   用離散的 walk-jump sampling 方法做蛋白質設計，在抗體設計任務上效果超越現有方法。AI for Science 的代表性工作。

5. **Vision Transformers Need Registers**
   — Timothée Darcet, Maxime Oquab, Julien Mairal, Piotr Bojanowski（Meta FAIR / Inria）

   發現 ViT 的注意力圖中存在「artifact tokens」——模型會把某些 token 當作暫存器使用而非真正關注圖像內容。在輸入中加入明確的 register tokens 就能消除這個問題，同時提升下游任務效能。簡單、elegant、影響深遠。

### Honorable Mention（11 篇，節選重點）

- **Model Tells You What to Discard: Adaptive KV Cache Compression for LLMs**（Microsoft Research）——提出 FastGen，根據注意力模式自適應壓縮 KV cache，在不損失品質的前提下減少 LLM 推論時的記憶體用量。在長上下文推論場景下特別關鍵。
- **Proving Test Set Contamination in Black-Box Language Models**（Stanford）——提出統計方法，能在只有 API 存取權限的黑盒設定下，嚴謹地證明語言模型的訓練資料是否包含特定的測試集。
- **Robust Agents Learn Causal World Models**（Google DeepMind）——理論證明：如果一個 agent 在分布外的環境中仍然表現良好（robust），那它一定學到了因果世界模型而非僅僅是統計關聯。
- **Amortizing Intractable Inference in Large Language Models**（Mila / Yoshua Bengio 組）——用 GFlowNet 在 LLM 上做精確的機率推論，跟 ICML 的 twisted SMC 論文異曲同工。
- **Flow Matching on General Geometries**（Meta AI / Ricky T. Q. Chen, Yaron Lipman）——把 flow matching 從歐幾里得空間推廣到任意幾何結構，為蛋白質、分子等非平面資料的生成模型奠定基礎。

### Test of Time Award（首屆）

**Auto-Encoding Variational Bayes** — Diederik P. Kingma, Max Welling（阿姆斯特丹大學）。ICLR 2014 的論文，提出 Variational Autoencoder（VAE），引入 reparameterization trick 把深度學習和可擴展的變分推論結合起來。作為 ICLR 的首屆 Test of Time Award，Program Chairs 回顧了 ICLR 2013 和 2014 兩年的論文，選出這篇影響最持久的作品。

## AAAI 2024

投稿 9,862 / 接受 2,342（23.8%）。

### Outstanding Paper Awards（3 篇）

1. **Reliable Conflictive Multi-view Learning** — Cai Xu, Jiajun Si, Ziyu Guan, Wei Zhao, Yue Wu, Xiyue Gao。處理多視角學習中不同視角互相矛盾的情況，提出可靠的融合方法。

2. **GxVAEs: Two Joint VAEs Generate Hit Molecules from Gene Expression Profiles** — Chen Li, Yoshihiro Yamanishi。用兩個聯合的 VAE 從基因表達圖譜生成候選藥物分子，AI for Drug Discovery 的代表性工作。

3. **Proportional Aggregation of Preferences for Sequential Decision Making** — Nikhil Chandak, Shashwat Goel, Dominik Peters。在序列決策中如何按比例聚合多個利害關係人的偏好，跨 AI 與社會選擇理論的交叉。

### Classic Paper Award

**Maximum Entropy Inverse Reinforcement Learning** — Brian Ziebart, Andrew Maas, J. Andrew Bagnell, Anind K. Dey（AAAI 2008）。用最大熵原理解逆強化學習問題，成為後來 IRL 和模仿學習領域的基石方法。

## IJCAI 2024

投稿 5,651 / 接受 791（14.0%）。IJCAI 的接受率一向是主要 AI 會議中最低的。

### Distinguished Paper Awards（3 篇）

1. **Online Combinatorial Optimization with Group Fairness Constraints** — Negin Golrezaei, Rad Niazadeh, Kumar Kshitij Patel, Fransisca Susan。把公平性約束引入線上組合最佳化問題。

2. **Enhancing Controlled Query Evaluation Through Epistemic Policies** — Gianluca Cima, Domenico Lembo, Lorenzo Marconi, Riccardo Rosati, Domenico Fabio Savo。用認知策略增強受控查詢評估的保密性保護。

3. **Online Learning of Capacity-Based Preference Models** — Margot Herin, Patrice Perny, Nataliya Sokolovska（LIP6, Sorbonne Université）。學習非可加集合函數的偏好模型。

IJCAI 2024 的三篇 Distinguished Paper 有一個明顯特徵：它們都偏向理論和形式化方法，而非當年主流的 LLM/生成模型方向——這反映了 IJCAI 作為「AI 綜合」會議與 ML 三大的選題差異。

## 2024 年整體觀察

### 投稿量爆炸

五場主要會議的投稿量全部創下歷史新高。NeurIPS 一年就成長了 27%（12,343→15,671），ICML 成長 45%（6,538→9,473）。背後原因很直觀：2023 年底 ChatGPT 帶動的 AI 熱潮讓全球 AI 研究人口膨脹，同時也吸引了大量原本不在 ML 領域的研究者開始投稿。對審稿系統的壓力已經到了臨界點——NeurIPS 2024 動用了超過 2 萬名審稿人。

### 從預訓練 scaling 到推論時 scaling

2024 年 ML 研究最顯著的方向轉移：「scaling laws」的關注點從「用更多資料和 compute 訓練更大的模型」轉向「在推論時用更多 compute 讓模型表現更好」。Charlie Snell 等人在 NeurIPS 的論文直接證明了推論時 scaling 的效益可以超過等量的預訓練 scaling——這個結果在理論和實務上都有重大含義：它暗示著未來的效能提升可能不需要不斷增加模型大小，而是靠更聰明的推論策略。

這個方向在 2024 年底 OpenAI 的 o1 模型上得到了產品層面的驗證。

### Diffusion vs. Autoregressive 的雙線競爭

影像生成在 2024 年出現了有趣的雙線並進：

- Diffusion 陣營的 Rectified Flow（ICML Best Paper）成為 Stable Diffusion 3 的基礎，證明 flow-based 方法在高解析度生成上可以全面取代傳統 DDPM。
- AR 陣營的 VAR（NeurIPS Best Paper）則用 next-scale prediction 在 ImageNet 上超越 diffusion，且推論速度快 20 倍。

兩條路線都在 2024 年交出了強結果，誰會勝出——或者是否會融合——仍然是開放問題。

### World Model 與互動式環境

Genie（ICML）和 UniSim（ICLR）都在做同一件事：從觀察中學會可互動的世界模型。這比單純生成影片更難也更有用——如果 AI agent 要在真實世界中行動，它需要的是一個可以「想像行動後果」的模型，而不只是一個能生成好看影片的模型。2024 年是 world model 從概念走向具體技術路線的一年。

### AI Agent 框架爆發

雖然 Best Paper 層面 agent 相關的論文不算多，但 2024 年頂會的 poster session 和 workshop 裡 agent 主題的論文密度明顯跳升。ReAct、Toolformer 這些 2023 年的基礎框架在 2024 年被大量擴展：multi-agent 架構、agent 記憶系統、agent 評估方法（benchmark）都開始成形。ICLR 的「Robust Agents Learn Causal World Models」從理論角度為 agent 研究提供了一個重要的定錨：robust agent 必然學到因果模型。

### 跟 2023 年相比

| 維度 | 2023 | 2024 |
|---|---|---|
| 最熱話題 | LLM alignment / RLHF / instruction tuning | Test-time compute / inference scaling |
| 影像生成 | Diffusion 一家獨大 | Diffusion vs AR 雙線並進 |
| 效率研究 | LoRA、QLoRA 等微調效率 | KV cache 壓縮、selective token training |
| 安全/隱私 | Alignment 為主 | 模型竊取、DP 矛盾、資料集多元性 |
| 投稿量級 | NeurIPS ~12K, ICML ~6.5K | NeurIPS ~15.7K, ICML ~9.5K |

### 後見之明：2024 年哪些論文影響最持久

站在 2026 年回看，2024 年影響最大的五篇論文大概是：

1. **Test-Time Compute Scaling**（NeurIPS）——直接催生了 o1、o3 等 reasoning 模型的理論基礎。
2. **Scaling Rectified Flow Transformers**（ICML）——成為 Stable Diffusion 3 / Flux 等主流影像生成模型的架構。
3. **VAR**（NeurIPS）——重新打開了 AR 影像生成的路線，GPT-4o 的影像功能沿著這個方向走。
4. **Vision Transformers Need Registers**（ICLR）——簡單發現但影響了後續幾乎所有 ViT 的訓練。
5. **Robust Agents Learn Causal World Models**（ICLR）——為 2025-2026 年 agent 研究的理論基礎提供了方向。

---

## 參考資料

- [NeurIPS Blog — Announcing the NeurIPS 2024 Best Paper Awards](https://blog.neurips.cc/2024/12/10/announcing-the-neurips-2024-best-paper-awards/)
- [NeurIPS Blog — Announcing the NeurIPS 2024 Test of Time Paper Awards](https://blog.neurips.cc/2024/11/27/announcing-the-neurips-2024-test-of-time-paper-awards/)
- [NeurIPS 2024 Fact Sheet（官方 PDF）](https://media.neurips.cc/Conferences/NeurIPS2024/press/NeurIPS2024-Fact_Sheet.pdf)
- [ICML 2024 Best Paper Awards（官方頁面）](https://icml.cc/virtual/2024/38324)
- [ICML 2024 Fact Sheet（官方 PDF）](https://media.icml.cc/Conferences/ICML2024/ICML2024_Fact_Sheet.pdf)
- [ICML 2024 Test of Time Award: DeCAF](https://joltml.com/icml-2024/test-of-time-decaf/)
- [ICLR 2024 Outstanding Paper Awards — ICLR Blog](https://blog.iclr.cc/2024/05/06/iclr-2024-outstanding-paper-awards/)
- [ICLR 2024 Test of Time Award — ICLR Blog](https://blog.iclr.cc/2024/05/07/iclr-2024-test-of-time-award/)
- [ICLR 2024 Press Release（官方 PDF）](https://media.iclr.cc/Conferences/ICLR2024/ICLR2024_Press_Release.pdf)
- [AIhub — Congratulations to the AAAI 2024 outstanding paper winners](https://aihub.org/2024/02/26/congratulations-to-the-aaai2024-outstanding-paper-winners/)
- [AIhub — Congratulations to the IJCAI 2024 distinguished paper award winners](https://aihub.org/2024/08/07/congratulations-to-the-ijcai2024-distinguished-paper-award-winners/)
- [Turing Post — 12 Remarkable Research Papers from NeurIPS 2024](https://www.turingpost.com/p/neurips-2024-papers)
- [Amplify Partners — NeurIPS 2024: Main Themes and Takeaways](https://www.amplifypartners.com/blog-posts/neurips-2024-main-themes-and-takeaways)
- [GitHub — Top-Conference-Best-Papers（2022-2026 得獎論文彙整）](https://github.com/FeijiangHan/Top-Conference-Best-Papers)
- [Stanford AI News — Congratulations to Aaron Lou, Chenlin Meng and Stefano Ermon for an ICML 2024 Best Paper Award](https://ai.stanford.edu/news/congratulations-to-aaron-lou-chenlin-meng-and-stefano-ermon-for-an-icml-2024-best-paper-award)
- [University of Waterloo — Gautam Kamath and international colleagues win best paper award at ICML 2024](https://uwaterloo.ca/computer-science/news/gautam-kamath-and-international-colleagues-win-best-paper-at-icml-2024)
