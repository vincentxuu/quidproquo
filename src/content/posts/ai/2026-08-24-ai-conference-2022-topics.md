---
title: "2022 AI 頂會在收什麼題目：Diffusion 爆發、Chain-of-Thought 與 ChatGPT 前夜"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, research-trends, "2022", topic-analysis, diffusion-model, chain-of-thought, rlhf, scaling-laws]
lang: zh-TW
tldr: "2022 年是 AI 頂會的轉折年：Diffusion Model 從冒頭變成主流（NeurIPS 兩篇 Outstanding Paper），Chinchilla 改寫 scaling laws 的遊戲規則，Chain-of-Thought 證明大模型能推理，InstructGPT 用 RLHF 讓語言模型學會聽話——而這一切在年底 ChatGPT 上線後瞬間從學術議題變成全球新聞。"
description: "回顧 2022 年 NeurIPS、ICML、ICLR、ACL、EMNLP、CVPR、ECCV、AAAI、IJCAI 九大會議的得獎論文與主題分布，從研究方向的維度分析 Diffusion Model 全面爆發、scaling laws 被改寫、Chain-of-Thought 推理興起、RLHF 走向產品化等關鍵趨勢，以及站在 2026 年回頭看哪些 2022 年的研究方向回報最高。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 13
glossary:
  - term: "Chain-of-Thought (CoT)"
    definition: "一種提示技巧：在 few-shot 範例中加入中間推理步驟，讓大型語言模型在回答時也產出推理過程，從而大幅提升數學和邏輯推理能力。"
    context: "2022 年 NeurIPS 上 Google 的 Wei et al. 發表的 CoT 論文，是當年引用數最高的論文之一。"
  - term: "RLHF (Reinforcement Learning from Human Feedback)"
    definition: "用人類偏好回饋訓練獎勵模型，再用 RL 微調語言模型使其輸出更符合人類意圖。InstructGPT 用的核心技術，也是 ChatGPT 背後的關鍵方法。"
    context: "2022 年從學術論文直接變成產品技術，年底 ChatGPT 上線是最直接的驗證。"
  - term: "Scaling Laws"
    definition: "描述模型性能如何隨模型大小、資料量、計算量變化的經驗定律。2020 年 Kaplan et al. 提出的版本主張「大模型優先」，2022 年 Chinchilla 論文直接推翻這個結論。"
    context: "Chinchilla 證明之前的大模型嚴重欠訓練——同樣的計算預算，用更小的模型配更多資料效果更好。"
---

> 🌏 [English version](/posts/ai/2026-08-24-ai-conference-2022-topics-en)

2021 年的 AI 頂會還在探索 Diffusion Model 的理論基礎、自監督學習的極限、和 Transformer 的跨領域擴散。一年後的 2022 年，這些方向全部加速了——但真正讓 2022 年成為分水嶺的，不是任何單一方向的突破，而是幾個方向同時成熟並交會：Diffusion Model 從學術實驗變成商業產品（DALL·E 2、Stable Diffusion），scaling laws 被改寫（Chinchilla），語言模型學會了推理（Chain-of-Thought），而 RLHF 從論文技術變成 ChatGPT 背後的核心引擎。

這篇從「研究方向」的維度，整理 2022 年九大 AI 頂會到底在收什麼題目、哪些方向在加速、哪些開始消退，以及站在 2026 年回頭看哪些選擇的回報最高。

## 全面爆發：Diffusion Model 統治生成式 AI

如果要用一個詞概括 2022 年 AI 頂會的最大公約數，答案是 **Diffusion Model**。

**NeurIPS 2022 的 13 篇 Outstanding Paper 裡，有 2 篇直接關於 Diffusion Model**——這在一場接受 2,672 篇論文的會議裡是極不尋常的集中度：

- **「Elucidating the Design Space of Diffusion-Based Generative Models」**（Tero Karras 等人，NVIDIA）：系統性地梳理 diffusion model 的設計空間，把看似雜亂的各種 diffusion 變體統一進一個連貫的框架，直接提升了後續研究者的開發效率。
- **「Photorealistic Text-to-Image Diffusion Models with Deep Language Understanding」**（Chitwan Saharia 等人，Google Brain）：即 Imagen 論文，展示了把獨立訓練的大型語言模型跟圖像解碼器結合的威力，產出的圖像品質當時領先業界。

**ICLR 2022 的 Outstanding Paper 之一也是 Diffusion 論文**：「Analytic-DPM: an Analytic Estimate of the Optimal Reverse Variance in Diffusion Probabilistic Models」（Fan Bao 等人，清華大學），從理論上推導出 diffusion model 反向過程的最優變異數。

同年 CVPR 2022 的 Best Student Paper Honorable Mention 頒給了 **Ref-NeRF**（Dor Verbin 等人，Google），雖然是 NeRF 方向而非直接的 diffusion 工作，但反映了生成式 3D 模型的整體熱度。而在會議之外，2022 年 4 月 DALL·E 2、8 月 Stable Diffusion 相繼發布，讓 diffusion model 從學術議題變成全球話題。

**跟 2021 年的對比**：2021 年 Diffusion Model 在頂會上只有一篇 ICLR Outstanding Paper（Score-Based Generative Modeling through SDEs），論文總量處於低基數。2022 年直接跳到多場會議同時出現 outstanding-paper 級別的 diffusion 工作，論文量翻了數倍——從「有潛力的新方向」變成「所有人都在做」。

## 改寫遊戲規則：Scaling Laws 與 Chinchilla

2022 年對大型語言模型的理解發生了根本性轉變，核心推手是 **Chinchilla 論文**。

**NeurIPS 2022 Outstanding Paper：「An Empirical Analysis of Compute-Optimal Large Language Model Training」**（Jordan Hoffmann 等人，DeepMind）——這就是 Chinchilla 論文。它的核心發現直接推翻了 2020 年 Kaplan et al. 的 scaling laws：**當時所有大型語言模型都嚴重欠訓練**。在同樣的計算預算下，用更小的模型配更多訓練資料效果更好。具體來說，模型大小和訓練 token 數應該以大致相同的比例增長——而不是像之前業界實踐的那樣，一味把模型做大而訓練資料量不成比例地少。

DeepMind 用行動驗證了這個結論：70B 參數的 Chinchilla 用跟 280B 參數 Gopher 相同的計算預算訓練，在幾乎所有下游任務上都顯著優於 Gopher，也優於 175B 的 GPT-3 和 530B 的 Megatron-Turing NLG。

另一篇 NeurIPS 2022 Outstanding Paper 從不同角度觸及同一問題：**「Beyond Neural Scaling Laws: Beating Power Law Scaling via Data Pruning」**（Ben Sorscher 等人，Stanford / Meta AI），發現通過智慧的資料剪枝可以打破冪律 scaling，用更少的資料達到相同性能。

這兩篇論文的影響延續到今天：Chinchilla 直接改變了後續所有大模型的訓練策略（包括 Llama 系列），而「資料品質比資料量更重要」的觀點從此成為共識。

## 語言模型學會推理：Chain-of-Thought 與 InstructGPT

2022 年另一條深遠影響的主線是**讓語言模型不只生成文字，而是能推理和聽話**。

**Chain-of-Thought Prompting（NeurIPS 2022）**：Jason Wei 等人（Google）的論文證明了一個簡單但影響深遠的發現——在 few-shot 提示的範例中加入中間推理步驟，大型語言模型（≥100B 參數）的數學和邏輯推理能力會大幅提升。這是一種**湧現能力（emergent ability）**：小模型加了 CoT 反而變差，只有夠大的模型才會受益。PaLM 540B 用 CoT 在 GSM8K 數學推理 benchmark 上的正確率直接翻倍。

這篇論文沒有拿到 Outstanding Paper，但它的後續影響可能比多數得獎論文更大——它開啟了整個 prompt engineering 和推理增強的研究領域，直到 2024 年的 OpenAI o1 都還在這條線上。

**InstructGPT（NeurIPS 2022）**：Long Ouyang 等人（OpenAI）的論文是 ChatGPT 的直接前身。核心發現是用 RLHF 微調的 1.3B 參數 InstructGPT，在人類評估中**優於未微調的 175B GPT-3**——對齊（alignment）的效果超過 100 倍的模型大小差距。這篇論文同時證明了 RLHF 的「alignment tax」很低：對齊後的模型在大部分公開 NLP benchmark 上的性能衰退是可控的。

**ACL 2022 的 Outstanding Paper** 之一是 **「Fantastically Ordered Prompts and Where to Find Them: Overcoming Few-Shot Prompt Order Sensitivity」**（Yao Lu 等人，UCL），發現 few-shot 提示中範例的排列順序會劇烈影響結果——這跟 CoT 一樣，都在揭示「怎麼跟大模型溝通」本身就是一個非平凡的研究問題。

## Embodied AI 與開放世界代理

2022 年 NeurIPS 有兩篇 Outstanding Paper 指向 **Embodied AI**——讓 AI 不只處理文字和圖像，而是在環境中行動：

- **ProcTHOR**（Matt Deitke 等人，Allen Institute for AI / UW）：用程序化生成建立大規模 3D 環境，讓 embodied AI 能受益於 scaling——就像語言模型靠大量文字資料一樣。
- **MineDojo**（同樣來自 AI2）：Outstanding Benchmarks Paper，在 Minecraft 這個開放世界環境中建立 benchmark，用網路規模的知識（YouTube 影片、Wiki）訓練 agent。

這兩篇論文反映的趨勢是：2022 年的 AI 社群開始認真思考「語言模型的 scaling 奇蹟能不能複製到其他模態」——答案是需要相應規模的環境和數據，而不只是更大的模型。

## 各會議的核心方向

### ML 三大會議（NeurIPS / ICML / ICLR）

**NeurIPS 2022** 的 13 篇 Outstanding Paper 覆蓋面極廣：Diffusion（2 篇）、scaling laws（2 篇）、OOD detection 理論、SGD 理論、gradient estimation、embodied AI、neural retrieval、Bayesian learning、learning from multiple distributions、human inductive biases。D&B Track 另外給了 LAION-5B（開放的大型圖文資料集，Stable Diffusion 的訓練資料來源之一）。Test of Time Award 頒給了 2012 年的 **AlexNet 論文**——回頭看，2012 年的 AlexNet 跟 2022 年的 Chinchilla 講的是同一件事：資料和計算的合理分配比單純增大模型更重要。

**ICML 2022** 的 10 篇 Outstanding Paper 更偏理論和方法論：包括 dataset difficulty 的資訊論框架（V-Usable Information，Kawin Ethayarajh 等人）、Bayesian model selection 的反直覺發現（marginal likelihood 跟 generalization 可能負相關）、offline RL（ATAC）、differentiable simulators 的反思、conformal prediction、fairness 的因果分析、非馬可夫探索的重要性。整體調性比 NeurIPS 更偏「質疑既有假設」而非「展示新系統」。

**ICLR 2022** 的 7 篇 Outstanding Paper 包括：Bootstrapped Meta-Learning（DeepMind，David Silver 團隊）、differential privacy 的超參數調整、Analytic-DPM（Diffusion）、Neural Collapse 理論、GNN 表達力分析、distribution comparison。值得注意的是 Honorable Mention 裡的 **S4（Structured State Spaces for Long Sequences）**（Albert Gu 等人）——這篇論文後來發展成 Mamba 架構，成為 Transformer 之外最有競爭力的序列建模方案。

### NLP 會議（ACL / EMNLP / NAACL）

**ACL 2022** 的 Best Paper 是 **「Learned Incremental Representations for Parsing」**（Nikita Kitaev 等人，UC Berkeley），設計了「最大程度無推測」的增量式句法分析表示。Best Special Theme Paper 給了低資源語言合成（語言復振）——跟 2021 年 ACL 的手語 theme paper 一樣，ACL 持續在 theme paper 上推動語言多樣性和社會影響議題。

**EMNLP 2022** 的 Best Long Paper 是 **「Abstract Visual Reasoning with Tangram Shapes」**（Anya Ji 等人，Cornell），引入 Kilogram 資源研究人類和機器的抽象視覺推理能力。

**NAACL 2022** 的 Best Paper 有五篇並列，包括 FNet（用傅立葉變換取代 attention 混合 token）和 NeuroLogic A*esque Decoding（約束式文本生成）。

2022 年 NLP 會議的整體趨勢：**prompt-based 方法**從 2021 年的新鮮事物變成預設起點，幾乎每場會議都有大量論文在研究怎麼更好地提示大模型、怎麼讓提示更穩定（ACL 的 prompt order sensitivity 論文就是代表）。同時，**事實性評估**（factuality evaluation）成為新焦點——ACL Outstanding Paper 之一就是 text simplification 的事實性評估。

### CV 會議（CVPR / ECCV）

**CVPR 2022** 的 Best Paper 是 **「Learning to Solve Hard Minimal Problems」**（Petr Hruby 等人，ČVUT），一篇幾何視覺的理論工作——在 diffusion 和 Transformer 主導的氛圍中，CVPR 的最高榮譽仍然給了傳統幾何視覺問題，這可以看成評審委員會對「核心 CV 能力」的堅守。Best Student Paper 是 EPro-PnP（端到端的 PnP 姿態估計），Best Student Paper Honorable Mention 則給了 Ref-NeRF。

**ECCV 2022** 的 Best Paper 是 **「On the Versatile Uses of Partial Distance Correlation in Deep Learning」**（Xingjian Zhen 等人，UW-Madison），提出了一種通用的模型相關性度量方法。Honorable Mention 給了 Pose-NDF（人體姿態的神經距離場）和 Level Set Theory for Neural Implicit Evolution。

2022 年 CV 會議的大趨勢：**NeRF 和 neural implicit representation 全面爆發**（CVPR 和 ECCV 各有大量 NeRF 變體論文）、Vision-Language model（受 CLIP 影響）持續增長、純 CNN backbone 的論文已明顯減少。

### AI 綜合會議（AAAI / IJCAI）

**AAAI 2022** 的 Outstanding Paper 是 **「Online Certification of Preference-Based Fairness for Personalized Recommender Systems」**（Do 等人，Meta），是 fairness 方向的工作。Distinguished Papers 涵蓋 RL（AlphaHoldem）、組合優化、matching、robust control、多目標搜尋。

**IJCAI-ECAI 2022**（2022 年 IJCAI 和歐洲 AI 會議 ECAI 聯合舉辦）的 Distinguished Papers 有三篇：Plurality Veto（投票理論）、QCDCL with Cube Learning（SAT solving）、Completeness and Diversity in Retrosynthesis（逆合成搜尋）。AAAI 和 IJCAI 的得獎論文跟 ML 三大會議的 LLM/diffusion 熱潮有明顯差異——它們仍然高度多元，涵蓋 classical AI 的各種子領域。

## 2022 年開始冒頭的方向

### RLHF 與 AI 對齊

InstructGPT 是 2022 年發表的，但 RLHF 作為頂會研究方向在 2022 年還處於早期。真正讓 RLHF 成為頂會熱門 track 的是 2022 年 11 月 ChatGPT 的上線——但那已經是 NeurIPS 2022 論文截稿之後的事了。2022 年的頂會論文裡，直接做 RLHF / alignment 的數量還不多；到了 2023 年的投稿週期，這個方向才爆發式增長。

### State Space Models

ICLR 2022 Honorable Mention 的 **S4 論文**（Albert Gu 等人，Stanford）在回頭看是 2022 年最被低估的冒頭方向之一。S4 用結構化的狀態空間模型替代 attention 機制處理長序列，在長距離依賴任務上顯著優於 Transformer。這篇論文後來發展為 2023 年底的 Mamba 架構，成為 Transformer 之外第一個在多個領域展現真正競爭力的替代方案。

### AI for Science

2022 年「AI for Science」作為一個跨領域方向的存在感開始提升——ICLR 2022 邀請了 Pushmeet Kohli（DeepMind）做「Leveraging AI for Science」的 keynote；NeurIPS 2022 有多個 workshop 專門討論科學應用中的 ML。這個方向在 2021 年 AlphaFold2 已經證明了潛力，2022 年開始更系統性地進入主流 ML 會議。

## 2022 年已飽和或開始下降的方向

### 傳統 GAN 改進

2022 年 Diffusion Model 在圖像生成品質上全面超越 GAN 之後，純粹改進 GAN 架構的論文數量明顯下降。GAN 沒有消失——它在影片生成、3D 生成等特定場景仍然有用——但「改進 GAN 的 FID 分數」不再是值得投入的方向。

### Neural Architecture Search (NAS)

NAS 的論文量在 2022 年開始下降。原因很直接：Transformer 和 diffusion model 的標準架構已經夠好用，而且在 scaling 中表現穩定，手動/自動搜尋新架構的邊際收益越來越低。

### Federated Learning

跟 2021 年一樣，federated learning 的論文量在 2022 年繼續趨平。核心理論問題（隱私保證、通訊效率、non-IID 資料）在前兩年已經被大量研究，2022 年的新增貢獻主要是應用層面的工作，難以在頂會主軌拿到高分。

## 2022 年得獎論文一覽

| 會議 | 獎項 | 論文 | 方向 |
|---|---|---|---|
| NeurIPS | Outstanding Paper | Elucidating the Design Space of Diffusion-Based Generative Models | Diffusion |
| NeurIPS | Outstanding Paper | Photorealistic Text-to-Image Diffusion Models with Deep Language Understanding | Diffusion / 文字轉圖像 |
| NeurIPS | Outstanding Paper | An Empirical Analysis of Compute-Optimal LLM Training（Chinchilla） | Scaling Laws |
| NeurIPS | Outstanding Paper | Beyond Neural Scaling Laws: Beating Power Law via Data Pruning | Scaling / 資料剪枝 |
| NeurIPS | Outstanding Paper | Is Out-of-Distribution Detection Learnable? | OOD Detection 理論 |
| NeurIPS | Outstanding Paper | ProcTHOR: Large-Scale Embodied AI Using Procedural Generation | Embodied AI |
| NeurIPS | Outstanding Paper | Gradient Descent: The Ultimate Optimizer | 優化理論 |
| NeurIPS | Outstanding D&B | LAION-5B | 開放資料集 |
| NeurIPS | Outstanding D&B | MineDojo | Embodied AI Benchmark |
| NeurIPS | Test of Time | AlexNet（2012） | CNN / 深度學習起源 |
| ICML | Outstanding Paper | Understanding Dataset Difficulty with V-Usable Information | 資料評估 |
| ICML | Outstanding Paper | Bayesian Model Selection, the Marginal Likelihood, and Generalization | Bayesian |
| ICML | Outstanding Paper | Do Differentiable Simulators Give Better Policy Gradients? | RL / 物理模擬 |
| ICML | Outstanding Paper | Causal Conceptions of Fairness and their Consequences | Fairness / 因果推論 |
| ICML | Outstanding Paper Runner-Up | Adversarially Trained Actor Critic for Offline RL (ATAC) | Offline RL |
| ICLR | Outstanding Paper | Analytic-DPM | Diffusion |
| ICLR | Outstanding Paper | Bootstrapped Meta-Learning | Meta-Learning |
| ICLR | Outstanding Paper | Neural Collapse Under MSE Loss | 深度學習理論 |
| ICLR | Honorable Mention | Efficiently Modeling Long Sequences with Structured State Spaces（S4） | 序列建模 |
| CVPR | Best Paper | Learning to Solve Hard Minimal Problems | 幾何視覺 |
| CVPR | Best Student Paper | EPro-PnP | 姿態估計 |
| CVPR | Best Student Paper HM | Ref-NeRF | NeRF |
| ECCV | Best Paper | On the Versatile Uses of Partial Distance Correlation in Deep Learning | 模型分析 |
| ACL | Best Paper | Learned Incremental Representations for Parsing | 句法分析 |
| ACL | Best Theme | Low-Resource Speech Synthesis for Language Revitalization | 語言復振 |
| ACL | Best Resource | DiBiMT: WSD Biases in Machine Translation | 翻譯偏見 |
| EMNLP | Best Long Paper | Abstract Visual Reasoning with Tangram Shapes | 視覺推理 |
| NAACL | Best Paper | FNet: Mixing Tokens with Fourier Transforms | 高效模型 |
| NAACL | Best Paper | NeuroLogic A*esque Decoding | 約束式生成 |
| AAAI | Outstanding Paper | Online Certification of Preference-Based Fairness | Fairness / 推薦系統 |
| AAAI | Distinguished | AlphaHoldem: End-to-End RL for No-Limit Poker | RL / 博弈 |
| IJCAI | Distinguished | Plurality Veto | 投票理論 |
| IJCAI | Distinguished | Completeness and Diversity in Retrosynthesis | 搜尋 / 化學合成 |

## 站在 2026 年回頭看：哪些選擇的回報最高

### 最高回報方向

- **Diffusion Model**：2022 年進入的人仍然趕上了巨大紅利。Karras 等人的 design space 論文成為後續所有 diffusion 系統的參考框架。2022-2024 年間，diffusion 從圖像擴展到影片（Sora）、3D（DreamFusion）、音訊（AudioLDM），每一步都創造了新的頂會投稿機會。
- **Chain-of-Thought / 推理增強**：Wei et al. 的 CoT 論文引爆了整個 prompt engineering 和推理增強研究領域。Self-consistency（Wang et al., 2022）、Tree-of-Thoughts（2023）、一直到 OpenAI o1（2024），都在這條線上。2022 年進入這個方向的人，到 2026 年還沒走完。
- **RLHF / Alignment**：InstructGPT 是 ChatGPT 的直接前身。2022 年投入 RLHF 研究的人，在 2023 年 ChatGPT 爆發後成為最搶手的人才。方向到 2026 年仍在快速演化（DPO、Constitutional AI、RLHF 的替代方案）。
- **Scaling Laws / 計算最優訓練**：Chinchilla 改變了整個產業的訓練策略。理解 scaling 行為的研究者在後續的大模型競賽中具有系統性優勢。

### 穩定但沒有爆發

- **OOD Detection / Robustness**：NeurIPS 2022 有 Outstanding Paper，方向本身在 2023-2025 年穩定成長但沒有出現殺手級突破。
- **Embodied AI**：ProcTHOR 和 MineDojo 建立了基礎設施，但 embodied AI 的實際產品化進展比語言模型慢得多。方向到 2026 年仍在成長，但離「爆發」還有距離。

### 事後看被低估

- **S4 / State Space Models**：ICLR 2022 的 Honorable Mention，在當年被多數人忽略。但它發展出的 Mamba（2023 年底）成為 Transformer 唯一的真正競爭者，在長序列和邊緣部署場景有實際應用。2022 年就投入 SSM 研究的人拿到了明確的先發優勢。

### 已確認過了高峰

- **GAN 架構改進**：2022 年之後幾乎沒有純 GAN 改進的頂會論文能拿到高分。
- **NAS**：被 scaling + standard architecture 的路線直接取代。
- **傳統 NLP benchmark gaming**：在大型語言模型面前，針對單一 benchmark 刷分的研究價值急劇下降。

## 2022 vs 2021：一年間的加速與消退

| 方向 | 2021 | 2022 | 趨勢 |
|---|---|---|---|
| Diffusion Model | 冒頭（1 篇 Outstanding Paper） | 全面爆發（多篇 Outstanding Paper + 商業化） | 急速加速 |
| Scaling / LLM 訓練策略 | 尚無專門研究 | Chinchilla 改寫遊戲規則 | 從無到有 |
| Chain-of-Thought / Prompting | 不存在 | NeurIPS 2022 發表，引爆方向 | 從無到有 |
| RLHF / Alignment | 極少人在做 | InstructGPT 發表，ChatGPT 年底上線 | 從冷門到產品化 |
| 自監督學習 | 最大公約數 | 仍熱但被「foundation model」敘事吸收 | 高峰→穩定 |
| Vision Transformer | 全面爆發 | 已成預設，不再是「新方向」 | 主流化（不再新聞） |
| GNN | 高峰 | 持續但開始下降 | 下降 |
| Federated Learning | 高峰 | 繼續趨平 | 飽和 |
| GAN | 仍有大量論文 | 被 Diffusion 取代 | 急速下降 |

**2022 年最重要的教訓**：如果 2021 年的關鍵詞是「Transformer 擴散」（一個架構跨越多個領域），2022 年的關鍵詞是「LLM 能力湧現」——模型夠大之後會出現質變，而不只是量的線性改善。Chain-of-Thought、InstructGPT、Chinchilla 這三篇論文指向的都是同一件事：我們對大模型能力的理解，在 2022 年被根本性地更新了。ChatGPT 的年底上線，只是把這個學術認知變成了公眾事實。

---

## 參考資料

- [NeurIPS 2022 Outstanding Paper Awards（官方 Blog 公告）](https://blog.neurips.cc/2022/11/21/announcing-the-neurips-2022-awards/)
- [NeurIPS 2022 Awards 頁面](https://neurips.cc/virtual/2022/awards_detail)
- [Synced — NeurIPS 2022 Announces Outstanding Papers and Test of Time Award](https://syncedreview.com/2022/11/23/neurips-2022-announces-its-outstanding-main-track-papers-outstanding-dataset-benchmark-papers-and-test-of-time-award/)
- [ICML 2022 Outstanding Paper Awards（AIhub 報導）](https://aihub.org/2022/07/21/congratulations-to-the-icml2022-outstanding-paper-award-winners/)
- [ICML 2022 Awards 頁面](https://icml.cc/virtual/2022/awards_detail)
- [ICLR 2022 Outstanding Paper Awards（官方 Blog 公告）](https://blog.iclr.cc/2022/04/20/announcing-the-iclr-2022-outstanding-paper-award-recipients/)
- [ICLR 2022 Press Release（PDF，含統計數字）](https://iclr.cc/media/Press/ICLR_2022_Press_Release.pdf)
- [CVPR 2022 Paper Awards（官方頁面）](https://cvpr2022.thecvf.com/cvpr-2022-paper-awards)
- [ECCV 2022 Awards（官方 PDF）](https://eccv2022.ecva.net/files/2022/10/ECCV22-Awards.pdf)
- [ACL 2022 Best Paper Awards（官方頁面）](https://2022.aclweb.org/best-paper-awards.html)
- [EMNLP 2022 Best Long Paper — Cornell Bowers CIS 報導](https://bowers.cornell.edu/news-stories/cornell-natural-language-processing-scholars-win-best-paper-top-conference)
- [NAACL 2022 Best Paper Awards（官方 Blog）](https://2022.naacl.org/blog/best-papers/)
- [AAAI 2022 Awards（官方頁面）](https://aaai-2022.virtualchair.net/awards)
- [IJCAI-ECAI 2022 Distinguished Papers（AIhub 報導）](https://aihub.org/2022/07/28/congratulations-to-the-authors-of-the-ijcai2022-distinguished-papers/)
- [Wei et al. (2022) "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models"（NeurIPS 2022）](https://arxiv.org/abs/2201.11903)
- [Ouyang et al. (2022) "Training Language Models to Follow Instructions with Human Feedback"（InstructGPT, NeurIPS 2022）](https://arxiv.org/abs/2203.02155)
- [Hoffmann et al. (2022) "Training Compute-Optimal Large Language Models"（Chinchilla, NeurIPS 2022）](https://arxiv.org/abs/2203.15556)
- [Gu et al. (2022) "Efficiently Modeling Long Sequences with Structured State Spaces"（S4, ICLR 2022）](https://arxiv.org/abs/2111.00396)
- [Yi Tay (2023) "2022 in Review: Top Language AI Research Papers"（Yitay.net Blog）](https://www.yitay.net/blog/2022-best-nlp-papers)
