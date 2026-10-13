---
title: "Transformers and Speech Processing: How Attention Lets Each Token Use Its Context | Stanford CS124 Week 7"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, transformer, speech-processing, llm]
lang: en
series: { name: "Reading Stanford CS124", order: 8 }
tldr: "Week 7 opens up the Transformer: how attention lets each token draw on the tokens before it, what parts make up a block, and how the input and output ends are attached. PA6a has you write causal self-attention, train a small model and compute perplexity. The same week's live speech lecture introduces the speech recognition task and word error rate."
description: "A guide to Stanford CS124 Winter 2026 Week 7: the intuition for attention with a hand-worked example, query/key/value, the causal mask, multi-head attention, the Transformer block and the residual stream, token and position embeddings, the language modeling head; the four parts of PA6a; and the first half of the live speech lecture: speech tasks, a hand-worked word error rate, datasets and ethics. Based on the 2026 public slides and the PA6a repo."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs124-week7-transformers-speech)

This is Week 7 of [Reading Stanford CS124](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en). Last week treated the Transformer as a black box: context in, a probability distribution over the next token out. This week opens it.

The week has three pieces:

- **The inside of a Transformer.** The slides are the second half of last week's live lecture "LLMs and Transformers!", which was not recorded. The [slides](https://web.stanford.edu/class/cs124/lec/transformer_cs124_26.pdf) are public. They are covered in this post because this week's assignment, PA6a, implements them.
- **[PA6a](https://github.com/cs124/pa6a-transformers)**: write attention, train a model, sample from it, compute perplexity.
- **The live lecture on speech processing.** It is optional, attendance earns extra credit, and it was not recorded. The [slides](https://web.stanford.edu/class/cs124/lec/speech_cs124_26.pdf) are public. This post covers the first half (tasks and evaluation). The second half (how sound becomes model input, and the Whisper architecture) is in [next week's post](/posts/ai/2026-08-22-cs124-week8-speech-git-en), together with PA6b.

The assigned reading is [Chapter 7](https://web.stanford.edu/~jurafsky/slp3/old_aug25/7.pdf) (pages 1–11 and page 17) and [Chapter 8](https://web.stanford.edu/~jurafsky/slp3/old_aug25/8.pdf) of the August 2025 release of the textbook. Be sure to use the `old_aug25/` release: the files with those numbers in the textbook's main directory are now different chapters.

## The problem attention solves

The end of Week 5 noted that static embeddings give each word one fixed vector and cannot handle a word with several senses. The slides use a more pointed example:

> The chicken didn't cross the road because **it** was too tired.
> The chicken didn't cross the road because **it** was too wide.

In the first sentence "it" is the chicken, and in the second it is the road. The vector for "it" should carry information about what it refers to, and that can only come from the surrounding words.

**Attention** is the mechanism that does this: when computing the vector for a token, selectively integrate information from the surrounding tokens. "Selectively" means looking more at some tokens and less at others. Mathematically it is a **weighted sum**.

### The simplified version: similarity as the weight

Start with the slides' simplified version. To compute the new vector aᵢ at position i:

1. Take the dot product of xᵢ with itself and with every token **before** it, giving a set of scores.
2. Pass the scores through a softmax to get weights that sum to 1.
3. Use those weights to take a weighted sum of those tokens' vectors.

Here is an example written for this post that can be done by hand. There are three tokens with two-dimensional vectors: x₁ = [1, 0], x₂ = [0, 1], x₃ = [1, 1]. Compute a₃:

| | Dot product with x₃ | Weight after softmax |
|---|---|---|
| x₁ = [1, 0] | 1 | 0.21 |
| x₂ = [0, 1] | 1 | 0.21 |
| x₃ = [1, 1] | 2 | 0.58 |

a₃ = 0.21 × [1, 0] + 0.21 × [0, 1] + 0.58 × [1, 1] = [0.79, 0.79]

a₃ is a blend of the three vectors, in which the one most similar to x₃ (itself) has the largest share.

### The real version: query, key, value

In the simplified version one vector plays three roles at once. Real attention separates them:

- **Query**: I am the current position, looking for things relevant to me.
- **Key**: I am an earlier position, and others compare against me to decide relevance.
- **Value**: I am an earlier position, and this is the content that actually gets added in if I am selected.

Each role has its own learned matrix (W_Q, W_K, W_V) that projects the same xᵢ into three different vectors qᵢ, kᵢ and vᵢ. The steps become:

1. Score = the dot product of qᵢ with each kⱼ, divided by √d (the square root of the vector dimension). The division keeps the scores from getting so large in high dimensions that the softmax ends up picking almost a single token.
2. Weights = softmax(scores).
3. Output = the weighted sum of the vⱼ.

Separating the roles lets the model learn "how to judge relevance" and "what information to bring over when something is relevant" independently.

### The causal mask: no peeking at the answer

A language model's job is to predict the next token. If position i could see position i+1, the answer would simply leak. So attention in a decoder can only look left.

In an implementation, the scores for all positions are computed as usual, and then, before the softmax, negative infinity is added to the cells for "the future." The softmax turns them into 0.

With four tokens, which positions can see which (✓ visible, ✗ masked):

| Position (query) ↓ / position looked at (key) → | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| **1** | ✓ | ✗ | ✗ | ✗ |
| **2** | ✓ | ✓ | ✗ | ✗ |
| **3** | ✓ | ✓ | ✓ | ✗ |
| **4** | ✓ | ✓ | ✓ | ✓ |

The masked part is the upper-right triangle. Each position sees itself and everything to its left.

### Computing it all at once

The description above goes one position at a time. In practice the vectors for the N tokens are stacked into an N × d matrix X, three matrix multiplications give Q, K and V, and multiplying Q by the transpose of K gives the whole N × N table of scores at once: row i, column j is the score of position i for position j. Add the mask, take a softmax over each row, multiply by V, and the outputs for every position are done.

This has a cost. The score table has N × N cells, so the computation in attention grows with the **square** of the length.

### Multi-head

One set of Q, K and V is called an attention head. Real models run many heads at once, each with its own matrices. The intuition is that different heads can look at the context for different purposes, for example one for grammatical relations and one for what a pronoun refers to. The outputs of the heads are concatenated and projected back to the original dimension.

## The Transformer block

Attention is only one part. A full block has four things:

- **Multi-head attention**: brings in information from other positions.
- **A feedforward layer**: the feedforward network from Week 6, computed separately at each position. It supplies the nonlinearity.
- **Layer norm**: normalizes the values of a vector (subtract the mean, divide by the standard deviation) to keep training stable. It is used twice in a block.
- **Residual connections**: the output of each part is **added to** its input instead of replacing it.

The last point leads to a view the slides emphasize: the **residual stream**. Each token has its own stream of data running from the bottom layer to the top. Every part it passes through adds something to that stream. The feedforward layer and layer norm work only on a single position's own stream, and **attention is the only part that crosses positions**. So an attention head can be seen as a kind of transport: it moves information from one token's stream into another's.

A whole Transformer is many blocks of the same structure stacked up. The vectors going into and out of every layer have the same dimension, so you can stack as many as you like.

## The input and output ends

**The input end.** The slides' example is the string `Thanks for all the`:

1. Tokenize with BPE (Week 2) and convert to vocabulary indices, for example [5, 4000, 10532, 2224].
2. There is a **token embedding** table of size |V| × d, with one row per token. Select the four rows with those indices.
3. Attention by itself knows nothing about order. It is a weighted sum. Leaving the mask aside, shuffling the tokens gives each token the same result as before, just moved to its new position. So **position embeddings** are added. The simplest method is another table with a vector for position 1, position 2 and so on, trained along with the other parameters.
4. The input at each position = token embedding + position embedding.

**The output end.** The last block produces a vector of d dimensions, which has to become a probability distribution over the whole vocabulary:

1. Multiply by a matrix that goes from d dimensions to |V|, giving a score (logit) for every token. This is the **unembedding** layer.
2. Take the softmax to get probabilities.

The unembedding matrix is often simply the transpose of the token embedding table, with the same weights used in two places. This is called weight tying, and it is why the layer is called "un-embedding": the embedding turns a token into a vector, and this turns a vector back into scores over tokens.

At this point one full computation is: tokens → vectors (plus positions) → many blocks → unembedding → softmax → a probability distribution over the next token. Week 6's sampling and loss attach right after it.

## PA6a

**[PA6a](https://github.com/cs124/pa6a-transformers)** is the first assignment in the course that is not written in a Jupyter notebook. You edit `.py` files in a text editor and use PyTorch. It has four parts.

**Part 1: implement attention.** `model.py` already contains a complete Transformer, with only the `forward` method of the `CausalSelfAttention` class left for you to write. Check it with `python test_attention.py`.

**Part 2: train.** `python train.py` trains on a Shakespeare corpus that has already been tokenized with the GPT-2 BPE tokenizer. It runs on CPU by default. The README gives a reference figure: 2,000 iterations on the author's M1 MacBook Pro take around 15 minutes and reach a loss below 4.0. After training, `python sample.py` samples from the model, by default 5 responses of at most 100 tokens each, saved as `sampled_sentences.json`. The README explains that the corpus is tiny, so the samples will not be very fluent, but you should see some Shakespearean patterns and basic grammar. If you get only gibberish, something is probably wrong in the attention code or the training.

**Part 3: implement perplexity.** Write `compute_perplexity` in `perplexity.py`. It takes the model's logits and the target tokens and returns the perplexity of the sequence. The calculation: at each position take the negative log of the probability of the correct token, average, and exponentiate.

Here are some numbers made up for this post. At three positions the model gives the correct token probabilities of 0.5, 0.25 and 0.125. The negative logs are 0.693, 1.386 and 2.079, the mean is 1.386, and e to the 1.386 is 4. On average, at each step the model is in effect guessing among 4 options. This is the same definition as in Week 2, with the probabilities now supplied by a Transformer.

**Part 4: ethics questions.** Many commercial AI detectors use perplexity to decide whether a document was written by an AI: the more predictable the text, the more likely it is to be flagged. The assignment has you read an article on why this method fails and then answer several sets of questions, including: is it reasonable to define human writing as unpredictability? Who might be unfairly affected by a tool that flags predictable prose as non-human? The structured, standard style that school teaches and tests reward is exactly the style detectors find suspicious, so what tension does that create? Should educators use these tools?

Having just computed perplexity makes these questions more concrete. The number measures how surprised this model is by this text. It describes a relation between a model and a text, and it was never meant to identify an author.

## The live speech lecture (first half)

### What the speech tasks are

The slides first list common speech tasks. The two main ones:

- **Automatic speech recognition** (ASR): speech in, text out.
- **Text-to-speech** (TTS): text in, speech out.

Others include speech translation, language identification, speaker identification, diarization (output who talked when) and detecting which regions contain speech.

### Why it is hard

The slides' demonstration takes a short piece out of an everyday conversational utterance and sets it against the same piece inside the whole sentence: without context it is hard to recognize, and with context it is understandable. The accent example works the same way. Human listening depends heavily on context, and a recognition system has to as well.

### Word error rate

The standard metric for speech recognition is **word error rate** (WER). It is Week 2's minimum edit distance with words in place of characters, divided by the length of the reference:

WER = (substitutions + deletions + insertions) ÷ number of words in the reference

The slides' example:

- Reference: Um I left this phone upstairs last night (8 words)
- Hypothesis: My sister her phone it stores less nine

After aligning with edit distance:

| Reference | Um | I | left | this | — | phone | — | upstairs | last | night |
|---|---|---|---|---|---|---|---|---|---|---|
| Hypothesis | My | — | — | sister | her | phone | it | stores | less | nine |
| Error type | sub | del | del | sub | ins | | ins | sub | sub | sub |

Five substitutions, 2 deletions and 2 insertions make 9 errors. WER = 9 ÷ 8 = 112.5%.

This is the alignment drawn on the slides, which lines up words that sound alike. It is not the alignment with the fewest errors: Week 2's dynamic programming finds one with only 8 (6 substitutions, 1 deletion, 1 insertion), which gives 100%. Real scoring tools take the minimum.

WER can exceed 100%, because inserted words count as errors while the denominator counts only the length of the reference. If the reference has 2 words and the hypothesis adds 3 extra ones, WER is 3 ÷ 2 = 150% even when the original 2 are right.

The slides list several problems with it and say people use it anyway:

- It is not semantically aware. Mishearing "of" and mishearing a key noun each count as one error.
- It is not necessarily comparable across languages, because it assumes a shared notion of what a word is.
- It depends heavily on text normalization. Spelling conventions, apostrophes in contractions like "can't," and non-standard words like "uh-huh" all become errors if written inconsistently.

### Data and the state of the art

The slides introduce some commonly used datasets: LibriSpeech (read speech from audiobooks, with 44,000 hours of English in the multilingual version), Common Voice (crowdsourced, 33,000 hours in 133 languages, noisier), FLEURS (parallel speech and text in more than a hundred languages) and CHiME 6 (conversational speech in real home environments).

Recognition today still fails in many situations: noisy speech, several overlapping speakers, low-resource languages, and some speakers (children, old people, people who stutter).

### Basic ethics for speech technology

The slides list three:

- **Do not record someone without their consent.** In California, all parties to a phone conversation or a confidential conversation must consent to being recorded.
- **Do not use someone's speech data without consent**, especially for synthesis and voice cloning.
- **Consider subgroup and language bias.** Systems perform worse for non-native speakers, and many languages are under-served relative to English and Mandarin.

## Self-check

1. Using the three vectors from the simplified version above, compute a₂ (position 2 can see only positions 1 and 2). Answer: the dot product of x₂ with x₁ is 0 and with itself is 1. softmax([0, 1]) = [0.27, 0.73]. a₂ = 0.27 × [1, 0] + 0.73 × [0, 1] = [0.27, 0.73].
2. A sequence has 5 tokens. How many cells does the causal mask hide? Answer: of the 5 × 5 = 25 cells, the upper-right triangle has 4 + 3 + 2 + 1 = 10 masked cells.
3. Shuffle the input tokens. With no position embeddings and no mask, what happens to the output of attention? Answer: each token gets the same weighted sum as before, just moved to its new place. The model cannot tell "dog bites man" from "man bites dog." That is why position embeddings are needed.
4. The sequence length goes from 1,000 to 4,000. How many times larger is the attention score table? Answer: 16 times, because it grows with the square of the length.
5. The reference is "I am very tired today" (5 words) and the hypothesis is "I am tired today." What is the WER? Answer: one word was deleted, so 1 ÷ 5 = 20%.

## How this week connects to later ones

- PA6b in Week 8 takes the sentences generated by this week's PA6a and runs them through speech synthesis and recognition.
- Week 8's discussion of Whisper uses this week's attention plus one more kind: cross-attention, which lets the side generating text look at the side holding the audio.
- The final lecture in Week 10 covers interpretability: how to make sense of what these vectors and attention heads are doing.

**Series navigation**: previous, [Week 6: Neural Networks and LLMs](/posts/ai/2026-08-22-cs124-week6-neural-networks-llms-en) | next, [Week 8: Speech and the PA7/Git Lab](/posts/ai/2026-08-22-cs124-week8-speech-git-en)

## Update Log

- 2026-10-13: Rewritten from the 2026 public slides. The Transformer source is now the 2026 version linked from the official schedule. The post used to say the live speech lecture had no public slides; the official schedule now links them, and sections on speech tasks, word error rate and ethics were added from them. Added a hand-worked attention example, a causal mask table, a hand-worked perplexity and a self-check.

## References

- [CS124 Winter 2026 course site and schedule](https://web.stanford.edu/class/cs124/)
- [Introduction to Transformers slides](https://web.stanford.edu/class/cs124/lec/transformer_cs124_26.pdf) — attention, the Transformer block, the residual stream, position embeddings, the language modeling head
- [Speech Recognition slides](https://web.stanford.edu/class/cs124/lec/speech_cs124_26.pdf) — speech tasks, the word error rate example, datasets, ethics
- [CS124 PA6a](https://github.com/cs124/pa6a-transformers) — the four parts, the reference training time, the ethics questions
- [Speech and Language Processing, August 2025 release](https://web.stanford.edu/~jurafsky/slp3/old_aug25/) — Chapters 7 and 8
