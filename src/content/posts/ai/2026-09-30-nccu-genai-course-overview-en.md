---
title: "Reading NCCU Yen-Lung Tsai's Generative AI: Overview and Self-Study Route"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, course-guide, generative-ai, taiwan]
lang: en
series:
  name: "Reading NCCU Yen-Lung Tsai Generative AI"
  order: 0
tldr: "Generative AI: Text and Image Synthesis Principles and Practice is an introductory course taught by Yen-Lung Tsai (蔡炎龍) of NCCU's Department of Mathematical Sciences and opened to other schools as a TAICA satellite course. The most complete course page online actually belongs to the Chang Gung University satellite section, where Chih-Yuan Yang is the co-teacher. This series follows Spring 2025 (semester 1132): 14 recordings, 14 slide decks, and 12 homework specs with rubrics are public, and the demo notebooks are on GitHub, so the access grade is A3. The gaps: the notebooks keep changing, submission and grading run through each school's LMS, and final projects were never published."
description: "Entry post for NCCU Yen-Lung Tsai's Generative AI course: who owns the course and how the Chang Gung satellite page fits in, how TAICA satellite sections split the work, the A3 access grade for semester 1132 and its four gaps, how lectures map to homework weeks, three grading schemes, the Colab / OpenAI / Groq / AISuite / Gradio / diffusers / Fooocus tool stack, and what changes in the Fall 2026 (1151) syllabus."
draft: false
glossary:
  - term: "TAICA"
    aliases: ["Taiwan Artificial Intelligence College Alliance"]
    definition: "An alliance of Taiwanese universities for AI programs. A lead school's instructor streams the course live, and member schools let their own students enroll through satellite sections."
    context: "This course is one of TAICA's lead courses, offered by NCCU."
  - term: "satellite course"
    definition: "TAICA's enrollment model: the lead instructor provides streams, recordings, and slides, while each member school's co-teacher hires TAs and grades that school's students independently."
    context: "The Chang Gung course page exists because of this arrangement, and the homework rubrics come from it."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nccu-genai-course-overview)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

*Generative AI: Text and Image Synthesis Principles and Practice* (生成式 AI：文字與圖像生成的原理與實務) is taught by **Yen-Lung Tsai** (蔡炎龍) in the Department of Mathematical Sciences at National Chengchi University (NCCU). It is a lead course in [TAICA](https://taicatw.net/fall-115/), streamed live every Tuesday afternoon, and students at member schools can take it as a satellite course. It is taught in Mandarin.

The course has a clear audience: beginners with little programming background. They first learn the principles behind neural networks, GANs, large language models, RAG, AI agents, and diffusion image generation. Then they build chatbots, RAG systems, agents, and image-generation web apps in [Google Colab](https://colab.research.google.com/). Among the course guides on this site, it is one of the gentler entry points. Deeper material is linked out to other series.

This post is the series entry. It covers who runs the course, what outside readers can get, how lectures line up with homework, which tools you need, and what changes in Fall 2026. Each lecture gets its own post.

## Course video sources

This is a course overview or resource map with no single corresponding lecture. Use the official course entries and playlists to find recordings.

Course and recording entries:

- [Official course and recording entry](https://yangchihyuan.github.io/courses/GenerativeAI2025)

## Whose course is it: NCCU teaches it, the Chang Gung page is a satellite section

Search for this course and the most complete page you will find is [yangchihyuan.github.io/courses/GenerativeAI2025](https://yangchihyuan.github.io/courses/GenerativeAI2025). It lives on the CGU AICV Lab site of **Chih-Yuan Yang** (楊智淵), Department of Artificial Intelligence, Chang Gung University. It is not the lead instructor's site. It is the page for the **Chang Gung satellite section**.

The page says so itself:

- Offering school: NCCU; instructor: Yen-Lung Tsai
- Chih-Yuan Yang is listed as co-teacher, with two Chang Gung TAs
- Level: "master's course (NCCU combined undergrad/grad), but Chang Gung lists it as a first-year course"
- Textbook: "no textbook, only Prof. Tsai's recordings"

So this series attributes things like this. The recordings, slides, and demo notebooks all come from Tsai, so the course content is his. The weekly homework specs and rubrics are only public on the Chang Gung page, so every citation says "Chang Gung satellite version."

### How a TAICA satellite section divides the work

The [Fall 2026 syllabus PDF](https://drive.google.com/file/d/1hhigEPT9SdhJgtIpevACzSJsSNA0mw6T/view) (in Chinese) spells it out:

| Item | Syllabus text |
|---|---|
| Class size | 2,500, with 500 seats reserved for NCCU; no cap for member schools, and conditionally licensed schools set their own |
| TA ratio | One TA per 30 students at member schools |
| Co-teachers | "Do not need to follow the class live," but must find TAs and **grade all of their school's students independently** |
| Co-teacher background | Need not already know Python or generative AI well, because the full 1132 recordings and slides are public |

The last row is why self-learners can use this course. Tsai published the whole 1132 semester as prep material for co-teachers.

## Which semester: Spring 2025 (1132)

This series follows NCCU semester **1132 (February to June 2025)**. It is the only complete semester so far with recordings, slides, homework specs, and notebooks all public.

| Material | Status | Source |
|---|---|---|
| 14 live-stream recordings (about 2 h 45 min to 3 h 12 min each) | Public | [1132 YouTube playlist](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv) |
| 14 slide PDFs (GenAI01–GenAI14) | Public | [yenlung.me/1132GenAI](https://yenlung.me/1132GenAI) (redirects to a Google Drive folder) |
| Weekly schedule, 12 homework specs and rubrics | Public | [Chang Gung satellite page](https://yangchihyuan.github.io/courses/GenerativeAI2025) |
| Demo notebooks (Colab) | Public, but shared across courses and still changing | [yenlung/AI-Demo](https://github.com/yenlung/AI-Demo) |
| Submission and grading | Each school's platform (NCCU uses NTU COOL); not available to outsiders | GenAI01 slide 9 |

Every recording's YouTube description has a chapter timeline, which helps when you want one topic.

### Access grade: A3, with four gaps

On the A0–A3 scale from the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en), 1132 is **A3 (enough to self-study)**. You get recordings, slides, weekly homework specs and rubrics, and the demo notebooks most assignments are adapted from. Four gaps remain:

1. **The notebooks are not the semester's versions.** The [AI-Demo](https://github.com/yenlung/AI-Demo) repo describes itself as "demo files for AI workshops, talks, and so on." Tsai shares it across all his courses and workshops, and he kept editing it after the semester. For example, `【Demo01】設計你的神經網路.ipynb` was last committed on 2026-03-17. This series labels every notebook citation "current repo version."
2. **No grading.** Submissions go through each school's platform, so outside readers can only self-assess against the rubrics.
3. **Final projects exist only as rules.** Projects were presented at an online Gather Town conference, but no list of results was published.
4. **Slide text extracts badly.** Chinese fonts in the PDFs lose characters when extracted to plain text. Check the slide itself before quoting.

## How lectures map to homework

The Chang Gung page numbers homework by *week*, not by lecture. Weeks 5 (Transformers) and 15 (new trends) have no homework. Week 14 was NCCU's anniversary holiday, and week 13's homework is the final project proposal. That makes 12 assignments.

| Week | Date (2025) | Lecture topic | Homework (Chang Gung version) | This series |
|---|---|---|---|---|
| 1 | 2/18 | Course intro and generative AI overview | Plot a function in Colab | [L01](/posts/ai/2026-09-30-nccu-genai-01-why-generative-ai-en) |
| 2 | 2/25 | Neural network concepts | Design your own DNN digit classifier, not three layers | [L02](/posts/ai/2026-09-30-nccu-genai-02-neural-networks-en) |
| 3 | 3/4 | GANs, once all the rage | Pick one: run a GAN, or explain cross entropy and KL divergence | [L03](/posts/ai/2026-09-30-nccu-genai-03-gan-en) |
| 4 | 3/11 | LLMs are simpler than you think | Build your own benchmark prompts, compare at least two LLMs | [L04](/posts/ai/2026-09-30-nccu-genai-04-llm-next-token-en) |
| 5 | 3/18 | Transformers, the full tour | None | [L05](/posts/ai/2026-09-30-nccu-genai-05-transformers-math-en) |
| 6 | 3/25 | LLM applications and ethical challenges | A chatbot with a persona via the OpenAI API, shown in Gradio | [L06](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics-en) |
| 7 | 4/1 | Build your own chatbot | Pick one: multi-turn version, or two models talking to each other | [L07](/posts/ai/2026-09-30-nccu-genai-07-build-chatbot-en) |
| 8 | 4/8 | RAG: principles and practice | A RAG system on your own data | [L08](/posts/ai/2026-09-30-nccu-genai-08-rag-en) |
| 9 | 4/15 | Why 2025 is called the year of AI agents | Pick one: Planning (CoT rewrite) or Reflection pattern | [L09](/posts/ai/2026-09-30-nccu-genai-09-ai-agents-en) |
| 10 | 4/22 | An adventure that starts with VAEs | Text-to-image with Bing, several sets in one consistent style | [L10](/posts/ai/2026-09-30-nccu-genai-10-vae-to-diffusion-en) |
| 11 | 4/29 | Text-to-image AI: principles and practice | An image-generation web app with an SD1.5 model from Hugging Face | [L11](/posts/ai/2026-09-30-nccu-genai-11-text-to-image-en) |
| 12 | 5/6 | ControlNet and Fooocus | Imagine a use case, generate at least 3 sets in Fooocus, document the workflow | [L12](/posts/ai/2026-09-30-nccu-genai-12-controlnet-fooocus-en) |
| 13 | 5/13 | Reinforcement learning and generative AI | Final project proposal | [L13](/posts/ai/2026-09-30-nccu-genai-13-reinforcement-learning-en) |
| 14 | 5/20 | NCCU anniversary, no class | — | — |
| 15 | 5/27 | New trends in generative AI | None | [L14](/posts/ai/2026-09-30-nccu-genai-14-new-trends-en) |
| 16 | 6/3 | Conference-style final project showcase | — | Covered in L14 |

Two mismatches are worth knowing up front. Week 6's homework (an OpenAI API chatbot) sits under the ethics lecture, but its content leads into lecture 7. Week 10's homework (Bing image generation) sits under the VAE lecture, and diffusion itself is only explained in lecture 11.

### One course, three grading schemes

TAICA lets each school grade independently, so the same homework weighs differently from school to school:

| Version | Homework | Final project | Participation | Source |
|---|---|---|---|---|
| NCCU 1132 | 70% | 25% | 5% | GenAI01 slide 115 |
| Chang Gung satellite 1132 | 100% (mean of 12) | 0% | 0% | Chang Gung page |
| NCCU 1151 (Fall 2026) | Homework and reflection 75% | 20% | 5% | Fall 2026 syllabus |

The Chang Gung page explains the 0% for the final project. About 90% of that section were seniors, the school required grades by 5/29, and the final project was due 6/2. NCCU also offers "lightning talk" bonus credit: GenAI01 slide 116 says it adds 2 points to the semester grade.

All three versions share one definition of plagiarism. The course encourages working with LLMs, but it rejects "a result you could get from a single prompt" handed in as homework. The Fall 2026 syllabus turns this into a cap: work at that level gets at most 3 of 10 points.

## Tools you need

| Tool | Where it is used | Source |
|---|---|---|
| [Google Colab](https://colab.research.google.com/) | Every assignment; the free tier should be enough | Chang Gung page, "course requirements"; GenAI01 part 3 |
| [OpenAI API](https://platform.openai.com/) | Chatbots, RAG, agents; topping up is suggested (not required), and the syllabus says US$5 is plenty | Chang Gung page, Fall 2026 syllabus |
| [Groq API](https://console.groq.com/) | Has a completely free plan; the Fall 2026 syllabus asks every student to sign up | Fall 2026 syllabus |
| [AISuite](https://github.com/andrewyng/aisuite) | One interface for calling several LLM providers; both agent demos use it | `【Demo07a】`, `【Demo07c】` notebooks |
| [Gradio](https://www.gradio.app/) | Nearly every assignment asks for a Gradio demo | Notebooks from `【Demo01】` on |
| LangChain + FAISS | Only in the two RAG notebooks | `【Demo06a】`, `【Demo06b】` |
| [diffusers](https://huggingface.co/docs/diffusers) | Text-to-image | `【Demo08】` |
| [Fooocus](https://github.com/lllyasviel/Fooocus) | The week 12 image workflow | GenAI12, week 12 homework |

One common misreading needs correcting. The 1132 course summary lists AutoGen and LangChain as tools. Open the materials, though, and the GenAI09 slides put LangChain, AutoGen, and CrewAI in an "advanced learning" list. The agent demos use AISuite plus Gradio. The course has no AutoGen implementation.

## What changes in Fall 2026 (1151)

Semester 1151 is streaming now, and its access grade is **A2**. The syllabus and slides ([yenlung.me/1151GenAI](https://yenlung.me/1151GenAI)) are public, and recordings go up as the term runs. As of 2026-09-30, the 1151 playlist on the [channel](https://www.youtube.com/@ive-iveai) has 5 items. One is hidden, and the 4 viewable titles are: 1. How to learn AI without anxiety, 2. The dopey AI robot, 3. Why AI answers differently every time, 4. LLMs are just guessing the next word. The final showcase is scheduled for 2026-12-22.

Compared with 1132, the syllabus changes cluster in the second half:

| Week | 1132 | 1151 syllabus |
|---|---|---|
| 7 | Build your own chatbot | Same title, now explicitly with AISuite |
| 8 | RAG | Guest expert talk |
| 9 | AI agents | RAG, explicitly "based on LangChain" |
| 10 | VAE | Agentic AI and AI agents, built with AISuite |
| 13 | Reinforcement learning and generative AI | Advanced diffusion techniques with Fooocus |
| 14 | Anniversary holiday | Popular generative AI tools and use cases |

The reinforcement learning week is gone. AutoGen in the tool list is replaced by AISuite, and every student must now sign up for a Groq API key. This series will decide whether to add a comparison post once 1151 ends.

## Suggested self-study route

1. **Set up accounts first.** Get a Google account (Colab) and a Groq API key. If you want the easy path, put a small amount of credit on OpenAI.
2. **One lecture per week.** Watch the first two sessions of each recording, run the matching demo notebook, then do the homework against the Chang Gung rubric. The high-scoring condition is usually "make it your own." Copying the demo earns only the base score.
3. **Keep your homework in Colab.** The Chang Gung page asks for a Colab link plus key notes and screenshots. Doing the same as a self-learner gives you a learning log.
4. **Skip the math week if you need to.** L05's Transformer math has no homework. Readers who want to avoid matrices can read L06 first and come back later.

One thing to do tonight: open [GenAI01](https://yenlung.me/1132GenAI), go to slide 81, and run those four standard import lines in a new Colab notebook. The first assignment starts there.

## Posts in this series

| Order | Post |
|---|---|
| 0 | Overview and self-study route (this post) |
| 1 | [L01 Why study generative AI: course intro and Colab](/posts/ai/2026-09-30-nccu-genai-01-why-generative-ai-en) |
| 2 | [L02 Neural network concepts](/posts/ai/2026-09-30-nccu-genai-02-neural-networks-en) |
| 3 | [L03 GANs, once all the rage](/posts/ai/2026-09-30-nccu-genai-03-gan-en) |
| 4 | [L04 LLMs are simpler than you think](/posts/ai/2026-09-30-nccu-genai-04-llm-next-token-en) |
| 5 | [L05 Transformers, the full tour](/posts/ai/2026-09-30-nccu-genai-05-transformers-math-en) |
| 6 | [L06 LLM applications and ethical challenges](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics-en) |
| 7 | [L07 Build your own chatbot](/posts/ai/2026-09-30-nccu-genai-07-build-chatbot-en) |
| 8 | [L08 RAG: principles and practice](/posts/ai/2026-09-30-nccu-genai-08-rag-en) |
| 9 | [L09 Why 2025 is the year of AI agents](/posts/ai/2026-09-30-nccu-genai-09-ai-agents-en) |
| 10 | [L10 An adventure that starts with VAEs](/posts/ai/2026-09-30-nccu-genai-10-vae-to-diffusion-en) |
| 11 | [L11 Text-to-image AI: principles and practice](/posts/ai/2026-09-30-nccu-genai-11-text-to-image-en) |
| 12 | [L12 ControlNet and Fooocus](/posts/ai/2026-09-30-nccu-genai-12-controlnet-fooocus-en) |
| 13 | [L13 Reinforcement learning and generative AI](/posts/ai/2026-09-30-nccu-genai-13-reinforcement-learning-en) |
| 14 | [L14 New trends and the final project](/posts/ai/2026-09-30-nccu-genai-14-new-trends-en) |

## Further reading

Each lecture here stands on its own. These series on the site are only for when you want to dig deeper:

- A fuller treatment of neural network basics: [Reading CMU 11-785](/posts/ai/2026-08-22-cmu-11785-course-overview-en)
- LLMs and Transformers: [Stanford CS224N](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en), [Stanford CME295](/posts/ai/2026-09-29-stanford-cme295-transformers-llms-en), [Stanford CS336](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en), [NTU Hung-yi Lee's Machine Learning 2026](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en)
- RAG: [The complete guide to RAG patterns](/posts/ai/2026-03-14-rag-patterns-complete-guide-en)
- AI agents: [Reading CMU 11-768](/posts/ai/2026-09-29-cmu-11768-course-overview-en); MCP's actual name and design: [MCP (Model Context Protocol)](/posts/ai/2026-03-22-mcp-model-context-protocol-en)
- Diffusion math: [Reading MIT 6.S184](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en); visual generation: [Reading Stanford CS231N](/posts/ai/2026-09-30-cs231n-course-overview-en)
- Reinforcement learning: [Berkeley CS285: imitation learning and RL basics](/posts/learning/2026-08-22-berkeley-cs285-imitation-rl-basics-en)
- How open each school's courses are: [Global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Chang Gung satellite course page: Generative AI 2025](https://yangchihyuan.github.io/courses/GenerativeAI2025) (in Chinese) — instructor, co-teacher, weekly schedule, 12 homework specs and rubrics, Chang Gung's grading changes
- [1132 YouTube playlist](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv) (in Mandarin) — 14 live-stream recordings with chapter timelines
- [1132 slide folder (yenlung.me/1132GenAI)](https://yenlung.me/1132GenAI) (in Chinese) — GenAI01–GenAI14 PDFs; NCCU 1132 grading on GenAI01 slides 115–116
- [yenlung/AI-Demo](https://github.com/yenlung/AI-Demo) — course demo notebooks, shared across courses and still updated
- [Fall 2026 syllabus PDF](https://drive.google.com/file/d/1hhigEPT9SdhJgtIpevACzSJsSNA0mw6T/view) (in Chinese) — class size, TA ratio, co-teacher duties, 1151 schedule, grading and requirements
- [TAICA Fall 2026 (academic year 115, term 1) course list](https://taicatw.net/fall-115/) (in Chinese) — level, ★★ difficulty, satellite format, showcase date
- [Iveai - I've AI YouTube channel](https://www.youtube.com/@ive-iveai) (in Mandarin) — 1132 and 1151 playlists
- [1151 slide folder (yenlung.me/1151GenAI)](https://yenlung.me/1151GenAI) (in Chinese) — Fall 2026 slides uploaded so far
