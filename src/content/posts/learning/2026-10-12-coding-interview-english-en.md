---
title: "Talking While You Code in an Interview: Fourteen Sentences for Checking the Question, Explaining an Approach, Stating Complexity, and Testing Your Own Code"
date: 2026-10-12
category: learning
type: guide
tags: [english-speaking, english, speaking, language-learning]
lang: en
description: "A coding interview means solving a problem and explaining it in English at the same time. This post collects fourteen sentences from Google's example interview video, Meta's official preparation guide, a university careers guide to technical interviews, and the Tech Interview Handbook: how to check the question, how to state the simplest solution and its complexity, how to compare two approaches, and how to test your own code. Six are quoted from the sources and eight are adapted from source sentences."
tldr: "After hearing the question, say So you're looking for…? and ask Is the input array sorted? Start with The simplest solution is just…, then I think that would be quadratic. For two options: I could do this with…, or… When the code is written: Let me go through some examples to make sure this is correct. For asking for a hint when stuck, the sources give advice but no example sentence."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-10-12-coding-interview-english)

My three earlier interview posts ([general patterns](/posts/learning/2026-10-07-interview-experience-english-en), [my own stories](/posts/learning/2026-10-07-interview-agent-stories-english-en), and [what the teaching materials cover](/posts/learning/2026-10-08-interview-english-from-teaching-materials-en)) all dealt with behavioral interviews: introducing myself, describing projects, asking questions. A large part of an engineering interview is writing code on the spot, and I had not practiced a single sentence for that part.

## What I was trying to say

A coding interview is not about solving the problem in silence. [Meta's official preparation guide](https://www.metacareers.com/blog/preparing-for-your-software-engineering-interview-at-meta/) puts this first in its list:

> Think out loud. We pay a lot of attention to the way you solve problems, which can be as important as having the right answer.

So what I need to practice is what to say at four points:

1. After hearing the question, to check that I understood it
2. Before I start, to explain how I plan to solve it and why
3. While writing, to say what I am doing
4. After writing, to test it myself

I can say all of this in Chinese. In English I am left with *um* and long silences.

I read the body text of four kinds of sources this time:

- An employer's official demonstration: Google's [Example Coding/Engineering Interview](https://www.youtube.com/watch?v=XKu_SEDAykw) video, in which two Google engineers act out an interview. I read the automatic captions, up to about the point where the code is written and the candidate starts checking it
- An employer's official guide: the Meta Careers page on preparing for the software engineering interview
- University careers guidance: Northeastern University's [Interview Type: Technical](https://careers.northeastern.edu/resources/interview-type-technical/), which gives sentences you can say as written
- A community resource for software interviews: the Tech Interview Handbook's [Coding interview cheatsheet](https://www.techinterviewhandbook.org/coding-interview-cheatsheet/)

```youtube
url: https://www.youtube.com/watch?v=XKu_SEDAykw
title: Life at Google: Example Coding/Engineering Interview (Google engineers act out a coding interview)
```

There are no language teaching materials this time. The interview units from the BBC and the British Council teach self-introductions and behavioral questions, and have nothing on coding interviews.

## What you can say in this situation

### 1. After hearing the question, check it

| What I want to say | What works in this situation | Relation to the source |
| --- | --- | --- |
| 所以你要找的是兩個加起來等於 8 的數字？ | So you're looking for a pair of numbers that add up to eight? | Adapted |
| 我可以假設這些數字放在一個陣列裡嗎？ | Can I assume that they're in an array? | Adapted |
| 輸入會有負數嗎？ | Does the input include negative numbers? | Quoted |
| 輸入的陣列有排序過嗎？ | Is the input array sorted? | Quoted |
| 要優先考慮速度還是記憶體？ | Do I need to optimize for speed or memory? | Quoted |

The first two come from Google's example interview. After hearing the question, the candidate says *I guess what I'm trying to figure out is, you're looking for a pair of numbers that add up to eight*, and I replaced the opening with *So*. The candidate then asks *can I assume that they're like in memory, an array or something*, and the interviewer uses the same word in the answer: *you can assume they'll always be integers*. [Cambridge defines assume](https://dictionary.cambridge.org/us/dictionary/english/assume) as accepting something to be true without proof, with the example *Let's assume that they're coming*.

*Is the input array sorted?* is quoted from the Tech Interview Handbook, which states its purpose plainly: deciding between binary search and linear search. The handbook also asks for at least two or three questions:

> Do not jump into coding right away. Coding questions tend to be vague and underspecified on purpose to allow the interviewer to gauge the candidate's attention to detail and carefulness. Ask at least 2-3 clarifying questions.

The sentences about negative numbers and about speed or memory are quoted from the Northeastern University page. The same passage also has *Is it always valid input?* and *Is this meant to scale to millions of users?*.

### 2. Before you start, explain the approach and the trade-off

| What I want to say | What works in this situation | Relation to the source |
| --- | --- | --- |
| 最簡單的解法就是把每一組可能的配對都比過一遍。 | The simplest solution is just comparing every single possible pair. | Adapted |
| 我想那樣會是平方時間。 | I think that would be quadratic. | Adapted |
| 我可以用雜湊表來快速查找，或是先排序再用二分搜尋。 | I could do this with a hash table for fast lookups, or sort the data and use binary search. | Quoted |
| 我會先把陣列排序，再用兩個指標。 | I'd approach this by first sorting the array, then using two pointers. | Adapted |
| 可以的話，我想用 Python。 | I prefer Python, if that's okay. | Adapted |

The candidate in Google's example interview does not jump straight to the best solution. The candidate first says *the simplest solution of course is just comparing every single possible pair*, judges it right away with *that's obviously not very efficient*, and then says *I think that that would be quadratic*. My cards drop *of course* and the repeated *that*.

There is a habit here I did not know about: **the candidate almost never reads out O notation when talking about complexity**. Throughout that passage the words are *quadratic*, *linear*, *an n log n solution*, and *a constant time lookup*.

The sentence comparing two approaches is quoted from Northeastern University, where it continues with *I think hash table is simpler here because…*. The same page gives a pattern for describing steps, *I'd approach this by first [step 1], then [step 2]. I'd do this because…*; sorting and two pointers are content I filled in myself.

For choosing a language, the interviewer in the example interview asks *what coding language would you prefer to do this in*, and the candidate answers *I prefer C++ if that's okay*. I changed it to Python.

### 3. While writing

| What I want to say | What works in this situation | Relation to the source |
| --- | --- | --- |
| 我只需要掃過一次，所以是線性的解法。 | I just need to scan it one time, so it's a linear solution. | Adapted |
| 確切的語法我不記得，但我記得它是這樣運作的。 | I don't know the exact syntax, but I remember it works like this. | Quoted |

The first sentence is the answer to the interviewer's follow-up about why this is faster than binary search. The words in the captions are *in this case I just need to do that moving, scanning the one time, so it's linear solution*, a sentence formed while thinking, and I tidied it into one complete sentence.

The second sentence is quoted from Northeastern University, from the passage about not bluffing, where it continues with *Let me think through the logic…*. This actually happens in the example interview: the candidate forgets which method adds an element to a C++ unordered set, says *I don't remember, I think it's add for an unordered set… it's either add or insert or something*, and keeps writing.

### 4. After writing, test it yourself

| What I want to say | What works in this situation | Relation to the source |
| --- | --- | --- |
| 我跑幾個例子，確認這樣是對的。 | Let me go through some examples to make sure this is correct. | Adapted |
| 如果輸入是空的，會發生什麼事？ | If the input is empty, what happens? | Quoted |

After writing the code, the candidate in the example interview says *I feel like I probably need to go through an example… to make sure that this is correct*, and then *let me go through some examples to make sure*. I merged the two into one sentence. Later the candidate also checks the empty input unprompted: *what happens with an empty…*.

The Tech Interview Handbook states this step as a rule:

> Once you are done coding, do not announce that you are done. Interviewers expect you to start scanning for mistakes and adding test cases to improve on your code.

Meta's guide asks for the same thing: *Find and fix the bugs by yourself. Don't wait for the interviewer to find them for you.*

## Can I also say it this way?

| English | Who you say it to and when | Still the same meaning? |
| --- | --- | --- |
| Do I need to optimize for speed or memory? | Asking whether the interviewer cares about time or space | Main version |
| Is this meant to scale to millions of users? | Asking about the size of the data | Different: it asks about scale, not the trade-off (quoted from Northeastern) |
| I could do this with a hash table…, or sort the data… | Setting two approaches side by side | Main version |
| I could do X, but Y might be faster because… | You already lean toward one of them | Different: it carries a preference and a reason (Northeastern's pattern) |
| I don't know the exact syntax, but I remember it works like this. | You forgot how it is written but remember what it does | Main version |
| I haven't worked with that library before, but I'd approach it by… | You have never used it | Different: it admits you have not used it, then gives an approach (quoted from Northeastern) |

## Say it again with different content

Read the Chinese, say it yourself, and then look at the reference version.

1. 所以你要找的是清單裡最長的單字？
   - *So you're looking for the longest word in the list?*
2. 我可以假設它們已經排序了嗎？
   - *Can I assume that they're sorted?*
3. 輸入會有重複的值嗎？
   - *Does the input include duplicates?*
4. 最簡單的解法就是把每一個可能的子字串都檢查一遍。
   - *The simplest solution is just checking every single possible substring.*
5. 我會先數每個字母出現幾次，再比較次數。
   - *I'd approach this by first counting each letter, then comparing the counts.*
6. 我需要先排序，所以是 n log n 的解法。
   - *I need to sort it first, so it's an n log n solution.*
7. 如果輸入只有一個元素，會發生什麼事？
   - *If the input has only one element, what happens?*

All seven are source sentences with the content changed by me; none is quoted from a source.

## A short dialogue

This is a practice example I wrote myself. It is not a real interview and not the conversation in the source video.

> A: I'll give you a list of numbers and a target. Tell me if any two of the numbers add up to the target.
>
> B: So you're looking for a pair of numbers that add up to the target?
>
> A: That's right.
>
> B: Is the input array sorted? And does the input include negative numbers?
>
> A: It's not sorted, and yes, there can be negative numbers.
>
> B: The simplest solution is just comparing every single possible pair. I think that would be quadratic.
>
> A: Can we do better?
>
> B: I could do this with a hash table for fast lookups, or sort the data and use binary search.
>
> A: Let's go with the hash table.
>
> B: Let me go through some examples to make sure this is correct.

The last line is said after the code is written. *Can we do better?* is the sentence the Tech Interview Handbook mentions interviewers often use to ask for a better solution.

## Without looking at the English, how would you say it?

The standard for rating yourself is whether you can get the meaning across, not whether the words match exactly.

| 中文情境 | Reference version |
| --- | --- |
| 用自己的話確認題目 | So you're looking for a pair of numbers that add up to eight? |
| 確認一個假設 | Can I assume that they're in an array? |
| 問有沒有負數 | Does the input include negative numbers? |
| 問有沒有排序 | Is the input array sorted? |
| 問要優先考慮什麼 | Do I need to optimize for speed or memory? |
| 先講最簡單的解法 | The simplest solution is just comparing every single possible pair. |
| 說它的複雜度 | I think that would be quadratic. |
| 並列兩種做法 | I could do this with a hash table for fast lookups, or sort the data and use binary search. |
| 講步驟 | I'd approach this by first sorting the array, then using two pointers. |
| 選語言 | I prefer Python, if that's okay. |
| 說明為什麼比較快 | I just need to scan it one time, so it's a linear solution. |
| 忘了語法 | I don't know the exact syntax, but I remember it works like this. |
| 寫完先自己驗 | Let me go through some examples to make sure this is correct. |
| 檢查空輸入 | If the input is empty, what happens? |

## Still to verify

- **How to ask for a hint when stuck.** Meta's guide says *If you are stuck, ask questions*, and the Tech Interview Handbook notes that when interviewers speak they are usually giving a hint, but none of these sources shows how to ask. I did not make a card for this.
- **How to read O notation aloud.** The engineer in the example interview gets by with words like *quadratic* and *linear*. I did not find a source for how to say O(n) when you do need to read it out.
- **Accuracy of the automatic captions.** The quotations from the Google video come from automatic captions, which have no punctuation and may misrecognize individual words. I did not check each sentence against the audio.
- **British and American differences.** Three of the sources are American companies and a university, and the Tech Interview Handbook is a community resource by an individual author. There is no British source, and no source explains regional differences in usage.
- **Transcripts of real interviews.** interviewing.io publishes transcripts of mock interviews. I only read fragments in search results, not the full pages, so I did not use them as evidence.
- **What is not done yet.** How to respond to follow-up questions and how to ask for time to think are in [the next post](/posts/learning/2026-10-12-interview-thinking-time-english-en), and system design interviews are in [the one after that](/posts/learning/2026-10-12-system-design-interview-english-en).

## Overall

Of the fourteen sentences, six are quoted from the sources and eight are source sentences that I tidied or filled with different content. The five for checking the question are the ones to practice first, because every question needs them, and because they are questions: once you say one, the other person replies, and you do not have to carry the whole stretch alone.

The biggest difference from the earlier posts is that the sources include one complete example interview. It showed me something the written materials do not say: the engineer in the demonstration does not speak fluently. The candidate often restarts a sentence halfway through and admits on the spot to having forgotten the syntax, yet says what they are thinking at every step. What needs practice is saying the thinking out loud, not making each sentence polished.

As for evidence, there are no language teaching materials this time, no testing with native speakers, and no frequency comparison. Whether these sentences work rests on one official example interview, one university guide, and one community handbook.

## References

- [Life at Google: How to: Work at Google — Example Coding/Engineering Interview](https://www.youtube.com/watch?v=XKu_SEDAykw): the actual dialogue of an example interview; checking the question, the simplest solution, how complexity is stated, testing your own code
- [Meta Careers: Preparing for your software engineering interview at Meta](https://www.metacareers.com/blog/preparing-for-your-software-engineering-interview-at-meta/): the expectations to think out loud, find your own bugs, and ask questions when stuck
- [Northeastern University: Interview Type: Technical](https://careers.northeastern.edu/resources/interview-type-technical/): sentences for checking the input, comparing two approaches, describing steps, forgetting syntax, and checking empty input
- [Tech Interview Handbook: Coding interview cheatsheet](https://www.techinterviewhandbook.org/coding-interview-cheatsheet/): questions for checking the problem, and the rule to check your own code before saying you are done
- [Cambridge Dictionary: assume](https://dictionary.cambridge.org/us/dictionary/english/assume): the definition of assume and its example
