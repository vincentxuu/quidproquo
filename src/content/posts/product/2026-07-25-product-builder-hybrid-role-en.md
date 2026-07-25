---
title: "Product Builder vs PM: What the Role Is and How to Get There"
date: 2026-07-25
type: deep-dive
tldr: "A Product Builder runs the full loop from problem discovery to design to build, alone. The core difference from a PM: PMs influence execution through authority, Product Builders influence it by directly shipping working products. LinkedIn replaced its APM program with an Associate Product Builder track, and PayFit defined the role back in 2019."
category: product
tags: [product-builder, product-management, ai, vibe-coding, career]
lang: en
description: "What a Product Builder is, how the role differs from a Product Manager, the skills it takes, and how PMs, designers, and engineers each transition into it. With sourced examples from LinkedIn, Walmart, and PayFit, the skeptical case from Roman Pichler and SVPG, and the Builder PM / Integrator PM fork."
glossary:
  - term: "vibe coding"
    aliases: ["Vibe Coding"]
    definition: "Describing what you want in natural language and letting AI generate the implementation, rather than writing code line by line — the human judges whether the result is right. Andrej Karpathy coined the term in February 2025."
    advanced: "In practice the bottleneck is verification, not generation: models keep improving at producing code that runs while barely improving at producing code that is secure, so review and testing cost lands back on the human."
    context: "Common in discussions of AI coding tools like Claude Code, Cursor, Lovable, and Replit."
  - term: "APM"
    aliases: ["Associate Product Manager"]
    definition: "A rotational program large tech companies use to train entry-level product managers, typically hiring new graduates who rotate through several product teams over two years. Google, LinkedIn, and Meta have all run versions of it."
    advanced: "LinkedIn ended its APM program in 2026 and replaced it with an Associate Product Builder (APB) track, shifting the training focus from coordination and roadmaps toward building things directly."
    context: "Comes up when discussing entry points into product careers and the Product Builder transition."
faq:
  - q: "What is a Product Builder?"
    a: "A Product Builder is someone who can take an idea from concept to a working product with minimal dependency on other teams. They combine product judgement, basic design ability, and enough hands-on building skill with AI tools to run the full loop — discover a problem, design a solution, build and validate it — without handoffs between PM, design, and engineering."
  - q: "How is a Product Builder different from a Product Manager?"
    a: "The core difference is where influence comes from. PMs influence team execution through authority, and their deliverable is a PRD or roadmap. Product Builders contribute output directly through capability, and their deliverable is a working prototype or shipped feature. A PM has to convince a team to build it; a Product Builder can build it first and discuss afterward."
  - q: "What skills does a Product Builder need?"
    a: "Four areas: technical (basic Python/JavaScript, API integration, effective AI pair programming), design (interactive prototypes via v0, Lovable, Claude Design, or Claude Artifacts, judging UX in working code), product (user research, SQL and data analysis, hypothesis validation), and AI literacy (prompt engineering, judging the limits of AI output). The point is not mastery of each — it is knowing each well enough to move independently."
  - q: "Will Product Builders replace PMs, designers, and engineers?"
    a: "No. Specialization remains irreplaceable as product complexity grows, when large-scale system architecture is needed, or when deep user research matters. Product Builders fit best in early product exploration, internal tools, and fast feature iteration — the validate-before-you-commit stage."
  - q: "Do Product Builder job postings at different companies mean the same thing?"
    a: "No. LinkedIn's Associate Product Builder is entry-level training that replaced its APM program and hires people without formal product experience. Mews' Product Builder is a senior engineering track requiring deep technical ability. Walmart's Agent Developer explicitly does not require a technical background, using low-code tooling so operations staff can build agents themselves. PayFit's Product Builder has existed since 2019 and is fundamentally about configuring labor-law rules on its in-house JetLang low-code platform — unrelated to the AI wave. Asking which department a role grew out of tells you more than the title does."
  - q: "What are the criticisms and risks of the Product Builder role?"
    a: "Three main ones. First, the loss of distributed intelligence that Roman Pichler describes — when one person does all the work, fewer expert perspectives are involved, so you move faster on narrower assumptions. Second, SVPG's observation that teams are delivering faster with AI while their outcomes are not improving: what accelerates is output, not judgement. Third, the practical fallout of unclear boundaries — in Userpilot's 2026 survey, 46.7% of PMs worried about being asked to do too much with too little support, and 31.6% worried that doing everything means doing nothing particularly well."
  - q: "How does a PM start transitioning into a Product Builder role?"
    a: "Start by filling the gap you have. PMs: pick one backlog problem, build 5 approaches in Claude Code or Codex at 30 minutes each, kill 4, keep 1 — you're learning to replace arguments with running software. Designers: use v0, Claude Design, or Claude Artifacts to turn designs into interactive prototypes and judge UX at the working-code level, not in static Figma screenshots. Engineers: do 3 user interviews this week, watch 5 session recordings, then own one user-facing metric. Pick one small, real problem and take it end to end — that beats reading ten articles about it."
draft: false
---

🌏 [中文版](/posts/product/2026-07-25-product-builder-hybrid-role)

Anthropic's Boris Cherny, the creator of Claude Code, said something worth sitting with:

> Today coding is practically solved... We're going to start to see the title of 'software engineer' go away. It's just going to be 'builder' or 'product manager.'

This isn't a prediction. It's already happening.

In June 2026, Boris unpacked that statement into a concrete framework. [Observing how the Claude Code team actually works](https://x.com/bcherny/status/2071379474277613732), he found that roles aren't divided by job title — they operate along five archetypes:

> 1. **Prototyper**: constantly generates brand-new ideas; most won't ship
> 2. **Builder**: quickly turns a surviving prototype into production-grade product or infrastructure
> 3. **Sweeper**: cleans up the UI, simplifies the code and system, unships unnecessary features, optimizes performance
> 4. **Grower**: takes a shipped product and iterates on it to improve Product-Market Fit
> 5. **Maintainer**: owns a mature system's security, reliability, speed, and efficiency

Boris emphasized that many people span 2–3 archetypes, and these archetypes are **not tied to job function** — at Anthropic, some designers are Prototypers, some are Sweepers; the same spread appears among engineers, PMs, and data scientists. He also mapped archetype mixes to product stages: pre-PMF needs heavy 1+2+3, growth needs 2+3+4 plus some 5, and mature products run on 3+4+5 with some 2.

[Aakash Gupta's follow-up analysis](https://x.com/aakashgupta/status/2071692050714501494) added the cultural context that makes this work at Anthropic: everyone shares the title Member of Technical Staff, they don't write PRDs — they build first, most prototypes are expected to die (the Claude Code spinner animation went through 50–100 iterations with ~80% never shipping), Claude Code reviews every PR before a human does the final check, and there's a framed copy of [The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html) on the wall where the team sits.

The tweet accumulated over 3 million views and sparked extensive discussion across Chinese and English-language communities (see references at the end). This article approaches from the broader "Product Builder" role and places Boris's five archetypes within the industry context.

## What Is a Product Builder

A Product Builder is someone who can take an idea from concept to a working product with minimal dependency on other teams. Not a PM, not a designer, not an engineer — but capable of doing all three.

Traditional product development is an assembly line: PM writes the spec → Designer produces mockups → Dev implements → QA signs off. Each handoff carries waiting time and communication overhead. Product Builders compress this pipeline into a loop — one person who can rapidly validate assumptions and iterate on solutions.

The core distinction: **PMs influence team execution through authority; Product Builders directly contribute output through capability.** A PM's deliverable is a PRD or roadmap. A Product Builder's deliverable is a working prototype or feature.

## Why Now

Two words: **AI**.

In February 2025, Andrej Karpathy introduced the concept of vibe coding — instead of writing code line by line, you describe what you want in natural language and let AI generate it. This directly lowered the barrier to building things. For the concrete patterns this way of working has settled into, see [the 190 patterns in the Encyclopedia of Agentic Coding Patterns](/posts/ai/2026-04-18-encyclopedia-of-agentic-coding-patterns-en).

A McKinsey experiment with 40 product managers found that generative AI raised **individual PM productivity by 40%** — while product time-to-market improved by only **5%** in the same study.

That gap is worth sitting with. Faster individual output does not mean a faster product line. What usually blocks a release is not "we can't build it" — it is decision-making, alignment, and validation. That is precisely the stretch the Product Builder role claims to collapse. It is also a warning: drop AI into an unchanged process and the gains get eaten by the handoffs.

Adoption is slower than the headlines suggest, too. The widely quoted "78%" from GitLab's 2024 Global DevSecOps Report covers respondents **already using AI or planning to within two years**; in the same report, only 26% said they had actually implemented it.

When tools like Claude Code, Cursor, Lovable, and Replit let one person go from idea to working prototype in a few hours, the traditional trio of PM + Designer + Dev is no longer the only option.

LogRocket ran the numbers: a traditional three-person product team costs roughly $1.2–1.5M per year, and 50–60% of shipped features underperform expectations. If a single Product Builder can validate assumptions before committing full engineering resources, avoiding just five unnecessary features per year saves over $500K.

The math is persuasive, but it only counts the savings. At least three costs never make it into the denominator:

**One: the security and maintenance cost of AI output.** The calculation assumes what a Product Builder ships counts cleanly as output. But as covered below, Veracode measured OWASP Top 10 flaws in 45% of AI-generated code. Some of those saved engineering weeks come back as security review and technical debt.

**Two: the expected cost of worse validation.** The math assumes one person validates as accurately as three. Strip out the design and engineering perspectives and the assumptions themselves get narrower — you validate the wrong problem faster, and the savings turn into the cost of going the wrong direction.

**Three: outcomes may not improve at all.** SVPG's observation is the most direct version of this: teams deliver faster with AI and their outcomes do not improve. If what accelerates is output rather than judgement, the $500K is saving the cost of building the wrong thing — or forfeiting the chance to build the right one. The math does not answer which.

The honest financial argument for this model is not "one person is cheaper than three." It is "**under what conditions is one person's judgement not worse than three people's**." That is an operating question, not a headcount question.

## Who's Already Doing This

This isn't experimentation at small companies — large organizations are already moving:

- **LinkedIn** ended its long-running APM (Associate Product Manager) program and stood up a separate **Associate Product Builder (APB)** track, training generalists who span product, design, and engineering. CPO Tomer Cohen's framing on Lenny's Podcast: they intend to teach them to code, design, and PM at LinkedIn
- **Walmart** opened **Agent Developer** roles — which the company calls its first "biz/tech" position — using low-code and natural-language interfaces so one person can design and deploy agents without a team or a technical background. Its chief people officer put it this way: a year ago we would not have had any dedicated agent builders, today we do
- **Meta** PMs have started calling themselves "AI Builders"
- **PayFit** defined the Product Builder role as far back as 2019, combining PM, UX, and Dev capabilities, using their in-house low-code language JetLang to build features directly
- **SoFi** posted openings carrying the Product Builder name in early 2026 (postings close — treat this as evidence the title has entered formal job architecture, not as live hiring information)

## One Title, Four Different Jobs

Line these postings up side by side and something rarely pointed out becomes obvious: **"Product Builder" does not describe the same role across companies.**

| Company | Formal title | Where the role grew from | Technical background required | Externally hired | Published salary band (USD) |
|---|---|---|---|---|---|
| LinkedIn | Associate Product Builder (APB) | Early-career training, replacing the APM program | Hands-on, but not an engineering expert | Yes (Mountain View, hybrid) | $126k–$207k |
| Mews | Product Builder | **Senior engineers moving upstream** — an engineering track | Yes, explicitly framed as high-agency engineers | Yes | Not published |
| Walmart | Agent Developer | Internal operations, low-code / natural-language tooling | **Not required** | Yes (Bentonville) | $110k–$220k |
| PayFit | Product Builder | Exists since 2019, domain configuration via JetLang | Low-code platform, not conventional engineering | Yes (including a 2026 internship) | Not published |
| SoFi | Product Builder (Sandbox) | AI-tooling oriented | LLM and AI coding tool proficiency | Yes (San Francisco) | Not published |
| Meta | No formal title | Employees self-describe as "AI Builder" | — | — | — |

The contradiction sits in the middle two columns:

- **LinkedIn's** is entry-level training, hiring people with no formal product experience yet
- **Mews'** is a senior engineering track — their own framing is that it covers not just *how* things get built but *what* and *why*
- **Walmart's** explicitly does not require a technical background, using low-code tooling so operations people can build agents themselves
- **PayFit's** predates ChatGPT by four years and is fundamentally about configuring labor-law rules on an in-house low-code platform — **it has nothing to do with the AI wave**

So a job posting titled "Product Builder" cannot be read with one set of expectations. It might ask a PM to learn to code, ask a senior engineer to own product decisions, or have nothing to do with AI at all. **Asking which department the role grew out of tells you more than the title does.**

On market rate: ZipRecruiter puts the US average for product builder at $159,405, with most between $141k and $197k. Treat that loosely — when one title covers four different jobs, the average means very little.

Khan Academy's Sal Khan put it plainly:

> The people who are just waiting to get the spec... they're going to have trouble. But the people who are like, 'I'm going to go meet with the customer, and I can build it,' I think they're going to do great.

## What Skills Does It Take

Product Builders don't need to master everything — just know each domain well enough to move independently:

**Technical**: Basic Python / JavaScript, API integration, ability to write serviceable code with AI assistance. Not a senior engineer, but capable of AI pair programming.

**Design**: Using v0, Lovable, Claude Design, or Claude Artifacts to produce interactive prototypes, and judging UX at the working-code level — not in static mockups.

**Product**: User research, data analysis (SQL), hypothesis validation, prioritization.

**AI literacy**: Prompt engineering, understanding the capabilities and limitations of AI tools.

That last one is not a bonus, it is the threshold. Veracode's 2025 GenAI Code Security Report tested over 100 models and found that **45% of generated code introduced an OWASP Top 10 security flaw**. Java failed 72% of the time; XSS went undefended in 86% of the relevant samples. The most telling finding: models kept getting better at producing code that *runs*, and barely improved at producing code that is *secure*.

In other words, a Product Builder's technical judgment is not there to write faster — it is there to notice what the AI got wrong. This is the most underestimated cost of the role.

## What the Skeptics Say

Everything above is the upside case. The role also carries real costs, and the people raising objections are not outsiders.

Roman Pichler's rebuttal deserves the most serious attention. His point is not "one person will burn out." It is that **when one person can do all the work, distributed intelligence disappears from the process**. The fewer disciplines involved early, the more you are simply moving faster on narrower assumptions. Fast validation only pays off if the assumptions are good — and assumption quality usually comes from friction between different perspectives. That friction is exactly what gets compressed away.

SVPG's observation is harder to argue with. In "AI Product Management 2 Years In," Marty Cagan notes that the teams they see are genuinely delivering faster with AI — and their **outcomes are not improving**. That points at the same thing the McKinsey numbers did: 40% individual productivity, 5% time-to-market. What accelerates is output, not judgement.

Practitioners have their own doubts. In Userpilot's 2026 survey:

- **46.7%** worry about being asked to do too much with too little support
- **37.3%** fear ending up in a state of perpetual role confusion
- **31.6%** worry that doing everything means doing nothing particularly well

There is also a practical side effect: without clear boundaries, a Product Builder easily steps into design and engineering territory, undermining teammates' autonomy until nobody is sure who owns what. The confusion bought with that speed sometimes costs more than the time it saved.

## The More Likely Outcome: The Role Splits in Two

A better description of what is actually happening than "every PM must become a builder" is this: **the role is forking**.

- **Builder PM**: AI-native, prototypes independently, low dependency on other teams. Fits early exploration, internal tools, fast iteration
- **Integrator PM**: strong at alignment and communication, keeps marketing, sales, and product pointed the same direction. Fits complex organizations and scaling stages

Both are growing. Neither is replacing the other. What is actually getting squeezed is the middle — the role that only moves information, writes specs, and maintains roadmaps, neither building nor owning alignment. That is the real situation of the "non-creator PM" Cagan warns about.

So the question is not "should I become a Product Builder," but "which side am I moving toward, and can I get deep enough on it."

## When This Model Actually Fits

When product complexity increases, when you need large-scale system architecture, or when deep user research is required, specialized roles remain irreplaceable. Product Builders are best suited for:

- Early-stage products that need rapid exploration and validation
- Internal tools that don't require large-scale engineering investment
- Feature iteration that calls for rapid experimentation and data-driven decisions
- Any "validate before committing" phase

LinkedIn's Aneesh Raman said it well:

> The full stack builder takes what would've been days or weeks as a conveyor belt between design, product, engineering... and gives it to an individual with these tools.

## What the Chinese-Language Discussion Looks Like

For readers who also follow the Traditional Chinese product community, this topic is already well covered there — and its slant is worth noting. [Peter Su](https://petersuppi.substack.com/p/ai-product-builder) treats the role as the natural result of AI collapsing the cost of turning an idea into something concrete; [AAPD](https://academy.aapd.com.tw/events/ai-productbuilder) in Taiwan already runs a course on building Product Builder skills, approached from a designer's perspective; [CMoney](https://blogs.cmoney.tw/ai-product-team) writes from hands-on AI Lab experience, arguing that what separates people is not skills but problem-framing and user understanding; and [Vista](https://www.vista.tw/blog/pm-beautiful-sorrow-ai-era) focuses on PM anxiety itself.

One observation: these pieces lean consistently optimistic, treating the role as opportunity rather than trade-off. The counter-arguments in the section above — Pichler on distributed intelligence, SVPG on outcomes — are almost absent from that conversation.

## If You Want to Move in This Direction

Whether you're currently a PM, designer, or engineer, the path is the same: **fill in the gaps you're missing**. Worth noting: LinkedIn's APB program explicitly welcomes a career pivot — no formal product experience required, open to people already working full time. That alone says the entry point to this career path is wider than traditional PM.

PM → Pick one real problem from your backlog. Build 5 different approaches in Claude Code or Codex, 30 minutes each. Kill 4, keep 1. This is Prototyper muscle memory. You're not learning to code — you're learning to replace meeting-room arguments with something that runs.

Designer → Use v0, Lovable, Claude Design, or Claude Artifacts to turn your designs directly into interactive prototypes. Judge UX at the working-code level — does the layout hold up, does the flow feel right, is the feedback loop fast enough? Anthropic's designers already submit PRs. Static Figma handoffs are no longer the deliverable.

Engineer → Do 3 fifteen-minute user interviews this week. Watch 5 session recordings. Then claim ownership of one user-facing metric. Not "spend time understanding users" — turn customer signal into a number you check daily.

Product Builder isn't a job title — it's a way of working. In an era where AI enables everyone to do more, people who can independently move from problem to solution will become increasingly valuable.

The smallest viable starting move: pick one small tool you'd genuinely use yourself and take it all the way to production. This blog came about exactly that way — the full path from stack selection to deployment is written up in [Building a Low-Friction Blog from Scratch with Astro + Cloudflare Workers](/posts/product/2026-03-12-quidproquo-blog-from-scratch-en). For the same builder mindset applied at platform-strategy scale, see [Digital Ecosystem Research: From LINE and Shopify to Taiwan's MarTech](/posts/product/2026-04-02-digital-ecosystem-cresclab-research-en).

---

## Changelog

- **2026-07-25**: Retitled and rewrote the description to focus on the Product Builder vs PM distinction; added an FAQ section and internal further-reading links.
- **2026-07-25**: Three corrections after fact-checking. GitLab's 78% covers "already using **or** planning within two years" — actual implementation was 26%, where this post had said "already using." LinkedIn **ended** its APM program and created a separate Associate Product Builder track rather than renaming it. McKinsey's 40% refers to individual PM productivity (n=40), now presented alongside the 5% time-to-market figure it sits in tension with. Also replaced the overly wide 25-70% AI-code-security range with Veracode's 2025 measurements, and cut the low-information "A Day in the Life" section.
- **2026-07-25**: Corrected the Walmart item. The formal title is **Agent Developer** — which Walmart calls its first biz/tech role — not "Agent Builder," which was its chief people officer's descriptive phrasing. The original claim that the role was staffed entirely by internal employees does not hold either; it is publicly posted.
- **2026-07-25**: Added a full counter-argument section (Pichler on distributed intelligence, SVPG on outcomes failing to improve, Userpilot's 2026 practitioner-concern data) and a new section on the Builder PM / Integrator PM fork, replacing the original single narrative that every PM should become a builder.
- **2026-07-25**: Added three pieces of original material. A six-company comparison table showing that the same title means entirely different jobs at LinkedIn (entry-level training), Mews (senior engineering track), Walmart (non-technical operations), and PayFit (low-code domain configuration since 2019). A critique of LogRocket's cost math covering three costs it omits. And a survey of the Traditional Chinese discussion and its optimistic slant.

---

## References

- ['Engineer' is so 2025. In AI land, everyone's a 'builder' now - SF Standard](https://sfstandard.com/2026/03/05/engineer-2025-ai-land-everyone-s-builder-now/)
- [Why product managers must become product builders in 2026 - LogRocket](https://blog.logrocket.com/product-management/product-builders-future-product-management/)
- [AI is turning product managers into builders - Fast Company](https://www.fastcompany.com/91452231/ai-is-turning-product-managers-into-builders)
- [What It's Like to Be a Product Builder in 2025 - CuriousCore](https://curiouscore.com/resource/what-its-like-to-be-a-product-builder-in-2025/)
- [The Vibe Coding Imperative for Product Managers - ACM](https://cacm.acm.org/blogcacm/the-vibe-coding-imperative-for-product-managers/)
- [Introducing the Product Builder - PayFit](https://backstage.payfit.com/introducing-the-product-builder/)
- [The Era of the Product Creator - SVPG](https://www.svpg.com/the-era-of-the-product-creator/) — Note: Cagan and Baxley argue here that the PM role **remains necessary** and should work shoulder-to-shoulder with designers and engineers daily; their warning is aimed at non-creator PMs. That sits in tension with this post's framing of one person compressing the whole line, and is listed for contrast
- [What It Means to Be a Product Builder at Mews - Mews Developers](https://developers.mews.com/what-it-means-to-be-a-product-builder-at-mews/) — one of the few companies placing the role explicitly on an engineering track
- [Comment le métier de Product builder est apparu chez PayFit - PayFit](https://payfit.com/fr/metier-product-builder-payfit/) — PayFit's Product Builder role and the JetLang low-code platform
- [Should Product Managers be Product Builders? - Roman Pichler](https://www.romanpichler.com/blog/product-managers-product-builders/) — the most substantive skeptical case; its core argument is the loss of distributed intelligence
- [AI Product Management 2 Years In - SVPG](https://www.svpg.com/ai-product-management-2-years-in/) — teams deliver faster with AI while outcomes fail to improve
- [6 Product Management Trends in 2026: The PM Role Is Splitting - Userpilot](https://userpilot.com/blog/product-management-trends/) — the Builder PM / Integrator PM fork, plus practitioner concern data
- [How generative AI could accelerate software product time to market - McKinsey](https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/how-generative-ai-could-accelerate-software-product-time-to-market)
- [2024 Global DevSecOps Report - GitLab](https://about.gitlab.com/resources/developer-survey/2024/)
- [2025 GenAI Code Security Report - Veracode](https://www.veracode.com/resources/analyst-reports/2025-genai-code-security-report/)
- [Why LinkedIn is replacing PMs with AI-powered "full-stack builders" - Lenny's Newsletter](https://www.lennysnewsletter.com/p/why-linkedin-is-replacing-pms)
- [All in on Agents - Walmart Global Tech](https://public.walmart.com/content/walmart-global-tech/en_us/blog/post/all-in-on-agents.html)
- [How Walmart is securing a new cohort of AI builders - IT Brew](https://www.itbrew.com/stories/how-walmart-is-securing-a-new-cohort-of-ai-builders)
