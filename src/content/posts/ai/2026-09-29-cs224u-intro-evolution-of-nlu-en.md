---
title: "CS224U Opening Lecture: One Question Asked for Forty Years, and How a 2023 NLU Course Defines Understanding"
date: 2026-09-29
category: ai
type: guide
tags: [cs224u, ai-course, stanford, nlp, llm, evaluation]
lang: en
series:
  name: "Reading Stanford CS224U"
  order: 2
tldr: "The first CS224U lecture of Spring 2023 asks \"Which U.S. states border no U.S. states?\" of every system from Chat-80 (1980) to text-davinci-001. The answers show that the progress is real. The lecture then questions whether that progress counts as understanding, using Levesque's \"cheap tricks,\" models that invent links, and benchmarks that saturate within a year or two. That splits the course map in two: the first half teaches you to build systems with Transformers and retrieval-augmented in-context learning, and the second half teaches you to test them with harder benchmarks, behavioral evaluation, and causal explanation methods."
description: "A guide to the opening lecture of Stanford CS224U (Spring 2023), based on the official intro slides, YouTube videos 01–02, the three Apr 3 readings (Levesque 2013, Manning 2015, Foundation Models report §2.6), and setup.ipynb: how the course tells the story of NLU, how it turns \"understanding\" into research questions, and its seven-topic course map."
draft: false
glossary:
  - term: "self-supervision"
    definition: "Training in which the model's only objective is to learn co-occurrence patterns in sequences, that is, to assign high probability to sequences that actually occur. No labels are needed."
    context: "The CS224U opening names it as one of the two forces behind recent NLU progress; the other is the Transformer."
  - term: "cheap tricks"
    aliases: ["heuristics"]
    definition: "Levesque's (2013) term for shortcuts that get a question right through heuristics rather than real understanding."
    context: "This post uses it to explain why performing well and understanding have to be measured separately."
---

> 🌏 [中文版](/posts/ai/2026-09-29-cs224u-intro-evolution-of-nlu)

> **This post is based on the Spring 2023 offering of [CS224U](https://web.stanford.edu/class/cs224u/).** The course website still shows that quarter. The [series overview](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en) already covers the course's status, the years it went untaught, and why the ExploreCourses description doesn't match the schedule, so this post skips all that. This is part 2 of the [Stanford CS224U guide](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en) series.

[CS224U: Natural Language Understanding](https://web.stanford.edu/class/cs224u/) is Christopher Potts's project-oriented NLP course, with CS224N as a prerequisite. The first lecture, on April 3, 2023, does two things. It explains how NLU got to where it is, and it uses that history to lay out the quarter's course map.

This post draws on four public sources: the [intro slides](https://web.stanford.edu/class/cs224u/slides/cs224u-intro-2023-handout.pdf) (a 98-page handout), videos [01](https://www.youtube.com/watch?v=K_Dh0Sxujuc) and [02](https://www.youtube.com/watch?v=J52Dtu40esQ) in the [XCS224U YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp), the three readings listed for Apr 3, and [setup.ipynb](https://github.com/cgpotts/cs224u/blob/main/setup.ipynb) in the repo. All of these are public, so under the site's course-map access scale this is an A3 (enough to self-study) historical offering. The Canvas quizzes and classroom recordings are not available.

## Course video sources

The videos below are the recordings linked for the topics covered in this article.

```youtube
url: https://www.youtube.com/watch?v=K_Dh0Sxujuc
title: Video 01: Intro & Evolution of Natural Language Understanding, Pt. 1
```

```youtube
url: https://www.youtube.com/watch?v=J52Dtu40esQ
title: Video 02: Course Overview, Part 2
```

Original videos: [Video 01: Intro & Evolution of Natural Language Understanding, Pt. 1](https://www.youtube.com/watch?v=K_Dh0Sxujuc)、[Video 02: Course Overview, Part 2](https://www.youtube.com/watch?v=J52Dtu40esQ)

Course and recording entries:

- [XCS224U Spring 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)
- [Official course / lecture source](https://web.stanford.edu/class/cs224u/)

## One question, forty years

Potts opens with a question he has used in this course for years:

> Which U.S. states border no U.S. states?

The hard part is the "no." Negation has always been hard for language technology, so this simple-looking question really tests whether a model can handle it.

The slides line up how each generation of systems answered:

| Year | System | Answer |
|---|---|---|
| 1980 | Chat-80 (a symbolic system) | "I don't understand." |
| 2009 | Wolfram Alpha | Lists all the states, so it didn't parse the question |
| 2020 | OpenAI Ada, Babbage | Off-topic, then long stretches of babble |
| 2021 | Curie | Starts listing; mentions Alaska, Hawaii, and Puerto Rico |
| 2022 | davinci-instruct-beta | "Alaska and Hawaii." |
| 2022 | text-davinci-001 | A full, correct sentence |

Chat-80 is the most interesting row. The same system could answer a deeply nested question: which country bordering the Mediterranean borders a country that is bordered by a country whose population exceeds India's? Yet it gave up on "no U.S. states," which fell outside what it could handle. In the [video](https://www.youtube.com/watch?v=K_Dh0Sxujuc), Potts calls it incredibly expressive but rigid.

He pauses on davinci-instruct-beta. It was the first model with "instruct" in its name, and the lecture comes back to that when it gets to human feedback.

**The first thing the table asks you to accept is that the progress is real.** Between 2020 and 2022, the answers went from babble to a correct, complete sentence.

## But getting it right isn't understanding

The lecture then turns around and questions that progress. One slide is titled "Spotting models' 'cheap tricks,'" and it points to the first reading on the schedule: [Levesque 2013, "On our best behaviour"](http://www.cs.toronto.edu/~hector/Papers/ijcai-13-paper.pdf).

Levesque argues that the science of AI should study the behavior itself and what it takes to produce it, not something that merely looks like it. His example is "Could a crocodile run a steeplechase?" A person reasons it out: crocodiles have short legs, so they can't clear the hedges. A cheap trick also gets it right: "I've never heard of a crocodile running a steeplechase, so no." The answer is correct, but ask the same question about a gazelle and the trick fails. His fix is the Winograd schema. The question names two parties and uses one pronoun, and changing a single special word flips the correct answer. That keeps a system from getting by on statistical shortcuts.

Potts tried another of Levesque's questions in class: "Are professional baseball players allowed to glue small wings onto their caps?" The model he calls Davinci-2 said there's no rule against it, though it isn't common. Davinci-3 said confidently that it isn't allowed and cited MLB uniform rules. Two closely related models gave two confident answers that contradict each other. A student found a "Rule 3.06" through Bard, and Potts asked the obvious question: is it real? He noted that OpenAI models will give him links, but the links go nowhere. A later slide in the same deck, on provenance, labels a screenshot "These links are not real!"

**The second point: models can produce things that look like evidence, and the evidence may be made up.** Potts thinks that's worse than giving no evidence at all.

The third signal comes from benchmarks. The slides show a figure from [Kiela et al. 2021 (Dynabench)](https://aclanthology.org/2021.naacl-main.324/). MNIST and Switchboard each took about 20 years to pass the "human performance" line, and ImageNet took less than 10. SQuAD, GLUE, and SuperGLUE each fell faster than the one before. Potts tells students to be skeptical of those human-performance estimates. His conclusion still stands: benchmarks are saturating faster than ever. That shows something real has changed, and it also shows our tests don't last.

## What's driving this progress

The lecture answers "what is going on?" with a timeline. Potts splits AI model development into five phases:

1. 1960s–1980s: symbolic algorithms. You program the system, as with Chat-80.
2. 1990s–early 2000s: the statistical revolution. Systems learn from data but still rely on many hand-written feature functions.
3. From about 2009–2010: deep learning. Models get bigger and deeper, and feature functions fade.
4. Up to about 2018: pretrained components plus task-specific parameters, like fine-tuning BERT.
5. Now: trying to replace everything with one enormous language model.

He says the class should think critically about whether phase five is the right path. Then he names two key drivers.

**The Transformer.** He predicts everyone takes the same three-step journey: "How on earth does this work?" → "Oh, this is actually pretty simple!" → "Wait, why does this work so well?" The architecture waits for the next lecture, which is [Contextual representations I](/posts/ai/2026-09-29-cs224u-contextual-reps-transformer-en) in this series.

**Self-supervision.** The model's only objective is to learn co-occurrence patterns in sequences, or equivalently, to assign high probability to the sequences it sees. Generation means sampling from the model. The fourth point on the slide stresses that the sequences can contain anything: language, code, sensor readings, images. Because no labels are needed, large-scale pretraining becomes possible.

That line runs from word2vec and GloVe (Potts gives the GloVe team special credit for releasing pretrained parameters) through [ELMo](https://aclanthology.org/N18-1202/), BERT, and GPT to [GPT-3](https://arxiv.org/abs/2005.14165). Parameter counts go from BERT's hundreds of millions to GPT-3's 175 billion. The same slide shows the 2023 counter-trend: LLaMA 13B, Alpaca 7B, and FLAN-T5, all around 10 billion parameters or less, were becoming competitive. Models that size run on ordinary commercial hardware.

The historical part ends with three turns in prompting: in-context learning after GPT-3, learning from human feedback (the slide cites ChatGPT's launch post), and step-by-step or chain-of-thought prompting. One remark about prompting is worth keeping. "Better late than ___" looks like an idiom, and "The President of the U.S. is ___" looks like factual knowledge. But **the mechanism is the same**: both reproduce co-occurrence patterns from the training data.

## What each reading answers

The Apr 3 slot lists three readings, plus a John Oliver segment. Each reading comes at "understanding" from a different angle:

| Reading | Core claim | Role in the course |
|---|---|---|
| [Levesque 2013](http://www.cs.toronto.edu/~hector/Papers/ijcai-13-paper.pdf) | Study the behavior itself, not a semblance of it. Use Winograd schemas to rule out cheap tricks. | How to design tests that shortcuts can't fool |
| [Manning 2015](https://aclanthology.org/J15-4006/) | The deep learning tsunami has hit computational linguistics, but NLP is the domain science of language technology, and the domain problems won't go away. He also criticizes conferences' over-focus on beating the state of the art. | A reminder that the course centers on problems and methods, not leaderboards |
| [Foundation Models report §2.6](https://crfm.stanford.edu/assets/report.pdf#philosophy) | Separates what understanding is (metaphysics) from how we could know a model has it (epistemology). Concludes that skepticism about future models' capacity to understand language may be premature. | Turns "understanding" into research questions you can work on |

Potts is one of the authors of the third reading. It lays out three positions on understanding:

- **Internalism**: understanding means retrieving the right internal representational structures in response to linguistic input
- **Referentialism**: understanding means knowing what it would take for a sentence to be true
- **Pragmatism**: no internal representations are needed; using language in the right way is what counts

Which position you take determines how you test for understanding. The report is direct about this. Under pragmatism, behavioral tests are enough, and the hard part is agreeing on the target behaviors. It adds that when systems pass our estimates of human performance, the community usually says the test was flawed, not that the target was reached. Under internalism or referentialism, behavioral tests will always fall short. You need methods that open up the model: probing, studying internal dynamics, and interventions that support causal inference.

**My reading is that this section is close to a table of contents for the second half of the course.** Behavioral evaluation follows the pragmatist route, and model explanation methods follow the other two. That mapping is mine, not the slides', but you can check it against the topic list below.

## The course map: seven topics, two kinds of work

Slide 44 lays out the quarter in two columns:

| Topics | Work |
|---|---|
| 1. Contextual representations | 3 assignment/bake-off combos |
| 2. Multi-domain sentiment analysis | Quizzes |
| 3. Retrieval-augmented in-context learning | Final project: lit review |
| 4. Compositional generalization | Final project: experiment protocol |
| 5. Benchmarking and adversarial training and testing | Final project: final paper |
| 6. Model introspection | |
| 7. Methods and metrics | |

The following slides walk through the "course themes," and each one answers one of the earlier doubts:

- **Transformer-based pretraining**: core concepts, architectures, positional encoding, distillation, plus two guest lectures (diffusion objectives, and practical pretraining and fine-tuning).
- **Retrieval-augmented in-context learning**: Potts's own research focus. He lists five needs: fluency, efficiency, updateability, provenance and factuality, and safety. Then he compares "LLMs for everything" with "retrieval-augmented" on each one. When a document changes, a retrieval-augmented system only needs its index rebuilt. Access control can work at the document level, as it already does. The fake links from earlier are the counterexample for provenance.
- **Compositional generalization**: [COGS](https://aclanthology.org/2020.emnlp-main.731/) and ReCOGS. Training shows "Emma ate the cake on the table," and testing shows "The cake on the table burned." The leaderboard has a whole column of zeros. The overview already covers that table.
- **Better and more diverse benchmark tasks**: quotes Jacques Cousteau calling water and air "global garbage cans," a nod to our datasets. The slide lists six things we ask of datasets: optimizing models, evaluating them, comparing them, enabling new capabilities, measuring fieldwide progress, and scientific inquiry.
- **More meaningful evaluations**: opens with Strathern's Law, "When a measure becomes a target, it ceases to be a good measure," then covers multidimensional leaderboards and Dynascoring.
- **Faithful, human-interpretable explanations**: an explanation has to be understandable to people and true to how the model actually works. The slide sorts methods into three groups. Probing shows internal representations but doesn't support causal claims. Attribution shows causal dynamics but doesn't characterize representations. Interchange intervention training makes models conform to high-level symbolic structure.

The rest of this series roughly follows that order: two posts on contextual representations ([the Transformer mechanism](/posts/ai/2026-09-29-cs224u-contextual-reps-transformer-en) and [the model families](/posts/ai/2026-09-29-cs224u-contextual-reps-model-families-en)), then the sentiment homework, retrieval and ICL, evaluation, explanation methods, methods, and the project.

## How the course runs

The last part of the slides covers logistics. The grading breakdown:

| Component | Weight |
|---|---|
| Quizzes | 15% |
| Homeworks and bake-offs | 35% |
| Literature review | 10% |
| Experiment protocol | 10% |
| Final project paper | 30% |

The course is fully asynchronous: every lecture is recorded, and attendance isn't required. Quizzes are open book, and ChatGPT is allowed, but collaboration isn't. Quiz 0 covers course requirements; its purpose is to get students to read the website and learn their rights and obligations.

The materials contradict themselves in one place. Slide 44 says "3 offline quizzes," slide 91 says "four online quizzes," and slide 95 describes Quizzes 1–4 as covering course material. The schedule links Quiz 0 and Quiz 1 on Canvas. Self-learners can't open any of them, so the discrepancy doesn't affect self-study.

Slide 92 has the grading rule for the "original system" question. Downloading someone else's code, retraining, and submitting earns nothing. A creative, well-motivated system can get full credit even if it does poorly in the bake-off. The [overview's homework section](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en) has the details.

The computing-resources slide reflects 2023: expected AWS credits, a suggestion to get Colab Pro ($9.99 a month), SageMaker Studio Lab, Cohere's free access, and $5 in OpenAI credits for new accounts. If you're studying on your own today, check each of these again.

## What setup.ipynb looks like today

The first item on the "For next time" slide is [setup.ipynb](https://github.com/cgpotts/cs224u/blob/main/setup.ipynb). Its version string now reads "CS224u, Stanford, Fall 2024," three quarters after the course website. That's a trace of the later online cohorts that maintained the repo.

It asks you to:

- Create a Python 3.9 Anaconda environment named `nlu`
- Clone [cgpotts/cs224u](https://github.com/cgpotts/cs224u)
- Set `DEVICE` for CPU or GPU, uncomment the torch lines in `requirements.txt`, then install
- Run two check cells: `torch.__version__` must start with `2.4.0`, and `transformers` must be newer than 4.37

The notebook itself says you *might* be fine if the checks fail, but these libraries change fast and backward compatibility isn't guaranteed.

## What you can do tonight

```bash
git clone https://github.com/cgpotts/cs224u.git
cd cs224u
conda create -n nlu python=3.9
conda activate nlu
# After uncommenting the torch lines in requirements.txt:
pip install -r requirements.txt
```

Then open setup.ipynb and run the two version-check cells at the end. If both pass, you can follow the next lecture's Transformer slides and the first homework as written.

If you only have half an hour, read section 2.2, "Cheap tricks," of [Levesque 2013](http://www.cs.toronto.edu/~hector/Papers/ijcai-13-paper.pdf). Then write your own crocodile-style question and try it on a model you use.

## Further reading

- [CS224N guide: the history of NLP](/posts/ai/2026-08-22-cs224n-history-nlp-en): the same history, told from the prerequisite course
- [Stanford CS224U guide: overview](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en): course status, the three homeworks, the project grading document, and pitfalls in setting up the environment

**Series navigation**: Previous: [Overview](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en) | Next: [Contextual representations I: guiding ideas, the Transformer, and positional encoding](/posts/ai/2026-09-29-cs224u-contextual-reps-transformer-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS224U course website (Spring 2023)](https://web.stanford.edu/class/cs224u/)
- [Introduction and course overview slides (handout PDF)](https://web.stanford.edu/class/cs224u/slides/cs224u-intro-2023-handout.pdf)
- [XCS224U Spring 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)
- [Video 01: Intro & Evolution of Natural Language Understanding, Pt. 1](https://www.youtube.com/watch?v=K_Dh0Sxujuc)
- [Video 02: Course Overview, Part 2](https://www.youtube.com/watch?v=J52Dtu40esQ)
- [setup.ipynb (cgpotts/cs224u)](https://github.com/cgpotts/cs224u/blob/main/setup.ipynb)
- [Levesque (2013). On our best behaviour. IJCAI](http://www.cs.toronto.edu/~hector/Papers/ijcai-13-paper.pdf)
- [Manning (2015). Computational Linguistics and Deep Learning. Computational Linguistics 41(4)](https://aclanthology.org/J15-4006/)
- [Bommasani et al. (2021). On the Opportunities and Risks of Foundation Models, §2.6 Philosophy of understanding](https://crfm.stanford.edu/assets/report.pdf#philosophy)
- [Kiela et al. (2021). Dynabench: Rethinking Benchmarking in NLP](https://aclanthology.org/2021.naacl-main.324/)
- [Brown et al. (2020). Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165)
- [Peters et al. (2018). Deep contextualized word representations (ELMo)](https://aclanthology.org/N18-1202/)
- [Kim & Linzen (2020). COGS](https://aclanthology.org/2020.emnlp-main.731/)
