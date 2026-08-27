# Lecture 4: Learning III: Deep Networks as Composable Computation Graphs

- Date: 2025-10-01
- Instructor: Percy Liang
- Official schedule title: Learning III
- Artifact: deep_learning
- Primary URL: https://stanford-cs221.github.io/autumn2025-lectures/?trace=deep_learning
- Material gap: Executable PyTorch examples are public; the recording is available separately in the official playlist.

## Agenda evidence

- The key to a deep network is not merely stacking linear layers but inserting nonlinearities between them; without nonlinearities, multiple matrix products collapse into one layer.
- The artifact compares a hand-built computation graph with PyTorch and shows how autograd preserves node relationships. A detach operation cuts a gradient path and can change which parameters actually train.
- A full training loop consists of batching, forward computation, loss, backward computation, an optimizer step, and gradient clearing. Each step is simple, yet poor state management can train the wrong graph.

## Writing boundary

Follow the executable artifact's order. Do not import Spring 2025 CSP material or unpublished assignment solutions. Distinguish course claims from editorial extensions.

