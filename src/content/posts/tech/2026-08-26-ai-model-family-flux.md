---
title: "FLUX——Stable Diffusion 原班人馬造出的圖像模型家族，從 12B 到 FLUX 3 的圖像、影片與機器人"
date: 2026-08-26
category: tech
tags: [ai-agent, flux, black-forest-labs, model-family-flux, image-generation, diffusion-model, model-selection]
lang: zh-TW
type: deep-dive
tldr: "FLUX 是 Black Forest Labs 的圖像模型家族，目前主力是 FLUX 3 世代：閉源 API 的 FLUX 3 Image（1K 每張 $0.048），以及 5.6B 開放權重的 FLUX 3 Image Klein（1K 每張 $0.009，FLUX Kommunity License：含關係企業年營收 500 萬美元以下可免費商用）。同一個 FLUX 3 基座還做影片（FLUX 3 Video，仍是 preview）與機器人動作預測（7B 開放權重的 FLUX 3 Action）。Artificial Analysis 圖像榜上 FLUX 3 Image 排第 21、Klein 排第 31，都高於 FLUX.2 全線，但落後 OpenAI、Microsoft、Google 的閉源前段班。"
description: "FLUX（Black Forest Labs）模型家族介紹：FLUX.1 到 FLUX 3 的演化時間線、rectified flow 與 Self-Flow 架構、FLUX 3 Image／Klein／Video／Action 分工、Kommunity License 與 dev 非商用授權的差別、每張圖與每秒定價、AA 圖像與影片榜的競品位置，以及 Agent 開發者的選型建議。"
series:
  name: "AI 模型家族"
  order: 16
draft: false
glossary:
  - term: "Rectified Flow Transformer"
    aliases: ["rectified flow", "流匹配"]
    definition: "FLUX 的核心架構：用 rectified flow／flow matching 直接學習噪聲到資料的直線路徑，取代傳統擴散模型的曲線去噪。FLUX 把它做成 transformer 結構，文字與影像 token 在同一堆疊裡做雙向注意力。"
  - term: "Guidance Distillation"
    definition: "把需要兩次前向傳播的 guidance 技巧蒸餾進權重本身，讓模型單次前向就能輸出高品質結果。FLUX [dev] 相對 [pro] 的主要差異就是這層蒸餾。"
  - term: "Self-Flow"
    definition: "FLUX 3 的多模態預訓練方法（Self-Supervised Flow Matching），在同一組權重內共同學習圖像、影片與音訊；FLUX 3 Image、Klein、Video 與 Action 都從這個基座衍生。"
  - term: "FLUX Kommunity License"
    definition: "FLUX 3 開放權重（Klein、Action）使用的授權：非商用免費；含關係企業年化營收低於 500 萬美元的使用者，可以在正式環境跑模型並商用產出；超過門檻要另買授權。"
---

> :globe: [English version](/posts/tech/2026-08-26-ai-model-family-flux-en)

2024 年 8 月，四個從 Stability AI 出走的德國研究者——Robin Rombach、Patrick Esser、Andreas Blattmann、Dominik Lorenz——在 Freiburg 成立了 [Black Forest Labs](https://bfl.ai)（BFL）。Rombach 是 Latent Diffusion 論文的第一作者，Stable Diffusion 的架構就出自這批人。同月他們發表 12B 的 [FLUX.1](https://github.com/black-forest-labs/flux)，兩年後家族已經從單一圖像模型長成 FLUX 3：同一個基座同時做圖像、影片與機器人動作。這篇寫給要在產品或 agent 工作流裡選圖像模型的人：讀完可以決定該用閉源 API 的 FLUX 3 Image、可自架的 Klein，還是更便宜的 FLUX.2 舊檔。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)；跨家族的圖像與影片比較見[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)。

## 家族定位與版本矩陣

FLUX 現在是「一個 FLUX 3 基座，切出閉源 API 與開放權重兩種取得方式」。FLUX.2 仍在 API 上架，價格比 FLUX 3 低，但品質已被 FLUX 3 Klein 超過。

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| FLUX 3 Image | 旗艦圖像生成與編輯 | 一個端點同時生成與編輯；最多 10 張參考圖、prompt 內的 bounding box、最高 4K | BFL API（閉源），1K 每張 $0.048 |
| FLUX 3 Image Klein | 可自架的圖像生成與編輯 | 5.6B，功能與 FLUX 3 Image 相同；分蒸餾版（16 步）與 Base（50 步，微調用） | 權重（FLUX Kommunity License）或 BFL API，1K 每張 $0.009 |
| FLUX 3 Video | 影片＋同步音訊 | 單次最長 20 秒、最高 4K、24fps；官方標示為 preview | BFL API，每秒計價 |
| FLUX 3 Max | 低延遲影片 | fal Research 以 FLUX 3 後訓練，10 秒影片約 12 秒生成 | 只在 fal 上，由 fal 計費 |
| FLUX 3 Action | 機器人／遊戲動作預測 | 7B world action model，預測動作與約 2 秒未來畫面 | 權重（FLUX Kommunity License） |
| FLUX.2（klein 4B／9B、pro、flex、max、dev） | 上一代圖像線 | 4B klein 是家族裡仍可用的 Apache 2.0 權重；dev 32B 非商用、沒有託管 API | BFL API；klein 與 dev 有權重 |

## 家族演化

| 版本 | 發佈 | 關鍵事實 | 改變了什麼選型 |
|---|---|---|---|
| BFL 創立 | 2024-08 | Freiburg 起家，a16z 領投種子輪 $31M | — |
| FLUX.1 schnell／dev／pro | 2024-08 | 12B rectified flow transformer；schnell Apache 2.0、dev 非商用、pro 只有 API | 開放權重、非商用權重、API 三層授權從這裡開始 |
| FLUX1.1 [pro] | 2024-10 | 速度提升，11 月加 Ultra／Raw 模式 | API 檔成為量產主力 |
| FLUX.1 Kontext | 2025-05 | 文字＋圖像上下文編輯，Kontext [dev] 同年 6 月開放權重 | 生成與編輯開始合在同一條線 |
| FLUX.2 pro／flex／dev | 2025-11-25 | 32B、Mistral 3 24B VLM 文字編碼器、最多 10 張參考圖、原生 4MP（[官方 blog](https://bfl.ai/blog/flux-2)） | 多參考圖編輯成為標配 |
| FLUX.2 [max] | 2025-12-16 | grounded generation，推論時搜尋網路 | 需要時事正確性的圖有了專用檔 |
| Series B | 2025-12-01 | $300M、估值 $3.25B（[TechCrunch](https://techcrunch.com/2025/12/01/black-forest-labs-raises-300m-at-3-25b-valuation/)） | — |
| FLUX.2 [klein] | 2026-01-15 | 4B（Apache 2.0）與 9B（非商用），消費級 GPU 可跑 | 小模型自架可以直接商用 |
| FLUX 3 公告 | 2026-07-23 | 圖像、影片、音訊共同訓練的多模態基座，分階段開放（[公告](https://bfl.ai/blog/flux-3)） | BFL 從圖像公司轉向「視覺智慧」 |
| FLUX 3 Video preview | 2026-08-04 | 20 秒 FHD、同步音訊與唇形；9 月再加 2K／4K 輸出（[release notes](https://docs.bfl.ml/release-notes)） | 影片與圖像同一家 API |
| FLUX 3 Action | 2026-09-22 | 7B 開放權重動作模型，RoboLab-120 開放模型第一（[發佈文](https://bfl.ai/blog/flux-3-action)、[當日新聞](/posts/daily/2026-09-25-ai-agent-daily)） | FLUX 3 第一個開放權重 |
| FLUX 3 Image | 2026-10-01 | 一個端點生成＋編輯，bounding box、最高 4K | 目前的圖像旗艦，見下方各節 |
| FLUX 3 Image Klein | 2026-10-15 | 5.6B 開放權重，Kommunity License，INT8 版 8GB VRAM 可跑（[發佈文](https://bfl.ai/blog/flux-3-image-klein)、[當日新聞](/posts/daily/2026-10-16-ai-agent-daily)） | 自架選項的品質超過 FLUX.2 [pro]，授權改成營收門檻制 |

兩年的主線很清楚：先用開放權重搶下社群，再用 API 分層做出收入。FLUX 3 的轉折是授權：FLUX.2 世代只有最小的 klein 4B 可以直接商用，FLUX 3 的開放權重改用營收門檻，小團隊整顆都能商用，大公司則必須付費。營收方面，Sacra 估計年化營收在 2025 年 8 月約 $9,600 萬，同年 9 月與 Meta 簽下約 $140M 的多年合約（[Sacra](https://sacra.com/c/black-forest-labs)，第三方估計）。

## 架構與訓練取捨

### 從 rectified flow 到 Self-Flow

FLUX 不是傳統 U-Net 擴散，而是 rectified flow transformer：文字與影像 patch 在同一個 transformer 堆疊裡互相 attend，這讓「文字渲染準」從 FLUX.1 起就是招牌。FLUX.2 把文字編碼器換成 Mistral 3 24B VLM，10 張參考圖的多引用編輯才做得動。

FLUX 3 再往前一步：用 Self-Flow（自監督 flow matching）把圖像、影片與音訊放進同一次預訓練。BFL 的說法是圖像提供空間細節、影片提供動作與物理、音訊提供事件與互動的訊號，所以 Klein 這種純圖像模型也是從多模態基座衍生的。FLUX 3 全尺寸模型的參數量與訓練資料構成，官方沒有公開。

### Klein：小模型的兩個檢查點

FLUX 3 Image Klein 有兩個 5.6B 檢查點（[文件](https://docs.bfl.ml/flux_3/flux3_image_klein)）：

- **蒸餾版**：16 步、CFG 1，給低延遲生成；API 端點 `flux-3-image-klein` 就是它。
- **Base**：50 步、CFG 3.5，給微調與 LoRA 訓練；在 Base 上訓練的 LoRA 也能載入蒸餾版。

生成器權重 BF16 約 11.2GB、FP8 約 5.6GB；INT8 版在 8GB VRAM 的 RTX 顯卡上就能跑，RTX 4070 生成 1MP 約 9 秒以內。參數量不含文字編碼器。官方文件要求一律搭配 prompt upsampler。

### 控制方式的改變

FLUX 3 Image 沒有「生成」與「編輯」兩種模式，prompt 本身決定要生成還是編輯。要精準控制版面時，把 bounding box 的 JSON 清單接在 prompt 後面：可以指定標題、人臉、格線每一格放在哪裡，也可以只改框內的元素、其餘像素不動。FLUX 上一直不支援負面提示詞（共享調變參數加 guidance 蒸餾），官方 prompt 指南的建議是改寫成正面描述；從 Stable Diffusion 遷移過來的人要先改掉這個習慣。

## 評測與競品比較

### 圖像：Artificial Analysis AA-Image-T2I v2.1

[AA-Image-T2I v2.1](https://artificialanalysis.ai/image/leaderboard/text-to-image)（2026-11-23）以人類兩兩盲評算 Elo，並把 FLUX.2 [dev] 固定在 1000 當基準點。

| 模型 | AA Elo | 排名 | 類型 | $/千張 |
|---|---|---|---|---|
| GPT Image 2.6 Sunburst (max) | 1263 | 1 | 閉源 | $211 |
| MAI-Image-2.7 | 1215 | 4 | 閉源 | $35 |
| Nano Banana 2.1 | 1175 | 8 | 閉源 | $34 |
| FLUX 3 Image | 1114 | 21 | 閉源 API | $48 |
| Qwen-Image-2.1 | 1047 | 30 | 開放權重（研究授權） | 無 API |
| FLUX 3 Image Klein | 1040 | 31 | 開放權重（Kommunity） | $9 |
| FLUX.2 [max] | 1021 | 44 | 閉源 API | $70 |
| FLUX.2 [pro] | 1005 | 53 | 閉源 API | $30 |
| FLUX.2 [dev] | 1000 | 56 | 開放權重（非商用） | $12 |
| FLUX.2 [klein] 9B | 932 | 83 | 開放權重（非商用） | $15 |

三個讀法。第一，FLUX 3 Image 比 FLUX.2 [max] 高約 90 分，但離前段班還有 100 分以上的差距；要最高品質的圖，FLUX 已經不是首選。第二，Klein 的 1040 和 Qwen-Image-2.1 的 1047 落在彼此的信賴區間內，但 Qwen-Image-2.1 是研究授權不能商用，Klein 小團隊可以商用。第三，Klein 每千張 $9，比 FLUX.2 [pro] 便宜三倍多、分數還高，FLUX.2 的 API 檔幾乎沒有新專案的理由。

BFL 自己的內部評測說 Klein 在文生圖、多參考圖與編輯三項都是開放權重第一，並高於 FLUX.2 [pro] 與 Ideogram V4.5；文生圖比 FLUX.2 [klein] 9B 高 91 Elo。這是官方自報，評分者與題目未公開；AA 的第三方結果方向一致。

### 影片：AA-Video-T2V v2.1

[AA-Video-T2V v2.1](https://artificialanalysis.ai/video/leaderboard/text-to-video)（含音訊，2026-11-23，Kling 3.0 1080p Pro 固定為 1000）上，FLUX 3 Max 以 1151 排第 7，BFL 自家的 FLUX 3 以 1138 排第 10；第一名是 Wan 3.0 的 1175。前段班信賴區間互相重疊，排名每幾週就會變。跨家族的影片比較見[影片生成家族文](/posts/tech/2026-08-26-ai-model-family-video-generation)。

### 機器人：RoboLab-120（官方自報）

FLUX 3 Action 的 guidance 蒸餾版在 RoboLab-120 模擬基準的成功率約 42%，前一名開放模型 Cosmos 3 Nano（16B）為 36.8%、π0.5 為 28.0%；單步蒸餾版約 38%，換來更低延遲（[發佈文](https://bfl.ai/blog/flux-3-action)）。這是模擬環境的數字，要上實體機器人得在自己的機台上微調再驗證。

## 授權、價格與部署

### 授權：三種條款，選型前先看是哪一種

| 授權 | 適用模型 | 能不能商用 |
|---|---|---|
| Apache 2.0 | FLUX.1 [schnell]、FLUX.2 [klein] 4B | 可以，無營收門檻 |
| [FLUX Kommunity License](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy/blob/main/LICENSE.md) | FLUX 3 Image Klein（兩個檢查點）、FLUX 3 Action | 含關係企業年化營收低於 500 萬美元：可以在正式環境跑模型並商用產出；超過門檻要買授權。機器人正式用途只授權非商用 |
| [FLUX [dev] Non-Commercial License](https://bfl.ai/legal/non-commercial-license-terms) | FLUX.1 [dev]、Kontext [dev]、FLUX.2 [dev]、FLUX.2 [klein] 9B | 模型只能非商用；產出可以商用，但不能拿產出訓練競品模型 |
| 只有 API | FLUX 3 Image、FLUX 3 Video、FLUX.2 pro／flex／max、Kontext pro／max | 依 API 條款 |

兩種非 Apache 條款都要求使用者做內容過濾或人工審查，並依法揭露 AI 生成。Kommunity License 另把「用產出蒸餾別的模型」也算進衍生作品。

最常見的誤解在 dev：產出可以賣，但拿 dev 自架對外服務就是商用部署，需要另買授權。BFL 的[自架授權方案](https://bfl.ai/pricing)分層如下：Builder（Klein＋FLUX.2 [klein]，每月 1 萬張）不含 dev；要用 dev 得選 Platform（Klein＋klein 9B＋dev，每月 10 萬張）或代理商方案，再往上是 Enterprise 與合成資料方案。FLUX 3 Image 本身沒有權重。訓練資料構成至今未公開，版權風險得自己評估。

### API 定價

1 credit = $0.01；API 與 Playground 同價（[BFL 定價頁](https://bfl.ai/pricing)、[release notes](https://docs.bfl.ml/release-notes)）。FLUX 3 圖像按解析度檔位、每張計價，文生圖與編輯同價，參考圖不另收費。

| 模型 | 768² | 1K | 2K | 4K |
|---|---|---|---|---|
| FLUX 3 Image | $0.041 | $0.048 | $0.100 | $0.607 |
| FLUX 3 Image Klein | $0.008 | $0.009 | $0.014 | $0.036 |

FLUX 3 Video 按輸出秒數計價，音訊不另收費；文字／圖像轉影片 HD $0.15／秒、FHD $0.24／秒、2K $0.28／秒、4K $0.41／秒，影片續寫（v2v）較貴；Draft 預覽只有 HD，$0.06／秒。FLUX 3 Max 在 fal 上計費，正常價 720p $0.17／秒、1080p $0.29／秒（[fal 模型頁](https://fal.ai/models/blackforestlabs/flux-3-max/text-to-video)）；AA 影片榜列的 $8.70／分鐘是促銷期間的價格。

FLUX.2 仍按百萬像素計價：klein 4B 首 MP $0.014、klein 9B $0.015、pro $0.03（後續每 MP $0.015）、flex $0.05、max $0.07。FLUX.2 [dev] 沒有託管 API，只能本地跑。官方文件目前沒有公布 FLUX.2 或 FLUX.1 的停用日期；FLUX.1 已標為上一代，Kontext 頁面建議新專案改用 FLUX.2。

### 部署

Klein 的權重在 Hugging Face（需同意授權），ComfyUI、Diffusers、TensorRT-LLM、SGLang Diffusion、vLLM-Omni 首日支援；官方文件寫最低可在 RTX 3090 上跑，INT8 版可下探 8GB VRAM。資料中心上，GB300 用 NVFP4 生成 1MP 不到 0.6 秒。FLUX 3 Action 可透過 LeRobot 接到機械臂，也有遊戲與無人機的微調範例。

## Agent 使用與選型

BFL 有官方的 [FLUX MCP server](https://docs.bfl.ml/api_integration/mcp_integration)（OAuth 登入，可生成、編輯圖像與影片），也在 black-forest-labs/skills 發布了教 coding agent 下影片指令的 Agent Skills。模型本身不做 tool calling；路由、重試與成本控制由你的 host loop 負責。

- **自架或成本敏感的量產圖** → FLUX 3 Image Klein：每張 $0.009 起、分數高於整條 FLUX.2，小團隊可直接商用。年營收超過 500 萬美元要先買授權，或改走 API。
- **品質優先、仍想留在 FLUX** → FLUX 3 Image：bounding box 版面控制與像素級局部編輯是它的長處；要純粹的最高分則看 GPT Image 2.6 或 MAI-Image-2.7。
- **授權必須乾淨、零營收門檻** → FLUX.2 [klein] 4B（Apache 2.0），代價是品質：同代的 klein 9B 在 AA 圖像榜只有 932，4B 未列入；跨家族的選項見[用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)的 Z-Image Turbo。
- **需要即時網路資訊的圖**（真實人物、近期產品）→ FLUX.2 [max] 的 grounding search 仍是 FLUX 裡唯一有這項功能的檔。
- **影片** → FLUX 3 Video 適合已經在用 BFL API 的團隊；要速度看 fal 上的 FLUX 3 Max。兩者都還是 preview 世代，正式上線前用自己的提示詞集比對 Wan 3.0、Gemini Omni Flash 等競品。
- **機器人或遊戲 agent** → FLUX 3 Action 可當低延遲策略；BFL 的實驗是讓推理模型規劃、Action 執行，比純推理模型便宜。

**最小驗證法**：拿 20～50 條你產品裡的真實提示詞（含要渲染的文字與版面要求），同一組 seed 跑 Klein 與 FLUX 3 Image 各一輪，人工盲評勝率；Klein 勝率接近五成就用 Klein，把價差省下來。

## 限制與取捨

- **品質不是第一**：FLUX 3 Image 在 AA 圖像榜排第 21，追求最高品質的工作流會被閉源前段班比下去。
- **授權看營收**：Kommunity License 讓小團隊可商用，但公司成長過門檻就得付費；dev 的產出能賣，部署不行。兩者都不是 Apache 2.0。
- **影片與動作仍在早期**：FLUX 3 Video 官方標示 preview，Action 的數字來自模擬環境。
- **資訊揭露有限**：FLUX 3 全尺寸的參數量與訓練資料未公開，Klein 的品質宣稱一部分是官方內部評測。
- **舊檔的去留不明**：FLUX.2 與 FLUX.1 仍可呼叫，官方沒有停用時程，長期依賴舊檔的整合要自己留意公告。

## 更新紀錄

- 2026-11-23：補上 FLUX 3 世代：矩陣、評測、定價與選型改寫為 FLUX 3 Image（2026-10-01）、FLUX 3 Image Klein（2026-10-15）、FLUX 3 Video、FLUX 3 Max 與 FLUX 3 Action（2026-09-22），依 BFL 發佈文、release notes、定價頁、Kommunity License 與 Artificial Analysis 圖像／影片榜。FLUX.2 降為上一代，保留在時間線與定價段。授權改成三種條款的對照表，並更新自架授權方案（Builder 已不含 FLUX.2 [dev]）。修正錯誤：FLUX 3 Video 2026-08-04 上線時是 preview，不是 GA；FLUX 3 Video 每秒價格改為定價頁現值；開頭刪去與系列順序不符的「第十三篇」；FLUX.1 連結改指官方 GitHub。移除舊的 LMArena 快照數字（與 AA v2.1 不同尺度）與 Midjourney、Imagen 4 的舊單價。
- 2026-10-11：整理格式、版本矩陣與選型章節，沿用既有來源與日期；本次未重新查證事實。

## 參考資料

- [FLUX 3 Image Klein — BFL 官方部落格](https://bfl.ai/blog/flux-3-image-klein) — 2026-10-15 發佈文，5.6B、硬體需求、內部評測與授權
- [BFL Docs — Release Notes](https://docs.bfl.ml/release-notes) — FLUX 3 Image、Klein、Video 各次發佈與價目
- [BFL Docs — FLUX 3 Image Klein](https://docs.bfl.ml/flux_3/flux3_image_klein) — 兩個檢查點的規格
- [BFL Docs — FLUX 3 overview](https://docs.bfl.ml/flux_3/flux3_overview) — Video preview 狀態、FLUX 3 Max、FLUX 3 Action
- [BFL Pricing](https://bfl.ai/pricing) — API 定價與自架授權方案
- [BFL Docs — Pricing](https://docs.bfl.ml/quick_start/pricing) — credit 計價規則、FLUX.2 [dev] 無託管 API
- [FLUX 3 Max — fal](https://fal.ai/models/blackforestlabs/flux-3-max/text-to-video) — fal 後訓練版與計費
- [FLUX 3 Action — BFL 官方部落格](https://bfl.ai/blog/flux-3-action) — 7B 動作模型與 RoboLab-120 結果
- [FLUX 3 — BFL 官方部落格](https://bfl.ai/blog/flux-3) — 2026-07-23 多模態基座公告
- [FLUX Kommunity License v1.0 — Hugging Face](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy/blob/main/LICENSE.md) — 營收門檻與使用條件
- [FLUX [dev] Non-Commercial License — BFL](https://bfl.ai/legal/non-commercial-license-terms) — dev 系列授權與產出條款
- [FLUX.2: Frontier Visual Intelligence — BFL 官方部落格](https://bfl.ai/blog/flux-2) — 2025-11-25 發佈文
- [black-forest-labs/flux2 — GitHub](https://github.com/black-forest-labs/flux2) — FLUX.2 推論 repo 與各 variant 授權
- [FLUX.2-klein-4B — Hugging Face 模型卡](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B) — 4B、Apache 2.0
- [FLUX.2-dev — Hugging Face 模型卡](https://huggingface.co/black-forest-labs/FLUX.2-dev) — 32B、非商用授權
- [black-forest-labs/flux — GitHub](https://github.com/black-forest-labs/flux) — FLUX.1 推論 repo
- [AA-Image-T2I v2.1 — Artificial Analysis](https://artificialanalysis.ai/image/leaderboard/text-to-image) — 圖像生成榜
- [AA-Video-T2V v2.1 — Artificial Analysis](https://artificialanalysis.ai/video/leaderboard/text-to-video) — 影片生成榜（含音訊）
- [Black Forest Labs raises $300M at $3.25B valuation — TechCrunch](https://techcrunch.com/2025/12/01/black-forest-labs-raises-300m-at-3-25b-valuation/) — Series B、創始團隊背景
- [Black Forest Labs revenue, valuation & funding — Sacra](https://sacra.com/c/black-forest-labs) — 營收估計與 Meta 合約（第三方）
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站，系列導讀
