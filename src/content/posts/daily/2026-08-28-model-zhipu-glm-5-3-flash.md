---
title: "模型卡｜GLM-5.3-Flash"
date: 2026-08-28
category: daily
type: digest
tags: [ai-agent, model-release, daily, zhipu, model-family-glm]
lang: zh-TW
description: "Z.ai 揭曉先前以「Ox Alpha」匿名跑了一週的模型正是 GLM-5.3-Flash——GLM-5 系列首個原生多模態模型，320B 總參數僅活躍 18B，MIT 授權開權重，定價只有前代 GLM-5.3 的九分之一"
tldr: "GLM-5.3-Flash：320B 總參數／18B 活躍（MoE），1M context／131K 最大輸出，支援文字＋圖片＋影片輸入，MIT 授權權重已上 HuggingFace；標準定價 input $0.15／output $0.50（每 100 萬 tokens，即日起到 9/9 五折 $0.075／$0.25），比同家 GLM-5.3 便宜約 9 成；Terminal-Bench 2.1 達 84.3（僅次 Opus 4.8 的 85.0），DeepSWE 1.1 從 GLM-5.2 的 46.2 跳到 63.4；前身「Ox Alpha」匿名期間曾拿下 OpenRouter 單週 token 占比第一"
series:
  name: "AI Model Tracker"
  order: 8
glossary:
  - term: "GLM"
    def: "Zhipu AI（智譜，國際品牌 Z.ai）開發的開源大型語言模型家族"
---

> 🌏 [English version](/en/posts/daily/2026-08-28-model-zhipu-glm-5-3-flash-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `glm-5.3-flash` |
| 廠商 | Zhipu AI（智譜，國際品牌 Z.ai） |
| 參數量 | 320B 總參數，18B 活躍參數（MoE） |
| Context Window | 1,048,576 tokens（最大輸出 131,072 tokens） |
| Input 定價 (USD/1M tokens) | $0.15（cached input $0.03；即日起至 2026-09-09 UTC+8 24:00 五折 $0.075） |
| Output 定價 (USD/1M tokens) | $0.50（同期五折 $0.25） |
| 開源 | 是（MIT 授權，權重已上架） |
| 發布日 | 2026-08-26（前身「Ox Alpha」自 2026-08-20 起以匿名身分在 OpenRouter／OpenCode 提供一週免費服務） |
| 官方公告 | [Z.ai Blog：GLM-5.3-Flash](https://z.ai/blog/glm-5.3-flash) |
| HuggingFace | [zai-org/GLM-5.3-Flash](https://huggingface.co/zai-org/GLM-5.3-Flash) |
| 家族 | GLM 5.x（GLM-5 系列首個原生多模態模型） |

## 能力亮點

- GLM-5 系列首個原生多模態模型：同時接受文字、圖片、影片輸入，輸出文字，官方稱其多模態能力已整合進 ZCode 的 Browser Use 與 Computer Use 功能
- 採 Hybrid KDA（線性注意力）+ NoPE 稀疏 MLA 混合架構，官方稱注意力運算量減少約 3 倍、KV cache 縮小約 4.4 倍
- Terminal-Bench 2.1 達 84.3 分，逼近 Claude Opus 4.8 的 85.0，遠優於前代 GLM-5.2
- DeepSWE v1.1 從 GLM-5.2 的 46.2 跳到 63.4，AutomationBench 從 26.2 跳到 48.8，代理型任務進步幅度最大
- Artificial Analysis Intelligence Index v4.1.1 拿下 57 分，且推論成本只要 $0.045／task（五折價），官方稱「相當於過去要花 10 倍成本才能買到的智慧水準」

## Benchmark 表現

| Benchmark | GLM-5.3-Flash | GLM-5.2（前代） | 競品參考 |
|---|---|---|---|
| Terminal-Bench 2.1 | 84.3 | — | Claude Opus 4.8：85.0；GPT-5.6 Terra：87.4 |
| DeepSWE v1.1 | 63.4 | 46.2 | — |
| AutomationBench | 48.8 | 26.2 | — |
| Z.ai Code Bench v1.0（max） | 29.0 | — | Claude Opus 4.8：29.5 |
| HLE（Humanity's Last Exam） | 55.3 | — | — |
| Artificial Analysis Intelligence Index v4.1.1 | 57 | — | 48.7 tokens/sec、TTFT 1.52s（Z.ai API 實測） |

⚠️ Terminal-Bench、DeepSWE、AutomationBench、Z.ai Code Bench、HLE 均為 Z.ai 官方自測；Artificial Analysis Intelligence Index 為第三方獨立評測機構分數，可信度較高。視覺能力（BabyVision、MVBench）官方未列在主打 benchmark 中，第三方報導指出弱於 Gemini 3.7 Flash。

## 與前代/競品比較

跟同家 GLM-5.3（純文字旗艦，744B 總參數估算／40B 活躍）比，GLM-5.3-Flash 用不到一半的活躍參數換到原生多模態能力，且 Terminal-Bench 沒有明顯掉分。定價落差更誇張：GLM-5.3 的 input/output 是 $1.40/$4.40，GLM-5.3-Flash 只要 $0.15/$0.50，價格直接砍到約九分之一，等於「多模態＋更小活躍參數＋更低價」三個方向同時進步，這在同一家族內部相當罕見——通常 Flash 版是犧牲能力換速度，這次官方強調的是架構效率（Hybrid KDA + NoPE 稀疏 MLA），不是單純縮小模型。

跟閉源前緣模型比，Terminal-Bench 2.1 的 84.3 只落後 Claude Opus 4.8 的 85.0 約 0.7 分，Z.ai Code Bench 更是只差 0.5 分（29.0 vs 29.5）——但 Opus 4.8 的定價是 $5/$25，GLM-5.3-Flash 五折期只要 $0.075/$0.25，價差達 66 倍以上。這種「性能逼近前緣、價格砍到零頭」的組合，正是它以「Ox Alpha」匿名跑一週就能衝上 OpenRouter 單週 token 占比第一（約 19 個百分點）的直接原因。

值得注意的是這次公開強調了「完全用中國自產晶片提供匿名服務一週」的基礎設施主張——如果屬實，代表的不只是訓練端（此前 GLM-5.1/5.2 已用華為昇騰晶片訓練），而是首次證明生產環境的高流量推論也能完全脫離 Nvidia 供應鏈，但此說法目前僅有 Z.ai 官方單方陳述，尚待第三方查證。

## 對 Agent 開發的意義

Coding agent 場景是這次最直接的受眾：DeepSWE 1.1（軟體工程代理任務）從 46.2 跳到 63.4，AutomationBench（雲端應用自動化）從 26.2 跳到 48.8，兩者都是需要多輪工具呼叫、長時序規劃的任務類型，進步幅度遠大於單輪對話類 benchmark。

- 如果你在做 coding agent 或需要多模態理解（螢幕截圖、UI 元素辨識）的自動化工具：GLM-5.3-Flash 的原生多模態＋低價格組合值得排進評測清單，尤其若目前卡在 Claude/GPT 系列的成本上限
- 如果你在做預算敏感的高吞吐量批次任務：$0.15/$0.50（甚至五折期 $0.075/$0.25）的定價比多數同能力等級模型低一個數量級，適合大量並行的 agent 實驗或背景任務
- 不適合：需要嚴謹視覺推理的場景（第三方報導指出視覺 benchmark 弱於 Gemini 3.7 Flash），以及需要合規稽核清楚供應鏈來源的企業場景——「中國自產晶片」與資料處理地點等細節官方揭露有限

## 今日收穫

「Ox Alpha」這種匿名發佈手法很有意思：先用免費、無限流量的方式讓社群自己去猜是誰家的模型，等討論度衝到最高再揭曉身分並附上完整技術細節與定價。這比傳統「發公告→等社群測試」的順序反過來，等於用懸念本身換取免費的社群壓力測試與話題熱度——而且這次匿名期間的高流量還被拿來當作「本地晶片撐得住生產流量」的證據，行銷敘事和技術驗證被綁在同一件事上。

## 參考資料

- [Z.ai Blog：GLM-5.3-Flash: Frontier Intelligence, Flash Cost](https://z.ai/blog/glm-5.3-flash)
- [Z.ai Developer Docs：Pricing Overview](https://docs.z.ai/guides/overview/pricing)
- [Z.ai Developer Docs：GLM-5.3-Flash Model Guide](https://docs.z.ai/guides/vlm/glm-5.3-flash)
- [MarkTechPost：Z.ai Releases GLM-5.3-Flash: A 320B-A18B Natively Multimodal MoE With a 1M-Token Context](https://www.marktechpost.com/2026/08/26/z-ai-releases-glm-5-3-flash-a-320b-a18b-natively-multimodal-moe-with-a-1m-token-context/)
- [Capital & Compute：GLM-5.3-Flash: Price, Specs, and Benchmarks](https://capitalandcompute.net/blog/glm-5-3-flash-pricing-benchmarks/)
- [SiliconANGLE：Z.ai open-sources 'Ox Alpha' model as GLM-5.3-Flash](https://siliconangle.com/2026/08/26/z-ai-open-sources-ox-alpha-model-as-glm-5-3-flash/)
- [OfficeChai：Ox Alpha (GLM 5.3 Flash) Was Powered By "Pure Chinese Chips", Is Priced At 1/100th Of Frontier: Z.AI Founder Jie Tang](https://officechai.com/ai/ox-alpha-glm-5-3-flash-was-powered-by-pure-chinese-chips-is-priced-at-1-100th-of-frontier-z-ai-founder-jie-tang/)
