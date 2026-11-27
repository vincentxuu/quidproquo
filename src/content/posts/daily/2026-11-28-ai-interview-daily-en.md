---
title: "AI Engineer Interview Drill — 2026-11-28: Paper Reading"
date: 2026-11-28
category: daily
type: digest
tags: [ai-engineer-interview, daily, paper-reading]
lang: en
description: "Today's paper is RLVB, which argues that training an agent's reward on nothing but the final answer teaches it to commit too early. The drill is a case where a coding agent keeps shipping fixes before it has confirmed the root cause, and you have to redesign the training signal."
tldr: "Today's paper is RLVB (arXiv:2611.32884, DeCLaRe Lab at Nanyang Technological University, published 2026-11-24). It moves the training signal from \"is the final answer correct\" to \"is there enough evidence at this step,\" using the exact posterior a simulator can compute as the reward signal — no judge or critic needed. Three vision-language models improve by 17.1% on average across nine settings, and the gain comes not from answering more accurately but from learning to wait until the evidence is sufficient. The practice question simulates an interviewer describing a coding agent that keeps shipping fixes before confirming the root cause, and asks how you'd redesign the training signal without the paper's oracle."
series:
  name: "AI Engineer 面試日練"
  order: 101
---

> :globe: [中文版](/posts/daily/2026-11-28-ai-interview-daily)

## Today's Focus

Saturday is the fixed slot for Paper Reading: one paper that just landed on arXiv, worked through the way an interviewer actually tests it — they don't care whether you've memorized the paper, they care whether you can turn its core claim into one actionable engineering judgment call.

Today's pick is RLVB (Reinforcement Learning with Verifiable Beliefs), a paper that pushes back on the default assumption that scoring an agent purely on "is the final answer correct" is enough to train it well. Its position is blunt: an outcome-only reward can't teach an agent when to commit, because a lucky guess and an answer backed by gathered evidence score exactly the same under it. That's precisely the question LLM/agent engineering interviews love to probe: what is your training signal actually teaching the model.

## Core Concepts, Fast

### Laziness: committing to an answer the agent's own belief says isn't settled yet

The paper illustrates this with a cup-lifting task: four cups hide one object, the agent lifts cups 1 and 3 and finds them empty, so the object must be under cup 2 or cup 4, each with 50% probability. The right move is to lift another cup — but the tested models often guess cup 4 anyway, right after writing a belief line that plainly says "Possible: cups 2, 4." The model isn't failing to compute the probability; it knows and acts on two different tracks that never connect. This behavior is called laziness, and the key point is that it isn't a capability gap.

### The blind spot of outcome reward: a lucky guess and a well-earned answer score the same

An outcome reward only scores the final answer at the end of an episode, treating every step along the way identically — a lucky guess and an answer backed by several steps of evidence-gathering receive the same reward if both happen to be right, and a careful search that loses gets penalized exactly like a random guess that loses. The paper quantifies this: on one benchmark, base models give 64% to 97% of their answers before the evidence is actually sufficient, and training directly on the outcome reward with GRPO or PPO leaves average accuracy *below* the untrained baseline.

### RLVB's core move: treat the simulator's exact posterior as a verifiable belief

Because the training simulator knows the rule linking the hidden answer to the evidence, it can compute the exact posterior probability at every step — in effect, "given what's been observed so far, which answers are still possible." RLVB uses that posterior as a belief state that updates with each step: while the posterior still allows several answers, it rewards taking another step; once the posterior has collapsed to one answer, it rewards committing. The whole reward needs nothing but that probability — no extra critic to train, no LLM judge watching every step. When an interviewer asks where your process reward comes from, this is an answer that doesn't require an extra model.

### The accuracy gain comes from answering later, not from reading evidence better

The paper splits the source of the accuracy gain apart: grouping answers by whether the evidence was sufficient at the moment of answering, the trained agent answers with sufficient evidence 51%, 12%, and 74% of the time across three benchmarks, versus 8%, 0.4%, and 36% for the base model — but within the "sufficient evidence" group, every method's accuracy lands in the same 66%–92% band, with no meaningful gap. In other words, RLVB didn't make the model read evidence more accurately; it made the model learn to wait until the evidence is actually enough. When asked where an accuracy gain like this comes from, splitting it into "is the answer correct" versus "is the timing of the answer correct" is a more convincing move than just saying "it trained better."

### The belief line is never read by the reward, yet it still gets trained to match the action

The line an agent writes before each action — which answers it still thinks are possible — is never read by the reward function, which only looks at the simulator's posterior and the action actually taken. But because the RL update scores likelihood over the whole output, including that belief line, training still pulls the line into alignment with the action: the rate at which the trained agent commits while its own belief line still names several possible answers drops from 3%–68% in the base model to 0.1%–2.2%. This echoes the two halves of metacognition from psychology — monitoring (knowing what you know) and control (acting on that knowledge) — and shows that a reward which never reads the monitoring signal can still train the control half indirectly.

```diagram
title: How RLVB scores each step an agent takes
desc: After the agent takes a step and observes the result, the simulator computes the exact posterior over the hidden answer from the rule linking it to the evidence; if the posterior has collapsed to one answer, committing is rewarded, otherwise taking another step is rewarded, and the loop returns to the start with the new history.
caption: Simplified: training samples several candidate actions at each step and compares them; this shows only the rewarded path for the chosen action. Whether the exact posterior can be computed at all depends on whether the training environment itself knows the rule linking the hidden answer to the evidence.
step: The agent takes one step given its current history, and observes the result
step: The simulator uses the rule linking the hidden answer to the evidence to compute the exact posterior given the evidence so far
step: The posterior has collapsed to one answer, so the "commit" action is rewarded
step: The posterior still allows several answers, so the "take another step" action is rewarded
step: The loop returns to the start and repeats the same scoring logic with the new history
---
<svg viewBox="0 0 680 400">
  <path class="dg-line" d="M280 34V54" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M280 114V150" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--accent" d="M410 224H436" marker-end="url(#arrow-accent)" data-step="3"/>
  <path class="dg-line" d="M280 294V320" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M180 352H98Q90 352 90 344V94Q90 86 98 86H188" marker-end="url(#arrow-warn)" data-step="5"/>

  <circle class="dg-dot" cx="280" cy="28" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="192" y="58" width="176" height="56" rx="6"/>
    <text class="dg-label" x="280" y="74" text-anchor="middle" dominant-baseline="central">Agent takes a step</text>
    <text class="dg-label" x="280" y="98" text-anchor="middle" dominant-baseline="central">and observes result</text>
  </g>

  <g data-step="2">
    <path class="dg-box" d="M280 154L410 224L280 294L150 224Z"/>
    <text class="dg-label" x="280" y="213" text-anchor="middle" dominant-baseline="central">Posterior collapsed</text>
    <text class="dg-sub" x="280" y="237" text-anchor="middle" dominant-baseline="central">exact posterior</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="440" y="188" width="196" height="72" rx="6"/>
    <text class="dg-label" x="538" y="212" text-anchor="middle" dominant-baseline="central">Reward "commit</text>
    <text class="dg-label" x="538" y="236" text-anchor="middle" dominant-baseline="central">to answer"</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="180" y="324" width="200" height="56" rx="6"/>
    <text class="dg-label" x="280" y="340" text-anchor="middle" dominant-baseline="central">Reward "take</text>
    <text class="dg-label" x="280" y="364" text-anchor="middle" dominant-baseline="central">another step"</text>
  </g>

  <text class="dg-edge" x="423" y="212" text-anchor="middle" dominant-baseline="central" data-step="3">yes</text>
  <text class="dg-edge" x="290" y="307" text-anchor="start" dominant-baseline="central" data-step="4">no</text>
</svg>
```

## Today's Practice Question

### The Question

An interviewer gives you this scenario: your coding agent keeps shipping fix PRs before it has read every relevant file or confirmed the root cause. Your team has found that quite a few of those PRs are lucky guesses — a line gets changed, the test happens to pass, but the change has nothing to do with the actual bug. Your current RL fine-tuning uses only "did the test pass" as the reward. The interviewer asks: how would you redesign the training signal so the agent learns to confirm the evidence is sufficient before it edits anything?

**Source**: Self-authored, adapted from the agent laziness scenario in arXiv:2611.32884 (RLVB) and mapped onto a coding agent's debugging workflow　**Difficulty**: Advanced　**Round**: system design / deep ML follow-up

### How to Break It Down

1. **Clarify the problem first**: the clarifying questions worth asking in the interview — does training run in a sandbox, and does that sandbox actually know where the real bug is (i.e., is there an oracle that can tell whether the current evidence already pins down the root cause)? If yes, you may be able to compute an exact posterior the way RLVB does. If not — a real repo with no ground-truth root cause labeled — you have to fall back to an approximate signal.
2. **Build a framework**: separate "reward on the final outcome" from "reward on the in-progress belief," mirroring the paper's framing — the outcome reward (test passes or not) and the process reward (is there enough evidence at this step) are two independent signals, and the process signal doesn't have to come from an LLM judge. If the environment can compute an exact posterior (for example, a synthetic or semi-synthetic dataset with injected bugs whose root cause and fix are known), you can copy RLVB's approach directly.
3. **Dig into the core trade-off**: the technical crux is that RLVB's approach assumes "the simulator knows the rule linking the hidden answer to the evidence." A real coding agent is debugging a genuine, unknown bug, so that oracle doesn't exist. Be honest that you can't just copy the paper here, and pick an approximate proxy instead — self-consistency across several independent rollouts (letting the agent search the same bug multiple ways and treating convergence on the same root cause as "sufficient evidence"), or pretraining the "wait until the evidence is enough" habit on synthetic bug data with a real posterior, then transferring it to real repos. Naming this honest gap — not reciting RLVB's method as if it transferred for free — is what the question is actually testing.
4. **Close strong**: whichever approximate signal you pick, the underlying principle doesn't change — the reward shouldn't only look at the final outcome; it should separate "spent extra steps confirming" from "guessed" partway through the episode. And this signal doesn't require training an extra reward model or hiring an LLM judge; shaping the reward from a verifiable signal the environment already has — even an approximate one — is more stable and cheaper than bolting on a subjective judge.

### A Sample Answer (How You'd Actually Say This)

> I'd split this into two layers: whether an oracle exists, and how to shape the reward. **Checking for an oracle first**: if we can use synthetic data — bugs injected with a known root cause — the training environment knows exactly where the real problem is, and we can borrow RLVB's approach directly: at every step, the simulator computes whether the posterior over the root cause, given the files the agent has read and the tests it's run, has collapsed to a single candidate. If it has, reward submitting the fix; if several candidates remain, reward reading the next relevant file instead. This signal needs no extra critic and no LLM judge scoring every step, which is cheaper and more stable — in the paper's matched setting, training cost came out to 1/1.6 of the comparison method.
>
> **If there's no such oracle** — a real repo with no labeled ground truth — I'd fall back to two approximate proxies. First, self-consistency: run several independent rollouts on the same bug, and treat convergence on the same root cause across those rollouts as "sufficient evidence"; divergence means keep investigating. Second, pretrain the "wait until the evidence is enough" habit on a synthetic bug dataset using something like RLVB's exact posterior, then fine-tune that habit into the real-repo setting. Either way, before shipping I'd track one specific metric: the rate at which the agent submits a PR while the evidence is still insufficient. Only when that number comes down have we actually fixed the "passed the test but got the cause wrong" problem — not just watched the PR merge rate go up.

### Self-Check

Use this table to check whether your answer hit the key points:

| Checklist item | Covered? |
|---------|---------|
| Named the blind spot of outcome reward: a lucky guess and a well-earned answer score the same | |
| Explained that laziness isn't a capability gap — it's the reward structure failing to see the process | |
| Noted that RLVB needs a simulator that can compute the exact posterior, which most real systems don't have | |
| Proposed a fallback for when there's no oracle (self-consistency, synthetic-data transfer, etc.) | |
| Mentioned that skipping an extra critic/judge is a training-cost win | |
| Bonus: proactively named the metric that would actually prove the problem is fixed (not just PR merge rate) | |

## Further Reading

- [declare-lab/RLVB — GitHub](https://github.com/declare-lab/RLVB) — the official implementation and evaluation code, useful if you want to see the reward function and the Pro-Worlds benchmark firsthand
- [Lazy Agents Answer Against Their Own Beliefs — Hugging Face Papers](https://huggingface.co/papers/2611.32884) — a community summary with the key numbers for quick reference

## References

- [arXiv:2611.32884 — Lazy Agents Answer Against Their Own Beliefs: Reinforcement Learning with Verifiable Beliefs Teaches Them to Act on What They Believe](https://arxiv.org/abs/2611.32884) — source for all five "Core Concepts" sections above; DeCLaRe Lab, Nanyang Technological University, submitted 2026-11-24
- [arXiv:2611.32884 — full HTML text](https://arxiv.org/html/2611.32884v1) — source for the cup-lifting example in "Laziness" and the monitoring/control discussion in "The belief line"
- [declare-lab/RLVB — GitHub](https://github.com/declare-lab/RLVB) — source for the reward function and training pipeline described in "RLVB's core move"
