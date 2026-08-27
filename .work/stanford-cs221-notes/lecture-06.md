# Lecture 6: Search II: Priorities in UCS and A*

- Date: 2025-10-08
- Instructor: Percy Liang
- Artifact: ucs_astar
- URL: https://stanford-cs221.github.io/autumn2025-lectures/?trace=ucs_astar
- Gap: Official lecture material and video are public; Canvas interactions, assignment solutions, and hidden tests are unavailable.

## Agenda evidence

- UCS expands the frontier by accumulated cost; with nonnegative costs, a goal removed from the queue has minimum cost.
- A* adds a heuristic to past cost. An admissible, consistent heuristic preserves optimality while avoiding regions that cannot improve the answer.
- Backpointers retain only the best predecessor, so the queue need not carry complete paths.

## Boundary

Use only Autumn 2025 evidence. Keep course claims separate from editorial interpretation; do not reconstruct hidden tests or missing classroom discussion.

