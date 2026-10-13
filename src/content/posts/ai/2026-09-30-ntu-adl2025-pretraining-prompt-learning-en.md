---
title: "Three Pre-training Families and Prompt Learning: From BERT, GPT, and T5 to Soft Prompts | NTU Yun-Nung Chen Applied Deep Learning Lecture 6"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, pretraining, prompt-engineering, scaling-laws, nlp]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning"
  order: 7
tldr: "Pre-training lets a model learn general abilities from large unlabeled data before the task is known. There are three architectures: encoders see both directions and suit understanding; decoders see only the left, can generate, and are the type that won; encoder-decoders pre-train by denoising. Pre-training plus fine-tuning hits two obstacles, scarce labels and oversized models. GPT-3's in-context learning performs tasks with no parameter update, followed by hard prompts (a template plus a verbalizer, LM-BFF) and soft prompts that train vectors directly (P-Tuning, Prefix-Tuning). Soft prompts did better at the time, but what survived is prompting with no training at all."
description: "A guide to Lecture 6 of NTU Yun-Nung Chen's Applied Deep Learning, Fall 2025, built from the Pretraining deck and the spoken content of videos 6.1–6.6: the three points of pre-training and the copyright dispute over data, encoder / decoder / encoder-decoder, BERT's 15% masking, three generations of GPT, BART and T5, in-context learning, scaling laws and Chinchilla, prompt templates and verbalizers, LM-BFF, P-Tuning and Prefix-Tuning, five training strategies for prompting, and the approach that survived. Includes verbalizer and storage examples and a self-check with answers."
draft: false
glossary:
  - term: "Verbalizer"
    definition: "In prompt-based fine-tuning, the mapping from words the LM predicts at the [MASK] position back to task labels, e.g. yes → entailment, maybe → neutral, no → contradiction."
    context: "The ADL slides split prompt-tuning into a prompt template, a PLM, and a verbalizer."
  - term: "Soft Prompt"
    aliases: ["continuous prompt"]
    definition: "Not human-readable text but a set of embedding vectors trained directly by backpropagation and prepended to the input to steer a frozen pre-trained model."
    context: "Video 6.5's Mandarin subtitle, roughly \"humans needn't understand it as long as the machine does,\" refers to this."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning)

**Video status: Videos included.** [Source details](#course-video-sources)

**This guide covers the 9/15 week of [NTU Yun-Nung Chen's Applied Deep Learning (ADL), Fall 2025 (114-1, 2025/09/01–12/15)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/).** It is Lecture 6 in the [Reading NTU Yun-Nung Chen Applied Deep Learning](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en) series. [Lecture 5](/posts/ai/2026-09-30-ntu-adl2025-bert-family-en) covered BERT and its family, and [the previous post on HW1](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa-en) applied BERT to Chinese extractive QA. This one zooms out: **how do encoder-only, decoder-only, and encoder-decoder models differ, and why can a large enough model do a task from a prompt alone?**

Official materials used:

- Slides [250915_Pretraining.pdf](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250915_Pretraining.pdf) (67 pages, titled Pretraining & Prompt Learning). The cover credits some slides to Mohit Iyyer (UMass) and Hung-yi Lee.
- Videos (lectures in Mandarin): [6.1 Pretraining](https://youtu.be/suX2F2TqKuE) (9:23), [6.2 Encoder-Only, Decoder-Only, Encoder-Decoder Pretraining](https://youtu.be/cnd91AbBQ74) (33:38), [6.3 Issues of PLMs](https://youtu.be/tdMuyQO6kLs) (21:39), [6.4 (Hard) Prompt-Tuning, LM-BFF](https://youtu.be/fpNxjqJjtT4) (15:55), [6.5 (Soft) Prompt-Tuning (P-Tuning, Prefix Tuning)](https://youtu.be/Wrzz7mG1ZDU) (7:13), [6.6 Prompting Paradigm](https://youtu.be/CCZfyLCNrQk) (15:43)
- Extra: [6.0 QA](https://youtu.be/-3mUrFm8lIo) (26:15) in the playlist is an in-class Q&A with no slides.

Access level follows the series rating of **A2**. The slides and videos are public, and there is no new assignment this week (HW2 is released in the week of [Lecture 7](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf-en), with only an explainer video).

After this lecture you should be able to do four things: given a model, say whether it is an encoder, a decoder, or an encoder-decoder, and what it does during pre-training; tell apart what fine-tuning and in-context learning each change; rewrite a classification task as a prompt using a template and a verbalizer; and state the difference between hard and soft prompts, and which approach survived. Examples marked "made up for this post" and quote boxes marked "Note" are not from the lecture.

## What pre-training is

Pre-training literally means "before training." Before knowing which task the model will end up doing, let it learn basic abilities from large and diverse data. Professor Yun-Nung Chen's analogy is sending the model to school: nobody knows yet which subject the exam will be on, so it studies a bit of everything, in the hope that the knowledge helps later.

Slide 2 lists three points, and she gives the reason for each:

- **The data should be large and diverse.** The final task is unknown, so the broader the coverage, the safer.
- **The model must learn from unlabeled data.** Nobody labels data at this scale. A textbook is a series of passages with no question-answer pairs.
- **What is learned should be general and transferable.** If pre-training has nothing to do with the later task, no help should be expected.

### May the data be used this way?

The best-known pre-training dataset is BookCorpus (slide 3), from a 2015 paper whose authors wrote a crawler to download free books from one website. She points to the problem: a book being free to read does not hand over its copyright.

The dispute has two sides (slide 4). Companies building models argue fair use: the model only reads, much as a person who downloads a book to read is training their own brain, and the model does not output copies. The other side holds that buying a book is not buying its copyright.

She gives the Anthropic case as an example:

- It bought large numbers of physical books, scanned them, converted them to text, and trained on them (laborious work, she notes). The court found this part to be fair use.
- It also used books downloaded from pirate sites. That part did not pass, and she says the total payout was 1.5 billion US dollars.

> Note (not from the lecture; checked separately): the headline shown on slide 4 itself reads "agrees to pay authors $1.5bn to settle piracy lawsuit", a settlement rather than a court award. The case is Bartz v. Anthropic. The court ruled that training a model on the books is fair use, as is digitizing purchased print copies, while downloading pirated books to build a library is not. The 1.5 billion dollars is the amount of the later settlement between the parties, not a court award; per Reuters on 2025-09-05, it comes to about 500,000 books at 3,000 dollars each.

Her conclusion is that countries have not reached a consensus: the US is relatively open, EU regulation is stricter, and Taiwan mostly waits and watches. The question remains unsettled.

## Three pre-training architectures

The three differ in where attention may look (slide 5):

| Type | Attention | Representative models |
|---|---|---|
| Encoder-only | Each token sees all tokens before and after it | BERT and its variants |
| Decoder-only | Sees only the tokens already to its left | The GPT series |
| Encoder-decoder | The encoder side sees both directions, the decoder side only the left | The original Transformer, BART, T5 |

She describes those years as a period of warring states, each camp claiming to be best. As of now the winner is decoder-only: OpenAI worked on nothing else from the start, and most current architectures are close to it.

### Encoders: BERT and its family

BERT is pre-trained as a masked language model: mask some tokens in a sentence and have the model fill them in from context on both sides. At a masked position the model outputs a probability distribution over the vocabulary. Suppose the vocabulary has sixty thousand tokens: the output then has sixty thousand dimensions, and training raises the probability of the correct one.

Why mask 15% (slide 7):

- Too little, say 5%, and a full pass of the model over a sentence trains only 5% of positions, which is inefficient.
- Too much, and the remaining context cannot support filling the blanks.

**A quick calculation (made up for this post).** For a 512-token sequence, masking 15% is about 77 positions, leaving 435 as context. Masking 5% is 26 positions, so the same pass yields a third of the training signal.

After pre-training, the parameters serve as a starting point and are fine-tuned on the target task. She notes there is no single correct usage: for classification the common choice is the vector at the leading `[CLS]` position followed by a linear layer, but the last token or the average over all positions are also options. She encourages students to try.

Two variants after BERT (slide 8):

- **RoBERTa**: little is new in the model itself. The changes are more data and finer training settings. It works very well, and she says it should be considered whenever a BERT-family model is used.
- **SpanBERT**: a word may be split into several subwords, and masking only one of them is odd. It masks several consecutive tokens at once.

### Decoders: the GPT series

In those years encoders clearly beat decoders on understanding tasks. Decoder research continued because encoders cannot generate (slide 9): they need the whole sentence present to make a judgment and cannot write token by token. A decoder is trained as an ordinary language model: read the preceding context and predict the next token. Take translation: an encoder cannot emit the translation token by token, while a decoder takes the source text as input and simply continues with the translation.

- **GPT (2018)**: a 12-layer Transformer decoder pre-trained on about 7,000 books from BookCorpus, with input tokenized by BPE. Its ability to generate whole sentences was still poor, so it was used almost exactly like BERT: pre-training as the starting point, then fine-tuning per task.
- **GPT-2 (2019)**: the team's thought was "maybe it has not read enough," so forum data from the web was added. Generation did improve, giving fluent, grammatical sentences, though still far from human writing.
- **GPT-3 (2020)**: as much data as could be collected went in, including books, forums, and Common Crawl. The model grew as well, and several sizes were built for comparison, the largest at 175B. The conclusion at the time was that bigger is better; Chinchilla, later in this lecture, adds a condition to that.

Slide 15 lists the three generations' parameter counts side by side: 117M, 1.5B, and 175B.

Why could the first generation suggest a plausible next word yet fail to write a sentence? She explains with a phone keyboard: the suggested next word is usually reasonable, but tapping suggestions repeatedly rarely produces a complete sentence. Forming a sentence takes far more information than continuing a word.

### Encoder-decoders: BART and T5

Wanting both directions and generation, put the two mechanisms together. Pre-training such a model is less intuitive, and the approach is denoising (slides 17–18): corrupt part of the input and have the model restore it.

The deck shows the difference between the two models with one sentence (Thank you for inviting me to your party last week):

- **[BART](https://arxiv.org/abs/1910.13461)** (Meta): the input is the sentence with holes, and **the output is the full original sentence**.
- **[T5](https://arxiv.org/abs/1910.10683)** (Google): the input marks the holes as `<X>` and `<Y>`, and **the output is only the missing parts**: `<X> for inviting <Y> last <Z>`.

They also differ for classification (slide 19): BART repeats the input and then predicts the label, and T5 emits the label directly as output text.

The BART paper tried several ways of corrupting the input, including masking, deletion, and shuffling sentence order, and concluded that removing a span and filling it back in (text infilling) works best.

T5 also compared a prefix language model, bidirectional on the left half and unidirectional on the right. It did worse than the encoder-decoder, so she does not count it among the three main types.

T5's other move was multi-task pre-training (slide 22): include labeled data too, with the task name written in front of the input, such as `translate English to German: …`. She says this idea is today's post-training, covered in the [next lecture](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf-en).

Which of the two models is better? In the table on slide 23, BART scores higher in most columns. In the video she says the two perform about the same, and that their data, sizes, and designs all differ, so no fair pairwise comparison is possible. This guide records both statements.

## Two obstacles for pre-training plus fine-tuning

### Obstacle 1: little labeled data

In the benchmark listed on slide 25 (GLUE, judging by the task list), the smallest task still has 2,500 examples. She says industry is often worse off: you are asked to build the system first, with no labeled data at all. The realistic setting is usually few-shot, or no examples.

Another approach appears here, **in-context learning** (slides 26–28):

| | Model parameters | How the model is told the task | What must be stored |
|---|---|---|---|
| Fine-tuning | Updated with the task's labeled data | Through training | One model per task |
| In-context learning | Untouched | Written into the input context | One model in total |

Her analogy is a student who has read a great deal and never taken an exam. On the first exam the student reads the instructions for the question type, such as "choose the best of A, B, C, D," ideally sees one worked example with its answer, and only then answers. The instructions and the example are the context. No example is zero-shot, one is one-shot, and a few is few-shot.

She also points out what is strange about this: during pre-training GPT-3 only learned to continue text and never learned to handle a particular task, and it is not trained further when used, yet it understands a task from a description alone. This is why prompt engineering took off: for the same task, different wording leads the model to different degrees of understanding.

Some results from the GPT-3 paper (slides 29–32; the numbers are as she states them):

- The larger the model, the better it understands from a task description alone.
- Against a fine-tuned BERT-Large (about 70 points): GPT-3 zero-shot reaches nearly 60%, and few-shot with only 32 examples exceeds the fine-tuned BERT. It still falls below models designed specifically for the task.
- Few examples are needed. The largest gain is from 0 to 1, and going from 1 to 2 may make no difference. Her advice is to give at least one example.
- When people judge whether an article was written by GPT-3 or by a person: with small models, people are right more than 70% of the time, and as the model grows the rate approaches the 50% of random guessing.
- Teach it an invented word and its meaning and ask for a sentence, and it produces a fluent and sensible one. New things can be learned and used on the spot within the context.

### Obstacle 2: the model is too large

Model size has grown exponentially (slides 33–38), and the most direct problem is cost. With so many resources committed, it helps to estimate beforehand how much performance they will buy.

- **Scaling laws** (slide 39, [Kaplan et al. 2020](https://arxiv.org/abs/2001.08361)): OpenAI proposed that model quality can be predicted from three factors, model size N, data size D, and compute C. With that relation, one can decide where resources should go.
- **Chinchilla** (slide 40, [Hoffmann et al. 2022](https://arxiv.org/abs/2203.15556)): DeepMind found that model size and the number of training tokens should grow in equal proportion. Earlier models were mostly undertrained: very large, with too few tokens fed in, so capacity was wasted. They trained a 70B model, four times smaller than the one it was compared with and trained on more data, and it performed better. A smaller model costs less to fine-tune and to run.
- **Storage** (slide 41): fine-tuning once per task means storing a full model per task.

Slide 42 connects the two obstacles to a solution: can a model be made to fit a target task at lower cost and without storing so much? That is prompt learning.

## Hard prompts: a template plus a verbalizer

She first frames this part: after GPT-3 there were a great many methods of this kind, and the lecture walks through the routes people tried before saying which one remained.

The task is entailment (slides 45–46): given two sentences, decide among entailment, contradiction, and neutral.

The most direct prompt pastes several labeled examples to the model and then appends the pair to be judged. Rewriting the prompt can improve performance: instead of only placing two sentences side by side, ask "Is it true that [the second sentence]?" and let the model answer yes, no, or maybe.

Prompt-tuning breaks this into three components (slides 47–50):

1. **Prompt template**: the sentence the input is wrapped in. This can be tuned.
2. **Pre-trained model**: the template has to suit it. A masked LM needs a `[MASK]` to fill and cannot be expected to continue the text.
3. **Verbalizer**: maps the model's output words back to labels, such as yes → entailment, no → contradiction, maybe → neutral.

**A walkthrough (made up for this post).** The input is "I like strawberries." and "I hate strawberries.", and the template is "I like strawberries. Is it true that I hate strawberries? ＿". Suppose the model gives these probabilities at the blank:

| Word | Probability |
|---|---|
| the | 0.30 |
| no | 0.20 |
| maybe | 0.10 |
| yes | 0.05 |
| all other words | 0.35 |

The most probable word is "the," but the verbalizer looks only at yes, no, and maybe. Among those, "no" is highest, which maps to contradiction. As she puts it, even if some other word is the highest in the whole distribution, we ignore it.

With labeled data, prompt-tuning uses that data to find which wrapping most easily leads the model to the right answer. Her explanation: we used to have inputs and outputs and train the model in between; now the model is too large to touch, and the only thing left to change is the prompt wrapped around the input. Without labeled data (zero-shot) there is nothing to tune, and you simply think of a template and use it.

The approach also works with very little data (slide 52, [cited on the slide as Le and Rush 2021](https://arxiv.org/abs/2103.08493)). Her explanation is that it builds on the pre-trained model, so what was learned in pre-training is retained.

The deck and the spoken lecture differ somewhat here, in a way that affects how prompt-tuning is understood, so both are given. In the video she stresses that the model stays fixed and the prompt is what gets tuned. Slide 51 says that in few-shot settings the pre-trained model is still fine-tuned on a few labeled examples, and that parameters are untouched only in zero-shot settings; LM-BFF, below, is in full "Better Few-shot Fine-tuning of Language Models." The safer reading is that what these methods share is wrapping the task in a prompt, and whether the model parameters change depends on the paper.

### LM-BFF

[LM-BFF](https://arxiv.org/abs/2012.15723) (slides 53–54) addresses two problems. Its example is sentiment classification of movie reviews with the template "It was ＿" and the verbalizer great → positive, terrible → negative.

- **Why would the model say exactly "great" or "terrible"?** It could also say "good" or "awesome." The fix is to put demonstrations in the prompt: write "It was great" for a good one and "It was terrible" for a bad one. Having seen the demonstrations, the model concentrates its output on those two words.
- **Is "It was ＿" the best template?** Not necessarily. The paper's main novelty is having a model generate a batch of candidate templates, evaluating each on the labeled data, and keeping the best. In the experiments the automatically generated templates are roughly on par with hand-written ones, each ahead on some tasks (slide 54).

## Soft prompts: it need not be a sentence people can read

Hard prompts are unstable. She gives an example of judging which country a city is located in (slide 55):

| How the template is written | P@1 (precision) |
|---|---|
| [X] is located in [Y] | 31.29 |
| [X] is located in which country or state? [Y] | 19.78 |
| [X] is located in which country? [Y] | 31.40 |
| [X] is located in which country? In [Y] | 51.08 |

The second row differs from the third only by "or state" and loses more than ten points; the fourth only adds "In" before the answer and gains nearly twenty. To a person these phrasings are almost the same. It is hard to know which wording is best.

So someone asked why a prompt has to be natural language at all. Text becomes a sequence of vectors once inside the model. Skip the text and train those vectors directly, since gradients can flow all the way back.

- **[P-Tuning](https://arxiv.org/abs/2103.10385)** (slide 56): learn the prompt's embeddings directly. What text those vectors correspond to does not matter, as long as the model knows which task to do after reading them.
- **[Prefix-Tuning](https://arxiv.org/abs/2101.00190)** (slide 57): put a short trainable prefix at the very front (in every layer, per the slide). Each task stores only its own prefix.
- **[Prompt Tuning](https://arxiv.org/abs/2104.08691)** (slide 58): each task stores only a short prompt, added at the input layer alone, so one original model can handle different tasks within the same batch. She says the details are not important and can be read in the paper.

The conclusion at the time was that soft prompts outperform hard prompts (slide 59). She finds that reasonable: without having to be natural language, they have a larger space to explore. The chart on slide 59 also shows that they still do not exceed full fine-tuning, and the slide's title stresses competitive performance and better space efficiency.

**How much is stored (made up for this post, with the 11B model size taken from slide 41).** Suppose an 11B-parameter model must do three tasks. Fine-tuning a copy per task stores 33B parameters. With soft prompts, suppose each task learns 100 prompt vectors of 4,096 dimensions: that is 409,600 parameters per task and about 1.23 million for three, plus one shared 11B model. The 1.23 million extra parameters for three tasks are about one ten-thousandth of a single model copy, so storage is essentially one model. The figure on slide 58 uses an even smaller number: about 20K parameters per task.

## The whole picture of prompting: what can be changed

Following the [survey by Liu et al. 2021](https://arxiv.org/abs/2107.13586), video 6.6 first describes four stages of where research effort went (slide 60):

| Stage | Where researchers spent effort | Relation among tasks |
|---|---|---|
| Supervised learning without neural networks | Designing features | Independent |
| Supervised learning with neural networks | Designing architectures | Independent |
| Pre-train, fine-tune | Designing pre-training objectives | The language model is fine-tuned to each task |
| Pre-train, prompt, predict | Designing prompts | Each task uses the same language model directly |

Then come the dimensions of the taxonomy (slides 61–66): the type of pre-trained model, the shape of the prompt (a blank in the middle or a prefix to continue) and how it is produced (hand-written or automatic, discrete or continuous), the shape of the answer, combinations of multiple prompts, and the training strategy.

She says the last dimension matters most. It asks whether the model's parameters and the prompt's parameters are each changed:

| Strategy | Language model | Prompt | Example |
|---|---|---|---|
| Promptless fine-tuning | Tuned | No prompt | BERT: the input is the problem itself, with no statement of the task |
| Tuning-free prompting | Fixed | Not trained | How LLMs are used today |
| Fixed-LM prompt tuning | Fixed | Tuned | Prefix-Tuning |
| Fixed-prompt LM tuning | Tuned | Fixed | T5: the task name is written before the input |
| Prompt + LM tuning | Tuned | Tuned | P-Tuning |

This table follows slide 65. In the video she first places P-Tuning together with Prefix-Tuning in the fixed-LM row and later says P-Tuning tunes both; the deck's classification is used here.

## Which route survived

At the end she answers the question posed at the start. Experiments at the time showed soft prompts beating hard prompts, yet what is still in use is **tuning-free prompting**: train nothing and simply ask.

There are two reasons: pre-training data became diverse enough, and post-training was developed, which has the model learn many kinds of tasks before deployment. A user rewriting a prompt and trying which version works better is doing a manual form of prompt tuning, with the model fixed and the prompt adjusted. Methods that reach into the model to change parameters are more trouble and not very practical, and fewer people use them now.

She says the lecture covers so many methods that are now rarely used in order to show a trend: when models were small, many things could be changed; as models grew and their insides became unreachable, people turned to changing behavior from the outside. Chain-of-thought, which comes later, follows the same direction.

## Common misreadings

This list is my own summary, not something the lecture enumerated point by point.

- **"In-context learning is a kind of training."** The model's parameters are not updated at all. The examples are just part of the input.
- **"Encoders understand better, so encoder models won."** On understanding tasks in those years that was true, but encoders cannot generate. Decoder-only won in the end.
- **"A verbalizer takes the most probable word."** It compares only among the designated words.
- **"Soft prompts work better, so everyone uses them now."** That was the experimental result at the time, and what remained is prompting without training.
- **"A bigger model is always better."** Chinchilla's result is that when data does not keep up, a large model's capacity is wasted.

## Self-check

The questions were written for this post.

**1. A model is pre-trained seeing only tokens to the left and predicting the next token. Which type is it? Can it be used directly for translation?**

Decoder-only. Yes: give the source text as input and let it generate the translation as a continuation.

**2. For "Thank you for inviting me to your party last week" with "for inviting" and "last" removed, what does each of BART and T5 output during pre-training?**

BART outputs the full original sentence. T5 outputs only the missing parts with markers for their positions, such as `<X> for inviting <Y> last <Z>`.

**3. Doing three tasks with fine-tuning versus with in-context learning: how many models are stored in each case?**

Fine-tuning stores three, one per task. In-context learning stores one, and the three tasks differ only in the input context.

**4. The template is "Review: ＿＿. Overall it was [MASK]." and the verbalizer is good → positive, bad → negative. The model's probabilities at [MASK] are: average 0.4, bad 0.25, good 0.15. What label is predicted?**

Negative. The verbalizer compares only "good" and "bad," and 0.25 for "bad" exceeds 0.15 for "good." "Average" is not in the verbalizer and is not compared.

**5. Which row of the training-strategy table does Prefix-Tuning belong to? Are the language model and the prompt each changed?**

Fixed-LM prompt tuning. The language model is fixed, and only the prefix vectors are trained.

**6. You have no labeled data and want to do sentiment classification with a language model. Which methods from this lecture can still be used?**

Only zero-shot prompting: write a template and ask directly. Prompt-tuning, LM-BFF's template selection, and soft prompts all need labeled data. Her advice is to find a way to give the model at least one example.

**7. Design a template and a verbalizer for "decide whether an email is spam," for a masked LM.**

There is more than one answer. For example, the template "Email: ＿＿. This is a [MASK] email." with the verbalizer spam → spam, normal → not spam. Check two things: the template has one [MASK] for the model to fill, and every verbalizer word maps back to a label. (Added by this post, not discussed in the lecture: one [MASK] is filled by one token, so verbalizer words should ideally be single tokens in the model's vocabulary.)

**8. How do hard and soft prompts differ? Which worked better at the time, and what remains in use now?**

A hard prompt is text people can read, and a soft prompt is a set of directly trained vectors that correspond to no text. In the experiments of the time soft prompts worked better. What remains is prompting with no training, plus users rewriting prompts by hand.

## Further reading

- [CS224N Lecture 7: Pretraining](/posts/ai/2026-08-22-cs224n-pretraining-en) covers the same three architectures and in-context learning.
- [CS336's scaling laws basics](/posts/ai/2026-08-22-cs336-scaling-laws-foundations-en) goes deeper into Kaplan and Chinchilla.
- [CS224U on in-context learning](/posts/ai/2026-09-29-cs224u-in-context-learning-en) extends the topic from the angle of prompt design and DSPy.

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en) | Previous: [Assignment 1: Chinese Extractive QA](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa-en) | Next: [Lecture 7: Post-Training and Efficient Adaptation](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf-en)

## Course video sources

These videos were checked on 2026-10-10 against the official course page and official YouTube playlist (lecture numbers and titles match); no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=suX2F2TqKuE
title: 6.1
```

```youtube
url: https://www.youtube.com/watch?v=cnd91AbBQ74
title: 6.2
```

Original videos: [6.1](https://www.youtube.com/watch?v=suX2F2TqKuE), [6.2](https://www.youtube.com/watch?v=cnd91AbBQ74), [6.3](https://www.youtube.com/watch?v=tdMuyQO6kLs), [6.4](https://www.youtube.com/watch?v=fpNxjqJjtT4), [6.5](https://www.youtube.com/watch?v=Wrzz7mG1ZDU), [6.6](https://www.youtube.com/watch?v=CCZfyLCNrQk), [6.0 QA](https://www.youtube.com/watch?v=-3mUrFm8lIo)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

Checked: 2026-10-13.

Content check: verified against the video transcript (2026-10-13): all six videos (6.1–6.6) were worked from their captions; the in-class Q&A 6.0 was not checked. The table on slide 23 shows BART scoring higher in most columns, while the video says the two perform about the same; the guide gives both. For the Anthropic case the instructor describes a court award in the video, the headline on slide 4 says "settle", and a separate check confirmed it was a settlement; the guide notes this.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The embedded videos match the lectures on the official course page and playlist.
- 2026-10-10: Checked the video content against its transcript. Confirmed 6.1 and 6.2 match the article; noted that the BART vs T5 comparison differs slightly between the slide table and the spoken remark, and the article already cites the slide.
- 2026-10-13: Moved the verification history out of the body and switched cross-references within the series from post order to lecture numbers.
- 2026-10-13: Rewrote the whole guide from the spoken content of six videos, adding verbalizer and storage examples, common misreadings, and a self-check with answers.

## References

- [NTU Yun-Nung Chen, Applied Deep Learning Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [250915_Pretraining.pdf (Pretraining & Prompt Learning)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250915_Pretraining.pdf)
- [2025 Fall NTU CSIE ADL playlist (lectures in Mandarin)](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- Videos: [6.1](https://youtu.be/suX2F2TqKuE), [6.2](https://youtu.be/cnd91AbBQ74), [6.3](https://youtu.be/tdMuyQO6kLs), [6.4](https://youtu.be/fpNxjqJjtT4), [6.5](https://youtu.be/Wrzz7mG1ZDU), [6.6](https://youtu.be/CCZfyLCNrQk), [6.0 QA](https://youtu.be/-3mUrFm8lIo)
- [Improving Language Understanding by Generative Pre-Training (GPT, OpenAI 2018)](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)
- [Language Models are Unsupervised Multitask Learners (GPT-2, OpenAI 2019)](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
- [Language Models are Few-Shot Learners (GPT-3, arXiv 2005.14165)](https://arxiv.org/abs/2005.14165)
- [BART (arXiv 1910.13461)](https://arxiv.org/abs/1910.13461)
- [Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer (T5, arXiv 1910.10683)](https://arxiv.org/abs/1910.10683)
- [Scaling Laws for Neural Language Models (arXiv 2001.08361)](https://arxiv.org/abs/2001.08361)
- [Training Compute-Optimal Large Language Models (Chinchilla, arXiv 2203.15556)](https://arxiv.org/abs/2203.15556)
- [Compute Trends Across Three Eras of Machine Learning (arXiv 2202.05924)](https://arxiv.org/abs/2202.05924)
- [How Many Data Points is a Prompt Worth? (arXiv 2103.08493)](https://arxiv.org/abs/2103.08493)
- [Making Pre-trained Language Models Better Few-shot Learners (LM-BFF, arXiv 2012.15723)](https://arxiv.org/abs/2012.15723)
- [Calibrate Before Use (arXiv 2102.09690)](https://arxiv.org/abs/2102.09690)
- [GPT Understands, Too (P-Tuning, arXiv 2103.10385)](https://arxiv.org/abs/2103.10385)
- [Prefix-Tuning (arXiv 2101.00190)](https://arxiv.org/abs/2101.00190)
- [The Power of Scale for Parameter-Efficient Prompt Tuning (arXiv 2104.08691)](https://arxiv.org/abs/2104.08691)
- [Pre-train, Prompt, and Predict: A Systematic Survey of Prompting Methods in NLP (arXiv 2107.13586)](https://arxiv.org/abs/2107.13586)
- [Bartz v. Anthropic PBC (US Copyright Office fair use summary)](https://www.copyright.gov/fair-use/summaries/Bartz-v-Anthropic-PBC-787-F-Supp-3d-1007-ND-Cal-2025.pdf)
- [Anthropic agrees to pay $1.5 billion to settle author class action (Reuters, 2025-09-05)](https://www.reuters.com/sustainability/boards-policy-regulation/anthropic-agrees-pay-15-billion-settle-author-class-action-2025-09-05/)
