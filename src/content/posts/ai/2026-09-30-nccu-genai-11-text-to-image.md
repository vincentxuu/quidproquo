---
title: "政大蔡炎龍 生成式AI 導讀 L11：文字生圖 AI 的原理及實作——CLIP 讀懂 prompt、排程器決定要不要「A 圖」、LoRA 只調 ΔW，最後用 diffusers 做出自己的生圖 Web App"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, course-guide, generative-ai, diffusion-model, clip, lora, image-generation, text-to-image]
lang: zh-TW
series:
  name: "政大蔡炎龍 生成式AI 導讀"
  order: 11
tldr: "L11 把 Stable Diffusion 架構圖上剩下的三塊補齊。CLIP 用「文字和圖越像越好」的對比訓練，讓 prompt 變成 77×768 的 embedding；排程器把 1000 步的加噪壓成二、三十步的去噪，但 Euler a 這類 ancestral 演算法不會收斂，步數加到 100，人物的衣服和座位都會換掉；LoRA 凍結原本的 W，只學拆成 A·B 的 ΔW。實作用 diffusers 載入 SD 1.5 系模型，第十一週作業是自己做一個生圖 Web App。"
description: "政大蔡炎龍《生成式 AI：文字與圖像生成的原理與實務》1132 學期第 11 講導讀，依錄影 11、投影片 GenAI11（72 頁）與 AI-Demo 的 Demo08g：CLIP 與 OpenCLIP、LAION-5B、SD 1.x 與 2.x 的文字編碼器、用數列收斂理解排程器、ancestral 與收斂系排程器的推薦步數、LoRA 的低秩分解與 checkpoint、.ckpt／.safetensors／diffusers 格式、fp16 與記憶體調校、pipeline 參數與亂數種子、Gradio 生圖 Web App，以及長庚衛星班第十一週作業的題目與評分標準。"
draft: false
glossary:
  - term: "CLIP"
    aliases: ["Contrastive Language-Image Pretraining"]
    definition: "OpenAI 2021 年提出的模型，同時訓練一個文字 encoder 與一個圖像 encoder，讓配對的文字與圖像向量越像越好。Stable Diffusion 用它的文字 encoder 把 prompt 轉成條件向量。"
    context: "GenAI11 第 7–16 頁。"
    links:
      - label: "Radford et al. 2021（arXiv）"
        url: "https://arxiv.org/abs/2103.00020"
  - term: "排程器（scheduler / sampler）"
    aliases: ["scheduler", "sampler", "取樣器"]
    definition: "Diffusion 生圖時決定每一步怎麼從目前的雜訊圖估出下一步的演算法，讓生圖不必走完訓練時的全部加噪步數。"
    context: "GenAI11 第 17–40 頁；Euler a、DPM++ 2M Karras、UniPC、DDIM 都是排程器。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nccu-genai-11-text-to-image-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

**本文依據政大蔡炎龍《生成式 AI：文字與圖像生成的原理與實務》1132 學期（2025 春季）。** 這是[政大蔡炎龍 生成式AI 導讀](/posts/ai/2026-09-30-nccu-genai-course-overview)系列第 11 篇，接在 [L10 從 VAE 開始的冒險旅程](/posts/ai/2026-09-30-nccu-genai-10-vae-to-diffusion)之後。上一講停在 Stable Diffusion 的架構圖，這一講把圖上的 CLIP 與 Scheduler 拆開，再加上最常用的微調技術 LoRA，最後動手寫程式。

用到的官方材料有四份：[錄影 11](https://www.youtube.com/watch?v=8VS6Dcxmp34)（2025-04-29，約 2 小時 59 分）、投影片 GenAI11（72 頁，在主講者的[投影片資料夾](https://drive.google.com/drive/folders/1c6A9Pa-c7cNi5kHUp7j-ccgYBRy9JpeA)）、[AI-Demo](https://github.com/yenlung/AI-Demo) repo 的 [`【Demo08g】打造Stable_Diffusion的WebUI`](https://yenlung.me/AI08g)，以及[長庚衛星班課程頁](https://yangchihyuan.github.io/courses/GenerativeAI2025)的第十一週作業。存取等級是 **A3**。Demo08g 在 GitHub 上最近一次 commit 是 2025-04-29，也就是上課當天，**以下引用的是 repo 目前版本**。

## 課程影片來源

影片來源已對照官方課程頁，並於 2026-10-10 即時查核：講次與影片一致，YouTube 公開且可嵌入。不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=8VS6Dcxmp34
title: 【生成式 AI】11. 文字生圖AI的原理及實作（YouTube 錄影）
```

原始影片：[【生成式 AI】11. 文字生圖AI的原理及實作（YouTube 錄影）](https://www.youtube.com/watch?v=8VS6Dcxmp34)

課程與錄影入口：

- [官方課程與錄影入口](https://yangchihyuan.github.io/courses/GenerativeAI2025)

查核日期：2026-10-10。

## 本週在課程中的位置

投影片分四段：讓文字和圖像的意涵拉近的 CLIP、不要 A 圖——排程器、LoRA、用 diffusers 實作圖像生成。錄影的時間軸：

| 時間 | 內容 |
|---|---|
| 23:00–36:05 | 複習 diffusion model |
| 36:05–48:24 | CLIP、OpenCLIP、SD 理解文字的機制 |
| 48:24–1:03:11 | 用數列收斂講排程器、A 系列與推薦設定 |
| 1:13:01–1:25:34 | LoRA、checkpoint |
| 1:25:34–2:03:35 | diffusers 實作、找模型、生圖 Web App、作業說明 |
| 2:15:45 起 | 閃電秀、課務宣導、助教課 |

開頭第 3–6 頁把上一講的架構圖、「文字融合進雜訊」與 Q/K/V 的圖再放一次，所以沒看 L10 也能跟上。

## 核心概念一：CLIP 讓文字和圖像的意思靠近

架構圖最左邊的「CLIP 文字 embedding 77×768」是怎麼來的？第 7–8 頁介紹 **CLIP（Contrastive Language-Image Pretraining）**，出自 OpenAI 的 [Radford et al. 2021](https://arxiv.org/abs/2103.00020)。

做法可以用投影片的一張圖說完：一個文字 encoder fθ 讀 "a girl in a cafe"，一個圖像 encoder gθ 讀一張女孩在咖啡店的照片，訓練目標是兩個向量**越像越好**。配對的文字與圖像被拉近，不配對的被推遠。訓練完，文字 encoder 輸出的向量就帶著「這段話在圖像世界裡長什麼樣」的資訊，正好拿來當生圖的條件。

第 15–16 頁補上它和 [L05 Transformer](/posts/ai/2026-09-30-nccu-genai-05-transformers-math) 的關係：CLIP 的文字端有 12 層 transformer，跟其他神經網路一樣把原向量轉成另一組向量，最後一層可以看成電腦對輸入的「抽象理解」。

### OpenCLIP、LAION-5B 與 SD 的兩代文字編碼器

第 9–11 頁整理了版本差異：

| | 文字編碼器 |
|---|---|
| SD 1.x | CLIP |
| SD 2.x | OpenCLIP（以 LAION-5B 訓練） |

第 10 頁比較資料規模：ImageNet 約 1,400 萬張，OpenAI CLIP 的訓練集規模標為「？」，[LAION-5B](https://arxiv.org/abs/2210.08402) 約 58.5 億組圖文。

第 9 頁說 OpenCLIP 的由來是「OpenAI 開放了 CLIP 的模型，但訓練好的參數沒有開放」。這裡要小小更正：依 OpenAI 的 [CLIP model card](https://github.com/openai/CLIP/blob/main/model-card.md)，權重是分批公開的（ViT-L/14 在 2022 年 1 月釋出），**不公開的是訓練資料集**。SD 1.5 的 [model card](https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-v1-5) 也寫明它用的是固定、預訓練好的 CLIP ViT-L/14 文字編碼器。[OpenCLIP](https://github.com/mlfoundations/open_clip) 是 CLIP 的開源重現，重點是可以用公開資料從頭訓練。

第 12–14 頁有一個有趣的觀察：目前最多模型是基於 1.5 版，而使用者回報原本的 SD 1.x 認識更多名人。蔡炎龍用 LAION 的 clip-retrieval 檢索網站查「Tzuyu Chou（周子瑜）」（投影片註明這個網站目前不能使用，但 LAION-5B 的內容不變），推論 SD 應該「認識」，再用 SD v1.5 標準版生圖。他的評語是：你可能覺得不像，但至少能正確畫出東方面孔。

## 核心概念二：排程器，以及「不要 A 圖」

第 18 頁的標題是「排程器 Sampler（Scheduler）：不要 A 圖？」。要理解這個梗，得先繞回微積分。

第 19–22 頁：還記得數列 a1, a2, …, an 的收斂與發散嗎？分析的標準手法是先亂猜一個 a1，再用一個神妙的算法一點一點調整，最後得到正確答案。對象不一定是數字，一串向量或 tensor 也可以問收不收斂。第 23 頁自嘲：大家一定在想老師是不是弄錯課程了。第 24 頁揭曉：**denoise 的過程就是在做這件事**，fθ 把 xt 變成 xt−1。

第 25–31 頁說明排程器在做什麼。訓練時加噪走了 1000 步，但生圖時總不希望也走 1000 步。網路學的是雜訊 εθ；一次估不出全部雜訊，但可以估出某一段時間加進去的雜訊，減掉就得到較早的 xt−k。所以不一定要走 1000 步。不同的排程器，就是不同的「一次跳多遠、怎麼跳」。

### 步數越多圖越美？不一定

第 32 頁先破除一個幻想：算圖步數越多，圖就越美。建議做法是先用較少步數試，滿意了再用**同一個亂數種子**增加步數。

第 33 頁點出要注意的「A 圖系」演算法，也就是 **ancestral schedulers**：Euler a、DPM2 a、DPM2 a Karras、DPM++ 2S a、DPM++ 2S a Karras。它們在降噪過程中用隨機雜訊的技巧加速，問題是基本上不太會收斂。

第 34–37 頁用一組 Euler a 的連拍示範：第 5 到 15 步像靈異片，第 20 步已經相當好；第 25 步突然換了件衣服，第 30 步換回皮衣但人物沒那麼清晰、還換了杯飲料；之後換成牛仔外套、換了位子、剪了頭髮、搬到室內，到第 100 步表情已經「拍太久有點不耐」。這一組圖比任何公式都更能說明「不收斂」的意思。

第 38 頁補充：不只 A 系列，DDIM 和 SDE 系也是不收斂系。第 39–40 頁引用 [stable-diffusion-art.com 的排程器整理](https://stable-diffusion-art.com/samplers/)給出推薦：

| 類型 | 排程器 | 建議步數 |
|---|---|---|
| 收斂系 | DPM++ 2M Karras | 20–30 |
| 收斂系 | UniPC | 20–30 |
| 非收斂系 | DPM++ SDE Karras（較慢的演算法） | 8–12 |
| 非收斂系 | DDIM | 10–15 |

投影片最後的提醒是：不收斂不一定是問題，只是多跑幾步不一定有想像中的好處。

**怎麼做**：用同一個種子、同一個 prompt，分別跑 Euler a 的 20、50、100 步，再換 UniPC 跑同樣三組。把六張圖排在一起，你會親眼看到收斂與不收斂的差別。

## 核心概念三：LoRA 只學一個很瘦的 ΔW

第 43–44 頁說明為什麼要微調：預訓練的 Stable Diffusion 有些地方不盡如人意，我們想用自己的資料再調一下。但有兩個問題：模型很大，自己的電腦可能訓練不動；自己的資料量小很多，會不會破壞原本的學習成果？

第 45–47 頁是 LoRA 的魔術，三步就講完：

1. 把 Stable Diffusion 的參數寫成一個 m×n 的矩陣 W。
2. **凍結**原本的 W，只調整 W + ΔW 裡的 ΔW。問題是 ΔW 還是有 m×n 個參數。
3. 把 ΔW 拆成 A·B，A 是 m×k、B 是 k×n，k 選小一點的數字就好。

<details>
<summary>為什麼 k 小就省很多</summary>

ΔW 直接學要 m·n 個參數，拆成 A·B 只要 m·k + k·n = k(m+n) 個。以 m = n = 1000、k = 8 為例，前者是 100 萬，後者是 1.6 萬，大約 1.6%。k 就是所謂的 rank，「低秩」指的正是這個。

</details>

第 48 頁註明出處是 Microsoft 的 [LoRA 論文（Hu et al. 2021）](https://arxiv.org/abs/2106.09685)，並強調這是很一般的做法，幾乎可用在任何神經網路模型上。從論文標題看得出，它最早是為大型語言模型提出的。

使用上的重點（第 49–54 頁）：

- **哪裡找**：[Civitai](https://civitai.com/) 與 [Hugging Face 上標了 lora 的模型](https://huggingface.co/models?other=lora)。
- **怎麼用**：W + α×ΔW，α 調強度，例如 0.7；融入後就像一個新模型。在有支援的介面裡，直接在 prompt 加 `<lora:LoRA的檔案名稱:0.7>`。
- **Checkpoint 是什麼**：一組完整的模型參數。把某個 LoRA 混進原本的參數，新的參數就是一個 checkpoint。
- **檔案格式**：Stable Diffusion 模型常見 `.ckpt` 與 `.safetensors`；diffusers 則是一個模型一個資料夾，所以只有單一檔案時要先轉換。LoRA 也可能是這兩種格式，要注意下載的是 LoRA（只有部分參數）還是完整 checkpoint。

## 這週的 Demo notebook

### 投影片上的系統調校

第 59–63 頁整理了在 Colab 或自己電腦上跑 diffusers 的幾個細節：

- 用 `torch_dtype=torch.float16` 載入，省運算資源。放上 `"cuda"`；Mac 請改 `"mps"`。
- VRAM 小的時候用 `pipe.enable_attention_slicing()` 切開來算，省記憶體。Mac 的 VRAM 和 RAM 共用，很容易被吃光。
- `pipe.enable_model_cpu_offload()` 讓 GPU 在任務之間自動休息。
- Mac 要先用 1 步隨便畫一張「暖機」才會正常。投影片的原話是：「事到如今，還是沒人知道為什麼。」

投影片範例載入的是 `runwayml/stable-diffusion-v1-5`。這個 repo 名稱現在在 Hugging Face 上會轉到 [`stable-diffusion-v1-5/stable-diffusion-v1-5`](https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-v1-5)，照抄投影片時可以直接改用新名稱。

第 66 頁列出 pipeline 常用參數：`prompt`、`negative_prompt`、`width`／`height`（預設 512）、`num_images_per_prompt`、`num_inference_steps`（預設 50）、`guidance_scale`（預設 7.5，越高越符合 prompt；投影片寫成「GFC scale」，一般通稱 CFG scale，即 classifier-free guidance）、`generator`（設定亂數種子）。第 67 頁提醒圖的尺寸：SD 建議一邊是 512，另一邊也要是 8 的倍數。第 68 頁強調**亂數種子是控圖的關鍵**，用 `torch.Generator(device="cpu").manual_seed(r)` 固定。

第 69 頁列了幾個可以試試的 SD 1.5 模型，例如 `Lykon/dreamshaper-8`、`SG161222/Realistic_Vision_V6.0_B1_noVAE`；第 70 頁示範在 Civitai 篩選 SD 1.5 模型。

### Demo08g：用 Gradio 包出自己的生圖介面

名稱裡的「WebUI」容易讓人以為是 AUTOMATIC1111。其實 Demo08g 是**用 diffusers 加 Gradio 自己寫的介面**，延續 [L10](/posts/ai/2026-09-30-nccu-genai-10-vae-to-diffusion) 介紹的 Demo08。

repo 目前版本的結構：

1. 載入 `digiplay/majicMIX_realistic_v6`（fp16、放上 CUDA），排程器換成 `UniPCMultistepScheduler`。
2. `generate_images()` 接收 prompt、要不要加強 prompt、要不要用 negative prompt、要不要自訂種子、高寬、步數、張數。它會先檢查高寬是不是 8 的倍數；張數大於 1 時，種子用「基準種子 + i」，最後回傳圖片與實際用到的種子清單。
3. Gradio 介面：左欄是 prompt 與各種開關，高寬下拉選 512／768／1024，步數滑桿 10–50（預設 20），張數 1–4；右欄是圖庫與種子資訊。

把用到的種子印出來這個設計很實用：看到喜歡的圖，就能用同一個種子調其他參數。

## 作業拆解：第十一週（長庚衛星班版本）

投影片第 72 頁的題目：打造自己的圖像生成 Web App！找一個合適的模型；修改 prompt，甚至推薦 prompts 給使用者；讓 app 有更多功能，例如用 LLM 自動優化 prompt（或把中文 prompt 由 AI 轉成英文）、不同風格選不同的優化 prompt 與 negative prompt、更換不同的排程器與 VAE。

長庚頁面的版本：利用 Hugging Face 上的 SD 1.5 模型做文字生圖。也可以先到 [Civitai](https://civitai.com/models) 找到心儀的模型，再去 Hugging Face 搜尋（找不到的話，可能 Hugging Face 上沒有）。可以交 Colab 連結或 PDF。1132 的繳交期限是 2025-05-12。

**繳交內容**：生圖使用的模型；多組生成圖，每組是「輸入 prompt 與其他設定＋輸出的圖」。

**評分**（滿分 10）：與老師使用的模型或 prompt 一模一樣 2 分；只交生成圖片 4 分；與老師示範程式大同小異 6 分；4 組以上圖片且達成要求 7–10 分（依創意程度）。請生成式 AI 幫忙的地方要附 prompt 與結果截圖，否則視為抄襲 AI。

**讀者自評版**：「大同小異」壓在 6 分，所以只換模型名稱不夠。投影片列的延伸功能裡，最容易做出差異的是「排程器下拉選單」：把本講的收斂系與非收斂系各放一個，搭配固定種子，使用者就能自己比較。這同時也是對排程器那一段最好的複習。繳交在各校 LMS，校外讀者只能照這張表自評。

## 自學檢查點

- 能說出 CLIP 的訓練目標，以及 Stable Diffusion 用的是它的哪一半。
- 能說出 SD 1.x 與 SD 2.x 的文字編碼器差在哪。
- 能用「數列收斂」解釋排程器在做什麼，並舉出兩個不收斂的排程器。
- 能說出為什麼 Euler a 跑到 100 步，圖還會一直變。
- 能寫出 LoRA 的參數量 k(m+n)，並解釋 checkpoint 跟 LoRA 檔的差別。
- 能在 Demo08g 裡指出固定種子的那一行，並加上一個排程器選單。

## 延伸閱讀

本篇自成一體；想深入的部分，站內有這些系列：

- Diffusion、取樣與 guidance 的數學：[MIT 6.S184 導讀](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)
- 視覺生成與 CLIP 類模型：[Stanford CS231N 導讀](/posts/ai/2026-09-30-cs231n-course-overview)
- Transformer 與 LoRA 在 LLM 上的用法：[Stanford CME295 導讀](/posts/ai/2026-09-29-stanford-cme295-transformers-llms)
- 課程全貌與開放程度分級：[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)

上一篇：[L10 從變分自編碼器（VAE）開始的冒險旅程](/posts/ai/2026-09-30-nccu-genai-10-vae-to-diffusion)｜下一篇：[L12 ControlNet 與 Fooocus](/posts/ai/2026-09-30-nccu-genai-12-controlnet-fooocus)｜[系列總覽](/posts/ai/2026-09-30-nccu-genai-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。對照官方課程頁與 YouTube，講次與嵌入影片一致、可公開嵌入，狀態改為已附影片。

## 參考資料

- [【生成式 AI】11. 文字生圖AI的原理及實作（YouTube 錄影）](https://www.youtube.com/watch?v=8VS6Dcxmp34)
- [蔡炎龍 1132 生成式 AI 投影片資料夾（GenAI11）](https://drive.google.com/drive/folders/1c6A9Pa-c7cNi5kHUp7j-ccgYBRy9JpeA)
- [1132 錄影播放清單](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv)
- [長庚衛星班課程頁：生成式 AI（2025）](https://yangchihyuan.github.io/courses/GenerativeAI2025)
- [yenlung/AI-Demo：【Demo08g】打造Stable_Diffusion的WebUI](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo08g%E3%80%91%E6%89%93%E9%80%A0Stable_Diffusion%E7%9A%84WebUI.ipynb)
- [yenlung/AI-Demo：【Demo08】用diffusers套件生成圖像](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo08%E3%80%91%E7%94%A8diffusers%E5%A5%97%E4%BB%B6%E7%94%9F%E6%88%90%E5%9C%96%E5%83%8F.ipynb)
- [Radford et al. (2021). Learning Transferable Visual Models From Natural Language Supervision. arXiv:2103.00020](https://arxiv.org/abs/2103.00020)
- [Schuhmann et al. (2022). LAION-5B: An open large-scale dataset for training next generation image-text models. arXiv:2210.08402](https://arxiv.org/abs/2210.08402)
- [Hu et al. (2021). LoRA: Low-Rank Adaptation of Large Language Models. arXiv:2106.09685](https://arxiv.org/abs/2106.09685)
- [OpenAI CLIP model card](https://github.com/openai/CLIP/blob/main/model-card.md)
- [mlfoundations/open_clip（GitHub）](https://github.com/mlfoundations/open_clip)
- [stable-diffusion-v1-5 model card（Hugging Face）](https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-v1-5)
- [stable-diffusion-art.com 的排程器整理（投影片第 39–40 頁引用）](https://stable-diffusion-art.com/samplers/)
- [Hugging Face diffusers 文件](https://huggingface.co/docs/diffusers/index)
- [Civitai](https://civitai.com/)
