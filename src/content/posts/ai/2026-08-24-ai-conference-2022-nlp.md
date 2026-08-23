---
title: "2022 AI 頂會導讀：自然語言處理篇"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, acl, emnlp, naacl, nlp, "2022", chain-of-thought, instruction-tuning, rlhf]
lang: zh-TW
tldr: "2022 年是 NLP 從「模型能力展示」走向「模型對齊與控制」的轉折年——InstructGPT 把 RLHF 推上主流、Chain-of-Thought 證明推理能力可以靠提示詞解鎖、Flan 2022 讓 instruction tuning 的方法論成熟化。ACL 與 NAACL 同年全面啟用 ARR 滾動審稿，暴露了大量基礎設施與審稿人負載問題。年底 ChatGPT 上線，NLP 研究的遊戲規則從此改寫。"
description: "2022 年 ACL、EMNLP、NAACL 三場 NLP 頂會的 Best Paper、最具影響力論文、研究趨勢總整理：InstructGPT/RLHF 的學術影響、Chain-of-Thought 推理、instruction tuning 方法論的成熟、ARR 滾動審稿全面上線的痛點，以及 ChatGPT 對 NLP 學術圈的衝擊。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 11
glossary:
  - term: "chain-of-thought prompting"
    definition: "讓大型語言模型在給出最終答案前，先產生一連串中間推理步驟的提示技巧。2022 年由 Google 的 Jason Wei 等人在 NeurIPS 發表，證明這種方法能大幅提升大模型在數學和常識推理任務上的表現。"
    context: "2022 年 NLP 領域最具影響力的方法論創新之一。"
  - term: "RLHF"
    definition: "Reinforcement Learning from Human Feedback，用人類偏好資料訓練獎勵模型，再用 PPO 等強化學習算法微調語言模型。InstructGPT 是第一個大規模驗證這套流程的系統，後來成為 ChatGPT 的技術基礎。"
    context: "InstructGPT（NeurIPS 2022）讓 RLHF 從學術概念變成產品級技術。"
  - term: "instruction tuning"
    definition: "在大量不同 NLP 任務上用「指令+輸入→輸出」格式微調語言模型，讓模型學會從指令描述中理解新任務。FLAN（2021）、T0（2021）奠定方向，Flan 2022 把方法論（混合 zero-shot/few-shot/CoT 訓練）系統化。"
    context: "2022 年是 instruction tuning 方法論走向成熟的關鍵年。"
---

2022 年的 NLP 有兩個不同的世界：年底之前和年底之後。12 月之前，學術圈還在做傳統的 benchmark 推分和方法論改進；12 月 ChatGPT 上線之後，幾乎所有人都在重新思考「NLP 研究到底還能做什麼」。但回頭看，ChatGPT 的技術基礎——RLHF、instruction tuning、chain-of-thought——全部在 2022 年的頂會論文裡就位了。

這篇整理 2022 年 ACL、EMNLP、NAACL 三場 NLP 頂會的 Best Paper、最具影響力的論文、以及這一年的研究趨勢。

## ACL 2022

ACL 2022 是第 60 屆年會，5 月 22–27 日在都柏林舉辦（混合模式，約 50% 與會者現場出席——這是自 2019 年以來第一次回到實體場地）。投稿 3,378 篇，接受 701 篇（604 篇長論文、98 篇短論文），接受率 20.8%。Findings 額外接受 332 篇。

這是 ACL 歷史上**第一次全面採用 ARR（ACL Rolling Review）作為唯一投稿管道**。作者先向 ARR 提交論文、接受審稿，再選擇 commit 到 ACL 2022。這個轉變帶來的陣痛在後面「ARR 全面上線」一節詳述。

### Best Paper Awards

**Best Paper**

- **Learned Incremental Representations for Parsing**
  Nikita Kitaev, Thomas Lu, Dan Klein（UC Berkeley / Microsoft Semantic Machines）
  設計了一套「最大程度無推測」的增量式句法分析表示法（incremental representation），讓 parser 能在讀入每個詞的時候就即時做出結構判斷，而不需要先看到整個句子。出發點是認知科學啟發的：人類理解語言就是即時、增量式的。

**Best Special Theme Paper**

- **Requirements and Motivations of Low-Resource Speech Synthesis for Language Revitalization**
  Aidan Pine, Dan Wells, Nathan Brinklow, Patrick William Littell, Korin Richmond
  調查了瀕危語言社群對語音合成技術的真實需求——不是用標準 NLP 指標衡量，而是走進社群做質性訪談。結論是技術開發者常假設的「更多資料就好」並不符合這些社群的實際限制與目標。

**Best Resource Paper**

- **DiBiMT: A Novel Benchmark for Measuring Word Sense Disambiguation Biases in Machine Translation**
  Niccolò Campolungo, Federico Martelli, Francesco Saina, Roberto Navigli（Sapienza University of Rome）
  建立了第一個專門測量機器翻譯中「詞義消歧偏差」的 benchmark——當一個多義詞在上下文中的正確意思不是最常見的那個時，翻譯系統有多大機率選錯。

**Best Linguistic Insight Paper**

- **KinyaBERT: a Morphology-aware Kinyarwanda Language Model**
  Antoine Nzeyimana, Andre Niyongabo Rubungo
  為盧安達語（Kinyarwanda）設計了一個形態學感知的語言模型。盧安達語有極為豐富的形態變化，直接用 BPE 子詞拆分會丟失大量語言結構資訊。KinyaBERT 在 tokenization 層面就融入形態學知識，在下游任務上顯著優於直接套用 multilingual BERT。

### Outstanding Papers

ACL 2022 另外頒發了 7 篇 Outstanding Papers，涵蓋的方向比 Best Paper 更廣：

- **Fantastically Ordered Prompts and Where to Find Them: Overcoming Few-Shot Prompt Order Sensitivity**（Yao Lu 等，UCL）——揭示 few-shot prompting 的一個基本脆弱性：示範例子（exemplars）的排列順序可以讓同一個模型的表現從接近隨機到接近 state-of-the-art。提出了自動選擇最佳排列的方法。
- **Evaluating Factuality in Text Simplification**（Ashwin Devaraj 等，UT Austin / Northeastern）——指出文本簡化模型在簡化過程中會引入事實錯誤，這個問題被主流評估指標完全忽略。
- **Inducing Positive Perspectives with Text Reframing**（Caleb Ziems 等，Georgia Tech / NUS）——讓模型把負面描述重新框架為正面觀點，同時保持事實準確，探索了語言生成的正向應用。
- **Ditch the Gold Standard: Re-evaluating Conversational Question Answering**（Huihan Li, Tianyu Gao 等，Princeton）——質疑對話式問答 benchmark 的「金標準」答案本身是否可靠，發現人類標註者之間的不一致比模型與金標準之間的差距還大。
- **Compression of Generative Pre-trained Language Models via Quantization**（Chaofan Tao 等）——在 GPT-2 等生成式模型上做量化壓縮，為後來大模型推理效率的研究鋪路。

### 2022 年在 ACL 發表但不限於得獎的高影響力論文

ACL 2022 的 Findings 收了 332 篇論文，其中一些後來的影響力超越了不少主軌論文。但 2022 年 NLP 領域最具影響力的論文大多發表在 NeurIPS 或以 arXiv 預印本形式流通（見後面「年度整體觀察」），ACL 主軌本身的得獎論文偏向語言學、資源、低資源語言等傳統 NLP 方向——這不是品質問題，而是反映了一個結構性落差：大模型相關的突破性工作當時更傾向投 NeurIPS/ICML，而非 ACL。

## NAACL 2022

NAACL 2022 於 7 月 10–15 日在西雅圖舉辦（混合模式）。同樣全面採用 ARR，投稿 2,103 篇（ARR 12 月和 1 月兩輪），其中 1,073 篇 commit 到 NAACL，接受 442 篇（358 篇長論文、84 篇短論文）。用 ARR 總投稿數算，接受率 21.0%；用 commit 數算，接受率 41.2%。Findings 額外接受 209 篇。

### Best Paper Awards

NAACL 2022 的得獎論文比 ACL 2022 更明顯地觸及了 2022 年的核心趨勢——效率、更新、受限生成：

**Best New Task Paper（並列）**

- **Automatic Correction of Human Translations**
  Jessy Lin, Geza Kovacs, Aditya Shastry, Joern Wuebker, John DeNero
  一個看起來反直覺的任務：用機器來「修正」人類翻譯。但這不是要取代人類譯者，而是找出人類翻譯中的細微錯誤（漏譯、術語不一致），在實際翻譯工作流中有巨大實用價值。同時獲得 Honorable Mention for Human-Centered NLP。

- **FRUIT: Faithfully Reflecting Updated Information in Text**
  Robert L. Logan IV, Alexandre Passos, Sameer Singh, Ming-Wei Chang（UC Irvine / Google）
  當事實改變時（例如一個國家的人口數字更新了），模型要怎麼修改已有的文本來反映新事實，同時保持其餘部分不變？定義了這個任務並提供了 benchmark。

**Best Efficient NLP Paper**

- **FNet: Mixing Tokens with Fourier Transforms**
  James Lee-Thorp, Joshua Ainslie, Ilya Eckstein, Santiago Ontanon（Google Research）
  用簡單的傅立葉變換取代 Transformer 的自注意力機制，速度大幅提升，性能損失卻很小。概念上極簡潔，後續啟發了一系列探索替代注意力機制的工作。

**Best New Method Paper**

- **NeuroLogic A*esque Decoding: Constrained Text Generation with Lookahead Heuristics**
  Ximing Lu, Sean Welleck, Peter West 等（UW / AI2, Yejin Choi 團隊）
  把 A* 搜尋算法的前瞻式啟發引入文本生成的 decoding 階段，讓模型在生成時就能考慮未來的約束條件（例如「文本必須包含某些關鍵字」或「不能出現某些詞」），而不是等生成完了才事後修改。

**Best Paper on Human-Centered NLP Special Theme**

- **User-Driven Research of Medical Note Generation Software**
  Tom Knoll, Francesco Moramarco 等
  用使用者導向的研究方法評估醫療筆記自動生成軟體——不是看 ROUGE 分數，而是實際讓醫護人員使用後收集回饋。

### Outstanding Papers

- **NewsEdits: A Dataset of News Article Revision Histories and a Novel Document-Level Reasoning Challenge**（Alexander Spangher 等，USC / Nanyun Peng 團隊）——Honorable Mention for Resources。建立了新聞文章修訂歷史的資料集，可以用來研究「文章怎麼隨時間演變」這個新穎的文件級推理任務。
- **Balanced Data Approach for Evaluating Cross-Lingual Transfer**（Dan Malkin 等）——Honorable Mention for Methods。

## EMNLP 2022

EMNLP 2022 於 12 月 7–11 日在阿布扎比舉辦（混合模式）。投稿 4,190 篇，接受 829 篇，接受率 19.8%——是這三場 2022 年 NLP 頂會裡接受率最低的。Findings 額外接受 549 篇，是主軌的 66%。三場主題演講分別由 Gary Marcus、Neil Cohn 和 Mona Diab（Meta Responsible AI）擔綱。

EMNLP 2022 的時間點特殊：會議在 12 月 7–11 日舉行，而 ChatGPT 在 11 月 30 日上線。很多與會者是在準備去阿布扎比的路上第一次試用 ChatGPT 的——這場會議成了 NLP 學術圈在「ChatGPT 衝擊」前最後一次照常開會的場合。

### Best Paper Awards

**Best Long Paper**

- **Abstract Visual Reasoning with Tangram Shapes**
  Anya Ji, Noriyuki Kojima, Noah Rush, Alane Suhr, Wai Keen Vong（NYU）, Robert Hawkins（Princeton）, Yoav Artzi（Cornell）
  引入 KiloGram 資料集，用七巧板（tangram）作為刺激材料研究人類和機器的抽象視覺推理能力。跟 EMNLP 2021 的 Best Paper（MaRVL）一樣，選的是視覺-語言交叉的研究方向。Pre-trained 多模態模型的抽象推理能力很差，但 fine-tuning 後顯著改善——尤其是當視覺和語言輸入聯合編碼時。這個結論對後來理解多模態模型的 generalization 有啟示。

**Best Short Paper**

- **Topic-Regularized Authorship Representation Learning**
  Jitkapat Sawatphol, Nonthakit Chaiwong, Can Udomcharoenchaikit, Sarana Nutanong（VISTEC, Thailand）
  處理作者歸屬辨識（authorship attribution）中的一個實際痛點：當訓練資料和測試資料的主題不同時，模型容易記住主題特徵而非作者風格。提出的 Authorship Representation Regularization（ARR，跟 ACL Rolling Review 的 ARR 撞名了）用蒸餾框架讓模型學到不依賴特定主題的作者表示。

### 不在 EMNLP 得獎名單但影響深遠的 2022 NLP 論文

2022 年最重要的 NLP 相關論文，大多不是在 ACL/EMNLP/NAACL 發表的。這是一個值得正視的結構性現象：

**發表在 NeurIPS 2022 的關鍵 NLP 論文：**

- **Training Language Models to Follow Instructions with Human Feedback（InstructGPT）**（Long Ouyang 等，OpenAI）——用 RLHF 對齊 GPT-3 與使用者意圖，1.3B 參數的 InstructGPT 在人類評估中打敗 175B 的 GPT-3。這篇論文的核心發現——人類偏好微調可以讓小模型優於大模型、公開 NLP benchmark 不反映真實使用方式——直接成為 ChatGPT 的技術基礎。
- **Chain-of-Thought Prompting Elicits Reasoning in Large Language Models**（Jason Wei 等，Google Brain）——NeurIPS 2022 年度最高引論文之一。證明讓大模型在回答前先寫出中間推理步驟，可以大幅提升數學和常識推理表現。關鍵發現：CoT 是一種 emergent ability，只在 ~100B 參數以上的模型上生效。後續衍生了 Self-Consistency、Tree-of-Thought 等一整個推理技術家族。
- **Self-Consistency Improves Chain-of-Thought Reasoning in Language Models**（Xuezhi Wang 等，Google Brain）——Chain-of-Thought 的重要延伸：對同一個問題取樣多條推理路徑，用多數決選答案，顯著提升了 CoT 的可靠性。

**以 arXiv 預印本形式發表、後來影響巨大的論文：**

- **Scaling Instruction-Finetuned Language Models（Flan 2022 / Flan-PaLM / Flan-T5）**（Hyung Won Chung 等，Google）——把 instruction tuning 的方法論系統化：混合 zero-shot、few-shot、chain-of-thought 三種訓練模板，比只用一種設定的模型在所有推理場景都更好。Flan-T5 成為開源社群最廣泛使用的 instruction-tuned 基底模型之一。
- **Training Compute-Optimal Large Language Models（Chinchilla）**（Jordan Hoffmann 等，DeepMind）——推翻了「模型越大越好」的 scaling 直覺，證明在固定計算預算下，把一半資源用來增加訓練資料比用來增加模型參數更有效。這篇的 scaling law 修正了整個領域對「最佳模型大小」的計算方式。
- **PaLM: Scaling Language Modeling with Pathways**（Aakanksha Chowdhery 等，Google）——540B 參數的大模型，首次在大量推理 benchmark 上展示了 few-shot performance 超越 supervised state-of-the-art 的結果。Chain-of-Thought 論文的很多實驗就是在 PaLM 上跑的。

## ARR 全面上線：2022 年的陣痛

2022 年是 ARR 第一次同時作為 ACL 和 NAACL 的唯一投稿管道，也暴露了從試行到全面運行之間的落差：

**基礎設施問題**：ARR 運行在 OpenReview 上，但 OpenReview 原本是為 NeurIPS、ICLR 這種「單一 deadline、單一審稿人池」的會議設計的。ARR 每月一輪 deadline、審稿人池跨月延續、需要追蹤再投稿歷史——這些需求 OpenReview 都不原生支持。技術團隊必須在 ARR 運行的同時「邊開飛機邊造引擎」，包括 COI 偵測、reviewer assignment 自動化、催稿提醒等基本功能。

**審稿人負載**：為了應對只有約 75% 的審稿意見能在一個月週期內準時交回的現實，ARR 把每篇論文的審稿人從 3 人增加到 4 人——這進一步加重了審稿人社群的負擔。ARR 官方報告指出，很多有資格審稿的資深研究者（至少 5 篇相關領域論文、最新一篇不超過 5 年）完全沒有參與任何審稿。

**接受率計算的混亂**：因為 ARR 把審稿和接受決定解耦，出現了兩種接受率算法：用 ARR 總投稿數算（分母大、接受率低），或用 commit 到某場會議的論文數算（分母小、接受率高）。NAACL 2022 的兩種算法算出來分別是 21.0% 和 41.2%——幾乎差一倍。ACL 2022 的 General Chair 在手冊中也特別指出了這個問題。

**社群反彈**：2022 年 5-6 月 ACL reviewing committee 做了一次社群調查，收到大量回饋。主要抱怨包括：審稿品質不穩定（同一篇論文 64 個不同 action editor 的 meta-review 難以互相比較）、無法自由選擇新一批審稿人（rolling review 的本意是復用審稿意見，但很多作者恰恰希望「換一批審稿人重來」）、以及整體流程的不透明感。

後來的改進包括：引入「軟 track」讓作者標記論文方向、允許再投稿時預設接受「換新審稿人/新 AE」的請求、以及開始實作 reviewer evaluation 機制。

## 2022 年 NLP 整體觀察

### 從 prompting 到 alignment：研究主軸的轉移

2021 年 NLP 的核心問題是「怎麼更有效率地用大模型」（parameter-efficient fine-tuning、prompt tuning）。2022 年的問題變成了「怎麼讓大模型做正確的事」——InstructGPT 的 RLHF、Chain-of-Thought 的推理引導、Flan 的 instruction tuning 方法論，都在回答同一個底層問題：模型的原始能力很強，但怎麼把這些能力引導到使用者真正需要的方向？

### 大模型研究 vs ACL 系列會議的落差

2022 年 NLP 最具影響力的論文幾乎全部發表在 NeurIPS 或以 arXiv 預印本流通，ACL/EMNLP/NAACL 的 Best Paper 則集中在語言學分析、低資源語言、benchmark 設計、形態學等傳統 NLP 方向。這不代表傳統 NLP 不重要，但確實反映了一個結構性問題：大模型研究團隊（Google Brain、OpenAI、DeepMind）更傾向把核心工作投到 NeurIPS/ICML，而 ACL 系列會議在大模型時代還在尋找自己的定位。

### ChatGPT 的衝擊

ChatGPT 在 2022 年 11 月 30 日上線，技術上建立在 InstructGPT 的 RLHF 流程之上，但其影響力遠超技術本身。對 NLP 學術圈的直接衝擊至少包括：

- **研究方向的重新洗牌**：很多傳統 NLP 任務（情感分析、NER、文本分類）在 ChatGPT 面前的表現已經「夠好了」，繼續在這些 benchmark 上推分的邊際價值大幅下降。
- **評估方法的危機**：當模型的輸出品質好到難以用自動指標區分時，人類評估變得更重要但也更昂貴。
- **發表策略的改變**：InstructGPT 以預印本形式在 2022 年 3 月出現，11 月在 NeurIPS 正式發表，12 月 ChatGPT 就上線了。這個時間線讓很多研究者意識到，傳統的「投稿→審稿→發表→影響」管道太慢了——影響已經發生在論文被接受之前。

### 投稿量的增長

三場會議的主軌投稿量：ACL 3,378 篇、NAACL 2,103 篇（ARR 口徑）、EMNLP 4,190 篇。跟 2021 年相比，ACL 基本持平（+0.8%），EMNLP 增長 16.4%。NAACL 因為 2021 年也有舉辦（投稿 1,797 篇），2022 年的 ARR 口徑投稿量增長 17.0%，但由於 ARR 的分母定義不同，數字不直接可比。

### 後見之明：2022 年哪些工作影響最深遠？

站在 2026 年回看，2022 年 NLP 領域影響力最大的五項工作：

1. **InstructGPT / RLHF**——直接催生 ChatGPT，把整個 AI 產業推入「大模型產品化」時代
2. **Chain-of-Thought Prompting**——開啟了 prompting 推理技術的整個研究方向（Self-Consistency, Tree-of-Thought, ReAct, Chain-of-Thought with Self-Correction...）
3. **Chinchilla scaling laws**——改寫了所有後續模型的訓練策略，業界從「最大模型」轉向「最佳訓練資料量」
4. **Flan 2022 / Instruction Tuning 方法論**——Flan-T5 成為開源社群的基底模型標準，混合訓練模板的技巧被廣泛採用
5. **ChatGPT 本身**——雖然不是論文，但它改變了 NLP 研究的社會脈絡，讓「alignment」從學術興趣變成社會關注焦點

這五項裡只有一項（InstructGPT）是在 NeurIPS 正式發表的；其餘要麼是 arXiv 預印本，要麼是產品發布。這個事實本身就說明了 2022 年 NLP 的學術發表格局正在發生什麼變化。

---

## 參考資料

- [ACL 2022 Best Paper Awards（官方公告）](https://2022.aclweb.org/best-paper-awards.html)
- [ACL 2022 Conference Handbook（General Chair 前言）](https://aclanthology.org/2022.acl.handbook.pdf)
- [ACL Anthology — ACL 2022 論文集（604 篇長論文、98 篇短論文、332 篇 Findings）](https://aclanthology.org/events/acl-2022/)
- [NAACL 2022 Best Paper Awards（官方公告）](https://2022.naacl.org/blog/best-papers/)
- [NAACL 2022 Main Conference Review Process（Program Chairs 官方統計）](https://2022.naacl.org/blog/review-process/)
- [ACL Anthology — NAACL 2022 論文集（443 篇主軌、210 篇 Findings）](https://aclanthology.org/events/naacl-2022/)
- [ACL Anthology — EMNLP 2022 論文集（829 篇主軌、549 篇 Findings）](https://aclanthology.org/events/emnlp-2022/)
- [EMNLP 2022 Proceedings Preface（PDF，Best Paper Committee 說明）](https://aclanthology.org/2022.emnlp-main.0.pdf)
- [AISB — Conference Reports: EMNLP 2022（Best Paper 確認）](https://aisb.org.uk/conference-reports-empirical-methods-in-natural-language-processing-emnlp-2022/)
- [Ouyang et al. (2022) "Training Language Models to Follow Instructions with Human Feedback" (InstructGPT), NeurIPS 2022](https://proceedings.neurips.cc/paper_files/paper/2022/file/b1efde53be364a73914f58805a001731-Paper-Conference.pdf)
- [Wei et al. (2022) "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models", NeurIPS 2022](https://proceedings.neurips.cc/paper/2022/file/9d5609613524ecf4f15af0f7b31abca4-Paper-Conference.pdf)
- [Longpre et al. (2023) "The Flan Collection: Designing Data and Methods for Effective Instruction Tuning", ICML 2023](https://proceedings.mlr.press/v202/longpre23a/longpre23a.pdf)
- [Google Research Blog — "The Flan Collection: Advancing open source methods for instruction tuning"](https://research.google/blog/the-flan-collection-advancing-open-source-methods-for-instruction-tuning/)
- [Yi Tay (2023) "2022 in Review: Top language AI research papers + interesting trends"](https://www.yitay.net/blog/2022-best-nlp-papers)
- [ACL Rolling Review — Changes Based on the ACL Reviewing Survey（2022 年 8 月）](http://aclrollingreview.org/changes-based-on-the-ACL-reviewing-survey/)
- [ACL Admin Wiki — 2022Q1 Reports: ACL Rolling Review](https://www.aclweb.org/adminwiki/index.php/2022Q1_Reports:_ACL_Rolling_Review)
- [ACL Rolling Review — Status Report（2021 年 10 月）](http://aclrollingreview.org/status-report/)
- [ACL 2022 Chair Blog Post — Rolling Review（接受率兩種算法官方說明）](https://2022.aclweb.org/post/acl-2022-chair-blog-post-rolling-review)
- [FeijiangHan/Top-Conference-Best-Papers（GitHub, Best Paper 彙整）](https://github.com/FeijiangHan/Top-Conference-Best-Papers)
