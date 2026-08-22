---
title: "Berkeley CS188 Spring 2026：用 P0–P5 六個 Projects 學人工智慧"
date: 2026-08-22
category: learning
tags: [berkeley, cs188, artificial-intelligence, pacman, open-course]
lang: zh-TW
type: guide
difficulty: 進階
series:
  name: "Berkeley CS188 Spring 2026"
  order: 1
tldr: "CS188 Spring 2026 公開 28 組錄影、27 組講義、11 組討論與 P0–P5 六個 projects；P0 是 Python／autograder tutorial，P1–P4 採 Pacman 情境，P5 是一般機器學習任務。"
description: "Berkeley CS188 Spring 2026 完整自學總覽：公開資源、先修需求、P0–P5 六個 projects、學習順序與校外讀者的權限邊界。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-berkeley-cs188-sp26-overview-en)

[Berkeley CS188 Spring 2026](https://inst.eecs.berkeley.edu/~cs188/sp26/) 是一門廣義人工智慧入門課。它不是只教神經網路：前半從狀態空間、heuristic、constraint satisfaction 與 game trees 開始，中段進入 MDP、強化學習與機率推論，後段才接機器學習、深度學習與 LLM。官方課表公開 28 組 recordings、27 組 lecture slides（Lecture 22 沒有獨立 slides）、11 組 discussion，以及 P0–P5 六個 projects。

這套材料的價值在於「概念會回到程式」。P0 是 Python 與 autograder tutorial；P1–P4 用 Pacman 情境練搜尋、多代理、RL 與機率推論；P5 則是 regression、分類、CNN 與 attention 等一般 ML tasks。這也是本系列不逐講切成 28 篇，而以 P0–P5 為主脊的原因。

## 公開到什麼程度

依本站 A0–A3 標準，這一版是 A3：官方首頁直接連到 slides、YouTube、[線上教材](https://inst.eecs.berkeley.edu/~cs188/textbook/)、discussion worksheet／解答，以及[P0–P5 六個 projects](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/)的規格與檔案。project 內附 local autograder，校外讀者可在自己的電腦形成「寫程式—跑測試—修正」迴圈。

缺少的則是 Berkeley 的課堂服務：Ed、正式提交、教師回饋與完整評分體驗。本系列不依賴也不承諾 auditor Gradescope 能登入；即使官方其他頁面提過 entry code，沒有實測就不把它寫成可執行步驟。

## 開始前要會什麼

[官方 prerequisites](https://inst.eecs.berkeley.edu/~cs188/sp26/policies/) 是 CS61A 或 CS61B，加上 CS70 或 Math 55。若要完整跟上 project，仍建議同時具備 Python、資料結構與離散數學背景；校外自學可用三個檢查代替課號：能讀 Python class 與 recursion、知道 stack／queue／priority queue 的差別、能處理條件機率與期望值。

若 Python 或終端機不熟，先做 optional 的 [Project 0](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj0/)；它就是環境與 autograder 教學。若 P0 很順，不必為了形式停留。

## 七篇怎麼走

1. **搜尋與 heuristic**：Lecture 1–4，接 P0／P1。
2. **CSP 與多代理搜尋**：Lecture 5–8，接 P2。
3. **MDP 與強化學習**：Lecture 9–12，接 P3。
4. **Bayes nets 與 Ghostbusters**：Lecture 13–18，接 P4。
5. **決策與機器學習**：Lecture 19–25，接 P5。
6. **應用、安全與結業路線**：Lecture 26–28，回頭整合所有 project。

每一階段先讀教材章節，再看 lecture，接著做 discussion worksheet；對完官方 discussion solution 後才開 project。project 卡住時先縮到單一 autograder case，不要搜尋完整解答。這套課真正要練的是把模型轉成程式，不是把 Pacman 跑起來就算完成。

## 今晚的起步動作

先打開 P0，確認 Python 環境與 local autograder 能執行；接著讀教材的 state-space search 章節，在紙上寫出 DFS、BFS、UCS 的 frontier 規則。若還有時間，只閱讀 P1 的檔案分工與 Q1，不急著一次寫完整份。

## 參考資料

- [Berkeley CS188 Spring 2026](https://inst.eecs.berkeley.edu/~cs188/sp26/)
- [CS188 online textbook](https://inst.eecs.berkeley.edu/~cs188/textbook/)
- [CS188 Spring 2026 projects](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/)
- [CS188 Spring 2026 policies](https://inst.eecs.berkeley.edu/~cs188/sp26/policies/)
