---
title: "2024 AI 頂會在收什麼題目：Agent 元年與 Scaling 辯論"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, research-trends, "2024", topic-analysis, ai-agent, scaling-law, multimodal]
lang: zh-TW
tldr: "2024 年 AI 頂會的關鍵字是 agent、alignment、multimodal LLM 和 inference-time compute——LLM 相關論文在五大會議的佔比從 2023 年的顯著上升再度翻倍，agent 相關關鍵詞成長 4.3 倍，而 diffusion model 從「新興方向」正式晉升為與 LLM 並列的雙主軸。同時，傳統任務導向 NLP 研究持續萎縮，GAN 幾乎從頂會消失。"
description: "回顧 2024 年 NeurIPS、ICML、ICLR、ACL、EMNLP、CVPR、ECCV、AAAI、IJCAI 九大 AI 頂會的得獎論文與主題分布，從研究方向的維度分析哪些題目全面爆發、哪些開始冒頭、哪些已飽和，以及站在 2026 年回頭看哪些方向的投入回報最高。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 21
glossary:
  - term: "DPO"
    definition: "Direct Preference Optimization，一種不需要訓練獨立 reward model 的 alignment 方法，直接用偏好資料優化語言模型，比 RLHF 的 PPO 訓練流程更簡單。"
    context: "2024 年 DPO 及其變體成為 alignment 研究的主流替代方案。"
  - term: "inference-time compute"
    definition: "在推論階段投入額外計算資源（如 chain-of-thought、搜尋樹、self-verification）來提升答案品質，而非靠更大的預訓練模型。"
    context: "2024 年底 OpenAI o1 的發佈讓這個方向從學術研究變成產業焦點。"
  - term: "3D Gaussian Splatting"
    definition: "一種用大量 3D 高斯分布來表示場景的即時渲染技術，比 NeRF 快數個量級，2024 年在 CV 會議大量出現。"
    context: "CVPR 2024 的 Best Student Paper（Mip-Splatting）就是這個方向。"
---

2024 年是 AI 研究全面「LLM 化」的一年。一項對五大 AI 會議（ACL、CVPR、ICLR、ICML、NeurIPS）約 80,000 篇已接受論文的縱向分析顯示，LLM 相關論文的佔比在 2024 年繼續急升，agent 相關關鍵詞成長 4.3 倍，而 diffusion model 與 LLM 並列成為兩大生成式 AI 主軸。這篇從得獎論文和主題分布兩個維度，拆解 2024 年 AI 頂會到底在收什麼題目。

## 2024 年得獎論文一覽

先看各會議的得獎論文——它們是審稿委員會認為「當年最值得關注」的研究方向風向標。

### ML 三大會議

**NeurIPS 2024**（投稿 15,671 / 接受 4,037 / 25.8%）

| 獎項 | 論文 | 團隊 | 方向 |
|---|---|---|---|
| Best Paper | Visual Autoregressive Modeling: Scalable Image Generation via Next-Scale Prediction | Keyu Tian 等（北大／位元組跳動） | 視覺生成 |
| Best Paper | Stochastic Taylor Derivative Estimator | Zekun Shi 等（NUS） | 科學計算 / PDE |
| Runner-up | Not All Tokens Are What You Need for Pretraining | Zhenghao Lin 等（清華／Microsoft） | LLM 訓練效率 |
| Runner-up | Guiding a Diffusion Model with a Bad Version of Itself | Tero Karras 等（NVIDIA） | Diffusion 推論 |
| D&B Best Paper | The PRISM Alignment Dataset | Hannah Rose Kirk 等（Oxford／Meta） | LLM Alignment |
| Test of Time | Generative Adversarial Nets（2014）| Goodfellow 等 | — |
| Test of Time | Sequence to Sequence Learning（2014）| Sutskever 等 | — |

兩篇 Best Paper 分屬視覺生成和科學計算，兩篇 Runner-up 都跟 LLM 訓練效率或 diffusion 推論有關，D&B Best Paper 是 alignment 資料集——五篇得獎論文涵蓋了 2024 年最熱門的三個大方向。

**ICML 2024**（投稿 9,473 / 接受 2,609 / 27.5%）

從超過 9,400 篇投稿中選出 10 篇 Best Paper，範圍極廣：

- **Scaling Rectified Flow Transformers for High-Resolution Image Synthesis**（Stability AI / Robin Rombach 等）——Stable Diffusion 3 背後的技術，rectified flow 正式取代 DDPM 成為新一代擴散模型訓練範式
- **Genie: Generative Interactive Environments**（Google DeepMind）——從無標注網路影片學習可互動的「世界模型」，11B 參數的 foundation world model
- **Debating with More Persuasive LLMs Leads to More Truthful Answers**（Anthropic / NYU / UCL）——用 LLM 辯論作為 alignment 手段，弱模型（non-expert）能透過觀看強模型辯論來判斷正確答案
- **Discrete Diffusion Modeling by Estimating the Ratios of the Data Distribution**（Stanford）——離散空間的 diffusion model，橋接離散與連續生成
- **Position: Considerations for Differentially Private Learning with Large-Scale Public Pretraining**（ETH / Google DeepMind / Waterloo）——挑戰「用公開資料預訓練 + DP 微調」的隱私假設
- **Position: Measure Dataset Diversity, Don't Just Claim It**（Sony AI）——資料集多樣性的量測框架

ICML 2024 的 Best Paper 有一個明顯特徵：**Position paper 佔了兩篇**，反映頂會開始重視「挑戰既有假設」類的概念性貢獻。世界模型（Genie）和 LLM 對齊（Debating）的入選則預示了這兩個方向在 2025 年的進一步爆發。

**ICLR 2024**（投稿 7,262 / 接受 2,260 / 31.1%）

5 篇 Outstanding Paper + 11 篇 Honorable Mention：

- **Vision Transformers Need Registers**（Meta FAIR）——發現 ViT 特徵圖中的高 norm artifact，用額外 register token 解決
- **Learning Interactive Real-World Simulators（UniSim）**（UC Berkeley / Google DeepMind）——從多源資料學習可互動的真實世界模擬器，又一篇世界模型
- **Never Train from Scratch**——用自監督預訓練重新評估 SSM vs Transformer 的公平比較，發現 Transformer 表現被嚴重低估
- **Protein Discovery with Discrete Walk-Jump Sampling**——抗體蛋白質設計，97-100% 的生成樣本成功表達純化
- **Generalization in Diffusion Models Arises from Geometry-Adaptive Harmonic Representations**——diffusion model 為什麼能泛化的理論分析

Honorable Mention 裡有幾篇值得注意：**Model Tells You What to Discard: Adaptive KV Cache Compression for LLMs**（KV cache 壓縮，預示了 2025 年 inference efficiency 的爆發）、**Proving Test Set Contamination in Black-Box Language Models**（測試集汙染檢測）、**Robust Agents Learn Causal World Models**（agent 學因果世界模型）、**Flow Matching on General Geometries**（flow matching 的理論推廣）。

Test of Time 首次頒發，給了 VAE（Kingma & Welling, 2014）和 Adversarial Examples（Szegedy et al., 2014）。

### NLP 會議

**ACL 2024**（投稿 4,407 / 接受 940 / 21.3%）

ACL 2024 首次實施新的獎項政策，將得獎論文擴展到 Outstanding Papers（≤ 2.5% 接受論文）。從 102 篇提名中選出的 Outstanding Papers 涵蓋：

- LLM 知識缺口識別與拒答（Don't Hallucinate, Abstain）
- 多智能體系統安全（PsySafe）
- LLM 長上下文評估（L-Eval、M4LE）
- LLM 價值觀評估（Political Compass or Spinning Arrow?）
- 語音翻譯 × Foundation Model（Speech Translation with Speech Foundation Models and LLMs）
- 多語言程式碼生成（IRCoder）
- LLM 因果推理去偏（Causal-Guided Active Learning for Debiasing LLMs）

一個明顯的模式：**幾乎每篇 Outstanding Paper 都跟 LLM 直接相關**。傳統 NLP 任務（句法分析、語義角色標註、機器翻譯獨立於 LLM 的方法）在得獎名單中已經邊緣化。

**EMNLP 2024**（投稿 6,105 / 接受 1,271 / 20.8%）

5 篇 Best Paper：
- **An Image Speaks a Thousand Words, but Can Everyone Listen?**（CMU）——圖像跨文化轉譯
- **Towards Robust Speech Representation Learning for Thousands of Languages**（CMU）——跨語言語音表示學習
- **Backward Lens: Projecting Language Model Gradients into the Vocabulary Space**（Technion / Tel Aviv）——LLM 可解釋性
- **Pretraining Data Detection for Large Language Models**（CAS / UvA）——LLM 預訓練資料偵測
- **CoGen: Learning from Feedback with Coupled Comprehension and Generation**（Cornell）——理解與生成的耦合學習

EMNLP 2024 的 Best Paper 比 ACL 更多元——語音、視覺、可解釋性都有，不完全被 LLM 壟斷，但 LLM 可解釋性和資料偵測仍是核心議題。

### CV 會議

**CVPR 2024**（投稿 11,532 / 接受 2,719 / 23.6%）

CVPR 2024 破紀錄地頒出 10 篇 Best Paper（前一年是 5 篇）：

- **Best Paper**: Generative Image Dynamics（Google Research）、Rich Human Feedback for Text-to-Image Generation（UCSD / Google / USC / Cambridge）
- **Best Student Paper**: Mip-Splatting: Alias-free 3D Gaussian Splatting（Tübingen）、BioCLIP: A Vision Foundation Model for the Tree of Life（Ohio State / Microsoft Research）
- **Honorable Mention**: EventPS（事件相機）、pixelSplat（3D Gaussian）、SpiderMatch（3D 形狀匹配）、Image Processing GNN（超解析度）、Objects as Volumes（隨機幾何）、Comparing Decision-Making Mechanisms by Transformers and CNNs

3D Gaussian Splatting 在得獎名單中佔兩席（Mip-Splatting + pixelSplat），反映這個方向在 2024 年 CV 會議的爆發程度。文生圖的人類回饋（Rich Human Feedback）入選則標誌著 CV 領域也開始認真對待 alignment。

**ECCV 2024**（投稿 8,585 / 接受 2,387 / 27.8%）

- **Best Paper**: Minimalist Vision with Freeform Pixels（Columbia / Nayar）——回歸基礎的感測器設計
- **Honorable Mention**: Concept Arithmetics for Circumventing Concept Inhibition in Diffusion Models、Rasterized Edge Gradients、SEA-RAFT（光流）
- **Outstanding Paper** 包括 Sapiens（Meta，人體視覺 foundation model）、PointLLM（LLM 理解點雲）、PathMMU（病理學多模態基準）

ECCV 2024 的 Best Paper 反而是最「非主流」的——不是 LLM、不是 diffusion、不是 3DGS，而是回到感測器物理層面的基礎研究。但 Outstanding Paper 名單中 LLM × CV 的交叉論文已經佔了顯著比例。

### AI 綜合

**AAAI 2024**（投稿 9,862 / 接受 2,342 / 23.8%）

3 篇 Outstanding Paper：GxVAEs（藥物分子生成）、Reliable Conflictive Multi-view Learning（多視角學習）、Proportional Aggregation of Preferences for Sequential Decision Making（公平決策）。AAAI 2024 的得獎論文跟 LLM 潮流保持了距離——三篇都是各自領域的紮實貢獻，沒有一篇直接以 LLM 為主題。

**IJCAI 2024**（投稿 5,651 / 接受 791 / 14.0%）

3 篇 Distinguished Paper：Online Combinatorial Optimization with Group Fairness Constraints、Enhancing Controlled Query Evaluation Through Epistemic Policies、Online Learning of Capacity-Based Preference Models。IJCAI 同樣偏向傳統 AI 議題——公平性、知識表示、偏好學習——跟 ML 三大會議的 LLM 潮形成對比。

## 最熱門的研究方向

### LLM Agent / Tool Use

2024 年是 AI agent 從概念走向系統化研究的元年。根據跨會議的論文統計，agent 相關關鍵詞在 2024 年成長 4.3 倍（從 12 篇到 51 篇），如果計入所有相關變體（agents、llm agents、multi-agent system），實際成長更劇烈——llm agents 成長 11 倍。

ICML 2024 收了 GPTSwarm（用計算圖優化 agent 架構）和 TravelPlanner（LLM agent 規劃基準）；ACL 2024 的 PsySafe 直接研究多智能體系統的安全攻防；ICLR 2024 的 Honorable Mention 包含 Robust Agents Learn Causal World Models。

這個方向在 2024 年底隨著 Claude Computer Use 和各種 coding agent 的產品化而進一步加速。

### LLM Alignment（DPO 及其變體）

InstructGPT / RLHF 在 2022-2023 年建立了 alignment 的基本範式，2024 年的主旋律是「更簡單、更穩定的替代方案」。DPO（Direct Preference Optimization）及其大量變體（IPO、KTO、ORPO、SimPO）成為最活躍的子領域之一。

NeurIPS 2024 的 D&B Best Paper（PRISM）就是 alignment 資料集；ICML 2024 的 Debating 論文探索了辯論式 alignment；NeurIPS 2024 還有一篇 Oral 用 iterative DPO 優化 chain-of-thought 推理。

### Multimodal LLM

Multimodal LLM 在 2024 年成長 5.6 倍（從 12 篇到 67 篇），是成長最快的方向之一。GPT-4V 和 Gemini 的發佈讓視覺-語言模型從研究走向產品，會議上大量出現各種開源 MLLM（LLaVA 系列、Cambrian-1、InternVL）和對應的基準測試。

ECCV 2024 的 PointLLM、PathMMU 和 CVPR 2024 的多篇論文都反映了 LLM 與視覺模態融合的趨勢。EMNLP 2024 的 Best Paper 也有圖像跨文化理解和語音表示學習——NLP 會議開始大量接收多模態論文。

### Inference-Time Compute / Reasoning

2024 年底 OpenAI o1 的發佈讓「在推論時投入更多計算來提升推理能力」成為最受關注的新方向。但這個趨勢在年中的會議上已有端倪：chain-of-thought 相關研究持續活躍，NeurIPS 2024 有用 iterative preference optimization 改進 CoT 推理的論文，ICLR 2024 的 Honorable Mention 包含 KV cache 壓縮（inference efficiency 的另一面）。

根據跨會議統計，「reasoning」關鍵詞在 2024→2025 年成長 4.6 倍（47→216 篇），是成長最快的單一關鍵詞之一。

### Diffusion Model 與 Flow Matching

Diffusion model 在 2024 年已從「新興方向」正式成為穩定主流。更重要的趨勢是 **flow matching 的崛起**——ICML 2024 的 Best Paper（Scaling Rectified Flow Transformers）確立了 rectified flow 作為新一代生成模型訓練範式的地位，ICLR 2024 的 Honorable Mention 有 Flow Matching on General Geometries。Flow matching 在 2024 年成長 3.9 倍，預計將在 2025-2026 年進一步取代傳統 DDPM。

NeurIPS 2024 的兩篇 Runner-up 都跟 diffusion 有關（Autoguidance + Selective Language Modeling），VAR（Best Paper）則代表了自回歸模型在視覺生成上挑戰 diffusion 的新嘗試。

### 3D Gaussian Splatting

3DGS 是 2024 年 CV 會議最具代表性的「爆發方向」。從 2023 年底的原始論文開始，到 CVPR 2024 已有數百篇相關論文，Best Student Paper（Mip-Splatting）和 Honorable Mention（pixelSplat）都是 3DGS。這個方向幾乎完全取代了 NeRF 在即時 3D 渲染領域的地位。

### AI for Science

ICLR 2024 的 Protein Discovery（Outstanding Paper）、AAAI 2024 的 GxVAEs（藥物分子生成）、NeurIPS 2024 的 Stochastic Taylor Derivative Estimator（Best Paper，物理模擬 PDE）——AI for Science 在 2024 年不只是「有論文」，而是開始拿 Best Paper。蛋白質設計、分子生成、PDE 求解三個子領域都有得獎級別的成果。

## 開始冒頭的方向

### World Models

ICML 2024 的 Genie 和 ICLR 2024 的 UniSim 都是世界模型方向的得獎論文。World model 在 2024 年成長 4.0 倍（10→40 篇），預計在 2026-2028 年進一步爆發。這個方向的核心問題是：能不能從影片資料學到一個可互動的世界模擬器，讓 agent 在裡面訓練？

### Mechanistic Interpretability

機械式可解釋性在 2024 年成長 3.7 倍（27→100 篇），從一個小眾方向變成有足夠論文量的獨立子領域。EMNLP 2024 的 Backward Lens（Best Paper）就是這個方向——把語言模型的梯度投射回詞彙空間來理解模型行為。ICLR 2024 的 Honorable Mention 也有 The Mechanistic Basis of Data Dependence（in-context learning 的機械式分析）。

### State Space Models

SSM（特別是 Mamba）在 2024 年成長 3.8 倍。ICLR 2024 的 Never Train from Scratch（Outstanding Paper）雖然結論是「Transformer 被低估了」，但它的研究對象正是 SSM vs Transformer 的比較——這個方向本身夠熱才會值得一篇 Outstanding Paper 來回應。到 2024 年底，Mamba 2、Jamba 等模型持續推進這條路線，但 Transformer 仍然佔據主導地位。

### Test Set Contamination / Data Provenance

ICLR 2024 Honorable Mention 的 Proving Test Set Contamination 和 EMNLP 2024 Best Paper 的 Pretraining Data Detection——兩個獨立方向都在追問同一個問題：LLM 到底看過什麼資料？這反映了社群對 LLM 評估可信度的焦慮，預計在 2025-2026 年持續升溫。

## 已飽和或開始下降的方向

### GAN

NeurIPS 2024 把 Test of Time 頒給了 2014 年的 GAN 原始論文——這幾乎是一個象徵性的告別。GAN 架構改進論文在 2024 年的頂會中已經近乎消失，被 diffusion model 和 flow matching 全面取代。少數殘留的 GAN 相關論文主要集中在「用 diffusion 改進 GAN」或「GAN 的理論分析」，而非 GAN 本身的架構創新。

### 傳統任務導向 NLP

ACL 2024 的 Outstanding Paper 幾乎全部跟 LLM 相關，傳統 NLP 任務（命名實體識別、關係抽取、依存句法分析的獨立模型）在得獎名單中已經消失。跨會議統計也證實了這個趨勢——傳統任務導向 NLP 類別在 2023-2024 年持續相對下降，被 LLM 範式吸收。

### 純 Prompt Engineering

經過 2022-2023 年的爆發，單純的 prompt 設計論文（「我發現了一個更好的 prompt 模板」）在 2024 年開始遇到接受率下滑。審稿社群越來越要求 prompt 研究有系統性的理論支撐或大規模的實證驗證，而不只是在幾個 benchmark 上刷數字。

### NeRF

NeRF 被 3D Gaussian Splatting 快速取代。2024 年仍有少量 NeRF 改進論文，但新的 3D 表示學習研究幾乎都轉向了 3DGS。CVPR 2024 的 Best Paper Honorable Mention（pixelSplat）明確展示了 3DGS 在泛化能力上超越 NeRF 的趨勢。

## 跟 2023 年的對比

| 維度 | 2023 | 2024 |
|---|---|---|
| LLM 佔比 | 急速上升，但仍有大量非 LLM 論文 | 全面主導，幾乎所有子領域都在探索 LLM 應用 |
| Agent | 概念階段，少量論文 | 系統化研究爆發（4.3× 成長） |
| Diffusion | 主流化完成 | 穩定主流 + flow matching 崛起 |
| 3DGS | 剛發表原始論文 | CVPR 數百篇，兩篇得獎 |
| Alignment | RLHF 為主 | DPO 變體百花齊放 |
| World Model | 零星探索 | 兩篇得獎（Genie、UniSim） |
| Position Paper | 偶有出現 | ICML 兩篇 Best Paper，頂會開始重視 |

## 站在 2026 年回看

2024 年選什麼題目的研究者後來發展最好？

1. **Inference-time compute / reasoning**——2024 年底 o1 發佈後這個方向全面爆發，2025 年成為各大會議最熱門的投稿主題（成長 4.6 倍）。2024 年在這個方向有佈局的研究者搶到了先發優勢。

2. **AI Agent 系統化研究**——從 2024 的 51 篇到 2025 年持續加速，agent 架構、tool use、multi-agent 都成為獨立的研究子領域。這個方向的商業需求（coding agent、browser agent）也在同步爆發。

3. **Flow matching**——2024 年的 3.9 倍成長在 2025 年繼續擴大，Stable Diffusion 3、Flux 等產品都採用了 rectified flow，學術界跟進速度極快。

4. **Mechanistic interpretability**——從 3.7 倍成長持續擴大，Anthropic、Google DeepMind 等機構投入大量資源，2025-2026 年成為 alignment 研究的重要支柱。

5. **World models**——Genie 2、SORA 等產品讓這個方向保持了學術和產業雙重熱度，但「學到的世界模型到底有多少物理理解」仍是開放問題。

相對地，2024 年投入純 prompt engineering 或純 GAN 改進的研究者，到 2025 年幾乎找不到頂會的發表空間——前者需要更深的理論化，後者的賽道已經關閉。

## 整體來說

2024 年 AI 頂會的題目分布呈現三個結構性特徵：**LLM 範式的全面滲透**（從 NLP 擴散到 CV、語音、科學計算）、**生成式 AI 的雙主軸化**（LLM + Diffusion/Flow 並行）、以及**從「能力」到「治理」的轉向**（alignment、contamination detection、dataset diversity 開始拿 Best Paper）。

最值得注意的或許是 AAAI 和 IJCAI 的「抵抗」——這兩場 AI 綜合會議的得獎論文刻意保持了跟 LLM 潮流的距離，繼續表彰公平性、知識表示、決策理論等傳統 AI 議題。這不一定是保守——也可能是在 LLM 狂潮中維持領域多樣性的重要功能。

---

## 參考資料

- [NeurIPS 2024 Best Paper Awards 官方公告（PDF）](https://media.neurips.cc/Conferences/NeurIPS2024/NeurIPS2024_Best_Paper_Awards.pdf)
- [NeurIPS Blog — Announcing the NeurIPS 2024 Best Paper Awards](https://blog.neurips.cc/2024/12/10/announcing-the-neurips-2024-best-paper-awards/)
- [ICML 2024 Awards 官方頁面](https://icml.cc/virtual/2024/awards_detail)
- [AIHub — Congratulations to the ICML 2024 award winners](https://aihub.org/2024/07/25/congratulations-to-the-icml2024-award-winners/)
- [ICLR 2024 Outstanding Paper Awards 官方 Blog](https://blog.iclr.cc/2024/05/06/iclr-2024-outstanding-paper-awards/)
- [ICLR 2024 Fact Sheet（官方 PDF）](https://media.iclr.cc/Conferences/ICLR2024/ICLR2024-Fact_Sheet.pdf)
- [ICLR 2024 Press Release（官方 PDF）](https://media.iclr.cc/Conferences/ICLR2024/ICLR2024_Press_Release.pdf)
- [ACL 2024 Best Paper Awards 官方頁面](https://2024.aclweb.org/program/best_papers/)
- [ACL Anthology — ACL 2024 Proceedings 前言](https://aclanthology.org/2024.acl-long.0.pdf)
- [EMNLP 2024 Best Papers 官方頁面](https://2024.emnlp.org/program/best_papers/)
- [CMU LTI — LTI Authors Win Dual Best Paper Awards at EMNLP](https://www.lti.cs.cmu.edu/news-and-events/news/2024-11-21-emnlp-best-papers.html)
- [CVPR 2024 Best Paper Awards 官方公告](https://cvpr.thecvf.com/Conferences/2024/News/Awards)
- [IEEE Computer Society — CVPR 2024 Announces Best Paper Award Winners](https://www.computer.org/press-room/cvpr-2024-announces-best-paper-award-winners)
- [ECCV 2024 Awards 官方頁面](https://eccv.ecva.net/Conferences/2024/Awards)
- [AAAI-24 Paper Awards 官方頁面](https://aaai.org/about-aaai/aaai-awards/aaai-24-paper-awards/)
- [AIHub — Congratulations to the IJCAI 2024 distinguished paper award winners](https://aihub.org/2024/08/07/congratulations-to-the-ijcai2024-distinguished-paper-award-winners/)
- [Khanbayov & Kurban (2026) "Topical Phase Transitions in Artificial Intelligence Research" — 80,814 篇論文的跨會議主題分析](https://doi.org/10.5281/zenodo.20635335)
- [Matej Gazda — Paper Map: NeurIPS / CVPR / ICLR / ICML 2024-2025 語意地圖](https://matejgazda.com/posts/paper-map.html)
- [Zeta Alpha — A Guide to NeurIPS 2024: 10 Research Areas & Spotlight Papers](https://www.zeta-alpha.com/post/a-guide-to-neurips-2024)
- [State of AI Report 2024](https://www.stateof.ai/2024)
