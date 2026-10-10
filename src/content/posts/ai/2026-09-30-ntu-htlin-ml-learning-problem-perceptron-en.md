---
title: "Reading Hsuan-Tien Lin's ML Foundations: The Learning Problem, PLA, and Types of Learning"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, perceptron]
lang: en
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 1
tldr: "The first three lectures of Machine Learning Foundations define machine learning as a flow chart: an unknown target function f generates data D, and an algorithm A picks g from a hypothesis set H, hoping g ≈ f. The simplest H (the perceptron) and A (PLA) then show the chart in action. On linearly separable data, PLA makes at most R²/ρ² updates; on non-separable data, use pocket instead. Lecture 3 sorts learning problems along four axes: output, label, protocol, and input. Foundations mostly deals with batch, supervised binary classification or regression on concrete features. Practice with Fall 2024 HW1 and Fall 2026 hw1."
description: "A guide to Lectures 1–3 of NTU Professor Hsuan-Tien Lin's Machine Learning Foundations: the definition of ML and three conditions for using it, the five components f/D/A/H/g, the perceptron hypothesis set and PLA, the proof outline for T ≤ R²/ρ², the pocket algorithm, types of learning by output space, label, protocol, and input space, plus the Fall 2026 extended slides and the matching problems in Fall 2024 HW1 and Fall 2026 hw1."
draft: false
glossary:
  - term: "linear separable"
    aliases: ["linearly separable"]
    definition: "There is a weight vector w_f with y_n = sign(w_fᵀx_n) for every training example, so a line (a hyperplane in higher dimensions) splits positives from negatives perfectly."
    context: "The condition under which PLA is guaranteed to halt; the convergence proof in Foundations Lecture 2 only holds here."
  - term: "pocket algorithm"
    aliases: ["pocket"]
    definition: "A PLA variant that corrects mistakes as usual but also keeps the weights with the fewest mistakes seen so far in a 'pocket', returning those after a fixed number of iterations."
    context: "Foundations Lecture 2 uses it for non-separable or noisy data."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron)

This is post 1 in the [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en) series. It covers Lectures 1–3 of [Machine Learning Foundations](https://www.csie.ntu.edu.tw/~htlin/mooc/), the first three lectures under the first big question, "When Can Machines Learn?"

These three lectures answer two things: what components make up a machine learning problem, and what the simplest learning algorithm looks like. By the end you should be able to write PLA yourself and say which type of learning a problem belongs to. Whether PLA's line is also right on data it has never seen is left for [post 2](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning-en).

**Sources**: MOOC handouts [01](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/01_handout.pdf), [02](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/02_handout.pdf), and [03](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/03_handout.pdf); the W2–W3 watch lists on the [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) and extended slides [01e](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/01e_handout.pdf), [02e](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/02e_handout.pdf), and [03e](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/03e_handout.pdf); [Fall 2024 HW1](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw1/hw1_red.pdf) and [Fall 2026 hw1](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf). All checked on 2026-09-30.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=nQvpFSMPhr0
title: Course Introduction
```

```youtube
url: https://www.youtube.com/watch?v=sS4523miLnw
title: What is Machine Learning
```

Original videos: [Course Introduction](https://www.youtube.com/watch?v=nQvpFSMPhr0)、[What is Machine Learning](https://www.youtube.com/watch?v=sS4523miLnw)、[Applications of Machine Learning](https://www.youtube.com/watch?v=PveL3-fO_Qk)、[Components of Machine Learning](https://www.youtube.com/watch?v=pR1xsocj_Pw)、[Machine Learning and Other Fields](https://www.youtube.com/watch?v=vc2BimJ3XJA)、[Perceptron Hypothesis Set](https://www.youtube.com/watch?v=WlpF1Phkv28)、[Perceptron Learning Algorithm](https://www.youtube.com/watch?v=1xnUlrgJJGo)、[Guarantee of PLA](https://www.youtube.com/watch?v=Okrrz0IYoSE)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## Materials for this post

| Lecture | Videos (YouTube, in Mandarin, by MOOC section) | LFD sections (per the Fall 2026 course page) |
|---|---|---|
| L1 the learning problem | [Course Introduction](https://www.youtube.com/watch?v=nQvpFSMPhr0), [What is Machine Learning](https://youtu.be/sS4523miLnw), [Applications of Machine Learning](https://youtu.be/PveL3-fO_Qk), [Components of Machine Learning](https://youtu.be/pR1xsocj_Pw), [Machine Learning and Other Fields](https://youtu.be/vc2BimJ3XJA) | 1.0, 1.1.1, 1.2.4 |
| L2 learning to answer yes/no | [Perceptron Hypothesis Set](https://youtu.be/WlpF1Phkv28), [Perceptron Learning Algorithm](https://youtu.be/1xnUlrgJJGo), [Guarantee of PLA](https://youtu.be/Okrrz0IYoSE), [Non-Separable Data](https://youtu.be/vT-mUeRJfys) | 1.1.2, 3.1 |
| L3 types of learning | [Different Output Space](https://youtu.be/XyJQm4mvVUA), [Different Data Label](https://youtu.be/8w1lDGaoFTI), [Different Protocol](https://youtu.be/emLW7jLh-n0), [Different Input Space](https://youtu.be/cIsgI7tktQM) | 1.2, 1.3 |

That is 13 videos. Fall 2026 assigns L1, L2, and the first L3 video before W2, and the last three L3 videos before W3.

## Lecture 1: What machine learning is

### From learning to machine learning

L1's definition is plain. Learning means acquiring a skill from experience accumulated through observation. Machine learning computes that experience from **data**, and "skill" means improving some performance measure, such as prediction accuracy. The slide puts it this way:

> machine learning: improving some performance measure with experience computed from data

It then lists when ML makes sense: when humans cannot program the system by hand (navigating on Mars), when the solution is hard to define (speech and image recognition), when decisions must be faster than humans can make them (high-frequency trading), and when a system must serve many users individually (targeted marketing).

### When to use ML: three conditions

The slide titled "Key Essence of Machine Learning" is meant to help you decide whether a problem calls for ML:

1. Some underlying pattern exists, so the performance measure can improve.
2. The pattern has no easy programmable definition, so ML is needed.
3. There is data about the pattern, so ML has something to learn from.

The Fun Time right after it makes a good self-check. Is the baby's next cry on an even minute? (No pattern.) Does a graph contain a cycle? (Programmable.) Should a customer get a credit card? (All three conditions hold.) Will Earth be destroyed by nuclear misuse in the next ten years? (Not enough data.) The answer is the credit card.

### Five components: f, D, A, H, g

The most important figure in L1 is the learning flow for credit card approval:

| Symbol | Meaning | Credit card example |
|---|---|---|
| x ∈ X | input | applicant information |
| y ∈ Y | output | good or bad customer after approval |
| f: X → Y | unknown target function | the "ideal credit approval formula" |
| D = {(x₁,y₁),…,(x_N,y_N)} | training data | the bank's historical records |
| H | hypothesis set, the candidate formulas | "approve if annual salary > NTD 800,000", "approve if debt > NTD 100,000", … |
| A | learning algorithm | picks one from H |
| g | final hypothesis | the formula actually used, hopefully g ≈ f |

Two points. First, f is unknown, so g can only hope to be close to f; being identical is not something anyone can guarantee. Second, the slides call **A and H together the learning model** ("learning model = A and H"). Nearly all of the next 16 lectures either swap H, swap A, or ask whether learning still works after the swap.

L1's practical definition fits in one line: use data to compute a hypothesis g that approximates the target f.

### ML and other fields

The last section compares ML with data mining, AI, and statistics. Data mining "uses (huge) data to find interesting properties," and in practice it is hard to tell apart from ML. ML is one route to AI. Statistics "uses data to make inference" and gives ML many tools, though traditional statistics cares more about provable mathematical results.

**Fall 2026 addition (01e)**: the extended slides swap in newer applications: dialogue-based medical diagnosis, 4G LTE configuration, PCB defect detection, face recognition, and tropical cyclone intensity estimation (the TCIR dataset). ML is compared to the cooking tools that turn (big) data, the ingredient, into AI, the dish. The deck closes with AlphaGo to show that good AI needs both ML (deep learning) and non-ML techniques (Monte Carlo tree search).

## Lecture 2: The perceptron and PLA

### Hypothesis set: the perceptron

L2 goes back to credit cards and picks the simplest possible H. Each applicant's features x = (x₁,…,x_d) produce a weighted score, and the card is approved if the score clears a threshold:

- h(x) = sign(Σᵢ wᵢxᵢ − threshold)
- Treat the threshold as dimension 0: set x₀ = +1 and w₀ = −threshold, and it becomes h(x) = sign(wᵀx)

This h is historically called the **perceptron**. In two dimensions each w is a line, +1 on one side and −1 on the other. Hence the slide's conclusion: perceptrons are linear binary classifiers.

### The algorithm: PLA

H contains infinitely many lines. How do you choose one? The slides' idea: start from any line and **fix it whenever it is wrong**.

```text
Start from w₀ (e.g. 0). For t = 0, 1, …
  1. Find an example (x_n(t), y_n(t)) that w_t gets wrong: sign(w_tᵀ x_n(t)) ≠ y_n(t)
  2. Correct it: w_{t+1} ← w_t + y_n(t) · x_n(t)
Stop when there are no mistakes; return the last w (called w_PLA) as g
```

Why does this count as a correction? Multiply the update by y_n x_n and you get y_n w_{t+1}ᵀx_n ≥ y_n w_tᵀx_n: the score moves toward the right side. In practice people often use cyclic PLA, sweeping the data in a fixed or pre-shuffled order and stopping after a full pass with no mistakes. The slides then show a "Seeing is Believing" sequence where PLA corrects itself 9 times on 2D data before halting.

### The guarantee: on separable data, PLA halts

When PLA halts it has no mistakes on D. So halting requires some w that classifies everything correctly; such data is called **linearly separable**. Conversely, if the data is linearly separable, does PLA always halt?

The slides prove it with two facts. Let w_f be a perfect line:

1. **w_t becomes more aligned with w_f**: every update increases w_fᵀw_t by at least min_n y_n w_fᵀx_n > 0.
2. **w_t does not grow too fast**: updates only happen on mistakes, and a mistake means y_n w_tᵀx_n ≤ 0, so ‖w_t‖² grows by at most R² = max_n ‖x_n‖² per update.

<details>
<summary>Chaining the two facts (compare the 02 handout and the "Magic Chain" in 02e)</summary>

Starting from w₀ = 0, after T updates:

- w_fᵀw_T ≥ T · min_n y_n w_fᵀx_n
- ‖w_T‖² ≤ T · R²

Let ρ = min_n y_n (w_f/‖w_f‖)ᵀx_n. The cosine of the angle between two vectors is at most 1:

1 ≥ (w_fᵀw_T) / (‖w_f‖‖w_T‖) ≥ Tρ / (√T · R) = √T · ρ / R

Rearranging gives **T ≤ R²/ρ²**, which is the reference answer to the L2 Fun Time. Read ρ as how close the data comes to the perfect boundary: the more cleanly separated the data, the sooner PLA halts.

</details>

The slides list two limits of this guarantee. It **assumes** linear separability in order to halt. And ρ depends on the unknown w_f, so in practice you don't know how long PLA will run.

### Non-separable data: pocket

With noisy data, a perfect line may not exist. Asking for the line with the fewest mistakes sounds reasonable, but the slides point out that this problem is NP-hard.

The compromise is the **pocket algorithm**. Run PLA as usual, but keep the weights with the fewest mistakes so far, ŵ, in your pocket. After each update, if the new w_{t+1} makes fewer mistakes than ŵ, swap it in. After enough iterations, return ŵ. The cost is counting mistakes on all of D every round, so on separable data pocket is slower than PLA; both return the same weights, with no mistakes.

**Fall 2026 addition (02e)**: the extended slides add four things. First, what to do with sign(0): starting from w₀ = 0 the first step always hits sign(0), and the slides list four conventions (−1, +1, 0, random), noting the choice matters little as long as w₁ usually becomes nonzero. Second, the role of x₀: every update changes w_{t,0} by y_n(t). Third, the full "Magic Chain" derivation above. Fourth, the pocket pattern of "generate candidates, keep the better one" is compared to how modern generative AI is aligned, citing a paper by Lu, Lin, and Wang at the ICML 2026 Workshop on Generative and Agentic AI for Biology.

## Lecture 3: Types of learning

L3 classifies learning problems along four axes. Each axis has a "core" option, which is what Foundations mainly handles (bold below):

| Axis | Options | Examples from the slides |
|---|---|---|
| Output space Y | **binary classification**, multiclass classification, **regression**, structured learning | US coin recognition (1c/5c/10c/25c) is multiclass; days until a patient recovers is regression; part-of-speech sequence tagging is structured |
| Data label y_n | **supervised**, unsupervised, semi-supervised, reinforcement | clustering, density estimation, and outlier detection are unsupervised; only a few labeled faces is semi-supervised; teaching a dog to "sit" with rewards and punishment is reinforcement |
| Protocol | **batch**, online, active | training a spam filter on a batch of emails is batch; improving as each email arrives is online; letting the algorithm pick which x_n to ask labels for is active |
| Input space X | **concrete features**, raw features, abstract features | coin size and mass are concrete; 16×16 grayscale digit images are raw; rating prediction from (userid, itemid) alone is abstract |

The slides boil the core tools down to three lines: binary classification and regression on the output axis, supervised on the label axis, batch on the protocol axis. The next 13 lectures of Foundations focus on "batch, supervised binary classification or regression on concrete features." Raw and abstract features need feature transforms, by humans or machines; that thread returns in Foundations L12 and the second half of Techniques.

**Fall 2026 addition (03e)**: the extended slides add recent examples on every axis. The output axis gains multilabel classification (which fruits are in this picture), binary relevance, which splits it into several yes/no questions, and image generation (style transfer, denoising, super-resolution). The label axis gains self-supervised learning (jigsaw puzzles) and weakly supervised learning with complementary labels, which say which class an example is *not*. The reinforcement learning examples become AlphaGo and GPT-3. The protocol axis adds the practical pattern of online learning plus daily batch retraining, and NTU CLLab's active learning tool [libact](https://github.com/ntucllab/libact).

## Practice: Fall 2024 HW1 and Fall 2026 hw1

Both sets are public on the `hw1/` subpage of each course page. There are no official solutions, and grading (Gradescope) is for enrolled students only.

**[Fall 2024 HW1](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw1/hw1_red.pdf)** (released 09/09, due 10/07, 200 points plus 20 bonus):

- Q1: which task is best suited for ML, a direct drill of L1's three conditions.
- Q3–4, Q7–8: how rescaling the data or changing x₀ affects PLA's bound and behavior (the problems cite the convergence-bound page of Lecture 2).
- Q5–6: ask a ChatGPT-like agent "what is a possible application of active learning?" and "can machine learning be used to predict earthquakes?", then argue in 10–20 English sentences, as the agent's "boss," whether you agree.
- Q9: a derivation about using a perceptron to detect hateful articles.
- Q10–12: run randomized PLA 1000 times on the first 200 lines of LIBSVM's [rcv1_train.binary](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/rcv1_train.binary.bz2), plot a histogram of update counts and how ‖w_t‖ evolves, then compare a variant that keeps correcting the same example until it is right. Q13 is the bonus.

**[Fall 2026 hw1](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf)** (released 09/23, red-corrected 09/25, due 10/21, 16 problems, 240 points):

- Q1: which task is best suited for ML.
- Q2–4: the minimum number of extra updates that guarantees a mistake is fixed, how normalizing inputs changes the bound, and how multiclass PLA with K = 2 relates to binary PLA.
- Q5: what kind of learning problem predicting Taiwan's rain map is, drilling L3's four axes.
- Q6–10 are L4 feasibility problems, covered in [post 2](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning-en).
- Q11–16 (programming): run randomized PLA 1000 times on [hw1_train.dat](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1_train.dat) (N = 256, x ∈ ℝ¹²), measure the share of runs with E_in = 0 and the medians of update counts and ‖w_PLA‖, then see how update counts change when x is halved or x₀ is set to 0.5 or 0.

Without official solutions, you can check programming problems yourself. Run scikit-learn's `Perceptron` on the same data and see whether its E_in also reaches 0. Or generate a small dataset you know is linearly separable and check that your update count never exceeds R²/ρ².

## What to do tonight

1. Watch the [Perceptron Learning Algorithm](https://youtu.be/1xnUlrgJJGo) video, then write PLA in under 20 lines of Python without looking at the slides.
2. Generate 50 linearly separable points in 2D, run your PLA, plot the line after each update, and compare with the slides' "Seeing is Believing" pages.
3. Take three problems from your own work, label each along L3's four axes, and use L1's three conditions to decide whether ML fits.

## Further reading

- [Stanford CS229 guide](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): another take on perceptrons and linear classification.
- [Caltech Learning from Data](https://work.caltech.edu/telecourse): Abu-Mostafa's English course on the same textbook; its Lecture 1, "The Learning Problem," matches the start of this post.

**Series navigation**: [Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en) | Next: [Is Learning Feasible? Hoeffding and "Outside the Data"](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/) — section titles and slides for Lectures 1–3
- [Lecture 1: The Learning Problem (01_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/01_handout.pdf)
- [Lecture 2: Learning to Answer Yes/No (02_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/02_handout.pdf)
- [Lecture 3: Types of Learning (03_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/03_handout.pdf)
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf) (in Mandarin)
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) — W2–W3 watch lists and LFD sections
- [Lecture 1 extended slides (01e)](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/01e_handout.pdf), [Lecture 2 (02e)](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/02e_handout.pdf), [Lecture 3 (03e)](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/03e_handout.pdf)
- [Fall 2026 Homework 1 (hw1.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf), [hw1_train.dat](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1_train.dat)
- [Fall 2024 Homework 1 (hw1_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw1/hw1_red.pdf)
- [LIBSVM Data: rcv1.binary](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/rcv1_train.binary.bz2)
- [libact: Pool-based Active Learning in Python](https://github.com/ntucllab/libact)
- [Learning from Data textbook site](http://amlbook.com)
