---
title: "AI Agent Arxiv Digest — 2026-11-08"
date: 2026-11-08
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's theme is agents spending less and judging better — not by switching to a pricier model, but by bolting on small mechanisms that compress context, hunt down waste, and offload decisions to a frozen predictor"
tldr: "Coca-Cola compresses tool returns into latent tokens, cutting 70%-89% of tokens and 24%-56% of runtime while improving task performance; How Do AI Agents Waste Your Money? uses causal remove-and-rerun experiments to show 41%-46% of agent reasoning can be removed without hurting outcomes; DPDM replaces few-shot prompting with a frozen small predictor for decisions, raising mean accuracy across 50 benchmarks from 78.80% to 84.92%"
series:
  name: "AI Agent Arxiv Digest"
  order: 168
---

## Today's Overview

Today's three papers answer the same question from three different angles: can an agent's efficiency and judgment improve without retraining the backbone LLM at all? Coca-Cola compresses tool returns into continuous latent tokens that don't take up text-token space, cutting token use by seventy to ninety percent outright. "How Do AI Agents Waste Your Money?" doesn't stop at measuring waste — it actually removes the flagged content and reruns the agent, using the outcome to validate that what got removed really was removable. DPDM shows that "learning to decide from past experience" can itself be outsourced to a frozen small predictor, with no update to the language model's parameters at all. The message across all three is consistent: the next round of agent progress is less likely to come from a pricier model than from bolting on small components that manage resources and learn from history better. All three are preprints that just landed on arXiv in early November 2026, not yet peer-reviewed, but all release either code or the underlying model weights so readers can check the claims themselves.

## Terms Worth Knowing Before This Article

| Term | Plain-language explanation |
|---|---|
| Latent token | Not text — a "token" that's really a vector of numbers, fed directly into a model's input embedding space; denser with information than a text token, but unreadable by humans |
| Token waste vs. token cost | Cost is the total usage on the bill; waste is the portion of that usage that can be removed without changing the outcome — the two are not the same thing |
| LLM-as-a-Judge | Using a separate LLM to read an agent's execution trace and flag content that's repetitive, padding, or otherwise removable |
| Frozen backbone | Not updating the main language model's parameters during training — only training a small side module (a compressor, a predictor) instead, keeping the change cheap and low-risk |
| Agent harness | The code framework wrapping an LLM that decides what the model sees, how memory is stored, and which tools it can call |

---

## Paper One | Coca-Cola: Letting Tool Returns Stop Speaking in Text

**Tools Need Not Speak in Text: Latent Context Compression for Agents**
Yuetong Liu, Zhehao Zhou, Yitong Zhang et al. (Tsinghua AI Agent Group, Tsinghua University) · arxiv: 2611.06500

Links: [arxiv](https://arxiv.org/abs/2611.06500) · [alphaxiv](https://www.alphaxiv.org/abs/2611.06500)

### TL;DR

Compressing tool observations into a handful of continuous latent tokens and feeding them straight into the agent's input embedding space cuts token consumption by 70.01%-89.24% and end-to-end runtime by 24.45%-55.97% across four web-search QA benchmarks and two model pairings — while task performance actually improves over the uncompressed baseline.

### Editorial Judgment

| Aspect | Assessment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation velocity | ~4 days old; Semantic Scholar returned HTTP 429 on every attempt this round, citation data unavailable |
| Institution | Tsinghua AI Agent Group, Tsinghua University |
| Community signal | Listed on HuggingFace Daily Papers; no additional reproduction repo found on Papers with Code |
| Credibility | Pass — the paper provides a full comparison table across 2 model families × 4 QA benchmarks against 4 baselines (Vanilla, LongLLMLingua, LLMSummary, ICAE), plus ablations and a case study |
| Evidence maturity | Substantial — both efficiency and task-performance metrics are backed by controls and multi-baseline comparisons, but validated only in the web-search tool setting |
| Reproducibility | Full artifacts — code released at github.com/THU-Agent/Coca-cola |
| Why selected | Direct — any ReAct-style tool-calling agent runs into tool returns flooding its context; this paper addresses that pain point head-on |
| Novelty | Substantive — prior compression methods all compress back into text tokens; this is the first to compress tool returns straight into continuous vectors that never need to become text again |
| Today's importance | High — context cost is one of the most immediate pain points in deploying agents right now |
| Practical link | Clear — the design isn't tied to search tools; in principle it applies to any tool returning long text |
| Editorial confidence | High — multi-baseline comparison, two model families, and open-sourced code are enough to support the claim that the method works |
| Reading recommendation | Must-read — for agents whose tool returns routinely run into tens of thousands of tokens (search, crawling, document QA) |
| Primary limitation | Validated only in the web-search setting; not yet tested on code execution, API calls, or other tool types |

### Field Background

When an LLM agent calls a tool, the common approach is to paste the raw returned text directly into context and let the model read it itself. But tool returns are often long and noisy — the paper measures tool observations accounting for 96.7% of total context by the fourth step. Prior fixes split into two camps: token pruning (like LLMLingua, removing less-informative tokens) and text summarization (using another LLM to shorten tool returns). Both share a common limit: the compressed result is still human-readable discrete text tokens, bounded by vocabulary size, which caps how far compression can go.

### Mid-Level Walkthrough

- **The problem**: Imagine your agent searches for a race event just to confirm "what year was this driver born?" The search result comes back with an entire paragraph of race details, track information, and historical results, but all the agent actually needs is the driver's name to decide its next search. The extra detail doesn't just take up space — it pulls the model's attention away from the one useful sentence.
- **The method**: Coca-Cola uses a small encoder that reads the task instruction, the current reasoning trajectory, and the tool observation together, compressing them into a handful of continuous vectors (latent tokens). A latent adapter then projects these vectors into the agent's input embedding space, letting the agent reason directly over the vectors without first reconstructing text. Training uses "Action-Preserving Training": the agent is fed both the full tool observation and the compressed version, and is required to produce matching next-action distributions under both — forcing the compressor to retain only the information that actually affects decisions, not to reconstruct the original text as faithfully as possible.
- **Why it matters**: This reframes the compression target from "preserve as much of the original text as possible" to "preserve what actually affects the next decision" — a sharper, more agent-relevant objective, and it explains why compressed performance can beat uncompressed performance: what gets dropped is precisely the noise that would have distracted the model.

### Deep-Dive Points

- Four benchmarks: NQ, TriviaQA (single-hop QA), 2Wiki, HotpotQA (multi-hop QA); two model pairings: Qwen3.5-35B-A3B + Qwen3.5-4B, GLM-4.7-Flash + GLM-Z1-9B
- Token-consumption reduction ranges 70.01%-90.5% and runtime reduction 24.45%-56.0% depending on benchmark and model pairing
- Across the 8 model-dataset settings, Coca-Cola's EM/F1 is the best among all methods in 6; multi-hop QA (2Wiki, HotpotQA) shows the largest EM gains, up to 133.64%
- Deployment bar: requires training an extra compression model (LoRA fine-tuning the encoder plus the adapter), but the agent backbone stays frozen throughout
- Not tied to search tools by design — in principle applicable to any tool returning long text, though only the web-search setting was tested
- Limitation: the authors acknowledge testing only the web-search tool type; whether it holds up for code execution, API calls, or other tool types is untested

### Reviewer's One-Line Take

Reframing "compression" from "reconstruct the original text" to "preserve what the decision needs" is an elegant framing shift, and the four-baseline comparison is solid; but the method has only been validated on one tool type (web search) — whether it holds for structured returns like code execution or database queries remains to be seen.

### Your Take-Away

- If you're building agents that make heavy use of search APIs: tool returns routinely running into the tens of thousands of tokens can flood the context window — Coca-Cola's Action-Preserving Training idea is directly worth borrowing. The goal isn't reconstructing text after compression, it's keeping the next decision the same.
- If you're evaluating existing summarization-based context compression: the theoretical analysis in Section 3.2 (codebook capacity) offers a framing for why continuous vectors can compress further than discrete text — worth revisiting your own system's compression ceiling with this lens.

---

## Paper Two | Where Is Your Agent Actually Burning Your Money?

**How Do AI Agents Waste Your Money?**
Huimin Zeng, Yuxuan Lu, Jesse Cai et al. (UIUC, Northeastern University, UCLA, UT Austin) · arxiv: 2611.07238

Links: [arxiv](https://arxiv.org/abs/2611.07238) · [alphaxiv](https://www.alphaxiv.org/abs/2611.07238)

### TL;DR

Rather than just measuring how many tokens an agent spends, this paper actually removes content flagged as waste and reruns the agent to check whether the outcome changes — online pruning experiments show removing 41%-46% of the model's reasoning leaves task success rates on SWE-bench Verified and MCP-Atlas essentially unchanged.

### Editorial Judgment

| Aspect | Assessment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation velocity | ~4 days old; Semantic Scholar returned HTTP 429 on every attempt this round, citation data unavailable |
| Institution | University of Illinois Urbana-Champaign (UIUC), Northeastern University, UCLA (Kai-Wei Chang among the corresponding authors), UT Austin |
| Community signal | Not found on HuggingFace Daily Papers or Papers with Code trending at the time of this check |
| Credibility | Pass — validates causally by removing flagged spans and rerunning, then resampling the next-action distribution, rather than concluding from an LLM's waste label alone; covers 6 frontier models, 5 agent harnesses, 4 benchmarks |
| Evidence maturity | Substantial — uses intervention experiments rather than pure correlational observation to validate that "waste" is really removable, though the waste-labeling itself relies on an LLM-as-a-Judge whose own error rate isn't independently audited |
| Reproducibility | Full artifacts — framework and code open-sourced at github.com/huiminzeng/How_Do_AI_Agents_Waste_Your_Money, labeled trajectory dataset published on HuggingFace |
| Why selected | Direct — any team running agents in production cares about token cost, and this paper offers an actionable diagnostic framework rather than yet another "agents are expensive" observation |
| Novelty | Substantive — prior work on agent cost mostly stopped at measuring aggregate usage; this is the first framework to causally validate the "waste" label itself through direct intervention |
| Today's importance | High — turns "cutting cost" from blindly trimming tokens into an evidence-based optimization signal |
| Practical link | Clear — designed to attach to existing harnesses with minimal code changes, and the open-sourced code can be applied directly |
| Editorial confidence | High — causal intervention experiments plus open-sourced code and data are enough to support the claim that the measured waste is genuinely removable |
| Reading recommendation | Must-read — for teams running agents in production who care about the token bill |
| Primary limitation | The LLM-as-a-Judge's own accuracy at flagging "removable" content isn't independently audited; a systematic bias in the judge could skew all downstream waste statistics |

### Field Background

Prior work on agent cost mostly stopped at aggregate metrics — how many tokens were used, how much it cost. The problem is that high token usage doesn't necessarily mean high waste: a task may genuinely need extensive reasoning and many turns, in which case spending more is normal; conversely, a seemingly terse response can still hide repetition or off-topic content. Aggregate metrics can't distinguish "expensive" from "wasteful," and that's precisely the measurement gap this paper tries to fill.

### Mid-Level Walkthrough

- **The problem**: Imagine your customer-service agent opens every reply with "I understand your frustration, let me help you resolve this" before querying the database. That opener isn't wrong, but removing it doesn't affect whether the task gets completed at all — that's the paper's "Padding" waste pattern. It also defines three others: Restate (repeating content already in context), Duplicate-Fetch (re-calling a tool that was already queried), and Detour (exploration that seemed reasonable at the time but turns out unnecessary in hindsight).
- **The method**: The framework has three stages. First, a LiteLLM-based proxy intercepts every request between the agent and the model, recording and normalizing the complete execution trace. Second, an LLM-as-a-Judge reads the full trace and marks text spans matching the four waste patterns. Third, "intervention" validates the labels: the marked spans are removed from the trajectory, the agent resumes from the next turn, and the framework measures whether the task outcome and next action change. If removal leaves the outcome essentially unchanged, the span really was waste — not a mislabel.
- **Why it matters**: This reframes "cutting cost" from "remove as many tokens as possible" to "first find the part that's truly removable without hurting the outcome, then cut that." The paper finds waste varies much more across tasks and harnesses than across models (MCP-Atlas, for instance, wastes noticeably more than SWE-bench Verified) — meaning adjusting task design and harness architecture may be more effective for cost savings than switching models.

### Deep-Dive Points

- Online pruning: removing 41% of reasoning on SWE-bench Verified leaves the solve rate at 89.5% versus 89.0% baseline (essentially unchanged, even slightly higher); removing 46% on MCP-Atlas moves the solve rate from 65.0% to 62.3%
- Control: removing all reasoning (not just flagged waste) drops SWE-bench's solve rate to 73.0% and MCP-Atlas's to 56.0% — confirming that what the framework flags as "waste" really is distinct from "necessary reasoning"
- Across six frontier models (Kimi-K3, Gemini 3.1 Pro, GPT-5.6 Terra, GPT-6 Astra, Claude Sonnet 5, Claude Fable 5.1), roughly 18% of output tokens are flagged as waste on average, and for more than 45% of tasks, one agent's wasted output alone exceeds another agent's entire output for solving the same task
- Structure of the waste: for most models, "Detour" (exploratory wandering) dominates the waste, suggesting that reducing unnecessary tool exploration (better tool routing, more structured tool descriptions) may be a more effective cost lever than simply trimming output
- Deployment bar: the framework attaches via "point the API base URL at the proxy," a small code change, but running a full analysis on your own tasks still requires engineering setup
- Limitation: the authors themselves acknowledge the LLM-as-a-Judge's labeling accuracy isn't independently verified; if the judge systematically misses some waste type or over-flags necessary content, all downstream statistics inherit that bias

### Reviewer's One-Line Take

Validating causally through "remove and rerun," rather than stopping at "the LLM says this is waste," is this paper's strongest contribution, and the four waste-pattern categories map cleanly onto practice; but the judge's own reliability hasn't been independently checked, which is the biggest open question for this whole measurement approach.

### Your Take-Away

- If you're managing production agent costs: don't rush to cut budgets based on "total token usage" — use this framework (or a similar approach) to separate "waste" from "necessary spend" first, then target the waste, so you don't cut reasoning that's actually needed.
- If you're designing an agent harness: the paper finds waste mainly comes from "exploratory detours," meaning better tool descriptions and more structured environment information may be more effective than trimming output text — worth first checking whether your own tool descriptions are clear enough.

---

## Paper Three | Replacing Few-Shot Prompting with a Frozen Small Predictor for Decisions

**Decoupled Predictive Decision Making: A Shared Conditional Predictor for Agents**
Lang Mo, Xingxuan Zhang, Qi Wang et al. (Stable AI, Tsinghua University) · arxiv: 2611.02075

Links: [arxiv](https://arxiv.org/abs/2611.02075) · [alphaxiv](https://www.alphaxiv.org/abs/2611.02075)

### TL;DR

Splitting "judging from past experience" into a language model that understands the problem and a frozen structured-data predictor (LimiX-2) that infers the answer from historical records pushes Qwen3.5-27B's mean accuracy across 50 benchmarks from 78.80% (few-shot prompting) to 84.92%, and still 82.33% versus 78.80% when both methods get identical histories.

### Editorial Judgment

| Aspect | Assessment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed); 16 pages, 7 figures, 11 tables, with appendices |
| Citation velocity | ~7 days old; Semantic Scholar returned HTTP 429 on every attempt this round, citation data unavailable |
| Institution | Stable AI (a startup founded by a Tsinghua team that open-sources the LimiX structured-data foundation model family), Tsinghua University (Peng Cui among the corresponding authors) |
| Community signal | Listed on HuggingFace Daily Papers with 79 upvotes observed — one of the strongest community signals seen in this series recently |
| Credibility | Pass — 50 benchmarks, 82 task configurations, 4 semantic encoders, plus a label-permutation ablation (ruling out the "just saw more examples" confound) and an imbalanced-history test |
| Evidence maturity | Substantial — the ablation design is careful (permuting historical labels, fixing identical histories), but the 50-benchmark suite and evaluation pipeline are entirely self-defined by the authors, and no public evaluation code or benchmark-list repository was found at review time |
| Reproducibility | Partial artifacts — LimiX-2 model weights are public at huggingface.co/stable-ai/LimiX-2, but no public code for this paper's evaluation harness or 50-benchmark list was found at review time |
| Why selected | Direct — addresses the long-standing pain point of how agents learn from past experience, with an architecture that doesn't require fine-tuning |
| Novelty | Substantive — decouples "semantic understanding" from "learning from history" into two independent, separately upgradable components, rather than making one LLM do both via few-shot prompting |
| Today's importance | High — most teams currently rely on few-shot prompting to make agents "learn" from history; this offers an alternative that doesn't require fine-tuning the main model |
| Practical link | Clear — directly relevant to teams already using in-context learning for decision support (tool-applicability judgments, candidate ranking) |
| Editorial confidence | High — ablations like label permutation rule out common confounds, supporting the claim that the architecture genuinely learns input-target relationships |
| Reading recommendation | Skim — the core finding (a frozen predictor can replace few-shot prompting) is worth knowing, but deploying it requires integrating LimiX-2; most teams can read the conclusions first to assess whether it's worth the investment |
| Primary limitation | The 50-benchmark composition, history budgets, and scoring pipeline are entirely self-defined by the authors, and no public evaluation code was found at review time, so the evaluation pipeline's details can't be independently inspected |

### Field Background

LLM agents wanting to "learn from past experience" currently rely mainly on two approaches: storing past trajectories or takeaways in external memory and retrieving them for the language model to read and judge itself (as in ExpeL, Rememberer), or directly fine-tuning the model. The former's problem is that the language model has to both understand the current problem and extract useful statistical regularities from historical records — two genuinely different capabilities forced onto the same model, which may not excel at either. The latter's problem is the cost of fine-tuning, which has to be redone for every new task.

### Mid-Level Walkthrough

- **The problem**: Imagine a customer-service agent deciding whether a given user question needs the refund tool called. The few-shot approach stuffs dozens of past similar cases with their answers into the prompt and lets the language model "spot the pattern" itself. But the language model's training objective is understanding meaning and generating fluent text, not statistical inference — as the number of examples grows, it may not reliably extract "under what conditions should the refund tool be called" as an empirical rule.
- **The method**: DPDM splits this decision into two parts. The language model is responsible only for converting "the current situation" and "each record in the history" into semantic vectors (something it's already good at). A separate, frozen small predictor (LimiX-2, originally a foundation model trained on tabular structured data) is responsible for inferring, given these semantic vectors and the observed answers in the history, what the most likely answer is for the current case (also something it's already good at). Both models stay frozen throughout — change the data and the judgment changes, with no retraining required.
- **Why it matters**: This demonstrates that "learning from experience" can be a capability independent of the language model, separately optimizable — in the future, making an agent better at learning from history doesn't necessarily require retraining or fine-tuning the main model; swapping in a stronger predictor component may suffice. A label-permutation ablation shows DPDM's gains genuinely come from learning "what inputs look like, what answers follow" — not simply from having seen more examples.

### Deep-Dive Points

- 50 benchmarks, 82 task configurations, spanning 5 task categories (agent tasks, knowledge QA, evidence consistency, safety and reliability, language understanding); 4 semantic encoders: Qwen3.5-4B/9B/27B, Llama-3.1-8B
- With Qwen3.5-27B: DPDM's mean accuracy is 84.92% versus 78.80% for few-shot prompting; still 82.33% versus 78.80% under identical histories and queries, ruling out the "simply saw more data" explanation
- Label-permutation ablation: original-label accuracy is 80.71%, dropping to 50.13% after shuffling historical labels — close to the 50.52% "always guess the most frequent label" baseline — confirming the gain genuinely comes from learning real input-target relationships
- On ToolPRMBench's BFCL task, absolute accuracy gain is 34.26 percentage points; on the imbalanced-history BIG-Bench Mistake test, balanced accuracy rises from 59.86% to 74.37%
- Deployment bar: requires integrating LimiX-2 (the Tsinghua team's own structured-data foundation model, with open weights) alongside your own semantic encoder — an extra architectural investment for teams already using retrieval-based memory
- Limitation: all 50 benchmarks were compiled by the authors themselves, and no public evaluation code was found at review time, so independent teams face a real barrier to fully reproducing the results

### Reviewer's One-Line Take

The label-permutation ablation is the most convincing part of this paper — it rules out the most obvious objection ("isn't this just seeing more examples?") — but the 50-benchmark composition and evaluation pipeline are entirely custom, and there's no public code yet for outside teams to reproduce it by the numbers; there's still integration work between this and "ready to use directly."

### Your Take-Away

- If your agent uses few-shot prompting for decision support (tool-applicability judgments, candidate ranking, response-quality assessment): DPDM's division of labor between "semantic understanding" and "learning from history" is worth considering — first figure out whether your task genuinely needs the language model to do statistical inference, or whether that part can be outsourced to a more specialized small model.
- If you're designing a retrieval-based memory system: this paper's label-permutation ablation can be borrowed directly to validate your own memory system — remove the real historical labels, swap in shuffled ones, and see how much performance drops; that tells you whether the system is genuinely learning something or just seeing more text.

---

## Today's Takeaway

I used to think making an agent cheaper and more accurate required switching to a pricier model or retraining the whole thing. Today's three papers together say something different: the changes that actually pay off often happen outside the model — how you compress tool returns, how you validate waste, how you outsource statistical inference to a specialized small model. None of it touches a single parameter of the backbone LLM, and it still cuts cost and pushes accuracy up.

## References

- [Coca-Cola: Tools Need Not Speak in Text (arxiv 2611.06500)](https://arxiv.org/abs/2611.06500)
- [Coca-Cola — alphaxiv](https://www.alphaxiv.org/abs/2611.06500)
- [Coca-Cola — code](https://github.com/THU-Agent/Coca-cola)
- [How Do AI Agents Waste Your Money? (arxiv 2611.07238)](https://arxiv.org/abs/2611.07238)
- [How Do AI Agents Waste Your Money? — alphaxiv](https://www.alphaxiv.org/abs/2611.07238)
- [How Do AI Agents Waste Your Money? — code and data](https://github.com/huiminzeng/How_Do_AI_Agents_Waste_Your_Money)
- [Decoupled Predictive Decision Making (arxiv 2611.02075)](https://arxiv.org/abs/2611.02075)
- [Decoupled Predictive Decision Making — alphaxiv](https://www.alphaxiv.org/abs/2611.02075)
- [LimiX-2 model weights (Hugging Face)](https://huggingface.co/stable-ai/LimiX-2)
