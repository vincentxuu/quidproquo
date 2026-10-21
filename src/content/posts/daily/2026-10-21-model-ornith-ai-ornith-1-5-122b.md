---
title: "模型卡｜Ornith-1.5-122B"
date: 2026-10-21
category: daily
type: digest
tags: [ai-agent, model-release, daily, ornith-ai, model-family-ornith]
lang: zh-TW
description: "DeepReinforce 悄悄在 HuggingFace 上架 Ornith-1.5 家族新尺寸 122B——MIT 授權、單張 80GB GPU 可跑、SWE-bench Verified 84.5%，訓練方法是模型自己生成任務、scaffold 與 rollout 的自我改進迴路"
tldr: "Ornith-1.5-122B：122B 總參數 MoE（active 參數未公開）、262,144 tokens 原生 context（YaRN scaling factor 4.0 可延伸至約 1M）、MIT 授權，單張 80GB GPU 可部署；2026-10-16 上架 HuggingFace，沒有對應部落格公告，靠社群與 HF trending 才被注意到；SWE-bench Verified（non-hack）84.5%、CyberGym 80.0%，均領先同量級的 Qwen3.8-Flash-Next（125B）；訓練方法沿用 Ornith-1.0 的自我改進迴路，但從單純優化 scaffold／rollout 擴展成同時優化任務生成、scaffold 建構與 rollout 三個環節；尚無官方或第三方代管 API 定價。"
series:
  name: "AI Model Tracker"
  order: 54
glossary:
  - term: "Ornith"
    def: "DeepReinforce 研發團隊發布的開源 agentic coding 模型家族，核心賣點是模型在強化學習訓練中自己生成任務與 scaffold，1.5 版本涵蓋 397B／122B／35B／9B 多種規模"
  - term: "DeepReinforce"
    def: "開發 Ornith 模型家族的研究團隊，2026 年 6 月以 Ornith-1.0 首次開源釋出"
---

> 🌏 [English version](/posts/daily/2026-10-21-model-ornith-ai-ornith-1-5-122b-en)


## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `ornith-ai/Ornith-1.5-122B` |
| 廠商 | DeepReinforce（Ornith 研發團隊，HuggingFace 組織名 ornith-ai） |
| 參數量 | 122B 總參數（MoE，active 參數官方未公開） |
| Context Window | 262,144 tokens（原生；YaRN scaling factor 4.0 可延伸至約 1,000,000 tokens） |
| Input 定價 (USD/1M tokens) | 不適用（純開源釋出，尚無官方或第三方代管 API） |
| Output 定價 (USD/1M tokens) | 不適用（純開源釋出，尚無官方或第三方代管 API） |
| 開源 | 是（MIT） |
| 發布日 | 2026-10-16（HuggingFace 倉庫建立日，無對應公司部落格公告） |
| 官方公告 | [ornith-ai/Ornith-1.5-122B · Hugging Face](https://huggingface.co/ornith-ai/Ornith-1.5-122B) |
| HuggingFace | [ornith-ai/Ornith-1.5-122B](https://huggingface.co/ornith-ai/Ornith-1.5-122B) |
| 家族 | Ornith 1.5（與 397B／35B-A3B／9B 同系列） |

## 能力亮點

- SWE-bench Verified（non-hack）達 84.5%，領先同量級的 Qwen3.8-Flash-Next（125B，82.8%）與 Qwen3.8-27B（76.8%）
- 訓練方法是「自我改進迴路」：模型自己生成訓練任務、建構對應的 agent scaffold（工具、分解策略、orchestration）、再產生 solution rollout 做強化學習，不依賴固定的人工任務集或人工設計的 harness
- 122B MoE 架構設計成可在單張 80GB GPU 上部署，比起同表內的 Beam-1.0（501B）、DeepSeek-V4-Flash-0731（284B）省下大量硬體需求
- 另有量化的 Ornith-1.5-122B-Mobile 版本，可裝進手機等邊緣裝置

## Benchmark 表現

| Benchmark | 分數 | 前代模型 | 競品最強 |
|---|---|---|---|
| SWE-bench Verified（non-hack） | 84.5 | 未提供同規模前代分數 | Qwen3.8-Flash-Next（125B）：82.8 |
| CyberGym | 80.0 | 未提供同規模前代分數 | Qwen3.8-Flash-Next（125B）：78.0 |
| Terminal-Bench 2.1（Claude Code） | 81.2 | 未提供同規模前代分數 | DeepSeek-V4-Flash-0731（284B）：82.7（領先） |
| BrowseComp | 78.5 | 未提供同規模前代分數 | Beam-1.0（501B）：80.2（領先） |
| HLE（含工具） | 48.0 | 未提供同規模前代分數 | Beam-1.0（501B）：51.1（領先） |

⚠️ 以上均為官方模型卡自測數據（SWE-bench 系列用 OpenHands harness、Terminal-Bench 用 Claude Code harness、HLE 用 Claude 4.6 Opus 當裁判模型），尚無外部單位獨立複現。Ornith-1.0 並未推出 122B 規模版本，因此沒有同規模的前代分數可對照。

## 與前代/競品比較

Ornith-1.0（2026-06 釋出）只有 9B／31B／35B MoE／397B MoE 四個尺寸，1.5 版本在 2026-08 的正式發布只公布了 397B／35B／9B 三個尺寸；122B 這個規格是 10 月中直接上架 HuggingFace，沒有對應的公司部落格公告，是靠 HF trending 榜單與社群文章才被注意到。訓練方法上，1.5 把 1.0 的「優化 scaffold 與 rollout」擴展成「同時優化任務生成、scaffold 建構與 rollout」三個環節，官方稱為更完整的自我改進迴路。

跟同量級的 Qwen3.8-Flash-Next（125B）比，Ornith-1.5-122B 在 SWE-bench Verified、CyberGym 上領先，但在 Terminal-Bench 2.1 上以 81.2% 落後 Qwen3.8-Flash-Next 的 83.4%。跟我們之前介紹過的 Beam-1.0（501B，見 [2026-10-18 模型卡](/posts/daily/2026-10-18-model-reflection-beam-1-0)）比，Ornith-1.5-122B 的總參數量只有對方的四分之一，SWE-bench Verified 卻以 84.5% 小勝 Beam（文中未單獨列出 Beam 這項分數，但 Beam 的 SWE-bench Pro 為 57.0%，Ornith 為 76.9%，領先幅度明顯），但在 BrowseComp、HLE（含工具）這類需要大量工具呼叫與長程搜尋的任務上落後 Beam——顯示 Ornith 的自我改進訓練在程式碼修復類任務上效率很高，但在開放式網路研究場景還沒追上更大規模的模型。

定價面向完全不同：Ornith 是純開源釋出，沒有官方代管 API，想用就得自架；DeepSeek-V4.1-Flash 雖然也是 MIT 授權開源，但官方另外提供按量計費的 API，兩者在「開源」之外的商業模式並不一樣。

## 對 Agent 開發的意義

如果你在做需要自架、單卡部署的 coding agent：122B 可在單張 80GB GPU 上跑，硬體成本遠低於 Beam（501B）或 DeepSeek（284B），加上 SWE-bench Verified／CyberGym 都領先同量級對手，值得當成自架 coding agent 的候選底座來評估。

如果你在做多 agent 系統或需要大量工具呼叫／MCP：MCP-Atlas 拿到 74.6 分，跟 501B 的 Beam 打平，BrowseComp 也有 78.5 分，代表這個量級的模型已經能處理相當份量的 agentic 工具呼叫場景；它的訓練方法本身（模型自己生成任務與 scaffold 再做 RL）也值得研究，而不只是把它當成現成模型來用。

不適合的場景：DeepReinforce 沒有公開完整的訓練方法論文或 arxiv 連結，自我改進迴路的細節只能從官方部落格的部分描述拼湊；也沒有官方代管 API 或廠商 SLA，想要穩定生產環境服務的團隊得自己處理部署、監控與安全加固，不像 DeepSeek 或 MiniMax 有現成的按量付費 API 可以直接串接。

## 今日收穫

這次學到「模型家族可能悄悄補規格」這件事：Ornith-1.5 在 8 月正式發布時只公布了 397B／35B／9B 三個尺寸，122B 這個版本是 10 月中直接上架 HuggingFace、沒有對應部落格公告，純粹靠 HF trending 榜單跟社群文章才被注意到。這提醒我「有沒有官方公告」在這個生態系裡不是模型值不值得追蹤的必要條件，追新模型除了盯廠商部落格，HuggingFace trending 本身就是一個不能漏看的訊號源。

## 參考資料

- [ornith-ai/Ornith-1.5-122B · Hugging Face](https://huggingface.co/ornith-ai/Ornith-1.5-122B)
- [Ornith-1.5: From Self-Scaffolding to Self-Improvement（Ornith 官方部落格）](https://ornith.ai/ornith_1_5.html)
- [MarkTechPost：DeepReinforce Releases Ornith-1.0](https://www.marktechpost.com/2026/06/25/deepreinforce-releases-ornith-1-0-an-open-source-coding-model-family-that-learns-its-own-rl-scaffolds/)
- [explainx.ai：Ornith-1.5-122B — 84.5 SWE-bench Verified on One GPU?](https://explainx.ai/blog/ornith-1-5-122b-open-weights-mit-single-80gb-gpu-swe-bench-verified-84-5-claimed-vs-verified-2026)
- [Medium（Mehul Gupta）：Ornith-1.5–122B Is Here: Self Improving LLM](https://medium.com/data-science-in-your-pocket/ornith-1-5-122b-is-here-self-improving-llm-5ad05d8de8cc)
