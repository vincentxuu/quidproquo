---
title: "模型卡｜MiniMax-H3-Image"
date: 2026-11-16
category: daily
type: digest
tags: [ai-agent, model-release, daily, minimax, model-family-minimax]
lang: zh-TW
description: "MiniMax 發布開放權重圖像模型 H3-Image——33.1B dense diffusion transformer、6 步蒸餾實現 16MP 輸出；Artificial Analysis 編輯榜小勝 Nano Banana 2，但生圖榜落後 77 Elo，授權排除美歐英韓四地商用部署"
tldr: "MiniMax-H3-Image：33.1B dense diffusion transformer、6-step 蒸餾採樣、16MP（4096×4096 起）原生輸出；Artificial Analysis image editing Elo 1138（#13/84，小勝 Nano Banana 2 的 1126）、text-to-image Elo 1066（#25/114，落後 Nano Banana 2 77 分）；API 定價 1K 約 $0.022、4K 約 $0.069（限時 50% off 至 2026-11-17 16:00 UTC）；MiniMax-H3-Image Community License 排除美國、歐盟、英國、南韓商用部署"
series:
  name: "AI Model Tracker"
  order: 74
glossary:
  - term: "MiniMax H3"
    def: "MiniMax 於 2026-07-31 發布的開放權重 omni-modal 影片模型，可理解文字／圖像／影片／音訊並生成影片；H3-Image 拿掉其 audio 層、改接圖像生成頭衍生而來"
---

> 🌏 [English version](/posts/daily/2026-11-16-model-minimax-h3-image-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `MiniMax-H3-Image`（Highspeed 版：`MiniMax-H3-Image-Highspeed`） |
| 廠商 | MiniMax |
| 參數量 | 33.1B（dense 單流 diffusion transformer，50 層；另需載入 66.7GB 的 MiniMax-H3 Qwen3-VL 文字編碼器，權重合計約 135GB） |
| Context Window | 不適用（圖像生成模型；prompt 經 H3-Image-Context-IR 擴寫後，本機部署僅前約 4,096 tokens 生效，API 可送最多 32,000 字元） |
| Input 定價 (USD/1M tokens) | 按張計費為主：Standard 模式 1K $0.02179／2K $0.02333／4K $0.06879（4K 限時 50% off 至 2026-11-17 16:00 UTC 為 $0.03439）；底層 token 費率：input text $2.30、input image $1.50（每 1M tokens） |
| Output 定價 (USD/1M tokens) | Standard output image $3.80／1M tokens；Highspeed 模式 output $7.60／1M tokens，對應單張 4K 約 $0.13（無限時折扣） |
| 開源 | 是（MiniMax-H3-Image Community License Agreement；排除美國、歐盟、英國、南韓四地的部署與使用；年收入逾 100 萬美元或提供託管服務須另申請書面授權；商用介面需顯著標示「MiniMax-H3-Image」字樣） |
| 發布日 | 2026-11-10 |
| 官方公告 | [MiniMax Blog：H3-Image](https://www.minimax.io/blog/minimax-h3-image) |
| HuggingFace | [MiniMaxAI/MiniMax-H3-Image](https://huggingface.co/MiniMaxAI/MiniMax-H3-Image) |
| 家族 | MiniMax H3（H3 影片模型，2026-07-31 → H3-Image 圖像生成／編輯，本次） |

## 能力亮點

- 16 百萬像素原生輸出，涵蓋 4096×4096（1:1）到 6272×2688（21:9）全比例，不需 upscaler，API 上限 20,000,000 像素
- 6 步蒸餾採樣（6 NFEs）、無 classifier-free guidance，官方宣稱 4K 生成在 10 秒內、比主流方案快達 5 倍 ⚠️ 第三方實測 4K 僅 Highspeed 檔位接近 10 秒，Standard 檔位未見獨立測速數據佐證「under 10 seconds」
- 最多 16 張未分類參考圖，依上傳順序以 `<Picture 1>` 至 `<Picture 16>` 定位，同一張卡覆蓋文生圖與圖像編輯兩種任務
- Artificial Analysis 獨立榜（2026-11-13 公布）：image editing 排第 13／84，Elo 1138，小勝 Nano Banana 2 的 1126（領先 12 分，信賴區間略重疊）；text-to-image 排第 25／114，Elo 1066，落後 Nano Banana 2 的 1143 達 77 分（信賴區間不重疊）

## Benchmark 表現

| Benchmark | 分數 | 前代 | 競品最強 |
|---|---|---|---|
| Artificial Analysis Image Editing Elo | 1138（#13/84） | 無（MiniMax 首款專門圖像模型，無圖像前代可比） | Nano Banana 2 1126（#17/84） |
| Artificial Analysis Text-to-Image Elo | 1066（#25/114） | 無 | Nano Banana 2 1143（#11/114） |
| Highspeed 版 Image Editing Elo | 1134（#14/84） | 無 | 同上 |
| Highspeed 版 Text-to-Image Elo | 1072（#24/114） | 無 | 同上 |

⚠️ 以上均為 Artificial Analysis 第三方獨立排行榜分數，非官方自測——MiniMax 官方部落格與 HuggingFace 模型卡本身都沒有公布 GenEval、DPG-Bench 或任何量化評測表，發布當週（截至 2026-11-12）唯一的「證據」是展示圖集，直到 Artificial Analysis 於 2026-11-13 把它納入兩個獨立榜單才第一次有可信的量化分數。

## 與前代/競品比較

H3-Image 沒有真正的「前代圖像模型」可比——MiniMax 過去的 Hailuo 01／02 是影片模型，H3-Image 是公司首款專門的圖像生成／編輯模型，架構上繼承自 2026-07-31 發布的 H3 影片模型（拿掉 audio 層、沿用其 Qwen3-VL 文字編碼器）。

跟 Google Nano Banana 2 比，Artificial Analysis 的榜單呈現一個清楚的「交叉」：H3-Image 在 image editing 小贏 12 Elo，但在 text-to-image 上輸 77 Elo，且信賴區間完全不重疊。這跟兩者的設計取向吻合——H3-Image 的 16 張未分類參考圖＋固定 6 步採樣是為「拿到參考圖、照著改」而生，Nano Banana 2 的 14 張分類參考圖（10 物件＋4 角色）＋search grounding＋可調的 thinking budget 則是更完整的生成管線，犧牲的是推理延遲與費用。

定價上 H3-Image 明顯便宜：1K 標準價 $0.02179 對 Nano Banana 2 的 $0.0336（便宜約 35%），4K 標準價 $0.06879 對 $0.113（便宜約 39%），限時折扣期間的 4K 價格 $0.03439 更只要對手的三成。但這個折扣在 2026-11-17 16:00 UTC 到期，屆時 4K 的價差會明顯收斂。授權是最容易被定價表掩蓋的差異：MiniMax-H3-Image Community License 明確排除美國、歐盟、英國、南韓四地的部署與使用，「開放權重」在這四個市場等於無法合法商用，必須另洽授權；Nano Banana 2 作為標準 API 產品沒有這個限制，但也完全沒有搜尋溯源標記（SynthID／C2PA）以外的對等機制可比較授權彈性。

## 對 Agent 開發的意義

固定 6 步採樣、無 CFG、無法調整引導強度，代表同一個 seed 與輸入在自己的硬體上可以逐位元重現——這對需要「視覺輸出做迴歸測試」的 pipeline 是罕見的優點：大多數擴散模型的採樣引數一變就很難複現同一張圖，H3-Image 從設計上直接拿掉了這個變因。

- 如果你在做電商／行銷素材批次生成的 Agent：16MP 原生輸出加上「token 計費但價格曲線平緩」的特性（4K 只比列表價貴 3 倍，但像素是 16 倍），搭配比 Nano Banana 2 便宜 30–40% 的定價，適合大量 4K 素材的批次產線——但要先確認團隊所在地不在美歐英韓四地的授權排除清單內
- 如果你在做「給定參考圖做風格一致編輯」的任務（角色換裝、場景合成、UI 改版示意）：16 張未分類參考圖的彈性加上 Elo 編輯榜小勝的信號，是比起純文生圖更值得優先測試的場景
- 不適合：需要 search grounding 或要求輸出帶 SynthID／C2PA 溯源標記的場景——H3-Image 完全沒有這兩項，Nano Banana 2 都有；也不適合對「空白頁」文生圖品質要求高的正式生產環境，Elo 落後對手 77 分、信賴區間不重疊，是這次比較中最確定的一項差距

## 今日收穫

MiniMax 官方部落格與 HF 模型卡完全沒有放任何量化評測表，直到發布三天後 Artificial Analysis 把它納入兩個獨立榜單，才第一次看到可信的分數對比——這印證了「開放權重」跟「廠商自己誠實量化評測」是兩件完全獨立的事：追蹤新模型發布時，官方沒給分數不代表沒有分數，而是要等外部榜單補上才能判斷實力；"5x faster"、"leading open-weight model" 這類宣稱在外部數據出現前，都只是宣稱，不是結論。

## 參考資料

- [MiniMax 官方部落格：H3-Image](https://www.minimax.io/blog/minimax-h3-image)
- [MiniMaxAI/MiniMax-H3-Image HuggingFace 模型卡（架構、授權、Model Zoo 細節）](https://huggingface.co/MiniMaxAI/MiniMax-H3-Image)
- [OrcaRouter：MiniMax-H3-Image vs Nano Banana 2.1——定價比較與「無獨立榜單」初評（2026-11-10）](https://www.orcarouter.ai/blog/minimax-h3-image-vs-nano-banana-2-1)
- [OrcaRouter：MiniMax-H3-Image vs Nano Banana 2——Artificial Analysis Elo 分數與授權地區限制（2026-11-14）](https://www.orcarouter.ai/blog/minimax-h3-image-vs-nano-banana-2)
- [TechTimes：MiniMax H3-Image 4K 生成速度第三方實測（2026-11-12）](https://www.techtimes.com/articles/330529/20261112/minimax-releases-open-weight-image-model-h3-image-only-pricier-highspeed-tier-nears-10-second-4k.htm)
- [TokenPost：MiniMax H3-Image 授權排除美國、歐盟、英國、南韓（2026-11-11）](https://www.tokenpost.com/news/technology/54375)
