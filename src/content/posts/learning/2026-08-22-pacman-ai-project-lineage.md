---
title: "Pacman AI project 血統：Berkeley CS188 與 CMU 15-281 怎麼重組同一套教材"
date: 2026-08-22
category: learning
tags: [berkeley, cmu, artificial-intelligence, pacman, course-guide]
lang: zh-TW
type: deep-dive
tldr: "CMU 15-281 的 Search and Games 明確標示源自 Berkeley Pacman AI projects；官方課站另列一份零分 P0 tutorial，以及 P1–P5 五份 programming assignments。"
description: "只依兩校官方 assignment 規格，比較 Pacman AI project 的明確來源、檔案結構、題目切分與自學路線。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-pacman-ai-project-lineage-en)

Berkeley CS188 與 CMU 15-281 都讓 Pacman 在迷宮裡搜尋、躲鬼、吃豆子，但「兩校剛好用了相似遊戲」不是最精確的說法。CMU 的 [Search and Games assignment](https://www.cs.cmu.edu/~15281/assignments/programming/search_and_games/)直接寫明，這份作業以 UC Berkeley 開發的 Pacman AI projects 為基礎。血統是官方明載的；至於 CMU 為什麼這樣改、哪位教師決定合併，公開規格沒有回答，本文不推測。

本文比較的是 2026 年可匿名讀取的兩份課程結構：Berkeley CS188 Spring 2026 的六個 projects，以及 CMU 15-281 Spring 2026 的 programming assignment 序列。

## Berkeley：用 Pacman 把不同 AI 單元拆成獨立專案

[Berkeley CS188 Spring 2026](https://inst.eecs.berkeley.edu/~cs188/sp26/)列出 P0–P5。P0 是 Python 與 autograder 教學；之後依課程單元切開：

| Project | 官方主題 | 主要環境 |
|---|---|---|
| [P0](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj0/) | Python tutorial | 基礎函式與 local autograder |
| [P1](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj1/) | Search | Pacman 迷宮、搜尋問題與 heuristic |
| [P2](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj2/) | Multi-Agent Search | Pacman、鬼、minimax／alpha-beta／expectimax |
| [P3](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj3/) | Reinforcement Learning | Gridworld、Crawler 與 Pacman |
| [P4](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj4/) | Ghostbusters | Bayes net 與粒子過濾追蹤 |
| [P5](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj5/) | Machine Learning | 神經網路模型 |

這種拆法讓每個 project 緊跟一組 lecture 主題。每份規格提供可下載程式碼、指定要改的檔案、命令列測試方式與 local autograder。校外讀者拿不到 Ed、正式成績或人工協助，仍能執行核心練習。

## CMU：把搜尋與多代理人合成第一份主作業

CMU 的 Search and Games 不只是換 logo。它在同一個壓縮檔與 autograder 裡，先要求 iterative deepening、A*、Corners／Food heuristic，再轉進 reflex agent、minimax 與 expectimax。規格指定修改 `search.py`、`searchAgents.py` 與 `multiAgents.py`，並公開 test cases 與 local autograder。

最明顯的結構差異是合併：Berkeley 把 Search 與 Multi-Agent Search 放在 P1、P2；CMU 把兩塊放進同一份 Search and Games。CMU 題目也不是 Berkeley 當期題目的逐字鏡像，例如 CMU 搜尋部分以 iterative deepening 與 A* 起步，而 Berkeley P1 的當期題序包含 DFS、BFS、UCS 與 A*。能確認的是共同框架與明載來源，不能因此宣稱兩份作業完全相同。

## 同一套框架，評量邊界各自成立

兩校都保留 Pacman 的幾個核心設計：

- `GameState` 表示遊戲狀態，agent 透過合法動作產生後繼狀態。
- 搜尋題把演算法與 maze problem 分開，讓同一演算法能換不同問題。
- multi-agent 題用 Pacman 當 max agent、ghost 當其他 agent。
- local autograder 檢查函式介面、展開節點或產生後繼狀態的行為。

但 autograder 是各課程版本的一部分。CMU 規格甚至提醒某些標準 alpha-beta 寫法會因呼叫 `generateSuccessor` 次數不同而不符合該版 grader。這不是演算法理論改變，而是「正確實作」與「符合指定評測介面」同時存在。

自學時最實際的做法，是只用你正在讀的那一版 starter 與 grader。不要混用 Berkeley 與 CMU 的 starter、grader 或已完成檔案，也不要拿不同學期的 node-count 閾值互相判分。

## 課程位置不同，Pacman 承擔的責任也不同

在 Berkeley，Pacman 貫穿搜尋、多代理人、強化學習與機率推理等單元。在 [CMU 15-281 Spring 2026](https://www.cs.cmu.edu/~15281/)中，Search and Games 是 P1；後續依序為 P2 Optimization、P3 Planning、P4 Reinforcement Learning、P5 Ghostbusters。兩校都用 Pacman，但 project 邊界與後續作業序列不同。

2026 年還多一層制度背景：[07-280 FAQ](https://www.cs.cmu.edu/~07280/#faq)說明 15-281 與 10-315 將退休，[BSAI curriculum](https://www.cs.cmu.edu/bs-in-artificial-intelligence/curriculum)則把 07-280／07-380 列入現行 AI core。這不會抹去作業來源，也不表示 Berkeley CS188 同步改制；它只改變 CMU 這份 Pacman archive 在今天的角色——從現行主幹作業變成仍可執行的歷史教材。

## 怎麼選一份開始

想按單元逐步走完整廣義 AI 路線，直接採 Berkeley Spring 2026，從 P0 跑通環境，再依 P1–P5 前進。想比較題目如何被另一校重組，先完成 Berkeley P1、P2 的一小題，再打開 CMU Search and Games 對照函式介面與題序。

今晚的最小動作：下載其中一版 starter，執行該版 `python3 autograder.py`，確認環境能啟動；接著只做第一個未通過的 test。先固定版本，比先找「最佳答案」重要。

## 參考資料

- [Berkeley CS188 Spring 2026](https://inst.eecs.berkeley.edu/~cs188/sp26/)
- [Berkeley CS188 Project 1: Search](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj1/)
- [Berkeley CS188 Project 2: Multi-Agent Search](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj2/)
- [CMU 15-281 Spring 2026](https://www.cs.cmu.edu/~15281/)
- [CMU 15-281 Search and Games](https://www.cs.cmu.edu/~15281/assignments/programming/search_and_games/)
- [CMU 07-280 FAQ](https://www.cs.cmu.edu/~07280/#faq)
- [CMU BSAI Curriculum](https://www.cs.cmu.edu/bs-in-artificial-intelligence/curriculum)
