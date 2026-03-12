---
title: "RAG 冷啟動：沒有資料時怎麼讓系統能用"
date: 2026-03-12
category: ai
tags: [rag, cold-start, bootstrapping, indexing, data]
lang: zh-TW
tldr: "RAG 系統需要資料才能回答問題，但一開始就沒有資料。冷啟動策略決定了系統從空到可用的路徑。"
description: "RAG 冷啟動的設計策略：資料來源優先級、Bootstrap 索引建構、Graceful Degradation（優雅降級），以及如何讓系統在資料稀疏時仍然有用。"
draft: false
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

攀岩社群有公開的資源（8a.nu、theCrag、Mountain Project），可以爬取基礎資料作為補充。但要注意授權問題，確認使用條款允許此類用途。

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
