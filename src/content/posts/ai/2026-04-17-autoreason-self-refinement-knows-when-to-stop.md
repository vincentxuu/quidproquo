---
title: "Autoreason：讓 LLM 自我修正時知道何時該停手"
date: 2026-04-17
type: guide
category: ai
tags: [autoreason, nous-research, self-refinement, llm, borda-count, iterative-reasoning, ai-agent]
lang: zh-TW
tldr: "Autoreason 用競爭式多版本評估（A/B/AB + 盲測 Borda count）取代傳統的「批評→改寫」迴圈，解決 LLM 自我修正中的提示偏差、範疇蔓延和缺乏克制三大問題。"
description: "深入介紹 Nous Research 的 Autoreason 研究——一套讓 LLM iterative self-refinement 能真正收斂的競爭式評估機制，以及它的演算法設計、實驗結果與限制。"
draft: false
---

讓 LLM 反覆修改自己的輸出，直到結果變好——這個想法聽起來直覺，實際上卻很容易崩壞。Autoreason 是 Nous Research 發表的一篇研究，指出傳統 self-refinement 流程有三個結構性缺陷，並提出一套基於「競賽」的替代方案。這篇文章拆解它的機制設計、數據結果和適用邊界。

## 傳統 Self-Refinement 壞在哪

幾乎所有的 iterative self-refinement 都長這樣：生成 → 批評 → 根據批評改寫 → 再批評 → 再改寫……。論文指出這個迴圈有三個結構性問題：

**Prompt Bias（提示偏差）**：當你要求模型「找出這段文字的缺點」，它幾乎一定會找到——即使原文沒什麼問題。模型為了迎合指令，會幻想不存在的缺陷。

**Scope Creep（範疇蔓延）**：每一輪修改都傾向加東西進去。經過幾輪之後，輸出會不受控地膨脹，偏離原本的目標。

**Lack of Restraint（缺乏克制）**：模型幾乎永遠不會回答「不需要修改」。即使當前版本已經足夠好，它仍然會硬改，結果反而退步。

這三個問題的根源是同一個：傳統流程裡，「維持原樣」不是一個合法選項。

## 核心機制：競爭式多版本評估

Autoreason 的解法不是修補 critique-and-revise 迴圈，而是整個換掉。每一輪迭代變成一場淘汰賽：

```
任務提示 → 產生 incumbent（版本 A）
              │
              ├── Critic Agent → 撰寫批評
              ├── Author B → 根據批評產生對抗性修訂（版本 B）
              └── Synthesizer → 融合 A 與 B 的優點（版本 AB）
                        │
                  Judge Panel（3～7 位新評審）
                  盲測 Borda Count 投票
                        │
                  勝出者 → 成為新的 A
                  ↓
                  A 連續勝出兩次 → 終止
```

幾個關鍵設計：

1. **三個候選版本**——A（不變）、B（對抗性修訂）、AB（綜合）。維持原樣永遠是合法的首選。
2. **全新的評審代理**——每一輪的 judge 都是全新生成的，跟產生候選版本的 agent 沒有共享上下文。這避免了自我確認偏差。
3. **盲測 Borda Count**——評審看不到哪個是「原版」，純粹根據品質排序。Borda count 計票法讓排序資訊不會被浪費（跟單純投票「最好的是哪個」不同）。
4. **收斂條件**——當版本 A 連續兩輪勝出，系統判定已收斂，停止迭代。

## 為什麼需要 B 和 AB 同時存在

論文的消融實驗回答了這個問題：拿掉 B 或 AB 任何一個，收斂速度會從 2-3 輪暴增到 24 輪。

B 是「大幅改動」的代表——它根據批評做對抗性修訂，可能翻轉整個方向。AB 是「保守融合」的代表——它試圖保留 A 的優點同時吸收 B 的改進。兩者同時存在才能讓評審在「激進改變」和「漸進改善」之間做選擇，而不是只有「改」或「不改」兩個極端。

## 實驗結果

### 寫作任務

8 個任務（5 個開放式 + 3 個受限式），每個跑 15 輪迭代：

- 其中 3 個任務達到 42/42 的完美評分
- Length-controlled 勝率：21/28 勝過基線
- Haiku 3.5 的輸出長度在 15 輪後縮減了 59-70%——系統不是在膨脹，是在收斂精煉

### 程式碼任務

150 題 CodeContests 競賽程式設計問題，橫跨 4 個模型層級：

| 模型 | Autoreason | 基線 |
|------|-----------|------|
| Sonnet 4.6 | 77% | 73%（single-pass） |
| Haiku 3.5（matched compute） | 40% | 31%（best-of-6） |

在相同算力預算下，Autoreason 勝過「多次抽樣取最好」的暴力策略。

### Judge 數量的影響

- 7 位評審的收斂速度是 3 位的 3 倍
- 更多評審 = 更少輪次 = 更快停下來

## 限制與邊界

論文誠實揭露了幾個重要限制：

**模型能力門檻**：Haiku 4.5（60% 基線準確率）開始出現 held-out gains 消失的現象。當模型的生成能力和評估能力差距縮小到一定程度，tournament 機制的優勢就不明顯了。論文稱之為「generation-evaluation gap closure」。

**弱模型反而退步**：對 Haiku 3.5 用傳統 critique-and-revise，輸出會縮減 59-70%——不是精煉，是崩壞。這正是 Autoreason 要解決的問題，但也說明弱模型的自我評估能力本身就不可靠。

**Sonnet 4.6 的 scaling 瓶頸**：論文嘗試了 8 種方式想讓 Sonnet 4.6 的結果進一步提升，全部失敗。這暗示在強模型上，這套方法可能已經接近天花板。

## Repo 結構

```
paper/                          # LaTeX 論文原始碼與 PDF
tasks/                          # 8 個任務提示
human_eval/                     # 人類盲審評估材料
experiments/v2/
  ├── run_overnight.py          # 寫作任務執行器
  ├── run_code_overnight.py     # CodeContests 執行器
  ├── run_code_haiku45.py       # Haiku 4.5 專用
  ├── run_multi_seed.py         # 15 次重複實驗
  ├── run_ablations.py          # 消融實驗
  ├── compute_stats.py          # Bootstrap CI + McNemar 檢定
  └── results_*/                # 實驗結果資料
```

論文用 TeX 寫（佔 80.8%），實驗程式碼是 Python（19.2%）。統計分析包含 bootstrap confidence interval 和 McNemar 檢定，不是隨便跑幾次就下結論。

## 對 AI Agent 開發的啟示

Autoreason 的設計思路對 agent 開發有幾個值得借鏡的地方：

1. **「不做事」要是合法選項**——任何迴圈式 agent 都該有明確的停止條件，而且「維持現狀」要被視為一個正當選擇，不是失敗。
2. **評估者和執行者要分離**——用同一個 context 又生成又評估，自我確認偏差幾乎不可避免。
3. **多候選 > 單一修訂**——產生多個方向不同的候選再比較，比「改一版看看好不好」更有效率。
4. **收斂比改進重要**——一個會停下來的系統比一個永遠在改的系統更可靠。

## 整體來說

Autoreason 的核心取捨是**用更多算力換取收斂保證**。每一輪要產生 3 個候選 + 3-7 個評審，算力消耗是傳統 self-refine 的好幾倍。但它買到的是：系統知道什麼時候該停、不會越改越差、也不會無限膨脹。

適合的場景是高品質輸出比算力成本重要的任務——寫作、程式碼生成、任何需要「打磨到好」的場景。不適合的場景是即時回應、低延遲需求、或模型本身已經很弱（生成-評估差距不夠大時效果有限）。

論文由 SHL0MS 和 Hermes Agent 共同撰寫，是的，第二作者是一個 AI agent。

## 參考資料

- [Autoreason GitHub](https://github.com/NousResearch/autoreason)
- [Nous Research 官網](https://nousresearch.com/)
- [Borda Count 計票法 — Wikipedia](https://en.wikipedia.org/wiki/Borda_count)
- [CodeContests — 競賽程式設計基準](https://github.com/google-deepmind/code_contests)
- [Hermes Agent — Nous Research 的 AI 代理框架](https://github.com/NousResearch/hermes-agent)
