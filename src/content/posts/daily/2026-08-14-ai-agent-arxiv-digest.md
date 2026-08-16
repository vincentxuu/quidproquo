---
title: "AI Agent Arxiv Digest — 2026-08-14"
date: 2026-08-14
category: daily
tags: [ai-agent, arxiv, daily, agent-harness, agent-evaluation, agent-safety]
lang: zh-TW
description: "今天三篇都指向同一件事——模型之外的 harness 才是決定 Agent 品質的工程面：指令遵從度被高估、harness 可以分層自我演化、驗證器分解讓自我改進便宜 5 倍"
tldr: "Harness-IF 揭示 Coding Agent 的指令遵從度被高估 3.6-7.4 個百分點，因為模型本來就會做的事被算成了遵從；HSI 用三層架構讓凍結的 LLM 自己演化 harness，BabyAI +39.3、Crafter +33.0，但碰到模型能力天花板就停；SBCO 用分解式驗證器銀行搭配文本梯度做 harness 自我改進，在規劃任務上以 4-5.5 倍更少的算力追平 Gödel Machine"
series:
  name: "AI Agent Arxiv Digest"
  order: 82
---

## 今日總覽

今天三篇論文都指向同一個正在成形的認知：Agent 的效能瓶頸不在模型，而在 harness——包住模型的那層工程膠水（system prompt、規則、工具策略、驗證迴圈）。Harness-IF 從評測端揭穿一個數字幻覺：現有指令遵從率被高估了，因為模型「本來就會做的事」被算成了遵從。HSI 從架構端提出分層自我演化：讓同一個凍結的 LLM 在三個層級上改自己的 harness，中等難度任務大幅提升，但碰到模型能力天花板就完全停滯。SBCO 則從效能端證明，只要把驗證器和修復策略結構化，harness 的自我改進可以比遞迴式自我修改便宜 5 倍。三篇合起來說的是同一件事：**harness 是可以被量測、可以被分層演化、可以被自動優化的獨立工程面——但它有硬上限**。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| Agent Harness（鷹架） | 包住 LLM 的所有工程元件——system prompt、工具定義、記憶管理、權限控制、執行迴圈。模型是引擎，harness 是車身 |
| Against-Prior Accuracy | Harness-IF 提出的新指標：只計算「模型預設不會做、加了規則才做」的那些指令的遵從率，排除巧合 |
| Backbone Capability Bound | HSI 提出的概念：harness 再怎麼演化，也無法超越底層模型的能力天花板——模型做不到的事，改 harness 也沒用 |
| 文本梯度（TextGrad） | 用自然語言批評代替數值梯度，讓 LLM 的 prompt 和策略能被「微分」優化 |
| 驗證器銀行（Verifier Bank） | SBCO 學出的一組 per-constraint 檢查器，每個只負責檢查一條約束是否被滿足 |

---

## 論文一｜Harness-IF：你的 Coding Agent 真的在聽指令嗎？

**Harness-IF: Evaluating Instruction Following Across Instruction Surfaces in Coding Agents**
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

## 論文二｜HSI：讓凍結的 LLM 自己演化自己的 Harness

**Hierarchical Self-Improvement: A Framework for Task-Specific Evolvable Agent Harnesses**
Tailin Zhou　·　arxiv: 2608.08466

連結: [arxiv](https://arxiv.org/abs/2608.08466) · [alphaxiv](https://www.alphaxiv.org/abs/2608.08466)

### TL;DR

讓同一個凍結的 LLM 在三個層級上改自己的 harness（task harness → evolver → meta-evolver），中等難度任務大幅提升（BabyAI +39.3、Crafter +33.0），但碰到模型能力天花板（NLE）就完全無效。

### Read Priority

必讀 — 如果你想知道 harness 自我演化到底能走多遠、硬上限在哪裡，這篇是目前最清楚的實證邊界。

### 領域背景

Agent harness 演化有兩個未解問題：一是現有方法依賴外部更強的模型當「設計師」，能不能讓模型自己改自己的 harness？二是自我改進的增益到底來自 harness 變好，還是只是多試了幾次（test-time scaling）？之前的 Gödel Machine 風格方法沒有區分這兩個效果。

### 中階導讀

- **問題**：想像一個工廠的生產線（harness）和調整生產線的工程師（evolver）是同一個人。他一邊跑生產線一邊改生產線，怎麼保證改對了？再往上，誰來改「工程師的改法」？
- **方法**：HSI 建了三層結構：底層是 task harness（跑任務），中層是 evolver（改 harness），頂層是 meta-evolver（改 evolver 的策略）。關鍵設計是 thinking-on/off：跑任務時關閉推理（fixing 模型能力），改 harness 時開啟推理。這樣就能乾淨地分離「harness 變好」和「模型想更久」兩個效果。
- **為什麼重要**：HSI 同時回答了兩個問題——harness 自我演化確實有效（中等難度任務大幅提升），但有硬上限（模型能力不夠的任務怎麼改 harness 都沒用）。這讓你知道什麼時候該投資 harness、什麼時候該換模型。

### 深入要點

- 基準：BALROG（BabyAI、Crafter、TextWorld、MiniHack、NLE），DeepSeek-V4-Flash-Preview 凍結
- BabyAI +39.3、Crafter +33.0、TextWorld +25.0、MiniHack +15.0（raw % Progress）
- BabaIsAI held-out 泛化：BreakStop 0.98、GoTo 1.00（20% unseen split）⚠️（作者自測）
- NLE（NetHack）：harness 演化完全無效，零提升——這是 backbone capability bound 的實證
- thinking-on/off 設計隔離貢獻：跑任務關推理 → 增益純粹來自 harness 改善
- 落地門檻：需要可重跑的任務環境做反饋迴圈；meta-evolver 層仍用凍結的外部 anchor 防止失控
- 與 Claude Code / LangGraph 架構的關聯：三層分離對應 task agent / orchestrator / meta-config
- Limitation：只在遊戲/模擬環境驗證；真實工作負載的 feedback-fidelity bound 未知

### Reviewer 一句話評

三層架構設計清晰，thinking-on/off 是巧妙的因果隔離手段。但 NLE 的零提升也說明這不是銀彈——什麼時候該停止改 harness、改去換模型，還需要更便宜的診斷方法。

### 給你的 take-away

- 如果你在做 Agent 平台：HSI 的 thinking-on/off 設計可以直接借用——在評估 harness 改動時，固定模型推理模式，才能知道增益是 harness 帶來的還是推理帶來的
- 如果你在決定投資方向：先在你的任務上跑一個 baseline（凍結模型 + 最小 harness），如果 baseline 已經接近零，改 harness 不會有用，應該先升級模型

---

## 論文三｜SBCO：讓規劃 Agent 的 Harness 自動變強，成本降 5 倍

**SBCO: Self-Supervised, Verifier-Grounded Harness Optimization For Planning Agents**
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

之前以為 harness 只是「包住模型的膠水程式碼」，今天發現它正在成為一個獨立的工程學科——可以量測（Harness-IF 的 AP-Acc）、可以分層自我演化（HSI 的三層架構）、可以用結構化方法自動優化（SBCO 的 block coordinate ascent）。但 HSI 的 NLE 實驗也給了一記冷水：harness 改進有硬上限，模型能力不夠的任務怎麼改都沒用。投資 harness 還是投資模型，不是信仰問題，而是需要先跑 baseline 才能回答的實證問題。

## 參考資料

- [arxiv:2608.08466](https://arxiv.org/abs/2608.08466)
- [arxiv:2608.10157](https://arxiv.org/abs/2608.10157)
- [arxiv:2608.11727](https://arxiv.org/abs/2608.11727)
