---
title: "Why DaoDao Turned to Helping Facilitators: Density, Three Learning Formats and Where Software Fits"
date: 2026-10-29
category: product
tags: [community, daodao, learning-community]
lang: en
type: project
series:
  name: "How DaoDao Runs a Learning Community"
  order: 0
tldr: "DaoDao set out to help individual learners build habits and stalled on numbers: a lone learner who checks in and gets no response stops coming back. It now runs three lines in parallel: helping teachers and community hosts who bring in whole groups at once, running its own reading and study sessions to test formats, and open co-challenges with no host where people with any goal can join. Software stands in for the host where there is none and saves facilitators' time."
description: "How the Taiwanese self-directed learning community DaoDao moved from a 2020 resource platform, learning marathons and themed practices to serving trainers and facilitators in 2026, and what facilitator-led series, DaoDao-run sessions, co-challenges and software each do. Part 0 of the series."
draft: false
---

> 🌏 [中文版](/posts/product/2026-10-29-daodao-why-help-facilitators)

Someone on DaoDao sets up a themed practice: "finish one book in 30 days". They check in on day one, day two and day three. In three days nobody reacts and nobody comments. On day four they stop opening the app.

We have watched this happen many times. DaoDao (島島阿學) is a self-directed learning community my co-founders and I have run since 2020. Over the years we tried a resource platform, a five-month learning marathon, a four-week learning lab and 7-to-30-day themed practices. Each version was lighter than the last, and that lone learner never went away. In September 2026 we picked a different starting point: help the people who already teach courses and run learning communities, and reach the learners we care about through them.

This series records how we plan to run DaoDao from here: what each of three learning formats is for, where software fits, where money comes from, what to measure, and how a team of three keeps it all going. This first post explains why we changed course and lays out the map for the rest of the series.

## What we set out to do

DaoDao started as a resource platform. Most of the founders came out of [Taiwan's experimental education practitioner training programme](https://ithelp.ithome.com.tw/articles/10348539) (in Chinese). Learners, teachers and parents all struggled to find suitable learning resources, so at g0v's 2020 Civic Tech for Education programme we found an engineer and built a first, collaboratively edited resource site. Even then, the [README](https://github.com/LeeLin2602/DaoTW) (in Chinese) said:

> Our real idea is maintaining this database and running the community, not just a website.

DaoDao has run on volunteers ever since. [Its project page at the Open Culture Foundation](https://ocf.tw/p/daodao/) (in Chinese) says it has operated "entirely by volunteers" since 2020, meeting online every two weeks, with close to a hundred volunteers involved over time.

The product moved gradually from "finding resources" to "helping people actually start learning":

| When | What we did | What we learned |
|---|---|---|
| H1 2025 | Learning marathon: five months, with facilitators and study groups | Participants felt the pull of connecting with others, but "faced with a five-month commitment, many began to hesitate" ([DaoDao on LinkedIn](https://tw.linkedin.com/company/daodaolearn), 2025-08-22) |
| H2 2025 | "Learning plan" feature: fill in motivation, goals and milestones | Asking that much before someone can start is too high a bar for people still exploring (["Learning Lab"](https://vocus.cc/article/690203fefd8978000130c914), 2025-10-30, in Chinese) |
| H2 2025 | Learning lab: a four-week exploration programme | Paused because too few people signed up ([DaoDao newsletter](https://daoda.kit.com/posts/-6), in Chinese) |
| Feb 2026 | Themed practices: 7 to 30 days, flexible frequency, check-ins | The barrier to starting dropped about as low as it could go |

Each step lowered the barrier, and the goal stayed the same: help someone who wants to learn take the first step, have a learning experience that works, and start a positive loop.

## Where it stalled: too few people

Once the barrier was low, we looked at retention. The conclusion is in our internal [retention diagnosis](https://github.com/daodaoedu/daodao/blob/main/docs/product/gtm/retention-diagnosis.md) (in Chinese): notifications when someone responds, a weekly learning report, a feed of check-ins — most of the mechanisms that bring people back were already built. The problem was elsewhere.

> The pipes are fine, but there's no water in them: zero density → check-ins get no response → the notification system has nothing to notify → the social reward loop spins empty.

A learner's positive loop needs other people. Someone sees your check-in and responds, and you become more likely to come back for the next one. When the site is quiet, every new user is the person who got no response for three days. No feature makes up for nobody being there.

Three hundred strangers each learning their own thing won't sustain a response rate. Thirty people working toward the same goal, starting together, will. So the question became: where do those thirty people come from?

## The turn: help the people who lead learning

The answer is the people already leading groups of learners: instructors who teach online courses, reading group hosts, coaches who run workshops. Their learners are already a group with a shared start date, who know each other and have a leader who responds.

In September 2026 we posted on LinkedIn that we were "rethinking who the first person DaoDao serves is". DaoDao's description now reads ([LinkedIn](https://tw.linkedin.com/company/daodaolearn)):

> We help trainers, coaches, and facilitators turn great learning experiences into programs that are easier to run, easier to sustain, and easier to grow.

These leaders share a pain: once a course starts, much of their time goes to chasing progress, sending reminders in LINE groups and pulling together scattered records, which crowds out the support and feedback they actually want to give. DaoDao can let learners check in and respond to each other on their own, show the leader at a glance who is moving and who has stopped, and leave the leader's time for the people who need it.

We had a hint of this already. In the first half of 2026 DaoDao ran its own reading group on *Rewire* and a [re-Visit reading group](https://daoda.kit.com/posts/re-visit) (in Chinese; Monday and Wednesday evenings in July, reading quietly together on Discord). The format was quiet, yet participants' enthusiasm came through. That showed us that when people gather on a fixed rhythm with someone leading, check-ins and responses happen on their own. DaoDao's job is to help more leaders run groups like that.

## Three formats, plus software

After the turn, DaoDao runs three learning formats at once. They differ in whether someone leads and who that is:

| Format | Who leads | Who can join | What it's for |
|---|---|---|---|
| Facilitator-led series | The teacher or community host | That teacher's learners | Density and depth: a whole group who know each other arrives at once |
| DaoDao-run sessions | The DaoDao team | Anyone interested in a given book or course | Testing formats in our own hands before handing them to teachers |
| Co-challenges | Nobody; DaoDao only sets the topic, dates and template | Anyone, with any goal | An open entrance: people learning Japanese, writing or building products all have somewhere to join |

The terms: a **series** is an ongoing programme, such as one teacher's writing accompaniment programme; a **cohort** is one run of a series; a **session** is a single meetup or task within a cohort.

Software does two jobs across these formats:

1. **It stands in for the host where there is none.** Co-challenges have no host, so the system does the reminding, responding and wrapping up: it copies a practice for each person who joins, sends emails at set points, and lets non-participants leave quick reactions.
2. **It saves leaders' time.** Teachers don't have to chase each learner in a LINE group; check-ins and replies live in one place, and the teacher can see the whole group's rhythm.

That is what "software is one of the things we offer" means. Beyond the tool, DaoDao offers leaders and learners the session formats we have run, ways of facilitating, a chance to swap notes with other leaders, and a co-challenge anyone can join. Software's job is to make all of that take less effort.

## What this approach hasn't proven yet

We are confident in the direction, and there are things we don't know yet:

- **Will learners stay after a cohort ends?** Learners brought in by a teacher are loyal to the teacher. When the cohort ends they may follow the teacher elsewhere, or just stop. We hope co-challenges will catch them and help them meet people beyond their teacher, but we don't have data yet.
- **Can three people keep three lines going?** DaoDao's core team is three people, and we share community work between us. The three lines differ a lot in how much of our time they take: teachers lead their own series, co-challenges run on participants and software, and only our own sessions need us to host. Whether we can run all three depends on the first two really not needing us as hosts.
- **Will teachers pay?** We charge course teachers and facilitators; learners check in, respond and join co-challenges for free. That fits a pattern from the research: learning communities that last are rarely paid for by learners buying "community". Whether teachers pay a tool fee, a per-cohort fee or something else, and whether they pay for a second cohort, still has to be tested.

A note on where I stand: I am a DaoDao co-founder, and this series examines the path we are on. I have tried to include cases that failed, shut down or shrank, but keep in mind that the person writing this wants the path to work.

## Series map

Each post answers one operating question, roughly in the order why → how to judge → the three formats → people, software and money → the long run:

| order | Topic | Question it answers |
|---|---|---|
| 0 | Why we turned to facilitators (this post) | What DaoDao tried and why it changed course |
| 1 | [What a living community looks like](/posts/product/2026-10-29-daodao-living-community-en) | How to tell whether a learning community is alive |
| 2 | Does learning together work? | Do people who learn together finish more often? |
| 3 | Facilitator-led series | Why start with facilitators, and what do they need? |
| 4 | DaoDao-run sessions | Why run our own, and how not to compete with teachers |
| 5 | Co-challenges | With no host, what do people with different goals share? |
| 6 | After a cohort ends | Why would learners come back? |
| 7 | Many goals, one culture | Whose culture sets the norm, and who should join? |
| 8 | Who leads | How to keep leaders from burning out |
| 9 | Where software fits | What to leave to software and what to off-the-shelf tools |
| 10 | Who pays | Why would teachers pay, and for what? |
| 11 | What to measure | What numbers to watch for each format |
| 12 | Running three lines and governing for the long run | How a community outlives its founders |

## Questions for your own community

1. If the tools your community uses broke for a week, would members still get together?
2. After a member checks in or posts, how long until the first response, and who usually gives it?
3. What in your community only happens when one particular person is present?

<details>
<summary>What to look for</summary>

1. List the interactions between members and sort them into "depends on tools" (notifications, reminders, records) and "depends on people" (someone responds, someone hosts). The longer the people column, the more your community rests on people with tools in support. If that column is nearly empty, the community will scatter when you switch tools.
2. If most responses arrive within a day and come from different members, members are already responding to each other. If they all come from you, the community still rests on you alone.
3. That list is your community's set of single points of failure. Part 8 covers how to share that work out.

</details>

## References

- [Day 7: The birth of DaoDao, from educational ideals to action (iThome, 2024-09-08)](https://ithelp.ithome.com.tw/articles/10348539) (in Chinese)
- [DaoTW DaoDao self-learning platform README (GitHub, 2020-10)](https://github.com/LeeLin2602/DaoTW) (in Chinese)
- [DaoDao learning community project page (Open Culture Foundation)](https://ocf.tw/p/daodao/) (in Chinese)
- [Learning Lab: rethinking how learning starts (DaoDao on vocus, 2025-10-30)](https://vocus.cc/article/690203fefd8978000130c914) (in Chinese)
- [DaoDao update: stuck, narrowing down, readjusting (DaoDao newsletter)](https://daoda.kit.com/posts/-6) (in Chinese)
- [DaoDao update: re-Visit reading group (DaoDao newsletter)](https://daoda.kit.com/posts/re-visit) (in Chinese)
- [Dao Dao 島島阿學 (LinkedIn company page)](https://tw.linkedin.com/company/daodaolearn)
- [Retention diagnosis: motivation, notification system check and the one engineering item (daodaoedu/daodao)](https://github.com/daodaoedu/daodao/blob/main/docs/product/gtm/retention-diagnosis.md) (in Chinese)
