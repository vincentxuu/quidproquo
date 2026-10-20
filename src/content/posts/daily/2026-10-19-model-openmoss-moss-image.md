---
title: "模型卡｜OpenMOSS MOSS-Image"
date: 2026-10-19
category: daily
type: digest
tags: [ai-agent, model-release, daily, openmoss, model-family-moss-image]
lang: zh-TW
description: "OpenMOSS 開源 5B 文字生成圖片模型 MOSS-Image——自建長文字渲染基準 Mean-6 達 96.3 分，端到端人評排名第二僅輸 GPT Image 2，但骨幹模型在共享 prompt 條件下反而拿下全場最高分"
tldr: "MOSS-Image：OpenMOSS（MOSI.AI／上海創新研究院／復旦大學／上海交通大學）2026-10-16 發布的 5B 單流 diffusion transformer，Apache-2.0，prompt 最長 4,096 tokens，搭配以 GPT-6 驅動的 agentic prompt enhancer 做版面規劃。自建 LLTB 長文字渲染基準 Mean-6 96.3 分（開源模型最高，超越次高 Qwen Image 2512 的 64.9 分 31.4 個百分點）；7Bench 版面控制 mIoU 0.88／AUC 0.70 大幅領先 Ideogram 4 的 0.44／0.20；RealLayoutArena 端到端人評 9 系統中排名第二（Elo 1698.70），輸給 GPT Image 2（1844.35）、贏 Seedream 5.0 Pro／Qwen Image 3.0 Pro／Nano Banana Pro，但骨幹模型在「共享增強 prompt」條件下反而拿下全場最高分（1807.34 Elo）。所有基準皆為官方自建自測，尚待第三方覆現；目前不支援圖像條件輸入或編輯，無官方 API 定價。"
series:
  name: "AI Model Tracker"
  order: 52
glossary:
  - term: "MOSS-Image"
    def: "OpenMOSS 團隊發布的開源文字生成圖片模型家族，強調長文字渲染與原生 JSON 版面（layout）控制"
  - term: "OpenMOSS"
    def: "由 MOSI.AI、上海創新研究院（SII）、復旦大學與上海交通大學團隊組成的開源 AI 研究組織，早期以中文對話模型 MOSS 聞名"
---

> 🌏 [English version](/posts/daily/2026-10-19-model-openmoss-moss-image-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `OpenMOSS-Team/MOSS-Image-Base`（另有精選資料微調版 `OpenMOSS-Team/MOSS-Image-SFT`） |
| 廠商 | OpenMOSS（MOSI.AI／上海創新研究院 SII／復旦大學／上海交通大學聯合團隊） |
| 參數量 | 5B（單流 diffusion transformer／DiT；文字編碼器為凍結的 Qwen3.5-9B，VAE 為凍結的 FLUX.2 小型 decoder） |
| Context Window | 不適用（圖片生成模型；文字 prompt 上限 4,096 tokens） |
| Input 定價 (USD/1M tokens) | 不適用（圖片生成模型無輸入 token 計價；Apache-2.0 開放權重，無官方 API） |
| Output 定價 (USD/1M tokens) | 不適用（同上；第三方代管 [fal.ai](https://fal.ai/models/fal-ai/moss-image) 上架 MOSS-Image-SFT，依輸出影像畫素計費 $0.05／百萬畫素，1024×1024（約 1 百萬畫素）約 $0.05／張，非官方定價） |
| 開源 | 是（Apache-2.0） |
| 發布日 | 2026-10-16 |
| 官方公告 | [OpenMOSS MOSS-Image 專案頁](https://openmoss.ai/MOSS-Image/) |
| HuggingFace | [OpenMOSS-Team/MOSS-Image-Base](https://huggingface.co/OpenMOSS-Team/MOSS-Image-Base) |
| 家族 | MOSS-Image（首作，Base／SFT 兩個 checkpoint） |

## 能力亮點

- **長文字渲染**：在官方自建的 LongLongTextBench（LLTB，目標文字平均長達 1,339.8 字元，約是前代基準 LongTextBench 的 11.1 倍）上 Mean-6 達 96.3 分，是官方比較表中所有開源模型最高分，超越次高的 Qwen Image 2512（64.9 分）31.4 個百分點；最長的英文與中文條件分別拿下 97.1 與 92.4 分。
- **版面控制精度**：在第三方基準 7Bench 上 mIoU_det 0.88、Layout AUC 0.70，大幅領先次高的 Ideogram 4（0.44／0.20）。
- **端到端設計生成**：在自建的 RealLayoutArena（RLA，61 題海報／資訊圖／UI 設計請求，人工盲測配對比較）中，完整系統（DiT ＋ agentic prompt enhancer）Elo 1698.70，在 9 個系統中排名第二，僅輸給閉源 GPT Image 2（1844.35）。
- **骨幹模型對指令的服從度**：拿掉各家自己的 prompt enhancer、只給所有生成器同一份「共享增強版自然語言 prompt」時，MOSS-Image 的骨幹模型反而拿下全場最高分（1807.34 Elo），領先 ERNIE Image（1748.51）與 SenseNova-U1（1689.23）。

## Benchmark 表現

| Benchmark | 分數 | 前代 | 競品最強 |
|---|---|---|---|
| LLTB（LongLongTextBench）Mean-6 | 96.3 | 首作，無前代 | Qwen Image 2512：64.9 |
| 7Bench 版面控制（mIoU_det／Layout AUC） | 0.88／0.70 | 首作，無前代 | Ideogram 4：0.44／0.20 |
| RLA 端到端系統 Elo（9 系統比較，完整 pipeline） | 1698.70（排名第 2） | 首作，無前代 | GPT Image 2：1844.35（排名第 1） |
| RLA 共享增強 prompt 骨幹比較 Elo（9 生成器） | 1807.34（排名第 1） | 首作，無前代 | ERNIE Image：1748.51 |

⚠️ 以上 LLTB、7Bench、RLA 三項均由 OpenMOSS 官方自行建構題庫並自行評測（論文原文：「all results on 7Bench, LLTB, and RLA are obtained through our own evaluation」），目前無獨立第三方覆現數字，分數高低需保留一定保留態度。唯一引用外部公開報告的是 LongTextBench，官方指出該基準已接近飽和（各模型普遍落在 96.05–98.85 分區間），因此改以自建的 LLTB 當主要評測。

## 與前代/競品比較

MOSS-Image 是 OpenMOSS 的首個文字生成圖片模型，沒有前代可比。它真正的賣點不是「贏過所有人」，而是用一個 5B 的小模型，在「超長文字渲染」這個窄領域把自己跟 Qwen Image 2512 拉出 31.4 個百分點的差距——這在開源文字生成圖片模型裡是少見的量級差異，但因為 LLTB 是官方自建題庫，比較對象也只限於「官方選進表裡的開源模型」，無法排除選題或評測流程偏向自家模型的可能。

跟真正的巨頭比，MOSS-Image 呈現一個有趣的落差：完整系統（含自家 agentic prompt enhancer）在 RLA 端到端比較只排第二，輸給 GPT Image 2；但把雙方的 prompt enhancer 都拿掉、只給同一份「共享增強版自然語言 prompt」，MOSS-Image 的骨幹模型反而反超 GPT Image 2，拿下全場最高分。這說明 MOSS-Image 的 DiT 骨幹本身遵循細節指令的能力很強，但自家用 GPT-6 搭的 prompt enhancer，在把「使用者一句話」轉成「具體設計規格」這個環節，目前還比不上 GPT Image 2 自己內建的理解與規劃能力——瓶頸在「規劃」而不在「畫圖」。

定價策略上完全是另一條路線：GPT Image 2、Seedream 5.0 Pro、Qwen Image 3.0 Pro 都是閉源付費 API，MOSS-Image 選擇 Apache-2.0 全開源、自己部署零邊際成本，用「開源最強長文字渲染」卡位，而不是在整體設計品質上硬拚第一。

## 對 Agent 開發的意義

MOSS-Image 的 JSON layout prompt（直接指定物件與文字的 bounding box、座標系統以畫面中心為原點）在官方自己的 prompt 策略消融實驗中拿下最高分（1622.87 Elo），比單純自然語言版面描述（1506.20 Elo）還高，這代表「把版面需求結構化成座標」這件事，對生成品質本身就有幫助，不只是方便工程整合。

- 如果你在做需要大量產出結構化視覺素材的 agent（電商海報、簡報封面、資訊圖卡、UI mockup）：MOSS-Image 讓 agent 可以直接輸出 JSON 座標規格，不需要自己維護一套「文字轉版面」的規則引擎，而且開源 Apache-2.0 可以自架、改權重微調到自家視覺風格；沒有 GPU 想先試用的話，[fal.ai](https://fal.ai/models/fal-ai/moss-image) 已上架 MOSS-Image-SFT 的代管 API（按畫素計費，非官方）
- 如果你在做雙語（中英混排）內容生成：LLTB 的中文長文字分數（92.4）雖略低於英文（97.1），但仍是官方表中開源模型最佳，適合需要中英文字同時出現在同一張圖（如雙語行銷素材）的場景
- 不適合：目前模型「不支援圖像條件輸入或圖像編輯」（論文原文列為明確限制），如果 agent 場景需要「針對既有圖片做局部修改」或「保持多張圖之間角色一致性」的迭代編輯流程，MOSS-Image 現階段做不到；另外它的 agentic prompt enhancer 依賴外部 GPT-6 做規劃，若要打造完全自架、不依賴第三方模型的封閉迴路，這一段還是要自己換掉

## 今日收穫

過去看開源文字生成圖片模型追趕閉源巨頭，敘事大多是「整體畫質快追上了」。MOSS-Image 給了一個更細的切法：它沒有宣稱整體設計品質第一，而是先在「超長文字渲染」這個可以精確量化、也容易被閉源模型忽略的窄域上拉出大差距，再用骨幹模型在「共享 prompt」條件下反超 GPT Image 2 這個結果，把問題精準定位到「規劃能力」而非「畫圖能力」的落差。但這也提醒我：自建基準＋自行評測的「開源最強」宣稱，在沒有第三方覆現之前，真正能確認的只是「架構設計對路」，不是「分數可以照字面比較」。

## 參考資料

- [fal.ai：MOSS Image (Text to Image) API](https://fal.ai/models/fal-ai/moss-image)
- [OpenMOSS MOSS-Image 專案頁](https://openmoss.ai/MOSS-Image/)
- [OpenMOSS-Team/MOSS-Image-Base（Hugging Face 模型卡）](https://huggingface.co/OpenMOSS-Team/MOSS-Image-Base)
- [OpenMOSS/MOSS-Image（GitHub 官方倉庫）](https://github.com/OpenMOSS/MOSS-Image)
- [MOSS-Image Technical Report（arXiv:2610.23374）](https://arxiv.org/abs/2610.23374)
- [ArtRealmAI：MOSS-Image Drops 5B Open Weights](https://artrealmai.com/article/moss-image-open-weights-5b-layout)
