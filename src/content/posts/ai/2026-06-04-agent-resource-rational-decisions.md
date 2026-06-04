---
title: "Agent 的資源理性：在 token、工具呼叫、延遲之間做最優決策"
date: 2026-06-04
category: ai
type: deep-dive
tags: [ai-agent, reasoning, test-time-compute, llm, cost-optimization]
lang: zh-TW
tldr: "資源受限下的 agent 決策是 bounded rationality 的復活：Rational Metareasoning 用 VOC 獎勵省 20–37% token、BATS 證明沒有 budget awareness 加預算也沒用、FrugalGPT cascade 最高省 98% 成本、Speculative Actions 降 20% 延遲。三約束最後收斂成一條 Pareto 曲線，主線是「從人手調旋鈕走向模型自己做資源理性決策」。"
description: "從 metareasoning、compute-optimal scaling 到 budget-aware planning，整理 LLM agent 在 token、tool call、latency 三重約束下做最優決策的理論框架與工程手法：BATS、FrugalGPT、RouteLLM、Speculative Actions、Probe&Prefill。"
draft: false
---

Agent 每一步都在花三種資源：思考燒 token、查資料燒 tool call、串行迴圈燒時間。「最優決策」聽起來抽象，其實就是在每一步問：**再多花一點資源——多想一步、多呼叫一次工具、換更貴的模型——帶來的期望品質提升，值不值得它的邊際成本？** 這不是新問題，而是 AI 經典的 **bounded rationality（資源理性）** 在 LLM agent 上的復活。這篇把理論根基和工程落地各走一遍，最後收斂到一張 Pareto 圖。

## 理論根基：metareasoning——「要不要繼續算」本身是一個決策

經典淵源來自 Russell & Wefald 的 bounded optimality 與 Horvitz 的 value of computation（VOC）：計算本身有成本，理性主體應該把「是否多算一步」當成一個有期望價值的決策，而不是無腦算到底。

把這套認知科學框架搬到 LLM 的代表作是 **Rational Metareasoning for LLMs**（arXiv:2410.05563，Griffiths 團隊）：設計一個含 VOC 的獎勵函數，**懲罰不必要的推理步驟**，用 Expert Iteration 訓練。結果是**比 few-shot CoT / STaR 少 20–37% 生成 token，且任務表現維持**。這是「何時該停止思考」目前最乾淨、有認知科學根據的答案。

反面教材也已成顯學：**overthinking**。多篇 survey（arXiv:2503.16419、2507.02076）指出「想更久」不一定更準，反而燒 token——最優 agent 缺的不是能力，是「知道何時停」的後設判斷。

## 該花多少算力思考：compute-optimal scaling

Snell 等人的地標論文 **Scaling LLM Test-Time Compute Optimally**（arXiv:2408.03314）給出核心發現：**最優策略取決於題目難度**。依每題難度自適應分配算力的 compute-optimal scaling，比 best-of-N **效率高 4 倍以上**；在 FLOPs 對齊下，**小模型加 test-time compute 可以贏過大 14 倍的模型**（前提是小模型本來就有非平凡成功率）。

放大算力的機制有兩個反覆出現的軸：**width（並行）**——parallel sampling、best-of-N、多數投票；**depth（串行）**——sequential revision、self-refine。這兩個旋鈕後面會再出現：它們直接決定延遲。

## 把資源當顯式約束：budget-aware planning

Google 的 **BATS（Budget-Aware Tool-Use Enables Effective Agent Scaling**，arXiv:2511.17006）是這條線的拱心石，自稱首個 budget-constrained agent 的系統性研究。它的**關鍵負面發現**值得先記住：**單純給 agent 更大的 tool-call 預算，不會提升表現**——因為 agent 缺乏「budget awareness」，很快撞到天花板。

解法分兩層：一是 **Budget Tracker**，輕量 plug-in 持續把「剩餘預算」餵回 agent；二是 BATS 框架本身——依剩餘資源動態決定「**dig deeper**（深挖有希望的線索）vs **pivot**（換路徑）」。它還把 token 消耗與 tool 消耗**合成單一成本指標**，系統性研究 cost-performance，推進 Pareto frontier。

同方向的還有 control-token 路線：BudgetThinker（arXiv:2508.17196）週期性插入特殊 token 告知剩餘預算；SelfBudgeter（arXiv:2505.11274）讓模型先**估計**完成所需的最小 token 預算。形式化地基則是 Constrained MDP——「在成本約束下最大化獎勵」的標準 RL 框架。

## 工程層一：token 預算管理

Anthropic 在 [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) 把 context engineering 定義為「在 LLM 推理時，策畫並維持那組最優 token」——context window 是**要主動管理的預算**，不是塞愈多愈好。手法是 compaction、摘要、只留必要資訊。

值得注意的演進：Claude API 早期可用 `thinking.budget_tokens` 顯式設定思考預算，但到了 Opus 4.7 / 4.8，官方文件已改為 **adaptive thinking——不再支援手動 extended thinking budget，由模型自行決定思考量**。這其實就是 metareasoning 的「自己決定何時停」被產品化：VOC 判斷內化進模型。

## 工程層二：tool-call 經濟學與 router / cascade

**模型級聯（cascade）的邏輯是「先便宜後貴，夠好就停」**。開山之作 FrugalGPT（arXiv:2305.05176）把 LLM 從便宜到貴排成 cascade，依序查詢直到回答夠可靠才停——**匹配 GPT-4 表現的同時最高省 98% 成本**。RouteLLM（arXiv:2406.18665）則用偏好資料學一個 router，把 query 分派到強模型或弱模型。Anthropic 在 [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) 的對應 pattern 也是 routing：簡單問題給 Haiku，困難問題給 Sonnet / Opus。

**減少冗餘 tool call** 有個反直覺的發現：「LLM Agents Already Know When to Call Tools」（arXiv:2605.09252）證明**「該不該呼叫工具」可以從模型生成前的 hidden state 線性解碼出來，AUROC 0.89–0.96**——比模型自己「講出來的推理」還準。意思是模型其實已經知道何時該叫工具，只是生成時沒照做。據此提出的 Probe&Prefill（輕量線性 probe + prefill 引導語）**減少 48% tool call、準確率僅掉 1.7%**，對照最佳 baseline 同準確率下只省 6%。

並行也不是免費的。Anthropic 在 [multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) 的文章中自承多 agent 架構**燒掉遠多於單次對話的 token**——成本是真實 trade-off，不是免費加速。

## 工程層三：延遲約束與推測執行

**串行依賴是延遲的頭號敵人**：reasoning → tool → reasoning 的交錯迴圈在單一 request 內無法並行。被 HPCA-32 2026 接受的 **The Cost of Dynamic Reasoning**（arXiv:2506.04301）是首個 agent 系統級成本分析，量化結論是：agent 加算力雖提升準確率，但很快遭遇**報酬快速遞減、延遲變異擴大、基建成本不可持續**——「燒資源換準確率不是線性」最有力的系統級證據。

借鏡 CPU 分支預測的 **Speculative Actions**（arXiv:2510.04371）給出 lossless 的解法：用快模型預測未來動作並**並行預執行，預測命中才 commit**。實測 next-action 預測準確率最高 55%，**延遲降最高 20%**，並形式化「推測寬度 vs 省時」的取捨，支援 selective branch launching 避免成本暴增。

## 三約束的耦合：最後是一條 Pareto 曲線

把問題寫成約束最佳化：`最大化任務效用 s.t. token ≤ B_tok, tool_calls ≤ B_tool, latency ≤ L`。關鍵洞察是**三約束耦合但不等價**：

```
        成本維度（fungible，可折成錢）
   token ◄──────────► tool call
      \                 /
       \   α·tok + β·tool
        \             /
         ▼           ▼
      ── Pareto frontier ──
              ▲
              │ 可用「多並行/多token」換「少時間」
              ▼
        latency（牆鐘時間，由串行深度決定）
```

token 與 tool call 同屬「成本」，可以折進同一個錢的維度；latency 是牆鐘時間，主要由**串行深度**決定，可以用「多花 token、多開並行」去換——所以它與成本維度**部分正交**。三者一起沒有單一最優點，只有「給定偏好權重下的最優」。

## 整體來說

不管理論或工程，繞不開三個設計支柱：

1. **對難度自適應**——別均勻灑算力（Snell 的 compute-optimal）。
2. **預算自覺**——模型必須知道「還剩多少」才會收斂（BATS、BudgetThinker、SelfBudgeter）。
3. **以信心 / 驗證當停止訊號**——VOC、verifier、cascade 的「夠好就停」。

適用邊界也要誠實：這套 budget-aware / 多 agent / test-time compute 的機制，適合開放式、難度高、可驗證、子任務可並行的任務（coding、deep research、web 搜尋）。簡單任務不適合——Anthropic 明說「多數情況下，優化單次 LLM call + retrieval + in-context examples 就夠了」，複雜度只在確實改善結果時才加。未解的坑：VOC 很難準確估計（停太早 vs 想太久）、信心校準不可靠會讓 cascade 的閘門誤判、並行會製造冗餘 tool call。

「最優」從來不是一個點，而是一條 Pareto 曲線。從 2024 年 Snell 的 compute-optimal、到 2025 年 BATS 的統一成本指標、再到 2026 年 Anthropic 把 thinking budget 收進 adaptive thinking 由模型自決——三年的主線就是：**從人手調旋鈕，走向模型自己做資源理性決策**。

## 參考資料

- [Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters（arXiv:2408.03314）](https://arxiv.org/abs/2408.03314)
- [Rational Metareasoning for Large Language Models（arXiv:2410.05563）](https://arxiv.org/abs/2410.05563)
- [Budget-Aware Tool-Use Enables Effective Agent Scaling / BATS（arXiv:2511.17006）](https://arxiv.org/abs/2511.17006)
- [FrugalGPT（arXiv:2305.05176）](https://arxiv.org/abs/2305.05176)
- [RouteLLM（arXiv:2406.18665）](https://arxiv.org/abs/2406.18665)
- [Speculative Actions（arXiv:2510.04371)](https://arxiv.org/abs/2510.04371)
- [The Cost of Dynamic Reasoning（arXiv:2506.04301，HPCA-32 2026）](https://arxiv.org/abs/2506.04301)
- [LLM Agents Already Know When to Call Tools（arXiv:2605.09252）](https://arxiv.org/abs/2605.09252)
- [A Survey on Efficient Reasoning for LLMs（arXiv:2503.16419）](https://arxiv.org/abs/2503.16419)
- [BudgetThinker（arXiv:2508.17196）](https://arxiv.org/abs/2508.17196)
- [SelfBudgeter（arXiv:2505.11274）](https://arxiv.org/abs/2505.11274)
- [Anthropic：Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)
- [Anthropic：Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Anthropic：How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Anthropic Docs：Building with extended thinking](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking)
