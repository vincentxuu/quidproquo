---
title: "2026 Coding Benchmark 怎麼讀：SWE-bench、Terminal-Bench、DeepSWE、Aider 各自測什麼"
date: 2026-08-26
category: ai
type: deep-dive
tags: [benchmark, agentic-coding, code-model, llm-evaluation, open-source]
lang: zh-TW
series:
  name: "認識 AI 模型"
  order: 11
tldr: "每個模型發布都帶 benchmark 數字，但同一個模型在不同 harness 上可以差 20 分、SWE-bench Verified 的 32% 驗證器判斷有誤、DeepSWE 113 題讓多數模型掛零。這篇拆解六個主要 coding benchmark 各自測什麼、哪些容易灌水、讀者該看哪個。"
description: "2026 年六大 coding benchmark 解讀指南：SWE-bench Verified/Pro、Terminal-Bench 2.1、DeepSWE、Aider Polyglot、LiveCodeBench、HumanEval，含 harness 差異、灌水手法與選型建議。"
draft: false
glossary:
  - term: "Harness"
    def: "執行 benchmark 的外部框架——同一個模型搭配不同 harness（如 Terminus-2 vs Claude Code）可能得到不同分數，因為 harness 決定了模型怎麼跟環境互動"
  - term: "Pass@1"
    def: "模型只跑一次就答對的比例，不允許重試——比 Pass@5 或 Best-of-N 更嚴格"
---

> 🌏 [English version](/en/posts/ai/2026-08-26-coding-benchmarks-how-to-read-en)

每次有新模型發布，你都會看到一串數字：SWE-bench 86%、Terminal-Bench 68.5%、DeepSWE 56。但這些數字代表什麼？為什麼同一個模型在不同報告裡分數不一樣？哪些 benchmark 容易被灌水？這篇是給「想看懂模型公告但不想讀論文」的人寫的解碼指南。

## SWE-bench：最被引用的 coding benchmark

[SWE-bench](https://www.swebench.com/) 是目前最被引用的 coding benchmark。它用真實的 GitHub issue 測試模型：給模型一個 issue 描述和一個程式碼倉庫，要求它寫出能通過測試的 patch。

### 三個版本的差異

**SWE-bench 原版**（2023）：2,294 個 task，全部來自 12 個 Python repo。問題是有些 task 的 issue 描述模糊、測試案例不完整。

**SWE-bench Verified**（2024）：OpenAI 出資請 93 位專業工程師人工審核，篩出 500 個高品質 task。依 [CodingFleet 的分析](https://codingfleet.com/blog/swe-bench-pro-explained-the-new-standard-for-ai-coding-benchmarks-2026)，OpenAI 自己在 2026 年 2 月公開放棄了 Verified——因為 500 題太少、統計效力不足，而且仍然只有 Python。但它至今仍是被引用最多的版本，因為歷史分數最齊全。

**SWE-bench Pro**（2025）：Scale AI 開發，1,865 個 task、41 個 repo、123 種語言。這是從根本上重新設計的版本，反映了現代軟體工程的多語言現實。依同一份分析，[DeepSWE 的稽核](https://deepswe.datacurve.ai/)發現 Pro 有 32% 的驗證器判斷有誤——這個數字本身就說明了 benchmark 有多難做對。

### 要注意什麼

- **Verified 的分數快要飽和**：頂尖模型都在 80-86% 之間，差距在信賴區間內
- **Pro 才是未來**：多語言、更大的 task 池，但歷史數據少，橫向比較困難
- **harness 很重要**：模型本身只提供推理能力，實際跑 SWE-bench 時還需要一個 agent harness（如 mini-SWE-agent）來處理檔案操作、命令執行。不同 harness 會影響分數

## Terminal-Bench 2.1：測 Agent 在終端機裡能做什麼

[Terminal-Bench](https://www.tbench.ai/) 測的是模型以 agent 身份操作終端機完成任務的能力——不只是寫程式碼，還包括系統管理、資料處理、環境設定。

依 [Terminal-Bench 2.1 公告](https://www.tbench.ai/news/terminal-bench-2-1)，2.1 版修正了 2.0 版 89 個 task 中 28 個有問題的（外部依賴變動、資源配置不足、指令與測試不一致），修正後 Claude Code + Opus 4.6 的分數跳了 12.1%。

### harness 造成的分數差異

這是最容易讓人誤讀的部分。以 [Ornith 1.5-35B](/posts/tech/2026-08-26-ornith-deepreinforce-model-family) 為例：

| Harness | Terminal-Bench 2.1 分數 |
|---|---|
| Terminus-2 | 67.8 |
| Claude Code harness | 68.5 |

差 0.7 分不大，但有些模型在不同 harness 上的差異可以超過 10-20 分。讀到 Terminal-Bench 分數時，一定要確認用的是哪個 harness。依 [Artificial Analysis](https://artificialanalysis.ai/evaluations/terminalbench-v2-1) 的做法，他們統一用 Terminus 2 harness 並跑 3 次取平均。

## DeepSWE：最難的 benchmark，多數模型掛零

[DeepSWE](https://deepswe.datacurve.ai/) 是 Datacurve 在 2026 年 5 月發布的「長程軟體工程」benchmark。113 個 task、91 個 repo、5 種語言，每個 task 都是從零寫的，不是從既有 commit 改編。

它跟 SWE-bench 的核心差異：

- **防汙染**：task 全部原創，模型在預訓練時不可能見過解答
- **真的難**：問題描述長度只有 SWE-bench Pro 的一半，但解法需要 5.5 倍的程式碼量和 2 倍的輸出 token
- **行為驗證**：測試檢查軟體行為而非實作細節

依 DeepSWE 官方排行榜（2026-08-20），頂尖分數是 Claude Opus 5 的 74%，而 [MiniMax M2.5](/posts/tech/2026-08-26-minimax-model-family) 拿 22%、[Ornith 1.5-35B](/posts/tech/2026-08-26-ornith-deepreinforce-model-family) 也是 22%——同量級的 Qwen3.6-35B 和 Gemma 4-31B 直接掛零。這個 benchmark 的區分度遠高於已經飽和的 SWE-bench Verified。

## Aider Polyglot：最貼近真實使用的 benchmark

[Aider](https://aider.chat/docs/leaderboards) 的 Polyglot benchmark 用 225 個 Exercism 練習題（跨 C++、Go、Java、JavaScript、Python、Rust），測模型在 pair programming 情境下的 coding 能力。

Aider 最獨特的地方是**它同時追蹤成本**。依官方排行榜，GPT-5 (high) 拿 88% 但跑一次要 $29.08，而 DeepSeek V3.2 拿 70.2% 只要 $0.88——成本差 33 倍，分數差 18 分。這讓你可以做性價比判斷，而不只看誰分數最高。

### 為什麼 Aider 比 SWE-bench 更「真實」

SWE-bench 測的是「給你一個 bug report，修好它」。Aider 測的是「在已有程式碼基礎上，照指令寫新功能或改寫程式碼」——這更接近日常開發者跟 AI 協作的場景。但 Aider 的題目是練習題等級，不是真實 repo 的複雜度。

## LiveCodeBench：競程能力 ≠ 軟體工程能力

[LiveCodeBench](https://livecodebench.github.io/) 用 LeetCode / Codeforces 等級的競程題測試模型。[Nous Research 的 NousCoder-14B](/posts/tech/2026-08-26-nous-research-hermes) 在 LiveCodeBench v6 拿到 67.87% Pass@1。

**要注意的**：競程能力和軟體工程能力是兩回事。競程測的是演算法設計和邊界條件處理，軟體工程測的是理解大型程式碼庫、跨檔案修改、與測試框架互動。一個模型在 LiveCodeBench 很強但 SWE-bench 很弱，完全有可能。

## HumanEval / MBPP：該退休的老前輩

HumanEval（164 題）和 MBPP（974 題）是最早的 coding benchmark。頂尖模型在 HumanEval 上已經超過 95%，基本飽和。它們仍然被引用的原因只有一個：歷史數據最齊，方便跨年代比較。

**2026 年不應該用 HumanEval 判斷模型好壞**——就像你不會用小學數學考卷評比研究生。

## 怎麼識別 Benchmark 灌水

| 手法 | 怎麼看出來 |
|---|---|
| **自報分數** | 沒有第三方獨立跑過的分數。看有沒有在 [Artificial Analysis](https://artificialanalysis.ai/) 或 [SWE-bench 官方](https://www.swebench.com/) 的獨立驗證 |
| **harness 挑最高的** | 同一個模型用不同 harness 跑，只報最高分。正規做法是統一 harness 或都報 |
| **cherry-pick 版本** | 報 SWE-bench Verified 不報 Pro，報 Terminal-Bench 2.0 不報 2.1。通常是因為新版分數更低 |
| **訓練集汙染** | 模型在預訓練時見過 benchmark 的解答。DeepSWE 就是為了解決這個問題才從零寫 task 的 |
| **Best-of-N** | 跑很多次取最好的，而不是報 Pass@1。正規 benchmark 都報 Pass@1 並註明跑幾次取平均 |

## 你該看哪個 Benchmark？

| 你的需求 | 看這個 | 為什麼 |
|---|---|---|
| 評估 Agent 解 bug 的能力 | SWE-bench Pro | 最大的多語言真實 issue 測試集 |
| 評估 Agent 在終端操作的能力 | Terminal-Bench 2.1 | 唯一專測終端 agent 的 benchmark |
| 評估模型在最難任務的表現 | DeepSWE | 防汙染、長程、區分度最高 |
| 評估日常 pair programming 的性價比 | Aider Polyglot | 唯一同時追蹤成本的 benchmark |
| 評估演算法能力 | LiveCodeBench | 最新的競程 benchmark |
| 跨年代比較（2023-2026） | HumanEval | 歷史數據最齊，但已飽和 |

最後一個建議：**不要只看一個 benchmark 就下結論**。SWE-bench 分數高但 DeepSWE 掛零的模型，很可能是在訓練時見過 SWE-bench 的解答。多個 benchmark 交叉比對才是正確的讀法。

## 參考資料

- [SWE-bench 官方排行榜](https://www.swebench.com/)
- [SWE-bench Pro 詳解 — CodingFleet](https://codingfleet.com/blog/swe-bench-pro-explained-the-new-standard-for-ai-coding-benchmarks-2026)
- [Terminal-Bench 官網與排行榜](https://www.tbench.ai/)
- [Terminal-Bench 2.1 公告](https://www.tbench.ai/news/terminal-bench-2-1)
- [Terminal-Bench 論文 — arXiv:2601.11868](https://arxiv.org/abs/2601.11868)
- [DeepSWE 官方排行榜](https://deepswe.datacurve.ai/)
- [DeepSWE 論文 — arXiv:2607.07946](https://arxiv.org/abs/2607.07946)
- [Aider Polyglot 排行榜](https://aider.chat/docs/leaderboards)
- [Artificial Analysis Terminal-Bench 2.1 評測](https://artificialanalysis.ai/evaluations/terminalbench-v2-1)
- [Ornith 模型家族介紹](/posts/tech/2026-08-26-ornith-deepreinforce-model-family)
- [MiniMax 模型家族介紹](/posts/tech/2026-08-26-minimax-model-family)
- [Nous Research 模型家族介紹](/posts/tech/2026-08-26-nous-research-hermes)
