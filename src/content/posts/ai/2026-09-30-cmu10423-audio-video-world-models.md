---
title: "CMU 10-423 L24–L26：語音、影片生成與互動式世界模型——生成模型怎麼從圖片走向聲音、時間和可操作的世界"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, speech-to-text, video-generation, world-model, diffusion-model, multimodal]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 22
tldr: "CMU 10-423 最後三講把前面學過的 Transformer、tokenizer、latent diffusion 搬到新的資料型態。L24 講音訊：先把聲波轉成 mel-spectrogram 或離散 token，再用 Whisper 轉錄、用 AudioLM 與 MusicGen 生成、用 AudioLDM 做擴散。L25 講影片：3D UNet 加時空注意力、latent 影片擴散、DiT 與 Sora，最後到可互動的 Neural OS。L26 前半講世界模型：給定狀態與動作預測下一個狀態，分成先生成 3D 場景、互動式影片（Genie）、潛在表徵（V-JEPA、PAN）三條路線。"
description: "CMU 10-423/623/723 Generative AI（Spring 2026）第 24–26 講導讀：音訊資料表示（PCM、mel-spectrogram）、Whisper、Gemini 與 Parakeet 的語音辨識、AudioLM、Music Transformer、MusicGen、AudioLDM、StableAudio、SpeechVerse；影片擴散模型（3D UNet、ViViT、Video Diffusion Model、Video LDM、DiT、Sora、Open-Sora）、Large World Model、Neural OS；以及世界模型的定義與三種路線（NeRF／Gaussian splatting、Genie 1–3、V-JEPA、PAN）。"
draft: false
glossary:
  - term: "mel-spectrogram"
    aliases: ["梅爾頻譜圖", "log-mel spectrogram"]
    definition: "把音訊切成互相重疊的短窗，每窗做一次傅立葉轉換得到頻譜圖，再把頻率軸映射到較接近人耳感知的 mel 尺度；結果可以像圖片一樣處理。"
    context: "CMU 10-423 第 24 講的音訊表示，Whisper 的輸入就是 log-mel spectrogram。"
    links:
      - label: "Radford et al. 2022：Whisper"
        url: "https://arxiv.org/abs/2212.04356"
  - term: "world model"
    aliases: ["世界模型", "WM"]
    definition: "給定前一個世界狀態 s 和一個動作 a，從分布 p(s′ | s, a) 抽樣或預測下一個狀態 s′ 的模型。"
    context: "CMU 10-423 第 26 講前半的定義，課程聚焦在 3D 物理互動這類狀態。"
    links:
      - label: "Bruce et al. 2024：Genie"
        url: "https://arxiv.org/abs/2402.15391"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-audio-video-world-models-en)

**本文依據 [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 版。** 這是 [CMU 10-423 導讀](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)系列第 22 篇，接續 [L23：程式生成與自主 agent](/posts/ai/2026-09-30-cmu10423-code-generation-agents)，範圍是課程最後三講：

| 講次 | 日期 | 標題 | 講者（投影片封面） |
|---|---|---|---|
| Lecture 24 | 4 月 13 日 | Audio understanding and synthesis | Matt Gormley |
| Lecture 25 | 4 月 15 日 | Generative Models for Videos | Aran Nayebi & Matt Gormley |
| Lecture 26（前半） | 4 月 20 日 | Interactive World Models | Matt Gormley & Aran Nayebi |

用到的官方材料：[講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)、[L24 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture24-audio.pdf)（38 頁）與[手寫版](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture24-audio-ink.pdf)（38 頁）、[L25 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture25-video.pdf)（34 頁）、[L26 世界模型投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture26-world-models.pdf)（40 頁）。L26 的另一份投影片「Science of Alignment」放在 [order 20](/posts/ai/2026-09-30-cmu10423-risks-alignment)。三講在講次表上都沒有列 readings。這門課的存取等級是 **A3**（等級定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)），但錄影放在要 CMU 登入的 Panopto，投影片裡的聲音、影片 demo 也只剩連結，所以本篇完全依投影片文字與圖說撰寫。

三講共用一個問題：**前面在文字和圖片上學到的 tokenizer、Transformer、latent diffusion，要怎麼延伸到聲音、時間軸，以及會回應使用者動作的世界？** 答案的形狀一再重複：先找一個好的表示（頻譜圖、離散 token、潛在空間），再套用已經學過的生成模型。

## L24：音訊的理解與合成

### 先把聲音變成模型吃得下的東西

投影片先講原始音訊：錄音裝置持續取樣氣壓（振幅），也就是 PCM 表示。一個原始音訊檔有三個參數：聲道數、位元深度（每個振幅用幾個 bit）、取樣率（每秒取幾個樣本）。例子是 44.1 kHz、16-bit 的立體聲錄音：每秒 44,100 個樣本，每個樣本是兩個 16-bit 整數，一個聲道一個。

若聲音從頭到尾不變，做一次快速傅立葉轉換（FFT）就能拆出組成它的正弦波。真實聲音隨時間變化，所以要在互相重疊的短窗上做很多次 FFT，得到一張可以當圖片看的頻譜圖；再把頻率通過一個頻率到 mel 的映射，就是 mel-spectrogram。

### 語音辨識：Whisper、Gemini、Parakeet

[Whisper](https://arxiv.org/abs/2212.04356) 是 encoder-decoder Transformer，投影片說它幾乎就是 Vaswani et al.（2017）的原始架構。幾個具體設定：

- 輸入是 30 秒一段的 log-mel spectrogram（16 kHz、80 個通道、25 ms 窗、10 ms 步長）。
- Encoder 前面接兩層卷積，加上 sinusoidal 位置編碼；decoder 用學出來的位置編碼。
- Encoder 與 decoder 的 Transformer block 數相同（32）。
- 用多種任務訓練同一個模型，以特殊 token 標示任務類型與語言；時間戳 token 讓它能產生對齊時間的逐字稿。
- Large 版本 15 億參數；資料量大到只訓練 2–3 個 epoch。

結果頁的重點：在 LibriSpeech 英文上的字錯誤率接近人類；高資源語言表現強、低資源語言較弱；也能做多種語言的語音翻譯。

另外兩種路線：

- **Gemini**：多模態 LLM，和 Whisper 不同，它是 decoder-only。音訊先轉成 16 kHz，每秒轉成 25 個 token；語音轉錄因此自然成立，還能和文字提示交錯輸入。
- **Parakeet（NVIDIA）**：投影片說它通常比 Whisper 快約 10 倍，辨識表現仍很高。家族裡都以 FastConformer 為底，分別搭配 TDT（Token and Duration Transducer）、RNN-Transducer、CTC 三種輸出方式。圖來自 Hugging Face 的 [Open ASR Leaderboard](https://huggingface.co/spaces/hf-audio/open_asr_leaderboard)。

### 音訊生成：把聲音當成 token 序列

生成段的開場引用一篇[音訊語言模型綜述](https://arxiv.org/abs/2402.13236)：許多模型先用 audio codec 把訊號轉成離散 token，再在 token 上訓練語言模型，拿來生成語音、音樂或自然聲響。

**AudioLM** 的組成：

| 元件 | 投影片的設定 |
|---|---|
| 輸入 | 單聲道音訊，長度 T = 16000 |
| 聲學 tokenizer | SoundStream neural audio codec，詞彙量 N = 1024 |
| 語意 tokenizer | w2v-BERT，詞彙量 K = 1024，序列長度 T′ = T/640 |
| 生成模型 | decoder-only Transformer，分三個階段的層級結構，每階段以前一階段輸出為條件、各用一個模型以縮短序列 |
| 還原 | SoundStream decoder |

**音樂生成**有兩種表示：[Music Transformer](https://arxiv.org/abs/1809.04281) 生成 MIDI（投影片比較了它、baseline Transformer 與 LSTM 的續寫結果）；**MusicGen** 則直接生成音訊 token：

- 音訊 tokenizer 是 EnCodec（卷積 autoencoder）
- codebook interleaving：多條 token 序列平行預測
- 文字提示用 T5、Flan-T5 或 CLAP 編碼；旋律提示用 information bottleneck
- Decoder 是最多 33 億參數的 Transformer LM

**擴散路線**：[AudioLDM](https://arxiv.org/abs/2301.12503) 可以做文字生音訊、文字加音訊生音訊（風格轉換或補完）、音訊到音訊（inpainting）。它由三部分組成：把 mel-spectrogram 壓進潛在空間的 VAE（壓縮比 r = 4）、使用 DDIM schedule 與 classifier-free guidance 的 DDPM、以及類似 CLIP 的對比式語言音訊預訓練（CLAP）編碼器。[StableAudio](https://arxiv.org/abs/2402.04825) 架構與 AudioLDM 相近，但多了開始與結束時間的條件，讓模型學會片段在整首歌裡的位置，因此能生成不同長度的音訊。

這一段和 [order 13 的文生圖](/posts/ai/2026-09-30-cmu10423-text-to-image-vlm)幾乎一一對應：VAE 對應 latent diffusion 的壓縮，CLAP 對應 CLIP。

### 音訊語言模型：SpeechVerse

[SpeechVerse](https://arxiv.org/abs/2405.08295) 代表一種常見的音訊語言模型架構：音訊先經過預訓練音訊編碼器與 adapter 變成向量，文字用 LLM 的 embedding 矩陣，兩者串接後送進預訓練 LLM。投影片直接點出，這和 [order 13](/posts/ai/2026-09-30-cmu10423-text-to-image-vlm) 講的「在預訓練 LLM 上接影像編碼器做 VLM」是同一個模式。

最後一頁預告下一講：[Veo 3](https://storage.googleapis.com/deepmind-media/veo/Veo-3-Tech-Report.pdf) 是影片擴散模型，但同時也擴散音訊，所以生成的影片自帶同步的聲音。

## L25：影片的生成與理解

### 資料：字幕多半是模型寫的

投影片指出，最大的「影片加字幕」資料集，字幕大多是用模型生成的，例如 [Panda-70M](https://arxiv.org/abs/2402.19479)；而字幕的品質與風格會因為用哪個模型而差很多。

### 從 3D UNet 到 Video Diffusion Model

[Video Diffusion Model](https://arxiv.org/abs/2204.03458)（2022）的架構是 3D UNet 加上時空注意力，時間軸使用相對位置編碼。投影片把它拆成兩個前身解釋：

- **[3D UNet](https://arxiv.org/abs/1606.06650)**：原本用在 3D 醫學影像分割（例子是非洲爪蟾腎臟的 3D 影像），和標準 UNet 幾乎一樣，只是把 2D 卷積（高、寬、通道）換成 3D 卷積（高、寬、深度、通道）。
- **[ViViT](https://arxiv.org/abs/2103.15691)**（投影片寫作 VViT）：一般影像 ViT 會把每一幀當成獨立的圖片，只在空間上做注意力；影片版本交替使用空間注意力與時間注意力。

<details>
<summary>投影片上的分解式時空注意力</summary>

空間注意力：

1. reshape：`b t h w c -> (b t) (h w) c`
2. 多頭注意力
3. reshape 回 `b t h w c`

時間注意力：

1. reshape：`b t h w c -> (b h w) t c`
2. 多頭注意力
3. reshape 回原形狀

做法就是把「不參與這次注意力」的軸併進 batch 維度。

</details>

Video Diffusion Model 還有兩個技巧：

- **圖片與影片聯合訓練**：用圖片訓練時，把時間注意力遮起來，讓注意力只落在當前這張圖上。投影片說這樣能提升影片生成表現。
- **Reconstruction guided sampling**：要從條件分布抽樣時使用，例如已有前 16 幀、要生成接下來 16 幀，或已有低幀率影片、要補出中間幀。關鍵是「根據模型對條件資料的重建」來引導抽樣。

### Latent 影片擴散、DiT 與 Sora

- **[Video LDM](https://arxiv.org/abs/2304.08818)**：由兩部分組成，一個把影片壓成潛在表示再還原的 encoder/decoder，以及一個在潛在空間訓練的影片擴散模型。和 [order 13](/posts/ai/2026-09-30-cmu10423-text-to-image-vlm) 的 latent diffusion 同一個思路。
- **[DiT](https://arxiv.org/abs/2212.09748)**：用 Transformer 取代 UNet 當擴散骨幹，在 [order 14](/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer) 講過。
- **[Sora](https://openai.com/index/video-generation-models-as-world-simulators/)**：投影片的描述只有一句，Sora 用 DiT 當骨幹，同時用圖片與影片訓練。
- **[Open-Sora 2.0](https://arxiv.org/abs/2503.09642)**：訓練成本隨模型與資料改進而下降，採三階段訓練；評估方式是人工評估加上基準與指標。

### 影片理解與「可互動的影片」

影片理解只舉了一個例子：[Large World Model](https://arxiv.org/abs/2402.08268)，能同時生成與理解文字、圖片和影片。

最後一段叫「agentic video generation + understanding」，是整講最新的部分：

- **[NeuralOS](https://arxiv.org/abs/2507.08800)**（2025）：用互動式影片擴散模擬 GUI，輸入是使用者動作加上隱藏狀態，輸出是下一個畫面。
- **[Neural Computers](https://arxiv.org/abs/2604.06425)**（2026）：投影片只放了 [demo 連結](https://metauto.ai/neuralcomputer/)和論文出處，沒有文字說明。

NeuralOS 已經是「給狀態與動作、預測下一個畫面」，這正好接到 L26 的世界模型定義。

## L26 前半：互動式世界模型

### 定義與用途

投影片先用心理學的說法定調：世界模型就是「假設性思考」，也就是俗稱的思想實驗。接著給出課程用的定義：

> 世界模型接受前一個世界狀態 s 與動作 a，透過一個分布（或函式）抽樣或預測下一個世界狀態 s′：s′ ∼ p(s′ | s, a)。

世界狀態裝什麼，取決於你想模擬什麼。投影片對照了「所有地緣政治實體、領導人與他們的決策」和「3D 世界中的物理互動」，課程聚焦在後者。

投影片列出六種用途：替機器人生成模擬訓練資料、替自動駕駛生成模擬訓練資料、用提示詞生成可互動的世界（也就是電腦遊戲）、自動生成與編修 3D 動畫或圖學內容、讓推理模型假想現實世界的物理互動、更快建立 VR／AR 環境。資料來源則包括大規模圖片與影片、較小規模的 3D 場景資料集、文字、音訊與多模態資料。

### 三條路線

| 路線 | 做法 | 投影片的例子 |
|---|---|---|
| 1. 先生成 3D 場景，再渲染／模擬 | 產生能用現成渲染器畫出來的表示 | Marble（World Labs）、GSGen、DreamFusion、NeRF-VAE |
| 2. 互動式影片 | 給人操作遊戲引擎的感覺 | Genie 1–3、GameNGen、Muse、Oasis、GAIA 1–2 |
| 3. 潛在世界表徵 | 在低維潛在空間（連續、離散或兩者）表示世界狀態 | PAN、V-JEPA 1–2 |

### 路線 1：生成 3D 場景

[NeRF](https://arxiv.org/abs/2003.08934) 和 [Gaussian Splatting](https://arxiv.org/abs/2308.04079) 的目標相同：從 2D 圖片合成 3D 場景，並定義一個可微分的渲染器。

- **NeRF**：連續的神經場，把「3D 位置加觀看方向」映射到「密度加發出的輻射」。缺點是體積渲染很慢，不適合即時互動。
- **Gaussian Splatting**：把場景表示成一團 3D 高斯（splat），每個有位置、形狀、不透明度、顏色；靠高效的光柵化達到即時或接近即時的渲染。

生成模型接在這兩種表示上：[DreamFusion](https://arxiv.org/abs/2209.14988) 對每個文字描述從頭訓練一個 NeRF，因為 NeRF 可微分所以行得通；[GSGen](https://arxiv.org/abs/2309.16585) 做同樣的事，但生成的是 Gaussian splatting。投影片最後放了 [World Labs 的 Marble](https://marble.worldlabs.ai/)。

### 路線 2：互動式影片（Genie）

[Genie-1](https://arxiv.org/abs/2402.15391) 是這一講篇幅最多的模型。測試時它接受一張圖當提示，每個時間步收一個使用者動作，根據目前畫面與動作生成下一幀，模擬玩電子遊戲的互動方式。

| 項目 | 投影片的內容 |
|---|---|
| 訓練資料 | 680 萬段 16 秒的 2D 平台遊戲影片（3 萬小時） |
| 規模 | 110 億參數 |
| 影片 tokenizer | VQ-VAE，把 T 幀影片編成離散 token；骨幹是 ST-Transformer |
| 潛在動作模型（LAM） | 另一個 VQ-VAE，從無標註影片中學出潛在動作：encoder 由前後幀推出動作，decoder 由前幾幀加動作還原下一幀。測試時丟掉，因為動作改由人類提供 |
| 動態模型 | decoder-only [MaskGIT](https://arxiv.org/abs/2202.04200)，以先前的影片 token 與動作為條件預測下一幀 token，用交叉熵訓練；動作 embedding 以相加而非串接的方式加入 |

值得注意的是 LAM：訓練資料裡根本沒有按鍵紀錄，動作是模型自己從畫面變化裡學出來的。定性結果顯示，用文生圖模型產生的圖片也能當提示，學出來的潛在動作會對應到實際按鍵，讓使用者自己試出每個鍵做什麼。

投影片還講了兩個延伸實驗：

- **機器人**：用 13 萬筆機器人示範、一個模擬資料集和 20.9 萬段真實機器人資料（都只有影片、沒有動作）訓練 Genie，得到一個能以「遊戲方式」操作機械手臂的模型。
- **潛在動作能不能遷移**：在程序生成的平台遊戲 CoinRun 上比較三種策略：以專家動作做 behavior cloning（上限）、隨機動作（下限），以及先以 Genie 潛在動作訓練策略、再用少量例子學「潛在動作到專家動作」映射的 LAM-based policy。

Genie-2 的技術描述很模糊，投影片推測主要的改變是規模（更多參數、更多資料）。[Genie-3](https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/) 則列出六項限制：

- 互動時間只有短短幾分鐘
- 動作（可能）是潛在的、來自固定集合，無法定義新動作
- 用提示詞改變世界是開放集合，形成「動作封閉、世界變化開放」的不對稱
- 似乎只能有一個角色
- 本質上仍是影片模型，沒有遊戲引擎能讀的世界表示（點雲、mesh、Gaussian splatting）
- 運算需求極高

### 路線 3：潛在世界表徵

- **[V-JEPA](https://arxiv.org/abs/2506.09985)（1–2）**：非生成式的世界模型。永遠在潛在空間工作，最小化「原始影片中被遮住區域的潛在表示」與「從遮蔽影片預測出的潛在表示」之間的差距，損失直接定義在兩個潛在向量之間。目標是把學到的表示遷移到其他任務。
- **[PAN](https://arxiv.org/abs/2511.09057)**：目標是長時間、可條件控制的互動式模擬。三個部分：視覺編碼器 h 把觀測映射成結構化潛在狀態；自回歸世界模型 f 根據動作與歷史預測下一個潛在狀態（長時程）；影片擴散解碼器 g 從潛在狀態還原高品質畫面（短時程）。和 JEPA 不同，PAN 的訓練目標留在觀測空間；投影片的理由是 JEPA 的目標容易坍縮、需要小心正則化，而觀測空間的目標迫使模型貼近訓練資料裡的真實觀測。

## 課程怎麼驗收這三講

- **Quiz 6**：講次表標在 4 月 20 日（L26 當天）課堂上，範圍 L21–L24，所以 L24 音訊在範圍內，L25、L26 不在。題目不公開。
- **作業與考試**：L15 以後沒有程式作業；[練習考卷](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)在 3 月 30 日的考試前發布，也沒有涵蓋這三講。
- **HW623**：[論文清單](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/HW623.pdf)裡和這三講相關的有 [NeRF](https://arxiv.org/abs/2003.08934)、[Video Diffusion Models](https://arxiv.org/abs/2204.03458)、[Video-LLaVA](https://arxiv.org/abs/2311.10122)、[A Recipe for Generating 3D Worlds From a Single Image](https://arxiv.org/abs/2503.16611)。
- **專案**：L24、L25 的投影片開頭都在提醒專案時程（期中報告 4 月 13 日、海報 4 月 26 日上傳、4 月 28 日發表、期末報告與程式 4 月 30 日）。細節見 [order 23](/posts/ai/2026-09-30-cmu10423-exam-hw623-project)。

**怎麼做**：今晚挑一段 30 秒的錄音，用 `librosa` 或 `torchaudio` 畫出 80 通道、25 ms 窗、10 ms 步長的 log-mel spectrogram，也就是 Whisper 的輸入設定。看著那張圖，你就能理解為什麼 L24 後半的擴散模型可以把聲音當圖片處理。

## 這一篇可以確認與不能確認的

可以確認：講次表的日期與標題、三份投影片的文字與圖說、投影片引用的論文網址。不能確認：課堂口述的解說與 demo 內容（Panopto 需登入，投影片只留 demo 連結）、Genie-2／3 的技術細節（投影片本身就說描述模糊）、Neural Computers 的內容（投影片只有連結）、Quiz 6 題目。L26 投影片開頭的提醒頁寫著 HW623 在 4 月 21 日、海報在 4 月 27 日上傳、期末報告在 5 月 1 日，和講次表的 4 月 20 日、26 日、30 日不一致，看起來是沿用舊學期的提醒頁；本文以講次表為準。

延伸閱讀：擴散與 flow matching 的數學可以讀 [MIT 6.S184 導讀](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)；世界模型在強化學習裡的角色可以看 [CS234 客座：World of World Modeling](/posts/ai/2026-09-30-cs234-guest-world-models)。

系列導覽：上一篇 [L23：程式生成與自主 agent](/posts/ai/2026-09-30-cmu10423-code-generation-agents)｜下一篇 [收尾：練習考卷、HW623 與期末專案](/posts/ai/2026-09-30-cmu10423-exam-hw623-project)｜[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

## 參考資料

- [CMU 10-423/623/723 Generative AI（Spring 2026）課程首頁](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [課程講次表（Lecture 24–26、Quiz 6、專案時程）](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Lecture 24 投影片：Audio Understanding and Synthesis](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture24-audio.pdf)
- [Lecture 24 投影片（課堂手寫版）](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture24-audio-ink.pdf)
- [Lecture 25 投影片：Video Generation and Understanding](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture25-video.pdf)
- [Lecture 26 投影片：Interactive World Models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture26-world-models.pdf)
- [Radford et al. 2022：Robust Speech Recognition via Large-Scale Weak Supervision（Whisper）](https://arxiv.org/abs/2212.04356)
- [Wu et al. 2024：Towards audio language modeling — an overview](https://arxiv.org/abs/2402.13236)
- [Huang et al. 2018：Music Transformer](https://arxiv.org/abs/1809.04281)
- [Copet et al. 2023：Simple and Controllable Music Generation（MusicGen，NeurIPS）](https://proceedings.neurips.cc/paper_files/paper/2023/hash/94b472a1842cd7c56dcb125fb2765fbd-Abstract-Conference.html)
- [Liu et al. 2023：AudioLDM](https://arxiv.org/abs/2301.12503)
- [Evans et al. 2024：Fast Timing-Conditioned Latent Audio Diffusion（Stable Audio）](https://arxiv.org/abs/2402.04825)
- [Das et al. 2024：SpeechVerse](https://arxiv.org/abs/2405.08295)
- [Veo 3 Tech Report](https://storage.googleapis.com/deepmind-media/veo/Veo-3-Tech-Report.pdf)
- [Chen et al. 2024：Panda-70M](https://arxiv.org/abs/2402.19479)
- [Ho et al. 2022：Video Diffusion Models](https://arxiv.org/abs/2204.03458)
- [Çiçek et al. 2016：3D U-Net](https://arxiv.org/abs/1606.06650)
- [Arnab et al. 2021：ViViT: A Video Vision Transformer](https://arxiv.org/abs/2103.15691)
- [Blattmann et al. 2023：Align your Latents（Video LDM）](https://arxiv.org/abs/2304.08818)
- [Peebles & Xie 2022：Scalable Diffusion Models with Transformers（DiT）](https://arxiv.org/abs/2212.09748)
- [OpenAI：Video generation models as world simulators（Sora）](https://openai.com/index/video-generation-models-as-world-simulators/)
- [Zheng et al. 2025：Open-Sora 2.0](https://arxiv.org/abs/2503.09642)
- [Liu et al. 2024：World Model on Million-Length Video And Language With Blockwise RingAttention（Large World Model）](https://arxiv.org/abs/2402.08268)
- [Rivard et al. 2025：NeuralOS](https://arxiv.org/abs/2507.08800)
- [Zhuge et al. 2026：Neural Computers](https://arxiv.org/abs/2604.06425)
- [Mildenhall et al. 2020：NeRF](https://arxiv.org/abs/2003.08934)
- [Kerbl et al. 2023：3D Gaussian Splatting for Real-Time Radiance Field Rendering](https://arxiv.org/abs/2308.04079)
- [Poole et al. 2022：DreamFusion](https://arxiv.org/abs/2209.14988)
- [Chen et al. 2023：Text-to-3D using Gaussian Splatting（GSGen）](https://arxiv.org/abs/2309.16585)
- [Bruce et al. 2024：Genie: Generative Interactive Environments](https://arxiv.org/abs/2402.15391)
- [Chang et al. 2022：MaskGIT](https://arxiv.org/abs/2202.04200)
- [Google DeepMind：Genie 3](https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/)
- [Assran et al. 2025：V-JEPA 2](https://arxiv.org/abs/2506.09985)
- [PAN Team 2025：PAN: A World Model for General, Actionable, and Long-Horizon World Simulation](https://arxiv.org/abs/2511.09057)
- [HW623 handout（論文清單）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/HW623.pdf)
