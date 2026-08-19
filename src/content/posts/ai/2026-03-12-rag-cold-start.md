---
title: "RAG 冷啟動：沒有資料時怎麼讓系統能用"
date: 2026-03-12
updated: 2026-08-19
type: guide
category: ai
tags: [rag, cold-start, bootstrapping, indexing, data]
lang: zh-TW
tldr: "RAG 系統需要資料才能回答問題，但一開始就沒有資料。冷啟動策略決定了系統從空到可用的路徑。"
description: "RAG 冷啟動的設計策略：資料來源優先級、Bootstrap 索引建構、Graceful Degradation（優雅降級），以及如何讓系統在資料稀疏時仍然有用。"
draft: false
series:
  name: "RAG 技法大全"
  order: 44
---

RAG 系統有個雞蛋問題：沒有資料就不能回答，但資料是隨著系統使用才慢慢累積的。

「龍洞有哪些路線」——如果龍洞的路線資料還沒有索引，系統只能說「沒有相關資料」，這個回答毫無幫助，使用者可能直接放棄。

冷啟動策略解決的是：**如何讓系統在資料稀疏的初期，仍然能提供有價值的回答**。

## 資料來源的優先級

不是所有資料都一樣難取得，按取得難度排序：

**第一優先：結構化資料庫資料**

如果系統已經有業務資料庫，先把這些資料索引進去。攀岩社群的資料庫裡有路線、岩場資訊，這些直接轉成文件就能索引：

```typescript
async function bootstrapFromDatabase(env: Env): Promise<void> {
  // 把資料庫裡的路線資料批次索引
  const routes = await db.select().from(routesTable).all();

  for (const batch of chunk(routes, 50)) {
    await Promise.all(
      batch.map(route => indexDocument({
        id: `route-${route.id}`,
        content: formatRouteAsDocument(route),
        metadata: {
          type: 'route',
          crag_id: route.cragId,
          grade_numeric: route.gradeNumeric,
          route_type: route.routeType,
        },
      }, env))
    );
  }
}

function formatRouteAsDocument(route: Route): string {
  return `
    路線名稱：${route.name}
    岩場：${route.cragName}
    難度：${route.grade}
    類型：${route.routeType}
    描述：${route.description ?? ''}
    注意事項：${route.notes ?? ''}
  `.trim();
}
```

幾百條路線的資料庫，幾分鐘就能完成初始索引。

**第二優先：公開資料爬取**

攀岩社群有公開的資源（8a.nu、theCrag、Mountain Project），看起來可以爬來補基礎資料。但**先讀 robots.txt 和使用條款再動手**，而且要知道現在的規範已經不只是「能不能爬」，還包含「爬了能不能餵給 AI」：

- Mountain Project 的 robots.txt 對一般 crawler 設了 `Crawl-delay: 60`，並封掉一批路徑；照這個節奏爬，速度會比你預期慢非常多。
- theCrag 的 robots.txt 採用 [Content Signals](https://contentsignals.org/) 宣告，完整內容是 `search=yes,ai-train=no,use=reference`——允許被搜尋引擎索引、明確不同意拿去訓練模型、允許作為參考來源引用。而且它不只靠訊號宣告，還直接用 `User-agent` 區塊硬擋 CCBot、ClaudeBot、GPTBot、Google-Extended 等爬蟲。
- 8a.nu 掛了 Cloudflare 的 bot 防護，預設的 curl User-Agent 連 robots.txt 都直接吃 403（`cf-mitigated: challenge`）；帶上瀏覽器 UA 就讀得到，所以不是非過 JS challenge 不可，但「預設就擋掉自動化流量」本身已經是明確訊號。

這些設定隨時會改，動手前自己抓一次 robots.txt 看當下的值，別照抄本文。真的需要大量資料，寫信要 API 或資料授權，比爬蟲省事也安全。

**第三優先：LLM 生成的合成資料**

如果真的沒有資料，可以用 LLM 生成「種子知識」：

```typescript
async function generateSeedKnowledge(topic: string): Promise<string[]> {
  const response = await llm.generate({
    prompt: `
      生成 10 條關於「${topic}」的攀岩知識，
      格式要像攀岩指南的描述，每條 50-100 字。
      這些資料會作為知識庫的初始內容。
    `,
  });

  return parseBulletPoints(response);
}

// 生成通用攀岩知識
await generateSeedKnowledge("運動攀登基礎技術");
await generateSeedKnowledge("傳攀保護系統");
await generateSeedKnowledge("抱石入門指南");
```

合成資料的品質不如真實資料，但比空知識庫好。這些資料未來會被真實資料取代。

**但有個紅線：安全相關的內容不要用合成資料。** 路線難度、保護點配置、固定點狀況、撤退路線這類資訊，LLM 生成出來的東西看起來很像真的，卻可能完全是編的；一旦進了索引，之後的檢索結果會把它當成和真實資料同等的證據引用出來，使用者也分不出來。合成資料只適合「通用知識」層級的內容（技術名詞解釋、入門觀念），而且**一定要在 metadata 打上來源標記**：

```typescript
metadata: {
  source: 'llm-synthetic',   // 之後可以整批下架、也可以在生成時降權
  generated_at: Date.now(),
}
```

有了這個標記，回答時可以標示「此段來自合成的通用知識」，也可以在真實資料進來後一鍵清掉整批。沒有標記的合成資料，一年後沒有人分得出哪些是編的。

## Graceful Degradation（優雅降級）

資料稀疏時，系統需要能「承認不足但仍然有幫助」：

```typescript
async function handleSparseContext(
  query: string,
  retrievedDocs: Document[],
  ctx: PipelineContext
): Promise<string> {

  if (retrievedDocs.length === 0) {
    // 完全沒資料：用 LLM 的通用知識回答，加免責聲明
    return generateWithDisclaimer(query, ctx, {
      disclaimer: "⚠️ 目前沒有找到相關資料，以下回答基於通用攀岩知識，請自行確認。",
    });
  }

  if (retrievedDocs.length < 3) {
    // 資料很少：回答但說明資料有限
    return generateWithDisclaimer(query, ctx, {
      disclaimer: "ℹ️ 目前相關資料有限，以下回答可能不完整。",
    });
  }

  // 正常回答
  return generate(query, retrievedDocs, ctx);
}
```

讓使用者知道系統的資料狀況，比靜默失敗或幻覺更誠實，也更有用。

## 進階索引策略

**增量索引**：有新資料時立刻索引，不等批次：

```typescript
// 新路線加入資料庫時，立刻索引
async function onRouteCreated(route: Route, ctx: ExecutionContext) {
  ctx.waitUntil(indexDocument(routeToDocument(route), env));
}
```

`ctx.waitUntil()` 讓索引在回應返回後繼續執行，不阻塞主請求。

**優先索引熱門資料**：資料多時，先索引最可能被查詢的：

```typescript
// 按瀏覽量排序，先索引熱門路線
const hotRoutes = await db
  .select()
  .from(routes)
  .orderBy(desc(routes.viewCount))
  .limit(500)
  .all();

await batchIndex(hotRoutes);
```

**使用者查詢驅動的索引**：當有人查詢某個尚未索引的資料時，觸發索引：

```typescript
// 查詢找不到結果時，記錄這個查詢
if (searchResults.length === 0) {
  await logMissingQuery(query, env);
  // 定期分析 missing query 日誌，決定優先補充哪些資料
}
```

## 資料品質 > 資料數量

冷啟動時常見的錯誤：急著索引大量低品質資料。

100 條高品質、結構完整的路線描述，比 1000 條只有路線名稱和難度的殘缺記錄更有用。RAG 的品質上限受限於資料品質，不是資料數量。

好的資料應該有：
- 完整的描述（不只是名稱和難度）
- 清晰的 metadata（類型、地點、難度數值化）
- 準確的資訊（沒有錯誤的難度標注、位置資訊）

## 整體來說

冷啟動是個工程問題，不是 RAG 演算法問題。解法很務實：先把現有的結構化資料索引進去，設計好優雅降級，讓使用者在資料稀疏時仍有合理體驗，然後靠使用量驅動資料的持續擴充。

最重要的是：**不要等資料完整才上線**。系統上線 → 使用者使用 → 找到資料缺口 → 補充資料，這個迴圈比預先準備完整資料庫更有效。

---

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [RAGSys: Item-Cold-Start Recommender as RAG System](https://arxiv.org/abs/2405.17587)
- [Adaptive Candidate Retrieval with Dynamic Knowledge Graph Construction for Cold-Start Recommendation](https://arxiv.org/abs/2505.20773)
- [From Zero-Shot Learning to Cold-Start Recommendation](https://arxiv.org/abs/1906.08511)
- [KnowTrace: Bootstrapping Iterative Retrieval-Augmented Generation with Structured Knowledge Tracing](https://arxiv.org/abs/2505.20245)
- [Content Signals（robots.txt 的 AI 使用宣告）](https://contentsignals.org/)
- [Cloudflare Workers：`ctx.waitUntil()`](https://developers.cloudflare.com/workers/runtime-apis/context/)
- [NobodyClimb 系統架構：Cloudflare 全端攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI 架構：20 節點 RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
