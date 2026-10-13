---
title: "Word Vectors, Language Models, and RNNs: How to Represent a Word and Predict the Next One | NTU Yun-Nung Chen Applied Deep Learning Lecture 3"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, nlp, language-model, rnn]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning"
  order: 3
tldr: "This lecture has one through-line: a language model estimates the probability of a word sequence by predicting the next word one step at a time. It first covers how to represent a word, from dictionaries, one-hot vectors, and co-occurrence matrices to low-dimensional word embeddings. It then covers three generations of language models: n-grams count, and unseen combinations get zero probability; a neural LM predicts with a network, and similar words share probability automatically; an RNN LM accumulates all previous words in a hidden state and shares one set of weights across time steps. RNNs are trained with BPTT, multiplying by the same matrix many times makes gradients vanish or explode, clipping handles explosion, and the gating in LSTM and GRU handles vanishing. Finally, applications are divided by the shape of input and output into whole-sequence classification, tagging, and encoder-decoder."
description: "A guide to Lecture 3 of Yun-Nung Chen's NTU Applied Deep Learning, Fall 2025, based on the Sequence Modeling deck and the spoken content of videos 3.1–3.4: the limits of WordNet and one-hot vectors, co-occurrence matrices and SVD, the idea behind word2vec and GloVe, n-grams and smoothing, the Bengio 2003 neural LM, RNN LMs and weight sharing, BPTT, vanishing and exploding gradients, clipping, LSTM/GRU, bidirectional RNNs, and applications such as sentiment analysis, POS tagging, slot tagging, and machine translation. Includes four examples you can work by hand and a self-check."
draft: false
glossary:
  - term: "RNN LM"
    aliases: ["RNNLM", "recurrent neural network language model"]
    definition: "A language model that uses a recurrent neural network to predict the next word. At each time step it combines the current word vector with the previous hidden state, and every step shares the same weights, so in principle it can use the whole history without the model growing with sentence length."
    context: "ADL Sequence Modeling deck, slides 25–26, introduced after n-gram and feed-forward neural LMs to remove the fixed context window."
  - term: "BPTT"
    aliases: ["backpropagation through time"]
    definition: "Unroll an RNN along the time axis into one deep network and run ordinary backpropagation on it. Because every time step shares weights, gradients from all steps accumulate on the same parameters."
    context: "Slides 36–41 of the ADL Sequence Modeling deck walk through the unrolling and the forward and backward passes."
  - term: "co-occurrence matrix"
    definition: "A matrix recording how many times each pair of words are neighbors in a corpus. A word's row (or column) is its vector, and words with similar neighbors get similar vectors."
    context: "ADL Sequence Modeling deck, slides 9–10, demonstrated on a three-sentence corpus."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn)

**Video status: Videos included.** [Source details](#course-video-sources)

This is Lecture 3 in [Reading NTU Yun-Nung Chen Applied Deep Learning](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en), based on the materials for 9/01, the first week of ADL Fall 2025 (114-1, 2025/09/01–12/15). [Lecture 1](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction-en) and [Lecture 2](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop-en) are prerequisites to study before enrolling, and this is the first regular lecture. It answers two questions: **in what form does a word go into a computer? And how does a model judge whether a sequence of words fits together?**

Official materials:

- The [Sequence Modeling deck](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_SeqModel.pdf) (66 slides), subtitled Language Modeling & Recurrent Neural Networks
- Videos [3.1 Word Representations](https://youtu.be/215BxEbYrCs) (22:04), [3.2 Language Modeling](https://youtu.be/eVA_WTW4gXE) (15:28), [3.3 Recurrent Neural Network](https://youtu.be/e9Ef3dZcvjw) (16:11), and [3.4 RNN Applications](https://youtu.be/MyKrovk8tLM) (12:25)
- Optional: the Fall 2022 Word Embeddings deck and older videos, in the section "To go further on word embeddings"

3.2, 3.3, and 3.4 have captions. 3.1 has none, so this guide works from a transcript made from its audio. The lectures are in Mandarin. Examples marked "made up for this post" are not from the lecture.

After reading you should be able to do five things: say what the one-hot representation lacks, and read a co-occurrence matrix and compute the similarity of two words from it; compute a sentence's probability with an n-gram model and say where the zero-probability problem comes from; explain why a neural LM needs no separate smoothing; write the computation an RNN does at each time step, and explain why gradients vanish or explode and how each is handled; and, given a task, decide whether it calls for whole-sequence classification, tagging, or encoder-decoder.

## How a word goes into a computer

### Looking it up: knowledge-based

The most direct way to learn what a word means is to look it up in a dictionary. Dictionaries are compiled by experts, so this family is called knowledge-based representation. The other family looks at how a word is used in large amounts of text and infers its meaning from context, and is called corpus-based representation (slide 4).

The standard knowledge-based resource is WordNet: a large network of a great many words that records the relations between them. Slide 6 draws a small piece of the is-a relation: a truck is a motor vehicle, so is a go-kart, and so is a motorcar; under motorcar come hatch-back, compact, and others. The slide includes a code snippet that loads WordNet through NLTK and looks up "panda," returning the chain of categories above it: procyonid, carnivore, mammal, animal, organism, and so on.

Professor Chen says this is quite convenient: one lookup tells you what a word "is a kind of." The slide lists four issues, and she goes through each:

- **Newly invented words are missing.** New words are not added in time.
- **Subjective.** How relations are defined depends entirely on the editor, and different people may produce different content.
- **Annotation effort.** It takes a great deal of annotation time.
- **Difficult to compute word similarity.** She uses distance on the graph: motor vehicle to compact is two steps, and compact to hatch-back is also two steps. But the first is an ancestor relation and the second a sibling relation. The same distance of 2 does not mean the same semantic relation.

### One-hot: one slot per word

Starting from data instead, the most basic method is one-hot. Suppose the vocabulary has thirty thousand words; prepare a thirty-thousand-dimensional vector. "car" is the seventh word in the vocabulary, so the seventh dimension is set to 1 and the rest are 0 (slide 8).

The trouble is in the linear algebra. Each dimension is an axis, and the axes are perpendicular to each other. "car" occupies one axis and "motorcycle" another, so the two vectors are perpendicular, which means unrelated. Yet car and motorcycle are plainly related, as both are motor vehicles. The slide ANDs the two vectors and gets 0. She says that whatever operation you use, this representation cannot recover the actual relation between two words, and amounts to assuming every word is independent of every other.

### Representing a word by its neighbors

The turn comes in the line at the bottom of slide 8: **words with similar meanings often have similar neighbors.** Her example is that "car" and "motor vehicle" both often have "drive" in front of them.

So a word is represented by its neighbors. How "neighbor" is defined affects what is learned (slide 9):

- **Anything in the same document is a neighbor.** The definition is broad, and what is learned leans toward topic: finance words end up near each other, and sports words near each other. This is Latent Semantic Analysis.
- **Only words within a few positions are neighbors.** The definition is narrow, and besides semantics it also learns syntactic information such as part of speech. Her explanation is that verbs are often followed by related nouns, so the nearby words are those with the same part of speech.

Slide 10 demonstrates a co-occurrence matrix with window length 1 on three sentences. The corpus is "I love AI." "I love deep learning." "I enjoy learning.", looking one word to the left and right:

| | I | love | enjoy | AI | deep | learning |
|---|---|---|---|---|---|---|
| I | 0 | 2 | 1 | 0 | 0 | 0 |
| love | 2 | 0 | 0 | 1 | 1 | 0 |
| enjoy | 1 | 0 | 0 | 0 | 0 | 1 |
| AI | 0 | 1 | 0 | 0 | 0 | 0 |
| deep | 0 | 1 | 0 | 0 | 0 | 1 |
| learning | 0 | 0 | 1 | 0 | 1 | 0 |

"I" and "love" are neighbors twice, so that cell is 2. The matrix is symmetric, so rows and columns read the same. "love" and "enjoy" both have "I" as a neighbor, so the similarity of their vectors is greater than 0.

**Example (made up for this post).** Setup: from the table above, take the rows for "love" and "enjoy" as vectors and compute cosine similarity.

- Reasoning: love = (2, 0, 0, 1, 1, 0) and enjoy = (1, 0, 0, 0, 0, 1). The dot product is 2×1 = 2. The lengths are √(4+1+1) = √6 and √(1+1) = √2. The similarity is 2 ÷ (√6 × √2) = 2 ÷ √12 ≈ 0.58.
- For comparison: with one-hot vectors, "love" and "enjoy" each occupy one dimension, the dot product is 0, and the similarity is 0.
- Result and meaning: with only three sentences, "having the same neighbor" moves the similarity of love and enjoy from 0 to 0.58. No one told the model these two words are close in meaning; it comes out of the distribution of the data.

### Making vectors shorter: SVD

The co-occurrence matrix's problems are in the lower left of slide 10: the matrix grows with the vocabulary, is high-dimensional, and is sparse. She explains why sparsity is bad: so many dimensions are spent, most are 0, the positions that carry information are few, and downstream applications struggle to get an effect out of a handful of nonzero dimensions. What we want is to compress the information into fewer dimensions.

The first method is SVD on the co-occurrence matrix (slides 11–12). SVD factors the matrix into a product of three matrices, the middle one with values only on its diagonal. Sort the diagonal values from large to small, keep only the first k, and delete the rest; the product then approximates the original matrix, losing some information, and each word can be represented by a k-dimensional vector.

Slide 12 shows the outcome. She walks through it: "dog" and "cat" are close, and "puppy" and "kitten" are close; body parts such as hand and foot form one region, animals another, and countries and place names another. With a different window definition, different forms of the same word, such as take, taken, taking, and took, also cluster. After reduction the vectors still hold the semantics we want.

The drawback is speed. The slide gives O(mn²) for an n×m matrix when n<m. She says the co-occurrence matrix is N×N, so the cost is N cubed; and every new word adds a row, so the whole SVD must be recomputed.

### Learning low-dimensional vectors directly

The second method skips the matrix and learns low-dimensional vectors directly (slide 13). The slide lists work along this line: Rumelhart et al. 1986, Bengio et al. 2003, Collobert and Weston 2008, and the later and most popular word2vec (Mikolov et al. 2013) and GloVe (Pennington et al. 2014).

In this lecture she covers only the concept: use deep learning and give the model a task, such as predicting a word's neighbors. If a vector predicts the neighbors accurately, it represents the word well. Two words that are very close in meaning have very similar neighbors to predict, so the learned vectors end up close.

Why is it called a word **embedding**? Her explanation: first fix a low-dimensional space, say 300 dimensions, then decide where in this space each word goes. The word is "embedded" directly, without first building a matrix and reducing it.

The learned vectors have some interesting properties (the three figures at the bottom of slide 13). The direction from "man" to "woman" is close to the direction from "king" to "queen"; the direction from "walking" to "walked" is close to the direction from "swimming" to "swam." So a question like "man is to woman as king is to what" can be answered by adding and subtracting in the vector space to get a position and finding the nearest word to it.

### To go further on word embeddings

How word2vec and GloVe are trained is not covered in this lecture; she says the details are in the supplementary materials. The course page lists them as optional, linking to the Fall 2022 [Word Embeddings deck](https://www.csie.ntu.edu.tw/~miulab/f111-adl/doc/220929_WordEmbeddings.pdf) (48 slides) and a set of older videos:

- [5.1 Word Representation Review](https://youtu.be/K2oYKdK--9U)
- [5.3 Word2Vec Training](https://youtu.be/4Vrd15ZwxH4)
- [5.4 Word2Vec Variants](https://youtu.be/cKor9hMjFLc)
- [5.5 GloVe](https://youtu.be/BbTSvFwuCbo)
- [5.6 Word Vector Evaluation](https://youtu.be/MnFDW20J17E)

The link labeled "Intro" on the course page (`LosffMy3BqM`) is misplaced; the video it opens is actually titled "[ADL 4: Gating Mechanism](https://youtu.be/LosffMy3BqM)" on the details of LSTM and GRU. It happens to work as a supplement to the LSTM/GRU section here.

## Language models: estimating the probability of a word sequence

With a representation for single words, the next step is many words joined together. A language model's job is: given a word sequence, estimate the probability that the words join this way, P(w₁, …, w_m) (slide 16).

She starts from intuition. You hear a foreigner say a sentence, you understand it, and it sounds oddly put together. That "oddness" is a lower probability in your own estimate, because you have rarely seen things joined that way.

The slide's example is speech recognition. One stretch of audio can be heard as "recognize speech" or as "wreck a nice beach," and the two sound almost the same. Most people hear the first, because the language model in their heads says it has higher probability. A machine cannot decide from sound alone; it has to know which way of joining words is more common in the language.

### n-grams: counting

The earliest method is the n-gram (slide 18). The probability of a sequence factors into a product of conditional probabilities: the probability of the first word, times the probability of the second word given the first, times the probability of the third given the first two, and so on. Conditioning on the entire history every time is impractical, so the rule is to look only at the previous n−1 words:

P(w₁, …, w_m) ≈ ∏ P(wᵢ | wᵢ₋₍ₙ₋₁₎, …, wᵢ₋₁)

Each conditional probability is counted directly from the training data:

P(beach | nice) = C(nice beach) ÷ C(nice)

The numerator is how many times "nice beach" appears in the data and the denominator is how many times "nice" appears. (The numerator on this slide is printed as "nice each," and she notes in class that a "b" is missing.) Compute all the n-gram probabilities in advance, and when a new sequence arrives, look them up and multiply to get the probability of the whole sequence.

The problem is that training data cannot cover every case. The example on slide 19: the training data has only "The dog ran ……" and "The cat jumped ……", so P(jumped | dog) and P(ran | cat) are both 0. Can dogs not jump and cats not run?

**Example (made up for this post).** Setup: with a bigram model (n = 2), the training data has only the two sentences "the dog ran" and "the cat jumped," and we want the probability of "the dog jumped."

- Reasoning: P(the | START) = 2/2 = 1. P(dog | the) = 1/2, since "the" is followed once by "dog" and once by "cat." P(jumped | dog) = 0/1 = 0, since "dog" has only been followed by "ran." The product is 1 × 0.5 × 0 = 0.
- The fix: following the slide, replace the 0 with a small probability 0.0001, and the result becomes 1 × 0.5 × 0.0001 = 0.00005. (This only replaces the 0 as the slide does, without renormalizing the other probabilities to sum to 1.)
- Result and meaning: one zero in the product makes the whole sentence's probability zero, however reasonable the rest is. After the small probability is added it is no longer zero, but that 0.0001 is assigned by a person and has nothing to do with whether dogs jump.

Giving unseen combinations a small probability is called smoothing. She points straight at its awkwardness: why 0.0001 and not another value? Why should P(jumped | dog) and P(ran | cat) get the same value? Many smoothing methods have been proposed, but the problem cannot be fully solved, because the root cause is that all possible text can never be collected. The slide's two conclusions are: the probability is not accurate; the reason is that it is impossible to collect all possible texts as training data. N-gram language models were used this way for a very long time.

### Neural LM: let a network predict

The breakthrough is the neural language model (slides 21–23). What is estimated has not changed: "the probability of the next word given the previous few." The difference is that it is predicted by a neural network instead of counted from data.

Taking a bigram as the example, the probability of "wreck a nice beach" factors into four terms: P(wreck | START), P(a | wreck), P(nice | a), and P(beach | nice). The same network is used four times: the input is the previous word's vector, and the output is a probability distribution over the whole vocabulary, where the first dimension is the probability that the first vocabulary word comes next, and so on. To read the probability of "wreck" coming next, look at the dimension for "wreck."

Slide 22 is the architecture of [Bengio et al. 2003](https://www.jmlr.org/papers/v3/bengio03a.html), with the formula:

ŷ = softmax( W⁽²⁾ σ(W⁽¹⁾x + b⁽¹⁾) + W⁽³⁾x + b⁽³⁾ )

She does not go through the formula in detail; she says it has three matrices to train and, put simply, can be thought of as: the input is the previous few words, there is a hidden layer in the middle, and the output is the probability distribution of the next word.

The benefit is on slide 23. The input is word vectors, and the vectors for "cat" and "dog" are close. The training data often has "cat" followed by "jump," so the network learns "given the vector of cat, jump has high probability." Replace the input with "dog," whose vector is about the same, and the predicted probability of "jump" is also high, even though "dog jumps" never appears in the data. The slide concludes: Smoothing is automatically done. In her words: it is not estimated by counting, it is predicted by a model, and as long as the initial vectors are good this property comes for free, with no need to assign a probability specially.

The remaining limit is on the same slide: the context window is still fixed.

### RNN LM: passing all the history along

The probability of the next word really depends on all the words before it, and looking at a fixed two or three is not realistic. The recurrent neural network language model (RNNLM, slides 25–26) has two ideas:

- **Use all previous words.** Gather the information from every earlier step and pass it to the next step together.
- **Share the same weights at every time step.** Using more history should not make the model larger. So only one set of weights is trained: with 10 previous words the set is used 10 times, and with 100 it is used 100 times.

The assumption behind this approach is that the data has temporal order (the slide: temporal information matters).

The figure on slide 26 looks much like the neural LM figure before it, with the same network used four times. The difference is the added blue arrows: the hidden layer at each time step passes information to the next time step. She says the neural LM uses the same model four times, and the RNN officially puts "using it four times" inside one model.

She also notes that RNNs now sound rarely used, but they are an important step on the way to the Transformer: the Transformer also wants to handle temporal information while removing some of the RNN's drawbacks.

## RNNs: definition, training, and problems

### Definition

The definition on slides 29–31 is short. At each time step t:

s_t = σ(W s_{t−1} + U x_t)

o_t = softmax(V s_t)

x_t is the vector of the current word, s_{t−1} is the hidden state from the previous time step, the two combine into the current s_t, and s_t gives the output o_t. σ can be tanh or ReLU. The whole model trains only three matrices, W, U, and V. (Slide 29 writes the hidden state as h_t and the output as ŷ_t, and slide 31 writes them as s_t and o_t; they are the same pair.)

For a language model, o_t means: after seeing x₁ through x_t, the probability that the next word is each word in the vocabulary. The earlier words are already accumulated in the hidden state, so only one word is fed in at each step.

The figure is drawn two ways: one node with an arrow looping back to itself, and one unfolded along time into a long chain. They are the same model.

### Training: BPTT

The training objective is to make the output o_t at each time step close to the correct answer y_t, the actual next word. A sentence with three words has three losses, which are added and used together to adjust W, U, and V (slide 32).

Slides 34–35 first review backpropagation from Lecture 2: the gradient of a parameter factors into two parts multiplied together, one from the forward pass and one the error signal δ of the backward pass, with δ passed backward layer by layer from the last layer.

For an RNN the same is done after unfolding along time (slides 36–40). There are two differences:

- "One layer back" in an ordinary network is "one time step back" here: the error passes from s_t to s_{t−1}, s_{t−2}, and so on. Hence backpropagation through time (BPTT).
- The weights at every time step are the same set (the slide: Weights are tied together). An ordinary network has different weights per layer; here the gradients computed at each time step all accumulate on the same matrix.

Slide 41 demonstrates with four time steps. The forward pass computes s₁ through s₄. The backward pass runs once for each of the four losses C⁽⁴⁾, C⁽³⁾, C⁽²⁾, and C⁽¹⁾, and each loss passes only to the time steps before it. Because the weights are shared, one parameter update affects every time step. She says anyone who has trained an RNN finds it takes quite long, because the time dimension is long.

### Vanishing and exploding gradients

Slide 43 states the problem: every step of backpropagation multiplies by the same matrix. The slide circles W in δˡ = σ′(zˡ) ⊙ (Wˡ⁺¹)ᵀ δˡ⁺¹ and concludes that the gradient becomes very small or very large quickly.

Her explanation: a value that is only somewhat small, such as 0.9, approaches 0 after being multiplied many times; a value somewhat large becomes very large after many multiplications.

**Example (made up for this post).** Setup: simplify that matrix to a single number and look at the result of multiplying it 50 times.

- Reasoning: 0.9⁵⁰ ≈ 0.005, and 1.1⁵⁰ ≈ 117.
- Result and meaning: 0.9 and 1.1 differ by only 0.2, and after 50 time steps one is five thousandths of the original and the other is magnified more than a hundred times. When the loss at time step 50 wants to adjust the behavior at time step 1, the signal that arrives has either nearly vanished or grown out of control.

Neither is good. Too small, and the gradient vanishes, leaving no idea which way to move the parameter. Too large, and a slight move changes all the later values, which is hard to control.

Slide 44 draws the result as an error surface: the two axes are two parameters and the height is cost. The surface is either very flat or very steep. On flat ground a step hardly lowers the cost; at a steep place one step may drop a long way or may fly up very high. Training is therefore very unstable. Slide 45 is the same thing as histograms: she says the values start out fairly even; by 50 time steps they pile up at 0 and at the ±100 ends.

### Explosion: clipping

Too large is the easier case (slide 46, Pascanu et al. 2013): above a threshold, scale down proportionally. The slide's pseudocode is: if ‖g‖ ≥ threshold, replace g with (threshold ÷ ‖g‖) × g. The dashed line on the figure is the path after clipping, which does not fly too far and can keep training. The slide notes that threshold values from half to ten times the average can still yield convergence.

**Example (made up for this post).** Setup: gradient g = (3, 4) and threshold 1.

- Reasoning: ‖g‖ = √(9 + 16) = 5, above the threshold. The new g = (1 ÷ 5) × (3, 4) = (0.6, 0.8).
- Result and meaning: the length shrinks from 5 to 1 and the direction is unchanged. Clipping limits only how far one step goes, not where it goes.

### Vanishing: gating

Vanishing is harder. In her words: too large can be made smaller, but once it has vanished you do not know what it was.

The problem is that the path is too long. With a long sequence, the later error must affect earlier weights through too many multiplications, and the information is gone. The example on slide 47: "I grew up in France" is written early, much content follows, and later comes "I speak fluent ___." A good enough language model should give "French" a higher probability than other languages. But with so much in between, the information about France can hardly affect the final prediction. In theory an RNN can handle long-term dependencies (the slide: in theory), but in practice, because a computer's numerical precision is limited, values that are too small become 0.

The well-known solutions of the time are LSTM (Hochreiter and Schmidhuber 1997) and GRU (Cho et al. 2014), slides 48–49. The mechanism is called gating. Her description: add a shortcut on top of the original RNN; this path is unobstructed, so information can run all the way to much later and affect distant outputs. Whether it can get onto the shortcut is controlled by several gates, and when they open and close is learned by the model. She does not go into the internal structure of the gates.

She previews in passing: long-range dependency is also what the Transformer is good at. As long as a word appears in the context, attention can see directly that it is related to the current word, without passing it along step by step. This is the starting point of [Lecture 4](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer-en).

### Two extensions

- **Bidirectional RNN** (slide 50). Add a right-to-left RNN to the left-to-right one and concatenate the hidden states from both sides, so each position summarizes both past and future. She gives a specific warning: for a language model that "predicts the next word," the whole sentence cannot be fed into a bidirectional RNN for training. When predicting the third word, having already seen information passed back from later positions makes no sense.
- **Deep bidirectional RNN** (slide 51). The time dimension is already deep, and layers can still be stacked, each passing an intermediate representation to the next.

## What RNNs can do: look at input and output first

Video 3.4 opens by noting that the application settings here are much like those where Transformers are used now, since the Transformer is also a method for capturing information in a sequence.

Slide 54 writes the learning problem as f : X → Y. She stresses thinking through what the input is, what the output is, and what properties each has before choosing a model:

- The **input** can be a word, a word sequence, an audio signal, or click logs. For a single word an ordinary fully connected network is enough; for a sequence of words a sequence method is needed. She gives an advertising example: the input is a user's click log, and whether to treat the whole string of clicks as a sequence or to predict from one current representation leads to very different models.
- The **output** can be a single label, sequence tags, a tree structure, or a probability distribution.

### Sequential input: turn the whole sentence into one vector

Slide 56 lists ways to aggregate the meaning of a word sequence into one vector.

The simplest is to average or sum the word vectors. She says this is actually common: if the task is only to decide whether a sentence is about finance, a precise understanding of the sentence is unnecessary, a simple average is enough, and it is very cheap. A method that looks dumb can do very well with very few resources in some applications.

More complex is to learn how to combine with a model: RvNN (recursive, considering more complex structure), RNN, CNN (which gathers information from each word and its neighbors, with less notion of temporal order), and Transformer.

Slide 57 demonstrates with sentiment analysis. The input is 「這 規格 有 誠意」 ("this specification has sincerity"); the RNN reads it word by word, the final vector represents the whole sentence, and an ordinary fully connected network after it does the classification. The RNN and the classifier are tuned together in training, which is called end-to-end optimization. She adds that the whole model need not be one architecture: an RNN in front, attention in the middle, and a fully connected layer at the end all work.

### Sequential output: tagging and seq2seq

The three examples on slide 59 all output a sequence: POS tagging (tagging each word of 「推薦我台大後門的餐廳」 with its part of speech), speech recognition (turning audio into 「大家好」), and machine translation ("How are you doing today?" into 「你好嗎？」).

The slide concludes: the output can be viewed as a sequence of classification. She connects it to today's language models: producing the first word, the second, the third, each time deciding which one to produce out of the whole vocabulary, is one classification.

Sequential output further divides into two kinds:

| | Tagging | Seq2seq (encoder-decoder) |
|---|---|---|
| Input and output | Aligned, same order, one tag per position | Unaligned, order may differ |
| Method | Output one tag directly at each time step | One RNN encodes the input and another decodes the output |
| Slide examples | POS tagging 「四樓／好／專業」 → N／VA／AD (slide 61); slot tagging (slide 62) | Machine translation 「超棒 的 醬汁」 → Awesome sauce (slide 64); chit-chat dialogue "How are you" → "I am fine" (slide 65) |

The slot tagging example on slide 62: the user says "just sent email to bob about fishing this weekend." The model tags "bob" as B-contact_name, tags the three words "fishing this weekend" as B-subject, I-subject, I-subject, tags the other words O, and finally decides that the intent of the sentence is send_email. With these tags, the API call `send_email(contact_name="bob", subject="fishing this weekend")` can be assembled.

Her advice: when a task can be done by tagging, use tagging. With aligned input and output, training is much easier and uses fewer parameters. Reading in a whole segment first and then producing another is much harder. But many tasks are unaligned, machine translation among them, and then the only way is to encode first and decode afterward. The slide's two contrasting lines are: for tagging, temporal orders for input and output are the same; for seq2seq, temporal ordering may be different.

The encoder-decoder idea is independent of the model, and it can be built with RNNs or with Transformers. She ends by saying that every application setting in this lecture can be switched to a Transformer, and that [HW1](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa-en) uses a Transformer model.

## Common misreadings

This list is my own summary, not something the lecture enumerated point by point.

- **"One-hot vectors at least show which words are more alike."** They do not. Any two different words have perpendicular vectors, and the similarity is always 0.
- **"The window size of a co-occurrence matrix is just a technical parameter."** It decides what is learned. With the whole document as the window, the result leans toward topic; with a few words on each side, it also learns syntactic information such as part of speech.
- **"Smoothing solves the zero-probability problem of n-grams."** It only keeps the product from becoming 0. The added probability is assigned by a person and is not accurate, and the root cause is that the data can never be complete.
- **"An RNN uses the whole history, so the longer the sentence, the larger the model."** The weights are shared. However long the sentence, the matrices to train are still W, U, and V.
- **"In theory an RNN can remember information from long ago, so it can in practice."** In practice the gradient does not get back. This is why LSTM and GRU, and later attention, are needed.
- **"Exploding and vanishing gradients are the same problem with the same fix."** They have the same source, the same matrix multiplied too many times, but the fixes are not symmetric: explosion can be clipped, and vanishing cannot be repaired afterward and requires changing the model structure.
- **"Bidirectional is always better than unidirectional."** For a language model that predicts the next word, feeding the whole sentence into a bidirectional RNN lets the model see the answer; bidirectional processing can only be applied to the words that have already appeared.

## Self-check

The questions were written for this post, and every answer can be found above.

**1. What are the four issues with knowledge-based representations such as WordNet?**

New words are missing, the content is subjective, it needs a great deal of annotation time, and word similarity is hard to compute.

**2. Using the co-occurrence matrix from slide 10, compute the cosine similarity of "deep" and "enjoy."**

deep = (0, 1, 0, 0, 0, 1) and enjoy = (1, 0, 0, 0, 0, 1). The dot product is 1 (both are neighbors of "learning"), both lengths are √2, and the similarity is 1 ÷ 2 = 0.5.

**3. The training data has only "the dog ran" and "the cat jumped." With a bigram model, compute P(cat | the) and P(ran | cat).**

P(cat | the) = 1/2. P(ran | cat) = 0, since "cat" has only been followed by "jumped."

**4. Why does a neural LM not need separate smoothing?**

It predicts probabilities with a network whose input is word vectors. Similar words have similar vectors, so with "cat jump" in the data, the probability of "dog jump" is also pulled up even though it was never seen.

**5. What limit remains in the neural LM, and how does the RNN LM handle it?**

The context window is fixed at the previous n−1 words. The RNN LM passes each step's information to the next through the hidden state, so it can use all previous words, and every time step shares the same weights.

**6. One RNN processes a sentence of length 20 and one of length 200. How does the number of trainable parameters differ?**

It does not. Both use the three matrices W, U, and V, and the longer sentence just uses the same weights more times.

**7. Gradient g = (6, 8) with threshold 5. What is it after clipping?**

‖g‖ = 10, above the threshold. The new g = (5 ÷ 10) × (6, 8) = (3, 4).

**8. Why is a vanishing gradient harder to handle than an exploding one, and what was the solution at the time?**

Too large can be scaled down; after vanishing, the original value is unknown and cannot be restored. The solution is to change the model: LSTM and GRU use gating to open a path that reaches far, and the model learns when to open the gates.

**9. Which approach suits each of these three tasks: deciding whether a review is positive or negative, tagging each word in a sentence with its part of speech, and translating English into Chinese?**

Whole-sequence classification (encode the sequence into one vector and add a classifier), tagging (aligned input and output), and seq2seq (unaligned input and output).

**10. Why can "sequential output be viewed as a sequence of classification"?**

Each word produced is one choice out of the whole vocabulary. Producing a sequence of words is doing that classification many times. Today's language models generate text the same way.

## Further reading

- The same material at Stanford: [CS224N Lecture 2: word2vec](/posts/ai/2026-08-22-cs224n-word-vectors-en), [CS224N Lecture 4: Language Models and RNNs](/posts/ai/2026-08-22-cs224n-rnn-language-models-en)
- How NTU's courses divide the ground: [NTU AI/ML course map](/posts/learning/2026-09-30-ntu-ai-ml-course-map-en)

Next lecture: [Lecture 4, Attention and Transformer](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer-en)

## Course video sources

These videos were checked on 2026-10-10 against the official course page and official YouTube playlist (lecture numbers and titles match); no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=215BxEbYrCs
title: ADL 3.1: Word Representations
```

```youtube
url: https://www.youtube.com/watch?v=eVA_WTW4gXE
title: ADL 3.2: Language Modeling
```

```youtube
url: https://www.youtube.com/watch?v=e9Ef3dZcvjw
title: ADL 3.3: Recurrent Neural Network
```

```youtube
url: https://www.youtube.com/watch?v=MyKrovk8tLM
title: ADL 3.4: RNN Applications
```

Original videos: [ADL 3.1: Word Representations](https://www.youtube.com/watch?v=215BxEbYrCs), [ADL 3.2: Language Modeling](https://www.youtube.com/watch?v=eVA_WTW4gXE), [ADL 3.3: Recurrent Neural Network](https://www.youtube.com/watch?v=e9Ef3dZcvjw), [ADL 3.4: RNN Applications](https://www.youtube.com/watch?v=MyKrovk8tLM), [ADL 4: Gating Mechanism (LSTM and GRU)](https://www.youtube.com/watch?v=LosffMy3BqM), [5.1 Word Representation Review](https://www.youtube.com/watch?v=K2oYKdK--9U), [5.3 Word2Vec Training](https://www.youtube.com/watch?v=4Vrd15ZwxH4), [5.4 Word2Vec Variants](https://www.youtube.com/watch?v=cKor9hMjFLc)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

Checked: 2026-10-13.

Content check: verified against the video transcript (2026-10-13): 3.2, 3.3, and 3.4 were written from their captions. 3.1 has no captions, so this guide was written from a speech-recognition transcript of its audio, which may mishear some proper nouns and numbers. Formulas, tables, and figure content follow the slide pages. The optional word-embedding videos were not checked.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-13: Rewritten from the spoken content of the four videos, adding the content of 3.1, four examples, common misreadings, and a self-check with answers.

## References

- [ADL Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — the 9/01 schedule row and the optional row
- [Sequence Modeling deck (2025/09/01)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_SeqModel.pdf) — all slide numbers cited here come from this deck
- [Word Embeddings deck (Fall 2022, optional)](https://www.csie.ntu.edu.tw/~miulab/f111-adl/doc/220929_WordEmbeddings.pdf)
- [ADL 4: Gating Mechanism (LSTM and GRU)](https://youtu.be/LosffMy3BqM) — mislabeled on the course page as the Word Embeddings Intro
- [2025 Fall ADL playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- [Bengio et al., A Neural Probabilistic Language Model (JMLR 2003)](https://www.jmlr.org/papers/v3/bengio03a.html)
- [Pascanu, Mikolov & Bengio, On the difficulty of training recurrent neural networks (ICML 2013)](https://proceedings.mlr.press/v28/pascanu13.html)
