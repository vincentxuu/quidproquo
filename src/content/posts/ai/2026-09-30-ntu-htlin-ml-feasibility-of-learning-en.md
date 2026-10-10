---
title: "Reading Hsuan-Tien Lin's ML Foundations: Is Learning Feasible? Hoeffding and \"Outside the Data\""
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, learning-theory]
lang: en
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 2
tldr: "Foundations Lecture 4 first shows that learning is impossible: from D alone, any guess outside D can be called wrong. That is No Free Lunch. It then reframes the question with marbles in a bin. If the data is drawn independently from one distribution, Hoeffding's inequality says the in-sample error E_in is probably close to the true error E_out. Checking one fixed h is only verification. Once the algorithm chooses among M hypotheses, a union bound charges 2M exp(−2ε²N). Conclusion: with a finite hypothesis set and small E_in, learning is feasible. What to do when M is infinite is the next lecture's job."
description: "A guide to Lecture 4 of NTU Professor Hsuan-Tien Lin's Machine Learning Foundations: the intuition behind No Free Lunch and Wolpert's 1996 paper, marbles and Hoeffding's inequality, E_in, E_out, and PAC, the difference between verifying one hypothesis and actually learning, BAD data and the union bound for finite hypothesis sets, plus the Fall 2026 extended slides and the matching problems in Fall 2026 hw1 Q6–10 and Fall 2024 HW2."
draft: false
glossary:
  - term: "Hoeffding's inequality"
    aliases: ["Hoeffding"]
    definition: "For the mean ν of N i.i.d. samples and the true expectation µ, the probability that they differ by more than ε is at most 2exp(−2ε²N); the bound does not require knowing µ."
    context: "Foundations Lecture 4 uses it to argue that with enough data, E_in(h) is probably close to E_out(h)."
  - term: "PAC"
    aliases: ["probably approximately correct"]
    definition: "Correct with high probability (probably) up to an error of ε (approximately). Foundations uses it to describe probabilistic guarantees such as ν ≈ µ and E_in ≈ E_out."
    context: "The key phrase of Foundations Lecture 4; the later VC bound is a PAC-style guarantee too."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning)

This is post 2 in the [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en) series. It covers Lecture 4 of [Machine Learning Foundations](https://www.csie.ntu.edu.tw/~htlin/mooc/), "feasibility of learning," the last lecture under the first question, "When Can Machines Learn?"

The PLA from [post 1](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron-en) can reach zero errors on the training data. What we actually care about is **data we have not seen**. This lecture jumps from algorithms to probabilistic guarantees, the first steep step in the course, so this series gives it a post of its own.

**Sources**: MOOC slides [04_handout](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/04_handout.pdf), the W3 watch list on the [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/), extended slides [04e](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/04e_handout.pdf), [Fall 2026 hw1](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf), and [Fall 2024 HW2](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf). All checked on 2026-09-30.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=tOgbh5_747w
title: YouTube
```

```youtube
url: https://www.youtube.com/watch?v=MgAihqFPkZc
title: YouTube
```

Original videos: [YouTube](https://www.youtube.com/watch?v=tOgbh5_747w)、[YouTube](https://www.youtube.com/watch?v=MgAihqFPkZc)、[YouTube](https://www.youtube.com/watch?v=iXbbfjJNfwU)、[YouTube](https://www.youtube.com/watch?v=MFL6xDn1lXM)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## Materials for this post

| Section | Video | Slide summary (last page of the 04 handout) |
|---|---|---|
| Learning is Impossible? | [YouTube](https://youtu.be/tOgbh5_747w) | absolutely no free lunch outside D |
| Probability to the Rescue | [YouTube](https://youtu.be/MgAihqFPkZc) | probably approximately correct outside D |
| Connection to Learning | [YouTube](https://youtu.be/iXbbfjJNfwU) | verification possible if E_in(h) small for fixed h |
| Connection to Real Learning | [YouTube](https://youtu.be/MFL6xDn1lXM) | learning possible if \|H\| finite and E_in(g) small |

Videos are in Mandarin; slides are in English. LFD section: 1.3 (per the Fall 2026 course page). Both the Fall 2026 and Fall 2024 course pages list one extended reading next to this lecture: Wolpert's [The Lack of A Priori Distinctions Between Learning Algorithms](https://direct.mit.edu/neco/article-abstract/8/7/1341/6016/The-Lack-of-A-Priori-Distinctions-Between-Learning).

The four sentences in that summary table are the whole argument of the lecture. The sections below unpack them one at a time.

## Is learning impossible?

### Two answers, both right

The slides open with a "human learning" puzzle: six 3×3 black-and-white patterns, split into a −1 group and a +1 group, and you must label a new pattern. You could say +1 because all the +1 patterns are symmetric. You could say −1 because every −1 pattern has a black top-left cell. Both reasons hold, so whatever you answer, an adversarial teacher can say you "didn't learn."

### Making it math: No Free Lunch

Next comes a version you can enumerate: X = {0,1}³, only 8 possible inputs. D labels 5 of them, leaving 3 unknown, so 2³ = 8 target functions f agree with D.

The algorithm picks some g in H that gets all of D right. The trouble is that whether g is right on the 3 points outside D depends entirely on which of the 8 functions is the real f. If any f can happen, **g is right inside D but has no guarantee outside D**, and outside D is what we actually want.

The Fun Time here is a popular brain teaser: (5, 3, 2) → 151022, so what is (7, 2, 5)? That is a learning problem with N = 1, and the reference answer is "there is no correct answer." The designer's rule is just one of infinitely many possible rules.

**Fall 2026 addition (04e)**: the extended slides repeat the point with the sequence 1, 4, 1, 5: the same four terms can continue three different ways under three different recurrences, so "any number can be the next!" They then state Wolpert's 1996 No Free Lunch theorem roughly: without any assumptions about the learning problem, all learning algorithms perform the same. In other words, no algorithm is best for every problem.

## Probability to the rescue: marbles and Hoeffding

Since f is unknowable outside D, the slides switch scenes. A bin holds many orange and green marbles, with an unknown orange fraction µ. We cannot count every marble, but we can draw N and look at the orange fraction ν in the sample.

Does ν tell us anything about µ? The slides answer in two halves:

- **possibly not**: the sample could be mostly green while the bin is mostly orange.
- **probably yes**: ν is likely close to µ.

"Likely close" is **Hoeffding's inequality**. For N marbles drawn independently,

**P[ |ν − µ| > ε ] ≤ 2 exp(−2ε²N)**

The slides stress three things. It holds for every N and ε. It does not depend on µ, so you don't need to know µ. A larger N or a looser ε makes ν ≈ µ more likely. The statement "ν = µ" is therefore **probably approximately correct (PAC)**.

This section's Fun Time is worth doing by hand. With µ = 0.4 and 10 marbles, what bound do you get on the probability that ν ≤ 0.1? Plug in N = 10 and ε = 0.3 to get 2exp(−1.8) ≈ 0.33. The slides add that the actual probability is far smaller; Hoeffding only gives an upper bound.

## Back to learning: verifying one hypothesis

Map the marbles onto learning:

| Bin | Learning |
|---|---|
| a marble | an input x ∈ X |
| orange | a fixed h is wrong on this x: h(x) ≠ f(x) |
| green | h is right on this x |
| drawing N marbles independently | drawing x₁,…,x_N independently from some distribution P, giving D |

This adds one component to the learning flow chart: an **unknown distribution P** that generates inputs. For any **fixed** h, define

- E_out(h) = the probability under P that h(x) ≠ f(x) (the analog of µ)
- E_in(h) = the fraction of D that h gets wrong (the analog of ν)

Hoeffding gives P[ |E_in(h) − E_out(h)| > ε ] ≤ 2exp(−2ε²N) directly, and f and P can both stay unknown. If E_in(h) is also small, you can say h ≈ f in the PAC sense.

The slides immediately name the limit: this is only **verification**. If the algorithm is forced to output this one h, E_in(h) will almost never happen to be small. Real learning means A chooses within H, the way PLA does.

The Fun Time for this section is an investing question. A friend says a stock "goes up in the afternoon whenever it goes down in the morning, and vice versa." You pick 100 random days from the past 10 years and 80 of them fit. What is the best guarantee? The reference answer: if the market behaves like the last 10 years, you will "likely" profit from the rule over the next 100 days. Picking "the best rule from 20 more friends" is not covered, because that is choosing, not verifying.

## Back to real learning: choosing has a price

### The coin game

The slides' example: in an NTU ML class of 150, everyone flips a coin 5 times, and one student gets 5 heads. Is her coin magical? No. Even if every coin is fair, the probability that at least one of the 150 gets 5 heads is 1 − (31/32)¹⁵⁰, over 99%.

That is the problem with choosing. For a single coin, 5 heads is rare. Pick the best of 150 coins and something rare is almost guaranteed to show up.

### BAD data and the union bound

The slides call a dataset where E_in and E_out are far apart **BAD data**. For a single h, Hoeffding says BAD data is unlikely.

For the algorithm to choose freely among M hypotheses, D must not be BAD for any of them. If even one h hits BAD data, A might pick exactly that one. Adding up with a union bound:

**P_D[BAD D] ≤ P_D[BAD D for h₁] + … + P_D[BAD D for h_M] ≤ 2M exp(−2ε²N)**

The slides call this the "finite-bin version of Hoeffding." It holds for every M, N, and ε, and needs no knowledge of any E_out(h_m). So whatever A picks, "E_in(g) = E_out(g)" is PAC. The most reasonable A (like PLA or pocket) picks the hypothesis with the lowest E_in.

### Conclusion and the next question

In one sentence: **if |H| = M is finite, N is large enough, and A finds a g with E_in(g) ≈ 0, then there is a PAC guarantee that E_out(g) ≈ 0, and learning is feasible.**

But the perceptron's H contains infinitely many lines, and 2M exp(−2ε²N) breaks when M = ∞. The last Fun Time already plants the fix. Among four hypotheses, sign(x₁), sign(x₂), sign(−x₁), and sign(−x₂), h₁ and h₃ have exactly the same BAD data, so the union bound tightens from 8exp(−2ε²N) to 4exp(−2ε²N). Many hypotheses are really "alike," and that observation is where the next lecture starts on infinite H.

**Fall 2026 addition (04e)**: the last extended slide draws M hypotheses as M bins that share the same x₁,…,x_N. It stresses that this is dependent sampling: the BAD events for different hypotheses are correlated, unlike the independent coin game, so they are hard to analyze directly, and the union bound is the conservative choice.

## Practice: Fall 2026 hw1 Q6–10 and Fall 2024 HW2

Both sets are public. There are no official solutions, and grading is for enrolled students only.

**The "Feasibility of Learning" block of [Fall 2026 hw1](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf)** (due 10/21):

- Q6: off-training-set error. From a 6-point universe, choose any 3 points as D, reach E_in = 0 with a perceptron, and find the smallest and largest error outside D. A direct No Free Lunch exercise.
- Q7: estimate π with Monte Carlo darts. How many darts keep the error within 10⁻² with probability above 0.999, using the Hoeffding version from class?
- Q8–9: compute E_out for two hypotheses on [−1, +1]², then the probability that 4 sampled points give both the same E_in. The problem notes this is BAD data, where you cannot tell the worse hypothesis from the better one.
- Q10: multiple-bin sampling with dice instead of marbles. Each number is a hypothesis and each die is an example; what is the probability that drawing 5 dice yields some number that is purely green?

**[Fall 2024 HW2](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf)** has several problems on the same idea (the set covers L4–L7):

- Q2: 16 bags of half-white, half-black cards; draw 5 from each and find the probability that some hand is all white. An independent version of the coin game.
- Q5: critique ChatGPT's answer to whether you can predict the next term of an integer sequence known to come from a degree-N polynomial, given its first N − 1 terms. A No Free Lunch argument.
- Q6–7: a multi-bin game with four kinds of lottery tickets. The hint says to treat each number as a hypothesis and the drawn tickets as data, and that Q6 must account for sampling dependence.
- Q8: M slot machines. Starting from a one-sided Hoeffding inequality, prove that upper confidence bounds hold for all machines and all time steps simultaneously with probability at least 1 − δ. The hint says this is the core technique behind the upper-confidence-bound algorithm for multi-armed bandits.

Without solutions, the quickest check for probability problems is simulation. For the Hoeffding Fun Time, for instance:

```python
import numpy as np
rng = np.random.default_rng(0)
mu, N, trials = 0.4, 10, 1_000_000
nu = rng.binomial(N, mu, size=trials) / N
print("simulated P[nu <= 0.1]:", (nu <= 0.1).mean())
print("Hoeffding bound:", 2 * np.exp(-2 * 0.3**2 * N))
```

The simulated value comes out far below 0.33, matching the slides' point that Hoeffding only gives an upper bound. Problems like hw1 Q9 and Q10 work the same way: simulate a number first, then check your derivation against it.

## What to do tonight

1. Watch the [Connection to Real Learning](https://youtu.be/MFL6xDn1lXM) video, then write out the two lines from "Hoeffding for one h" to "union bound for M hypotheses" without the slides.
2. Run the simulation above with N = 100 and N = 1000 and watch how the gap between the simulated probability and the Hoeffding bound changes.
3. Simulate the coin game: 150 people flip 5 times each, repeated 10,000 times. Count how often at least one person gets 5 heads and compare with 1 − (31/32)¹⁵⁰.

## Further reading

- [Wolpert, The Lack of A Priori Distinctions Between Learning Algorithms](https://direct.mit.edu/neco/article-abstract/8/7/1341/6016/The-Lack-of-A-Priori-Distinctions-Between-Learning) (Neural Computation, 1996): the original No Free Lunch paper listed on the course page.
- [Caltech Learning from Data](https://work.caltech.edu/telecourse): the English course on the same textbook; its Lecture 2, "Is Learning Feasible?", matches this lecture.
- [Stanford CS229 guide](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): another take on learning theory.

**Series navigation**: Previous: [The Learning Problem, PLA, and Types of Learning](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron-en) | [Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en) | Next: [Training vs. Testing: Effective Hypotheses, Growth Function, and Break Point](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/) — section titles and slides for Lecture 4
- [Lecture 4: Feasibility of Learning (04_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/04_handout.pdf)
- [Lecture 4 extended slides (04e_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/04e_handout.pdf)
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf) (in Mandarin)
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) — W3 watch list, LFD sections, extended reading
- [Fall 2026 Homework 1 (hw1.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf)
- [Fall 2024 Homework 2 (hw2_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf)
- [Wolpert (1996), The Lack of A Priori Distinctions Between Learning Algorithms](https://direct.mit.edu/neco/article-abstract/8/7/1341/6016/The-Lack-of-A-Priori-Distinctions-Between-Learning)
- [Learning from Data textbook site](http://amlbook.com)
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)
