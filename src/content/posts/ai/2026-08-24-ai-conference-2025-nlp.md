---
title: "2025 AI 頂會導讀：自然語言處理篇"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, acl, emnlp, naacl, nlp, "2025", ai-agent, llm-evaluation]
lang: zh-TW
tldr: "2025 年 NLP 頂會的投稿量全面翻倍（ACL 8,360 篇、EMNLP 8,174 篇），中國第一作者在 ACL 佔比突破 51%，DeepSeek 的 Native Sparse Attention 拿下 ACL Best Paper——但最值得注意的是會議本身的身份危機：ACL 主席說『ACL 不是 AI 會議』，一篇量化分析問『Has ACL Lost Its Crown?』，EMNLP 被質疑跟 ACL/NAACL 還有什麼差別。"
description: "2025 年 ACL、EMNLP、NAACL 三場 NLP 頂會完整導讀：投稿量翻倍與中國研究者佔比過半的結構性變化、DeepSeek NSA 等 Best Paper 與 Outstanding Paper 清單、agentic system 與多語言研究的趨勢、ARR 審稿系統的持續陣痛，以及 NLP 會議面對 LLM 浪潮的身份定位危機。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 23
glossary:
  - term: "Native Sparse Attention (NSA)"
    definition: "DeepSeek 提出的硬體對齊稀疏注意力機制，把長文本處理速度提升約 11 倍，將上下文長度擴展到 100 萬 token。2025 年拿下 ACL Best Paper。"
    context: "ACL 2025 四篇 Best Paper 之一。"
  - term: "ACL Rolling Review (ARR)"
    definition: "ACL 系列會議的統一滾動審稿平台。論文先進入共用投稿池審稿，審完後作者再選擇 commit 到某一場具體會議。2021 年啟動，2025 年已全面運作。"
    context: "ACL 2025 全面使用 ARR 作為審稿系統。"
  - term: "Findings"
    definition: "ACL 系列會議的第二層發表管道——論文通過同行評審、品質合格，但未達主軌的接受門檻。EMNLP 2025 的 Findings 接受了 1,417 篇論文。"
    context: "EMNLP 2025 的 Findings 接受量幾乎跟主軌的 1,811 篇一樣多。"
---

> 🌏 [English version](/posts/ai/2026-08-24-ai-conference-2025-nlp-en)

2025 年的 NLP 頂會，最直觀的變化是規模：ACL 投稿量從 2024 年的 4,407 篇暴增到 8,360 篇（+90%），EMNLP 從 6,105 篇增長到 8,174 篇（+34%）。但更深層的變化是身份問題——當幾乎每篇論文都在某種程度上跟 LLM 有關，NLP 會議跟 ML 會議（NeurIPS/ICML/ICLR）的邊界還在哪裡？

這篇整理 2025 年 ACL、EMNLP、NAACL 三場 NLP 頂會的 Best Paper、主要趨勢、以及這一年圍繞 NLP 會議定位的爭論。

## ACL 2025

第 63 屆 ACL，2025 年 7 月 27 日至 8 月 1 日，維也納。投稿 8,360 篇，接受 1,699 篇，接受率 20.3%。這是 ACL 歷史上投稿量最高的一屆，與會者超過 6,000 人。全面使用 ACL Rolling Review (ARR) 作為審稿系統。

### Best Paper Awards

ACL 2025 頒發了 4 篇 Best Paper，數量比往年多（通常 1-2 篇），反映主辦方面對投稿量暴增時有意擴大表彰範圍。

- **Native Sparse Attention: Hardware-Aligned and Natively Trainable Sparse Attention**
  Jingyang Yuan, Huazuo Gao, Damai Dai 等（DeepSeek、北京大學、華盛頓大學）
  提出與硬體對齊的稀疏注意力機制 NSA，長文本處理速度提升約 11 倍，上下文長度擴展到 100 萬 token。DeepSeek 創辦人梁文鋒（Wenfeng Liang）列名共同作者，這也是 DeepSeek 首次拿下 ACL Best Paper。

- **Language Models Resist Alignment: Evidence From Data Compression**
  Jiaming Ji, Kaile Wang, Tianyi Qiu 等（北京大學 Yaodong Yang 團隊）
  從資料壓縮的角度論證語言模型「抵抗」alignment 的機制——alignment 訓練對模型行為的改變遠比表面看起來的要淺，引發對 RLHF 實際效果深度的反思。

- **A Theory of Response Sampling in LLMs: Part Descriptive and Part Prescriptive**
  Sarath Sivaprasad, Pramod Kaushik, Sahar Abdelnabi, Mario Fritz（CISPA Helmholtz Center）
  為 LLM 回應採樣提出理論框架，同時描述現有行為並提供規範性建議。

- **Fairness through Difference Awareness: Measuring Desired Group Discrimination in LLMs**
  Angelina Wang, Michelle Phan, Daniel E. Ho, Sanmi Koyejo（Stanford、Cornell Tech）
  挑戰「公平=一視同仁」的假設，論證某些情境下 LLM 需要感知群體差異才能真正公平。

### Best Social Impact Papers

- **AfriMed-QA: A Pan-African, Multi-Specialty, Medical Question-Answering Benchmark Dataset**
  Charles Nimo, Tobi Olatunji 等 21 位共同作者
  覆蓋泛非洲地區、多專科的醫療問答基準，填補非洲醫療 NLP 資源空白。

- **The AI Gap: How Socioeconomic Status Affects Language Technology Interactions**
  Elisa Bassignana, Amanda Cercas Curry, Dirk Hovy
  量化社經地位如何影響使用者與語言技術的互動品質。

### Best Resource Papers

- **BRIGHTER: BRIdging the Gap in Human-Annotated Textual Emotion Recognition Datasets for 28 Languages**
  Shamsuddeen Hassan Muhammad, Nedjma Ousidhoum 等 40+ 位共同作者
  28 語言的人工標註情緒辨識資料集，是多語言情感分析領域迄今最大規模的跨語言資源。

- **Are Rules Meant to be Broken? Understanding Multilingual Moral Reasoning as a Computational Pipeline with UniMoral**
  Shivani Kumar, David Jurgens
  跨文化道德推理的計算框架。

- **Palm: A Culturally Inclusive and Linguistically Diverse Dataset for Arabic LLMs**
  Fakhraddin Alwajih 等 42+ 位共同作者
  文化包容性阿拉伯語 LLM 資料集。

### Best Theme Papers

- **MaCP: Minimal yet Mighty Adaptation via Hierarchical Cosine Projection**
  Yixian Shen 等
  用層級餘弦投影實現極小參數量的模型適應。

- **Meta-rater: A Multi-dimensional Data Selection Method for Pre-training Language Models**
  Xinlin Zhuang 等
  多維度資料篩選方法，用於優化預訓練資料品質。

- **SubLIME: Subset Selection via Rank Correlation Prediction for Data-Efficient LLM Evaluation**
  Gayathri Saranathan 等
  用子集選取大幅降低 LLM 評估成本。

### Outstanding Papers（26 篇，節選代表性方向）

ACL 2025 的 26 篇 Outstanding Papers 覆蓋了五個清晰的趨勢方向：

**多語言與低資源語言**——這是數量最多的一個方向：
- *Typology-Guided Adaptation for African NLP*（Ndapa Nakashole）——用語言類型學指導非洲語言 NLP 模型適應
- *PARME: Parallel Corpora for Low-Resourced Middle Eastern Languages*
- *IndicSynth: A Large-Scale Multilingual Synthetic Speech Dataset for Low-Resource Indian Languages*
- *Bridging the Language Gaps in Large Language Models with Inference-Time Cross-Lingual Intervention*

**評估與基準創新**：
- *Capability Salience Vector: Fine-grained Alignment of Loss and Capabilities for Downstream Task Scaling Law*
- *MiniLongBench: The Low-cost Long Context Understanding Benchmark for Large Language Models*
- *Mapping 1,000+ Language Models via the Log-Likelihood Vector*

**模型效率與可擴展性**：
- *Byte Latent Transformer: Patches Scale Better Than Tokens*（Artidoro Pagnoni 等，Meta）——Byte-level 模型架構，patch 比 token 更有效率
- *Pre³: Enabling Deterministic Pushdown Automata for Faster Structured LLM Generation*
- *Turning Trash into Treasure: Accelerating Inference of Large Language Models with Token Recycling*

**穩健性與安全**：
- *HALoGEN: Fantastic LLM Hallucinations and Where to Find Them*（Abhilasha Ravichander 等）
- *All That Glitters is Not Novel: Plagiarism in AI-Generated Research*——直指 AI 生成論文的學術倫理問題
- *LLMs Know Their Vulnerabilities: Uncover Safety Gaps through Natural Distribution Shifts*

**語言學與語境理解**：
- *A New Formulation of Zipf's Meaning-Frequency Law through Contextual Diversity*（Ryo Nagata, Kumiko Tanaka-Ishii）
- *Toward Automatic Discovery of a Canine Phonetic Alphabet*——用計算方法嘗試建構犬類語音字母表，是 ACL 少見的跨物種語言研究

### Test-of-Time Award

**Automatic Labeling of Semantic Roles**（Daniel Gildea, Daniel Jurafsky，2000 年發表）拿下 25 年 Test-of-Time Award，這篇論文奠定了 semantic role labeling 整個子領域。

### TACL Best Paper

首屆 TACL Paper Awards：Best Paper 頒給 *Reading Subtext: Evaluating Large Language Models on Short Story Summarization with Writers*（Melanie Subbiah, Sean Zhang, Lydia B. Chilton, Kathleen McKeown），Test-of-Time 頒給 *Weakly Supervised Learning of Semantic Parsers for Mapping Instructions to Actions*（Yoav Artzi, Luke Zettlemoyer，2013 年）。

## NAACL 2025

2025 年 4 月 29 日至 5 月 4 日，新墨西哥州阿布奎基。

### Best Paper Awards

- **The BiGGen Bench: A Principled Benchmark for Fine-grained Evaluation of Language Models with Language Models**
  Seungone Kim, Juyoung Suk, Ji Yong Cho, Shayne Longpre 等 24+ 位共同作者
  用語言模型評估語言模型的原則性基準框架——反映 2025 年 LLM-as-judge 已成為評估主流。

- **Runner-Up: REL-A.I.: An Interaction-Centered Approach To Measuring Human-LM Reliance**
  Kaitlyn Zhou, Jena D. Hwang, Xiang Ren, Nouha Dziri, Dan Jurafsky, Maarten Sap
  從互動角度測量人類對 LLM 的依賴程度。

### Best Theme Paper

- **WorldCuisines: A Massive-Scale Benchmark for Multilingual and Multicultural Visual Question Answering on Global Cuisines**
  Genta Indra Winata 等 42+ 位共同作者
  全球美食的多語言多文化視覺問答基準。

- **Runner-Up: Developing multilingual speech synthesis system for Ojibwe, Mi'kmaq, and Maliseet**
  Shenran Wang 等
  為北美原住民語言開發多語言語音合成系統。

### Best Social Impact Award

- **FLEURS-ASL: Including American Sign Language in Massively Multilingual Multitask Evaluation**
  Garrett Tanzer（單一作者）
  將美國手語納入大規模多語言多任務評估框架。

### Outstanding Papers（10 篇，節選）

- *PeerQA: A Scientific Question Answering Dataset from Peer Reviews*（Tim Baumgärtner, Ted Briscoe, Iryna Gurevych）——從同行評審中建構科學問答資料集
- *IrokoBench: A New Benchmark for African Languages in the Age of Large Language Models*（David Ifeoluwa Adelani 等）
- *DrawEduMath: Evaluating Vision Language Models with Expert-Annotated Students' Hand-Drawn Math Images*
- *Multi3Hate: Multimodal, Multilingual, and Multicultural Hate Speech Detection with Vision–Language Models*

### SAC Awards（節選）

- *Decoding Speculative Decoding*（Generation 方向）——把 speculative decoding 的理論基礎說清楚
- *In-Context Learning with Long-Context Models: An In-Depth Exploration*（Language Modeling 方向，Amanda Bertsch 等，CMU/Google）
- *Meta-Cultural Competence: Climbing the Right Hill of Cultural Awareness*（Special Theme 方向）

## EMNLP 2025

第 30 屆 EMNLP，2025 年 11 月 5–9 日，蘇州。投稿 8,174 篇（另一來源統計為 8,172 篇，差異極小），接受 1,811 篇（主軌），接受率 22.2%。Findings 接受 1,417 篇（17.3%），主軌 + Findings 合計 3,228 篇，總接受率 39.5%。本屆吸引超過 6,000 名與會者，是 EMNLP 歷史上規模最大的一屆。

特殊主題（Special Theme）：**Interdisciplinary Recontextualization of NLP**。

### Best Paper Award

- **Infini-gram mini: Exact n-gram Search at the Internet Scale with FM-Index**
  Hao Xu, Jiacheng Liu, Yejin Choi, Noah A. Smith, Hannaneh Hajishirzi（華盛頓大學、AI2）
  用 FM-Index 實現網際網路規模的精確 n-gram 搜索，提供了一個跟 LLM 完全互補的工具——用精確匹配而非機率生成來查找文本片段。Hajishirzi 同時也是本屆 keynote speaker。

### Outstanding Papers（7 篇）

- **Measuring Chain of Thought Faithfulness by Unlearning Reasoning Steps**
  Martin Tutek, Fateme Hashemi Chaleshtori, Ana Marasovic, Yonatan Belinkov
  用「遺忘推理步驟」的方式測量 chain-of-thought 的忠實度——直擊 CoT 是否真的反映模型內部推理的核心問題。

- **Mind the Value-Action Gap: Do LLMs Act in Alignment with Their Values?**
  Hua Shen, Nicholas Clark, Tanu Mitra
  LLM 是否言行一致？發現 LLM 表達的價值觀和實際行為之間存在系統性落差。

- **LingGym: How Far Are LLMs from Thinking Like Field Linguists?**
  Changbing Yang, Franklin Ma, Freda Shi, Jian Zhu
  評估 LLM 的田野語言學能力，建構了一個讓模型像語言學家一樣分析未知語言的基準。

- **Generative or Discriminative? Revisiting Text Classification in the Era of Transformers**
  Siva Rajesh Kasa 等
  在 Transformer 時代重新審視生成式 vs 判別式的經典之爭。

- **DiscoSG: Towards Discourse-Level Text Scene Graph Parsing through Iterative Graph Refinement**
  Shaoqing Lin 等
  篇章級文本場景圖解析。

- **MiCRo: Mixture Modeling and Context-aware Routing for Personalized Preference Learning**
  Jingyan Shen 等
  混合建模與情境感知路由實現個人化偏好學習。

- **Causal Interventions Reveal Shared Structure Across English Filler-Gap Constructions**
  Sasha Boguraev, Christopher Potts, Kyle Mahowald
  用因果介入方法揭示英語填充語-間隙結構的共享結構。

### Best Special Theme Paper

- **InterIDEAS: Philosophical Intertextuality via LLMs**
  Yue Yang 等
  用 LLM 探索哲學文本間的互文性。

### Best Resource Paper

- **Autoformalization in the Wild: Assessing LLMs on Real-World Mathematical Definitions**
  Lan Zhang, Marco Valentino, Andre Freitas（University of Manchester）
  評估 LLM 在真實世界數學定義上的自動形式化能力。

### People's Choice Award

- **Randomly Removing 50% of Dimensions in Text Embeddings has Minimal Impact on Retrieval and Classification Tasks**
  Sotaro Takeshita 等
  隨機移除文字嵌入 50% 的維度對檢索和分類任務幾乎沒有影響——一個簡單到讓人不安的發現。

### Keynote Speakers

- **Heng Ji**（UIUC）—— "No more Processing. Time to Discover."：AI 從語言「處理」走向科學「發現」，介紹模組化化學-語言模型 mCLM。
- **Hannaneh Hajishirzi**（UW/AI2）—— "Open-Science AI"：開源模型（OLMo、Tulu）如何追上封閉商業模型。
- **Jana Diesner**（TU Munich）—— NLP 透過計算社會科學的鏡頭：社會科學知識如何反過來改善 NLP 實踐。

## 2025 年 NLP 整體觀察

### 規模爆炸：投稿量翻倍的影響

2025 年最不可忽視的結構性變化是投稿量：ACL 從 4,407 → 8,360（+90%），EMNLP 從 6,105 → 8,174（+34%），NAACL 也有顯著增長。投稿量翻倍帶來的直接後果是審稿人池被進一步稀釋——同行評審品質的焦慮已經從私下抱怨變成公開議題（2025 年 ICML 上就有一篇 position paper 直接以「同行評審危機」為題）。

### 中國研究者佔比突破 50%

ACL 2025 所有第一作者中，來自中國的佔 51.3%，比 2024 年的 30.6% 幾乎翻倍。DeepSeek 的 NSA 論文拿下 Best Paper、北京大學的 alignment 論文同獲 Best Paper，都是這一趨勢的標誌性事件。

### 身份危機：NLP 會議還是 LLM 會議？

2025 年浮上檯面的根本問題是：**NLP 會議跟 ML 會議（NeurIPS/ICML/ICLR）的邊界在哪裡？**

幾個觸發點：
- ACL 前主席 Emily M. Bender 在 2024 年的 ACL 上公開宣稱「ACL 不是 AI 會議」，引發大量討論
- 一篇量化分析論文 "Has ACL Lost Its Crown?" 用十年數據（2014–2024）檢驗 ACL 是否被 NeurIPS/ICLR 超越——結論是 ACL 在中位引用數（32.00，NLP 會議最高）、milestone 論文密度、零引用率（0.89%，最低）等指標上仍然領先，但所有會議的 Quality-Quantity Elasticity（QQE，投稿增長與引用影響的彈性係數）都在持續下降，代表會議擴張帶來的學術影響力增長已不成正比
- NLPer Eduard Hovy 在 ACL 2025 現場批評當前研究是「LLM popcorn」——只在表面做觀察、收集蝴蝶標本，不解決根本問題
- EMNLP 2025 同樣面對「跟 ACL 或 NAACL 還有什麼實質差別」的身份問題

### Agentic Systems 湧入 NLP 會議

EMNLP 2025 最顯著的主題轉向之一是 **agentic systems** 成為一級主題：

- 多智能體協作框架——結構化通訊如何實現集體智慧
- 工具使用可靠性——"Tool Preferences in Agentic LLMs are Unreliable"（LLM agent 在功能描述相似的工具之間選擇不可靠）
- 終身 LLM agent——能自主反思、工具增強、持續適應的系統
- LLM 作為社會與經濟行為者——LLM 的選擇與偏見在真實世界部署中的影響

這個趨勢的意義是：agent 研究不再只是 ML 會議的領地。NLP 社群正在用自己擅長的工具（語言分析、互動設計、評估方法論）切入 agent 問題。

### 多語言與文化包容性：從願景到基礎建設

三場會議不約而同地把「多語言」從 nice-to-have 升級為一等公民：

- ACL：26 篇 Outstanding Papers 中多語言/低資源方向佔比最高；三篇 Best Resource Paper 中兩篇是大規模多語言資料集（28 語言情緒辨識、42+ 作者的阿拉伯語資料集）
- NAACL：Best Theme Paper 是全球美食的多語言多文化視覺 QA；Outstanding Paper 裡有非洲語言基準、中東語言平行語料
- EMNLP：特殊主題就是「Interdisciplinary Recontextualization of NLP」，聚焦跨學科應用

### 評估方法論持續演化

2025 年的 NLP 會議裡，「怎麼評估」本身成為一個比「怎麼做」更活躍的研究領域：

- LLM-as-judge 已成主流：NAACL Best Paper 就是 LLM 評估 LLM 的基準框架
- CoT 忠實度測量：EMNLP Outstanding Paper 用遺忘推理步驟的方式檢驗 CoT 是否真實
- 幻覺偵測：ACL 的 HALoGEN 提供系統化的 LLM 幻覺分類
- 低成本評估：ACL 的 SubLIME 用子集選取降低評估開銷

## 跟 2024 年相比

| 面向 | 2024 | 2025 |
|---|---|---|
| ACL 投稿量 | 4,407 | 8,360（+90%） |
| EMNLP 投稿量 | 6,105 | 8,174（+34%） |
| 中國第一作者佔比（ACL） | 30.6% | 51.3% |
| Agent 研究 | 零星出現 | 成為 EMNLP 一級主題 |
| 多語言/低資源 | 活躍 | 爆發（多篇 Best Resource） |
| 身份危機討論 | 暗流 | 公開化 |

## 2026 回看：哪些 2025 論文可能影響最深遠

1. **Native Sparse Attention (NSA)**——如果 DeepSeek 後續模型大規模採用，這篇論文就是長上下文處理效率的技術起點
2. **Language Models Resist Alignment**——對 RLHF 深度的質疑如果被進一步驗證，可能動搖整個 alignment 訓練範式
3. **Infini-gram mini**——精確 n-gram 搜索作為 LLM 的互補工具，有潛力改變 RAG 和事實查證的技術路線
4. **Measuring CoT Faithfulness**——如果 CoT 被證實大量不忠實，整個 reasoning 評估方法論都需要重新設計
5. **Has ACL Lost Its Crown?（分析論文）**——QQE 下降的發現可能推動會議制度改革

---

## 參考資料

- [ACL 2025 Awards 官方頁面](https://2025.aclweb.org/program/awards/)
- [EMNLP 2025 Awards 官方頁面](https://2025.emnlp.org/program/awards/)
- [NAACL 2025 Best Papers 公告](https://2025.naacl.org/blog/best-papers/)
- [EMNLP 2025 Keynotes 官方頁面](https://2025.emnlp.org/program/keynotes/)
- [TACL 2025 Paper Awards 公告](https://transacl.org/index.php/tacl/announcement/view/117)
- [ACL 2025 Test-of-Time Paper Award 公告](https://www.aclweb.org/portal/content/announcement-2025-acl-test-time-paper-award)
- [36kr — DeepSeek's Liang Wenfeng & Peking University Win ACL 2025 Best Paper](https://eu.36kr.com/en/p/3401632759482502)
- [CSPaper — Record Breaking ACL 2025 Crowns Four Game-Changing Papers](https://cspaper.org/post/309)
- [Top 5 Trends in Outstanding Papers from ACL 2025（Substack 分析）](https://msukhareva.substack.com/p/top-five-trends-in-acl-2025-outstanding)
- [ACL 2025 Recap: Trends, Tensions, and Shifting Powers in NLP（Substack 分析）](https://msukhareva.substack.com/p/acl-2025-recap-trends-tensions-and)
- [Has ACL Lost Its Crown? A Decade-Long Quantitative Analysis（arXiv:2512.04448）](https://arxiv.org/abs/2512.04448)
- [Megagon Labs — EMNLP 2025 Highlights and Research Directions](https://megagon.ai/emnlp2025-highlights/)
- [EMNLP 2025 官方 Findings 前言（ACL Anthology）](https://aclanthology.org/2025.findings-emnlp.0.pdf)
- [Paper Digest — ACL 2025 Papers & Highlights](https://www.paperdigest.org/2025/07/acl-2025-papers-highlights/)
- [Paper Digest — EMNLP 2025 Papers & Highlights](https://www.paperdigest.org/2025/11/emnlp-2025-papers-highlights/)
- [ACL Acceptance Rate and Submission Statistics（CS Conf Stats）](https://csconfstats.xoveexu.com/conferences/acl/)
- [EMNLP Acceptance Rate and Submission Statistics（OpenAccept）](https://openaccept.org/c/ai/emnlp/)
- [GitHub — Top Conference Best Papers（2022-2026 彙整）](https://github.com/FeijiangHan/Top-Conference-Best-Papers)
