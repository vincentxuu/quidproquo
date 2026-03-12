---
title: "Multimodal RAG：把圖片也納入知識庫"
date: 2026-03-12
category: ai
tags: [rag, multimodal, vision, image-embedding, clip]
lang: zh-TW
tldr: "攀岩路線有大量圖片資訊（路線圖、岩壁照片），純文字 RAG 遺漏了這些。Multimodal RAG 讓圖片也能被搜尋和理解。"
description: "Multimodal RAG 的設計：圖片 Embedding（CLIP）、文字+圖片混合索引、圖片描述生成策略，以及在攀岩社群場景的應用潛力。"
draft: false
---

攀岩社群裡有大量視覺資訊：路線圖（topo）、岩壁照片、動作示範影片截圖。這些圖片包含了文字描述很難完整傳達的資訊——岩壁的形態、路線的走向、關鍵動作的身體位置。

標準 RAG 只能處理文字，這些視覺資訊都被排除在外。使用者問「龍洞 5.11a 的關鍵動作怎麼做」，系統只能從文字描述回答，但真正有用的是那張手抓點的示意圖。

Multimodal RAG 把圖片也納入知識庫，讓查詢可以同時搜尋文字和圖片內容。

## 圖片 Embedding：CLIP 模型

CLIP（Contrastive Language-Image Pre-Training，OpenAI）是 Multimodal RAG 的基礎模型。它被訓練成讓「文字描述」和「對應圖片」在同一個向量空間裡距離接近：

```
「一個攀岩者在仰角岩壁上做側拉動作」 → [0.2, -0.5, 0.8, ...]
[對應的圖片]                         → [0.21, -0.48, 0.79, ...]

兩個向量的 cosine similarity 很高
```

這讓我們可以用**文字查詢搜尋圖片**，或用**圖片查詢搜尋相似圖片**。

## 三種索引策略

**策略 1：圖片 → 文字描述 → 文字 Embedding**

用 Vision LLM（GPT-4V、LLaVA）自動生成圖片的詳細描述，再用標準文字 embedding 索引：

```typescript
async function indexImage(imageUrl: string, env: Env): Promise<void> {
  // 用 Vision LLM 生成描述
  const description = await describeImage(imageUrl, env);
  // 描述：「龍洞北壁路線圖，顯示一條 5.11a 的路線走向，
  //        路線從左下往右上延伸，在第三個保護點處有一個
  //        關鍵的側拉動作...」

  // 用標準 embedding 索引描述文字
  const embedding = await embed(description, env);
  await vectorize.upsert([{ id: imageUrl, values: embedding, metadata: { type: 'image', url: imageUrl } }]);
}
```

**優點**：不需要多模態 embedding 模型，用現有的文字 embedding 就能搜尋。
**缺點**：描述品質依賴 Vision LLM，生成成本高，可能遺漏視覺細節。

**策略 2：圖片 → 多模態 Embedding（CLIP）**

直接用 CLIP 把圖片 embed 成向量，與文字 embedding 共存在同一個向量空間：

```typescript
// 索引：圖片 → CLIP embedding
const imageEmbedding = await clipEmbed(imageBytes, env);
await vectorize.upsert([{ id: imageId, values: imageEmbedding }]);

// 搜尋：文字查詢 → CLIP text embedding → 搜尋圖片
const queryEmbedding = await clipTextEmbed(query, env);
const results = await vectorize.query(queryEmbedding);
// 結果可能包含文字文件和圖片
```

**優點**：圖片的視覺特徵直接保留在向量裡。
**缺點**：需要 CLIP 模型；CLIP 的中文支援不如英文；文字和圖片 embedding 要在同一個向量空間才能一起搜尋。

**策略 3：混合（文字描述 + CLIP embedding）**

兩種 embedding 都存，搜尋時兩路並行，RRF 融合：

```
圖片索引：
  文字描述 embedding（用於文字查詢命中）
  CLIP 圖片 embedding（用於視覺相似查詢）

搜尋：
  文字查詢 → 文字描述 embedding 搜尋
            + CLIP 文字 embedding 搜尋
  → RRF 融合
```

## 在回答中使用圖片

找到相關圖片後，有兩種使用方式：

**直接引用**：在回答中附上圖片連結/縮圖，讓使用者自己看：

```
回答：龍洞 5.11a 的關鍵動作在第三個保護點後，需要做側拉...

[相關圖片]
📷 路線圖 → [連結]
📷 關鍵動作示意 → [連結]
```

**送給 Vision LLM 理解**：把找到的圖片和查詢一起送給 Vision LLM，讓它從圖片中提取相關資訊並整合到回答裡：

```typescript
const response = await visionLlm.generate({
  messages: [
    { role: "user", content: [
      { type: "text", text: query },
      { type: "image_url", url: relevantImage.url },
    ]},
  ],
});
```

後者更強大，但需要 Vision LLM 支援，成本也更高。

## 攀岩場景的具體應用

幾個最有價值的 multimodal 場景：

**路線 Topo 搜尋**：使用者上傳一張岩壁照片，系統找到對應的路線圖，說明路線走向。

**動作問題**：「這個動作怎麼做」+ 上傳動作圖片，系統找到類似動作的說明影片或描述。

**岩場識別**：上傳岩壁照片，系統識別是哪個岩場、哪條路線（如果有足夠的圖片資料庫）。

## 工程現實

目前的限制：
- Cloudflare Workers AI 提供 CLIP 模型（`@cf/openai/clip-vit-base-patch32`），但中文文字的表示能力較弱
- Vision LLM（描述生成）成本比文字 LLM 高
- 圖片索引需要處理圖片存儲（R2）和 embedding 的一致性

對攀岩社群，Multimodal RAG 是很有價值的方向，但工程複雜度高，適合在基礎 RAG 穩定後再評估。先做文字 RAG 做好，再考慮擴展到多模態。

## 整體來說

Multimodal RAG 擴展了 RAG 系統的知識邊界——不只是文字知識，也包括視覺知識。對攀岩這個視覺元素豐富的領域，這個擴展的價值是真實的。技術上已經可行（CLIP + Vision LLM），工程成本是主要的制約因素。
