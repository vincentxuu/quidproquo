---
title: "The Skill Management Revolution for LLM Agents: A Complete Landscape of Skill Lifecycle from Voyager to MUSE-Autoskill"
date: 2026-06-06
category: ai
type: deep-dive
tags: [agent-skills, ai-agent, llm, self-refinement, memory, arxiv, paper-review]
lang: en
tldr: "MUSE-Autoskill (2026) introduces a five-stage skill lifecycle framework. Self-created skills achieve 60.35% (+7.16%) on SkillsBench overall, and an impressive 87.94% on tasks where skill generation succeeds — surpassing the human-authored skill ceiling. This post synthesizes six arXiv papers to map the full landscape of skill evolution research."
description: "A synthesis of six papers — MUSE-Autoskill, Voyager, EvoSkill, SkillOS, Skill1, and SkillRet — tracing how LLM agent skills are evolving from one-shot outputs into full lifecycle management, with an analysis of their design tradeoffs."
---

🌏 [中文版](/posts/ai/2026-06-06-llm-agent-skill-lifecycle)

LLM agents rely on "skills" to tackle complex tasks — reusable workflows, code, or prompt compositions. The problem is that most systems treat skills as disposable artifacts: generated once, then frozen in place, with no validation, no refinement, and no cross-task memory. In May 2026, ByteDance's ByteBrain team published [MUSE-Autoskill](https://arxiv.org/abs/2605.27366) (arXiv:2605.27366), explicitly framing this gap as the "Skill Lifecycle" problem and proposing a comprehensive five-stage framework. Around the same time, four to five other papers attacked the same territory from different angles — making this one of the most concentrated bursts of research activity this field has seen.

## The Root of the Problem: Why Are Skills Always Static?

[Voyager](https://arxiv.org/abs/2305.16291) (arXiv:2305.16291, NVIDIA / CMU, 2023) is the origin point of the modern skill library concept. Operating in the Minecraft environment, it assembles three components into a closed loop: a curriculum that automatically plans exploration objectives, a skill library storing executable code, and iterative prompting that incorporates environment feedback. According to the Voyager paper, the system achieved 3.3× more unique items, 15.3× faster tech-tree unlocking, and 2.3× greater travel distance compared to prior SOTA.

But Voyager's skill library has a fundamental design limitation: once a skill is generated, it's frozen. There are no unit tests, no automatic refinement on failure, and no cross-task usage memory. This is manageable in a closed environment like Minecraft, but it doesn't hold up in real-world tasks.

MUSE-Autoskill breaks this problem into three gaps:

- **Reliability gap**: Skills are deployed without systematic validation
- **Reusability gap**: No mechanism exists for reusing skills across tasks
- **Evolution gap**: Without continuous improvement, technical debt accumulates

## MUSE-Autoskill: The Five-Stage Skill Lifecycle

**Paper**: [arXiv:2605.27366](https://arxiv.org/abs/2605.27366) | Authors: Huawei Lin, Peng Li, Jie Song, Fuxin Jiang, Tieying Zhang (ByteDance Inc. + Rochester Institute of Technology)

MUSE-Autoskill's core thesis is that skills should be treated as "long-lived assets" rather than "one-shot outputs." The paper identifies five stages that any practical skill-centric agent must handle:

**Creation**: The agent generates skills on demand when encountering new tasks at runtime. Each skill is a structured directory containing `SKILL.md` (interface definition), `scripts/` (executable code), `tests/` (unit tests), and optional `resources/` and `references/`.

**Memory**: The three-layer memory design is MUSE's most distinctive feature. Beyond conventional short-term and long-term memory, it introduces **skill-level memory** — each skill has its own `.memory.md` file that appends usage observations across tasks (known failure modes, input format constraints, performance caveats). This file is intentionally left behind during skill transfer, because usage experience is inherently per-agent.

**Management**: At task start, the skill catalog is injected via progressive disclosure: the agent initially sees only name and description (roughly 5–10K tokens) and loads the full `SKILL.md` only when needed. Management mechanisms include automatic deduplication (highly overlapping skills are merged into a more general version) and pruning (skills that are long-unused or consistently failing are removed).

**Evaluation**: After generation, a skill must pass the unit tests in its `tests/` directory before it can enter the Skill Bank. This is the most significant design departure from Voyager — skills are verified before being stored, not used immediately upon generation.

**Refinement**: When tests fail, the system automatically inspects the error trace and calls `update_skill` to patch the skill package, then re-runs the tests, forming a closed loop: create → evaluate → refine → register.

### Experimental Results

The benchmark is [SkillsBench](https://arxiv.org/abs/2602.12670) (arXiv:2602.12670), with 51 Docker-based real-world evaluation tasks spanning four domains: Science & Engineering, Data Analysis, Document Processing, and Ops & Planning. All experiments use GPT-5.5 as the backbone.

| Configuration | Accuracy (51 tasks) |
|--------------|---------------------|
| No-skill baseline | 53.19% |
| Human-authored skills (reference ceiling) | 68.40% |
| MUSE self-created skills | **60.35%** (+7.16 pp) |
| 35 tasks with successful skill generation | **87.94%** (exceeds human ceiling) |

Of 51 tasks, 35 (68.6%) successfully generated skills automatically. The overall 60.35% falls below the human-skill ceiling because the 16 tasks that completely failed in Phase 1 contribute 0%. But on the 35 tasks where generation succeeded, 87.94% actually **surpasses the human ceiling** — suggesting that in certain cases, the agent's understanding of the task is more comprehensive than a human's.

Cross-agent transfer experiments (injecting MUSE-generated skills into a separate agent, Hermes) also confirmed skill portability: Hermes with these skills reached 58.40%, closing 79% of the gap with Hermes using human-authored skills (61.21%), and landing only 1.95 pp below MUSE using the same skills (60.35%).

On cost: generating one skill requires approximately 383K tokens / 164 seconds (roughly 2/3 of a no-skill run), but using a generated skill is actually **cheaper** than using human-authored skills — MUSE saves 20% tokens and 37% latency; Hermes saves 48% tokens and 30% latency. Break-even arrives after approximately 3 reuses.

## EvoSkill: Automatically Discovering Skills from Failure

**Paper**: [arXiv:2603.02766](https://arxiv.org/abs/2603.02766) | Authors: Alzubi et al. (Sentient / Virginia Tech)

EvoSkill (March 2026) takes a different angle: instead of distilling skills from successes, it identifies gaps from **failures**. The architecture uses three collaborating agents:

- **Executor**: Executes tasks using existing skills
- **Proposer**: Analyzes failure traces and identifies missing capabilities
- **Skill-Builder**: Materializes the Proposer's suggestions into a structured skill directory (including `SKILL.md`, trigger metadata, and helper scripts)

The filtering mechanism uses Pareto frontier selection: only skills that demonstrably improve performance on a validation set are retained.

According to the EvoSkill paper, the improvement is +7.3% on OfficeQA and +12.1% on SealQA. Even more notable is the zero-shot transfer result: a skill evolved on SealQA ("search-persistence-protocol") transplanted directly to BrowseComp lifted accuracy from 43.5% to 48.8% (+5.3%) without any modification. EvoSkill's explanation is that optimizing at the skill abstraction level — rather than at the prompt or code level — yields improvements that are more transferable.

Compared to MUSE-Autoskill: EvoSkill covers creation and evaluation, but lacks a systematic memory mechanism and a complete lifecycle framework.

## SkillOS: Learning Long-Horizon Curation Strategies with RL

**Paper**: [arXiv:2605.06614](https://arxiv.org/abs/2605.06614) | Authors: Ouyang et al. (May 2026)

SkillOS asks a more fundamental question: existing approaches design skill operation rules manually or heuristically, and these rules cannot learn complex long-horizon curation strategies from indirect, delayed feedback.

Architecturally, SkillOS splits the agent into two parts: a frozen Agent Executor (not trained, handles task execution) and a trainable Skill Curator (trained with RL, responsible for deciding when to add, modify, or delete skills). The Curator learns from task outcome signals, but since signals are delayed and indirect, teaching it to reason about long-horizon decisions — such as "store a skill now that isn't immediately useful but will pay off later" — is SkillOS's core contribution.

Test benchmarks include AIME24, AIME25 (mathematical reasoning) and GPQA-Diamond (graduate-level biology, physics, and chemistry).

Compared to MUSE-Autoskill: SkillOS focuses on learning a curation policy — "when and how to operate on skills" — as an RL training framework; MUSE-Autoskill is training-free, emphasizing systematic design across five lifecycle stages.

## Skill1: Three Skill Capabilities Driven by a Single RL Signal

**Paper**: [arXiv:2605.06130](https://arxiv.org/abs/2605.06130) | Authors: Shi et al. (May 2026)

Skill1 identifies another problem with existing skill frameworks: skill selection, skill utilization, and skill distillation are typically optimized separately, sometimes with different training signals, resulting in partial and conflicting evolution.

Skill1's core insight: the **low-frequency trend** of task-outcome signals can be attributed to selection (choosing the right skill affects long-term performance), while **high-frequency fluctuations** can be attributed to distillation (distillation quality affects per-task variance). One signal, two credit assignments — enabling all three capabilities to be trained simultaneously.

According to the Skill1 paper, it outperforms all prior skill-based and RL baselines on ALFWorld and WebShop. Success rates improve across all ALFWorld subtasks (Pick, Look, Clean, Heat, Cool, Pick2), with an average reaching 70%+.

Compared to MUSE-Autoskill: Skill1 is a pure RL training framework requiring extensive task interaction; MUSE-Autoskill is training-free and better suited for zero-shot settings.

## SkillRet: Skill Retrieval Is the Overlooked Bottleneck

**Paper**: [arXiv:2605.05726](https://arxiv.org/abs/2605.05726) | Authors: Cho et al. (May 2026)

SkillRet's contribution isn't a new method — it exposes a systematically overlooked problem: how hard is skill retrieval?

The paper constructs a large-scale benchmark: 17,810 public agent skills and 63,000+ evaluation samples, stratified by skill type (Data & ML, Information Retrieval, etc.). The findings are unambiguous: top-performing general retrievers on the MTEB leaderboard perform surprisingly poorly on skill retrieval. After targeted fine-tuning, NDCG@10 jumps from 66.6 to 83.5 — a gain of 16.9 points.

This result has direct practical implications for MUSE-Autoskill: MUSE's management stage depends on accurate skill selection, and if retrieval quality is poor, even the best lifecycle design will break down. The fine-tuned model from SkillRet can serve as a retrieval backbone for MUSE-class systems.

## Side-by-Side Comparison

| Paper | Core Focus | Training Required? | Lifecycle Coverage | Evaluation Mechanism |
|-------|-----------|-------------------|-------------------|----------------------|
| [Voyager](https://arxiv.org/abs/2305.16291) | Skill accumulation (Minecraft) | No | Creation / Memory | None explicit |
| [EvoSkill](https://arxiv.org/abs/2603.02766) | Failure-driven skill discovery | No | Creation / Evaluation | Validation set filtering |
| **[MUSE-Autoskill](https://arxiv.org/abs/2605.27366)** | **Full skill lifecycle** | **No** | **All five stages** | **Unit tests + runtime feedback** |
| [SkillOS](https://arxiv.org/abs/2605.06614) | Skill curation policy learning | Yes (RL) | Management / Evaluation | Task outcome (RL reward) |
| [Skill1](https://arxiv.org/abs/2605.06130) | Unified training of three skill capabilities | Yes (RL) | Distillation / Utilization | Task outcome (RL reward) |
| [SkillRet](https://arxiv.org/abs/2605.05726) | Skill retrieval benchmark | Yes (fine-tune) | Management (retrieval) | NDCG@10 |

## The Bigger Picture

This 2026 cohort of papers has established a shared consensus: skills are not one-shot outputs, but long-lived assets requiring systematic management. Yet each paper attacks a different layer:

**Training-free approaches** (Voyager, EvoSkill, MUSE-Autoskill) emphasize that RL training isn't required — skills are distilled, validated, and refined from execution traces. MUSE-Autoskill is currently the most complete system along this path.

**RL-based approaches** (SkillOS, Skill1) emphasize learning from task outcomes — the skill management policy itself can be optimized. The tradeoff is the need for extensive task interactions, and trained models tend to be tied to specific task distributions.

**Open challenges that remain**:

- **Skill conflict**: How should multiple simultaneously applicable skills be coordinated? EvoSkill explicitly lists this as future work
- **Scale**: SkillRet's 17k+ skills show that as skill libraries grow, retrieval quality becomes the dominant bottleneck
- **Fragmented evaluation standards**: Voyager uses Minecraft, EvoSkill uses OfficeQA/SealQA, MUSE uses SkillsBench, SkillOS uses AIME/GPQA. Without a shared benchmark, cross-system comparison is nearly impossible
- **Cross-model transferability**: MUSE's cross-agent transfer experiment is a starting point, but the robustness of transfers across LLM versions (GPT-5.5 → GPT-4o, etc.) remains unverified

If you're designing an agent system, the most practical near-term stack is: build your initial skill library with MUSE-Autoskill or EvoSkill's training-free approach, pair it with SkillRet's fine-tuned retriever for skill selection, and only consider introducing RL-based curation once your skill library has stabilized.

## Related Posts

- [Assembling LLM Agent Skills, Tools, and Code Interpreters: A Paper Map](/posts/ai/2026-05-24-llm-agent-skills-tools-code-interpreter-papers/)
- [The Complete Guide to Claude Code Skills: Turning Repetitive Workflows into a Single Command](/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide/)

## References

- [MUSE-Autoskill: Self-Evolving Agents via Skill Creation, Memory, Management, and Evaluation](https://arxiv.org/abs/2605.27366)
- [Voyager: An Open-Ended Embodied Agent with Large Language Models](https://arxiv.org/abs/2305.16291)
- [EvoSkill: Automated Skill Discovery for Multi-Agent Systems](https://arxiv.org/abs/2603.02766)
- [SkillOS: Learning Skill Curation for Self-Evolving Agents](https://arxiv.org/abs/2605.06614)
- [Skill1: Unified Evolution of Skill-Augmented Agents via Reinforcement Learning](https://arxiv.org/abs/2605.06130)
- [SkillRet: A Large-Scale Benchmark for Skill Retrieval in LLM Agents](https://arxiv.org/abs/2605.05726)
- [SkillsBench (arXiv:2602.12670)](https://arxiv.org/abs/2602.12670)
