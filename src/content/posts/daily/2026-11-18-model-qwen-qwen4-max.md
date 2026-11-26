---
title: "模型卡｜Qwen4-Max"
date: 2026-11-18
category: daily
type: digest
tags: [ai-agent, model-release, daily, qwen, model-family-qwen]
lang: zh-TW
description: "阿里通義千問發布 Qwen4 世代首款模型 Qwen4-Max——2.4T 參數僅活躍 71B，法律 agent 評測 HLAB-Vals-1.1 大幅領先，但程式碼與視覺類項目仍落後 Claude Opus 5.5，定價降至 $1.50/$4.50 每百萬 tokens"
tldr: "Qwen4-Max：2.4T 總參數僅活躍 71B（另加 328B N-gram embedding）、1M context window、input $1.50／output $4.50 每百萬 tokens（比前代 Qwen3.8-Max 降 25%）、無開放權重僅供 QwenCloud API；16 項官方評測中拿下 4 項第一（HLAB-Vals-1.1 法律 agent 21.3 分領先 Kimi K3.1 的 11.7），但 ProgramBench 原生編程與視覺類 Chartography 明顯落後 Claude Opus 5.5"
series:
  name: "AI Model Tracker"
  order: 75
glossary:
  - term: "Qwen4"
    def: "阿里巴巴通義千問團隊 2026 年 11 月發布的新一代模型架構世代，首款產品為 Qwen4-Max，核心變化是 QSA 稀疏注意力＋Gated Residual＋N-gram Embedding"
---

> :globe: [English version](/posts/daily/2026-11-18-model-qwen-qwen4-max-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `qwen4-max`（QwenCloud API） |
| 廠商 | 阿里巴巴（Alibaba，通義千問 Qwen 團隊） |
| 參數量 | 2.4T 總參數（backbone），71B 活躍參數／token；另加 328B N-gram Embedding 參數（置於第 2 層，提供局部 token pattern 查表） |
| Context Window | 1,000,000 tokens；QwenCloud API 文件列：非 thinking 模式 Max Input 991K／Max Output 131K，thinking 模式 Max Input 983K／Max Output 262K |
| Input 定價 (USD/1M tokens) | $1.50（前代 Qwen3.8-Max 為 $2.00，降 25%） |
| Output 定價 (USD/1M tokens) | $4.50（前代 Qwen3.8-Max 為 $6.00，降 25%；隱性快取 input 另降至 $0.075，前代 $0.25） |
| 開源 | 否（proprietary，僅供 QwenCloud API／Token Plan／Qwen Studio／QwenWork／Qoder 等託管端點，無開放權重可自架） |
| 發布日 | 2026-11-16（Token Plan 限時預覽自 2026-11-11 起，QwenCloud 正式 API 於 2026-11-16 開放） |
| 官方公告 | [Qwen Blog：Qwen4-Max](https://qwen.ai/blog?id=qwen4-max) |
| 家族 | Qwen 4.x（Qwen4 世代首款模型，接替 Qwen3.8-Max-0902） |

## 能力亮點

- 2.4T 參數 backbone 只活躍 71B（約 3%），比 Qwen3.8-Max 少啟用 25% 參數，但 Alibaba 自家 Work360 綜合評測（26 大領域、721 個細分項目）分數從 47.74 升到 52.69
- 新架構三處同時改版：QSA（Qwen Sparse Attention，每層配 3 層 Gated DeltaNet 壓縮歷史狀態）＋Gated Residual（4 條並行殘差分支、動態讀寫閥門）＋328B 參數的 N-gram Embedding；官方稱 2.4T 規模訓練全程無 loss spike
- 同等推理品質下更省 token：Work360 在 Xhigh 檔位省約 24%、High 檔位省約 35%；Terminal-Bench 4.0 省約 48–49%，平均每任務成本從 $4.43 降到 $1.67（降 62%）
- HLAB-Vals-1.1（法律 agent 任務）21.3 分，是第二名 Kimi K3.1 的 11.7 分近 2 倍，16 項官方列表評測中拿下 4 項第一

## Benchmark 表現

| Benchmark | Qwen4-Max | 前代 Qwen3.8-Max-0902 | 競品最強 |
|---|---|---|---|
| DeepSWE v1.1（代理式程式碼任務） | 75.7 | 69.3 | Kimi K3.1 Pro 75.5 |
| Terminal-Bench 4.0 | 48.5 | 38.9 | Kimi K3.1 Pro 67.2 |
| Humanity's Last Exam | 51.7 | 43.9 | Claude Opus 5.5 59.8 |
| ProgramBench（原生程式能力） | 31.5 | 28.0 | Claude Opus 5.5 65.0 |
| HLAB-Vals-1.1（法律 agent） | 21.3 | 15.4 | Kimi K3.1 11.7 |

:warning: 以上 16 項對照全部出自 Alibaba 官方發布的 Qwen4-Max benchmark 圖表，截至發文未見第三方獨立複現；圖表中 Kimi K3.1 Pro 的 Terminal-Bench 4.0 分數為 67.2，但 Moonshot 官方自己公布的同一項分數是 65.7，兩者不一致，顯示跨廠商引用他牌分數時版本可能不同步。

## 與前代/競品比較

跟自家前代 Qwen3.8-Max 比，Qwen4-Max 進步最明顯的不是單項能力分數，而是「同樣任務用更少 token、更低成本完成」——Terminal-Bench 4.0 省將近一半 token、Work360 平均任務成本砍 62%，這代表同一個預算下可以跑更多次 agent 迴圈，而不只是分數本身變高。

跟競品比，Qwen4-Max 的優勢集中在特定垂直 agent 場景：法律（HLAB-Vals-1.1）、生物醫學（BioMysteryBench）、長時序代理任務（Agents' Last Exam v1.1）都拿下第一，代理式程式碼任務 DeepSWE v1.1 以 0.2 分的微弱差距險勝 Kimi K3.1 Pro。但原生編程能力（ProgramBench 31.5 分，輸 Claude Opus 5.5 的 65.0 分超過一倍）與終端操作能力（Terminal-Bench 4.0 輸 Kimi K3.1 Pro 近 19 分）明顯是弱項，定位更像「專才型 agent 模型」而非全能程式碼模型。

定價策略上 Qwen4-Max 延續阿里一貫的低價路線：input/output 從前代的 $2/$6 降到 $1.50/$4.50（降 25%），隱性快取 input 降 70% 到 $0.075。對比 Claude Opus 5.5 的 $4/$20，Qwen4-Max 便宜 63–78%；對比 Kimi K3.1 Pro 的 $2/$10，便宜 25–55%——即使扣掉它在編程類評測的落後，單純作為「跑大量 agent 任務的便宜後盾模型」仍有明確的成本優勢。

## 對 Agent 開發的意義

Qwen4-Max 把評測重心放在垂直領域代理任務（法律、生醫、長時序工作流），而不是通用程式碼能力，這決定了它適合的場景範圍相對窄：

- 如果你在做法律、生醫或知識密集型工作流的 agent：HLAB-Vals-1.1 與 BioMysteryBench 的領先幅度夠大（前者近 2 倍），值得優先納入測試候選
- 如果你在做大量跑批次、重視 token 成本的 agent pipeline：同等任務下 token 用量降 24–49%、每任務成本降 62%，加上比 Opus 5.5／Kimi K3.1 Pro 都便宜的定價，適合當「跑量」的後盾模型
- 不適合：純程式碼生成或終端操作為主的 coding agent——ProgramBench 和 Terminal-Bench 4.0 都明顯落後 Claude Opus 5.5 與 Kimi K3.1 Pro，這類場景選它會犧牲明顯的準確率；也不適合需要自架開放權重模型的場景，Qwen4-Max 沒有開放權重，只能透過 QwenCloud API 存取

## 今日收穫

這次 Alibaba 的對照評測套組（DeepSWE v1.1、Terminal-Bench 4.0、HLAB-Vals-1.1）跟業界常見的 SWE-bench Verified 是完全不同的量尺，拿不到可以直接橫向比較的分數；更明確的訊號是圖表裡 Kimi K3.1 Pro 的 Terminal-Bench 4.0 分數（67.2）跟 Moonshot 官方自己公布的分數（65.7）不一致——轉載友商分數時，不能假設同一個 benchmark 名字背後用的是同一次測試版本，一定要回頭對照對方自己的原始發布。

## 參考資料

- [Qwen 官方部落格：Qwen4-Max — Your New Teammate Has Arrived](https://qwen.ai/blog?id=qwen4-max)
- [QwenCloud 模型頁：Qwen4-Max 規格與 context/rate limit](https://www.qwencloud.com/models/qwen4-max)
- [MarkTechPost：Alibaba Releases Qwen4-Max: 2.4T MoE, 71B Active, 1M Context（2026-11-16，含完整對照表）](https://www.marktechpost.com/2026/11/16/alibaba-qwen4-max-release/)
- [Yotta Labs：Qwen4-Max Specs, Benchmarks, Pricing, and How to Access It](https://www.yottalabs.ai/post/qwen-4-max-specs-benchmarks-pricing-how-to-access)
- [VentureBeat：Alibaba's Qwen4-Max cuts AI task costs, but benchmarks show an uneven challenge to frontier rivals](https://venturebeat.com/technology/alibabas-qwen4-max-cuts-ai-task-costs-but-benchmarks-show-an-uneven-challenge-to-frontier-rivals)
