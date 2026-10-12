---
title: "聲音生成：codec token 與 diffusion 各生成什麼｜CMU 10-423 第 24 堂"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 33
description: "區分codec/生成器/decoder與擴散採樣，計算token與碼率"
draft: false
---

> [English version](/posts/ai/2026-10-11-cmu10423-lecture-24b-audio-generation-en)

**影片狀態：錄影需登入或課程授權。** 本文依 CMU 10-423 Spring 2026 第 24 堂公開投影片整理；算例與變式是本站教學補充。

ASR 把聲音變文字，文字轉語音卻要把省略的資訊補回來。同一句「好啊」可以敷衍、驚喜或疑惑；文字沒有寫出每個振幅、音色與停頓。生成模型因此要學的是在條件下選出一種合理聲音，而不是逆轉一張唯一的轉錄對照表。

先備是[聲音表示](/posts/ai/2026-10-11-cmu10423-lecture-24a-audio-representation-asr)、[加噪與去噪](/posts/ai/2026-09-30-cmu10423-diffusion-models)。本篇用同一秒聲音比較波形、離散 codec token 與連續擴散表示，理解各模組責任；不把一個頻譜練習當成生成驗收。

## 為什麼不一直預測下一個振幅

WaveNet 展示了一條直接路徑：把波形機率分解成每個 sample 的條件機率，以 causal dilated convolution 讀歷史，再預測下一個量化振幅。causal 防止訓練偷看未來，dilation 讓網路不必每層都用巨大 kernel 就能擴大感受野。

代價是時間尺度。一秒 16 kHz 聲音有 16,000 次 sample 級決策；句子的語意卻跨越更多秒。這不是說波形模型不可能，而是逐 sample 路徑同時要處理很長序列與極細聲學變化。把聲音壓成較短表示，讓生成器先決定可管理的單位，便成了另一條路。

## Codec 是壓縮與重建，不是自動作曲

神經 codec 的 encoder 把波形變成連續特徵，quantizer 用 codebook 索引近似特徵，decoder 再重建波形。索引是離散 token，但並不天然等於一個音節。Residual vector quantization 可以逐層量化剩餘誤差：第一層抓粗特徵，下一層補尚未表達的部分。

生成器另外學 `p(token_t | earlier tokens, condition)`，條件可以是文字、音訊前綴或其他資訊。codec 告訴模型「聲音用哪些符號表示」，生成器決定「接下來選哪些符號」，decoder 負責「符號怎麼還原為聲音」。只訓練 codec 能重建輸入，不代表能生成一段符合文字的語音。

AudioLM 又區分 semantic tokens 與 acoustic tokens，讓較慢變化的內容和細緻聲學資訊分層處理；它不等同於「把所有 mel bins 當成文字」。語意 token 也不是保證逐字轉錄正確的標籤。

## 一秒聲音的完整 token 帳

以下假設是本站教學例，並非某個產品規格。codec 每秒輸出 50 個時間 frame，每 frame 有兩個 codebook，兩者各 1,024 個索引。輸入 16,000 個 waveform samples，encoder／quantizer 輸出 shape `(50,2)`。若逐 frame、逐 codebook 展平成序列，就有 100 個索引，每個理想固定長度索引需 `log2(1024)=10` bits，因此碼率是 `50×2×10=1000` bits/s。

這裡沒有算封包、模型或熵編碼成本。若原音訊是 16-bit mono PCM，原始碼率是 `16000×16=256000` bits/s；256 倍是此自擬設定的碼率比，不是保證能保持相同音質。生成器的 100 次索引決策也不代表整個系統只有 100 次運算：encoder、decoder 和每次 Transformer forward 都另有成本。

給前 20 個 frame 作音訊提示，已知索引是 40 個，剩下 30 frame 要生成 60 個索引。重建後 decoder 應輸出一秒波形；若 frame 排序錯了，即使 token 數正確，聲音也會錯亂。這就是 shape 驗收之外還要聽與量測的原因。

## Diffusion 走的是另一條生成路徑

也可以把 mel、codec 的連續 latent 或波形作為擴散目標。訓練時把乾淨表示加入不同程度噪音，學條件去噪；生成時從噪音逐步還原。連續 mel 輸出通常還要 vocoder 轉回波形，因為 magnitude／mel 表示不保留完整相位資訊。latent diffusion 則用其對應 decoder，不能把所有方法都叫「頻譜轉聲音」。

擴散的採樣步與 codec token 的時間步不是同一軸。20 次去噪可同時更新整段 latent；100 個自回歸索引是序列位置。單看步數不能比較延遲或音質，也不能說 diffusion 必定比 autoregression 快。

## 變式與真正的生成驗收

變式：保持 50 frame/s，但改成四個 512-entry codebook。答案是每秒 200 個索引，理想碼率 `50×4×9=1800` bits/s；對兩秒聲音則是 400 個索引。若只給第一個 codebook，不能直接宣稱品質相同，要知道 decoder 是否受訓支援少 codebook 解碼，並檢查失真。

再問：模型產生 shape 正確的 codec tokens，但內容沒有遵從文字，是哪裡失敗？答案首先指向生成器的條件控制；若對真實聲音做 encode–decode 就失真，則還有 codec 重建問題。兩者要分開量測。可比較相同提示、不同 seed 的內容正確性、說話者一致性、噪音與主觀自然度；重建好、聽起來好、說對話是三種證據。


## 延伸閱讀

- [上一篇](/posts/ai/2026-10-11-cmu10423-lecture-24a-audio-representation-asr)
- [下一篇](/posts/ai/2026-10-11-cmu10423-lecture-25-video-generation)

## 課程影片來源

官方[課程首頁](https://www.cs.cmu.edu/~mgormley/courses/10423/)提供 Panopto 錄影入口，讀取需登入或課程授權。本篇提供投影片導讀，未提供原音逐字稿、字幕或跟讀材料。

## 參考資料

- [CMU Lecture 24 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture24-audio.pdf)
- [AudioLM](https://arxiv.org/abs/2209.03143)
- [SoundStream](https://arxiv.org/abs/2107.03312)
- [WaveNet](https://arxiv.org/abs/1609.03499)
