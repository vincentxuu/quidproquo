---
title: "Feasibility of Learning: Hoeffding's Inequality and Guarantees Outside the Data | NTU Hsuan-Tien Lin Machine Learning Foundations Lecture 4"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, learning-theory, probability]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 4
tldr: "This lecture first shows that the data D alone cannot determine the answer outside D (No Free Lunch), then adds one assumption: the data and the future inputs are drawn independently from the same distribution. Hoeffding's inequality then guarantees that, for a hypothesis h fixed in advance, the probability that E_in and E_out differ by more than ε is at most 2exp(−2ε²N). An algorithm has to choose among M hypotheses, so the bound is multiplied by M and becomes 2M exp(−2ε²N); with finitely many hypotheses, enough data, and a small E_in, learning is feasible."
description: "A guide to Lecture 4 of NTU Hsuan-Tien Lin's Machine Learning Foundations, Feasibility of Learning: the exhaustive No Free Lunch example, drawing marbles and Hoeffding's inequality, E_in and E_out, the difference between verifying one hypothesis and real learning, and a step-by-step derivation of BAD data and the union bound, with all four Fun Time questions explained and checked numerically."
draft: false
glossary:
  - term: "Hoeffding's inequality"
    aliases: ["Hoeffding inequality"]
    definition: "For N independently drawn samples, the probability that the sample fraction ν differs from the true probability µ by more than ε is at most 2exp(−2ε²N); the bound does not require knowing µ."
    context: "Foundations Lecture 4 uses it to show that, with enough data, E_in(h) of one fixed hypothesis is probably close to E_out(h)."
  - term: "PAC"
    aliases: ["probably approximately correct"]
    definition: "\"Probably (with high probability) approximately (within error ε) correct\". Foundations uses it to describe probabilistic guarantees such as ν ≈ µ and E_in ≈ E_out."
    context: "The central term of Foundations Lecture 4; the later VC bound is also a PAC-style guarantee."
  - term: "BAD data"
    aliases: ["BAD sample"]
    definition: "A data set D on which some hypothesis has E_in and E_out more than ε apart. With many hypotheses, D counts as BAD as soon as it is BAD for any one of them."
    context: "Foundations Lecture 4 uses it to turn \"can the algorithm choose freely and safely\" into a probability."
  - term: "union bound"
    definition: "The probability that at least one of several events happens is at most the sum of the probabilities of the individual events. The events do not need to be independent."
    context: "Foundations Lecture 4 uses it to extend Hoeffding for one hypothesis to M hypotheses, at the price of multiplying the bound by M."
  - term: "No Free Lunch"
    aliases: ["NFL"]
    definition: "With no assumption at all about the target function, the data D alone cannot guarantee how a hypothesis performs outside D."
    context: "The starting point of Foundations Lecture 4; the three sections that follow all answer which assumption has to be added to get around it."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning)

**Video status: Videos included.** This article is written from the official MOOC handout [04_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/04_handout.pdf) and transcripts of this lecture's four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/26 to 26/26), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Foundations Lecture 4 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Foundations into four questions, and this is the last lecture under the first one, When Can Machines Learn? The previous lecture, [Foundations Lecture 3: Types of Learning](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-03-types-of-learning-en), is left with a single line on the Roadmap: from here on the focus is binary classification or regression from a batch of supervised data with concrete features. Reviewing it in the lecture, Lin says the previous lecture ended on a teaser: even in a setting this central, learning may turn out to be impossible.

This lecture starts from that bad news. The PLA of [Foundations Lecture 2](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en) can get every example it has seen right, but the bank cares about customers who have not walked in yet. If everything seen is right, does that guarantee the unseen will be mostly right too? The four sections answer in order: not without an assumption; once we add "the data come from independent sampling", one hypothesis fixed in advance can be verified; and when the algorithm has to choose among many hypotheses, the guarantee survives, but at a price.

The prerequisites are the learning flow diagram of [Foundations Lecture 1](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron-en) ($f$, $\mathcal{D}$, $\mathcal{H}$, $\mathcal{A}$, $g$), the PLA of Foundations Lecture 2, and basic probability (independent events, the binomial distribution, the exponential function and the natural logarithm). After reading, you should be able to write out on your own the few lines that lead from Hoeffding's inequality for one hypothesis to the union bound for $M$ hypotheses, plug in numbers to compute the bound, and say clearly how "verification" differs from "learning".

## Why the data alone cannot guarantee the answer outside the data

```youtube
url: https://www.youtube.com/watch?v=tOgbh5_747w
title: Feasibility of Learning :: Learning is Impossible? @ Machine Learning Foundations (機器學習基石)
```

(Video 00:18–01:37 reviews the previous lecture, 01:37–05:28 is the picture puzzle, 05:28–11:45 is the three-bit example and No Free Lunch, and Fun Time follows.)

### A puzzle where every answer can be called wrong

Page 2 of the handout poses a learning puzzle for humans; in the lecture, Lin jokes that it tests human intelligence rather than artificial intelligence. There are six 3×3 black-and-white grid pictures: the three in the top row are labeled $y_n = -1$, the three in the bottom row $y_n = +1$, and the question is what $g(\mathbf{x})$ is for a seventh picture. Written as text, with ■ for a black cell, □ for a white cell, and the three rows from top to bottom separated by " / ":

| Picture | Label | Three rows (top to bottom) | Black cells |
|---|---|---|---|
| Top left | $-1$ | ■□□ / ■□■ / □■□ | 4 |
| Top middle | $-1$ | ■□□ / □□■ / ■□■ | 4 |
| Top right | $-1$ | ■□□ / □□■ / □□□ | 2 |
| Bottom left | $+1$ | □□■ / □■□ / ■□□ | 3 |
| Bottom middle | $+1$ | □■□ / ■□■ / □■□ | 4 |
| Bottom right | $+1$ | □■■ / ■■□ / □■■ | 6 |
| Picture to predict | ? | ■□□ / □■□ / □□■ | 3 |

Page 3 is titled Two Controversial Answers and lists four rules, each of which classifies all six pictures correctly:

| Rule | On the six pictures | On the seventh picture |
|---|---|---|
| symmetry ⇔ $+1$ | Each of the three bottom pictures has an axis of symmetry; none of the three top ones does | Symmetric about the diagonal, $+1$ |
| (black or white count = 3) or (black count = 4 and middle-top black) ⇔ $+1$ | Bottom row: 3 black; 4 black with middle-top black; 3 white. None of the top row qualifies | 3 black cells, $+1$ |
| left-top black ⇔ $-1$ | The left-top cell is black in every top picture and white in every bottom picture | Left-top is black, $-1$ |
| middle column contains at most 1 black and right-top white ⇔ $-1$ | All three top pictures qualify; none of the three bottom ones does | 1 black in the middle column and right-top white, $-1$ |

For this article, the seven pictures were entered as in the table above and each rule was checked in Python: all four rules are correct on all six labeled pictures, the first two say $+1$ for the seventh picture, and the last two say $-1$.

In the lecture this becomes a dialogue. If the student answers $-1$, the teacher says the rule in mind was symmetry and the answer is $+1$; if the student answers $+1$, the teacher says the rule in mind was the left-top cell and the answer is $-1$. The handout concludes: all valid reasons, and your adversarial teacher can always call you "didn't learn". Lin adds in the lecture that this puzzle already uses the most central setting, binary classification with supervised labels and six examples, and still any answer can be ruled wrong.

### A version small enough to enumerate

The picture puzzle allows too many rules to count. Page 4 shrinks the problem until everything can be listed: the input is three bits, $\mathcal{X} = \{0,1\}^3$, 8 possible inputs in all; the output is $\mathcal{Y} = \{\circ, \times\}$. The data $\mathcal{D}$ give the answers for 5 of those inputs:

| $\mathbf{x}_n$ | $y_n = f(\mathbf{x}_n)$ |
|---|---|
| 000 | ○ |
| 001 | × |
| 010 | × |
| 011 | ○ |
| 100 | × |

With 8 inputs and 2 possible outputs for each, there are $2^8 = 256$ functions from $\mathcal{X}$ to $\mathcal{Y}$. The handout says we can then enumerate all candidate $f$ as $\mathcal{H}$; in the lecture, Lin explains that since there are only 256 of them, we simply put them all into the hypothesis set. The algorithm picks from it a $g$ that is correct on all 5 examples, that is, all $g(\mathbf{x}_n) = y_n$. The handout notes "like PLA" here, and Lin explains in the lecture that PLA does roughly the same thing: it finds a line that completely separates the circles and crosses it has seen. The question is whether such a $g$ resembles $f$.

Page 5 lays the answer out as a table. The inputs $\mathcal{D}$ does not cover are 101, 110, and 111; the true answer on each can be ○ or ×, so there are $2^3 = 8$ target functions fully consistent with $\mathcal{D}$, which the handout calls $f_1$ through $f_8$:

| $\mathbf{x}$ | $y$ | $g$ | $f_1$ | $f_2$ | $f_3$ | $f_4$ | $f_5$ | $f_6$ | $f_7$ | $f_8$ |
|---|---|---|---|---|---|---|---|---|---|---|
| 000 | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| 001 | × | × | × | × | × | × | × | × | × | × |
| 010 | × | × | × | × | × | × | × | × | × | × |
| 011 | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| 100 | × | × | × | × | × | × | × | × | × | × |
| 101 | | ? | ○ | ○ | ○ | ○ | × | × | × | × |
| 110 | | ? | ○ | ○ | × | × | ○ | ○ | × | × |
| 111 | | ? | ○ | × | ○ | × | ○ | × | ○ | × |

The first five rows are $\mathcal{D}$: the eight $f$ look identical there, and the algorithm has tuned $g$ to match. The handout's two-line conclusion:

- $g \approx f$ inside $\mathcal{D}$: sure!
- $g \approx f$ outside $\mathcal{D}$: No! (but that's really what we want!)

In the lecture, Lin walks through the last three rows with a concrete $g$: suppose your $g$ predicts ○×○ on 101, 110, and 111. In the worst case the true $f$ happens to be ×○× ($f_6$ in the table), and all three are wrong.

As an addition in this article, count this $g$ against each of the eight $f$. The number of the three new inputs it gets right, for $f_1$ through $f_8$ in order, is 2, 1, 3, 2, 1, 0, 2, 1, a total of 12 and an average of $12/8 = 1.5$, exactly half. Any other $g$ does the same: listing all 8 possible predictions in Python for this article, each one scores one 3, three 2s, three 1s, and one 0 against the eight $f$. Three new inputs with a one-half chance on each is no different from flipping coins. This is what Lin means in the lecture: if all eight $f$ are possible, then on average we seem to have learned nothing.

### What No Free Lunch says

The last sentence on page 5 of the handout: learning from $\mathcal{D}$ (to infer something outside $\mathcal{D}$) is doomed if any "unknown" $f$ can happen. In the lecture, Lin says a line of research in machine learning calls this No Free Lunch.

The condition in that sentence deserves a careful read. As Lin puts it in the lecture, we have insisted all along that $f$ is unknown; if we insist on only that and assume nothing else, we cannot say whether $g$ is good or bad outside the data, and to say anything we have to add some assumptions. Lin also reminds us that the part outside the data really is what we want: in the credit card example, the bank wants to know whether $g$ gives the same answer as the ideal formula when a new customer walks in, and getting old customers right does not count.

So the question this section leaves behind is which assumption to add. The one added in the next three sections has nothing to do with what $f$ looks like; it only concerns where the data come from.

### Fun Time: a brain teaser with a single example

**Question (page 6):** This is a popular "brain-storming" problem, with a claim that 2% of the world's cleverest population can crack its "hidden pattern":

$$
(5, 3, 2) \rightarrow 151022, \qquad (7, 2, 5) \rightarrow \ ?
$$

It is like a "learning problem" with $N = 1$, $\mathbf{x}_1 = (5, 3, 2)$, $y_1 = 151022$. Learn a hypothesis from the one example to predict on $\mathbf{x} = (7, 2, 5)$. What is your answer?

1. 151026
2. 143547
3. I need more examples to get the correct answer
4. there is no "correct" answer

**Answer: 4.** The handout's reason is that this is of the same nature as the No Free Lunch problems just discussed: we cannot hope to be correct under this adversarial setting. It adds in passing that option 2 is the designer's answer: the first two digits are $x_1 \cdot x_2$, the next two digits are $x_1 \cdot x_3$, and the last two digits are $x_1 \cdot x_2 + x_1 \cdot x_3 - x_2$. Checking: $(5,3,2)$ gives 15, 10, and $15 + 10 - 3 = 22$, which concatenate to 151022; $(7,2,5)$ gives 14, 35, and $14 + 35 - 2 = 47$, which concatenate to 143547.

Option 1 can be justified too. Here is a rule made up for this article, not from the slides: $y = 151012 + 2x_1$. $(5,3,2)$ gives $151012 + 10 = 151022$, matching the data; $(7,2,5)$ gives $151012 + 14 = 151026$. With a single example both rules are fully correct, and nothing says which one is the real one.

Option 3 sounds cautious but is also wrong. The table above already demonstrated it: after seeing 5 of the 8 inputs, anything can still happen on the remaining 3. However many examples there are, as long as the question is about an unseen input and nothing is assumed about $f$, there is no such thing as the correct answer. In the lecture, Lin explains that whatever number you answer, you can claim to be right; the answer circulating online is just one interpretation.

## A problem where inference works: from a handful of marbles to the whole bin

```youtube
url: https://www.youtube.com/watch?v=MgAihqFPkZc
title: Feasibility of Learning :: Probability to the Rescue @ Machine Learning Foundations (機器學習基石)
```

(Video 00:01–01:27 poses the bin problem, 01:27–04:33 is sampling, 04:33–08:19 is Hoeffding's inequality and PAC, 08:19–10:29 reads the formula, and Fun Time follows.)

### The bin and the sample

Page 7 of the handout takes a step back: inferring the unknown target $f$ outside $\mathcal{D}$ is difficult in learning, so can we infer something unknown in other scenarios? The example is a bin of many, many orange and green marbles. What is the orange portion? We do not know. In the lecture, Lin says there are too many marbles to count one by one.

Page 8 does what the first class of a statistics course does: grab a handful and look.

| | Bin | Sample |
|---|---|---|
| Orange | probability $\mu$ | fraction $\nu$ |
| Green | probability $1 - \mu$ | fraction $1 - \nu$ |
| Known or not | $\mu$ unknown | $\nu$ known |

The sample is $N$ marbles sampled independently. The numbers Lin uses in the lecture are 10 marbles with 3 of them orange, so you guess that about 30% of the bin is orange. On this page the handout introduces two words that stay in use from here on: $\nu$ is the in-sample quantity and $\mu$ the out-of-sample quantity. The question is whether $\nu$ says anything about $\mu$.

Page 9 answers in two halves, under the title Possible versus Probable:

- **No, possibly not**: the sample can be mostly green while the bin is mostly orange.
- **Yes, probably yes**: in-sample $\nu$ is likely close to the unknown $\mu$.

"Can possibly happen" and "will probably happen" are two different things. In the lecture, Lin says a bin that is mostly orange yielding a handful that is almost all green has a very small probability but does happen, so we cannot get a certain answer and can only say it is so with high probability. As an addition in this article, here is the difference from before: in the No Free Lunch section the adversary could name the worst $f$; here nobody names which handful you get, the sampling is random, and the worst case is just an event with small probability.

### Hoeffding's inequality

The mathematical form of "probably close" is on page 10. In a big sample ($N$ large), $\nu$ is probably within $\epsilon$ of $\mu$:

$$
\mathbb{P}\big[\,\lvert \nu - \mu \rvert > \epsilon\,\big] \ \le\ 2\exp\big(-2\epsilon^2 N\big)
$$

This is called Hoeffding's Inequality. The handout notes that it applies to marbles, coins, polling, and so on; Lin's examples in the lecture are that the fraction of heads over many coin flips approaches the coin's true probability of heads, and that a telephone poll before an election comes out close to the final vote share. The handout does not prove the inequality; this article does not either, and instead uses numbers to confirm what it says.

Each symbol in the formula:

- The left side is the probability of a "bad event": the sample fraction $\nu$ differs from the true probability $\mu$ by more than $\epsilon$.
- $\epsilon$ is the error you are willing to tolerate.
- The right side is an upper bound on that probability, with $N$ in the exponent and a minus sign in front. Doubling $N$ squares the exponential term ($e^{-2a} = (e^{-a})^2$), so the bound falls fast.

As an addition in this article, one point that is easy to misread: the random quantity is $\nu$. $\mu$ is a property of the bin, a fixed but unknown number; every handful may give a different $\nu$. The probability $\mathbb{P}$ measures what share of all possible outcomes of the act of grabbing a handful are bad ones.

The handout puts the conclusion in one sentence: the statement "$\nu = \mu$" is probably approximately correct (PAC). In the lecture, Lin explains the two adverbs separately: probably means there is a high probability of being right; approximately means that when you draw 30% orange, the bin may hold 32%, 33%, 28%, or 29%, not exactly equal but close.

### What makes this formula useful

Page 11 lists three points:

1. **Valid for all $N$ and $\epsilon$.** $N$ does not have to pass some threshold before you can use it.
2. **The right side has no $\mu$.** So there is no need to know $\mu$. Lin stresses in the lecture that this is why it can be used for inference: we never knew $\mu$ in the first place, and the formula assumes nothing about $\mu$ either.
3. **A larger $N$, or a looser tolerance $\epsilon$, gives a higher probability for "$\nu \approx \mu$".** Lin comments on the second half in the lecture: setting a larger tolerance of course makes the bad event less likely, but that is somewhat fooling yourself.

The conclusion at the bottom of the page: if $N$ is large, we can probably infer the unknown $\mu$ by the known $\nu$.

The numbers below were computed for this article. First the bound itself, plugging $N$ and $\epsilon$ into $2\exp(-2\epsilon^2 N)$:

| $N$ | $\epsilon = 0.3$ | $\epsilon = 0.1$ | $\epsilon = 0.05$ |
|---|---|---|---|
| 10 | 0.331 | 1.64 | 1.90 |
| 100 | $3.0 \times 10^{-8}$ | 0.271 | 1.21 |
| 1,000 | less than $10^{-77}$ | $4.1 \times 10^{-9}$ | 0.0135 |
| 10,000 | smaller still | less than $10^{-86}$ | $3.9 \times 10^{-22}$ |

Two things are worth noticing. First, the table contains numbers above 1. A probability never exceeds 1, so "the bound is 1.64" says nothing at all. The formula being "valid" for all $N$ and $\epsilon$ does not make it "useful" for all of them. The 10 marbles from the lecture are such a case: if you ask for an error within 0.1, Hoeffding gives no guarantee whatsoever; only when you relax to 0.3 does the bound drop to 0.331. Second, $\epsilon$ appears squared. To halve the error requirement, $N$ has to become four times as large for the bound to stay the same; to cut it to one tenth, $N$ has to be a hundred times as large: $N = 100$ with $\epsilon = 0.1$ and $N = 10{,}000$ with $\epsilon = 0.01$ both give a bound of 0.271.

Next, is it really only an upper bound? Take $\mu = 0.4$ and $\epsilon = 0.1$ and compute the probability of the bad event exactly from the binomial distribution:

| $N$ | Exact $\mathbb{P}[\lvert\nu - \mu\rvert > 0.1]$ | Hoeffding bound |
|---|---|---|
| 10 | 0.334 | 1.64 |
| 100 | 0.0315 | 0.271 |
| 1,000 | $8.7 \times 10^{-11}$ | $4.1 \times 10^{-9}$ |

The exact values all sit below the bound, and by a wide margin. Computing the exact value needs $\mu = 0.4$ and computing the bound does not; that is the trade between the two: Hoeffding is loose, but you can compute it without knowing $\mu$.

Finally, use the formula in reverse. To have "the probability that the error exceeds $\epsilon$ is at most $\delta$", require the right side $2\exp(-2\epsilon^2 N) \le \delta$. Dividing both sides by 2 and taking the natural logarithm gives $-2\epsilon^2 N \le \ln(\delta/2)$, and multiplying through by $-1$ flips the inequality:

$$
N \ \ge\ \frac{1}{2\epsilon^2}\ln\frac{2}{\delta}
$$

With $\epsilon = 0.1$ and $\delta = 0.05$ this gives $N \ge \ln 40 / 0.02 \approx 184.4$, so 185 marbles are enough. Tightening the error to $\epsilon = 0.03$ with the same $\delta$ requires $N \ge \ln 40 / 0.0018 \approx 2049.4$, that is, 2,050 marbles. The handout does not write this reversed form in this lecture; it is the same inequality rearranged.

### Fun Time: the bound for 10 marbles

**Question (page 12):** Let $\mu = 0.4$. Use Hoeffding's Inequality

$$
\mathbb{P}\big[\,\lvert \nu - \mu \rvert > \epsilon\,\big] \ \le\ 2\exp\big(-2\epsilon^2 N\big)
$$

to bound the probability that a sample of 10 marbles will have $\nu \le 0.1$. What bound do you get?

1. 0.67
2. 0.40
3. 0.33
4. 0.05

**Answer: 3.** The handout's solution is to set $N = 10$ and $\epsilon = 0.3$: $\nu \le 0.1$ means $\nu$ is at least 0.3 below $\mu = 0.4$.

$$
2\exp\big(-2 \times 0.3^2 \times 10\big) = 2\exp(-1.8) \approx 2 \times 0.1653 = 0.331
$$

The handout adds one remark: option 4 is the actual probability, and Hoeffding gives only an upper bound to that. This article checks the actual probability: $\nu \le 0.1$ means at most 1 orange among the 10 marbles,

$$
0.6^{10} + 10 \times 0.4 \times 0.6^{9} \approx 0.0060 + 0.0403 = 0.0464
$$

which rounds to 0.05. The handout does not say where the other two options come from; what follows is this article's guess. Option 2, 0.40, is numerically just $\mu$ itself and has nothing to do with the probability being asked for. Option 1, 0.67, numerically equals $1 - 0.3306 = 0.6694$, that is, 1 minus the bound; that number is a lower bound on the probability that $\nu$ and $\mu$ differ by at most 0.3, whereas the question asks for an upper bound on the probability that $\nu \le 0.1$, and the two point in opposite directions.

Two details of this question, as additions in this article. First, the event in the formula is a strict "greater than $\epsilon$", and at $\nu = 0.1$ the gap $\lvert\nu - \mu\rvert$ is exactly 0.3. To be rigorous, take any $\epsilon'$ slightly smaller than 0.3; then $\nu \le 0.1$ falls inside $\lvert\nu - \mu\rvert > \epsilon'$ and the bound is $2\exp(-2\epsilon'^2 \times 10)$; as $\epsilon'$ approaches 0.3 the bound approaches 0.331, and the answer does not change. Second, Hoeffding covers both sides: $\nu$ too low and $\nu$ too high both count. The probability that $\nu \ge 0.7$ is 0.0548, the two sides together come to 0.101, still below 0.331; the question asks only about the low side, so the actual value is smaller still.

Lin's comment on this question in the lecture: to compute the actual probability you must know $\mu$; Hoeffding holds for any $\mu$, so it overestimates and is only an upper limit.

## Replace marbles with data: one fixed hypothesis can be verified

```youtube
url: https://www.youtube.com/watch?v=iXbbfjJNfwU
title: Feasibility of Learning :: Connection to Learning @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–06:00 is the correspondence between the bin and learning, 06:00–07:27 is the components added to the flow diagram, 07:27–10:55 is E_in, E_out, and the guarantee, 10:55–15:00 discusses how verification differs from learning, and Fun Time follows.)

### What the marbles in the bin are

In the lecture, Lin first asks the question on the students' behalf: this is a machine learning course, so why all the talk about marbles? Page 13 maps each component of the bin onto the learning problem:

| Bin | Learning |
|---|---|
| unknown orange probability $\mu$ | the probability that a fixed hypothesis $h$ differs from the target $f$ |
| a marble in the bin | an $\mathbf{x} \in \mathcal{X}$ in the input space |
| orange | $h$ is wrong on this $\mathbf{x}$: $h(\mathbf{x}) \ne f(\mathbf{x})$ |
| green | $h$ is right on this $\mathbf{x}$: $h(\mathbf{x}) = f(\mathbf{x})$ |
| a size-$N$ sample of i.i.d. marbles from the bin | check $h$ on $\mathcal{D} = \{(\mathbf{x}_n, y_n)\}$ with i.i.d. $\mathbf{x}_n$, where $y_n = f(\mathbf{x}_n)$ |

In the lecture, Lin explains how this correspondence comes about. The unknown is $f$, and estimating $f$ at every point of $\mathcal{X}$ is too hard, so ask an easier question first: given a hypothesis $h$ in hand and a new customer, does what $h$ says differ from what $f$ says? Then treat every $\mathbf{x}$ as a marble, painted orange where $h$ and $f$ disagree and green where they agree.

This painting has one precondition, which Lin states with emphasis in the lecture: you must have an $h$ in hand first, and it must be fixed; you cannot paint with this $h$ now and switch to another in a moment. Once painted, the bin belongs to this $h$ alone.

We cannot see the marbles' colors (that would require knowing $f$), but we can see the handful we drew. The data contain both $\mathbf{x}_n$ and $y_n$; Lin adds a condition in the lecture: without noise, $y_n$ is simply $f(\mathbf{x}_n)$. Comparing $h(\mathbf{x}_n)$ with $y_n$ tells us whether the $n$-th marble is orange or green. The handout's conclusion: if $N$ is large and the $\mathbf{x}_n$ are i.i.d., we can probably infer the unknown probability of $h(\mathbf{x}) \ne f(\mathbf{x})$ by the known fraction of $h(\mathbf{x}_n) \ne y_n$.

### One component added to the flow diagram

Page 14 adds to the flow diagram of Foundations Lecture 1. The new piece is a box: an unknown probability distribution $P$ on $\mathcal{X}$. Dashed lines connect it to two places:

1. To the training examples, meaning $\mathbf{x}_1, \mathbf{x}_2, \dots, \mathbf{x}_N$ are drawn from $P$.
2. To the judgment "is $h \approx f$?", meaning the $\mathbf{x}$ used to measure how good $h$ is also comes from the same $P$.

Two solid lines also run to the judgment "is $h \approx f$?": one from the training examples and one from $\mathcal{H}$, labeled fixed $h$. What is being judged is one fixed hypothesis borrowed from $\mathcal{H}$, and the judgment rests on the data. In the lecture, Lin says a dashed line marks something we do not know, and that using the same $P$ in two places corresponds to one and the same bin: the data are the handful drawn from the bin, and what we measure is the whole bin.

With $P$ in place, the two quantities can be defined formally. In the handout's notation:

$$
E_{\text{out}}(h) = \mathop{\mathcal{E}}_{\mathbf{x} \sim P} \llbracket h(\mathbf{x}) \ne f(\mathbf{x}) \rrbracket, \qquad E_{\text{in}}(h) = \frac{1}{N}\sum_{n=1}^{N} \llbracket h(\mathbf{x}_n) \ne y_n \rrbracket
$$

$\llbracket \cdot \rrbracket$ is this course's Boolean bracket: 1 if the statement inside holds and 0 if it does not. $\mathcal{E}$ is the expectation. So $E_{\text{out}}(h)$ is the probability that $h$ is wrong on an $\mathbf{x}$ drawn from $P$; it corresponds to $\mu$ and is unknown. $E_{\text{in}}(h)$ is the fraction of the $N$ examples on which $h$ is wrong; it corresponds to $\nu$ and is known. In the lecture, Lin says "in" stands for in-sample, the errors within the sample in hand, and "out" for out-of-sample, the error rate beyond the sample, over the whole bin.

As an addition in this article: under this definition $E_{\text{out}}$ is an expectation over all of $P$, so an input that already appeared in $\mathcal{D}$ still counts if it is drawn again. That is a different quantity from "counting only the inputs outside $\mathcal{D}$": the No Free Lunch section counted the latter, looking only at the unseen 101, 110, and 111. The handout's summary page wraps up the marble section as probably approximately correct outside $\mathcal{D}$, and in the lecture Lin also describes out-of-sample as the part beyond the sample, in the bin; those are the more colloquial phrasings, and the $E_{\text{out}}$ in the formulas follows the definition above. When the input space is large (for example, when the features are continuous values), the chance of drawing the same point again is negligible and the two quantities are almost equal. When there are only a few possible inputs they differ a lot, and "A world of eight inputs" below is computed over all of $P$ according to the definition.

### The guarantee for one hypothesis

In the lecture, Lin says what follows is only a substitution of words. Replace $\nu$ in Hoeffding with $E_{\text{in}}(h)$ and $\mu$ with $E_{\text{out}}(h)$, and you have The Formal Guarantee of page 15. For any fixed $h$:

$$
\mathbb{P}\big[\,\lvert E_{\text{in}}(h) - E_{\text{out}}(h) \rvert > \epsilon\,\big] \ \le\ 2\exp\big(-2\epsilon^2 N\big)
$$

The properties the handout lists match the bin page one for one:

- Valid for all $N$ and $\epsilon$.
- The right side does not depend on $E_{\text{out}}(h)$, so there is no need to know $E_{\text{out}}(h)$; $f$ and $P$ can stay unknown.
- "$E_{\text{in}}(h) = E_{\text{out}}(h)$" is PAC.

On the second point, Lin explains in the lecture that we only assume $f$ and $P$ exist and do not actually need to know them; if we knew $f$ the game would be over and there would be nothing to learn.

At the bottom of the page is this section's chain of inference:

$$
E_{\text{in}}(h) \approx E_{\text{out}}(h) \ \text{ and } \ E_{\text{in}}(h) \text{ small} \ \Longrightarrow\ E_{\text{out}}(h) \text{ small} \ \Longrightarrow\ h \approx f \ \text{ with respect to } P
$$

"With respect to $P$" cannot be dropped. In the lecture, Lin says this is not an arbitrary guarantee: the data have to keep coming from the same $P$ for $h$ and $f$ to be close.

### Verification is not learning

At this point it looks as if we could declare learning feasible. Page 16 asks: can we claim "good learning" ($g \approx f$)? In the lecture, Lin first reminds us that what the algorithm finally hands over is called $g$, and $h$ is only one candidate in $\mathcal{H}$. The handout's answer has two sides:

| | Condition | Conclusion |
|---|---|---|
| Yes | $E_{\text{in}}(h)$ is small for the fixed $h$, and $\mathcal{A}$ picks it as $g$ | "$g = f$" is PAC |
| No | $\mathcal{A}$ is forced to pick THE $h$ as $g$ | $E_{\text{in}}(h)$ is almost always not small, so "$g \ne f$" is PAC |

The cell on the right is the point. The derivation so far concerns one $h$ fixed in advance from start to finish. For the guarantee to hold, the algorithm would have to hand over the same $h$ no matter what the data look like. In the lecture, Lin explains that an algorithm returning the same $h$ whatever problem it meets will, nine times out of ten, return a poor $h$ with a large $E_{\text{in}}$. Hoeffding still holds then, and $E_{\text{in}}$ and $E_{\text{out}}$ are still close; the conclusion you get is just that you can say with great confidence that $g$ is nothing like $f$.

The handout's closing remark: real learning is $\mathcal{A}$ making choices in $\mathcal{H}$ (like PLA) rather than being forced to pick one $h$. Lin uses PLA as the contrast in the lecture: give it different data and it returns a different line.

So what has been achieved so far goes by another name. Page 17 redraws the diagram as The 'Verification' Flow; compared with the learning flow:

| Position | Learning flow | Verification flow |
|---|---|---|
| Data | training examples | verifying examples |
| Candidates | hypothesis set $\mathcal{H}$ | one hypothesis $h$ |
| Algorithm $\mathcal{A}$ | present, does the choosing | absent, simply $g = h$ |
| Output | the "learned" formula | a given formula that has been verified |

In the handout's words: we can now use historical records to verify "one" candidate formula. Lin stresses in the lecture that these data have not been through learning and have not been through any selection procedure. That point becomes decisive in the section on many hypotheses.

### A numerical example: a world of eight inputs

The setup and computations below were made up for this article and are not from the slides; they use the inputs and functions of the table on page 5 of the handout.

**Setup.** $\mathcal{X} = \{0,1\}^3$, and $P$ is the uniform distribution giving each of the 8 inputs probability $1/8$. The true target is $f_6$ from the table. The hypothesis $h$ is fixed in advance: on the first five inputs it gives the same answers as $y$ in the table, and on 101, 110, 111 it answers ○×○ (the $g$ of the student in the lecture).

**Computing $E_{\text{out}}$.** $f_6$ is ×○× on 101, 110, 111, so $h$ is wrong on all three and right on the other five. $E_{\text{out}}(h) = 3/8 = 0.375$. In the real world this number cannot be seen; here we can compute it only because we built the whole world ourselves.

**Sampling.** Draw $N = 5$ inputs independently from $P$ (repeats allowed); each lands where $h$ is wrong with probability $3/8$. The number of errors $k$ follows a binomial distribution, and $E_{\text{in}}(h) = k/5$:

| $k$ | $E_{\text{in}}(h)$ | Probability | $\lvert E_{\text{in}} - E_{\text{out}}\rvert$ | Exceeds $\epsilon = 0.3$? |
|---|---|---|---|---|
| 0 | 0 | $3125/32768 \approx 0.0954$ | 0.375 | Yes |
| 1 | 0.2 | $\approx 0.2861$ | 0.175 | No |
| 2 | 0.4 | $\approx 0.3433$ | 0.025 | No |
| 3 | 0.6 | $\approx 0.2060$ | 0.225 | No |
| 4 | 0.8 | $\approx 0.0618$ | 0.425 | Yes |
| 5 | 1 | $\approx 0.0074$ | 0.625 | Yes |

**Result.** With $\epsilon = 0.3$, the probability of the bad event is $0.0954 + 0.0618 + 0.0074 = 0.1646$ (exactly $5393/32768$). The Hoeffding bound is $2\exp(-2 \times 0.09 \times 5) = 2\exp(-0.9) \approx 0.813$. The exact value is below the bound.

**What this means.** First, $N = 5$ is too small and a bound of 0.813 carries almost no information; Hoeffding needs a large $N$ to be useful. Second, the handout's $\mathcal{D}$ belongs to the $k = 0$ row: all five examples fall where $h$ is right, $E_{\text{in}} = 0$ looks perfect, and in fact $E_{\text{out}} = 0.375$. For an $h$ fixed in advance, such a misleading sample turns up with a probability of only about 9.5%. But the $g$ in the handout's table was not fixed in advance; it was tuned to be all correct after looking at the data. That difference is dealt with in the numerical computations of the section "When the algorithm chooses, what the guarantee costs".

### Fun Time: a friend's stock rule

**Question (page 18):** Your friend tells you her secret rule in investing in a particular stock: "Whenever the stock goes down in the morning, it will go up in the afternoon; vice versa." To verify the rule, you chose 100 days uniformly at random from the past 10 years of stock data, and found that 80 of them satisfy the rule. What is the best guarantee that you can get from the verification?

1. You'll definitely be rich by exploiting the rule in the next 100 days.
2. You'll likely be rich by exploiting the rule in the next 100 days, if the market behaves similarly to the last 10 years.
3. You'll likely be rich by exploiting the "best rule" from 20 more friends in the next 100 days.
4. You'd definitely have been rich if you had exploited the rule in the past 10 years.

**Answer: 2.** The handout gives one phrase for each of the other three options: option 1, no free lunch; option 3, no "learning" guarantee in verification; option 4, verifying with only 100 days, it is possible that the rule is mostly wrong for the whole 10 years.

This article runs the question through this section's correspondence. The rule is a fixed $h$ (she stated it before you picked the days); the bin is every day of the past 10 years, and $P$ is the uniform distribution over those days; the 100 days are a sample with $N = 100$; 80 days satisfy the rule, so $E_{\text{in}}(h) = 0.2$. Treating the 100 days as drawn independently and taking $\epsilon = 0.15$:

$$
2\exp\big(-2 \times 0.15^2 \times 100\big) = 2\exp(-4.5) \approx 0.022
$$

So with at least 97.8% confidence, the rule's error rate over the 10 years is no more than $0.2 + 0.15 = 0.35$, meaning at least 65% of the days satisfy it. This is a "likely" guarantee, and what it is about is the bin of the past 10 years.

- Option 2 is right in two places: it says "likely" rather than "definitely", and it adds "the market behaves similarly to the last 10 years", meaning future days come from the same $P$. That is exactly the final "with respect to $P$" of the chain of inference.
- Option 1 is wrong because of "definitely", and it lacks the premise that the future resembles the past. Without that premise the next 100 days are inputs outside $\mathcal{D}$, and anything can happen.
- Option 4 is also wrong because of "definitely". In the lecture, Lin explains that the 100 days drawn might look quite unlike the distribution over the 10 years; that is the kind of sample in the $k = 0$ row of the table above.
- Option 3 mistakes verification for learning. You verified this one rule and none of the others; even if you checked all 21 rules against the same 100 days and then picked the best, that would already be making a choice. In the lecture, Lin says that picking one rule out of 20 does not necessarily come with a guarantee this strong. How much weaker is something the section "When the algorithm chooses, what the guarantee costs" can compute.

## When the algorithm chooses, what the guarantee costs

```youtube
url: https://www.youtube.com/watch?v=MFL6xDn1lXM
title: Feasibility of Learning :: Connection to Real Learning @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–01:17 is the many bins, 01:17–04:23 is coin flipping, 04:23–06:57 defines BAD, 06:57–09:59 is BAD data with many hypotheses, 09:59–12:16 is the union bound, 12:16–15:00 is the learning flow and the problem of infinite M, and Fun Time and the summary follow.)

### Many bins

Page 19 draws $M$ bins, one per hypothesis: the orange fraction in the bin of $h_1$ is $E_{\text{out}}(h_1)$, the orange fraction in its sample is $E_{\text{in}}(h_1)$, and so on down the row to $h_M$. In the figure, the 10 marbles drawn from the bin of $h_M$ are all green. The bottom of the page asks: in real learning (say like PLA), is it BINGO when you get all green?

In the lecture, Lin spells the question out: 10 hypotheses are 10 bins, and one bin yielding all green marbles corresponds to one hypothesis being fully correct on the data you see. Should you choose it?

### Coin flipping: with choice, rare things stop being rare

Page 20 answers with coins. Q: if everyone in the size-150 NTU ML class flips a coin 5 times, and one of the students gets 5 heads for her coin "$g$", is "$g$" really magical?

A: No. Even if all coins are fair, the probability that one of the 150 coins results in 5 heads is

$$
1 - \Big(\frac{31}{32}\Big)^{150} > 99\%
$$

Derivation: a fair coin flipped 5 times comes up all heads with probability $(1/2)^5 = 1/32$, so the probability of "not" all heads is $31/32$. The 150 coins are independent, so the probability that none of the 150 is all heads is $(31/32)^{150} \approx 0.0085$. Subtracting from 1, the probability that at least one is all heads is about 0.9915.

In the lecture, Lin adds a version you can try at home: one person at a computer can run the 150 rounds alone, and all heads usually turns up within 20, 30, or 40 rounds. This article checks: the probability of it appearing within 20 rounds is $1 - (31/32)^{20} \approx 0.47$, within 30 rounds 0.61, within 40 rounds 0.72; from round 22 on it exceeds one half.

The correspondence with learning: a coin is a hypothesis, the 5 flips are 5 examples, heads means correct, and a fair coin has $E_{\text{out}} = 1/2$. All heads is $E_{\text{in}} = 0$. Picking out the all-heads coin amounts to picking the hypothesis with the smallest $E_{\text{in}}$, and its $E_{\text{out}}$ is still $1/2$. Lin's conclusion in the lecture is that choice brings bias, even though these coins are all the same. For a single coin the probability of all heads is $1/32$; with 150 to choose from, the probability exceeds 99%. In the handout's words: BAD sample means $E_{\text{in}}$ and $E_{\text{out}}$ far away, and it can get worse when involving "choice".

### BAD sample and BAD data

Page 21 defines "bad" precisely:

- **BAD sample**: e.g., $E_{\text{out}} = 1/2$, but getting all heads ($E_{\text{in}} = 0$).
- **BAD data for one $h$**: $E_{\text{out}}(h)$ and $E_{\text{in}}(h)$ far away. The typical case the handout gives is $E_{\text{out}}$ big (far from $f$) but $E_{\text{in}}$ small (correct on most examples).

In the lecture, Lin supplies the standard for "far": differing by more than $\epsilon$.

The handout then draws a one-row table. Line up all the data sets that could possibly be drawn, $\mathcal{D}_1, \mathcal{D}_2, \dots, \mathcal{D}_{1126}, \dots, \mathcal{D}_{5678}, \dots$, each one $N$ examples. For a fixed $h$, each cell either is BAD or is not. In the handout's figure, the row of $h$ is BAD at $\mathcal{D}_1$ and $\mathcal{D}_{5678}$. The probability of BAD is a sum over all possible data sets:

$$
\mathbb{P}_{\mathcal{D}}\big[\text{BAD } \mathcal{D}\big] = \sum_{\text{all possible } \mathcal{D}} \mathbb{P}(\mathcal{D}) \cdot \llbracket \text{BAD } \mathcal{D} \rrbracket
$$

Hoeffding says this sum is small. In the lecture, Lin repeats several times where the probability lives: on the act of drawing a handful. What Hoeffding guarantees is that the BAD cells in this row add up to a small probability; whether the data set in your hands is BAD, it does not say.

### What counts as bad with many hypotheses

Page 22 extends the table to many rows, one per hypothesis. The table in the handout:

| | $\mathcal{D}_1$ | $\mathcal{D}_2$ | … | $\mathcal{D}_{1126}$ | … | $\mathcal{D}_{5678}$ | Hoeffding |
|---|---|---|---|---|---|---|---|
| $h_1$ | BAD | | | | | BAD | $\mathbb{P}_{\mathcal{D}}[\text{BAD } \mathcal{D} \text{ for } h_1] \le \dots$ |
| $h_2$ | | BAD | | | | | $\mathbb{P}_{\mathcal{D}}[\text{BAD } \mathcal{D} \text{ for } h_2] \le \dots$ |
| $h_3$ | BAD | BAD | | | | BAD | $\mathbb{P}_{\mathcal{D}}[\text{BAD } \mathcal{D} \text{ for } h_3] \le \dots$ |
| … | | | | | | | |
| $h_M$ | BAD | | | | | BAD | $\mathbb{P}_{\mathcal{D}}[\text{BAD } \mathcal{D} \text{ for } h_M] \le \dots$ |
| all | BAD | BAD | | | | BAD | ? |

Each row has its own Hoeffding watching over it, and its BAD cells add up to a small probability. What is new is the bottom row. The handout's definition uses two equivalent statements:

$$
\text{BAD data for many } h \iff \text{no 'freedom of choice' by } \mathcal{A} \iff \text{there exists some } h \text{ such that } E_{\text{out}}(h) \text{ and } E_{\text{in}}(h) \text{ far away}
$$

In other words, one BAD cell anywhere in a column makes that data set BAD for the whole of $\mathcal{H}$. Lin's analogy in the lecture is stepping on a landmine: good data let the algorithm choose however it likes and still be right; bad data have a mine buried in them, the algorithm sees some hypothesis with a low $E_{\text{in}}$ and chooses it, and its $E_{\text{out}}$ turns out to be large. Lin reads off the table in the lecture: with $\mathcal{D}_1$, the mines you might step on are $h_1$, $h_3$, and $h_M$; with $\mathcal{D}_2$, the mines are $h_2$ and $h_3$; only something like $\mathcal{D}_{1126}$, with no mine in the whole column, is good data.

The question mark at the lower right is what this section sets out to compute: for $M$ hypotheses, what is the bound of $\mathbb{P}_{\mathcal{D}}[\text{BAD } \mathcal{D}]$?

### The union bound: a four-line derivation

The derivation on page 23 has only four lines. Take them one at a time.

**Line one: write the definition as an "or".** BAD is defined as some hypothesis going wrong, so

$$
\mathbb{P}_{\mathcal{D}}\big[\text{BAD } \mathcal{D}\big] = \mathbb{P}_{\mathcal{D}}\big[\text{BAD } \mathcal{D} \text{ for } h_1 \ \textbf{or} \ \text{BAD } \mathcal{D} \text{ for } h_2 \ \textbf{or} \ \dots \ \textbf{or} \ \text{BAD } \mathcal{D} \text{ for } h_M\big]
$$

**Line two: split the "or" into a sum.** This step is called the union bound:

$$
\le\ \mathbb{P}_{\mathcal{D}}\big[\text{BAD } \mathcal{D} \text{ for } h_1\big] + \mathbb{P}_{\mathcal{D}}\big[\text{BAD } \mathcal{D} \text{ for } h_2\big] + \dots + \mathbb{P}_{\mathcal{D}}\big[\text{BAD } \mathcal{D} \text{ for } h_M\big]
$$

Why "less than or equal to": in the lecture, Lin explains it with the areas of sets; the area of a union of several sets cannot exceed the sum of their individual areas. This article adds the two-event version: $\mathbb{P}[A \text{ or } B] = \mathbb{P}[A] + \mathbb{P}[B] - \mathbb{P}[A \text{ and } B]$, where the last term is never negative, and dropping it gives $\mathbb{P}[A \text{ or } B] \le \mathbb{P}[A] + \mathbb{P}[B]$. The overlap is counted twice, so adding directly can only overshoot, never undershoot. This step does not require the events to be independent.

**Line three: apply Hoeffding once to each term.** Every $h_m$ is a fixed hypothesis that was sitting in $\mathcal{H}$ before the data were drawn, so "the guarantee for one hypothesis" holds for it:

$$
\le\ 2\exp\big(-2\epsilon^2 N\big) + 2\exp\big(-2\epsilon^2 N\big) + \dots + 2\exp\big(-2\epsilon^2 N\big)
$$

**Line four: add up $M$ identical numbers.**

$$
=\ 2M\exp\big(-2\epsilon^2 N\big)
$$

The handout calls it the finite-bin version of Hoeffding and lists three points:

- Valid for all $M$, $N$, and $\epsilon$.
- No need to know any $E_{\text{out}}(h_m)$; $f$ and $P$ can stay unknown.
- "$E_{\text{in}}(g) = E_{\text{out}}(g)$" is PAC, regardless of $\mathcal{A}$.

The third point is where the whole lecture lands. The handout states only the conclusion; this article fills in the reason. The $g$ the algorithm hands over is one of $h_1, \dots, h_M$, and which one depends on the data. If this $\mathcal{D}$ is not BAD, then every $h_m$ has $E_{\text{in}}$ and $E_{\text{out}}$ within $\epsilon$ of each other, so whichever one the algorithm picks, $g$ is within $\epsilon$ too. Put the other way round, "$E_{\text{in}}$ and $E_{\text{out}}$ of $g$ differ by more than $\epsilon$" can only happen on a BAD $\mathcal{D}$:

$$
\mathbb{P}_{\mathcal{D}}\big[\,\lvert E_{\text{in}}(g) - E_{\text{out}}(g) \rvert > \epsilon\,\big] \ \le\ \mathbb{P}_{\mathcal{D}}\big[\text{BAD } \mathcal{D}\big] \ \le\ 2M\exp\big(-2\epsilon^2 N\big)
$$

Where "Verification is not learning" got stuck was that $g$ has seen the data and is not fixed. The fix here is to stop tracking which one the algorithm will pick and require every candidate to be safe at once. As Lin puts it in the lecture, when every $h$ is safe the algorithm can choose any way it likes. The price is an extra $M$ on the right side; Lin's example is a hypothesis set of 100 hypotheses, where the bound on the probability of the bad event is 100 times the original.

Since any choice is safe, the handout says the most reasonable $\mathcal{A}$ (like PLA or pocket) picks the one with the lowest $E_{\text{in}}(h_m)$ as $g$. Lin's reason in the lecture: every hypothesis has $E_{\text{in}}$ and $E_{\text{out}}$ close together, so the one with the smallest $E_{\text{in}}$ will have an $E_{\text{out}}$ on the smaller side as well.

As an addition in this article: in the coin example the 150 coins are independent, which is why the exact $1 - (31/32)^{150}$ can be computed. In a learning problem the $M$ hypotheses all look at the same data, their BAD events are correlated with one another, and the exact value is hard to compute; the union bound does not need independence, and that is why it is used. It can also be very loose: applied to the coins, the union bound gives $150 \times 1/32 \approx 4.69$, larger than 1.

### Plugging in numbers

The computations below belong to this article and continue the two made-up scenarios from earlier.

**The stock rule, one picked out of 21.** You check your friend's rule and the rules of 20 more friends against the same 100 days and pick the rule that the most days satisfy. $M = 21$, $N = 100$:

| $\epsilon$ | One rule: $2\exp(-2\epsilon^2 N)$ | One picked out of 21: $2 \times 21 \times \exp(-2\epsilon^2 N)$ |
|---|---|---|
| 0.10 | 0.271 | 5.68 |
| 0.15 | 0.022 | 0.467 |
| 0.20 | 0.00067 | 0.0141 |

When only one rule is verified, $\epsilon = 0.15$ already gives 97.8% confidence. After choosing, the same $\epsilon$ leaves only 53.3% confidence; to get back to roughly the same confidence level, $\epsilon$ has to be relaxed to 0.2. With the same "80 of 100 days satisfy it", for one rule you can say the error rate is likely no more than 0.35, and for the one picked out of 21 you can only say it is likely no more than 0.4. The guarantee is still there, only weaker.

**How much data is needed.** Require $2M\exp(-2\epsilon^2 N) \le \delta$ and rearrange as before:

$$
N \ \ge\ \frac{1}{2\epsilon^2}\ln\frac{2M}{\delta}
$$

$M$ sits inside the logarithm. With $\epsilon = 0.1$ and $\delta = 0.05$: $M = 1$ needs 185 examples, $M = 100$ needs 415, and $M = 10^6$ needs 876. Ten thousand times as many hypotheses takes only about twice as much data. That is the good news for finitely many hypotheses.

**Back to the world of eight inputs.** Page 4 of the handout puts all 256 functions into $\mathcal{H}$, with $N = 5$. With $\epsilon = 0.3$ the bound is $2 \times 256 \times \exp(-0.9) \approx 208$, far above 1 and no guarantee at all. Here the truth can also be computed directly: whichever 5 examples are drawn, they cover at most 5 distinct inputs, and at least 3 are never drawn. Among the 256 functions there is always one that agrees with $f$ on every drawn input and disagrees on every undrawn one, with $E_{\text{in}} = 0$ and $E_{\text{out}} \ge 3/8 = 0.375 > 0.3$. So every possible $\mathcal{D}$ is BAD, and $\mathbb{P}_{\mathcal{D}}[\text{BAD } \mathcal{D}] = 1$.

This connects the No Free Lunch section to the three sections on probability that follow it. Retold in the language of probability, the No Free Lunch example is the case where $M$ is too large and $N$ too small, so the union bound exceeds 1. Conversely, if the candidates are restricted in advance to 2 hypotheses and there are $N = 50$ independently drawn examples, the same $\epsilon = 0.3$ gives $2 \times 2 \times \exp(-9) \approx 0.0005$. The condition for learning to be feasible is that the candidates cannot be too many and the data must be plentiful, the two tied together by the expression $2M\exp(-2\epsilon^2 N)$.

### The condition for feasibility, and what remains unsolved

Page 24 writes the conclusion as The 'Statistical' Learning Flow:

- If $\lvert\mathcal{H}\rvert = M$ is finite and $N$ is large enough, then for whatever $g$ picked by $\mathcal{A}$, $E_{\text{out}}(g) \approx E_{\text{in}}(g)$.
- If $\mathcal{A}$ finds one $g$ with $E_{\text{in}}(g) \approx 0$, there is a PAC guarantee for $E_{\text{out}}(g) \approx 0$, and learning is possible.

Compared with Foundations Lecture 1, Lin says in the lecture, the flow diagram has only two more lines, both starting from the unknown $P$: one generates $\mathbf{x}_1, \dots, \mathbf{x}_N$ of the training examples, and one generates the $\mathbf{x}$ used to test $g \approx f$.

The lower right of the diagram leaves a question: what about $M = \infty$ (like perceptrons)? There are infinitely many lines in the plane, and $2M\exp(-2\epsilon^2 N)$ becomes infinite outright. In the lecture, Lin voices the students' objection for them: after all this, $\mathcal{H}$ still has to be finite, so isn't it all just talk? The reply is that it is indeed not fully solved yet, but the finite case is a very good starting point; the infinite case is somewhat difficult and will take roughly the next two to three class sessions.

The summary on page 26 reduces each of the four sections to one line, and the order is the argument of this lecture:

1. Learning is Impossible?: absolutely no free lunch outside $\mathcal{D}$.
2. Probability to the Rescue: probably approximately correct outside $\mathcal{D}$.
3. Connection to Learning: verification possible if $E_{\text{in}}(h)$ small for fixed $h$.
4. Connection to Real Learning: learning possible if $\lvert\mathcal{H}\rvert$ finite and $E_{\text{in}}(g)$ small.

### Fun Time: BAD data of four hypotheses

**Question (page 25):** Consider 4 hypotheses:

$$
h_1(\mathbf{x}) = \text{sign}(x_1), \quad h_2(\mathbf{x}) = \text{sign}(x_2), \quad h_3(\mathbf{x}) = \text{sign}(-x_1), \quad h_4(\mathbf{x}) = \text{sign}(-x_2)
$$

For any $N$ and $\epsilon$, which of the following statements is "not" true?

1. the BAD data of $h_1$ and the BAD data of $h_2$ are exactly the same
2. the BAD data of $h_1$ and the BAD data of $h_3$ are exactly the same
3. $\mathbb{P}_{\mathcal{D}}[\text{BAD for some } h_k] \le 8\exp(-2\epsilon^2 N)$
4. $\mathbb{P}_{\mathcal{D}}[\text{BAD for some } h_k] \le 4\exp(-2\epsilon^2 N)$

**Answer: 1.** The handout's solution is two sentences: the important thing is to note that option 2 is true, which implies that option 4 is true if you revisit the union bound; similar ideas will be used to conquer the $M = \infty$ case.

**Why option 2 is true.** $h_3 = -h_1$, so the two give opposite answers at every point. Where $h_1$ is right $h_3$ is wrong and vice versa, so

$$
E_{\text{in}}(h_3) = 1 - E_{\text{in}}(h_1), \qquad E_{\text{out}}(h_3) = 1 - E_{\text{out}}(h_1)
$$

Subtracting gives $E_{\text{in}}(h_3) - E_{\text{out}}(h_3) = -\big(E_{\text{in}}(h_1) - E_{\text{out}}(h_1)\big)$, with the same absolute value. A data set that is BAD for $h_1$ is BAD for $h_3$ as well. This is Lin's explanation in the lecture: multiply a hypothesis by a minus sign and both $E_{\text{in}}$ and $E_{\text{out}}$ flip relative to it, so they stay equally far apart. (At points where $x_1$ is exactly 0 both are $\text{sign}(0)$; that case is not discussed here.)

**Option 3 is true.** It is just $M = 4$ plugged into $2M\exp(-2\epsilon^2 N)$.

**Option 4 is true as well.** By the same argument $h_2$ and $h_4$ have the same BAD data. The four events are really only two distinct events, the first line of the derivation becomes "BAD for $h_1$ or BAD for $h_2$", and the union bound needs only two terms: $2 \times 2\exp(-2\epsilon^2 N) = 4\exp(-2\epsilon^2 N)$.

**Why option 1 is not true.** $h_1$ looks at the first coordinate and $h_2$ at the second; they are wrong at different points, and there is no reason for them to go wrong on the same data. Here is a counterexample made up for this article, not from the slides, that can be worked by hand. $P$ is the uniform distribution on the four points $(+1,+1)$, $(+1,-1)$, $(-1,+1)$, $(-1,-1)$, and $f$ is $+1$ on the first three points and $-1$ on $(-1,-1)$. Then $h_1$ is wrong only at $(-1,+1)$, $h_2$ is wrong only at $(+1,-1)$, and both have $E_{\text{out}}$ equal to $1/4$. Take $N = 2$ and $\epsilon = 0.3$, drawing two points in order for 16 equally likely data sets. $E_{\text{in}}$ can only be 0, $1/2$, or 1. For $h_1$ and $h_2$, the only value more than 0.3 away from $E_{\text{out}} = 1/4$ is $E_{\text{in}} = 1$, which means both draws hit the point where the hypothesis is wrong. $h_3$ and $h_4$ have $E_{\text{out}}$ equal to $3/4$, and the only value more than 0.3 away is $E_{\text{in}} = 0$, which means both draws hit the single point where the hypothesis is right: for $h_3$ that point is $(-1,+1)$, and for $h_4$ it is $(+1,-1)$.

| Hypothesis | BAD data sets | Probability |
|---|---|---|
| $h_1$ | both draws are $(-1,+1)$ | $1/16$ |
| $h_2$ | both draws are $(+1,-1)$ | $1/16$ |
| $h_3$ | both draws are $(-1,+1)$ | $1/16$ |
| $h_4$ | both draws are $(+1,-1)$ | $1/16$ |

The BAD data of $h_1$ and of $h_2$ are two different data sets, so option 1 is not true; those of $h_1$ and $h_3$ are the same data set, so option 2 is true. The probability that at least one hypothesis goes wrong is $2/16$, while adding the four rows directly gives $4/16$; the excess is exactly the overlap counted twice. The $N$ in this example is too small and the Hoeffding number itself exceeds 1; the example only serves to show how the sets relate.

In the lecture, Lin says this question is slightly harder and is there to get everyone thinking about BAD events overlapping; the next lecture uses this property to discuss the case of infinitely many lines.

## Self-check

**1. A hypothesis fixed in advance measures $E_{\text{in}} = 0.08$ on $N = 500$ independently drawn examples. With $\epsilon = 0.05$, what is the Hoeffding bound? If this hypothesis was the one with the lowest $E_{\text{in}}$ among 20 candidates, what does the bound become? How many examples are needed for the probability of the bad event to be at most 0.05 with 20 candidates and $\epsilon = 0.05$?**

Answer: for one hypothesis, $2\exp(-2 \times 0.0025 \times 500) = 2\exp(-2.5) \approx 0.164$, so with 83.6% confidence $E_{\text{out}}$ lies between 0.03 and 0.13. With 20 candidates, multiply by 20 to get 3.28, which exceeds 1 and guarantees nothing. $N \ge \ln(2 \times 20 / 0.05) / (2 \times 0.0025) = \ln 800 / 0.005 \approx 1336.9$, so 1,337 examples are needed.

**2. Explain in your own words: why can Hoeffding's inequality not be applied directly to the $g$ that PLA finds?**

Criteria: the answer should mention three things. First, painting marbles orange or green requires a fixed $h$ beforehand, and the bin belongs to that $h$ alone. Second, $g$ is decided after looking at the data, and a different data set gives a different $g$, so it is not a hypothesis fixed in advance. Third, the remedy is to require every candidate in $\mathcal{H}$ to be safe at once, paying a factor of $M$ through the union bound. Answering only "because $g$ is not fixed" without saying why being fixed matters is not complete.

**3. In a class of 60, everyone flips a fair coin 6 times. What is the probability that at least one person gets heads all 6 times? What upper bound does the union bound give?**

Answer: one person gets all heads with probability $1/64$. The probability that at least one person gets all heads is $1 - (63/64)^{60} \approx 0.611$. The union bound gives $60 \times 1/64 = 0.9375$. The bound is indeed larger than the exact value, and the gap comes from double counting the cases where two or more people get all heads at once.

**4. $\mathcal{X} = \{0,1\}^4$, and the data $\mathcal{D}$ give the answers for 10 distinct inputs, without noise. How many target functions are fully consistent with $\mathcal{D}$? For some $g$ that is correct on all of $\mathcal{D}$, how many of the inputs outside $\mathcal{D}$ does it get right on average (averaging over all consistent target functions)?**

Answer: $\mathcal{X}$ has $2^4 = 16$ inputs, 6 remain outside $\mathcal{D}$, and each has 2 possible answers, so there are $2^6 = 64$ consistent target functions. For each unseen input, exactly half of the 64 functions say ○ and half say ×, so whatever $g$ guesses it matches only half of them, and on average it gets $6 \times 1/2 = 3$ right, the same as random guessing.

**5. A hypothesis set has 100 hypotheses that form exactly 50 pairs of "$h$ and $-h$". Can the bound on $\mathbb{P}_{\mathcal{D}}[\text{BAD } \mathcal{D}]$ be written smaller than $200\exp(-2\epsilon^2 N)$?**

Answer: yes. $h$ and $-h$ have exactly the same BAD data, so the 100 events contain only 50 distinct events, the union bound needs only 50 terms, and the bound is $2 \times 50 \times \exp(-2\epsilon^2 N) = 100\exp(-2\epsilon^2 N)$. Criteria: the answer should say that when BAD events overlap, adding them directly double counts.

## Exercises and corresponding reading

**Check the numbers yourself.** Every number in this lecture can be recomputed with the Python standard library, with no packages to install. The snippet below computes the exact values first and then compares against a simulation:

```python
import random
from math import comb, exp

# Fun Time: mu = 0.4, draw 10 marbles, nu <= 0.1
exact = sum(comb(10, k) * 0.4**k * 0.6**(10 - k) for k in (0, 1))
bound = 2 * exp(-2 * 0.3**2 * 10)
print(f"exact {exact:.4f}  Hoeffding bound {bound:.4f}")

# Coin flipping: 150 people flip 5 times each, at least one gets all heads
print(f"exact {1 - (31 / 32) ** 150:.4f}")
random.seed(0)
trials = 10_000
hits = sum(
    any(all(random.random() < 0.5 for _ in range(5)) for _ in range(150))
    for _ in range(trials)
)
print(f"simulated {hits / trials:.4f}")
```

The first two lines of output should be `exact 0.0464  Hoeffding bound 0.3306` and `exact 0.9915`, and the simulated value will land near 0.99. You can then change the $N$ in the marble part to 100 and 1,000 and watch how the gap between the exact value and the bound changes.

**How the two semesters line up.** The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) lists this lecture among the required pre-class viewing for W3, with the textbook section given as [Learning from Data](http://amlbook.com) (LFD) 1.3. Both the Fall 2026 and Fall 2024 course pages list a further reading next to this lecture: Wolpert's [The Lack of A Priori Distinctions Between Learning Algorithms](https://direct.mit.edu/neco/article-abstract/8/7/1341/6016/The-Lack-of-A-Priori-Distinctions-Between-Learning) (Neural Computation, 1996), the original No Free Lunch paper. The above was checked on 2026-09-30.

**What the Fall 2026 extended slides ([04e](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/04e_handout.pdf)) add.** Three things are not in the MOOC handout:

- Another demonstration of No Free Lunch with the sequence 1, 4, 1, 5: the same first four terms can be continued by three different recurrences into three different next terms, and the slide's phrase is any number can be the next.
- A rough one-sentence statement of Wolpert's 1996 No Free Lunch theorem: with no assumption about the learning problem, all learning algorithms perform the same.
- The last page draws the $M$ hypotheses as $M$ bins sharing the same $\mathbf{x}_1, \dots, \mathbf{x}_N$ and stresses that this is dependent sampling: the hypotheses' BAD events are correlated rather than independent like the coin flips, so they are hard to analyze directly, and the union bound is the conservative approach.

**Homework.** Both sets are public, have no official solutions, and are graded only for enrolled students.

The "Feasibility of Learning" part of [Fall 2026 hw1](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf) (due 10/21):

- **Q6**: off-training-set error. Pick any 3 points of a 6-point universe as $\mathcal{D}$, reach $E_{\text{in}} = 0$ with a perceptron, and ask for the smallest and largest error rate outside $\mathcal{D}$. This is a direct drill on the No Free Lunch table.
- **Q7**: estimate $\pi$ by Monte Carlo dart throwing; how many darts are needed for the probability that the error is within $10^{-2}$ to exceed 0.999? The method is to solve Hoeffding in reverse for $N$.
- **Q8–9**: compute $E_{\text{out}}$ of two hypotheses on $[-1, +1]^2$, then the probability that their $E_{\text{in}}$ are equal when 4 points are drawn. The problem notes that this is BAD data that cannot tell which hypothesis is worse.
- **Q10**: multiple-bin sampling with dice in place of marbles. Each number is a hypothesis and each die is an example; the question is the probability that "some number is all green" when 5 dice are drawn.

[Fall 2024 HW2](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf) covers Lectures 4 through 7; the problems that practice this lecture are:

- **Q2**: 16 bags of cards, half black and half white, with 5 cards drawn from each; the probability that at least one hand is all white. This is the independent version of coin flipping.
- **Q5**: critique ChatGPT's answer to "given that the first $N - 1$ terms come from some polynomial of degree $N$, can the next term be predicted?", which practices the No Free Lunch argument.
- **Q6–7**: a multiple-bin game with four kinds of lottery tickets; the problem hints that each number be seen as a hypothesis and the drawn tickets as the data, and states that Q6 must take dependent sampling into account.
- **Q8**: $M$ slot machines; starting from one-sided Hoeffding, prove that the upper confidence bounds of all machines at all time steps hold simultaneously with probability at least $1 - \delta$. The problem hints that this is the core technique of the upper-confidence bound algorithm for the multi-armed bandit, and what it uses is exactly this lecture's union bound.

Without solutions, the most direct self-check for a probability problem is simulation: simulate the number first, then go back and check the derivation. The guide to the whole homework set is in the [Foundations homework guide](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en).

**Further reading.** [Caltech Learning from Data](https://work.caltech.edu/telecourse) is the English-language course for the same textbook; Lecture 2: Is Learning Feasible? corresponds to this lecture. The [Stanford CS229 guide](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en) presents learning theory in a different way.

**Next lecture.** [Foundations Lecture 5: Training versus Testing](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en) starts from the observation in the last Fun Time question: the BAD data of many hypotheses overlap, and the union bound counts them more than once. Once the overlap is accounted for, an infinite $M$ has a chance of being replaced by a finite number.

## Course video sources

Original videos: [Learning is Impossible?](https://www.youtube.com/watch?v=tOgbh5_747w), [Probability to the Rescue](https://www.youtube.com/watch?v=MgAihqFPkZc), [Connection to Learning](https://www.youtube.com/watch?v=iXbbfjJNfwU), [Connection to Real Learning](https://www.youtube.com/watch?v=MFL6xDn1lXM)

- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf) (in Mandarin)
- [Official course and recordings portal](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; the videos have no caption tracks on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-13: The whole series was changed to one article per lecture. This article already covered only Lecture 4; this time it was rewritten from the handout and the video transcripts, adding the derivations of the four sections, explanations of the four Fun Time questions, and numerical examples.
- 2026-10-10: Marked the video status and checked the recording sources and how they were obtained.
- 2026-10-10: Rechecked the video status. The embedded videos match the lecture numbers in the official playlist.

## References

- [Foundations Lecture 4 handout 04_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/04_handout.pdf): the main source for this article; the content of the four sections, the tables, the four Fun Time questions, and all formulas come from this handout.
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official portal for handouts and recordings.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the W3 required pre-class viewing list, the LFD section, and further reading.
- [Fall 2026 extended slides 04e_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/04e_handout.pdf): the example with the sequence 1, 4, 1, 5, the one-sentence version of the No Free Lunch theorem, and the explanation of dependent sampling.
- [Fall 2026 Homework 1 (hw1.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf): the content of Q6–10.
- [Fall 2024 Homework 2 (hw2_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf): the content of Q2 and Q5–8.
- [Wolpert (1996), The Lack of A Priori Distinctions Between Learning Algorithms](https://direct.mit.edu/neco/article-abstract/8/7/1341/6016/The-Lack-of-A-Priori-Distinctions-Between-Learning): the No Free Lunch further reading listed on the course pages.
- [Learning from Data textbook site](http://amlbook.com): the source for LFD 1.3.
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse): further reading; Lecture 2: Is Learning Feasible? corresponds to this lecture.
- [Stanford CS229 guide](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): further reading, an article on this site.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course, and the reading routes.
