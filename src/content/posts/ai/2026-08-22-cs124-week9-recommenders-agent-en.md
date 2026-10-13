---
title: "Collaborative Filtering and LLM Agents: From Movie Similarity to Search and Memory Tools | Stanford CS124 Week 9"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, recommender-system, ai-agent, llm]
lang: en
series: { name: "Reading Stanford CS124", order: 10 }
tldr: "Week 9 teaches recommender systems: content-based recommendation looks at the features of items, while collaborative filtering looks only at the ratings matrix and estimates unrated items from similar users or similar items. PA7 writes item-item collaborative filtering as a function and hands it to an LLM agent that makes tool calls, then adds ticket booking, web search and memory."
description: "A guide to Stanford CS124 Winter 2026 Week 9: formalizing the recommendation problem, content-based recommendation, user-user and item-item collaborative filtering, why ratings are mean-centered, prediction by weighted average, a hand-worked run of the simplified version PA7 uses, evaluation and societal effects; the three parts of PA7 and how a ReAct agent works; and Lab 5's classroom AI policy exercise. Based on the 2026 slides, the PA7 repo and the labs repo."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs124-week9-recommenders-agent)

This is Week 9 of [Reading Stanford CS124](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en). The data changes from text to people's behavior: who gave which movie how many stars. The question is: **how do you guess whether someone will like something they have not seen?**

It is also the week of PA7, the last assignment of the course. PA7 wraps this week's recommendation algorithm as a tool and gives it to an LLM agent.

**This week's material**: the [Recommender Systems and Collaborative Filtering slides](https://web.stanford.edu/class/cs124/lec/collaborativefiltering26.pdf), [Lab 5](https://github.com/cs124/labs/blob/main/Lab5_LargeLanguageModels.md) and [PA7](https://github.com/cs124/pa7-agent). The assigned reading is [Chapter 9 of *Mining of Massive Datasets*](http://infolab.stanford.edu/~ullman/mmds/ch9.pdf). The pre-recorded videos are on Canvas, so this post follows the slides.

## What the recommendation problem looks like

Recommendations come at three levels: hand-curated editorial lists, simple aggregates (most popular, recent uploads), and recommendations tailored to each person. This week is about the third.

The slides give two reasons to learn this. One is practical: news and product recommendation depend on it. The other is understanding how misinformation spreads: what a platform recommends decides what a great many people see.

Formally there is a set of users, a set of items and a **utility matrix**: one row per user, one column per item, with a rating in each cell. This matrix is **almost entirely empty**, because most people have not rated most items. The job of a recommender is to fill in the blanks and recommend the items with high predicted ratings.

Where do the ratings come from? Asking people to rate things does not work well, because most cannot be bothered. In practice ratings are mostly inferred from behavior: buying, watching to the end or reading something is taken as a high rating.

All those blanks create the **cold start** problem: a new item has no ratings and a new user has no history, and there is nothing to go on for either.

## Approach one: content-based recommendation

The idea is to recommend items whose **content is similar** to what this person liked before. Someone plays Ella Fitzgerald, whose database entry reads "jazz, mid-20th century, vocal," Louis Armstrong's entry is very similar, so he is suggested.

The method builds a feature vector for each item (genre, director and actors for a movie; for text, the important words picked by Week 4's tf-idf) and then averages the vectors of the items a user liked to get a vector for that user. The two kinds of vectors have the same dimensions, so you take the cosine directly and recommend the closest items.

Advantages: it needs no data on other users, it can recommend new and unpopular items, and it can explain a recommendation (because you like this director).

Disadvantages: good features are hard to find, especially for images and music; it only recommends things much like what you already liked and never steps outside; and it cannot use other people's judgments of quality.

## Approach two: collaborative filtering

Collaborative filtering ignores the content of items entirely and looks only at the utility matrix.

### User-user

The idea: find people whose ratings resemble yours and recommend what they liked that you have not seen.

Each user is a row of the matrix, and the similarity of two people is again the cosine. But computing it directly has a problem. The slides' example has three people: A hates Star Wars, C loves it, and B has not seen it. Intuitively A and C have opposite tastes, and A and B at least do not conflict. But treating blanks as 0 and taking the cosine gives 0.380 for A and B and 0.322 for A and C, almost no difference. The reason is that low and high ratings are both positive numbers and point the same way in the vector, while a blank's 0 looks like a stronger dislike than the lowest rating.

The fix is **mean-centering**: subtract each person's own average rating from each of their ratings. Then:

- Ratings above a person's average become positive and those below become negative. People with opposite tastes get vectors pointing in opposite directions.
- Blanks stay 0, which now means "no information" instead of "the lowest rating."
- It also handles the fact that people rate on different scales: some give everything a 4 or 5 and others are strict.

The slides add one more step: compute the similarity using only the items **both** people rated. Worked by hand:

- User x's ratings: [1, blank, blank, 1, 3], with mean 5/3
- User y's ratings: [1, blank, 2, 2, blank], with mean 5/3

After subtracting the means, x becomes [−2/3, blank, blank, −2/3, 4/3] and y becomes [−2/3, blank, 1/3, 1/3, blank].

Both rated the first and fourth items, so only [−2/3, −2/3] and [−2/3, 1/3] are compared:

- dot product = 4/9 − 2/9 = 2/9
- the lengths are √(8/9) and √(5/9)
- cosine = (2/9) ÷ (√40 ÷ 9) ≈ 0.32

(The final number is my own calculation following the slides' steps.)

With similarities in hand, predict x's rating for an item: find the k users most similar to x who rated that item and take a **weighted average** of their ratings, with the similarities as weights. The more someone resembles you, the more their opinion counts.

### Item-item

Turn it around: look for similar items instead of similar people. Each item is a column of the matrix (or a row, if you flip the matrix), and two movies are similar when **the same people rate them alike**.

To predict your rating for movie i: among the movies you have rated, find the ones most similar to i and take a weighted average of the ratings you gave them.

The slides' example predicts user 5's rating for movie 1. Among the movies user 5 has rated, the two most similar to movie 1 are movie 3 (similarity 0.658, rated 2) and movie 6 (similarity 0.768, rated 3):

prediction = (0.658 × 2 + 0.768 × 3) ÷ (0.658 + 0.768) = 3.62 ÷ 1.426 = 2.54

The slides say that in practice item-item often works better than user-user. The reason given is that items are simpler, while one person has several tastes.

### Pros and cons of collaborative filtering

The advantage is that it works for any kind of item with no feature design.

The disadvantages:

- **Cold start**: there have to be enough users in the system to find a match.
- **Sparsity**: it is hard to find users who rated the same items.
- **First rater**: an item nobody has rated can never be recommended.
- **Popularity bias**: it tends to recommend what everyone watches, and people with unusual tastes are served poorly.
- **Societal consequences**: it can lead to filter bubbles and radicalization spirals.

## The simplified version PA7 uses, worked by hand

One section of the slides explains that PA7's dataset is tiny, so the TAs recommend a simplified version:

1. Similarity is plain cosine, with **no mean-centering** and no restriction to items both rated.
2. The predicted score is **not divided by the sum of similarities**. It is just a sum. The resulting number is not a predicted rating on a one-to-five scale and is used only for ranking.

Lab 5 adds a third point: a user's data is a list of movies they like, turned into a vector of 0s and 1s.

Lab 5 has a complete small example with this data (blanks count as 0):

| | U1 | U2 | U3 | U4 |
|---|---|---|---|---|
| **M1** | 1 | 5 | 3 | |
| **M2** | | | 5 | 4 |
| **M3** | 2 | 4 | | 1 |
| **M4** | | 2 | 4 | |
| **M5** | | 4 | 3 | 4 |
| **M6** | 1 | | 3 | |

Each row is a movie. A new user likes M3 and M5. Which movie should be recommended?

**Step one, compute the cosine between movies.** The handout supplies most of the values and leaves three for students. Take M1 and M3 (the three below are my calculations):

- M1 = [1, 5, 3, 0], M3 = [2, 4, 0, 1]
- dot product = 1×2 + 5×4 + 3×0 + 0×1 = 22
- lengths: √35 = 5.92 and √21 = 4.58
- sim(M1, M3) = 22 ÷ (5.92 × 4.58) = **0.81**

In the same way, sim(M1, M5) = 29 ÷ (5.92 × 6.40) = **0.77** and sim(M5, M6) = 9 ÷ (6.40 × 3.16) = **0.44**.

**Step two, score each candidate movie.** The score is the sum of its similarities to every movie the user likes. This user likes M3 and M5:

| Candidate | Similarity to M3 | Similarity to M5 | Score |
|---|---|---|---|
| M1 | 0.81 | 0.77 | 1.58 |
| M4 | 0.39 | 0.70 | 1.09 |
| M2 | 0.14 | 0.76 | 0.90 |
| M6 | 0.14 | 0.44 | 0.58 |

(The handout's example lists only M1, M2 and M6 as candidates. M4 is included here as well, and the conclusion is the same.)

**Step three, recommend the highest score: M1.**

The raw data shows why. U2 rated M1, M3 and M5 as 5, 4 and 4, all high. Someone who likes M3 and M5 has tastes close to U2's, and U2 also likes M1. Nothing about the content of any movie was used along the way.

## Evaluation, and what can go wrong

Evaluation hides some of the known ratings, has the system predict them, and compares the predictions with the true ratings. A common metric is RMSE (take the difference between prediction and truth, square it, average, and take the square root).

The slides then ask a more basic question: **is predicting what the user will watch the right objective?** They present the approach YouTube published in 2016: represent every video and user as an embedding and train a huge neural network to predict the next video the user will watch. The system is trained to maximize watching, and the content that keeps people watching is not necessarily true or good for them.

The slides list the known societal problems of recommender systems: the spread of misinformation and propaganda, filter bubbles, inappropriate content, opacity and violations of privacy. They quote a former YouTube engineer who says he realized very fast that the recommendation system was putting people into filter bubbles with no way out.

## PA7: handing the recommender to an agent

**[PA7](https://github.com/cs124/pa7-agent)** builds a customer service agent for movie tickets. It requires teams of three or four, allows no late days, and is worth 18% of the grade. (The points below follow the README, where the three parts add up to 107. The Lab 4 handout says 100 points plus 5 extra credit, so the two documents disagree.)

### Part 1: a tool-using agent (68 points)

**The recommendation tool (21 points).** Implement `similarity` and `recommend_movies` in `agent.py`, the procedure worked by hand above. The data is a movie ratings matrix with one row per movie and one column per user. The README gives an example you can check against: recommending 3 movies to the user Peter should return **exactly** Back to the Future, Raiders of the Lost Ark and Star Wars: Episode VI, in that order.

**Connecting tools to the agent (27 points).** This uses DSPy's `ReAct`. You do two things: write out the agent's objective clearly in its description, and add the tools to the list:

```python
react_agent = dspy.ReAct(
    MovieTicketAgent,
    tools = [
        recommend_movies,
        general_qa,
    ]
)
```

ReAct works by **interleaving reasoning and tool calls**. When the user says "My name is Peter, recommend 3 movies to me," the agent's trace reads:

1. **Thought**: I need to recommend 3 movies to Peter, so I will use `recommend_movies`.
2. **Call**: `recommend_movies(user_name="Peter", k=3)`.
3. **Observation**: a list of three movies comes back.
4. **Thought**: the recommendation is done, so next I will ask whether he wants to book a ticket.
5. **Call** `finish`, and stop.

Finally the agent turns the whole process into one reply to the user.

The division of labor here is worth seeing clearly. Computing similarities and ranking is deterministic computation, left to a Python function. Deciding which tool to use now, what arguments to pass and how to tell the user the result is left to the LLM. The LLM never computes on that matrix itself.

**Interfacing with databases (20 points).** Implement `book_ticket`: booking a ticket has to update the ticket database and deduct the price from the user's balance. Requests the agent cannot handle have to be passed to human customer support by calling `file_request`.

### Part 2: real-world extensions (32 points)

**Web search (8 points).** An LLM does not know what happened after its training, such as a movie about to be released. A search API (through SerpAPI) is connected so the agent can look things up. This is another form of Week 4's RAG, with the whole web as the source instead of a fixed document collection.

**Memory (24 points).** Up to this point the agent is stateless: you have to tell it who you are in every interaction. Memory is added with the Mem0 library so that it remembers past interactions.

### Part 3: reflection (7 points)

Answer several reflection questions on Gradescope.

### Some practical matters

- **API credit.** You need a Together AI key (creating it may require payment information) and a SerpAPI key (a free account comes with 250 searches). The README repeats that every run of the interactive interface uses up credit, so test your functions in isolation first, with commands like `python test_functions.py --function similarity`.
- **Nondeterminism.** The README has a section on this: LLM-based systems are not deterministic, and the agent may occasionally behave unexpectedly even when it is generally correct. When testing, read the full trajectory to confirm it called the right tools.
- **Grading.** Deterministic functions are graded by an ordinary autograder. The other items are first graded by an LLM, and if the LLM takes off any points at all, the result goes to the TAs for manual review. The grading prompts are public.

## Lab 5

**[Lab 5](https://github.com/cs124/labs/blob/main/Lab5_LargeLanguageModels.md)** has two parts. The first is the collaborative filtering calculation above, and the handout links a spreadsheet and solutions, with a separate [solutions file](https://github.com/cs124/labs/blob/main/Lab5_LargeLanguageModels_Solutions.md) in the repo.

The second part takes most of the session, and its subject is **how AI use in a class should be regulated**. Stanford has university-wide guidance but leaves the specifics to each instructor, so students have to track a different set of rules for every class they take. The activity has four steps:

1. **Judge the gray areas.** Five scenarios, each to be marked acceptable, unacceptable or "it depends." For example: a student pastes an error message into ChatGPT, applies the suggested fix and it works, but is not sure they could reproduce it; a non-native English speaker uses AI to polish the grammar of an essay whose ideas are entirely their own; a TA drafts feedback for students with an LLM and then reviews and edits it.
2. **Draft a policy.** Half the groups write one for CS124 and the other half for the required writing course. It has to state concretely what uses are allowed and prohibited, whether disclosure is required, the consequences of a violation, and the rationale.
3. **Swap and find the holes.** Find a way to comply with the policy on paper while undermining the learning objective, find the edge cases (a student with a disability who uses AI as an accessibility tool; a student who can afford better models), and find a phrase two reasonable people could read differently.
4. **Share out with the whole class.**

The handout's conclusion is that no single AI policy works for every class, because the policy should follow from the course's **learning objective**. In a writing class the written output is the learning. In a programming class the output demonstrates the learning. The two need different rules.

## Self-check

1. Use the Lab 5 data to compute sim(M2, M4). Answer: M2 = [0, 0, 5, 4] and M4 = [0, 2, 4, 0]. The dot product is 20, the lengths are √41 = 6.40 and √20 = 4.47, and the cosine is 20 ÷ 28.6 = 0.70, matching the value in the handout's table.
2. If the new user likes only M2, which movie does the simplified version recommend? Answer: look at M2's similarity to the others: M1 0.40, M3 0.14, M4 0.70, M5 0.76, M6 0.74. The highest is M5.
3. A user rates three movies 5, 5 and 2. What are the ratings after mean-centering? Answer: the mean is 4, so they become [1, 1, −2].
4. Predict with item-item: a user has rated two similar movies, with similarities 0.5 and 1.0 and ratings 4 and 1. What is the predicted rating? Answer: (0.5×4 + 1.0×1) ÷ 1.5 = 2.0. The more similar movie got the low rating, which pulls the prediction down.
5. In PA7, who is responsible for computing the similarity of two movies, and who for deciding whether to call the recommendation tool? Answer: the first is the Python function you wrote. Its result is deterministic and can be checked with unit tests. The second is the LLM. Its behavior can vary from run to run and has to be checked by reading the trajectory.

## How this week connects to later ones

- This week uses a ratings matrix to judge which items matter and which are alike. Next week uses links: the hyperlinks between web pages decide which pages matter.
- PA7 is the last requirement of the course. There is no final exam.

**Series navigation**: previous, [Week 8: Speech and the PA7/Git Lab](/posts/ai/2026-08-22-cs124-week8-speech-git-en) | next, [Week 10: PageRank and Social Networks](/posts/ai/2026-08-22-cs124-week10-pagerank-networks-en)

## Update Log

- 2026-10-13: Rewritten from the 2026 public slides. The slide source changed from an old 2021 file to the version the official schedule now links, and the Lab 5 link changed from a dead old filename to `Lab5_LargeLanguageModels.md`. Added content-based recommendation, a hand-worked mean-centering example, the item-item prediction example, a full hand-worked run of PA7's simplified version, the steps of ReAct, Lab 5's AI policy activity and a self-check.

## References

- [CS124 Winter 2026 course site and schedule](https://web.stanford.edu/class/cs124/)
- [Recommender Systems and Collaborative Filtering slides](https://web.stanford.edu/class/cs124/lec/collaborativefiltering26.pdf) — content-based recommendation, the two kinds of collaborative filtering, the simplified version for the PA, evaluation and societal effects
- [CS124 PA7](https://github.com/cs124/pa7-agent) — the points for the three parts, the Peter example, the ReAct setup, API keys, grading
- [CS124 Lab 5](https://github.com/cs124/labs/blob/main/Lab5_LargeLanguageModels.md) — the small collaborative filtering example and the AI policy activity
- [Mining of Massive Datasets, Chapter 9](http://infolab.stanford.edu/~ullman/mmds/ch9.pdf)
