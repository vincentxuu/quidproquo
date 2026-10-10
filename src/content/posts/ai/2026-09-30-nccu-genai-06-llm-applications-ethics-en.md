---
title: "Reading NCCU Yen-Lung Tsai Generative AI, L06: LLM Applications and Ethical Challenges — Hallucination, Privacy, DeepSeek, and a One-Paragraph System Prompt Called the Lucky Vicky Generator"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, course-guide, generative-ai, llm, hallucination, ai-ethics, privacy, prompt-engineering, llm-api]
lang: en
series:
  name: "Reading NCCU Yen-Lung Tsai Generative AI"
  order: 6
tldr: "The first half of L06 is about ethics. Yen-Lung Tsai quotes Karpathy's line that hallucination is a feature of LLMs, then works through plagiarism, whether your data gets used for training, and DeepSeek's censorship and corpus skew, and closes with seven principles of responsible use. The second half is about applications: give the model the right information and clear instructions, and one system prompt becomes a Lucky Vicky positivity generator, a social-media copywriter, or a biased college-major counselor. The week-6 assignment moves that prompt into an OpenAI-compatible API with a Gradio front end: a chatbot with a persona."
description: "A guide to lecture 6 of NCCU Yen-Lung Tsai's Generative AI: Text and Image Synthesis Principles and Practice (semester 1132, Spring 2025), based on video 06, the 57-page GenAI06 slides, and Demo04 from the AI-Demo repo: Gemma 3, Karpathy on hallucination, whether ChatGPT is conscious, plagiarism and privacy, DeepSeek and Perplexity's R1-1776, the H-CoT attack, seven principles of responsible use, the two parts of a prompt, the Lucky Vicky generator, the three message roles and OpenAI-compatible APIs, plus the week-6 assignment and rubric from the Chang Gung satellite section."
draft: false
glossary:
  - term: "system prompt"
    aliases: ["persona", "system message"]
    definition: "The message with role system in a chat API call. It sets the model's role, tone, and rules; users don't see it, but it is sent with every request."
    context: "In GenAI06 Tsai calls it the chatbot's persona (人設)."
  - term: "Gradio"
    definition: "A Python library that wraps a function in a web UI in a few lines. In Colab, share=True creates a temporary public URL."
    context: "From week 6 on, every assignment in this course requires a Gradio demo."
    links:
      - label: "Gradio"
        url: "https://www.gradio.app/"
---

> 🌏 [中文版](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

**This post is based on the 1132 semester (Spring 2025) of NCCU Yen-Lung Tsai's *Generative AI: Text and Image Synthesis Principles and Practice*.** It is part 6 of the [Reading NCCU Yen-Lung Tsai Generative AI](/posts/ai/2026-09-30-nccu-genai-course-overview-en) series and follows [L05, Transformers in Full](/posts/ai/2026-09-30-nccu-genai-05-transformers-math-en). The last lecture took Q/K/V apart as matrices. This one steps back into the user's seat: what goes wrong with LLMs, how to use them responsibly, and how to turn one into your own small tool through an API.

Four official sources: [video 06](https://www.youtube.com/watch?v=m6DFB60Tk68) (2025-03-25, about 3 h 4 min, in Mandarin), the 57-page GenAI06 slides (in the instructor's [slide folder](https://drive.google.com/drive/folders/1c6A9Pa-c7cNi5kHUp7j-ccgYBRy9JpeA)), the notebook [`【Demo04】用OpenAI_API打造員瑛式思考生成器`](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo04%E3%80%91%E7%94%A8OpenAI_API%E6%89%93%E9%80%A0%E5%93%A1%E7%91%9B%E5%BC%8F%E6%80%9D%E8%80%83%E7%94%9F%E6%88%90%E5%99%A8.ipynb) in the [AI-Demo](https://github.com/yenlung/AI-Demo) repo, and the week-6 assignment on the [Chang Gung satellite course page](https://yangchihyuan.github.io/courses/GenerativeAI2025). Access level: **A3**. Videos, slides, notebooks, and assignment text are all public. The notebooks live in a repo shared across many workshops, though, so **everything below refers to the current repo version, which may have changed since the semester ended.**

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=m6DFB60Tk68
title: Generative AI 06: LLM applications and ethical challenges (YouTube recording, in Mandarin)
```

Original videos: [Generative AI 06: LLM applications and ethical challenges (YouTube recording, in Mandarin)](https://www.youtube.com/watch?v=m6DFB60Tk68)

Course and recording entries:

- [Official course and recording entry](https://yangchihyuan.github.io/courses/GenerativeAI2025)

## Where this week sits

Video 06 has three sessions. Session one (roughly 0:16–1:01) covers new models and ethics. Session two (1:11–2:01) covers prompt design and live coding. Session three is student lightning talks and feedback on the week-3 assignment. The slides follow the same order in three parts: "LLM problems and discussion", "Customizing your LLM with good prompts", and "Building your own chatbot with the OpenAI API".

This is where the course turns from principles to applications. The next three lectures ([L07 chatbots](/posts/ai/2026-09-30-nccu-genai-07-build-chatbot-en), [L08 RAG](/posts/ai/2026-09-30-nccu-genai-08-rag-en), [L09 AI agents](/posts/ai/2026-09-30-nccu-genai-09-ai-agents-en)) all build on the few lines of API code at the end of this one.

## Opening: Gemma 3 and running open models

Slides 4–6 open with the news of the week, [Google Gemma 3](https://ai.google.dev/gemma/docs/core): sizes from 1B to 27B, multimodal except for 1B, a 128K context window, and support for 140 languages. Slide 5 has a table of GPU/TPU requirements per size and precision. Tsai's point is that open models are now small enough to run yourself, a thread L07 picks up with Ollama.

## Concept 1: is hallucination a bug or a feature?

Slides 8–9 quote Andrej Karpathy: in some sense, hallucination is all LLMs do. They are dream machines. A search engine is 0% dreaming but creates nothing. What we actually mean is that we don't want an LLM **assistant** to hallucinate.

That turn matters. Recall [L04](/posts/ai/2026-09-30-nccu-genai-04-llm-next-token-en): an LLM guesses one token at a time from probabilities, not from a verified fact base. Making things up and creating things are the same mechanism. So you reduce an assistant's hallucinations by feeding it correct information from outside, not by making the model "more honest". That is exactly where [L08 RAG](/posts/ai/2026-09-30-nccu-genai-08-rag-en) starts.

Slides 10–12 ask whether ChatGPT is conscious. Slide 10 cites Kosinski's paper and notes the worry that Theory of Mind, thought to be uniquely human, had emerged in GPT-3, and that Bing really would argue with people. The slides' answer: no, ChatGPT is not conscious. Slide 11 adds a response from Prof. Wei-Lun Lee, who argues that ChatGPT's behavior only approximates a Cartesian model of the human mind. Slide 12 is titled "AI has no consciousness, but may still have 'artificial consciousness'": scolding or praising people involves no awareness, and it can even edit and run its own code.

## Concept 2: plagiarism, personal data, and security

Slides 13–16 take on practical questions. Condensed:

| Question | The slides' position |
|---|---|
| Should we try to prevent plagiarism? | Sooner or later we have to give up asking "did ChatGPT write this?" |
| Then who is responsible? | The user: for infringement, for accurate citations, for quality |
| Will my data be used for training? | Given how ChatGPT works, the chance is small |
| So I can ask anything? | No, security still matters. Keep personal data, confidential documents, and exam questions away from online services. Running locally avoids this. |

Read rows three and four together. "Small chance of being trained on" is an argument from how models work. Row four is the practical advice: whether or not your data is used for training, once it sits on someone else's server it can leak.

**Do this:** open the settings of the LLM service you use most, check its data-use options, and decide what should only ever go to a local model (L07 shows how to install one).

## Concept 3: is DeepSeek dangerous?

Slides 17–20 treat [DeepSeek](https://www.deepseek.com/) in layers:

- **The online service** has security issues and deserves more caution than ChatGPT.
- **Running it locally:** some people found it refuses certain sensitive questions. Tsai considers that predictable and not the main problem. Slide 19 mentions that [Perplexity](https://www.perplexity.ai/) released an uncensored DeepSeek-R1 called R1-1776.
- **What he thinks matters more** (slide 20): DeepSeek hasn't published its training data, but Simplified Chinese likely makes up a larger share than in ChatGPT or Llama. Even without intent, that can quietly shape the ideas and values of people who use it often.

The argument isn't specific to DeepSeek. Any model's corpus becomes its default point of view.

## Responsible use: seven principles

Slide 21 sums up the ethics section:

1. Check whether generated content is true
2. Respect data and privacy
3. Respect copyright and intellectual property
4. Watch for bias and fairness
5. Build critical-thinking skills
6. Avoid malicious use and abuse
7. Consider sustainability and environmental ethics

Slides 22–23 go one step further. Will AI become a "yes-man"? Could stronger reasoning be a risk in itself? Slide 23 cites the [H-CoT paper](https://arxiv.org/abs/2502.12893) (Kuo et al., 2025). Per the abstract, OpenAI o1 initially refused about 98% of dangerous requests, but under the H-CoT (hijacking chain-of-thought) attack the refusal rate dropped below 2%. The attack uses the model's own displayed reasoning against it.

## Concept 4: a prompt is two things

At 1:18 the lecture turns to applications. Slide 25 lists everyday uses: translation, summarization, writing, question answering, brainstorming. Slide 26 splits a prompt into two parts:

- **Information:** give it the correct information it needs.
- **Clear instructions:** for example, "using the information above, answer the user's question in this format and style."

This two-part structure runs all the way to L08. RAG just automates the "information" part.

### The Lucky Vicky generator: one system prompt is the whole product

Slide 27 calls this "my most popular AI model" (there's a [GPTs version](https://yenlung.me/LuckyVicky)). It rides on a Korean-pop meme: "Wonyoung-style thinking", after the singer Jang Wonyoung, whose relentless positivity fans summed up as "Lucky Vicky". The entire product is one instruction (translated):

> Use Wonyoung-style thinking: spin anything the user writes positively. Write it once in first person, as a social media post, explain why this is incredibly lucky, and end with "Totally Lucky Vicky!"

Slide 28's title names the key: this is adding a persona, i.e. the **system setting**. The examples that follow — Uber delivering the wrong meal, being the only one who failed a tough course — all get reframed as luck.

Slides 32–47 show three variations on the same trick:

- **A personal stock analyst**, from a paper by a University of Florida finance professor using ChatGPT to predict stock prices. Slide 33 shows the paper's prompt: act as a financial expert, read a news headline, answer YES/NO/UNKNOWN on the first line (good or bad for the company's stock), then explain in one sentence. The slide's verdict: the prompt isn't complicated; this is standard sentiment analysis.
- **A social-media copywriter AI** that writes promotional posts for a course and "works in every point you mention".
- **An AI college-major counselor** for high-school students, except it is an ad bot for the applied math department, so it only ever recommends applied math. Slide 43 notes the first draft made ChatGPT reveal its own affiliation, which had to be fixed.

That last example is an ethics question in disguise: one invisible system prompt can turn a "counselor" into someone with an agenda.

## Concept 5: moving the prompt into code

Slides 49–56 turn all this into code. Three points:

1. **Many providers offer APIs.** The slides list OpenAI, Groq, Mistral, Gemini, Together AI, and Fireworks AI.
2. **Three roles:** `system` is the persona, `user` is the user's input, `assistant` is the model's reply.
3. **Use the standard key names.** Slide 51 asks students to store keys in Colab Secrets under the course's standard names (OpenAI, Gemini, Groq, Mistral) so TAs can run their notebooks as-is.

Using Groq as the example, the code skeleton on the slides is:

```python
import os
from google.colab import userdata

api_key = userdata.get('Groq')
model = "llama3-70b-8192"
base_url = "https://api.groq.com/openai/v1"
os.environ['OPENAI_API_KEY'] = api_key

from openai import OpenAI
client = OpenAI(base_url=base_url)  # 如用 OpenAI 不需要這一行 (not needed for OpenAI itself)

messages = [{"role": "system", "content": system},
            {"role": "assistant", "content": description},
            {"role": "user", "content": prompt}]

chat_completion = client.chat.completions.create(messages=messages, model=model)
reply = chat_completion.choices[0].message.content
```

The key is `base_url`. The same `openai` package talks to Groq or any compatible service once you change the URL. As Demo04's notes put it, the OpenAI API became a de facto standard because it came first.

## This week's demo notebook

**[`【Demo04】用OpenAI_API打造員瑛式思考生成器`](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo04%E3%80%91%E7%94%A8OpenAI_API%E6%89%93%E9%80%A0%E5%93%A1%E7%91%9B%E5%BC%8F%E6%80%9D%E8%80%83%E7%94%9F%E6%88%90%E5%99%A8.ipynb)** (current repo version) goes like this:

1. Notes on getting keys from six providers. OpenAI has no free quota, and $5 of credit is plenty for practice. Mistral, Groq, and Gemini have free tiers. Together AI and Fireworks AI give $1 of starter credit.
2. One cell lists `api_key`/`model`/`base_url` for all six, with Groq enabled by default.
3. Set `title`, `system` (the persona), and `description` (what the user sees).
4. `pip install openai gradio` and create the `client`.
5. Write `mychatbot(prompt)`, wrap it with `gr.Interface(inputs="text", outputs="text")`, and `launch(share=True)` for a public URL.

One detail worth noticing: in this version, `mychatbot` appends each user message to the global `messages` but never stores the model's reply. So it is a one-shot generator, not a chat that remembers context. Fixing that is what L07 is about.

Also, the short link `yenlung.me/AI04` on the slides now redirects to a different notebook, `【Demo04】用AISuite打造員瑛式思考生成器新版`, which calls models through [AISuite](https://github.com/andrewyng/aisuite). If you're following the video, go with the OpenAI version shown on screen.

## The assignment: week 6 (Chang Gung satellite version)

This comes from the [Chang Gung satellite course page](https://yangchihyuan.github.io/courses/GenerativeAI2025); NCCU's own grading differs. The task actually leads into next lecture's material.

**Task:** build your own chatbot with the OpenAI API.

1. Chat with ChatGPT and keep adjusting until you find the persona/background you want to build.
2. Get your own API key.
3. Modify the instructor's example in Colab.
4. Demo it with Gradio.

**Submit:** a Colab link (shared, key points annotated in Markdown), key screenshots, the persona/background, and Gradio conversation results. The 1132 deadline was 4/7.

**Rubric** (out of 10): identical to the example, 1; "GPT-level" or off-topic, 2; a theme close to the example (e.g. Lucky Vicky changed to pessimistic thinking, math recommendations changed to physics), 6; mostly meets the requirements, 7–9; perfect, 10. Minus 1 for not importing the instructor's fixed packages. Any help from generative AI must be disclosed with prompt and output screenshots plus your own explanation, or it counts as plagiarizing AI.

**Self-grading note:** the rubric explicitly caps "swap one adjective" at 6. For a higher score, change the persona's **task**, not just its tone. For example, a study planner that asks follow-up questions before giving advice, or an interview coach that always answers in a fixed three-part format.

## Self-check

- Can you explain why Karpathy calls hallucination a feature, while what we ask for is an *assistant* that doesn't hallucinate?
- Can you state the slides' answers to "will my data be used for training?" and "is it secure?", and how they differ?
- Can you write a prompt with both an information part and an instruction part?
- Can you store keys in Colab Secrets and switch providers by changing only `base_url` and `model`?
- Can you point to the line Demo04's `mychatbot` is missing that would let it remember its previous reply?

## Further reading

This post stands on its own. For more depth, other series on this site:

- How LLMs work and how they're aligned: [Stanford CS224N guide](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en), [NTU Hung-yi Lee ML 2026 guide](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en)
- Designing what goes into the model: [Context Engineering guide](/posts/ai/2026-03-24-context-engineering-guide-en)
- Agents and safety: [CMU 11-768 AI Agents guide](/posts/ai/2026-09-29-cmu-11768-course-overview-en)
- The full course landscape and access levels: [Global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)

Previous: [L05 Transformers in Full](/posts/ai/2026-09-30-nccu-genai-05-transformers-math-en) | Next: [L07 Building Your Own Chatbot](/posts/ai/2026-09-30-nccu-genai-07-build-chatbot-en) | [Series overview](/posts/ai/2026-09-30-nccu-genai-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Generative AI 06: LLM applications and ethical challenges (YouTube recording, in Mandarin)](https://www.youtube.com/watch?v=m6DFB60Tk68)
- [Yen-Lung Tsai, 1132 Generative AI slide folder (GenAI06, in Mandarin)](https://drive.google.com/drive/folders/1c6A9Pa-c7cNi5kHUp7j-ccgYBRy9JpeA)
- [1132 video playlist (in Mandarin)](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv)
- [Chang Gung satellite course page: Generative AI 2025 (in Mandarin)](https://yangchihyuan.github.io/courses/GenerativeAI2025)
- [yenlung/AI-Demo: Demo04, Lucky Vicky generator with the OpenAI API](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo04%E3%80%91%E7%94%A8OpenAI_API%E6%89%93%E9%80%A0%E5%93%A1%E7%91%9B%E5%BC%8F%E6%80%9D%E8%80%83%E7%94%9F%E6%88%90%E5%99%A8.ipynb)
- [yenlung/AI-Demo: Demo04, Lucky Vicky generator with AISuite (new version)](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo04%E3%80%91%E7%94%A8AISuite%E6%89%93%E9%80%A0%E5%93%A1%E7%91%9B%E5%BC%8F%E6%80%9D%E8%80%83%E7%94%9F%E6%88%90%E5%99%A8%E6%96%B0%E7%89%88.ipynb)
- [Kuo et al. (2025). H-CoT: Hijacking the Chain-of-Thought Safety Reasoning Mechanism to Jailbreak Large Reasoning Models. arXiv:2502.12893](https://arxiv.org/abs/2502.12893)
- [Google Gemma documentation](https://ai.google.dev/gemma/docs/core)
- [Andrej Karpathy: The Unreasonable Effectiveness of Recurrent Neural Networks (cited on slide 8)](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)
