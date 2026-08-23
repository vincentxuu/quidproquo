---
title: "2021 AI 頂會導讀：自然語言處理篇"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, acl, emnlp, naacl, nlp, "2021", prompt-tuning, parameter-efficient]
lang: zh-TW
tldr: "2021 年是 NLP 從「fine-tune 整個模型」轉向「只調一小部分參數」的分水嶺——Prefix-Tuning（ACL）、LoRA（arXiv，後成為業界標準）、Prompt Tuning（EMNLP）三篇同年出現，ACL Rolling Review 同年啟動，Findings track 正式站穩成為第二發表管道。"
description: "2021 年 ACL-IJCNLP、EMNLP、NAACL 三場 NLP 頂會的 Best Paper、最具影響力論文、研究趨勢總整理：parameter-efficient fine-tuning 的誕生年、ACL Rolling Review 的起步、Findings track 的定位，以及這一年的投稿規模與審稿變化。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 7
glossary:
  - term: "parameter-efficient fine-tuning"
    definition: "不更新整個預訓練模型的全部參數，只調整一小部分新增或低秩的參數，就能讓模型適應下游任務。2021 年的 Prefix-Tuning、LoRA、Prompt Tuning 是這個方向的奠基論文。"
    context: "2021 年 NLP 頂會最具長期影響力的研究方向。"
  - term: "ACL Rolling Review (ARR)"
    definition: "ACL 系列會議的統一滾動審稿平台。論文先進入共用投稿池審稿，審完後作者再選擇 commit 到某一場具體會議。2021 年 5 月首次開放投稿。"
    context: "ACL 2021 本身沒有採用 ARR，但 EMNLP 2021 開始試行 ARR 投稿通道。"
  - term: "Findings"
    definition: "ACL 系列會議的第二層發表管道——論文通過同行評審、品質合格，但未達主軌（main track）的接受門檻。2020 年由 EMNLP 率先引入，2021 年已成為 ACL/EMNLP/NAACL 三場會議的固定機制。"
    context: "EMNLP 2021 的 Findings 接受了 419 篇論文。"
---

2021 年的 NLP 頂會有一個不那麼顯眼、但影響極深遠的共同主題：**不要再 fine-tune 整個模型了**。這一年同時出現了 Prefix-Tuning、LoRA、Prompt Tuning 三種 parameter-efficient 方法，每一種都在後來成為業界標準做法的一部分。同一年，ACL Rolling Review 正式啟動，開始改變 NLP 論文的投稿與審稿方式。

這篇整理 2021 年 ACL-IJCNLP、EMNLP、NAACL 三場 NLP 頂會的 Best Paper、最具影響力的論文、以及這一年的研究趨勢。

## ACL-IJCNLP 2021

ACL 2021 與 IJCNLP 2021 聯合舉辦（ACL-IJCNLP 2021），線上會議，8 月 1–6 日。投稿 3,350 篇，接受 710 篇，接受率 21.2%。

### Best Paper Awards

**Best Paper**

- **Vocabulary Learning via Optimal Transport for Neural Machine Translation**
  Jingjing Xu, Hao Zhou（ByteDance AI Lab）, Chun Gan（UW-Madison）, Zaixiang Zheng（南京大學）, Lei Li（UCSB）
  把機器翻譯的詞表建構問題轉化成最佳傳輸（optimal transport）問題，提出 VOLT 算法，在不需要昂貴的試訓練下找到好的詞表，速度比傳統方法快 100 倍。

**Best Theme Paper**

- **Including Signed Languages in Natural Language Processing**
  Kayo Yin, Amit Moryossef, Julie Hochgesang, Yoav Goldberg（Bar-Ilan / AI2）, Malihe Alikhani
  主張 NLP 社群應該把手語納入研究範圍，分析了手語在語言學上的獨特結構與當前 NLP 工具的不足。

### Outstanding Papers（摘選）

- **All That's 'Human' Is Not Gold: Evaluating Human Evaluation of Generated Text**
  Elizabeth Clark, Tal August, Sofia Serrano, Nikita Haduong, Suchin Gururangan, Noah A. Smith（UW / AI2）
  揭露人類評估者其實經常分不清人寫的文字和機器生成的文字——人類評估本身的品質不應被當成理所當然的金標準。

- **Intrinsic Dimensionality Explains the Effectiveness of Language Model Fine-Tuning**
  Armen Aghajanyan, Sonal Gupta, Luke Zettlemoyer（Meta）
  發現預訓練語言模型的 fine-tuning 之所以有效，是因為任務適應只需要在一個低維子空間裡移動——這個觀察直接為後來的 LoRA 等低秩方法提供了理論支撐。

- **UnNatural Language Inference**
  Koustuv Sinha, Prasanna Parthasarathi, Joelle Pineau, Adina Williams（McGill / Mila / FAIR）
  發現 NLI 模型即使在語序被打亂的「不自然」句子上也能拿到高分——說明這些模型可能只是在利用詞彙重疊等表面特徵，而非真正理解語義。

- **Scientific Credibility of Machine Translation Research: A Meta-Evaluation of 769 Papers**
  Benjamin Marie, Atsushi Fujita, Raphael Rubino（NICT）
  系統性檢視了 769 篇機器翻譯論文的實驗方法論，發現大量論文在統計顯著性檢定、baseline 比較、可重現性上有嚴重缺陷。

### ACL 2021 最具長期影響力的論文

ACL 2021 有幾篇論文的引用量和實際影響遠超 Best Paper——它們定義了後來幾年的研究方向：

- **Prefix-Tuning: Optimizing Continuous Prompts for Generation**
  Xiang Lisa Li, Percy Liang（Stanford）
  不 fine-tune 模型本身，而是學習一組「前綴」向量插入到 Transformer 每一層的 key/value 前面。這是 parameter-efficient fine-tuning 的奠基論文之一，啟發了後來的 P-Tuning、P-Tuning v2 等一系列工作。

- **On the Effectiveness of Adapter-based Tuning for Pretrained Language Model Adaptation**
  Ruidan He 等人（ACL 2021 Long Paper）
  系統性比較了 adapter 模組插入 Transformer 不同位置的效果，為後來的 adapter-based 方法建立了實驗基線。

- **Pre-train, Prompt, and Predict: A Systematic Survey of Prompting Methods in Natural Language Processing**
  Pengfei Liu, Weizhe Yuan, Jinlan Fu, Zhengbao Jiang, Hiroaki Hayashi, Graham Neubig（CMU）
  發表於 ACL 2021 期間（正式版本後來在 ACM Computing Surveys），是 prompt-based learning 的第一篇大規模綜述，定義了「pre-train, prompt, predict」這個新範式的術語框架。

## EMNLP 2021

線上與實體混合（Punta Cana, Dominican Republic），11 月 7–11 日。投稿 3,600 篇，主軌接受 840 篇（23.3%），Findings 接受 419 篇（11.6%）。EMNLP 2021 也是第一場試行 ACL Rolling Review（ARR）投稿通道的會議——17 篇論文透過 ARR 提交，其中 6 篇被主軌接受。

### Best Paper Awards

**Best Long Paper**

- **Visually Grounded Reasoning across Languages and Cultures**
  Fangyu Liu（Cambridge）, Emanuele Bugliarello（Copenhagen）, Edoardo Maria Ponti（Mila / McGill）, Siva Reddy（Mila / McGill）, Nigel Collier（Cambridge）, Desmond Elliott（Copenhagen）
  建構了 MaRVL 資料集，讓視覺推理測試真正跨語言、跨文化——圖片和描述完全由母語者選擇，而非翻譯自英文。發現現有多語言多模態模型在非英語文化情境下表現驟降。

**Best Short Paper**

- **CHoRaL: Collecting Humor Reaction Labels from Millions of Social Media Users**
  Zixiaofan Yang, Shayan Hooshmand, Julia Hirschberg（Columbia）
  利用社群媒體上的大規模使用者反應（而非少數標註者）來收集幽默標籤，提出了一種低成本、高多樣性的標註方法論。

### Outstanding Papers（摘選）

- **Mindcraft: Theory of Mind Modeling for Situated Dialogue in Collaborative Tasks**
  Cristian-Paul Bara, Sky CH-Wang, Joyce Chai（Michigan / Columbia）
  在協作任務的情境對話中建模心智理論（Theory of Mind），讓 agent 能推測對方的意圖和信念。

- **When Attention Meets Fast Recurrence: Training Language Models with Reduced Compute**
  Tao Lei（ASAPP）
  提出將快速遞迴（fast recurrence）與 attention 結合的架構，在保持性能的同時大幅減少訓練計算量。

- **SituatedQA: Incorporating Extra-Linguistic Contexts into QA**
  Michael Zhang, Eunsol Choi（UT Austin）
  指出問答系統需要考慮「情境」（提問的時間、地點），同一個問題在不同情境下答案可能完全不同。

### EMNLP 2021 最具長期影響力的論文

- **The Power of Scale for Parameter-Efficient Prompt Tuning**
  Brian Lester, Rami Al-Rfou, Noah Constant（Google）
  證明隨著模型規模增大，只調 prompt 的效果可以逼近 full fine-tuning——在 T5-XXL（110 億參數）上差距幾乎消失。這篇 prompt tuning 論文和 ACL 的 prefix-tuning 一起奠定了 parameter-efficient 的方向。

- **Finetuned Language Models Are Zero-Shot Learners（FLAN）**
  Jason Wei 等人（Google Brain）
  用大量 NLP 任務的指令模板（instruction templates）fine-tune 語言模型，讓模型在從未見過的任務上也能 zero-shot 執行。FLAN 直接啟發了後來的 InstructGPT、ChatGPT 等 instruction-following 模型路線。雖然正式發表版本出現在 ICLR 2022，但 arXiv 預印本和社群討論集中在 2021 年下半年 EMNLP 前後。

## NAACL 2021

線上會議（原定 Mexico City），6 月 6–11 日。投稿 1,797 篇，接受 499 篇。

### Best Paper Awards

**Best Long Paper**

- **Video-aided Unsupervised Grammar Induction**
  Songyang Zhang, Linfeng Song, Lifeng Jin, Kun Xu, Dong Yu, Jiebo Luo（Rochester / Tencent AI Lab）
  利用影片作為額外訊號來做無監督語法歸納——不需要語言學標註，影片提供的視覺接地（visual grounding）就能幫助模型學到更好的語法結構。

**Outstanding Long Papers（摘選）**

- **It's Not Just Size That Matters: Small Language Models Are Also Few-Shot Learners**
  Timo Schick, Hinrich Schütze（LMU Munich）
  證明小模型加上精心設計的 prompt 和模式利用（pattern-exploiting training, PET），在 few-shot 場景下可以追上甚至超越大模型——挑戰了「few-shot 需要超大模型」的既定印象。

**Best Short Paper**

- **Learning How to Ask: Querying LMs with Mixtures of Soft Prompts**
  Guanghui Qin, Jason Eisner（Johns Hopkins）
  提出用可學習的「軟 prompt」混合來查詢語言模型，而非手動設計 prompt——這是 soft prompt 方向的早期重要工作。

### NAACL 2021 值得關注的其他論文

- **Factual Probing Is [MASK]: Learning vs. Learning to Recall**
  Zexuan Zhong, Dan Friedman, Danqi Chen（Princeton）
  質疑了「用 cloze-style prompt 來探測語言模型知識」這個常見做法的可靠性，指出模型可能只是在學習回憶訓練資料中的表面模式。

## 2021 年未在頂會正式發表、但影響力極大的 NLP 論文

有些論文在 2021 年以 arXiv 預印本形式出現，雖然正式發表在 2022 或更後面的會議，但其影響力在 2021 年就已經開始擴散：

- **LoRA: Low-Rank Adaptation of Large Language Models**
  Edward J. Hu 等人（Microsoft）
  在 Transformer 的權重矩陣旁加上低秩分解的旁路（bypass），只訓練這對小矩陣。arXiv 2021 年 6 月，正式發表於 ICLR 2022。截至 2026 年累計引用超過 14,000 次，是 parameter-efficient fine-tuning 領域引用量最高的論文，已成為業界部署大模型的標準做法。

- **Multitask Prompted Training Enables Zero-Shot Task Generalization（T0）**
  Victor Sanh 等人（Hugging Face / BigScience）
  與 FLAN 同期的平行工作——同樣用多任務指令 fine-tune，但開源了模型和資料集（T0、P3 prompt 集合），對開源 LLM 生態影響深遠。正式發表於 ICLR 2022。

## 2021 NLP 總體觀察

### Parameter-Efficient Fine-Tuning 的誕生年

2021 年是 PEFT 的元年。Prefix-Tuning（ACL）、Prompt Tuning（EMNLP）、LoRA（arXiv/ICLR 2022）、P-Tuning（arXiv/ACL 2022）幾乎同時出現，背後的共同觀察是：預訓練模型的任務適應只需要在一個低維子空間裡移動（Aghajanyan 等人的 intrinsic dimensionality 論文提供了理論解釋）。這不是一個漸進式的趨勢——2020 年之前，fine-tune 整個模型是幾乎唯一的做法；2021 年之後，「只調一小部分」成為活躍的研究主線和業界標準。

### Instruction Tuning 的起點

FLAN 和 T0 這兩篇同期平行工作，各自獨立發現了同一件事：用自然語言指令（instruction）格式 fine-tune 語言模型，可以讓模型泛化到從未見過的任務。這個發現直接通往 InstructGPT（2022）→ ChatGPT（2022 年底）→ 整個 instruction-following LLM 生態。2021 年是這條路的起跑點。

### 人類評估的可信度遭到質疑

ACL 2021 的 Outstanding Paper「All That's 'Human' Is Not Gold」和 NAACL 2021 的幾篇相關工作一起指出：人類評估者在分辨人寫文字和機器生成文字上的表現可能比我們以為的差得多。這在 GPT-3 已經能產出高品質文字的 2021 年格外重要——如果人類都分不清，那「人類評估」這個金標準本身就需要重新檢視。

### ACL Rolling Review 正式啟動

2021 年 5 月，ACL Rolling Review（ARR）開放第一個投稿週期。這是 NLP 社群審稿機制的重大變革：從每場會議獨立審稿，轉向跨會議的統一滾動審稿。EMNLP 2021 率先試行，17 篇論文透過 ARR 提交。到 2024 年，ACL、EACL、NAACL、EMNLP 已全面採用 ARR 作為唯一投稿系統。

### Findings Track 站穩腳跟

Findings 2020 年由 EMNLP 率先引入，到 2021 年已成為 ACL 和 EMNLP 的固定機制。EMNLP 2021 的 Findings 接受了 419 篇論文（投稿的 11.6%），主軌接受 840 篇（23.3%）——兩條管道合計，超過三分之一的投稿論文獲得了某種形式的發表。這條第二管道的定位仍有爭議（接受率較高、prestige 較低），但它確實緩解了主軌接受率持續下降的壓力，讓更多扎實但不夠「頂」的工作有了正式的同行評審發表管道。

### 投稿規模：尚在可控範圍

2021 年 NLP 三場會議的投稿量——ACL 3,350、EMNLP 3,600、NAACL 1,797——以今天的眼光看還算溫和。到 2025 年，ACL 投稿量已飆升到 8,360（+150%），EMNLP 達 8,174（+127%）。2021 年是投稿量爆炸的前夜，LLM 熱潮帶來的巨量投稿壓力要到 2023-2024 年才真正到來。

---

## 參考資料

- [ACL-IJCNLP 2021 Paper Awards（官方）](https://2021.aclweb.org/program/accept)
- [NAACL 2021 Best Paper Awards（官方）](https://2021.naacl.org/blog/best-paper-awards)
- [EMNLP 2021 Conference Handbook（ACL Anthology PDF）](https://aclanthology.org/2021.emnlp.handbook.pdf)
- [EMNLP 2021 Best Papers — Awesome Award-Winning Papers（GitHub）](https://github.com/Aiah/Awesome-Award-Winning-Papers)
- [ACL Rolling Review — 官方部落格（ARR 啟動公告與歷次更新）](http://aclrollingreview.org/blog)
- [ACL Admin Wiki — 2022Q1 Reports: ACL Rolling Review（ARR 前 10 個週期統計）](https://www.aclweb.org/adminwiki/index.php/2022Q1_Reports:_ACL_Rolling_Review)
- [OpenAccept.org — EMNLP 歷年投稿／接受統計（含 Findings）](https://openaccept.org/c/ai/emnlp)
- [The best NLP papers of 2021（thebestnlppapers.com）](https://thebestnlppapers.com/nlp/papers/2021)
- [NAACL 2021 Conference Structure（官方）](https://2021.naacl.org/blog/conference-structure)
- [EMNLP 2021: latest trends in NLP（Frank Schilder, Medium）](https://medium.com/@schilderf/emnlp-2021-latest-trends-in-nlp-bacd163cce0d)
- [Quality of ACL "Findings": analysis of citations（KInIT）](https://kinit.sk/quality-of-acl-findings-analysis-of-citations)
