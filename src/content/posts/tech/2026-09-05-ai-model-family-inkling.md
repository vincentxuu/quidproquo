---
title: "Inkling——從 OpenAI 出走團隊到 975B 開源旗艦，以及 Tinker 微調平台的生態賭注"
date: 2026-09-05
category: tech
tags: [ai-agent, llm, thinking-machines-lab, inkling, model-family-inkling, open-source, moe, multimodal, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Thinking Machines Lab（Mira Murati 2025 年創立，20 億美元 seed、估值 120 億美元）2026 年 7 月以 Apache 2.0 釋出 Inkling（975B 總參數／41B 活躍、1M context、原生多模態、可控思考）與輕量版 Inkling-Small（276B／12B），搭配 Tinker 微調平台，把「可自訂」本身做成產品。"
description: "Thinking Machines Lab 與 Inkling 模型家族完整介紹：2025→2026 演化時間線、Tinker 微調平台與開源權重的雙軌策略、MoE 架構與 RL 規模化訓練、Inkling 與 Inkling-Small 選型、生態系一覽，以及 Agent 開發者的選型指南"
series:
  name: "AI 模型家族"
  order: 19
draft: false
glossary:
  - term: "Inkling"
    definition: "Thinking Machines Lab 2026 年 7 月釋出的開源旗艦模型——975B 總參數／41B 活躍的 MoE，Apache 2.0 授權"
  - term: "Inkling-Small"
    definition: "Inkling 的輕量版——276B 總參數／12B 活躍，推理與 agentic 能力反超大版，完整權重已釋出"
  - term: "Tinker"
    definition: "Thinking Machines Lab 的微調 API 平台——提交任務後由官方叢集執行訓練，可微調 Inkling、Qwen、Nemotron 等開源家族"
---

> 🌏 [English version](/posts/tech/2026-09-05-ai-model-family-inkling-en)

2025 年 2 月，前 OpenAI CTO Mira Murati 帶著約 30 位來自 OpenAI、Meta、Mistral 的研究與工程人員，在舊金山創立了 Thinking Machines Lab。同年 7 月，公司在還沒有任何產品的情況下完成 20 億美元 seed 輪、估值 120 億美元，由 a16z 領投——創下矽谷早期融資紀錄。一年後，它交出的第一份答卷不是封閉 API，而是一個 Apache 2.0 開源模型 Inkling（975B 總參數），外加一個把微調做成服務的 Tinker 平台。這是「AI 模型家族」系列的第十九篇家族深度介紹，追蹤這家公司從 Tinker 到 Inkling、再到 Inkling-Small 的路線，以及它「不賣最強模型、賣可自訂性」的賭注。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的一部分。

## 家族演化時間線

| 時間 | 事件 | 關鍵意義 |
|---|---|---|
| 2025-02 | 公司成立 | Murati 創立，創始團隊含 OpenAI 共同創辦人 John Schulman（首席科學家）、前研究副總 Barret Zoph、前副總 Lilian Weng |
| 2025-07 | 20 億美元 seed，估值 120 億美元 | a16z 領投，Nvidia、AMD、Cisco、Jane Street 等參投；產品上線前的史上最大 seed 輪之一 |
| 2025-10-01 | Tinker 上線 | 微調 API 先行，先支援 Qwen、Nemotron、DeepSeek、GLM、Kimi 等第三方開源模型 |
| 2025-10 | 共同創辦人 Andrew Tulloch 被 Meta 挖角 | 2026-01 Barret Zoph、Luke Metz 回流 OpenAI；人才保衛戰的代價 |
| 2026-03 | NVIDIA 戰略合作 | 1GW Vera Rubin 算力多年協議，算力來源落地 |
| 2026-07-15 | Inkling 發佈 | Apache 2.0 開源權重，975B 總參數／41B 活躍，1M context |
| 2026-07-30 | Inkling-Small 正式版 | 276B 總參數／12B 活躍，完整權重釋出，推理與 agentic 反超大版 |

一年半、七個里程碑。TML 的演化有一條清晰的主線：**先賣微調能力（Tinker）證明自己懂 post-training，再交開源權重（Inkling）換生態**——順序跟多數實驗室相反，多數是先放模型再補工具。

## 兩條產品線：開源權重收生態，Tinker 微調收營收

看懂 TML 在 2026 年的動作，關鍵是把它拆成兩條平行線：

**開源權重線**（Hugging Face 上的 `thinkingmachines` org）：Inkling 與 Inkling-Small 完整權重，外加 NVFP4 量化版（給 NVIDIA Blackwell 系統）。這條線負責生態位——Apache 2.0 比 Llama 的 Community License 乾淨，SGLang、vLLM、TokenSpeed、llama.cpp、transformers 全支援，自架門檻只剩硬體。

**Tinker 平台線**（微調 API＋Playground）：提交微調任務，由官方內部叢集執行訓練。支援的家族含 Inkling、Qwen、Nemotron，以及 DeepSeek-V3.1、GLM-5.3、Kimi K2.6、gpt-oss 等單一模型；調完的 checkpoint 可直接部署到 Together AI、Fireworks、Modal、Databricks、Baseten。官方還附了 cookbook 與 `tml-renderer`（工具呼叫與多模態採樣的後處理工具），以及免費試用的 Playground 聊天介面。這條線負責營收——把「 post-training scaling 很值錢」這件事產品化（同系列 [GLM 篇](/posts/tech/2026-08-24-ai-model-family-glm)提過，GLM-5.3 靠純 post-training 把能力拉高 6 倍；TML 直接把這條路徑賣給你）。

中間的取捨值得記：TML 明說 Inkling「不是現有最強的模型，開源或封閉皆然」。它不跟 Claude、GPT 拚榜首，而是把「好調、好跑、授權乾淨」做成賣點——這是新創實驗室打不過巨頭算力規模時的理性選擇。

## 架構：MoE 骨架不新，訓練方法才是本體

Inkling 是 66 層 decoder-only Transformer，MoE 設計大致沿用 DeepSeek-V3：每層 256 個路由專家、每 token 啟用 6 個，外加 2 個常駐共享專家。幾個偏離主流配方的選擇都是為了效率與長上下文：sigmoid 路由器加無輔助損失的負載平衡偏差；滑動窗口與全域注意力以 5:1 交替、8 個 KV 頭；用相對位置編碼取代 RoPE，外推更長序列；注意力與殘差分支各加一段短卷積。

真正的差異在訓練。預訓練 45 兆 token（文字、圖像、音訊、影片），大矩陣用 Muon、其餘用 Adam 的混合優化。後訓練先用含 Kimi K2.5 生成合成資料的 SFT 熱啟動，再做超過 3,000 萬次 rollout 的非同步 RL——推理分數隨 rollout 呈對數線性成長。官方還用 system message 加每 token 成本做出**可控思考（controllable effort）**：effort 從 0.2 拉到 0.99，Terminal Bench 上用約三分之一 token 達到 Nemotron 3 Ultra 同等分數。RL 的副產品很有意思：思維鏈自己變精簡，丟掉文法贅字但保持可讀——效率壓力壓出來的電報體。

多模態是無編碼器原生設計：音訊走 dMel 頻譜圖（WAV 16kHz、最長 20 分鐘），圖像切 40×40 區塊經四層 hMLP，與文字 token 同爐處理。輸入吃文字、圖像、音訊，輸出目前只有文字（含程式碼與結構化資料）。

## Inkling、Inkling-Small 怎麼選

| 面向 | Inkling | Inkling-Small |
|---|---|---|
| 參數 | 975B 總／41B 活躍 | 276B 總／12B 活躍 |
| 推理與 agentic | HLE 29.7%、SWE-Bench Verified 77.6%、Terminal Bench 2.1 63.8% | HLE 31.6%、SWE-Bench 80.2%、Terminal Bench 64.7%，全面反超 |
| 知識與事實性 | SimpleQA 43.9%、Tau 3 Banking 23.7% | SimpleQA 20.6%、Tau 3 Banking 15.5%，明顯落後 |
| 效率 | GDPval 1238 Elo、每任務約 28.6k token | GDPval 1269 Elo、每任務約 23k token |
| 自架成本 | BF16 需 2TB VRAM（8×B300 或 16×H200） | 輕得多；或直接用 NVFP4（600GB 起） |

選擇邏輯很乾脆：**要推理、寫程式、跑 agent、壓成本——選 Small；要知識覆蓋與事實問答——選大版**。Small 之所以能反超，是因為晚開工：預訓練資料配方改過，又用 Inkling 當老師做 on-policy 蒸餾，再加兩週 agentic coding RL。這也留下一個警示：小模型的知識與校準是拿參數換的，事實性任務別省錯地方。

## 子線與生態系：一張表看懂 TML 有多少東西

| 品項 | 內容 | 取得方式 |
|---|---|---|
| Inkling | 旗艦開源 MoE，975B／41B，1M context | Apache 2.0，HF `thinkingmachines/inkling`（原始＋NVFP4） |
| Inkling-Small | 輕量版，276B／12B | 同上，`thinkingmachines/Inkling-Small` |
| Tinker | 微調 API＋Playground | 官方平台，Inkling 上下文選項 64K／256K，限時五折 |
| 推論夥伴 | Together AI、Fireworks、Modal、Databricks、Baseten | 各家 API，Day 0 上架 |
| 開源框架 | SGLang、vLLM、TokenSpeed、llama.cpp、transformers | 社群整合（RadixArk、Inferact、Lightseek、Unsloth、HF 協作） |
| 開發工具 | cookbook 三份音訊配方、`tml-renderer` | GitHub、PyPI |

## 跟競品的位置

Inkling 的定位是「美國開源領先、全球開源第二梯隊前段」。官方比較表（effort 0.99，官方自測、第三方尚未全面複現） absoluta 數字如下，挑關鍵幾列：

| Benchmark | Inkling | Small | Nemotron 3 Ultra | Kimi K2.6 | GLM 5.2 | GPT-5.6 Sol | Claude Fable 5 |
|---|---|---|---|---|---|---|---|
| SWE-Bench Verified | 77.6% | 80.2% | 70.7% | 80.2% | 80.0% | 82.2% | 95.0% |
| Terminal Bench 2.1 | 63.8% | 64.7% | 56.4% | 71.3% | 82.7% | 89.5% | 84.6% |
| MCP Atlas | 76.0% | 79.6% | 44.7% | 68.1% | 77.8% | 81.8% | 83.3% |
| HLE（含工具） | 46.0% | 47.8% | 37.4% | 54.0% | 54.7% | 55.0% | 64.5% |
| FORTRESS（對抗） | 78.0% | 71.6% | 77.6% | 65.6% | 71.3% | 82.4% | 96.0% |

⚠️ 以上為 TML 官方自測結果，第三方尚未獨立複現。

三個判讀：第一，美國開源內戰它贏了 Nemotron 3 Ultra（MCP Atlas 76.0 對 44.7 是輾壓級差距）；第二，對上中國開源（GLM-5.2、Kimi K2.6、DeepSeek V4 Pro）互有勝負，Terminal Bench 的 82.7%（GLM-5.2）仍是它摸不到的天花板；第三，封閉前沿（Claude Fable 5、GPT-5.6 Sol）全面領先，SWE-Bench 的 95.0% 對 77.6% 說明差距不在一個檔次。安全是亮點：FORTRESS 對抗 78.0% 是表列開源最高，且 benign 95.9% 沒過度拒答。

## 對 Agent 開發者的意義

- 如果你在做 coding agent：Inkling-Small 是目前開源性價比前段——SWE-Bench 80.2% 配 12B 活躍參數，加可控 effort，長流程任務的 token 帳單可以直接調。harness 方面官方已驗證多種 coding／agent 框架，且訓練時隨機化工具 schema，對特定 harness 的敏感度較低。
- 如果你在做 RAG／知識問答：選大版 Inkling（SimpleQA 43.9% 對 Small 的 20.6%），或等 Tinker 上針對事實性微調。別被 Small 的推理分數騙去跑問答。
- 如果你在評估自架：BF16 大版要 2TB VRAM，務實起點是 NVFP4（600GB）或 Small；再往下才是 Tinker 代管。Playground 可先免費試手感，選 base model 本來就是「分數＋手感」的綜合判斷，官方自己都這麼說。
- 不適合：要榜首效能（去封閉模型）、要語音輸出（Inkling 音訊只能輸入）、要立即商用授權以外的保證（Apache 2.0 乾淨，但下游部署的 moderation 要自己疊，官方建議 Llama Guard 做 defense-in-depth）。

## 整體來說

Thinking Machines Lab 的護城河不是模型規模，而是「把可自訂性做成產品」：Tinker 賣 post-training 能力，Apache 2.0 權重換生態，可控 effort 賣成本曲線。這套打法適合需要長期自訂、私有部署、授權乾淨的團隊；代價是榜首效能、成熟生態、公司稳定性都還在路上——共同創辦人回流 OpenAI、NVIDIA 算力剛落地、多模態輸出仍是純文字。選它，等於押注「夠好且可調」比「最強但封閉」更值錢。

## 參考資料

- [Thinking Machines Lab 官網](https://thinkingmachines.ai)
- [Inkling：我們的開源模型（官方公告，2026-07-15）](https://thinkingmachines.ai/news/introducing-inkling)
- [Inkling Model Card（官方技術文件）](https://thinkingmachines.ai/model-card/inkling/)
- [Inkling-Small 公告（官方，2026-07-30）](https://thinkingmachines.ai/news/inkling-small/)
- [Thinking Machines Lab — Wikipedia（含公司歷史、募資與產品整理）](https://en.wikipedia.org/wiki/Thinking_Machines_Lab)
