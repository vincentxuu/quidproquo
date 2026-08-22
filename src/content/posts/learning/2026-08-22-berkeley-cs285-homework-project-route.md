---
title: "Berkeley CS285 作業與期末專案：CPU、GPU、H100 成本分界"
date: 2026-08-22
category: learning
tags: [cs285, berkeley, deep-reinforcement-learning, gpu, self-study]
lang: zh-TW
type: guide
difficulty: 深度
tldr: "五份作業從 CPU 友善的 imitation learning 走到 H100 LLM RL 與六小時 offline RL runs；自學者應按成本分三階段，而非整套照搬。"
description: "逐項整理 Berkeley CS285 Spring 2026 五份作業、starter code、GPU 成本、缺少資產與兩條期末專案路線。"
series:
  name: "Berkeley CS285 Spring 2026 導讀"
  order: 6
---

> 🌏 [English version](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route-en)

[Spring 2026 starter repository](https://github.com/berkeleydeeprlcourse/homework_spring2026) 公開 HW1–5 與兩個預設 final project 的 code，採 MIT License。這讓自學真正可執行；完整的公開／限修課資產分界見[系列總覽](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)。本篇只負責作業算力與專案取捨。

## 五份作業的成本表

| 作業 | 實作焦點 | 官方運算訊號 | 自學建議 |
| --- | --- | --- | --- |
| [HW1](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw1.pdf) | MSE、DAgger、flow matching imitation | README 表示本機 CPU 測試較快 | CPU 完整做 |
| [HW2](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw2.pdf) | policy gradient、reward-to-go、baseline | 每個 run 幾秒至約十分鐘 | CPU 完整做，補多 seed |
| [HW3](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw3.pdf) | DQN、SAC | MsPacman／HalfCheetah 即使用 GPU 也可能約三小時 | 本機做小環境，昂貴環境選做 |
| [HW4](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw4.pdf) | REINFORCE、GRPO、LLM reward | Modal wrapper 預設 H100；四個必要 runs | 先縮小 format-copy，另立雲端預算 |
| [HW5](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw5.pdf) | SAC+BC、IQL、FQL、OGBench | 單次最長約六小時，調參成本累積 | 先一任務一 seed，再決定擴張 |

這些時間是官方教材對其環境的估計，不是跨硬體保證；雲端價格也會變動，所以本文不寫固定金額。啟動付費資源前，先查供應商當日價格與停止條件。

## 三階段自學法

第一階段完整做 HW1、HW2，建立 logging、evaluation 與多 seed 習慣。第二階段做 HW3 的便宜環境，確認 DQN、SAC 真的能學；昂貴環境只選一個。第三階段才在 HW4、HW5 各選一個縮減實驗，事先設定時數或金額上限。

每份作業都保留環境版本、seed、command、wall-clock time、硬體與失敗 run。若只保存最好結果，就失去 RL 最重要的 reproducibility 訓練。

## 期末專案怎麼選

官方公開 [final project outline](https://rail.eecs.berkeley.edu/deeprlcourse/static/misc/final_project_outline.pdf)，並提供 Offline-to-Online RL 與 LLM RL 兩個預設方向。前者延伸 offline dataset 到有限 online interaction；後者包含偏好資料、reward model 與 policy optimization。LLM RL 專案文件提到課程內 Modal 總額度與 H200 選項，那是修課情境，不是對外保證。

自學者可把專案縮成可重現的研究 memo：一個 baseline、一個改動、三個 seed、一張主要圖、一段 limitation。若沒有 GPU，就選 offline-to-online 的小型模擬環境；不要為了追求「完整」直接承擔 LLM 訓練成本。

## 交付邊界

能做到的是公開作業的自我驗證版本，不是聲稱完成 Berkeley 學分課。影片、討論、評分與課程支援的完整清單統一維護在[系列總覽](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)。

## 參考資料

- [Spring 2026 starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026)
- [CS185/285 Spring 2026 syllabus](https://rail.eecs.berkeley.edu/deeprlcourse/syllabus/)
- [HW1](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw1.pdf)
- [HW2](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw2.pdf)
- [HW3](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw3.pdf)
- [HW4](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw4.pdf)
- [HW5](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw5.pdf)
- [Final project outline](https://rail.eecs.berkeley.edu/deeprlcourse/static/misc/final_project_outline.pdf)
