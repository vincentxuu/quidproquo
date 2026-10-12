---
title: "Baselines, PPO, and Verifiable Rewards: How Grading Only the Answer Trains Long Chains of Thought | Stanford CS229 Lecture 20"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, reinforcement-learning, ppo, rlvr]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 17
tldr: "The last lecture of the term finishes policy gradient: past rewards and any baseline that depends only on the state can be removed from the weight without changing the expectation. It then derives PPO's clipped objective from importance sampling, splits it into four cases to see which samples still carry a gradient, and compares the change CISPO makes. Finally it writes token-by-token generation in a language model as an MDP, gives a reward of 1 only when the answer is right, and trains long chains of thought using the average over 8 samples of the same question as the baseline."
description: "A guide to Lecture 20 of Stanford CS229 (Spring 2026): deriving reward-to-go and the baseline, the four cases of PPO's clipped objective, CISPO, chain of thought, and training language models to reason with reinforcement learning with verifiable rewards."
draft: false
math: true
---

> 🌏 [中文版](/posts/ai/2026-10-12-stanford-cs229-lecture-20-ppo-rl-for-reasoning)

**Video status: Videos included.** This article is written from the English transcript of the Spring 2026 Lecture 20 recording published by Stanford Online, with notation checked against Chapter 21 (Policy Gradient and its Variants) and Chapter 18 (Reasoning in LLMs) of the 2026 main lecture notes. I did not see the board, so the equations written on it are reconstructed from what is said in the transcript and from the notes.

The topic in the YouTube title, "GMM (EM), PCA", does not match the content. What follows goes by the actual content: this lecture finishes policy gradient, covers PPO, and shows how reinforcement learning trains long chains of thought in large language models.

This is the last lecture in [Reading Stanford CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en) (the Lecture 19 slot fell on a holiday, so there was no class). It follows [the previous lecture on reinforcement learning basics and policy gradient](/posts/ai/2026-10-12-stanford-cs229-lecture-18-rl-basics-policy-gradient-en), and you need to remember where that one ended: the policy $\pi_\theta(a\mid s)$ is a probability distribution, the objective is the expected total return, and its gradient can be written as "the gradient of the log probability times the return". Starting from that formula, this lecture does three things: it simplifies the weight to reward-to-go minus a baseline, derives PPO's clipped objective, and then moves the whole toolkit over to language models. After reading, you should be able to work out for yourself whether a sample has a gradient in the PPO objective, and explain why "check only the final answer" is enough to train a model that thinks before it answers. The lecturer is Tengyu Ma (one of the authors of the main lecture notes; in class he mentions that one example is written in "my lecture notes").

```youtube
url: https://www.youtube.com/watch?v=J7CossjMvEg
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 20: GMM (EM), PCA
captions: en
```

## Starting from last lecture's formula: policy gradient is weighted maximum likelihood

(recording 00:00–03:40)

The objective is the expected total return of a trajectory $\tau=(s_0,a_0,\dots,s_{T-1},a_{T-1},s_T)$:

$$
\eta(\theta)=\mathbb E_{\tau\sim P_\theta}\Bigl[\sum_{t=0}^{T-1}\gamma^{t}R(s_t,a_t)\Bigr]
$$

The trouble is that nothing inside the expectation contains $\theta$. $\theta$ hides in the fact that the actions are sampled from $\pi_\theta$, so you cannot move the gradient straight inside the expectation; that would give zero. The replacement derived last lecture is:

$$
\nabla_\theta\eta(\theta)=\mathbb E_{\tau\sim P_\theta}\Bigl[\Bigl(\sum_{t=0}^{T-1}\nabla_\theta\log\pi_\theta(a_t\mid s_t)\Bigr)\Bigl(\sum_{t'=0}^{T-1}\gamma^{t'}R(s_{t'},a_{t'})\Bigr)\Bigr]
$$

The lecturer begins by supplying the intuition he ran out of time for last lecture. The first bracket is the gradient of the log probabilities of all the actions along the trajectory. Following it raises the probability that this trajectory gets sampled, exactly like maximum likelihood in supervised learning. The second bracket is the total return of the trajectory, and here it plays the role of a weight. A trajectory with high return has its likelihood pushed hard; a trajectory with return 0 has weight 0 and is not pushed at all. So what policy gradient does fits in one sentence: do maximum likelihood on the trajectories you sampled yourself, with the return deciding how hard each one is pushed.

The next three sections all modify this weight: first one fact to prepare, then using it to remove past rewards and subtract a baseline.

## One key fact: without a weight, the expected gradient is zero

(recording 03:40–07:12)

Take the general case first. If $x$ is drawn from a parameterized distribution $p_\theta$, then

$$
\mathbb E_{x\sim p_\theta}\bigl[\nabla_\theta\log p_\theta(x)\bigr]=0
$$

The derivation has only four steps, and each one should make sense to you:

$$
\begin{aligned}
\mathbb E_{x\sim p_\theta}\bigl[\nabla_\theta\log p_\theta(x)\bigr]
&=\int p_\theta(x)\,\nabla_\theta\log p_\theta(x)\,dx &&\text{write the expectation as an integral}\\
&=\int p_\theta(x)\,\frac{\nabla_\theta p_\theta(x)}{p_\theta(x)}\,dx &&\text{chain rule, }(\log u)'=1/u\\
&=\int\nabla_\theta p_\theta(x)\,dx &&\text{the two }p_\theta(x)\text{ factors cancel}\\
&=\nabla_\theta\int p_\theta(x)\,dx=\nabla_\theta 1=0 &&\text{swap gradient and integral; probabilities integrate to 1}
\end{aligned}
$$

Applied to a policy, this says that for any fixed state $s_t$:

$$
\mathbb E_{a_t\sim\pi_\theta(\cdot\mid s_t)}\bigl[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\bigr]=0
$$

The lecturer's reading: with no weight, you do not know which action is good and which is bad, so the gradient ought to be zero.

This fact has a corollary you can use right away. Multiply the expression above by any quantity $c$ that **does not depend on $a_t$** and the result is still zero, because $c$ can be pulled outside the expectation. The next two sections are a search for "what is a constant as far as $a_t$ is concerned".

## Past rewards can be dropped: reward-to-go

(recording 07:12–15:28)

Multiply out the two brackets in the gradient formula, fix a time $t$, and look only at the term $\nabla_\theta\log\pi_\theta(a_t\mid s_t)$. The total return it multiplies can be cut into two pieces by time:

$$
\sum_{t'=0}^{T-1}\gamma^{t'}R(s_{t'},a_{t'})=\underbrace{\sum_{t'<t}\gamma^{t'}R(s_{t'},a_{t'})}_{\text{past}}+\underbrace{\sum_{t'\ge t}\gamma^{t'}R(s_{t'},a_{t'})}_{R_{\ge t}}
$$

The second piece, $R_{\ge t}$, is called the **reward-to-go**: the reward still to be collected from time $t$ on. The claim in the lecture is that the "past" piece, once multiplied by $\nabla_\theta\log\pi_\theta(a_t\mid s_t)$, has expectation zero.

The proof uses the law of total expectation. First fix everything that happened before time $t$, namely $h_t=(s_0,a_0,\dots,s_{t-1},a_{t-1},s_t)$, and take the expectation over $a_t$ only; then take the expectation over $h_t$.

$$
\mathbb E\Bigl[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\cdot\sum_{t'<t}\gamma^{t'}R(s_{t'},a_{t'})\Bigr]
=\mathbb E_{h_t}\Bigl[\,\underbrace{\sum_{t'<t}\gamma^{t'}R(s_{t'},a_{t'})}_{\text{constant given }h_t}\cdot\underbrace{\mathbb E_{a_t}\bigl[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\,\big|\,h_t\bigr]}_{=0}\Bigr]=0
$$

Two places deserve a pause:

1. Why can the past rewards be pulled outside the inner expectation? Because they are determined entirely by the states and actions in $h_t$; once $h_t$ is fixed, they are a number.
2. Why is the inner expectation zero? Given the whole history, the distribution of $a_t$ depends only on $s_t$ (the Markov property: the policy takes only the current state as input), so the inner expectation is the $\mathbb E_{a_t\sim\pi_\theta(\cdot\mid s_t)}[\nabla_\theta\log\pi_\theta(a_t\mid s_t)]$ of the previous section, which is zero.

A student asks in class whether this uses $\mathbb E[AB]=\mathbb E[A]\,\mathbb E[B]$. The lecturer answers that it does not, and that identity is not true in general; $B$ can be taken out here because, after conditioning on the history, $B$ really is a constant (recording, from 20:44).

So the gradient simplifies to:

$$
\nabla_\theta\eta(\theta)=\sum_{t=0}^{T-1}\mathbb E_{\tau\sim P_\theta}\bigl[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\cdot R_{\ge t}\bigr]
$$

The lecturer puts the intuition in one sentence:

> "Whatever you cannot change shouldn't affect your decision." (recording, around 14:28)

Rewards already collected cannot be changed by the current action, so they should not decide how much this action gets reinforced.

## Baseline: subtracting a quantity that depends only on the state

(recording 15:28–23:50)

The same move works a second time. The only property the previous section used was "that quantity is a constant given $h_t$". Every function $B(s_t)$ that depends only on $s_t$ qualifies, so

$$
\mathbb E\bigl[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\cdot B(s_t)\bigr]=0
$$

Subtracting it does not change the expected gradient:

$$
\nabla_\theta\eta(\theta)=\sum_{t=0}^{T-1}\mathbb E_{\tau\sim P_\theta}\bigl[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\cdot\bigl(R_{\ge t}-B(s_t)\bigr)\bigr]
$$

$B$ is called the **baseline**. $B$ must not depend on $a_t$ or on anything after time $t$, or it could not be pulled out of the inner expectation.

If the expectation is unchanged, why subtract at all? Because in practice you cannot compute the expectation. You can only sample a few trajectories and average, and how much that average jitters (its variance) depends on the size of the weights. The lecturer calls this the classical control variate technique: find something with zero expectation that is correlated with the original quantity, and subtract it.

The example in class goes through one correction, and it is worth following in order. The lecturer first says: if the reward always falls between 10 and 11, subtract 10.5 so that it falls between −0.5 and 0.5. After a student presses him, he concedes that this example is too simplified and replaces it with two versions:

- **Different states have different scales.** In one state the reward-to-go lies between 10 and 11; in another it lies between 0 and 1. The baseline can depend on the state, subtracting 10.5 in the first and 0.5 in the second, which puts the weights in all states on the same scale.
- **Two actions in the same state.** One action earns 10 and the other earns 11, and 10 is already the worst outcome. Without a baseline, both actions look as if they are being reinforced, and the 11 one is simply reinforced a little more. After subtracting 10.5, the 10 becomes −0.5 (pushed down) and the 11 becomes +0.5 (reinforced). In expectation the two approaches agree, because only the relative gap matters, but the second is far more direct.

**Numerical example (from footnote 3 of Chapter 21 of the main notes; the variance comparison is computed separately for this article).** Fix some $t$ and suppose the reward-to-go takes only two values, each with probability one half: $1001$ and $998$. The corresponding $\nabla_\theta\log\pi_\theta(a_t\mid s_t)$ are the vectors $z$ and $-z$ (the two have equal probability and the expectation must be zero, so they have to point in opposite directions).

| | Sample 1 | Sample 2 | Mean | Deviation of each sample from the mean |
|---|---|---|---|---|
| No baseline | $1001z$ | $-998z$ | $1.5z$ | $\pm 999.5z$ |
| Subtract $B=1000$ | $(1001-1000)z=z$ | $(998-1000)(-z)=2z$ | $1.5z$ | $\pm 0.5z$ |

Both estimators have mean $1.5z$, identical in direction and size. But how far a single sample strays from the mean drops from $999.5$ times $z$ to $0.5$ times, a factor of 1,999 in standard deviation. Without the baseline, which sample you happen to draw almost entirely decides where this step goes, and it takes a great many trajectories to average that out. With it, every sample points in roughly the right direction.

The 1000 subtracted in this example is nothing more than a constant, and the variance still falls sharply: a constant helps whenever it is close to the typical size of the reward-to-go. While answering a student, the lecturer says "if you just subtract a constant it doesn't help anything" (recording, around 19:43), which on its face disagrees with the conclusion of the footnote in the notes. The second half of that sentence is that what you want to subtract is a quantity that depends on $s_t$, and the second version he adds two minutes later (same state, 10 and 11, subtract 10.5) is precisely a case where subtracting a single number helps. So this article reads it as follows: the remark stresses that a baseline can and should vary with the state. It does not say that a constant baseline has no effect.

The notes also point out that a near-optimal baseline is "the expected reward-to-go starting from $s_t$", which is the value function $V^{\pi_\theta}(s_t)$, and that a rough estimate is enough because it affects only the variance and not the mean. In class the lecturer says only that people now estimate the average reward-to-go and subtract it, without going into how to fit it.

## Why a batch of samples can be used only once

(recording 23:50–29:15)

Before PPO, the lecturer states a reservation. He says that why PPO works, and under what conditions, is still not well understood in theory:

> "none of this is really a very strong justification for this algorithm." (recording, around 23:54)

He adds that stability is a big problem across post-training (the training stage that follows pretraining; the reinforcement learning in the second half of this lecture belongs to it), and that the open-source community has not settled on how to train stably. So read the derivation below as "the story currently in circulation".

Every policy gradient algorithm has this shape:

1. Sample many trajectories with the current policy $\pi_\theta$.
2. Replace the expectation with a sample average to estimate $\nabla_\theta\eta(\theta)$.
3. Update $\theta\leftarrow\theta+\alpha\,\nabla_\theta\eta(\theta)$.

Such an algorithm is **on-policy**: the estimator requires the trajectories to come from "the current $\theta$". After one step $\theta$ has changed, the trajectories in hand have become samples from an old policy, and strictly speaking they cannot be used for a second step. You have to sample again. Sampling is expensive, yet each batch is good for a single use. That waste is what PPO sets out to fix.

## Reusing old samples with importance sampling

(recording 29:15–38:41)

Suppose you want to use samples from the old policy $\pi_{\theta_{\text{old}}}$ to estimate something about the new policy $\pi_\theta$. Simply swapping the $\pi_\theta$ under the expectation for $\pi_{\theta_{\text{old}}}$ does not work; that estimates $\eta(\theta_{\text{old}})$. A correction factor is needed, and that is importance sampling. In general form:

$$
\mathbb E_{x\sim p}[f(x)]=\int p(x)f(x)\,dx=\int q(x)\,\frac{p(x)}{q(x)}\,f(x)\,dx=\mathbb E_{x\sim q}\Bigl[\frac{p(x)}{q(x)}f(x)\Bigr]
$$

The middle step only multiplies by $q/q$. Sample from $q$, multiply each sample by an extra $p/q$, and the expectation is the same as sampling from $p$.

The difficulty is that the new and old policies differ in the probability of the whole trajectory. The lecturer says the usual first step is to correct only the action part. Split "sampling a trajectory" into two layers, how the state $s_t$ arises and how the action $a_t$ is sampled given $s_t$, and apply importance sampling to the inner layer only:

$$
\mathbb E_{s_t\sim\pi_\theta}\,\mathbb E_{a_t\sim\pi_\theta(\cdot\mid s_t)}\bigl[\gamma^{t}R(s_t,a_t)\bigr]
=\mathbb E_{s_t\sim\pi_\theta}\,\mathbb E_{a_t\sim\pi_{\theta_{\text{old}}}(\cdot\mid s_t)}\Bigl[\frac{\pi_\theta(a_t\mid s_t)}{\pi_{\theta_{\text{old}}}(a_t\mid s_t)}\,\gamma^{t}R(s_t,a_t)\Bigr]
$$

Here $s_t\sim\pi_\theta$ means "the states you reach by running $\pi_\theta$", a piece of notation a student asks about on the spot and the lecturer clarifies. The equation above is exact. The lecturer notes in passing that $\gamma=1$ in the language model setting, so he often forgets to write it.

Two approximations follow, and the lecturer says outright that they are hand-wavy:

1. **Replace the reward with the advantage.** Define $\hat A_t=R_{\ge t}-B(s_t)$, that is, reward-to-go minus baseline. $\hat A_t>0$ means the action is better than the reference level, and $\hat A_t<0$ means it is worse.
2. **Leave the state distribution uncorrected and use the old policy's.** As the lecturer puts it, there is no way to correct this part, so in practice people just use $\pi_{\theta_{\text{old}}}$. He calls this a big approximation.

Write the ratio as $r_t(\theta)=\dfrac{\pi_\theta(a_t\mid s_t)}{\pi_{\theta_{\text{old}}}(a_t\mid s_t)}$. The resulting surrogate objective is:

$$
J(\theta)=\sum_{t}\mathbb E_{s_t\sim\pi_{\theta_{\text{old}}}}\,\mathbb E_{a_t\sim\pi_{\theta_{\text{old}}}(\cdot\mid s_t)}\bigl[r_t(\theta)\,\hat A_t\bigr]
$$

Now everything under the expectation is the old policy, the old samples can be reused again and again, and $\theta$ appears only inside $r_t(\theta)$.

**An addition in this article (the lecture does not write this step):** what does the gradient of this objective look like? Because the denominator does not contain $\theta$,

$$
\nabla_\theta r_t(\theta)=\frac{\nabla_\theta\pi_\theta(a_t\mid s_t)}{\pi_{\theta_{\text{old}}}(a_t\mid s_t)}=r_t(\theta)\,\nabla_\theta\log\pi_\theta(a_t\mid s_t)
$$

So each sample contributes the gradient $r_t\,\hat A_t\,\nabla_\theta\log\pi_\theta(a_t\mid s_t)$. At $\theta=\theta_{\text{old}}$ we have $r_t=1$, and this is exactly the single-sample term in the policy gradient with a baseline from the Baseline section. Away from $\theta_{\text{old}}$, $r_t$ becomes an extra coefficient. When PPO and CISPO are compared later, the comparison is about what happens to this coefficient.

## PPO's clipping: four cases, two of which stop updating

(recording 38:41–51:08)

Sometimes $r_t$ is too large or too small, and that causes trouble. What PPO does can be told in four cases. Set two hyperparameters, $\epsilon_{\text{high}}$ and $\epsilon_{\text{low}}$; the lecture says a common value is around 0.2 (the lecturer also mentions 0.28).

| | Where $r_t$ is | What it means | What PPO does |
|---|---|---|---|
| $\hat A_t>0$ (good action) | $r_t>1+\epsilon_{\text{high}}$ | The new policy already picks it with clearly higher probability than the old one | Stop reinforcing; this term has no gradient |
| $\hat A_t>0$ (good action) | $r_t\le 1+\epsilon_{\text{high}}$ | Not high enough yet | Take the gradient as usual and push the probability up |
| $\hat A_t<0$ (bad action) | $r_t<1-\epsilon_{\text{low}}$ | The new policy already picks it with clearly lower probability than the old one | Stop suppressing; this term has no gradient |
| $\hat A_t<0$ (bad action) | $r_t\ge 1-\epsilon_{\text{low}}$ | Not low enough yet | Take the gradient as usual and push the probability down |

The common logic: a sample that is already moving in the right direction and has already moved far enough should not be pushed further, so as not to risk instability.

Watch for one slip of the tongue in the video. When the lecturer introduces the first case (recording, around 38:41), he says the ratio is "much, much less than 1". But the explanation he gives right after is that the new policy picks this good action with higher probability than the old one, and his conclusion is also to drop this term when $r_t$ exceeds $1+\epsilon$. So he means much greater than 1 there, and the table above is written that way.

Papers show a single formula instead, which the lecturer says confuses many people:

$$
C_t(\theta)=\min\Bigl\{\,r_t(\theta)\,\hat A_t,\ \ \operatorname{clip}\bigl(r_t(\theta),\,1-\epsilon_{\text{low}},\,1+\epsilon_{\text{high}}\bigr)\,\hat A_t\Bigr\}
$$

$\operatorname{clip}(r,a,b)$ confines $r$ to $[a,b]$. PPO maximizes the sample average of $C_t$. This formula and the table above say the same thing. The key is that when $r_t$ falls outside the interval, the clipped value in the second term is a fixed boundary number that does not contain $\theta$, and its gradient with respect to $\theta$ is zero. So whenever the $\min$ picks the second term and the clip is active, the sample has no gradient.

**Numerical example.** Take $\epsilon_{\text{high}}=\epsilon_{\text{low}}=0.2$ and $\hat A_t=\pm 2$. Of these, $r_t=10$ and $r_t=0.5$ are numbers the lecturer gives out loud in class; the values of $\hat A_t$ and the remaining rows are made up for this article, and every row has been recomputed.

| $\hat A_t$ | $r_t$ | First term $r_t\hat A_t$ | $r_t$ after clip | Second term | $\min$ picks | Gradient? |
|---|---|---|---|---|---|---|
| $+2$ | $10$ | $20$ | $1.2$ | $2.4$ | second term, $2.4$ | No (constant) |
| $+2$ | $0.5$ | $1.0$ | $0.8$ | $1.6$ | first term, $1.0$ | Yes, pushes up |
| $+2$ | $1.1$ | $2.2$ | $1.1$ | $2.2$ | the two are equal | Yes, pushes up |
| $-2$ | $0.5$ | $-1.0$ | $0.8$ | $-1.6$ | second term, $-1.6$ | No (constant) |
| $-2$ | $3$ | $-6$ | $1.2$ | $-2.4$ | first term, $-6$ | Yes, pushes down |

The second row is where students get stuck in class. At $r_t=0.5$ the clip pulls it up to $0.8$, the second term becomes larger, and the $\min$ goes back to the unclipped first term, so the gradient is still there. For a good action, having lower probability than under the old policy is exactly when an update is needed most. Note the last row too: when $r_t$ is large for a bad action, PPO does not clip at all and accepts the coefficient $r_t=3$ in full. This is the spot that CISPO, in the next section, changes.

The discussion of this design in class makes three points:

- **Why do it this way.** The original motivation, as the lecturer relays it, is to keep the new policy from drifting too far from $\pi_{\theta_{\text{old}}}$, so that the "use the old policy's state distribution" approximation holds up. He adds: "I don't know whether that's exactly the reason, but that's the story".
- **Does learning slow down.** A student asks this, and the lecturer answers yes: the clipped samples simply stop being learned from.
- **Should the two $\epsilon$ be the same.** Some papers set the two sides to different values. The lecturer's view is that loosening $\epsilon_{\text{high}}$ a little does little harm; at worst the new policy is already twice as good as the old one and keeps learning. The $\epsilon_{\text{low}}$ side involves diversity: push a bad action's probability too low and the policy becomes too deterministic and easily gets stuck in a local solution. That action might be good in combination with other actions, so it should be left some chance.

The PPO objective in the notes carries an extra minus sign, written as a loss to minimize, and the notes mention adding a separate KL regularization term and GAE. In class the objective is maximized directly and GAE is not covered.

## CISPO: clamp the coefficient without switching the gradient off

(recording 51:08–56:21)

The lecturer then introduces CISPO, saying it is very popular now and that in their own training they mostly use it and not PPO. He attaches the same caveat: he is not sure it is the fundamentally right algorithm. While drawing the figure he briefly calls PPO "GRPO", corrects himself at once, and says GRPO is an advanced version of PPO that handles clipping the same way.

The "coefficient" view from earlier makes this clearest. Each sample contributes the gradient "coefficient × $\hat A_t$ × $\nabla_\theta\log\pi_\theta$", and without clipping the coefficient is $r_t$. In the figure drawn in class the horizontal axis is $r_t$ and the vertical axis is this coefficient. The table below is reconstructed from what is said aloud and from equation (18.9) in the notes; I did not see the figure itself:

| | PPO | CISPO |
|---|---|---|
| $\hat A_t>0$, $r_t>1+\epsilon_{\text{high}}$ | Coefficient goes to zero; no learning at all | Coefficient held at the cap; still learning, but it stops growing |
| $\hat A_t<0$, $r_t<1-\epsilon_{\text{low}}$ | Coefficient goes to zero | Not clipped; the coefficient is still $r_t$ |
| $\hat A_t<0$, $r_t>1+\epsilon_{\text{high}}$ | Not clipped; the coefficient is $r_t$ | Coefficient held at the cap |

CISPO's rationale has nothing to do with "has it learned enough". The idea the lecturer relays is that a large $r_t$ is bad in itself, because it directly makes this term's gradient large. A ratio of probabilities can get absurdly big; the numbers he gives are $0.6/0.2=3$ and $0.6/0.01=60$. So CISPO does not distinguish good actions from bad ones, and clamps every large coefficient.

Compare using the numbers from the previous section (with the cap at $1.2$): for a good action with $r_t=10$, PPO's coefficient is 0 and CISPO's is 1.2; for a bad action with $r_t=3$, PPO's is 3 and CISPO's is 1.2; for a bad action with $r_t=0.5$, PPO's is 0 and CISPO's is 0.5. In this last case CISPO keeps pushing down a bad action that has already become rare, and the lecturer says he has indeed seen this family of algorithms cause a loss of diversity in his own projects.

Chapter 18 of the notes writes CISPO as

$$
L_{\text{CISPO}}=-\,\mathbb E\Bigl[\operatorname{stopgrad}\bigl(\min\{r_t(\theta),\,\epsilon_{\text{high}}\}\bigr)\,\hat A\,\log\pi_\theta(y_t\mid x,y_{<t})\Bigr]
$$

$\operatorname{stopgrad}$ means the value in the brackets is used only as a coefficient and no gradient flows back through it, which is exactly "the coefficient is clamped and the gradient of $\log\pi_\theta$ is kept". Note that $\epsilon_{\text{high}}$ in the notes is itself the cap, corresponding to $1+\epsilon_{\text{high}}$ in the lecture's figure.

The lecturer closes the topic briskly:

> "every few months, there's a different clipping." (recording, around 55:18)

He says there are also papers that mix CISPO-style and PPO-style clipping, that this is still an open research question, and that nobody knows the real answer.

## Chain of thought: let the model think first, then answer

(recording 56:21–1:02:29)

The second half of the lecture switches to language models. The earlier setup was to give a prompt $x_1,\dots,x_l$ (say, "what is 1 plus 1") and have the model generate the answer $y_1,\dots,y_k$ directly. People later found that making the model answer immediately is not always best, and that it should be allowed to think first. **Chain of thought (CoT)** means that after the prompt the model first generates a stretch of thinking tokens $z_1,\dots,z_n$ and then generates the answer. The thinking part is often wrapped in special tokens, though the lecturer says not every model does this.

The approach was discovered on math problems that need several steps. A person cannot see the answer at a glance either and has to compute step by step; thinking tokens lay those intermediate computations out. The lecture covers three stages in chronological order:

- **Few-shot CoT.** Put a few hand-written examples in the prompt, each with a question, a step-by-step thinking process, and an answer, then append the new question so that the model follows the pattern.
- **Zero-shot CoT.** No examples; just add "Let's think step by step" after the question. The lecturer says these few words alone can raise accuracy by 5%, 10%, sometimes 20% or even more.
- **Teaching it with supervised fine-tuning.** Since it helps this much, hand-build a dataset with step-by-step thinking and fine-tune the model on it.

The third route does not go far, because nobody knows what "the best way to think" looks like. The lecturer describes what the thinking tokens of open-source models actually look like: not very logical, going back and forth, sometimes in very terse abbreviations, sometimes doubting the question itself. It is not a clean shortest path, and it resembles a person trying different ideas and going back to check while solving a problem. He also mentions research that tried generating very concise thinking, which turned out to be of little use to the model because thinking that way is too hard. Since this messy but effective thinking cannot be written by hand, the supervised approach is hard to keep scaling.

## Writing generation as an MDP: reward only the final answer

(recording 1:02:29–1:08:50)

The advantage of reinforcement learning is that it needs no annotation of "how to answer", only a judgment of whether the answer is right. In the lecturer's words:

> "You don't really care about how the thinking was done. You just care about the final answer is right." (recording, around 1:03:34)

To apply the tools from the first half, language model generation first has to be mapped onto an MDP. This part does not distinguish thinking from answer, and writes all the tokens the model generates after the prompt as $y_1,\dots,y_n$:

| MDP component | What it is in a language model |
|---|---|
| State $s_t$ | The prompt plus the tokens generated so far, $(x,\,y_{<t})$ |
| Action $a_t$ | The next token $y_t$ |
| Policy $\pi_\theta(a_t\mid s_t)$ | The model's next-token probability $p_\theta(y_t\mid x,y_{<t})$ |
| Transition | Append $y_t$, giving $s_{t+1}=(x,\,y_{\le t})$; fully deterministic |
| Reward | Given once, when the whole generation ends |

The transition is deterministic, with no randomness at all, but that does not make the problem easy. The lecturer points out that the sequence is long and that the right token has to be chosen at every step to arrive at the answer in the end.

The reward is simply "does the answer part match the reference answer": 1 if it does, 0 otherwise. This requires every question in the dataset to have a reference answer, as with math computation problems. This is what the notes call **RLVR** (reinforcement learning with verifiable rewards).

Implementation raises a very practical question: how do you extract the answer from a large block of output? The lecturer says you cannot call in another AI model to extract it, and a very pragmatic method is used instead: require the model to put its answer inside an XML-like answer tag, pull out the tag's content with a parser, and compare it with the reference answer. A wrong format earns no reward either. He adds that as models get stronger other formats can be required, but it started out this simple.

## Applying PPO, with 8 samples of the same question as the baseline

(recording 1:08:50–1:13:05)

With the MDP mapping in place, PPO or CISPO can be applied unchanged. The ratio becomes token-level:

$$
r_t(\theta)=\frac{\pi_\theta(y_t\mid x,y_{<t})}{\pi_{\theta_{\text{old}}}(y_t\mid x,y_{<t})}
$$

Everything else follows the formulas from the first half. The lecturer mentions two details. One is that a regularization term can be added to keep the policy from straying too far from some reference policy; he says this was very useful early on and he is not sure whether it still is. The other is how to design the baseline.

The older approach was to learn a separate value function to estimate the baseline. The newer one is much simpler: for the same question $x$, sample 8 trajectories, obtain rewards $R^{(1)},\dots,R^{(8)}$, and use their average $\bar R$ as the baseline. (The lecture writes rewards with a lowercase $r$; to avoid confusion with the ratio $r_t$, this article uses uppercase, matching the notes.) $\bar R$ reflects "how hard this question is at this point in training". Chapter 18 of the notes files this kind of baseline under GRPO (Group Relative Policy Optimization): several answers to the same question are compared against one another, replacing a separately trained value model. The GRPO in the notes additionally divides by the standard deviation of this group of rewards, and its clipping reuses the PPO formula. The lecture does not call this approach GRPO; the name comes up only in passing during the CISPO discussion.

**Numerical example (the two sets of numbers from the lecture).**

| Rewards of the 8 samples | Mean $\bar R$ | Correct samples after adjustment | Incorrect samples after adjustment |
|---|---|---|---|
| 1 correct, 7 incorrect | $1/8$ | $1-\tfrac18=\tfrac78$ | $0-\tfrac18=-\tfrac18$ |
| 4 correct, 4 incorrect | $1/2$ | $+0.5$ | $-0.5$ |

The first row says: this question is hard, right only 1 time in 8, so the one correct trajectory receives a large positive weight of $7/8$ and the probability of every token on it is pushed up noticeably; each of the other 7 gets a light push down. The second row is a question that is half right and half wrong, where correct and incorrect are pushed equally hard. The same "correct" earns a larger weight on a hard question than on an easy one.

The lecturer says you can also divide by the standard deviation to adjust the scale, and leaves that as reading after class. **What follows is computed for this article from equation (18.7) in the notes and is not lecture content** (ignoring the small constant in the denominator): when the rewards are only 0 and 1 and the fraction correct is $p$, the standard deviation is $\sqrt{p(1-p)}$. In the first row $p=1/8$ and the standard deviation is $\sqrt{7}/8\approx 0.331$, so a correct sample becomes $\tfrac78\div 0.331\approx 2.65$ and an incorrect one becomes $-\tfrac18\div 0.331\approx -0.38$. In the second row $p=1/2$, the standard deviation is $0.5$, and the adjusted values are $\pm 1$.

**Two additions in this article.** First, $\bar R$ actually includes the sample's own reward, so strictly speaking it is not a baseline that "depends only on the state". But you can compute directly that $R^{(i)}-\bar R=\tfrac{7}{8}\bigl(R^{(i)}-\text{mean of the other 7}\bigr)$, which means it equals a legitimate baseline (the average excluding the sample itself) times the fixed factor $7/8$, so the direction is not distorted. Second, if all 8 samples are wrong then $\bar R=0$, every sample is 0 after adjustment, and this question has no gradient at all (when all 8 are right, $\bar R=1$ and everything is 0 as well). The all-wrong case leads straight to the student question in the next section.

## End-of-lecture Q&A: the first nonzero reward, graders that can be fooled, where the compute goes

(recording 1:13:05–1:18:56)

**The space of possible thinking is so large; how does the model find a correct trajectory?** The lecturer's answer:

> "you have to start with some policy that can give you a non-zero reward." (recording, around 1:13:05)

The starting model must already have a little ability and get the answer right once in a while. As long as there is one successful trajectory, as in the 1-right-7-wrong case above, it is reinforced with weight $7/8$ and the others are pushed down, the behavior gradually becomes more common, and from there it snowballs by itself. The lecturer gives the example that some models have almost no ability to think; put them through reinforcement learning and the reward starts at 0 and then stays at 0. Other models start with a little thinking ability, and for them the snowball gets going. He also says that this way of putting it is a bit of an exaggeration.

The ways to get that first nonzero reward mentioned in class: do supervised fine-tuning first, building data that contains thinking processes and even deliberately including reflection such as "I checked my earlier answer, found it was wrong, and corrected it"; in addition, pretraining data already contains some long-winded thinking. As for what else frontier labs do, the lecturer says he does not know.

**Does the reward have to be computed by a program doing comparison?** When there is a reference answer, a very simple program does the comparison. For tasks without one, some people use a large language model as the grading function, and the risk is that the grading can be gamed: the grader may look only at format and style without really checking whether the answer is right, and the answering model learns to cater to that. The lecturer says a small grader model will certainly be gamed, and whether a very large grader avoids it is not yet clear.

**How do the compute requirements differ from ordinary training?** One round of updates has three stages: generating trajectories, computing rewards, and computing gradients for training. The lecturer thinks generation is usually slower than training, because generation can only go one token after another and cannot feed the whole sequence through in a single forward pass the way training does. Generation also slows down as it gets longer, and the KV cache (the cache covered in [Lecture 16](/posts/ai/2026-10-12-stanford-cs229-lecture-16-attention-variants-in-context-learning-en)) has to be kept in memory. Pretraining has no generation stage; the data is downloaded and processed ahead of time. That is the biggest difference between the two.

## Self-check

**1. Why can the baseline depend on $s_t$ but not on $a_t$? Point to the step of the derivation that breaks.**

Criterion: the answer should mention that the inner expectation in the law of total expectation is taken over $a_t$. $B(s_t)$ is a constant given the history and can be pulled outside the inner expectation, leaving $\mathbb E_{a_t}[\nabla_\theta\log\pi_\theta(a_t\mid s_t)]=0$. If $B$ depends on $a_t$, it cannot be pulled out, the inner expectation becomes $\mathbb E_{a_t}[\nabla_\theta\log\pi_\theta\cdot B(s_t,a_t)]$, which is not zero in general, and the expected gradient is changed.

**2. Take $\epsilon_{\text{high}}=\epsilon_{\text{low}}=0.2$ and $\hat A_t=-1$. Compute PPO's $C_t$ for $r_t=0.6$ and for $r_t=1.5$, and say whether there is a gradient. What is the CISPO coefficient (cap 1.2) in each case?**

Answer: at $r_t=0.6$ the first term is $-0.6$, the clipped ratio is $0.8$ and the second term is $-0.8$; the $\min$ picks $-0.8$, a constant, so there is no gradient. At $r_t=1.5$ the first term is $-1.5$, the clipped ratio is $1.2$ and the second term is $-1.2$; the $\min$ picks $-1.5$, there is a gradient, and it pushes the probability of this bad action down. The CISPO coefficients are $0.6$ and $1.2$ respectively.

**3. Sample 8 answers to the same question, 2 of them correct. What is each sample's weight after subtracting the mean? What if you then divide by the standard deviation?**

Answer: $\bar R=0.25$; correct samples get $+0.75$ and incorrect ones get $-0.25$. The standard deviation is $\sqrt{0.25\times 0.75}\approx 0.433$; after dividing, correct samples are about $+1.73$ and incorrect ones about $-0.58$.

**4. Why can plain policy gradient not take two steps in a row on the same batch of trajectories? To make that possible, which approximation does PPO make and leave uncorrected?**

Criterion: the first part should say that the estimator requires trajectories sampled from the current $\theta$, and that after one step the samples belong to an old policy. The second part should say that PPO corrects only the action distribution, through the ratio $r_t$, and uses the old policy's state distribution as is; clipping keeps the new policy from moving too far from the old one, which is what makes this approximation defensible.

**5. The MDP transition for a language model is fully deterministic. Why can training still fail to learn anything at all?**

Criterion: the reward is given only once at the end, and it is only 0 or 1. If the starting model gets every sample of a question wrong, the mean is 0, every sample's weight is 0, and there is no gradient. So a starting point that is occasionally right is needed; the sources mentioned in class are supervised fine-tuning and pretraining data.

## Corresponding reading

- **Main notes, Chapter 21, §21.1 REINFORCE (pp. 258–263)**: corresponds to the first four sections of this lecture. Equations (21.9) through (21.11) derive reward-to-go and the baseline, and Algorithm 7 is the algorithm with a baseline. The notes cover two things the lecture does not: that a near-optimal baseline is the value function, and how to fit $B$ by least squares (equation 21.12). The "1000 plus or minus a little" example in footnote 3 is the numerical example in this article's baseline section. The notes pull $\gamma^t$ out of the reward-to-go, and footnote 4 says implementations often just drop that discount factor; the lecture does not deal with this detail.
- **Main notes, Chapter 21, §21.2 PPO (pp. 263–265)**: corresponds to the three sections on on-policy sampling, importance sampling, and clipping. The notes start from the reward-to-go version of the surrogate objective (21.16), with the state distribution written as the old policy's from the outset; the lecture first writes an exact equation for the single-step reward and then makes two approximations. The notes use a single $\epsilon_{\text{clip}}$, while the lecture splits it into $\epsilon_{\text{high}}$ and $\epsilon_{\text{low}}$ and discusses why the two sides may differ. PPO's full name (Proximal Policy Optimization) and its source are in the notes; in class the lecturer says he does not quite remember them.
- **Main notes, Chapter 18, §18.1–18.2 (pp. 220–225)**: corresponds to the second half of the lecture. §18.1 gives sources for few-shot and zero-shot CoT; §18.2 has the formal statement of RLVR, the KL-regularized objective (18.2), token-level PPO (18.4)–(18.6), GRPO (18.7)–(18.8), and CISPO (18.9). The training curves for o1 and DeepSeek-R1 mentioned in the notes (Figure 18.1) are not covered in class; the lecture's discussions of "you need a starting point with nonzero reward", "grading with a language model can be gamed", and "generation is slower than training" are not in the notes.

## Where the course ends up

This is the last video in the Spring 2026 public recordings. Looking back over the whole route:

- **Opening**: [Lecture 1](/posts/ai/2026-10-12-stanford-cs229-lecture-01-introduction-en) marks out the three areas of supervised, unsupervised, and reinforcement learning.
- **Supervised learning (Lectures 2–6)**: [linear regression](/posts/ai/2026-10-12-stanford-cs229-lecture-02-supervised-learning-linear-regression-en), [maximum likelihood and logistic regression](/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression-en), [exponential families, generalized linear models, and softmax](/posts/ai/2026-10-12-stanford-cs229-lecture-04-exponential-family-glm-en), [Gaussian discriminant analysis and Naive Bayes](/posts/ai/2026-10-12-stanford-cs229-lecture-05-gaussian-discriminant-analysis-en), and then one lecture on [bias and variance, regularization, and model selection](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization-en).
- **Neural networks (Lectures 7–8)**: [architecture](/posts/ai/2026-10-12-stanford-cs229-lecture-07-neural-network-architecture-en) and [backpropagation](/posts/ai/2026-10-12-stanford-cs229-lecture-08-backpropagation-en).
- **Unsupervised learning (Lectures 9–10)**: [k-means and Gaussian mixture models](/posts/ai/2026-10-12-stanford-cs229-lecture-09-k-means-gmm-en), and [the EM algorithm and PCA](/posts/ai/2026-10-12-stanford-cs229-lecture-10-em-pca-en).
- **Generative models and foundation models (Lectures 11–16)**: [diffusion models](/posts/ai/2026-10-12-stanford-cs229-lecture-11-diffusion-models-en), [the diffusion noise-prediction loss, foundation models, and LoRA](/posts/ai/2026-10-12-stanford-cs229-lecture-12-diffusion-loss-foundation-models-lora-en), [contrastive learning and semantic retrieval](/posts/ai/2026-10-12-stanford-cs229-lecture-13-representation-learning-semantic-search-en), [the next-token loss of language models and attention](/posts/ai/2026-10-12-stanford-cs229-lecture-14-llm-next-token-attention-en), and [attention variants, MoE, and prompting](/posts/ai/2026-10-12-stanford-cs229-lecture-16-attention-variants-in-context-learning-en).
- **Reinforcement learning (Lectures 18 and 20)**: [the previous lecture](/posts/ai/2026-10-12-stanford-cs229-lecture-18-rl-basics-policy-gradient-en) sets up MDPs and policy gradient, and this one connects them to training language models to reason.

The missing Lectures 15 and 17 are guest lectures with no public recording.

Linear regression in Lecture 2 and RLVR in this lecture share the same skeleton: write down an objective, take its gradient with respect to the parameters, estimate that gradient from samples, and take a step. The difference is that in this lecture the model generates its own data, and the label has shrunk to a single bit, namely whether the final answer is right.

**Series navigation**: Previous: [Lecture 18: reinforcement learning basics and policy gradient](/posts/ai/2026-10-12-stanford-cs229-lecture-18-rl-basics-policy-gradient-en) | There is no next lecture; go back to the [course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en)

## Course video sources

Original video: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 20: GMM (EM), PCA](https://www.youtube.com/watch?v=J7CossjMvEg)

- [Stanford CS229 Machine Learning | Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 course website](https://cs229.stanford.edu/)
- [CS229 main lecture notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

Checked: 2026-10-12.

Content check: verified against the video transcript (2026-10-12): I read the English transcript of the whole video (about 79 minutes); its content is the wrap-up of policy gradient, PPO, CISPO, and training language models to reason with reinforcement learning. I did not see the board, and the formulas are reconstructed from what is said in the transcript and from Chapters 18 and 21 of the main lecture notes. Places where the lecturer points at the board and says "this one" and the reference could not be recovered are left out of this article.

## References

- [Stanford CS229 Spring 2026 Lecture 20 recording (YouTube)](https://www.youtube.com/watch?v=J7CossjMvEg): all lecture content, quotations, and timestamps in this article come from the English transcript of this video.
- [CS229 main lecture notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf): Chapter 21 is used to reconstruct the formulas for reward-to-go, the baseline, and PPO, and the numerical example in footnote 3; Chapter 18 is used to reconstruct the MDP formulation of RLVR, GRPO's standard-deviation scaling, and the CISPO formula.
- [Reading Stanford CS229: course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): the entry point to the series and where each lecture sits.
- [Lecture 18: reinforcement learning basics and policy gradient](/posts/ai/2026-10-12-stanford-cs229-lecture-18-rl-basics-policy-gradient-en): the gradient formula this lecture starts from is derived there.
