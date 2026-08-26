---
title: "AI Agent Arxiv Digest — 2026-08-10"
date: 2026-08-10
category: daily
tags: [ai-agent, arxiv, daily, agent-harness, self-evolution, agent-safety]
lang: zh-TW
description: "今天三篇圍繞同一個問題——Agent 的鷹架不該是寫死的：Evo-Bench 首次量化 LLM 自主改進鷹架的能力，MEGA 讓知識在優化循環中自我進化，SHE 則證明安全邊界也能從軌跡中學習演化"
tldr: "Evo-Bench 評測九款模型自主改進鷹架的能力，GPT-5.6 Sol 拿下 +16.6 分但 Office 任務幾乎不動；MEGA 用三層 Wisdom Graph 讓 Agent 優化基礎設施自我進化，知識積累與優化合為同一過程；SHE 把鷹架拆成四個可演化元件，從失敗軌跡學習安全邊界，ASR 降低 3.1 倍且跨模型可遷移"
series:
  name: "AI Agent Arxiv Digest"
  order: 78
---

> 🌏 [English version](/en/posts/daily/2026-08-10-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇論文從不同層面回答同一個核心問題：Agent 的鷹架（harness）——包括 system prompt、工具定義、記憶模組、安全規則——能不能自己變好？Evo-Bench 第一次把「改鷹架」當成獨立能力來測量，發現頂級模型確實能自主進化出接近人工調優水準的框架，但碰到需要精確流程的 Office 任務就卡住了。MEGA 更進一步，不只讓 Agent 改自己，而是讓改的過程產出的知識也跟著進化——優化系統和知識庫是同一個迴圈。SHE 則把這個概念專門應用在安全面：讓鷹架從失敗軌跡中學會新的安全邊界，而且學到的規則可以跨模型遷移。三篇合起來的訊息很清楚：2026 年下半年，「鷹架自我進化」已經從論文概念變成可測量、可實作的工程方向。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| 鷹架（Harness） | Agent 的「作業系統」——system prompt、工具集、記憶管理、權限控制等模型以外的一切，決定 Agent 怎麼跟環境互動 |
| 鷹架進化（Harness Evolution） | Agent 自主修改自己的鷹架來提升表現，不需要人手動調整 prompt 或工具定義 |
| 攻擊成功率（ASR） | 對抗攻擊讓 Agent 做出不安全行為的比例；ASR 越低代表防禦越好 |
| Wisdom Graph | MEGA 提出的知識圖譜結構，把 Agent 優化過程中學到的經驗拆成最小單元並建立推理關係 |
| 歸因引導演化（Attribution-guided Evolution） | SHE 的核心機制：先診斷「哪個鷹架元件導致失敗」，再只改那個元件，避免全域修改帶來的副作用 |

---

## 論文一｜Evo-Bench：你的模型能自己改好自己的鷹架嗎？

### Evo-Bench: Can Language Models Improve Agent Harness?
Lisheng Huang, Chen Yang, Hao Zhou et al.（Renmin University of China / BOSS Zhipin）　·　arxiv: 2608.09096

連結: [arxiv](https://arxiv.org/abs/2608.09096) · [alphaxiv](https://www.alphaxiv.org/abs/2608.09096)

### TL;DR

第一個專門測量 LLM 自主改進鷹架能力的基準測試。GPT-5.6 Sol 拿下最高 +16.6 分整體增益，接近人工調優的水準，但 Office 任務的分數幾乎不動。

### Read Priority

必讀 — 如果你在做 Agent 框架或平台，這篇直接告訴你「哪些模型能自己改框架、改到什麼程度、哪裡改不了」，而且有九個模型的橫向對比數據。

### 領域背景

Agent 的表現越來越取決於鷹架而非模型本身。之前的做法是人工迭代 prompt 和工具定義，但這不規模化。「讓模型自己改鷹架」的研究近幾個月爆發，卻缺少統一的評測——現有 benchmark 沒辦法把「鷹架改進」和「模型本身能力」分開衡量。

### 中階導讀

- **問題**：想像你有一套 Agent 框架，想知道「讓 GPT-5.6 自己改這套框架十輪」會不會比人工調優更好——但怎麼確定進步是來自框架變好，而不只是模型本來就強？
- **方法**：Evo-Bench 用「輔助任務進化」先找出哪些任務對鷹架改動真正敏感，再用分層抽樣確保測試集和驗證集不重疊。九個模型各自從同一個 CodeAct 基礎鷹架開始進化，量化每輪的增益。
- **為什麼重要**：這是第一個能隔離「鷹架進化能力」的 benchmark，讓你可以回答「我該用哪個模型來自動改進我的 Agent 框架」這個實際的工程問題。

### 深入要點

- GPT-5.6 Sol 整體 46.3 分（+16.6），Claude Opus 4.8 緊追 45.8（+16.1）
- 人工精調的 Artificial Harness 為 47.5 分——頂級模型已接近但尚未超越 ⚠️（作者自測，外部複現待定）
- Search 任務增益巨大（+32.8），General 任務中等（+11.0），Office 任務幾乎不動（+3.2）
- 開源模型 Qwen3.6-27b 排第六，整體 39.4（+9.7），證明不一定要頂級閉源模型
- 發現「早期飽和」現象：多數模型在前 3-5 輪就不再進步
- 進化出的鷹架可遷移到其他策略模型，且持續帶來增益
- Limitation：目前只覆蓋三個領域，Office 任務的進化瓶頸原因未深入分析

### Reviewer 一句話評

實驗設計紮實，隔離鷹架改進的方法論有說服力。但 Office 任務的低增益到底是「鷹架進化的根本限制」還是「這些特定任務不適合」，論文沒有給出足夠的歸因分析。

### 給你的 take-away

- 如果你在做 Agent 平台：直接用 Evo-Bench 測你的模型的鷹架進化能力，選得分最高的模型來驅動自動框架優化——但對需要精確流程的領域（如 Office 文書處理），仍需人工介入
- 如果你在評估 Agent 框架：把「鷹架對任務的敏感度」當成框架品質的新指標——敏感度低的鷹架可能已經過度耦合，改不動了

---

## 論文二｜MEGA：讓 Agent 的優化知識自己長大

### MEGA: Self-Evolving Agent Optimization Infrastructure via Wisdom Graph
Jung Hwan Lee, Kyu Ho Lee, Gwang Hoon Yoo　·　arxiv: 2608.10504

連結: [arxiv](https://arxiv.org/abs/2608.10504) · [alphaxiv](https://www.alphaxiv.org/abs/2608.10504)

### TL;DR

提出三層自我進化基礎設施：從 Agent 軌跡蒸餾可重用知識、用 Wisdom Graph 做組合推理、再用多 Agent 協作優化把改善歸因到具體策略——知識庫和優化過程合為同一個迴圈。

### Read Priority

略讀 — 架構願景宏大但目前是技術報告，缺少與現有框架（如 DSPy、AFlow）的橫向對比數據。對「Agent 如何系統性地累積和運用經驗」有興趣的讀者值得看架構設計。

### 領域背景

現有的 Agent 優化方法有三個斷層：優化但不累積知識（每次從頭來）、累積知識但不做組合推理（只靠向量相似度檢索）、沒有自我修正機制（知識不會因為後續證據而更新）。

### 中階導讀

- **問題**：你的 Agent 團隊跑了一千個任務，學到了很多「什麼行得通、什麼行不通」——但這些經驗散落在 log 裡，下次優化時根本用不上。
- **方法**：MEGA 用三層架構解決。Layer 1 從 Agent session 中用行為聚類和 A/B 驗證蒸餾出可重用的「智慧資產」。Layer 2 把資產拆成原子級的 PCR（前提-情境-結果）單元，建成 Wisdom Graph，用演繹、歸納、溯因推理發現嵌入檢索找不到的橋接知識。Layer 3 用多 Agent 協作做受控優化，把效果歸因到具體策略變動。Layer 3 的證據回饋 Layer 1 和 2，讓知識自我進化。
- **為什麼重要**：這是第一個把「優化 Agent 系統」和「進化指導優化的知識」設計成同一個過程的框架——不再是「用完就丟」的優化，而是會越用越聰明的基礎設施。

### 深入要點

- Wisdom Graph 用 PCR 三元組表示知識，比純向量檢索多出「橋接推理」能力
- Layer 3 的歸因機制用受控實驗消除數據方差，避免「以為改了 A 導致進步但其實是 B」
- 技術報告 29 頁，架構清楚但目前無公開基準測試數據 ⚠️（尚未與 DSPy/AFlow/TextGrad 對比）
- 對 Agent 平台而言，核心創新在於「元級自我進化」——不只是 Agent 變好，而是讓 Agent 變好的方法也在變好
- Limitation：全為理論架構與內部實驗，缺少開源實作和社群複現

### Reviewer 一句話評

架構設計層次清晰，「知識自我進化」的概念定位精準。但缺少與現有主流優化框架的對比實驗，落地可行性仍需驗證。

### 給你的 take-away

- 如果你在做 Agent 平台的持續改進管線：MEGA 的 Layer 1（行為聚類 + A/B 驗證蒸餾）是目前最結構化的「從軌跡學經驗」設計，值得參考其知識表示格式
- 如果你在做 Agent 記憶系統：Wisdom Graph 的 PCR 三元組加推理擴展，比純向量檢索多了一層「為什麼」——這可能是記憶系統的下一個升級方向

---

## 論文三｜SHE：讓安全護欄從失敗中學會進化

### SHE: Trajectory-driven Safety Harness Evolution for LLM Agents
Wanying Qu, Qinghua Mao, Yu Li et al.（Shanghai AI Lab / Fudan / SJTU / HKUST）　·　arxiv: 2608.09885

連結: [arxiv](https://arxiv.org/abs/2608.09885) · [alphaxiv](https://www.alphaxiv.org/abs/2608.09885)

### TL;DR

把 Agent 鷹架拆成四個有明確安全職責的可進化元件（System Prompt、Rule Bank、Safety Memory、Tool Policy），從失敗軌跡中學習安全邊界，ASR 降低 3.1 倍，且進化後的規則可跨模型遷移。

### Read Priority

必讀 — 安全機制的進化是實際部署 Agent 的剛需。SHE 的四元件分解和歸因引導演化提供了一個可操作的安全鷹架設計範本。

### 領域背景

現有的 Agent 安全機制多是靜態的——寫好一組規則就上線。但風險是動態的：新的攻擊模式出現後，靜態護欄來不及更新。而且鷹架功能耦合（prompt 裡混了安全規則和任務指引），導致改一處壞另一處。

### 中階導讀

- **問題**：想像你的 Agent 上線一週後，出現了訓練時沒見過的攻擊模式——你現在只能手動改 system prompt 加規則，但每次改都可能影響正常任務的表現。
- **方法**：SHE 先做解耦——把鷹架拆成四個各有獨立安全職責的元件。然後跑演化迴圈：Agent 執行任務 → 失敗時診斷「是哪個元件的責任」→ 只改那個元件的規則 → 用安全性和效用雙指標驗證改動 → 通過才採用。
- **為什麼重要**：這是第一個把「鷹架進化」專門用在安全面的框架。解耦設計讓你可以獨立更新安全規則，不影響其他功能。

### 深入要點

- Agent-SafetyBench 上 ASR 從 seed 的約 23% 降到 evolved 的約 7%，降幅 3.1× ⚠️（作者自測）
- 同時 benign utility 有提升，不是靠過度拒絕換來的安全
- 遷移到 AgentHarm 基準（held-out，未參與演化）：ASR 從 37.4% 降到 9.8%（-10.0 百分點 vs seed）
- 換模型測試：GPT-5.5、DeepSeek-V3.2、GLM-5.2 都能受益於同一套進化後的鷹架
- 四元件各有貢獻：Rule Bank 和 Safety Memory 影響最大
- 演化收斂速度快，約 17 輪達到最佳安全-效用平衡
- Limitation：僅測試文字模態，多模態 Agent 的安全進化未涵蓋

### Reviewer 一句話評

四元件解耦設計實用且工程感強，跨模型遷移結果是最有說服力的亮點。但「歸因診斷」的準確率本身沒有被量化評估——如果診斷歸因錯了，演化方向也會偏。

### 給你的 take-away

- 如果你在部署生產 Agent：直接參考 SHE 的四元件分解——把 System Prompt、Rule Bank、Safety Memory、Tool Policy 設計成獨立可更新的模組，這比「全寫在一個 prompt 裡」的做法更容易做安全迭代
- 如果你在做 Agent 安全測試：SHE 的演化迴圈可以當成自動化紅隊的框架——讓系統從自己的失敗中自動學習新的防禦規則

## 我今天學到什麼

之前以為「鷹架」是部署前調好就不動的東西，今天發現它應該是一個持續進化的系統——而且進化的方向不只是效能（Evo-Bench），連安全邊界都能從軌跡中學（SHE）。更讓我意外的是，進化出的鷹架竟然可以跨模型遷移——這意味著好的鷹架不是綁定特定模型的，而是一種獨立的、可積累的資產。

## 參考資料

- [arxiv:2608.09096](https://arxiv.org/abs/2608.09096)
- [arxiv:2608.09885](https://arxiv.org/abs/2608.09885)
- [arxiv:2608.10504](https://arxiv.org/abs/2608.10504)
