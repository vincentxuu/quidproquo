---
title: "Berkeley CS285 L11–18：從變分推論、LLM RL 到 Offline RL"
date: 2026-08-22
category: learning
tags: [cs285, berkeley, variational-inference, llm-rl, offline-rl]
lang: zh-TW
type: guide
difficulty: 深度
tldr: "L11–18 把 control as inference、LLM RL、model-based RL 與 offline RL 接成一條主線，並用 HW4、HW5 呈現兩種高運算成本實作。"
description: "導讀 CS285 Spring 2026 第 11–18 講與 Sections 6–9，說明推論觀點、LLM RL、模型式與離線強化學習。"
series:
  name: "Berkeley CS285 Spring 2026 導讀"
  order: 4
---

> 🌏 [English version](/posts/learning/2026-08-22-berkeley-cs285-inference-offline-rl-en)

[官方課表](https://rail.eecs.berkeley.edu/deeprlcourse/)的 L11–18 依序涵蓋 Variational Inference、VI in RL、Control as Inference、LLM RL、兩講 Model-Based RL 與兩講 Offline RL。看似四個題目，其實都在問：資料、模型與最佳化目標不完整時，agent 能依靠什麼訊號學習？

## L11–14：把控制看成推論

L11–13 先建立 latent-variable 與 variational inference，再把「最優」寫成機率事件。這個觀點把 reward、trajectory distribution 與 entropy 放進同一套語言。Section 6 補推導，Section 7 將 IRL 與 LLM RL 並讀。

L14 的 LLM RL 不是獨立插曲，而是把 policy gradient 用在 token policy 與可驗證 reward。[HW4](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw4.pdf) 實作 REINFORCE 與 GRPO，比較 format-copy 與較難的數學任務。它不是一般筆電作業；H100 與必要 runs 的依據見[作業成本表](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route)。

## L15–16：有 dynamics model 能做什麼

Model-Based RL 先學或使用 dynamics，再規劃 action 或改善 policy。優勢是資料可重用，風險是 model error 會沿 rollout 累積。Section 8 的實用讀法是畫出三條迴路：收資料、學模型、用模型規劃／訓練；每條箭頭標出可能的 distribution shift。

## L17–18：只有固定資料時

Offline RL 不能再向環境收集資料，核心困難是 out-of-distribution action 的 value 可能被高估。Section 9 對應這個問題。[HW5](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw5.pdf) 在 OGBench 任務上實作 SAC+BC、IQL 與 FQL；長時間 run 與調參成本見[作業成本表](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route)。

## 自學縮減版

先讀完投影片與 sections，再分兩階段做：HW4 先完成 format-copy 的最小 run；HW5 先選一個 task、一個 seed、一個 baseline，驗證資料載入與 evaluation。只有在曲線與 checkpoint 都正常後才擴大。自學目標是理解失敗機制，不是複製修課學生獲得的 Modal 額度。

當期課程資產的限制與歷史影片使用方式，統一見[系列總覽的存取邊界](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)。

## 參考資料

- [CS185/285 Spring 2026 官方課站](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [HW4：LLM RL](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw4.pdf)
- [HW5：Offline RL](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw5.pdf)
- [Spring 2026 starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026)
