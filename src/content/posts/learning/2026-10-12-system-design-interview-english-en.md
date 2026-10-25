---
title: "What to Say in a System Design Interview: Twelve Sentences for Asking About Scale, Setting Scope, Stating Trade-offs, and Committing to a Decision"
date: 2026-10-12
category: learning
type: guide
tags: [english-speaking, english, speaking, language-learning]
lang: en
description: "A system design interview has no code, and nearly all forty-five minutes are spent talking. This post collects twelve sentences: how to open by asking about users, traffic, and the read to write ratio; how to set scope, state an assumption, and park a detail; how to state the cost of an approach, commit to a decision, point out a bottleneck, and change your mind on the spot. The sentences come from the System Design Primer, Google's official interview guidance, and the transcripts of three mock interviews on interviewing.io."
tldr: "Open with How many users are there? and What is the expected read to write ratio? For a detail you are parking: I'm going to put a pin in that. For a cost: …but it will come at the cost of latency. After comparing, commit: I'm going to go with an event queue because I'd rather… After a section, ask Do you think that makes sense?"
series:
  name: "English Speaking Practice"
  order: 14
draft: false
---

> 🌏 [中文版](/posts/learning/2026-10-12-system-design-interview-english)

This is the third piece of interview speaking. After [coding interviews](/posts/learning/2026-10-12-coding-interview-english-en) and [handling follow-up questions](/posts/learning/2026-10-12-interview-thinking-time-english-en), what remains is the system design interview.

The examples use selected passages from mock-interview transcripts, not complete records of actual hiring interviews. Speech-to-text errors are possible and the wording has not been checked line by line against audio. Use the examples to practise requirements, trade-offs and follow-ups, not to establish register, regional differences or how to pronounce capacity figures.

## What I was trying to say

There is no coding in a system design interview. [Google's official guidance video](https://www.youtube.com/watch?v=Gg318hR5JY0) says two things at the start:

> You will not be coding in this interview. There will also be significant time constraints. We'll expect you to gather requirements and to develop an initial solution in the first 20 minutes.

```youtube
url: https://www.youtube.com/watch?v=Gg318hR5JY0
title: Life at Google: Prepare for Your Google Interview: Systems Design (Google's official guidance on the systems design interview)
```

So the whole session is talking, and the question is vague on purpose. The same video says:

> The problem you will solve during your interview will be deliberately underspecified. … You will need to ask clarifying questions.

What I need to practice is three stretches of talk:

1. Opening by pinning down scale and scope
2. Talking while drawing, and saying my assumptions and what I am skipping for now
3. Stating trade-offs, committing to a decision, and pointing out weaknesses

The sources this time:

- An employer's official guidance: Google's *Prepare for Your Google Interview: Systems Design* video. It states expectations only and has no example dialogue
- Community teaching material: the [System Design Primer](https://github.com/donnemartin/system-design-primer#how-to-approach-a-system-design-interview-question) on GitHub, whose section on how to approach a question lists questions you can ask as written
- A guide from a mock interview platform: interviewing.io's [System Design Interview Guide](https://interviewing.io/guides/system-design-interview)
- Transcripts of mock interviews: three system design mock interviews published by interviewing.io. These are actual conversations, converted from speech to text, and the speakers are anonymous

Each transcript runs to between forty and sixty thousand characters. I did not read them from start to finish. I searched for what candidates say for each function and then read the passages around each sentence.

## What you can say in this situation

### 1. Opening: ask about scale, set the scope

| What I want to say | What works in this situation | Relation to the source |
| --- | --- | --- |
| 我想先列出功能需求。 | The first thing I want to lay out is the functional requirements. | Quoted |
| 有多少使用者？ | How many users are there? | Quoted |
| 預期每秒有多少請求？ | How many requests per second do we expect? | Quoted |
| 預期的讀寫比是多少？ | What is the expected read to write ratio? | Quoted |
| 刪除的情況要包含在這次的設計範圍裡嗎？ | Do you want to handle the delete case in the scope of this design? | Adapted |

The middle three are quoted from the System Design Primer. It calls its first step *Outline use cases, constraints, and assumptions* and lists eight questions; some of the others are *Who is going to use it?*, *How are they going to use it?*, and *How much data do we expect to handle?*.

Google's guidance asks for numbers as well: *We want to see numeric estimates for these properties, such as how many requests per second the system can handle.*

The first and last sentences come from the mock interviews. The candidate in the [inventory and orders session](https://interviewing.io/mocks/faang-system-design-inventory-orders) opens with *the first thing I want to lay out is the functional requirements*. The candidate in the [photo sharing session](https://interviewing.io/mocks/faang-system-design-photo-sharing-service) asks *do you want to go through the delete case in the scope of this design or should we just… handle the creation and the visibility case?*; I kept only the first half and replaced *go through* with *handle*. In the feedback afterwards, this candidate is praised for asking clear questions about the functional requirements.

### 2. Talking while drawing: state the assumption, park the detail

| What I want to say | What works in this situation | Relation to the source |
| --- | --- | --- |
| 我先假設使用者都已經登入。 | I'm going to make the assumption that users are already logged in. | Adapted |
| 這個我先記著，晚點再回來談。 | I'm going to put a pin in that. We will come back to that. | Quoted |

Both come from the photo sharing session. The original of the first is *I'm going to go ahead and make the assumption that all our clients are going to come from a variety of different types*, and the content of the assumption is mine.

The original of the second is *I'm going to put a pin in that. We will come back to that if we dive into it a little bit more. For the time being, though, I want to jump into the design.* The interviewer singles this out in the feedback afterwards: saying that you will come back shows you have not forgotten the point.

### 3. State the trade-off, commit to a decision

| What I want to say | What works in this situation | Relation to the source |
| --- | --- | --- |
| 我們可以加一個佇列，但代價是延遲會變高。 | We can add a queue, but it will come at the cost of latency. | Adapted |
| 我選事件佇列，因為我寧可使用者最後一定拿到正確的資料。 | I'm going to go with an event queue because I'd rather the user always get the right information eventually. | Adapted |

*at the cost of* appears in two sources. In the [session on designing a chat service](https://interviewing.io/mocks/faang-system-design-designing-whatsapp), the interviewer asks whether there is a better option and the candidate answers *we can definitely suggest, but it will come at the cost of consistency, and latency*. Google's guidance uses the same wording in its example:

> Do you store data on a rotating disk and pay less money for the storage at the cost of increased latency?

[Cambridge defines trade-off](https://dictionary.cambridge.org/us/dictionary/english/trade-off) as a situation in which you balance two opposing situations or qualities, with the example *There is a trade-off between doing the job accurately and doing it quickly*.

**The second sentence was said by the interviewer, not the candidate.** After the inventory and orders session, the interviewer points out that the candidate kept saying "we could do this or this" without saying why, and then shows how to say it: *okay, so I'm going to go with an event queue because I'd rather the user … always get the right information eventually*.

interviewing.io's guide makes the same point. It says many candidates list a few options with their pros and cons and then move on to another component; its fix is to add one last sentence:

> We could use this type of DB, or this other, or that other, and these are some pros and cons… And based on all these tradeoffs, I'll use THAT type of DB.

Google's guidance asks for the same thing: *We're looking for systems designers that can consider multiple solutions, commit to one, and then iterate on it.*

### 4. Point out the bottleneck, change your mind on the spot, check they are with you

| What I want to say | What works in this situation | Relation to the source |
| --- | --- | --- |
| 我會說同步服務是瓶頸。 | I would say the synchronization service is the bottleneck. | Adapted |
| 現在想一想，用 NoSQL 資料庫可能比較合理。 | It may actually make more sense, now that I'm thinking about this, to use a NoSQL database. | Adapted |
| 你覺得這樣合理嗎？ | Do you think that makes sense? | Quoted |

The bottleneck sentence comes from the chat service session. The interviewer asks which component would give out first under heavier traffic, and the candidate says *I would say synchronisation service, I think is the bottleneck*. Google's guidance lists *Is there a bottleneck in the design?* among the questions to ask yourself while designing.

The sentence for changing your mind comes from the photo sharing session. The candidate had said the data would be relational and reconsiders on reaching the follower service: *So it may actually make more sense now that I'm thinking about this, to throw a higher availability, higher write throughput database…*. I replaced the second half with *use a NoSQL database*. This explanation of the database choice is exactly what the feedback afterwards praises.

The last sentence comes from the inventory and orders session, asked after the candidate has said which items to discuss first.

## Can I also say it this way?

| English | Who you say it to and when | Still the same meaning? |
| --- | --- | --- |
| How many users are there? | Asking for the number of users | Main version |
| What type of scale do you want to design this for? | Same situation, asked more openly | Yes (the candidate's words in the photo sharing session) |
| I'm going to go with an event queue because… | Committing to a decision with a reason | Main version |
| Based on all these tradeoffs, I'll use… | You have just listed the pros and cons of several options | Yes (the example in interviewing.io's guide) |
| Do you think that makes sense? | Checking that the other person agrees with the direction | Main version |
| Does that make sense? | Same situation, shorter | Yes (what the interviewers say in the transcripts) |

## Say it again with different content

Read the Chinese, say it yourself, and then look at the reference version.

1. 預期要處理多少資料？
   - *How much data do we expect to handle?*
2. 留言要包含在這次的設計範圍裡嗎？
   - *Do you want to handle comments in the scope of this design?*
3. 我先假設有網頁和手機兩種用戶端。
   - *I'm going to make the assumption that we have a web client and a mobile client.*
4. 我們可以加快取，但代價是一致性。
   - *We can add a cache, but it will come at the cost of consistency.*
5. 我選 API 呼叫，因為系統比較簡單。
   - *I'm going to go with an API call because it's a simpler system.*
6. 我會說資料庫是瓶頸。
   - *I would say the database is the bottleneck.*

The first is quoted from the System Design Primer; the rest are source sentences with the content changed by me.

## A short dialogue

This is a practice example I wrote myself. It is not a real interview and not a conversation from the source transcripts.

> A: I'd like you to design a photo sharing service.
>
> B: The first thing I want to lay out is the functional requirements. How many users are there?
>
> A: About 500 million.
>
> B: What is the expected read to write ratio?
>
> A: People view far more photos than they upload.
>
> B: I'm going to make the assumption that users are already logged in.
>
> A: That's fine. How would you keep the feed fast?
>
> B: We can add a cache, but it will come at the cost of consistency.
>
> A: Would you still add it?
>
> B: I'm going to go with the cache because I'd rather the feed load quickly.
>
> A: Where do you expect problems as traffic grows?
>
> B: I would say the database is the bottleneck. Do you think that makes sense?

## Without looking at the English, how would you say it?

The standard for rating yourself is whether you can get the meaning across, not whether the words match exactly.

| 中文情境 | Reference version |
| --- | --- |
| 說要從哪裡談起 | The first thing I want to lay out is the functional requirements. |
| 問使用者數量 | How many users are there? |
| 問流量 | How many requests per second do we expect? |
| 問讀寫比 | What is the expected read to write ratio? |
| 確認範圍 | Do you want to handle the delete case in the scope of this design? |
| 說出假設 | I'm going to make the assumption that users are already logged in. |
| 細節先放著 | I'm going to put a pin in that. We will come back to that. |
| 講代價 | We can add a queue, but it will come at the cost of latency. |
| 下決定並給理由 | I'm going to go with an event queue because I'd rather the user always get the right information eventually. |
| 指出瓶頸 | I would say the synchronization service is the bottleneck. |
| 當場改口 | It may actually make more sense, now that I'm thinking about this, to use a NoSQL database. |
| 確認對方同意 | Do you think that makes sense? |

## Overall

Of the twelve sentences, six are quoted from a source and six are adapted. The ones to practice first are the three opening questions about scale, and *I'm going to go with … because I'd rather…*. The first group is needed for every question; the second is the step all three sources stress and the one most easily skipped: after comparing, commit to a decision.

What sets this batch apart from the two earlier posts is that the evidence includes actual conversations, followed by the interviewer's feedback, so I can see which ways of speaking were counted as strengths. The limitation is in the same place: these are mock interviews, not language teaching materials, and nobody guarantees the grammar of those sentences. I only picked sentences that hold up grammatically and that are matched by the same wording or the same expectation in another source.

## Updates

- 2026-10-25: Joined the unified speaking series; moved research to-dos into working notes and retained the lesson’s source and use limitations.

## References

- [Life at Google: Prepare for Your Google Interview: Systems Design](https://www.youtube.com/watch?v=Gg318hR5JY0): the expectations for a systems design interview; the question is deliberately underspecified, numeric estimates are wanted, and trade-offs must be stated and a decision made
- [System Design Primer: How to approach a system design interview question](https://github.com/donnemartin/system-design-primer#how-to-approach-a-system-design-interview-question): eight questions to ask at the start
- [interviewing.io: System Design Interview Guide for Senior Engineers](https://interviewing.io/guides/system-design-interview): the example sentence for committing to a decision after comparing
- [interviewing.io mock interview: Photo Sharing Service](https://interviewing.io/mocks/faang-system-design-photo-sharing-service): setting scope, stating an assumption, parking a detail, changing your mind on the spot
- [interviewing.io mock interview: Inventory and Orders](https://interviewing.io/mocks/faang-system-design-inventory-orders): the opening, the interviewer's demonstration of how to commit to a decision, checking agreement
- [interviewing.io mock interview: Designing WhatsApp](https://interviewing.io/mocks/faang-system-design-designing-whatsapp): stating a cost, pointing out the bottleneck
- [Cambridge Dictionary: trade-off](https://dictionary.cambridge.org/us/dictionary/english/trade-off) and [bottleneck](https://dictionary.cambridge.org/us/dictionary/english/bottleneck): definitions and examples of the two words
