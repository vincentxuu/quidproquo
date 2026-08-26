---
title: "FLUX——Stable Diffusion 原班人馬出走後造出的圖像模型家族，從 12B 到 Self-Flow 世界模型"
date: 2026-08-26
category: tech
tags: [ai-agent, flux, black-forest-labs, model-family-flux, image-generation, diffusion-model, model-selection]
lang: zh-TW
type: deep-dive
tldr: "FLUX 是 Black Forest Labs 的圖像模型家族——2024 年 8 月由 Stability AI 的 Stable Diffusion 原班人馬創立後首發，12B rectified flow transformer 一戰成名；兩年後家族已長成五層：klein 4B（$0.014 起、家族新一代唯一的 Apache 2.0）/9B、pro（$0.03）、flex（$0.05）、max（$0.07、可即時搜尋網路 grounding），外加 32B 開放權重的 dev；2026 年 8 月更用 FLUX 3 把影片＋同步音訊＋機器人動作收進同一個 Self-Flow 架構。這篇追蹤從 FLUX.1 到 FLUX 3 的演化、授權三層制與選型建議。"
description: "FLUX（Black Forest Labs）模型家族完整介紹：2024→2026 演化時間線、rectified flow transformer 架構、schnell/dev/pro 到 FLUX.2 klein/max 五層定位、非商用授權陷阱、每張圖定價與 Midjourney/Imagen 競品對照、FLUX 3 影片與機器人佈局。"
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
  - term: "Grounded Generation"
    definition: "FLUX.2 [max] 的招牌功能：推論時即時搜尋網路，把最新資訊（如人物外觀、產品照片）帶進生成結果，解決模型知識凍結問題。"
  - term: "Self-Flow"
    definition: "FLUX 3 的統一多模態架構名稱，在同一組權重內共同學習圖像、影片、音訊與機器人動作預測，是 BFL 從圖像工具轉向「視覺智能／世界模型」的技術底座。"
---

2024 年 8 月，四個從 Stability AI 出走的德國研究者——Robin Rombach、Patrick Esser、Andreas Blattmann、Dominik Lorenz——在 Freiburg 成立了 [Black Forest Labs](https://bfl.ai)。這不是普通團隊：Rombach 是 Latent Diffusion 論文的第一作者，Stable Diffusion 背後的架構就出自這批人之手。母公司財務動盪、核心研究員集體出走，然後在同月把首款模型 [FLUX.1](https://bfl.ai/blog/flux-2) 丟上市場，12B 參數直接把自家老東家的後繼版本打下去。這是 AI 模型家族系列的第十三篇，追蹤這家「德國復仇者」如何用兩年時間從一款開源模型長成涵蓋圖像、影片、機器人的視覺智能公司。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列第十三篇家族深度介紹。

## 家族演化時間線

| 版本 | 發佈 | 關鍵事實 |
|---|---|---|
| BFL 創立 | 2024-08 | Freiburg 起家，a16z 領投種子輪 $31M |
| FLUX.1 schnell/dev/pro | 2024-08 | 12B rectified flow transformer；schnell Apache 2.0、dev 非商用、pro API 獨佔 |
| Series A | 2024 下半年 | a16z 領投約 $100M、估值 $1B——金額未經官方確認（[TechCrunch](https://techcrunch.com/2024/09/20/grok-image-generator-black-forest-labs-raising-100m-at-1b-valuation/) 引 sources 說法，2024-09 報導） |
| FLUX1.1 [pro] | 2024-10 | 六倍速度提升；11 月再加 Ultra/Raw 模式，輸出上看 4MP |
| FLUX.1 Kontext | 2025-05 | 文字＋圖像上下文編輯線開張，Kontext [dev] 同年 6 月開放權重 |
| FLUX.2 pro/flex/dev | 2025-11-25 | 32B 架構、Mistral 3 24B VLM 文字編碼器、最多 10 張參考圖、原生 4MP（[官方 blog](https://bfl.ai/blog/flux-2)、[GitHub](https://github.com/black-forest-labs/flux2)） |
| FLUX.2 [max] | 2025-12-16 | 頂級檔位上線，grounded generation 即時網路搜尋 |
| Series B | 2025-12-01 | $300M、估值 $3.25B，Salesforce Ventures 與 AMP 共同領投，NVIDIA/Figma Ventures/Canva 跟投 |
| FLUX.2 [klein] | 2026-01-15 | 4B（[Apache 2.0](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B)）與 9B（非商用），13GB VRAM 起、消費級 GPU 亞秒生成 |
| FLUX 3 發表 | 2026-07-23 | Self-Flow 多模態基座：圖像＋20 秒影片＋同步音訊＋機器人動作；FLUX-mimic 已在 Audi 產線測試（[公告](https://bfl.ai/blog/flux-3)） |
| FLUX 3 Video GA | 2026-08-04 | 20 秒 FHD（1920×1088）24fps 單次生成、原生唇同步音訊、Draft 預覽模式（[發佈文](https://bfl.ai/blog/flux-3-video)）；FLUX 3 Image 與開放權重的 Dev 承諾年內跟進 |

兩年的劇本很清楚：先用開放權重搶下社群——[FLUX.2-dev](https://huggingface.co/black-forest-labs/FLUX.2-dev) 單月下載約 65 萬，上一代 dev 累計超過三千萬——再用 API 分層把商業收入做出來。Sacra 估計其年化營收在 2025 年 8 月已達約 $9,600 萬；同年 9 月，Meta 簽下一紙 $140M 的多年合約。

## 五層子線與架構：同一個骨幹切五刀

FLUX 家族的命名邏輯是「同一個骨幹，按速度與控制粒度切片」：

- **klein**（4B/9B）：蒸餾到極致的即時檔。步數蒸餾＋guidance 蒸餾雙開，GB200 上亞秒出圖，與上一代的 [schnell] 同為家族裡僅有的 Apache 2.0 權重。
- **dev**：32B 開放權重研究檔，guidance-distilled 自 pro 的同一條訓練軌。全精度要資料中心級 GPU（32B BF16 加 Mistral 文字編碼器），HF 與 BFL 合作提供了量化版讓 RTX 4090 可跑。
- **flex**：API 檔裡唯一暴露 steps 等低階參數的，給需要精細控制的排版／細節工作流。
- **pro**：量產主力，品質與價格的平衡點。
- **max**：頂規檔，grounding search 之外編輯一致性最強。

架構上值得記住三件事。第一，FLUX 不是傳統 U-Net 擴散，而是 rectified flow transformer——文字與影像 patch 在同一個 transformer 堆疊裡互相 attend，這讓「文字渲染準」從 FLUX.1 起就是招牌。第二，FLUX.2 把文字編碼器換成 Mistral 3 24B VLM，等於天生具備視覺語言理解，10 張參考圖的多引用編輯才做得動。第三，共享調變參數加上 guidance 蒸餾，讓負面提示詞在 FLUX 上技術上不可行——從 SD 遷移過來的人要先改掉這個習慣。

## 授權陷阱：開放是分層的，不是二元的

BFL 的雙軌策略比「開源 vs 閉源」複雜得多，實際是三層：

- **Apache 2.0**：FLUX.1 [schnell] 與 FLUX.2 [klein] 4B。可商用、可自架、可改作，無營收門檻。
- **FLUX Non-Commercial License**：FLUX.1 [dev]、Kontext [dev]、FLUX.2 [dev]、klein 9B。權重可下載，**生成輸出也可以商用**——被限制的是模型本身：拿它自架對外服務、或拿它訓練競品模型，都在禁止之列。想自架商用就得買 BFL 的授權方案（Builder 1 萬張/月起，往上按量議價）。這是最多人誤解的一層：坑不在「產出能不能賣」，在「部署算不算商用」。
- **純 API**：pro/flex/max/Kontext pro/max 全閉源，只有 API 條款。

對比競爭格局：Midjourney、Ideogram、Google Imagen 從頭到尾無權重；Qwen-Image 主線掛 Apache 2.0 但新版已轉閉源。FLUX 是目前唯一「每一代都保證有一顆可自架的開放權重旗艦」的主流圖像家族——只是那顆旗艦多半是非商用授權。另外訓練資料構成至今未公開，版權風險得自己評估。

## 定價與競品對照

API 以 credit 計費（1 credit = $0.01），FLUX.2 按**百萬像素**計價，首 MP 之後遞減（[官方定價](https://docs.bfl.ml/quick_start/pricing)）：

| 模型 | 首張起價 | 備註 |
|---|---|---|
| FLUX.2 [klein] 4B | $0.014 | 每張，亞秒級 |
| FLUX.2 [klein] 9B | $0.015 | 每張 |
| FLUX.2 [pro] | $0.03（編輯 $0.045） | 後續 MP 半價 $0.015 |
| FLUX.2 [flex] | $0.05 | 可調 steps |
| FLUX.2 [max] | $0.07 | 含 grounding search |
| FLUX 3 Video | $0.17/s（hd）/ $0.29/s（fhd） | Draft 預覽 $0.06/s |

放到競品尺上：Google Imagen 4 Standard 約 $0.04/張、Ultra 約 $0.06；OpenAI GPT Image 約 $0.04/張；Midjourney 走 $30/月訂閱制不賣單張；Grok Imagine 圖像 $0.02 起。FLUX 的價格帶橫跨 $0.014–$0.07，等於一家公司同時覆蓋「最便宜可用」到「最高品質」兩端。

榜單位置要看快照。2025 年 12 月的 LMArena 文生圖快照裡，GPT Image 還領先 FLUX.2 [pro] 一個百分點以上；到 2026 年中的快照，兩者已接近同級（[Artificial Analysis 圖像榜](https://artificialanalysis.ai/image/leaderboard/text-to-image)可看現值）。開放權重的 [dev] 入場 ELO 約 1,149（社群轉載的 2025-12 快照），是西方開放權重模型中最靠前的——同一份榜上排更高的是中國的 Hunyuan Image 3.0，同樣開放權重；編輯榜各快照則落在約 1,200–1,250 區間。

## 學到的事：Agent 開發者的選型建議

- **高吞吐／互動式生成**（聊天內插圖、草稿迭代）→ klein 4B：$0.014、亞秒延遲、Apache 2.0 可自架兜底，量產成本敏感場景的首選。
- **正式產出／品牌素材** → pro：$0.03 的品質價格比目前沒有對手，4MP 大圖約 $0.075（首 MP 之後半價遞減）。
- **需要時事正確性**（生成真實人物、近期產品）→ max 的 grounding search 是獨家能力，別家用不了。
- **本地／私有部署** → klein 4B（Apache）或 dev——dev 的輸出可商用，但拿它自架服務要買 Builder 授權，部署前先對照條款確認你的用途。
- **影片需求** → FLUX 3 Video 已 GA（$0.17/s hd 起），但獨立 benchmark 尚未出爐，官方勝率數字先打折看。
- **混用策略**：klein 打草稿 → pro 出成品 → max 只留給 grounding 必需的鏡頭，三檔價差五倍但 API 同一套。

整體來說，FLUX 的故事是「出走者用開放權重重建話語權」。Stability AI 留下的開源社群被原班人馬接走，BFL 再用分層授權把社群信任換成企業合約——Adobe、Canva、Meta 都在客戶名單上。2026 年的賭注更大：Self-Flow 把圖像、影片、音訊、機器人動作壓進同一組權重——「A model that only learns images can only generate images」，Rombach 受訪時說的這句話，是他們給整個行業下的戰帖。開放權重這條護城河守不守得住 FLUX 3 世代，是接下來一年最值得盯的事。

---

## 參考資料

- [FLUX.2: Frontier Visual Intelligence — BFL 官方部落格](https://bfl.ai/blog/flux-2) — 2025-11-25 發佈文，架構與各層定位
- [black-forest-labs/flux2 — GitHub](https://github.com/black-forest-labs/flux2) — 官方推論 repo，各 variant 授權對照表
- [FLUX.2-dev — HuggingFace 模型卡](https://huggingface.co/black-forest-labs/FLUX.2-dev) — 32B、非商用授權
- [FLUX.2-klein-4B — HuggingFace 模型卡](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B) — 4B、Apache 2.0、RTX 3090/4070 可跑
- [BFL Docs — Pricing](https://docs.bfl.ml/quick_start/pricing) — 全模型 credit 定價、FLUX.2 百萬像素計價、FLUX 3 每秒計價
- [BFL Docs — Release Notes](https://docs.bfl.ml/release-notes) — klein 發佈、FLUX 3 Video GA、MCP server 等時間戳
- [Black Forest Labs raises $300M at $3.25B valuation — TechCrunch](https://techcrunch.com/2025/12/01/black-forest-labs-raises-300m-at-3-25b-valuation/) — Series B、創始團隊背景
- [FLUX 3: Multimodal Video, Image & Audio — BFL 官方部落格](https://bfl.ai/blog/flux-3) — 2026-07-23 Self-Flow 與 FLUX-mimic 公告
- [FLUX 3 Video, Part 1 — BFL 官方部落格](https://bfl.ai/blog/flux-3-video) — 2026-08-04 Video GA
- [Black Forest Labs revenue, valuation & funding — Sacra](https://sacra.com/c/black-forest-labs) — 營收估計與 Meta 合約
- [Text-to-Image Leaderboard — Artificial Analysis](https://artificialanalysis.ai/image/leaderboard/text-to-image) — 圖像生成榜現值
- [Grok's image generator, Black Forest Labs, is raising $100M at a $1B valuation — TechCrunch](https://techcrunch.com/2024/09/20/grok-image-generator-black-forest-labs-raising-100m-at-1b-valuation/) — Series A 傳聞口徑的原始報導
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站，系列導讀
