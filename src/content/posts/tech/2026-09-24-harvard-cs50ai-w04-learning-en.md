---
title: "Harvard CS50 AI Week 4: Learning — Supervised Learning, k-NN, SVM, Reinforcement Learning Q-learning & Nim"
date: 2026-08-30
category: tech
type: guide
tags: [harvard-cs50ai, ai, machine-learning, supervised-learning, knn, svm, reinforcement-learning, q-learning, nim, shopping, python, cs50]
lang: en
series:
  name: "Reading Harvard CS50 AI"
  order: 5
additionalSeries:
  - name: "Global AI/CS Course Map"
    order: 5
tldr: "Week 4 enters ML: supervised classification (k-NN, SVM, Perceptron), model evaluation, RL basics (MDP, Q-learning, ε-greedy). Projects: Shopping (purchase prediction with k-NN) and Nim (learning to play via Q-learning)."
description: "Detailed guide to Harvard CS50 AI Week 4 Learning: lecture highlights, video timestamps, supervised classification algorithms, k-NN & SVM implementation, RL MDP & Q-learning convergence, Shopping project (k-NN classification), Nim project (Q-learning), specs and check50 commands. Videos recorded 2020; specs current as of 2026."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-09-24-harvard-cs50ai-w04-learning)

**Video status: Videos included.** [Source details](#course-video-sources)

> ⚠️ **Version note**: This week's lecture videos were **recorded in Spring 2020**; project specs, distribution code, and check50 slugs follow the 2026 OCW site (i.e., `ai50/projects/2024/x/...`).

## Course video sources

The official CS50 YouTube playlist (CS50’s Introduction to Artificial Intelligence with Python, 8 videos) was checked live on 2026-10-10; the Week 4 lecture recording is listed there.

```youtube
url: https://www.youtube.com/watch?v=-g0iJjnO2_w
title: Learning - Lecture 4 - CS50's Introduction to Artificial Intelligence with Python 2020
```

Original videos: [Learning - Lecture 4 - CS50's Introduction to Artificial Intelligence with Python 2020](https://www.youtube.com/watch?v=-g0iJjnO2_w)

Course and recording entries:

- [CS50 AI Week 4 — official video, slides and notes](https://cs50.harvard.edu/ai/weeks/4/)
- [CS50's Introduction to AI with Python — official YouTube playlist (8 videos)](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): The original table diverged from the video in several places. The actual order is nearest neighbor (about minute 9), perceptron (about 14–34), SVM (about 34), loss functions and overfitting (about 44–57), holdout/cross-validation, a scikit-learn demo, reinforcement learning with Q-learning (from about minute 71), then unsupervised learning and k-means (from about minute 99). The original table gave k-NN too much room, left out the closing k-means segment, and listed kernel trick, confusion matrix/F1 and the Bellman equation, none of which appear in the transcript (removed). Nim is a Q-learning example in the video, not a project introduction, and the transcript never mentions the Shopping project; project descriptions come from the course site. The original exact timecodes (the video runs 1:45:49) could not be verified and are now approximate values estimated from the transcript.

## TL;DR

Week 4 enters machine learning: supervised classification (k-NN, SVM, Perceptron, model evaluation), reinforcement learning (MDP, Q-learning, ε-greedy exploration). Two projects implement purchase prediction (k-NN) and learning to play Nim (Q-learning).

## Lecture Video & Timestamps

YouTube: [Week 4 Learning (2020 recording)](https://www.youtube.com/watch?v=-g0iJjnO2_w)

> Timing note: the video runs 1:45:49. YouTube's transcript has no timecodes, so the times below are approximate values estimated from where each topic falls in the transcript (they may be off by several minutes). They are for orientation only, not official chapters. This table describes only the 2020 recording; the current course version may differ in content and order, and the video itself does not introduce this week's projects.

| Approx. time (minutes) | Content |
|---|---|
| ~0–9 | Machine learning and supervised learning: the task, the hypothesis function, datasets |
| ~9–14 | Nearest-neighbor classification |
| ~14–34 | Linear models and the perceptron: weights, threshold functions, the perceptron learning rule, hard/soft thresholds |
| ~34–44 | Support vector machines and the maximum margin separator, plus linear regression |
| ~44–57 | Loss functions (0-1, L1, L2), overfitting and regularization |
| ~57–61 | Holdout and cross-validation |
| ~61–71 | scikit-learn demo: comparing perceptron, SVM and k-NN on a banknote authentication dataset |
| ~71–99 | Reinforcement learning: Markov decision processes, Q-learning, exploration vs. exploitation (epsilon-greedy), the Nim example, function approximation |
| ~99–105 | Unsupervised learning: clustering and k-means, and the wrap-up |

> Full transcript: [Week 4 Notes](https://cs50.harvard.edu/ai/2020/notes/4/)

## Core Concepts Cheat Sheet

### Supervised Classification Algorithm Comparison

| Algorithm | Model Type | Use Case | Pros | Cons |
|---|---|---|---|---|
| **k-NN** | Instance-based, non-parametric | Small data, low-dim, baseline | Simple, no training phase | Slow inference O(n), curse of dimensionality, needs normalization |
| **SVM** | Parametric, max-margin | Medium-high dim, non-linear (kernel) | Good generalization, powerful kernels | Slow training O(n²~n³), sensitive hyperparams |
| **Perceptron** | Linear classifier, online | Linearly separable, streaming data | Simple, online updates | Only linear separable, diverges on noisy data |

### k-NN Key Details

```python
# shopping.py reference core
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
import pandas as pd

def load_data(filename):
    df = pd.read_csv(filename)
    # Feature engineering: month, browser, region one-hot or ordinal
    evidence = df.drop('Revenue', axis=1)
    labels = df['Revenue'].astype(int)
    return evidence, labels

def train_model(evidence, labels):
    # Critical: standardize for distance metric
    scaler = StandardScaler()
    evidence_scaled = scaler.fit_transform(evidence)
    
    # k=1 typically sufficient (per OCW spec), but CV can tune
    model = KNeighborsClassifier(n_neighbors=1)
    model.fit(evidence_scaled, labels)
    return model, scaler

def evaluate(labels, predictions):
    # Compute sensitivity (recall) and specificity
    tp = sum((l == 1 and p == 1) for l, p in zip(labels, predictions))
    tn = sum((l == 0 and p == 0) for l, p in zip(labels, predictions))
    fp = sum((l == 0 and p == 1) for l, p in zip(labels, predictions))
    fn = sum((l == 1 and p == 0) for l, p in zip(labels, predictions))
    
    sensitivity = tp / (tp + fn) if (tp + fn) > 0 else 0
    specificity = tn / (tn + fp) if (tn + fp) > 0 else 0
    return sensitivity, specificity
```

> **Key**: Shopping project requires implementing `load_data`, `train_model`, `evaluate`. `evaluate` must return sensitivity (TPR) and specificity (TNR), not just accuracy.

### SVM Core Concepts

- **Hard margin**: linearly separable data, maximize geometric margin 2/‖w‖
- **Soft margin**: introduce slack variables ξᵢ, allow misclassification, objective min ½‖w‖² + C Σ ξᵢ
- **Kernel trick**: implicit mapping to high-dim space; common kernels: RBF `K(x,y)=exp(-γ‖x-y‖²)`, polynomial, sigmoid

### RL Basics: MDP & Q-learning

**Markov Decision Process (MDP)**:
- State set S, Action set A, Transition prob P(s'|s,a), Reward R(s,a,s'), Discount γ ∈ [0,1]

**Bellman Optimality Equation**:
```
Q*(s,a) = E[R + γ max_{a'} Q*(s',a') | s,a]
```

**Q-learning Update Rule** (off-policy, model-free):
```
Q(s,a) ← Q(s,a) + α [R + γ max_{a'} Q(s',a') - Q(s,a)]
```

- α: learning rate, γ: discount factor
- **ε-greedy**: explore randomly with prob ε, exploit with 1-ε choosing max Q
- Convergence: all state-action pairs visited infinitely often, α decays per Robbins-Monro conditions

---

## Project 4A: Shopping — k-NN Purchase Intent Prediction

### Task

Use `shopping.csv` (numerical features: Administrative, Informational, ProductRelated; categorical: Month, Browser, Region; label: Revenue) to train k-NN classifier predicting visitor purchase.

### Distribution Code Structure

```python
# shopping.py three functions to implement
def load_data(filename):
    """Return (evidence, labels); evidence=list of lists, labels=list of 0/1"""
    ...

def train_model(evidence, labels):
    """Return trained model (must include scaler for consistent prediction scaling)"""
    ...

def evaluate(labels, predictions):
    """Return (sensitivity, specificity)"""
    ...
```

### Complete Reference Implementation

```python
# shopping.py full implementation
import csv
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler

def load_data(filename):
    evidence = []
    labels = []
    
    month_map = {"Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "June": 5,
                 "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11}
    
    with open(filename) as f:
        reader = csv.DictReader(f)
        for row in reader:
            ev = [
                int(row["Administrative"]),
                float(row["Administrative_Duration"]),
                int(row["Informational"]),
                float(row["Informational_Duration"]),
                int(row["ProductRelated"]),
                float(row["ProductRelated_Duration"]),
                float(row["BounceRates"]),
                float(row["ExitRates"]),
                float(row["PageValues"]),
                float(row["SpecialDay"]),
                month_map[row["Month"]],
                int(row["OperatingSystems"]),
                int(row["Browser"]),
                int(row["Region"]),
                int(row["TrafficType"]),
                1 if row["VisitorType"] == "Returning_Visitor" else 0,
                1 if row["Weekend"] == "TRUE" else 0
            ]
            evidence.append(ev)
            labels.append(1 if row["Revenue"] == "TRUE" else 0)
    
    return evidence, labels

def train_model(evidence, labels):
    scaler = StandardScaler()
    evidence_scaled = scaler.fit_transform(evidence)
    
    model = KNeighborsClassifier(n_neighbors=1)
    model.fit(evidence_scaled, labels)
    
    # Return tuple for predict to use same scaler
    return (model, scaler)

def predict(model, scaler, evidence):
    model_obj, scaler_obj = model
    return model_obj.predict(scaler_obj.transform(evidence))

def evaluate(labels, predictions):
    tp = sum((l == 1 and p == 1) for l, p in zip(labels, predictions))
    tn = sum((l == 0 and p == 0) for l, p in zip(labels, predictions))
    fp = sum((l == 0 and p == 1) for l, p in zip(labels, predictions))
    fn = sum((l == 1 and p == 0) for l, p in zip(labels, predictions))
    
    sensitivity = tp / (tp + fn) if (tp + fn) > 0 else 0
    specificity = tn / (tn + fp) if (tn + fp) > 0 else 0
    return sensitivity, specificity
```

### Run & Verify

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/4/shopping.zip
unzip shopping.zip && cd shopping

python shopping.py shopping.csv
# Expected: Correct, Incorrect, True Positive Rate, True Negative Rate

check50 ai50/projects/2024/x/shopping
style50 shopping.py
```

---

## Project 4B: Nim — Q-learning Learns to Play

### Task

Implement Q-learning agent that learns to play Nim: multiple piles of stones, players alternate removing any number from a single pile, player taking last stone wins. Agent learns optimal policy via self-play.

### Game Rules & State Representation

```python
# nim.py core structure
class Nim:
    def __init__(self, piles=[1, 3, 5, 7]):
        self.piles = piles[:]  # list of int
    
    def available_actions(self):
        """Return all legal actions (pile_index, count)"""
        actions = set()
        for i, count in enumerate(self.piles):
            for take in range(1, count + 1):
                actions.add((i, take))
        return actions
    
    def move(self, action):
        """Execute action, return (new_piles, reward, done)"""
        i, take = action
        self.piles[i] -= take
        reward = 1 if all(p == 0 for p in self.piles) else 0
        done = all(p == 0 for p in self.piles)
        return self.piles[:], reward, done
```

### Q-learning Core Implementation

```python
# nim.py reference implementation
import random
from collections import defaultdict

class NimAI:
    def __init__(self, alpha=0.5, epsilon=0.1):
        self.q = defaultdict(float)  # Q-table: (state_tuple, action) -> value
        self.alpha = alpha           # learning rate
        self.epsilon = epsilon       # exploration rate
    
    def get_q(self, state, action):
        return self.q[(tuple(state), action)]
    
    def choose_action(self, state, actions, training=True):
        if training and random.random() < self.epsilon:
            return random.choice(list(actions))
        
        # Greedy: max Q value
        q_values = {a: self.get_q(state, a) for a in actions}
        max_q = max(q_values.values())
        best_actions = [a for a, q in q_values.items() if q == max_q]
        return random.choice(best_actions)
    
    def update(self, state, action, reward, next_state, next_actions):
        """Q-learning update rule"""
        old_q = self.get_q(state, action)
        
        if next_actions:
            max_next_q = max(self.get_q(next_state, a) for a in next_actions)
        else:
            max_next_q = 0  # terminal
        
        # Q(s,a) ← Q(s,a) + α [R + γ max Q(s',a') - Q(s,a)]
        # γ=1 since Nim is finite-horizon
        self.q[(tuple(state), action)] = old_q + self.alpha * (
            reward + max_next_q - old_q
        )

def train(n_episodes=10000):
    ai = NimAI()
    for _ in range(n_episodes):
        game = Nim()
        state = game.piles[:]
        
        while True:
            actions = game.available_actions()
            action = ai.choose_action(state, actions, training=True)
            next_state, reward, done = game.move(action)
            next_actions = game.available_actions() if not done else set()
            
            ai.update(state, action, reward, next_state, next_actions)
            
            state = next_state
            if done:
                break
    return ai
```

### Play & Verify

```python
def play(ai, human_first=False):
    game = Nim()
    state = game.piles[:]
    player = 0 if human_first else 1  # 0=human, 1=AI
    
    while True:
        actions = game.available_actions()
        if player == 0:
            # Human input
            print(f"Piles: {state}")
            pile = int(input("Choose pile: "))
            count = int(input("Choose count: "))
            action = (pile, count)
        else:
            action = ai.choose_action(state, actions, training=False)
            print(f"AI chooses: {action}")
        
        next_state, reward, done = game.move(action)
        state = next_state
        
        if done:
            print(f"{'Human' if player == 0 else 'AI'} wins!")
            break
        player = 1 - player
```

### Run & Verify

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/4/nim.zip
unzip nim.zip && cd nim

python play.py  # play against trained AI
# or run tests directly
python nim.py

check50 ai50/projects/2024/x/nim
style50 nim.py
```

---

## Learning Checklist

- [ ] Can explain why k-NN needs feature standardization (distance metric sensitivity)
- [ ] Can hand-write Q-learning update formula and explain α, γ, ε roles
- [ ] Understand sensitivity vs specificity business meaning difference (Shopping project)
- [ ] Understand why Nim state uses tuple (Q-table keys must be hashable)
- [ ] Understand ε-greedy behavior difference in training vs inference
- [ ] Both projects pass `check50` clean

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official CS50 YouTube playlist was checked live and lists this week’s lecture recording, so the status is now Videos included.
- 2026-10-10: Checked the video content against its transcript. Reordered the video timeline to match the transcript, removed topics not found in it, and made timecodes approximate.

## References

- [Week 4 Learning lecture page](https://cs50.harvard.edu/ai/weeks/4/) — video, slides, transcript, quiz
- [Week 4 Notes (2020 edition)](https://cs50.harvard.edu/ai/2020/notes/4/) — primary source for this post
- [Shopping project spec](https://cs50.harvard.edu/ai/projects/4/shopping/) — Distribution `2023/x`, check50 slug `ai50/projects/2024/x/shopping`
- [Nim project spec](https://cs50.harvard.edu/ai/projects/4/nim/) — Distribution `2023/x`, check50 slug `ai50/projects/2024/x/nim`
- [CS50 AI YouTube playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 documentation](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- On this site: [Harvard CS50 AI Overview](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en) — series entry & version notes
- On this site: [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) — A3 tier definition