---
title: "融資速報｜Callosum $100M 種子輪"
date: 2026-08-21
category: daily
tags: [ai-agent, funding, daily, callosum, agent-deployment]
lang: zh-TW
description: "倫敦異質運算新創 Callosum 完成 $100M 種子輪，Atomico 領投，把 Agent workload 拆解後分派到最適合的模型與晶片"
tldr: "Callosum 完成 $100M 種子輪，由 Atomico 領投，估值未揭露。這筆錢押的是「Agent 的成本瓶頸不在模型，而在把每一步都塞進同一顆 GPU」——當推論支出吃掉 AI 原生公司一半以上營收，路由層的價值開始從模型選擇擴張到晶片選擇。"
series:
  name: "AI Agent Funding"
  order: 7
---

> 🌏 [English version](/en/posts/daily/2026-08-21-funding-callosum-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Callosum（英國，倫敦） |
| 輪次 | 種子輪（Seed） |
| 金額 | $100M（約 €85.4M） |
| 領投 | Atomico |
| 跟投 | Plural、DCVC、UK Sovereign AI Fund，以及未具名投資人與天使 |
| 估值 | 未揭露 |
| 累計融資 | 約 $110M（2026 年 2 月 pre-seed $10.25M 由 Plural 領投） |
| 成立年份 | 2025 |
| 員工數 | ~18 人（LinkedIn） |

## 這家公司做什麼

Callosum 是做「異質運算編排層」的公司——它坐在 AI 應用和底層算力之間，把一個 workload 拆成多個子任務，再把每個子任務分派到最適合它的模型與晶片組合。

技術主張叫 programmable heterogeneity：同一個 agentic workflow 裡，「快速比對」這一步和「深度推理」這一步對硬體的需求完全不同，但現行做法是整條流程都跑在同一批通用 GPU 上。Callosum 的軟體會依成本、能耗、速度的約束條件即時分派，並持續 profiling 模型與硬體的組合，讓系統維持在成本／速度／效能的 Pareto frontier 上。隨融資同步推出的第一個產品 Tailored Inference 是一組 API，讓開發者不改寫應用就能接上前沿 AI 硬體，官方描述包含任務拆解、持續性 multi-agent 協作與主權部署能力。

創辦人 Danyal Akarca 與 Jascha Achterberg 在劍橋讀博時相識，研究主題是大腦如何靠組合多種專門化迴路（而非放大單一迴路）達成智能，兩人合計發表逾 70 篇論文。公司 2026 年 4 月成為英國 £500M 主權 AI 基金（Sovereign AI Fund）投資的第一家公司，也是英國先進研究機構 ARIA 旗下 Scaling Inference Lab 的創始成員。矽晶合作夥伴包括 Cerebras、Rebellions、Axelera、d-Matrix、Lumai、Tendrils，基礎設施夥伴為 Supermicro 與 HPE。

## 這筆融資的信號

### 對 Agent 生態的意義

$100M 種子輪在歐洲創投史上屬於最大的幾筆之一，而它的用途不是訓練模型，是解決「跑模型」的單位經濟。Atomico 的論述直白：產業支出正從訓練轉向推論，AI 原生公司常把一半以上的營收花在推論上，而每個 workload 不論性質都被推進同一種通用硬體。對 Agent 開發者來說這是切身問題——一個多步驟 agent run 裡真正需要前沿模型的可能只有兩三步，其餘的規劃、檢索、驗證、格式化都在為不需要的算力付錢。

值得注意的是 Callosum 押的方向和「單一晶片贏家」相反：hyperscaler 自研矽晶、wafer-scale 與光學處理器陸續進入量產，晶片世界正在碎片化，而它把碎片化本身當成商業機會——每多一種晶片進入市場，這一層的價值就增加而非變複雜。這筆錢會用來擴張矽晶與算力夥伴網路，把自己做成「全球異質整合商」。

### 投資人在賭什麼

Atomico CEO Niklas Zennström 的說法是：當 AI 從訓練走向推論，問題已經不只是誰做出最好的模型，而是怎麼在日益多樣的模型與晶片版圖上有效率地交付智能。這個論述背後還有一層地緣考量——Atomico 明講當 workload 能在多模型多晶片間流動，就沒有單一供應商能掐住任何人取得智能的咽喉；英國 AI 部長 Kanishka Narayan 也把這筆投資連結到國家晶片策略，強調成敗不只取決於拿不拿得到晶片，還取決於用得多有效率。UK Sovereign AI Fund 選它當第一家投資標的，賭的與其說是一家公司，不如說是「不被單一供應商鎖死」這件事本身值多少錢。

### 值得觀察的數字

- 官方公布的 agentic 成效：在金融服務的複雜 agentic workload 上，透過與 Cerebras 的合作，Callosum 平台比「單一前沿模型跑在傳統基礎設施上」快 4 倍、運算成本降 70%、任務成功率提升 10%。⚠️ 需注意 Tech Funding News 引述的版本是「準確度 2 倍、速度 7 倍、成本 4 倍便宜」，兩組數字對不上，且公司未公開完整 benchmark 方法。
- 公司自家技術部落格的對照更具體：在 OOLONG 資料集上，Cerebras Llama-70B 作為 recursive language model 能在同等準確度下比 GPT-5 快 5.5 倍、成本低 4.8 倍；SambaNova Llama-70B 則是成本低 8.8 倍。這些是單點配置數字，不是端到端產品指標。
- 估值倍數無法計算：公司未揭露估值也未公布營收，$100M 種子輪目前只能靠「pre-seed 到 seed 六個月內從 $10.25M 跳到 $100M、將近 10 倍」這個募資規模跳幅來推測市場熱度。
- 18 人團隊拿 $100M，人均超過 $5.5M，即使在 2026 年的 AI 融資環境裡也偏極端。

## Watchlist 狀態

Callosum 尚未在 watchlist 中。建議加入 section A4（Gateway / 模型路由），與 LiteLLM、Portkey、OpenRouter、Martian 同組追蹤，追蹤重點：把路由維度從「選模型」擴張到「選模型＋選晶片」，$100M 種子輪，Atomico 領投；同時與 section A3（推理基礎設施）交叉參考，因為它的護城河宣稱建立在 kernel 層與矽晶夥伴網路，而非純軟體路由。

## 今日收穫

過去看 gateway 類產品，預設它們的價值上限是「幫你在幾個 API 供應商之間省錢」——一層薄薄的中介，遲早被模型商自己吃掉。Callosum 的主張把這條線往下拉到 kernel 與矽晶：如果路由決策必須同時懂 workflow 的任務圖、模型的能力邊界、以及每顆晶片的計算輪廓，那這一層就不是薄的，而且晶片世界越碎片化它越厚。差別在於「省錢」是可被壓縮的服務，「跨異質硬體維持 Pareto frontier」是會隨市場複雜度增值的資產。

## 參考資料

- [Our investment in Callosum: building the layer that makes AI compute work](https://atomico.com/insights/our-investment-in-callosum-building-the-layer-that-makes-ai-compute-work) — Atomico（領投方官方公告）
- [London-based Callosum raises €85.4 million in Atomico-led Seed round to unify AI models and chips](https://www.eu-startups.com/2026/08/london-based-callosum-raises-e85-4-million-in-atomico-led-seed-round-to-unify-ai-models-and-chips/) — EU-Startups
- [Callosum raises $100M led by Atomico in one of Europe's largest seed rounds](https://techfundingnews.com/callosum-raises-100m-europe-largest-seed-round/) — Tech Funding News
- [Callosum Raises $100M in Seed Funding](https://www.finsmes.com/2026/08/callosum-raises-100m-in-seed-funding.html) — FinSMEs
- [Welcome, Heterogeneous Intelligence](https://www.callosum.com/blog/welcome-heterogeneous-intelligence) — Callosum 官方技術部落格
