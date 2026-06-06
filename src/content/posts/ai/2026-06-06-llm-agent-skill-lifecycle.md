---
title: "LLM Agent 的技能管理革命：從 Voyager 到 MUSE-Autoskill 的 Skill Lifecycle 全景"
date: 2026-06-06
category: ai
type: deep-dive
tags: [agent-skills, ai-agent, llm, self-refinement, memory, arxiv, paper-review]
lang: zh-TW
tldr: "MUSE-Autoskill（2026）提出五階段 skill 生命週期框架，自創 skill 在 SkillsBench 達 60.35%（+7.16%），成功生成 skill 的任務上更達 87.94%，超越人工撰寫上限。本文整合六篇 arXiv 論文，梳理 skill evolution 研究全景。"
description: "整合 MUSE-Autoskill、Voyager、EvoSkill、SkillOS、Skill1、SkillRet 六篇論文，解析 LLM agent skill 從一次性輸出走向完整生命週期管理的研究脈絡與設計差異。"
---

LLM agent 靠「skill」解決複雜任務——可重用的 workflow、程式碼、或 prompt 組合。問題是，大多數系統把 skill 當成一次性產出物：生成完就靜止不動，沒有驗證、沒有精進、沒有跨任務記憶。2026 年 5 月，ByteDance ByteBrain 團隊發表 [MUSE-Autoskill](https://arxiv.org/abs/2605.27366)（arXiv:2605.27366），明確把這個缺口定義為「Skill Lifecycle」問題，提出完整的五階段框架。同月前後，還有四到五篇論文從不同角度攻同一塊——形成了這個領域近年最密集的一次論文爆發。

## 問題的根源：Skill 為什麼一直是靜態的？

[Voyager](https://arxiv.org/abs/2305.16291)（arXiv:2305.16291，NVIDIA / CMU，2023）是現代 skill library 概念的起點。在 Minecraft 環境下，它用三個組件組成閉環：自動規劃探索目標的 curriculum、儲存可執行程式碼的 skill library、以及整合環境回饋的 iterative prompting。依 Voyager 論文報告，相較之前的 SOTA，它取得了 3.3× 更多 unique items、15.3× 更快的科技樹解鎖速度、2.3× 更長的移動距離。

但 Voyager 的 skill library 有個根本設計限制：skill 生成後就固定了。沒有 unit test，沒有失敗後的自動精進，也沒有跨任務積累的使用記憶。這在 Minecraft 這種封閉環境下問題不大，但放到真實世界任務就吃力。

MUSE-Autoskill 的論文把問題拆成三個 gap：

- **Reliability gap**：skill 未經系統性驗證就投入使用
- **Reusability gap**：跨任務重用機制付之闕如  
- **Evolution gap**：沒有持續精進機制，技術債越積越多

## MUSE-Autoskill：五階段 Skill Lifecycle

**論文**：[arXiv:2605.27366](https://arxiv.org/abs/2605.27366) | 作者：Huawei Lin, Peng Li, Jie Song, Fuxin Jiang, Tieying Zhang（ByteDance Inc. + Rochester Institute of Technology）

MUSE-Autoskill 的核心主張是：skill 應該被當成「長效資產」而不是「一次性輸出」。論文識別出五個任何實用 skill-centric agent 都必須處理的階段：

**Creation**：agent 在 runtime 中遇到新任務時按需生成 skill。每個 skill 是一個結構化目錄，包含 `SKILL.md`（介面定義）、`scripts/`（可執行程式碼）、`tests/`（unit tests）、以及選填的 `resources/` 和 `references/`。

**Memory**：三層記憶體設計是 MUSE 最具特色的地方。除了傳統的 short-term 和 long-term memory，它引入了 **skill-level memory**——每個 skill 有自己的 `.memory.md`，跨任務 append 使用觀察（已知 failure mode、input 格式限制、performance caveats）。這個檔案刻意設計成 transfer 時不帶走，因為使用經驗是 per-agent 的。

**Management**：task 開始時，skill catalog 以 progressive disclosure 方式注入：先只看 name + description（約 5–10K tokens），agent 決定需要才讀入完整 SKILL.md。管理機制包含自動去重（高度重疊的 skill 合併為更通用版本）和 pruning（長期未使用或持續失敗的 skill 移除）。

**Evaluation**：skill 生成後必須通過 `tests/` 目錄下的 unit tests 才能進入 Skill Bank。這是與 Voyager 最大的設計差異——不是生成完就用，而是先驗後存。

**Refinement**：測試失敗時，系統自動檢查 error trace 後呼叫 `update_skill` 修補 skill package，再重新執行測試，形成 create → evaluate → refine → register 閉環。

### 實驗結果

Benchmark 是 [SkillsBench](https://arxiv.org/abs/2602.12670)（arXiv:2602.12670）的 51 個 Docker 評估真實世界任務，涵蓋 Science & Engineering、Data Analysis、Document Processing、Ops & Planning 四個領域。Backbone 全部使用 GPT-5.5。

| 配置 | Accuracy (51 tasks) |
|------|---------------------|
| 無 skill 基準 | 53.19% |
| 人工撰寫 skill（參考上限） | 68.40% |
| MUSE 自創 skill | **60.35%** (+7.16 pp) |
| 成功生成 skill 的 35 tasks | **87.94%**（超越人工上限） |

51 個任務中 35 個（68.6%）成功自動生成 skill。整體 60.35% 低於人工 skill 的原因是 16 個 Phase 1 完全失敗的任務貢獻 0%。但在生成成功的 35 個任務上，87.94% 反而**超越人工上限**——代表 agent 理解任務的方式在某些情況下比人工撰寫更全面。

跨 agent 遷移實驗（將 MUSE 生成的 skill 注入另一個 agent Hermes）也確認了 skill 的可遷移性：Hermes 使用這些 skill 達到 58.40%，與 Hermes 使用人工 skill（61.21%）的差距縮小了 79%，且與 MUSE 自身使用相同 skill（60.35%）只差 1.95 pp。

成本方面，生成一個 skill 約需 383K tokens / 164 秒（約一次無 skill run 的 2/3），使用生成的 skill 反而比用人工 skill **更省**——MUSE 節省 20% tokens、37% latency；Hermes 節省 48% tokens、30% latency。Break-even 約 3 次重用後。

## EvoSkill：從失敗中自動發現 Skill

**論文**：[arXiv:2603.02766](https://arxiv.org/abs/2603.02766) | 作者：Alzubi et al.（Sentient / Virginia Tech）

EvoSkill（2026 年 3 月）採取不同角度切入：不是在成功後蒸餾 skill，而是從**失敗中**識別缺口。架構是三個協作 agent：

- **Executor**：執行任務，使用現有 skill
- **Proposer**：分析失敗 trace，識別缺失的能力
- **Skill-Builder**：把 Proposer 的建議具現化為結構化 skill folder（SKILL.md + trigger metadata + 輔助腳本）

篩選機制是 Pareto frontier 選取：只有在驗證集上確實提升表現的 skill 才保留。

依 EvoSkill 論文報告，改善幅度為 OfficeQA +7.3%、SealQA +12.1%。更值得注意的是零樣本遷移結果：在 SealQA 上演化出來的 skill（「search-persistence-protocol」）直接移植到 BrowseComp，準確率從 43.5% 提升至 48.8%（+5.3%），且未做任何修改。EvoSkill 論文的解釋是：在 skill 抽象層級優化，而不是在 prompt 或程式碼層級，產出的改進更具可遷移性。

與 MUSE-Autoskill 的差異：EvoSkill 覆蓋 creation + evaluation，但沒有系統性的 memory 機制和完整的 lifecycle 框架。

## SkillOS：用 RL 學習長程 Curation 策略

**論文**：[arXiv:2605.06614](https://arxiv.org/abs/2605.06614) | 作者：Ouyang et al.（2026 年 5 月）

SkillOS 提出的問題更根本：現有方法手工或啟發式設計 skill 操作規則，這些規則無法從間接、延遲的回饋中學習複雜的長程 curation 策略。

架構上，SkillOS 把 agent 分成兩個部分：frozen Agent Executor（不訓練，負責執行任務）+ trainable Skill Curator（用 RL 訓練，負責決定什麼時候新增、修改、刪除 skill）。Curator 從 task outcome 信號學習，但由於信號是延遲且間接的，如何讓它學會「先存一個現在沒用但以後有用的 skill」這種長程判斷，是 SkillOS 的核心貢獻。

測試 benchmark 是 AIME24、AIME25（數學推理）和 GPQA-Diamond（graduate-level 生物/物理/化學）。

與 MUSE-Autoskill 的差異：SkillOS 強調學習「何時如何操作 skill」的 curation policy，是 RL 訓練框架；MUSE-Autoskill 是 training-free，強調五階段 lifecycle 的系統性設計。

## Skill1：單一 RL 信號驅動三種 Skill 能力

**論文**：[arXiv:2605.06130](https://arxiv.org/abs/2605.06130) | 作者：Shi et al.（2026 年 5 月）

Skill1 識別出現有 skill 框架的另一個問題：skill selection、skill utilization、skill distillation 三種能力通常分開優化，有時甚至用不同的訓練訊號，導致 partial 和 conflicting evolution。

Skill1 的核心洞見：task-outcome 信號的**低頻趨勢**可以歸功於 selection（選對 skill 影響長期表現），**高頻變動**可以歸功於 distillation（蒸餾品質影響單次任務的波動）。一個信號拆兩個 credit，就能同時訓練三種能力。

依 Skill1 論文，在 ALFWorld 和 WebShop 上超越所有 prior skill-based + RL baselines。ALFWorld 各子任務（Pick、Look、Clean、Heat、Cool、Pick2）的 success rate 全面提升，其中 Avg. 達到 70%+ 水準。

與 MUSE-Autoskill 的差異：Skill1 是純 RL 訓練框架，需要大量任務訓練；MUSE-Autoskill training-free，更適合 zero-shot 場景。

## SkillRet：Skill 擷取是被忽視的瓶頸

**論文**：[arXiv:2605.05726](https://arxiv.org/abs/2605.05726) | 作者：Cho et al.（2026 年 5 月）

SkillRet 的貢獻不是新方法，而是暴露了一個被系統性忽視的問題：skill 擷取（retrieval）有多難？

建立大規模 benchmark：17,810 個公開 agent skill、63,000+ 評估樣本，按 skill 類型分層（Data & ML、Information Retrieval 等）。測試結論很直接：MTEB 排行榜頂尖的通用 retriever 在 skill retrieval 上表現意外差勁。針對性 fine-tune 後，NDCG@10 從原本水準提升至 83.5，提升幅度高達 16.9 points。

這個結果對 MUSE-Autoskill 有直接的實際含義：MUSE 的 management 階段依賴準確的 skill 選取，如果 retrieval 品質差，再好的 lifecycle 設計也會失效。SkillRet 提供的 fine-tuned 模型可以作為 MUSE 類系統的 retrieval backbone。

## 橫向比較

| 論文 | 核心關注 | 需要訓練？ | Lifecycle 覆蓋 | Evaluation 機制 |
|------|----------|-----------|----------------|----------------|
| [Voyager](https://arxiv.org/abs/2305.16291) | Skill accumulation（Minecraft） | ✗ | Creation / Memory | 無顯式 |
| [EvoSkill](https://arxiv.org/abs/2603.02766) | Failure-driven skill discovery | ✗ | Creation / Evaluation | Validation set 篩選 |
| **[MUSE-Autoskill](https://arxiv.org/abs/2605.27366)** | **完整 skill lifecycle** | **✗** | **全五階段** | **Unit test + runtime feedback** |
| [SkillOS](https://arxiv.org/abs/2605.06614) | Skill curation policy 學習 | ✓ RL | Management / Evaluation | Task outcome（RL reward） |
| [Skill1](https://arxiv.org/abs/2605.06130) | 三種 skill 能力統一訓練 | ✓ RL | Distillation / Utilization | Task outcome（RL reward） |
| [SkillRet](https://arxiv.org/abs/2605.05726) | Skill retrieval benchmark | ✓ fine-tune | Management（retrieval） | NDCG@10 |

## 整體來說

2026 年這批論文確立了一個共識：skill 不是一次性輸出，而是需要系統性管理的長效資產。但各論文攻的是不同層面：

**Training-free 方向**（Voyager、EvoSkill、MUSE-Autoskill）強調不需要 RL 訓練，skill 從執行軌跡蒸餾、驗證、精進。MUSE-Autoskill 是這條路線目前最完整的系統。

**RL-based 方向**（SkillOS、Skill1）強調從 task outcome 學習，skill 管理策略本身也可以被優化。代價是需要大量任務互動，且訓練出的模型通常與特定任務分佈綁定。

**仍然開放的挑戰**：

- **Skill conflict**：多個 skill 同時適用時如何協調？EvoSkill 明確把這列為 future work
- **Scale 問題**：SkillRet 的 17k+ skill 顯示，隨著 skill 庫成長，retrieval 品質會成為最大瓶頸
- **評估標準分散**：Voyager 用 Minecraft、EvoSkill 用 OfficeQA/SealQA、MUSE 用 SkillsBench、SkillOS 用 AIME/GPQA。沒有共用 benchmark，橫向比較幾乎不可能
- **跨模型可遷移性**：MUSE 的 cross-agent transfer 實驗是個開始，但跨 LLM 版本（GPT-5.5 → GPT-4o 等）的遷移穩健性仍待驗證

如果你在設計 agent 系統，短期最實用的組合是：用 MUSE-Autoskill 或 EvoSkill 的 training-free 方案建立初始 skill library，配合 SkillRet 的 fine-tuned retriever 做 skill 選取，等 skill 庫穩定後再考慮引入 RL-based curation。

## 參考資料

- [MUSE-Autoskill: Self-Evolving Agents via Skill Creation, Memory, Management, and Evaluation](https://arxiv.org/abs/2605.27366)
- [Voyager: An Open-Ended Embodied Agent with Large Language Models](https://arxiv.org/abs/2305.16291)
- [EvoSkill: Automated Skill Discovery for Multi-Agent Systems](https://arxiv.org/abs/2603.02766)
- [SkillOS: Learning Skill Curation for Self-Evolving Agents](https://arxiv.org/abs/2605.06614)
- [Skill1: Unified Evolution of Skill-Augmented Agents via Reinforcement Learning](https://arxiv.org/abs/2605.06130)
- [SkillRet: A Large-Scale Benchmark for Skill Retrieval in LLM Agents](https://arxiv.org/abs/2605.05726)
- [SkillsBench (arXiv:2602.12670)](https://arxiv.org/abs/2602.12670)
