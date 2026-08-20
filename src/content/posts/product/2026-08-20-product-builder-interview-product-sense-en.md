---
title: "Product Sense Interview Guide: From User Insight to Feature Prioritization"
date: 2026-08-20
category: product
tags: [interview, product-builder, product-sense, user-research]
lang: en
type: deep-dive
description: "Breaking down the Product Sense interview — user insight, problem definition, and feature prioritization frameworks with practical strategies."
tldr: "Product Sense interviews don't test how many features you can think of — they test whether you can find the problem truly worth solving within a vague requirement. Core skills: user segmentation thinking, problem reframing (turning 'add a feature' into 'what problem are we solving'), structured reasoning for feature prioritization, and the ability to hold or revise your judgment under follow-up questions."
series:
  name: "Product Builder Interview Prep"
  order: 2
---

## What Product Sense Looks Like in Interviews

Product Sense is the most central round in PM and Product Builder interviews — Google calls it Product Design, Meta calls it Product Sense, but they test essentially the same thing: given a vague problem, can you tease out a user problem worth solving and then design a reasonable solution?

Typical questions look like this:

- "Design a communication app for elderly people"
- "Improve Instagram's Explore page"
- "What new feature should Google Maps build?"
- "How would you improve the airport experience?"

These questions have no standard answers. Interviewers don't care how innovative your solution is — they're observing your thinking process: how you define users, find the real problem, prioritize, and make trade-offs. The whole process typically takes 35-45 minutes, and you need to walk through a complete structured chain of thought within that limited time.

---

## User Insight: The First Three Minutes Decide Success or Failure

The most common mistake after receiving a question is jumping straight into feature ideas. The correct first step is asking the interviewer clarifying questions, then defining your users.

### Quick User Segmentation

There's no time for real user research in an interview, but you can segment quickly using structured dimensions. Common segmentation approaches:

**By usage frequency**: Power users, moderate users, light users, churned users. Each group has completely different needs and pain points.

**By usage scenario**: For "improve the airport experience" — business travelers (high frequency, efficiency-first), family travelers (low frequency, need guidance), connecting passengers (anxious, time pressure).

**By demographics**: Age, region, tech proficiency. This is the most intuitive approach, but often not the most useful — segmenting by "behavior" usually reveals real needs better than segmenting by "demographics."

After segmenting, you need to make a key judgment: **which group to focus on**. Interviewers want to hear your reasoning, not just your choice. Good reasons are usually: this group has the most severe pain point, this group is the largest, or this group is currently severely underserved.

### How to Demonstrate User Insight

Here's a technique for interviews: use "persona + scenario" to demonstrate your user understanding, rather than staying at the level of abstract segmentation.

Poor expression: "I choose to focus on elderly users because they're the target market."

Good expression: "I want to focus on people aged 65-75, recently retired, who don't live in the same city as their children. They want to stay connected with family, but existing communication apps have interfaces that are too complex — for example, LINE's group chat feature makes them confused about who their message is going to. Their core need isn't more features — it's the confidence that 'this message will reach the right person.'"

The latter shows the interviewer you're not just categorizing — you're actually thinking about the user's life context and emotional needs.

---

## Problem Definition: From "Add a Feature" to "What Problem Are We Solving"

After user segmentation, the next step is finding a problem worth solving. The biggest trap here is skipping the problem and jumping straight to a solution — interviewers will deduct points here.

### CIRCLES Framework in Practice

CIRCLES is a Product Design interview framework proposed by Lewis C. Lin, with seven steps:

1. **C**omprehend the situation — Understand the context, ask clarifying questions
2. **I**dentify the customer — Define users
3. **R**eport the customer's needs — List core user needs
4. **C**ut through prioritization — Prioritize
5. **L**ist solutions — List solutions
6. **E**valuate trade-offs — Evaluate trade-offs
7. **S**ummarize — Summarize

In practice, you don't need to announce which step you're on — that makes the whole answer sound like you're reciting a framework. A more natural approach is to compress the first three steps (understand, define users, list needs) into the first 5-8 minutes, then spend most of your time on steps 4-6 (prioritization, solutions, trade-offs).

### Problem Reframing Technique

Interviewers typically phrase questions at the solution level ("Design an X"). You need to translate it to the problem level.

Question: "Design a communication app for elderly people."

Reframe: "What barriers do elderly people face in staying connected with family? Is it too high a technical threshold, not knowing when to reach out, or feeling like they're being a bother?"

This reframe shifts you from "what features should the app have" to "what does the user actually need to solve." The latter is the core of Product Sense.

---

## Feature Prioritization: Structured Persuasion

After listing 3-5 possible solutions, you need to choose 1-2 to go deeper on. Here the interviewer is testing your prioritization logic.

### Three Dimensions for Ranking

**User Impact**: How severe is the problem this solution addresses? How many users does it affect?

**Feasibility**: Given current technology and resources, how difficult is this solution to implement?

**Strategic fit**: Is this solution aligned with the product's long-term direction?

You don't need precise numbers in an interview — you don't have data. But you need to explain your judgment with logic.

Good expression: "Solution A affects the largest user group, but implementation cost is also highest — it requires building a new recommendation engine. Solution B affects a slightly smaller group, but can be built as an MVP on the existing architecture within two weeks. Given that we want to validate hypotheses before investing heavily, I choose Solution B as the first step."

Poor expression: "I think Solution B is better." — A judgment without reasoning isn't Product Sense.

### Elimination Is More Persuasive Than Addition

An advanced technique: rather than explaining why you chose a particular solution, explain why you eliminated the others. This makes the interviewer feel you've considered more thoroughly.

"I eliminated Solution C because while it's technically the most fancy, it solves a secondary problem — it's not what users are most pained by. Solution A has the right direction, but the scope is too large and the risk is too high as a first step. So I chose B — validating the core hypothesis with minimum cost first."

---

## Common Question Types Analyzed

### "Improve Instagram's Explore"

**User segmentation**: Content consumers (browse only, don't post), content creators (care about reach), businesses (care about conversion). Focus on content consumers, as they're the primary Explore users.

**Core problem**: Explore's current recommendations easily fall into echo chambers — users repeatedly see similar content, freshness declines, and they eventually use Explore less.

**Solution direction**: Introduce a "serendipity discovery" mechanism — intersperse a small amount of high-quality cross-category content in the recommendation feed, increasing content diversity while maintaining relevance.

**Success metrics**: Explore DAU, average session duration, and the percentage of users following new accounts.

### "Design a Communication App for Elderly People"

**User segmentation**: Elderly living alone (strongest social need), elderly living with family (supplementary communication), elderly in care facilities (institutional social). Focus on elderly living alone.

**Core problem**: Not "can't use the app," but the anxiety of "not knowing if the other person will respond." Existing apps' read receipts actually increase this anxiety.

**Solution direction**: "Daily question" as the core — push a simple question each day ("How's the weather today?"), and the elderly person just presses a button to answer. Family members receive a notification. Lower the communication threshold by shifting the burden of "should I reach out" away from the elderly person.

**Success metrics**: Daily interaction rate, elderly response rate, family notification open rate.

---

## Interview Tips and Common Traps

**State your structure before filling in content.** Use 10 seconds at the start to preview your answer structure: "I'll first define users, identify the core problem, then propose 2-3 solutions and go deep on one." This lets the interviewer know you have a plan and lets them guide you at appropriate moments.

**Don't list too many features.** Listing 10 features and touching on each briefly is worse than focusing on 2-3 and discussing them in depth. Interviewers want to see depth, not breadth.

**Embrace follow-up questions.** When the interviewer asks "Why not choose A?" they're not attacking you — they're giving you an opportunity to demonstrate deeper thinking. The worst reaction is immediately changing your answer; the best reaction is standing firm with logic or adjusting with new information.

**Quantify your judgments.** Even without real data, you can use estimates. "I estimate this feature would affect about 30% of DAU; at Instagram's scale, that's roughly 150 million out of 500 million" — it doesn't need to be precise; what matters is demonstrating quantitative thinking.

**Time management.** The most common failure in Product Sense interviews is spending too much time on user definition, leaving only 5 minutes to rush through the solution design. Recommended allocation: clarifying + user definition 8 minutes, problem definition 5 minutes, solution design and trade-offs 20 minutes, summary 2 minutes.

---

## What's Next

The next post covers Product Design — the design process from problem to solution. Product Sense helps you find the right problem; Product Design helps you turn that problem into something users will actually use.

## Practice Question

### Question

"What new feature should Google Maps build?"

**Source**: Google PM interview　**Difficulty**: Medium　**Round**: product sense round

### Solution Framework

1. **Clarify the question**: Ask the interviewer — which platform (mobile/in-car/desktop)? Is there a specific business objective (increase usage frequency, grow revenue, enter a new market)?
2. **Build a framework**: Define 2-3 user groups (commuters, tourists, delivery drivers), pick one to focus on, find their biggest unmet need.
3. **Go deeper**: Propose 2-3 solution directions, rank by impact × feasibility, deep-dive into one with MVP design and success metrics.
4. **Wrap up**: Summarize why you chose this solution and what data you'd use to judge its success.

### Sample Answer (How You'd Actually Say It in an Interview)

> **User selection.** I want to focus on "daily commuters" — they're Google Maps' highest-frequency user group, opening the app at least twice a day. Their biggest pain point isn't navigation itself, but the "what time should I leave today" decision — traffic conditions vary daily, and what they need isn't a more accurate ETA, but "tell me in advance when I should leave."
>
> **Solution design.** My solution is "Smart Departure Reminder" — users set a destination and arrival time (e.g., "at the office by 9am"), and Maps sends a push notification 10 minutes before the optimal departure time based on historical traffic data and real-time conditions. The core MVP needs just three components: a destination + arrival time settings interface, a departure time prediction model based on historical data, and push notifications. I wouldn't put "alternative route recommendations" or "calendar integration" in the MVP — those can be added after validating the core hypothesis.
>
> **Success metrics.** The core metric is "percentage of users who set reminders and arrive on time." The guardrail metric is "notification click rate not below 40%" — if it's too low, it means the notification timing is wrong or users find it unhelpful. I excluded DAU as a metric because this feature's goal isn't to make users open the app more, but to make each use more valuable.

### Self-Check Checklist

| Checkpoint | Mentioned? |
|-----------|------------|
| Defined a specific user group with rationale for focus | |
| Started from user pain points (not from features) | |
| Proposed 2-3 directions and ranked them | |
| Deep-dived into one solution with MVP scope decisions (what's in, what's out) | |
| Defined core metric + guardrail metric | |
| Bonus: Explained why other metrics were excluded (e.g., DAU) | |

## References

- [Lewis C. Lin — Decode and Conquer](https://www.lewis-lin.com/decode-and-conquer) — The original source of the CIRCLES framework for Product Sense interviews, covering question type breakdowns for Google, Meta, and other major companies
- [Lenny's Newsletter — How to develop product sense](https://www.lennysnewsletter.com/p/product-sense) — A practical breakdown of building Product Sense skills, with specific examples of user insight and prioritization judgment
- [Exponent — Product Sense Interview Guide](https://www.tryexponent.com/courses/product-management/product-sense-interviews) — A structured preparation guide for Product Sense interviews, with mock interview videos for Google and Meta
- [Inspired — Marty Cagan](https://www.svpg.com/inspired-how-to-create-tech-products-customers-love/) — The methodology behind user insight and problem definition in Product Sense, the underlying logic for feature prioritization judgment in interviews
- [Teresa Torres — Continuous Discovery Habits](https://www.producttalk.org/continuous-discovery-habits/) — User segmentation and problem decomposition frameworks for Product Sense interviews, covering the opportunity solution tree for structured thinking
