---
title: "2023 AI 頂會在收什麼題目：LLM 重寫研究議程的一年"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, research-trends, "2023", topic-analysis, llm, rlhf, hallucination, agent, 3d-gaussian-splatting]
lang: zh-TW
tldr: "2023 年是 LLM 全面重寫 AI 研究議程的第一年：DPO 拿下 NeurIPS Outstanding Runner-Up、ReAct 成為 ICLR Oral、hallucination 從邊緣詞彙變成每場會議的熱門 track——同時 3D Gaussian Splatting 在 SIGGRAPH 發表後橫掃 CV 社群，Mamba 年底出現挑戰 Transformer 的注意力壟斷，而傳統 NLP pipeline 的論文量開始明確萎縮。"
description: "回顧 2023 年九大 AI 頂會的得獎論文與主題分布，從研究方向的維度分析 LLM 如何重塑各會議的投稿結構：alignment/DPO、hallucination、RAG、agent/tool use 全面爆發，multimodal LLM 和 3D Gaussian Splatting 開始冒頭，傳統 task-specific NLP 和純 NeRF 研究走入下坡，以及站在 2026 年回頭看哪些方向回報最高。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 17
glossary:
  - term: "DPO (Direct Preference Optimization)"
    definition: "一種繞過訓練獎勵模型、直接用偏好數據優化語言模型的對齊方法。2023 年在 NeurIPS 獲 Outstanding Runner-Up，2024 年起成為 LLM 對齊的主流替代方案。"
    context: "2023 年 DPO 論文發表時，RLHF 還是絕對主流；DPO 用數學上等價但實作上簡單得多的方式達到相近效果。"
  - term: "3D Gaussian Splatting (3DGS)"
    definition: "用大量 3D 高斯函數表示場景，透過可微分光柵化實現即時渲染的新型三維重建方法，挑戰 NeRF 的隱式表徵主導地位。"
    context: "2023 年在 SIGGRAPH 發表，隨即成為 CV 頂會的熱門投稿方向。"
  - term: "Mamba"
    definition: "基於選擇性狀態空間模型（Selective SSM）的序列建模架構，達到線性時間複雜度，是第一個在語言建模上真正匹配 Transformer 品質的非注意力模型。"
    context: "2023 年 12 月發佈 preprint，成為挑戰 Transformer 注意力壟斷的標誌性工作。"
---

2023 年的 AI 頂會發生了一件很少見的事：一整個領域的研究議程被一個產品——ChatGPT——在一年之內重新排列。2022 年 11 月 ChatGPT 上線，2023 年是它影響學術圈的第一個完整年度。翻開這一年各大會議的得獎論文和投稿關鍵詞，你會看到一幅跟 2022 年截然不同的圖景：LLM alignment 從冷門躍為主流、hallucination 從邊緣詞彙變成每場會議的熱門 track、agent 和 tool use 從概念走向實作——而傳統的 task-specific NLP pipeline 論文量開始明確萎縮。

## 最熱門：LLM 對齊、評估與安全

2023 年跨會議出現頻率最高的關鍵詞群是 **LLM alignment / RLHF / DPO**——整個「如何讓大型語言模型按人類意圖行事」的研究方向。

**NeurIPS 2023 的 Outstanding Runner-Up 頒給了 DPO（Direct Preference Optimization）**——Stanford 的 Rafael Rafailov、Chelsea Finn 等人提出的方法，繞過訓練獎勵模型的步驟，直接從偏好數據優化語言模型。DPO 的數學洞見很簡單：RLHF 的目標函式可以被重寫成一個不需要顯式獎勵模型的 loss function，大幅降低對齊訓練的工程複雜度。這篇論文在 2024-2025 年成為 LLM 對齊領域引用量最高的方法之一，直接催生了 SimPO、IPO、KTO 等一系列後續變體。

同屆 NeurIPS 的另一篇 **Outstanding Paper「Are Emergent Abilities of Large Language Models a Mirage?」**（Rylan Schaeffer、Sanmi Koyejo 等）則從反面質疑了 LLM 能力的敘事：他們用數學模型和實驗證明，所謂的「湧現能力」可能只是度量選擇的假象——用非線性度量就會看到突變，用線性度量就會看到平滑漸變。這篇論文在學術圈引起激烈辯論，因為它直接挑戰了 scaling laws 敘事中最令人興奮的部分。

**LLM 評估與信任度**同樣是 NeurIPS 2023 的焦點：**Outstanding D&B Paper「DecodingTrust」**（王博鑫、Dawn Song、Bo Li 等）對 GPT-4 和 GPT-3.5 做了包含毒性、偏見、對抗魯棒性、隱私洩漏在內的八維度信任度評估，發現 GPT-4 在標準測試上更可靠，但面對 jailbreak prompt 反而比 GPT-3.5 更脆弱——推測原因是 GPT-4 更精確地遵循指令，包括誤導性指令。

**ICML 2023 的 Outstanding Paper「A Watermark for Large Language Models」**（Maryland 的 John Kirchenbauer、Tom Goldstein 等）則從另一個角度回應 LLM 安全問題：他們提出了一套可驗證的 LLM 文字浮水印方案，在不顯著影響生成品質的情況下，讓 AI 生成的文字可被偵測。這在 2023 年 AI 生成內容氾濫的背景下特別有意義。

## Hallucination：從邊緣詞彙到每場會議的必備 track

2023 年之前，hallucination 在 AI 會議裡大概是摘要生成（summarization）領域的一個子議題。2023 年之後，它變成了幾乎每一場主要會議都有專門 session 的核心問題。

**EMNLP 2023** 的投稿中出現了大量 hallucination 相關論文，FLARE（Forward-Looking Active REtrieval Augmented Generation）是其中的代表——它提出在生成過程中，當模型對下一句的信心度低時主動觸發檢索，而不是只在開頭檢索一次。這個「生成中動態檢索」的思路直接影響了後來 RAG 系統的設計。

**ACL 2023** 也反映了這個趨勢：Best Paper 之一的「Do Androids Laugh at Electric Sheep?」（Jack Hessel、Yejin Choi 等）用 New Yorker 漫畫標題比賽來測試 LLM 的幽默理解能力，暴露了 LLM 在需要常識推理和文化背景的任務上的系統性弱點。另一篇 Best Paper「From Pretraining Data to Language Models to Downstream Tasks」（Shangbin Feng、Yulia Tsvetkov 等）則追蹤政治偏見如何從預訓練數據一路傳導到下游模型，直接關聯到 LLM 的可信度問題。

一篇量化分析（Movva et al., NAACL 2024）對 16,979 篇 LLM 相關 arXiv 論文的主題建模顯示，2023 年成長最快的主題是「Applications of LLMs/ChatGPT」（8 倍成長）和「Societal Implications of LLMs」（4 倍成長），Hallucination 相關研究作為其中的核心子集同步急速膨脹。

## Agent 與 Tool Use：從概念到實作框架

2023 年是 AI agent 從概念走向工程的一年。

**ICLR 2023 將 ReAct 列為 Oral（top 5%）**——Yao 等人提出的 ReAct（Reasoning + Acting）框架讓 LLM 在推理和行動之間交替：推理軌跡幫助模型規劃和處理例外，行動則讓模型存取外部工具（如 Wikipedia API）來補充資訊。在 HotpotQA 和 WebShop 等基準上，ReAct 大幅超越純 imitation learning 和 RL 方法。這篇論文成為後來 LangChain、AutoGPT 等 agent 框架的理論基礎。

2023 年的 arXiv 上，AutoGPT（3 月）、BabyAGI（4 月）、Voyager（5 月，NeurIPS 2023 投稿）、Generative Agents（Stanford 的「小鎮模擬」，也投稿 2023 年會議）等一系列 agent 工作密集出現。雖然這些工作中不少是 preprint 而非正式會議論文，但它們的影響力透過開源社群快速擴散，直接改變了 2024 年各大會議的投稿方向——agent 從「可能的未來方向」變成「每場會議都有專門 track 或 workshop」的熱門領域。

## RAG：從學術概念到工程標配

Retrieval-Augmented Generation 在 2020 年由 Meta 的 Lewis 等人提出原始論文，但 2023 年才是它真正從學術概念變成工程標配的一年——直接原因是 ChatGPT 暴露了 LLM 的知識截斷和幻覺問題，而 RAG 被視為最務實的解決方案。

2023 年各大會議中，RAG 相關的論文涵蓋了多個面向：
- **多跳檢索**（multi-hop retrieval）：如何在需要多次推理跳轉的問題上有效檢索
- **主動式檢索**（active retrieval）：前述 FLARE 等方法，在生成過程中動態決定何時檢索
- **檢索品質評估**：如何判斷檢索到的文件是否真的有用，避免引入噪音

**EMNLP 2023** 的 Best Paper 之一「Label Words are Anchors: An Information Flow Perspective for Understanding In-Context Learning」（Lean Wang、Lei Li 等）從資訊流的角度解釋 in-context learning 的機制，雖然不直接是 RAG 論文，但它對「模型如何利用上下文資訊」的理解直接影響了 RAG 系統的 prompt 設計。

## 新冒頭：Multimodal LLM、3D Gaussian Splatting、Mamba

### Multimodal LLM

2023 年 3 月 GPT-4 發佈時宣稱具備視覺理解能力，同年 LLaVA（Visual Instruction Tuning）、MiniGPT-4、InstructBLIP 等開源 multimodal LLM 密集出現。這些工作在 2023 年的會議上大多以 preprint 或 workshop 形式出現，真正大規模進入主軌是 2024 年——但 2023 年是這個方向的起點。

**ICLR 2023 的 Outstanding Paper「DreamFusion: Text-to-3D using 2D Diffusion」**（Google 的 Ben Poole、Jonathan Barron 等）用 2D diffusion model 的先驗來生成 3D 物件，不需要任何 3D 訓練數據，標誌著文字到 3D 生成的跨模態能力開始被嚴肅對待。

### 3D Gaussian Splatting

**SIGGRAPH 2023（ACM TOG）上發表的 3D Gaussian Splatting**（Bernhard Kerbl、George Drettakis 等，INRIA）是 2023 年 CV 領域最重要的方法論突破之一。它用數百萬個 3D 高斯函數表示場景，透過可微分的 tile-based 光柵化實現即時（≥30 fps）的 1080p 新視角合成，品質與 Mip-NeRF 360 相當但訓練時間從 48 小時降到 35-45 分鐘、渲染速度從 10 秒/幀提升到即時。

3DGS 不是在傳統 AI 頂會上發表的，而是走了 graphics 社群的路線。但它對 CV 頂會的衝擊在 2024 年全面顯現——CVPR 2024 和 ECCV 2024 上出現了大量基於 3DGS 的論文，純 NeRF 方法的論文佔比開始明確下降。

### Mamba 與 State Space Models

2023 年 12 月，Albert Gu 和 Tri Dao 發佈了 **Mamba** 的 preprint。Mamba 基於選擇性狀態空間模型（Selective SSM），是第一個在語言建模上真正匹配 Transformer 品質的線性時間序列模型：Mamba-3B 在常識推理上超越 Pythia-3B 甚至逼近 Pythia-7B，同時推理吞吐量是同規模 Transformer 的 5 倍。

這是繼 2022 年 S4（Structured State Spaces for Sequence Modeling，ICLR 2022 Honorable Mention）之後的重大進展。Mamba 的出現讓「Transformer 不是唯一選擇」這個假設第一次有了可信的實驗證據支持——儘管它最終是否能取代 Transformer 仍是 2024-2025 年的激烈辯論主題（Mamba-2 在 ICML 2024 發表時，標題直接寫「Transformers are SSMs」）。

## CV 領域：Segment Anything 與 ControlNet 重新定義基礎模型

2023 年 CV 領域的兩個標誌性事件都來自 **ICCV 2023**：

**ControlNet**（Lvmin Zhang、Maneesh Agrawala）拿下了 ICCV 2023 的 **Best Paper（Marr Prize）**之一。ControlNet 在 Stable Diffusion 等預訓練 text-to-image 模型上加入空間條件控制（邊緣、深度、姿態等），讓使用者在不重新訓練大模型的情況下精確控制生成結果。它用 zero convolution 的設計保證微調過程不引入有害噪音，在發表後迅速成為圖像生成工作流的標準組件。

**Segment Anything（SAM）**（Alexander Kirillov、Ross Girshick 等，Meta）拿下 ICCV 2023 **Honorable Mention**。SAM 建立了一個包含 11M 張圖片和 10 億個 mask 的資料集，訓練出一個可透過 prompt（點擊、框選、文字）進行零樣本分割的通用模型——它的零樣本表現經常達到甚至超越全監督方法。SAM 本質上是把「基礎模型」概念從語言擴展到了視覺分割任務。

**CVPR 2023** 的 Best Paper 同樣反映了 LLM 思維進入 CV 的趨勢：**Visual Programming**（Tanmay Gupta、AI2）用程式碼組合現有視覺模組來做複合視覺推理，不需要額外訓練——這跟 LLM 的 tool use 思路一脈相承。另一篇 Best Paper **Planning-oriented Autonomous Driving**（Yihan Hu、Jifeng Dai 等）則用端到端規劃重新定義自動駕駛的任務框架。

CVPR 2023 Best Student Paper Honorable Mention 頒給了 **DreamBooth**（Nataniel Ruiz、Google），讓使用者用少量圖片微調 text-to-image 模型來生成特定主體的圖像——這是 2023 年個人化 AI 生成的代表性工作。

## ML 理論與基礎：仍有堅實的非 LLM 工作

儘管 LLM 主導了 2023 年的媒體敘事，ML 會議的得獎論文仍然有相當比例落在基礎理論上：

- **NeurIPS 2023 Outstanding Paper「Privacy Auditing with One (1) Training Run」**（Thomas Steinke、Google DeepMind）——用單次訓練就能審計差分隱私系統的方法，利用平行添加/移除訓練樣本的特性，將原本需要訓練數百個模型的隱私審計降到只需一次
- **ICML 2023 Outstanding Paper「Learning-Rate-Free Learning by D-Adaptation」**（Aaron Defazio、FAIR）——自適應學習率方法，不需要任何學習率超參數調整
- **ICML 2023 Outstanding Paper「Generalization on the Unseen, Logic Reasoning and Degree Curriculum」**（Emmanuel Abbe、EPFL/Apple）——用 degree curriculum 讓模型學會邏輯推理並泛化到未見過的案例
- **ICLR 2023 Outstanding Paper「Rethinking the Expressive Power of GNNs via Graph Biconnectivity」**（Bohang Zhang、Di He）——從圖的雙連通性角度重新分析 GNN 的表達能力，發現大多數現有 GNN 架構無法學習這些基本指標
- **AAAI 2023 Outstanding Paper「Misspecification in Inverse Reinforcement Learning」**（Joar Skalse、Alessandro Abate）——分析當環境模型被錯誤指定時，逆強化學習會如何失敗

這些工作提醒我們：LLM 的媒體熱度並不代表整個 ML 研究都轉向了 LLM。隱私、優化理論、圖學習、強化學習的基礎問題仍然在最高水準的會議上獲得認可。

## 已飽和或開始下降的方向

### 傳統 NLP Pipeline

2023 年最明顯的萎縮方向是**傳統的 task-specific NLP 方法**。在 ChatGPT 出現之前，NLP 研究的主流模式是：定義一個特定任務（NER、情感分析、關係抽取等）→ 設計特定模型 → 在特定 benchmark 上刷分。2023 年之後，越來越多的這類任務被證明可以用通用 LLM 的 zero-shot 或 few-shot 能力直接解決，導致投稿這類方向的論文品質門檻大幅提高——不是不能做，而是必須證明你的方法在這個特定任務上比直接用 GPT-4 更好、更便宜、或更有某種特定優勢。

前述對 17K arXiv 論文的分析也確認了這個趨勢：BERT 和 task-specific 架構相關的研究主題在 2023 年明確萎縮，「centralization around newer models (e.g., GPT-4 and LLaMA)」是驅動力。

### 純 NeRF 研究

NeRF 在 2020-2022 年經歷了三年的爆發式成長（ICCV 2021 單場就有 25+ 篇 NeRF 論文），但 2023 年 3D Gaussian Splatting 的出現開始改變格局。3DGS 在品質相當的情況下訓練速度快數十倍、渲染達到即時——這使得 2024 年起「改進 NeRF」這個方向的論文越來越需要解釋為什麼不用 3DGS。純 NeRF 方法沒有消失，但增量改進型的 NeRF 論文空間被壓縮了。

### 純 Benchmark Gaming

2023 年的另一個趨勢是**學術圈對 benchmark gaming 的反思加速**。NeurIPS 2023 的「Are Emergent Abilities a Mirage?」就是典型例子——它質疑的不只是 LLM 的湧現能力，更是整個「用特定度量在特定 benchmark 上刷分」的研究範式的可靠性。ACL 2023 也出現了多篇關於 evaluation methodology 的批判性論文。這種反思在 2024 年進一步強化，最終催生了更多元的評估框架（如 HELM、MMLU-Pro 等）。

## 2023 年各會議得獎論文總覽

| 會議 | 獎項 | 論文 | 方向 |
|---|---|---|---|
| NeurIPS | Outstanding Paper | Privacy Auditing with One Training Run | 差分隱私 |
| NeurIPS | Outstanding Paper | Are Emergent Abilities of LLMs a Mirage? | LLM 評估 |
| NeurIPS | Outstanding Runner-Up | Scaling Data-Constrained Language Models | Scaling Laws |
| NeurIPS | Outstanding Runner-Up | Direct Preference Optimization (DPO) | LLM 對齊 |
| NeurIPS | Outstanding D&B | DecodingTrust | LLM 信任度 |
| NeurIPS | Outstanding D&B | ClimSim | AI for Science |
| NeurIPS | Test of Time | Word2Vec (2013) | 詞嵌入 |
| ICML | Outstanding Paper | Learning-Rate-Free Learning by D-Adaptation | 優化 |
| ICML | Outstanding Paper | A Watermark for Large Language Models | LLM 安全 |
| ICML | Outstanding Paper | Generalization on the Unseen | 泛化理論 |
| ICML | Outstanding Paper | Adapting to Game Trees | 博弈論 |
| ICML | Outstanding Paper | Self-Repellent Random Walks | 採樣理論 |
| ICML | Outstanding Paper | Bayesian Design Principles | 序列學習 |
| ICLR | Outstanding Paper | DreamFusion: Text-to-3D | 跨模態生成 |
| ICLR | Outstanding Paper | Rethinking GNN Expressive Power | 圖神經網路 |
| ICLR | Outstanding Paper | Emergence of Maps in Blind Agents | 具身 AI |
| ICLR | Outstanding Paper | Visual Token Matching | Few-shot 學習 |
| ICLR | Honorable Mention | Mastering No-Press Diplomacy | 多智能體 RL |
| ICLR | Honorable Mention | Contrastive vs Non-Contrastive SSL Duality | 自監督學習 |
| CVPR | Best Paper | Visual Programming | 視覺推理 |
| CVPR | Best Paper | Planning-oriented Autonomous Driving | 自動駕駛 |
| CVPR | Best Student Paper HM | DreamBooth | 個人化生成 |
| ICCV | Marr Prize | Passive Ultra-Wideband Single-Photon Imaging | 計算攝影 |
| ICCV | Marr Prize | ControlNet | 可控生成 |
| ICCV | Honorable Mention | Segment Anything (SAM) | 視覺基礎模型 |
| ICCV | Honorable Mention | Tracking Everything Everywhere All at Once | 影片追蹤 |
| AAAI | Outstanding Paper | Misspecification in Inverse RL | 強化學習理論 |
| IJCAI | Distinguished Paper | Levin Tree Search with Context Models | 搜尋演算法 |
| IJCAI | Distinguished Paper | SAT-Based PAC Learning of DL Concepts | 知識表徵 |

## 跟 2022 年的對比

| 維度 | 2022 | 2023 | 變化 |
|---|---|---|---|
| 最熱關鍵詞 | Diffusion Model、Scaling Laws | LLM Alignment、Hallucination | 從「怎麼 scale」轉向「怎麼控制」 |
| 新興挑戰者 | Chain-of-Thought、InstructGPT | Agent/Tool Use、Multimodal LLM | 從推理技巧到自主行動 |
| CV 主線 | Text-to-Image 商業化 | ControlNet + SAM 控制與基礎模型化 | 從「能生成」到「能控制」 |
| 3D 表徵 | NeRF 持續爆發 | 3DGS 挑戰 NeRF 地位 | 顯式 vs 隱式表徵的典範轉移開始 |
| 萎縮方向 | GAN 被 Diffusion 取代 | Task-specific NLP 被 LLM 壓縮 | 整個 NLP 子領域的重新定義 |
| NeurIPS 投稿 | 10,411 | 12,343（+18.6%） | 持續高速成長 |
| 學術圈情緒 | ChatGPT 前夜的興奮 | ChatGPT 後的焦慮與重新定位 | 「我的研究方向還有意義嗎？」 |

## 站在 2026 年回看：哪些方向回報最高？

1. **DPO / 偏好對齊方法** — 2023 年的 DPO 論文催生了整個 alignment-without-RL 的研究線，到 2025 年已有數十種變體，成為 LLM 訓練的標準步驟之一。選這個方向的研究者在 2024-2025 年的投稿和引用量都很可觀。

2. **3D Gaussian Splatting** — 從 2023 年 SIGGRAPH 一篇論文到 2025 年每場 CV 頂會上百篇相關工作，3DGS 是近年 CV 領域成長速度最快的子方向。早期進入的研究者佔據了大量先發優勢。

3. **Agent 框架與評估** — 2023 年的 ReAct、Toolformer 等開路論文在 2024-2025 年催生了龐大的 agent benchmark 和 multi-agent system 研究生態。這個方向的需求端（產業界需要可靠的 AI agent）至今仍然強勁。

4. **Mamba / SSM** — 雖然 Mamba 在 2024-2025 年並沒有取代 Transformer，但它開啟的「注意力不是唯一選擇」線索持續活躍，hybrid 架構（attention + SSM）成為 2025-2026 年的研究熱點。

5. **LLM Evaluation / Hallucination Detection** — 2023 年起爆發的 LLM 評估研究到 2026 年仍然是最容易投稿、需求最穩定的方向之一——因為每一個新模型的發布都需要新的評估。

相對地，2023 年投入「改進 BERT-based task-specific 模型」或「純 NeRF 增量改進」的研究者，在 2024-2025 年面臨了方向轉型的壓力。

## 整體來說

2023 年是 AI 研究議程被外部產品衝擊重寫的一年。ChatGPT 不只是改變了公眾對 AI 的認知——它改變了研究者的投稿方向、審稿人的期待、和會議的 track 設置。NeurIPS 2023 投稿量達到 12,343 篇（比 2022 年成長 18.6%），其中 LLM 相關論文的佔比急劇上升。

但得獎論文的分布提醒我們一件重要的事：最高水準的學術認可並沒有完全被 LLM 吸走。隱私審計、優化理論、GNN 表達能力、博弈論、計算攝影——這些不跟 LLM 直接相關的基礎工作仍然在拿頂級獎項。對研究者來說，2023 年的教訓可能是：跟隨趨勢投稿 LLM 相關論文容易獲得 reviewer 的注意力，但真正的 Outstanding Paper 仍然看的是問題的深度和解法的優雅，不看它跟不跟 ChatGPT 有關。

---

## 參考資料

- [NeurIPS 2023 Paper Awards 官方公告](https://blog.neurips.cc/2023/12/11/announcing-the-neurips-2023-paper-awards/)
- [NeurIPS 2023 Press Release（官方 PDF，含投稿/接受數字）](https://media.neurips.cc/Conferences/NeurIPS2023/NeurIPS2023-Press_Release.pdf)
- [ICML 2023 Awards 官方頁面](https://icml.cc/Conferences/2023/Awards)
- [ICLR 2023 Outstanding Paper Awards 官方公告](https://blog.iclr.cc/2023/03/21/announcing-the-iclr-2023-outstanding-paper-award-recipients/)
- [ICLR 2023 Press Release（官方 PDF）](https://iclr.cc/media/Press/ICLR_2023_Press_Release.pdf)
- [ACL 2023 Best Papers 官方頁面](https://2023.aclweb.org/program/best_papers/)
- [EMNLP 2023 Best Papers 官方頁面](https://2023.emnlp.org/program/best_papers/)
- [CVPR 2023 Awards 官方頁面](https://cvpr.thecvf.com/Conferences/2023/Awards)
- [ICCV 2023 Best Paper（Marr Prize）— IEEE TCPAMI 官方紀錄](https://tc.computer.org/tcpami/awards/iccv-paper-awards/)
- [AAAI 2023 Paper Awards 官方公告（PDF）](https://aaai-23.aaai.org/wp-content/uploads/2023/02/AAAI-23-Paper-Awards-1.pdf)
- [IJCAI 2023 Distinguished Paper Awards](https://ijcai-23.org/distinguished-paper-awards/index.html)
- [Rafailov et al. (2023) "Direct Preference Optimization: Your Language Model is Secretly a Reward Model"](https://arxiv.org/abs/2305.18290)
- [Schaeffer et al. (2023) "Are Emergent Abilities of Large Language Models a Mirage?"](https://arxiv.org/abs/2304.15004)
- [Yao et al. (2023) "ReAct: Synergizing Reasoning and Acting in Language Models"](https://arxiv.org/abs/2210.03629)
- [Kerbl et al. (2023) "3D Gaussian Splatting for Real-Time Radiance Field Rendering", ACM TOG (SIGGRAPH 2023)](https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/)
- [Gu & Dao (2023) "Mamba: Linear-Time Sequence Modeling with Selective State Spaces"](https://arxiv.org/abs/2312.00752)
- [Kirillov et al. (2023) "Segment Anything"](https://arxiv.org/abs/2304.02643)
- [Zhang et al. (2023) "Adding Conditional Control to Text-to-Image Diffusion Models (ControlNet)"](https://arxiv.org/abs/2302.05543)
- [Movva et al. (2024) "Topics, Authors, and Institutions in Large Language Model Research: Trends from 17K arXiv Papers", NAACL 2024](https://aclanthology.org/2024.naacl-long.67/)
- [Jiang et al. (2023) "Active Retrieval Augmented Generation (FLARE)", EMNLP 2023](https://aclanthology.org/2023.emnlp-main.495/)
