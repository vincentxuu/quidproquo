---
title: "台大 ADL 2025 助教課：從 PyTorch、Hugging Face 到 LoRA、量化與 vLLM 部署"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, pytorch, hugging-face, lora, moe, quantization, vllm]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 2025 Fall 導讀"
  order: 18
tldr: "ADL Fall 2025 課程頁排了 7 堂助教課：Dev Infra（PyTorch、Debugging）→ NLP 專案的一生 → NLP 專案的底層邏輯 → LLM LoRA Training → LLM Basics／Architecture／MoE → LLM Inference & Evaluation → LLM Deployment。10 支影片全部是林彥廷在 2023 與 2024 年錄的舊片，Fall 2025 沿用；課程頁上的 5 份講義連結都 404，同名檔在 Fall 2024 路徑可以打開，Deployment 只有影片。前三堂把 Hugging Face 的「資料→模型→Demo」流程走一遍，正好是 HW1 需要的工具；後四堂補 LLM 的訓練、推論與上線。"
description: "導讀台大陳縕儂 ADL Fall 2025（114-1）的 7 堂助教課：10 支助教影片、5 份助教講義（f113 路徑同名檔）與 2 份 Colab。內容涵蓋 Colab 與 PyTorch tensor、ipdb 除錯、NLP 專案生命週期與 train／validation／test 切分、Hugging Face Trainer 與 Gradio、四種 NLP 任務的資料格式、LoRA 與 QLoRA、scaling law 與 MoE 路由、AWQ／GPTQ 量化、MMLU／MT-Bench／Chatbot Arena 評估，以及用 vLLM 做 offline 推論、tensor parallel 與 OpenAI 相容 API。"
draft: false
glossary:
  - term: "QLoRA"
    definition: "把凍結的預訓練權重先量化成 4-bit 存放，再在上面訓練 LoRA 的低秩矩陣；目的是連預訓練權重本身占的記憶體也一起壓下來。"
    context: "LoRA 助教講義第 18 頁先指出 LoRA 的限制（預訓練權重仍占大量記憶體），接著第 21–27 頁講 QLoRA。"
  - term: "MoE"
    aliases: ["Mixture of Experts", "混合專家模型"]
    definition: "把 Transformer 的前饋層換成多個「專家」，由 router 替每個 token 只挑少數幾個專家計算；總參數很多，但每個 token 實際用到的參數少。"
    context: "LLM Basics & MoE 助教講義第 18–33 頁：dense vs MoE、共享專家、token dropping、負載平衡、expert choice 路由與 Mixture-of-Depths。"
  - term: "AWQ"
    aliases: ["Activation-aware Weight Quantization"]
    definition: "一種訓練後量化方法：挑選縮放係數時，以「量化後 activation 的誤差最小」為目標，而不是只看權重本身，所以需要一小批校正資料。"
    context: "Inference & Eval 助教講義第 12–15 頁，標為 Data Dependent；同講義也講 GPTQ。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **本文依據 ADL Fall 2025（114-1，2025/09/01–12/15）。** 這是[台大陳縕儂 深度學習之應用 2025 Fall 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)系列的第 18 篇，也是最後一篇。講課篇只放助教課連結，助教課的內容集中在這裡講。

[ADL Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)的課表每一週分成 Lecture 與 Recitation 兩欄。講課負責原理，助教課負責「怎麼真的跑起來」。[Course Logistics 投影片](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf)第 6 頁把助教課的範圍寫成七項：開發環境與工具（Colab、GPU、PyTorch）、DL 工作流程、Hugging Face 基礎、LLM 架構、LLM 評估、LLM 訓練、LLM 推論。

這篇回答一個問題：**講課講原理，助教課補了哪些動手能力？** 讀完你會知道 7 堂助教課的順序、每堂在教什麼工具、哪些檔案還打得開，以及它們和三份作業在時間上怎麼對齊。

**本文依據**：課程頁 Recitation 欄、10 支助教影片（YouTube 標題與說明欄）、5 份助教講義 PDF（Fall 2024 路徑同名檔）、2 份助教 Colab，以及 Deployment 影片的 YouTube 自動字幕。全部在 2026-09-30 打開核對。

## 課程影片來源

以下影片已於 2026-10-10 對照官方課程頁與官方 YouTube 播放清單（講次編號與標題相符）；不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=zuiACAhRUzA
title: ADL TA Recitation: PyTorch Tutorial 一步步上手深度學習（YouTube）
```

```youtube
url: https://www.youtube.com/watch?v=RYkEoCkJWeA
title: ADL TA Recitation: PyTorch Debugging 有BUG怎麼辦!?（YouTube）
```

原始影片：[ADL TA Recitation: PyTorch Tutorial 一步步上手深度學習（YouTube）](https://www.youtube.com/watch?v=zuiACAhRUzA)、[ADL TA Recitation: PyTorch Debugging 有BUG怎麼辦!?（YouTube）](https://www.youtube.com/watch?v=RYkEoCkJWeA)、[ADL TA Recitation: NLP Project Lifecycle NLP專案的一生（YouTube）](https://www.youtube.com/watch?v=anK1_PK464k)、[ADL TA Recitation: Underlying Logic of NLP Projects NLP專案的底層邏輯（YouTube）](https://www.youtube.com/watch?v=255ZzsTTHoU)、[ADL TA Recitation: LLM LoRA Training 大型語言模型太大怎麼調整呢?（YouTube）](https://www.youtube.com/watch?v=eGQMzbhokg0)、[ADL TA Recitation: LLM Basics 大型語言模型基礎概念（YouTube）](https://www.youtube.com/watch?v=BBw-ki4_06o)、[ADL TA Recitation: Transformer Architecture 各種 Dense 模型架構的小技巧（YouTube）](https://www.youtube.com/watch?v=TzhCZOILzlI)、[ADL TA Recitation: Mixture-of-Experts (MoE) Architecture 混合專家模型的架構（YouTube）](https://www.youtube.com/watch?v=AgZuF7lsu-8)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

查核日期：2026-10-10。

字幕嘗試（2026-10-10）：嵌入的兩支 PyTorch 助教影片（Tutorial 17:45、Debugging 11:46）在 YouTube 上沒有可取得的字幕，影片內容未核對；文章對這兩支的說法來自助教 Colab。確認的中介資料：兩支都是 2023-09-07 上傳，說明欄寫 2023/09/07、Lectured by Yen-Ting Lin 林彥廷，與文章「2023 年秋季、林彥廷講授」一致。文中其他助教影片（含依自動字幕整理的 Deployment）未嵌入，這次未重新核對。

## 先看全貌

| 週次 | 助教課 | 影片（時長） | 講義 | 同週講課 |
|---|---|---|---|---|
| 9/01 | Dev Infra & Tooling | [PyTorch](https://youtu.be/zuiACAhRUzA)（17:45）、[Debugging](https://youtu.be/RYkEoCkJWeA)（11:46） | 無，改用 [Colab](https://colab.research.google.com/drive/1yoyDg3411OyddX5fPGomtGe3_0Kz77qT) | Sequence Modeling |
| 9/08 | NLP Lifecycle | [Step by Step](https://youtu.be/anK1_PK464k)（36:10） | [w2-ProjLife.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w2-ProjLife.pdf)（46 頁）＋[Colab](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ) | Attention、Transformer、Tokenization、BERT；HW1 公布 |
| 9/15 | Underlying Logics of Projects | [Step by Step](https://youtu.be/255ZzsTTHoU)（24:00） | [w3-UnderlyLogic.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w3-UnderlyLogic.pdf)（43 頁） | Pretraining & Prompt Learning |
| 9/22 | LLM LoRA Training | [LoRA](https://youtu.be/eGQMzbhokg0)（18:15） | [w5-LoRA.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w5-LoRA.pdf)（30 頁） | Post-Training、LLM Adaptation；HW2 公布 |
| 10/13 | LLM Basics & MoE | [Basics](https://youtu.be/BBw-ki4_06o)（20:16）、[Architecture](https://youtu.be/TzhCZOILzlI)（11:15）、[MoE](https://youtu.be/AgZuF7lsu-8)（23:17） | [w4-LLMBasicsMOE.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w4-LLMBasicsMOE.pdf)（33 頁） | RAG；HW3 公布 |
| 10/27 | LLM Inference & Evaluation | [Infer & Eval](https://youtu.be/mulWMLla-AM)（17:00） | [w6-LLMInferenceEval.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w6-LLMInferenceEval.pdf)（37 頁） | NLG Decoding、NLG Evaluation |
| 11/03 | LLM Deployment | [Deployment](https://youtu.be/4JPJkLxW84w)（22:34） | 無 | Issues in Pre-Trained Models；期末專題公布 |

兩個順序上的細節：

- 講義檔名的週次（w2–w6）來自舊學期。Fall 2025 把 LoRA（w5）排在 9/22，比 LLM Basics & MoE（w4）的 10/13 還早。本文照 Fall 2025 課程頁的順序走。
- 9/29、10/06 是教師節與中秋節，10/20 是期中停課，這三週沒有助教課。11/10 以後的課表也沒有再排助教課。

## 讀之前要知道：影片與講義都是舊學期的

這是這條支線最重要的背景。10 支影片的 YouTube 說明欄都寫「Lectured by Yen-Ting Lin 林彥廷 @ NTU CSIE」，錄製日期則分成兩批：

- **2023 年秋季**：PyTorch 與 Debugging（2023/09/07）、NLP Lifecycle（2023/09/21）、Underlying Logic（2023/10/05）、LoRA（2023/11/16）、Inference & Evaluation（2023/11/30）
- **2024 年秋季**：LLM Basics、Architecture、MoE（2024/10/09），Deployment（2024/12/04）

講義也一樣。w2 封面寫「ADL 2023 Fall - Recitation 2」，w4 封面寫「Sep 30, 2024」，w5 與 w6 封面分別是 2023 年 11 月 16 日與 30 日。Fall 2025 課程頁沿用這些材料，沒有重錄。

這對讀者有兩個實際影響。第一，投影片裡提到的作業是當年的作業，例如 w5 第 4 頁寫「Homework 3 Instruction tuning」，那是 2023 年的 HW3，不是 Fall 2025 的 HW3（RAG）。第二，影片裡示範的套件版本停在 2023–2024 年，照著跑時要有改 API 的心理準備（後面各段會指出具體的地方）。

## 1. Dev Infra & Tooling：Colab、tensor 與 ipdb（9/01）

這堂沒有投影片，教材是一份 30 格的 [Colab](https://colab.research.google.com/drive/1yoyDg3411OyddX5fPGomtGe3_0Kz77qT)，標題是「Recitation on Development Infrastructure and PyTorch Tutorial」，目錄分四段：

1. **Google Colab 基礎**：掛載 Google Drive、列出雲端硬碟檔案、確認 PyTorch 版本。
2. **Colab 的 GPU 環境**：用 `torch.cuda.is_available()` 確認有沒有拿到 GPU。
3. **PyTorch 入門**：1D tensor（`arange`、`rand`、`randn`、`ones`、`zeros`、從 list 建、`clone`）、`requires_grad` 與 `torch.no_grad()`、多維 tensor 的形狀、和 NumPy 互轉。
4. **Python 除錯工具**：以 ipdb 為主。

除錯段落的分類很直接：語法錯誤丟給 ChatGPT，執行期錯誤與 tensor 錯誤用 ipdb，GPU 相關錯誤留到下一堂。筆記本用中文整理了 `n`、`c`、`q`、`p`、`l`、`s` 六個常用指令，還有 `python -m ipdb -c continue`、條件式 `ipdb.set_trace()`、`ipdb.launch_ipdb_on_exception()` 幾種用法。最後用一個 `SimpleMLP` 迴歸範例當練習對象。

建議把那個範例當成除錯練習來跑：模型輸出的形狀是 `(batch, 1)`，標籤 `y` 是 `(batch,)`。在 `loss = criterion(outputs, batch_y)` 前面下一個斷點，用 `p outputs.shape` 對一下兩邊的形狀，正好是這堂課想教的「tensor 錯誤」。

兩支影片分別是 [PyTorch Tutorial 一步步上手深度學習](https://youtu.be/zuiACAhRUzA)與 [PyTorch Debugging 有BUG怎麼辦!?](https://youtu.be/RYkEoCkJWeA)。沒寫過 PyTorch 的讀者，這堂應該排在讀[第 2 篇：神經網路與反向傳播](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop)之前或同時。

## 2. NLP 專案的一生：資料 → 模型 → Demo（9/08）

[w2-ProjLife.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w2-ProjLife.pdf) 開頭寫這堂要學兩件事：從資料、模型開發到 Demo 的流程，以及常用工具與套件。整份講義用「資料 → 模型 → Demo」三格圖反覆定位。

**資料**分成收集、清洗與驗證、標注三步。收集的來源列了網路爬蟲、客戶資料、自行生成與 GPT-4。

**模型**這段先問「NLP 可以做什麼」，再把任務收斂成幾種形狀：

- 分類整句：情感分析、垃圾郵件偵測、意圖偵測
- 分類句中每個詞：詞性、命名實體
- 生成文本：自動回覆、填空
- 從文本中抽取答案：給問題和上下文，找出答案片段

**切資料**是這份講義最值得記住的一頁（第 31–38 頁）。訓練集「可以看」，驗證集「不可以看」、用來在訓練中檢查，測試集「絕對不可以看」、只在訓練後驗證。比例是訓練集最多，驗證集與測試集各約 10–30%。

實作用的是舊作業的意圖分類資料（講義連到 GitHub 上 2021 年 ADL HW1 的 `data/intent`），只做「分類整句」。工具方面講義寫「萬事用 Huggingface」，Demo 用 Gradio，示範站是 [twllm.com](http://twllm.com)。

配套的 [NLP Lifecycle Colab](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ)（68 格）改寫自 Hugging Face 的「Fine-tuning a model on a text classification task」範例：

1. 用 `load_dataset("yentinglin/ntu_adl_recitation")` 載入資料，把 `intent` 欄改名成 `label` 並編碼成類別
2. 用 `distilbert-base-uncased` 的 `AutoTokenizer` 做前處理，`dataset.map(..., batched=True)` 套到所有切分
3. `AutoModelForSequenceClassification` 加上 `Trainer`：learning rate 2e-5、5 個 epoch、每個 epoch 評估一次，以 accuracy 挑最佳模型
4. `trainer.push_to_hub()` 上傳，最後一格是 Gradio Demo 的樣板

這份筆記本寫於舊版套件，現在照跑可能遇到幾個地方要改：`datasets` 的 `load_metric`（新版改用獨立的 `evaluate` 套件）、`TrainingArguments` 的 `evaluation_strategy`（新版改名為 `eval_strategy`）。最後的 Gradio 格也只是樣板，模型名稱寫著「你的模型」、`fn=...` 要自己補，`pipeline` 的 task 也要改成你的任務。

## 3. NLP 專案的底層邏輯：四種任務各怎麼準備資料（9/15）

[w3-UnderlyLogic.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w3-UnderlyLogic.pdf) 封面寫「應用深度學習 - 實作三」，目標是「如何準備四大任務的資料、訓練、預測」與「使用 Huggingface 生態系」。上一堂只做了分類整句，這堂把其他任務補齊：

| 任務 | 講義頁 | 重點 |
|---|---|---|
| 分類整句 | 回顧 | 上一堂的做法 |
| 分類句中每個詞 | 第 10–25 頁 | 去 [Hugging Face Datasets](https://huggingface.co/datasets) 找資料、看每個 token 對應的標籤欄位、怎麼訓練、用 Gradio 做 Demo |
| 文本生成（摘要） | 第 33–36 頁 | 資料格式與訓練 |
| 抽取式問答 | 第 38–42 頁 | 資料格式與訓練 |

講義裡「怎麼訓練？」的頁面多半是程式碼截圖，文字層抽不出來，細節要看[影片](https://youtu.be/255ZzsTTHoU)。

抽取式問答這段對 Fall 2025 的讀者特別有用。[HW1 中文抽取式問答](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa)要做的 span selection，就是這一段的任務形狀。建議先看完這堂，再去讀 HW1 規格。

## 4. LLM LoRA Training：模型太大怎麼調（9/22）

[w5-LoRA.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w5-LoRA.pdf) 把 LLM 開發畫成「預訓練 → instruction tuning → learning from feedback」三段，LoRA／QLoRA 標在 instruction tuning 那一段。講義的推進是一條「記憶體」主線：

1. **先問跑不跑得動**：第 5–6 頁引 Hugging Face Space「Can it run LLM」，估算模型需要多少記憶體。
2. **為什麼低秩就夠**：語言模型的 intrinsic dimensionality 很低，所以用少量資料就能有效微調。接著用兩頁複習矩陣的 rank。
3. **LoRA 本體**：原本的權重 W 是 d×d，另外加兩個矩陣 A（d×r）與 B（r×d），r 通常在 1 到 32 之間。好處列三點：記憶體少、預訓練權重不用算梯度、LoRA 權重可以插拔。
4. **怎麼選**：套在哪些權重矩陣、rank 取多少、和其他 PEFT 方法在 GPT-3 上的比較，都直接引 LoRA 論文。
5. **LoRA 的限制**：預訓練權重本身仍然占大量記憶體。
6. **QLoRA**：先介紹浮點格式（含 FP8），再講 QLoRA 怎麼把凍結權重量化後再訓練 LoRA。

最後一頁「How to use (Q)Lora?」之後的操作示範不在 PDF 裡，要看[影片](https://youtu.be/eGQMzbhokg0)。

時間上，這堂和講課的 LLM Adaptation（7.5）同一週，也和 HW2 公布同週。Fall 2025 的 HW2 題目是「LLM Tuning and Prompt Tuning for Classical Chinese Translation」，但規格沒有公開，所以不能確定這堂的內容就是 HW2 的解法。講課端的 LoRA 原理見[第 10 篇：PEFT＋HW2](/posts/ai/2026-09-30-ntu-adl2025-peft-lora-hw2)。

## 5. LLM Basics、Transformer 架構與 MoE（10/13）

[w4-LLMBasicsMOE.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w4-LLMBasicsMOE.pdf) 對應三支影片，分成三塊。

**LLM Basics**（[影片](https://youtu.be/BBw-ki4_06o)，講義第 2–14 頁）講規模：scaling law、emergent abilities（「小模型沒有、大模型才出現的能力」）、訓練計算量的估算公式「FLOPs ≈ 6 × 參數量 × token 數」，並拿 Taiwan-LLM 和 GPT-4 對照。接著是 Chinchilla 的問題設定：固定計算預算下，模型大小和訓練 token 數要怎麼分配；再引 Llama 3 論文的圖，討論預訓練 loss 能不能當下游表現的指標。

**Transformer Architecture**（[影片](https://youtu.be/TzhCZOILzlI)，第 15–16 頁）只有一頁清單：RMSNorm、Rotary Positional Encoding、KV-Cache、Group Query Attention、SwiGLU。講義在「Vanilla Transformers vs LLaMA」旁邊註明要看去年的實習課影片，所以細節都在影片裡。

**MoE**（[影片](https://youtu.be/AgZuF7lsu-8)，第 17–33 頁）是這份講義篇幅最大的部分：

- 開源權重 MoE 模型一覽（Mixtral、Grok-1、DBRX、Arctic）與 dense vs MoE 的對照
- 共享專家（引 DeepSeekMoE）、attention 層也做 MoE（引 JetMoE）
- Token 先決的路由：token 太多塞不下時會被丟掉（token dropping），所以需要負載平衡 loss（引 Switch Transformers，第 27 頁有手算例子）
- Token 先決的問題：負載不平衡、balancing loss 不穩定、每個 token 用的計算量都一樣
- 對應的兩個改法：專家先決（expert choice routing），以及讓 token 跳層的 Mixture-of-Depths

## 6. LLM Inference & Evaluation：量化與三種評估（10/27）

[w6-LLMInferenceEval.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w6-LLMInferenceEval.pdf) 前半講推論加速，後半講評估。

推論加速的大綱列了五項：Quantization、AWQ、GPTQ、PagedAttention、FlashAttention。實際展開的只有量化，後兩項只出現在大綱頁。

- 訓練後量化分兩條路：GPU 上用 AWQ、GPTQ，CPU 上用 GGUF／GGML。
- 第 7–11 頁用「量化到 2 bits」的手算例子，說明 round-to-nearest 和先縮放再量化的差別。
- **AWQ**：挑一個讓 activation 誤差最小的縮放係數，需要校正資料。
- **GPTQ**：逐層壓縮，以每一層的 reconstruction loss 為目標，同樣需要資料。

評估分三類：

| 類型 | 講義舉例 |
|---|---|
| 傳統 benchmark | MMLU、TruthfulQA |
| 模型當評審 | MT-Bench、AlpacaEval |
| 人類評估 | Chatbot Arena |

講課端同一週講 NLG 的評估指標（BLEU、ROUGE、perplexity、LLM-Eval），見[第 12 篇：NLG 解碼與評估](/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation)。兩邊合起來看，一邊是「句子生成得好不好」，一邊是「整個模型能力到哪裡」。

## 7. LLM Deployment：用 vLLM 把模型端上線（11/03）

這堂沒有講義，只有 [LLM Deployment 手把手教你如何部署大型語言模型](https://youtu.be/4JPJkLxW84w)這支影片。以下依影片的 YouTube 自動字幕整理，自動字幕有辨識錯字，只取主線。

影片用 [vLLM](https://github.com/vllm-project/vllm) 示範部署 Llama 3 的 8B 與 70B 兩個版本，機器是兩張 80GB 的 H100。8B 一張卡就綽綽有餘；70B 用 BF16 載入時每個參數要 2 bytes，超過一張卡，所以拿來示範平行化。內容依序是：

1. **安裝與參數**：新一點的 NVIDIA GPU 直接裝即可。講者常調的只有三個參數：`dtype`（舊卡不支援 BF16 時要改 FP16，這是第一個常見的坑）、`enforce_eager`（關掉 CUDA Graph 省一點記憶體、換一點速度），以及量化。講者的建議是：記憶體不夠時，與其調一堆參數，不如直接做 FP8 或 AWQ 量化。
2. **Offline vs Online**：offline 是 prompt 事先都知道的批次推論，常見於研究與資料處理，整體 throughput 比較高；online 是像 twllm.com 那樣，不知道使用者什麼時候會打什麼。
3. **Sampling 參數的坑**：`max_tokens` 的預設值很小，一定要調大。另外可以調 temperature、top-p、top-k、min-p。
4. **先驗證輸出**：先 offline 推論一兩筆，確認輸出合理，避免 tokenizer、模型或浮點格式載錯而不自知。
5. **多卡**：推論常用 tensor parallel（把矩陣切到多張卡上，靠通訊合併結果）；pipeline parallel 通常只在跨節點、單機塞不下時才用。使用者端只要把 tensor parallel size 設成 GPU 數。
6. **Online serving**：用 `vllm serve` 起服務，前面是接收 HTTP 請求的網頁伺服器，後面是 LLM 推論引擎。用戶端沿用 OpenAI 套件，只把 API base 換成自己的位址，也就是 OpenAI 相容 API。講者也提到線上服務要在延遲（latency）與吞吐量（throughput）之間取捨。

這堂和 HW 沒有直接對應。它比較像期末專題與實際工作會用到的最後一哩。

## 助教課和作業怎麼對

課程頁沒有寫「哪堂助教課對應哪份作業」。助教表只寫分工：兩位助教負責 HW1／HW2，兩位負責 HW3，兩位負責期末專題。下表是依「同一週」排出來的時間對齊，不是官方對應：

| 作業 | 公布週 | 同週或之前的助教課 | 公開程度 |
|---|---|---|---|
| HW1 中文抽取式問答 | 9/08 | Dev Infra、NLP Lifecycle；下一週的 Underlying Logic 講抽取式問答的資料格式 | 規格完整公開 |
| HW2 LLM Tuning＋Prompt Tuning（文言文翻譯） | 9/22 | LLM LoRA Training | 只有說明影片 |
| HW3 Retriever & Reranker Training for RAG | 10/13 | LLM Basics & MoE | 只有說明影片 |
| 期末專題（Jailbreaking Olympics） | 11/03 | LLM Deployment | 只有說明影片 |

## 存取與缺口

整個系列的分級是 A2（依[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的定義：教材部分開放）。只看助教課這條線，影片與 Colab 完整，講義要繞路：

1. **課程頁的 5 份講義連結全部 404。** 課程頁連的是 `f114-adl/doc/w2-ProjLife.pdf` 等路徑，2026-09-30 打開都回傳 404。本文引用的是 Fall 2024 路徑（`f113-adl/doc/`）下的同名檔，5 份都能打開。
2. **Deployment 沒有講義**，只能看影片。
3. **Dev Infra 沒有講義**，只有 Colab。
4. **影片與講義都是 2023–2024 年的版本**，裡面提到的作業編號與內容屬於當年。
5. 講義裡多數程式碼是截圖，要搭配影片看。

## 怎麼用這篇

- **完全沒寫過 PyTorch**：先跑 Dev Infra Colab，再讀[第 1 篇](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction)與[第 2 篇](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop)。
- **準備做 HW1**：讀完[第 6 篇 BERT](/posts/ai/2026-09-30-ntu-adl2025-bert-family) 後，依序看 NLP Lifecycle 與 Underlying Logic 兩堂，再進 [HW1](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa)。
- **只想補 LLM 工程**：直接看後四堂，順序可以改成 Basics & MoE → LoRA → Inference & Eval → Deployment，也就是舊學期講義檔名 w4→w5→w6 的順序。

今晚可以做的一件事：打開 [NLP Lifecycle Colab](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ)，把 `evaluation_strategy` 改成 `eval_strategy`、把 `load_metric` 換成 `evaluate.load`，跑到 `trainer.train()` 為止。能跑完，代表你的環境已經準備好做 HW1。

## 延伸閱讀

- [CMU 11-868 LLM Systems 導讀](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)：把本篇後四堂的主題（LoRA、量化、MoE、serving）講到系統層。個別單元見 [PEFT 與 LoRA](/posts/ai/2026-09-30-cmu11868-peft-lora)、[模型量化](/posts/ai/2026-09-30-cmu11868-model-quantization)、[Model Parallel 與 MoE](/posts/ai/2026-09-30-cmu11868-model-parallel-moe)、[SGLang 與 vLLM](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm)。
- [Stanford CS336 導讀](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch)：從零實作語言模型，[Attention 變體與 MoE](/posts/ai/2026-08-22-cs336-attention-moe) 與[推論](/posts/ai/2026-08-22-cs336-inference)兩篇和第 5、7 堂重疊。
- [CS224N：Tinker 與 LoRA](/posts/ai/2026-08-22-cs224n-tinker-lora)：另一門課的 LoRA 實作。

---

上一篇：[第 17 篇：超越監督學習與多模態](/posts/ai/2026-09-30-ntu-adl2025-beyond-supervised-multimodal)
系列總覽：[台大陳縕儂 深度學習之應用 2025 Fall 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方課程頁、播放清單的講次相符。
- 2026-10-10：嘗試依字幕核對兩支 PyTorch 助教影片，但取不到字幕，內容未核對；確認錄製日期與講者與文章一致。

## 參考資料

- [ADL Fall 2025（114-1）課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — 課表 Recitation 欄、助教分工表
- [Course Logistics 投影片（250901_Course.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) — 第 6 頁助教課範圍
- [助教 Colab：Dev Infra & Tooling](https://colab.research.google.com/drive/1yoyDg3411OyddX5fPGomtGe3_0Kz77qT)
- [助教 Colab：NLP Lifecycle（text classification fine-tuning）](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ)
- [w2-ProjLife.pdf：NLP 專案的一生（Fall 2024 路徑同名檔）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w2-ProjLife.pdf)
- [w3-UnderlyLogic.pdf：NLP 專案的底層邏輯（Fall 2024 路徑同名檔）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w3-UnderlyLogic.pdf)
- [w4-LLMBasicsMOE.pdf：LLM Basics and MoE Architecture（Fall 2024 路徑同名檔）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w4-LLMBasicsMOE.pdf)
- [w5-LoRA.pdf：LLM LoRA Training（Fall 2024 路徑同名檔）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w5-LoRA.pdf)
- [w6-LLMInferenceEval.pdf：LLM Inference and Eval（Fall 2024 路徑同名檔）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w6-LLMInferenceEval.pdf)
- [ADL TA Recitation: PyTorch Tutorial 一步步上手深度學習（YouTube）](https://youtu.be/zuiACAhRUzA)
- [ADL TA Recitation: PyTorch Debugging 有BUG怎麼辦!?（YouTube）](https://youtu.be/RYkEoCkJWeA)
- [ADL TA Recitation: NLP Project Lifecycle NLP專案的一生（YouTube）](https://youtu.be/anK1_PK464k)
- [ADL TA Recitation: Underlying Logic of NLP Projects NLP專案的底層邏輯（YouTube）](https://youtu.be/255ZzsTTHoU)
- [ADL TA Recitation: LLM LoRA Training 大型語言模型太大怎麼調整呢?（YouTube）](https://youtu.be/eGQMzbhokg0)
- [ADL TA Recitation: LLM Basics 大型語言模型基礎概念（YouTube）](https://youtu.be/BBw-ki4_06o)
- [ADL TA Recitation: Transformer Architecture 各種 Dense 模型架構的小技巧（YouTube）](https://youtu.be/TzhCZOILzlI)
- [ADL TA Recitation: Mixture-of-Experts (MoE) Architecture 混合專家模型的架構（YouTube）](https://youtu.be/AgZuF7lsu-8)
- [ADL TA Recitation: LLM Inference & Evaluation 使用與評估語言模型（YouTube）](https://youtu.be/mulWMLla-AM)
- [ADL TA Recitation: LLM Deployment 手把手教你如何部署大型語言模型（YouTube）](https://youtu.be/4JPJkLxW84w)
- [vLLM（GitHub）](https://github.com/vllm-project/vllm)
- [Hu et al. (2021). LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)
- [Dettmers et al. (2023). QLoRA: Efficient Finetuning of Quantized LLMs](https://arxiv.org/abs/2305.14314)
