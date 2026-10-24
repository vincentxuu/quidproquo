---
title: "模型卡｜Fibo 2.0 Dev"
date: 2026-10-24
category: daily
type: digest
tags: [ai-agent, model-release, daily, bria, model-family-fibo]
lang: zh-TW
description: "Bria AI 發佈 Fibo 2.0——首個把圖像生成與指令式編輯合進同一組 8B 權重的開源模型，Artificial Analysis 開放權重圖像編輯榜第 1，每張成本僅 $0.032–0.04"
tldr: "Fibo 2.0 Dev：8B 參數 flow-matching 擴散模型，首次把生成與編輯整合進單一權重，支援遮罩編輯與最多 4 張參考圖；Artificial Analysis 開放權重圖像編輯榜第 1（1087 Elo）、文字轉圖第 2，與 Qwen-Image-2.1 統計誤差內打平；fal.ai 定價 $0.04／張，Bria API 實測 $0.032／張；CC BY-NC 4.0 僅限非商業用途，商用需另簽約"
series:
  name: "AI Model Tracker"
  order: 57
glossary:
  - term: "FIBO"
    def: "Bria AI 開發的結構化 JSON 提示詞（VGL）圖像生成模型家族，2025 年首發"
---

> 🌏 [English version](/posts/daily/2026-10-24-model-bria-fibo-2-0-dev-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `briaai/Fibo-2.0-dev`（另有 4 步蒸餾版 `briaai/Fibo-2.0-edit-turbo`） |
| 廠商 | Bria AI |
| 參數量 | 8B（flow-matching 擴散 transformer） |
| Context Window | 不適用（圖像生成模型；原生訓練解析度約 100 萬像素，建議尺寸為 16 的倍數，如 1024×1024、1424×800、1248×832） |
| 單張圖片定價（fal.ai） | $0.04 |
| 單張圖片定價（Bria API，Artificial Analysis 實測） | $0.032（即 $32 / 1,000 張） |
| 開源 | 是（CC BY-NC 4.0，僅限非商業用途；商業用途需另與 Bria 簽約） |
| 發布日 | 2026-10-20 |
| 官方公告 | [Hugging Face Model Card](https://huggingface.co/briaai/Fibo-2.0-dev) |
| HuggingFace | [briaai/Fibo-2.0-dev](https://huggingface.co/briaai/Fibo-2.0-dev) |
| 家族 | FIBO（Bria 結構化提示詞圖像模型家族，前代為 2025 年的 FIBO 1.0 與 2026 年 8 月的 Fibo-Edit-1.5） |

## 能力亮點

- 全球首個把「圖像生成」與「指令式編輯」整合進同一組權重的開源模型：同一個 checkpoint 同時支援生成、遮罩編輯、最多 4 張參考圖的多參考編輯，以及借用參考圖風格但不複製畫面的 Inspire 模式
- Artificial Analysis 開放權重圖像編輯榜單排名第 1（1087 Elo，來自 4,819 筆人類盲測投票），文字轉圖榜單排名第 2，與榜首 Qwen-Image-2.1（約 1083±13 Elo）statistically 打平
- 每張成本 $0.032–0.04（Bria API／fal.ai），比 Grok Imagine Image Quality（$0.05／張）、Qwen Image 2.0 Pro（$0.075／張）、Luma UNI 1 Max（$0.10／張）都便宜
- 沿用 FIBO 家族的 VGL（Visual GenAI Language）結構化 JSON 提示詞設計，取代自然語言描述，讓單一屬性（如光線、鏡頭角度、服裝）可以被獨立修改而不擾動畫面其他部分

## Benchmark 表現

| 項目 | Fibo 2.0 Dev | 前代（FIBO 1.0 / Fibo-Edit-1.5） | 競品最強 |
|---|---|---|---|
| AA-Image-Editing v2.1（開放權重排名） | 第 1（1087 Elo） | 官方稱「每項編輯動作皆提升」，未公開精確 Elo | Qwen-Image-2.1 約 1083±13 Elo（統計誤差內打平） |
| AA-Image-T2I v2.1（開放權重排名） | 第 2 | 同上 | Qwen-Image-2.1（開放權重第 1） |
| 強化／修復類編輯（含付費模型混排） | 第 6 名 | - | - |
| 文字轉圖－人體解剖準確度 | 第 18 名 | - | - |
| 文字轉圖－文字渲染／版面排布 | 第 19–21 名區間 | 官方稱「本代最大進步項目之一」 | 領先模型（如 Gemini 2.5 Flash Image 系列）仍明顯領先 |

⚠️ 上述 Elo 與排名皆引用自 Bria 官方模型卡所附的 Artificial Analysis（第三方獨立評測站）榜單結果，非 Bria 自測。但第三方媒體 ArtRealmAI 在發佈當下查核公開榜單，發現 Fibo 2.0 尚未正式上榜，榜首 Qwen-Image-2.1 當時仍顯示 1083±13 Elo——Bria 宣稱的領先幅度僅約 4 Elo，落在信賴區間內，說明「第 1／第 2」是官方引用尚待榜單正式更新前的自報排名，需待外部複現確認。

## 與前代/競品比較

跟 FIBO 1.0 與 2026 年 8 月的 Fibo-Edit-1.5 比，最大的架構變化是把「生成」與「編輯」兩條原本分離的模型路線合併進同一組 8B 權重：過去要分別部署生成模型與編輯模型，現在一次部署即可覆蓋兩種需求，同時官方表示在每一項編輯動作與文字轉圖能力上都比前代有提升。

跟目前開放權重文字轉圖榜首 Qwen-Image-2.1 比，兩者在 Elo 分數上幾乎打平（差距落在誤差範圍內），Fibo 2.0 的差異化優勢不在原始畫質分數，而在結構化 JSON 提示詞帶來的可控性與可重現性——同一張圖的「編輯」可以被當成對 JSON 欄位的 diff 操作，而不是重新寫一段自然語言提示詞賭運氣。弱項也很明確：文字渲染與複雜版面排布仍落在第 19–21 名區間，距離頂尖閉源模型仍有差距。

定價策略上，Fibo 2.0 用 $0.032–0.04／張打入目前最低價格帶，比 Grok Imagine、Qwen Image 2.0 Pro、Luma UNI 1 Max 都便宜；但授權走「開放權重僅限非商業使用，商業用途需另簽約」的路線，跟多數對手「開源即可商用」的策略不同，企業要先確認授權範圍才能上線。

## 對 Agent 開發的意義

結構化 JSON（VGL）提示詞是這次對 Agent 架構最有意義的設計：「編輯」被定義成對一份可讀、可比對、可版本控制的 JSON 藍圖做局部修改，而不是把整段自然語言提示詞重新丟給黑盒模型碰運氣。這代表視覺生成任務可以被納入跟程式碼一樣的 diff／review／重現流程。

- 如果你在做電商素材生成或品牌視覺一致性 Agent：可以讓 Agent 操作 JSON 欄位（光線、鏡頭角度、服裝顏色）而不是重寫提示詞，產出更可預測、更容易做 A/B 測試
- 如果你在做需要「同一條 pipeline 兼顧生成與編輯」的場景（虛擬試穿、產品合成、多參考圖合成）：Fibo 2.0 把兩種需求收進一個部署，省掉維護兩套模型的成本
- 不適合：需要商業授權卻沒預算與 Bria 簽約的場景（開放權重僅限非商業），以及需要精確文字渲染或複雜版面排布的場景——這塊仍明顯落後頂尖模型

## 今日收穫

過去預設「圖像生成」與「圖像編輯」是兩套不同模型、兩條推論 pipeline，各自優化。Fibo 2.0 把兩者合進同一組權重證明這個邊界不是技術上的必然,而是產品切分的歷史遺留——這提示日後設計多模態 Agent 工具介面時,未必要照「生成 vs 編輯」切分工具,而可以改用「輸入是否含圖片」這種更貼近資料形態的切法。

## 參考資料

- [briaai/Fibo-2.0-dev · Hugging Face（官方模型卡）](https://huggingface.co/briaai/Fibo-2.0-dev)
- [Bria Fibo 2.0: Open-Weights Edit + Gen in One 8B Model - ArtRealmAI](https://artrealmai.com/article/bria-fibo-2-0-open-weights-image-gen-edit)
- [Bria's FIBO 2.0 Matches Qwen on Open-Weights Image Benchmarks at Half the Price - AlphaSignal](https://alphasignal.ai/news/bria-s-fibo-2-0-matches-qwen-on-open-weights-image-benchmarks-at-half-the-price)
- [Artificial Analysis Image Arena（Text-to-Image Leaderboard）](https://artificialanalysis.ai/image/leaderboard/text-to-image)
