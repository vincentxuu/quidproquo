---
title: "Talking About AI Agent Work in an English Interview: Positioning, Changing Requirements, Mistakes, and Design Principles"
date: 2026-10-07
category: learning
type: guide
tags: [english-speaking, english, speaking, language-learning]
lang: en
description: "Twelve sentences picked from my own Chinese prep notes for AI agent engineering interviews, each matched to a dictionary sentence pattern: a one-line positioning statement, a project whose direction changed five times, a bug with no error messages, two design principles, one mistake, and an honest answer about what is not done yet."
tldr: "Positioning: I work on improving…, My work covers…. Changing requirements: changed five times in four months. Persuading with data: that convinced the team to…. A measured result: took 29 minutes. A mistake: I changed … but didn't update …, We only found out … after …. An honest gap: To be honest, we don't have … yet."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-10-07-interview-agent-stories-english)

My [previous post on interview speaking](/posts/learning/2026-10-07-interview-experience-english-en) covered general patterns, with example numbers. This one uses my own interview prep material. I already had the stories and follow-up answers in Chinese, so I picked the twelve sentences I say most often and get stuck on in English.

Company and product names are removed here. Only the work and the measured numbers remain.

## What I was trying to say

I am talking to an interviewer for an engineering role related to AI agents. I am doing five things:

- Positioning my work in a sentence or two
- Describing a project with heavily changing requirements, and how I used data to get a team decision
- Describing a bug that was hard to find
- Stating two design principles I learned from building things
- Describing one mistake, and admitting what is not done yet

## What you can say in this situation

Every sentence below is adapted from a dictionary pattern. None of them is a dictionary example. For software terms such as runtime, flag, log, and merge, the learner's dictionary does not list the software sense, so the dictionary only supports the sentence pattern.

### 1. Positioning

| What I want to say | What works in this situation |
| --- | --- |
| 我負責優化公司的 AI agent 產品。 | I work on improving our company's AI agent product. |
| 我做的範圍包含 agent 的 runtime、工具、評估、記憶和成本控制。 | My work covers the agent runtime, tools, evaluation, memory, and cost control. |

**improve**: Oxford defines it as making something better than before ([improve](https://www.oxfordlearnersdictionaries.com/us/definition/english/improve)). The product already existed and my job is to make it better, so the verb is *improve*, not *build*. The difference matters: *I built the product* says I created it from nothing.

**cover**: Oxford has the sense "to include something; to deal with something", as in *The survey covers all aspects of the business* ([cover](https://www.oxfordlearnersdictionaries.com/us/definition/english/cover_1)).

### 2. Changing requirements and deciding with data

| What I want to say | What works in this situation |
| --- | --- |
| 這個功能四個月內方向改了五次。 | The direction of this feature changed five times in four months. |
| 我查了正式環境的資料，才說服團隊把上限定在 10 MB。 | I checked the production data, and that convinced the team to set the limit at 10 MB. |
| 一個 27 MB 的檔案跑了 29 分鐘，只有前 20 頁進到模型。 | A 27 MB file took 29 minutes, and only the first 20 pages reached the model. |

**direction, times**: Oxford's entry for direction has the sense of the way something develops, as in *a radical change of direction* ([direction](https://www.oxfordlearnersdictionaries.com/us/definition/english/direction)). Occasions are counted with times, as in *He failed his driving test three times* ([time](https://www.oxfordlearnersdictionaries.com/us/definition/english/time_1)).

**convince + person + to**: Oxford's example is *I've been trying to convince him to see a doctor* ([convince](https://www.oxfordlearnersdictionaries.com/us/definition/english/convince)). The phrase is *set a limit*, as in *The EU has set strict limits on levels of pollution* ([limit](https://www.oxfordlearnersdictionaries.com/us/definition/english/limit_1)). I did not find an example for *at* in *set the limit at 10 MB*.

**took 29 minutes**: Oxford's example is *It took her three hours to repair her bike* ([take](https://www.oxfordlearnersdictionaries.com/us/definition/english/take_1)). The dictionary sense of *reach* is arriving at a place, as in *They didn't reach the border until after dark* ([reach](https://www.oxfordlearnersdictionaries.com/us/definition/english/reach_1)). Using it for content reaching a model is my own extension.

### 3. A bug that was hard to find

| What I want to say | What works in this situation |
| --- | --- |
| 使用者換一個對話，agent 就什麼都不記得。 | When users started a new conversation, the agent forgot everything. |
| 這個 bug 沒有任何錯誤訊息，也沒有 log。 | There were no errors and no logs. |

A past problem takes the past simple, *started* and *forgot* ([forget](https://www.oxfordlearnersdictionaries.com/us/definition/english/forget)). Oxford's example for error is *There are too many errors in your work* ([error](https://www.oxfordlearnersdictionaries.com/us/definition/english/error)), and for the past it becomes *There were*.

### 4. Design principles

| What I want to say | What works in this situation |
| --- | --- |
| 可以恢復的錯誤要回給 agent，不要直接丟進錯誤追蹤。 | Recoverable errors should go back to the agent instead of going straight to error tracking. |
| 用 prompt 要求模型做的事，不等於保證。 | Telling the model to do something in a prompt is not a guarantee. |

**instead**: Oxford's sense is "in the place of somebody/something", as in *Lee was ill so I went instead* ([instead](https://www.oxfordlearnersdictionaries.com/us/definition/english/instead)). I did not extract an example of *instead of* followed by an -ing form.

**tell + person + to**: Oxford says tell is also used for giving instructions, as in *The doctor told me to stay in bed* ([tell](https://www.oxfordlearnersdictionaries.com/us/definition/english/tell)). Guarantee means promising that something will happen ([guarantee](https://www.oxfordlearnersdictionaries.com/us/definition/english/guarantee_1)). I checked the verb entry and did not check examples for the noun.

### 5. A mistake, and what is not done yet

| What I want to say | What works in this situation |
| --- | --- |
| 我改了旗標的語意，卻沒有同步前端。 | I changed the meaning of a flag but didn't update the frontend. |
| 我們在合併兩個月後才發現。 | We only found out two months after the merge. |
| 老實說，這部分我們還沒有系統性的評估。 | To be honest, we don't have a systematic evaluation for this yet. |

**the meaning of, update**: Oxford's examples are *What's the meaning of this word?* ([meaning](https://www.oxfordlearnersdictionaries.com/us/definition/english/meaning)) and *It's about time we updated our software* ([update](https://www.oxfordlearnersdictionaries.com/us/definition/english/update_1)).

**find out**: Oxford lists *find out (about something)* ([find](https://www.oxfordlearnersdictionaries.com/us/definition/english/find_1)). Using *only* for "not until then" is my own extension.

**To be honest … yet**: Oxford's examples are *To be honest, it was one of the worst books I've ever read* ([honest](https://www.oxfordlearnersdictionaries.com/us/definition/english/honest)), *I haven't received a letter from him yet* ([yet](https://www.oxfordlearnersdictionaries.com/us/definition/english/yet_1)), and *a systematic approach to solving the problem* ([systematic](https://www.oxfordlearnersdictionaries.com/us/definition/english/systematic)).

## Can I also say it this way?

| English | Who you say it to and when | Still the same meaning? |
| --- | --- | --- |
| I work on improving our company's AI agent product. | The product existed and you make it better | Main version |
| I built our company's AI agent product. | You created the product from nothing | Different: it overstates my role, so I cannot say this |
| That convinced the team to set the limit at 10 MB. | The data got the team to agree | Main version |
| I set the limit at 10 MB. | You decided alone | Different: the persuading is gone |
| There were no errors and no logs. | Describing that past bug | Main version |
| There are no errors and no logs. | The problem is still there | Different: the time is now |
| We only found out two months after the merge. | Stressing how late it was | Main version |
| We found out two months after the merge. | Just stating the time | Yes, without the "not until" tone |

## Say it again with different content

Read the Chinese, say it yourself, then check the reference.

1. 我負責優化公司 AI agent 產品的可靠性。
   - *I work on improving the reliability of our AI agent product.*
2. 設計前後改了五次。
   - *The design changed five times.*
3. 那讓團隊同意把逾時定在 180 秒。
   - *That convinced the team to set the timeout at 180 seconds.*
4. 現在 agent 跨對話都記得使用者。
   - *Now the agent remembers users across conversations.*
5. 我是查了正式環境的資料才發現的。
   - *We only found out when I checked the production data.*
6. 這是我們路線圖上的第一件事。
   - *It's the first thing on our roadmap.*

I wrote these six substitution sentences myself and did not check separate sources for them.

## A short dialogue

This is a practice example I wrote, not a real interview.

> A: Could you tell me what you do in your current role?
>
> B: I work on improving our company's AI agent product. My work covers the agent runtime, tools, evaluation, memory, and cost control.
>
> A: Tell me about a project where the requirements changed.
>
> B: The direction of one feature changed five times in four months. A 27 MB file took 29 minutes, and only the first 20 pages reached the model. I checked the production data, and that convinced the team to set the limit at 10 MB.
>
> A: What was your biggest mistake?
>
> B: I changed the meaning of a flag but didn't update the frontend. We only found out two months after the merge.

## Without looking at the English, how would you say it?

Rate yourself on whether you got the meaning across, not on matching the words exactly.

| Situation in Chinese | Reference | Reminder |
| --- | --- | --- |
| 定位：我負責優化公司的 AI agent 產品。 | I work on improving our company's AI agent product. | improve, not build |
| 定位：我做的範圍包含 agent 的 runtime、工具、評估、記憶和成本控制。 | My work covers the agent runtime, tools, evaluation, memory, and cost control. | cover means include |
| 講專案：這個功能四個月內方向改了五次。 | The direction of this feature changed five times in four months. | count with times |
| 講專案：我查了正式環境的資料，才說服團隊把上限定在 10 MB。 | I checked the production data, and that convinced the team to set the limit at 10 MB. | convince + person + to |
| 講專案：一個 27 MB 的檔案跑了 29 分鐘，只有前 20 頁進到模型。 | A 27 MB file took 29 minutes, and only the first 20 pages reached the model. | take + time |
| 講問題：使用者換一個對話，agent 就什麼都不記得。 | When users started a new conversation, the agent forgot everything. | past simple |
| 講 bug：這個 bug 沒有任何錯誤訊息，也沒有 log。 | There were no errors and no logs. | There were |
| 講原則：可以恢復的錯誤要回給 agent，不要直接丟進錯誤追蹤。 | Recoverable errors should go back to the agent instead of going straight to error tracking. | instead of + -ing |
| 講原則：用 prompt 要求模型做的事，不等於保證。 | Telling the model to do something in a prompt is not a guarantee. | tell + person + to |
| 講失誤：我改了旗標的語意，卻沒有同步前端。 | I changed the meaning of a flag but didn't update the frontend. | the meaning of |
| 講失誤：我們在合併兩個月後才發現。 | We only found out two months after the merge. | find out |
| 承認缺口：老實說，這部分我們還沒有系統性的評估。 | To be honest, we don't have a systematic evaluation for this yet. | yet at the end |

## Still to verify

I have not found suitable sources for these, so I am not stating them as settled:

- How runtime, flag, log, merge, and error tracking are used in spoken English on software teams: the learner's dictionary does not list these senses, and I did not check technical documentation this time
- The preposition in *set the limit at* + a number
- Direct examples for *instead of going* and *is not a guarantee*
- Which version is more common: that needs a corpus query, which I did not run

## Overall

Of the twelve, the two positioning sentences are worth practicing first, because every interview opens with them and mixing up *improve* and *build* misstates my own role. Next are *convinced the team to* and *To be honest … yet*. All the sources are learner's dictionaries, which support meaning and sentence patterns but do not cover the software terms. There was no native-speaker testing and no frequency comparison, so this post only says "works in this situation".

## References

- [Oxford Learner's Dictionaries: improve](https://www.oxfordlearnersdictionaries.com/us/definition/english/improve): make something better
- [Oxford Learner's Dictionaries: cover](https://www.oxfordlearnersdictionaries.com/us/definition/english/cover_1): include, deal with
- [Oxford Learner's Dictionaries: direction](https://www.oxfordlearnersdictionaries.com/us/definition/english/direction): the way something develops
- [Oxford Learner's Dictionaries: time](https://www.oxfordlearnersdictionaries.com/us/definition/english/time_1): occasions
- [Oxford Learner's Dictionaries: convince](https://www.oxfordlearnersdictionaries.com/us/definition/english/convince): convince somebody to do something
- [Oxford Learner's Dictionaries: limit](https://www.oxfordlearnersdictionaries.com/us/definition/english/limit_1): set a limit
- [Oxford Learner's Dictionaries: take](https://www.oxfordlearnersdictionaries.com/us/definition/english/take_1): take + time
- [Oxford Learner's Dictionaries: reach](https://www.oxfordlearnersdictionaries.com/us/definition/english/reach_1): arrive at
- [Oxford Learner's Dictionaries: forget](https://www.oxfordlearnersdictionaries.com/us/definition/english/forget): past simple forgot
- [Oxford Learner's Dictionaries: error](https://www.oxfordlearnersdictionaries.com/us/definition/english/error): examples with error
- [Oxford Learner's Dictionaries: instead](https://www.oxfordlearnersdictionaries.com/us/definition/english/instead): in the place of
- [Oxford Learner's Dictionaries: tell](https://www.oxfordlearnersdictionaries.com/us/definition/english/tell): tell somebody to do something
- [Oxford Learner's Dictionaries: guarantee](https://www.oxfordlearnersdictionaries.com/us/definition/english/guarantee_1): promise that something will happen
- [Oxford Learner's Dictionaries: meaning](https://www.oxfordlearnersdictionaries.com/us/definition/english/meaning): the meaning of
- [Oxford Learner's Dictionaries: update](https://www.oxfordlearnersdictionaries.com/us/definition/english/update_1): examples with update
- [Oxford Learner's Dictionaries: find](https://www.oxfordlearnersdictionaries.com/us/definition/english/find_1): find out
- [Oxford Learner's Dictionaries: honest](https://www.oxfordlearnersdictionaries.com/us/definition/english/honest): to be honest
- [Oxford Learner's Dictionaries: yet](https://www.oxfordlearnersdictionaries.com/us/definition/english/yet_1): yet in negative sentences
- [Oxford Learner's Dictionaries: systematic](https://www.oxfordlearnersdictionaries.com/us/definition/english/systematic): a systematic approach
