# Lecture 5: Search I: Define the State Before Choosing the Algorithm

- Date: 2025-10-06
- Instructor: Percy Liang
- Official schedule title: Search I
- Artifact: search
- Primary URL: https://stanford-cs221.github.io/autumn2025-lectures/?trace=search
- Material gap: The executable lecture is public; solutions to the route assignment are not.

## Agenda evidence

- A search problem consists of a start state, successor function, end condition, and action costs. The most underestimated component is the state: it must preserve information needed by future decisions without storing the entire history.
- Exhaustive search repeatedly solves identical subproblems; memoizing the best continuation yields dynamic programming. Here DP is not a separate genre but a consequence of merging equivalent states.
- A better search algorithm cannot repair a bad model. If two histories with different futures collapse into one state, the algorithm precisely solves the wrong graph.

## Writing boundary

Follow the executable artifact's order. Do not import Spring 2025 CSP material or unpublished assignment solutions. Distinguish course claims from editorial extensions.

