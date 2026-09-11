---
title: "模型卡｜DeepSeek-V4.1-Flash"
date: 2026-09-12
category: daily
type: digest
tags: [ai-agent, model-release, daily, deepseek, model-family-deepseek]
lang: zh-TW
description: "DeepSeek 換架構不換代號——Causal Encoder-Decoder 讓啟用參數不升反降，agentic coding 分數暴衝之餘，官方直接宣布 9/14 起把自家旗艦 V4-Pro 的全部流量轉發給這隻 Flash"
tldr: "DeepSeek-V4.1-Flash（API model：deepseek-flash）：2026-09-10 發佈，552B 總參數 MoE（Causal Encoder-Decoder，輸入僅啟用 8B、輸出啟用 16B）、1M context、MIT 開源；定價尖峰 input $0.30／output $1.20（每 1M tokens，離峰砍半），比前代 V4-Flash 更便宜；Terminal-Bench 4.0 從前代 7.0 分衝到 31.2 分，DeepSWE v1.1 追平 Claude Opus 5（74.2 vs 74.0）；KV cache 壓到每 token 890 bytes（前代 1/4、對比 DeepSeek-V1 少 437 倍）；官方宣布 9/14 起自家旗艦 V4-Pro 全部流量轉發給這隻 Flash 版並按 Flash 計價"
series:
  name: "AI Model Tracker"
  order: 19
glossary:
  - term: "DeepSeek V4.1"
    def: "DeepSeek 於 2026 年 9 月推出的新一代模型架構家族，首發的 Flash 版把前代 MoE decoder 換成 Causal Encoder-Decoder，主打更低的 KV cache 與 agentic 任務效能"
---

> 🌏 [English version](/en/posts/daily/2026-09-12-model-deepseek-deepseek-v4-1-flash-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `deepseek-flash`（API 呼叫用；HuggingFace repo 為 `deepseek-ai/DeepSeek-V4.1-Flash`） |
| 廠商 | DeepSeek |
| 參數量 | 552B 總參數 MoE，Causal Encoder-Decoder（20 層 encoder＋20 層 decoder）；輸入啟用 8B、輸出啟用 16B |
| Context Window | 1,000,000 tokens |
| Input 定價 (USD/1M tokens) | 尖峰 $0.30（cache miss）／$0.006（cache hit）；離峰 $0.15／$0.003（離峰為尖峰一半） |
| Output 定價 (USD/1M tokens) | 尖峰 $1.20；離峰 $0.60 |
| 開源 | 是（MIT，權重與技術報告已上架 HuggingFace） |
| 發布日 | 2026-09-10（新定價自當日 04:00 UTC 生效） |
| 官方公告 | [DeepSeek：Introducing DeepSeek-V4.1-Flash](https://deepseek.com/en/news/deepseek-v4-1-flash/) |
| HuggingFace | [deepseek-ai/DeepSeek-V4.1-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash) |
| 家族 | DeepSeek V4.x（前代為 V4-Flash-0731／V4-Pro-0813／V4-Flash-Vision-Exp，三者已全數退役並轉發到本模型） |

## 能力亮點

- 架構從前代的 MoE decoder 換成 Causal Encoder-Decoder：總參數翻倍到 552B，但輸入端啟用參數反而從 13B 降到 8B、輸出端 16B——decoder 的 global KV cache 直接從 encoder 最終隱藏層投影而來，不用逐層計算
- Terminal-Bench 4.0（目前最難的 agentic coding 評測）從前代 V4-Flash-0731 的 7.0 分衝到 31.2 分，DeepSWE v1.1 從 54.4 分升到 74.2 分，幾乎追平 Claude Opus 5（74.0）與 GPT-5.6 Sol（73.0）
- KV cache 壓到每 token 890 bytes，是前代 V4-Flash 的 1/4 HBM、1/8 SSD 儲存量，對比 DeepSeek-V1 更是壓縮 437 倍——直接打在 agent 最貴的 cache-hit 成本上
- 新增 196B 參數的 Engram 條件式記憶模組（與主幹分離、稀疏 token 查詢），視覺理解首次原生訓練進主幹（非額外掛載），base model 在 DocVQA 拿下 95.6、MMMU-Pro 56.5

## Benchmark 表現

| Benchmark | V4.1-Flash | 前代 (V4-Flash-0731) | 競品最強 |
|---|---|---|---|
| Terminal-Bench 2.1 | 90.6 | 82.7 | Claude Opus 5 89.1 |
| Terminal-Bench 4.0 | 31.2 | 7.0 | Claude Opus 5 51.8 |
| DeepSWE v1.1 | 74.2 | 54.4 | Claude Opus 5 74.0 |
| GPQA Diamond（base model，未輔助推理） | 90.9 | 未公開 | GPT-5.6 Sol 94.1 |
| SimpleQA-Verified（base model，事實回憶） | 42.3 | 未公開 | 自家旗艦 V4-Pro 55.2 |

⚠️ 以上均為 DeepSeek 官方在最強 agent scaffold（mini-SWE）下的自測結果，尚未見獨立第三方覆現。GPQA Diamond 與 SimpleQA-Verified 為 base model（非 instruct/agent 版）分數，V4-Flash-0731 無對應公開數字故標「未公開」。

## 與前代/競品比較

比前代最大的躍進在 agentic coding：Terminal-Bench 4.0 從 7.0 分衝到 31.2 分，四倍有餘，DeepSWE v1.1 也從 54.4 分拉到 74.2 分。這個跳躍主要來自架構換代——Causal Encoder-Decoder 讓輸入端只需啟用 8B 參數就能讀懂長 context，加上 KV cache 壓縮到 1/4~1/8，讓多輪工具呼叫的成本與延遲同時下降，而不是單純堆參數量換分數。

跟頂尖競品比，DeepSWE v1.1 的 74.2 已經追平 Claude Opus 5（74.0）與 GPT-5.6 Sol（73.0），差距在誤差範圍內；但 Terminal-Bench 4.0 仍大幅落後 Opus 5 的 51.8 分，顯示在「最難」等級的 agentic 任務上還有明顯差距。更值得注意的是知識密集型任務：SimpleQA-Verified 的 42.3 分明顯落後自家旗艦 V4-Pro 的 55.2 分——一個 552B 的新架構模型在事實回憶上反而輸給前代旗艦，說明這次的效能提升集中在「動手做」而非「知道什麼」。

定價策略是這次最大的商業訊號：V4.1-Flash 的尖峰 cache-miss input（$0.30）與 output（$1.20）都比前代 V4-Flash 的 $0.44／$1.32 更便宜，而 DeepSeek 直接宣布自 9/14 起把自家旗艦 V4-Pro 的全部線上流量轉發到這隻 Flash 版、並按 Flash 價格計費，等於官方親自承認小模型的 agentic 能力已經超越舊旗艦，直接讓舊旗艦下架退場。另外 DeepSeek 這次罕見公布「同一模型跑 8 種不同 agent scaffold」的對照表：DeepSWE 分數在 mini-SWE（74.2）到 OpenCode（65.5）之間擺盪 8.7 分，比 V4.1-Flash、Opus 5、GPT-5.6 Sol 三家頂尖模型之間的差距（1.2 分）還大——這是評測方法論上值得所有人注意的揭露。

## 對 Agent 開發的意義

如果你在做需要長 context、頻繁重放歷史對話的 agentic pipeline（coding agent、terminal 操作、多輪 RAG）：cache-hit input 定價只要 $0.006／1M tokens（尖峰），加上 KV cache 壓到 1/4~1/8，對高 cache 命中率的長對話成本效益非常高，MIT 授權也能自架部署，不受 API 供應商鎖定。

如果你在比較不同廠商的模型分數做選型：DeepSeek 公布的 8-scaffold 對照表是很好的提醒——換 agent 框架造成的分數差距（8.7 分）比換模型的差距（1.2 分）還大。選型時務必先固定住自己的 scaffold 再比較模型分數，而不是直接照抄任何一份排行榜。

不適合：需要高事實準確度、知識密集型的 QA 或客服場景——SimpleQA-Verified 明顯落後自家舊旗艦 V4-Pro，不建議直接拿 Flash 取代對事實回憶要求高的應用；也不適合對「vendor 自測結果」有疑慮的生產環境——目前所有 benchmark 都是 DeepSeek 自己在最強 scaffold 下測出來的，還沒有獨立第三方覆現。

## 今日收穫

過去比較模型時，習慣直接把不同廠商公布的 benchmark 分數拿來排名。但 DeepSeek 這次自己公布的 8-scaffold 對照表打破了這個假設：同一個模型換 8 種不同 agent 框架，DeepSWE 分數就能擺盪 8.7 分，比 V4.1-Flash、Opus 5、GPT-5.6 Sol 三家頂尖模型之間的差距（1.2 分）還大。這代表大部分「跨廠商模型排行榜」比較的其實是各家用的 scaffold 誰比較強，而不是模型本身誰比較強——之後看到任何模型分數比較，都該先問「用什麼框架跑的」。

## 參考資料

- [DeepSeek：Introducing DeepSeek-V4.1-Flash](https://deepseek.com/en/news/deepseek-v4-1-flash/)
- [DeepSeek-V4.1-Flash Technical Report (PDF)](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/main/DeepSeek_V41_Tech_Report.pdf)
- [HuggingFace：deepseek-ai/DeepSeek-V4.1-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash)
- [Coursiv：DeepSeek V4.1 Flash Replaces V4 Pro: Pricing, Benchmarks, and What Changed Since V4 Flash](https://coursiv.io/blog/deepseek-v4-1-flash)
- [DeepSeek 官方 X 帳號公告](https://x.com/deepseek_ai/status/2097930608790167907)
- [Hacker News 討論串：DeepSeek launching v4.1 flash cheaper and more capable than v4 pro](https://news.ycombinator.com/item?id=49624603)
