---
title: "2025 AI 頂會導讀：機器學習篇"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, neurips, icml, iclr, aaai, ijcai, "2025", machine-learning, reasoning, ai-agent, scaling-law]
lang: zh-TW
tldr: "2025 年是 ML 頂會投稿量全面破紀錄、審稿系統承壓到極限的一年。NeurIPS 收了 21,575 篇投稿動用超過兩萬名審稿人，ICML 首度突破 12,000 篇，ICLR 也衝上 11,565 篇。研究主題上，reasoning 與 agent 成為最強勢的兩股潮流——NeurIPS Best Paper 之一直接質疑 RLVR 是否真的帶來新推理能力，拿下該屆唯一滿分；而 attention 機制的結構性改進（Alibaba Qwen 的 Gated Attention）和 neural scaling laws 的理論解釋同時獲獎，標誌著社群正從「衝規模」轉向「理解為什麼有效」。"
description: "2025 年 NeurIPS、ICML、ICLR 三大機器學習會議以及 AAAI、IJCAI 的得獎論文、高影響力論文、與年度趨勢完整導讀。涵蓋 Gated Attention、RLVR 質疑、1000 層 RL 網路、diffusion 泛化理論、neural scaling laws 的超位置解釋、CollabLLM、safety alignment 深度問題等關鍵進展。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 22
glossary:
  - term: "RLVR"
    definition: "Reinforcement Learning from Verifiable Rewards——用可驗證的獎勵訊號（如數學題的正確答案）做強化學習，DeepSeek R1 和 OpenAI o1 等 reasoning model 的核心訓練方法。"
    context: "NeurIPS 2025 唯一滿分論文質疑 RLVR 是否真的帶來新推理能力。"
  - term: "Gated Attention"
    definition: "在標準 Scaled Dot-Product Attention 後加上逐 head 的 sigmoid 門控——一個極小的結構改動，但能改善訓練穩定性、消除 attention sink、提升 scaling 行為。"
    context: "Alibaba Qwen 團隊以此拿下 NeurIPS 2025 Best Paper。"
  - term: "attention sink"
    definition: "LLM 推論時，前幾個 token 不論語義如何都會吸走大量 attention 權重的現象——一種已知但難以消除的注意力分配偏差。"
    context: "Gated Attention 的 sigmoid 門控可以消除此現象。"
---

> 本文是「[AI 頂會導讀](/posts/ai/2026-08-23-what-is-ai-top-conference)」系列的 2025 年機器學習篇，涵蓋 NeurIPS、ICML、ICLR 三大會議以及 AAAI、IJCAI。

2025 年是 ML 頂會的規模紀錄年。NeurIPS 投稿量從 2024 年的 15,671 篇跳到 21,575 篇（+37.6%），ICML 從 9,473 跳到 12,107（+27.8%），ICLR 從 7,304 跳到 11,565（+58.3%）——三場會議的年增率都是近五年最高的。審稿系統的壓力也到了極限：NeurIPS 動用了 20,518 位 reviewer、1,663 位 Area Chair、199 位 Senior Area Chair，一場會議的審稿人池規模已經相當於一所中型大學的全部學術人員。

研究趨勢上，2025 年有兩個最顯著的轉向：一是「理解為什麼有效」的理論化工作密度明顯上升——scaling laws 的機制解釋、diffusion model 的泛化理論、RLVR 的能力邊界質疑都拿了最高獎項；二是 AI agent 相關論文從零散出現變成一個成熟的研究方向，NeurIPS 有超過 367 篇跟 agent 相關的論文被接受。

## NeurIPS 2025

投稿 21,575 篇，接受 5,290 篇，接受率 24.5%。2025 年 12 月在美國聖地牙哥舉行。

### Best Paper Awards（4 篇）

**Gated Attention for Large Language Models: Non-linearity, Sparsity, and Attention-Sink-Free**
Zihan Qiu, Zekun Wang, Bo Zheng 等（Alibaba Qwen）

在 Scaled Dot-Product Attention 輸出後加一個逐 head 的 sigmoid 門控——結構改動極小（推論延遲增加不到 2%），但系統性地改善了訓練穩定性、允許更大的 learning rate、消除了 attention sink 現象。Qwen 團隊在超過 30 個 15B MoE 模型和 1.7B dense 模型上做了對比實驗（3.5 兆 token 訓練集），這個改動已經被整合進 2025 年 9 月發佈的 Qwen3-Next。這是一篇把微小的結構洞察做到工業級規模驗證的典範。

**1000 Layer Networks for Self-Supervised RL: Scaling Depth Can Enable New Goal-Reaching Capabilities**
Kevin Wang, Ishaan Javali, Michał Bortkiewicz, Tomasz Trzciński, Benjamin Eysenbach（Princeton, Warsaw University of Technology）

RL 領域的政策網路通常只有 2-5 層。這篇把 Contrastive RL 的網路深度推到 1,024 層（用 residual connections + LayerNorm + Swish），在無監督目標導向任務上獲得 20x-50x 的性能提升，讓 humanoid agent 能在複雜迷宮中自主發展出移動策略——不需要任何手工設計的獎勵。核心發現：scaling depth 在 RL 裡的效果比過去認為的大得多，但需要搭配自監督學習框架才能釋放。

**Why Diffusion Models Don't Memorize: The Role of Implicit Dynamical Regularization in Training**
Tony Bonnaire, Raphaël Urfin, Giulio Biroli, Marc Mézard（ENS / Sorbonne, Bocconi）

解答了一個基礎問題：diffusion model 在訓練資料量有限的情況下為什麼不會死記硬背？論文識別出兩個不同的時間尺度——一個是模型開始生成高品質樣本的早期時間點，一個是記憶化（memorization）開始出現的晚期時間點——並證明這中間存在一個訓練動力學自動提供的正則化區間。這對理解生成式模型的泛化行為提供了理論基礎。

**Artificial Hivemind: The Open-Ended Homogeneity of Language Models (and Beyond)**
Liwei Jiang, Yuanjun Chai, Margaret Li 等（D&B Track）

引入 Infinity-Chat 資料集（26K queries、31K 人類標註），系統性地研究 70+ 個 SOTA LLM 的輸出同質化問題——當所有模型趨向相似的回答時，多樣性就消失了。這篇拿到 D&B Track 的 Best Paper，指出的問題（模型同質化）在 2025 年的 LLM 生態裡尤其尖銳。

### Runner-Up Papers（3 篇）

**Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model?**
Yang Yue, Zhiqi Chen, Rui Lu 等（Tsinghua）

這篇是 NeurIPS 2025 唯一一篇拿到 (6,6,6,6) 滿分的論文。直接質疑 RLVR（DeepSeek R1、OpenAI o1 等 reasoning model 的核心方法）：實驗顯示 RLVR 模型在 k 較小時確實優於 base model，但當 k 增大後 base model 會追上甚至超越——這表示 RLVR 主要是提升了取樣效率，而非創造出新的推理模式。結論非常尖銳：「RLVR 沒有擴展 base model 的推理能力邊界。」在 DeepSeek R1 和 o1 席捲業界的 2025 年，這篇論文的逆向觀點格外引人注目。

**Optimal Mistake Bounds for Transductive Online Learning**
Zachary Chase, Steve Hanneke, Shay Moran, Jonathan Shafer

解決了一個 30 年的開放問題：建立 transductive 和 standard online learning 之間的二次 gap 的嚴格界限。純理論貢獻，但在 online learning 領域具有里程碑意義。

**Superposition Yields Robust Neural Scaling**
Yizhou Liu, Ziming Liu, Jeff Gore

提出 representation superposition（模型表徵的特徵數量超過維度數量）是驅動 neural scaling laws 的主要機制。在強超位置條件下，損失函數與模型維度呈反比——而開源 LLM 確實運作在強超位置區間，與 Chinchilla scaling laws 一致。這篇把 scaling laws 從經驗觀察推向了機制解釋。

### Test of Time Award

**Faster R-CNN: Towards Real-Time Object Detection with Region Proposal Networks**
Shaoqing Ren, Kaiming He, Ross Girshick, Jian Sun（2015）

引用數超過 98,000。引入 Region Proposal Network（RPN）讓區域提案幾乎零成本，後續影響了 Mask R-CNN、YOLO 系列等一整代物件檢測系統。任少卿（現任蔚來自動駕駛首席科學家）成為首位以中國為研究基地的第一作者獲得此獎。

### 高影響力非得獎論文

2025 年 NeurIPS 接受的 5,290 篇論文裡，有幾個值得特別注意的方向密度：

- **Agent 相關**：超過 367 篇涵蓋 agent benchmarking、tool use、reasoning、multi-agent collaboration、safety，標誌著 agent 已從概念走向系統性研究
- **Test-time compute scaling**：多篇論文探討推論時增加計算量是否能持續改善表現——結論是正在接近理論與實際極限
- **架構創新 vs 規模**：社群的焦點從「bigger is better」轉向架構選擇、訓練策略和評估框架才是真正的瓶頸

## ICML 2025

投稿 12,107 篇，接受 3,260 篇，接受率 26.9%。其中 Oral 佔 120 篇（1.0%），Spotlight Poster 佔 313 篇（2.6%）。2025 年 7 月在加拿大溫哥華舉行。

### Outstanding Paper Awards（6 篇主軌 + 2 篇 Position Paper）

**Score Matching with Missing Data**
Josh Givens, Song Liu, Henry Reeve（University of Bristol, Nanjing University）

缺失資料下的 score matching 理論——解決了一個看起來基礎但實際上未被充分研究的問題。

**Conformal Prediction as Bayesian Quadrature**
Jake Snell, Thomas Griffiths

把 conformal prediction 重新框架為 Bayesian quadrature 問題，建立了兩個領域之間的理論橋接。

**CollabLLM: From Passive Responders to Active Collaborators**
Shirley Wu, Michel Galley, Baolin Peng 等（Microsoft Research, Stanford）

教 LLM 主動協作——知道什麼時候該追問、怎麼調整溝通風格。引入 Multiturn-aware Rewards（MR）框架，用 LLM-based user simulator 模擬未來對話輪次來估算長期影響。201 位真實使用者的研究顯示：使用者滿意度提升 17.6%、任務完成時間減少 10.4%。這篇論文的重要性在於它代表了 LLM 研究從「回答得好」到「互動得好」的轉向。

**Train for the Worst, Plan for the Best: Understanding Token Ordering in Masked Diffusions**
Jaeyeon Kim, Kulin Shah, Vasilis Kontonis, Sham Kakade, Sitan Chen（Harvard, UT Austin）

分析 masked diffusion model 中 token 排序的理論性質，為理解離散 diffusion 的訓練動力學提供了新的理論工具。

**Roll the Dice & Look Before You Leap: Going Beyond the Creative Limits of Next-Token Prediction**
Vaishnavh Nagarajan, Chen Wu, Charles Ding, Aditi Raghunathan

證明 next-token prediction 在本質上限制了演算法創造力——多 token 方法可以突破這個限制。對 autoregressive 架構的根本侷限提供了形式化的論證。

**The Value of Prediction in Identifying the Worst-Off**
Unai Fischer Abaigar, Christoph Kern, Juan Perdomo（Harvard, LMU Munich）

公平性與預測的交叉——研究如何用預測模型識別最弱勢群體，同時避免偏見放大。

**Position Paper: AI Safety should prioritize the Future of Work**
Sanchaita Hazra, Bodhisattwa Prasad Majumder, Tuhin Chakrabarty

重新定義 AI safety 辯論的框架：不只是模型對齊和防止濫用，更應該把「工作的未來」放在 safety 議程的核心位置。

**Position Paper: The AI Conference Peer Review Crisis Demands Author Feedback and Reviewer Rewards**
Jaeho Kim, Yunseok Lee, Seulki Lee

直面 AI 會議審稿系統的危機——投稿量暴增、審稿品質下降——主張需要作者回饋機制和審稿人獎勵制度。這篇 position paper 本身就是在 ICML 被接受的事實，說明了社群對審稿危機的認真程度。

### Test of Time Award

**Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift**
Sergey Ioffe, Christian Szegedy（2015）

Test of Time Honorable Mentions 則頒給了 **Trust Region Policy Optimization (TRPO)**（John Schulman 等）和 **Variational Inference with Normalizing Flows**（Danilo Rezende, Shakir Mohamed）——三篇都是 2015 年的工作，十年後的影響力依然顯著。

## ICLR 2025

投稿 11,565 篇，接受 3,710 篇，接受率 32.1%。2025 年 4 月在新加坡舉行。

ICLR 2025 的投稿量年增 58.3%（2024 年 7,304 篇），是五大 ML 會議中成長最快的。接受率 32% 看起來比 NeurIPS/ICML 的 25-27% 高，但這部分反映了 ICLR 的審稿文化差異——ICLR 歷年接受率一直在 30-40% 區間，跟 NeurIPS/ICML 的 20-28% 區間是不同的選擇性標準，不能簡單地用接受率高低來比較門檻。

### Outstanding Papers（3 篇）

**Safety Alignment Should be Made More Than Just a Few Tokens Deep**
Xiangyu Qi, Ashwinee Panda, Kaifeng Lyu 等（Princeton）

指出當前 LLM 的 safety alignment 可以走捷徑——只調整最前面幾個生成 token 的分佈就能通過安全測試，但這種「淺層對齊」很容易被攻擊繞過或被 fine-tuning 破壞。論文稱之為 shallow safety alignment，並提出需要更深層的對齊方法。這在 2025 年 jailbreak 攻擊頻繁的背景下格外重要。

**Learning Dynamics of LLM Finetuning**
Yi Ren, Danica J. Sutherland（UBC）

從理論角度分析 LLM fine-tuning 的學習動力學——模型在 fine-tuning 過程中到底學了什麼、忘了什麼、動態是怎麼演變的。為理解 fine-tuning 行為提供了形式化框架。

**AlphaEdit: Null-Space Constrained Model Editing for Language Models**
Junfeng Fang, Houcheng Jiang 等（USTC, NUS）

模型知識編輯的新方法：把參數擾動投影到已保留知識的 null space 上，確保編輯新知識時不破壞舊知識。只需加一行投影程式碼，就能把大多數 locate-then-edit 方法的性能平均提升 36.7%。簡潔、有效、可直接整合到現有方法中。

### Honorable Mentions（3 篇）

**Data Shapley in One Training Run**
Jiachen T. Wang, Prateek Mittal, Dawn Song, Ruoxi Jia

把 Data Shapley 值（衡量每筆訓練資料對模型的貢獻）的計算從需要多次訓練壓縮到單次訓練就能完成——實用性大幅提升。

**SAM 2: Segment Anything in Images and Videos**
Nikhila Ravi 等（Meta FAIR）

Segment Anything Model 的第二代——從靜態圖像擴展到影片，支援即時的影片物件分割。已被廣泛應用於下游任務。

**Faster Cascades via Speculative Decoding**
Harikrishna Narasimhan 等（Google）

用 speculative decoding 加速 cascade 推論——在不犧牲品質的前提下顯著提升多模型級聯推論的速度。

## AAAI 2025（附帶）

投稿 12,957 篇，接受 3,032 篇，接受率 23.4%。2025 年 2-3 月在美國費城舉行。

### Best Paper

**Revelations: A Decidable Class of POMDPs with Omega-Regular Objectives**
Marius Belly, Nathanaël Fijalkow, Hugo Gimbert, Florian Horn, Guillermo Perez, Pierre Vandenhove（LaBRI / Université de Bordeaux, Université de Mons）

識別出一類可判定的 POMDP（部分可觀測馬可夫決策過程），在 omega-regular 目標下可以精確求解——這在 POMDP 研究中是罕見的正面理論結果。

### Outstanding Papers

- **Every Bit Helps: Achieving the Optimal Distortion with a Few Queries** — Soroush Ebadian, Nisarg Shah。用少量查詢達到最佳失真的社會選擇理論貢獻。
- **Efficient Rectification of Neuro-Symbolic Reasoning Inconsistencies by Abductive Reflection** — Wen-Chao Hu, Yuan Jiang, Zhi-Hua Zhou, Wang-Zhou Dai（Nanjing University）。用 abductive reasoning 修正神經符號推理的不一致性。

### AISI Track Outstanding Paper

**DivShift: Exploring Domain-Specific Distribution Shifts in Large-Scale, Volunteer-Collected Biodiversity Datasets** — Elena Sierra 等。揭示志願者收集的生物多樣性資料集中的系統性偏差。

### Classic Paper Award

**Toward an Architecture for Never-Ending Language Learning** — Tom Mitchell, Andrew Carlson 等。2010 年提出的「永不停止學習」架構，預見了持續學習的核心挑戰。

## IJCAI 2025（附帶）

投稿 5,806 篇，接受 1,023 篇（主軌），接受率 17.6%。另有特別賽道 136 篇、Survey 52 篇、Journal 17 篇、Sister Conference 12 篇。2025 年 8 月在加拿大蒙特婁舉行。

### Distinguished Papers

- **Combining MORL with Restraining Bolts to Learn Normative Behaviour** — Emery A. Neufeld, Agata Ciabattoni, Radu Florin Tulcan（TU Wien）。把多目標 RL 跟約束機制結合來學習規範行為。
- **Boost Embodied AI Models with Robust Compression Boundary** — Chong Yu, Tao Chen, Zhongxue Gan。用壓縮邊界提升具身 AI 模型的效率。
- **Speeding Up Hyper-Heuristics With Markov-Chain Operator Selection and the Only-Worsening Acceptance Operator** — Abderrahim Bendahi, Benjamin Doerr, Adrien Fradin, Johannes F. Lutzeyer。加速超啟發式演算法的理論與實作貢獻。

## 2025 年整體觀察

### 審稿系統已到極限

NeurIPS 2025 動用超過兩萬名審稿人，但投稿量成長速度仍然快過審稿人池的擴張。ICML 2025 的一篇 Outstanding Position Paper 直接以「The AI Conference Peer Review Crisis」為題被接受——會議自身的發表管道裡出現了質疑這個管道是否還能運作的論文，這本身就是一個訊號。加上 Pangram Labs 對 ICLR 2026 審稿週期的分析發現約 21% 的審稿意見可能是 AI 生成的，審稿系統的公信力正面臨前所未有的壓力。

### 從「衝規模」到「理解為什麼有效」

2025 年得獎論文有一個明顯的共同特徵：不是在做更大的模型或更高的 benchmark 分數，而是在解釋已有成果為什麼有效。Diffusion model 為什麼不會死記硬背？Scaling laws 的底層機制是什麼？RLVR 到底有沒有創造新的推理能力？Next-token prediction 的根本侷限在哪？這些問題的集中出現，標誌著 ML 社群正從工程驅動的規模競賽轉向理論驅動的理解階段。

### Reasoning 與 Agent：最強勢的兩股潮流

DeepSeek R1 和 OpenAI o1 在 2025 年初引爆了 reasoning model 的熱潮，但學術界的回應不是跟風，而是質疑——NeurIPS 唯一滿分論文就是在問 RLVR 是否真的有效。Agent 研究則從概念走向系統化：NeurIPS 接受了超過 367 篇 agent 相關論文，涵蓋 benchmarking、tool use、multi-agent、safety 等多個子方向。ICML 的 CollabLLM 則代表了另一個面向——不是讓 agent 更自主，而是讓 LLM 更會跟人協作。

### 跟 2024 年相比有什麼變化

- **投稿量加速成長**：NeurIPS +37.6%、ICML +27.8%、ICLR +58.3%，成長率本身在加速
- **理論化工作獲獎比例上升**：2024 年得獎論文以方法論創新為主，2025 年則有更多純理論或理論驅動的解釋性工作
- **Position paper track 的影響力上升**：ICML 的 position paper track 從 2024 年開始，2025 年有兩篇拿到 Outstanding Paper，其中一篇直接影響了會議自身的改革討論
- **中國機構的獲獎密度持續增加**：Alibaba Qwen（NeurIPS Best Paper）、Tsinghua（NeurIPS 唯一滿分 Runner-Up）、USTC（ICLR Outstanding Paper）、Nanjing University（AAAI Outstanding Paper）

### 回頭看：哪些 2025 年的論文可能影響最深遠

1. **Gated Attention**（NeurIPS）——已整合進 Qwen3-Next，可能改變後續所有 attention 實作的預設選擇
2. **RLVR 質疑論文**（NeurIPS）——如果結論站得住，會直接影響 reasoning model 的訓練策略方向
3. **Safety Alignment 深度問題**（ICLR）——shallow alignment 的概念已經在 safety 研究中成為標準參考
4. **CollabLLM**（ICML）——從「回答得好」到「互動得好」的範式轉移，可能影響 LLM 產品設計的方向
5. **Superposition Yields Robust Neural Scaling**（NeurIPS）——如果 superposition 確實是 scaling laws 的底層機制，這篇會改變我們理解和預測模型能力的方式

---

## 參考資料

- [Announcing the NeurIPS 2025 Best Paper Awards — NeurIPS Blog](https://blog.neurips.cc/2025/11/26/announcing-the-neurips-2025-best-paper-awards/)
- [Announcing the Test of Time Paper Award for NeurIPS 2025 — NeurIPS Blog](https://blog.neurips.cc/2025/11/26/announcing-the-test-of-time-paper-award-for-neurips-2025/)
- [NeurIPS 2025 Fact Sheet（官方 PDF）](https://media.neurips.cc/Conferences/NeurIPS2025/press/NeurIPS2025-Fact_Sheet.pdf)
- [Alibaba Qwen Wins "NeurIPS 2025 Best Paper Award" for Breakthrough in Attention Mechanisms — Alizila](https://www.alizila.com/alibaba-qwen-wins-neurips-2025-best-paper-award-for-breakthrough-in-attention-mechanisms/)
- [The Only Perfect Score Paper at NeurIPS 2025 — bycloud](https://mail.bycloud.ai/p/the-only-perfect-score-paper-at-neurips-2025)
- [NeurIPS 2025: 45 Computer-Use Agent Papers You Should Know About — Cua Blog](https://cua.ai/blog/neurips-2025-cua-papers)
- [ICML 2025 Awards](https://icml.cc/virtual/2025/awards_detail)
- [CollabLLM: Teaching LLMs to Collaborate with Users — Microsoft Research](https://www.microsoft.com/en-us/research/blog/collabllm-teaching-llms-to-collaborate-with-users/)
- [ICML 2025 Acceptance Rate: 3,260/12,107 = 26.9% — CS Conf Stats](https://csconfstats.xoveexu.com/conferences/icml/2025/)
- [Announcing the Outstanding Paper Awards at ICLR 2025 — ICLR Blog](https://blog.iclr.cc/2025/04/22/announcing-the-outstanding-paper-awards-at-iclr-2025/)
- [ICLR 2025 Fact Sheet（官方 PDF）](https://media.iclr.cc/Conferences/ICLR2025/ICLR2025_Fact_Sheet.pdf)
- [ICLR 2025 Acceptance Rate: 3,710/11,565 = 32.1% — CS Conf Stats](https://csconfstats.xoveexu.com/conferences/iclr/2025/)
- [Congratulations to the #AAAI2025 Outstanding Paper Award Winners — AIhub](https://aihub.org/2025/03/01/congratulations-to-the-aaai2025-outstanding-paper-award-winners/)
- [Best Paper Award at AAAI 2025 Conference — LaBRI](https://www.labri.fr/en/actualites/best-paper-award-aaai-2025-conference)
- [AAAI 2025 Acceptance Rate: 3,032/12,957 = 23.4% — CS Conf Stats](https://csconfstats.xoveexu.com/conferences/aaai/2025/)
- [Congratulations to the #IJCAI2025 Distinguished Paper Award Winners — AIhub](https://aihub.org/2025/08/20/congratulations-to-the-ijcai2025-distinguished-paper-award-winners/)
- [IJCAI 2025 Distinguished Paper Award for TU Wien Researchers — VCLA](https://www.vcla.at/2025/08/ijcai-2025-distinguished-paper-award-for-tu-wien-researchers/)
- [IJCAI 2025 Main Track: 1,023/5,806 = 17.6% — IJCAI Official Twitter](https://x.com/IJCAIconf/status/1957803857347490245)
- [Kim, Lee & Lee (2025) "Position: The AI Conference Peer Review Crisis Demands Author Feedback and Reviewer Rewards" — PMLR v267](https://proceedings.mlr.press/v267/kim25am.html)
- [AlphaEdit: Null-Space Constrained Knowledge Editing — ICLR 2025 Proceedings](https://proceedings.iclr.cc/paper_files/paper/2025/hash/88be023075a5a3ff3dc3b5d26623fa22-Abstract-Conference.html)
