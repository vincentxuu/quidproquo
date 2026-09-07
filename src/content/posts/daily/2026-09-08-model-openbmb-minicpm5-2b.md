---
title: "模型卡｜MiniCPM5-2B"
date: 2026-09-08
category: daily
type: digest
tags: [ai-agent, model-release, daily, openbmb, model-family-minicpm]
lang: zh-TW
description: "OpenBMB 悄悄釋出 MiniCPM5-2B——2.6B 稠密模型、131K context、Apache-2.0 全開源，在中立的 Artificial Analysis 評測中拿下 4B 以下開權重模型最高分"
tldr: "MiniCPM5-2B（openbmb/MiniCPM5-2B）：OpenBMB 於 2026-09-06 悄悄上架 Hugging Face（無官方部落格公告），2.6B 稠密參數、131,072 tokens context window、Apache-2.0 完全開源；中立第三方 Artificial Analysis Intelligence Index v4.2 拿下 15 分，是所有 4B 以下開權重模型最高分（次高 Granite 4.2 3B 僅 11 分）；GDPval-AA v2 真實工作任務 Elo 831 全場最高；FlagOS 已支援 9 種 AI 晶片（含 Huawei Ascend、NVIDIA）day-zero 部署"
series:
  name: "AI Model Tracker"
  order: 18
glossary:
  - term: "MiniCPM"
    def: "OpenBMB（模力方舟）開發的端側輕量模型家族，主打手機、PC、車機等資源受限場景的本地部署"
---

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `openbmb/MiniCPM5-2B` |
| 廠商 | OpenBMB（模力方舟 ModelBest） |
| 參數量 | 2.6B 稠密（精確值 2,516,756,480；非嵌入層 1,981,982,720） |
| Context Window | 131,072 tokens |
| Input 定價 (USD/1M tokens) | 無官方 API 定價（僅釋出開源權重，需自行部署） |
| Output 定價 (USD/1M tokens) | 無官方 API 定價（僅釋出開源權重，需自行部署） |
| 開源 | 是（Apache-2.0） |
| 發布日 | 2026-09-06（Hugging Face repo 直接上線，無官方部落格公告） |
| 官方公告 | [Hugging Face：openbmb/MiniCPM5-2B](https://huggingface.co/openbmb/MiniCPM5-2B) |
| HuggingFace | [openbmb/MiniCPM5-2B](https://huggingface.co/openbmb/MiniCPM5-2B) |
| 家族 | MiniCPM5 系列（第二個模型，前代為 2026-05-19 發佈的 MiniCPM5-1B） |

## 能力亮點

- 中立第三方 Artificial Analysis Intelligence Index v4.2 拿下 15 分，是所有 4B 以下開權重模型中最高，比第二名 Granite 4.2 3B（11 分）高 4 分，也追平參數量約 4 倍的 Qwen3.5 9B（Reasoning，估計 15 分）
- GDPval-AA v2（對照人類基準的真實工作任務）Elo 達 831，領先 Ling 3.0 Tiny（718，參數量約 3 倍）與 Granite 4.2 8B（647）；τ³-Bench Banking（Agent 工具呼叫）21%，與 Ling 3.0 Tiny 並列第一，遠高於次佳的 Granite 4.2 8B（8%）
- 每個 Intelligence Index 任務只用 19k output tokens（其中 11k 為推理 token），是同組最省 token 的推理模型之一；相較 Ling 3.0 Tiny 用了 56k token 才多拿 1 分
- Apache-2.0 完全開源，並隨模型同步釋出訓練資料集 UltraX、UltraData-Code，以及 50 萬筆 agent 訓練樣本 UltraData-SFT-Agent-2609 與 8 萬多筆 RL 訓練樣本 UltraData-RL-2609

## Benchmark 表現

| Benchmark | 分數 | 前代 (MiniCPM5-1B) | 競品最強（<4B 開權重） |
|---|---|---|---|
| Artificial Analysis Intelligence Index v4.2（中立） | 15 | N/A（1B 版未列入此版本評測組） | Granite 4.2 3B：11 |
| GDPval-AA v2 Elo（中立，真實工作任務） | 831 | N/A | Ling 3.0 Tiny：718 |
| τ³-Bench Banking（中立，Agent 工具呼叫） | 21%（與 Ling 3.0 Tiny 並列第一） | N/A | Granite 4.2 8B：8% |
| SWE-bench Verified ⚠️（官方自測） | 46.4% | N/A | Qwen3.5-4B：33.6%（4B 對照組最佳） |
| Humanity's Last Exam（中立） | 9% | N/A | Gemma 4 12B（Reasoning）：16% |

⚠️ 除標注者外，其餘皆為 Artificial Analysis 獨立測試；SWE-bench Verified 為 OpenBMB 官方自測（見 Hugging Face model card），尚未經第三方復現。MiniCPM5-1B 與 MiniCPM5-2B 分屬不同量級評測組（1B 版對照 Qwen3-0.6B 等，2B 版對照 Qwen3.5-2B 等），兩者無直接可比數字，故「前代」欄位缺值。

## 與前代/競品比較

跟 MiniCPM5-1B 比，參數量從 1.08B 擴大到 2.6B（約 2.3 倍），context window 維持 131,072 tokens 不變。兩個版本用的評測組不同，沒有直接可比的分數，但 OpenBMB 對兩者的定位一致：都主打「同量級開源 SOTA」，訓練方法（SFT → RL → On-Policy Distillation）也完全延續。

跟同量級競品比，MiniCPM5-2B 的優勢集中在 agentic 任務：GDPval-AA v2 和 τ³-Bench Banking 都領先 3～4 倍參數量的模型。但知識廣度和長文本理解明顯落後——Humanity's Last Exam（9% vs. Gemma 4 12B 的 16%）、Terminal-Bench v2.1（9% vs. Qwen3.5 9B 的 29%）都輸，CritPt 甚至掛蛋（0%）。這是一個「窄而深」的 agent 優化模型，不是全能型小模型。

定價策略上，MiniCPM5-2B 完全開源、無官方 API，而且採取「悄悄上架」——Hugging Face repo 在 9 月 6 日直接上線，沒有部落格公告，也沒有社群媒體宣傳，跟同系列 MiniCPM5-1B、或 GLM-5.3 這類大張旗鼓發佈形成對比。目前唯一的公開佐證來自 Artificial Analysis 的獨立評測和第三方部落格的事後報導。

## 對 Agent 開發的意義

如果你在做手機、PC、車機等端側 agent：2.6B 模型只用 19k output token（其中 11k 是推理 token）就能達成同組最低耗用，配合 Apache-2.0 授權，是目前 4B 以下開權重模型中 agentic 能力密度最高的選擇。FlagOS 已經把它跑上 9 種 AI 晶片（含 Huawei Ascend、NVIDIA、Metax 等），對需要跨硬體快速落地的團隊是現成的路徑。

如果你在做需要大量事實知識或長文本理解的場景：Humanity's Last Exam、AA-LCR、Terminal-Bench v2.1 都輸給更大的模型，代表這個量級的天花板還是知識廣度——不建議直接拿它當通用 RAG 或長文件問答的骨幹模型。

不適合：需要視覺或多模態輸入的場景（MiniCPM5-2B 僅支援文字輸入輸出，不像同家族的 MiniCPM-V 系列有視覺能力）；也不適合把「SWE-bench Verified 46.4%」的官方自測數字，直接當成生產環境可用的 coding agent 能力保證——這個數字還沒有第三方復現。

## 今日收穫

以前預設開源小模型比拼的是「同參數量下的綜合智力分數」。MiniCPM5-2B 用 2.6B 打平 Qwen3.5-9B（參數量約 4 倍）的 Intelligence Index 分數，但代價是知識類評測（HLE、long-context）明顯落後——這說明真正決定「能不能拿來做 agent」的是 agentic 專項評測（GDPval-AA、τ-bench）而非綜合智力分數，小模型完全可以在 agent 場景上對齐大模型，但知識廣度的差距目前還補不齊。

## 參考資料

- [Hugging Face：openbmb/MiniCPM5-2B](https://huggingface.co/openbmb/MiniCPM5-2B)
- [Hugging Face：openbmb/MiniCPM5-1B](https://huggingface.co/openbmb/MiniCPM5-1B)
- [Artificial Analysis：OpenBMB releases MiniCPM5-2B](https://artificialanalysis.ai/articles/openbmb-releases-minicpm5-2b)
- [Artificial Analysis：MiniCPM5-2B model page](https://artificialanalysis.ai/models/minicpm5-2b)
- [GitHub：OpenBMB/MiniCPM](https://github.com/OpenBMB/MiniCPM)
- [orcarouter：MiniCPM5-2B open weights are live](https://www.orcarouter.ai/blog/minicpm5-2b-open-weights-release)
