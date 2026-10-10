---
title: "Reading NCCU Yen-Lung Tsai Generative AI, L07: Building Your Own Chatbot — API Keys, Three Roles, Sending the History Back, and Running Models Locally with Ollama"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, course-guide, generative-ai, llm-api, chatbot, ollama, groq]
lang: en
series:
  name: "Reading NCCU Yen-Lung Tsai Generative AI"
  order: 7
tldr: "A chatbot 'remembers' you not because the model has memory, but because your code resends the whole messages list (system, then alternating user and assistant) every turn. L07 starts with getting OpenAI and Groq keys, spells out that structure, then runs Gemma 3 locally or in Colab with Ollama, where the same openai package works after changing only base_url. The week-7 assignment offers two options: a version that keeps the conversation going, or two models talking to each other, both demoed in Gradio."
description: "A guide to lecture 7 of NCCU Yen-Lung Tsai's Generative AI: Text and Image Synthesis Principles and Practice (semester 1132, Spring 2025), based on video 07, the 31-page GenAI07 slides, and the AI-Demo notebooks Demo04c and 用_Ollama_打造自己的對話機器人: OpenAI and Groq keys, Groq and the LPU, the three roles and the conversation-history structure, Ollama's pull/serve/list and localhost:11434, running Ollama in Colab, Open WebUI, the comforting 'Pat-Pat' bot, Gradio State, plus the week-7 assignment and rubric from the Chang Gung satellite section."
draft: false
glossary:
  - term: "Ollama"
    definition: "A tool that downloads and runs open-weight LLMs on your own machine. Once running, it serves an OpenAI-compatible API at localhost:11434."
    context: "L07 uses it to run Gemma 3 locally and in Colab."
    links:
      - label: "Ollama"
        url: "https://ollama.com/"
---

> 🌏 [中文版](/posts/ai/2026-09-30-nccu-genai-07-build-chatbot)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

**This post is based on the 1132 semester (Spring 2025) of NCCU Yen-Lung Tsai's *Generative AI: Text and Image Synthesis Principles and Practice*.** It is part 7 of the [Reading NCCU Yen-Lung Tsai Generative AI](/posts/ai/2026-09-30-nccu-genai-course-overview-en) series and follows [L06, LLM Applications and Ethical Challenges](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics-en). Last lecture produced a one-shot Lucky Vicky generator. This one makes it hold a conversation, without necessarily sending your data to the cloud.

Official sources: [video 07](https://www.youtube.com/watch?v=LOo0VKhjoRc) (2025-04-01, about 3 h 3 min, in Mandarin), the 31-page GenAI07 slides (in the instructor's [slide folder](https://drive.google.com/drive/folders/1c6A9Pa-c7cNi5kHUp7j-ccgYBRy9JpeA)), the notebooks [`【Demo04c】用OpenAI_API打造自己的對話機器人`](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo04c%E3%80%91%E7%94%A8OpenAI_API%E6%89%93%E9%80%A0%E8%87%AA%E5%B7%B1%E7%9A%84%E5%B0%8D%E8%A9%B1%E6%A9%9F%E5%99%A8%E4%BA%BA.ipynb) and [`用_Ollama_打造自己的對話機器人`](https://github.com/yenlung/AI-Demo/blob/master/%E7%94%A8_Ollama_%E6%89%93%E9%80%A0%E8%87%AA%E5%B7%B1%E7%9A%84%E5%B0%8D%E8%A9%B1%E6%A9%9F%E5%99%A8%E4%BA%BA.ipynb) in the [AI-Demo](https://github.com/yenlung/AI-Demo) repo, and the week-7 assignment on the [Chang Gung satellite course page](https://yangchihyuan.github.io/courses/GenerativeAI2025). Access level: **A3**. The notebooks live in a shared repo, so **everything below refers to the current repo version, which may have changed since the semester ended.**

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=LOo0VKhjoRc
title: Generative AI 07: Build your own chatbot (YouTube recording, in Mandarin)
```

Original videos: [Generative AI 07: Build your own chatbot (YouTube recording, in Mandarin)](https://www.youtube.com/watch?v=LOo0VKhjoRc)

Course and recording entries:

- [Official course and recording entry](https://yangchihyuan.github.io/courses/GenerativeAI2025)

## Where this week sits

Video 07's chapters are clear. The first 30 minutes cover OpenAI keys, Groq, and Ollama. From 0:39 Tsai installs Ollama in Colab and builds a comforting chatbot. After the break (from 1:15) he builds a version that "keeps talking" and a Gradio web app, introduces the AISuite package at 1:41, and explains the assignment at 1:49. Session three is lightning talks, including one on Ollama applications, and a TA segment on LM Studio.

The slides have three parts: "Getting OpenAI / Groq API keys", "Ollama", and "Assignment: build your own chatbot with Ollama".

## Concept 1: getting and storing keys

Slides 3–9 walk through it: create an account on the [OpenAI Platform](https://platform.openai.com) (a Google account works), find API keys, click Create new secret key. Slide 6 says in large type: make sure you record your key, since it's shown only once.

You can write `OpenAI(api_key="your API key")` directly, but slide 9 asks students to read it from Colab Secrets "the way we agreed":

```python
import os
from google.colab import userdata
api_key = userdata.get('OpenAI')
os.environ['OPENAI_API_KEY'] = api_key
```

Keeping the key in Secrets rather than hard-coding it means sharing your Colab link doesn't share your key. Standard names let TAs run your notebook as-is.

### What Groq is

Slide 10 introduces [Groq](https://groq.com/): a US AI company founded in 2016 by former Google engineers. Its core product is an in-house Language Processing Unit (LPU), built to speed up LLMs at inference time and not well suited to training. It serves many open models and has a free tier. Signing up works much like OpenAI ([console.groq.com](https://console.groq.com/)).

## Concept 2: the model has no memory; you resend everything

This is the lecture's most important slide. Slide 12 reviews the three roles, and slide 13 draws the structure for sending back the conversation history:

```python
[{"role": "system",    "content": "ChatGPT 的「人設」"},   # the persona
 {"role": "user",      "content": "使用者輸入"},           # user input
 {"role": "assistant", "content": "ChatGPT 回覆"},         # model reply
 {"role": "user",      "content": "使用者再輸入"}]         # next user input
```

"Send this and it replies!" The API itself keeps nothing from the previous turn. When ChatGPT's website seems to remember you, the app is resending the whole conversation. So a chatbot that keeps talking only has to do two things each turn:

1. Append the user's message as a `user` entry.
2. Once the reply comes back, append it as an `assistant` entry.

Look back at Demo04 from [L06](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics-en): it only does step 1. The model sees everything you said but none of its own replies. [Demo04c](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo04c%E3%80%91%E7%94%A8OpenAI_API%E6%89%93%E9%80%A0%E8%87%AA%E5%B7%B1%E7%9A%84%E5%B0%8D%E8%A9%B1%E6%A9%9F%E5%99%A8%E4%BA%BA.ipynb) adds step 2:

```python
def mychatbot(prompt, history):
    history = history or []
    global messages
    messages.append({"role": "user", "content": prompt})
    chat_completion = client.chat.completions.create(messages=messages, model=model)
    reply = chat_completion.choices[0].message.content
    messages.append({"role": "assistant", "content": reply})
    history = history + [[prompt, reply]]
    return history, history
```

The cost is just as direct: the longer the chat, the more you send each time. That is the "short-term memory" problem the [L08](/posts/ai/2026-09-30-nccu-genai-08-rag-en) slides describe — when a conversation gets too long, the early parts get forgotten.

**Do this:** find the function that calls the API in your L06 assignment and check whether the reply is appended back to `messages`.

## Concept 3: Ollama, running models on your own machine

L06 said to keep personal and confidential data off online services, and that local models avoid the problem. Slides 17–23 show how:

| Step | Command | Slide note |
|---|---|---|
| Install | Download from [ollama.com](https://ollama.com/) | It starts running once installed |
| Download a model | `ollama pull gemma3` | The model page gives you `run`; change it to `pull` |
| Start the server | `ollama serve` | Usually already running in the background |
| List installed models | `ollama list` | |
| See commands | `ollama` | There aren't many |

Slide 23 gives Ollama's standard API address, `http://localhost:11434`. Slide 24 says the main event today is **running Ollama in Colab** (`yenlung.me/ollama`). Slides 25–27 introduce the GUI [Open WebUI](https://www.openwebui.com/) (`pip install open-webui`, then `open-webui serve`) and point to more GUIs listed on [Ollama's GitHub](https://github.com/ollama/ollama).

## This week's demo notebook

**[`用_Ollama_打造自己的對話機器人`](https://github.com/yenlung/AI-Demo/blob/master/%E7%94%A8_Ollama_%E6%89%93%E9%80%A0%E8%87%AA%E5%B7%B1%E7%9A%84%E5%B0%8D%E8%A9%B1%E6%A9%9F%E5%99%A8%E4%BA%BA.ipynb)** ("Build your own chatbot with Ollama"; `yenlung.me/ollama` currently points here) has seven sections matching the video from 0:43:

1. **Install Ollama in Colab:** `curl` the official install script, `nohup ollama serve &` to run it in the background, `ollama pull gemma3:1b`.
2. **Call it with the OpenAI package:** the key can be anything (`api_key = "ollama"`); set `base_url="http://localhost:11434/v1"`.
3. **One test message:** a system message plus "你好!" ("Hello!").
4. **A comforting bot:** the system prompt asks for a warm, best-friend tone in under twenty characters. The user says "I'm in a bad mood today", the reply is appended as assistant, then "I feel like nobody likes me." This section does concept 2's two steps by hand.
5. **Keep talking:** a `while True` loop that ends when the input contains `bye`, storing both user and assistant each turn. This is the "Pat-Pat bot" (拍拍機器人) from 1:15 in the video.
6. **Gradio web app:** `gr.Blocks`, `gr.Chatbot(type="messages")`, and `gr.State` to hold the messages. A comment insists on `copy()` (務必用 copy()); otherwise every user shares the same initial conversation.
7. **AISuite:** `model = "ollama:gemma3:1b"`. Change the prefix to switch providers.

One thing to watch: the text in section 1 says it demonstrates Llama 3.2, but the code actually pulls `gemma3:1b`. The older notebook [`在_Colab_上用_Ollama`](https://github.com/yenlung/AI-Demo/blob/master/%E5%9C%A8_Colab_%E4%B8%8A%E7%94%A8_Ollama.ipynb) ("Using Ollama in Colab") is the one that uses `llama3.2`. It's a trace of the repo being updated over time; trust the code.

On free Colab, a 1B model is the realistic choice. To run a larger one on your own computer, check the Gemma 3 hardware table on slide 5 of L06 first.

## The assignment: week 7 (Chang Gung satellite version)

From the [Chang Gung satellite course page](https://yangchihyuan.github.io/courses/GenerativeAI2025); NCCU's own grading differs. Slides 29–31 of GenAI07 title the assignment "Build your own chatbot with Ollama": it should keep the conversation going and be fun or useful. The example persona is a virtual friend named Zhiqing (芷晴), an applied-math student who loves birdwatching and is in the coffee club. The Chang Gung page states the task as:

**Build your own chatbot, advanced version. Pick one:**

- **Option 1:** extend last week's assignment, following the instructor's example, into a version that holds an ongoing conversation. Demo in Gradio.
- **Option 2:** build a bot where two different models talk to each other. Demo in Gradio.

**Submit:** a Colab link (key points annotated in Markdown), key screenshots, the persona/background, **the models used**, and Gradio conversation results. The 1132 deadline was 4/14.

**Rubric** (out of 10): identical to the example, 1; GPT-level or off-topic, 2; a theme close to the examples (a warm chatbot, a Lucky Vicky bot, a math-recommendation bot), 6; mostly meets the requirements, 7–8; meets the requirements, 9; +1 for an interesting theme. Minus 1 for not importing the instructor's fixed packages.

**How to think about option 2:** each model keeps its own `messages`. A's reply is a `user` message for B, and B's reply becomes a `user` message for A. Each side stores its own words as `assistant`. Draw that table before writing code and you'll save a lot of debugging. The two models can run on different backends, say one on Groq and one on local Ollama, as long as their `client`s have different `base_url`s.

## Self-check

- Can you explain why the API doesn't remember the previous turn, and how a chatbot fakes remembering?
- Can you read a key from Colab Secrets and give two reasons to do it that way?
- Can you run Ollama in Colab and point the `openai` package at it with `base_url="http://localhost:11434/v1"`?
- Can you write a loop that stores both user and assistant messages and exits on `bye`?
- Can you say what Gradio's `gr.State` holds here, and why its initial value needs `copy()`?

## Further reading

- What to keep and what to drop as the history grows: [Context Engineering guide](/posts/ai/2026-03-24-context-engineering-guide-en), [NTU ML 2026: Context Engineering](/posts/ai/2026-09-30-ntu-ml2026-context-engineering-en)
- From chatbots to tool-using agents: [CMU 11-768 AI Agents guide](/posts/ai/2026-09-29-cmu-11768-course-overview-en)
- How language models themselves work: [Stanford CS224N guide](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en)

Previous: [L06 LLM Applications and Ethical Challenges](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics-en) | Next: [L08 Retrieval-Augmented Generation (RAG)](/posts/ai/2026-09-30-nccu-genai-08-rag-en) | [Series overview](/posts/ai/2026-09-30-nccu-genai-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Generative AI 07: Build your own chatbot (YouTube recording, in Mandarin)](https://www.youtube.com/watch?v=LOo0VKhjoRc)
- [Yen-Lung Tsai, 1132 Generative AI slide folder (GenAI07, in Mandarin)](https://drive.google.com/drive/folders/1c6A9Pa-c7cNi5kHUp7j-ccgYBRy9JpeA)
- [1132 video playlist (in Mandarin)](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv)
- [Chang Gung satellite course page: Generative AI 2025 (in Mandarin)](https://yangchihyuan.github.io/courses/GenerativeAI2025)
- [yenlung/AI-Demo: Demo04c, build your own chatbot with the OpenAI API](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo04c%E3%80%91%E7%94%A8OpenAI_API%E6%89%93%E9%80%A0%E8%87%AA%E5%B7%B1%E7%9A%84%E5%B0%8D%E8%A9%B1%E6%A9%9F%E5%99%A8%E4%BA%BA.ipynb)
- [yenlung/AI-Demo: build your own chatbot with Ollama](https://github.com/yenlung/AI-Demo/blob/master/%E7%94%A8_Ollama_%E6%89%93%E9%80%A0%E8%87%AA%E5%B7%B1%E7%9A%84%E5%B0%8D%E8%A9%B1%E6%A9%9F%E5%99%A8%E4%BA%BA.ipynb)
- [yenlung/AI-Demo: using Ollama in Colab](https://github.com/yenlung/AI-Demo/blob/master/%E5%9C%A8_Colab_%E4%B8%8A%E7%94%A8_Ollama.ipynb)
- [Ollama](https://ollama.com/), [Ollama GitHub](https://github.com/ollama/ollama)
- [Open WebUI](https://www.openwebui.com/)
- [Groq Console](https://console.groq.com/)
- [andrewyng/aisuite](https://github.com/andrewyng/aisuite)
