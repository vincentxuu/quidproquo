---
title: "Kimi：月之暗面的長文本 AI 模型，憑什麼挑戰 GPT 和 Claude？"
date: 2026-03-26
category: ai
tags: [kimi, moonshot-ai, llm, long-context, reasoning, 月之暗面, ai-model, moe, open-source]
lang: zh-TW
tldr: "Kimi 是中國 AI 新創月之暗面（Moonshot AI）推出的大型語言模型，以超長 context window、開源策略和極具競爭力的定價聞名。從 2023 年的 200K context 到 2026 年的 K2.5 Agent Swarm，Kimi 已成為全球 AI 市場不可忽視的力量。"
description: "深入介紹 Moonshot AI 月之暗面旗下的 Kimi 模型系列，涵蓋公司背景、技術特色、模型演進（K1.5 → K2 → K2.5）、MoE 架構、Agent Swarm、定價比較，以及與 GPT-5、Claude、Gemini 的競爭態勢。"
draft: false
---

2023 年，當全世界都在追趕 OpenAI 時，一家叫「月之暗面」（Moonshot AI）的中國新創公司做了一個不太一樣的選擇——它沒有急著推出「中國版 ChatGPT」，而是把賭注押在一個當時很少有人重視的技術方向：**超長 context window**。

這個選擇，讓 Kimi 成為中國 AI 市場中最有辨識度的產品之一。而到了 2026 年，它已經不只是一個「長文本工具」——它是全球 AI 競賽中，少數能在多個維度同時挑戰 GPT、Claude、Gemini 的開源模型。

---

## 月之暗面是誰？

月之暗面（Moonshot AI）由**楊植麟**（Yang Zhilin）於 2023 年 3 月創立，公司名取自 Pink Floyd 的經典專輯 *The Dark Side of the Moon*，恰好在專輯發行 50 週年時成立。楊植麟 1993 年出生，清華大學畢業後赴 Carnegie Mellon University 攻讀博士，參與過 **Transformer-XL** 和 **XLNet** 的研究——這兩項工作直接推動了長序列建模技術的發展。

共同創辦人還包括**周昕宇**和**吳育昕**，三人均為清華校友。

楊植麟曾提出通往 AGI 的三個里程碑：(1) 長 context length，(2) 多模態世界模型，(3) 可持續自我改進的通用架構。Kimi 的產品演進路線，幾乎就是在依序攻克這三個目標。

### 融資歷程

月之暗面是中國 AI 領域融資速度最快的公司之一，累計融資超過 **17 億美元**：

| 時間 | 金額 | 估值 | 投資方 |
|------|------|------|--------|
| 2023 年 | $6,000 萬 | $3 億 | 早期投資者 |
| 2024 年 2 月 | $10 億 | $25 億 | 阿里巴巴領投 |
| 2024 年 8 月 | $3 億 | $33 億 | 騰訊、高榕資本 |
| 2026 年 1 月 | $5 億（C 輪）| $43 億 | IDG、阿里巴巴、騰訊 |
| 2026 年 2 月 | $7 億+ | 目標 $100 億 | 阿里巴巴、騰訊、物源資本 |

---

## Kimi 的起點：超長 Context Window

### 從 200K 到百萬 tokens

2023 年 10 月，Kimi 以支持 **200,000 中文字元**的 context window 亮相——在當時，這是消費級 AI 產品中最長的上下文窗口之一。作為對比，當時的 GPT-4 是 8K/32K tokens，Claude 2 是 100K tokens。

到了 2024 年 3 月，Kimi 進一步將 context window 擴展到 **2,000,000 中文字元**，支持用戶直接上傳整本書、長篇論文、完整程式碼庫進行分析和問答。

「Kimi」這個名字其實來自楊植麟的英文暱稱。

### 為什麼長文本很重要？

長 context window 不只是一個數字上的炫耀，它直接改變了使用方式：

- **整本書分析**：不用切割、不用摘要，直接丟進去問問題
- **長文件比對**：合約、法律文件、技術文檔的交叉比對
- **程式碼庫理解**：不需要 RAG 就能理解大型 codebase 的上下文
- **研究整合**：把十幾篇論文一次丟進去做綜合分析

這跟 RAG（Retrieval-Augmented Generation）不衝突，而是互補——長 context 減少了對外部檢索的依賴，而 RAG 則能處理超出 context window 的知識規模。

---

## 模型演進：從聊天機器人到前沿模型

### Kimi Chat（2023-2024）

最初的 Kimi Chat 是一個面向消費者的聊天產品，主打長文本理解和中文對話能力。它在中國市場迅速獲得用戶，特別是學生、研究者和知識工作者群體。

### Kimi K1.5（2025 年 1 月）

**K1.5** 標誌著 Kimi 從「長文本工具」轉向「推理型模型」的關鍵轉折：

- **強化學習驅動的推理**：使用大規模 RL 提升推理能力，類似 OpenAI o1 路線
- **長思維鏈（Long CoT）**：模型能進行更深層、更長的推理過程
- **多模態推理**：不只是文字，也能對圖像進行推理
- **數學和程式碼**：在 AIME、MATH-500、LiveCodeBench 等基準測試上與 OpenAI o1 競爭

K1.5 的技術報告強調了一個有力觀點：**不需要 Monte Carlo Tree Search 那樣複雜的框架，純粹的 RL scaling 就能達到頂級推理表現**。

### Kimi-VL（2025 年 4 月）

**16B MoE（3B 活躍參數）** 的開源視覺語言模型，專注於圖像理解任務。

### Kimi-Dev（2025 年 6 月）

**72B** 的程式碼專用模型（基於 Qwen2.5-72B），在 SWE-bench Verified 上達到開源模型 SOTA。

### Kimi K2（2025 年 7 月）

**K2** 是月之暗面的重磅開源模型，確立了技術架構方向：

- **1T 總參數，32B 活躍參數**——MoE 架構，384 個 expert，每次推理啟動 8 個
- **MuonClip 優化器**：結合 Muon 演算法和 QK-Clip 穩定機制，在 15.5T tokens 的預訓練中實現零 loss spike
- **128K context window**
- **Modified MIT 授權**開源

### K2 後續版本

- **K2-Instruct-0905**（2025 年 9 月）：改進程式碼能力，context 擴展到 256K
- **Kimi Linear**（2025 年 10 月）：48B MoE（3B 活躍），使用「Kimi Delta Attention」實現更高效推理
- **K2 Thinking**（2025 年 11 月）：256K context，支持 200-300 次連續工具調用，訓練成本僅約 $460 萬

### Kimi K2.5（2026 年 1 月）🔥

**K2.5** 是目前 Kimi 系列的旗艦模型，也是最大的一次飛躍：

- **原生多模態**：從頭開始在 ~15 兆混合視覺與文字 tokens 上訓練，使用 MoonViT（400M 參數的視覺編碼器），不是後掛的視覺模組
- **Agent Swarm**：能自主派遣最多 **100 個子 agent** 並行工作，執行高達 1,500 次工具調用，效率是單 agent 的 4.5 倍
- **1T MoE / 32B 活躍**，256K context
- **Modified MIT 授權**開源

---

## 技術深度剖析

### MoE 架構

K2/K2.5 的 MoE 架構細節：

```
總參數：    1.04T
活躍參數：  32B
Expert 數： 384（每次啟動 8 個）
稀疏比：    48:1
注意力頭：  64（Multi-head Latent Attention）
隱藏維度：  7168
MoE 隱藏維度：2048
層數：      61（含 1 個 dense 層）
```

跟 DeepSeek-V3 相比，K2 的 expert 更多（384 vs 256）但注意力頭更少（64 vs 128），在不同維度上做了取捨。

### MuonClip 優化器

這是 Kimi 在訓練穩定性上的重要創新。傳統大模型訓練中，loss spike（訓練損失突然飆升）是常見且棘手的問題。MuonClip 結合了：

- **Muon 演算法**：token-efficient 的優化方法
- **QK-Clip**：穩定注意力機制的梯度

結果：在 15.5T tokens 的完整預訓練過程中**零 loss spike**。

### 推理能力的 RL 路線

從 K1.5 開始，Kimi 的推理提升策略：

1. 監督學習訓練基礎模型
2. 大規模 agentic 數據合成管線生成訓練資料
3. 聯合 RL 階段：結合 **RLVR**（Reinforcement Learning with Verifiable Rewards）和 **Self-Critique Rubric Reward** 機制
4. 透過 scaling RL 計算量持續提升品質

### K2.5 的原生多模態

K2.5 不是把視覺模組「接上去」的——它在 ~15T 混合視覺和文字 tokens 上做了持續預訓練。MoonViT（400M 參數）是專門設計的視覺編碼器，讓模型能真正「理解」圖像而不只是描述。

---

## Kimi vs 當前主流模型（2026 年初）

| 維度 | Kimi K2.5 | GPT-5.x | Claude Opus 4.5/4.6 | Gemini 3 Pro |
|------|-----------|---------|---------------------|--------------|
| 架構 | MoE (1T/32B) | 未公開 | 未公開 | MoE（傳聞） |
| Context | 256K | 128K+ | 200K | 1M+ |
| Agent / 工具使用 | ✅ Agent Swarm | ✅ | ✅ | ✅ |
| 多模態 | ✅ 原生 | ✅ | ✅ | ✅ |
| 開源 | ✅ Modified MIT | ❌ | ❌ | ❌ |
| 中文能力 | ✅ 原生優勢 | 良好 | 良好 | 良好 |
| SWE-bench | 76.8% | ~80% | 80.9% | 80.6% |
| 數學（AIME 2025）| 96.1% | — | — | — |
| HLE（帶工具）| 44.9 | 41.7 | — | — |

### Kimi 贏在哪？

- **Agentic 任務**：HLE with tools（44.9 vs GPT-5 的 41.7）、BrowseComp（60.2 vs GPT-5 的 54.9 vs Claude 的 24.1）
- **成本效益**：API 定價比 GPT-5.4 便宜 4-17 倍，比 Claude Sonnet 4.6 便宜 5-6 倍
- **數學**：AIME 2025（96.1%）、HMMT 2025（95.4%）
- **開源**：1T 參數模型以 Modified MIT 開放

### 其他模型贏在哪？

- **GPT-5.x**：純推理、抽象問題、英文寫作、通用知識（MMLU-Pro 87.1 vs K2 84.6）
- **Claude Opus**：軟體工程（SWE-bench ~80.9%）、安全性、寫作品質（79.8 vs K2 73.8）
- **Gemini 3 Pro**：文件密集型任務、Google 生態整合、超大 context

---

## API 與定價

月之暗面提供 **Moonshot API**（`platform.moonshot.ai`），兼容 OpenAI SDK，可直接替換 base URL。

### K2.5 定價

| 類型 | 輸入 | 輸出 |
|------|------|------|
| 標準 | $0.60/M tokens | $2.50/M tokens |
| Cache 命中 | $0.15/M tokens（75% 折扣）| — |
| K2 Turbo | $1.15/M tokens | $8.00/M tokens |
| Web 搜尋工具 | $0.005/次 | — |

**消費者訂閱**：約 $8-19/月（對比 ChatGPT Plus $20/月、Claude Pro $20/月）。

模型也可透過 **OpenRouter**、**Together AI**、**NVIDIA NIM**、**Hugging Face** 等平台使用。開源版本支持本地部署，權重以 block-FP8 格式儲存，K2 Thinking 支持原生 INT4 量化。

---

## 爭議：蒸餾事件

2026 年 2 月，Anthropic 公開指控月之暗面（以及 DeepSeek、MiniMax）使用約 24,000 個假帳號，與 Claude 進行超過 1,600 萬次對話以進行模型蒸餾。其中月之暗面被指進行了約 340 萬次對話，主要針對 agentic reasoning、工具使用、程式碼和電腦視覺能力。

Anthropic 表示透過請求 metadata 追溯到月之暗面高層員工的公開資料。此事件在業界引發廣泛討論——有人認為這是嚴重的智慧財產權問題，也有人認為這反映了 AI 競爭中的灰色地帶。

---

## 值得關注的點

### 優勢
- **成本殺手**：API 定價是 GPT 和 Claude 的 1/4 到 1/17
- **開源策略**：1T 參數模型以 MIT 授權開放，在中國頂級模型中少見
- **Agent Swarm**：100 個子 agent 並行是目前最激進的 agentic 架構之一
- **中文原生**：從訓練資料到產品設計都以中文為核心
- **成長速度**：K2.5 上線 20 天的營收超過 2025 全年；海外收入已超越國內；全球付費用戶月增長 170%

### 挑戰
- 英文寫作品質和 SWE-bench 等軟體工程基準仍落後 Claude 和 GPT
- 蒸餾爭議對品牌信譽的長期影響尚不確定
- 中國 AI 市場競爭極為激烈——DeepSeek、智譜 AI、百川智能都在搶同一塊市場
- 國際合規和資料主權問題

---

## 結語

Kimi 不是「又一個中國版 ChatGPT」。它從長文本出發，經歷了推理、多模態、agent 的完整演進，在三年內成為全球 AI 市場中少數能在多個維度同時競爭的開源模型。

對開發者來說，K2.5 的 OpenAI 兼容 API、極具競爭力的定價、以及開源部署選項，讓它成為一個值得認真考慮的選項——特別是在 agentic 工作流和中文場景中。

如果你還沒試過 Kimi，建議從一個需要大量工具調用的 agent 任務開始，或者丟一份超長文件進去。這兩個方向是 Kimi 目前最有說服力的地方。

---

**延伸閱讀：**
- [Kimi K1.5 技術報告](https://arxiv.org/abs/2501.12599)
- [Kimi K2 技術報告](https://arxiv.org/abs/2507.20534)
- [Kimi K2.5 技術部落格](https://www.kimi.com/blog/kimi-k2-5)
- [Moonshot AI 官方平台](https://kimi.moonshot.cn/)
- [Kimi K2 GitHub](https://github.com/MoonshotAI/Kimi-K2)
- [Moonshot API 平台](https://platform.moonshot.ai/)
