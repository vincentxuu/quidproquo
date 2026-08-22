---
title: "Which AI Courses to Take in 2026: From AI-Curious to Vibe Coding to Production"
date: 2026-07-10
category: ai
tags:
  - ai-course
  - learning-path
  - openai-academy
  - anthropic-academy
  - ai-literacy
  - claude-code
  - mcp
  - ai-agent
  - prompt-engineering
lang: en
type: guide
tldr: "Every official course platform from OpenAI, Anthropic, and Google, plus Stanford CS146S/CS336, Elements of AI, Hugging Face, MIT 6.S191 and more — scraped page by page, then re-sorted into four tiers: AI-curious, vibe coding, shipping to production, and how models actually work. Also covers self-study repos still being updated in 2026 and browser-based platforms that need no local setup, filtered by last-commit date rather than star count. The conclusion: nearly all of it is free. What is scarce is not courses, it is the judgment to pick one. And tier four will not fix your tier three problem."
description: "A 2026 survey of AI courses organized into four tiers — AI-curious, vibe coding, production, and fundamentals — covering OpenAI Academy, Claude Academy, Google's free and paid tracks, Elements of AI, Stanford CS146S and CS336, MIT 6.S191, Hugging Face, and Hung-yi Lee, with verified pricing, duration, and prerequisites, plus Kaggle Learn, Scrimba, and GitHub self-study repos still maintained in 2026."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-07-10-ai-courses-2026-guide)

In the first half of 2026, three frontier labs independently decided that teaching you to use AI was part of the product. OpenAI Academy launched three core courses in June. Anthropic reorganized its entire Academy into Claude Academy, sorted by product. Google shipped a new AI Professional Certificate. Around the same time, Stanford ran a for-credit course on how to direct coding agents, with the creator of Claude Code on the guest list.

This piece scrapes those resources page by page, records the cost, duration, audience, and prerequisites, and re-sorts everything into four tiers:

1. **AI-curious** — you don't yet know what to do with it
2. **Vibe coding** — you already write code with AI, but mostly on instinct
3. **Past vibe coding** — making what the AI writes safe to ship
4. **Fundamentals** — understanding what actually happens inside the model

Sorting by "technical vs. non-technical" breaks down here, because a large group of people vibe-code daily without considering themselves engineers, while some courses labeled "beginner" ask you to finetune an LLM for homework. The gap between tier two and tier three is also far wider than most course catalogs will admit.

The conclusion up front: **almost all of this is free. What's scarce isn't courses, it's the judgment to choose one.**

A note on method. Every number below comes from an official page I actually fetched, not from memory or prior knowledge. The first pass was 2026-07-10; on 2026-08-21 I re-checked pricing, course counts, and term schedules, and rewrote whatever had gone stale. Where official pages contradict themselves, I record the contradiction rather than quietly "fixing" it into something that looks reasonable.

Prices and languages come from **current official pages**, never from old blog posts. This matters more than it sounds. The AWS announcement introducing subscriptions lists $299/year and 12 languages — but that post is from 2022. The current pricing page says $449 and the current FAQ says 17 languages. The widely circulated Google Cloud post about free badges is from 2023. **Citing an official source is not the same as citing the current state.** Always check the date.

Three items remain marked "unverified," and not because I didn't look hard enough — they are **structurally unavailable**: OpenAI Academy's per-course syllabus sits behind a login on Gradual; the Maven paid cohort page shows Sold out and lists no price; NVIDIA's self-paced course pages don't state a language.

## Tier 1: AI-curious — you don't know what to do with it yet

What this tier has in common: no programming, under 90 minutes per course, and almost always a completion certificate. The three vendor platforms are highly redundant. Pick one, finish it, move on.

### OpenAI Academy

[`academy.openai.com`](https://academy.openai.com/), run by OpenAI, **entirely free**, open globally, requires only a ChatGPT account. Courses are technically hosted on a third-party platform, Gradual, which handles enrollment, progress, and certificates.

On 2026-06-12, [OpenAI published three courses](https://openai.com/index/academy-courses-applying-ai-at-work/) forming a clear path:

| Course | Audience | Duration |
|---|---|---|
| AI Foundations | Complete beginners | 60–75 min |
| Applied AI Foundations | Some experience | 75–90 min |
| Agents and Workflows | Comfortable with AI | 75–90 min |

All three issue completion certificates, but OpenAI explicitly states these are **not** the same as formal "OpenAI Certifications." Worth noting — don't put a completion certificate on a résumé as if it were a credential.

The path ends at *directing agents*, not *writing better prompts*. That ordering is itself a signal: OpenAI considers the 2026 baseline skill to have moved from prompting to workflow design and delegation.

Whether course content is localized: **unverified**. I confirmed only that the help documentation exists in Traditional Chinese variants; the Academy site itself and every public course page are in English. The per-lesson syllabus requires a Gradual login, which I did not get past.

### Claude Academy (formerly Anthropic Academy)

**This entire section was replaced on 2026-08-20.** What used to live at `anthropic.skilljar.com` as Anthropic Academy is now [**Claude Academy**](https://academy.claude.com/). The catalog is no longer a flat course list — it's sorted by **product**: Claude.ai, Claude Cowork, Claude Code, Claude Tag, and Claude Platform each get a track, plus a cross-cutting AI Fluency track. The site's "All resources" view now lists **286 resources** — courses, tutorials, and use cases combined, which is no longer the same unit of measurement as the old "how many courses" count. All free, most with completion certificates.

The relaunch also **re-timed everything**, and in the upward direction. The two entry courses now look like this:

| Course | Current spec |
|---|---|
| AI Fluency: Framework & Foundations | 14 lessons + 1 quiz, **4 hours** |
| AI Capabilities and Limitations | 13 lessons + 1 quiz, **3.5 hours** |

AI Fluency still centers on the 4D framework (Delegation, Description, Discernment, Diligence) and still forks by audience — educators, students, nonprofits, small businesses, pK-12 teachers, and builders each get a version, all recommending the foundations course first. This "one framework × six audiences" structure doesn't exist anywhere else on this list; if you're rolling out AI education inside an organization, it's the most finely segmented option available. Anthropic also put five of the AI Fluency courses on Coursera in May 2026 as Community Impact courses — free, overlapping content, pick whichever platform you prefer.

The relaunch added a "Tutorial" format too: 3-to-15-minute single-point explainers (The 4 Properties of AI at 7 minutes, Choosing the right effort level in Claude Code at 15) slotted between courses.

The only thing that costs money is certification, and that has grown from one exam into a line: [**Claude Certified**](https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request) now has Associate, Architect, and Developer at the Foundations level, plus an Architect – Professional, with a separate Prep Courses area. Certification stayed on skilljar and did not move with the courses. Price and question count now live in a downloadable Exam Guide PDF rather than on the page — previously Architect – Foundations was $125 USD, 60 questions, 120 minutes, online-proctored or at a Pearson center.

The exam weighting says a lot about what Anthropic thinks matters: Agentic Architecture & Orchestration 27%, Claude Code Configuration & Workflows 20%, Prompt Engineering & Structured Output 20%, Tool Design & MCP Integration 18%, Context Management & Reliability 15%.

### Google: a paid certificate, and free intro courses

Google is the only vendor here with a subscription. Its own pages give four mutually tangled answers to "does this cost money," and untangling them is worth the effort — because once you do, you find that **$49/month doesn't buy the course, it buys the certificate**.

#### The free tier

Start with the rules, because Google states them in one place. The official learning hub [`ai.google/learn-ai-skills`](https://ai.google/learn-ai-skills) says plainly: courses tagged **"no charge" are free**; joining the GEAR community gets you **35 learning credits that renew monthly** for courses and hands-on labs; and accessing the full catalog costs **$29 per month**. Higher education, government, nonprofit, and workforce development programs have a separate no-charge cohort option.

The single free course most worth taking:

[**Introduction to Generative AI**](https://www.skills.google/course_templates/536) — 45 minutes, Introductory, badge on completion, and Google Skills showed it updated days before I checked. The [Coursera version](https://www.coursera.org/learn/introduction-to-generative-ai) is marked "Enroll for free" with 1.62M enrollments, 4.7 stars (12,349 reviews), and **29 languages**; Udacity lists it flatly as a Free Course. A commenter on Class Central put it best: what you get on completion is a free badge, not a formal certificate.

It's also the first stop on the Beginner [Introduction to Generative AI learning path](https://www.skills.google/paths/118), five activities total, updated two months prior.

(The Google Cloud blog listed another batch of "no credits required" courses in [December 2025](https://cloud.google.com/blog/topics/training-certifications/upskill-for-the-holidays-no-cost-ai-training-from-google-skills), including Generative AI Leader and Introduction to Gemini Enterprise. That's a seasonal promotional post, and the same blog carries older, now-obsolete free-badge announcements — check the publication date before citing.)

#### The two paid tracks

- [**Google AI Essentials**](https://grow.google/ai-essentials/): 5 modules, beginner-level.
- [**Google AI Professional Certificate**](https://grow.google/ai-professional/): 7 courses, 20+ hands-on labs, with the final course building an app via vibe coding (no programming required). Enrollment includes a 3-month Google AI Pro trial.

The subscription is **US$49/month** (via Coursera; also available through Google Skills or Udemy).

#### The "is it free" puzzle, solved

Four channels, four answers: grow.google says $49/month with a 7-day trial; the Google Skills path page says "available with subscription, 7-day free trial for new users"; the Google Cloud blog lists AI Essentials as "no credits required" with a certificate on completion; Udemy lists the same course "from $20/month."

Pulled apart, these aren't actually contradictory — no single page is just willing to say the whole thing. Three separate facts are being conflated:

1. **Coursera runs an audit model.** A reviewer who completed the course in Q1 2026 spells it out: [all videos and readings are free to watch; only graded assignments and the certificate cost money](https://www.aiifi.ai/ai-course-guides/google-ai-essentials-worth-it).
2. **"Credits" aren't dollars, they're points.** "No credits required" on Google Skills means it doesn't consume platform learning credits (the internal currency for running labs, of which GEAR grants 35/month). Unrelated to the subscription fee.
3. **$29 and $49 are different subscriptions.** The former is the full Google Skills catalog; the latter is Google Career Certificates (which is what AI Essentials and AI Professional are). Two bills, two products.

So the conclusion is simple: **you can watch the entire course for free; $49 buys the Google-branded certificate.** That also explains why so many reviews argue about whether it's "worth $49" — they're arguing about the brand value of a credential, not the quality of a course.

Durations don't agree either: grow.google says "under 15 hours" in one place, the AI Skills overview says "under 10 hours," Google Skills says 4h45m, Coursera says 4 hours, and people who actually took it report 6 to 8. AI Professional simultaneously claims "7 courses" and "seven modules of about an hour each" while also advertising 20+ hands-on labs — the one-hour-per-module claim looks like an undercount.

One practical detail on localization: **the AI Professional page states it is currently English-only, with 10+ languages "coming soon."** A localized marketing page does not mean localized instruction — a trap worth knowing about generally, not just here.

### Elements of AI: the only intro course not selling you something

All three vendors above share a problem: the course ends with you being better at using their product. That's not a conspiracy, it's commercial logic. But you should at least know a neutral option exists.

[**Elements of AI**](https://www.elementsofai.com/), from the University of Helsinki and MinnaLearn, launched 2018. Free, no programming, roughly 30 hours, certificate on completion. Over **2 million** registrations, graduates in 170 countries. In 2019 Class Central picked it as the best online computer science course out of 1,167. Roughly 40% of participants are women, more than double the average for CS courses.

It comes in two parts: Introduction to AI (six modules, no math or code) and Building AI (five modules, basic Python recommended). The content is old-fashioned and solid AI literacy — what AI is, what it can and can't do, machine learning, neural networks, and the social and ethical dimensions. It won't teach you which Gemini button to press in Gmail, but it will leave you knowing what question to ask when any vendor makes a claim.

One limitation to state clearly, because it's the sharpest illustration of a pattern that recurs across this whole list: **localization is not where you'd expect it.** Officially the course is translated into 26 languages and localized for 30 countries — but all of those languages are European. The course originated when Finland held the rotating EU presidency and offered it as an "intangible gift to all member states." The country selector lists thirty sites, from Austria to Ukraine, and not one is in Asia. If you're outside Europe, you take it in English.

## Tier 2: Vibe coding — already using it, mostly on instinct

The goal here is narrow: get the tool running smoothly in your hands. You don't need to understand transformers, but you do need to know what belongs in CLAUDE.md, what happens when context fills up, and when to start a fresh session.

Courses in this tier share one trait: **they're all short**, one to two hours. Because they're short, they overlap heavily. Pick one vendor and finish it.

### Anthropic: the Claude Code track

Claude Academy files these under [Build with Claude](https://academy.claude.com/collections/build-with-claude):

| Course | Spec | Content |
|---|---|---|
| Claude Code 101 | 12 lessons + 1 quiz / 1 hr | What Claude Code is, how it works, core workflows |
| Claude Code in Action | 9 lessons + 1 quiz / 1 hr | Long hands-off sessions you can trust: steer, configure, automate, verify |
| Claude Platform 101 | 13 lessons + 1 quiz / 1.5 hr | Building on the Claude Platform from scratch, for people who've made a few API calls |
| Introduction to agent skills | 6 lessons / 1 hr | Reusable markdown instructions, from first skill to team distribution |
| Introduction to subagents | 4 lessons / 45 min | Decomposing complex tasks across parallel subagents and orchestrating them deterministically |

Requires a code editor and command-line basics. Claude Platform 101 is new since the relaunch. The Claude Code track currently holds **6 courses and 11 tutorials**, plus heavy outbound linking to the official docs at `code.claude.com` — post-relaunch, Academy behaves more like a front door than a closed course platform.

People who finished them give consistent advice: Claude Code 101 has real filler, and the parts worth your attention are CLAUDE.md, skills, MCP, and context management. One reviewer spent 20 minutes on the subagents course and found the explanation of subagent-vs-main-agent context windows clear, but noted it doesn't cover what to do when a subagent stalls mid-run — which is exactly the problem you hit in practice.

### OpenAI: the Codex series

OpenAI Academy's three formal courses are all non-technical. The actual Codex material lives in the [Builders community](https://academy.openai.com/public/clubs/builders-etkn1/overview) (27,030 members): **Codex 101 (intro), 102 (practical workflows), 103 (advanced workflows and automation)**, all three updated in June 2026, with a Codex Bootcamp added in July, plus Codex for Everyday Use, Building Websites with Codex Sites, and others.

OpenAI's two throughlines in the first half of 2026 are obvious: **agents and Codex**. Most of this material requires a login for full access; public pages show titles only.

### Google: building apps with vibe coding

The final course in the Google AI Professional Certificate builds an app via vibe coding, explicitly without programming. It's the only paid certificate course on this list that writes vibe coding directly into the syllabus ($49/month).

Kaggle also ran a [**vibe coding edition of the 5-Day Intensive**](https://blog.google/innovation-and-ai/technology/developers-tools/kaggle-genai-intensive-course-vibe-coding-june-2026/) in June 2026 — free, with a capstone project.

## Tier 3: Past vibe coding — making it safe to ship

This is the main event, and the tier with the widest gap.

Tier two gets the AI to write the thing. Tier three asks a different question: **how do you know it's correct?** How do you evaluate it, where do guardrails go, how do multiple agents edit one codebase without colliding, how do you defend against prompt injection, how do you monitor an agent after it ships.

Most people get stuck here, and stay stuck. Tier two teaches you to issue instructions; tier three teaches you to build a process that doesn't depend on luck.

### Stanford CS146S: the only vendor-neutral field guide

[`themodernsoftware.dev`](https://themodernsoftware.dev/) looks like an independent course platform. It's actually the official site for **Stanford's for-credit course "CS146S: The Modern Software Developer"** (Fall 2025): 3 units, 10 weeks, roughly 10–12 hours per week, with programming experience equivalent to CS111 as prerequisite. This site has a [week-by-week breakdown series](/posts/ai/2026-08-16-cs146s-course-map-en) on it.

Taught by Mihail Eric: Stanford NLP Group alum (advisors including Manning, Percy Liang, Potts), former Amazon Alexa AI scientist, co-founder of YC-backed Storia AI.

Crucially, **the weekly slides, reading lists, and [GitHub assignments](https://github.com/mihail911/modern-software-dev-assignments) are all public** — effectively a free self-study curriculum. The 10-week outline:

```
1  Introduction to Coding LLMs
2  The Anatomy of Coding Agents      ← agent architecture, tool use, MCP
3  The AI IDE                        ← context management, "Specs Are the New Source Code"
4  Coding Agent Patterns             ← autonomy levels, Claude Code
5  The Modern Terminal
6  AI Testing and Security           ← prompt injection, context rot
7  Modern Software Support           ← AI code review, debugging
8  Automated UI and App Building
9  Agents Post-Deployment            ← observability, multi-agent
10 What's Next for AI SWE
```

The guest speaker list is faintly absurd: **Boris Cherney (creator of Claude Code)**, Silas Alberti (research lead, Cognition/Devin), Zach Lloyd (CEO, Warp), Isaac Evans (CEO, Semgrep), Gaspar Garcia (AI research lead, Vercel), Martin Casado (GP, a16z).

Its biggest difference from OpenAI Academy and Claude Academy is **vendor neutrality**: one course covering Cursor, Claude Code, Windsurf, and Warp together rather than one vendor's product. Assignments include hand-building a coding agent and an MCP server from scratch.

The same material has a [paid cohort version on Maven](https://maven.com/the-modern-software-developer/ai-course), "AI Software Development: From First Prompt to Production Code": 4 weeks, 8 live sessions, 14 lessons, 4 projects, private Discord, completion certificate, now on its third cohort. **Price unverified** — the page shows Sold out with no figure listed.

Discount the reputation signals. The 4.9 rating (50 reviews) on the Maven page is the course's own page, not a neutral third party. There's a Reddit r/theprimeagen thread, but the site blocks scraping, so the comments are unavailable — meaning I also can't claim the reception is uniformly good. Marketing lines like "the world's first course of its kind" and "10x productivity" are marketing claims, independently unverified.

### Anthropic: the API and MCP, where the weight jumps

Same platform, but crossing out of tier two the difference is stark — from one-hour shorts to a nine-hour course:

- [**Building with the Claude API**](https://academy.claude.com/collections/build-with-claude): **67 lessons, 8 quizzes, 9 hours.** Covers prompting, tool use, RAG, agents, MCP, and production patterns. Requires Python + JSON + an API key.
- **Claude with Amazon Bedrock** (65 lessons / 8 quizzes / 8 hr) and **Claude with Google Cloud's Vertex AI** (66 lessons / 9 quizzes / 8.5 hr): structurally near-identical to the API course, differing by cloud platform.
- **Introduction to Model Context Protocol** (10 lessons + 1 quiz / 1 hr — building servers and clients from scratch with the Python SDK, covering the three core primitives: tools, resources, and prompts) and **MCP: Advanced Topics** (sampling, notifications, and roots, with interactive walkthroughs of each protocol flow).

(These numbers were all re-timed in the August relaunch and won't match older lists circulating elsewhere — third-party roundups still say "84 lessons." Trust the official page.)

[Someone who took the API course](https://www.youtube.com/watch?v=qUQbU7h4RoE) calls it the platform's "most complete technical course" and worth the time — but notes you can skip the prompt engineering section if you've done AI Fluency, and that watching a video walk through code line by line isn't faster than reading it yourself if you already read code. [Another engineer](https://www.ericapisani.dev/what-i-learned-from-anthropics-building-with-the-claude-api-course) took away XML tags for separating examples from data inside prompts, and Claude Code with git worktrees for parallel development. Her criticism is equally specific: the agent section stays at a high conceptual level and never gets into what an evaluation framework should actually look like.

And evaluation is the single most important thing in this tier.

An easy thing to miss: **there is no standalone prompt engineering course on the platform.** It's a section inside the API/Bedrock/Vertex courses. If you want to drill prompt engineering specifically, the standalone material is on GitHub at [`anthropics/prompt-eng-interactive-tutorial`](https://github.com/anthropics/prompt-eng-interactive-tutorial), and [`anthropics/courses`](https://github.com/anthropics/courses) (~22.1k stars) collects five notebook-based courses.

### Kaggle 5-Day AI Agents Intensive

This syllabus is practically the definition of this tier, and it's free. Designed by Google ML researchers and engineers, originally a November 2025 livestream (the first cohort reached over 1.5 million learners), rerun live June 15–19, 2026, and otherwise available as a self-paced [Kaggle Learn Guide](https://www.kaggle.com/learn-guide/5-day-agents) you can start anytime:

- Day 1 Introduction to Agents (multi-agent with ADK + Gemini)
- Day 2 Agent Tools & Interoperability with MCP
- Day 3 Context Engineering: Sessions & Memory
- Day 4 Agent Quality (observability, LLM-as-a-Judge, HITL)
- Day 5 Prototype to Production (A2A Protocol, deploying to Vertex AI Agent Engine)

Each unit includes a whitepaper, podcast, Kaggle codelabs, and the livestream recording.

Be warned: it's harder than it sounds. See "What people who took them say" below.

### Hugging Face: the widest catalog, with free certificates

[`huggingface.co/learn`](https://huggingface.co/learn) is the most complete free ecosystem in this sweep, and it isn't tied to one model provider. Current courses include the LLM Course, Agents Course, [MCP Course](https://huggingface.co/learn/mcp-course/en/unit0/introduction), Context Course (specifically on context engineering for code agents, one of the newer ones), Deep RL Course, Diffusion Course, Audio Course, Computer Vision Course, Robotics Course (LeRobot), a smol course (post-training), and the Open-Source AI Cookbook.

Take the [Agents Course](https://huggingface.co/learn/agents-course/en/unit0/introduction), which I checked page by page. The design is honest: basic Python and LLM knowledge required, suggested pace of one unit per week at 3–4 hours, no deadlines, start anytime. **It offers two free certificates** — a fundamentals certificate after Unit 1, and a full completion certificate after a use-case assignment and final challenge. Maintained by Ben Burtenshaw and Sergio Paniego, and officially positioned as a continuously maintained living project.

On languages, the Agents Course currently ships English, Spanish, French, Korean, Russian, Vietnamese, and Simplified Chinese.

If what you want is structure plus a certificate without paying and without tying yourself to an OpenAI or Anthropic account, this is the place to start.

### Microsoft: the sturdiest open-source option

[`microsoft/generative-ai-for-beginners`](https://github.com/microsoft/generative-ai-for-beginners) is a 21-lesson open-source course under MIT License, roughly 113k stars and 60.6k forks. Each lesson has a short video, a README, and Python/TypeScript examples.

It has two advantages rare among these resources. First, **the README ships in 50+ language translations** — a level of localization coverage nothing else on this list matches. Second, it's still actively maintained in 2026; the most recent commits are migrating from Azure OpenAI to the Responses API, not a course collecting dust.

Two caveats: the course needs Azure OpenAI, Microsoft Foundry Models, or an OpenAI API key to run and includes no credits of its own; and **GitHub Models was fully retired on 2026-07-30** (playground, model catalog, inference API, and BYOK all shut down, including for existing paying customers), with Microsoft pointing users to Microsoft Foundry or GitHub Copilot. If you follow the examples, that part has to be swapped out. No completion certificate.

If you want a formal credential rather than open-source material, [Microsoft Learn's AI learning hub](https://learn.microsoft.com/en-us/ai/) is free and splits into eight role-based paths (business and technical leaders, end users, data scientists, developers, IT, security, and more). The formal credential is **Azure AI Fundamentals (Exam AI-901)**, focused on building AI solutions with Microsoft Foundry and Python.

### DeepLearning.AI: the breadth benchmark

[DeepLearning.AI's course page](https://www.deeplearning.ai/courses/) lists 124 courses (100 short courses, 13 courses, 11 professional certificates), split 64 beginner and 60 intermediate. **Short courses on the site are free**, and each is labeled with its duration, which is genuinely useful for planning: AI Prompting for Everyone at 7h04m, Agentic AI at 10h55m, Deep Learning Specialization at 127h31m.

Its real value is the partner list — courses co-built with Anthropic (4), OpenAI (4), Google (4), Hugging Face (5), Microsoft (3), Meta (3), and AWS (1). New 2025–26 courses include Claude Code, Agent Skills with Anthropic, and Spec-Driven Development, effectively re-packaging each vendor's official material into course form. The homepage banner was advertising a new Voice for AI Agents and Applications course; they ship often.

Short courses give a completion marker. **Specializations on Coursera cost money**, and the [official pricing page](https://www.coursera.org/courseraplus) is clear: individual learning plans run $49–$79/month, Coursera Plus is $59/month or $399/year (with a 40% promotion running on the day I checked, bringing annual to $239.40). Which means Google's $49/month bill is the same order of magnitude as any specialization on Coursera.

### NVIDIA and AWS: enterprise and cloud leaning

[**NVIDIA Deep Learning Institute**](https://www.nvidia.com/en-us/training/) is hybrid: most popular self-paced courses are free (for example Find the Bottleneck: Optimize AI Pipelines With Nsight Systems, 3 hours), while instructor-led workshops cost money, typically 8 hours a session (Building AI Agents with Multimodal Models). Some courses grant a DLI certificate; paid certification exams are separate. The platform is active — the site was advertising SIGGRAPH training sessions in July 2026.

NVIDIA also runs a network of officially authorized DLI partners delivering workshops in local languages — worth checking whether one operates in your region, since the curriculum and certificate are the same as the English original. Whether the self-paced courses on learn.nvidia.com have localized interfaces is **unverified**; the current course pages don't state a language.

[**AWS Skill Builder**](https://aws.amazon.com/training/digital) is freemium: the free tier has **500+ on-demand digital courses** (the homepage separately claims "1,000+ free learning resources" and "900+ free self-paced courses" — three numbers, three ways of counting), while an individual subscription is **$29/month or $449/year** (the annual adds expert-led Digital Classrooms), and team plans are also $449 per seat per year. Subscriptions include Builder Labs and certification prep.

AWS is also the localization outlier among commercial platforms here: the [official FAQ](https://aws.amazon.com/training/faqs) states that free digital training is available in **17 languages**, and unusually, it names them on the current page rather than promising them "soon."

One 2026 change worth knowing: AWS **microcredentials are now free**, no Skill Builder subscription required.

## Tier 4: Fundamentals — what's actually going on inside

The first three tiers are about driving the model. This one asks a single question: how is the model built?

**First, a directional mistake that's easy to make.** People stuck in tier three often react by thinking "maybe I need to learn the theory," and dive in here. But nine times out of ten, the reason an agent can't ship is missing evals, poor context management, or absent guardrails — not that you can't hand-write an attention kernel. **Tier four will not solve your tier three problem.**

There's exactly one good reason to be here: you want to know why it behaves the way it does, not just make it run. Four steps, from gentle to steep.

### Hung-yi Lee: the Mandarin-language entry point

If you read Mandarin faster than English, this section matters more than the three that follow — there is no equivalent in any other non-English language on this list.

Professor Hung-yi Lee at National Taiwan University teaches **entirely in Mandarin, free, with all slides and video public**, no formal certificate. He ships a new edition every year, and two current courses are worth separating:

- [**Machine Learning 2026 Spring**](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) — the newest edition, and clearly shifted toward agents: the first two lectures cover AI agent mechanics and context engineering, the middle runs through Flash Attention, KV Cache, and positional embeddings, and the ten assignments include AI Agent as an AI Engineer, LLM Fast Inference, Test-Time Scaling, and Model Merging. **It straddles tiers three and four** rather than sitting in "fundamentals" — for a Mandarin reader wanting agent engineering, nothing else comes close on value.
- [**Introduction to Generative AI and Machine Learning, 2025 Fall**](https://speech.ee.ntu.edu.tw/~hylee/GenAI-ML/2025-fall.php) — 10 lectures on how models get trained: training tricks, post-training and catastrophic forgetting, image generation, spoken language models. Pick this one for foundations.

The FAQ says the target audience is beginners, and even claims that "with no programming experience, following the TA instructions should at least get you a passing grade." **Don't be fooled by the word beginner.** This is beginner in the university sense — it assumes you're a STEM undergraduate who simply hasn't taken ML yet. The assignment list: HW2 build a RAG system, HW4 defend against malicious LLM instructions, HW7 finetune an LLM, HW9 diffusion, HW10 speech generation, all running on free Colab GPUs.

Someone who just wants to write weekly reports with ChatGPT will open HW7 and close the tab. That's why it isn't in tier one — it isn't an AI literacy course, it's **a fundamentals course that happens to be taught in Mandarin**.

### MIT 6.S191: the gentlest English-language entry

The lowest prerequisites of the three: calculus and linear algebra, with **Python experience helpful but not required** — the rest gets explained along the way.

The [2026 edition](https://introtodeeplearning.com/) finished on May 25, and **all nine lectures, slides, and labs are open-sourced and posted** — you get everything at once, no waiting for weekly releases. Labs run on Google Colab. Content spans neural network fundamentals, deep sequence modeling, computer vision, generative modeling, and reinforcement learning, through large language models and AI for science, closing with The Three Laws of AI and Secrets to Massively Parallel Training. It updates yearly; the 2026 edition expanded the LLM and agentic AI coverage.

If you want to understand why models behave as they do without hand-writing kernels on day one, this is the sensible first stop.

### Harvard CS50 AI: the AI that isn't an LLM

CS50's Introduction to Artificial Intelligence with Python deserves its own mention because what it teaches is **deliberately not only LLMs**: search algorithms, knowledge representation and logic, probability, optimization, machine learning, neural networks, and natural language processing.

In a year when every course teaches prompts and agents, adding one on search and logic is what gives you judgment about which problems call for an LLM and which ones shouldn't touch one.

[Free with a certificate on Harvard OpenCourseWare](https://www.classcentral.com/report/harvard-cs50-guide); the verified certificate on edX costs $299. The course page says 7 weeks; the weekly hours differ by source — [Harvard's own page](https://pll.harvard.edu/course/cs50s-introduction-artificial-intelligence-python) says 10–30 hours, Class Central says 20.

### Stanford CS336: the hardest one here

If DeepLearning.AI is the breadth benchmark, CS336: Language Modeling from Scratch is the depth benchmark at the other end. For where it sits on Stanford's full prerequisite ladder, see this site's [Stanford CS course guide](/posts/learning/2026-08-20-stanford-cs-course-map-en).

The [site](https://cs336.stanford.edu/), slides, assignment specs, and YouTube recordings are all public and free (formal credit and Gradescope grading are Stanford-only). The site is now on the **Spring 2026 edition**, taught by Tatsunori Hashimoto and Percy Liang, 19 lectures with 5 large assignments: hand-writing a tokenizer, model, and optimizer, then FlashAttention2 and Triton kernels, then scaling laws and data processing, ending with SFT + RL.

The prerequisites are honestly steep: fluent Python, PyTorch, deep learning and systems fundamentals, plus calculus, linear algebra, and probability. The course describes itself as involving **"at least an order of magnitude more implementation than other courses."** No certificate.

Its difference from Hung-yi Lee's course is depth, not direction: Lee makes you understand what the model is doing; CS336 makes you build the whole thing. The sensible order is Lee first, then CS336, with a stretch of actually writing things in between.

## Beyond courses: self-study repos still being updated

Everything so far has been a *course* — a platform, progress tracking, a certificate. But a large share of the best material in this field exists as GitHub repositories, and the quality often exceeds the courses. Before listing any, one **filtering rule that matters far more than star count**:

> **Stars only prove it was popular. They don't prove it's alive.**

This isn't theoretical. All of the following are widely recommended, extremely high-starred, and **have been dormant for nearly two years**:

| Material | Stars | Last updated |
|---|---|---|
| `d2l-ai/d2l-zh` (*Dive into Deep Learning*, Chinese) | 79.8k | **2024-07** |
| `karpathy/LLM101n` | 37.5k | **2024-08** (the written material was never finished) |
| `karpathy/nn-zero-to-hero` | 24.0k | **2024-08** |
| `fastai/course22` | 3.7k | **2024-10** |

What they teach about CNNs, RNNs, backpropagation, and from-scratch implementation doesn't expire, and they remain usable as foundations. But anything after 2024 — modern LLM training recipes, agents, inference optimization, evals — simply isn't there and never will be. **Treating them as current material builds in a two-year gap.**

Below is the same list filtered by the same rule: **still being updated in 2026** (stars and last-updated dates checked 2026-08-21).

### Building a model from scratch

| Repo | Stars | Last updated | What it is |
|---|---|---|---|
| [`rasbt/LLMs-from-scratch`](https://github.com/rasbt/LLMs-from-scratch) | **103.1k** | 2026-08 | Sebastian Raschka's step-by-step LLM build. Highest star count on this list and still moving — **this is the current occupant of the seat Karpathy vacated** |
| [`karpathy/nanochat`](https://github.com/karpathy/nanochat) | 57.4k | 2026-08 | "The best ChatGPT that $100 can buy." Strictly a project rather than a course, but the learning density of reading the code is high |
| [`datawhalechina/happy-llm`](https://github.com/datawhalechina/happy-llm) | 33.1k | 2026-08 | Simplified Chinese, building an LLM from zero. Essentially the 2026 version of what D2L set out to do and never finished |

### Agents and RAG (matching tier three)

| Repo | Stars | Last updated | What it is |
|---|---|---|---|
| [`microsoft/ai-agents-for-beginners`](https://github.com/microsoft/ai-agents-for-beginners) | 72.9k | 2026-08 | Microsoft's agent intro, same series as generative-ai-for-beginners above |
| [`NirDiamant/RAG_Techniques`](https://github.com/NirDiamant/RAG_Techniques) | 29.1k | 2026-08 | A runnable collection of RAG techniques |
| [`NirDiamant/GenAI_Agents`](https://github.com/NirDiamant/GenAI_Agents) | 23.9k | 2026-08 | The same author's agent equivalent |
| [`DataTalksClub/llm-zoomcamp`](https://github.com/DataTalksClub/llm-zoomcamp) | 7.1k | 2026-08 | **A free cohort-based course** — with intakes, classmates, and deadlines. The only option here where you aren't alone |

### Engineering and shipping

| Repo | Stars | Last updated | What it is |
|---|---|---|---|
| [`openai/openai-cookbook`](https://github.com/openai/openai-cookbook) | 75.4k | 2026-08 | The official cookbook, updated daily |
| [`google-gemini/cookbook`](https://github.com/google-gemini/cookbook) | 17.7k | 2026-08 | The Gemini equivalent |
| [`liguodongiot/llm-action`](https://github.com/liguodongiot/llm-action) | 24.9k | 2026-07 | Simplified Chinese, LLM engineering and production deployment |
| [`stas00/ml-engineering`](https://github.com/stas00/ml-engineering) | 18.7k | 2026-08 | The engineering reality of training large models — hardware, parallelism, debugging. Almost no course teaches this angle |
| [`datawhalechina/llm-universe`](https://github.com/datawhalechina/llm-universe) | 13.8k | 2026-07 | Simplified Chinese, LLM application development for beginners |
| [`huggingface/smol-course`](https://github.com/huggingface/smol-course) | 6.7k | 2026-08 | Aligning small models |

One borderline case: [`mlabonne/llm-course`](https://github.com/mlabonne/llm-course) has 81.9k stars and tops many lists, but its last update was 2026-02 — six months quiet. Not dormant yet, but worth watching.

### Not material, an index: csdiy.wiki

One last entry, separate because it's a different species from everything above. [**csdiy.wiki**](https://csdiy.wiki/) ([`PKUFlyingPig/cs-self-learning`](https://github.com/PKUFlyingPig/cs-self-learning), **75.1k stars, 7,988 forks, 100+ contributors**, last updated 2026-08) teaches you nothing. What it does is **turn public university courses into comparable entries**: institution, prerequisites, programming language, a difficulty rating, estimated hours, and working links to the actual materials and assignments. Bilingual, with an `.en` page for every entry.

Its AI coverage fills this article's biggest blind spot — **university courses outside Stanford**:

| Category | Courses indexed |
|---|---|
| Artificial intelligence | Berkeley CS188, Harvard CS50 AI |
| Machine learning | Berkeley CS189, Stanford CS229, Hung-yi Lee |
| Deep learning | CMU 11-785, CS224n, CS224w, CS230, CS231n, **Berkeley CS285**, Michigan EECS498-007, MIT 6.7960, NYU DLSP21 |
| ML systems | **CMU 10-414**, CMU 15-442, UCSD CSE234, MLC, EML |
| Advanced ML | CMU 10-708, CS229M, STA4273 |
| Deep generative models | MIT 6.S184, large language models |

But the reason it belongs here isn't the length of that list — it's that **somebody fixes the broken links**. Recent commits include `[Fix] update MIT calculus course links` and `Update web links`, alongside a steady stream of additions (CMU 15-442, CMU 11-785, MIT 6.7960, NYU DLSP21, UCSD CSE234).

Which closes this section neatly: **star count can't tell you whether material is still alive, and an index whose maintainers repair dead links is precisely the thing that keeps answering "is this course still there?"** This article can only give you an August 2026 snapshot. An index is the thing that moves with time.

The right way to use it is as **a table of contents, not a textbook** — pick a course from it, then go read that course's own site.

**One structural point about the Chinese-language material above deserves calling out**: three of those four repos come from Datawhale, a live community organization rather than a single maintainer, which is why updates keep coming. That's exactly what D2L lacks — D2L has more than double happy-llm's stars, but one stopped in 2024 and the other shipped last month. Maintainer structure predicts freshness better than popularity does.

## Interactive platforms: the no-setup category

Every option above assumes you'll set up your own environment. One category removes that step entirely — the code runs in the browser.

**[Kaggle Learn](https://www.kaggle.com/learn)** is the one to consider first: **16 micro-courses, 3–5 hours each, all free, all with certificates**, with notebooks running directly in the browser. It covers Python, Intro to ML, Intermediate ML, Feature Engineering, Intro to Deep Learning, Computer Vision, Time Series, Intro to AI Ethics, Machine Learning Explainability, and Game AI and RL. It's the same Kaggle as the 5-Day Intensive above, but a completely different thing — the Intensive is a hard course, Learn is a staircase. **If you're stuck in tier one and want into tier two without spending an evening installing Python first, this is the shortest path.**

**[Scrimba](https://scrimba.com/)** is worth mentioning for one specific reason: **it's the JavaScript route.** Nearly everything on this list assumes Python, which stops front-end developers at step one. Scrimba's AI Engineer Path (11.4 hours, 12 modules, covering agents, RAG, MCP, context engineering, the Vercel AI SDK, and multimodality) runs the whole way in JS. It has course partnerships with Mistral, LangChain, and Hugging Face. The cost: Pro at $24.50/month billed annually ($294/year) or $49/month — though the free tier includes roughly 25 full courses, among them Build Serverless AI Agents (49 minutes), free and with a certificate, so you can try before paying. (One caveat: Scrimba's course-comparison articles are published on its own site. The pricing and syllabi are reliable; discount the rankings.)

**DataCamp** hosts a free version of Claude Code in Action, officially adapted by Anthropic — worth knowing if you prefer that fill-in-the-blank interface.

## What people who took them say

Everything above is what the official pages claim. What people who actually finished them say is more useful, and less flattering.

**"Courses aren't the best way to learn."** A reviewer who [ran through Anthropic's entire catalog in one weekend](https://www.youtube.com/watch?v=T-3bE2IIK4M) puts it bluntly: only a few were genuinely useful, and "none of these courses are the best way to learn Claude — the best way is to go use it." He singles out Claude Code 101 as having "a lot of fluff," with the real value in the CLAUDE.md, skills, MCP, and context management segments, the rest being filler. He also mentions passing every certification with a score of 99 — which is a fairly clear answer on what the certificates are worth.

**The shared blind spot of vendor courses is that they don't teach judgment.** One reviewer notes that Anthropic's courses are Claude-specific with "zero cross-platform transferability"; Google's teach you to use Gemini inside Workspace. Not a conspiracy, just commercial logic — but it explains why a vendor-neutral course like CS146S, covering Cursor, Claude Code, Windsurf, and Warp together, is unusually valuable.

**Reviews of Google AI Essentials are remarkably consistent: great for beginners, too shallow for anyone else.** [One graduate](https://productivitystack.substack.com/p/google-ai-essentials-review) (May 2025) wrote that the course "was too easy for me… it didn't teach me any new skills, it just made me aware of which skills I still lack," and found $49 "a bit steep" for the volume. Another on [LinkedIn](https://www.linkedin.com/posts/automatewithjames_i-took-a-google-ai-essentials-course-today-activity-7392604986662244352-tUnK) (November 2025) was harsher: basic content, well taught, but "too long for the difficulty," and "last updated in May — which on AI timescales is decades ago." A [more recent review](https://blog.theinterviewguys.com/google-ai-essentials-review) (February 2026) lands similarly: 8/10 for someone who has never touched AI, 5/10 for a technical worker already using ChatGPT daily.

**The Kaggle five days are not as accessible as they sound.** Free, made by Google, over a million participants — it's easy to assume it suits everyone. [A review from NYU](https://nexus.sps.nyu.edu/post/nexus-review-kaggle-5-day-gen-ai-intensive-course-with-google) says it plainly: the course suits people who "already have programming and machine learning fundamentals," and for casually interested learners it is "less education than it is overwhelming." Its whitepapers sometimes exceed 100 pages, the podcasts are AI-generated, and it is entirely self-directed with no feedback mechanism.

Incidentally, this course's predecessor set a Guinness World Record in April 2025 (280,000 simultaneous participants), and the agents edition drew over 1.5 million learners. Scale says nothing about fit.

**But people who actually finish take away the same things.** Notes from an engineer who completed the Kaggle agents course could stand in as this article's summary: traditional software engineering best practices haven't disappeared (modularity, testing, version control, monitoring); "evaluation is everything — you can't guess whether an agent works, you have to measure"; guardrails aren't decoration; and "a model without tools is smart but useless, a model with the wrong tools is dangerous."

## How to choose

**Tier 1** (AI-curious): the three OpenAI Academy courses are enough — free, certificated, under three hours total. If you only want 45 minutes on what generative AI is, take Google's Introduction to Generative AI, free and in 29 languages. For a vendor-neutral view, Elements of AI, but English only. Switch to Anthropic's AI Fluency series only if you're rolling out AI education inside an organization. Do not touch Hung-yi Lee at this tier. If you'd rather start writing code without installing anything, jump to Kaggle Learn's Python and Intro to ML, 3–5 hours each, free certificates.

On Google's $49/month: **watch the videos in audit mode first, confirm you actually want the certificate, then pay.** The content is free either way; what you're buying is graded assignments and a credential.

**Tier 2** (vibe coding): Claude Code 101 (1 hr) plus Claude Code in Action (1 hr) is enough to get the tool running smoothly, and adding Introduction to agent skills (1 hr) and subagents (45 min) tops it out. If you use Codex, swap in OpenAI's Codex 101/102/103. This tier is short — don't linger. The ceiling is low.

**Tier 3** (shipping to production): this is where most people should actually invest.

```
Kaggle 5-Day AI Agents Intensive     ← free; evals / context / deployment in one pass
        ↓
Stanford CS146S public material      ← vendor-neutral field guide, security and multi-agent included
        ↓
Then branch:
  deeper on protocol → Claude Academy's two MCP courses
  deeper on the API  → Building with the Claude API (67 lessons / 9h)
  want a certificate → Hugging Face Agents Course (free, certificated)
  want classmates    → LLM Zoomcamp (free, cohort-based)
  want raw code      → RAG_Techniques / GenAI_Agents (runnable collections)
```

**Tier 4** (fundamentals): if you read Mandarin, start with Hung-yi Lee. In English, start with MIT 6.S191, add CS50 AI for the non-LLM perspective, and finish with CS336. All free and public. If your goal is "how to run a deep learning project" rather than "how to build the model," this site also has a [CS230 series](/posts/ai/2026-08-16-cs230-when-prompting-stops-working-en).

If you genuinely want to build one by hand, courses aren't the only route — `rasbt/LLMs-from-scratch` is the most active and most used material on that path today, with `datawhalechina/happy-llm` as the Chinese-language equivalent. **But stay away from the ones frozen in 2024**, for the reasons in the section above.

One last reminder about direction: **tier four will not solve your tier three problem.** If you're stuck on "I don't trust what the AI wrote enough to ship it," what you need is evals, guardrails, and observability — and those are in the Kaggle five days and CS146S, not in a FlashAttention kernel.

The strongest impression from this whole sweep: the quality of free material in this field has become faintly absurd. Stanford publishes its for-credit course material. The creator of Claude Code guest lectures. Google's agent course is entirely free. A professor at NTU ships a new Mandarin edition every year.

The bottleneck was never access. It's whether you're willing to actually finish the assignments.

---

## Changelog

- **2026-08-21**: Re-verified pricing, course counts, and term schedules six weeks after publication. **Stale content was rewritten rather than annotated.**
  - **The Anthropic sections were rewritten wholesale**: Anthropic Academy was reorganized into **Claude Academy** on 2026-08-20, moving from `anthropic.skilljar.com` to `academy.claude.com` with a product-based catalog. Durations and lesson counts were all re-timed — AI Fluency foundations went from 1.1 hours to 4, AI Capabilities and Limitations from 0.25 hours to 3.5, Building with the Claude API from 84 lessons/8.1 hours to 67 lessons/9 hours, Claude Code in Action from 15 lessons to 9. Claude Platform 101 and a Tutorial format are new. Certification expanded from one exam to four and stayed on skilljar.
  - **GitHub Models completed retirement on 2026-07-30**; the original "will retire at the end of July" was updated and the official migration path added.
  - **Hung-yi Lee's Machine Learning 2026 Spring is now the primary recommendation**, given its shift toward agents and inference optimization; the GenAI-ML 2025 Fall edition is now listed as the foundations option.
  - **MIT 6.S191's 2026 term ended May 25**, with all nine lectures posted; the "released weekly, come back later" framing was removed.
  - **CS50 AI weekly hours** now use Harvard's own figure (10–30 hours) rather than a single secondhand number.
  - Also added: the OpenAI Codex series was updated in June with a Codex Bootcamp added in July; Kaggle reran the live intensive June 15–19, 2026; Anthropic put five AI Fluency courses on Coursera.
  - **Two new sections**: "Beyond courses: self-study repos still being updated" and "Interactive platforms." The inclusion criterion is **last-updated date, not star count** — hence `rasbt/LLMs-from-scratch`, `microsoft/ai-agents-for-beginners`, `openai/openai-cookbook`, `NirDiamant/RAG_Techniques`, `stas00/ml-engineering`, and `DataTalksClub/llm-zoomcamp` are in, while high-star repos frozen in 2024 (`d2l-zh` at 79.8k, `karpathy/LLM101n` at 37.5k, `nn-zero-to-hero` at 24.0k, `fastai/course22`) are explicitly excluded. Kaggle Learn and Scrimba were added under interactive platforms.
  - **Verified and left unchanged**: AWS ($29/month, $449/year, 500+ free courses, 17 languages), Google ($49/month, $29/month, GEAR's 35 credits), Elements of AI (2M learners, 30 country sites all in Europe), Harvard CS50 AI (edX $299), CS336 (Spring 2026, Hashimoto and Liang), Microsoft (50+ languages), and OpenAI Academy's three courses and durations.
  - **Still unverified**: DeepLearning.AI's total course count (the catalog page moved to dynamic loading), Google's Introduction to Generative AI enrollment and rating figures, and Hugging Face course details.
  - Also added [csdiy.wiki](https://csdiy.wiki/) as a separate entry under "an index, not material" — it fills this article's largest blind spot (university courses outside Stanford: Berkeley CS188/CS189/CS285, CMU 10-414/11-785/10-708, MIT 6.7960, NYU DLSP21, and others), and its maintainers actively repair dead links.

## References

- [OpenAI Academy](https://academy.openai.com/)
- [New OpenAI Academy courses for the next era of work](https://openai.com/index/academy-courses-applying-ai-at-work/)
- [OpenAI Academy courses (help center)](https://help.openai.com/en/articles/20001270-openai-academy-courses)
- [Claude Academy (formerly Anthropic Academy, relaunched 2026-08-20)](https://academy.claude.com/)
- [Claude Academy — All resources (286 items)](https://academy.claude.com/all)
- [Build with Claude course catalog (current lesson counts and durations)](https://academy.claude.com/collections/build-with-claude)
- [Claude Academy — Claude Code product track](https://academy.claude.com/products/code)
- [Anthropic's approach to teaching and learning AI (official relaunch post, 2026-08-20)](https://claude.com/blog/anthropics-approach-to-teaching-and-learning-ai)
- [Claude Certified Architect – Foundations](https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request)
- [anthropics/courses (GitHub)](https://github.com/anthropics/courses)
- [anthropics/prompt-eng-interactive-tutorial](https://github.com/anthropics/prompt-eng-interactive-tutorial)
- [Google AI Professional Certificate](https://grow.google/ai-professional/)
- [Google AI Essentials](https://grow.google/ai-essentials/)
- [Kaggle 5-Day AI Agents Intensive](https://www.kaggle.com/learn-guide/5-day-agents)
- [Kaggle GenAI Intensive: Vibe Coding cohort, June 2026 (Google Blog)](https://blog.google/innovation-and-ai/technology/developers-tools/kaggle-genai-intensive-course-vibe-coding-june-2026/)
- [CS146S: The Modern Software Developer (Stanford)](https://themodernsoftware.dev/)
- [CS146S assignments repo](https://github.com/mihail911/modern-software-dev-assignments)
- [AI Software Development: From First Prompt to Production Code (Maven)](https://maven.com/the-modern-software-developer/ai-course)
- [Hugging Face Learn](https://huggingface.co/learn)
- [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/en/unit0/introduction)
- [Hugging Face MCP Course](https://huggingface.co/learn/mcp-course/en/unit0/introduction)
- [microsoft/generative-ai-for-beginners](https://github.com/microsoft/generative-ai-for-beginners)
- [GitHub Models is now retired (GitHub Changelog, 2026-07-30)](https://github.blog/changelog/2026-07-30-github-models-is-now-retired)
- [Microsoft Learn AI learning hub](https://learn.microsoft.com/en-us/ai/)
- [DeepLearning.AI Courses](https://www.deeplearning.ai/courses/)
- [Coursera Plus official pricing](https://www.coursera.org/courseraplus)
- [Stanford CS336: Language Modeling from Scratch](https://cs336.stanford.edu/)
- [Elements of AI (University of Helsinki × MinnaLearn)](https://www.elementsofai.com/)
- [Elements of AI reaches one million learners (University of Helsinki, an earlier milestone; the site now says over 2 million)](https://www.helsinki.fi/en/news/artificial-intelligence/elements-ai-has-introduced-one-million-people-basics-artificial-intelligence)
- [MIT 6.S191: Introduction to Deep Learning](https://introtodeeplearning.com/)
- [CS50 AI course page (Harvard PLL, official hours and $299 verified certificate)](https://pll.harvard.edu/course/cs50s-introduction-artificial-intelligence-python)
- [Harvard CS50 guide: how to get a free certificate (Class Central)](https://www.classcentral.com/report/harvard-cs50-guide)
- [Introduction to Generative AI (Google Skills, free 45-minute course)](https://www.skills.google/course_templates/536)
- [Introduction to Generative AI (Coursera version, "Enroll for free")](https://www.coursera.org/learn/introduction-to-generative-ai)
- [Upskill for the holidays: No-cost AI training from Google Skills (Google Cloud Blog, 2025-12-02)](https://cloud.google.com/blog/topics/training-certifications/upskill-for-the-holidays-no-cost-ai-training-from-google-skills)
- [Understanding AI: AI tools, training, and skills (Google's official learning hub)](https://ai.google/learn-ai-skills)
- [Beginner: Introduction to Generative AI learning path (Google Skills)](https://www.skills.google/paths/118)
- [Is Google AI Essentials Worth It? (breakdown of free audit vs. paid certificate)](https://www.aiifi.ai/ai-course-guides/google-ai-essentials-worth-it)
- [AWS Skill Builder digital training and current subscription pricing](https://aws.amazon.com/training/digital)
- [AWS Training FAQ (free course count and the 17-language list)](https://aws.amazon.com/training/faqs)
- [Inside Kaggle's AI Agents Intensive Course with Google (official recap)](https://blog.google/innovation-and-ai/technology/developers-tools/ai-agents-intensive-recap)
- [Nexus Review: Kaggle 5-Day Gen AI Intensive Course (NYU, includes criticism)](https://nexus.sps.nyu.edu/post/nexus-review-kaggle-5-day-gen-ai-intensive-course-with-google)
- [Google AI Essentials Review (Amanda Claypool)](https://productivitystack.substack.com/p/google-ai-essentials-review)
- [What I learned from Anthropic's "Building with the Claude API" course (Erica Pisani)](https://www.ericapisani.dev/what-i-learned-from-anthropics-building-with-the-claude-api-course)
- [How to learn Claude Code for free with Anthropic's AI courses (ZDNET)](https://www.zdnet.com/article/how-to-learn-claude-code-with-free-anthropic-ai-courses-online)
- [csdiy.wiki — a bilingual index of public university CS courses](https://csdiy.wiki/)
- [PKUFlyingPig/cs-self-learning (the source and course entries behind csdiy.wiki)](https://github.com/PKUFlyingPig/cs-self-learning)
- [Kaggle Learn (16 free micro-courses)](https://www.kaggle.com/learn)
- [Scrimba AI Engineer Path](https://scrimba.com/)
- [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch)
- [microsoft/ai-agents-for-beginners](https://github.com/microsoft/ai-agents-for-beginners)
- [NirDiamant/RAG_Techniques](https://github.com/NirDiamant/RAG_Techniques)
- [stas00/ml-engineering](https://github.com/stas00/ml-engineering)
- [DataTalksClub/llm-zoomcamp](https://github.com/DataTalksClub/llm-zoomcamp)
- [datawhalechina/happy-llm (Simplified Chinese, building an LLM from zero, in Mandarin)](https://github.com/datawhalechina/happy-llm)
- [liguodongiot/llm-action (Simplified Chinese, LLM engineering, in Mandarin)](https://github.com/liguodongiot/llm-action)
- [Hung-yi Lee, Machine Learning 2026 Spring (NTU, in Mandarin)](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [Hung-yi Lee, Introduction to Generative AI and Machine Learning 2025 Fall (NTU, in Mandarin)](https://speech.ee.ntu.edu.tw/~hylee/GenAI-ML/2025-fall.php)
- [NVIDIA Deep Learning Institute](https://www.nvidia.com/en-us/training/)
- [AWS Skill Builder](https://skillbuilder.aws/)
