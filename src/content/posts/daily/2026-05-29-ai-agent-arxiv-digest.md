---
title: "AI Agent Arxiv Digest — 2026-05-29"
date: 2026-05-29
category: daily
tags: [ai-agent, arxiv, daily, agent-rag, agent-framework, agent-deployment]
lang: zh-TW
description: "今天三篇論文從三個切面同時問「如何讓 agentic AI 跑得更好」：第一篇（UIUC × Intel）量測 agent 真實工作負載，發現瓶頸在 KV-cache 管理而非長 prompt；第二篇（PwC）用對照實驗打臉 RAG-first 預設，指出 grep 在 agent loop 裡常勝"
tldr: "今天三篇論文從三個切面同時問「如何讓 agentic AI 跑得更好」：第一篇（UIUC × Intel）量測 agent 真實工作負載，發現瓶頸在 KV-cache 管理而非長 prompt；第二篇（PwC）用對照實驗打臉 RAG-first 預設，指出 grep 在 agent loop 裡常勝過向量搜尋；第三篇（Microsoft Research）開源完整 agent 訓練框架，讓社群不靠閉源 API 也能訓練出同量級 SOTA 的 agent。"
series:
  name: "AI Agent Arxiv Digest"
  order: 5
---
[!callout icon="📌" color="blue_background"]
## 今日總覽

今天三篇論文從三個切面同時問「如何讓 agentic AI 跑得更好」：第一篇（UIUC × Intel）量測 agent 真實工作負載，發現瓶頸在 KV-cache 管理而非長 prompt；第二篇（PwC）用對照實驗打臉 RAG-first 預設，指出 grep 在 agent loop 裡常勝過向量搜尋；第三篇（Microsoft Research）開源完整 agent 訓練框架，讓社群不靠閉源 API 也能訓練出同量級 SOTA 的 agent。

## 讀這篇前該知道的詞


| 詞 | 白話解釋 |
|---|---|
| ReAct | Reasoning + Acting，讓 LLM 先「想一想」再「做一件事」的 agent 迴圈架構，目前最主流的 agent 模式 |
| KV-Cache | Key-Value Cache，模型推理時暫存中間計算的記憶體空間；可重用時不必重算，對長對話效率關鍵 |
| SFT | Supervised Fine-Tuning（監督式微調），用標注資料調整模型行為，是訓練 agent 的起點 |
| RL | Reinforcement Learning（強化學習），讓模型從任務成敗訊號中學習，適合難以密集標注的 agent 任務 |
| RAG | Retrieval-Augmented Generation，回答前先從知識庫撈相關內容再一起送進 LLM |


---


## 論文一｜Agentic AI Workload Characteristics

**作者**: Yichao Yuan、Nishil Talati（UIUC）、Ankita Nayak（Gimlet Labs）、Souvik Kundu（Intel）　·　**arxiv**: 2605.26297
**連結**: [arxiv](https://arxiv.org/abs/2605.26297) · [alphaxiv](https://www.alphaxiv.org/abs/2605.26297)
[!callout icon="🎯" color="yellow_background"]

### TL;DR

你以為 agent 的效能瓶頸是「prompt 太長」——錯了。真正的瓶頸是 token 生成速度與 KV-cache 管理，serving 系統需要為此重新設計。
[!callout icon="⭐" color="green_background"]

### Read Priority

必讀
任何在做 LLM serving 或 agent runtime 的工程師都應讀：這是 agentic 工作負載的第一份量化特性報告，結論直接影響基礎設施選型。
[!callout icon="🧭" color="gray_background"]

### 領域背景

LLM serving 系統（如 vLLM、SGLang）長期以「優化 prefill（處理長 prompt）」為主軸。但 agent 是多輪的——它反覆呼叫模型、插入工具結果、context 越滾越長——這種模式到底讓 serving 系統面對什麼壓力，在這篇之前幾乎沒有人系統測量過。

### 中階導讀


#### 問題

傳統 LLM 呼叫：一個長 prompt 進去、答案出來，一次搞定。Agent 版本：同樣的任務可能要反覆呼叫模型 20 次，每次都帶著前面所有對話。這 20 次呼叫的計算特性是什麼？跟一次長呼叫有多不同？

#### 方法

作者用 end-to-end tracing infrastructure（端到端追蹤工具）記錄 ReAct 式 agent 在 5 個 benchmark 上跑任務時每一輪的 token 組成、cache 命中率與工具呼叫模式。分別測試推理型（含思考鏈）與非推理型的 Gemma、Qwen 模型。

#### 為什麼重要

- **Agentic ≠ long-prompt**：在有效 context caching 下，大多數 input token 是上一輪重用的，整體執行被 decode（生成新 token）主導而非 prefill（處理輸入）
- **工具呼叫有時序結構**：agent 任務早期偏向「讀取 / 探索」，後期才「執行 / 寫入」——代表 serving 系統的 KV-cache 策略要能感知任務階段
- **長壽命 KV-cache 是剛需**：context 越滾越大，KV-cache 不能輕易驅逐，否則反覆 prefill 極度浪費

### 深入要點

- 測試了 5 個 agentic benchmark，跨 reasoning / non-reasoning 模型（Gemma、Qwen），論文未完整列出所有 benchmark 名稱與 task 數量 ⚠️
- 「decode-dominated」結論的前提是 effective context caching 已就位；若 serving stack 無 KV-cache 重用，prefill 仍可能很貴 ⚠️
- 工具呼叫「早讀晚寫」的時序模式，對設計 cache eviction 策略有直接意義（先別驅逐任務早期建立的 KV）
- 與 framework 的關聯：LangGraph / AutoGen 的 message history 累積，正是長壽命 KV-cache 的實際來源；vLLM prefix caching、SGLang RadixAttention 是對應的技術解法
- 落地門檻：論文給方向性結論，無開源 tracer，工程師需自行在 serving stack 驗證
- 同週相關工作：2605.26289（Stateful Inference for Low-Latency Multi-Agent Tool Calling）可一起閱讀
[!callout icon="🧐" color="purple_background"]

### Reviewer 一句話評

問題問對了，方向有價值，但現有結果較高層次，缺乏讓人直接複現或量化比較的細節——目前更像一份指路牌而非完整系統論文；方向性結論強，但具體數字要謹慎推論。
[!callout icon="🎬" color="orange_background"]

### 給你的 take-away

- 選 LLM serving 框架時，優先確認有沒有 prefix caching / KV-cache 重用功能——這篇告訴你那不是「可選 feature」而是 agentic 場景的必要條件
- 設計 agent 的 context 截斷 / summarize 策略時，請考慮「任務早期內容比晚期更值得保留在 cache 裡」這個時序結構

---


## 論文二｜Is Grep All You Need? How Agent Harnesses Reshape Agentic Search

**作者**: Sahil Sen、Akhil Kasturi、Elias Lumer、Anmol Gulati、Vamse Kumar Subbiah（PricewaterhouseCoopers US）　·　**arxiv**: 2605.15184
**連結**: [arxiv](https://arxiv.org/abs/2605.15184) · [alphaxiv](https://www.alphaxiv.org/abs/2605.15184)
[!callout icon="🎯" color="yellow_background"]

### TL;DR

在 agent loop 裡找資料，直接用 grep（字串比對）往往比向量搜尋（semantic search）更準——但真正影響結果的是你用哪個 harness，不只是搜尋方法本身。
[!callout icon="⭐" color="green_background"]

### Read Priority

必讀
對在 agent 裡加 RAG 的工程師，這是直接的挑戰：你的向量資料庫不一定是最佳解，這篇有量化對照數據。
[!callout icon="🧭" color="gray_background"]

### 領域背景

RAG（Retrieval-Augmented Generation）是目前主流 agent 記憶方案：把文件切塊、embedding 向量化、用語意相似度搜尋。但 agent loop 裡的查詢往往是精確的事實查找，不是語意模糊的問題——這種場景下，「語意模糊比對」究竟比「精確字串搜尋（grep）」強在哪？這篇直接下場驗證。

### 中階導讀


#### 問題

想像 agent 在查閱長期對話記錄，要找「上週五客戶說的那筆合約金額」。要用向量搜尋（找語意接近的段落）還是 grep（直接搜關鍵字）？這個選擇在不同的 agent 運行環境（Claude Code、Gemini CLI、自製 harness）下，答案會一樣嗎？

#### 方法

從 LongMemEval（測試 agent 在長期對話中記憶力的 benchmark）取 116 題，分別搭配 grep 和向量搜尋作為工具，在四種 harness 環境下測試：自製的 Chronos、Claude Code、OpenAI Codex CLI、Gemini CLI。另外對比「inline 結果（直接給 LLM 看）」vs.「file-based 結果（寫到檔案讓 LLM 讀）」兩種呈現方式。

#### 為什麼重要

1. **Grep 在主要情境勝出**：跨所有 harness × model 組合，inline grep 準確率均高於 inline vector search，有時差距明顯
1. **Harness 本身決定準確率上限**：就算搜尋方法相同，Claude Code vs. Gemini CLI vs. Chronos 的表現可以差很多，說明 harness 的工具輸出格式本身影響顯著
1. **反例存在**：Gemini CLI Pro 上 vector 表現更好，說明結論有 harness 依賴性，不能一刀切

### 深入要點

- 實驗樣本：116 題，來自 LongMemEval 子集，規模偏小，結論需謹慎推論 ⚠️
- Codex 部分實驗資料尚未完整，論文承認「scaling 相關結論為條件性的」⚠️
- 四種 harness 各搭配不同 LLM，模型效果與 harness 效果難以完全解耦 ⚠️
- Grep 勝出的可能解釋：LongMemEval 以事實型問題為主（精確數字、人名），正好是 lexical search 強項；語意理解型問題可能結論不同
- Inline vs. file-based 呈現方式影響顯著：工具輸出「怎麼讓 LLM 看」本身就是關鍵設計點
- 對 LangChain / LangGraph 生態的挑戰：目前幾乎預設向量 store，這篇給出了系統性反例
- Chronos harness 已在論文中描述；Claude Code、Codex CLI、Gemini CLI 為第三方工具
[!callout icon="🧐" color="purple_background"]

### Reviewer 一句話評

問題有趣且挑戰了業界預設，但 116 題樣本太小、Codex 資料缺失、模型未統一控制，結論的普遍性仍存疑——是一篇值得重視的 negative result，但不宜直接當成「停用向量搜尋」的依據。
[!callout icon="🎬" color="orange_background"]

### 給你的 take-away

- 如果你的 agent 主要查詢精確事實（合約數字、特定日期、人名），試試在 RAG pipeline 旁邊加一個 grep/BM25 路徑，A/B 比較後再決定是否取代
- 設計 agent 工具時，別只優化搜尋演算法，工具回傳結果「怎麼呈現給 LLM」（inline 塞進 context 還是寫成檔案）本身是影響準確率的設計決策

---


## 論文三｜Orchard: An Open-Source Agentic Modeling Framework

**作者**: Microsoft Research（多位作者）　·　**arxiv**: 2605.15040
**連結**: [arxiv](https://arxiv.org/abs/2605.15040) · [alphaxiv](https://www.alphaxiv.org/abs/2605.15040)
[!callout icon="🎯" color="yellow_background"]

### TL;DR

Microsoft 開源完整的 agent 模型訓練框架，讓小模型靠資料蒸餾 + 特製 RL 在 SWE / GUI / 助理任務上達到同量級開源 SOTA，不需要依賴 GPT-4o API。
[!callout icon="⭐" color="green_background"]

### Read Priority

必讀
目前社群可直接用的最完整 agent 訓練開源方案之一，benchmark 數字紮實，框架設計有直接參考價值。
[!callout icon="🧭" color="gray_background"]

### 領域背景

要訓練一個能真正跑 agent 任務的模型（而非只是 prompt 一個大 API），你面對三道牆：高品質軌跡資料難取得、能跑 sandbox 的訓練環境要自建、sparse reward（只知道最終成敗）的 RL 算法設計難。現有開源框架多半只做 orchestration（調度模型用工具），不涉及模型訓練；效果最好的 agent（Devin、GitHub Copilot）都是閉源的。Orchard 試圖打破這個格局。

### 中階導讀


#### 問題

你想在自己的雲端跑一個 coding agent，不想每次呼叫 GPT-4o API。但訓練資料從哪來？訓練環境怎麼搭？模型在「幾乎解完但最後一步卡住」的任務上，怎麼從失敗軌跡裡還能學到東西？

#### 方法

Orchard 分三層：
1. **Orchard Env**：輕量化 sandbox lifecycle 管理服務，提供跨任務域可重用的環境原語（primitives）
1. **資料蒸餾 pipeline**：從 MiniMax-M2.5 和 Qwen3.5-397B 蒸餾 107K 條軌跡，引入 credit-assignment SFT（信用分配微調）——即使整條軌跡沒解完，仍從「有效的片段」中學習
1. **Balanced Adaptive Rollout RL**：針對 sparse reward（只有最終成功 / 失敗）設計的 RL 算法，確保訓練穩定

#### 為什麼重要

三個 recipe 全用小模型（30B、4B），搭配少量蒸餾資料，打出具說服力的 benchmark 數字，說明訓練策略的設計比模型規模更關鍵——而且整套都已開源。

### 深入要點

- **Orchard-SWE**（軟體工程 agent）：Qwen3-30B-A3B-Thinking，SWE-bench Verified SFT 64.3% → SFT+RL 67.5%，同量級開源模型 SOTA
- **Orchard-GUI**（瀏覽器 GUI agent）：4B VLM，0.4K 條蒸餾軌跡，WebVoyager 74.1% / Online-Mind2Web 67.0% / DeepShop 64.0% ⚠️（極少軌跡，需留意過擬合風險）
- **Orchard-Claw**（個人助理 agent）：0.2K 合成任務，Claw-Eval pass@3 59.6%；搭配 ZeroClaw harness 升至 73.9% pass@3
- 蒸餾源模型（MiniMax-M2.5、Qwen3.5-397B）未開源，資料蒸餾階段難以完整複現 ⚠️
- Credit-assignment SFT 是本篇最有技術含量的貢獻：解決 long-horizon task 中「partial credit」的訓練難題，有別於傳統 filter-then-SFT 做法
- 0.4K / 0.2K 的超小資料量數字亮眼，但此為針對特定 benchmark 微調的結果，泛化能力待驗 ⚠️
- Orchard Env 的 sandbox lifecycle primitives 設計對想自建 agent training infra 的團隊有直接架構參考價值
- 開源倉庫：[github.com/microsoft/Orchard](http://github.com/microsoft/Orchard)
[!callout icon="🧐" color="purple_background"]

### Reviewer 一句話評

紮實的工程貢獻：benchmark 數字有說服力，credit-assignment SFT 是真正新穎的想法，框架設計務實；蒸餾源模型不公開讓「完全可重現」打了折扣——但在目前開源 agent 訓練框架稀缺的環境下，仍是本週最值得 bookmark 的一篇。
[!callout icon="🎬" color="orange_background"]

### 給你的 take-away

- 如果你的團隊想自訓 coding agent 脫離 API 依賴：Orchard-SWE 的 pipeline（蒸餾 → credit-assignment SFT → sparse RL）是目前最完整的開源藍圖，直接看 [github.com/microsoft/Orchard](http://github.com/microsoft/Orchard)
- 如果你在設計 agent training infra：Orchard Env 的 sandbox lifecycle primitives 架構值得研究——它解決的「跨任務域可重用的 sandbox 管理」是自建訓練基礎設施最頭痛的工程問題之一


## 參考資料

- [arxiv:2605.26297](https://arxiv.org/abs/2605.26297)
- [arxiv:2605.26289](https://arxiv.org/abs/2605.26289)
- [arxiv:2605.15184](https://arxiv.org/abs/2605.15184)
- [arxiv:2605.15040](https://arxiv.org/abs/2605.15040)
