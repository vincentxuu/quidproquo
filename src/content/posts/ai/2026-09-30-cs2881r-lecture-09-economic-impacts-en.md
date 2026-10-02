---
title: "CS2881R L9: Early Evidence on AI, Jobs, and Productivity"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, ai-course, harvard, ai-safety, labor-market, productivity]
lang: en
series:
  name: "Reading Harvard CS2881R"
  order: 12
tldr: "Lecture 9 of Harvard CS 2881R brought in OpenAI chief economist Ronnie Chatterji and Stanford's Bharat Chandar. Using ADP payroll data, Chandar showed that workers aged 22–25 in AI-exposed occupations saw a 16% relative employment decline after controlling for firm-level shocks, while experienced workers did not; the adjustment shows up in headcount, not yet in pay. Both speakers kept repeating that aggregate employment shows no mass displacement yet, and that exposure is not replacement. There are no slides: the material is the recording and the reading list."
description: "A guide to Harvard CS 2881R (Fall 2025) Lecture 9, Economic Impacts of Foundation Models: Chatterji on how an economist works inside a frontier lab and why exposure is not replacement, Chandar on the six facts in Canaries in the Coal Mine and the alternative explanations it rules out, what each of the four pre-readings adds (Jones on AI in R&D, How People Use ChatGPT, Canaries, The A.I. Dilemma), the student experiment in the recording (model releases vs. Treasury yields, messiness of GDPval tasks), and Boaz Barak's Thoughts by a Non-Economist."
draft: false
glossary:
  - term: "AI exposure"
    definition: "A measure of how much of an occupation's task content AI can perform or speed up. The Canaries paper mainly uses the GPT exposure scores from Eloundou et al., plus the Anthropic Economic Index to separate automative from augmentative use."
    context: "Lecture 9 of CS2881R keeps stressing that high exposure means large task overlap, not that the job will disappear."
  - term: "Baumol's cost disease"
    definition: "Sectors with fast productivity growth get cheaper and may shrink as a share of GDP, while slow-growing sectors such as health care and education grow in share and employment, so overall growth is held back by the slow sectors."
    context: "Chandar used it in the Q&A to guess where employment might move after AI; Boaz's blog post uses it to explain why computers never lifted the GDP growth rate."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs2881r-lecture-09-economic-impacts)

> **Version note**: This post is based on the October 30 session on the [Harvard CS 2881R AI Safety](https://boazbk.github.io/mltheoryseminar/fall2025/) Fall 2025 site, the [Lecture 9 recording](https://youtu.be/4vQSMijp_M8) (YouTube title "Lecture 9: Economic Impacts of AI", about 2 h 32 min), the four pre-readings, and Boaz Barak's blog post [Thoughts by a Non-Economist on AI and Economics](https://windowsontheory.org/2025/11/04/thoughts-by-a-non-economist-on-ai-and-economics/), which the course homepage lists. I checked every fact against the official materials on 2026-09-30. Recording content comes from YouTube's auto-generated captions; names follow the course site's spelling. **Materials for this lecture**: the recording and reading list are public. The site lists no slides and its experiment field says "To be determined", though the recording does include a student experiment. The [series overview](/posts/ai/2026-09-30-cs2881r-course-overview-en) covers access grading and gaps for the whole course.

**Series**: previous [L7: Capabilities vs. Safety](/posts/ai/2026-09-30-cs2881r-lecture-07-capabilities-vs-safety-en) | next [L11: Chatbots, Emotional Reliance, and Mental Health](/posts/ai/2026-09-30-cs2881r-lecture-11-emotional-reliance-en) | [Series overview](/posts/ai/2026-09-30-cs2881r-course-overview-en)

The [previous post](/posts/ai/2026-09-30-cs2881r-lecture-07-capabilities-vs-safety-en) ended on measuring capability: METR's doubling task horizons and GDPval. This one goes a layer down. Once capability grows, what can we actually see in the labor market today?

Boaz Barak framed the session in one sentence. An AI safety course cares whether AI's effect on the world is good or bad, the economic side is among the most important pieces, and the course would be incomplete without it. Then he handed over to two guests: one looking from inside OpenAI, one looking at administrative data.

## What this lecture offers

| Material | Contents | Status |
|---|---|---|
| [Recording](https://youtu.be/4vQSMijp_M8) | Chatterji talk (about 20 min) → Chandar talk → student experiment → joint Q&A | Public |
| Site bullets | Labor substitution & productivity effects; Inequality & policy responses | Public |
| 4 pre-readings | See "What each pre-reading adds" below | All public PDFs |
| 5 further readings | Goldman Sachs, Generative AI at Work, Acemoglu & Restrepo, GPTs are GPTs, Roodman | Linked on the site; not covered in detail here |
| Slides | Not listed on the site | None |

## Chatterji: what an economist does inside a frontier lab

In the recording Ronnie Chatterji introduces himself as OpenAI's first chief economist. He also teaches at Duke's business school and led implementation of the CHIPS and Science Act in the federal government. OpenAI told him to write his own job description. He settled on three things: peer-review-grade empirical research, treating organizations and enterprises as the main actors, and treating policy and the "non-market environment" as part of strategy.

His first point for students: **the path to AGI runs through organizations**. Electricity, the steam engine, and the internet only changed the economy once firms adopted them, and AI is early in that process.

His second point is the line repeated most in the whole session: **if your job is exposed to AI, that does not mean AI will take your job**. He gave two reasons. First, AI being able to do a task does not mean institutions allow it; AI might write his syllabus or teach his class, but Duke would have to change its rules first. Second, task lists change. When AI takes some tasks, people add new ones. His father was also an economist, and the tasks he did in 1985 look nothing like Chatterji's today.

He also explained why economists' GDP estimates for AI vary so much. Technology history often shows divergence before convergence. Model capabilities change so fast that today's paper may be stale tomorrow. Most important is your "theory of the case": picture AI five years out as a chat window and you will land low; picture it as intelligence applied to the hardest problems and you will land high.

He closed on what makes AI different from past technologies (speed of adoption, speed of benchmark saturation, falling inference costs) and argued that AI safety is interdisciplinary: economists, sociologists, psychologists, and political scientists need to work with people who understand the models.

## Chandar: six facts from Canaries in the Coal Mine

Bharat Chandar presented [Canaries in the Coal Mine?](https://digitaleconomy.stanford.edu/wp-content/uploads/2025/08/Canaries_BrynjolfssonChandarChen.pdf), written with Erik Brynjolfsson and Ruyu Chen. He started with history. In the 1500s William Lee invented the stocking frame and was denied a patent twice, precisely out of fear it would put the poor out of work. Centuries later, British GDP per capita had risen enormously and unemployment had not spiraled out of control.

He laid out two mechanisms. New work appears as old work is displaced; he cited an estimate from David Autor and co-authors that about 60% of today's employment is in work that did not exist in 1940. In recent decades that new work has clustered at the two ends, highly paid professional jobs and low-paid service jobs, and the widening education gap drove up inequality. AI could flip this, because highly exposed occupations skew toward high pay and high education. Autor has even written that AI could help rebuild the middle class.

The problem is data. Once you slice the government's Current Population Survey by occupation and age group, you may be down to a handful of respondents. The paper's advantage is monthly payroll records from ADP, the largest US payroll software provider, covering millions of workers through September 2025. The paper states six facts:

| Fact | Content |
|---|---|
| 1 | Employment for young workers in AI-exposed occupations has declined. Software developers aged 22–25 were down nearly 20% from their late-2022 peak by September 2025 |
| 2 | Overall employment keeps growing, but growth for young workers has stalled, dragged down by exposed occupations |
| 3 | Entry-level employment fell where AI automates work; changes are muted where AI augments it |
| 4 | After controlling for firm-by-time shocks, young workers in exposed jobs still show a 16% relative employment decline |
| 5 | The adjustment shows up in employment, not yet in compensation |
| 6 | Results largely hold under alternative sample constructions |

In the recording Chandar put a caveat on Fact 1. Late 2022 was also when tech faced rate hikes and pandemic over-hiring, so the software developer line cannot all be pinned on AI. He said he trusts the within-firm comparison in Fact 4 more, and that curve declines far more gradually.

For Fact 6 he walked through the alternatives they ruled out: excluding the tech sector, excluding all computer occupations, keeping only non-teleworkable jobs (to rule out return-to-office and outsourcing), splitting by college degree, splitting by gender, including part-time and temporary workers, and a new occupational interest-rate-exposure analysis. On the last one he explained that interest-rate exposure and AI exposure are actually negatively correlated. Construction is very rate-sensitive and barely touched by AI.

He added a contrast case. Health aides (nursing, psychiatric, and home health aides) are a low-exposure occupation, and young workers there saw faster employment growth than older workers. One more detail is worth keeping: for exposed jobs that do not need a college degree, the divergence extends up to ages 26–34. His guess is that what young people learn in school overlaps heavily with model training data, while on-the-job experience builds knowledge that is harder to write down.

His summary was restrained. **AI's effect on aggregate employment is probably small right now, but it may be reducing hiring for AI-exposed entry-level jobs.**

### Three challenges from the Q&A

Students asked three questions on the spot, and they happen to be the right ones to ask of the paper:

- **Supply side**: are young people steering away from exposed jobs and into less exposed ones? Chandar said data on this is very thin. The number of computer science majors he has seen did not clearly fall through about 2023, so he doubts this is the main driver.
- **Timing**: models were weak in September 2022, so why does the curve drop then? He named three factors: tools like GitHub Copilot existed before ChatGPT, employers may have anticipated future use, and software had its own non-AI shocks.
- **Sample bias**: does ADP's client base skew toward certain firms? He allowed it might matter for software developers, but less so for jobs like customer service.

## What each pre-reading adds

| Pre-reading | Role in this lecture |
|---|---|
| [Jones, B. F.: Artificial Intelligence in Research and Development](https://www.kellogg.northwestern.edu/faculty/jones-ben/htm/Artificial_Intelligence_in_Research_and_Development.pdf) (Sept 2025 draft) | Puts AI into the R&D production function. It names three decisive features: the share of research tasks AI can perform, AI's productivity at those tasks, and the strength of bottlenecks in idea production |
| [Chatterji et al.: How People Use ChatGPT](https://cdn.openai.com/pdf/a253471f-8260-40c6-a2cc-aa93fe9f142e/economic-research-chatgpt-usage-paper.pdf) (Sept 2025) | Usage data. About 700 million users and 18 billion weekly messages by July 2025; non-work use rose from 53% to over 70%; Practical Guidance, Seeking Information, and Writing together account for nearly 80% |
| [Brynjolfsson, Chandar & Chen: Canaries in the Coal Mine?](https://digitaleconomy.stanford.edu/wp-content/uploads/2025/08/Canaries_BrynjolfssonChandarChen.pdf) | Employment data, i.e. Chandar's talk. The course link now points to the November 13, 2025 revision |
| [Jones, C. I.: The A.I. Dilemma: Growth versus Existential Risk](https://web.stanford.edu/~chadj/existentialrisk.pdf) (AER: Insights 2024) | Puts growth and existential risk in one model. The answer hinges on the curvature of utility: with log utility the model accepts sizable extinction risk for large consumption gains, with a risk-aversion coefficient of 2 or more it turns conservative, and AI that extends life expectancy is the key exception |

The fourth reading is where this lecture ties most tightly to the rest of an AI safety course. It does not ask whether AI brings growth. It asks how much risk we should accept for that growth, and the answer turns on a parameter economists rarely think about.

Chatterji came back to How People Use ChatGPT in the Q&A. Many people found "users mostly ask for advice" underwhelming; he argued that advice is the foundation of human decisions, and decisions are the foundation of the economy. He then raised a risk nobody has studied yet: when a billion people get money and relationship advice from the same model, the resulting homogenization could be culturally dispiriting and could also become a systemic risk.

## Boaz's "non-economist" notes

The course homepage's related reading includes [Thoughts by a Non-Economist on AI and Economics](https://windowsontheory.org/2025/11/04/thoughts-by-a-non-economist-on-ai-and-economics/), which Boaz posted a few days after this session (2025-11-04). Bharat Chandar and both Joneses are in the acknowledgements. It works as a follow-up to the lecture:

- He splits the uncertainty in METR's task-horizon curve into **intercept** and **slope**. The gap between benchmarks and real-world work, which he calls a messiness tax, mainly shifts the intercept in his view, not necessarily the slope.
- US GDP per capita has grown at roughly 2% a year for 150 years. Electrification, the combustion engine, computers, and the internet never changed that line. His "trillion dollar question" is whether AI breaks it.
- Using B. Jones's harmonic-mean model, he shows that the share of non-automatable tasks ρ caps the productivity gain at 1/ρ. Transformative growth needs **ρ to shrink and AI productivity λ to grow; either one stuck keeps productivity stuck**.
- He admits the reasoning is aggressive. It tracks capability and ignores diffusion, and automation over the past 80 years has been linear; if AI makes the unautomated share fall exponentially, that is a break with history.

His closing line: whether AI brings unprecedented growth depends on whether its exponential capability gains make the share of unautomated tasks fall at an exponential rate too.

## Student experiment: model releases and GDPval messiness

The site's experiment field says "To be determined", but the recording includes a student group presenting in two parts.

**Model releases and long-term Treasury yields.** They treated major AI releases as events and computed the cumulative abnormal change in 10- and 30-year yields over five trading days. With nine early OpenAI releases, yields showed a significant negative response. Expanding to 19 releases, the effect nearly vanished. Digging in, they found the early significance mostly came from macro events on the same days: a Fed chair speech on fighting inflation on ChatGPT's launch day, and the GPT-4 release two days after the Silicon Valley Bank crisis. Their conclusion was that macro events dominated yields and the original finding did not hold.

**Messiness of GDPval tasks.** From GDPval's 220 public tasks they picked 70 (professional and technical services, government, retail). GPT-4o mini scored each task on METR's 16 messiness factors, then GPT-4o mini, GPT-5 mini, and GPT-5 attempted the tasks and a model graded the outputs. What they reported:

- 96% of tasks require reading input files, producing output files, or executing code
- Messiness scores clustered at 10 and 12, suggesting the factors are too general
- Newer models scored higher, but the best model still averaged only 58
- Models' estimates of their own completion time were far off, and switching the unit from minutes to seconds changed results the most

Chatterji's feedback raised a good question. Is messiness a property of the task, or of workflows humans designed for themselves? A workflow designed from scratch for AI might be much cleaner, which could mean startups adopt AI more easily than large firms.

## Q&A: where the speakers took a position

The joint Q&A ran about an hour. Below are only the questions tied to AI safety where the speakers gave a clear view.

**What happens if 10–20% of people lose their jobs?** Drawing on his time in government during the financial crisis and COVID, Chatterji said automatic stabilizers such as unemployment insurance and SNAP already exist; crisis economics is not a blank page. He also asked people to calibrate magnitudes. Headline layoff numbers add up to far less unemployment than people think, and reaching Great Depression levels would need a story where AI quickly replaces teachers and nurses. Chandar added ideas beyond UBI: loosening occupational licensing so people can switch careers more easily, and using AI to speed up retraining.

**Would mass unemployment come with mass growth?** Boaz argued AI can hardly cause mass unemployment without also causing huge growth. Chandar pointed to a contrasting view: Acemoglu's work finds that manufacturing robots raised productivity only slightly, yet enough for firms to stop hiring workers.

**What institutional innovation is needed?** Chatterji listed questions he thinks nobody has worked out: a legal framework for agents operating in the economy (under export controls, where is an agent "located"?), and how the R&D tax credit works once AI automates R&D. Chandar cited Acemoglu and co-authors' argument that the current tax system may over-reward technologies that replace labor.

**Why do some countries worry less about AI risk?** Both called it speculation. Chatterji pointed to Korea and Japan, where demographics make "AI replacing labor" less alarming. Chandar suggested that lower-income countries may accept more risk for faster growth. That loops back to the utility curvature in the fourth pre-reading.

## What this lecture cannot yet claim

Pulling the speakers' caveats together:

- Canaries is correlational evidence plus a series of exclusions, not causal identification; Chandar himself said the software developer line cannot all be blamed on AI
- Month-to-month bumps should not be over-read; Chandar said data updated through September 2025 shows no reversal
- Numbers on AI adoption inside firms contradict each other; Chandar contrasted an executive survey with Census Bureau figures
- Both speakers said there is almost no data on AI's effect on education and career choices

## How to study it

1. Read the six facts and the robustness section of Canaries first, then watch Chandar's part from 0:28. With the figures already in your head, his caveats mean something.
2. When reading C. I. Jones's The A.I. Dilemma, hold onto one thing: why the conclusion flips when the risk-aversion coefficient moves from 1 to 2.
3. After Boaz's blog post, go back to Chatterji's "theory of the case". Which end do Boaz's assumptions sit on?

One thing to do tonight: open the Canaries paper, find the appendix figure behind Fact 2, and look at the 22–25 and 35–49 lines in the top two exposure quintiles. That one figure shows how "overall employment is fine" and "young workers in exposed jobs are stuck" can both be true.

## Further reading

- How capability is measured and how GDPval is built: [L7: Capabilities vs. Safety](/posts/ai/2026-09-30-cs2881r-lecture-07-capabilities-vs-safety-en), [L12: AI 2035 and GDPval](/posts/ai/2026-09-30-cs2881r-lecture-12-ai-2035-en)
- Timelines for AI doing AI R&D: [L6: Recursive Self-Improvement](/posts/ai/2026-09-30-cs2881r-lecture-06-recursive-self-improvement-en)
- Course map and A0–A3 grading: [Global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)

## References

- [Harvard CS 2881R AI Safety, Fall 2025 course site](https://boazbk.github.io/mltheoryseminar/fall2025/) — October 30 session, guest list, site bullets, pre-readings and further readings, experiment field "To be determined"
- [Lecture 9: Economic Impacts of AI (recording)](https://youtu.be/4vQSMijp_M8) — Chatterji and Chandar talks, student experiment, joint Q&A
- [Brynjolfsson, Chandar & Chen: Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence](https://digitaleconomy.stanford.edu/wp-content/uploads/2025/08/Canaries_BrynjolfssonChandarChen.pdf) — six facts, 16% relative decline, nearly 20% decline for young software developers, robustness
- [Chatterji et al.: How People Use ChatGPT](https://cdn.openai.com/pdf/a253471f-8260-40c6-a2cc-aa93fe9f142e/economic-research-chatgpt-usage-paper.pdf) — scale of use, work vs. non-work shares, top three topics
- [Jones, B. F.: Artificial Intelligence in Research and Development](https://www.kellogg.northwestern.edu/faculty/jones-ben/htm/Artificial_Intelligence_in_Research_and_Development.pdf) — three determinants in the R&D production function
- [Jones, C. I.: The A.I. Dilemma: Growth versus Existential Risk](https://web.stanford.edu/~chadj/existentialrisk.pdf) — utility curvature and the existential-risk trade-off
- [Boaz Barak: Thoughts by a Non-Economist on AI and Economics](https://windowsontheory.org/2025/11/04/thoughts-by-a-non-economist-on-ai-and-economics/) — intercept vs. slope, the 2% growth trend, the harmonic-mean model
