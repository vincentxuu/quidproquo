---
title: "2023 AI 頂會導讀：機器學習篇"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, neurips, icml, iclr, aaai, ijcai, "2023", machine-learning, dpo, llm, state-space-model]
lang: zh-TW
tldr: "2023 年是 LLM 全面接管 ML 頂會的一年。NeurIPS 投稿破 12,000 篇，兩篇 Outstanding Paper 都直接針對大模型（隱私審計與湧現能力質疑），Runner-Up 的 DPO 在短短兩年內成為 RLHF 的實質替代標準。ICLR 的 DreamFusion 開啟了 text-to-3D 賽道，ICML 則把 LLM 水印和學習率自適應推上舞台。Mamba 以 arXiv 預印本之姿在 NeurIPS 現場引爆討論，預示 Transformer 的第一個真正挑戰者即將到來。"
description: "2023 年 NeurIPS、ICML、ICLR 三大機器學習會議以及 AAAI、IJCAI 的得獎論文、高影響力論文、與年度趨勢完整導讀。涵蓋 DPO、LLM 湧現能力質疑、QLoRA、Tree of Thoughts、LLaVA、DreamFusion、LLM 水印、Mamba 等關鍵進展，並以後見之明回顧哪些 2023 年論文真正改變了後續研究方向。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 14
glossary:
  - term: "DPO（Direct Preference Optimization）"
    definition: "一種直接從人類偏好資料優化語言模型的演算法，跳過了傳統 RLHF 中獨立訓練 reward model 和 PPO 強化學習的步驟，用一個簡單的分類損失函數就能對齊模型行為。"
    context: "NeurIPS 2023 Outstanding Main Track Runner-Up，日後成為 RLHF 的實質替代標準。"
  - term: "QLoRA"
    definition: "結合 4-bit 量化和 LoRA（Low-Rank Adaptation）的高效微調方法，能在單張 48GB GPU 上微調 65B 參數的語言模型，同時維持接近全精度微調的效能。"
    context: "NeurIPS 2023 Oral 論文，讓缺乏頂級 GPU 叢集的研究者也能做大模型微調實驗。"
  - term: "State Space Model（SSM）"
    definition: "一類序列建模架構，基於連續時間的狀態空間方程式，可以在線性時間內處理長序列。Mamba 是 2023 年底提出的選擇性 SSM 變體，首次在語言建模上挑戰 Transformer 的統治地位。"
    context: "Mamba 以 arXiv 預印本形式發布於 2023 年 12 月，在 NeurIPS 2023 會場引起大量討論。"
---

> 🌏 [English version](/posts/ai/2026-08-24-ai-conference-2023-ml-en)

2023 年 GPT-4 發佈、LLaMA 開源、ChatGPT 席捲全球——LLM 從研究主題變成產業基礎設施，這股浪潮直接反映在頂會的投稿量和論文主題分布上。NeurIPS 投稿首度突破 12,000 篇，ICML 和 ICLR 也創下各自新高。得獎論文的主題結構出現明顯轉向：2022 年還是 diffusion model 與 scaling laws 平分天下，2023 年幾乎所有焦點都圍繞著大語言模型——怎麼對齊、怎麼評估、怎麼高效微調、怎麼保護隱私。

## NeurIPS 2023

投稿 12,343 篇，接受 3,218 篇（26.1%），再創歷史新高。NeurIPS 2023 延續上屆的三級獎項架構：Outstanding Main Track Paper、Outstanding Main Track Runner-Up、Outstanding Datasets & Benchmarks Paper，另設 Test of Time Award。

### Outstanding Main Track Papers

1. **Privacy Auditing with One (1) Training Run** — Thomas Steinke, Milad Nasr, Matthew Jagielski（Google DeepMind）。提出一種只需一次訓練就能審計差分隱私合規性的方法：隨機插入多個 canary 樣本，利用差分隱私與統計泛化之間的連結來推斷隱私洩漏程度，效率比傳統需要多次訓練的審計方法高出數個量級。

2. **Are Emergent Abilities of Large Language Models a Mirage?** — Rylan Schaeffer, Brando Miranda, Sanmi Koyejo（Stanford）。這篇直接挑戰了「大模型會湧現新能力」的廣泛信念：作者證明觀察到的「湧現」現象主要是度量選擇的產物——當使用非線性或不連續的度量時，能力看起來突然出現；換成線性、連續的度量後，效能提升就是平滑漸進的。這不是說大模型沒有新能力，而是說「突然湧現」這個敘事被度量放大了。

### Outstanding Main Track Runner-Ups

3. **Scaling Data-Constrained Language Models** — Niklas Muennighoff, Alexander Rush, Boaz Barak, Teven Le Scao, Nouamane Tazi, Aleksandra Piktus, Sampo Pyysalo, Thomas Wolf, Colin Raffel（Hugging Face / Cornell / Harvard）。直面一個很實際的問題：高品質文字資料是有限的，當你被迫重複使用訓練資料時，compute-optimal 的 scaling law 會怎麼變？結論是資料重複的損害比預期小，但 code 資料的混入能顯著減緩這個損害——這對所有面對資料瓶頸的研究者都有直接的工程意義。

4. **Direct Preference Optimization: Your Language Model is Secretly a Reward Model** — Rafael Rafailov, Archit Sharma, Eric Mitchell, Christopher D. Manning, Stefano Ermon, Chelsea Finn（Stanford）。DPO 可能是 2023 年影響力最大的單篇論文。它證明了 RLHF 中的 reward model + PPO 兩步流程可以被一個簡單的分類損失函數取代：直接從偏好資料對上優化 policy，不需要單獨訓練 reward model，也不需要 PPO 的不穩定訓練迴圈。發表不到兩年，DPO 及其變體（IPO、KTO、ORPO）已經成為對齊訓練的主流方法。

### Outstanding Datasets & Benchmarks Papers

5. **ClimSim: A large multi-scale dataset for hybrid physics-ML climate emulation** — Sungduk Yu, Walter Hannah, Liran Peng 等 30+ 位共同作者。目前最大的混合物理-ML 氣候模擬資料集，設計上可以直接插入實際的氣候模擬器做下游耦合——不是一個孤立的 ML benchmark，而是一個真正能推動氣候科學的工程產物。

6. **DecodingTrust: A Comprehensive Assessment of Trustworthiness in GPT Models** — Boxin Wang, Weixin Chen, Hengzhi Pei 等（UChicago / UIUC）。對 GPT-3.5 和 GPT-4 做了迄今最全面的可信度評估，涵蓋毒性、偏見、隱私洩漏、對抗魯棒性等八個維度，發現 GPT-4 在某些對抗場景下反而比 GPT-3.5 更容易被誘導產生有害輸出。

### Test of Time Award

**Distributed Representations of Words and Phrases and their Compositionality** — Tomas Mikolov, Ilya Sutskever, Kai Chen, Greg Corrado, Jeffrey Dean（2013 年發表）。就是 Word2Vec 的第二篇論文，引入了 negative sampling 和 phrase-level embedding，引用超過 40,000 次。Word2Vec 定義了「用向量表示詞義」這整個範式，是後來所有 embedding 方法（包括 GPT 系列）的直接前身。

### 得獎之外的高影響力論文

2023 年的 NeurIPS 有幾篇沒得獎但影響力極大的論文：

- **QLoRA: Efficient Finetuning of Quantized LLMs** — Tim Dettmers 等（University of Washington）。Oral 論文。結合 4-bit NormalFloat 量化、Double Quantization 和 Paged Optimizers 三項技術，讓 65B 模型可以在單張 48GB GPU 上做 LoRA 微調，效能跟全精度微調幾乎一樣。QLoRA 直接改變了整個 open-source LLM 社群的微調實踐——在此之前，微調大模型是大公司的特權；在此之後，一張消費級 GPU 就能做。

- **Tree of Thoughts: Deliberate Problem Solving with Large Language Models** — Shunyu Yao, Dian Yu, Jeffrey Zhao, Izhak Shafran, Thomas L. Griffiths, Yuan Cao, Karthik Narasimhan（Princeton / Google DeepMind）。把 LLM 的推理過程從線性的 chain-of-thought 推廣到樹狀搜索：模型在每一步產生多個候選「思考」，用啟發式或投票機制評估和回溯。在需要規劃和搜索的任務上（如 Game of 24）效果比 CoT 好一個量級。

- **LLaVA: Visual Instruction Tuning** — Haotian Liu 等（UW-Madison / Microsoft Research）。Oral 論文。用 GPT-4 生成多模態指令跟隨資料，訓練出一個端到端的視覺語言模型。LLaVA 是開源多模態模型的起點——後續的 LLaVA-1.5、LLaVA-NeXT 系列一直是該領域最活躍的研究線之一。

- **Fine-Tuning Language Models with Just Forward Passes (MeZO)** — Samir Yitzhak Gadre 等（Princeton）。零階優化器做 LLM 微調，記憶體需求只有 SGD 的 1/12，適合在記憶體極度受限的場景下微調大模型。

- **Jailbroken: How Does LLM Safety Training Fail?** — Alexander Wei, Nika Haghtalab, Jacob Steinhardt（Berkeley）。系統性分析安全訓練的失敗模式：competing objectives（安全目標 vs 有用目標的衝突）和 mismatched generalization（安全訓練沒有泛化到新的攻擊形式）。

**Mamba（場外最大焦點）**：Albert Gu 和 Tri Dao 的「Mamba: Linear-Time Sequence Modeling with Selective State Spaces」以 arXiv 預印本形式在 NeurIPS 2023 會議期間（2023 年 12 月 1 日）發布，雖然不是正式的 NeurIPS 論文，卻是整場會議最被討論的工作。Mamba 提出的選擇性 SSM 機制讓狀態空間模型的參數能根據輸入動態調整，在語言建模上首次達到與同等規模 Transformer 可比的效能，且推理速度在長序列上快數倍。這是 Transformer 架構自 2017 年以來面對的第一個看起來真正有機會的挑戰者。

## ICML 2023

投稿 6,538 篇，接受 1,827 篇（27.9%），是 ICML 首次接受率超過 25%。ICML 2023 選出 6 篇 Outstanding Paper，另頒 Test of Time Award。

### Outstanding Paper Awards

1. **Learning-Rate-Free Learning by D-Adaptation** — Aaron Defazio, Konstantin Mishchenko（Meta FAIR / Samsung AI Center）。提出一種不需要手動調整學習率的優化演算法——d-adaptation 透過在線估計梯度的距離尺度來自動設定學習率，在理論上有收斂保證，實務上在多個任務上跟精心調參的 Adam 表現相當。對於所有花大量時間在 learning rate scheduling 上的實踐者來說，這篇的價值很直接。

2. **A Watermark for Large Language Models** — John Kirchenbauer, Jonas Geiping, Yuxin Wen, Jonathan Katz, Ian Miers, Tom Goldstein（University of Maryland）。在 LLM 的 token 生成過程中嵌入統計水印：每一步把詞表分成「綠色」和「紅色」兩組，偏向選擇綠色 token，事後用統計檢定來偵測文字是否由特定模型生成。這篇直接回應了 ChatGPT 爆紅後「怎麼偵測 AI 生成文字」的急迫需求。

3. **Generalization on the Unseen, Logic Reasoning and Degree Curriculum** — Emmanuel Abbe, Samy Bengio, Aryo Lotfi, Kevin Rizk（EPFL / Apple）。研究神經網路在 boolean function 上的分布外泛化行為：用度數（degree）課程訓練可以讓模型學到低度數的布林函數後，泛化到更高度數的未見輸入。

4. **Adapting to Game Trees in Zero-Sum Imperfect Information Games** — Côme Fiegel, Pierre Ménard, Tadashi Kozuno, Rémi Munos, Vianney Perchet, Michal Valko（ENSAE / ENS Lyon / Omron Sinic X / DeepMind / CRITEO）。在不完全資訊博弈中提出一種能適應遊戲樹結構的演算法，遺憾上界取決於遊戲樹的大小而非最壞情況的動作空間。

5. **Self-Repellent Random Walks on General Graphs** — Vishwaraj Doshi, Jie Hu, Do Young Eun（IQVIA / NC State）。用非線性馬可夫鏈實現自排斥隨機遊走，在一般圖上達到最小採樣方差——解決了一個圖上取樣效率的基礎理論問題。

6. **Bayesian Design Principles for Frequentist Sequential Learning** — Yunbei Xu, Assaf Zeevi（Columbia University）。建立貝葉斯設計原則在頻率主義序列學習中的理論基礎，證明了貝葉斯方法在序列決策問題中的最優性。

### Test of Time Award

**Learning Fair Representations** — Rich Zemel, Yu Wu, Kevin Swersky, Toni Pitassi, Cynthia Dwork（2013 年發表）。學習資料的公平表示，讓下游分類器在使用這些表示時自動具備公平性。這篇開創了「ML 公平性」這個現在已經成熟的子領域。

## ICLR 2023

投稿 4,966 篇，接受約 1,574 篇（31.8%），其中 91 篇 Oral（top 1.6%）、280 篇 Spotlight（top 8%）。ICLR 2023 選出 4 篇 Outstanding Paper 和 5 篇 Honorable Mention（第六篇的完整資訊在部分來源中缺失）。

### Outstanding Paper Awards

1. **DreamFusion: Text-to-3D using 2D Diffusion** — Ben Poole, Ajay Jain, Jonathan T. Barron, Ben Mildenhall（Google Research / UC Berkeley）。提出 Score Distillation Sampling（SDS）：不需要任何 3D 訓練資料，直接用預訓練的 2D 圖像 diffusion model 來指導 NeRF 的優化，從文字描述生成 3D 物件。DreamFusion 開啟了整個 text-to-3D 賽道——後續的 Magic3D、ProlificDreamer、MVDream 等全都建立在 SDS 或其改良版本之上。

2. **Rethinking the Expressive Power of GNNs via Graph Biconnectivity** — Bohang Zhang, Shengjie Luo, Liwei Wang, Di He（Peking University / Microsoft Research Asia）。重新定義了圖神經網路的表達能力框架：用圖的雙連通性（biconnectivity）作為新的理論工具，提出比 Weisfeiler-Leman hierarchy 更精細的 GNN 能力分層。

3. **Universal Few-shot Learning of Dense Prediction Tasks with Visual Token Matching** — Donggyun Kim, Jinwoo Kim, Seongwoong Cho, Chong Luo, Seunghoon Hong（KAIST / Microsoft Research Asia）。提出一種統一的 few-shot 方法處理多種密集預測任務（語義分割、深度估計、表面法向量等），核心是用 visual token 的匹配機制取代任務特定的 head 設計。

4. **Emergence of Maps in the Memories of Blind Navigation Agents** — Erik Wijmans, Manolis Savva, Irfan Essa, Stefan Lee, Ari S. Morcos, Dhruv Batra（Georgia Tech / Simon Fraser / Meta AI）。訓練一個完全看不見的導航 agent（只有本體感覺），發現它的內部記憶自發地形成了空間地圖的表示——這是一個優雅的 emergent structure 實驗，跟認知科學中「內在空間認知」的研究直接對話。

### Outstanding Paper Honorable Mentions

- **Towards Understanding Ensemble, Knowledge Distillation and Self-Distillation in Deep Learning** — Zeyuan Allen-Zhu, Yuanzhi Li（Microsoft Research / CMU）
- **Mastering the Game of No-Press Diplomacy via Human-Regularized Reinforcement Learning and Planning** — Anton Bakhtin, David J. Wu 等（Meta FAIR）。CICERO 的技術細節論文，用人類正則化的 RL 在沒有溝通的外交遊戲中達到人類專家水平。
- **On the Duality between Contrastive and Non-contrastive Self-supervised Learning** — Quentin Garrido, Yubei Chen, Adrien Bardes, Laurent Najman, Yann LeCun（Meta FAIR / ESIEE Paris）。證明了對比式和非對比式自監督學習在有限假設下代數上等價。
- **Conditional Antibody Design as 3D Equivariant Graph Translation** — Xiangzhe Kong, Wenbing Huang, Yang Liu（Tsinghua University）。把抗體設計建模為 3D 等變圖翻譯問題。
- **Disentanglement with Biological Constraints: A Theory of Functional Cell Types** — James C. R. Whittington, Will Dorrell, Surya Ganguli, Timothy Behrens（Oxford / Stanford / UCL）

## AAAI 2023

投稿 8,777 篇，接受 1,721 篇（19.6%）。AAAI 2023 的獎項架構比較豐富：1 篇 Outstanding Paper、1 篇 Outstanding Student Paper、12 篇 Distinguished Paper。

### Outstanding Paper

**Misspecification in Inverse Reinforcement Learning** — Joar Skalse, Alessandro Abate（Oxford）。研究當 reward function 的假設空間跟真實 reward 不匹配時，逆強化學習會怎麼失敗——這個問題在 RLHF 時代特別重要，因為 reward model 的 misspecification 正是對齊失敗的核心風險之一。

### Outstanding Student Paper

**Decorate the Newcomers: Visual Domain Prompt for Continual Test Time Adaptation** — Yulu Gan, Yan Bai, Yihang Lou, Xianzheng Ma, Renrui Zhang, Nian Shi, Lin Luo。用視覺域提示（visual domain prompt）來做持續測試時適應，解決模型在部署後面對不斷變化的域分布時如何適應的問題。

### Distinguished Papers（12 篇，選列代表性方向）

- **DropMessage: Unifying Random Dropping for Graph Neural Networks** — 把 Dropout 的概念推廣到 GNN 的 message passing 機制
- **CowClip: Reducing CTR Prediction Model Training Time from 12 hours to 10 minutes on 1 GPU** — 把推薦系統訓練從 12 小時壓縮到 10 分鐘的工程論文
- **XRand: Differentially Private Defense against Explanation-Guided Attacks** — 用差分隱私防禦基於可解釋性的對抗攻擊
- **Clustering What Matters: Optimal Approximation for Clustering with Outliers** — 含離群點的聚類最優近似演算法
- **Robust Average-Reward Markov Decision Processes** — 魯棒平均回報 MDP 理論

## IJCAI 2023

投稿 4,566 篇，接受 643 篇（14.1%），IJCAI 維持了其一貫的低接受率。

### Distinguished Paper Awards

1. **Levin Tree Search with Context Models** — Laurent Orseau, Marcus Hutter, Levi H. S. Lelis（DeepMind / ANU / University of Alberta）。把 Levin tree search 跟上下文模型結合，用於程式合成和搜索問題。

2. **SAT-Based PAC Learning of Description Logic Concepts** — Balder ten Cate, Maurice Funk, Jean Christoph Jung, Carsten Lutz（University of Amsterdam / University of Bremen）。用 SAT 求解器來做描述邏輯概念的 PAC 學習。

3. **Safe Reinforcement Learning via Probabilistic Logic Shields** — KU Leuven 團隊。用機率邏輯護盾來做安全強化學習，防止 agent 在訓練和部署時採取不安全的動作。

## 2023 年整體觀察：三個定義性主題

**主題一：LLM 全面接管議程。** 2022 年的 ML 頂會還是 diffusion model、scaling laws、CoT 三足鼎立；2023 年幾乎所有焦點都在 LLM 上——怎麼對齊（DPO）、怎麼評估（Emergent Abilities、DecodingTrust）、怎麼高效微調（QLoRA、MeZO）、怎麼確保隱私（Privacy Auditing）、怎麼偵測（Watermark）、怎麼做多模態（LLaVA）、怎麼推理（Tree of Thoughts）。這不只是「LLM 論文變多了」——而是 LLM 成為了其他子領域的預設基礎設施，連 3D 生成（DreamFusion 用的是 2D diffusion model 的知識蒸餾）和氣候科學（ClimSim）都在跟 foundation model 的思路對話。

**主題二：從能力展示到安全與對齊。** 2022 年的焦點是「大模型能做什麼」（Chinchilla、CoT、Imagen）；2023 年的焦點轉向「大模型該怎麼控制」——DPO 解決對齊訓練的工程問題、Jailbroken 分析安全訓練為什麼會失敗、DecodingTrust 做全面的信任度評估、Watermark 處理偵測問題。這個轉向直接反映了 ChatGPT 上線後學術界和產業界對 AI 安全的急迫關注。

**主題三：Transformer 的第一個挑戰者。** Mamba 雖然不是正式的 NeurIPS 2023 論文，但它在會場引起的討論度可能超過任何一篇得獎論文。選擇性 SSM 提供了一條在長序列上線性複雜度推理的路徑，這對 Transformer 的 O(n²) attention 來說是結構性的挑戰。2023 年之後，幾乎所有新的序列建模架構論文都需要跟 Mamba 比較——即使 Transformer 至今仍佔統治地位。

### 跟 2022 年比較

| 維度 | 2022 | 2023 |
|---|---|---|
| 主旋律 | Diffusion model + Scaling laws + CoT | LLM 對齊 + 安全 + 高效微調 |
| 投稿規模（NeurIPS） | 10,411 | 12,343（+18.6%） |
| 得獎論文的企業 vs 學界 | 大致均衡 | Google/Stanford/Meta 主導 |
| 最具產業影響力 | Chinchilla（改寫訓練範式） | DPO（改寫對齊訓練） |
| 最大意外 | InstructGPT/RLHF 的影響力 | Emergent Abilities 的質疑 |
| 新興架構 | — | Mamba / SSM |

### 後見之明：2023 年最有持久影響力的五篇

1. **DPO**：成為對齊訓練的新標準，衍生出 IPO、KTO、ORPO、SimPO 等一整個方法家族
2. **QLoRA**：讓 open-source LLM 社群的微調實驗平民化
3. **LLaVA**：開啟了開源多模態模型的研究線
4. **DreamFusion / SDS**：定義了 text-to-3D 的方法論框架
5. **Mamba**：即使 Transformer 仍佔統治地位，SSM 成為每一篇新架構論文必須比較的 baseline

---

## 參考資料

- [Announcing the NeurIPS 2023 Paper Awards — NeurIPS Blog](https://blog.neurips.cc/2023/12/11/announcing-the-neurips-2023-paper-awards/)
- [NeurIPS 2023 Outstanding Papers — AIhub](https://aihub.org/2023/12/12/neurips2023-outstanding-papers/)
- [NeurIPS 2023: Top Papers and Award Winners — The Decoder](https://the-decoder.com/neurips-2023-these-are-the-top-papers-and-award-winners-at-the-largest-ai-conference/)
- [A Guide to NeurIPS 2023 — 7 Research Areas and 10 Spotlight Papers — Zeta Alpha](https://www.zeta-alpha.com/post/a-guide-to-neurips-2023-7-research-areas-and-10-spotlight-papers-to-read)
- [ICML 2023 Awards — Official Page](https://icml.cc/Conferences/2023/Awards)
- [ICML 2023 Test of Time Award — Official Page](https://icml.cc/Conferences/2023/Test-of-Time)
- [Announcing the ICLR 2023 Outstanding Paper Award Recipients — ICLR Blog](https://blog.iclr.cc/2023/03/21/announcing-the-iclr-2023-outstanding-paper-award-recipients/)
- [ICLR 2023 Fact Sheet（官方 PDF）](https://media.iclr.cc/Conferences/ICLR2023/ICLR2023-Fact_Sheet.pdf)
- [AAAI-23 Paper Awards（官方 PDF）](https://aaai-23.aaai.org/wp-content/uploads/2023/02/AAAI-23-Paper-Awards-1.pdf)
- [AAAI 2023 Best Paper Winners — AIhub](https://aihub.org/2023/02/11/congratulations-to-the-aaai2023-best-paper-winners/)
- [IJCAI 2023 Distinguished Paper Awards — 官方頁面](https://ijcai-23.org/distinguished-paper-awards/)
- [Distinguished Paper Award at IJCAI 2023 — University of Alberta](https://www.ualberta.ca/en/computing-science/news-and-events/news/2023/september/distinguished-paper-award-at-ijcai-2023.html)
- [DPO — NeurIPS 2023 Proceedings](https://papers.nips.cc/paper_files/paper/2023/hash/a85b405ed65c6477a4fe8302b5e06ce7-Abstract-Conference.html)
- [Are Emergent Abilities a Mirage? — NeurIPS 2023 Proceedings](https://proceedings.neurips.cc/paper_files/paper/2023/hash/adc98a266f45005c403b8311ca7e8bd7-Abstract-Conference.html)
- [Mamba: Linear-Time Sequence Modeling with Selective State Spaces — arXiv:2312.00752](https://arxiv.org/abs/2312.00752)
- [LLaVA: Visual Instruction Tuning — GitHub](https://github.com/haotian-liu/llava)
- [Top-Conference-Best-Papers — GitHub](https://github.com/FeijiangHan/Top-Conference-Best-Papers)
- [CS Conf Stats — ICLR 2023](https://csconfstats.xoveexu.com/conferences/iclr/2023/)
