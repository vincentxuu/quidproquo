---
title: "Harvard CS181 HW1: Ice Core Regression — Linear, Kernel, and Neural Nets in One Assignment"
date: 2026-08-27
category: tech
tags: [harvard, cs181, regression, linear-regression, kernel-regression, neural-networks, ice-core, python, machine-learning]
lang: en
series:
  name: "Harvard CS181 Weekly Guides"
  order: 2
type: guide
tldr: "HW1 uses an 800k‑year ice‑core temperature dataset to implement three regression models (OLS, RBF kernel, MLP) and compare them on the same data, laying the groundwork for later classification and deep‑learning assignments."
description: "Weekly guide for Harvard CS181 HW1 (due 2026‑02‑23). Includes data loading, OLS, kernel regression, a simple MLP, a 90‑minute self‑test, and links to the next weeks."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-27-harvard-cs181-hw1-regression)

> ⚠️ **Edition**: Primary source is the [CS181 2026 HW1 repository](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw1). 2025/2024/2023 versions are identical in data and questions, differing only in due dates and grading percentages.

## TL;DR

HW1 works on an **800 k‑year ice‑core temperature** dataset (`earth_temperature_sampled_train.csv` / `*_test.csv`) and asks you to implement **three regression paths**:
1. **Ordinary Least Squares (OLS)** – closed‑form solution `w = (XᵀX)⁻¹Xᵀy`
2. **Radial‑Basis‑Function (RBF) Kernel Regression** – kernel matrix `K(i,j) = exp(-γ‖xᵢ‑xⱼ‖²)` with regularisation `λ`
3. **Simple Feed‑forward Neural Net (MLP)** – two‑layer ReLU network trained with Adam

After completing all three you will have **three curves** on the same plot, showing how model complexity affects predictions – the perfect bridge to **HW2 Classification** and **HW3 Neural Networks**.

## Why HW1 deserves its own guide

- **Scale jump** – unlike HW0's two points, HW1 uses a **massive 800 k‑row CSV**; matrix inversions, kernel memory, and minibatch training become real concerns.
- **Model progression** – CS181 deliberately stages **linear → kernel → neural net** on the *same* loss (MSE). Comparing them directly is the most efficient way to see the benefits of non‑linearity and learn the math behind attention (kernel → transformer).
- **Grading weight** – HW1 counts for **11%** of the final grade, split into **code, report, and visualisation**. Any weak spot in one path can drag the whole assignment down, so a focused guide saves time.

## Data snapshot & acquisition

> The ice‑core data lives in `data/earth_temperature_sampled_{train,test}.csv` (each row `year, temperature`).
>
> - `train` contains **≈ 5.5 k** samples (1950‑2000) after down‑sampling; `test` contains another **≈ 5.5 k** unseen points.
> - File size **≈ 1.2 MB**. Download directly with:
>   ```bash
>   wget https://raw.githubusercontent.com/harvard-ml-courses/cs181-s26-homeworks/main/hw1/data/earth_temperature_sampled_train.csv
>   wget https://raw.githubusercontent.com/harvard-ml-courses/cs181-s26-homeworks/main/hw1/data/earth_temperature_sampled_test.csv
>   ```
> - Origin: **Jouzel et al. 2007** ice‑core temperature reconstruction (public dataset).

## Assignment breakdown (three sub‑questions)

### 1️⃣ OLS Linear Regression
- Build design matrix `X = [[1, year], …]` (intercept + year).
- Solve **closed‑form** `w = (XᵀX)⁻¹ Xᵀ y`.
- Compute **MSE** and **RMSE**, plot **prediction vs. truth**.
- Provide helper functions `ols_fit`, `ols_predict`, and a minimal `hw1_ols.py` script for submission.

### 2️⃣ RBF Kernel Regression
- Define kernel `K(i,j) = exp(-γ * (year_i - year_j)²)`.
- Solve **kernel ridge** `α = (K + λI)⁻¹ y` (regularisation λ).
- Tune `γ` via log‑space (`logspace(-4, 2, 7)`) and optionally report the best `γ` based on validation MSE.
- Visualise the **kernel regression curve** together with OLS.

### 3️⃣ Simple MLP (feed‑forward NN)
- Architecture: `Input → Linear(1, hidden) → ReLU → Linear(hidden, 1)` (suggest hidden=64).
- Optimiser: **Adam** (`lr=1e‑3`). Train for **30 epochs** (early‑stop on test MSE).
- Log **training loss** and **test loss**, plot both.
- Save final model `hw1_mlp.pt` and generate a one‑page PDF summarising **hyper‑parameters**, **final MSE**, and **visual comparison**.

## 90‑minute self‑test (pre‑HW1 warm‑up)

1. **Load data** – `pandas.read_csv`, check `df.head()` and `df.describe()` match the repo description.
2. **OLS** – hand‑code the matrix solution, verify the coefficients and MSE, plot residuals (should look random).
3. **Kernel** – start with `γ=0.01`, `λ=1e‑3`, plot the kernel curve; if it’s too smooth, reduce `γ`.
4. **NN** – quick PyTorch/Keras script for **5 epochs**; if loss plateaus, try **normalising `year`** (`(year‑mean)/std`).
5. **Compare** – overlay the three predictions on one figure, write a short note: *which model gives the lowest test MSE?* and *which feels most intuitive?*.

> **Tip**: `seaborn.set_style('whitegrid')` makes the plots nicer for the PDF report.

## How HW1 connects to later weeks

- **HW2 Classification** will reuse the **feature scaling** you performed for `year` and the **MSE → accuracy** mindset from HW1.
- **HW3 Neural Networks** expands the MLP to deeper architectures (CNN, RNN). You already have the **training loop** and **Adam** foundation.
- **HW4 Transformers** treats **attention** as a *learnable kernel*; the RBF kernel you built is the mathematical predecessor.

## References

- [CS181 2026 HW1 (GitHub)](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw1)
- [CS181 2025 HW1 (GitHub)](https://github.com/harvard-ml-courses/cs181-s25-homeworks/tree/main/hw1) (same data, different due date)
- [Jouzel et al. 2007 Ice‑core temperature reconstruction (Nature)](https://doi.org/10.1038/nature05969)
- [CS181 textbook – Chapter 5: Linear Regression & Kernel Methods](https://github.com/harvard-ml-courses/cs181-textbook#chapter-5)
- [MML Book – Chapter 4: Kernel Methods](https://mml-book.github.io/)
- [PyTorch Docs – torch.nn.Linear, torch.optim.Adam](https://pytorch.org/docs/stable/nn.html)
- [NumPy Linear Algebra – np.linalg.inv](https://numpy.org/doc/stable/reference/generated/numpy.linalg.inv.html)
