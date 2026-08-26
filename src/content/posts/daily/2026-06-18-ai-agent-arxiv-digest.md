---
title: "AI Agent Arxiv Digest — 2026-06-18"
date: 2026-06-18
category: daily
tags: [ai-agent, arxiv, daily, agent-evaluation, agent-framework, agent-security]
lang: zh-TW
description: "今天三篇論文圍繞 Agent 平台的三個關鍵基礎設施層：HarnessX 提出一套「Harness 即可進化元件」的框架，讓 Agent 執行環境從靜態腳架變成自我最佳化系統，在 5 個 benchmark 上平均提升 +14.5%；第二篇研究多 Agent 協作中的「技能條件信任」路由問題，揭露什"
tldr: "今天三篇論文圍繞 Agent 平台的三個關鍵基礎設施層：HarnessX 提出一套「Harness 即可進化元件」的框架，讓 Agent 執行環境從靜態腳架變成自我最佳化系統，在 5 個 benchmark 上平均提升 +14.5%；第二篇研究多 Agent 協作中的「技能條件信任」路由問題，揭露什麼條件下細分信任真的有用、以及如何被攻擊者劫持；OCELOT 則從資安角度切入，提出「後驗洩漏預算」機制，防止 Agent 一步步把使用者隱私累積洩漏給外部服務。三篇合起來覆蓋框架設計、多 Agent 治理、隱私安全——恰好是落地 Agent 平台時最常踩到的三條坑。"
series:
  name: "AI Agent Arxiv Digest"
  order: 25
---
> 🌏 [English version](/en/posts/daily/2026-06-18-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇論文圍繞 Agent 平台的三個關鍵基礎設施層：HarnessX 提出一套「Harness 即可進化元件」的框架，讓 Agent 執行環境從靜態腳架變成自我最佳化系統，在 5 個 benchmark 上平均提升 +14.5%；第二篇研究多 Agent 協作中的「技能條件信任」路由問題，揭露什麼條件下細分信任真的有用、以及如何被攻擊者劫持；OCELOT 則從資安角度切入，提出「後驗洩漏預算」機制，防止 Agent 一步步把使用者隱私累積洩漏給外部服務。三篇合起來覆蓋框架設計、多 Agent 治理、隱私安全——恰好是落地 Agent 平台時最常踩到的三條坑。

## 讀這篇前該知道的詞


| 詞 | 白話解釋 |
|---|---|
| Harness（執行框架） | Agent 運行時的完整環境——system prompt、工具清單、memory、控制流程。模型決定「想什麼」，Harness 決定「怎麼行動」 |
| Substitution Algebra（代換代數） | 把 Harness 的各種元件做成可互換積木，用代數運算（像接管道）組合和替換，方便系統化實驗 |
| Skill-Conditional Trust（技能條件信任） | 評估 Agent 信任度時，不給一個全域單一分，而是「這個 Agent 在任務類型 k 上的信任度是多少」 |
| Inference Leakage（推斷洩漏） | 攻擊者雖無法直接讀到隱私資料，但能從 Agent 的多次看似無害的輸出中累積推斷出受保護的敏感資訊 |
| AEGIS | HarnessX 的自動演化引擎：Digester → Planner → Evolver → Critic 四個 meta-agent 組成的 pipeline，從執行 trace 中學習並改寫 Harness |


---


## 論文一｜HarnessX: A Composable, Adaptive, and Evolvable Agent Harness Foundry

**作者**: Darwin Agent Team（Tingyang Chen 等 14 位作者）　·　**arxiv**: 2606.14249
**連結**: [arxiv](https://arxiv.org/abs/2606.14249) · [alphaxiv](https://www.alphaxiv.org/abs/2606.14249)

### TL;DR

把 Agent 的執行框架（Harness）做成可組合積木，再讓 AI 自動跑實驗找出最好的組合——不改模型、只調框架，Qwen 9B 在 GAIA 從 33% 跳到 55.77%，GPT-5 從 62% 跳到 84%。

### Read Priority

必讀
如果你在維護或設計 Agent 平台的執行層，這篇直接挑戰「Harness 靠人手寫」的現狀，提出一套系統化的替代方案，值得深讀。

### 領域背景

LLM 能力快速提升，但 Agent 表現依然嚴重依賴 Harness 設計——system prompt 怎麼寫、工具怎麼排序、memory 如何壓縮都影響結果。現狀問題是：每個團隊的 Harness 都靠人工打造，換個模型就得重調一遍，而執行過程中產生的豐富 trace 幾乎從未被系統化拿回來改進框架本身。這篇論文問的是：能不能讓 Harness 自己進化？

### 中階導讀


#### 問題

你在用 Claude 做 coding agent，Anthropic 發布了新模型，但你框架裡的 system prompt、retry 邏輯、tool schema、memory 壓縮策略全部都需要人工重調。你也看著每次失敗的 trace，知道某些 prompt 模式一直出錯，卻無力把這些觀察系統化地轉換成框架改進。HarnessX 要讓這個「觀察→調整」週期自動化。

#### 方法

HarnessX 把 Harness 切成「Processor」積木，分 7 大類：Context、Control、Evaluation、Memory、Multi-model、Observability、Tools，並用「Substitution Algebra（代換代數）」定義組合規則——就像用 pipe operator 串連行為。自動化由 AEGIS 引擎負責：Digester 壓縮 trace → Planner 提修改方案 → Evolver 實作候選版本 → Critic 評分，輪流運作，每跑一輪就更新 Harness。更進一步，好的 trace 也被回流成 SFT/RL 訓練資料，讓模型本身也一起進化。

#### 為什麼重要

Agent 框架設計一直被視為「藝術而非科學」，HarnessX 把它轉成一個可優化的搜尋問題。對平台開發者而言，維護成本可能大幅降低；論文也揭示了「Harness 進化」和「強化學習」在數學上是等價的，提供了新的理論橋樑，讓未來的框架研究有了更紮實的基礎。

### 深入要點

- 架構核心：9 維行為管道（nine-dimension behavior pipeline），Processor 以 pipe 運算子組合，總計 7 大類 Processor
- AEGIS 4 stage pipeline：Digester（壓縮 trace）→ Planner（提修改計畫）→ Evolver（產生候選 Harness）→ Critic（評分篩選）
- 五個 benchmark：ALFWorld、GAIA、WebShop、τ³-Bench、SWE-bench Verified
- 平均提升 **+14.5%**，最高 **+44.0%**（論文數字）⚠️（具體哪個 benchmark 達 +44% 在搜尋結果中未明確拆分）
- GitHub 公開數字：Qwen 9B 在 GAIA 從 33% → 47%（純 Harness 進化），co-evolution 後達 **55.77%**（64% 相對提升）；GPT-5 從 62% → **84%**
- SWE-bench 分模型：Qwen3-235B +19.3%、Qwen3-32B +4.4%、Claude Opus 4.6 +2.6%（模型越強增益越小，符合預期）
- 額外工具：Light-Memory plugin（時間衰減 + 每日壓縮）、IM Gateway（接 Feishu/Slack/Discord/Telegram）、VERL 分散式 RL 整合
- 目前 Beta v0.1.0，Phase 2 規劃 Bayesian optimization；Phase 3-4 為閉環自進化與多模態 memory backend
- Limitation：自動演化需要 compute 預算，小型部署的成本效益未評估；多模態 memory 尚未支援

### Reviewer 一句話評

工程野心十足，Harness 自動進化的想法具說服力——但 +14.5% 是跨 5 個差異極大的 benchmark 的均值，+44.0% 的出處不透明 ⚠️。整體是有料的系統論文，讀者應在自己的目標任務上重現，別直接把論文均值拿去做決策。

### 給你的 take-away

- 你在設計 Agent 執行層的模組化架構 → 讀 Substitution Algebra + Processor 分類那段，可直接借用當自家設計的參考骨架
- 你想說服主管「框架設計比換模型更重要」 → 用 GAIA 33%→47% 的例子：零模型改動，只調框架，準確率提升 14 個百分點

---


## 論文二｜When Should Agent Trust Be Conditional? Characterizing and Attacking Skill-Conditional Reputation in Agent Swarms

**作者**: Yihan Xia, Taotao Wang（深圳大學）　·　**arxiv**: 2606.14200
**連結**: [arxiv](https://arxiv.org/abs/2606.14200) · [alphaxiv](https://www.alphaxiv.org/abs/2606.14200)

### TL;DR

多 Agent 系統裡，給每個 Agent 一個全域信任分（「它平均有多好」）在很多情況下會路由錯誤——但改成技能維度的細分信任，又會在特定條件下被惡意 Agent 劫持，路由失誤率從 0 飆到 0.94。

### Read Priority

📖 略讀
如果你在建多 Agent 協作平台（routing 多個專業 Agent），這篇的相圖分析對你有用；只做單一 Agent 的可跳過。

### 領域背景

越來越多 Agent 平台採用「異質 Agent 池（heterogeneous agent pool）」：針對不同任務類型部署不同專精 Agent，再用 router 派任務給最適合的那個。問題在於：怎麼衡量哪個 Agent「最適合」？現有系統常用全域信任分（像電商賣家評分），但一個擅長寫程式的 Agent 不代表它擅長搜尋資料——全域分把這些差異抹平了，也讓惡意 Agent 有機可乘。

### 中階導讀


#### 問題

在 AppWorld 等現實 benchmark 中，14 個 Agent 在不同任務類型（skill）上的表現差異極大，最適合任務 A 的 Agent 可能是任務 B 的最差選項。全域分會把所有任務都丟給「整體評分最高」的 Agent，浪費其他 Agent 的專項優勢。但要細分到每個 skill 的信任分，資料量又不夠——你要怎麼在資料稀疏時估計每個 Agent 在每個 skill 上的信任度？

#### 方法

論文提出「Skill-Conditional Trust R(i|k)」框架：用 Ising-model 風格的耦合參數 β 從相關技能借用證據（例如 Agent i 在「程式碼除錯」上的表現，幫助估計它在「程式碼重構」上的信任度）。透過相圖分析（phase diagram）繪製出什麼條件下「條件信任 > 全域信任」——需要同時滿足：高異質性、稀疏的每 skill 資料、以及 skill 間相關性夠強。同時也揭露了 β 耦合的雙面性——它是攻擊者的入口。

#### 為什麼重要

這篇提供了在多 Agent 平台中實作「智慧路由」的理論依據和安全警告：告訴你什麼時候值得做 per-skill routing，以及對應的攻擊面是什麼，讓安全設計必須同步考慮。

### 深入要點

- 核心量：R(i|k) = Agent i 在 skill k 上的信任分，透過 Ising 耦合從相關 skill 借用統計證據
- 相圖分析三條件（同時需要）：高 Agent 異質性 + 每 skill 資料稀疏 + skill 間相關性高，才值得啟用條件信任
- 實驗規模：AppWorld benchmark 的 14 個真實 Agent，驗證真實 Agent 池落在「有益區域」內，per-skill 最佳 Agent 確實因 skill 不同而變換
- 安全攻擊：攻擊者用低成本手段在某個 skill 刷高評分，透過 β 耦合滲透到目標 skill，路由 regret 從 0 飆到 **0.94** ⚠️（論文內部測試，非第三方驗證）
- 工具 CIVT（Conditional Information Value Test）：可事前判斷目前 Agent 池是否符合啟用條件信任的條件
- Limitation：模型假設 skill 相關性已知且固定，現實中 skill 邊界模糊；14 個 Agent 規模偏小，結論需更大規模驗證
- 與主流 framework 關聯：LangGraph / AutoGen 的 routing 目前用全域信任或手工規則，本文提供了理論化升級路徑

### Reviewer 一句話評

理論框架清晰，把全域 vs. 條件信任的取捨正式化，對 multi-agent routing 的系統設計有參考價值——但 AppWorld 14 個 Agent 的規模太小，routing regret 0.94 的攻擊結論需要更大規模重現才有說服力 ⚠️。是好的起點，不是定論。

### 給你的 take-away

- 你的平台有多個專精 Agent（寫程式、查資料、QA 各一個）→ 先跑 CIVT 確認你的 Agent 池是否符合「三條件」，再決定要不要實作 per-skill routing；如果條件不符，全域分反而更穩
- 你在設計 Agent 市場或信任評分機制 → β 耦合是雙面刃，採用前必須搭配防刷分的信譽驗證層，否則反而開了後門

---


## 論文三｜OCELOT: Inference-Leakage Budgets for Privacy-Preserving LLM Agents

**作者**: Jin Xie, Songze Li　·　**arxiv**: 2606.12341
**連結**: [arxiv](https://arxiv.org/abs/2606.12341) · [alphaxiv](https://www.alphaxiv.org/abs/2606.12341)

### TL;DR

LLM Agent 在完成任務的過程中，會一點一點把使用者隱私洩漏給外部服務；OCELOT 在 Agent 和外部世界之間加了一個「洩漏預算員」，讓攻擊者從整條 trajectory 中能推斷出的秘密量不超過上限 ε。

### Read Priority

📖 略讀
要部署企業級 Agent（存取個人檔案、交易、CRM）的工程師或 PM 值得一讀；純研究場景的讀者可優先看前兩篇。

### 領域背景

Agent 被賦予越來越多授權：讀 email、存取資料庫、呼叫第三方 API。每次 Agent 把資訊傳出去，都可能洩漏使用者的個人可識別資訊（PII）。現有防護（如資料遮罩、資訊流控制）都是「逐筆檢查單次輸出」——但攻擊者不需要單次取得全部資訊，他們可以從 10 次看似無害的輸出中累積拼湊出完整的秘密。這就是 OCELOT 要解決的「累積推斷洩漏（cumulative inference leakage）」問題。

### 中階導讀


#### 問題

具體例子：Agent 幫你查航班（透露你在哪個城市）、訂餐廳（透露飲食偏好）、查醫療紀錄（透露身份）。每個動作都看似合理，但合謀的服務商可以把這三個資訊組合起來精確定位你——傳統「逐筆過濾」機制完全看不到這種累積模式。

#### 方法

OCELOT 把隱私問題重新定義為「後驗風險控制（posterior-risk control）」：設定預算 ε，限制攻擊者在整條 Agent 任務軌跡（trajectory）結束後，對受保護秘密的猜測精準度最多提升多少——即後驗信念的改善量 ≤ ε。OCELOT 作為 runtime mediator 嵌在 Agent 和外部服務之間，每次輸出前計算這次輸出對預算的消耗，並在接近上限時攔截或模糊化輸出。

#### 為什麼重要

這篇把 Agent 隱私從「靜態合規問題」轉化為「動態預算問題」，更貼近真實的 Agent 行為模式。對要通過 GDPR 或資料保護稽核的企業 Agent 部署，這提供了一個可量化的防護承諾，比「有沒有遮罩 PII」更精確。

### 深入要點

- 三種洩漏模式：累積性（cumulative）、雙向性（bidirectional：惡意輸入可反向操控 Agent 自身推理）、任務依賴性（task-dependent：同一欄位對某些接收方必要，對其他人是多餘的）
- 核心機制：後驗洩漏預算（posterior-leakage budget）ε，控制整條 trajectory 的累積推斷量上限
- 技術上借鑒差分隱私（differential privacy）的 budget 概念，但應用在語義推斷層而非資料庫查詢層
- 現有方案缺口對比：contextual-integrity filters 只看單次輸出；information-flow controls 不管累積推斷；posterior-leakage monitors 只監控不干預——OCELOT 宣稱是第一個在 runtime 同時控制三者的方案
- Limitation：預算 ε 的設定需要領域知識，太嚴會阻礙 Agent 完成任務；計算後驗更新量需要運算資源，對即時 Agent 有延遲影響
- 量化實驗細節（攔截率、任務完成率 trade-off）在公開搜尋結果中未找到具體數字 ⚠️，建議讀者查閱論文原文

### Reviewer 一句話評

問題定義很扎實，把累積推斷洩漏正式化是真正的貢獻——但從可取得的資訊來看，論文缺乏公開的量化實驗數字（如攔截率、任務成功率的 trade-off），讓人無法評估預算機制在現實 Agent 任務中的可行性 ⚠️。讀者應帶批判眼光，直接查原文數據。

### 給你的 take-away

- 你在設計存取使用者個人資料的 Agent（email、CRM、健康資料）→ 用 OCELOT 的「三種洩漏模式」框架審視你現有的隱私防護層，確認有沒有累積推斷的盲點——這個框架本身就是一個很好的風險評估 checklist
- 你在規劃企業 Agent 的資安架構 → 把「後驗洩漏預算」加進風險模型，這個語言比「有沒有遮罩 PII」更精確，更容易跟法務/合規團隊溝通


## 參考資料

- [arxiv:2606.14249](https://arxiv.org/abs/2606.14249)
- [arxiv:2606.14200](https://arxiv.org/abs/2606.14200)
- [arxiv:2606.12341](https://arxiv.org/abs/2606.12341)
