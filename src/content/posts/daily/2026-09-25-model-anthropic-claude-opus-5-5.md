---
title: "模型卡｜Claude Opus 5.5"
date: 2026-09-25
category: daily
type: digest
tags: [ai-agent, model-release, daily, anthropic, model-family-claude]
lang: zh-TW
description: "Anthropic 發佈 Claude Opus 5.5——效能追平 Claude Fable 5.1，成本卻比 Opus 5 降 40%，Terminal-Bench 4.0 達 66.4%，但 thinking 模式從此不能關閉"
tldr: "Claude Opus 5.5：2026-09-22 上線，Model ID `claude-opus-5-5`；1,000,000 tokens context window（輸出上限仍為 128K）；API 定價 input $4.00／output $20.00 per 1M tokens（前代 Opus 5 為 $5/$25），cache read 降 60% 到 $0.20；Terminal-Bench 4.0 從 Opus 5 的 52.3% 跳到 66.4%，GDPval-AA v2.1 以 1846 Elo 領先 Fable 5.1（1735）與 GPT-6 Astra（1542）；官方自陳在 AutomationBench、Terminal-Bench-Science 仍落後 GPT-6 Astra；因生物與資安能力比肩 Claude Mythos 5.1，同步套用 Fable 5.1 等級 safeguard，且 API 端 thinking 模式不再能關閉、強制 tool use 改回傳錯誤"
series:
  name: "AI Model Tracker"
  order: 30
glossary:
  - term: "Claude"
    def: "Anthropic 開發的大型語言模型家族，Opus 為其中效能最高階的分支"
  - term: "Terminal-Bench"
    def: "評測模型在真實終端機環境中自主執行多步驟指令、除錯、完成任務能力的 benchmark，被視為 agentic coding 的重要指標"
---

> 🌏 [English version](/en/posts/daily/2026-09-25-model-anthropic-claude-opus-5-5-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `claude-opus-5-5` |
| 廠商 | Anthropic |
| 參數量 | 未公開 |
| Context Window | 1,000,000 tokens（輸出上限 128,000 tokens，Batches API 搭配 `output-300k-2026-03-24` beta header 可到 300K） |
| Input 定價 (USD/1M tokens) | $4.00 |
| Output 定價 (USD/1M tokens) | $20.00 |
| 開源 | 否（僅提供 Claude Platform／AWS／Google Cloud／Azure 代管 API，未釋出權重） |
| 發布日 | 2026-09-22 |
| 官方公告 | [Anthropic：Introducing Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5) |
| 家族 | Claude 5.5（首個發布的成員，Sonnet 5.5／Haiku 5.5 官方預告「未來數週」跟進） |

## 能力亮點

- Terminal-Bench 4.0（agentic coding，xhigh effort）從前代 Opus 5 的 52.3% 跳到 66.4%（+14.1pp），是官方自報漲幅最大的項目之一
- Cache read 定價降 60% 到 $0.20／1M tokens——官方指出這是 agentic／coding 場景的主要成本來源，加上輸出速度提升逾 30%，官方換算典型工作負載成本降 40%
- 內部測試中一名早期使用者在 3 小時內完成 20 萬行程式碼庫的稽核與修復（Opus 5 需 20 小時以上、耗用 2.5 倍 token）
- 安全對齊分數為 Anthropic 目前測過最佳：新的圍堵測試中，嘗試繞過邊界的頻率比 Opus 5／Claude Mythos 5.1 低約 85%

## Benchmark 表現

| Benchmark | Opus 5.5 | 前代 (Opus 5) | 競品最強 |
|---|---|---|---|
| Terminal-Bench 4.0 | 66.4% | 52.3% | GPT-6 Astra 57.9% |
| FrontierCode v1.1（Main） | 54.4% | 48.0% | GPT-6 Astra 53.3% |
| CursorBench 4.0 | 57.8% | 46.6% | GPT-5.6 Sol（官方稱贏 11pp，未列具體分數） |
| GDPval-AA v2.1（Elo，第三方 Artificial Analysis 評測） | 1846 | 1708 | GPT-6 Astra 1542 |
| Humanity's Last Exam（with tools） | 67.7% | 63.6% | GPT-6 Astra 57.2% |
| Terminal-Bench-Science 0.1 | 58.7% | 29.0% | GPT-6 Astra 64.6%（全場最高） |
| AutomationBench（Zapier 執行） | 40.0% | 26.9% | GPT-6 Astra 41.4%（全場最高） |

⚠️ 以上除 GDPval-AA v2.1 由 Artificial Analysis 獨立評測外，均為 Anthropic／各廠商自測，採各自最高 effort 設定；Anthropic 亦自陳 Terminal-Bench 4.0、Terminal-Bench-Science 0.1 的官方複測與公開排行榜數字落在誤差範圍內（標準誤 ±1.6–5pt）。AutomationBench 與 Terminal-Bench-Science 上 GPT-6 Astra 仍領先，並非全面獲勝。

## 與前代/競品比較

跟 Opus 5 比，進步最大的是 agentic coding 與長任務處理：Terminal-Bench 4.0 +14.1pp，且官方強調「用更少 token 做完更多事」——同一個 68 萬行程式碼遷移案例，早期測試者一天內完成，換算是原本要一個工程團隊數週的工作量。定價同步下修：input／output 各降 20%，cache read 降 60%，兩者疊加後官方換算典型工作負載成本降 40%。

跟競品比，Opus 5.5 在 agentic coding（Terminal-Bench 4.0、FrontierCode）、知識工作（GDPval-AA v2.1、HLE）上領先 GPT-6 Astra，且用更低成本達到：官方稱 FrontierCode 上以約 20% 的單任務成本打平 GPT-6 Astra 的最高分。但 AutomationBench 與 Terminal-Bench-Science（科學研究型 agentic 任務）兩項，GPT-6 Astra 仍是全場最高分——這兩項恰好都不是純程式碼任務，顯示 Opus 5.5 的優勢集中在 coding／知識工作，並非全面壓制對手。跟同門的 Claude Fable 5.1 相比，官方明講「多數工作表現持平」，benchmark 分數差距在其自身使用經驗中比表格顯示的更窄。

## 對 Agent 開發的意義

Opus 5.5 這次最大的變化不是分數，是成本結構：cache read 降 60%，這對長對話、多輪工具呼叫的 agentic 場景影響最大，因為 cache read 本來就佔這類工作流大部分開銷。同時官方也把「用更少 token 做完任務」列為關鍵指標，不只是單價便宜。

- 如果你在做長時間自主運行的 coding agent（大型程式碼庫遷移、稽核）：Terminal-Bench 4.0 與 FrontierCode 的雙位數進步，加上更低的 cache read 成本，是目前這類場景性價比最高的選擇之一，值得優先測試
- 如果你在做需要科學研究或跨系統自動化的 agent（AutomationBench、Terminal-Bench-Science 涵蓋的場景）：這兩項官方自陳落後 GPT-6 Astra，建議實際跑自己的任務集比較，不要只看 coding 類 benchmark 就直接遷移
- 重大相容性風險：API 端 thinking 模式**不再能關閉**、強制 tool use 改為回傳錯誤而非靜默處理，舊版整合程式碼直接升級可能會壞——遷移前務必看官方「Claude Opus 5 → 5.5」breaking changes 清單
- 涉及資安或生物研究的 agent：因能力比肩 Claude Mythos 5.1，多數資安任務會被安全機制導向 Opus 4.8，生物相關工作需申請 Life Sciences Verification Program，規劃容量時要把這層 fallback 算進去

## 今日收穫

Opus 5.5 的公告裡，Anthropic 自己承認「benchmark margin 正變得越來越不可靠」，並且在 AutomationBench、Terminal-Bench-Science 這兩項上老實列出 GPT-6 Astra 領先的數字——這跟多數廠商公告只挑贏的項目秀出來不一樣。對讀模型卡的人來說，這提醒一件事：越是全面壓制式的官方公告，越該留意有沒有「這裡我們沒贏」的誠實揭露；反而是那種敢列出自己輸的項目的公告，數字可信度通常更高。

## 參考資料

- [Anthropic：Introducing Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5)
- [Anthropic Newsroom](https://www.anthropic.com/news)
- [Anthropic：Claude Opus 5.5 System Card（PDF）](https://www-cdn.anthropic.com/fc1b44717c85dc068bc6ba5024219938094694bd/Claude%20Opus%205.5%20System%20Card.pdf)
- [Claude Platform Docs：Claude Opus 5.5 overview](https://platform.claude.com/docs/en/models/opus-5-5/overview)
- [Amazon Bedrock：Claude Opus 5.5 model card](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-opus-5-5.html)
- [MarkTechPost：Anthropic Releases Claude Opus 5.5](https://www.marktechpost.com/2026/09/22/anthropic-claude-opus-5-5-release/)
