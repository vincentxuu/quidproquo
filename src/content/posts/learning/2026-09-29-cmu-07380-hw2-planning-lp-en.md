---
title: "Reading CMU 07-380 HW2: Classical and Motion Planning, from Robot-Cook PDDL to RRT* to Graphing LPs"
date: 2026-09-29
category: learning
tags: [cmu, 07-380, ai-course, course-guide, planning, rrt, linear-programming]
lang: en
type: guide
difficulty: 進階
series:
  name: "Reading CMU 07-380"
  order: 6
tldr: "07-380 HW2 has three parts. The programming assignment has you write PDDL for a pancake-cooking robot, solve it optimally with unified-planning and Fast Downward, then implement RRT and RRT* in rrt.py (Q2–Q7). The written part covers GraphPlan, one LP modeling problem, and two LP graphing problems. A Gradescope online component is CMU-only. This guide covers structure, prerequisites, and running the local autograder; it contains no solutions."
description: "A guide to CMU 07-380 Fall 2026 HW2: the planning programming assignment (robot-cook PDDL, unified-planning, Fast Downward, rrt.py Q2–Q7, amongUs, robotCook) and the four written problems (GraphPlan, Bayes the Bat LP, Graphing LPs, Feasible Regions), with structure, points, and prerequisites, based on the course site as of 2026-09-29. No solutions."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-09-29-cmu-07380-hw2-planning-lp)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

This is **HW2** of [CMU 07-380 AI & ML II](https://www.cs.cmu.edu/~07380/), Fall 2026. The site lists it as due 9/18 (Fri) 11:59 pm, which has passed. It ties together the two previous lectures, [Lecture 3](/en/posts/learning/2026-09-29-cmu-07380-lecture-03-classical-planning-en) on PDDL and GraphPlan and [Lecture 4](/en/posts/learning/2026-09-29-cmu-07380-lecture-04-motion-planning-rrt-en) on RRT and RRT\*, and the written part also tests linear programming from Lecture 5.

The assignment page opens with a short poem that sums up its two levels: first the pancake plan, then a random tree growing around the griddle. *Which actions in what order* is classical planning; *how the arm gets there without hitting anything* is motion planning.

**This post contains no solutions.** The course has academic-integrity rules, and the programming page states that submissions are checked against each other for logical redundancy. What follows covers what each problem tests, which concept it needs, and how to check your work locally.

Everything here reflects the [course site as of 2026-09-29](https://www.cs.cmu.edu/~07380/#assignments); the site notes that the schedule is subject to change.

## Course video sources

The official Fall 2026 schedule and assignment list have been checked: public resources include slides, pre-readings, demonstrations and assignments, but no public recording link for the corresponding lectures. This article is therefore a materials-based guide with no corresponding lecture player. This observation concerns the public official page and does not establish whether internal recordings exist.

Official sources:

- [CMU 07-380 Fall 2026 官方課表與教材](https://www.cs.cmu.edu/~07380/)

Checked on 2026-10-10.

## Official materials and scope

| Part | Materials | Access |
|---|---|---|
| Programming | [Classical and Motion Planning assignment page](https://www.cs.cmu.edu/~07380/assignments/planning/), [`planning.zip`](https://www.cs.cmu.edu/~07380/assignments/planning/planning.zip) | Public, with local autograder |
| Written | [`hw2_blank.pdf`](https://www.cs.cmu.edu/~07380/assignments/hw2_blank.pdf), [`hw2.zip`](https://www.cs.cmu.edu/~07380/assignments/hw2.zip) (LaTeX template) | Public |
| Online | Gradescope | CMU-only |
| Solutions | — | Not posted on the site |

`hw2.zip` contains `hw2.tex`, one `.tex` per problem, the collaboration statement `q_collaboration.tex`, and under `figures/` the images `graphplan.png` and `feasible_regions.png` plus the plotting starter `plot_graph.py`.

**Access level**: both the programming and written parts can be fully redone outside CMU; only the online questions and official solutions are missing, so this assignment reaches A3. The course as a whole is still A2 (in progress); see the [global AI/CS course map](/en/posts/learning/2026-08-21-global-ai-cs-course-map-en).

## Programming: Robot Cook and RRT

### Setup and files

The page targets Python 3.12. Install `numpy pillow`; Q1 also needs [unified-planning](https://unified-planning.readthedocs.io/) and [Fast Downward](https://www.fast-downward.org/):

```bash
python3.12 -m pip install numpy pillow
python3.12 -m pip install "unified-planning[fast-downward]"
python3.12 plan.py blocksworld_domain.pddl blocksworld_3blocks.pddl
```

The last line tests the install on the pre-reading's Blocks world files and should print a six-step plan. The page says Fast Downward runs in its optimal configuration.

You submit only four files: `robot-cook_domain.pddl`, `robot-cook_cook1.pddl`, `robot-cook_cook2.pddl`, and `rrt.py`. Worth reading first: `configuration_space.py` (the five-method interface `sample`, `isLegal`, `allLegal`, `getVector`, `distance`), `rrtUtil.py` (the small worlds and hand-built trees the tests use), `plan.py`, and the two games `robotCook.py` and `amongUs.py`.

### What each question tests

| Q | Points | Task | Concept |
|---|---:|---|---|
| Q1 | 8 | Write the robot-cook PDDL domain and two problems from scratch | STRIPS, CWA, domain/problem split |
| Q2 | 5 | `getValidSegmentPath`, `computePathCost` | whole-segment collision checks, path cost |
| Q3 | 5 | `RRTNode.findNearest` | nearest neighbor (recursing over the tree) |
| Q4 | 10 | `growRRT`: one RRT iteration | sampling, steering, `max_edge` |
| Q5 | 7 | `findAllNear`, `addConfigToBestParent` | RRT\* best parent |
| Q6 | 7 | `rewire` | RRT\* rewiring |
| Q7 | 8 | `growRRTStar` | combining Q5 and Q6 into the RRT loop |

50 points in total.

**Q1's design.** The arm holds one tool at a time (ladle or flipper), and each pancake moves from ordered → poured (raw) → flipped → on the flipper → served. The six action names are fixed: `switch`, `fill`, `pour`, `flip`, `lift`, `serve`, and the page's table gives each action's "allowed when" and "afterwards" conditions. Predicates, parameters, and object names are your design, and you must stick to `:strips`. cook1 orders one pancake; cook2 orders two, with the goal of the first on the plate and the second on top of it.

The autograder checks in two layers. First it runs the same optimal planner on your files and compares the sequence of action names (arguments dropped); the page lists the expected sequence for cook1 and says cook2's optimal plan has 12 steps, with two orderings both accepted. Second, it checks rules one at a time: certain short sequences must be impossible (such as pouring from an empty ladle) and others must be possible. The debugging hint on the page is useful: a plan shorter than expected usually means a missing precondition or an effect that gives away too much; a longer plan or no plan usually means a missing effect, an extra precondition, an incomplete `:init`, or a goal that asks too much. That is exactly [Lecture 3](/en/posts/learning/2026-09-29-cmu-07380-lecture-03-classical-planning-en)'s complete-`:init`, partial-`:goal` rule.

**Q2–Q7's design.** A configuration is a NumPy array of K numbers, and nothing in `rrt.py` should care what K is: the crewmate is (x, y), the two-link arm is (θ<sub>1</sub>, θ<sub>2</sub>), and `robotCook.py --links 4` gives four dimensions. The page separates two limits that are easy to confuse: `step_limits` caps how far each action may move in each dimension, while `max_edge` is the longest edge RRT will add, and one edge is usually several actions long. That matches the "convert the path to actions" slide in [Lecture 4](/en/posts/learning/2026-09-29-cmu-07380-lecture-04-motion-planning-rrt-en).

Q7 has a deliberate simplification: `rrt()` stops as soon as a node passes the goal test, for RRT\* as for RRT. The page explains that full RRT\* could keep sampling and rewiring, making the path shorter, which is where asymptotic optimality comes from; the assignment stops at the first goal so both planners return quickly.

### Pitfalls from the official FAQ

These are the page's own reminders, not solutions:

- Q2: return `None`, not an empty list, when the segment is blocked; legality is only checked at the interpolated configurations
- Q4: call `config_space.sample()` exactly once per `growRRT` call, because tests hand you specific samples and random worlds are seeded, so an extra call changes the tree
- Q4: use `config_space.getVector(q_nearest, q_rand)` for the direction instead of subtracting
- Q5–Q7: the neighbors within the rewire radius may not include the nearest node, so `growRRTStar` has to add it
- Q6: reparent with `neighbor.updateParent`, which keeps children lists and cached costs consistent for the whole subtree

### Local checks

```bash
python3.12 autograder.py          # everything
python3.12 autograder.py -q q4    # one question
python3.12 autograder.py -t test_cases/q2/04_segmentBlocked   # one test
```

Once Q4 works, go play: in `amongUs.py` the crewmate plans its own route to the other crewmates; in `robotCook.py`, `p` plans to the current goal, `a` lets the robot cook on its own, and `s` toggles between RRT and RRT\*.

## Written: GraphPlan plus three LP problems

| Problem | Points | Content | Concepts |
|---|---:|---|---|
| 1 Planning | 10 | Six operators, start state A, goal C ∧ D ∧ E: draw the GraphPlan graph until termination, report the plan, judge optimality, list mutex operators in A<sub>0</sub> and mutex predicates in S<sub>1</sub> | GraphPlan, no-ops, mutexes |
| 2 Bayes the Bat's Day | 8 | The course mascot splits his time between partying and homework: write the LP in inequality form, plot it with code, find the optimum | LP modeling, graphical method |
| 3 Graphing LPs | 6 | For two given A, b pairs, plot each constraint line and its unit-length normal vector | geometry of inequality form |
| 4 Feasible Regions | 9 | From three constraint lines and shaded regions, recover three A, b pairs | half-planes and inequality direction |

A collaboration statement follows, asking who helped you, whom you helped, and whether you came across existing code.

Formatting requirements to know up front:

- Answer in the provided LaTeX template without resizing or moving answer boxes, and submit the PDF to Gradescope
- Problem 1's graph can be annotated on the PDF or drawn by editing `figures/graphplan.png`; clear hand drawing is fine, and the problem reminds you that no-ops count as actions
- Problems 2 and 3 **must not be hand-drawn**: use a tool such as matplotlib, label the axes with tick marks, use `plt.axis("equal")`, and draw vectors of length one. Problem 2 also fixes the x<sub>1</sub> range to [−2, 10] and x<sub>2</sub> to [−4, 8]
- `figures/plot_graph.py` is a starter; you modify `plot_graph()` and fill in `compute_unit_length()`
- Problem 2 explicitly warns you to follow "inequality form as defined in lecture" strictly, including the direction of the inequalities

**Suggested order**: Problem 1 only needs GraphPlan from Lecture 3 and the first half of Lecture 4. Problems 2–4 need LP from Lecture 5, which is the next post in this series, so read the [Lecture 5 guide](/en/posts/learning/2026-09-29-cmu-07380-lecture-05-linear-programming-en) first and then come back.

## Related reading

- GraphPlan mutex vocabulary, the Crane problem, and h<sub>max</sub>/h<sub>add</sub> are all in the [Recitation 2 solutions](https://www.cs.cmu.edu/~07380/recitations/Recitation2_07380_f26_sol.pdf); practice there before written Problem 1.
- The hand-computed RRT is in §6 of the same recitation; working it before Q3 and Q4 is faster than debugging code.
- The page refers you to Project 0's autograder tutorial, and the bundled `autograder.py`, `testClasses.py`, `grading.py` and friends match the Pacman project family. That lineage is traced in the [Pacman AI project lineage](/en/posts/learning/2026-08-22-pacman-ai-project-lineage-en).

## Things to do tonight

1. Download `planning.zip`, install unified-planning, and run Blocks world until it prints the six-step plan.
2. Before writing code, list the predicates you want on paper from the six-action table, then check that your preconditions block "pour from an empty ladle" and "flip while holding the ladle".
3. Use the page's `buildTree` example to plot the test tree used by Q3, Q5, and Q6, and compute the nearest node by hand.
4. Before Problem 3, write down on paper which side of the line the normal vector (a<sub>i,1</sub>, a<sub>i,2</sub>) points to, then confirm it with your plot.

## Series navigation

- Previous: [Lecture 4 guide: Motion Planning, RRT samples its way through continuous space](/en/posts/learning/2026-09-29-cmu-07380-lecture-04-motion-planning-rrt-en)
- Next: [Lecture 5 guide: Linear Programming](/en/posts/learning/2026-09-29-cmu-07380-lecture-05-linear-programming-en)
- Series overview: [CMU 07-380 Fall 2026 overview](/en/posts/learning/2026-08-22-cmu-07380-fall-2026-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Re-verified the live official course pages and public video sources; no public recording for this lecture was found, so the status stands.

## References

- [CMU 07-380 AI & ML II Fall 2026 course site (Assignments)](https://www.cs.cmu.edu/~07380/#assignments)
- [07-380 programming assignment: Classical and Motion Planning](https://www.cs.cmu.edu/~07380/assignments/planning/)
- [07-380 Homework 2 written problems (hw2_blank.pdf)](https://www.cs.cmu.edu/~07380/assignments/hw2_blank.pdf)
- [07-380 Homework 2 LaTeX template (hw2.zip)](https://www.cs.cmu.edu/~07380/assignments/hw2.zip)
- [07-380 Recitation 2 Solutions](https://www.cs.cmu.edu/~07380/recitations/Recitation2_07380_f26_sol.pdf)
- [unified-planning documentation](https://unified-planning.readthedocs.io/)
- [Fast Downward](https://www.fast-downward.org/)
