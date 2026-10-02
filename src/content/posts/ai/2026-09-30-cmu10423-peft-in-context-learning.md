---
title: "CMU 10-423 L10–L11：參數高效微調與 in-context learning——改少量參數，還是只改輸入"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, peft, lora, fine-tuning, in-context-learning, prompt-engineering]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 10
tldr: "手上只有少量標註資料和一個幾十億參數的 LLM 時，CMU 10-423 給兩條路：監督式微調，或把例子塞進 prompt 做 in-context learning。L10 先說明 2023 年的共識是微調通常贏，再介紹四種只調少量參數的做法：只調最上面幾層、adapter、prefix tuning 與 LoRA。L11 前半回到 in-context learning，說明它對例子順序、標籤比例有多敏感，以及怎麼挑 prompt、什麼是 chain-of-thought。HW3 的書面題與 LoRA 程式題都從這兩講出題。"
description: "CMU 10-423/623/723 Generative AI（Spring 2026）Lecture 10「Parameter Efficient Fine-Tuning」全講，加上 Lecture 9 末段的 zero-shot／few-shot 與 prompting、Lecture 11 前半的 in-context learning、prompt engineering 與 chain-of-thought 導讀：SFT 與 ICL 的取捨、top-K 層微調、adapter、prefix tuning、LoRA 的動機與初始化、記憶體與速度的細節、ViT 上的 PEFT，以及這些內容在 HW3 與練習考卷裡的位置。"
draft: false
glossary:
  - term: "PEFT"
    aliases: ["parameter efficient fine-tuning", "參數高效微調"]
    definition: "只微調模型的一小部分參數（或額外加上的少量參數），其餘預訓練權重凍結不動，目標是逼近全參數微調的效果。"
    context: "CMU 10-423 L10 介紹四種做法：只調最上面 K 層、adapter、prefix tuning、LoRA。"
  - term: "prefix tuning"
    definition: "在真實 token 前面假裝多了一串前綴 token，只訓練這些前綴在每一層的 key/value 向量，Transformer 本身的參數全部凍結。"
    context: "L10 的第三種 PEFT 方法；投影片提到用較低維的 MLP 產生前綴參數，是為了讓訓練更穩定。"
    links:
      - label: "Li & Liang 2021"
        url: "https://arxiv.org/abs/2101.00190"
  - term: "in-context learning"
    aliases: ["ICL", "上下文學習"]
    definition: "不更新模型參數，把任務說明與幾組輸入／輸出範例直接放進 prompt，讓 LLM 在生成時從範例推出規律並作答。"
    context: "L10 與 L11 把它當成監督式微調以外的另一種「學習」方式，並比較兩者的優缺點。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-peft-in-context-learning-en)

**本文依據 [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 版。** 這是 [CMU 10-423 導讀](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)系列第 10 篇，進入第三個單元「Applying and adapting foundation models」。主要材料是 2 月 16 日的 [Lecture 10 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture10-peft.pdf)（Aran Nayebi 與 Matt Gormley），加上 2 月 11 日 [Lecture 9 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture9-vae-icl.pdf)末段的 zero-shot／few-shot 與 prompting，以及 2 月 18 日 [Lecture 11 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture11-ift-rlhf.pdf)前半的 in-context learning 與 prompt engineering。L9 前半的 VAE 在[第 8 篇](/posts/ai/2026-09-30-cmu10423-variational-inference-vae)，L11 後半的 instruction tuning 與 RLHF 在[第 11 篇](/posts/ai/2026-09-30-cmu10423-ift-rlhf-dpo)。

事實皆於 2026-09-30 打開官方材料核對。[講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)從 L9 起沒有列 readings，本文只引投影片本身與投影片標注的圖表出處。存取等級 **A3**：投影片、作業與練習考卷公開；課堂錄影在 CMU Panopto，校外看不到。

**系列位置**：上一篇 [HW2：在 AFHQ 貓圖上從零實作 DDPM](/posts/ai/2026-09-30-cmu10423-hw2-ddpm)｜下一篇 [L11–L12：Instruction tuning、RLHF 與 DPO](/posts/ai/2026-09-30-cmu10423-ift-rlhf-dpo)｜[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

## 為什麼從影像又回到 LLM

HW2 交完，下一份 [HW3](/posts/ai/2026-09-30-cmu10423-hw3-lora-gpt2) 要你用 LoRA 微調 GPT-2 做情感分類。這兩講就是在替它鋪路。問題本身很實際：你手上有一個幾十億參數的預訓練模型，和一份只有少量標註的資料集，要怎麼讓模型學會你的任務？

L10 第一張正式投影片就把答案分成兩條路：

| | A：監督式微調（SFT） | B：in-context learning（ICL） |
|---|---|---|
| 做法 | 用標準監督目標、backprop 和你喜歡的優化器（例如 Adam）在訓練資料上微調 | 把訓練範例當成 prompt 餵給 LLM，讓它在解碼時從範例推出規律，取 prompt 後面的輸出當預測 |
| 優點 | 符合標準 ML 流程；N 很大時仍然適用 | 不需要 backprop，每筆資料只過一次；不需要權重，只要 API |
| 缺點 | backprop 大約要 3 倍於前向計算的記憶體與時間；模型是閉源的話根本拿不到權重 | Transformer 處理長度 N 的 prompt 要 O(N²) 時間與空間；prompt 可能塞不進最大上下文長度 |

整篇文章就沿著這張表走：先看 A 怎麼變便宜（PEFT），再看 B 有哪些眉角（ICL 與 prompt engineering）。

## 先補 L9 末段：zero-shot、few-shot 與 prompting

L9 在 VAE 之後用幾頁投影片開了這個單元的頭：

- **Zero-shot learning**：訓練資料裡完全沒有測試時會出現的標籤。投影片的回答是「作弊」，改用標籤的文字描述。
- **Few-shot learning**：每個標籤只有少數幾個（兩、三、四個）範例。
- **Prompting**：自迴歸語言模型定義的是 p(x₁:T) = ∏ p(x_t | x₁, …, x_{t−1})。prompting 的核心想法是給模型一段前綴，讓它最可能的接續剛好就是你要的答案。

投影片接著用 GPT-3 論文的例子示範 zero-shot：直接把上下文餵進去、看模型怎麼補完，不做任何額外訓練，就能回答事實題、補完句子、做類比與閱讀理解。

## 微調通常贏過 ICL，至少在 2023 年是這樣

既然 ICL 這麼方便，為什麼還要微調？L10 的答案是：即使是非常大的 LM，微調通常還是贏。

投影片拿 [LoRA 論文](https://arxiv.org/abs/2106.09685)裡 GPT-3 的結果當例子，微調在兩個任務上大幅贏過 few-shot。原因寫得很具體：GPT-3 的上下文只有 2048 個 token，所以 MNLI-m 的 few-shot 設定總共只放得下 6 個範例；微調版則用了 MNLI-m 的 393,000 筆訓練資料，訓練 2 個 epoch。

另一份在公平條件下比較兩者的研究（投影片引 [ACL 2023 Findings 的這篇](https://aclanthology.org/2023.findings-acl.779.pdf)）也發現，在 RTE 與 MNLI 上，大多數模型大小都是微調勝出。

投影片在這裡加了一個但書：「At least this was the general wisdom in 2023」，並說 2024 年以後可能有不同的故事，留到 L19（長上下文）再談。

## PEFT：只調少量參數，效果逼近全參數微調

PEFT（parameter efficient fine-tuning）的目標寫在投影片上：微調更少的參數，但在下游任務上達到和微調全部參數相當的表現。L10 介紹四種做法：

| 方法 | 做法 |
|---|---|
| Subset | 只挑一部分參數微調，例如 K+L 層網路裡最上面的 K 層 |
| Adapters | 加入參數很少的新層，只調這些層，其餘凍結 |
| Prefix tuning | 假裝序列前面還有很多 token，只調這些 token 對應的 key/value |
| LoRA | 替每個參數矩陣學一個小的增量，而且這個增量是低秩的 |

### 只調最上面幾層

最簡單的基準：凍結除了最上面 K 層以外的所有參數，梯度只需要往下流 K 層，不用存整張計算圖的 adjoint（損失對每個參數的梯度），記憶體因此省下來。這個做法幾乎可以套在任何深度網路上。

投影片自問自答：這樣真的會有用嗎？回答是，較早的層捕捉的是通用的語言特徵，較高的層才是任務相關的特徵。

### Adapter

adapter 層就是一個只有一層隱藏層、帶殘差連接的前饋網路：輸入與輸出維度都是 d，中間壓到較低的維度 r。實務上 r 遠小於 d，adapter 層只占全部參數的 0.5%–8%。加進 Transformer 之後，其他預訓練參數全部凍結，只微調 adapter。

投影片引 [Houlsby et al. 2019](https://arxiv.org/abs/1902.00751) 在 BERT-Large 上的結果：adapter 幾乎追平全參數微調，參數卻少得多，有時甚至更好；對照組是只微調 BERT-Large 最上面 K 層。投影片的評語是「有趣的是，灰色（凍結）的模組都沒動，它還是有效」。

### Prefix tuning

依 [Li & Liang 2021](https://arxiv.org/abs/2101.00190)，prefix tuning 的步驟是：

1. 把每一層、每個 head 裡 token i 的激活看成它的 key/value 向量。
2. 在真實 token 前面插入一串虛擬的前綴 token，每個前綴 token 的激活直接由可訓練參數 P_θ 給出。
3. P_θ 再由一個較低維的 Q_θ 經 MLP 產生，因為這樣訓練更穩定。
4. 訓練時 Transformer 的參數全部凍結，只調 θ。

換句話說，它不改模型，也不改輸入文字，而是在每一層的 attention 前面多塞一些可學習的 key 和 value。

### LoRA

LoRA 是這一講的重頭戲，也是 HW3 程式題要實作的方法。投影片先鋪了三層動機。

**模型有多大。** 投影片列了一張從 GPT-2 到 LLaMA-3 的比較表，並指出 GPT-3 裡一個線性層的大小是 12k × 12k。全參數微調要替每個這樣的矩陣存梯度與優化器狀態。

**為什麼不加正則化也不容易過擬合。** 投影片的假說是：這些模型本質上是低維的。依 [Li et al. 2018](https://arxiv.org/abs/1804.08838) 的定義，intrinsic dimension 是在隨機的低維子空間裡訓練、逐步加大維度，直到出現達到全參數 90% 表現的解時的維度。MNIST 的例子裡，原始網路有 199,210 個參數，intrinsic dimension 只有 750。[Aghajanyan et al. 2020](https://arxiv.org/abs/2012.13255) 用類似方法量 LLM，發現預訓練找到的參數具有很低的 intrinsic dimension。

**LoRA 論文自己列的三個動機**：

1. 受上述兩篇啟發，過度參數化的模型其實位在低 intrinsic dimension 上。
2. 像 prefix tuning 那樣直接優化 prompt，表現會隨參數量非單調地變化，而我們希望參數越多表現越好。
3. adapter 這類方法在推論時會引入不可忽略的延遲。

**核心做法**：凍結預訓練權重 W₀，只學一個加性的修改 ΔW，並把 ΔW 拆成低秩的乘積 BA：

- W₀ ∈ ℝ^{d×k}，A ∈ ℝ^{r×k}，B ∈ ℝ^{d×r}，r 遠小於 min(d, k)
- 輸出從 z = W₀x 變成 z = W₀x + BAx = (W₀ + BA)x

<details>
<summary>投影片強調的幾個細節</summary>

- **初始化**：A 的每個元素從 N(0, σ²) 抽，B 設為 0。這樣一開始 ΔW = BA = 0，微調起點就是原本的預訓練權重。
- **熱抽換**：W₀ 和 BA 同維度，所以可以直接 W ← W₀ + BA 合併成普通線性層，要拿掉時再 W ← W − BA。兩個任務各自訓練一組 B′A′、B″A″，就能來回切換。
- **bias**：LoRA 本身不碰 bias。bias 已經是秩 1，沒有可以再降的秩；多數實作提供順便微調 bias 的選項，但不需要特別的機制。
- **套在哪裡**：LoRA 線性層可以取代 Transformer 裡的每一個線性層，但原論文只套在 attention 權重上；對 GPT-3，他們發現只套在 query 與 value 兩個線性層最有效率。訓練時只調新加的 LoRA 參數。

</details>

投影片對 LoRA 在 GPT-3 上結果的總結：表現幾乎和全參數微調一樣好，參數少得多；某些任務甚至更好；有些資料集 r = 1 就夠；資料集大或小都表現不錯。

### 記憶體與速度：沒有想像中單純

投影片問了一個常被忽略的問題：訓練時所有預訓練參數還是要載入記憶體，LoRA 為什麼比較省？答案是參數總數其實比原本多，但需要的梯度少得多，因此優化器狀態也少得多。

速度更微妙。投影片說大家用 PEFT 的主要理由之一是訓練比較快，但加速的原因很細：

1. 額外計算帶來的變慢（LoRA、adapter、prefix tuning 都有；只調 top-K 層沒有）。
2. 梯度計算變少帶來的加速（四種方法都有）。
3. 記憶體省下來、可以用更大 batch 帶來的加速（四種方法都有）。

哪一個效應勝出並不明顯，甚至取決於 batch size 這類超參數。投影片附了 [Anyscale 在 Llama-2 7B 上量 LoRA 吞吐量的文章](https://www.anyscale.com/blog/fine-tuning-llms-lora-or-full-parameter-an-in-depth-analysis-with-llama-2)當例子。

### ViT 也能用

最後一段回扣 [L5 的 ViT](/posts/ai/2026-09-30-cmu10423-cnn-bert-vit)：既然 ViT 也是 Transformer，LoRA 可以直接套上去。投影片引的結果顯示，在 VTAB-1k（19 個視覺任務）上，參數高效的遷移學習有時比全參數微調更好。

## L11 前半：in-context learning 的眉角

L11（投影片註明 slides credit: Pat Virtue）開頭重述 SFT 與 ICL 的對照表，然後把焦點放在 B 這條路。

### Few-shot ICL 對什麼敏感

few-shot 可以直接用 ICL 做：先給任務說明，再依序放入訓練資料裡的輸入／輸出範例，這是 [GPT-3 論文](https://arxiv.org/abs/2005.14165)的格式。

投影片接著列出 ICL 會受影響的三件事：

1. 範例呈現的順序（引 [Lu et al.](https://arxiv.org/abs/2104.08786)）
2. 標籤是否平衡，例如正面與負面各幾個
3. 範例涵蓋了幾種不同的標籤

然後是一個反直覺的結果：你會以為「範例的標籤是不是真的」和「範例越多越好」很重要，但依 [Min et al.](https://arxiv.org/abs/2202.12837)，並不總是如此。

### Prompt engineering：怎麼挑 prompt

投影片用一個實驗設定提問：新聞主題分類（AG News）、OPT-175B、zero-shot，其他條件都固定、只換 prompt，結果會一樣嗎？答案是不會，所以要挑 prompt。

投影片給的挑法是：**選在模型下困惑度最低（似然最高）的那個 prompt**。它還用另一個設定再示範一次：法文單字翻譯（NorthEuraLex 資料集）、多語模型 Bloom、zero-shot，結論相同。

### Chain-of-thought

最後一段是 chain-of-thought prompting：

- 在 few-shot ICL 裡，要求模型先推理再作答，可以提升表現。
- chain-of-thought prompting 的做法是把推理過程寫進 in-context 範例裡（[Wei et al.](https://arxiv.org/abs/2201.11903)）。
- 但就算不給推理範例、只叫模型「一步一步推理」，模型也會做得更好（[Kojima et al.](https://arxiv.org/abs/2205.11916)）。

## 這兩講在作業與考試裡的位置

- **HW3**（Applying and Adapting LLMs，總分 66，2 月 21 日發下、3 月 12 日截止）的配分是 In-Context Learning 14 分、Parameter Efficient Fine-Tuning 10 分、Direct Preference Optimization 15 分、Programming: LoRA for GPT-2 25 分。ICL 大題要你比較 ICL 與 few-shot chain-of-thought、替同一題寫 ICL、one-shot CoT、zero-shot CoT 三種 prompt，並討論 zero-shot CoT 的優缺點；PEFT 大題要你算一個全連接網路的參數量、加上 bottleneck adapter 之後調多少參數，以及 prefix tuning 下 attention 權重怎麼算。細節見 [HW3 導讀](/posts/ai/2026-09-30-cmu10423-hw3-lora-gpt2)。
- **小考**：講次表把 Quiz 2（L5–L9）排在 L10 當天的課堂上，Quiz 3 排在 2 月 25 日；L12 投影片的 Reminders 寫 Quiz 3 範圍是 Lecture 10、11 與 12（只考 RLHF/DPO）。小考題目校外拿不到。
- **[練習考卷](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)**：第 9 題 In-context Learning 占 8 分；167 分的考卷裡沒有獨立的 PEFT 大題。

## 自學怎麼做

1. 先讀 L10 第一張 SFT／ICL 對照表，用自己的話把每一格的優缺點各舉一個你遇過的情境。
2. 讀 LoRA 段落時，自己算一次：d = k = 12,288（投影片的「12k × 12k」）、r = 8 時，一個矩陣的 LoRA 參數量占原矩陣的百分之幾。這就是 HW3 第 5.2 題那類問題的暖身。
3. 讀 L11 的 ICL 敏感度那幾頁，挑一個你手邊能呼叫的 LLM，拿同一組範例換三種順序，看輸出有沒有變。

今晚可以做的一件事：打開 L10 投影片的 LoRA Initialization 那頁，把「為什麼 B 要設成 0 而不是 A」用一句話寫下來，再對照 LoRA 論文描述方法的章節檢查。

## 延伸閱讀

- 同一段內容在別門課的講法：[CS224N 第 7 講：預訓練、subword 與 in-context learning](/posts/ai/2026-08-22-cs224n-pretraining)、[CS224U In-context learning](/posts/ai/2026-09-29-cs224u-in-context-learning)
- LoRA 的訓練成本：[CME295 第 4 講：LLM 訓練的帳單，預訓練、SFT 與 LoRA 各花在哪裡](/posts/ai/2026-09-29-cme295-llm-training)
- 課程狀態與自學路線：[CMU 10-423 系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

## 參考資料

- [CMU 10-423/623/723 Generative AI（Spring 2026）課程首頁](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [課程講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)——L9–L11 日期、Quiz 2／Quiz 3
- [Lecture 9 投影片：VAEs / In-context learning](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture9-vae-icl.pdf)——zero-shot、few-shot、prompting
- [Lecture 10 投影片：Parameter Efficient Fine-Tuning](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture10-peft.pdf)
- [Lecture 11 投影片：In-Context Learning / Instruction Fine-tuning / RLHF](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture11-ift-rlhf.pdf)
- [Lecture 12 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture12-dpo-text2img.pdf)——Reminders 頁的 Quiz 3 範圍
- [HW3 handout（hw3.zip）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw3.zip)——配分表與題目結構
- [Practice Exam（Spring 2026）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
- [Hu et al. 2021：LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)
- [Houlsby et al. 2019：Parameter-Efficient Transfer Learning for NLP](https://arxiv.org/abs/1902.00751)
- [Li & Liang 2021：Prefix-Tuning](https://arxiv.org/abs/2101.00190)
- [Li et al. 2018：Measuring the Intrinsic Dimension of Objective Landscapes](https://arxiv.org/abs/1804.08838)
- [Aghajanyan et al. 2020：Intrinsic Dimensionality Explains the Effectiveness of Language Model Fine-Tuning](https://arxiv.org/abs/2012.13255)
- [Mosbach et al. 2023（ACL Findings）：Few-shot Fine-tuning vs. In-context Learning](https://aclanthology.org/2023.findings-acl.779.pdf)
- [Anyscale 部落格：在 Llama-2 上比較 LoRA 與全參數微調](https://www.anyscale.com/blog/fine-tuning-llms-lora-or-full-parameter-an-in-depth-analysis-with-llama-2)
- [Brown et al. 2020：Language Models are Few-Shot Learners（GPT-3）](https://arxiv.org/abs/2005.14165)
- [Lu et al. 2021：Fantastically Ordered Prompts and Where to Find Them](https://arxiv.org/abs/2104.08786)
- [Min et al. 2022：Rethinking the Role of Demonstrations](https://arxiv.org/abs/2202.12837)
- [Wei et al. 2022：Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903)
- [Kojima et al. 2022：Large Language Models are Zero-Shot Reasoners](https://arxiv.org/abs/2205.11916)
