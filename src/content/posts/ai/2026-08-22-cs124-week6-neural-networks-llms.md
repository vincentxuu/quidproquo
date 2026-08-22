---
title: "CS124 Week 6 Neural Networks and LLMs：從神經元、反向傳播到 decoder-only 模型"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, neural-network, llm, nlp]
lang: zh-TW
series: { name: "Stanford CS124 導讀", order: 7 }
tldr: "Week 6 以公開 neural-network slides 建立 weighted sum、nonlinearity、loss 與 backpropagation，再用檔名標示 2025 的公開 LLM/Transformer deck 連到 decoder-only 架構，不視為 2026 現場逐字內容。"
description: "Stanford CS124 Winter 2026 Week 6：神經網路單元、多層網路、反向傳播、neural language models、LLM 架構與 PA5。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs124-week6-neural-networks-llms-en)

CS124 Week 6 把前半季的線性模型與 embeddings 接起來。官方 agenda 一邊安排 Neural Networks material 與 PA5，一邊在 2 月 10 日由 Dan Jurafsky 現場講「LLMs and Transformers!」。前者提供可公開驗證的數學骨架，後者把這套骨架放進大型語言模型。

**版本：** Winter 2026。**單元：** Week 6，2026-02-10、02-12。**公開材料：** [schedule](https://web.stanford.edu/class/cs124/lec/)、[Neural Networks slides](https://www.stanford.edu/class/cs124/lec/7_NN.pdf)、[LLM/Transformer slides](https://www.stanford.edu/class/cs124/lec/LLM_cs124_week7_2025.pdf)、[SLP3 Chapter 6](https://web.stanford.edu/~jurafsky/slp3/6.pdf)、[PA5](https://github.com/cs124/pa5-neural-networks)。**缺口：** LLM/Transformer 是 required live lecture 且沒有錄影；公開 deck 檔名保留 2025，不能證明 2026 現場逐頁內容完全相同。本文只整理公開 deck 與 repo 能支持的 agenda，不重建現場說法。

## 一個 neural unit 仍從線性分數開始

公開 [Neural Networks slides](https://www.stanford.edu/class/cs124/lec/7_NN.pdf) 與指定 [Chapter 6](https://web.stanford.edu/~jurafsky/slp3/6.pdf) 將神經單元寫成先計算 `z = w·x + b`，再通過非線性 activation 得到輸出。若沒有非線性，多層線性轉換仍可合併成一個線性轉換；網路深度不會增加能表達的函數種類。ReLU、sigmoid 等 activation 讓多層組合能形成非線性 decision surface。

這和 Week 3 並非斷裂。logistic regression 已有 weighted sum、bias、sigmoid 與 loss；neural network 把 hidden units 加在輸入與輸出之間，讓 representation 也能在訓練中改變。

## Forward pass、loss、backprop 是一條閉環

forward pass 逐層計算 activations，輸出 logits 或 probabilities。loss 衡量預測與 target 的差異。backpropagation 以 chain rule 把輸出端梯度傳回每層參數，optimizer 再更新 weights。

重點不只是記公式，而是知道每個 tensor 的 shape 與梯度流向。PA5 延續 Jupyter workflow；自學時應至少手算一個兩層小網路的 forward pass，並以數值擾動檢查一個 weight 的 gradient。若 loss 不降，先查資料、shape、activation 與 learning rate，不要把所有問題都歸給「模型太小」。

## Neural language model 改變的是條件表示

Week 2 的 n-gram 也預測下一個 token，但只用有限離散歷史與 count table。neural language model 把 tokens 映射到 embeddings，將 context 組合成連續 hidden representation，再由 output layer 對 vocabulary 給機率。

兩者共享 chain rule 與 next-token objective。差別在於 neural model 可讓相似 contexts 分享統計強度，不必每個 n-gram 都獨立計數。它仍有 context 設計與計算成本，並沒有因為改成 neural 就自動理解無限歷史。

## LLM deck 把模型分成三種架構

[檔名標示 2025 的公開 LLM slides](https://www.stanford.edu/class/cs124/lec/LLM_cs124_week7_2025.pdf) 區分 decoder、encoder 與 encoder-decoder。decoder-only 系列以 autoregressive next-token prediction 適合生成；encoder 系列建立雙向表示；encoder-decoder 將輸入序列映射成輸出序列。投影片說日常稱呼的「LLM」通常指 decoder-only causal models，但課程同時保留另外兩種架構的用途。

這個分類比品牌清單重要。架構影響 pretraining objective、可見 context 與輸出方式；模型名稱會換，causal mask 與 conditional generation 的問題仍會留下。

## PA5 的完成線

[PA5](https://github.com/cs124/pa5-neural-networks) 要學生在 notebook 實作 neural networks。最小完成線是：能指出 input、hidden、output 各層 shape；用同一 batch 記錄數次更新後的 loss；解釋 activation 拿掉後為何退化為線性模型。

本週仍未要求把完整 Transformer 寫出來。那是 Week 7 的 PA6a。Week 6 的任務是先讓 unit、layer、loss 與 gradient 成為可追蹤的共同語言，否則 attention 只會再多一層無法除錯的矩陣運算。

## 從單一 unit 擴成 batch matrix

單筆輸入 `x` 經 `Wx+b` 得到 hidden pre-activation；batch 寫成 matrix 後，第一個維度通常是 examples，第二個維度是 features。若 batch size 為 `m`、input dimension 為 `d`、hidden units 為 `h`，就應在實作前寫出 `X: m×d`、`W: d×h`、`b: h`、`H: m×h`。shape table 能在程式跑到深層 loss 前抓出 transpose 錯誤。

bias broadcasting 也要明示。每個 example 加同一個 `b`，不是替 batch 的每列學不同參數。若不理解 broadcasting，偶然能運算的 shape 仍可能語意錯誤。PA5 notebook 應在每個 TODO 旁記 input/output shape，而不是等 exception 才猜。

hidden layer 寬度決定 representation capacity，深度增加 composition 次數。增加參數可降低 training error，卻也提高計算與 overfitting 風險。公開 slides 的教學小網路用來看清運算，不支持「層越多一定越好」的結論。

## Activation 與初始化影響 gradient

sigmoid 將大正負輸入壓到接近零或一，derivative 也趨近零，深層網路容易出現 vanishing gradients。ReLU 在正區域保持簡單梯度，負區域輸出零；若某 unit 長期落在負區域，也可能停止更新。

因此 activation choice 與 weight initialization 必須一起看。若所有 weights 初始化相同，hidden units 得到相同 gradient，無法學出不同功能；小型 random initialization 破除 symmetry。尺度太大又可能讓 activations／gradients 爆掉或飽和。

實驗紀錄可保存每層 activation mean、standard deviation、zero fraction 與 gradient norm。這些 statistics 完全來自 forward/backprop agenda，也比只看 final accuracy 更能定位「loss 不動」的原因。

## Backpropagation 要沿 computational graph 展開

以兩層 classifier 為例，loss 對 output logits 的 gradient 先傳到第二層 weights，再經 activation derivative 傳回 hidden pre-activations，最後得到第一層 weights 與 input 的 gradients。每個 parameter gradient 應與 parameter shape 相同。

chain rule 的乘積也解釋深度困難：一路乘上過小 derivatives 會消失，過大則爆炸。residual connections、normalization 等後續架構設計會處理部分問題，但 Week 6 的公開 NN agenda 先要求學生能看見基本現象。

finite-difference check 應只在小模型與少量參數使用。選一個 weight，以 `L(w+ε)-L(w-ε)` 除以 `2ε` 近似 derivative，和 backprop 結果比較。若差異大，依序查 loss averaging、activation derivative、transpose 與 bias broadcasting。

## Training loop 需要分開觀察 optimization 與 generalization

一個完整 loop 包含 shuffle／batch、zero gradients、forward、loss、backward、parameter update 與 validation。忘記清 gradient 會意外累積；在 validation 時仍更新 weights 或使用 training-only behavior，也會污染結果。

training loss 下降證明 optimizer 能 fit 已見資料，不證明未見資料變好。應同步保存 validation loss，並在固定 evaluation interval 比較。若 training 繼續下降、validation 上升，是 overfitting signal；可考慮 regularization、early stopping、較小模型或更多資料。

learning curve 也能抓 underfitting。兩條 loss 都高且相近，問題可能是 capacity、features、optimization 或 label noise，不是直接加 regularization。把診斷分成「訓練沒學會」與「訓練學會但不泛化」，才能選對動作。

## Neural language model 的 input/output 對齊

將 token IDs 查 embedding table 得到 vectors，再用 context representation 預測下一個 token。訓練 pairs 要錯一格：input 是到位置 `t` 的歷史，target 是位置 `t+1`。若 shift 錯，模型可能學 identity 或對不上 loss shape。

output layer dimension 等於 vocabulary size，每個位置產生 logits。cross-entropy 通常直接接 logits 與 integer target IDs，不需要先手動 softmax；重複 softmax 會造成數值與 API 語意錯誤。mask 或 padding 位置也不應計入 loss。

和 n-gram baseline 比較時要固定 tokenizer、train/dev split 與 evaluation tokens。neural model 的優勢應由 held-out loss／perplexity 與 errors 支持，而不是因它「比較現代」。保存一組 n-gram 與 neural predictions，可直接看 continuous representation 在哪些 contexts 分享了統計強度。

## 公開 LLM deck 能支持的架構細節

deck 將 GPT、Claude、Llama 等列在 decoder family，BERT 類列在 encoder family，Flan-T5／Whisper 等列在 encoder-decoder。這張表支持架構分類，不支持把每個產品視為完全相同 training recipe。

decoder-only 模型依左側 tokens 預測下一個 token；encoder masked-language objective 可利用雙向 context 建 representation；encoder-decoder 讓 encoder 讀完整 input，decoder conditional generate output。選擇不是抽象排名，而是由 task interface 決定。

slides 也從 Week 2 n-gram 回顧開始，刻意保留共同點：都對序列與下一詞給 probabilities，都能反覆 sampling 生成。差異在 counts vs learned neural representations 與可用 context。這條對照才是本週從舊模型走到 LLM 的官方主脊。

## PA5 evidence package

除 notebook 最終輸出外，保存 shape table、initialization seed、training/validation curves、每層 gradient norms、一個 finite-difference check 與三個分類 errors。若修改 hidden size、activation 或 learning rate，一次只改一項並記錄前後結果。

再以固定小 batch 做 overfit test：模型應能把極少數 examples 的 loss 壓得很低。連小 batch 都無法 fit，優先懷疑 implementation；能 fit 小 batch 卻無法泛化，再查資料與 regularization。這是直接從公開 neural-network exercise 可得到的除錯流程。

## 延伸

公開 deck 足以確認架構主題，卻不足以引用 2026 現場的例子、問答或講者評註。要擴寫到最終長度，必須先固定 August 2025 Chapter 6 與 PA5 notebook 的 exercise-level notes，而不是用一般 LLM 歷史補篇幅。

## 參考資料

- [CS124 Winter 2026 schedule](https://web.stanford.edu/class/cs124/lec/)
- [Neural Networks slides](https://www.stanford.edu/class/cs124/lec/7_NN.pdf)
- [LLM and Transformer slides](https://www.stanford.edu/class/cs124/lec/LLM_cs124_week7_2025.pdf)
- [SLP3 Chapter 6](https://web.stanford.edu/~jurafsky/slp3/6.pdf)
- [CS124 PA5](https://github.com/cs124/pa5-neural-networks)
