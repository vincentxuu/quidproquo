---
title: "Multimodal RAG：把圖片也納入知識庫"
date: 2026-03-12
type: guide
category: ai
tags: [rag, multimodal, vision, image-embedding, clip]
lang: zh-TW
tldr: "攀岩路線有大量圖片資訊（路線圖、岩壁照片），純文字 RAG 遺漏了這些。Multimodal RAG 讓圖片也能被搜尋和理解。"
description: "Multimodal RAG 的設計：圖片 Embedding（CLIP）、文字+圖片混合索引、圖片描述生成策略，以及在攀岩社群場景的應用潛力。"
draft: false
series:
  name: "RAG 技法大全"
  order: 10
---

> 🌏 [English version](/posts/ai/2026-03-12-multimodal-rag-en)

攀岩社群裡有大量視覺資訊：路線圖（topo）、岩壁照片、動作示範影片截圖。這些圖片包含了文字描述很難完整傳達的資訊——岩壁的形態、路線的走向、關鍵動作的身體位置。

標準 RAG 只能處理文字，這些視覺資訊都被排除在外。使用者問「龍洞 5.11a 的關鍵動作怎麼做」，系統只能從文字描述回答，但真正有用的是那張手抓點的示意圖。

Multimodal RAG 把圖片也納入知識庫，讓查詢可以同時搜尋文字和圖片內容。

## 圖片 Embedding：CLIP 這一類的雙塔模型

[CLIP](https://arxiv.org/abs/2103.00020)（Contrastive Language-Image Pre-Training）是這條路線的原型：它被訓練成讓「文字描述」和「對應圖片」在同一個向量空間裡距離接近：

```
「一個攀岩者在仰角岩壁上做側拉動作」 → [0.2, -0.5, 0.8, ...]
[對應的圖片]                         → [0.21, -0.48, 0.79, ...]

兩個向量的 cosine similarity 很高
```

這讓我們可以用**文字查詢搜尋圖片**，或用**圖片查詢搜尋相似圖片**。

要注意的是，「CLIP」現在比較像一整個家族的代稱，而不是一個具體要用的模型。原始的 OpenAI CLIP 以英文語料為主，非英語（包含中文）的表示能力明顯較弱；後續的 [SigLIP 2](https://arxiv.org/abs/2502.14786) 這類模型主打多語言與更好的定位／密集特徵，就是為了補這個洞。**選型時該問的不是「要不要用 CLIP」，而是：這支模型的訓練語言涵蓋你的查詢語言嗎？向量維度你的向量資料庫吃得下嗎？** 具體型號請以你要部署的推論平台當下的模型清單為準，這裡不釘版本。

## 三種索引策略

**策略 1：圖片 → 文字描述 → 文字 Embedding**

用支援視覺輸入的 LLM 自動生成圖片的詳細描述，再用標準文字 embedding 索引：

```typescript
async function indexImage(imageUrl: string, env: Env): Promise<void> {
  // 用支援視覺輸入的 LLM 生成描述
  const description = await describeImage(imageUrl, env);
  // 描述：「龍洞北壁路線圖，顯示一條 5.11a 的路線走向，
  //        路線從左下往右上延伸，在第三個保護點處有一個
  //        關鍵的側拉動作...」

  // 用標準 embedding 索引描述文字
  const embedding = await embed(description, env);
  await vectorize.upsert([{ id: imageUrl, values: embedding, metadata: { type: 'image', url: imageUrl } }]);
}
```

**優點**：不需要多模態 embedding 模型，用現有的文字 embedding 就能搜尋；而且描述是中文的話，中文查詢的命中率通常比多語言不足的視覺模型好。
**缺點**：描述品質依賴生成模型，生成成本高，且**描述一寫死就固定了**——當初沒寫進描述的視覺細節，之後永遠搜不到。

**策略 2：圖片 → 多模態 Embedding**

直接把圖片 embed 成向量，與文字 embedding 共存在同一個向量空間：

```typescript
// 索引：圖片 → 多模態 embedding
const imageEmbedding = await imageEmbed(imageBytes, env);
await vectorize.upsert([{ id: imageId, values: imageEmbedding }]);

// 搜尋：文字查詢 → 同一個模型的文字塔 → 搜尋圖片
const queryEmbedding = await textEmbed(query, env);
const results = await vectorize.query(queryEmbedding);
// 結果可能包含文字文件和圖片
```

**優點**：圖片的視覺特徵直接保留在向量裡，不會被描述這一層過濾掉。
**缺點**：**文字和圖片的向量必須來自同一個模型的兩座塔**才能互相比較——把 CLIP 的圖片向量和 BGE 的文字向量放進同一個 index 一起查，是這個題目最常見的錯誤。另外多語言支援要自己確認（見上一節）。

**策略 3：混合（文字描述 + 多模態 embedding）**

兩種 embedding 都存，搜尋時兩路並行，RRF 融合：

```
圖片索引：
  文字描述 embedding（用於文字查詢命中，跟文字文件同一個空間）
  多模態圖片 embedding（用於視覺相似查詢，獨立的空間／獨立的 index）

搜尋：
  文字查詢 → 文字描述 embedding 搜尋
            + 多模態文字塔 embedding 搜尋
  → RRF 融合
```

實務上這是最穩的做法，代價是兩份索引要維護一致。

## 補充：文件型圖片可以整頁當作檢索單位

如果你的「圖片」其實是文件掃描頁、投影片、圖表這類**版面裡有大量文字**的東西，還有第四條路：跳過 OCR，直接把整頁畫面丟給視覺模型做 late interaction 檢索。[ColPali](https://arxiv.org/abs/2407.01449) 是這條路線最常被引用的做法——用視覺語言模型把頁面切成 patch，產生多向量表示，查詢時做後期互動比對。

好處是不用維護 OCR + 版面分析的前處理鏈；代價是每頁存的是多向量而不是單一向量，儲存與查詢成本高一個量級，而且需要向量資料庫支援 multi-vector / late interaction。攀岩 topo 這種「圖上有標註文字」的素材，其實蠻符合這個情境，值得評估。

## 在回答中使用圖片

找到相關圖片後，有兩種使用方式：

**直接引用**：在回答中附上圖片連結/縮圖，讓使用者自己看：

```
回答：龍洞 5.11a 的關鍵動作在第三個保護點後，需要做側拉...

[相關圖片]
📷 路線圖 → [連結]
📷 關鍵動作示意 → [連結]
```

**送給視覺 LLM 理解**：把找到的圖片和查詢一起送給支援視覺輸入的 LLM，讓它從圖片中提取相關資訊並整合到回答裡。各家 API 的訊息格式不同（圖片要傳 URL、base64 還是檔案 ID，欄位怎麼包，都不一樣），所以這裡只寫概念，實際格式請查你要用的那家的 API 文件：

```
// 概念示意，非可執行程式碼：各家的 content part 格式不同
generate({
  messages: [
    { role: "user", content: [
        文字部分：使用者的問題,
        圖片部分：檢索到的圖片（URL / base64 / 檔案參照）,
    ]},
  ],
})
```

後者更強大，但需要視覺模型支援，成本也更高，而且要注意：**檢索錯的圖片比沒有圖片更糟**，模型會很認真地描述一張不相干的岩壁。

## 攀岩場景的具體應用

幾個最有價值的 multimodal 場景：

**路線 Topo 搜尋**：使用者上傳一張岩壁照片，系統找到對應的路線圖，說明路線走向。

**動作問題**：「這個動作怎麼做」+ 上傳動作圖片，系統找到類似動作的說明影片或描述。

**岩場識別**：上傳岩壁照片，系統識別是哪個岩場、哪條路線（如果有足夠的圖片資料庫）。

## 工程現實

目前的限制：

- **平台上不一定有現成的圖片 embedding 模型**。以 Cloudflare 為例，[Workers AI 的模型清單](https://developers.cloudflare.com/workers-ai/models/)裡有 text embeddings、image classification、image-to-text（視覺語言模型），但**沒有 CLIP 那種可以拿來做圖文共用向量空間的雙塔 embedding 模型**。也就是說在純 Workers 架構上，策略 2 目前得靠外部推論服務，策略 1（用視覺模型生描述 + 文字 embedding）反而是最順的一條路。
- **向量維度上限會限制模型選擇**。Vectorize 的向量維度上限是 1536（float32），挑圖片 embedding 模型前要先對一下。
- **視覺模型生描述的成本比純文字 LLM 高**，而且是 O(圖片數) 的一次性大批次成本。
- **圖片索引要處理儲存（R2）與 embedding 的一致性**：圖片被刪除或替換時，向量也要同步處理，不然會檢索到已經不存在的圖。

對攀岩社群，Multimodal RAG 是很有價值的方向，但工程複雜度高，適合在基礎 RAG 穩定後再評估。先做文字 RAG 做好，再考慮擴展到多模態。

## 整體來說

Multimodal RAG 擴展了 RAG 系統的知識邊界——不只是文字知識，也包括視覺知識。對攀岩這個視覺元素豐富的領域，這個擴展的價值是真實的。技術上已經可行，工程成本與平台上有沒有合適的模型才是主要的制約因素。

---

## 參考資料

- [Learning Transferable Visual Models From Natural Language Supervision（CLIP, 2021）](https://arxiv.org/abs/2103.00020)
- [SigLIP 2: Multilingual Vision-Language Encoders with Improved Semantic Understanding, Localization, and Dense Features (2025)](https://arxiv.org/abs/2502.14786)
- [ColPali: Efficient Document Retrieval with Vision Language Models (2024)](https://arxiv.org/abs/2407.01449)
- [MuRAG: Multimodal Retrieval-Augmented Generator for Open Question Answering over Images and Text (2022)](https://arxiv.org/abs/2210.02928)
- [A Survey of Multimodal Retrieval-Augmented Generation (2025)](https://arxiv.org/abs/2504.08748)
- [Scaling Beyond Context: A Survey of Multimodal RAG for Document Understanding (2026)](https://arxiv.org/abs/2510.15253)
- [Cloudflare Workers AI - Models](https://developers.cloudflare.com/workers-ai/models/)
- [NobodyClimb 系統架構：Cloudflare 全端攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI 架構：20 節點 RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
