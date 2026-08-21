---
title: "Career Advice in AI: The 10x Engineer Who Failed 300 Applications"
date: 2026-08-16
category: career
type: guide
tags: [career, ai-engineering, technical-debt, hiring, stanford-cs230]
lang: en
series:
  name: "Reading Stanford CS230"
  order: 8
tldr: "An elite-level engineer applied to over 300 jobs and failed every one, because the interview guides told him to stand his ground and have a backbone, and he read that as being hard-nosed. The interviewers' read: this is the 10x engineer, and I don't want him anywhere near my team. This lecture also gives the best criterion anyone has offered for vibe coding — technical debt."
description: "A full read-through of Stanford CS230 (Autumn 2025) Lecture 9: Andrew Ng on the product management bottleneck and the people around you; guest speaker Laurence Moroney on three cycles in the job market, three pillars of success, technical debt as the criterion for vibe coding, an anatomy of hype, and the big-AI / small-AI fork."
draft: false
---

> 🌏 [中文版](/posts/career/2026-08-16-cs230-career-advice-in-ai)

> [The previous post](/posts/ai/2026-08-16-cs230-agents-prompts-rag-en) ran the whole vertical axis of agents. This one is the only lecture in the series with no technical content at all.

This post covers **[Lecture 9: Career Advice in AI](https://www.youtube.com/watch?v=AuZoDsNmG_s)** (2025/11/18, 1 hour 45 minutes). It's the **second most-watched** lecture in the series (437,000 views) and the only one **with an external guest who speaks for 80% of the time.**

- First 20 minutes: **Andrew Ng**
- The rest: **Laurence Moroney** — ex-Microsoft, ex-Google AI Lead Advocate (the main force behind TensorFlow advocacy), now leading a team at **ARM**, author of 20-odd books

**Time anchor**: **Gemini 3 launched** the morning of this class, and Ng says live, "it came out this morning, I haven't had a chance to play with it yet."

---

# Part one: Andrew Ng

## Has AI progress slowed down?

The context is the community asking whether GPT-5 underwhelmed and AI is slowing. Ng thinks part of that comes from benchmark ceiling effects — **100% is the maximum, you can't exceed it.**

He says the research that most changed his thinking is **METR** switching to a different metric: **the length of task an AI can complete, measured in how long it takes a human.**

> "A few years ago GPT-2 could do things that took a human **a few seconds**, then 4 seconds, 8 seconds, a minute, two minutes … this research estimates **the task length AI can handle doubles every seven months.**" And for AI coding the doubling time is "**shorter, about 70 days.**"

(**Both figures are Ng speaking from memory in class.** Note that METR's paper is formally titled *Measuring AI Ability to Complete Long **Software** Tasks* — it measures **software tasks**, not general ones. That scope difference is worth keeping in mind when citing it.)

## Why now is a golden age

**More capable**: you can write software today that **nobody on Earth could write a year ago**, because of these building blocks: LLMs, RAG, agentic workflows, voice AI, deep learning.

**Faster**: AI coding. And he stresses staying at the **frontier of the tools**:

> "A few months ago, **my personal favorite tool became Claude Code.** After GPT-5 launched, **OpenAI Codex improved enormously.** And **Gemini 3 launched this morning** … if you ask me every three months which coding tool I like best, **the answer will definitely change every six months, and quite possibly every three.**"
>
> "**Being half a generation behind honestly makes you a lot less productive.** I know everyone says AI is moving fast, but **a lot of areas aren't moving as fast as the hype says** — and **AI coding tools are the area where I see genuinely very fast progress.**"

## The product management bottleneck

This is the core argument of Ng's 20 minutes:

> "As 'from a well-written spec to code' gets easier and easier, **the bottleneck increasingly becomes deciding what to build.**"

**The engineer-to-PM ratio is falling**:

> "People talk about eng-to-PM ratios … you'll hear companies say **4:1, 7:1, 8:1.** But because **engineering accelerated and product management didn't get accelerated as much by AI**, I'm seeing that ratio **come down, even to 2:1 or 1:1.** Some teams I work with are proposing **one PM per engineer** — a ratio that's unheard of at nearly every Silicon Valley company."

**His own regret** (this part is honest):

> "In a role very early in my career, I went and convinced a group of engineers to do more product work. The result was **I made a group of good engineers feel bad about not being good product managers.** That was my mistake, and I regretted it for years.
>
> **And part of me now feels like I'm about to make exactly the same mistake again.**"

He says it anyway: engineers who can code and talk to users are **the fastest-moving people** he sees in Silicon Valley — "because you don't have to wait for someone else to take the product to the customer."

## The people around you

> "I think **one of the strongest predictors of how fast you learn and how successful you become is who you surround yourself with.**"

Sociological research: if your five closest friends all smoke, your odds of smoking are high. "I don't know whether there's research showing that if your closest friends are hardworking, fast-learning people you're more likely to become that — **but I'm almost certain it's true.**"

**Stanford's connective tissue**:

> "A lot of people working at frontier AI labs are former students of one professor or another at Stanford. That connection means **we often know things the outside world doesn't.**
>
> There have been many times I was about to go in some technical direction, **got on a call with one or two people close to the research**, and they shared something I didn't know — **and that changed my technical architecture choice for a project.**"

### The student assigned to the Java payments backend

This is the best story in the lecture:

> A Stanford student he knew, doing well in school, gets an offer from an **AI company with a very hot brand.**
>
> **The company refuses to tell him which team he'd join.** "Just sign, there's a rotation program, a matching system, sign here and we'll find you a good project." Part of the pull was that it's a good company and **his parents were proud he'd gotten in.**
>
> After he signed, **he was assigned to the company's Java backend payments processing system.**
>
> "I have absolutely nothing against people who want to do Java backend payments. But this is an **AI student who wasn't matched to an AI project.**"
>
> He was frustrated for about a year, then left.

**And the story has a sequel:**

> "Unfortunately, after I told this story in CS230, **a few years later another CS230 student went through the same thing at the same company** — not Java payments backend, a different project."

His conclusion:

> "If a company **refuses to tell you which team you'll be on**, frankly that raises a question mark for me.
>
> Rather than going to the company with the hottest brand, sometimes you find a really good team where the company logo isn't as hot, and I think that means **you learn faster.** Because in the end, **we don't learn from the excitement of the logo on the way in. We learn from the people we deal with every day.**"

## Go build things, and work hard

- "**There are far more ideas in the world than people capable of building them.**"
- "There are a lot of projects in the world where **if you don't do it, probably nobody else will.**"
- "**The cost of failure is so much lower than it used to be** — you waste a weekend, but you learn something."

Then a passage he flags himself as politically incorrect:

> "In some circles, **encouraging people to work hard has become politically incorrect.** I'm still going to encourage you to work hard."

**He gets the exceptions out of the way first**: "Some people are at a stage of life where they can't work hard — I wasn't able to right after my kids were born. Others because of injury, disability, all sorts of entirely legitimate reasons. **We should respect them, support them, make sure they're well taken care of.**"

**Then**: "That said, the PhD students of mine who went on to be very successful — **I watched every one of them grind extremely hard** … between **watching a mediocre TV show** and **opening up your agentic coder on the weekend to try something**, **I'll pick the latter almost every time** — unless I'm watching with my kids."

---

# Part two: Laurence Moroney

## Opening: the 10x engineer who failed 300 applications

> A young person he mentors: good education, good experience, **super-elite-level coder**, solved every challenge put to him.
>
> Laid off in April (medical software, federal funding cut). And — **shortly before the layoff his girlfriend broke up with him, and a few weeks later his dog died.**
>
> A few months later Moroney sits down with his spreadsheet: **over 300 job openings tracked.** Plenty of them got into the interview process and went deep — Meta, Microsoft, the kind of big company with many rounds.
>
> **Every time he got to the end of the process, he knew he'd done well**: solved every coding problem, chatted well with people (in his own view). And **every time, within a day, the recruiter called to say no.**

It took Moroney a long time to find the problem — until he deliberately gave him a hard interview:

> "I picked holes in his code, threw obscure edge cases at him, manufactured a crisis, and **watched how he reacted.**
>
> And his reaction was exactly what **the interview guides had told him to do**: **'You'll have a chance to express your opinion. Stand your ground, have a backbone, don't back down.'**
>
> His interpretation of that was — **become very, very hard-nosed.**
>
> From the interviewer's side, this is the cliché: **the 10x engineer that I don't want anywhere near my team**, because of that attitude."

The ending: after adjusting, the next company — **one that weights teamwork very heavily** — hired him at **twice the salary** he had before the layoff. In hindsight he was out of work for six months.

> "**It matters that you look at companies and who you'd work with, but be aware they're looking at you the same way.** If you take an interview coaching course and they tell you to stand your ground and have a backbone — that's great, **but don't be a jerk while you do it.**"

## Why the market became what it is

| Period | What happened |
|---|---|
| 1992 | His first time doing AI, **followed immediately by the AI winter** |
| 2015 | Google launches TensorFlow and pulls him back in |
| 2021–22 | **The pandemic causes a big industry slowdown.** Companies are forced toward things that **directly generate revenue.** TensorFlow is open source and doesn't directly generate revenue → cuts |
| 2022–23 | Coming out of the pandemic with **a huge backlog of unmade hires**; simultaneously AI explodes → **every company hiring frantically** |
| — | The result is **mass over-hiring**: unqualified people getting senior titles. "**Two letters, A-I, on a résumé and you were snatched up, thrown money at, brought in first and figured out later**" |
| 2024–25 | **"The Great Sobering"**: companies discover they over-hired a lot of unqualified people, and start correcting |

> "Against that correction, companies are much more careful about hiring AI skills. **If you go in with that understanding, the opportunity is still there, and if you approach it strategically, it's enormous.**"

(A live poll: how many juniors are job hunting — many hands; how many have succeeded — **exactly one.**)

## Three pillars of success

1. **Deep understanding** — in two senses: **academic** (understanding model architectures, being able to read papers, **being able to take something from a paper and use it**) and **trend-wise** (knowing **which trends have a signal-to-noise ratio that favors signal**)
2. **Business focus**
3. **A bias for delivery** — "**ideas are cheap, execution is everything.** I've interviewed a lot of people with very loose ideas that couldn't be landed at all; I've also interviewed people with **half-finished ideas that landed extremely well.** Guess who got the job?"

**His own story**: "I was successful at Microsoft, wrote 20-odd books, taught university courses, **and I interviewed at Google twice and failed twice, because I was interviewing as a product manager. When I switched to interviewing as an engineer they hired me**, and then said 'why didn't you come a few years earlier?'"

(This echoes Ng's regret from earlier — **not every good engineer should become a PM.**)

### "Don't produce for the job you have, produce for the job you want"

On his third Google interview (the cloud team was just starting), he changed approach: he'd just finished a Java book, so he **built a Java application running on Google Cloud that predicted stock prices via technical analysis**, and put the code in his résumé.

> "The result was they didn't ask me stupid questions like 'how many golf balls fit in a bus.' **They saw that code, and my entire interview process was them asking me about my code. That put control back in my hands** — it let me talk about what I know, instead of walking in blind and waiting for random questions."

### Hard work = output, not hours

> "**996 — nine to nine, six days a week — is not a measure of working hard, it's a measure of spending time.** Working hard should be defined by **how you measure it. Personally I measure it by output.**"

**His baseball writing method**: "A baseball game is three and a half to four hours … **I'm not sitting in front of the TV staring at it, I'm writing a book with the game on** — it's a slow-paced sport. Most of my writing gets done during baseball season." (That book took him about **two months.**)

## Four realities

### 1. Business focus is non-negotiable

A passage he flags himself as politically incorrect: over the last decade a lot of big Silicon Valley companies focused on "bring your whole self to work," which generated a lot of internal activism.

> **"Please let me underline this: there's nothing wrong with activism. There's nothing wrong with wanting to support a just cause."** But he thinks **over-weighting** it trapped some companies in "activism must come before business," and **the result was that the good signals inside that activism got drowned out** — "the pendulum swung too far, and it's swinging back now."

### 2. Risk mitigation is part of the job

> "In an interview setting, I think **this is the number one skill to have**: **'What you're doing is a business transformation from heuristic computing to intelligent computing. Here are the risks, and here's how I'd mitigate them.'**"

### 3. The definition of responsibility is evolving

The framing shift: "responsible AI went from a very loose definition, 'make AI work for everybody,' to '**first make sure AI works, make sure it drives the business, and then make sure it works for everybody.**' **Over the last few years that order got inverted a lot, and it led to some famous, well-documented disasters.**"

**A test he ran himself** (he was working on responsible AI at the time) — the same prompt, only the ethnicity descriptor changed:

| Input | Result |
|---|---|
| Asian, Indian, Black, Latino | ✅ All generated normally |
| **Caucasian** | ❌ Refused: **"this could lead to harmful stereotypes and bias"** |
| **white** | ❌ And **it said "I don't currently generate images of people" — having just generated a pile of images of people** |

**His workaround**: type "**Irish woman**" → generates fine. **But every image had red hair.**

> "I grew up in Ireland. Ireland does have the highest proportion of redheads in the world — **about 8%.** But when you're drawing a person and you're binding an ethnicity to a hair color, you start to see **how big a problem this is.**" (He also mentions negative associations with red hair in some cultures, flagging it himself as "I believe" — **an unverified personal claim.**)
>
> "What happened from a responsible AI perspective is: **a very narrow worldview about what counts as responsible took over the entire model, and ended up damaging the model's reputation and the company's reputation.**"

(A student supplies the historical version — prompt says "draw a samurai," the rewriting engine turns it into "give me samurai from diverse backgrounds." Damage from the same prompt-interception mechanism. "That was a naive solution, and they improved a lot afterwards.")

**This part has an official record**: Google published [a statement](https://blog.google/products-and-platforms/products/gemini/gemini-image-generation-issue/) by Prabhakar Raghavan on 2024/2/23, acknowledging that Gemini's people-generation "failed to account for cases that should clearly not show a range" and "became way more cautious than we intended and refused to answer certain prompts entirely — wrongly interpreting some very anodyne prompts as sensitive," and pausing people generation. **The mechanism Moroney describes — rewriting prompts to inject diversity, with blowback — is the same thing Google describes**, just told from the perspective of someone doing responsible AI inside. His own "Caucasian/white gets refused" tests are his personal experimental record and have no line-by-line counterpart in the official document.

### 4. Learn from mistakes

> "Back to Andrew's point about people: **the people around you will make mistakes too. Being able to extend grace when they do, handle the mistake, and move on** is very, very important."

## Technical debt: his framework for vibe coding

**Nobody in the room knows what technical debt is** (he says he used the term at a workshop with Ng in New York the previous Friday, "and I saw a sea of blank faces").

| | Example | Verdict |
|---|---|---|
| **Good debt** | Borrow 500k for a house, pay back about 1M over 30 years with interest | **Worth it** — the house appreciates, you don't pay rent, the value received exceeds 1M |
| **Bad debt** | A $200 impulse shoe purchase on a high-interest credit card, ending up at $500 | **Not worth it** |

**The core proposition**:

> **"Every time you build something, you take on debt.** No matter how well you build it — there will always be bugs, support, new requirements, marketing, feedback. **All of that is debt. The only way to avoid debt is to build nothing.**"
>
> "So when you vibe code something, the question becomes — **is it worth the technical debt you're taking on?**"

**Four checks**:

1. **The goal was clear, and you hit it.** He's running a small film-production venture almost entirely on generated code: **"I built the app, tested it, threw it away; rebuilt, tested, threw it away."** Each round his understanding of the requirements got better.
   > **"In the age of generated code, code is cheap. Finished, engineered code is not cheap."**
2. **Did it deliver business value?** "I've watched people vibe code on Replit for hours to produce a really cool website, and the answer is **'so what?'**"
3. **★ Can a human understand it** (he says this is the most underrated and possibly most important one)
   > "**The worst technical debt you can take on is shipping code nobody can read.** Only you understand it, and then **you quit for a better job**, and the company depends on that code forever."
4. Documentation, clear algorithms, **and taking the time to check whether even the variable names make sense**

**Typical shapes of bad debt**:

- **A hammer looking for nails** — he's watched large organizations vibe code piles of stuff into the codebase, **and then it's hard to find the good stuff among the bad**
- **Spaghetti code**: prompt, prompt, prompt again
- **A trap he's currently in**: he's writing a macOS Swift UI app, but **the overwhelming majority of the training data is iPhone code**, so "my prompts frequently return **iOS APIs** — even though I'm in Xcode, building a macOS app, using a macOS template"
- **Authority over competence**: "the VP suddenly pulls out a credit card, subscribes to Replit, and starts building things. **Guess whose problem that becomes to fix.**"

## Hype

> **"The currency of social media is engagement. Accuracy is not the currency of social media."**

> "If you're the kind of person who **can filter signal out of noise** and **can guide the people around you toward the signal**, that gives you an enormous advantage … **in a one-on-one setting — an interview, say — it makes you extremely valuable.**"

### "Please build me an agent" → "Why?"

Last year a European company asked him to help **implement an agent.**

> **"If a company comes to you and says 'please implement an agent for me,' what's the right first question?"**
>
> A student says "what does agent mean to you?" → "Not bad." Another says "what are you trying to do?" → "More fundamental."
>
> **"My question is: why?"**

He peels it layer by layer: the CEO says "everyone tells me I can cut operating costs …" "Who told you that?" "Oh, I read it on LinkedIn, I saw it on Twitter …"

Peeled all the way down, **what he actually wants is: make the sales team more effective.**

> **"I didn't hear the word AI in that sentence, and I didn't hear the word agent."**

So he goes and asks the salespeople "what's the part of your job you hate most?" — the answer is checking company websites and LinkedIn, **and every site is structured differently**, so they carry the entire cognitive load.

**The key number: they spend about 80% of their time on research and only 20% selling.** And sales base salaries are usually low and topped up with commission — **so they spend only 20% of their time on the thing that directly earns commission.**

The goal becomes "make sales 20% more effective," **and only then does AI enter the conversation.** The result was 10–15% of wasted time recovered, and the **unintended consequence** was that the salespeople were much happier and earned more.

> "But if you let hype lead you and just 'build an agent for this thing,' **without actually peeling back the business need, the why, the company gets lost in the hype.**"

He cites a number along the way: **a McKinsey report showing about 85% of enterprise AI projects fail**, with poorly defined scope among the main causes.

> **⚠️ I can't find a report matching this citation.** I couldn't find any McKinsey figure of "85% of AI projects fail."
> The widely cited failure rate around that time is **MIT NANDA's *The GenAI Divide: State of AI in Business 2025*:
> roughly 95% of enterprise GenAI pilots produced no measurable P&L impact** — that's MIT, not McKinsey, and 95%, not 85%.
> McKinsey's own *The state of AI in 2025* says something different: **enterprise-level EBIT impact "continues to be rare,"
> with only about 6% of respondents in the high-performer group that attributes ≥5% EBIT impact to AI** — "most organizations
> haven't seen bottom-line effects yet" and "85% of projects fail" are two different claims.
> **His causal judgment about poorly defined scope I think still stands** (that's his own first-hand consulting experience,
> and the European company case above is exactly it), but please don't cite that 85% as data.

**His four-step definition of agentic** (concise and usable):

> **Understand intent → plan (declaring the available tools) → execute → reflect (check back against the intent)**
>
> "If you can break any problem into those four steps, you're starting to build an agent."

### "Make it as boring as possible"

> "Someone taught me a technique: **every time you see something like this, try to find a way to make it as boring as possible. When you can make it boring enough, that's when you've actually built the foundation to explain it in detail in the way other people need.**"

**The demonstration**: the boring version of text-to-video isn't "Hollywood is dead," it's — **it's generating a sequence of consecutive frames, each slightly different from the last.**

> "Suddenly it's boring — **and suddenly they get it. And then the people who are genuinely experts in that field are the ones who can build something impressive with it.**"

### The bubble

**The Titanic metaphor**:

> "The two guys in the crow's nest are freezing and chatting, **and all they're talking about is how cold they are.** Then it cuts to the crew: 'wait, aren't they supposed to have binoculars?' 'Oh, **we left the binoculars at the port.**'
>
> They were **arrogant enough to only want to charge ahead and not look at any risk**; and even where looking at risk was someone's job, **they hadn't equipped or trained those people properly. To me that's a good metaphor for where the AI industry is today.**"

**An anatomy of the bubble** (top to bottom): hype → enormous VC investment → unrealistic valuations → me-too products → **the small piece of real value at the bottom.**

"**I'm already seeing VC dry up.** There was a time when writing AI on it got you funded, **and they're much more careful now.**" (Self-deprecating: "these slides were vibe coded, so this is technical debt I've taken on too.")

**But a bubble is not the apocalypse**:

> "Most people don't remember the dot-com bubble of 2000. It was the largest bubble in history, **it burst — and we're still here. And the people who got dot-com right didn't just survive, they thrived.**
>
> Amazon and Google understood what it meant to build a business on .com. By contrast, **pets.com** had the 'if you build it they will come' mentality — they bought a Super Bowl ad **and then couldn't handle the traffic that came in.** When the bubble burst, sites like that just evaporated."

## The big-AI / small-AI fork

This is his central forward-looking argument:

| | **Big AI** | **Small AI** |
|---|---|---|
| Who hosts it | **Someone else hosts it for you** (Gemini, Claude, OpenAI) | **You host it yourself** |
| Direction | Bigger is better, racing toward AGI | Open weights / self-hostable |
| Status | The bubble bursts **earlier** here | **Currently undersupplied**, bubble comes **later** |

His deliberate word choice: "**I hate the term open source.** Let me call them **open weights**, or **self-hostable.**"

He cites a data point: "I recently read an article about Y Combinator — **80% of companies at YC are using small models, especially Chinese models.**"

> **⚠️ Neither the source nor the number checks out.** That 80% doesn't come from a Y Combinator article.
> The original is **The Economist quoting a16z partner Martin Casado** on startups pitching a16z:
> **"I'd say there's an 80% chance they're using a Chinese open-source model"** — that's a16z's deal flow, not YC's portfolio.
> And **Casado publicly corrected the version that had spread**:
> "I'd say **20-30% use open source.** Of those I'd say **80% use Chinese based models.** So **closer to 16-24%.**"
> Two layers of percentages got flattened into one in transmission, inflating the magnitude three- to fivefold.
> The direction still holds (**there really is a cohort of startups running on Chinese open-weight models**), but don't cite the number.
> The criterion below — can your data leave your data center — doesn't depend on it and stands regardless.

### The Hollywood IP case

He worked in Hollywood and sold a film to a studio.

> "What I learned in that process is — **studios protect IP to a degree that isn't funny.**"

**The key insight, and it's the opposite of what people assume**:

> "Everyone's focus is on using large language models to **create** — telling stories, rendering. **But the real big opportunity is analysis.**
>
> Analyze a film's plot outline and find **what works and what doesn't**: why did this one make money and that one not? **And film margins are razor-thin, so that analysis is enormously valuable.**
>
> But to do that analysis you have to **share the details of your film with a large language model** — **and they will absolutely not hand that to GPT or Gemini, because that's sharing the IP with a third party.**
>
> **Enter small models.**"

> **"A 7B model today is as smart as a 50B was yesterday."**

The same logic applies to **law firms and healthcare providers** — anywhere privacy matters.

### ⚠️ This directly contradicts the previous post

> "I see the skill developers on this side will need most over the next two or three years being **fine-tuning** — take an open source model and tune it for a specific downstream task."

Whereas Katanforoosh in [the previous post](/posts/ai/2026-08-16-cs230-agents-prompts-rag-en) says "**I'm not a fan of fine-tuning, I avoid it wherever I can**, because by the time you're done, the next model already beats your fine-tuned version."

**This isn't a contradiction, it's two different markets.** Katanforoosh is talking about **building applications on cloud APIs** — where model iteration is fast and you can drop the next generation straight in, so fine-tuning gains get eaten by the next release. Moroney is talking about **self-hosted settings where the data can't leave** — where you couldn't swap in a cloud model anyway, so "the next generation is stronger" means nothing to you, and tuning is the only path to improvement.

**The criterion is: can your data leave your data center?** If it can, listen to Katanforoosh; if it can't, listen to Moroney.

## Diversify your skills

A student asks: Nvidia only hires for very narrow specialties, so should you specialize or diversify?

> "**I'll always argue that diversifying is better.** That narrow scenario is just that one narrow scenario, and you're putting all your eggs in one basket. **And if you put all your eggs in that basket and you don't get in, then what?**"

And his definition of "diverse" is unusual:

> "You say LLMs or computer vision — **but 'understanding models, understanding how to use models' is one skill to me.** Diversifying means **stepping outside that box**: what does building an application on top of these look like? What does scaling an application look like? **And user experience** — because building a beautiful app nobody will use gets you nowhere. **I'm looking at you, Microsoft Office.**"

## On-device AI

> "The conventional wisdom is that AI's compute platform is CPU + GPU. **But that's changing too.**"

ARM's **SME (Scalable Matrix Extensions)** lets AI workloads run on the **CPU**. The benefit is you **don't need an extra chip** burning power and board space, and CPUs are already low-power.

**The Alipay photo-search case**: normally a "find my photos of eating sushi" feature needs a backend service, with three problems — **privacy** (photos go to a third party), **latency** (upload, process, download) and **cost** (you have to build and operate a cloud service). **Moving it all on-device solves all three at once.**

> "As models get smaller and low-power devices can run them, **embedded intelligence everywhere stops being a pipe dream.**"

## "Artificial understanding" and that hockey video

**The failed demo**: a photo of his son playing hockey (mid-swing, taking a shot). Confident in his prompting, he asked directly for a video of "him scoring." Result: it was an **empty practice rink** (the top right corner is where they pile the trash), but the AI assumed a full house and **painted spectators in**; he missed by a mile and **the crowd cheered anyway**; **an extra stick appeared in his hands**; and it **forgot his name.**

**The successful demo** is a film clip made by a startup he mentors, with emotional performance. What made the difference:

> "Once I broke it into agentic steps: 'in this scene a girl is sitting on a bench, sad, and another person wants to comfort her' — feed that, along with **the whole story**, along with my constraints (this shot must be 8 seconds, there must be clear dialogue), to a large language model.
>
> So the LLM **writes a longer, more descriptive prompt than I would have written myself. The LLM's understanding of what makes a good shot, a good angle, a good emotional beat far exceeds what I could describe in hours.**
>
> Step two is declaring tools. What I learned, for instance — **that video engine is bad at high-action scenes but very good at slow camera moves conveying emotion.**
>
> Cost matters too: **generating four videos costs about two to three dollars of credit. The tokens spent up front on understanding intent and planning get paid back on the back end.**"

## Three closing stories

**The certificate in Syria** (what surprised him most is the short-sightedness): Google's TensorFlow professional certification cost the company **a hundred thousand dollars a year**, "a drop in the ocean," and **the goodwill it generated was enormous** — a young man living in Syria earned the certificate, **which let him move to Germany and join a large German company**, and he can now support his family back home and move them out of a war zone. "**But because it didn't generate revenue for the company, that investment eventually went away.**"

**"The dumbest person in the world"**: a friend of his, a former professional hockey player who left school at 13 and retired due to concussions, now runs a nonprofit skating rink and **always calls himself the dumbest person in the world.** Every quarter he has to report operating results to a board, with data scattered across the compressors that cool the ice, spreadsheets, and the books — **and he spent over $150,000 a year on consultants to consolidate it.** He tried it himself with ChatGPT, uploading spreadsheets and PDFs, and **now does it himself in two hours, and does it well.**

> **That $150,000 a year now goes to hockey gear and lessons for underprivileged kids.**
>
> "I told him afterwards, 'congratulations, you're a developer now.' **He didn't like that.**"

**The brain cancer researcher in Wales**: eight years ago, a department with **ten researchers sharing one GPU**, half a day each; his slot was Tuesday afternoons. Every non-Tuesday-afternoon hour went to preparation, he ran it Tuesday afternoon, and then prayed. "And then I showed him **Google Colab** … **the poor guy's brain just melted.**"

**Does AI promote equality or inequality?**

> "The answer is: **both, and neither.** Any tool can be used for any purpose … I've lived my life by one line: **assume good intent, but prepare for bad intent.**
>
> **AI itself doesn't have a choice. It's how people use it.**"

---

## Beyond the classroom: the most counterintuitive point

There's one claim running through the whole session, and it's the opposite of most AI career advice: **technical ability is not the bottleneck.**

- The 10x engineer failed on **attitude signals**, not ability
- Moroney failed at Google twice because he **interviewed for the wrong role**, not because he wasn't strong enough
- The European company nearly built the wrong thing because **nobody asked "why,"** not because the technology couldn't do it
- Enterprise AI projects fail in bulk mainly on **scope definition**, not on models being insufficient (the 85% he cited has no traceable source, but the causal judgment is backed by his own first-hand cases)

And the reason the technical-debt framework is useful is that it turns "should AI generate this code" **from a technical question into a financial one**: you've taken on a debt, is it worth it? That question is far more useful than "is vibe coding good or bad," because the latter has no answer and the former has one every time.

As for the big-AI / small-AI fork — it's the one forward-looking judgment in this lecture **you can actually make a decision with**, and it has a clean criterion: **can your data leave your data center?**

## References

- [Lecture 9: Career Advice in AI](https://www.youtube.com/watch?v=AuZoDsNmG_s) — 2025/11/18, Andrew Ng plus guest Laurence Moroney. Source for everything above
- [Measuring AI Ability to Complete Long Software Tasks](https://arxiv.org/abs/2503.14499) — METR, NeurIPS 2025. The research Ng cites — **note it measures software tasks**
- [CS230 Lecture 9 main slides](https://cs230.stanford.edu/syllabus/fall_2025/8/lecture_8.pdf) and [guest slides](https://cs230.stanford.edu/syllabus/fall_2025/8/lecture_8_guest.pdf)
- [Stanford CS230 Autumn 2025 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rNRRGdS0rBbXOUGA0wjdh1X) — the full nine-lecture list
- [Agents, Prompts, and RAG](/posts/ai/2026-08-16-cs230-agents-prompts-rag-en) — the previous post in this series, the other end of the fine-tuning position

**Verification results for the citations made in class** (three third-party numbers, two substantively wrong):

- [Gemini image generation got it wrong. We'll do better.](https://blog.google/products-and-platforms/products/gemini/gemini-image-generation-issue/) — Google official, 2024/2/23, Prabhakar Raghavan. **The prompt-rewriting mechanism and its consequences that Moroney describes match Google's own account**
- [MIT report: 95% of generative AI pilots at companies are failing](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/) — Fortune, 2025/8/18, reporting MIT NANDA's *The GenAI Divide: State of AI in Business 2025*. **About 5% of pilots produced revenue acceleration; the rest had almost no measurable P&L impact** — the closest real source to "85% fail," but the institution is MIT not McKinsey and the number is 95% not 85%
- [The state of AI in 2025: Agents, innovation, and transformation](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai) — McKinsey's own survey. What it says is that **enterprise-level EBIT impact "continues to be rare," with about 6% of respondents in the high-performer group attributing ≥5% EBIT impact** — the "85% of projects fail" figure does not appear
- [Martin Casado's correction](https://x.com/martin_casado/status/1990462245541982546) — "I'd say 20-30% use open source. Of those I'd say 80% use Chinese based models. **So closer to 16-24%.**" The original quote came via The Economist and referred to a16z's deal flow, not Y Combinator

**Still unlinked**: the details of the various companies Moroney mentions, and his aside about cultural associations with red hair (which he flagged himself as "I believe") — those are recounted personal experience, written down as recorded in class, with no verifiable public source.
