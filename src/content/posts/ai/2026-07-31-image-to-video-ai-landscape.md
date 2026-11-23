---
title: "圖生影片技術地圖：2026 年 I2V 的架構、模型與真實價格"
date: 2026-07-31
category: ai
type: deep-dive
tags:
  - image-to-video
  - video-generation
  - video-diffusion
  - diffusion-transformer
  - open-weights
  - veo
  - cosmos
lang: zh-TW
tldr: "圖生影片（I2V）在 2026 年的骨幹清一色是 latent diffusion + DiT，畫質已經不是選型軸，原生音訊也成了標配；真正的軸是能不能自架、授權能不能用在你的市場、每秒多少錢。三個容易踩的坑：Sora 的 app 與 API 都已關閉（2026-04-26、2026-09-24），沒有官方替代；Wan 2.7 與 Wan 3.0 都只有 API，能下載的權重停在 Wan 2.2；Gemini API 已關掉所有 Veo 端點，改由 Gemini Omni 1.2 Flash 接手（720p 約 $0.07/s）。"
description: "拆解 image-to-video 生成的技術管線：3D causal VAE 壓縮、DiT 去噪、條件注入的四種型態、step distillation 與移除 CFG 帶來的加速，並以官方 pricing page 為準整理 Gemini Omni Flash、Kling、Runway 的實際每秒價格，以及開源權重目前真正能自架的選項。"
draft: false
---

> :globe: [English version](/posts/ai/2026-07-31-image-to-video-ai-landscape-en)

給一張圖、一句話，生出一段會動的影片——這件事在 2026 年已經不稀奇，但選型比兩年前更難，因為「畫質」不再是有效的區分軸。[Artificial Analysis 的圖生影片榜 AA-Video-I2V v2.1](https://artificialanalysis.ai/video/leaderboard/image-to-video)（2026-11-23）前十名的 Elo 從 1162 到 1117，95% 區間幾乎全部互相重疊，肉眼分不出高下。真正會影響決策的是別的東西：能不能自架、授權能不能用、控制面板夠不夠細、以及每秒實際多少錢。

這篇把 I2V 的技術管線拆開講，然後用官方 pricing page 而非評測站的數字談成本。查證過程中修正了三個在二手文章裡流傳很廣的錯誤，會在對應段落標出來。

## 一、I2V 難在哪：不是畫質，是約束

2026 年 5 月的 [Image-to-Video Diffusion: From Foundations to Open Frontiers](https://arxiv.org/abs/2605.17248)（arXiv:2605.17248）是目前唯一一份把 I2V 當獨立主題處理的 survey，它開宗明義點出 I2V 跟文生影片（T2V）的差別：

> Compared with broader video generation settings, this task places stricter demands on content consistency, identity preservation, and motion coherence.

拆開來講，T2V 只要「好看且合理」，I2V 還多背三個約束：**內容一致性**（不能長出參考圖裡沒有的東西）、**身分保持**（人臉不能漂掉）、**動作連貫**（不能幀間跳動）。這也是為什麼實務上 I2V 反而比 T2V 好用——參考圖把輸出空間鎖住了，結果更可預測。

該 survey 把整個領域壓成四個設計軸：條件編碼（condition encoding）、時間建模（temporal modeling）、noise prior 設計、時空升採樣（spatial-temporal upsampling）。所有模型的差異基本上都落在這四條線上。

## 二、管線長什麼樣：VAE 壓縮、DiT 去噪、超分收尾

```
參考圖 ──┐
提示詞 ──┼─→ 條件編碼 ──┐
         │              ↓
     3D causal VAE ─→ latent ─→ DiT 去噪 ─→ latent' ─→ VAE 解碼 ─→ 480p/720p
      (壓縮 16×/4×)                                                   ↓
                                                          獨立超分網路 ─→ 1080p
```

三個關鍵設計決定：

**1. 在 latent space 擴散，不在 pixel space。** [HunyuanVideo 1.5 技術報告](https://arxiv.org/abs/2511.18870)（arXiv:2511.18870）的規格很具體：一個 8.3B 參數的 DiT，配上空間壓 16×、時間壓 4×、latent channel 32 的 3D causal VAE。不壓縮的話 token 數直接爆炸，訓練與推論都不可行。

**2. U-Net 讓位給 DiT。** 早期做法是把文生圖的 2D U-Net 插入 1D 時間層（本質是 pseudo-3D），好處是能免費繼承成熟的 T2I backbone。DiT 則把影片切成 spacetime patch 當 token 丟進 Transformer，換來的是可擴展性。survey 明確記錄了這條從 U-Net 到 DiT 的遷移，而現在幾乎所有量產模型都在 DiT 這邊。

**3. Cascade 而非一次到位。** HunyuanVideo 1.5 是兩階段：DiT 先出 480p–720p、5 到 10 秒，再交給獨立的 video super-resolution 網路拉到 1080p。這把「動作生得對不對」和「畫面清不清楚」解耦——動作錯了重生很貴，清晰度不夠則可以便宜地補救。

## 三、可控性全在條件注入這一層

I2V 好不好用，幾乎完全由條件注入的設計決定。survey 歸納出四種型態，控制力遞增：

| 型態 | 代表 | 能做什麼 |
|---|---|---|
| Image-only | [SVD](https://arxiv.org/abs/2311.15127) | 讓圖動起來，但模型猜不到你想要什麼動作 |
| Image + Text | [DynamiCrafter](https://arxiv.org/abs/2310.12190) 起，現在主流 | 用文字說明想要的動態語意 |
| Image + Motion | 軌跡 / camera path / motion field | 指定鏡頭怎麼走、主體往哪動 |
| 多參考圖 / 首尾幀 | Seedance、Kling O3 等 | 鎖角色、鎖起訖畫面、跨鏡頭一致 |

如果你的需求是「商品照要有指定的推鏡」，那第三、四類才是該找的東西，光看榜單 Elo 沒有意義。

## 四、省算力才是主軸：step distillation 與移除 CFG

這一年最值得注意的技術動向不在畫質，在推論成本。三條線同時在推：

**Step distillation。** NVIDIA 在 7 月 20 日開源的 Cosmos3-Super-Image2Video-4Step，[官方說明](https://huggingface.co/blog/nvidia/cosmos3edge)寫得很直白：

> They cut sampling from 50 denoising steps to just 4, and remove the need for classifier-free guidance — which otherwise doubles the work per step — for up to 25× faster inference than the base model, with little to no loss in generation quality.

注意這裡是兩件事疊加：步數砍掉，加上移除 [classifier-free guidance](https://arxiv.org/abs/2207.12598)（CFG 本來每步要算兩次前向傳播）。更有意思的是結果——NVIDIA 表示蒸餾版在 Artificial Analysis 的 I2V 榜上是開源權重第一名，**排在它自己的 teacher 前面**。25× 這個數字來自 NVIDIA 自述，目前沒有第三方複現，讀的時候打點折扣。

**Sparse attention。** HunyuanVideo 1.5 的 SSTA（Selective and Sliding Tile Attention）剪掉冗餘的時空 kv block，官方報告在 10 秒 720p 合成上相對 FlashAttention-3 有 1.87× 的端到端加速。這是針對 DiT 注意力成本隨 token 數平方成長的直接對策。

**Autoregressive 這條支線還沒起來。** 理論上逐塊生成的 AR 模型延伸長片更便宜、長程連貫性更好，但誤差會沿序列累積、每 clip 推論更慢。到目前為止它沒有在量產取代 DiT，多半只是掛在 DiT 模型上的延伸功能。

## 五、模型現況，以及 Sora 的停運

[AA-Video-I2V v2.1](https://artificialanalysis.ai/video/leaderboard/image-to-video) 的 2026-11-23 資料（Elo，含音訊的盲測偏好；$/分鐘是 AA 在它的測試設定下換算的 API 價）：

| 排名 | 模型 | 開發者 | Elo | 取得方式 | $/分鐘 |
|---|---|---|---|---|---|
| 1 | Dreamina Seedance 2.5 | ByteDance | 1162 | 閉源 | $34.12 |
| 4 | Dreamina Seedance 2.0 | ByteDance | 1141 | 閉源 | $22.45 |
| 5 | MiniMax H3 (768p) | MiniMax | 1136 | 開放權重（自訂授權） | $4.80 |
| 12 | Wan 3.0 | 阿里巴巴 | 1110 | 閉源 API | $12.00 |
| 15 | Gemini Omni Flash 1.2 | Google | 1086 | 閉源 API | $6.26 |
| 25 | Kling 3.0 1080p (Pro) | 快手 | 1000 | 閉源 | $10.08 |
| 28 | Veo 3.1 | Google | 955 | 閉源 | $24.00 |

榜單本身要保留：這是盲測偏好的 Elo，跟「你這個 case 好不好用」不是同一件事，而且月月變動。v2.1 把 Kling 3.0 1080p (Pro) 固定在 1000 當基準點，分數跟本文 2026-07 版引用的舊榜（當時 Gemini Omni Flash 1200、Seedance 2.0 1199）不能直接比。前五名的 95% 區間互相重疊，只能當同一梯隊看；表中略過的第 2、3 名是還沒有 API 的 Utopai X 與 Boreal-H3。開放權重的前三名（MiniMax H3、Hyperflow H3、Pika H3 Flex）都是 H3 家族，H3 的授權限制見下一節。各家族的演化與文生影片榜，站上的[影片生成模型家族](/posts/tech/2026-08-26-ai-model-family-video-generation)有完整整理。

**Sora 已經收了。** [OpenAI 官方說明頁](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation)寫得很清楚：

> The Sora web and app experiences were discontinued on April 26, 2026. The Sora API will be discontinued on September 24, 2026.

兩個日期都已過，[API deprecations 頁](https://developers.openai.com/api/docs/deprecations)對 Sora 2 與 Videos API 寫的替代是「No one-to-one replacement」，還接著 Sora 的整合只能換供應商。Google 這邊也一樣：Gemini API 上所有 Veo 端點都已關閉（Veo 3.1 的 preview 端點在 2026-10-22），[官方建議的替代](https://ai.google.dev/gemini-api/docs/deprecations)是 `gemini-omni-1.2-flash`。一年內兩家龍頭的影片 API 都換掉，這是單一供應商風險的現成教材。

## 六、開源這條線：Wan 2.7 一個廣為流傳的錯誤

先講結論：**Wan 2.7 沒有開源權重，是 API-only；2026-08-24 推出的 Wan 3.0 也一樣。**

網路上大量文章（包括我第一輪搜尋撈到的多篇）把 Wan 2.7 描述成 Apache 2.0 開源、可下載自架。查一手來源就會發現對不上：[Wan-Video 的 GitHub organization](https://github.com/Wan-Video) 裡的影片生成主模型只到 [Wan2.2](https://github.com/Wan-Video/Wan2.2)，2026 年新增的是 Wan-Dancer、Wan-Animate-2 這類衍生模型；[Hugging Face 上的 Wan-AI](https://huggingface.co/Wan-AI) 組織，權重同樣只到 Wan2.2 系列，沒有 2.7 或 3.0。[Runpod 的說明](https://www.runpod.io/articles/guides/wan-2-7-runpod)講得最直接：

> You may see third-party posts claiming an Apache 2.0 release for Wan 2.7; that isn't supported by Alibaba's announcement or by anything on Hugging Face.

從 Wan 2.5 開始，Alibaba 就把新世代留在 API 後面，2.2 是最後一代有可下載權重的。所以 Wan 2.7、Wan 3.0 都是雲端 API 模型，不要拿它們當自架方案規劃。

那目前真正能自架的 I2V 是什麼：

| 模型 | 規格 | 授權 |
|---|---|---|
| [Cosmos3-Super-Image2Video-4Step](https://huggingface.co/nvidia/Cosmos3-Super) | 720p、189 frames @ 24fps（約 8 秒）、4 步取樣 | OpenMDW 1.1，可商用 |
| [HunyuanVideo 1.5](https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5) | 8.3B DiT，480p–720p 再超分到 1080p，主打消費級 GPU 可跑 | Tencent Hunyuan Community |
| [LTX-2.3](https://huggingface.co/Lightricks/LTX-2.3) | 22B distilled 檢查點，音訊影片同步生成，文字編碼器用 gemma-3-12b | 自訂 LTX license（**不是** Apache 2.0，v1 的 LTX-Video 才是） |
| [Wan 2.2](https://github.com/Wan-Video/Wan2.2) | I2V-A14B / TI2V-5B，480p 與 720p | Apache 2.0 |
| [MiniMax H3](https://huggingface.co/MiniMaxAI/MiniMax-H3) | 開放的是 H3-Base，輸出 768p、單次 4–15 秒、原生立體聲；2K 版要走 API | MiniMax H3 Community License（排除美國、歐盟、英國、南韓；年營收超過 2,000 萬美元要另取書面授權） |

LTX 這條線後來還有 [LTX-2.5](https://huggingface.co/Lightricks/LTX-2.5)，權重在 2026-07 上架 Hugging Face，下載前要同意授權，授權同樣是 LTX-2.x 社群授權而非 Apache 2.0。MiniMax H3 是目前 AA 圖生影片榜上分數最高的開放權重，但它的授權直接排除了美國與歐盟，用之前先確認使用者與營運地點；條件不符的話，無地區限制又能商用的選擇還是 Wan 2.2 與 Cosmos 3。

Cosmos 3 的定位要特別注意：NVIDIA 把它做成 physical AI 的 world foundation model，目標是機器人、自駕、工業模擬的合成訓練資料，不是拍片工具。拿它做創意內容會覺得手感怪，那是因為它本來就不是為此而生。

## 七、價格：Google、Runway、Kling 的官方數字

本文 2026-07 版寫的是 Veo 3.1 在 Gemini API 的價格（Standard 含音訊 $0.40/s、Fast $0.10–$0.30/s、Lite $0.05–$0.08/s），當時二手評測站給的數字從 $0.03/s 到 $0.75/s 都有，落差 25 倍。這些 Veo 端點已在 Gemini API 關閉，Google 在 Gemini API 上的影片模型換成 Gemini Omni 1.2 Flash，改按輸出 token 計價（每百萬 token $12.00）。[官方 pricing 頁](https://ai.google.dev/gemini-api/docs/pricing)把它換算成每秒價格：

| 解析度 | 每秒輸出 token | 約每秒價格 |
|---|---|---|
| 360p | 1,931 | $0.023 |
| 720p | 5,792 | $0.07 |
| 1080p（升頻） | 8,688 | $0.104 |
| 4K（升頻） | 17,376 | $0.209 |

Veo 3.1 本身還能用：Google 的 deprecations 頁把 GA 版 Veo 指向 Google Cloud 的 Gemini Enterprise Agent Platform，Runway 上也仍在賣。

[Runway 的官方 API 定價](https://docs.dev.runwayml.com/guides/pricing/)以 credit 計，1 credit = $0.01：`gen4.5` 是 12 credits/s（$0.12/s）、`gen4_turbo` 5 credits/s（$0.05/s）、`veo3.1 (audio)` 40 credits/s（$0.40/s，跟 Veo 3.1 當時在 Gemini API 的價格相同）。2026 下半年 Runway 把 Wan 3.0、Seedance 2.5、MiniMax H3、Kling 4.0 等第三方模型都接進同一份價目表，例如 `wan3` 1080p 20 credits/s、`seedance2_5` 1080p 68 credits/s，比價時可以直接拿這份表當同一個通路的對照。

Kling 的官方 API 文件在登入牆後面，但 2026-02-06 的 VIDEO 3.0 User Guide 費率被[多](https://evolink.ai/blog/kling-3-o3-api-official-discount-pricing-developers)[個](https://apiframe.ai/blog/ai-video-api-pricing-2026)來源一致引用：無音訊 6 credits/s（720p）、8 credits/s（1080p）；含原生音訊 9 / 12 credits/s；voice control 再加 2 credits/s。換算美金要看預付包，單價落在 $0.10–$0.14 per unit，所以 720p 無音訊大約 $0.06–$0.084/s。

一個常被忽略的細節：Kling 的 API 失敗任務不扣 credit，消費端 app 則會扣。做大量迭代時這個差異不小。

## 八、限制：長片還是接出來的

本文 2026-07 版寫「Veo 3.1 是唯一一次生成就給同步音訊的」，這句當時就不精確（Kling 3.0、Seedance 2.0 都已內建原生音訊），現在更不成立：AA 的 I2V v2.1 主榜本身就是含音訊的評測，Seedance 2.5、MiniMax H3、Wan 3.0、Gemini Omni Flash 都把音訊和畫面放在同一個生成過程。要算總成本時，該注意的反而是你用的方案有沒有把音訊另外計價，例如 Kling 3.0 有音訊與無音訊是兩種費率。

更根本的限制是時間長度。整個 DiT 家族共享同一組 failure mode：注意力成本隨 token 數平方成長讓長片指數級變貴，而長程時間連貫性本來就弱。這不是工程細節，是還沒解決的研究問題——ICML 2026 直接開了一整場 workshop（[From Frames to Stories](https://icml2026-f2s-workshop.github.io)）談這件事，它的問題陳述值得原文引用：

> Across minutes of generation, current systems often suffer from identity drift, scene inconsistency, narrative breakdown, and weak responsiveness to user intent.

實務上的意思是：單次生成的上限在 2026 下半年拉長了（Wan 3.0、Seedance 2.5、Kling 4.0 標稱 30 秒，Gemini Omni 1.2 Flash 15 秒），但分鐘級的長片仍然會漂。長片請當成多個 shot 接起來的工程問題，不要指望一次生成。

## 整體來說

選型順序建議倒過來想，先問自己四個問題：

1. **還在用 Sora 或 Gemini API 的 Veo 端點嗎？** 這兩組都已關閉，先遷移。Veo 的官方替代是 Gemini Omni 1.2 Flash；Sora 沒有官方替代，照下面的條件挑。
2. **資料能不能出門？量大不大？** 要自架就從 HunyuanVideo 1.5 或 LTX 系列開始；MiniMax H3 分數最高，但先確認授權地區與營收門檻；Wan 系列請認 2.2，不要被 2.7、3.0 的開源傳言誤導。
3. **需要多細的控制？** 要指定鏡頭運動、鎖角色、跨鏡頭一致，就去看多參考圖與 motion 條件的支援，不是看榜。Runway 的控制面板仍是這批裡最好的，即使它的 Elo 已經被超車。
4. **成本結構是什麼？** 按每秒算，Gemini Omni 1.2 Flash 的 360p 草稿（約 $0.023/s）到 Seedance 2.5（AA 換算約 $0.57/s）差二十多倍，先用便宜的層級迭代，再確認你的通路真的需要哪個畫質層級。

最後提醒一句：這個領域的資訊半衰期很短，而且二手內容的錯誤率高得驚人。這篇 2026-07 版處理過的 Wan 2.7 授權和 Veo 價格，都是廣為流傳但錯誤的說法；短短四個月後，Veo 與 Sora 的 API 也都已關閉。要下採購決定前，回官方 pricing page 和官方 repo 各看一眼，成本很低，省下的麻煩很大。

## 更新紀錄

- 2026-11-23：資料更新到 2026-11。榜單改用 AA-Video-I2V v2.1（2026-11-23，含音訊、Kling 3.0 Pro 固定為 1000），註明不能跟舊榜分數比；Sora 改為 app 與 API 皆已關閉、無官方替代，補上 Gemini API 的 Veo 端點全數關閉、替代為 Gemini Omni 1.2 Flash；價格段把 Veo 3.1 的 Gemini API 價改為歷史，新增 Omni 1.2 Flash 的 token 計價換算與 Runway 新增的第三方模型價；開源段補 Wan 3.0 同樣無權重、MiniMax H3（含授權地區限制）與 LTX-2.5。修正錯誤：原寫「Veo 3.1 是唯一一次生成就給同步音訊的」，當時已不精確，改寫為原生音訊已是主流；單次生成長度改為 15–30 秒。

## 參考資料

**論文與技術報告**

- [Image-to-Video Diffusion: From Foundations to Open Frontiers (arXiv:2605.17248)](https://arxiv.org/abs/2605.17248)
- [HunyuanVideo 1.5 Technical Report (arXiv:2511.18870)](https://arxiv.org/abs/2511.18870)
- [Scalable Diffusion Models with Transformers (arXiv:2212.09748)](https://arxiv.org/abs/2212.09748)
- [Classifier-Free Diffusion Guidance (arXiv:2207.12598)](https://arxiv.org/abs/2207.12598)
- [Stable Video Diffusion (arXiv:2311.15127)](https://arxiv.org/abs/2311.15127)
- [DynamiCrafter (arXiv:2310.12190)](https://arxiv.org/abs/2310.12190)
- [From Frames to Stories Workshop @ ICML 2026](https://icml2026-f2s-workshop.github.io)

**模型與 repo**

- [Introducing Cosmos 3 Edge (NVIDIA)](https://huggingface.co/blog/nvidia/cosmos3edge)
- [nvidia/Cosmos3-Super (Hugging Face)](https://huggingface.co/nvidia/Cosmos3-Super)
- [Tencent-Hunyuan/HunyuanVideo-1.5 (GitHub)](https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5)
- [Lightricks/LTX-2 (GitHub)](https://github.com/Lightricks/LTX-2)
- [Lightricks/LTX-2.3 (Hugging Face)](https://huggingface.co/Lightricks/LTX-2.3)
- [Wan-Video/Wan2.2 (GitHub)](https://github.com/Wan-Video/Wan2.2)
- [Wan-AI (Hugging Face organization)](https://huggingface.co/Wan-AI)
- [MiniMaxAI/MiniMax-H3 (Hugging Face)](https://huggingface.co/MiniMaxAI/MiniMax-H3)
- [MiniMax H3 Community License](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE)
- [Lightricks/LTX-2.5 (Hugging Face)](https://huggingface.co/Lightricks/LTX-2.5)

**官方定價與公告**

- [Gemini Developer API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Runway API Pricing & Costs](https://docs.dev.runwayml.com/guides/pricing/)
- [Gemini API deprecations](https://ai.google.dev/gemini-api/docs/deprecations)
- [What to know about the Sora discontinuation (OpenAI)](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation)
- [OpenAI API deprecations](https://developers.openai.com/api/docs/deprecations)
- [Kling 3.0 vs O3 API Pricing (EvoLink)](https://evolink.ai/blog/kling-3-o3-api-official-discount-pricing-developers)
- [AI Video API Pricing in 2026 (Apiframe)](https://apiframe.ai/blog/ai-video-api-pricing-2026)
- [Wan 2.7 on Runpod：開源權重狀態說明](https://www.runpod.io/articles/guides/wan-2-7-runpod)
- [AA-Video-I2V v2.1 Leaderboard（Artificial Analysis）](https://artificialanalysis.ai/video/leaderboard/image-to-video)
- [Image-to-Video Leaderboard 2026-07 快照（Artificial Analysis / BenchmarkList）](https://benchmarklist.com/arenas/artificial_analysis_image_to_video)

**站內相關文章**

- [影片生成模型家族——Sora 退場之後，Wan 3.0、MiniMax H3、Gemini Omni Flash 與 Kling 4.0 的新格局](/posts/tech/2026-08-26-ai-model-family-video-generation)
- [3D 生成式模型走到哪了：從 Lyra 2.0 拆解 2026 年的技術地圖](/posts/ai/2026-07-22-3d-generative-models-landscape)
- [2026 做 3D 模型的工具地圖：AI 生成、掃描、CAD、手工建模怎麼選](/posts/ai/2026-07-27-3d-modeling-tools-landscape)
- [用 AI Agent 操作影片生成工具：HyperFrames、HeyGen、Runway 整合指南](/posts/ai/2026-05-10-ai-agent-video-generation)
