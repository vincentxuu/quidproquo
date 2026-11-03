---
title: "模型卡｜Google DeepMind Genie 4"
date: 2026-11-03
category: daily
type: digest
tags: [ai-agent, model-release, daily, google, model-family-genie]
lang: zh-TW
description: "Google DeepMind 發布 Genie 4——首個原生生成音效與互動對話的即時世界模型，Gemini 3.8 Flash 在迴圈中當「導演」拆解多步驟場景，目前僅開放信任測試者，無公開定價與 API ID"
tldr: "Genie 4：2026-10-27 發布，即時互動世界模型（非文字 LLM），首次原生生成環境音、音樂與可互動對話，人物動作與反應是本代最大進步；Gemini 3.8 Flash 在迴圈中擔任「導演」，把任務拆成多步驟並即時核對進度。目前僅開放信任測試者，Project Genie／Gemini API 早期夥伴尚未開放，無公開定價、無 API model ID、無官方 benchmark 分數；物件恆常性與文字清晰度仍是已知弱點。"
series:
  name: "AI Model Tracker"
  order: 67
glossary:
  - term: "Genie"
    def: "Google DeepMind 的世界模型（world model）系列，從文字或影像生成可即時互動、可操控視角的動態環境，目標是為機器人與 AI agent 提供安全的訓練場景"
  - term: "世界模型（world model）"
    def: "逐格生成使用者可實際操作、而非固定播放的影片的 AI 系統，鍵盤輸入與文字提示會改變接下來發生的事"
---

> 🌏 [English version](/posts/daily/2026-11-03-model-google-genie-4-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | 未公開（官方未發佈 API 代號） |
| 廠商 | Google DeepMind |
| 參數量 | 未公開 |
| Context Window | 不適用（即時互動世界模型，非文字生成模型，官方未揭露底層架構細節） |
| Input 定價 (USD/1M tokens) | 未公開（無 API、無公開計價） |
| Output 定價 (USD/1M tokens) | 未公開（無 API、無公開計價） |
| 開源 | 否（research preview，無開放權重） |
| 發布日 | 2026-10-27 |
| 官方公告 | [Google DeepMind Blog](https://deepmind.google/blog/genie-4-a-new-generation-of-world-simulation/)、[Google Blog](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/introducing-genie-4/) |
| 家族 | Genie（Genie 1 → 2 → 3 → 4） |

## 能力亮點

- 系列首次原生生成音效：環境音、音樂與可互動對話與畫面同步生成，不需另外的語音/音效模型
- 人物是本代最大進步：角色能自然移動、對環境做出反應，並可在場景進行中被即時引導
- Gemini 3.8 Flash 在迴圈中擔任「導演」：把使用者目標拆成多步驟，持續檢視畫面確認每一步是否完成，場景變化或使用者介入時即時調整計畫
- 與 Gemini 4 Argon、Gemini Robotics 整合做機器人情境生成，官方示範為 Apptronik Apollo 人形機器人下西洋棋的任務拆解

Gemini 3.8 Flash 在生成迴圈裡扮演的「導演」角色，具體是一個拆步驟、核對畫面、必要時重新規劃的迴圈：

```diagram
title: Gemini-in-the-loop：世界模型的步驟拆解與核對迴圈
desc: Gemini 3.8 Flash 把使用者目標拆成多步驟並驅動 Genie 4 渲染，每一步都靠檢視畫面核對是否達成，沒達成或場景改變就調整計畫重新渲染，全部步驟完成才算任務完成
caption: 依 Google DeepMind 與 DataCamp 對 Genie 4「Multi-step events planned by Gemini」機制的描述簡化繪製，實際迴圈細節未公開。
step: Gemini 3.8 Flash 拆解步驟，驅動 Genie 4 渲染畫面與音訊
step: Gemini 持續檢視畫面，核對這一步是否達成
step: 沒達成或場景改變、使用者介入，就調整計畫、回到 Genie 4 重新渲染
step: 達成就檢查還有沒有下一步驟
step: 還有步驟就回到拆解；所有步驟都完成才算任務完成
---
<svg viewBox="0 0 640 460">
  <path class="dg-line" d="M288 34V60" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M288 116V148" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M288 204V236" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--warn" d="M384 280H440" marker-end="url(#arrow-warn)" data-step="3"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M524 252V184Q524 176 516 176H392" marker-end="url(#arrow-warn)" data-step="3"/>
  <path class="dg-line" d="M288 324V368" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--dashed" d="M192 412H72Q64 412 64 404V96Q64 88 72 88H184" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line dg-line--accent" d="M384 412H440" marker-end="url(#arrow-accent)" data-step="5"/>

  <circle class="dg-dot" cx="288" cy="28" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="184" y="60" width="208" height="56" rx="6"/>
    <text class="dg-label" x="288" y="78" text-anchor="middle" dominant-baseline="central">Gemini 3.8 Flash</text>
    <text class="dg-sub" x="288" y="100" text-anchor="middle" dominant-baseline="central">拆解多步驟計畫</text>
  </g>

  <g data-step="1">
    <rect class="dg-box" x="184" y="148" width="208" height="56" rx="6"/>
    <text class="dg-label" x="288" y="166" text-anchor="middle" dominant-baseline="central">Genie 4 即時渲染</text>
    <text class="dg-sub" x="288" y="188" text-anchor="middle" dominant-baseline="central">畫面＋音訊同步生成</text>
  </g>

  <g data-step="2">
    <path class="dg-box" d="M288 236L384 280L288 324L192 280Z"/>
    <text class="dg-label" x="288" y="270" text-anchor="middle" dominant-baseline="central">步驟達成？</text>
    <text class="dg-sub" x="288" y="292" text-anchor="middle" dominant-baseline="central">核對畫面進度</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--warn" x="440" y="252" width="168" height="56" rx="6"/>
    <text class="dg-label" x="524" y="270" text-anchor="middle" dominant-baseline="central">調整計畫</text>
    <text class="dg-sub" x="524" y="292" text-anchor="middle" dominant-baseline="central">場景變化／使用者介入</text>
  </g>

  <g data-step="4">
    <path class="dg-box" d="M288 368L384 412L288 456L192 412Z"/>
    <text class="dg-label" x="288" y="402" text-anchor="middle" dominant-baseline="central">還有下一步驟？</text>
    <text class="dg-sub" x="288" y="424" text-anchor="middle" dominant-baseline="central">多步驟任務</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="440" y="384" width="168" height="56" rx="6"/>
    <text class="dg-label" x="524" y="402" text-anchor="middle" dominant-baseline="central">任務完成</text>
    <text class="dg-sub" x="524" y="424" text-anchor="middle" dominant-baseline="central">回到下一個提示</text>
  </g>

  <text class="dg-edge dg-text--warn" x="412" y="268" text-anchor="middle" dominant-baseline="central" data-step="3">否</text>
  <text class="dg-edge dg-text--warn" x="534" y="216" text-anchor="start" dominant-baseline="central" data-step="3">重新渲染</text>
  <text class="dg-edge" x="300" y="346" text-anchor="start" dominant-baseline="central" data-step="4">是</text>
  <text class="dg-edge" x="128" y="80" text-anchor="middle" dominant-baseline="central" data-step="5">有下一步驟</text>
  <text class="dg-edge dg-text--accent" x="412" y="400" text-anchor="middle" dominant-baseline="central" data-step="5">無（完成）</text>
</svg>
```

## Benchmark 表現

⚠️ 官方公告未附任何 benchmark 分數或與其他世界模型的量化比較，截至 2026-10-28 也未見第三方獨立評測或分數重現（來源：DataCamp 對 Genie 4 的整理）。以下改列可驗證的能力/限制差異，不是量化基準：

| 項目 | Genie 3（2025-08 發布） | Genie 4（2026-10-27 發布） |
|---|---|---|
| 音訊 | 無原生音訊 | 首次原生生成環境音、音樂、互動對話 |
| 畫面規格 | 24 fps、720p，一致性可維持數分鐘 | 官方未公布 fps／解析度數字 |
| 多步驟推理 | 無模型內建推理迴圈 | Gemini 3.8 Flash 在迴圈中拆解步驟並驗證進度 |
| 開放對象 | 限量學術與創作者測試 | 信任測試者優先，Project Genie／Gemini API 夥伴「即將開放」 |
| 已知弱點 | 動作空間有限、多 agent 互動、真實地點精確度、文字清晰度、互動時長限於數分鐘 | 長時間互動後物件恆常性與視覺細節仍會漂移、複雜物理互動、即時音訊準確度、文字清晰度、空間精確度 |

## 與前代/競品比較

跟 Genie 3 比，Genie 4 最大的質變是「人會動、會說話」——Genie 3 的示範主要是環境與生態系（水、光影、動植物），人物互動不是訴求重點；Genie 4 官方直接點名「最戲劇性的進步是人」，角色可以自然反應並被即時引導對話，這是前三代都沒做到的。另一個差異是推理層：Genie 4 把 Gemini 3.8 Flash 接進生成迴圈，讓世界模型第一次有「導演」在旁邊核對任務是否照步驟完成，而不是純粹靠像素生成碰運氣維持連貫性。

目前沒有其他實驗室發布同等的「即時互動＋原生音訊」世界模型可供直接比較，官方公告與第三方報導（DataCamp、dev.to）都明確指出 Genie 4 尚無公開 benchmark、定價或 API model ID，OpenRouter 與 models.dev 截至 2026-10-28 也都未收錄。換句話說，Genie 4 目前仍是研究預覽而非可直接評估優劣的產品，任何「比前代強多少」的結論都只能停在官方釋出的 demo 等級，而官方自己也提醒 demo 是精選結果、應視為能力上限而非平均表現。

## 對 Agent 開發的意義

Genie 4 把「世界模型」從單純的場景生成，往「帶推理迴圈的訓練環境」推進了一步——Gemini 3.8 Flash 在迴圈中拆解任務、驗證進度的做法，等於是把 agent 常用的 plan-and-verify 模式搬進了世界模型本身，不用額外寫 orchestrator 去檢查模擬進度。

- 如果你在做機器人或具身 agent 訓練：Genie 4＋Gemini Robotics 的組合值得追——它示範了怎麼把人形機器人任務（如下棋）拆成多步驟場景，在真的上硬體前先用想像環境跑過一輪，但官方沒有量化「模擬裡學到的行為」轉移到實體機器人的成功率，這塊還不能直接拿來做決策依據
- 如果你在做 agent 評測或沙盒環境：Genie 系列一直被定位成「給 agent 練習的安全環境」（Genie 3 曾接 SIMA agent 測試），Genie 4 的多步驟一致性如果穩定下來，可能可以取代部分手刻模擬環境，但目前僅信任測試者可用，一般開發者只能排 Project Genie／Gemini API 候補
- 不適合：任何需要長時間穩定運行的場景（物件恆常性會隨時間漂移）、需要精確還原真實地點的應用、或需要清晰文字渲染的場景——這些官方都明講是現在進行式的研究問題，不是「快修好了」的小 bug

## 今日收穫

之前預設「世界模型」跟「對話模型」是兩條平行的技術線，各自補各自的能力缺口。Genie 4 把 Gemini 3.8 Flash 直接接進生成迴圈當「導演」，說明這兩條線已經開始合流：世界模型負責畫面與音訊的即時生成，語言模型負責在背後规劃敘事與驗證進度，分工比想像中更早出現，也呼應官方自己講的「hybrid world model」下一步方向。

## 參考資料

- [Genie 4: A new generation of world simulation（Google DeepMind 官方公告）](https://deepmind.google/blog/genie-4-a-new-generation-of-world-simulation/)
- [We're announcing Genie 4（Google Blog 官方公告）](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/introducing-genie-4/)
- [Genie 3: A new frontier for world models（前代官方公告，規格與限制對照來源）](https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models)
- [Genie 4 World Model: Features, Capabilities, and How to Get Access（DataCamp，無 benchmark／定價／API ID 的獨立確認）](https://www.datacamp.com/blog/genie-4)
- [Genie 4 vs Genie 3: What Changed in Google's Interactive World Models?（dev.to，第三方能力落差分析）](https://dev.to/jamilxt/genie-4-vs-genie-3-what-changed-in-googles-interactive-world-models-53m5)
