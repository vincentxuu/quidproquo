---
title: "2024 AI 頂會導讀：自然語言處理篇"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, acl, emnlp, naacl, nlp, "2024", llm-evaluation, rag]
lang: zh-TW
tldr: "2024 年的 NLP 頂會在 LLM 全面統治下重新定義自己：ACL 把開放科學列為年度主題、七篇 Best Paper 有四篇在問語言模型的根本能力邊界；EMNLP 則把焦點轉向多語言與跨文化，Best Paper 從語音表徵做到梯度可解釋性。投稿量持續爆炸（ACL+EMNLP 合計破萬），但社群真正焦慮的不是數量，而是當 LLM 能做幾乎所有 NLP 任務時，NLP 研究本身還剩什麼。"
description: "回顧 2024 年 ACL、EMNLP、NAACL 三場自然語言處理頂級會議的得獎論文、高影響力研究與年度趨勢。涵蓋 ACL 的開放科學主題與語言模型能力邊界探索、EMNLP 的多語言與可解釋性突破、NAACL 的視覺接地與低資源語言研究，以及 RAG 工程化、LLM-as-Judge 評估方法論轉變、合成資料品質爭議等跨會議趨勢。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 19
glossary:
  - term: "ARR"
    definition: "ACL Rolling Review，ACL 系列會議共用的滾動審稿制度。論文先進入統一審稿池，審完後作者再決定要 commit 到哪一場具體會議。"
    context: "2024 年 ARR 已全面運作，但接受率的兩種算法問題依然存在。"
  - term: "LLM-as-Judge"
    definition: "用大型語言模型取代人工評估來判斷生成品質的方法。2024 年成為 NLP 主流評估手段，但其可靠性本身也成為研究焦點。"
    context: "多篇 EMNLP 2024 論文探討 LLM-as-Judge 的偏見與局限。"
---

> 🌏 [English version](/posts/ai/2026-08-24-ai-conference-2024-nlp-en)

2024 年的 NLP 頂會面對一個前所未有的身份問題：當大型語言模型能處理幾乎所有傳統 NLP 任務，NLP 作為一個獨立研究領域還剩下什麼？三場會議各自給出了不同的回應——ACL 把開放科學立為年度主題，EMNLP 深挖多語言與可解釋性，NAACL 則在視覺接地和低資源語言上找到新空間。

## ACL 2024：語言模型能力邊界的七個問號

ACL 2024 於 8 月在曼谷舉辦，投稿 4,407 篇（主軌），接受 940 篇，接受率 21.3%。另有 975 篇進入 Findings。年度特別主題是「Open science, open data, and open models for reproducible NLP research」，收到 55 篇主題投稿，22 篇進入主軌、16 篇進 Findings。

### Best Paper Awards（7 篇）

ACL 2024 一口氣頒了七個 Best Paper——這個數字本身就值得注意，因為 ACL 的慣例是 1-3 篇。七篇裡有四篇都在某種程度上質問語言模型的根本能力邊界：

**Mission: Impossible Language Models** — Julie Kallini, Isabel Papadimitriou, Richard Futrell, Kyle Mahowald, Christopher Potts（Stanford, UC Irvine）。這篇設計了一系列「不可能語言」——人類語言不會出現但在計算上完全合法的語法規則——測試語言模型是否真的學到了人類語言的共性，還是只是在做表面的模式匹配。結論是令人不安的：模型能學會這些不可能語言，幾乎跟學真實語言一樣好，暗示它們可能並未真正學到語言學家認為存在的語言共性。

**Why are Sensitive Functions Hard for Transformers?** — Michael Hahn, Mark Rofin（Saarland University）。從理論角度分析為什麼 Transformer 在處理某些「敏感函數」（對輸入微小變化高度敏感的函數）時表現差，提供了 Transformer 表達能力局限的數學證明。

**Natural Language Satisfiability: Exploring the Problem Distribution and Evaluating Transformer-based Language Models** — Tharindu Madusanka, Ian Pratt-Hartmann, Riza Batista-Navarro（Manchester）。把形式邏輯中的可滿足性問題（SAT）搬到自然語言場景，系統測試語言模型在邏輯推理上的真實能力。

**Semisupervised Neural Proto-Language Reconstruction** — Liang Lu, Peirong Xie, David R. Mortensen（CMU）。把深度學習用在歷史語言學核心問題——原始語言重建——上，用半監督方法讓模型從現存語言反推祖語形式。NLP 技術反哺語言學基礎研究的典型案例。

**Deciphering Oracle Bone Language with Diffusion Models** — Haisu Guan 等人（華中科技大學, University of Adelaide, 安陽師範學院, 華南理工大學）。用 diffusion model 來破譯甲骨文——把古文字辨識從傳統 OCR 框架轉移到生成式模型框架。第一作者是華中科技大學的本科生，這本身就是一個值得注意的訊號。

**Causal Estimation of Memorisation Profiles** — Pietro Lesci, Clara Meister, Thomas Hofmann, Andreas Vlachos, Tiago Pimentel（ETH Zürich, Cambridge）。用因果推斷方法量化語言模型對訓練資料的記憶程度，為數據汙染和隱私風險提供了更嚴格的測量工具。

**Aya Model: An Instruction Finetuned Open-Access Multilingual Language Model** — Ahmet Üstün 等人（Cohere For AI）。涵蓋 101 種語言的開源指令微調模型，在多語言覆蓋範圍上是 2024 年最有野心的開源嘗試之一。

### Best Theme Paper

**OLMo: Accelerating the Science of Language Models** — Groeneveld 等人（Allen Institute for AI）。完全開源的語言模型（程式碼、資料、訓練細節、評估框架全部公開），直接回應年度主題。OLMo 的意義不只是又一個開源模型，而是它把「可重現性」從口號變成了具體的工程實踐——連訓練日誌和中間 checkpoint 都公開了。

### Best Resource Papers

- **Dolma: an Open Corpus of Three Trillion Tokens for Language Model Pretraining Research** — Soldaini 等人（AI2）。三兆 token 的開源預訓練語料庫，是 OLMo 的配套資料集。
- **AppWorld: A Controllable World of Apps and People for Benchmarking Interactive Coding Agents** — Trivedi 等人。為互動式 coding agent 設計的可控環境，允許在模擬的 app 生態裡測試 agent 的多步驟操作能力。
- **Latxa: An Open Language Model and Evaluation Suite for Basque** — Etxaniz 等人。為巴斯克語建立的完整語言模型與評估套件，低資源語言的開源建設典範。

### Best Social Impact Papers

- **How Johnny Can Persuade LLMs to Jailbreak Them** — Zeng 等人。系統研究說服技巧對 LLM 安全機制的攻擊效果，發現「人性化」的修辭策略比技術性的 prompt injection 更有效。
- **DIALECTBENCH** — Faisal 等人。為方言和近緣語言建立的 NLP benchmark，填補了標準化評估長期忽略的語言變體。
- **Having Beer after Prayer? Measuring Cultural Bias in Large Language Models** — Naous 等人。系統測量 LLM 中的文化偏見，特別是對非西方文化場景的預設假設。

## EMNLP 2024：多語言、可解釋性與資料偵測

EMNLP 2024 於 11 月在邁阿密舉辦，投稿 6,105 篇，接受 1,271 篇至主軌（20.8%），另有 1,029 篇進入 Findings（16.9%）。主軌加 Findings 合計超過 2,300 篇，規模空前。

### Best Paper Awards（5 篇）

**An image speaks a thousand words, but can everyone listen? On image transcreation for cultural relevance** — Simran Khanuja, Sathyanarayanan Ramamoorthy, Yueqi Song, Graham Neubig（CMU）。探索圖像的跨文化「再創作」——不是翻譯文字，而是把圖像本身轉換成對不同文化有意義的版本。這個研究方向在 multimodal AI 的大潮下格外重要：當 AI 系統在全球部署，視覺內容的文化預設比語言翻譯更隱蔽、更難察覺。

**Towards Robust Speech Representation Learning for Thousands of Languages** — William Chen 等人（CMU）。為數千種語言建立穩健的語音表徵學習方法。NLP 會議收語音論文看似跨界，但反映了「語言技術」（language technology）正在從純文字擴展到多模態的趨勢。

**Backward Lens: Projecting Language Model Gradients into the Vocabulary Space** — Shahar Katz, Yonatan Belinkov, Mor Geva, Lior Wolf（Technion, Tel Aviv University）。把語言模型梯度投射回詞彙空間來做可解釋性分析——不是看模型「注意了什麼」（attention），而是看「什麼在驅動模型的參數更新」。提供了一個新的可解釋性透鏡，比 attention visualization 更接近模型學習的本質。

**Pretraining Data Detection for Large Language Models: A Divergence-based Calibration Method** — Weichao Zhang 等人（中國科學院, University of Amsterdam）。用散度校準方法偵測 LLM 的預訓練資料——直接回應了 benchmark contamination 這個越來越嚴重的問題。如果你不知道一個模型見過哪些資料，你就無法信任它在 benchmark 上的分數。

**CoGen: Learning from Feedback with Coupled Comprehension and Generation** — Mustafa Omer Gul, Yoav Artzi（Cornell）。把理解和生成耦合起來從回饋中學習，讓模型能同時改善「聽懂指令」和「執行指令」兩個方向。

### Best Resource Paper

**KidLM: Advancing Language Models for Children** — Mir Tafseer Nayeem, Davood Rafiei（University of Alberta）。為兒童場景設計的語言模型與評估框架，在 AI 安全和教育應用的交叉點上開闢了一個被忽略的方向。

### 值得注意的 Outstanding Papers

EMNLP 2024 頒了 20 篇 Outstanding Papers（約佔主軌接受數的 1.6%），跨越多個主題。其中幾篇反映了年度趨勢：

- **Fishing for Magikarp: Automatically Detecting Under-trained Tokens in Large Language Models** — Sander Land, Max Bartolo。自動偵測 LLM 中訓練不足的 token——那些因為訓練語料分布不均而行為異常的「glitch token」。
- **Humans or LLMs as the Judge? A Study on Judgement Bias** — 探討 LLM-as-Judge 評估方法的偏見，發現 LLM 評審和人類評審一樣容易受到不同類型的干擾影響。

## NAACL 2024：視覺接地與低資源語言

NAACL 2024 於 6 月在墨西哥城舉辦，接受約 565 篇論文至主軌。

### Best Paper Award

**Visual Grounding Helps Learn Word Meanings in Low-Data Regimes** — Chengxu Zhuang, Evelina Fedorenko, Jacob Andreas（MIT）。這篇的核心問題是：視覺接地（visual grounding）能不能幫助語言模型在極少量資料下學會詞彙語義？答案是肯定的——而且效果在低資料量場景下特別顯著，暗示人類兒童透過多模態經驗學習語言的機制可能也是因為「資料效率」，而不是因為多模態本身就比純文字好。這篇把認知科學的假說轉化成了可測試的計算實驗。

### Outstanding Paper Award

**Evaluating the Deductive Competence of Large Language Models** — S M Seals, Valerie Shalin。系統測試 LLM 的演繹推理能力——不是一般的「推理」benchmark，而是嚴格的形式邏輯演繹。結論不樂觀：即使是最好的模型也會在需要多步演繹的問題上犯結構性錯誤。

### Theme Track Award

**Grammar-based Data Augmentation for Low-Resource Languages: The Case of Guarani-Spanish Neural Machine Translation** — Agustín Lucas 等人。用語法規則驅動的資料增強來改善低資源語言的機器翻譯，以瓜拉尼語-西班牙語為案例。低資源語言的 NLP 在拉丁美洲學術社群特別受關注，NAACL 在墨西哥城舉辦讓這個主題得到了更多能見度。

### Social Impact Award

**Understanding the Capabilities and Limitations of Large Language Models for Cultural Commonsense** — Siqi Shen 等人（A*STAR, UMich, 新加坡管理大學）。測試 LLM 對不同文化常識的理解能力，發現模型在非西方文化情境下表現顯著下降——跟 ACL 的 Having Beer after Prayer 論文呼應，構成了 2024 年「文化偏見」研究的兩篇標竿。

## 跨會議趨勢：2024 NLP 的四條主線

### 1. 「NLP 還是 NLP 嗎？」的身份危機

2024 年的 ACL 和 EMNLP 有一個微妙但持續的暗流：當 LLM 能處理幾乎所有傳統 NLP 任務（分類、摘要、翻譯、問答、命名實體辨識……），NLP 研究者到底在研究什麼？

ACL 的七篇 Best Paper 提供了一個回答方向：回歸語言學本身。Mission: Impossible Language Models 在問語言模型是否真的理解語言結構，Semisupervised Neural Proto-Language Reconstruction 在用 NLP 工具反哺語言學基礎研究，Deciphering Oracle Bone Language 在把 NLP 推向非標準語言數據。這些論文共同暗示：NLP 的未來不是「用 LLM 做更多任務」，而是「用更嚴格的標準去理解語言模型到底學到了什麼、沒學到什麼」。

### 2. 開放科學與可重現性

ACL 2024 把開放科學立為年度主題不是象徵性的——OLMo 和 Dolma 同時得獎說明社群認真對待了這個議題。Aya Model 涵蓋 101 語言的完全開源，跟商業模型的封閉路線形成了鮮明對比。

但現實的張力依然存在：同一年，OpenAI 和 Anthropic 這些最有資源的組織幾乎不在 ACL/EMNLP 發論文（詳見[系列篇 B3](/posts/ai/2026-08-24-ai-conference-who-submits)），頂尖工業模型的技術細節越來越少進入同行評審的管道。開放科學的推力和商業保密的拉力，正在 NLP 社群裡製造一個日益擴大的資訊不對稱。

### 3. RAG 從概念到工程化

RAG（Retrieval-Augmented Generation）在 2024 年的 NLP 會議裡完成了從「新概念」到「工程化」的轉變。EMNLP 2024 的 Searching for Best Practices in Retrieval-Augmented Generation 系統比較了不同 RAG 策略的效能與效率平衡，Retrieval Augmented Generation or Long-Context LLMs 則提出了 Self-Route 方法，讓系統自動決定「用 RAG 還是直接用長上下文」——這些都是把 RAG 當成工程問題在解，而不是當成研究假說在驗證。

ACL 2024 的 FlashRAG 提供了模組化的 RAG 研究工具箱，降低了研究門檻。但同時，RAG 系統的評估方法論（怎麼測量 RAG 系統到底有沒有變好）依然是未解的問題——NAACL 的 ARES 框架在嘗試解決這個問題，但距離共識還很遠。

### 4. LLM-as-Judge：評估方法論的典範轉移

用 LLM 來評估 LLM 生成品質（LLM-as-Judge）在 2024 年從實驗性做法變成了主流評估手段。這帶來了效率提升——不需要大量人工標註——但也帶來了新的方法論問題。

EMNLP 2024 的 Humans or LLMs as the Judge? 發現 LLM 評審和人類評審都各有偏見，而且偏見的方向不同：LLM 傾向偏好更長的、格式更工整的回答，人類則更重視實質內容。這意味著用 LLM 評審取代人類評審，不只是效率的改變，而是評估標準本身的位移——兩種評審在獎勵不同類型的系統行為。

ACL 2024 的 Outstanding Paper 中也有多篇探討評估方法論的可靠性，反映了社群對「我們到底在測量什麼」這個後設問題的焦慮。

## 多語言與跨文化：2024 年的顯學

2024 年三場 NLP 會議最明顯的共同主題是多語言與跨文化研究的升溫。ACL 的 Aya Model（101 語言）、Latxa（巴斯克語）、DIALECTBENCH（方言），EMNLP 的跨文化圖像再創作和千語語音表徵，NAACL 的瓜拉尼語翻譯和文化常識測試——從 Best Paper 到 Resource Paper 到 Social Impact Paper，多語言議題無處不在。

這不只是「更多語言」的量變。2024 年的論文在問更深層的問題：不同文化的常識知識如何影響模型行為？視覺內容的文化預設怎麼處理？方言和標準語的關係在 NLP 系統裡怎麼建模？這些問題的共同指向是：語言技術的全球部署不能只靠翻譯——需要對不同語言和文化場景做根本性的重新設計。

## 整體來看

2024 年的 NLP 頂會在 LLM 的陰影下完成了一次有意義的自我定位。ACL 選擇回歸語言學根基和開放科學，用「語言模型到底理解了什麼」這個問題重新劃定 NLP 的邊界；EMNLP 把焦點放在多語言和可解釋性上，在 LLM 做不好的地方找到了研究空間；NAACL 則在認知科學交叉口（視覺接地、多模態學習）和低資源語言上保持了自己的特色。

投稿量的數字說明了這個領域有多熱：ACL + EMNLP 主軌投稿合計超過 10,500 篇，比 2021 年的 6,950 篇增長了 51%。但更值得關注的是質的變化——2024 年得獎論文裡，純粹的「用 LLM 刷 benchmark」式工作幾乎消失了，取而代之的是更根本性的能力分析、更嚴格的評估方法論、和更廣泛的語言文化覆蓋。NLP 社群正在學會在 LLM 時代重新定義自己的價值。

---

## 參考資料

- [ACL 2024 Best Paper Awards（官方頁面）](https://2024.aclweb.org/program/best_papers/)
- [EMNLP 2024 Best Papers（官方頁面）](https://2024.emnlp.org/program/best_papers/)
- [EMNLP 2024 Conference Overview（含接受率統計）](https://2024.emnlp.org/program/)
- [ACL Anthology — ACL 2024 官方論文集前言（Message from the Program Chairs，寫明 940 篇獲接受）](https://aclanthology.org/2024.acl-short.0.pdf)
- [ACL Admin Wiki — 2024Q3 General Chair Report（獨立佐證 940 篇）](https://www.aclweb.org/adminwiki/index.php/2024Q3_Reports:_General_Chair)
- [ACL 2024 Acceptance Rate — CS Conf Stats](https://csconfstats.xoveexu.com/conferences/acl/2024/)
- [EMNLP 2024 Acceptance Rates — OpenAccept](https://openaccept.org/c/ai/emnlp/2024/)
- [NAACL 2024 Conference（官方網站）](https://2024.naacl.org/)
- [Top-Conference-Best-Papers（GitHub 彙整）](https://github.com/FeijiangHan/Top-Conference-Best-Papers)
- [Searching for Best Practices in Retrieval-Augmented Generation — ACL Anthology](https://aclanthology.org/2024.emnlp-main.981/)
- [Humans or LLMs as the Judge? A Study on Judgement Bias — ACL Anthology](https://aclanthology.org/2024.emnlp-main.474/)
- [University of Alberta — Best Paper Award at EMNLP 2024](https://www.ualberta.ca/en/computing-science/news-and-events/news/2024/november/best-paper-award-at-emnlp-2024.html)
- [CMU LTI — Dual Best Paper Awards at EMNLP](https://www.lti.cs.cmu.edu/news-and-events/news/2024-11-21-emnlp-best-papers.html)
- [ACL 2022 Chair Blog Post — Rolling Review（ARR 機制說明）](https://2022.aclweb.org/post/acl-2022-chair-blog-post-rolling-review)
