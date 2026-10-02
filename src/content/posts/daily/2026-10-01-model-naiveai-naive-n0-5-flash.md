---
title: "模型卡｜Naive-N0.5-Flash"
date: 2026-10-01
category: daily
type: digest
tags: [ai-agent, model-release, daily, naiveai, model-family-naive]
lang: zh-TW
description: "北京新創 NaiveAI 開源 309B MoE 模型 Naive-N0.5-Flash——全模型移除全注意力層、改用混合稀疏注意力，主打「用 AI 打造 AI」的研發敘事"
tldr: "Naive-N0.5-Flash（HuggingFace：NaiveAI/Naive-N0.5-Flash）：2026-09-27 開源，MIT 授權，309B 總參數／15.5B 活化 MoE，建於 Xiaomi MiMo-V2.5 base model 之上再訓練 3.25T tokens，把全部全注意力層換成 39 層 Sliding-Window Attention＋9 層 DeepSeek Sparse Attention 混合架構；自建 NaiveRT 推理引擎標準模式 50 tokens/s、Ultrafast 模式最高 2,000 tokens/s；官方自測 SWE-bench Pro 73.6 分（落後 Claude Opus 5.5 的 89.9）、同量級開源對手 DeepSeek V4.1 Flash 在 DeepSWE／Terminal-Bench／ProgramBench 三項全部領先；API 定價公告 input $0.10／output $0.40／cache read $0.01（每 1M tokens）但尚未上線；創辦人與前東家 MiroMind 有未解 IP 爭議"
series:
  name: "AI Model Tracker"
  order: 36
glossary:
  - term: "Naive"
    def: "北京新創 NaiveAI（清華大學戴吉峰創立）開源模型系列首作，主打訓練與推理流程由 AI 系統自主設計、人類把關方向"
---

> 🌏 [English version](/en/posts/daily/2026-10-01-model-naiveai-naive-n0-5-flash-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `NaiveAI/Naive-N0.5-Flash`（HuggingFace repo ID；官方 API 尚未上線，無獨立 model ID） |
| 廠商 | NaiveAI（北京，2026 年 2 月由清華大學電子系副教授戴吉峰創立） |
| 參數量 | 309B 總參數／15.5B 活化（Mixture-of-Experts） |
| Context Window | 1,000,000 tokens（native，48 層 transformer，無全注意力層） |
| Input 定價 (USD/1M tokens) | $0.10（官方公告，cache read $0.01；API 發稿時尚未上線） |
| Output 定價 (USD/1M tokens) | $0.40（官方公告，API 發稿時尚未上線） |
| 開源 | 是（MIT，權重與推理程式碼皆開源） |
| 發布日 | 2026-09-27 |
| 官方公告 | [NaiveAI 技術部落格：Naive-N0.5-Flash](https://naive.ai/en/research/) |
| HuggingFace | [NaiveAI/Naive-N0.5-Flash](https://huggingface.co/NaiveAI/Naive-N0.5-Flash) |
| 家族 | Naive 系列首作；建於 Xiaomi 開源 MiMo-V2.5 base model 之上，再訓練 3.25T tokens 並整個替換注意力架構 |

## 能力亮點

- 架構突破：48 層 transformer 全數移除全注意力層，改用 39 層 Sliding-Window Attention（128 token 窗口）＋9 層 DeepSeek Sparse Attention（indexer 掃描全歷史、backbone 只對 top 2,048 token 算注意力，GQA4 分組），百萬 token context 下解碼成本不再隨長度線性增加
- 推理速度：自建 NaiveRT 推理引擎，標準模式 50 tokens/s／使用者，Ultrafast 模式最高 2,000 tokens/s，8 GPU 峰值達 2,122 tokens/s
- 「AI 打造 AI」研發敘事：NaiveRT 由人類研究者與 AI 模型協作、6 天內跑完 151 次記錄在案的最佳化實驗完成；另有 AI 獨立設計的世界模型 AutoWM，在 WorldArena-1 Track 1 拿下 77.43 分，超越當時最高公開分數 73.64
- 定價：官方公告 API input $0.10／output $0.40／cache read $0.01（每 1M tokens），但截稿時 API 尚未上線，也無 OpenRouter 掛牌

## Benchmark 表現

| Benchmark | 分數 | 前代模型 | 競品最強 |
|---|---|---|---|
| SWE-bench Pro | 73.6 | 無（NaiveAI 首作） | Claude Opus 5.5 89.9（6 個模型中排第 3） |
| DeepSWE v1.1 | 67.8 | 無（NaiveAI 首作） | Meta Muse Spark 1.3 75.4；同量級開源 DeepSeek V4.1 Flash 74.2（13 個模型中排第 7） |
| Terminal-Bench 2.1 | 86.7 | 無（NaiveAI 首作） | DeepSeek V4.1 Flash 90.6（9 個模型中排第 7） |
| NL2Repo-Bench | 71.9 | 無（NaiveAI 首作） | 官方圖表中自己最高分，領先 DeepSeek V4.1 Flash 的 64.0 |
| ProgramBench | 17.5 | 無（NaiveAI 首作） | Claude Opus 5 37.0；DeepSeek V4.1 Flash 20.3（7 個模型中並列最後） |

⚠️ 以上全數為 NaiveAI 官方自行公布的圖表，評測 harness 為 Claude Code 2.1.207，對照分數取自各廠商自家發布頁面與 leaderboard（非同一測試環境直接複現），尚無獨立第三方重新驗證。

## 與前代/競品比較

Naive-N0.5-Flash 沒有「前代」可比——這是 NaiveAI 的第一個公開模型。真正有意義的對照是同量級的開源 Flash 模型 DeepSeek V4.1 Flash：在 DeepSWE v1.1（67.8 對 74.2）、Terminal-Bench 2.1（86.7 對 90.6）、ProgramBench（17.5 對 20.3）三項編碼類基準上，Naive-N0.5-Flash 全部落後，只在自己新設計的 NL2Repo-Bench 上領先（71.9 對 64.0，但這項基準目前沒有其他廠商公開跑過，比較意義有限）。

真正的賣點不在跑分競爭力，而是架構與推理效率：把 MiMo-V2.5 base model 裡僅存的幾層全注意力也換成 DeepSeek Sparse Attention 後，百萬 token context 下仍能維持 50 tokens/s 的單一使用者解碼速度，這代表長文件或大型 repo 場景的推理成本結構跟一般模型不同。

定價方面，官方公告的 $0.10／$0.40／1M tokens 目前只是承諾價，API 尚未上線，也還沒有第三方託管服務可以驗證實際可用性與延遲——在對比省錢幅度之前，這一步還沒到位。

## 對 Agent 開發的意義

這個模型的故事主軸是「用 AI 加速 AI 研發」，而不是分數天花板的突破。

- 如果你在做需要讀大型 repo 或長文件的 coding agent：百萬 token context 下仍維持 50 tokens/s 的單一使用者速度，且不是靠犧牲全注意力層去換取虛高分數（架構上真的完全移除），值得在評估自架推理方案時納入比較
- 如果你在做 AI 自動化研究 workflow（AI R&D agent）：NaiveAI 公布的 AutoWM 案例顯示「AI 自主設計＋優化、人類設方向做關鍵決策」的分工在明確評測標準下可以跑出可重複流程，這類 harness 設計值得參考，但目前僅此一例，尚未構成大規模驗證
- 不適合：需要立即透過 API 串接的場景（API 尚未上線）、需要最強編碼單項分數的場景（同級 DeepSeek V4.1 Flash 三項編碼基準都領先）、以及對供應鏈風險敏感的企業採購——NaiveAI 創辦人戴吉峰與前顧問職務的 MiroMind 之間仍有未解的技術／智慧財產爭議

## 今日收穫

過去以為「建立在某個 base model 之上」一定會在 HuggingFace 留下 `base_model` tag，讓 trending 篩選抓得到；但 Naive-N0.5-Flash 把 MiMo-V2.5 僅存的全注意力層整個換掉、又加訓 3.25T tokens，已經讓 HuggingFace 不把它判定為同一 base model 的衍生版。這提醒偵測新模型不能只依賴 tag 有無，還要看模型卡本身怎麼描述血緣關係——架構改到這個程度，「衍生版」和「新模型」的界線本來就模糊。

## 參考資料

- [NaiveAI 技術部落格：Introducing Naive-N0.5-Flash](https://naive.ai/en/research/)
- [NaiveAI/Naive-N0.5-Flash · Hugging Face](https://huggingface.co/NaiveAI/Naive-N0.5-Flash)
- [NaiveAI 官方 X 發佈貼文（2026-09-27）](https://x.com/naiveailab/status/2104247060186951725)
- [CellCog：Naive-N0.5-Flash — NaiveAI's Open Model, Built by AI](https://cellcog.ai/blog/naive-n0-5-flash/)
- [Implicator：Naive AI $1.4 billion valuation, $400 million raise](https://www.implicator.ai/naive-ai-1-4-billion-valuation-400-million-raise/)
