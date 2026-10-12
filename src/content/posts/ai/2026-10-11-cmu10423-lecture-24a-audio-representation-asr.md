---
title: "聲音表示與轉錄：sample 怎麼變成文字｜CMU 10-423 第 24 堂"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 32
description: "分清sample/frame/mel bin並計算shape與WER"
draft: false
---

> [English version](/posts/ai/2026-10-11-cmu10423-lecture-24a-audio-representation-asr-en)

**影片狀態：錄影需登入或課程授權。** 本文依 CMU 10-423 Spring 2026 第 24 堂公開投影片整理；算例與變式是本站教學補充。

如果把一秒錄音直接當成文字 token，模型會先遇到一個問題：16 kHz 聲音每秒有 16,000 個振幅值，而且同一句話換個人、換個速度，數值就全變了。轉錄要保留「說了什麼」，卻不能只比對波形是否相同。本篇先處理表示法，再追到 ASR 的文字解碼；生成新的聲音另見下一篇。

先備是向量與矩陣的 shape，以及[encoder 與語言 decoder 的橋接](/posts/ai/2026-10-11-cmu10423-lecture-13-vision-language)。不需要先懂音樂理論。

## 聲音不是一列單字

波形的每個 sample 是某個時刻的振幅。sample rate 描述一秒量幾次，不能直接回答音高或這個時刻是哪個字。頻率資訊來自一段時間的振盪：同一小段中反覆變化的快慢，才提供聲音的頻率結構。

因此短時傅立葉轉換（STFT）先取一個 window，乘窗函數，做 Fourier transform，再把 window 往後移一個 hop。重疊讓邊界附近的聲音不至於只被某一次切片決定。一次 window 得到一個頻率向量，多次 window 排起來纔是 spectrogram；橫軸時間、縱軸頻率，值代表各頻率的幅度或能量，取決於定義。

Mel filter bank 進一步把頻率格加權匯總到 mel bins。它與人耳頻率感知有關，但不是找出單字的字典。最後取 log 壓縮動態範圍，讓極強與極弱的能量比較容易一起處理。sample、frame、mel bin 分別是原始時間點、一次分析窗、一次頻率匯總，三者不能互換。

## 一秒錄音，為什麼可能只有 98 個 frame

以下是本文的 shape 算例，**不是 Whisper 的實作重現**。設單聲道錄音有 16,000 samples，window 與 FFT 長度都是 400，hop 為 160，完全不 padding，也不置中。第零窗取索引 0–399，下一窗取 160–559。最後一個完整 window 的起點不能超過 15,600，因此窗數是：

```text
frames = floor((16000 - 400) / 160) + 1 = 98
last start = 97 × 160 = 15520
last covered index = 15520 + 399 = 15919
```

剩下 80 samples 在這個明示的規則下不形成完整新窗。400 點實數 FFT 的單邊輸出有 `400/2+1=201` 格，包含 DC 與 Nyquist。若用 80 個 mel filters，表示法便從 `(98,201)` 變成 `(98,80)`。一秒不代表一個 frame，也不代表 16,000 個文字 token。

再假設 encoder 前有一層一維時間卷積，kernel 3、padding 1、stride 2。時間長度是 `floor((98+2−3)/2)+1=49`，mel 通道如何投影則由卷積輸出通道決定。這 49 個位置是降採樣後的音訊特徵，不是 49 個字。實際 Whisper 論文使用 16 kHz、25 ms window、10 ms hop 與 80-channel log-mel；其 padding、分段與邊界行為必須看程式，不能由這個 no-padding 算例推定。

## ASR 如何把特徵變成可變長度的文字

Whisper 採 encoder–decoder Transformer。encoder 讀聲音特徵，decoder 一邊讀已生成的文字 token，一邊透過 cross-attention 取音訊資訊。訓練時目標是正確逐字稿：給已知前綴，增加下一個正確 token 的機率；推論時前綴來自模型自己的生成。聲音特徵長度與文字長度因此不必相等，也不需要預先指定每個字對應哪個 sample。

任務 token 可告訴 decoder 要轉錄或翻譯、處理哪種語言。這表示 ASR 是有條件的序列生成；英文翻譯不是原語言逐字轉錄，兩種結果不能混著評分。多任務訓練也不代表所有噪音、口音、沉默片段都處理得好。

## 轉錄驗收要看錯在哪

自擬參考文字 `we need two tickets` 有四個詞，輸出 `we need tickets now`。對齊後刪掉 `two`、保留 `tickets`、插入 `now`，因此 substitutions=0、deletions=1、insertions=1，WER 為 `(0+1+1)/4=0.5`。這是在算編輯距離，不能看到「語意差不多」就改成零錯誤。中文如何切詞、大小寫與標點是否正規化，也要先固定；WER 不同不一定是模型真的不同。

變式：把 hop 改成 320，其餘 no-padding 條件不變，會有多少 frame？答案是 `floor(15600/320)+1=49`；經同一卷積後是 25。hop 增大減少時間解析度，沒有增加音高解析度，後者仍受 window／FFT 長度影響。再問：四詞參考只多插一個詞，WER 是多少？答案 1/4。這兩題分別驗收表示 shape 與文字錯誤，不能用畫出頻譜圖取代 ASR 評估。

常見誤解是把好看的頻譜當成模型聽懂了。頻譜只整理訊號；真正的轉錄能力還要在未見說話者、噪音與語言分佈上，以固定正規化與對齊規則驗收。


## 延伸閱讀

- [上一篇](/posts/ai/2026-09-30-cmu10423-code-generation-agents)
- [下一篇](/posts/ai/2026-10-11-cmu10423-lecture-24b-audio-generation)

## 課程影片來源

官方[課程首頁](https://www.cs.cmu.edu/~mgormley/courses/10423/)提供 Panopto 錄影入口，讀取需登入或課程授權。本篇提供投影片導讀，未提供原音逐字稿、字幕或跟讀材料。

## 參考資料

- [CMU Lecture 24 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture24-audio.pdf)
- [Whisper paper](https://arxiv.org/abs/2212.04356)
