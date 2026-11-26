---
title: "融資速報｜Genesis AI Series A $500M"
date: 2026-11-23
category: daily
type: digest
tags: [ai-agent, funding, daily, genesis-ai, physical-ai]
lang: zh-TW
description: "機器人新創 Genesis AI 完成 $500M Series A，估值達 $3.5B，由 Khosla Ventures、Premji Invest、Eclipse 共同領投，用感測手套蒐集真人動作資料訓練能跨機器人形態遷移的 AI 大腦 GENE"
tldr: "Genesis AI 完成 $500M Series A，估值達 $3.5B，由 Khosla Ventures、Premji Invest 與 Eclipse 共同領投。這筆錢代表 VC 開始把「能跨機器人形態遷移的 AI 大腦」當成下一個基礎模型級別的戰場。"
series:
  name: "AI Agent Funding"
  order: 151
---

> :globe: [English version](/posts/daily/2026-11-23-funding-genesis-ai-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Genesis AI（美國舊金山灣區 San Carlos／法國巴黎雙基地） |
| 輪次 | Series A |
| 金額 | $500M |
| 領投 | Premji Invest、Khosla Ventures、Eclipse（三方共同領投） |
| 跟投 | Durable Capital Partners, T. Rowe Price Associates（代操帳戶）, Bpifrance, HSG, NVIDIA, AMD Ventures, Zoom, Samsung Next, Ericsson，及個人投資人 Eric Schmidt、Eric Yuan、Jerry Yang、Xavier Niel、Zach Kirkhorn |
| 估值 | $3.5B（本輪為公開首輪 Series A，無前一輪估值可比較） |
| 累計融資 | 未揭露先前輪次金額（本輪 $500M 為目前已公開的唯一一輪） |
| 成立年份 | 2024 |
| 員工數 | 未揭露（文章提到全球有 100+ 位佩戴感測手套蒐集資料的「operator」，未說明是否計入正式員工） |

## 這家公司做什麼

Genesis AI 是一家做「通用機器人大腦」的機器人公司——目標不是做出最像人的機器人，而是打造一套能跨不同機器人硬體形態遷移的 AI 模型，讓機器人具備人類等級的靈巧操作能力。

核心產品分四塊：機器人本體 Eno（刻意不走擬人外型，優先考慮量產與部署）；AI foundation model GENE，公司稱之為業界最先進的「機器人大腦」；一套貼近人手結構的靈巧手搭配資料手套，讓一般工作者戴著手套做日常工作、把動作資料餵給機器人學習；以及模擬平台 Genesis World，讓機器人技能先在虛擬環境訓練測試再上真實場域。

目前部署聚焦工業場景（製造、物流、實驗室），計畫接下來擴展到旅館與醫療，最後才是消費端與戶外應用；客戶數與營收未揭露。與 Figure、Agility 等人形機器人公司相比，Genesis AI 的差異化在於資料蒐集方法——高度依賴力覺訊號，由戴著感測手套與頭戴攝影機的真人工作者錄下日常動作。

```flow-diagram
{
  "title": "Genesis AI 從人類動作到機器人部署的訓練管線",
  "lang": "zh-TW",
  "width": 520,
  "height": 600,
  "nodes": [
    {"id": "operator", "label": "操作員戴感測手套示範", "x": 260, "y": 50, "w": 280, "shape": "actor"},
    {"id": "data", "label": "力覺／動作訓練資料", "x": 260, "y": 180, "w": 260, "shape": "db"},
    {"id": "gene", "label": "AI 大腦 GENE 訓練", "x": 260, "y": 310, "w": 260, "shape": "chip"},
    {"id": "sim", "label": "Genesis World 模擬測試", "x": 260, "y": 440, "w": 280},
    {"id": "eno", "label": "Eno 機器人部署真實場域", "x": 260, "y": 560, "w": 300, "tone": "accent"}
  ],
  "edges": [
    {"from": "operator", "to": "data", "step": 1},
    {"from": "data", "to": "gene", "step": 2},
    {"from": "gene", "to": "sim", "step": 3},
    {"from": "sim", "to": "eno", "step": 4}
  ],
  "steps": [
    "真人操作員戴上感測手套與頭戴攝影機，示範工廠、物流、實驗室等場域的日常任務，蒐集力覺與動作資料",
    "蒐集到的動作資料用來訓練 AI 大腦 GENE，這套 foundation model 是公司核心的機器人智慧",
    "機器人技能先在模擬平台 Genesis World 裡反覆測試與驗證，確認可靠後才進入真實場域",
    "驗證過的技能部署到 Eno 機器人身上，在工廠、物流、實驗室等場域實際執行任務"
  ]
}
```

## 這筆融資的信號

### 對 Agent 生態的意義

$500M Series A 直接把估值推上 $3.5B，是目前「物理 AI／機器人大腦」賽道規模最大的單輪 A 輪之一。資金將用於擴大資料蒐集與大規模訓練、量產部署 Eno、以及招募 AI 研究員與機器人工程師。這代表資本開始把「能跨機器人形態遷移的通用大腦」當成下一個基礎模型級別的戰場，而不只是把錢砸在某一種機器人外型上。

### 投資人在賭什麼

領投三方中，Khosla Ventures、Premji Invest 和 Eclipse 之外，NVIDIA、AMD Ventures、三星、愛立信這類晶片與通訊大廠也跟投，說明硬體巨頭想在機器人 AI 的基礎設施層卡位；Eric Schmidt、Jerry Yang、Zach Kirkhorn 等矽谷老將以個人身份加入，顯示上一代科技高層普遍把「物理 AI」視為下一波平台轉移，而不只是機器人硬體的漸進式升級。

### 值得觀察的數字

本輪 $500M 佔 $3.5B 估值約 14%，稀釋比例偏高，反映投資人願意用較大股權換取卡位；對照同樣聚焦物理世界 AI 的 General Intuition（9 月，估值 $6.2B）與 SiMa.ai（9 月，$1.45B），Genesis AI 成立僅兩年就衝上同類公司中數一數二的估值。

## Watchlist 狀態

Genesis AI 尚未在 watchlist 中。連同同一天報導的 Humyn Labs，以及 9 月已報導的 General Intuition，現在已累積三家聚焦「物理 AI／機器人大腦與資料」的新創密集融資，建議評估在 watchlist 新增一個獨立分類（暫定「物理 AI / 機器人」），而不是繼續逐篇個案建議。

## 今日收穫

Genesis AI 的手套蒐集資料邏輯，本質上跟 LLM 用文字語料做 pretraining 是同一套方式——只是語料從文字變成了人類動作軌跡；誰能最快、最便宜地把「人類怎麼做事」轉成結構化訓練資料，誰就握有機器人 AI 這個世代的資料護城河，而不是誰的機器人長得最像人。

## 參考資料

- [Genesis AI Raises $500M Series A at $3.5B Valuation to Master Human-Level Dexterity in General-Purpose Robots and Deploy at Scale](https://prnewswire.com/news-releases/genesis-ai-raises-500m-series-a-at-3-5b-valuation-to-master-human-level-dexterity-in-general-purpose-robots-and-deploy-at-scale-302941249.html)
- [Genesis AI Lands $500 Million Series A to Scale Glove-Wearing Robots](https://techtoday.techotd.in/news/5201/AI-and-Machine-Learning/Robotics/November-22-2026/Genesis-AI-Lands-500-Million-Series-A-to-Scale-Glove-Wearing-Robots)
