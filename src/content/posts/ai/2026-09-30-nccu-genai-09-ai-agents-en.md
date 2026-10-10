---
title: "Reading NCCU Yen-Lung Tsai Generative AI, L09: Why 2025 Was Called the Year of AI Agents — Andrew Ng's Four Design Patterns, with Reflection and Two-Stage CoT Built in AISuite"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, course-guide, generative-ai, ai-agent, multi-agent, tool-use, prompt-engineering, llm-api]
lang: en
series:
  name: "Reading NCCU Yen-Lung Tsai Generative AI"
  order: 9
tldr: "L09 defines an AI agent in one line: the AI finishes the work you would otherwise do yourself. Yen-Lung Tsai follows Andrew Ng's four design patterns (Reflection, Tool Use, Planning, Multiagent Collaboration) but builds only the two easiest. Demo07a hands a draft between a \"writer\" and a \"reviewer\" LLM call. Demo07c splits the Lucky Vicky post generator into \"think of five reasons, then write the post\", a two-stage CoT. Both use AISuite with Groq and a Gradio front end. LangChain, AutoGen and CrewAI appear only on a further-learning list. The week 9 homework asks you to pick one of the two patterns."
description: "A guide to lecture 9 of Yen-Lung Tsai's NCCU course Generative AI: Text and Image Synthesis Principles and Practice (semester 1132, spring 2025), based on video 09, the 33-page GenAI09 slides and AI-Demo's Demo07a and Demo07c: why a single prompt is like writing without a delete key, why RAG counts as an agent, Andrew Ng's four design patterns, the tool_calls format, CoT and PM-style multi-agent setups, AISuite's unified interface, a misexpanded MCP acronym on the slides, and the week 9 homework and rubric from the Chang Gung satellite section."
draft: false
glossary:
  - term: "Reflection pattern"
    aliases: ["Reflection"]
    definition: "An agent design pattern: one LLM writes a draft, another LLM (or the same model in a different role) critiques it and suggests changes, and the first rewrites. The loop can repeat."
    context: "GenAI09 slides 18–20 and the writer/reviewer flow in Demo07a."
  - term: "AISuite"
    definition: "An open-source Python package from Andrew Ng's team that calls models from different providers through one OpenAI-style interface. Model names take the form \"provider:model\"."
    context: "The course uses it from L08 on to reach Groq and OpenAI; both L09 agent demos are built on it."
    links:
      - label: "andrewyng/aisuite"
        url: "https://github.com/andrewyng/aisuite"
---

> 🌏 [中文版](/posts/ai/2026-09-30-nccu-genai-09-ai-agents)

**This guide covers semester 1132 (spring 2025) of Yen-Lung Tsai's NCCU course *Generative AI: Text and Image Synthesis Principles and Practice*.** It is part 9 of the [Reading NCCU Yen-Lung Tsai Generative AI](/posts/ai/2026-09-30-nccu-genai-course-overview-en) series and follows [L08 on RAG](/posts/ai/2026-09-30-nccu-genai-08-rag-en). It is also the last lecture of the text half of the course. Image generation starts next week.

It draws on four official sources: [video 09](https://www.youtube.com/watch?v=49fwh6oc5Nc) (2025-04-15, about 2 h 58 min), the 33-page GenAI09 slides in the instructor's [slide folder](https://drive.google.com/drive/folders/1c6A9Pa-c7cNi5kHUp7j-ccgYBRy9JpeA), the [AI-Demo](https://github.com/yenlung/AI-Demo) notebooks [`【Demo07a】AI代理設計模式_Reflection`](https://yenlung.me/AI07a) and [`【Demo07c】AI代理設計模式_員瑛式思考生成器Two_Stage_CoT版`](https://yenlung.me/AI07c), and the week 9 homework on the [Chang Gung satellite course page](https://yangchihyuan.github.io/courses/GenerativeAI2025) (in Mandarin). Access level: **A3**. One caveat: both notebooks were last committed on 2025-10-28, after the semester ended. **What follows quotes the current repo version, not the one used in class.**

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=49fwh6oc5Nc
title: 【生成式 AI】09.為什麼大家說2025年是AI Agents元年（YouTube 錄影）
```

Original videos: [【生成式 AI】09.為什麼大家說2025年是AI Agents元年（YouTube 錄影）](https://www.youtube.com/watch?v=49fwh6oc5Nc)

Course and recording entries:

- [Official course and recording entry](https://yangchihyuan.github.io/courses/GenerativeAI2025)

## Where this week sits in the course

Video 09 has two halves. The first hour (about 8:27–58:24) walks through the slides: the "year of agents", how agents relate to LLMs, and the four design patterns. After the break (from 1:08:23), Tsai installs [AISuite](https://github.com/andrewyng/aisuite) live and codes all the way to a Gradio web app. He explains the two homework options at 1:21:26 and 1:46:13. Class ends at 2:00:23, and the TA session starts at 2:08:47.

The slides have three parts: "What are AI agents?", "Agent design patterns" and "Further learning". There is almost no math this week. The point is **chaining several LLM calls into one workflow**.

## Idea 1: a single prompt is like writing without a delete key

Slide 6 shows how we usually use an LLM: one prompt in, one answer out. Slide 7 borrows Andrew Ng's analogy: it is like asking someone to write an essay with no delete key and no revisions, straight through. People can't do that well. Slide 8 adds that coding works the same way. We write a bit, test, and fix.

Slides 9–10 then list what the *human* actually does when working with an LLM:

- Supplies the right information, which may mean looking things up, searching the web or reaching for a calculator
- Gives clear instructions: what format, what style
- Goes back and forth asking for revisions: "Actually, the situation there is… and could that part say… instead?"

Slide 10 ends with: wouldn't it be nice if the AI did all this itself? Slide 11 gives the course's definition of an agent: **the AI finishes the work you would otherwise do.** Planning, gathering data, iterating: the AI handles all of it.

The definition is broad enough that slide 12 says [L08's RAG](/posts/ai/2026-09-30-nccu-genai-08-rag-en) is already a kind of agent. "Supplying the right information" used to be your job; RAG hands it to a database lookup. Recall the two parts of a prompt from [L06](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics-en), information and instructions. An agent takes the human's share of both and gives it away piece by piece.

Slide 14 pictures it as "the boss (you) says one sentence and the staff (AI agents) get moving": a prompt goes in, then tools, a plan, two RAG stores and memory, and only then the LLM output.

**Try this:** open your last back-and-forth chat with ChatGPT. Count how many times you added information by hand and how many times you asked for changes. Those are the steps an agent could take over.

## Idea 2: Andrew Ng's four design patterns

Slide 16 lists the four agent design patterns Andrew Ng proposed and links to his [talk](https://www.youtube.com/watch?v=sal78ACtGTc):

| Pattern | The slide's one-liner | Demo in this course? |
|---|---|---|
| Reflection | One LLM drafts, a second critiques and suggests fixes, the first revises; repeat as needed | Yes: Demo07a |
| Tool Use | Call a tool for whatever the LLM is bad at or can't do | No, slides only |
| Planning | Ask the LLM to "think it over" and draft before answering | Yes: Demo07c (two-stage CoT) |
| Multiagent Collaboration | Several AI agents work together | No, slides only |

Four new ideas at once is a lot. This guide does what the course does: the two patterns with demos get the full treatment, and the other two get one section each on the problem they solve.

### Reflection: a second LLM as the reviewer

Slide 19 has just three boxes. The prompt goes to the "writer" LLM, which produces a draft. The draft goes to the "reviewer" LLM, and the critique returns to the writer. Slide 20 adds that the reviewer can be a different model.

Why does this help? The reviewer starts from finished text. Its job changes from "write something good from scratch" to "find what could be better here", which is usually much easier. Human editors split the work the same way.

### Tool Use: stop forcing it to do what it's bad at

Slide 22 is titled "If the LLM isn't good at something, stop forcing it…" and names three tools: a calculator, data lookup and web search. This goes back to [L04](/posts/ai/2026-09-30-nccu-genai-04-llm-next-token-en): an LLM predicts the next token, so even 94 + 87 is something it "guesses".

Slides 23–24 sketch tool calling in two steps:

1. Tell the agent which tools exist. The slide's example uses `bind_tools` to attach `add`, `get_stock_info` and `get_stock_news`.
2. Send "What is 94 plus 87?" and the model returns not an answer but a `tool_calls` structure. It names `add` with x = 94 and y = 87.

<details>
<summary>The tool_calls output on slide 24</summary>

```python
[{'name': 'add', 'args': {'x': 94, 'y': 87}}]
```

The model only decides which tool to call and with what arguments. Your code does the actual addition, then hands the result back so the model can write the final reply.

</details>

This lecture has no Tool Use notebook. If you want to build one, start by treating [L08](/posts/ai/2026-09-30-nccu-genai-08-rag-en)'s RAG pipeline as a "search the database" tool, then add others.

### Planning: draft first, then answer

On slide 26 the LLM gets a prompt and first lists "1. … 2. … 3. …", thinking "let me plan how to do this so I cover what the user needs". Slide 27 names the best-known method, **CoT (chain-of-thought)**, and lists four benefits: it breaks complex issues down systematically, finds links between them, covers more angles, and makes priorities easier to see.

The course splits CoT into **two separate LLM calls**: the first only thinks, the second only writes. That is easier to inspect and debug than writing "think step by step" inside one prompt, because you can see the intermediate output.

### Multiagent Collaboration: a PM hands out the work

Slide 29 shows one LLM acting as a PM above agents numbered 1 to 4. The PM says: "Task breakdown done. Number 1, calculate this. Number 2, look up that. Number 3, analyze the reasons from what 2 finds…" Number 4 says: "Nothing for me this time."

Reflection is already the smallest multi-agent setup: two roles and a fixed flow. Multiagent collaboration adds roles and lets an LLM decide who acts next.

## Idea 3: one interface with AISuite

Slide 17 says the class builds with Andrew Ng's AISuite and lists four advantages: one way to call everything, easy model switching, models from different providers in the same program, and simple installation.

Mixing providers matters for agents. The writer can run on a cheap, fast model and the reviewer on a stronger one from another company. You change one string. Both demos share the same `reply()` function:

<details>
<summary>reply() shared by Demo07a and 07c (current repo version)</summary>

```python
import aisuite as ai

def reply(system="請用台灣習慣的中文回覆。",
          prompt="hi",
          provider="groq",
          model="openai/gpt-oss-120b"):
    client = ai.Client()
    messages = [
        {"role": "system", "content": system},
        {"role": "user", "content": prompt}
    ]
    response = client.chat.completions.create(
        model=f"{provider}:{model}", messages=messages)
    return response.choices[0].message.content
```

The model string is `provider:model`. The current repo version defaults to `openai/gpt-oss-120b` on Groq and leaves commented-out options for OpenAI (`gpt-4o`) and Mistral. Keys come from Colab's `userdata` and go into environment variables. (The default system prompt asks for Taiwanese-style Mandarin.)

</details>

The segment at 1:29:34, "setting up two or more language models", is about configuring `provider_writer` and `provider_reviewer` separately.

## This week's demo notebooks

### Demo07a: a social-post reflection helper

The notebook states the task up front. The user types what they want to share today, and four steps follow:

1. `model_writer` drafts a social post. Its system prompt asks for lively, fun, first-person writing with emoji and a bit of humor.
2. `model_reviewer`, cast as a copy editor, gives concrete suggestions.
3. `model_writer` gets "here is the post I just wrote + here are the suggestions" and outputs only the revised post.
4. A Gradio page shows three columns side by side: first draft, suggestions, second draft.

The whole agent is three `reply()` calls, with Python strings carrying each output into the next prompt. The three-column layout is a smart choice: you can see at a glance whether the reviewer made a difference.

One small detail in the code: the third call passes `provider_writer` but `model_reviewer`. By default both are the same model, so nothing breaks. If you switch the reviewer to another model, change that argument back to `model_writer`.

### Demo07c: the Lucky Vicky generator as two-stage CoT

This rewrites [L06](/posts/ai/2026-09-30-nccu-genai-06-llm-applications-ethics-en)'s Lucky Vicky generator (a relentlessly upbeat post writer named after an IVE member's catchphrase) in the Planning pattern. The notebook calls it "a classic Planning application: break it down, then execute".

- **Stage 1 (thinking):** `system_planner` is a "positive-thinking mentor" that lists five reasons why the user's small misfortune is actually super lucky.
- **Stage 2 (writing):** `system_writer` is a "super-optimistic social media angel". It picks the funniest reason and writes a first-person Instagram post with emoji that must end with "完全是 Lucky Vicky 呀！"

The Gradio page has two columns: the five reasons on the left, the final post on the right.

Both notebooks end with `demo.launch(share=True, debug=True)`, which gives a temporary public URL from Colab.

## The further-learning list, and one correction

Slide 31 is a table of "learning directions worth watching". Only two items are marked as entry level for all students: AISuite (building) and [Gradio](https://www.gradio.app/) (interfaces). LangChain, AutoGen (Microsoft), CrewAI, the FAISS / Chroma / Weaviate vector stores and the BGE / E5 / OpenAI embedding models are all marked "for advanced students".

To be clear: **the course builds agents with AISuite and Gradio only. There is no AutoGen or CrewAI implementation.** LangChain appears only in [L08](/posts/ai/2026-09-30-nccu-genai-08-rag-en)'s vector-store notebook. The course summary mentions AutoGen, but no demo in the materials uses it.

Slide 32 introduces two standards for letting LLMs talk to the outside world: Anthropic's MCP for "talking to the outside world" and Google's A2A (Agent-to-Agent) for "talking between agents". It's an easy split to remember. But the slide expands MCP as "Modular Capability Planning", which is a slip. MCP, which Anthropic [announced](https://www.anthropic.com/news/model-context-protocol) in November 2024, stands for **Model Context Protocol**. The [official docs](https://modelcontextprotocol.io/) describe it as an open-source standard for connecting AI applications to external systems. The slide's description of what MCP does (standardizing how LLMs interact with external tools and data sources) is right; only the name is wrong. See the site's [MCP explainer](/posts/ai/2026-03-22-mcp-model-context-protocol-en) for more.

## Homework: week 9 (Chang Gung satellite version)

**Task:** AI Agents: build your own super agent. **Pick one** of the Planning pattern (CoT rewrite) or the Reflection pattern, adapt Demo07a or Demo07c to your own idea, and demo it in Gradio.

- Planning: decide what your original task is, then design the two-stage reasoning.
- Reflection: decide what your original task is, then design the reflection loop.

**Submit:** a Colab link (sharing turned on, key points marked in Markdown); the persona prompts for the two stages (think/write) or for the writer and reviewer; key screenshots; the Gradio conversation output. The 1132 deadline was 2025-04-28.

**Rubric** (out of 10, plus 1 for an interesting topic):

| Score | Condition |
|---|---|
| 0 | Link won't open and no screenshots |
| 1 | Same as the instructor's example |
| 2 | "GPT-level", or unrelated to this week's topic |
| 4 | Link won't open, but some screenshots |
| 6 | Topic close to the instructor's example (e.g., a thinking task, pick one of five reasons, a post generator) |
| 7–8 | Mostly meets the requirements |
| 9 | Meets the requirements |

Shared rules: minus 1 if you skip the instructor's standard import block (see [L01](/posts/ai/2026-09-30-nccu-genai-01-why-generative-ai-en)). "Won't open" includes sharing turned off, a non-Colab file, or code that doesn't run end to end. Anywhere you used generative AI, attach the prompt and output screenshots and explain what you understood, or it counts as copying from AI. Plagiarism means a zero for that assignment and 10 points off the course total.

**Self-grading for readers:** the 6-point row explicitly lists "pick one of five, write a post" as too close to the example. To score higher, change the **task structure**, not the topic. For example, have the reviewer score the draft against a checklist, item by item, instead of just suggesting changes. Or have Planning's first stage produce a step list that the second stage executes one step at a time. Submissions go through each school's LMS, so outside readers can only grade themselves against this table.

## Self-check

- Explain how an agent differs from a single prompt using Ng's "no delete key" analogy.
- Say why the slides count RAG as an agent.
- Draw the three-box Reflection flow and map each of Demo07a's three `reply()` calls to a box.
- Explain who actually runs the tool when the model returns `tool_calls`.
- Rewrite one of your own tasks in Demo07c's two-stage shape and name the intermediate output.
- Give MCP's correct full name.

## Further reading

This guide stands on its own. To go deeper, the site has these:

- A full course on agents: [CMU 11-768 AI Agents guide](/posts/ai/2026-09-29-cmu-11768-course-overview-en)
- Choosing a tool interface: [MCP explainer](/posts/ai/2026-03-22-mcp-model-context-protocol-en), [MCP vs CLI vs API](/posts/ai/2026-04-18-mcp-vs-cli-vs-api-agent-tool-interface-en)
- The course landscape and access levels: [Global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)

Previous: [L08 RAG: principles and practice](/posts/ai/2026-09-30-nccu-genai-08-rag-en) | Next: [L10 The adventure that starts with the VAE](/posts/ai/2026-09-30-nccu-genai-10-vae-to-diffusion-en) | [Series overview](/posts/ai/2026-09-30-nccu-genai-course-overview-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [Generative AI 09: Why everyone calls 2025 the year of AI agents (YouTube, in Mandarin)](https://www.youtube.com/watch?v=49fwh6oc5Nc)
- [Yen-Lung Tsai's 1132 Generative AI slide folder (GenAI09, in Mandarin)](https://drive.google.com/drive/folders/1c6A9Pa-c7cNi5kHUp7j-ccgYBRy9JpeA)
- [1132 lecture playlist (in Mandarin)](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv)
- [Chang Gung satellite course page: Generative AI 2025 (in Mandarin)](https://yangchihyuan.github.io/courses/GenerativeAI2025)
- [yenlung/AI-Demo: Demo07a, Reflection agent pattern](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo07a%E3%80%91AI%E4%BB%A3%E7%90%86%E8%A8%AD%E8%A8%88%E6%A8%A1%E5%BC%8F_Reflection.ipynb)
- [yenlung/AI-Demo: Demo07c, two-stage CoT Lucky Vicky generator](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo07c%E3%80%91AI%E4%BB%A3%E7%90%86%E8%A8%AD%E8%A8%88%E6%A8%A1%E5%BC%8F_%E5%93%A1%E7%91%9B%E5%BC%8F%E6%80%9D%E8%80%83%E7%94%9F%E6%88%90%E5%99%A8Two_Stage_CoT%E7%89%88.ipynb)
- [andrewyng/aisuite (GitHub)](https://github.com/andrewyng/aisuite)
- [Andrew Ng on agent design patterns (the talk cited on GenAI09 slide 16)](https://www.youtube.com/watch?v=sal78ACtGTc)
- [Anthropic: Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol)
- [Model Context Protocol documentation](https://modelcontextprotocol.io/)
- [Gradio](https://www.gradio.app/)
