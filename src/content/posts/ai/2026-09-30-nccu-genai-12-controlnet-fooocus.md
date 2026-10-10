---
title: "政大蔡炎龍 生成式AI L12：ControlNet 與 Fooocus——怎麼讓生圖 AI 照你的構圖畫？"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, generative-ai, ai-course, diffusion-model, image-generation, stable-diffusion]
lang: zh-TW
series:
  name: "政大蔡炎龍 生成式AI 導讀"
  order: 12
tldr: "L11 的 Stable Diffusion 只聽 prompt，構圖、姿勢全看運氣。L12 補上「方向盤」：ControlNet 把 SD 的區塊拷貝一份，用 zero convolution 接回去，讓邊緣圖、姿勢、深度圖這類額外條件也能控制生成，最常見的例子是 Canny 邊緣。後半講 Fooocus：一個目標是「像 Midjourney 一樣簡單」的 SD 介面，重點在 Preset、Style，以及 Input Image 的五個功能，其中 Image Prompt 就是包裝好的 ControlNet。第十二週作業：設想一個應用情境，用 Fooocus 至少生 3 組圖，並寫出創作流程。"
description: "政大蔡炎龍「生成式 AI：文字與圖像生成的原理與實務」1132 學期第 12 講導讀：ControlNet 的用途與架構（拷貝區塊、zero convolution）、Canny 邊緣偵測、Stop At 與 Weight 兩個參數；Fooocus 的安裝、Preset 與 Style、Input Image 五大功能（Upscale/Variation、Image Prompt、Inpaint/Outpaint、Describe、Metadata）、FramePack 簡介，以及長庚衛星班版第十二週作業的題目與評分標準。"
draft: false
glossary:
  - term: "zero convolution"
    aliases: ["零卷積"]
    definition: "權重與偏差都初始化為 0 的 1×1 卷積。ControlNet 用它把可訓練的拷貝接回原模型，訓練剛開始時輸出是 0，不會破壞原本已經學好的 Stable Diffusion。"
    context: "L12 投影片的 ControlNet 架構圖，在可訓練 clone 的前後各放一個 zero convolution。"
    links:
      - label: "Zhang et al. 2023（ControlNet）"
        url: "https://arxiv.org/abs/2302.05543"
  - term: "Canny 邊緣偵測"
    aliases: ["Canny edge detection", "Canny"]
    definition: "一種經典的影像處理演算法，把照片轉成只剩輪廓線的黑底白線圖。ControlNet 最常見的用法，就是拿這張描邊圖當條件，讓新生成的圖沿用原圖的構圖。"
    context: "L12 用同一張照片示範：原圖 → Canny 描邊 → ControlNet 生成新圖。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nccu-genai-12-controlnet-fooocus-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

**本文依據政大蔡炎龍「生成式 AI：文字與圖像生成的原理與實務」2025 春季（政大學期代碼 1132）版。** 這是[政大蔡炎龍 生成式AI 導讀](/posts/ai/2026-09-30-nccu-genai-course-overview)系列第 12 篇，接續 [L11 文字生圖 AI 的原理及實作](/posts/ai/2026-09-30-nccu-genai-11-text-to-image)。

用到的官方材料有三份：[第 12 講錄影](https://www.youtube.com/watch?v=3TdC6xb1RfY)（2025-05-06，3 小時 12 分）、投影片 [GenAI12 ControlNet 與 Fooocus](https://drive.google.com/file/d/15-cHR3PSoGVmXj0yrrzCksDJQ1fcVtir/view)（33 頁），以及[長庚衛星班課程頁](https://yangchihyuan.github.io/courses/GenerativeAI2025)上的第十二週作業說明。存取等級是 **A3**：錄影、投影片、作業題目與評分標準都公開。這一講沒有對應的 [AI-Demo](https://github.com/yenlung/AI-Demo) notebook，實作用的是 [Fooocus](https://github.com/lllyasviel/Fooocus) 這套開源軟體本身。

## 課程影片來源

影片來源已對照官方課程頁，並於 2026-10-10 即時查核：講次與影片一致，YouTube 公開且可嵌入。不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=3TdC6xb1RfY
title: 【生成式 AI】12. ControlNet 與 Fooocus（YouTube 錄影，2025-05-06）
```

原始影片：[【生成式 AI】12. ControlNet 與 Fooocus（YouTube 錄影，2025-05-06）](https://www.youtube.com/watch?v=3TdC6xb1RfY)

課程與錄影入口：

- [官方課程與錄影入口](https://yangchihyuan.github.io/courses/GenerativeAI2025)

查核日期：2026-10-10。

## 本週在課程中的位置

L10 從 VAE 講到 latent，L11 把 Stable Diffusion 拆成 U-Net、CLIP、排程器、LoRA，並用 diffusers 做出生圖 Web App。做過的人很快會碰到一個問題：prompt 只能描述「要什麼」，沒辦法精準指定「長什麼樣」。人物要擺什麼姿勢、構圖怎麼排，全看模型心情。

L12 要回答的就是這件事：**怎麼控制生成的結果？** 它是圖像生成三講的收尾，前半講原理（ControlNet），後半換成純工具實作（Fooocus）。

錄影章節大致是這樣：19:30 開始 ControlNet，30:14 進入 Fooocus 的安裝與介面，第二節（1:17 起）講 Input Image 的進階功能、Inpaint、CPDS 動作控制，1:56 介紹 FramePack，2:25 之後是助教課。

## ControlNet：替生圖裝上方向盤

投影片第 3 頁用四句話定義 ControlNet：

- 一種用來**控制** Stable Diffusion 圖像生成的擴充架構
- 由張呂敏（Lvmin Zhang）等人在 2023 年提出（[論文](https://arxiv.org/abs/2302.05543)）
- 透過「額外的輸入條件」控制生成，例如姿勢線條、邊緣圖、深度圖
- 對創作者來說，它是「為圖像生成裝上方向盤」

### 最常見的例子：Canny 邊緣

第 4、5 頁用同一張吃冰淇淋的照片示範整個流程。先用 **Canny 邊緣偵測**把照片轉成黑底白線的描邊圖，再把描邊圖交給 ControlNet，生出一張構圖、姿勢都一樣，但人物、衣服、背景全換過的新圖。

這就是「為什麼叫 Canny 模型」：ControlNet 本身是一個架構，實際使用時會依條件種類訓練不同的版本。吃邊緣圖的那一版，大家就叫它 Canny 模型。

### 架構：拷貝一塊 SD，在外面訓練再送回去

第 6 頁的架構圖只有幾個方塊，但抓住了 ControlNet 的核心設計：

1. 原本 SD 的某個區塊**鎖住**（圖上畫了一個鎖頭），參數不動
2. 把這個區塊**拷貝一份**，拷貝的那份可以訓練
3. 條件 c（例如 Canny 描邊圖）先經過一個 **zero convolution**，加到輸入 x 上，再送進可訓練的拷貝
4. 拷貝的輸出再經過一個 zero convolution，加回原區塊的輸出 y

老師的一句話總結是：「拷貝一塊 Stable Diffusion 的區塊，在『外面』訓練再送回去。」

為什麼要用 zero convolution？它的權重一開始全是 0，所以訓練剛開始時，外掛那一路的輸出也是 0，整個模型的行為跟原本的 SD 一模一樣。訓練過程中，控制訊號才一點一點滲進去。原本花大錢學好的 SD 不會在第一步就被弄壞。

<details>
<summary>用算式看 ControlNet 的一個區塊</summary>

設原本的區塊是 F(·; Θ)，參數 Θ 鎖住；拷貝的參數是 Θc，可以訓練；Z(·; Θz1)、Z(·; Θz2) 是兩個 zero convolution。ControlNet 區塊的輸出是：

y_c = F(x; Θ) + Z( F( x + Z(c; Θz1); Θc ); Θz2 )

訓練剛開始時 Θz1、Θz2 全為 0，第二項就是 0，所以 y_c = F(x; Θ)，跟原模型相同。細節見 [ControlNet 論文](https://arxiv.org/abs/2302.05543)第 3 節。

</details>

### 兩個可以調的參數：Stop At 與 Weight

第 7 頁把 SD 的去噪過程畫成一排 U-Net 步驟，說明 ControlNet 的條件不一定要全程介入。圖上標了兩個參數，投影片的說法是「我們的『想法』至少有兩個參數可以調整」：

- **Stop At**（圖中是 0.5）：控制條件只在前面一段步驟生效，後面就放手讓模型自由發揮
- **Weight**（圖中是 0.6）：控制條件的影響力有多大

直覺是：去噪的前幾步決定大構圖，後幾步補細節。Stop At 設小一點，構圖會照你的描邊，細節則留給模型。這兩個參數之後在 Fooocus 的 Image Prompt 進階選項裡會再出現。

## Fooocus：像 Midjourney 一樣簡單的 Stable Diffusion

投影片第二部分的標題是「簡單易用圖像生成」。[Fooocus](https://github.com/lllyasviel/Fooocus) 跟 ControlNet 出自同一位作者（GitHub 帳號 lllyasviel），投影片說它的目標是「像 Midjourney 一樣簡單的 Stable Diffusion」，是 SD 的新 Web UI。

> 查證時要注意：Fooocus 的 README 現在寫著專案進入「Limited Long-Term Support (LTS) with Bug Fixes Only」，只修 bug、不再加新功能，而且整套建立在 SDXL 上。想用 Flux 等較新的模型，README 建議改用同作者的 WebUI Forge 或 ComfyUI。這是 2026-09-30 查詢時的狀態，1132 課堂上沒有提到。

### 安裝

投影片分兩種平台：

- **Windows**：到 GitHub 找到下載檔，解壓縮到想放的資料夾，執行 `run.bat`
- **Mac／Linux**：先裝 Anaconda（Mac 要注意 Apple Silicon 選對版本），再執行：

```bash
cd
git clone https://github.com/lllyasviel/Fooocus.git
cd Fooocus
conda env create -f environment.yaml   # 建一個叫 fooocus 的虛擬環境
conda activate fooocus
pip install -r requirements_versions.txt
```

投影片到這裡為止。依 [README](https://github.com/lllyasviel/Fooocus#mac)，最後用 `python entry_with_update.py` 啟動，第一次執行會自動下載 SDXL 模型，要等一段時間。README 也寫明 Mac「沒有經過密集測試」，Apple Silicon 沒有獨立顯卡，生圖會比有 NVIDIA 顯卡的電腦慢很多。Windows 的最低需求是 4GB VRAM 的 NVIDIA 顯卡加 8GB 記憶體。

沒有合適電腦的人，錄影 39:57 有一段「Fooocus 在 Colab 實作」。Fooocus README 本身提供一個[官方 Colab notebook](https://colab.research.google.com/github/lllyasviel/Fooocus/blob/main/fooocus_colab.ipynb)，並註明免費版 Colab 會關掉 refiner，Image Prompt 這類較吃資源的功能可能讓免費版斷線。

### 基本使用：只打 prompt 就好

打開介面，輸入 prompt、按 Generate。投影片特別強調：**不需要下 negative prompt，因為 Fooocus 幫你下了。**示範的 prompt 是「a very cute Shiba Inu」，預設設定生出來的柴犬就已經有一定水準。

勾選 **Advanced** 之後，右側多出幾個分頁：

- **Setting → Preset**：initial、anime、sai、lightning、default、realistic、lcm。第 18 頁把同一個柴犬 prompt 在七種 Preset 下的結果排在一起，anime 會變成動畫風的柴犬，realistic 偏照片質感
- **Style**：風格選項非常多，投影片列了 Flat 2D Art、Pixel Art、Origami、Sketchnote、Papercraft、Sumi E 等，說「只有一小部份」

### Input Image 的五大功能

投影片說一直沒有點開的 Input Image 是「開啟魔法世界」的入口：配合 Advanced，可以在很少、甚至沒有 prompt 的情況下，產生有意思的作品。它有五個分頁：

| 功能 | 投影片的說明 |
|---|---|
| Upscale or Variation | 像 Midjourney 的 U（放大）和 V（類似變化） |
| Image Prompt | 包裝得很友善的 ControlNet |
| Inpaint or Outpaint | 就是 Inpaint 和 Outpaint：局部重畫，或往圖外延伸 |
| Describe | AI 描述圖的內容，可以當成之後的 prompt |
| Metadata | 之前生成的圖，可以看到 prompt 等資訊 |

第 25 頁回扣上半堂：**Image Prompt 基本上就是 ControlNet。**它最多可以放 4 張參考圖，記得點開下方的 Advanced，每張圖可以選一種控制方式：

- **ImagePrompt**：風格參考
- **PyraCanny**：照邊描繪，也就是前面講的 Canny
- **CPDS**：照動作畫
- **FaceSwap**：照人物畫

錄影第二節（1:21:44 起）逐一示範這些功能，包括「如何固定角色」、用 Inpaint 改髮色、多圖輸入加 CPDS 控制動作，最後快速帶過 Models 分頁的 Refiner、LoRA 和 Developer Debug Mode。

## 延伸：FramePack，在自己電腦上生影片

投影片最後一小節介紹同一位作者的 [FramePack](https://github.com/lllyasviel/FramePack)，標語是「在自己的電腦上做影片生成」。Linux 的安裝步驟跟 Fooocus 類似：clone repo、用 conda 建 Python 3.10 環境、裝 CUDA 12.6 版的 PyTorch，再裝 requirements。FramePack 的 README 寫明支援 Linux 與 Windows，GPU 記憶體至少 6GB。這段只是介紹，作業沒有用到。

## 作業拆解：第十二週（長庚衛星班版本）

題目是「AI 圖像生成創作任務：打造你的 Fooocus Workflow！」，以下依[長庚衛星班課程頁](https://yangchihyuan.github.io/courses/GenerativeAI2025)的文字整理，繳交期限是 2025-05-19。

**要做的事：**

1. 設想一個應用情境，例如社群平台用圖、簡報圖、網站視覺元素、個人品牌圖像
2. 用 Fooocus 至少生成 3 組圖像，同一張圖的輸入與輸出算一組
   - 輸入：為每張圖寫簡短說明，例如用了 Fooocus 哪些功能（prompt 設定、Style、Inpaint、Canny 等）
   - 輸出：生成的圖
3. 整理這份作業的創作流程（文字或流程圖都可以），讓助教看懂你從靈感、設定、試圖改善到輸出的步驟
4. 整體使用心得

可以交 Colab 連結或 PDF。

**評分標準：**

| 分數 | 條件 |
|---|---|
| 0 | 程式連結打不開，也沒有截圖 |
| 2 | 跟老師的設定／prompt 一模一樣 |
| 4 | 只交生成圖片 |
| 6 | 跟老師示範大同小異 |
| 7–10 | 3 組以上圖片且達成作業要求，依創意程度給分 |

**自學時怎麼做：**這份作業看重的是「流程」，圖好不好看反而其次。建議挑一個真的會用到的情境（例如下一次簡報的封面），第一組只用 prompt 加 Style，第二組拿一張草圖或照片走 PyraCanny，第三組用 Inpaint 修掉第二組不滿意的地方。三組剛好串成「想法 → 構圖控制 → 局部修正」的一條工作流，寫流程說明時也有東西可以寫。

政大本校的評分方式不同（Fall 2026 課綱是作業及反思 75%），校外讀者只能照這份標準自評。

## 自學檢查點

1. ControlNet 為什麼要把原本的 SD 區塊鎖住，另外拷貝一份來訓練？
2. zero convolution 在訓練一開始的輸出是多少？這對保護原模型有什麼好處？
3. 把 Stop At 從 1.0 調到 0.3，你預期生成結果會怎麼變？
4. Fooocus 的 Image Prompt 裡，PyraCanny 和 CPDS 分別在控制什麼？
5. 想讓同一個角色出現在三張不同場景的圖裡，你會用 Input Image 的哪個功能？

<details>
<summary>參考答案</summary>

1. 原本的 SD 是用大量資料訓練好的，直接微調容易把它學壞；鎖住原區塊、只訓練拷貝，原本的能力就被保留下來。
2. 是 0。所以訓練剛開始時，整個模型的輸出跟原本的 SD 完全一樣，控制訊號是慢慢加進去的。
3. 條件只在前 30% 的去噪步驟生效。大構圖大致還會跟著描邊，細節則交給模型自由發揮，跟原圖的相似度會降低。
4. PyraCanny 控制輪廓與構圖（照邊描繪），CPDS 控制人物動作（照動作畫）。
5. 投影片的對應是 Image Prompt 裡的 FaceSwap（照人物畫）。錄影 1:25:34 有一段「如何固定角色呢？」，可以對照老師實際怎麼操作。

</details>

## 延伸閱讀

本篇自己講完整，想往下挖再看這些：

- 條件生成與 classifier-free guidance 的數學：[MIT 6.S184 L3B：Guidance 與 classifier-free guidance](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance)
- Diffusion 模型從 DDPM 到 latent diffusion：[CS231N L14：生成模型（二）Diffusion](/posts/ai/2026-09-30-cs231n-generative-models-diffusion)
- ControlNet 在 2023 年電腦視覺研究裡的位置：[2023 AI 頂會導讀：電腦視覺篇](/posts/ai/2026-08-24-ai-conference-2023-cv)

系列導覽：[系列總覽](/posts/ai/2026-09-30-nccu-genai-course-overview)｜上一篇 [L11 文字生圖 AI 的原理及實作](/posts/ai/2026-09-30-nccu-genai-11-text-to-image)｜下一篇 [L13 強化學習與生成式 AI 綜合應用](/posts/ai/2026-09-30-nccu-genai-13-reinforcement-learning)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。對照官方課程頁與 YouTube，講次與嵌入影片一致、可公開嵌入，狀態改為已附影片。

## 參考資料

- [長庚衛星班課程頁：生成式AI：文字與圖像生成的原理與實務 2025（課表、第十二週作業與評分標準）](https://yangchihyuan.github.io/courses/GenerativeAI2025)
- [【生成式 AI】12. ControlNet 與 Fooocus（YouTube 錄影，2025-05-06）](https://www.youtube.com/watch?v=3TdC6xb1RfY)
- [1132 生成式 AI 錄影播放清單](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv)
- [GenAI12 ControlNet 與 Fooocus 投影片（Google Drive）](https://drive.google.com/file/d/15-cHR3PSoGVmXj0yrrzCksDJQ1fcVtir/view)
- [1132 投影片資料夾入口（yenlung.me/1132GenAI）](https://yenlung.me/1132GenAI)
- [Zhang, Rao, and Agrawala 2023：Adding Conditional Control to Text-to-Image Diffusion Models（ControlNet）](https://arxiv.org/abs/2302.05543)
- [lllyasviel/Fooocus（GitHub，含安裝說明與專案狀態）](https://github.com/lllyasviel/Fooocus)
- [Fooocus 官方 Colab notebook](https://colab.research.google.com/github/lllyasviel/Fooocus/blob/main/fooocus_colab.ipynb)
- [lllyasviel/FramePack（GitHub）](https://github.com/lllyasviel/FramePack)
