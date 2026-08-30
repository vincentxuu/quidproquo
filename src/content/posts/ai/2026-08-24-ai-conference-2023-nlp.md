---
title: "2023 AI 頂會導讀：自然語言處理篇"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, acl, emnlp, nlp, "2023", hallucination, evaluation, in-context-learning]
lang: zh-TW
tldr: "2023 年是 ChatGPT 之後的第一個完整學術年——NLP 頂會的議程被 LLM 全面重寫：ACL 的 Best Paper 研究幽默理解和政治偏見追蹤，EMNLP 的 Best Paper 用資訊流視角解釋 in-context learning，而 HackAPrompt 這篇 prompt injection 競賽論文直接拿下 EMNLP Best Paper，標誌著安全研究正式進入主流。整年最大的主題轉變是：研究者不再問「怎麼讓模型更準」，開始問「怎麼知道模型在不在騙你」。"
description: "2023 年 ACL、EMNLP、EACL 三場 NLP 頂會的 Best Paper、Outstanding Paper、高影響力論文總整理。涵蓋 in-context learning 的機制解釋、prompt injection 安全、LLM 評估危機、hallucination 研究爆發、FActScore 事實查核框架，以及 ChatGPT 如何在一年內徹底改變 NLP 的研究議程。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 15
glossary:
  - term: "in-context learning"
    definition: "不更新模型參數，只在 prompt 裡給幾個範例，讓大型語言模型學會執行新任務。GPT-3 展示了這種能力，但其運作機制在 2023 年仍是開放問題。"
    context: "EMNLP 2023 Best Paper 用資訊流分析解釋 in-context learning 的內部機制。"
  - term: "prompt injection"
    definition: "透過精心設計的輸入文字，誘導大型語言模型忽略原始指令、執行攻擊者指定的行為。HackAPrompt 是第一個大規模 prompt injection 競賽。"
    context: "EMNLP 2023 Best Paper 之一，標誌安全研究進入 NLP 主流。"
  - term: "FActScore"
    definition: "Fine-grained Atomic evaluation of Factual precision in long-form text generation——把長文拆成原子級事實陳述，逐一查核是否有來源支持。由 Sewon Min 等人在 EMNLP 2023 提出。"
    context: "成為後續 LLM 事實查核研究的標準框架。"
---

> 🌏 [English version](/posts/ai/2026-08-24-ai-conference-2023-nlp-en)

2023 年是 ChatGPT 之後的第一個完整學術年。NLP 頂會的投稿量繼續攀升，但比投稿數字更深刻的變化是：整個領域的研究議程被 LLM 重寫了。「怎麼讓模型在 benchmark 上多幾個百分點」不再是核心關注，取而代之的是三個更根本的問題——模型為什麼能做到這些事（in-context learning 的機制）、模型在什麼時候會騙你（hallucination 與事實查核）、以及模型能不能被攻破（prompt injection 與安全）。

這篇整理 2023 年 ACL、EMNLP、EACL 三場 NLP 頂會的 Best Paper、高影響力論文、以及這一年的研究趨勢。

## ACL 2023

ACL 2023 於 7 月在多倫多舉辦，投稿 4,864 篇、接受 1,074 篇、接受率 22.1%。這一屆實施了新的獎項政策，大幅擴大 Outstanding Paper 的選取範圍至投稿總量的 1.5–2.5%，共選出 39 篇 Outstanding Paper——比往年多出數倍。

### Best Paper Awards（3 篇）

**Do Androids Laugh at Electric Sheep? Humor "Understanding" Benchmarks from The New Yorker Caption Contest**
Jack Hessel, Ana Marasovic, Jena D. Hwang, Lillian Lee, Jeff Da, Rowan Zellers, Robert Mankoff, Yejin Choi（AI2 / Cornell / New Yorker）

用《紐約客》漫畫配文比賽建構幽默理解基準測試。重點不在於模型能不能「搞笑」，而是測試模型對需要常識推理、世界知識和文化脈絡才能理解的幽默，究竟理解到什麼程度。結論是：即便是當時最強的 LLM 在需要深層推理的幽默任務上仍與人類有顯著差距。

**What the DAAM: Interpreting Stable Diffusion Using Cross Attention**
Raphael Tang, Linqing Liu, Akshat Pandey, Zhiying Jiang, Gefei Yang, Karun Kumar, Pontus Stenetorp, Jimmy Lin, Ferhan Ture（Waterloo / UCL / Comcast）

提出 DAAM（Diffusion Attentive Attribution Maps），利用 cross-attention 機制來可視化 Stable Diffusion 在生成圖像時，每個文字 token 實際影響了畫面的哪些區域。這篇出現在 NLP 會議上的文生圖論文，本身就是 2023 年跨模態研究模糊領域邊界的縮影。

**From Pretraining Data to Language Models to Downstream Tasks: Tracking the Trails of Political Biases Leading to Unfair NLP Models**
Shangbin Feng, Chan Young Park, Yuhan Liu, Yulia Tsvetkov（CMU / UW）

從預訓練資料到模型再到下游任務，端到端地追蹤政治偏見如何在整個 NLP pipeline 中傳播和放大。不只是指出「模型有偏見」，而是首次系統性地定位偏見在哪個環節被引入、在哪個環節被放大。

### Special Awards（4 篇）

| 獎項 | 論文 | 作者 |
|---|---|---|
| Reproduction Award | Do CoNLL-2003 Named Entity Taggers Still Work Well in 2023? | Shuheng Liu, Alan Ritter（Georgia Tech） |
| Resource Award | When Does Translation Require Context? A Data-driven, Multilingual Exploration | Patrick Fernandes 等（CMU / IST） |
| Social Impact Award | Marked Personas: Using Natural Language Prompts to Measure Stereotypes in Language Models | Myra Cheng, Esin Durmus, Dan Jurafsky（Stanford） |
| Theme Paper Award | Weaker Than You Think: A Critical Look at Weakly Supervised Learning | Dawei Zhu 等（Saarland） |

Reproduction Award 的那篇值得單獨一提：作者重新跑了 CoNLL-2003 上的經典 NER 系統，發現在 2023 年的文本上表現大幅下降——這不是模型退化了，而是語言本身在 20 年間變了。這種「benchmark 的保鮮期有多長」的問題，在 LLM 時代只會越來越尖銳。

### Notable Outstanding Papers（部分）

ACL 2023 的 39 篇 Outstanding Paper 涵蓋面非常廣，以下挑出幾篇具代表性的：

- **Minding Language Models' (Lack of) Theory of Mind: A Plug-and-Play Multi-Character Belief Tracker**（Melanie Sclar 等，UW / AI2）——用 SymbolicToM 框架測試 LLM 的心智理論能力，結論是模型在多角色信念追蹤上仍然很弱。
- **Symbolic Chain-of-Thought Distillation: Small Models Can Also "Think" Step-by-Step**（Liunian Harold Li 等，UCLA / AI2）——不需要讓小模型生成自然語言推理鏈，直接用符號化的推理步驟蒸餾，效果更好。
- **SCOTT: Self-Consistent Chain-of-Thought Distillation**（Peifeng Wang 等，USC / AI2）——另一種 CoT 蒸餾方法，用對比解碼從大模型抽取推理鏈，再用反事實推理目標確保蒸餾後的小模型保持一致性。
- **World-to-Words: Grounded Open Vocabulary Acquisition through Fast Mapping in Vision-Language Models**（Ziqiao Ma 等，Michigan）——模擬人類兒童的「快速映射」學習機制，讓視覺語言模型從少量範例學會新概念。
- **Towards Understanding Chain-of-Thought Prompting: An Empirical Study of What Matters**（Boshi Wang 等）——實驗發現 CoT 提示中真正重要的不是推理步驟的正確性，而是推理結構的存在本身——即便給錯誤的推理步驟，只要格式對了，模型表現也不太掉。這個發現對理解 LLM 的「推理」本質有重大啟示。

### ACL 2023 Peer Review Report

ACL 2023 的 Program Chairs（Anna Rogers、Jordan Boyd-Graber、Naoaki Okazaki）發布了一份罕見的透明度報告，揭示了幾個值得注意的數據：

- 長論文的主軌接受率（23.5%）顯著高於短論文（16.5%）
- 預印本論文在 Soundness、Excitement 和審稿人信心分數上都統計顯著地更高，且更常被推薦為 award paper——雙盲審是否真的「盲」，這個數據給出了令人不安的答案
- 三位審稿人之間的一致性（Krippendorff's alpha）約為 0.3，跟近年 EACL 和 EMNLP 相當——低，但這個數字在各大會議間出奇地穩定

## EMNLP 2023

EMNLP 2023 於 12 月在新加坡舉辦，投稿 4,909 篇、接受 1,047 篇、接受率 21.3%。時間點耐人尋味——距 ChatGPT 發佈剛好一年。

### Best Paper Awards（5 篇）

**Label Words are Anchors: An Information Flow Perspective for Understanding In-Context Learning**
Lean Wang, Lei Li, Damai Dai, Deli Chen, Hao Zhou, Fandong Meng, Jie Zhou, Xu Sun（PKU / ByteDance / WeChat AI）

這篇是 2023 年 NLP 最重要的機制分析論文之一。作者從資訊流的角度分析 Transformer 內部在做 in-context learning 時到底發生了什麼事，發現 label words（範例中的答案詞）扮演了「錨點」的角色——模型先把語義資訊聚合到這些 label token 上，再從這些錨點擷取資訊來做預測。這個發現不只是理論上的洞見，還直接導出了一種實用的改進方法。

**Ignore This Title and HackAPrompt: Exposing Systemic Vulnerabilities of LLMs Through a Global Prompt Hacking Competition**
Sander Schulhoff, Jeremy Pinto, Anaum Khan, Louis-François Bouchard, Chenglei Si 等（Maryland / UBC 等）

組織了一場全球 prompt injection 競賽（HackAPrompt），收集了超過 60 萬次攻擊嘗試，系統性地分類和分析了 LLM 的 prompt injection 弱點。這篇拿 Best Paper 有指標性意義——prompt injection 安全研究正式從邊緣話題進入 NLP 主流。論文標題本身就是一個 prompt injection 的範例。

**Faster Minimum Bayes Risk Decoding with Confidence-based Pruning**
Julius Cheng, Andreas Vlachos（Cambridge）

MBR（Minimum Bayes Risk）解碼理論上比 beam search 更好，但計算成本高到實務上用不起來。這篇用基於信心的剪枝策略大幅降低 MBR 的計算量，讓它在機器翻譯等任務上變得實用。不是 LLM 相關的論文，但代表了 EMNLP 依然看重紮實的技術突破。

**PaperMage: A Unified Toolkit for Processing, Representing, and Manipulating Visually-Rich Scientific Documents**
Kyle Lo, Zejiang Shen 等（AI2）

處理科學文獻的統一工具包——整合了 PDF 解析、版面分析、圖表提取、引用解析等功能。2023 年論文數量爆炸式成長，自動化處理科學文獻的需求前所未有地迫切，這篇剛好踩在這個需求上。

**Personalized Dense Retrieval on Global Index for Voice-enabled Conversational Systems**
Masha Belyi, Charlotte Dzialo 等（Amazon）

針對語音對話系統的個人化密集檢索——在全局索引上做個人化排序，不需要為每個使用者建立獨立的索引。來自工業界的紮實工程貢獻。

### Notable Outstanding Papers（部分）

EMNLP 2023 有 21 篇 Outstanding Paper，以下挑出幾篇：

- **LINC: A Neurosymbolic Approach for Logical Reasoning by Combining Language Models with First-Order Logic Provers**（Theo Olausson 等，MIT / Harvard）——把 LLM 的自然語言理解能力和一階邏輯證明器的精確推理能力結合，在需要嚴格邏輯推理的任務上大幅提升表現。
- **Toward a Critical Toponymy Framework for Named Entity Recognition: A Case Study of Airbnb in New York City**（Mikael Brunila 等）——獲 Outstanding Paper Award for Computational Social Sciences and Cultural Analytics。把批判地名學的視角引入 NER，分析 Airbnb 房源命名中的文化與階級訊號。
- **FActScore: Fine-grained Atomic Evaluation of Factual Precision in Long-form Text Generation**（Sewon Min 等，UW / AI2）——提出把長文本拆成原子事實陳述、逐一查核的評估框架。雖然不是得獎論文，但 FActScore 成為後續幾乎所有 LLM 事實性研究的標準引用，影響力可能是這一屆最大的單篇論文。

### 高影響力非得獎論文

EMNLP 2023 的 Findings track 和主軌中還有幾篇後來引用量極高的論文：

- **Active Retrieval Augmented Generation**——提出 FLARE，讓模型在生成過程中動態決定何時需要檢索、檢索什麼，而非一次性檢索。RAG 從「一次檢索」走向「動態檢索」的關鍵論文。
- **Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection**——訓練模型自己判斷是否需要檢索、檢索結果是否相關、生成結果是否忠於檢索內容。把 RAG 的每個決策點都變成模型自己可以反思的環節。

## EACL 2023

EACL 2023 於 5 月在杜布羅夫尼克舉辦，規模比 ACL/EMNLP 小，但有幾篇得獎論文值得注意：

- **COMPS: Conceptual Minimal Pair Sentences for Testing Robust Property Knowledge and its Inheritance in Pre-trained Language Models**（Kanishka Misra 等）——用最小對立句測試預訓練語言模型是否真的理解概念屬性及其繼承關係。
- **WINODICT: Probing Language Models for In-context Word Acquisition**（Julian Eisenschlos 等，Google）——測試語言模型能不能在 context 中學會一個全新的詞彙，直接探測 in-context learning 的邊界。
- **LoRaLay: A Multilingual and Multimodal Dataset for Long Range and Layout-Aware Summarization**（Laura Nguyen 等）——跨語言、跨版面的長文件摘要資料集。

## 2023 NLP 整體觀察

### LLM 全面接管研究議程

2023 年最顯著的變化不是某篇具體論文，而是整個領域的研究議程被 LLM 重新定義。ACL 2023 的投稿中，超過 60% 的高引用論文都與 LLM 直接相關。傳統 NLP 子任務（POS tagging、dependency parsing、NER 等）作為獨立研究方向的存在感持續下降——不是因為問題解決了，而是因為它們被重新框架為「LLM 在這些任務上表現如何」的評估維度。

### Evaluation 危機

ChatGPT 引發的最深層問題之一是：**我們用來評估模型的 benchmark 本身可信嗎？** 2023 年出現了大量關於 benchmark contamination（模型在訓練時就看過測試集）、evaluation methodology（現有指標是否還能區分模型差異）的論文。ACL 2023 的 Reproduction Award（CoNLL-2003 NER 20 年後重測）和 EMNLP 2023 的 FActScore 都是對這場危機的回應。

### Hallucination 從 bug 變成 research program

2022 年 hallucination 還主要被當成一個「要修的 bug」；2023 年它變成了一個完整的研究計畫。FActScore 提供了標準化的事實查核框架，HaluEval 建構了包含合成和自然生成的幻覺資料集，FELM 聚焦在多領域的幻覺偵測——這些工具讓 hallucination 研究從「定性觀察」轉向「定量測量」。

### Prompt Injection 安全研究的合法化

HackAPrompt 拿下 EMNLP Best Paper 是一個分水嶺事件。在此之前，prompt injection 研究主要活躍在安全社群和技術部落格；在此之後，它成為 NLP 頂會的正式研究主題。這篇論文收集了超過 60 萬次攻擊嘗試的規模，也為後續研究提供了無法靠理論推導取得的實證基礎。

### RAG 從技巧變成研究方向

2022 年 RAG 主要是工程實務中的技巧；2023 年它成為有系統研究的學術方向。FLARE（動態檢索）、Self-RAG（自我反思式檢索）等論文把 RAG 的每個環節都拆開來研究和改進，而不是當成一個整體的黑盒來用。

### 跟 2022 年的對比

| 維度 | 2022 | 2023 |
|---|---|---|
| 主軸 | InstructGPT/RLHF 的出現、ChatGPT 前夜 | ChatGPT 後的全面議程重寫 |
| 研究焦點 | 怎麼讓 LLM 更好 | 怎麼理解、評估、約束 LLM |
| CoT/Prompting | 新發現（Chain-of-Thought, Self-Consistency） | 機制解釋（為什麼 CoT 有效）+ 蒸餾（小模型也能 CoT） |
| Hallucination | 被當成 bug | 成為系統性研究計畫（FActScore, HaluEval） |
| 安全 | 邊緣話題 | HackAPrompt 拿 Best Paper，正式進入主流 |
| RAG | 工程技巧 | 學術研究方向（FLARE, Self-RAG） |
| ARR | 第一年全面部署，痛點浮現 | 逐漸穩定，但爭議未消 |
| ACL 投稿 | 3,378 | 4,864（+44%） |
| EMNLP 投稿 | 4,190 | 4,909（+17%） |

### 後見之明：2023 年最具長期影響力的論文

站在 2026 年回頭看，2023 NLP 頂會中影響最深遠的五篇論文：

1. **FActScore**（EMNLP 2023）——成為後續所有 LLM 事實性研究的標準框架，被引用超過 600 次
2. **Label Words are Anchors**（EMNLP 2023 Best Paper）——in-context learning 機制研究的里程碑
3. **HackAPrompt**（EMNLP 2023 Best Paper）——開啟了 prompt injection 的系統性研究
4. **Self-RAG**（EMNLP 2023）——影響了後續幾乎所有 adaptive RAG 的設計
5. **SCOTT / Symbolic CoT Distillation**（ACL 2023）——CoT 蒸餾方法讓小模型的推理能力有了實用的提升路徑

---

## 參考資料

- [ACL 2023 Best Papers（官方頁面）](https://2023.aclweb.org/program/best_papers/)
- [EMNLP 2023 Best Papers（官方頁面）](https://2023.emnlp.org/program/best_papers/)
- [EACL 2023 Best Paper Awards（官方頁面）](https://2023.eacl.org/program/best-paper/)
- [ACL 2023 Peer Review Report（Program Chairs 報告）](https://2023.aclweb.org/blog/review-report/)
- [Program Chairs' Report on Peer Review at ACL 2023（ACL Anthology PDF）](https://aclanthology.org/2023.acl-long.report.pdf)
- [ACL 2023 Acceptance Recommendations（官方 Blog）](https://2023.aclweb.org/blog/overall-recommendation/)
- [EMNLP 2023 官方論文集前言（ACL Anthology）](https://aclanthology.org/2023.emnlp-main.0.pdf)
- [GitHub — Top-Conference-Best-Papers（2022-2026 各會議得獎論文彙整）](https://github.com/FeijiangHan/Top-Conference-Best-Papers)
- [FActScore: Fine-grained Atomic Evaluation of Factual Precision（ACL Anthology）](https://aclanthology.org/2023.emnlp-main.741/)
- [World-to-Words: Grounded Open Vocabulary Acquisition（ACL Anthology）](https://aclanthology.org/2023.acl-long.31/)
- [SCOTT: Self-Consistent Chain-of-Thought Distillation（ACL Anthology）](https://aclanthology.org/2023.acl-long.304/)
- [Minding Language Models' (Lack of) Theory of Mind（ACL Anthology）](https://aclanthology.org/2023.acl-long.780/)
- [ACL 2023 Paper Picks（Megagon Labs）](https://megagonlabs.medium.com/acl-2023-paper-picks-1658115925ff)
