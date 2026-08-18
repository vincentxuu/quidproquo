---
title: "Deep Reinforcement Learning: Putting RLHF Back Inside the RL Frame"
date: 2026-08-16
category: ai
type: deep-dive
tags: [reinforcement-learning, rlhf, q-learning, llm, stanford-cs230]
lang: en
series:
  name: "Reading Stanford CS230"
  order: 5
tldr: "The third reason Go can't be learned with supervision is the interesting one: the ground truth itself is ill-defined — the strongest human doesn't play their best moves every day, and even their best move isn't optimal. The last 20 minutes map RLHF fully back onto RL: the agent is the model being fine-tuned, the action is the next token, an episode is one full generation, and the reward is extremely sparse."
description: "A full read-through of Stanford CS230 (Autumn 2025) Lecture 5: why Go can't be learned with supervision, Q-learning worked by hand, how deep Q-learning manufactures labels from nothing, experience replay and ε-greedy, and mapping SFT, reward models and RLHF back onto every RL term."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-16-cs230-deep-rl-and-rlhf)

> [The previous post](/posts/ai/2026-08-16-cs230-adversarial-and-generative-en) covered how models get broken and how they generate. This one switches to a different way of learning.

This post covers **[Lecture 5: Deep Reinforcement Learning](https://www.youtube.com/watch?v=4E27qlfYw0A)** (2025/10/21, Kian Katanforoosh, 1 hour 45 minutes).

This is a **substituted lecture**. He says up front that the week was supposed to cover network interpretability and LLM visualization, but the students hadn't reached attention maps and CNNs yet, so teaching it in week five would be too far ahead — interpretability moved later (it became Lecture 10).

The structure is two-thirds deriving Q-learning from scratch, then 20 minutes on **RLHF** — and that last part is the most valuable piece here for anyone building LLM applications.

## Why RL matters

| Result | Significance |
|---|---|
| DeepMind, *Human-level control through deep RL* | **One algorithm** beating human-level on 40–50 Atari games |
| AlphaGo (2017, DeepMind / David Silver's lab) | Go |
| AlphaStar / OpenAI Five | StarCraft, Dota — **multi-agent, partially observable** |
| 2022, RLHF-aligned language models | "published around the same time as ChatGPT" |

> "Machine learning used to be very niche — you'd train a very niche algorithm for each task. Here **one algorithm learns essentially every Atari game**, which is quite remarkable."

## Why Go can't be learned with supervision

A student proposes: take professional game records, X = current board, Y = next move. Then he pushes the class to find three fatal problems:

1. **The state space isn't covered**: 13×13 intersections with three states each, and historical games will never cover it
2. **You don't know whether that move was good**, yet you're learning it as though it were. And you only see **one-off decisions**, never the long-term strategy in the player's head — "the model is just matching X to Y, it **has no concept of strategy at all**"
3. **The ground truth itself is ill-defined** (the strongest argument):

> "Even the world's strongest player doesn't play their best game every day, and **even their best move isn't ground truth.** You're effectively training against a target that's already off by some distance. **You will never be stronger than the strongest human, and the strongest human isn't playing the optimal policy on every move.**"

Even with a whole panel of experts deciding each move, the ground truth stays ill-defined.

### RL in one sentence

> **"RL is making good sequences of decisions, automatically."**
>
> "Supervised learning is **teach by example**, reinforcement learning is **teach by experience**. You're not showing the model cats and non-cats, you're letting the model **live through an environment** until it works out which decisions are good."

**Applications**: self-driving (you see a red light ahead and start slowing, but it might turn green so you don't fully brake), robot control (the number of joint decisions to walk from A to B is enormous), and then the biggest one, which nobody in the room named:

> "**Advertising.** I don't like it, but it happens to be reinforcement learning's largest application."

The reason: a buyer sees many ads before they order, which makes it a **long game** requiring long-horizon thinking. So marketing, advertising and real-time bidding use a lot of RL.

## Vocabulary

agent / environment / action `a_t` / state `s_t` / **observation `o_t`** / reward `r_t` / transition

**Why are state and observation two separate concepts?**

- Go, chess: **observation = state**, all information is public
- League of Legends, StarCraft: **there's fog of war**, you only see part of the map
- A third case a student adds: **open-world games deliberately observe only within a radius** for computational reasons — "you're at some position, who cares what's happening twenty thousand kilometers west of you?"

## "Recycling": a Q table worked by hand

Five states, starting at S2, actions are left and right only:

```
S1(trash can,+2) ← S2(start) → S3(empty) → S4(chocolate wrapper,+1) → S5(recycling bin,+10)
```

**An extra rule: the cleaning crew arrives in three minutes, and each move costs one minute.**

Why add that? A student gets it: **otherwise you shuttle between S3 and S4 farming the chocolate wrapper and never reach the recycling bin.**

### Discounting

`R = Σ γ^t · r_t`, γ ∈ [0,1]

> "What's discounting for a human? — **the time value of money.** Account for inflation and you'd rather have a dollar today than in ten years. For a robot it might be **battery**: a policy that takes a lot of time has to be discounted."

- γ = 1 → the optimal policy is "right right right," total return **11**
- γ = 0.9 → work backwards cell by cell: from S3 the best is `1 + 0.9×10 = 10`; from S2 it's `0 + 0.9×10 = 9`

### The Bellman optimality equation

```
Q*(s,a) = r + γ · max_{a'} Q*(s', a')
```

> "It's called the optimality equation because **your optimal Q table satisfies it.** Once the game is solved, this holds for any (state, action) pair."
>
> "That's exactly the backwards pass we just did: **immediate reward + discount × the best action available in the next state.**"

**Policy**: `π(s) = argmax_a Q*(s,a)` — "look it up, see which action has the highest Q value, take it. That's it."

### The Q table's fatal flaw

> "The state and action spaces can get impossibly large … think about Go, where your stone can go anywhere on the board. This matrix gets so big it's **unusable.**"

**That's where deep learning enters.**

## Deep Q-learning: how do you train without labels?

Replace the Q table with a neural network (a **universal function approximator**): state in, one neuron per action in the output layer. Table lookup becomes a forward pass.

The core difficulty: **there are no labels.**

Katanforoosh pushes the class for a long while. They propose in turn: use the reward structure, run tree search, only explore likely branches, estimate expected return. He picks holes in each ("Go's tree starts at 13×13 options and grows exponentially — **intractable**").

**The answer: we know only two things — the reward structure, and that the final Q function satisfies the Bellman equation. So build labels out of those two.**

```
loss = L2( Y , Q(s,a) )
where  Y = r + γ · max_{a'} Q(s', a')     ← estimated with the currently-terrible Q network
```

**Two forward passes**: send s through the network to pick an action; once you have s', **send it through the same network** to get the best Q value, discount it and add the immediate reward — that's Y.

> "Remember: **this target is biased, it's not a perfect target, but it's better than nothing.** It doesn't just tell us there's a good reward to the left, it adds what we know — that Q values should satisfy the Bellman equation at the end of training — so why not make the Bellman equation the target?"
>
> "Every time your Q gets better, **it gets better for the next state too.** So your estimate and your model **improve together**, and both converge on the optimality equation in the end. **That's a beautiful concept, right?**"

Implementation detail: that term inside Y is technically differentiable, but **we freeze it as a constant.** And we only **look one step ahead** — "you can look further, but the compute gets heavier."

## In practice: Breakout

### What goes into the input

| Decision | Reason |
|---|---|
| The whole frame as state | — |
| **Crop the score** | This game is about winning; the score doesn't affect strategy |
| Crop the bottom | Once the ball is past the paddle it's over |
| **Convert to grayscale** | Color carries no information in this game |
| **Stack four frames** | ★ The one nobody thought of: **a single frame doesn't tell you which way the ball is going**, making the game unsolvable |

**But "crop the score" isn't a general rule**, and his own counterexample is a good one:

> "I like football. In football, if you're up 1–0 you can park the bus. **Your strategy depends on the score** — when you're behind you do the exact opposite and attack with everything. So some games need the score and some don't. **That's a judgment call for the AI engineer.**"

**A stumble mentioned in class**: running the same preprocessing across 50-odd Atari games, they uniformly stripped the color channels, "and in one of them — I think it was Seaquest — **the fish disappeared**, and that game became unwinnable."

> **⚠️ I couldn't find any corroboration for this.** He says in class himself that he doesn't remember which game. The **documented** analogous problem in Atari preprocessing is a different one: **flickering** — some objects only appear on even or odd frames, and DQN's fix is to take the **element-wise maximum over two consecutive frames.** That's a different mechanism from "removing color made objects disappear." The classroom version may be a garbled recollection of it.

(Grayscale itself really is part of standard DQN preprocessing: the original paper converts RGB to grayscale, downsamples to 110×84, then crops to 84×84.)

## Three key techniques for training RL

### 1. Terminal states

> "The target at a terminal state **isn't the Bellman equation, it's just the immediate reward.** You reach the end and get 10 — no Bellman, no discounting."

### 2. Experience replay

Solves two problems:

**(a) Consecutive frames are highly correlated** — "the ball flies from top-left to bottom-right, and many of the timesteps in between are basically the same thing."

The supervised-learning analogy lands well: **train a batch of cats, then a batch of dogs, then a batch of cats — it never converges, it just swings toward cats then toward dogs.**

**(b) The data gets no reuse at all** — "you experience it once, immediately train on it, and never see it again … maybe you did something that got a fantastic reward, and **you don't want to forget that.**"

The method: store every transition in a replay memory, and **sample random mini-batches** from it at training time.

The advanced version, **prioritized sweeping**: weight by gradient magnitude. "You made a big blunder in a chess game, and **you want to receive that experience again later** so you don't repeat it."

(A student asks whether this biases toward openings. Play more games and midgames and endgames mix in. And he adds a good analogy: "beginners are good at openings and terrible at endgames, **because they rarely get to play endgames.** This method lets you retrain on endgames a few extra times.")

### 3. Exploration vs. exploitation

**A demonstration of failure**: start at S1, three terminal states with rewards 0, 1, and 1000. After random initialization the Q values are .5 / .4 / .3:

- Pick action 1 → get 0 → update to 0
- Pick action 2 → get 1 → update to 1
- Pick action 2 again → prediction correct, nothing to fix → **training ends, and you never visited the 1000 state**

**The analogy**:

> "You bike across campus every day and you have a favorite route. The more you ride it the better you know it — you take the turns faster, you know how crowded the roundabout gets. **That's exploitation.** But maybe there's another route you never thought of, going south instead of north, and it might be better. **You'll never know, because you didn't have the courage or the patience to try.**"

**The fix**: take a random action with probability ε (say 5%). "The chess analogy: occasionally you play a very creative move, **which might be worse today, but teaches you something and makes you stronger long-term.**"

(A student asks "why not just initialize all Q values to infinity" — with all three infinite you can't decide; and the deeper reason is **you can't predict what the reward structure looks like**, and we want an agent that adapts to any environment.)

## Emergent behavior

- **Breakout**: the agent discovers on its own that it can **tunnel up the side and send the ball behind the bricks**
- **Sumo (competitive self-play)**: agents learn to **attack the opponent's legs** and **lower their center of gravity for stability**
- How self-play works: copy the same model several times with different initializations, one of them gets stronger, **copy that one over all the others** and go again; because of ε-greedy randomness, one naturally pulls ahead again

### AlphaGo's "incomprehensible" move

He recommends the Netflix AlphaGo documentary, then explains the strange move:

> "That move is deeply counterintuitive to humans, because **humans are trained to maximize margin of victory** — in chess, if I can take all your pieces I take all your pieces; in Go, I enclose as much as I can.
>
> **But the agent is only set up to win.** It doesn't care whether it wins by one point or twenty. And that move happened to put the agent in a good position **to win by a narrow margin.**"

## PPO / DPO

| | Q-learning | PPO |
|---|---|---|
| What it learns | Learns **Q values**, policy = argmax Q | **Learns the policy directly**, more probabilistic |
| Action space | Discrete | **Can be continuous** |

> "Self-driving isn't 'turn the wheel left or right,' it's **how many degrees**, which is continuous. DQN doesn't serve you well here."

PPO has the notion of **expected advantage**: not how good this action is, but **how much better it is than what you'd have done anyway.** The lineage is Schulman's TRPO and PPO. He also mentions that "what's hotter right now is **DPO, out of Stanford a year ago**, which this course won't cover."

**How to design rewards**: Go can be just "win = 1, everything else = 0"; chess could give intermediate rewards for captures, but could also be fully end-to-end — "the latter is harder to train, but may lead to a better policy, **because you can in fact win without capturing a single piece.**"

---

# Second half: RLHF

> "This is the leap that separates **GPT-2 and ChatGPT** in your memory."

## Two problems with pretrained models

**Problem one: web data doesn't reflect "helpful"**

| What's in the training set | What users actually ask |
|---|---|
| "deep learning is so cool" | "**What is deep learning?**" |

> "The model was trained to **continue text**, not to answer questions."

**Problem two: the model has no concept of "good," "polite," or "helpful"**

Ask: "My laptop won't turn on, what should I do?"

- The pretrained model (learned from Reddit / Wikipedia): "Laptops sometimes fail to power on due to power issues." — **that's not what you asked**
- What you want: "First check the charger is connected and the outlet has power. If that's fine, hold the power button for ten seconds …"

## Step one: SFT

Build a **fully human-written** prompt–response dataset and train exactly as in pretraining, just on human-written pairs.

**Two drawbacks**:

1. **The data is extremely expensive.** "I remember the first InstructGPT had only **13,000** prompt–response pairs, and the results were surprisingly good." (**This figure is his recollection and needs verification.**)
2. **It doesn't generalize that well.** This is supervised learning — you gave it 13,000 examples, so why trust it to generalize to unseen prompts?

> **"SFT teaches imitation of good human behavior. That's the crux — it's imitation, not preference optimization."**

## Step two: the reward model

- For the same prompt, **sample** three or four different responses from the SFT model (vary the temperature)
- Have annotators **rank** them: B over C, C over A … those pairwise comparisons are the preference data

**The architecture**: initialize from SFT, **remove the final softmax layer**, and replace it with a **linear layer producing a scalar** as the reward head. The loss encourages higher rewards for preferred responses.

**Why a model rather than humans directly?** "Because a model can be applied **broadly** across inputs, and from a data standpoint **it scales.**"

**Why is this better than SFT?**

> "**Asking a person which of two things they prefer is far easier and far faster than asking them to write the answer themselves.** If you've used ChatGPT, you've probably been asked which response you prefer."

## Step three: map the whole vocabulary back onto RL

This table is the thing most worth keeping from the lecture:

| RL concept | What it is in RLHF |
|---|---|
| agent | **the language model being fine-tuned** |
| environment | the space of all possible prompts and continuations |
| state | **prompt + tokens generated so far** |
| action | **the next token** |
| next state | the state with one more token |
| reward | **the reward model's score** (a proxy for human preference) |
| one episode | **one full prompt → completed generation** |

### Sparse rewards (the point a lot of write-ups miss)

> "The model **doesn't get a reward per token** — it gets it **after the sequence ends and the generation is complete**, because the reward model was built to score 'prompt + response' as a whole.
>
> So **all intermediate rewards are typically zero**, which makes this an **extremely sparse-reward episodic task, like a chess game** — you only find out whether you played well at the end."

Which loops back to the opening definition: **RL is making good sequences of decisions.**

## The counter-material he supplies himself

> "There's a great video, from **four days ago**, by a former Stanford student, Andrej Karpathy — who's very thoughtful and very clear — on **why reinforcement learning is sometimes terrible, and how much more efficient the human brain is.** I'd encourage you to watch that four-minute video, because he articulates very clearly **why RL still isn't good enough, even though it's the best tool we have in many ways.**"

(The class date is 2025/10/21, so four days back is around 2025/10/17. **I couldn't locate the exact video; this is recorded as stated in class.**)

---

## Beyond the classroom: those three objections still hold

The three reasons Go can't be learned with supervision **all transfer intact to LLM evals today**:

1. **The state space isn't covered** → your eval set will never cover what users actually ask
2. **You see one-off decisions, not strategy** → per-turn scored evals can't see whether a multi-turn agent's whole trajectory was good
3. **The ground truth itself is ill-defined** → **this is the painful one.** You use human annotation as the answer key, but human annotators don't give their best judgment every day, and even their best judgment isn't optimal

The third point is exactly what the site's [three forms of RAG and the evaluator paradox](/posts/ai/2026-08-10-rag-graph-agentic-variants-en) post is working on — Katanforoosh just puts it more cleanly through Go: **you will never be stronger than your judge.**

And the practical significance of the RLHF mapping table: **when you're debugging an RLHF'd model, you're debugging a sparse-reward sequential decision problem.** The model says something wrong at token 300 and the signal has to propagate all the way back — which is why alignment often fails on long responses, rather than the model being "insufficiently obedient."

## References

- [Lecture 5: Deep Reinforcement Learning](https://www.youtube.com/watch?v=4E27qlfYw0A) — 2025/10/21, Kian Katanforoosh. Source for the three objections about Go, the hand-worked Q table, label construction in deep Q-learning, experience replay, ε-greedy, and the RLHF mapping table
- [CS230 Lecture 5 slides](https://cs230.stanford.edu/syllabus/fall_2025/5/lecture_5.pdf) — the class slides, with the original paper list at the bottom of each section
- [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155) — Ouyang et al., 2022. InstructGPT, the original paper for the SFT → reward model → RLHF sequence
- [Stanford CS230 Autumn 2025 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rNRRGdS0rBbXOUGA0wjdh1X) — the full nine-lecture list
- [CS230 syllabus](https://cs230.stanford.edu/syllabus/) — lecture dates and the online-module mapping
- [Proximal Policy Optimization Algorithms](https://arxiv.org/abs/1707.06347) — Schulman et al., 2017. The PPO mentioned in class
- [Three forms of RAG and the evaluator paradox](/posts/ai/2026-08-10-rag-graph-agentic-variants-en) — on-site post, the modern version of "you won't be stronger than your judge"

**Sources cited without links**: TRPO, DPO, the DQN Nature paper, the AlphaGo documentary, and Karpathy's video are named but not linked — I couldn't verify each of them individually while writing, and I'd rather give no link than a possibly wrong one.
