---
title: "Agents, Prompts, and RAG: What's Left After the Lecture Is the Hard Part"
date: 2026-08-16
category: ai
type: deep-dive
tags: [ai-agent, rag, prompt-engineering, evaluation, stanford-cs230]
lang: en
series:
  name: "Reading Stanford CS230"
  order: 8
tldr: "A BCG experiment found a jagged frontier: inside it, AI substantially improved consultants' work; outside it, AI made results worse — and people fell asleep at the wheel. The lecture also takes a strong position: avoid fine-tuning wherever possible, because by the time you're done tuning, the next model already beats your fine-tuned version."
description: "A full read-through of Stanford CS230 (Autumn 2025) Lecture 8: the full vertical axis from prompt to chain to RAG to agentic workflow to multi-agent, including BCG's jagged frontier, four forms of LLM-as-judge, the deterministic-to-fuzzy paradigm shift, three axes for slicing evals, and why the course only teaches breadth."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-16-cs230-agents-prompts-rag)

> [The previous post](/posts/ai/2026-08-16-cs230-ai-project-strategy-en) covered deciding which pipeline stage to fix. This one runs the whole vertical axis from prompt to multi-agent.

This post covers **[Lecture 8: Agents, Prompts, and RAG](https://www.youtube.com/watch?v=k1njvbBmfsw)** (2025/11/11, Kian Katanforoosh, 1 hour 50 minutes).

It's **the most-watched lecture in the series** at 460,000 views, three times the second place. And in 2024 it was a one-line title under Lecture 9, "RAG and AI Agents," **with no slides**; in 2025 it expanded into a full 110-minute session. That change alone is a miniature of where the center of gravity has moved.

(**This lecture overlaps heavily with three existing series on this site: [The Agent Production Line](/en/series/agent), [AI Agent Systems](/en/series/ai-agent-systems), and [RAG Systems](/en/series/rag-systems).** This post covers the lecture content in full and points at the site's deeper treatments where they overlap.)

## Opening: two axes

```
vertical (engineering):  prompt → chain → RAG → agentic workflow → multi-agent
horizontal (swap model): GPT-3.5 Turbo → GPT-4 → GPT-4o → GPT-5
```

> "**This lecture is about the vertical axis.**"

(His aside on GPT-5: "that's a separate issue, because it actually **wraps other models inside itself.**")

## Why the base model isn't enough

The students' answers: lacking domain knowledge, real data quality below training data quality, **stale information**, plenty of breadth but insufficient precision on narrow tasks, and models that are too heavy ("you're using an enormous model and actually using 2% of its capability").

Katanforoosh adds: LLMs are **extremely hard to control.** His examples — Microsoft's 2016 Twitter bot that learned from users and **turned into a racist jerk within 16 hours before being pulled**; and Sam Altman and Elon Musk accusing each other's LLMs of being propaganda machines:

> "That tells you — **even Grok and OpenAI, two of the best-funded, most talented teams around, haven't got controlling LLMs right.**"

Plus a good niche example: a biotech company classifying user reviews, but **NPS in that industry is inherently much lower**, so what counts as negative elsewhere is actually neutral here.

### Context windows and needle in a haystack

> "Even the best models today have context windows on the order of **a few hundred thousand tokens.** For a sense of scale: **200,000 tokens is about two books.**"

**Needle in a haystack**: insert a sentence at a random point in a large corpus (say the whole Bible) and ask the model about it.

> "This is hard not because the question is hard, but because you're asking the model to **find one fact in an enormous corpus.**"

### Will long context replace RAG?

The lecture cites the argument that in theory **with infinite compute, RAG becomes useless**, because you could read the entire corpus and then answer. He gives three rebuttals:

1. **Latency**: "imagine every question means the AI reads your entire cloud drive. That doesn't make sense."
2. **Attribution**: RAG can cite sources
3. **The search engine analogy** (the best one): "when you search on a search engine, there are very sophisticated crawling and ranking algorithms behind it. By contrast, **if every search meant reading the whole internet**, that makes just as little sense."

> "There's always this debate in the community about whether a method is **future-proof.** Compute roughly doubles every year, so **some of what we're learning now may be irrelevant in three years. We don't know.**"

## Prompt engineering

### BCG's experiment: the jagged frontier

The study split BCG consultants into three groups: no AI / GPT-4 / GPT-4 **plus prompt training.** Three findings:

1. **The jagged frontier**: some tasks fall inside it, where AI substantially improves speed and quality; some fall outside, where **AI makes the results worse**
2. **"Falling asleep at the wheel"**: people relied on AI for tasks **outside** the frontier without reviewing the output carefully, and did worse
3. **The prompt-trained group performed best**

**Centaur vs. cyborg** (a useful dichotomy):

| | Behavior | Who resembles it |
|---|---|---|
| **Centaur** | **Split and delegate**: write a long prompt, hand it over, collect the finished result | Enterprises automating a process |
| **Cyborg** | **Incomplete delegation**, rapid back-and-forth with the model | "I find **students are mostly cyborgs**" |

His view of the job title is worth quoting:

> "A lot of companies say they're hiring prompt engineers. **I don't buy it.** I think that's just a skill everyone should have. **You won't build a career out of prompt engineering**, but you'll probably use it throughout your career as a very powerful skill."

### The techniques themselves

Go from "summarize this document" to "summarize this ten-page renewable energy paper in five bullet points, focused on the key findings and their implications for policymakers" — adding audience, format, focus. The students add more: **give examples**, **role-play** (act as…), **reflection** (ask it to critique its own output — "**this one usually works best of all of these**"), and **chain of thought** (break it into steps, don't skip).

**Prompt templates** are valuable because they go into code and scale to every user: an HR system knows "Jane is an L3 product manager, in the US, prefers English," and that metadata can be interpolated into the template to customize for Jane, while Joe who prefers Spanish gets a different fill.

**Zero-shot vs. few-shot**: "this product is fine, but I expected more" — negative or neutral? It may depend on the industry. Few-shot with a handful of already-labeled examples aligns the model to **your** standard.

> "AI startups often do this: a user says something, you have someone label it, and you add it as a few-shot example to the relevant prompt in the codebase. **Think of it as building a dataset, but you never touch model parameters — you just change the prompt.**"

**A very concrete practical number**: Workera's voice conversation product,

> "We know **the model loses itself after eight turns**, because you're pasting in every previous user response. So what we do behind the scenes is **chunk the conversation into chapters** — the first eight turns are one chapter, then we restart from a new prompt with the first half **summarized** into it."

(A student asks whether there's research on how long a prompt can get before it breaks → "there is, but **that research goes stale every few months.**")

### Chaining — he calls this the most important one

> "**Chaining is the most popular of the prompt engineering techniques we've looked at.** It is not chain of thought."

The example is a customer complaint reply: one prompt (identify the problem + explain the cause + provide a fix) vs. three separate prompts.

**The key argument isn't quality, it's debuggability:**

> "A single prompt might work, but it's **very hard to control.** With all the steps buried in one prompt, you can't debug step by step or find out which step is weaker."

A student pushes back: "if three separate ones are good, why not merge them into one that labels the steps?" His answer lands:

> "**The intermediate output is exactly what you want to see.** With the first approach I can only collect end-to-end feedback — I can optimize that prompt, but **I can't trace back where the problem is.** With the second approach: if the outline is mediocre, I know optimizing the outline pays off a lot; if the outline is exactly what I wanted but the final step translating it into a customer letter doesn't match our internal voice, **then I know the third prompt is where the return is.**"

(The cost is latency — some applications shouldn't use long chains.)

### Four forms of LLM-as-judge

Start manual: human scoring. "If you have the time, do it by hand first — you'll find problems quickly and build intuition for which tweaks help."

To scale, automate it (he names Promptfoo, which his team uses to run five LLMs at once in a table):

1. **Pairwise comparison**: which of these two summaries is better
2. **Single-point scoring**: rate this summary 1–5
3. **Reference-guided pairwise comparison**
4. **Scoring with a rubric** — his example is concrete: "a five is: the summary is under 100 characters, mentions at least three distinct key points, and opens with an overview before going into detail. A zero is: the model failed to summarize and instead became extremely verbose."

And you can **stack techniques**: few-shot the rubric with examples of a five, a four, and a three.

> The site's [three forms of RAG and the evaluator paradox](/posts/ai/2026-08-10-rag-graph-agentic-variants-en) covers this approach's fundamental limit: **your judge won't understand "good" better than you do.**

## Why not to fine-tune

> "**I'm not a fan of fine-tuning**, I avoid it wherever I can."

The reasons: it needs a lot of labeled data; it **may overfit to specific data and lose general capability**; it's time- and cost-intensive. And the strongest argument:

> "At Workera we stay as far from fine-tuning as possible, because **by the time you finish fine-tuning, the next model is out, and it beats your fine-tuned version of the previous generation.**
>
> The advantage of prompt engineering approaches is — **you drop the next best pretrained model into your code and everything upgrades instantly. Fine-tuning doesn't work that way.**"

**When you should still do it**: when the task needs **repeated high-precision output** (legal, scientific explanation), or when the general model struggles with the domain's language.

### The Slack fine-tuning joke

Someone fine-tuned on internal company Slack messages to build a model that "talks like us." The result:

> - "Write a 500-word blog post on prompt engineering"
> - "**I'll get to it in the morning.**"
> - "It's morning now."
> - "I'm writing it now. It's six thirty in the morning here."
> - "Write it now." … "Please."
> - "**Fine, I'm writing it now. Actually I don't know what you want me to say. I can only describe the process.**"

> "He wanted the model to talk like the people at the company, **and it really did become like a person — rather than doing what it was told.**"

**⚠️ This position gets challenged head-on in the next post.** Lecture 9's guest speaker Laurence Moroney says fine-tuning is the single skill developers will need most over the next two or three years. They're talking about different markets, and that tension is handled in the next post.

## RAG

The lecture lists the problems with a standalone LLM: small context window, difficulty remembering details inside a large context, knowledge cutoff, **hallucination** (extremely costly in medical diagnosis or education), and **no sourcing** ("a pure LLM hallucinates badly when finding sources — it'll invent completely fake papers").

**The vanilla RAG flow**: compress documents into low-dimensional representations with embeddings → store in a vector database → embed the user's question with **the same algorithm** → retrieve by distance → send the retrieved documents into the LLM alongside the prompt template.

Two practical details:

- **The embedding-dimension trade-off**: "too small loses information, too large adds latency."
- **The prompt template should say** "if the answer isn't in the documents, say I don't know," and should demand "tell me exactly which page, chapter and line, with a link."

He explicitly points back to Lecture 2: "we went through a lot of embedding methods together, triplet loss and so on, you remember." (That's [post 2 in this series](/posts/ai/2026-08-16-cs230-how-embeddings-are-trained-en).)

**Improvements**:

- **Chunking**: **store vectors for the whole document and at section level simultaneously**, retrieve at both levels, and the attribution gets more precise
- **HyDE (hypothetical document embeddings)**: the user's question doesn't look like the documents, so **generate a fake, hallucinated document from the question first** and embed that to match against

> The site's [complete guide to RAG system patterns](/posts/ai/2026-03-14-rag-patterns-complete-guide-en) lays out ten generations of this evolution from Naive to Multi-Agent, while [hybrid search](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en) and [PageIndex](/posts/ai/2026-05-08-pageindex-vectorless-rag-en) each handle one of the two paths not developed here.

## Agentic workflow

### Why Andrew Ng coined the term

> "A lot of companies say agent, agent, agent everywhere. Go work at these companies and you'll find **they mean very different things by agent**: some have one prompt and call it an agent, some have a complex multi-agent system and call it an agent. **Calling everything an agent isn't fair to the word.**"

**And a second reason, rarely mentioned elsewhere**:

> "Calling it an agentic workflow also keeps us from **confusing it with the agent from the reinforcement learning lecture** — in RL, agent has a very precise definition: it interacts with an environment, transitions from state to state, has rewards, has observations."

([Post 5 in this series](/posts/ai/2026-08-16-cs230-deep-rl-and-rlhf-en) is that lecture. The site's [conceptual boundaries](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries-en) post draws the lines between these terms more finely.)

**Single-step vs. multi-step, side by side**: a user asks "can I get a refund?" — the RAG version answers "refunds are available within 30 days of purchase" with the policy document attached; the agentic version does: **retrieve the policy → ask for the order number → call the API to look up the order → confirm eligibility and that it lands in three to five business days.**

### Components and degrees of autonomy

A travel booking agent has: prompts, **context management (memory)**, tools (flight/hotel/car rental/weather/payment APIs), resources.

**The memory-tiering metaphor is useful**:

> "Not every memory needs fast access. The first question is 'what's your name' — that goes in **working memory**, because you use it every time you speak. The second question is 'when's your birthday' — **do you need that every day? Probably not**, so that goes to long-term / archival memory."

The cost argument: "imagine **reading the whole memory on every call** … **if a memory lookup takes three seconds, then every exchange with the LLM costs you three seconds.**"

**Three levels of autonomy** (cleaner than the usual taxonomy):

| Level | What's hardcoded | Example |
|---|---|---|
| Lowest | **The steps are hardcoded** | Identify intent → look up customer history → call the API … |
| Semi-autonomous | **Tools hardcoded, steps not** | "You're a travel advisor, here are the tools you can use" |
| Highest | **It decides its own steps, and can create tools** | Give it a code editor and it can ping any API and write code to compute distances |

**MCP vs. wiring APIs directly**: wiring APIs directly means feeding docs to the model one by one and teaching it how to call each — **it doesn't scale well**; with MCP the agent just asks "what do you need from me to give me flight information," gets back "origin, destination, your general requirements," and a few exchanges settle it.

(A student asks "when the API changes, MCP has to change too — isn't that the same problem?" He concedes: "yes, but at least it lets the agent go back and forth to elicit the requirements." Asked about security he says plainly, "**I'm not an expert on this.**")

> The site's [protocol layer](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer-en) post separates what MCP, A2A, ACP and Skills each solve; [the memory problem in agentic engineering](/posts/ai/2026-04-20-agentic-engineering-memory-en) breaks memory types and ownership down further.

## Deterministic → fuzzy: a paradigm shift in software engineering

This is the best segment of the lecture, and there's nothing like it elsewhere on the site.

> "The best engineers can **switch from deterministic thinking to fuzzy thinking** and judge between the two."

| | Traditional software | Agentic software |
|---|---|---|
| Data | Structured (JSON, databases, forms) | **Free-form text and images**, requiring dynamic interpretation |
| Behavior | Deterministic | **Fuzzy** |
| Architectural thinking | Split by **technical function** (data engineering here, UI/UX there, business logic there) | **Think like a manager**: if you gave this product to a group of people, what roles would there be? Graphic designer → marketing manager → performance marketing → data scientist |

**His warning about fuzzy engineering is well put**:

> "Fuzzy software creates an enormous number of problems. Imagine letting users ask anything on your website. **The probability it breaks is very high. The probability you get attacked is very high. This is far more complicated than what's said on Twitter. Fuzzy engineering is genuinely hard.**
>
> You can get publicly torn apart because some user did something you authorized them to do and wrecked the database — **we've seen this happen to a lot of companies over the past two years.**"

**Workera's own solution**: their assessments have deterministic question types (single choice, multiple choice, drag-to-order — with one right answer) and fuzzy ones (voice role-play, voice plus coding — where **the grading algorithm can be wrong and being wrong is costly**). Their approach is a **human-in-the-loop appeal feature**: after the assessment you can challenge the agent's judgment and a human steps in to correct it — "**you were too harsh on this person's answer.**"

> "If you're starting a company, I'd encourage you to think: **whatever can be done deterministically, do deterministically first. I want the fuzzy part because it allows more interaction, but I need guardrails around it.**"

(The site's [the model is just a component, the harness is the system](/posts/ai/2026-08-10-model-component-harness-system-en) is the engineering version of the same argument.)

### An enterprise-process example

A financial institution studied by McKinsey took **one to four weeks** to produce a credit risk memo: the client relationship manager gathers data from **15+ sources** → joint analysis with a credit analyst → the analyst spends **20+ hours** writing the memo → it goes back for comments → another round.

With GenAI agents added, **time drops 20–60%**: the relationship manager works directly with an agent system, which decomposes the project into tasks assigned to specialized agents, gathers the analysis and drafts, and two humans then review together and give feedback.

> **⚠️ The case is real, but be careful with the numbers.** McKinsey does have this agentic credit-risk memo case,
> but **their site blocks my extraction tools**, so I could only reach it through secondary reporting and couldn't
> check the original text. And the secondary version differs from the classroom account in two places: the data sources
> are **"at least ten,"** not fifteen or more; and 20–60% is a **productivity increase**, not a time reduction
> (a separate figure covers "30% improvement in credit turnaround"). **A 60% productivity gain and a 60% time
> reduction are not the same claim.**

**But the cold water he pours on it himself is more worth keeping than the case study:**

> "Even if this holds, **the hardest part is changing people.** It's great in theory, but now try applying that second process to ten thousand credit risk analysts. **My guess is this takes 10 or 20 years to really land at scale in an organization**, because change is that hard — rewiring business processes, job descriptions, incentive systems, training people."

## An eval case study

The scenario: a PM asks you to build a customer service agent. **His recommended first step isn't picking a model:**

> "**Go sit with a human support rep for a day or two**, take apart the process they run, and ask where they get stuck and how long things take."

Once decomposed, decide the technology row by row: extract information → a plain LLM is enough; query and update the database → tools (or MCP); draft the reply → LLM; send the email → tool.

**A very good interview tip**:

> "If you're interviewing at an AI startup, **I'd suggest asking them: do you have LLM traces?** Because without traces, debugging an LLM system is very hard — you **can't see the complex chain of prompts being called, and you don't know where the bug is.**"

### Three axes for slicing evals

| Axis | One end | The other end |
|---|---|---|
| Scope | **End-to-end** (user satisfaction) | **Component-level** (which tool broke) |
| Nature | **Objective** (wrong order number extracted → write Python and compare directly) | **Subjective** (tone, direct flight vs. layover trade-offs → human scoring or an LLM judge) |
| Form | **Quantitative** (update success rate, per-component latency) | **Qualitative** (where the hallucination is, tone mismatch, what users are confused about) |

> "Component-level is usually **easier to debug than end-to-end.** You'll probably use a mix of both."

**The full flow for subjective items**: do error analysis first (pull 20 interactions from a thousand users and read them, and notice "this LLM seems rude") → only then build an LLM judge with a rubric → use it for model selection (GPT-4 / Grok / Llama side by side) → or hold the model fixed and change the prompt (change "act like a travel agent" to "act like a **helpful** travel agent" and see what that one word does).

## Multi-agent

He gives only two reasons, which keeps it tight:

1. **Parallelization** — "**that's the point**: is there anything I want to run independently in parallel?"
2. **Reuse** — a design agent in the company that both marketing and product can use

**One important line**:

> "When you have agents talk to each other, **that's basically the MCP protocol.** You're treating that agent **as a tool.**"

The class exercise (smart home) produces: climate control, lighting, security, energy management, entertainment, notifications, coordinator. Two good student ideas: **a security agent that recognizes who you are and grants different permissions** (parent vs. child, the child can't open the fridge), and **seeing what's in the fridge** (wire in the fridge camera) + knowing preferences + calling an e-commerce API to reorder ahead of time. Architecturally it's mostly **hierarchical** (talk only to the coordinator, which gives better UI/UX).

## Closing: his view on what's next for AI

**1. Are we about to hit a wall?**

> "Scaling laws tell us that as long as compute and energy keep increasing, LLMs should keep getting better, **but at some point it plateaus.** So what takes us to the next stage? **Probably architecture search.**"
>
> "Today's LLMs are mostly still transformers, but we know **the human brain doesn't work this way.** So it's not surprising at all that those labs are hiring engineers like crazy: **there may be thousands of engineers trying architecture search over the next few years, and one of them suddenly finds the next transformer and cuts compute and energy requirements by 10x.**"

**2. Multimodal spillover**

> "**Being good at images makes the whole model better at text too.** If you understand a picture of a cat, you write better text about cats. Add audio or video and the whole system gets better again — **you know what a cat sounds like, so you write cats better.**"

**3. The methods will all mix** (with babies as the metaphor)

> "How does a baby learn? Survival instincts in the DNA = **meta-learning / pretraining**; parents pointing at things and saying good, bad = **supervised learning**; falling over and getting hurt = **a reinforcement learning reward signal**; watching what others are doing = **unsupervised learning.**"

**4. Why this course only gives breadth** — this passage explains the whole series' positioning:

> "We give you breadth in CS230 because **these methods change too fast.** I don't want to teach you the 17th RAG optimization, because **you won't be using it in two years.**
>
> I'd rather you think about the **breadth** of what you want to understand, so that when you actually need something you can sprint and learn exactly that thing faster. **Because the half-life of skills is too short.**"

---

## Beyond the classroom: what's left after the lecture

This lecture takes the vertical axis from prompt all the way to multi-agent, and **almost everything in the site's 21 posts is about the step after the lecture ends**: the lecture says chaining makes you able to debug, and the site's [harness series](/en/series/ai-agent-systems) is about how to build that debugging layer; the lecture says memory should be tiered, and the site covers [memory ownership and context rot](/posts/ai/2026-08-10-agent-context-memory-failure-en); the lecture says watch out for prompt injection, and the site covers [why you can only damage-control at the harness layer](/posts/ai/2026-08-10-agent-security-harness-layer-en).

What's genuinely worth taking from this lecture, and isn't on the site, is three judgments:

**One: the jagged frontier.** This is an experimental result, not an opinion — **AI makes results worse on some tasks**, and people don't notice, because they're asleep at the wheel. Any claim that "AI improves productivity by X%" that doesn't separate inside from outside the frontier is averaging over a bimodal distribution.

**Two: "by the time you finish fine-tuning, the next model has beaten you."** This is an argument about **time**, not about quality. Whether it holds depends on the relationship between model iteration speed and your data moat — and the next post's guest speaker reaches the opposite conclusion from a different market.

**Three: "the half-life of skills is too short, so we only teach breadth."** If that's true, it's simultaneously the criterion for judging this whole series: **if these nine posts only teach you how things were done in autumn 2025, they're useless in two years.** What's worth keeping is what doesn't change with versions — why to chain (debuggability), why to tier memory (access cost), why to look at intermediate outputs (otherwise you can't trace back).

## References

- [Lecture 8: Agents, Prompts, and RAG](https://www.youtube.com/watch?v=k1njvbBmfsw) — 2025/11/11, Kian Katanforoosh. Source for all classroom content. The syllabus title is "Beyond the model: Enhancing LLM applications"
- [CS230 Lecture 8 slides](https://cs230.stanford.edu/syllabus/fall_2025/7/lecture_7.pdf) — the directory number is one less than the lecture number, a trace of lectures shifting after the cancellation without the directory being renumbered
- [Complete guide to RAG system patterns](/posts/ai/2026-03-14-rag-patterns-complete-guide-en) — on-site post, ten generations of RAG evolution
- [Conceptual boundaries: agent, workflow, RAG, MCP](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries-en) — on-site post
- [The model is just a component, the harness is the system](/posts/ai/2026-08-10-model-component-harness-system-en) — on-site post, the engineering version of fuzzy engineering
- [Navigating the Jagged Technological Frontier](https://www.hbs.edu/faculty/Pages/item.aspx?num=64700) — Dell'Acqua et al., HBS Working Paper 24-013 (September 2023, later in Organization Science). **The original jagged frontier study**: 758 BCG consultants, 18 tasks; inside the frontier they completed 12.2% more tasks, 25.1% faster, with quality rated 40% higher, while **outside the frontier AI users were 19% less likely to reach the correct solution**
- [Promptfoo](https://promptfoo.dev/) — the LLM eval tool he names his team as using
- [Embracing generative AI in credit risk](https://www.mckinsey.com/capabilities/risk-and-resilience/our-insights/embracing-generative-ai-in-credit-risk) — McKinsey. The source for the credit-risk memo case. **Note: mckinsey.com blocks my extraction tools, so I could not check the original figures** — the discrepancies in the ⚠️ note above come from comparing secondary reporting
- **Source of the Slack fine-tuning joke**: John Allard's talk "Maximizing LLM Performance" at OpenAI DevDay 2023, whose slide shows the result of **fine-tuning GPT-3.5 on 140,000 internal Slack messages**. An independent experiment from the same period (Ross Lazerowitz, also 140k messages) produced similar results

**Still unlinked**: the discussion about long context replacing RAG — the lecture only says "there's this argument" without naming a source, and I couldn't pin it to a single one.
