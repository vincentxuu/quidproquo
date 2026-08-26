---
title: "AI Agent Arxiv Digest — 2026-07-13"
date: 2026-07-13
category: daily
tags: [ai-agent, arxiv, daily, agent-memory, agent-deployment, agent-evaluation]
lang: zh-TW
description: "今天三篇論文共同呼應一個趨勢：生產環境 agent 的瓶頸已不在模型能力，而在「狀態管理」"
tldr: "今天三篇論文共同呼應一個趨勢：生產環境 agent 的瓶頸已不在模型能力，而在「狀態管理」。第一篇（Amazon）展示把重複步驟預先編譯成工具，可讓 p50 延遲降 42%、錯誤率降 53%；第二篇提出讓獨立記憶 agent 主動把關鍵狀態「推送」給行動 agent，解決長程任務中資訊遺失（behavioral state decay）的問題；第三篇以遞迴多 agent 架構克服單一 agent 無法同時廣又深的 web 研究限制。三篇合看：**工具化（tool compilation）、主動記憶（proactive memory）、遞迴分工（recursive orchestration）*"
series:
  name: "AI Agent Arxiv Digest"
  order: 50
---
> 🌏 [English version](/en/posts/daily/2026-07-13-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇論文共同呼應一個趨勢：生產環境 agent 的瓶頸已不在模型能力，而在「狀態管理」。第一篇（Amazon）展示把重複步驟預先編譯成工具，可讓 p50 延遲降 42%、錯誤率降 53%；第二篇提出讓獨立記憶 agent 主動把關鍵狀態「推送」給行動 agent，解決長程任務中資訊遺失（behavioral state decay）的問題；第三篇以遞迴多 agent 架構克服單一 agent 無法同時廣又深的 web 研究限制。三篇合看：**工具化（tool compilation）、主動記憶（proactive memory）、遞迴分工（recursive orchestration）**，是 2026 年 agent 平台工程的三個核心方向。

## 讀這篇前該知道的詞


| 白話解釋 | 詞 |
|---|---|
| 能自主執行多步驟任務的 AI 程式，可呼叫工具、觀察環境、自主決策，不需人逐步指示 | Agent（代理程式） |
| Standard Operating Procedure，規範「遇到 X 狀況要執行 Y 步驟」的企業或系統流程文件 | SOP（標準作業程序） |
| 需要許多步驟才能完成的複雜任務，例如：幫你執行整輪除錯 → 修復 → 驗證流程 | Long-horizon task（長程任務） |
| 讓 agent 交替「推理（Reasoning）」與「行動（Acting）」的主流框架，是大多數 agent 的底層架構 | ReAct |
| LLM 一次能「看到」的文字長度上限，超出後舊資訊被丟棄，agent 就可能「忘記」先前的指示 | Context window（上下文視窗） |


---


## 論文一｜Tool-Making and Self-Evolving LLM Agents in Low-Latency Systems

**作者**: Kalle Kujanpää, Ning Liu, Shahnawaz Alam, Yeshwanth Reddy Sura, Tianyu Yang, Kristina Klinkner, Shervin Malmasi · Amazon Fulfillment Technologies & Robotics
**arxiv**: 2607.08010
**連結**: [arxiv](https://arxiv.org/abs/2607.08010) · [alphaxiv](https://www.alphaxiv.org/abs/2607.08010)

### TL;DR

Amazon 把 agent 每次都要「重新生成」的固定操作程式碼，預先離線編譯成版本化工具——生產環境 p50 延遲降 42%、錯誤率降 53%。

### Read Priority

必讀
少見的生產環境 agent 工程論文，有真實 KPI 數字，對任何在意 agent 延遲與穩定性的工程師直接有用。

### 領域背景

現有 LLM agent 在每次執行任務時，都需要即時（runtime）生成操作程式碼——即使同樣的步驟已被重複執行幾百次。這造成兩個問題：(1) 速度慢（每次都要 LLM 推論），(2) 不穩定（每次生成的程式碼略有差異，導致結果不一致）。過去解方是「人工定義工具」，但無法隨使用動態擴充，也難以自動適配複雜的多後端環境。

### 中階導讀


#### 問題

想像亞馬遜倉儲中心的警報診斷 agent：它依照一份 44 個節點的 SOP，需要跨查多種異質後端服務（指標資料庫、操作日誌、庫存系統）。這個流程每小時觸發幾百次，但每次 agent 都從頭生成查詢程式碼——結果：慢（LLM 推論疊加），且不穩定（相同 SOP 節點每次生成的程式碼可能略有差異）。

#### 方法

提出 **tool-making pipeline**，在部署前（offline）自動編譯工具：首先收集 agent 的 execution traces（實際執行軌跡）；接著讓 tool-maker agent 觀察後端環境（API schema、值域），自動生成候選 Python 工具函式；再對照有標籤的歷史案例進行 self-repair（自動修復）；驗證通過後版本化存儲。生產 agent 在 runtime 直接呼叫工具，工具不夠用時才 fallback 到即時生成。

#### 為什麼重要

這套架構實質上是「自動 MCP tool registry」的雛形：agent 透過自身的使用歷史動態擴充工具庫。對 LangGraph / AutoGen 等框架的啟示：工具不再只能人工定義，而可以從真實操作軌跡中學出來，大幅降低 agent 平台的工具管理成本。

### 深入要點

- 部署場景：Amazon Fulfillment Center alarm-triage（履行中心警報診斷），真實 production 系統，非 lab benchmark
- 架構分層：offline tool-maker（工具合成階段）+ online production agent（工具呼叫階段），明確分離關注點
- Tool repair loop：自動對照 labeled cases 修復候選工具函式，確保準確度達門檻才上線
- **⚠️ p50 latency -42%、error rate -53%** 來自 Amazon 內部 production 系統，外部無法直接重現
- 錯誤率下降原因：預先編譯消除了「run-to-run variance」（每次隨機生成帶來的差異）
- Fallback 機制：工具庫覆蓋不到的 edge case 仍走即時生成，保持系統穩健性
- 冷啟動問題：初期 execution trace 不足時工具覆蓋率低，需一段時間累積才有效
- MCP 關聯：此 pipeline 可視為動態 MCP tool registry 的自動版本，tool-making 步驟可接入現有 tool registry 架構
- Limitation：需要足夠標籤化的歷史案例才能有效 repair 工具；multi-tenant 環境中工具如何共享未討論

### Reviewer 一句話評

紮實。Amazon 工程師論文，數字來自真實 production 系統，這在 agent 論文裡非常少見。方法本身不複雜（本質是「把重複步驟函式化並自動化」），但 end-to-end pipeline 在生產環境驗證，工程貢獻清楚。唯一遺憾是「如何決定哪些 trace 值得被編譯成工具」的細節描述稍不透明。

### 給你的 take-away

- **設計 agent 工具庫時**：思考「哪些工具應人工定義、哪些可從 trace 自動學出來」——這篇提供了 SOP + execution trace → 工具的具體路徑
- **你的 agent 有重複性高的操作**（CRUD、API 查詢、規則檢查）：嘗試預先編譯成固定工具函式而非每次讓 LLM 重新生成，穩定性和速度都會提升

---


## 論文二｜Remember When It Matters: Proactive Memory Agent for Long-Horizon Agents

**作者**: Yifan Wu, Lizhu Zhang, Yuhang Zhou, Mingyi Wang, Bo Peng, Serena Li, Xiangjun Fan, Zhuokai Zhao · 多家機構合作
**arxiv**: 2607.08716
**連結**: [arxiv](https://arxiv.org/abs/2607.08716) · [alphaxiv](https://www.alphaxiv.org/abs/2607.08716)

### TL;DR

另開一個「記憶 agent」並行跑在行動 agent 旁邊，在關鍵時刻主動把重要資訊推送給它——Terminal-Bench 2.0 提升 +8.3pp，τ²-Bench 提升 +6.8pp。

### Read Priority

必讀
長程任務（multi-step coding、客服）是 agent 最常踩的坑，「主動推送 vs. 被動檢索」是記憶架構的核心分歧點，對設計 agentic workflow 的工程師有直接設計啟示。

### 領域背景

現有 agent 記憶系統大多是「被動檢索」：agent 在需要時主動去查向量資料庫。問題是 agent 不見得知道「自己忘了什麼」——任務走到第 30 步，第 3 步設定的關鍵約束早已超出 context window，agent 根本無從意識到應該去查。這篇論文把這個現象命名為 **behavioral state decay（行為狀態衰退）**。

### 中階導讀


#### 問題

假設 agent 執行一個 100 步的 shell 任務，任務開始時使用者說「不要修改 /etc/hosts」。到了第 80 步，這條指令早已超出 context window，agent 就這樣修改了它。這不是 agent「不夠聰明」，而是架構問題——關鍵狀態需要主動管理，而非靠 agent 自己記得去查。

#### 方法

提出 **ProMem**：一個獨立的 memory agent，並行執行於 action agent 旁邊，且不修改 action agent 本身。ProMem 持續從最近的 trajectory 段落更新一個結構化 memory bank（分五類：任務需求、環境事實、過去嘗試、診斷結果、待完成子目標），並自主決策是否在當下注入一條「memory-grounded reminder」——只有在判斷「現在的決策會受此記憶影響」時才注入，而非每步都干擾。

#### 為什麼重要

「主動記憶（proactive）」vs.「被動記憶（reactive）」是 agent memory 架構的重要分歧。Drop-in 設計讓它可以嫁接到現有 agent，無需重新訓練模型。弱模型和強模型都受益（+8.3pp / +6.8pp），說明這是架構層面的改善，而非特定模型的技巧。

### 深入要點

- 評測平台：Terminal-Bench 2.0（terminal 操作任務）+ τ²-Bench（客服長程對話），pass@1 均有提升
- 結果：+8.3pp on Terminal-Bench 2.0、+6.8pp on τ²-Bench（弱模型與強模型 action agent 皆受益）
- Memory bank 五分類：任務需求 / 環境事實 / 過去嘗試 / 診斷結果 / 待完成子目標——這個分類本身是可借鑒的設計
- 注入時機是關鍵設計點：過多注入干擾 action agent，過少則無效；memory agent 需有足夠能力判斷
- 與 LangGraph persistence 的差異：LangGraph 的記憶在 checkpointing 層，靠 agent 主動 retrieve；ProMem 是獨立 agent 主動 push
- **⚠️ Memory agent 的 token / latency overhead 在論文中未詳細報告**——對實際部署成本估算是一個明顯缺口
- Limitation：memory agent 本身的品質直接影響效果；用弱模型作 memory agent 時效果未被充分討論
- Limitation：步驟數極少的短任務中，overhead 可能不值得

### Reviewer 一句話評

問題定義（behavioral state decay）清楚到位，ProMem 的 memory bank 五分類設計感強。但 +6~8pp 的提升幅度偏保守，而且最關鍵的「memory agent overhead」數字完全缺失——這對評估實際部署可行性非常重要，是明顯缺口。概念上重要，工程上有待完善。

### 給你的 take-away

- **設計 long-running agent 時**：考慮「關鍵約束如何確保在整個任務流程中不被遺忘」——ProMem 的五分類 memory bank 是一個具體的設計參考起點
- **你的 agent 偶爾「忘記」先前設定的條件**：問題很可能是 context 管理架構，而非模型能力——先從「如何主動保留關鍵狀態」的角度來診斷

---


## 論文三｜WebSwarm: Recursive Multi-Agent Orchestration for Deep-and-Wide Web Search

**作者**: Xiaoshuai Song, Liancheng Zhang, Kangzhi Zhao, Yutao Zhu, Zhongyuan Wang, Guanting Dong, Jinghan Yang, Han Li, Kun Gai, Ji-Rong Wen, Zhicheng Dou · Renmin University of China 等多家機構
**arxiv**: 2607.08662
**連結**: [arxiv](https://arxiv.org/abs/2607.08662) · [alphaxiv](https://www.alphaxiv.org/abs/2607.08662)

### TL;DR

把複雜 web 研究任務遞迴分解給多層 agent 並行分工，克服單一 agent 同時「廣又深」的 context 限制——本文仍為 work in progress。

### Read Priority

📖 略讀
多 agent 遞迴分工的概念有前例，但 WebSwarm 把它具體應用在 deep web research 場景，適合想設計研究型 agent pipeline 的工程師了解架構 pattern，不需深究細節。

### 領域背景

單一 ReAct agent 做複雜研究任務會遇到兩個瓶頸：(1) **廣度**——context window 裝不下所有相關網頁；(2) **深度**——trajectory 太長後 agent 開始失去方向感。Perplexity / OpenAI Deep Research 等商業系統已在用多 agent 搜尋，但學術界的系統化研究較少，且缺乏可直接採用的開放框架。

### 中階導讀


#### 問題

研究型問題需要「廣且深」的資訊收集：既要覆蓋多個子議題（廣），又要對每個子議題深入查詢（深）。單一 agent 被逼在兩者間妥協——追求廣度就失去深度，追求深度就遺漏廣度。這個限制根源於 context window 大小與單一執行軌跡的長度上限。

#### 方法

WebSwarm 採用遞迴分解策略：(1) **Orchestrator agent** 把問題分解成子問題，指派給 worker agents；(2) **Worker agents** 各自負責特定子議題，搜尋後回報；(3) 子任務若仍過複雜，再次遞迴分解（orchestrator → sub-orchestrator → workers）；(4) 最終由頂層 orchestrator 整合所有結果。本質是「搜尋任務的 divide-and-conquer（分治）」。

#### 為什麼重要

這個架構解釋了為什麼 Deep Research 類產品比單次搜尋強得多。對 agent 框架設計者，「何時分派子任務、分到什麼粒度、如何整合結果」是核心 tradeoff，WebSwarm 提供了一個具體的開放參考實作方向。

### 深入要點

- **⚠️ 本文為 work in progress**，詳細 benchmark 結果尚未完整披露，效果數字需等後續版本確認
- 遞迴深度動態調整：依問題複雜度決定分解層數，但防止無限展開的機制未詳述
- 與 LangGraph subgraph 對比：LangGraph 支援靜態定義的 subgraph；WebSwarm 的遞迴是動態的，更靈活但更難控制
- Orchestrator-worker 通訊開銷：多層遞迴會增加 agent 間通訊的 token 和延遲成本，論文未量化
- 與 Recursive Multi-Agent Systems（arXiv:2604.25917）的關係：WebSwarm 是在相近架構概念上的 web search 具體應用
- Limitation：結果整合品質依賴頂層 orchestrator 的綜合能力；如何避免重複搜尋相同內容未詳述
- 商業對比：Perplexity Deep Research / OpenAI Deep Research 等系統效果能否被開放框架追上，目前無數據

### Reviewer 一句話評

方向正確，但論文仍在進行中，缺乏完整 benchmark 結果，目前難以評估實際效果。遞迴分解搜尋的概念不算全新，貢獻在於系統化應用在 web research 場景並提供開放實作方向。建議追蹤後續完整版本再決定是否採用。

### 給你的 take-away

- **設計「deep research」型 agent 功能時**：WebSwarm 的 orchestrator-worker 遞迴架構值得參考——同時務必設計好「遞迴深度上限」和「結果整合如何避免矛盾」兩個機制
- **先等完整版本**：本文仍是 work in progress，追蹤後續完整 benchmark 結果再決定是否投入採用


## 參考資料

- [arxiv:2607.08010](https://arxiv.org/abs/2607.08010)
- [arxiv:2607.08716](https://arxiv.org/abs/2607.08716)
- [arxiv:2607.08662](https://arxiv.org/abs/2607.08662)
- [arxiv:2604.25917](https://arxiv.org/abs/2604.25917)
