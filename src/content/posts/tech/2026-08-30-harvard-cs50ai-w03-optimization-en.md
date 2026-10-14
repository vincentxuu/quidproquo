---
title: "Optimization — Local Search, Simulated Annealing, CSP & Crossword Generation | Harvard CS50 AI Week 3"
date: 2026-08-30
category: tech
type: guide
tags: [harvard-cs50ai, ai, optimization, local-search, simulated-annealing, csp, ac-3, backtracking, crossword, python, cs50]
lang: en
series:
  name: "Reading Harvard CS50 AI"
  order: 4
tldr: "Week 3 covers three ways to write an optimization problem. Local search keeps a single state: hill climbing moves to a better neighbor and gets stuck at local optima, and simulated annealing accepts a worse move with probability e^(ΔE/T). Linear programming writes the problem as a linear cost function plus linear constraints and hands it to an existing solver. Constraint satisfaction problems shrink domains with node consistency and arc consistency (AC-3), then find a solution with backtracking search guided by the MRV, degree and least-constraining-value heuristics. Includes per-section time links, plus the approach, pseudocode, pitfalls and checks for the Crossword project (the reference implementation is folded at the end)."
description: "A walkthrough of Harvard CS50 AI Week 3 Optimization, written section by section from the captions of the 2020 lecture recording: local search and the state-space landscape, hill climbing and five variants, simulated annealing, the traveling salesman problem, linear programming, constraint satisfaction problems, node and arc consistency, AC-3, backtracking search, maintaining arc consistency, and the MRV, degree and least-constraining-value heuristics. Every section has a clickable time link and a self-check, followed by the Crossword project spec, distribution code that matches the official files, the approach, pseudocode, where things go wrong, ways to check your work, and check50 commands; the reference implementation is folded at the end of the project. Project specs are current as of 2026."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization)

**Video status: Videos included.** The lecture runs 1:44:44. The "Lecture walkthrough" below is written section by section from the recording's English captions, and each section opens with a time link that moves the player on this page to that point. The lecture does not cover this week's project; that section follows the course website. [Jump to the player](#lecture-video--timestamps) | [Source details](#course-video-sources)

> ⚠️ **Version note**: This week's lecture videos were **recorded in Spring 2020**; project specs, distribution code, and check50 slugs follow the 2026 course website (i.e., `ai50/projects/2024/x/...`).

## TL;DR

Week 3 writes "pick the best option out of many" as three kinds of problem, each with ready-made solution methods. Local search keeps a single state and moves between neighbors with hill climbing and simulated annealing. Linear programming writes the problem as a linear cost function and linear constraints. A constraint satisfaction problem (CSP) uses arc consistency to shrink each variable's domain, then backtracking search to find an assignment. The Crossword project uses the third.

The article has two halves: the "Lecture walkthrough" follows the recording, and the second half covers the Crossword project, which the lecture never mentions.

## Lecture Video & Timestamps

The lecture runs 1 hour 44 minutes, and the ten sections of the "Lecture walkthrough" below cover everything after 0:52 in order. The time link at the top of each section, and the ones inside the text, are clickable and move the player on this page to that point. When a section does not make sense, go back and hear how the lecturer puts it.

```youtube
url: https://www.youtube.com/watch?v=qK46ET1xk2A
title: Optimization - Lecture 3 - CS50's Introduction to Artificial Intelligence with Python 2020
```

YouTube: [Week 3 Optimization (2020 recording)](https://www.youtube.com/watch?v=qK46ET1xk2A)

> Timing note: the times below were checked against the timecoded English captions (2026-10-13). They mark where the lecturer starts each topic and are not official chapters. This table describes only the 2020 recording; the current course version may differ in content and order, and the video itself does not introduce this week's project.

| Time (click to play from there) | Content |
|---|---|
| [0:00–0:52](https://www.youtube.com/watch?v=qK46ET1xk2A&t=0s) | Recap of earlier weeks: search, adversarial search, knowledge and inference, probabilistic models |
| [0:52–7:25](https://www.youtube.com/watch?v=qK46ET1xk2A&t=52s) | Optimization and local search: the hospital placement example, state-space landscape, objective and cost functions, neighbors |
| [7:25–17:46](https://www.youtube.com/watch?v=qK46ET1xk2A&t=445s) | Hill climbing: pseudocode, the hospital example going from 17 to 11, local optima and flat regions |
| [17:46–29:00](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1066s) | Five variants of hill climbing, `hospitals.py` and a random-restart run |
| [29:00–40:44](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1740s) | Simulated annealing and the traveling salesman problem |
| [40:44–51:02](https://www.youtube.com/watch?v=qK46ET1xk2A&t=2444s) | Linear programming: the two-machine example and `scipy.optimize.linprog` |
| [51:02–59:18](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3062s) | Constraint satisfaction problems: exam scheduling, the constraint graph, variables and domains, hard/soft, unary/binary |
| [59:18–1:14:35](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3558s) | Node consistency, arc consistency, `Revise` and AC-3 |
| [1:14:35–1:29:22](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4475s) | A CSP as a search problem: backtracking pseudocode, a step-by-step run and `schedule0.py` |
| [1:29:22–1:35:10](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5362s) | Interleaving search and inference: maintaining arc consistency |
| [1:35:10–1:44:44](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5710s) | Heuristics for choosing variables and ordering values: MRV, degree, least-constraining value, and the wrap-up |

> Official notes and slides: [Week 3 Notes](https://cs50.harvard.edu/ai/2020/notes/3/)

## Lecture walkthrough

What follows is written section by section from the recording's English captions. Captions alone do not show the slides, so this article does not reconstruct where the houses and hospitals sit on the map, the shape of the state-space landscape, or the drawing of the constraint graph; it reports only the numbers and reasoning the lecturer says aloud. The pseudocode is assembled from what the lecturer reads out line by line and was checked against the [official notes](https://cs50.harvard.edu/ai/2020/notes/3/), which write it the same way; the one difference is `highest valued neighbor` in `Hill-Climb`, where the notes say `best valued neighbor` and this article follows what the lecturer says. The self-check at the end of each section is my own question, not lecture content. Where a question reuses a lecture example it says so; where it is marked "my own", the example is mine as well.

### Optimization and local search: only the answer matters, not the path

[Recording 0:52–7:25](https://www.youtube.com/watch?v=qK46ET1xk2A&t=52s)

The lecturer, Brian Yu, defines optimization as choosing the best option from a set of possible options. Earlier weeks already touched on it, for example picking the best move out of all possible moves in a game; this week looks at methods that handle a broader range of optimization problems.

The first is **local search** ([1:20](https://www.youtube.com/watch?v=qK46ET1xk2A&t=80s)). BFS and A\* from Week 0 maintain many paths that are being explored at once; local search maintains a single node, the current state, and moves to one of the states next to it. The lecturer says it fits the opposite situation from maze solving: in a maze the goal is obvious and the hard part is the path; local search is for problems where the path does not matter and only the answer does, and where working out what the answer looks like is the hard part.

His example is placing hospitals ([2:38](https://www.youtube.com/watch?v=qK46ET1xk2A&t=158s)). A grid map has four houses, two hospitals have to be placed, and the objective is to keep the houses as close to a hospital as possible. Distance is the Manhattan distance from Week 0: how many squares you move along rows and columns. In the configuration he shows, the four houses are 3, 6, 4 and 4 away from their nearest hospital, which adds up to 17, so that state has a cost of 17. The question becomes: which placement minimizes that sum?

Abstracting away from the specific problem, the lecturer draws a **state-space landscape** ([4:17](https://www.youtube.com/watch?v=qK46ET1xk2A&t=257s)): each vertical bar is a state (one configuration of two hospitals), and the height of the bar is some function of that state. There are two things you might want from this picture:

- Find a **global maximum**: the state whose value is higher than every other state. The function being optimized is then called an **objective function**: pass in a state, get back how good it is.
- Find a **global minimum**: the state whose value is lower than every other state. The function is then called a **cost function**, where the cost might be money, time, or, in the hospital example, distance.

The two are the same task in opposite directions.

Local search works like this: you hold one current state and move to one of its **neighbors** ([6:27](https://www.youtube.com/watch?v=qK46ET1xk2A&t=387s)). In the one-dimensional picture a neighbor is the bar immediately to the left or right. For a different problem you define what a neighbor is; in the hospital problem a neighbor can be "move one hospital one square up, down, left or right". A neighbor is close to the current state but slightly different, so its value is slightly different too.

**Check yourself. Write your answer down before opening the fold.** In the lecture's hospital example the four houses are 3, 6, 4 and 4 away from their nearest hospital. What is the cost of this state? Is the problem looking for a global maximum or a global minimum, and what is the function being optimized called?

<details>
<summary>Answer</summary>

The cost is 3 + 6 + 4 + 4 = 17. Shorter distances are better, so the target is a global minimum and the function is a cost function. If the same problem were rewritten as "make some score as high as possible", it would become a search for a global maximum and the function would be called an objective function; the two framings are interchangeable.

</details>

### Hill climbing: keep moving to a better neighbor

[Recording 7:25–17:46](https://www.youtube.com/watch?v=qK46ET1xk2A&t=445s)

The simplest local search is **hill climbing**. When maximizing: look at all neighbors of the current state and move to the one with the highest value; repeat until every neighbor is lower than the current state, then stop and take the current state as the answer. Minimizing is the mirror image: move to the lowest-valued neighbor until every neighbor is higher.

The pseudocode as the lecturer reads it ([9:01](https://www.youtube.com/watch?v=qK46ET1xk2A&t=541s)):

```text
function Hill-Climb(problem):
    current = initial state of problem
    repeat:
        neighbor = highest valued neighbor of current
        if neighbor not better than current:
            return current
        current = neighbor
```

The lecturer adds three remarks along the way:

- Some problems come with an initial state and some do not; when there is none, generate one at random, for example by picking two random locations for the hospitals.
- The version above maximizes. When minimizing, `neighbor` is the lowest-valued neighbor.
- When several neighbors are equally good, choose one of them at random.

He then walks through the hospital example ([11:10](https://www.youtube.com/watch?v=qK46ET1xk2A&t=670s)). A neighbor is defined as "pick one hospital and move it one square left, right, up or down"; the lecturer says that configuration has six neighbors, three squares each hospital can move to. The starting cost is 17.

1. Look at the hospital on the right first. Moving it up brings it closer to the house above but further from the house below, and changes nothing for the two houses on the left, so it does not help. Moving it down is the same problem reversed. Moving it one square left brings it closer to both houses on the right, and the two houses on the left are unaffected because the other hospital is still the closer one for them. The cost drops, so move there. The lecturer does not state the cost after this step; the next step mentions that it was 15.
2. Now the other hospital. It sits a bit too high; moving it one square down takes the cost from 15 to 13.
3. Moving the same hospital one square left takes the cost from 13 to 11. The four houses are now 1, 4, 3 and 3 away.

The algorithm stops here. Moving either hospital one square in any direction either raises the cost or leaves it unchanged; no neighbor has a cost below 11.

Is 11 the best placement? ([14:42](https://www.youtube.com/watch?v=qK46ET1xk2A&t=882s)) No. Moving one of the hospitals diagonally by one square gives a cost of 9. But a diagonal move is not part of the definition of a neighbor; to get there in two up/down/left/right steps you would have to pass through a state that is no better than the current one, and hill climbing will not take that step.

That is the limitation of hill climbing: it does not guarantee the optimal solution. The lecturer goes back to the state-space landscape to show where it gets stuck ([15:40](https://www.youtube.com/watch?v=qK46ET1xk2A&t=940s)):

- **Local maximum**: a state whose value is higher than all its neighbors but which is not the global maximum. When maximizing, you stop here because both sides are worse.
- **Local minimum**: a state whose value is lower than all its neighbors but which is not the global minimum. The hospital example stopping at 11 is a stop at a local minimum. Strictly speaking, a few neighbors of 11 tie with it, and what holds is that no neighbor is lower; this sentence is my addition.
- **Flat local maximum** ([16:58](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1018s)): several adjacent states with the same high value, six of them in the lecturer's picture. No neighbor is better, so the algorithm above stops here.
- **Shoulder** ([17:19](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1039s)): also a flat stretch, but not a local optimum, because further along you can still go higher or lower. A local search can get lost on the flat part and fail to make progress.

**Check yourself. Write your answer down before opening the fold.** A row of seven states has costs 8, 6, 7, 5, 3, 4, 9, and the neighbors of a state are the ones immediately left and right. Running hill climbing to minimize, where do you stop if you start at the far left (cost 8)? And if you start at the far right (cost 9)? (My own example.)

<details>
<summary>Answer</summary>

From the far left: 8 has a single neighbor, 6, which is lower, so move there. At 6 the neighbors are 8 and 7, both higher, so stop. The answer is 6, a local minimum.

From the far right: the neighbor of 9 is 4, so move there; the neighbors of 4 are 3 and 9, so move to 3; the neighbors of 3 are 5 and 4, both higher, so stop. The answer is 3, which this time happens to be the global minimum.

Same problem, same algorithm, different starting point, different result. Random restart in the next section relies on exactly this.

</details>

### Variants of hill climbing and a run of `hospitals.py`

[Recording 17:46–29:00](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1066s)

Because hill climbing does not always find the optimal solution, it has several variants, and which one fits depends on the problem. The lecturer introduces five in a row:

| Variant | What it does |
|---|---|
| Steepest-ascent | Choose the highest-valued neighbor (the lowest when minimizing). This is the version shown in the previous section |
| Stochastic | Choose randomly among all neighbors that are better than the current state |
| First-choice | Do not look at every neighbor; move to the first one found that is better |
| Random-restart | Run hill climbing many times, each from a new random starting state, and keep the best result |
| Local beam search | Keep track of the k highest-valued states instead of one |

The lecturer's comment on steepest-ascent is that it is a somewhat greedy approach: it takes the best option at every step, but sometimes choosing a neighbor that is only slightly better leads to a better outcome later. The idea behind stochastic is that better is better; first-choice saves the time of checking every neighbor. All three can still end up at a local optimum, and the way to reduce that risk is to repeat the process many times, which is random-restart ([19:43](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1183s)). Local beam search ([20:24](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1224s)) maintains more than one state: start from three, four or five random states, generate all their neighbors, keep the best three, four or five, and repeat.

Then the code ([20:58](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1258s)). The `Space` class in `hospitals.py` stores the height and width of the map and the number of hospitals, and `hill_climb` is steepest-ascent: place the hospitals on random empty cells, then in a loop compute the cost for every hospital and every cell it could move to, keeping the neighbors with the lowest cost. The loop ends with this (from the lecture source code):

```python
# None of the neighbors are better than the current state
if best_neighbor_cost >= self.get_cost(self.hospitals):
    return self.hospitals

# Move to a highest-valued neighbor
else:
    if log:
        print(f"Found better neighbor: cost {best_neighbor_cost}")
    self.hospitals = random.choice(best_neighbors)
```

If the best neighbor is not better than the current state, return; otherwise use `random.choice` to pick one of the equally good neighbors and move there. It maps one to one onto the pseudocode.

The lecturer places 15 houses and 3 hospitals at random on a map of height 10 and width 20. The run goes: initial cost 72, then 69, 66, 63, and on down to 53, where it stops. He points out that 53 is not necessarily the global minimum and may just be a local one. To be sure you would have to compute every configuration, which takes too long once there are many states; when you do not need the best and pretty good is enough, local search is very useful.

Next comes random restart ([26:44](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1604s)). `random_restart` runs `hill_climb` a given number of times and remembers the best result so far. The lecturer sets it to 20, and the output goes: the first run finds 56, then 46, then one that is higher than 46 and is ignored, then 41; none of the remaining 16 runs does better than 41. The 41 came from attempt number 3, counting from zero.

These numbers are from that one run in the lecture. The houses and the starting hospitals are generated at random, so running the same program yourself will not give the same numbers; this sentence is my addition based on the code.

**Check yourself. Write your answer down before opening the fold.** The lecture's random restart ran 20 times: 56, 46, one higher than 46, 41, and then 16 runs with nothing better. Count the runs and confirm which attempt (counting from zero) produced 41. Can you say 41 is the global minimum for this map?

<details>
<summary>Answer</summary>

Attempt 0 is 56, attempt 1 is 46, attempt 2 is higher than 46 and is ignored, attempt 3 is 41. The first 4 runs plus the remaining 16 make exactly 20.

You cannot say 41 is the global minimum. Random restart returns the best of 20 local minima, and the lecturer himself says there may be a better placement that was simply not found. To be certain you would have to compute every configuration.

</details>

### Simulated annealing and the traveling salesman problem

[Recording 29:00–40:44](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1740s)

The lecturer names the problem all those hill-climbing variants share: they never make a move that makes the situation worse. But when you are stuck at a local optimum, getting out means going in a worse direction first.

The most popular technique for this is **simulated annealing** ([29:48](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1788s)). The name comes from annealing in physics: heat up a system of particles and there is a lot of energy and random movement; as it cools, it settles into a final position. Carried over to search:

- Early on the "temperature" is high, and you are more likely to accept a neighbor that is worse than the current state, especially one that is only slightly worse.
- Later the temperature decreases, and you become less and less likely to accept worse neighbors.

The lecturer's reasoning: moving around randomly early on is what gives you a chance to leave a local optimum; once you are up near the global maximum, you should stop moving to worse states.

The pseudocode ([32:03](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1923s)):

```text
function Simulated-Annealing(problem, max):
    current = initial state of problem
    for t = 1 to max:
        T = Temperature(t)
        neighbor = random neighbor of current
        ΔE = how much better neighbor is than current
        if ΔE > 0:
            current = neighbor
        with probability e^(ΔE/T) set current = neighbor
    return current
```

Line by line:

- `max` is how many times to repeat, and depends on the problem.
- `Temperature(t)` returns the current temperature, higher early and lower later. The simplest version is "the proportion of time still remaining".
- The neighbor is picked **at random**, not the best one.
- `ΔE` is how much better the neighbor is than the current state. Positive means the neighbor is better, negative means it is worse.
- If the neighbor is better (`ΔE > 0`), always move there, as in hill climbing.
- If the neighbor is worse, move there with probability `e^(ΔE/T)` ([35:05](https://www.youtube.com/watch?v=qK46ET1xk2A&t=2105s)). `ΔE` is negative here, so the value falls between 0 and 1. The probability is high when the neighbor is only slightly worse (`ΔE` near 0) and low when the temperature is low (`T` small).

When the loop ends, return whatever the current state is.

The lecturer goes on to say that any problem you can write as "there is a configuration, you can ask whether a neighbor is better, and you have a way to measure that" can use this kind of algorithm. Hospital placement is one; another famous one is the **traveling salesman problem** ([37:02](https://www.youtube.com/watch?v=qK46ET1xk2A&t=2222s)): given a set of cities, find a route that goes through every city and ends up back at the start with the smallest total distance. Delivery companies planning routes face this problem. It is an NP-complete problem, which the lecturer describes as having no known efficient way to solve it, so the practical goal is an approximation: not the best solution, but a good one found in a feasible amount of time.

As local search: a state is a route, the cost is the total length of the route, and the remaining question is what a neighbor is. The lecturer's definition is "pick two edges and switch them" ([39:00](https://www.youtube.com/watch?v=qK46ET1xk2A&t=2340s)): remove both edges, connect each endpoint to the city it was not connected to, and reverse the direction of the stretch in between. With a definition of neighbor in hand, you can apply hill climbing or simulated annealing.

**Check yourself. Write your answer down before opening the fold.** A neighbor is worse than the current state by 2 (`ΔE = −2`). With what probability does simulated annealing move there at temperature `T = 10`, and at `T = 1`? If another neighbor is worse by 10 (`ΔE = −10`), what is the probability at `T = 10`? (My own example.)

<details>
<summary>Answer</summary>

`T = 10`: e^(−2/10) = e^(−0.2) ≈ 0.82. `T = 1`: e^(−2/1) = e^(−2) ≈ 0.14. For the same neighbor, a high temperature accepts it about eight times in ten, and a low temperature only a little over one time in ten.

`ΔE = −10`, `T = 10`: e^(−10/10) = e^(−1) ≈ 0.37. At the same temperature, the neighbor that is worse by 10 (0.37) is harder to accept than the one worse by 2 (0.82). Those are the two directions the lecturer describes: the probability depends on both the temperature and how much worse the neighbor is.

</details>

### Linear programming: a cost function plus constraints, handed to an existing solver

[Recording 40:44–51:02](https://www.youtube.com/watch?v=qK46ET1xk2A&t=2444s)

The next category is **linear programming**. The lecturer says it comes up when you are optimizing some mathematical function and the variables are real numbers: not just a few discrete, fixed values, but any decimal value. A linear program looks like this:

- Minimize a cost function `c₁x₁ + c₂x₂ + … + cₙxₙ`. Each variable is multiplied by a coefficient and the terms are added; nothing is squared or cubed, which is why it is called linear.
- Constraints have the form `a₁x₁ + a₂x₂ + … + aₙxₙ ≤ b`, or an equality `= b`.
- Each variable may have lower and upper bounds, for example that it must be positive, or less than 50.

If a problem can be written in this form, algorithms for solving it already exist.

The lecturer's example ([43:07](https://www.youtube.com/watch?v=qK46ET1xk2A&t=2587s)): a factory has two machines, x₁ and x₂.

| | x₁ | x₂ | Condition |
|---|---|---|---|
| Cost per hour (dollars) | 50 | 80 | Total cost as low as possible |
| Labor needed per hour (units) | 5 | 2 | Only 20 units in total |
| Output per hour (units) | 10 | 12 | The company needs 90 units |

Let `x₁` and `x₂` be the number of hours each machine runs. The three rows become:

- Cost function: `50x₁ + 80x₂`, to be minimized.
- Labor constraint: `5x₁ + 2x₂ ≤ 20`.
- Output constraint: `10x₁ + 12x₂ ≥ 90`.

The third is a "greater than or equal to", while the form above only allows equalities and "less than or equal to". The lecturer's fix is to multiply both sides by −1, which flips the inequality: `−10x₁ − 12x₂ ≤ −90`, an equivalent expression.

For the algorithms that solve these problems, the lecturer gives only names ([47:00](https://www.youtube.com/watch?v=qK46ET1xk2A&t=2820s)): simplex, one of the first, and later the class of interior-point algorithms. They involve geometry and linear algebra that the course does not go into. His point is that you do not need to understand how they work; you need to know that once a problem is in this form, a library can solve it.

`production.py` ([47:21](https://www.youtube.com/watch?v=qK46ET1xk2A&t=2841s)) uses `scipy`. The whole file (from the lecture source code):

```python
import scipy.optimize

# Objective Function: 50x_1 + 80x_2
# Constraint 1: 5x_1 + 2x_2 <= 20
# Constraint 2: -10x_1 + -12x_2 <= -90

result = scipy.optimize.linprog(
    [50, 80],  # Cost function: 50x_1 + 80x_2
    A_ub=[[5, 2], [-10, -12]],  # Coefficients for inequalities
    b_ub=[20, -90],  # Constraints for inequalities: 20 and -90
)

if result.success:
    print(f"X1: {round(result.x[0], 2)} hours")
    print(f"X2: {round(result.x[1], 2)} hours")
else:
    print("No solution")
```

The first argument is the coefficients of the cost function, `A_ub` holds the coefficients of each "less than or equal to" constraint, and `b_ub` holds the upper bound of each constraint (`ub` stands for upper bound). The lecturer admits this is not as easy to read as the mathematical equations. The result ([50:15](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3015s)): x₁ runs for 1.5 hours and x₂ for 6.25 hours.

Here the lecturer names a theme that recurs through the lecture: reduce the problem in front of you to a problem you already know how to solve, and you can use existing methods directly.

**Check yourself. Write your answer down before opening the fold.** Substitute the lecture's answer `x₁ = 1.5`, `x₂ = 6.25` into both constraints and confirm they hold. What is the total cost of this solution?

<details>
<summary>Answer</summary>

Labor: 5 × 1.5 + 2 × 6.25 = 7.5 + 12.5 = 20, exactly the limit of 20. Output: 10 × 1.5 + 12 × 6.25 = 15 + 75 = 90, exactly the required 90. Both constraints are met with nothing to spare.

The total cost is 50 × 1.5 + 80 × 6.25 = 75 + 500 = 575 dollars. The lecture reports only the two hour figures; 575 is my own calculation from the lecture's coefficients.

</details>

### Constraint satisfaction problems: variables, domains and constraints

[Recording 51:02–59:18](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3062s)

Linear programs are not the only problems with constraints. A more general class is the **constraint satisfaction problem** (CSP from here on): some number of variables each need to take on a value, and the variables are subject to constraints that limit which values they can take.

The lecturer's example is exam scheduling ([51:37](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3097s)). Four students each take three courses, with courses represented by letters:

| Student | Courses |
|---|---|
| 1 | A, B, C |
| 2 | B, D, E |
| 3 | C, E, F |
| 4 | E, F, G |

There are only three exam slots, Monday, Tuesday and Wednesday. Every course needs one of them, and nobody should have two exams on the same day.

To give a computer something to work with, the lecturer draws it as a graph ([52:31](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3151s)): each course is a node, and there is an edge between two nodes when there is a constraint between them. Student 1 takes A, B and C, so there are edges A–B, B–C and C–A, meaning those courses cannot be on the same day. The other students are handled the same way. For student 4, E–F already has an edge from student 3 and does not need another. This graph is called the **constraint graph**.

With the example in place, the lecturer gives the definition ([54:21](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3261s)). A CSP has three things:

- A set of **variables** `X₁, …, Xₙ`.
- A **domain** for each variable: the values it can take. The domains may all be the same or may differ.
- A set of **constraints** `C`: for example `X₁ ≠ X₂`; when the variables are numbers it could also be something like `X₁ = X₂ + 1`.

The same definition applied to two examples:

| | Sudoku ([55:10](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3310s)) | Exam scheduling |
|---|---|---|
| Variables | Every empty square | Courses A through G |
| Domain | 1 through 9 | Monday, Tuesday, Wednesday |
| Constraints | Cells in the same row, the same column, or the same 3×3 block must all differ | A ≠ B, A ≠ C and so on, one per edge |

Constraints can be classified in a couple of ways. The first is whether they may be violated ([56:56](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3416s)):

- **Hard constraint**: must be satisfied for a solution to be correct, such as two cells in the same Sudoku row not taking the same value.
- **Soft constraint**: expresses a preference, such as someone preferring A's exam to be earlier than B's. A solution that does not satisfy it is still a solution, just a less good one; the problem then becomes satisfying preferences as much as possible.

The lecturer says this lecture mostly deals with hard constraints only.

The second is how many variables are involved ([58:00](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3480s)):

- **Unary constraint**: involves a single variable, such as `A ≠ Monday` (the instructor is not available on Monday).
- **Binary constraint**: involves two variables, such as `A ≠ B`. Each edge in the constraint graph is a binary constraint, and the edge is also called an arc.

**Check yourself. Write your answer down before opening the fold.** Draw the constraint graph for the lecture's four students. How many edges does it have? Which courses is node E connected to?

<details>
<summary>Answer</summary>

Each student takes three courses, and three courses connected pairwise make 3 edges, so four students give 12. E–F appears for both student 3 and student 4 and is counted once, leaving 11: A–B, A–C, B–C, B–D, B–E, D–E, C–E, C–F, E–F, E–G, F–G.

E is on the course lists of students 2, 3 and 4, so it connects to five courses: B, D, C, F and G. The `CONSTRAINTS` list in the lecture's `schedule0.py` contains the same 11 edges.

</details>

### Node consistency, arc consistency and AC-3

[Recording 59:18–1:14:35](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3558s)

With unary and binary constraints separated, you can use the constraints to shrink each variable's domain before looking for a solution.

**Node consistency**: every value in a variable's domain satisfies that variable's unary constraints.

The lecturer shrinks the example to two courses ([59:53](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3593s)). A and B both have the domain {Monday, Tuesday, Wednesday}, and there are four constraints: `A ≠ Monday`, `B ≠ Tuesday`, `B ≠ Monday`, `A ≠ B`. The first three are unary and are handled one at a time:

1. `A ≠ Monday`: remove Monday from A's domain, leaving A with {Tuesday, Wednesday}.
2. `B ≠ Tuesday`: remove Tuesday from B's domain, leaving B with {Monday, Wednesday}.
3. `B ≠ Monday`: remove Monday as well, leaving B with {Wednesday}.

Both variables are now node consistent. The fourth constraint, `A ≠ B`, is binary and has not been used yet.

**Arc consistency** ([1:03:09](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3789s)): every value in a variable's domain satisfies that variable's binary constraints. The lecturer's more precise version: to make X arc consistent with respect to Y, remove from X's domain any value that leaves Y with no possible choice, so that every choice for X still has at least one value Y can take.

Now A with respect to B ([1:04:52](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3892s)). A's domain is {Tuesday, Wednesday} and B's is {Wednesday}.

- A is Tuesday: B can be Wednesday, `A ≠ B` holds, keep it.
- A is Wednesday: B can only be Wednesday, which would be the same day as A, so there is no value for B. Remove Wednesday from A's domain.

A is left with {Tuesday} and B with {Wednesday}. This small problem is solved by the two kinds of consistency alone.

"Make X arc consistent with respect to Y" as a function ([1:06:48](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4008s)):

```text
function Revise(csp, X, Y):
    revised = false
    for x in X.domain:
        if no y in Y.domain satisfies constraint for (X, Y):
            delete x from X.domain
            revised = true
    return revised
```

`Revise` only changes X's domain, and its return value says whether anything was removed. The next step uses that return value.

To make the whole problem arc consistent, use **AC-3** ([1:09:14](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4154s)):

```text
function AC-3(csp):
    queue = all arcs in csp
    while queue non-empty:
        (X, Y) = Dequeue(queue)
        if Revise(csp, X, Y):
            if size of X.domain == 0:
                return false
            for each Z in X.neighbors - {Y}:
                Enqueue(queue, (Z, X))
    return true
```

It maintains a queue of all the arcs that still need checking, starting with every arc in the problem. Each time it takes out an arc `(X, Y)` and calls `Revise`:

- It returns false: X's domain did not change, this arc is done, move to the next one.
- It returns true: X's domain got smaller. First check whether it is empty ([1:11:49](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4309s)); if so, X has no value left, the whole problem has no solution, and AC-3 returns false. If not, X's other neighbors Z may have been consistent with X only because of the value that was just removed, and that may no longer be true, so `(Z, X)` goes back into the queue to be checked again. Y was just handled and does not need to go back.

When the queue is empty, return true. The lecturer adds that strictly speaking it does not need to be a queue; a queue is just the traditional way.

What happens if AC-3 is applied to the seven-course exam schedule? ([1:13:37](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4417s)) Nothing changes. Every course has three days to choose from and the constraints only require two courses to be on different days, so whichever day X picks, Y still has two other days. Every arc is consistent from the start. Arc consistency looks at the two variables on one edge at a time and does not consider the rest of the nodes. So AC-3 can sometimes reduce domains and make a solution easier to find, but it will not always solve the problem; search is still needed.

**Check yourself. Write your answer down before opening the fold.** Two variables X and Y both have the domain {1, 2, 3}, and there is a single constraint `X < Y`. Run `Revise(X, Y)` and then `Revise(Y, X)`. What is left in each domain? What do the two calls return? Is the problem solved afterwards? (My own example.)

<details>
<summary>Answer</summary>

`Revise(X, Y)`: with X = 1, Y can be 2 or 3; with X = 2, Y can be 3; with X = 3, Y has no value greater than 3, so remove 3. X is left with {1, 2} and the call returns true.

`Revise(Y, X)`: with Y = 1, X has no value smaller than 1, so remove 1; with Y = 2, X can be 1; with Y = 3, X can be 1 or 2. Y is left with {2, 3} and the call returns true.

The problem is not solved. The two domains are now arc consistent, but three solutions remain, (1, 2), (1, 3) and (2, 3), and it takes search to pick one. This is the same thing as the lecture's seven-course example: arc consistency can shrink domains, but it does not guarantee that every variable is reduced to a single value.

</details>

### A CSP as a search problem: backtracking search

[Recording 1:14:35–1:29:22](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4475s)

The lecturer first fits a CSP into the search-problem format from Week 0:

- Initial state: the empty **assignment**, where no variable has been given a value yet.
- Actions: add one `variable = value` pair to the assignment.
- Transition model: the new assignment you get after adding it.
- Goal test: all variables are assigned and all constraints are satisfied.
- Path cost: irrelevant. All that matters is finding a solution, and every path costs the same.

Running plain BFS or DFS on this would be very inefficient. The lecturer points out a piece of structure a CSP offers ([1:16:28](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4588s)): the order of assignments does not matter. `A = 2` then `B = 8` is the same assignment as `B = 8` then `A = 2`.

The search method used for CSPs is **backtracking search** ([1:16:57](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4617s)): assign values to variables one at a time, and when you reach a point where you cannot go on without violating a constraint, go back and try something else. The pseudocode ([1:17:18](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4638s)):

```text
function Backtrack(assignment, csp):
    if assignment complete: return assignment
    var = Select-Unassigned-Var(assignment, csp)
    for value in Domain-Values(var, assignment, csp):
        if value consistent with assignment:
            add {var = value} to assignment
            result = Backtrack(assignment, csp)
            if result ≠ failure: return result
            remove {var = value} from assignment
    return failure
```

It is a recursive function that starts with the empty assignment. If the assignment is complete, return it; otherwise pick a variable that is not assigned yet and try the values in its domain one by one. If a value does not violate any constraint, add it to the assignment and recurse on the remaining variables. If the recursive call returns something other than failure, pass it all the way up; if it returns failure, that value did not work, so remove it from the assignment and try the next one. If every value has been tried and none works, return failure so the level above can change its choice.

The lecturer runs it on the seven-course graph ([1:20:20](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4820s)). Values are always tried in the order Monday, Tuesday, Wednesday, and the variables are taken in the order he picks on the graph: A, B, D, E, C, F, G.

| Step | Variable | Values tried and result |
|---|---|---|
| 1 | A | Monday, fine |
| 2 | B | Monday conflicts with A; Tuesday is fine |
| 3 | D | Monday is fine (B is Tuesday) |
| 4 | E | Monday conflicts with D; Tuesday conflicts with B; Wednesday is fine |
| 5 | C | Monday conflicts with A; Tuesday conflicts with B; Wednesday conflicts with E. None of the three works; return failure |
| 6 | Back to E | All three values have been tried; Wednesday looked fine but turned out to be a dead end. E returns failure |
| 7 | Back to D | Monday was the wrong choice. Tuesday conflicts with B; Wednesday is fine |
| 8 | E | Monday is fine |
| 9 | C | Monday does not work (the lecturer notes it violates two constraints here); Tuesday does not work; Wednesday is fine |
| 10 | F | Monday does not work; Tuesday is fine |
| 11 | G | Monday does not work; Tuesday does not work; Wednesday is fine |

The result: A and E on Monday, B and F on Tuesday, C, D and G on Wednesday. Choosing D = Monday in step 3 looked harmless at the time; the problem only shows up in step 5, and then the search has to go back two levels to change it.

`schedule0.py` ([1:25:05](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5105s)) writes this process in Python: `VARIABLES` holds the seven courses and `CONSTRAINTS` holds the edges; `backtrack` checks whether the assignment is complete, uses `select_unassigned_variable` to pick an unassigned variable in list order, builds a new assignment for each of the three values, checks it with `consistent`, and recurses only if it passes; if nothing works it returns `None`. `consistent` goes through the constraints one by one: if both ends are assigned and have the same value, it returns `False`. Running it prints one solution, with A on Monday, B on Tuesday and C on Wednesday.

The lecturer then says ([1:27:44](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5264s)) that CSPs are so common that libraries already implement this; what matters is knowing libraries exist, not which one you use. `schedule1.py` uses `python-constraint`: create a problem, add variables with their domains, call `addConstraint` for every edge with a function that says "the two values are not equal", and call `getSolutions` to get all solutions. This problem has six solutions in total.

The number six can be read straight off the constraint graph; the derivation that follows is mine, and the lecture only reports the number. The edges B–C, B–E and C–E are all in the graph (from students 1, 2 and 3 respectively), so B, C and E must be on three different days, and three courses over three days can be arranged in 3 × 2 × 1 = 6 ways. Once B, C and E are fixed, A (connected to B and C), D (connected to B and E) and F (connected to C and E) each have a single day left, and G (connected to E and F) is determined as well, so there are 6 solutions in total.

**Check yourself. Write your answer down before opening the fold.** On the graph the lecturer goes in the order A, B, D, E, C, F, G. `schedule0.py` instead picks variables in list order, A, B, C, D, E, F, G, still trying Monday, Tuesday, Wednesday for each. Run it by hand: at which variable does backtracking fail? How many levels does it go back? Is the final solution the same as the one the lecturer reaches?

<details>
<summary>Answer</summary>

A is Monday. For B, Monday conflicts with A and Tuesday is fine. For C, Monday conflicts with A, Tuesday conflicts with B, and Wednesday is fine. D is connected to B and E; E is not assigned yet, so Monday conflicts with nothing and is fine.

Then all three values fail for E: Monday conflicts with D, Tuesday conflicts with B, and Wednesday conflicts with C. E returns failure and the search goes back one level to D. D tries Tuesday, which conflicts with B; Wednesday is fine.

From there it goes smoothly: E on Monday is fine; for F, Monday conflicts with E and Tuesday is fine; for G, Monday conflicts with E, Tuesday conflicts with F, and Wednesday is fine.

The variable that fails is E, and the search goes back only one level (to change D). The final solution is A and E on Monday, B and F on Tuesday, C, D and G on Wednesday, the same one the lecturer reaches and the same one `schedule0.py` actually prints. In the lecturer's order the failure happens at C and takes two levels of backtracking; here C is assigned earlier, so the mistake is caught one step sooner. This run is my own work, and I checked it against a program that prints every step.

</details>

### Interleaving search and inference: maintaining arc consistency

[Recording 1:29:22–1:35:10](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5362s)

The backtracking search above only asks whether a constraint is violated right now, which is how it walks into dead ends like D = Monday. The lecturer asks: can we go back to the idea of inference from earlier in the course and use what we already know to rule out paths ahead of time?

Go back to just before the first dead end, right after A = Monday and B = Tuesday were assigned. C's domain still has three days, but the graph is no longer arc consistent:

- C is connected to A (Monday) and B (Tuesday), so C cannot be Monday or Tuesday; only Wednesday is left.
- E is connected to B (Tuesday) and C (only Wednesday left), so E can only be Monday.
- D is connected to B (Tuesday) and E (Monday), so D can only be Wednesday.
- The lecturer says F and G can be worked out the same way and does not go through them.

Only two variables were assigned; everything else follows from enforcing arc consistency, with no backtracking at all.

Interleaving search and inference this way is called **maintaining arc consistency** ([1:32:14](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5534s)). AC-3 can be run once before the search starts, to shrink the domains; it can also be run during the search, every time a variable is assigned. For the latter: after assigning a value to variable X, call AC-3, but start the queue with only the arcs `(Y, X)` where Y is a neighbor of X, not with all arcs.

`Backtrack` changes in two places ([1:33:35](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5615s)):

```text
function Backtrack(assignment, csp):
    if assignment complete: return assignment
    var = Select-Unassigned-Var(assignment, csp)
    for value in Domain-Values(var, assignment, csp):
        if value consistent with assignment:
            add {var = value} to assignment
            inferences = Inference(assignment, csp)
            if inferences ≠ failure: add inferences to assignment
            result = Backtrack(assignment, csp)
            if result ≠ failure: return result
            remove {var = value} and inferences from assignment
    return failure
```

- After adding `{var = value}`, call `Inference`. It could do a number of things, one of which is maintaining arc consistency. As long as what it infers (some variable must be some value) is not a failure, add those inferences to the assignment as well.
- When this value turns out not to work and has to be undone, remove the inferences along with `{var = value}`.

Every time a value is assigned, the domains of other variables may shrink, and using that often means backtracking less than before.

The Crossword project's `ac3(self, arcs=None)` has the extra `arcs` argument for exactly this purpose: pass in a list of arcs and AC-3 starts from that list instead of from all arcs. The spec says this step is optional.

**Check yourself. Write your answer down before opening the fold.** Continue the lecture's situation: A = Monday, B = Tuesday, and C = Wednesday, E = Monday, D = Wednesday have already been inferred. Work out F and G, which the lecturer does not show. Is the result the same as the solution backtracking search reached in the previous section?

<details>
<summary>Answer</summary>

F is connected to C, E and G. C is Wednesday and E is Monday, so F can only be Tuesday. G is connected to E and F; E is Monday and F is Tuesday, so G can only be Wednesday.

The result is A and E on Monday, B and F on Tuesday, C, D and G on Wednesday, exactly the solution that took eleven steps and two levels of backtracking in the previous section. The difference is that this time no value that would fail was ever tried. The derivation of F and G is mine, completed with the lecturer's method.

</details>

### Heuristics for choosing variables and ordering values: MRV, degree, least-constraining value

[Recording 1:35:10–1:44:44](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5710s)

Two functions in the pseudocode have not been explained yet: `Select-Unassigned-Var` and `Domain-Values`. So far the first has just picked any unassigned variable, and the second has gone Monday, Tuesday, Wednesday. The lecturer says choosing a bit more intelligently in these two places makes the search much more efficient.

**Which variable to pick** has two heuristics:

- **Minimum remaining values (MRV)** ([1:35:56](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5756s)): select the variable with the smallest domain, the one with the fewest values left. The reasoning: if only two values remain, one of them has to be the solution if a solution exists, so you may as well prune one quickly.
- **Degree heuristic** ([1:36:34](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5794s)): when MRV is not conclusive (for example, every variable has the same number of values left), choose the variable with the highest degree. A node's degree is the number of nodes attached to it, that is, how many variables it constrains. Choosing a high-degree variable immediately constrains the most other variables and is more likely to eliminate large sections of the state space you never need to search.

Two examples ([1:37:30](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5850s)). After two variables have been assigned, C's domain has only Wednesday left, so MRV says to pick C next: it is the only option anyway, so settle it and then look at the rest. At the very start, though, all seven variables have a domain of size 3 and MRV does not help; the lecturer had arbitrarily started from A at the top, when the degree should have been the guide. E has the highest degree. Starting from E, you can go on to assign the other variables, and the lecturer says the rest can then be assigned without any backtracking even without the inference procedure.

**The order in which to try values** ([1:39:25](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5965s)) uses the **least-constraining value** heuristic ([1:40:12](https://www.youtube.com/watch?v=qK46ET1xk2A&t=6012s)): look at how many choices each value rules out from neighboring domains, and try the value that rules out the fewest first. The reasoning: the goal here is just to find a solution, and the less you rule out, the better the chance that a solution is still there.

The lecturer himself notes that the two sound contradictory ([1:40:57](https://www.youtube.com/watch?v=qK46ET1xk2A&t=6057s)): for variables you pick the one with the fewest options, yet for values you pick the least constraining. His explanation is that the purposes differ. Choosing a variable is about pruning large portions of the search space quickly; once a variable is chosen, picking among its values is about keeping the possibility of a solution as open as possible so you do not have to backtrack later.

The example ([1:41:47](https://www.youtube.com/watch?v=qK46ET1xk2A&t=6107s)): A is already Monday, so C can only be Tuesday or Wednesday; which should be tried first? Pointing at the graph, the lecturer counts: choosing Tuesday rules out three options, and choosing Wednesday rules out two. By least-constraining value, try Wednesday first. The captions do not show which nodes he is pointing at; the official notes describe the same example this way: assigning Tuesday to C puts a constraint on all three of B, E and F, while Wednesday puts a constraint only on B and E. The node names come from the official notes, not the captions.

Finally the wrap-up ([1:43:07](https://www.youtube.com/watch?v=qK46ET1xk2A&t=6187s)). This week showed three ways to formulate a problem: as local search, as a linear program, and as a constraint satisfaction problem. If the problem at hand can be written as one of them, the matching known algorithms apply: hill climbing and simulated annealing, simplex and interior-point, arc consistency and backtracking search.

In the Crossword project, `select_unassigned_variable` is MRV with degree as the tie-breaker, and `order_domain_values` is least-constraining value.

**Check yourself. Write your answer down before opening the fold.** The seven courses all start with a domain of size 3. Compute the degree of every node and confirm the lecturer's claim that E has the highest. Then answer: in the least-constraining-value example Tuesday rules out three options and Wednesday rules out two; why try the one that rules out fewer first?

<details>
<summary>Answer</summary>

Counting the 11 edges: A is connected to B and C, degree 2; B to A, C, D and E, degree 4; C to A, B, E and F, degree 4; D to B and E, degree 2; E to B, C, D, F and G, degree 5; F to C, E and G, degree 3; G to E and F, degree 2. E has 5, the highest. The degrees add up to 22, twice the 11 edges, so the count is consistent. These degree numbers are my own count from the lecture's graph; the lecturer only says E is the highest.

Wednesday goes first because the purpose of this step is to find a solution. The fewer choices you rule out, the more values the neighbors keep, the better the chance this branch works out, and the less you need to backtrack. That is the opposite direction from choosing a variable: for variables you pick the most constrained one in order to find out early that a path fails; for values you pick the least constraining one in order to keep the path alive.

</details>

## Project 3: Crossword — CSP Crossword Puzzle Generation

How this site handles project solutions: by default this section gives only the task, the code the course provides, the approach, pseudocode, the places where things go wrong, and ways to check your work, with no code that could be submitted as is. The full reference implementation is folded at the end of the section; read the note there before opening it.

### Task

Given a structure file (for example `data/structure1.txt`, where `_` marks a cell to be filled with a letter) and a word list (for example `data/words1.txt`), choose a word for every across or down sequence of cells so that crossing cells agree on their letter and no word is used more than once.

In terms of the lecture's CSP: each sequence of cells is a variable and its domain is the words in the word list. The unary constraint is that the word's length equals the variable's length; the binary constraint is that two overlapping variables have the same letter in the cell they share.

`crossword.py` is already written and must not be modified. There are eight functions to implement in `generate.py`:

| Function | What it does | Matching lecture content |
|---|---|---|
| `enforce_node_consistency()` | Remove words of the wrong length from every variable's domain | Node consistency |
| `revise(x, y)` | Remove values from `x`'s domain that have no compatible word in `y`'s domain; return `True` if anything was removed | `Revise` |
| `ac3(arcs=None)` | Enforce arc consistency; return `False` if a domain ends up empty, otherwise `True`. When `arcs` is `None`, start from all arcs | AC-3 |
| `assignment_complete(assignment)` | Return `True` if every variable has a value | The first line of backtracking search |
| `consistent(assignment)` | Return `True` only if all values are distinct, every length is correct, and neighboring variables do not conflict | The consistency check inside backtracking search |
| `order_domain_values(var, assignment)` | Return `var`'s values ordered by how many neighbor values they rule out, fewest first | Least-constraining value |
| `select_unassigned_variable(assignment)` | Return the unassigned variable with the fewest remaining values; on a tie, the one with the highest degree | MRV and the degree heuristic |
| `backtrack(assignment)` | Return a complete assignment, or `None` if there is no solution | Backtracking search |

Reminders from the spec: `ac3` does not need to enforce word uniqueness, which is the job of `consistent`; `order_domain_values` does not count neighbors that are already assigned; interleaving inference inside `backtrack` is optional.

### Code the course provides

All of `crossword.py` is already written. In `generate.py`, `letter_grid`, `print`, `save`, `solve` and `main` are written; the eight functions in the task table consist, in the official file, of a docstring and a single `raise NotImplementedError`, and are yours to write.

`Variable` in `crossword.py` (the official file, with `__str__` and `__repr__` omitted):

```python
class Variable():

    ACROSS = "across"
    DOWN = "down"

    def __init__(self, i, j, direction, length):
        """Create a new variable with starting point, direction, and length."""
        self.i = i
        self.j = j
        self.direction = direction
        self.length = length
        self.cells = []
        for k in range(self.length):
            self.cells.append(
                (self.i + (k if self.direction == Variable.DOWN else 0),
                 self.j + (k if self.direction == Variable.ACROSS else 0))
            )

    def __hash__(self):
        return hash((self.i, self.j, self.direction, self.length))

    def __eq__(self, other):
        return (
            (self.i == other.i) and
            (self.j == other.j) and
            (self.direction == other.direction) and
            (self.length == other.length)
        )
```

The attributes and the method you will use on a `Crossword(structure_file, words_file)` object:

| Name | Content |
|---|---|
| `crossword.height`, `crossword.width` | Height and width of the puzzle |
| `crossword.structure` | A 2D list; `structure[i][j]` is `True` when that cell is to be filled with a letter |
| `crossword.words` | The set of all available words (upper-cased when the file is read) |
| `crossword.variables` | The set of all `Variable` objects |
| `crossword.overlaps` | A dict keyed by a pair of variables. `overlaps[v1, v2]` is `None` when they do not overlap, or `(i, j)` when character `i` of `v1` must equal character `j` of `v2` |
| `crossword.neighbors(var)` | A method returning the set of all variables that overlap `var` |

`CrosswordCreator` in `generate.py` (the official file, with `letter_grid`, `print` and `save` omitted):

```python
class CrosswordCreator():

    def __init__(self, crossword):
        """
        Create new CSP crossword generate.
        """
        self.crossword = crossword
        self.domains = {
            var: self.crossword.words.copy()
            for var in self.crossword.variables
        }

    def solve(self):
        """
        Enforce node and arc consistency, and then solve the CSP.
        """
        self.enforce_node_consistency()
        self.ac3()
        return self.backtrack(dict())
```

The three lines of `solve` are the lecture's order: node consistency first, then AC-3, then backtracking search.

### Approach

First map the lecture's terms onto this project: a variable is each across or down sequence of cells (`Variable`), its domain is the set of words `self.domains[var]`, the unary constraint is word length, and the binary constraint is that the cell recorded in `overlaps` holds the same letter. `solve` already fixes the order of the three stages. Writing the eight functions in the order below lets you check each one on its own as you go.

1. **`enforce_node_consistency`**. This matches the two-course example at the start of ["Node consistency, arc consistency and AC-3"](#node-consistency-arc-consistency-and-ac-3) ([59:53](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3593s)): the lecture removes from A's domain the value that fails `A ≠ Monday`. Here every variable has exactly one unary constraint, its length. Go through each variable's domain and remove every word whose length is not the variable's length.
2. **`revise(x, y)`**. This matches `Revise` in the same section ([1:06:48](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4008s)). The lecture's "no value in Y's domain satisfies the constraint" means here: some word for `x` has a certain letter in the shared cell, and no word in `y`'s domain has that letter in that cell. Which character of each word the shared cell is comes from `overlaps[x, y]`; `None` means the two variables do not overlap and there is nothing to remove. Only `x`'s domain changes; `y`'s is left alone.
3. **`ac3(arcs)`**. This matches AC-3 ([1:09:14](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4154s)). When `arcs` is `None`, the queue starts with every pair of overlapping variables, in both directions, because `(X, Y)` and `(Y, X)` check different domains. Then follow the pseudocode: take one arc out, call `revise`, and if something changed, check whether the domain is empty and put `x`'s other neighbors back in the queue.
4. **`assignment_complete` and `consistent`**. These match ["A CSP as a search problem: backtracking search"](#a-csp-as-a-search-problem-backtracking-search) ([1:17:18](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4638s)). The assignment passed to `consistent` is usually incomplete, and the approach is the same as `consistent` in the lecture's `schedule0.py`: only check constraints whose two ends are both assigned. This project has three things to check: no word is repeated, every word has the right length, and neighboring variables that are both assigned agree on the letter in their shared cell.
5. **`order_domain_values`**. This matches least-constraining value in ["Heuristics for choosing variables and ordering values"](#heuristics-for-choosing-variables-and-ordering-values-mrv-degree-least-constraining-value) ([1:40:12](https://www.youtube.com/watch?v=qK46ET1xk2A&t=6012s)). For each candidate word for `var`, count how many of the neighbors' words it makes unusable: a neighbor's word is ruled out when its letter in the shared cell differs. Count only neighbors that are not assigned yet, add the counts across neighbors, and order from fewest to most.
6. **`select_unassigned_variable`**. This matches MRV ([1:35:56](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5756s)) and the degree heuristic ([1:36:34](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5794s)) in the same section. Among the unassigned variables pick the one with the smallest domain; on a tie, the one with the most neighbors.
7. **`backtrack`**. Write it from the lecture's `Backtrack` pseudocode. An assignment is a dict whose keys are `Variable` objects and whose values are words. Whether to add ["maintaining arc consistency"](#interleaving-search-and-inference-maintaining-arc-consistency) ([1:32:14](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5534s)) inside it is optional; if you do, use the `arcs` argument of `ac3`. A reminder of my own: `ac3` changes `self.domains` directly, so when a word turns out not to work and you go back, the domains it shrank have to be restored too.

The spec suggests implementing `order_domain_values` and `select_unassigned_variable` without the heuristics first, returning any order, so the whole pipeline runs, and then going back to add the ordering; without the heuristics the results are still correct, and the algorithm may just try more assignments.

### Pseudocode

This is the lecture's pseudocode restated for a crossword. It does not say how to operate on the Python data structures; that part is yours to decide.

```text
Enforce-Node-Consistency():
    for each variable V:
        remove from V.domain every word whose length differs from V.length

Revise(X, Y):
    if X and Y share no cell: return false
    (i, j) = where the shared cell falls in X's word and in Y's word
    revised = false
    for each word x in X.domain:
        if no word y in Y.domain has the letter at j that x has at i:
            delete x from X.domain
            revised = true
    return revised

AC-3(arcs):
    queue = arcs if given, otherwise every pair (X, Y) that overlaps
    while queue non-empty:
        (X, Y) = Dequeue(queue)
        if Revise(X, Y):
            if X.domain is empty: return false
            for each Z in X.neighbors - {Y}:
                Enqueue(queue, (Z, X))
    return true

Consistent(assignment):
    inconsistent if two variables hold the same word
    inconsistent if some word's length differs from its variable's length
    inconsistent if two overlapping variables, both assigned, disagree on their shared cell
    otherwise consistent

Order-Domain-Values(V, assignment):
    for each word w in V.domain:
        cost(w) = how many words w rules out, summed over V's unassigned neighbors
    return V.domain ordered by cost, lowest first

Select-Unassigned-Variable(assignment):
    among the variables not in assignment:
        prefer the smallest domain
        on a tie, prefer the most neighbors
        on a further tie, any of them

Backtrack(assignment):
    if assignment complete: return assignment
    V = Select-Unassigned-Variable(assignment)
    for each word w in Order-Domain-Values(V, assignment):
        if assignment with {V = w} is consistent:
            result = Backtrack(assignment with {V = w})
            if result ≠ failure: return result
    return failure
```

### Where things go wrong

The items below come from this site running the reference implementation against the official files on 2026-10-13 and deliberately breaking a separate copy; the error messages listed are the ones actually seen.

- **Using `neighbors` like a dict.** What you see: `TypeError: 'method' object is not subscriptable`. Why: `crossword.neighbors` is a method; call it with parentheses and it returns a set.
- **Using `overlaps` like a nested dict.** What you see: `KeyError: Variable(...)`. Why: its keys are pairs of variables, written `overlaps[v1, v2]`. A variable paired with itself is not in it either, so `overlaps[v, v]` is also a `KeyError`; skip identical pairs when you enumerate all pairs yourself.
- **Removing words from a domain while iterating over it.** What you see: `RuntimeError: Set changed size during iteration`. Why: a domain is a set, and its size cannot change during iteration. The lecture's pseudocode deletes inside the loop, and carrying that over literally to a Python set hits this in both `enforce_node_consistency` and `revise`.
- **Swapping the two numbers of an overlap.** What you see: `IndexError: string index out of range`; this site swapped them on purpose on the three official data sets and got this error most of the time; on `structure1`/`words1` it sometimes raises nothing and prints `No solution.`, and the same program does not behave the same on every run. When both positions happen to fall inside the words there is never an error, and what you get is `No solution.` for a puzzle that has one: this site built a small data set of its own as a minimal reproduction, across CAT and down TOP crossing at the T with the overlap `(2, 0)`, where the correct version prints the puzzle and the swapped version reports no solution. Why: in the `(i, j)` of `overlaps[x, y]`, `i` is the position in `x`'s word and `j` the position in `y`'s. How to notice: in `structure0`, the down variable of length 5 and the bottom across variable of length 4 give `(4, 0)` one way and `(0, 4)` the other; swap them and you ask a four-letter word for position 4 (counting from 0), where there is no letter.
- **Assuming there are no repeated words once `ac3` has run.** What you see: the same word twice in the finished puzzle. Why: arc consistency looks only at the letters in shared cells and knows nothing about repeated words. `structure0`/`words0` shows it: after `ac3`, the down variable of length 4 on the right still has FIVE and NINE, and the across variable of length 4 at the bottom has only NINE. Filling both with NINE makes the shared cell agree, and it is `consistent` that has to reject it. Without that check it does not go wrong every time: the iteration order of a domain changes from run to run, and the runs that try FIVE first come out right, so one clean run does not show the problem is absent; run it several times.
- **`consistent` assuming every neighbor already has a word.** What you see: `KeyError: Variable(...)`. Why: most assignments passed in are incomplete, and the code reaches for the word of a neighbor that is not assigned yet.
- **Returning something other than `None` when there is no solution.** What you see: `AttributeError: 'bool' object has no attribute 'items'` (when returning `False`). Why: the official `main` tests `assignment is None` to detect no solution, and any other value is sent to the printing code. How to notice: run `structure1` with `words0`; it should print `No solution.`.
- **Nobody reads the return value of `ac3`.** The official `solve` calls `ac3`, ignores what it returns, and goes straight into `backtrack`. So even when `ac3` has already found an empty domain, `backtrack` is still called and must be able to return `None` in that situation by itself.
- **Mistakes in the two ordering functions do not show in the result.** If `order_domain_values` is sorted the wrong way round, or `select_unassigned_variable` breaks ties wrongly, the puzzle still comes out right, after a few more attempts. Print what these two functions return and check it separately; the next subsection has cases you can work by hand.
- **Different output on every run.** This is not a bug. Domains are sets, Python hashes strings differently each time it starts, and the iteration order changes with it. Run the reference implementation on `structure1`/`words1` ten times in a row and you see several different puzzles (this site saw 3 in one batch, the reviewer 4 in another), all of them valid. So you cannot compare your output character by character with the sample on the spec page.
- **Testing with lower-case words.** `crossword.words` is converted to upper case when the file is read, so comparing against `"six"` never matches.
- **Image output failing.** Without Pillow you get `ModuleNotFoundError`. With Pillow but run from another directory you get `OSError: cannot open resource`, because `save` looks for the font at the relative path `assets/fonts/OpenSans-Regular.ttf`; run it from inside the `crossword` directory.

### How to check your own work

**1. Work the smallest data set by hand.** `structure0` has four variables: the across one at the top (length 3), the down one on the left (length 5), the down one on the right (length 4) and the across one at the bottom (length 4). `words0` is the ten words ONE through TEN. Print `self.domains` after each stage; it should be:

| Variable | At the start | After `enforce_node_consistency` | After `ac3` |
|---|---|---|---|
| Top across, length 3 | 10 words | ONE, SIX, TEN, TWO | SIX |
| Left down, length 5 | 10 words | EIGHT, SEVEN, THREE | SEVEN |
| Right down, length 4 | 10 words | FIVE, FOUR, NINE | FIVE, NINE |
| Bottom across, length 4 | 10 words | FIVE, FOUR, NINE | NINE |

You can derive the table yourself: the first letter of the top across word must equal the first letter of the left down word, which leaves ONE without a partner, and EIGHT too; the last letter of the left down word must equal the first letter of the bottom across word, which only SEVEN with NINE satisfies, and that settles SIX; the right down word and the bottom across word must share their last letter, which removes FOUR. `ac3` returns `True` on this data. There is exactly one finished puzzle: SIX, SEVEN, FIVE, NINE.

**2. Hand cases for the two ordering functions.** Same data, right after `enforce_node_consistency` and with an empty assignment:

- `order_domain_values` (for the top across variable): SIX, TEN and TWO each rule out 2 words of the left down variable, and ONE rules out 3. The returned list should contain four words with ONE last; the first three may come in any order.
- `select_unassigned_variable`: the last three variables all have a domain of 3 words, a tie; the left down and bottom across variables have 2 neighbors each, and the right down variable has only 1. It should return the left down or the bottom across variable, not the right down one, and certainly not the top across one, whose domain has 4 words.

**3. Three structures against three word lists.** This site ran the reference implementation once on each of the nine combinations (2026-10-13, Python 3.15.0), with the results below. The two `None` cells should print `No solution.`:

| | `words0` (10 words) | `words1` (51 words) | `words2` (3000 words) |
|---|---|---|---|
| `structure0` (4 variables) | solution | solution | solution |
| `structure1` (6 variables) | `None` | solution | solution |
| `structure2` (6 variables) | `None` | solution | solution |

`structure1` needs a 12-letter word and `words0` has none, so there is no solution. On this site's machine each of the nine combinations finished within 0.1 seconds; if your version takes a long time on `structure2`/`words2`, check the two heuristics and `ac3` first.

**4. Check that the printed puzzle is valid.** Because the result can differ from run to run, check properties: every sequence of cells has a word, each length is right, every word is in the word list, no word is repeated, and every crossing cell reads as the same letter across and down.

**5. The image.** A third argument writes a PNG at 100 pixels per cell; `structure1` is 14 columns by 9 rows, and this site's run produced a 1400×900 image.

**6. The official checks.**

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/3/crossword.zip
unzip crossword.zip && cd crossword

# Print to the terminal only
python generate.py data/structure1.txt data/words1.txt

# Also write an image file (needs pip3 install Pillow first)
python generate.py data/structure1.txt data/words1.txt output.png

# Autograde
check50 ai50/projects/2024/x/crossword

style50 generate.py
```

The spec states at the top that the latest Python version to use for this course is 3.12. Crossword is the only project this week.

### Full reference implementation

<details>
<summary>Full reference implementation (open only after you have written and submitted your own)</summary>

> ⚠️ If you are taking this course, or plan to apply for a CS50 certificate: the course's [academic honesty policy](https://cs50.harvard.edu/ai/honesty/) says you may not look at someone else's solution before submitting your own work. Finish and submit first, then use this part to compare. This implementation has only been run in the environment listed on this site and has not been through check50.

The eight functions below go into `CrosswordCreator` in the official `generate.py`: indent the whole block by four spaces and replace the eight methods of the same names in the class (in the official file each of them consists of `raise NotImplementedError`). `backtrack` is written the way the lecture's `schedule0.py` does it, without inference.

```python
def enforce_node_consistency(self):
    for var in self.domains:
        self.domains[var] = {
            word for word in self.domains[var]
            if len(word) == var.length
        }

def revise(self, x, y):
    overlap = self.crossword.overlaps[x, y]
    if overlap is None:
        return False
    i, j = overlap
    removable = {
        wx for wx in self.domains[x]
        if not any(wx[i] == wy[j] for wy in self.domains[y])
    }
    self.domains[x] -= removable
    return bool(removable)

def ac3(self, arcs=None):
    if arcs is None:
        queue = [
            (x, y)
            for x in self.crossword.variables
            for y in self.crossword.neighbors(x)
        ]
    else:
        queue = list(arcs)
    while queue:
        x, y = queue.pop(0)
        if self.revise(x, y):
            if not self.domains[x]:
                return False
            for z in self.crossword.neighbors(x) - {y}:
                queue.append((z, x))
    return True

def assignment_complete(self, assignment):
    return all(var in assignment for var in self.crossword.variables)

def consistent(self, assignment):
    words = list(assignment.values())
    if len(words) != len(set(words)):
        return False
    for var, word in assignment.items():
        if len(word) != var.length:
            return False
        for other in self.crossword.neighbors(var):
            if other in assignment:
                i, j = self.crossword.overlaps[var, other]
                if word[i] != assignment[other][j]:
                    return False
    return True

def order_domain_values(self, var, assignment):
    def ruled_out(word):
        count = 0
        for other in self.crossword.neighbors(var):
            if other in assignment:
                continue
            i, j = self.crossword.overlaps[var, other]
            count += sum(1 for w in self.domains[other] if w[j] != word[i])
        return count

    return sorted(self.domains[var], key=ruled_out)

def select_unassigned_variable(self, assignment):
    unassigned = [
        var for var in self.crossword.variables
        if var not in assignment
    ]
    return min(
        unassigned,
        key=lambda var: (
            len(self.domains[var]),
            -len(self.crossword.neighbors(var))
        )
    )

def backtrack(self, assignment):
    if self.assignment_complete(assignment):
        return assignment
    var = self.select_unassigned_variable(assignment)
    for word in self.order_domain_values(var, assignment):
        new_assignment = assignment.copy()
        new_assignment[var] = word
        if self.consistent(new_assignment):
            result = self.backtrack(new_assignment)
            if result is not None:
                return result
    return None
```

Compared with the lecture: `revise` and `ac3` are direct translations of the pseudocode, and the line that puts `(z, x)` back into the queue corresponds to `Enqueue(queue, (Z, X))`. The sort key in `select_unassigned_variable` compares domain size first (MRV), then the negated neighbor count (higher degree first).

Run record (2026-10-13, macOS, Python 3.15.0): placed into the official 2023/x distribution and run on all nine combinations of the three structures and three word lists, with the results in the table under point 3 of "How to check your own work"; the seven that have a solution all pass the validity checks listed in point 4. The command with `output.png` was also run in a throwaway environment with Pillow installed and produced a 1400×900 PNG. `check50` was not run.

</details>

---

## Learning Checklist

- [ ] Can say how local search differs from the search in Week 0 and what kind of problem it suits
- [ ] Can explain why hill climbing stops at a local optimum, and how random restart and simulated annealing each deal with that
- [ ] Can use `e^(ΔE/T)` to explain how temperature and "how much worse" affect the probability of accepting a worse neighbor
- [ ] Can write a two-variable problem as a linear program's cost function and constraints, including rewriting "greater than or equal to" as "less than or equal to"
- [ ] Can explain why `(Z, X)` goes back into the queue after `Revise` returns true
- [ ] On `structure0`/`words0`, your own Crossword leaves every variable's domain after `enforce_node_consistency` and after `ac3` the same as the table in point 1 of "How to check your own work"
- [ ] Your own `order_domain_values` and `select_unassigned_variable` pass the two hand cases in point 2 of "How to check your own work"
- [ ] Across the nine combinations of structure and word list, where you get a solution and where you get `No solution.` matches the table in point 3 of "How to check your own work"
- [ ] Can run backtracking search by hand on the exam-scheduling graph and say which steps maintaining arc consistency saves
- [ ] Can say what MRV, the degree heuristic and least-constraining value each decide, and why the last two point in opposite directions
- [ ] Can explain how Crossword's `overlaps[v1, v2]` represents a binary constraint
- [ ] Crossword project passes `check50` clean

## Course video sources

The official CS50 YouTube playlist (CS50’s Introduction to Artificial Intelligence with Python, 8 videos) was checked live on 2026-10-10; the Week 3 lecture recording is listed there.

Original videos: [Optimization - Lecture 3 - CS50's Introduction to Artificial Intelligence with Python 2020](https://www.youtube.com/watch?v=qK46ET1xk2A)

Course and recording entries:

- [CS50 AI Week 3 — official video, slides and notes](https://cs50.harvard.edu/ai/weeks/3/)
- [CS50's Introduction to AI with Python — official YouTube playlist (8 videos)](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-13): the timecoded English captions were fetched with yt-dlp and the full 1:44:44 was read before rewriting the "Lecture walkthrough". Section start times and the numbers quoted in the text (the costs in the hospital example, the output of `hospitals.py` and random restart, the coefficients and solution of the linear program, the course lists and backtracking steps of the exam schedule, the counts in the least-constraining-value example) all come from the captions. The slides were not viewed, and the map, the state-space landscape and the constraint graph are not reconstructed. The captions contain four slips of the tongue that affect a number or the meaning, which this article resolves from context and the lecture source code: at 16:21 "still not the global minimum" is said as "local minimum"; at 25:09 the hospital being moved is called a "house"; at 45:31 x₁'s labor per hour is said as 50 (it is 5 before, after and in the code); at 49:15 the upper bound of the second constraint is said as 90 (the code has −90). A few more slips do not affect the content and the text already has them right: at 44:48 x₁ is called "x"; at 1:28:44 `schedule1.py` is called `schedule.py`; at 1:37:39 the value left for C is called a "variable"; at 1:40:17 "values" and "variables" are swapped in the definition of least-constraining value. The six pieces of pseudocode were compared line by line with the official notes (the 2020 Week 3 Notes): `Simulated-Annealing`, `Revise`, `AC-3` and both versions of `Backtrack` are the same, except that the notes put statements like `if …: return …` on two lines; for `Hill-Climb` the notes write `best valued neighbor`, and this article writes `highest valued neighbor` as the lecturer says at 9:54. The node names in the least-constraining-value example (B, E, F) come from the official notes. The excerpts and descriptions of `hospitals.py`, `production.py` and `schedule0.py` were also checked against the lecture source code (`src3.zip`). `production.py` was run by the independent reviewer with scipy 1.18.1 and printed `X1: 1.5 hours` and `X2: 6.25 hours` with an objective value of 575.0, matching the captions at 50:15; the author later reran it in a throwaway environment and got the same two lines. The captions never mention this week's Crossword project; the project section comes from the course website, not the video.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official CS50 YouTube playlist was checked live and lists this week’s lecture recording, so the status is now Videos included.
- 2026-10-10: Checked the video content against its transcript. Removed items and the project introduction not found in the transcript; timecodes are now approximate values estimated from the transcript.
- 2026-10-13: Moved the player from the source section to "Lecture Video & Timestamps" and added the running time to the opening.
- 2026-10-13: Rechecked the timestamp table against timecoded captions, replaced the approximate minutes with actual start times, and linked every row to the matching position in the video; the running time is now 1:44:44 as reported by yt-dlp.
- 2026-10-13: Rewrote "Core Concepts Cheat Sheet" from the captions as a ten-section "Lecture walkthrough", each section with a time link and one self-check. Content from the old cheat sheet that the lecture does not mention was removed: sideways moves, ridges, the "Drawback" column for each algorithm, "As T → 0, reduces to Hill Climbing", forward checking, and the `ac3.py` and `backtracking.py` snippets, which are not lecture code.
- 2026-10-13: Rewrote the project section from the official 2023/x `crossword.zip`. The distribution code shown before did not match the official files (`CrosswordCreator.__init__` had an extra `words` parameter, `overlaps` was written as a nested dict, `neighbors` was treated as an attribute, and `solve` was missing the node consistency and AC-3 steps), and the reference implementation used `add_constraints`, `self.constraints`, `is_consistent` and `forward_check`, none of which exist in the official files, so it could not run there. It now shows the official class definitions and the eight functions to implement, and the reference implementation is a version that was run on all three official data sets.
- 2026-10-13: Fixes from an independent review. The Chinese version now says simplex was "one of the first" algorithms (it had said the first); the self-check in the backtracking section now asks for a hand run in `schedule0.py`'s variable order, and the earlier "why exactly six solutions" derivation moved into the body; the least-constraining-value example now names the nodes given in the official notes; the note on where the pseudocode comes from was rewritten after comparing it with the official notes; the Chinese version explains that its two renderings of "constraint" are the same word; the reference implementation now says how to indent it and reports the image-output run; the content check lists the remaining slips of the tongue and the `production.py` run; "OCW site" became "course website".
- 2026-10-13: The project section now puts the task, the code the course provides, the approach, pseudocode, where things go wrong and ways to check first, with the full reference implementation folded at the end behind a note that links to the course's [academic honesty policy](https://cs50.harvard.edu/ai/honesty/). The code of the reference implementation is unchanged; results for all nine combinations of structure and word list were added. The project items in the learning checklist became conditions you can verify yourself.
- 2026-10-13: Fixes from the review of the project section. The `Consistent` pseudocode now lists only the three conditions; `tldr` and `description` now match the article as it stands (the reference implementation is folded at the end); the case where swapped overlap positions raise no error is now a measured result on a small data set; the items on output varying between runs and on repeated words no longer rest on a single run; the last subsection is now titled "Full reference implementation". The code inside the fold is unchanged.

## References

- [Week 3 Optimization lecture page](https://cs50.harvard.edu/ai/weeks/3/) — video, slides, transcript, quiz
- [Optimization - Lecture 3 (YouTube)](https://www.youtube.com/watch?v=qK46ET1xk2A) — the basis of the "Lecture walkthrough"; content, numbers and time links come from its English captions
- [Week 3 lecture source code src3.zip](https://cdn.cs50.net/ai/2020/spring/lectures/3/src3.zip) — `hospitals.py`, `production.py`, `schedule0.py`, `schedule1.py`
- [Week 3 Notes (2020 edition)](https://cs50.harvard.edu/ai/2020/notes/3/) — official notes, useful for the figures on the slides
- [Crossword project spec](https://cs50.harvard.edu/ai/projects/3/crossword/) — Distribution code `2023/x`, check50 slug `ai50/projects/2024/x/crossword`
- [CS50 AI YouTube playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm) — includes the full Week 3 video
- [check50 documentation](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- On this site: [Harvard CS50 AI Overview](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en) — series entry & version notes
- On this site: [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) — A3 tier definition
