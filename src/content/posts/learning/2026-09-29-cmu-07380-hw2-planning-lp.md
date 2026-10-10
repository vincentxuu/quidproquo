---
title: "CMU 07-380 HW2 導讀：Classical and Motion Planning，從 robot-cook PDDL 到 RRT* 再到 LP 圖解"
date: 2026-09-29
category: learning
tags: [cmu, 07-380, ai-course, course-guide, planning, rrt, linear-programming]
lang: zh-TW
type: guide
difficulty: 進階
series:
  name: "CMU 07-380 完整課程導讀"
  order: 6
tldr: "07-380 HW2 分三塊：程式作業先寫煎餅機器人的 PDDL，交給 unified-planning＋Fast Downward 求最優計畫，再在 rrt.py 實作 RRT 與 RRT*（Q2–Q7）；書面作業考 GraphPlan、一題 LP 建模與兩題 LP 圖解；另有只限校內的 Gradescope 線上題。本文只講題目結構、需要的概念與本機 autograder 怎麼跑，不附解答。"
description: "CMU 07-380 Fall 2026 HW2 導讀：planning 程式作業（robot-cook PDDL、unified-planning、Fast Downward、rrt.py Q2–Q7、amongUs、robotCook）與 hw2 書面四題（GraphPlan、Bayes the Bat LP、Graphing LPs、Feasible Regions）的結構、配分與前置概念，依 2026-09-29 課站材料整理，不附解答。"
draft: false
---

> 🌏 [English version](/en/posts/learning/2026-09-29-cmu-07380-hw2-planning-lp-en)

這是 [CMU 07-380 AI & ML II](https://www.cs.cmu.edu/~07380/) Fall 2026 的 **HW2**，課站截止日是 9/18（五）11:59 pm，已經過期。它把前兩講收在一起：[Lecture 3](/posts/learning/2026-09-29-cmu-07380-lecture-03-classical-planning) 的 PDDL 與 GraphPlan、[Lecture 4](/posts/learning/2026-09-29-cmu-07380-lecture-04-motion-planning-rrt) 的 RRT 與 RRT\*。書面作業還多考了 Lecture 5 的線性規劃。

作業頁開頭用一首短詩總結它的兩層結構：先把煎餅的計畫排好，再讓一棵隨機樹繞著煎鍋長出來。「先做哪些動作」是 classical planning，「手臂怎麼移過去不撞到東西」是 motion planning。

**本文不附解答**。課程有 academic integrity 規定，程式作業頁也寫明會比對提交之間的邏輯相似度。這裡只講每題在考什麼、需要哪個概念、怎麼在本機驗證。

依 [2026-09-29 課站](https://www.cs.cmu.edu/~07380/#assignments)狀態整理；課站註明 schedule 可能變動。

## 課程影片來源

本篇依官方講義、投影片或作業導讀；本次檢查官方公開頁面，尚未核實本文對應講次的公開錄影。這不表示課程沒有錄影。

課程與錄影入口：

- [cmu-07-380 — official course materials and recording index](https://www.cs.cmu.edu/~07380/)

## 官方材料與讀取範圍

| 部分 | 材料 | 公開程度 |
|---|---|---|
| 程式作業 | [Classical and Motion Planning 作業頁](https://www.cs.cmu.edu/~07380/assignments/planning/)、[`planning.zip`](https://www.cs.cmu.edu/~07380/assignments/planning/planning.zip) | 公開，含本機 autograder |
| 書面作業 | [`hw2_blank.pdf`](https://www.cs.cmu.edu/~07380/assignments/hw2_blank.pdf)、[`hw2.zip`](https://www.cs.cmu.edu/~07380/assignments/hw2.zip)（LaTeX 範本） | 公開 |
| 線上題 | Gradescope | 只限校內 |
| 解答 | — | 課站沒有公開 |

`hw2.zip` 裡有 `hw2.tex`、四題各自的 `.tex`、協作聲明 `q_collaboration.tex`，以及 `figures/` 下的 `graphplan.png`、`feasible_regions.png` 和畫圖用的 `plot_graph.py`。

**公開程度**：程式與書面都能在校外完整重做，只少了線上題和官方解答，這份作業達 A3。全課仍是 A2（進行中），分級見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)。

## 程式作業：Robot Cook 與 RRT

### 環境與檔案

作業頁要求 Python 3.12，先裝 `numpy pillow`，Q1 另外需要 [unified-planning](https://unified-planning.readthedocs.io/) 和 [Fast Downward](https://www.fast-downward.org/)：

```bash
python3.12 -m pip install numpy pillow
python3.12 -m pip install "unified-planning[fast-downward]"
python3.12 plan.py blocksworld_domain.pddl blocksworld_3blocks.pddl
```

最後一行用預讀筆記的 Blocks world 檔測試安裝，應該印出六步計畫。作業頁說 Fast Downward 用的是 optimal configuration。

要交的只有四個檔：`robot-cook_domain.pddl`、`robot-cook_cook1.pddl`、`robot-cook_cook2.pddl` 和 `rrt.py`。值得先讀的是 `configuration_space.py`（`sample`、`isLegal`、`allLegal`、`getVector`、`distance` 五個介面）、`rrtUtil.py`（測試用的小世界與手建的樹）、`plan.py`，以及兩個遊戲 `robotCook.py`、`amongUs.py`。

### 各題在考什麼

| 題 | 配分 | 要做的事 | 對應概念 |
|---|---:|---|---|
| Q1 | 8 | 從零寫 robot-cook 的 PDDL domain 與兩個 problem | STRIPS、CWA、domain／problem 分工 |
| Q2 | 5 | `getValidSegmentPath`、`computePathCost` | 整段碰撞檢查、路徑成本 |
| Q3 | 5 | `RRTNode.findNearest` | 最近鄰（遞迴走整棵樹） |
| Q4 | 10 | `growRRT`：一次 RRT 迭代 | 取樣、steer、`max_edge` |
| Q5 | 7 | `findAllNear`、`addConfigToBestParent` | RRT\* 的 best parent |
| Q6 | 7 | `rewire` | RRT\* 的重接鄰居 |
| Q7 | 8 | `growRRTStar` | 把 Q5、Q6 組回 RRT 迴圈 |

合計 50 分。

**Q1 的設計**。手臂一次拿一種工具（ladle 或 flipper），每個煎餅經過 ordered → 倒上鍋（raw）→ 翻面 → 在鍋鏟上 → 上盤。六個動作名稱固定：`switch`、`fill`、`pour`、`flip`、`lift`、`serve`，作業頁的表格寫了每個動作的「允許條件」和「之後的狀態」。predicates、參數和物件名稱都由你設計。只能用 `:strips`。cook1 點一個煎餅；cook2 點兩個，目標是第一片在盤子上、第二片疊在上面。

autograder 的檢查分兩層。第一層用同一個 optimal planner 解你的檔案，比對計畫的動作名稱序列（不看參數）；作業頁列出了 cook1 的預期序列，也說明 cook2 的最優計畫是 12 步、兩種順序都算對。第二層逐條檢查規則：某些短序列必須做不到（例如拿空的 ladle 倒麵糊），某些必須做得到。作業頁的除錯提示很實用：計畫比預期短，通常是漏了前置條件或效果給太多；比預期長或無解，通常是漏了效果、多了前置條件、`:init` 不完整，或 goal 要求太多。這正是 [Lecture 3](/posts/learning/2026-09-29-cmu-07380-lecture-03-classical-planning) 講的 `:init` 要完整、`:goal` 要部分。

**Q2–Q7 的設計**。configuration 是長度 K 的 NumPy 陣列，`rrt.py` 不應該在意 K 是多少：船員是 (x, y)，兩節手臂是 (θ<sub>1</sub>, θ<sub>2</sub>)，`robotCook.py --links 4` 會給你四維。作業頁區分兩個容易混淆的限制：`step_limits` 限制每個動作在每一維能走多遠，`max_edge` 是 RRT 加一條邊的最長長度，一條邊通常包含好幾個動作。這跟 [Lecture 4](/posts/learning/2026-09-29-cmu-07380-lecture-04-motion-planning-rrt) 投影片「路徑要切成動作」那一頁對應。

Q7 有一個刻意的簡化：`rrt()` 一碰到目標就停，RRT\* 也一樣。作業頁說明，完整的 RRT\* 可以繼續取樣、重接，路徑會繼續變短，這才是 asymptotic optimality 的來源；作業選擇在第一個目標就停，讓兩種 planner 都能快速回傳。

### 作業頁 FAQ 裡最容易踩的坑

這些是官方 FAQ 的提醒，不是解答：

- Q2：線段被擋住時回傳 `None`，不是空 list；只在插值出來的 configuration 上檢查合法性
- Q4：每次呼叫 `growRRT` 只能呼叫 `config_space.sample()` 一次，因為測試給定樣本、隨機世界有固定 seed，多抽一次整棵樹就不同
- Q4：方向要用 `config_space.getVector(q_nearest, q_rand)`，不要直接相減
- Q5–Q7：半徑內的鄰居不一定包含最近節點，`growRRTStar` 要自己把它加進去
- Q6：重接要用 `neighbor.updateParent`，它會維護整棵子樹的 children 與快取成本

### 本機驗證

```bash
python3.12 autograder.py          # 全部
python3.12 autograder.py -q q4    # 單題
python3.12 autograder.py -t test_cases/q2/04_segmentBlocked   # 單一測試
```

做完 Q4 就可以去玩：`amongUs.py` 的船員會自己規劃路線去找其他船員；`robotCook.py` 按 `p` 規劃到目前目標、按 `a` 讓機器人自己做菜、按 `s` 在 RRT 與 RRT\* 間切換。

## 書面作業：GraphPlan 加三題 LP

| 題 | 配分 | 內容 | 需要的概念 |
|---|---:|---|---|
| 1 Planning | 10 | 六個 operator、起點 A、目標 C ∧ D ∧ E：畫 GraphPlan 圖到終止、回報計畫、判斷是否最優、列出 A<sub>0</sub> 的互斥 operator 與 S<sub>1</sub> 的互斥 predicate | GraphPlan、no-op、mutex |
| 2 Bayes the Bat's Day | 8 | 課程吉祥物 Bayes the Bat 分配派對與寫作業的時間：寫成 inequality form 的 LP、用程式畫圖、求最優解 | LP 建模、圖解法 |
| 3 Graphing LPs | 6 | 給兩組 A、b，畫出每條限制線與單位長度的法向量 | inequality form 的幾何意義 |
| 4 Feasible Regions | 9 | 看圖上的三條限制線與可行域，反推三組 A、b | 半平面與不等式方向 |

最後還有一段協作聲明，要回答收到誰的幫助、幫了誰、有沒有看到現成程式碼。

幾個格式要求要先知道：

- 用提供的 LaTeX 範本作答，不能改答案框大小和位置，交 PDF 到 Gradescope
- 第 1 題的圖可以在 PDF 上標註，或直接編輯 `figures/graphplan.png`，手繪也可以，但要清楚；題目提醒 no-op 也算動作
- 第 2、3 題**不能手畫**，要用 matplotlib 之類的工具，軸要有標籤和刻度、`plt.axis("equal")`、向量長度為 1。第 2 題還指定 x<sub>1</sub> 軸範圍 [−2, 10]、x<sub>2</sub> 軸 [−4, 8]
- `figures/plot_graph.py` 是 starter，要自己改 `plot_graph()` 並補完 `compute_unit_length()`
- 第 2 題特別警告要嚴格照「lecture 定義的 inequality form」，包括不等號方向

**閱讀順序建議**：第 1 題只需要 Lecture 3–4 前半的 GraphPlan。第 2–4 題需要 Lecture 5 的 LP，本系列排在下一篇，建議先讀 [Lecture 5 導讀](/posts/learning/2026-09-29-cmu-07380-lecture-05-linear-programming)再回來做。

## 延伸對照

- GraphPlan 的 mutex 詞彙、Crane 題，以及 h<sub>max</sub>／h<sub>add</sub> 都在 [Recitation 2 解答](https://www.cs.cmu.edu/~07380/recitations/Recitation2_07380_f26_sol.pdf)裡，做書面第 1 題之前可以先練。
- RRT 的手算版本在同一份 Recitation 2 §6，做 Q3、Q4 之前先算一遍，比直接 debug 程式快。
- 作業頁要你參考 Project 0 的 autograder 教學，附帶的 `autograder.py`、`testClasses.py`、`grading.py` 等檔名也跟 Pacman 系列專案一致。這個系譜見 [Pacman AI 專案系譜](/posts/learning/2026-08-22-pacman-ai-project-lineage)。

## 今晚可以做的動作

1. 下載 `planning.zip`，裝好 unified-planning 後跑 Blocks world，確認印出六步計畫。
2. 先別寫程式，照作業頁的六個動作表格，在紙上列出你要的 predicates，再檢查「空 ladle 不能倒」「拿 ladle 不能翻面」這兩條規則會不會被你的前置條件擋住。
3. 用作業頁給的 `buildTree` 範例把 Q3、Q5、Q6 用的測試樹畫出來，手算一次最近節點。
4. 做第 3 題之前，先在紙上寫出「法向量 (a<sub>i,1</sub>, a<sub>i,2</sub>) 指向不等式哪一側」，再用程式畫圖驗證。

## 系列導覽

- 上一篇：[Lecture 4 導讀：Motion Planning，RRT 在連續空間用取樣找路](/posts/learning/2026-09-29-cmu-07380-lecture-04-motion-planning-rrt)
- 下一篇：[Lecture 5 導讀：Linear Programming](/posts/learning/2026-09-29-cmu-07380-lecture-05-linear-programming)
- 系列總覽：[CMU 07-380 Fall 2026 總覽](/posts/learning/2026-08-22-cmu-07380-fall-2026-overview)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CMU 07-380 AI & ML II Fall 2026 課站（Assignments）](https://www.cs.cmu.edu/~07380/#assignments)
- [07-380 程式作業：Classical and Motion Planning](https://www.cs.cmu.edu/~07380/assignments/planning/)
- [07-380 Homework 2 書面題目（hw2_blank.pdf）](https://www.cs.cmu.edu/~07380/assignments/hw2_blank.pdf)
- [07-380 Homework 2 LaTeX 範本（hw2.zip）](https://www.cs.cmu.edu/~07380/assignments/hw2.zip)
- [07-380 Recitation 2 Solutions](https://www.cs.cmu.edu/~07380/recitations/Recitation2_07380_f26_sol.pdf)
- [unified-planning 文件](https://unified-planning.readthedocs.io/)
- [Fast Downward](https://www.fast-downward.org/)
