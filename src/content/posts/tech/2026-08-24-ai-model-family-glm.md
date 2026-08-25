---
title: "GLM——從清華實驗室到 744B 開源旗艦，以及 GLM-5.3 的資安突襲"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, glm, zhipu-ai, model-family-glm, moe, open-source, huawei-ascend, model-selection]
lang: zh-TW
type: deep-dive
tldr: "GLM 是智譜 AI（Z.ai）推出的開源 LLM 家族，源自清華大學 KEG 實驗室。GLM-5.3（2026/08）在 coding benchmark 比前代提升 50%，CyberGym 84.5% 超過 Anthropic Mythos 5 與 OpenAI GPT-5.6 Sol，在 Artificial Analysis Intelligence Index 得分 60 與 Kimi K3 並列開源第一。它是目前唯一完全在華為昇騰晶片上訓練出的前沿開源模型。"
description: "GLM（智譜 AI / Z.ai）模型家族完整介紹：2022→2026 演化時間線、開源權重與商用 API 雙軌策略、GLM 自迴歸填空架構與 744B MoE、Slime RL agent 訓練框架、華為昇騰訓練、GLM-5.3 資安能力與選型指南、MIT 授權分析，以及 Agent 開發者的選型建議"
series:
  name: "AI 模型家族"
  order: 8
draft: false
glossary:
  - term: "GLM"
    aliases: ["General Language Model"]
    definition: "清華大學 KEG 實驗室設計的自迴歸填空架構，用「填空」目標統一理解與生成，是 ChatGLM 與 GLM-5 系列的基礎"
  - term: "Slime RL"
    definition: "智譜 AI 自研的強化學習框架，用於 agent 訓練，核心創新是「過程驗證器」逐步追蹤工具呼叫是否正確，而非只看最終答案"
  - term: "OpenClaw"
    definition: "智譜 AI 的 Claude Code 等效工具，終端機式 AI 程式設計助理，對應 GLM-5-Turbo 最佳化"
  - term: "Huawei Ascend"
    aliases: ["華為昇騰"]
    definition: "華為的自研 AI 加速器，GLM-5 完全在此硬體上訓練，未使用任何 NVIDIA GPU"
---

> 🌏 [English version](/posts/tech/2026-08-24-ai-model-family-glm-en)

2026 年 8 月，智譜 AI 發布了 **GLM-5.3**——同一個底座，純靠後訓練（post-training）把 coding 能力拉高 50%，並在資安基準 CyberGym 上以 84.5% 超過了 Anthropic 的 Mythos 5（83.8%）與 OpenAI 的 GPT-5.6 Sol（83.6%）。這個家族源自清華大學的實驗室，從 2022 年的 GLM-130B 走到今天的 744B 開源旗艦，並且是**目前唯一完全在華為昇騰晶片上訓練出的前沿開源模型**。這篇追蹤 GLM 從學術原型到開源前沿的完整演化，以及它在 2026 年的定位。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的第八篇家族深度介紹。

## 家族演化時間線

| 版本 | 發佈 | 關鍵事實 |
|---|---|---|
| GLM-130B | 2022-07 | 130B 密集模型，ICLR 2023 論文，開源起點 |
| ChatGLM / ChatGLM-6B | 2023-03 | 對齊版本，6B 開源版引爆社群 |
| ChatGLM2 / 3 | 2023 下半年 | context 擴展、function calling、agent 能力 |
| GLM-4 系列 | 2024 | 10T+ tokens 預訓練，All Tools 自主工具選擇 |
| GLM-4.5 | 2025-07 | 355B MoE（32B 活躍），當時開源 MoE SOTA |
| **GLM-5** | 2026-02 | **744B MoE（40B 活躍），華為昇騰訓練，MIT 授權** |
| GLM-5.1 | 2026-05 | 為長時間 agent 任務設計，可獨立運行 8 小時 |
| GLM-5.2 | 2026-06 | 1M lossless context，open-source SOTA on coding |
| **GLM-5.3** | 2026-08 | **same base as 5.2，coding +50%，CyberGym 84.5%** |

四年、八個世代。前半段的劇本是「學術累積轉產品」，後半段則是**開源權重與商用 API 正式分家**——和 Qwen 走的是同一條雙軌路，但 GLM 的開源權重一直維持 MIT 這種最寬鬆授權。

## 兩條產品線：開源權重收生態，商用 API 收營收

看懂 GLM 在 2026 年的動作，關鍵是把它拆成兩條平行線：

**開源線**（HuggingFace 上的 `zai-org` / `ZhipuAI`）：從 GLM-4.5 到 GLM-5.3 的各代開源檢查點，絕大多數掛 **MIT 授權**，商用不受限、可微調、可自架。這條線負責生態位——vLLM、llama.cpp、SGLang 全支援，微調社群把它當可信賴的開源基底。

**商用線**（Z.ai / BigModel.cn 的 API）：GLM-5.3 的 API 在 2026-08-19 上線，定價沿用 GLM-5.2 世代。這條線負責營收——ZCode、GLM Coding Plan（點數制，離峰時段消耗 50% 點數）都跑在商用 API 上。

中間有一個關鍵差異：GLM-5.3 的**權重在 API 上線後兩週才開源**（預計 2026-08-22 左右），且開源前要先做安全評估與硬化。這和 Qwen3.8-Max「先發布再開源」的節奏類似，但 GLM 的開源授權是乾淨的 MIT，不像 Qwen 旗艦換成自訂條款。

## 架構：為什麼華為晶片訓得出前沿模型

### GLM 自迴歸填空架構

GLM 從一開始就不是標準的 left-to-right 語言模型，而是用**填空目標**（span corruption / blank infilling）統一理解與生成。這讓同一個模型既能做 cloze 式理解，也能做生成。2022 年的 GLM-130B 就是靠這個架構在 ICLR 上拿到關注，之後的 ChatGLM、GLM-5 都繼承了這條設計哲學。

### MoE：744B 裡每次只用 40B

GLM-5 是 744B 總參數的 MoE，每次推理只啟動 40B 活躍參數。這讓它在單台高階主機上就能服務前沿品質，同時把推論成本壓到閉源模型的 1/5–1/8。GLM-5.2/5.3 沿用同一個底座，所有能力躍進都來自後訓練，而非擴大模型。

### Slime RL：讓 Agent 會用工具

智譜的 agent 能力核心是 **Slime RL**——一個過程驗證（process verification）框架。它不只看最終答案對不對，而是逐步追蹤模型在 agent 循環中的工具呼叫是否正確。這讓 GLM-5-Turbo 的工具呼叫準確率達到 99.32%，是 agentic 場景的強選項。

### 華為昇騰：沒有 NVIDIA 也能訓

GLM-5 完全在**華為昇騰**晶片上訓練，沒用一張 NVIDIA GPU。這在地緣政治與供應鏈的脈絡下是個訊號：中國前沿模型的訓練基礎設施正在脫鉤。昇騰的訓練效率是否能長期跟上 NVIDIA 的迭代，仍是個開放問題，但 GLM-5 已經證明「非美系硬體也能訓出前沿模型」。

## GLM-5.3：怎麼選

GLM-5.3 是同一底座的後訓練升級，但智譜同時維持多個 SKU：

| 項目 | GLM-5.3（API）| GLM-5.2 | GLM-5.1 | GLM-5-Turbo |
|---|---|---|---|---|
| 底座 | 744B MoE（40B 活躍）| 同左 | 同左 | 同左（agent 優化）|
| Context | 1M | 1M | 1M | 1M |
| 定位 | 最強通用 + coding + 資安 | 上一代最強 | 長時間 agent | 高穩定 agent / 低成本 |
| 授權 | 商用 API | 商用 API | 商用 API | 商用 API |
| 開源權重 | MIT（兩週後釋出）| MIT（已釋出）| MIT（已釋出）| MIT（已釋出）|
| 定價 | ~$0.42 / $2.10 每 1M tokens（沿用 5.2）| 同左 | 同左 | 更低 |

定價為 GLM-5 世代商用 API 參考價，5.3 明確沿用 5.2 定價。

### 授權陷阱：MIT 是真開源，但前沿能力在 API 與時差

GLM 的開源授權是系列裡最乾淨的之一——**MIT**，比 Llama 4 的 Community License（7 億 MAU 條款）和 Qwen3.8-Max 的自訂條款都寬鬆。這點對需要授權確定性的部署是實質優勢。

但有兩個但書：

- **權重釋出時差**：GLM-5.3 的權重在 API 上線後約兩週才開源，且要先做安全硬化。想「今天用最新能力 + 自己掌握權重」做不到——要嘛用 API，要嘛等兩週。
- **資安能力的部署責任**：GLM-5.3 的 CyberGym 能力被用於實際程式碼庫掃描（據稱發現 2,436 個漏洞），這類能力一旦開源，雙面刃效應由部署方承擔。如果你的應用涉及紅隊 / 漏洞發掘，需自行評估合規風險。

### 效能位置

| 指標 | GLM-5.3 | 對照 |
|---|---|---|
| Artificial Analysis Intelligence Index | **60**（開源第一，並列）| 與 Kimi K3 並列開源第一；Claude Fable 5 / GPT-5.6 Sol 級別 |
| CyberGym | **84.5%** | Mythos 5 83.8% / GPT-5.6 Sol 83.6%（Z.ai 自報）|
| ExploitBench | 54.4% | Mythos 5 78% / GPT-5.6 Sol 76.5%（落後）|
| Terminal-Bench 3.0 | open-source SOTA | 開源模型第一 |
| Agents' Last Exam | open-source SOTA | 開源模型第一 |
| Z.ai Code Bench | 比 5.2 +50% | 內部基準 |

三個誠實的但書：CyberGym / ExploitBench 是 Z.ai 自報數字，待獨立複驗；在 ExploitBench 這種「往後段利用鏈」走深的指標上，GLM-5.3 仍明顯落後閉源旗艦；Intelligence Index 的 60 分與 Kimi K3 並列，但兩者都仍落後 Claude Fable 5 與 GPT-5.6 Sol 的綜合水位。

## 子線與生態系：一張表看懂 GLM 有多少模型

除了通用主線，智譜同時經營多條子線：

| 子線 | 代表模型 | 最新狀態（2026-08）|
|---|---|---|
| 通用主線 | GLM-4.5 → GLM-5 → 5.1 → 5.2 → 5.3 | MIT 開源 + 商用 API 雙軌 |
| 視覺語言 | GLM-4.5V / GLM-5V-Turbo | 原生多模態，視覺 agent 工作流 |
| 輕量 | GLM-4.7-Flash（免費層）/ GLM-4.6 | 寫作、翻譯、長文 |
| OCR | GLM-OCR | CogViT + GLM-0.5B 編碼器，跨模態對齊 |
| Agent 框架 | OpenClaw | 終端機式 coding agent，對應 GLM-5-Turbo |
| 商用 API | Z.ai / BigModel.cn / GLM Coding Plan | 點數制，離峰 50% 優惠 |

兩個趨勢：

**能力往主線收編。** 和 Qwen、DeepSeek 收編 Coder/Math 子線的劇本相同，智譜把專項能力併回 GLM 主線——視覺變成原生能力，coding 由主線旗艦承擔。這降低維護成本，也讓「一個底座打多場景」成為現實。

**開源授權始終寬鬆。** 不像 Qwen 旗艦轉自訂條款、Llama 4 用 Community License，GLM 的開源權重一路維持 MIT。這讓它在需要授權確定性的企業部署中特別有說服力——尤其是對地緣敏感、必須自架的場景。

## 跟競品的位置

把 GLM-5.3 放回 2026 年 8 月的開源格局：

- **對上 Kimi K3（2.8T 開放權重）**：兩家在 Intelligence Index 並列 60（開源第一）。K3 總參數更大（2.8T vs 744B），但 GLM 的 MIT 授權更乾淨，且中文與 agent 生態更成熟
- **對上 Qwen3.8-Max（2.4T）**：Qwen 尺寸光譜更廣（0.8B–2.4T），但 GLM 的 MIT 比 Qwen 旗艦的自訂條款確定性更高；兩家在開源榜首位置互有領先
- **對上 DeepSeek V4**：DeepSeek 的價格（$0.28/$0.42）與 MLA 成本結構更激進；GLM 的優勢是 agent 工具呼叫準確率（99.32%）與資安基準
- **對上 Claude / GPT 前沿**：GLM-5.3 在 CyberGym 局部超越，但綜合水位（SWE-bench、ExploitBench）仍落後，定價則便宜 7–10 倍

## 對 Agent 開發者的意義

- **複雜 coding agent** → GLM-5.3：Terminal-Bench 3.0 / Agents' Last Exam 開源 SOTA，Z.ai Code Bench 比 5.2 +50%
- **資安 / 漏洞掃描** → GLM-5.3：CyberGym 84.5% 開源第一，但需自評紅隊合規
- **高穩定工具呼叫** → GLM-5-Turbo：工具呼叫 99.32%，中文原生，適合長鏈 agent
- **需要 MIT 授權自架** → GLM 全系列開源權重掛 MIT，比 Llama 4 / Qwen 旗艦更乾淨
- **需要最便宜的 API** → DeepSeek V4 Flash 更便宜；GLM 的優勢在 agent 穩定性而非純價格
- **需要超長 context** → Kimi K3 的 1M context 與 2.8T 參數更大，但 GLM 的 1M lossless 已夠多數場景

## 整體來說

GLM 的故事是「學術實驗室長出的開源前沿」。從清華 KEG 的 GLM-130B，到今天完全在華為昇騰上訓出的 744B 開源旗艦，智譜走出了一條和矽谷不同的路——不是靠 NVIDIA 堆算力，而是靠架構（GLM 填空）、訓練框架（Slime RL）與授權（MIT）建立護城河。

2026 年 8 月的 GLM-5.3 是個轉折點：它證明**後訓練可以讓同一個底座的前沿能力大幅躍進**，而不必每次都擴大模型。CyberGym 84.5% 超過 Mythos 5 和 GPT-5.6 Sol，則讓「開源模型做資安」從口號變成可測的指標。

真正值得記住的是授權：在「開源」的光譜上，GLM 站在最乾淨的一端——MIT，可商用、可微調、可自架，沒有 MAU 條款也沒有自訂限制。對需要授權確定性的企業（特別是受地緣與合規約束的場景），GLM 目前是開源陣營裡最省心的選項之一。

---

## 參考資料

- [GLM-5.3: Frontier Coding with Emergent Cyber Capabilities — Z.ai Blog](https://z.ai/blog/glm-5.3)
- [Z.ai 模型發布說明（GLM-5.3）](https://docs.z.ai/release-notes/new-released)
- [Zhipu launches GLM-5.3 — South China Morning Post](https://www.scmp.com/tech/big-tech/article/3364077/zhipu-launches-flagship-model-glm-53-china-seeks-mythos-level-edge-cyber-defence)
- [Zhipu's GLM-5.3 API Goes Live — Gate News](https://www.gate.com/news/detail/zhipus-glm-53-api-goes-live-tying-kimi-k3-for-the-top-spot-among-open-23548151)
- [GLM-5 技術報告](https://arxiv.org/html/2602.15763v1)
- [ChatGLM 模型家族論文](https://arxiv.org/abs/2406.12793)
- [GLM-5 Hugging Face](https://huggingface.co/zai-org/GLM-5)
- [Z.ai 官方網站](https://www.zhipuai.cn/en)
- [BigModel.cn API 平台](https://bigmodel.cn/)
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站
