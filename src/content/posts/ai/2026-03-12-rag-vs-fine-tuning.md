---
title: "RAG vs Fine-tuning：不是非此即彼"
date: 2026-03-12
updated: 2026-08-19
type: deep-dive
category: ai
tags: [rag, fine-tuning, llm, architecture, comparison]
lang: zh-TW
tldr: "RAG 和 Fine-tuning 解決的是不同問題。RAG 給模型新知識，Fine-tuning 改變模型的行為風格。大多數情況是兩者都用，而不是選一個。"
description: "RAG 和 Fine-tuning 的根本差異、各自適合的使用場景、成本對比，以及如何組合兩者發揮最大效益。"
draft: false
series:
  name: "RAG 技法大全"
  order: 3
---

「應該用 RAG 還是 Fine-tuning？」是 LLM 應用開發中最常見的問題之一。答案是：**這是兩個不同問題的解法，通常需要同時用。**

## 根本差異

**RAG 解決的問題**：給模型它不知道的知識。

LLM 的訓練資料有截止日期，也沒有你的私有資料（公司內部文件、特定社群的資訊）。RAG 在推理時把相關文件塞進 context，讓模型能「看到」這些知識。

**Fine-tuning 解決的問題**：改變模型的行為、風格、能力。

Fine-tuning 通過在特定資料上繼續訓練，讓模型學習：
- 特定的回答格式（如：總是用條列式、總是以「好的」開頭）
- 特定領域的推理方式（如：醫療診斷邏輯）
- 特定的語氣和風格（如：更像某個品牌的語氣）
- 更好地執行特定任務（如：更準確地提取結構化資訊）

Fine-tuning **不適合**：
- 注入新知識（模型會「記住」知識，但不可靠，容易幻覺）
- 讓模型知道今天的新聞（需要持續重新訓練）
- 讓模型記住特定文件的內容（RAG 更合適）

**這個結論後來被修正得更精確。** 早期「fine-tuning 學不會新知識」的證據，主要來自比較「非監督式的持續預訓練（continual pretraining）」和 RAG。2026 年一份針對 multi-hop QA 的系統性比較把三種做法分開評測，結論細緻很多：

- **非監督式 fine-tuning（持續預訓練）**：相對於 base model 只有很小的提升，單靠繼續餵語料並不足以改善多跳推理的正確率
- **RAG**：提升幅度大且穩定，特別是在問題需要「訓練截止之後才發生的事」時
- **監督式 fine-tuning（SFT）**：整體正確率反而是三者中最高的

所以更準確的說法不是「fine-tuning 學不會知識」，而是：**SFT 教的是怎麼組合與運用知識，RAG 提供的是模型手上沒有的那份知識**。當答案依賴時間上全新的資訊時，再多的訓練也補不上——那是 RAG 的位置。

## 成本比較

| | RAG | Fine-tuning |
|---|-----|------------|
| 初始成本 | 中（建索引） | 高（訓練費用） |
| 更新成本 | 低（更新索引） | 高（重新訓練） |
| 推理成本 | 中（context 較長） | 低（不需要額外 context） |
| 延遲 | 較高（搜尋時間） | 較低 |
| 知識更新頻率 | 即時 | 慢（需重新訓練） |
| 知識可解釋性 | 高（知道來源） | 低（黑盒） |

表格裡的「推理成本」需要一點但書：主流 API 供應商都提供 prompt caching，RAG 那種「system prompt + 大段固定 context」的形態剛好很吃得到快取紅利，重複查詢的實際成本會比帳面低不少。真正的差距請用自己的流量測，不要照抄別人的比例（[Anthropic prompt caching 文件](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)）。

## 還有第三個選項：直接用長 context

「RAG 還是 fine-tuning」這個問法本身，在 context window 變長之後就少了一個選項：如果資料量不大，其實可以整包塞進 prompt，不做檢索也不做訓練。

這條路值不值得走，答案是「看情況」，而且是真的看情況。LaRA 這個專門設計來比較 RAG 與長 context（LC）的 benchmark，橫跨 2326 個測試案例、四類 QA 任務與三種長文本，結論標題直接寫了 *No Silver Bullet*：最佳選擇取決於模型參數量、模型本身的長文本能力、context 長度、任務類型，以及檢索出來的 chunk 長什麼樣子——沒有一條規則能一路通吃。

實務上的判準大致是：

- 語料小、查詢要通盤理解整份文件（摘要、跨段落比對）→ 長 context 通常比較省事
- 語料大、要精確定位、要能指出出處、要控制成本 → RAG
- 兩者都不是免費的：長 context 每次查詢都要付整份文件的 token，RAG 則要付索引維護和檢索錯誤的代價

## 攀岩場景的判斷

**應該用 RAG 的部分**：
- 路線資訊（名稱、難度、描述）：資料持續更新，需要精確來源
- 攀登記錄查詢：使用者私有資料，不能預訓練進模型
- 岩場最新狀況：可能每週更新，RAG 即時反映

**應該用 Fine-tuning 的部分**：
- 回答風格：讓模型更像「攀岩社群的語氣」，不那麼制式
- 攀岩術語理解：讓模型更準確地理解繁體中文攀岩術語
- 格式一致性：讓路線推薦總是按固定格式輸出

**兩者都用的部分**：
- Fine-tuning 讓模型理解攀岩領域的語境和術語
- RAG 提供最新的路線和社群資料
- 組合效果 > 單獨任何一個

## 組合策略

最常見的組合模式：

```
[Fine-tuned 模型]
  → 懂攀岩術語
  → 有合適的回答風格
  → 知道如何處理路線推薦

       +

[RAG 系統]
  → 提供具體的路線資訊
  → 提供最新的岩場狀況
  → 提供使用者的個人記錄
```

Fine-tuning 提升模型的「基礎能力」，RAG 提供「當前知識」。

## 什麼時候先考慮 RAG

大多數應用應該先嘗試 RAG，原因：

1. **更快迭代**：更新索引比重新訓練快太多
2. **更透明**：能追蹤回答的知識來源
3. **更低成本**：Fine-tuning 需要收集和標記訓練資料
4. **夠用**：對「知識類」問題，RAG 的效果通常已經足夠

Fine-tuning 值得投入的情況：
- RAG 回答品質已經不錯，但風格/格式還不對
- 有足夠的標記資料（幾百到幾千個高品質 Q&A pair）
- 有固定的推理模式需要強化（不只是知識，而是推理邏輯）

## 一個常見的誤解

「Fine-tuning 讓模型記住知識，就不需要 RAG 了。」

這是最常見的誤解。Fine-tuning 讓模型「感覺上」知道某些事，但在知識密集的場景（需要精確的數字、名稱、最新資訊），Fine-tuning 的「記憶」是不可靠的，容易出現幻覺。RAG 的設計本質上更適合知識的注入和更新。

反過來說，也不要以為「有了 RAG 知識就會自動保持正確」。2026 年一份以真實世界時序事件建的 benchmark，專門測「知識持續漂移」下的模型適應能力，結果是持續 fine-tuning、knowledge editing、以及**單純的 RAG** 三者都撐不住：前者出現災難性遺忘，後者則出現時序上前後矛盾的推理——檢索回來的多份證據分屬不同時間點，模型不會自己排時間軸。要處理這種場景，索引裡得帶時間戳、檢索時得能區分「現在成立」和「當時成立」，這些是 RAG 系統要自己補的工程，不會白送。

## 整體來說

RAG 和 Fine-tuning 是互補的工具，不是競爭關係。RAG 是「知識的延伸」，Fine-tuning 是「能力的塑造」。一個高品質的 LLM 應用，通常需要用基礎能力強的模型（或 fine-tuned 的模型），加上精心設計的 RAG 系統，而不是只選其中一個。

---

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [RAG vs Fine-tuning: Pipelines, Tradeoffs, and a Case Study on Agriculture (2024)](https://arxiv.org/abs/2401.08406)
- [Fine Tuning vs. Retrieval Augmented Generation for Less Popular Knowledge (2024)](https://arxiv.org/abs/2403.01432)
- [Fine-Tuning or Retrieval? Comparing Knowledge Injection in LLMs (2023)](https://arxiv.org/abs/2312.05934)
- [Retrieval-Augmented Generation for Large Language Models: A Survey (2023)](https://arxiv.org/abs/2312.10997)
- [Fine-Tuning vs. RAG for Multi-Hop Question Answering with Novel Knowledge (2026)](https://arxiv.org/abs/2601.07054)
- [LaRA: Benchmarking Retrieval-Augmented Generation and Long-Context LLMs — No Silver Bullet for LC or RAG Routing (2025)](https://arxiv.org/abs/2502.09977)
- [RAG or Learning? Understanding the Limits of LLM Adaptation under Continuous Knowledge Drift in the Real World (2026)](https://arxiv.org/abs/2604.05096)
- [NobodyClimb 系統架構：Cloudflare 全端攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI 架構：20 節點 RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
