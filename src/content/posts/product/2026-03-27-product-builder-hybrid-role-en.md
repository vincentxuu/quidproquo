---
title: "Product Builder: As Role Boundaries Dissolve, Five Archetypes from the Claude Code Team Are Redefining Product Development"
date: 2026-07-25
type: deep-dive
tldr: "Boris Cherny observed the Claude Code team and identified five role archetypes: Prototyper, Builder, Sweeper, Grower, Maintainer. Not tied to job titles — they shift with product stage. Combined with Anthropic's no-PRD, most-prototypes-die culture, Product Builder isn't a new title — it's a way of working that's replacing the assembly line."
category: product
tags: [product-builder, product-management, ai, anthropic, claude-code, career]
lang: en
description: "Claude Code creator Boris Cherny observed that engineering, product, and design roles are melting together, and identified five archetypes. Aakash Gupta broke down Anthropic's operating model: no PRDs, prototypes expected to die, Claude Code reviews PRs first. From LinkedIn to Walmart, this organizational shift is already happening."
draft: false
---

🌏 [中文版](/posts/product/2026-03-27-product-builder-hybrid-role)

Claude Code creator Boris Cherny posted an observation:

> As engineering, product, design, DS, etc. melt into a new kind of role, I was reflecting on what roles might look like in the future.

He wasn't reading an industry trend report. He was watching his own team — the Claude Code team — work every day. What he found is that roles aren't divided by job title. They operate along five archetypes.

## The Five Archetypes

**1. Prototyper** — Constantly generates brand-new ideas. Most won't ship, but the few that survive change the product's direction.

**2. Builder** — Quickly turns a surviving prototype into production-grade product or infrastructure.

**3. Sweeper** — Cleans up the UI, simplifies the code and system, unships features that aren't pulling their weight, optimizes performance. The most underestimated role on any team, but without it products bloat into unmaintainability.

**4. Grower** — Takes a shipped product and iterates on it to improve Product-Market Fit.

**5. Maintainer** — Owns a mature system to make it secure, reliable, fast, and efficient as it scales.

Boris emphasized two things:

First, many people span two roles, sometimes three. Second, these archetypes are **not tied to job function** — at Anthropic, some designers are Prototypers, some are Builders, some are Sweepers. Same for engineers, PMs, and data scientists.

This is completely different from the traditional question of "are you a PM or an engineer?" The real question is: **are you currently prototyping, building, sweeping, growing, or maintaining?**

### This Isn't a Brand-New Idea

The thinking behind the five archetypes has a lineage. In 1992, Robert Cringely divided teams into Commandos, Infantry, and Police. In the 2010s, Simon Wardley developed the Pioneers / Settlers / Town Planners framework, widely adopted in technology organizations. Boris's five archetypes are the latest evolution of this thread: Prototyper ≈ Pioneer, Builder/Grower ≈ Settler, Maintainer ≈ Town Planner.

What did Boris add? Two things. First, **Sweeper was broken out as its own archetype** — in an era where AI generates code at massive scale, "subtraction" has become as important as "addition." Second, he explicitly stated that these archetypes cut across all job titles, not just engineering.

## Product Stage Determines the Archetype Mix

A healthy team isn't a fixed roster — it's a shifting mix of archetypes matched to the product's stage:

| Product Stage | Archetypes Needed |
|---------------|-------------------|
| **New product, pre-PMF** | Prototyper + Builder + Sweeper as primary |
| **Growth phase, PMF found** | Builder + Sweeper + Grower as primary, plus Maintainer |
| **Mature product, strong PMF** | Sweeper + Grower + Maintainer as primary, plus Builder |

This is closer to reality than "how many frontend devs, how many backend devs, one PM." What you need isn't headcount by title — it's capability by archetype.

## How Anthropic Makes This Model Work

Product strategy writer Aakash Gupta broke down the organizational culture behind Anthropic that explains why the five archetypes work there:

**Everyone shares one title.** PMs code, designers code, even finance codes. Everyone's title is Member of Technical Staff.

**No PRDs — build first.** When they shipped agent teams, they tried hundreds of versions before one made it out.

**Most prototypes are expected to die.** The little spinner animation you see while Claude Code is working went through 50 to 100 iterations — about 80% never shipped.

**They ship faster than sounds possible.** Cowork — a full product for non-engineers — came together in roughly ten days.

**AI reviews before humans do.** Every pull request goes through Claude Code review first. The model catches most bugs on the first pass; an engineer does the final check.

**They bet on the general model.** There's a framed copy of [The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html) on the wall where the team sits. The general model beats the specialized one, every time.

This isn't management theory. It's the daily operating reality of a company that's defining how AI products get built.

Anthropic's PM lead Cat Wu revealed more on Lenny's Podcast. The team runs a "Concept Corner" mechanism — anyone with an idea aims to get it into users' hands the same week, even the same day. In her words: "We use team principles to replace PRDs. As long as it aligns with principles, anyone can decide to ship without PM sign-off." Anthropic's Head of Design Meaghan Choi added: "Quality gates have moved from PRDs and Figma files to live, working code."

Cat Wu argues that as the cost of writing code approaches zero, the scarcest asset becomes **product taste** — the judgment of *what* to build, not the ability to build it. This is also why Anthropic's engineering output tripled, yet they need **more** PMs, not fewer.

## Why Now

Two words: **AI**.

In 2025, Andrej Karpathy introduced vibe coding — instead of writing code line by line, you describe what you want in natural language and let AI generate it. This directly lowered the barrier to building things.

When tools like Claude Code, Cursor, Lovable, and Replit let one person go from idea to working prototype in a few hours, the traditional assembly line — PM writes spec → Designer produces mockups → Dev implements → QA signs off — is no longer the only option.

LogRocket ran the numbers: a traditional three-person product team costs roughly $1.2–1.5M per year, and 50–60% of shipped features underperform expectations. If one person can validate assumptions before committing full engineering resources, avoiding just five unnecessary features per year saves over $500K.

Boris himself has said:

> Today coding is practically solved... We're going to start to see the title of 'software engineer' go away. It's just going to be 'builder' or 'product manager.'

The five archetypes framework is the concrete elaboration of that statement.

## Who's Already Doing This

This isn't Anthropic's experiment alone — large organizations are already restructuring:

- **LinkedIn** renamed its APM (Associate Product Manager) program to the **Product Builder** program, training generalists who span product, design, and engineering
- **Walmart** created **Agent Builder** positions, staffed entirely by internal employees — including non-technical ones
- **Meta** PMs have started calling themselves "AI Builders"
- **PayFit** defined the Product Builder role as far back as 2019, using their in-house low-code language JetLang to let PM / UX / Dev work as one
- **SoFi** is actively hiring for Product Builder roles

Khan Academy's Sal Khan put it plainly:

> The people who are just waiting to get the spec... they're going to have trouble. But the people who are like, 'I'm going to go meet with the customer, and I can build it,' I think they're going to do great.

## This Isn't Replacing Specialization

When product complexity increases, when you need large-scale system architecture, or when deep user research is required, specialized roles remain irreplaceable. The five-archetype model works best for:

- Early-stage products: heavy on Prototyper + Builder for rapid exploration and validation
- Internal tools: no need for large-scale engineering investment
- Feature iteration: Sweeper + Grower for rapid experimentation and data-driven decisions
- Mature systems: Grower + Maintainer ensuring stable operations

An analysis by Business Next points to a counterintuitive trend: in the AI era, **Sweepers and Maintainers are becoming more valuable than Builders**. Because "making things" can be massively delegated to AI, but directional judgment and architectural cleanup remain the last human stronghold.

A deep analysis on paddo.dev takes this further: "Agents add; they don't subtract." The Sweeper's core work — deleting, unshipping, simplifying — is precisely what AI is worst at, because it requires taste to know what shouldn't exist. The same goes for Prototypers: AI can generate a hundred ideas, but discerning which one deserves investment is judgment AI doesn't have.

Aakash Gupta's conclusion:

> When your engineers can each run several agents at once, speed stops being the constraint. The constraint becomes whether anyone in the room can separate the prototype that turns into a product from the one that burns a quarter.

When speed is no longer the bottleneck, **taste** is. The person who can tell which prototype deserves investment and which should be killed becomes extremely valuable.

## If You Want to Move in This Direction

Whether you're currently a PM, designer, or engineer, the path is the same: **identify which archetype you're strongest in, then fill in what you're missing.**

If you're a natural **Prototyper** → Learn to push ideas to production-grade (Builder) instead of stopping at the demo.

If you're a **Builder** → Spend time understanding users and develop the judgment to tell which prototypes deserve investment (Grower).

If you're a **Maintainer** → Practice simplifying and unshipping (Sweeper) — don't let systems only grow, never shrink.

Aakash's advice is practical:

> You don't need a new title or anyone's permission to start. Build five versions of something this week and keep the one that earns its place.

Product Builder isn't a job title — it's a way of working. In an era where role boundaries are dissolving, people who can flow between the five archetypes will become increasingly valuable.

---

## References

### Primary Sources

- [Boris Cherny — Five archetypes on the Claude Code team (X, 2026-06-28)](https://x.com/bcherny/status/2071379474277613732)
- [Aakash Gupta — Anthropic's operating model breakdown (X, 2026-06-29)](https://x.com/aakashgupta/status/2071692050714501494)
- [Aakash Gupta — Anthropic's Claude Code Team Has 5 Roles and Zero Job Titles (Medium)](https://aakashgupta.medium.com/anthropics-claude-code-team-has-5-roles-and-zero-job-titles-bf4860a389fc)
- [How Anthropic's product team moves faster — Cat Wu on Lenny's Podcast (YouTube)](https://www.youtube.com/watch?v=PplmzlgE0kg)
- [Anthropic Head of Design on How Claude Code Hit $2.5B — Product School](https://productschool.substack.com/p/anthropic-head-of-design-on-how-claude)
- [How AI Is Transforming Work at Anthropic — Anthropic Research](https://www.anthropic.com/research/how-ai-is-transforming-work-at-anthropic)

### English Discussion

- [The 5 job archetypes of the future — Business Insider](https://www.businessinsider.com/job-archetypes-ai-claude-codes-boris-cherny-2026-6)
- [Claude Code Head Says You Need These 5 Employee Archetypes — Inc.](https://www.inc.com/ashley-couto/claude-code-startup-needs-employee-archetypes/91370409)
- [Five Archetypes for a Post-Role Team — jamesm.blog](https://jamesm.blog/ai/five-archetypes-post-role-team/)
- [The Archetype Under the Title — paddo.dev](https://paddo.dev/blog/the-archetype-under-the-title/)
- [Product Management Archetypes: Beyond the PM Job Title — Lots of Data](https://lotsofdata.blog/2026/06/30/the-product-managers-new-operating-system/)
- [Roles of the future: Claude Code Team five archetypes — fernandocomet (Medium)](https://medium.com/design-bootcamp/roles-of-the-future-0eb1cfae0f3c)
- [How Anthropic Builds AI-Native Engineering Teams — Engineering Leadership Newsletter](https://newsletter.eng-leadership.com/p/how-anthropic-builds-ai-native-engineering)
- [Forget Job Titles, Staff Your Team by Archetype — Samuel Lawrentz](https://samuellawrentz.com/blog/staff-your-team-by-archetype/)

### Chinese-Language Discussion

- [職稱正在失效，Claude Code 負責人提出 AI 時代五種人才原型 — INSIDE](https://www.inside.com.tw/article/41672-boris-cherny-five-product-archetypes-ai-roles-claude-code)
- [工程師與 PM 的價值被 AI 重寫？未來團隊最缺的不是「建造者」— Business Next](https://www.bnext.com.tw/article/91395/ai-product-work-archetypes-from-handovers-to-prototypes)
- [Claude Code 負責人提五種角色原型 — TechNews](https://technews.tw/2026/06/29/five-key-archetypes-for-future-product-teams/)
- [Claude Code 之父版"职场 MBTI" — 36Kr / 量子位](https://36kr.com/p/3875518156763399)
- [想法即產品：AI 時代 Product Builder 的崛起 — Peter Su (Substack)](https://petersuppi.substack.com/p/ai-product-builder)
- [AI 時代只剩四種人能留下來？— TechOrange](https://techorange.com/2026/04/13/four-jobs-left-in-tech/)
- [深度解密 Anthropic：当代码沦为"白菜价" — Tencent Cloud](https://cloud.tencent.com/developer/article/2665528)

### Historical Context

- ['Engineer' is so 2025. In AI land, everyone's a 'builder' now — SF Standard](https://sfstandard.com/2026/03/05/engineer-2025-ai-land-everyone-s-builder-now/)
- [Why product managers must become product builders in 2026 — LogRocket](https://blog.logrocket.com/product-management/product-builders-future-product-management)
- [AI is turning product managers into builders — Fast Company](https://www.fastcompany.com/91452231/ai-is-turning-product-managers-into-builders)
- [Introducing the Product Builder — PayFit](https://backstage.payfit.com/introducing-the-product-builder/)
- [The Era of the Product Creator — SVPG](https://www.svpg.com/the-era-of-the-product-creator/)
- [The Bitter Lesson — Rich Sutton](http://www.incompleteideas.net/IncIdeas/BitterLesson.html)
