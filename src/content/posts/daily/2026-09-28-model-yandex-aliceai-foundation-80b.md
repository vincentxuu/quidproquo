---
title: "模型卡｜AliceAI-Foundation-80B-A3B-Base"
date: 2026-09-28
category: daily
type: digest
tags: [ai-agent, model-release, daily, yandex, model-family-alice]
lang: zh-TW
description: "Yandex 開源首個從零訓練的 80B MoE base model——KDA 線性注意力混合架構、256K context，俄語事實知識輾壓所有對手"
tldr: "AliceAI-Foundation-80B-A3B-Base：Yandex 2026-09-21 開源，完全從零訓練（非 Qwen/Llama 微調）；80B 總參數／3B 活化 MoE，262,144 tokens context window；Apache-2.0，尚無官方託管 API 定價；MATH-500 91.1 分超越同級 Qwen3.5-35B-A3B-Base 與更大的 DeepSeek-V4-Flash-Base（284B-A13B）；俄語事實基準 WikiWebFacts 86.5 分大幅領先所有比較對象；純 base model，未經 SFT/RL 對齊，不能直接當 agent 使用"
series:
  name: "AI Model Tracker"
  order: 33
glossary:
  - term: "Alice AI"
    def: "Yandex 的 AI 助理產品，AliceAI-Foundation 是支撐其未來統一推理模型的實驗性 base model"
---

> 🌏 [English version](/en/posts/daily/2026-09-28-model-yandex-aliceai-foundation-80b-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `yandex/AliceAI-Foundation-80B-A3B-Base` |
| 廠商 | Yandex |
| 參數量 | 80B 總參數 / 3B 活化參數（MoE，512 個路由專家＋1 個共享專家，Top-10 啟動） |
| Context Window | 262,144 tokens（約 256K） |
| Input 定價 (USD/1M tokens) | 未提供（純開源 base model，官方未釋出託管 API，第三方推論服務尚未上架） |
| Output 定價 (USD/1M tokens) | 未提供（同上） |
| 開源 | 是（Apache-2.0） |
| 發布日 | 2026-09-21 |
| 官方公告 | [Yandex Investor Relations](https://ir.yandex/press-releases?id=2026-09-21&year=2026) |
| HuggingFace | [yandex/AliceAI-Foundation-80B-A3B-Base](https://huggingface.co/yandex/AliceAI-Foundation-80B-A3B-Base) |
| 家族 | Alice AI（Yandex AI 助理背後模型家族，此模型是通往未來「統一推理模型」的實驗版本） |

## 能力亮點

- 完全從零訓練，不是 Qwen 或 Llama 的微調版：48 層網路每 4 層一組（3 層 KDA 線性注意力＋1 層 Gated Attention），每層都掛 512 專家的 MoE，活化參數只佔 3.75%，大幅降低推理算力需求
- 數學與競賽推理表現突出：MATH-500 拿下 91.1 分，超過同量級的 Qwen3.5-35B-A3B-Base（81.9 分）與參數量大 3.5 倍的 DeepSeek-V4-Flash-Base（284B-A13B，80.7 分）；AIME 2026 pass@32 以 96.7 分與 Qwen3.5-35B-A3B-Base 並列第一
- 俄語事實知識大幅領先：自建的 WikiWebFacts 基準拿下 86.5 分，比 Qwen3.5-35B-A3B-Base 的 62.4 分高出 24.1pp，甚至追平自家舊款閉源模型 Alice AI LLM（參數量是它的 3 倍、活化參數是 7 倍）
- 工程面把訓練優化器改造成 GPU 間資料傳輸與運算並行，訓練步驟提速約 2 倍；資料篩選改用分級分類器串接，把原本要價 20 萬 GPU 小時的高成本評分工作壓縮超過 10 倍運算量，同時保留約 95% 的有效文件

## Benchmark 表現

| Benchmark | AliceAI-Foundation-80B-A3B-Base | 前代 | 競品最強 |
|---|---|---|---|
| MATH-500（5-shot） | 91.1 | N/A（Yandex 首個從零訓練開源 base model） | Qwen3.5-35B-A3B-Base 81.9 |
| AIME 2026 pass@32 | 96.7 | N/A | Qwen3.5-35B-A3B-Base 96.7（並列第一） |
| WikiWebFacts（俄語事實知識，5-shot） | 86.5 | Alice AI LLM（舊款閉源模型，同級表現但參數量 3 倍、活化參數 7 倍） | DeepSeek-V4-Flash-Base 83.2 |
| LiveCodeBench v5-6 CoT 1-shot pass@1 | 50.5 | N/A | Qwen3.5-35B-A3B-Base 50.4 |
| CodeForces CPP pass@8 | 68.9 | N/A | Qwen3.5-35B-A3B-Base 73.7（全場最高） |

⚠️ 以上皆為 Yandex 官方在自建測試環境（vLLM，t=0 或 t=1）自測數據，尚待第三方復現。WikiWebFacts、HardMultiQA、CultCat、EduBench 系列為 Yandex 自建並同步公開的俄語基準，附完整評測協定供他人重現。

## 與前代/競品比較

這是 Yandex 第一個完全從零訓練、公開釋出的開源 base model，不是拿 Qwen 或 Llama 打底做微調——包括訓練語料、架構、超參數都是重新設計。官方定位它是通往未來「統一推理模型」的實驗版本，那個推理模型將支撐 Alice AI 助理的 agentic 能力，讓使用者可以把具體動作委派給它執行。

跟活化參數量接近的 Qwen3.5-35B-A3B-Base 比，兩者互有勝負：AliceAI 在 MATH-500 贏 9.2pp，AIME 2026 打平，但 CodeForces C++ 競賽題落後 4.8pp。真正的差異化在俄語與專業知識領域——WikiWebFacts、EduBench 歷史／文學、法律與醫療類 ExpertFactsQA，AliceAI 全部勝出，且幅度往往超過 20pp，甚至打贏參數量、活化參數量都大上數倍的 DeepSeek-V4-Flash-Base。

定價層面沒有比較基礎：AliceAI 是 Apache-2.0 全開源釋出，沒有官方託管 API，需要自架 vLLM 或 Transformers 推論（BF16 全精度檔案約 163GB）。這跟同期多數閉源旗艦「開源即帶 API 定價」的做法不同，代表 Yandex 現階段的目標是驗證架構與訓練方法論，而非立刻搶市占。

## 對 Agent 開發的意義

MoE 架構混合線性注意力（KDA）與標準注意力，同時把活化參數壓到 3.75%，這對長 context、低成本推理的 agent 架構設計是一個值得參考的取捨案例。

- 如果你在做 agent 推理架構實驗：這是少數公開釋出、把線性注意力（KDA）與標準 Gated Attention 交錯堆疊、外加超細粒度 512 專家 MoE 的大型模型，256K context 搭配 3B 活化參數的成本結構值得研究
- 如果你的產品鎖定俄語或多語系市場：這是目前開源模型中俄語事實與專業知識（法律、醫療、教育）最強的選擇之一，且 Yandex 同步公開了 WikiWebFacts、HardMultiQA 兩個俄語基準供驗證
- 不適合：這是純 pretrained base model，未經 instruction tuning 或 RL 對齊，不能直接拿來做聊天機器人或 agent 的 action 決策，必須自己做 SFT/RL；目前也沒有官方託管 API，得自架 vLLM 服務（163GB BF16 檔案），部署門檻不低

## 今日收穫

以往容易預設「打得贏大模型的開源 base model」多半是拿 Qwen 或 Llama 微調出來的衍生版本。AliceAI-Foundation 是個反例：一家搜尋引擎公司從零開始設計混合注意力架構，訓練資料規模未必壓倒性領先，卻能在數學推理與特定領域知識上打贏參數量大好幾倍的衍生模型。這說明「base model 護城河」比較多來自訓練方法論與資料篩選精度，不完全是純堆參數量。

## 參考資料

- [Yandex Investor Relations：Yandex Open-Sources New AI Model Trained from Scratch](https://ir.yandex/press-releases?id=2026-09-21&year=2026)
- [HuggingFace：yandex/AliceAI-Foundation-80B-A3B-Base](https://huggingface.co/yandex/AliceAI-Foundation-80B-A3B-Base)
- [AlphaSignal：Yandex Drops AliceAI Foundation 80B Open Source Model That Beats Rivals on Math](https://alphasignal.ai/news/yandex-drops-aliceai-foundation-80b-open-source-model-that-beats-rivals-on-math)
- [Yandex Medium 技術報告：AliceAI-Foundation-80B-A3B-Base Release](https://medium.com/yandex/aliceai-foundation-80b-a3b-base-release-what-we-learned-training-a-new-open-weight-model-from-9bb2490903f3)
