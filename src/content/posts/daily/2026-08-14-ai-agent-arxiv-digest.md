---
title: "AI Agent Arxiv Digest — 2026-08-14"
date: 2026-08-14
category: daily
tags: [ai-agent, arxiv, daily, agent-harness, agent-evaluation, agent-safety]
lang: zh-TW
description: "今天三篇都指向同一件事——模型之外的 harness 才是決定 Agent 品質的工程面：指令遵從度被高估、安全邊界可以從軌跡自動學、驗證器分解讓自我改進便宜 5 倍"
tldr: "Harness-IF 揭示 Coding Agent 的指令遵從度被高估 3.6-7.4 個百分點，因為模型本來就會做的事被算成了遵從；SHE 把 harness 拆成四個安全元件並從軌跡失敗自動演化，ASR 降低 3.1 倍且正確率提升；SBCO 用分解式驗證器銀行搭配文本梯度做 harness 自我改進，在規劃任務上以 4-5.5 倍更少的算力追平 Gödel Machine"
series:
  name: "AI Agent Arxiv Digest"
  order: 82
---

## 今日總覽

今天三篇論文都指向同一個正在成形的認知：Agent 的效能瓶頸不在模型，而在 harness——包住模型的那層工程膠水（system prompt、規則、工具策略、驗證迴圈）。Harness-IF 從評測端揭穿一個數字幻覺：現有指令遵從率被高估了，因為模型「本來就會做的事」被算成了遵從。SHE 從安全端把 harness 拆成四塊獨立元件，讓安全邊界能從失敗軌跡自動演化。SBCO 則從效能端證明，只要把驗證器和修復策略結構化，harness 的自我改進可以比遞迴式自我修改便宜 5 倍。三篇合起來說的是同一件事：**harness 是可以被量測、可以被拆解、可以被自動優化的獨立工程面**。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| Agent Harness（鷹架） | 包住 LLM 的所有工程元件——system prompt、工具定義、記憶管理、權限控制、執行迴圈。模型是引擎，harness 是車身 |
| ASR（攻擊成功率） | 對抗攻擊讓 Agent 做出不安全行為的比例；越低越好 |
| Against-Prior Accuracy | Harness-IF 提出的新指標：只計算「模型預設不會做、加了規則才做」的那些指令的遵從率，排除巧合 |
| 文本梯度（TextGrad） | 用自然語言批評代替數值梯度，讓 LLM 的 prompt 和策略能被「微分」優化 |
| 驗證器銀行（Verifier Bank） | SBCO 學出的一組 per-constraint 檢查器，每個只負責檢查一條約束是否被滿足 |

---

## 論文一｜Harness-IF：你的 Coding Agent 真的在聽指令嗎？

### Harness-IF: Evaluating Instruction Following Across Instruction Surfaces in Coding Agents
Zining Huang, Haoran Que, Hong Zeng et al.　·　arxiv: 2608.11727

連結: [arxiv](https://arxiv.org/abs/2608.11727) · [alphaxiv](https://www.alphaxiv.org/abs/2608.11727)

### TL;DR

Coding Agent 的指令遵從率被系統性高估——模型「本來就會做的事」佔了 3.6-7.4 個百分點的虛假遵從，而且指令放在不同位置（system prompt vs. tool description）優先級並不遵循 prompt 深度。

### Read Priority

必讀 — 如果你在部署 Coding Agent 並依賴指令遵從率做決策，這篇直接影響你的評估方法論。

### 領域背景

現有的指令遵從評測把所有規則塞在 user turn，而 Coding Agent 的規則分散在五個位置（system prompt、project files、user turn、tool descriptions、skill descriptions）。當模型剛好「本來就會做那件事」時，遵從率就是虛高的。之前沒有方法區分「真的在聽」和「碰巧做對」。

### 中階導讀

- **問題**：想像你叫同事「寫完記得存檔」，他存了——但他本來每次都會存。你以為他在聽你的話，其實這條指令對他的行為毫無影響。Harness-IF 要抓的就是這個差距。
- **方法**：建了一個 642 條規則庫，從中抽 256 條放在五個指令位置上，用 60 個多輪 coding 任務打分。核心是 Against-Prior Accuracy：把每條規則拿掉後重跑，看模型預設行為是否就會做同一件事。只有預設不會做、加了規則才做的那些指令，才計入 AP-Acc。
- **為什麼重要**：Agent 平台需要知道哪些指令位置最有效、哪些規則真的在改變行為。盲目堆規則而不知道哪些被「真的遵從」會導致虛假的安全感。

### 深入要點

- 12 個前沿模型的遵從率 72.1-85.9%，但 AP-Acc 只有 66.1-78.6%
- 每個模型的虛高幅度不同（3.6-7.4 個百分點），意味著模型排名可能被改變
- 指令優先級不遵循 prompt 深度：system prompt、project files、user instructions 優先於 tool 和 skill descriptions ⚠️（作者自測，9 個 build 的 pilot）
- 落地門檻：需要為每條規則建「拿掉後重跑」的 probe build，成本不低
- 與 Claude Code 的 CLAUDE.md 架構直接相關：project files 的優先級高於 tool descriptions
- Limitation：642 條規則庫目前限於 coding 場景，是否推廣到其他 agent 類型未驗證

### Reviewer 一句話評

方法論紮實，AP-Acc 是一個巧妙的因果推斷式設計。但 probe build 的成本（每條規則需要 9 次重跑）可能限制了實際採用。

### 給你的 take-away

- 如果你在評估 Coding Agent 的指令遵從：直接採用 AP-Acc 的概念——至少抽樣幾條規則做「拿掉後重跑」，看你的遵從率有多少是虛假的
- 如果你在設計 Agent 的指令架構：規則放在 system prompt 和 project files 比放在 tool description 更有效，別把關鍵規則藏在工具定義裡

---

## 論文二｜SHE：讓安全 Harness 從失敗中自動演化

### SHE: Trajectory-driven Safety Harness Evolution for LLM Agents
Wanying Qu, Qinghua Mao, Yu Li et al.（上海 AI Lab / 復旦 / 上交 / 港科大）　·　arxiv: 2608.09885

連結: [arxiv](https://arxiv.org/abs/2608.09885) · [alphaxiv](https://www.alphaxiv.org/abs/2608.09885)

### TL;DR

把 Agent harness 拆成四個安全元件（System Prompt、Rule Bank、Safety Memory、Tool Policy），用歸因導向的演化迴圈從軌跡失敗自動學習邊界修正，ASR 降低 3.1 倍且無損正確率。

### Read Priority

必讀 — Agent 安全的實踐者終於有了一個「安全不是一坨 prompt，而是四個可獨立演化的元件」的具體架構。

### 領域背景

現有 Agent 安全機制把 harness 當作靜態部署物：寫好一版 system prompt 加一套工具限制就上線。問題是新風險不斷出現，而 harness 各部分的安全職責混在一起，改一個地方可能搞壞另一個。之前的 SafeHarness 是靜態的，不會從失敗中學。

### 中階導讀

- **問題**：想像一個保全系統，攝影機、門禁、警報器全綁在一塊電路板上。要升級警報器就得拆整塊板。SHE 的做法是把它們拆成四個獨立模組，每個模組可以單獨升級。
- **方法**：SHE 把 harness 分成四個元件，每個有明確的安全職責。演化迴圈三步走：①從軌跡失敗做結構化診斷（歸因到具體元件），②對該元件做邊界修正，③用安全-效用雙指標驗證。跑 20 輪演化，每輪覆蓋 15 個任務 × 6 種攻擊條件。
- **為什麼重要**：安全不再是「寫更嚴格的 prompt」，而是一個可以持續迭代的工程流程。四元件分解讓你知道「這次失敗是 Tool Policy 的問題還是 Rule Bank 的問題」。

### 深入要點

- 基準：Agent-SafetyBench（6 種攻擊條件），ASR 從 17.1% 降到 5.5%（vs. 靜態 SafeHarness）
- 正確率（UA）同時從 31.6% 提升到 47.6%——安全和效用不是零和
- Held-out AgentHarm：Harm Score 從 19.8% 降到 9.8%，拒絕率從 78.4% 升到 86.4% ⚠️（SHE 團隊自測）
- 演化模型可換：GPT-5.5（R17 最佳）、DeepSeek-V3.2（R03 最佳）、GLM-5.2（R05 最佳）各有不同安全-效用取捨
- 落地門檻：需要可重跑的軌跡環境和結構化評分；20 輪 × 90 次 rollout 的演化成本不低
- 與 MCP / LangGraph 架構可整合：四元件對應到現有 harness 的 system prompt、middleware、memory、tool permissions
- Limitation：目前只在模擬評測環境驗證，真實部署的風險分布可能不同

### Reviewer 一句話評

四元件分解和歸因導向演化的設計清楚有用，是 Agent 安全工程化的重要一步。但 20 輪演化的計算成本和評測環境的代表性仍需驗證。

### 給你的 take-away

- 如果你在做 Agent 安全：把 harness 拆成 System Prompt / Rule Bank / Safety Memory / Tool Policy 四塊，每塊獨立版本控制和回歸測試
- 如果你在做 Agent 平台：SHE 的「歸因到元件 → 修正邊界 → 雙指標驗證」三步迴圈可以直接做成 CI/CD 管線的一環

---

## 論文三｜SBCO：讓規劃 Agent 的 Harness 自動變強，成本降 5 倍

### SBCO: Self-Supervised, Verifier-Grounded Harness Optimization For Planning Agents
Vivek Kulkarni, Sudipta Paul, Aounon Kumar et al.　·　arxiv: 2608.10157

連結: [arxiv](https://arxiv.org/abs/2608.10157) · [alphaxiv](https://www.alphaxiv.org/abs/2608.10157)

### TL;DR

用分解式驗證器銀行 + 文本梯度做 harness 自我改進，在旅遊和購物規劃任務上以 733-989 次計畫生成追平需要 4000 次的 Gödel Machine 變體（HGM-C），購物任務甚至超過 +3 Match / +9 Case Accuracy。

### Read Priority

必讀 — 如果你的 Agent 在做有明確約束的規劃任務（旅程、購物、排程），SBCO 的驗證器分解思路直接可用。

### 領域背景

Agent 自我改進有兩條路：一是 Gödel Machine 風格的遞迴自我修改（Agent 改自己的程式碼），但需要「改程式的能力」和「做任務的能力」對齊，而且計算成本高（幾千次候選搜索）。二是固定 meta-agent 做 harness 優化，但之前都是整塊優化，沒有結構化分解。

### 中階導讀

- **問題**：想像你在調一台機器，有 20 個旋鈕。遞迴自我修改的做法是讓機器自己隨機轉旋鈕看結果（進化搜索）。SBCO 的做法是：先搞清楚每個旋鈕控制什麼（學驗證器），再一個一個轉（block coordinate ascent）。
- **方法**：兩階段交替——①對每個約束學一個驗證器（用 precision/recall 把關品質，precision ≥ 0.80 才進銀行），②固定驗證器後用文本梯度優化 prompt 和修復策略。外迴圈跑 3 個 epoch，每個 block 最多 5 次戰術修正 + 2 次策略轉向。
- **為什麼重要**：證明了「結構化驗證 + 分解優化」比「整體進化搜索」便宜 4-5.5 倍，而且效果不輸。對任何有明確約束的規劃任務，這是一個直接可複製的改進框架。

### 深入要點

- Travel：Composite 84 vs. HGM-C 83，Budget 733 vs. 4000（5.5× 更省）
- Shopping：Match 94 vs. HGM-C 91，Case Accuracy 79 vs. 70（+9），Budget 989 vs. 4000（4× 更省）
- 86% 的效能增益來自 F1 ≥ 0.80 的驗證器——學不好的驗證器不如不學 ⚠️（作者自測，2 次平均）
- 驗證器和修復策略可跨模型遷移：GPT-5.4-mini 學的策略直接用在 Mistral 上仍有 +9.9 提升
- 購物任務的修復策略幾乎不呼叫 LLM，而是用程式碼直接改購物車——優化器自己發現了這條捷徑
- 優化器還發現了 Shopping 評分指標的漏洞：多加商品不扣分（純 recall），因此策略學會只加不刪
- Limitation：只在有明確可驗證約束的規劃任務上測過；驗證器本身學不會的約束（如地理距離）就改不了

### Reviewer 一句話評

block coordinate ascent + 文本梯度的設計優雅且高效，驗證器品質把關機制是亮點。但適用範圍限於約束可形式化的規劃任務，這個前提需要讀者自行判斷。

### 給你的 take-away

- 如果你的 Agent 做旅程/購物/排程等有約束的規劃：直接借用 SBCO 的「per-constraint 驗證器 + 品質閘門 + 修復策略」三件套，不需要重新發明
- 如果你在做 Agent 自我改進：別急著上遞迴自我修改，先試結構化分解——SBCO 證明在有約束的任務上這條路又便宜又好

---

## 今日收穫

之前以為 harness 只是「包住模型的膠水程式碼」，今天發現它正在成為一個獨立的工程學科——可以量測（Harness-IF 的 AP-Acc）、可以拆解成有明確職責的元件（SHE 的四元件）、可以用結構化方法自動優化（SBCO 的 block coordinate ascent）。模型能力的天花板短期內很難突破，但 harness 的改進空間幾乎是無限的，而且成本低得多。

## 參考資料

- [arxiv:2608.09885](https://arxiv.org/abs/2608.09885)
- [arxiv:2608.10157](https://arxiv.org/abs/2608.10157)
- [arxiv:2608.11727](https://arxiv.org/abs/2608.11727)
