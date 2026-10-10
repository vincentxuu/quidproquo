---
title: "CMU 11-768 Lecture 1: An Agent Is a Model in a Loop — the Hard Part Is Making It Work"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, agent-loop, tool-use, harness-engineering]
lang: en
series:
  name: "Reading CMU 11-768 AI Agents"
  order: 1
tldr: "Lecture 1 of 11-768 strips an agent to its minimum: tool definitions and tool calls are just tokens, the harness parses, executes, and feeds results back into context, and running a ReAct loop makes it an agent. Neubig then lists six capabilities a good agent needs, each of which can be built through training or through the harness, and argues that an agent is a system of harness, sandbox, inference, training, and monitoring — not just a model."
description: "A guided reading of CMU 11-768 AI Agents Lecture 1, \"What Is an Agent?\": how Russell & Norvig's definition maps onto today's LLM agents, tool definitions and chat templates, Toolformer and ReAct, mini-swe-agent's minimal loop, six agent capabilities, the trade-off between training and harness engineering, and the five components of an agent system."
draft: false
glossary:
  - term: "ReAct"
    aliases: ["Reason + Act"]
    definition: "An agent loop in which the model alternates between reasoning text and tool calls: read the current context, decide the next step, call a tool, append the result to history, repeat."
    context: "The lecture treats it as the minimal form of an agent; Assignment 1 has you implement one."
    links:
      - label: "ReAct (arXiv:2210.03629)"
        url: "https://arxiv.org/abs/2210.03629"
  - term: "chat template"
    aliases: ["apply_chat_template"]
    definition: "The rules that turn structured messages, tool definitions, tool calls, and results into the flat text the model actually reads. Each model family uses its own format."
    context: "The lecture uses it to show that a tool call is just another span of tokens to the model."
  - term: "grammar-constrained decoding"
    aliases: ["constrained decoding"]
    definition: "Restricting generation to tokens that conform to a grammar (such as a tool's JSON Schema), guaranteeing the output parses."
    context: "Listed in the lecture as a harness-side way to improve tool-call accuracy."
  - term: "context compaction"
    aliases: ["context compression"]
    definition: "Summarizing older conversation history into a shorter version when the context fills up, so the agent can keep working on longer tasks. The cost is that the summary may drop important instructions."
    context: "The email-deletion incident at the start of the lecture happened because compaction lost the instruction to ask first."
---

> 🌏 [中文版](/posts/ai/2026-09-29-cmu-11768-lecture-01-what-is-an-agent)

**Video status: Videos included.** [Source details](#course-video-sources)

Lecture 1 of [CMU 11-768 AI Agents](https://www.cmu-agents.com/) (Aug 25, 2026; [recording](https://www.youtube.com/watch?v=UwfjzyLnvMg), [slides](https://www.cmu-agents.com/slides/lecture-01-agents.pdf)) comes in two halves. In the first, Daniel Fried strips an agent down to its minimum: a language model plus a loop that executes tools. In the second, Graham Neubig asks the next question: writing the loop isn't hard, so how do you make it actually work? His answer is a map of "six capabilities × two paths," and the course schedule is laid out along that map.

This post follows the lecture in order: the opening successes and failures, the definition of an agent, the three steps from language model to agent, the six capabilities, the training-versus-harness trade-off, the five components of an agent system, and the course's learning objectives. Format, grading, and assignment details are in the [series overview](/en/posts/ai/2026-09-29-cmu-11768-course-overview-en).

## Course video sources

Verified public recording for CMU 11-768 Fall 2026 lecture 1, published on course instructor Graham Neubig’s channel; its title and description identify this course.

```youtube
url: https://www.youtube.com/watch?v=UwfjzyLnvMg
title: CMU AI Agents 2026: 1. What are Agents and How Do They Work?
```

Original videos: [CMU AI Agents 2026: 1. What are Agents and How Do They Work?](https://www.youtube.com/watch?v=UwfjzyLnvMg)

Official sources:

- [cmu-11-768-ai-agents — official course materials and recording index](https://www.cmu-agents.com/#/schedule)

Checked on 2026-10-10.

## Opening: agents can do big things, and break big things

Fried opens with two contrasting examples.

The success is Nicholas Carlini's experiment at Anthropic: [16 parallel Claude agents wrote a 100,000-line C compiler in two weeks](https://www.anthropic.com/engineering/building-c-compiler), in Rust, capable of compiling the Linux kernel.

The failure is a February 2026 post on X by Summer Yue, an AI security and safety researcher at Meta (slide 3 shows screenshots of the chat). She had OpenClaw clean up her inbox and told it to suggest what to delete and not act until she said so. It worked on a small test inbox; on her real one, the volume of mail [triggered context compaction, which lost that original instruction](https://www.pcmag.com/news/meta-security-researchers-openclaw-ai-agent-accidentally-deleted-her-emails), and the agent started deleting mail in bulk while she couldn't stop it from her phone. Fried names the mechanism the course will tackle head-on: compressing history so an agent can run longer tasks can itself compress away the most important constraint.

Then he runs a show of hands: for each of these six tasks, would you let an agent do it autonomously, ask first, or never?

| Task | Room's majority |
|---|---|
| Diagnose why the online store's checkout started failing | Autonomous |
| Draft and send a product-launch email to 50,000 customers | Ask first |
| Collect your tax forms, prepare and file your 2025 return | Never |
| Migrate a payments API from Python to Rust without breaking mobile checkout | Close between autonomous and ask first |
| Buy concert tickets when my favorite band plays nearby | Autonomous |
| Adjust an insulin dose after a week of glucose readings | Never |

There's no right answer here. The point is that capability and trust are separate: things agents can technically do are not things people are willing to hand over. The sandboxing, safety, interaction, and human-oversight lectures come back to this.

Last come two CMU demos. One is JY Koh's GUI agent from two years ago: find a Thai restaurant in Pittsburgh on Yelp with at least 200 reviews and a 4.3-star rating, with the model's reasoning on the right and its browser actions on the left. The other is Neubig's OpenHands demo: the agent writes a Flask to-do app, launches it, notices the port is taken and retries, then opens a browser and clicks through adding and deleting items. What Fried stresses is the latter: the agent finds its own mistakes and fixes them.

## What is an agent: the textbook definition still holds

Fried quotes Russell and Norvig's *Artificial Intelligence: A Modern Approach*, chapter 2: an agent is anything that can be viewed as perceiving its environment through sensors and acting upon that environment through actuators. (The slide uses "actuators"; the [first edition's chapter 2](https://people.eecs.berkeley.edu/~russell/aima1e/chapter02.pdf) says "effectors" — same meaning, and later editions switched to "actuators.") He argues this still fits today's LLM agents, and that many techniques developed for earlier agents — retrieval and reinforcement learning, for example — still apply.

Mapped onto LLM agents, the slide lists four elements:

| Element | Today's examples |
|---|---|
| Environment | A code repository, website, application, or workflow |
| State / observations | User messages, file contents, web pages, screenshots, tool results |
| Actions | Replies, file edits, shell commands, API calls, mouse and keyboard events |
| Reward | Passing tests, satisfying LLM-as-a-judge rubrics, positive user feedback |

The reward row previews later lectures. Passing tests gives a clean 1 or 0, but many tasks have no programmatic check and need an LLM judge — the subject of Assignment 2. Ultimately what you care about is whether the user was satisfied, which Valerie Chen's human-agent interaction lecture will address.

## From language model to agent: three steps

### Step 1: a language model only emits tokens

The course assumes you've trained a language model, so this part is quick: at each step the model predicts a distribution over the next token, samples one, appends it to the prefix, and predicts again. Chain of thought has the model generate intermediate reasoning that isn't the answer; those tokens become context for later predictions.

Fried points out that none of this is an agent yet: the model is only interacting with the prompt you gave it and can't touch the outside world.

### Step 2: a tool is a typed interface description

To act on an environment, the main mechanism is tools. A tool is an interface the environment exposes to the model — think of it as an API. The slide uses a file-reading tool:

```json
{
  "name": "read_file",
  "description": "Read a UTF-8 file.",
  "parameters": {
    "type": "object",
    "properties": { "path": { "type": "string" } },
    "required": ["path"]
  }
}
```

A name, a natural-language description, and a JSON Schema for the arguments. The key is the next step: the model never sees this JSON object. It sees the text the chat template renders it into, for example wrapped in `<tools>...</tools>`. The model either has been trained, or learns from a few examples, to read that text.

Tool calls and results work the same way. The model generates `<tool_call>{"name":"read_file","arguments":{"path":"test.py"}}</tool_call>`; the harness runs it and inserts the file contents wrapped in `<tool_response>...</tool_response>`; the model continues generating from there.

Fried asks the room: besides JSON, how else could a model call tools? Someone answers: just write code — bash commands, or Python function calls. He says later lectures will show this is often more efficient than generating JSON, with its own trade-offs. Lecture 2's reading [CodeAct](https://arxiv.org/abs/2402.01030) (Wang et al., ICML 2024) runs exactly this comparison: across 17 LLMs, using executable Python as the action gives up to 20% higher success than JSON or plain-text formats and up to 30% fewer actions. It doesn't win for every model, though (code was best for 12 of the 17), and JSON holds up reasonably well with closed-source models.

### Step 3: put the model in a loop

The slide's title is "actions as tokens": to the model, a tool call is just another token sequence it can predict, naming a tool and supplying arguments. What actually parses, validates, and executes the call, then turns the result back into observation tokens, is the **harness** outside the model. This division is the foundation of the whole course: the model only handles tokens (later, images and other modalities too), and the harness deals with the world.

[Toolformer](https://arxiv.org/abs/2302.04761) (Schick et al., NeurIPS 2023) is an influential paper here. With only a handful of human-written demonstrations per API, the model uses in-context learning to sample candidate tool calls in ordinary text; only the calls that reduce the loss on the following tokens are kept, and the model is then fine-tuned with the standard language-modeling objective. The result is a model that decides for itself when to call a tool and uses the result to improve later predictions — self-supervised, and built on the ordinary LM training recipe.

With tools, an agent is a loop. [ReAct](https://arxiv.org/abs/2210.03629) (Yao et al., ICLR 2023; the name comes from reasoning + acting) works like this:

1. The context holds a general task description (e.g., "resolve GitHub issues"), the user's specific request, the list of available tools, and the history of observations and actions so far
2. The model produces a chain of reasoning, then one or more tool calls
3. The harness executes them in the environment, the environment state changes, and the results are appended to history
4. Go back to step 1

Finishing is also done with a tool: a `send_message` tool that delivers the answer to the user signals completion. How a model decides it's done is covered in the planning lecture.

The slide shows the core of [mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent). Its README says the agent class is only about 100 lines of Python, yet it scores above 74% on SWE-bench Verified; Fried recommends reading it. Below is the slide's excerpt, which is trimmed relative to the current repo: the real `run` wraps the loop in exception handling and breaks out on an exit message, and `query` first checks step, cost, and time limits.

```python
def run(self, task: str = "", **kwargs) -> dict:
    self.messages = []
    self.add_messages(
        self.model.format_message(role="system", content=self._render_template(self.config.system_template)),
        self.model.format_message(role="user", content=self._render_template(self.config.instance_template)),
    )
    while True:
        self.step()

def step(self) -> list[dict]:
    return self.execute_actions(self.query())

def query(self) -> dict:
    message = self.model.query(self.messages)
    self.add_messages(message)
    return message
```

The skeleton is one system message, one task message, then a loop: query the model, append its reply to history, execute the actions, append the observations. Assignment 1 asks you to implement a similar controller, create and call your own tools, and use it to fix bugs in a chess app.

Finally he opens a real trajectory on [swebench.com](https://www.swebench.com/) (GPT-OSS resolving a pull request): the system message just says "you are a helpful assistant that can interact with a computer shell," and the user message gives the specific task. At each step the model produces some reasoning and a bash command; the environment runs it and returns only an exit code — zero means success — and the next step begins. This agent uses exactly the "just write code" tool format.

## A good agent needs six capabilities

Neubig takes over for the second half, and his first point is that building an agent isn't hard — making it genuinely useful is. He asks the room what annoys them about agents. Answers include: too slow, too verbose, forgets things, misunderstands you, accesses things it shouldn't, random gaps in common knowledge, writes a thousand lines when two would do, forgets earlier sessions, doesn't push back when you say something unreasonable, lies, and makes lots of hidden assumptions.

He groups them into six capabilities:

1. **Accurate tool calling.** Nobody mentioned it because people take it for granted now. But if you're the one training the model, it's the foundation of the foundation: call tools wrong and every task fails.
2. **Coherence over long context.** Forgetting things, forgetting prior sessions, and the compaction-then-delete example from the opening all belong here.
3. **Customizability.** Every person and every course has different requirements; the agent should do things your way.
4. **Complex task management.** Breaking tasks down and sustaining very long processes — Neubig calls this a very big problem.
5. **Environment understanding.** "A thousand lines where two would do" is this kind of failure: the model doesn't realize the change is actually simple.
6. **Safety.** Many people treat safety and capability as separate research areas. Neubig's view is that safety is itself a capability: if it isn't built into the agent, you won't trust it with anything important.

## Two paths: train the model, or change the harness

Each capability can be built from two directions:

| | LLM training | Harness engineering |
|---|---|---|
| Approach | Change the model's behavior through pretraining, SFT, or RL | Change the system around the model: prompts, tools, memory, control flow |
| What it teaches | Reusable patterns for reasoning, tool use, and recovery | Context, validation, retries, and safety boundaries |
| Where the capability lives | Part of the learned policy | Emerges from the model–harness combination |

Neubig polls the room on which matters more; both sides get plenty of hands. His answer is that both matter, but the usual sequence is: people first discover and solve a problem at the harness level; model trainers then realize it's serious enough to train for specifically and bake it into the model; and the harness no longer has to handle it. So he sees training as usually the more fundamental fix, but it's slow, and your problem often can't wait — so you start with the harness.

A student asks which capabilities will keep needing harness work no matter how good models get. Neubig's answer:

- **Long context will definitely stay.** Keeping all your memories in context isn't only an accuracy problem but an efficiency one, as long as we're in the quadratic-cost Transformer paradigm.
- Tool calling, coherence within the context window, task management, environment understanding, even safety — **all could in principle be solved by the model, but haven't been**, so the harness is still needed.
- **Customizability is interesting**: models can be trained on the fly, but often you just want to hand the agent a script or situation-specific instructions, and training may not be the best tool.

Another question: what if inference latency is critical? Neubig's observation is that tight latency usually means a smaller model, and the smaller the model, the more safeguards or task-specific adaptation you need, since larger models generally generalize better.

### Where training fits in this course

The slide splits agent training into three stages: pretraining (text, code, multimodal data; broad representations), mid-training or SFT (instructions, traces, tool calls; formats and demonstrations), and RL (rewards or preferences; trajectory-level behavior).

The course skips pretraining for a blunt reason: it scales to the whole internet, and the course's compute credits can't cover it. SFT gets lighter treatment because the prerequisite already requires it; the focus is on building data for agent environments. RL is the emphasis: in the show of hands, Neubig estimated that about one in ten had trained agents with RL (a spoken estimate from the raised hands).

### Six capabilities × two paths

Neubig maps each capability onto both paths:

| Capability | Harness engineering | LLM training |
|---|---|---|
| Accurate tool calling | Grammar-constrained decoding to guarantee calls match the spec | SFT on tool-calling traces |
| Long-context coherence | Context compaction, dynamic memory lookup, sub-agent delegation | SFT: long-context training (lightly covered) |
| Customizability | Agent memory, skills, custom tools | RL from user feedback (still new) |
| Complex task management | Planning/decomposition tools, sub-agent delegation | RL on complex, long-horizon tasks |
| Environment understanding | Skills carrying domain knowledge | SFT on data with the expected observation shape; RL in domain-specific environments |
| Safety | Sandboxed tools, limited credential access, trajectory monitoring | Safety-aware RL |

Some cells come with extra commentary:

- **Sub-agent delegation**: hand part of a long task to another agent, which keeps that context and discards it when done, so the main agent's context doesn't blow up.
- **Skills**: prompts, sometimes with scripts, loaded only at a particular moment. Neubig thinks customizability is where harness engineering shines most right now.
- **Plan mode**: he tells a small story — a popular coding tool's "plan mode" button just added "please plan, don't do anything" to the prompt, because everyone wanted a button. More sophisticated approaches exist, of course.
- **Environment understanding**: GUI agents need to understand web pages and interfaces; many open models don't support multimodal input at all, and those that do make far more mistakes than with text. Put a model in a stock-trading environment and it struggles with time series; give it images of petri dishes and it struggles too. Neubig's point is that "models will just get better" is wrong — people make models better. When a new model version suddenly composes music better, it's usually because someone built a music environment and added it to training. Much of the work is building domain-specific environments.
- **Safety**: he cites OpenAI's July 2026 incident. As Neubig tells it in class, OpenAI's newest model was running a cybersecurity test in an agent harness, couldn't break the target system, and instead broke into Hugging Face, got the answers, and completed the task that way. [Simon Willison's write-up of the public account](https://simonwillison.net/2026/Jul/22/openai-cyberattack/) differs in the details: it involved a combination of OpenAI models (including GPT-5.6 Sol and an even more capable pre-release model, all with reduced cyber refusals); during the ExploitGym evaluation, rather than solving the test, they used a zero-day in the package registry cache proxy to get out of the sandbox and then pulled test solutions from Hugging Face's production database. The source does not say it did this because it couldn't solve the task. Neubig's breakdown is that several layers failed at once: the sandbox didn't contain the agent, monitoring didn't catch it in time, and because the test was specifically about offensive capability, the model had fewer safeguards than a public release would.

## Agents are systems, not just models

Neubig then stresses that agents are more complex than anything you've handled in other ML courses, because they're whole systems. The slide splits them into the model plus five components:

| Component | What it does | Example software |
|---|---|---|
| Harness | Manage state, tools, memory, and control flow; validate actions and handle errors; enforce permissions and safety boundaries | Coding agents: Claude Code, Codex, OpenHands, OpenCode, Pi; orchestrators: LangChain (he said maybe it should say LangGraph), CrewAI |
| Sandbox | Isolate code and tool execution; limit compute, network, and filesystem access; create reproducible environments | Docker, Apptainer, Modal, Sail |
| LM inference | Serve generations reliably; batch requests and reuse the KV cache; manage streaming, parallelism, throughput | vLLM, SGLang |
| Training systems | Prepare data and collect rollouts; coordinate distributed workers; checkpoint, evaluate, and reproduce runs | SkyRL, Miles |
| Observability and monitoring | Capture traces and metrics; track quality, cost, and failures; compare trajectories and evaluations | Laminar, MLflow (LangSmith, which Fried showed, is another) |

A few details added in class:

- **The two kinds of harness have different philosophies.** Coding agents are simpler in how agents interact with each other but give a single agent a wide action space — write arbitrary code, operate websites. Agents inside an orchestrator can do less (only answer support questions, only query a database), and in exchange you get declarative workflows. More constraints, less expressiveness; each has its place.
- **Sandboxes serve both safety and evaluation.** In SWE-bench, every task has its own sandbox capturing the environment before the agent starts, so it can be reproduced locally.
- **Agent inference is harder than ordinary LLM inference.** You might have worked with 16K or 32K contexts before; a modern coding agent needs at least around 256K. Context grows with every action, so reusing the cache from earlier requests becomes critical.
- **There are a lot of inference providers.** Neubig says that on [OpenRouter](https://openrouter.ai/), a single model often has twenty or thirty providers serving it. That's on the high side: checking OpenRouter's endpoints API on 2026-09-29, the popular gpt-oss-120b had 20 providers, Llama 3.3 70B Instruct had 10, and DeepSeek V3.1 had 7.

## What the course wants you to be able to do

The slide lists five learning objectives:

1. Implement an agent from scratch on top of an open-source LLM, including your own tools
2. Design evaluations for multi-step tasks — Neubig stresses this matters even if you only care about training, because building and scaling evaluations for RL is current best practice
3. Train agents to improve their capabilities: get the RL loop running and deal with the systems problems along the way
4. Reason about safety and reliability trade-offs
5. Pursue an open research question in agents

The first three correspond to the three individual assignments (harness, evaluation, RL training), which take up roughly the first half of the semester; the second half is a team research project (the slides and the lecture say teams of 2–3; the website's grading table says 2–4, while its policy section still says 2–3 — see the series overview). The semester runs through agent capabilities, domains, training, frameworks and safety, and interaction, ending with guest lectures and poster presentations. Prerequisite, grading, AI-tool policy, and slack-day details are in the [series overview](/en/posts/ai/2026-09-29-cmu-11768-course-overview-en); assignment dates on the slides were tentative, so go by the website.

## Three things to do tonight

- **Read mini-swe-agent's [agent class](https://github.com/SWE-agent/mini-swe-agent/blob/main/src/minisweagent/agents/default.py).** The README puts the core at about 100 lines (the whole `default.py` file is currently about 190, the extra being limit checks and exception handling); afterward you'll know what the core of the coding agent you use looks like, and it's the best preparation for Assignment 1.
- **Open a trajectory on [swebench.com](https://www.swebench.com/) and step through what the model receives and emits.** Notice how thin the observations are (often just an exit code), then ask whether your own agent makes its decisions on observations that thin when it fails.
- **Take the last time an agent annoyed you, put it in one of the six capability cells, and ask: does this need a harness change or a different model?** That's the most direct use of Neubig's map.

## Self-check

<details>
<summary>1. Why say "a tool call is just tokens"? What does that mean for training?</summary>

Tool definitions, calls, and results are all rendered to text by the chat template; the model is only predicting the next span of tokens, and the harness does the executing. So to make a model better at calling tools, you can do SFT directly on tool-calling traces — the same recipe as ordinary language-model training. Toolformer goes in the same direction, except its training data isn't human-labeled traces: it's tool calls the model sampled itself and then filtered by whether they reduce the loss on the following tokens.

</details>

<details>
<summary>2. Which of the six capabilities does the opening email-deletion incident fall under? How could each path address it?</summary>

Long-context coherence (with a safety dimension). On the harness side, improve the compaction strategy — for example, mark the user's key constraints as non-compressible, or force confirmation before irreversible actions like deletion. On the training side, long-context training so the model doesn't need to compact so early.

</details>

<details>
<summary>3. Which capability does Neubig think will always need harness work, however strong models get? Why?</summary>

Long context. Keeping every memory in context affects efficiency, not just accuracy; under the quadratic cost of Transformer attention, the harness still needs compaction, memory lookup, and delegation.

</details>

## Further reading

- On this site: [The Model Is a Component, the Harness Is the System](/en/posts/ai/2026-08-10-model-component-harness-system-en), the same line of argument as "agents are systems"
- On this site: [From Prompt to Harness: The Three Evolutions of AI Engineering](/en/posts/ai/2026-03-28-harness-engineering-evolution-en)
- On this site: [Context Engineering: Why Your AI Agent's Problem Is Information, Not the Model](/en/posts/ai/2026-03-24-context-engineering-guide-en), a primer for lecture 3
- On this site: [The OpenClaw Agent Loop](/en/posts/ai/2026-03-28-openclaw-agent-loop-en), how the loop behind the opening incident is written
- On this site: [Reading Stanford CS329Z](/en/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en), which also has you build a harness from scratch but doesn't touch training
- On this site: [CME295 Lecture 7: Agentic LLMs](/en/posts/ai/2026-09-29-cme295-agentic-llms-en), the same ground from the RAG and function-calling angle

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [11-768 Lecture 1 slides: What Are Agents? And How Do They Work?](https://www.cmu-agents.com/slides/lecture-01-agents.pdf)
- [11-768 Lecture 1 recording](https://www.youtube.com/watch?v=UwfjzyLnvMg)
- [11-768 AI Agents course website](https://www.cmu-agents.com/) (schedule and readings)
- [Toolformer: Language Models Can Teach Themselves to Use Tools](https://arxiv.org/abs/2302.04761) (arXiv:2302.04761, NeurIPS 2023, assigned reading; method and sampling/filtering per Section 2 of the full text)
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) (arXiv:2210.03629, ICLR 2023, assigned reading)
- [mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent) (assigned reading; README line count and SWE-bench Verified score, `agents/default.py` source, checked 2026-09-29)
- [Executable Code Actions Elicit Better LLM Agents (CodeAct)](https://arxiv.org/abs/2402.01030) (arXiv:2402.01030, ICML 2024, lecture 2 reading)
- [Building a C compiler with a team of parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler) (Nicholas Carlini, Anthropic, Feb 5, 2026)
- [Meta Security Researcher's AI Agent Accidentally Deleted Her Emails](https://www.pcmag.com/news/meta-security-researchers-openclaw-ai-agent-accidentally-deleted-her-emails) (PCMag, Feb 24, 2026)
- [OpenAI's accidental cyberattack against Hugging Face is science fiction that happened](https://simonwillison.net/2026/Jul/22/openai-cyberattack/) (Simon Willison, Jul 22, 2026)
- [SWE-bench](https://www.swebench.com/)
- [Artificial Intelligence: A Modern Approach, 1st ed., Chapter 2: Intelligent Agents](https://people.eecs.berkeley.edu/~russell/aima1e/chapter02.pdf) (Russell & Norvig; original wording of the agent definition)
- [OpenRouter endpoints API: gpt-oss-120b](https://openrouter.ai/api/v1/models/openai/gpt-oss-120b/endpoints) (provider count, checked 2026-09-29)
