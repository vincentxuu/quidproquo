---
title: "融資速報｜Tutor Intelligence Series B $75M（機器人工人按工時計費，a16z 領投）"
date: 2026-11-04
category: daily
type: digest
tags: [ai-agent, funding, daily, tutor-intelligence, industrial-ai]
lang: zh-TW
description: "MIT CSAIL 衍生的機器人部署公司 Tutor Intelligence 完成 $75M Series B，由 Andreessen Horowitz 領投，把機器人工人當「按工時計費」的勞力賣給工廠與物流商"
tldr: "Tutor Intelligence 完成 $75M Series B，由 Andreessen Horowitz 領投，累計融資達 $117M。這筆錢的信號：physical AI 正在把軟體 Agent「靠真實使用訊號持續進步」的訓練路徑，複製到機器人硬體上。"
series:
  name: "AI Agent Funding"
  order: 122
---

> 🌏 [English version](/posts/daily/2026-11-04-funding-tutor-intelligence-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Tutor Intelligence（美國，麻薩諸塞州 Watertown） |
| 輪次 | Series B |
| 金額 | $75M |
| 領投 | Andreessen Horowitz（a16z） |
| 跟投 | Union Square Ventures, Neo |
| 估值 | 未揭露 |
| 累計融資 | $117M |
| 成立年份 | 2021（出自 MIT CSAIL） |
| 員工數 | ~19–31 人（第三方估計） |

## 這家公司做什麼

Tutor Intelligence 是一家把機器人工人「按工時計費」賣給工廠與物流商的機器人部署公司——客戶不用買機器人，只付使用費，就像租一個勞工。

核心產品是機器人工人 Sonny 與 Cassie，由遠端「tutor」人類操作員在旁協助，負責工廠與倉儲裡的搬運、移動、揀貨等工作。Tutor 的技術邏輯是倒過來的：先把機器人部署到真實產線賺工時費，再用每一次任務產生的真實世界操作數據回頭訓練 frontier 機器人基礎模型，讓機器人跟著部署規模一起變聰明——這是軟體 LLM 靠網路文字訓練的路徑，物理世界從來沒有對應的「維基百科」可以訓練，Tutor 等於自己造一個。

目前機器人運作的設施數量比一年前成長近 4 倍，過去 12 個月內收到機器人的客戶有近三分之一回購擴充部署，目標是 2027 年底前在美國本土製造並部署超過 1,000 台機器人，服務對象包括大型製造與物流網路，處理早餐穀片、零食、糖果、化妝品、家用品、玩具等日常商品。

## 這筆融資的信號

### 對 Agent 生態的意義

「AI Agent」的敘事正從純軟體延伸到實體勞動現場：Tutor 把部署本身當成資料收集管道，每一次機器人完成任務都產生前所未見的真實世界操作資料，用來持續訓練 frontier 模型，形成「部署 → 真實資料 → 更強模型 → 更多部署」的飛輪。這筆 $75M 主要用於 frontier 機器人基礎模型訓練，以及 Sonny / Cassie 機器人的製造與部署擴張，而不是去補研發的坑。

```diagram
title: Tutor Intelligence 的部署飛輪
desc: 機器人工人部署到產線工作，產生真實世界操作資料，用來訓練機器人基礎模型，模型變強後機器人能接更多工作，擴大部署規模，下一圈從更強的模型開始。
caption: 簡化示意：實際流程中資料仍需經過篩選與標註才能用於訓練。
step: 機器人工人部署到工廠、倉儲產線工作
step: 搬運、揀貨等任務產生真實世界操作資料，寫入機器人基礎模型
step: 用累積的真實資料訓練、改善 frontier 機器人基礎模型
step: 模型變強，機器人能接更多種工作，擴大部署規模，下一圈從更強的模型開始
---
<svg viewBox="0 0 440 392">
  <path class="dg-line" d="M280 56.3A152 152 0 0 1 368.8 165.1" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M369.4 224A152 152 0 0 1 282.7 334.4" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M160 335.7A152 152 0 0 1 71.2 226.9" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M70.6 168A152 152 0 0 1 157.3 57.6" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line dg-line--dashed" d="M312 196H276" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--dashed" d="M220 224V316" marker-end="url(#arrow)" data-step="3"/>

  <g data-step="1 4">
    <rect class="dg-box" x="160" y="16" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="35" text-anchor="middle" dominant-baseline="central">部署機器人</text>
    <text class="dg-sub" x="220" y="55" text-anchor="middle" dominant-baseline="central">Sonny / Cassie 上工</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="312" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="372" y="187" text-anchor="middle" dominant-baseline="central">真實操作資料</text>
    <text class="dg-sub" x="372" y="207" text-anchor="middle" dominant-baseline="central">搬運・揀貨</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="160" y="320" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="339" text-anchor="middle" dominant-baseline="central">訓練模型</text>
    <text class="dg-sub" x="220" y="359" text-anchor="middle" dominant-baseline="central">frontier 機器人模型</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="8" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="68" y="187" text-anchor="middle" dominant-baseline="central">機器人更強</text>
    <text class="dg-sub" x="68" y="207" text-anchor="middle" dominant-baseline="central">能接更多工作</text>
  </g>

  <rect class="dg-box dg-box--store" x="168" y="168" width="104" height="56" rx="6"/>
  <text class="dg-label" x="220" y="187" text-anchor="middle" dominant-baseline="central">基礎模型</text>
  <text class="dg-sub" x="220" y="207" text-anchor="middle" dominant-baseline="central">每圈都更強</text>

  <text class="dg-edge" x="292" y="182" text-anchor="middle" dominant-baseline="central" data-step="2">寫入</text>
  <text class="dg-edge" x="230" y="270" text-anchor="start" dominant-baseline="central" data-step="3">訓練</text>
</svg>
```

### 投資人在賭什麼

領投的 a16z 合夥人 Raghu Raghuram（前 VMware CEO）的論點很直接：機器人研究長期被「先把模型做對、再談部署」卡住，Tutor 反過來做——先讓真實世界的部署需求決定研究方向，再往回推分銷、硬體跟研究順序。這跟軟體 Agent 這幾年驗證過的訓練路徑一致：靠真實使用訊號持續進步，而不是純靠合成或模擬資料。對 a16z 而言，這是把已經在軟體 Agent 上驗證過的「真實世界回饋迴圈」複製到機器人硬體的延伸押注。

### 值得觀察的數字

- 累計融資 $117M，種子輪（Neo 領投）跟 Series A（Union Square Ventures 領投）的既有投資人全部回頭加碼本輪，顯示內部人持續看多
- 機器人運作設施數量年成長近 4 倍，且過去 12 個月收到機器人的客戶中近三分之一回購擴充——不只是鋪新客，既有客戶也在加碼
- 本輪規模在美國深科技（deep tech）Series B 交易裡位居前 10%（抽樣 2,808 筆交易），反映資本對 physical AI 賽道的集中度持續提高

## Watchlist 狀態

Tutor Intelligence 尚未在 watchlist 中。建議加入 section D9（工業 / 製造 / 供應鏈），但需註記：現有 D9 名單（Trimble、Plataine、Eyelit、Infor）都是工廠排程 / 資產管理軟體，Tutor 是少見的「機器人硬體 + 持續學習模型」組合，追蹤重點是按工時計費的機器人部署與真實世界資料回訓 frontier 模型，跟現有名單屬性不同，未來若同類公司變多可考慮獨立拆出 physical AI 子類。

## 今日收穫

軟體 Agent 那套「靠真實使用訊號持續進步」的敘事，現在被 a16z 原封不動搬到機器人身上：Tutor 不是把模型練到完美才部署，而是故意把順序顛倒——先部署賺工時費，再拿真實操作數據回訓模型，把 physical AI 的訓練瓶頸直接轉換成商業模式本身的一部分。

## 參考資料

- [Tutor Intelligence raises $75 million to scale robot workforce](https://roboticsandautomationnews.com/2026/11/03/tutor-intelligence-raises-75-million-to-scale-robot-workforce/106645)
- [Tutor Intelligence raises $75M Series B from a16z for robot workforce](https://dealroom.co/news/168993-tutor-intelligence-raises-75m-series-b-from-a16z-for-robot-workforce)
- [Josh Gruenstein：Tutor Intelligence $75M Series B 公告](https://www.linkedin.com/posts/josh-gruenstein-aa6a8413a_tutor-intelligence-has-raised-a-75m-series-activity-7523052790802366465-N-a6)
