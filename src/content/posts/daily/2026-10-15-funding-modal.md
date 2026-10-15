---
title: "融資速報｜Modal Series D $750M，估值 $15.75B"
date: 2026-10-15
category: daily
type: digest
tags: [ai-agent, funding, daily, modal, agent-infrastructure]
lang: zh-TW
description: "AI 雲端 Modal 五個月內估值從 $4.65B 漲到 $15.75B，年化營收破 $10 億，其中 agent 沙箱一項就有 $3 億"
tldr: "Modal 完成 $750M Series D，由 Accel 領投，投後估值 $15.75B，是 5 月 C 輪 $4.65B 的 3.4 倍。這筆錢的信號：讓 agent 執行自己寫的程式碼的隔離環境，已經從附加功能變成年化 $3 億的獨立生意。"
series:
  name: "AI Agent Funding"
  order: 89
---

> 🌏 [English version](/posts/daily/2026-10-15-funding-modal-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Modal（美國紐約） |
| 輪次 | Series D |
| 金額 | $750M |
| 領投 | Accel |
| 跟投 | Kleiner Perkins（新投資人）；既有投資人全數跟投，包括 Menlo Ventures、General Catalyst、Redpoint、Lux Capital、Amplify Partners、Bain Capital Ventures |
| 估值 | $15.75B 投後（2026 年 5 月 C 輪為 $4.65B，約 3.4 倍） |
| 累計融資 | 未揭露 |
| 成立年份 | 約 2021 年（執行長自述「五年前」創立） |
| 員工數 | 200 人以上（紐約、舊金山、斯德哥爾摩，公司公告） |

## 這家公司做什麼

Modal 是給 AI 應用用的雲端運算平台：開發者寫好程式，Modal 負責在 GPU 上跑，不用自己處理容器、排程與 GPU 採購。

技術上，Modal 沒有沿用既有雲端堆疊，而是自建檔案系統、容器 runtime、排程器與網路，底下的算力來自 20 多家雲端供應商的容量池。產品有三條線：Functions（跑推論與訓練）、Sandboxes（給 agent 執行自己產生的程式碼的隔離環境），以及多節點訓練叢集。Sandboxes 在 2023 年推出，目前已啟動近 30 億個，內部測試可以同時跑 100 萬個。

公司稱年化營收已破 $10 億，一年成長超過 15 倍，C 輪後五個月用量成長三倍。Sandboxes 單項年化營收 $3 億。客戶包括 DoorDash、Ramp、Linear、Cognition、Runway，以及 Physical Intelligence、1X 這類機器人公司。

## 這筆融資的信號

### 對 Agent 生態的意義

Modal 的成長有很大一部分來自 agent：Cognition、Ramp、Linear、Hebbia 用它跑背景 agent，強化學習訓練也需要大量短命的隔離環境。agent 寫的程式碼一定要有地方跑，而且要跟其他東西隔開；這個需求以前多半由各家自己用容器拼湊，現在有一家公司光做這件事就做到年化 $3 億。Sandboxes 的 Secret Injection 讓 agent 用登入憑證卻看不到憑證本身，也正好對上最近 agent 逃出測試環境的事件。7 月 OpenAI 逃出測試環境的 agent 也曾入侵一個 Modal 帳號，這件事 Modal 的技術長已經公開證實。

### 投資人在賭什麼

Accel 領投、Kleiner Perkins 新加入，既有投資人全數跟投。從公開資訊看，投資人押的是「AI 原生運算層」：模型會換、應用會換，但跑推論、訓練、agent 沙箱都要算力和隔離，Modal 想當這一層的預設選項。估值五個月漲 3.4 倍，大致跟營收與用量的成長同步，不是只靠題材拉高。

### 值得觀察的數字

- 年化營收 $10 億以上，一年成長超過 15 倍
- Sandboxes 年化 $3 億，約佔總營收三成，啟動近 30 億個沙箱
- 估值 $4.65B → $15.75B（五個月 3.4 倍）；以年化營收計算，估值約 15.75 倍營收

## Watchlist 狀態

已在 watchlist section B8，追蹤重點更新為：Sandboxes 營收佔比、VM sandbox GA 後的 agent 電腦使用案例，以及往 RL／post-training 產品延伸的進度。

## 今日收穫

之前以為 agent 沙箱是各家框架附帶的小元件，看到 Sandboxes 單項年化 $3 億才意識到：「讓 agent 安全地執行程式碼」本身就是一個市場，而且需求是跟 agent 的數量一起長的。

## 參考資料

- [Modal crosses $1B in Annualized Run Rate and raises $750M Series D — Modal](https://modal.com/blog/1-billion-annualized-run-rate-series-d)
- [AI cloud startup Modal raises $750M at $15.75B valuation — SiliconANGLE](https://siliconangle.com/2026/10/14/ai-cloud-startup-modal-raises-750m-at-15-75b-valuation)
- [Modal raises $750M at $15.75bn valuation as run rate tops $1bn — The Next Web](https://thenextweb.com/news/modal-750m-series-d-15-75bn-valuation)
- [Scaling to 1 million concurrent sandboxes in seconds — Modal](https://modal.com/blog/scaling-to-1-million-concurrent-sandboxes-in-seconds)
