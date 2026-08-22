---
title: "CS221 Lecture 1：Overview：用資源限制定義智慧"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: zh-TW
series:
  name: "Stanford CS221 導讀"
  order: 2
tldr: "Stanford CS221 Autumn 2025 第 1 講，從 Overview：用資源限制定義智慧建立可操作的 AI 問題表示與演算法直覺。"
description: "逐講讀 Stanford CS221 Autumn 2025 Lecture 1，依官方可執行講義整理核心 agenda、例子與限制。"
draft: true
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs221-lecture-01-overview-intelligence-tensors-en)

本篇對應 **Stanford CS221, Autumn 2025, Lecture 1**，由 Percy Liang 主講，日期標示為 2025-09-22。閱讀範圍只包括三份公開 executable artifacts：`welcome.py`、`history.py`、`tensors.py`。課程入口在[官方網站](https://stanford-cs221.github.io/autumn2025/)，本講 trace 入口是 [welcome, history, tensors](https://stanford-cs221.github.io/autumn2025-lectures/?trace=welcome)。下文不把 Canvas-only 的課堂互動當證據，也不補寫來源沒有提供的結論。

## 這一講的 agenda

這個順序先定義 agent 的問題，再看歷史上的表示與演算法，最後用 tensor 操作檢查 shape、狀態和成本；CS221 先問如何表示，再問如何 inference 或 learning。

## Welcome：智慧由能力和限制共同定義

`welcome.py` 從身邊的 AI 開始：ChatGPT、Claude、Gemini、Grok 等 AI assistants；Waymo、Wayve 等 autonomous vehicles；Deep Blue、AlphaGo、AlphaStar 等 game-playing systems；IMO、IOI、ICPC 等競賽數學與程式；以及 AlphaFold 的 3D protein structure prediction。它們功能不同，正好逼出問題：AI 到底是什麼？Artificial 可以先理解成在 computer 或 robot 上運作，但 intelligence 不能靠一句「像人」來定義。

講義改問：一個 intelligent agent 應該能做哪些事？四種 ingredients 是 **perceive、reason、act、learn**。Perceive 是處理 raw inputs，例如 visual scene understanding、speech recognition、natural language understanding。Reason 是用 knowledge 加 percepts 對世界作 inference：例子包括 deterministic world 的 uniform cost search、不確定決策的 value iteration、adversarial games 的 minimax、Bayesian networks 的 probabilistic inference。Act 是輸出影響世界的 actions，包括 text/image generation、speech synthesis、robot manipulation。Learn 是依 experience 更新 agent，包括 gradient descent、reinforcement learning 的 Q-learning、Bayesian networks 的 expectation maximization。

Driving 圖例把四者放在同一情境中：車先從感測輸入理解 scene，再以知識和 percepts 推理，輸出駕駛 action，並從 experience 更新。這不是說自駕車是 AI 的唯一形式，而是讓能力的分工可見。

所有能力都受 **resource constraints** 限制。Computation 包括 running time，也包括 memory 和 communication；information 包括 data、experience，以及某個情境裡可取得的 inputs。於是問題不只是「能不能找出答案」，還要問能否在可用的時間、記憶體、通訊和資料下做出足夠好的決策。講義 summary 因此說，我們要發展 compute-efficient、data-efficient 的 algorithms。

## Goals：agent 要替誰完成什麼

能力不等於目的。講義接著問 developer 想讓 agent 達成什麼：Agent 會編碼 values、goals、objectives 或 utility functions，alignment 要讓它們對應 developer 真正想要的結果；ChatGPT 例子包括 informative、avoid hallucinations、refuse harmful queries。對 society 的 impact 也必須追問，因為 privacy、copyright、jobs、inequality、geopolitics 涉及誰是「我們」、不同 values 的 tradeoffs，以及 social media、education 等 unintended consequences。

## 課程哲學與 executable lecture

本課程結合 timeless foundations、modern examples 與 learn by doing；Autumn 2025 改為 **tensor-native**，涵蓋 deep learning、value iteration、Bayesian network inference，刪除 constraint satisfaction problems，並深入 copyright、supply chains、policy 等 societal impact。policies、coursework、schedule 都在[官方網站](https://stanford-cs221.github.io/autumn2025/)。材料也是 *executable lecture*：loop 讓 `total` 由 0 加上 1、2、3 成為 6，示範 code 的 hierarchical structure、精確性，以及 build AI 最終仍要寫 code。

## History：三條傳統與資源限制

### Turing test

`history.py` 從 Turing 1950 paper 的「Can machines think?」轉向可操作的「How could you tell?」，以 Imitation Game 把哲學問題 grounding 成 measurement；來源沒有稱它為唯一或完美定義。

### Symbolic AI

1956 年 John McCarthy 在 Dartmouth College 組織 workshop，召集 Shannon、Minsky 等 thinkers，目標是在兩個月取得 “significant advance”，並 coined “artificial intelligence”。早期例子還包括：1952 年 Arthur Samuel 的 checkers program 會學習 weights，達到 strong amateur level；1955 年 Newell、Simon 的 Logic Theorist 用 search 加 heuristics，為 *Principia Mathematica* 找出新的 theorem proof。

早期預測非常樂觀，但 search space 的指數成長暴露 limited computation，世界中大量 words、objects、concepts 則暴露 limited information。1966 年 ALPAC report cut off government funding，形成 first AI winter；這一時期仍留下 Lisp、garbage collection 與 time-sharing。

1970s–80s 的 knowledge-based systems 以 expert systems 補足 knowledge。它們從 experts 萃取特定 domain rules。DENDRAL 由 mass spectrometry 推斷 molecular structure；MYCIN 診斷 blood infections、建議 antibiotics；XCON 把 customer orders 轉成 parts specification。優點是 knowledge 同時幫助 information 和 computation gap，也首次有 real application 影響 industry。缺點是 deterministic rules 無法處理 real-world uncertainty，且規則很快變得複雜難維護。1987 年 Lisp machines collapse，帶來 second AI winter。

### Neural AI

神經路線從 McCulloch/Pitts 連結 neural circuitry 與 logic 開始，經 Hebbian learning、Perceptron 與 ADALINE；Minsky/Papert 指出 linear models 不能解 XOR 後研究受挫。復甦則經 Neocognitron、backpropagation 與 LeCun 的 CNN，但 2000s 初仍難訓練。

Deep learning 的 milestones 是：2006 Hinton 等人的 unsupervised layerwise pre-training；2009 neural networks 超過 Hidden Markov Models 的 speech recognition；2012 AlexNet 在 object recognition 取得巨大增益；2014 sequence-to-sequence modeling 和 Adam optimizer；2015 attention mechanism；2016 AlphaGo 用 deep reinforcement learning 擊敗 Lee Sedol；2017 Transformer architecture。這是來源列出的時間線，不是把成果簡化成單一原因。

### Statistical AI

統計路線把 linear regression、linear classification、stochastic gradient descent、uniform cost search 與 Markov decision processes 串起來；後續再加入 Bayesian networks、support vector machines、variational inference、conditional random fields 與 topic modeling。共同點是以 optimization、probability 與 generalization 的語言處理 uncertainty，而不是一套單一模型。

## Foundation models、reasoning、industrialization

### Pretrained language models

ELMo 用 LSTMs pretrain，再 fine-tune 到 downstream tasks；BERT 用 Transformer pretrain，再 fine-tune；Google T5（11B）把 everything cast 成 text-to-text。來源對三者都附有論文連結，T5 另有圖片。

### Scaling up

GPT-2 產生 fluent text，出現 zero-shot capabilities 的 first signs；scaling laws 帶來 scaling 的 hope 和 predictability；GPT-3 展示 in-context learning 且 closed；Chinchilla 提出 compute-optimal scaling laws；清單也列出 Llama 3、DeepSeek v3。來源沒有提供統一 benchmark，所以不能從這串名字推導未寫出的排名。

### Reasoning 與 industrialization

講義的 reasoning 段落說，回答 hard questions requires thinking；language models 在 response 前產生 “thoughts”；例子是 OpenAI o1–o4 與 DeepSeek r1。本文不替 artifact 補上架構或效果宣稱。

Industrialization 以幾個帶有保留語氣的報導數字呈現規模：GPT-4 **supposedly** 有 1.8T parameters；GPT-4 **supposedly** 花費 $100M training cost；xAI 建置 200,000 張 H100 的 cluster 訓練 Grok；Stargate（OpenAI、NVIDIA、Oracle）宣稱四年投資 $500B。來源隨即提醒，frontier models 如何建造並沒有公開細節，並引用 GPT-4 technical report。它的結論是 AI 已從 research 進入 businesses 和 public policy，但 research 仍遠未結束。

### AI 是 melting pot

最後一節回顧三條傳統的 battles：Minsky/Papert 推動 symbolic AI 並使 neural research 受挫；2000s statistical ML 也曾認為 neural networks 已死。但還有 deeper connections：McCulloch/Pitts 的 neural-network paper 其實討論 logical operations；Go 由 symbols 定義，卻靠 deep neural networks 發揮能力；deep learning 從 perception 轉向 reasoning，也碰到 symbolic AI 的目標。

因此 AI 是 melting pot：symbolic 提供 vision，neural 提供 architectures，statistical 提供 optimization 與 generalization；課程不把歷史寫成單一勝者。

## Tensors：從資料形狀到可讀的計算

`tensors.py` 說 tensors 是 modern machine learning 的 atoms，用來表示 data、model parameters、gradients、intermediate computations（activations）；它們也出現在其他 science and engineering。核心示範使用 NumPy，einops 段落改用 PyTorch tensors。

### Scalar、vector、matrix、rank

Tensor 是 multi-dimensional array，概括 vector 和 matrix。scalar 是 rank 0，例如 `np.array(42)`；vector 是 rank 1，例如 `[1,2,3]`；matrix 是 rank 2，例如兩列三欄；rank 3 範例由兩個 2×3 matrix 疊成，shape 是 `(2,2,3)`。slice 可以是 `x[1]`、`x[1][0]`、`x[1][0][2]`，依序取得 matrix、vector、scalar。

通常不會手寫每個 entry。`np.zeros((2,3))`、`np.ones((2,3))`、`np.random.randn(2,3)` 建立結構；`np.eye(3)` 建立 identity matrix，`np.diag([1,2,3])` 建立 diagonal matrix。也可以用 `np.save` 寫入 disk、`np.load` 讀回。這些 examples 先讓讀者分辨 shape 與數值內容。

### ML 的典型 shapes

D-dimensional data point 是 `(D,)`；batch 是 `(N,D)`；language modeling sequence 是 `(N,L,D)`；vision image batch 是 `(N,H,W,C)`，C 為 RGB channels。weight matrix 是 `(Din,Dout)`，模型 parameters 通常是一組 tensors；來源以 DeepSeek v3 的論文和 Hugging Face model file information 為例。

### Viewing 與 elementwise operations

對 `(2,3)` tensor，`x[0]` 取 row 0，`x[:,1]` 取 column 1，`x.transpose(1,0)` 做 transpose。它們是 views，不是 copies；若 `x[0][0]=100`，對應的 view `y` 也會改變，所以不需要時不要 mutate tensors。

Elementwise operation 對每個 element 做同一件事，回傳相同 shape：`np.power(x,2)`、`np.sqrt(x)`、`x+x`、`x*3`、`x/2`。`np.triu`／`np.tril` 取 upper／lower triangular part，對 Transformer 的 input masking 有用；`np.zeros_like`／`np.ones_like` 按照另一 tensor 的 shape 產生 zeros／ones。

### Matrix multiplication 與效率

若 `x` shape `(4,6)`、`w` shape `(6,3)`，`x @ w` 得到 `(4,3)`。若 `x` 是 `(2,4,6)`、`w` 仍是 `(6,3)`，結果是 `(2,4,3)`：對每個 `x[0]`、`x[1]` slice 乘上同一個 `w`，w 被 broadcast。

同一結果常有多種算法。來源以 N=16 的 matrices 比較三層 Python loops 與 NumPy `x @ w`，用 `timeit` 算 `python_time / numpy_time` 的 speedup，並指出 large matrices 在 GPU 上更快。這次執行的 speedup 不是固定 benchmark；可重複的教訓是盡量以 tensor operations 表達計算。

### Einops 與維度 bookkeeping

傳統 PyTorch 的 `x @ y.transpose(-2,-1)` 需要記住 `-2`、`-1` 的意義。Einops 是以 dimension names 操作 tensors 的 library，靈感來自 Einstein summation notation；可參考 [Einops tutorial](https://einops.rocks/1-einops-basics/)。

`einsum` 是 generalized matrix multiplication。二維例子把 `x` 寫成 `seq1 hidden`、`y` 寫成 `hidden seq2`，輸出 `seq1 seq2`。batch 例子把 inputs 寫成 `batch seq1 hidden` 和 `batch seq2 hidden`，輸出 `batch seq1 seq2`；output 沒有的 dimensions 會被 sum over。`...` 表示任意數量的 broadcasting dimensions。

Reduction 也可命名：`x.sum(dim=-1)` 等同 `reduce(x, "... hidden -> ...", "sum")`。最後，`rearrange` 把 `(seq,total_hidden)` 中的 `total_hidden` 拆成 `heads` 和 `hidden1`，再用 `einsum` 乘以 `(hidden1,hidden2)` 的 `w`，最後把 `heads` 和 `hidden2` 合回去。它沒有改變數學目的，只把維度的拆分、保留和合併寫得更明白。

## 讀完後的檢查

最後列出能力與 goals、資源限制，再核對 tensor shapes。

## 參考資料

- [CS221 Autumn 2025 課程網站](https://stanford-cs221.github.io/autumn2025/)
- [本講官方 executable artifacts：welcome、history、tensors](https://stanford-cs221.github.io/autumn2025-lectures/?trace=welcome)
- [CS221 Autumn 2025 executable lecture repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Einops tutorial](https://einops.rocks/1-einops-basics/)
- [Stanford Online 官方 CS221 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
