---
title: "NTHU NLP LLM API Lab: NLI Classification with Gemini, OpenAI, and Claude, Using prompts.yaml, JSON Output, Few-Shot, and Token Counts"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nlp, ai-course, taiwan, llm-api, prompt-engineering]
lang: en
series:
  name: "Reading NTHU Hung-Yu Kao Natural Language Processing"
  order: 16
tldr: "This 34-slide TA session answers a practical question. Pasting data into the ChatGPT web page one row at a time is slow and hits hourly limits, so research and homework should use the API. The notebook runs one SemEval 2014 entailment example through Gemini, Claude, and OpenAI in turn: prompts live in prompts.yaml, output is forced into JSON, then few-shot and token counting. The material is from 2024. The slide cover says 2024/11/21, and the notebook uses gemini-1.5-pro, gpt-4o, and claude-3-5-sonnet-20241022. That Claude model was retired on 2025-10-28, and Google's old Gemini SDK reached end of support on 2025-11-30."
description: "A guide to the LLM API TA session in Hung-Yu Kao's Natural Language Processing course at National Tsing Hua University (Fall 2025): why use an API, the 2024 price table for three providers, prompts.yaml and system/user prompts, Gemini JSON mode and count_tokens, how OpenAI and Claude differ on few-shot, when prompt caching helps, and what to change before running the notebook today."
draft: false
glossary:
  - term: "JSON mode"
    aliases: ["structured output"]
    definition: "An API setting that makes the model output only valid JSON, such as Gemini's response_mime_type=\"application/json\" or OpenAI's response_format={\"type\": \"json_object\"}. It lets code parse results directly and compute accuracy."
    context: "The lab uses it to pin NLI results to a format like {\"result\": \"NEUTRAL\"}."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nthu-nlp-llm-api)

**Video status: Videos included.** [Source details](#course-video-sources)

> **Version note**: This post is based on [llm_api_tutorial.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/llm_api_tutorial.pdf), listed in the W12 row of the [2025 schedule](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) for Hung-Yu Kao's Natural Language Processing course at National Tsing Hua University (NTHU), Fall 2025, and on `llm_api.ipynb` and `utils.py` in [LLM_API_lab](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Reference/LLM_API_lab). The slide cover is dated **2024/11/21**, so this is the 2024 session reused. The recording is [the W12 Thursday one](https://www.youtube.com/live/xGwQYvya_Ag) (labeled "Video2(LLM_API)" in the schedule, 2025-11-19, 56:35, in Mandarin). It has no caption track, so I did not check it section by section. I checked every fact against the official materials on 2026-09-30. Access level **A3**: slides and notebook are public, but the `prompts.yaml` the notebook loads is not in the repo (see below).

**Series**: previous [RAG, Part 2: from ODQA to Self-RAG](/posts/ai/2026-09-30-nthu-nlp-rag-qa-advanced-en) | next [RAG labs 1/2 + HW4](/posts/ai/2026-09-30-nthu-nlp-rag-lab-hw4-en) | [Series overview](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en)

## Course video sources

Video sources were checked against the official course page and rechecked live on 2026-10-10: lecture and video match, and the YouTube videos are public and embeddable. No timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=xGwQYvya_Ag
title: W12 Thursday recording (Fall 2025, in Mandarin)
```

Original videos: [W12 Thursday recording (Fall 2025, in Mandarin)](https://www.youtube.com/watch?v=xGwQYvya_Ag)

Course and recording entries:

- [Official course and recording entry](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

Checked: 2026-10-10.

## Why use an API

Slide 3 gives two blunt reasons:

- Using the ChatGPT web page for NLP tasks means copying and pasting by hand, which is slow
- Testing data on the web page runs into "Too many requests in 1 hour. Try again later."

Once your data runs past a dozen rows, and you want accuracy numbers or a prompt comparison, you need code. For picking a model, the slides point to the [Chatbot Arena leaderboard](https://lmarena.ai/?leaderboard).

## The 2024 price table is history now

Slide 5 compares three APIs and Hugging Face (USD per 1M tokens):

| | Gemini (gemini-1.5-pro) | OpenAI (gpt-4o) | Claude (Claude 3.5 Sonnet) | Hugging Face |
|---|---|---|---|---|
| Free quota | 2 RPM, 32,000 TPM, 50 RPD | No | No | Free |
| Input | 1.25 (2.50 above 128k tokens) | 2.50 | 3 | — |
| Output | 5.00 (10.00 above 128k) | 10.00 | 15 | — |
| Prompt caching | 0.3125 / 0.625, plus 4.5 per hour of storage | 1.25 | 3.75 write, 0.30 read | — |

This is a November 2024 snapshot. None of the three models is current, and the prices are no basis for a budget today. What the table does teach is which dimensions to compare: is there a free tier, are input and output priced separately, does long context cost more, and does caching come with a discount.

## How the notebook is laid out

`llm_api.ipynb` has three parts, Gemini, Claude, then OpenAI, and each runs on its own (slide 12). Every part starts the same way:

```python
from utils import load_prompts
prompts = load_prompts("prompts.yaml")
```

`utils.py` holds a single function that loads `prompts.yaml` into a Python dict with the `yaml` package. The design is worth copying. Prompts live apart from code, so changing a prompt doesn't touch the code, and when you compare prompts you know exactly what changed.

**The gap**: the repo's `LLM_API_lab` folder contains only `llm_api.ipynb` and `utils.py`. There is no `prompts.yaml`. Slides 10, 15, and 23 show screenshots of it. From how the notebook uses it, it has at least these keys: `system.general`, `user.general`, `user.json_mode`, `user.few`, and `mutual.few_hint`. `user.general` carries two placeholders, `{PREMISE_HERE}` and `{HYPOTHESIS_HERE}`, and `user.few` carries placeholders from `PREMISE_1` through `HYPOTHESIS_3`. To self-study, you have to rebuild the file from the screenshots.

The notebook link in the slides also points to `Reference/LLM_API_lab` at the repo root, which now returns 404. Use `2025/Reference/LLM_API_lab`.

## How system and user prompts split the work

Slide 11 breaks the prompt into three pieces:

| Where | What | Example |
|---|---|---|
| System prompt | Role (persona) | You are an expert at Natural Language Inference (NLI). |
| System prompt | Task description | Analyze a premise and a hypothesis and classify them as NEUTRAL, ENTAILMENT, or CONTRADICTION |
| User prompt | This row's input | premise: {PREMISE_HERE}, hypothesis: {HYPOTHESIS_HERE}. |

The example data is three-way entailment from SemEval 2014 Task 1, the same dataset as [HW3](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3-en). The sample pair is "A group of kids is playing in a yard and an old man is standing in the background" versus "A group of boys in a yard is playing and a man is standing in the background." Every example sets `TEMPERATURE = 0`.

## Gemini: JSON output, few-shot, token counts, summarization

The Gemini part is the most complete:

- **Basic call**: `genai.GenerativeModel(MODEL_NAME, generation_config=..., system_instruction=system_prompt)`, then `generate_content(user_prompt)`
- **Token counts**: `model.count_tokens()` counts the system prompt and user prompt separately and adds them for the input total. It also counts the reply
- **JSON output**: slide 19 asks how to get structured output for evaluating the model. The answer: append the `json_mode` text to the user prompt and set `response_mime_type: "application/json"`, so the reply goes straight into `json.loads()`
- **Few-shot**: two labeled examples (NEUTRAL, ENTAILMENT), then the third pair as the question. The slides note that few-shot already nudges the model into the output format, so JSON mode may not be needed
- **Summarization**: a demo on LCSTS (Chinese abstractive summarization), with a Chinese system prompt saying "you are an expert in Chinese text summarization"

## OpenAI and Claude: few-shot format and JSON extraction differ

Slide 27 says the three providers are mostly similar. The differences come down to two things.

**Few-shot format** (slides 29–30): the OpenAI part writes examples as a **list of messages**, one user message plus one assistant message per example, with the real question last. The Claude part, like Gemini, packs all examples into **one string** in the user prompt.

**Getting JSON**: OpenAI uses `response_format={"type": "json_object"}`. A notebook comment warns that with this setting, you must ask for JSON in the user prompt. The Claude part has no JSON mode. It uses the regex `\{.*?\}` to pull the first JSON object out of the reply text and parses that.

**Token usage** (slide 31): both read it off the response object. OpenAI has `usage.prompt_tokens` and `usage.completion_tokens`; Claude has `usage.input_tokens` and `usage.output_tokens`.

## When prompt caching helps

Slide 26 explains the idea using Gemini's docs only; the notebook has no matching code. It lists three use cases: chatbots with long system instructions, repeated queries against large document sets, and analysis of a long video. You cache the system instruction and the large file, and cached tokens cost less. The further-learning slide (33) links prompt caching and Batch API docs for the three providers.

## What to change before you run it

This material ran in a late-2024 environment. To follow it in 2026, deal with these first:

1. **Replace every model name.** Anthropic's [deprecation page](https://platform.claude.com/docs/en/about-claude/model-deprecations) says `claude-3-5-sonnet-20241022` was retired on 2025-10-28, before the Fall 2025 session itself (2025-11-19). Google's current [Gemini deprecations table](https://ai.google.dev/gemini-api/docs/deprecations) no longer lists the 1.5 family at all. Check each provider's model page before picking replacements.
2. **Switch the Gemini SDK.** The notebook uses `google.generativeai`. The [old SDK's repo](https://github.com/google-gemini/deprecated-generative-ai-python) says support ended permanently on 2025-11-30 and recommends the new Google Gen AI SDK. The install command on slide 9 is `google-ai-generativelanguage==0.8.3`, while the notebook's comment says `google-generativeai==0.8.3`, so those don't match either.
3. **The Claude few-shot cell has a bug.** It builds `cur_fs_user_prompt` but sends `cur_user_prompt`, so the few-shot examples never go out.
4. **The token-counting claim is out of date.** Slide 32 says only OpenAI offers a way to count tokens before sending. Yet the notebook's own Gemini part calls `count_tokens()` before sending, and Anthropic now has a [token counting endpoint](https://platform.claude.com/docs/en/build-with-claude/token-counting).

## How to self-study this lab

1. Write `prompts.yaml` from the screenshots on slides 10, 15, and 23. As long as the keys match, the notebook runs.
2. Pick one API with a free tier and run the whole flow: basic call, JSON output, few-shot, token counts. Slides 29–31 cover the differences between providers well enough.
3. Compare zero-shot and few-shot accuracy on 10 SemEval rows. That comparison is exactly where the API beats the web page.

One thing to try tonight: move your most-used prompt out of your code into a YAML file, split into `system` and `user` keys, with `{}` placeholders in the user part. You'll use the habit in [the next post](/posts/ai/2026-09-30-nthu-nlp-rag-lab-hw4-en) when writing RAG prompts.

## Further reading

- Iterating on prompts: [Prompt engineering iteration guide](/posts/ai/2026-03-13-prompt-engineering-iteration-guide-en)
- From APIs to agents: [CME295 Lecture 7: Agentic LLMs](/posts/ai/2026-09-29-cme295-agentic-llms-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Matched against the official course page and YouTube: lecture and embedded videos agree and are publicly embeddable, so status is now Videos included.
- 2026-10-10: Tried to check the video content against its transcript, but the YouTube page of the W12 Thursday recording (xGwQYvya_Ag) has no captions, so it could not be checked and no content-check note was added. The post already relies only on the slides and notebook and makes no claims about the video, so it is unchanged.

## References

- [llm_api_tutorial.pdf (cover dated 2024/11/21)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/llm_api_tutorial.pdf) — why use an API, price table, install commands, prompt structure, provider differences, prompt caching
- [LLM_API_lab (llm_api.ipynb, utils.py)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Reference/LLM_API_lab) — the three example sections and model names used
- [NTHU NLP 2025 schedule](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) — the W12 row lists llm_api_tutorial.pdf and "Video2(LLM_API)"
- [W12 Thursday recording (Fall 2025, in Mandarin)](https://www.youtube.com/live/xGwQYvya_Ag) — the LLM API TA session
- [Anthropic model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations) — claude-3-5-sonnet-20241022 retired on 2025-10-28
- [Gemini deprecations](https://ai.google.dev/gemini-api/docs/deprecations) — current Gemini models and shutdown dates
- [google-gemini/deprecated-generative-ai-python](https://github.com/google-gemini/deprecated-generative-ai-python) — old SDK support ended 2025-11-30
- [Anthropic token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting) — endpoint for counting input tokens before sending
