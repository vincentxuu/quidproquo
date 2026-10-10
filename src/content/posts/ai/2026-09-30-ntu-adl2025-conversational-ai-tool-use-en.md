---
title: "Reading NTU ADL 2025 Fall: Conversational AI and Tool Use — From LU/DST/Policy/NLG to LaMDA, WebGPT, and Toolformer"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, conversational-ai, task-oriented-dialogue, tool-use]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall"
  order: 16
tldr: "Dialogue systems split into chit-chat and task-oriented. Task-oriented systems were traditionally built from four modules: language understanding (LU) turns a sentence into domain, intent, and slots; dialogue state tracking (DST) accumulates the user's goal; the dialogue policy picks the next system action; and NLG turns that action back into a sentence. An LLM can act out all four steps by itself, but it cannot actually make the booking, so it needs external tools. LaMDA learns to call a search engine, calculator, and translator. BlenderBot 2.0 adds internet search and long-term memory. WebGPT learns to drive a browser from human demonstrations, a reward model, and PPO. Toolformer has the model generate and filter its own tool-use training data. The lecture ends with evaluation: automatic metrics, four kinds of human evaluation, and LLM-Eval. ADL Fall 2025 has only videos for this lecture, so the Fall 2024 slides fill in."
description: "Post 16 of the NTU Yun-Nung Chen Applied Deep Learning Fall 2025 series, based on videos 13.1–13.9 and the Fall 2024 deck 241030_ConvAI.pdf (108 pages): the four modules of task-oriented dialogue and how each is evaluated, LaMDA, BlenderBot 1/2/3, WebGPT, Toolformer, dialogue evaluation, and LLM-Eval. Plan-and-Execute, User Interaction, and Theory-of-Mind have no matching pages in the 2024 deck and are listed by name only."
draft: false
glossary:
  - term: "Dialogue State Tracking"
    aliases: ["DST"]
    definition: "The module in a task-oriented dialogue system that accumulates what the user has asked for across turns into a set of slot-value pairs, such as star=5 and day=sunday."
    context: "Pages 19–22 of the ADL ConvAI deck; evaluated with slot accuracy and joint accuracy."
  - term: "Toolformer"
    definition: "A method in which a language model, given only a few demonstrations, inserts API calls into text by itself, filters out calls that do not help, and fine-tunes on what remains to learn when to call which tool."
    context: "Pages 69–72 of the ADL ConvAI deck; the tool set is QA, WikiSearch, Calculator, Calendar, and MT."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use)

**Video status: Videos included.** [Source details](#course-video-sources)

**This post is based on the L13 videos in the playlist of [NTU Applied Deep Learning (ADL), Fall 2025 (114-1, 2025/09/01–12/15)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/), with the Fall 2024 slides filling in.** It is post 16 of the [Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en) series. The previous two posts, [Language Agents](/posts/ai/2026-09-30-ntu-adl2025-language-agents-en) and [Reasoning](/posts/ai/2026-09-30-ntu-adl2025-reasoning-en), were about how a model thinks and plans. This one goes back to an older problem, talking with people: **what happened between modular task-oriented dialogue systems and LLMs that use tools on their own?**

Official materials used:

- **Videos**: 13.1–13.9 in the [2025 Fall playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o). Every description reads "2025/11/24 Applied Deep Learning." The course page's 11/24 row says "Personalization," with no slides and no video links.
- **Slides**: Fall 2025 did not publish slides for this lecture. This post uses the [Fall 2024 Conversational Modeling deck (241030_ConvAI.pdf, 108 pages)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/241030_ConvAI.pdf), the material for the 2024/10/30 lecture on the [Fall 2024 course page](https://www.csie.ntu.edu.tw/~miulab/f113-adl/). **Every page number below refers to this 2024 deck.**

| # | Video (2025) | Chinese subtitle (translated) | Length | Matching 2024 pages |
|---|---|---|---|---|
| 13.1 | [Learning to Converse and Interact](https://youtu.be/8EV-Qw2iYYE) | How machines learn to converse and interact | 15:02 | 2–37 |
| 13.2 | [Tool Use in LLMs – LaMDA](https://youtu.be/LHhxbXKfnKs) | Google's dialogue model that made employees think it was conscious!? | 13:15 | 38–49 |
| 13.3 | [Tool Use in LLMs – BlenderBot](https://youtu.be/B5s3XJIbQtc) | A dialogue model that remembers past interactions and external knowledge | 9:49 | 50–58 |
| 13.4 | [Tool Use in LLMs – WebGPT](https://youtu.be/SVIgPfF16pE) | GPT with search engine abilities | 7:14 | 59–68 |
| 13.5 | [Toolformer](https://youtu.be/PdPK_f-aH3I) | Generating training data that teaches GPT to use tools | 7:43 | 69–72 |
| 13.6 | [Plan-and-Execute](https://youtu.be/FK-r_-dVHcI) | Plan a strategy, then execute | 15:11 | none found |
| 13.7 | [User Interaction](https://youtu.be/fzzOlH0t0_w) | Interacting with users beats working alone | 15:11 | none found |
| 13.8 | [Theory-of-Mind](https://youtu.be/rThWbHBA6e4) | Understanding what users are thinking | 12:47 | none found |
| 13.9 | [Conversation Evaluation](https://youtu.be/gjiKrxiAyNI) | Judging how good a dialogue system is | 13:07 | 99–106 |

The "matching pages" column is my own topic match. Public information cannot confirm that the videos actually show these pages.

## Course video sources

These videos were checked on 2026-10-10 against the official course page and official YouTube playlist (lecture numbers and titles match); no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=8EV-Qw2iYYE
title: 13.1
```

```youtube
url: https://www.youtube.com/watch?v=LHhxbXKfnKs
title: 13.2 LaMDA
```

Original videos: [13.1](https://www.youtube.com/watch?v=8EV-Qw2iYYE)、[13.2 LaMDA](https://www.youtube.com/watch?v=LHhxbXKfnKs)、[13.3 BlenderBot](https://www.youtube.com/watch?v=B5s3XJIbQtc)、[13.4 WebGPT](https://www.youtube.com/watch?v=SVIgPfF16pE)、[13.5 Toolformer](https://www.youtube.com/watch?v=PdPK_f-aH3I)、[13.6 Plan-and-Execute](https://www.youtube.com/watch?v=FK-r_-dVHcI)、[13.7 User Interaction](https://www.youtube.com/watch?v=fzzOlH0t0_w)、[13.8 Theory-of-Mind](https://www.youtube.com/watch?v=rThWbHBA6e4)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

Checked: 2026-10-10.

## Two branches of dialogue systems

Page 3 sorts why people want dialogue systems into four sentences. "I want to chat" is social chit-chat, the Turing-test kind of human-likeness. "I have a question" is information lookup. "I need to get this done" is task completion, such as booking a train from Kaohsiung to Taipei or a table at Din Tai Fung for five at 7 PM tonight. "What should I do?" is decision support. Page 4 folds these into two branches: **chit-chat and task-oriented**.

## Task-oriented dialogue: four modules

The architecture on page 5 cites Young (2000). After speech recognition, the input passes through **LU → DST → Dialogue Policy → NLG**, then speech synthesis. The whole deck runs on one example: the user says "Can you help me book a 5-star hotel on Sunday?" and the system replies "For how many people?"

**Language understanding, LU (pages 10–17)** has three steps: identify the domain (hotel), detect the intent (Hotel_Book), then fill slots, using B-/O tags to mark fields such as star=5 and day=sunday. All three need a predefined ontology or schema. Pages 15–16 cover joint models that handle intent and slots together, including the Slot-Gated model of Goo et al. (2018). Evaluation (page 17) has two levels: domain/intent accuracy and slot F1, plus frame accuracy, which checks whether the whole frame is right.

**Dialogue state tracking, DST (pages 18–22)** accumulates the conversation into a state. When the user adds "For two people, thanks!" in the second turn, the state grows from Hotel_Book(star=5, day=sunday) to include people_num=2. Pages 20–21 deal with slot values that are not in a fixed list (Xu & Hu 2018, TripPy). Evaluation uses slot accuracy and joint accuracy.

**Dialogue policy (pages 23–29)** decides the next system action from the state, such as request(people_num) or inform(hotel_name=B&B). Page 25 contrasts two ways to learn it. Supervised learning is "learning from a teacher": the teacher says to answer Hello with Hi. Reinforcement learning is "learning from critics": you only learn at the end whether the whole dialogue went well. Pages 27–28 illustrate with the Deep Q-Network dialogue manager of Li et al. (2017) and the end-to-end TC-Bot. Evaluation works at the turn level (system action accuracy) and the dialogue level (task success rate, reward).

**NLG (pages 30–33)** turns inform(name=B&B) back into a sentence like "I have book a hotel B&B for you." Page 32 fine-tunes a pre-trained GPT-2 for conditional generation, because pre-trained models write more fluent sentences. Evaluation uses automatic metrics and human judgment.

**Try this**: pick a booking or customer-service chatbot you use. For one turn, fill in page 5's four boxes with a line each: which intent and slots it understood, what state it has accumulated, what system action comes next, and what sentence it finally wrote. The box you cannot fill is usually where it answers the wrong question.

## The LLM plays both roles, but books nothing

Page 36 is titled with a Chinese phrase meaning roughly "directing and starring in its own show." A user asks an LLM to book a restaurant atop Taipei 101. The LLM naturally asks for the date and party size, says "let me check availability," and after a while reports there are no seats. It looks like task-oriented dialogue, but it is not connected to any booking system, so the availability result is made up. The page's conclusion: **access to external tools is necessary.** Page 37 redraws the four modules to show that one LLM can act out LU, DST, policy, and NLG. What it lacks is the step that reaches the outside world.

The next four models are four ways to add that step.

## LaMDA: learning to look things up and correct itself (pages 38–49)

[LaMDA (Thoppilan et al., 2022)](https://arxiv.org/abs/2201.08239).

- **Pre-training**: public dialogue data, 1.56T words according to the deck. The input is the conversation history; the output is the current utterance. Page 39's example asks for its opinion of a Jolin Tsai concert.
- **Quality and safety fine-tuning (page 40)**: one model both generates and discriminates. Training data is written as "context + RESPONSE + response + attribute name + rating," with attributes SENSIBLE, INTERESTING, and UNSAFE. The same model can then generate and score its own output.
- **Groundedness (pages 42–49)**: teach LaMDA to use a search engine to validate or fix its claims. The system has three roles. LaMDA-Base is the original pre-trained model. LaMDA-Research decides whether to use an external tool and how to phrase the query. The Tool Set holds the tools: a calculator ("135+7721" → "7856"), a translator, and an information retrieval system. In page 49's example, Base drafts "He is 31 years old right now," Research looks up Nadal's age, finds 35, and the response is rewritten to 35. The deck also notes that 40K dialog turns were labeled correct or incorrect to train the ranking.

Page 49's closing line: LaMDA already combined retrieval-augmented generation, tool use, and factual alignment in one system.

## BlenderBot: search, memory, and safety (pages 50–58)

- **BlenderBot 1 ([Roller et al., 2020](https://arxiv.org/abs/2004.13637), page 51)**: pre-trained on 1.5B conversations, in three sizes: 90M, 2.7B, and 9.4B. The fine-tuning data, Blended Skill Talk, mixes three skills: personality (PersonaChat), knowledge (Wizard of Wikipedia), and empathy (Empathetic Dialogues). Generation uses a retrieve-and-refine strategy.
- **BlenderBot 2.0 (pages 52–55)**: adds internet search and long-term memory, backed by the Wizard of the Internet and Multi-Session Chat datasets. For safety, it learns on the BAD dataset to emit a `_POTENTIALLY_UNSAFE_` token after an unsafe response.
- **BlenderBot 3.0 ([Shuster et al., 2022](https://arxiv.org/abs/2208.03188), pages 56–58)**: two training techniques. SeeKeR generates a search query, then a knowledge sequence, then the final response. Director learns to avoid undesirable sequences; the deck lists contradiction, repetition, and toxicity. It also keeps improving by collecting feedback from real interactions.

## WebGPT: learning to use a browser from people (pages 59–68)

The three steps of [WebGPT (Nakano et al., 2021)](https://arxiv.org/abs/2112.09332) resemble InstructGPT's:

1. **Supervised fine-tuning (page 60)**: questions come from ELI5, such as "Which has more words, the Harry Potter series or The Lord of the Rings?" Human demonstrators write answers with references, and GPT-3 is fine-tuned on them.
2. **Reward model (page 64)**: people rank two model outputs for the same question.
3. **Reinforcement learning with PPO (page 65)**: the reward model scores outputs, and the generation policy is updated.

Pages 62–63 use a Chinese example to show that generating a search query is itself just token continuation. Page 66 evaluates truthfulness on TruthfulQA. Page 68 lists WebGPT's action set and leaves a question: **how can a model learn to use these actions without human demonstrations?** That is the problem Toolformer takes on.

## Toolformer: generating its own tool-use data (pages 69–72)

[Toolformer (Schick et al., 2023)](https://arxiv.org/abs/2302.04761) is subtitled "Language Models Can Teach Themselves to Use Tools." The deck walks through two steps with a Chinese example:

1. **Prompt the model to generate candidates (page 70)**: given the sentence "The district with the highest housing prices in Taipei is Da'an District," the model inserts a tool call: "The district with the highest housing prices in Taipei is [QA("Which Taipei district has the highest average price per unit?")]."
2. **Keep only verified data for fine-tuning (page 71)**: actually call the QA tool. If it returns "Da'an District," matching the rest of the sentence, the example is kept for fine-tuning. The deck uses this example only as an illustration; see the paper for the exact filtering rule.

Page 72 lists the tool set, QA, WikiSearch, Calculator, Calendar, and MT, on a task of completing a short statement with a missing fact such as a date or place. The conclusion on page 108 puts the two side by side: **WebGPT learns from human steps; Toolformer learns from data it generates itself.**

Pages 73–98 go on to the GPT Store, ChatGPT Plugins, recommendation, and SalesBot (steering chit-chat naturally into a task-oriented dialogue). None of these match a 2025 video title, so I do not expand on them.

## Three new 2025 videos: names only

The three videos below have no matching pages in the 2024 deck, and Fall 2025 published no slides. This post gives only their titles and subtitles:

- **13.6 Plan-and-Execute**: plan a strategy, then execute
- **13.7 User Interaction**: interacting with users beats working alone
- **13.8 Theory-of-Mind**: understanding what users are thinking

The planning thread connects back to the planning section of the deck in [post 14, Language Agents](/posts/ai/2026-09-30-ntu-adl2025-language-agents-en). For a fuller treatment, see CMU 11-768 under Further reading.

## How to evaluate dialogue (pages 99–106)

**Automatic evaluation (page 100)** compares the model's response with a gold response. The deck lists four measures: perplexity (how likely the model is to generate the gold response), n-gram overlap (BLEU and similar), slot error rate (whether the required slots are mentioned), and distinct n-grams (response diversity).

**Human evaluation comes in four forms (pages 101–104)**, varying along two axes: score one model or compare two, and judge a single response or a whole conversation.

| | Single response | Whole conversation |
|---|---|---|
| Rate 0–5 | Likert | Dynamic Likert |
| Pick one of two | A/B | A/B Dynamic |

All four judge humanness, fluency, and coherence. The two dynamic forms cite [ACUTE-EVAL (Li et al., 2019)](https://arxiv.org/abs/1909.03087), and A/B Dynamic amounts to dialogue-level evaluation.

**LLM-Eval (pages 105–106)** comes from Prof. Chen's own lab ([Lin & Chen, 2023](https://arxiv.org/abs/2305.13711)). The deck says LLMs are reasonably capable of judging dialogue responses, that LLM-Eval works well on both single-turn and multi-turn evaluation, and that it correlates better with human scores than all existing metrics. The conclusion: LLM-Eval scores can serve as a proxy for human evaluation.

**Try this**: next time you compare two chatbots, don't judge from one reply. Follow A/B Dynamic: take the same task, hold a full conversation with each, then pick a side on humanness, fluency, and coherence. Of the four human evaluations, it is the closest to real use.

## What this post can and cannot confirm

Confirmed: the nine videos' titles, Chinese subtitles, lengths, and descriptions (checked with YouTube oEmbed and yt-dlp); the titles and bullets of all 108 pages of the Fall 2024 ConvAI deck; the arXiv titles of the papers cited above.

Not confirmed: whether the Fall 2025 videos use this 2024 deck, or how much it changed. The content of videos 13.6–13.8. I did not transcribe the videos, so the lecturer's spoken asides and examples are not included. Figures such as 1.56T words and 1.5B conversations are restated from the deck; check the original papers for exact numbers.

## Further reading

- [CMU 11-768 Lecture 2: Tool Use](/posts/ai/2026-09-29-cmu-11768-lecture-02-tool-use-en) and [Lecture 5: Planning](/posts/ai/2026-09-29-cmu-11768-lecture-05-planning-en): newer coverage of tool use and planning that fills the 13.6 gap.
- [CS224N: RAG and Language Agents](/posts/ai/2026-08-22-cs224n-rag-language-agents-en).
- [CS224N: Benchmarks and Evaluation](/posts/ai/2026-08-22-cs224n-benchmark-evaluation-en) and [CME295: LLM Evaluation](/posts/ai/2026-09-29-cme295-llm-evaluation-en): more on LLM-as-judge.
- This series' [RAG + HW3](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3-en) also covers WebGPT; this post focuses on its tool-use side.

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en) | Previous: [Reasoning](/posts/ai/2026-09-30-ntu-adl2025-reasoning-en) | Next: [Beyond Supervised Learning and Multimodality](/posts/ai/2026-09-30-ntu-adl2025-beyond-supervised-multimodal-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The embedded videos match the lectures on the official course page and playlist.

## References

- [NTU Applied Deep Learning Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [2025 Fall NTU CSIE ADL playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o) (lectures in Mandarin)
- Videos: [13.1](https://youtu.be/8EV-Qw2iYYE), [13.2 LaMDA](https://youtu.be/LHhxbXKfnKs), [13.3 BlenderBot](https://youtu.be/B5s3XJIbQtc), [13.4 WebGPT](https://youtu.be/SVIgPfF16pE), [13.5 Toolformer](https://youtu.be/PdPK_f-aH3I), [13.6 Plan-and-Execute](https://youtu.be/FK-r_-dVHcI), [13.7 User Interaction](https://youtu.be/fzzOlH0t0_w), [13.8 Theory-of-Mind](https://youtu.be/rThWbHBA6e4), [13.9 Conversation Evaluation](https://youtu.be/gjiKrxiAyNI)
- [241030_ConvAI.pdf (Conversational Modeling, Fall 2024 deck)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/241030_ConvAI.pdf)
- [ADL Fall 2024 course page](https://www.csie.ntu.edu.tw/~miulab/f113-adl/)
- [LaMDA: Language Models for Dialog Applications (arXiv 2201.08239)](https://arxiv.org/abs/2201.08239)
- [Recipes for building an open-domain chatbot (BlenderBot, arXiv 2004.13637)](https://arxiv.org/abs/2004.13637)
- [BlenderBot 3 (arXiv 2208.03188)](https://arxiv.org/abs/2208.03188)
- [WebGPT: Browser-assisted question-answering with human feedback (arXiv 2112.09332)](https://arxiv.org/abs/2112.09332)
- [Toolformer: Language Models Can Teach Themselves to Use Tools (arXiv 2302.04761)](https://arxiv.org/abs/2302.04761)
- [ACUTE-EVAL (arXiv 1909.03087)](https://arxiv.org/abs/1909.03087)
- [LLM-Eval (arXiv 2305.13711)](https://arxiv.org/abs/2305.13711)
