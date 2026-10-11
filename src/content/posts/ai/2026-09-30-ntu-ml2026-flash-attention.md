---
title: "台大李宏毅 ML 2026 導讀：加快生成（上）——Flash Attention 為什麼卡在搬資料，而不是計算"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, llm-inference, flashattention, attention, gpu]
lang: zh-TW
series:
  name: "台大李宏毅 機器學習 2026 Spring 導讀"
  order: 6
tldr: "李宏毅在 ML 2026 第三週講推論加速，前半堂只講一招：Flash Attention。GPU 的運算單元很快，但工作台（on-chip SRAM）很小，資料得從倉庫（HBM）搬上搬下，搬運才是瓶頸。一般的 softmax 要來回倉庫好幾次；Flash Attention 用「先假設目前最大值就是 Amax，之後再乘一個修正項」的技巧，把找最大值、算分母、做 weighted sum 合進同一次掃描，連 attention weight 都不必真的算出來。結果和原本的 attention 一模一樣，不需要重訓，代價只是一點額外運算和一點燒腦。"
description: "台大李宏毅《機器學習 2026 Spring》3/20 推論加速上半堂導讀，依 inference.pdf 第 1–28 頁與影片「加快語言模型生成速度 (1/2)：Flash Attention」：Prefill 與 Decode、評估加速法的三個代價、HBM vs SRAM 的倉庫與工作台比喻、分塊 softmax 的讀寫次數、online softmax 修正項、跳過 attention weight 直接得到輸出，以及範例 Colab 的實測。"
draft: false
glossary:
  - term: "HBM"
    aliases: ["High Bandwidth Memory", "倉庫"]
    definition: "GPU 上容量大（A100 為 80GB）但存取相對慢的記憶體。李宏毅把它比喻成倉庫。"
    context: "Flash Attention 的目標就是減少從 HBM 搬資料到 SRAM 的次數。"
  - term: "SRAM"
    aliases: ["on-chip SRAM", "工作台"]
    definition: "GPU 晶片上的小容量高速記憶體，運算單元只能處理放得上它的資料。李宏毅把它比喻成工作台。"
    context: "講課時提到工作台通常只有十幾 MB，任何和序列長度 L 成正比的東西都放不上去。"
  - term: "Online softmax"
    aliases: ["分塊 softmax", "修正項"]
    definition: "分塊掃描時先用目前看到的最大值當 Amax 計算，遇到更大的值再把舊的部分和乘上 exp(舊最大值 − 新最大值) 修正，最後結果與一次算完全相同。"
    context: "這是 Flash Attention 能一次掃描就算完 softmax 與 weighted sum 的核心技巧。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-ml2026-flash-attention-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

**本文依據[台大李宏毅《機器學習 2026 Spring》](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)3/20 那一週的教材。** 這是[台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)系列第 6 篇。上一篇是 [HW2：讓 AI Agent 當 AI 工程師](/posts/ai/2026-09-30-ntu-ml2026-hw2-agent-as-ai-engineer)。前幾篇都在談 agent：[OpenClaw](/posts/ai/2026-09-30-ntu-ml2026-openclaw-anatomy) 會把一大段 system prompt 塞在你的每一句話前面，[Context Engineering](/posts/ai/2026-09-30-ntu-ml2026-context-engineering) 則在處理 context 放不下的問題。這一篇換到模型內部：**輸入動輒上萬、十萬 token 的時候，生成為什麼會慢，又能怎麼變快？**

用到的官方材料：講義 [inference.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/inference.pdf) 第 1–28 頁（整份 55 頁，後半是[下一篇 KV Cache](/posts/ai/2026-09-30-ntu-ml2026-kv-cache)），課程頁列出的影片[加快語言模型生成速度 (1/2)：Flash Attention](https://youtu.be/vXb2QYOUzl4)，以及投影片第 28 頁的[範例 Colab](https://colab.research.google.com/drive/1KoeKKIXSXI9b-pYg0kun3-uLQkP6p_hC?usp=sharing)。存取等級是 **A3**：投影片 pdf／pptx、錄影與範例程式都公開。本講沒有獨立測驗，對應的練習在 [HW3](/posts/ai/2026-09-30-ntu-ml2026-hw3-fast-inference)。

## 課程影片來源

影片來源已對照官方課程頁，並於 2026-10-10 即時查核：講次與影片一致，YouTube 公開且可嵌入。不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=vXb2QYOUzl4
title: 影片：加快語言模型生成速度 (1/2)：Flash Attention
```

原始影片：[影片：加快語言模型生成速度 (1/2)：Flash Attention](https://www.youtube.com/watch?v=vXb2QYOUzl4)

課程與錄影入口：

- [官方課程與錄影入口](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：影片 vXb2QYOUzl4（49:39）字幕全文已讀。核對 Prefill／Decode 與三種代價的評估框架、倉庫／工作台比喻（80GB 是倉庫、工作台僅十幾 MB）、分塊與「工作台不能放與 L 成正比的東西」、online softmax 修正項 exp(d1−d2)、跳過 attention weight 的 O 修正式、Hugging Face 無法讀 attention weight、Colab 數值差約 10 的負 7 次方、序列 4096 約快 8 至 9 倍、長序列 CUDA OOM，皆與字幕一致。發現一處不一致：字幕中老師口述真實模型示範為 Yi-34B，本文原寫 gemma-3-4b-it，已改為並列兩種說法並只寫趨勢；Colab 存檔輸出與投影片頁碼無法由影片驗證。

## 先備：這堂課假設你已經懂 Transformer

投影片第 2 頁只放了一個先備連結：[【生成式人工智慧與機器學習導論2025】第3講：解剖大型語言模型](https://youtu.be/8iFvM7WUUs8)。老師開場就說，這堂課預設你已經清楚 Transformer 內部怎麼運作，而且講的是**推論（inference）**，不是訓練。

第 3–4 頁用兩張圖快速複習 self-attention：輸入 x1…x5 各乘三個矩陣變成 q、k、v；第 4 個位置的輸出，是拿 q4 和 k1…k4 做內積得到 a1…a4，過 softmax 變成 â1…â4，再對 v1…v4 做 weighted sum。後面整堂課都在重新安排這串計算的順序。

第 5 頁把生成過程切成兩段：一次吃進整段 prompt 的 **Prefill**，以及一個一個吐 token 的 **Decode**。這兩個詞在下一篇 KV Cache 會再用到。

## 看一個加速法，先問代價是什麼

第 6 頁列出三種經典加速法：Flash Attention、KV Cache、Speculative Decoding。老師在這裡給了一個貫穿兩堂課的評估框架：**有人說他發明了加速法，你要問他付出了什麼代價。**常見的代價有三種：

1. 改變了 attention 的計算，算出來的是近似值，不是原本的結果。
2. 綁定模型，必須訓練或客製特定模型才能用，不是隨插即用。
3. 就算前兩者都沒有，也一定付出了其他代價。

兩堂課結束時會把所有方法填進同一張表（投影片第 55 頁，下一篇會完整整理）。

**Speculative Decoding 這學期沒有講。** 第 7 頁只放了舊影片連結：[【生成式AI導論 2024】第16講：可以加速所有語言模型生成速度的神奇外掛 — Speculative Decoding](https://youtu.be/MAbGgsWKrg8)。老師說過去講過的就不重講，但作業裡有這個題目。一句話版本：用一個小模型先猜幾個 token，再讓大模型一次平行驗證。細節放在 [HW3 導讀](/posts/ai/2026-09-30-ntu-ml2026-hw3-fast-inference)。

## 場景：運算很快，搬資料很慢

Flash Attention 出自 2022 年的論文 [FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness](https://arxiv.org/abs/2205.14135)（投影片第 8 頁）。老師先講它為什麼厲害：算出來的結果和原本的 attention **一模一樣**，不是近似；它可以直接套在任何用 self-attention 的 Transformer 上，不綁模型；代價非常小。

它的核心想法是考慮 GPU 運算的底層邏輯。第 9–10 頁用了一個比喻（老師強調這是簡化說法，不只限於 GPU）：

- **運算單元**是一群三頭六臂的小精靈，人多、算得快。
- **工作台**就是 on-chip SRAM，很小，一次只能放少量數值。
- **倉庫**就是 HBM，比工作台大得多，但也不是無限。

資料必須從倉庫搬到工作台才能算，算完再搬回去。只要東西上了工作台，運算可以想成瞬間完成；**真正拖慢速度的是搬運。**Flash Attention 要做的事，就是改變計算順序、減少搬運次數，而算出來的內容不變。

範例 Colab 裡跑出來的 GPU 是 A100 80GB。老師特別提醒：80GB 是倉庫的大小，工作台一直都很小，通常只有十幾 MB。

## 直覺：一般做法要來回倉庫很多次

第 11–17 頁示範一般的 attention 怎麼算。為了好懂，老師只考慮一個 query（實際 GPU 會同時處理多個）。

關鍵限制是：**工作台上不能放任何和序列長度 L 成正比的東西。**agent 的輸入可能是一萬、十萬、一百萬個 token，就算每個位置只存一個數字，一百萬個數字也放不上工作台。所以 key 要切成一塊一塊的 chunk，每塊 N 個，共 B = L/N 塊。

照這個限制，把 a_i 變成 â_i 要分好幾輪掃描：

1. 每塊算 q 和 k 的內積 a_i，寫回倉庫。
2. 逐塊讀 a_i，一路保留目前最大值，掃完才知道 Amax。實作上要先減掉 Amax 再取 exponential，避免溢位。
3. 再逐塊讀 a_i，算 exp(a_i − Amax)，寫回倉庫。
4. 再逐塊讀，累加出分母 S。
5. 再逐塊讀，除以 S 得到 â_i，寫回倉庫。
6. 最後逐塊讀 â_i 和 v，累加 weighted sum 得到輸出 O。

第 17 頁的問題是：a_i 到 â_i 這段要讀好幾次，**真的需要嗎？**

## 機制：先將錯就錯，再乘一個修正項

第 18–24 頁先講簡化版。困難在於分母要用到 Amax，而 Amax 要全部看過才知道，看起來只能分兩輪。

解法是**先假設**第一塊裡的最大值 d1 就是 Amax，照算部分和 s1。讀第二塊時如果找到更大的 d2，不用回頭重讀第一塊，只要把 s1 乘上 exp(d1 − d2)，就等於當初用 d2 算的一樣。老師說這個修正「說穿了也不值錢，就是一個式子」，但整個 Flash Attention 就是反覆用這一招。掃完最後一塊，d 就是 Amax，s 就是正確的分母。

<details>
<summary>展開：為什麼乘 exp(d1 − d2) 就能改正</summary>

第一塊的部分和是

s1 = Σ_{i=1..N} exp(a_i − d1)

乘上 exp(d1 − d2)：

s1 · exp(d1 − d2) = Σ_{i=1..N} exp(a_i − d1 + d1 − d2) = Σ_{i=1..N} exp(a_i − d2)

這正是「把 d2 當 Amax」時第一塊應有的值，可以直接和第二塊的 Σ exp(a_i − d2) 相加。第 k 塊的一般式：

d_k = max(d_{k−1}, 第 k 塊的最大值)
s_k = s_{k−1} · exp(d_{k−1} − d_k) + Σ_{i∈第 k 塊} exp(a_i − d_k)

</details>

這樣從 a_i 到 â_i 只剩**兩次**讀取：一次同時找 Amax 和分母，一次算出 â_i（第 24 頁）。

但這還不是 Flash Attention 的全部。第 25–27 頁提出老師稱為「靈魂拷問」的問題：**一定要先算出 attention weight，才能算 weighted sum 嗎？**

Flash Attention 的答案是不用。讀第一塊時就把 v 也讀進來，直接用「錯的」權重 exp(a_i − d1)/s1 算出 O1。讀第二塊時，d 和 s 都更新成比較正確的 d2、s2，再把 O1 乘上 (s1/s2)·exp(d1 − d2)，抹掉舊的 d1、s1 留下的痕跡，然後加上第二塊的貢獻。一路修正到最後一塊，O 就是正確的輸出。q、k、v 在一次掃描中都搬上工作台，從頭到尾沒有把 â_i 真的寫出來。

<details>
<summary>展開：輸出 O 的修正式</summary>

O_k = O_{k−1} · (s_{k−1} / s_k) · exp(d_{k−1} − d_k) + Σ_{i∈第 k 塊} [exp(a_i − d_k) / s_k] · v_i

乘 s_{k−1} 消掉舊分母、除 s_k 換上新分母；乘 exp(d_{k−1} − d_k) 修正指數項。掃完第 B 塊時，d_B = Amax、s_B 是完整分母，因此

O_B = Σ_{i=1..L} â_i · v_i

和先算 â_i 再做 weighted sum 的結果在理論上完全相同。

</details>

老師順帶提了一個實務後果：因為 attention weight 從來沒被算出來，如果你在 Hugging Face 用 Flash Attention 又想畫 attention matrix 做分析，它會報錯，告訴你沒有 attention weight 可以讀。

## 連回模型：你多半早就在用它

範例 Colab 用 PyTorch 的 `scaled_dot_product_attention`，分別指定 `SDPBackend.MATH`（一般算法）和 `SDPBackend.FLASH_ATTENTION`。老師說明，沒有特別設定時 PyTorch 通常預設就會用 Flash Attention，所以你平常跑 Transformer 很可能已經在用了。

Colab 裡做了三件事：

- **數值驗證**：隨機產生 q、k、v（B=4、H=8、L=256、D=64），兩種算法的最大差異在 10 的負 7 次方左右。
- **速度比較**：序列長度從 64 到 4096，A100 上長度 4096 時 Flash Attention 約快 9 倍（Colab 存檔輸出是 9.49x）。
- **真實模型**：Colab 存檔程式碼寫的是 `google/gemma-3-4b-it`（影片字幕裡老師口述的是 Yi-34B，兩者不一致，以下只寫趨勢），`attn_implementation` 設成 `eager`（不用 Flash Attention）或 `sdpa`，餵一段重複很多次的長字串、只生成 1 個 token。講課時序列短的時候兩者差不多，因為模型裡還有大量 feed-forward 與 embedding 的計算；把字串拉長後 Flash Attention 才明顯比較快。再拉長十倍，就直接 CUDA out of memory。

老師特別指出，這次爆掉的不是工作台，是倉庫。倉庫再大也有極限，而**為什麼序列太長會撐爆倉庫**，就是下一堂 KV Cache 的主題。

最後的結論：Flash Attention 靠減少搬運就能加速好幾倍，代價只有演算法變複雜、為了修正多做一點運算，老師的說法是「瑕不掩瑜」。

## 想深入

- **論文**：先讀 [FlashAttention](https://arxiv.org/abs/2205.14135) 的 Algorithm 1，對照本文的修正式。HW3 另外要讀 [FlashAttention-2](https://arxiv.org/abs/2307.08691) 和 [FlashAttention-3](https://arxiv.org/abs/2407.08608)，導讀見 [HW3 篇](/posts/ai/2026-09-30-ntu-ml2026-hw3-fast-inference)。
- **怎麼做**：打開範例 Colab，把 `SEQ_LENS` 延長到 8192，自己看加速倍率有沒有繼續上升；再把 `B`、`H` 調小，觀察短序列時 Flash Attention 還划不划算。
- **延伸閱讀**：站上的 [Stanford CS336 推論導讀](/posts/ai/2026-08-22-cs336-inference)從 roofline 角度談 memory-bound，[CME295 LLM 系統導讀](/posts/ai/2026-09-29-cme295-llm-systems)也整理了 Flash Attention 與推論最佳化。

## 這一篇可以確認與不能確認的

可以確認：講義第 1–28 頁的結構與文字、影片的逐字字幕（YouTube 上的 zh-TW 字幕）、範例 Colab 的程式與存檔輸出、引用論文的標題（在 arXiv 核對過）。

不能確認：真實模型示範用的是哪一個模型。字幕裡老師口述的是 Yi-34B，Colab 存檔程式碼寫的是 `google/gemma-3-4b-it`，兩者不一致，本文不下定論，只寫趨勢。講課當場的秒數與 Colab 存檔輸出不一致（存檔裡最長的那次沒有 OOM），因此真實模型那段只寫趨勢，不寫秒數。投影片第 11–27 頁多為動畫圖，文字依字幕轉述。

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-ml2026-course-overview)｜上一篇 [HW2：讓 AI Agent 當 AI 工程師](/posts/ai/2026-09-30-ntu-ml2026-hw2-agent-as-ai-engineer)｜下一篇 [加快生成（下）：KV Cache](/posts/ai/2026-09-30-ntu-ml2026-kv-cache)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。對照官方課程頁與 YouTube，講次與嵌入影片一致、可公開嵌入，狀態改為已附影片。
- 2026-10-10：依字幕核對影片內容。真實模型示範的模型名稱字幕（Yi-34B）與 Colab 程式碼（gemma-3-4b-it）不一致，已改為並列說明；其餘與字幕相符。

## 參考資料

- [台大李宏毅《機器學習 2026 Spring》課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [inference.pdf（加快語言模型的生成速度）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/inference.pdf)
- [影片：加快語言模型生成速度 (1/2)：Flash Attention](https://youtu.be/vXb2QYOUzl4)
- [範例 Colab：Flash Attention vs Naive Attention](https://colab.research.google.com/drive/1KoeKKIXSXI9b-pYg0kun3-uLQkP6p_hC?usp=sharing)
- [先備影片：【生成式人工智慧與機器學習導論2025】第3講：解剖大型語言模型](https://youtu.be/8iFvM7WUUs8)
- [舊影片：【生成式AI導論 2024】第16講：Speculative Decoding](https://youtu.be/MAbGgsWKrg8)
- [FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness（arXiv 2205.14135）](https://arxiv.org/abs/2205.14135)
- [FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning（arXiv 2307.08691）](https://arxiv.org/abs/2307.08691)
- [FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision（arXiv 2407.08608）](https://arxiv.org/abs/2407.08608)
