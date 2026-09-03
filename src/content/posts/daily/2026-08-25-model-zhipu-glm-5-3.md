---
title: "模型卡｜GLM-5.3"
date: 2026-08-25
category: daily
type: digest
tags: [ai-agent, model-release, daily, zhipu, model-family-glm]
lang: zh-TW
description: "Z.ai 發佈 GLM-5.3——沿用 GLM-5.2 同一顆 base model，純靠 post-training 把 Terminal-Bench 3.0 從 4.6% 拉到 28.3%，CyberGym 漏洞挖掘分數首度反超所有列名的閉源前緣模型"
tldr: "GLM-5.3：沿用 GLM-5.2 base model、純 post-training 提升、1M context／128K 最大輸出、定價維持 $1.4 input／$4.4 output（每 100 萬 tokens）不變、Terminal-Bench 3.0 從 4.6% 跳到 28.3%（開源 SOTA）、CyberGym 漏洞挖掘 84.5% 超越表列所有閉源前緣模型，官方因此把權重釋出延後到安全評估完成（約 8/28）"
series:
  name: "AI Model Tracker"
  order: 5
glossary:
  - term: "GLM"
    def: "Zhipu AI（智譜，國際品牌 Z.ai）開發的開源大型語言模型家族"
---

> 🌏 [English version](/en/posts/daily/2026-08-25-model-zhipu-glm-5-3-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `glm-5.3` |
| 廠商 | Zhipu AI（智譜，國際品牌 Z.ai） |
| 參數量 | 未公開精確數字，沿用 GLM-5.2 base model（第三方推估約 744B 總參數／40B 活躍參數） |
| Context Window | 1,000,000 tokens（最大輸出 128,000 tokens） |
| Input 定價 (USD/1M tokens) | $1.40（cached input $0.26） |
| Output 定價 (USD/1M tokens) | $4.40 |
| 開源 | 尚未（官方預告launch後兩週內釋出權重，約 2026-08-28，待安全評估與 hardening 完成） |
| 發布日 | 2026-08-14 |
| 官方公告 | [Z.ai Blog：GLM-5.3](https://z.ai/blog/glm-5.3) |
| HuggingFace | `zai-org/GLM-5.3`（頁面顯示 Coming Soon，尚未可下載） |
| 家族 | GLM 5.x（與 GLM-5.2 共用同一顆 base model） |

## 能力亮點

- Terminal-Bench 3.0 從 GLM-5.2 的 4.6% 跳到 28.3%，達開源模型 SOTA
- Z.ai Code Bench（內部評測）較 GLM-5.2 提升 50%，官方稱為「目前最強的開源權重程式碼模型」
- CyberGym 漏洞挖掘分數 84.5%，是官方比較表中所有模型（含閉源前緣模型）裡的最高分
- 與多個資安團隊合作在真實目標上測試，累計找出 2,436 個漏洞，其中 1,097 個為中高風險
- 完全沒有重新訓練 base model——所有進步都來自 post-training scaling（更多任務環境＋更多算力）

## Benchmark 表現

| Benchmark | GLM-5.3 | GLM-5.2 | 競品最強 |
|---|---|---|---|
| Terminal-Bench 3.0 | 28.3% | 4.6% | GPT-5.6 Sol 34.6% |
| CyberGym（漏洞挖掘） | 84.5% | 77.2% | Claude Fable 5 83.8% |
| ExploitBench（漏洞利用） | 54.4% | 24.4% | Claude Fable 5 78.0% |
| DeepSWE v1.1 | 66.9% | 46.2% | GPT-5.6 Sol 72.7% |

⚠️ 以上均為 Z.ai 官方自測結果，第三方尚未獨立複現。

## 與前代/競品比較

GLM-5.3 跟 GLM-5.2 用的是同一顆 base model，這次完全沒有重新預訓練——所有提升都來自 post-training scaling，這也是官方部落格開頭第一句話：「Scaling post-training is all we did for GLM-5.3」。Terminal-Bench 3.0 從 4.6% 跳到 28.3%，是 6 倍以上的躍進，雖然仍落後 GPT-5.6 Sol 的 34.6% 與 Claude Fable 5 的 33.7%，但已是目前開源模型裡最高分。

比較特別的是 CyberGym：GLM-5.3 的 84.5% 不只贏過 GLM-5.2 的 77.2%，還贏過官方比較表列出的所有閉源前緣模型，包括 Claude Fable 5（83.8%）與 GPT-5.6 Sol（83.6%）——這是少見的「開源模型在資安漏洞挖掘上反超閉源前緣模型」案例。ExploitBench（往漏洞利用鏈更深一層）也翻倍成長，只是絕對分數（54.4%）仍明顯落後 Claude Fable 5（78.0%）。

定價完全沒變，維持 GLM-5.2 的 $1.4／$4.4（每 100 萬 tokens），在能力大幅提升的前提下等於隱性降價。但權重釋出時間被延後到「安全評估與 hardening 完成」之後，跟 GLM-5.2 上線當天就開源 MIT 授權的做法不同——官方等於用行動承認了資安能力的躍進帶來新的風險評估負擔。

## 對 Agent 開發的意義

CyberGym／ExploitBench 的分數是這次最值得注意的訊號：一個開源模型的漏洞挖掘與利用能力已經追上、甚至部分超越閉源前緣模型，代表自動化資安測試（或反過來說，自動化攻擊）的門檻正在快速下降。

- 如果你在做 coding agent／自動化 PR review：Terminal-Bench 3.0 的開源 SOTA 分數代表本地部署（權重釋出後）也能有不錯的終端操作與長時任務能力，值得排進自架評估清單
- 如果你在做 DevSecOps／自動化漏洞掃描工具：GLM-5.3 的 CyberGym／ExploitBench 表現已經是同類最強，適合拿來做白箱程式碼審查與已知漏洞模式的自動化發現，但要同步規劃存取控制，避免同一套能力被反向用於攻擊
- 不適合：現在還沒有公開 API 或可下載權重，只能透過 GLM Coding Plan 訂閱使用，若你需要立即離線推論或自訂微調，得先等約一週後（8/28 前後）的權重釋出

## 今日收穫

以前覺得開源模型要追上前緣能力，勢必得靠更大的 base model 或重新預訓練。GLM-5.3 用同一顆 GLM-5.2 base model、純靠 post-training scaling，就把 Terminal-Bench 3.0 拉高 6 倍，甚至在資安漏洞挖掘上反超所有閉源前緣模型——這代表「訓練後製程」（post-training pipeline 與任務環境的規模）本身正在變成比預訓練規模更值錢的護城河，而且這條路徑帶來的資安外溢效應，已經讓廠商自己都得延後開源時程來做風險評估。

## 參考資料

- [Z.ai Blog：GLM-5.3 — Frontier Coding with Emergent Cyber Capabilities](https://z.ai/blog/glm-5.3)
- [Z.ai Docs：GLM-5.3 Overview](https://docs.z.ai/guides/llm/glm-5.3)
- [Z.ai Docs：Pricing](https://docs.z.ai/guides/overview/pricing)
- [ai-tldr.dev：GLM-5.3 specs, benchmarks, availability](https://ai-tldr.dev/models/glm-5-3/)
- [MoClaw Blog：GLM-5.3 Is Live. The API Isn't Yet.](https://moclaw.ai/blog/glm-5-3-api-availability)
- [VentureBeat：GLM-5.3 is here with advanced cyber capabilities](https://venturebeat.com/technology/glm-5-3-is-here-with-advanced-cyber-capabilities-and-reportedly-already-found-a-serious-vulnerability-in-cursor)
