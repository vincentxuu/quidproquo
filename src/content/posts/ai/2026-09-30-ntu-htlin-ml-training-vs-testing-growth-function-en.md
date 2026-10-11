---
title: "Hsuan-Tien Lin's ML Foundations L5–L6: Infinitely Many Hypotheses, So Why Does Learning Still Generalize? Growth Functions and Break Points"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, machine-learning, learning-theory, ai-course, course-guide]
lang: en
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 3
tldr: "The Hoeffding guarantee from L4 carries an M, the number of hypotheses. Perceptrons have infinitely many lines, so M blows up. L5 stops counting hypotheses and counts how many ○× patterns (dichotomies) they can produce on N data points instead; the maximum is the growth function m_H(N). 2D perceptrons produce at most 14 patterns on 4 points, fewer than 2⁴ = 16, so 4 is their break point. L6, marked optional by the course, proves that any break point caps m_H(N) by a polynomial, which is what makes the VC bound work."
description: "A guide to Lectures 5–6 of Hsuan-Tien Lin's Machine Learning Foundations (NTU): why the union bound overcounts, then dichotomies, growth functions, shattering and break points, worked through positive rays, positive intervals, convex sets and 2D perceptrons. The L6 bounding function B(N,k) and the three-step VC bound proof sit in collapsible sections. Includes the Caltech English Lecture 6 and the matching Fall 2024 HW2 problems."
draft: false
glossary:
  - term: "dichotomy"
    aliases: ["dichotomies"]
    definition: "A hypothesis h viewed only through its outputs on N inputs x₁…x_N, giving a length-N ○× vector. Infinitely many hypotheses produce at most 2^N dichotomies on a fixed set of N points."
    context: "Lecture 5 of Hsuan-Tien Lin's Machine Learning Foundations uses it to replace the hypothesis count M."
    links:
      - label: "L5 slides"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/05_handout.pdf"
  - term: "growth function"
    aliases: ["m_H(N)"]
    definition: "The maximum, over all possible sets of N inputs, of the number of dichotomies a hypothesis set H can produce. It is at most 2^N."
    context: "The VC bound uses it in place of M from Hoeffding plus the union bound."
    links:
      - label: "L5 slides"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/05_handout.pdf"
  - term: "break point"
    aliases: ["minimum break point"]
    definition: "If no set of k inputs can be shattered by H (that is, H cannot produce all 2^k patterns), k is a break point of H, and so are k+1, k+2, and so on. The course usually talks about the smallest one."
    context: "The break point of 2D perceptrons is 4."
    links:
      - label: "L5 slides"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/05_handout.pdf"
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function)

**Video status: Videos included.** [Source details](#course-video-sources)

This is part 3 of the [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en) series. It follows [Is Learning Feasible? Hoeffding and Learning Beyond the Data](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning-en). It covers Lecture 5, Training versus Testing, and Lecture 6, Theory of Generalization, from [Machine Learning Foundations](https://www.csie.ntu.edu.tw/~htlin/mooc/). Together they open the course's second big question: "Why Can Machines Learn?"

The lectures are taught in Mandarin. The slides are in English.

Official materials used:

- MOOC slides [05_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/05_handout.pdf) (L5) and [06_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/06_handout.pdf) (L6), plus the Fall 2026 [05e_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/05e_handout.pdf) (3 pages of extended slides for L5).
- Videos 18–25 of the [Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf), listed below.
- Textbook [Learning from Data](http://amlbook.com) (LFD): 2.0 and 2.1.1 for L5, 2.1.2 for L6, per the [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/).
- Practice: [Fall 2024 HW2](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf).

**Access level**: videos and slides alone are A2. Add the Fall 2024 homework PDFs and this stretch reaches A3, but there are no official solutions and Gradescope grading is for enrolled students only. The grading scale is defined in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en).

## Course video sources

These videos were checked on 2026-10-10 against Hsuan-Tien Lin's official MOOC page and its two official free YouTube playlists (lectures and titles match); no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=oAW0_j8_l3Y
title: Effective Number of Lines
```

```youtube
url: https://www.youtube.com/watch?v=4aIAxH8eBMs
title: Recap and Preview
```

Original videos: [Recap and Preview](https://www.youtube.com/watch?v=4aIAxH8eBMs)、[Effective Number of Lines](https://www.youtube.com/watch?v=oAW0_j8_l3Y)、[Effective Number of Hypotheses](https://www.youtube.com/watch?v=dnVofdAomWY)、[Break Point](https://www.youtube.com/watch?v=z3TpJRqPzcg)、[Restriction of Break Point](https://www.youtube.com/watch?v=rUFqB5Z3YHQ)、[Bounding Function: Basic Cases](https://www.youtube.com/watch?v=OmRekto9rkc)、[Bounding Function: Inductive Cases](https://www.youtube.com/watch?v=6jtWUmaBqFU)

Optional English companion (a different course, Caltech Learning from Data; not embedded): [Caltech Lecture 6 (Yaser Abu-Mostafa)](https://www.youtube.com/watch?v=6FWRijsmLtE)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-10.

## L6 is optional, so here is how this post handles it

Both semesters mark L6 as not required. The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) lists the four L6 videos under W4 (09/30) as "suggested watching (anytime)", while the L5 videos are "required watching (before class)". The Fall 2024 page files L6 under "optional" and offers two versions side by side: Yaser Abu-Mostafa's [English Lecture 6](https://www.youtube.com/watch?v=6FWRijsmLtE) at Caltech, and Lin's four-part Mandarin version.

So the main text covers the L5 concepts plus the **result** of L6: a break point squeezes the growth function down to a polynomial. Every proof step lives in a collapsible block. Readers who skip them will not miss anything later posts rely on.

## The problem: M is infinite

L4 concluded that with a finite hypothesis set (|H| = M) and enough data N,

P[|E<sub>in</sub>(g) − E<sub>out</sub>(g)| > ε] ≤ 2 · M · exp(−2ε²N)

L5 opens by splitting learning into two questions (slide 3):

1. Is E<sub>out</sub>(g) close enough to E<sub>in</sub>(g)?
2. Can we make E<sub>in</sub>(g) small enough?

M pulls these in opposite directions. A small M guarantees the first but leaves too few choices for the second. A large M does the reverse. And the perceptron from L2 has infinitely many lines, so M = ∞ and the inequality says nothing.

Slides 7–8 trace where M comes from. To let the algorithm pick any hypothesis, we bound the chance that *any* hypothesis hits a BAD event. That uses the union bound, which assumes the BAD events never overlap and simply adds their probabilities. But two nearby lines h₁ ≈ h₂ have the same E<sub>in</sub> on most data sets, so their BAD events overlap heavily. The union bound counts that overlap again and again, infinitely many times.

**The L5 idea**: similar hypotheses fail together, so group them by kind and count kinds.

## From counting lines to counting dichotomies

### How many lines, as seen from one point?

The plane holds infinitely many lines. Seen from a single input x₁, though, there are only two kinds: lines that label x₁ as ○ and lines that label it ×. Two points give 4 kinds. Three points in general position give 8, and three collinear points give only 6. Four points? Slide 13: **however you place them, at most 14**, which is less than 2⁴ = 16.

The two missing patterns are the XOR shape: one diagonal gets the same label, the other diagonal gets the opposite one. No single line can do that.

This "maximum number of kinds" is the effective number of lines. If it can stand in for M, and it is much smaller than 2<sup>N</sup>, then infinitely many lines are still learnable.

### Dichotomies and the growth function

Slides 16–17 generalize the idea:

- **Dichotomy**: look at hypothesis h only through its outputs on x₁…x<sub>N</sub>, giving a ○× vector (h(x₁), …, h(x<sub>N</sub>)). All the dichotomies H can produce on those N points are written H(x₁, …, x<sub>N</sub>), and there are at most 2<sup>N</sup> of them.
- **Growth function** m<sub>H</sub>(N): the dichotomy count depends on where the inputs sit, so take the maximum over all possible sets of N inputs to remove that dependence.

### Four examples

Slides 18–23 work out four hypothesis sets. They come back all the way through L7.

| Hypothesis set | Shape | m<sub>H</sub>(N) | break point |
|---|---|---|---|
| positive rays | 1D, h(x) = sign(x − a) | N + 1 | 2 |
| positive intervals | 1D, +1 inside an interval | ½N² + ½N + 1 | 3 |
| convex sets | 2D, +1 inside a convex region | 2<sup>N</sup> | none |
| 2D perceptrons | lines in the plane | < 2<sup>N</sup> for some N | 4 |

The convex-sets argument is worth remembering. Put N points on a big circle. Any ○× pattern can then be realized by a convex region traced slightly outside the ○ points. When some set of N points admits all 2<sup>N</sup> patterns like this, H **shatters** those points.

The [05e extended slides](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/05e_handout.pdf) add two more examples. For 1D positive-and-negative rays (the decision stump), m<sub>H</sub>(N) = 2N: positive rays give N + 1 patterns, negative rays give another N + 1 by symmetry, and the all-○ and all-× patterns are counted twice, so subtract 2. Origin-passing 2D perceptrons also give 2N. The trick is to normalize the points onto a unit half-circle, then sweep the angle, which reduces the problem to decision stumps.

**Try this**: draw 4 points on paper and find, by hand, the two patterns a line cannot produce. It is the most concrete picture in the whole VC story.

## Break point: where the growth function stops growing exponentially

Slide 24 defines it: **if no set of k inputs can be shattered by H, then k is a break point of H**, meaning m<sub>H</sub>(k) < 2<sup>k</sup>. If k is a break point, so are k + 1, k + 2, and so on. The course only discusses the smallest.

Watch the quantifiers. For 2D perceptrons, *some* set of 3 points can be shattered (three points in general position). For 4 points, *no* arrangement can be. So the break point is 4.

Slide 25 draws a conjecture from the table:

- No break point: m<sub>H</sub>(N) = 2<sup>N</sup>. That part is certain.
- Break point k: m<sub>H</sub>(N) = O(N<sup>k−1</sup>).

Positive rays (k = 2) are O(N) and positive intervals (k = 3) are O(N²), so both fit. If the conjecture holds, plugging m<sub>H</sub>(N) into Hoeffding in place of M works: the polynomial eventually loses to exp(−2ε²N). L6 proves exactly this.

## L6: how a break point caps the growth function

L6 has four videos: Restriction of Break Point, Bounding Function: Basic Cases, Bounding Function: Inductive Cases, and A Pictorial Proof. The result fits in two sentences:

1. Define the **bounding function** B(N, k): the largest m<sub>H</sub>(N) can possibly be, given break point k. It is a purely combinatorial quantity that ignores what H looks like. Positive intervals and 1D perceptrons both have break point 3, for example, so B(N, 3) bounds both.
2. One can prove B(N, k) ≤ Σ<sub>i=0</sub><sup>k−1</sup> C(N, i), whose highest-order term is N<sup>k−1</sup>. So **whenever a break point exists, m<sub>H</sub>(N) is polynomial in N**.

Putting m<sub>H</sub> back into the BAD-event probability gives the Vapnik–Chervonenkis (VC) bound (slide 25):

P[∃h ∈ H such that |E<sub>in</sub>(h) − E<sub>out</sub>(h)| > ε] ≤ 4 · m<sub>H</sub>(2N) · exp(−ε²N / 8)

Compared with 2 · M · exp(−2ε²N), M becomes m<sub>H</sub>(2N) and the constants get worse. For 2D perceptrons, the break point is 4 and m<sub>H</sub>(N) is O(N³), so learning with 2D perceptrons is feasible. This is the moment the PLA from L2 gets its theoretical footing.

<details>
<summary>Proof 1: the B(N, k) table and recurrence (slides 6–19)</summary>

**Boundary cases** (slides 8–10):

- B(N, 1) = 1. The set cannot shatter even one point, so every column holds a single symbol. Once the first dichotomy is in, no other fits.
- B(N, k) = 2<sup>N</sup> when N < k. There are not yet enough points to hit the break point, so every pattern is allowed.
- B(N, k) = 2<sup>N</sup> − 1 when N = k. Removing any one pattern is enough to avoid shattering k points.

**Inductive case** (slides 12–17), using B(4, 3). After checking all 2<sup>2⁴</sup> sets of dichotomies, the maximum is 11. Group those 11 by their first three coordinates (x₁, x₂, x₃):

- α groups appear in pairs, identical on the first three points with x₄ = ○ in one and × in the other (2α dichotomies in total).
- β dichotomies appear only once.

So B(4, 3) = 2α + β. Two observations follow:

- α + β are dichotomies on (x₁, x₂, x₃), and they still cannot shatter any 3 points. So α + β ≤ B(3, 3).
- If the α part could shatter any 2 of the first three points, pairing with x₄ would shatter 3 points, a contradiction. So α ≤ B(3, 2).

In general this gives B(N, k) ≤ B(N − 1, k) + B(N − 1, k − 1), and induction yields B(N, k) ≤ Σ<sub>i=0</sub><sup>k−1</sup> C(N, i). Slide 18 notes that the "≤" is actually "=", and leaves the proof to math lovers. The bonus problem Q13 of Fall 2024 HW3 asks for exactly that ≥ direction.

A quiz on slide 11 makes one more point: for 2D perceptrons m<sub>H</sub>(4) = 14, while B(4, 4) = 15. The bounding function can be loose.

</details>

<details>
<summary>Proof 2: the three-step pictorial proof of the VC bound (slides 21–25)</summary>

The goal is to turn "infinitely many E<sub>out</sub> values" into "finitely many cases".

1. **Replace E<sub>out</sub> with E′<sub>in</sub>.** Draw a second, "ghost" data set D′ of size N and compute E′<sub>in</sub> on it. If h is BAD between E<sub>in</sub> and E<sub>out</sub>, it is probably also BAD between E<sub>in</sub> and E′<sub>in</sub>. This step turns ε into ε/2 and adds a factor of 2 in front.
2. **Decompose H by kind.** Now only the 2N points of D and D′ matter, and on them the hypotheses fall into at most m<sub>H</sub>(2N) kinds. Apply the union bound over those finitely many kinds.
3. **Hoeffding without replacement.** Treat the 2N examples as a small bin. Draw N at random for E<sub>in</sub> and use the rest for E′<sub>in</sub>. |E<sub>in</sub> − E′<sub>in</sub>| > ε/2 is equivalent to |E<sub>in</sub> − (E<sub>in</sub> + E′<sub>in</sub>)/2| > ε/4, and for a fixed h the without-replacement version of Hoeffding applies.

Together the three steps give 4 · m<sub>H</sub>(2N) · exp(−ε²N / 8). The quiz on slide 26 plugs in positive rays with ε = 0.1 and N = 10,000 and gets a bound of about 0.298. Even with ten thousand examples, the bound on the BAD probability is not small. L7 returns to that looseness.

</details>

## Video list

L5 (required before class in Fall 2026):

- [Recap and Preview](https://www.youtube.com/watch?v=4aIAxH8eBMs)
- [Effective Number of Lines](https://www.youtube.com/watch?v=oAW0_j8_l3Y)
- [Effective Number of Hypotheses](https://www.youtube.com/watch?v=dnVofdAomWY)
- [Break Point](https://www.youtube.com/watch?v=z3TpJRqPzcg)

L6 (optional in both semesters):

- [Restriction of Break Point](https://www.youtube.com/watch?v=rUFqB5Z3YHQ)
- [Bounding Function: Basic Cases](https://www.youtube.com/watch?v=OmRekto9rkc)
- [Bounding Function: Inductive Cases](https://www.youtube.com/watch?v=6jtWUmaBqFU)
- [A Pictorial Proof](https://www.youtube.com/watch?v=GcxpsIvR7t8)

English counterpart: in [Caltech's Learning from Data](https://work.caltech.edu/telecourse), Lecture 5 is also called Training versus Testing and Lecture 6 is Theory of Generalization. It uses the same textbook. The Fall 2024 NTU course page links [Abu-Mostafa's Lecture 6](https://www.youtube.com/watch?v=6FWRijsmLtE) right next to Lin's Mandarin version.

## Practice: Fall 2024 HW2

[HW2](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf) was released on 2024-09-23 and due 10/07. It is worth 200 points plus 20 bonus points and spans L4 to L7. The problems tied to this post:

- **Q1**: the growth function of 2D perceptrons restricted to slope 1 or −1, for N ≥ 4.
- **Q3**: the growth function of 2D perceptrons that must pass through the point (11, 26). The 05e page on reducing origin-passing perceptrons to decision stumps is a good warm-up.
- **Q4**: the tightest upper bound on the VC dimension of a finite set of 6211 fixed perceptrons. It uses the L7 definition, but the idea is "how many patterns can finitely many hypotheses produce?"
- **Q10–12**: decision stumps. Q10 asks you to prove that under the given noisy data distribution E<sub>out</sub>(h<sub>s,θ</sub>) = u + v·|θ|. Q11 has you implement the 1D decision stump algorithm, run it 2000 times with N = 12 and 15% noise, and plot (E<sub>in</sub>, E<sub>out</sub>). Q12 repeats this with a randomly chosen hypothesis.
- **Q13 (bonus)**: an upper bound on the VC dimension of multi-dimensional decision stumps.

Q2, Q6 and Q7 are the L4 multi-bin sampling problems, covered in the [previous post](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning-en). The Q13 bonus of Fall 2024 HW3 asks for the lower bound on B(N, k); see Proof 1 above.

**Try this**: Q11 and Q12 need no data set, since the code generates its own data. Put the two scatter plots side by side and compare the median E<sub>out</sub> − E<sub>in</sub> for "pick the lowest-E<sub>in</sub> hypothesis" against "pick any hypothesis". That gap is exactly what this post is about. With no official solutions, you can check your simulation against the E<sub>out</sub> formula you derive in Q10.

Per the course schedule, Fall 2026 hw2 comes out on 10/07. As of 2026-09-30 it is not yet public.

## Next

The next post, [VC Dimension, Noise and Error Measures](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en), gives "the largest non-break point" its formal name, the VC dimension d<sub>VC</sub>. It proves that d-dimensional perceptrons have d<sub>VC</sub> = d + 1, then extends the theory to noisy data.

Further reading: the Stanford CS229 [generalization chapter guide](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-08-generalization-en) approaches the same question by a different route.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Replaced the embedded Caltech lecture (a different course) with Lin's own "Effective Number of Lines"; the Caltech video stays as a text link.

## References

- [Machine Learning Foundations / Techniques MOOC page (Hsuan-Tien Lin)](https://www.csie.ntu.edu.tw/~htlin/mooc/)
- [L5 Training versus Testing slides](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/05_handout.pdf)
- [L6 Theory of Generalization slides](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/06_handout.pdf)
- [L5 extended slides (Fall 2026)](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/05e_handout.pdf)
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf) (lectures in Mandarin, slides in English)
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)
- [Fall 2024 Homework 2](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf)
- [Fall 2024 Homework 3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf)
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)
- [Caltech Lecture 6 (Yaser Abu-Mostafa)](https://www.youtube.com/watch?v=6FWRijsmLtE)
- [Learning from Data textbook](http://amlbook.com)
- [MOOC slide errata](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php)
