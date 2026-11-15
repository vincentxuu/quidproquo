---
title: "How to Tell Whether a Learning Community Is Alive: Sense of Community, Shared Practice and Response Rates"
date: 2026-10-29
category: product
tags: [community, daodao, learning-community, metrics]
lang: en
type: guide
series:
  name: "How DaoDao Runs a Learning Community"
  order: 1
tldr: "Look at whether things go back and forth between members, not at sign-ups or message volume: does a check-in get a response within 72 hours, do people who got a response come back within 7 days, is more than one core member responding to newcomers, and is the group building up practice others can reuse. Most new communities die within three months (57% of 472,231 new Facebook groups stopped posting), and groups with a single admin whose founder added every member die sooner."
description: "A checklist for judging whether a learning community is alive, drawn from McMillan and Chavis's four elements of sense of community, the Wenger-Trayners' three features of a community of practice, studies of new Facebook groups and digital health communities, and DaoDao's own ecosystem metrics. Part 1 of the series."
draft: false
---

> 🌏 [中文版](/posts/product/2026-10-29-daodao-living-community)

Put two learning communities side by side. The first is a 500-person LINE group with dozens of messages a day, mostly learning resources the host reposts and "good morning" stickers. The second is a 20-person reading group that reads together on Tuesday and Thursday evenings; at the end everyone posts a check-in, and two or three people usually respond within an hour.

Which one is more alive? Most people's instinct says the second, but they can't say why. That matters for DaoDao: the [previous post](/posts/product/2026-10-29-daodao-why-help-facilitators-en) explained that we turned to helping teachers because there were too few people and check-ins went unanswered. To know whether the turn is working, we first need to say what "alive" looks like.

This post pulls together four studies and DaoDao's own metrics, and ends with a checklist you can use on your own community.

## Sense of community: members feel they belong

The most cited definition in community psychology comes from McMillan and Chavis's 1986 paper "[Sense of Community: A Definition and Theory](https://cybersalon.org/wp-content/uploads/2021/06/Sense_of_Community_A_Definition_and_Theory.pdf)":

> Sense of community is a feeling that members have of belonging, a feeling that members matter to one another and to the group, and a shared faith that members' needs will be met through their commitment to be together.

They break it into four elements. In a learning community they look roughly like this:

| Element | What it means in the paper | What it looks like in a learning community |
|---|---|---|
| Membership | Feeling you belong, with a boundary marking who is a member | Signing up, joining a cohort or copying the same practice template all draw that boundary |
| Influence | I matter to the group, and the group matters to me | Members can propose the next book or change the check-in time |
| Reinforcement (integration and fulfilment of needs) | Being here meets my needs | Someone responds when you show up, someone offers an approach when you're stuck |
| Shared emotional connection | Shared history, time and experiences | Getting through the last month before an exam together, presenting at a demo day together |

The paper gives the example of a community organiser who first asks residents what worries them, finds a shared need, then calls a meeting where people elect officers and plan action together. The four elements grow step by step; opening a group chat is only the starting point.

The four elements work well as a **design checklist**: is there a ritual for joining? Can members change the rules? What do people get when they show up? Is there a shared experience? I wouldn't turn them into a score to track, because a survey score just becomes another number to manage.

## A learning community also needs shared practice

Sense of community explains why people stay, but a learning community has another layer: people working to get better at something together. In "[Introduction to communities of practice](https://www.wenger-trayner.com/introduction-to-communities-of-practice/)", Etienne and Beverly Wenger-Trayner define communities of practice as "groups of people who share a concern or a passion for something they do and learn how to do it better as they interact regularly", and say three things must hold at once:

- **Domain**: a shared concern; being a member means caring about it.
- **Community**: members interact, help each other and learn from each other. They put it plainly: "A website in itself is not a community of practice."
- **Practice**: members build a shared repertoire — experiences, stories, tools, ways of handling recurring problems. That takes time and sustained interaction.

The third point matters most for DaoDao. A themed practice template many people have copied, the check-in record a reading group leaves behind, a format like "read silently for 50 minutes, then close with a check-in" — these are shared practice. Without something that accumulates, a community is just conversation, and when people leave nothing remains.

## Participation is always uneven

A common mistake in judging a community is expecting everyone to speak up. In a 2014 study in [JMIR](https://www.jmir.org/2014/2/e33), van Mierlo analysed four online support communities for problem drinking, depression, panic and quitting smoking. Over 60,000 users produced more than 570,000 posts: fewer than 25% ever posted, and the top 1% wrote about 74.7% of the content.

That means two things:

1. Most members reading without posting is normal. Someone who reads quietly in a reading group and occasionally reacts is still a member.
2. A community is carried by a small core. Whether those people stay, and whether new people gradually join the core, matters more than total headcount.

So a living community has a group of people who keep coming back to respond to others, and more than one or two of them; everyone else reading quietly is fine.

## Most new communities die in their first three months

In a 2014 [CSCW paper](https://dl.acm.org/doi/pdf/10.1145/2531602.2531648), Kraut and Fiore followed 472,231 newly created Facebook groups. After three months, 57% had stopped producing new content. The more active the founder was in the group during its first week, the more likely the group was to survive.

The same study found that founders who are too controlling hurt their groups. Three kinds of group were more likely to die:

- The founder is the only admin
- The founder has ties to every member
- The founder added every member personally

The authors' reading is that the resources founders bring matter, but when a group depends on them too much they become a bottleneck.

This applies to all three of DaoDao's formats. In a facilitator-led series, the teacher brings in every learner at first; in DaoDao-run sessions, we are the ones responding at the start. Someone needs to be present in the first week, but members should gradually take over responding to each other rather than relying on the leader forever. That is where the "sentinel" metric in part 11 of this series comes from.

## How DaoDao measures it: what happens between people

DaoDao's [learning ecosystem document](https://github.com/daodaoedu/daodao/blob/main/docs/product/prd/learning-ecosystem.md) (in Chinese) lists six metrics. All of them measure what happens between members, and all can be computed from existing tables:

| Metric | Definition | What it measures |
|---|---|---|
| Response rate | Share of check-ins that get at least one quick reaction or comment within 72 hours | The basic heartbeat: did anyone see it? |
| Return rate | Share of users who check in again within 7 days of receiving a response | Whether being responded to turns into motivation to keep going |
| Copy-chain length | Practices copied per month, and the share that are copies of copies | Whether one person's practice becomes someone else's starting point |
| Connection density | Share of monthly active users with at least one connection or three follows | Whether relationships are forming |
| Producer diversity | Number of kinds of content source (self-written, templates, teachers, outside resources) | Whether content comes from only one kind of person |
| Buddy survival | Share of matched pairs where both are still checking in 14 days later | Whether one-to-one accompaniment works |

Buddy survival has no data yet: the feature it depends on has not shipped, so for now it is only a definition.

The first two matter most. Response rate tells you whether anyone is there; return rate tells you whether their being there helps. Mapped to the research above: response rate corresponds to "needs being met" in sense of community, the copy chain to the shared repertoire of a community of practice, and connection density to membership and shared emotional connection.

The same document lists what we deliberately don't measure: check-in streaks, hours studied, strict deadline completion. These numbers land on individuals, and missing one day turns them into a burden. DaoDao's rule is "measure flow, not pressure": metrics look at whether things go back and forth between people, not at how long one person can hold out.

## A checklist

Putting these studies together, I use four questions to check whether a learning community is alive:

1. **Is there a group of people who keep coming back to respond to others, and is it more than one person?** If there is one admin and every response comes from them, the community is fragile.
2. **Are newcomers caught in their first week?** Does a first check-in get a response within a day, ideally from someone other than the leader?
3. **Is something accumulating that others can reuse?** Templates, check-in records, methods — more than chat messages.
4. **Can members shape what happens here?** Can they propose topics, change the rhythm, lead a session?

Back to the two communities at the top. The 500-person LINE group has plenty of messages, but they are mostly one-way reposts from the host; it probably passes one of the four questions. The 20-person reading group gets a response to every check-in and keeps its records in one place, so it passes at least the first three.

The next post takes up a different question: if a community is alive, does it actually help people learn?

## Questions for your own community

1. Over the past month, how long did a newcomer's first post or check-in take to get its first response, on average? Who responded?
2. List the five people who most often respond to others. If one of them left tomorrow, what would happen?
3. What has your community built up that a new member could pick up and use directly?

<details>
<summary>What to look for</summary>

1. Within a day, from someone other than you, means newcomers are being caught. Over three days, or always the same responder, is the first thing to fix: start by asking two or three established members to take turns responding to newcomers.
2. If the answer is "the community would stop", that person is a single point of failure. Kraut and Fiore's study shows communities that rest on one admin die more often; find a second and third person willing to respond before anything else.
3. If you can't name anything, your community's value lives only in current conversation and leaves when people do. Start with the questions people ask most and turn them into a template or an FAQ.

</details>

## References

- [McMillan, D. W. & Chavis, D. M. (1986). Sense of Community: A Definition and Theory. Journal of Community Psychology, 14(1)](https://cybersalon.org/wp-content/uploads/2021/06/Sense_of_Community_A_Definition_and_Theory.pdf)
- [Wenger-Trayner, E. & Wenger-Trayner, B. (2015). Introduction to communities of practice](https://www.wenger-trayner.com/introduction-to-communities-of-practice/)
- [van Mierlo, T. (2014). The 1% Rule in Four Digital Health Social Networks: An Observational Study. JMIR, 16(2):e33](https://www.jmir.org/2014/2/e33)
- [Kraut, R. E. & Fiore, A. T. (2014). The Role of Founders in Building Online Groups. CSCW '14](https://dl.acm.org/doi/pdf/10.1145/2531602.2531648)
- [DaoDao's learning ecosystem: a full description (daodaoedu/daodao)](https://github.com/daodaoedu/daodao/blob/main/docs/product/prd/learning-ecosystem.md) (in Chinese)
