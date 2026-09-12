---
title: "模型卡｜DeepSeek-V4.1-Flash"
date: 2026-09-11
category: daily
type: digest
tags: [ai-agent, model-release, daily, deepseek, model-family-deepseek]
lang: zh-TW
description: "DeepSeek 用新架構把 KV cache 壓到 890 bytes/token，Terminal-Bench 與 DeepSWE 雙雙超越 Claude Opus 5，官方同時宣布 9/14 起 V4-Pro 流量全數改路由到這顆更便宜的新模型"
tldr: "DeepSeek-V4.1-Flash（API 呼叫用 model ID：deepseek-flash）：552B 總參數 MoE，僅 8B（prefill）／16B（decode）啟用參數，1M context、384K 最大輸出；定價 Input $0.30／Output $1.20（尖峰，離峰對半），MIT 開源；DeepSWE v1.1 74.2 分超越 Claude Opus 5 的 74.0，Terminal-Bench 2.1 90.6 分同樣超車；9/14 起 V4-Pro 全數流量改路由到此模型，等於尖峰定價直接降 77%"
series:
  name: "AI Model Tracker"
  order: 19
glossary:
  - term: "DeepSeek V4"
    def: "DeepSeek（深度求索）開發的旗艦大型語言模型家族，分 Flash（輕量）與 Pro（旗艦）兩線，2026 年起加入多模態與更激進的 KV cache 壓縮技術"
---

> 🌏 [English version](/posts/daily/2026-09-11-model-deepseek-deepseek-v4-1-flash-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `deepseek-flash`（API 呼叫用；HuggingFace 倉庫為 `deepseek-ai/DeepSeek-V4.1-Flash`；舊名 `deepseek-v4-flash`／`deepseek-v4-flash-vision-exp` 仍可用，但請求會被導到本模型並按 Flash 價計費） |
| 廠商 | DeepSeek（深度求索） |
| 參數量 | 552B 總參數（含視覺編碼器達 763B）／8B 啟用參數（prefill）、16B（decode），MoE：1 共享專家＋384 路由專家，每 token 啟用 6 個路由專家 |
| Context Window | 1,000,000 tokens（最大輸出 384K tokens） |
| Input 定價 (USD/1M tokens) | $0.30（尖峰，cache miss）／$0.15（離峰）；cache hit 再降到 $0.006（尖峰）／$0.003（離峰） |
| Output 定價 (USD/1M tokens) | $1.20（尖峰）／$0.60（離峰） |
| 開源 | 是（MIT License，權重與參考推論程式碼公開於 HuggingFace） |
| 發布日 | 2026-09-10 |
| 官方公告 | [Models & Pricing — DeepSeek API Docs](https://api-docs.deepseek.com/quick_start/pricing) |
| HuggingFace | [deepseek-ai/DeepSeek-V4.1-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash) |
| 家族 | DeepSeek V4.x（接替 V4-Flash-0731 與 V4-Pro-0813，9/14 起 V4-Pro 全數流量改路由至此） |

## 能力亮點

- Terminal-Bench 2.1 拿下 90.6 分，是目前唯一超越 Claude Opus 5（89.1）的模型；DeepSWE v1.1 也以 74.2 分微幅超車 Opus 5 的 74.0
- 採用 Causal Encoder-Decoder（CED）架構：decoder 的 KV cache 直接從 encoder 最終隱狀態投影，而非每層自算，搭配 Compressed Sparse Attention 2（CSA2）與 FP4 主 KV 快取，把全域 KV cache 壓到每 token 890 bytes，約為前代 V4-Flash 的 1/4
- AutomationBench v1.0.6（Agent 自動化任務）54.8 分同組最高，CyberGym（資安任務）88.1 分同樣領先 GPT-5.6 Sol 與 GLM-5.3 的 84.5 分
- 支援 1 到 100 的連續可調推理強度（`reasoning_effort`），可在推理成本與準確度之間即時權衡，不需要切換不同模型

## Benchmark 表現

| Benchmark | 分數 | 前代 (V4-Flash-0731) | 競品最強 |
|---|---|---|---|
| Terminal-Bench 2.1 (Pass@1) | 90.6 | 82.7 | Claude Opus 5：89.1 |
| DeepSWE v1.1 (Resolved) | 74.2 | 54.4 | Claude Opus 5：74.0 |
| AutomationBench v1.0.6 (Pass@1) | 54.8 | 37.7 | Claude Opus 5：50.3 |
| CyberGym (Pass@1) | 88.1 | 76.7 | GPT-5.6 Sol／GLM-5.3：84.5 |
| GPQA Diamond (Pass@1) | 90.9 | 89.9 | GPT-5.6 Sol：94.1 |

⚠️ 以上皆為 DeepSeek 官方以 DeepSeek Harness（Minimal 模式，`temperature=1.0`、`top_p=0.95`，最大推理強度）或各 benchmark 官方 scaffold 自測，發布當日數據，尚無獨立第三方複現。

## 與前代/競品比較

跟 V4-Flash-0731 比，最大進步集中在 agentic 任務：DeepSWE v1.1 從 54.4 衝到 74.2（+19.8pp），AutomationBench 從 37.7 到 54.8（+17.1pp）。這不是單純堆參數換來的——啟用參數其實比前代的 13B 更省（8B/16B vs 13B），關鍵在架構：CED 讓 decoder 不必每層重算 KV，CSA2 的三態稀疏索引（Full／Reindex／Reuse）加上 FP4 主 KV 快取，把每 token 的 KV cache 從約 3,560 bytes 壓到 890 bytes。

跟 Claude Opus 5、GPT-5.6 Sol 等閉源模型比，DeepSeek-V4.1-Flash 在 agentic 類 benchmark（Terminal-Bench、DeepSWE、AutomationBench）全面領先，但純推理與知識類仍有落差：GPQA Diamond 90.9 分落後 GPT-5.6 Sol 的 94.1，Humanity's Last Exam 只有 36.8 分（Opus 5 為 56.3）。這是一個「重 agentic、輕通用推理」的定位。

定價策略上最激進的動作是官方直接讓 V4-Pro 退場：9 月 14 日 12:00（北京時間）起，所有打到 `deepseek-v4-pro` 的請求會全數改路由到 V4.1-Flash 並按 Flash 價計費，尖峰 input 從 $1.32 降到 $0.30（降 77%）、output 從 $3.96 降到 $1.20（降 70%），等於官方直接把旗艦定位讓給新模型，還順便替既有使用者大幅降價。

## 對 Agent 開發的意義

CED 架構把 decoder KV cache 從 encoder 投影出來，是這次對 agent 開發最直接的影響：長 context、多輪工具呼叫的 agent session，KV cache 成長速度大幅趨緩，1M context 配合 384K 最大輸出，讓「一次讀完整個大型 codebase」變得更划算。

- 如果你在做 coding agent 或 CLI agent：DeepSWE v1.1 74.2 分已經超過 Claude Opus 5，且啟用參數只有 8B/16B，值得優先評估把後端 model 換成 `deepseek-flash`，尤其是原本掛在 V4-Pro 上的工作負載——9/14 之後流量會自動遷移，等於免費拿到一次效能升級
- 如果你在做需要長時間維持 session 的多步驟自動化 agent：AutomationBench 54.8 分同組最高，加上 KV cache 壓縮帶來的成本優勢，適合需要反覆呼叫工具、來回驗證結果的長流程任務
- 不適合：純推理或知識密集型場景（Humanity's Last Exam 只有 36.8 分，遠落後 Opus 5 的 56.3），以及對準確率要求極高的高難度競賽型 coding 任務（Terminal-Bench 3.0／4.0 僅 30.0／31.2 分，明顯落後 Opus 5 的 43.3／51.8）

## 今日收穫

以前預設「省下啟用參數」等於犧牲能力，這次的 DeepSWE 數字打破這個假設——DeepSeek 靠架構設計（CED＋CSA2＋FP4 KV cache）把啟用參數從 13B 壓到 8B/16B，agentic benchmark 反而全面超車前代、甚至追平 Claude Opus 5。這提醒我評估 MoE 模型時，「啟用參數量」本身不是能力的代理指標，KV cache 如何跨層共用、稀疏索引怎麼設計，往往比單純的參數量數字更能決定 agentic 任務的實際表現。

## 參考資料

- [Models & Pricing — DeepSeek API Docs](https://api-docs.deepseek.com/quick_start/pricing)
- [HuggingFace model card: deepseek-ai/DeepSeek-V4.1-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash)
- [DeepSeek-V4.1-Flash Technical Report (PDF, via HuggingFace)](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/main/DeepSeek_V41_Tech_Report.pdf)
- [What Is DeepSeek-V4.1-Flash? — Apidog](https://apidog.com/blog/what-is-deepseek-v4-1-flash)
- [DeepSeek V4.1 Flash Replaces V4 Pro: Pricing and Benchmarks — Coursiv](https://coursiv.io/blog/deepseek-v4-1-flash)
- [DeepSeek V4.1 Flash API Pricing & Specs — GetDeploying](https://getdeploying.com/llms/deepseek-v4.1-flash)
