---
title: "NCCU Yen-Lung Tsai Generative AI L14: Text and Image Models Invade Each Other's Territory, Plus the Final Project"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, generative-ai, ai-course, image-generation, diffusion-model, reasoning, vibe-coding]
lang: en
series:
  name: "Reading NCCU Yen-Lung Tsai Generative AI"
  order: 14
tldr: "The last lecture looks at two lines of technology crossing into each other. LLMs such as ChatGPT have started drawing, and the slides use early fusion plus VQ-VAE/VQGAN to explain how an image can be cut into tokens. Going the other way, Inception Labs' Mercury generates text with diffusion, noising a sentence into a row of [MASK] tokens and then restoring it. Next come a few papers anyone can use: evaluating RAG automatically, reasoning models being easier to hijack, and DeepMind's four kinds of AI risk. The lecture ends with vibe coding and a list of application tools, and the final project runs as an online conference in Gather Town."
description: "A guide to lecture 14 of NCCU Professor Yen-Lung Tsai's 'Generative AI: Text and Image Synthesis Principles and Practice' (Spring 2025, term 1132): how LLMs generate images (tokenizers, BPE, early fusion, VQ-VAE, VQGAN), diffusion LLMs (Inception Mercury, [MASK] noising and denoising for text, Gemini Diffusion), automatic RAG evaluation and the safety risks of reasoning models, DeepMind's four AI risks, vibe coding and tools such as NotebookLM, and the Gather Town final project rules from the 1132 Chang Gung satellite page and the Fall 2026 syllabus."
draft: false
glossary:
  - term: "VQ-VAE"
    aliases: ["Vector Quantized VAE"]
    definition: "A VAE whose latent vectors must be chosen from a finite codebook. The image is cut into patches, each patch maps to a codebook index, and the whole image becomes a sequence of indices that a transformer can handle like text tokens."
    context: "L14 uses it to show one way an image tokenizer can work when an LLM generates images."
  - term: "Diffusion LLM"
    aliases: ["diffusion language model"]
    definition: "A language model that generates text with diffusion: noising means gradually replacing words with [MASK], and the model learns to restore the text step by step from all [MASK]s, producing the whole passage at once rather than one word after another."
    context: "L14 uses Inception Labs' Mercury as the example and mentions Google's announced Gemini Diffusion."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nccu-genai-14-new-trends)

**Video status: Videos included.** [Source details](#course-video-sources)

**This post is based on the Spring 2025 offering (NCCU term 1132) of Yen-Lung Tsai's "Generative AI: Text and Image Synthesis Principles and Practice" at National Chengchi University.** It is part 14, the final lecture, of the [Reading NCCU Yen-Lung Tsai Generative AI](/posts/ai/2026-09-30-nccu-genai-course-overview-en) series and follows [L13: Reinforcement Learning and Generative AI Applications](/posts/ai/2026-09-30-nccu-genai-13-reinforcement-learning-en).

I used four official sources: the [lecture 14 recording](https://www.youtube.com/watch?v=AOLoR3p2Z0Q) (2025-05-27, 3 h 9 min), the slide deck [GenAI14 生成式 AI 新趨勢](https://drive.google.com/file/d/14gA0kgjU0E4Fyb7bOcZpg4TZwTN9KnWv/view) (60 slides, in Chinese), the schedule and final project notes on the [Chang Gung satellite section page](https://yangchihyuan.github.io/courses/GenerativeAI2025) (in Chinese), and weeks 15–16 plus the grading section of the [Fall 2026 (1151) syllabus](https://drive.google.com/file/d/1hhigEPT9SdhJgtIpevACzSJsSNA0mw6T/view) (in Chinese).

Access level is **A3**, with two gaps worth stating up front. First, the second half of the recording had on-site technical problems; the video description says to "refer to the slides for the second half" and lists the matching slide numbers. Second, only the final project rules are public; the list of 1132 projects is not.

## Course video sources

Video sources were checked against the official course page and rechecked live on 2026-10-10: lecture and video match, and the YouTube videos are public and embeddable. No timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=AOLoR3p2Z0Q
title: 【生成式 AI】14. 生成式 AI 新趨勢 (YouTube recording, 2025-05-27)
```

Original videos: [【生成式 AI】14. 生成式 AI 新趨勢 (YouTube recording, 2025-05-27)](https://www.youtube.com/watch?v=AOLoR3p2Z0Q)

Course and recording entries:

- [Official course and recording entry](https://yangchihyuan.github.io/courses/GenerativeAI2025)

Checked: 2026-10-10.

## Where this week sits in the course

On the Chang Gung schedule this lecture falls in week 15 (May 27). Week 14 (May 20) was NCCU's anniversary holiday, with no class. There is no homework, and the following week (June 3) is the final project showcase.

The first half of the course covered text generation (L04–L09) and the second half image generation (L10–L12). L14 looks back at both and finds them **invading each other's territory**. The Fall 2026 syllabus states the theme for this week even more plainly: text generation uses models that predict tokens, image generation uses diffusion models, the two are "taking over" each other's ground, and the week explores the principles behind this and why things might be heading that way.

The deck has four parts: LLMs start generating images? (slides 2–21), diffusion comes to text generation?! (slides 22–31), new research anyone can use (slides 32–40), and applications of generative AI (slides 41–60).

## LLMs start generating images?

### What happened: ChatGPT crosses into image generation

The slides open with a string of examples: turning a photo into Studio Ghibli style, making a Nikon F into a miniature model held in someone's hand, turning the course mascot "DIVE" into a 3D cartoon, and a long prompt describing a chibi café shaped like a takeaway coffee cup. The point is that prompts can be very precise, down to specific characters and manga styles. And it isn't only ChatGPT; the slides also show images from Gemini, Grok, and Mistral Le Chat.

### How: treat images as a kind of language

Tsai then reviews how LLMs work (L04–L05): a tokenizer turns text into a sequence of IDs, which go through an embedding layer and into a transformer. The common way to split English is **BPE** (Byte Pair Encoding): splitting by character makes sequences too long, while splitting by word makes the vocabulary too large. To see real splits, try [OpenAI's tokenizer page](https://platform.openai.com/tokenizer); different generations of ChatGPT split differently.

So how do images get into an LLM? The slides' answer is **early fusion**: treat images as a kind of "language" and feed image tokens and text tokens into the same transformer. The question becomes: how do you build an image tokenizer?

One way the slides present is **VQ-VAE**:

1. It is a VAE, with an encoder, latent vectors, and a decoder (covered in L10)
2. The difference is that the latent vector has only a finite set of choices: a codebook e₁, e₂, …, e_K
3. Each patch of the image is matched to its nearest codebook vector, so the whole image becomes a sequence of IDs such as 37, 5, 76, 12…

Add a GAN discriminator (covered in L03) to improve image quality and you get **VQGAN**. With this tokenizer, a transformer can predict the next token just as in text generation, and a generator turns the predicted tokens back into an image.

Note that the slides explain how an LLM *could* generate images this way. They don't say which architecture ChatGPT actually uses.

## Diffusion comes to text generation?!

The crossing in the other direction is [Inception Labs' Mercury](https://www.inceptionlabs.ai/), which generates text with a diffusion model. The slides observe that it currently focuses mostly on code generation and give a link to try it: [chat.inceptionlabs.ai](https://chat.inceptionlabs.ai/).

First, recall image diffusion from L11: add Gaussian noise to a clean photo step by step until it is pure noise, then restore it step by step when generating.

How do you add noise to text? The slides show it with one sentence ("Professor Yen-Lung is funny"), replacing one word with [MASK] at each step:

```text
炎龍老師很好笑
→ 炎龍老師很[MASK]
→ 炎龍老師[MASK][MASK]
→ 炎龍[MASK][MASK][MASK]
→ [MASK][MASK][MASK][MASK]
```

Restoration is denoising. Given the prompt "Professor Yen-Lung is…", the [MASK] might be restored as "cute," "funny," or "an idiot." The slides stress that **this is not a simple fill-in-the-blank game.**

Diffusion LLMs have two traits: they are **fast and generate everything at once**, and they **consider the whole passage rather than producing one word at a time**. Mercury sparked some discussion when it came out, but the first reaction was "LLMs are so good already, who cares?" Then it turned out that "traditional" LLMs could also draw, and things turned around when Google announced Gemini Diffusion. At 1:31:37 the recording also mentions an open-source multimodal diffusion LLM called "Dimple," which isn't on the slides.

<details>
<summary>If you want Mercury's technical details</summary>

Inception Labs published a technical report in June 2025, [Mercury: Ultra-Fast Language Models Based on Diffusion](https://arxiv.org/abs/2506.17298), after this lecture. For the training objective of diffusion LLMs and the cost of parallel decoding, see the site's [CME295 Lecture 8](/posts/ai/2026-09-29-cme295-diffusion-llms-en).

</details>

## New research anyone can use

Part three covers a few papers from the first half of 2025. Because of the technical problems, the video description for this stretch lists slide numbers instead, so it is best to follow along with the slides.

**Automatic RAG scoring (slides 33–34)**: citing [Can LLMs Be Trusted for Evaluating RAG Systems?](https://arxiv.org/abs/2504.20119), the slides list four ways to have AI score automatically:

| Method | How it works |
|---|---|
| Have an LLM give a score | Directly output a score, e.g. 3.5 |
| Head-to-head comparison | Decide which of two answers is better |
| Chain-of-thought | Check step by step, then conclude |
| Check for grounding | Verify whether sentences in the answer appear in the retrieved material |

The slides add a caveat: automatic evaluation shouldn't be the only standard.

**Strong reasoning, also a risk? (slide 35)**: citing [H-CoT](https://arxiv.org/abs/2502.12893) (hijacking the chain of thought). The slide's summary: models without "thinking" correctly refuse requests such as criminal strategies 98% of the time, but models with thinking, when hit by the H-CoT attack, refuse only 2% of the time.

**Three more (slides 36–38)**: a survey on AI as persuader and persuadee ([arXiv 2505.07775](https://arxiv.org/abs/2505.07775); the slide calls it a Systematic Survey, while its current arXiv title is A Comprehensive Survey of Computational Persuasion); [chain-of-thought improves reasoning but lowers instruction-following](https://arxiv.org/abs/2505.14810); and the system prompts that [Anthropic](https://docs.anthropic.com/en/release-notes/system-prompts) and [xAI](https://github.com/xai-org/grok-prompts) have published for Claude and Grok.

**DeepMind's four AI risks (slides 39–40)**: citing DeepMind's April 2025 post [Taking a responsible path to AGI](https://deepmind.google/discover/blog/taking-a-responsible-path-to-agi/):

| Risk | Main cause according to the slide |
|---|---|
| Misuse | Humans with bad intent tell an AI to do something harmful |
| Misalignment | AI and human values diverge; the AI itself does the (harmful) thing |
| Mistakes | The world is complex and unforeseen bugs happen; the AI errs unintentionally |
| Structural risks | Multiple AI agents interacting with humans create structural problems: each AI "does the right thing," yet together they go wrong |

## Applications: vibe coding and a list of tools

The last part (slides 41–60) is nearly identical to part three of the L13 deck. The L13 recording covers it from 1:54:30, and the L14 recording has a live demo with HTML, CSS, and JavaScript at 1:16:05.

### Vibe coding

In February 2025, Andrej Karpathy coined the term **vibe coding** in a [post on X](https://x.com/karpathy/status/1886192184808149383). The slides boil his description down to five lines:

- Tell the LLM "halve the sidebar padding"
- It makes the change and you just accept it (too lazy to find the code)
- An error? Paste the error message and it fixes itself
- A bug it can't fix? Change things randomly a few times and it goes away
- In the end you don't really know how the project got done

The slides also quote Merriam-Webster's definition: telling an AI what you want and letting it write the code; the programmer doesn't need to understand how or why the code works and usually has to accept a certain number of errors. They list a row of playful Chinese translations, from "casual programming" to "slacker programming," with the literal rendering being "atmosphere programming."

The tools listed are Windsurf, Cursor, and Canva, and the demo task is "design a calculator web app."

### Other application tools

| Tool | How the slides use it |
|---|---|
| [Google Labs: Little Language Lessons](https://labs.google/lll/) | Describe a situation and it generates a language lesson with example sentences and usage notes |
| [NotebookLM](https://notebooklm.google/) | Feed it slides introducing RAG/AI agents and generate a podcast |
| Perplexity, Felo | The "search camp," known for browsing; they break a question down before searching and can be thought of as AI agents. Perplexity can switch models and do Deep Research; Felo can generate interactive web pages |
| [Napkin AI](https://www.napkin.ai/) | Quickly visualize an idea, offering several diagram options to choose from |
| Suno | An AI that composes music; the slides first have ChatGPT write K-Pop-style lyrics promoting this course, then hand them to Suno |

The slides also point out that Claude, Grok, Le Chat, ChatGPT, and Gemini can all browse now, and that Perplexity from the "search camp" is gradually becoming an all-rounder.

## Final project: an online conference in Gather Town

There are two public versions of the final project rules.

**The 1132 Chang Gung satellite page** says: Tsai planned for every student to complete a generative AI application project, presented as an online conference in Gather Town. Students take part by submitting; selected students present at the final showcase and earn bonus points. The planned submission date was June 2. Because 90% of the Chang Gung section were seniors whose grades had to be uploaded by May 29, the co-instructor changed the final project weight from 20% to 0%. The lecture 12 recording has a "final showcase" segment at 17:30 and "final project submission" at 2:19:32, where you can hear Tsai explain it himself.

**The Fall 2026 (1151) syllabus** is more detailed:

- The final project is 20% of the grade, and every student completes a generative AI application project
- The showcase is an online conference on Gather.town, in week 16 (2026/12/22)
- The lead course selects presenters from student submissions, and those selected earn bonus points
- Co-instructors of satellite sections can set their own participation rules, such as whether every student must present
- Presenters record a short video, ideally two or three minutes and no more than 5; attendees who walk up to a booth see the video, so presenters don't need to repeat themselves
- Co-instructors may also set participation requirements, for example watching at least ten presentations from different schools, choosing the best three, and explaining why

The list of 1132 final projects isn't public, so this series doesn't cover it.

**For self-study:** start from your [L13](/posts/ai/2026-09-30-nccu-genai-13-reinforcement-learning-en) proposal and make a demo video of three minutes or less, following the 1151 spec. The spec is a useful constraint in itself: a project you can't explain in three minutes is usually too big.

## Self-check

1. Why does an LLM need an "image tokenizer" before it can generate images?
2. How does VQ-VAE differ from the ordinary VAE in L10?
3. What plays the role of "noise" in text diffusion, and why do the slides say it isn't just fill-in-the-blank?
4. Of the four automatic RAG scoring methods on the slides, which one most directly targets hallucination?
5. Among DeepMind's four risks, what separates "mistakes" from "misalignment"?

<details>
<summary>Suggested answers</summary>

1. A transformer only processes sequences of token IDs. An image has to become a sequence of IDs before it can go in alongside text tokens and before "predict the next token" makes sense.
2. An ordinary VAE has continuous latent vectors; VQ-VAE's latents must come from a finite codebook, so each image patch maps to an integer ID.
3. [MASK] replaces the original words. When denoising, the model considers the whole passage at once rather than just filling blanks from left context, and it can restore several positions in one step.
4. "Check for grounding": verify whether the answer's content appears in the retrieved material.
5. "Mistakes" are unintentional errors caused by a complex world; "misalignment" means the AI's values differ from ours and it does harmful things on its own.

</details>

## Further reading

This post stands on its own. To dig deeper:

- Training objectives and decoding for diffusion LLMs: [CME295 Lecture 8: Diffusion LLMs](/posts/ai/2026-09-29-cme295-diffusion-llms-en)
- How multimodal models turn images into tokens: [CS336 Lecture 17: Multimodal models](/posts/ai/2026-08-22-cs336-multimodal-alignment-en)
- Choosing RAG evaluation tools: [RAG evaluation frameworks and tool selection](/posts/ai/2026-03-12-rag-evaluation-frameworks-en)
- Course map: [Global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)

Series navigation: [series overview](/posts/ai/2026-09-30-nccu-genai-course-overview-en) | previous, [L13: Reinforcement Learning and Generative AI Applications](/posts/ai/2026-09-30-nccu-genai-13-reinforcement-learning-en) | this is the last post in the series

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Matched against the official course page and YouTube: lecture and embedded videos agree and are publicly embeddable, so status is now Videos included.

## References

- [Chang Gung satellite section page: 生成式AI：文字與圖像生成的原理與實務 2025 (schedule, final project notes)](https://yangchihyuan.github.io/courses/GenerativeAI2025) (in Chinese)
- [【生成式 AI】14. 生成式 AI 新趨勢 (YouTube recording, 2025-05-27)](https://www.youtube.com/watch?v=AOLoR3p2Z0Q) (in Chinese)
- [1132 Generative AI recording playlist](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv) (in Chinese)
- [GenAI14 生成式 AI 新趨勢 slides (Google Drive)](https://drive.google.com/file/d/14gA0kgjU0E4Fyb7bOcZpg4TZwTN9KnWv/view) (in Chinese)
- [1132 slide folder entry point (yenlung.me/1132GenAI)](https://yenlung.me/1132GenAI)
- [Fall 2026 (1151) syllabus PDF (Google Drive)](https://drive.google.com/file/d/1hhigEPT9SdhJgtIpevACzSJsSNA0mw6T/view) (in Chinese)
- [TAICA Fall 2026 course list](https://taicatw.net/fall-115/) (in Chinese)
- [Inception Labs: Mercury: Ultra-Fast Language Models Based on Diffusion (2025)](https://arxiv.org/abs/2506.17298)
- [Can LLMs Be Trusted for Evaluating RAG Systems? A Survey of Methods and Datasets](https://arxiv.org/abs/2504.20119)
- [H-CoT: Hijacking the Chain-of-Thought Safety Reasoning Mechanism to Jailbreak Large Reasoning Models](https://arxiv.org/abs/2502.12893)
- [Must Read: A Comprehensive Survey of Computational Persuasion](https://arxiv.org/abs/2505.07775)
- [Scaling Reasoning, Losing Control: Evaluating Instruction Following in Large Reasoning Models](https://arxiv.org/abs/2505.14810)
- [Google DeepMind: Taking a responsible path to AGI (2025-04-02)](https://deepmind.google/discover/blog/taking-a-responsible-path-to-agi/)
- [Andrej Karpathy's post on X coining vibe coding (2025-02-02)](https://x.com/karpathy/status/1886192184808149383)
