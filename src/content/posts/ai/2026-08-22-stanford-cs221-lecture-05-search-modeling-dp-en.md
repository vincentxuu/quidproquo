---
title: "CS221 Lecture 5: Search I: Define the State Before Choosing the Algorithm"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: en
series:
  name: "Reading Stanford CS221"
  order: 6
tldr: "Lecture 5 models search with states, actions, successors, and costs, then uses acyclic dynamic programming to show that an efficient algorithm still solves the wrong problem when state omits information needed by the future."
description: "A lecture-by-lecture reading of Stanford CS221 Autumn 2025 Lecture 5, following the official executable artifact, examples, and limitations."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs221-lecture-05-search-modeling-dp)

This article covers **Stanford CS221, Autumn 2025, Lecture 5**, taught by Percy Liang on 2025-10-06. The [course site](https://stanford-cs221.github.io/autumn2025/) provides the schedule and assignments; this article follows the code and prose order of the [executable search artifact](https://stanford-cs221.github.io/autumn2025-lectures/?trace=search).

> Material gap: the source provides this executable lecture only. This article does not fill in route-assignment solutions, other lecture slides, or experiments not shown in the source.

## Motivation: why search still matters

The previous lecture was machine learning: a learning algorithm maps training data `{(input, output)}` to a predictor, and a predictor maps an input to a number or class. Real problems often require more than a one-step reflex. They require reasoning: thinking, problem solving, and planning. This lecture turns to search, one form of reasoning in a deterministic world.

The examples are concrete: find a sequence of moves that solves a Rubik's cube, or find the shortest path from A to B. These are not single-shot predictions; they require finding a route through possible action sequences. That is why the lecture starts with representation before algorithms.

There is an important historical boundary. Symbolic AI started with search in the 1950s, and the source explicitly says that “didn't pan out.” The question is therefore not whether early search was a universal answer, but whether search remains useful today. The lecture cites Rich Sutton's 2019 [The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html): general methods that leverage computation tend to win, and the two methods identified as scaling in this way are search and learning.

The source keeps the claim narrow: search is increasingly important, for example in test-time compute for language models, but learning is needed too. It does not say that search replaces learning. Learning can provide useful costs or preferences; search can then find a solution under those costs.

## Define the search problem first

The executable lecture first introduces a search-problem abstraction and makes it concrete with two examples. The first is a street with locations numbered 1 through n. Walking from i to i+1 costs one minute; taking a magic tram from i to 2*i costs two minutes. The goal is to travel from 1 to n in the least time. The prescribed mindset is: do not solve the instance first; formalize it first, because general methods should work on any search problem.

A search problem has three components:

- `start_state()`: the initial state; the travel problem starts at location 1.
- `successors(state)`: the actions available in a state, their costs, and the resulting states.
- `is_end(state)`: whether a state is an end state; the travel problem ends at location n.

The source's `Step` binds an action, a cost, and a resulting state. `successors` checks that walking stays within the bound, then checks that `2 * state` stays within the bound before adding the walk or tram edge. These checks define the edges of the search graph.

The objective is to find a solution, a sequence of actions whose total cost is minimal. For n=10, the lecture shows one possible route: walk to 2, tram to 4, walk to 5, and tram to 10, with cost 1+2+1+2=6. It is feasible, not yet proven optimal; search must compare alternative sequences.

## State design: retain what the future needs

The second example adds a constraint: the magic tram requires tickets, and only a fixed number are available. Location alone is no longer enough. At the same location, having one ticket and having zero tickets produce different future actions. `TravelState` therefore contains `(loc, tickets)`: walking preserves the ticket count, while taking the tram decrements it. Reaching n is still the end condition, regardless of remaining tickets.

This demonstrates the source's general rule: a state contains whatever information is needed to evaluate actions, costs, and successors. The lecture also asks what changes if the tram cannot be taken twice in a row. The state then needs the location, ticket count, and whether the previous action was taking the tram. The point is not to memorize a tuple; it is to ask whether legal future actions and costs are fully determined from the state.

Why not include the entire history? Later, dynamic programming scales with the number of states. Storing more history may preserve distinctions, but it can split identical futures into many states and destroy the benefit of caching. Omitting a ticket count or the previous action has the opposite failure: it merges histories whose futures differ. Good modeling sits at the boundary between “enough information to determine the future” and “as few states as possible.”

This is the lecture's modeling boundary. Formalizing the problem does not make the solution obvious, but it lets a search algorithm operate through a stable interface instead of requiring a new algorithm for every problem.

## Exact search: exhaustive recursion

The objective remains to find the minimum-cost action sequence from the start state. Exhaustive search simply tries all possible solutions. The lecture chooses a recurrence that generalizes to dynamic programming and eventually connects to reinforcement learning: `future_cost(state)` is the cost of the minimum-cost solution from a state to an end state.

For each successor, pay its first-step cost and add `future_cost(successor.state)`; then minimize over successors:

`future_cost(state) = min_successor (successor.cost + future_cost(successor.state))`

At an end state, the base case is an empty solution with cost zero. Otherwise, `future_solution` recursively obtains the best continuation for every successor, prepends the first step, and chooses the solution with the lowest cost. The source's `Solution` retains the steps and computes total cost as the sum of their costs, so the result includes the action sequence rather than only a scalar.

The small example exposes the problem. For `TravelSearchProblem(num_locs=4)`, the source reports 9 explored states even though there are only 4 location states. Some states are reached and expanded more than once. With n=10 and n=17, the solution costs can remain sensible while the number explored grows rapidly. The lecture describes exhaustive search's worst-case time complexity as exponential in the number of states; its memory complexity is linear in solution length because of the recursion stack.

The recurrence assumes there are no cycles such as A → B → C → A. Otherwise it can recurse forever and is not directly well-defined. The source leaves value iteration for MDPs to next week rather than filling that gap here. Its temporary workarounds are to add the number of steps to the state, make `is_end` true after a threshold, or assign infinite cost to states beyond the threshold so they are pruned.

## Memoization and dynamic programming

The waste in exhaustive search is repeated expansion of the same state. In the source, dynamic programming is simply **exhaustive search + caching**, also called memoization. A `cache` stores the best future solution for each state; the recursive function checks it first, returns immediately on a hit, and stores the result after the first computation.

For the n=10 travel example, DP explores 10 states, exactly the number of states in that instance. The n=17 and n=100 examples show that the method continues to work. This does not mean DP is always fast. It means that identical future subproblems are merged. If every action leads to a new state, there is little to cache and exhaustive search may already be adequate.

The practical conditions are explicit: the number of states must fit in memory, and many paths should lead to the same states. The source notes that memory is generally more precious than time: a program can run longer, but the cache needs actual space. “Exact” here means that, under the defined search problem, costs, and no-cycle assumption, DP finds a minimum-cost solution. It does not make an enormous state space free.

## The exact-versus-approximate boundary

Exhaustive search and DP are exact methods in this lecture: they seek the minimum-cost solution. Time is at least proportional to the number of states; if a state is a set of locations or the full sequence of words generated so far, exact search can become intractable. This is the boundary where the lecture turns to approximate search. The objective remains, but computation forces us to inspect only part of the possibilities.

Approximate search heuristically looks at only a subset of actions. It may miss the best solution in exchange for manageable time or memory. The source states this trade-off plainly; it does not claim that approximate search is correct or globally optimal under a finite budget.

### Best-of-n: sample paths

The simplest approximate method starts at the initial state and randomly chooses actions according to a policy until reaching an end state. Repeat n times and keep the lowest-cost solution. A policy maps a state to an action and may be nondeterministic. The source's `uniform_policy` chooses uniformly among successors, `rollout` applies the policy step by step, and `best_of_n` compares the resulting `Solution` objects.

The stated guarantee is that as n goes to infinity, the solution converges to the minimum-cost solution; it may take exponentially long. Each path can be computed independently, so the method is embarrassingly parallel. It is simpler and more parallelizable than beam search, but quality depends on whether the policy samples good paths.

### Beam search: keep a fixed-width frontier

Beam search keeps `beam_width` partial solutions from the start. At each step it expands every candidate by one action, collects the new candidates, sorts them by accumulated cost, and retains only the best `beam_width` before continuing. The source demonstrates this with n=10, `beam_width=2`.

With beam width 1, beam search is equivalent to greedy search. As beam width goes to infinity, it becomes exhaustive search. Beam search is deterministic (the source names particle filtering as a stochastic version) and uses costs directly; best-of-n incorporates a policy as a prior. Neither finite beam search nor finite best-of-n is exact.

## Test-time compute for language models

The source finally connects the same abstraction to a language model. Given a language model mapping a prompt to a distribution over the next token, and a verifier mapping a response to a boolean, the goal is a response that passes the verifier and has high probability under the language model. Test-time compute means spending more inference compute to search for a better answer instead of sampling only one.

In `LanguageModelSearchProblem`, the state is the prompt plus the response prefix generated so far; an action is the next token; and the cost is the negative log probability of that token. If a complete sentence passes the verifier, the source subtracts 100 from the cost. It keeps only the top 5 next-token successors. The example prompt is `"(3 + 7 *"`; the end condition is a state ending in `)`. `contains_number` uses `eval` and the source labels this “Dangerous!!!”; this article records the executable example, not a security recommendation.

`lm_policy` turns successor costs into a `softmax(-costs)` sampling distribution. Best-of-n then produces five candidates with that policy and selects the lowest-cost one. The source also links [Large Language Monkeys](https://arxiv.org/pdf/2407.21787) as outside material on test-time sampling. This article records only the cast shown in the artifact: state, next-token action, negative-log-probability cost, and the additional reward when the verifier succeeds. The source notes that practice would require many inference optimizations, but does not develop them here.

## Closing checklist

For a new problem, ask in order: What is the start state? What are the successors, actions, and costs? What counts as an end state? What action sequence is a solution, and how are costs added? Does the state retain tickets, the previous action, or any other information that changes the future? If the state space fits in memory and many paths merge, dynamic programming is a candidate. If exact search is infeasible, consider best-of-n or beam search.

The main lesson is not that DP always beats recursion. Modeling determines which histories can be compressed, and compression creates the opportunity to cache. Exhaustive search gives an exact baseline but can be exponential; DP removes repeated work when the state space is small and paths overlap; best-of-n and beam search trade a finite computation budget for approximate answers. Learning can supply costs, and search can find a solution under those costs. Cycles such as A → B → C → A are deferred to the next lecture.

## References

- [CS221 Autumn 2025 course site](https://stanford-cs221.github.io/autumn2025/)
- [Official lecture artifact: search](https://stanford-cs221.github.io/autumn2025-lectures/?trace=search)
- [CS221 Autumn 2025 executable lecture repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Official Stanford Online CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
- [The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html)
- [Large Language Monkeys](https://arxiv.org/pdf/2407.21787)
