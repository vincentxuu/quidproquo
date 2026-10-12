---
title: "Reinforcement Learning Basics and Policy Gradient: Taking a Gradient When the Parameters Hide in the Sampling Distribution | Stanford CS229 Lecture 18"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, reinforcement-learning, mdp, policy-gradient]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 16
tldr: "The first 55 minutes of this lecture write sequential decision making as an MDP (states, actions, transition probabilities, rewards, discount factor) and show that the Bellman equation for a fixed policy is a system of linear equations. The last 20 minutes derive policy gradient: ∇p = p∇log p turns the gradient back into an expectation, the transition probabilities drop out of the gradient because they don't contain θ, and the lecture stops at the formula \"sum of log-probability gradients × sum of discounted rewards\", leaving variance reduction for the next lecture."
description: "A guide to Lecture 18 of Stanford CS229 Spring 2026: the five components of an MDP, the risks of reward shaping, a step-by-step derivation of the Bellman equation with a three-cell strip as a numerical example, and the log-derivative-trick derivation of REINFORCE with a two-action check."
draft: false
math: true
---

> 🌏 [中文版](/posts/ai/2026-10-12-stanford-cs229-lecture-18-rl-basics-policy-gradient)

**Video status: Videos included.** This article is written from the English transcript of the Spring 2026 Lecture 18 recording published by Stanford Online, with notation checked against Chapters 19 and 21 of the 2026 main lecture notes. I did not see the board, so the equations written on it are reconstructed from the surrounding transcript and the notes. The topic in the YouTube title (GMM (EM), PCA) does not match the content: this video actually covers reinforcement learning basics and policy gradient, and what follows goes by the actual content.

This is the first reinforcement learning lecture in [Reading Stanford CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en), following [Lecture 16 (attention variants, MoE, and prompting)](/posts/ai/2026-10-12-stanford-cs229-lecture-16-attention-variants-in-context-learning-en) (Lecture 17 was a guest lecture that was not made public). It is taught by Tengyu Ma: Chris Ré, who shared the spring lectures with him, said at the end of Lecture 10 that it was his last class of the term. Below I call him "the lecturer".

The models in the previous dozen or so lectures all make predictions: take an input, produce an output, compare with a label. This lecture changes the kind of problem. The model has to make many decisions in a row, each decision changes the situation it faces next, and nobody tells it the right answer at each step. It only gets a score afterwards. The prerequisites are expectations, conditional probability, the chain rule, and the derivative of log, plus solving linear equations in two or three unknowns. After reading, you should be able to do three things: write a small decision problem as an MDP, set up and solve the Bellman equations for a fixed policy, and derive the policy gradient formula from scratch while explaining why each step holds.

```youtube
url: https://www.youtube.com/watch?v=xveNBYVTrqw
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 18: GMM (EM), PCA
captions: en
```

## What problem reinforcement learning solves (recording 00:05–07:26)

The lecturer opens with the plan: this week covers the basics of reinforcement learning, and next week covers how reinforcement learning is used on large language models, especially for training models with long reasoning chains. Today deliberately uses robots as the setting, because handling "the reinforcement learning setup" and "how to apply it to language models" at the same time is too messy. He wants the first one clean before moving on.

He calls the problem **sequential decision making** and looks at the two parts separately:

- **decision making**: what you do affects the future. A task that ends once you predict doesn't count; actions with consequences, such as operating a robot or placing an order, do.
- **sequential**: you decide more than once. When you operate a robot, you have to issue a command at every time step.

Put the two together and the greedy approach breaks down. In the lecturer's words, "What is the optimal for the moment may not be optimal for the future." (02:18)

He then brings up the **exploration–exploitation trade-off**, with the example of finding restaurants in a new city: you eat at some restaurants only to gather information. Given what you know now, they may not be the best choice, but only after eating there do you know whether to keep going back or never return. He makes a point of explaining why he mentions this at the start and then barely returns to it: in the applications that are common today the trade-off is subtle, and often nobody handles it specially, because the randomness built into the algorithm is enough. Only the more classical settings study it in depth. So this lecture concentrates on the long-term consequences that come from "sequential".

Another feature of reinforcement learning is that there is almost no human supervision. The training data doesn't contain "the best action at this step". It only contains a **reward**: a scalar that tells you whether this sequence of actions was good, but not which action was the right one. As a consequence, the algorithm has to collect its own data. The process the lecturer describes: generate some actions for the robot and let it actually try them; if the result is bad, penalize it so it does that less; if it happens to do well, encourage it so it does that more. He calls this "a trial and error approach" (06:26), with data collection and training alternating. This intuition of "reinforce the good, suppress the bad" turns into a concrete gradient formula by the end of the lecture.

## MDPs: states, actions, transition probabilities (recording 07:26–17:53)

To talk about algorithms, we first need a language for describing the world and how actions change it. That language is the **Markov decision process (MDP)**.

The lecturer's running example is a one-dimensional strip: a row of numbered cells (he first says 1 to 10), with a robot standing in one of them. You can tell it to go left or right, and the goal is to reach a particular cell. He also mentions Go in passing as a contrast: the board is two-dimensional, and each action places one stone.

**The state set $S$.** The state is all the information needed to describe the world. In the strip example the state is which cell the robot is in, $S=\{1,\dots,10\}$. A real robot's state would be the positions and angles of its joints, sometimes also camera images. The state in Go is the whole board, and the lecturer says the number of possible boards is $3^{361}$.

A student asks whether information about the robot's surroundings should go into the state. The lecturer answers that this is a modeling choice. In theory the state should contain everything, but you can't model every detail and always have to abstract some away. People generally don't put a 3D map of the whole world in the state; mostly they rely on camera images.

**The action set $A$.** In the strip example it is $\{L, R\}$. For a real robot it might be how much force to apply at each joint. In Go it is where to place the stone.

**The transition probabilities $P_{sa}$.** Where do you end up after taking action $a$ in state $s$? The answer is a probability distribution. For each pair $(s,a)$, $P_{sa}$ is a distribution over the whole state space, and $P_{sa}(s')$ is the probability of reaching $s'$. When there are finitely many states, $P_{sa}$ is a vector of dimension $|S|$.

Transitions can be deterministic or random. Assuming an imprecise controller, the lecturer gives these numbers for standing in cell 7 and commanding a move to the left:

$$
P_{7,L}(6)=0.9,\qquad P_{7,L}(7)=0.1,\qquad P_{7,L}(8)=0,\qquad P_{7,L}(5)=0
$$

With probability 0.9 the robot really moves to 6, and with probability 0.1 it stays put. It never goes the wrong way to 8, and never jumps two cells to 5. Every pair $(s,a)$ needs a definition like this, satisfying

$$
\sum_{s'\in S} P_{sa}(s') = 1
$$

Partway through, the lecturer notices he has been writing the next state sometimes as $z$ and sometimes as $s'$, and uses $s'$ from then on. This article uses $s'$ too.

With these three things we can describe how the interaction proceeds. Start from an initial state $s_0$ (the subscript is time), and the algorithm picks an action $a_0$. The lecturer adds that the side picking actions is also often called the agent. Then the environment takes a step and draws $s_1$ from $P_{s_0a_0}$. The algorithm looks at $s_1$ and picks $a_1$, the environment draws $s_2\sim P_{s_1a_1}$, and the loop continues:

$$
s_0 \xrightarrow{a_0} s_1 \xrightarrow{a_1} s_2 \xrightarrow{a_2} \cdots,\qquad s_{t+1}\sim P_{s_ta_t}
$$

## Setting rewards, and the risks of reward shaping (recording 17:53–25:09)

So far we have only described the interaction, not what counts as success. The **reward function** $R: S\to\mathbb{R}$ maps each state to a real number saying how good that state is. The lecturer says the values often fall around $-1$ to $1$ and can be positive or negative. Some people define the reward as $R(s,a)$, or even $R(s,a,s')$. He says the theory barely changes, and for simplicity the lecture only uses $R(s)$.

In the strip example the goal is cell 9, and the lecturer sets:

$$
R(9)=1,\qquad R(s)=-0.1\ \ (s\neq 9)
$$

Every step spent in any other cell costs points, so this reward encourages the robot to reach 9 as quickly as possible and stay there.

A student follows up: could the reward be higher the closer you are to 9? The lecturer says yes, the reward is yours to set, but he separates two cases. In the first, you really do think being at 8 is better than being at 7. That is your preference, and writing it honestly into the reward is fine. In the second, you only care about whether the robot reaches 9, but you still make the reward a slope so the algorithm learns more easily (his phrasing is that there is more gradient to use). The second case is called **reward shaping**.

Reward shaping has unintended side effects. The lecturer imagines the strip has a teleport you didn't know about when you set the reward, going straight from cell 2 to cell 9. A "closer to 9 is better" reward pushes the robot to the right, but the best route may be to walk to 2 and teleport. On the strip this sounds odd; on a real robot it is ordinary. When reaching for an object you would think the closer the hand the better, so you give decreasing rewards like 0.9, 0.8, 0.7. But if something is in the way and the arm has to go around it, that reward is misleading the robot. His advice is "you should just really care about the final outcome" (23:05).

Pressed further, he adds a caveat: if you understand the environment well, shaping can be made to work; if you don't, or the environment is too complex, focus on the core objective. He compares it to a manager running a team: a manager who knows exactly how the work should be done can give very detailed feedback, while other managers only state the final goal and don't care how you get there (24:06).

Another student asks whether the agent can change the reward function. The lecturer says that in this setting it can't. The reward is the incentive mechanism from the layer above the agent.

## Return, the discount factor, and the five components of an MDP (recording 25:09–31:50)

$R$ only evaluates a single state. A whole sequence $s_0,a_0,s_1,a_1,\dots$ is called a **trajectory**. The lecturer says the earlier, more standard RL setups called it an episode, and trajectory is more common now. The score of a whole trajectory is called the return or payoff, and it is the sum of the rewards of the states along it. Because state transitions are random, you can't be sure which states you will visit even if you fix all the actions, so we talk about the expected return.

Usually we also add a **discount factor** $\gamma$, between 0 and 1 and often very close to 1. The lecturer's example number is 0.99:

$$
R(s_0)+\gamma R(s_1)+\gamma^2R(s_2)+\cdots=\sum_{t\ge 0}\gamma^tR(s_t)
$$

He explains it with interest rates: 1 dollar today is worth more than 1 dollar a hundred years from now. This doesn't mean only looking at the present. Discounting says that if you can choose when to receive the same reward, sooner is better. The best plan may still be to get nothing at first in exchange for more later.

Discounting also has a mathematical benefit: the return stays bounded even with infinitely many steps. Suppose the absolute value of the reward at every step is at most $M$. Then

$$
\Bigl|\sum_{t\ge0}\gamma^tR(s_t)\Bigr|\le\sum_{t\ge0}\gamma^tM=M(1+\gamma+\gamma^2+\cdots)=\frac{M}{1-\gamma}
$$

The first inequality uses the triangle inequality (the absolute value of a sum is at most the sum of absolute values) together with $|R(s_t)|\le M$, and the last step sums a geometric series (the Bellman equation section below derives it again by recursion). In class the lecturer only says out loud "at most $M$ at the first step, at most $\gamma M$ at the second"; the triangle inequality step is an addition in this article. He notes that treating the number of steps as possibly infinite is less common nowadays. The other effect of discounting is to encourage getting rewards early. If you want a robot to pick up a cup, you want it to take the shortest path, not spend a year slowly approaching.

Together the five things make an MDP: $(S, A, \{P_{sa}\}, R, \gamma)$.

Two student questions here are worth recording. One student described the transition probabilities as a set of "rules"; the lecturer says he wouldn't use the word rules, because they are probability distributions. Another felt that real-world states (a drone, say) are too many to handle, and altitude can grow without bound, so how do you define each state? The lecturer says a drone's state is actually simple: altitude, a few velocities, motors on or off. Altitude is just one scalar dimension of the state vector. States can be continuous, and even discrete states don't have to be finite.

## The Markov property and policies (recording 31:50–39:45)

The goal is to maximize the expected return. To do that, we have to decide the action at every step.

The lecturer first points out what "Markov" means in MDP: where you go depends only on where you are now and what action you take, not on the history. The distribution of $s_2$ depends only on $s_1$ and $a_1$. Looking further ahead, the distribution of $s_{t+j}$ depends only on $s_t$ and the actions after time $t$; everything that happened before $t$ is irrelevant. His words are "The past is the past." (33:22)

This gives an important conclusion: the best action at time $t$ only needs to be a function of $s_t$. How you got to $s_t$ doesn't matter, because the future depends only on the present. So what we are looking for shrinks to a mapping from states to actions, which is a **policy**:

$$
\pi: S\to A,\qquad a_t=\pi(s_t)
$$

For the strip example (without the teleport) the optimal policy is intuitive: go right if you are left of the goal, otherwise go left.

A policy like this is a **deterministic policy**. The lecturer says it is known that a deterministic optimal policy always exists, and the reason is simple: pick the best action in each state, and break ties by picking any one and sticking with it. "So there's no reason to randomize, because there's always one option that is better than all the others or as good as all the others." (35:40)

In practice, though, people also use a **stochastic policy**, written $\pi(a\mid s)$: given a state, it outputs a probability distribution over actions. A student asks why a stochastic policy is usually no better than a deterministic one, and the lecturer gives numbers: the policy picks action 1 with probability 0.9 and action 2 with probability 0.1. If action 1 has payoff 1.0 and action 2 has payoff 2.0, mixing only gets you something between 1.0 and 2.0, and what you should do is just pick action 2. At least one of the two actions is no worse than the mixture, so hedging is pointless.

Then why randomize during training? The lecturer says the underlying reason is continuity. As the parameters move, a deterministic policy suddenly jumps from action 1 to action 2 at some point. A probability distribution can move from 50/50 to 40/60 to 30/70, changing smoothly. With policy gradient this becomes a hard requirement.

## Value functions and the Bellman equation (recording 39:45–55:39)

The **value function** is much like the return, except that it specifies which state you start from and which policy you follow throughout:

$$
V^\pi(s)=\mathbb{E}\bigl[R(s_0)+\gamma R(s_1)+\gamma^2R(s_2)+\cdots \bigm| s_0=s\bigr]
$$

The randomness inside the expectation comes from $s_{t+1}\sim P_{s_ta_t}$, and the actions are produced by $\pi$, hence the superscript $\pi$. Next define

$$
V^\star(s)=\max_\pi V^\pi(s),\qquad \pi^\star=\arg\max_\pi V^\pi(s)
$$

$V^\star(s)$ means: how much you can get starting from $s$ if every later decision is the best one. The lecturer says this is close to a tautology; it is purely a definition.

Then he gives a heads-up: the **Bellman equation** that comes next isn't very useful for the second half of this lecture and isn't that important for reinforcement learning on language models either, but it is extremely important in classical reinforcement learning, and you should at least know it exists and roughly what the idea is (42:56).

### The recursion, seen first in a geometric series

The idea is the same as summing a geometric series. Let

$$
V=1+\gamma+\gamma^2+\gamma^3+\cdots
$$

Pull out the first term, and every remaining term has a factor of $\gamma$ to take out:

$$
V=1+\gamma(1+\gamma+\gamma^2+\cdots)=1+\gamma V
$$

The thing in parentheses looks exactly like $V$ itself, so we get an equation with $V$ on both sides. It doesn't tell you directly what $V$ is, but you can solve it: $V(1-\gamma)=1$, so $V=\dfrac{1}{1-\gamma}$. (The transcript has "V is equal to 1 minus gamma" here, which is probably a slip of the tongue or a dropped word in the captions; from the previous step the result is $1/(1-\gamma)$.)

### Deriving the Bellman equation for V^π

Do the same thing to $V^\pi$. For simplicity the lecturer uses a deterministic policy here, $a_0=\pi(s)$, and assumes infinitely many terms.

**Step 1: pull out the first term.** The condition is $s_0=s$, so $R(s_0)$ is just $R(s)$, a constant that can move outside the expectation. A student confirms this in class. The lecturer also explains why he writes $s$ rather than $s_0$: $s_0$ is a random variable, and $s$ is the value it takes.

$$
V^\pi(s)=R(s)+\gamma\,\mathbb{E}\bigl[R(s_1)+\gamma R(s_2)+\gamma^2 R(s_3)+\cdots \bigm| s_0=s\bigr]
$$

**Step 2: deal with the uncertainty in $s_1$.** What sits inside the expectation looks like "the total return starting from $s_1$"; the only problem is that $s_1$ is random. So enumerate every possible $s_1$. The probability of going from $s$ to $s'$ under action $\pi(s)$ is $P_{s\pi(s)}(s')$, and the law of total expectation gives:

$$
\mathbb{E}\bigl[R(s_1)+\gamma R(s_2)+\cdots \bigm| s_0=s\bigr]=\sum_{s'\in S}P_{s\pi(s)}(s')\;\mathbb{E}\bigl[R(s_1)+\gamma R(s_2)+\cdots \bigm| s_1=s'\bigr]
$$

**Step 3: recognize $V^\pi(s')$.** The conditional expectation on the right is "the discounted return from being at $s'$ at time 1 and following $\pi$ afterwards". It equals $V^\pi(s')$ for three reasons, all of them necessary. The Markov property guarantees that what happens after $s_1$ doesn't depend on $s_0$ (the condition the law of total expectation produces is really "$s_0=s$ and $s_1=s'$", and this is what lets us keep only $s_1=s'$). The policy and the transition probabilities don't change over time, so starting at time 1 is no different from starting at time 0. And there are infinitely many terms, so after removing the first one what remains is an infinite series of the same shape. (These three points are an explanation added in this article; the lecturer only says "it's exactly the same thing, but just starting from different initial state".)

Putting it together:

$$
V^\pi(s)=R(s)+\gamma\sum_{s'\in S}P_{s\pi(s)}(s')\,V^\pi(s')
$$

This is the Bellman equation for a fixed policy, the same as the equation on page 229 of the lecture notes.

The lecturer then examines the equation. The left side is $V^\pi$ and the right side is $V^\pi$ again, so it is recursive. And the right side involves the value of more than one state: every $s'$ is in there, with different weights. Each state $s$ has one such equation, and each is linear in the unknowns $V^\pi(0),\dots,V^\pi(n-1)$. With $n$ states there are $n$ linear equations in $n$ unknowns, and a linear solver gives you all of $V^\pi$. A student asks whether the states must be finite. The lecturer says the equation itself still holds with infinitely many states; it just becomes infinitely many equations, a functional equation.

### Numerical example: a three-cell strip

The following is an example made up for this article, not from the lecture, though it reuses the lecture's numbers: a move succeeds with probability 0.9 and fails, leaving the robot in place, with probability 0.1; the goal cell has reward 1 and the others $-0.1$. To make it solvable by hand, I shrink the strip to three cells $\{1,2,3\}$ with the goal at cell 3, take $\gamma=0.9$, and additionally assume the robot stays in place when it hits a boundary. The policy $\pi$ is to go right in every cell.

The three Bellman equations:

$$
\begin{aligned}
V^\pi(3)&=1+0.9\,V^\pi(3)\\
V^\pi(2)&=-0.1+0.9\bigl[0.9\,V^\pi(3)+0.1\,V^\pi(2)\bigr]\\
V^\pi(1)&=-0.1+0.9\bigl[0.9\,V^\pi(2)+0.1\,V^\pi(1)\bigr]
\end{aligned}
$$

The first has a single unknown: $0.1\,V^\pi(3)=1$, $V^\pi(3)=10$.

Substitute into the second: $V^\pi(2)=-0.1+0.81\times10+0.09\,V^\pi(2)$, which rearranges to $0.91\,V^\pi(2)=8.0$, $V^\pi(2)\approx 8.791$.

Substitute into the third: $0.91\,V^\pi(1)=-0.1+0.81\times8.791=7.021$, $V^\pi(1)\approx 7.715$.

What these three numbers mean:

- $V^\pi(3)=10$ is exactly the upper bound $M/(1-\gamma)=1/0.1$ from the previous section, because the robot stays forever in the cell with reward 1 and collects the full amount at every step.
- Each cell farther from the goal loses a chunk of value: about 1.21 less going from cell 3 to cell 2, and about 1.08 less from cell 2 to cell 1. The loss comes from two places: a few more steps at $-0.1$, and the $+1$ arriving later and being discounted a few more times.
- Changing the policy means changing the system of equations. If cell 1 switches to going left, the robot hits the wall and stays in cell 1 forever, the equation becomes $V(1)=-0.1+0.9\,V(1)$, and the solution is $V(1)=-1$. From the same starting point, the two policies have values 7.715 versus $-1$. That is what "the value function is a function of the policy" looks like concretely.

## Policy gradient: the objective and where it gets stuck (recording 55:39–1:03:20)

Here the lecturer makes a trade-off. There are many algorithms for finding the optimal policy, and the lecture notes contain several, but with this term's focus on large language models he decides to skip the algorithms that aren't commonly used for language models and go straight to one: **policy gradient**, also called **REINFORCE** (all caps; he says the inventor chose the name). He describes it as the predecessor of the algorithms used to train large language models. It also doesn't need much of the background covered earlier and is in some sense simpler, which may be why it carries over to language models so easily.

The algorithm only applies to stochastic policies. Parameterize the policy with a neural network, written $\pi_\theta(a\mid s)$, with two requirements:

1. Given $s$ and $a$, the network can compute the probability (or density) $\pi_\theta(a\mid s)$. It doesn't have to list the whole distribution, because actions may be continuous and infinitely many.
2. You can sample from $\pi_\theta(\cdot\mid s)$.

The objective is the expected discounted return. This kind of setup usually uses a finite number of steps $T$:

$$
\eta(\theta)=\mathbb{E}\Bigl[\sum_{t=0}^{T-1}\gamma^tR(s_t)\Bigr],\qquad s_0\sim D_0,\quad a_t\sim\pi_\theta(\cdot\mid s_t),\quad s_{t+1}\sim P_{s_ta_t}
$$

The lecturer says using $\eta$ instead of $V$ is just the convention in this area. The small difference between them is that $V^\pi(s)$ fixes the initial state, whereas $\eta$ lets $s_0$ be drawn from a known initial distribution too (the lecture calls it $D_0$, the notes write $\mu$). The summation limits here follow (21.1) in the notes; in class a student points out a slip on the board involving $t+1$, and the lecturer corrects it on the spot.

The approach sounds straightforward: take the gradient of $\eta(\theta)$ and update $\theta$ along it. (The lecturer says gradient descent out loud; since we are maximizing, the direction is up the gradient, and the notes write gradient ascent.)

The difficulty is where $\theta$ appears. Look inside the expectation: $R$ is a known function, $\gamma$ is a constant, $s_t$ is a sample that was drawn, and no term has $\theta$ written in it. The whole effect of $\theta$ is hidden in "which distribution the samples are drawn from".

The lecturer contrasts this with an easy case. Suppose

$$
F(\theta)=\mathbb{E}_{w\sim\mathcal{N}}\bigl[f(\theta,w)\bigr]
$$

Here the distribution of $w$ is fixed and independent of $\theta$, and $\theta$ is written inside the function. Then $\nabla_\theta$ can move straight inside the expectation, $\nabla F(\theta)=\mathbb{E}_w[\nabla_\theta f(\theta,w)]$, and you just sample and average. Our case is the reverse: move $\nabla_\theta$ inside, and the gradient of what's inside with respect to $\theta$ is zero, which gives the wrong answer. Page 259 of the notes makes the contrast more explicit: VAEs use the reparameterization trick to turn the problem into the easy form above, but that doesn't work here because we don't know how to compute the gradient of $f$ (the reward).

## The log-derivative trick: turning the gradient back into an expectation (recording 1:03:20–1:09:10)

The lecturer first abstracts the problem. Let $x$ stand for a whole trajectory, $f(x)$ for the trajectory's total reward, and $p_\theta$ for the distribution over trajectories. What we want is

$$
\nabla_\theta\,\mathbb{E}_{x\sim p_\theta}\bigl[f(x)\bigr]
$$

where $f$ doesn't contain $\theta$ and the distribution does. The derivation has four steps.

**Step 1: write the expectation as an integral**, so that the location of $\theta$ becomes visible. An expectation is "probability times value", integrated:

$$
\nabla_\theta\,\mathbb{E}_{x\sim p_\theta}[f(x)]=\nabla_\theta\int p_\theta(x)\,f(x)\,dx
$$

**Step 2: swap the gradient and the integral.** The integral is an ordinary integral over $x$, and neither its domain nor its measure depends on $\theta$, so $\nabla_\theta$ can move inside. $f(x)$ doesn't contain $\theta$, so the gradient falls only on $p_\theta$:

$$
=\int\nabla_\theta\bigl(p_\theta(x)f(x)\bigr)\,dx=\int\bigl(\nabla_\theta p_\theta(x)\bigr)f(x)\,dx
$$

**The sticking point.** This expression is correct but not usable. We can compute $\nabla_\theta p_\theta(x)$, but we can't integrate over all $x$: there are too many possible trajectories. What we want is a form that can be estimated by sampling, namely $\int p_\theta(x)\,(\cdots)\,dx$, because only then is it an expectation. Right now the integrand contains $\nabla p_\theta$, not $p_\theta$.

**Step 3: force $p_\theta$ to appear.** Use the chain rule for log:

$$
\nabla_\theta\log p_\theta(x)=\frac{\nabla_\theta p_\theta(x)}{p_\theta(x)}\quad\Longrightarrow\quad\nabla_\theta p_\theta(x)=p_\theta(x)\,\nabla_\theta\log p_\theta(x)
$$

Substitute back:

$$
=\int p_\theta(x)\,\bigl(\nabla_\theta\log p_\theta(x)\bigr)\,f(x)\,dx
$$

**Step 4: recognize the expectation again.** The integrand is now "$p_\theta(x)$ times something", so

$$
\nabla_\theta\,\mathbb{E}_{x\sim p_\theta}[f(x)]=\mathbb{E}_{x\sim p_\theta}\bigl[\nabla_\theta\log p_\theta(x)\cdot f(x)\bigr]
$$

This is (21.3) in the notes. On the board the lecturer left out $f(x)$ at the end, added it after a student pointed it out, and said "I should follow my notes more carefully" (1:08:01).

All three things on the right can be handled: the gradient of $\log p_\theta(x)$ can be computed, $f(x)$ can be computed, and $x$ can be sampled from $p_\theta$. So draw a few samples, compute the quantity in the brackets, and average, and you have an estimate of the gradient. The lecturer stresses that this estimates the gradient, not the original function value.

During this stretch one student's question was not picked up by the captions. Judging from the answer, it asked whether multiplying probabilities together causes a problem. The lecturer replies that you can still take the gradient of a product of probabilities. There may be a numerical-stability concern, but that isn't the main reason for taking the log here. The main reason is Step 3 above: making $p_\theta$ appear so that we get back to an expectation.

### Numerical example: two actions

The following is a check made up for this article, with numbers borrowed from the earlier Q&A in the lecture (probabilities 0.9 / 0.1, payoffs 1.0 / 2.0). Consider a one-step problem with two actions, $f(a_1)=1$ and $f(a_2)=2$. The policy has a single parameter, $\pi_\theta(a_1)=\sigma(\theta)=\dfrac{1}{1+e^{-\theta}}$, $\pi_\theta(a_2)=1-\sigma(\theta)$. Take $\theta=\ln 9\approx2.197$, so that $\pi_\theta(a_1)=0.9$.

**Computing it directly.** This example is small enough to write the expectation out:

$$
\eta(\theta)=\sigma(\theta)\cdot1+(1-\sigma(\theta))\cdot2=2-\sigma(\theta)
$$

Currently $\eta=1.1$. Using $\sigma'=\sigma(1-\sigma)$, we get $\dfrac{d\eta}{d\theta}=-\sigma(1-\sigma)=-0.9\times0.1=-0.09$.

**Computing it with the log-derivative formula.** First compute $\nabla_\theta\log\pi_\theta$ for the two actions:

$$
\frac{d}{d\theta}\log\sigma(\theta)=1-\sigma(\theta)=0.1,\qquad\frac{d}{d\theta}\log\bigl(1-\sigma(\theta)\bigr)=-\sigma(\theta)=-0.9
$$

| Sampled action | Probability | $\nabla\log\pi_\theta$ | $f$ | Single-sample estimate |
|---|---|---|---|---|
| $a_1$ | 0.9 | $0.1$ | 1 | $0.1$ |
| $a_2$ | 0.1 | $-0.9$ | 2 | $-1.8$ |

The expectation is $0.9\times0.1+0.1\times(-1.8)=0.09-0.18=-0.09$, matching the direct derivative.

Three things can be read off this result:

- The gradient is negative, so one step of ascent makes $\theta$ smaller, which lowers the probability of picking $a_1$ and raises the probability of picking $a_2$. $a_2$ has the higher payoff, so the direction is right. After one update with learning rate 1, $\theta$ becomes 2.107, $\pi_\theta(a_1)$ drops from 0.9 to about 0.892, and $\eta$ rises from 1.1 to about 1.108.
- The formula never uses anything like "the derivative of $f$ with respect to the action". It only uses the value of $f$ at the action that was sampled. This is exactly why it suits reinforcement learning: the reward only needs to be something you can look up.
- The single-sample estimate is $0.1$ or $-1.8$, while the true gradient is $-0.09$. Nine times out of ten you draw $a_1$ and get a $+0.1$ pointing the wrong way; it takes the $-1.8$ that shows up one time in ten to pull the average back. The estimate is unbiased, but a single draw is very noisy (the variance is $0.9\times0.01+0.1\times3.24-0.0081\approx0.325$, a standard deviation of about 0.57, more than six times the size of the gradient itself). This is the variance problem the lecturer says, at the end, that the next lecture will deal with.

## Applying it to trajectories: the transition probabilities drop out of the gradient (recording 1:09:10–1:16:14)

What remains is to replace $x$ with the trajectory $\tau=(s_0,a_0,s_1,a_1,\dots)$ and $f$ with the sum of discounted rewards. Plugging into the formula:

$$
\nabla_\theta\eta(\theta)=\mathbb{E}_{\tau\sim P_\theta}\Bigl[\nabla_\theta\log P_\theta(\tau)\cdot\sum_t\gamma^tR(s_t)\Bigr]
$$

Next we need to write out the probability of a trajectory. Multiply term by term in the order of the interaction: draw $s_0$ first, the policy draws $a_0$, the environment draws $s_1$, the policy draws $a_1$, and so on.

$$
P_\theta(\tau)=D_0(s_0)\,\pi_\theta(a_0\mid s_0)\,P_{s_0a_0}(s_1)\,\pi_\theta(a_1\mid s_1)\,P_{s_1a_1}(s_2)\cdots
$$

Take the log, the product becomes a sum, and it splits into three groups:

$$
\log P_\theta(\tau)=\log D_0(s_0)+\sum_t\log P_{s_ta_t}(s_{t+1})+\sum_t\log\pi_\theta(a_t\mid s_t)
$$

Here the lecturer corrects his own previous sentence. He had said everything in the expression can be computed, and immediately takes it back: the transition probabilities $P_{s_ta_t}(s_{t+1})$ may not actually be computable, since nothing so far assumes they are known. But that doesn't matter, because these terms don't contain $\theta$. The initial distribution doesn't contain $\theta$, how the environment transitions doesn't contain $\theta$, and only the policy does. Taking the gradient with respect to $\theta$, the first two groups are zero:

$$
\nabla_\theta\log P_\theta(\tau)=\sum_t\nabla_\theta\log\pi_\theta(a_t\mid s_t)
$$

This is the most important step in the whole derivation. Because we took the log first, the product broke into a sum, and that is what lets the factors without $\theta$ vanish as whole terms. If you differentiated the product $P_\theta(\tau)$ directly, every term of the product-rule expansion would still be multiplied by all the transition probabilities, and you would need their values to compute anything. Taking the log amounts to folding those factors back into $P_\theta(\tau)$ itself and handing them to the act of sampling, that is, "actually running one trajectory". The result is that the algorithm doesn't need to know the environment's transition probabilities at all. It only needs an environment you can actually step through. (This comparison is an explanation added in this article; the lecturer only says these terms don't contain $\theta$ and can be dropped, and that this algorithm doesn't need to know the transition probabilities.)

Substitute back, and we reach the end point of this lecture:

$$
\nabla_\theta\eta(\theta)=\mathbb{E}_{\tau\sim P_\theta}\Bigl[\Bigl(\sum_{t=0}^{T-1}\nabla_\theta\log\pi_\theta(a_t\mid s_t)\Bigr)\cdot\Bigl(\sum_{t=0}^{T-1}\gamma^tR(s_t)\Bigr)\Bigr]
$$

This corresponds to (21.8) in the notes. To use it: run a few trajectories with the current policy, compute the two brackets for each trajectory (the first by automatic differentiation, the second by adding up the rewards you saw), multiply them, average, and use the result as the gradient to update $\theta$.

How should the formula be read? The explanation on page 261 of the notes is: the first bracket points in the parameter direction that "makes the actions on this trajectory more likely to be chosen", and the second bracket is the trajectory's total return, acting as a weight. Trajectories with high return get their probability pushed up hard; those with low return get pushed less. This is the same thing as the "reinforce the good actions and penalize the bad actions" from the opening, except that now there is a precise expression. (This reading comes from the notes; the lecture ran out of time before getting to it.)

The lecturer mentions that there is a further simplification, in which the product of the two sums can be rearranged, but time is up. He says he needs to check his notes and stops here. The reward-to-go simplification (21.10), the baseline (21.11), and Algorithm 7 that come next in the notes are not covered in this lecture.

The Q&A in the last few minutes addresses two common questions.

A student asks: for a language model, generating every possible output sequence is simply infeasible, so does this still count as "computable"? The lecturer answers: "Oh, but you never enumerate all of them. You just sample from it. You just sample one trajectory. Sometimes you sample five or 10." (1:14:11)

The captions caught only fragments of the next question. Judging from the answer, it was about the error and variance of this estimate. The lecturer first says there is no special estimation procedure here: to compute the expectation of a random variable, you sample from it and take the empirical average. His words are "There is no Monte Carlo estimation here". From context, he means there is no separate estimation method beyond sampling directly; textbooks usually call "sample and average" Monte Carlo estimation, and the two descriptions refer to the same procedure. As for how large the variance is, the lecturer says it is hard to generalize and the next lecture will discuss how to reduce it. But he doesn't think the variance here is outrageous; it isn't the kind that grows exponentially with $T$. The practical attitude is "In practice you always care about reducing variance. Even the variance is not huge, you still want to reduce it." (1:15:13)

The next article is [Lecture 20 (baselines, PPO, and verifiable rewards)](/posts/ai/2026-10-12-stanford-cs229-lecture-20-ppo-rl-for-reasoning-en). It picks up from this formula, first filling in the simplification and the baseline that weren't finished here, then covering PPO and its use on language models. The numbering jumps from 18 to 20 because the Lecture 19 slot fell on Memorial Day and there was no class.

## Self-check

**1. In the three-cell strip example, change $\gamma$ to 0.5 and keep everything else, with the policy still going right in every cell. Find $V^\pi(3)$ and $V^\pi(2)$.**

Answer: $V^\pi(3)=1+0.5\,V^\pi(3)$, so $V^\pi(3)=2$. $V^\pi(2)=-0.1+0.5\,[0.9\times2+0.1\,V^\pi(2)]=0.8+0.05\,V^\pi(2)$, so $V^\pi(2)=0.8/0.95\approx0.842$. Criterion: you can set up the equations yourself and notice that $V^\pi(3)$ still equals $1/(1-\gamma)$.

**2. In deriving the Bellman equation, which assumptions does the step "$\mathbb{E}[R(s_1)+\gamma R(s_2)+\cdots\mid s_1=s']$ equals $V^\pi(s')$" use? If the policy changes over time (for example, switching to a different rule after step 5), does this step still hold?**

Answer: It uses the Markov property, a policy and transition probabilities that don't change over time, and infinitely many terms. If the policy changes over time, "starting at time 1" and "starting at time 0" face different future policies, their expected returns are no longer the same function, and the step fails. The value function then has to carry an extra time index.

**3. In the two-action example, change the payoffs to $f(a_1)=5$ and $f(a_2)=2$ with $\theta$ unchanged ($\pi_\theta(a_1)=0.9$). Compute the gradient with the log-derivative formula and explain its direction.**

Answer: $0.9\times0.1\times5+0.1\times(-0.9)\times2=0.45-0.18=0.27$. Check by direct differentiation: $\eta=5\sigma+2(1-\sigma)=2+3\sigma$, with derivative $3\sigma(1-\sigma)=0.27$. The gradient is positive, $\theta$ increases, and the probability of picking $a_1$ goes up, because $a_1$ is now the better action.

**4. Why doesn't policy gradient need to know the environment's transition probabilities $P_{sa}$? Point to the step in the derivation that makes them disappear, and say what the algorithm still needs from the environment in practice.**

Answer: After taking the log, the trajectory probability splits into a sum of three groups. The initial-distribution group and the transition-probability group don't contain $\theta$, so their gradient with respect to $\theta$ is zero. The algorithm still needs an environment it can interact with (sampling from $P_{sa}$, that is, actually taking a step), and it needs to be able to look up the reward of the states it visited. Criterion: you state the distinction "it doesn't need to know the formula, but it does need to be able to sample".

**5. The lecturer says a deterministic optimal policy always exists. So why must the policy gradient derived in this lecture use a stochastic policy?**

Answer: There are two levels. The reason given in class is continuity: with a deterministic policy the action jumps suddenly as the parameters move, while the probabilities of a stochastic policy can shift smoothly. The derivation makes it more direct: the formula requires $\nabla_\theta\log\pi_\theta(a\mid s)$, so the policy must assign each action a differentiable probability. And $\theta$ exerts its influence precisely by "changing the sampling distribution"; a deterministic policy has no such distribution to differentiate. (The second level is this article's reading.)

## Corresponding reading

Main lecture notes [main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf) (August 2026 version):

- **Chapter 19 Reinforcement learning, 19.1 Markov decision processes (pp.228–230)**: the definition of an MDP, discounted return, policies, value functions, the Bellman equation for $V^\pi$, and $V^\star$, $\pi^\star$. The first 55 minutes of this lecture correspond to this section.
- **Chapter 21 Policy Gradient and its Variants, 21.1 REINFORCE (pp.258–260)**: the definition of $\eta(\theta)$ (21.1), the log-derivative derivation (21.3), the trajectory probability decomposition (21.6)–(21.7), and the final formula (21.8). The last 20 minutes of this lecture go this far.

Where the lecture differs from the notes:

- **How the reward is written.** The lecture uses $R(s)$ throughout. Chapter 19 of the notes treats $R(s,a)$ as the general form and mostly uses $R(s)$ in derivations; Chapter 21 states that it adopts $R(s_t,a_t)$. The derivation is unaffected: replace $R(s_t)$ in this article's formulas with $R(s_t,a_t)$.
- **The range of $\gamma$.** The notes write $\gamma\in[0,1)$; the lecturer says out loud that it is between 0 and 1 and often close to 1.
- **The definition of a policy.** Chapter 19 of the notes only defines the deterministic policy $\pi:S\to A$; the lecture introduces the stochastic policy $\pi(a\mid s)$ in the same segment, along with the reason training needs randomness.
- **In the lecture but not in the notes.** The one-dimensional strip as a running example (the notes use a helicopter), the exploration–exploitation opening, the discussion of reward shaping and the teleport example, the geometric-series analogy for the Bellman recursion, and several student Q&A exchanges.

In the notes but not covered in this lecture:

- **The Bellman equations for the optimal value function in the second half of 19.1, (19.2)–(19.3)**: the lecture only defines $V^\star$ and $\pi^\star$ and doesn't write out the equation with the $\max$.
- **19.2 Value iteration and policy iteration (pp.230–232), 19.3 learning a model for an MDP, 19.4 continuous-state MDPs, 19.5**: none of these are covered. The lecturer says explicitly that this term's focus is language models and he is skipping algorithms not commonly used for them; if you're interested, you can read the notes yourself.
- **Chapter 20 LQR, DDP and LQG (from p.244)**: not mentioned at all.
- **The second half of 21.1 (pp.261–263)**: the zero expectation in (21.9), the reward-to-go simplification (21.10), the baseline (21.11), and Algorithm 7; and **21.2 PPO (from p.263)**. None of these had appeared by the end of this lecture.

## Course video sources

Original video: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 18: GMM (EM), PCA](https://www.youtube.com/watch?v=xveNBYVTrqw)

- [Stanford CS229 Machine Learning | Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 course website](https://cs229.stanford.edu/)
- [CS229 main lecture notes main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

Checked: 2026-10-12.

Content check: verified against the video transcript (2026-10-12): I read the English transcript of the whole video (about 76 minutes), and every statement and quotation marked as lecture content in this article comes from the transcript. The formulas are reconstructed from what is said in the transcript and from Chapters 19 and 21 of the main lecture notes; the two numerical examples were made up for this article and checked separately.

## References

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 18: GMM (EM), PCA (YouTube)](https://www.youtube.com/watch?v=xveNBYVTrqw): the main source for this article. The lecture's statements, example numbers, and quotations all come from this video's English transcript.
- [CS229 main lecture notes main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf): Section 19.1 of Chapter 19 (pp.228–230) was used to check the notation for MDPs and the Bellman equation; Section 21.1 of Chapter 21 (pp.258–261) was used to reconstruct the board formulas for policy gradient and for the reading of (21.8).
- [Stanford CS229 Machine Learning | Spring 2026 playlist](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw): to confirm this video's title and lecture number on the playlist.
- [CS229 course website](https://cs229.stanford.edu/): the entry point for the course and the notes.
- [Reading Stanford CS229: Course Overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): the overview and reading route for this series.
