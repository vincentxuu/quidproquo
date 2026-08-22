---
title: "CS124 Week 7 Transformers and Speech Processing：causal attention、生成與未錄現場課的邊界"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, transformer, speech-processing, llm]
lang: zh-TW
series: { name: "Stanford CS124 導讀", order: 8 }
tldr: "Week 7 的可公開主線是 PA6a：實作 causal self-attention、訓練 Shakespeare 小型 Transformer、取樣並計算 perplexity；同週 speech live lecture 未錄影，只能保留為明示缺口。"
description: "Stanford CS124 Winter 2026 Week 7：Transformer、causal self-attention、sampling、perplexity、PA6a，以及未錄 Speech Processing lecture 的材料邊界。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs124-week7-transformers-speech-en)

Week 7 的課表同時承接 Week 6 的 LLM/Transformer 現場課與一場新的 Speech Processing live lecture。兩者公開程度不對稱：Transformer 有 slides、指定閱讀與完整 PA6a repo；speech 現場課未錄影，詳細 agenda 只能等 Week 8 的閱讀與 PA6b 補上。

**版本：** Winter 2026。**單元：** Week 7，2026-02-17、02-19。**公開材料：** [schedule](https://web.stanford.edu/class/cs124/lec/)、[LLM/Transformer slides](https://www.stanford.edu/class/cs124/lec/LLM_cs124_week7_2025.pdf)、[PA6a](https://github.com/cs124/pa6a-transformers)。課表指定 SLP3 August 2025 Chapter 7 pp.1–11、17 與 Chapter 8。**缺口：** 現行 SLP3 主目錄的 Chapter 7/8 已重排，不能直接當成當季 reading；Speech Processing lecture 未錄影，公開 schedule 也沒有 speech deck。因此本文不替現場課補內容。

## Self-attention 讓每個位置組合可見歷史

Transformer 將 token states 投影成 queries、keys、values。query 與 keys 的相似度產生 attention weights，再對 values 加權求和。不同 token 可依輸入內容選擇不同 context，不再把整段歷史壓成單一固定 recurrent state。

decoder-only language model 需要 causal mask：位置 `i` 不得看見未來 tokens。沒有 mask，訓練時模型會偷看答案；有 mask，parallel training 仍可一次計算多個位置，但每個位置只使用左側 context。

multi-head attention 讓多組投影並行建立不同關係，接著經 output projection、feed-forward layer、residual connections 與 normalization 組成 block。課堂層級的重點不是替每個 head 命名，而是能追蹤張量從 sequence 到 attention matrix 再回到 token representations。

## PA6a 第一次離開 notebook

[PA6a](https://github.com/cs124/pa6a-transformers) 是本季第一份不用 Jupyter notebook 的作業。學生在 `model.py` 實作 `CausalSelfAttention.forward`，用 `test_attention.py` 檢查，再以 GPT-2 BPE 處理好的 Shakespeare corpus 訓練小型模型。

[PA6a README](https://github.com/cs124/pa6a-transformers) 給出可驗證預期：預設 CPU 訓練 2,000 iterations；作者的 M1 MacBook Pro 約十五分鐘且 loss 低於 4.0。這是 repo 的環境觀察，不是通用效能保證。硬體、套件與參數不同都會改變結果。

訓練後以 `sample.py` 產生文字，調整 temperature 等 sampling hyperparameters。temperature 不會改變模型 weights，只會改變 logits 轉成 sampling distribution 的尖銳程度。低溫偏向高機率 token，高溫增加多樣性也增加失控機率。

## Perplexity 是機率模型指標，不是人性偵測器

[PA6a](https://github.com/cs124/pa6a-transformers) 要學生實作 perplexity。它是 average negative log probability 的指數形式；模型對 reference tokens 越不驚訝，perplexity 越低。比較必須使用相同 tokenizer 與資料，否則詞彙切分已改變每一步的機率空間。

[PA6a](https://github.com/cs124/pa6a-transformers) 接著要求閱讀 AI detection 的失敗案例，反思把 predictable prose 當成 AI prose 的問題。repo 的問題特別要求學生考慮標準化寫作、不同寫作者受到的影響，以及教育者是否應使用 detector。這不是額外裝飾：同一個 metric 在 language modeling 可合理衡量預測，在身份判定卻可能被過度延伸。

## Speech lecture 能確認到哪裡

[official schedule](https://web.stanford.edu/class/cs124/lec/) 只證明 2 月 17 日有 Dan Jurafsky 的 live Speech Processing lecture，attendance 是 optional／extra credit，內容會進 quiz。課程又明說 live lectures 不錄影。沒有公開 deck，就不能進一步聲稱現場講了 phonetics、CTC、Whisper 或特定錯誤率；那些主題即使常見，也不是本週可驗證 agenda。

Week 8 的指定 speech chapters 與 PA6b 會提供下一個公開單元。把它們留在 Week 8，才能維持一篇對應一個官方 week，不用後來 repo 倒推前一週講者說了什麼。

## 本週的完成線

讓 `test_attention.py` 通過後，畫出一個四-token causal mask，標明每列可見位置。再以同一 checkpoint 產生低溫與高溫 samples，並記錄 validation loss 與 perplexity。最後分開寫兩句：perplexity 能支持什麼模型比較；它不能支持什麼作者身份判斷。

## Scaled dot-product attention 逐步計算

給定 token-state matrix `X`，先乘三組 learned projections 得 `Q=XW_Q`、`K=XW_K`、`V=XW_V`。score matrix 是 `QKᵀ`，shape 為 sequence length 乘 sequence length；第 `i` 列代表位置 `i` 對所有 key positions 的分數。

分數除以 `sqrt(d_k)`，避免 dimension 增大時 dot products 尺度過大、softmax 過度尖銳。接著加入 causal mask：未來 positions 加上負無限大，softmax 後 probability 成零。最後以 attention probabilities 乘 `V`，每列得到加權 context vector。

手算兩至四個 tokens 足以抓出三種常見錯誤：`K` 沒轉置造成 shape 不對、mask 方向反了讓過去看不到、softmax 沿錯 dimension 讓 columns 而非 rows 正規化。測試不只要看 output shape，也要確認每列 probabilities 和為一、future entries 為零。

## Multi-head 與 block 組合

multi-head 將 model dimension 切成多個 heads，各自做 attention，再 concatenate 與 output projection。實作需要在 batch、head、sequence、head-dimension 間 reshape／transpose。memory layout 操作若錯，程式可能仍能跑卻把 token 與 head 混在一起。

attention 後接 position-wise feed-forward network，每個 token 用同一組 MLP；residual connection 讓 sublayer 學 correction，normalization 控制 activation scale。stack 多個 blocks 後，每個位置的 representation 逐層整合可見歷史。

位置資訊也必須進模型，因為純 self-attention 對輸入 permutation 沒有序列次序概念。PA6a `model.py` 已提供 vanilla Transformer scaffold；學生只補 `CausalSelfAttention.forward`，但應閱讀其餘程式確認 positional embedding、blocks 與 language-model head 如何接起來。

## `test_attention.py` 能證明與不能證明的事

unit test 可驗證指定 synthetic inputs 的 shape、mask 與數值，不能證明整個 model training 正確。attention test 通過後還要做 integration check：同一 prefix 改最後一個未來 token，不應改變更早位置的 logits；相同 seed 與 eval mode 應得到相同 forward output。

gradient 也要流過 attention。用小 loss 做 backward，確認 `W_Q/W_K/W_V` gradients 存在且 finite。若 forward 正確但 parameters 不更新，問題可能是 tensor detach、in-place operation 或 optimizer 沒包含參數。

PA6a 提供 scaffold 與 hints，公開 autograder 仍不是正式 Gradescope hidden tests。交接時應寫「public tests passed」，不寫「作業滿分」。

## Shakespeare training 的每個 artifact

[PA6a repo](https://github.com/cs124/pa6a-transformers) 已將 Shakespeare corpus 用 GPT-2 BPE tokenizer 處理，學生不需重做 Week 2 tokenizer。這固定了 vocabulary 與 token stream，讓作業聚焦 Transformer。仍應記 train/validation split、context length、batch size、layers、heads、embedding dimension、learning rate 與 seed。

training log 至少保存 iteration、train loss、validation loss 與 elapsed time。[PA6a README](https://github.com/cs124/pa6a-transformers) 的 2,000 iterations／M1 約十五分鐘／loss 低於 4.0 只是該環境的參考；若 loss 沒接近 repo 描述，先用更小 batch overfit、確認 targets shift、causal mask、optimizer update，再比較硬體速度。

checkpoint 應和 config 綁在一起。只保留 weights、遺失 model dimensions 或 tokenizer identity，之後無法 load。`out-shakespeare/`、sample JSON 與 perplexity JSON 是一條 evidence chain：哪個 checkpoint、用什麼 sampling settings、得到哪些 outputs。

## Sampling 不只 temperature

autoregressive generation 每次把 prefix 丟入模型，取最後位置 logits，轉成 distribution 抽下一 token，再把它接回 prefix。temperature 除 logits；temperature 接近零時趨向 argmax，高溫使 distribution 平坦。

還可使用 top-k 或 top-p 限制候選 tail，但若 PA6a 預設只要求調 temperature，延伸實驗必須標為自學補充，不能說成課堂要求。比較任何 sampling 方法都要固定 checkpoint、prompt、maximum tokens 與 random seed，否則差異來源混在一起。

quality 不應只靠「像 Shakespeare」。保存 repetition、unfinished strings、rare-token errors 與 coherence failures。小 corpus 模型出現局部文風與基本 grammar，正符合 README 的有限預期；不應把幾句漂亮 sample 誇成 general language understanding。

## Perplexity implementation audit

函式輸入、測試與輸出檔規則來自 [PA6a repository](https://github.com/cs124/pa6a-transformers)。

`perplexity.py` 接 model logits 與 target tokens，先算每個 target 的 cross-entropy，再對有效 tokens 平均，最後 exponentiate。平均順序很重要：先對 token losses 求平均再取 exp，不是先逐 token exp 再平均。

padding 或 masked positions 必須排除；若 sequences 長度不同，應按有效 token 數加權。測試用 synthetic logits 可手算 uniform distribution：vocabulary size 為 `V` 時，每步正確 token probability `1/V`，perplexity 應為 `V`。這是比只跑 script 更直接的 sanity check。

比較模型時，perplexity lower 表示同一 evaluation data 上分配較高 probability。它不直接評估 factuality、safety、helpfulness 或 sample diversity，更不能由一篇文章的 perplexity 推斷作者身份。

## Ethics reflection 要連回自己的 outputs

PA6a 的 ethics questions 不只要求轉述 detector 爭議，而是要看自己模型的 samples 與 perplexity。可以挑一段規整、低驚訝度的文字與一段混亂、高驚訝度文字，說明「可預測」為何不等於「機器寫」，「不可預測」也不等於有創意。

作業點名 standardized tests 與 rubrics：學生被獎勵寫固定結構，detector 卻可能把相同結構當 suspicious。回答應明示可能受影響群體與 alternative assessment，例如保存寫作過程、口頭說明、版本歷史，而不是只說 detector 不完美。

這些結論只能歸於 PA6a 公開 prompts 與自己的觀察，不歸給未錄的 live lecture。source boundary 不會削弱反思，反而讓每個主張知道從哪裡來。

## 參考資料

- [CS124 Winter 2026 schedule](https://web.stanford.edu/class/cs124/lec/)
- [LLM and Transformer slides](https://www.stanford.edu/class/cs124/lec/LLM_cs124_week7_2025.pdf)
- [CS124 PA6a Transformers](https://github.com/cs124/pa6a-transformers)
- [Speech and Language Processing, 3rd edition index](https://web.stanford.edu/~jurafsky/slp3/)
- [Stanford CS124 完整課程總覽](/posts/ai/2026-08-21-stanford-cs124-languages-to-information)
