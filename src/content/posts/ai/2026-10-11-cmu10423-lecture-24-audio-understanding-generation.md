---
title: "聲音的理解與生成：sample 怎麼變成文字，token 怎麼變回聲音｜CMU 10-423 第 24 堂"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 29
description: "計算 frame、mel 與 WER，再算 codec token 帳並區分擴散採樣"
draft: false
---

> [English version](/posts/ai/2026-10-11-cmu10423-lecture-24-audio-understanding-generation-en)

**影片狀態：錄影需登入或課程授權。** 本文依 CMU 10-423 Spring 2026 第 24 堂公開投影片整理；算例與變式是本站教學補充。

第 24 堂的主題是聲音的理解與生成，方向正好相反：理解要把 16,000 個振幅值壓成一句文字，生成要從文字或 token 補回文字沒寫的音色、停頓與語氣。前半計算 frame、mel bin 的形狀並用 WER 驗收轉錄；後半算 codec token 帳，並和擴散採樣比較。

## 聲音表示與轉錄：sample 怎麼變成文字

如果把一秒錄音直接當成文字 token，模型會先遇到一個問題：16 kHz 聲音每秒有 16,000 個振幅值，而且同一句話換個人、換個速度，數值就全變了。轉錄要保留「說了什麼」，卻不能只比對波形是否相同。這一部分先處理表示法，再追到 ASR 的文字解碼；生成新的聲音留到後半。

先備是向量與矩陣的 shape，以及[encoder 與語言 decoder 的橋接](/posts/ai/2026-10-11-cmu10423-lecture-13-vision-language)。不需要先懂音樂理論。

### 聲音不是一列單字

波形的每個 sample 是某個時刻的振幅。sample rate 描述一秒量幾次，不能直接回答音高或這個時刻是哪個字。頻率資訊來自一段時間的振盪：同一小段中反覆變化的快慢，才提供聲音的頻率結構。

因此短時傅立葉轉換（STFT）先取一個 window，乘窗函數，做 Fourier transform，再把 window 往後移一個 hop。重疊讓邊界附近的聲音不至於只被某一次切片決定。一次 window 得到一個頻率向量，多次 window 排起來纔是 spectrogram；橫軸時間、縱軸頻率，值代表各頻率的幅度或能量，取決於定義。

Mel filter bank 進一步把頻率格加權匯總到 mel bins。它與人耳頻率感知有關，但不是找出單字的字典。最後取 log 壓縮動態範圍，讓極強與極弱的能量比較容易一起處理。sample、frame、mel bin 分別是原始時間點、一次分析窗、一次頻率匯總，三者不能互換。

### 一秒錄音，為什麼可能只有 98 個 frame

以下是本文的 shape 算例，**不是 Whisper 的實作重現**。設單聲道錄音有 16,000 samples，window 與 FFT 長度都是 400，hop 為 160，完全不 padding，也不置中。第零窗取索引 0–399，下一窗取 160–559。最後一個完整 window 的起點不能超過 15,600，因此窗數是：

```text
frames = floor((16000 - 400) / 160) + 1 = 98
last start = 97 × 160 = 15520
last covered index = 15520 + 399 = 15919
```

剩下 80 samples 在這個明示的規則下不形成完整新窗。400 點實數 FFT 的單邊輸出有 `400/2+1=201` 格，包含 DC 與 Nyquist。若用 80 個 mel filters，表示法便從 `(98,201)` 變成 `(98,80)`。一秒不代表一個 frame，也不代表 16,000 個文字 token。

再假設 encoder 前有一層一維時間卷積，kernel 3、padding 1、stride 2。時間長度是 `floor((98+2−3)/2)+1=49`，mel 通道如何投影則由卷積輸出通道決定。這 49 個位置是降採樣後的音訊特徵，不是 49 個字。實際 Whisper 論文使用 16 kHz、25 ms window、10 ms hop 與 80-channel log-mel；其 padding、分段與邊界行為必須看程式，不能由這個 no-padding 算例推定。

### ASR 如何把特徵變成可變長度的文字

Whisper 採 encoder–decoder Transformer。encoder 讀聲音特徵，decoder 一邊讀已生成的文字 token，一邊透過 cross-attention 取音訊資訊。訓練時目標是正確逐字稿：給已知前綴，增加下一個正確 token 的機率；推論時前綴來自模型自己的生成。聲音特徵長度與文字長度因此不必相等，也不需要預先指定每個字對應哪個 sample。

任務 token 可告訴 decoder 要轉錄或翻譯、處理哪種語言。這表示 ASR 是有條件的序列生成；英文翻譯不是原語言逐字轉錄，兩種結果不能混著評分。多任務訓練也不代表所有噪音、口音、沉默片段都處理得好。

### 轉錄驗收要看錯在哪

自擬參考文字 `we need two tickets` 有四個詞，輸出 `we need tickets now`。對齊後刪掉 `two`、保留 `tickets`、插入 `now`，因此 substitutions=0、deletions=1、insertions=1，WER 為 `(0+1+1)/4=0.5`。這是在算編輯距離，不能看到「語意差不多」就改成零錯誤。中文如何切詞、大小寫與標點是否正規化，也要先固定；WER 不同不一定是模型真的不同。

變式：把 hop 改成 320，其餘 no-padding 條件不變，會有多少 frame？答案是 `floor(15600/320)+1=49`；經同一卷積後是 25。hop 增大減少時間解析度，沒有增加音高解析度，後者仍受 window／FFT 長度影響。再問：四詞參考只多插一個詞，WER 是多少？答案 1/4。這兩題分別驗收表示 shape 與文字錯誤，不能用畫出頻譜圖取代 ASR 評估。

常見誤解是把好看的頻譜當成模型聽懂了。頻譜只整理訊號；真正的轉錄能力還要在未見說話者、噪音與語言分佈上，以固定正規化與對齊規則驗收。

## 聲音生成：codec token 與 diffusion 各生成什麼

ASR 把聲音變文字，文字轉語音卻要把省略的資訊補回來。同一句「好啊」可以敷衍、驚喜或疑惑；文字沒有寫出每個振幅、音色與停頓。生成模型因此要學的是在條件下選出一種合理聲音，而不是逆轉一張唯一的轉錄對照表。

先備是前半的聲音表示與[加噪與去噪](/posts/ai/2026-09-30-cmu10423-diffusion-models)。這一部分用同一秒聲音比較波形、離散 codec token 與連續擴散表示，理解各模組責任；不把一個頻譜練習當成生成驗收。

### 為什麼不一直預測下一個振幅

WaveNet 展示了一條直接路徑：把波形機率分解成每個 sample 的條件機率，以 causal dilated convolution 讀歷史，再預測下一個量化振幅。causal 防止訓練偷看未來，dilation 讓網路不必每層都用巨大 kernel 就能擴大感受野。

代價是時間尺度。一秒 16 kHz 聲音有 16,000 次 sample 級決策；句子的語意卻跨越更多秒。這不是說波形模型不可能，而是逐 sample 路徑同時要處理很長序列與極細聲學變化。把聲音壓成較短表示，讓生成器先決定可管理的單位，便成了另一條路。

### Codec 是壓縮與重建，不是自動作曲

神經 codec 的 encoder 把波形變成連續特徵，quantizer 用 codebook 索引近似特徵，decoder 再重建波形。索引是離散 token，但並不天然等於一個音節。Residual vector quantization 可以逐層量化剩餘誤差：第一層抓粗特徵，下一層補尚未表達的部分。

生成器另外學 `p(token_t | earlier tokens, condition)`，條件可以是文字、音訊前綴或其他資訊。codec 告訴模型「聲音用哪些符號表示」，生成器決定「接下來選哪些符號」，decoder 負責「符號怎麼還原為聲音」。只訓練 codec 能重建輸入，不代表能生成一段符合文字的語音。

AudioLM 又區分 semantic tokens 與 acoustic tokens，讓較慢變化的內容和細緻聲學資訊分層處理；它不等同於「把所有 mel bins 當成文字」。語意 token 也不是保證逐字轉錄正確的標籤。

### 一秒聲音的完整 token 帳

以下假設是本站教學例，並非某個產品規格。codec 每秒輸出 50 個時間 frame，每 frame 有兩個 codebook，兩者各 1,024 個索引。輸入 16,000 個 waveform samples，encoder／quantizer 輸出 shape `(50,2)`。若逐 frame、逐 codebook 展平成序列，就有 100 個索引，每個理想固定長度索引需 `log2(1024)=10` bits，因此碼率是 `50×2×10=1000` bits/s。

這裡沒有算封包、模型或熵編碼成本。若原音訊是 16-bit mono PCM，原始碼率是 `16000×16=256000` bits/s；256 倍是此自擬設定的碼率比，不是保證能保持相同音質。生成器的 100 次索引決策也不代表整個系統只有 100 次運算：encoder、decoder 和每次 Transformer forward 都另有成本。

給前 20 個 frame 作音訊提示，已知索引是 40 個，剩下 30 frame 要生成 60 個索引。重建後 decoder 應輸出一秒波形；若 frame 排序錯了，即使 token 數正確，聲音也會錯亂。這就是 shape 驗收之外還要聽與量測的原因。

### Diffusion 走的是另一條生成路徑

也可以把 mel、codec 的連續 latent 或波形作為擴散目標。訓練時把乾淨表示加入不同程度噪音，學條件去噪；生成時從噪音逐步還原。連續 mel 輸出通常還要 vocoder 轉回波形，因為 magnitude／mel 表示不保留完整相位資訊。latent diffusion 則用其對應 decoder，不能把所有方法都叫「頻譜轉聲音」。

擴散的採樣步與 codec token 的時間步不是同一軸。20 次去噪可同時更新整段 latent；100 個自回歸索引是序列位置。單看步數不能比較延遲或音質，也不能說 diffusion 必定比 autoregression 快。

### 變式與真正的生成驗收

變式：保持 50 frame/s，但改成四個 512-entry codebook。答案是每秒 200 個索引，理想碼率 `50×4×9=1800` bits/s；對兩秒聲音則是 400 個索引。若只給第一個 codebook，不能直接宣稱品質相同，要知道 decoder 是否受訓支援少 codebook 解碼，並檢查失真。

再問：模型產生 shape 正確的 codec tokens，但內容沒有遵從文字，是哪裡失敗？答案首先指向生成器的條件控制；若對真實聲音做 encode–decode 就失真，則還有 codec 重建問題。兩者要分開量測。可比較相同提示、不同 seed 的內容正確性、說話者一致性、噪音與主觀自然度；重建好、聽起來好、說對話是三種證據。

## 延伸閱讀

- [上一篇](/posts/ai/2026-09-30-cmu10423-code-generation-agents)
- [下一篇](/posts/ai/2026-10-11-cmu10423-lecture-25-video-generation)

## 課程影片來源

官方[課程首頁](https://www.cs.cmu.edu/~mgormley/courses/10423/)提供 Panopto 錄影入口，讀取需登入或課程授權。本篇提供投影片導讀，未提供原音逐字稿、字幕或跟讀材料。

## 參考資料

- [CMU Lecture 24 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture24-audio.pdf)
- [Whisper paper](https://arxiv.org/abs/2212.04356)
- [AudioLM](https://arxiv.org/abs/2209.03143)
- [SoundStream](https://arxiv.org/abs/2107.03312)
- [WaveNet](https://arxiv.org/abs/1609.03499)
