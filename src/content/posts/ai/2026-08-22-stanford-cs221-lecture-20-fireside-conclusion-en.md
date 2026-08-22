---
title: "CS221 Lecture 20: Fireside Chat, Conclusion: Turning Twenty Lectures into Modeling Choices"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: en
series:
  name: "Reading Stanford CS221"
  order: 21
tldr: "Lecture 20 is Percy Liang's fireside chat on career and research, CS221 and Stanford, and AI's future, with every attribution tied to the official video and editorial synthesis kept separate from auto-caption uncertainty."
description: "A lecture-by-lecture reading of Stanford CS221 Autumn 2025 Lecture 20: official agenda, core development, implementation connection, and material gaps."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs221-lecture-20-fireside-conclusion)

This article covers **Stanford CS221, Autumn 2025, Lecture 20**, dated 2025-12-03. It is not a lecture that derives a new algorithm from slides. It is a fireside chat led by the course moderator, Ken, with Percy Liang answering student questions, followed by Percy’s closing thanks to the class. The [official course site](https://stanford-cs221.github.io/autumn2025/) and this series’ official schedule establish the offering and lecture order; the primary artifact is the [official Stanford Online video](https://www.youtube.com/watch?v=5u5I5jvWR5k). [video](https://youtu.be/5u5I5jvWR5k?t=43)

## Materials and Reading Method

The lecture repository contains no slide artifact or executable lecture for this session. The account below uses only the official Stanford Online auto-transcript and the course schedule’s identification of the lecture. It does not turn unclear captioned proper nouns into facts, and it does not attribute the moderator’s questions to Percy. The captions repeatedly misrecognize terms such as `Turing test`, `ChatGPT`, course numbers, names, and years, so the article separates recoverable meaning from unresolved wording. [video](https://youtu.be/5u5I5jvWR5k?t=5)

That limitation changes how the article should be written. The speakers give conversational answers rather than a complete set of lecture notes. Some exchanges contain only a question and a few minutes of spontaneous response, with no chart, data, or citation to cross-check. “Percy’s answer” therefore identifies a claim that can be assigned to his spoken response; “editorial synthesis” identifies the way this article connects that response back to CS221. Where an interpretation depends on the captions, the uncertainty stays visible. [video](https://youtu.be/5u5I5jvWR5k?t=5)

## How the Fireside Chat Works

The opening explains the format. The organizers received many questions but could not promise to ask all of them. A live Q&A would also remain available, with students raising their hands. The moderator announces three sections rather than a chapter-by-chapter review: career, life, and research advice; class, Stanford, and miscellaneous questions; and AI and its outlook. He describes the event as a guided interview and says they can leave the script when needed. [video](https://youtu.be/5u5I5jvWR5k?t=43)

The actual order is deliberately conversational. The discussion begins with Percy’s education and research, moves early into the AI outlook, returns to CS221 and Stanford, and only later comes back to career and life advice. That is not a contradiction in the format; it is how the interview develops. The structure below follows the three announced themes while preserving the questions that move each theme forward. [video](https://youtu.be/5u5I5jvWR5k?t=67)

### Section One: Career, Life, and Research Advice

#### From an MIT AI Class to Language Models

The moderator first asks whether Percy’s first undergraduate AI class resembled CS221. Percy says he studied as an undergraduate at MIT and did take its undergraduate AI class, but it did not immediately make him decide to become an AI researcher. At the time he was more interested in theory and algorithms, and he could see scaling limitations in some classical AI techniques. He remembers an NLP class in which students wrote grammars by hand; that experience did not feel satisfying to him. [video](https://youtu.be/5u5I5jvWR5k?t=95)

The turn came later in college, when he studied algorithms and then moved into machine learning and statistical language processing. Percy describes that path as a way to combine interesting mathematics with a more scalable algorithmic approach, not as a simple story in which one introductory class revealed his lifelong calling. [video](https://youtu.be/5u5I5jvWR5k?t=151)

He then recalls a first project around 2005. The auto-transcript renders the model name as something like “hit a Markoff model”; the context supports “an early Markov-style language model,” but not a more precise model variant. Percy says that the project trained a language model on roughly one hundred million words using maximum likelihood. It was not a transformer, yet the continuity was visible: large text data, learned distributions, and structure emerging from the training process. [video](https://youtu.be/5u5I5jvWR5k?t=196)

He noticed the model automatically grouping city names, days of the week, and similar words. That moment made the work feel like what he calls emergent capabilities and helped persuade him to pursue AI. This is his retrospective description, not a demonstrated general theory of emergence. He is equally cautious about the future: twenty years earlier, people could see that generative models trained on large data might matter, but he did not have the imagination to predict a path all the way to systems like GPT-3 and GPT-5. No one knew whether the major transition would arrive in 2020, 2030, or 2050. [video](https://youtu.be/5u5I5jvWR5k?t=237)

#### Choose Growth Before Treating a Job as Permanent

In the career section, the moderator asks what Percy would do if he were graduating from Stanford today. Percy first jokes that he would graduate and apply for jobs, then names a large research lab, a startup, or graduate school as plausible paths. He is not prescribing one of these options; he is reframing the question as a comparison among several legitimate routes. He says he once had little interest in startups, but has recently become more engaged with the startup ecosystem and sees the appeal of a small group working closely on a mission-driven problem. As a researcher, he would still want to work on interesting research problems. [video](https://youtu.be/5u5I5jvWR5k?t=2304)

His actual rule of thumb is to prioritize growth. A first job is probably not a last job, so it should not be treated like a marriage. Graduation begins another period of education, only with a different form of learning. Percy uses reinforcement-learning language to describe this as exploration rather than exploitation. The practical version is to work with good people whom you enjoy working with and from whom you can learn. The setting may be academia, a startup, or a larger company; if the learning is right, the setting is secondary. If someone has a clear mission, such as solving an energy problem, the choice becomes easier. When many paths look exciting, “where will I learn the most?” is a useful priority. [video](https://youtu.be/5u5I5jvWR5k?t=2474)

Students ask whether they are falling behind if they lack a prestigious internship by sophomore or junior year. Percy does not claim that every opportunity is interchangeable. He puts the academic timetable in perspective: many leading researchers, lab leaders, and CEOs took circuitous routes, sometimes entering AI from an unrelated field. One internship in one year is therefore unlikely to determine a whole career. Names on a résumé can provide a signal, but accumulating impressive names without the corresponding skills, learning, and perspective will eventually show. [video](https://youtu.be/5u5I5jvWR5k?t=2615)

#### Learn Deeply and Learn Quickly

The follow-up is sharper: if models can do in six months what they could not do before, will a student’s skills quickly become obsolete? Percy says that the durable skill in a fast-changing world is the ability to learn and adapt. It is not enough to learn deeply; one must also learn quickly. This is more specific than a generic instruction to “stay competitive.” It shifts the educational target from memorizing an API to understanding principles, decomposing problems, and rebuilding a workflow when a new tool appears. [video](https://youtu.be/5u5I5jvWR5k?t=2732)

He also discusses how such ability might be evaluated. Technical screens and work trials can reveal technical competence and how people work together, but a shiny CV is not sufficient. Percy mentions grit and passion: someone who genuinely cares about a problem and persists through difficulty may differ substantially from someone merely completing a job. He also stresses collaboration. School often evaluates individuals, with group projects as a partial exception, while real work is nearly always collaborative. Working well with others is therefore not decorative soft skill; it needs deliberate practice. [video](https://youtu.be/5u5I5jvWR5k?t=2772)

When asked about common career advice he rejects, Percy does not offer a counter-slogan. He gives “you must apply for this internship or you will fall behind” as an example of advice he would resist. The scope matters: he does not say internships are useless, and he does not replace them with a fixed ranking system. [video](https://youtu.be/5u5I5jvWR5k?t=2874)

#### Research as a Bet with a Big Hole and a First Step

Percy’s account of choosing research topics fits naturally with the course’s concern for modeling choices. He begins by admitting that research is a bet on the future and that he does not automatically know which topics will work. A strong research direction often has two properties: it identifies a meaningful hole in the world and provides a concrete first step that can be taken now. A grand vision without a testable technical entry point is not yet a research plan. [video](https://youtu.be/5u5I5jvWR5k?t=2095)

He uses decentralized training as an example. Current language-model training generally concentrates compute in one place. If people could contribute their own compute through a peer-to-peer network to train a foundation model, the power dynamics of model training and the surrounding AI policy could change. Percy does not present this as a solved architecture. He says one could begin with a systems problem. That is the pattern: a large question paired with a tractable first step. [video](https://youtu.be/5u5I5jvWR5k?t=2129)

His other point is research taste. He tries to choose questions whose answers he genuinely does not know, near the boundary between “could work” and “could fail.” Research is about information gain, not merely a quick 5% improvement. Unless a small gain carries a generalizable lesson, it may not matter ten years later. The editorial synthesis here is that research has an information objective: after the experiment, what do we know that we did not know before? That connects to CS221’s attention to objectives, states, and information, but Percy does not state this as a formal definition in the video. [video](https://youtu.be/5u5I5jvWR5k?t=2185)

### Section Two: Class, Stanford, and Miscellaneous Questions

#### Why CS221 Was Redesigned

The moderator brings the conversation back to the CS221 class and asks what the redesign was trying to solve. Percy says the course has undergone several major changes since he designed it from scratch about eleven years earlier, and that this version pursued multiple objectives at once; in hindsight, it was ambitious. One objective was to address AI’s social impacts in an introductory AI class. The original structure was technical and did not naturally incorporate those issues, so the redesign added later lectures and a homework assignment. Percy describes this as work in progress and invites feedback. [video](https://youtu.be/5u5I5jvWR5k?t=1666)

The second objective was to narrow the gap between abstract diagrams in lecture and code in homework. Percy remembers that the executable-lecture format worked well in his language-models-from-scratch course, 336, because students could walk through the code and remove ambiguity about the objects under discussion. Bringing that format into 221 is a pilot. A first attempt necessarily has rough edges; the goal is to iterate toward an experience that is both intuitive and grounded in code. [video](https://youtu.be/5u5I5jvWR5k?t=1735)

The point is not that executable lectures are automatically better than slides. The more precise claim is that a step-by-step executable example exposes what an abstract explanation leaves unspecified when students try to implement it. The public video supplies no outcome data for this redesign, so it cannot support a quantitative claim that the new format succeeded. [video](https://youtu.be/5u5I5jvWR5k?t=1735)

#### Connecting Course Ideas Back to Today’s Language Models

A student asks a practical question: if everyone now uses working chat and coding tools (the captions do not reliably identify individual product names), why spend time on search, MDPs, graphical models, and logic? Percy’s answer is that these are not obsolete topics parallel to LLMs. They are different abstraction layers for understanding how modern systems can produce behavior. [video](https://youtu.be/5u5I5jvWR5k?t=1805)

Search supplies the language of states, actions, and exploring possibilities. Training a language model does not end the problem; at inference time, a system may still need to search over candidate solutions. Hard scientific, data-science, and other open-ended problems require trial and error, which is a form of search. MDPs connect to language models through pre-training and reinforcement learning: the latter can be viewed as learning a policy that produces better outcomes. Percy explicitly develops these two connections in the recording. He does not systematically map every logic or graphical-model concept to a named feature of a current product. [video](https://youtu.be/5u5I5jvWR5k?t=1830)

The editorial synthesis is therefore modest. An introductory course does not need to label every topic as one hidden LLM module. A better connection is to ask what contract each idea provides: search handles options and computation, MDPs handle sequential decisions, probabilistic models handle uncertainty, and logic handles expressible and checkable constraints. A modern system may combine these contracts. Recognizing the contract and its limits is more useful than claiming a single foundation model has replaced the entire conceptual vocabulary. [video](https://youtu.be/5u5I5jvWR5k?t=1805)

#### Fundamentals, Course Choices, and Becoming a CA

Asked what an introductory AI course should prepare students for beyond knowledge, Percy returns to fundamentals. He believes students should understand how systems are built and peel through the layers until they reach the bottom. Online resources can teach someone enough ML engineering to get a job. The longer-term value of a university education is breadth, including abstractions that may not appear in short-term on-the-job learning. CS221 aims to connect those abstractions to code rather than merely teach a PyTorch program to run. [video](https://youtu.be/5u5I5jvWR5k?t=1928)

On 221, 229, and 224N, his short answer is that students can take 229 and 224N after 221, and many take them in different orders because some topics are orthogonal. 336 is a different level of class. It may not require much more prerequisite knowledge, but it demands experience and enough grit to build the full language-modeling stack from scratch. This is a spoken description of course positioning, not a complete official prerequisite list; current enrollment information should govern actual course choices. [video](https://youtu.be/5u5I5jvWR5k?t=2027)

Students also ask how to improve their chance of becoming a CS221 CA. Percy’s answer is brief: do well in the class and be proactive, or become a persistent PhD student like the people in the front. The moderator adds that CAs are signed up rather than applying in the ordinary sense. The exchange is delivered with laughter and does not establish guaranteed selection criteria. What can be retained is the mention of class performance and initiative; the video does not fully specify the process or available slots. [video](https://youtu.be/5u5I5jvWR5k?t=2280)

### Section Three: AI’s Future

#### AI Has Left the Laboratory

Percy describes the largest change of the last three years not simply as a rise in model scores, but as AI moving from a research thing to a global phenomenon. Researchers once ran experiments and wrote papers; now people discuss AI in public, companies build around it, and governments write policy. He illustrates the shift with AI billboards while driving on Highway 101 and compares it with the spread of the internet. [video](https://youtu.be/5u5I5jvWR5k?t=382)

The scope of the conversation therefore expands beyond techniques and principles to data, energy, compute, resources, and jobs. This does not mean research has stopped. Percy emphasizes that his group, Stanford, other universities, and industry still face many open problems. The difference is that an “off-ramp” has appeared from the research highway: some results can now create substantial impact rather than being held entirely for the distant future. [video](https://youtu.be/5u5I5jvWR5k?t=444)

Asked about undervalued application areas over the next three to ten years, Percy does not propose another list of assistant products. He points to the generality of foundation-model ideas across data types: DNA sequences, climate data, time series, satellite imagery, physical materials, and neuroscience. These are directions to explore, not a forecast of which industry will win. The recording provides no market-size estimates, case-study list, or schedule. [video](https://youtu.be/5u5I5jvWR5k?t=1333)

#### Underestimated and Overestimated Capabilities

For language models, Percy says an underestimated capability is the mathematical foundation of a probabilistic distribution over the next token. The product interface turns the model into an input-output system, and post-training produces visible behaviors such as solving math problems, coding, or analyzing documents. Yet pre-training, perplexity, and next-token loss over long context remain important to how the capability is formed. He gives the ability to understand context and lower loss over a very long sequence as a potentially revealing measurement, even though it may not appear on public leaderboards. The captions render his example as roughly one million tokens; that should remain his example, not a universal threshold or a proven definition of intelligence. [video](https://youtu.be/5u5I5jvWR5k?t=654)

The overestimated capability is thinking models and reasoning traces. Percy observes that some traces are long, rambling, and inefficient. A system may eventually reach the right answer and score well, but we still may not know whether the trace is doing useful guidance or merely spending more token budget. Sometimes the trace can be wrong while the final answer is right. This is a criticism of what current traces establish about reasoning and interpretability, not a claim that every form of reasoning is useless. [video](https://youtu.be/5u5I5jvWR5k?t=776)

On whether AI is solved, Percy argues that academia has not become irrelevant. Some methods have become effective with scale, data, and compute and have in a sense “graduated” into industry. Academic research can still pursue long-term blue-sky questions, as well as work for which industry has weak incentives: measuring copyright memorization, designing fair evaluations, and exposing model failures. These examples also reveal conflicts of interest. Companies need to demonstrate capability, while academics may be better positioned to study where a system fails. [video](https://youtu.be/5u5I5jvWR5k?t=852)

#### Bubbles, Transparency, and Ethics

Percy’s answer to whether AI is a bubble is direct: of course there is a bubble, but AI is also real. He uses the internet revolution as an analogy. Overpromising and a crash did not stop the internet from transforming daily life; similarly, AI can contain both durable value and bubbly projects that will later be cut. The bubble affects more than student choices: it shapes corporate investment and government decisions. [video](https://youtu.be/5u5I5jvWR5k?t=2922)

On a human-imitation test (the captions render its name as “touring,” so this article does not normalize it to a formal proper name), Percy first questions the definition and whether imitation of humans remains the right scale. If the goal is to make AI more reliable than humans at certain tasks, humans are a shortsighted universal upper bound. He suggests an online, outcome-oriented direction such as whether AI produces new scientific discoveries. If an AI cures cancer, invents a new material, or solves fusion, it is difficult to dismiss the achievement as merely gaming a static test. This is his proposal, not a formal benchmark adopted by the course. [video](https://youtu.be/5u5I5jvWR5k?t=1483)

He gives three reasons frontier companies disclose less. First, competitive advantage: revealing training methods can help competitors. Second, lawsuits: exposing data and sources can create legal risk. Third, disclosure takes engineering work, reporting, and approval, while companies prioritize racing to build the best AI. Percy describes a transparency index as a way to call out the gap and create pressure for movement. Some data-related gaps may require regulation because companies have little incentive to resolve them voluntarily. [video](https://youtu.be/5u5I5jvWR5k?t=3107)

His answer about end-user ethics also starts with transparency. Users generally want to finish their work and may not know how a model was made. They may not even know the possible concerns: the human labor behind systems, wages and working conditions, compute consumption, and environmental strain. Like nutrition labels for food, visible information gives advocacy and choice a starting point. This does not place the entire burden on consumers; it recognizes that people cannot care about an issue they cannot see. [video](https://youtu.be/5u5I5jvWR5k?t=3239)

The final questions keep “life” from collapsing into career advice. Percy says he studied computer science as an undergraduate, along with a large amount of overlapping mathematics, then earned a computer-science PhD. He was fascinated by physics for a period but felt comfortable building things in software. Piano remained a parallel interest. Later, he worked with two postdocs on music foundation models, allowing music and AI—two important parts of his life—to meet. Asked how students can get involved in research at Stanford, he points to the open research ecosystem: look at faculty and student websites, find a paper you genuinely like, read it, and contact its authors with a concrete idea. A class final project can also grow into a larger project. The captions render one official channel as a “curious program,” but the name is not reliable enough to expand here. [video](https://youtu.be/5u5I5jvWR5k?t=3038)、[video](https://youtu.be/5u5I5jvWR5k?t=3344)、[video](https://youtu.be/5u5I5jvWR5k?t=3410)

## Conclusion: Modeling Choices After the Course

The fireside chat does not provide a final definition of AI or declare one winning model family. It moves the course’s choice problem into learning, research, careers, and public life: what information is available, how much computation and time can be spent, and what should be optimized—score, reliability, learning speed, scientific discovery, or social impact? [video](https://youtu.be/5u5I5jvWR5k?t=1259)

Several linked observations emerge from Percy’s answers, though they should not be presented as a four-point conclusion he read aloud. First, the hard problem is shifting from doing to deciding what should be done: if a tool can build any app in five minutes, the difficult question is which app is worth building. Second, fundamentals remain useful because search, policy, probability, and logic are different tools for examining a new system rather than historical names invalidated by a product update. Third, in an uncertain future, growth, learning and adaptation, collaboration, and the ability to ask good questions are more durable than collecting impressive labels early. Fourth, AI evaluation cannot stop at static leaderboards or plausible-looking reasoning traces; it must ask whether systems are reliable, transparent, inspectable, and capable of producing real-world results. [video](https://youtu.be/5u5I5jvWR5k?t=1117)、[video](https://youtu.be/5u5I5jvWR5k?t=1259)、[video](https://youtu.be/5u5I5jvWR5k?t=1805)、[video](https://youtu.be/5u5I5jvWR5k?t=2732)、[video](https://youtu.be/5u5I5jvWR5k?t=654)、[video](https://youtu.be/5u5I5jvWR5k?t=852)

This is an editorial synthesis of the recording, not a closing list Percy reads out. The actual ending is plain: Percy thanks Ken, the teaching team, and the students who stayed with the course, and wishes them well for the rest of the quarter. Because this lecture has no public slide artifact, the honest reading is not to invent a hidden agenda. It is to keep the questions, answers, laughter, caption gaps, and unresolved problems together. Lecture 20’s conclusion demonstrates the habit CS221 tries to leave behind: separate source material from inference before deciding what to model next. [video](https://youtu.be/5u5I5jvWR5k?t=3487)、[video](https://youtu.be/5u5I5jvWR5k?t=3503)

## References

- [CS221 Autumn 2025 course site](https://stanford-cs221.github.io/autumn2025/)
- [Official lecture artifact: official Stanford Online video](https://www.youtube.com/watch?v=5u5I5jvWR5k)
- [CS221 Autumn 2025 executable lecture repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Official Stanford Online CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
