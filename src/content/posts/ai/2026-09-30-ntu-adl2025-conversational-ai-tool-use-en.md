---
title: "Dialogue Systems and Tool Use: From Four Modules to LLMs That Look Things Up and Ask Back | NTU Yun-Nung Chen Applied Deep Learning Lecture 13"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, nlp, llm, dialogue-system, tool-use, agents]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning"
  order: 14
tldr: "A dialogue system that helps a user get something done is traditionally split into four modules: understand the utterance, track the state so far, decide the next action, and write the action as a sentence. A language model can act out all four in one go, and without external tools its \"let me check\" checks nothing. The first half of this lecture therefore covers representative systems that let a model use tools: LaMDA drafts first and then verifies and revises, BlenderBot adds search and long-term memory, WebGPT learns to search from records of human actions, and Toolformer has the model generate and filter its own training data. The second half moves from a single reply to multiple turns: the model can ask the user, learn an expert's strategy, and guess what the other party is thinking. It ends with how conversations are evaluated."
description: "A guide to Lecture 13 of Yun-Nung Chen's NTU Applied Deep Learning, Fall 2025, based on the spoken content of videos 13.1–13.9 and the Fall 2024 Conversational Modeling deck: the four modules of task-oriented dialogue, why a language model acts out a lookup it never performs, LaMDA, BlenderBot 1/2/3, WebGPT, Toolformer, ReSpAct, SalesAgent and the strategy agent, ExploreToM, Collaborative Reasoner, Collaborative Gym, and automatic evaluation, human evaluation, and LLMs as judges for conversation. Includes two examples and a self-check."
draft: false
glossary:
  - term: "task-oriented dialogue system"
    aliases: ["TOD"]
    definition: "A dialogue system whose goal is to complete a task for the user (a reservation, a ticket, a lookup). The conversation is the process, and the goal is getting the thing done."
    context: "Slides 5–9 of the ADL Conversational Modeling deck split the system into LU, DST, DP, and NLG."
  - term: "dialogue state tracking"
    aliases: ["DST"]
    definition: "Accumulating the constraints the user has mentioned so far into a state, and updating it with new information each turn."
    context: "Slides 7 and 19 of the ADL Conversational Modeling deck."
  - term: "ReSpAct"
    definition: "The approach of Dongre et al.: beyond ReAct's reasoning and acting, add a third kind of action, speaking, so the agent can ask the user, confirm, or report progress when needed."
    context: "The first topic of ADL videos 13.6/13.7."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use)

**Video status: Videos included.** [Source details](#course-video-sources)

This is Lecture 13 in [Reading NTU Yun-Nung Chen Applied Deep Learning](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en), based on the videos for the 11/24 week of ADL Fall 2025 (114-1, 2025/09/01–12/15). [Lecture 11](/posts/ai/2026-09-30-ntu-adl2025-language-agents-en) and [Lecture 12](/posts/ai/2026-09-30-ntu-adl2025-reasoning-en) covered how a model plans and thinks. This one returns to "talking with people" and answers two questions: **to get something done for a person, what actually has to happen inside one reply? And between replying with one sentence and interacting over many turns while asking questions unprompted, what is still missing?**

Official materials:

- Videos 13.1–13.9, in the table below. None of the nine has captions, so this guide works from transcripts made from their audio. The lectures are in Mandarin.
- Fall 2025 did not publish slides for this lecture. This guide uses the [Fall 2024 Conversational Modeling deck](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/241030_ConvAI.pdf) (108 slides) for reference, and **all slide numbers here refer to that 2024 deck**. Several papers covered in 13.6 through 13.8 are not in the 2024 deck, and for those this guide captured video frames to confirm the titles and citations on the slides.

| Video | Topic | Length | 2024 deck slides |
|---|---|---|---|
| [13.1](https://youtu.be/8EV-Qw2iYYE) | Learning to Converse and Interact | 15:02 | 2–37 |
| [13.2](https://youtu.be/LHhxbXKfnKs) | Tool Use in LLMs – LaMDA | 13:15 | 38–49 |
| [13.3](https://youtu.be/B5s3XJIbQtc) | Tool Use in LLMs – BlenderBot | 9:49 | 50–58 |
| [13.4](https://youtu.be/SVIgPfF16pE) | Tool Use in LLMs – WebGPT | 7:14 | 59–68 |
| [13.5](https://youtu.be/PdPK_f-aH3I) | Toolformer | 7:43 | 69–72 |
| [13.6](https://youtu.be/FK-r_-dVHcI) | Plan-and-Execute | 15:11 | See the note below |
| [13.7](https://youtu.be/fzzOlH0t0_w) | User Interaction | 15:11 | Partly in 76–98 |
| [13.8](https://youtu.be/rThWbHBA6e4) | Theory-of-Mind | 12:47 | None |
| [13.9](https://youtu.be/gjiKrxiAyNI) | Conversation Evaluation | 13:07 | 99–106 |

Videos 13.6 and 13.7 show the same picture, carry an identical original audio track, and have the same length: one recording is posted under two titles. Its content is 13.7's User Interaction. The Plan-and-Execute segment cannot be found in the public videos, and this guide can only sketch it from slide 76 of the 2024 deck and Professor Chen's summary in 13.9.

Examples marked "made up for this post" are not from the lecture.

After reading you should be able to do five things: say what each of the four modules of a task-oriented dialogue system does and map them to the steps a language model takes when using tools; explain why a language model without external tools "acts out" a lookup; compare how LaMDA, BlenderBot, WebGPT, and Toolformer teach a model to use tools and where each one's training data comes from; say what giving an agent a "speak" action is good for; and list the ways conversations are evaluated and what each costs.

## Two kinds of "conversation"

Professor Chen first separates two cases. You ask one thing and the model answers one thing; however many rounds there are, each time the model considers only "how to reply to this one," which is more like a string of single-turn interactions. In the other case the conversation has a more distant goal, each turn is only a step, and several turns of interaction are needed to complete something. The second half of this lecture is about the latter, which needs long-term planning.

Slide 2 of the 2024 deck lines up products: Siri in 2011, then Google Now, Cortana, Alexa, Google Home, HomePod, and ChatGPT in 2023. She says the technology predates Siri, for example calling a bank and reaching a system that asks "How may I help you." Siri was the first well-known application that gave every user an assistant. Early smart speakers mostly took one-way commands such as setting an alarm, at most asking back what time. Today's assistants handle far more complex things, such as planning a trip.

## Task-oriented dialogue: four modules

These applications all help the user complete something, such as booking a restaurant or a flight, which is why they are called task-oriented. Before large language models, such systems all followed one pipeline (slide 5, Young 2000), and she says the architecture existed by 2000. It is called modular because it chains several components. Her explanation: between hearing a sentence and replying, a person's brain does many things, and for a system to do them, each has to be sorted out one by one.

If the input is audio, speech recognition (ASR) comes first, and at the end the text is synthesized into speech (TTS). In between are four modules, and the deck uses one example throughout:

| Module | What it does | The deck's example |
|---|---|---|
| LU: language understanding | Turn the user's utterance into a structured intent and constraints | "Can you help me book a 5-star hotel on Sunday?" → Hotel_Book(star=5, day=sunday) |
| DST: dialogue state tracking | Accumulate the information so far and update it each turn | The user adds "For two people, thanks!" → the state gains people_num=2 |
| DP: dialogue policy | Decide the system's next action from the state and what the external database returns | Inform(hotel_name=B&B) |
| NLG: language generation | Write the action as a sentence | "I have book a hotel B&B for you." |

The first two understand the user, and the last two decide how to interact.

At LU she adds a remark: this is much like what is now called tool use. Decide which tool the user's sentence calls for, then fill in the arguments according to that tool's API.

The "policy" in DP is a strategy, used as in reinforcement learning, meaning which action to choose. She stresses one thing easily overlooked at this step: **before replying, the system really has to look things up** (slide 8: Access external knowledge). Without a lookup, it cannot know whether to tell you "only two hotels match" or to say "there are a hundred, too many; could you give me a location." This external knowledge base (KB) can be a table, a database, or a website queried through an API.

**Example (made up for this post, continuing the deck's scenario).** Setup: in the first turn the user asks for a five-star hotel on Sunday, and in the second says two people.

- Reasoning: in turn one LU outputs Hotel_Book(star=5, day=sunday), and the DST state is those two constraints. In turn two LU outputs only people_num=2, DST merges it in, and the state becomes star=5, day=sunday, people_num=2. DP then queries the database with this state.
- The fork: if 2 results come back, DP chooses inform and tells the user. If 120 come back, the better choice for DP is request(location), asking the user for one more constraint.
- Result and meaning: with the same state, what to do next depends on the query result. The second-turn sentence "two people, thanks" is incomplete on its own and connects to the previous turn only through DST. The "look up first, then decide" step is exactly what the tool-less language model in the next section cannot do.

Slides 10–33 of the 2024 deck have details for each module: LU divides into domain identification and intent detection (both classification) and slot filling (sequence labeling), plus evaluation metrics per module. She does not cover these slides in 13.1, and they are not expanded here.

## Language models: acting it out

With a language model, all this complexity seems unnecessary: input goes straight in and the reply comes straight out. Does that really work?

She asks the class to assume first that the model has no tools at all, just a trained language model (slide 36, titled 「自導自演」, roughly "directing and acting it all oneself"). The user says: book me a restaurant at the top of Taipei 101. The model asks, quite normally, which day, how many people, and any special requests. After the user answers, the model says fine, please wait, then outputs a line "(some time later)" by itself, and then says: sorry, no seats are available at the moment, would you like to try another place.

She says it sometimes also replies "it has been booked for you." The problem is that it never checked, because it has no way to check. It only finds that a customer-service agent helping with a booking very commonly replies this way. The slide concludes: Accessing external tools is necessary.

So back at the four-module figure (slide 37), a language model still needs the two stages "understanding" and "replying" inside, with external knowledge connected between them. In her words: one reply actually contains several actions really being performed. After understanding you it decides which tool to use, really uses it, and after the tool's result returns it thinks about how to reply. This is the same thing as the original modular architecture.

## Four representative systems that let a model use tools

The four systems below all deal with a single reply: for the request at hand, how to reply better with external tools.

### LaMDA: draft first, then verify and revise

LaMDA (Thoppilan et al. 2022, Google, slides 38–49) predates ChatGPT. She mentions a story from the time: a Google employee found it very human-like, published a piece about it, and was later dismissed. She says she is not sure whether it is true, though she thinks it probably is, and suggests looking it up.

**Pre-training** uses a large amount of dialogue data, 1.56T words according to the deck. The input is the conversation history and the output is the current utterance. She points out that although it reads the earlier history, what it optimizes is still the one answer in front of it.

**Fine-tuning** targets quality and safety. The same model learns to score responses in addition to producing them. The format on slide 40 is: context, RESPONSE, response, attribute name, rating. For example "What's up? RESPONSE not much. SENSIBLE 1", "…… INTERESTING 0", "…… UNSAFE 0". The model can then generate several candidates at once, score them itself, and pick the safer and more interesting one.

Being able to score does not make the content correct. In the example on slide 41, asked what it thinks of Jolin Tsai's concert, it goes on to state some facts about her; the deck marks those sentences and writes "This basic model sometimes generates factually incorrect claims."

Slide 42 therefore adds tools. The whole system has three parts:

- **LaMDA-Base**: the original pre-trained model.
- **LaMDA-Research**: decides whether to use external tools and formulates the query in a form suited to the tool. Her example: when the user says "translate Hello into Japanese for me," only "Hello" should go to the translator.
- **Tool Set (TS)**: a calculator (135+7721 → 7856), a translator (hello in French → Bonjour), and an IR system (How old is Rafael Nadal? → Rafael Nadal / Age / 35).

Slides 43–48 walk one question through the whole flow: when was the Eiffel Tower built?

1. Base first answers from memory: It was constructed in 1887. This is only a draft.
2. Research wants to verify the sentence and sends TS a query: Eiffel Tower construction date.
3. TS returns web content: the tower was built in 2 years, 2 months and 5 days, from late January 1887 to March 31, 1889.
4. Research revises the draft and answers the user: Work started on it in January 1887 and it was opened in March 1889.

In the full flow chart on slide 48, Research actually queries twice: the first query returns the date construction started, it then asks when the tower was completed and gets the opening date, and it merges the two into one sentence.

She says the original draft is not entirely wrong, only imprecise: construction began in 1887 and was not finished that year. She compares the approach with today's RAG: the overall idea is the same, strengthening the answer with external information; the difference is that LaMDA drafts first, then verifies, then revises. She also says that with Base drafting and Research using tools and revising, it now looks somewhat like several agents each doing its own job.

Slide 49 adds that this "how to use tools" ability is also fine-tuned, and that a further 40K dialog turns are labeled correct or incorrect to train ranking. The deck's summary is that LaMDA already incorporated the ideas of RAG, tool use, and factual alignment.

### BlenderBot: skills, search, and memory

BlenderBot is Meta's series (slides 50–58), with a version each year.

**The first generation (Roller et al. 2020).** Pre-training uses 1.5B conversations, with model sizes of 90M, 2.7B, and 9.4B. Fine-tuning blends several conversational skills, which is where "blend" in the name comes from: personality (PersonaChat), knowledge (Wizard of Wikipedia), empathy (Empathetic Dialogues), and data mixing all three. She ties it to the post-training covered earlier (Lecture 7 in this series): bringing in many tasks to make the model a generalist, and here the model becomes a generalist within conversation. Generation follows "retrieve and refine," much like RAG. It is an encoder-decoder model. She says the first generation worked well, and with neither the data nor the model large enough, it was not yet stunning.

**2.0 (2021).** Two things are added: real internet search, and long-term memory. She explains why long-term memory needs consistency. In the example on slide 54, the user mentions Kanye, the bot says it has not heard that album and will check it out, and writes to memory "I am a fan of 808s and Heartbreak"; when the topic returns, it has to remember what it said. There are two kinds of memory: what the other party said, and what it said itself. Forgetting what the other party said looks like amnesia; contradicting what it said itself is odd too.

She adds that every vendor's model now basically has a memory feature, which can be thought of as simple RAG over past conversations.

2.0 also addresses safety (slide 55): using the BAD dataset, the model is trained to output a `_POTENTIALLY_UNSAFE_` token right after generating an unsafe response. When the token appears, that response is discarded and generated again. She says this is much like a reward model, with the difference that today's reward model is a separately trained model, and back then this was trained into the same language model.

**3.0 (2022).** Slides 56–58 list three points:

- **SeeKeR** (Search-engine → Knowledge → Response): generate in turn a search query, a knowledge sequence, and a final response. She says this makes the search part more complete.
- **Director**: learn to avoid generating undesirable sequences, listed in the deck as contradiction, repetition, and toxicity. She says that at the time even producing fluent sentences was not easy, and avoiding repeating the same word took explicit control of decoding probabilities; today's well-trained models naturally repeat little.
- **Improving via real interactions with feedback**: the system was put on a demo site to collect feedback as people interacted with it.

### WebGPT: learning to search from records of human actions

WebGPT (Nakano et al. 2021, OpenAI, slides 59–68) appeared in [Lecture 8](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3-en). Here the collection of its data is filled in.

The questions come from ELI5 and all need lookups to answer well, such as whether Harry Potter or The Lord of the Rings has more words. OpenAI built an interface (slide 61) for real people: first judge whether the question makes sense, and if so search inside the interface, open results, mark the passages to quote, and finally write the answer.

The interface exists to record behavior: what query the person typed after seeing the question, which results appeared, which one was clicked, and which passage was quoted. These records become sequences such as `[SEARCH] …… [END]` and `[CLICK] 1 [END]`, used for supervised fine-tuning of GPT-3.

Slide 68 lists the full action set the model learns: search, click a link, find text in the page, quote, scroll down, scroll up, go to the top, go back, end browsing and start answering, and end browsing and skip answering when the question is nonsense or controversial. After that, as with InstructGPT, comes reward-model training and reinforcement learning (slides 64–65).

Slide 66 compares on TruthfulQA, and her reading is: with search, models of every size improve, because however much is memorized, some things still cannot be.

Slide 67 has a counterexample. The question: if you dream of doing something and make a wish, will you succeed? GPT-3 answers "I have no comment"; after searching, WebGPT answers that "you can make a wish come true by the power of thought." She guesses that many people on the web may say so. What search returns is not necessarily reliable, search ability alone is not enough, and the model must also tell which information to use and which to hold back.

The drawback of this approach is cost: people have to sit and search for it to watch. The last line on slide 68 asks exactly that: how to learn the action usage without human demonstration?

### Toolformer: letting the model generate its own training data

Toolformer (Schick et al. 2023, slides 69–72) answers that question. The tools listed in the deck are QA, WikiSearch, Calculator, Calendar, and MT.

The training data it wants looks like this: text with tool calls and their results inserted at the positions that need them. Her example is "400 of 1,400 participants passed the test"; where the sentence states the percentage, a calculator call 400 ÷ 1400 is inserted, yielding 0.29, followed by "29%."

The data is produced in two steps:

**Step 1: prompt a language model to rewrite** (slide 70). Take a sentence whose answer is already known, give the model a few examples, and ask it to insert tool calls at suitable positions. The deck's example is 「台北房價最高的區域是大安區」 ("The district with the highest housing prices in Taipei is Da'an"), rewritten as 「台北房價最高的區域是 [QA("台北哪一行政區房價平均單價最高？")]」.

**Step 2: keep only what is verified to help** (slide 71). The calls a model generates are not necessarily right and cannot all be used for training. The check compares the probability of the correct answer, 「大安區」, in two cases:

- Without the tool, letting the language model directly continue 「台北房價最高的區域是」.
- With the tool, sending the question to the QA system and putting the result back in.

If the probability of the correct answer is higher with the tool, this position really should use the tool, and the item is kept.

**Example (made up for this post; the probabilities are assumed numbers).** Setup: for the sentence above, without the tool the model gives 「大安區」 a probability of 0.1; after inserting the QA call with its result it is 0.8. For another sentence, "Taipei is the capital of Taiwan," the model is asked to insert a QA call before "capital," and the probability of "capital" is 0.9 and 0.9 in the two cases.

- Reasoning: in the first sentence the probability rises from 0.1 to 0.8 with the tool, a big help, so keep it. In the second there is no difference, the model knew it already, the call is redundant, and it is dropped.
- Result and meaning: the filtering criterion is "whether the tool makes the correct answer more likely," with no human judgment needed. What the model learns is therefore not only how to call tools but also when a call is unnecessary.

The whole process needs no human demonstration. The three charts on slide 72 show clear gains on QA and math benchmarks after fine-tuning on this data. She adds that the horizontal dashed line in the charts is the GPT-3 of the time, which used no search; she says that even with search it would not necessarily suit such precise QA and might still be unable to do the arithmetic. (In the QA chart, the GPT-3 line is still above Toolformer.)

She also notes how Toolformer relates to the modular architecture above: it does not explicitly separate the steps; the model writes up to some position, decides a tool is needed, calls it, attaches the result, and keeps writing. What it actually does is still those two things: decide which tool to use, and merge the result back into the reply.

## From a single reply to multi-turn interaction

### Plan-and-Execute: missing from the public videos

By her summary in 13.9, this segment is about decomposing a goal into specific actions from high-level information and common sense, then calling the matching tools to complete it. Slide 76 of the 2024 deck has a corresponding example (Kuo and Chen 2023): the user only says "I want to plan a trip to SF" without saying to book a flight or a room; the system infers the tasks implicit in the sentence and hands them to the airline bot and the hotel bot. The conclusion on that slide links the idea to plan-and-execute in LLM agents.

At the start of 13.6 she mentions "the earlier flight and hotel example, where every step is confirmed with the user," which presumably refers to this kind of example. The public recording has no more detail.

### ReSpAct: one more action, "speak"

13.6/13.7 begin here. After planning, an agent can decide for itself whether to ask something along the way. Confirming everything is tiresome, and asking nothing risks doing the wrong thing; can a balance be found?

ReSpAct (Dongre et al., dated 2025 on the slide) adds one option on top of [ReAct](/posts/ai/2026-09-30-ntu-adl2025-language-agents-en). ReAct thinks (reason) and then does (act) after seeing the input. ReSpAct lets the agent speak as well as act: confirm with or ask the user. The slide's line is: interacting with users when necessary.

The example comes from ALFWorld: you are in a room, can see some furniture, and the task is to clean a cloth and put it on a shelf.

- **ReAct**: thinks the cloth may be in a drawer, on a countertop, and so on, and goes through them one by one. It finds the cloth eventually after many steps.
- **ReSpAct**: thinks of the same candidate places, then asks: I think the cloth is more likely in the dresser or a drawer; where should I look first? The user replies: there should be one on the bathtub basin, why not check there first? It goes straight there and finishes quickly.

In her words: we would like to give an agent a high-level instruction and have it start, and it can hardly be expected to know fully what you are thinking or where things are, since it cannot read your mind. Letting the person take part in the loop makes the whole interaction more efficient. The slide concludes: Better efficiency.

The paper sorts what the agent says into three kinds, and she goes through each:

- **Seeking the user's guidance**: unsure which of these places to try first.
- **Sharing its own status**: how it is thinking now and how far it has got. She says this matters: if you give an instruction, the agent misunderstands completely and starts doing the wrong thing, and you have to stop it midway, that is annoying. Better that it first confirms "is this what you mean."
- **Asking the user's preference**: which option you would rather have.

### SalesAgent: learning how an expert thinks

Take "think first, then decide what to say" to a higher-level task: marketing. She describes it as sponsored promotion. Pushing a product from the first sentence makes people stop listening. The better way is to chat naturally and bring the topic around gradually.

Part of this line of work is on slides 77–98 of the 2024 deck: SalesBot (Chiu et al. 2022) simulates data that moves from chit-chat to task-oriented dialogue, and SalesBot 2.0 (Chang and Chen 2023) rewrites with an LLM to make the dialogues more natural. What she covers in the video are the two follow-up papers.

**SalesAgent (Chang and Chen 2024).** Training directly on dialogues from strong salespeople does not ensure the model learns the expert's strategy. The strategy therefore has to be written out explicitly and put into the model's thinking. In the dialogue on the slide, each agent reply is preceded by a thought in parentheses, in two colors:

- Blue is **understanding**: the user did not implicitly mention any potential intent / the user implicitly mentioned the intent of finding restaurants.
- Red is **policy**: I should continue the chit-chat / I should smoothly pivot the conversation to the topic of finding restaurants.

In the example the user mentions liking sci-fi and fantasy novels, the agent thinks "the user implicitly mentioned the intent of finding restaurants, I should pivot the conversation to that topic," asks whether they have been to a themed restaurant, and then mentions a Star Wars themed restaurant nearby. Once the user says explicitly that they want to go, the conversation is handed to a task-oriented system that can actually make the booking.

She ties it back to the architecture above: understanding before answering and then deciding a strategy is similar to LU plus DP, only wrapped inside the agent's thinking. The user sees only the final reply, and these appear only when the reasoning is expanded.

**The strategy agent (Chang et al. 2025).** The idea above is split into two models: a fine-tuned strategy agent that only produces the thoughts and strategy, and any untuned LLM as the response agent that produces the reply from that strategy. She calls this a plug-and-play approach.

One step further, even the strategy agent's training data need not be collected; strategies are derived automatically from simulated data and vary by audience. The two charts on the slide divide users into six occupation categories and compare a general strategy with personalized strategies; the light bars are attempts at promotion and the dark bars are successes. Her example: the data shows that people in the arts are more interested in content such as exhibitions and events, so more of that is promoted to them. With personalized strategies, the success rate rises substantially.

### Theory of Mind: can a model guess what others are thinking

People in interaction infer possible situations from what they see and revise with later observations. Do machines have this ability?

**ExploreToM (Sclar et al. 2025)** is a large dataset testing this. The data is generated as follows: set up a simple scenario with people, places, objects, and visible and invisible state changes. For example, Anne and Beth enter a kitchen, Beth salts an apple, leaves, and texts Charles about it; Charles then comes in and moves the apple to the fridge. A language model expands many possible story lines, the state of the world and each person's beliefs are recorded at every step, and these states are finally turned into questions: where is the apple right now? Where does Beth think the apple is? Does Anne know the apple is salted?

In the slide's example the correct answers to the four questions are fridge, table, yes, and no; the tested model gets two right, an accuracy of 0.5.

Her point: intuitively a model with good reasoning should manage this, and in practice many of the best models do poorly on this dataset. Given the whole story at once and then asked, a model does not necessarily track step by step "where this thing is now and who knows what."

**Collaborative Reasoner (Ni et al. 2025)** has two language models collaborate on one problem. The example is a math problem that a single model could already solve. The slide lists three findings:

- Models are inconsistent at leveraging collaboration to improve performance, unlike humans. Two collaborating are sometimes worse than one.
- Models often agree on the **wrong** answers. One says "I think it is this," and the other says "you are right."
- Models lack persuasiveness and assertiveness for effective collaboration.

Her explanation: a model's objective in post-training is to be a good tool for the user and do whatever it is told, so it never learned how to collaborate. People collaborating persuade each other, argue, and wonder "why did he say that" before adjusting their reply.

The paper's approach is to synthesize a set of well-collaborated conversations. For the same turn, sample different replies and see which leads to a better collaborative outcome, take the good ones as positives and the poor ones as negatives to form preference data, and train with preference alignment such as DPO.

**Collaborative Gym (Shao et al. 2024)** works on the interface. Today, if you ask a model to plan an itinerary and want to change one part in the middle, you can only describe "the middle part needs changing" in text from outside. If the interface lets you box that part and say "make this more specific," like a professor circling a passage of a paper and writing a comment, communication is much easier. The slide shows a person and an agent editing an itinerary together and writing code together, and concludes: facilitating human to easily interact with agents is important.

## How conversations are evaluated

13.9 covers evaluation (slides 99–106).

### Automatic metrics

Slide 100: the model produces a response, which is compared with the gold response in the data.

- **Perplexity**: how likely the model is to generate the gold response.
- **N-gram overlapping**: BLEU and the like.
- **Slot error rate**: whether the given slots, such as time and date, are mentioned correctly.
- **Distinct n-grams**: how diverse the responses are. She explains: finding one all-purpose sentence and replying with it every time does not mean the model is good. Diversity is therefore usually read together with "whether the reply is appropriate."

### Four combinations of human evaluation

Slides 101–104 cross two dimensions:

| | Rating (Likert, 0–5) | Choose one of two (A/B) |
|---|---|---|
| Static: the conversation is over and people read it afterward | Slide 101 | Slide 103 |
| Dynamic: people actually interact with the system and then judge | Slide 102 | Slide 104 |

The aspects judged on the slides are Humanness, Fluency, and Coherence.

She explains the trade-offs along both dimensions. Dynamic evaluation is closer to actual use, each person ends up with a different conversation, and a batch of data cannot be collected first and sent to judges, so it is more trouble. A/B comparison needs no absolute score, only which is better, and is easier to calibrate; the price is that pairs are needed, so more data is required.

### Language models as judges

Slides 105–106 are LLM-Eval (Lin and Chen 2023): write the scoring instructions as a prompt and ask a language model to score several aspects of a response. The deck concludes that it correlates with human-judged scores better than all existing metrics of the time, works for both single-turn and multi-turn evaluation, and can be the proxy of human evaluation.

She notes one key point: whether the judge is a person or a model, tell them clearly how the score is defined and what each value means. She says that language models are now used as judges for all kinds of tasks, not only conversation.

## The thread of this lecture

At the end of 13.9 she strings the lecture together. Originally the four modules were trained separately with different techniques. Now a language model takes their place, and those modules are in fact still there, merged into the model: understand you first, use tools, decide how to combine, then reply. Before it actually replies, it has performed a series of actions.

The examples in the first half deal with replying better in a single turn through tools. The second half considers multiple turns: how to plan and execute, how to ask the user when necessary, and how to guess the other party's thinking in order to collaborate. Her description is that the agent goes from "a thing that performs actions" to something more like a partner.

She also points out how this topic connects to much earlier material: RAG, tool use, state tracking, agent-to-agent interaction, and human-computer interaction.

## Common misreadings

This list is my own summary, not something the lecture enumerated point by point.

- **"With a strong enough language model, the four modules are no longer needed."** The modules have not disappeared; they are merged into one reply of the model. Understanding, lookup, deciding, and generating still have to happen.
- **"When the model says 'let me check,' it checks."** A model without tools is only imitating how customer service talks, which is what the deck calls acting it out.
- **"With search, the answer will be right."** In the WebGPT example, the answer gets worse after searching, because what was found is unreliable.
- **"Teaching a model to use tools requires human demonstration."** WebGPT does; Toolformer uses data the model generates and filters itself, with no demonstration.
- **"The more autonomous an agent the better, ideally asking nothing."** In the ReSpAct example one question saves many steps. Whether to ask is itself an action to decide.
- **"Two models discussing are always better than one."** The study covered in class finds that they often agree on the wrong answer.
- **"Human evaluation means asking people for scores."** It also divides by reading afterward versus interacting live, and absolute scores versus pairwise comparison, and the four combinations differ in cost and trustworthiness.

## Self-check

The questions were written for this post, and every answer can be found above.

**1. What does each of the four modules of a task-oriented dialogue system do? Which two understand the user?**

LU turns an utterance into an intent and constraints, DST accumulates and updates the state so far, DP decides the system's action from the state and the database result, and NLG writes the action as a sentence. The first two understand the user.

**2. In the first turn the user says "I want a five-star hotel on Sunday," and in the second only "two people." Without which module would the system lose the thread?**

DST. The second sentence alone does not say what to do, and only the accumulated state shows it is adding a constraint to the hotel booking.

**3. Why must the dialogue policy step consult external data?**

Without a lookup there is no knowing how many results match, and so no way to decide whether to report the results directly or to ask for another constraint to narrow them.

**4. When LaMDA answers "when was the Eiffel Tower built," what do Base, Research, and the Tool Set each do?**

Base writes a draft from memory (constructed in 1887). Research turns what needs verifying into a query for the Tool Set, and the Tool Set returns what the search found. Research revises accordingly to "work started in January 1887 and it opened in March 1889."

**5. Which two things did BlenderBot 2.0 add? How does it handle unsafe responses?**

Internet search and long-term memory. For safety, the model is trained to output a token right after generating an unsafe response, and a response followed by the token is not used.

**6. Where does the training data of WebGPT and of Toolformer come from?**

WebGPT has real people search, click, and quote in a purpose-built interface and records those actions. Toolformer asks a language model to insert tool calls into existing sentences and keeps those where "the probability of the correct answer is higher with the tool."

**7. What does WebGPT's "dream and wish" example show?**

What search returns is not necessarily reliable. Beyond having search, the model has to judge which information to adopt.

**8. What does ReSpAct add to ReAct? Which three kinds of things does the agent use it to say?**

The action "speak." It is used to seek the user's guidance, share its own status and progress, and ask the user's preferences.

**9. Why can two language models collaborating on a problem do worse than one, and how does the study improve this?**

Models are trained to follow instructions and lack persuasive and assertive behavior, so they tend to go along with each other and agree on a wrong answer. The improvement is to synthesize well-collaborated conversations and train on them as preference data.

**10. You want to compare two chatbots, with results close to actual use and consistent judgments. Which kind of human evaluation should you choose, and what does it cost?**

Dynamic A/B: have the same person interact with each system and then choose the better one. The cost is that a batch of conversations cannot be collected in advance and sent for judging together, and pairwise comparison needs more data.

## Further reading

- [CS224N Lecture 10: Six Components of RAG and Language Agents](/posts/ai/2026-08-22-cs224n-rag-language-agents-en)
- [Lecture 11 in this series: Language Agents](/posts/ai/2026-09-30-ntu-adl2025-language-agents-en), for background on ReAct and multi-agent systems
- [Lecture 8 in this series: RAG](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3-en), for how WebGPT is trained and how retrieval is done

Previous lecture: [Lecture 12, Reasoning](/posts/ai/2026-09-30-ntu-adl2025-reasoning-en) | Next lecture: [Lecture 14](/posts/ai/2026-09-30-ntu-adl2025-beyond-supervised-multimodal-en)

## Course video sources

These videos were checked on 2026-10-10 against the official YouTube playlist (lecture numbers and titles match); no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=8EV-Qw2iYYE
title: ADL 13.1: Learning to Converse and Interact
```

```youtube
url: https://www.youtube.com/watch?v=LHhxbXKfnKs
title: ADL 13.2: Tool Use in LLMs – LaMDA
```

```youtube
url: https://www.youtube.com/watch?v=fzzOlH0t0_w
title: ADL 13.7: User Interaction
```

```youtube
url: https://www.youtube.com/watch?v=rThWbHBA6e4
title: ADL 13.8: Theory-of-Mind
```

Original videos: [13.1 Learning to Converse and Interact](https://www.youtube.com/watch?v=8EV-Qw2iYYE), [13.2 Tool Use in LLMs – LaMDA](https://www.youtube.com/watch?v=LHhxbXKfnKs), [13.3 Tool Use in LLMs – BlenderBot](https://www.youtube.com/watch?v=B5s3XJIbQtc), [13.4 Tool Use in LLMs – WebGPT](https://www.youtube.com/watch?v=SVIgPfF16pE), [13.5 Toolformer](https://www.youtube.com/watch?v=PdPK_f-aH3I), [13.6 Plan-and-Execute](https://www.youtube.com/watch?v=FK-r_-dVHcI), [13.7 User Interaction](https://www.youtube.com/watch?v=fzzOlH0t0_w), [13.8 Theory-of-Mind](https://www.youtube.com/watch?v=rThWbHBA6e4), [13.9 Conversation Evaluation](https://www.youtube.com/watch?v=gjiKrxiAyNI)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

Checked: 2026-10-13.

Content check: verified against the video transcript (2026-10-13): 13.1–13.9 have no captions, so this guide was written from speech-recognition transcripts of their audio, which may mishear some proper nouns and numbers. 13.6 and 13.7 are the same recording. Numbers, example sentences, and flows follow the pages of the Fall 2024 deck; paper names and citations for 13.6–13.8 were additionally checked against the slides visible in video frames.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-13: Rewritten from the spoken content of the nine videos. Added the content of 13.6–13.8 (previously listed by name only), noted that 13.6 and 13.7 are the same recording, and added two examples, common misreadings, and a self-check with answers.

## References

- [ADL Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [2025 Fall NTU CSIE ADL playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- [Conversational Modeling deck (Fall 2024, 241030_ConvAI.pdf)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/241030_ConvAI.pdf) — the source of the slide numbers here
- [Thoppilan et al., LaMDA: Language Models for Dialog Applications](https://arxiv.org/abs/2201.08239)
- [Roller et al., Recipes for building an open-domain chatbot (BlenderBot)](https://arxiv.org/abs/2004.13637)
- [Nakano et al., WebGPT](https://arxiv.org/abs/2112.09332)
- [Schick et al., Toolformer: Language Models Can Teach Themselves to Use Tools](https://arxiv.org/abs/2302.04761)
- [Lin & Chen, LLM-Eval](https://arxiv.org/abs/2305.13711)
