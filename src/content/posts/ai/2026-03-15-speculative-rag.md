---
title: "Speculative RAG：用小模型平行打草稿，大模型一次驗證"
date: 2026-03-15
updated: 2026-08-19
type: guide
category: ai
tags: [rag, speculative-rag, dual-model, latency-optimization, accuracy]
lang: zh-TW
tldr: "Speculative RAG 用小型專家模型從不同文件子集平行生成多個答案草稿，再由大型模型一次驗證選出最佳答案。論文在 PubHealth 上準確度提升 12.97 個百分點、延遲降低 50.83%——但這是最好的那一格，其他 benchmark 的幅度小很多。"
description: "Speculative RAG 的雙模型架構設計：RAG Drafter 平行生成草稿、RAG Verifier 單次驗證，以及與標準 RAG 的效能比較和實作指南。"
draft: false
series:
  name: "RAG 技法大全"
  order: 27
---

標準 RAG 的流程大家都熟：檢索文件 → 拼成 context → 送給 LLM 生成。這個流程簡單有效，但有一個根本性的瓶頸：**所有文件塞進同一次 LLM 呼叫，模型必須在一次生成中處理所有資訊，而且整個流程是序列的**。

文件越多，context 越長，延遲越高，而且模型在超長 context 中容易「迷路」——重要資訊被淹沒在大量文字裡。這就是 Speculative RAG 要解決的問題。

## 標準 RAG 的三個瓶頸

### 1. 序列處理的延遲問題

標準 RAG 是嚴格的序列流程：

```
Query → Retrieve → [所有文件拼接] → LLM 生成 → 回答
                                      ↑
                              單次呼叫，等很久
```

文件檢索可能快（毫秒級），但 LLM 生成是整個 pipeline 的瓶頸。Context 越長，生成時間越長。10 篇文件拼起來可能有 8,000 tokens，大型模型處理這個長度需要顯著的時間。

### 2. 長 context 的注意力稀釋

把所有檢索到的文件塞進同一個 prompt，模型需要同時處理多份可能互相矛盾的資訊。研究一再表明，LLM 在超長 context 中有「lost in the middle」問題：頭尾的資訊被記住，中間的被忽略。

如果最相關的文件剛好排在中間位置，模型可能根本沒充分利用它。

### 3. 單次生成的賭注

標準 RAG 只生成一次答案。如果這次生成的方向偏了——選錯了文件中的資訊、推理鏈走歪了——就沒有修正的機會。除非加上 Agentic RAG 的迴圈重試機制，但那又帶來更多延遲。

Speculative RAG 的核心洞察：**與其讓一個大模型苦苦處理所有文件，不如讓多個小模型各自處理一小份文件，再讓大模型從多個候選答案中選最好的**。

## Speculative RAG 架構

這個名字借用了 Speculative Decoding 的概念：用小模型做「猜測」，用大模型做「驗證」。

### 整體流程

```
                          ┌─────────────────┐
                          │     Query        │
                          └────────┬────────┘
                                   │
                          ┌────────▼────────┐
                          │    Retriever     │
                          │  (取回 N 篇文件)  │
                          └────────┬────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
              ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐
              │ Subset 1  │ │ Subset 2  │ │ Subset 3  │
              │ {D1, D3}  │ │ {D2, D5}  │ │ {D1, D4}  │
              └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
                    │              │              │
              ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐
              │  Drafter   │ │  Drafter   │ │  Drafter   │
              │  (小模型)   │ │  (小模型)   │ │  (小模型)   │
              │  Draft 1   │ │  Draft 2   │ │  Draft 3   │
              │+ Rationale │ │+ Rationale │ │+ Rationale │
              └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
                    │              │              │
                    │      ┌──────┴──────┐       │
                    └──────►             ◄───────┘
                           │  Verifier   │
                           │  (大模型)    │
                           │  評分 + 選擇  │
                           └──────┬──────┘
                                  │
                          ┌───────▼───────┐
                          │  最佳答案輸出   │
                          └───────────────┘
```

三個關鍵步驟：

1. **文件分組**：把檢索到的 N 篇文件依「與問題的關係」分群，再從每群各抽一篇組成子集，共 K 個子集（細節見下面〈子集抽樣策略〉——這一步不是隨機抽）
2. **平行草稿生成**：K 個小型 RAG Drafter 模型平行處理各自的文件子集，各自生成一份答案草稿和推理過程
3. **單次驗證**：一個大型 RAG Verifier 模型接收所有草稿，一次性評分並選出最佳答案

### 為什麼這樣更快？

關鍵在於**平行化**。三個小模型同時跑，每個只需要處理 2-3 篇文件（短 context），生成速度快。大模型只需要看幾份草稿（而不是所有原始文件），context 也短，驗證速度也快。

整體延遲 ≈ max(Drafter 延遲) + Verifier 延遲

相比標準 RAG：

整體延遲 ≈ 大模型處理全部文件的延遲

前者通常顯著更短，因為小模型快、context 短、平行執行。

## RAG Drafter 設計

RAG Drafter 是整個架構的「勞動力」——小型、專精、可平行。

### 模型選擇

論文中使用 Mistral-7B（v0.1）作為 Drafter 的 base model，再針對 RAG 任務做指令微調（附錄還試過 instruction-tuned Gemma-2 2B，效果同樣看好）。選擇小模型的理由：

- **推理速度快**：7B 參數的模型在 GPU 上推理延遲遠低於 70B+ 的大模型
- **可平行部署**：同樣的 GPU 記憶體可以跑多個小模型實例
- **任務專精**：Drafter 不需要廣泛的世界知識，只需要從給定文件中提取和組織資訊

### 每個 Drafter 看不同的文件子集

這是 Speculative RAG 最巧妙的設計。假設檢索器取回了 6 篇文件 {D1, D2, D3, D4, D5, D6}，先依觀點分群，再從每群各抽一篇組成多個子集：

```
Drafter 1 收到：{D1, D3, D5}
Drafter 2 收到：{D2, D4, D6}
Drafter 3 收到：{D1, D2, D4}
Drafter 4 收到：{D3, D5, D6}
```

每個 Drafter 只看部分文件，這帶來幾個好處：

1. **每個 Drafter 的 context 短**：3 篇文件 vs 6 篇文件，注意力更集中
2. **不同子集帶來多樣性**：不同文件組合可能引導出不同的答案角度
3. **冗餘容錯**：即使某個子集的文件品質差，其他子集仍可能包含正確答案所需的資訊

### 子集抽樣策略

這裡有一個很多二手介紹會講錯的細節：**論文的子集不是隨機抽的**。

正確的做法是先把檢索到的文件依照「與問題的關係」做分群（clustering），每個群代表檢索結果中的一個觀點，然後**從每個群各抽一篇**組成子集。目的是最小化冗餘、最大化觀點多樣性。論文的消融實驗直接測過：從同一個群裡抽樣會顯著劣化，因為子集裡的文件觀點重複，草稿就失去了多樣性。

子集大小是超參數。太小（1 篇）可能資訊不足；太大（接近 N 篇）就失去了分散處理的優勢。論文的主要設定是：TriviaQA / PopQA / PubHealth / ARC-Challenge 檢索 top-10，每題生成 5 份草稿（m=5），每份用 2 篇文件（k=2）；MuSiQue 因為推理更複雜，檢索 top-15、生成 10 份草稿、每份用 6 篇文件。

另外兩個實用結論來自論文的超參數分析：**增加草稿數量能持續提升表現，而且因為草稿是平行生成的，不增加延遲**；但**增加每份草稿的文件數並不總是更好**——在 TriviaQA 與 PubHealth 上，從 1、2、4、6 到 10 篇的曲線並非單調上升。

### Rationale 生成

每個 Drafter 不只生成答案，還要生成 **rationale**（推理過程）。Drafter 的輸出格式：

```
Draft: [答案內容]
Rationale: [為什麼從這些文件得出這個答案的推理過程]
```

Rationale 的作用是給 Verifier 提供判斷依據。Verifier 不只看答案對不對，還看推理過程合不合理。一個答案可能碰巧正確但推理有漏洞，另一個答案可能不太完整但推理鏈條嚴密——Verifier 可以據此做更好的判斷。

### Drafter 的訓練

論文中的 Drafter 使用知識蒸餾（Knowledge Distillation）方式訓練：

1. 從 Open-Instruct 與知識密集型資料集取樣指令對，用 dense retriever 補上最多 10 篇檢索文件，再用大型模型生成 rationale——論文主線用的是 Gemini-Ultra，總共 40k 筆訓練資料
2. 用這些資料微調 Mistral-7B（v0.1）
3. 微調後的小模型學會了「看文件 → 寫草稿 + 推理」的能力

論文另外用 GPT-4o 重做了一次資料生成，結果顯示 Speculative RAG 的優勢仍在，代表這個方法不綁定特定的教師模型。消融實驗也確認：**訓練時如果拿掉 rationale，三個 benchmark 上表現都明顯下滑**——rationale 不是裝飾，是驗證階段的關鍵輸入。

這種訓練方式讓 7B 的小模型在特定任務上接近大模型的品質，但保持小模型的速度優勢。代價是你得自己做一輪蒸餾與微調——這是 Speculative RAG 最大的落地門檻，不是架構本身。

## RAG Verifier 設計

RAG Verifier 是架構中的「裁判」——大型、通用、一次定勝負。

### 模型選擇

這裡也是常被寫錯的地方：**論文的 Verifier 不是 GPT-4**。實驗中用的是未經任何微調的 Mistral-7B（v0.1）或 Mixtral-8x7B（v0.1），論文中記為 M<sub>Verifier-7B</sub> 與 M<sub>Verifier-8x7B</sub>。GPT-4o 與 Gemini-Ultra 只出現在「產生 Drafter 訓練資料」那一步，不在推論路徑上。

這其實是這篇論文更有意思的地方：Verifier 大到 8x7B 就夠了，甚至 7B 的 Verifier 配 7B 的 Drafter 也已經超越所有 baseline。「大模型」在這裡是相對的。

選擇（相對）大模型作為 Verifier 的理由：

- **廣泛的世界知識**：可以交叉驗證草稿的準確性
- **強大的推理能力**：可以評估推理鏈的邏輯一致性
- **比較判斷能力**：同時看多個候選答案，選出最好的

### 驗證流程

Verifier 收到的輸入：

```
Query: [原始問題]

Draft 1:
Answer: [草稿 1 的答案]
Rationale: [草稿 1 的推理過程]

Draft 2:
Answer: [草稿 2 的答案]
Rationale: [草稿 2 的推理過程]

Draft 3:
Answer: [草稿 3 的答案]
Rationale: [草稿 3 的推理過程]

Please evaluate each draft and select the best answer.
```

注意 Verifier **不看原始文件**。它只看 Drafter 的草稿和推理過程。這是刻意的設計：

1. **Context 更短**：3 份草稿遠比 6 篇原始文件短
2. **資訊已預處理**：Drafter 已經從原始文件中提取了相關資訊
3. **聚焦比較**：Verifier 的任務是比較和判斷，不是從頭提取資訊

### 評分機制

論文的評分**不是叫 Verifier 寫一段評語打分數**，而是直接讀模型的條件機率。整體信心分數是三項的乘積：

1. **ρ<sub>Draft</sub>**：Drafter 自己生成該草稿的機率
2. **ρ<sub>Self-contain</sub>**：Verifier 在給定問題與 rationale 下，生成該答案的機率，即 Score(α | Q, β)
3. **ρ<sub>Self-reflect</sub>**：Verifier 對一句自省敘述回答「Yes」的機率

消融實驗顯示三項都有貢獻：拿掉 ρ<sub>Draft</sub> 影響最小（TriviaQA −0.19、PubHealth −1.12），拿掉 ρ<sub>Self-contain</sub> 或 ρ<sub>Self-reflect</sub> 則各約掉 2 個百分點（TriviaQA）與 0.8 個百分點（PubHealth）。而**完全不驗證、隨機挑一份草稿**會掉 5.69（TriviaQA）與 5.37（PubHealth）——驗證這一步的價值就在這個差距裡。

用機率而不是叫模型打分，好處是不需要對 Verifier 做任何微調，也不需要它輸出結構化的評分格式；壞處是你的推論端必須拿得到 logprobs，這在只給文字輸出的 API 上做不到。

### 為什麼 Verifier 不需要看原始文件？

這是一個違反直覺的設計選擇。我們可能會想：Verifier 不看原始文件，怎麼判斷草稿是否準確？

答案是：**Verifier 依靠的是大模型自身的世界知識和推理能力**。

- 如果一個草稿聲稱「台灣最高的山是玉山，海拔 3,952 公尺」，Verifier 的大模型本身就知道這是否正確
- 如果一個草稿的推理有邏輯矛盾（前面說 A，後面推出 not A），Verifier 可以靠推理能力發現
- 如果多個草稿給出不同答案，Verifier 可以透過交叉比對來判斷哪個更可信

這種設計讓 Verifier 的 context window 保持簡短，進一步降低延遲。

## 效能數據

論文在五個 benchmark 上測試了 Speculative RAG，與標準 RAG 和其他方法比較。以下是**論文 Table 1 的實際數字**（accuracy %，來源見文末參考資料）。

### 準確度比較

| RAG 方法 | TriviaQA | MuSiQue | PopQA | PubHealth | ARC-C |
|---|---|---|---|---|---|
| Standard RAG — Mistral-7B | 54.15 | 16.71 | 31.38 | 34.85 | 42.75 |
| Standard RAG — Mixtral-8x7B | 59.85 | 19.16 | 34.02 | 37.08 | 48.72 |
| Standard RAG — Mistral-Instruct-7B | 67.11 | 17.99 | 42.17 | 42.15 | 47.70 |
| Standard RAG — Mixtral-Instruct-8x7B | 73.91 | 29.42 | 53.68 | 63.63 | 78.41 |
| CRAG (Mistral-7B) | 59.03 | — | 49.46 | 59.04 | 74.87 |
| Self-RAG (Mistral-7B) | 64.84 | 21.72 | 52.68 | 72.44 | 74.91 |
| Self-CRAG (Mistral-7B) | 65.43 | — | 56.11 | 72.85 | 75.26 |
| **Spec. RAG — Verifier-7B + Drafter-7B** | 73.91 | 31.03 | 56.75 | 75.79 | 76.19 |
| **Spec. RAG — Verifier-8x7B + Drafter-7B** | **74.24** | **31.57** | **57.54** | **76.60** | **80.55** |

幾個觀察：

- **PubHealth 提升最大**：76.60 vs 最強 Standard RAG baseline 的 63.63，差 12.97 個百分點——這就是摘要裡那個「最高 12.97%」的來源。它是 PubHealth，不是 PopQA；很多二手介紹會把這個數字掛錯 benchmark。
- **TriviaQA 幾乎沒有提升**：74.24 vs Mixtral-Instruct-8x7B 的 73.91，只差 0.33。也就是說當 baseline 本來就強、任務又不特別需要多視角時，這套架構的準確度紅利接近於零，剩下的價值主要在延遲。
- **MuSiQue（多跳推理）提升約 2 個百分點**：31.57 vs 29.42。有效但不驚人；注意 MuSiQue 用的是不同的超參數（10 份草稿、每份 6 篇文件）。
- **超越 Self-RAG 與 CRAG**：在有回報數字的欄位上都優於這兩個方法。

要留意兩件事：（1）表中所有方法都跑在同一組 Mistral 系列 backbone 上以求公平，換成別的模型結果未必平移；（2）論文自己也指出，**Drafter 單獨使用（不經驗證）就已經打敗多數 baseline**，驗證階段的邊際貢獻約落在 0.3～4 個百分點之間。

### 延遲比較

論文的延遲分析是隨機抽 100 題、不做 batching、逐題計時，並以**最強的 baseline（Standard RAG: Mixtral-Instruct-8x7B）**為比較對象。實際降幅：

| Benchmark | 延遲降低 |
|---|---|
| TriviaQA | −11.90% |
| MuSiQue | −15.07% |
| PopQA | −44.31% |
| PubHealth | −50.83% |
| ARC-Challenge | −22.77% |

換句話說，「延遲降低 50%」是 PubHealth 那一格的數字，不是通例——TriviaQA 只降了不到 12%。降幅大小主要取決於該資料集的檢索文件有多長：文件越長，Standard RAG 被長 context 拖累得越嚴重，Speculative RAG 的相對優勢越大。

另外要注意這個實驗的硬體前提：Speculative RAG 在 TriviaQA 等資料集上**同時啟動 5 個 Drafter endpoint**（MuSiQue 是 10 個），Mixtral-8x7B 用 tensor parallelism = 4。沒有這種平行資源，下面的數字不會重現。

延遲降低的來源：

1. **Drafter 平行執行**：多個小模型同時跑，總延遲取決於最慢的那個（而非加總）
2. **Context 更短**：每個 Drafter 只處理 2-3 篇文件，Verifier 只處理幾份草稿
3. **大模型呼叫次數減少**：標準 RAG 讓大模型處理所有文件，Speculative RAG 只讓大模型做驗證（context 更短）

### 準確度 vs 延遲的帕累托改善

這是 Speculative RAG 最強的地方：**它同時改善了準確度和延遲**。

通常我們面臨的取捨是：

- 想要更準確？用更大的模型、處理更多文件 → 延遲更高
- 想要更快？用更小的模型、處理更少文件 → 準確度下降

Speculative RAG 在論文的設定下同時改善了這兩個維度，靠的是架構設計而非單純堆硬體。

不過「帕累托改善」這個說法要打個折：從上面的實際數字看，準確度紅利集中在 PubHealth、PopQA、ARC-C，TriviaQA 幾乎沒有；延遲紅利則集中在檢索文件較長的資料集。而且它並不是免費的——你需要（a）一輪蒸餾微調來做出 Drafter，（b）能同時跑 5～10 個 Drafter 實例的推論資源，（c）拿得到 logprobs 的 Verifier。把這些成本算進去，它比較像「用工程複雜度換延遲與部分準確度」，而不是純粹的白吃午餐。

## 與其他 RAG 模式比較

### vs Standard RAG

```
Standard RAG:
  Query → Retrieve ALL docs → [Big Model] → Answer
  延遲：高（大模型處理長 context）
  準確度：中（注意力稀釋）

Speculative RAG:
  Query → Retrieve docs → Split into subsets
        → [Small Model 1] → Draft 1 ─┐
        → [Small Model 2] → Draft 2 ──┤→ [Big Model] → Best Answer
        → [Small Model 3] → Draft 3 ─┘
  延遲：低（平行 + 短 context）
  準確度：高（多角度 + 驗證）
```

核心差異：Standard RAG 是「一個模型做所有事」，Speculative RAG 是「分工合作」。

### vs Self-RAG

Self-RAG 讓模型在生成過程中自我反思，決定是否需要更多檢索。它的問題：

1. **序列反思**：反思-檢索-再生成 是序列流程，每次反思都增加延遲
2. **同一模型身兼多職**：同一個模型既要生成又要反思，任務衝突
3. **單一視角**：始終從同樣的文件集合出發

Speculative RAG 的優勢：

1. **平行而非序列**：多個 Drafter 同時工作
2. **專職分工**：Drafter 專注生成，Verifier 專注驗證
3. **多樣化視角**：不同文件子集帶來不同角度

| 維度 | Self-RAG | Speculative RAG |
|------|---------|-----------------|
| 架構 | 單模型 + 反思 token | 雙模型（Drafter + Verifier） |
| 執行方式 | 序列（生成→反思→再生成） | 平行（多 Drafter）+ 一次驗證 |
| 延遲 | 高（多輪迭代） | 低（平行 + 短 context） |
| 多樣性 | 低（同一視角反思） | 高（不同文件子集） |
| 訓練成本 | 需要特殊 token 訓練 | 需要 Drafter 蒸餾訓練 |

### vs CRAG（Corrective RAG）

CRAG 的核心是「檢索品質檢測 + 修正」：如果檢索結果不好，就修正查詢重新檢索。

兩者解決的問題不同：

- **CRAG 解決的是「檢索品質差」的問題**：檢索到的文件不相關，需要修正查詢
- **Speculative RAG 解決的是「生成品質差」的問題**：文件已經檢索到了，問題在於如何更好地利用它們

它們其實是互補的。你可以先用 CRAG 確保檢索品質，再用 Speculative RAG 確保生成品質：

```
Query → CRAG（確保檢索品質）→ Speculative RAG（確保生成品質）→ Answer
```

| 維度 | CRAG | Speculative RAG |
|------|------|-----------------|
| 目標 | 改善檢索品質 | 改善生成品質 |
| 修正對象 | 查詢 / 檢索結果 | 答案草稿 |
| 額外成本 | 多次檢索 | 多個 Drafter 推理 |
| 模型需求 | 單模型 | 雙模型（大 + 小） |
| 可組合性 | 可與 Speculative RAG 組合 | 可與 CRAG 組合 |

### 各方法的適用場景總覽

```
                    檢索品質
                    ↑
          高 ┃  Standard RAG    Speculative RAG
             ┃  (夠用了)         (要更準更快)
             ┃
          低 ┃  CRAG            CRAG + Speculative RAG
             ┃  (先修檢索)       (兩個都要修)
             ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━→
                    低              高
                         生成複雜度
```

## 實作指南

以下是一個 TypeScript 實作範例，展示 Speculative RAG 的雙模型模式。

### 核心類型定義

```typescript
interface Document {
  id: string;
  content: string;
  score: number;        // 檢索相關性分數
  embedding: number[];  // 分群用（論文用一個輕量的 instruction-aware embedding 模型預先算好）
}

interface Draft {
  answer: string;
  rationale: string;
  sourceDocIds: string[];
  drafterId: number;
}

interface VerificationResult {
  selectedDraft: Draft;
  scores: Map<number, number>; // drafterId → score
  confidence: number;
}

interface SpeculativeRAGConfig {
  numDrafters: number;        // Drafter 數量（預設 3-5）
  subsetSize: number;         // 每個子集的文件數（預設 2-3）
  drafterModel: string;       // 小模型 ID
  verifierModel: string;      // 大模型 ID
  maxDrafterTokens: number;   // Drafter 最大輸出 token
  maxVerifierTokens: number;  // Verifier 最大輸出 token
}
```

### 文件子集抽樣（分群，非隨機）

論文的關鍵是**先分群再每群抽一篇**，讓每個子集橫跨多個觀點。從同一群裡抽會顯著劣化。

```typescript
/**
 * 依論文做法建立文件子集：
 * 1. 對檢索到的文件做 embedding，分成 k 群（k = subsetSize），每群代表一個觀點
 * 2. 每個子集從每一群各抽一篇 → 子集內觀點多樣、冗餘最小
 * 注意：這裡不能改成「單純隨機抽 k 篇」，論文的消融實驗顯示同群抽樣會明顯變差。
 */
function sampleDocumentSubsets(
  documents: Document[],
  numSubsets: number,
  subsetSize: number,
): Document[][] {
  // kmeans() 是你自己的實作或任何分群套件；輸入 doc.embedding，輸出 subsetSize 個群
  const clusters = kmeans(documents, subsetSize);
  const subsets: Document[][] = [];

  for (let i = 0; i < numSubsets; i++) {
    // 每個子集：從每一群各抽一篇（不放回，讓不同子集覆蓋不同文件）
    const subset = clusters
      .map((cluster) => pickWithoutReplacement(cluster, i))
      .filter((doc): doc is Document => doc !== undefined);
    subsets.push(subset);
  }

  return subsets;
}

/** 以 round-robin 的方式從群中取第 i 篇，群被取完就回頭循環 */
function pickWithoutReplacement(
  cluster: Document[],
  i: number,
): Document | undefined {
  if (cluster.length === 0) return undefined;
  return cluster[i % cluster.length];
}
```

（`kmeans` 這裡是 pseudocode 佔位——論文沒有公開參考實作，實際分群方式與距離度量請自行決定並實測。）

### RAG Drafter 實作

```typescript
async function generateDraft(
  query: string,
  documents: Document[],
  drafterId: number,
  config: SpeculativeRAGConfig,
): Promise<Draft> {
  const docContext = documents
    .map((doc, i) => `[Document ${i + 1}] (ID: ${doc.id})\n${doc.content}`)
    .join('\n\n');

  const prompt = `You are a RAG specialist. Given the following documents, answer the query.
You MUST also provide your reasoning process (rationale).

Query: ${query}

Documents:
${docContext}

Respond in this exact format:
Answer: [Your answer based on the documents]
Rationale: [Step-by-step reasoning for how you arrived at this answer from the documents]`;

  const response = await callLLM({
    model: config.drafterModel,
    prompt,
    maxTokens: config.maxDrafterTokens,
    temperature: 0.7, // 稍高的 temperature 增加多樣性
  });

  const { answer, rationale } = parseDraftResponse(response);

  return {
    answer,
    rationale,
    sourceDocIds: documents.map((d) => d.id),
    drafterId,
  };
}

function parseDraftResponse(
  response: string,
): { answer: string; rationale: string } {
  const answerMatch = response.match(/Answer:\s*([\s\S]*?)(?=Rationale:)/i);
  const rationaleMatch = response.match(/Rationale:\s*([\s\S]*)/i);

  return {
    answer: answerMatch?.[1]?.trim() ?? response,
    rationale: rationaleMatch?.[1]?.trim() ?? 'No rationale provided',
  };
}
```

### RAG Verifier 實作

注意這是**近似版**：論文用的是 token 條件機率（ρ<sub>Draft</sub> × ρ<sub>Self-contain</sub> × ρ<sub>Self-reflect</sub>），下面用 prompt 叫模型自己打分，是為了能在只回傳文字的 API 上跑。如果你的推論端拿得到 logprobs，照論文做會更接近原始結果。

```typescript
async function verifyDrafts(
  query: string,
  drafts: Draft[],
  config: SpeculativeRAGConfig,
): Promise<VerificationResult> {
  const draftsContext = drafts
    .map(
      (draft, i) =>
        `[Draft ${i + 1}] (Drafter #${draft.drafterId})
Answer: ${draft.answer}
Rationale: ${draft.rationale}
Source Documents: ${draft.sourceDocIds.join(', ')}`,
    )
    .join('\n\n---\n\n');

  const prompt = `You are an expert answer verifier. Given a query and multiple draft answers,
evaluate each draft and select the best one.

Evaluation criteria:
1. Factual Accuracy: Is the answer factually correct?
2. Reasoning Quality: Is the rationale logical and complete?
3. Query Relevance: Does the answer directly address the query?
4. Self-Consistency: Are the answer and rationale consistent?

Query: ${query}

Drafts:
${draftsContext}

Respond in this exact format:
Selected: [draft number]
Confidence: [0.0-1.0]
Scores: [draft1_score, draft2_score, ...]
Justification: [Why you selected this draft]`;

  const response = await callLLM({
    model: config.verifierModel,
    prompt,
    maxTokens: config.maxVerifierTokens,
    temperature: 0.0, // 驗證用低 temperature，確保一致性
  });

  return parseVerificationResponse(response, drafts);
}

function parseVerificationResponse(
  response: string,
  drafts: Draft[],
): VerificationResult {
  const selectedMatch = response.match(/Selected:\s*(\d+)/i);
  const confidenceMatch = response.match(/Confidence:\s*([\d.]+)/i);
  const scoresMatch = response.match(/Scores:\s*\[([\d.,\s]+)\]/i);

  const selectedIdx = (parseInt(selectedMatch?.[1] ?? '1') - 1);
  const confidence = parseFloat(confidenceMatch?.[1] ?? '0.5');
  const scoreValues = scoresMatch?.[1]?.split(',').map((s) => parseFloat(s.trim())) ?? [];

  const scores = new Map<number, number>();
  drafts.forEach((draft, i) => {
    scores.set(draft.drafterId, scoreValues[i] ?? 0);
  });

  return {
    selectedDraft: drafts[selectedIdx] ?? drafts[0],
    scores,
    confidence,
  };
}
```

### 完整 Pipeline

```typescript
async function speculativeRAG(
  query: string,
  config: SpeculativeRAGConfig,
): Promise<{
  answer: string;
  confidence: number;
  selectedDrafterId: number;
  allDrafts: Draft[];
  verification: VerificationResult;
}> {
  // Step 1: 檢索文件
  const documents = await retrieve(query);

  // Step 2: 建立文件子集
  const subsets = sampleDocumentSubsets(
    documents,
    config.numDrafters,
    config.subsetSize,
  );

  // Step 3: 平行生成草稿（關鍵！）
  const draftPromises = subsets.map((subset, i) =>
    generateDraft(query, subset, i, config),
  );
  const drafts = await Promise.all(draftPromises);

  // Step 4: 大模型驗證
  const verification = await verifyDrafts(query, drafts, config);

  return {
    answer: verification.selectedDraft.answer,
    confidence: verification.confidence,
    selectedDrafterId: verification.selectedDraft.drafterId,
    allDrafts: drafts,
    verification,
  };
}
```

### 使用範例

```typescript
const config: SpeculativeRAGConfig = {
  numDrafters: 5,   // 論文主設定：m=5
  subsetSize: 2,    // 論文主設定：k=2
  // 模型 ID 一律從環境變數注入，不要寫死——寫死的型號幾個月就下架
  drafterModel: process.env.DRAFTER_MODEL!,
  verifierModel: process.env.VERIFIER_MODEL!,
  maxDrafterTokens: 512,
  maxVerifierTokens: 256,
};

const result = await speculativeRAG(
  '台灣哪個岩場最適合初學者？',
  config,
);

console.log(`Answer: ${result.answer}`);
console.log(`Confidence: ${result.confidence}`);
console.log(`Selected Drafter: #${result.selectedDrafterId}`);
console.log(`All drafts: ${result.allDrafts.length}`);
```

### 實作注意事項

**Drafter 模型的選擇**

這裡不列具體型號清單——開源小模型的世代更替速度讓任何清單半年內就過期。選型的判準才是穩定的：

- 要小到能同時跑 5～10 個實例（論文用 7B 級；附錄顯示 2B 級也可行）
- 要能穩定遵循「Answer / Rationale」這種輸出格式
- **最重要的是要能微調**：論文的效果來自蒸餾出來的專家 Drafter，不是拿一個泛用小模型直接上。省掉微調這一步，你得到的就只是一個比較差的 ensemble。

**Verifier 模型的選擇**

論文用的是未微調的 Mistral-7B 或 Mixtral-8x7B——「大模型」是相對於 Drafter 而言，不必是當代最大的旗艦模型。真正的硬條件是：**你的推論端必須能回傳 token logprobs**，否則論文的機率式評分做不了，只能退回「叫模型寫評語打分」的近似版（就是本文的範例程式碼），效果與延遲都會不同。

**超參數調整**

從論文的設定出發再實測調整：

- **基準設定**：檢索 top-10，`numDrafters: 5`、`subsetSize: 2`
- **複雜多跳問題**：論文在 MuSiQue 上改成檢索 top-15、`numDrafters: 10`、`subsetSize: 6`
- **想提升準確度**：優先加草稿數（平行執行，不增延遲），而不是加每份草稿的文件數（論文實測非單調上升）

## 適用場景與限制

### 適合使用 Speculative RAG 的場景

**1. 高延遲敏感的知識問答**

如果你的應用對回應時間有嚴格要求（例如客服聊天機器人、即時搜尋引擎），Speculative RAG 可以在不犧牲準確度的前提下顯著降低延遲。

**2. 文件集合大且多樣**

當檢索器回傳的文件數量多（10+ 篇）且涵蓋不同面向時，Speculative RAG 的子集分散策略特別有效。不同 Drafter 看不同子集，更容易捕捉到不同面向的資訊。

**3. 需要高準確度的場景**

醫療主張查核（PubHealth 是 true/false 的 claim verification，不是問答）、科學推理（ARC-Challenge 為選擇題）等需要高準確度的場景。多個 Drafter 的多樣性 + Verifier 的嚴格驗證，比單次生成更可靠。

**4. 有 GPU 資源支持平行推理**

Speculative RAG 需要同時跑多個 Drafter 實例。如果你有足夠的 GPU 資源（或使用支持 batch inference 的 API），這個架構才能發揮平行化的優勢。

### 不適合使用的場景

**1. 簡單的事實查詢**

「台灣的首都是什麼？」這種問題，標準 RAG 甚至直接讓 LLM 回答就行了，不需要多 Drafter 驗證。過度架構化反而浪費資源。

**2. GPU 資源有限**

如果你只有一個 GPU 或使用的 API 不支持 batch/concurrent 呼叫，Drafter 的平行化優勢就沒了。序列跑 4 個 Drafter + 1 個 Verifier，延遲反而比標準 RAG 更高。

**3. 文件品質一致且高**

如果你的知識庫品質很高、文件之間不矛盾，標準 RAG 的單次生成通常就足夠好。Speculative RAG 的多樣性優勢在這種情況下不明顯。

**4. 需要即時串流的場景**

Speculative RAG 需要等所有 Drafter 完成 + Verifier 驗證才能輸出。如果你的應用需要 token-by-token 串流（例如 ChatGPT 式的漸進顯示），這個架構需要額外的改造。

一種可能的串流方案：先串流 confidence 最高的 Drafter 的草稿，同時在背景跑 Verifier。如果 Verifier 選了不同的草稿，再替換顯示。但這增加了 UX 複雜度。

**5. 文件數量很少**

如果只檢索到 2-3 篇文件，分成多個子集意義不大（每個子集可能只有 1 篇文件）。這時候標準 RAG 直接處理就好。

### 成本考量

Speculative RAG 的成本結構跟標準 RAG 不同：

| 項目 | Standard RAG | Speculative RAG |
|------|-------------|-----------------|
| 大模型呼叫次數 | 1 次（長 context） | 1 次（短 context） |
| 小模型呼叫次數 | 0 | K 次（平行） |
| 大模型 input tokens | 多（所有文件） | 少（只有草稿） |
| 小模型 input tokens | 0 | K × 子集文件 tokens |
| 總 token 成本 | 中 | 中偏高 |
| GPU 需求 | 低 | 中偏高 |

Token 成本方面，Speculative RAG 可能略高（因為多了 K 次 Drafter 呼叫），但大模型的 input tokens 減少了（草稿 vs 原始文件）。如果大小模型的價格差距大（例如 GPT-4 vs Mistral-7B），總成本可能持平甚至更低。

延遲成本方面，Speculative RAG 明顯更低，這在延遲敏感的場景中價值很高。

### 後續研究發現的失效模式

有一個論文沒測、但後續研究測出來的重要缺口：**當問題本身有歧義、有多個都正確的答案時，Speculative RAG 會退化。**

2025 年的〈Retrieval-Augmented Generation with Conflicting Evidence〉把 Speculative RAG 當作 baseline，在 AmbigDocs（要求把所有有效答案都列出來）上得到這組數字：

| Backbone | 單純 prompt 拼接 | Speculative RAG |
|---|---|---|
| Llama3.3-70B-Instruct | 54.20 | 44.30 |
| Qwen2.5-72B-Instruct | 41.20 | 13.40 |
| GPT-4o-mini | 51.50 | 22.50 |

在 Qwen 這一格，Speculative RAG 掉到只剩三分之一。原因不難推：架構的最後一步是**從多份草稿中選一份**，這對「只有一個正確答案」的任務是優點，對「必須同時呈現多個正確答案」的任務就是結構性缺陷——不同 Drafter 從不同文件子集拿到的不同有效答案，會在驗證階段被丟掉。

同一篇也顯示 Speculative RAG 在 FaithEval（要求壓制錯誤資訊、只有單一正解）上反而是強的：Llama3.3-70B 上 41.80 vs prompt 拼接的 27.30、Qwen2.5-72B 上 56.20 vs 38.50。這正好對上前面的推論——**單一正解的任務適合，多正解／歧義查詢不適合**。

導入前請照這個判準檢查你的查詢分布。如果使用者常問「有哪些方案」「有哪幾種做法」這類本質上是多答案的問題，這個架構會系統性地漏掉東西。

## 未來展望

Speculative RAG 在 2024 年 7 月發表（arXiv:2407.08223），2025 年被 ICLR 接收。這個架構的核心思想——**分工與平行化**——很有可能被更廣泛地應用在其他 LLM pipeline 中。

幾個可能的發展方向：

1. **自適應 Drafter 數量**：根據問題的複雜度動態調整 Drafter 數量。簡單問題用 2 個，複雜問題用 5 個。
2. **智慧子集分配**：不是隨機分配文件子集，而是根據文件的主題、類型進行策略性分組。
3. **Drafter 特化**：不同 Drafter 專精不同類型的問題（事實型、推理型、比較型），根據問題類型路由。
4. **與其他 RAG 技術組合**：CRAG + Speculative RAG、Graph RAG + Speculative RAG 等組合。

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [Speculative RAG: Enhancing Retrieval Augmented Generation through Drafting (Wang et al., ICLR 2025)](https://arxiv.org/abs/2407.08223) — 本文所有數字的來源（注意正確的 arXiv 編號是 2407.08223）
- [Retrieval-Augmented Generation with Conflicting Evidence (Wang et al., 2025)](https://arxiv.org/abs/2504.13079) — RAMDocs / MADAM-RAG，實測 Speculative RAG 在歧義查詢上的退化
- [Fast Inference from Transformers via Speculative Decoding (Leviathan et al., ICML 2023)](https://arxiv.org/abs/2211.17192) — Speculative Decoding 原始論文，Speculative RAG 雙模型設計的概念來源
- [Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection (Asai et al., ICLR 2024)](https://arxiv.org/abs/2310.11511) — Self-RAG 對比方法
- [Corrective Retrieval Augmented Generation (Yan et al., 2024)](https://arxiv.org/abs/2401.15884) — CRAG 對比方法，與 Speculative RAG 互補
- [A Survey on Retrieval-Augmented Generation for Large Language Models (2023)](https://arxiv.org/abs/2312.10997) — RAG 系統全貌，涵蓋 Drafter-Verifier 雙模型架構的背景
