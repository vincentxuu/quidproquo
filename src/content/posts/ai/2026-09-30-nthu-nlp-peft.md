---
title: "清大高宏宇 NLP 導讀：Parameter-Efficient Fine-Tuning——沒有 A100 叢集，怎麼微調大模型"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nthu, ai-course, course-guide, nlp, peft, lora, prompt-tuning, fine-tuning]
lang: zh-TW
series:
  name: "清大高宏宇 自然語言處理 導讀"
  order: 13
tldr: "高宏宇 Fall 2025 的 PEFT 投影片先算一筆帳：Llama 2-7B 用 16-bit 全參數微調約要 56GB 顯示卡記憶體，只訓練 0.2M 個參數就降到約 17GB，因為梯度和優化器狀態幾乎歸零。接著用 intrinsic dimensionality 解釋為什麼只調一小撮參數就夠：預訓練越久、模型越大，微調需要的有效維度越低。方法分成加參數（Adapters、Prompt Tuning）、挑參數（BitFit）、重參數化（LoRA）與混合（MAM Adapters、S4）四類；後半段從 GPT-2 的任務描述、verbalizer 一路講到 prefix tuning 和 soft prompt tuning 的取捨。"
description: "清大資工高宏宇《自然語言處理》Fall 2025 W9 導讀，依據 W9_PEFT.pdf：全參數微調與 PEFT 的 GPU 記憶體估算、PEFT 的五個好處、intrinsic dimensionality 的三個觀察、Additive／Selective／Reparametrization 分類、Adapters、Prompt Tuning、BitFit、LoRA、MAM Adapters、S4、方法比較表、prompt-based learning 與 verbalizer、Prefix Tuning 與 Soft Prompt Tuning 的比較。"
draft: false
glossary:
  - term: "PEFT"
    aliases: ["Parameter-Efficient Fine-Tuning", "參數高效微調"]
    definition: "凍結預訓練模型的大部分參數，只訓練一小部分原有參數或新增的少量參數，來把模型調到新任務。"
    context: "投影片用它回應「全參數微調記憶體爆掉」的問題。"
  - term: "intrinsic dimensionality"
    aliases: ["intrinsic dimension", "內在維度"]
    definition: "在整個參數空間裡，只在一個隨機低維子空間中最佳化，就能達到原本最佳化效果某個比例（例如 90%）所需的最小維度。"
    context: "投影片用它解釋為什麼只調少量參數就能接近全參數微調。"
  - term: "verbalizer"
    definition: "把分類標籤一對一對應到模型詞彙表裡的自然語言詞，例如把 positive 對應到 great，讓 MLM 用填空的方式做分類。"
    context: "投影片在 prompt-based learning 段落用 Yelp、SST-2、MNLI 舉例。"
  - term: "soft prompt"
    aliases: ["continuous prompt", "連續提示"]
    definition: "接在輸入前面、可以用梯度訓練的一串向量，不對應任何真實的字。"
    context: "Prompt Tuning 只在輸入層加；Prefix Tuning 在每一層都加。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nthu-nlp-peft-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據清大資工高宏宇教授《[自然語言處理](https://github.com/IKMLab/NTHU_Natural_Language_Processing)》Fall 2025（114-1）的 [W9_PEFT.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W9_PEFT.pdf)（61 頁）。[2025 課表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) 的 W9 列同時掛了這份投影片和 GPT-2／T5 助教課投影片，錄影是 [Week 9 Tue.](https://www.youtube.com/watch?v=zgjO_t5eu_E) 與 [Week 9 Thu.](https://www.youtube.com/watch?v=zWMHxXc0QvA)；**哪一支錄影講 PEFT、哪一支是助教課，本文沒有看片確認**，自學時請自己快轉對照。W9 列的 Topics 欄寫的是「ELMo, BERT, GPT, and T5」，那是課綱模板，和實際掛的投影片對不起來。事實於 2026-09-30 核對。存取等級 **A3**：投影片與錄影都公開。

**系列位置**：上一篇 [GPT-3、InstructGPT 與 RLHF](/posts/ai/2026-09-30-nthu-nlp-gpt3-instructgpt-rlhf)｜下一篇 [RAG（上）：幻覺與檢索器](/posts/ai/2026-09-30-nthu-nlp-rag-retrievers)｜[系列總覽](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)

上一篇的 InstructGPT 和 Llama-2，每一步都要動到整個模型的參數。學校實驗室、小公司或修課學生（課綱明寫「No GPU provided」）要把一個 7B 模型調到自己的任務上，第一個撞到的牆是顯示卡記憶體。

這篇回答一個問題：**沒有 A100 叢集，怎麼微調大模型？**

## 課程影片來源

影片連結對應本文教材；此處不提供未核對的時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=zgjO_t5eu_E
title: Week 9 Tue.
```

```youtube
url: https://www.youtube.com/watch?v=zWMHxXc0QvA
title: Week 9 Thu.
```

原始影片：[Week 9 Tue.](https://www.youtube.com/watch?v=zgjO_t5eu_E)、[Week 9 Thu.](https://www.youtube.com/watch?v=zWMHxXc0QvA)

課程與錄影入口：

- [官方課程與錄影入口](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

## 開場：LLM 時代的 NLP 還能做什麼

投影片開頭引用 CMU Eduard Hovy 在 ROCLING 2024 的演講。第一頁是一段自嘲：「看 LLM 能做什麼！為什麼？不知道／那是未來工作／沒想過」，連問三輪。第二頁給出三個方向：讓 LLM 好用（NLP 工程）、讓 LLM 有用（NLP 應用）、讓 LLM 可理解（NLP 研究）。第一個方向底下的第一項，就是把 LLM 調到特定領域、做出更小更便宜的模型。

再來一頁是 TechCrunch 2024 年 10 月的報導：OpenAI 執行長說算力不足正在拖延公司的產品。連 OpenAI 都缺算力，PEFT 的動機就很清楚了。

## 先算帳：全參數微調要多少記憶體

投影片先列出 PaLM 540B、MT-NLG 530B、GPT-3 175B 這些模型，接著用 Llama 2-7B 算一筆實際的帳（16-bit float、序列長度 4096、batch size 1）：

| 項目 | 怎麼算 | 全參數微調 | 只訓練 0.2M 參數 |
|---|---|---|---|
| CUDA | 固定開銷 | ~1GB | ~1GB |
| 模型權重 | size(float) × N_parameter | 13.03GB | 13.03GB（相同） |
| 梯度 | size(float) × N_trainable | 13.03GB | 0.4MB |
| Hidden states | 隨層數、序列長度、head 數成長 | 3.16GB | 3.16GB（相同） |
| 優化器狀態 | 2 × size(float) × N_trainable | 26.06GB | 0.8MB |
| **合計** | | **56.28GB** | **17.19GB** |

這張表的重點：**梯度和優化器狀態都跟「可訓練參數量」成正比**，而優化器狀態（投影片算成可訓練參數的兩倍）又是最大的一塊。把可訓練參數壓到極少，這兩項幾乎歸零；權重和 hidden states 不變，所以省不到 0。

投影片另外附了 hidden states 的估算公式，也引用 [LLaMA-Factory](https://github.com/hiyouga/LLaMA-Factory) 的硬體需求表，並註明推論在 batch 1、上下文 4k 時只需要 24GB。

<details>
<summary>Hidden states 估算公式（依投影片）</summary>

訓練時約為：3·h·seq·bs + 18·L·h·seq·bs + 3·L·heads·seq² + vocab·seq·bs

L 是層數（Llama 2-7B 為 32），heads 是注意力 head 數（32），h 是 hidden size，bs 是 batch size。seq² 那一項來自注意力分數、機率與 dropout。

</details>

### 這不是新點子

投影片提醒：電腦視覺早就常常只更新最後一層；NLP 也試過靜態與非靜態的詞向量；[ELMo](https://arxiv.org/abs/1802.05365) 甚至不微調它的 contextualized embedding。PEFT 是把這個老直覺搬到 LLM 上。

### PEFT 的五個好處

1. 降低計算和儲存成本。
2. 可攜：每個任務只存一小組參數，通用的預訓練參數共用。
3. 減少 catastrophic forgetting：大部分參數不動，預訓練學到的語言知識比較不會被新任務覆蓋。
4. 資料少時比較不容易過擬合。
5. 效能可以接近全參數微調：投影片舉的例子是加入小型 adapter，在多個 NLU 基準上和完整微調 BERT 相差不到 1%。

投影片還放了一張 RTE 資料集上的比較（DeBERTa-v3-base）：全參數微調 83.75%、訓練 184M 參數；LoRA 86.60%，只訓練 0.8M（0.43%）；AdaLoRA 88.09%，1.27M（0.69%）。在這個例子裡，參數少的方法分數反而比較高。

## 為什麼只調一小撮就夠：Intrinsic Dimensionality

[Li et al.（ICLR 2018）](https://arxiv.org/abs/1804.08838) 的定義：在 D 維參數空間裡，只在一個隨機的 d 維子空間中最佳化，看要多大的 d 才能達到原本最佳化結果的某個比例。d90 就是達到 90% 效果所需的維度。

投影片列的數字很驚人：MNIST 上的全連接網路有 199,210 個參數，d90 只要 750（0.38%）；Atari Pong 的 ConvNet 有 1,005,974 個參數，d90 是 6,000（0.60%）。**很多問題的有效維度，比參數量小兩三個數量級。**

[Aghajanyan et al.（ACL 2021）](https://arxiv.org/abs/2012.13255) 把這個概念帶到語言模型微調，投影片整理出三個觀察：

- 許多問題的內在維度都很小。
- RoBERTa-base 在六個資料集（MRPC、QQP、Yelp Polarity、SST-2、MNLI、ANLI）上，預訓練越久，微調所需的內在維度越低。
- 固定預訓練步數下，模型越大，微調 MRPC 所需的內在維度越低。

合起來的意思是：**預訓練已經把模型推到一個「只要微幅調整就能適應新任務」的位置**，而且模型越大越是如此。這正是 PEFT 行得通的理論依據。

## 方法地圖：三大類加一類混合

投影片依 [Lialin et al. 2023](https://arxiv.org/abs/2303.15647) 的綜述分類：

| 類型 | 做法 | 代表 |
|---|---|---|
| Additive（加參數） | 加入新的可訓練參數，原模型凍結 | Adapters、Prompt Tuning、Prefix Tuning |
| Selective（挑參數） | 只訓練原模型中挑出來的一部分參數 | BitFit |
| Reparametrization（重參數化） | 用低秩矩陣表示權重的變化量 | LoRA |
| Hybrid（混合） | 組合上面幾種 | MAM Adapters、S4 |

### Adapters

[Houlsby et al. 2019](https://arxiv.org/abs/1902.00751)：在 attention 和 FFN 之後各插一個小瓶頸網路，先把 d 維特徵投影到更小的 m 維、過非線性、再投影回 d 維。只要 m 遠小於 d，每個任務增加的參數就很少。投影片也列出後續的變體：Bottleneck Adapter（2019）、Parallel Adapter（2020）、Compact Adapter（2021）。

### Prompt Tuning

[Lester et al. 2021](https://arxiv.org/abs/2104.08691)：在輸入 embedding 前面接一串可訓練的向量（soft prompt），模型本身完全凍結，只更新這串向量。好處是多任務服務很方便：每個任務是一段 prompt，不是一整個模型，同一批輸入可以配不同任務的 prompt。

```python
# 依投影片的 pseudocode
soft_prompt = torch.nn.Parameter(torch.rand(num_tokens, embedding_dim))

def input_soft_prompt(x, soft_prompt):
    return concatenate([soft_prompt, x], dim=seq_len)

train(model(input_soft_prompt(x, soft_prompt)))  # 只有 soft_prompt 會被更新
```

### BitFit

[Ben Zaken et al. 2022](https://arxiv.org/abs/2106.10199)：只微調模型裡的 bias 項（LayerNorm、FFN、attention 的 bias），其他全部凍結。實作就是把名字含「bias」的參數交給 optimizer。

### LoRA

[Hu et al. 2021](https://arxiv.org/abs/2106.09685)：原權重 W（d×d）凍結，旁邊加一條路徑 B·A，A 把輸入壓到 r 維、B 再展回 d 維，r 遠小於 d。投影片的圖標出初始化方式：A 從常態分布 N(0, σ²) 取樣，B 設為 0，所以訓練剛開始時這條旁路的輸出是 0，模型行為和原本一模一樣；α 是縮放係數。

LoRA 在投影片比較表上的優勢是**推論時沒有額外開銷**：訓練完可以把 B·A 加回 W，模型結構不變。

### 混合方法：MAM Adapters 與 S4

[He et al.（ICLR 2022）](https://arxiv.org/abs/2110.04366) 把 adapter、prefix tuning、LoRA 放進同一個框架比較，組出 MAM Adapter：FFN 層用加了縮放的 parallel adapter，再加上 soft prompt。

[Chen et al.（ICLR 2023）](https://arxiv.org/abs/2301.01821) 的 S4 則是把 PEFT 設計當成搜尋問題，分四步決定：層怎麼分組、可訓練參數怎麼分配、哪些組要調、每組用哪種方法（Adapter、Prefix、BitFit、LoRA）。在額外參數 0.1% 的限制下，搜出來的結果是 spindle 分組、平均分配、每組都調，再依序替四組挑選方法組合。

### 比較表與選擇標準

投影片依 Lialin et al. 整理的比較（節錄）：

| 方法 | 類型 | 推論開銷 | 可訓練參數比例 |
|---|---|---|---|
| Adapters | A | 多一段 FFN | 0.1%–6% |
| Prompt Tuning | A | 輸入變長 | 0.1% |
| BitFit | S | — | 0.5% |
| LoRA | R | 無 | 0.01%–0.5% |
| MAM Adapters | A | 多一段 FFN 與輸入 | 0.5% |
| S4 | A+S+R | 多一段 FFN 與輸入 | 0.5% |

選方法時投影片要你問四件事：參數量多少；訓練效率（要不要對原網路做反向傳播、能不能吃滿 GPU）；推論效率（有沒有額外參數、代價多大）；最後的準確度。

## 後半段：Prompt-based Learning

投影片最後一段換一個角度：不改模型結構，而是改輸入的樣子。分成 hard prompt（離散的真實文字）和 soft prompt（連續向量）兩種。

### 用任務描述微調

這個想法在 [GPT-2 論文](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) 就出現了：把「翻譯成英文：」這種任務描述放進輸入，模型就知道要做什麼。

[Schick & Schütze（EACL 2021）](https://arxiv.org/abs/2001.07676) 把它用在 MLM 分類：Yelp 評論要分 1 到 5 顆星，就把輸入改成「評論 [SEP] In summary, the restaurant is [MASK].」，再用 **verbalizer** 把標籤對應到詞：1→terrible、2→bad、3→okay、4→good、5→great。[Gao et al.（ACL 2021）](https://arxiv.org/abs/2012.15723) 的例子還有 SST-2（positive→great、negative→terrible）和 MNLI（entailment→Yes、neutral→Maybe、contradiction→No）。

好處有兩個：分類題變成生成題，可以直接沿用 MLM 的輸出層，不用另加分類層；而且用比較少的訓練資料就能達到一般微調的效果。

投影片也指出這對 GPT-3 同樣有效：只加任務描述、不微調，就是 in-context learning；加了任務描述再微調，叫 prompt-based fine-tuning。

### 離散 prompt 的問題

- 可能的描述組合太多，很難找到最好的那一個。
- 為每個任務搜尋最佳描述，計算成本很高。
- 離散文字沒辦法在訓練中直接用梯度最佳化。

這三點引出 soft prompt。

### Prefix Tuning 與 Soft Prompt Tuning

**Prefix Tuning**（[Li & Liang, ACL 2021](https://arxiv.org/abs/2101.00190)）為生成任務設計：在**每一層**的 hidden states 左邊接上 p 個虛擬 hidden state，模仿 self-attention 的虛擬輸出。預訓練模型（GPT-2／BART）凍結，只訓練這些虛擬狀態。實作上會先用一個 MLP 對它們重參數化，讓訓練比較穩定。初始化也有講究：資料少時隨機初始化效果差、變異大，用「summarization」「table-to-text」這種跟任務相關的詞初始化比較好；資料充足時沒差。[P-Tuning v2](https://arxiv.org/abs/2110.07602) 是同樣的做法，改在 NLU 任務上測試。

**Soft Prompt Tuning**（Lester et al. 2021）只在**輸入層**接 p 個可訓練向量，模型是凍結的 T5。初始化方面，用類別標籤的詞初始化最好；模型小時不同初始化差很多，放大到 XXL 後差距就消失。

投影片的比較：

| | Prefix Tuning | Soft Prompt Tuning |
|---|---|---|
| 可訓練參數 | 較多（prefix 長度 × hidden size × 層數） | 較少（prompt 長度 × hidden size） |
| 推論速度 | 較慢 | 較快 |
| 效能 | 較好 | 較差 |
| 使用情境 | 少樣本時比全參數微調好；資料充足時兩者差不多 | 同左 |

## 自學怎麼用這一講

1. 先把「記憶體帳」那張表自己用 13B 模型重算一次。算得出來，就懂為什麼 PEFT 省的是梯度和優化器，而不是權重。
2. 用 Hugging Face 的 [PEFT 函式庫](https://github.com/huggingface/peft) 對一個小模型各跑一次 LoRA 和 prompt tuning，印出 `print_trainable_parameters()` 的結果，對照投影片比較表的參數比例。
3. 讀 [LoRA 論文](https://arxiv.org/abs/2106.09685) 的 Figure 1，確認你看得懂 A、B 的初始化為什麼讓訓練起點等於原模型。
4. 本系列的 [HW3 多輸出學習](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3) 指定用 bert-base-uncased；做完之後可以試著包一層 LoRA，比較記憶體和分數。

今晚可以做的一件事：打開你正在用的訓練腳本，數一下可訓練參數和總參數的比例，再用投影片的公式估算優化器狀態吃掉多少記憶體。

## 延伸閱讀

- 從 prompt 到 LoRA 的高效適應方法：[CS224N 第 8 講：Efficient Adaptation](/posts/ai/2026-08-22-cs224n-efficient-adaptation)
- 訓練階段的記憶體與參數帳：[CME295 導讀：LLM Training](/posts/ai/2026-09-29-cme295-llm-training)
- 微調時怎麼不忘記舊能力：[台大李宏毅 ML 2026 導讀：HW5 微調而不遺忘](/posts/ai/2026-09-30-ntu-ml2026-hw5-finetuning-without-forgetting)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [IKMLab/NTHU_Natural_Language_Processing（GitHub）](https://github.com/IKMLab/NTHU_Natural_Language_Processing) — 課程 repo
- [2025 課表 README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) — W9 列掛的投影片與錄影
- [W9_PEFT.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W9_PEFT.pdf) — 本文所有表格、公式與分類
- [[Fall 2025] Week 9 Tue. 錄影](https://www.youtube.com/watch?v=zgjO_t5eu_E)
- [[Fall 2025] Week 9 Thu. 錄影](https://www.youtube.com/watch?v=zWMHxXc0QvA)
- [hiyouga/LLaMA-Factory 硬體需求表](https://github.com/hiyouga/LLaMA-Factory)
- [Li et al., Measuring the Intrinsic Dimension of Objective Landscapes (ICLR 2018)](https://arxiv.org/abs/1804.08838)
- [Aghajanyan et al., Intrinsic Dimensionality Explains the Effectiveness of Language Model Fine-Tuning (ACL 2021)](https://arxiv.org/abs/2012.13255)
- [Lialin et al., Scaling Down to Scale Up: A Guide to Parameter-Efficient Fine-Tuning (2023)](https://arxiv.org/abs/2303.15647)
- [Houlsby et al., Parameter-Efficient Transfer Learning for NLP (ICML 2019)](https://arxiv.org/abs/1902.00751)
- [Lester et al., The Power of Scale for Parameter-Efficient Prompt Tuning (EMNLP 2021)](https://arxiv.org/abs/2104.08691)
- [Ben Zaken et al., BitFit (ACL 2022)](https://arxiv.org/abs/2106.10199)
- [Hu et al., LoRA: Low-Rank Adaptation of Large Language Models (ICLR 2022)](https://arxiv.org/abs/2106.09685)
- [He et al., Towards a Unified View of Parameter-Efficient Transfer Learning (ICLR 2022)](https://arxiv.org/abs/2110.04366)
- [Chen et al., Parameter-Efficient Fine-Tuning Design Spaces (ICLR 2023)](https://arxiv.org/abs/2301.01821)
- [Schick & Schütze, Exploiting Cloze Questions for Few Shot Text Classification and NLI (EACL 2021)](https://arxiv.org/abs/2001.07676)
- [Gao et al., Making Pre-trained Language Models Better Few-shot Learners (ACL 2021)](https://arxiv.org/abs/2012.15723)
- [Li & Liang, Prefix-Tuning (ACL 2021)](https://arxiv.org/abs/2101.00190)
- [Liu et al., P-Tuning v2 (ACL 2022)](https://arxiv.org/abs/2110.07602)
- [huggingface/peft（GitHub）](https://github.com/huggingface/peft)
