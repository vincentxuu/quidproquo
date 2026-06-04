---
title: "別再手工調 prompt：從 GEPA 到 tool description，agent 行為的自動最佳化"
date: 2026-06-04
category: ai
type: deep-dive
tags: [prompt-engineering, tool-use, ai-agent, llm, optimization]
lang: zh-TW
tldr: "自動 prompt 優化（APO）從 APE/OPRO 演進到 GEPA：用語言反思取代稀疏 reward，少 4–35 倍 rollouts 贏過 GRPO 約 6pp。另一邊，tool description 是被忽略的 prompt——小改措辭能讓工具選用率變 10 倍，Anthropic 實測讓 Claude 自我改寫 tool description 勝過人類專家手寫。兩條線正在合流：eval-driven 的自動優化吃掉手工調 prompt。"
description: "整理自動 prompt 優化的四個演算法家族（APE/OPRO、ProTeGi/TextGrad、DSPy MIPROv2、GEPA），GEPA 為何用語言反思贏過 RL，以及 tool description 措辭如何系統性影響 agent 行為：selection scope、10× 選用率脆弱性、Anthropic 的自動改寫流程與撰寫 checklist。"
draft: false
glossary:
  - term: "GEPA"
    definition: "2025 年提出的自動 prompt 優化演算法，用語言反思（讀執行軌跡寫改進建議）加遺傳演化取代稀疏 reward，樣本效率比 RL 方法高 4–35 倍。"
    context: "本文把 GEPA 當成 APO 演進的轉折點。"
  - term: "Pareto frontier"
    aliases: ["Pareto 前沿"]
    definition: "多目標優化中「沒有任何一個解能在所有目標上同時更好」的解集合；保留整個前沿而非單一最佳解，可以維持候選多樣性、避免提早收斂。"
    context: "GEPA 用 Pareto frontier 保留在不同題目上各有所長的候選 prompt。"
---

你花三天手調 prompt，成功率從 55% 變 58%，還說不出是哪句話起了作用——這就是手工 prompt engineering 不 scale 的現實。這篇整理兩條正在合流的線：**自動 prompt 優化（APO）**把 prompt engineering 變成有 metric 的最佳化問題；**tool description 措辭**則是 agent 時代被忽略的 prompt——而後者正在被前者的技術吃掉。

## 把 prompt 當參數：APO 的統一框架

2025 年起已有至少三篇系統性 survey（arXiv:2502.16923 收錄於 EMNLP 2025、arXiv:2502.18746 等）把 APO 形式化為最佳化問題，三個組件：**搜尋空間**（候選 prompt / 指令 / few-shot 範例）、**目標函數**（在 eval set 上的可量化分數）、**更新方向**（怎麼從目前的 prompt 走到更好的）。所有方法的差別只在「更新方向怎麼來」，據此分四個家族：

| 家族 | 代表 | 機制 | 取捨 |
|---|---|---|---|
| 採樣 / 座標式 | APE（2023）、OPRO（2023） | optimizer LLM 直接生成候選 prompt，看分數迭代 | 簡單通用，但靠盲試、樣本效率低 |
| 文字梯度式 | ProTeGi、TextGrad（2024） | LLM 反思失敗案例 → 產生自然語言「梯度」→ 定向編輯 | 有方向性，但反思品質決定一切 |
| 編譯 / 結構式 | DSPy（MIPROv2） | 把 prompt 當 program 的可學參數，同時最佳化 instruction + 範例，Bayesian search | 適合多階段 pipeline，需要 metric 與 trainset |
| 反思式演化 | GEPA（2025） | 反思 + 遺傳演化 + 保留 Pareto frontier | 樣本效率極高，2026 當紅 |

開山的兩篇值得記數字：OPRO（ICLR 2024）讓 optimizer LLM 看「過去解 + 分數」生成新 prompt，比人寫 prompt 在 GSM8K 高 8%、BBH 最高高 50%。APE（ICLR 2023）把指令當「程式」，LLM 生成候選指令池再用 score function 選最佳。MIPROv2（arXiv:2406.11695）則是 DSPy 的主力 optimizer——對多階段 LM program 同時最佳化 instruction 與 few-shot 範例，不需要 module 級標註或梯度。

## GEPA 為什麼是轉折點

GEPA（**G**enetic-**Pa**reto，arXiv:2507.19457，ICLR 2026 Oral）的核心洞見是對 RL 的批判：GRPO 這類方法把整段 agent 執行軌跡壓成一個稀疏的 scalar reward，丟掉了大量資訊。GEPA 主張**語言本身就是更豐富的學習訊號**——讓 LLM 讀自己的 reasoning、tool call、tool output 軌跡，用自然語言診斷哪裡錯、提出並測試修正。

第二個設計是 **Pareto frontier**:不返回單一最佳 prompt，而是保留一組在不同子目標上互補的 prompt，避免過早收斂到局部最佳。

數字（以 arXiv v2 / OpenReview 最終版為準）：六個任務上平均贏 GRPO 約 6 個百分點、最高約 19 個百分點，**rollouts 少 4–35 倍**；對 MIPROv2 則高出超過 10 個百分點。對「呼叫昂貴 API、eval 預算有限」的 production agent 團隊，這代表 GEPA 比 RL 實際可行——不用 GPU、不用上萬次採樣，用反思迭代就能逼近甚至超過。

但別忽略門檻：**APO 本質上需要可量化的 metric 加 eval set**，這是最大成本。沒有標註資料時的實務解法：用 LLM-as-judge 當 verifier（注意別讓過嚴的 verifier 因格式、標點誤殺正確答案）、保留 held-out test set 防止 overfit、從真實使用情境生成 eval 任務而非過於簡單的 sandbox。

## Tool description：被忽略的 prompt

換到第二條線。Tool 定義（name + description + schema）**會被載入 agent 的 context**，所以 description 字面上就是 prompt 的一部分。Agent 是非確定性的——同一個 query 可能呼叫工具、直接回答或反問，description 的寫法大幅影響這個機率分布。

Anthropic 在 [Writing effective tools for AI agents](https://www.anthropic.com/engineering/writing-tools-for-agents) 直說 tool description 是「提升工具表現最有效的方法之一」，並透露 Claude Sonnet 3.5 拿下 SWE-bench Verified SOTA 的關鍵動作之一就是精修 tool description（Anthropic 內部 eval 結果，學術界尚無公開複現）。

實證研究把「措辭有多大槓桿」量化得更嚇人：

- **選用率可以差 10 倍**。arXiv:2505.18135 跨 17 個模型驗證：編輯 tool description 能讓 GPT-4.1、Qwen2.5-7B 對特定工具的選用率增加超過 10 倍——這既是優化槓桿，也是可被「tool SEO」惡意操弄的資安風險。
- **最關鍵的描述成分是 selection scope**。arXiv:2602.20426 指出，影響 tool selection 最大的是「何時用、何時不用、跟相似工具的差異」與 parameter constraints——而現實中原始描述對這兩類的覆蓋率不到 12%。
- **描述品質普遍很差**。arXiv:2602.14878 掃了 103 個 MCP server、856 個工具，發現描述普遍有品質「smells」；自動補全描述能提升 agent 表現，但會增加 token 開銷——語意完整與 token 效率無法同時最大化，要找最小有效描述集。
- **工具越多選得越差**：overlapping 功能、相似命名造成混淆，加上 lost-in-the-middle 與 parameter hallucination。

落地 checklist（Anthropic [define tools 文件](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)加上述論文的歸納）：每個 tool 描述**至少 3–4 句**；必寫做什麼、**何時用 / 何時不用**、每個參數的意義與影響、重要 caveat；像跟新同事介紹工具一樣把隱性 context 講明白；用 namespacing（`asana_search`、`jira_search`）劃邊界；參數無歧義命名（`user` → `user_id`）；連錯誤訊息都要 prompt-engineer——給可行動的修正建議，不要丟 raw traceback。更完整的措辭規則，站內有一篇 [LLM tool description 硬規則](/posts/tech/2026-05-18-llm-tool-description-hard-rules)。

## 兩條線合流：自動優化 tool description

既然 tool description 就是 prompt，APO 的整套技術可以直接套上來。Anthropic 的做法是教科書式的 eval-driven 流程：

1. 建 eval（真實任務 + verifier）
2. 跑 agentic loop 收集 transcript
3. 把 transcript 餵給 Claude Code，讓它分析失敗模式並**自己改寫 tool description**
4. 用 held-out test set 驗證

結果：**Claude 自我優化版勝過人類專家手寫版**（內部 Slack / Asana 工具 eval；同樣標註為單一官方源）。學術界的對應工作——arXiv:2602.20426 的「learning to rewrite tool descriptions」、2602.14878 的自動補全 description smells——都是同一個思路。

## 整體來說

何時值得投資自動化：pipeline 穩定、有明確 metric、要長期維運、prompt 會被反覆改——投 DSPy / GEPA 划算。何時別碰：一次性任務、metric 難定義、prompt 改一次就不動——手工更快。隱藏成本有三個：建 eval set 的人力（真正的門檻）、optimizer 燒的 token、以及 optimized prompt 的可讀性下降（難 debug）。

一句話收尾：prompt engineering 正在從「寫作技巧」變成「最佳化工程」——而 eval set 是新的護城河，誰的 eval 貼近真實使用，誰的自動優化才有意義。

## 參考資料

- [GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning（arXiv:2507.19457）](https://arxiv.org/abs/2507.19457)
- [GEPA GitHub](https://github.com/gepa-ai/gepa)
- [OPRO: Large Language Models as Optimizers（arXiv:2309.03409）](https://arxiv.org/abs/2309.03409)
- [APE: Large Language Models Are Human-Level Prompt Engineers（arXiv:2211.01910）](https://arxiv.org/abs/2211.01910)
- [MIPROv2 / Optimizing Instructions and Demonstrations for Multi-Stage LM Programs（arXiv:2406.11695）](https://arxiv.org/abs/2406.11695)
- [TextGrad（arXiv:2406.07496）](https://arxiv.org/abs/2406.07496)
- [A Systematic Survey of Automatic Prompt Optimization Techniques（arXiv:2502.16923）](https://arxiv.org/abs/2502.16923)
- [A Survey of Automatic Prompt Optimization（arXiv:2502.18746）](https://arxiv.org/abs/2502.18746)
- [Tool Preferences in Agentic LLMs are Unreliable（arXiv:2505.18135）](https://arxiv.org/abs/2505.18135)
- [Learning to Rewrite Tool Descriptions（arXiv:2602.20426）](https://arxiv.org/abs/2602.20426)
- [MCP Tool Descriptions Are Smelly（arXiv:2602.14878）](https://arxiv.org/abs/2602.14878)
- [Anthropic — Writing effective tools for AI agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
- [Anthropic Docs — Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)
- [DSPy](https://dspy.ai/)
