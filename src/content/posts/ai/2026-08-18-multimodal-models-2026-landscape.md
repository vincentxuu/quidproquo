---
title: "2026 上半年多模態模型盤點：原生融合 vs. 外接視覺，以及排行榜為什麼會互相打臉"
date: 2026-08-18
type: deep-dive
category: ai
tags: [multimodal, vision-language-model, llm, benchmark, native-multimodal]
lang: zh-TW
tldr: "純圖片理解已經打平：MMMU-Pro 上四家前沿模型全部過 80%，差距在 3 分內。真正分勝負的是影片、長文件 OCR、即時語音這幾條軸線，各有不同的領先者。但整理這些排名時最該學的一課，是兩份都算可信的來源對同一個 Video-MME 給出的榜首可以差超過 10 分，而且不是同一家。七月與八月又各換過一輪。"
description: "整理 2026 上半年 Claude、Gemini、GPT、Qwen 等多模態模型的架構路線、benchmark 分歧與已知限制，說明為何生產環境更常見依模態路由，以及讀 benchmark 時該做的來源核對。"
draft: false
---

多模態模型這兩年的進展，已經從「能不能看懂一張圖」演化成「能不能像人一樣，同時用眼睛、耳朵、長時間注意力理解一段跨越數小時的影片或會議，並即時做出反應」。

這篇盤點 2026 上半年的狀況。**先講一個貫穿全文的方法問題**，因為它比任何單一分數都重要：整理這些排名時我發現，兩份都算可信的來源，對同一個 benchmark 的榜首給出的答案可以差超過 10 分。所以下面每個數字我都標了來源與日期——這不是謹慎過頭，是這個領域現在的必要條件。

## 圖片理解這條線已經打平

以 2026 年 4 月的橫向比較看，四家前沿模型在 MMMU-Pro 上都過了 80%，彼此差距不到 3 分：[Digital Applied 的整理](https://www.digitalapplied.com/blog/multimodal-ai-benchmarks-2026-vision-audio-code)給的是 GPT-5.5 的 82.8、Gemini 3 Deep Think 的 82.1、Claude Opus 4.7 的 81.4、Qwen3.5-Omni 的 81.0。

這批分數是二手整理。能對到一手的是 Google 自己的 [Gemini 3 發布文](https://blog.google/products-and-platforms/products/gemini/gemini-3)，它寫的是 Gemini 3 Pro 在 MMMU-Pro 拿 81%。

Google 在[評測方法說明](https://storage.googleapis.com/deepmind-media/gemini/gemini_3_pro_model_evaluation.pdf)裡還註記了一件很多人不會注意的事：表中競品的 MMMU-Pro 與 Video-MMMU 分數，是 Google 自己用對方 API 跑出來的，因為找不到對方自報或官方榜單的數字。**由競爭對手代跑的分數，本身就值得打個折。**

MMMU-Pro 飽和之後，真正分勝負的是幾條細分軸線。

## 兩條架構路線

**Native / early fusion** 由 Gemini 和 Qwen3.5 系列代表：圖像 patch、影片時序幀、音訊波形、文字 token 一開始就投影到同一個潛在空間，用同一組 transformer 層做跨模態 attention。音訊直接從原始波形編碼，不經過語音轉文字，因此保留語氣、音色、背景聲這些轉錄會丟掉的資訊。[Gemini 2.5 技術報告](https://arxiv.org/abs/2507.06261)自己的用詞是「natively multimodal models」，並列出可處理長達 3 小時的影片內容。

（坊間常把「Unified Multimodal Token Interleaving」當成該報告的原文術語。我在報告的摘要與導論裡找不到這個字串，出處看起來是第三方整理站而非 Google，所以這裡不引用。）

Qwen 這一代的轉變最能說明趨勢。[NVIDIA 技術部落格](https://developer.nvidia.com/blog/develop-native-multimodal-agents-with-qwen3-5-vlm-using-nvidia-gpu-accelerated-endpoints)記錄了 Qwen3.5 的規格：397B 總參數、17B active 的原生多模態 MoE。

上一代 Qwen3（純文字）與 Qwen3-VL（純視覺）是兩條獨立產品線，Qwen3.5 直接合併成一個模型，**不再需要獨立的視覺 adapter**。技術分析者 Maxime Labonne 在[部落格](https://medium.com/@mlabonne/qwen3-5-nobody-agrees-on-attention-anymore-4709e1bd014b)裡的說法是：「Early fusion training on multimodal tokens means the model doesn't need a separate vision adapter.」

音訊這條線走得最遠的是 Qwen3.5-Omni。[官方技術報告](https://arxiv.org/abs/2604.15804)（2026-04）描述的 Thinker-Talker 架構是這樣分工的：Thinker 處理全模態訊號並輸出文字，Talker 接收多模態輸入與 Thinker 的文字輸出，同步做語音生成，兩者都用 Hybrid Attention MoE。

規格上它支援 256k context、超過 10 小時的音訊輸入，以及 400 秒、1 FPS 的 720P 音視訊。報告另外提出 ARIA（Adaptive Rate Interleave Alignment）來處理串流語音合成的不穩定，那個不穩定的根源是文字與語音 tokenizer 的編碼效率不一致。

**Adapter / 後接式**目前是 Claude 的選擇。[Claude 官方文件](https://docs.anthropic.com/en/docs/about-claude/models/overview)明確寫著「All current Claude models support text and image input」，不含原生音訊或影片。

這看起來是刻意的產品定位而非技術限制：它主打文件密集型工作，單次 API 請求最多可帶 600 張圖片。這個數字有條件，600 適用於 200k context 以外的模型，200k context 的模型上限是 100 張，claude.ai 則是每則訊息 20 張。

至於 Anthropic 為什麼不做音訊與影片，我沒找到官方說法，只找得到第三方推測。這是一塊沒有公開解釋的策略留白。

## 影片：兩份來源打架的地方

一般開放領域影片問答看 Video-MME。[llm-stats 的榜](https://llm-stats.com/benchmarks/video-mme)上前三名是位元組跳動的 Seed 2.1 Pro（89.2%）與 Seed 2.1 Turbo（89.0%），接著才是 Qwen3.7-Plus（88.0%）——中文圈常說的「Qwen 拿下 Video-MME」其實是第三名。

但前面那份 Digital Applied 的四月分析，同一個 Video-MME 寫的榜首是 Gemini 3 Deep Think 的 78.4%，還說領先第二名 7 分。**兩者相差超過 10 分，榜首根本不是同一家。**

這不是誰造假，是兩份來源的模型池與評測設定不同：一個是持續更新的公開榜，另一個是特定時間點挑四家旗艦做的橫向比較，連受測模型清單都不一樣。實務含意很直接：**引用 benchmark 分數時只搬數字而不搬來源與日期，讀者根本無法判斷你在講哪一場比賽。**

教育類長影片的知識吸收則看 Video-MMMU，Google 的發布文給的是 Gemini 3 Pro **87.6%**（該文發布於 2025 年 11 月，之後 Gemini 已迭代到 3.1 Pro 以上）。兩個 benchmark 測的能力不同，不能混為一談說「某家影片理解最強」。

### 更嚴格的計分會讓分數腰斬

[Video-MME-v2](https://toknow.ai/posts/video-mme-v2-benchmark-video-understanding-gap-humans) 是專門設計來防止瞎猜答對的版本：800 支影片、平均 10.4 分鐘，每支 4 道關聯題、每題 8 個選項，由 12 位標註者與 50 位獨立審查者花 3,300 人時建成。關鍵在計分——四題一組、用 `(N/4)²` 的非線性公式，**靠運氣答對一題但漏掉關聯題，幾乎拿不到分**。

在這個計分法下，受測最強的 Gemini 3 Pro 單題準確率 66.1%，**嚴格計分後只剩 49.4%**。而在「動作與運動」與「物理世界推理」這兩類題目上，連 Gemini 3 Pro 都低於 30%。開源模型差距更大：Qwen3.5-397B-Think 在 512 幀輸入時是 39.1%，降到 64 幀時掉到 30.6%。

還有一個反直覺的發現：**thinking 模式在純視覺任務上經常有害**。有字幕時它幫得上忙，但 KimiVL-16B 開啟 thinking 後整體掉 3.3%，最難的 Level 3 題目掉 4%。這指向一個結構性問題：目前影片模型的「思考」主要靠文字線索，不是靠像素。

## 其餘幾條軸線

**長文件 OCR** 在四月的快照裡是 Claude Opus 4.7 的主場（DocVQA 93.0%，領先 GPT-5.5 的 91.5%、Gemini 3 的 90.8%）。要注意代際：Opus 4.7 發布於 4 月 16 日，而 Anthropic 之後又出了 Opus 4.8（5/28）、Fable 5（6/9）、Opus 5（7/24）——這個位置有沒有換人需要重新測。

**圖表推理與帶視覺的程式碼任務**是 GPT-5.5 領先（ChartQA 92.1%、AI2D 96.2%），Digital Applied 的說法是它「longer reasoning traces shine」。

**即時語音**這條線上，Qwen3.5-Omni 的技術報告聲稱在 215 個音訊與音視訊子任務上取得 SOTA 或高度競爭的成績，「surpassing Gemini 3.1 Pro in key audio tasks」。兩個但書：摘要裡拿下這 215 項的是 `Qwen3.5-Omni-Plus` 這個變體而非基礎版，而且這是廠商自報數據，還沒有獨立第三方驗證。

實務結論是：單一模型通吃所有模態的時代已經過去。生產環境更常見的做法是依模態路由——文件走 Claude，教育類長影片走 Gemini，一般影片問答走 Seed 或 Qwen，圖表與程式碼走 GPT，即時語音走 Qwen Omni。

## 七月與八月：這份盤點已經被追過兩輪

寫完上面的內容之後，七月與八月各換過一輪。這一段刻意保留，因為它比任何單一分數都能說明「盤點的保鮮期有多短」：

| 日期 | 事件 |
|---|---|
| 6/26 | OpenAI 對合作夥伴開放 GPT-5.6 預覽 |
| **7/9** | **GPT-5.6 正式推出，分成 Luna／Terra／Sol 三階** |
| 7/16 | Moonshot 發表 Kimi K3 |
| **7/21** | **Google DeepMind 一口氣放 Gemini 3.6 Flash、3.5 Flash-Lite、3.5 Flash Cyber** |
| **7/24** | **Anthropic 推出 Claude Opus 5** |
| 7/30 | OpenAI 調降 GPT-5.6 Luna 與 Terra 價格（Luna 降 80%）|
| 8/3 | 阿里發表 Qwen3.8-Max（2.4T MoE、約 95B active），權重 8/12 開放（純文字）|
| **8/5** | **位元組跳動發布 SeedRealtime——原生音視訊全雙工 LLM** |
| 8/10 | Meta 發布 Muse Glimmer（30B、Apache 2.0、含 2B Perception Encoder 的多模態本地 agent 模型）|
| 8/12 | xAI 發布 Grok 4.6，在 Artificial Analysis 指數上與 GPT-5.6 Sol 打平 |
| **8/14** | **阿里開源 Qwen3.8-27B——27B dense 原生 VLM，收文字／圖片／影片，Apache 2.0** |

這對前面的內容有三個具體影響：

**一、MMMU-Pro 的一手數字現在拿得到了。** [OpenAI 的 GPT-5.6 發布頁](https://openai.com/index/gpt-5-6/)自己列了表：GPT-5.6 Sol 在 MMMU Pro（無工具）是 83%，Terra 80.7%，Luna 78.4%，對照 GPT-5.5 的 81.2% 與 Gemini 3.1 Pro Preview 的 80.5%；開工具後 Sol 到 84.6%。**「四家都在 80% 出頭、彼此差幾分」這個結論仍然成立**，只是名單換人了。

**二、有了獨立第三方的視覺測試。** Roboflow 在 [7/16 的測試](https://blog.roboflow.com/openai-gpt-5-6/)裡量到 GPT-5.6 Sol 的物件偵測從 GPT-5.5 的 13.8 mAP@50 跳到 46.2，計數從 64.9% 到 73.0%。但 OCR 幾乎沒進步（90.7% 對 91.2%，甚至略退）。

更值得注意的是他們的結論：在偵測與計數上仍然是 Gemini 3.5 Flash 領先，而且每張圖 0.8 美分，比 Sol 的 2.5 美分便宜得多。這正好呼應本文的主軸：**不同軸線有不同贏家，而且「最強」跟「該用」是兩件事。**

**三、閉源內部也在洗牌。** 依 Artificial Analysis 的 Intelligence Index（八月初、max effort），Claude Opus 5 為 63、Fable 5 為 62、GPT-5.6 Sol 為 61、Kimi K3 為 60、Opus 4.8 為 57——前四名擠在 3 分內。其中 Kimi K3 是開源權重，卻贏過商用的 Opus 4.8，這點在下一節談開源差距時值得放在一起看。

## 兩個還沒解掉的硬問題

**時序幻覺**是影片模型最活躍的研究題。[Galileo 的技術總覽](https://galileo.ai/blog/survey-of-hallucinations-in-multimodal-models)整理出三個根源：視覺編碼器解析度不足（常見 224×224 或 336×336，更高解析度計算成本太高）、connector 模組過度簡化（多是線性層，難以完整對齊視覺與文字特徵）、decoder 過度偏重已生成文字而忽略原始視覺輸入。[Awesome-Video-Hallucination](https://github.com/hukcc/Awesome-Video-Hallucination) 的論文清單顯示 2026 年仍在持續產出新的偵測與緩解方法——這不是已解決的問題。

**即時性**則是架構性瓶頸。[arXiv 2601.06843](https://arxiv.org/html/2601.06843v1) 指出，大多數 MLLM 仍要求輸入完整才能開始生成；即使串流方法能交錯感知與生成，仍維持順序式的感知-生成循環。

論文把這歸咎於 decoder-only 架構的位置編碼設計：「the global positional continuity constraint imposed by standard positional encoding schemes... tightly couples perception and generation, preventing effective input-output parallelism.」對同步口譯、直播分析這類「邊看邊說」的場景，這是主流架構還沒解決的硬限制。

**但這一條在八月被挑戰了。** 位元組跳動 8/5 發布的 [SeedRealtime](https://seed.bytedance.com/en/blog/seedrealtime-audio-visual-full-duplex-llm-released-toward-omni-modal-natural-interaction) 就是衝著這個問題來的：它用統一架構原生融合音訊、視訊與文字，官方說法是「不再是先聽完、再看、最後回答」，而是讓感知、理解、決策、表達在連續的音視訊串流上平行進行，並宣稱已經大規模部署。

我沒有獨立第三方的驗證，所以這裡不宣告問題已解決——但值得記下這個時間差：**一月的論文說這是架構性限制，八月就有廠商宣稱做出來並上線了。** 這類「硬限制」的保鮮期，可能比你以為的短。

**Claude 的官方自陳限制**值得單獨一提，因為這是官方文件主動列出的，不是外部推測。[Vision 文檔](https://docs.anthropic.com/en/docs/build-with-claude/vision)寫明：不做人臉辨識（「Claude cannot be used to name people in images and refuses to do so」）、無法可靠判斷圖片是否為 AI 生成、物件計數只是近似值、小於 200 像素的圖片容易誤判。

## 開源落後多少：一個常被講反的數字

[Epoch AI](https://epoch.ai/data-insights/open-closed-eci-gap) 用他們的 Capabilities Index（ECI）直接量測過：**2026 年 1 月至 5 月間，最強的開源權重模型平均落後前沿閉源模型四個月**，ECI 差 8 點。

這裡要特別提醒，因為轉述常常搞錯方向：**四個月是「變寬」之後的數字。** Epoch 2025 年 10 月的前一次分析涵蓋 2023 年 1 月到 2025 年 10 月，算出的是三個月；也就是說，差距沒有繼續縮小，反而略為擴大。

Epoch 自己還註明了兩件事。一是把標準改嚴，要求開源模型的 ECI 點估計嚴格高於它追趕的對象，估計值會拉到六個月。二是有兩個理由可能讓四個月仍屬低估：開源模型在私有 benchmark 上表現通常較差，可能因為更積極針對公開榜單調校；以及領先的閉源實驗室不見得會釋出自己最強的模型。

不過差距在不同能力上並不均勻：程式碼與代理任務、數學與推理已經很接近，一般對話品質也接近；**影像與影片多模態理解仍是差距最大的一環**。

這和 Video-MME 的排名並不矛盾。榜上前三（Seed 2.1 Pro／Turbo、Qwen3.7-Plus）都是閉源，而榜上最強的開源權重模型是小米的 MiMo-V2.5（87.7%），與第三名只差 0.3 分、離榜首 1.5 分。開源在特定任務上確實逼近前緣，但整體仍是「逼近」而非「打平」。

不過七、八月的訊號比較複雜。Artificial Analysis 綜合指數上，開源權重的 Kimi K3（60）贏過商用的 Claude Opus 4.8（57），只輸給當月剛發的三款旗艦。而八月的開源發布密度更高，且這一波明確是原生多模態的：

- **Kimi K3**：2.8T 參數、104B active、1M context，配 MoonViT-V2 視覺編碼器，自稱「世界第一個開放的 3T 級模型」
- **Qwen3.8-27B**（8/14）：27B dense 的原生 VLM，收文字、圖片與影片，Apache 2.0，262k context（官方說可經 YaRN 延伸到 1M）。值得注意的是早期報導把 Qwen3.8 系列的開放權重說成純文字——那對 8/12 的 Qwen3.8-Max 成立，對 27B 不成立
- **Muse Glimmer**（8/10）：Meta 的 30B、Apache 2.0，配一個 2B 的 Perception Encoder 級視覺塔，主打單張消費級 GPU 上的本地 agent

所以「四個月」是平均，不是每一格都成立——**在某些時間窗口與某些能力上，開源會短暫超車一個世代前的商用模型**，而且前面那句「影像與影片多模態理解是開源差距最大的一環」，正被這一波原生多模態開源權重直接測試中。

## 整體來說

選多模態模型不該只看「支援哪些模態」的勾選清單，而要看兩件事。

一是這個模態是原生訓練還是後接的。原生的通常在跨模態推理上更強，例如同時看畫面又聽語氣，但訓練與服務成本更高。二是你的場景落在哪條差異化軸線上：文件 OCR、影片理解、即時語音、圖表推理各有不同領先者。

而讀這類盤點時，比記住任何分數更有用的是那個方法論教訓：**兩份都不算離譜的來源，可以對同一個 benchmark 給出差 10 分、榜首還不同家的答案。**

這篇本身就是活例子。主體寫的是上半年，而七月與八月各換過一輪，連「即時性是硬限制」這種架構層的結論都在八月被廠商宣稱突破。遇到一個漂亮的數字，先問它出自哪場比賽、什麼時候跑的、誰跑的。Google 那句「競品分數由我們自己代跑」的註記，和 Video-MME-v2 那種抗瞎猜的嚴格計分，都在提醒同一件事：**公開榜面上的分數，通常比實際可靠度樂觀。**

## 參考資料

- [A new era of intelligence with Gemini 3 - Google Blog](https://blog.google/products-and-platforms/products/gemini/gemini-3)（2025-11 發布文）
- [Gemini 3 Pro Model Evaluation - Google DeepMind](https://storage.googleapis.com/deepmind-media/gemini/gemini_3_pro_model_evaluation.pdf)（評測方法說明）
- [Gemini 2.5 Technical Report（arXiv 2507.06261）](https://arxiv.org/abs/2507.06261)
- [Vision - Claude Platform Docs](https://docs.anthropic.com/en/docs/build-with-claude/vision)
- [Models overview - Claude Platform Docs](https://docs.anthropic.com/en/docs/about-claude/models/overview)
- [Qwen3.5-Omni Technical Report（arXiv 2604.15804）](https://arxiv.org/abs/2604.15804)
- [Qwen3.5: Nobody Agrees on Attention Anymore - Maxime Labonne](https://medium.com/@mlabonne/qwen3-5-nobody-agrees-on-attention-anymore-4709e1bd014b)
- [Develop Native Multimodal Agents with Qwen3.5 VLM - NVIDIA Technical Blog](https://developer.nvidia.com/blog/develop-native-multimodal-agents-with-qwen3-5-vlm-using-nvidia-gpu-accelerated-endpoints)
- [Video-MME Leaderboard - llm-stats.com](https://llm-stats.com/benchmarks/video-mme)
- [Video-MME-v2: Top AI Video Models Still Trail Humans - ToKnow.ai](https://toknow.ai/posts/video-mme-v2-benchmark-video-understanding-gap-humans)
- [Multimodal AI Benchmarks 2026 - Digital Applied](https://www.digitalapplied.com/blog/multimodal-ai-benchmarks-2026-vision-audio-code)（2026-04 快照）
- [Open models lag state-of-the-art closed models by 4 months - Epoch AI](https://epoch.ai/data-insights/open-closed-eci-gap)
- [GPT-5.6: Frontier intelligence that scales with your ambition - OpenAI](https://openai.com/index/gpt-5-6/)（2026-07-09，含 MMMU Pro 對照表）
- [GPT 5.6 Sol is the best "vision" model OpenAI ever released - Roboflow](https://blog.roboflow.com/openai-gpt-5-6/)（2026-07-16，獨立 VLM 測試）
- [Introducing Claude Opus 5 - Anthropic](https://www.anthropic.com/news/claude-opus-5)（2026-07-24）
- [AI Model Releases of July 2026: the 19-Day Timeline Explained](https://swiftwand.com/en/ai-model-releases-july-2026-timeline-en/)
- [SeedRealtime Audio-Visual Full-Duplex LLM Released - ByteDance Seed](https://seed.bytedance.com/en/blog/seedrealtime-audio-visual-full-duplex-llm-released-toward-omni-modal-natural-interaction)（2026-08-05）
- [Introducing Muse Glimmer - Meta AI Research](https://research.meta.ai/blog/introducing-muse-glimmer-open-agentic-model)（2026-08-10）
- [Introducing Grok 4.6 - xAI](https://x.ai/news/grok-4-6)（2026-08-12）
- [Alibaba releases Qwen3.8-27B open weights - DataNorth AI](https://datanorth.ai/news/alibaba-releases-qwen3-8-27b)（2026-08-17）
- [Kimi K3 - MoonshotAI (GitHub)](https://github.com/MoonshotAI/Kimi-K3)
- [Survey of Hallucinations in Multimodal Models - Galileo](https://galileo.ai/blog/survey-of-hallucinations-in-multimodal-models)
- [Awesome-Video-Hallucination - GitHub](https://github.com/hukcc/Awesome-Video-Hallucination)
- [Speak While Watching: Real-Time Video Understanding（arXiv 2601.06843）](https://arxiv.org/html/2601.06843v1)
