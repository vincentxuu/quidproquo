---
title: "CS224U In-Context Learning: Origins, Core Concepts, and Suggested Methods"
date: 2026-09-29
category: ai
type: guide
tags: [cs224u, ai-course, stanford, nlp, prompt-engineering, chain-of-thought, dspy]
lang: en
series:
  name: "Reading Stanford CS224U"
  order: 7
tldr: "The Spring 2023 edition of CS224U defines in-context learning as a frozen language model performing a task only by conditioning on the prompt, and warns that the second condition of few-shot learning (no examples of the behavior seen in training) is almost impossible to verify. Potts's 38-page deck runs from GPT-2's TL;DR trick through choosing demonstrations, chain of thought, self-consistency, and DSP, and ends with four recommendations: build dev/test sets first, learn your target model's instruction format, and treat prompt writing as AI system design. Mina Lee's guest lecture asks the reverse question: who should learn to read prompts, people or models?"
description: "A guide to the in-context learning unit of Stanford CS224U (Spring 2023), based on the incontextlearning slides and XCS224U videos 20–23: the GPT-2 and GPT-3 origins, strict definitions of zero-shot and few-shot, whether models 'just predict the next token', instruction tuning and Alpaca, how to choose demonstrations, CoT, self-consistency, Self-Ask, and DSP, plus Mina Lee's guest slides, 'Prompters before prompts and promptees'."
draft: false
glossary:
  - term: "in-context learning"
    aliases: ["ICL"]
    definition: "A language model with fully frozen parameters and no gradient updates performs a task only by conditioning on the prompt text."
    context: "This is the CS224U slides' definition; few-shot and zero-shot are special cases."
  - term: "demonstration"
    aliases: ["few-shot example"]
    definition: "An example placed in the prompt to show the model the behavior you want, such as a question paired with its answer."
    context: "The course treats how to choose, filter, and possibly rewrite demonstrations as central to ICL design."
  - term: "self-consistency"
    definition: "Sample several reasoning paths for the same question and pick the answer that appears most often, which amounts to marginalizing out the reasoning paths."
    context: "Proposed by Wang et al. 2022; in DSP it takes one call to dsp.majority."
    links:
      - label: "Self-Consistency (arXiv:2203.11171)"
        url: "https://arxiv.org/abs/2203.11171"
  - term: "diegetic prompt"
    aliases: ["non-diegetic prompt"]
    definition: "A diegetic prompt is the user's own content in progress (for example, a half-written story); a non-diegetic prompt is an explicit instruction to the model that won't appear in the final text."
    context: "Mina Lee's guest slides cite this distinction from Dang et al. 2023."
---

> 🌏 [中文版](/posts/ai/2026-09-29-cs224u-in-context-learning)

> **Version note**: This post is based on the Spring 2023 edition of [CS224U](https://web.stanford.edu/class/cs224u/). The main sources are the [In-context learning slides](https://web.stanford.edu/class/cs224u/slides/cs224u-incontextlearning-2023-handout.pdf) (Christopher Potts, 38 pages), videos 20–23 of the [XCS224U playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp), and the [public slides](https://drive.google.com/file/d/1RIOAOTOOPyVLezFiIfGnYJSE8ofKuR4L/view) for Mina Lee's guest lecture listed on the schedule; every fact was checked on 2026-09-29. Access grade **A3**. Mina Lee's guest lecture has **no public recording** (it isn't in the playlist), so this post relies on her slides alone.

**Series**: Previous: [Information Retrieval](/posts/ai/2026-09-29-cs224u-information-retrieval-en) | Next: [Homework 2: Few-Shot OpenQA with DSPy](/posts/ai/2026-09-29-cs224u-hw2-openqa-dspy-en) | [Series overview](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en)

The previous post covered how to find evidence. This one covers how to put evidence and examples into a prompt so that a language model **with no training at all** gets the task right. Homework 2 brings the two together: a frozen retriever plus a frozen language model.

At the start of the [ICL Part 4 video](https://www.youtube.com/watch?v=0mXbM2j3Dzs), Potts hedges: he's nearly certain someone will discover a more powerful technique within months, making the video look dated. So the point of this unit isn't the specific 2023 tricks. It's how the course defines the problem and how it judges whether a technique is worth using.

The slides have five sections: Origins, Core concepts, The current moment, Techniques, and Suggested methods.

## Course video sources

The videos below are the recordings linked for the topics covered in this article.

```youtube
url: https://www.youtube.com/watch?v=0mXbM2j3Dzs
title: ICL Part 4: Techniques and Suggested Methods video
```

```youtube
url: https://www.youtube.com/watch?v=eyNLkiQ89KI
title: ICL Part 1: Origins video
```

Original videos: [ICL Part 4: Techniques and Suggested Methods video](https://www.youtube.com/watch?v=0mXbM2j3Dzs)、[ICL Part 1: Origins video](https://www.youtube.com/watch?v=eyNLkiQ89KI)、[ICL Part 2: Core Concepts video](https://www.youtube.com/watch?v=7OOCV8XfMbo)、[ICL Part 3: Current Moment video](https://www.youtube.com/watch?v=a9KQkvcuV3I)

Course and recording entries:

- [XCS224U playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)
- [Official course / lecture source](https://web.stanford.edu/class/cs224u/)

## Origins: from n-grams to GPT-3

The slides open with a joke: the ChomskyBot, a very simple pattern-based language model that imitates Noam Chomsky's prose. The [ICL Part 1 video](https://www.youtube.com/watch?v=eyNLkiQ89KI) says it's only partly a joke: simple mechanisms can produce text that seems to say something.

Then come three early precedents:

- Pre-deep-learning n-gram language models were already huge: [Brants et al. 2007](https://aclanthology.org/D07-1090/) used a 300-billion-parameter model trained on 2 trillion tokens for machine translation.
- [decaNLP (McCann et al. 2018)](https://arxiv.org/abs/1806.08730) did multi-task training with task instructions phrased as natural language questions.
- The original GPT paper (Radford et al. 2018) already contained some tentative prompt-based experiments.

Potts places the real beginning at [GPT-2 (Radford et al. 2019)](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf). The slides quote the paper directly: to get a summary, add `TL;DR:` after the article and generate 100 tokens; to get a translation, put a few "English sentence = French sentence" pairs in the context and end with "English sentence =". Potts says that when he first heard this, he assumed the token had been specially trained. It hadn't.

The cultural turning point was [GPT-3 (Brown et al. 2020)](https://arxiv.org/abs/2005.14165): 175 billion parameters, ten times more than any previous non-sparse language model, with no gradient updates for any task. Potts likes the word "non-sparse" in the abstract, a nod to those enormous n-gram models.

## Core concepts: the definitions are stricter than you think

### Three terms

The slides' definitions:

- **In-context learning**: a frozen language model performs a task only by conditioning on the prompt text.
- **Few-shot in-context learning**: (1) the prompt includes examples of the intended behavior, and (2) no examples of the intended behavior were seen in training.
- **Zero-shot in-context learning**: (1) the prompt includes no examples of the intended behavior (other instructions are allowed), and (2) no examples of the intended behavior were seen in training.

Under both shot definitions sits the same line: **we are unlikely to be able to verify (2).** Current models are trained on vast amounts of text, and we usually don't know, and can't audit, what's in it. As Potts puts it in the [ICL Part 2 video](https://www.youtube.com/watch?v=7OOCV8XfMbo), if a model saw examples like these in training, it's hardly few-shot anymore.

Two more details. In supervised learning, "few-shot" means training on a few examples with gradient updates, which is a different thing. And formatting and other instructions are a gray area; the course chooses to count them as zero-shot.

### Do autoregressive models "just predict the next token"?

This section reviews how GPT trains and generates, with one idea in focus: at each step the model outputs **a vector of scores over the entire vocabulary**, and which token gets picked is a separate rule we choose (greedy decoding, beam search, and so on). Generation isn't intrinsic to the model; it's something we make it do.

The slides frame the question with four escalating answers:

1. Yes, that is all they do.
2. More precisely, they score the whole vocabulary at each step, and we use those scores to compel them to predict some token.
3. And they also represent data in their internal and output representations.
4. But on balance, "they just predict the next token" might be best for science communication with the public.

Potts picks answer 4 for public use, because the mechanistic description helps people calibrate their expectations. "Better late than ___" and "The key to happiness is ___" are the same mechanism to the model: a high-probability continuation.

### Instruction fine-tuning

The section ends with the three-step training diagram from the [ChatGPT announcement](https://openai.com/blog/chatgpt). Potts's emphasis is that humans intervene directly in two of the steps: first people write demonstration outputs for supervised learning, then people rank the model's outputs. The corresponding reading on the schedule is [InstructGPT (Ouyang et al. 2022)](https://arxiv.org/abs/2203.02155).

His conclusion is blunt: **it's not magic.** When these models do sophisticated things, it's largely because sophisticated people have taught them to. That also explains why ICL techniques work, which the next sections come back to.

## The 2023 moment: data, Alpaca, and model size

The third section surveys the data landscape: public corpora for self-supervision (OpenBookCorpus, [The Pile](https://pile.eleuther.ai), BigScience, Wikipedia, Pushshift Reddit, C4) and instruction-tuning data. On the latter, the slides are candid: we don't know much about what the industrial labs are doing, and can only infer that they pay many people to write data and use their own models to generate and adjudicate examples.

Next come [Self-Instruct (Wang et al. 2022)](https://arxiv.org/abs/2212.10560) and [Alpaca](https://crfm.stanford.edu/2023/03/13/alpaca.html). As the [ICL Part 3 video](https://www.youtube.com/watch?v=a9KQkvcuV3I) describes it, Alpaca started from Meta's LLaMA 7B, seeded with the 175 human-written tasks from the Self-Instruct paper, used text-davinci-003 to generate new input–output pairs, and fine-tuned on the resulting 52,000 examples.

Potts draws two lessons. Technically, small models can be very capable after instruction tuning, so model sizes may start coming down (the slides run two in a row: "Model sizes go up up up" and "Model sizes may be coming down"). For ICL, **the closer your prompt is to the instruction-tuning data a model saw, the better it works**. For the largest models that data usually isn't public, so people discover effective prompt formats through trial and error.

## Techniques: demonstrations, reasoning chains, and DSP

### Choosing demonstrations

Take Homework 2's OpenQA setting: the question is "Who is Bert?", the prompt includes a retrieved passage, and it also includes a demonstration question-answer pair.

The first choice point is already counterintuitive. You could use the gold answer from the training set for the demonstration, but Potts says **a retrieved answer, or one generated by the model itself, may work better**, because it's closer to what the model can actually do. The same goes for the demonstration's passage: even if the training set has a gold passage, a retrieved one better simulates the situation of the target question.

The slides sort selection strategies into four kinds:

| Strategy | Examples |
|---|---|
| Random from available data | — |
| Based on relationship to the target | Generation: retrieve examples similar to the target input; classification: help the model implicitly determine the target input's type |
| Filtered by criteria | Generation: the evidence contains the answer, or the model predicts the correct answer; classification: every label is represented |
| Sampled, then rewritten by the LM | Synthesize several demonstrations into one; change style or format to match the target |

At the bottom of the slide is a line it tells you to get used to: **your prompt might contain substrings that were generated by a different prompt to your LM.**

The video then walks through a Homework 2 example step by step. The demonstration question is "Who is ELMo?" with the training answer "ELMo is a friendly monster," but the retrieved passage is about ELMo the LSTM model. How do you catch mismatches like this automatically? Call the language model again and have it answer the demonstration question from that retrieved passage. It answers "ELMo is an LSTM," which doesn't match the gold answer, so you drop the demonstration and resample.

### Reasoning chains and their variants

- **[Chain of Thought (Wei et al. 2022)](https://arxiv.org/abs/2201.11903)**: hand-built demonstrations guide the model to write out its reasoning step by step before answering. Potts notes that the original is bespoke, and the model can be led down the garden path to a wrong answer.
- **Generic step-by-step with instructions**: Potts's own name for it. Instead of custom demonstrations, give a high-level instruction describing what the reasoning should look like. He demonstrates with text-davinci-003 on a conditional question involving negation: asked directly, it answers wrong; with this kind of instruction, it answers correctly and explains its reasoning well. His reading is that the format taps into what the model learned during instruction tuning.
- **[Self-consistency (Wang et al. 2022)](https://arxiv.org/abs/2203.11171)**: sample many reasoning paths and pick the most frequent answer. Effective, but you pay for all that sampling. The slides include code implementing it in DSP with `dsp.majority`.
- **[Self-Ask (Press et al. 2022)](https://arxiv.org/abs/2210.03350)**: the model breaks the question into sub-questions and answers them itself; the sub-questions can be sent to a search engine instead, which suits multi-hop questions.
- **Iterative rewriting**: have the model rewrite parts of its own prompt (demonstrations, passages, questions), for example summarizing the passages found so far at each hop of a multi-hop search before generating the next query.

### DSP's results, and its caveat

The slides end the section with the results table from the [DSP (Demonstrate–Search–Predict, Khattab et al. 2022)](https://arxiv.org/abs/2212.14024) paper. On HotPotQA EM, for example, a vanilla LM scores 28.3, retrieve-then-read 36.9, and a task-aware DSP program 51.4. The schedule lists [Lazaridou et al. 2022](https://arxiv.org/abs/2203.05115) as the reading for the retrieve-then-read line of work.

Potts's reading of the table is worth more than the numbers. He says you only see breakaway results like these when something new has just happened and people are still figuring it out, so they mean ICL techniques are **very early**, and he expects the gap to close as others find better methods. He wants readers to see DSP as a way to bring software engineering into prompt engineering.

The `github.com/stanfordnlp/dsp` repository the course linked to now redirects (as of 2026-09-29) to [stanfordnlp/dspy](https://github.com/stanfordnlp/dspy), the DSPy library Homework 2 actually uses.

## Suggested methods: four of them

The last section of the slides is a single slide with four recommendations:

1. **Create dev/test sets for the task you want to solve**, in a format that works with many prompts. Potts says to do this first so that your exploration has a fixed target.
2. **Learn what you can about your target model**, especially whether it was tuned for specific instruction formats.
3. **Think of prompt writing as AI system design.** Write systematic, generalizable code for the whole workflow, from reading data to extracting responses and analyzing results, rather than typing prompts one at a time.
4. **For the current (and perhaps brief) moment, prompt designs that combine multiple pretrained components and tools seem underexplored relative to their potential value.** This unit explores a retrieval model plus a language model, but calculators, weather APIs, and other tools can be wired in too.

The "current moment" in point 4 is spring 2023, and the slide itself flags it as possibly brief. Read it as a judgment from that point in time, not a permanent rule.

## Guest lecture: Mina Lee, "Prompters before prompts and promptees"

The schedule includes a guest lecture by Mina Lee in this unit. Her [slides](https://drive.google.com/file/d/1RIOAOTOOPyVLezFiIfGnYJSE8ofKuR4L/view) are public on Google Drive (file name `[23.04.24] Prompters @ CS224U.pdf`, 93 pages). They run in the opposite direction from Potts's deck: Potts teaches how to write prompts for models; Mina Lee asks **how people actually write prompts**.

Her running example is an [MMLU](https://arxiv.org/abs/2009.03300) question: "Before Nixon resigned, how many believed he should be removed from office?" Researcher-built prompts use fixed templates, few-shot examples, or CoT. The human first attempt shown in the slides pastes only the question, without the answer options, and gets a vague answer; only after adding the options and rephrasing does the person work toward something effective. The slides' summary: people are usually "not good" at prompting at first; strategies can be taught and can be developed by communities, but may work for one model and not another, and can be awfully counterintuitive (citing [Webson & Pavlick 2022](https://aclanthology.org/2022.naacl-main.167/)).

Her core argument is a mismatch: **the prompts researchers construct for models differ from the prompts real people write.** Right now people are learning to write prompts for models, but it should be the other way around: models should be trained and evaluated to understand prompts written by people.

She then lists model properties that matter to people: intuitiveness (understanding the intent behind instructions), robustness (being consistent and predictable, handling variation across users), calibration (confidence that matches accuracy), plus teachability and complement-ability. To study these, she proposes analyzing **interaction traces**, timestamped keystroke-level event sequences of how people interact with a model.

Two results the slides cite:

- [CoAuthor (Lee et al. 2022)](https://arxiv.org/abs/2201.06796): 1,445 writing sessions between 63 users and GPT-3, with 72.3% of suggestions accepted; text written jointly by users and GPT-3 had the fewest errors and the most diverse vocabulary.
- [Evaluating Human-Language Model Interaction (Lee et al. 2022)](https://arxiv.org/abs/2212.09746): on question answering (Nutrition category), TextBabbage, which has worse zero-shot performance, reached human-LM performance comparable to TextDavinci.

That last result complements Potts's first recommendation neatly: **a model's standalone benchmark score is not the same as how well people do with it.**

## How to self-study this unit

1. Watch the terminology section of the [ICL Part 2 video](https://www.youtube.com/watch?v=7OOCV8XfMbo) and memorize condition (2) of zero-shot and few-shot. Ask it of every paper that claims few-shot results.
2. Watch the ELMo example in the [ICL Part 4 video](https://www.youtube.com/watch?v=0mXbM2j3Dzs). Potts says this Homework 2 question is one people often find hard to think through, though the intuition is clear.
3. Read Mina Lee's slides and compare her account of how people write prompts with your own first attempts at using a chatbot.
4. Then move on to [Homework 2](https://github.com/cgpotts/cs224u/blob/main/hw_openqa.ipynb). DSPy is pinned at 2.4.13; the gap with the current API is covered in the [series overview](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en).

One thing to do tonight: pick a task you regularly hand to a model, write 10 dev questions with known answers, and only then start changing the prompt. That's the slides' first recommendation, and the step people skip most often.

## Further reading

- Where in-context learning fits in pretraining: [CS224N Lecture 7: Pretraining, Subwords, and In-Context Learning](/posts/ai/2026-08-22-cs224n-pretraining-en)
- Instruction tuning and RLHF in detail: [CS224N Lecture 8: From Instruction Tuning and RLHF to DPO](/posts/ai/2026-08-22-cs224n-post-training-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS224U course site (Spring 2023)](https://web.stanford.edu/class/cs224u/) — schedule, guest lectures, readings
- [In-context learning slides (Potts, Spring 2023)](https://web.stanford.edu/class/cs224u/slides/cs224u-incontextlearning-2023-handout.pdf) — the definitions, four answers, demonstration taxonomy, DSP results table, and four recommendations in this post
- [ICL Part 1: Origins video](https://www.youtube.com/watch?v=eyNLkiQ89KI)
- [ICL Part 2: Core Concepts video](https://www.youtube.com/watch?v=7OOCV8XfMbo) — why condition (2) can't be verified; generation as a rule we impose
- [ICL Part 3: Current Moment video](https://www.youtube.com/watch?v=a9KQkvcuV3I) — Alpaca's 175 seed tasks and 52,000 examples
- [ICL Part 4: Techniques and Suggested Methods video](https://www.youtube.com/watch?v=0mXbM2j3Dzs) — the ELMo demonstration-filtering example; reading the DSP results
- [Mina Lee, Prompters before prompts and promptees (CS224U guest slides, Google Drive)](https://drive.google.com/file/d/1RIOAOTOOPyVLezFiIfGnYJSE8ofKuR4L/view)
- [Radford et al., Language Models are Unsupervised Multitask Learners (GPT-2, 2019)](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
- [Brown et al., Language Models are Few-Shot Learners (GPT-3, 2020)](https://arxiv.org/abs/2005.14165)
- [Ouyang et al., Training language models to follow instructions with human feedback (2022)](https://arxiv.org/abs/2203.02155)
- [Wei et al., Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (2022)](https://arxiv.org/abs/2201.11903)
- [Wang et al., Self-Consistency Improves Chain of Thought Reasoning in Language Models (2022)](https://arxiv.org/abs/2203.11171)
- [Press et al., Measuring and Narrowing the Compositionality Gap in Language Models (Self-Ask, 2022)](https://arxiv.org/abs/2210.03350)
- [Lazaridou et al., Internet-augmented language models through few-shot prompting for open-domain question answering (2022)](https://arxiv.org/abs/2203.05115)
- [Khattab et al., Demonstrate-Search-Predict (2022)](https://arxiv.org/abs/2212.14024)
- [Wang et al., Self-Instruct (2022)](https://arxiv.org/abs/2212.10560)
- [Stanford CRFM, Alpaca (2023-03-13)](https://crfm.stanford.edu/2023/03/13/alpaca.html)
- [stanfordnlp/dspy](https://github.com/stanfordnlp/dspy) — where the original `stanfordnlp/dsp` now redirects
