---
title: "Uncertainty — Probability, Bayesian Networks, Markov Models & Genetic Inference | Harvard CS50 AI Week 2"
date: 2026-08-30
category: tech
type: guide
tags: [harvard-cs50ai, ai, probability, bayesian-network, markov-model, heredity, pagerank, python, cs50]
lang: en
series:
  name: "Reading Harvard CS50 AI"
  order: 3
tldr: "Week 2 is about probability: conditional probability and Bayes' rule turn evidence into probabilities; a Bayesian network uses arrows to split a joint probability into one conditional probability table per node, inference by enumeration is exact but slow, and rejection sampling and likelihood weighting approximate it with samples; a Markov chain describes a state that changes over time with a transition model, and a hidden Markov model adds a sensor model to work back from observations to states you cannot see. With time links for every section, plus the approach and checks for the Heredity and PageRank projects."
description: "Guide to Harvard CS50 AI Week 2 Uncertainty, written section by section from the captions of the 2020 lecture recording: possible worlds and the axioms of probability, conditional probability, random variables and independence, Bayes' rule, joint probability and marginalization, Bayesian networks, inference by enumeration, rejection sampling and likelihood weighting, Markov chains and hidden Markov models, each with a clickable time link and a self-check, plus the specs, approach, common mistakes and checks for the Heredity and PageRank projects, with the full reference implementation folded at the end of each. Project specs current as of 2026."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty)

**Video status: Videos included.** The lecture runs 1:54:29. The "Lecture walkthrough" below is written section by section from the recording's English captions, and each section opens with a time link that moves the player on this page to that point. The lecture does not cover this week's projects; those sections follow the course website. [Jump to the player](#lecture-video--timestamps) · [Source details](#course-video-sources)

> ⚠️ **Version note**: This week's lecture videos were **recorded in Spring 2020**; project specs, distribution code, and check50 slugs follow the 2026 course website (i.e., `ai50/projects/2024/x/...`).

## TL;DR

Week 2 deals with not being sure: an AI often holds information it only partly trusts, and it still has to reach conclusions. The first half of the recording covers the basic tools of probability (conditional probability, Bayes' rule, joint probability, marginalization). The second half puts those tools into three kinds of model: a Bayesian network describes which variables influence which, a Markov chain describes how a state changes over time, and a hidden Markov model handles the case where the state is hidden and only observations are visible. The two projects map to Bayesian networks (Heredity) and Markov chains (PageRank).

The article has two halves. The first, "Lecture walkthrough", follows the recording; the second covers the two projects, which the lecture does not mention.

## Lecture Video & Timestamps

The recording runs 1 hour 54 minutes. The ten sections of "Lecture walkthrough" below cover everything after 2:13 in order; the first two minutes are a recap of last week and the motivation for this one. Every time link, at the top of a section or inside the text, moves the player on this page to that point, so when a section does not make sense you can go straight back and listen.

```youtube
url: https://www.youtube.com/watch?v=D8RRq3TbtHU
title: Uncertainty - Lecture 2 - CS50's Introduction to Artificial Intelligence with Python 2020
```

YouTube: [Week 2 Uncertainty (2020 recording)](https://www.youtube.com/watch?v=D8RRq3TbtHU)

> Timing note: the times below were checked against the timecoded English captions (2026-10-13) and mark where the lecturer starts each topic; they are not official chapters. This table describes only the 2020 recording; the current course version may differ in content and order, and the video itself does not introduce this week's projects.

| Time (click to play from there) | Content |
|---|---|
| [0:00–2:13](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=0s) | Recap of last week and the motivation: robot sensors, weather forecasts, rolling dice |
| [2:13–9:46](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=133s) | Possible worlds, the two axioms of probability, the sum of two dice, unconditional probability |
| [9:46–17:20](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=586s) | Conditional probability: definition, formula and the dice example |
| [17:20–26:29](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=1040s) | Random variables, probability distributions, independence |
| [26:29–34:00](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=1589s) | Deriving Bayes' rule, and the cloudy-morning, rainy-afternoon example |
| [34:00–49:42](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=2040s) | The joint probability table, normalization, and four rules: negation, inclusion-exclusion, marginalization, conditioning |
| [49:42–1:03:19](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=2982s) | Bayesian networks: structure, a conditional probability table per node, computing joint probabilities |
| [1:03:19–1:19:39](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=3799s) | The inference problem, inference by enumeration, and the pomegranate library |
| [1:19:39–1:32:33](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=4779s) | Approximate inference: sampling, rejection sampling, likelihood weighting |
| [1:32:33–1:39:49](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=5553s) | Uncertainty over time: the Markov assumption, Markov chains, the transition model |
| [1:39:49–1:54:29](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=5989s) | Sensor models, hidden Markov models, four inference tasks and the wrap-up |

> Official notes and slides: [Week 2 Notes](https://cs50.harvard.edu/ai/2020/notes/2/)

## Lecture walkthrough

What follows is written section by section from the recording's English captions. Reading captions alone does not show the slides, so this article does not reconstruct the network diagrams or the tables on screen; it reports only the numbers and reasoning the lecturer says aloud. For the Bayesian network he reads out only some cells of the probability tables; the remaining numbers come from the lecture's published source code and are marked where they appear. The self-check at the end of each section is my own question, not lecture content. Where a question reuses a lecture example it says so; where it is marked "my own", the example is mine as well. Numbers marked "my calculation" are ones I worked out from the lecture's numbers; the lecturer does not say them.

### Possible worlds and the two axioms of probability

[Recording 2:13–9:46](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=133s)

The lecturer, Brian Yu, starts from last week: there the AI represented knowledge as logical sentences, and every conclusion it derived was certain (this recap is at the start of the recording, [0:00](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=0s)). In practice a machine is rarely certain of much. A robot exploring an environment does not know exactly where it is and has only its sensor data; a weather program cannot know tomorrow for sure and can only say how likely each outcome is. This week is about letting an AI draw inferences when it is only partly sure.

Probability starts from **possible worlds**, written `ω`. Rolling one die has six possible worlds: a 1, 2, 3, 4, 5 or 6. Each possible world has a probability, written `P(ω)`. Every probability obeys two axioms:

1. `0 ≤ P(ω) ≤ 1`. Zero means impossible: a die numbered 1 to 6 comes up 7 with probability 0. One means certain: the roll is less than 10. A higher value means a more likely event.
2. The probabilities of all possible worlds sum to 1.

For a fair die each face has probability 1/6, and the six add up to 1.

With a single die there is little to compute. The lecturer moves to two dice, one red and one blue, and asks about the sum of the two ([6:07](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=367s)). The possible worlds are all combinations of the red and blue values, 6 × 6 = 36 of them, each equally likely. The sums, however, are not equally likely:

- A sum of 7 comes from six combinations (1 and 6, 2 and 5, 3 and 4, 4 and 3, and so on), so its probability is 6/36 = 1/6.
- A sum of 12 comes from one combination (red 6, blue 6), so its probability is 1/36.

A probability like this, a degree of belief in something when no other evidence is available, is called an **unconditional probability**.

**Check yourself. Write your answer down before opening the fold.** With the lecture's two dice, what is the probability that the sum is 4?

<details>
<summary>Answer</summary>

Three combinations give 4: red 1 blue 3, red 2 blue 2, red 3 blue 1. The 36 possible worlds are equally likely, so the probability is 3/36 = 1/12. Red 1 blue 3 and red 3 blue 1 are two different possible worlds and are counted separately, which is the same way the lecturer counts six combinations for a sum of 7.

</details>

### Conditional probability: once there is evidence

[Recording 9:46–17:20](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=586s)

The lecturer says that what an AI usually computes is not an unconditional probability, because it usually already knows something. **Conditional probability** is the degree of belief in something given evidence that has already been revealed, written `P(a | b)`: the left of the bar is what we want the probability of, the right is the evidence we know for certain, and it reads "the probability of a given b". He gives three examples: the probability of rain today given that it rained yesterday; the probability that a route is still the best one given current traffic; the probability that a patient has a disease given a test result.

The formula is ([12:38](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=758s)):

```text
P(a | b) = P(a ∧ b) / P(b)
```

His explanation: since b is already true, every possible world where b is false can be thrown away. Among the worlds that remain, look at the share where a is true too.

He walks through it with the dice ([13:21](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=801s)). Given that the red die is 6, what is the probability that the sum is 12?

- Probability of the evidence: `P(red = 6)` = 1/6.
- Probability that both hold: red is 6 and the sum is 12 happens only with red 6 blue 6, so `P(sum = 12 ∧ red = 6)` = 1/36.
- Divide: (1/36) ÷ (1/6) = 1/6.

That matches intuition: with the red die already at 6, the only way to reach 12 is for the blue die to come up 6 as well, which has probability 1/6.

Multiplying both sides of the formula by `P(b)`, and then swapping a and b, gives two more forms of the same statement:

```text
P(a ∧ b) = P(b) P(a | b)
P(a ∧ b) = P(a) P(b | a)
```

Both the derivation of Bayes' rule and the joint probabilities of a Bayesian network later on use these two lines.

**Check yourself. Write your answer down before opening the fold.** With the lecture's two dice, what is the unconditional probability that the sum is at least 10? What does it become once you know the red die is 6?

<details>
<summary>Answer</summary>

Unconditional: a sum of 10 has three combinations (4 and 6, 5 and 5, 6 and 4), 11 has two and 12 has one, six in total, so the probability is 6/36 = 1/6.

Given red is 6: `P(red = 6)` = 6/36. Red is 6 and the sum is at least 10 needs blue to be 4, 5 or 6, three worlds, probability 3/36. Dividing gives (3/36) ÷ (6/36) = 1/2. The evidence moves the probability from 1/6 to 1/2, because half of the six worlds where red is 6 reach a sum of 10.

</details>

### Random variables, probability distributions and independence

[Recording 17:20–26:29](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=1040s)

So far everything has been an event that happens or does not. The lecturer now introduces the **random variable**: a variable together with the domain of values it can take. He gives four:

| Random variable | Values it can take |
|---|---|
| Roll | 1, 2, 3, 4, 5, 6 |
| Weather | sun, cloud, rain, wind, snow |
| Traffic | none, light, heavy |
| Flight | on time, delayed, cancelled |

The person writing the program decides what the values are.

A **probability distribution** gives a probability for each possible value of a random variable ([19:24](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=1164s)). For Flight: on time 0.6, delayed 0.3, cancelled 0.1, which add up to 1. The same thing is often written as a vector, `P(Flight) = ⟨0.6, 0.3, 0.1⟩`, and the reader has to know the order is on time, delayed, cancelled.

Next is **independence**: knowing whether one event happened does not change the probability of the other ([21:57](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=1317s)). The red and blue dice are independent; the red result tells you nothing about the blue one. Clouds and rain are not; rain is more likely when it is cloudy.

The mathematical definition comes from the previous section's `P(a ∧ b) = P(a) P(b | a)`. If a and b are independent, knowing a does not affect b, so `P(b | a)` equals `P(b)`, and therefore:

```text
P(a ∧ b) = P(a) P(b)
```

Two events are independent whenever this equation holds. Red 6 and blue 6 has probability 1/6 × 1/6 = 1/36, the same as counting possible worlds directly.

The lecturer gives an example that is not independent ([24:40](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=1480s)): the red die comes up 6, and the same red die comes up 4. Multiplying as if they were independent gives 1/6 × 1/6 = 1/36, but one roll of one die cannot be both 6 and 4, so the real probability is 0. The correct calculation uses the conditional probability: `P(red = 6) × P(red = 4 | red = 6)` = 1/6 × 0 = 0.

**Check yourself. Write your answer down before opening the fold.** With the lecture's two dice, are "the red die is 6" and "the sum is 7" independent? What about "the red die is 6" and "the sum is 12"? Test each with `P(a ∧ b) = P(a) P(b)`.

<details>
<summary>Answer</summary>

Sum is 7: `P(red = 6)` = 1/6 and `P(sum = 7)` = 1/6, whose product is 1/36. Both hold only with red 6 blue 1, which also has probability 1/36. The equation holds, so they are independent. The reason is that whatever the red die shows, exactly one blue value completes a 7, so knowing red is 6 does not change the probability of a sum of 7.

Sum is 12: `P(red = 6)` = 1/6 and `P(sum = 12)` = 1/36, whose product is 1/216. Both hold with red 6 blue 6, probability 1/36, which is not 1/216, so they are not independent. The previous section already showed that knowing red is 6 moves the probability of a sum of 12 from 1/36 to 1/6.

</details>

### Bayes' rule: turning a conditional probability around

[Recording 26:29–34:00](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=1589s)

The lecturer calls Bayes' rule one of the most important rules in probability, and it can be derived from what we already have. The two lines from the conditional probability section both have `P(a ∧ b)` on one side, so their other sides are equal:

```text
P(a) P(b | a) = P(b) P(a | b)
```

Divide both sides by `P(a)`:

```text
P(b | a) = P(a | b) P(b) / P(a)
```

Its use is to get a conditional probability in one direction from the conditional probability in the other direction.

The lecture's example ([29:22](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=1762s)): seeing clouds in the morning, what is the probability of rain in the afternoon? There are three numbers to work with:

- 80% of rainy afternoons start with a cloudy morning: `P(clouds | rain)` = 0.8
- 40% of days have cloudy mornings: `P(clouds)` = 0.4
- 10% of days have rainy afternoons: `P(rain)` = 0.1

Substituting:

```text
P(rain | clouds) = P(clouds | rain) P(rain) / P(clouds) = 0.8 × 0.1 / 0.4 = 0.2
```

Given a cloudy morning, the probability of rain in the afternoon is 0.2.

The lecturer then states it more generally ([32:12](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=1932s)): knowing the probability of a visible effect given an unknown cause lets you compute the probability of that unknown cause given the visible effect. The first is usually the one that is easier to have data for. He gives two settings: knowing what share of people with a disease get a particular test result, work out the probability that someone with that result has the disease; knowing what share of counterfeit bills have blurry text around the edges, work out the probability that a bill with blurry text is counterfeit. For these two he describes only the relationship and gives no numbers.

**Check yourself. Write your answer down before opening the fold.** Take the lecturer's counterfeit setting with numbers I made up: 90% of counterfeit bills have blurry text, 1% of all bills are counterfeit, and 5% of all bills have blurry text. You are handed a bill with blurry text. What is the probability that it is counterfeit? (my own)

<details>
<summary>Answer</summary>

`P(counterfeit | blurry)` = `P(blurry | counterfeit)` × `P(counterfeit)` ÷ `P(blurry)` = 0.9 × 0.01 ÷ 0.05 = 0.18.

"Nine in ten counterfeit bills are blurry" is not the same as "nine in ten blurry bills are counterfeit". Counterfeits are rare (1%), so most blurry bills are still genuine, and the answer is only 18%. How far apart the two directions are depends on the ratio of `P(counterfeit)` to `P(blurry)`.

</details>

### Joint probability, normalization and four rules

[Recording 34:00–49:42](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=2040s)

**Joint probability** is the probability that several things hold at once. Continuing with the weather: knowing only the two distributions `P(clouds)` = 0.4 and `P(rain)` = 0.1 says nothing about how clouds and rain relate. To see that you need the probability of every combination of the two variables, which is the joint probability distribution:

| | Rain | No rain |
|---|---|---|
| Cloudy | 0.08 | 0.32 |
| Not cloudy | 0.02 | 0.58 |

The lecturer reads out three of the cells (0.08, 0.32, 0.02); the 0.58 in the bottom right is one I filled in from the fact that the four cells sum to 1.

With this table you can compute conditional probabilities ([36:07](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=2167s)). The question: given that it is raining, what is the distribution over cloudy and not cloudy? By the definition:

```text
P(C | rain) = P(C, rain) / P(rain)
```

The comma means the same as `∧`. Here the lecturer points out a move he reuses several times: `P(rain)` is just a constant, dividing by it is the same as multiplying by some constant `α`, and its value can be left for later:

```text
P(C | rain) = α P(C, rain) = α ⟨0.08, 0.02⟩
```

0.08 and 0.02 do not add up to 1, and a probability distribution must. So all that is needed is a constant that scales them in proportion until they sum to 1, which is called **normalizing**. Multiply both by 10 and you get `⟨0.8, 0.2⟩`: given rain, the probability of clouds is 0.8. In one sentence, the conditional distribution is proportional to the joint probability.

Then come four rules.

**Negation** ([40:33](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=2433s)): `P(¬a) = 1 − P(a)`. Either a happens or it does not, those are all the cases, and together they must sum to 1.

**Inclusion-exclusion**: `P(a ∨ b) = P(a) + P(b) − P(a ∧ b)`. The lecturer's example is the red die being 6 or the blue die being 6. Adding 1/6 and 1/6 to get 1/3 is wrong, because the world where both are 6 has been counted twice and has to be subtracted once. The formula gives 1/6 + 1/6 − 1/36 = 11/36; that result is my calculation, and the lecturer explains only why the subtraction is needed.

**Marginalization** ([42:43](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=2563s)): you have joint probabilities and want the probability of one variable on its own. b either happens or does not, and the two cases cannot both occur, so:

```text
P(a) = P(a, b) + P(a, ¬b)
```

When a variable has many possible values, sum over all the values of the other variable instead:

```text
P(X = xᵢ) = Σⱼ P(X = xᵢ, Y = yⱼ)
```

With the table above: `P(cloudy)` = `P(cloudy, rain)` + `P(cloudy, no rain)` = 0.08 + 0.32 = 0.4.

**Conditioning** ([47:25](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=2845s)): the same idea as marginalization, when what you have are conditional probabilities:

```text
P(a) = P(a | b) P(b) + P(a | ¬b) P(¬b)
P(X = xᵢ) = Σⱼ P(X = xᵢ | Y = yⱼ) P(Y = yⱼ)
```

Normalization and marginalization are used together in inference by enumeration later on.

**Check yourself. Write your answer down before opening the fold.** Using the lecture's joint probability table, compute the distribution over rain and no rain in the afternoon given a cloudy morning. Does it agree with the answer Bayes' rule gave in the previous section?

<details>
<summary>Answer</summary>

Take the cloudy row: `P(R, cloudy)` = `⟨0.08, 0.32⟩`. The two numbers sum to 0.4; dividing each by 0.4 (that is, `α` = 2.5) gives `⟨0.2, 0.8⟩`. Given clouds, the probability of rain is 0.2, the same 0.2 that Bayes' rule produced.

The two routes agree because this table and the three numbers of the previous section describe the same world: 0.08 ÷ 0.1 = 0.8 is exactly `P(clouds | rain)`, and the 0.4 used to normalize is `P(cloudy)` obtained by marginalization.

</details>

### Bayesian networks: arrows for who influences whom

[Recording 49:42–1:03:19](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=2982s)

With the mathematical tools in place, the lecturer starts putting them into models a computer can use. The first is the **Bayesian network**: a directed graph that represents the dependence among random variables.

- Each node is a random variable.
- An arrow from X to Y means X is a **parent** of Y.
- Each node X stores a probability distribution `P(X | Parents(X))`, the distribution of X given the values of its parents.

You can think of the parents as causes and the node itself as the effect that is observed.

The lecture's example ([51:32](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=3092s)): I have an appointment out of town and need to take a train to get there. Four random variables:

| Node | Values | Parents |
|---|---|---|
| Rain | none, light, heavy | none |
| Maintenance (track maintenance) | yes, no | Rain |
| Train | on time, delayed | Rain, Maintenance |
| Appointment | attend, miss | Train |

The values are the strings used in the lecture code: none, light and heavy for no rain, light rain and heavy rain; on time and delayed for the train; attend and miss for the appointment.

There are four arrows: Rain → Maintenance, Rain → Train, Maintenance → Train, Train → Appointment. The heavier the rain, the more likely the maintenance crew waits for another day, so Rain influences Maintenance; both rain and maintenance make a delay more likely; and making the appointment depends only on the train.

The lecturer then goes through the distribution of each node ([54:20](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=3260s)). The complete numbers in the four tables below come from the lecture's published source code, `src2/bayesnet/model.py`; the cells in bold are the ones the lecturer says aloud somewhere in the recording, a few of them only later, while going through the code and the sampling.

Rain has no parents, so it stores an unconditional distribution:

| none | light | heavy |
|---|---|---|
| **0.7** | **0.2** | **0.1** |

Maintenance given Rain:

| Rain | yes | no |
|---|---|---|
| none | **0.4** | **0.6** |
| light | 0.2 | 0.8 |
| heavy | **0.1** | **0.9** |

Train given Rain and Maintenance:

| Rain | Maintenance | on time | delayed |
|---|---|---|---|
| none | yes | **0.8** | **0.2** |
| none | no | 0.9 | 0.1 |
| light | yes | **0.6** | **0.4** |
| light | no | 0.7 | 0.3 |
| heavy | yes | 0.4 | 0.6 |
| heavy | no | 0.5 | 0.5 |

Appointment given Train:

| Train | attend | miss |
|---|---|---|
| on time | **0.9** | 0.1 |
| delayed | **0.6** | **0.4** |

Every row sums to 1, because each row is one complete distribution for a particular setting of the parents.

The lecturer makes a point of explaining why Appointment has only Train as a parent. Track maintenance does affect whether I make the appointment, but only indirectly, through the train being delayed. The network draws only direct relationships: once you know whether the train is on time or delayed, knowing about maintenance or how hard it is raining adds nothing.

With these tables you can compute joint probabilities ([1:00:12](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=3612s)). The lecturer builds up in four steps:

- `P(light)`: Rain has no parents, so read it straight from the table.
- `P(light, no)` = `P(light)` × `P(no | light)`. Maintenance has Rain as its parent, so use the row for light rain.
- `P(light, no, delayed)` = `P(light)` × `P(no | light)` × `P(delayed | light, no)`.
- `P(light, no, delayed, miss)` = `P(light)` × `P(no | light)` × `P(delayed | light, no)` × `P(miss | delayed)`. The last factor looks only at Train, not at rain or maintenance.

The rule is that each node contributes one number, its conditional probability given its parents, and all of them are multiplied. The lecturer stops at the expression; substituting from the tables, the last one is 0.2 × 0.8 × 0.3 × 0.4 = 0.0192 (my calculation).

The `joint_probability` function of the Heredity project does this same multiplication: each person's gene count and trait contribute one conditional probability each, and all of them are multiplied. That comparison is mine; the lecture does not mention the projects.

**Check yourself. Write your answer down before opening the fold.** Using the four tables above, compute the joint probability of "no rain, maintenance, train on time, appointment attended". If you wrote the last factor as `P(attend | none, yes, on time)` and went to look it up, what problem would you hit?

<details>
<summary>Answer</summary>

`P(none)` × `P(yes | none)` × `P(on time | none, yes)` × `P(attend | on time)` = 0.7 × 0.4 × 0.8 × 0.9 = 0.2016. All four numbers are ones the lecturer reads aloud.

The Appointment table is conditioned on Train alone, with no Rain or Maintenance column, so there is no cell for `P(attend | none, yes, on time)`, and none is needed: given Train, Appointment no longer depends on the other two variables, so the value is simply `P(attend | on time)` = 0.9. Each node is conditioned only on its own parents.

</details>

### Inference: from evidence to the distribution of other variables

[Recording 1:03:19–1:19:39](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=3799s)

Last week inference meant deriving true sentences from sentences known to be true. This week it becomes: from the evidence you have, compute the probability of other variables taking each of their values. The lecturer splits an inference problem into three kinds of variable ([1:04:17](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=3857s)):

- The **query** variable X: the one whose distribution we want.
- The **evidence** variables E: variables whose values have been observed; the observed values are written e.
- The **hidden variables** Y: everything that is neither query nor evidence.

The goal is to compute `P(X | e)`.

His example ([1:06:18](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=3978s)): given light rain and no track maintenance, what is the distribution over making the appointment? The query is Appointment, the evidence is Rain = light and Maintenance = no, and the hidden variable is Train. The derivation uses two moves from earlier:

1. A conditional distribution is proportional to the joint probability: `P(Appointment | light, no)` = `α P(Appointment, light, no)`.
2. Train is missing on the right, so marginalize over its two values: `α [P(Appointment, light, no, on time) + P(Appointment, light, no, delayed)]`.

Each term in the brackets is a joint probability over all four variables, which the previous section showed how to compute. Normalize at the end so the result sums to 1. This method is called **inference by enumeration**, and its general form is:

```text
P(X | e) = α P(X, e) = α Σ_y P(X, e, y)
```

`y` ranges over every possible setting of the hidden variables.

The lecturer stops at the expression. Substituting from the previous section's tables looks like this (the numbers below are my calculation):

| | Train = on time | Train = delayed | Sum |
|---|---|---|---|
| attend | 0.2 × 0.8 × 0.7 × 0.9 = 0.1008 | 0.2 × 0.8 × 0.3 × 0.6 = 0.0288 | 0.1296 |
| miss | 0.2 × 0.8 × 0.7 × 0.1 = 0.0112 | 0.2 × 0.8 × 0.3 × 0.4 = 0.0192 | 0.0304 |

0.1296 and 0.0304 sum to 0.16; dividing each by 0.16 gives `⟨0.81, 0.19⟩`. With light rain and no maintenance there is an 81% chance of making the appointment.

Doing this by hand is tedious, so the lecturer hands it to a library ([1:11:26](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=4286s)). He uses pomegranate for Python and stresses that the choice of library matters little; the point is that once you describe the structure of the network and the distribution at each node, the library does the calculation. `model.py` follows the previous section: one node per variable, an unconditional distribution for Rain and conditional probability tables for the other three, then four edges matching the arrows.

`likelihood.py` computes joint probabilities ([1:14:50](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=4490s)):

- No rain, no maintenance, train on time, appointment attended: about 0.34.
- No rain, no maintenance, train on time, appointment missed: about 0.04.

By hand from the tables these are 0.7 × 0.6 × 0.9 × 0.9 = 0.3402 and 0.7 × 0.6 × 0.9 × 0.1 = 0.0378 (my calculation), which match the program's output.

`inference.py` does inference ([1:16:51](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=4611s)). The only evidence is that the train is delayed, and the program reports the distributions of the other three variables. The results the lecturer reads out are: no rain about 46%, light rain 31%, heavy rain 23%. He then adds a second piece of evidence, heavy rain, and runs it again:

- The probability of no track maintenance goes from 64% to 88%. Maintenance is less likely on a day of heavy rain.
- The distribution for the appointment does not change; it is still attend 0.6, miss 0.4.

The second point confirms what the previous section said: Appointment depends only on Train, so once the train is known to be delayed, learning how hard it is raining changes nothing.

My addition: doing inference by enumeration from the tables, the way this section teaches it, gives no rain 46.0%, light rain 30.0%, heavy rain 23.9% and no maintenance 63.4% given a delayed train (my calculation), slightly off from the 31%, 23% and 64% the lecturer reads. He is not misreading. The source documentation of pomegranate v0.14.8 says `predict_proba` uses loopy belief propagation, an approximate algorithm that is exact only for certain graph structures; in this network Rain points to Train directly and also through Maintenance, which forms a loop. I wrote that algorithm myself and ran it on the same network, getting 45.83%, 30.69%, 23.48% and 64.32%, which round to the whole numbers the lecturer reads. Once heavy rain is added as evidence the loop is cut, and the approximation and enumeration both give 88.2%, so the 88% agrees either way. The lecture does not mention this. I did not check which pomegranate version the lecture used in 2020 and did not install the library to run it; the basis is the v0.14.8 documentation and my own recalculation. If your hand calculation from the tables does not match the lecturer's numbers, trust the hand calculation.

Last comes the limit of inference by enumeration. It has to go through every setting of the hidden variables, and as the number of variables and the number of values per variable grow, the amount of computation becomes unreasonable. The lecturer mentions that avoiding repeated calculation of the same probabilities can speed it up, without going into it, and turns to a different route: give up the exact probability and settle for one that is close enough.

**Check yourself. Write your answer down before opening the fold.** Using the previous section's tables, compute the distribution over making the appointment given heavy rain and track maintenance. Which variables are the query, the evidence and the hidden variable?

<details>
<summary>Answer</summary>

The query is Appointment, the evidence is Rain = heavy and Maintenance = yes, and the hidden variable is Train.

`P(heavy)` × `P(yes | heavy)` = 0.1 × 0.1 = 0.01, and every term is multiplied by it.

- attend: 0.01 × (0.4 × 0.9 + 0.6 × 0.6) = 0.01 × 0.72 = 0.0072
- miss: 0.01 × (0.4 × 0.1 + 0.6 × 0.4) = 0.01 × 0.28 = 0.0028

These sum to 0.01; dividing each by 0.01 gives attend 0.72, miss 0.28. The 0.01 from the evidence appears once in the numerator and once in the denominator and cancels during normalization, which is why it can be left to `α` from the start. The numbers in this question are my calculation.

</details>

### Approximate inference: sampling, rejection sampling and likelihood weighting

[Recording 1:19:39–1:32:33](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=4779s)

**Sampling** draws a random value for each variable according to the network's probability distributions, repeats that many times, and uses the proportions among the samples as estimates of the probabilities ([1:20:57](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=4857s)).

Drawing one sample starts at the node with no parents and follows the arrows down. The lecturer does it once:

1. Rain: draw according to 0.7, 0.2, 0.1, and suppose the result is none.
2. Maintenance: Rain = none has already been drawn, so look only at that row, where yes has probability 0.4. Suppose the result is yes.
3. Train: look at the row for Rain = none, Maintenance = yes, where on time has probability 0.8. Suppose the result is on time.
4. Appointment: look at the row for Train = on time, where attend has probability 0.9. Suppose the result is attend.

That is one sample. Repeat it thousands or tens of thousands of times and you have a large collection.

To estimate `P(Train = on time)`, count samples. The lecturer has 8 samples on screen, and in 6 of them the train is on time, so the estimate is 6/8. Eight samples are obviously not enough for a good estimate, and more samples bring it closer to the true probability. Computed exactly from the previous section's tables it is 0.787 (my calculation), so the 0.75 from eight samples is already not far off.

What about a conditional probability ([1:24:34](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=5074s))? Say, the probability of light rain given that the train is on time. The approach is to discard the samples that do not match the evidence: 2 of the 8 samples have a delayed train and are rejected; of the remaining 6, 2 have light rain, so the estimate is 2/6. This is **rejection sampling**.

`sample.py` implements it. `generate_sample` goes through the nodes in order, and a node with parents is sampled according to the values its parents have already been given. The main program draws 10,000 samples to find the distribution of Appointment given that the train is delayed, so it keeps only the samples where the train is delayed, records their Appointment values, and counts them with `Counter`. The lecturer runs it twice:

| | attend | miss |
|---|---|---|
| First run | 1,251 | 856 |
| Second run | 1,272 | 905 |

The two runs are close but not identical, because the process is random. As a proportion, the first run is 1,251 ÷ 2,107 ≈ 0.594, very close to the 0.6 from exact inference in the previous section (the proportion is my calculation).

Notice that the first run kept only 1,251 + 856 = 2,107 samples and threw away nearly eight thousand (my calculation). The lecturer goes on to the problem with rejection sampling: the rarer the evidence, the more samples are discarded. If the evidence occurs once in a thousand times, only one in a thousand samples is usable, and every sample costs computation to generate.

**Likelihood weighting** avoids discarding samples ([1:29:30](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=5370s)). The steps are:

1. Fix the values of the evidence variables and do not sample them.
2. Sample the other variables as before.
3. Give each sample a weight: how probable the evidence is within that sample.

The lecturer demonstrates on the same question: the probability of light rain given that the train is on time. Train is fixed to on time. Sample Rain and suppose the result is light; sample Maintenance and suppose it is yes; Train is evidence, so skip it; then sample Appointment. The weight of this sample is the probability that the train is on time given light rain and maintenance, which the table gives as 0.6.

Before, every sample had a weight of 1; now a sample counts for more the more likely the evidence is within it. The lecturer mentions that other sampling methods exist with the same aim, and does not go into them.

On how weights turn into an estimate, the lecturer says only that each sample is multiplied by its weight. Here is a worked example of my own: where you used to count samples and divide, you now add up weights and divide. Suppose only two samples were drawn. Sample 1 is light rain with maintenance (weight 0.6); sample 2 is no rain with maintenance (weight 0.8, the table cell `P(on time | none, yes)`). Only sample 1 has light rain, so the estimate of `P(light rain | on time)` is 0.6 ÷ (0.6 + 0.8) ≈ 0.43. The exact value from the tables is 0.173 (my calculation), a long way off, because two samples are nowhere near enough; the weighted proportion approaches the exact value only as the samples accumulate.

**Check yourself. Write your answer down before opening the fold.** (1) `sample.py` draws 10,000 samples, and the lecture's first run kept 2,107. If the evidence had probability one in a thousand, how many would you expect to keep out of the same 10,000? (2) You use likelihood weighting to estimate a distribution given that the train is on time, and one sample comes out as Rain = none, Maintenance = yes. What is its weight?

<details>
<summary>Answer</summary>

(1) About 10,000 × 1/1000 = 10. A proportion estimated from 10 samples is unreliable; to end up with the same number of usable samples as before you would have to draw more than two million.

(2) The weight is the probability of the evidence within this sample, that is `P(on time | none, yes)` = 0.8, a cell the lecturer reads aloud. Compared with the lecture's sample of weight 0.6 (light rain, maintenance), this one counts for more, because the train is more likely to be on time when it is not raining. Likelihood weighting throws no sample away; the weight puts back how easy or hard it was for the evidence to occur.

</details>

### Markov chains: a state that changes over time

[Recording 1:32:33–1:39:49](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=5553s)

Each variable so far has described the situation at a single point in time. With something like the weather, though, what we care about is how it changes from day to day: the probability of rain tomorrow, or the day after. The lecturer's approach is one random variable per time step, with `Xₜ` the weather at time t: `X₀` is day 0, `X₁` is day 1, and so on.

The trouble is that the data becomes unmanageable. Predicting tomorrow from the past 365 days of weather means a conditional distribution given 365 pieces of evidence, and nobody knows what that table looks like. The lecturer says this is where a simplifying assumption helps, and that an assumption that is not exactly right but close is still very useful.

The assumption is the **Markov assumption** ([1:34:29](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=5669s)): the current state depends only on a fixed number of previous states. Most often that number is one: today's weather is predicted from yesterday's alone. A sequence of random variables that follows the Markov assumption is a **Markov chain**.

The lecture's example has two kinds of weather, sun and rain. The table describing how likely each kind of tomorrow is, given today, is the **transition model**:

| Today `Xₜ` | Tomorrow sun | Tomorrow rain |
|---|---|---|
| sun | 0.8 | 0.2 |
| rain | 0.3 | 0.7 |

Weather tends to persist: a sunny day is usually followed by a sunny day, a rainy day by a rainy day. With this table you can sample one day after another and get a chain, for example sun, sun, rain, rain, rain. You can also ask probability questions, such as the probability of rain tomorrow given rain today, or the probability of a particular sequence of weather. The lecturer raises both kinds of question and computes neither.

The code demonstration is in `chain/model.py` ([1:37:53](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=5873s)). A Markov chain needs a starting distribution, which the lecturer sets to sun 0.5, rain 0.5; he then writes in the transition model above and samples 50 states from the chain. The output looks the way the transition model says it should: a few sunny days in a row, then a long run of rain, then back to sun.

The PageRank project writes a surfer who clicks links at random as a Markov chain, with each web page a state and the transition model set by the links on the page. That description comes from the project spec; the lecture does not mention it.

**Check yourself. Write your answer down before opening the fold.** With the lecture's starting distribution (sun 0.5, rain 0.5) and transition model, what is the probability of the five-day sequence sun, sun, rain, rain, rain?

<details>
<summary>Answer</summary>

The first day uses the starting distribution, and each later day uses the transition-model cell for "given the day before":

`P(sun)` × `P(sun | sun)` × `P(rain | sun)` × `P(rain | rain)` × `P(rain | rain)` = 0.5 × 0.8 × 0.2 × 0.7 × 0.7 = 0.0392.

This is the same rule as the joint probability of a Bayesian network: each variable contributes one conditional probability given its parents. The Markov assumption makes the previous day the only parent of each day, so each factor looks back one day. The sequence is one the lecturer mentions aloud; the probability is my calculation.

</details>

### Hidden Markov models: when you only see observations

[Recording 1:39:49–1:54:29](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=5989s)

A Markov chain assumes we know the state on each day. In practice an AI often does not know the true state of the world; it has only what its sensors observe, and the observation is related to the state. The lecturer gives four pairs:

| Hidden state | Observation |
|---|---|
| A robot's position | Distance data from its sensors |
| The words a user actually spoke | Audio waveforms |
| How engaged a user is | Website or app analytics |
| The weather | Whether people bring umbrellas |

Observations are noisy, so the state cannot be determined from them for certain, only inferred.

The last pair is this section's example. Picture an AI inside a building with one indoor camera. It cannot see outside; it can only see whether employees bring an umbrella in. From that it has to infer whether it is sunny or rainy.

The model for this situation is the **hidden Markov model**, HMM from here on ([1:44:18](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=6258s)): a Markov model whose states are hidden, where each state produces an observation that can be seen. It needs two tables. One is the same transition model as in the previous section. The other is the **sensor model**, also called the emission probabilities, which gives the probability of each observation in each state:

| State | Umbrella | No umbrella |
|---|---|---|
| sun | 0.2 | 0.8 |
| rain | 0.9 | 0.1 |

Some cautious people bring an umbrella on a sunny day, and some people are caught out by rain. The lecturer reads these four numbers later, while going through the code.

The second assumption an HMM makes is the **sensor Markov assumption** ([1:45:53](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=6353s)): the observation depends only on the corresponding state. Whether people bring umbrellas today depends on today's weather alone. The lecturer says himself that this may not hold in practice, since yesterday's weather could matter too, but the simplification makes the reasoning easier and the answer is usually still good.

The whole model has two levels: the upper level is the sequence of hidden states `X₀`, `X₁`, `X₂`, connected by the transition model; the lower level is the observation each state produces, `E₀`, `E₁`, `E₂`.

Four tasks are common on this model ([1:48:12](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=6492s)). The lecturer explains what each one asks and says he will not go into their mathematics:

| Task | Given | Compute |
|---|---|---|
| Filtering | Observations from the start until now | The distribution of the current state |
| Prediction | Observations from the start until now | The distribution of a future state |
| Smoothing | Observations from the start until now | The distribution of a past state |
| Most likely explanation | Observations from the start until now | The most likely sequence of states |

Speech recognition is the last kind: from a sequence of audio waveforms, find the most likely sequence of words.

The code demonstration is in the `hmm` folder ([1:50:03](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=6603s)). `model.py` writes in the sensor model for the two states, the transition model and 50/50 starting probabilities. `sequence.py` gives the model a list of observations and asks it to predict the weather on each day. The observations the lecturer reads are: umbrella, umbrella, no umbrella, umbrella, umbrella, some he skips over, and finally no umbrella, no umbrella.

The day he cares about is the third. People bring umbrellas before and after it, and on that day alone they do not. Did it rain the whole time and people happened not to bring one? Or did the weather go from rain to sun and back to rain the next day? The second sounds unlikely, but it can happen. The model's answer is: rain, rain, then sunny for a day, then back to rain. The lecturer adds that if it had been rainy for longer, or the probabilities were slightly different, the answer might instead be rain all the way through with one day when nobody brought an umbrella.

The published `sequence.py` has nine days of observations in full: umbrella, umbrella, no umbrella, four days of umbrella, two days of no umbrella. Working by hand from that list and the two tables above, I computed the most likely state of each day taken separately; the third day is sunny with probability 0.627, which agrees with the output the lecturer sees. If you look for the single most probable whole sequence of states instead, the third day comes out as rain (of all 512 possible nine-day sequences, the most probable is seven days of rain followed by two of sun). The two ways of asking give different answers for that day. The lecturer calls this demonstration the most likely explanation, but in pomegranate v0.14.8 the default argument of `predict` is `algorithm='map'`, which computes the most likely state of each day separately; you have to ask for `viterbi` to get the whole-sequence answer. That is why the output matches the day-by-day calculation. The lecture does not discuss the difference, and I did not check which version the lecture used; this paragraph is my addition.

In the wrap-up the lecturer ties the week together: probability lets an AI describe in numbers which things are more likely; Bayesian networks, Markov chains and HMMs are three ready-made kinds of model; and once a problem is written as one of them, existing algorithms and libraries can do the inference.

**Check yourself. Write your answer down before opening the fold.** Use the lecture's starting probabilities (sun 0.5, rain 0.5) and sensor model. On the first day you see someone bring an umbrella. What is the probability that this day is rainy? Which of the four tasks is this?

<details>
<summary>Answer</summary>

This is filtering: using the observations so far to compute the distribution of the current state.

The method is the one from the section "Joint probability, normalization and four rules": compute the joint probabilities, then normalize.

- Rain and umbrella: 0.5 × 0.9 = 0.45
- Sun and umbrella: 0.5 × 0.2 = 0.10

They sum to 0.55, so `P(rain | umbrella)` = 0.45 ÷ 0.55 ≈ 0.818. It started as an even split, and one umbrella raises the probability of rain to about 82%. The lecturer does not do this calculation; the numbers are my calculation.

</details>

## Project 2A: Heredity — Inferring Genes and Traits with a Bayesian Network

This section covers the approach and how to check your work first; the full reference implementation is folded at the end and hidden by default.

### Task

Each person carries 0, 1 or 2 copies of a particular gene, and the number of copies affects whether they show a particular trait (the project spec uses the GJB2 gene and hearing impairment as its example). The number of copies cannot be seen; the trait can. Given, for each member of a family, who their parents are and whether they show the trait (possibly unknown), compute each person's distribution over gene copies and over showing the trait.

The input is a CSV with columns `name, mother, father, trait`, where `trait` is `1`, `0` or blank (unknown). There are three functions to implement: `joint_probability`, `update` and `normalize`.

The model is a Bayesian network: each person has a Gene node and a Trait node, Gene points to that person's Trait, and the parents' Gene nodes point to the child's Gene. The inheritance rules, per the project spec:

- A child gets one copy from each parent.
- A parent with 2 copies always passes the gene on, a parent with 0 copies does not, and a parent with 1 copy passes it on with probability 0.5.
- After it is passed on there is a `PROBS["mutation"]` (0.01) chance of mutation: a copy that was the gene stops being it, or a copy that was not becomes it.

### What the distribution code already provides

The provided `heredity.py` already contains `PROBS`, `main`, `load_data` and `powerset`. The three functions `joint_probability`, `update` and `normalize` hold only a docstring and `raise NotImplementedError` in the provided file, and are yours to write.

```python
# heredity.py (provided, excerpt)
PROBS = {

    # Unconditional probabilities for having gene
    "gene": {
        2: 0.01,
        1: 0.03,
        0: 0.96
    },

    "trait": {

        # Probability of trait given two copies of gene
        2: {
            True: 0.65,
            False: 0.35
        },

        # Probability of trait given one copy of gene
        1: {
            True: 0.56,
            False: 0.44
        },

        # Probability of trait given no gene
        0: {
            True: 0.01,
            False: 0.99
        }
    },

    # Mutation probability
    "mutation": 0.01
}
```

`load_data` reads the CSV into a dictionary; no class is defined. `data/family0.csv` loads as:

```python
{
    'Harry': {'name': 'Harry', 'mother': 'Lily', 'father': 'James', 'trait': None},
    'James': {'name': 'James', 'mother': None, 'father': None, 'trait': True},
    'Lily': {'name': 'Lily', 'mother': None, 'father': None, 'trait': False}
}
```

What the provided `main` does is inference by enumeration. For each combination of who has the trait (`for have_trait in powerset(names)`) it first checks whether that combination contradicts the traits known from the CSV and skips it with `continue` if so. Then comes this part:

```python
# main in heredity.py (provided, excerpt)
        # Loop over all sets of people who might have the gene
        for one_gene in powerset(names):
            for two_genes in powerset(names - one_gene):

                # Update probabilities with new joint probability
                p = joint_probability(people, one_gene, two_genes, have_trait)
                update(probabilities, one_gene, two_genes, have_trait, p)

    # Ensure probabilities sum to 1
    normalize(probabilities)
```

In other words it goes through every combination of who has the trait, who has one copy and who has two, keeps the ones consistent with the evidence, computes the joint probability of each, adds it to the matching cell for each person, and normalizes at the end. That is the expression `α Σ_y P(X, e, y)` from the "[Inference](#inference-from-evidence-to-the-distribution-of-other-variables)" section of the walkthrough ([Recording 1:06:18](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=3978s)): there is no sampling and there are no weights.

### Approach

Each of the three functions is one step of inference by enumeration.

**`joint_probability` computes the joint probability of one assignment.** The method is the multiplication from the "[Bayesian networks](#bayesian-networks-arrows-for-who-influences-whom)" section of the walkthrough ([Recording 1:00:12](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=3612s)): each node contributes one conditional probability given its parents, and all of them are multiplied. Here each person has two nodes, so each person contributes two numbers.

- The Trait node has the person's own Gene as its parent. Knowing how many copies the person has under this assignment and whether they have the trait, read the value from `PROBS["trait"]`.
- The Gene node splits people into two kinds. For someone with no parents in the data, Gene has no parents, so read the unconditional distribution in `PROBS["gene"]`. For someone with parents listed, the parents of Gene are the mother's and father's Gene nodes, and the probability has to be worked out from the inheritance rules.

To work it out, first ask two separate questions: the probability that the mother passes the gene on, and the probability that the father does. Each depends only on how many copies that parent has under this assignment:

- A parent with 2 copies always passes the gene, and only a mutation removes it, so 0.99.
- A parent with 0 copies passes the gene only through a mutation, so 0.01.
- A parent with 1 copy passes the gene half the time (then it stays the gene with probability 0.99) and the other copy half the time (then it mutates into the gene with probability 0.01), so 0.5 × 0.99 + 0.5 × 0.01 = 0.5.

With those two numbers the child's count is one of three cases: 2 copies means both parents passed it; 0 copies means neither did; 1 copy means "mother passed it and father did not" or "father passed it and mother did not", two cases that cannot both happen, so their probabilities add.

**`update` records that joint probability against each person.** Under this assignment each person has a definite gene count and a definite trait value, so add p to the matching cell of each of that person's two distributions. This step is marginalization: the same cell receives contributions from many assignments.

**`normalize` is the final `α`.** The accumulated numbers do not sum to 1, so divide each distribution of each person by its own total.

### Pseudocode

```text
joint probability (one assignment: who has 1 copy, who has 2, who has the trait)
    result ← 1
    for each person in the family:
        copies ← this person's gene count under the assignment (0, 1 or 2)
        if the data lists no parents for them:
            gene probability ← unconditional probability of that many copies
        otherwise:
            from mother ← probability the mother passes the gene on (from her count under the assignment)
            from father ← probability the father passes the gene on (from his count under the assignment)
            copies is 2: gene probability ← both pass it
            copies is 0: gene probability ← neither passes it
            copies is 1: gene probability ← "mother passes, father does not" plus "father passes, mother does not"
        trait probability ← probability of having (or not having) the trait given that many copies
        result ← result × gene probability × trait probability
    return result

accumulate (one assignment and its joint probability p)
    for each person:
        add p to the cell of their gene distribution that matches the assignment
        add p to the cell of their trait distribution that matches the assignment

normalize
    for each distribution of each person:
        divide every cell by the total of that distribution
```

### Where it goes wrong

The numbers in this list come from runs on 2026-10-13 in which I put each wrong version into the provided file.

- **Writing it as sampling.** The provided `main` already enumerates every combination, so none of the three functions needs random numbers. The earlier version of this article made exactly this mistake and described it as likelihood-weighting sampling. How to notice: running the same CSV twice should give identical output, digit for digit; if it changes between runs you are on the wrong path.
- **Reading the parents as object attributes.** `people` is a dictionary of dictionaries, so a parent is read with `people[name]["mother"]`, and what comes back is a name string or `None`. Attribute-style access raises `AttributeError` straight away.
- **Counting only half of the one-copy case.** "Mother passes, father does not" and "father passes, mother does not" have to be added. With only "father passes, mother does not", the spec's example returns 0.0026640529344, which differs from the correct 0.0026643247488 only in the seventh decimal place and is easy to wave through at a glance (with only the other case, "mother passes, father does not", it returns 0.00000027, which is obviously wrong). A different mistake is to multiply the mother's and the father's passing probabilities directly, which is the two-copy formula applied to one copy; that gives 0.0000269, a hundred times too small.
- **Writing the one-copy parent's probability as 0.5 × 0.99.** That drops the half where the other copy is passed and mutates back, and gives 0.495. The spec's example cannot catch it (no parent there has one copy), so look at the full output: Harry in `family0.csv` becomes 0.0091 / 0.4532 / 0.5377 where the correct values are 0.0092 / 0.4557 / 0.5351.
- **Normalizing over the wrong scope.** Each person's gene distribution and trait distribution are normalized separately. Dividing by a total taken over everyone leaves individual distributions that do not sum to 1.

### How to check your own work

**The spec's example.** `joint_probability(people, {"Harry"}, {"James"}, {"James"})`, that is, Lily has 0 copies and no trait, James has 2 copies and the trait, Harry has 1 copy and no trait, should return 0.0026643247488. The spec page works it through by hand:

- Lily: 0.96 × 0.99 = 0.9504
- James: 0.01 × 0.65 = 0.0065
- Harry has 1 copy: he gets the gene from his mother and not his father, or from his father and not his mother. His mother has 0 copies and passes it with probability 0.01; his father has 2 copies and passes it with probability 0.99. 0.01 × 0.01 + 0.99 × 0.99 = 0.9802. Times 0.44 for one copy and no trait gives 0.431288.
- Multiply everything: 0.9504 × 0.0065 × 0.431288 = 0.0026643247488

Compare down to the last digit, for the reason given in the previous section.

**The full output.** The spec page lists the expected output for `family0.csv`:

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/2/heredity.zip
unzip heredity.zip && cd heredity

python heredity.py data/family0.csv
# Expected output listed on the spec page:
# Harry: Gene 2: 0.0092, 1: 0.4557, 0: 0.5351; Trait True: 0.2665, False: 0.7335
# James: Gene 2: 0.1976, 1: 0.5106, 0: 0.2918; Trait True: 1.0000, False: 0.0000
# Lily:  Gene 2: 0.0036, 1: 0.0136, 0: 0.9827; Trait True: 0.0000, False: 1.0000
```

**Checks that need no answer key.**

- For each person, the three Gene numbers sum to 1 and the two Trait numbers sum to 1 (allowing for rounding at four decimals).
- For anyone whose trait is known in the CSV, the Trait distribution should be 1.0000 and 0.0000: James has the trait, Lily does not.
- Running the same file twice gives the same output.
- `family1.csv` and `family2.csv` should run to completion too.

**The official tools.**

```bash
check50 ai50/projects/2024/x/heredity
style50 heredity.py
```

### Full reference implementation

<details>
<summary>Full reference implementation (open only after you have written and submitted your own)</summary>

> ⚠️ If you are taking this course, or plan to apply for a CS50 certificate: the course's [academic honesty policy](https://cs50.harvard.edu/ai/honesty/) says you may not look at someone else's solution before submitting your own work. Finish and submit first, then use this part to compare. This implementation has been run only in the setup described on this site and has not been through check50.

```python
# heredity.py: the three functions, plus two helpers
def joint_probability(people, one_gene, two_genes, have_trait):
    probability = 1
    for person in people:
        genes = gene_count(person, one_gene, two_genes)
        mother = people[person]["mother"]
        father = people[person]["father"]

        if mother is None and father is None:
            # No parents in the data: use the unconditional distribution
            p_gene = PROBS["gene"][genes]
        else:
            # Parents listed: probability that each one passes the gene on
            from_mother = pass_probability(gene_count(mother, one_gene, two_genes))
            from_father = pass_probability(gene_count(father, one_gene, two_genes))
            if genes == 2:
                p_gene = from_mother * from_father
            elif genes == 1:
                p_gene = (from_mother * (1 - from_father)
                          + (1 - from_mother) * from_father)
            else:
                p_gene = (1 - from_mother) * (1 - from_father)

        p_trait = PROBS["trait"][genes][person in have_trait]
        probability *= p_gene * p_trait
    return probability


def gene_count(person, one_gene, two_genes):
    """How many copies this person has under the current assignment."""
    if person in two_genes:
        return 2
    if person in one_gene:
        return 1
    return 0


def pass_probability(genes):
    """Probability that a parent with `genes` copies passes the gene to a child."""
    if genes == 2:
        return 1 - PROBS["mutation"]
    if genes == 1:
        return 0.5
    return PROBS["mutation"]


def update(probabilities, one_gene, two_genes, have_trait, p):
    for person in probabilities:
        genes = gene_count(person, one_gene, two_genes)
        probabilities[person]["gene"][genes] += p
        probabilities[person]["trait"][person in have_trait] += p


def normalize(probabilities):
    for person in probabilities:
        for field in probabilities[person]:
            total = sum(probabilities[person][field].values())
            for value in probabilities[person][field]:
                probabilities[person][field][value] /= total
```

Run results (2026-10-13, inside the provided `heredity.py`): the spec's example returns 0.0026643247488, the output of `python heredity.py data/family0.csv` matches the numbers on the spec page digit for digit, and `family1.csv` and `family2.csv` run to completion.

</details>

---

## Project 2B: PageRank — Sampling and Iterative Algorithms

This section covers the approach and how to check your work first; the full reference implementation is folded at the end and hidden by default.

### Task

For a set of web pages that link to each other, compute each page's PageRank: the probability that a surfer clicking links at random is on that page at a given moment. The project spec describes the surfer as a Markov chain, with each page a state and the next page chosen by a transition model. To keep the surfer from getting stuck among a few pages that link only to each other, it adds a damping factor `d` (0.85 by default): with probability `d` the surfer picks one of the links on the current page at random, and with probability `1 − d` picks one of all the pages at random (including the current one).

There are three functions to implement:

1. `transition_model(corpus, page, damping_factor)`: returns the probability distribution over the next page, starting from `page`.
2. `sample_pagerank(corpus, damping_factor, n)`: draws `n` samples following the transition model and uses the share of samples on each page as the estimate.
3. `iterate_pagerank(corpus, damping_factor)`: applies the formula below repeatedly until no page changes by more than 0.001.

```text
PR(p) = (1 − d) / N + d × Σᵢ PR(i) / NumLinks(i)
```

`N` is the total number of pages, `i` ranges over the pages that link to `p`, and `NumLinks(i)` is the number of links on page `i`. The spec adds one more rule: a page with no links at all is treated as linking to every page (including itself).

### What the distribution code already provides

The provided `pagerank.py` already contains `main` and `crawl`. The three functions `transition_model`, `sample_pagerank` and `iterate_pagerank` hold only a docstring and `raise NotImplementedError`, and are yours to write.

```python
# pagerank.py (provided, excerpt)
DAMPING = 0.85
SAMPLES = 10000


def main():
    if len(sys.argv) != 2:
        sys.exit("Usage: python pagerank.py corpus")
    corpus = crawl(sys.argv[1])
    ranks = sample_pagerank(corpus, DAMPING, SAMPLES)
    print(f"PageRank Results from Sampling (n = {SAMPLES})")
    for page in sorted(ranks):
        print(f"  {page}: {ranks[page]:.4f}")
    ranks = iterate_pagerank(corpus, DAMPING)
    print(f"PageRank Results from Iteration")
    for page in sorted(ranks):
        print(f"  {page}: {ranks[page]:.4f}")
```

`crawl` returns a dictionary whose keys are page file names and whose values are the set of pages each one links to. `corpus0` loads as:

```python
{
    "1.html": {"2.html"},
    "2.html": {"1.html", "3.html"},
    "3.html": {"2.html", "4.html"},
    "4.html": {"2.html"}
}
```

None of the three functions has default arguments; `main` passes `DAMPING` and `SAMPLES` in. The file already imports `random` at the top.

### Approach

**`transition_model` is one row of the transition model from the "[Markov chains](#markov-chains-a-state-that-changes-over-time)" section of the walkthrough** ([Recording 1:34:29](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=5669s)): given the page you are on, the probability of each page being next. The probability comes from two sources, and keeping them apart avoids mistakes. The `1 − d` share is split evenly over all pages, so every page gets `(1 − d) / N`. The `d` share is split evenly over the links on the current page. A page that is linked to gets both. When the current page has no links at all, the spec says to treat it as linking to every page, so the `d` share is split over all of them as well.

**`sample_pagerank` draws states from this Markov chain one after another**, the same thing the lecturer does when he samples 50 days from the weather chain, and it estimates probabilities by counting samples as in the "[Approximate inference](#approximate-inference-sampling-rejection-sampling-and-likelihood-weighting)" section ([Recording 1:20:57](https://www.youtube.com/watch?v=D8RRq3TbtHU&t=4857s)). The first sample is a page chosen at random from all pages; every later sample is drawn from the transition model of the page the previous sample was on. Once there are `n` of them, divide each page's count by `n`.

**`iterate_pagerank` does no sampling and solves the formula directly.** Give every page `1 / N`. In each round take the whole previous set of values and compute a new value for every page from the formula: for each page that links to it, take that page's previous value divided by that page's number of links, add these up, multiply by `d`, and add `(1 − d) / N`. When a round is finished, stop if no page moved by more than 0.001; otherwise run another round from the new set.

### Pseudocode

```text
transition model (the page you are on)
    every page starts with (1 − d) / N
    links ← the links on the current page; if there are none, use all pages instead
    for each page among the links: add d / number of links
    return a probability for every page (every page must be present)

sampling (draw n samples)
    counts ← 0 for every page
    current ← a page chosen at random from all pages; it is the first sample
    repeat until there are n samples in total:
        draw the next page according to the transition model of current
        current ← that page; add 1 to its count
    return each page's count ÷ n

iteration
    old ← 1 / N for every page
    repeat:
        for each page p:
            total ← for every page that links to p, its previous value ÷ its number of links, all added up
                    (a page with no links counts as linking to every page, itself included, so every page gets a share of it)
            new[p] ← (1 − d) / N + d × total
        if |new − old| is at most 0.001 for every page: return new
        old ← new
```

### Where it goes wrong

The numbers in this list come from runs on 2026-10-13 in which I put each wrong version into the provided file; "the converged value" means a separate run of the same formula for 5,000 rounds.

- **Overwriting as you go.** Each round of the iteration has to use the whole previous set of values and swap in the new set only when the round is done. Updating the same dictionary in place makes later pages use this round's new values. The symptom: the total over all pages is not 1, and the result is further from the converged value than the 0.001 the spec asks for. In this site's run (pages in the order `crawl` returned them) the totals for the three corpora were 0.9942, 0.9905 and 0.9916, up to 0.0025 away from the converged value; the outcome depends on page order, and rerunning with the pages sorted by file name gave totals of 1.0042, 1.0039 and 1.0083. The order `crawl` returns varies by operating system, so your numbers may differ; the test is that the total is not 1.
- **Not handling a page with no links.** `recursion.html` in `corpus2` has no outgoing links. Leave out the "treat it as linking to every page" step in the iteration and the total over all pages of `corpus2` drops to 0.7134. `corpus0` and `corpus1` have no such page, so running only those two hides the problem. The transition model needs the same handling, or the probabilities leaving such a page do not sum to 1 (depending on how it is written, the step that splits the `d` share may divide by zero instead).
- **Which set to return on convergence: a note, not a mistake.** When convergence is detected you hold two sets of values, the previous round's and the one just computed. Either one is within 0.001 of the converged value. The numbers the spec page lists for `corpus0` (0.2202, 0.4289, 0.2202, 0.1307) are digit for digit the output of returning the previous round; this site's reference implementation returns the set just computed, so its fourth decimal differs. The new set is closer to the converged value: 0.0003 against 0.00096 on `corpus1`. Which of the two check50 accepts has not been verified here.
- **One sample too many or too few.** The first, randomly chosen page counts as a sample. If it is not counted, or the loop runs one extra time, the counts do not total `n` and the returned proportions do not sum to exactly 1.
- **Pages missing from the returned dictionary.** The spec page warns that many students fail the autograder because of how their dictionaries are built. All three functions must return a dictionary with every page of the corpus; in the transition model a page that is not linked to has probability `(1 − d) / N`, and it must still be there.

### How to check your own work

**The spec's example.** With the corpus `{"1.html": {"2.html", "3.html"}, "2.html": {"3.html"}, "3.html": {"2.html"}}`, the current page `1.html` and a damping factor of 0.85, `transition_model` should return `{"1.html": 0.05, "2.html": 0.475, "3.html": 0.475}`. The 0.85 is split between the two links, 0.425 each, and the other 0.15 is split among the three pages, 0.05 each.

**A small case you can do by hand** (my own). The corpus has two pages, `a` with no links and `b` linking to `a`, and the damping factor is 0.85:

- Starting from `a`: `a` has no links and is treated as linking to both pages, so the result is `a` 0.5, `b` 0.5.
- Starting from `b`: each page first gets 0.15 ÷ 2 = 0.075, and `a` gets another 0.85, so the result is `a` 0.925, `b` 0.075.

**The full output.**

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/2/pagerank.zip
unzip pagerank.zip && cd pagerank

python pagerank.py corpus0
```

The spec page lists the iterative result for `corpus0` as 0.2202, 0.4289, 0.2202, 0.1307 and a sampling result of 0.2223, 0.4303, 0.2145, 0.1329. The range to expect:

- Each page of the iterative result is within 0.001 of the spec page's number. Output that matches the spec page digit for digit, or differs in the fourth decimal, is normal either way: the spec page's numbers are what you get by returning the previous round on convergence; returning the set just computed (this site's reference implementation) gives 0.2198, 0.4294, 0.2198, 0.1311; and the converged value is 0.2199, 0.4292, 0.2199, 0.1310.
- The sampling result changes on every run. Running the reference implementation 10 times on each of the three corpora (ten thousand samples), the gap between sampling and iteration for the same page had a median of 0.006 and a maximum of 0.015; a separate batch of 30 runs by the independent reviewer had a median of 0.005 and a maximum of 0.020. The maximum moves from batch to batch, so a number a little above these is no cause for alarm. This site's judgment is that a gap of 0.03 or more is worth going back to investigate; the spec sets no such number.
- The values returned by each method sum to 1. Run all three corpora; only `corpus2` exercises a page with no links.

**The official tools.**

```bash
check50 ai50/projects/2024/x/pagerank
style50 pagerank.py
```

### Full reference implementation

<details>
<summary>Full reference implementation (open only after you have written and submitted your own)</summary>

> ⚠️ If you are taking this course, or plan to apply for a CS50 certificate: the course's [academic honesty policy](https://cs50.harvard.edu/ai/honesty/) says you may not look at someone else's solution before submitting your own work. Finish and submit first, then use this part to compare. This implementation has been run only in the setup described on this site and has not been through check50.

```python
# pagerank.py: the three functions
def transition_model(corpus, page, damping_factor):
    pages = list(corpus)
    links = corpus[page] or set(pages)  # a page with no links counts as linking to all pages
    distribution = {p: (1 - damping_factor) / len(pages) for p in pages}
    for link in links:
        distribution[link] += damping_factor / len(links)
    return distribution


def sample_pagerank(corpus, damping_factor, n):
    counts = {page: 0 for page in corpus}
    page = random.choice(list(corpus))
    counts[page] += 1
    for _ in range(n - 1):
        model = transition_model(corpus, page, damping_factor)
        page = random.choices(list(model), weights=list(model.values()))[0]
        counts[page] += 1
    return {page: count / n for page, count in counts.items()}


def iterate_pagerank(corpus, damping_factor):
    N = len(corpus)
    ranks = {page: 1 / N for page in corpus}
    while True:
        new_ranks = {}
        for page in corpus:
            total = 0
            for other, links in corpus.items():
                if not links:
                    total += ranks[other] / N  # no links: counts as linking to every page
                elif page in links:
                    total += ranks[other] / len(links)
            new_ranks[page] = (1 - damping_factor) / N + damping_factor * total
        converged = all(abs(new_ranks[p] - ranks[p]) <= 0.001 for p in corpus)
        ranks = new_ranks
        if converged:
            return ranks
```

Run results (2026-10-13, inside the provided `pagerank.py`): the spec's `transition_model` example returns matching values; on `corpus0`, `corpus1` and `corpus2` both methods give results that sum to 1; the iterative result for `corpus0` is 0.2198, 0.4294, 0.2198, 0.1311, within 0.001 of the spec page.

</details>

---

## Learning Checklist

- [ ] Can use the definition of conditional probability to get a conditional distribution from a joint probability table, and say what the normalizing constant `α` is doing
- [ ] Can use Bayes' rule to get `P(cause | effect)` from `P(effect | cause)`
- [ ] Can follow the arrows of a Bayesian network to write a joint probability as a product of per-node conditional probabilities, and use inference by enumeration to get the distribution of a query variable
- [ ] Can explain how rejection sampling and likelihood weighting differ: the first discards samples that do not match the evidence, the second fixes the evidence and weights the samples
- [ ] Can use a transition model to compute the probability of a sequence of states, and say which extra table an HMM has compared with a Markov chain
- [ ] Heredity: your own `joint_probability` returns 0.0026643247488 for the spec's example (compared to the last digit), and the output for `family0.csv` matches the spec page
- [ ] PageRank: your own `transition_model` returns 0.05, 0.475, 0.475 for the spec's example; on all three corpora each method's results sum to 1, and the iterative result for `corpus0` is within 0.001 of the spec page
- [ ] Can explain what the damping factor does, and why a page with no links is treated as linking to every page
- [ ] Both projects pass `check50` clean

## Course video sources

The official CS50 YouTube playlist (CS50’s Introduction to Artificial Intelligence with Python, 8 videos) was checked live on 2026-10-10; the Week 2 lecture recording is listed there.

Original videos: [Uncertainty - Lecture 2 - CS50's Introduction to Artificial Intelligence with Python 2020](https://www.youtube.com/watch?v=D8RRq3TbtHU)

Course and recording entries:

- [CS50 AI Week 2 — official video, slides and notes](https://cs50.harvard.edu/ai/weeks/2/)
- [CS50's Introduction to AI with Python — official YouTube playlist (8 videos)](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-13): I fetched the timecoded, human-written English captions with yt-dlp, read the full 1:54:29, and rewrote "Lecture walkthrough" from them. Section start times and the numbers quoted in the text (the dice, the three weather percentages and the joint probability table, the Bayesian network cells that are read aloud, the library output, the sample counts, the transition model and the sensor model) all come from the captions. I did not look at the slides, and the network diagrams and tables on screen are not reconstructed. The cells of the four Bayesian network tables that the lecturer does not read come from the lecture's published source code, `src2.zip`, and are set apart from the spoken ones by bold type. One place follows the demonstration over the captions: from 38:44 the lecturer calls 0.08 and 0.02 the probabilities of cloudy and not cloudy given rain, then immediately restates them as the joint probabilities of clouds and rain and of no clouds and rain, and the article follows the restatement. Three numbers follow the captions although they differ from the exact values of inference by enumeration: "light rain 31%, heavy rain 23%" at 1:18:06 and "64%" at 1:19:05, where enumeration over the source-code tables gives 30.0%, 23.9% and 63.4%. This is neither a slip by the lecturer nor a caption error: the source documentation of pomegranate v0.14.8 states that `predict_proba` uses loopy belief propagation, and my own reimplementation of that algorithm reproduces the lecturer's four numbers (45.83%, 30.69%, 23.48%, 64.32%); the text now carries a paragraph marked as my addition. Limits: I did not check the library version used at the time of the lecture, and did not install pomegranate to run it. The HMM note that `predict` decodes day by day by default rests on the same v0.14.8 source and on hand calculation. The captions never mention this week's projects (Heredity, PageRank); the project sections come from the course website, not the video.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official CS50 YouTube playlist was checked live and lists this week’s lecture recording, so the status is now Videos included.
- 2026-10-10: Checked the video content against its transcript. Removed topics and project introductions not found in the video; timecodes are now approximate values estimated from the transcript.
- 2026-10-13: Moved the player from the source section to "Lecture Video & Timestamps" and added the running time to the opening.
- 2026-10-13: Rechecked the timeline against timecoded captions; approximate minutes are now actual start times and every row links to that point in the video. Running time corrected from 1:54:30 to 1:54:29.
- 2026-10-13: Rewrote "Core Concepts Cheat Sheet" from the captions as a ten-section "Lecture walkthrough", each section with a time link and one self-check. Content from the old cheat sheet that the lecture does not cover was removed: d-separation, variable elimination and the complexity table of inference strategies, stationary distributions, the PageRank formula (moved to Project 2B), the forward and Viterbi algorithms, and a rejection-sampling code block that was not the lecture's code.
- 2026-10-13: Rewrote Project 2A from the provided `heredity.py`. The earlier text described it as likelihood-weighting sampling and showed a `Person` class and a hand-written sampling loop that do not exist in the provided file; the provided `main` enumerates every combination and then normalizes, and `people` is a dictionary. The reference implementation is now three functions that drop straight into the provided file, and its output matches the spec page. The heading changed from "Bayesian Network Sampling for Genotype Inference" to "Inferring Genes and Traits with a Bayesian Network".
- 2026-10-13: Rewrote Project 2B from the provided `pagerank.py`. Added the `transition_model` the spec requires and made the function signatures match the provided file (no default arguments). The earlier sampling version did not go through the transition model, which is fixed. The earlier iterative version returned the previous round's values on convergence and now returns the set just computed; that is a choice, not a fix, since the old behavior is within the 0.001 the spec allows and the numbers on the spec page match it. Both were run. The heading changed from "Iterative & Sampling Algorithms" to "Sampling and Iterative Algorithms", so its anchor changes too.
- 2026-10-13: Revised after independent review. The "Inference" section gains a paragraph, marked as my addition, explaining that the 31%, 23% and 64% the lecturer reads come from the library's approximate inference, with the exact values from enumeration, and the content-check line was rewritten to match; the HMM note now says which algorithm `predict` uses by default; likelihood weighting gains a two-sample worked example of my own; several wordings were corrected, and the version note now says "course website" instead of "OCW site".
- 2026-10-13: Restructured both project sections: task, what the distribution code provides, approach, pseudocode, where it goes wrong and how to check come first, and the full reference implementation is folded at the end of each project with a warning that links to the course's [academic honesty policy](https://cs50.harvard.edu/ai/honesty/). The reference code itself is unchanged. Also, after re-review, the four approximate-inference numbers now carry one more decimal, and the gap between PageRank sampling and iteration is stated as the median and maximum over 30 runs.
- 2026-10-13: Revised after re-review of the project sections. One number under "Where it goes wrong" for Heredity did not match the mistake it described, and now names the mistake it belongs to; the PageRank iteration pseudocode said "each other page", which would skip a no-link page's share of itself, and now covers every page with the inner step written more coarsely; "which set to return on convergence" is now a note, not a mistake; the overwrite-as-you-go numbers are marked as depending on page order; the 0.03 threshold is marked as this site's judgment. The tldr and description now describe the project sections as they are.

## References

- [Week 2 Uncertainty lecture page](https://cs50.harvard.edu/ai/weeks/2/) — video, slides, transcript, quiz
- [Uncertainty - Lecture 2 (YouTube)](https://www.youtube.com/watch?v=D8RRq3TbtHU) — the basis for "Lecture walkthrough"; content, numbers and time links come from its English captions
- [Lecture source code src2.zip](https://cdn.cs50.net/ai/2020/spring/lectures/2/src2.zip) — the `bayesnet`, `chain` and `hmm` folders; the complete Bayesian network tables and the HMM observation list come from here
- [Week 2 Notes (2020 edition)](https://cs50.harvard.edu/ai/2020/notes/2/) — official notes, useful for the diagrams and tables on the slides
- [Heredity project spec](https://cs50.harvard.edu/ai/projects/2/heredity/) — Distribution `2023/x`, check50 slug `ai50/projects/2024/x/heredity`
- [PageRank project spec](https://cs50.harvard.edu/ai/projects/2/pagerank/) — Distribution `2023/x`, check50 slug `ai50/projects/2024/x/pagerank`
- [CS50 AI YouTube playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [CS50 AI academic honesty policy](https://cs50.harvard.edu/ai/honesty/) — the reason project solutions are folded (read 2026-10-13)
- [check50 documentation](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- On this site: [Harvard CS50 AI Overview](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en) — series entry & version notes
- On this site: [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) — A3 tier definition
