---
title: "2022 AI 頂會導讀：機器學習篇"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, neurips, icml, iclr, aaai, ijcai, "2022", machine-learning, diffusion-model, scaling-laws, chain-of-thought]
lang: zh-TW
tldr: "2022 年是 diffusion model 登上頂會舞台中央、Chinchilla scaling laws 改寫大模型訓練範式、Chain-of-Thought 讓推理成為可提示能力的一年。NeurIPS 破萬篇投稿，13 篇 Outstanding Paper 裡有 3 篇跟 diffusion 直接相關，Chinchilla 和 data pruning 兩篇挑戰了『大就是好』的信條。ChatGPT 年底發佈前夜，所有拼圖都在這一年的頂會上各就各位。"
description: "2022 年 NeurIPS、ICML、ICLR 三大機器學習會議以及 AAAI、IJCAI 的得獎論文、高影響力論文、與年度趨勢完整導讀。涵蓋 Chinchilla scaling laws、FlashAttention、Chain-of-Thought prompting、Imagen、diffusion model 設計空間、InstructGPT 等關鍵進展，並以後見之明回顧哪些 2022 年論文為 ChatGPT 時代鋪好了路。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 10
glossary:
  - term: "scaling laws"
    definition: "描述模型性能如何隨參數量、資料量、計算預算變化的經驗法則。2022 年 Chinchilla 論文改寫了先前 Kaplan et al. (2020) 的結論，證明資料量應與模型大小等比例增長。"
    context: "NeurIPS 2022 Outstanding Paper 'An empirical analysis of compute-optimal large language model training' 即 Chinchilla 論文。"
  - term: "Chain-of-Thought（CoT）"
    definition: "一種 prompting 技巧：在 few-shot 範例中加入逐步推理過程，讓大型語言模型在回答時也展示中間步驟，從而大幅提升數學、邏輯等推理任務的表現。"
    context: "Wei et al. 的 CoT 論文發表於 NeurIPS 2022，是 2023 年之後所有 reasoning 研究的起點。"
  - term: "FlashAttention"
    definition: "一種 IO-aware 的 exact attention 演算法：透過 tiling 技術減少 GPU 高頻寬記憶體（HBM）與片上 SRAM 之間的讀寫次數，在不犧牲精度的前提下大幅加速 Transformer 訓練。"
    context: "Tri Dao 等人的 FlashAttention 發表於 NeurIPS 2022，日後成為幾乎所有大模型訓練框架的標準組件。"
---

2022 年是 ChatGPT 發佈的前夜，而事後回看，那場爆發所需要的每一塊拼圖——scaling laws 的修正、RLHF 的方法論、推理能力的解鎖、高效注意力機制——都在這一年的頂會上各就各位。NeurIPS 首度收到超過一萬篇投稿，選了 13 篇 Outstanding Paper，數量之多反映了那一年成果密度之高。這篇以 NeurIPS、ICML、ICLR 三大 ML 會議為主軸，附帶 AAAI 與 IJCAI 的重點，整理 2022 年的得獎論文與高影響力工作。

## NeurIPS 2022

投稿 10,411 篇，接受 2,672 篇（25.7%），首度突破萬篇大關。NeurIPS 2022 選出 13 篇 Outstanding Main Track Paper，另有 2 篇 Outstanding Datasets & Benchmarks Paper 和 1 項 Test of Time Award。

### Outstanding Paper Awards

NeurIPS 2022 的 13 篇 Outstanding Paper 涵蓋面極廣——diffusion model 佔了三席，scaling laws 佔了兩席，其餘橫跨 SGD 理論、因果公平性、OOD 檢測、自動超參數優化、多分布學習等。以下列出全部 13 篇：

1. **Photorealistic Text-to-Image Diffusion Models with Deep Language Understanding** — Chitwan Saharia, William Chan, Saurabh Saxena 等（Google Brain）。即 Imagen：用預訓練的大型語言模型（T5-XXL）作為文字編碼器，搭配 cascaded diffusion model 生成圖像，在 COCO 上達到 FID 7.27 的新紀錄。這篇的核心洞察——語言模型的品質對圖像生成的影響比圖像模型本身更大——定義了後來所有 text-to-image 系統的架構方向。

2. **Elucidating the Design Space of Diffusion-Based Generative Models** — Tero Karras, Miika Aittala, Timo Aila, Samuli Laine（NVIDIA）。不提出新模型，而是把 diffusion model 的設計空間拆成清楚分離的模組（noise schedule、network preconditioning、sampler），在 CIFAR-10 上達到 FID 1.79。這篇的價值在於把一個看似 messy 的領域整理出乾淨的工程框架，大幅降低了後進者的入門門檻。

3. **Riemannian Score-Based Generative Modelling** — Valentin De Bortoli, Emile Mathieu, Michael Hutchinson, James Thornton, Yee Whye Teh, Arnaud Doucet（Oxford / DeepMind）。把 score-based generative model 從歐氏空間推廣到黎曼流形，讓 diffusion model 可以用在球面、旋轉群等非歐幾何上。對地球科學、蛋白質建模等「資料天生活在流形上」的領域開了一扇門。

4. **An empirical analysis of compute-optimal large language model training** — Jordan Hoffmann, Sebastian Borgeaud, Arthur Mensch 等（DeepMind）。即 **Chinchilla 論文**——可能是 2022 年影響最深遠的一篇。訓練了超過 400 個不同大小的語言模型，得出結論：**在固定計算預算下，模型參數量與訓練資料量應等比例增長**，最佳比例約為 1:20（每個參數對應約 20 個 token）。這直接否定了 GPT-3 時代「大模型 + 有限資料」的做法，證明當時的大模型普遍嚴重欠訓練。70B 參數的 Chinchilla 用 1.4T token 訓練，在幾乎所有下游任務上超越了 280B 參數的 Gopher——「不是模型不夠大，而是餵的資料不夠多」成為新共識。

5. **Beyond neural scaling laws: beating power law scaling via data pruning** — Ben Sorscher, Robert Geirhos, Shashank Shekhar, Surya Ganguli, Ari Morcos（Stanford / Meta）。與 Chinchilla 論文形成互補：證明如果有好的 data pruning metric，可以打破冪律 scaling，甚至實現指數級的 scaling 改善。核心訊息是「不是所有資料都同等重要」——精心挑選的訓練集子集可以以更少的資料達到更好的效果。

6. **On-Demand Sampling: Learning Optimally from Multiple Distributions** — Nika Haghtalab, Michael Jordan, Eric Zhao（UC Berkeley）。在 collaborative learning、group DRO、fair federated learning 三個設定下建立了最優樣本複雜度界限，比之前最好的結果改善了 n 倍。理論貢獻，對聯邦學習和公平性研究有直接意義。

7. **High-dimensional limit theorems for SGD: Effective dynamics and critical scaling** — Gerard Ben Arous, Reza Gheissari, Aukosh Jagannath（NYU / Northwestern）。證明了 SGD 在高維極限下的軌跡收斂定理，發現一個臨界 step-size 區間：低於它，SGD 有效動態等同於 population loss 的 gradient flow；在臨界點上則出現新的修正項，改變相圖。純理論工作，但對理解 SGD 在實際深度學習中的行為提供了嚴格的數學基礎。

8. **Gradient Descent: The Ultimate Optimizer** — Kartik Chandra, Audrey Xie, Jonathan Ragan-Kelley, Erik Meijer（MIT / UCL）。用自動微分遞歸地優化 optimizer 自己的超參數——「超梯度」可以無限遞歸下去，疊越高對初始超參數越不敏感。想法簡潔優美，實作也只需要對 backprop 做簡單修改。附帶的 PyTorch 實作程式碼是少見的「論文+可用工具」一體化貢獻。

9. **A Neural Corpus Indexer for Document Retrieval** — Yujing Wang, Yingyan Hou 等（Microsoft Research Asia）。提出 NCI：一個端到端的 sequence-to-sequence 網路，直接把查詢映射到文件 ID，跳過傳統的 index-retrieve 兩階段管線。在 NQ320k 上 Recall@1 提升 21.4%。是 generative retrieval 這條路線的早期重要工作。

10. **Using natural language and program abstractions to instill human inductive biases in machines** — Sreejan Kumar, Carlos Correa 等（Princeton）。透過自然語言描述和程式歸納模型來「灌輸」人類的歸納偏置給 meta-RL agent，讓 agent 的行為更像人類。跨認知科學與 AI 的交叉研究。

11. **Is Out-of-distribution Detection Learnable?** — Zhen Fang, Yixuan Li, Jie Lu 等（UTS / MBZUAI / Wisconsin-Madison）。從 PAC learning 的角度研究 OOD 檢測的可學習性，證明了幾個不可能定理，也給出了實際場景下的充要條件。對 OOD 檢測領域的理論基礎建設。

12. **Gradient Estimation with Discrete Stein Operators** — Jiaxin Shi, Yuhao Zhou, Jessica Hwang, Michalis Titsias, Lester Mackey（Microsoft Research / Google DeepMind）。為離散分布開發基於 Stein operator 的方差縮減技術，顯著降低了 REINFORCE estimator 在離散 VAE 訓練中的方差。

13. **ProcTHOR: Large-Scale Embodied AI Using Procedural Generation** — Matt Deitke, Eli VanderBilt 等（AI2）。用程式化生成技術建立大規模室內環境，讓 embodied AI agent 在 10K+ 互動場景中訓練。是 AI2 THOR 生態系的重要擴展，為 embodied AI 的 scaling 提供基礎設施。

### Outstanding Datasets & Benchmarks Papers

1. **LAION-5B: An open large-scale dataset for training next generation image-text models** — Christoph Schuhmann 等。58.5 億個 CLIP 過濾後的圖文配對，是當時最大的公開多模態資料集。Stable Diffusion 的訓練資料來源之一，對開源生態的影響無可替代——但後來也因資料集內含有爭議性內容而引發廣泛倫理討論。

2. **MineDojo: Building Open-Ended Embodied Agents with Internet-Scale Knowledge** — Linxi Fan, Guanzhi Wang 等（NVIDIA / Caltech / Stanford）。在 Minecraft 上建立大規模開放式任務框架，結合網路規模的知識庫（影片、wiki、論壇），為 open-ended agent 研究提供基礎設施。

### Test of Time Award

**ImageNet Classification with Deep Convolutional Neural Networks**（2012）— Alex Krizhevsky, Ilya Sutskever, Geoffrey Hinton。即 AlexNet，深度學習革命的起點。在 NeurIPS 2022 獲得這個獎，距離原論文發表正好十年。

### 高影響力非得獎論文

NeurIPS 2022 有幾篇未得獎但影響力極大的論文：

- **FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness** — Tri Dao, Daniel Fu, Stefano Ermon, Atri Rudra, Christopher Ré（Stanford / University at Buffalo）。從 GPU 記憶體層級結構的角度重新設計 attention 計算：用 tiling 減少 HBM 讀寫，在不損失精度的前提下把 GPT-2 訓練加速 3 倍。這篇沒有提出新的模型架構，純粹是系統層面的工程優化——但它日後成為幾乎所有大模型訓練框架（PyTorch、Hugging Face、vLLM）的標準組件。沒有 FlashAttention，今天的長上下文模型（100K+ token）在成本上根本不可行。

- **Chain-of-Thought Prompting Elicits Reasoning in Large Language Models** — Jason Wei, Xuezhi Wang, Dale Schuurmans 等（Google Brain）。在 few-shot 範例中加入中間推理步驟，就能讓大模型在數學、邏輯、常識推理上大幅進步。核心發現是 CoT 是一種**湧現能力**——只在足夠大的模型上才出現效果，小模型加 CoT 反而更差。這篇是 2023 年之後所有 reasoning 研究、o1 系列模型、以及整個「思維鏈」產業的起點。

- **InstructGPT: Training Language Models to Follow Instructions with Human Feedback** — Long Ouyang 等（OpenAI）。即 InstructGPT / RLHF 論文。雖然發表為 NeurIPS 2022 論文，但它的影響遠超學術：用 RLHF（Reinforcement Learning from Human Feedback）讓語言模型學會遵循人類指令，1.3B 參數的 InstructGPT 在人類評估中打敗 175B 參數的 GPT-3。**ChatGPT 就是這篇論文的直接產物——ChatGPT 本質上就是在 GPT-3.5 上套用 InstructGPT 的 RLHF 管線**。

## ICML 2022

投稿 5,630 篇，接受 1,235 篇（21.9%），相較 2021 年規模變化不大。ICML 2022 在 Baltimore 舉辦，是疫情後首次恢復大規模實體出席的頂會之一。

### Outstanding Paper Awards

ICML 2022 選出約 7-8 篇 Outstanding Paper，涵蓋因果公平性、圖資料增強、differentiable simulation、dataset difficulty 度量等：

1. **Understanding Dataset Difficulty with V-Usable Information** — Kawin Ethayarajh, Yejin Choi, Swabha Swayamdipta（Stanford / Allen AI）。提出 pointwise V-information (PVI) 來度量資料集和個別樣本對特定模型的難度。不同於傳統「模型 vs 人類」的比較方式，PVI 允許跨資料集、跨 slice 的難度比較，並被用來發現 NLP benchmark 中的 annotation artifact。

2. **Causal Conceptions of Fairness and their Consequences** — Hamed Nilforoshan, Johann Gaebler, Ravi Shroff, Sharad Goel（Stanford）。統整了兩大類因果公平性定義，然後在理論和實驗上證明**這兩類定義幾乎總是（measure-theoretic 意義上）導致 Pareto dominated 的決策**——意味著存在不受約束的替代政策，對每一個利害關係人都更好。在大學錄取的例子裡，最嚴格的因果公平性定義要求以相同機率錄取所有學生，不管學業資格。

3. **Do Differentiable Simulators Give Better Policy Gradients?** — Hyung Ju Suh, Max Simchowitz, Kaiqing Zhang, Russ Tedrake（MIT）。探討 differentiable simulator 在 RL 中的實際效用：發現物理系統的剛性或不連續性會破壞一階梯度估計的效果，提出 α-order gradient estimator 來結合一階和零階方法的優點。

4. **G-Mixup: Graph Data Augmentation for Graph Classification** — Xiaotian Han, Zhimeng Jiang, Ninghao Liu, Xia Hu（Texas A&M / MBZUAI）。透過在 graphon 空間中做插值來為圖資料做 mixup 增強——因為不同圖的節點數、拓撲結構不同，直接在圖上做 mixup 不可行，轉到 graphon 表徵空間就解決了這個問題。

5. **Stable Conformal Prediction Sets** — Eugene Ndiaye（Georgia Tech）。將 conformal prediction 與 algorithmic stability 結合，導出只需要跑一次模型就能計算的 prediction set，不需要 data splitting。在保持覆蓋率保證的前提下大幅減少計算成本。

6. **The Importance of Non-Markovianity in Maximum State Entropy Exploration** — Mirco Mutti, Riccardo De Santi, Marcello Restelli（Politecnico di Milano）。證明在有限樣本下，non-Markovian 確定性策略對最大狀態熵探索是必要的，Markovian 策略存在不可消除的 regret。但找到最優 non-Markovian 策略是 NP-hard——理論上重要，實務上指出了方向但還沒有好的解法。

7. **Learning Mixtures of Linear Dynamical Systems** — Yanxi Chen, H. Vincent Poor（Princeton）。為從未標記的短時序樣本學習混合線性動態系統（LDS）提供端到端的保證，解決了 latent variable、短序列、時序依賴三重技術挑戰。

8. **Stackelberg Prediction Game via Spherically Constrained Least Squares** — Jiali Wang, Wen Huang, Rujun Jiang, Xudong Li, Alex Wang。把 Stackelberg prediction game 的最小二乘特例重新公式化為球面約束最小二乘問題，達到 $\tilde{O}(N/\sqrt{\epsilon})$ 的計算複雜度。

### Test of Time Award

**Poisoning Attacks Against Support Vector Machines**（2012）— Battista Biggio, Blaine Nelson, Pavel Laskov。十年前的 adversarial ML 先驅工作。

### 高影響力非得獎論文

- **Bayesian Flow Networks** 等理論工作持續推進，但 ICML 2022 整體上非得獎的突破性論文密度不如同年的 NeurIPS。這跟 NeurIPS 作為年度最大 ML 會議的「吸引力效應」有關——最有話題性的工作往往選擇 NeurIPS 而非 ICML。

## ICLR 2022

ICLR 2022 選出 7 篇 Outstanding Paper，在 diffusion model 理論、GNN 表達力、差分隱私超參數調校、learnable stride、meta-learning 等方向上都有代表作：

1. **Analytic-DPM: an Analytic Estimate of the Optimal Reverse Variance in Diffusion Probabilistic Models** — Fan Bao, Chongxuan Li, Jun Zhu, Bo Zhang（清華大學）。推導出 diffusion model 最優反向方差的解析形式，實現 training-free 的推理框架，加速 20-80 倍。來自中國學術界的 diffusion 理論貢獻。

2. **Bootstrapped Meta-Learning** — Sebastian Flennerhag, Yannick Schroecker, Tom Zahavy, Hado van Hasselt, David Silver, Satinder Singh（DeepMind）。讓 meta-learner 透過 bootstrapping 自己的 target 來學習，避免了需要 backprop through 所有 update 步驟的問題。在 Atari ALE 上達到 model-free agent 的新 SOTA。

3. **Neural Collapse Under MSE Loss: Proximity to and Dynamics on the Central Path** — X.Y. Han, Vardan Papyan, David Donoho（Stanford）。在 MSE loss 下研究 Neural Collapse 現象，利用 MSE（比 CE loss 更易分析）提供了理論上的深入理解。

4. **Hyperparameter Tuning with Renyi Differential Privacy** — Nicolas Papernot, Thomas Steinke（Google）。證明了差分隱私演算法的超參數搜索確實會洩漏隱私訊息，但在合理假設下洩漏量有限。改進並擴展了 Liu & Talwar (STOC 2019) 的結果。

5. **Expressiveness and Approximation Properties of Graph Neural Networks** — Floris Geerts, Juan L. Reutter（KU Leuven / PUC Chile）。用「張量語言」的視角分析 GNN 架構的分離能力——設計者只需檢查表達式中的 index 數量和求和嵌套深度，就能直接得出 WL-test 等價性的界限。提供了一個通用工具箱，讓架構設計者不需深入 WL-test 的細節也能分析自己模型的表達力。

6. **Learning Strides in Convolutional Neural Networks (DiffStride)** — Rachid Riad, Olivier Teboul, David Grangier, Neil Zeghidour（Google Research）。首個可學習的下採樣層：在傅立葉域中學習裁剪遮罩的大小來實現可微分的 resize。在 CIFAR-10/100 和 ImageNet 上即使從差的隨機初始化開始也能維持高性能。

7. **Comparing Distributions by Measuring Differences that Affect Decision Making** — Shengjia Zhao, Abhishek Sinha 等（Stanford）。從決策理論角度提出新的分布比較度量。

### 高影響力非得獎論文

ICLR 2022 的非得獎論文裡有幾篇日後影響巨大的工作——但它們多數是以 arXiv preprint 形式先流通，在 ICLR 2022 的存在感不如 NeurIPS 那麼集中。

## AAAI 2022

投稿 9,020 篇，接受 1,349 篇（15.0%），是這一年接受率最低的大會之一。AAAI 2022 選出 6 篇 Distinguished Paper：

1. **AlphaHoldem: High-Performance Artificial Intelligence for Heads-Up No-Limit Poker via End-to-End Reinforcement Learning** — Enmin Zhao, Renye Yan, Jinqiu Li, Kai Li, Junliang Xing。端到端 RL 做無限注德州撲克。

2. **Certified Symmetry and Dominance Breaking for Combinatorial Optimisation** — Bart Bogaerts, Stephan Gocht, Ciaran McCreesh, Jakob Nordström。組合最佳化中的對稱性破缺認證。

3. **Online Elicitation of Necessarily Optimal Matchings** — Jannik Peters。線上偏好引出在匹配問題中的應用。

4. **Sampling-Based Robust Control of Autonomous Systems with Non-Gaussian Noise** — Thom Badings, Alessandro Abate, Nils Jansen, David Parker, Hasan Poonawala, Marielle Stoelinga。非高斯噪聲下自主系統的穩健控制。

5. **Subset approximation of Pareto Regions with Bi-objective A*** — Jorge Baier, Carlos Hernández, Nicolás Rivera。雙目標 A* 的 Pareto 區域子集近似。

6. **The SoftCumulative Constraint with Quadratic Penalty** — Yanick Ouellet, Claude-Guy Quimper。約束程式設計中的軟累積約束。

AAAI 的 Distinguished Paper 一直偏重 classical AI（combinatorial optimization、constraint programming、multi-agent decision making），跟 NeurIPS/ICML/ICLR 以深度學習為主的口味形成對比。

## IJCAI 2022

投稿 4,537 篇，接受 679 篇（15.0%），與 AAAI 接受率持平。IJCAI-ECAI 2022 聯合舉辦（Vienna），選出 3 篇 Distinguished Paper：

1. **Plurality Veto: A Simple Voting Rule Achieving Optimal Metric Distortion** — Fatih Kizilkaya, David Kempe。提出一個簡潔的投票規則，在 metric distortion 框架下達到最優。

2. **QCDCL with Cube Learning or Pure Literal Elimination – What is Best?** — Benjamin Böhm, Tomáš Peitl, Olaf Beyersdorff。QBF 求解器的兩種技術比較。

3. **FAIR-FATE: Fair Federated Learning with Momentum** — Teresa Salazar, Miguel Fernandes, Helder Araujo, Pedro Henriques Abreu。公平性聯邦學習。

IJCAI 2022 的 Research Excellence Award 授予 Stuart Russell，John McCarthy Award 授予 Michael Littman，Computers and Thought Award 授予 Bo Li。

## 2022 年的整體觀察

### 三個定義性的主題

**Diffusion model 佔領舞台中央。** 如果說 2021 年 diffusion model 還是「證明自己能贏 GAN」的挑戰者，2022 年它已經是沒有爭議的主角。NeurIPS 13 篇 Outstanding Paper 裡有 3 篇直接是 diffusion（Imagen、Karras 設計空間、Riemannian SGM），ICLR 有 Analytic-DPM。同年 DALL-E 2（OpenAI，4 月）、Stable Diffusion（Stability AI，8 月）在產品層面引爆了 AI 生成圖像的公眾關注。學術 + 產品雙線並進，diffusion 的統治地位在 2022 年底已無人質疑。

**Scaling 不再只是「越大越好」。** Chinchilla 論文是分水嶺：它用 400+ 個模型的實驗證明之前的 scaling law 搞錯了比例。同時 data pruning 論文證明精選資料可以打破冪律。FlashAttention 則從系統層面讓 scaling 更高效。三篇加在一起，訊息是「別只堆參數，想清楚怎麼花你的計算預算」。

**推理能力從「不可能」變成「可提示」。** Chain-of-Thought prompting 的發現改變了整個 prompting engineering 的方向：只要在範例裡加入推理步驟，大模型就能做 arithmetic、commonsense reasoning 等過去認為需要特殊架構的任務。這跟 InstructGPT 的 RLHF 方法合在一起，構成了 ChatGPT 的兩大技術支柱。

### 跟 2021 年相比的變化

- **投稿量**持續攀升但尚未爆炸——NeurIPS 從 9,122 到 10,411 (+14%)，真正的爆發在 2024 年。
- **Diffusion** 從理論突破（2021）進入工程化和產品化（2022）。
- **Scaling laws** 從 Kaplan et al. (2020) 的「bigger is better」修正為 Chinchilla 的「bigger AND more data」。
- **RLHF** 從概念驗證（2021 年 Anthropic/OpenAI 的初期工作）進入可落地的完整管線（InstructGPT）。
- **GNN** 研究持續但已過巔峰——2022 年的 ICML Outstanding Paper 裡 G-Mixup 是圖學習的代表，但整體熱度已開始被 Foundation Model 吸走。

### 後見之明：2022 年最持久的影響

站在 2026 年回看，2022 年影響最持久的五篇論文可能是：

1. **Chinchilla**——直接改寫了所有大模型團隊的訓練策略，Llama 系列明確遵循其 scaling law。
2. **InstructGPT / RLHF**——ChatGPT 的直接技術來源，RLHF 成為所有對齊研究的基準方法。
3. **FlashAttention**——工程貢獻，但對產業的影響可能比任何一篇模型論文都大。
4. **Chain-of-Thought**——開啟了 reasoning as prompting 的整條研究線，o1、o3 的祖先。
5. **Imagen / Karras 設計空間**——前者定義了 text-to-image 的架構模板，後者讓 diffusion 變成工程上可控的東西。

---

## 參考資料

- [NeurIPS Blog — Announcing the NeurIPS 2022 Awards](https://blog.neurips.cc/2022/11/21/announcing-the-neurips-2022-awards/)
- [NeurIPS 2022 Awards — Outstanding Paper（官方虛擬會場）](https://neurips.cc/virtual/2022/awards_detail)
- [NeurIPS 2022 Fact Sheet（官方 PDF）](https://media.neurips.cc/Conferences/NeurIPS2022/NeurIPS_2022_Fact_Sheet.pdf)
- [ICML 2022 Awards（官方虛擬會場）](https://icml.cc/virtual/2022/awards_detail)
- [ICLR 2022 Awards（官方虛擬會場）](https://iclr.cc/virtual/2022/awards_detail)
- [AAAI-22 Paper Awards（官方 PDF）](https://aaai.org/wp-content/uploads/2023/02/AAAI-22-Paper-Awards.pdf)
- [IJCAI-ECAI 2022 Award Winners](https://ijcai-22.org/award-winners/index.html)
- [IJCAI-ECAI 2022 Distinguished Papers](https://ijcai-22.org/distinguished-papers/)
- [Top-Conference-Best-Papers（GitHub 彙整）](https://github.com/FeijiangHan/Top-Conference-Best-Papers)
- [Hoffmann et al. (2022) "An empirical analysis of compute-optimal large language model training" — NeurIPS 2022](https://proceedings.neurips.cc/paper_files/paper/2022/hash/c1e2faff6f588870935f114ebe04a3e5-Abstract-Conference.html)
- [Dao et al. (2022) "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness" — NeurIPS 2022](https://proceedings.neurips.cc/paper_files/paper/2022/hash/67d57c32e20fd0a7a302cb81d36e40d5-Abstract-Conference.html)
- [Wei et al. (2022) "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" — NeurIPS 2022](https://proceedings.neurips.cc/paper_files/paper/2022/file/9d5609613524ecf4f15af0f7b31abca4-Paper-Conference.pdf)
- [Ouyang et al. (2022) "Training language models to follow instructions with human feedback" — NeurIPS 2022](https://proceedings.neurips.cc/paper_files/paper/2022/hash/b1efde53be364a73914f58805a001731-Abstract-Conference.html)
