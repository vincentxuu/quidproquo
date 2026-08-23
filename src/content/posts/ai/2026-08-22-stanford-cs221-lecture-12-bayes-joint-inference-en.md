---
title: "CS221 Lecture 12: Bayesian Networks I: From Joint Distributions to Factorization"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: en
series:
  name: "Reading Stanford CS221"
  order: 13
tldr: "Lecture 12 builds a joint distribution from random variables and factors, then uses Bayesian-network factorization to express conditional independence and make conditioning and marginalization executable."
description: "A lecture-by-lecture reading of Stanford CS221 Autumn 2025 Lecture 12: official agenda, core development, implementation connection, and material gaps."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs221-lecture-12-bayes-joint-inference)

This article covers **Stanford CS221, Autumn 2025, Lecture 12**, taught by Percy Liang on 2025-10-29. The [official course site](https://stanford-cs221.github.io/autumn2025/) fixes the offering and assignments; the primary artifact is [bayes](https://stanford-cs221.github.io/autumn2025-lectures/?trace=bayes).

> Material gap: Official lecture material and video are public; Canvas interactions, assignment solutions, and hidden tests are unavailable.

## TL;DR: what this lecture actually builds

The source file does not begin with a mysterious Bayesian-network diagram. It begins with a question: how can a program represent a world, answer a probability query, and then generate samples from the same model? The lecture follows three operations:

1. Represent a state with random variables and assign every complete assignment a probability in a joint distribution.
2. Marginalize variables that are neither query nor evidence; select evidence, compute its probability, and normalize.
3. Use a directed acyclic graph and one local conditional distribution per node to factor the joint, then ask `P(query | evidence)`.

The final section changes the representation again. A probabilistic program generates samples from a joint distribution, and rejection sampling estimates a conditional distribution from those samples. The source does not implement enumeration or variable elimination, so those algorithms are not part of this lecture note.

## 1. Why model-based methods

The opening returns to the ingredients of intelligence: perceive, reason, act, and learn. Earlier machine learning was summarized as a predictor from percepts to actions. Recent state-based topics add search problems with deterministic action outcomes, MDPs with stochastic outcomes, and games with an adversary or an unknown opponent strategy.

The contrast is model-free versus model-based methods. Classification, regression, SARSA, Q-learning, and TD learning are model-free examples: we may know which actions to take and how much utility they produce without explicitly representing how the world works. Search, value iteration for MDPs, and minimax for games are model-based examples.

Model-free methods are more direct and cheaper. Model-based methods are more flexible: if the transition model stays fixed, the reward function can change without changing the transitions. That leads to the lecture's first representation question: how should the state of the world be represented? The answer here is a collection of variables and a probability distribution.

## 2. Random variables and the joint distribution

Start with two binary random variables: sunshine `S ∈ {0, 1}` and rain `R ∈ {0, 1}`. A possible world state is an assignment to both variables:

| `S` | `R` | assignment |
| ---: | ---: | --- |
| 0 | 0 | no sunshine and no rain |
| 0 | 1 | no sunshine and rain |
| 1 | 0 | sunshine and no rain |
| 1 | 1 | sunshine and rain |

The joint distribution assigns a probability to each complete assignment:

~~~text
P(S = 0, R = 0) = 0.20
P(S = 0, R = 1) = 0.08
P(S = 1, R = 0) = 0.70
P(S = 1, R = 1) = 0.02
~~~

This joint distribution is the source of truth. Marginals and conditionals are derived from it rather than independently guessed.

### Marginalization

If the query concerns only `S`, marginalize `R` by adding assignments that differ only in `R`:

~~~text
P(S = 0) = P(S = 0, R = 0) + P(S = 0, R = 1)
         = 0.20 + 0.08 = 0.28
P(S = 1) = P(S = 1, R = 0) + P(S = 1, R = 1)
         = 0.70 + 0.02 = 0.72
~~~

The source represents probability tables as tensors. If `P_SR` has axes `S × R`, then:

~~~python
P_S = ProbTable("S", einsum(P_SR.p, "s r -> s"))
~~~

The `einsum` labels say exactly what the operation does: preserve `s` and sum over `r`.

### Conditioning

Suppose the evidence is `R = 1`. First select the entries compatible with the evidence:

~~~text
P(S = 0, R = 1) = 0.08
P(S = 1, R = 1) = 0.02
~~~

Those values are not yet the normalized distribution `P(S | R = 1)`. Compute the evidence probability, then divide:

~~~text
P(R = 1) = 0.08 + 0.02 = 0.1
P(S = 0 | R = 1) = 0.08 / 0.1 = 0.8
P(S = 1 | R = 1) = 0.02 / 0.1 = 0.2
~~~

The implementation uses `R1 = np.array([0, 1])` as a selector:

~~~python
P_SR1 = einsum(P_SR.p, R1, "s r, r -> s")
P_R1 = einsum(P_SR1.p, "s ->")
P_S_given_R1 = P_SR1.p / P_R1.p
~~~

Selection, summation, and division are separate mechanics. Treating the selected but unnormalized values as a conditional distribution would be wrong.

## 3. The inference query

Add traffic `T` and autumn `A`. The source writes the joint as `P(S, R, T, A)` and asks for the probability of rain given traffic and autumn:

~~~text
query    = R
evidence = [T = 1, A = 1]
answer   = P(R | T = 1, A = 1)
~~~

This resembles a SQL query over a database. Evidence filters assignments, the query variables remain, and every other variable—`S` in this example—is marginalized out. Probabilistic inference therefore needs a joint distribution or an equivalent representation that can support these operations; it is not merely a classifier mapping one input to one label.

## 4. Alarm: constructing and querying a joint

The first complete example uses burglary `B`, earthquake `E`, and alarm `A`. Burglary and earthquake are independent rare events, each with probability `ε = 0.05`; either event makes the alarm go off. The questions are:

~~~text
P(B = 1 | A = 1)
P(B = 1 | A = 1, E = 1)
~~~

The construction has four steps: define variables; connect them with directed edges `B → A` and `E → A`; define local conditional probabilities; multiply those local distributions into a joint distribution.

The priors are represented as tables:

~~~python
p_b = ProbTable("B", [1 - epsilon, epsilon])
p_e = ProbTable("E", [1 - epsilon, epsilon])
p_a_given_be = ProbTable(
    "A | B E",
    lambda b, e, a: a == (b or e),
    shape=(2, 2, 2),
)
~~~

The lambda says that `A` is 1 exactly when burglary or earthquake is 1. The shared tensor labels then implement:

~~~text
P(B = b, E = e, A = a) = p(b) p(e) p(a | b, e)
~~~

~~~python
P_BEA = einsum(p_b.p, p_e.p, p_a_given_be.p,
               "b, e, b e a -> b e a")
~~~

Lowercase `p` denotes a local conditional probability; uppercase `P` denotes a marginal or conditional derived from the joint. Lowercase `e` is a value, while uppercase `E` is a random variable. `ProbTable` accepts either a tensor or a function from assignments to probabilities. For a function, its constructor enumerates assignments according to the supplied shape and builds a tensor. It parses descriptions such as `"B A=1"` and `"B | A=1 E=1"`, separates generated variables, conditioning variables, and fixed values, and asserts that the number of variables matches the tensor rank.

First query the burglary marginal:

~~~python
P_B = einsum(P_BEA.p, "b e a -> b")
~~~

The `e` and `a` axes disappear, leaving the local low burglary prior. For `P(B = 1 | A = 1)`, select `A = 1`, sum to obtain the evidence probability, and divide:

~~~python
P_BA1 = einsum(P_BEA.p, a1, "b e a, a -> b")
P_A1 = einsum(P_BA1.p, "b ->")
P_B_given_A1 = P_BA1.p / P_A1.p
~~~

For `P(B = 1 | A = 1, E = 1)`, select both evidence axes:

~~~python
P_BA1E1 = einsum(P_BEA.p, a1, e1, "b e a, a, e -> b")
P_A1E1 = einsum(P_BA1E1.p, "b ->")
P_B_given_A1E1 = P_BA1E1.p / P_A1E1.p
~~~

The source emphasizes the direction rather than printing an additional numeric table: hearing an alarm makes burglary much more likely; knowing that an earthquake also occurred makes burglary unlikely again, because the earthquake explains the alarm. This is **explaining away**. Two causes positively influence one effect. Conditioning on the effect and then on one cause reduces the probability of the other cause:

`P(B = 1 | A = 1, E = 1) < P(B = 1 | A = 1)`.

The causes can be independent before conditioning and still become related after conditioning on their common effect.

## 5. Medical diagnosis

The second example asks: you are coughing and have itchy eyes; do you have a cold? The binary variables are cold `C`, allergies `A`, cough `H`, and itchy eyes `I`. Cold and allergies both influence cough; allergies influence itchy eyes.

~~~python
p_c = ProbTable("C", [0.9, 0.1])
p_a = ProbTable("A", [0.8, 0.2])
p_h_given_ca = ProbTable(
    "H | C A",
    lambda c, a, h: 0.9 if h == (c or a) else 0.1,
    shape=(2, 2, 2),
)
p_i_given_a = ProbTable(
    "I | A",
    lambda a, i: 0.9 if i == a else 0.1,
    shape=(2, 2),
)
P_CAHI = einsum(p_c.p, p_a.p, p_h_given_ca.p, p_i_given_a.p,
                "c, a, c a h, a i -> c a h i")
~~~

For `P(C = 1 | H = 1)`, `A` and `I` are neither query nor evidence, so they are marginalized while selecting `H = 1`:

~~~python
h1 = np.array([0, 1])
P_CH1 = einsum(P_CAHI.p, h1, "c a h i, h -> c")
P_H1 = einsum(P_CH1.p, "c ->")
P_C_given_H1 = P_CH1.p / P_H1.p
~~~

For `P(C = 1 | H = 1, I = 1)`, select both observations and keep only `C`:

~~~python
P_CH1I1 = einsum(P_CAHI.p, h1, i1, "c a h i, h, i -> c")
P_H1I1 = einsum(P_CH1I1.p, "c ->")
P_C_given_H1I1 = P_CH1I1.p / P_H1I1.p
~~~

The source asserts that the cold posterior is lower after adding itchy eyes. It is another explaining-away pattern: itchy eyes are not a cause of cough, but they increase the probability of allergies, and allergies are a competing cause of cough. More generally, evidence can propagate through the network and increase or decrease the probability of other nodes.

## 6. The general Bayesian-network contract

The two examples become four steps:

1. Define random variables `X = (X_1, ..., X_n)`.
2. Define a directed acyclic graph over those variables.
3. For each node `X_i`, define `p(x_i | parents(x_i))`.
4. Define the joint as `P(X_1, ..., X_n) = Π_i p(x_i | parents(x_i))`.

There is one local conditional distribution per node, not one per edge. Each local distribution depends on all of that node's parents at once. This factorization can make a huge joint more compact to represent, but compact representation does not guarantee cheap inference.

The source directly uses a full tensor and `einsum` for marginalization and conditioning. It does not show enumeration or variable elimination, and it does not introduce a separate factor-graph algorithm. Here, “factor” means the local conditional tables and their tensor product. Given a Bayesian network, evidence `E = e`, and query variables `Q`, the requested output is `P(Q | E = e)`.

## 7. Autoregressive language models

The source points out that many systems are secretly Bayesian networks. For an autoregressive language model, the variables are tokens `X_1, ..., X_T`; every token points from all previous tokens to the current token; a Transformer supplies `p(x_t | x_1, ..., x_{t-1})`; and:

~~~text
P(X_1, ..., X_T) = Π_t p(x_t | x_1, ..., x_{t-1})
~~~

Normal use is forward sampling: prompt tokens `X_1, X_2, X_3` produce `X_4, X_5, X_6`. A reverse query starts with a response and asks which prompts likely generated it: infer `X_1, X_2, X_3` from `X_4, X_5, X_6`. The source links this direction to a jailbreaking-language-models application and an [arXiv paper](https://arxiv.org/abs/2502.01236); this note does not add claims beyond that source reference.

## 8. Probabilistic programs

The lecture now represents the same kind of model with code. `Bernoulli(prob)` returns 1 with probability `prob`, and 0 otherwise:

~~~python
def alarm():
    B = Bernoulli(0.05)
    E = Bernoulli(0.05)
    A = B or E
    return {"B": B, "E": E, "A": A}
~~~

Each call generates one sample from the joint distribution. The medical-diagnosis program samples cold and allergies first, then chooses the cough probability from `C or A`, and chooses the itchy-eyes probability from `A`. Dependencies are now expressed through execution and conditional parameters instead of a pre-listed full tensor.

## 9. Rejection sampling

To approximate `P(B | A = 1)`, the source draws many samples, keeps only samples satisfying the evidence, records the query value, and normalizes counts:

~~~python
def rejection_sampling(program, query, evidence, num_samples):
    counts = defaultdict(int)
    for _ in range(num_samples):
        sample = program()
        if evidence(sample):
            counts[query(sample)] += 1
    total_count = sum(counts.values())
    return {q: counts[q] / total_count for q in counts}
~~~

For the alarm example, `query = lambda sample: sample["B"]` and `evidence = lambda sample: sample["A"] == 1`. The source compares 10 and 1,000 samples, and uses 200 samples for medical diagnosis. As the number of samples tends to infinity, the estimate converges to the true probability. The practical limit is equally explicit: if the evidence is rare, most samples are rejected, so this is very inefficient.

The same interface handles a simple hidden Markov model. Over five time steps, the hidden position `H[t]` is the previous position plus `Bernoulli(0.5)`; the sensor value `E[t]` is the position plus another `Bernoulli(0.5)`. The query is `P(H_3 | E_5 = 2)`. The source does not add a separate exact HMM algorithm; it sends this program to the same rejection sampler.

## 10. Assumptions, mechanics, and limits

A Bayesian network requires a chosen variable set, DAG, and local conditional distribution for every node. These are modeling assumptions, not the world itself. Independence of burglary and earthquake, the alarm rule, and the medical Bernoulli probabilities are settings of the examples. Exact tensor arithmetic can still compute the wrong model exactly if those assumptions are wrong.

There is also a distinction between representation cost and inference cost. Factorization may reduce how much structure must be written down, but this source only demonstrates full-tensor `einsum` operations. It does not claim that every large network makes every query cheap. Rejection sampling adds a separate approximation limit: a clean probabilistic program does not remove the waste caused by rare evidence.

This is why Bayesian networks require a mindset shift from ordinary classifiers. A classifier is often written input → output. The medical example instead infers hidden cold and allergy variables from observed cough and itchy eyes. The source lists advantages: heterogeneous missing information at training and test time, prior knowledge such as Mendelian inheritance or laws of physics, interpretable intermediate variables, and a precursor relationship to causal models that can support interventions and counterfactuals. These are stated advantages of the representation, not causal-inference APIs implemented in this file.

## 11. Closing the lecture

Starting with `P(S, R)`, conditioning is not just “apply Bayes.” Select compatible assignments, compute the probability of the evidence, and normalize. Treating tables as tensors makes `einsum` labels expose which axes are retained, aligned, or summed out. Bayesian networks then use a DAG and local conditional tables to define a joint; alarm shows explaining away; medical diagnosis shows how evidence can travel through another cause.

Autoregressive language models connect the same factorization to token sequences. Probabilistic programs express the joint through sampling code. Rejection sampling estimates `P(query | evidence)` by filtering and counting, with flexibility but poor efficiency for rare evidence. The usable contract is to write down variables, evidence, query, local assumptions, normalization, and both representation and inference costs before trusting the answer. The source closes by pointing to better probabilistic inference next time.

## References

- [CS221 Autumn 2025 course site](https://stanford-cs221.github.io/autumn2025/)
- [Official lecture artifact: bayes](https://stanford-cs221.github.io/autumn2025-lectures/?trace=bayes)
- [CS221 Autumn 2025 executable lecture repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Official Stanford Online CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
