---
title: "PageIndex：不做向量的 RAG，把長文件變成一本有目錄的書"
date: 2026-05-08
type: deep-dive
category: ai
tags: [rag, llm, pageindex, vectorless, retrieval, financebench]
lang: zh-TW
tldr: "PageIndex 不切 chunk、不做 embedding、不存向量，靠 LLM 推理一份 LLM 自己寫的目錄樹，在 FinanceBench 拿到 98.7%（GPT-4o 直讀只有 31%）。它解的不是向量 RAG 的同一個問題——是『在一份結構清楚的厚文件裡找對的那一節』。"
description: "VectifyAI 開源的 PageIndex 把『RAG = 向量檢索』這個假設拆開：用樹狀目錄＋LLM 推理取代向量相似度。整理它的運作方式、跟向量 RAG 的差異，以及什麼場景該用、什麼場景不該用。"
draft: false
---

VectifyAI 開源的 PageIndex 走的是一條跟主流 RAG 不一樣的路線：不切 chunk、不做 embedding、不存向量，在 FinanceBench 上拿到 98.7% 準確率（同一份題目，GPT-4o 直接讀只有 31%）。它把「做 RAG = 做向量」這個被當成預設的假設重新拆開。

## 兩個前置概念

**RAG**：讓模型在回答前先去翻一份指定的筆記。筆記存在資料庫，問題進來時抓相關段落餵給模型，模型才知道企業內部、特定領域的事。

**向量檢索**：主流 RAG 的找答案方式。把每段文字轉成一組高維座標、把問題也轉成座標，計算誰跟誰距離最近。本質上是讓系統用「語意相似度」找答案。

PageIndex 換掉的就是「向量檢索」這一步。

## PageIndex 怎麼運作

PageIndex 把整份文件當成一本「有目錄的書」，分兩個階段處理：

**第一階段：建樹**。LLM 預先把整份 PDF 讀過一遍，自動產出一個 JSON 樹狀目錄。每個節點包含標題、摘要、頁碼，等於一份 LLM 寫給自己後續查詢用的索引。

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

在金融報表、法規文件、技術手冊這種長文件裡，「語意相似 ≠ 相關」的差距會直接決定準確率。年報裡每份「Risk Factors」段落語意都接近，但只有對應到正確年度、正確子公司的那一節才是答案。這也是 98.7% vs 31% 的真正來源。

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

## 適合什麼、不適合什麼

**適合的場景**：結構清楚、會被反覆查詢的長文件——年報、合約、研究論文、技術規格。建一次樹的成本比較高，但這份樹會被重複使用，攤銷下來划算。

**不適合的場景**：

- 跨海量文件的廣搜——每份文件至少一次 LLM call 起跳，文件數一多成本會爆。
- 章節結構鬆散的文本（隨意筆記、論壇貼文、聊天紀錄）——沒有可建樹的層級。
- 只查一次就丟的文件——建樹成本攤不掉。
- 對延遲敏感的應用——向量是毫秒級，PageIndex 是秒到分鐘級。

一個務實的做法是 **hybrid**：用向量檢索先選出可能的幾份文件，再用 PageIndex 在單份文件裡精準導航。前段廣搜、後段深挖，兩邊各自吃擅長的部分。

## 整體來說

PageIndex 真正值得注意的不是 98.7% 這個數字，而是它把「做 RAG 一定要做向量」這個被當成預設的假設重新打開。當 LLM 推理變便宜、context window 變長，「讓模型直接讀目錄」這條路的成本曲線會繼續往下走。

它不是要取代向量 RAG，而是劃出一塊向量解不漂亮的領域：在一份結構清楚的厚文件裡找對的那一節，可能根本不需要向量。

## 參考資料

- [VectifyAI/PageIndex（GitHub，MIT）](https://github.com/VectifyAI/PageIndex)
- [PageIndex 官網](https://pageindex.ai/)
- [PageIndex Developer Docs](https://docs.pageindex.ai/)
- [Reasoning-Based RAG（官方概念頁）](https://www.mintlify.com/vectifyai/pageindex/concepts/reasoning-based-rag)
- [VectifyAI/Mafin2.5-FinanceBench（98.7% 評測 repo）](https://github.com/VectifyAI/Mafin2.5-FinanceBench)
- [MarkTechPost：VectifyAI Launches Mafin 2.5 and PageIndex](https://www.marktechpost.com/2026/02/22/vectifyai-launches-mafin-2-5-and-pageindex-achieving-98-7-financial-rag-accuracy-with-a-new-open-source-vectorless-tree-indexing/)
- [Towards AI：PageIndex — The RAG Framework That Threw Out Vector Databases](https://pub.towardsai.net/pageindex-the-rag-framework-that-threw-out-vector-databases-and-still-hit-98-7-accuracy-d194e0549478)
- [pageindex_RAG_simple.ipynb（官方 cookbook）](https://github.com/VectifyAI/PageIndex/blob/main/cookbook/pageindex_RAG_simple.ipynb)
- [GraphRAG：把知識做成圖，讓 LLM 沿著關係推理](/posts/ai/2026-03-12-graph-rag)
