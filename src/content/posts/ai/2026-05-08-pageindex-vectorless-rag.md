---
title: "PageIndex：不做向量的 RAG，把長文件變成一本有目錄的書"
date: 2026-05-08
updated: 2026-08-19
type: deep-dive
category: ai
tags: [rag, llm, pageindex, vectorless, retrieval, financebench]
lang: zh-TW
tldr: "PageIndex 不切 chunk、不做 embedding、不存向量，靠 LLM 推理一份 LLM 自己寫的目錄樹，在 FinanceBench 上由開發方自評拿到 98.7%。它解的不是向量 RAG 的同一個問題——是『在一份結構清楚的厚文件裡找對的那一節』。"
description: "VectifyAI 開源的 PageIndex 把『RAG = 向量檢索』這個假設拆開：用樹狀目錄＋LLM 推理取代向量相似度。整理它的運作方式、跟向量 RAG 的差異，以及什麼場景該用、什麼場景不該用。"
draft: false
series:
  name: "RAG 技法大全"
  order: 9
---

> 🌏 [English version](/posts/ai/2026-05-08-pageindex-vectorless-rag-en)

VectifyAI 開源的 PageIndex 走的是一條跟主流 RAG 不一樣的路線：不切 chunk、不做 embedding、不存向量，改用 LLM 在一份樹狀目錄上推理。它最常被引用的數字是 FinanceBench 上的 98.7% 準確率——那個數字有來源上的前提，後面會專門拆一節。先看它把「做 RAG = 做向量」這個被當成預設的假設重新打開的部分。

## 兩個前置概念

**RAG**：讓模型在回答前先去翻一份指定的筆記。筆記存在資料庫，問題進來時抓相關段落餵給模型，模型才知道企業內部、特定領域的事。

**向量檢索**：主流 RAG 的找答案方式。把每段文字轉成一組高維座標、把問題也轉成座標，計算誰跟誰距離最近。本質上是讓系統用「語意相似度」找答案。

PageIndex 換掉的就是「向量檢索」這一步。

## PageIndex 怎麼運作

PageIndex 把整份文件當成一本「有目錄的書」，分兩個階段處理：

**第一階段：建樹**。先把整份 PDF 讀過一遍，產出一個 JSON 樹狀目錄。每個節點包含標題、摘要、頁碼，等於一份寫給後續查詢用的索引。

```
{
  "title": "Annual Report 2024",
  "children": [
    {
      "title": "Item 1. Business Overview",
      "summary": "...",
      "pages": [3, 4, 5],
      "children": [
        { "title": "Products", "summary": "...", "pages": [3] },
        { "title": "Markets",  "summary": "...", "pages": [4, 5] }
      ]
    },
    {
      "title": "Item 7. MD&A",
      "summary": "...",
      "pages": [42, 43, 44, 45]
    }
  ]
}
```

**第二階段：推理檢索**。查詢進來時，系統不去算向量距離，而是把整份目錄交給 LLM，讓它像人翻書一樣決定要翻哪一節。讀到的內容不足以回答，就回頭再選別的節點；足夠了，就根據那段內容生成回答。

核心關鍵字是「**推理**」，不是「**相似度**」——這就是 PageIndex 跟向量 RAG 最根本的差異。

## 兩條路線解的不是同一個問題

向量 RAG 跟 PageIndex 看似都在解「找出相關段落」，實際上解的是不同的問題。

**向量 RAG 是一發中的**：問題進來、算 top-k 最像的段落、丟給模型，毫秒級完成，成本低，能橫跨大量文件。

**PageIndex 是多步推理**：問題進來、看目錄、選分支、讀內容、判斷夠不夠、不夠再回頭。慢、貴（每一步都是一次 LLM call），但路徑可追溯，能看到它選了哪幾節、為什麼選。

在金融報表、法規文件、技術手冊這種長文件裡，「語意相似 ≠ 相關」的差距會直接決定準確率。年報裡每份「Risk Factors」段落語意都接近，但只有對應到正確年度、正確子公司的那一節才是答案。PageIndex 主打的正是這一塊——至於它到底領先多少，下一節拆。

```
向量 RAG：       問題 ─► [embed] ─► top-k 段落 ─► LLM 回答
                  （毫秒、便宜、可橫跨文件、不可解釋）

PageIndex：      問題 ─► LLM 看目錄 ─┐
                                     ▼
                              選節點、讀內容
                                     │
                              ┌──────┴──────┐
                            夠了           不夠
                              │              │
                              ▼              └─► 回頭再選
                            回答
                  （秒～分鐘、貴、單份文件深耕、路徑可追溯）
```

## 98.7% 這個數字該怎麼讀

這個數字常被轉述成「vectorless RAG 打敗向量 RAG」，但它的來源需要先講清楚：

- **98.7% 是廠商自評**。它來自 VectifyAI 用自家商用系統 Mafin 2.5（底層是 PageIndex）在 [FinanceBench](https://arxiv.org/abs/2311.11944) 公開題組上的評測。[評測程式碼確實開源](https://github.com/VectifyAI/Mafin2.5-FinanceBench)，這點比多數廠商數字誠實，但設計者、執行者與受評者仍是同一方。
- **常被一起引用的 31% 不是 GPT-4o 的對照組**。那一格在原始表格裡標的是「ChatGPT 4o + Search」，而且只涵蓋 66.7% 的題目、數字轉引自第三方，不是同一條流程下跑出來的 baseline。把 98.7% 對 31% 當成「推理 vs 向量」的差距，是拿兩把不同的尺在量。
- **FinanceBench 是單文件 QA**。每題對應一份特定財報，正好是樹狀導航最擅長的形狀。

後續有第三方工作直接測過這件事，結論互相衝突：

- Lumer 等人（[arXiv:2511.18177](https://arxiv.org/abs/2511.18177)）在 1,200 份 SEC 10-K/10-Q/8-K、150 題的評測上，**向量式 agentic RAG 對階層節點式系統的勝率是 68%**，延遲相當（5.2 秒 vs 5.98 秒）。
- 另一份跨金融／法律／醫療的評測（[arXiv:2604.14222](https://arxiv.org/abs/2604.14222)）結論相反：FinanceBench 150 題上 Tree Reasoning 0.938、Vector RAG 0.821；但**跨多份文件的綜合題那一層，是向量贏**。
- 一份公開了程式碼與資料的第三方 benchmark（[repo](https://github.com/adorosario/pageindex-rag-benchmark)）指出，樹狀索引在 2,795 份文件的語料上建不起來，只能退回 FAISS 向量檢索。作者自己揭露是受評廠商之一的創辦人，讀的時候要把這點算進去。

把這些疊在一起，比較站得住腳的說法是：**在單份結構清楚的長文件裡，推理式導航確實比相似度檢索準；跨大量文件時，優勢會縮小甚至反轉**。而不是「向量 RAG 被取代了」。

## 適合什麼、不適合什麼

**適合的場景**：結構清楚、會被反覆查詢的長文件——年報、合約、研究論文、技術規格。建一次樹的成本比較高，但這份樹會被重複使用，攤銷下來划算。

**不適合的場景**：

- 跨海量文件的廣搜——每份文件至少一次建樹成本起跳，文件數一多成本會爆，而且這正是上面第三方評測翻車的地方。
- 章節結構鬆散的文本（隨意筆記、論壇貼文、聊天紀錄）——沒有可建樹的層級。
- 只查一次就丟的文件——建樹成本攤不掉。
- 對延遲敏感的應用——向量是毫秒級，PageIndex 是秒到分鐘級。

一個務實的做法是 **hybrid**：用向量檢索先選出可能的幾份文件，再用 PageIndex 在單份文件裡精準導航。前段廣搜、後段深挖，兩邊各自吃擅長的部分。這也是上述兩篇第三方論文最後給出的方向。

## 專案現況

開源 repo（MIT 授權）現在提供兩種建樹模式：預設的 **flash** 模式用啟發式規則抽結構、只在產生節點摘要與最佳化展開時叫 LLM，速度快很多；`--mode standard` 才是全程 LLM 建樹，`--max-pages-per-node`、`--max-tokens-per-node` 這類結構調校參數只在 standard 模式下有效。也支援直接吃 Markdown（`--md_path`，用 `#` 層級判斷節點深度）。repo 裡另附一支用 OpenAI Agents SDK 串起來的 agentic vectorless RAG 範例。

專案同時往兩個方向長：一是 **PageIndex File System**，在檔案層再疊一層樹索引，試圖解掉「跨大量文件」這個先天弱點；二是託管服務（Chat 平台、MCP server、API）。官方明講雲端版才有加強過的 OCR 與建樹管線，開源版用的是標準 PDF 解析——換句話說，你自己裝起來跑出來的品質，跟官方 benchmark 用的不是同一條管線，評估時要把這點算進去。

## 整體來說

PageIndex 真正值得注意的不是 98.7% 這個數字（那是廠商自評，而且被拿來對照的 31% 根本不是同一套實驗），而是它把「做 RAG 一定要做向量」這個被當成預設的假設重新打開。當 LLM 推理變便宜、context window 變長，「讓模型直接讀目錄」這條路的成本曲線會繼續往下走。

它不是要取代向量 RAG，而是劃出一塊向量解不漂亮的領域：在一份結構清楚的厚文件裡找對的那一節，可能根本不需要向量。反過來說，一旦文件數量拉到成千上萬，目前的證據是它得把向量請回來。

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [VectifyAI/PageIndex（GitHub，MIT）](https://github.com/VectifyAI/PageIndex)
- [PageIndex 官網](https://pageindex.ai/)
- [PageIndex Developer Docs](https://docs.pageindex.ai/)
- [PageIndex: Next-Generation Vectorless, Reasoning-based RAG（官方技術介紹）](https://pageindex.ai/blog/pageindex-intro)
- [VectifyAI/Mafin2.5-FinanceBench（98.7% 評測 repo，廠商自評）](https://github.com/VectifyAI/Mafin2.5-FinanceBench)
- [FinanceBench: A New Benchmark for Financial Question Answering（arXiv:2311.11944）](https://arxiv.org/abs/2311.11944)
- [Rethinking Retrieval：向量式 agentic RAG vs 階層節點式系統，1,200 份 SEC 文件（arXiv:2511.18177）](https://arxiv.org/abs/2511.18177)
- [Adaptive Query Routing：跨金融／法律／醫療的 Vector / Tree / Hybrid 比較（arXiv:2604.14222）](https://arxiv.org/abs/2604.14222)
- [adorosario/pageindex-rag-benchmark（第三方多文件 benchmark，作者有利益揭露）](https://github.com/adorosario/pageindex-rag-benchmark)
- [MarkTechPost：VectifyAI Launches Mafin 2.5 and PageIndex](https://www.marktechpost.com/2026/02/22/vectifyai-launches-mafin-2-5-and-pageindex-achieving-98-7-financial-rag-accuracy-with-a-new-open-source-vectorless-tree-indexing/)
- [Towards AI：PageIndex — The RAG Framework That Threw Out Vector Databases](https://pub.towardsai.net/pageindex-the-rag-framework-that-threw-out-vector-databases-and-still-hit-98-7-accuracy-d194e0549478)
- [pageindex_RAG_simple.ipynb（官方 cookbook）](https://github.com/VectifyAI/PageIndex/blob/main/cookbook/pageindex_RAG_simple.ipynb)
- [GraphRAG：把知識做成圖，讓 LLM 沿著關係推理](/posts/ai/2026-03-12-graph-rag)
