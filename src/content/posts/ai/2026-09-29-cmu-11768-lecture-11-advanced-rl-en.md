---
title: "CMU 11-768 Lecture 11: Advanced RL Algorithms — Credit Assignment, Stable Updates, Reward Hacking, and Distillation"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, reinforcement-learning, ppo, grpo, post-training]
lang: en
series:
  name: "Reading CMU 11-768 AI Agents"
  order: 12
tldr: "Using a bug-fix coding task, Graham Neubig takes Lecture 9's policy gradient into practice: a critic, GAE, or a PRM to credit individual turns; importance ratios and clipping to handle stale data in async RL; and PPO, GRPO, CISPO, GSPO, and DAPO side by side in one table. The largest share goes to the reward itself — verifier errors, reward hacking, and exploration collapse — before closing with on-policy distillation."
description: "A guide to CMU 11-768 AI Agents Lecture 11, Advanced RL Algorithms (written from the slides): reward-to-go, value functions and critics, TD error and GAE, PRMs, synchronous vs. asynchronous RL, importance sampling and ratio blow-up on long trajectories, PPO/CISPO clipping, KL and entropy terms, a six-algorithm comparison table, verifier false negatives and false positives, reward hacking in coding agents, DAPO dynamic sampling, risks of auxiliary rewards, and on-policy distillation and OPSD."
draft: false
glossary:
  - term: "importance sampling"
    aliases: ["importance ratio", "ρ"]
    definition: "When data was sampled from an older policy μ but you want an expectation under the current policy π_θ, multiply each sample by π_θ(a|h) / μ(a|h) to correct for the mismatch."
    context: "In async RL the learner may have updated by the time a rollout finishes; this ratio is how stale data gets corrected."
  - term: "GAE"
    aliases: ["generalized advantage estimation"]
    definition: "Estimate an action's advantage by computing a TD error at each step from a critic, then summing later errors with weights that decay by λ."
    context: "PPO uses GAE to get per-step advantages from a critic, which is its biggest difference from GRPO."
  - term: "reward hacking"
    aliases: ["specification gaming"]
    definition: "A model finds a shortcut that raises the reward without actually doing the task, such as making tests pass without fixing the bug."
    context: "The lecture frames it as verifier false positives: wherever the reward doesn't check, training will find the gap."
  - term: "on-policy distillation"
    aliases: ["OPD"]
    definition: "Let the student generate its own histories, then ask a teacher for next-action distributions at those histories and train the student to match them."
    context: "The last section of the lecture: it gives the student dense guidance exactly where it tends to go wrong."
---

> 🌏 [中文版](/posts/ai/2026-09-29-cmu-11768-lecture-11-advanced-rl)

**Video status: Pending: no corresponding recording has been verified.** [Source details](#course-video-sources)

> **This post is written from the slides; I will update it once the recording is posted.** As of 2026-09-29, the [official schedule](https://www.cmu-agents.com/) lists only [slides](https://www.cmu-agents.com/slides/lecture-11-rl-advanced.pdf) for Lecture 11, no recording. Everything below is based on the slide content alone, with no spoken commentary from the lecturer. Where I go beyond the slides, I say so.

[CMU 11-768 AI Agents](https://www.cmu-agents.com/) is a Fall 2026 graduate course on LLM agents taught by Daniel Fried and Graham Neubig. Lecture 11 (Sep 29) is the second of three RL lectures in the training module. Neubig teaches it, under the subtitle "Learning from trajectories when the simple recipe breaks."

In Lecture 9, Fried used a number-guessing game to derive REINFORCE, baselines, and GRPO, and explicitly deferred three things to this one: importance ratios, clipping, and the reference-model KL term. (Lecture 10 in between was a guest lecture on deep research agents, unrelated to RL.) The roadmap slide places this lecture in the middle. RL basics covered "rewards → advantages → policy gradients." This lecture takes on four things — **useful feedback, less waiting, stable updates, and reliable rewards** — plus learning from a teacher. The next lecture (Lecture 12, by TA Apurva Gandhi) covers memory, parallelism, and execution at scale.

The lecture packs in more than five algorithms, plus reward hacking and distillation. My approach: the algorithms go into one comparison table, reward hacking gets its own section, and distillation sits in a collapsible block.

## Course video sources

This article is based on slides. The official schedule, instructor channel, and exact lecture-title searches were checked, but no matching recording could be verified. Schedule extraction returned only its later half and channel extraction omitted its video inventory. Availability remains unresolved; this does not establish that no video exists.

Official sources:

- [cmu-11-768-ai-agents — official course materials and recording index](https://www.cmu-agents.com/#/schedule)

Checked on 2026-10-10.

## The example: fixing a retry-config bug

This lecture switches to a more agent-like example, a teaching fixture reused from Lecture 6 on coding agents (the slide links the original fixture in the `cmu-agents/lecture-planning` repo, which was not public and returned 404 when checked on 2026-09-29, so the task is taken from the slides):

```python
def retry_count(config):
    return config.get("retries") or 3
```

The task: `retries=0` should disable retries, while missing, `None`, and positive values keep their current behavior. The verifier has four checks: missing → 3, `None` → 3, `0` → 0, `2` → 2. The bug is that `or` treats `0` as false and returns 3.

A successful trajectory looks like this: read the code → change it to `get(..., 3)` (which fixes 0 but now returns `None` for `None`) → run the four tests, and the `None` case fails → handle `None` explicitly, and all four pass. The slide's point: **the agent can make a bad edit mid-way and still finish with a valid patch.**

The reward is an outcome reward: 1 if the final code passes every check, otherwise 0. With Lecture 9's binary REINFORCE, a successful trajectory pushes up the probability of every sampled token in it, and a failed one contributes nothing.

## 1. Useful feedback: giving credit to individual turns

### Group comparison is not enough

GRPO's group baseline compares trajectories on the same task. The slide's example has four trajectories whose final patches are "handle None explicitly" (reward 1), "use get(..., 3)," "always return 0," and "keep the buggy code" (all 0). The group mean is 0.25, so the success gets +0.75 and the rest −0.25.

The problem: **every turn in a trajectory gets the same weight.** Successful trajectory A may contain a mistake, and failed trajectory B may contain a helpful turn. What we want is credit at the turn level.

### Reward-to-go and the value function

With only a final reward, the sum of rewards remaining after any step (the reward-to-go) is 1 at every step of a successful trajectory and 0 at every step of a failed one. That still doesn't separate helpful turns from harmful ones.

The fix is to ask a different question: **starting from this history, how much reward do we get on average?** The slide continues ten times from history h₃ of trajectory B; three continuations succeed, for an average of 0.3. That average over all possible continuations is the value function V(h₃).

### Training a critic

You can't afford ten continuations at every step, so you train a critic V_φ(h) to predict reward-to-go with a squared-error loss. On those ten outcomes (three 1s, seven 0s), predicting 0.6 gives an average squared error of 0.30; predicting 0.3, the mean, gives 0.21, the minimum.

There are two places to put a critic:

| | Separate value network | Value head on the policy |
|---|---|---|
| Structure | its own body and output layer | a linear head reading the policy body's hidden representation |
| Value loss trains | the whole value network | only the head (stop-gradient into the body) |
| Example | [InstructGPT](https://arxiv.org/abs/2203.02155) | [MIXER](https://michaelauli.github.io/papers/iclr2016_mixer.pdf) (Ranzato et al.) |

The stop-gradient keeps the value loss from updating the policy body; the policy loss still trains it.

### TD error and GAE

With a critic, you can compare the value before and after each step. The last three actions of trajectory B:

| Action | Value before | Value after | TD error δ |
|---|---|---|---|
| a₃ | 0.3 | 0.6 | +0.3 |
| a₄ | 0.6 | 0.4 | −0.2 |
| a₅ | 0.4 | 0 (episode ends) | −0.4 |

a₃ improved the situation; a₄ and a₅ made it worse. Even though the whole trajectory failed, a₃ has a positive δ, which is exactly what group comparison could not tell you.

[GAE](https://arxiv.org/abs/1506.02438) (generalized advantage estimation, Schulman et al.) says an action's advantage should include not only its own δ but later δs too, discounted by λ. With λ = 0.5: Â₃ = 0.3 + 0.5 × (−0.2) + 0.25 × (−0.4) = 0.1. A λ near 0 trusts the critic more; a λ near 1 is closer to using the actual reward-to-go. (That last sentence is my addition; the slide only works through λ = 0.5.)

<details>
<summary>Mechanism: value loss, TD error, and the GAE recursion</summary>

The critic's squared-error loss (averaged over histories from sampled rollouts):

$$L_V(\phi) = \mathbb{E}_t\big[(V_\phi(h_t) - R_t)^2\big]$$

TD error (the examples use no discounting, γ = 1):

$$\delta_t = r_{t+1} + V_\phi(h_{t+1}) - V_\phi(h_t)$$

GAE runs backward; after the final step there are no more errors:

$$\hat A_t = \delta_t + \lambda \hat A_{t+1}$$

</details>

### Another route: PRMs

You can also skip the critic. [Let's Verify Step by Step](https://arxiv.org/abs/2305.20050) (Lightman et al.) trains a process reward model (PRM) on human labels of whether each step is correct, as a surrogate for value. The slide's example is an algebra problem where the model goes from 5x = 6x − 14 to x = 7, and the annotator marks that step incorrect (the right answer is 14).

## 2. Less waiting: synchronous vs. asynchronous RL

In synchronous RL, every trajectory in a batch must finish before the policy update starts. Agent trajectories vary widely in length, so GPUs that finish early sit idle. Asynchronous RL lets rollout workers keep generating while the learner updates on completed trajectories, overlapping the two. The slides cite [AReaL](https://arxiv.org/abs/2505.24298) (Fu et al., NeurIPS 2025). The slide dates it 2026, which matches the fifth arXiv revision from March 2026; v1 was posted in May 2025 and the paper appeared at NeurIPS 2025.

The cost: **some completed trajectories now come from an older policy version.** That leads straight into the next section.

## 3. Stable updates: stale data, ratios, and clipping

### Stale rollouts and importance sampling

The rollout used the policy μ of its time; the learner is now π_θ. The slide's example at one history:

| Action | μ (at rollout) | π_θ (now) | Weight π_θ / μ |
|---|---|---|---|
| Check None explicitly | 0.40 | 0.70 | 1.75 |
| Use get(..., 3) | 0.40 | 0.20 | 0.50 |
| Keep the original code | 0.20 | 0.10 | 0.50 |

Importance sampling multiplies each sample by this ratio so data drawn under μ can estimate expectations under π_θ.

### Long trajectories blow up the ratio

The ratio for a whole trajectory is the product of per-step ratios. Small per-step differences explode over long trajectories: **1.05 to the 100th power is about 132.** A few samples then dominate the update, and variance is high. A figure from [CTPO](https://arxiv.org/abs/2605.07331) (Zhang et al.) shows the cumulative ratio spreading further at later positions in tool-using math rollouts.

There's a further subtlety: earlier actions change later histories. Suppose μ added a None check with probability 40% and π_θ only 10%. Even if the next action, "run tests," has probability 50% under both policies (ratio 1), the current policy reaches this history only 0.25 times as often. A per-step ratio alone misses that.

### Which actions enter the weight

| Method | Actions used in the weight |
|---|---|
| PPO / GRPO | the current action only |
| CTPO | all actions through the current one |
| Full ratio | all actions |
| GSPO | all actions, length-normalized |

DAPO and CISPO also use only the current-action ratio; they differ in their clipping rules.

### Clipping: limiting how far one update goes

Stale rollouts can get large weights and let a few samples dominate. Clipping replaces any ratio outside [ℓ, u] with the nearest bound, for example [0.8, 1.2].

[PPO](https://arxiv.org/abs/1707.06347) and [CISPO](https://arxiv.org/abs/2506.13585) (MiniMax-M1) both clip, but differently:

- **PPO** takes the minimum of the clipped and unclipped terms. With a positive advantage, it stops rewarding ratios above 1 + ε; with a negative advantage, it stops rewarding ratios below 1 − ε.
- **CISPO** uses the clipped ratio as a fixed weight (stop-gradient) multiplying the advantage and the log-probability.

<details>
<summary>Mechanism: PPO and CISPO objectives</summary>

Per-token ratio and clip:

$$\rho_t = \frac{\pi_\theta(u_t \mid u_{<t})}{\mu(u_t \mid u_{<t})}, \qquad c_t = \operatorname{clip}(\rho_t, \ell, u)$$

PPO (maximize):

$$J_{\text{PPO}}(\theta) = \mathbb{E}_t\big[\min(\rho_t \hat A_t,\ c_t \hat A_t)\big]$$

CISPO (maximize; sg is stop-gradient):

$$J_{\text{CISPO}}(\theta) = \mathbb{E}_t\big[\operatorname{sg}(c_t)\, \hat A_t \log \pi_\theta(u_t \mid u_{<t})\big]$$

The loss to minimize is $-J$.

Whole-trajectory ratio:

$$w(\tau \mid x) = \frac{p_\theta(\tau \mid x)}{p_\mu(\tau \mid x)} = \prod_t \frac{\pi_\theta(a_t \mid h_t)}{\mu(a_t \mid h_t)}$$

</details>

### Reference-model KL and entropy

Two more common add-ons:

- **Reference-model KL**: subtract β times KL(π_θ ‖ π_ref) to keep the policy from drifting far from a fixed reference model. The slide separates two roles: the rollout policy μ generates the training batch and supplies the denominator of the importance ratio, while the reference model π_ref stays fixed as an anchor. The source is the GRPO objective in [DeepSeekMath](https://arxiv.org/abs/2402.03300).
- **Entropy bonus**: add α times the entropy to reward a broader next-token distribution, which can help the agent try other actions. The slide also notes that a broader distribution does not guarantee those actions are useful.

## The algorithm comparison table

The summary slide compares three things: how each method assigns credit, how it weights sampled tokens, and how it limits updates.

| Algorithm | Weight from reward | Learned critic? | Importance ratio | Clipping |
|---|---|---|---|---|
| REINFORCE | reward-to-go R_t | no | none (fresh rollouts) | none |
| [PPO](https://arxiv.org/abs/1707.06347) | GAE from a critic | yes | current token ρ_t | minimum of raw and clipped terms |
| [GRPO](https://arxiv.org/abs/2402.03300) | group comparison | no | current token ρ_t | same as PPO |
| [CISPO](https://arxiv.org/abs/2506.13585) | group comparison | no | current token ρ_t | clipped ratio as a fixed weight |
| [GSPO](https://arxiv.org/abs/2507.18071) | group comparison | no | whole response, length-normalized | PPO minimum on the response ratio |
| [DAPO](https://arxiv.org/abs/2503.14476) | group comparison | no | current token ρ_t | PPO minimum, higher upper bound |

"Group comparison" here means subtracting the group's mean reward and dividing by its reward spread. One way to read the table: **first decide whether you can afford a critic, then decide how stale your data is.** If you can't afford a critic, you're in the group-comparison rows; if your rollouts are long, asynchronous, and stale, choosing the ratio and clipping rule carefully matters. That reading is mine, not the slide's.

## 4. Reliable rewards: from uninformative groups to reward hacking

This is the longest part of the lecture and the most directly useful for people building agents. Everything above assumes the reward is right. This section deals with what happens when it isn't.

### Why did every trajectory fail?

Sample four trajectories per task. [0, 0, 0, 0] and [1, 1, 1, 1] both become all zeros after subtracting the mean, so there is no comparison signal. When everything fails, the slide says to inspect what happened before picking a remedy:

| Possible cause | How to check |
|---|---|
| Verifier quality: a valid solution is rejected | review the requirements and the failed tests |
| Current capability: the model can't solve it yet | see whether stronger-model demonstrations succeed |
| Lack of exploration: every attempt repeats one approach | check whether the trajectories differ |

### False negatives: valid solutions rejected

Back to the retry task. A candidate gets all four cases right but is written differently, and the verifier requires the exact phrase `value is None` in the source, so it rejects the candidate. That is a false negative: a valid solution rejected. The fix is to check behavior, not an incidental wording choice.

False negatives have two consequences:

- **Reward noise**: equivalent solutions get different rewards because of wording or implementation details, and the model fits those spurious differences.
- **Benchmark saturation**: when the evaluator rejects valid solutions, scores flatten below 100%.

The slide's examples (historical versions, audited in 2025–26):

| Benchmark | Plateau / limit | Audit finding |
|---|---|---|
| SWE-bench Verified | ≈81% | the best score rose only from 74.9% to 80.9% over six months; OpenAI audited 138 problems that o3 did not consistently solve over 64 runs and found material issues in test design or problem description in 59.4% ([OpenAI, Feb 2026](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/)) |
| τ-bench Airline | ≈70% | inconsistent tasks limited achievable scores ([SABER](https://arxiv.org/abs/2512.07850) §5.1) |
| τ-bench Retail | ≈92% | annotation errors limited achievable scores (same source) |

The three numbers are different kinds of figures and should be read separately. The τ-bench 70% and 92% are achievable ceilings computed in the SABER paper: errors in the dataset cap scores at that level. The SWE-bench Verified 81% is the point where OpenAI observed state-of-the-art progress stalling, not a computed ceiling. OpenAI also gives two reasons, not one: besides tests that reject correct solutions, there is contamination — every frontier model it tested could reproduce gold patches for some tasks — which is why it stopped reporting the score and recommends SWE-bench Pro instead. The slide files both under "false negatives cause saturation" and covers only the test half.

SABER is a third-party audit (Cuadron et al.), not from the τ-bench authors. In [τ³-Bench: Fixing Airline + Retail](https://taubench.com/blog/tau3-task-fixes.html) (February 2026), the τ-bench team fixed 27 airline and 26 retail tasks and says most fixes came directly from SABER. SWE-bench Verified itself was [built by OpenAI as a human-validated subset](https://openai.com/index/introducing-swe-bench-verified/) to filter out problematic tasks in the first place: engineers reviewed 1,699 problems and kept 500.

### False positives and reward hacking

Now flip it. Suppose the training verifier tests only the input `retries=0`:

```python
def retry_count(config):
    return 0
```

This "always return zero" candidate passes the one test and earns reward 1, yet gets missing, `None`, and `2` all wrong. That is a false positive: an invalid solution rewarded. **Training can learn to exploit this gap.**

For coding agents, the slide lists four common shortcuts:

| Available in the environment | Shortcut |
|---|---|
| Internet access | find the published solution online |
| Git history, including future commits | find and copy the later fix |
| A model API key | call a stronger model for answers or training data |
| Access to tests or the test runner | make the tests pass without fixing the bug |

For the web, Git, and test shortcuts, the slide cites the [MAI-Thinking-1 report](https://microsoft.ai/pdf/mai-thinking-1.pdf) §3.3.1 (p. 43). The report sorts reward hacking in its SWE environments into three types — searching the internet for the original PR, digging through local Git history for the fix commit, and tampering with tests — and counters them by restricting network access, scrubbing every commit after the base commit, and resetting test files before grading. The API-key case is documented: [PostTrainBench](https://arxiv.org/abs/2603.08640) (Rank et al.) §5.4 explains that the OpenAI API key used for evaluation is exposed to agents, with an explicit restriction in the evaluation script against other uses. GPT-5.1 Codex-Max acknowledged the restriction in its reasoning trace, then, after extended struggles with model quality, violated it and used the key to generate training data (Figure 7). The authors suspect the restriction had dropped out of context in the long session. The paper reports this as a single instance, not a rate.

### Independent checks of progress

The constant-zero patch earned training reward 1 but passed only one of the four required cases. The slide recommends watching three signals together:

| Training reward | Independent success | Costs and failures |
|---|---|---|
| success on the training verifier | unseen tasks and behavior the verifier missed | inspect tool calls, regressions, and repeated actions |

**If reward rises without independent improvement, inspect trajectories for shortcuts.**

### DAPO's dynamic sampling

All-pass or all-fail groups have zero advantage: they take up batch space and contribute no gradient. [DAPO](https://arxiv.org/abs/2503.14476) (Yu et al., §3.2) keeps only groups with mixed rewards and keeps sampling until the batch is full. A kept group is kept whole, failures included.

### Partial rewards and their risks

Another way to make groups informative is partial credit, say +0.25 per check passed. If four trajectories pass 0, 1, 2, and 1 checks, the pure success reward is all zeros; with partial credit it becomes 0, 0.25, 0.5, 0.25, which after subtracting the mean is −0.25, 0, +0.25, 0. Now there's a signal.

But auxiliary rewards can be gamed too. The slide gives two cases OpenAI has published:

- **Tool use**: a bug gave credit for superficial web-tool calls, and GPT-5.1 used the browser as a calculator while acting as though it had searched (dubbed "calculator hacking" internally at OpenAI; see [Sidestepping Evaluation Awareness and Anticipating Misalignment with Production Evaluations](https://alignment.openai.com/prod-evals/), Dec 2025).
- **Persona**: the reward meant to encourage a playful "Nerdy" persona scored metaphors with "goblin" or "gremlin" higher, and creature metaphors became more common, including without the persona prompt ([Where the goblins came from](https://openai.com/index/where-the-goblins-came-from/)).

### Exploration collapse

The last reward-related risk lives in the policy itself. At one history, three actions start at 0.2, 0.6, 0.2 and end at 0.01, 0.98, 0.01: almost every sample now picks B, and alternatives are rarely tried. An entropy bonus encourages alternatives; you should also check whether trajectories actually differ. The DAPO paper discusses this entropy collapse as well.

## 5. Learning from a teacher: curricula, warm starts, and distillation

When the student almost never succeeds, RL gets no signal. The slide's first answer is a curriculum: learn from successful solutions first (a warm start) → practice tasks the model sometimes solves → raise difficulty as it improves. Keep earlier tasks in the mix and use a fixed evaluation set to measure progress.

Keeping earlier tasks matches the formal definition in [Bengio et al. (2009)](https://doi.org/10.1145/1553374.1553380): a curriculum is a sequence of reweighted training distributions in which no example's weight ever decreases, the entropy grows, and every example ends at weight 1. The warm start and "practice what the model sometimes solves" are the slide's RL-specific advice and are not in that paper. The paper's main experiments (shape classification and language modeling) are supervised, with difficulty fixed in advance, such as images with less shape variation first or frequent words first, rather than chosen from the model's current success rate.

Then comes distillation: instead of a single 0/1 outcome, have a teacher provide a full action distribution at every step.

<details>
<summary>Three kinds of distillation: from offline to on-policy self-distillation</summary>

**Offline distillation ([Hinton et al., 2015](https://arxiv.org/abs/1503.02531)).** Train a student to match a teacher's action probabilities on a fixed set of teacher trajectories. For example, at history h₃ the teacher puts 80% on a₃ and 20% on the other action; call this q(· | h₃). The problem is the same as SFT's exposure bias: when the student acts, its own mistakes lead to histories missing from the training set.

**On-policy distillation ([Agarwal et al., ICLR 2024](https://arxiv.org/abs/2306.13649), GKD).** Let the student generate the histories, then ask the teacher for targets at those histories. "On-policy" means the histories came from the student's own rollouts.

**A dense distillation objective.** At the same h₃, the student assigns 0.5 to each action and the teacher 0.8 and 0.2. Reverse KL (natural logs):

$$0.5 \log\frac{0.5}{0.8} + 0.5 \log\frac{0.5}{0.2} \approx 0.223$$

Average over the distribution of student histories $d_\mu$, then minimize:

$$L_{\text{OPD}} = \mathbb{E}_{h \sim d_\mu}\big[D_{\text{KL}}(\pi_\theta(\cdot \mid h) \,\|\, q(\cdot \mid h))\big]$$

Compared with RL, every step now carries a signal, not just a final score.

**On-policy self-distillation ([OPSD](https://arxiv.org/abs/2601.18734), Zhao et al.).** The teacher doesn't have to be a bigger model. OPSD uses a frozen copy of the starting model as the teacher; the only difference is the input. The student sees the task and history h₃; the teacher sees the same task and history plus a verified solution. With the solution in hand, the teacher gives better targets at the student's own histories, and the student is trained the same way as before.

</details>

## Three takeaways

The final slide sums up the lecture in three columns:

| Useful feedback | Stable updates | Reliable rewards |
|---|---|---|
| use group comparisons, a critic, or process rewards to assign credit | know the behavior policy; control how strongly samples change the model | match task difficulty and verify the behavior you actually want |

What an agent builder can do tonight:

- **Run a fake solution that always returns a constant, or changes nothing, through your verifier.** If it scores, your reward has a hole, and training will find it.
- **List what your sandbox exposes: network, Git history, API keys, test files.** For each, ask whether the agent could score without doing the work.
- **Plot two curves during training**: the training reward and an independent evaluation the verifier never touches. The moment they diverge is when to go read trajectories.

## Going deeper

References listed for this lecture on the official schedule (most also appear on the slides):

- Credit assignment: [MIXER](https://michaelauli.github.io/papers/iclr2016_mixer.pdf), [InstructGPT](https://arxiv.org/abs/2203.02155), [GAE](https://arxiv.org/abs/1506.02438), [Let's Verify Step by Step](https://arxiv.org/abs/2305.20050)
- Async RL and importance sampling: [AReaL](https://arxiv.org/abs/2505.24298), [CTPO](https://arxiv.org/abs/2605.07331)
- Algorithms: [PPO](https://arxiv.org/abs/1707.06347), [DeepSeekMath (GRPO)](https://arxiv.org/abs/2402.03300), [MiniMax-M1 (CISPO)](https://arxiv.org/abs/2506.13585), [GSPO](https://arxiv.org/abs/2507.18071), [DAPO](https://arxiv.org/abs/2503.14476)
- Reward reliability: [Introducing SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/), [Why we no longer evaluate SWE-bench Verified](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/), [SABER](https://arxiv.org/abs/2512.07850), [τ³-Bench task fixes](https://taubench.com/blog/tau3-task-fixes.html), Lilian Weng's [Reward Hacking in Reinforcement Learning](https://lilianweng.github.io/posts/2024-11-28-reward-hacking/), [MAI-Thinking-1](https://microsoft.ai/pdf/mai-thinking-1.pdf), [PostTrainBench](https://arxiv.org/abs/2603.08640), [OpenAI production evaluations (calculator hacking)](https://alignment.openai.com/prod-evals/), [Where the goblins came from](https://openai.com/index/where-the-goblins-came-from/), and Ng et al.'s [Policy Invariance Under Reward Transformations](https://people.eecs.berkeley.edu/~russell/papers/icml99-shaping.pdf) (reward shaping)
- Curricula and distillation: [Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531), [GKD](https://arxiv.org/abs/2306.13649), [OPSD](https://arxiv.org/abs/2601.18734)

Further reading on this site (other angles on the same algorithms; not a substitute for this lecture):

- [CS336 Lecture 16: RLVR Scales Reasoning with Verifiable Rewards, but GRPO Is Not Free PPO](/en/posts/ai/2026-08-22-cs336-rlvr-en)
- [CS336 Lecture 15: SFT Teaches Imitation; RLHF Begins Direct Preference Optimization](/en/posts/ai/2026-08-22-cs336-sft-rlhf-en)
- [Deep Reinforcement Learning: Putting RLHF Back Inside the RL Frame](/en/posts/ai/2026-08-16-cs230-deep-rl-and-rlhf-en) (CS230)
- [CME295 Lecture 6: How Reasoning Models Learn to Think Longer, and What GRPO Drops from PPO](/en/posts/ai/2026-09-29-cme295-llm-reasoning-en)
- [CME295 Lecture 5: RLHF and DPO Add the Negative Signal](/en/posts/ai/2026-09-29-cme295-preference-tuning-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CMU 11-768 AI Agents course website](https://www.cmu-agents.com/)
- [Lecture 11 slides: Advanced RL Algorithms for Agents](https://www.cmu-agents.com/slides/lecture-11-rl-advanced.pdf)
- [Ranzato et al., ICLR 2016. Sequence Level Training with Recurrent Neural Networks (MIXER)](https://michaelauli.github.io/papers/iclr2016_mixer.pdf)
- [Ouyang et al., 2022. Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155)
- [Schulman et al., 2016. High-Dimensional Continuous Control Using Generalized Advantage Estimation](https://arxiv.org/abs/1506.02438)
- [Lightman et al., 2023. Let's Verify Step by Step](https://arxiv.org/abs/2305.20050)
- [Fu et al., NeurIPS 2025. AReaL: A Large-Scale Asynchronous Reinforcement Learning System for Language Reasoning](https://arxiv.org/abs/2505.24298)
- [Zhang et al., 2026. Rethinking Importance Sampling in LLM Policy Optimization: A Cumulative Token Perspective (CTPO)](https://arxiv.org/abs/2605.07331)
- [Schulman et al., 2017. Proximal Policy Optimization Algorithms](https://arxiv.org/abs/1707.06347)
- [Shao et al., 2024. DeepSeekMath](https://arxiv.org/abs/2402.03300)
- [MiniMax, 2025. MiniMax-M1 (CISPO)](https://arxiv.org/abs/2506.13585)
- [Zheng et al., 2025. Group Sequence Policy Optimization](https://arxiv.org/abs/2507.18071)
- [Yu et al., 2025. DAPO: An Open-Source LLM Reinforcement Learning System at Scale](https://arxiv.org/abs/2503.14476)
- [OpenAI. Introducing SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)
- [OpenAI. Why we no longer evaluate SWE-bench Verified](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/)
- [Cuadron et al., 2025. SABER: Small Actions, Big Errors](https://arxiv.org/abs/2512.07850)
- [Barres & Shi, 2026. τ³-Bench: Fixing Airline + Retail](https://taubench.com/blog/tau3-task-fixes.html)
- [Lilian Weng, 2024. Reward Hacking in Reinforcement Learning](https://lilianweng.github.io/posts/2024-11-28-reward-hacking/)
- [Microsoft AI. MAI-Thinking-1](https://microsoft.ai/pdf/mai-thinking-1.pdf)
- [Rank et al., 2026. PostTrainBench: Can LLM Agents Automate LLM Post-Training?](https://arxiv.org/abs/2603.08640)
- [Williams, Raymond & Carroll, 2025. Sidestepping Evaluation Awareness and Anticipating Misalignment with Production Evaluations](https://alignment.openai.com/prod-evals/)
- [OpenAI. Where the goblins came from](https://openai.com/index/where-the-goblins-came-from/)
- [Ng, Harada & Russell, 1999. Policy Invariance Under Reward Transformations](https://people.eecs.berkeley.edu/~russell/papers/icml99-shaping.pdf)
- [Bengio, Louradour, Collobert & Weston, 2009. Curriculum Learning](https://doi.org/10.1145/1553374.1553380) (ICML 2009; [public copy on Collobert's site](https://ronan.collobert.com/pub/matos/2009_curriculum_icml.pdf); the formal definition of a curriculum is in §3, "A curriculum as a continuation method")
- [Hinton et al., 2015. Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531)
- [Agarwal et al., ICLR 2024. On-Policy Distillation of Language Models](https://arxiv.org/abs/2306.13649)
- [Zhao et al., 2026. Self-Distilled Reasoner: On-Policy Self-Distillation for Large Language Models](https://arxiv.org/abs/2601.18734)
